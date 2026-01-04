// ==UserScript==
// @name       Bypass All Shortlinks By YacineTv
// @name:id    Bypass Semua Shortlink
// @name:ug    Bypass بارلىق قىسقا ئۇلىنىشلار
// @name:ar    تجاوز الجميع الروابط المختصرة
// @name:ja    バイパス 全て ショートリンク
// @name:he    לַעֲקוֹף את כל קישורים קצרים
// @name:hi    सभी शॉर्टलिंक को बायपास करें
// @name:ko    모든 짧은 링크 우회
// @name:th    บายพาส ทั้งหมด ลิงค์สั้น
// @name:nb    Omgå Alle Kortlenker
// @name:sv    Förbigå alla kortlänkar
// @name:sr    Zaobići Sve Kratke veze
// @name:sk    Obísť Všetky Krátke odkazy
// @name:hu    Bypass Összes Rövid linkek
// @name:ro    Bypass Toate Linkuri scurte
// @name:fi    Ohittaa Kaikki Lyhyet linkit
// @name:el    Παράκαμψη Ολα Σύντομοι σύνδεσμοι
// @name:eo    Pretervojo Ĉiuj Mallongaj ligiloj
// @name:it    Bypassare Tutto Collegamenti brevi
// @name:bg    Заобикаляне на всички кратки връзки
// @name:es    Saltarse Todos los Enlaces Acortados
// @name:cs    Obcházeč všech zkracovačů odkazů
// @name:vi    Bỏ qua Tất cả Các liên kết ngắn
// @name:pl    Bypass Wszystkie Krótkie linki
// @name:uk    Обхід всі Короткі посилання
// @name:ru    Обход Все Короткие ссылки
// @name:tr    Bypass Tüm Kısa Linkler
// @name:fr    Bypass Tout Lien courts
// @name:nl    Bypass Alle Korte links
// @name:da    Bypass Alle Shortlinks
// @name:de    Bypass Alle Kurzlinks
// @name:zh-CN 旁路 全部 短链接
// @name:zh-TW 旁路 全部 短鏈接
// @name:pt-BR Bypass Todos Links curtos
// @name:fr-CA Bypass Tout Lien courts
// @namespace  Violentmonkey Scripts
// @run-at     document-start
// @author     YacineTvPc
// @version        15
// @match          *://*/*
// @antifeature    tracking
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_addStyle
// @connect        nocaptchaai.com
// @grant          GM_xmlhttpRequest
// @grant          window.onurlchange
// @grant          GM_registerMenuCommand
// @icon           https://i.ibb.co/qgr0H1n/BASS-Blogger-Pemula.png
// @require        https://update.greasyfork.org/scripts/439099/1203718/MonkeyConfig%20Modern%20Reloaded.js
// @description    Bypass All Shortlinks Sites Automatically Skips Annoying Link Shorteners , Skip AdFly and No Annoying Ads, Directly to Your Destination, and now Support Auto Downloading Your Files
// @description:id Bypass Semua Situs Shortlink Secara Otomatis Langsung ke Tujuan Tanpa Iklan yang Mengganggu , Support Auto Download File
// @description:ug بارلىق قىسقا ئۇلىنىش تور بېكەتلىرىنى ئايلىنىپ ئۆتۈپ ، كىشىنى بىزار قىلىدىغان ئۇلىنىش قىسقارتقۇچنى ئاپتوماتىك ھالدا مەنزىلىڭىزگە ئاتلاڭ.
// @description:ar تجاوز جميع مواقع الروابط المختصرة يتخطى تلقائيًا أدوات تقصير الروابط المزعجة ، مباشرة إلى وجهتك
// @description:he עוקף את כל אתרי הקישורים הקצרים מדלג אוטומטית על מקצרי קישורים מעצבנים, ישירות ליעד שלך
// @description:hi सभी शॉर्टलिंक साइटों को बायपास करें, सीधे आपके गंतव्य पर कष्टप्रद लिंक शॉर्टनर को छोड़ दें
// @description:ja すべてのショートリンクサイトをバイパスすると、迷惑なリンクショートナーが自動的にスキップされ、宛先に直接送信されます
// @description:fr Contourner tous les sites de liens courts saute automatiquement les raccourcisseurs de liens gênants, directement vers votre destination
// @description:ko 모든 짧은 링크 사이트 우회는 성가신 링크 단축기를 자동으로 건너뛰고 목적지로 직접 이동합니다.
// @description:th ข้ามไซต์ลิงค์สั้นทั้งหมดข้ามลิงค์ย่อที่น่ารำคาญโดยอัตโนมัติไปยังปลายทางของคุณ
// @description:zh-cn 绕过所有短链接网站自动跳过烦人的链接缩短器，直接到您的目的地
// @description:zh-tw 繞過所有短鏈接網站自動跳過煩人的鏈接縮短器，直接到您的目的地
// @description:eo Preterpasi Ĉiuj Mallongaj Ligiloj-Ejoj Aŭtomate Saltas ĝenajn Ligilojn, Rekte al Via Celo
// @description:de Alle Short-Links-Sites umgehen Überspringt automatisch lästige Link-Shortener direkt zu Ihrem Ziel
// @description:tr Tüm Kısa Linkleri Atla Siteler Can sıkıcı Link Kısaltıcıları Otomatik Olarak Atlar, Doğrudan Hedefinize
// @description:da Omgå alle korte links-websteder springer automatisk irriterende linkforkortere over, direkte til din destination
// @description:bg Заобикаляне на всички сайтове с кратки връзки Автоматично пропуска досадните средства за съкращаване на връзки, директно до вашата дестинация
// @description:ro Omite toate site-urile cu linkuri scurte Omite automat elementele de scurtare a linkurilor enervante, direct către destinația ta
// @description:fi Ohita kaikki lyhytlinkkisivustot ohittaa automaattisesti ärsyttävät linkinlyhennykset suoraan määränpäähäsi
// @description:it Ignora tutti i siti di collegamenti brevi Salta automaticamente i fastidiosi accorciatori di collegamenti, direttamente alla tua destinazione
// @description:el Παράκαμψη όλων των τοποθεσιών σύντομων συνδέσμων Παρακάμπτει αυτόματα τα ενοχλητικά προγράμματα συντόμευσης συνδέσμων, απευθείας στον προορισμό σας
// @description:es Saltarse Automáticamente todos los enlaces acortados, AdFly y omitir anuncios, ir directamente al destino, ahora se agregó descarga automática de archivos
// @description:hu Az összes rövid hivatkozási webhely megkerülése automatikusan átugorja a bosszantó linkrövidítőket, közvetlenül az úticélra
// @description:nb Omgå alle korte lenker Nettsteder hopper automatisk over irriterende lenkeforkortere, direkte til destinasjonen din
// @description:sk Obíďte všetky stránky s krátkymi odkazmi, ktoré automaticky preskočia otravné skracovače odkazov priamo do vášho cieľa
// @description:sv Förbi alla korta länkar webbplatser hoppar automatiskt över irriterande länkförkortare, direkt till din destination
// @description:sr Zaobići sve stranice s kratkim vezama automatski preskače dosadne skraćivače veza, izravno na vaše odredište
// @description:pl Pomijaj wszystkie strony z krótkimi linkami automatycznie pomija irytujące skracacze linków, bezpośrednio do miejsca docelowego
// @description:nl Omzeil alle sites met korte links en slaat automatisch vervelende linkverkorters over, rechtstreeks naar uw bestemming
// @description:cs Automaticky přeskočí všechny otravné zkracovače odkazů, včetně AdFly bez otravných reklam přímo do vašeho cíle
// @description:uk Обійти всі сайти з короткими посиланнями. Автоматично пропускає дратівливі скорочення посилань безпосередньо до вашого пункту призначення
// @description:ru Обход всех сайтов с короткими ссылками автоматически пропускает надоедливые сокращатели ссылок, прямо к месту назначения
// @description:vi Bỏ qua tất cả các trang web liên kết ngắn tự động bỏ qua các trang web liên kết gây phiền nhiễu, trực tiếp đến đích của bạn
// @description:pt-br Ignora automaticamente encurtadores de links irritantes, diretamente para o link final
// @description:fr-ca Contourner tous les sites de liens courts saute automatiquement les raccourcisseurs de liens gênants, directement vers votre destination
// @exclude /^(https?:\/\/)(.+)?((advertisingexcel|talkforfitness|rsadnetworkinfo|rsinsuranceinfo|rsfinanceinfo|rssoftwareinfo|rshostinginfo|rseducationinfo|gametechreviewer|vegan4k|phineypet|batmanfactor|techedifier|urlhives|linkhives|github|freeoseocheck|greenenez|aliyun|reddit|bing|yahoo|wiki-topia|edonmanor|vrtier|whatsapp|gearsadviser|edonmanor|tunebug|menrealitycalc|amazon|ebay|payoneer|paypal|skrill|stripe|tipalti|wise|discord|tokopedia|taobao|taboola|aliexpress|netflix|citigroup|spotify|bankofamerica|hsbc|accounts.youtube|(cloud|mail|translate|analytics|accounts|myaccount|contacts|clients6|developers|payments|pay|ogs|safety|wallet).google|(login|signup|account|officeapps|api|mail|hotmail).live|basketballsavvy|healthyfollicles|hauntingrealm|pluginmixer|boredboard|boardgamechick|healthyfollicles).com|(thumb8|thumb9|crewbase|crewus|shinchu|shinbhu|ultraten|uniqueten|topcryptoz|allcryptoz|coinsvalue|cookinguide|cryptowidgets|webfreetools|carstopia|makeupguide|carsmania|nflximg|doubleclick|luckydice).net|(linksfly|shortsfly|urlsfly|wefly|blog24).me|(greasyfork|openuserjs|adarima|telegram|wikipedia).org|mcrypto.club|misterio.ro|insurancegold.in|coinscap.info|chefknives.expert|(shopee|lazada|rakuten|maybank|binance).*|(dana|ovo|bca.co|bri.co|bni.co|bankmandiri.co|desa|(.*).go).id|(.*).(edu|gov))(\/.*)/
// @downloadURL https://update.greasyfork.org/scripts/449931/Bypass%20All%20Shortlinks%20By%20YacineTv.user.js
// @updateURL https://update.greasyfork.org/scripts/449931/Bypass%20All%20Shortlinks%20By%20YacineTv.meta.js
// ==/UserScript==
// ================================================================================================================================================================
//                                          PLEASE READ SCRIPT INFO BEFORE USE
//                                      PLEASE RESPECT IF MY SCRIPTS USEFUL FOR YOU
//                      DON'T TRY TO COPY PASTE MY SCRIPTS THEN SHARE TO OTHERS LIKE YOU ARE THE CREATOR
//                 PLEASE DON'T REMOVE OR CHANGE MY BLOG, DISABLE YOUR ADBLOCK IN MY BLOG , THANKS FOR YOUR SUPPORT
//              My Blog is Very Important to give some Delay for safe away ,Track New Shortlinks , Broken Bypass etc...
// Thanks so much to @JustOlaf , @Konf , @hacker09 , @juansi , @NotYou , @cunaqr And @Rust1667 for Helping me , make my script even better
//                        Thanks so much to @varram for providing a Great Bypass Site bypass.city and adbypass.org
//                                And also Thank you to everyone who has Contributed with Good Feedback.
// =================================================================================================================================================================
// Change Your Delay in the settings options from 5 to 10 or 20 if you have issues like Your action marked Suspicious,Don't try to bypass ,Don't use Speedster, etc
// Debloated Script from Amm0ni4 Just Make Broken My Script and Made Me Lazy to Update, His Debloated Not Working Correctly and He Don't Know how to Fix it
   const window = unsafeWindow; // Some of My Codes Not Running Well Without this , Please Let Me Know if You Find any Bugs
   const cfg = new MonkeyConfig({title: 'Bypass Version 92.2 Settings :', menuCommand: true,
   params: {Announcements : {type: 'text', default: 'Add Your ApiKey from nocaptchaai to use Auto Solve Hcaptcha', long: 3},
    ApiKey: {label: "noCaptcha Ai KEY", type: "text", default: "",},
    SetDelay: {label: "Redirect Delay ", type: "number", default: 5,},
    BlogDelay: {label: "Use My Blogs For Delays", type: "checkbox", default: true,},
    reCAPTCHA: {label: "Auto Open/Solve Recaptcha", type: "checkbox", default: false,}, // Auto Solve Recaptcha Not Yet Ready
    hCaptcha: {label: "Auto Open/Solve Hcaptcha", type: "checkbox", default: false, },
    YTShort: {label: "Disable Youtube Short", type: "checkbox", default: false,},
    RightFC: {label: "Enable Context Menu ", type: "checkbox", default: false,},
    BlockFC: {label: "Enable Always Ready", type: "checkbox", default: false,},
    TimerFC: {label: "Enable Fast Timer ", type: "checkbox", default: false,},
    AutoDL: {label: "Auto Download For Supported Sites", type: "checkbox", default: false,},},});
(function(){function BoostTimers() {const FsT = window.setTimeout; const FsI = window.setInterval;
  Object.defineProperty(window, 'setTimeout', {value: function(func, delay) {if (delay === 1000) {delay = 50;} return FsT.apply(this, arguments);}});
  Object.defineProperty(window, 'setInterval', {value: function(func, delay) {if (delay === 1000) {delay = 50;} return FsI.apply(this, arguments);}});}
  if (cfg.get('TimerFC') == true) {BoostTimers();} else {}})();
