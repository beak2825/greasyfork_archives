// ==UserScript==
// @name       Smart Auto Redirect & Scroll
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
// @author     Bloggerpemula
// @version    1.3
// @match      *://*/*
// @grant      GM_setValue
// @grant      GM_getValue
// @grant      GM_addStyle
// @connect    nocaptchaai.com
// @grant      GM_xmlhttpRequest
// @grant      window.onurlchange
// @grant      GM_registerMenuCommand
// @icon       https://i.ibb.co/qgr0H1n/BASS-Blogger-Pemula.png
// @require    https://update.greasyfork.org/scripts/528923/1556565/MonkeyConfig%20Mod.js
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
// @exclude /^(https?:\/\/)([^\/]+\.)?((github|aliyun|reddit|bing|yahoo|microsoft|whatsapp|amazon|ebay|payoneer|paypal|skrill|stripe|tipalti|wise|discord|tokopedia|taobao|taboola|aliexpress|netflix|citigroup|spotify|bankofamerica|hsbc|blogger|accounts.youtube|(cloud|mail|translate|analytics|accounts|myaccount|contacts|clients6|developers|payments|pay|ogs|safety|wallet|docs|workspace|gemini|adservice).google|atlassian|pinterest|twitter|x|live|facebook|tiktok|instagram|linkedin|fastbull|tradingview|deepseek|chatgpt|openai|grok|bilibili|indodax|bmcdn6|fbsbx|googlesyndication|amazon-adsystem|pubmatic|gstatic).com|proton.me|(greasyfork|openuserjs|telegram|wikipedia|lichess).org|(doubleclick|yahoo).net|meta.ai|codepen.io|(shopee|lazada|rakuten|maybank|binance).*|(dana|ovo|bca.co|bri.co|bni.co|bankmandiri.co|desa|(.*).go).id|(.*).(edu|gov))(\/.*)/
// @downloadURL https://update.greasyfork.org/scripts/531756/Smart%20Auto%20Redirect%20%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/531756/Smart%20Auto%20Redirect%20%20Scroll.meta.js
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
// NOTES
// Try to Enable Fast Timer if My Script not Working on besargaji.com
// Popup should be Allowed for render-state.to and coincroco.com sites
// Change Your Delay in the settings options from 5 to 10 or 20 if you have issues like Your action marked Suspicious,Don't try to bypass ,Don't use Speedster, etc
// Debloated Script from Amm0ni4 Just Make Broken My Script and Made Me Lazy to Update, His Debloated Not Working Correctly and He Don't Know how to Fix it

   const window = unsafeWindow; // Some of My Codes Not Running Well Without this , Please Let Me Know if You Find any Bugs
   const cfg = new MonkeyConfig({title: 'Bypass All Shortlinks Version 94.5 Settings',menuCommand: 'Open Bypass Settings',width: '600px',height: 'auto',
    params: {Announcements: {type: 'textarea',label: 'Announcements',fontColor: "#0000ff",default: '1. Support My Works Via https://saweria.co/Bloggerpemula\n2. Add Your ApiKey from nocaptchaai to use Auto Solve Hcaptcha\n3. Red Menu=> Sometimes Causes Problems , use Your own Trial Error',column: 'top',labelAlign: 'center',rows: 3,cols: 50},
        ApiKey: {label: 'noCaptcha Ai KEY',type: 'text',default: '',column: 'left'},
        SetDelay: {label: 'Redirect Delay',type: 'number',default: 5,column: 'right'},
        RightFC: {label: 'Enable Context Menu',type: 'checkbox',fontColor: "#ff0000",default: false,column: 'right'},
        TimerFC: {label: 'Enable Fast Timer',type: 'checkbox',fontColor: "#ff0000",default: false,column: 'left'},
        BlockFC: {label: 'Enable Always Ready',type: 'checkbox',fontColor: "#ff0000",default: false,column: 'left'},
        BlogDelay: {label: 'Use My Blogs For Delays',type: 'checkbox',default: false,column: 'right'},
        reCAPTCHA: {label: 'Auto Open/Solve Recaptcha',type: 'checkbox',default: false,column: 'bottom'},
        hCaptcha: {label: 'Auto Open/Solve Hcaptcha',type: 'checkbox',default: false,column: 'bottom'},
        YTShort: {label: 'Disable Youtube Short',type: 'checkbox',default: false,column: 'right'},
        AutoDL: {label: 'Auto Download For Supported Sites',type: 'checkbox',default: false,column: 'left'}}});
(function(){function BoostTimers() {const FsT = window.setTimeout; const FsI = window.setInterval;
  Object.defineProperty(window, 'setTimeout', {value: function(func, delay) {if (delay === 1000) {delay = 50;} return FsT.apply(this, arguments);}});
  Object.defineProperty(window, 'setInterval', {value: function(func, delay) {if (delay === 1000) {delay = 50;} return FsI.apply(this, arguments);}});}
  if (cfg.get('TimerFC') == true) {BoostTimers();} else {}})();
