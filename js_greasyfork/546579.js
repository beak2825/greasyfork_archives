// ==UserScript==
// @name         ChatGPT Automation Pro
// @namespace    http://tampermonkey.net/
// @version      2.9
// @description  Advanced ChatGPT automation with dynamic templating
// @author       Henry Russell
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      *
// @run-at       document-end
// @inject-into  auto
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546579/ChatGPT%20Automation%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/546579/ChatGPT%20Automation%20Pro.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const CONFIG = {
    DEBUG_MODE: false,
    RESPONSE_TIMEOUT: 3000000,
    DEFAULT_VISIBLE: false,
    RUN_LOCK_TTL_MS: 15000,
    RUN_LOCK_RENEW_MS: 5000,
    BATCH_WAIT_TIME: 2000,
    AUTO_REMOVE_PROCESSED: false,
    AUTO_SCROLL_LOGS: true,
  };

  const state = {
    isLooping: false,
    dynamicElements: [],
    lastResponseElement: null,
    responseObserver: null,
    isMinimized: false,
    isDarkMode: false,
    uiVisible: CONFIG.DEFAULT_VISIBLE,
    headerObserverStarted: false,
    autoScrollLogs: CONFIG.AUTO_SCROLL_LOGS,
    batchWaitTime: CONFIG.BATCH_WAIT_TIME,
    autoRemoveProcessed: CONFIG.AUTO_REMOVE_PROCESSED,
    isProcessing: false,
    currentBatchIndex: 0,
    processedCount: 0,
    chainDefinition: null,
    runLockId: null,
    runLockTimer: null,
    userLanguage: 'en',
  };

  const STORAGE_KEYS = {
    messageInput: 'messageInput',
    templateInput: 'templateInput',
    dynamicElementsInput: 'dynamicElementsInput',
    customCodeInput: 'customCodeInput',
    loop: 'looping',
    autoRemove: 'autoRemoveProcessed',
    autoScroll: 'autoScrollLogs',
    waitTime: 'batchWaitTime',
    stepWaitTime: 'stepWaitTime',
    activeTab: 'activeTab',
    uiState: 'uiState',
    chainDef: 'chain.definition',
    presetsTemplates: 'presets.templates',
    presetsChains: 'presets.chains',
    presetsResponseJS: 'presets.responseJS',
    presetsSteps: 'presets.steps',
    logHistory: 'log.history',
    logVisible: 'log.visible',
    runLockKey: 'chatgptAutomation.runLock',
    configDebug: 'config.debugMode',
    configTimeout: 'config.responseTimeout',
    configDefaultVisible: 'config.defaultVisible',
  };

  let ui = {
    mainContainer: null,
    statusIndicator: null,
    logContainer: null,
    progressBar: null,
    progressBarSub: null,
    resizeHandle: null,
    miniProgress: null,
    miniFill: null,
    miniLabel: null,
    miniSubProgress: null,
    miniSubFill: null,
    miniSubLabel: null,
  };

  // Small helpers to keep calls consistent
  const saveUIState = (immediate = false) => uiState.save(immediate);

  const utils = {
    log: (message, type = 'info') => {
      const now = new Date();
      const datePart = now.toLocaleDateString(undefined, { day: '2-digit', month: 'short' });
      const timePart = now.toLocaleTimeString();
      const timestamp = `${datePart} ${timePart}`;
      const translated = translator.translate(message);
      const logMessage = `[${timestamp}] ${translated}`;

      if (CONFIG.DEBUG_MODE) console.log(logMessage);

      if (ui.logContainer) {
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry log-${type}`;
        logEntry.textContent = logMessage;
        ui.logContainer.appendChild(logEntry);

        if (state.autoScrollLogs) {
          ui.logContainer.scrollTop = ui.logContainer.scrollHeight;
        }

        const entries = Array.from(ui.logContainer.querySelectorAll('.log-entry'));
        while (entries.length > 200) {
          const first = entries.shift();
          if (first?.parentNode) first.parentNode.removeChild(first);
        }
      }

      try {
        let history = GM_getValue(STORAGE_KEYS.logHistory, []);
        if (!Array.isArray(history)) history = [];
        history.push({ t: Date.now(), type, msg: logMessage });
        if (history.length > 300) history = history.slice(-300);
        GM_setValue(STORAGE_KEYS.logHistory, history);
      } catch {}
    },

    clip: (s, n = 300) => {
      try {
        const str = String(s ?? '');
        return str.length > n ? str.slice(0, n) + '…' : str;
      } catch {
        return '';
      }
    },

    detectDarkMode: () => {
      const html = document.documentElement;
      const body = document.body;
      return [
        html.classList.contains('dark'),
        body.classList.contains('dark'),
        html.getAttribute('data-theme') === 'dark',
        body.getAttribute('data-theme') === 'dark',
        getComputedStyle(body).backgroundColor.includes('rgb(0, 0, 0)') ||
          getComputedStyle(body).backgroundColor.includes('rgb(17, 24, 39)') ||
          getComputedStyle(body).backgroundColor.includes('rgb(31, 41, 55)'),
      ].some(Boolean);
    },

    detectUserLanguage: () => {
      try {
        const langAttr = (
          document.documentElement.getAttribute('lang') ||
          navigator.language ||
          'en'
        ).toLowerCase();
        state.userLanguage = langAttr.split('-')[0];
        return state.userLanguage;
      } catch {
        state.userLanguage = 'en';
        return 'en';
      }
    },

    saveToStorage: (key, value) => {
      try {
        GM_setValue(key, value);
      } catch {}
    },

    sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),

    getByPath: (obj, path) => {
      try {
        return path.split('.').reduce((acc, part) => acc?.[part], obj);
      } catch {
        return undefined;
      }
    },

    queryFirst: (selectors) => {
      for (const s of selectors) {
        const el = document.querySelector(s);
        if (el) return el;
      }
      return null;
    },

    setSafeHTML: (el, html) => {
      const template = document.createElement('template');
      template.innerHTML = html;
      template.content
        .querySelectorAll('script, iframe, object, embed')
        .forEach((e) => e.remove());
      const walker = document.createTreeWalker(
        template.content,
        NodeFilter.SHOW_ELEMENT
      );
      while (walker.nextNode()) {
        const node = walker.currentNode;
        [...node.attributes].forEach((attr) => {
          if (/^on/i.test(attr.name)) node.removeAttribute(attr.name);
        });
      }
      el.replaceChildren(template.content);
    },

    loadFromStorage: (key, def) => {
      try {
        return GM_getValue(key, def);
      } catch {
        return def;
      }
    },
  };

  const http = {
    request: (opts) =>
      new Promise((resolve, reject) => {
        try {
          const {
            method = 'GET',
            url,
            headers = {},
            data,
            responseType = 'text',
            timeout = 30000,
          } = opts || {};
          if (!url) throw new Error('Missing url');
          GM_xmlhttpRequest({
            method,
            url,
            headers,
            data,
            responseType,
            timeout,
            anonymous: false,
            onload: (res) => resolve(res),
            onerror: (err) => {
              try {
                const msg = err?.error || err?.message || 'Network error';
                reject(new Error(msg));
              } catch {
                reject(new Error('Network error'));
              }
            },
            ontimeout: () => reject(new Error('Request timeout')),
          });
        } catch (e) {
          reject(e);
        }
      }),
    postForm: (url, formObj, extraHeaders = {}) => {
      const body = Object.entries(formObj || {})
        .map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(String(v)))
        .join('&');
      return http.request({
        method: 'POST',
        url,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          ...extraHeaders,
        },
        data: body,
      });
    },
    postMultipart: (url, formObj, extraHeaders = {}) => {
      return http.postForm(url, formObj, extraHeaders);
    },
  };

    const translations = {
  "sq": {
    "Automation": "Automatizim",
    "Open Automation": "Hap Automatizimin",
    "Batch progress": "Përparimi i grupit",
    "Inner batch progress": "Përparimi i brendshëm i grupit",
    "Ready": "Gati",
    "Show/Hide Log": "Shfaq/Fshih Regjistrin",
    "Minimize": "Minimizo",
    "Close": "Mbyll",
    "Composer": "Kompozitor",
    "Settings": "Cilësimet",
    "Composer Canvas:": "Kanavaca e Kompozitorit",
    "Preset name": "Emri i paracaktuar",
    "Select preset...": "Zgjidh një paracaktim...",
    "Message": "Mesazh",
    "Send": "Dërgo",
    "Template": "Model",
    "Dynamic Elements": "Elemente dinamike",
    "Response (JS)": "Përgjigje (JS)",
    "Validate Chain": "Valimoni zinxhirin",
    "Run Chain": "Zinxhir",
    "Stop": "Ndaloj",
    "Visual editor for multi-step automation chains. Steps connect in sequence; supports templates and custom JavaScript execution.": "Redaktor Vizual për zinxhirët e automatizmit me shumë hapa. ",
    "Dynamic Elements (List, JSON, or function)": "Elementet dinamike (Lista, JSON, ose Funksioni)",
    "Chain JSON (advanced):": "Zinxhiri JSON (i Avancuar):",
    "Debug mode:": "Mënyra e debugimit:",
    "Enable debug logging": "Aktivizo prerjet e debugimit",
    "Batch settings:": "Cilësimet e grupeve:",
    "Process all items in batch": "Përpunoni të gjitha artikujt në grumbull",
    "Remove processed items from queue": "Hiqni artikujt e përpunuar nga radha",
    "Wait between items (ms):": "Prisni midis artikujve (MS):",
    "Wait between steps (ms):": "Prisni midis hapave (MS):",
    "Open in new chat before this step": "Hapni në bisedë të re para këtij hapi",
    "Message Template": "Shablloni i mesazhit",
    "Template with placeholders like {{item}}, {{index}}, {{total}} or {steps.stepId.data}...": "Shabllon me mbajtës të vendeve si {{artikull}}, {{indeks}}, {{total}} ose {haps.stepid.data} ...",
    "Dynamic Elements (JSON/function). Supports {placeholders}.": "Elementet dinamike (JSON/Funksioni). ",
    "Use chain.dynamicElements as elements": "Përdorni zinxhirin.dynamicelements si elemente",
    "Batch processing: {{item}} for current item, {steps.stepId.response} for previous step data": "Përpunimi i serisë: {{Artikulli}} për artikullin aktual, {hapat.Stepid.Response} për të dhënat e hapit të mëparshëm",
    "HTTP Request": "Kërkesa HTTP",
    "Format JSON": "Formati json",
    "Request body: {steps.stepId.response} or JSON data": "Trupi i kërkesës: {haps.stepid.Response} ose JSON të dhëna",
    "Access response with {steps.thisStepId.data} or {steps.thisStepId.status}. Use previous step data in URL/headers/body.": "Përgjigja e hyrjes me {hapa.thisStepid.data} ose {hapa.thisStepid.Status}. ",
    "JavaScript Code": "Kodin e JavaScript",
    "Access step data with <code>steps.stepId.data</code> or <code>steps.stepId.response</code>. Use <code>http</code> for API calls, <code>utils.log()</code> for output.": "Hapni të dhënat e hapit me <code> hapa.stepid.data </code> ose <code> hapa.stepid.response </code>. ",
    "Next step": "Hapi tjetër",
    "Edit Step": "Redakto hapin",
    "Edit step": "Redakto hapin",
    "Delete step": "Fshi hapin",
    "UI initialized successfully": "UI inicializohet me sukses",
    "Initializing ChatGPT Automation Pro...": "Inicializimi i Automatizimit të CHATGPT PRO ...",
    "UI closed": "UI e mbyllur"
  },
  "am": {
    "Automation": "አውቶሜሽን",
    "Open Automation": "አውቶሜሽን ክፈት",
    "Batch progress": "የቡድን እድገት",
    "Inner batch progress": "የውስጥ ቡድን እድገት",
    "Ready": "ዝግጁ",
    "Show/Hide Log": "መዝገብ አሳይ/ደብቅ",
    "Minimize": "ቀንስ",
    "Close": "ዝጋ",
    "Composer": "ደራሲ",
    "Settings": "ቅንብሮች",
    "Composer Canvas:": "የደራሲ ካንቫስ",
    "Preset name": "የቀድሞ ስም",
    "Select preset...": "ቀድሞ የተዘጋጀውን ምረጥ...",
    "Message": "መልእክት",
    "Send": "ላክ",
    "Template": "አብነት",
    "Dynamic Elements": "ተለዋዋጭ ንጥሎች",
    "Response (JS)": "ምላሽ (JS)",
    "Validate Chain": "ማረጋገጫ ሰንሰለት",
    "Run Chain": "ሰንሰለት አሂድ",
    "Stop": "ተወ",
    "Visual editor for multi-step automation chains. Steps connect in sequence; supports templates and custom JavaScript execution.": "ባለብዙ ደረጃ ራስ-ሰር ሰንሰለቶች የእይታ አርታ editor. ",
    "Dynamic Elements (List, JSON, or function)": "ተለዋዋጭ አካላት (ዝርዝር, JSON ወይም ተግባር)",
    "Chain JSON (advanced):": "ሰንሰለት json (የላቀ)",
    "Debug mode:": "የማረም ሁኔታ: -",
    "Enable debug logging": "የመርከብ ምዝገባን ያንቁ",
    "Batch settings:": "የቡድን ቅንብሮች",
    "Process all items in batch": "ሁሉንም ዕቃዎች በቡድን ውስጥ ያካሂዱ",
    "Remove processed items from queue": "የተስተካከሉ እቃዎችን ከርዌል ያስወግዱ",
    "Wait between items (ms):": "በእቃዎች (ኤምኤስ) መካከል ይጠብቁ",
    "Wait between steps (ms):": "በደረጃዎች መካከል ይጠብቁ (ኤም.ኤስ.)",
    "Open in new chat before this step": "ከዚህ ደረጃ በፊት በአዳዲስ ውይይት ይክፈቱ",
    "Message Template": "የመልእክት አብነት",
    "Template with placeholders like {{item}}, {{index}}, {{total}} or {steps.stepId.data}...": "መለጠፊያ እንደ {{ንጥል}}, {{Exieft}}, {{አጠቃላይ}} ወይም {ደረጃዎች.Setepid.data} ...",
    "Dynamic Elements (JSON/function). Supports {placeholders}.": "ተለዋዋጭ አካላት (JSON / ተግባር). ",
    "Use chain.dynamicElements as elements": "እንደ ንጥረ ነገሮች እንደ ሰንሰለት. ሰንሰለት.",
    "Batch processing: {{item}} for current item, {steps.stepId.response} for previous step data": "የ Batch ማቀነባበሪያ: - {{ን ዕቃ}} ለአሁኑ ንጥል, {ደረጃዎች.Setepid.ssponsponse}} ለቀድሞ የድርድር ውሂብ",
    "HTTP Request": "የኤች ቲ ቲ ፒ ጥያቄ",
    "Format JSON": "ቅርጸት JSSON",
    "Request body: {steps.stepId.response} or JSON data": "የጥያቄ ሰውነት: - {አንቀሳዎች.Setepid.setponse} ወይም የጄሰን ውሂብ",
    "Access response with {steps.thisStepId.data} or {steps.thisStepId.status}. Use previous step data in URL/headers/body.": "ምላሽ በመስጠት. ",
    "JavaScript Code": "ጃቫስክሪፕት ኮድ",
    "Access step data with <code>steps.stepId.data</code> or <code>steps.stepId.response</code>. Use <code>http</code> for API calls, <code>utils.log()</code> for output.": "የእግዶች> ከ <Add> ደረጃዎች.Setspid.Stepid.Stepid.sta> ወይም <ኮድ> ደረጃዎች> ደረጃዎች.Setepid.stepid.ssponsp.ssponse </ CODE> ",
    "Next step": "ቀጣይ ደረጃ",
    "Edit Step": "ደረጃን ያርትዑ",
    "Edit step": "ደረጃን ያርትዑ",
    "Delete step": "እርምጃ ሰርዝ",
    "UI initialized successfully": "UI በተሳካ ሁኔታ ተጀመረ",
    "Initializing ChatGPT Automation Pro...": "የውይይት አውቶማቲክ Pro የመጀመር",
    "UI closed": "ኡይ ተዘግቷል"
  },
  "ar": {
    "Automation": "أتمتة",
    "Open Automation": "افتح الأتمتة",
    "Batch progress": "تقدم الدفعة",
    "Inner batch progress": "تقدم الدفعة الداخلية",
    "Ready": "جاهز",
    "Show/Hide Log": "إظهار/إخفاء السجل",
    "Minimize": "تصغير",
    "Close": "إغلاق",
    "Composer": "المؤلف",
    "Settings": "الإعدادات",
    "Composer Canvas:": "لوحة المؤلف",
    "Preset name": "اسم الإعداد المسبق",
    "Select preset...": "اختر إعداداً مسبقاً...",
    "Message": "رسالة",
    "Send": "إرسال",
    "Template": "قالب",
    "Dynamic Elements": "عناصر ديناميكية",
    "Response (JS)": "الاستجابة (JS)",
    "Validate Chain": "سلسلة التحقق من صحة",
    "Run Chain": "سلسلة تشغيل",
    "Stop": "قف",
    "Visual editor for multi-step automation chains. Steps connect in sequence; supports templates and custom JavaScript execution.": "محرر مرئي لسلاسل الأتمتة متعددة الخطوات. ",
    "Dynamic Elements (List, JSON, or function)": "العناصر الديناميكية (قائمة ، JSON ، أو وظيفة)",
    "Chain JSON (advanced):": "سلسلة JSON (متقدم):",
    "Debug mode:": "وضع التصحيح:",
    "Enable debug logging": "تمكين تسجيل التصحيح",
    "Batch settings:": "إعدادات الدُفعات:",
    "Process all items in batch": "معالجة جميع العناصر في الدفعة",
    "Remove processed items from queue": "إزالة العناصر المعالجة من قائمة الانتظار",
    "Wait between items (ms):": "انتظر بين العناصر (MS):",
    "Wait between steps (ms):": "انتظر بين الخطوات (MS):",
    "Open in new chat before this step": "افتح في دردشة جديدة قبل هذه الخطوة",
    "Message Template": "قالب الرسالة",
    "Template with placeholders like {{item}}, {{index}}, {{total}} or {steps.stepId.data}...": "قالب مع أصحاب نائبة مثل {{item}} ، {{index}} ، {{total}} أو {steps.stepid.data} ...",
    "Dynamic Elements (JSON/function). Supports {placeholders}.": "العناصر الديناميكية (JSON/وظيفة). ",
    "Use chain.dynamicElements as elements": "استخدم chain.dynamicelements كعناصر",
    "Batch processing: {{item}} for current item, {steps.stepId.response} for previous step data": "معالجة الدُفعات: {{item}} للعنصر الحالي ، {steps.stepid.response} لبيانات الخطوة السابقة",
    "HTTP Request": "طلب HTTP",
    "Format JSON": "تنسيق json",
    "Request body: {steps.stepId.response} or JSON data": "طلب الجسم: {steps.stepid.response} أو بيانات JSON",
    "Access response with {steps.thisStepId.data} or {steps.thisStepId.status}. Use previous step data in URL/headers/body.": "استجابة الوصول مع {steps.thisstepid.data} أو {steps.thisstepid.status}. ",
    "JavaScript Code": "رمز JavaScript",
    "Access step data with <code>steps.stepId.data</code> or <code>steps.stepId.response</code>. Use <code>http</code> for API calls, <code>utils.log()</code> for output.": "Access Step Data باستخدام <code> Steps.Stepid.data </code> أو <code> Steps.Stepid.Response </code>. ",
    "Next step": "الخطوة التالية",
    "Edit Step": "تحرير الخطوة",
    "Edit step": "تحرير الخطوة",
    "Delete step": "حذف الخطوة",
    "UI initialized successfully": "تهيئة واجهة المستخدم بنجاح",
    "Initializing ChatGPT Automation Pro...": "تهيئة ChatGPT Automation Pro ...",
    "UI closed": "واجهة المستخدم مغلقة"
  },
  "hy": {
    "Automation": "Ավտոմատացում",
    "Open Automation": "Բացել ավտոմատացումը",
    "Batch progress": "Խմբաքանակի առաջընթաց",
    "Inner batch progress": "Ներքին խմբաքանակի առաջընթաց",
    "Ready": "Պատրաստ",
    "Show/Hide Log": "Ցույց տալ/Թաքցնել մատյանը",
    "Minimize": "Մանրացնել",
    "Close": "Փակել",
    "Composer": "Կոմպոզիտոր",
    "Settings": "Կարգավորումներ",
    "Composer Canvas:": "Կոմպոզիտորի կտավ",
    "Preset name": "Նախապես սահմանված անուն",
    "Select preset...": "Ընտրել նախադրվածը...",
    "Message": "Հաղորդագրություն",
    "Send": "Ուղարկել",
    "Template": "Կաղապար",
    "Dynamic Elements": "Դինամիկ տարրեր",
    "Response (JS)": "Պատասխան (JS)",
    "Validate Chain": "Վավերացրեք շղթան",
    "Run Chain": "Վազել շղթա",
    "Stop": "Կանգ առնել",
    "Visual editor for multi-step automation chains. Steps connect in sequence; supports templates and custom JavaScript execution.": "Տեսողական խմբագիր `բազմաբնույթ ավտոմատացման ցանցերի համար: ",
    "Dynamic Elements (List, JSON, or function)": "Դինամիկ տարրեր (ցուցակ, JSSON կամ գործառույթ)",
    "Chain JSON (advanced):": "Chain JSON (Ընդլայնված).",
    "Debug mode:": "Կարգավիճակի ռեժիմ.",
    "Enable debug logging": "Միացնել կարգաբերման անտառահատումները",
    "Batch settings:": "Փաթեթավորման պարամետրեր.",
    "Process all items in batch": "Գործընթացը մշակել խմբաքանակի մեջ",
    "Remove processed items from queue": "Հեռացրեք վերամշակված իրերը հերթից",
    "Wait between items (ms):": "Սպասեք իրերի միջեւ (MS).",
    "Wait between steps (ms):": "Սպասեք քայլերի միջեւ (MS).",
    "Open in new chat before this step": "Այս քայլից առաջ բացեք նոր զրույցի մեջ",
    "Message Template": "Հաղորդագրությունների ձեւանմուշ",
    "Template with placeholders like {{item}}, {{index}}, {{total}} or {steps.stepId.data}...": "Կաղապար, ինչպիսիք են {{կետը}}}, {{{}}}, {{total}} կամ {քայլեր: stepid.data} ...",
    "Dynamic Elements (JSON/function). Supports {placeholders}.": "Դինամիկ տարրեր (JSON / FUNCTION): ",
    "Use chain.dynamicElements as elements": "Օգտագործեք շղթա: Երկարություն որպես տարրեր",
    "Batch processing: {{item}} for current item, {steps.stepId.response} for previous step data": "Փաթեթավորման մշակում. {{Կետ} ընթացիկ իրերի համար.",
    "HTTP Request": "HTTP հարցում",
    "Format JSON": "Ձեւաչափ JSON",
    "Request body: {steps.stepId.response} or JSON data": "Հայցեք մարմինը. {Քայլեր. Estepid.Response} կամ JSON տվյալ",
    "Access response with {steps.thisStepId.data} or {steps.thisStepId.status}. Use previous step data in URL/headers/body.": "Մուտքի պատասխան {քայլերով .Thisstepid.data} կամ {քայլեր: ",
    "JavaScript Code": "JavaScript կոդ",
    "Access step data with <code>steps.stepId.data</code> or <code>steps.stepId.response</code>. Use <code>http</code> for API calls, <code>utils.log()</code> for output.": "Մուտք գործեք Քայլի տվյալներ <code> thast.stepid.data </ ​​Կոդ> Կամ <Կոդ> Քայլեր. ",
    "Next step": "Հաջորդ քայլը",
    "Edit Step": "Խմբագրել քայլը",
    "Edit step": "Խմբագրել քայլը",
    "Delete step": "Delete նջել քայլը",
    "UI initialized successfully": "UI- ն հաջողությամբ նախաձեռնում էր",
    "Initializing ChatGPT Automation Pro...": "Նախաձեռնող chatgpt ավտոմատացման Pro ...",
    "UI closed": "UI- ն փակ է"
  },
  "bn": {
    "Automation": "স্বয়ংক্রিয়করণ",
    "Open Automation": "স্বয়ংক্রিয়করণ খুলুন",
    "Batch progress": "ব্যাচ অগ্রগতি",
    "Inner batch progress": "অভ্যন্তরীণ ব্যাচ অগ্রগতি",
    "Ready": "প্রস্তুত",
    "Show/Hide Log": "লগ দেখান/লুকান",
    "Minimize": "ছোট করুন",
    "Close": "বন্ধ করুন",
    "Composer": "কম্পোজার",
    "Settings": "সেটিংস",
    "Composer Canvas:": "কম্পোজার ক্যানভাস",
    "Preset name": "প্রিসেট নাম",
    "Select preset...": "প্রিসেট নির্বাচন করুন...",
    "Message": "বার্তা",
    "Send": "পাঠান",
    "Template": "টেমপ্লেট",
    "Dynamic Elements": "গতিশীল উপাদান",
    "Response (JS)": "প্রতিক্রিয়া (JS)",
    "Validate Chain": "যাচাই চেইন",
    "Run Chain": "রান চেইন",
    "Stop": "থামুন",
    "Visual editor for multi-step automation chains. Steps connect in sequence; supports templates and custom JavaScript execution.": "মাল্টি-স্টেপ অটোমেশন চেইনের জন্য ভিজ্যুয়াল সম্পাদক। ",
    "Dynamic Elements (List, JSON, or function)": "গতিশীল উপাদান (তালিকা, json বা ফাংশন)",
    "Chain JSON (advanced):": "চেইন জসন (উন্নত):",
    "Debug mode:": "ডিবাগ মোড:",
    "Enable debug logging": "ডিবাগ লগিং সক্ষম করুন",
    "Batch settings:": "ব্যাচের সেটিংস:",
    "Process all items in batch": "ব্যাচে সমস্ত আইটেম প্রক্রিয়া করুন",
    "Remove processed items from queue": "সারি থেকে প্রক্রিয়াজাত আইটেমগুলি সরান",
    "Wait between items (ms):": "আইটেমগুলির মধ্যে অপেক্ষা করুন (এমএস):",
    "Wait between steps (ms):": "পদক্ষেপের মধ্যে অপেক্ষা করুন (এমএস):",
    "Open in new chat before this step": "এই পদক্ষেপের আগে নতুন চ্যাটে খুলুন",
    "Message Template": "বার্তা টেম্পলেট",
    "Template with placeholders like {{item}}, {{index}}, {{total}} or {steps.stepId.data}...": "{{আইটেম}}, {{সূচক}}, {{মোট}} বা {ধাপে stepssepid.data} ... এর মতো স্থানধারীদের সাথে টেমপ্লেট",
    "Dynamic Elements (JSON/function). Supports {placeholders}.": "গতিশীল উপাদান (জেএসএন/ফাংশন)। ",
    "Use chain.dynamicElements as elements": "উপাদান হিসাবে চেইন.ডাইনামিকিমেন্টস ব্যবহার করুন",
    "Batch processing: {{item}} for current item, {steps.stepId.response} for previous step data": "ব্যাচ প্রসেসিং: বর্তমান আইটেমের জন্য {{আইটেম}} পূর্ববর্তী পদক্ষেপের ডেটার জন্য {ধাপগুলি.স্টিপিড.প্রেসন}",
    "HTTP Request": "HTTP অনুরোধ",
    "Format JSON": "ফর্ম্যাট জসন",
    "Request body: {steps.stepId.response} or JSON data": "অনুরোধ বডি: {ধাপগুলি.স্টিপিড.সেসস} বা জসন ডেটা",
    "Access response with {steps.thisStepId.data} or {steps.thisStepId.status}. Use previous step data in URL/headers/body.": "{ধাপগুলির সাথে অ্যাক্সেস প্রতিক্রিয়া { ",
    "JavaScript Code": "জাভাস্ক্রিপ্ট কোড",
    "Access step data with <code>steps.stepId.data</code> or <code>steps.stepId.response</code>. Use <code>http</code> for API calls, <code>utils.log()</code> for output.": "<কোড> স্টেপস। ",
    "Next step": "পরবর্তী পদক্ষেপ",
    "Edit Step": "সম্পাদনা পদক্ষেপ",
    "Edit step": "সম্পাদনা পদক্ষেপ",
    "Delete step": "পদক্ষেপ মুছুন",
    "UI initialized successfully": "ইউআই সাফল্যের সাথে শুরু করেছে",
    "Initializing ChatGPT Automation Pro...": "চ্যাটজিপিটি অটোমেশন প্রো শুরু করে ...",
    "UI closed": "ইউআই বন্ধ"
  },
  "bs": {
    "Automation": "Automatizacija",
    "Open Automation": "Otvori automatizaciju",
    "Batch progress": "Napredak serije",
    "Inner batch progress": "Unutarnji napredak serije",
    "Ready": "Spremno",
    "Show/Hide Log": "Prikaži/Sakrij dnevnik",
    "Minimize": "Smanji",
    "Close": "Zatvori",
    "Composer": "Sastavljač",
    "Settings": "Postavke",
    "Composer Canvas:": "Platno sastavljača",
    "Preset name": "Naziv preseta",
    "Select preset...": "Odaberi preset...",
    "Message": "Poruka",
    "Send": "Pošalji",
    "Template": "Predložak",
    "Dynamic Elements": "Dinamički elementi",
    "Response (JS)": "Odgovor (JS)",
    "Validate Chain": "Provjeri lanac",
    "Run Chain": "Pokrenuti lanac",
    "Stop": "Prestati",
    "Visual editor for multi-step automation chains. Steps connect in sequence; supports templates and custom JavaScript execution.": "Vizuelni uređivač za lance za automatizaciju sa više koraka. ",
    "Dynamic Elements (List, JSON, or function)": "Dinamički elementi (lista, json ili funkcija)",
    "Chain JSON (advanced):": "Lanac JSON (napredno):",
    "Debug mode:": "Režim pogrešaka:",
    "Enable debug logging": "Omogući evidentiranje pogrešaka",
    "Batch settings:": "Postavke paketa:",
    "Process all items in batch": "Obradite sve stavke u seriji",
    "Remove processed items from queue": "Uklonite prerađene predmete iz reda",
    "Wait between items (ms):": "Pričekajte između predmeta (MS):",
    "Wait between steps (ms):": "Pričekajte između koraka (MS):",
    "Open in new chat before this step": "Otvorite u novom chatu prije ovog koraka",
    "Message Template": "Predložak poruke",
    "Template with placeholders like {{item}}, {{index}}, {{total}} or {steps.stepId.data}...": "Predložak sa držačima rezervi poput {{Item}}, {{Index}}, {{total}} ili {ops.stepid.data} ...",
    "Dynamic Elements (JSON/function). Supports {placeholders}.": "Dinamički elementi (JSON / funkcija). ",
    "Use chain.dynamicElements as elements": "Koristite lanac.dyniclements kao elemente",
    "Batch processing: {{item}} for current item, {steps.stepId.response} for previous step data": "Obrada serije: {{Item}} za trenutni predmet, {maxs.stepid.response} za prethodne korake Podaci",
    "HTTP Request": "HTTP zahtjev",
    "Format JSON": "Format JSON",
    "Request body: {steps.stepId.response} or JSON data": "Zatražite tijelo: {maxs.stepid.ressponse} ili JSON podaci",
    "Access response with {steps.thisStepId.data} or {steps.thisStepId.status}. Use previous step data in URL/headers/body.": "Odgovor pristupa sa {steps.thisstepid.data} ili {ops.thisstepid.status}. ",
    "JavaScript Code": "JavaScript kod",
    "Access step data with <code>steps.stepId.data</code> or <code>steps.stepId.response</code>. Use <code>http</code> for API calls, <code>utils.log()</code> for output.": "Podaci o koraku sa <code> steps.stepid.data </ ​​code> ili <code> steps.stepid.ressponse </ code>. ",
    "Next step": "Sljedeći korak",
    "Edit Step": "Uređivanje koraka",
    "Edit step": "Uređivanje koraka",
    "Delete step": "Izbriši korak",
    "UI initialized successfully": "Ui se inicijalizira uspješno",
    "Initializing ChatGPT Automation Pro...": "Inicijalizacija chatgpt automatizacije Pro ...",
    "UI closed": "Ui zatvoren"
  },
  "bg": {
    "Automation": "Автоматизация",
    "Open Automation": "Отвори автоматизацията",
    "Batch progress": "Напредък на партидата",
    "Inner batch progress": "Вътрешен напредък на партидата",
    "Ready": "Готово",
    "Show/Hide Log": "Покажи/Скрий дневника",
    "Minimize": "Минимизирай",
    "Close": "Затвори",
    "Composer": "Композитор",
    "Settings": "Настройки",
    "Composer Canvas:": "Платно на композитора",
    "Preset name": "Име на пресет",
    "Select preset...": "Изберете пресет...",
    "Message": "Съобщение",
    "Send": "Изпрати",
    "Template": "Шаблон",
    "Dynamic Elements": "Динамични елементи",
    "Response (JS)": "Отговор (JS)",
    "Validate Chain": "Валидирана верига",
    "Run Chain": "Верига за бягане",
    "Stop": "Спрете",
    "Visual editor for multi-step automation chains. Steps connect in sequence; supports templates and custom JavaScript execution.": "Визуален редактор за многоетапни вериги за автоматизация. ",
    "Dynamic Elements (List, JSON, or function)": "Динамични елементи (списък, JSON или функция)",
    "Chain JSON (advanced):": "Верига JSON (Advanced):",
    "Debug mode:": "Режим на отстраняване на грешки:",
    "Enable debug logging": "Активирайте регистрирането на грешки",
    "Batch settings:": "Настройки на партидите:",
    "Process all items in batch": "Обработете всички елементи в партида",
    "Remove processed items from queue": "Премахнете обработените елементи от опашката",
    "Wait between items (ms):": "Изчакайте между елементи (MS):",
    "Wait between steps (ms):": "Изчакайте между стъпки (MS):",
    "Open in new chat before this step": "Отворете в нов чат преди тази стъпка",
    "Message Template": "Шаблон за съобщения",
    "Template with placeholders like {{item}}, {{index}}, {{total}} or {steps.stepId.data}...": "Шаблон с заместители като {{item}}, {{index}}, {{total}} или {{steps.stepid.data} ...",
    "Dynamic Elements (JSON/function). Supports {placeholders}.": "Динамични елементи (JSON/функция). ",
    "Use chain.dynamicElements as elements": "Използвайте веригата.dynamicelements като елементи",
    "Batch processing: {{item}} for current item, {steps.stepId.response} for previous step data": "Партидна обработка: {{item}} за текущия елемент, {STEPS.STEPID.RESPONSE} За предишни данни за стъпка",
    "HTTP Request": "HTTP заявка",
    "Format JSON": "Формат JSON",
    "Request body: {steps.stepId.response} or JSON data": "Заявка тяло: {Steps.stepid.Response} или JSON данни",
    "Access response with {steps.thisStepId.data} or {steps.thisStepId.status}. Use previous step data in URL/headers/body.": "Отговор на достъп с {Steps.Thisstepid.data} или {Steps.Thisstepid.status}. ",
    "JavaScript Code": "JavaScript код",
    "Access step data with <code>steps.stepId.data</code> or <code>steps.stepId.response</code>. Use <code>http</code> for API calls, <code>utils.log()</code> for output.": "Данни за стъпка на достъп с <code> Steps.stepid.data </code> или <code> Steps.stepid.response </code>. ",
    "Next step": "Следваща стъпка",
    "Edit Step": "Редактиране на стъпка",
    "Edit step": "Редактиране на стъпка",
    "Delete step": "Изтриване на стъпка",
    "UI initialized successfully": "UI инициализира успешно",
    "Initializing ChatGPT Automation Pro...": "Инициализиране на Chatgpt Automation Pro ...",
    "UI closed": "UI затворен"
  },
  "my": {
    "Automation": "အလိုအလျောက်လုပ်ငန်း",
    "Open Automation": "အလိုအလျောက်စနစ်ကို ဖွင့်ပါ",
    "Batch progress": "အစုလိုက် တိုးတက်မှု",
    "Inner batch progress": "အတွင်းပိုင်း အစုလိုက် တိုးတက်မှု",
    "Ready": "ပြင်ဆင်ပြီး",
    "Show/Hide Log": "မှတ်တမ်း ပြ/ဖျောက်",
    "Minimize": "သေးစေ",
    "Close": "ပိတ်",
    "Composer": "ရေးသားသူ",
    "Settings": "ဆက်တင်များ",
    "Composer Canvas:": "ရေးသားသူ ကန်ဗတ်",
    "Preset name": "ကြိုသတ်မှတ်ထားသော နာမည်",
    "Select preset...": "ကြိုသတ်မှတ်ထားသောကို ရွေးပါ...",
    "Message": "မက်ဆေ့ခ်ျ",
    "Send": "ပို့",
    "Template": "ပုံစံ",
    "Dynamic Elements": "ဒိုင်နမစ် အရာဝတ္ထုများ",
    "Response (JS)": "တုံ့ပြန်ချက် (JS)",
    "Validate Chain": "ကွင်းဆက် validate",
    "Run Chain": "ကွင်းဆက်ပြေး",
    "Stop": "ရပ်",
    "Visual editor for multi-step automation chains. Steps connect in sequence; supports templates and custom JavaScript execution.": "Multi-step အလိုအလျောက်ချည်နှောင်မှုအတွက် Visual Editor ။ ",
    "Dynamic Elements (List, JSON, or function)": "Dynamic Element (List, JSONS, ဒါမှမဟုတ် function)",
    "Chain JSON (advanced):": "ကွင်းဆက်ဂျွန်ဆန် (အဆင့်မြင့်):",
    "Debug mode:": "Debug Mode:",
    "Enable debug logging": "Debug သစ်ထုတ်လုပ်ခြင်းကို Enable လုပ်ပါ",
    "Batch settings:": "အသုတ် settings:",
    "Process all items in batch": "အသုတ်အတွက်ပစ္စည်းများအားလုံး process",
    "Remove processed items from queue": "တန်းစီမှလုပ်ငန်းများ၌ပစ္စည်းများဖယ်ရှားပါ",
    "Wait between items (ms):": "ပစ္စည်းများ (MS) အကြားစောင့်ပါ။",
    "Wait between steps (ms):": "ခြေလှမ်းများအကြားစောင့်ပါ (MS):",
    "Open in new chat before this step": "ဤအဆင့်မတိုင်မီအသစ်တင်သောစကားဝိုင်းတွင်ဖွင့်ပါ",
    "Message Template": "မက်ဆေ့ခ်ျ template ကို",
    "Template with placeholders like {{item}}, {{index}}, {{total}} or {steps.stepId.data}...": "{{{{{index}} {{အညွှန်း}} {{temple}} {{template}} {{} {}} {{}} {}} {}}",
    "Dynamic Elements (JSON/function). Supports {placeholders}.": "dynamic element တွေကို (JSON / function) ။ ",
    "Use chain.dynamicElements as elements": "element တွေအနေနဲ့ကွင်းဆက် .DynicElement တွေကိုသုံးပါ",
    "Batch processing: {{item}} for current item, {steps.stepId.response} for previous step data": "အသုတ်အပြောင်းအလဲ - {{{}} လက်ရှိပစ္စည်းအတွက် {{}} {{item}} {spews.stepid.response}",
    "HTTP Request": "http တောင်းဆိုမှု",
    "Format JSON": "json format တို",
    "Request body: {steps.stepId.response} or JSON data": "LIFTORESS: {lems.stepid.respons} {lems.stepid.response} json data",
    "Access response with {steps.thisStepId.data} or {steps.thisStepId.status}. Use previous step data in URL/headers/body.": "{lems.thisstepid.data} သို့မဟုတ် {esse.thisstepid.status နှင့်အတူတုံ့ပြန်မှု။ ",
    "JavaScript Code": "JavaScript ကုဒ်",
    "Access step data with <code>steps.stepId.data</code> or <code>steps.stepId.response</code>. Use <code>http</code> for API calls, <code>utils.log()</code> for output.": "<code> steps.stepid.data </ ​​code> သို့မဟုတ် <code> steps.stepons.stepons.stepons.Stepons.Respons.Spons.StePeST.StePhits.StePeST.StePeST.StePeST.Respons.Respons.StePeStons.StePeSton.Stepons.Spons.StePeST.StePeST.StePeST.STEPKESS ။ ",
    "Next step": "နောက်တစ်ဆင့်",
    "Edit Step": "Edit ကို Edit ကိုနှိပ်ပါ",
    "Edit step": "Edit ကို Edit ကိုနှိပ်ပါ",
    "Delete step": "အဆင့်ကိုဖျက်ပါ",
    "UI initialized successfully": "ui အောင်မြင်စွာအစပြု",
    "Initializing ChatGPT Automation Pro...": "chatgpt အလိုအလျောက်အလိုအလျောက်ပရိုဂရမ်ကိုစတင်ရန် ...",
    "UI closed": "ui ပိတ်လိုက်တယ်"
  },
  "ca": {
    "Automation": "Automatització",
    "Open Automation": "Obre l'automatització",
    "Batch progress": "Progrés del lot",
    "Inner batch progress": "Progrés intern del lot",
    "Ready": "Preparat",
    "Show/Hide Log": "Mostra/Amaga el registre",
    "Minimize": "Minimitza",
    "Close": "Tanca",
    "Composer": "Compositor",
    "Settings": "Configuració",
    "Composer Canvas:": "Canvas del compositor",
    "Preset name": "Nom del preset",
    "Select preset...": "Selecciona un preset...",
    "Message": "Missatge",
    "Send": "Envia",
    "Template": "Plantilla",
    "Dynamic Elements": "Elements dinàmics",
    "Response (JS)": "Resposta (JS)",
    "Validate Chain": "Validar la cadena",
    "Run Chain": "Cadena de correguda",
    "Stop": "Parar",
    "Visual editor for multi-step automation chains. Steps connect in sequence; supports templates and custom JavaScript execution.": "Editor visual per a cadenes d'automatització en diversos passos. ",
    "Dynamic Elements (List, JSON, or function)": "Elements dinàmics (llista, json o funció)",
    "Chain JSON (advanced):": "Cadena json (avançat):",
    "Debug mode:": "Mode de depuració:",
    "Enable debug logging": "Activa el registre de depuració",
    "Batch settings:": "Configuració del lot:",
    "Process all items in batch": "Processeu tots els elements del lot",
    "Remove processed items from queue": "Elimineu els elements processats de la cua",
    "Wait between items (ms):": "Espereu entre articles (MS):",
    "Wait between steps (ms):": "Espereu entre passos (MS):",
    "Open in new chat before this step": "Obriu -lo en xat nou abans d’aquest pas",
    "Message Template": "Plantilla de missatges",
    "Template with placeholders like {{item}}, {{index}}, {{total}} or {steps.stepId.data}...": "Plantilla amb els propietaris de llocs com {{item}}, {{index}}, {{total}} o {steps.stepid.data} ...",
    "Dynamic Elements (JSON/function). Supports {placeholders}.": "Elements dinàmics (JSON/Funció). ",
    "Use chain.dynamicElements as elements": "Utilitzeu Chain.DynamicElements com a elements",
    "Batch processing: {{item}} for current item, {steps.stepId.response} for previous step data": "Processament per lots: {{item}} per a l'element actual, {steps.stepid.response} per a dades de pas anteriors",
    "HTTP Request": "Sol·licitud HTTP",
    "Format JSON": "Format JSON",
    "Request body: {steps.stepId.response} or JSON data": "Cos de sol·licitud: {steps.stepid.response} o json dades",
    "Access response with {steps.thisStepId.data} or {steps.thisStepId.status}. Use previous step data in URL/headers/body.": "Resposta d'accés amb {StepS.thisStepid.data} o {steps.thisStepid.status}. ",
    "JavaScript Code": "Codi JavaScript",
    "Access step data with <code>steps.stepId.data</code> or <code>steps.stepId.response</code>. Use <code>http</code> for API calls, <code>utils.log()</code> for output.": "Accés dades de pas amb <code> steps.stepid.data </code> o <code> steps.stepid.response </code>. ",
    "Next step": "Següent pas",
    "Edit Step": "Editar",
    "Edit step": "Editar",
    "Delete step": "Suprimeix el pas",
    "UI initialized successfully": "La interfície d'usuari es va inicialitzar amb èxit",
    "Initializing ChatGPT Automation Pro...": "Inicialització de Chatgpt Automation Pro ...",
    "UI closed": "UI tancada"
  },
  "zh": {
    "Automation": "自动化",
    "Open Automation": "打开自动化",
    "Batch progress": "批处理进度",
    "Inner batch progress": "内部批处理进度",
    "Ready": "准备就绪",
    "Show/Hide Log": "显示/隐藏日志",
    "Minimize": "最小化",
    "Close": "关闭",
    "Composer": "编辑器",
    "Settings": "设置",
    "Composer Canvas:": "编辑器画布",
    "Preset name": "预设名称",
    "Select preset...": "选择预设...",
    "Message": "消息",
    "Send": "发送",
    "Template": "模板",
    "Dynamic Elements": "动态元素",
    "Response (JS)": "响应 (JS)",
    "Validate Chain": "验证链",
    "Run Chain": "运行链",
    "Stop": "停止",
    "Visual editor for multi-step automation chains. Steps connect in sequence; supports templates and custom JavaScript execution.": "多步自动化链的视觉编辑器。",
    "Dynamic Elements (List, JSON, or function)": "动态元素（列表，JSON或功能）",
    "Chain JSON (advanced):": "连锁JSON（高级）：",
    "Debug mode:": "调试模式：",
    "Enable debug logging": "启用调试记录",
    "Batch settings:": "批处理设置：",
    "Process all items in batch": "处理所有项目",
    "Remove processed items from queue": "从队列中删除已处理的项目",
    "Wait between items (ms):": "等待项目（MS）：",
    "Wait between steps (ms):": "在步骤之间等待（MS）：",
    "Open in new chat before this step": "在此步骤之前在新聊天中打开",
    "Message Template": "消息模板",
    "Template with placeholders like {{item}}, {{index}}, {{total}} or {steps.stepId.data}...": "具有{{item}}，{{index}}，{{total}}}或{steps.stepid.data} ...的占位符的模板。",
    "Dynamic Elements (JSON/function). Supports {placeholders}.": "动态元素（JSON/函数）。",
    "Use chain.dynamicElements as elements": "使用链条。",
    "Batch processing: {{item}} for current item, {steps.stepId.response} for previous step data": "批处理处理：{{item}}对于当前项目，{steps.stepid.response}用于上一个步骤数据",
    "HTTP Request": "HTTP请求",
    "Format JSON": "格式JSON",
    "Request body: {steps.stepId.response} or JSON data": "请求主体：{steps.stepid.response}或JSON数据",
    "Access response with {steps.thisStepId.data} or {steps.thisStepId.status}. Use previous step data in URL/headers/body.": "使用{steps.thisstepid.data}或{steps.thisstepid.status}的访问响应。",
    "JavaScript Code": "JavaScript代码",
    "Access step data with <code>steps.stepId.data</code> or <code>steps.stepId.response</code>. Use <code>http</code> for API calls, <code>utils.log()</code> for output.": "使用<code> steps.stepid.data </code>或<code> steps.stepid.response </code>访问步骤数据。",
    "Next step": "下一步",
    "Edit Step": "编辑步骤",
    "Edit step": "编辑步骤",
    "Delete step": "删除步骤",
    "UI initialized successfully": "UI成功初始化",
    "Initializing ChatGPT Automation Pro...": "初始化ChatGpt Automation Pro ...",
    "UI closed": "UI关闭"
  },
  "hr": {
    "Automation": "Automatizacija",
    "Open Automation": "Otvori automatizaciju",
    "Batch progress": "Napredak serije",
    "Inner batch progress": "Unutarnji napredak serije",
    "Ready": "Spremno",
    "Show/Hide Log": "Prikaži/Sakrij zapisnik",
    "Minimize": "Smanji",
    "Close": "Zatvori",
    "Composer": "Sastavljač",
    "Settings": "Postavke",
    "Composer Canvas:": "Platno sastavljača",
    "Preset name": "Naziv preseta",
    "Select preset...": "Odaberi preset...",
    "Message": "Poruka",
    "Send": "Pošalji",
    "Template": "Predložak",
    "Dynamic Elements": "Dinamički elementi",
    "Response (JS)": "Odgovor (JS)",
    "Validate Chain": "Lanac potvrditi",
    "Run Chain": "Lanac",
    "Stop": "Stop",
    "Visual editor for multi-step automation chains. Steps connect in sequence; supports templates and custom JavaScript execution.": "Vizualni uređivač za automatizacije s više koraka. ",
    "Dynamic Elements (List, JSON, or function)": "Dinamički elementi (popis, json ili funkcija)",
    "Chain JSON (advanced):": "Lanac JSON (napredno):",
    "Debug mode:": "Način uklanjanja pogrešaka:",
    "Enable debug logging": "Omogući zapisivanje uklanjanja pogrešaka",
    "Batch settings:": "Settings Settings:",
    "Process all items in batch": "Obradite sve stavke u seriji",
    "Remove processed items from queue": "Uklonite obrađene predmete iz reda",
    "Wait between items (ms):": "Pričekajte između stavki (MS):",
    "Wait between steps (ms):": "Pričekajte između koraka (MS):",
    "Open in new chat before this step": "Otvorite se u novom chatu prije ovog koraka",
    "Message Template": "Predložak poruke",
    "Template with placeholders like {{item}}, {{index}}, {{total}} or {steps.stepId.data}...": "Predložak s držačama kao {{stavka}}, {{index}}, {{total}} ili {steps.Stepid.Data} ...",
    "Dynamic Elements (JSON/function). Supports {placeholders}.": "Dinamički elementi (json/funkcija). ",
    "Use chain.dynamicElements as elements": "Koristite lanac.Dynamicelements kao elemente",
    "Batch processing: {{item}} for current item, {steps.stepId.response} for previous step data": "Batch obrada: {{stavka}} za trenutnu stavku, {steps.Stepid.Response} Za prethodne podatke",
    "HTTP Request": "HTTP zahtjev",
    "Format JSON": "Format JSON",
    "Request body: {steps.stepId.response} or JSON data": "Zahtjev za tijelo: {steps.Stepid.Response} ili JSON podaci",
    "Access response with {steps.thisStepId.data} or {steps.thisStepId.status}. Use previous step data in URL/headers/body.": "Odgovor pristupa s {steps.thisStepid.Data} ili {steps.thisStepid.status}. ",
    "JavaScript Code": "JavaScript kod",
    "Access step data with <code>steps.stepId.data</code> or <code>steps.stepId.response</code>. Use <code>http</code> for API calls, <code>utils.log()</code> for output.": "Podaci o koraku pristupite <code> steps.Stepid.Data </code> ili <code> Steps.Stepid.Response </code>. ",
    "Next step": "Sljedeći korak",
    "Edit Step": "Uredi korak",
    "Edit step": "Uredi korak",
    "Delete step": "Izbriši korak",
    "UI initialized successfully": "UI se uspješno inicijalizira",
    "Initializing ChatGPT Automation Pro...": "Inicijalizacija chatgpt automatizacije pro ...",
    "UI closed": "UI zatvoreno"
  },
  "cs": {
    "Automation": "Automatizace",
    "Open Automation": "Otevřít automatizaci",
    "Batch progress": "Postup dávky",
    "Inner batch progress": "Vnitřní postup dávky",
    "Ready": "Připraveno",
    "Show/Hide Log": "Zobrazit/Skrýt protokol",
    "Minimize": "Minimalizovat",
    "Close": "Zavřít",
    "Composer": "Editor",
    "Settings": "Nastavení",
    "Composer Canvas:": "Plátno editoru",
    "Preset name": "Název presetu",
    "Select preset...": "Vyberte preset...",
    "Message": "Zpráva",
    "Send": "Odeslat",
    "Template": "Šablona",
    "Dynamic Elements": "Dynamické prvky",
    "Response (JS)": "Odezva (JS)",
    "Validate Chain": "Ověřit řetězec",
    "Run Chain": "Běh řetězec",
    "Stop": "Zastávka",
    "Visual editor for multi-step automation chains. Steps connect in sequence; supports templates and custom JavaScript execution.": "Vizuální editor pro vícestupňové automatizační řetězce. ",
    "Dynamic Elements (List, JSON, or function)": "Dynamické prvky (seznam, JSON nebo funkce)",
    "Chain JSON (advanced):": "Řetězec JSON (Advanced):",
    "Debug mode:": "Režim ladění:",
    "Enable debug logging": "Povolit protokolování ladění",
    "Batch settings:": "Nastavení dávek:",
    "Process all items in batch": "Zpracovejte všechny položky v dávce",
    "Remove processed items from queue": "Odstraňte zpracované položky z fronty",
    "Wait between items (ms):": "Počkejte mezi položkami (MS):",
    "Wait between steps (ms):": "Počkejte mezi kroky (MS):",
    "Open in new chat before this step": "Otevřeno v novém chatu před tímto krokem",
    "Message Template": "Šablona zprávy",
    "Template with placeholders like {{item}}, {{index}}, {{total}} or {steps.stepId.data}...": "Šablona s zástupnými symboly jako {{item}}, {{index}}, {{total}} nebo {steps.stepid.data} ...",
    "Dynamic Elements (JSON/function). Supports {placeholders}.": "Dynamické prvky (JSON/Function). ",
    "Use chain.dynamicElements as elements": "Jako prvky používejte Chain.dynamicelements",
    "Batch processing: {{item}} for current item, {steps.stepId.response} for previous step data": "Dávkové zpracování: {{item}} pro aktuální položku, {Steps.Stepid.Response} pro předchozí data kroku",
    "HTTP Request": "Žádost HTTP",
    "Format JSON": "Formát JSON",
    "Request body: {steps.stepId.response} or JSON data": "Požadavek na tělo: {Steps.Stepid.Response} nebo JSON Data",
    "Access response with {steps.thisStepId.data} or {steps.thisStepId.status}. Use previous step data in URL/headers/body.": "Přístupová odpověď s {Steps.ThisStepid.Data} nebo {Steps.Thisstepid.status}. ",
    "JavaScript Code": "JavaScript Code",
    "Access step data with <code>steps.stepId.data</code> or <code>steps.stepId.response</code>. Use <code>http</code> for API calls, <code>utils.log()</code> for output.": "Přístupová data kroku s <code> kroky.Stepid.Data </code> nebo <code> Steps.Stepid.Response </code>. ",
    "Next step": "Další krok",
    "Edit Step": "Krok upravit",
    "Edit step": "Krok upravit",
    "Delete step": "Smazat krok",
    "UI initialized successfully": "UI inicializováno úspěšně",
    "Initializing ChatGPT Automation Pro...": "Inicializace chatgpt automatizace pro ...",
    "UI closed": "UI uzavřeno"
  },
  "da": {
    "Automation": "Automatisering",
    "Open Automation": "Åbn automatisering",
    "Batch progress": "Batchfremskridt",
    "Inner batch progress": "Indre batchfremskridt",
    "Ready": "Klar",
    "Show/Hide Log": "Vis/Skjul log",
    "Minimize": "Minimer",
    "Close": "Luk",
    "Composer": "Komponist",
    "Settings": "Indstillinger",
    "Composer Canvas:": "Komponistlærred",
    "Preset name": "Preset-navn",
    "Select preset...": "Vælg preset...",
    "Message": "Besked",
    "Send": "Send",
    "Template": "Skabelon",
    "Dynamic Elements": "Dynamiske elementer",
    "Response (JS)": "Svar (JS)",
    "Validate Chain": "Valider kæde",
    "Run Chain": "Kørkæde",
    "Stop": "Stop",
    "Visual editor for multi-step automation chains. Steps connect in sequence; supports templates and custom JavaScript execution.": "Visual Editor til multi-trin automatiseringskæder. ",
    "Dynamic Elements (List, JSON, or function)": "Dynamiske elementer (liste, JSON eller funktion)",
    "Chain JSON (advanced):": "Kæde JSON (Avanceret):",
    "Debug mode:": "Debug -tilstand:",
    "Enable debug logging": "Aktivér debug -logning",
    "Batch settings:": "Batchindstillinger:",
    "Process all items in batch": "Behandle alle varer i batch",
    "Remove processed items from queue": "Fjern forarbejdede genstande fra køen",
    "Wait between items (ms):": "Vent mellem varer (MS):",
    "Wait between steps (ms):": "Vent mellem trin (MS):",
    "Open in new chat before this step": "Åben i ny chat før dette trin",
    "Message Template": "Meddelelsesskabelon",
    "Template with placeholders like {{item}}, {{index}}, {{total}} or {steps.stepId.data}...": "Skabelon med pladsholdere som {{item}}, {{indeks}}, {{total}} eller {steps.Stepid.data} ...",
    "Dynamic Elements (JSON/function). Supports {placeholders}.": "Dynamiske elementer (JSON/funktion). ",
    "Use chain.dynamicElements as elements": "Brug kæde.Dynamikelementer som elementer",
    "Batch processing: {{item}} for current item, {steps.stepId.response} for previous step data": "Batchbehandling: {{item}} for nuværende vare, {steps.Stepid.Response} til tidligere trindata",
    "HTTP Request": "HTTP -anmodning",
    "Format JSON": "Format JSON",
    "Request body: {steps.stepId.response} or JSON data": "Anmodning om krop: {steps.Stepid.Response} eller JSON -data",
    "Access response with {steps.thisStepId.data} or {steps.thisStepId.status}. Use previous step data in URL/headers/body.": "Adgangsrespons med {trin. ThisStepid.Data} eller {steps.thisStepid.Status}. ",
    "JavaScript Code": "JavaScript -kode",
    "Access step data with <code>steps.stepId.data</code> or <code>steps.stepId.response</code>. Use <code>http</code> for API calls, <code>utils.log()</code> for output.": "Adgangstrindata med <code> step.Stepid.data </code> eller <code> step.Stepid.Response </code>. ",
    "Next step": "Næste trin",
    "Edit Step": "Rediger trin",
    "Edit step": "Rediger trin",
    "Delete step": "Slet trin",
    "UI initialized successfully": "UI -initialiseret med succes",
    "Initializing ChatGPT Automation Pro...": "Initialisering af ChatGPT Automation Pro ...",
    "UI closed": "UI lukket"
  },
  "nl": {
    "Automation": "Automatisering",
    "Open Automation": "Automatisering openen",
    "Batch progress": "Batchvoortgang",
    "Inner batch progress": "Interne batchvoortgang",
    "Ready": "Klaar",
    "Show/Hide Log": "Logboek tonen/verbergen",
    "Minimize": "Minimaliseren",
    "Close": "Sluiten",
    "Composer": "Componist",
    "Settings": "Instellingen",
    "Composer Canvas:": "Componistcanvas",
    "Preset name": "Voorinstelling naam",
    "Select preset...": "Selecteer voorinstelling...",
    "Message": "Bericht",
    "Send": "Verzenden",
    "Template": "Sjabloon",
    "Dynamic Elements": "Dynamische elementen",
    "Response (JS)": "Reactie (JS)",
    "Validate Chain": "Valideer de ketting",
    "Run Chain": "Run ketting",
    "Stop": "Stop",
    "Visual editor for multi-step automation chains. Steps connect in sequence; supports templates and custom JavaScript execution.": "Visuele editor voor automatiseringsketens met meerdere stappen. ",
    "Dynamic Elements (List, JSON, or function)": "Dynamische elementen (lijst, JSON of functie)",
    "Chain JSON (advanced):": "Chain JSON (Advanced):",
    "Debug mode:": "Debug -modus:",
    "Enable debug logging": "Schakel foutopsporingsregistratie in",
    "Batch settings:": "Batch -instellingen:",
    "Process all items in batch": "Verwerk alle items in batch",
    "Remove processed items from queue": "Verwijder bewerkte items uit de wachtrij",
    "Wait between items (ms):": "Wacht tussen items (MS):",
    "Wait between steps (ms):": "Wacht tussen stappen (MS):",
    "Open in new chat before this step": "Open in een nieuwe chat voor deze stap",
    "Message Template": "Berichtsjabloon",
    "Template with placeholders like {{item}}, {{index}}, {{total}} or {steps.stepId.data}...": "Template met placeholders zoals {{item}}, {{index}}, {{total}} of {stiefs.stepid.data} ...",
    "Dynamic Elements (JSON/function). Supports {placeholders}.": "Dynamische elementen (JSON/functie). ",
    "Use chain.dynamicElements as elements": "Gebruik ketting. Dynamicelements als elementen",
    "Batch processing: {{item}} for current item, {steps.stepId.response} for previous step data": "Batch -verwerking: {{Item}} voor het huidige item, {Steps.Stepid.Response} voor eerdere stapgegevens",
    "HTTP Request": "HTTP -verzoek",
    "Format JSON": "Formaat JSON",
    "Request body: {steps.stepId.response} or JSON data": "Request Body: {Steps.Stepid.Response} of JSON -gegevens",
    "Access response with {steps.thisStepId.data} or {steps.thisStepId.status}. Use previous step data in URL/headers/body.": "Toegang tot reactie met {Steps.TheSStepid.Data} of {Steps.TheSStepid.Status}. ",
    "JavaScript Code": "JavaScript -code",
    "Access step data with <code>steps.stepId.data</code> or <code>steps.stepId.response</code>. Use <code>http</code> for API calls, <code>utils.log()</code> for output.": "Toegang tot stappengegevens met <code> stappen.stepid.data </code> of <code> stappen.stepid.response </code>. ",
    "Next step": "Volgende stap",
    "Edit Step": "Stap bewerken",
    "Edit step": "Stap bewerken",
    "Delete step": "Stap verwijderen",
    "UI initialized successfully": "UI geïnitialiseerd met succes",
    "Initializing ChatGPT Automation Pro...": "Initialiseren van Chatgpt Automation Pro ...",
    "UI closed": "UI gesloten"
  },
  "et": {
    "Automation": "Automaatika",
    "Open Automation": "Ava automaatika",
    "Batch progress": "Partii edenemine",
    "Inner batch progress": "Sisemise partii edenemine",
    "Ready": "Valmis",
    "Show/Hide Log": "Näita/Peida logi",
    "Minimize": "Minimeeri",
    "Close": "Sulge",
    "Composer": "Koostaja",
    "Settings": "Seaded",
    "Composer Canvas:": "Koostaja lõuend",
    "Preset name": "Eelseadistuse nimi",
    "Select preset...": "Vali eelseadistus...",
    "Message": "Sõnum",
    "Send": "Saada",
    "Template": "Mall",
    "Dynamic Elements": "Dünaamilised elemendid",
    "Response (JS)": "Vastus (JS)",
    "Validate Chain": "Valideerima",
    "Run Chain": "Jooksukett",
    "Stop": "Peatus",
    "Visual editor for multi-step automation chains. Steps connect in sequence; supports templates and custom JavaScript execution.": "Mitmeastmeliste automatiseerimisahelate visuaalne toimetaja. ",
    "Dynamic Elements (List, JSON, or function)": "Dünaamilised elemendid (nimekiri, JSON või funktsioon)",
    "Chain JSON (advanced):": "Kett JSON (Advanced):",
    "Debug mode:": "Silumisrežiim:",
    "Enable debug logging": "Luba siluge logimine",
    "Batch settings:": "Partii sätted:",
    "Process all items in batch": "Töötle kõiki esemeid partiis",
    "Remove processed items from queue": "Eemaldage töödeldud üksused järjekorrast",
    "Wait between items (ms):": "Oodake esemete vahel (MS):",
    "Wait between steps (ms):": "Oodake sammude vahel (MS):",
    "Open in new chat before this step": "Avatud uues vestluses enne seda sammu",
    "Message Template": "Teadete mall",
    "Template with placeholders like {{item}}, {{index}}, {{total}} or {steps.stepId.data}...": "Mall koos kohahoidjatega nagu {{item}}, {{index}}, {{{total}} või {steps.stepid.data} ...",
    "Dynamic Elements (JSON/function). Supports {placeholders}.": "Dünaamilised elemendid (JSON/funktsioon). ",
    "Use chain.dynamicElements as elements": "Kasutage elementidena",
    "Batch processing: {{item}} for current item, {steps.stepId.response} for previous step data": "Partii töötlemine: {{item}} praeguse üksuse jaoks, {Steps.stepid.response} eelmiste sammude andmete jaoks",
    "HTTP Request": "HTTP -päring",
    "Format JSON": "Formaat json",
    "Request body: {steps.stepId.response} or JSON data": "Päringu keha: {Steps.stepid.response} või JSON -i andmed",
    "Access response with {steps.thisStepId.data} or {steps.thisStepId.status}. Use previous step data in URL/headers/body.": "Juurdepääsu vastus {samms.ThisStepid.data} või {samm.ThisStepid.status}. ",
    "JavaScript Code": "JavaScripti kood",
    "Access step data with <code>steps.stepId.data</code> or <code>steps.stepId.response</code>. Use <code>http</code> for API calls, <code>utils.log()</code> for output.": "Juurdepääsu etapi andmetele <code> samm.STEPID.DATA </CODE> või <CODE> STEPS.STEPID.RESPONSE </CODE>. ",
    "Next step": "Järgmine samm",
    "Edit Step": "Redigeerimise samm",
    "Edit step": "Redigeerimise samm",
    "Delete step": "Kustutage samm",
    "UI initialized successfully": "UI initsialiseeris edukalt",
    "Initializing ChatGPT Automation Pro...": "ChatGpt Automation Pro initsialiseerimine ...",
    "UI closed": "Ui suletud"
  },
  "fi": {
    "Automation": "Automaatio",
    "Open Automation": "Avaa automaatio",
    "Batch progress": "Erän edistyminen",
    "Inner batch progress": "Sisäisen erän edistyminen",
    "Ready": "Valmis",
    "Show/Hide Log": "Näytä/Piilota loki",
    "Minimize": "Pienennä",
    "Close": "Sulje",
    "Composer": "Koostin",
    "Settings": "Asetukset",
    "Composer Canvas:": "Koostimen kanvaasi",
    "Preset name": "Esiasetuksen nimi",
    "Select preset...": "Valitse esiasetus...",
    "Message": "Viesti",
    "Send": "Lähetä",
    "Template": "Malli",
    "Dynamic Elements": "Dynaamiset elementit",
    "Response (JS)": "Vastaus (JS)",
    "Validate Chain": "Validoi ketju",
    "Run Chain": "Ajaa ketju",
    "Stop": "Stop",
    "Visual editor for multi-step automation chains. Steps connect in sequence; supports templates and custom JavaScript execution.": "Monivaiheisten automaatioketjujen visuaalinen editori. ",
    "Dynamic Elements (List, JSON, or function)": "Dynaamiset elementit (luettelo, json tai funktio)",
    "Chain JSON (advanced):": "Ketju JSON (edistynyt):",
    "Debug mode:": "Debug -tila:",
    "Enable debug logging": "Ota virheenkorjaus käyttöön",
    "Batch settings:": "Eräasetukset:",
    "Process all items in batch": "Käsittele kaikki erät",
    "Remove processed items from queue": "Poista jalostetut kohteet jonosta",
    "Wait between items (ms):": "Odota esineiden välillä (MS):",
    "Wait between steps (ms):": "Odota vaiheiden välillä (MS):",
    "Open in new chat before this step": "Avaa uudessa chatissa ennen tätä vaihetta",
    "Message Template": "Viestimalli",
    "Template with placeholders like {{item}}, {{index}}, {{total}} or {steps.stepId.data}...": "Malli paikkamerkkien kanssa, kuten {{item}}, {{hakemisto}}, {{yhteensä}} tai {steps.stepid.data} ...",
    "Dynamic Elements (JSON/function). Supports {placeholders}.": "Dynaamiset elementit (JSON/Function). ",
    "Use chain.dynamicElements as elements": "Käytä ketju.dynamicElements elementteinä",
    "Batch processing: {{item}} for current item, {steps.stepId.response} for previous step data": "Eräkäsittely: {{Item}} nykyiselle tuotteelle {Steps.Stepid.Response} Edelliselle vaiheelle",
    "HTTP Request": "HTTP -pyyntö",
    "Format JSON": "Muoto JSON",
    "Request body: {steps.stepId.response} or JSON data": "Pyydä runko: {Step.Stepid.Response} tai JSON -tiedot",
    "Access response with {steps.thisStepId.data} or {steps.thisStepId.status}. Use previous step data in URL/headers/body.": "Päästövastaus {sterte.tHisStepid.data} tai {sterte.ThisStepid.Status}. ",
    "JavaScript Code": "JavaScript -koodi",
    "Access step data with <code>steps.stepId.data</code> or <code>steps.stepId.response</code>. Use <code>http</code> for API calls, <code>utils.log()</code> for output.": "Käyttövaiheen tiedot <code> sterte.spid.data </code> tai <code> sterte.spid.Response </code>. ",
    "Next step": "Seuraava askel",
    "Edit Step": "Muokata vaihetta",
    "Edit step": "Muokata vaihetta",
    "Delete step": "Poistaa askel",
    "UI initialized successfully": "UI alustetaan onnistuneesti",
    "Initializing ChatGPT Automation Pro...": "ChaTGPT Automation Pro -sovelluksen alustaminen ...",
    "UI closed": "UI suljettu"
  },
  "fr": {
    "Automation": "Automatisation",
    "Open Automation": "Ouvrir l'automatisation",
    "Batch progress": "Progression du lot",
    "Inner batch progress": "Progression interne du lot",
    "Ready": "Prêt",
    "Show/Hide Log": "Afficher/Masquer le journal",
    "Minimize": "Minimiser",
    "Close": "Fermer",
    "Composer": "Compositeur",
    "Settings": "Paramètres",
    "Composer Canvas:": "Toile du compositeur",
    "Preset name": "Nom du preset",
    "Select preset...": "Sélectionner un preset...",
    "Message": "Message",
    "Send": "Envoyer",
    "Template": "Modèle",
    "Dynamic Elements": "Éléments dynamiques",
    "Response (JS)": "Réponse (JS)",
    "Validate Chain": "Valider la chaîne",
    "Run Chain": "Chaîne de course",
    "Stop": "Arrêt",
    "Visual editor for multi-step automation chains. Steps connect in sequence; supports templates and custom JavaScript execution.": "Éditeur visuel pour les chaînes d'automatisation en plusieurs étapes. ",
    "Dynamic Elements (List, JSON, or function)": "Éléments dynamiques (liste, JSON ou fonction)",
    "Chain JSON (advanced):": "Chaîne JSON (Advanced):",
    "Debug mode:": "Mode de débogage:",
    "Enable debug logging": "Activer la journalisation de débogage",
    "Batch settings:": "Paramètres par lots:",
    "Process all items in batch": "Traiter tous les éléments en lot",
    "Remove processed items from queue": "Supprimer les éléments traités de la file d'attente",
    "Wait between items (ms):": "Attendez entre les articles (MS):",
    "Wait between steps (ms):": "Attendez entre les étapes (MS):",
    "Open in new chat before this step": "Ouvrez dans un nouveau chat avant cette étape",
    "Message Template": "Modèle de message",
    "Template with placeholders like {{item}}, {{index}}, {{total}} or {steps.stepId.data}...": "Modèle avec des espaces réservés comme {{item}}, {{index}}, {{total}} ou {Steps.stepid.data} ...",
    "Dynamic Elements (JSON/function). Supports {placeholders}.": "Éléments dynamiques (JSON / fonction). ",
    "Use chain.dynamicElements as elements": "Utilisez la chaîne.dynamicelements comme éléments",
    "Batch processing: {{item}} for current item, {steps.stepId.response} for previous step data": "Traitement par lots: {{item}} pour l'élément actuel, {Steps.Stepid.Response} pour les données d'étape précédente",
    "HTTP Request": "Demande HTTP",
    "Format JSON": "Format json",
    "Request body: {steps.stepId.response} or JSON data": "Corps de demande: {Steps.Stepid.Response} ou JSON Data",
    "Access response with {steps.thisStepId.data} or {steps.thisStepId.status}. Use previous step data in URL/headers/body.": "Réponse d'accès avec {Steps.thisstepid.data} ou {Steps.thisstepid.status}. ",
    "JavaScript Code": "Code javascript",
    "Access step data with <code>steps.stepId.data</code> or <code>steps.stepId.response</code>. Use <code>http</code> for API calls, <code>utils.log()</code> for output.": "Accédez aux données des étapes avec <code> Steps.stepid.data </code> ou <code> stepS.stepid.Response </code>. ",
    "Next step": "Prochaine étape",
    "Edit Step": "Modifier",
    "Edit step": "Modifier",
    "Delete step": "Supprimer l'étape",
    "UI initialized successfully": "UI initialisé avec succès",
    "Initializing ChatGPT Automation Pro...": "Initialisation de Chatgpt Automation Pro ...",
    "UI closed": "Ui fermé"
  },
  "ka": {
    "Automation": "ავტომატიზაცია",
    "Open Automation": "გახსენი ავტომატიზაცია",
    "Batch progress": "პაკეტის პროგრესი",
    "Inner batch progress": "შიდა პაკეტის პროგრესი",
    "Ready": "მზადაა",
    "Show/Hide Log": "ლოგის ჩვენება/დამალვა",
    "Minimize": "მინიმიზაცია",
    "Close": "დახურვა",
    "Composer": "კომპოზიტორი",
    "Settings": "პარამეტრები",
    "Composer Canvas:": "კომპოზიტორის ქანვასი",
    "Preset name": "წინასწარი სახელწოდება",
    "Select preset...": "აირჩიე პრესეტი...",
    "Message": "შეტყობინება",
    "Send": "გაგზავნა",
    "Template": "შაბლონი",
    "Dynamic Elements": "დინამიკური ელემენტები",
    "Response (JS)": "პასუხი (JS)",
    "Validate Chain": "დამოწმებული ჯაჭვი",
    "Run Chain": "გაშვებული ჯაჭვი",
    "Stop": "გაჩერება",
    "Visual editor for multi-step automation chains. Steps connect in sequence; supports templates and custom JavaScript execution.": "ვიზუალური რედაქტორი მრავალსაფეხურიანი ავტომატიზაციის ქსელებისთვის. ",
    "Dynamic Elements (List, JSON, or function)": "დინამიური ელემენტები (სია, JSON, ან ფუნქცია)",
    "Chain JSON (advanced):": "ჯაჭვი JSON (მოწინავე):",
    "Debug mode:": "გამართვის რეჟიმი:",
    "Enable debug logging": "ჩართეთ გამართვის ხეები",
    "Batch settings:": "სურათების პარამეტრები:",
    "Process all items in batch": "დაამუშავეთ ყველა ელემენტი ჯგუფში",
    "Remove processed items from queue": "ამოიღეთ დამუშავებული ნივთები რიგიდან",
    "Wait between items (ms):": "დაველოდოთ ნივთებს შორის (MS):",
    "Wait between steps (ms):": "დაველოდოთ ნაბიჯებს შორის (MS):",
    "Open in new chat before this step": "გახსენით ახალ ჩეთში ამ ნაბიჯამდე",
    "Message Template": "შეტყობინების შაბლონი",
    "Template with placeholders like {{item}}, {{index}}, {{total}} or {steps.stepId.data}...": "შაბლონი იმ ადგილების მფლობელებთან, როგორიცაა {{პუნქტი}}, {{index}}, {{{}} ან {steps.stepid.data} ...",
    "Dynamic Elements (JSON/function). Supports {placeholders}.": "დინამიური ელემენტები (JSON/ფუნქცია). ",
    "Use chain.dynamicElements as elements": "გამოიყენეთ ჯაჭვი. Dynamicelements როგორც ელემენტები",
    "Batch processing: {{item}} for current item, {steps.stepId.response} for previous step data": "სურათების დამუშავება: {{პუნქტი}} მიმდინარე ნივთისთვის",
    "HTTP Request": "HTTP მოთხოვნა",
    "Format JSON": "ფორმატის JSON",
    "Request body: {steps.stepId.response} or JSON data": "მოითხოვეთ ორგანო: {steps.stepid.response} ან JSON მონაცემები",
    "Access response with {steps.thisStepId.data} or {steps.thisStepId.status}. Use previous step data in URL/headers/body.": "წვდომის პასუხი {ნაბიჯებით. ",
    "JavaScript Code": "JavaScript კოდი",
    "Access step data with <code>steps.stepId.data</code> or <code>steps.stepId.response</code>. Use <code>http</code> for API calls, <code>utils.log()</code> for output.": "წვდომის ეტაპზე მონაცემები <code> steps.stepid.data </code> ან <code> steps.stepid.response </code>. ",
    "Next step": "შემდეგი ნაბიჯი",
    "Edit Step": "შეცვალეთ ნაბიჯი",
    "Edit step": "შეცვალეთ ნაბიჯი",
    "Delete step": "ნაბიჯის წაშლა",
    "UI initialized successfully": "UI წარმატებით ინიციალიზებულია",
    "Initializing ChatGPT Automation Pro...": "Chatgpt Automation Pro- ის ინიციალიზაცია ...",
    "UI closed": "Ui დაიხურა"
  },
  "de": {
    "Automation": "Automatisierung",
    "Open Automation": "Automatisierung öffnen",
    "Batch progress": "Stapelfortschritt",
    "Inner batch progress": "Innerer Stapelfortschritt",
    "Ready": "Bereit",
    "Show/Hide Log": "Protokoll anzeigen/ausblenden",
    "Minimize": "Minimieren",
    "Close": "Schließen",
    "Composer": "Komponist",
    "Settings": "Einstellungen",
    "Composer Canvas:": "Komponisten-Leinwand",
    "Preset name": "Preset-Name",
    "Select preset...": "Preset auswählen...",
    "Message": "Nachricht",
    "Send": "Senden",
    "Template": "Vorlage",
    "Dynamic Elements": "Dynamische Elemente",
    "Response (JS)": "Antwort (JS)",
    "Validate Chain": "Kette validieren",
    "Run Chain": "Laufkette",
    "Stop": "Stoppen",
    "Visual editor for multi-step automation chains. Steps connect in sequence; supports templates and custom JavaScript execution.": "Visueller Editor für mehrstufige Automatisierungsketten. ",
    "Dynamic Elements (List, JSON, or function)": "Dynamische Elemente (Liste, JSON oder Funktion)",
    "Chain JSON (advanced):": "Kette JSON (Fortgeschrittene):",
    "Debug mode:": "Debug -Modus:",
    "Enable debug logging": "Aktivieren Sie die Debug -Protokollierung",
    "Batch settings:": "Batch -Einstellungen:",
    "Process all items in batch": "Verarbeiten Sie alle Elemente in Stapel",
    "Remove processed items from queue": "Entfernen Sie verarbeitete Elemente aus der Warteschlange",
    "Wait between items (ms):": "Warten Sie zwischen Elementen (MS):",
    "Wait between steps (ms):": "Warten Sie zwischen den Schritten (MS):",
    "Open in new chat before this step": "Vor diesem Schritt im neuen Chat öffnen",
    "Message Template": "Nachrichtenvorlage",
    "Template with placeholders like {{item}}, {{index}}, {{total}} or {steps.stepId.data}...": "Vorlage mit Platzhaltern wie {{item}}, {{index}}, {{Total}} oder {Steps.Stepid.data} ...",
    "Dynamic Elements (JSON/function). Supports {placeholders}.": "Dynamische Elemente (JSON/Funktion). ",
    "Use chain.dynamicElements as elements": "Verwenden Sie Chain.dynamicelements als Elemente",
    "Batch processing: {{item}} for current item, {steps.stepId.response} for previous step data": "Batch -Verarbeitung: {{item}} für das aktuelle Element, {Steps.Stepid.Response} Für vorherige Schrittdaten",
    "HTTP Request": "HTTP -Anfrage",
    "Format JSON": "Format JSON",
    "Request body: {steps.stepId.response} or JSON data": "Anfrage - Körper",
    "Access response with {steps.thisStepId.data} or {steps.thisStepId.status}. Use previous step data in URL/headers/body.": "Zugangsreaktion mit {Steps.thisstepid.data} oder {Steps.thisstepid.status}. ",
    "JavaScript Code": "JavaScript -Code",
    "Access step data with <code>steps.stepId.data</code> or <code>steps.stepId.response</code>. Use <code>http</code> for API calls, <code>utils.log()</code> for output.": "Zugriff auf Schrittdaten mit <Code> secen.Stepid.data </code> oder <code> stets.stepid.response </code>. ",
    "Next step": "Nächster Schritt",
    "Edit Step": "Schritt bearbeiten",
    "Edit step": "Schritt bearbeiten",
    "Delete step": "Schritt löschen",
    "UI initialized successfully": "UI erfolgreich initialisiert",
    "Initializing ChatGPT Automation Pro...": "Initialisieren von Chatgpt Automation Pro ...",
    "UI closed": "UI geschlossen"
  },
  "el": {
    "Automation": "Αυτοματοποίηση",
    "Open Automation": "Άνοιγμα αυτοματοποίησης",
    "Batch progress": "Πρόοδος παρτίδας",
    "Inner batch progress": "Εσωτερική πρόοδος παρτίδας",
    "Ready": "Έτοιμο",
    "Show/Hide Log": "Εμφάνιση/Απόκρυψη καταγραφής",
    "Minimize": "Ελαχιστοποίηση",
    "Close": "Κλείσιμο",
    "Composer": "Συνθέτης",
    "Settings": "Ρυθμίσεις",
    "Composer Canvas:": "Καμβάς συνθέτη",
    "Preset name": "Όνομα προεπιλογής",
    "Select preset...": "Επιλογή προεπιλογής...",
    "Message": "Μήνυμα",
    "Send": "Αποστολή",
    "Template": "Πρότυπο",
    "Dynamic Elements": "Δυναμικά στοιχεία",
    "Response (JS)": "Απόκριση (JS)",
    "Validate Chain": "Επικυρώνει την αλυσίδα",
    "Run Chain": "Τρέξιμο αλυσίδα",
    "Stop": "Στάση",
    "Visual editor for multi-step automation chains. Steps connect in sequence; supports templates and custom JavaScript execution.": "Visual Editor για αλυσίδες αυτοματισμού πολλαπλών βημάτων. ",
    "Dynamic Elements (List, JSON, or function)": "Δυναμικά στοιχεία (λίστα, JSON ή λειτουργία)",
    "Chain JSON (advanced):": "Chain JSON (Advanced):",
    "Debug mode:": "Λειτουργία εντοπισμού σφαλμάτων:",
    "Enable debug logging": "Ενεργοποίηση καταγραφής εντοπισμού σφαλμάτων",
    "Batch settings:": "Ρυθμίσεις παρτίδας:",
    "Process all items in batch": "Επεξεργαστείτε όλα τα στοιχεία σε παρτίδα",
    "Remove processed items from queue": "Αφαιρέστε τα επεξεργασμένα στοιχεία από την ουρά",
    "Wait between items (ms):": "Περιμένετε μεταξύ των στοιχείων (MS):",
    "Wait between steps (ms):": "Περιμένετε μεταξύ των βημάτων (MS):",
    "Open in new chat before this step": "Ανοίξτε σε νέα συνομιλία πριν από αυτό το βήμα",
    "Message Template": "Πρότυπο μηνύματος",
    "Template with placeholders like {{item}}, {{index}}, {{total}} or {steps.stepId.data}...": "Πρότυπο με θέσεις θέσης όπως {{item}}, {{index}}, {{Total}} ή {steps.stepid.data} ...",
    "Dynamic Elements (JSON/function). Supports {placeholders}.": "Δυναμικά στοιχεία (JSON/λειτουργία). ",
    "Use chain.dynamicElements as elements": "Χρησιμοποιήστε την αλυσίδα.",
    "Batch processing: {{item}} for current item, {steps.stepId.response} for previous step data": "Επεξεργασία παρτίδας: {{item}} για τρέχον στοιχείο, {steps.stepid.response} για προηγούμενα δεδομένα βημάτων",
    "HTTP Request": "Αίτημα HTTP",
    "Format JSON": "Μορφή json",
    "Request body: {steps.stepId.response} or JSON data": "Αίτημα Σώμα: {steps.stepid.response} ή JSON δεδομένα",
    "Access response with {steps.thisStepId.data} or {steps.thisStepId.status}. Use previous step data in URL/headers/body.": "Απάντηση πρόσβασης με {steps.thisstepid.data} ή {steps.thisstepid.status}. ",
    "JavaScript Code": "Κώδικας javascript",
    "Access step data with <code>steps.stepId.data</code> or <code>steps.stepId.response</code>. Use <code>http</code> for API calls, <code>utils.log()</code> for output.": "Δεδομένα βημάτων πρόσβασης με <code> steps.stepid.data </code> ή <code> steps.stepid.response </code>. ",
    "Next step": "Επόμενο βήμα",
    "Edit Step": "Επεξεργασία βήματος",
    "Edit step": "Επεξεργασία βήματος",
    "Delete step": "Διαγράψτε το βήμα",
    "UI initialized successfully": "Το UI αρχικοποιήθηκε με επιτυχία",
    "Initializing ChatGPT Automation Pro...": "Αρχικοποίηση του CHATGPT Automation Pro ...",
    "UI closed": "Το UI έκλεισε"
  },
  "gu": {
    "Automation": "સ્વચાલન",
    "Open Automation": "સ્વચાલન ખોલો",
    "Batch progress": "બેચ પ્રગતિ",
    "Inner batch progress": "આંતરિક બેચ પ્રગતિ",
    "Ready": "તૈયાર",
    "Show/Hide Log": "લોગ બતાવો/છુપાવો",
    "Minimize": "ન્યૂનતમ કરો",
    "Close": "બંધ કરો",
    "Composer": "રચયિતા",
    "Settings": "સેટિંગ્સ",
    "Composer Canvas:": "રચયિતાનું કેનવાસ",
    "Preset name": "પ્રિસેટ નામ",
    "Select preset...": "પ્રિસેટ પસંદ કરો...",
    "Message": "સંદેશ",
    "Send": "મોકલો",
    "Template": "ટેમ્પલેટ",
    "Dynamic Elements": "ગતિશીલ ઘટકો",
    "Response (JS)": "પ્રતિસાદ (JS)",
    "Validate Chain": "ન્યાયાધીશ સાંકળ",
    "Run Chain": "સાંકળ",
    "Stop": "રોકવું",
    "Visual editor for multi-step automation chains. Steps connect in sequence; supports templates and custom JavaScript execution.": "મલ્ટિ-સ્ટેપ ઓટોમેશન ચેન માટે વિઝ્યુઅલ સંપાદક. ",
    "Dynamic Elements (List, JSON, or function)": "ગતિશીલ તત્વો (સૂચિ, જેએસઓન અથવા કાર્ય)",
    "Chain JSON (advanced):": "ચેઇન જેસન (અદ્યતન):",
    "Debug mode:": "ડીબગ મોડ:",
    "Enable debug logging": "ડિબગ લ ging ગિંગને સક્ષમ કરો",
    "Batch settings:": "બેચ સેટિંગ્સ:",
    "Process all items in batch": "બેચમાં બધી વસ્તુઓ પર પ્રક્રિયા કરો",
    "Remove processed items from queue": "કતારમાંથી પ્રોસેસ્ડ આઇટમ્સને દૂર કરો",
    "Wait between items (ms):": "આઇટમ્સ (એમએસ) વચ્ચે રાહ જુઓ:",
    "Wait between steps (ms):": "પગલાં (એમએસ) વચ્ચે રાહ જુઓ:",
    "Open in new chat before this step": "આ પગલા પહેલાં નવી ચેટમાં ખોલો",
    "Message Template": "સંદેશ નમૂના",
    "Template with placeholders like {{item}}, {{index}}, {{total}} or {steps.stepId.data}...": "પ્લેસહોલ્ડરો સાથે Template {આઇટમ}}, {{અનુક્રમણિકા}}, {{કુલ}} અથવા {steps.stepid.data} જેવા નમૂના ...",
    "Dynamic Elements (JSON/function). Supports {placeholders}.": "ગતિશીલ તત્વો (જેએસઓન/ફંક્શન). ",
    "Use chain.dynamicElements as elements": "તત્વો તરીકે ચેઇન.ડાયનામિકેમેન્ટ્સનો ઉપયોગ કરો",
    "Batch processing: {{item}} for current item, {steps.stepId.response} for previous step data": "બેચ પ્રોસેસિંગ: {{આઇટમ} current વર્તમાન આઇટમ માટે, {પગથિયા.સ્ટેપિડ.રેસ્પોન્સ} પાછલા પગલા ડેટા માટે",
    "HTTP Request": "HTTP વિનંતી",
    "Format JSON": "ફોર્મેટ જેસન",
    "Request body: {steps.stepId.response} or JSON data": "બોડી વિનંતી: {પગથિયા.સ્ટેપિડ.રેસ્પોન્સ} અથવા જેએસઓન ડેટા",
    "Access response with {steps.thisStepId.data} or {steps.thisStepId.status}. Use previous step data in URL/headers/body.": "{Steps.thisstepid.data} અથવા {steps.thisstepid.status with સાથે response ક્સેસ પ્રતિસાદ. ",
    "JavaScript Code": "જાવાસ્ક્રિપ્ટ",
    "Access step data with <code>steps.stepId.data</code> or <code>steps.stepId.response</code>. Use <code>http</code> for API calls, <code>utils.log()</code> for output.": "<code> steps.stepid.data </code> અથવા <code> steps.stepid.response </code> સાથે પગલું ડેટાને .ક્સેસ કરો. ",
    "Next step": "આગળનું પગલું",
    "Edit Step": "સંપાદન પગલું",
    "Edit step": "સંપાદન પગલું",
    "Delete step": "પગથિયું કા Delete ી નાખો",
    "UI initialized successfully": "UI સફળતાપૂર્વક પ્રારંભ થયો",
    "Initializing ChatGPT Automation Pro...": "ચેટજીપીટી ઓટોમેશન પ્રો પ્રારંભ કરી રહ્યાં છે ...",
    "UI closed": "યુઆઈ બંધ"
  },
  "hi": {
    "Automation": "स्वचालन",
    "Open Automation": "स्वचालन खोलें",
    "Batch progress": "बैच प्रगति",
    "Inner batch progress": "आंतरिक बैच प्रगति",
    "Ready": "तैयार",
    "Show/Hide Log": "लॉग दिखाएँ/छुपाएँ",
    "Minimize": "छोटा करें",
    "Close": "बंद करें",
    "Composer": "रचनाकार",
    "Settings": "सेटिंग्स",
    "Composer Canvas:": "रचनाकार कैनवास",
    "Preset name": "पूर्वनिर्धारित नाम",
    "Select preset...": "पूर्वनिर्धारित चुनें...",
    "Message": "संदेश",
    "Send": "भेजें",
    "Template": "टेम्पलेट",
    "Dynamic Elements": "गतिशील तत्व",
    "Response (JS)": "प्रतिक्रिया (JS)",
    "Validate Chain": "मान्य श्रृंखला",
    "Run Chain": "रन -चेन",
    "Stop": "रुकना",
    "Visual editor for multi-step automation chains. Steps connect in sequence; supports templates and custom JavaScript execution.": "मल्टी-स्टेप ऑटोमेशन चेन के लिए विज़ुअल एडिटर। ",
    "Dynamic Elements (List, JSON, or function)": "गतिशील तत्व (सूची, JSON, या कार्य)",
    "Chain JSON (advanced):": "चेन JSON (उन्नत):",
    "Debug mode:": "डिबग मोड:",
    "Enable debug logging": "डिबग लॉगिंग सक्षम करें",
    "Batch settings:": "बैच सेटिंग्स:",
    "Process all items in batch": "बैच में सभी आइटमों को संसाधित करें",
    "Remove processed items from queue": "कतार से संसाधित आइटम निकालें",
    "Wait between items (ms):": "आइटम (एमएस) के बीच प्रतीक्षा करें:",
    "Wait between steps (ms):": "चरणों के बीच प्रतीक्षा करें (एमएस):",
    "Open in new chat before this step": "इस कदम से पहले नई चैट में खोलें",
    "Message Template": "संदेश टेम्पलेट",
    "Template with placeholders like {{item}}, {{index}}, {{total}} or {steps.stepId.data}...": "{{आइटम}}, {{इंडेक्स}}, {{कुल}} या {steps.stepid.data} जैसे प्लेसहोल्डर्स के साथ टेम्पलेट ...",
    "Dynamic Elements (JSON/function). Supports {placeholders}.": "डायनेमिक एलिमेंट्स (JSON/FUNCTION)। ",
    "Use chain.dynamicElements as elements": "तत्वों के रूप में श्रृंखला.डायनामिक्स का उपयोग करें",
    "Batch processing: {{item}} for current item, {steps.stepId.response} for previous step data": "बैच प्रसंस्करण: {{आइटम}} वर्तमान आइटम के लिए, {steps.stepid.response} पिछले चरण डेटा के लिए",
    "HTTP Request": "HTTP अनुरोध",
    "Format JSON": "प्रारूप JSON",
    "Request body: {steps.stepId.response} or JSON data": "अनुरोध शरीर: {Steps.stepid.response} या JSON डेटा",
    "Access response with {steps.thisStepId.data} or {steps.thisStepId.status}. Use previous step data in URL/headers/body.": "{Steps.thisstepid.data} या {steps.thisstepid.status} के साथ प्रतिक्रिया प्रतिक्रिया। ",
    "JavaScript Code": "जावास्क्रिप्ट कोड",
    "Access step data with <code>steps.stepId.data</code> or <code>steps.stepId.response</code>. Use <code>http</code> for API calls, <code>utils.log()</code> for output.": "<code> steps.stepid.data </code> या <code> steps.stepid.response </code> के साथ चरण डेटा को एक्सेस करें। ",
    "Next step": "अगला कदम",
    "Edit Step": "संपादित करें कदम",
    "Edit step": "संपादित करें कदम",
    "Delete step": "कदम हटाएं",
    "UI initialized successfully": "UI ने सफलतापूर्वक इनिशियलाइज़ किया",
    "Initializing ChatGPT Automation Pro...": "आरंभ करना चैट ऑटोमेशन प्रो ...",
    "UI closed": "यूआई बंद"
  },
  "hu": {
    "Automation": "Automatizálás",
    "Open Automation": "Automatizálás megnyitása",
    "Batch progress": "Köteg előrehaladás",
    "Inner batch progress": "Belső köteg előrehaladás",
    "Ready": "Kész",
    "Show/Hide Log": "Napló megjelenítése/elrejtése",
    "Minimize": "Minimalizálás",
    "Close": "Bezárás",
    "Composer": "Komponista",
    "Settings": "Beállítások",
    "Composer Canvas:": "Komponista vászon",
    "Preset name": "Előbeállítás neve",
    "Select preset...": "Előbeállítás kiválasztása...",
    "Message": "Üzenet",
    "Send": "Küldés",
    "Template": "Sablon",
    "Dynamic Elements": "Dinamikus elemek",
    "Response (JS)": "Válasz (JS)",
    "Validate Chain": "Lánc érvényesítése",
    "Run Chain": "Futó lánc",
    "Stop": "Stop",
    "Visual editor for multi-step automation chains. Steps connect in sequence; supports templates and custom JavaScript execution.": "Vizuális szerkesztő a többlépcsős automatizálási láncokhoz. ",
    "Dynamic Elements (List, JSON, or function)": "Dinamikus elemek (lista, JSON vagy funkció)",
    "Chain JSON (advanced):": "Lánc JSON (Advanced):",
    "Debug mode:": "Hibakeresési mód:",
    "Enable debug logging": "Engedélyezze a hibakeresési naplózást",
    "Batch settings:": "Batch beállítások:",
    "Process all items in batch": "Az összes elem feldolgozása a tételben",
    "Remove processed items from queue": "Távolítsa el a feldolgozott elemeket a sorból",
    "Wait between items (ms):": "Várjon tételek között (MS):",
    "Wait between steps (ms):": "Várjon a lépések között (MS):",
    "Open in new chat before this step": "Nyissa meg az új csevegést e lépés előtt",
    "Message Template": "Üzenetsablon",
    "Template with placeholders like {{item}}, {{index}}, {{total}} or {steps.stepId.data}...": "Sablon olyan helyőrzőkkel, mint a {{item}}, {{index}}, {{total}} vagy {steps.stepid.data} ...",
    "Dynamic Elements (JSON/function). Supports {placeholders}.": "Dinamikus elemek (JSON/funkció). ",
    "Use chain.dynamicElements as elements": "Használja a lánc.dynamicElements elemeket",
    "Batch processing: {{item}} for current item, {steps.stepId.response} for previous step data": "Batch feldolgozás: {{item}} Az aktuális elemhez, {steps.stepid.response} Az előző lépés adatokhoz",
    "HTTP Request": "HTTP kérés",
    "Format JSON": "Formátum JSON",
    "Request body: {steps.stepId.response} or JSON data": "Kérjen testet: {steps.stepid.response} vagy json adatok",
    "Access response with {steps.thisStepId.data} or {steps.thisStepId.status}. Use previous step data in URL/headers/body.": "Hozzáférési válasz a {steps.thisstepid.data} vagy a {steps.thisstepid.status} segítségével. ",
    "JavaScript Code": "JavaScript kód",
    "Access step data with <code>steps.stepId.data</code> or <code>steps.stepId.response</code>. Use <code>http</code> for API calls, <code>utils.log()</code> for output.": "Hozzáférés a lépés adataihoz <code> steps.stepid.data </code> vagy <code> steps.stepid.response </code> segítségével. ",
    "Next step": "Következő lépés",
    "Edit Step": "Lépés szerkesztése",
    "Edit step": "Lépés szerkesztése",
    "Delete step": "Törölje a lépést",
    "UI initialized successfully": "Az UI sikeresen inicializált",
    "Initializing ChatGPT Automation Pro...": "A Chatgpt Automation Pro inicializálása ...",
    "UI closed": "UI bezárt"
  },
  "is": {
    "Automation": "Sjálfvirkni",
    "Open Automation": "Opna sjálfvirkni",
    "Batch progress": "Lotuframvinda",
    "Inner batch progress": "Innri lotuframvinda",
    "Ready": "Tilbúið",
    "Show/Hide Log": "Sýna/Fela atvikaskrá",
    "Minimize": "Lágmarka",
    "Close": "Loka",
    "Composer": "Tónskáld",
    "Settings": "Stillingar",
    "Composer Canvas:": "Tónskáld striga",
    "Preset name": "Forstillt nafn",
    "Select preset...": "Veldu forstillingu...",
    "Message": "Skilaboð",
    "Send": "Senda",
    "Template": "Sniðmát",
    "Dynamic Elements": "Breytilegir þættir",
    "Response (JS)": "Svar (JS)",
    "Validate Chain": "Staðfestu keðju",
    "Run Chain": "Hlaupa keðju",
    "Stop": "Hættu",
    "Visual editor for multi-step automation chains. Steps connect in sequence; supports templates and custom JavaScript execution.": "Sjónræn ritstjóri fyrir margra skref sjálfvirkni keðjur. ",
    "Dynamic Elements (List, JSON, or function)": "Kraftmiklir þættir (listi, JSON eða aðgerð)",
    "Chain JSON (advanced):": "Chain JSON (Advanced):",
    "Debug mode:": "Kembiforrit:",
    "Enable debug logging": "Virkja kembiforrit",
    "Batch settings:": "Hópstillingar:",
    "Process all items in batch": "Vinna úr öllum hlutum í lotu",
    "Remove processed items from queue": "Fjarlægðu unnar hluti úr biðröð",
    "Wait between items (ms):": "Bíddu á milli atriða (MS):",
    "Wait between steps (ms):": "Bíddu á milli skrefa (MS):",
    "Open in new chat before this step": "Opnaðu í nýju spjalli fyrir þetta skref",
    "Message Template": "Skilaboðasniðmát",
    "Template with placeholders like {{item}}, {{index}}, {{total}} or {steps.stepId.data}...": "Sniðmát með staðhöfum eins og {{item}}, {{index}}, {{total}} eða {steps.stepid.data} ...",
    "Dynamic Elements (JSON/function). Supports {placeholders}.": "Kraftmiklir þættir (JSON/fall). ",
    "Use chain.dynamicElements as elements": "Notaðu keðju.dynamicelements sem þætti",
    "Batch processing: {{item}} for current item, {steps.stepId.response} for previous step data": "Hópvinnsla: {{item}} fyrir núverandi hlut, {steps.stepid.response} fyrir fyrri skref gögn",
    "HTTP Request": "Http beiðni",
    "Format JSON": "Snið JSON",
    "Request body: {steps.stepId.response} or JSON data": "Biðja um líkama: {steps.stepid.response} eða JSON gögn",
    "Access response with {steps.thisStepId.data} or {steps.thisStepId.status}. Use previous step data in URL/headers/body.": "Aðgangssvörun með {steps.thisstepid.data} eða {steps.thisstepid.status}. ",
    "JavaScript Code": "JavaScript kóða",
    "Access step data with <code>steps.stepId.data</code> or <code>steps.stepId.response</code>. Use <code>http</code> for API calls, <code>utils.log()</code> for output.": "Fáðu aðgang að gögnum með <code> seps.stepid.data </code> eða <code> skrefs.stepid.response </code>. ",
    "Next step": "Næsta skref",
    "Edit Step": "Breyta skrefi",
    "Edit step": "Breyta skrefi",
    "Delete step": "Eyða skrefi",
    "UI initialized successfully": "HÍ frumstýrði með góðum árangri",
    "Initializing ChatGPT Automation Pro...": "Frumstilla ChatGPT Automation Pro ...",
    "UI closed": "HÍ lokað"
  },
  "id": {
    "Automation": "Otomatisasi",
    "Open Automation": "Buka Otomatisasi",
    "Batch progress": "Kemajuan batch",
    "Inner batch progress": "Kemajuan batch internal",
    "Ready": "Siap",
    "Show/Hide Log": "Tampilkan/Sembunyikan Log",
    "Minimize": "Minimalkan",
    "Close": "Tutup",
    "Composer": "Penyusun",
    "Settings": "Pengaturan",
    "Composer Canvas:": "Kanvas penyusun",
    "Preset name": "Nama preset",
    "Select preset...": "Pilih preset...",
    "Message": "Pesan",
    "Send": "Kirim",
    "Template": "Templat",
    "Dynamic Elements": "Elemen dinamis",
    "Response (JS)": "Respons (JS)",
    "Validate Chain": "Validasi rantai",
    "Run Chain": "Jalankan rantai",
    "Stop": "Berhenti",
    "Visual editor for multi-step automation chains. Steps connect in sequence; supports templates and custom JavaScript execution.": "Editor Visual untuk Rantai Otomasi Multi-Langkah. ",
    "Dynamic Elements (List, JSON, or function)": "Elemen Dinamis (Daftar, JSON, atau Fungsi)",
    "Chain JSON (advanced):": "Rantai JSON (Lanjutan):",
    "Debug mode:": "Mode debug:",
    "Enable debug logging": "Aktifkan Debug Logging",
    "Batch settings:": "Pengaturan Batch:",
    "Process all items in batch": "Proses semua item dalam batch",
    "Remove processed items from queue": "Hapus item yang diproses dari antrian",
    "Wait between items (ms):": "Tunggu Antara Item (MS):",
    "Wait between steps (ms):": "Tunggu Antara Langkah (MS):",
    "Open in new chat before this step": "Buka dalam obrolan baru sebelum langkah ini",
    "Message Template": "Template pesan",
    "Template with placeholders like {{item}}, {{index}}, {{total}} or {steps.stepId.data}...": "Templat dengan placeholder seperti {{item}}, {{index}}, {{total}} atau {steps.stepid.data} ...",
    "Dynamic Elements (JSON/function). Supports {placeholders}.": "Elemen Dinamis (JSON/Fungsi). ",
    "Use chain.dynamicElements as elements": "Gunakan rantai.dynamicelements sebagai elemen",
    "Batch processing: {{item}} for current item, {steps.stepId.response} for previous step data": "Pemrosesan Batch: {{item}} untuk item saat ini, {steps.stepid.response} untuk data langkah sebelumnya",
    "HTTP Request": "Permintaan HTTP",
    "Format JSON": "Format json",
    "Request body: {steps.stepId.response} or JSON data": "Badan Permintaan: {steps.stepid.response} atau data JSON",
    "Access response with {steps.thisStepId.data} or {steps.thisStepId.status}. Use previous step data in URL/headers/body.": "Akses respons dengan {steps.thisstepid.data} atau {steps.thisstepid.status}. ",
    "JavaScript Code": "Kode JavaScript",
    "Access step data with <code>steps.stepId.data</code> or <code>steps.stepId.response</code>. Use <code>http</code> for API calls, <code>utils.log()</code> for output.": "Akses Data Langkah dengan <code> steps.stepid.data </code> atau <code> steps.stepid.response </code>. ",
    "Next step": "Langkah selanjutnya",
    "Edit Step": "Edit langkah",
    "Edit step": "Edit langkah",
    "Delete step": "Hapus langkah",
    "UI initialized successfully": "UI berhasil diinisialisasi",
    "Initializing ChatGPT Automation Pro...": "Menginisialisasi Chatgpt Automation Pro ...",
    "UI closed": "UI ditutup"
  },
  "it": {
    "Automation": "Automazione",
    "Open Automation": "Apri automazione",
    "Batch progress": "Avanzamento batch",
    "Inner batch progress": "Avanzamento batch interno",
    "Ready": "Pronto",
    "Show/Hide Log": "Mostra/Nascondi registro",
    "Minimize": "Riduci",
    "Close": "Chiudi",
    "Composer": "Compositore",
    "Settings": "Impostazioni",
    "Composer Canvas:": "Tela del compositore",
    "Preset name": "Nome preset",
    "Select preset...": "Seleziona preset...",
    "Message": "Messaggio",
    "Send": "Invia",
    "Template": "Modello",
    "Dynamic Elements": "Elementi dinamici",
    "Response (JS)": "Risposta (JS)",
    "Validate Chain": "Convalida Chain",
    "Run Chain": "Catena di corsa",
    "Stop": "Fermare",
    "Visual editor for multi-step automation chains. Steps connect in sequence; supports templates and custom JavaScript execution.": "Editor visivo per catene di automazione in più fasi. ",
    "Dynamic Elements (List, JSON, or function)": "Elementi dinamici (elenco, json o funzione)",
    "Chain JSON (advanced):": "Chain JSON (avanzata):",
    "Debug mode:": "Modalità di debug:",
    "Enable debug logging": "Abilita la registrazione del debug",
    "Batch settings:": "Impostazioni batch:",
    "Process all items in batch": "Elabora tutti gli articoli in batch",
    "Remove processed items from queue": "Rimuovere gli elementi elaborati dalla coda",
    "Wait between items (ms):": "Aspetta tra gli articoli (MS):",
    "Wait between steps (ms):": "Aspetta tra i passaggi (MS):",
    "Open in new chat before this step": "Apri in una nuova chat prima di questo passaggio",
    "Message Template": "Modello di messaggio",
    "Template with placeholders like {{item}}, {{index}}, {{total}} or {steps.stepId.data}...": "Modello con segnaposto come {{item}}, {{index}}, {{total}} o {steps.stepid.data} ...",
    "Dynamic Elements (JSON/function). Supports {placeholders}.": "Elementi dinamici (JSON/funzione). ",
    "Use chain.dynamicElements as elements": "Usa catena.dynamicelments come elementi",
    "Batch processing: {{item}} for current item, {steps.stepId.response} for previous step data": "Elaborazione batch: {{item}} per l'elemento corrente, {steps.stepid.response} per i dati del passaggio precedente",
    "HTTP Request": "Richiesta HTTP",
    "Format JSON": "Formatta JSON",
    "Request body: {steps.stepId.response} or JSON data": "Body di richiesta: {steps.stepid.response} o JSON Data",
    "Access response with {steps.thisStepId.data} or {steps.thisStepId.status}. Use previous step data in URL/headers/body.": "Accedi Risposta con {steps.thisstepid.data} o {steps.thisstepid.status}. ",
    "JavaScript Code": "Codice JavaScript",
    "Access step data with <code>steps.stepId.data</code> or <code>steps.stepId.response</code>. Use <code>http</code> for API calls, <code>utils.log()</code> for output.": "Accesso Passaggio dati con <code> steps.stepid.data </code> o <code> steps.stepid.response </code>. ",
    "Next step": "Passaggio successivo",
    "Edit Step": "Modifica passaggio",
    "Edit step": "Modifica passaggio",
    "Delete step": "Elimina il passaggio",
    "UI initialized successfully": "UI inizializzata con successo",
    "Initializing ChatGPT Automation Pro...": "Inizializzazione di Chatgpt Automation Pro ...",
    "UI closed": "Ui chiuso"
  },
  "ja": {
    "Automation": "自動化",
    "Open Automation": "自動化を開く",
    "Batch progress": "バッチ進行",
    "Inner batch progress": "内部バッチ進行",
    "Ready": "準備完了",
    "Show/Hide Log": "ログを表示/非表示",
    "Minimize": "最小化",
    "Close": "閉じる",
    "Composer": "コンポーザー",
    "Settings": "設定",
    "Composer Canvas:": "コンポーザーキャンバス",
    "Preset name": "プリセット名",
    "Select preset...": "プリセットを選択...",
    "Message": "メッセージ",
    "Send": "送信",
    "Template": "テンプレート",
    "Dynamic Elements": "動的要素",
    "Response (JS)": "レスポンス (JS)",
    "Validate Chain": "チェーンを検証します",
    "Run Chain": "チェーンを実行します",
    "Stop": "停止",
    "Visual editor for multi-step automation chains. Steps connect in sequence; supports templates and custom JavaScript execution.": "マルチステップオートメーションチェーンの視覚エディター。",
    "Dynamic Elements (List, JSON, or function)": "動的要素（リスト、JSON、または機能）",
    "Chain JSON (advanced):": "チェーンJSON（Advanced）：",
    "Debug mode:": "デバッグモード：",
    "Enable debug logging": "デバッグロギングを有効にします",
    "Batch settings:": "バッチ設定：",
    "Process all items in batch": "すべてのアイテムをバッチで処理します",
    "Remove processed items from queue": "キューから処理されたアイテムを削除します",
    "Wait between items (ms):": "アイテム間で待機（MS）：",
    "Wait between steps (ms):": "手順（MS）の間で待つ：",
    "Open in new chat before this step": "このステップの前に新しいチャットで開きます",
    "Message Template": "メッセージテンプレート",
    "Template with placeholders like {{item}}, {{index}}, {{total}} or {steps.stepId.data}...": "{{Item}}、{{index}}、{{attol}}または{stepsstepid.data}などのプレースホルダーを使用したテンプレート...",
    "Dynamic Elements (JSON/function). Supports {placeholders}.": "動的要素（JSON/関数）。 ",
    "Use chain.dynamicElements as elements": "Chain.dynamicelementsを要素として使用します",
    "Batch processing: {{item}} for current item, {steps.stepId.response} for previous step data": "バッチ処理：{{item}}現在の項目の場合、{steps.stepid.response}",
    "HTTP Request": "HTTPリクエスト",
    "Format JSON": "フォーマットjson",
    "Request body: {steps.stepId.response} or JSON data": "ボディをリクエスト：{steps.stepid.response}またはjsonデータ",
    "Access response with {steps.thisStepId.data} or {steps.thisStepId.status}. Use previous step data in URL/headers/body.": "{steps.thisStepid.data}または{steps.thisStepid.status}を使用したアクセス応答。 ",
    "JavaScript Code": "JavaScriptコード",
    "Access step data with <code>steps.stepId.data</code> or <code>steps.stepId.response</code>. Use <code>http</code> for API calls, <code>utils.log()</code> for output.": "<code> steps.stepid.data </code>または<code> steps.stepid.response </code>を備えたステップデータにアクセスします。 ",
    "Next step": "次のステップ",
    "Edit Step": "ステップを編集します",
    "Edit step": "ステップを編集します",
    "Delete step": "ステップを削除します",
    "UI initialized successfully": "UIは正常に初期化されました",
    "Initializing ChatGPT Automation Pro...": "Chatgpt AutomationProを初期化...",
    "UI closed": "UIは閉じました"
  },
  "kn": {
    "Automation": "ಸ್ವಯಂಚಾಲಿತ",
    "Open Automation": "ಸ್ವಯಂಚಾಲಿತ ತೆರೆಯಿರಿ",
    "Batch progress": "ಬ್ಯಾಚ್ ಪ್ರಗತಿ",
    "Inner batch progress": "ಅಂತರಂಗ ಬ್ಯಾಚ್ ಪ್ರಗತಿ",
    "Ready": "ಸಿದ್ಧ",
    "Show/Hide Log": "ಲಾಗ್ ತೋರಿಸಿ/ಮರೆಮಾಚಿ",
    "Minimize": "ಕಡಿಮೆ ಮಾಡಿ",
    "Close": "ಮುಚ್ಚಿ",
    "Composer": "ರಚನೆಗಾರ",
    "Settings": "ಸೆಟ್ಟಿಂಗ್ಸ್",
    "Composer Canvas:": "ರಚನೆಗಾರ ಕ್ಯಾನ್ವಾಸ್",
    "Preset name": "ಪೂರ್ವನಿಯೋಜಿತ ಹೆಸರು",
    "Select preset...": "ಪೂರ್ವನಿಯೋಜಿತ ಆಯ್ಕೆಮಾಡಿ...",
    "Message": "ಸಂದೇಶ",
    "Send": "ಕಳುಹಿಸಿ",
    "Template": "ಟೆಂಪ್ಲೇಟ್",
    "Dynamic Elements": "ಗತಿಶೀಲ ಘಟಕಗಳು",
    "Response (JS)": "ಪ್ರತಿಕ್ರಿಯೆ (JS)",
    "Validate Chain": "ಸರಪಳಿಯನ್ನು ಮೌಲ್ಯೀಕರಿಸಿ",
    "Run Chain": "ಸರಪಳಿಯನ್ನು ರನ್ ಮಾಡಿ",
    "Stop": "ನಿಲ್ಲಿಸು",
    "Visual editor for multi-step automation chains. Steps connect in sequence; supports templates and custom JavaScript execution.": "ಬಹು-ಹಂತದ ಯಾಂತ್ರೀಕೃತಗೊಂಡ ಸರಪಳಿಗಳಿಗೆ ವಿಷುಯಲ್ ಎಡಿಟರ್. ",
    "Dynamic Elements (List, JSON, or function)": "ಡೈನಾಮಿಕ್ ಅಂಶಗಳು (ಪಟ್ಟಿ, JSON, ಅಥವಾ ಕಾರ್ಯ)",
    "Chain JSON (advanced):": "ಚೈನ್ ಜೆಸನ್ (ಸುಧಾರಿತ):",
    "Debug mode:": "ಡೀಬಗ್ ಮೋಡ್:",
    "Enable debug logging": "ಡೀಬಗ್ ಲಾಗಿಂಗ್ ಅನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ",
    "Batch settings:": "ಬ್ಯಾಚ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳು:",
    "Process all items in batch": "ಎಲ್ಲಾ ವಸ್ತುಗಳನ್ನು ಬ್ಯಾಚ್‌ನಲ್ಲಿ ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಿ",
    "Remove processed items from queue": "ಸಂಸ್ಕರಿಸಿದ ವಸ್ತುಗಳನ್ನು ಕ್ಯೂನಿಂದ ತೆಗೆದುಹಾಕಿ",
    "Wait between items (ms):": "ಐಟಂಗಳ ನಡುವೆ ಕಾಯಿರಿ (ಎಂಎಸ್):",
    "Wait between steps (ms):": "ಹಂತಗಳ ನಡುವೆ ಕಾಯಿರಿ (ಎಂಎಸ್):",
    "Open in new chat before this step": "ಈ ಹಂತದ ಮೊದಲು ಹೊಸ ಚಾಟ್‌ನಲ್ಲಿ ತೆರೆಯಿರಿ",
    "Message Template": "ಸಂದೇಶ ಟೆಂಪ್ಲೇಟ್",
    "Template with placeholders like {{item}}, {{index}}, {{total}} or {steps.stepId.data}...": "{{ಐಟಂ}}, {{ಸೂಚ್ಯಂಕ}}, {{ಒಟ್ಟು}} ಅಥವಾ {ಹಂತಗಳು. ಸ್ಟೆಪಿಡ್.ಡೇಟಾ} ... ನಂತಹ ಪ್ಲೇಸ್‌ಹೋಲ್ಡರ್‌ಗಳೊಂದಿಗೆ ಟೆಂಪ್ಲೇಟ್ ...",
    "Dynamic Elements (JSON/function). Supports {placeholders}.": "ಡೈನಾಮಿಕ್ ಅಂಶಗಳು (JSON/ಕಾರ್ಯ). ",
    "Use chain.dynamicElements as elements": "ಚೈನ್.ಡೈನಾಮಾಮಿಕ್‌ಲೆಮೆಂಟ್ಸ್ ಅನ್ನು ಅಂಶಗಳಾಗಿ ಬಳಸಿ",
    "Batch processing: {{item}} for current item, {steps.stepId.response} for previous step data": "ಬ್ಯಾಚ್ ಪ್ರಕ್ರಿಯೆ: ಪ್ರಸ್ತುತ ಐಟಂಗೆ {{ಐಟಂ}}, {ಹಂತಗಳು. ಸ್ಟೆಪಿಡ್.ರೆಸ್ಪೋನ್ಸ್ the ಹಿಂದಿನ ಹಂತದ ಡೇಟಾಕ್ಕಾಗಿ",
    "HTTP Request": "Http ವಿನಂತಿ",
    "Format JSON": "ಫಾರ್ಮ್ಯಾಟ್ JSON",
    "Request body: {steps.stepId.response} or JSON data": "ದೇಹವನ್ನು ವಿನಂತಿಸಿ: {steps.stepid.response} ಅಥವಾ json ಡೇಟಾ",
    "Access response with {steps.thisStepId.data} or {steps.thisStepId.status}. Use previous step data in URL/headers/body.": "{ಹಂತಗಳು. ",
    "JavaScript Code": "ಜಾವಾಸ್ಕ್ರಿಪ್ಟ್ ಕೋಡ್",
    "Access step data with <code>steps.stepId.data</code> or <code>steps.stepId.response</code>. Use <code>http</code> for API calls, <code>utils.log()</code> for output.": "<code> steps.stepid.data </code> ಅಥವಾ <code> steps.stepid.response </code> ನೊಂದಿಗೆ ಹಂತದ ಡೇಟಾವನ್ನು ಪ್ರವೇಶಿಸಿ. ",
    "Next step": "ಮುಂದಿನ ಹಂತ",
    "Edit Step": "ಹಂತವನ್ನು ಸಂಪಾದಿಸಿ",
    "Edit step": "ಹಂತವನ್ನು ಸಂಪಾದಿಸಿ",
    "Delete step": "ಹಂತವನ್ನು ಅಳಿಸಿ",
    "UI initialized successfully": "ಯುಐ ಯಶಸ್ವಿಯಾಗಿ ಪ್ರಾರಂಭವಾಯಿತು",
    "Initializing ChatGPT Automation Pro...": "ಚಾಟ್‌ಜಿಪಿಟಿ ಆಟೊಮೇಷನ್ ಪ್ರೊ ಅನ್ನು ಪ್ರಾರಂಭಿಸುವುದು ...",
    "UI closed": "ಯುಐ ಮುಚ್ಚಲಾಗಿದೆ"
  },
  "kk": {
    "Automation": "Автоматтандыру",
    "Open Automation": "Автоматтандыруды ашу",
    "Batch progress": "Топтаманың барысы",
    "Inner batch progress": "Ішкі топтаманың барысы",
    "Ready": "Дайын",
    "Show/Hide Log": "Журналды көрсету/жасыру",
    "Minimize": "Төмендету",
    "Close": "Жабу",
    "Composer": "Композитор",
    "Settings": "Баптаулар",
    "Composer Canvas:": "Композитор кенебі",
    "Preset name": "Алдын ала орнату атауы",
    "Select preset...": "Алдын ала орнатуды таңдаңыз...",
    "Message": "Хабарлама",
    "Send": "Жіберу",
    "Template": "Үлгі",
    "Dynamic Elements": "Динамикалық элементтер",
    "Response (JS)": "Жауап (JS)",
    "Validate Chain": "Тексеру тізбегі",
    "Run Chain": "Жүгіру тізбегі",
    "Stop": "Аялдама",
    "Visual editor for multi-step automation chains. Steps connect in sequence; supports templates and custom JavaScript execution.": "Көп сатылы автоматтандыру тізбегіне арналған визуалды редактор. ",
    "Dynamic Elements (List, JSON, or function)": "Динамикалық элементтер (тізім, JSON немесе функция)",
    "Chain JSON (advanced):": "Желілік JSON (Advanced):",
    "Debug mode:": "Жөндеу режимі:",
    "Enable debug logging": "Жөндеу журналын қосу",
    "Batch settings:": "Пакеттік параметрлер:",
    "Process all items in batch": "Барлық элементтерді пакетте өңдеңіз",
    "Remove processed items from queue": "Өңделген заттарды кезектен алып тастаңыз",
    "Wait between items (ms):": "Элементтер арасында күтіңіз (MS):",
    "Wait between steps (ms):": "Қадамдар арасында күтіңіз (MS):",
    "Open in new chat before this step": "Осы қадамға дейін жаңа чатта ашыңыз",
    "Message Template": "Хабарлама шаблоны",
    "Template with placeholders like {{item}}, {{index}}, {{total}} or {steps.stepId.data}...": "Толтырғыштармен {{TELDER}, {{INDEAD}}, {{entall}} немесе {{entall}} немесе {{TATMS.STEPID.DATA}) қосылған шаблон.",
    "Dynamic Elements (JSON/function). Supports {placeholders}.": "Динамикалық элементтер (JSON / функциясы). ",
    "Use chain.dynamicElements as elements": "Элементтер ретінде.dynamicelements тізбегін пайдаланыңыз",
    "Batch processing: {{item}} for current item, {steps.stepId.response} for previous step data": "Пакетті өңдеу: алдыңғы элемент үшін {{TABLE}}, алдыңғы қадам туралы мәліметтер үшін {TEXTS.STEPID.Response}",
    "HTTP Request": "Http сұранысы",
    "Format JSON": "Пішім JSON",
    "Request body: {steps.stepId.response} or JSON data": "Сұрау",
    "Access response with {steps.thisStepId.data} or {steps.thisStepId.status}. Use previous step data in URL/headers/body.": "{TEXTS.THISSTEPID.DATA} немесе {қадамдар. ",
    "JavaScript Code": "JavaScript коды",
    "Access step data with <code>steps.stepId.data</code> or <code>steps.stepId.response</code>. Use <code>http</code> for API calls, <code>utils.log()</code> for output.": "Қадамдық деректерге <код> қадамдармен кіріңіз. ",
    "Next step": "Келесі қадам",
    "Edit Step": "Қадамды өңдеңіз",
    "Edit step": "Қадамды өңдеңіз",
    "Delete step": "Қадамды жою",
    "UI initialized successfully": "UI сәтті іске қосылды",
    "Initializing ChatGPT Automation Pro...": "ChatGPT автоматтандыруды инициализациялау ...",
    "UI closed": "Ui жабылды"
  },
  "ko": {
    "Automation": "자동화",
    "Open Automation": "자동화 열기",
    "Batch progress": "배치 진행",
    "Inner batch progress": "내부 배치 진행",
    "Ready": "준비 완료",
    "Show/Hide Log": "로그 표시/숨기기",
    "Minimize": "최소화",
    "Close": "닫기",
    "Composer": "작성기",
    "Settings": "설정",
    "Composer Canvas:": "작성기 캔버스",
    "Preset name": "프리셋 이름",
    "Select preset...": "프리셋 선택...",
    "Message": "메시지",
    "Send": "보내기",
    "Template": "템플릿",
    "Dynamic Elements": "동적 요소",
    "Response (JS)": "응답 (JS)",
    "Validate Chain": "체인을 확인하십시오",
    "Run Chain": "run 체인",
    "Stop": "멈추다",
    "Visual editor for multi-step automation chains. Steps connect in sequence; supports templates and custom JavaScript execution.": "다단계 자동화 체인의 시각적 편집기. ",
    "Dynamic Elements (List, JSON, or function)": "동적 요소 (목록, JSON 또는 기능)",
    "Chain JSON (advanced):": "체인 JSON (고급) :",
    "Debug mode:": "디버그 모드 :",
    "Enable debug logging": "디버그 로깅을 활성화합니다",
    "Batch settings:": "배치 설정 :",
    "Process all items in batch": "모든 항목을 배치로 처리합니다",
    "Remove processed items from queue": "대기열에서 처리 된 항목을 제거하십시오",
    "Wait between items (ms):": "항목 사이 (MS) 사이의 대기 :",
    "Wait between steps (ms):": "단계 (ms) 사이에서 기다려",
    "Open in new chat before this step": "이 단계 전에 새 채팅에서 열립니다",
    "Message Template": "메시지 템플릿",
    "Template with placeholders like {{item}}, {{index}}, {{total}} or {steps.stepId.data}...": "{{item}}, {{index}}, {{total}} 또는 {steps.stepid.data}와 같은 자리 표시자가있는 템플릿.",
    "Dynamic Elements (JSON/function). Supports {placeholders}.": "동적 요소 (json/function). ",
    "Use chain.dynamicElements as elements": "chain.dynamicElements를 요소로 사용하십시오",
    "Batch processing: {{item}} for current item, {steps.stepId.response} for previous step data": "배치 처리 : 현재 항목의 경우 {{item}} 이전 단계 데이터의 경우 {steps.stepid.response}",
    "HTTP Request": "HTTP 요청",
    "Format JSON": "형식 JSON",
    "Request body: {steps.stepId.response} or JSON data": "요청 본문 : {steps.stepid.response} 또는 JSON 데이터",
    "Access response with {steps.thisStepId.data} or {steps.thisStepId.status}. Use previous step data in URL/headers/body.": "{steps.thisstepid.data} 또는 {steps.thisstepid.status}로 액세스 응답. ",
    "JavaScript Code": "자바 스크립트 코드",
    "Access step data with <code>steps.stepId.data</code> or <code>steps.stepId.response</code>. Use <code>http</code> for API calls, <code>utils.log()</code> for output.": "<code> steps.stepid.data </code> 또는 <code> steps.stepid.response </code>를 사용한 단계 데이터에 액세스하십시오. ",
    "Next step": "다음 단계",
    "Edit Step": "편집 단계",
    "Edit step": "편집 단계",
    "Delete step": "단계를 삭제하십시오",
    "UI initialized successfully": "UI가 성공적으로 초기화되었습니다",
    "Initializing ChatGPT Automation Pro...": "Chatgpt Automation Pro 초기화 ...",
    "UI closed": "UI 폐쇄"
  }
};

const extraTranslations = {
  "sq": {
    "Typing...": "Shtypja ...",
    "Waiting for response...": "Në pritje të përgjigjes ...",
    "Complete": "I plotë",
    "Error": "Gabim",
    "Activity Log": "Regjistër i aktivitetit",
    "Add Step": "Shtoj",
    "Response timeout (ms):": "Koha e përgjigjes (MS):",
    "Visibility:": "Dukshmëria:",
    "Show panel by default": "Shfaq panelin si parazgjedhje",
    "Controls default visibility on page load. You can still toggle from the header button.": "Kontrollon dukshmërinë e paracaktuar në ngarkesën e faqes. ",
    "Log cleared": "Log i pastruar",
    "Stop requested": "Ndalesa e kërkuar",
    "Starting new chat...": "Fillimi i bisedës së re ...",
    "Using new chat button...": "Përdorimi i butonit të ri të bisedës ...",
    "Using home link...": "Përdorimi i lidhjes në shtëpi ...",
    "Failed to start a new chat": "Nuk arriti të fillojë një bisedë të re",
    "Invalid wait time, keeping current value": "Koha e pritjes së pavlefshme, duke mbajtur vlerën aktuale",
    "Invalid per-step wait time, keeping current value": "Koha e pritjes së pavlefshme për hap, duke mbajtur vlerën aktuale",
    "Chain valid": "I vlefshëm",
    "Chain invalid": "I pavlefshëm"
  },
  "am": {
    "Typing...": "መተየብ ...",
    "Waiting for response...": "ምላሽ እየጠበቁ ...",
    "Complete": "ተጠናቀቀ",
    "Error": "ስህተት",
    "Activity Log": "የእንቅስቃሴ ምዝግብ ማስታወሻ",
    "Add Step": "እርምጃን ያክሉ",
    "Response timeout (ms):": "ምላሽ ሰዓት (MS)",
    "Visibility:": "ታይነት: -",
    "Show panel by default": "በነባሪ ፓነልን ያሳዩ",
    "Controls default visibility on page load. You can still toggle from the header button.": "በገጽ ጭነት ላይ ነባሪ ታይነትን ይቆጣጠራል. ",
    "Log cleared": "መዝገብ ተጸዳ",
    "Stop requested": "የተጠየቀውን አቁም",
    "Starting new chat...": "አዲስ ቻት መጀመር ...",
    "Using new chat button...": "አዲስ የውይይት ቁልፍን በመጠቀም ...",
    "Using home link...": "የቤት አገናኝን በመጠቀም ...",
    "Failed to start a new chat": "አዲስ ውይይት መጀመር አልተሳካም",
    "Invalid wait time, keeping current value": "ልክ ያልሆነ የጥበቃ ጊዜ, የአሁኑን እሴት መያዝ",
    "Invalid per-step wait time, keeping current value": "ልክ ያልሆነ የእግረኛ ደረጃ የጥበቃ ጊዜ, የወቅቱን እሴት መያዝ",
    "Chain valid": "ሰንሰለት ይሠራል",
    "Chain invalid": "ሰንሰለት ልክ ያልሆነ"
  },
  "ar": {
    "Typing...": "الكتابة ...",
    "Waiting for response...": "في انتظار الرد ...",
    "Complete": "مكتمل",
    "Error": "خطأ",
    "Activity Log": "سجل النشاط",
    "Add Step": "أضف خطوة",
    "Response timeout (ms):": "مهلة الاستجابة (MS):",
    "Visibility:": "الرؤية:",
    "Show panel by default": "عرض اللوحة افتراضيًا",
    "Controls default visibility on page load. You can still toggle from the header button.": "يتحكم في الرؤية الافتراضية في تحميل الصفحة. ",
    "Log cleared": "سجل مسح",
    "Stop requested": "توقف",
    "Starting new chat...": "بدء دردشة جديدة ...",
    "Using new chat button...": "باستخدام زر الدردشة الجديد ...",
    "Using home link...": "باستخدام رابط المنزل ...",
    "Failed to start a new chat": "فشل في بدء دردشة جديدة",
    "Invalid wait time, keeping current value": "وقت انتظار غير صالح ، مع الحفاظ على القيمة الحالية",
    "Invalid per-step wait time, keeping current value": "وقت انتظار غير صالح لكل خطوة ، مع الحفاظ على القيمة الحالية",
    "Chain valid": "سلسلة صالحة",
    "Chain invalid": "سلسلة غير صالحة"
  },
  "hy": {
    "Typing...": "Մուտքագրում ...",
    "Waiting for response...": "Սպասում եմ պատասխան ...",
    "Complete": "Լրիվ",
    "Error": "Սխալ",
    "Activity Log": "Գործունեության մատյան",
    "Add Step": "Ավելացնել քայլ",
    "Response timeout (ms):": "Արձագանքման ժամանակ (MS).",
    "Visibility:": "Տեսանելիություն.",
    "Show panel by default": "Show ուցադրել վահանակը լռելյայն",
    "Controls default visibility on page load. You can still toggle from the header button.": "Վերահսկում է լռելյայն տեսանելիությունը էջի բեռնման վրա: ",
    "Log cleared": "Log Cleared",
    "Stop requested": "Դադարեք պահանջել",
    "Starting new chat...": "Նոր զրույց սկսելով ...",
    "Using new chat button...": "Օգտագործելով նոր զրույցի կոճակը ...",
    "Using home link...": "Օգտագործելով տնային կապը ...",
    "Failed to start a new chat": "Չհաջողվեց սկսել նոր զրույց",
    "Invalid wait time, keeping current value": "Անվավեր սպասելու ժամանակը, ընթացիկ արժեքը պահելով",
    "Invalid per-step wait time, keeping current value": "Անվավեր յուրաքանչյուր քայլի սպասման ժամանակը, պահելով ընթացիկ արժեքը",
    "Chain valid": "Շղթայական վավեր",
    "Chain invalid": "Շղթա անվավեր"
  },
  "bn": {
    "Typing...": "টাইপিং ...",
    "Waiting for response...": "প্রতিক্রিয়ার জন্য অপেক্ষা করছি ...",
    "Complete": "সম্পূর্ণ",
    "Error": "ত্রুটি",
    "Activity Log": "ক্রিয়াকলাপ লগ",
    "Add Step": "পদক্ষেপ যোগ করুন",
    "Response timeout (ms):": "প্রতিক্রিয়া সময়সীমা (এমএস):",
    "Visibility:": "দৃশ্যমানতা:",
    "Show panel by default": "ডিফল্টরূপে প্যানেল দেখান",
    "Controls default visibility on page load. You can still toggle from the header button.": "পৃষ্ঠা লোডে ডিফল্ট দৃশ্যমানতা নিয়ন্ত্রণ করে। ",
    "Log cleared": "লগ সাফ",
    "Stop requested": "অনুরোধ করা বন্ধ করুন",
    "Starting new chat...": "নতুন চ্যাট শুরু হচ্ছে ...",
    "Using new chat button...": "নতুন চ্যাট বোতাম ব্যবহার করে ...",
    "Using home link...": "হোম লিঙ্ক ব্যবহার করে ...",
    "Failed to start a new chat": "একটি নতুন চ্যাট শুরু করতে ব্যর্থ",
    "Invalid wait time, keeping current value": "অবৈধ অপেক্ষা করার সময়, বর্তমান মূল্য রেখে",
    "Invalid per-step wait time, keeping current value": "বর্তমান মান রেখে, প্রতি পদক্ষেপের অপেক্ষা করার সময় অবৈধ",
    "Chain valid": "চেইন বৈধ",
    "Chain invalid": "চেইন অবৈধ"
  },
  "bs": {
    "Typing...": "Kucanje ...",
    "Waiting for response...": "Čeka se odgovor ...",
    "Complete": "Potpun",
    "Error": "Greška",
    "Activity Log": "Dnevnik aktivnosti",
    "Add Step": "Dodajte korak",
    "Response timeout (ms):": "Istek vremena odgovora (MS):",
    "Visibility:": "Vidljivost:",
    "Show panel by default": "Prikaži ploču prema zadanim postavkama",
    "Controls default visibility on page load. You can still toggle from the header button.": "Kontrolira zadanu vidljivost na opterećenju stranice. ",
    "Log cleared": "Dnevnik se očišćeno",
    "Stop requested": "Zaustavite se zatraženo",
    "Starting new chat...": "Početak novog chata ...",
    "Using new chat button...": "Upotreba novog gumba za chat ...",
    "Using home link...": "Korištenje kućne veze ...",
    "Failed to start a new chat": "Nije uspjelo pokretanje novog chata",
    "Invalid wait time, keeping current value": "Nevažeće vrijeme čekanja, čuvanje trenutne vrijednosti",
    "Invalid per-step wait time, keeping current value": "Nevažeće vrijeme čekanja, čuvanje trenutne vrijednosti",
    "Chain valid": "Lanac važeći",
    "Chain invalid": "Lanac nevaljan"
  },
  "bg": {
    "Typing...": "Писане ...",
    "Waiting for response...": "В очакване на отговор ...",
    "Complete": "Завършен",
    "Error": "Грешка",
    "Activity Log": "Дневник на дейността",
    "Add Step": "Добавете стъпка",
    "Response timeout (ms):": "Времето за отговор на отговора (MS):",
    "Visibility:": "Видимост:",
    "Show panel by default": "Показване на панела по подразбиране",
    "Controls default visibility on page load. You can still toggle from the header button.": "Контролира видимостта по подразбиране на зареждането на страницата. ",
    "Log cleared": "Дневникът се изчиства",
    "Stop requested": "Стоп искане",
    "Starting new chat...": "Стартиране на нов чат ...",
    "Using new chat button...": "Използване на нов бутон за чат ...",
    "Using home link...": "Използване на домашна връзка ...",
    "Failed to start a new chat": "Не успя да започне нов чат",
    "Invalid wait time, keeping current value": "Невалидно време за изчакване, запазване на текущата стойност",
    "Invalid per-step wait time, keeping current value": "Невалидно време за изчакване на стъпка, запазване на текущата стойност",
    "Chain valid": "Валидна верига",
    "Chain invalid": "Верига невалидна"
  },
  "my": {
    "Typing...": "စာရိုက် ...",
    "Waiting for response...": "တုံ့ပြန်မှုကိုစောင့်ဆိုင်း ...",
    "Complete": "ပြည့်စုံသော",
    "Error": "အမှား",
    "Activity Log": "လှုပ်ရှားမှုမှတ်တမ်း",
    "Add Step": "ခြေလှမ်းပေါင်းထည့်ပါ",
    "Response timeout (ms):": "တုံ့ပြန်မှုအချိန် (MS):",
    "Visibility:": "မြင်သာ:",
    "Show panel by default": "ပုံမှန်အားဖြင့် panel ကိုပြပါ",
    "Controls default visibility on page load. You can still toggle from the header button.": "စာမျက်နှာဝန်အပေါ်ပုံမှန်မြင်သာနိုင်မှုကိုထိန်းချုပ်သည်။ ",
    "Log cleared": "log ရှင်းလင်း",
    "Stop requested": "တောင်းဆိုမှုကိုရပ်တန့်",
    "Starting new chat...": "ချက်တင်အသစ်စတင်ခြင်း ...",
    "Using new chat button...": "Chat ခလုတ်အသစ်ကို သုံး. ...",
    "Using home link...": "မူလစာမျက်နှာလင့်ခ်ကိုအသုံးပြုခြင်း ...",
    "Failed to start a new chat": "ချက်တင်အသစ်တစ်ခုကိုစတင်ရန်မအောင်မြင်ပါ",
    "Invalid wait time, keeping current value": "လက်ရှိတန်ဖိုးကိုစောင့်ရှောက်ရန်မမှန်ကန်သောစောင့်ဆိုင်းအချိန်",
    "Invalid per-step wait time, keeping current value": "လက်ရှိတန်ဖိုးကိုစောင့်ရှောက်ခြင်း,",
    "Chain valid": "ကွင်းဆက်တရားဝင်",
    "Chain invalid": "ကွင်းဆက်မမှန်ကန်ပါ"
  },
  "ca": {
    "Typing...": "Escrivint ...",
    "Waiting for response...": "Esperant la resposta ...",
    "Complete": "Sencer",
    "Error": "Error",
    "Activity Log": "Registre d’activitats",
    "Add Step": "Afegiu el pas",
    "Response timeout (ms):": "Temps de temps de resposta (MS):",
    "Visibility:": "Visibilitat:",
    "Show panel by default": "Mostra el panell de manera predeterminada",
    "Controls default visibility on page load. You can still toggle from the header button.": "Controla la visibilitat per defecte a la càrrega de la pàgina. ",
    "Log cleared": "Registre esborrat",
    "Stop requested": "STOP SOL·LICITAT",
    "Starting new chat...": "Començant un nou xat ...",
    "Using new chat button...": "Utilitzant un nou botó de xat ...",
    "Using home link...": "Utilitzant enllaç a casa ...",
    "Failed to start a new chat": "No s'ha pogut iniciar un nou xat",
    "Invalid wait time, keeping current value": "Temps d’espera no vàlid, mantenint el valor actual",
    "Invalid per-step wait time, keeping current value": "El temps d'espera per pas no és vàlid, mantenint el valor actual",
    "Chain valid": "Cadena vàlida",
    "Chain invalid": "Cadena no vàlida"
  },
  "zh": {
    "Typing...": "打字...",
    "Waiting for response...": "等待回应...",
    "Complete": "完全的",
    "Error": "错误",
    "Activity Log": "活动日志",
    "Add Step": "添加步骤",
    "Response timeout (ms):": "响应超时（MS）：",
    "Visibility:": "能见度：",
    "Show panel by default": "默认显示面板",
    "Controls default visibility on page load. You can still toggle from the header button.": "控制页面加载上的默认可见性。",
    "Log cleared": "日志清除",
    "Stop requested": "停止请求",
    "Starting new chat...": "开始新聊天...",
    "Using new chat button...": "使用新的聊天按钮...",
    "Using home link...": "使用家庭链接...",
    "Failed to start a new chat": "无法开始新聊天",
    "Invalid wait time, keeping current value": "等待时间无效，保持当前价值",
    "Invalid per-step wait time, keeping current value": "每步等待时间无效，保持当前价值",
    "Chain valid": "链有效",
    "Chain invalid": "链条无效"
  },
  "hr": {
    "Typing...": "Upisivanje ...",
    "Waiting for response...": "Čekajući odgovor ...",
    "Complete": "Cjelovit",
    "Error": "Pogreška",
    "Activity Log": "Dnevnik aktivnosti",
    "Add Step": "Dodajte korak",
    "Response timeout (ms):": "Timeout odgovora (MS):",
    "Visibility:": "Vidljivost:",
    "Show panel by default": "Prikaži ploču prema zadanim postavkama",
    "Controls default visibility on page load. You can still toggle from the header button.": "Kontrolira zadanu vidljivost na učitavanju stranice. ",
    "Log cleared": "Očišćena trupca",
    "Stop requested": "Zaustavite traženo",
    "Starting new chat...": "Početak novog chata ...",
    "Using new chat button...": "Korištenje novog gumba za chat ...",
    "Using home link...": "Korištenje kućne veze ...",
    "Failed to start a new chat": "Nije uspjelo započeti novi chat",
    "Invalid wait time, keeping current value": "Nevažeće vrijeme čekanja, zadržavajući trenutnu vrijednost",
    "Invalid per-step wait time, keeping current value": "Nevaljano vrijeme čekanja na korak, zadržavajući trenutnu vrijednost",
    "Chain valid": "Lanac vrijedan",
    "Chain invalid": "Lanac nevažeći"
  },
  "cs": {
    "Typing...": "Psaní ...",
    "Waiting for response...": "Čekání na odpověď ...",
    "Complete": "Kompletní",
    "Error": "Chyba",
    "Activity Log": "Protokol aktivity",
    "Add Step": "Přidejte krok",
    "Response timeout (ms):": "Časový limit odezvy (MS):",
    "Visibility:": "Viditelnost:",
    "Show panel by default": "Ve výchozím nastavení panel zobrazení",
    "Controls default visibility on page load. You can still toggle from the header button.": "Řídí výchozí viditelnost na zatížení stránky. ",
    "Log cleared": "Protokol vymazán",
    "Stop requested": "Přestaň požadovat",
    "Starting new chat...": "Zahájení nového chatu ...",
    "Using new chat button...": "Použití nového tlačítka chatu ...",
    "Using home link...": "Používání domácího odkazu ...",
    "Failed to start a new chat": "Nepodařilo se spustit nový chat",
    "Invalid wait time, keeping current value": "Neplatná čekací doba, zachování aktuální hodnoty",
    "Invalid per-step wait time, keeping current value": "Neplatná doba čekání na krok, udržování aktuální hodnoty",
    "Chain valid": "Řetězec platný",
    "Chain invalid": "Řetězec neplatný"
  },
  "da": {
    "Typing...": "Skrivning ...",
    "Waiting for response...": "Venter på svar ...",
    "Complete": "Komplet",
    "Error": "Fejl",
    "Activity Log": "Aktivitetslog",
    "Add Step": "Tilføj trin",
    "Response timeout (ms):": "Response Timeout (MS):",
    "Visibility:": "Sigtbarhed:",
    "Show panel by default": "Vis panel som standard",
    "Controls default visibility on page load. You can still toggle from the header button.": "Kontrollerer standard synlighed på sidebelastning. ",
    "Log cleared": "Log ryddet",
    "Stop requested": "Stop anmodet om",
    "Starting new chat...": "Start af ny chat ...",
    "Using new chat button...": "Brug af ny chatknap ...",
    "Using home link...": "Brug af hjemmelink ...",
    "Failed to start a new chat": "Kunne ikke starte en ny chat",
    "Invalid wait time, keeping current value": "Ugyldigt ventetid, holder den aktuelle værdi",
    "Invalid per-step wait time, keeping current value": "Ugyldigt ventetid pr. Trin, holder den aktuelle værdi",
    "Chain valid": "Kæde gyldig",
    "Chain invalid": "Kæde ugyldig"
  },
  "nl": {
    "Typing...": "Typen...",
    "Waiting for response...": "Wachten op reactie ...",
    "Complete": "Compleet",
    "Error": "Fout",
    "Activity Log": "Activiteitslogboek",
    "Add Step": "Step toevoegen",
    "Response timeout (ms):": "Reactie time -out (MS):",
    "Visibility:": "Zichtbaarheid:",
    "Show panel by default": "Standaard weergeven paneel",
    "Controls default visibility on page load. You can still toggle from the header button.": "Bestuurt standaard zichtbaarheid op pagina laden. ",
    "Log cleared": "Log gewist",
    "Stop requested": "Stop gevraagd",
    "Starting new chat...": "Nieuwe chat beginnen ...",
    "Using new chat button...": "Gebruik van een nieuwe chatknop ...",
    "Using home link...": "Home Link gebruiken ...",
    "Failed to start a new chat": "Kan geen nieuwe chat beginnen",
    "Invalid wait time, keeping current value": "Ongeldige wachttijd, de huidige waarde behouden",
    "Invalid per-step wait time, keeping current value": "Ongeldige wachttijd per stap, het behouden van de huidige waarde",
    "Chain valid": "Geldige ketting",
    "Chain invalid": "Ketting ongeldig"
  },
  "et": {
    "Typing...": "Tüüpi ...",
    "Waiting for response...": "Ootab vastust ...",
    "Complete": "Täielik",
    "Error": "Viga",
    "Activity Log": "Tegevuslogi",
    "Add Step": "Lisada samm",
    "Response timeout (ms):": "Reageerimise ajalõpp (MS):",
    "Visibility:": "Nähtavus:",
    "Show panel by default": "Kuva vaikimisi paneel",
    "Controls default visibility on page load. You can still toggle from the header button.": "Kontrollib vaikimisi nähtavus lehe laadimisel. ",
    "Log cleared": "Logi kustutatud",
    "Stop requested": "Taotletud peatus",
    "Starting new chat...": "Uue vestluse alustamine ...",
    "Using new chat button...": "Uue vestlusnupu kasutamine ...",
    "Using home link...": "Kodulinki kasutamine ...",
    "Failed to start a new chat": "Uue vestluse alustamine ebaõnnestus",
    "Invalid wait time, keeping current value": "Kehtetu ooteaeg, hoides praegust väärtust",
    "Invalid per-step wait time, keeping current value": "Kehtetu astme ooteaeg, hoides praegust väärtust",
    "Chain valid": "Kett kehtiv",
    "Chain invalid": "Kett kehtetu"
  },
  "fi": {
    "Typing...": "Kirjoittaminen ...",
    "Waiting for response...": "Odottaa vastausta ...",
    "Complete": "Täydellinen",
    "Error": "Virhe",
    "Activity Log": "Aktiviteettiloki",
    "Add Step": "Lisätä",
    "Response timeout (ms):": "Vastausaikakatkaisu (MS):",
    "Visibility:": "Näkyvyys:",
    "Show panel by default": "Näytä paneeli oletuksena",
    "Controls default visibility on page load. You can still toggle from the header button.": "Ohjaa oletuksena näkyvyys sivun latauksella. ",
    "Log cleared": "Loki puhdistettu",
    "Stop requested": "Lopeta pyydetty",
    "Starting new chat...": "Uuden chatin aloittaminen ...",
    "Using new chat button...": "Uuden chat -painikkeen käyttäminen ...",
    "Using home link...": "Kodin linkin käyttäminen ...",
    "Failed to start a new chat": "Uuden chatin aloittaminen epäonnistui",
    "Invalid wait time, keeping current value": "Virheellinen odotusaika, nykyisen arvon pitäminen",
    "Invalid per-step wait time, keeping current value": "Virheellinen vaihe-odotusaika, nykyisen arvon pitäminen",
    "Chain valid": "Ketju kelvollinen",
    "Chain invalid": "Ketju"
  },
  "fr": {
    "Typing...": "Dactylographie...",
    "Waiting for response...": "En attente de réponse ...",
    "Complete": "Complet",
    "Error": "Erreur",
    "Activity Log": "Journal d'activité",
    "Add Step": "Ajouter une étape",
    "Response timeout (ms):": "Délai de réponse (MS):",
    "Visibility:": "Visibilité:",
    "Show panel by default": "Afficher le panneau par défaut",
    "Controls default visibility on page load. You can still toggle from the header button.": "Contrôle la visibilité par défaut sur le chargement de la page. ",
    "Log cleared": "Journal effacé",
    "Stop requested": "Arrêt demandé",
    "Starting new chat...": "Démarrer un nouveau chat ...",
    "Using new chat button...": "Utilisation du nouveau bouton de chat ...",
    "Using home link...": "Utilisation du lien à domicile ...",
    "Failed to start a new chat": "N'a pas réussi à démarrer une nouvelle conversation",
    "Invalid wait time, keeping current value": "Temps d'attente non valide, en gardant la valeur actuelle",
    "Invalid per-step wait time, keeping current value": "Temps d'attente par étape non valide, en gardant la valeur actuelle",
    "Chain valid": "Chaîne valide",
    "Chain invalid": "Chaîne non valide"
  },
  "ka": {
    "Typing...": "აკრეფა ...",
    "Waiting for response...": "პასუხის მოლოდინში ...",
    "Complete": "სრული",
    "Error": "შეცდომა",
    "Activity Log": "საქმიანობის ჟურნალი",
    "Add Step": "ნაბიჯის დამატება",
    "Response timeout (ms):": "რეაგირების ვადა (MS):",
    "Visibility:": "ხილვადობა:",
    "Show panel by default": "აჩვენეთ პანელი ნაგულისხმევი",
    "Controls default visibility on page load. You can still toggle from the header button.": "აკონტროლებს ნაგულისხმევი ხილვადობას გვერდის დატვირთვაზე. ",
    "Log cleared": "ჟურნალი გაწმენდილია",
    "Stop requested": "შეაჩერე მოთხოვნა",
    "Starting new chat...": "ახალი ჩეთის დაწყება ...",
    "Using new chat button...": "ახალი ჩატის ღილაკის გამოყენებით ...",
    "Using home link...": "სახლის ბმულის გამოყენებით ...",
    "Failed to start a new chat": "ვერ შეძლო ახალი ჩეთის წამოწყება",
    "Invalid wait time, keeping current value": "არასწორი ლოდინის დრო, მიმდინარე მნიშვნელობის შენარჩუნება",
    "Invalid per-step wait time, keeping current value": "არასწორი ნაბიჯის ლოდინის დრო, მიმდინარე მნიშვნელობის შენარჩუნება",
    "Chain valid": "ჯაჭვი ძალაშია",
    "Chain invalid": "ჯაჭვის არასწორი"
  },
  "de": {
    "Typing...": "Tippen ...",
    "Waiting for response...": "Warten auf die Antwort ...",
    "Complete": "Vollständig",
    "Error": "Fehler",
    "Activity Log": "Aktivitätsprotokoll",
    "Add Step": "Schritt hinzufügen",
    "Response timeout (ms):": "Antwort Timeout (MS):",
    "Visibility:": "Sichtweite:",
    "Show panel by default": "Panel standardmäßig anzeigen",
    "Controls default visibility on page load. You can still toggle from the header button.": "Steuert die Standard -Sichtbarkeit auf der Seitenlast. ",
    "Log cleared": "Protokoll gelöscht",
    "Stop requested": "Stopp angefordert",
    "Starting new chat...": "Neuen Chat beginnen ...",
    "Using new chat button...": "Verwenden neuer Chat -Schaltflächen ...",
    "Using home link...": "Verwenden von Home Link ...",
    "Failed to start a new chat": "Versäumte es, einen neuen Chat zu beginnen",
    "Invalid wait time, keeping current value": "Ungültige Wartezeit, den aktuellen Wert beibehalten",
    "Invalid per-step wait time, keeping current value": "Ungültige Wartezeit pro Schritt, halten Sie den aktuellen Wert",
    "Chain valid": "Kette gültig",
    "Chain invalid": "Kette ungültig"
  },
  "el": {
    "Typing...": "Δακτυλογραφία...",
    "Waiting for response...": "Αναμονή για απάντηση ...",
    "Complete": "Πλήρης",
    "Error": "Σφάλμα",
    "Activity Log": "Αρχείο καταγραφής δραστηριοτήτων",
    "Add Step": "Προσθέστε βήμα",
    "Response timeout (ms):": "Timeout Response (MS):",
    "Visibility:": "Ορατότητα:",
    "Show panel by default": "Εμφάνιση πίνακα από προεπιλογή",
    "Controls default visibility on page load. You can still toggle from the header button.": "Ελέγχει προεπιλεγμένη ορατότητα στη φόρτιση σελίδας. ",
    "Log cleared": "Εκκαθαρισμένος",
    "Stop requested": "Ζητήστε διακοπή",
    "Starting new chat...": "Ξεκινώντας νέα συνομιλία ...",
    "Using new chat button...": "Χρήση νέου κουμπιού συνομιλίας ...",
    "Using home link...": "Χρησιμοποιώντας το Home Link ...",
    "Failed to start a new chat": "Απέτυχε να ξεκινήσει μια νέα συνομιλία",
    "Invalid wait time, keeping current value": "Μη έγκυρος χρόνος αναμονής, διατηρώντας την τρέχουσα αξία",
    "Invalid per-step wait time, keeping current value": "Μη έγκυρος χρόνος αναμονής ανά βήμα, διατηρώντας την τρέχουσα αξία",
    "Chain valid": "Έγκυρη αλυσίδα",
    "Chain invalid": "Μη έγκυρο αλυσίδα"
  },
  "gu": {
    "Typing...": "ટાઇપ ...",
    "Waiting for response...": "પ્રતિસાદની રાહ જોવી ...",
    "Complete": "પૂર્ણ",
    "Error": "ભૂલ",
    "Activity Log": "પ્રવૃત્તિ લ .ગ",
    "Add Step": "પગલું ઉમેરો",
    "Response timeout (ms):": "પ્રતિસાદ સમયસમાપ્તિ (એમએસ):",
    "Visibility:": "દૃશ્યતા:",
    "Show panel by default": "ડિફ default લ્ટ રૂપે પેનલ બતાવો",
    "Controls default visibility on page load. You can still toggle from the header button.": "પૃષ્ઠ લોડ પર ડિફ default લ્ટ દૃશ્યતાને નિયંત્રિત કરે છે. ",
    "Log cleared": "લોગ સાફ",
    "Stop requested": "વિનંતી",
    "Starting new chat...": "નવી ચેટ શરૂ કરી રહ્યા છીએ ...",
    "Using new chat button...": "નવા ચેટ બટનનો ઉપયોગ કરીને ...",
    "Using home link...": "હોમ લિંકનો ઉપયોગ કરીને ...",
    "Failed to start a new chat": "નવી ચેટ શરૂ કરવામાં નિષ્ફળ",
    "Invalid wait time, keeping current value": "વર્તમાન મૂલ્ય રાખીને, અમાન્ય પ્રતીક્ષા સમય",
    "Invalid per-step wait time, keeping current value": "વર્તમાન મૂલ્ય રાખીને, પ્રતિ-પગલાની રાહ જોવાનો અમાન્ય",
    "Chain valid": "વકીલ",
    "Chain invalid": "સાંકળ અમાન્ય"
  },
  "hi": {
    "Typing...": "टाइपिंग ...",
    "Waiting for response...": "प्रतिक्रिया के लिए प्रतीक्षा कर रहा हूँ...",
    "Complete": "पूरा",
    "Error": "गलती",
    "Activity Log": "गतिविधि लॉग",
    "Add Step": "कदम जोड़ें",
    "Response timeout (ms):": "प्रतिक्रिया टाइमआउट (एमएस):",
    "Visibility:": "दृश्यता:",
    "Show panel by default": "डिफ़ॉल्ट रूप से पैनल दिखाएं",
    "Controls default visibility on page load. You can still toggle from the header button.": "पेज लोड पर डिफ़ॉल्ट दृश्यता को नियंत्रित करता है। ",
    "Log cleared": "लॉग क्लियर",
    "Stop requested": "अनुरोधित को रोकें",
    "Starting new chat...": "नई चैट शुरू करना ...",
    "Using new chat button...": "नए चैट बटन का उपयोग करना ...",
    "Using home link...": "होम लिंक का उपयोग करना ...",
    "Failed to start a new chat": "एक नई चैट शुरू करने में विफल रहा",
    "Invalid wait time, keeping current value": "अमान्य प्रतीक्षा समय, वर्तमान मूल्य रखते हुए",
    "Invalid per-step wait time, keeping current value": "अमान्य प्रति-चरण प्रतीक्षा समय, वर्तमान मूल्य रखते हुए",
    "Chain valid": "मान्य श्रृंखला",
    "Chain invalid": "चेन अमान्य"
  },
  "hu": {
    "Typing...": "Gépelés...",
    "Waiting for response...": "Várakozás a válaszra ...",
    "Complete": "Teljes",
    "Error": "Hiba",
    "Activity Log": "Tevékenységi napló",
    "Add Step": "Adjon hozzá lépést",
    "Response timeout (ms):": "Válasz időtúllépése (MS):",
    "Visibility:": "Láthatóság:",
    "Show panel by default": "Alapértelmezés szerint megjelenítés a panelen",
    "Controls default visibility on page load. You can still toggle from the header button.": "Vezérlők Az alapértelmezett láthatóság az oldal betöltésén. ",
    "Log cleared": "Naplót törölt",
    "Stop requested": "A kért abbahagyott",
    "Starting new chat...": "Új csevegés indítása ...",
    "Using new chat button...": "Új chat gomb használata ...",
    "Using home link...": "Haza link használata ...",
    "Failed to start a new chat": "Nem sikerült új csevegést indítani",
    "Invalid wait time, keeping current value": "Érvénytelen várakozási idő, az aktuális érték megtartása",
    "Invalid per-step wait time, keeping current value": "Érvénytelen lépésről lépésre várakozási idő, az aktuális érték megtartása",
    "Chain valid": "Lánc érvényes",
    "Chain invalid": "Érvénytelen lánc"
  },
  "is": {
    "Typing...": "Vélrit ...",
    "Waiting for response...": "Bíð eftir svörum ...",
    "Complete": "Heill",
    "Error": "Villa",
    "Activity Log": "Virkni log",
    "Add Step": "Bættu við skrefi",
    "Response timeout (ms):": "Svar tímamörk (MS):",
    "Visibility:": "Skyggni:",
    "Show panel by default": "Sýna spjaldið sjálfgefið",
    "Controls default visibility on page load. You can still toggle from the header button.": "Stýrir sjálfgefnu skyggni á blaðsíðuálagi. ",
    "Log cleared": "Log hreinsað",
    "Stop requested": "Hættu að biðja",
    "Starting new chat...": "Byrja nýtt spjall ...",
    "Using new chat button...": "Notaðu nýjan spjallhnapp ...",
    "Using home link...": "Nota heimatengil ...",
    "Failed to start a new chat": "Ekki tókst að hefja nýtt spjall",
    "Invalid wait time, keeping current value": "Ógildur biðtími, halda núverandi gildi",
    "Invalid per-step wait time, keeping current value": "Ógildur biðtími á hverri skrefi, heldur núverandi gildi",
    "Chain valid": "Keðju gild",
    "Chain invalid": "Keðju ógild"
  },
  "id": {
    "Typing...": "Mengetik...",
    "Waiting for response...": "Menunggu tanggapan ...",
    "Complete": "Menyelesaikan",
    "Error": "Kesalahan",
    "Activity Log": "Log aktivitas",
    "Add Step": "Tambahkan langkah",
    "Response timeout (ms):": "Timeout Respons (MS):",
    "Visibility:": "Visibilitas:",
    "Show panel by default": "Tampilkan panel secara default",
    "Controls default visibility on page load. You can still toggle from the header button.": "Mengontrol visibilitas default pada pemuatan halaman. ",
    "Log cleared": "Log dihapus",
    "Stop requested": "Berhenti diminta",
    "Starting new chat...": "Memulai obrolan baru ...",
    "Using new chat button...": "Menggunakan tombol obrolan baru ...",
    "Using home link...": "Menggunakan tautan rumah ...",
    "Failed to start a new chat": "Gagal memulai obrolan baru",
    "Invalid wait time, keeping current value": "Waktu tunggu tidak valid, menjaga nilai saat ini",
    "Invalid per-step wait time, keeping current value": "Waktu tunggu per langkah tidak valid, menjaga nilai saat ini",
    "Chain valid": "Rantai valid",
    "Chain invalid": "Rantai tidak valid"
  },
  "it": {
    "Typing...": "Digitazione ...",
    "Waiting for response...": "Aspettando la risposta ...",
    "Complete": "Completare",
    "Error": "Errore",
    "Activity Log": "Registro delle attività",
    "Add Step": "Aggiungi passo",
    "Response timeout (ms):": "Timeout di risposta (MS):",
    "Visibility:": "Visibilità:",
    "Show panel by default": "Mostra pannello per impostazione predefinita",
    "Controls default visibility on page load. You can still toggle from the header button.": "Controlla la visibilità predefinita nel caricamento della pagina. ",
    "Log cleared": "Log è stato cancellato",
    "Stop requested": "Stop richiesto",
    "Starting new chat...": "Avvio di una nuova chat ...",
    "Using new chat button...": "Utilizzando il nuovo pulsante di chat ...",
    "Using home link...": "Usando Home Link ...",
    "Failed to start a new chat": "Impossibile avviare una nuova chat",
    "Invalid wait time, keeping current value": "Tempo di attesa non valido, mantenendo il valore corrente",
    "Invalid per-step wait time, keeping current value": "Tempo di attesa non valido per fase, mantenendo il valore attuale",
    "Chain valid": "Catena valida",
    "Chain invalid": "Catena non valida"
  },
  "ja": {
    "Typing...": "タイピング...",
    "Waiting for response...": "応答を待っています...",
    "Complete": "完了",
    "Error": "エラー",
    "Activity Log": "アクティビティログ",
    "Add Step": "ステップを追加します",
    "Response timeout (ms):": "応答タイムアウト（MS）：",
    "Visibility:": "可視性：",
    "Show panel by default": "デフォルトでパネルを表示します",
    "Controls default visibility on page load. You can still toggle from the header button.": "ページの読み込みでデフォルトの可視性を制御します。",
    "Log cleared": "ログがクリアされました",
    "Stop requested": "リクエストを停止します",
    "Starting new chat...": "新しいチャットを開始...",
    "Using new chat button...": "新しいチャットボタンを使用...",
    "Using home link...": "ホームリンクを使用...",
    "Failed to start a new chat": "新しいチャットを開始できませんでした",
    "Invalid wait time, keeping current value": "現在の価値を維持し、無効な待ち時間",
    "Invalid per-step wait time, keeping current value": "現在の価値を維持し、ステップごとの待機時間を無効にします",
    "Chain valid": "有効なチェーン",
    "Chain invalid": "チェーンが無効です"
  },
  "kn": {
    "Typing...": "ಟೈಪಿಂಗ್ ...",
    "Waiting for response...": "ಪ್ರತಿಕ್ರಿಯೆಗಾಗಿ ಕಾಯಲಾಗುತ್ತಿದೆ ...",
    "Complete": "ಪೂರ್ಣ",
    "Error": "ದೋಷ",
    "Activity Log": "ಚಟುವಟಿಕೆ ಲಾಗ್",
    "Add Step": "ಹಂತ ಸೇರಿಸಿ",
    "Response timeout (ms):": "ಪ್ರತಿಕ್ರಿಯೆ ಸಮಯ ಮೀರಿದೆ (ಎಂಎಸ್):",
    "Visibility:": "ಗೋಚರತೆ:",
    "Show panel by default": "ಪೂರ್ವನಿಯೋಜಿತವಾಗಿ ಫಲಕವನ್ನು ತೋರಿಸಿ",
    "Controls default visibility on page load. You can still toggle from the header button.": "ಪುಟ ಲೋಡ್‌ನಲ್ಲಿ ಡೀಫಾಲ್ಟ್ ಗೋಚರತೆಯನ್ನು ನಿಯಂತ್ರಿಸುತ್ತದೆ. ",
    "Log cleared": "ಲಾಗ್ ತೆರವುಗೊಂಡಿದೆ",
    "Stop requested": "ವಿನಂತಿಸಲಾಗಿದೆ",
    "Starting new chat...": "ಹೊಸ ಚಾಟ್ ಪ್ರಾರಂಭಿಸಲಾಗುತ್ತಿದೆ ...",
    "Using new chat button...": "ಹೊಸ ಚಾಟ್ ಬಟನ್ ಬಳಸುವುದು ...",
    "Using home link...": "ಹೋಮ್ ಲಿಂಕ್ ಬಳಸುವುದು ...",
    "Failed to start a new chat": "ಹೊಸ ಚಾಟ್ ಪ್ರಾರಂಭಿಸಲು ವಿಫಲವಾಗಿದೆ",
    "Invalid wait time, keeping current value": "ಅಮಾನ್ಯ ಕಾಯುವ ಸಮಯ, ಪ್ರಸ್ತುತ ಮೌಲ್ಯವನ್ನು ಇಟ್ಟುಕೊಳ್ಳಿ",
    "Invalid per-step wait time, keeping current value": "ಪ್ರಸ್ತುತ ಮೌಲ್ಯವನ್ನು ಇಟ್ಟುಕೊಂಡು ಪ್ರತಿ ಹಂತದ ಕಾಯುವ ಸಮಯ ಅಮಾನ್ಯವಾಗಿದೆ",
    "Chain valid": "ಸರಪಳಿ ಮಾನ್ಯ",
    "Chain invalid": "ಸರಪಳಿ ಅಮಾನ್ಯವಾಗಿದೆ"
  },
  "kk": {
    "Typing...": "Теру ...",
    "Waiting for response...": "Жауап күтеді ...",
    "Complete": "Аяқталған",
    "Error": "Қателік",
    "Activity Log": "Әрекет журналы",
    "Add Step": "Қадам қосыңыз",
    "Response timeout (ms):": "Жауап күту уақыты (MS):",
    "Visibility:": "Көріну:",
    "Show panel by default": "Әдепкі бойынша панельді көрсету",
    "Controls default visibility on page load. You can still toggle from the header button.": "Беттегі жүктеме бойынша әдепкі көріністі басқарады. ",
    "Log cleared": "Журналды тазалаңыз",
    "Stop requested": "Сұрауды тоқтату",
    "Starting new chat...": "Жаңа чатты бастау ...",
    "Using new chat button...": "Жаңа чат түймесін пайдалану ...",
    "Using home link...": "Үйге сілтемені пайдалану ...",
    "Failed to start a new chat": "Жаңа чатты бастай алмады",
    "Invalid wait time, keeping current value": "Ағымдағы мәнді сақтау мерзімі жарамсыз",
    "Invalid per-step wait time, keeping current value": "Ағымдағы мәнді сақтау үшін күту уақыты жарамсыз",
    "Chain valid": "Желісі жарамды",
    "Chain invalid": "Тізбек жарамсыз"
  },
  "ko": {
    "Typing...": "타자...",
    "Waiting for response...": "응답을 기다리고 ...",
    "Complete": "완벽한",
    "Error": "오류",
    "Activity Log": "활동 로그",
    "Add Step": "단계를 추가하십시오",
    "Response timeout (ms):": "응답 시간 초과 (MS) :",
    "Visibility:": "시계:",
    "Show panel by default": "기본적으로 패널을 표시하십시오",
    "Controls default visibility on page load. You can still toggle from the header button.": "페이지로드의 기본 가시성을 제어합니다. ",
    "Log cleared": "로그가 지워졌습니다",
    "Stop requested": "요청을 중지하십시오",
    "Starting new chat...": "새 채팅 시작 ...",
    "Using new chat button...": "새 채팅 버튼 사용 ...",
    "Using home link...": "홈 링크 사용 ...",
    "Failed to start a new chat": "새로운 채팅을 시작하지 못했습니다",
    "Invalid wait time, keeping current value": "유효하지 않은 대기 시간, 현재 값을 유지합니다",
    "Invalid per-step wait time, keeping current value": "현재 값을 유지하면서 단계별 대기 시간이 잘못되었습니다",
    "Chain valid": "체인 유효합니다",
    "Chain invalid": "체인이 유효하지 않습니다"
  }
};

for (const lang in extraTranslations) {
  translations[lang] = { ...(translations[lang] || {}), ...extraTranslations[lang] };
}

  const translator = {
    instant(text) {
      const lang = state.userLanguage;
      if (lang === 'en' || !text || !text.trim()) return text;
      return translations[lang]?.[text] || text;
    },
    translate(text) {
      return translator.instant(text);
    },
    replaceHTML(html) {
      const lang = state.userLanguage;
      if (lang === 'en') return html;
      const dict = translations[lang];
      if (!dict) return html;
      const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return Object.entries(dict).reduce((acc, [en, loc]) => {
        const re = new RegExp(esc(en), 'g');
        return acc.replace(re, loc);
      }, html);
    },
  };

  const processors = {
    executeCustomCode: async (code, responseText, templateData = null) => {
      if (!code || code.trim() === '') return;
      try {
        // Resolve context
        let item = templateData?.elementData ?? null;
        let index = templateData?.index ?? null;
        let total = templateData?.total ?? null;
        const stepsCtx = templateData?.steps ?? {};
        const lastResponse = templateData?.lastResponse ?? responseText;

        // Fallback: single dynamic element → provide as item when not in template mode
        if (!item) {
          try {
            const dynInput = document.getElementById('dynamic-elements-input');
            const val = dynInput && typeof dynInput.value === 'string' ? dynInput.value.trim() : '';
            if (val) {
              const arr = await processors.parseDynamicElements(val);
              if (Array.isArray(arr) && arr.length === 1) {
                item = arr[0];
                if (index == null) index = 1;
                if (total == null) total = 1;
                utils.log('Context fallback: using single dynamic element for custom code');
              }
            }
          } catch {}
        }

        if (CONFIG.DEBUG_MODE) {
          utils.log(
            `Custom code context: item=${item ? JSON.stringify(item).slice(0, 100) : 'null'}, index=${index}, total=${total}`
          );
        }

        // Execute user code via dynamic import to satisfy Chrome's CSP (avoids unsafe-eval)
        const wrapped = `export default async (response, log, console, item, index, total, http, steps, lastResponse, GM_getValue, GM_setValue, GM_xmlhttpRequest, unsafeWindow, utils) => {\n${code}\n}`;
        const blob = new Blob([wrapped], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        try {
          const module = await import(url);
          const result = await module.default(
            responseText,
            (msg, type = 'info') => utils.log(msg, type),
            console,
            item,
            index,
            total,
            http,
            stepsCtx,
            lastResponse,
            GM_getValue,
            GM_setValue,
            GM_xmlhttpRequest,
            unsafeWindow,
            utils
          );
          utils.log('Custom code executed successfully');
          return result;
        } finally {
          URL.revokeObjectURL(url);
        }
      } catch (error) {
        utils.log(`Custom code execution error: ${error.message}`, 'error');
        throw error;
      }
    },

    processDynamicTemplate: (template, dynamicData) => {
      if (!template) return '';
      const regex = /\{\{\s*([\w$.]+)\s*\}\}|\{\s*([\w$.]+)\s*\}/g;
      return template.replace(regex, (_, g1, g2) => {
        const keyPath = g1 || g2;
        let value = utils.getByPath(dynamicData, keyPath);
        if (value === undefined) return '';
        if (typeof value === 'object') {
          try {
            return JSON.stringify(value);
          } catch {
            return String(value);
          }
        }
        return String(value);
      });
    },

    parseDynamicElements: async (input) => {
      const raw = (input || '').trim();
      if (!raw) return [];

      if (raw.startsWith('[')) {
        try {
          return JSON.parse(raw);
        } catch (e) {
          utils.log(`Invalid JSON: ${e.message}`, 'error');
          return [];
        }
      }

      if (raw.startsWith('{')) {
        try {
          const obj = JSON.parse(raw);
          return [obj];
        } catch {}
      }

      try {
        const Fn = function () {}.constructor;
        const fn = new Fn('return ( ' + raw + ' )');
        const v = fn();
        const res = typeof v === 'function' ? v() : v;
        if (Array.isArray(res)) return res;
        if (res && typeof res === 'object') return [res];
        if (typeof res === 'string') {
          try {
            const parsed = JSON.parse(res);
            if (Array.isArray(parsed)) return parsed;
            if (parsed && typeof parsed === 'object') return [parsed];
          } catch {}
        }
        throw new Error('Result is not an array/object');
      } catch (error) {
        utils.log(`Error parsing dynamic elements: ${error.message}`, 'error');
        return [];
      }
    },
  };

  const uiState = {
    saveTimeout: null,

    save: (immediate = false) => {
      if (!ui.mainContainer) return;

      const doSave = () => {
        const stateData = {
          left: ui.mainContainer.style.left,
          top: ui.mainContainer.style.top,
          right: ui.mainContainer.style.right,
          minimized: state.isMinimized,
          visible: state.uiVisible,
        };
        utils.saveToStorage(STORAGE_KEYS.uiState, JSON.stringify(stateData));
      };

      if (immediate) {
        clearTimeout(uiState.saveTimeout);
        doSave();
      } else {
        clearTimeout(uiState.saveTimeout);
        uiState.saveTimeout = setTimeout(doSave, 100);
      }
    },

    load: () => {
      try {
        const saved = GM_getValue(STORAGE_KEYS.uiState, null);
        return saved ? JSON.parse(saved) : {};
      } catch {
        return {};
      }
    },
  };

  const chatGPT = {
    getChatInput: () => {
      const selectors = [
        '#prompt-textarea',
        'div[contenteditable="true"]',
        'textarea[placeholder*="Message"]',
        'div.ProseMirror',
      ];
      const el = utils.queryFirst(selectors);
      return el && el.isContentEditable !== false ? el : null;
    },

    getSendButton: () => {
      const selectors = [
        '#composer-submit-button',
        'button[data-testid="send-button"]',
        'button[aria-label*="Send"]',
        'button[aria-label*="submit"]',
      ];
      const btn = utils.queryFirst(selectors);
      return btn && !btn.disabled ? btn : null;
    },

    typeMessage: async (message) => {
      const input = chatGPT.getChatInput();
      if (!input) throw new Error('Chat input not found');

      if (input.tagName === 'DIV') {
        input.textContent = '';
        input.focus();
        const paragraph = document.createElement('p');
        paragraph.textContent = message;
        input.appendChild(paragraph);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        input.value = message;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }

      await utils.sleep(100);
      utils.log(`Message typed: "${utils.clip(message, 50)}"`);
    },

    sendMessage: async () => {
      const sendButton = chatGPT.getSendButton();
      if (!sendButton) throw new Error('Send button not available');
      sendButton.click();
      utils.log('Message sent');
      await utils.sleep(500);
    },

    ask: async (message) => {
      await chatGPT.typeMessage(message);
      await utils.sleep(300);
      await chatGPT.sendMessage();
      updateStatus('waiting');
      const el = await chatGPT.waitForResponse();
      return { el, text: chatGPT.extractResponseText(el) };
    },

    // ask with expectation option: { expect: 'image' | 'text' }
    askWith: async (message, options = { expect: 'text' }) => {
      await chatGPT.typeMessage(message);
      await utils.sleep(300);
      await chatGPT.sendMessage();
      updateStatus('waiting');
      const el = await chatGPT.waitForResponse();
      if (options.expect === 'image') {
        // Allow brief time for images to attach
        await utils.sleep(500);
        let images = chatGPT.extractResponseImages(el);
        if (!images || images.length === 0) {
          // Retry scan for late-loading images
          await utils.sleep(800);
          images = chatGPT.extractResponseImages(el);
        }
        return { el, images };
      }
      return { el, text: chatGPT.extractResponseText(el) };
    },

    waitForResponse: async () => {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          if (state.responseObserver) state.responseObserver.disconnect();
          reject(new Error('Response timeout'));
        }, CONFIG.RESPONSE_TIMEOUT);

        const checkForNewResponse = () => {
          const assistantMessages = document.querySelectorAll(
            '[data-message-author-role="assistant"]'
          );
          const latestMessage = assistantMessages[assistantMessages.length - 1];

          if (latestMessage && latestMessage !== state.lastResponseElement) {
            const isGenerating =
              document.querySelector('[data-testid="stop-button"]') ||
              document.querySelector('.result-thinking') ||
              latestMessage.querySelector('.typing-indicator');

            if (!isGenerating) {
              clearTimeout(timeout);
              if (state.responseObserver) state.responseObserver.disconnect();
              // Prefer the full assistant turn container (article) which holds images/content
              const container =
                latestMessage.closest('article[data-turn="assistant"]') || latestMessage;
              state.lastResponseElement = container;
              resolve(container);
            }
          }
        };

        checkForNewResponse();
        state.responseObserver = new MutationObserver(checkForNewResponse);
        state.responseObserver.observe(document.body, {
          childList: true,
          subtree: true,
          characterData: true,
        });
      });
    },

    extractResponseText: (responseElement) => {
      if (!responseElement) return '';
      const contentSelectors = ['.markdown', '.prose', '[data-message-id]', '.whitespace-pre-wrap'];
      for (const selector of contentSelectors) {
        const contentElement = responseElement.querySelector(selector);
        if (contentElement) return contentElement.textContent.trim();
      }
      return responseElement.textContent.trim();
    },

    // Extract image URLs from an assistant response element
    extractResponseImages: (responseElement) => {
      if (!responseElement) return [];
      const urls = new Set();
      try {
        // Search within the assistant article scope
        const scope =
          responseElement.closest && responseElement.closest('article[data-turn="assistant"]')
            ? responseElement.closest('article[data-turn="assistant"]')
            : responseElement;

        // Get all generated images, excluding blurred ones
        scope.querySelectorAll('div[id^="image-"] img[alt="Generated image"]').forEach((img) => {
          const src = img.getAttribute('src');
          // Skip blurred backdrop images (they have blur-2xl or scale-110 in their parent)
          const isBlurred = img.closest('.blur-2xl') || img.closest('.scale-110');
          if (src && !isBlurred) {
            utils.log('🖼️ Found image: ' + src);
            urls.add(src);
          }
        });
      } catch (e) {
        utils.log('❌ Error in extractResponseImages: ' + e.message, 'error');
      }
      return Array.from(urls);
    },
  };

  // UI Creation
  const createUI = () => {
    state.isDarkMode = utils.detectDarkMode();

    // Main container
    ui.mainContainer = document.createElement('div');
    ui.mainContainer.id = 'chatgpt-automation-ui';
    ui.mainContainer.className = state.isDarkMode ? 'dark-mode' : 'light-mode';
    utils.setSafeHTML(
      ui.mainContainer,
      translator.replaceHTML(/*html*/ `<div class="automation-header" id="automation-header">
    <h3>ChatGPT Automation Pro</h3>
    <div class="header-controls">
      <div
        class="mini-progress"
        id="mini-progress"
        style="display: none"
        title="Batch progress"
      >
        <div class="mini-bar"><div class="mini-fill" id="mini-fill"></div></div>
        <div class="mini-label" id="mini-label">0/0</div>
      </div>
      <div
        class="mini-progress"
        id="mini-sub-progress"
        style="display: none"
        title="Inner batch progress"
      >
        <div class="mini-bar">
          <div class="mini-fill" id="mini-sub-fill"></div>
        </div>
        <div class="mini-label" id="mini-sub-label">0/0</div>
      </div>
      <div class="status-indicator" id="status-indicator">
        <span class="status-dot"></span>
        <span class="status-text">${translator.instant('Ready')}</span>
      </div>
      <button
        class="header-btn"
        id="header-log-toggle"
        title="Show/Hide Log"
        aria-label="Show/Hide Log"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 5h16v2H4V5zm0 6h16v2H4v-2zm0 6h10v2H4v-2z" />
        </svg>
      </button>
      <button
        class="header-btn"
        id="minimize-btn"
        title="Minimize"
        aria-label="Minimize"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 12h12v2H6z" />
        </svg>
      </button>
      <button class="header-btn" id="close-btn" title="Close" aria-label="Close">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M18.3 5.71L12 12.01L5.7 5.71L4.29 7.12L10.59 13.42L4.29 19.72L5.7 21.13L12 14.83L18.3 21.13L19.71 19.72L13.41 13.42L19.71 7.12L18.3 5.71Z"
          />
        </svg>
      </button>
    </div>
  </div>

  <div class="automation-content" id="automation-content">
    <div class="progress-container" id="progress-container" style="display: none">
      <div class="progress-bar">
        <div class="progress-fill"></div>
      </div>
      <div class="progress-text">0/0</div>
      <div
        class="progress-bar sub"
        id="progress-container-sub"
        style="display: none; margin-top: 6px"
      >
        <div class="progress-fill"></div>
      </div>
      <div class="progress-text sub" id="progress-text-sub" style="display: none">
        0/0
      </div>
    </div>

    <div class="automation-form">
      <div class="tab-container">
        <button class="tab-btn active" data-tab="composer">Composer</button>
        <button class="tab-btn" data-tab="settings">Settings</button>
      </div>

      <div class="tab-content active" id="composer-tab">
        <div class="form-group">
          <label>Composer Canvas:</label>
          <div class="composer-presets">
            <div class="preset-row">
              <input
                type="text"
                id="composer-preset-name-input"
                class="settings-input"
                placeholder="Preset name"
                style="flex: 1"
              />
              <select
                id="composer-preset-select"
                class="settings-input"
                style="flex: 2"
              >
                <option value="">Select preset...</option>
              </select>
              <button
                class="btn btn-secondary"
                id="save-composer-preset-btn"
                title="Save current configuration"
              >
                <svg width="14" height="14" viewBox="0 0 448 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-242.7c0-17-6.7-33.3-18.7-45.3L352 50.7C340 38.7 323.7 32 306.7 32L64 32zm32 96c0-17.7 14.3-32 32-32l160 0c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32l-160 0c-17.7 0-32-14.3-32-32l0-64zM224 288a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>
              </button>
              <button
                class="btn btn-primary"
                id="load-composer-preset-btn"
                title="Load selected preset"
              >
                <svg width="14" height="14" viewBox="0 0 576 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M56 225.6L32.4 296.2 32.4 96c0-35.3 28.7-64 64-64l138.7 0c13.8 0 27.3 4.5 38.4 12.8l38.4 28.8c5.5 4.2 12.3 6.4 19.2 6.4l117.3 0c35.3 0 64 28.7 64 64l0 16-365.4 0c-41.3 0-78 26.4-91.1 65.6zM477.8 448L99 448c-32.8 0-55.9-32.1-45.5-63.2l48-144C108 221.2 126.4 208 147 208l378.8 0c32.8 0 55.9 32.1 45.5 63.2l-48 144c-6.5 19.6-24.9 32.8-45.5 32.8z"/></svg>
              </button>
              <button
                class="btn btn-danger"
                id="delete-composer-preset-btn"
                title="Delete selected preset"
              >
                <svg width="14" height="14" viewBox="0 0 448 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M136.7 5.9C141.1-7.2 153.3-16 167.1-16l113.9 0c13.8 0 26 8.8 30.4 21.9L320 32 416 32c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 8.7-26.1zM32 144l384 0 0 304c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-304zm88 64c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24zm104 0c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24zm104 0c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24z"/></svg>
              </button>
            </div>
          </div>
          <div id="chain-canvas" class="chain-canvas">
            <div class="chain-toolbar">
              <button class="btn btn-secondary" id="add-step-btn">
                ${translator.instant('Add Step')}
              </button>
              <button class="btn btn-secondary" id="validate-chain-btn">
                Validate Chain
              </button>
              <button class="btn btn-primary" id="run-chain-btn">
                Run Chain
              </button>
              <button
                class="btn btn-danger"
                id="stop-run-btn"
                style="display: none"
              >
                Stop
              </button>
            </div>
            <div id="chain-cards" class="chain-cards"></div>
          </div>
          <div class="help-text">
            Visual editor for multi-step automation chains. Steps connect in
            sequence; supports templates and custom JavaScript execution.
          </div>
        </div>
        <div class="form-group">
          <label for="dynamic-elements-input"
            >Dynamic Elements (List, JSON, or function)</label
          >
          <div class="code-editor">
            <div class="overlay-field">
              <textarea
                id="dynamic-elements-input"
                rows="4"
                placeholder='["item1", "item2", "item3"] or () => ["generated", "items"]'
              ></textarea>
              <button
                class="tool-btn overlay"
                id="format-dyn-elements-btn"
                title="Format JSON"
              >
                { }
              </button>
              <button
                class="tool-btn overlay"
                id="apply-dyn-elements-btn"
                style="right: 36px;"
                title="Apply dynamic elements to runtime"
              >
                ▶
              </button>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label for="chain-json-input">Chain JSON (advanced):</label>
          <div class="code-editor">
            <textarea
              id="chain-json-input"
              rows="6"
              placeholder='{
      "entryId": "step-1",
      "steps": [
          {
          "id": "step-1",
          "type": "prompt",
          "title": "Create message",
          "template": "Hello {item}",
          "next": "step-2"
          },
          {
          "id": "step-2",
          "type": "js",
          "title": "Process response",
          "code": "utils.log(\"Processing: \" + steps[\"step-1\"].response);"
          }
      ]
      }'
            ></textarea>
            <div class="editor-tools">
              <button
                class="tool-btn"
                id="format-chain-json-btn"
                title="Format JSON"
              >
                { }
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="tab-content" id="settings-tab">
        <div class="form-group">
          <label>Debug mode:</label>
          <label class="checkbox-label">
            <input type="checkbox" id="debug-mode-checkbox" />
            <span class="checkmark"></span>
            Enable debug logging
          </label>
        </div>
        <div class="form-group">
          <label>Batch settings:</label>
          <div class="batch-controls">
            <div class="batch-settings">
              <label class="checkbox-label">
                <input type="checkbox" id="loop-checkbox" />
                <span class="checkmark"></span>
                Process all items in batch
              </label>
              <label class="checkbox-label">
                <input type="checkbox" id="auto-remove-checkbox" checked />
                <span class="checkmark"></span>
                Remove processed items from queue
              </label>
              <div class="wait-time-control">
                <label for="wait-time-input">Wait between items (ms):</label>
                <input
                  type="number"
                  id="wait-time-input"
                  min="100"
                  max="30000"
                  value="2000"
                  step="100"
                />
              </div>
              <div class="wait-time-control">
                <label for="step-wait-input">Wait between steps (ms):</label>
                <input
                  type="number"
                  id="step-wait-input"
                  min="0"
                  max="30000"
                  value="0"
                  step="100"
                />
              </div>
            </div>
            <div class="batch-actions">
              <button
                id="stop-batch-btn"
                class="btn btn-danger"
                style="display: none"
              >
                Stop Batch
              </button>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label for="response-timeout-input">${translator.instant('Response timeout (ms):')}</label>
          <input
            type="number"
            id="response-timeout-input"
            min="10000"
            max="6000000"
            step="1000"
            class="settings-input timeout"
          />
        </div>
        <div class="form-group">
          <label>${translator.instant('Visibility:')}</label>
          <label class="checkbox-label">
            <input type="checkbox" id="default-visible-checkbox" />
            <span class="checkmark"></span>
            ${translator.instant('Show panel by default')}
          </label>
          <div class="help-text">
            ${translator.instant('Controls default visibility on page load. You can still toggle from the header button.')}
          </div>
        </div>
        <div class="form-group">
          <label>Support:</label>
          <div class="help-text">
            <a href="https://www.paypal.com/paypalme/my/profile" target="_blank" rel="noopener noreferrer">Donate via PayPal</a>
          </div>
        </div>
      </div>
    </div>

    <div class="automation-log" id="log-container">
      <div class="log-header">
        <span>${translator.instant('Activity Log')}</span>
          <div class="log-header-controls">
          <button class="tool-btn" id="stop-mini-btn" title="Stop" style="display: none">
            <svg width="14" height="14" viewBox="0 0 384 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z"/></svg>
          </button>
          <button
            class="tool-btn"
            id="toggle-auto-scroll-btn"
            title="Toggle Auto-scroll"
          >
            <svg width="14" height="14" viewBox="0 0 448 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M246.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-160-160c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L224 402.7 361.4 265.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-160 160zm160-352l-160 160c-12.5 12.5-32.8 12.5-45.3 0l-160-160c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L224 210.7 361.4 73.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3z"/></svg>
          </button>
          <button class="tool-btn" id="clear-log-btn" title="Clear Log">
            <svg width="14" height="14" viewBox="0 0 448 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M136.7 5.9C141.1-7.2 153.3-16 167.1-16l113.9 0c13.8 0 26 8.8 30.4 21.9L320 32 416 32c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 8.7-26.1zM32 144l384 0 0 304c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-304zm88 64c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24zm104 0c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24zm104 0c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24z"/></svg>
          </button>
        </div>
      </div>
      <div class="log-content"></div>
    </div>
  </div>

  <div class="resize-handle" id="resize-handle"></div>

  <!-- Modal for editing a chain step -->
  <div
    id="chain-step-modal"
    class="chain-modal"
    aria-hidden="true"
    style="display: none"
  >
    <div class="chain-modal-backdrop"></div>
    <div
      class="chain-modal-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="chain-step-title"
    >
      <div class="chain-modal-header">
        <h4 id="chain-step-title">Edit Step</h4>
        <div class="step-modal-presets">
          <select
            id="step-preset-select"
            class="settings-input"
            style="min-width: 120px"
          >
            <option value="">Select preset...</option>
          </select>
          <button
            class="tool-btn"
            id="save-step-preset-btn"
            title="Save as preset"
          >
            <svg width="14" height="14" viewBox="0 0 448 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-242.7c0-17-6.7-33.3-18.7-45.3L352 50.7C340 38.7 323.7 32 306.7 32L64 32zm32 96c0-17.7 14.3-32 32-32l160 0c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32l-160 0c-17.7 0-32-14.3-32-32l0-64zM224 288a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>
          </button>
          <button
            class="tool-btn"
            id="delete-step-preset-btn"
            title="Delete preset"
          >
            <svg width="14" height="14" viewBox="0 0 448 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M136.7 5.9C141.1-7.2 153.3-16 167.1-16l113.9 0c13.8 0 26 8.8 30.4 21.9L320 32 416 32c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 8.7-26.1zM32 144l384 0 0 304c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-304zm88 64c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24zm104 0c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24zm104 0c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24z"/></svg>
          </button>
        </div>
        <button class="header-btn" id="close-step-modal-btn" aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M18.3 5.71L12 12.01L5.7 5.71L4.29 7.12L10.59 13.42L4.29 19.72L5.7 21.13L12 14.83L18.3 21.13L19.71 19.72L13.41 13.42L19.71 7.12L18.3 5.71Z"
            />
          </svg>
        </button>
      </div>
      <div class="chain-modal-body">
        <div class="form-group">
          <label for="step-id-input">ID</label>
          <input id="step-id-input" class="settings-input" placeholder="step-1" />
        </div>
        <div class="form-group">
          <label for="step-title-input">Title</label>
          <input
            id="step-title-input"
            class="settings-input"
            placeholder="Describe the step"
          />
        </div>
        <div class="form-group">
          <label for="step-type-select">Type</label>
          <select id="step-type-select" class="settings-input">
            <option value="prompt">Prompt</option>
            <option value="template">Template (Batch)</option>
            <option value="js">JavaScript</option>
            <option value="http">HTTP Request</option>
          </select>
        </div>
        <div class="form-group" data-field="prompt">
          <label for="step-response-type">Response Type</label>
          <select id="step-response-type" class="settings-input">
            <option value="text">Text</option>
            <option value="image">Image</option>
          </select>
          <label class="checkbox-label" style="margin-top: 6px; display: block">
            <input type="checkbox" id="step-newchat-checkbox" />
            <span class="checkmark"></span>
            Open in new chat before this step
          </label>
        </div>
        <div class="form-group" data-field="prompt">
          <label for="step-prompt-template">Message Template</label>
          <textarea
            id="step-prompt-template"
            rows="4"
            class="settings-input"
            placeholder="Send a message to ChatGPT. Use {steps.stepId.response} to access previous step data."
          ></textarea>
          <div class="help-text">
            Access previous step data: {steps.stepId.response} for prompts,
            {steps.stepId.data} for HTTP, {steps.stepId.status} for HTTP status
          </div>
        </div>
        <div class="form-group" data-field="template">
          <label for="step-template-input">Message Template</label>
          <textarea
            id="step-template-input"
            rows="4"
            class="settings-input"
            placeholder="Template with placeholders like {{item}}, {{index}}, {{total}} or {steps.stepId.data}..."
          ></textarea>
          <label for="step-template-elements" style="margin-top: 8px"
            >Dynamic Elements (JSON/function). Supports {placeholders}.</label
          >
          <div class="overlay-field">
            <textarea
              id="step-template-elements"
              rows="3"
              class="settings-input"
              placeholder='["item1", "item2", "item3"] or () => ["generated", "items"]'
            ></textarea>
            <button
              class="tool-btn overlay"
              id="format-step-elements-btn"
              title="Format JSON"
            >
              { }
            </button>
          </div>
          <label class="checkbox-label" style="margin-top: 6px; display: block">
            <input type="checkbox" id="step-use-dynamicelements-checkbox" />
            <span class="checkmark"></span>
            Use chain.dynamicElements as elements
          </label>
          <div class="help-text">
            Batch processing: {{item}} for current item, {steps.stepId.response}
            for previous step data
          </div>
        </div>
        <div class="form-group" data-field="http">
          <label>HTTP Request</label>
          <input
            id="step-http-url"
            class="settings-input"
            placeholder="https://api.example.com/data or {steps.stepId.data.apiUrl}"
          />
          <div style="display: flex; gap: 8px; margin-top: 6px">
            <select id="step-http-method" class="settings-input">
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
            </select>
            <div class="overlay-field">
              <input
                id="step-http-headers"
                class="settings-input"
                placeholder='{"Authorization": "Bearer {steps.authStep.data.token}"}'
              />
              <button
                class="tool-btn overlay"
                id="format-http-headers-btn"
                title="Format JSON"
              >
                { }
              </button>
            </div>
          </div>
          <div class="overlay-field">
            <textarea
              id="step-http-body"
              rows="3"
              class="settings-input"
              placeholder="Request body: {steps.stepId.response} or JSON data"
            ></textarea>
            <button
              class="tool-btn overlay"
              id="format-http-body-btn"
              title="Format JSON"
            >
              { }
            </button>
          </div>
          <div class="help-text">
            Access response with {steps.thisStepId.data} or
            {steps.thisStepId.status}. Use previous step data in URL/headers/body.
          </div>
        </div>
        <div class="form-group" data-field="js">
          <label for="step-js-code">JavaScript Code</label>
          <textarea
            id="step-js-code"
            rows="6"
            class="settings-input"
            placeholder="// Access previous steps with steps.stepId.data or steps.stepId.response
  // Available: response, log, console, item, index, total, http, steps, lastResponse
  // Example: utils.log('API response:', steps.httpStep.data);"
          ></textarea>
          <div class="help-text">
            Access step data with <code>steps.stepId.data</code> or
            <code>steps.stepId.response</code>. Use <code>http</code> for API
            calls, <code>utils.log()</code> for output.
          </div>
        </div>
        <div class="form-group">
          <label for="step-next-select">Next step</label>
          <select id="step-next-select" class="settings-input"></select>
        </div>
      </div>
      <div class="chain-modal-footer">
        <button class="btn btn-secondary" id="delete-step-btn">Delete</button>
        <button class="btn btn-primary" id="save-step-btn">Save</button>
      </div>
    </div>
  </div>
  `));

    // Add styles with ChatGPT-inspired design (guard against duplicates)
    let style = document.getElementById('chatgpt-automation-style');
    if (!style) {
      style = document.createElement('style');
      style.id = 'chatgpt-automation-style';
      style.textContent = /*css*/ `/* Base styles that adapt to ChatGPT's theme (scoped) */
  #chatgpt-automation-ui {
    position: fixed;
    top: 20px;
    right: 20px;
    height: auto;
    width: auto;
    background: var(--main-surface-primary, #ffffff);
    border: 1px solid var(--border-medium, rgba(0, 0, 0, 0.1));
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    font-family: var(
      --font-family,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      Roboto,
      sans-serif
    );
    z-index: 10000;
    resize: both;
    overflow: hidden;
    backdrop-filter: blur(10px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    /* Theme-driven accent colors sourced from ChatGPT theme tokens */
    --accent: var(--theme-entity-accent, #6366f1);
    --accent-strong: color-mix(in oklab, var(--accent) 85%, #000);
  }

  #chatgpt-automation-ui.dark-mode {
    background: var(--main-surface-primary, #2d2d30);
    border-color: var(--border-medium, rgba(255, 255, 255, 0.1));
    color: var(--text-primary, #ffffff);
  }

  #chatgpt-automation-ui.minimized {
    resize: both;
    height: 46px;
    width: 600px;
  }
  #chatgpt-automation-ui.minimized.log-open {
    height: 300px;
  }
  /* Hide main form when minimized */
  #chatgpt-automation-ui.minimized .automation-form {
    display: none;
  }
  /* Keep progress container visible state-controlled; mini bars appear in header */

  /* Base content layout mirrors minimized behavior */
  #chatgpt-automation-ui .automation-content {
    display: flex;
    flex-direction: column;
    min-height: 0;
    height: calc(100% - 60px); /* Header height offset */
  }

  #chatgpt-automation-ui .automation-header {
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent-strong) 100%);
    color: white;
    padding: 12px 16px;
    border-radius: 12px 12px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: move;
    user-select: none;
  }

  #chatgpt-automation-ui .automation-header h3 {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    flex: 1;
  }

  #chatgpt-automation-ui .header-controls {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  #chatgpt-automation-ui .mini-progress {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 80px;
  }
  #chatgpt-automation-ui .mini-progress .mini-bar {
    width: 60px;
    height: 4px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
    overflow: hidden;
  }
  #chatgpt-automation-ui .mini-progress .mini-fill {
    height: 100%;
    background: var(--accent);
    width: 0%;
    transition: width 0.3s ease;
  }
  #chatgpt-automation-ui .mini-progress .mini-label {
    font-size: 10px;
    opacity: 0.85;
  }

  #chatgpt-automation-ui .status-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    opacity: 0.9;
  }

  #chatgpt-automation-ui .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #10b981;
    animation: pulse-idle 2s infinite;
  }

  #chatgpt-automation-ui .header-btn {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 4px;
    padding: 4px;
    color: white;
    cursor: pointer;
    transition: background 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #chatgpt-automation-ui .header-btn:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  #chatgpt-automation-ui .automation-content {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    /* Allow children to shrink/scroll correctly inside flex */
    min-height: 0;
    -webkit-overflow-scrolling: touch;
  }

  #chatgpt-automation-ui .progress-container {
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-light, rgba(0, 0, 0, 0.06));
    background: var(--surface-secondary, #f8fafc);
  }
  /* Hide main progress container when minimized (header mini bars take over) */
  #chatgpt-automation-ui.minimized .progress-container {
    display: none !important;
  }

  #chatgpt-automation-ui.dark-mode .progress-container {
    background: var(--surface-secondary, #1e1e20);
    border-color: var(--border-light, rgba(255, 255, 255, 0.06));
  }

  #chatgpt-automation-ui .progress-bar {
    width: 100%;
    height: 4px;
    background: var(--border-light, rgba(0, 0, 0, 0.1));
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 4px;
  }
  #chatgpt-automation-ui .progress-bar.sub {
    background: var(--border-light, rgba(0, 0, 0, 0.1));
  }

  #chatgpt-automation-ui .progress-fill {
    height: 100%;
    background: var(--accent);
    transition: width 0.3s ease;
  }

  #chatgpt-automation-ui .progress-text {
    font-size: 11px;
    color: var(--text-secondary, #6b7280);
    text-align: center;
  }
  #chatgpt-automation-ui .progress-text.sub {
    opacity: 0.8;
  }

  #chatgpt-automation-ui .automation-form {
    padding: 16px;
    /* Keep natural height so logs fill remaining space */
    flex: 0 0 auto;
    overflow: auto;
  }

  #chatgpt-automation-ui .tab-container {
    display: flex;
    border-bottom: 1px solid var(--border-light, rgba(0, 0, 0, 0.06));
    margin-bottom: 16px;
  }

  #chatgpt-automation-ui.dark-mode .tab-container {
    border-color: var(--border-light, rgba(255, 255, 255, 0.06));
  }

  #chatgpt-automation-ui .tab-btn {
    background: none;
    border: none;
    padding: 8px 16px;
    cursor: pointer;
    color: var(--text-secondary, #6b7280);
    font-size: 13px;
    font-weight: 500;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
  }

  #chatgpt-automation-ui .tab-btn.active {
    color: var(--accent);
    border-color: var(--accent);
  }

  #chatgpt-automation-ui .tab-content {
    display: none;
  }

  #chatgpt-automation-ui .tab-content.active {
    display: block;
  }

  #chatgpt-automation-ui .form-group {
    margin-bottom: 16px;
  }

  #chatgpt-automation-ui .form-group label {
    display: block;
    margin-bottom: 6px;
    font-weight: 500;
    color: var(--text-primary, #374151);
    font-size: 13px;
  }

  #chatgpt-automation-ui.dark-mode .form-group label {
    color: var(--text-primary, #f3f4f6);
  }

  #chatgpt-automation-ui .form-group textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--border-medium, rgba(0, 0, 0, 0.1));
    border-radius: 8px;
    font-size: 13px;
    resize: vertical;
    font-family: "SF Mono", "Monaco", "Menlo", "Ubuntu Mono", monospace;
    box-sizing: border-box;
    background: var(--input-background, #ffffff);
    color: var(--text-primary, #374151);
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  #chatgpt-automation-ui.dark-mode .form-group textarea {
    background: var(--input-background, #1e1e20);
    color: var(--text-primary, #f3f4f6);
    border-color: var(--border-medium, rgba(255, 255, 255, 0.1));
  }

  #chatgpt-automation-ui .form-group textarea:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px color-mix(in oklab, var(--accent) 25%, transparent);
  }

  #chatgpt-automation-ui .code-editor {
    position: relative;
  }

  #chatgpt-automation-ui .editor-tools {
    position: absolute;
    top: 8px;
    right: 8px;
    display: flex;
    gap: 4px;
    opacity: 0;
    transition: opacity 0.2s;
  }

  #chatgpt-automation-ui .code-editor:hover .editor-tools {
    opacity: 1;
  }

  #chatgpt-automation-ui .tool-btn {
    background: var(--surface-secondary, rgba(0, 0, 0, 0.05));
    border: none;
    border-radius: 4px;
    padding: 4px 6px;
    font-size: 10px;
    cursor: pointer;
    color: var(--text-secondary, #6b7280);
    transition: background 0.2s;
  }

  #chatgpt-automation-ui .tool-btn:hover {
    background: var(--surface-secondary, rgba(0, 0, 0, 0.1));
  }

  #chatgpt-automation-ui .help-text {
    font-size: 11px;
    color: var(--text-secondary, #6b7280);
    margin-top: 4px;
    font-style: italic;
  }

  #chatgpt-automation-ui .batch-controls {
    margin-top: 12px;
    padding: 12px;
    background: var(--surface-secondary, #f8fafc);
    border-radius: 6px;
  }

  #chatgpt-automation-ui.dark-mode .batch-controls {
    background: var(--surface-secondary, #1e1e20);
  }

  #chatgpt-automation-ui .batch-settings {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 12px;
  }

  #chatgpt-automation-ui .batch-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  #chatgpt-automation-ui .wait-time-control {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 4px;
  }

  #chatgpt-automation-ui .wait-time-control label {
    font-size: 12px;
    margin: 0;
    white-space: nowrap;
    color: var(--text-primary, #374151);
  }

  #chatgpt-automation-ui.dark-mode .wait-time-control label {
    color: var(--text-primary, #f3f4f6);
  }

  #chatgpt-automation-ui .wait-time-control input[type="number"] {
    width: 80px;
    padding: 4px 8px;
    border: 1px solid var(--border-medium, rgba(0, 0, 0, 0.1));
    border-radius: 4px;
    font-size: 12px;
    background: var(--input-background, #ffffff);
    color: var(--text-primary, #374151);
  }

  #chatgpt-automation-ui.dark-mode .wait-time-control input[type="number"] {
    background: var(--input-background, #1e1e20);
    color: var(--text-primary, #f3f4f6);
    border-color: var(--border-medium, rgba(255, 255, 255, 0.1));
  }

  #chatgpt-automation-ui .wait-time-control input[type="number"]:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 2px color-mix(in oklab, var(--accent) 25%, transparent);
  }

  /* Settings input styles */
  #chatgpt-automation-ui .settings-input {
    padding: 6px 8px;
    border: 1px solid var(--border-medium, rgba(0, 0, 0, 0.1));
    border-radius: 6px;
    font-size: 13px;
    background: var(--input-background, #ffffff);
    color: var(--text-primary, #374151);
  }

  #chatgpt-automation-ui.dark-mode .settings-input {
    background: var(--input-background, #1e1e20);
    color: var(--text-primary, #f3f4f6);
    border-color: var(--border-medium, rgba(255, 255, 255, 0.1));
  }

  #chatgpt-automation-ui .settings-input:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px color-mix(in oklab, var(--accent) 25%, transparent);
  }

  #chatgpt-automation-ui .settings-input.timeout {
    width: 140px;
  }

  /* Overlay format button on hover */
  #chatgpt-automation-ui .overlay-field {
    position: relative;
  }
  #chatgpt-automation-ui .overlay-field .overlay {
    position: absolute;
    right: 6px;
    top: 6px;
    opacity: 0;
    transition: opacity 0.15s ease;
  }
  #chatgpt-automation-ui .overlay-field:hover .overlay {
    opacity: 1;
  }

  #chatgpt-automation-ui .settings-input.size {
    width: 120px;
  }

  #chatgpt-automation-ui .checkbox-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 13px;
    color: var(--text-primary, #374151);
  }

  #chatgpt-automation-ui.dark-mode .checkbox-label {
    color: var(--text-primary, #f3f4f6);
  }

  #chatgpt-automation-ui .checkbox-label input[type="checkbox"] {
    margin-right: 8px;
  }

  #chatgpt-automation-ui .form-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 16px;
  }

  #chatgpt-automation-ui .btn {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;
    position: relative;
  }

  #chatgpt-automation-ui .btn-primary {
    background: var(--accent);
    color: white;
  }

  #chatgpt-automation-ui .btn-primary:hover {
    background: var(--accent-strong);
  }

  #chatgpt-automation-ui .btn-secondary {
    background: var(--surface-secondary, #f3f4f6);
    color: var(--text-primary, #374151);
    border: 1px solid var(--border-light, rgba(0, 0, 0, 0.06));
  }

  #chatgpt-automation-ui.dark-mode .btn-secondary {
    background: var(--surface-secondary, #1e1e20);
    color: var(--text-primary, #f3f4f6);
    border-color: var(--border-light, rgba(255, 255, 255, 0.06));
  }

  #chatgpt-automation-ui .btn-secondary:hover {
    background: var(--surface-secondary, #e5e7eb);
  }

  #chatgpt-automation-ui.dark-mode .btn-secondary:hover {
    background: var(--surface-secondary, #2a2a2d);
  }

  #chatgpt-automation-ui .btn-danger {
    background: #ef4444;
    color: white;
  }

  #chatgpt-automation-ui .btn-danger:hover {
    background: #dc2626;
  }

  #chatgpt-automation-ui .btn-warning {
    background: #f59e0b;
    color: white;
  }

  #chatgpt-automation-ui .btn-warning:hover {
    background: #d97706;
  }

  #chatgpt-automation-ui .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  #chatgpt-automation-ui .spinner {
    width: 12px;
    height: 12px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  #chatgpt-automation-ui .automation-log {
    border-top: 1px solid var(--border-light, rgba(0, 0, 0, 0.06));
    /* Base height when expanded; can be resized */
    height: 150px;
    flex: 1 1 auto;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  #chatgpt-automation-ui.dark-mode .automation-log {
    border-color: var(--border-light, rgba(255, 255, 255, 0.06));
  }

  #chatgpt-automation-ui .log-header {
    padding: 12px 16px;
    background: var(--surface-secondary, #f8fafc);
    font-weight: 500;
    font-size: 13px;
    color: var(--text-primary, #374151);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  #chatgpt-automation-ui.dark-mode .log-header {
    background: var(--surface-secondary, #1e1e20);
    color: var(--text-primary, #f3f4f6);
  }

  #chatgpt-automation-ui .log-header-controls {
    display: flex;
    gap: 4px;
  }

  #chatgpt-automation-ui .log-content {
    padding: 16px;
    overflow-y: auto;
    scroll-behavior: smooth;
    flex: 1 1 auto;
    min-height: 0;
  }

  #chatgpt-automation-ui #step-next-select {
    width: 100%;
  }

  #chatgpt-automation-ui .log-entry {
    padding: 6px 0;
    font-size: 11px;
    font-family: "SF Mono", "Monaco", "Menlo", "Ubuntu Mono", monospace;
    border-bottom: 1px solid var(--border-light, rgba(0, 0, 0, 0.03));
    line-height: 1.4;
  }

  #chatgpt-automation-ui .log-entry:last-child {
    border-bottom: none;
    margin-bottom: 6px; /* extra space below last entry */
  }

  #chatgpt-automation-ui .log-info {
    color: var(--text-primary, #374151);
  }

  #chatgpt-automation-ui.dark-mode .log-info {
    color: var(--text-primary, #d1d5db);
  }

  #chatgpt-automation-ui .log-warning {
    color: #f59e0b;
  }

  #chatgpt-automation-ui .log-error {
    color: #ef4444;
  }

  #chatgpt-automation-ui .resize-handle {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 20px;
    height: 20px;
    cursor: nw-resize;
    background: linear-gradient(
      -45deg,
      transparent 0%,
      transparent 40%,
      var(--border-medium, rgba(0, 0, 0, 0.1)) 40%,
      var(--border-medium, rgba(0, 0, 0, 0.1)) 60%,
      transparent 60%,
      transparent 100%
    );
  }

  /* Chain canvas styles */
  #chatgpt-automation-ui .chain-canvas {
    border: 1px dashed var(--border-light, rgba(0, 0, 0, 0.1));
    border-radius: 8px;
    padding: 8px;
    min-height: 120px;
  }
  #chatgpt-automation-ui .chain-toolbar {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
    flex-wrap: wrap;
  }
  #chatgpt-automation-ui .chain-cards {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: flex-start;
    min-height: 80px;
  }

  /* Empty chain cards container */
  #chatgpt-automation-ui .chain-cards:empty {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--surface-secondary, #f8fafc);
    border: 2px dashed var(--border-medium, rgba(0, 0, 0, 0.15));
    border-radius: 12px;
    padding: 32px 16px;
    text-align: center;
    color: var(--text-secondary, #6b7280);
    font-size: 14px;
    transition: all 0.2s ease;
  }
  #chatgpt-automation-ui.dark-mode .chain-cards:empty {
    background: var(--surface-secondary, #1e1e20);
    border-color: var(--border-medium, rgba(255, 255, 255, 0.15));
    color: var(--text-secondary, #9ca3af);
  }
  #chatgpt-automation-ui .chain-cards:empty::before {
    content: "🔗 No steps yet. Click 'Add Step' to start building your automation chain.";
    font-weight: 500;
  }

  #chatgpt-automation-ui .chain-card {
    background: var(--surface-secondary, #f8fafc);
    border: 1px solid var(--border-light, rgba(0, 0, 0, 0.06));
    border-radius: 8px;
    padding: 8px;
    min-width: 140px;
    max-width: 200px;
    position: relative;
    transition: all 0.2s ease;
  }
  #chatgpt-automation-ui .chain-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }
  #chatgpt-automation-ui.dark-mode .chain-card {
    background: var(--surface-secondary, #1e1e20);
    border-color: var(--border-light, rgba(255, 255, 255, 0.06));
  }
  #chatgpt-automation-ui.dark-mode .chain-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
  #chatgpt-automation-ui .chain-card .title {
    font-weight: 600;
    font-size: 12px;
    margin-bottom: 4px;
  }
  #chatgpt-automation-ui .chain-card .meta {
    font-size: 11px;
    opacity: 0.8;
    margin-bottom: 6px;
  }
  #chatgpt-automation-ui .chain-card .actions {
    display: flex;
    gap: 6px;
  }

  /* Composer presets */
  #chatgpt-automation-ui .composer-presets {
    margin-bottom: 12px;
    padding: 8px;
    background: var(--surface-secondary, #f8fafc);
    border-radius: 8px;
    border: 1px solid var(--border-light, rgba(0, 0, 0, 0.06));
  }
  #chatgpt-automation-ui.dark-mode .composer-presets {
    background: var(--surface-secondary, #1e1e20);
    border-color: var(--border-light, rgba(255, 255, 255, 0.06));
  }
  #chatgpt-automation-ui .composer-presets .preset-row {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  /* Modal */
  #chatgpt-automation-ui .chain-modal {
    position: fixed;
    inset: 0;
    z-index: 10001;
  }
  #chatgpt-automation-ui .chain-modal-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
  }
  #chatgpt-automation-ui .chain-modal-dialog {
    position: relative;
    background: var(--main-surface-primary, #fff);
    width: 520px;
    max-width: calc(100% - 32px);
    margin: 40px auto;
    border-radius: 10px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }
  #chatgpt-automation-ui.dark-mode .chain-modal-dialog {
    background: var(--main-surface-primary, #2d2d30);
  }
  #chatgpt-automation-ui .chain-modal-dialog .header-btn {
    /* Ensure the close button inside the modal inherits modal text color
       and uses a transparent background so it's visible in light mode */
    background: transparent;
    color: inherit;
    padding: 6px;
    border: none;
  }
  #chatgpt-automation-ui .chain-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-light, rgba(0, 0, 0, 0.06));
    gap: 12px;
  }
  #chatgpt-automation-ui .step-modal-presets {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  #chatgpt-automation-ui .chain-modal-body {
    padding: 12px 16px;
    max-height: 60vh;
    overflow: auto;
  }
  #chatgpt-automation-ui .chain-modal-footer {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    padding: 12px 16px;
    border-top: 1px solid var(--border-light, rgba(0, 0, 0, 0.06));
  }

  #chatgpt-automation-ui .presets-grid .preset-row {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
    flex-wrap: wrap;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    #chatgpt-automation-ui {
      width: 320px;
      right: 10px;
      top: 10px;
    }
  }

  /* Animation keyframes */
  @keyframes pulse-idle {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @keyframes pulse-processing {
    0%,
    100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.2);
    }
  }

  #chatgpt-automation-ui .status-processing .status-dot {
    background: #f59e0b;
    animation: pulse-processing 1s infinite;
  }

  #chatgpt-automation-ui .status-waiting .status-dot {
    background: #3b82f6;
    animation: pulse-processing 1.5s infinite;
  }

  #chatgpt-automation-ui .status-complete .status-dot {
    background: #10b981;
    animation: none;
  }

  #chatgpt-automation-ui .status-error .status-dot {
    background: #ef4444;
    animation: pulse-processing 0.5s infinite;
  }
  `;
      document.head.appendChild(style);
    }
    document.body.appendChild(ui.mainContainer);

    // Get UI elements
    ui.statusIndicator = document.getElementById('status-indicator');
    ui.logContainer = document.querySelector('.log-content');
    ui.progressBar = document.getElementById('progress-container');
    ui.progressBarSub = document.getElementById('progress-container-sub');
    ui.miniProgress = document.getElementById('mini-progress');
    ui.miniFill = document.getElementById('mini-fill');
    ui.miniLabel = document.getElementById('mini-label');
    ui.miniSubProgress = document.getElementById('mini-sub-progress');
    ui.miniSubFill = document.getElementById('mini-sub-fill');
    ui.miniSubLabel = document.getElementById('mini-sub-label');
    ui.resizeHandle = document.getElementById('resize-handle');

    // Restore saved inputs, toggles and config
    try {
      // Chain JSON restored later with parsing

      // Checkboxes and switches
      const loopEl = document.getElementById('loop-checkbox');
      const autoRemoveEl = document.getElementById('auto-remove-checkbox');

      if (loopEl) {
        loopEl.checked = !!GM_getValue(STORAGE_KEYS.loop, true);
        state.isLooping = loopEl.checked;
      }
      if (autoRemoveEl) {
        autoRemoveEl.checked = GM_getValue(STORAGE_KEYS.autoRemove, true);
        state.autoRemoveProcessed = autoRemoveEl.checked;
      }

      // Auto-scroll state (button only, no checkbox)
      state.autoScrollLogs = GM_getValue(STORAGE_KEYS.autoScroll, true);

      // Wait time
      const waitInput = document.getElementById('wait-time-input');
      const savedWait = parseInt(GM_getValue(STORAGE_KEYS.waitTime, state.batchWaitTime));
      if (!Number.isNaN(savedWait)) {
        state.batchWaitTime = savedWait;
        if (waitInput) waitInput.value = String(savedWait);
      }
      // Per-step wait time
      const stepWaitInput = document.getElementById('step-wait-input');
      const savedStepWait = parseInt(GM_getValue(STORAGE_KEYS.stepWaitTime, 0));
      if (stepWaitInput && !Number.isNaN(savedStepWait)) {
        stepWaitInput.value = String(savedStepWait);
      }

      // Active tab
      const savedTab = GM_getValue(STORAGE_KEYS.activeTab, 'composer');
      const tabBtn = document.querySelector(`.tab-btn[data-tab="${savedTab}"]`);
      if (tabBtn) {
        tabBtn.click();
      } else {
        // Fallback to composer if saved tab doesn't exist
        const composerBtn = document.querySelector(`.tab-btn[data-tab="composer"]`);
        if (composerBtn) composerBtn.click();
      }

      // Config - apply saved values and reflect in UI
      const dbgVal = !!GM_getValue(STORAGE_KEYS.configDebug, CONFIG.DEBUG_MODE);
      CONFIG.DEBUG_MODE = dbgVal;
      const dbgEl = document.getElementById('debug-mode-checkbox');
      if (dbgEl) dbgEl.checked = dbgVal;

      const toVal = parseInt(GM_getValue(STORAGE_KEYS.configTimeout, CONFIG.RESPONSE_TIMEOUT));
      if (!Number.isNaN(toVal)) CONFIG.RESPONSE_TIMEOUT = toVal;
      const toEl = document.getElementById('response-timeout-input');
      if (toEl) toEl.value = String(CONFIG.RESPONSE_TIMEOUT);

      const defVis = !!GM_getValue(STORAGE_KEYS.configDefaultVisible, CONFIG.DEFAULT_VISIBLE);
      CONFIG.DEFAULT_VISIBLE = defVis;
      const dvEl = document.getElementById('default-visible-checkbox');
      if (dvEl) dvEl.checked = defVis;

      // Chain definition
      const savedChain = GM_getValue(STORAGE_KEYS.chainDef, '');
      const chainInput = document.getElementById('chain-json-input');
      if (savedChain && chainInput) {
        chainInput.value =
          typeof savedChain === 'string' ? savedChain : JSON.stringify(savedChain, null, 2);
        try {
          state.chainDefinition = JSON.parse(chainInput.value);
        } catch {
          state.chainDefinition = null;
        }
      }
    } catch {}

    // Load saved state
    const savedState = uiState.load();
    if (savedState.left) {
      ui.mainContainer.style.left = savedState.left;
      ui.mainContainer.style.right = 'auto';
    }
    if (savedState.top) {
      ui.mainContainer.style.top = savedState.top;
    }
    if (savedState.minimized) {
      state.isMinimized = true;
      ui.mainContainer.classList.add('minimized');
    }
    // Respect explicit persisted visibility over default
    if (typeof savedState.visible === 'boolean') {
      state.uiVisible = savedState.visible;
    } else {
      state.uiVisible = !!CONFIG.DEFAULT_VISIBLE;
    }
    ui.mainContainer.style.display = state.uiVisible ? 'block' : 'none';

    // Restore persisted log history
    try {
      const hist = GM_getValue(STORAGE_KEYS.logHistory, []);
      if (Array.isArray(hist) && hist.length && ui.logContainer) {
        hist.slice(-200).forEach((h) => {
          const div = document.createElement('div');
          div.className = `log-entry log-${h.type || 'info'}`;
          div.textContent = h.msg;
          ui.logContainer.appendChild(div);
        });
        ui.logContainer.scrollTop = ui.logContainer.scrollHeight;
      }
    } catch {}

    // Bind events
    bindEvents();

    // Initialize auto-scroll button state
    const autoScrollBtn = document.getElementById('toggle-auto-scroll-btn');
    if (autoScrollBtn && typeof state.autoScrollLogs === 'boolean') {
      autoScrollBtn.style.opacity = state.autoScrollLogs ? '1' : '0.5';
      autoScrollBtn.title = state.autoScrollLogs ? 'Auto-scroll: ON' : 'Auto-scroll: OFF';
    }

    // Watch for theme changes
    const observer = new MutationObserver(() => {
      const newDarkMode = utils.detectDarkMode();
      if (newDarkMode !== state.isDarkMode) {
        state.isDarkMode = newDarkMode;
        ui.mainContainer.className = state.isDarkMode ? 'dark-mode' : 'light-mode';
        if (state.isMinimized) ui.mainContainer.classList.add('minimized');
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });

    // Add persistent header launcher
    mountHeaderLauncher();
    startHeaderObserver();
    utils.log('UI initialized successfully');
  };

  // Header launcher utilities
  const createLauncherButton = () => {
    const btn = document.createElement('button');
    btn.id = 'chatgpt-automation-launcher';
    btn.type = 'button';
    const label = translator.instant('Open Automation');
    btn.title = label;
    btn.setAttribute('aria-label', label);
    btn.className = 'btn relative btn-ghost text-token-text-primary';
    utils.setSafeHTML(btn, translator.replaceHTML(`<div class="flex w-full items-center justify-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="20" height="20" fill="currentColor" class="icon"><path d="M273 151.1L288 171.8L303 151.1C328 116.5 368.2 96 410.9 96C484.4 96 544 155.6 544 229.1L544 231.7C544 249.3 540.6 267.3 534.5 285.4C512.7 276.8 488.9 272 464 272C358 272 272 358 272 464C272 492.5 278.2 519.6 289.4 544C288.9 544 288.5 544 288 544C272.5 544 257.2 539.4 244.9 529.9C171.9 474.2 32 343.9 32 231.7L32 229.1C32 155.6 91.6 96 165.1 96C207.8 96 248 116.5 273 151.1zM320 464C320 384.5 384.5 320 464 320C543.5 320 608 384.5 608 464C608 543.5 543.5 608 464 608C384.5 608 320 543.5 320 464zM497.4 387C491.6 382.8 483.6 383 478 387.5L398 451.5C392.7 455.7 390.6 462.9 392.9 469.3C395.2 475.7 401.2 480 408 480L440.9 480L425 522.4C422.5 529.1 424.8 536.7 430.6 541C436.4 545.3 444.4 545 450 540.5L530 476.5C535.3 472.3 537.4 465.1 535.1 458.7C532.8 452.3 526.8 448 520 448L487.1 448L503 405.6C505.5 398.9 503.2 391.3 497.4 387z"/></svg><span class="max-md:hidden">Automation</span></div>`));
    btn.addEventListener('click', () => {
      // If UI was removed by a re-render, recreate it
      let panel = document.getElementById('chatgpt-automation-ui');
      if (!panel) {
        createUI();
        panel = document.getElementById('chatgpt-automation-ui');
      }
      if (!panel) return;
      const show = panel.style.display === 'none';
      panel.style.display = show ? 'block' : 'none';
      ui.mainContainer = panel;
      state.uiVisible = show;
      saveUIState();
    });
    return btn;
  };

  const mountHeaderLauncher = () => {
    const header = document.getElementById('page-header');
    if (!header) return false;
    let target = header.querySelector('#conversation-header-actions');
    if (!target) target = header;
    if (!target.querySelector('#chatgpt-automation-launcher')) {
      const btn = createLauncherButton();
      target.appendChild(btn);
    }
    // Also ensure the UI exists if it should be visible
    const savedState = uiState.load();
    const shouldShow =
      savedState.visible === true || (savedState.visible == null && CONFIG.DEFAULT_VISIBLE);
    if (shouldShow && !document.getElementById('chatgpt-automation-ui')) {
      createUI();
    }
    return true;
  };

  const startHeaderObserver = () => {
    if (state.headerObserverStarted) return;
    state.headerObserverStarted = true;
    const ensure = () => {
      try {
        // Recreate launcher if missing
        mountHeaderLauncher();
        // Ensure UI matches persisted visibility
        const savedState = uiState.load();
        const panel = document.getElementById('chatgpt-automation-ui');
        const shouldShow =
          savedState.visible === true || (savedState.visible == null && CONFIG.DEFAULT_VISIBLE);
        if (panel) {
          panel.style.display = shouldShow ? 'block' : 'none';
        } else if (shouldShow) {
          createUI();
        }
      } catch (e) {
        /* noop */
      }
    };
    ensure();
    const obs = new MutationObserver(() => ensure());
    obs.observe(document.body, { childList: true, subtree: true });
  };

  const updateStatus = (status) => {
    if (!ui.statusIndicator) return;
    const statusTexts = {
      idle: translator.instant('Ready'),
      processing: translator.instant('Typing...'),
      waiting: translator.instant('Waiting for response...'),
      complete: translator.instant('Complete'),
      error: translator.instant('Error'),
    };
    ui.statusIndicator.className = `status-indicator status-${status}`;
    const textEl = ui.statusIndicator.querySelector('.status-text');
    if (textEl) textEl.textContent = statusTexts[status] || translator.instant('Unknown');
  };

  const updateProgress = (done, total) => {
    // Use header mini progress as single source of truth. Keep in-panel progress hidden.
    if (!ui.miniProgress || !ui.miniFill || !ui.miniLabel) return;
    const show = total > 0;
    // Hide the in-panel progress container entirely (not used)
    try {
      if (ui.progressBar) ui.progressBar.style.display = 'none';
    } catch {}
    ui.miniProgress.style.display = show ? 'flex' : 'none';
    if (!show) {
      ui.miniFill.style.width = '0%';
      ui.miniLabel.textContent = '0/0';
      return;
    }
    const pct = total ? Math.round((done / total) * 100) : 0;
    ui.miniFill.style.width = pct + '%';
    ui.miniLabel.textContent = `${done}/${total}`;
  };

  const updateSubProgress = (done, total) => {
    // Use header mini sub-progress as single source of truth. Keep in-panel sub progress hidden.
    if (!ui.miniSubProgress || !ui.miniSubFill || !ui.miniSubLabel) return;
    const show = total > 0;
    try {
      if (ui.progressBarSub) ui.progressBarSub.style.display = 'none';
      const subText = document.getElementById('progress-text-sub');
      if (subText) subText.style.display = 'none';
    } catch {}
    ui.miniSubProgress.style.display = show ? 'flex' : 'none';
    if (!show) {
      ui.miniSubFill.style.width = '0%';
      ui.miniSubLabel.textContent = '0/0';
      return;
    }
    const pct = total ? Math.round((done / total) * 100) : 0;
    ui.miniSubFill.style.width = pct + '%';
    ui.miniSubLabel.textContent = `${done}/${total}`;
  };

  // Unified progress helper that clamps values and drives header mini bars
  const refreshBatchProgress = (doneLike, totalLike) => {
    const total = Math.max(0, Number(totalLike || 0));
    const done = Math.max(0, Math.min(Number(doneLike || 0), total));
    updateProgress(done, total);
    return { done, total };
  };

  // Safely remove N items from the head of dynamicElements, keep JSON/textarea in sync
  const removeHeadItems = (count = 1) => {
    if (!Array.isArray(state.dynamicElements) || count <= 0) return;
    try {
      state.dynamicElements.splice(0, count);
    } catch {}
    try {
      if (!state.chainDefinition) {
        const txt = document.getElementById('chain-json-input')?.value || '{}';
        state.chainDefinition = JSON.parse(txt);
      }
      state.chainDefinition.dynamicElements = state.dynamicElements;
      const chainInput = document.getElementById('chain-json-input');
      if (chainInput) chainInput.value = JSON.stringify(state.chainDefinition, null, 2);
    } catch {}
    try {
      const dynEl = document.getElementById('dynamic-elements-input');
      if (dynEl) dynEl.value = JSON.stringify(state.dynamicElements, null, 2);
    } catch {}
  };

  // Allow canceling long runs
  const stopBatchProcessing = () => {
    state.cancelRequested = true;
    utils.log('Stop requested');
  };

  // Function to start a new chat (language independent, uses data-testid)
  const startNewChat = async () => {
    utils.log('Starting new chat...');
    const btn = document.querySelector('a[data-testid="create-new-chat-button"]');
    if (btn) {
      utils.log('Using new chat button...');
      btn.click();
      await utils.sleep(1000);
      return true;
    }
    const homeLink = document.querySelector('a[href="/"]');
    if (homeLink && (homeLink.textContent || '').trim() !== '') {
      utils.log('Using home link...');
      homeLink.click();
      await utils.sleep(1000);
      return true;
    }
    utils.log('Failed to start a new chat', 'warning');
    return false;
  };

  const bindEvents = () => {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;

        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        // Update active tab content
        document
          .querySelectorAll('.tab-content')
          .forEach((content) => content.classList.remove('active'));
        document.getElementById(`${tabName}-tab`).classList.add('active');

        // Persist active tab
        utils.saveToStorage(STORAGE_KEYS.activeTab, tabName);
      });
    });

    // Stop batch button
    document.getElementById('stop-batch-btn').addEventListener('click', () => {
      stopBatchProcessing();
      document.getElementById('stop-batch-btn').style.display = 'none';
    });

    // Auto-remove processed items checkbox
    document.getElementById('auto-remove-checkbox').addEventListener('change', (e) => {
      state.autoRemoveProcessed = e.target.checked;
      utils.log(
        `Auto-remove processed items: ${state.autoRemoveProcessed ? 'enabled' : 'disabled'}`
      );
      utils.saveToStorage(STORAGE_KEYS.autoRemove, state.autoRemoveProcessed);
    });

    // Wait time input
    document.getElementById('wait-time-input').addEventListener('change', (e) => {
      const value = parseInt(e.target.value);
      if (value >= 0 && value <= 30000) {
        state.batchWaitTime = value;
        utils.log(`Wait time between items set to ${value}ms`);
        utils.saveToStorage(STORAGE_KEYS.waitTime, state.batchWaitTime);
      } else {
        e.target.value = state.batchWaitTime;
        utils.log('Invalid wait time, keeping current value', 'warning');
      }
    });

    // Per-step wait time input
    const stepWaitEl = document.getElementById('step-wait-input');
    if (stepWaitEl) {
      stepWaitEl.addEventListener('change', (e) => {
        const value = parseInt(e.target.value);
        if (value >= 0 && value <= 30000) {
          utils.saveToStorage(STORAGE_KEYS.stepWaitTime, value);
          utils.log(`Wait time between steps set to ${value}ms`);
        } else {
          const saved = parseInt(GM_getValue(STORAGE_KEYS.stepWaitTime, 0));
          e.target.value = String(!Number.isNaN(saved) ? saved : 0);
          utils.log('Invalid per-step wait time, keeping current value', 'warning');
        }
      });
    }

    const toggleLogVisibility = () => {
      const logWrap = document.getElementById('log-container');
      if (!logWrap) return;
      const currentlyHidden = logWrap.style.display === 'none';
      const willShow = currentlyHidden;
      logWrap.style.display = willShow ? 'flex' : 'none';
      // Toggle class on main container so CSS can adapt minimized height
      if (ui.mainContainer) {
        ui.mainContainer.classList.toggle('log-open', willShow);
      }
      utils.saveToStorage(STORAGE_KEYS.logVisible, willShow);
    };
    document.getElementById('header-log-toggle').addEventListener('click', toggleLogVisibility);

    // Clear log button
    document.getElementById('clear-log-btn').addEventListener('click', () => {
      if (ui.logContainer) ui.logContainer.textContent = '';
      utils.saveToStorage(STORAGE_KEYS.logHistory, []);
      utils.log('Log cleared');
    });

    // Stop button in minimized header
    document.getElementById('stop-mini-btn').addEventListener('click', () => {
      stopBatchProcessing();
      const stopRunBtn = document.getElementById('stop-run-btn');
      if (stopRunBtn) stopRunBtn.style.display = 'none';
      const stopBtn = document.getElementById('stop-batch-btn');
      if (stopBtn) stopBtn.style.display = 'none';
      const stopMini = document.getElementById('stop-mini-btn');
      if (stopMini) stopMini.style.display = 'none';
    });

    // Toggle auto-scroll button
    document.getElementById('toggle-auto-scroll-btn').addEventListener('click', () => {
      state.autoScrollLogs = !state.autoScrollLogs;
      const btn = document.getElementById('toggle-auto-scroll-btn');
      btn.style.opacity = state.autoScrollLogs ? '1' : '0.5';
      btn.title = state.autoScrollLogs ? 'Auto-scroll: ON' : 'Auto-scroll: OFF';
      utils.log(`Auto-scroll logs: ${state.autoScrollLogs ? 'enabled' : 'disabled'}`);
      if (state.autoScrollLogs && ui.logContainer)
        ui.logContainer.scrollTop = ui.logContainer.scrollHeight;
      utils.saveToStorage(STORAGE_KEYS.autoScroll, state.autoScrollLogs);
    });

    document.getElementById('minimize-btn').addEventListener('click', () => {
      state.isMinimized = !state.isMinimized;
      if (state.isMinimized) {
        // Save previous explicit height if present
        ui.mainContainer.classList.add('minimized');
      } else {
        ui.mainContainer.classList.remove('minimized');

        ui.mainContainer.style.height = '';
        // after finishing resize and saving state
        isResizing = false;
        // allow CSS/auto layout to reclaim sizing by removing inline size overrides
        if (ui.mainContainer) {
          ui.mainContainer.style.removeProperty('width');
          ui.mainContainer.style.removeProperty('height');
        }
        saveUIState(true);
      }
      saveUIState(true); // Immediate save for user action
    });

    // Close button
    document.getElementById('close-btn').addEventListener('click', () => {
      ui.mainContainer.style.display = 'none';
      state.uiVisible = false;
      saveUIState(true); // Immediate save for user action
      utils.log('UI closed');
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + Enter to send
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const sendBtn = document.getElementById('send-btn');
        if (sendBtn) sendBtn.click();
        e.preventDefault();
      }

      // Escape to minimize
      if (e.key === 'Escape') {
        document.getElementById('minimize-btn').click();
        e.preventDefault();
      }
    });

    // Dragging functionality
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    // Resizing functionality
    let isResizing = false;
    let resizeStartX, resizeStartY, resizeStartWidth, resizeStartHeight;

    const header = document.getElementById('automation-header');

    header.addEventListener('mousedown', (e) => {
      if (e.target.closest('.header-btn')) return; // Don't drag when clicking buttons

      isDragging = true;
      const rect = ui.mainContainer.getBoundingClientRect();
      dragOffset.x = e.clientX - rect.left;
      dragOffset.y = e.clientY - rect.top;
      header.style.userSelect = 'none';
      e.preventDefault();
    });

    ui.resizeHandle.addEventListener('mousedown', (e) => {
      isResizing = true;
      resizeStartX = e.clientX;
      resizeStartY = e.clientY;
      resizeStartWidth = ui.mainContainer.offsetWidth;
      resizeStartHeight = ui.mainContainer.offsetHeight;
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const x = e.clientX - dragOffset.x;
        const y = e.clientY - dragOffset.y;

        ui.mainContainer.style.left = `${Math.max(0, Math.min(x, window.innerWidth - ui.mainContainer.offsetWidth))}px`;
        ui.mainContainer.style.top = `${Math.max(0, Math.min(y, window.innerHeight - ui.mainContainer.offsetHeight))}px`;
        ui.mainContainer.style.right = 'auto';

        saveUIState(); // Debounced for drag operations
      } else if (isResizing) {
        // Clamp resizing to reasonable window bounds (sizes are automatic)
        const rawWidth = resizeStartWidth + (e.clientX - resizeStartX);
        const rawHeight = resizeStartHeight + (e.clientY - resizeStartY);
        const newWidth = Math.max(200, Math.min(window.innerWidth, rawWidth));
        const newHeight = Math.max(120, Math.min(window.innerHeight, rawHeight));

        ui.mainContainer.style.width = `${newWidth}px`;
        ui.mainContainer.style.height = `${newHeight}px`;

        saveUIState(); // Debounced for resize operations
      }
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        saveUIState(true); // Immediate save when drag ends
        isDragging = false;
        header.style.userSelect = '';
      }
      if (isResizing) {
        saveUIState(true); // Immediate save when resize ends
        isResizing = false;
      }
    });

    // Persist loop checkbox when used
    const loopEl = document.getElementById('loop-checkbox');
    loopEl.addEventListener('change', (e) => {
      state.isLooping = e.target.checked;
      utils.saveToStorage(STORAGE_KEYS.loop, state.isLooping);
    });

    // Settings: Debug mode
    const debugEl = document.getElementById('debug-mode-checkbox');
    if (debugEl) {
      debugEl.addEventListener('change', (e) => {
        CONFIG.DEBUG_MODE = !!e.target.checked;
        utils.saveToStorage(STORAGE_KEYS.configDebug, CONFIG.DEBUG_MODE);
        utils.log(`Debug mode ${CONFIG.DEBUG_MODE ? 'enabled' : 'disabled'}`);
      });
    }

    // Settings: Response timeout
    const timeoutEl = document.getElementById('response-timeout-input');
    if (timeoutEl) {
      timeoutEl.addEventListener('change', (e) => {
        const v = parseInt(e.target.value);
        if (!Number.isNaN(v) && v >= 10000 && v <= 6000000) {
          CONFIG.RESPONSE_TIMEOUT = v;
          utils.saveToStorage(STORAGE_KEYS.configTimeout, v);
          utils.log(`Response timeout set to ${v}ms`);
        } else {
          e.target.value = String(CONFIG.RESPONSE_TIMEOUT);
          utils.log('Invalid response timeout', 'warning');
        }
      });
    }

    // Settings: default visible
    const defVisEl = document.getElementById('default-visible-checkbox');
    if (defVisEl)
      defVisEl.addEventListener('change', (e) => {
        CONFIG.DEFAULT_VISIBLE = !!e.target.checked;
        try {
          GM_setValue(STORAGE_KEYS.configDefaultVisible, CONFIG.DEFAULT_VISIBLE);
        } catch {}
        // If user disables default visibility and UI wasn't explicitly opened, keep current visibility but don't force-open later
        utils.log(`Default visibility ${CONFIG.DEFAULT_VISIBLE ? 'ON' : 'OFF'}`);
      });

    // Restore log visibility
    try {
      const logWrap = document.getElementById('log-container');
      const vis = GM_getValue(STORAGE_KEYS.logVisible, false);
      if (logWrap) {
        logWrap.style.display = vis ? 'flex' : 'none';
      }
      if (ui.mainContainer) {
        ui.mainContainer.classList.toggle('log-open', !!vis);
      }
    } catch {}

    // Chain UI: basic actions
    const chainInput = document.getElementById('chain-json-input');
    const sampleItemsEl = document.getElementById('dynamic-elements-input');
    const chainCards = document.getElementById('chain-cards');
    const refreshChainCards = () => {
      if (!chainCards) return;
      chainCards.textContent = '';
      let chain;
      try {
        chain = JSON.parse(chainInput.value || '{}');
        // Update global state.chainDefinition when parsing JSON
        state.chainDefinition = chain;
      } catch {
        chain = null;
        state.chainDefinition = null;
      }
      // Reflect dynamicElements in the dedicated textarea
      if (
        chain &&
        (Array.isArray(chain.dynamicElements) || typeof chain.dynamicElements === 'string') &&
        sampleItemsEl
      ) {
        try {
          sampleItemsEl.value = JSON.stringify(chain.dynamicElements, null, 2);
        } catch {
          // if dynamicElements is a function string, show raw
          try {
            sampleItemsEl.value = String(chain.dynamicElements);
          } catch {}
        }
      }
      if (!chain || !Array.isArray(chain.steps) || chain.steps.length === 0) {
        // Chain cards will show empty state due to CSS :empty selector
        return;
      }
      chain.steps.forEach((step) => {
        const card = document.createElement('div');
        card.className = 'chain-card';
        card.dataset.stepId = step.id;

        const typeDisplay =
          step.type === 'template'
            ? 'Template (Batch)'
            : step.type === 'js'
              ? 'JavaScript'
              : step.type === 'prompt'
                ? 'Prompt'
                : step.type === 'http'
                  ? 'HTTP Request'
                  : step.type;

        utils.setSafeHTML(
          card,
          translator.replaceHTML(`
                          <div class="title">${step.title || step.id || '(untitled)'}</div>
                          <div class="meta">type: ${typeDisplay}${step.next ? ` → ${step.next}` : ''}</div>
                          <div class="actions">
                              <button class="btn btn-secondary btn-sm" data-action="edit" title="Edit step"><svg width="14" height="14" viewBox="0 0 640 640" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M100.4 417.2C104.5 402.6 112.2 389.3 123 378.5L304.2 197.3L338.1 163.4C354.7 180 389.4 214.7 442.1 267.4L476 301.3L442.1 335.2L260.9 516.4C250.2 527.1 236.8 534.9 222.2 539L94.4 574.6C86.1 576.9 77.1 574.6 71 568.4C64.9 562.2 62.6 553.3 64.9 545L100.4 417.2zM156 413.5C151.6 418.2 148.4 423.9 146.7 430.1L122.6 517L209.5 492.9C215.9 491.1 221.7 487.8 226.5 483.2L155.9 413.5zM510 267.4C493.4 250.8 458.7 216.1 406 163.4L372 129.5C398.5 103 413.4 88.1 416.9 84.6C430.4 71 448.8 63.4 468 63.4C487.2 63.4 505.6 71 519.1 84.6L554.8 120.3C568.4 133.9 576 152.3 576 171.4C576 190.5 568.4 209 554.8 222.5C551.3 226 536.4 240.9 509.9 267.4z"/></svg></button>
                              <button class="btn btn-danger btn-sm" data-action="delete" title="Delete step"><svg width="14" height="14" viewBox="0 0 448 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M136.7 5.9C141.1-7.2 153.3-16 167.1-16l113.9 0c13.8 0 26 8.8 30.4 21.9L320 32 416 32c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 8.7-26.1zM32 144l384 0 0 304c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-304zm88 64c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24zm104 0c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24zm104 0c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24z"/></svg></button>
                          </div>
                        `));

        card
          .querySelector('[data-action="edit"]')
          .addEventListener('click', () => openStepEditor(step.id));
        card.querySelector('[data-action="delete"]').addEventListener('click', () => {
          if (confirm(`${translator.instant('Delete step')} "${step.title || step.id}"?`)) {
            chain.steps = chain.steps.filter((s) => s.id !== step.id);
            // Remove references to this step
            chain.steps.forEach((s) => {
              if (s.next === step.id) s.next = '';
            });
            // Update entry point if needed
            if (chain.entryId === step.id) {
              chain.entryId = chain.steps.length > 0 ? chain.steps[0].id : '';
            }
            chainInput.value = JSON.stringify(chain, null, 2);
            utils.saveToStorage(STORAGE_KEYS.chainDef, chainInput.value);
            refreshChainCards();
            utils.log(`Step "${step.title || step.id}" deleted`);
          }
        });

        chainCards.appendChild(card);
      });
    };

    const openStepEditor = (stepId) => {
      let chain;
      try {
        chain = JSON.parse(chainInput.value || '{}');
      } catch {
        chain = { steps: [] };
      }
      if (!Array.isArray(chain.steps)) chain.steps = [];
      let step = chain.steps.find((s) => s.id === stepId);
      if (!step) {
        step = { id: stepId || `step-${Date.now()}`, type: 'prompt', title: '', template: '' };
        chain.steps.push(step);
      }
      const modal = document.getElementById('chain-step-modal');
      modal.style.display = 'block';
      modal.setAttribute('aria-hidden', 'false');

      // Populate fields
      document.getElementById('step-id-input').value = step.id || '';
      document.getElementById('step-title-input').value = step.title || '';
      document.getElementById('step-type-select').value = step.type || 'prompt';
      // Per-step options
      const respTypeSel = document.getElementById('step-response-type');
      if (respTypeSel) respTypeSel.value = step.responseType || 'text';
      const newChatCb = document.getElementById('step-newchat-checkbox');
      if (newChatCb) newChatCb.checked = !!step.newChat;

      // Prompt content
      const promptEl = document.getElementById('step-prompt-template');
      if (promptEl) promptEl.value = step.template || step.content || step.message || '';

      // Template fields
      document.getElementById('step-template-input').value = step.template || '';
      const stepElementsEl = document.getElementById('step-template-elements');
      stepElementsEl.value = step.elements || '';
      const useSamplesCb = document.getElementById('step-use-dynamicelements-checkbox');
      // Override-but-restore: when checked, populate the step elements from chain.dynamicElements
      // and disable editing; when unchecked, restore the previous per-step value.
      if (useSamplesCb) {
        useSamplesCb.checked = !!step.useDynamicElements;
        // Replace any existing handler to avoid duplicates
        useSamplesCb.onchange = (e) => {
          try {
            if (e.target.checked) {
              // Backup current step value so it can be restored later
              try {
                modal.dataset.backupStepElements = stepElementsEl.value || '';
              } catch {}
              // Populate from chain.dynamicElements (prefer chain parsed from editor)
              try {
                if (
                  chain &&
                  (Array.isArray(chain.dynamicElements) ||
                    typeof chain.dynamicElements === 'string')
                ) {
                  try {
                    stepElementsEl.value = JSON.stringify(chain.dynamicElements, null, 2);
                  } catch {
                    stepElementsEl.value = String(chain.dynamicElements);
                  }
                } else {
                  stepElementsEl.value = '';
                }
              } catch {}
              stepElementsEl.disabled = true;
            } else {
              // Restore backed-up value (if any) and re-enable editing
              try {
                const bak = modal.dataset.backupStepElements;
                stepElementsEl.value = bak != null ? bak : step.elements || '';
                delete modal.dataset.backupStepElements;
              } catch {
                stepElementsEl.value = step.elements || '';
              }
              stepElementsEl.disabled = false;
            }
          } catch (err) {
            utils.log('Failed to toggle useDynamicElements: ' + err.message, 'error');
          }
        };
        // Initialize UI state according to the checkbox
        if (useSamplesCb.checked) {
          // Trigger handler to populate from chain
          useSamplesCb.dispatchEvent(new Event('change'));
        } else {
          stepElementsEl.disabled = false;
        }
      }

      // Prompt
      document.getElementById('step-prompt-template').value = step.template || '';

      // HTTP fields
      document.getElementById('step-http-url').value = step.url || '';
      document.getElementById('step-http-method').value = (step.method || 'GET').toUpperCase();
      document.getElementById('step-http-headers').value = step.headers
        ? JSON.stringify(step.headers)
        : '';
      document.getElementById('step-http-body').value = step.bodyTemplate || '';

      // JavaScript
      document.getElementById('step-js-code').value = step.code || '';

      // Populate next step selector with auto-suggestion
      const nextSel = document.getElementById('step-next-select');
      const endOption = document.createElement('option');
      endOption.value = '';
      endOption.textContent = translator.translate('(end)');
      nextSel.replaceChildren(endOption);
      const currentIndex = chain.steps.findIndex((s) => s.id === step.id);

      chain.steps.forEach((s, index) => {
        if (s.id !== step.id) {
          // Don't include self
          const opt = document.createElement('option');
          opt.value = s.id;
          const labelParts = [s.id];
          if (s.title) labelParts.push('— ' + s.title);
          if (s.type) labelParts.push('(' + s.type + ')');
          opt.textContent = labelParts.join(' ');
          if (step.next === s.id) {
            opt.selected = true;
          } else if (!step.next && index === currentIndex + 1) {
            // Auto-suggest next sequential step
            opt.selected = true;
            step.next = s.id;
          }
          nextSel.appendChild(opt);
        }
      });

      const onTypeChange = () => {
        const type = document.getElementById('step-type-select').value;

        // Clear all fields first when type changes to prevent contamination
        if (step.type && step.type !== type) {
          // Clear previous type's fields from the step object and UI
          delete step.template;
          delete step.elements;
          delete step.code;
          delete step.url;
          delete step.method;
          delete step.headers;
          delete step.bodyTemplate;
          delete step.message;
          // Clear form inputs
          const clear = (id) => {
            const el = document.getElementById(id);
            if (el) el.value = id === 'step-http-method' ? 'GET' : '';
          };
          [
            'step-prompt-template',
            'step-template-input',
            'step-template-elements',
            'step-js-code',
            'step-http-url',
            'step-http-headers',
            'step-http-body',
            'step-http-method',
          ].forEach(clear);

          // Clear form inputs
          document.getElementById('step-prompt-template').value = '';
          document.getElementById('step-template-input').value = '';
          document.getElementById('step-template-elements').value = '';
          document.getElementById('step-js-code').value = '';
          document.getElementById('step-http-url').value = '';
          document.getElementById('step-http-method').value = 'GET';
          document.getElementById('step-http-headers').value = '';
          document.getElementById('step-http-body').value = '';
        }

        // Update step type
        step.type = type;

        // Toggle field groups based on step type
        modal
          .querySelectorAll('[data-field="prompt"]')
          .forEach((el) => (el.style.display = type === 'prompt' ? 'block' : 'none'));
        modal
          .querySelectorAll('[data-field="template"]')
          .forEach((el) => (el.style.display = type === 'template' ? 'block' : 'none'));
        modal
          .querySelectorAll('[data-field="http"]')
          .forEach((el) => (el.style.display = type === 'http' ? 'block' : 'none'));
        modal
          .querySelectorAll('[data-field="js"]')
          .forEach((el) => (el.style.display = type === 'js' ? 'block' : 'none'));
      };
      document.getElementById('step-type-select').onchange = onTypeChange;
      onTypeChange();

      const saveBtn = document.getElementById('save-step-btn');
      const deleteBtn = document.getElementById('delete-step-btn');
      const closeBtn = document.getElementById('close-step-modal-btn');

      const closeModal = () => {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
      };
      closeBtn.onclick = closeModal;

      deleteBtn.onclick = () => {
        if (confirm(`${translator.instant('Delete step')} "${step.title || step.id}"?`)) {
          chain.steps = chain.steps.filter((s) => s.id !== step.id);
          // Remove references
          chain.steps.forEach((s) => {
            if (s.next === step.id) s.next = '';
          });
          // Update entry point if needed
          if (chain.entryId === step.id) {
            chain.entryId = chain.steps.length > 0 ? chain.steps[0].id : '';
          }
          chainInput.value = JSON.stringify(chain, null, 2);
          utils.saveToStorage(STORAGE_KEYS.chainDef, chainInput.value);
          refreshChainCards();
          closeModal();
          utils.log(`Step "${step.title || step.id}" deleted`);
        }
      };

      saveBtn.onclick = () => {
        const newId = document.getElementById('step-id-input').value.trim() || step.id;
        const oldId = step.id;
        step.id = newId;
        step.title = document.getElementById('step-title-input').value.trim();
        step.type = document.getElementById('step-type-select').value;
        step.next = document.getElementById('step-next-select').value;

        // Clear all type-specific fields first
        delete step.template;
        delete step.elements;
        delete step.code;
        delete step.url;
        delete step.method;
        delete step.headers;
        delete step.bodyTemplate;
        delete step.message;
        delete step.responseType;
        delete step.newChat;
        delete step.useDynamicElements;

        // Save type-specific fields based on current type
        if (step.type === 'template') {
          step.template = document.getElementById('step-template-input').value;
          step.elements = document.getElementById('step-template-elements').value;
          step.useDynamicElements = !!document.getElementById('step-use-dynamicelements-checkbox')
            ?.checked;
        } else if (step.type === 'prompt') {
          step.template = document.getElementById('step-prompt-template').value;
          step.responseType = document.getElementById('step-response-type')?.value || 'text';
          step.newChat = !!document.getElementById('step-newchat-checkbox')?.checked;
        } else if (step.type === 'http') {
          step.url = document.getElementById('step-http-url').value.trim();
          step.method = document.getElementById('step-http-method').value.trim();
          try {
            const headerText = document.getElementById('step-http-headers').value.trim();
            step.headers = headerText ? JSON.parse(headerText) : {};
          } catch {
            step.headers = {};
          }
          step.bodyTemplate = document.getElementById('step-http-body').value;
        } else if (step.type === 'js') {
          step.code = document.getElementById('step-js-code').value;
        }

        // If ID changed, update references
        if (oldId !== newId) {
          chain.steps.forEach((s) => {
            if (s.next === oldId) s.next = newId;
          });
          if (chain.entryId === oldId) chain.entryId = newId;
        }

        chainInput.value = JSON.stringify(chain, null, 2);
        utils.saveToStorage(STORAGE_KEYS.chainDef, chainInput.value);
        refreshChainCards();
        closeModal();
        utils.log(`Step "${step.title || step.id}" saved`);

        // Note: preset save is handled by the dedicated icon in the popup
      };
    };

    const addStepBtn = document.getElementById('add-step-btn');
    if (addStepBtn)
      addStepBtn.addEventListener('click', () => {
        let chain;
        try {
          chain = JSON.parse(chainInput.value || '{}');
        } catch {
          chain = {};
        }
        if (!chain.steps) chain.steps = [];

        const id = `step-${(chain.steps.length || 0) + 1}`;
        const newStep = {
          id,
          title: `Step ${chain.steps.length + 1}`,
          type: 'prompt',
          template: '',
        };

        // Auto-link the previous step if it doesn't have a next
        if (chain.steps.length > 0) {
          const lastStep = chain.steps[chain.steps.length - 1];
          if (!lastStep.next) {
            lastStep.next = id;
          }
        }

        chain.steps.push(newStep);
        if (!chain.entryId) chain.entryId = id;
        chainInput.value = JSON.stringify(chain, null, 2);
        utils.saveToStorage(STORAGE_KEYS.chainDef, chainInput.value);
        refreshChainCards();

        // Open editor and default to "Select preset"
        openStepEditor(id);
        // Reset the preset selector to show "Select preset..."
        setTimeout(() => {
          const presetSelect = document.getElementById('step-preset-select');
          if (presetSelect) presetSelect.value = '';
        }, 100);
      });

    const validateChainBtn = document.getElementById('validate-chain-btn');
    if (validateChainBtn)
      validateChainBtn.addEventListener('click', () => {
        // Ensure log is visible when validating for better feedback
        try {
          const logWrap = document.getElementById('log-container');
          if (logWrap && logWrap.style.display === 'none') {
            logWrap.style.display = 'flex';
            if (ui.mainContainer) ui.mainContainer.classList.add('log-open');
            utils.saveToStorage(STORAGE_KEYS.logVisible, true);
          }
        } catch {}
        try {
          const c = JSON.parse(chainInput.value || '{}');
          if (!c.entryId) throw new Error('Missing entryId');
          if (!Array.isArray(c.steps) || !c.steps.length) throw new Error('No steps');
          const ids = new Set(c.steps.map((s) => s.id));
          if (!ids.has(c.entryId)) throw new Error('entryId not found among steps');
          c.steps.forEach((s) => {
            if (s.next && !ids.has(s.next))
              throw new Error(`Step ${s.id} next '${s.next}' not found`);
          });
          utils.log('Chain valid');
        } catch (e) {
          utils.log('Chain invalid: ' + e.message, 'error');
        }
      });

    const runChainBtn = document.getElementById('run-chain-btn');
    const stopRunBtn = document.getElementById('stop-run-btn');
    if (stopRunBtn) {
      stopRunBtn.addEventListener('click', () => {
        stopBatchProcessing();
        stopRunBtn.style.display = 'none';
      });
    }
    if (runChainBtn)
      runChainBtn.addEventListener('click', async () => {
        // When running, load whatever is currently in the dynamic elements textarea
        try {
          const dynEl = document.getElementById('dynamic-elements-input');
          let items = [];
          if (dynEl) {
            const raw = (dynEl.value || '').trim();
            if (raw) {
              if (raw.startsWith('[') || raw.startsWith('{')) {
                try {
                  const parsed = JSON.parse(raw);
                  items = Array.isArray(parsed) ? parsed : [parsed];
                } catch (e) {
                  // fallback to processor for function-style inputs
                  try {
                    const parsed = await processors.parseDynamicElements(raw);
                    items = Array.isArray(parsed) ? parsed : [parsed];
                  } catch {}
                }
              } else {
                try {
                  const parsed = await processors.parseDynamicElements(raw);
                  items = Array.isArray(parsed) ? parsed : [parsed];
                } catch {}
              }
            }
          }
          state.dynamicElements = items;
          // If the new list is shorter than what we've already processed, clamp the current index
          try {
            if (
              typeof state.currentBatchIndex === 'number' &&
              state.currentBatchIndex > items.length
            ) {
              state.currentBatchIndex = Math.max(0, items.length);
            }
          } catch {}
          // Keep chainDefinition in sync so the JSON reflects the runtime items
          try {
            if (!state.chainDefinition) {
              state.chainDefinition = JSON.parse(
                document.getElementById('chain-json-input').value || '{}'
              );
            }
            state.chainDefinition.dynamicElements = items;
            const chainInput = document.getElementById('chain-json-input');
            if (chainInput) chainInput.value = JSON.stringify(state.chainDefinition, null, 2);
          } catch {}
        } catch (e) {
          utils.log('Failed to read dynamic elements before run: ' + e.message, 'warning');
        }

        if (stopRunBtn) stopRunBtn.style.display = 'inline-flex';
        await runChainWithBatch();
        if (stopRunBtn) stopRunBtn.style.display = 'none';
      });

    // Generic JSON formatter for overlay buttons
    const registerJsonFormatter = (btnId, inputId, opts = {}) => {
      const btn = document.getElementById(btnId);
      if (!btn) return;
      btn.addEventListener('click', async () => {
        try {
          const src = document.getElementById(inputId);
          if (!src) return;
          const val = (src.value || '').trim();
          if (!val) return;
          let parsed;
          if (!opts.allowFunction && (val.startsWith('[') || val.startsWith('{')))
            parsed = JSON.parse(val);
          else parsed = await processors.parseDynamicElements(val);
          src.value = JSON.stringify(parsed, null, 2);
          utils.log(`${opts.label || 'JSON'} formatted`);
        } catch (e) {
          utils.log(`Invalid ${opts.label || 'value'}: ${e.message}`, 'error');
        }
      });
    };

    registerJsonFormatter('format-chain-json-btn', 'chain-json-input', {
      label: 'Chain JSON',
      allowFunction: false,
    });
    registerJsonFormatter('format-dyn-elements-btn', 'dynamic-elements-input', {
      label: 'Dynamic elements',
      allowFunction: true,
    });
    registerJsonFormatter('format-step-elements-btn', 'step-template-elements', {
      label: 'Step elements',
      allowFunction: true,
    });
    registerJsonFormatter('format-http-headers-btn', 'step-http-headers', {
      label: 'HTTP headers',
      allowFunction: false,
    });
    registerJsonFormatter('format-http-body-btn', 'step-http-body', {
      label: 'HTTP body',
      allowFunction: false,
    });

    // Change events to keep cards in sync and persist data
    if (chainInput) {
      chainInput.addEventListener('input', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(chainInput.value || '{}');
        } catch {
          /* ignore parse errors during typing */
        }
        if (parsed) {
          state.chainDefinition = parsed;
          refreshChainCards();
        } else {
          // if invalid, still clear cards to reflect invalid state
          refreshChainCards();
        }
        utils.saveToStorage(STORAGE_KEYS.chainDef, chainInput.value);
      });
    }
    // Stop auto-syncing dynamic elements on input; apply explicitly via button
    const applyDynBtn = document.getElementById('apply-dyn-elements-btn');
    if (applyDynBtn) {
      applyDynBtn.addEventListener('click', async () => {
        try {
          const src = document.getElementById('dynamic-elements-input');
          const raw = (src?.value || '').trim();
          if (!raw) {
            state.dynamicElements = [];
            utils.log('Dynamic elements cleared');
            try {
              if (!state.chainDefinition) {
                const txt = document.getElementById('chain-json-input')?.value || '{}';
                state.chainDefinition = JSON.parse(txt);
              }
              state.chainDefinition.dynamicElements = [];
              const chainInput = document.getElementById('chain-json-input');
              if (chainInput) chainInput.value = JSON.stringify(state.chainDefinition, null, 2);
            } catch {}
            refreshBatchProgress(0, 0);
            return;
          }
          let items;
          if (raw.startsWith('[') || raw.startsWith('{')) items = JSON.parse(raw);
          else items = await processors.parseDynamicElements(raw);
          if (!Array.isArray(items)) items = [items];
          state.dynamicElements = items;
          utils.log(`Applied ${items.length} dynamic element(s) to runtime`);
          try {
            if (!state.chainDefinition) {
              const txt = document.getElementById('chain-json-input')?.value || '{}';
              state.chainDefinition = JSON.parse(txt);
            }
            state.chainDefinition.dynamicElements = items;
            const chainInput = document.getElementById('chain-json-input');
            if (chainInput) chainInput.value = JSON.stringify(state.chainDefinition, null, 2);
          } catch {}
          if (!state.isProcessing) refreshBatchProgress(0, items.length);
        } catch (e) {
          utils.log('Invalid dynamic elements: ' + e.message, 'error');
        }
      });
    }
    // Live-sync dynamic elements while running: when user edits the textarea during a run,
    // parse and update state.dynamicElements and the chain JSON so the running batch reflects changes.
    const dynInputEl = document.getElementById('dynamic-elements-input');
    if (dynInputEl) {
      dynInputEl.addEventListener('input', async (e) => {
        // If not processing, do nothing — user must press Apply to change runtime by default.
        if (!state.isProcessing) return;
        try {
          const raw = (e.target.value || '').trim();
          let items = [];
          if (raw) {
            if (raw.startsWith('[') || raw.startsWith('{')) {
              try {
                const parsed = JSON.parse(raw);
                items = Array.isArray(parsed) ? parsed : [parsed];
              } catch {
                try {
                  const parsed = await processors.parseDynamicElements(raw);
                  items = Array.isArray(parsed) ? parsed : [parsed];
                } catch {}
              }
            } else {
              try {
                const parsed = await processors.parseDynamicElements(raw);
                items = Array.isArray(parsed) ? parsed : [parsed];
              } catch {}
            }
          }
          // Replace live items but preserve already-processed count by removing leading items
          // that were already processed when appropriate. Simpler approach: replace full list.
          state.dynamicElements = items;
          // Update chain JSON representation for visibility
          try {
            if (!state.chainDefinition)
              state.chainDefinition = JSON.parse(
                document.getElementById('chain-json-input').value || '{}'
              );
            state.chainDefinition.dynamicElements = items;
            const chainInput = document.getElementById('chain-json-input');
            if (chainInput) chainInput.value = JSON.stringify(state.chainDefinition, null, 2);
          } catch {}
          utils.log(`Runtime dynamic elements updated (${items.length} items) while running`);
          // Refresh header progress: denominator = processed so far + remaining items
          const done = Math.max(0, Number(state.processedCount || 0));
          refreshBatchProgress(Math.min(done, done + items.length), done + items.length);
        } catch (err) {
          utils.log('Failed to live-apply dynamic elements: ' + err.message, 'error');
        }
      });
    }
    refreshChainCards();

    // Presets: populate selects and wire buttons (normalized storage)
    const loadPresetSelects = () => {
      // Steps presets
      let stepsMapRaw = GM_getValue(STORAGE_KEYS.presetsSteps, {});
      let stepsMap = {};
      try {
        stepsMap = typeof stepsMapRaw === 'string' ? JSON.parse(stepsMapRaw) : stepsMapRaw || {};
      } catch {
        stepsMap = {};
      }

      const defaultSteps = {
        'Get Weather': {
          type: 'http',
          url: 'https://wttr.in/{item}?format=j1',
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        },
        'Extract Data': {
          type: 'js',
          code: 'const raw = steps.weather?.rawText ?? steps.weather?.data;\nconst data = typeof raw === "string" ? JSON.parse(raw) : raw;\nconst tempC = Number(data?.current_condition?.[0]?.temp_C);\nutils.log("Temperature °C:", tempC);\nreturn isNaN(tempC) ? null : tempC;',
        },
        'Ask ChatGPT': {
          type: 'prompt',
          template: 'Explain the implications of the temperature {steps.extractData.response} K.',
        },
        'Basic Prompt': {
          type: 'prompt',
          template: 'Please analyze {item} and provide 3 key insights.',
        },
        'API Call': {
          type: 'http',
          url: 'https://jsonplaceholder.typicode.com/posts/{item}',
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        },
        'Reddit .json': {
          type: 'http',
          url: 'https://www.reddit.com/.json',
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        },
        'Process JSON': {
          type: 'js',
          code: 'const raw = steps.apiCall?.rawText ?? steps.apiCall?.data;\nconst data = typeof raw === "string" ? JSON.parse(raw) : raw;\nutils.log("Post title:", data?.title);\nreturn data?.title;',
        },
      };

      Object.entries(defaultSteps).forEach(([name, preset]) => {
        if (!Object.prototype.hasOwnProperty.call(stepsMap, name)) stepsMap[name] = preset;
      });
      try {
        GM_setValue(STORAGE_KEYS.presetsSteps, stepsMap);
      } catch {}

      // Chains presets
      let chainsMapRaw = GM_getValue(STORAGE_KEYS.presetsChains, {});
      let chainsMap = {};
      try {
        chainsMap =
          typeof chainsMapRaw === 'string' ? JSON.parse(chainsMapRaw) : chainsMapRaw || {};
      } catch {
        chainsMap = {};
      }

      const defaultChains = {
        'Weather Analysis': JSON.stringify(
          {
            dynamicElements: ['London', 'Tokyo', 'New York'],
            entryId: 'weather',
            steps: [
              {
                id: 'weather',
                type: 'http',
                url: 'https://wttr.in/{item}?format=j1',
                method: 'GET',
                next: 'extract',
              },
              {
                id: 'extract',
                type: 'js',
                code: 'const raw = steps.weather?.rawText ?? steps.weather?.data;\nconst data = typeof raw === "string" ? JSON.parse(raw) : raw;\nconst tempC = Number(data?.current_condition?.[0]?.temp_C);\nutils.log(`Weather for {item}: ${isNaN(tempC)?"n/a":tempC+"°C"}`);\nreturn isNaN(tempC) ? "Unknown" : tempC + "°C";',
                next: 'chat',
              },
              {
                id: 'chat',
                type: 'prompt',
                template:
                  'In {item}, the current temperature is {steps.extract.response}. Share a fun fact about this city.',
              },
            ],
          },
          null,
          2
        ),
        'Content Research': JSON.stringify(
          {
            dynamicElements: ['JavaScript', 'TypeScript', 'WebAssembly'],
            entryId: 'search',
            steps: [
              {
                id: 'search',
                type: 'prompt',
                template: 'Research {item} and provide 3 key facts',
                next: 'summarize',
              },
              {
                id: 'summarize',
                type: 'js',
                code: 'const text = steps.search.response || "";\nreturn text.slice(0,200) + (text.length>200?"...":"");',
                next: 'expand',
              },
              {
                id: 'expand',
                type: 'prompt',
                template:
                  'Using this summary: {steps.summarize.response}, write a short article about {item}',
              },
            ],
          },
          null,
          2
        ),
        'Simple Chain': JSON.stringify(
          {
            dynamicElements: ['London', 'Tokyo', 'New York'],
            entryId: 'step1',
            steps: [
              { id: 'step1', type: 'prompt', template: 'Tell me about {item}', next: 'step2' },
              { id: 'step2', type: 'template', template: 'Summary: {steps.step1.response}' },
            ],
          },
          null,
          2
        ),
        'Reddit JSON': JSON.stringify(
          {
            entryId: 'redditGet',
            steps: [
              {
                id: 'redditGet',
                type: 'http',
                url: 'https://www.reddit.com/.json',
                method: 'GET',
                next: 'logJson',
              },
              {
                id: 'logJson',
                type: 'js',
                code:
                  'const raw = steps.redditGet?.rawText ?? steps.redditGet?.data;\n' +
                  'const data = typeof raw === "string" ? (function(){ try { return JSON.parse(raw); } catch(e){ return raw; } })() : raw;\n' +
                  'const children = Array.isArray(data?.data?.children) ? data.data.children : [];\n' +
                  'const posts = children.slice(0,10).map(c => { const d = c.data || {}; return { title: d.title, author: d.author, subreddit: d.subreddit, score: d.score, num_comments: d.num_comments, id: d.id, url: d.url }; });\n' +
                  'const summary = { kind: data?.kind || "Listing", topPosts: posts };\n' +
                  'log(`Prepared reddit summary with ${posts.length} posts`);\n' +
                  'return JSON.stringify(summary);',
                next: 'summarize',
              },
              {
                id: 'summarize',
                type: 'prompt',
                template:
                  'I have a compact reddit summary: {steps.logJson.response}\n\nBased on this summary, what interesting insights or patterns do you observe about trending topics, engagement (score vs comments), or subreddit activity?',
              },
            ],
          },
          null,
          2
        ),
        'Kanji Mnemonics': JSON.stringify(
          {
            dynamicElements: [
              { index: 1, kanji: '一', keyword: 'One', kanji_id: '40' },
              { index: 2, kanji: '二', keyword: 'Two', kanji_id: '41' },
              { index: 3, kanji: '三', keyword: 'Three', kanji_id: '42' },
              { index: 4, kanji: '口', keyword: 'Mouth, Entrance', kanji_id: '83' },
              {
                index: 6,
                kanji: '四',
                keyword: 'Four',
                components: ['legs', 'Mouth, Entrance'],
                kanji_id: '43',
              },
            ],
            entryId: 'mnemonic',
            steps: [
              {
                id: 'mnemonic',
                type: 'prompt',
                template:
                  'Create a vivid mnemonic story for the kanji {item.kanji} meaning {item.keyword}. Components (if any): {item.components}. Respond in 1-2 lines.',
                newChat: true,
                next: 'imgPrompt',
              },
              {
                id: 'imgPrompt',
                type: 'prompt',
                template:
                  'Based on this mnemonic: {steps.mnemonic.response}\\nWrite a concise visual image prompt (no prefatory text).',
                newChat: true,
                next: 'genImage',
              },
              {
                id: 'genImage',
                type: 'prompt',
                template:
                  'Generate an image for this prompt: {steps.imgPrompt.response}. Return the image here in chat.',
                responseType: 'image',
                newChat: true,
                next: 'sendToServer',
              },
              {
                id: 'sendToServer',
                type: 'http',
                method: 'POST',
                url: 'https://postman-echo.com/post',
                headers: { 'Content-Type': 'application/json' },
                bodyTemplate:
                  '{"kanjiId": "{item.kanji_id}", "kanji": "{item.kanji}", "mnemonic": "{steps.mnemonic.response}", "imagePrompt": "{steps.imgPrompt.response}", "imageUrl": "{steps.genImage.images[0]}"}',
              },
            ],
          },
          null,
          2
        ),
      };

      Object.entries(defaultChains).forEach(([name, preset]) => {
        if (!Object.prototype.hasOwnProperty.call(chainsMap, name))
          chainsMap[name] = typeof preset === 'string' ? preset : JSON.stringify(preset, null, 2);
      });
      try {
        GM_setValue(STORAGE_KEYS.presetsChains, chainsMap);
      } catch {}

      const fill = (id, map) => {
        const sel = document.getElementById(id);
        if (!sel) return;
        const defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.textContent = translator.translate('Select preset...');
        sel.replaceChildren(defaultOpt);
        Object.keys(map || {})
          .sort()
          .forEach((name) => {
            const o = document.createElement('option');
            o.value = name;
            o.textContent = name;
            sel.appendChild(o);
          });
      };
      fill('composer-preset-select', chainsMap);
      fill('step-preset-select', stepsMap);
    };

    const getComposerPresetName = () =>
      (document.getElementById('composer-preset-name-input')?.value || '').trim();

    const savePreset = (storeKey, name, value) => {
      if (!name) return utils.log('Enter a preset name', 'warning');
      try {
        const raw = GM_getValue(storeKey, {}) || {};
        const map = typeof raw === 'string' ? JSON.parse(raw) : raw;
        map[name] = value;
        GM_setValue(storeKey, map);
        loadPresetSelects();
        utils.log(`Preset "${name}" saved`);
      } catch (e) {
        utils.log('Save failed: ' + e.message, 'error');
      }
    };

    const deletePreset = (storeKey, selId) => {
      try {
        const sel = document.getElementById(selId);
        if (!sel || !sel.value) return utils.log('Select a preset to delete', 'warning');
        const name = sel.value;
        // Confirm with the user before deleting the selected preset/chain
        if (!confirm(`Delete preset/chain "${name}"? This action cannot be undone.`)) {
          utils.log(`Delete cancelled for "${name}"`, 'info');
          return;
        }
        const raw = GM_getValue(storeKey, {}) || {};
        const map = typeof raw === 'string' ? JSON.parse(raw) : raw;
        delete map[name];
        GM_setValue(storeKey, map);
        loadPresetSelects();
        utils.log(`Preset "${name}" deleted`);
      } catch (e) {
        utils.log('Delete failed: ' + e.message, 'error');
      }
    };

    const loadPreset = (storeKey, selId, apply) => {
      try {
        const sel = document.getElementById(selId);
        if (!sel || !sel.value) return utils.log('Select a preset to load', 'warning');
        const raw = GM_getValue(storeKey, {}) || {};
        const map = typeof raw === 'string' ? JSON.parse(raw) : raw;
        const v = map[sel.value];
        if (v == null) return utils.log('Preset not found', 'warning');
        apply(v);
        utils.log(`Preset "${sel.value}" loaded`);
      } catch (e) {
        utils.log('Load failed: ' + e.message, 'error');
      }
    };

    loadPresetSelects();

    // Composer preset handlers
    document.getElementById('save-composer-preset-btn')?.addEventListener('click', () => {
      const name = getComposerPresetName();
      const chainValue = document.getElementById('chain-json-input')?.value || '';
      savePreset(STORAGE_KEYS.presetsChains, name, chainValue);
    });

    document.getElementById('load-composer-preset-btn')?.addEventListener('click', () => {
      const sel = document.getElementById('composer-preset-select');
      if (sel && (!sel.value || sel.value.trim() === '')) {
        const chainInput = document.getElementById('chain-json-input');
        if (chainInput) {
          chainInput.value = '';
          state.chainDefinition = null;
          utils.saveToStorage(STORAGE_KEYS.chainDef, '');
          refreshChainCards();
          utils.log('Cleared chain definition');
        }
        return;
      }
      loadPreset(STORAGE_KEYS.presetsChains, 'composer-preset-select', (v) => {
        const chainInput = document.getElementById('chain-json-input');
        if (chainInput) {
          const str = typeof v === 'string' ? v : JSON.stringify(v, null, 2);
          chainInput.value = str;
          try {
            state.chainDefinition = JSON.parse(str);
          } catch {
            state.chainDefinition = null;
          }
          utils.saveToStorage(STORAGE_KEYS.chainDef, str);
          // Clear dynamic items when switching presets
          state.dynamicElements = [];
          const dynEl = document.getElementById('dynamic-elements-input');
          if (dynEl) dynEl.value = '';
          // Refresh chain cards to show the loaded chain
          refreshChainCards();
        }
      });
    });

    document.getElementById('delete-composer-preset-btn')?.addEventListener('click', () => {
      deletePreset(STORAGE_KEYS.presetsChains, 'composer-preset-select');
    });

    // Step modal preset handlers
    document.getElementById('save-step-preset-btn')?.addEventListener('click', () => {
      const modal = document.getElementById('chain-step-modal');
      if (!modal || modal.style.display === 'none') return;

      // Collect current step data
      const stepData = {
        type: document.getElementById('step-type-select')?.value || '',
        title: document.getElementById('step-title-input')?.value || '',
        template:
          document.getElementById('step-template-input')?.value ||
          document.getElementById('step-prompt-template')?.value ||
          '',
        elements: document.getElementById('step-template-elements')?.value || '',
        code: document.getElementById('step-js-code')?.value || '',
        url: document.getElementById('step-http-url')?.value || '',
        method: document.getElementById('step-http-method')?.value || 'GET',
        headers: document.getElementById('step-http-headers')?.value || '',
        bodyTemplate: document.getElementById('step-http-body')?.value || '',
      };

      const name = prompt('Enter preset name:');
      if (name) {
        try {
          const raw = GM_getValue(STORAGE_KEYS.presetsSteps, {}) || {};
          const map = typeof raw === 'string' ? JSON.parse(raw) : raw;
          map[name] = stepData;
          GM_setValue(STORAGE_KEYS.presetsSteps, map);
        } catch (e) {
          utils.log('Failed saving step preset: ' + e.message, 'error');
        }
        loadPresetSelects();
      }
    });

    document.getElementById('step-preset-select')?.addEventListener('change', (e) => {
      if (!e.target.value) return;
      try {
        const raw = GM_getValue(STORAGE_KEYS.presetsSteps, {}) || {};
        const map = typeof raw === 'string' ? JSON.parse(raw) : raw;
        let stepData = map[e.target.value];
        if (typeof stepData === 'string') {
          try {
            stepData = JSON.parse(stepData);
          } catch {}
        }
        if (!stepData) return;
        if (stepData.type) {
          const typeSel = document.getElementById('step-type-select');
          typeSel.value = stepData.type;
          typeSel.dispatchEvent(new Event('change'));
        }
        if (stepData.title) document.getElementById('step-title-input').value = stepData.title;
        if (stepData.template) {
          // Apply to both prompt/template fields as applicable
          const promptEl = document.getElementById('step-prompt-template');
          const tmplEl = document.getElementById('step-template-input');
          if (promptEl) promptEl.value = stepData.template;
          if (tmplEl) tmplEl.value = stepData.template;
        }
        if (stepData.elements)
          document.getElementById('step-template-elements').value = stepData.elements;
        if (stepData.responseType) {
          const r = document.getElementById('step-response-type');
          if (r) r.value = stepData.responseType;
        }
        if (typeof stepData.newChat === 'boolean') {
          const nc = document.getElementById('step-newchat-checkbox');
          if (nc) nc.checked = !!stepData.newChat;
        }
        if (stepData.code) document.getElementById('step-js-code').value = stepData.code;
        if (stepData.url) document.getElementById('step-http-url').value = stepData.url;
        if (stepData.method) document.getElementById('step-http-method').value = stepData.method;
        if (stepData.headers)
          document.getElementById('step-http-headers').value =
            typeof stepData.headers === 'string'
              ? stepData.headers
              : JSON.stringify(stepData.headers);
        if (stepData.bodyTemplate)
          document.getElementById('step-http-body').value = stepData.bodyTemplate;
      } catch (err) {
        utils.log('Failed to load step preset: ' + err.message, 'error');
      }
    });

    // Add delete step preset button handler
    document.getElementById('delete-step-preset-btn')?.addEventListener('click', () => {
      const select = document.getElementById('step-preset-select');
      if (!select || !select.value) {
        utils.log('Select a preset to delete', 'warning');
        return;
      }

      if (confirm(`Delete preset "${select.value}"?`)) {
        try {
          const raw = GM_getValue(STORAGE_KEYS.presetsSteps, {}) || {};
          const map = typeof raw === 'string' ? JSON.parse(raw) : raw;
          delete map[select.value];
          GM_setValue(STORAGE_KEYS.presetsSteps, map);
          loadPresetSelects();
          utils.log(`Preset "${select.value}" deleted`);
        } catch (e) {
          utils.log('Delete failed: ' + e.message, 'error');
        }
      }
    });
  };

  // Run-lock utilities to avoid cross-tab collisions
  const acquireRunLock = () => {
    try {
      const key = STORAGE_KEYS.runLockKey;
      const now = Date.now();
      const existing = localStorage.getItem(key);
      const selfId =
        state.runLockId || (state.runLockId = `${now}-${Math.random().toString(36).slice(2)}`);
      if (existing) {
        try {
          const obj = JSON.parse(existing);
          if (obj && obj.id && obj.ts && now - obj.ts < CONFIG.RUN_LOCK_TTL_MS) {
            return false; // another tab active
          }
        } catch {
          /* treat as stale */
        }
      }
      localStorage.setItem(key, JSON.stringify({ id: selfId, ts: now }));
      // heartbeat
      clearInterval(state.runLockTimer);
      state.runLockTimer = setInterval(() => {
        try {
          localStorage.setItem(key, JSON.stringify({ id: selfId, ts: Date.now() }));
        } catch (e) {
          /* ignore */
        }
      }, CONFIG.RUN_LOCK_RENEW_MS);
      window.addEventListener('beforeunload', releaseRunLock);
      return true;
    } catch {
      return true;
    }
  };
  const releaseRunLock = () => {
    try {
      clearInterval(state.runLockTimer);
      state.runLockTimer = null;
      const key = STORAGE_KEYS.runLockKey;
      const existing = localStorage.getItem(key);
      if (existing) {
        const obj = JSON.parse(existing);
        if (!obj || obj.id === state.runLockId) localStorage.removeItem(key);
      }
    } catch (e) {
      /* ignore */
    }
  };

  const runChainWithBatch = async () => {
    if (!state.chainDefinition) {
      try {
        state.chainDefinition = JSON.parse(
          document.getElementById('chain-json-input').value || '{}'
        );
      } catch {
        state.chainDefinition = null;
      }
    }
    if (!state.chainDefinition) {
      utils.log('No chain defined', 'warning');
      return;
    }

    if (!acquireRunLock()) {
      utils.log('Another tab is running automation - aborting to prevent collision', 'error');
      return;
    }

    state.isProcessing = true;
    updateStatus('processing');
    try {
      // Prefer runtime batch; if none, allow chain to provide sample items
      let items = Array.isArray(state.dynamicElements) ? state.dynamicElements : [];
      if (
        (!items || items.length === 0) &&
        (Array.isArray(state.chainDefinition?.dynamicElements) ||
          typeof state.chainDefinition?.dynamicElements === 'string')
      ) {
        items = state.chainDefinition.dynamicElements;
        // If dynamicElements is a string (JSON/function), attempt to parse/execute
        if (typeof items === 'string') {
          try {
            const parsed = await processors.parseDynamicElements(items);
            if (Array.isArray(parsed)) items = parsed;
          } catch {}
        }
      }
      // Fallback: if still empty but chain references {item}, seed with sample cities
      if (!items || items.length === 0) {
        const usesItem = Array.isArray(state.chainDefinition?.steps)
          ? state.chainDefinition.steps.some((s) =>
              ['url', 'template', 'bodyTemplate'].some(
                (k) => typeof s?.[k] === 'string' && s[k].includes('{item')
              )
            )
          : false;
        if (usesItem) {
          utils.log('No dynamic elements provided; using sample items for this chain.', 'warning');
          items = ['London', 'Tokyo', 'New York'];
        }
      }
      // Use live state.dynamicElements so runtime edits affect the remaining items.
      const stopBtn = document.getElementById('stop-batch-btn');
      if (stopBtn) stopBtn.style.display = 'inline-flex';
      const stopRunBtn = document.getElementById('stop-run-btn');
      if (stopRunBtn) stopRunBtn.style.display = 'inline-flex';
      const stopMini = document.getElementById('stop-mini-btn');
      if (stopMini) stopMini.style.display = 'inline-flex';
      state.cancelRequested = false;
      state.currentBatchIndex = 0;
      state.processedCount = 0;
      updateSubProgress(0, 0);

      // If there are no dynamic elements, allow a single run with null item
      const liveItems = Array.isArray(state.dynamicElements) ? state.dynamicElements : [];
      if (!liveItems || liveItems.length === 0) {
        // Single run with empty item
        refreshBatchProgress(0, 0);
        await processChain(state.chainDefinition, { item: null, index: 1, total: 1 });
      } else {
        let processed = 0;
        // Loop until we've processed all available items or cancel is requested
        while (true) {
          if (state.cancelRequested) {
            utils.log('Run canceled');
            break;
          }

          const itemsNow = Array.isArray(state.dynamicElements) ? state.dynamicElements : [];
          const totalNow = Math.max(0, itemsNow.length);

          // If no items remain, we're done
          if (totalNow === 0) {
            break;
          }

          // Update progress using processed count and dynamic total (processed + remaining)
          // Ensure currentBatchIndex reflects what we've processed so far for live updates
          state.currentBatchIndex = processed;
          state.processedCount = processed;
          refreshBatchProgress(processed, processed + totalNow);

          // Determine the next item to process
          let itemToProcess;
          if (state.autoRemoveProcessed) {
            // Always take the first item
            itemToProcess = itemsNow[0];
            if (typeof state.dynamicElements.shift === 'function') {
              // We'll remove after processing to avoid racing with input handlers
            }
          } else {
            // Use processed as index; if out of range, break (may happen if list shrank)
            if (processed >= itemsNow.length) break;
            itemToProcess = itemsNow[processed];
          }

          utils.log(`🔗 Chain run for item ${processed + 1}/${processed + totalNow}`);
          await processChain(state.chainDefinition, {
            item: itemToProcess,
            index: processed + 1,
            total: totalNow,
          });

          if (state.cancelRequested) {
            utils.log('Run canceled');
            break;
          }

          // After processing, update the runtime list according to auto-remove
          if (state.autoRemoveProcessed) {
            removeHeadItems(1);
            processed += 1;
            state.currentBatchIndex = processed;
            state.processedCount = processed;
          } else {
            processed += 1;
            state.processedCount = processed;
          }

          // Sync chain JSON so edits are reflected
          try {
            if (!state.chainDefinition)
              state.chainDefinition = JSON.parse(
                document.getElementById('chain-json-input').value || '{}'
              );
            state.chainDefinition.dynamicElements = state.dynamicElements;
            const chainInput = document.getElementById('chain-json-input');
            if (chainInput) chainInput.value = JSON.stringify(state.chainDefinition, null, 2);
          } catch {}

          // Update progress after completion of this item; denominator = processed + remaining
          const remainingNow = Array.isArray(state.dynamicElements)
            ? state.dynamicElements.length
            : 0;
          refreshBatchProgress(processed, processed + remainingNow);

          // Wait between items when there are still items left
          const remaining = Array.isArray(state.dynamicElements) ? state.dynamicElements.length : 0;
          if (remaining > 0) {
            utils.log(`⏱️ Waiting ${state.batchWaitTime}ms before next item…`);
            await utils.sleep(state.batchWaitTime);
            continue;
          }
          break;
        }
      }
      utils.log('🏁 Chain batch completed');
    } catch (e) {
      utils.log('Chain error: ' + e.message, 'error');
    } finally {
      releaseRunLock();
      state.isProcessing = false;
      updateStatus('idle');
      refreshBatchProgress(0, 0);
      updateSubProgress(0, 0);
      const stopBtn = document.getElementById('stop-batch-btn');
      if (stopBtn) stopBtn.style.display = 'none';
      const stopRunBtn = document.getElementById('stop-run-btn');
      if (stopRunBtn) stopRunBtn.style.display = 'none';
      const stopMini = document.getElementById('stop-mini-btn');
      if (stopMini) stopMini.style.display = 'none';
    }
  };

  const resolveEntryStep = (chain) => {
    if (!chain) return null;
    if (chain.entryId) return (chain.steps || []).find((s) => s.id === chain.entryId) || null;
    const steps = chain.steps || [];
    if (!steps.length) return null;
    const referenced = new Set(steps.map((s) => s.next).filter(Boolean));
    const first = steps.find((s) => !referenced.has(s.id));
    return first || steps[0];
  };

  // Helper: create a per-step context that exposes previous steps and chain data
  const createStepContext = (context) => ({
    ...context,
    item: context.item,
    index: context.index,
    total: context.total,
    steps: context.steps,
    chain: context.chain,
  });

  const handlePromptStep = async (step, stepContext, context) => {
    const msg = processors.processDynamicTemplate(step.template || '', stepContext);
    // Per-step new chat option
    if (step.newChat) {
      await startNewChat();
    }

    const expect = step.responseType === 'image' ? 'image' : 'text';
    if (expect === 'image') {
      const { el: respEl, images } = await chatGPT.askWith(msg, { expect: 'image' });
      const imgs = images || [];
      context.lastResponseText = imgs[0] || '';
      context.chain[step.id] = { images: imgs };
      context.steps[step.id] = { type: 'prompt', responseType: 'image', images: imgs };
      utils.log(`🖼️ Step ${step.id} returned ${imgs.length} image(s)`);
      utils.log(`💡 Access first image: {steps.${step.id}.images[0]}`);
    } else {
      const { el: respEl, text: resp } = await chatGPT.ask(msg);
      context.lastResponseText = resp;
      context.chain[step.id] = { response: resp };
      context.steps[step.id] = { type: 'prompt', response: resp, responseText: resp };
      utils.log(`📩 Step ${step.id} response (${resp.length} chars)`);
      utils.log(
        `💡 Access this data in next steps with: {steps.${step.id}.response} or {steps.${step.id}.responseText}`
      );
    }
  };

  const handleHttpStep = async (step, stepContext, context) => {
    const url = processors.processDynamicTemplate(step.url || '', stepContext);
    const method = (step.method || 'GET').toUpperCase();
    let headers = step.headers || {};
    try {
      if (typeof headers === 'string') headers = JSON.parse(headers);
    } catch {}
    const body = step.bodyTemplate
      ? processors.processDynamicTemplate(step.bodyTemplate, stepContext)
      : undefined;

    // Basic retry for transient failures
    let res;
    let attempt = 0;
    let lastErr = null;
    while (attempt < 3) {
      try {
        res = await http.request({ method, url, headers, data: body });
        break;
      } catch (e) {
        lastErr = e;
        attempt++;
        if (attempt < 3) {
          utils.log(`HTTP attempt ${attempt} failed (${e?.message || e}). Retrying...`, 'warning');
          await utils.sleep(500 * attempt);
        }
      }
    }
    if (!res) throw lastErr || new Error('Network error');
    const payload = res.responseText || res.response || '';
    let parsedData = payload;
    try {
      parsedData = JSON.parse(payload);
    } catch {}

    const httpData = {
      status: res.status,
      statusText: res.statusText || '',
      data: parsedData,
      rawText: payload,
      headers: res.responseHeaders || {},
      url,
      method,
    };

    context.chain[step.id] = { http: httpData };
    context.steps[step.id] = { type: 'http', ...httpData };
    utils.log(`🌐 HTTP ${method} ${url} → ${res.status}`);
    utils.log(
      `💡 Access this data with: {steps.${step.id}.data} or {steps.${step.id}.rawText} or {steps.${step.id}.status}`
    );
  };

  const handleJsStep = async (step, stepContext, context) => {
    const jsContext = {
      elementData: context.item,
      index: context.index,
      total: context.total,
      steps: context.steps,
      lastResponse: context.lastResponseText,
    };
    const ret = await processors.executeCustomCode(
      step.code || '',
      context.lastResponseText || '',
      jsContext
    );
    context.steps[step.id] = { type: 'js', executed: true, response: ret };
  };

  const handleTemplateStep = async (step, stepContext, context) => {
    let arr = [];
    try {
      // Allow templating inside elements definition
      const elemsSrc = processors.processDynamicTemplate(step.elements || '[]', stepContext);
      arr = await processors.parseDynamicElements(elemsSrc || '[]');
    } catch {
      arr = [];
    }

    // Optionally use chain-level dynamicElements for nested batching
    if (
      (!arr || arr.length === 0) &&
      step.useDynamicElements &&
      (Array.isArray(context.chain?.dynamicElements) ||
        typeof context.chain?.dynamicElements === 'string')
    ) {
      arr = context.chain.dynamicElements;
    }

    if (!Array.isArray(arr) || arr.length === 0) {
      utils.log('Template step has no elements; sending one prompt with current context');
      const msg = processors.processDynamicTemplate(step.template || '', stepContext);
      const { text: resp } = await chatGPT.ask(msg);
      context.lastResponseText = resp;
      context.chain[step.id] = { response: resp };
      context.steps[step.id] = {
        type: 'template',
        response: resp,
        responseText: resp,
        itemCount: 0,
      };
      utils.log(
        `💡 Access template data with: {steps.${step.id}.responses} or {steps.${step.id}.lastResponse}`
      );
      return;
    }

    utils.log(`🧩 Template step expanding ${arr.length} items`);
    updateSubProgress(0, arr.length);
    const responses = [];
    for (let i = 0; i < arr.length; i++) {
      updateSubProgress(i + 1, arr.length);
      if (state.cancelRequested) {
        utils.log('Run canceled');
        break;
      }
      const child = arr[i];
      const itemContext = { ...stepContext, item: child, index: i + 1, total: arr.length };
      const msg = processors.processDynamicTemplate(step.template || '', itemContext);
      utils.log(`📝 Template item ${i + 1}/${arr.length}: ${utils.clip(msg, 200)}`);
      if (step.newChat) {
        await startNewChat();
      }
      const expect = step.responseType === 'image' ? 'image' : 'text';
      if (expect === 'image') {
        const { images } = await chatGPT.askWith(msg, { expect: 'image' });
        responses.push({ item: child, images: images || [] });
        context.lastResponseText = (images && images[0]) || '';
      } else {
        const { text: resp } = await chatGPT.ask(msg);
        responses.push({ item: child, response: resp });
        context.lastResponseText = resp;
      }
      if (state.cancelRequested) {
        utils.log('Run canceled');
        break;
      }
      if (i < arr.length - 1) {
        utils.log(`⏱️ Waiting ${state.batchWaitTime}ms before next template item…`);
        await utils.sleep(state.batchWaitTime);
      }
    }

    context.chain[step.id] = { responses };
    context.steps[step.id] = {
      type: 'template',
      responses,
      itemCount: responses.length,
      lastResponse: responses[responses.length - 1]?.response || '',
    };
    updateSubProgress(0, 0);
    utils.log(
      `💡 Access template data with: {steps.${step.id}.responses} or {steps.${step.id}.lastResponse}`
    );
  };

  const processChain = async (chain, baseContext) => {
    const entry = resolveEntryStep(chain);
    if (!entry) throw new Error('Empty chain');
    let step = entry;
    let context = {
      ...baseContext,
      lastResponseText: '',
      chain: { dynamicElements: chain.dynamicElements || [] },
      steps: {},
    };
    const perStepWait = parseInt(document.getElementById('step-wait-input')?.value || '0') || 0;

    while (step) {
      utils.log(`➡️ Step ${step.id} (${step.type})`);
      const stepContext = createStepContext(context);

      try {
        if (step.type === 'prompt') await handlePromptStep(step, stepContext, context);
        else if (step.type === 'http') await handleHttpStep(step, stepContext, context);
        else if (step.type === 'js') await handleJsStep(step, stepContext, context);
        else if (step.type === 'template') await handleTemplateStep(step, stepContext, context);
        else utils.log(`Unknown step type: ${step.type}`, 'warning');
      } catch (err) {
        const msg = err?.message || String(err || 'Unknown error');
        utils.log(`Step ${step.id} error: ${msg}`, 'error');
        throw new Error(msg);
      }

      step = step.next ? (chain.steps || []).find((s) => s.id === step.next) : null;
      if (step && perStepWait > 0) {
        utils.log(`⏱️ Waiting ${perStepWait}ms before next step…`);
        await utils.sleep(perStepWait);
      }
    }
  };

  // Initialize the script
  const init = () => {
    if (document.getElementById('chatgpt-automation-ui')) {
      return; // Already initialized
    }

    utils.detectUserLanguage();
    utils.log('Initializing ChatGPT Automation Pro...');

    // Wait for page to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createUI);
    } else {
      createUI();
    }
  };

  // Auto-start
  init();
})();