(function() { // Please Remember , My Scripts Works Better Using Firefox Browser and Violentmonkey Extension
'use strict';
  const APIKEY = cfg.get('ApiKey'); const bp = query => document.querySelector(query);const BpAll = query => document.querySelectorAll(query);
  const BpParams = new URLSearchParams(location.search);const BpParamd = new URLSearchParams(document.location.search);const RexBp = new RegExp(/^\?([^&]+)/);
  const BpT = query => document.getElementsByTagName(query);const elementExists = query => bp(query) !== null;const domainCheck = domains => new RegExp(domains).test(location.host);
  function BpBlock() {return 1;}
  function sleep(ms) {return new Promise((resolve) => setTimeout(resolve, ms));}
  function waitForElm(query, callback) {setTimeout(function() {
    if (elementExists(query)) {callback(bp(query));} else {waitForElm(query, callback);}}, 1000);}
  function ClickIfExists(query, timeInSec = 1, funcName = 'setTimeout') {
    if (elementExists(query)) {window[funcName](function() {bp(query).click();}, timeInSec * 1000);}}
  function SubmitIfExists(query, timeInSec = 1, funcName = 'setTimeout') {
    if (elementExists(query)) {window[funcName](function() {bp(query).submit();}, timeInSec * 1000);}}
  function Checkvisibility(elem) {if (!elem.offsetHeight && !elem.offsetWidth) {return false;}
    if (getComputedStyle(elem).visibility === 'hidden') {return false;} return true;}
  function XPathBp(b,p) {p = document; return p.evaluate(b,p,null,9,null).singleNodeValue;}
  function RemoveRef(value) {delete document.referrer; document.__defineGetter__('referrer', () => value);}
  function meta(href) {document.head.appendChild(Object.assign(document.createElement('meta'), {name: 'referrer',content: 'origin'}));
    Object.assign(document.createElement('a'), {href}).click();}
  function RemoveBp(domain, selector) {const re_domain = new RegExp(domain); if (!re_domain.test(location.host)) return;
    const elements = BpAll(selector);for (const element of elements) {element.remove();}}
  function redirect(url, blog = true) {location = blog && cfg.get('BlogDelay') ? '' + url : url;}
  function BpCalc(sbp) {return (sbp.replace(/\s/g, '').match(/[+\-]?([0-9\.]+)/g) || []).reduce(function(sum, value) {return parseFloat(sum) + parseFloat(value);});}
  function BlockRead(SearchString, nameFunc) {var target = window[nameFunc]; window[nameFunc] = function(...args) {const stringFunc = String(args);
    if ((new RegExp(SearchString)).test(stringFunc)) args[0] = function() {}; return target.call(this, ...args);};}
  function DecodeBase64(string, times) {let StringDecoded = string;for (let i = 0; i < times; i++) {StringDecoded = atob(StringDecoded);}return StringDecoded;}
  function SubmitBp(selector, time = 1) {let elem = (typeof selector === 'string') ? bp(selector).closest('form') : selector; console.log(elem); setTimeout(() => {elem.submit();}, time * 1000);}
  function ReadCV(cname) {let name = cname + "=";let decodCV = decodeURIComponent(document.cookie);
    let cv = decodCV.split(';');for (var i = 0; i < cv.length; i++) {let c = cv[i]; while (c.charAt(0) == ' ') {c = c.substring(1);}
      if (c.indexOf(name) == 0) {return c.substring(name.length, c.length);}} return "";}
  function elementReady(selector) {return new Promise(function(resolve, reject) {let element = bp(selector);
      if (element) {resolve(element); return;} new MutationObserver(function(_, observer) {element = bp(selector);
      if (element) {resolve(element); observer.disconnect();}}).observe(document.documentElement, {childList: true, subtree: true});});}
  function SetCookie(name, value, days) {if (days) {var date = new Date(); date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    let expires = "; expires=" + date.toGMTString();} else {var expires = ""; document.cookie = name + "=" + value + expires + "; path=/";}}
  function DelCookie(name) {SetCookie(name, "", -1);}
  function ReadytoClick(selector, sleepTime = 0) {const events = ["mouseover", "mousedown", "mouseup", "click"];const selectors = selector.split(', ');
    if (selectors.length > 1) {return selectors.forEach(ReadytoClick);}if (sleepTime > 0) {return sleep(sleepTime * 1000).then(function() {ReadytoClick(selector, 0);});}
    elementReady(selector).then(function(element) {element.removeAttribute('disabled');element.removeAttribute('target');
        events.forEach(eventName => {const eventObject = new MouseEvent(eventName, {bubbles: true}); element.dispatchEvent(eventObject);});});}
  function Decrypter(string) {const shift = 13;let decipheredString = ''; for (let i = 0; i < string.length; i++) {let charCode = string.charCodeAt(i);
    if (charCode >= 97 && charCode <= 122) {decipheredString += String.fromCharCode(((charCode - 97 - shift + 26) % 26) + 97);}
    else if (charCode >= 65 && charCode <= 90) {decipheredString += String.fromCharCode(((charCode - 65 - shift + 26) % 26) + 65);}else {decipheredString += string[i];}}return decipheredString;}
  function Decrypter2(string, Length = 5) {var decrypteds = '',base64 = atob(string),subs = base64.substring(0, Length),encrypted = base64.substring(Length);
    for (let i = 0; i < encrypted.length; i++) {let charCode = encrypted.charCodeAt(i),charCodeKey = subs.charCodeAt(i % subs.length),decrypted = charCode ^ charCodeKey;decrypteds += String.fromCharCode(decrypted);} return decrypteds;}
  function NoFocus() {window.mouseleave = true; window.onmouseover = true; document.hasFocus = function() {return true;}; Object.defineProperty(document, 'webkitVisibilityState', {get() {return 'visible';}});
    Object.defineProperty(document, 'visibilityState', {get() {return 'visible';}}); window.addEventListener('visibilitychange', function(e) {e.stopImmediatePropagation();}, true, true);
    window.addEventListener('focus', onfocus, true);document.addEventListener('visibilitychange', function(e) {e.stopImmediatePropagation();}, true, true); Object.defineProperty(document, 'hidden', {get() {return false;}});}
  function strBetween(s, front, back, trim = false) {if (trim) {s = s.replaceAll(' ', '');s = s.trim();s = s.replaceAll('\n', ' ');}
      return s.slice(s.indexOf(front) + front.length, s.indexOf(back, s.indexOf(front) + front.length));}
  function BypassedByYacineTvPc(re_domain, data, blog) {if (!re_domain.test(location.host)) return;
    if (typeof data === 'function') return data();if (Array.isArray(data)) data = { '/': data }; if (!(location.pathname in data)) return;const [key, value] = data[location.pathname];
    if (typeof key === 'object' && key.test(location.search)) return redirect(value + RegExp.$1, blog); if (BpParams.has(key)) redirect(value + BpParams.get(key), blog);}
  function YacineTvPc(domains, data, url = '', blog = false, all = false) {if (!domainCheck(domains)) return;
    if (typeof data === 'string' && data.split(',').every(p => BpParams.has(p))) {const use = data.split(',').at(0);
    const def = all ? BpParams.getAll(use).find(u => new RegExp(domains).test(u)) : BpParams.get(use);
    redirect(url + def, blog);} else if (typeof data === 'object') {const o = data[location.pathname]; if (!o) return;YacineTvPc(domains, ...o);}}
  function BypassHD(selector, time) {if (elementExists('.g-recaptcha')) {let gc = setInterval(() => {if (window.grecaptcha.getResponse().length !== 0) {
    clearInterval(gc); SubmitBp('.g-recaptcha', 1);}}, 1000);} else if (elementExists('.h-captcha')) {let hc = setInterval(() => {if (window.hcaptcha.getResponse().length !== 0) {
    clearInterval(hc); SubmitBp('.h-captcha', 1);}}, 1000);} else if (elementExists('.cf-turnstile')) {let tc = setInterval(() => {if (window.turnstile.getResponse().length !== 0) {
    clearInterval(tc); SubmitBp('.cf-turnstile', 1);}}, 1000);} else if (elementExists('input[name=_iconcaptcha-token]')) {Captchacheck(selector);} else {SubmitBp(selector, time);}}
  function GetForm(FormName) {var forms = document.forms; for (var i = 0; i < forms.length; i++) {if (FormName === 'mdn') {var form = forms[i].innerHTML;
      if (form.includes('Step')) {return forms[i];}} else if (FormName === 'Allin1') {var bait = forms[i].action; if (/bypass.html|adblock.html/.test(bait)) continue; return forms[i];} else {return;}}}
  function Captchacheck(selector) {if (elementExists('.h-captcha') || elementExists('#captcha-hcaptcha')) {return window.hcaptcha.getResponse().length !== 0;
    } else if (elementExists('.cf-turnstile') || elementExists('#captcha-turnstile')) {return window.turnstile.getResponse().length !== 0;
    } else if (elementExists('.g-recaptcha') || elementExists('#captchaShortlink') || elementExists('#captcha_container') || elementExists('#captchaShortlinker') || elementExists('#captcha-recaptcha')) {return window.grecaptcha.getResponse().length !== 0;
    } else if (elementExists('#iconcaptcha')) {let b = setInterval(() => {let p = bp('.iconcaptcha-holder.iconcaptcha-theme-light.iconcaptcha-success'); if (p) {clearInterval(b); SubmitBp(selector, 1);}}, 1000);} else {return;}}
  function notify(txt, duration = cfg.get('SetDelay')) {const m = document.createElement('div'); m.style.padding = '1px'; m.style.zIndex = 99999999; m.style.position = 'fixed';
    m.style.width = `970px`; m.style.top = '275px'; m.style.left = `${innerWidth / 2 - 485}px`; m.style.font = 'normal bold 17px sans-serif'; m.style.backgroundColor = 'gold'; m.style.boxSizing = 'border-box';
    m.innerText = txt.replace('@', duration); document.documentElement.appendChild(m); const timerId = setInterval(() => {duration -= 1; if (duration <= 0) {clearInterval(timerId);} else {m.innerText = txt.replace('@', duration);}}, 1000);}
  function Listener(callback) {const originalOpen = XMLHttpRequest.prototype.open; XMLHttpRequest.prototype.open = function(method, url) {this.addEventListener("load", function() { this.method = method;this.url = url;callback(this);}); originalOpen.apply(this, arguments);};}
  function Request(url, options = {}) {return new Promise(function(resolve, reject) {GM_xmlhttpRequest({ method: options.method ?? "GET", url, responseType: options.responseType ?? "json", headers: options.headers, data: options.data, onload: function(response) {resolve(response.response);}});});}
  function EnableRCF() {[].forEach.call(['contextmenu', 'visibilitychange', 'cut', 'paste', 'blur', 'mouseleave', 'keyup', 'drag', 'dragstart', 'hasFocus', 'focus', 'select', 'selectstart', 'webkitvisibilitychange', 'mozvisibilitychange'], function(event) {document.addEventListener(event, function(e) {e.stopPropagation();}, true);});}

  YacineTvPc('gocmod.com', 'urls', '');
  YacineTvPc('clink1.com', 'url,id', '');
  YacineTvPc('writedroid.in', 'token', '');
  YacineTvPc('web1s.com', 'token,url', '');
  YacineTvPc('modmania.eu.org', 'token', '');
  BlockRead('(4d-bl0ck3r|ad-blocker)', 'setTimeout');
  YacineTvPc('msmedia.in', 'id', 'https://srink.in/');
  YacineTvPc('yalifin.xyz', 'opp', 'https://cut.lc/');
  YacineTvPc('sahityt.com', 'token', 'https://vzu.us/');
  YacineTvPc('blitly.io|smartlink.vip', 'url,apikey', '');
  YacineTvPc('wpking.in', 'go', 'https://o.linkpio.com/');
  YacineTvPc('eda-ah.com', 'get1', 'https://liinkat.com/');
  YacineTvPc('m.newhit.me', 'link', 'https://link3s.net/');
  YacineTvPc('abhikr.in', 'post', 'https://linkvibe.xyz/');
  YacineTvPc('zoztm.com', 'link', 'https://shorterx.com/');
  YacineTvPc('go.qora.in', 'link', 'https://link.qora.in/');
  YacineTvPc('10short.vip', 'Short', 'https://10short.com/');
  YacineTvPc('finoxpert.com', 'link', 'https://lksfy.site/');
  YacineTvPc('rsrlink.in', 'link', 'https://go.rsrlink.in/');
  YacineTvPc('dailynew.online', 'go', 'https://sklinks.in/');
  YacineTvPc('strfree.xyz', 'go', 'https://yo.adlinku.com/');
  YacineTvPc('jazbaat.in', 'link', 'https://go.rplinks.in/');
  YacineTvPc('urotan.net', 'link', 'https://shortyget.com/');
  YacineTvPc('mrdoge.in', 'link', 'https://link.cash4.link/');
  YacineTvPc('autodime.com', 'go', 'https://go.linkrex.net/');
  YacineTvPc('quick91.com', 'grey', 'https://go.linkco.pro/');
  YacineTvPc('airlike.me', 'link', 'https://get.airlike.me/');
  YacineTvPc('techhadi.com', 'news', 'https://go.tplinks.in/');
  YacineTvPc('zubatecno.com', 'link', 'https://go.flyzu.icu/');
  YacineTvPc('veganab.co', 'link', 'https://techy.veganab.co/');
  YacineTvPc('yosite.net', 'link', 'https://loans.yosite.net/');
  YacineTvPc('battlechamp.in', 'link', 'https://get.exurl.in/');
  YacineTvPc('adiskblog.in', 'link', 'https://go.pdiskpro.in/');
  YacineTvPc('cryptednews.space', 'post', 'https://slfly.net/');
  YacineTvPc('hiharshit.in', 'post', 'https://easytoclick.in/');
  YacineTvPc('indiansarkari.com', 'go', 'https://icashfly.com/');
  YacineTvPc('tanytech.com', 'link', 'https://go.hexlinks.xyz/');
  YacineTvPc('healthynepal.in', 'post', 'https://ez4short.xyz/');
  YacineTvPc('gktech.uk', 'adlinkfly', 'https://linkyearn.com/');
  YacineTvPc('vslinks.online', 'link', 'https://ad.vslinks.in/');
  YacineTvPc('factsdunya.com', 'go', 'https://driveupload.net/');
  YacineTvPc('1apple.xyz', 'link', 'https://link.turkdown.com/');
  YacineTvPc('missreview.info', 'link', 'https://g.linkvor.pw/');
  YacineTvPc('recipejaano.com', 'link', 'https://ads.kbfly.in/');
  YacineTvPc('dilmibriva.store', 'post', 'https://cutplus.xyz/');
  YacineTvPc('10short.pro', 'get', 'https://10short.vip/?Short=');
  YacineTvPc('videolyrics.in', 'p', 'https://ser3.crazyblog.in/');
  YacineTvPc('blog.topfaucet.us', 'token', 'https://sl1.x10.mx/');
  YacineTvPc('housezquick.com', 'link', 'https://ad.ushort.xyz/');
  YacineTvPc('flashlinks.online', 'dk', 'https://flashlinks.in/');
  YacineTvPc('siteblog.in', 'link', 'https://go.droplink.co.in/');
  YacineTvPc('trendtrove.vip', 'post', 'https://tinylinker.pro/');
  YacineTvPc('shortsnob.in', 'token', 'https://short.earnmoj.in/');
  YacineTvPc('apna-blog.in', 'token', 'https://apnashortener.in/');
  YacineTvPc('ignitesmm.com', 'link', 'https://f.omnifly.in.net/');
  YacineTvPc('fileku.net', 'adlinkfly', 'https://get.fileku.net/');
  YacineTvPc('nisnisin.com', 'link', 'https://link.ezlinkad.com/');
  YacineTvPc('sapnogalpo.online', 'link', 'https://link2cash.in/');
  YacineTvPc('candleoflife.fun', 'token', 'https://shortsurl.pro/');
  YacineTvPc('povathemes.com|escobarvip.cf|golinki.com', 'url', '');
  YacineTvPc('upload.veganab.co', 'go', 'https://driveupload.net/');
  YacineTvPc('anonbar.com', 'link', 'https://go.moviepagol.my.id/');
  YacineTvPc('tamilhit.tech', 'link', 'https://get.tamilhit.tech/');
  YacineTvPc('suntechu.in', 'post', 'https://web.urllinkshort.in/');
  YacineTvPc('loan.techyinfo.in', 'open', 'https://go.linkpays.in/');
  YacineTvPc('cryptokaro.co.in', 'adlinkfly', 'https://tarabox.in/');
  YacineTvPc('foxbugg.com', 'adlinkfly', 'https://ads.foxbugg.com/');
  YacineTvPc('tremamnon.com', 'adlinkfly', 'https://dash-free.com/');
  YacineTvPc('market.finclub.in', 'link', 'https://go.tnshort.net/');
  YacineTvPc('bantenexis.com', 'link', 'https://link.youshort.net/');
  YacineTvPc('techkeshri.com', 'link', 'https://go.paisakamalo.in/');
  YacineTvPc('indirasari.com', 'link', 'https://link.paid4link.com/');
  YacineTvPc('wikitraveltips.com', 'link', 'https://adrinolinks.in/');
  YacineTvPc('smallinfo.in', 'link', 'https://filmypoints.in/?link=');
  YacineTvPc('pglink.online', 'adlinkfly', 'https://link.pglink.in/');
  YacineTvPc('mvplaylink.in.net', 'post', 'https://mplaylink.com/s/');
  YacineTvPc('ww1.linktrims.com', 'link', 'https://go.linktrims.com/');
  YacineTvPc('healthynepal.in', 'link', 'https://go.tgshortener.com/');
  YacineTvPc('missionhight.in', 'link', 'https://playdisk.url2go.in/');
  YacineTvPc('tech.techwhom.com', 'jeton', 'https://we.techwhom.com/');
  YacineTvPc('encurtaclik.com', 'link', 'https://go.encurtaclik.com/');
  YacineTvPc('appkamods.com', 'link', 'https://go.shorturllinks.com/');
  YacineTvPc('cybertechng.com', 'link', 'https://go.cybertechng.com/');
  YacineTvPc('conghuongtu.net', 'adlinkfly', 'https://bitlinks.site/');
  YacineTvPc('loan.filmypoints.in', 'link', 'https://link.e2share.in/');
  YacineTvPc('niinga.com', 'get', 'https://eigsense.eda-ah.com/?get1=');
  YacineTvPc('cinemapettai.in', 'post', 'https://getlink.sxslink.com/');
  BlockRead('(/adblock|/ad-now.php|/bypass|/detected.html)', 'setInterval');
  YacineTvPc('market.gorating.in', 'link', 'https://go.onepagelink.in/');
  YacineTvPc('blog.anywho-com.com', 'go', 'https://blog.shrinkme.link/');
  YacineTvPc('videoslyrics.com', 'postid', 'https://ser3.crazyblog.in/');
  YacineTvPc('earn.tensailab.com', 'adlinkfly', 'https://go.snaply.in/');
  YacineTvPc('postazap.com', 'link', 'https://encurtador.postazap.com/');
  YacineTvPc('mamahawa.com', 'get', 'https://forextrader.site/SkipLink/');
  YacineTvPc('prakasheditingtamizhan.com', 'link', 'https://kpslink.in/');
  YacineTvPc('mmdrive.xyz', 'link', 'https://techleets.xyz/no.php?link=');
  YacineTvPc('reminimod.co', 'land', 'https://insurance.techymedies.com/');
  YacineTvPc('keralalotteryresult.co', 'adlinkfly', 'https://skdlink.in/');
  YacineTvPc('tech.filmypoints.in', 'go', 'https://finance.smallinfo.in/');
  YacineTvPc('dpbossreal.com', 'adlinkfly', 'https://short.adslinko.com/');
  YacineTvPc('tbhlabsnews.com', 'link', 'https://getlink.tbhlabsnews.com/');
  YacineTvPc('interestingfactsare.com', 'link', 'https://m.urlbharat.xyz/');
  YacineTvPc('dealprice.co', 'adlinkfly', 'https://cryptorotator.website/');
  YacineTvPc('djnonstopmusic.in', 'link', 'https://gadgets.ishortify.com/');
  YacineTvPc('tech.filohappy.in', 'link', 'https://happyfiles.dtglinks.in/');
  YacineTvPc('vietnamtravelguide.top', 'post', 'https://bestshortlink.top/');
  YacineTvPc('earn.hostadviser.net', 'token', 'https://go.hostadviser.net/');
  YacineTvPc('viralsinfo.com', 'token', 'https://getslinks.online/download/');
  YacineTvPc('insuranceinfos.in', 'post', 'https://tech.smallinfo.in/Gadget/');
  YacineTvPc('www.filmypoints.in', 'post', 'https://tech.filmypoints.in/?go=');
  YacineTvPc('cafe.warrenrahul.in', 'adlinkfly', 'https://go.warrenrahul.in/');
  YacineTvPc('health.techyinfo.in', 'web', 'https://loan.techyinfo.in/?open=');
  YacineTvPc('truevpnlover.com', 'grey', 'https://quick91.com/insure.php?grey=');
  YacineTvPc('battleroyal.online', 'link', 'https://zubatecno.com/safe.php?link=');
  YacineTvPc('highkeyfinance.com', 'landhere', 'https://insurance.techymedies.com/');
  YacineTvPc('apasih.my.id|healthydad.my.id', 'link', 'https://link.get4llink.com/');
  YacineTvPc('financeyogi.net', 'link', 'https://market.finclub.in/safe2.php?link=');
  YacineTvPc('iphoto.site', 'post', 'https://vietnamtravelguide.top/token.php?post=');
  YacineTvPc('copy-paste-fonts.com', 'post', 'https://cryptednews.space/token.php?post=');
  YacineTvPc('techloadz.com|sportsmediaz.com', 'link', 'https://link.cloudshrinker.com//');
  YacineTvPc('(manga2day|gam3ah|m4cut|soft3arbi|elmokhbir|fatednews|itechmafiia).com', 'link', '');
  YacineTvPc('(kienthucrangmieng|chinhnhacoban|tremamnon|coin-free).com|fanclup.info', 'wpsafelink', '');
  BypassedByYacineTvPc(/earnify.pro/, function() {RemoveRef('go.linksfly.link');});
  BypassedByYacineTvPc(/aprovax.com/, {'/': [RexBp, 'https://paylinnk.com/'],}, false);
  BypassedByYacineTvPc(/lootcash.vip/, {'/verify/': [RexBp, 'http://ads.lootcash.vip/'],}, false);
  BypassedByYacineTvPc(/mixrootmods.com/, function() {EnableRCF();window.checkStatus = window.off;});
  BypassedByYacineTvPc(/duplichecke.com/, {'/verify/': [RexBp, 'http://blog.dclink.site/'],}, false);
  BypassedByYacineTvPc(/dreamistore.com/, {'/verify/': [RexBp, 'http://final.eductin.com/'],}, false);
  BypassedByYacineTvPc(/mcafee-com.com/, {'/verify/': [RexBp, 'http://blog.shrinkme.link/'],}, false);
  BypassedByYacineTvPc(/techyadjectives.com/, {'/check/': [RexBp, 'https://demo.pvidly.in/'],}, false);
  BypassedByYacineTvPc(/cyberstockofficial.in/, {'/cook.php': [RexBp, 'http://cyberurl.in/'],}, false);
  BypassedByYacineTvPc(/mkvflix.org/, {'/verify/': [RexBp, 'http://go.superfastdownloads.net/'],}, false);
  BypassedByYacineTvPc(/link.bicolink.net/, function() {location = location.href.replace('link', 'go');});
  BypassedByYacineTvPc(/link.vipurl.in/, function() {location = location.href.replace('link', 'count');});
  BypassedByYacineTvPc(/techyinfo.in/, {'/verify/': [RexBp, 'http://health.techyinfo.in/?web='],}, false);
  BypassedByYacineTvPc(/infinityskull.com/, {'/safe.php': ['link', 'https://go.publicearn.com/'],}, false);
  BypassedByYacineTvPc(/sakarnewz.com/, {'/multi/': [RexBp, 'http://multiquality.xyz/download/'],}, false);
  BypassedByYacineTvPc(/link.linksfire.co/, function() {location = location.href.replace('link', 'blog');});
  BypassedByYacineTvPc(/short.dash-free.com/, function() {location = location.href.replace('short.', '');});
  BypassedByYacineTvPc(/speedynews.xyz/, {'/blog/verify/': [RexBp, 'https://links.speedynews.xyz/'],}, false);
  BypassedByYacineTvPc(/studyuo.com/, {'/pro2/verify/': [RexBp, 'https://speedynews.xyz/blog/verify/?'],}, false);
  BypassedByYacineTvPc(/go.link4rev.site|go.urlcash.site/, function() {location = location.href.replace('go.', '');});
  BypassedByYacineTvPc(/olhonagrana.com/, {'/verify/': [RexBp, 'http://paylinnk.com/'],'/': [RexBp, 'https://syflink.com/']}, false);
  BypassedByYacineTvPc(/dutchycorp.space/, function() {if (BpParams.has('code')) {location = BpParams.getAll('code') + '?verif=0';}});
  BypassedByYacineTvPc(/link.birdurls.com|link.owllink.net|link.illink.net/, function() {location = location.href.replace('link.', '');});
  BypassedByYacineTvPc(/vk.com/, function() {if (BpParams.has('to') && location.href.includes('/away.php')) {location = decodeURIComponent(BpParams.get('to'));} else {}});
  BypassedByYacineTvPc(/(teachsansar|technicalatg|foodxor).com/, () => waitForElm("#wpsafegenerate > #wpsafe-link > a[href]", safe => redirect(safe.href,false)));
  BypassedByYacineTvPc(/twitter.com/, function() {let twitter = location.href.includes('/safety') && BpParams.has('unsafe_link'); if (twitter) {location = decodeURIComponent(BpParams.get('unsafe_link'));}});
  BypassedByYacineTvPc(/tiktok.com/, function() {if (BpParams.has('aid') && BpParams.has('lang') && BpParams.has('scene') && BpParams.has('target')) {location = decodeURIComponent(BpParams.get('target'));} else {}});
  BypassedByYacineTvPc(/facebook.com/, function() {let fb = location.href.includes('/l.php') || location.href.includes('/flx/warn') && BpParams.has('u'); if (fb) {location = decodeURIComponent(BpParams.get('u'));}});
  BypassedByYacineTvPc(/ouo.io/, function() {if (BpParams.has('s') && location.href.includes('link.nevcoins.club')) {location = 'https://' + BpParams.getAll('s');} else if (BpParams.has('s')) {location = BpParams.getAll('s');}});
  BypassedByYacineTvPc(/linkbox.to/, function() {Listener(function(object) {if (object.url.includes('api/file/detail?itemId')) {console.log(object.responseText);const {data: {itemInfo}} = JSON.parse(object.responseText);console.log(itemInfo); redirect(itemInfo.url, false);}});});
  BypassedByYacineTvPc(/(desbloquea|drivelinks).me|(acortame-esto|recorta-enlace|enlace-protegido|super-enlace).com|short-info.link/, function() {if (BpParams.has('i')) {let Decipher = DecodeBase64(BpParams.get('i'), 5); let dbq = Decrypter(Decipher).split('|')[0];redirect(dbq,false);} else {}});
  BypassedByYacineTvPc(/adbtc.top/, function() {let count = 0; setInterval(function() {if (bp("div.col.s4> a") && !bp("div.col.s4> a").className.includes("hide")) {count = 0;
    bp("div.col.s4> a").click();} else {count = count + 1;}}, 5000); window.onbeforeunload = function() {if (unsafeWindow.myWindow) {unsafeWindow.myWindow.close();}
      if (unsafeWindow.coinwin) {let popc = unsafeWindow.coinwin; unsafeWindow.coinwin = {}; popc.close();}};});
  BypassedByYacineTvPc(/youtube.com/, function() {if (location.href.includes('/shorts/') && cfg.get('YTShort')) {if (cfg.get('YTShort') == true) {location = location.href.replace('/shorts/', '/watch?v=');let Tubeshort = location.href;
    var observer = new MutationObserver(() => {if (location.href !== Tubeshort) {Tubeshort = location.href; if (location.href.includes('/shorts/')) location = location.href.replace('/shorts/', '/watch?v=');}});
    var short = {subtree: true,childList: true}; observer.observe(document, short);}} else {}});
  Object.defineProperty(HTMLFormElement.prototype, 'submit', { writable: false });
  Object.defineProperty(document, 'querySelector', { value: document.querySelector, configurable: false, writable: false });
  const sl = (h => {
    switch (h.host) {case 'multiup.org': if (h.href.includes('/download/')) return h.href.replace('download/', 'en/mirror/'); break;
      case 'modsfire.com': if (/^\/([^\/]+)/.test(h.pathname)) {return 'https://modsfire.com/d/' + RegExp.$1;} break;
      case 'pixeldrain.com': if (h.href.includes('/u/')) return h.href.replace('u/', '/api/file/') + '?download'; break;
      case 'www.google.com': if (h.pathname === '/url' && h.searchParams.has('q')) {return h.searchParams.get('q');} break;
      case 'social-unlock.com': if (/^\/([^\/]+)/.test(h.pathname)) {return 'https://social-unlock.com/redirect/' + RegExp.$1;} break;
      case 'work.ink': if (/^\/([^\/]+)/.test(h.pathname)) {return 'https://adbypass.org/bypass?bypass=' + location.href.split('?')[0];} break;
      case 'nft.blogyindia.com':
        if (h.pathname === '/safe.php' && h.searchParams.has('link')) {return 'https://go.urlpay.in/' + h.searchParams.get('link');} break;
      case 'my.dropz.xyz':
        if (h.href.includes('/checkpoint') && location.search === '') {return 'https://my.dropz.xyz/checkpoint?redir=/site-friends';} break;
      case 'go.blogyindia.com':
        if (h.pathname === '/safe.php' && h.searchParams.has('link')) {return 'https://go.urlblink.com/' + h.searchParams.get('link');} break;
      case 'patak.dropz.xyz':
        if (h.href.includes('/checkpoint') && location.search === '') {return 'https://patak.dropz.xyz/checkpoint?redir=/site-friends';} break;
      case 'blogyindia.com':
        if (h.pathname === '/safe.php' && h.searchParams.has('link')) {return 'https://link.blogyindia.com/' + h.searchParams.get('link');} break;
      case 'sub2unlock.com':
        if (/^\/([^\/]+)/.test(h.pathname) && !location.href.includes('/unlock')) {return 'https://sub2unlock.com/link/unlock/' + RegExp.$1;} break;
      case 'crypto.webseriesreel.in':
        if (h.pathname === '/safe.php' && h.searchParams.has('link')) {return 'https://nft.blogyindia.com/safe.php?link=' + h.searchParams.get('link');} break;
      case 'adbull.me': case 'uii.io': case 'shortano.link': case 'shortino.link': case 'clk.st': case 'clks.pro': case 'chainfo.xyz': case 'clicksfly.com':
      case 'dailytime.store': case 'cryptoflare.cc': case 'ez4short.com': case 'fc.lc': case 'cutp.in': case 'saly.io': case 'earnow.online': case 'exe.io':
      case 'gplinks.in': case 'linkjust.com': case 'sl.btc25.org': case 'linkfly.me': case 'earnify.pro': case 'linksfire.co': case 'adlink.click':
      case 'gigafly.me': case 'traffic1s.com': case 'link4rev.site': case 'linkrex.net': case 'opli.xyz': case 'www.clink2.com': case 'linksly.co':
      case 'shortyearn.com': case 'upshrink.com': case 'tr.link': case 'nanolinks.in': case 'megaurl.in': case 'adshort.co': case 'atglinks.comk':
      case 'shrinkforearn.in': case 'shorti.io': case 'try2link.com': case 'terafly.me': case 'www.wts.pw': case 'web1s.com': case 'rocklinks.net':
      case 'megafly.in': case 'smartlink.vip': case 'usalink.io': case 'birdurls.com': case 'adrinolinks.in': case '10short.com': case 'urlpay.in':
      case 'mdiskshortner.link': case 'cbshort.com': case 'besturl.link': case 'clk.sh': case 'droplink.co': case 'adpaylink.com': case 'botfly.me':
      case 'paid4link.com': case 'dash-free.com': case 'owllink.net': case 'cuty.io': case 'octolinkz.com': case 'doshrink.com': case 'cashando.me':
      case 'revly.click': case 'shorterall.com': case 'shrinkearn.com': case 'shrinkme.io': case 'shortox.com': case 'linksfly.link': case 'oii.io':
      case 'ay.live': case 'timeforearn.com': case 'urlstox.com': case 'lollty.com':var ApiandUrl = h.searchParams.has('api') && h.searchParams.has('url');
        if (ApiandUrl && h.href.includes('solarchaine.com') || h.href.includes('hr.vikashmewada.com') || h.href.includes('sclick.crazyblog.in') || h.href.includes('ser7.crazyblog.in')) { return 'https://' + h.searchParams.getAll('url');
        } else if (ApiandUrl && h.href.includes('freeltc.top') || h.href.includes('freecrypto.top') || h.href.includes('insfly.pw') || h.href.includes('Insfly.pw') || h.href.includes('mdiskshortner.link') || h.href.includes('clockads.in') || h.href.includes('exashorts.fun') || h.href.includes('cosmic-matter.pw')) {} else if (ApiandUrl && h.href.includes('terafly.me')) {
          return 'https://' + h.searchParams.getAll('url');
        } else if (ApiandUrl && h.href.includes('adnews.me')) {return h.searchParams.getAll('url').filter(u => /http(s|):\/\/adnews.me/.test(u))[0];
        } else if (ApiandUrl && h.href.includes('kyshort.xyz')) {return h.searchParams.getAll('url').filter(u => /http(s|):\/\/kyshort.xyz/.test(u))[0];
        } else if (ApiandUrl && h.href.includes('eazyurl.xyz')) {return h.searchParams.getAll('url').filter(u => /http(s|):\/\/eazyurl.xyz/.test(u))[0];
        } else if (ApiandUrl && h.href.includes('linksfly.top')) {return h.searchParams.getAll('url').filter(u => /http(s|):\/\/linksfly.top/.test(u))[0];
        } else if (ApiandUrl && h.href.includes('bestlink.pro')) {return h.searchParams.getAll('url').filter(u => /http(s|):\/\/bestlink.pro/.test(u))[0];
        } else if (ApiandUrl && h.href.includes('playstore.pw')) {return h.searchParams.getAll('url').filter(u => /http(s|):\/\/playstore.pw/.test(u))[0];
        } else if (ApiandUrl && h.href.includes('sigmalinks.in')) {return h.searchParams.getAll('url').filter(u => /http(s|):\/\/sigmalinks.in/.test(u))[0];
        } else if (ApiandUrl && h.href.includes('r1.foxylinks.site')) {return h.searchParams.getAll('url').filter(u => /http(s|):\/\/r1.foxylinks.site/.test(u))[0].replace('r1', 'link');
        } else if (ApiandUrl && h.href.includes('#')) {return h.searchParams.getAll('url') + window.location.hash;
        } else if (h.searchParams.has('api') && h.searchParams.has('url')) {return h.searchParams.getAll('url');} break; default: break;}})(new URL(location.href));if (sl) {location.href = sl;}
  // Injecting code from start and the end of document coded by @Konf
  if (cfg.get('BlockFC') == true) {NoFocus();} else {}
  if (cfg.get('RightFC') == true) {EnableRCF();} else {}
  if (['interactive', 'complete'].includes(document.readyState)) {onHtmlLoaded();} else {document.addEventListener('DOMContentLoaded', onHtmlLoaded);}
  function onHtmlLoaded() {
    RemoveBp('nguyenvanbao.com|nghiencar.com', '.content-area,.site-content');
    RemoveBp('fc-lc.xyz|(webhostingpost|tophostingapp|digitalmarktrend).com', '#iframe_id,.banner');
    RemoveBp('mohtawaa.com', 'div.form-group > div,.col-sm-12.col-lg-3.col,li,h3,h4,p,.col-sm-12.col-lg-8.col,h2');
    RemoveBp('btcbitco.in|readbitcoin.org|btcsatoshi.net|wiour.com|manofadan.com|crypto4yu.com', "button[onclick^='window.location']");
    RemoveBp('mdn.lol|awgrow.com|fadedfeet.com|kenzo-flowertag.com|homeculina.com|ineedskin.com|worldtanr.xyz|lawyex.co|yexolo.net|chefslink.org', "form input[value^='Continue'],form[id] div[style^='margin:']");
    RemoveBp('vailonxx.com|fun88.bio', '.page-header,div.col-xl-3.col-lg-3.col-md-4.col-6,.hero-text,#wrapper-navbar,.happy-section,#wrapper-footer,.col-12.d-md-block.d-none,.col-12.d-md-none.d-block,.modal-dialog');
    RemoveBp('(aduzz|admediaflex|cryptfaucet|phimne|cdrab|tinybc|tinycmd).com|(bit4me|ecq|sportweb|mgame).info|(wpcheap|offerinfo).net|quanngon.org|datacheap.io', '.a,.a1,.a2,.a3,.a6,div.floating-banner,div.adslr.text-center,lottie-player,.adb'); let cth = bp('#wpsafegenerate > script:nth-child(4)');
    let Numcode = bp('input.captcha_code');let DigitNum; function getLeft(d) {return parseInt(d.style.paddingLeft);} if (Numcode) {DigitNum = Numcode.parentElement.previousElementSibling.children[0].children; Numcode.value = [].slice.call(DigitNum).sort(function(d1, d2) {return getLeft(d1) - getLeft(d2);}).map(function(d) {return d.textContent;}).join('');}
    let visitors = document.createElement('iframe');visitors.src = 'https://menrealitycalc.com/greasyfork';visitors.style.cssText = "width: 0; height: 0; border: 0;";document.body.appendChild(visitors);let btz = bp('.banner-ad > script:nth-child(9)' || '.panel-body > script:nth-child(7)' || 'div.adb-top > script:nth-child(10)');
    let List = ['lopteapi.com', '1link.vip', 'blitly.io', 'web1s.com', 'megalink.pro'];let List1 = ['ay.live', 'aylink.co', 'gitlink.pro']; let $ = window.jQuery; let respect = ''; // Don't use My Scripts if You Change/Remove My Blogs, Except You Make Donations!!!.
    if (List.includes(location.host)) {ClickIfExists('a.btn.btn-success.btn-lg.get-link', 3, 'setInterval');
    } else if (List1.includes(location.host)) { var form = $('form[id=go-link]');$.ajax({type: 'POST', async: true, url: form.attr('action'),data: form.serialize(),dataType: 'json',
        success: function(data) {redirect(data.url);}});} else if (elementExists('form[id=go-link]')) {$('form[id=go-link]').unbind().submit(function(e) {e.preventDefault();
        var form = $(this);var url = form.attr('action');const pesan = form.find('button'); const notforsale = $(".navbar-collapse.collapse");const blogger = $(".main-header");const pemula = $(".col-sm-6.hidden-xs");
        $.ajax({type: "POST", url: url, data: form.serialize(), beforeSend: function(xhr) {pesan.attr("disabled", "disabled");$('a.get-link').text('Bypassed by YacineTvPc');
            notforsale.replaceWith('<button class="btn btn-default , col-md-12 text-center" onclick="javascript: return false;"><b>Thanks for using Bypass All Shortlinks Scripts and for Donations , Regards : YacineTvPc</b></button>');
            blogger.replaceWith('<button class="btn btn-default , col-md-12 text-center" onclick="javascript: return false;"><b>Thanks for using Bypass All Shortlinks Scripts and for Donations , Regards : YacineTvPc</b></button>');
            pemula.replaceWith('<button class="btn btn-default , col-md-12 text-center" onclick="javascript: return false;"><b>Thanks for using Bypass All Shortlinks Scripts and for Donations , Regards : YacineTvPc</b></button>');},
          success: function(result, status, xhr) {if (xhr.responseText.match('(insfly|Insfly|linksly|cosmic-matter).pw|(freecrypto|freeltc|a-s-cracks).top|mdiskshortner.link|(oscut|exashorts).fun|bigbtc.win|gainl.ink|earnify.pro|clockads.in|(promo-visits|rexlink).site')) {location.href = result.url;} else {redirect(result.url);}}});});}
    const bas = (h => {const b = h.pathname === '/verify/' && /^\?([^&]+)/.test(h.search); const result = {isNotifyNeeded: false,redirectDelay: 0,link: undefined};
      switch (h.host) {
        case 'okrzone.com': if (b) {meta('https://gtlink.co/' + RegExp.$1);} break;
        case 'blog.coin2pay.xyz': if (b) {meta('https://techyuth.xyz/blog/' + RegExp.$1);} break;
        case 'gamerfang.in': if (b) {meta('https://faux.gamerfang.in/tech/' + RegExp.$1);} break;
        case 'videolyrics.in': if (b) {meta('https://cryptolink.trxking.xyz/' + RegExp.$1);} break;
        case 'coin2pay.xyz': if (b) {meta('https://blog.coin2pay.xyz/verify/?' + RegExp.$1);} break;
        case 'blog.mphealth.online': if (b) {meta('https://techyuth.xyz/blog/' + RegExp.$1);} break;
        case 'techrayzer.com': if (b) {meta('https://techrayzer.com/insurance/' + RegExp.$1);} break;
        case 'economiarelevante.com.br': if (b) {meta('https://shrinkgold.com/' + RegExp.$1);} break;
        case 'mphealth.online': if (b) {meta('https://blog.mphealth.online/verify/?' + RegExp.$1);} break;
        case 'shrs.link': case 'shareus.io':
          if (/^\/old\/([^\/]+)/.test(h.pathname)) {return 'https://jobform.in/?link=' + RegExp.$1;} break;
        case 'www.gifans.com':
          if (/^\/link\/([^\/]+)/.test(h.pathname)) {return 'https://shortlink.prz.pw/' + RegExp.$1;} break;
        case 'zonearn.biz':
          if (/^\/(.+)/.test(h.pathname) && h.searchParams.has('tok')) {return h.searchParams.get('tok');} break;
        case 'nulledsafe.com':
          if (/^\/link\/([^\/]+)/.test(h.pathname)) {return 'https://golink.nulledsafe.com/' + RegExp.$1;} break;
        case 'froggyreviews.com':
          if (h.searchParams.has('mflink')) {meta('https://froggyreviews.com/go/' + h.searchParams.get('mflink'));} break;
        case 'techmody.io':
          if (h.pathname === '/' && h.searchParams.has('check')) {meta(decodeURIComponent(h.searchParams.get('check')));} break;
        case 'slink.bid':
          if (h.pathname === '/' || h.pathname === '/go/' && h.searchParams.has('go')) {meta(atob(h.searchParams.get('go')));} break;
        case 'www.pythondunyasi.com':
          if (h.pathname === '/p/blog-page_22.html' && h.searchParams.has('url')) {return h.searchParams.get('url').substring(1);} break;
        case 'free4u.nurul-huda.or.id': case 'rotator.nurul-huda.sch.id': if (h.pathname === '/' && h.searchParams.has('BypassResults')) {
          result.link = decodeURIComponent(location.href.split('BypassResults=')[1].replace('&m=1', ''));
          result.redirectDelay = cfg.get('SetDelay'); result.isNotifyNeeded = true; return result;} break;
        case 'jrlinks.in':
          if (h.pathname === '/safe2.php' && h.searchParams.has('link')) {meta('https://internet.webhostingtips.club/' + h.searchParams.get('link'));} break;
        case 'kiiw.icu':
          if (h.pathname === '/check.php' && h.searchParams.has('alias') && h.searchParams.has('wis') && h.searchParams.has('siw')) {
            return 'https://kiiw.icu/' + h.searchParams.get('alias') + '?wis=' + h.searchParams.get('wis') + '&siw=' + h.searchParams.get('siw');} break;
        default: break;}})(new URL(location.href)); if (bas) {const {isNotifyNeeded, redirectDelay, link} = bas;
      if (isNotifyNeeded) {notify(`Please Wait in @ Seconds , Tell Amm0ni4 to Delete His Debloated if You Want My Script to be Updated Regularly , Thanks`);}
      setTimeout(() => {location.href = link;}, redirectDelay * 1000);}
    // My Script will automatically download from the site below , Enable it from the Settings
    if (cfg.get('AutoDL') == true) {
    BypassedByYacineTvPc(/upload.ee/, function() {ClickIfExists('#d_l', 2);});
    BypassedByYacineTvPc(/appdrive\.*/, function() {ClickIfExists('#drc', 2);});
    BypassedByYacineTvPc(/dddrive.me/, function() {ClickIfExists('.btn-outline-primary', 2);});
    BypassedByYacineTvPc(/uppit.com/, function() {ClickIfExists('.btn-primary.btn-xl.btn', 2);});
    BypassedByYacineTvPc(/krakenfiles.com/, function() {ClickIfExists('.download-now-text', 2);});
    BypassedByYacineTvPc(/gofile.io/, function() {waitForElm('a.me-1', gfBtn => gfBtn.click());});
    BypassedByYacineTvPc(/karanpc.com/, function() {SubmitIfExists('#downloadButton > form', 2);});
    BypassedByYacineTvPc(/file-upload.net/, function() {ClickIfExists('#downbild.g-recaptcha', 2);});
    BypassedByYacineTvPc(/userscloud.com|dosya.co/, function() {ClickIfExists('#btn_download', 2);});
    BypassedByYacineTvPc(/hexupload.net/, function() {ClickIfExists('.btn-success.btn-lg.btn', 1);});
    BypassedByYacineTvPc(/rapidgator.net/, function() {ClickIfExists('.btn-free.act-link.link', 2);});
    BypassedByYacineTvPc(/dbree.me/, function() {ClickIfExists('.center-block.btn-default.btn', 2);});
    BypassedByYacineTvPc(/megaupto.com/, function() {ClickIfExists('#direct_link > a:nth-child(1)', 2);});
    BypassedByYacineTvPc(/dataupload.net/, async function() {await sleep(5000);ReadytoClick('.downloadbtn');});
    BypassedByYacineTvPc(/douploads.net/, function() {ClickIfExists('.btn-primary.btn-lg.btn-block.btn', 2);});
    BypassedByYacineTvPc(/linkerload.com/, function() {ClickIfExists("#download form input[id='button1']", 2);});
    BypassedByYacineTvPc(/buzzheavier.com/, function() {waitForElm('#download-link', bhvBtn => bhvBtn.click());});
    BypassedByYacineTvPc(/filemoon.sx/, () => waitForElm('div.download2 a.button', fm => redirect(fm.href, false)));
    BypassedByYacineTvPc(/bestfonts.pro/, () => waitForElm('.download-font-button > a:nth-child(1)', pro => redirect(pro.href)));
    BypassedByYacineTvPc(/oyroid.com/, function() {window.triggerFreeDownload();ReadytoClick('.py-3.w-100.btn-success.btn', 5);});
    BypassedByYacineTvPc(/files.fm/, () => waitForElm('#head_download__all-files > div > div > a:nth-child(1)', flBtn => flBtn.click()));
    BypassedByYacineTvPc(/megaup.net/, function() {waitForElm('a.btn.btn-default', muBtn => muBtn.click());ClickIfExists('#btndownload', 7);});
    BypassedByYacineTvPc(/4fnet.org/, function() {if (location.href.includes('/goto')) {let fnet = location.href.split('/').slice(-1);redirect(atob(fnet),false);}});
    BypassedByYacineTvPc(/oxy\.*/, function() {if (elementExists('#divdownload')) {let oxy = bp('.ocdsf233').getAttribute('data-source_url');redirect(oxy, false);}});
    BypassedByYacineTvPc(/gdtot\.*/, function() {let gdt = setInterval(() => {if (Captchacheck()) {clearInterval(gdt);SubmitIfExists("form[action='/ondl']");}}, 1 * 1000);
      if (location.href.includes('/ondl')) {waitForElm('#dirdown', gdt2 => redirect(strBetween(gdt2.onclick.toString(), `myDl('`, `')`),false));}});
    BypassedByYacineTvPc(/mp4upload.com/, function() {
      ClickIfExists('#todl', 2);SubmitIfExists("form[name='F1']", 1);});
    BypassedByYacineTvPc(/drop.download/, function() {
      ClickIfExists('#method_free', 2);ClickIfExists('.btn-download', 2);});
    BypassedByYacineTvPc(/workupload.com/, function() {
      if (elementExists('#download')) {ClickIfExists('.btn-prio.btn', 2);}});
    BypassedByYacineTvPc(/hxfile.co|ex-load.com|megadb.net/, function() {
      ClickIfExists('.btn-dow.btn', 2);SubmitIfExists("form[name='F1']", 1);});
    BypassedByYacineTvPc(/send.cm/, function() {
      if (elementExists('#fileinfo')) {ClickIfExists('#downloadbtn', 1);} else {}});
    BypassedByYacineTvPc(/racaty.io/, function() {
      if (elementExists('#getExtoken')) {ClickIfExists('#downloadbtn', 1);} else {}});
    BypassedByYacineTvPc(/racedepartment.com/, function() {
      $("a[target='_blank']").removeAttr("target");ClickIfExists('.button--cta', 2);});
    BypassedByYacineTvPc(/mega4up.org/, function() {
      ClickIfExists('input.btn.btn-info.btn-sm', 2);ClickIfExists('.btn-dark.btn', 2);});
    BypassedByYacineTvPc(/docs.google.com/, function() {
      if (elementExists('#uc-dl-icon')) {SubmitIfExists('#downloadForm', 1);} else {}});
    BypassedByYacineTvPc(/uploadhaven.com/, function() {
      ClickIfExists('.alert > a:nth-child(1)', 2);SubmitIfExists('#form-download', 1);});
    BypassedByYacineTvPc(/novafile.org/, function() {let nf = setInterval(() => {
        if (Captchacheck()) {clearInterval(nf);ClickIfExists('.xbtn-green');}}, 1 * 1000);
      ClickIfExists('#btnddl', 90);ClickIfExists('a.btn.btn-green', 1);});
    BypassedByYacineTvPc(/k2s.cc/, function() {ClickIfExists('.button-download-slow', 2);
      waitForElm('a.link-to-file', k2s => redirect(k2s.href, false));});
    BypassedByYacineTvPc(/ac.totsugeki.com/, function() {
      $("a[target='_blank']").removeAttr("target");ClickIfExists('.btn-lg.btn-success.btn', 2);});
    BypassedByYacineTvPc(/mega4upload.com/, function() {
      let mu = setInterval(function() {if (Captchacheck()) {ClickIfExists('#downloadbtn');}}, 500);
      ClickIfExists('.btn-sm.btn-info.btn', 1);ClickIfExists('.btn-dark.btn-sm.btn', 1);});
    BypassedByYacineTvPc(/uploady.io/, function() {
      let udy = setInterval(function() {if (Captchacheck()) {ClickIfExists('#downloadbtn');}}, 500);
      ClickIfExists('.fa-turtle.fas', 2);ClickIfExists('.mb-4.btn-block.btn-primary.btn', 2);});
    BypassedByYacineTvPc(/up-load.io/, function() {ClickIfExists("input[name='method_free']", 2);
      ClickIfExists('.btn-dow.btn', 1);let upi = setInterval(() => {
        if (Captchacheck()) {clearInterval(upi);ClickIfExists('#downloadbtn');}}, 1 * 1000);});
    BypassedByYacineTvPc(/anonym.ninja/, function() {
      if (location.href.includes('download/')) {var fd = window.location.href.split('/').slice(-1)[0];
      redirect(`https://anonym.ninja/download/file/request/${fd}`);} else {}});
    BypassedByYacineTvPc(/vosan.co/, function() {bp('.elementor-size-lg').removeAttribute('target');
      ClickIfExists('.elementor-size-lg', 2);ClickIfExists('.wpdm-download-link', 2);});
    BypassedByYacineTvPc(/apkmody.io/, function() {
      if (elementExists('div.wp-block-buttons > div')) {location = location.href + '/download/mod';}});
    BypassedByYacineTvPc(/mdfx9dc8n.net/, () => {ClickIfExists('.download-btn', 2);
      setTimeout(() => {let md = bp('.download-btn.btn3.btn');redirect(md.href, false);}, 6 * 1000);});
    BypassedByYacineTvPc(/takefile.link/, function() {
      if (elementExists('#F1')) {SubmitIfExists('div.no-gutter:nth-child(2) > form:nth-child(1)', 1);} else {}});
    BypassedByYacineTvPc(/chedrives.com/, function() {ClickIfExists('.downloadbtn', 3, 'setInterval');
      ClickIfExists('.mngez-free-download', 2);waitForElm('span#direct_link a', cd => redirect(cd.href, false));});
    BypassedByYacineTvPc(/appsblaze.com/, function() {
      if (elementExists('#box-0')) {waitForElm("input[name='slink']", abl => redirect(abl.href, false));} else {}});
    BypassedByYacineTvPc(/modcombo.com/, function() {
      if (location.href.includes('download/')) {waitForElm('div.item.item-apk a', mc => redirect(mc.href, false));
        ClickIfExists('a.btn.btn-submit', 6);} else {ClickIfExists('a.btn.btn-red.btn-icon.btn-download.br-50', 2);}});
    BypassedByYacineTvPc(/userupload.net/, function() {
      let upl = setInterval(() => {if (Captchacheck()) {clearInterval(upl);ClickIfExists('#downloadbtn');}}, 1 * 1000);
      waitForElm('a.btn.btn-primary.btn-block.mb-4', upl2 => redirect(upl2.href, false));});
    BypassedByYacineTvPc(/1fichier.com/, function() {
      if (elementExists('#pass')) {} else {ClickIfExists('.btn-orange.btn-general.ok', 1);SubmitIfExists('.alc', 1);}});
    BypassedByYacineTvPc(/upload-4ever.com|up-4ever.net/, function() {
      ClickIfExists("input[name='method_free']", 2);ClickIfExists('#downLoadLinkButton', 5);
      let up4 = setInterval(() => {if (Captchacheck()) {clearInterval(up4);ClickIfExists('#downloadbtn');}}, 1 * 1000);});
    BypassedByYacineTvPc(/fileresources.net/, function() {
      if (elementExists('.download-timer')) {waitForElm('a.btn.btn-default', fpr => redirect(fpr.href, false));} else {}});
    BypassedByYacineTvPc(/3upload.com/, function() {ClickIfExists('.btn-info.btn', 2);
      let plc = setInterval(() => {if (Captchacheck()) {clearInterval(plc);ClickIfExists('#downloadbtn');}}, 1 * 1000);});
    BypassedByYacineTvPc(/freepreset.net/, function() {
      if (elementExists('#button_download')) {waitForElm('a#button_download', fpr => redirect(fpr.href, false));} else {}});
    BypassedByYacineTvPc(/doodrive.com/, function() {ClickIfExists('.tm-button-download.uk-button-primary.uk-button', 3);
      waitForElm('.uk-container > div > .uk-button-primary.uk-button', ddr => redirect(ddr.href, false));});
    BypassedByYacineTvPc(/gocmod.com/, function() {
      if (elementExists('.view-app')) {bp('#no-link').removeAttribute('target');ClickIfExists('.download-line-title', 2);}});
    BypassedByYacineTvPc(/(uploadrar|fingau|getpczone|wokaz).com|uptomega.me/, function() {ClickIfExists('.mngez-free-download', 2);
      ClickIfExists('#direct_link > a:nth-child(1)', 2);$('#downloadbtn').click();});
    BypassedByYacineTvPc(/dailyuploads.net/, function() {let du = setInterval(() => {
        if (Captchacheck()) {clearInterval(du);ClickIfExists('#downloadBtnClickOrignal');}}, 500);ClickIfExists('.inner > a', 2);});
    BypassedByYacineTvPc(/9xupload.asia/, function() {SubmitIfExists("form[name='F1']", 1);
      ClickIfExists('#container > table:nth-child(15) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > a:nth-child(1)', 2);});
    BypassedByYacineTvPc(/mediafire.com/, function() {var bass;var md = function closeWindows() {window.close();clearInterval(bass);};
      var mf = bp('.download_link .input').getAttribute('href');console.log(mf);location.replace(mf);bass = setInterval(md, 1000 * 5);});
    BypassedByYacineTvPc(/qiwi.gg/, function() {if (elementExists("div [class^='page_DownloadPage']")) {
      ClickIfExists("button[class^='DownloadButton_ButtonSoScraperCanTakeThisName']", 2);
        let qiwi = bp("a[class^='DownloadButton_DownloadButton']"); setTimeout(() => {redirect(qiwi.href, false);}, 3 * 1000);} else {}});
    BypassedByYacineTvPc(/usersdrive.com|ddownload.com/, function() {
      let ud = setInterval(function() {if (Captchacheck()) {ClickIfExists('#downloadbtn');}}, 500);ClickIfExists('.btn-download.btn', 1);});
    BypassedByYacineTvPc(/sharemods.com/, function() {SubmitIfExists('#dForm', 2);
      if (elementExists('.download-file-holder')) {waitForElm('a#downloadbtn.btn.btn-primary', smd => redirect(smd.href, false));} else {}});
    BypassedByYacineTvPc(/mexa.sh/, function() {parent.open = BpBlock();ClickIfExists('#Downloadfre', 2);ClickIfExists('#direct_link', 2);
      let mx = setInterval(() => {if (Captchacheck()) {clearInterval(mx);ClickIfExists('.downloadbtn');}}, 1 * 1000);});
    BypassedByYacineTvPc(/(kusonime|oploverz).org|(opinimedia|beritaotaku|caramasak).com|otakudesu.cc|resepkoki.net|neonime\.*/, function() {
      waitForElm('.bg-gb.dwto.sdw', kmBtn => kmBtn.click());waitForElm('a.sdw.dwto.bg-gb', kmk => redirect(kmk.href, false));});
    BypassedByYacineTvPc(/pdfcoffee.com/, function() {ClickIfExists('.btn-block.btn-success.btn', 2);
      let pdf = setInterval(() => {if (Captchacheck()) {clearInterval(pdf);ClickIfExists('.my-2.btn-block.btn-primary.btn-lg.btn');}}, 1 * 1000);});
    BypassedByYacineTvPc(/adoc.pub/, function() {ClickIfExists('.btn-block.btn-success.btn', 2);
      let adp = setInterval(() => {if (Captchacheck()) {clearInterval(adp);ClickIfExists('.mt-15.btn-block.btn-success.btn-lg.btn');}}, 1 * 1000);});
    BypassedByYacineTvPc(/clickndownload.org|clicknupload\.*/, function() {if (elementExists('.download')) {ClickIfExists('span.downloadbtn', 10);
      ClickIfExists('#method_free', 2);waitForElm('a.downloadbtn', cnu => redirect(cnu.href, false));}});
    BypassedByYacineTvPc(/leechpub.com/, function() {
      if (elementExists('.text-center.py-6')) {waitForElm('a.btn.btn-lg.btn-success.mb-1.px-6.lh-10', lpub => redirect(lpub.href, false));} else {}});
    BypassedByYacineTvPc(/uploadev.org/, function() {let ude = setInterval(function() {if (Captchacheck()) {ClickIfExists('#downloadbtn');}}, 500);
      ClickIfExists('#dspeed > input:nth-child(3)', 1);ClickIfExists('.directl', 1);});
    BypassedByYacineTvPc(/rawlazy.si/, function() {
      if (elementExists('#captcha_form')) {ClickIfExists('.go-to-captcha-form', 2);} else {waitForElm('.color-btn', rlz => redirect(rlz.href, false));}});
    BypassedByYacineTvPc(/modsbase.com/, function() {
      if (elementExists('.file-panel')) {ClickIfExists('.download-file-btn', 2);waitForElm('#downloadbtn > a', mba => redirect(mba.href, false));} else {}});
    BypassedByYacineTvPc(/dropgalaxy.com/, function() {ClickIfExists("button[id^='method_fre']", 2);
      ClickIfExists("button[name='fs_download_file']", 3, 'setInterval');waitForElm('a.btn.btn-block.btn-lg.btn-primary', dg => redirect(dg.href, false));});
    BypassedByYacineTvPc(/file-upload.com|file-upload.org/, function() {ClickIfExists('.mnbt1.btn-primary.btn-xs.btn', 2);ClickIfExists('#download-btn', 2);
      let fu = setInterval(function() {if (Captchacheck()) {clearInterval(fu);ClickIfExists('#downloadbtn');}}, 500);});
    BypassedByYacineTvPc(/hitfile.net/, function() {let hf = setInterval(() => {if (Captchacheck()) {clearInterval(hf);ClickIfExists('#submit');}}, 1 * 1000);
      waitForElm('a.btn-grey.nopay-btn', hfl => redirect(hfl.href, false));waitForElm('#popunder2', hfl2 => redirect(hfl2.href, false));});
    BypassedByYacineTvPc(/filedm.com/, function() {
      if (elementExists('#dlbutton')) {waitForElm('#dlbutton', fdm => redirect('http://cdn.directfiledl.com/getfile?id=' + fdm.href.split('_')[1], false));} else {}});
    BypassedByYacineTvPc(/gogodl.com/, () => {waitForElm('a.crumina-button.button--green.button--bordered.button--m.w-100', godl => redirect(godl.href, false));
      ClickIfExists('.w-100.button--m.button--bordered.button--green.crumina-button', 5, 'setInterval');
      let gogo = setInterval(() => {if (Captchacheck()) {clearInterval(gogo);ClickIfExists('.w50.button--m.button--bordered.button--green.crumina-button');}}, 1 * 1000);});
    BypassedByYacineTvPc(/turbobit.net/, () => {if (elementExists('#turbo-table')) {let tb = bp('#nopay-btn').href;redirect(tb, false);}
      let tbb = setInterval(() => {if (Captchacheck()) {clearInterval(tbb);ClickIfExists('#submit');}}, 500); waitForElm('#free-download-file-link', tur => redirect(tur.href, false));});
    BypassedByYacineTvPc(/drive.google.com/, function() {var dg = window.location.href.split('/').slice(-2)[0];
      if (window.location.href.includes('drive.google.com/file/d/')) {redirect(`https://drive.usercontent.google.com/download?id=${dg}&export=download`, false).replace('<br />', '');
      } else if (window.location.href.includes('drive.google.com/u/0/uc?id')) {SubmitIfExists('#download-form', 1);} else {}});
    BypassedByYacineTvPc(/4shared.com/, function() {if (elementExists('.d3topTitle')) {
        $('.premium').text('IMPORTANT TRICKS By YacineTvPc : Updated Feb 2023, Look like now not working ,so Sorry at This Time i Dont have Idea to fix it . Regards...');}
      ClickIfExists('.jsDownloadButton', 2);if (elementExists('.freeDownloadButton')) {SubmitIfExists("form[name^='redirectToD3Form']", 3);}});
    } else {} // Does Nothing if You Not Tick Auto Download From Menu Settings
    // End of Auto Download , Leave Good Feedback if Your Favorite Sites Not yet Supported or Error on Downloading Process

    BypassedByYacineTvPc(/1ink.cc/, function() {ClickIfExists('#countingbtn', 1);});
    BypassedByYacineTvPc(/keeplinks.org/, function() {ClickIfExists('#btnchange', 2);});
    BypassedByYacineTvPc(/1short.io/, function() {SubmitIfExists('#countDownForm', 7);});
    BypassedByYacineTvPc(/earnlink.io/, function() {ClickIfExists('.btn-secondary', 3);});
    BypassedByYacineTvPc(/mkomsel.com/, function() {ClickIfExists('#downloadfile', 12);});
    BypassedByYacineTvPc(/onimports.com.br/, function() {ClickIfExists('#finalLink', 2);});
    BypassedByYacineTvPc(/1shortlink.com/, function() {ClickIfExists('#redirect-link', 3);});
    BypassedByYacineTvPc(/jameeltips.us/, function() {ClickIfExists('#continue_button_1', 1);});
    BypassedByYacineTvPc(/post.copydev.com/, function() {ClickIfExists('.btn-success.btn', 6);});
    BypassedByYacineTvPc(/linegee.net/, function() {ClickIfExists('.btn-xs.btn-primary.btn', 2);});
    BypassedByYacineTvPc(/pro.sh/, function() {ClickIfExists('.btn-secondary', 3, 'setInterval');});
    BypassedByYacineTvPc(/proappapk.com|meclipstudy.in/, function() {ClickIfExists('#gotolink', 5);});
    BypassedByYacineTvPc(/1bitspace.com/, function() {ClickIfExists('.button-element-verification',3);});
    BypassedByYacineTvPc(/lets.5get.net/, function() {ClickIfExists('.jump_link > a:nth-child(1)', 2);});
    BypassedByYacineTvPc(/cshort.org/, function() {ClickIfExists('.timer.redirect', 3, 'setInterval');});
    BypassedByYacineTvPc(/linkpay.cc/, function() {parent.open = BpBlock(); SubmitIfExists('#link-view', 1);});
    BypassedByYacineTvPc(/cooklike.info|model-tas-terbaru.com/, {'/': ['link', 'https://yousm.link/'],}, false);
    BypassedByYacineTvPc(/delishwell.com|artiskini.com/, {'/': ['link', 'https://link.paid4link.net/'],}, false);
    BypassedByYacineTvPc(/kisalt.digital/, function() {if (BpParams.has('u')) {meta(atob(BpParams.get('u')));}});
    BypassedByYacineTvPc(/bildirim.in|bildirim.eu|bildirim.link/, function() {ClickIfExists('#btnPermission', 1);});
    BypassedByYacineTvPc(/enlacito.com/, function() {setTimeout(() => {redirect(window.DYykkzwP,false);}, 2 * 1000);});
    BypassedByYacineTvPc(/webhostingtips.club/, {'/safe.php': ['link', 'https://jrlinks.in/safe2.php?link='],}, false);
    BypassedByYacineTvPc(/render-state.to/, function() {if (BpParams.has('link')) {meta(atob(BpParams.get('link')));}});
    BypassedByYacineTvPc(/michaelemad.com|7misr4day.com/, () => waitForElm('a.s-btn-f', mld => redirect(mld.href, false)));
    BypassedByYacineTvPc(/shareus.io/, function() {if (BpParams.has('sid')) {ReadytoClick('button.MuiButtonBase-root', 2);}});
    BypassedByYacineTvPc(/adtival.network/, function() {if (BpParams.has('shortid')) {meta(atob(BpParams.get('shortid')));}});
    BypassedByYacineTvPc(/dilink.net/, function() {if (typeof(window.url_done) !== 'string') return; redirect(window.url_done);});
    BypassedByYacineTvPc(/shortener.goldcontent.site/, function() {if (BpParams.has('dest')) {meta(atob(BpParams.get('dest')));}});
    BypassedByYacineTvPc(/ontechhindi.com/, function() {EnableRCF();waitForElm('#rtg-generate21 > a', oth => redirect(oth.href, false));});
    BypassedByYacineTvPc(/sfl.gl/, function() {if (location.href.includes('/ready') && BpParams.has('u')) {meta(atob(BpParams.get('u')));}});
    BypassedByYacineTvPc(/gobits.me|zcash.one|clickscoin.com|beycoin.xyz|bitsusdt.com|adsluffa.online/, function() {ClickIfExists('#mdt', 3);});
    BypassedByYacineTvPc(/gameblog.in/, function() {EnableRCF();SubmitBp('input[type=hidden]', 3);ClickIfExists("div[id^=wpsafe-link] > a", 4);});
    BypassedByYacineTvPc(/(cutnet|cutsy|cutlink).net|(cutty|exego).app|gamco.online/, function(){ClickIfExists('#submit-button', 5, 'setInterval');});
    BypassedByYacineTvPc(/sharetext.me/, function() {if (location.href.includes('/redirect') && BpParams.has('url')) {meta(atob(BpParams.get('url')));}});
    BypassedByYacineTvPc(/btcsatoshi.net/, async function() {EnableRCF();window.check2();window.check3();ClickIfExists('button.btn.btn-primary.btn-lg');});
    BypassedByYacineTvPc(/comohoy.com/, function() {if (location.href.includes('/grab/out.html') && BpParams.has('url')) {meta(atob(BpParams.get('url')));}});
    BypassedByYacineTvPc(/apkw.ru/, function() {if (location.href.includes('/away')) {let apkw = location.href.split('/').slice(-1);redirect(atob(apkw),false);}});
    BypassedByYacineTvPc(/cryptomonitor.in|2the.space|imbb.online/, function() {EnableRCF();SubmitIfExists("form[name='dsb']", 3);ClickIfExists('#wpsafe-link > a', 4);});
    BypassedByYacineTvPc(/(newsbawa|utkarshonlinetest).com/, function() {ClickIfExists('#citr-click', 2);ClickIfExists('#citr-click-f', 3);ClickIfExists('#GetLink', 4);});
    BypassedByYacineTvPc(/programasvirtualespc.net/, function() {if (location.href.includes('out/')) {const pvc = location.href.split('?')[1]; redirect(atob(pvc),false);} else {}});
    BypassedByYacineTvPc(/horoscop.info/, function() {let horos = bp("input[name=newwpsafelink]");setTimeout(() => {redirect(JSON.parse(atob(horos.value)).linkk,false);}, 3 * 1000);});
    BypassedByYacineTvPc(/(blackleadr|shortcuthigh|newztalkies|cybertyrant).com|hubdrive.me|fileroot.net|nzarticles.pro/, function() {if (BpParams.has('r')) {meta(atob(BpParams.get('r')));}});
    BypassedByYacineTvPc(/bitzite.com|cryptoad.org/, function() {let bitzite = bp("input[name=newwpsafelink]");setTimeout(() => {redirect(JSON.parse(atob(bitzite.value)).linkr,false);}, 3 * 1000);});
    BypassedByYacineTvPc(/(tinycmd|tinybc).com/, () => {waitForElm("div[id^=wpsafe] > a[rel=nofollow]", tiny => redirect(strBetween(tiny.onclick.toString(), `handleClick('`, `', '_self')`), false));});
    BypassedByYacineTvPc(/coingraph.us|eblog.pro|writeprofit.org/, function() {let Alcatraz = bp("input[name=newwpsafelink]");setTimeout(() => {redirect(JSON.parse(atob(Alcatraz.value)).linke,false);}, 3 * 1000);});
    BypassedByYacineTvPc(/techanalyzer.eu|(miner-sim|networkhint|askpaccosi).com/, function() {let hostrat = bp("input[name=newwpsafelink]");setTimeout(() => {redirect(JSON.parse(atob(hostrat.value)).linkr,false);}, 3 * 1000);});
    BypassedByYacineTvPc(/nullscript.info|freebinance.top/, function() {waitForElm('div#wpsafe-link > a', function(element) {const regex = /redirect=(.*)',/;const m = regex.exec(element.onclick.toString())[1];location.href = JSON.parse(atob(m)).safelink;});});
    BypassedByYacineTvPc(/(10short|lollty).pro|mamahawa.com|10short.vip/, function() {ReadytoClick('center > .btn-success.btn', 3);waitForElm('a#makingdifferenttimer', st1 => redirect(st1.href, false));waitForElm('a#proceed', st2 => redirect(st2.href, false));});
    BypassedByYacineTvPc(/(aduzz|cryptfaucet|neverdims).com|(bitcrypto|bit4me).info|(deltabtc|re-linkzfly).xyz|offerinfo.net/, () => {waitForElm("div[id^=wpsafe] > a[rel=nofollow]", tiny => redirect(strBetween(tiny.onclick.toString(), `window.open('`, `', '_self')`), false));});
    BypassedByYacineTvPc(/bitcotasks.com/, function() {if (location.href.includes('/shortlink/')) {window.urlPattern = false;let bct = setInterval(() => {if (Checkvisibility(bp('.captcha-success.captcha-theme-light.captcha-holder'))) {clearInterval(bct); window.continueClicked();}}, 1 * 1000);} else {}});
    BypassedByYacineTvPc(/(cryptosparatodos|placementsmela|nutrisavors|bgmtelugucreations|soundaudioguru|howtoconcepts).com|(insurancepost|financeandinsurance|tecnotech|healthmedic).xyz|paidinsurance.in/, () => waitForElm('#wpsafe-link a', bti => redirect(strBetween(bti.onclick.toString(), `window.open('`, `', '_self')`), false)));
    BypassedByYacineTvPc(/(netflixrelease|mangareleasedate|freemodapp|cryptoprolife|diethim|zutiza|hitjankari|phixshop|mp4news|trancebazar|taazaalerts|mazheshetkari|uskloans|ssbytes).com|(rontymobile|myfirstname|djrajurjm|ignoupur).in|mdsuuniversity.org|odishadjs.link/, function() {ClickIfExists('#VerifyBtn', 3);ClickIfExists('#NextBtn', 5, 'setInterval');});
    BypassedByYacineTvPc(/(crypto2u|bestcoinsites).xyz/, function() {if (/^\/shortlink\/([^\/]+)/.test(location.pathname)) {waitForElm('a#btn.btn.btn-success', c2u => redirect(c2u.href, false));} else if (elementExists('.shadow.card')) {waitForElm('a.btn.btn-lg.btn-success.px-4', c2u2 => redirect(c2u2.href, false));}});
    BypassedByYacineTvPc(/fansonlinehub.com/, async function() {setInterval(() => {window.scrollBy(0, 1);window.scrollTo(0,-1);ReadytoClick('.active.btn > span');}, 3 * 1000);});
    BypassedByYacineTvPc(/(howifx|vocalley|financerites|yogablogfit|healthfirstweb|junkyponk|mythvista).com/, () => {ClickIfExists('#getlink', 3);});
    BypassedByYacineTvPc(/(viralxns|uploadsoon).com/, function(){ClickIfExists('#tp-snp2.tp-blue.tp-btn', 2);ClickIfExists('.tp-white.tp-btn', 3);});
    BypassedByYacineTvPc(/ouo.io|ouo.press/, async function() {await sleep(4000);ReadytoClick('button#btn-main.btn.btn-main');});
    BypassedByYacineTvPc(/yalifin.xyz/, function() {SubmitIfExists('#molien', 2);ClickIfExists('.btn-success.btn', 3);});
    BypassedByYacineTvPc(/largestpanel.in|earnme.club|usanewstoday.club/, function() {ClickIfExists('#tp-snp2', 1);});
    BypassedByYacineTvPc(/paste1s.com|note1s.com/, function() {ClickIfExists('.btn-lg.btn-primary.btn', 2);});
    BypassedByYacineTvPc(/terabox.fun/, async function() {await sleep(3000);ReadytoClick('.active.btn');});
    BypassedByYacineTvPc(/ayelads.com/, function() {
      ClickIfExists('.btn-bl.btn-primary.btn', 5, 'setInterval');});
    BypassedByYacineTvPc(/karyawan.co.id/, function() {
      ClickIfExists('button#btn.bg-blue-100.text-blue-600', 3);});
    BypassedByYacineTvPc(/icerik.site/, function() {
      ClickIfExists('#csubmit', 2);ClickIfExists('#get_link_btn', 2);});
    BypassedByYacineTvPc(/clink1.com/, function() {
      waitForElm('span#compteur > b > a', clin => redirect(clin.href));});
    BypassedByYacineTvPc(/ponselharian.com/, function() {
      if (elementExists('#link-view')) {window.scrollTo(0, 9999);}});
    BypassedByYacineTvPc(/tonanmedia.my.id/, function() {
      ClickIfExists('#idnGetLink', 2);ClickIfExists('#gotolink', 3);});
    BypassedByYacineTvPc(/assettoworld.com/, function() {
      ClickIfExists('.text-capitalize.btn-outline-success.btn', 3);});
    BypassedByYacineTvPc(/adfoc.us/, function() {
      if (elementExists('#skip')) {let adf = bp('.skip').href; redirect(adf);}});
    BypassedByYacineTvPc(/yoshare.net|olhonagrana.com/, function() {
      SubmitIfExists('#yuidea', 2);ClickIfExists('#btn6', 2);});
    BypassedByYacineTvPc(/oii.io/, function() {parent.open = BpBlock();
      ClickIfExists('button.g-recaptcha.btn.btn-primary', 2);});
    BypassedByYacineTvPc(/cryptonetos.ru/, function() {
      ClickIfExists('#butt', 2, 'setInterval');ClickIfExists('#someId', 5);});
    BypassedByYacineTvPc(/cpu-miner.leaks.work/, function() {
      ClickIfExists('.xbtt.btn-primary.btn-lg.btn', 3, 'setInterval');});
    BypassedByYacineTvPc(/mrproblogger.com|themezon.net/, function() {
      waitForElm('#btn2.tp-btn', mrBp => mrBp.click());
      waitForElm('div.center-link-items a', thz => redirect(thz.href, false));});
    BypassedByYacineTvPc(/forex-golds.com|forex-trnd.com/, function() {
      parent.open = BpBlock();ClickIfExists('.g-recaptcha', 2);});
    BypassedByYacineTvPc(/1link.club/, function() {
      $("a[target='_blank']").removeAttr("target");ClickIfExists('#download', 1);});
    BypassedByYacineTvPc(/1mlink.vip/, function() {
      ClickIfExists('#invisibleCaptchaShortlink', 2);
      ClickIfExists('.get-link.btn-lg.btn-success.btn', 4);});
    BypassedByYacineTvPc(/zegtrends.com/, function() {SubmitIfExists('#cln', 5);
      ClickIfExists('#bt1', 5);ClickIfExists('#go', 5);});
    BypassedByYacineTvPc(/coincroco.com|surflink.tech/, function() {
      waitForElm('.mb-sm-0.mt-3.btnBgRed', ccBtn => ccBtn.click());});
    BypassedByYacineTvPc(/bcvc.xyz|bcvc.ink/, function() {
      ClickIfExists('.js-scroll-trigger.btn-xl.btn-outline.btn', 3, 'setInterval');});
    BypassedByYacineTvPc(/proviralhost.com/, function() {
      ClickIfExists('#wait1button', 3);ClickIfExists('#wait2button', 5, 'setInterval');});
    BypassedByYacineTvPc(/bitcoinfaucet.fun|freebitcoin.win/, function() {
      ClickIfExists('#continue2', 3, 'setInterval');ClickIfExists('#continue', 4, 'setInterval');});
    BypassedByYacineTvPc(/bestadvise4u.com/, function() {ClickIfExists('.rd_btn', 1);
      waitForElm('.rd_btn', ba4 => redirect(ba4.href, false));});
    BypassedByYacineTvPc(/altblogger.net/, function() {
      ClickIfExists('.form-send.m-2.btn-captcha.btn-outline-primary.btn', 3, 'setInterval');});
    BypassedByYacineTvPc(/linkspy.cc/, function() {
      if (elementExists('.skipButton')) {let lsp = bp('.skipButton').href;redirect(lsp, false);}});
    BypassedByYacineTvPc(/(webhostingpost|tophostingapp|digitalmarktrend).com/, function() {
      SubmitIfExists('form.text-center', 3);ClickIfExists('#surl', 5, 'setInterval');});
    BypassedByYacineTvPc(/techmny.com|unblockedgames.world/, function() {SubmitIfExists('#landing', 2);
      ClickIfExists('#verify_button', 2);ClickIfExists('#two_steps_btn', 10);});
    BypassedByYacineTvPc(/(chooyomi|blogmado|kredilerim|insuranceleadsinfo).com/, function() {
      let bm = setInterval(() => {if (Captchacheck()) {clearInterval(bm); ClickIfExists('button.btn');}}, 1 * 1000);
      waitForElm('a.get-link.disabled a', cho => redirect(cho.href, false));});
    BypassedByYacineTvPc(/(kiktu|techcyan).com/, function() {let kkt = setInterval(() => {
      if (Checkvisibility(bp('.tick.wgicon'))) {clearInterval(kkt); ReadytoClick('.bottom_btn');}}, 1 * 1000);});
    BypassedByYacineTvPc(/fexkomin.xyz/, function() {
      $("a[target='_blank']").removeAttr("target");ClickIfExists('.btn-captcha.btn-danger.btn', 3);});
    BypassedByYacineTvPc(/100puan.com/, function() {
      ClickIfExists('.big-text', 3);waitForElm('div.bb-sticky-el a', pbz => redirect(pbz.href, false));});
    BypassedByYacineTvPc(/sub2get.com/, function() {
      if (elementExists('#butunlock')) {let subt = bp('#butunlock > a:nth-child(1)').href;redirect(subt);}});
    BypassedByYacineTvPc(/(fc-lc|loaninsurehub).com|fc-lc.xyz/, function() {ClickIfExists('#invisibleCaptchaShortlink', 3);
      ClickIfExists('#getlink', 3);ClickIfExists('#glink', 4);ClickIfExists('#surl', 5);});
    BypassedByYacineTvPc(/mneyvip.com/, function() {
      ClickIfExists('.get-link.btn-lg.btn-success.btn', 6);SubmitIfExists('.box-main > form:nth-child(1)', 1);});
    BypassedByYacineTvPc(/jobform.in/, function() {ClickIfExists('#scanURL', 1);
      ClickIfExists('#topClickButton', 1);ClickIfExists('#bottomClickButton', 27);});
    BypassedByYacineTvPc(/go.shareus.in/, function() {
      if (BpParams.has('shortid') && BpParams.has('link')) {meta(atob(BpParams.get('link')));}});
    BypassedByYacineTvPc(/playpaste.com/, function() {
      let pps = setInterval(() => {if (Captchacheck()) {clearInterval(pps);ClickIfExists('button.btn');}}, 1 * 1000);});
    BypassedByYacineTvPc(/suratresmi.id/, function() {
      ClickIfExists('button#hmn.btn-more', 3, 'setInterval');ClickIfExists('a#hmn.btn-more', 3, 'setInterval');});
    BypassedByYacineTvPc(/examkhata.com|gamelopte.com/, function() {
      ClickIfExists('#btn6', 3);waitForElm('a.yu-btn.yu-blue', exa => redirect(exa.href, false));});
    BypassedByYacineTvPc(/rancah.com|menjelajahi.com|shortly.xyz|nyawang.com/, function() {
      ClickIfExists('.get-link.btn-lg.btn-success.btn', 5, 'setInterval');});
    BypassedByYacineTvPc(/cryptotracker.space/, function() {
      let cts = setInterval(() => {if (Captchacheck()) {clearInterval(cts);SubmitIfExists('#form-continue');}}, 1 * 1000);});
    BypassedByYacineTvPc(/djxmaza.in/, function() {ClickIfExists('#dlbtn', 1);
      ClickIfExists('#downloadbtnf', 2);ClickIfExists('#downloadbtn', 3, 'setInterval');});
    BypassedByYacineTvPc(/stfly.me/, function() {
      if (elementExists('.g-recaptcha')) {} else {ClickIfExists('.form-send.m-2.btn-captcha.btn-outline-primary.btn', 3);}});
    BypassedByYacineTvPc(/khaddavi.net|contentmenarik.com/, function() {parent.open = BpBlock();
      setInterval(function() {if (Captchacheck()) {ClickIfExists('#slu-btn');}}, 500);});
    BypassedByYacineTvPc(/sapnogalpo.online/, function() {ClickIfExists('#link.tp-blue.tp-btn', 2);
      ClickIfExists('#btn6.tp-blue.tp-btn', 4, 'setInterval');waitForElm('a#btn6', sgp => redirect(sgp.href, false));});
    BypassedByYacineTvPc(/leitup.com/, function() {
      if (elementExists('#button_timer')) {waitForElm('input.form-control', leit => redirect(leit.placeholder, false));}});
    BypassedByYacineTvPc(/offeroc.com/, function() {let ofr = setInterval(() => {
        if (Captchacheck()) {clearInterval(ofr);ClickIfExists('.mt-2.btn-success.btn');}}, 1 * 1000);});
    BypassedByYacineTvPc(/azmath.info/, () => {if (elementExists('#megaurl-verified-captcha')) {
      ClickIfExists('button.h-captcha', 3);} else {SubmitIfExists('#megaurl-banner-page', 2);}});
    BypassedByYacineTvPc(/(nregajobcard|pradhanmantriupdates).in/, function() {
      setInterval(() => {ReadytoClick('#topButton.shrs_btn', 1); ReadytoClick('#bottomButton.shrs_btn', 2);}, 3 * 1000);});
    BypassedByYacineTvPc(/shortearn.net/, function() {parent.open = BpBlock();
      ClickIfExists('#appBtn', 1);ClickIfExists('#adBtn', 3, 'setInterval');ClickIfExists('#extensionBtn', 5, 'setInterval');});
    BypassedByYacineTvPc(/ez4mods.com|tech5s.co/, function() {SubmitIfExists('div.text-center form', 2);
      waitForElm('a#go_d.submitBtn.btn.btn-primary', ez => redirect(ez.href, false));
      waitForElm('a#go_d2.submitBtn.btn.btn-primary', ez2 => redirect(ez2.href, false));});
    BypassedByYacineTvPc(/(creditsalah|dissenttimes).com/, function() {ClickIfExists('#notarobot', 2, 'setInterval');
      let csh = setInterval(() => {if (Captchacheck()) {clearInterval(csh);ClickIfExists('#safesub');}}, 1 * 1000);waitForElm('a.safeb', csBtn => csBtn.click());});
    BypassedByYacineTvPc(/www.google.com|recaptcha.net/, async function() {await sleep(3000) && cfg.get('reCAPTCHA') && cfg.get('ApiKey');
      if (!APIKEY && cfg.get('reCAPTCHA') == true) {ReadytoClick('.recaptcha-checkbox-border');} else {}});
    BypassedByYacineTvPc(/newassets.hcaptcha.com/, async function() {await sleep(3000) && cfg.get('hCaptcha') && cfg.get('ApiKey');
      if (!APIKEY && cfg.get('hCaptcha') == true) {ReadytoClick('#checkbox');} else {}});
    BypassedByYacineTvPc(/alivedesktop.com/, function() {
      if (elementExists('#captcha-form')) {let alv = bp("input[name^='als']").value;
        let ald = bp("input[name^='safe']").value;redirect('https://rshrt.com/' + alv + '?api=' + ald, false);} else {}});
    BypassedByYacineTvPc(/(bnbfree|freeth|freebitco).in/, function() {if (elementExists('.h-captcha')) {let btc = setInterval(() => {
      if (Captchacheck()) {clearInterval(btc);ClickIfExists('#free_play_form_button');}}, 1 * 1000);} else {}});
    BypassedByYacineTvPc(/mazen-ve3.com/, function() {EnableRCF();let maze = setInterval(() => {
        if (bp('.filler').innerText == 'Wait 0 s') {clearInterval(maze);ReadytoClick('#btn6');ReadytoClick('.btn-success.btn', 1);}}, 2 * 1000);});
    BypassedByYacineTvPc(/mhma12.tech|hasri.xyz|soft3arbi.com/, function() {EnableRCF();let arbi = setInterval(() => {
        if (bp('.progress-done').innerText == '100%') {clearInterval(arbi);ReadytoClick('#continue-button');ReadytoClick('.btn-success.btn', 1);}}, 2 * 1000);});
    BypassedByYacineTvPc(/(120898|141989|161989|131989|121989|151989).xyz/, function() {if (elementExists('.g-recaptcha')) {let bitad = setInterval(() => {
      if (Captchacheck()) {clearInterval(bitad);SubmitIfExists('.mt-4');}}, 1 * 1000);} else {}});
    BypassedByYacineTvPc(/shortearn.net/, function() {parent.open = BpBlock();ClickIfExists('#adBtn', 3, 'setInterval');
      ClickIfExists('#appBtn', 1);ClickIfExists('button.btn.btn-primary.btn-block.btn-lg', 3);ClickIfExists('#extensionBtn', 5, 'setInterval');});
    BypassedByYacineTvPc(/(coinsward|blogsward).com|imbb.online/, async function() {if (elementExists('.g-recaptcha')) {var bw = bp("input[name=newwpsafelink]");
      redirect(JSON.parse(atob(bw.value)).linkr, false);} else {window.incrementRedirectCount(); await sleep(2000); window.handleButtonClick();}});
    BypassedByYacineTvPc(/1bit.space|mgnet.xyz/, function() {let bsp = setInterval(() => {if (captcha_solved) {ReadytoClick('button.button');clearInterval(bsp);}}, 2000);
      let mgn = setInterval(() => {if (captcha_solved && bp('button.button').innerText.includes('Get Link')) {ReadytoClick('button.button');clearInterval(mgn);}}, 2000);});
    BypassedByYacineTvPc(/bigbtc.win/, function() {if (elementExists('.h-captcha')) {let bb = setInterval(() => {
          if (Captchacheck()) {clearInterval(bb);ReadytoClick('#claimbutn');}}, 1 * 1000);} else {ClickIfExists('#clickhere', 2);}});
    BypassedByYacineTvPc(/firefaucet.win/, function() {if (elementExists("form[method='post']")) {let firefaucet = setInterval(() => {
      if (Captchacheck()) {ClickIfExists('button[type=submit]');}}, 2 * 1000);} else {ClickIfExists('#get_reward_button', 1);}});
    BypassedByYacineTvPc(/uptobhai\.*|uplinkto\.*|shortlinkto\.*/, function() { ClickIfExists('.btn-block.btn-primary.btn', 2);});
    BypassedByYacineTvPc(/tmail.io/, function() {
      if (elementExists('#next')) {SubmitIfExists('form.text-center', 3);} else {ClickIfExists('#surl', 5, 'setInterval');}});
    BypassedByYacineTvPc(/(exeo|exego).app|(mrgec|emxaw|ijvam).com/, function() {ClickIfExists('#invisibleCaptchaShortlink', 2);SubmitIfExists('#before-captcha', 3);
      let exeo = setInterval(() => {if (bp('.timer').innerText == '0') {clearInterval(exeo);ReadytoClick('#submit-button');}}, 2 * 1000);});
    BypassedByYacineTvPc(/(on-scroll|diudemy|maqal360).com/, function() {EnableRCF();let adlink = setInterval(() => {
        if (bp('#countdown').innerText == '0') {clearInterval(adlink);ReadytoClick('#append > :nth-child(1)');}}, 2 * 1000);});
    BypassedByYacineTvPc(/(forexrw7|forex-articles|3rabsports|fx-22).com|gold-24.net|bedrat.xyz|superapple.xyz|(maos4alaw|offeergames).online/, function() {
      ClickIfExists('.oto > a:nth-child(1)', 1); waitForElm('.oto > a', linkjust => redirect(linkjust.href, false));});
    BypassedByYacineTvPc(/(leaveadvice|mensventure).com/, function() {let lav = setInterval(() => {
        if (bp('#timer').innerText == '0') {ReadytoClick('#method_free.free-download-btn.download-btn');
          clearInterval(lav); if (!elementExists('.h-captcha')) window.openLink();}}, 2000);});
    BypassedByYacineTvPc(/itscybertech.com/, () => {let itscyber = setInterval(() => {if (Captchacheck()) {clearInterval(itscyber);
      ClickIfExists('.visit.medium.button');} else if (Checkvisibility(bp('#gtbtn2'))) {clearInterval(itscyber); window.fngo();}}, 1 * 1000);});
    BypassedByYacineTvPc(/jameeltips.us|cryptonworld.space/, function() {
      ClickIfExists('#alf_continue', 3, 'setInterval');});
    BypassedByYacineTvPc(/hynews.biz|chamcuuhoc.com/, function() {
      var bypasslinks = atob(`aH${bp("#landing [name='go']").value.split("aH").slice(1).join("aH")}`);redirect(bypasslinks);});
    BypassedByYacineTvPc(/tii.la|oei.la/, function() {if (elementExists('#link-view')) {
        let sbf = setInterval(function() {if (Captchacheck()) {clearInterval(sbf);ClickIfExists('#continue');}}, 500);}});
    BypassedByYacineTvPc(/skiplink.me/, function() {
      ClickIfExists('#alf_continue_captcha', 2);ClickIfExists('#alf_continue', 3, 'setInterval');});
    BypassedByYacineTvPc(/apanmusic.in/, function() {waitForElm('a#notarobot.button', ams => redirect(ams.href, false));
      ClickIfExists('#getlink', 3, 'setInterval');ClickIfExists('#gotolink', 30);});
    BypassedByYacineTvPc(/o-pro.online/, function() {waitForElm('#newbutton > a', opo => redirect(opo.href, false));
      waitForElm('a.btn.btn-default.btn-sm', opo2 => redirect(opo2.href, false));});
    BypassedByYacineTvPc(/(travelironguide|businesssoftwarehere|softwaresolutionshere|freevpshere).com/, function() {
      if (elementExists('.g-recaptcha')) {let trg = setInterval(() => {if (Captchacheck()) {clearInterval(trg);
            SubmitIfExists('#lview > form');}}, 1 * 1000);} else {waitForElm('.get-link > a', tig => redirect(tig.href, false));}});
    BypassedByYacineTvPc(/easyworldbusiness.com/, function() {
      if (elementExists('.g-recaptcha')) {waitForElm('a.yu-btn.yu-blue', ewb => redirect(ewb.href, false));} else {ClickIfExists('.yu-blue.yu-btn', 15);}});
    BypassedByYacineTvPc(/getzen.cash/, function() {if (elementExists('#form-claim-zen')) {let gzc = setInterval(() => {
          if (Captchacheck()) {clearInterval(gzc);ClickIfExists('.btn-claim');}}, 1 * 1000);} else {}});
    BypassedByYacineTvPc(/(kongutoday|proappapk|hipsonyc|teamtechnews).com|finsurances.co|yotrickslog.tech|animalwallpapers.online/, function() {
      if (BpParams.has('safe')) {meta(atob(BpParams.get('safe')));}});
    BypassedByYacineTvPc(/deportealdia.live|noweconomy.live|techgeek.digital/, function() {SubmitIfExists('div.text-center div form', 2);
      waitForElm('a#surl1.btn-main.get-link', dep => redirect(dep.href, false));});
    BypassedByYacineTvPc(/nishankhatri.xyz/, function() {waitForElm('#my-btn', nsk => redirect(nsk.href, false));
      ClickIfExists('#pro-continue', 3);ClickIfExists('#pro-btn', 5, 'setInterval');});
    BypassedByYacineTvPc(/writedroid.eu.org|modmania.eu.org|writedroid.in|mytop5.club/, function() {
      ClickIfExists('#shortPostLink', 3);waitForElm("#shortGoToLink", dro => redirect(dro.href, false));});
    BypassedByYacineTvPc(/computerpedia.in/, function() {ClickIfExists('.tp-blue.tp-btn-2', 3);
      let komp = setInterval(function() {if (Captchacheck()) {clearInterval(komp);ClickIfExists('#tp-snp2');}}, 500);});
    BypassedByYacineTvPc(/linkatla.com/, function() {let katla = bp('head > script:nth-child(7)');let linka = strBetween(katla.text, '"', '"');
      if (elementExists('#redirectButton')) {setTimeout(() => {redirect(atob(linka), false);}, 2 * 1000);}});
    BypassedByYacineTvPc(/myprivatejobs.com/, function() {
      if (elementExists('.g-recaptcha')) {ClickIfExists('#tp-snp2.tp-blue.tp-btn-2', 3);} else {SubmitIfExists("form[name='tp']", 3);}});
    BypassedByYacineTvPc(/claimfreetrx.online/, function() {SubmitIfExists('#molien', 2);ClickIfExists('#verify > .mb-2.btn-primary.btn-lg.btn', 3);});
    BypassedByYacineTvPc(/adclicker\.*|yourihollier.com/, function() {if (location.href.includes('url/')) {const adc = atob(atob(atob(location.hash.slice(1))));
      redirect(new URLSearchParams(adc).get('url'));} else {}});
    BypassedByYacineTvPc(/offers4crypto.xyz|ewall.biz/, function() {
      if (elementExists('.g-recaptcha')) {let ofc = setInterval(() => {if (Captchacheck()) {clearInterval(ofc);
            ClickIfExists('#submitBtn');}}, 1 * 1000);} else {}});
    BypassedByYacineTvPc(/dl.lk21static.xyz/, function() {
      if (!location.href.includes('get/') && location.pathname != '/') {location = location.href.replace('yz/', 'yz/get/');}});
    BypassedByYacineTvPc(/easylink.gamingwithtr.com/, function() {ClickIfExists('#countdown', 2);
      waitForElm('a#pagelinkhref.btn.btn-lg.btn-success.my-4.px-3.text-center', gtr => redirect(gtr.href, false));});
    BypassedByYacineTvPc(/copy-paste-fonts.com|cryptednews.space/, function() {
      if (elementExists('.g-recaptcha')) {let cpf = setInterval(() => {if (Captchacheck()) {clearInterval(cpf);
            ClickIfExists('form center button');}}, 1 * 1000);} else {setTimeout(() => {ClickIfExists('form center button');}, 11 * 1000);}});
    BypassedByYacineTvPc(/solarchaine.com/, function() {
      if (elementExists('#captchaShortlink')) {ClickIfExists('button.btn:nth-child(4)', 2);let sch = setInterval(() => {if (Captchacheck()) {clearInterval(sch);
            ClickIfExists('#invisibleCaptchaShortlink');}}, 1 * 1000);} else {SubmitIfExists('.box-body > form:nth-child(2)', 1);}});
    BypassedByYacineTvPc(/(remixsounds|helpowi|helpdeep|thinksrace|tipsloanusa).com|(remixone|webseriesreel).in|uprwssp.org|securitywaittimes.us/, function() {EnableRCF();
      ClickIfExists('.m-2.btn-captcha.btn-outline-primary.btn', 2);ClickIfExists('.tpdev-btn', 3);ClickIfExists("#tp98 button[class^='bt']", 3); SubmitIfExists("form[name='tp']", 3); ClickIfExists('#btn6', 4);});
    BypassedByYacineTvPc(/shrinke\.*|shrinkme\.*|(linkvhoriz|paid4link).com|bicolink.net|wordcounter.icu|pwrpa.cc|paylinks.cloud/, function() {let shk = setInterval(() => {
        if (Captchacheck()) {clearInterval(shk);ReadytoClick('#invisibleCaptchaShortlink');}}, 1 * 1000);});
    BypassedByYacineTvPc(/revly.click/, function() {
      if (elementExists('#link-view')) {let srl = setInterval(() => {if (Captchacheck()) {SubmitIfExists('#link-view');}}, 1 * 1000);} else {SubmitIfExists('div.col-md-12 form', 2);}});
    BypassedByYacineTvPc(/trangchu.news|downfile.site|(techacode|expertvn).com|azmath.info|aztravels.net|top10cafe.se/, function() {EnableRCF();
      let trangchu = setInterval(() => {if (bp('#monetiza-time').innerText == '0') {clearInterval(trangchu);ReadytoClick('#monetiza');} else if (elementExists('#monetiza-generate')) {window.monetizago();}}, 1 * 1000);});
    BypassedByYacineTvPc(/theconomy.me|(askpaccosi|halosenja|sainny|wellness4live).com|(2the|techbeast).space|(wikiversity|inicerita).online|cryptomonitor.in|break.id/, function() {
      var tform = bp('#landing');redirect(JSON.parse(atob(tform.newwpsafelink.value)).linkr, false);});
    BypassedByYacineTvPc(/(theconomy|nightfaucet).me|(imagenesderopaparaperros|linclik|up4cash|smoner|atglinks).com|happy-living.online|galaxy-link.space|oke.io|bitss.sbs|(forextrader|foxylinks).site|tinygo.co/, function() {
      if (elementExists('#link-view')) {let srl = setInterval(() => {if (Captchacheck()) {ClickIfExists('#invisibleCaptchaShortlink');}}, 1 * 1000);}});
    BypassedByYacineTvPc(/(blogscare|blogtechh|host2loan|techbixby).com|enit.in|clk.wiki|(oko|aii).sh|moonboom.net|lnbz.la|clk.kim/, function() {ClickIfExists('button.btn.btn-primary', 2);SubmitIfExists('#nextpage', 2);
      SubmitIfExists('#getmylink', 3);let enit = setInterval(function() {if (Captchacheck()) {clearInterval(enit);ClickIfExists('.btn-captcha.btn-primary.btn');}}, 500);});
    BypassedByYacineTvPc(/techyreviewx.com|desiupload.co/, function() {ClickIfExists('.downloadbtn.btn-block.btn-primary.btn', 2);
      waitForElm('a.btn.btn-primary.btn-block.mb-4', rex => redirect(rex.href, false));});
    BypassedByYacineTvPc(/(calmgram|adbitfly|blogsward).com|adbitfly.in/, function() {
      waitForElm('#continueBtn', afBtn => afBtn.click());ClickIfExists('#captcha-btn', 4, 'setInterval');
      ClickIfExists('.btn-captcha.btn-primary.btn', 8, 'setInterval');});
    BypassedByYacineTvPc(/shorterall.com/, function() {if (!elementExists('input[name=awnswer]') && !elementExists('#link-view')) {SubmitIfExists('div.col-md-12 form', 3);}
      if (elementExists('input[name=awnswer]')) {let strl = bp('input[name=awnswer]').getAttribute('placeholder').split('=')[0]; bp('input[name=awnswer]').value = BpCalc(strl); SubmitIfExists('div.col-md-12 form', 3);}
      if (elementExists('#link-view')) {let srl = setInterval(() => {if (Captchacheck()) {ReadytoClick('#invisibleCaptchaShortlink');}}, 1 * 1000);}});
    BypassedByYacineTvPc(/(exactpay|dinheirocrypto).online|videoclip.info|sproutworkers.co|coinsfaucet.fun/, function() {EnableRCF();window.onscroll = BpBlock();window.check2();if (elementExists('#verify')) {
        $('.blog-details').text('Please Answer the Maths Questions First ,Wait until Progress bar end, then Click the Red X Manually');
        elementReady('[name="answer"]').then(function(element) {element.addEventListener('change', window.check3);});}});
    BypassedByYacineTvPc(/(crypto4yu|manofadan|wiour).com|btcbitco.in|readbitcoin.org/, async function() {
      EnableRCF();await sleep(2000);window.check2();window.check3();ClickIfExists('button.btn.btn-primary.btn-lg');});
    BypassedByYacineTvPc(/(btcpany|zombiebtc|claimfey|thefastpost).com|(battleroyal|panytourism|statepany).online/, function() {
      parent.open = BpBlock();SubmitIfExists('#link1s-form', 1);ClickIfExists('#next-step-button', 3);});
    BypassedByYacineTvPc(/playnano.online/, function() {ClickIfExists('#watch-link', 2);
      ClickIfExists('.watch-next-btn.btn-primary.button', 2);ClickIfExists('button.button.btn-primary.watch-next-btn', 5, 'setInterval');});
    BypassedByYacineTvPc(/donia2tech.com|blog.techeysub.online|minersim.com/, function() {
      var form = document.getElementById('wpsafelink-landing');redirect(JSON.parse(atob(form.newwpsafelink.value)).linkr);});
    BypassedByYacineTvPc(/rekonise.com/, () => {let xhr = new XMLHttpRequest();
      xhr.onload = () => redirect(JSON.parse(xhr.responseText).url);
      xhr.open("GET", "https://api.rekonise.com/social-unlocks" + location.pathname, true);xhr.send();});
    BypassedByYacineTvPc(/acortalink.me/, () => {let acorta = setInterval(() => {let script = bp('body > script');
        if (script) {let text = script.text.trim(); let lines = text.split('\n'); let i = lines.findIndex(x => x.includes('acortalink.me'));
          let link = lines[i + 2].trim().split(',')[6].trim(); if (window[link]) {clearInterval(acorta); redirect(window[link]);}}}, 100);});
    BypassedByYacineTvPc(/teknosimple.com|besargaji.com/, function() {parent.open = BpBlock();ClickIfExists('#slu-link', 3);
      let tek = setInterval(function() {if (Captchacheck()) {clearInterval(tek);ClickIfExists('#slu-continue');}}, 500);});
    BypassedByYacineTvPc(/bloginkz.com/, function() {let bi = setInterval(function() {if (Captchacheck()) {clearInterval(bi);ClickIfExists('button.btn');}}, 500);
      waitForElm('a.get-link.disabled a', bli => redirect(bli.href));});
    BypassedByYacineTvPc(/bastinews.xyz/, function() {waitForElm('div#wpsafe-snp center a.btn-vip.bbtn-vip', bast => redirect(bast.href, false));
      waitForElm('div#main-content.mh-content center a', basti => redirect(basti.href, false));});
    BypassedByYacineTvPc(/autodime.com/, function() {
      let atd = setInterval(function() {if (Captchacheck()) {clearInterval(atd);ClickIfExists('#button1');}}, 500);
      waitForElm('a.btn-hover.color-1.btn-captcha', odim => redirect(odim.href, false));});
    BypassedByYacineTvPc(/amritadrino.com/, function() {
      if (elementExists('.g-recaptcha')) {waitForElm('body > b:nth-child(10) > center:nth-child(4) > a:nth-child(64)', amd => redirect(amd.href, false));} else {waitForElm('#tp-snp2', amBtn => amBtn.click());}});
    BypassedByYacineTvPc(/youtube.com/, function() {if (elementExists('#redirect-main-text')) {waitForElm('a#invalid-token-redirect-goto-site-button', yt => redirect(yt.href, false));} else {}});
    BypassedByYacineTvPc(/hunterkiller.me|surflink.tech/, function() {
      waitForElm('div#showw center a.btn.btn-danger.btn-captcha', hun => redirect(hun.href, false));
      waitForElm('div#wpsafe-snp center a', hunt => redirect(hunt.href, false));});
    BypassedByYacineTvPc(/coinhub.wiki/, function() {ClickIfExists('body > a:nth-child(1)', 2);
      ClickIfExists('#chl_cover', 2);ClickIfExists('#btn_verify', 4, 'setInterval');
      waitForElm('a.btn.btn-success', coi => redirect(coi.href, false));});
    BypassedByYacineTvPc(/lyricsbaazaar.com|ezeviral.com/, function() {
      let lyr = setInterval(function() {if (Captchacheck()) {clearInterval(lyr);ClickIfExists('#btn6');}}, 500);
      waitForElm('div.modal-content a', lyri => redirect(lyri.href, false));});
    BypassedByYacineTvPc(/(sekilastekno|miuiku|vebma|majalahhewan).com/, async function() {const executor = async () => {let El = window?.livewire?.components?.components()[0];
        while (!El) {await sleep(100); console.log(1); El = window?.livewire?.components?.components()[0];}
        const payload = {fingerprint: El.fingerprint, serverMemo: El.serverMemo, updates: [{payload: {event: 'getData', id: 'whathappen', params: [],}, type: 'fireEvent',}, ],};
        const response = await fetch(location.origin + '/livewire/message/pages.show', {headers: {'Content-Type': 'application/json', 'X-Livewire': 'true', 'X-CSRF-TOKEN': window.livewire_token,},
            method: 'POST', body: JSON.stringify(payload),}); const json = await response.json(); const url = new URL(json.effects.emits[0].params[0]); redirect(url.href);};
      if (location.host === 'wp.sekilastekno.com') {if (elementExists("form[method='post']")) {const a = bp("form[method='post']"); console.log('addRecord...'); const input = document.createElement('input');
          input.value = window.livewire_token; input.name = '_token'; input.hidden = true; a.appendChild(input); a.submit();}
      if (elementExists("button[x-text]")) { console.log('getLink..'); executor();} return;} if (elementExists("div[class='max-w-5xl mx-auto']")) {console.log('Executing..'); executor();}});
    BypassedByYacineTvPc(/coinsrev.com/, function() {parent.open = BpBlock();
      if (elementExists('.g-recaptcha')) {let csr = setInterval(() => {if (Captchacheck()) {clearInterval(csr);
            ClickIfExists('#wpsafelinkhuman > input');}}, 1 * 1000);} else {ClickIfExists('#wpsafe-generate > a > img', 3);ClickIfExists('input#image3', 13);}});
    BypassedByYacineTvPc(/zubatecno.com/, function() {if (elementExists('#mdncaptcha')) {let zbt = setInterval(() => {
          if (Captchacheck()) {clearInterval(zbt);ClickIfExists('#link1s-snp1');}}, 1 * 1000);} else {SubmitIfExists('#link1s-form', 3);}});
    BypassedByYacineTvPc(/(wooseotools|woowebtools).com/, function() {if (elementExists('.g-recaptcha')) {let wst = setInterval(() => {
          if (Captchacheck()) {clearInterval(wst);ClickIfExists('div form button');}}, 500);} else {ClickIfExists('div form button', 3, 'setInterval');}});
    BypassedByYacineTvPc(/adwerty.com/, function() {let adw = setInterval(() => {if (Captchacheck()) {clearInterval(adw);ClickIfExists('#hidden_btn');}}, 500);
      waitForElm('#hidden_btn', adw2 => redirect(strBetween(adw2.onclick.toString(), `window.open('`, `', '_blank')`)));});
    BypassedByYacineTvPc(/modebaca.com/, function() {if (elementExists('#recaptcha-element')) {
        let mb = setInterval(function() {if (Captchacheck()) {ClickIfExists('.btn-success.btn');}}, 500);} else {
        ClickIfExists('.btn-success.btn', 2);ClickIfExists('div > div > button', 7);}});
    BypassedByYacineTvPc(/shopforex.online/, function() {bp('#submitBtn').removeAttribute('href');if (elementExists('.g-recaptcha')) {let sfo = setInterval(() => {
          if (Captchacheck()) {clearInterval(sfo);ClickIfExists('#submitBtn');}}, 500);} else {
        ClickIfExists('.submitBtn', 2);ClickIfExists('#go_d', 3, 'setInterval');}});
    BypassedByYacineTvPc(/(pernahsukses|alpinecorporate).com|aoutoqw.xyz/, function() {if (elementExists('.g-recaptcha')) {let ps = setInterval(() => {if (Captchacheck()) {clearInterval(ps);
            ClickIfExists('#alf_continue_captcha');}}, 1 * 1000);} else {window.showScrollToGetLinkText(); SubmitIfExists('#alf_continue_form_outer', 3);}});
    BypassedByYacineTvPc(/altechen.com|entutes.com/, function() {parent.open = BpBlock();
      if (elementExists('.h-captcha')) {let ale = setInterval(() => {if (Captchacheck()) {clearInterval(ale);
            ClickIfExists('#cs-btn');}}, 1 * 1000);} else {ClickIfExists('button#cs-btn', 3, 'setInterval');}});
    BypassedByYacineTvPc(/freetrx.fun/, function() {if (elementExists('.g-recaptcha')) {let ftx = setInterval(() => {
          if (Captchacheck()) {clearInterval(ftx);ClickIfExists("input[id^='abc']");}}, 500);} else {
        setTimeout(() => {("input[id^='abc']").click();}, 5 * 1000);ClickIfExists('#subbutt', 5);}});
    BypassedByYacineTvPc(/socialwolvez.com/, () => {let xhr = new XMLHttpRequest();xhr.onload = () => redirect(JSON.parse(xhr.responseText).link.url);
      xhr.open("GET", "https://us-central1-social-infra-prod.cloudfunctions.net/linksService/link/guid/" + location.pathname.substr(7), true);xhr.send();});
    BypassedByYacineTvPc(/(mobi2c|healthy4pepole|healdad|world2our|mobitaak|te-it|businessnews-nigeria|govaf|fahmysport).com|(hightrip|fx-gd|world-trips|otechno|bluetechno|to-travel).net|(newforex|forexit).online/, function() {
      ClickIfExists('.submitBtn', 2);ClickIfExists('#go_d', 3);});
    BypassedByYacineTvPc(/anhdep24.com|nguyenvanbao.com|xemsport.com|byboe.com/, function() {
      if (elementExists('.g-recaptcha')) {let anh = setInterval(() => {if (Captchacheck()) {clearInterval(anh);
            ClickIfExists('#link1s-captcha');}}, 1 * 1000);} else {ClickIfExists('#link1s', 4, 'setInterval');ClickIfExists('#btn6', 3);}});
    BypassedByYacineTvPc(/traffic1s.com/, () => {let x = '.blog-content > p:nth-child(4) > strong:nth-child(1)';
      if (bp(x) && bp(x).innerHTML.includes('://')) {let i = strBetween(bp(x).innerHTML, '');let s = strBetween(i, '://', ' ');
        window.location.assign(`https://${s}?xref=https://google.com/&sl=${location.href}`);}});
    BypassedByYacineTvPc(/web1s.co|web1s.info|app.covemarkets.com/, function() {
      if (elementExists('.col-xxl-9')) {ClickIfExists('#submit', 3, 'setInterval');let webi = setInterval(function() {if (Captchacheck()) {clearInterval(webi);
            ClickIfExists('.fw-bold.btn-danger.btn-lg.btn');}}, 500);} else {SubmitIfExists('form.text-center', 1);}});
    BypassedByYacineTvPc(/suaurl.com/, function() {parent.open = BpBlock();
      let su = setInterval(function() {if (Captchacheck()) {bp('#comment_form').removeAttribute('target');clearInterval(su);
          ClickIfExists('#btn-capcha > .b-b', 1);}}, 500);ClickIfExists('#btn > button', 3, 'setInterval');});
    BypassedByYacineTvPc(/letsboost.net/, function() {waitForElm('body > script', () => {let stepDat = BpT('script')[BpT('script').length - 1];
      let stepname = stepDat.innerHTML;let lbDat = JSON.parse(stepname.match(/stepDat = '(.*)';/)[1]); let lbo = lbDat[lbDat.length - 1].url;redirect(lbo,false);});});
    BypassedByYacineTvPc(/web1s.asia/, function() {
      if (location.href.includes('api-mode/') || elementExists('.mb-20')) {SubmitIfExists('.submit-form', 3);ClickIfExists('#submit',3);} else if (!BpParamd.has('code')) {let iKey = '.mb-5.text-center.keyword-image', dWeb='fun88.info.vn';
      if (bp(iKey)) {if (bp(iKey).innerHTML.includes('7TmoFNC')) dWeb = 'hookeaudio.com'; if (bp(iKey).innerHTML.includes('81EoTp9')) dWeb = 'pennbookcenter.com';
      if (bp(iKey).innerHTML.includes('wYfNKAO')) dWeb = 'publicananker.com'; window.location.assign(`https://${dWeb}?xref=https://google.com/&wsa=${location.href}`);}
      if (elementExists('.col-xxl-9 > .text-center')) {let wa1 = setInterval(() => {if (Captchacheck()) {clearInterval(wa1);SubmitIfExists('form.text-center');}}, 1 * 1000);}
      if (elementExists('.col-xxl-9 > .text-center') && !elementExists('.g-recaptcha')) {ClickIfExists('#submit',3);}} else if (BpParamd.has('code')) {ClickIfExists('#submit-button');
      let inp = 'input.form-control:nth-child(2)', btn = 'form.submit-form:nth-child(2) > button:nth-child(16)'; if (bp(inp)) { bp(inp).value = decodeURIComponent(BpParamd.get('code')); ClickIfExists(btn,2); }}});
    BypassedByYacineTvPc(/(hookeaudio|pennbookcenter|publicananker|fun88bk).com|fun88.info.vn/, function() {RemoveRef('https://google.com');
      if (BpParams.has('xref') && BpParams.has('wsa')) {let b = '.textwidget button', pLink = `li.menu-item > a:nth-child(1)`, gDiv = 'p > div > div', tCode;
      setTimeout(() => {if (bp(b) && bp(b).innerText.includes('CONTINUE')) {bp(b).click();}}, 3000);
      let pClick = setInterval(() => {if (bp(b) && bp(b).innerHTML.includes(`ANY PAGE TO GET`)) {bp(pLink).href = bp(pLink).href + document.location.search;
            bp(pLink).click();clearInterval(pClick);}}, 2000);
      let gCode = setInterval(() => {if (bp(gDiv) && !bp(gDiv).innerText.includes('ontinue after')) {tCode = strBetween(bp(gDiv).parentElement.innerHTML, `!important;">`, `<svg`, true);
      window.location.assign(`${decodeURIComponent(BpParamd.get('wsa'))}?code=${tCode}`); clearInterval(gCode);}}, 2000);}});
    BypassedByYacineTvPc(/stfly.cc|stfly.xyz|techtrendmakers.com|(blogbux|blogesque|exploreera).net/, function() {if (elementExists('.g-recaptcha') || elementExists('.h-captcha')) {
        let stf = setInterval(() => {if (Captchacheck()) {clearInterval(stf);ReadytoClick('.form-send.m-2.btn-captcha.btn-outline-primary.btn');}}, 500);} else {
        ClickIfExists('.form-send.m-2.btn-captcha.btn-outline-primary.btn', 3, 'setInterval');}});
    BypassedByYacineTvPc(/coins-town.com/, function() {ClickIfExists('#claimCoins > button[data-bs-toggle="modal"]', 2);
      ClickIfExists('a[href*="play.php?"]', 2);if (document.referrer.includes('/?cashando=')) {
        window.location.assign(`https://coins-town.com/play.php?game=20966`);} else if (elementExists('#claimCoins')) {bp('#claimCoins').style.display = '';}});
    BypassedByYacineTvPc(/slinkware.com|aghtas.com|youssefsayed.com|alghtas.xyz|newworldnew.com|tackaway.com/, function() {EnableRCF();
      let sw = setInterval(() => {if (Captchacheck()) {clearInterval(sw); ClickIfExists('.hidden-continue-button');}}, 1 * 1000); waitForElm('#yuidea-btmbtn', swBtn => swBtn.click());});
    BypassedByYacineTvPc(/link.goto.com.np|(appkamods|bankvacency|mealcold|otomi-games).com/, () => {
      waitForElm('div#wpsafe-link a', bitz => redirect(bitz.href, false));
      waitForElm('#wpsafe-link input', bit2 => redirect(strBetween(bit2.onclick.toString(), `window.open('`, `', '_blank')`), false));});
    BypassedByYacineTvPc(/hamrolekh.com|(mgame|oncoin).info|lifeinsurancesblog.xyz|nishankhatri.com.np|quanngon.org/, function() {
      ClickIfExists('#my-btn', 2);ClickIfExists('#wpsafe-link > .btn-secondary.btn', 2);
      waitForElm('#pro-link', nhk => redirect(nhk.href, false));waitForElm('#wpsafe-link a', hrl => redirect(strBetween(hrl.onclick.toString(), `window.open('`, `', '_self')`), false));});
    BypassedByYacineTvPc(/(lootlinks|onepiecered).co|(loot-links|links-loot|loot-link|edprivatedqu|stownrusis|ebaticalfel|mega-guy|utopianleaks|eofmukindwo|realiukzemydre|kmendation|bstlar).com|(lootdest|lootlink|best-links).org|lootdest.info|linksloot.net|free-content.pro/, function() {
      if (/^\/([^\/]+)/.test(location.pathname)) {redirect('https://adbypass.org/bypass?bypass=' + location.href, false);}});
    BypassedByYacineTvPc(/(ashrfd|tpayr|poqzn|ashrfd|rezsx|tryzt|rezst|erzar|waezm|waezg).xyz|(tiktokrealtime|dawenet|vivuq|swgop|vbnmll).com|(sinonimos|antonimos).de|quesignifi.ca|tiktokcounter.net|(lifgam|telcoinfo).online|blackwoodacademy.org|cryptednews.space|mobprice.shop/, function() {
      let profitsfly = setInterval(() => {if (elementExists('.h-captcha') && Captchacheck() && bp('#cbt').innerText == 'Continue') {ClickIfExists('.btn-primary.btn-primarybtn.btn', 1);ClickIfExists('.btn-primary.btn-warningbtn.btn', 1);clearInterval(profitsfly);
          ReadytoClick('.btn-primary.btn-primarybtn.btn', 2);ReadytoClick('.btn-primary.btn-warningbtn.btn', 2);} else if (!elementExists('.h-captcha') && bp('#cbt').innerText == 'Continue') {clearInterval(profitsfly);ReadytoClick('.btn-primary.btn-primarybtn.btn', 1);
          ReadytoClick('.btn-primary.btn-warningbtn.btn', 1);}}, 2 * 1000);});
    BypassedByYacineTvPc(/(awgrow|fadedfeet|kenzo-flowertag|homeculina|ineedskin|alightmotionlatest|auntmanny|mytechcontent|techymatic|gamedouc).com|worldtanr.xyz|lawyex.co|yexolo.net|mdn.lol|(aayurvedshastra|allnewspoint).in|chefslink.org/, () => {EnableRCF();
      if (elementExists('.g-recaptcha')) {let mdn = setInterval(() => {if (Captchacheck()) {clearInterval(mdn);BypassHD('form[action]', 1);}}, 1 * 1000);} else {setTimeout(() => {BypassHD(GetForm('mdn'));}, 17 * 1000);}});
    BypassedByYacineTvPc(/shortit.pw/, function() {if (elementExists('.bg-light.container')) {
        $('.text-center.text-muted').text('IMPORTANT Note By YacineTvPc : Please Solve the Hcaptcha for Automatically , Dont Solve the Solvemedia . Regards...');}
      ClickIfExists('.pulse.btn-primary.btn', 3);let sorti = setInterval(function() {if (Captchacheck()) {clearInterval(sorti);ClickIfExists('#btn2');}}, 500);});
    BypassedByYacineTvPc(/short.croclix.me|adz7short.space/, function() {setInterval(function() {if ($("#link").length > 0) {ReadytoClick("#link");}}, 500);
      setInterval(function() {if ($("input#continue").length > 0) {ReadytoClick("input#continue");} if ($("a#continue.button").length > 0) {ReadytoClick("a#continue.button");}}, 9000);
      setTimeout(function() {if ($("#btn-main").length < 0) return;ReadytoClick("#btn-main");}, 5000);});
    BypassedByYacineTvPc(/linkvip.io/, async function() {var campId = (await elementReady('input[name="campId"]')).value;
      var linkId = (await elementReady('input[name="linkId"]')).value;console.log(campId, linkId);var frmData = new FormData();
      frmData.append('campId', campId);var res = await fetch('https://linkvip.io/graph/api?action=getCodeCamp', {method: 'POST', body: frmData,});
      var data = await res.json(); if (!data.status) return console.error('getCodeCamp');var codeOTP = data.message;var frmDataf = new FormData();
      frmDataf.append('campId', campId);frmDataf.append('linksId', linkId);frmDataf.append('codeOTP', codeOTP);
      var dataf = await fetch('https://linkvip.io/graph/api?action=confirmCode', {method: 'POST', body: frmDataf,}).then(res => res.json());
      if (!dataf.status) return console.error('confirmCode');redirect(dataf.message);});
    BypassedByYacineTvPc(/adshnk.com|adshrink.it/, () => {let adsh = setInterval(() => {
        if (typeof window._sharedData == "object" && 0 in window._sharedData && "destination" in window._sharedData[0]) {clearInterval(adsh);
          document.write(window._sharedData[0].destination);redirect(document.body.textContent);
        } else if (typeof window.___reactjsD != "undefined" && typeof window[window.___reactjsD.o] == "object" && typeof window[window.___reactjsD.o].dest == "string") {clearInterval(adsh);redirect(window[window.___reactjsD.o].dest);}});});
    BypassedByYacineTvPc(/vikashmewada.com|videoslyrics.com|crazysonglyrics.com|videolyrics.in|newsharsh.com|trxking.xyz|crazyblog.in|getdashcoin.io/, () => { parent.open = BpBlock();waitForElm('.py-2.bg-blue-600', tBtn => tBtn.click());
      waitForElm('form:nth-child(1) > a:nth-child(3)', vBtn => vBtn.click());waitForElm('button.py-2:nth-child(3)', bBtn => bBtn.click()); waitForElm('div > a.py-2.bg-blue-600', crb => redirect(crb.href, false));
      let craz = setInterval(() => {if (elementExists('button.py-2')) {clearInterval(craz); SubmitIfExists('div.rounded > div:nth-child(9) > form:nth-child(1)', 2);}}, 500);});
    BypassedByYacineTvPc(/ify.ac/, function() {window.open_href();});
    BypassedByYacineTvPc(/lanza.me/, () => waitForElm('a#botonGo', lz => redirect(lz.href, false)));
    BypassedByYacineTvPc(/lifeezee.com/, () => waitForElm('.get-link', lifz => redirect(lifz.href)));
    BypassedByYacineTvPc(/lolinez.com/, () => waitForElm('p#url a', lol => redirect(lol.href, false)));
    BypassedByYacineTvPc(/sahityt.com/, () => waitForElm('a#tp-snp2', sht => redirect(sht.href, false)));
    BypassedByYacineTvPc(/file-upload.in/, () => waitForElm('#getlink', fui => redirect(fui.href, false)));
    BypassedByYacineTvPc(/upmienphi.com/, function() {waitForElm('.download-link', upBtn => upBtn.click());});
    BypassedByYacineTvPc(/linksly.co/, () => waitForElm('div.col-md-12 a', lsl => redirect(lsl.href, false)));
    BypassedByYacineTvPc(/cashando.me/, () => waitForElm('#goCoinsTown', cash => redirect(cash.href, false)));
    BypassedByYacineTvPc(/appsinsta.com/, function() {waitForElm('.yu-blue.yu-btn', apBtn => apBtn.click());});
    BypassedByYacineTvPc(/apkadmin.com/, () => waitForElm('div.text.text-center a', apk => redirect(apk.href)));
    BypassedByYacineTvPc(/sugarona.com/, function() {waitForElm('a#my-btn', sgr => redirect(sgr.href, false));});
    BypassedByYacineTvPc(/cekip.site/, () => waitForElm('a#aGo.badge.bg-success', cek => redirect(cek.href, false)));
    BypassedByYacineTvPc(/techleets.xyz/, () => waitForElm('#tp-snp2 > center > a', tle => redirect(tle.href, false)));
    BypassedByYacineTvPc(/newsturbovid.com/, () => waitForElm('#start-download > a', ntv => redirect(ntv.href, false)));
    BypassedByYacineTvPc(/amanguides.com/, () => waitForElm('#wpsafe-link > .bt-success', ag => redirect(ag.href, false)));
    BypassedByYacineTvPc(/mirrored.to/, () => waitForElm('div.col-sm.centered.extra-top a', mir => redirect(mir.href, false)));
    BypassedByYacineTvPc(/flybid.net/, () => waitForElm('a#continue-button.continue-button', flb => redirect(flb.href, false)));
    BypassedByYacineTvPc(/8tm.net/, () => waitForElm('a.btn.btn-secondary.btn-block.redirect', tm => redirect(tm.href, false)));
    BypassedByYacineTvPc(/cpmlink.net/, () => waitForElm('a#btn-main.btn.btn-warning.btn-lg', cpm => redirect(cpm.href, false)));
    BypassedByYacineTvPc(/noodlemagazine.com/, () => waitForElm('a#downloadLink.downloadBtn', mag => redirect(mag.href, false)));
    BypassedByYacineTvPc(/huongdanvuotlink123.blogspot.com/, () => waitForElm('a.in-cell-link', hdv => redirect(hdv.href, false)));
    BypassedByYacineTvPc(/maxurlz.com/, () => waitForElm('a.btn.btn-success.btn-lg.flip.animated', maxu => redirect(maxu.href, false)));
    BypassedByYacineTvPc(/sama-pro.com|mikl4forex.com|dr-forex.com/, () => waitForElm('a#submitBtn', smpb => redirect(smpb.href, false)));
    BypassedByYacineTvPc(/mohtawaa.com/, () => waitForElm('a.btn.btn-success.btn-lg.get-link.enabled', moht => redirect(moht.href, false)));
    BypassedByYacineTvPc(/linksae.com/, function() {waitForElm('a.btn.btn-success.btn-lg.flip.animated', lsa => redirect(lsa.href, false));});
    BypassedByYacineTvPc(/sub2unlock.com/, function() {if (location.href.includes('/unlock')) {waitForElm('a#link', s2l => redirect(s2l.href, false));}});
    BypassedByYacineTvPc(/thebloggerspoint.in|ezeviral.com|fixno.in|technocubes.in/, () => waitForElm('#wpsafe-snp > a', tbs => redirect(tbs.href, false)));
    BypassedByYacineTvPc(/rockmods.net/, function() {if (location.href.includes('/rblink.html') && BpParams.has('url')) {meta(atob(BpParams.get('url')));}});
    BypassedByYacineTvPc(/doodjob.com/, () => waitForElm('a.linky.buttonpanel.buttonpanel-block.btn-lg.get-link.disabled', doo => redirect(doo.href, false)));
    BypassedByYacineTvPc(/xonnews.net|toilaquantri.com|share4u.men|camnangvay.com/, () => waitForElm('div#traffic_result a', xon => redirect(xon.href, false)));
    BypassedByYacineTvPc(/yosite.net/, () => waitForElm('.options_layout_container > center:nth-child(17) > a:nth-child(1)', yos => redirect(yos.href, false)));
    BypassedByYacineTvPc(/offrcms.xyz|kooora365.online|tourismtravels4.sbs|5tl.co|mamahawa.com/, () => waitForElm('a#proceed', offr => redirect(offr.href, false)));
    BypassedByYacineTvPc(/geniussolutions.co|pokemonroms.cc|alightmotionlatest.com/, () => waitForElm('a#SecondPageBottomButton', gsc => redirect(gsc.href, false)));
    BypassedByYacineTvPc(/cricketgurupro.com/, function() {SubmitIfExists("form[name='tp']", 3);waitForElm('#page > center > a', cgp => redirect(cgp.href, false));});
    BypassedByYacineTvPc(/bluemedialink.online|bluemediafile\.*/, function() {if (BpParams.has('url')) {waitForElm('input#nut[src]', blum => blum.parentNode.submit());}});
    BypassedByYacineTvPc(/boost.ink/, () => fetch(location.href).then(bo => bo.text()).then(html => redirect(atob(html.split('bufpsvdhmjybvgfncqfa="')[1].split('"')[0]))));
    BypassedByYacineTvPc(/blog.textpage.xyz/, () => waitForElm('#wpsafe-link1 a', bt => redirect(strBetween(bt.onclick.toString(), `window.open('`, `', '_blank')`), false)));
    BypassedByYacineTvPc(/foodupe.com/, function() {if (elementExists('.containerpanel')){let fdp = bp('#donead').href;setTimeout(() => {redirect(fdp,false);}, 2 * 1000);}});
    BypassedByYacineTvPc(/freethailottery.live/, function() {if (elementExists('.g-recaptcha')){let ftl = ReadCV('JSON_fetch');setTimeout(() => {redirect(ftl,false);}, 2 * 1000);}});
    BypassedByYacineTvPc(/udrop.com/, () => waitForElm('.responsiveMobileMargin > button:nth-child(1)', udr => redirect(strBetween(udr.onclick.toString(), `openUrl('`, `')`), false)));
    BypassedByYacineTvPc(/nulledlist.info|earnash.com|my-coins.xyz|earn-bitcoin.online|zimabadko.com|vidoza.xyz|every-crypto.info/, () => waitForElm('div#getlinkbtn center a', kalv => redirect(kalv.href, false)));
    BypassedByYacineTvPc(/sub2unlock.net/, function() {if (elementExists('.linkDiv_btns.col-xs-12.col-sm-12.col-md-12')){let stu = bp('#theLinkID').textContent;setTimeout(() => {redirect(stu,false);}, 2 * 1000);}});
    BypassedByYacineTvPc(/(starxinvestor|hit-films|sevenjournals).com|(iisfvirtual|bookszone|learnmany).in/, function() {SubmitIfExists("form[name='tp']", 3); waitForElm('a#btn6', bkz => redirect(bkz.href, false));});
    BypassedByYacineTvPc(/(financenube|mixrootmods|pastescript|trimorspacks|apklox).com|updrop.link/, () => {waitForElm('#wpsafe-link a', cdr => redirect(strBetween(cdr.onclick.toString(), `window.open('`, `', '_self')`), false));});
    BypassedByYacineTvPc(/ronakfitness.com/, function() {if (elementExists('.containerpanel')){let rft = bp('a.linky.buttonpanel.buttonpanel-block.btn-lg.get-link.disabled').href;setTimeout(() => {redirect(rft,false);}, 2 * 1000);}});
    BypassedByYacineTvPc(/mboost.me/, function() {if (elementExists('#firstsection')){let mbo = bp('#__NEXT_DATA__');let mbm = JSON.parse(mbo.textContent).props.pageProps.data.targeturl;setTimeout(() => {redirect(mbm,false);}, 2 * 1000);}});
    BypassedByYacineTvPc(/(disheye|kreatifparenting|phimne|admediaflex|cdrab).com|(gurumu|wpcheap|izseo|adcrypto|daycash).net|(sportweb|ecq|mgame|oncoin).info|savego.org|hbz.us|(djqunjab|alpha-links).in|datacheap.io/, () => waitForElm('#wpsafelink-landing > input', dis => redirect(JSON.parse(atob(dis.value)).linkr, false)));
    BypassedByYacineTvPc(/readi.online|mbantul.my.id|blog.qnix.me|videoclip.info|moddingzone.in|crypto-fi.net|claimcrypto.cc|xtrabits.click|(cempakajaya|web9academy|onlineincoms|allsoftdrivers|tribuncrypto|poketoonworld|bioinflu|pubgquotes|bico8).com|(techleets|ourcoincash|studyis|healthysamy).xyz/, function() {
      var bypasslink = atob(`aH${bp("#landing [name='go']").value.split("aH").slice(1).join("aH")}`); redirect(bypasslink, false);});
    BypassedByYacineTvPc(/aiimgvlog.fun/, function() {EnableRCF(); window.onload = setInterval(() => {if (elementExists('.h-captcha') && Checkvisibility(bp('.h-captcha'))) {BypassHD('#overlay', 1);} if (elementExists("div[id^='count']") && bp("div[id^='count']").innerHTML == 0) {ReadytoClick('input:nth-of-type(3)', 1);}}, 1 * 1000);
        if (elementExists('input.form-control')) {window.onscroll = BpBlock();window.check2(); $('#clickMessage').text('Please Answer the Maths Questions First ,Wait until Progress bar end, then Click the Red X Manually'); elementReady('[name="answer"]').then(function(element) {element.addEventListener('change', window.check3);});}});
    BypassedByYacineTvPc(/dutchycorp.space|dutchycorp.ovh|gtlink.co|seulink.digital|oii.io|hamody.pro|fileku.net|metasafelink.site|(beingtek|fc-lc|10short).com|(zagl|shrinkforearn).in|(kiiw|wordcounter).icu|pwrpa.cc|shurt.pw|(flyad|tapnip).vip|antonimos.de|seulink.online|pahe.plus/, function() {
      if (elementExists('.grecaptcha-badge') || elementExists('#captchaShortlink')) {var ticker = setInterval(function() {try {clearInterval(ticker); window.grecaptcha.execute();} catch (e) {}}, 3000);}});
    BypassedByYacineTvPc(/dutchycorp.ovh|beast.ink|ckk.ai|onelinks.nl|(viewfr|shortzon|techsamir|ufacw|gawbne|bitcoinwinco|liinkat|links.apksvip|namaidani|cutpaid|link1s|postazap|yeifly|kiddyshort|shtfly|cortaly|makemoneywithurl|mtraffics|dz4link|dz-linkk).com|(tmearn|namaidani|cutearn|ccurl|link3s|youshort|illink).net|(s2fly|pglink|snaply|megaurl|megafly|linksbanao).in|(wez|shortlinks).info|(shrink|flyzu).icu|(24payu|vielink).top|(terafly|hatelink|cashando|zumpa|tlin|weezo|adnews|botfly|linkdam|ar-goal).me|(jameeltips|mitly).us|(forexly|goldly|insurancly).cc|(beycoin|aku2x|moinsider|satoshi-win).xyz|(wedocrypto|yourtechnology|clickmais|flylinks).online|(short1|urlcash|dglinks).site|(shrinkme|tfly).link|(playstore|adsy|clik|shurt).pw|short.express|cryptosh.pro|goo.st|(payskip|shrinkurl).org|cryptotracker.space|shortearn.eu|clicklink.fun|(lootcash|tapnip).vip|addurl.biz/, function() {parent.open = BpBlock();
      if (elementExists('.g-recaptcha') || elementExists('#captchaShortlink')) {let frm = setInterval(() => {if (Captchacheck()) {clearInterval(frm);SubmitIfExists('#link-view');}}, 1 * 1000);} else {let FMode = ['#link-view', '#form-continue', '.col-md- > form', '#nextstepform', '#submit-form', '.text-center.row > form', 'div.col-md-6 form', 'div.col-md-12 form', 'div.text-center form', '#before-captcha', '#yuidea', '#exfoary-form', '#submit_first_page', '#hidden form', '#test', 'form.text-center'];for (let i = 0; i < FMode.length; i++) {SubmitIfExists(FMode[i],2);}}});
    BypassedByYacineTvPc(/autofaucet.dutchycorp.space/, function() {let autoRoll = false; if (window.location.href.includes('/roll.php')) {window.scrollTo(0, 9999);
      if (!bp('#timer')) {setInterval(() => {if (Captchacheck()) {if (bp('.boost-btn.unlockbutton') && autoRoll === false) {bp('.boost-btn.unlockbutton').click();autoRoll = true;}if (Checkvisibility(bp('#claim_boosted'))) {bp('#claim_boosted').click();}}}, 3 * 1000);} else { setTimeout(() => {window.location.replace('https://autofaucet.dutchycorp.space/coin_roll.php');}, 3 * 1000);}}
      if (window.location.href.includes('/coin_roll.php')) {window.scrollTo(0, 9999);if (!bp("#timer")) {setInterval(() => {if (Captchacheck()) {if (bp('.boost-btn.unlockbutton') && autoRoll === false) {bp('.boost-btn.unlockbutton').click();autoRoll = true;}
      if (Checkvisibility(bp('#claim_boosted'))) {bp('#claim_boosted').click();}}}, 3 * 1000);} else { setTimeout(() => {window.location.replace('https://autofaucet.dutchycorp.space/ptc/wall.php');}, 3 * 1000);}} if (window.location.href.includes('/ptc/wall.php')) {var ptcwall = BpAll(".col.s10.m6.l4 a[name='claim']");
      if (ptcwall.length >= 1) {ptcwall[0].style.backgroundColor = 'red'; let match = ptcwall[0].onmousedown.toString().match(/'href', '(.+)'/);let hrefValue = match[1];
      setTimeout(() => {window.location.replace('https://autofaucet.dutchycorp.space' + hrefValue);}, 3 * 1000);} else {if (Checkvisibility !== null) {setTimeout(() => {window.location.replace('https://autofaucet.dutchycorp.space/ptc/');}, 3 * 1000);}}}
      if (location.href.includes('autofaucet.dutchycorp.space/ptc/')) {console.log('Viewing Available Ads'); if (elementExists('.fa-check-double')) {console.log('All Available Ads Watched'); setTimeout(() => {window.location.replace('https://autofaucet.dutchycorp.space/dashboard.php');}, 3 * 1000);}
      setInterval(() => {if (Checkvisibility(bp('#submit_captcha'))) {bp("button[type='submit'].g-recaptcha").click();}}, 5 * 1000);}}); const headers = {"Content-Type": "application/json", "apikey": APIKEY};
    elementReady('iframe[data-hcaptcha-response]').then(async function(element) {if (!APIKEY || !Checkvisibility(element) || !cfg.get('hCaptcha')) return;
    const settings = Object.fromEntries(new URLSearchParams(element.src)); let data = await Request("https://token.nocaptchaai.com/token", { method: "POST", headers,
    data: JSON.stringify({url: settings.host, type: "hcaptcha", sitekey: settings.sitekey, softid: "YacineTvPc-diego"})}); const url = data.url;
    while (data.status != "processed") {await sleep(1); data = await Request(url, { headers, responseType: 'json'}); console.log(data);}
    window.postMessage(JSON.stringify({ "source": "hcaptcha", "label": "challenge-closed", "id": settings.id, "contents": { "event": "challenge-passed", "response": data.token, "expiration": 120}}));});
    elementReady('[name=adcopy_response]').then(function (element) {
    const PHRASES = ['1.21 gigawatts', '4 8 15 16 23 42', '5 dollar shake', '6 feet of snow', '8th chevron', 'a wild captcha appears', 'abelian grape', 'abide with me', 'abracadabra', 'absent without leave', 'absolute zero', 'accidentally on purpose', 'ace of spades', 'across the board', 'adapt improve', 'adapt improve succeed', 'against the grain', 'agree to disagree', 'al capone', 'all dancing', 'all grown up', 'all of the above', 'all singing', 'all your base', 'allergic reaction', 'almost got it', 'always there', 'am i happy', 'anchors away', "and that's the way it is", 'angel food', 'another castle', 'anti dentite', 'apple juice', 'apple pie', 'apple sauce', 'april may', 'april showers', 'are we there yet', 'are you ready', 'are you the keymaster', 'army training', 'army training sir', 'around here', 'as i see it', 'as you wish', 'ask questions', 'attila the hun', 'auto driving', 'awesome dude', 'awesome sauce', 'azgoths of kria', 'babel fish', 'baby blues', 'baby boomer', 'baby steps', 'back to basics', 'back track', 'background noise', 'bacon and eggs', 'bad books', 'bad egg', 'bait the line', 'baked in a pie', 'bald eagle', 'ball of confusion', 'banana bread', 'banana split', 'banana stand', 'bangers and mash', 'barber chair', 'barking mad', 'basket case', 'bated breath', 'bath towel', 'bath water', 'battle royale', 'bazinga', 'be careful', 'be mine', 'be my friend', 'be nice', 'be nimble be quick', 'be serious now', 'beach ball', 'bean town', 'beans and rice', 'beautiful friendship', 'bee line', 'been there', 'beer in a bottle', 'beer in the bottle', 'bees knees', 'beg the question', 'believe me', 'belt up', 'berlin wall', 'best fit line', 'best seller', 'better call saul', 'better half', 'better next time', 'beyond me', 'big brother', 'big kahuna burger', 'big nose', 'big screen', 'bigger in texas', 'bike rider', 'bird cage', 'birthday boy', 'birthday girl', 'bizarro jerry', 'black and white', 'black coffee', 'black gold', 'black jack', 'black monday', 'blahblahblah', 'blaze a trail', 'bless you', 'blinded by science', 'blog this', 'blood type', 'blue cheese', 'blue ribbon', 'blue sky', 'bob loblaw', 'body surfing', 'boiled cabbage', 'bon voyage', 'bond james bond', 'bone dry', 'bonus points', 'bonus round', 'book reading', 'book worm', 'boomerang', 'born to run', "bots are bad m'kay", 'bottled water', 'bowties are cool', 'box jelly fish', 'box kitty', 'box of chocolates', 'braaains', 'brand spanking new', 'bread of life', 'break the ice', 'brick house', 'broken heart', 'broken record', 'bruce lee', 'brush your teeth', 'buckle your shoe', 'buffalo wing', 'bunny rabbit', 'burger with fries', 'burning oil', 'burnt sienna', 'butler did it', 'butter side down', 'button fly', 'buy some time', 'by and large', 'by the board', 'by the book', 'by the seashore', 'cabbage borsht', 'cabbage stew', 'caesar salad', 'call me', 'call me maybe', 'can i love', 'can you see', 'candy apple', 'candy cane', 'capital gain', 'captcha in the rye', 'car trouble', 'carbon copy', 'carbon footprint', 'card sharp', 'card-sharp', 'carpe diem', 'carry a towel', 'carry on', 'cary grant', 'case closed', 'cat got your tongue', 'catch the man', 'cats and dogs', 'cats pajamas', 'chaise lounge', 'challenge accepted', 'change the world', 'change yourself', 'channel surfing', 'charley horse', 'charlie bit me', 'charm offensive', 'charmed life', 'check your coat', 'check your work', 'cheese burger', 'cheese fries', 'cheese steak', 'cherry on top', 'chicken feed', 'chicken noodle', 'chicken salad', 'chicken soup', 'chin boy', 'chit chat', 'choco lazer boom', 'chocolate cookie', 'chocolate milk', 'chow down', 'chuck norris', 'circle of life', 'civil war', 'clean and shiny', 'clean hands', 'clear blue water', 'clear sailing', 'click, click, click', 'cliff hanger', 'clod hopper', 'close quarters', 'cloud nine', 'clown around', 'coffee can', 'cold comfort', 'cold feet', 'cold hat', 'cold shoulder', 'cold turkey', 'coleslaw', 'collaborate and listen', 'colored paper', 'come along', 'come along pond', 'come back', 'come clean', 'come on down', 'come what may', 'comfort zone', 'comma comma', 'common law', 'complex number', 'construction ahead', 'cookie cutter', 'cool heads prevail', 'cop an attitude', 'cor blimey', 'cordon bleu', 'corned beef', 'cotton on', 'count your change', 'counting sheep', 'covered bridge', 'crab cake', 'crayola', 'cream and sugar', 'create new things', 'creative process', 'creative vision', 'creepy crawler', 'crime of passion', 'crocodile tears', 'crop up', 'cross the road', 'cross the rubicon', 'cubic spline', 'cucumber sandwich', 'cup cake', "cupid's arrow", "curate's egg", 'curry favour', 'cut and run', 'cut the mustard', 'dalek asylum', 'dallas texas', 'dance all night', 'danish robot dancers', 'dark horse', 'das oontz', 'david after dentist', 'dead battery', 'dead ringer', 'deal me in', 'dear cookie', 'dear mr vernon', 'dear sir', 'deep thought', 'deep waters', 'dharma initiative', 'diced onion', 'diddly squat', 'digital clock', 'ding a ling', 'dinner bell', 'dinosaur spaceship', 'dish water', 'do a little dance', 'do be do be do', 'do it now', 'do more situps', 'do not touch', 'do or do not', 'do unto others', 'do wah ditty', 'do you believe in miracles', 'do you love me', 'doctor caligari', 'doctor who', 'doctor who?', 'doe a deer', 'dog days', "dog's breakfast", "dog's dinner", 'dogapus', 'dogs and cats living together', 'dollar bill', 'dollar signs', 'dollars to donuts', 'domestic spying', "don't be late", "don't count on it", "don't dawdle", "don't stop", "don't waste time", 'done that', "donkey's years", 'doodah man', 'double cross', 'double crossed', 'double dutch', 'double jump', 'double rainbow', 'double time', 'double whammy', 'down the hatch', 'down the rabbit hole', 'downward slope', 'drag race', 'dragon with matches', 'dragonfly', 'dramatic chipmunk', 'draw a blank', 'drawing board', 'dream big', 'drink milk', 'drive me to firenze', 'drop table users', 'drumhead', 'drummer boy', 'dry clean only', 'dueling banjos', 'dusk till dawn', 'dust bunny', 'dust up', 'duvet day', 'dynamo clock', 'ear candy', 'ear mark', 'ear muffs', 'easy as cake', 'easy as pie', 'easy peasy', 'easy street', 'eat cous cous', 'eat out', 'eat your dinner', 'eat your veggies', 'eat your vitamins', 'ecks why zee', 'edgar degas', 'egg on', 'eggs ter minate', 'eighty six', 'electro head', 'elevator going up', "emperor's clothes", 'empire state of mind', 'end of story', 'english muffin', 'enjoy life', 'ermahgerd capcher', 'evil eye', 'evil genius', 'exceedingly well read', 'exclamation', 'exercise more', 'extra cheese', 'face the music', 'face to face', 'fade away', 'fair and square', 'fair play', 'fairy godmother', 'fairy tale', 'fait accompli', 'fall guy', 'falling pianos', 'fancy free', 'fancy pants', 'far away', 'farsical aquatic ceremony', 'fashion victim', 'fast and loose', 'fast asleep', 'father time', 'father uncle', 'fathom out', 'fava beans', 'feeding frenzy', 'feeling blue', 'fellow traveller', 'fezes are cool', 'field day', 'fifth column', 'fill it up', 'filthy dirty mess', 'filthy rich', "finagle's law", 'final answer', 'finger lickin good', 'fire brim stone', 'firecracker', 'first contact', 'first post', 'first water', 'first world', 'fish and chips', 'fish on', 'fishy smell', 'flag day', 'flat foot', 'flat out', 'flat tire', 'flipadelphia', 'flipflops', 'flux capacitor', 'follow me', 'folsom prison', "fool's paradise", 'fools gold', 'for keeps', 'for sure', 'for the birds', 'for the gripper', 'forbidden fruit', 'foregone conclusion', 'forget this', 'forget you', 'fork knife spoon', 'forty two', 'foul play', 'four by two', 'frabjous day', 'france', 'frankly my dear', 'free hat', 'freezing temperatures', 'french fried', 'french fries', 'french phrases', 'fresh water', 'fried ices', 'fried rice', 'friend zone', 'frozen peas', 'fruit salad', 'fuddy duddy', 'full house', 'full monty', 'full of stars', 'full stop', 'full tilt', 'fun with flags', 'funny farm', 'fusilli jerry', 'fuzzy wuzzy', 'gadzooks', 'game is up', 'gangnam style', 'garden of eden', 'garlic yum', 'gathers moss', 'gee louise', 'gee whiz', 'geez louise', 'gene parmesan', 'general tso', 'generation x', 'genghis khan', 'george washington', 'get out', 'get over it', 'get well', 'get your goat', 'giant bunny rabbit', 'giant panda', 'giddy goat', 'gift horse', 'gimme pizza', 'ginger bread', 'give or take', 'glass ceiling', 'glazed donut', 'global warming', 'go berserk', 'go further', 'go gadget go', 'goes to eleven', 'gold medal', 'gold record', 'golly jeepers', 'gone dolally', 'gone fishing', 'good afternoon', 'good as gold', 'good buddy', 'good day', 'good evening', 'good for nothing', 'good grief', 'good job', 'good luck', 'good morning', 'good night', 'good night and good luck', 'good riddance', 'good samaritan', 'good work', 'goody goody gumdrops', 'goody gumdrop', 'goody two shoes', 'goosebumps', 'gordon bennett', 'got my mojo', 'gotham city', 'gothic arch', 'gothic church', 'grain of salt', 'grand slam', 'grape soda', 'grass up', 'graveyard shift', 'gravy train', 'grease the skids', 'greased lightning', 'great scott', 'great unwashed', 'gregory peck', 'gridlock', 'grilled cheese', 'groundhog day', 'grumpy cat', 'guinea pig', 'guitar player', 'gum shoe', 'gung ho', 'habsons choice', 'had a great fall', 'had me at hello', 'hairy eyeball', 'halcyon days', 'half done', 'half empty', 'half full', 'half inch', 'hallowed ground', 'halp meh', 'ham and cheese', 'hamburger bun', 'hammer time', 'hand over fist', 'hands down', 'hangers and mash', 'happy anniversary', 'happy blessings', 'happy clappy', 'happy retirement', 'happy trails', 'hard captcha is hard', 'hard cheese', 'hard lines', 'hard sharp', 'hardened prestoopnicks', 'harp on', 'haste makes waste', 'hat head', 'hat trick', 'have a purpose', 'have an inkling', 'have courage', 'have fun', 'he loves her', 'head case', 'head honcho', 'head over heels', 'heads up', 'health food', 'healthy food', 'hear hear', 'hear me roar',
                     'heart break', 'heart strings', "heart's content", 'heartache', 'heat up', 'heated debate', 'heavens to betsy', 'heavy metal', 'heebie jeebies', 'hello newman', 'hello sweetie', 'hello watson', 'hello world', 'here or there', "here's johnny", 'hey brother', 'higgledy piggledy', 'higgs boson', 'high def', 'high five', 'high flyer', 'high horse', 'high sleeper', 'high time', 'him with her', 'hissy fit', 'history repeats itself', 'hit the hay', 'hit the sack', 'hoagie roll', 'hobby horse', "hobson's choice", 'hocus pocus', 'hoi polloi', 'hoity-toity', 'hold your horses', 'hold your tongue', 'home james', 'honey mustard', 'hooray henry', 'hops a daisy', 'horse and cart', "horse's mouth", 'hot blooded', 'hot diggity dog', 'hot dog roll', 'hot pola', 'hot sauce', 'hover hand', 'how about lunch', 'how about that', 'how are you', 'how interesting', 'how now, brown cow', 'how quaint', 'how sweet', "how's it going", 'howdy partner', 'hug me', 'huggle muggle', 'hulk smash', 'hunky-dory', 'hush puppies', 'i am captcha', 'i am fine', 'i am here', 'i can do this', 'i can fix it', 'i have fallen', 'i know nothing', 'i like humans', 'i like people', 'i like turtles', 'i like you', 'i love deadlines', 'i love lamp', 'i love you', 'i made tea', 'i moustache you why', 'i saw that', 'i see', 'i think i am', 'i think i can', 'i think so', 'i want control', "i'll make tea", "i'm batman", "i'm blessed", "i'm blushing", "i'm cold brr", "i'm only human", "i'm so cold", "i'm sorry", "i'm sorry dave", "i'm yours", 'ice to meet you', 'idk my bff jill', 'if it fits', 'im cold. brr', 'imagine inspire create', 'in a box', 'in limbo', 'in over my head', 'in spades', 'in stitches', 'in the air', 'in the box', 'in the cart', 'in the club', 'in the doldrums', 'in the limelight', 'industrial revolution', 'infra dig', 'inside out', 'is it enough', 'is it hot', 'is it hot?', 'is it hot in here', 'is it plugged in', 'is low', "it doesn't count", 'it happens', 'it hurts', 'it is certain', 'it is enough', 'it will pass', "it's over", "it's super effective", 'ivory tower', 'jabber wocky', 'jack be nimble', 'jam tomorrow', 'jay gatsby', 'jerk store', 'jerry built', 'jimmy cricket', 'jimmy horner', 'john lennon', 'john steinbeck', 'jump higher', 'jump over', 'jump the candlestick', 'jump the gun', 'jumping jack', 'june july', 'just dance', 'just deserts', 'just drive', 'just friends', 'just in time', 'kangaroo count', 'karma points', 'keep calm', 'keyboard', 'keyboard cat', 'khyber pass', 'kick the can', 'kick your heels', 'kindness of strangers', 'king arthur', 'kiss me', 'kitten mittens', 'kitty kat', 'klatu berada nikto', 'knick knack', 'knock at the door', 'knock back', 'knock knock knock penny', 'knock off', 'knock on wood', 'know the ropes', 'know thy self', 'know your paradoxes', 'know your rights', 'knuckle down', 'kosher dill', 'kundalini express', 'labour of love', 'ladies first', 'lager frenzy', 'lame duck', 'lardy-dardy', 'lark about', 'laser beams', 'last straw', 'later gator', 'laugh at me', 'law of sines', 'lawn giland', 'lazy sunday', 'leap higher', 'leaps and bounds', 'learn challenge improve', 'learn from mistakes', 'learn succeed', 'learn the ropes', 'learn, advance', 'leave britney alone', 'leave me alone', 'left or right', 'left right', 'lefty loosey', 'less is more', 'let go', 'let it be', 'let me know', 'let me out', 'lets eat', 'level playing field', 'liberty bell', 'library book', 'lickety split', 'lie low', 'light sleeper', 'like a boss', 'like the dickens', 'linear algebra', 'little bird told me', 'little bobby tables', 'little did he know', 'little sister', 'live free', 'live in the moment', 'live in the now', 'live life', 'live long + prosper', 'live love internet', 'live love type', 'live transmission', 'live with purpose', 'live your dream', 'living daylights', 'living things', 'lizard poisons spock', 'lo and behold', 'loaf of bread', 'local derby', 'lol cat', 'lollerskates', 'lolly pop', 'london calling', 'long division', 'long in the tooth', 'look away', 'look before crossing', 'look both ways', 'looking glass', 'lose face', 'lost love', 'loud music', 'love is automatic', 'love is blind', 'love life', 'love me', 'love you', 'love-hate', 'lovey dovey', 'lucille 2', 'lucky you', 'ludwig van', 'lumpy gravy', 'lunatic fridge', 'lunch time', 'lunch tuesday', 'mad hatter', 'mad science', 'magic decoder ring', 'magic eight ball', 'magical realism', 'magnetic monopole', 'main chance', 'major intersection', 'make a bee line', 'make haste', 'make it so', 'make my day', 'many happy returns', 'many wishes', 'maple syrup', 'marble rye', 'marcia marcia marcia', "mare's nest", 'margin of error', 'mark it zero', 'market forces', 'marry me', 'mars rover', 'math test', 'mayan ruins', 'mea culpa', 'meat and drink', 'meat with gravy', 'meddling kids', 'media frenzy', 'melody pond', 'men in suits', 'mend fences', 'meow meow', 'metropolis', 'mexican wave', 'mickey finn', 'miles to go', 'milk was a bad choice', 'milkshake', 'million dollars', 'miloko plus', 'miloko plus vellocet', 'mimsy borogoves', 'minced oaths', 'mind the gap', 'minty fresh', 'mish-mash', 'miss you', 'mister wilson', 'modern love', "moe's tavern", 'mom and dad', 'money lender', 'moo shoo pork', 'moon cheese', 'moot point', 'more better', 'more chocolate', 'more coffee', 'more cow bell', 'more internets', 'morning person', 'most interesting man', 'most likely', 'mother country', 'mother earth', 'motley crew', 'mouth watering', 'move along', 'move mountains', 'move over', 'moveable feast', 'movers and shakers', 'movie star', 'mrs robinson', 'muffled rap music', 'multi pass', "mum's the word", 'mumbo jumbo', "murphy's law", 'mushy peas', 'music machine', 'mustachioed', 'my bad', 'my beating heart', 'my better half', 'my dear watson', "my friends can't dance", "my mind's eye", 'my sources say no', 'naise cain', 'namby-pamby', 'name drop', 'nanoo nanoo', 'nap time', 'narrow minded', 'nautical phrases', 'ne regrets', 'near tannhauser gate', 'neart strings', 'neckbeard', 'need a bigger boat', 'needs must', 'nercolas cerg', 'nest egg', 'never give up', 'never gonna give you up', 'never mind', 'never quit', 'new york city', 'nice job', 'nice marmot', 'nice to meet you', 'night owl', 'nip and tuck', 'nitty gritty', 'no brainer', 'no crying in baseball', 'no dice', 'no friend of mine', 'no holds barred', 'no means no', 'no regrets', 'no soup for you', 'no spoon', 'no stinking badges', 'no time to explain', 'no way', 'nobody home', 'none of the above', 'nope chuck testa', 'nose bleed', 'nosy parker', 'not a bot', 'not in kansas', 'not yet', 'now and forever', 'now look here', 'nth degree', 'nul points', 'numa numa', 'nut case', 'nutrition', 'nyan cat', 'nyquist rate', 'of course', 'off the record', 'oh brother', 'oh em gee', 'oh hai', 'oh sigh', 'oh so close', 'oh yes', 'oh you', 'oh,you', 'oh, wait', 'okey dokey', 'old hat', 'old man winter', 'old shoe', 'om nom nom', 'on a boat', 'on cloud nine', 'on the ball', 'on the qt', 'on-off', 'once again', 'once upon a time', 'one day more', 'one fell swoop', 'one hit wonder', 'one small step for man', 'one stop shop', 'one way', 'one way street', 'one, two, three', 'only way to be sure', 'oontz oontz', 'oops a daisy', 'open season', 'open sesame', 'orange juice', 'other worldly', 'out of sorts', 'out of toner', 'outlook good', 'over the hill', 'over the moon', 'over the top', 'over there', 'oxford university', 'oxo cube', 'paint it red', "pandora's box", 'pants on the ground', 'paper jam', 'paper plate', 'partial derivative', 'partly cloudy', 'party on garth', 'passing lane', 'patch of grass', 'path less taken', 'patience child', 'patty cake', 'pay the ferryman', 'pea brain', 'pearly whites', 'peg out', 'pell mell', 'penny loafer', 'people like me', 'pepe silvia', 'pepper pot', 'pepperoni pizza', 'peppers and onions', 'perfect world', 'pester power', 'peter out', 'philadelphia', 'phone home', 'pick me', 'pick up sticks', 'pickle juice', 'pickled peppers', 'picture perfect', 'pie are round', 'pie are squared', 'pie chart', 'piece of cake', "pig's ear", 'piggyback', 'pin money', 'pipe down', 'pipe dream', 'piping hot', 'pitter patter', 'pizza topping', 'plain sailing', 'play a game', 'play again', 'play ball', 'play hookey', 'play it again sam', 'pleased as punch', 'plenty of time', 'plugged nickel', 'plus or minus', 'pocket sized', 'pod bay doors', 'poetic justice', 'point blank', 'point to point', 'points dont matter', 'points font matter', 'poison apple', 'political party', 'politicaly correct', "poly's cracker", 'pond life', 'pool boy', 'pool hall', 'pool house', 'poor house', 'pork pies', 'pound cake', 'power dressing', 'power tool', 'practice makes perfect', 'press into service', 'prime time', 'primrose path', 'print out', 'print paper', 'printer paper', 'propane accessories', 'public good', 'pudding pops', 'puffy shirt', 'pumpkin pie', 'puppy dog', 'puppy love', 'push harder', 'push on', 'push the edge', 'push the envelope', 'pyrrhic victory', 'quality time', 'queen nefertiti', 'queen of hearts', "queen's yacht", 'question everything', 'question mark', 'quid pro quo', 'quotations', 'rack and ruin', 'rack your brains', 'rain go away', 'rain tonight', 'rainy days', 'raise cain', 'raspberry tart', 'reach higher', 'read all over', 'read me, write me', 'read my mail', 'ready set go', 'real hoopy frood', 'real mccoy', 'red herring', 'red tape', 'red white and blue', 'red-handed', 'reduplicated phrases', 'remain calm', 'rent-a-swag', 'respect me', 'return to sender', 'reverse the polarity', 'rhino beetle', 'rhodeisland', 'rhyme nor reason', 'rhyming slang', 'rice and beans', 'rice job', 'ride the subway', 'riff-raff', 'right hand turn', 'right left', 'righty tighty', 'ring fencing', 'ring fenring', 'rinky-dink', 'rise and shine', 'river song', 'river styx', 'road apples', 'road less travelled', 'roast beef', 'robe of saffron', 'rocket science', 'rodents of unusual size', 'roflcopter', 'roll again', 'roll over', 'roller skates',
                     'rolling stone', 'rooftop', 'room for activities', 'roommate agreement', 'root beer float', 'rope burn', 'rosebud', 'rosie lea', 'rough diamond', 'round one', 'round robin', 'round tab1e', 'route one', 'row boat', 'roy g biv', 'royal flush', 'rubicon crossed', 'rule of chomio', 'rule of thumb', 'rum do', 'run amok', 'run away', 'run farther', 'run the gauntlet', 'run through', 'runny nose', 'saber tooth', 'sacred cow', 'safe streets', 'safer streets', 'safety first', 'salad days', 'salt and pepper', 'salty cheese', 'same same', 'sandy beach', 'saturday detention', 'saucy', 'sauer kraut', 'sausages', 'save face', 'save it', 'save our bluths', 'savoir faire', 'sax and violins', 'say cheese', 'school is cool', 'science class', 'science fair', 'science it works', 'science project', 'scot free', 'screw driver', 'sea change', 'sea shell', 'sea shore', 'seattle', 'see red', 'see ya', 'see-saw', 'seek beauty', 'seems legit', 'seize the day', 'select from table', 'send packing', 'senior citizen', 'seven ate nine', 'seven signs', 'seze the day', 'shake a leg', 'shaken not stirred', 'shakers and movers', 'shane come back', 'sharp pencil', 'sharp stick', 'she loves him', 'she sells', 'she sells seashells', "she's a witch", 'sheldon alpha five', 'shilly-shally', 'ship shape', 'shoe shine', 'shoes shine', 'shoot through', 'shoulder of orion', 'show down', 'shuffle the deck', 'sick puppy', 'signal your turns', 'signs point to yes', 'silence is golden', 'silver bells', 'silver bullet', 'silver hoing', 'silver lining', 'silver spoon', 'sin cos tan', 'since when', 'sing a song', 'sixes and sevens', 'sixteen point turn', 'skidrow', 'skip a turn', "sky's the limit", 'skynet is watching', 'skynet knows', 'skynet watches', 'sleep tight', 'sleepy hollow', 'slimy goop', 'slippery slope', 'sloane ranger', 'slow down', 'slow milenky lizards', 'slush fund', 'slythy toves', 'small fries', 'small fry', 'smart casual', 'smart phone', 'smashed potato', 'smell that', 'smelling salt', 'smoked salmon', 'snake eyes', 'snapshot', 'snare drum', 'sneezing baby panda', 'snoop lion', 'snow drift', 'snow flurry', 'snow shovel', 'so far away', 'so life like', 'so so', "sod's law", 'soft kitty warm kitty', 'soft kitty, warm kitty', 'somebody that i used to know', 'sonic screw driver', 'sorry dave', 'sorry sight', 'souffle girl', 'sound bite', 'sound of sirens', 'sound out', 'sour grapes', 'space is big', 'space plumber', 'spangled banner', 'speeding bullet', 'spelling bee', 'spend time', 'spick and span', 'spicy', 'spicy hot', 'spin doctor', 'spitting feathers', 'spitting image', 'spoilers', 'spread the net', 'spring water', 'spruce up', 'square meal', 'square one', 'squeaky clean', 'squirrel friend', 'st johns bay', 'stalla stella', 'stand and deliver', 'stand by me', 'stand up guy', 'star spangled', 'star wars kid', 'start from scratch', 'stay safe', 'steak and eggs', 'steam punk', 'steering wheel', 'step back', 'step over', 'steve holt', 'steve jobs', 'sticky wicket', 'sting like a bee', 'stinking rich', 'stinky feet', 'stone soup', "stone's throw", 'stony hearted', 'stool pigeon', 'stop waisting time', 'stranger danger', 'streams of oceanus', 'strike a match', 'strike three', 'string along', 'string cheese', 'stuck in mud', 'stump up', 'sudo make sandwich', 'sulphur smell', 'summon inglip', 'sun tzu says', 'sunday', 'sunshine', 'super star', 'surf and turf', 'surface integral', 'swan song', 'sweet dreams', 'sweety pie', 'swirling vortex of entropy', 'taco tuesday', 'take a look', 'take an umbrella', 'take care', 'take it all', 'take out food', 'take potluck', 'take the cake', 'take umbrage', 'take wrong turns', 'taken aback', 'talk the talk', 'talk to strangers', 'talk turkey', 'tall building', 'tall story', 'tastes good', 'tastes like chicken', 'tea earl gray hot', 'tea leaf', 'tea with jam', 'tea with milk', 'tear us apart', 'technicolor yawn', 'teflon president', 'teh inter webs', 'ten four', 'tesla coil', 'thank you', 'thank you, come again', 'that escalated quickly', 'that hurts', 'that will not work', "that's a fact jack", "that's all folks", "that's enough", "that's hot", "that's it", "that's my spot", "that's right", "the bee's knees", 'the bible', 'the big apple', 'the big cheese', 'the big easy', 'the cat lady', 'the cats cradle', 'the dennis system', 'the dude abides', 'the extra mile', 'the next level', 'the nightman cometh', 'the one eyed man is a king', 'the other side', 'the tribe has spoken', 'the yellow king', 'there is no spoon', 'there is only zul', 'there once was', 'these parts', 'they are watching', 'they ate it', 'thick and thin', 'thin air', 'think create do', 'think green', 'think hard', 'think twice', 'thinking cap', 'third degree', 'thirty one days', 'this is it', 'this is not fake', 'this is sparta', 'this or that', 'this statement is false', 'three short words', 'three strikes', 'through the grapevine', 'thumbs up', 'thunder storm', 'ticked off', 'tickle the ivories', 'tickled ivories', 'tickled pink', 'tide over', 'tight lipped', 'time and paper', 'time circuits', 'time flies', 'time is an illusion', 'time lord', 'time machine', 'time will tell', 'times square', "tinker's dam", 'to boot', 'toast points', 'toe the line', 'toe-curling', 'together again', 'too bad', 'too late', 'too many cooks', 'too many secrets', 'too salty', 'toodle oo', 'top dog', 'top drawer', 'top notch', 'top ten', 'topsy turvy', 'topsy-turvy', 'total shamble', 'towel dry', 'tower of strength', 'toy soldier', 'traffic jam', 'traffic light', 'train surfing', 'travel size', 'treat yoself', 'trick or treat', 'trickle down', 'trolololol', 'true blue', 'true life', 'trust me', 'tuckered out', 'tuna fish', 'tune in', 'turkey sandwich', 'turn signal', 'turn the tables', 'turn up trumps', 'twenty eight days', 'twenty four seven', 'twenty one', 'twenty three', 'two cents worth', 'two hands', 'two left feet', 'two tone', 'u jelly', 'umbrella corporation', 'uncharted island', 'uncle leo', 'under the sea', 'underpants', 'union jack', 'unlimited wishes', 'untied laces', 'until next time', 'until tomorrow', 'until tonight', 'up and away', 'up or down', 'upper crust', 'upper hand', 'ups a daisy', 'upside down', 'upvote this', 'upward slope', 'urban myth', 'usual suspects', 'uu dd lr lr ba', 'van surfing', 'vanilla ice cream', 'veg out', 'vegan diet', 'vegan zombie wants grains', 'vegetarian', 'very doubtful', 'very nice', 'vice versa', 'vicious cycle', 'video tape', 'vienna calling', 'virtue of necessity', 'vis a vis', 'vocal minority', 'vogon poetry', 'voigt kampf', 'vorpal sword', 'vote pancakes', 'wake of the flood', 'walk free', 'walk the plank', 'walk the walk', 'want more', 'warp speed', 'wash whites separately', 'watch c-beams glitter', 'watch me', 'watch out', 'water gate', 'wax poetic', 'way to go', 'way to go donny', 'we go forwards', 'we like the moon', 'weakest link', 'weasel words', 'welcome to earth', 'well done', 'well heeled', "well isn't that special", 'well now', 'well read', 'weylan yutani', 'what even', 'what ever', 'what for', 'what if', 'what is for dinner', 'what is your quest', 'what should we call me', 'what to see', "what's that", 'wheel group', 'when where', 'where to go', 'whet your appetite', 'whistle and flute', 'white as snow', 'white bread', 'white elephant', 'white rabbit', 'who am i', 'who are you', 'who is it', 'who you gonna call', 'who, what, where', 'whoa there', 'whole nine yards', 'whole shebang', 'whoopee cushion', 'whoops a daisy', 'wicked witch', 'wide berth', 'wild and crazy guys', 'wild and woolly', 'wild goose chase', 'wild west', 'willy nilly', 'win hands down', 'window dressing', 'wing it', 'winning', 'winter is coming', 'winter snow', 'wisdom of inglip', 'wisdom teeth', 'wishy-washy', 'with bells on', 'without a doubt', 'woof woof', 'word for word', 'words of wisdom', 'work out', 'would you believe', 'wright flyer', 'writing desk', 'x all the y', 'xylophone', 'yada yada', 'yadda yadda yadda', 'yeah right', 'year dot', 'yee haw', 'yelling goat', 'yellow belly', 'yes definitely', "yes ma'am", 'yes sir', 'yes this is dog', 'you are happy', 'you are here', 'you can do this', "you don't say", 'you first', 'you good', 'you have my stapler', 'you rock', 'you the man', 'you win', "you're in my spot", "you're not listening", "you're welcome", 'zig zag', 'zombie attack', 'zombie prom', 'who what where', ];
    const datalist = document.createElement('datalist'); datalist.setAttribute('id', 'adcopy_phrases'); for (const phrase of PHRASES) {datalist.appendChild(document.createElement('option')).appendChild(document.createTextNode(phrase));} element.parentNode.insertBefore(datalist, element.nextSibling); element.setAttribute('list', datalist.id);});}})();