(function() { // Please Remember , My Scripts Works Better Using Firefox Browser and Violentmonkey Extension
'use strict';
  const APIKEY = cfg.get('ApiKey');const bp = query => document.querySelector(query);const BpAll = query => document.querySelectorAll(query);
  const BpParams = new URLSearchParams(location.search);const elementExists = query => bp(query) !== null;const BpT = query => document.getElementsByTagName(query);
  function BpBlock() {return 1;}
  function sleep(ms) {return new Promise((resolve) => setTimeout(resolve, ms));}
  function fakeHidden() {Object.defineProperty(document, "hidden", {get: () => true,configurable: true});}
  function meta(href) {document.head.appendChild(Object.assign(document.createElement('meta'), {name: 'referrer',content: 'origin'}));
    Object.assign(document.createElement('a'), {href}).click();}
  function redirect(url, blog = true) {location = blog && cfg.get('BlogDelay') ? 'https://sl1bas.blogspot.com/?BypassResults=' + url : url;}
  function BpCalc(sbp) {return (sbp.replace(/\s/g, '').match(/[+\-]?([0-9\.]+)/g) || []).reduce(function(sum, value) {return parseFloat(sum) + parseFloat(value);});}
  function setActiveElement(selector) {elementReady(selector).then(element => {const temp = element.tabIndex;element.tabIndex = 0;element.focus();element.tabIndex = temp;});}
  function elementReady(selector) {return new Promise(function(resolve, reject) {let element = bp(selector);
      if (element) {resolve(element); return;} new MutationObserver(function(_, observer) {element = bp(selector);
      if (element) {resolve(element); observer.disconnect();}}).observe(document.documentElement, {childList: true, subtree: true});});}
  function ReadytoClick(selector, sleepTime = 0) {const events = ["mouseover", "mousedown", "mouseup", "click"];const selectors = selector.split(', ');
    if (selectors.length > 1) {return selectors.forEach(ReadytoClick);}if (sleepTime > 0) {return sleep(sleepTime * 1000).then(function() {ReadytoClick(selector, 0);});}
    elementReady(selector).then(function(element) {element.removeAttribute('disabled');element.removeAttribute('target');
        events.forEach(eventName => {const eventObject = new MouseEvent(eventName, {bubbles: true}); element.dispatchEvent(eventObject);});});}
  function DecodeBase64(string, times = 1) {let decodedString = string;for (let i = 0; i < times; i++) {decodedString = atob(decodedString);}return decodedString;}
  function Decrypter(string, shift = 13) {return string.replace(/[a-z]/gi, c => {const base = c <= 'Z' ? 90 : 122;return String.fromCharCode(base >= (c = c.charCodeAt(0) + shift) ? c : c - 26);});}
  function strBetween(s, front, back, trim = false) {if (trim) {s = s.replaceAll(' ', '');s = s.trim();s = s.replaceAll('\n', ' ');}
      return s.slice(s.indexOf(front) + front.length, s.indexOf(back, s.indexOf(front) + front.length));}
  function TrustMe() {if (!elementExists('body.no-js')) {const originalAddEventListener = EventTarget.prototype.addEventListener;EventTarget.prototype.addEventListener = function(type, listener, options) {
    const wrappedListener = function(event) {const clonedEvent = Object.create(event);Object.defineProperty(clonedEvent, "isTrusted", {value: true,writable: false});
    return listener.call(this, clonedEvent);};return originalAddEventListener.call(this, type, wrappedListener, options);};}}
  function waitForElm(query, callback, maxWaitTime = 15, initialDelay = 5) {const startTime = Date.now();const maxWaitTimeMs = maxWaitTime * 1000;const initialDelayMs = initialDelay * 1000;
    setTimeout(() => {const observer = new MutationObserver(() => {if (elementExists(query)) {observer.disconnect();callback(bp(query));} else if (Date.now() - startTime >= maxWaitTimeMs + initialDelayMs) {
          observer.disconnect();console.warn(`Element ${query} not found within ${maxWaitTime + initialDelay} seconds`);}});observer.observe(document.body, {childList: true,subtree: true});
      if (elementExists(query)) {observer.disconnect();callback(bp(query));}}, initialDelayMs);}
  function NoFocus() {window.mouseleave = true; window.onmouseover = true; document.hasFocus = function() {return true;}; Object.defineProperty(document, 'webkitVisibilityState', {get() {return 'visible';}});
    Object.defineProperty(document, 'visibilityState', {get() {return 'visible';}}); window.addEventListener('visibilitychange', function(e) {e.stopImmediatePropagation();}, true, true);
    window.addEventListener('focus', onfocus, true);document.addEventListener('visibilitychange', function(e) {e.stopImmediatePropagation();}, true, true); Object.defineProperty(document, 'hidden', {get() {return false;}});}
  function BlockRead(SearchString, nameFunc) {try {if (!elementExists('body.no-js')) {if (typeof window[nameFunc] !== 'function') {console.warn(`Function ${nameFunc} not found or not a function`);return;}const target = window[nameFunc];
    window[nameFunc] = function(...args) {try {const callback = args[0];const stringFunc = callback && typeof callback === 'function' ? callback.toString() : '';const regex = new RegExp(SearchString, 'i');if (regex.test(stringFunc)) {args[0] = function() {};}
    return target.call(this, ...args);} catch (err) {console.error(`Error in overridden ${nameFunc}:`, err);return target.call(this, ...args);}};}} catch (err) {console.error('Error in BlockRead:', err);}}
  function Listener(callback) {if (!elementExists('body.no-js')) {const originalOpen = XMLHttpRequest.prototype.open; XMLHttpRequest.prototype.open = function(method, url) {this.addEventListener("load", function() { this.method = method;this.url = url;callback(this);}); originalOpen.apply(this, arguments);};}}
  function Request(url, options = {}) {return new Promise(function(resolve, reject) {GM_xmlhttpRequest({ method: options.method ?? "GET", url, responseType: options.responseType ?? "json", headers: options.headers, data: options.data, onload: function(response) {resolve(response.response);}});});}
  function RSCookie(action, name, value = null, days = null) {if (action === 'set') {if (!name || value === null) {console.error('Nama cookie dan nilai harus disediakan untuk mode "set".');return;}const date = new Date();date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = days ? `; expires=${date.toUTCString()}` : '';document.cookie = `${name}=${value}${expires}; path=/`;console.log(`Cookie "${name}" telah diatur dengan nilai "${value}".`);} else if (action === 'read') {
    if (!name) {console.error('Nama cookie harus disediakan untuk mode "read".');return;}const cookieName = name + "=";const decodedCookie = decodeURIComponent(document.cookie);const cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {let cookie = cookieArray[i];while (cookie.charAt(0) === ' ') {cookie = cookie.substring(1);}if (cookie.indexOf(cookieName) === 0) {return cookie.substring(cookieName.length, cookie.length);}}return "";} else {console.error('Mode tidak valid. Gunakan "set" atau "read".');}}
  function EnableRCF() {var events = ['contextmenu', 'copy', 'cut', 'paste', 'select', 'selectstart','dragstart', 'drop'];function preventDefaultActions(event) {event.stopPropagation();}events.forEach(function(eventName) {document.addEventListener(eventName, preventDefaultActions, true);});}
  function AIORemover(action, target = null) {switch (action) {case 'removeRef': delete document.referrer;document.__defineGetter__('referrer', () => target || '');console.log('Referrer removed or set to:', target || 'empty');break;
      case 'removeBp': if (!target) {console.error('Selector is required for removeBp action.');return;}var elements = BpAll(target);elements.forEach(element => element.remove());console.log(`Elements with selector "${target}" removed.`);break;
      case 'delCookie': if (!target) {console.error('Cookie name is required for delCookie action.');return;}document.cookie = `${target}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;console.log(`Cookie "${target}" deleted.`);break; default: console.error('Invalid action. Use "removeRef", "removeBp", or "delCookie".');}}
  function CaptchaDone(callback, checkInterval = 1000) {if (typeof callback !== 'function') {console.error('Callback harus berupa fungsi');return;}let intervalId;
    const checkCaptcha = () => {try {if (elementExists('.iconcaptcha-holder.iconcaptcha-theme-light.iconcaptcha-success')) {clearInterval(intervalId);callback();return;}
    if (elementExists("iframe[src^='https://newassets.hcaptcha.com']")) {if (window.hcaptcha && typeof window.hcaptcha.getResponse === 'function') {const response = window.hcaptcha.getResponse();if (response && response.length > 0) {clearInterval(intervalId);callback();return;}}}
    if (elementExists("input[name='cf-turnstile-response']") && !elementExists('body.no-js')) {if (window.turnstile && typeof window.turnstile.getResponse === 'function') {const response = window.turnstile.getResponse();if (response && response.length > 0) {clearInterval(intervalId);callback();return;}}}
    if (elementExists("iframe[title='reCAPTCHA']")) {if (window.grecaptcha && typeof window.grecaptcha.getResponse === 'function') {const response = window.grecaptcha.getResponse();if (response && response.length > 0) {clearInterval(intervalId);callback();return;}}}} catch (error) {console.error('Error checking captcha:', error);}};intervalId = setInterval(checkCaptcha, checkInterval);}
  function BypassedByBloggerPemula(domains, data, url = '', blog = false, all = false) {if (!new RegExp(domains).test(location.host)) return;function extractFinalUrl() {const currentUrl = window.location.href;
    const urlMatches = currentUrl.match(/url=(https?:\/\/[^&]+)/g);if (!urlMatches) return null;let finalUrl = urlMatches[urlMatches.length - 1].replace('url=', '');try {finalUrl = decodeURIComponent(finalUrl);} catch (e) {console.log('Error decoding URL:', e);}return finalUrl;}
    if (typeof data === 'function') return data();if (typeof data === 'string') {const params = data.split(',');if (params.every(p => BpParams.has(p))) {const use = params[0];let value = all ? BpParams.getAll(use).find(u => new RegExp(domains).test(u)) : BpParams.get(use);
    if (!value || value.includes('st?')) {value = extractFinalUrl();}if (value) redirect(url + value, blog);}return;}if (Array.isArray(data)) data = {'/': data};if (!(location.pathname in data)) return;const [key, value] = data[location.pathname];let finalValue = '';
    if (typeof key === 'object' && key.test(location.search)) {finalValue = value + RegExp.$1;} else if (BpParams.has(key)) {finalValue = value + BpParams.get(key);} else {finalValue = extractFinalUrl();}if (finalValue) redirect(url + finalValue, blog);}
  function notify(txt, clicktocopy = false, clicktoclose = false, duration = cfg.get('SetDelay')) {const m = document.createElement('div');m.style.padding = '10px 20px';m.style.zIndex = 10000;m.style.position = 'fixed';m.style.width = `970px`;m.style.top = '10px';m.style.transform = 'translateX(-50%)';
    m.style.left = '50%';m.style.fontFamily = 'Arial, sans-serif';m.style.fontSize = '16px';m.style.color = 'white';m.style.textAlign = 'center';m.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';m.style.boxSizing = 'border-box';m.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';m.style.cursor = 'pointer';
    const mainText = document.createElement('div');mainText.innerText = txt.replace('@', duration);m.appendChild(mainText);const actionText = document.createElement('span');actionText.style.position = 'absolute';actionText.style.right = '10px';actionText.style.bottom = '5px';actionText.style.fontSize = '12px';actionText.style.color = 'white';actionText.style.userSelect = 'none';
    if (clicktocopy) {actionText.innerText = 'Click to Copy';} else if (clicktoclose) {actionText.innerText = 'Click to Close';}m.appendChild(actionText);document.body.appendChild(m);m.addEventListener('click', () => {if (clicktocopy) {navigator.clipboard.writeText(txt.replace('@', duration)).then(() => {mainText.innerText = 'Copied to clipboard!';
    setTimeout(() => {document.body.removeChild(m);clearInterval(timerId);}, 1000);}).catch(err => {console.error('Failed to copy text: ', err);});}if (clicktoclose) {document.body.removeChild(m);clearInterval(timerId);}});const timerId = setInterval(() => {duration -= 1;if (duration <= 0) {clearInterval(timerId);} else {mainText.innerText = txt.replace('@', duration);}}, 1000);}
  function CheckVisibility(selector, operatorOrCallback, textCondition, callback, actionOnVisible = true) {function isElementVisible(elem) {if (!elem) return false;if (!elem.offsetHeight && !elem.offsetWidth && !elementExists('body.no-js')) return false;if (getComputedStyle(elem).visibility === 'hidden' && !elementExists('body.no-js')) return false;return true;}
    function checkTextCondition(textCondition) {try {const conditionParts = textCondition.split(/(==|!=)/);if (conditionParts.length !== 3) {console.error('Invalid text condition format:', textCondition);return false;}const selectorPart = conditionParts[0].trim();const selector = selectorPart.replace("bp('", "").replace("').innerText", "").trim();
    const expectedValue = conditionParts[2].trim().replace(/['"]/g, '');const elem = bp(selector);if (!elem) return false;const actualValue = elem.innerText.trim();if (conditionParts[1].trim() === '==') {return actualValue.includes(expectedValue);} else if (conditionParts[1].trim() === '!=') {return !actualValue.includes(expectedValue);}return false;} catch (error) {
    console.error('Error evaluating text condition:', error);return false;}}if (typeof operatorOrCallback === 'function') {const callbackFn = operatorOrCallback;const checkInterval = 1000;const intervalId = setInterval(() => {try {const elem = bp(selector);const isVisible = isElementVisible(elem);if ((actionOnVisible && isVisible) || (!actionOnVisible && !isVisible)) {clearInterval(intervalId);callbackFn();}} catch (error) {
    console.error('Error checking visibility:', error);}}, checkInterval);} else if (typeof operatorOrCallback === 'string' && (operatorOrCallback === '&&' || operatorOrCallback === '||')) {const operator = operatorOrCallback;const checkInterval = 1000;const intervalId = setInterval(() => {try {const elem = bp(selector);const isVisible = isElementVisible(elem);const isTextConditionMet = checkTextCondition(textCondition);
    if ((operator === '&&' && isVisible && isTextConditionMet) || (operator === '||' && (isVisible || isTextConditionMet))) {clearInterval(intervalId);callback();}} catch (error) {console.error('Error checking visibility and text condition:', error);}}, checkInterval);} else {console.error('Parameter tidak valid.');}}
  function DoIfExists(query, actionOrTime = 'click', timeInSecOrFuncName = 1, funcName = 'setTimeout') {let action = 'click';let time = 1;let timerFuncName = 'setTimeout';if (typeof actionOrTime === 'number') {time = actionOrTime;timerFuncName = typeof timeInSecOrFuncName === 'string' ? timeInSecOrFuncName : 'setTimeout';} else if (typeof actionOrTime === 'string') {action = actionOrTime;time = typeof timeInSecOrFuncName === 'number' ? timeInSecOrFuncName : 1;timerFuncName = typeof funcName === 'string' ? funcName : 'setTimeout';}
    function GetForm(FormName) {const forms = document.forms;for (let i = 0; i < forms.length; i++) {if (FormName === 'mdn') {const form = forms[i].innerHTML;if (form.includes('Step')) {return forms[i];}} else if (FormName === 'Allin1') {const bait = forms[i].action;if (/bypass.html|adblock.html/.test(bait)) continue;return forms[i];}}return null;}
    let element;if (query === 'mdn' || query === 'Allin1') {element = GetForm(query);} else {element = bp(query);}if (element) {if (typeof element[action] === 'function') {if (timerFuncName === 'setTimeout' || timerFuncName === 'setInterval') {const timerFunc = window[timerFuncName];if (timerFuncName === 'setTimeout') {timerFunc(() => {
    try {element[action]();console.log(`Aksi "${action}" berhasil dijalankan pada elemen "${query}".`);} catch (error) {console.error(`Aksi "${action}" Gagal pada elemen "${query}":`, error);}}, time * 1000);} else if (timerFuncName === 'setInterval') {const intervalId = timerFunc(() => {try {if (elementExists(query)) {const currentElement = bp(query);currentElement[action]();console.log(`Aksi "${action}" berhasil dijalankan pada elemen "${query}".`);} else {console.error(`Elemen "${query}" tidak ditemukan.`);
    clearInterval(intervalId);}} catch (error) {console.error(`Aksi "${action}" Gagal pada elemen "${query}":`, error);clearInterval(intervalId);}}, time * 1000);console.log(`Interval ID: ${intervalId}`);}} else {console.error(`Timer tidak valid. Gunakan "setTimeout" atau "setInterval".`);}} else {console.error(`Elemen "${query}" tidak memiliki metode "${action}".`);}} else {console.error(`Elemen "${query}" tidak ditemukan.`);}}

  BypassedByBloggerPemula('gocmod.com', 'urls', '');
  BlockRead('(4d-bl0ck3r|ad-blocker)', 'setTimeout');
  BypassedByBloggerPemula('api.gplinks.com', 'url', '');
  BypassedByBloggerPemula('writedroid.in', 'token', '');
  BypassedByBloggerPemula('web1s.com', 'token,url', '');
  BypassedByBloggerPemula('modmania.eu.org', 'token', '');
  BypassedByBloggerPemula(/linkpay.top/, () => {window.focus = true;});
  BypassedByBloggerPemula('ruwet.us', 'link', 'https://yo.adlinku.com/');
  BypassedByBloggerPemula('autodime.com', 'go', 'https://go.linkrex.net/');
  BlockRead('(/adblock|/ad-now.php|/bypass|/detected.html)', 'setInterval');
  BypassedByBloggerPemula('marketrook.com', 'see', 'https://arolinks.com/');
  BypassedByBloggerPemula('ahtio.com', 'link', 'https://avashortener.com/');
  BypassedByBloggerPemula('switchhindi.com', 'link', 'https://udlinks.com/');
  BypassedByBloggerPemula('olhonagrana.com', 'link', 'https://syflink.com/');
  BypassedByBloggerPemula('1apple.xyz', 'link', 'https://link.turkdown.com/');
  BypassedByBloggerPemula('akcartoons.in', 'link', 'https://go.moonlinks.in/');
  BypassedByBloggerPemula('blogsward.com', 'adlinkfly', 'https://linkpay.top/');
  BypassedByBloggerPemula('nisnisin.com', 'link', 'https://link.ezlinkad.com/');
  BypassedByBloggerPemula('poco.rcccn.in', 'id', 'https://links.rcccn.in/?id=');
  BypassedByBloggerPemula('links.rcccn.in', 'id', 'https://blog.techweedy.top/');
  BypassedByBloggerPemula('candleoflife.fun', 'token', 'https://shortsurl.pro/');
  BypassedByBloggerPemula('suntechu.in', 'post', 'https://web.urllinkshort.in/');
  BypassedByBloggerPemula('market.finclub.in', 'link', 'https://go.tnshort.net/');
  BypassedByBloggerPemula('link.sharedp.com', 'id', 'https://last.techyuth.xyz/');
  BypassedByBloggerPemula('(mewsr|techstudify).com', 'link', 'https://rplink.in/');
  BypassedByBloggerPemula('indirasari.com', 'link', 'https://link.paid4link.com/');
  BypassedByBloggerPemula('wikitraveltips.com', 'link', 'https://adrinolinks.in/');
  BypassedByBloggerPemula('encurtaclik.com', 'link', 'https://go.encurtaclik.com/');
  BypassedByBloggerPemula('appkamods.com', 'link', 'https://go.shorturllinks.com/');
  BypassedByBloggerPemula('keepzem.com', 'link', 'https://ahtio.com/safe.php?link=');
  BypassedByBloggerPemula('venzoars.com', 'link', 'https://indids.com/token.php?id=');
  BypassedByBloggerPemula('short.sharedp.com', 'id', 'https://link.sharedp.com/?id=');
  BypassedByBloggerPemula('earn.tensailab.com', 'adlinkfly', 'https://go.snaply.in/');
  BypassedByBloggerPemula('postazap.com', 'link', 'https://encurtador.postazap.com/');
  BypassedByBloggerPemula('mamahawa.com', 'get', 'https://forextrader.site/SkipLink/');
  BypassedByBloggerPemula('shakib.quick91.com', 'link', 'https://link.get2short.com/');
  BypassedByBloggerPemula('reminimod.co', 'land', 'https://insurance.techymedies.com/');
  BypassedByBloggerPemula('indiamaja.com', 'link', 'https://newshuta.in/safe.php?link=');
  BypassedByBloggerPemula('tbhlabsnews.com', 'link', 'https://getlink.tbhlabsnews.com/');
  BypassedByBloggerPemula('interestingfactsare.com', 'link', 'https://m.urlbharat.xyz/');
  BypassedByBloggerPemula('djnonstopmusic.in', 'link', 'https://gadgets.ishortify.com/');
  BypassedByBloggerPemula('newshuta.in|60fpspubg.one', 'link', 'https://inshorturl.com/');
  BypassedByBloggerPemula('tech.filohappy.in', 'link', 'https://happyfiles.dtglinks.in/');
  BypassedByBloggerPemula('kelasadsense.com', 'adlinkfly', 'https://link.paid4link.com/');
  BypassedByBloggerPemula('trust.bgmi32bitapk.in', 'grey', 'https://get.instantearn.in/');
  BypassedByBloggerPemula('news.topsarkariyojana.in', 'link', 'https://go.just2earn.com/');
  BypassedByBloggerPemula('(cyberlynews|quizrent).com', 'id', 'https://linkshortify.com/');
  BypassedByBloggerPemula('cafe.warrenrahul.in', 'adlinkfly', 'https://go.warrenrahul.in/');
  BypassedByBloggerPemula('earn.bankshiksha.in', 'LinkShortUrlID', 'https://go.kingurl.in/');
  BypassedByBloggerPemula('techurlshort.in', 'grey', 'https://hrpunjab.in/savise.php?grey=');
  BypassedByBloggerPemula('ninjamodz.litonmods.com', 'adlinkfly', 'https://shortxlinks.in/');
  BypassedByBloggerPemula('kingyojana.com', 'link', 'https://newkhabar24.com/safe.php?link=');
  BypassedByBloggerPemula('sayphotobooth.com', 'babu', 'https://odiadance.com/safe2.php?link=');
  BypassedByBloggerPemula('odiadance.com', 'link', 'https://shakib.quick91.com/safe2.php?link=');
  BypassedByBloggerPemula('rajdhanimaja.com', 'grey', 'https://techurlshort.in/inuser.php?grey=');
  BypassedByBloggerPemula('highkeyfinance.com', 'landhere', 'https://insurance.techymedies.com/');
  BypassedByBloggerPemula('financeyogi.net', 'link', 'https://market.finclub.in/safe2.php?link=');
  BypassedByBloggerPemula('finance.marketrook.com', 'woo', 'https://marketrook.com/verify.php?see=');
  BypassedByBloggerPemula('(gam3ah|m4cut|soft3arbi|elmokhbir|fatednews|itechmafiia).com', 'link', '');
  BypassedByBloggerPemula('(surfsees|travelagancy).com', 'link', 'https://cryptings.in/token.php?id=');
  BypassedByBloggerPemula('newkhabar24.com', 'link', 'https://news.topsarkariyojana.in/safe.php?link=');
  BypassedByBloggerPemula(/mixrootmods.com/, function() {EnableRCF();window.checkStatus = window.off;});
  BypassedByBloggerPemula(/go.link4rev.site/, function() {location = location.href.replace('go.', '');});
  BypassedByBloggerPemula(/infinityskull.com/, {'/safe.php': ['link', 'https://go.publicearn.com/'],}, false);
  BypassedByBloggerPemula(/link.linksfire.co/, function() {location = location.href.replace('link', 'blog');});
  BypassedByBloggerPemula('ninjamodz.mtcremix.com', 'adlinkfly', 'https://ninjamodz.litonmods.com/?adlinkfly=');
  BypassedByBloggerPemula('bharatbestdeals.com', 'post', 'https://a1.payalgaming.co.in/click.php?LinkShortUrlID=');
  BypassedByBloggerPemula('(examnewstoday|kaomojihub).com', 'see', 'https://finance.marketrook.com/verify.php?woo=');
  BypassedByBloggerPemula('earnbox.sattakingcharts.in', 'LinkShortUrlID', 'https://trust.bgmi32bitapk.in/geio.php?grey=');
  BypassedByBloggerPemula('a1.payalgaming.co.in', 'LinkShortUrlID', 'https://earn.bankshiksha.in/click.php?LinkShortUrlID=');
  BypassedByBloggerPemula(/dutchycorp.space/, function() {if (BpParams.has('code')) {location = BpParams.getAll('code') + '?verif=0';}});
  BypassedByBloggerPemula('(earnc1.bankshiksha|domain.bgmiupdate.com).in', 'grey', 'https://a1.payalgaming.co.in/click.php?LinkShortUrlID=');
  BypassedByBloggerPemula(/(teachsansar|technicalatg|foodxor).com/, () => waitForElm("#wpsafegenerate > #wpsafe-link > a[href]", safe => redirect(safe.href,false)));
  BypassedByBloggerPemula(/vk.com/, function() {if (BpParams.has('to') && location.href.includes('/away.php')) {location = decodeURIComponent(BpParams.get('to'));} else {}});
  BypassedByBloggerPemula(/paster.gg/, () => {if (BpParams.has('link') && location.href.includes('/dynamic-user')) {location = decodeURIComponent(BpParams.get('link'));} else {}});
  BypassedByBloggerPemula(/ouo.io/, function() {if (BpParams.has('s') && location.href.includes('link.nevcoins.club')) {location = 'https://' + BpParams.getAll('s');} else if (BpParams.has('s')) {location = BpParams.getAll('s');}});
  BypassedByBloggerPemula(/linkbox.to/, function() {Listener(function(object) {if (object.url.includes('api/file/detail?itemId')) {console.log(object.responseText);const {data: {itemInfo}} = JSON.parse(object.responseText);console.log(itemInfo); redirect(itemInfo.url, false);}});});
  BypassedByBloggerPemula(/triggeredplay.com/, () => {if (location.href.includes('#')) {let trigger = new URLSearchParams(window.location.hash.substring(1));
      let redplay = trigger.get('url');if (redplay) {let decodedUrl = DecodeBase64(redplay);window.location.href = decodedUrl;}}});
  BypassedByBloggerPemula(/adbtc.top/, () => {CaptchaDone(() => {DoIfExists("input[class^=btn]");});let count = 0; setInterval(function() {if (bp("div.col.s4> a") && !bp("div.col.s4> a").className.includes("hide")) {count = 0;
    bp("div.col.s4> a").click();} else {count = count + 1;}}, 5000); window.onbeforeunload = function() {if (unsafeWindow.myWindow) {unsafeWindow.myWindow.close();}
      if (unsafeWindow.coinwin) {let popc = unsafeWindow.coinwin; unsafeWindow.coinwin = {}; popc.close();}};});
  BypassedByBloggerPemula(/youtube.com/, function() {if (location.href.includes('/shorts/') && cfg.get('YTShort')) {if (cfg.get('YTShort') == true) {location = location.href.replace('/shorts/', '/watch?v=');let Tubeshort = location.href;
    var observer = new MutationObserver(() => {if (location.href !== Tubeshort) {Tubeshort = location.href; if (location.href.includes('/shorts/')) location = location.href.replace('/shorts/', '/watch?v=');}});
    var short = {subtree: true,childList: true}; observer.observe(document, short);}} else {}});
  Object.defineProperty(document, 'querySelector', { value: document.querySelector, configurable: false, writable: false });
  const sl = (h => {
    switch (h.host) {case 'multiup.org': if (h.href.includes('/download/')) return h.href.replace('download/', 'en/mirror/'); break;
      case 'modsfire.com': if (/^\/([^\/]+)/.test(h.pathname)) {return 'https://modsfire.com/d/' + RegExp.$1;} break;
      case 'pixeldrain.com': if (h.href.includes('/u/')) return h.href.replace('u/', '/api/file/') + '?download'; break;
      case 'www.google.com': if (h.pathname === '/url' && h.searchParams.has('q')) {return h.searchParams.get('q');} break;
      case 'social-unlock.com': if (/^\/([^\/]+)/.test(h.pathname)) {return 'https://social-unlock.com/redirect/' + RegExp.$1;} break;
      case 'work.ink': if (/^\/([^\/]+)/.test(h.pathname)) {return 'https://adbypass.org/bypass?bypass=' + location.href.split('?')[0];} break;
      default: break;}})(new URL(location.href));if (sl) {location.href = sl;}
  // Injecting code from start and the end of document coded by @Konf
  if (cfg.get('BlockFC') == true) {NoFocus();} else {}
  if (cfg.get('RightFC') == true) {EnableRCF();} else {}
  if (['interactive', 'complete'].includes(document.readyState)) {onHtmlLoaded();} else {document.addEventListener('DOMContentLoaded', onHtmlLoaded);}
  function onHtmlLoaded() {
    let Numcode = bp('input.captcha_code');let DigitNum; function getLeft(d) {return parseInt(d.style.paddingLeft);} if (Numcode) {DigitNum = Numcode.parentElement.previousElementSibling.children[0].children; Numcode.value = [].slice.call(DigitNum).sort(function(d1, d2) {return getLeft(d1) - getLeft(d2);}).map(function(d) {return d.textContent;}).join('');}
    let List = ['lopteapi.com', '3link.co', 'web1s.com', 'vuotlink.vip'];let List1 = ['ay.live', 'gitlink.pro']; let $ = window.jQuery; let respect = 'https://sl1bas.blogspot.com/?BypassResults='; // Don't use My Scripts if You Change/Remove My Blogs, Except You Make Donations!!!.
    if (location.host === 'upfion.com') {} else if (List.includes(location.host)) {DoIfExists('a.btn.btn-success.btn-lg.get-link', 3, 'setInterval');
    } else if (List1.includes(location.host)) { var form = $('form[id=go-link]');$.ajax({type: 'POST', async: true, url: form.attr('action'),data: form.serialize(),dataType: 'json',
        success: function(data) {redirect(data.url);}});} else if (elementExists('form[id=go-link]')) {$('form[id=go-link]').unbind().submit(function(e) {e.preventDefault();
        var form = $(this);var url = form.attr('action');const pesan = form.find('button'); const notforsale = $(".navbar-collapse.collapse");const blogger = $(".main-header");const pemula = $(".col-sm-6.hidden-xs");
        $.ajax({type: "POST", url: url, data: form.serialize(), beforeSend: function(xhr) {pesan.attr("disabled", "disabled");$('a.get-link').text('Bypassed by Bloggerpemula');
            notforsale.replaceWith('<button class="btn btn-default , col-md-12 text-center" onclick="javascript: return false;"><b>Thanks for using Bypass All Shortlinks Scripts and for Donations , Regards : Bloggerpemula</b></button>');
            blogger.replaceWith('<button class="btn btn-default , col-md-12 text-center" onclick="javascript: return false;"><b>Thanks for using Bypass All Shortlinks Scripts and for Donations , Regards : Bloggerpemula</b></button>');
            pemula.replaceWith('<button class="btn btn-default , col-md-12 text-center" onclick="javascript: return false;"><b>Thanks for using Bypass All Shortlinks Scripts and for Donations , Regards : Bloggerpemula</b></button>');},
          success: function(result, status, xhr) {if (xhr.responseText.match('(insfly|Insfly).pw|(freecrypto|freeltc|a-s-cracks).top|mdiskshortner.link|(oscut|exashorts).fun|bigbtc.win|slink.bid|clockads.in|(promo-visits|rexlink).site')) {location.href = result.url;} else {redirect(result.url);}}});});}
    const bas = (h => {const b = h.pathname === '/verify/' && /^\?([^&]+)/.test(h.search); const result = {isNotifyNeeded: false,redirectDelay: 0,link: undefined};
      switch (h.host) {
        case 'gamerfang.in': if (b) {meta('https://faux.gamerfang.in/tech/' + RegExp.$1);} break;
        case 'blog.mphealth.online': if (b) {meta('https://techyuth.xyz/blog/' + RegExp.$1);} break;
        case 'mphealth.online': if (b) {meta('https://blog.mphealth.online/verify/?' + RegExp.$1);} break;
        case 'shrs.link': case 'shareus.io':
          if (/^\/old\/([^\/]+)/.test(h.pathname)) {return 'https://jobform.in/?link=' + RegExp.$1;} break;
        case 'www.gifans.com':
          if (/^\/link\/([^\/]+)/.test(h.pathname)) {return 'https://shortlink.prz.pw/' + RegExp.$1;} break;
        case 'www.pythondunyasi.com':
          if (h.pathname === '/p/blog-page_22.html' && h.searchParams.has('url')) {return h.searchParams.get('url').substring(1);} break;
        case 'sl1bas.blogspot.com': if (h.pathname === '/' && h.searchParams.has('BypassResults')) {
          result.link = decodeURIComponent(location.href.split('BypassResults=')[1].replace('&m=1', ''));
          result.redirectDelay = cfg.get('SetDelay'); result.isNotifyNeeded = true; return result;} break;
        case 'jrlinks.in':
          if (h.pathname === '/safe2.php' && h.searchParams.has('link')) {meta('https://internet.webhostingtips.club/' + h.searchParams.get('link'));} break;
        default: break;}})(new URL(location.href)); if (bas) {const {isNotifyNeeded, redirectDelay, link} = bas;
      if (isNotifyNeeded) {notify(`Please Wait in @ Seconds , Tell Amm0ni4 to Delete His Debloated if You Want My Script to be Updated Regularly , Thanks`);}
      setTimeout(() => {location.href = link;}, redirectDelay * 1000);}
    // My Script will automatically download from the site below , Enable it from the Settings
    if (cfg.get('AutoDL') == true) {
    BypassedByBloggerPemula(/upload.ee/, function() {DoIfExists('#d_l', 2);});
    BypassedByBloggerPemula(/appdrive\.*/, function() {DoIfExists('#drc', 2);});
    BypassedByBloggerPemula(/dayuploads.com/, () => {DoIfExists('#ad-link2', 2);});
    BypassedByBloggerPemula(/dddrive.me/, () => {DoIfExists('.btn-outline-primary', 2);});
    BypassedByBloggerPemula(/uppit.com/, () => {DoIfExists('.btn-primary.btn-xl.btn', 2);});
    BypassedByBloggerPemula(/krakenfiles.com/, () => {DoIfExists('.download-now-text', 2);});
    BypassedByBloggerPemula(/file-upload.net/, () => {DoIfExists('#downbild.g-recaptcha', 2);});
    BypassedByBloggerPemula(/userscloud.com|dosya.co/, () => {DoIfExists('#btn_download', 2);});
    BypassedByBloggerPemula(/hexupload.net/, () => {DoIfExists('.btn-success.btn-lg.btn', 1);});
    BypassedByBloggerPemula(/gofile.io/, () => {waitForElm('a.me-1', gfBtn => gfBtn.click());});
    BypassedByBloggerPemula(/rapidgator.net/, () => {DoIfExists('.btn-free.act-link.link', 2);});
    BypassedByBloggerPemula(/dbree.me/, () => {DoIfExists('.center-block.btn-default.btn', 2);});
    BypassedByBloggerPemula(/dropgalaxy.com/, () => {DoIfExists("button[id^='method_fre']", 2);});
    BypassedByBloggerPemula(/megaupto.com/, () => {DoIfExists('#direct_link > a:nth-child(1)', 2);});
    BypassedByBloggerPemula(/karanpc.com/, () => {DoIfExists('#downloadButton > form', 'submit', 2);});
    BypassedByBloggerPemula(/douploads.net/, () => {DoIfExists('.btn-primary.btn-lg.btn-block.btn', 2);});
    BypassedByBloggerPemula(/dataupload.net/, async function() {await sleep(5000);ReadytoClick('.downloadbtn');});
    BypassedByBloggerPemula(/buzzheavier.com/, function() {waitForElm('#download-link', bhvBtn => bhvBtn.click());});
    BypassedByBloggerPemula(/filemoon.sx/, () => waitForElm('div.download2 a.button', fm => redirect(fm.href, false)));
    BypassedByBloggerPemula(/dailyuploads.net/, () => {CaptchaDone(() => {DoIfExists('#downloadbtn');});DoIfExists('#fbtn1', 2);});
    BypassedByBloggerPemula(/bestfonts.pro/, () => waitForElm('.download-font-button > a:nth-child(1)', pro => redirect(pro.href)));
    BypassedByBloggerPemula(/uploadev.org/, () => {CaptchaDone(() => {DoIfExists('#downloadbtn');});DoIfExists('#direct_link > a', 2);});
    BypassedByBloggerPemula(/files.fm/, () => waitForElm('#head_download__all-files > div > div > a:nth-child(1)', flBtn => flBtn.click()));
    BypassedByBloggerPemula(/megaup.net/, function() {waitForElm('a.btn.btn-default', muBtn => muBtn.click());DoIfExists('#btndownload', 7);});
    BypassedByBloggerPemula(/mega4upload.net/, () => {DoIfExists("input[name=mega_free]",2);CaptchaDone(() => {DoIfExists('#downloadbtn');});});
    BypassedByBloggerPemula(/financemonk.net/, () => {CaptchaDone(() => {DoIfExists('#downloadBtnClick');});DoIfExists('#dllink', 'submit', 3);});
    BypassedByBloggerPemula(/usersdrive.com|ddownload.com/, () => {CaptchaDone(() => {DoIfExists('#downloadbtn');});DoIfExists('.btn-download.btn', 1);});
    BypassedByBloggerPemula(/adoc.pub/, () => {DoIfExists('.btn-block.btn-success.btn', 2);CaptchaDone(() => {DoIfExists('.mt-15.btn-block.btn-success.btn-lg.btn');});});
    BypassedByBloggerPemula(/pdfcoffee.com/, () => {DoIfExists('.btn-block.btn-success.btn', 2);CaptchaDone(() => {DoIfExists('.my-2.btn-block.btn-primary.btn-lg.btn');});});
    BypassedByBloggerPemula(/uploady.io/, () => {CaptchaDone(() => {DoIfExists('#downloadbtn');});DoIfExists('#free_dwn', 2);DoIfExists('.rounded.btn-primary.btn', 2);});
    BypassedByBloggerPemula(/file-upload.org/, () => {DoIfExists("button[name='method_free']", 2);DoIfExists('.download-btn',2);CaptchaDone(() => {DoIfExists('#downloadbtn');});});
    BypassedByBloggerPemula(/up-load.io|downloadani.me/, () => {DoIfExists("input[name='method_free']", 2);DoIfExists('.btn-dow.btn', 1);CaptchaDone(() => {DoIfExists('#downloadbtn');});});
    BypassedByBloggerPemula(/up-4ever.net/, () => {DoIfExists("input[name='method_free']", 2);DoIfExists('#downLoadLinkButton', 5);CaptchaDone(() => {DoIfExists('#downloadbtn');});});
    BypassedByBloggerPemula(/mexa.sh/, () => {parent.open = BpBlock();DoIfExists('#Downloadfre', 2);DoIfExists('#direct_link', 2);CaptchaDone(() => {DoIfExists('#downloadbtn');});});
    BypassedByBloggerPemula(/hitfile.net/, () => {CaptchaDone(() => {DoIfExists('#submit');});DoIfExists('.nopay-btn.btn-grey',2);waitForElm('#popunder2', hfl2 => redirect(hfl2.href, false),37);});
    BypassedByBloggerPemula(/4fnet.org/, function() {if (location.href.includes('/goto')) {let fnet = location.href.split('/').slice(-1);redirect(atob(fnet),false);}});
    BypassedByBloggerPemula(/oxy\.*/, function() {if (elementExists('#divdownload')) {let oxy = bp('.ocdsf233').getAttribute('data-source_url');redirect(oxy, false);}});
    BypassedByBloggerPemula(/udrop.com/, () => waitForElm('.responsiveMobileMargin > button:nth-child(1)', udr => redirect(strBetween(udr.onclick.toString(), `openUrl('`, `')`), false)));
    BypassedByBloggerPemula(/mp4upload.com/, function() {
      DoIfExists('#todl', 2);DoIfExists("form[name='F1']", 'submit', 1);});
    BypassedByBloggerPemula(/drop.download/, function() {
      DoIfExists('#method_free', 2);DoIfExists('.btn-download', 2);});
    BypassedByBloggerPemula(/workupload.com/, function() {
      if (elementExists('#download')) {DoIfExists('.btn-prio.btn', 2);}});
    BypassedByBloggerPemula(/hxfile.co|ex-load.com|megadb.net/, function() {
      DoIfExists('.btn-dow.btn', 2);DoIfExists("form[name='F1']", 'submit', 1);});
    BypassedByBloggerPemula(/send.cm/, function() {
      if (elementExists('#fileinfo')) {DoIfExists('#downloadbtn', 1);} else {}});
    BypassedByBloggerPemula(/mega4up.org/, function() {
      DoIfExists('input.btn.btn-info.btn-sm', 2);DoIfExists('.btn-dark.btn', 2);});
    BypassedByBloggerPemula(/docs.google.com/, function() {
      if (elementExists('#uc-dl-icon')) {DoIfExists('#downloadForm', 'submit', 1);} else {}});
    BypassedByBloggerPemula(/uploadhaven.com/, function() {
      DoIfExists('.alert > a:nth-child(1)', 2);DoIfExists('#form-download', 'submit', 1);});
    BypassedByBloggerPemula(/k2s.cc/, function() {DoIfExists('.button-download-slow', 2);
      waitForElm('a.link-to-file', k2s => redirect(k2s.href, false));});
    BypassedByBloggerPemula(/ac.totsugeki.com/, function() {
      $("a[target='_blank']").removeAttr("target");DoIfExists('.btn-lg.btn-success.btn', 2);});
    BypassedByBloggerPemula(/anonym.ninja/, function() {
      if (location.href.includes('download/')) {var fd = window.location.href.split('/').slice(-1)[0];
      redirect(`https://anonym.ninja/download/file/request/${fd}`);} else {}});
    BypassedByBloggerPemula(/vosan.co/, function() {bp('.elementor-size-lg').removeAttribute('target');
      DoIfExists('.elementor-size-lg', 2);DoIfExists('.wpdm-download-link', 2);});
    BypassedByBloggerPemula(/apkmody.io/, function() {
      if (elementExists('div.wp-block-buttons > div')) {location = location.href + '/download/mod';}});
    BypassedByBloggerPemula(/upfion.com/, () => {if (elementExists('.file-main.form-main')) {
        DoIfExists('.my-2.text-center > .btn-primary.btn', 2);CaptchaDone(() => {DoIfExists('#link-button');});}});
    BypassedByBloggerPemula(/takefile.link/, function() {
      if (elementExists('#F1')) {DoIfExists('div.no-gutter:nth-child(2) > form:nth-child(1)', 'submit', 1);} else {}});
    BypassedByBloggerPemula(/appsblaze.com/, function() {
      if (elementExists('#box-0')) {waitForElm("input[name='slink']", abl => redirect(abl.href, false));} else {}});
    BypassedByBloggerPemula(/modcombo.com/, function() {
      if (location.href.includes('download/')) {waitForElm('div.item.item-apk a', mc => redirect(mc.href, false));
        DoIfExists('a.btn.btn-submit', 6);} else {DoIfExists('a.btn.btn-red.btn-icon.btn-download.br-50', 2);}});
    BypassedByBloggerPemula(/1fichier.com/, function() {
      if (elementExists('#pass')) {} else {DoIfExists('.btn-orange.btn-general.ok', 1);DoIfExists('.alc', 'submit', 1);}});
    BypassedByBloggerPemula(/fileresources.net/, function() {
      if (elementExists('.download-timer')) {waitForElm('a.btn.btn-default', fpr => redirect(fpr.href, false));} else {}});
    BypassedByBloggerPemula(/freepreset.net/, function() {
      if (elementExists('#button_download')) {waitForElm('a#button_download', fpr => redirect(fpr.href, false));} else {}});
    BypassedByBloggerPemula(/doodrive.com/, function() {DoIfExists('.tm-button-download.uk-button-primary.uk-button', 3);
      waitForElm('.uk-container > div > .uk-button-primary.uk-button', ddr => redirect(ddr.href, false));});
    BypassedByBloggerPemula(/gocmod.com/, function() {
      if (elementExists('.view-app')) {bp('#no-link').removeAttribute('target');DoIfExists('.download-line-title', 2);}});
    BypassedByBloggerPemula(/(uploadrar|fingau|getpczone|wokaz).com|uptomega.me/, function() {DoIfExists('.mngez-free-download', 2);
      DoIfExists('#direct_link > a:nth-child(1)', 2);$('#downloadbtn').click();});
    BypassedByBloggerPemula(/mediafire.com/, function() {var bass;var md = function closeWindows() {window.close();clearInterval(bass);};
      var mf = bp('.download_link .input').getAttribute('href');console.log(mf);location.replace(mf);bass = setInterval(md, 1000 * 5);});
    BypassedByBloggerPemula(/qiwi.gg/, function() {if (elementExists("div [class^='page_DownloadPage']")) {
      DoIfExists("button[class^='DownloadButton_ButtonSoScraperCanTakeThisName']", 2);
        let qiwi = bp("a[class^='DownloadButton_DownloadButton']"); setTimeout(() => {redirect(qiwi.href, false);}, 3 * 1000);} else {}});
    BypassedByBloggerPemula(/turbobit.net/, () => {if (elementExists('#turbo-table')) {let tb = bp('#nopay-btn').href;redirect(tb, false);}
      CaptchaDone(() => {DoIfExists('#submit');});waitForElm('#free-download-file-link', tur => redirect(tur.href, false));});
    BypassedByBloggerPemula(/sharemods.com/, function() {DoIfExists('#dForm', 'submit', 2);
      if (elementExists('.download-file-holder')) {waitForElm('a#downloadbtn.btn.btn-primary', smd => redirect(smd.href, false));} else {}});
    BypassedByBloggerPemula(/(kusonime|oploverz).org|(opinimedia|beritaotaku|caramasak).com|otakudesu.cc|resepkoki.net|neonime\.*/, function() {
      waitForElm('.bg-gb.dwto.sdw', kmBtn => kmBtn.click());waitForElm('a.sdw.dwto.bg-gb', kmk => redirect(kmk.href, false));});
    BypassedByBloggerPemula(/clickndownload.org|clicknupload\.*/, function() {if (elementExists('.download')) {DoIfExists('span.downloadbtn', 10);
      DoIfExists('#method_free', 2);waitForElm('a.downloadbtn', cnu => redirect(cnu.href, false));}});
    BypassedByBloggerPemula(/leechpub.com/, function() {
      if (elementExists('.text-center.py-6')) {waitForElm('a.btn.btn-lg.btn-success.mb-1.px-6.lh-10', lpub => redirect(lpub.href, false));} else {}});
    BypassedByBloggerPemula(/rawlazy.si/, function() {
      if (elementExists('#captcha_form')) {DoIfExists('.go-to-captcha-form', 2);} else {waitForElm('.color-btn', rlz => redirect(rlz.href, false));}});
    BypassedByBloggerPemula(/downloader.tips/, () => {CaptchaDone(() => {DoIfExists('button.btn.btn-primary');});
      let downloader = setInterval(() => {if (bp('#count').innerText == '0') {clearInterval(downloader);DoIfExists('.btn-primary.btn');}}, 1 * 1000);});
    BypassedByBloggerPemula(/modsbase.com/, function() {
      if (elementExists('.file-panel')) {DoIfExists('.download-file-btn', 2);waitForElm('#downloadbtn > a', mba => redirect(mba.href, false));} else {}});
    BypassedByBloggerPemula(/(thecubexguide|miuiflash).com|(djxmaza|jytechs).in/, function() {if (elementExists('.premium')) {
        ReadytoClick('a#dlbtn.btn.btn-secondary.btn-block.mb-4', 2);DoIfExists('#downloadbtnf', 3);DoIfExists('#downloadbtn', 4, 'setInterval');} else {}});
    BypassedByBloggerPemula(/filedm.com/, function() {
      if (elementExists('#dlbutton')) {waitForElm('#dlbutton', fdm => redirect('http://cdn.directfiledl.com/getfile?id=' + fdm.href.split('_')[1], false));} else {}});
    BypassedByBloggerPemula(/drive.google.com/, function() {var dg = window.location.href.split('/').slice(-2)[0];
      if (window.location.href.includes('drive.google.com/file/d/')) {redirect(`https://drive.usercontent.google.com/download?id=${dg}&export=download`, false).replace('<br />', '');
      } else if (window.location.href.includes('drive.google.com/u/0/uc?id')) {DoIfExists('#download-form', 'submit', 1);} else {}});
    BypassedByBloggerPemula(/4shared.com/, function() {if (elementExists('.d3topTitle')) {
        $('.premium').text('IMPORTANT TRICKS By BloggerPemula : Updated Feb 2023, Look like now not working ,so Sorry at This Time i Dont have Idea to fix it . Regards...');}
      DoIfExists('.jsDownloadButton', 2);if (elementExists('.freeDownloadButton')) {DoIfExists("form[name^='redirectToD3Form']", 'submit', 3);}});
    } else {} // Does Nothing if You Not Tick Auto Download From Menu Settings
    // End of Auto Download , Leave Good Feedback if Your Favorite Sites Not yet Supported or Error on Downloading Process

    BypassedByBloggerPemula(/the2.link/, () => {DoIfExists('#get-link-btn',3);});
    BypassedByBloggerPemula(/devnote.in/, () => {DoIfExists('#getlinks.btn', 2);});
    BypassedByBloggerPemula(/megaurl.win/, () => {DoIfExists('#generate_link', 2);});
    BypassedByBloggerPemula(/keeplinks.org/, function() {DoIfExists('#btnchange', 2);});
    BypassedByBloggerPemula(/earnlink.io/, function() {DoIfExists('.btn-secondary', 3);});
    BypassedByBloggerPemula(/mkomsel.com/, function() {DoIfExists('#downloadfile', 12);});
    BypassedByBloggerPemula(/onimports.com.br/, function() {DoIfExists('#finalLink', 2);});
    BypassedByBloggerPemula(/1shortlink.com/, function() {DoIfExists('#redirect-link', 3);});
    BypassedByBloggerPemula(/1ink.cc|cuturl.cc/, function() {DoIfExists('#countingbtn', 1);});
    BypassedByBloggerPemula(/jameeltips.us/, function() {DoIfExists('#continue_button_1', 1);});
    BypassedByBloggerPemula(/post.copydev.com/, function() {DoIfExists('.btn-success.btn', 6);});
    BypassedByBloggerPemula(/1short.io/, function() {DoIfExists('#countDownForm', 'submit', 7);});
    BypassedByBloggerPemula(/linegee.net/, function() {DoIfExists('.btn-xs.btn-primary.btn', 2);});
    BypassedByBloggerPemula(/bedrat.xyz|uhtrdr47.online/, function() {DoIfExists('#link1112', 5);});
    BypassedByBloggerPemula(/pro.sh/, function() {DoIfExists('.btn-secondary', 3, 'setInterval');});
    BypassedByBloggerPemula(/playpaste.com/, () => {CaptchaDone(() => {DoIfExists('button.btn');});});
    BypassedByBloggerPemula(/proappapk.com|meclipstudy.in/, function() {DoIfExists('#gotolink', 5);});
    BypassedByBloggerPemula(/1bitspace.com/, function() {DoIfExists('.button-element-verification',3);});
    BypassedByBloggerPemula(/cshort.org/, function() {DoIfExists('.timer.redirect', 3, 'setInterval');});
    BypassedByBloggerPemula(/render-state.to/, function() {if (BpParams.has('link')) {window.goToLink();}});
    BypassedByBloggerPemula(/dogefury.com|go.tfly.link/, () => {DoIfExists('#form-continue', 'submit', 2);});
    BypassedByBloggerPemula(/offerwall.me|ewall.biz/, () => {CaptchaDone(() => {DoIfExists('#submitBtn');});});
    BypassedByBloggerPemula(/linkpay.cc/, () => {parent.open = BpBlock();DoIfExists('#link-view', 'submit', 1);});
    BypassedByBloggerPemula(/dramaticqueen.com/, () => {DoIfExists('#notarobot.button',3);DoIfExists('#btn7',4);});
    BypassedByBloggerPemula(/cooklike.info|model-tas-terbaru.com/, {'/': ['link', 'https://yousm.link/'],}, false);
    BypassedByBloggerPemula(/kisalt.digital/, function() {if (BpParams.has('u')) {meta(atob(BpParams.get('u')));}});
    BypassedByBloggerPemula(/bildirim.in|bildirim.eu|bildirim.link/, function() {DoIfExists('#btnPermission', 1);});
    BypassedByBloggerPemula(/enlacito.com/, () => {setTimeout(() => {redirect(window.DYykkzwP,false);}, 2 * 1000);});
    BypassedByBloggerPemula(/firefaucet.win/, function() {CaptchaDone(() => {DoIfExists('button[type=submit]',1);});});
    BypassedByBloggerPemula(/aryx.xyz/, () => {DoIfExists('.container > div:nth-child(4) > button:nth-child(1)', 3);});
    BypassedByBloggerPemula(/linkforearn.com/, () => waitForElm('#shortLinkSection a', linkf => redirect(linkf.href)));
    BypassedByBloggerPemula(/loanifyt.site/, () => {DoIfExists("form[name='tp']", 'submit', 3);DoIfExists('#btn6', 4);});
    BypassedByBloggerPemula(/techsl.online/, () => {DoIfExists("form[name='rtg']", 'submit', 3);DoIfExists('#btn6', 4);});
    BypassedByBloggerPemula(/webhostingtips.club/, {'/safe.php': ['link', 'https://jrlinks.in/safe2.php?link='],}, false);
    BypassedByBloggerPemula(/downfile.site/, () => {DoIfExists('button.h-captcha', 2);DoIfExists('#megaurl-submit', 3);});
    BypassedByBloggerPemula(/uptobhai\.*|uplinkto\.*|shortlinkto\.*/, () => {DoIfExists('.btn-block.btn-primary.btn', 2);});
    BypassedByBloggerPemula(/michaelemad.com|7misr4day.com/, () => waitForElm('a.s-btn-f', mld => redirect(mld.href, false)));
    BypassedByBloggerPemula(/imagereviser.com/, () => {CheckVisibility('.tick.wgicon', () => {DoIfExists('.bottom_btn');});});
    BypassedByBloggerPemula(/shareus.io/, function() {if (BpParams.has('sid')) {ReadytoClick('button.MuiButtonBase-root', 2);}});
    BypassedByBloggerPemula(/adtival.network/, function() {if (BpParams.has('shortid')) {meta(atob(BpParams.get('shortid')));}});
    BypassedByBloggerPemula(/tii.la|oei.la|iir.la|tvi.la|oii.la|tpi.li/, () => {CaptchaDone(() => {DoIfExists('#continue');});});
    BypassedByBloggerPemula(/(bnbfree|freeth|freebitco).in/, () => {CaptchaDone(() => {DoIfExists('#free_play_form_button');});});
    BypassedByBloggerPemula(/vuotnhanh.com/, () => waitForElm('a#result.safelink.btn.btn-lg.btn-success', vuot => redirect(vuot.href)));
    BypassedByBloggerPemula(/khaddavi.net|contentmenarik.com/, () => {parent.open = BpBlock();CaptchaDone(() => {DoIfExists('#slu-btn');});});
    BypassedByBloggerPemula(/gobits.me|zcash.one|clickscoin.com|beycoin.xyz|bitsusdt.com|adsluffa.online/, function() {DoIfExists('#mdt', 3);});
    BypassedByBloggerPemula(/cutnet.net|(exego|cety).app|(jixo|jizo|gamco).online|cutyion.com/, () => {DoIfExists('#submit-button', 5, 'setInterval');});
    BypassedByBloggerPemula(/keedabankingnews.com|healthvainsure.site/, function() {DoIfExists("form[name='tp']", 'submit', 3);DoIfExists('#tp-snp2',4);});
    BypassedByBloggerPemula(/(financewada|utkarshonlinetest).com/, () => {DoIfExists('.get_btn.step_box > .btn', 2);ReadytoClick('.get_btn a[href]', 3);});
    BypassedByBloggerPemula(/sharetext.me/, function() {if (location.href.includes('/redirect') && BpParams.has('url')) {meta(atob(BpParams.get('url')));}});
    BypassedByBloggerPemula(/sfl.gl|moneyblink.com/, function() {if (location.href.includes('/ready') && BpParams.has('u')) {meta(atob(BpParams.get('u')));}});
    BypassedByBloggerPemula(/comohoy.com/, function() {if (location.href.includes('/grab/out.html') && BpParams.has('url')) {meta(atob(BpParams.get('url')));}});
    BypassedByBloggerPemula(/linkforearn.click/, () => waitForElm('#shortLinkSection.short-link-section a.btn', linkforearn => redirect(linkforearn.href, false)));
    BypassedByBloggerPemula(/(fourlinez|newsonnline|phonesparrow|creditcarred).com|(alljntuworld|updatewallah|vyaapaarguru).in/, () => {ReadytoClick('#continue-show', 12);});
    BypassedByBloggerPemula(/alorra.com/, () => {CheckVisibility('.ast-post-format- > button', () => {DoIfExists('.single-layout-1.ast-post-format- > button');});});
    BypassedByBloggerPemula(/bitcotasks.com/, () => {CheckVisibility('#captcha-container', '&&', "bp('.mb-2').innerText == 'Verified'", () => {window.continueClicked();});});
    BypassedByBloggerPemula(/apkw.ru/, function() {if (location.href.includes('/away')) {let apkw = location.href.split('/').slice(-1);redirect(atob(apkw),false);}});
    BypassedByBloggerPemula(/programasvirtualespc.net/, function() {if (location.href.includes('out/')) {const pvc = location.href.split('?')[1]; redirect(atob(pvc),false);} else {}});
    BypassedByBloggerPemula(/(blackleadr|shortcuthigh|newztalkies|cybertyrant).com|hubdrive.me|fileroot.net|nzarticles.pro/, function() {if (BpParams.has('r')) {meta(atob(BpParams.get('r')));}});
    BypassedByBloggerPemula(/(10short|lollty).pro|mamahawa.com/, function() {ReadytoClick('center > .btn-success.btn', 3);waitForElm('a#makingdifferenttimer', st1 => redirect(st1.href, false));waitForElm('a#proceed', st2 => redirect(st2.href, false));});
    BypassedByBloggerPemula(/(aduzz|tutorialsaya|indobo|baristakesehatan|merekrut).com|deltabtc.xyz|bit4me.info/, () => {waitForElm("div[id^=wpsafe] > a[rel=nofollow]", tiny => redirect(strBetween(tiny.onclick.toString(), `window.open('`, `', '_self')`), false));});
    BypassedByBloggerPemula(/cryptfaucet.com|izseo.net/, function() {window.checkTimeRemaining = true;let cryptf = bp("div[id^=wpsafe] > a[rel=nofollow]");setTimeout(() => {redirect(strBetween(cryptf.onclick.toString(), `window.open('`, `', '_self')`), false);}, 5 * 1000);});
    BypassedByBloggerPemula(/fansonlinehub.com/, async function() {setInterval(() => {window.scrollBy(0, 1);window.scrollTo(0,-1);ReadytoClick('.active.btn > span');}, 3 * 1000);});
    BypassedByBloggerPemula(/(howifx|vocalley|financerites|yogablogfit|healthfirstweb|junkyponk|mythvista|blog-myst).com|ss7.info|sololevelingmanga.pics/, () => {DoIfExists('#getlink', 3);});
    BypassedByBloggerPemula(/(viralxns|uploadsoon).com/, function(){DoIfExists('#tp-snp2.tp-blue.tp-btn', 2);DoIfExists('.tp-white.tp-btn', 3);});
    BypassedByBloggerPemula(/setroom.biz.id/, () => {CheckVisibility('#txt3', () => {window.rtglink();DoIfExists('#button3 .rtg-button', 1);});});
    BypassedByBloggerPemula(/largestpanel.in|(djremixganna|financebolo).com|(earnme|usanewstoday).club/, () => {DoIfExists('#tp-snp2', 1);});
    BypassedByBloggerPemula(/ouo.io|ouo.press/, async function() {await sleep(4000);ReadytoClick('button#btn-main.btn.btn-main');});
    BypassedByBloggerPemula(/lksfy.com/, () => {CaptchaDone(() => {DoIfExists('.get-link.btn-primary.btn');});});
    BypassedByBloggerPemula(/paste1s.com|note1s.com/, function() {DoIfExists('.btn-lg.btn-primary.btn', 2);});
    BypassedByBloggerPemula(/terabox.fun/, async function() {await sleep(3000);ReadytoClick('.active.btn');});
    BypassedByBloggerPemula(/karyawan.co.id/, function() {
      DoIfExists('button#btn.bg-blue-100.text-blue-600', 3);});
    BypassedByBloggerPemula(/icerik.site/, function() {
      DoIfExists('#csubmit', 2);DoIfExists('#get_link_btn', 2);});
    BypassedByBloggerPemula(/ponselharian.com/, function() {
      if (elementExists('#link-view')) {window.scrollTo(0, 9999);}});
    BypassedByBloggerPemula(/assettoworld.com/, function() {
      DoIfExists('.text-capitalize.btn-outline-success.btn', 3);});
    BypassedByBloggerPemula(/adfoc.us/, function() {
      if (elementExists('#skip')) {let adf = bp('.skip').href; redirect(adf);}});
    BypassedByBloggerPemula(/yoshare.net|olhonagrana.com/, function() {
      DoIfExists('#yuidea', 'submit', 2);DoIfExists('#btn6', 2);});
    BypassedByBloggerPemula(/oii.io/, function() {parent.open = BpBlock();
      DoIfExists('button.g-recaptcha.btn.btn-primary', 2);});
    BypassedByBloggerPemula(/mrproblogger.com|themezon.net/, function() {
      waitForElm('#btn2.tp-btn', mrBp => mrBp.click());
      waitForElm('div.center-link-items a', thz => redirect(thz.href, false));});
    BypassedByBloggerPemula(/forex-golds.com|forex-trnd.com/, function() {
      parent.open = BpBlock();DoIfExists('.g-recaptcha', 2);});
    BypassedByBloggerPemula(/1link.club/, function() {
      $("a[target='_blank']").removeAttr("target");DoIfExists('#download', 1);});
    BypassedByBloggerPemula(/slink.bid/, function() {
      DoIfExists('#btn-generate', 1);
      DoIfExists('.btn-success.btn', 5);});
    BypassedByBloggerPemula(/blog.yurasu.xyz/, function() {
      DoIfExists('#wcGetLink', 2);DoIfExists('#gotolink', 3);});
    BypassedByBloggerPemula(/zegtrends.com/, function() {DoIfExists('#cln', 'submit', 5);
      DoIfExists('#bt1', 5);DoIfExists('#go', 5);});
    BypassedByBloggerPemula(/coincroco.com|surflink.tech/, function() {
      waitForElm('.mb-sm-0.mt-3.btnBgRed', ccBtn => ccBtn.click());});
    BypassedByBloggerPemula(/solidcoins.net|fishingbreeze.com/, () => {
      CaptchaDone(() => {DoIfExists('form[action]', 'submit');});
      if (!elementExists('.g-recaptcha')) {DoIfExists('mdn', 'submit', 17);}});
    BypassedByBloggerPemula(/bigbtc.win/, () => {CaptchaDone(() => {DoIfExists('#claimbutn');});
      if (location.href.includes('/bonus')) {DoIfExists('#clickhere', 2);}});
    BypassedByBloggerPemula(/linkspy.cc/, function() {
      if (elementExists('.skipButton')) {let lsp = bp('.skipButton').href;redirect(lsp, false);}});
    BypassedByBloggerPemula(/(superheromaniac|spatsify|mastkhabre|ukrupdate).com/, () => {
      DoIfExists('#tp98', 10);DoIfExists('#btn6', 12);DoIfExists("form[name='tp']", 'submit', 11);});
    BypassedByBloggerPemula(/4hi.in|shortie.sbs|10short.com|finish.wlink.us|passivecryptos.xyz|fbol.top/, () => {
      DoIfExists('#form-continue', 'submit', 2);CaptchaDone(() => {DoIfExists('#invisibleCaptchaShortlink');});});
    BypassedByBloggerPemula(/chainfo.xyz/, () => {
      if (location.href.includes('/next/')) {redirect('https://www.google.com/url?q=https://setroom.biz.id');}});
    BypassedByBloggerPemula(/100puan.com/, function() {
      DoIfExists('.big-text', 3);waitForElm('div.bb-sticky-el a', pbz => redirect(pbz.href, false));});
    BypassedByBloggerPemula(/sub2get.com/, function() {
      if (elementExists('#butunlock')) {let subt = bp('#butunlock > a:nth-child(1)').href;redirect(subt);}});
    BypassedByBloggerPemula(/(fc-lc|loaninsurehub).com|fc-lc.xyz/, function() {DoIfExists('#invisibleCaptchaShortlink', 3);
      DoIfExists('#getlink', 3);DoIfExists('#glink', 4);DoIfExists('#surl', 5);});
    BypassedByBloggerPemula(/go.shareus.in/, function() {
      if (BpParams.has('shortid') && BpParams.has('link')) {meta(atob(BpParams.get('link')));}});
    BypassedByBloggerPemula(/infonerd.org|coingraph.us/, () => {EnableRCF();
      CheckVisibility('#redirectButton', '||', "bp('#countdown').innerText == '0'", () => {window.redirectToUrl();});});
    BypassedByBloggerPemula(/leitup.com/, function() {
      if (elementExists('#button_timer')) {waitForElm('input.form-control', leit => redirect(leit.placeholder, false));}});
    BypassedByBloggerPemula(/(blogmado|kredilerim|insuranceleadsinfo).com/, () => {
      CaptchaDone(() => {DoIfExists('button.btn');});waitForElm('a.get-link.disabled a', cho => redirect(cho.href, false));});
    BypassedByBloggerPemula(/azmath.info/, () => {if (elementExists('#megaurl-verified-captcha')) {
      DoIfExists('button.h-captcha', 3);} else {DoIfExists('#megaurl-banner-page', 'submit', 2);}});
    BypassedByBloggerPemula(/litecoin.host|cekip.site/, () => {CaptchaDone(() => {DoIfExists('#ibtn');});
      if (elementExists('.pt-5.card-header')) {CheckVisibility('.btn-primary.btn', () => {DoIfExists('.btn-primary.btn');});}});
    BypassedByBloggerPemula(/(travelinian|ecryptly|equickle).com/, () => {if (BpParams.has('id')) {meta(atob(BpParams.get('id')));}
      waitForElm('#open-continue-form > input:nth-child(3)', Chain => redirect(atob(Chain.value)));DoIfExists('#rtg-snp2', 2);});
    BypassedByBloggerPemula(/coinsrev.com/, () => {parent.open = BpBlock();CaptchaDone(() => {DoIfExists('#wpsafelinkhuman > input');});
      DoIfExists('#wpsafe-generate > a > img', 3);DoIfExists('input#image3', 13);});
    BypassedByBloggerPemula(/www.google.com|recaptcha.net/, async function() {await sleep(3000) && cfg.get('reCAPTCHA') && cfg.get('ApiKey');
      if (!APIKEY && cfg.get('reCAPTCHA') == true) {ReadytoClick('.recaptcha-checkbox-border');} else {}});
    BypassedByBloggerPemula(/newassets.hcaptcha.com/, async function() {await sleep(3000) && cfg.get('hCaptcha') && cfg.get('ApiKey');
      if (!APIKEY && cfg.get('hCaptcha') == true) {ReadytoClick('#checkbox');} else {}});
    BypassedByBloggerPemula(/(ez4mods|game5s|supermodsmenus|sharedp|fastcars1).com|tech5s.co|a4a.site/, () => {DoIfExists('div.text-center form', 'submit', 2);
      ReadytoClick('#go_d', 1);waitForElm('a#go_d.submitBtn.btn.btn-primary', ez => redirect(ez.href, false));
      waitForElm('a#go_d2.submitBtn.btn.btn-primary', ez2 => redirect(ez2.href, false));});
    BypassedByBloggerPemula(/mazen-ve3.com/, function() {EnableRCF();let maze = setInterval(() => {
        if (bp('.filler').innerText == 'Wait 0 s') {clearInterval(maze);ReadytoClick('#btn6');ReadytoClick('.btn-success.btn', 1);}}, 2 * 1000);});
    BypassedByBloggerPemula(/soft3arbi.com/, function() {EnableRCF();let arbi = setInterval(() => {
        if (bp('.progress-done').innerText == '100%') {clearInterval(arbi);ReadytoClick('#continue-button');ReadytoClick('.btn-success.btn', 1);}}, 2 * 1000);});
    BypassedByBloggerPemula(/(coinsward|blogsward).com/, async function() {if (elementExists('.g-recaptcha')) {var bw = bp("input[name=newwpsafelink]");
      redirect(JSON.parse(atob(bw.value)).linkr, false);} else {window.incrementRedirectCount(); await sleep(2000); window.handleButtonClick();}});
    BypassedByBloggerPemula(/(tmail|labgame).io|(gamezizo|fitdynamos).com/, function() {
      if (elementExists('#next')) {DoIfExists('form.text-center', 'submit', 3);DoIfExists('#next', 2);DoIfExists('#glink', 15);} else {DoIfExists('#surl', 5);}});
    BypassedByBloggerPemula(/(exeo|exego).app|(falpus|exe-urls|exnion).com|4ace.online/, () => {DoIfExists('#invisibleCaptchaShortlink', 2);DoIfExists('#before-captcha', 'submit', 3);
      let exeo = setInterval(() => {if (bp('.timer').innerText == '0') {clearInterval(exeo);ReadytoClick('#submit-button');}}, 2 * 1000);});
    BypassedByBloggerPemula(/(forexrw7|forex-articles|3rabsports|fx-22|watchtheeye).com|(offeergames|todogame).online|whatgame.xyz|gold-24.net/, () => {
      DoIfExists('.oto > a:nth-child(1)', 1); waitForElm('.oto > a', linkjust => redirect(linkjust.href, false));});
    BypassedByBloggerPemula(/nishankhatri.xyz|(bebkub|owoanime|importantclass|hyperkhabar|hamroguide).com/, () => {
      DoIfExists('#pro-continue', 3);waitForElm('a#pro-btn', vnshort => redirect(vnshort.href));DoIfExists('#my-btn', 5);});
    BypassedByBloggerPemula(/o-pro.online/, function() {waitForElm('#newbutton > a', opo => redirect(opo.href, false));
      waitForElm('a.btn.btn-default.btn-sm', opo2 => redirect(opo2.href, false));});
    BypassedByBloggerPemula(/(kongutoday|proappapk|hipsonyc|teamtechnews).com|yotrickslog.tech/, function() {
      if (BpParams.has('safe')) {meta(atob(BpParams.get('safe')));}});
    BypassedByBloggerPemula(/writedroid.eu.org|modmania.eu.org|writedroid.in/, function() {
      DoIfExists('#shortPostLink', 3);waitForElm("#shortGoToLink", dro => redirect(dro.href, false));});
    BypassedByBloggerPemula(/(travelironguide|businesssoftwarehere|softwaresolutionshere|freevpshere).com/, () => {
      CaptchaDone(() => {DoIfExists('#lview > form', 'submit');});waitForElm('.get-link > a', tig => redirect(tig.href, false));});
    BypassedByBloggerPemula(/linkatla.com/, function() {let katla = bp('head > script:nth-child(7)');let linka = strBetween(katla.text, '"', '"');
      if (elementExists('#redirectButton')) {setTimeout(() => {redirect(atob(linka), false);}, 2 * 1000);}});
    BypassedByBloggerPemula(/claimfreetrx.online/, function() {DoIfExists('#molien', 'submit', 2);DoIfExists('#verify > .mb-2.btn-primary.btn-lg.btn', 3);});
    BypassedByBloggerPemula(/adclicker\.*|yourihollier.com/, function() {if (location.href.includes('url/')) {const adc = atob(atob(atob(location.hash.slice(1))));
      redirect(new URLSearchParams(adc).get('url'));} else {}});
    BypassedByBloggerPemula(/(mgame|sportweb|bitcrypto).info/, () => {DoIfExists('.claim-button.btn-lg.btn-primary.btn', 3);window.wpsafegenerate();
      waitForElm("div[id^=wpsafe] > a[rel=nofollow]", bitcry => redirect(strBetween(bitcry.onclick.toString(), `handleClick('`, `')`), false),20,15);});
    BypassedByBloggerPemula(/easylink.gamingwithtr.com/, function() {DoIfExists('#countdown', 2);
      waitForElm('a#pagelinkhref.btn.btn-lg.btn-success.my-4.px-3.text-center', gtr => redirect(gtr.href, false));});
    BypassedByBloggerPemula('(on-scroll|diudemy|maqal360).com', () => {
      if (elementExists('.alertAd')) {notify('BloggerPemula : Try to viewing another tab if the countdown does not work , turn off Context Menu/Always Ready if you enable it');}
      ReadytoClick('#append a', 2);ReadytoClick('#_append a', 3);elementReady('.alertAd').then(function() {setActiveElement('[data-placement-id="revbid-leaderboard"]');fakeHidden();});});
    BypassedByBloggerPemula(/onlinetechsolution.link/, () => {let Thunder = bp("input[name=newwpsafelink]");setTimeout(() => {redirect(JSON.parse(atob(Thunder.value)).linkr);}, 5 * 1000);});
    BypassedByBloggerPemula(/coinhub.wiki|(vitalityvista|geekgrove).net/, () => {CaptchaDone(() => {ReadytoClick('#btn_link_continue',1);});
      elementReady('.link_code').then(function(element) {GM_setValue("someKey", element.innerText);});ReadytoClick('#link_result_header button',1);ReadytoClick('#btn_link_start:has(.mdi-check)',2);});
    BypassedByBloggerPemula(/stly.link|snaplessons.net|atravan.net|stfly.biz|airevue.net/, () => {
      CaptchaDone(() => {DoIfExists('button[class^=mt-4]');DoIfExists('button.mt-4:nth-child(2)', 3);});DoIfExists('button[class^=rounded]', 2);
      let stly = setInterval(() => {if (bp('.progress-done').innerText == '100%') {clearInterval(stly);ReadytoClick('button.mt-4:nth-child(6)', 1);DoIfExists('button.mt-4:nth-child(2)', 3);}}, 2 * 1000);});
    BypassedByBloggerPemula(/(horoscop|videoclip|newscrypto).info|article24.online|writeprofit.org|docadvice.eu|trendzilla.club|worldwallpaper.top/, () => {CaptchaDone(() => {window.wpsafehuman();});
      CheckVisibility('center > .wpsafelink-button', () => {DoIfExists('center > .wpsafelink-button', 1);});CheckVisibility('#wpsafe-generate > a', '||', "bp('.base-timer').innerText == '0:00'", () => {window.wpsafegenerate();
        if (location.href.includes('article24.online')) {DoIfExists('#wpsafelink-landing > .wpsafelink-button', 1);} else {DoIfExists('#wpsafelink-landing2 > .wpsafelink-button', 1);}});});
    BypassedByBloggerPemula(/revly.click|mitly.us|link.whf.bz|shortex.in/, () => {
      if (elementExists('#link-view')) {CaptchaDone(() => {DoIfExists('#link-view', 'submit');});} else if (elementExists('button.btn.btn-primary')){DoIfExists('div.col-md-12 form', 'submit', 2);}});
    BypassedByBloggerPemula(/trangchu.news|downfile.site|(techacode|expertvn|ziggame|gamezigg).com|azmath.info|aztravels.net|handydecor.com.vn/, () => {EnableRCF();
      let trangchu = setInterval(() => {if (bp('#monetiza-time').innerText == '0') {clearInterval(trangchu);ReadytoClick('#monetiza');} else if (elementExists('#monetiza-generate')) {window.monetizago();}}, 1 * 1000);});
    BypassedByBloggerPemula(/(askpaccosi|wellness4live|akash.classicoder).com|2the.space|inicerita.online|cryptomonitor.in/, () => {
      var tform = bp('#landing'); redirect(JSON.parse(atob(tform.newwpsafelink.value)).linkr, false);});
    BypassedByBloggerPemula(/(hosttbuzz|policiesreview|blogmystt|wp2hostt|advertisingcamps).com|clk.kim|dekhe.click/, () => {DoIfExists('button.btn.btn-primary', 2);
      DoIfExists('#nextpage', 'submit', 2);DoIfExists('#getmylink', 'submit', 3);CaptchaDone(() => {DoIfExists('.btn-captcha.btn-primary.btn');});});
    BypassedByBloggerPemula(/techyreviewx.com|desiupload.co/, function() {DoIfExists('.downloadbtn.btn-block.btn-primary.btn', 2);
      waitForElm('a.btn.btn-primary.btn-block.mb-4', rex => redirect(rex.href, false));});
    BypassedByBloggerPemula(/(blogsward|coinjest).com/, () => {
      waitForElm('#continueBtn', afBtn => afBtn.click());DoIfExists('#captcha-btn', 4, 'setInterval');
      DoIfExists('.btn-captcha.btn-primary.btn', 8, 'setInterval');});
    BypassedByBloggerPemula(/exactpay.online|neverdims.com|sproutworkers.co|coinsfaucet.fun/, function() {EnableRCF();window.onscroll = BpBlock();window.check2();if (elementExists('#verify')) {
        $('.blog-details').text('Please Answer the Maths Questions First ,Wait until Progress bar end, then Click the Red X Manually');
        elementReady('[name="answer"]').then(function(element) {element.addEventListener('change', window.check3);});}});
    BypassedByBloggerPemula(/(btcpany|zombiebtc|claimfey|thefastpost).com|(panytourism|statepany).online/, function() {
      parent.open = BpBlock();DoIfExists('#link1s-form', 'submit', 1);DoIfExists('#next-step-button', 3);});
    BypassedByBloggerPemula(/playnano.online/, function() {DoIfExists('#watch-link', 2);
      DoIfExists('.watch-next-btn.btn-primary.button', 2);DoIfExists('button.button.btn-primary.watch-next-btn', 5, 'setInterval');});
    BypassedByBloggerPemula(/rekonise.com/, () => {let xhr = new XMLHttpRequest();
      xhr.onload = () => redirect(JSON.parse(xhr.responseText).url);
      xhr.open("GET", "https://api.rekonise.com/social-unlocks" + location.pathname, true);xhr.send();});
    BypassedByBloggerPemula(/(fitnesswifi|earnmoneyyt|thardekho|dinoogaming|pokoarcade|hnablog|orbitlo|finquizy|indids).com|(ddieta|lmktec).net|vbnmx.online/, () => {
      waitForElm("div[id^='rtg-'] > a:nth-child(1)", Linkpays => redirect(Linkpays.href, false));DoIfExists('#rtg', 'submit', 2);
      DoIfExists('#rtg-snp21 .rtg_btn', 3);DoIfExists('#rtg-snp2', 3);DoIfExists('#rtg-snp21 > button', 4);});
    BypassedByBloggerPemula(/acortalink.me/, () => {let acorta = setInterval(() => {let script = bp('body > script');
        if (script) {let text = script.text.trim(); let lines = text.split('\n'); let i = lines.findIndex(x => x.includes('acortalink.me'));
          let link = lines[i + 2].trim().split(',')[6].trim(); if (window[link]) {clearInterval(acorta); redirect(window[link]);}}}, 100);});
    BypassedByBloggerPemula(/tutwuri.id|(besargaji|link2unlock).com/, () => {ReadytoClick('#submit-button',2);ReadytoClick('#btn-2', 3);ReadytoClick('#verify > a ', 2);ReadytoClick('#verify > button ', 2);CaptchaDone(() => {DoIfExists('#btn-3');});});
    BypassedByBloggerPemula(/autodime.com/, () => {CaptchaDone(() => {DoIfExists('#button1');});
      waitForElm('a.btn-hover.color-1.btn-captcha', odim => redirect(odim.href, false));});
    BypassedByBloggerPemula(/(youtube|youtube-nocookie).com/, function() {if (window.hasOwnProperty('_lact')) {window.setInterval(() => {window._lact = Date.now();}, 5 * 1000);
      } else if (elementExists('#redirect-main-text')) {waitForElm('a#invalid-token-redirect-goto-site-button', yt => redirect(yt.href, false));} else {}});
    BypassedByBloggerPemula(/hunterkiller.me|surflink.tech/, function() {
      waitForElm('div#showw center a.btn.btn-danger.btn-captcha', hun => redirect(hun.href, false));
      waitForElm('div#wpsafe-snp center a', hunt => redirect(hunt.href, false));});
    BypassedByBloggerPemula(/(lyricsbaazaar|ezeviral).com/, () => {CaptchaDone(() => {DoIfExists('#btn6');});
      waitForElm('div.modal-content a', lyri => redirect(lyri.href, false));});
    BypassedByBloggerPemula(/(sekilastekno|miuiku|vebma|majalahhewan).com|tempatwisata.pro/, async function() {const executor = async () => {let El = window?.livewire?.components?.components()[0];
        while (!El) {await sleep(100); console.log(1); El = window?.livewire?.components?.components()[0];}
        const payload = {fingerprint: El.fingerprint, serverMemo: El.serverMemo, updates: [{payload: {event: 'getData', id: 'whathappen', params: [],}, type: 'fireEvent',}, ],};
        const response = await fetch(location.origin + '/livewire/message/pages.show', {headers: {'Content-Type': 'application/json', 'X-Livewire': 'true', 'X-CSRF-TOKEN': window.livewire_token,},
            method: 'POST', body: JSON.stringify(payload),}); const json = await response.json(); const url = new URL(json.effects.emits[0].params[0]); redirect(url.href);};
      if (location.host === 'wp.sekilastekno.com') {if (elementExists("form[method='post']")) {const a = bp("form[method='post']"); console.log('addRecord...'); const input = document.createElement('input');
          input.value = window.livewire_token; input.name = '_token'; input.hidden = true; a.appendChild(input); a.submit();}
      if (elementExists("button[x-text]")) { console.log('getLink..'); executor();} return;} if (elementExists("div[class='max-w-5xl mx-auto']")) {console.log('Executing..'); executor();}});
    BypassedByBloggerPemula(/socialwolvez.com/, () => {let xhr = new XMLHttpRequest();xhr.onload = () => redirect(JSON.parse(xhr.responseText).link.url);
      xhr.open("GET", "https://us-central1-social-infra-prod.cloudfunctions.net/linksService/link/guid/" + location.pathname.substr(7), true);xhr.send();});
    BypassedByBloggerPemula(/(mobi2c|healthy4pepole|healdad|world2our|mobitaak|te-it|businessnews-nigeria|govaf|fahmysport).com|(hightrip|fx-gd|world-trips|otechno|bluetechno|to-travel).net|(newforex|forexit).online/, function() {
      DoIfExists('.submitBtn', 2);DoIfExists('#go_d', 3);});
    BypassedByBloggerPemula(/suaurl.com/, () => {parent.open = BpBlock();CaptchaDone(() => {bp('#comment_form').removeAttribute('target');DoIfExists('#btn-capcha > .b-b', 1);});DoIfExists('#btn > button', 3, 'setInterval');});
    BypassedByBloggerPemula(/letsboost.net/, function() {waitForElm('body > script', () => {let stepDat = BpT('script')[BpT('script').length - 1];
      let stepname = stepDat.innerHTML;let lbDat = JSON.parse(stepname.match(/stepDat = '(.*)';/)[1]); let lbo = lbDat[lbDat.length - 1].url;redirect(lbo,false);});});
    BypassedByBloggerPemula(/oncoin.info|nishankhatri.com.np|quanngon.org/, function() {
      DoIfExists('#my-btn', 2);DoIfExists('#wpsafe-link > .btn-secondary.btn', 2);
      waitForElm('#pro-link', nhk => redirect(nhk.href, false));waitForElm('#wpsafe-link a', hrl => redirect(strBetween(hrl.onclick.toString(), `window.open('`, `', '_self')`), false));});
    BypassedByBloggerPemula(/playonpc.online|quins.us|(retrotechreborn|insurelean|ecosolardigest|finance240|2wheelslife|historyofyesterday).com|gally.shop|evegor.net|freeat30.org|ivnlnews.xyz/, () => {CaptchaDone(() => {DoIfExists('button#cbt.pfbutton-primary', 1);ReadytoClick('button#cbt.pfbutton-primary', 2);});
      let playonpc = setInterval(() => {if (!elementExists('.h-captcha') && !elementExists('.core-msg.spacer.spacer-top') && bp('#formButtomMessage').textContent == "Well done! You're ready to continue!" && !bp('#cbt').hasAttribute('disabled')) {
          clearInterval(playonpc);DoIfExists('button#cbt.pfbutton-primary', 1);ReadytoClick('button#cbt.pfbutton-primary', 2);}}, 3 * 1000);});
    BypassedByBloggerPemula(/shortit.pw/, () => {if (elementExists('#captchabox')) {
        notify('IMPORTANT Note By BloggerPemula : Please Solve the Hcaptcha for Automatically , Dont Solve the Solvemedia . Regards...');}
      DoIfExists('.pulse.btn-primary.btn', 3);CaptchaDone(() => {DoIfExists('#btn2');});});
    BypassedByBloggerPemula(/short.croclix.me|adz7short.space/, function() {setInterval(function() {if ($("#link").length > 0) {ReadytoClick("#link");}}, 500);
      setInterval(function() {if ($("input#continue").length > 0) {ReadytoClick("input#continue");} if ($("a#continue.button").length > 0) {ReadytoClick("a#continue.button");}}, 9000);
      setTimeout(function() {if ($("#btn-main").length < 0) return;ReadytoClick("#btn-main");}, 5000);});
    BypassedByBloggerPemula(/adshnk.com|adshrink.it/, () => {let adsh = setInterval(() => {
        if (typeof window._sharedData == "object" && 0 in window._sharedData && "destination" in window._sharedData[0]) {clearInterval(adsh);
          document.write(window._sharedData[0].destination);redirect(document.body.textContent);
        } else if (typeof window.___reactjsD != "undefined" && typeof window[window.___reactjsD.o] == "object" && typeof window[window.___reactjsD.o].dest == "string") {clearInterval(adsh);redirect(window[window.___reactjsD.o].dest);}});});
    BypassedByBloggerPemula(/ify.ac/, function() {window.open_href();});
    BypassedByBloggerPemula(/lanza.me/, () => waitForElm('a#botonGo', lz => redirect(lz.href, false)));
    BypassedByBloggerPemula(/lifeezee.com/, () => waitForElm('.get-link', lifz => redirect(lifz.href)));
    BypassedByBloggerPemula(/lolinez.com/, () => waitForElm('p#url a', lol => redirect(lol.href, false)));
    BypassedByBloggerPemula(/file-upload.in/, () => waitForElm('#getlink', fui => redirect(fui.href, false)));
    BypassedByBloggerPemula(/linksly.co/, () => waitForElm('div.col-md-12 a', lsl => redirect(lsl.href, false)));
    BypassedByBloggerPemula(/appsinsta.com/, function() {waitForElm('.yu-blue.yu-btn', apBtn => apBtn.click());});
    BypassedByBloggerPemula(/apkadmin.com/, () => waitForElm('div.text.text-center a', apk => redirect(apk.href)));
    BypassedByBloggerPemula(/sugarona.com/, function() {waitForElm('a#my-btn', sgr => redirect(sgr.href, false));});
    BypassedByBloggerPemula(/amanguides.com/, () => waitForElm('#wpsafe-link > .bt-success', ag => redirect(ag.href, false)));
    BypassedByBloggerPemula(/8tm.net/, () => waitForElm('a.btn.btn-secondary.btn-block.redirect', tm => redirect(tm.href, false)));
    BypassedByBloggerPemula(/cpmlink.net/, () => waitForElm('a#btn-main.btn.btn-warning.btn-lg', cpm => redirect(cpm.href, false)));
    BypassedByBloggerPemula(/noodlemagazine.com/, () => waitForElm('a#downloadLink.downloadBtn', mag => redirect(mag.href, false)));
    BypassedByBloggerPemula(/(techleets|bonloan).xyz|sharphindi.in/, () => waitForElm('a#tp-snp2', tle => redirect(tle.href, false)));
    BypassedByBloggerPemula(/paycut.pro/, () => {if (location.href.includes('/ad/')) {location = location.href.replace('ad/', '');}});
    BypassedByBloggerPemula(/mohtawaa.com/, () => waitForElm('a.btn.btn-success.btn-lg.get-link.enabled', moht => redirect(moht.href, false)));
    BypassedByBloggerPemula(/rockmods.net/, function() {if (location.href.includes('/rblink.html') && BpParams.has('url')) {meta(atob(BpParams.get('url')));}});
    BypassedByBloggerPemula(/xonnews.net|toilaquantri.com|share4u.men|camnangvay.com/, () => waitForElm('div#traffic_result a', xon => redirect(xon.href, false)));
    BypassedByBloggerPemula(/boost.ink/, () => fetch(location.href).then(bo => bo.text()).then(html => redirect(atob(html.split('bufpsvdhmjybvgfncqfa="')[1].split('"')[0]))));
    BypassedByBloggerPemula(/foodupe.com/, function() {if (elementExists('.containerpanel')){let fdp = bp('#donead').href;setTimeout(() => {redirect(fdp,false);}, 2 * 1000);}});
    BypassedByBloggerPemula(/(cricketgurupro|travelkuku).com/, function() {DoIfExists("form[name='tp']", 'submit', 3);waitForElm('#page > center > a', cgp => redirect(cgp.href, false));});
    BypassedByBloggerPemula(/mirrored.to/, () => {waitForElm('div.col-sm.centered.extra-top a', mirr => redirect(mirr.href, false)); waitForElm('div.centerd > a', mir => redirect(mir.href, false));});
    BypassedByBloggerPemula(/sub2unlock.net/, function() {if (elementExists('.linkDiv_btns.col-xs-12.col-sm-12.col-md-12')){let stu = bp('#theLinkID').textContent;setTimeout(() => {redirect(stu,false);}, 2 * 1000);}});
    BypassedByBloggerPemula(/(financenube|mixrootmods|pastescript|trimorspacks|mealcold).com/, () => {waitForElm('#wpsafe-link a', cdr => redirect(strBetween(cdr.onclick.toString(), `window.open('`, `', '_self')`), false));});
    BypassedByBloggerPemula(/mboost.me/, function() {if (elementExists('#firstsection')){let mbo = bp('#__NEXT_DATA__');let mbm = JSON.parse(mbo.textContent).props.pageProps.data.targeturl;setTimeout(() => {redirect(mbm,false);}, 2 * 1000);}});
    BypassedByBloggerPemula(/mbantul.my.id|crypto-fi.net|claimcrypto.cc|xtrabits.click|(cempakajaya|web9academy|onlineincoms|allsoftdrivers|tribuncrypto|poketoonworld|bioinflu|pubgquotes|bico8).com|(techleets|ourcoincash|studyis|healthysamy).xyz/, function() {
      var bypasslink = atob(`aH${bp("#landing [name='go']").value.split("aH").slice(1).join("aH")}`); redirect(bypasslink, false);});
    BypassedByBloggerPemula(/dutchycorp.ovh|seulink.digital|oii.io|hamody.pro|metasafelink.site|(beingtek|fc-lc|10short).com|(zagl|shrinkforearn).in|wordcounter.icu|pwrpa.cc|flyad.vip|seulink.online|pahe.plus|tfly.link/, function() {
      if (elementExists('.grecaptcha-badge') || elementExists('#captchaShortlink')) {var ticker = setInterval(function() {try {clearInterval(ticker); window.grecaptcha.execute();} catch (e) {}}, 3000);}});
    BypassedByBloggerPemula(/(remixsounds|helpdeep|thinksrace).com|uprwssp.org|gkfun.xyz/, () => {DoIfExists('.m-2.btn-captcha.btn-outline-primary.btn', 2);DoIfExists('.tpdev-btn', 3);DoIfExists("#tp98 button[class^='bt']", 3);DoIfExists("form[name='tp']", 'submit', 3);
      DoIfExists('#btn6', 4);var wssp = document.querySelector('body > center:nth-child(6) > center:nth-child(4) > center:nth-child(2) > center:nth-child(4) > center:nth-child(3) > center:nth-child(4) > center:nth-child(2) > center:nth-child(4) > script:nth-child(5)');
      if (wssp) {var scriptContent = wssp.textContent;var Linkc = scriptContent.match(/var\s+currentLink\s*=\s*["'](.*?)["']/);if (Linkc && Linkc[1]) {var CLink = Linkc[1];redirect(CLink);} else {console.log("currentLink Not Found.");}} else {console.log("Element Not Found.");}});
    BypassedByBloggerPemula(/(disheye|kreatifparenting|phimne|admediaflex|cdrab).com|(gurumu|wpcheap|izseo|adcrypto|daycash).net|(ecq|oncoin).info|savego.org|hbz.us|(djqunjab|alpha-links).in|datacheap.io/, () => waitForElm('#wpsafelink-landing > input', dis => redirect(JSON.parse(atob(dis.value)).linkr, false)));
    BypassedByBloggerPemula(/(mangareleasedate|sabkiyojana|dulimo|merikahaniya|kloota|nspaconline|etrovo|studyfut|servicesyncsoftware|chainswon|cricketlegacy|ghapa-ghap).com|sarkarisahayata.org|kisannews.net|90fpsbgmi.one|tipzs.in|djabyallahabad.online/, () => {
      if (elementExists('#myTimerDiv')) {CheckVisibility('#myTimerDiv','&&',"bp('#myTimer').innerText == '0'", () => {DoIfExists('#VerifyBtn');DoIfExists('#NextBtn', 2);});}});
    BypassedByBloggerPemula(/shrinke\.*|shrinkme\.*|(paid4link|linkbulks|linclik|up4cash|smoner|atglinks).com|(wordcounter|shrink).icu|(dutchycorp|galaxy-link).space|dutchycorp.ovh|pahe.plus|(pwrpa|snipn).cc|paylinks.cloud|oke.io|tinygo.co|tlin.me|wordcount.im|link.freebtc.my.id|get.megafly.in|skyfreeshrt.top/, () => {
      CaptchaDone(() => {DoIfExists('#invisibleCaptchaShortlink');});});
    BypassedByBloggerPemula(/virtuous-tech.net|newsminer.uno/, () => {EnableRCF();CheckVisibility('#clickMessage', '&&', "bp('#clickMessage').innerText == 'Click any ad'", () => {setActiveElement('[data-placement-id="revbid-leaderboard"]');fakeHidden();});
      if (elementExists('input.form-control')) {notify('Please Answer the Maths Questions First ,Wait until Progress bar end, then Click the Red X Manually', false, true);window.onscroll = BpBlock();window.check2();elementReady('[name="answer"]').then(function(element) {element.addEventListener('change', window.check3);});}});
    BypassedByBloggerPemula(/(cryptosparatodos|placementsmela|howtoconcepts|tuasy|skyrimer|foodxor|yodharealty|mobcupring|aiimsopd|advupdates|camdigest|heygirlish|blog4nx).com|(paidinsurance|djstar|sevayojana|bjp.org).in|zaku.pro|veganab.co|cegen.org|skyfreecoins.top|manga4nx.site|sastainsurance.xyz/, () => waitForElm('#wpsafe-link a', bti => redirect(strBetween(bti.onclick.toString(), `window.open('`, `', '_self')`), false)));
    BypassedByBloggerPemula(/autofaucet.dutchycorp.space/, function () {let autoRoll = false;if (window.location.href.includes('/roll_game.php')) {window.scrollTo(0, 9999);
    if (!bp('#timer')) {CaptchaDone(() => {if (bp('.boost-btn.unlockbutton') && autoRoll === false) {bp('.boost-btn.unlockbutton').click();autoRoll = true;}CheckVisibility('#claim_boosted', () => {bp('#claim_boosted').click();});});} else {
      setTimeout(() => {window.location.replace('https://autofaucet.dutchycorp.space/coin_roll.php');}, 3 * 1000);}}if (window.location.href.includes('/coin_roll.php')) {window.scrollTo(0, 9999);
    if (!bp("#timer")) {CaptchaDone(() => {if (bp('.boost-btn.unlockbutton') && autoRoll === false) {bp('.boost-btn.unlockbutton').click();autoRoll = true;}CheckVisibility('#claim_boosted', () => {bp('#claim_boosted').click();});});} else {setTimeout(() => {window.location.replace('https://autofaucet.dutchycorp.space/ptc/wall.php');}, 3 * 1000);}}
    if (window.location.href.includes('/ptc/wall.php')) {var ptcwall = BpAll(".col.s10.m6.l4 a[name='claim']");if (ptcwall.length >= 1) {ptcwall[0].style.backgroundColor = 'red';let match = ptcwall[0].onmousedown.toString().match(/'href', '(.+)'/);let hrefValue = match[1];
      setTimeout(() => {window.location.replace('https://autofaucet.dutchycorp.space' + hrefValue);}, 3 * 1000);} else {CheckVisibility('div.col.s12.m12.l8 center div p', () => {setTimeout(() => {window.location.replace('https://autofaucet.dutchycorp.space/ptc/');}, 3 * 1000);});}}
    if (location.href.includes('autofaucet.dutchycorp.space/ptc/')) {console.log('Viewing Available Ads');if (elementExists('.fa-check-double')) {console.log('All Available Ads Watched');
      setTimeout(() => {window.location.replace('https://autofaucet.dutchycorp.space/dashboard.php');}, 3 * 1000);}CaptchaDone(() => {CheckVisibility('#submit_captcha', () => {bp("button[type='submit']").click();});});}});
    BypassedByBloggerPemula('(cryptowidgets|melodyspot|carsmania|cookinguide|tvseriescentral|cinemascene|hobbymania|plantsguide|furtnitureplanet|petsguide|gputrends|gamestopia|ountriesguide|carstopia|makeupguide|gadgetbuzz|coinsvalue|coinstrend|coinsrise|webfreetools|wanderjourney|languagefluency|giftmagic).net|(freeoseocheck|insurancexguide|funplayarcade|origamiarthub|fitbodygenius|illustrationmaster|selfcareinsights|constructorspro|ecofriendlyz|virtualrealitieshub|wiki-topia|techiephone|brewmasterly).com|(bubblix|dailytech-news).eu|coinscap.info|insurancegold.in|wii.si', () => {
      TrustMe();elementReady('#captcha-result .bg-success').then(ReadytoClick.bind(this, 'button'));elementReady('#loadingDiv[style*="display:block"] button, #loadingDiv[style*="display: block"] button').then(ReadytoClick.bind(this, 'button', 2));
      elementReady('#clickMessage[style*="display: block"], clickMessage[style*="display:block"]').then(function() {setActiveElement('[data-placement-id="revbid-leaderboard"]');fakeHidden();});});
    const headers = {"Content-Type": "application/json", "apikey": APIKEY};elementReady('iframe[data-hcaptcha-response]').then(async function(element) {if (!APIKEY || !cfg.get('hCaptcha')) return;CheckVisibility('iframe[data-hcaptcha-response]', () => {(async () => {
    const settings = Object.fromEntries(new URLSearchParams(element.src));let data = await Request("https://token.nocaptchaai.com/token", {method: "POST",headers,data: JSON.stringify({url: settings.host,type: "hcaptcha",sitekey: settings.sitekey,softid: "bloggerPemula-diego"})});
    const url = data.url;while (data.status != "processed") {await sleep(1);data = await Request(url, {headers, responseType: 'json' });console.log(data);}window.postMessage(JSON.stringify({"source": "hcaptcha","label": "challenge-closed","id": settings.id,"contents": {"event": "challenge-passed","response": data.token,"expiration": 120}}));})();});});
    elementReady('[name=adcopy_response]').then(function (element) {
    const PHRASES = ['1.21 gigawatts', '4 8 15 16 23 42', '5 dollar shake', '6 feet of snow', '8th chevron', 'a wild captcha appears', 'abelian grape', 'abide with me', 'abracadabra', 'absent without leave', 'absolute zero', 'accidentally on purpose', 'ace of spades', 'across the board', 'adapt improve', 'adapt improve succeed', 'against the grain', 'agree to disagree', 'al capone', 'all dancing', 'all grown up', 'all of the above', 'all singing', 'all your base', 'allergic reaction', 'almost got it', 'always there', 'am i happy', 'anchors away', "and that's the way it is", 'angel food', 'another castle', 'anti dentite', 'apple juice', 'apple pie', 'apple sauce', 'april may', 'april showers', 'are we there yet', 'are you ready', 'are you the keymaster', 'army training', 'army training sir', 'around here', 'as i see it', 'as you wish', 'ask questions', 'attila the hun', 'auto driving', 'awesome dude', 'awesome sauce', 'azgoths of kria', 'babel fish', 'baby blues', 'baby boomer', 'baby steps', 'back to basics', 'back track', 'background noise', 'bacon and eggs', 'bad books', 'bad egg', 'bait the line', 'baked in a pie', 'bald eagle', 'ball of confusion', 'banana bread', 'banana split', 'banana stand', 'bangers and mash', 'barber chair', 'barking mad', 'basket case', 'bated breath', 'bath towel', 'bath water', 'battle royale', 'bazinga', 'be careful', 'be mine', 'be my friend', 'be nice', 'be nimble be quick', 'be serious now', 'beach ball', 'bean town', 'beans and rice', 'beautiful friendship', 'bee line', 'been there', 'beer in a bottle', 'beer in the bottle', 'bees knees', 'beg the question', 'believe me', 'belt up', 'berlin wall', 'best fit line', 'best seller', 'better call saul', 'better half', 'better next time', 'beyond me', 'big brother', 'big kahuna burger', 'big nose', 'big screen', 'bigger in texas', 'bike rider', 'bird cage', 'birthday boy', 'birthday girl', 'bizarro jerry', 'black and white', 'black coffee', 'black gold', 'black jack', 'black monday', 'blahblahblah', 'blaze a trail', 'bless you', 'blinded by science', 'blog this', 'blood type', 'blue cheese', 'blue ribbon', 'blue sky', 'bob loblaw', 'body surfing', 'boiled cabbage', 'bon voyage', 'bond james bond', 'bone dry', 'bonus points', 'bonus round', 'book reading', 'book worm', 'boomerang', 'born to run', "bots are bad m'kay", 'bottled water', 'bowties are cool', 'box jelly fish', 'box kitty', 'box of chocolates', 'braaains', 'brand spanking new', 'bread of life', 'break the ice', 'brick house', 'broken heart', 'broken record', 'bruce lee', 'brush your teeth', 'buckle your shoe', 'buffalo wing', 'bunny rabbit', 'burger with fries', 'burning oil', 'burnt sienna', 'butler did it', 'butter side down', 'button fly', 'buy some time', 'by and large', 'by the board', 'by the book', 'by the seashore', 'cabbage borsht', 'cabbage stew', 'caesar salad', 'call me', 'call me maybe', 'can i love', 'can you see', 'candy apple', 'candy cane', 'capital gain', 'captcha in the rye', 'car trouble', 'carbon copy', 'carbon footprint', 'card sharp', 'card-sharp', 'carpe diem', 'carry a towel', 'carry on', 'cary grant', 'case closed', 'cat got your tongue', 'catch the man', 'cats and dogs', 'cats pajamas', 'chaise lounge', 'challenge accepted', 'change the world', 'change yourself', 'channel surfing', 'charley horse', 'charlie bit me', 'charm offensive', 'charmed life', 'check your coat', 'check your work', 'cheese burger', 'cheese fries', 'cheese steak', 'cherry on top', 'chicken feed', 'chicken noodle', 'chicken salad', 'chicken soup', 'chin boy', 'chit chat', 'choco lazer boom', 'chocolate cookie', 'chocolate milk', 'chow down', 'chuck norris', 'circle of life', 'civil war', 'clean and shiny', 'clean hands', 'clear blue water', 'clear sailing', 'click, click, click', 'cliff hanger', 'clod hopper', 'close quarters', 'cloud nine', 'clown around', 'coffee can', 'cold comfort', 'cold feet', 'cold hat', 'cold shoulder', 'cold turkey', 'coleslaw', 'collaborate and listen', 'colored paper', 'come along', 'come along pond', 'come back', 'come clean', 'come on down', 'come what may', 'comfort zone', 'comma comma', 'common law', 'complex number', 'construction ahead', 'cookie cutter', 'cool heads prevail', 'cop an attitude', 'cor blimey', 'cordon bleu', 'corned beef', 'cotton on', 'count your change', 'counting sheep', 'covered bridge', 'crab cake', 'crayola', 'cream and sugar', 'create new things', 'creative process', 'creative vision', 'creepy crawler', 'crime of passion', 'crocodile tears', 'crop up', 'cross the road', 'cross the rubicon', 'cubic spline', 'cucumber sandwich', 'cup cake', "cupid's arrow", "curate's egg", 'curry favour', 'cut and run', 'cut the mustard', 'dalek asylum', 'dallas texas', 'dance all night', 'danish robot dancers', 'dark horse', 'das oontz', 'david after dentist', 'dead battery', 'dead ringer', 'deal me in', 'dear cookie', 'dear mr vernon', 'dear sir', 'deep thought', 'deep waters', 'dharma initiative', 'diced onion', 'diddly squat', 'digital clock', 'ding a ling', 'dinner bell', 'dinosaur spaceship', 'dish water', 'do a little dance', 'do be do be do', 'do it now', 'do more situps', 'do not touch', 'do or do not', 'do unto others', 'do wah ditty', 'do you believe in miracles', 'do you love me', 'doctor caligari', 'doctor who', 'doctor who?', 'doe a deer', 'dog days', "dog's breakfast", "dog's dinner", 'dogapus', 'dogs and cats living together', 'dollar bill', 'dollar signs', 'dollars to donuts', 'domestic spying', "don't be late", "don't count on it", "don't dawdle", "don't stop", "don't waste time", 'done that', "donkey's years", 'doodah man', 'double cross', 'double crossed', 'double dutch', 'double jump', 'double rainbow', 'double time', 'double whammy', 'down the hatch', 'down the rabbit hole', 'downward slope', 'drag race', 'dragon with matches', 'dragonfly', 'dramatic chipmunk', 'draw a blank', 'drawing board', 'dream big', 'drink milk', 'drive me to firenze', 'drop table users', 'drumhead', 'drummer boy', 'dry clean only', 'dueling banjos', 'dusk till dawn', 'dust bunny', 'dust up', 'duvet day', 'dynamo clock', 'ear candy', 'ear mark', 'ear muffs', 'easy as cake', 'easy as pie', 'easy peasy', 'easy street', 'eat cous cous', 'eat out', 'eat your dinner', 'eat your veggies', 'eat your vitamins', 'ecks why zee', 'edgar degas', 'egg on', 'eggs ter minate', 'eighty six', 'electro head', 'elevator going up', "emperor's clothes", 'empire state of mind', 'end of story', 'english muffin', 'enjoy life', 'ermahgerd capcher', 'evil eye', 'evil genius', 'exceedingly well read', 'exclamation', 'exercise more', 'extra cheese', 'face the music', 'face to face', 'fade away', 'fair and square', 'fair play', 'fairy godmother', 'fairy tale', 'fait accompli', 'fall guy', 'falling pianos', 'fancy free', 'fancy pants', 'far away', 'farsical aquatic ceremony', 'fashion victim', 'fast and loose', 'fast asleep', 'father time', 'father uncle', 'fathom out', 'fava beans', 'feeding frenzy', 'feeling blue', 'fellow traveller', 'fezes are cool', 'field day', 'fifth column', 'fill it up', 'filthy dirty mess', 'filthy rich', "finagle's law", 'final answer', 'finger lickin good', 'fire brim stone', 'firecracker', 'first contact', 'first post', 'first water', 'first world', 'fish and chips', 'fish on', 'fishy smell', 'flag day', 'flat foot', 'flat out', 'flat tire', 'flipadelphia', 'flipflops', 'flux capacitor', 'follow me', 'folsom prison', "fool's paradise", 'fools gold', 'for keeps', 'for sure', 'for the birds', 'for the gripper', 'forbidden fruit', 'foregone conclusion', 'forget this', 'forget you', 'fork knife spoon', 'forty two', 'foul play', 'four by two', 'frabjous day', 'france', 'frankly my dear', 'free hat', 'freezing temperatures', 'french fried', 'french fries', 'french phrases', 'fresh water', 'fried ices', 'fried rice', 'friend zone', 'frozen peas', 'fruit salad', 'fuddy duddy', 'full house', 'full monty', 'full of stars', 'full stop', 'full tilt', 'fun with flags', 'funny farm', 'fusilli jerry', 'fuzzy wuzzy', 'gadzooks', 'game is up', 'gangnam style', 'garden of eden', 'garlic yum', 'gathers moss', 'gee louise', 'gee whiz', 'geez louise', 'gene parmesan', 'general tso', 'generation x', 'genghis khan', 'george washington', 'get out', 'get over it', 'get well', 'get your goat', 'giant bunny rabbit', 'giant panda', 'giddy goat', 'gift horse', 'gimme pizza', 'ginger bread', 'give or take', 'glass ceiling', 'glazed donut', 'global warming', 'go berserk', 'go further', 'go gadget go', 'goes to eleven', 'gold medal', 'gold record', 'golly jeepers', 'gone dolally', 'gone fishing', 'good afternoon', 'good as gold', 'good buddy', 'good day', 'good evening', 'good for nothing', 'good grief', 'good job', 'good luck', 'good morning', 'good night', 'good night and good luck', 'good riddance', 'good samaritan', 'good work', 'goody goody gumdrops', 'goody gumdrop', 'goody two shoes', 'goosebumps', 'gordon bennett', 'got my mojo', 'gotham city', 'gothic arch', 'gothic church', 'grain of salt', 'grand slam', 'grape soda', 'grass up', 'graveyard shift', 'gravy train', 'grease the skids', 'greased lightning', 'great scott', 'great unwashed', 'gregory peck', 'gridlock', 'grilled cheese', 'groundhog day', 'grumpy cat', 'guinea pig', 'guitar player', 'gum shoe', 'gung ho', 'habsons choice', 'had a great fall', 'had me at hello', 'hairy eyeball', 'halcyon days', 'half done', 'half empty', 'half full', 'half inch', 'hallowed ground', 'halp meh', 'ham and cheese', 'hamburger bun', 'hammer time', 'hand over fist', 'hands down', 'hangers and mash', 'happy anniversary', 'happy blessings', 'happy clappy', 'happy retirement', 'happy trails', 'hard captcha is hard', 'hard cheese', 'hard lines', 'hard sharp', 'hardened prestoopnicks', 'harp on', 'haste makes waste', 'hat head', 'hat trick', 'have a purpose', 'have an inkling', 'have courage', 'have fun', 'he loves her', 'head case', 'head honcho', 'head over heels', 'heads up', 'health food', 'healthy food', 'hear hear', 'hear me roar',
                     'heart break', 'heart strings', "heart's content", 'heartache', 'heat up', 'heated debate', 'heavens to betsy', 'heavy metal', 'heebie jeebies', 'hello newman', 'hello sweetie', 'hello watson', 'hello world', 'here or there', "here's johnny", 'hey brother', 'higgledy piggledy', 'higgs boson', 'high def', 'high five', 'high flyer', 'high horse', 'high sleeper', 'high time', 'him with her', 'hissy fit', 'history repeats itself', 'hit the hay', 'hit the sack', 'hoagie roll', 'hobby horse', "hobson's choice", 'hocus pocus', 'hoi polloi', 'hoity-toity', 'hold your horses', 'hold your tongue', 'home james', 'honey mustard', 'hooray henry', 'hops a daisy', 'horse and cart', "horse's mouth", 'hot blooded', 'hot diggity dog', 'hot dog roll', 'hot pola', 'hot sauce', 'hover hand', 'how about lunch', 'how about that', 'how are you', 'how interesting', 'how now, brown cow', 'how quaint', 'how sweet', "how's it going", 'howdy partner', 'hug me', 'huggle muggle', 'hulk smash', 'hunky-dory', 'hush puppies', 'i am captcha', 'i am fine', 'i am here', 'i can do this', 'i can fix it', 'i have fallen', 'i know nothing', 'i like humans', 'i like people', 'i like turtles', 'i like you', 'i love deadlines', 'i love lamp', 'i love you', 'i made tea', 'i moustache you why', 'i saw that', 'i see', 'i think i am', 'i think i can', 'i think so', 'i want control', "i'll make tea", "i'm batman", "i'm blessed", "i'm blushing", "i'm cold brr", "i'm only human", "i'm so cold", "i'm sorry", "i'm sorry dave", "i'm yours", 'ice to meet you', 'idk my bff jill', 'if it fits', 'im cold. brr', 'imagine inspire create', 'in a box', 'in limbo', 'in over my head', 'in spades', 'in stitches', 'in the air', 'in the box', 'in the cart', 'in the club', 'in the doldrums', 'in the limelight', 'industrial revolution', 'infra dig', 'inside out', 'is it enough', 'is it hot', 'is it hot?', 'is it hot in here', 'is it plugged in', 'is low', "it doesn't count", 'it happens', 'it hurts', 'it is certain', 'it is enough', 'it will pass', "it's over", "it's super effective", 'ivory tower', 'jabber wocky', 'jack be nimble', 'jam tomorrow', 'jay gatsby', 'jerk store', 'jerry built', 'jimmy cricket', 'jimmy horner', 'john lennon', 'john steinbeck', 'jump higher', 'jump over', 'jump the candlestick', 'jump the gun', 'jumping jack', 'june july', 'just dance', 'just deserts', 'just drive', 'just friends', 'just in time', 'kangaroo count', 'karma points', 'keep calm', 'keyboard', 'keyboard cat', 'khyber pass', 'kick the can', 'kick your heels', 'kindness of strangers', 'king arthur', 'kiss me', 'kitten mittens', 'kitty kat', 'klatu berada nikto', 'knick knack', 'knock at the door', 'knock back', 'knock knock knock penny', 'knock off', 'knock on wood', 'know the ropes', 'know thy self', 'know your paradoxes', 'know your rights', 'knuckle down', 'kosher dill', 'kundalini express', 'labour of love', 'ladies first', 'lager frenzy', 'lame duck', 'lardy-dardy', 'lark about', 'laser beams', 'last straw', 'later gator', 'laugh at me', 'law of sines', 'lawn giland', 'lazy sunday', 'leap higher', 'leaps and bounds', 'learn challenge improve', 'learn from mistakes', 'learn succeed', 'learn the ropes', 'learn, advance', 'leave britney alone', 'leave me alone', 'left or right', 'left right', 'lefty loosey', 'less is more', 'let go', 'let it be', 'let me know', 'let me out', 'lets eat', 'level playing field', 'liberty bell', 'library book', 'lickety split', 'lie low', 'light sleeper', 'like a boss', 'like the dickens', 'linear algebra', 'little bird told me', 'little bobby tables', 'little did he know', 'little sister', 'live free', 'live in the moment', 'live in the now', 'live life', 'live long + prosper', 'live love internet', 'live love type', 'live transmission', 'live with purpose', 'live your dream', 'living daylights', 'living things', 'lizard poisons spock', 'lo and behold', 'loaf of bread', 'local derby', 'lol cat', 'lollerskates', 'lolly pop', 'london calling', 'long division', 'long in the tooth', 'look away', 'look before crossing', 'look both ways', 'looking glass', 'lose face', 'lost love', 'loud music', 'love is automatic', 'love is blind', 'love life', 'love me', 'love you', 'love-hate', 'lovey dovey', 'lucille 2', 'lucky you', 'ludwig van', 'lumpy gravy', 'lunatic fridge', 'lunch time', 'lunch tuesday', 'mad hatter', 'mad science', 'magic decoder ring', 'magic eight ball', 'magical realism', 'magnetic monopole', 'main chance', 'major intersection', 'make a bee line', 'make haste', 'make it so', 'make my day', 'many happy returns', 'many wishes', 'maple syrup', 'marble rye', 'marcia marcia marcia', "mare's nest", 'margin of error', 'mark it zero', 'market forces', 'marry me', 'mars rover', 'math test', 'mayan ruins', 'mea culpa', 'meat and drink', 'meat with gravy', 'meddling kids', 'media frenzy', 'melody pond', 'men in suits', 'mend fences', 'meow meow', 'metropolis', 'mexican wave', 'mickey finn', 'miles to go', 'milk was a bad choice', 'milkshake', 'million dollars', 'miloko plus', 'miloko plus vellocet', 'mimsy borogoves', 'minced oaths', 'mind the gap', 'minty fresh', 'mish-mash', 'miss you', 'mister wilson', 'modern love', "moe's tavern", 'mom and dad', 'money lender', 'moo shoo pork', 'moon cheese', 'moot point', 'more better', 'more chocolate', 'more coffee', 'more cow bell', 'more internets', 'morning person', 'most interesting man', 'most likely', 'mother country', 'mother earth', 'motley crew', 'mouth watering', 'move along', 'move mountains', 'move over', 'moveable feast', 'movers and shakers', 'movie star', 'mrs robinson', 'muffled rap music', 'multi pass', "mum's the word", 'mumbo jumbo', "murphy's law", 'mushy peas', 'music machine', 'mustachioed', 'my bad', 'my beating heart', 'my better half', 'my dear watson', "my friends can't dance", "my mind's eye", 'my sources say no', 'naise cain', 'namby-pamby', 'name drop', 'nanoo nanoo', 'nap time', 'narrow minded', 'nautical phrases', 'ne regrets', 'near tannhauser gate', 'neart strings', 'neckbeard', 'need a bigger boat', 'needs must', 'nercolas cerg', 'nest egg', 'never give up', 'never gonna give you up', 'never mind', 'never quit', 'new york city', 'nice job', 'nice marmot', 'nice to meet you', 'night owl', 'nip and tuck', 'nitty gritty', 'no brainer', 'no crying in baseball', 'no dice', 'no friend of mine', 'no holds barred', 'no means no', 'no regrets', 'no soup for you', 'no spoon', 'no stinking badges', 'no time to explain', 'no way', 'nobody home', 'none of the above', 'nope chuck testa', 'nose bleed', 'nosy parker', 'not a bot', 'not in kansas', 'not yet', 'now and forever', 'now look here', 'nth degree', 'nul points', 'numa numa', 'nut case', 'nutrition', 'nyan cat', 'nyquist rate', 'of course', 'off the record', 'oh brother', 'oh em gee', 'oh hai', 'oh sigh', 'oh so close', 'oh yes', 'oh you', 'oh,you', 'oh, wait', 'okey dokey', 'old hat', 'old man winter', 'old shoe', 'om nom nom', 'on a boat', 'on cloud nine', 'on the ball', 'on the qt', 'on-off', 'once again', 'once upon a time', 'one day more', 'one fell swoop', 'one hit wonder', 'one small step for man', 'one stop shop', 'one way', 'one way street', 'one, two, three', 'only way to be sure', 'oontz oontz', 'oops a daisy', 'open season', 'open sesame', 'orange juice', 'other worldly', 'out of sorts', 'out of toner', 'outlook good', 'over the hill', 'over the moon', 'over the top', 'over there', 'oxford university', 'oxo cube', 'paint it red', "pandora's box", 'pants on the ground', 'paper jam', 'paper plate', 'partial derivative', 'partly cloudy', 'party on garth', 'passing lane', 'patch of grass', 'path less taken', 'patience child', 'patty cake', 'pay the ferryman', 'pea brain', 'pearly whites', 'peg out', 'pell mell', 'penny loafer', 'people like me', 'pepe silvia', 'pepper pot', 'pepperoni pizza', 'peppers and onions', 'perfect world', 'pester power', 'peter out', 'philadelphia', 'phone home', 'pick me', 'pick up sticks', 'pickle juice', 'pickled peppers', 'picture perfect', 'pie are round', 'pie are squared', 'pie chart', 'piece of cake', "pig's ear", 'piggyback', 'pin money', 'pipe down', 'pipe dream', 'piping hot', 'pitter patter', 'pizza topping', 'plain sailing', 'play a game', 'play again', 'play ball', 'play hookey', 'play it again sam', 'pleased as punch', 'plenty of time', 'plugged nickel', 'plus or minus', 'pocket sized', 'pod bay doors', 'poetic justice', 'point blank', 'point to point', 'points dont matter', 'points font matter', 'poison apple', 'political party', 'politicaly correct', "poly's cracker", 'pond life', 'pool boy', 'pool hall', 'pool house', 'poor house', 'pork pies', 'pound cake', 'power dressing', 'power tool', 'practice makes perfect', 'press into service', 'prime time', 'primrose path', 'print out', 'print paper', 'printer paper', 'propane accessories', 'public good', 'pudding pops', 'puffy shirt', 'pumpkin pie', 'puppy dog', 'puppy love', 'push harder', 'push on', 'push the edge', 'push the envelope', 'pyrrhic victory', 'quality time', 'queen nefertiti', 'queen of hearts', "queen's yacht", 'question everything', 'question mark', 'quid pro quo', 'quotations', 'rack and ruin', 'rack your brains', 'rain go away', 'rain tonight', 'rainy days', 'raise cain', 'raspberry tart', 'reach higher', 'read all over', 'read me, write me', 'read my mail', 'ready set go', 'real hoopy frood', 'real mccoy', 'red herring', 'red tape', 'red white and blue', 'red-handed', 'reduplicated phrases', 'remain calm', 'rent-a-swag', 'respect me', 'return to sender', 'reverse the polarity', 'rhino beetle', 'rhodeisland', 'rhyme nor reason', 'rhyming slang', 'rice and beans', 'rice job', 'ride the subway', 'riff-raff', 'right hand turn', 'right left', 'righty tighty', 'ring fencing', 'ring fenring', 'rinky-dink', 'rise and shine', 'river song', 'river styx', 'road apples', 'road less travelled', 'roast beef', 'robe of saffron', 'rocket science', 'rodents of unusual size', 'roflcopter', 'roll again', 'roll over', 'roller skates',
                     'rolling stone', 'rooftop', 'room for activities', 'roommate agreement', 'root beer float', 'rope burn', 'rosebud', 'rosie lea', 'rough diamond', 'round one', 'round robin', 'round tab1e', 'route one', 'row boat', 'roy g biv', 'royal flush', 'rubicon crossed', 'rule of chomio', 'rule of thumb', 'rum do', 'run amok', 'run away', 'run farther', 'run the gauntlet', 'run through', 'runny nose', 'saber tooth', 'sacred cow', 'safe streets', 'safer streets', 'safety first', 'salad days', 'salt and pepper', 'salty cheese', 'same same', 'sandy beach', 'saturday detention', 'saucy', 'sauer kraut', 'sausages', 'save face', 'save it', 'save our bluths', 'savoir faire', 'sax and violins', 'say cheese', 'school is cool', 'science class', 'science fair', 'science it works', 'science project', 'scot free', 'screw driver', 'sea change', 'sea shell', 'sea shore', 'seattle', 'see red', 'see ya', 'see-saw', 'seek beauty', 'seems legit', 'seize the day', 'select from table', 'send packing', 'senior citizen', 'seven ate nine', 'seven signs', 'seze the day', 'shake a leg', 'shaken not stirred', 'shakers and movers', 'shane come back', 'sharp pencil', 'sharp stick', 'she loves him', 'she sells', 'she sells seashells', "she's a witch", 'sheldon alpha five', 'shilly-shally', 'ship shape', 'shoe shine', 'shoes shine', 'shoot through', 'shoulder of orion', 'show down', 'shuffle the deck', 'sick puppy', 'signal your turns', 'signs point to yes', 'silence is golden', 'silver bells', 'silver bullet', 'silver hoing', 'silver lining', 'silver spoon', 'sin cos tan', 'since when', 'sing a song', 'sixes and sevens', 'sixteen point turn', 'skidrow', 'skip a turn', "sky's the limit", 'skynet is watching', 'skynet knows', 'skynet watches', 'sleep tight', 'sleepy hollow', 'slimy goop', 'slippery slope', 'sloane ranger', 'slow down', 'slow milenky lizards', 'slush fund', 'slythy toves', 'small fries', 'small fry', 'smart casual', 'smart phone', 'smashed potato', 'smell that', 'smelling salt', 'smoked salmon', 'snake eyes', 'snapshot', 'snare drum', 'sneezing baby panda', 'snoop lion', 'snow drift', 'snow flurry', 'snow shovel', 'so far away', 'so life like', 'so so', "sod's law", 'soft kitty warm kitty', 'soft kitty, warm kitty', 'somebody that i used to know', 'sonic screw driver', 'sorry dave', 'sorry sight', 'souffle girl', 'sound bite', 'sound of sirens', 'sound out', 'sour grapes', 'space is big', 'space plumber', 'spangled banner', 'speeding bullet', 'spelling bee', 'spend time', 'spick and span', 'spicy', 'spicy hot', 'spin doctor', 'spitting feathers', 'spitting image', 'spoilers', 'spread the net', 'spring water', 'spruce up', 'square meal', 'square one', 'squeaky clean', 'squirrel friend', 'st johns bay', 'stalla stella', 'stand and deliver', 'stand by me', 'stand up guy', 'star spangled', 'star wars kid', 'start from scratch', 'stay safe', 'steak and eggs', 'steam punk', 'steering wheel', 'step back', 'step over', 'steve holt', 'steve jobs', 'sticky wicket', 'sting like a bee', 'stinking rich', 'stinky feet', 'stone soup', "stone's throw", 'stony hearted', 'stool pigeon', 'stop waisting time', 'stranger danger', 'streams of oceanus', 'strike a match', 'strike three', 'string along', 'string cheese', 'stuck in mud', 'stump up', 'sudo make sandwich', 'sulphur smell', 'summon inglip', 'sun tzu says', 'sunday', 'sunshine', 'super star', 'surf and turf', 'surface integral', 'swan song', 'sweet dreams', 'sweety pie', 'swirling vortex of entropy', 'taco tuesday', 'take a look', 'take an umbrella', 'take care', 'take it all', 'take out food', 'take potluck', 'take the cake', 'take umbrage', 'take wrong turns', 'taken aback', 'talk the talk', 'talk to strangers', 'talk turkey', 'tall building', 'tall story', 'tastes good', 'tastes like chicken', 'tea earl gray hot', 'tea leaf', 'tea with jam', 'tea with milk', 'tear us apart', 'technicolor yawn', 'teflon president', 'teh inter webs', 'ten four', 'tesla coil', 'thank you', 'thank you, come again', 'that escalated quickly', 'that hurts', 'that will not work', "that's a fact jack", "that's all folks", "that's enough", "that's hot", "that's it", "that's my spot", "that's right", "the bee's knees", 'the bible', 'the big apple', 'the big cheese', 'the big easy', 'the cat lady', 'the cats cradle', 'the dennis system', 'the dude abides', 'the extra mile', 'the next level', 'the nightman cometh', 'the one eyed man is a king', 'the other side', 'the tribe has spoken', 'the yellow king', 'there is no spoon', 'there is only zul', 'there once was', 'these parts', 'they are watching', 'they ate it', 'thick and thin', 'thin air', 'think create do', 'think green', 'think hard', 'think twice', 'thinking cap', 'third degree', 'thirty one days', 'this is it', 'this is not fake', 'this is sparta', 'this or that', 'this statement is false', 'three short words', 'three strikes', 'through the grapevine', 'thumbs up', 'thunder storm', 'ticked off', 'tickle the ivories', 'tickled ivories', 'tickled pink', 'tide over', 'tight lipped', 'time and paper', 'time circuits', 'time flies', 'time is an illusion', 'time lord', 'time machine', 'time will tell', 'times square', "tinker's dam", 'to boot', 'toast points', 'toe the line', 'toe-curling', 'together again', 'too bad', 'too late', 'too many cooks', 'too many secrets', 'too salty', 'toodle oo', 'top dog', 'top drawer', 'top notch', 'top ten', 'topsy turvy', 'topsy-turvy', 'total shamble', 'towel dry', 'tower of strength', 'toy soldier', 'traffic jam', 'traffic light', 'train surfing', 'travel size', 'treat yoself', 'trick or treat', 'trickle down', 'trolololol', 'true blue', 'true life', 'trust me', 'tuckered out', 'tuna fish', 'tune in', 'turkey sandwich', 'turn signal', 'turn the tables', 'turn up trumps', 'twenty eight days', 'twenty four seven', 'twenty one', 'twenty three', 'two cents worth', 'two hands', 'two left feet', 'two tone', 'u jelly', 'umbrella corporation', 'uncharted island', 'uncle leo', 'under the sea', 'underpants', 'union jack', 'unlimited wishes', 'untied laces', 'until next time', 'until tomorrow', 'until tonight', 'up and away', 'up or down', 'upper crust', 'upper hand', 'ups a daisy', 'upside down', 'upvote this', 'upward slope', 'urban myth', 'usual suspects', 'uu dd lr lr ba', 'van surfing', 'vanilla ice cream', 'veg out', 'vegan diet', 'vegan zombie wants grains', 'vegetarian', 'very doubtful', 'very nice', 'vice versa', 'vicious cycle', 'video tape', 'vienna calling', 'virtue of necessity', 'vis a vis', 'vocal minority', 'vogon poetry', 'voigt kampf', 'vorpal sword', 'vote pancakes', 'wake of the flood', 'walk free', 'walk the plank', 'walk the walk', 'want more', 'warp speed', 'wash whites separately', 'watch c-beams glitter', 'watch me', 'watch out', 'water gate', 'wax poetic', 'way to go', 'way to go donny', 'we go forwards', 'we like the moon', 'weakest link', 'weasel words', 'welcome to earth', 'well done', 'well heeled', "well isn't that special", 'well now', 'well read', 'weylan yutani', 'what even', 'what ever', 'what for', 'what if', 'what is for dinner', 'what is your quest', 'what should we call me', 'what to see', "what's that", 'wheel group', 'when where', 'where to go', 'whet your appetite', 'whistle and flute', 'white as snow', 'white bread', 'white elephant', 'white rabbit', 'who am i', 'who are you', 'who is it', 'who you gonna call', 'who, what, where', 'whoa there', 'whole nine yards', 'whole shebang', 'whoopee cushion', 'whoops a daisy', 'wicked witch', 'wide berth', 'wild and crazy guys', 'wild and woolly', 'wild goose chase', 'wild west', 'willy nilly', 'win hands down', 'window dressing', 'wing it', 'winning', 'winter is coming', 'winter snow', 'wisdom of inglip', 'wisdom teeth', 'wishy-washy', 'with bells on', 'without a doubt', 'woof woof', 'word for word', 'words of wisdom', 'work out', 'would you believe', 'wright flyer', 'writing desk', 'x all the y', 'xylophone', 'yada yada', 'yadda yadda yadda', 'yeah right', 'year dot', 'yee haw', 'yelling goat', 'yellow belly', 'yes definitely', "yes ma'am", 'yes sir', 'yes this is dog', 'you are happy', 'you are here', 'you can do this', "you don't say", 'you first', 'you good', 'you have my stapler', 'you rock', 'you the man', 'you win', "you're in my spot", "you're not listening", "you're welcome", 'zig zag', 'zombie attack', 'zombie prom', 'who what where', ];
    const datalist = document.createElement('datalist'); datalist.setAttribute('id', 'adcopy_phrases'); for (const phrase of PHRASES) {datalist.appendChild(document.createElement('option')).appendChild(document.createTextNode(phrase));} element.parentNode.insertBefore(datalist, element.nextSibling); element.setAttribute('list', datalist.id);});}})();


(function() {
    console.log("🔍 reCAPTCHA detection script running...");

    let startTime = Date.now();
    let recaptchaCheckInterval = setInterval(() => {
        let recaptchaFrame = document.querySelector('iframe[title="reCAPTCHA"]');
        let recaptchaCheckbox = document.querySelector('.recaptcha-checkbox');

        if (recaptchaFrame || recaptchaCheckbox) {
            console.log("✅ reCAPTCHA detected, waiting to solve...");

            // Check if 15 seconds have passed
            let elapsedTime = (Date.now() - startTime) / 1000;
            if (elapsedTime > 40) {
                console.log("⏳ reCAPTCHA not solved in 15 seconds, reloading page...");
                clearInterval(recaptchaCheckInterval);
                location.reload();
            }

            // Check if reCAPTCHA is solved
            if (recaptchaCheckbox && recaptchaCheckbox.classList.contains("recaptcha-checkbox-checked")) {
                console.log("🎉 reCAPTCHA solved successfully!");
                clearInterval(recaptchaCheckInterval);
            }
        }
    }, 1000);
})();


// Function to auto-scroll and close tab
function autoScrollAndClose() {
    let scrollInterval = setInterval(() => {
        window.scrollBy(0, 900); // Scroll down 900 pixels
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            clearInterval(scrollInterval);
            setTimeout(() => {
                window.open('', '_self').close(); // Force close tab
            }, 3000); // 3-second delay before closing
        }
    }, 500); // Scroll every 500ms
}

// Check when page is fully loaded
window.onload = function() {
    setTimeout(autoScrollAndClose, 5000); // Wait 5 seconds before starting scroll
};


(function() {
    'use strict';

    function keepTabsAwake() {
        document.title = "🟢 Active | " + new Date().toLocaleTimeString();
        document.dispatchEvent(new Event("visibilitychange")); 
        window.focus();
        console.log("✅ Tab refreshed to stay active at:", new Date().toLocaleTimeString());

        // অডিও প্লে করে ব্যাকগ্রাউন্ড এক্টিভ রাখা (Mute থাকবে)
        let audio = new Audio();
        audio.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA="; // Silent Audio
        audio.loop = true;
        audio.play().catch(() => console.log("⚠️ Audio play blocked by browser"));
    }

    // প্রতি 10 মিনিট (600,000 ms) পরপর একবার চালানো
    setInterval(keepTabsAwake, 600000);

    // যখন ট্যাব সুইচ হবে তখনও এক্টিভ রাখবে
    document.addEventListener("visibilitychange", keepTabsAwake);
    window.addEventListener("focus", keepTabsAwake);

    // স্ক্রিপ্ট চালু হলে সঙ্গে সঙ্গে কাজ শুরু করবে
    keepTabsAwake();
})();


(function() {
    'use strict';
    var solved = false;
    var checkBoxClicked = false;
    var waitingForAudioResponse = false;
    //Node Selectors
    const CHECK_BOX = ".recaptcha-checkbox-border";
    const AUDIO_BUTTON = "#recaptcha-audio-button";
    const PLAY_BUTTON = ".rc-audiochallenge-play-button .rc-button-default";
    const AUDIO_SOURCE = "#audio-source";
    const IMAGE_SELECT = "#rc-imageselect";
    const RESPONSE_FIELD = ".rc-audiochallenge-response-field";
    const AUDIO_ERROR_MESSAGE = ".rc-audiochallenge-error-message";
    const AUDIO_RESPONSE = "#audio-response";
    const RELOAD_BUTTON = "#recaptcha-reload-button";
    const RECAPTCHA_STATUS = "#recaptcha-accessible-status";
    const DOSCAPTCHA = ".rc-doscaptcha-body";
    const VERIFY_BUTTON = "#recaptcha-verify-button";
    const MAX_ATTEMPTS = 5;
    var requestCount = 0;
    var recaptchaLanguage = qSelector("html").getAttribute("lang");
    var audioUrl = "";
    var recaptchaInitialStatus = qSelector(RECAPTCHA_STATUS) ? qSelector(RECAPTCHA_STATUS).innerText : ""
    var serversList = ["https://engageub.pythonanywhere.com","https://engageub1.pythonanywhere.com"];
    var latencyList = Array(serversList.length).fill(10000);
    //Check for visibility && Click the check box
    function isHidden(el) {
        return(el.offsetParent === null)
    }

    async function getTextFromAudio(URL) {
        var minLatency = 100000;
        var url = "";

        //Selecting the last/latest server by default if latencies are equal
        for(let k=0; k< latencyList.length;k++){
            if(latencyList[k] <= minLatency){
                minLatency = latencyList[k];
                url = serversList[k];
            }
        }

        requestCount = requestCount + 1;
        URL = URL.replace("recaptcha.net", "google.com");
        if(recaptchaLanguage.length < 1) {
            console.log("Recaptcha Language is not recognized");
            recaptchaLanguage = "en-US";
        }
        console.log("Recaptcha Language is " + recaptchaLanguage);

        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: "input=" + encodeURIComponent(URL) + "&lang=" + recaptchaLanguage,
            timeout: 60000,
            onload: function(response) {
                console.log("Response::" + response.responseText);
                try {
                    if(response && response.responseText) {
                        var responseText = response.responseText;
                        //Validate Response for error messages or html elements
                        if(responseText == "0" || responseText.includes("<") || responseText.includes(">") || responseText.length < 2 || responseText.length > 50) {
                            //Invalid Response, Reload the captcha
                            console.log("Invalid Response. Retrying..");
                        } else if(qSelector(AUDIO_SOURCE) && qSelector(AUDIO_SOURCE).src && audioUrl == qSelector(AUDIO_SOURCE).src && qSelector(AUDIO_RESPONSE)
                                  && !qSelector(AUDIO_RESPONSE).value && qSelector(AUDIO_BUTTON).style.display == "none" && qSelector(VERIFY_BUTTON)) {
                            qSelector(AUDIO_RESPONSE).value = responseText;
                            qSelector(VERIFY_BUTTON).click();
                        } else {
                            console.log("Could not locate text input box")
                        }
                        waitingForAudioResponse = false;
                    }

                } catch(err) {
                    console.log(err.message);
                    console.log("Exception handling response. Retrying..");
                    waitingForAudioResponse = false;
                }
            },
            onerror: function(e) {
                console.log(e);
                waitingForAudioResponse = false;
            },
            ontimeout: function() {
                console.log("Response Timed out. Retrying..");
                waitingForAudioResponse = false;
            },
        });
    }


    async function pingTest(url) {
        var start = new Date().getTime();
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: "",
            timeout: 8000,
            onload: function(response) {

                if(response && response.responseText && response.responseText=="0") {
                    var end = new Date().getTime();
                    var milliseconds = end - start;

                    // For large values use Hashmap
                    for(let i=0; i< serversList.length;i++){
                        if (url == serversList[i]) {
                            latencyList[i] = milliseconds;
                        }
                    }
                }
            },
            onerror: function(e) {
                console.log(e);
            },
            ontimeout: function() {
                console.log("Ping Test Response Timed out for " + url);
            },
        });
    }


    function qSelectorAll(selector) {
        return document.querySelectorAll(selector);
    }

    function qSelector(selector) {
        return document.querySelector(selector);
    }



    if(qSelector(CHECK_BOX)){
        qSelector(CHECK_BOX).click();
    } else if(window.location.href.includes("bframe")){
        for(let i=0; i< serversList.length;i++){
            pingTest(serversList[i]);
        }
    }

    //Solve the captcha using audio
    var startInterval = setInterval(function() {
        try {
            if(!checkBoxClicked && qSelector(CHECK_BOX) && !isHidden(qSelector(CHECK_BOX))) {
                //console.log("checkbox clicked");
                qSelector(CHECK_BOX).click();
                checkBoxClicked = true;
            }
            //Check if the captcha is solved
            if(qSelector(RECAPTCHA_STATUS) && (qSelector(RECAPTCHA_STATUS).innerText != recaptchaInitialStatus)) {
                solved = true;
                console.log("SOLVED");
                clearInterval(startInterval);
            }
            if(requestCount > MAX_ATTEMPTS) {
                console.log("Attempted Max Retries. Stopping the solver");
                solved = true;
                clearInterval(startInterval);
            }
            if(!solved) {
                if(qSelector(AUDIO_BUTTON) && !isHidden(qSelector(AUDIO_BUTTON)) && qSelector(IMAGE_SELECT)) {
                    // console.log("Audio button clicked");
                    qSelector(AUDIO_BUTTON).click();
                }
                if((!waitingForAudioResponse && qSelector(AUDIO_SOURCE) && qSelector(AUDIO_SOURCE).src
                    && qSelector(AUDIO_SOURCE).src.length > 0 && audioUrl == qSelector(AUDIO_SOURCE).src
                    && qSelector(RELOAD_BUTTON)) ||
                   (qSelector(AUDIO_ERROR_MESSAGE) && qSelector(AUDIO_ERROR_MESSAGE).innerText.length > 0 && qSelector(RELOAD_BUTTON) &&
                    !qSelector(RELOAD_BUTTON).disabled)){
                    qSelector(RELOAD_BUTTON).click();
                } else if(!waitingForAudioResponse && qSelector(RESPONSE_FIELD) && !isHidden(qSelector(RESPONSE_FIELD))
                          && !qSelector(AUDIO_RESPONSE).value && qSelector(AUDIO_SOURCE) && qSelector(AUDIO_SOURCE).src
                          && qSelector(AUDIO_SOURCE).src.length > 0 && audioUrl != qSelector(AUDIO_SOURCE).src
                          && requestCount <= MAX_ATTEMPTS) {
                    waitingForAudioResponse = true;
                    audioUrl = qSelector(AUDIO_SOURCE).src
                    getTextFromAudio(audioUrl);
                }else {
                    //Waiting
                }
            }
            //Stop solving when Automated queries message is shown
            if(qSelector(DOSCAPTCHA) && qSelector(DOSCAPTCHA).innerText.length > 0) {
                console.log("Automated Queries Detected");
                clearInterval(startInterval);
            }
        } catch(err) {
            console.log(err.message);
            console.log("An error occurred while solving. Stopping the solver.");
            clearInterval(startInterval);
        }
    }, 5000);

})();