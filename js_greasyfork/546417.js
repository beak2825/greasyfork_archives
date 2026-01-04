// ==UserScript==
// @name Discord++
// @version 1.2.9.4
// @iconURL   https://i.ibb.co/7znt13j/30162036.png
// @namespace https://greasyfork.org/en/users/735799
// @license      MIT
// @name:es Discord++ | Lleva tu experiencia de discord web al siguiente nivel
// @name:ja Discord++ |「DISCORD」Webエクスペリエンスを次のレベルに引き上げる
// @name:fr Discord++ | Faites passer votre expérience Web Discord au niveau supérieur
// @name:ko Discord++ | Take your Discord web experience to the next level
// @name:zh-CN Discord++ | 使您的discord web体验更上一层楼
// @name:zh-TW Discord++ | 使您的discord web體驗更上一層樓
// @name:pt Discord++ | Leve sua experiência de discórdia na web para o próximo nível
// @name:pt-PT Discord++ | Leve sua experiência de discórdia na web para o próximo nível
// @name:pt-BR Discord++ | Leve sua experiência de discórdia na web para o próximo nível
// @name:ro Discord++ | Luați experiența dvs. web discord la nivelul următor
// @name:ru Discord++ | Поднимите свой опыт работы с Discord в Интернете на новый уровень
// @name:it Discord++ | Porta la tua esperienza web con Discord al livello successivo
// @author @FoxCode
// @description Discord++ adds tons of features to your web browser discord! Custom backgrounds, Account-Switcher, Log deleted messages, custom colors, smooth and new animations, better optimization, no rate limits, and much much more! It also comes with it's own theme (it can be disabled).
// @description:es ¡Discord ++ agrega toneladas de características a discord web! Fondos personalizados, registro de mensajes eliminados, colores personalizados, animaciones nuevas y suaves, mejor optimización, sin límites de velocidad y mucho más. También viene con su propio tema (se puede desactivar).
// @description:ja Discord ++はあなたのウェブブラウザの不和にたくさんの機能を追加します！ カスタム背景、ログ削除されたメッセージ、カスタムカラー、スムーズで新しいアニメーション、より良い最適化、レート制限なし、その他多数！ また、独自のテーマが付属しています（無効にすることができます）。
// @description:fr Discord ++ ajoute des tonnes de fonctionnalités à la discorde de votre navigateur Web! Arrière-plans personnalisés, journal des messages supprimés, couleurs personnalisées, animations fluides et nouvelles, meilleure optimisation, aucune limite de débit et bien plus encore! Il est également livré avec son propre thème (il peut être désactivé).
// @description:ko Discord ++는 웹 브라우저의 discord에 수많은 기능을 추가합니다! 사용자 정의 배경, 로그 삭제 메시지, 사용자 정의 색상, 매끄럽고 새로운 애니메이션, 더 나은 최적화, 속도 제한 없음, 그리고 훨씬 더! 또한 자체 테마와 함께 제공됩니다 (비활성화 할 수 있음).
// @description:zh-CN Discord ++为您的Web浏览器的不和谐添加了许多功能！ 自定义背景，记录已删除的消息，自定义颜色，平滑和新的动画，更好的优化，无速率限制等等！ 它还带有它自己的主题（可以禁用）。
// @description:zh-TW Discord ++為您的Web瀏覽器的不和諧添加了許多功能！ 自定義背景，記錄已刪除的消息，自定義顏色，平滑和新的動畫，更好的優化，無速率限制等等！ 它還帶有它自己的主題（可以禁用）。
// @description:pt-BR Discord ++ adiciona toneladas de recursos à discórdia do seu navegador da web! Planos de fundo personalizados, logs de mensagens excluídos, cores personalizadas, animações novas e suaves, melhor otimização, sem limites de taxa e muito, muito mais! Ele também vem com seu próprio tema (pode ser desativado).
// @description:pt-PT Discord ++ adiciona toneladas de recursos à discórdia do seu navegador da web! Planos de fundo personalizados, logs de mensagens excluídos, cores personalizadas, animações novas e suaves, melhor otimização, sem limites de taxa e muito, muito mais! Ele também vem com seu próprio tema (pode ser desativado).
// @description:pt Discord ++ adiciona toneladas de recursos à discórdia do seu navegador da web! Planos de fundo personalizados, logs de mensagens excluídos, cores personalizadas, animações novas e suaves, melhor otimização, sem limites de taxa e muito, muito mais! Ele também vem com seu próprio tema (pode ser desativado).
// @description:ro Discord ++ adaugă multe funcții discordiei browserului dvs. web! Fundaluri personalizate, jurnale de mesaje șterse, culori personalizate, animații netede și noi, optimizare mai bună, fără limite de rată și multe altele! De asemenea, vine cu propria temă (poate fi dezactivată).
// @description:ru Discord ++ добавляет множество функций в Discord вашего веб-браузера! Пользовательские фоны, удаленные журналы сообщений, пользовательские цвета, плавная и новая анимация, улучшенная оптимизация, отсутствие ограничений по скорости и многое другое! Он также имеет собственную тему (ее можно отключить).
// @description:it Discord ++ aggiunge tonnellate di funzionalità alla discordia del tuo browser web! Sfondi personalizzati, registri dei messaggi eliminati, colori personalizzati, animazioni nuove e fluide, migliore ottimizzazione, nessun limite di velocità e molto altro ancora! Inoltre viene fornito con il proprio tema (può essere disabilitato).
// @grant none
// @match        https://discordapp.com/activ*
// @match        https://discordapp.com/channel*
// @match        https://discord.com/activ*
// @match        https://discord.com/channel*
// @match        https://discord.com/channels/*
// @include https://discord.com/*
// @require https://greasyfork.org/scripts/21927-arrive-js/code/arrivejs.js?version=198809
// @require http://code.jquery.com/jquery-latest.js
// @require      https://cdn.jsdelivr.net/lodash/4.17.2/lodash.min.js
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/546417/Discord%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/546417/Discord%2B%2B.meta.js
// ==/UserScript==
/*||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
/*||| Multiple Accounts ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
/*||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
(function() {
    'use strict';
    const v = "1.2.6 Beta";
    const apiPrefix = "https://discord.com/api/v8";
    let neededClasses = [];
    let functionKeeper = webpackJsonp[0][1];
 
    let classesContain = [
        ["menu","scroller","styleFixed","styleFlexible","item","hideInteraction","customItem","labelContainer","label","subtext","iconContainer","icon","hintContainer","imageContainer","caret","image","disabled","separator","submenuContainer","submenuPaddingContainer","submenu","colorDefault","checkbox","radioSelection","check","focused","colorBrand","colorDanger","colorPremium","groupLabel"],
        ["statusItem","status","icon","description","customStatusItem","customStatusWithEmoji","customEmoji","customEmojiPlaceholder","customText","clearStatusButton","clearStatusIcon"],
        ["layerContainer","layer","layerHidden","disabledPointerEvents"],
        ["backdrop","backdropWithLayer"],
        ["backdrop","layer"],
        ["responsiveWidthMobile","innerPadding","focusLock","root","small","medium","large","fullscreenOnMobile","footer","header","separator","content","close","hideOnFullscreen"],
        ["artHeight","emojiSize","emojiMargin","formGroup","modalRoot","inputContainer","modalCloseButton","headerText","emojiButton","fullOpacity","emojiButtonContainer","emoji","input","clearButton","clearIcon","headerContainer","header","art","cancelButton"],
        ["_flex","_horizontal","_horizontalReverse","flex","horizontal","horizontalReverse","flexChild","flexMarginReset"],
        ["flex","alignStart","alignEnd","alignCenter","alignStretch","alignBaseline","justifyStart","justifyEnd","justifyCenter","justifyAround","justifyBetween","noWrap","wrap","wrapReverse","directionRow","directionRowReverse","directionColumn","spacer","vertical","horizontal","horizontalReverse","flexCenter"],
        ["button","lookFilled","colorBrand","spinnerItem","lookInverted","lookOutlined","lookGhost","lookLink","contents","hoverBrand","hasHover","colorGrey","hoverGrey","colorRed","hoverRed","colorGreen","hoverGreen","colorYellow","hoverYellow","colorLink","hoverLink","colorWhite","hoverWhite","colorBlack","hoverBlack","colorPrimary","hoverPrimary","colorTransparent","hoverTransparent","lookBlank","sizeTiny","sizeSmall","sizeMedium","sizeLarge","sizeXlarge","sizeMin","sizeMax","sizeIcon","grow","fullWidth","submitting","spinner","disabledButtonWrapper","disabledButtonOverlay"],
        ["scrollerBase","thin","fade","scrolling","auto","none","content","disableScrollAnchor"],
        ["container","downloadProgressCircle","guilds","base","sidebar","hasNotice","panels","content","activityPanel","hiddenOnMobileStore"],
        ["notice","colorDefault","button","colorNeutral","colorDownload","colorNotification","colorDark","colorPremium","colorPremiumTier1","colorPremiumTier2","colorInfo","colorSuccess","colorDanger","colorStreamerMode","colorSpotify","platformIcon","colorBrand","colorCustom","closeButton","buttonMinor"],
    ];
    let ccSet = [];
    for (let i = 0; i < classesContain.length; i++) {
        const element = classesContain[i];
        ccSet.push(new Set(element));
    }
    for (const key in functionKeeper) {
        if (functionKeeper.hasOwnProperty(key)) {
            const element = functionKeeper[key];
            let ans = {};
            element(ans);
            ans = ans.exports;
            if(ans != undefined || ans != null){
                ans = Object.keys(ans);
                let a = new Set(ans);
                for (let j = 0; j < ccSet.length; j++) {
                    const element2 = ccSet[j];
                    if(eqSet(element2, a)){
                        neededClasses[j] = key;
                    }
                }
            }
        }
    }
    function eqSet(as, bs) {
        if (as.size !== bs.size) return false;
        for (var a of as) if (!bs.has(a)) return false;
        return true;
    }
    let allClasses = {};
    const createElm = (html) => {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        return temp.removeChild(temp.firstElementChild);
        //webpackJsonp[0][1][neededClasses[0]].toString(); is the way
    }
    const insertCss = (css) => {
        const style = document.createElement('style');
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
        return style;
    }
    insertCss(`.versionNotifier {background-color: #6b1ba7;}
               #changeLogButtonClick:hover {color: #6b1ba7;}
        `);
    function parseAllClasses(){
        for (var i = 0; i < neededClasses.length; i++) {
            let x = {};
            webpackJsonp[0][1][neededClasses[i]](x);
            allClasses[neededClasses[i]] = x.exports;
        }
        console.log(allClasses);
    }
    window.onload = () => {
        let cont = document.getElementsByClassName(allClasses[neededClasses[0]].scroller);
        if(localStorage.versionMA != 69 && !document.getElementsByClassName("versionNotifier")[0]){
            let baseElement = document.getElementsByClassName(allClasses[neededClasses[11]].base);
            if(baseElement[0]){
                baseElement[0].prepend(createElm(`<div class="${allClasses[neededClasses[12]].notice} ${allClasses[neededClasses[12]].colorDefault} versionNotifier"><div class="${allClasses[neededClasses[12]].closeButton}" id="versionNotifierCloseButton" aria-label="Dismiss" role="button" tabindex="0"></div>ERROR LOADING! This version of Discord++ is outdated! ${v} | Update it by clicking: <button id="changeLogButtonClick" class="${allClasses[neededClasses[12]].button}">HERE</button></div>`));
                document.getElementById("changeLogButtonClick").onclick = () => {
                    window.open("https://github.com/FoxsCode/DiscordPlus/raw/main/Discord%2B%2B.user.js");
                    document.getElementsByClassName("versionNotifier")[0].remove();
                    localStorage.versionMA = v;
                }
                document.getElementById("versionNotifierCloseButton").onclick = () => {
                    document.getElementsByClassName("versionNotifier")[0].remove();
                    localStorage.versionMA = v;
                }
            }
        }
    }
    window.localStorage = document.body.appendChild(document.createElement('iframe')).contentWindow.localStorage;
    parseAllClasses();
})();
/*||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
/*||| @grant compatibility |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
/*||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
 
function GM_xmlhttpRequest(aOpts) {
  var req = new XMLHttpRequest();
 
  __setupRequestEvent(aOpts, req, 'abort');
  __setupRequestEvent(aOpts, req, 'error');
  __setupRequestEvent(aOpts, req, 'load');
  __setupRequestEvent(aOpts, req, 'progress');
  __setupRequestEvent(aOpts, req, 'readystatechange');
 
  req.open(aOpts.method, aOpts.url, !aOpts.synchronous,
      aOpts.user || '', aOpts.password || '');
  if (aOpts.overrideMimeType) {
    req.overrideMimeType(aOpts.overrideMimeType);
  }
  if (aOpts.headers) {
    for (var prop in aOpts.headers) {
      if (Object.prototype.hasOwnProperty.call(aOpts.headers, prop)) {
        req.setRequestHeader(prop, aOpts.headers[prop]);
      }
    }
  }
  var body = aOpts.data ? aOpts.data : null;
  if (aOpts.binary) {
    return req.sendAsBinary(body);
  } else {
    return req.send(body);
  }
}
 
function __setupRequestEvent(aOpts, aReq, aEventName) {
  if (!aOpts['on' + aEventName]) return;
 
  aReq.addEventListener(aEventName, function(aEvent) {
    var responseState = {
      responseText: aReq.responseText,
      responseXML: aReq.responseXML,
      readyState: aReq.readyState,
      responseHeaders: null,
      status: null,
      statusText: null,
      finalUrl: null
    };
    switch (aEventName) {
      case "progress":
        responseState.lengthComputable = aEvent.lengthComputable;
        responseState.loaded = aEvent.loaded;
        responseState.total = aEvent.total;
        break;
      case "error":
        break;
      default:
        if (4 != aReq.readyState) break;
        responseState.responseHeaders = aReq.getAllResponseHeaders();
        responseState.status = aReq.status;
        responseState.statusText = aReq.statusText;
        break;
    }
    aOpts['on' + aEventName](responseState);
  });
}
 
const __GM_STORAGE_PREFIX = [
    '', GM_info.script.namespace, GM_info.script.name, ''].join('***');
 
// All of the GM_*Value methods rely on DOM Storage's localStorage facility.
// They work like always, but the values are scoped to a domain, unlike the
// original functions.  The content page's scripts can access, set, and
// remove these values.  A
function GM_deleteValue(aKey) {
  localStorage.removeItem(__GM_STORAGE_PREFIX + aKey);
}
 
function GM_getValue(aKey, aDefault) {
  var val = localStorage.getItem(__GM_STORAGE_PREFIX + aKey);
  if (null === val && 'undefined' != typeof aDefault) return aDefault;
  return val;
}
 
function GM_listValues() {
  var prefixLen = __GM_STORAGE_PREFIX.length;
  var values = [];
  var i = 0;
  for (var i = 0; i < localStorage.length; i++) {
    var k = localStorage.key(i);
    if (k.substr(0, prefixLen) === __GM_STORAGE_PREFIX) {
      values.push(k.substr(prefixLen));
    }
  }
  return values;
}
 
function GM_setValue(aKey, aVal) {
  localStorage.setItem(__GM_STORAGE_PREFIX + aKey, aVal);
}
 
function GM_getResourceURL(aName) {
  return 'greasemonkey-script:' + GM_info.uuid + '/' + aName;
}
/*||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
/*||| Lurk-Mode Switch |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
/*||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
function createBox() {
    if (document.getElementsByTagName('textarea')[0] || document.querySelector(".markup-2BOw-j.slateTextArea-1Mkdgw")){
        var frag = document.createDocumentFragment();
        var outDiv = document.createElement("DIV");
        outDiv.className = "lurkDiv";
        var outLabel = document.createElement("LABEL");
        outLabel.className = "lurkSwitch";
        var outSpan = document.createElement("SPAN");
        outSpan.className = "lurkSlider round";
        var checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.id = "checker";
        var style = document.createElement("style");
        var sheet = document.head.appendChild(style).sheet;
        sheet.insertRule('.lurkSwitch {position: relative; display: inline-block; width: 25px; height: 15px;}',sheet.cssRules.length);
        sheet.insertRule('.lurkSwitch input {display:none;}',sheet.cssRules.length);
        sheet.insertRule('.lurkSlider {position: absolute;cursor: pointer;top: 0;left: 0;right: 0;bottom: 0;background-color: var(--Color005);-webkit-transition: .2s;transition: .2s;}',sheet.cssRules.length);
        sheet.insertRule('.lurkSlider:before {position: absolute;content: "";height: 15px; width: 15px;left: 0px;bottom: 0px;background-color: #262A2D;-webkit-transition: .2s;transition: .2s;}',sheet.cssRules.length);
        sheet.insertRule('input:checked + .lurkSlider {background-color: white;}',sheet.cssRules.length);
        sheet.insertRule('input:focus + .lurkSlider.round {box-shadow: 0px 0px 0px 3px white;}',sheet.cssRules.length);
        sheet.insertRule('input:checked + .lurkSlider.round {box-shadow: 0px 0px 0px 3px white;}',sheet.cssRules.length);
        sheet.insertRule('input:checked + .lurkSlider:before {background-color: var(--Color005); -webkit-transform: translateX(10px);-ms-transform: translateX(10px);transform: translateX(10px);}',sheet.cssRules.length);
        sheet.insertRule('.lurkSlider.round {box-shadow: 0px 0px 0px 3px var(--Color005); border-radius: 3px; border-bottom-right-radius: 0px; border-bottom-left-radius: 0px;}',sheet.cssRules.length);
        sheet.insertRule('.lurkSlider.round:before {border-radius: 100%;}',sheet.cssRules.length);
        sheet.insertRule('.lurkDiv {padding-top: 7px; position: fixed; z-index: 999; padding-left: 40px;}',sheet.cssRules.length);
        frag.appendChild(outDiv);
        outDiv.appendChild(outLabel);
        outLabel.appendChild(checkBox);
        outLabel.appendChild(outSpan);
        var appFront = document.getElementById('app-mount');
        appFront.parentNode.insertBefore(frag, appFront.nextSibling);
    } else {
        setTimeout(createBox,1000);
    }
}
 
function recheck(){
    var messageBox = document.querySelector(".markup-2BOw-j.slateTextArea-1Mkdgw");
    var preMessageBox = document.getElementsByTagName('textarea')[0];
    if (messageBox) {
        if (document.getElementById('checker').checked === true) {
            messageBox.setAttribute('contentEditable', false);
            messageBox.setAttribute("style", "outline: none; white-space: pre-wrap; overflow-wrap: break-word;");
        } else {
            messageBox.setAttribute('contentEditable', true);
            messageBox.setAttribute("style", "outline: none; white-space: pre-wrap; overflow-wrap: break-word; -webkit-user-modify: none;");
        }
    }
    if (preMessageBox) {
        if (document.getElementById('checker').checked === true) {
            preMessageBox.setAttribute('disabled', true);
        } else {
            preMessageBox.removeAttribute('disabled');
        }
    }
}
 
window.addEventListener("load", createBox, false);
window.addEventListener("click", recheck, false);
 
/*||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
/*||| Silent Typing ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
/*||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
(function () {
    "use strict";
 
    let cancel = null;
 
    const start = function () {
        const module = WebpackModules.findByUniqueProperties(["startTyping"]);
        if (!module) {
            console.error("SilentTyping:", "unable to monkey patch sendTyping method");
            return;
        }
        cancel = monkeyPatch(module, "startTyping", {instead: ()=>{}});
    };
 
    const stop = function () {
        if (cancel) {
            cancel();
            cancel = null;
        }
    };
 
    /**
     * Function with no arguments and no return value that may be called to reverse changes that is done by {@link monkeyPatch} method, restoring (unpatching) original method.
     * @callback cancelPatch
     */
 
    /**
     * This is a shortcut for calling original method using this and arguments from data object. This is a function without input arguments. This function is defined as `() => data.returnValue = data.originalMethod.apply(data.thisObject, data.methodArguments)`
     * @callback originalMethodCall
     * @return {*} The same value, which is returned from original method, also this value would be written into `data.returnValue`
     */
 
    /**
     * A callback that modifies method logic. Callback is called on each call of original method and have all data about original call. Any of the data can be modified if you need, but do it wisely.
     * @callback doPatchCallback
     * @param {PatchData} data Data object with all information about current that you may need in your patching callback.callback.
     * @return {*} Makes sense only when used as `instead` parameter in {@link monkeyPatch}. If returned something other then undefined - it replaces value in `returnValue` param. If used as `before` or `after` parameters - return value if ignored.
     */
 
    /**
     * This is function for monkey-patching any object method. Can make patch before, after or instead of target method.
     * Be careful when monkey-patching. Think not only about original functionality of target method and you changes, but also about develovers of other plugins, who may also patch this method before or after you. Try to change target method behaviour little as you can, and try to never change method signatures.
     * By default this function makes log messages about each patching and unpatching, so you and other developers can see what methods a patched. This messages may be suppressed.
     * Display name of patched method is changed, so you can see if function is patched and how many times while debuging or in the stack trace. Also patched function have property `__monkeyPatched` is set to true, in case you want to check something programmatically.
     *
     * @author samogot
     * @param {object} what Object to be patched. You can can also pass class prototypes to patch all class instances. If you are patching prototype of react component you may also need {@link Renderer.rebindMethods}.
     * @param {string} methodName The name of the target message to be patched.
     * @param {object} options Options object. You should provide at least one of `before`, `after` or `instead` parameters. Other parameters are optional.
     * @param {doPatchCallback} options.before Callback that will be called before original target method call. You can modify arguments here, so it will be passed to original method. Can be combined with `after`.
     * @param {doPatchCallback} options.after Callback that will be called after original target method call. You can modify return value here, so it will be passed to external code which calls target method. Can be combined with `before`.
     * @param {doPatchCallback} options.instead Callback that will be called instead of original target method call. You can get access to original method using `originalMethod` parameter if you want to call it, but you do not have to. Can't be combined with `before` and `after`.
     * @param {boolean} [options.once=false] Set to true if you want automatically unpatch method after first call.
     * @param {boolean} [options.silent=false] Set to true if you want to suppress log messages about patching and unpatching. Useful to avoid clogging the console in case of frequent conditional patching/unpatching, for example from another monkeyPatch callback.
     * @param {boolean} [options.displayName] You can provide meaningful name of class/object provided in `what` param for logging purposes. By default there will be a try to determine name automatically.
     * @return {cancelPatch} Function with no arguments and no return value that should be called to cancel (unpatch) this patch. You should save and run it when your plugin is stopped.
     */
    const monkeyPatch = window.DiscordInternals && window.DiscordInternals.monkeyPatch || ((what, methodName, options) => {
        const {before, after, instead, once = false, silent = false} = options;
        const displayName = options.displayName || what.displayName || what.name || what.constructor.displayName || what.constructor.name;
        if (!silent) console.log('patch', methodName, 'of', displayName);
        const origMethod = what[methodName];
        const cancel = () => {
            if (!silent) console.log('unpatch', methodName, 'of', displayName);
            what[methodName] = origMethod;
        };
        what[methodName] = function() {
            /**
             * @interface
             * @name PatchData
             * @property {object} thisObject Original `this` value in current call of patched method.
             * @property {Arguments} methodArguments Original `arguments` object in current call of patched method. Please, never change function signatures, as it may cause a lot of problems in future.
             * @property {cancelPatch} cancelPatch Function with no arguments and no return value that may be called to reverse patching of current method. Calling this function prevents running of this callback on further original method calls.
             * @property {function} originalMethod Reference to the original method that is patched. You can use in if you need some special usage. You should explicitly provide this value and method arguments when you call this function.
             * @property {originalMethodCall} callOriginalMethod This is a shortcut for calling original method using this and arguments from data object.
             * @property {*} returnValue This is a value returned from original function call. This property is avilable only in `after` callback, or in `instead` callback after calling `callOriginalMethod` function
             */
            const data = {
                thisObject: this,
                methodArguments: arguments,
                cancelPatch: cancel,
                originalMethod: origMethod,
                callOriginalMethod: () => data.returnValue = data.originalMethod.apply(data.thisObject, data.methodArguments)
            };
            if (instead) {
                const tempRet = instead(data);
                if (tempRet !== undefined)
                    data.returnValue = tempRet;
            }
            else {
                if (before) before(data);
                data.callOriginalMethod();
                if (after) after(data);
            }
            if (once) cancel();
            return data.returnValue;
        };
        what[methodName].__monkeyPatched = true;
        what[methodName].displayName = 'patched ' + (what[methodName].displayName || methodName);
        return cancel;
    });
 
    /**
     * @author samogot
     */
    const WebpackModules = window.DiscordInternals && window.DiscordInternals.WebpackModules || (() => {
 
        const req = typeof(webpackJsonp) == "function" ? webpackJsonp([], {
                '__extra_id__': (module, exports, req) => exports.default = req
        }, ['__extra_id__']).default : webpackJsonp.push([[], {
                '__extra_id__': (module, exports, req) => module.exports = req
        }, [['__extra_id__']]]);
        delete req.m['__extra_id__'];
        delete req.c['__extra_id__'];
 
        /**
         * Predicate for searching module
         * @callback modulePredicate
         * @param {*} module Module to test
         * @return {boolean} Thue if it is module that you need
         */
 
        /**
         * Look through all modules of internal Discord's Webpack and return first one that match filter predicate.
         * At first this function will look thruogh alreary loaded modules cache. If no one of loaded modules is matched - then this function tries to load all modules and match for them. Loading any module may have unexpected side effects, like changing current locale of moment.js, so in that case there will be a warning the console. If no module matches - function will return null. You sould always take such predicate to match something, gut your code should be ready to recieve null in case if Discord update something in codebase.
         * If module is ES6 module and hafe default property - only default would be considered, otherwise - full module object.
         * @param {modulePredicate} filter Predicate to match module
         * @return {*} First module that matched by filter or null if none is matched.
         */
        const find = (filter) => {
            for (let i in req.c) {
                if (req.c.hasOwnProperty(i)) {
                    let m = req.c[i].exports;
                    if (m && m.__esModule && m.default)
                        m = m.default;
                    if (m && filter(m))
                        return m;
                }
            }
            console.warn('Cannot find loaded module in cache.');
            return null;
        };
 
        /**
         * Look through all modules of internal Discord's Webpack and return first object that has all of following properties. You should be ready that in any moment, after Discord update, this function may start returning null (if no such object exists any more) or even some different object with the same properties. So you should provide all property names that you use, and often even some extra properties to make sure you'll get exactly what you want.
         * @see Read {@link find} documentation for more details how search works
         * @param {string[]} propNames Array of property names to look for
         * @return {object} First module that matched by propNames or null if none is matched.
         */
        const findByUniqueProperties = (propNames) => find(module => propNames.every(prop => module[prop] !== undefined));
 
        /**
         * Look through all modules of internal Discord's Webpack and return first object that has displayName property with following value. This is useful for searching React components by name. Take into account that not all components are exported as modules. Also there might be several components with same names
         * @see Use {@link ReactComponents} as another way to get react components
         * @see Read {@link find} documentation for more details how search works
         * @param {string} displayName Display name property value to look for
         * @return {object} First module that matched by displayName or null if none is matched.
         */
        const findByDisplayName = (displayName) => find(module => module.displayName === displayName);
 
        return {find, findByUniqueProperties, findByDisplayName};
 
    })();
 
    window.setTimeout(start, 5000);
})();
 
/*||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
/*||| CodeBlock Line Numbers |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
/*||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
(function ($) {
    "use strict";
 
    // Helper function for finding all elements matching selector affected by a mutation
    function mutationFind(mutation, selector) {
        var target = $(mutation.target), addedNodes = $(mutation.addedNodes);
        var mutated = target.add(addedNodes).filter(selector);
        var descendants = addedNodes.find(selector);
        var ancestors = target.parents(selector);
        return mutated.add(descendants).add(ancestors);
    }
 
    // Watch for new code blocks
    new MutationObserver(function (mutations, observer) {
        mutations.forEach(function (mutation) {
            mutationFind(mutation, ".hljs").not(":has(ol)")
                .each(function () {
                    this.innerHTML = this.innerHTML.split("\n").map(line => "<li>"+line+"</li>").join("");
                })
                .wrapInner($("<ol>").addClass("kawaii-linenumbers"));
        });
    }).observe(document, { childList:true, subtree:true });
})(jQuery.noConflict(true));
 
/*||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
/*||| Channel Hide/Show ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
/*||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
 
(function() {
    'use strict';
 
    // Classes of DIVs you want to be able to toggle sidebar
    const toggleButtons = [
        "children-19S4PO",
        "toggleChannelsBtn"
    ];
    const columnToHide = "sidebar-2K8pFh"
    const showHideSidebarButtonParentClass = "scroller-2TZvBN";
    //const showHideSidebarButtonParentClass = "wrapper-1Rf91z"; //top bar instead
    const roomDivClass = "containerDefault-1ZnADq";
    const unreadClass = "unread-3zKkbm";
    const channelsWidth = "240px";
 
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
 
    async function pageload() {
        // Wait 5 seconds for page to load
        await sleep(5000);
        main()
    }
 
    const toggleVisibility = function() {
        let sidebar = document.getElementsByClassName(columnToHide)[0];
        sidebar.style.transition = "width 150ms ease-out, opacity 150ms ease-out";
        if (sidebar.style.width == "1px") {
            sidebar.style.width = channelsWidth;
            sidebar.style.opacity = "1";
        } else {
            sidebar.style.width = "1px";
            sidebar.style.opacity = "0";
        }
    }
 
    let cheveronDirection = function() {
        const sidebar = document.getElementsByClassName(columnToHide)[0]
        const btn = document.getElementById("dtcb-cheverons")
        if (sidebar.style.width == "1px") {
            btn.innerText = "›"; // symbol for >
        } else {
            btn.innerText = "‹"; // symbol for <
        }
    }
 
    const createSidebarButton = function() {
        let btnDiv = document.createElement("div");
        btnDiv.setAttribute("class", "toggleChannelsBtn");
        btnDiv.setAttribute("id", "toggleChannelsBtn");
        btnDiv.style.width = "70px";
        btnDiv.style.color = "#FFFFFF";
        btnDiv.style.position = "absolute";
        btnDiv.style.top = "0";
        btnDiv.style.zIndex = "3";
        let btn = document.createElement("p");
        btn.setAttribute("id", "dtcb-cheverons");
        btn.innerText = "‹"; // symbol for <
        btn.style.margin = "0";
        btn.style.position = "fixed";
        btn.style.cursor = "pointer";
        btn.style.backgroundColor = "#36393f";
        btn.style.color = "unset";
        // btn.style.display = "inline-flex";
        btn.style.padding = "0px 6px 4px";
        btn.style.justifyContent = "center";
        btn.style.borderBottomRightRadius = "10px";
        btn.style.fontSize = "15px";
        btnDiv.appendChild(btn);
        return btnDiv;
    }
 
    const addListenersToToggleButtons = function() {
        toggleButtons.forEach(function(elem) {
            document.getElementsByClassName(elem)[0].addEventListener('click', function() {
                toggleVisibility();
                cheveronDirection();
            })
        });
    }
 
    const autohideSidebar = function() {
        const roomDivs = document.getElementsByClassName(roomDivClass)
        Array.from(roomDivs).forEach(function(room) {
            room.addEventListener('click', function() {
                toggleVisibility();
                cheveronDirection();
            })
        })
    }
 
 
 
    const main = function() {
        console.log("[*] Loading Discord Toggle Channenels Bar");
        const newBtn = createSidebarButton()
        document.getElementsByClassName(showHideSidebarButtonParentClass)[0].appendChild(newBtn)
        addListenersToToggleButtons();
        autohideSidebar();
    }
 
    pageload();
})();
 
 
/*||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
/*||| Theme 1 ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
/*||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
 
 
 
 
// look for blocked messages and remove the great grandparent (main container for blocked messages)
document.getElementById("app-mount").arrive(".blockedSystemMessage-2Rk1ek", function() {
  // 'this' refers to the newly created element
  this.parentNode.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode.parentNode); // fuck you is why
});
 
 
 
// look for username headers and change the visible timestamp to be more detailed
document.getElementById("app-mount").arrive(".header-23xsNx", function() {
  // 'this' refers to the newly created element
 
 
  var snowflake = this.parentNode.parentNode.id.substr(14); // snowflake is last 14 of id for any given message
 
  var displayedTime = this.getElementsByClassName("timestamp-3ZCmNB")[0].getElementsByTagName("span")[0]; // get the timestamp text field
 
  var timestamp = new Date(parseInt(snowflake /4194304 + 1420070400000)); // get leftmost 48 bytes and add unix timestamp for 1/1/2015 00:00.0000
 
  if (timestamp > 1420070400000) { // fails gracefully by not editing DOM if timestamp can't be determined
    if (timestamp > (new Date().getTime() - (12*60*60*1000))) { // within the last 12 hours
      displayedTime.innerText = ('00' + timestamp.getHours()).slice(-2); // hours
    }
    else {
      displayedTime.innerText = days[timestamp.getDay()];//weekday
      displayedTime.innerText += ' ' + mos[timestamp.getMonth()];//month
      displayedTime.innerText += ' ' + timestamp.getDate();//day number
      displayedTime.innerText += ', ' + timestamp.getFullYear();//year
      displayedTime.innerText += ' at ' + ('00' + timestamp.getHours()).slice(-2);//hours
    }
    displayedTime.innerText += ':' + ('00' + timestamp.getMinutes()).slice(-2);//minutes
    displayedTime.innerText += ':' + ('00' + timestamp.getSeconds()).slice(-2); //seconds
    //displayedTime.innerText += '.' + ('0000' + timestamp.getMilliseconds()).slice(-4); //milliseconds
  }
});
    (function() {
let css = `
/* ==UserStyle==
/*||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
/*||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
/*||| Fixes | Level & Perks Server Notice Button Clicking ||||||||||||||||||||||||||||||||||||||||||||||||||*/
/*||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
/*||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
 
/* BurpleRecolor wasnt letting users click on the "X" (Close) and the "See Levels & Perks" button, this fixes it */
.channelNotice-1-XFjC::before,
.channelNotice-1-XFjC::after,
.channelNotice-3DDmsB::before,
.channelNotice-3DDmsB::after,
#app-mount .channelNotice-3hkOiI::before,
#app-mount .channelNotice-3hkOiI::after {
	pointer-events:none;
}
==/UserStyle== */
`;
    if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
 
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
};
        (function() {
    'use strict';
 
    const targets = [ "avatarContainer-2inGBK", "avatar-1BDn8e", "wrapper-3t9DeA", "emoji" ];
    const textStyle = `
.zoomin-canvas {
    border-radius: 8px;
    position: fixed;
    background-color: #e0e0e0;
    pointer-events: none;
    opacity: 0 !important;
    z-index: 1003;
}
.zoomin-canvas-show {
    transition: opacity 0.4s;
    opacity: 1 !important;
}
.zoomin-zoom {
    position: relative;
    left: 5px;
    top: 5px;
    border-radius: 8px;
    pointer-events: none;
    opacity: 0 !important;
}
.zoomin-zoom-show {
    transition: opacity 0.4s;
    opacity: 1 !important;
}
.content-1o0f9g {
    background: var(--background-primary) !important; }`;
    let currentUrl = document.location.href;
    let updating = false, showing = false;
    let canvas, zoom;
 
    css();
 
    init(10);
 
    locationChange();
 
    window.addEventListener("scroll", update, true);
 
    function init(times) {
        for (let i = 0; i < times; i++) {
            setTimeout(createCanvas, 500 * i);
            setTimeout(createZoom, 500 * i);
            for (const target of targets) {
                setTimeout(() => eventListener(target), 500 * i);
            }
        }
    }
 
    // create
    function createCanvas() {
        // check exist
        if (!!canvas) return;
        // create
        canvas = document.createElement("div");
        canvas.classList.add("zoomin-canvas");
        document.body.appendChild(canvas);
    }
 
    function createZoom() {
        // check exist
        if (!canvas || !!zoom) return;
        // create
        zoom = document.createElement("img");
        zoom.classList.add("zoomin-zoom");
        zoom.style.backgroundColor = getTheme();
        canvas.appendChild(zoom);
    }
 
    // event
    function eventListener(target) {
        // return if canvas or zoom doesn't exist.
        if (!canvas || !zoom) return;
        // add target mouse event.
        document.querySelectorAll(`.${target}:not(zoomin-listener)`).forEach(t => {
            t.classList.add("zoomin-listener");
            t.addEventListener("mousemove", showImage);
            t.addEventListener("mouseleave", hideImage);
        });
    }
 
    function showImage() {
        // avoid calling this function multiple times.
        if (showing) return;
        showing = true;
        // detail
        const url = getSource(this);
        if (!url) return;
        zoom.setAttribute("src", url);
        zoomDetail();
    }
 
    function hideImage() {
        showing = false;
        canvas.classList.remove("zoomin-canvas-show");
        zoom.classList.remove("zoomin-zoom-show");
        setTimeout(() => {
            if (!showing) zoom.removeAttribute("src");
        }, 500);
    }
 
    function zoomDetail() {
        // wait until get the image size.
        if (!zoom.naturalWidth)
        {
            setTimeout(zoomDetail, 100);
            return;
        }
        // size
        const w = zoom.naturalWidth;
        const h = zoom.naturalHeight;
        canvas.style.width = `${w + 10}px`;
        canvas.style.height = `${h + 10}px`;
        zoom.style.width = `${w}px`;
        zoom.style.height = `${h}px`;
        // position
        let left = getCursorX();
        let top = getCursorY();
        const clientW = document.documentElement.clientWidth;
        // situation 1: the icon position is too right to show.
        if (left + w > clientW) left = left - w;
        // situation 2: the icon position is too top to show.
        if (top - h - 30 > 0) top = top - h - 30;
        canvas.style.left = `${left}px`;
        canvas.style.top = `${top}px`;
        // class
        canvas.classList.add("zoomin-canvas-show");
        zoom.classList.add("zoomin-zoom-show");
    }
 
    // method
    function getSource(element) {
        // situation 1: image
        if (!!element.src) return element.src;
        // situation 2: div with style
        else if (!!element.style.backgroundImage) return element.style.backgroundImage.split(/"/)[1];
        // situation 3: div children
        else if (!!element.querySelector("img")) return element.querySelector("img").src;
        // situation 4: not an image
        else return null;
    }
 
    function getTheme() {
        const theme = document.querySelector("html").className.includes("light") ? "#ffffff" : "#363940";
        return theme;
    }
 
    function getCursorX() {
        const e = window.event;
        return e.pageX - document.documentElement.scrollLeft - document.body.scrollLeft;
    }
 
    function getCursorY() {
        const e = window.event;
        return e.pageY - document.documentElement.scrollTop - document.body.scrollTop;
    }
 
    // others
    function css() {
        const style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = textStyle;
        document.head.appendChild(style);
    }
 
    function update() {
        if (updating) return;
        updating = true;
        init(3);
        setTimeout(() => { updating = false; }, 1000);
    }
 
    function locationChange() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(() => {
                if (currentUrl !== document.location.href) {
                    currentUrl = document.location.href;
                    init(10);
                }
            });
        });
        const target = document.body;
        const config = { childList: true, subtree: true };
        observer.observe(target, config);
    }
 
})();
async function deleteMessages(authToken, authorId, guildId, channelId, minId, maxId, content, hasLink, hasFile, includeNsfw, includePinned, searchDelay, deleteDelay, extLogger, stopHndl, onProgress) {
    const start = new Date();
    let delCount = 0;
    let failCount = 0;
    let avgPing;
    let lastPing;
    let grandTotal;
    let throttledCount = 0;
    let throttledTotalTime = 0;
    let offset = 0;
    let iterations = -1;
 
    const wait = async ms => new Promise(done => setTimeout(done, ms));
    const msToHMS = s => `${s / 3.6e6 | 0}h ${(s % 3.6e6) / 6e4 | 0}m ${(s % 6e4) / 1000 | 0}s`;
    const escapeHTML = html => html.replace(/[&<"']/g, m => ({ '&': '&amp;', '<': '&lt;', '"': '&quot;', '\'': '&#039;' })[m]);
    const redact = str => `<span class="priv">${escapeHTML(str)}</span><span class="mask">REDACTED</span>`;
    const queryString = params => params.filter(p => p[1] !== undefined).map(p => p[0] + '=' + encodeURIComponent(p[1])).join('&');
    const ask = async msg => new Promise(resolve => setTimeout(() => resolve(window.confirm(msg)), 10));
    const printDelayStats = () => log.verb(`Delete delay: ${deleteDelay}ms, Search delay: ${searchDelay}ms`, `Last Ping: ${lastPing}ms, Average Ping: ${avgPing | 0}ms`);
    const toSnowflake = (date) => /:/.test(date) ? ((new Date(date).getTime() - 1420070400000) * Math.pow(2, 22)) : date;
 
    const log = {
        debug() { extLogger ? extLogger('debug', arguments) : console.debug.apply(console, arguments); },
        info() { extLogger ? extLogger('info', arguments) : console.info.apply(console, arguments); },
        verb() { extLogger ? extLogger('verb', arguments) : console.log.apply(console, arguments); },
        warn() { extLogger ? extLogger('warn', arguments) : console.warn.apply(console, arguments); },
        error() { extLogger ? extLogger('error', arguments) : console.error.apply(console, arguments); },
        success() { extLogger ? extLogger('success', arguments) : console.info.apply(console, arguments); },
    };
 
    async function recurse() {
        let API_SEARCH_URL;
        if (guildId === '@me') {
            API_SEARCH_URL = `https://discord.com/api/v6/channels/${channelId}/messages/`; // DMs
        }
        else {
            API_SEARCH_URL = `https://discord.com/api/v6/guilds/${guildId}/messages/`; // Server
        }
 
        const headers = {
            'Authorization': authToken
        };
 
        let resp;
        try {
            const s = Date.now();
            resp = await fetch(API_SEARCH_URL + 'search?' + queryString([
                ['author_id', authorId || undefined],
                ['channel_id', (guildId !== '@me' ? channelId : undefined) || undefined],
                ['min_id', minId ? toSnowflake(minId) : undefined],
                ['max_id', maxId ? toSnowflake(maxId) : undefined],
                ['sort_by', 'timestamp'],
                ['sort_order', 'desc'],
                ['offset', offset],
                ['has', hasLink ? 'link' : undefined],
                ['has', hasFile ? 'file' : undefined],
                ['content', content || undefined],
                ['include_nsfw', includeNsfw ? true : undefined],
            ]), { headers });
            lastPing = (Date.now() - s);
            avgPing = avgPing > 0 ? (avgPing * 0.9) + (lastPing * 0.1) : lastPing;
        } catch (err) {
            return log.error('Search request threw an error:', err);
        }
 
        // not indexed yet
        if (resp.status === 202) {
            const w = (await resp.json()).retry_after;
            throttledCount++;
            throttledTotalTime += w;
            log.warn(`This channel wasn't indexed, waiting ${w}ms for discord to index it...`);
            await wait(w);
            return await recurse();
        }
 
        if (!resp.ok) {
            // searching messages too fast
            if (resp.status === 429) {
                const w = (await resp.json()).retry_after;
                throttledCount++;
                throttledTotalTime += w;
                searchDelay += w; // increase delay
                log.warn(`Being rate limited by the API for ${w}ms! Increasing search delay...`);
                printDelayStats();
                log.verb(`Cooling down for ${w * 2}ms before retrying...`);
 
                await wait(w * 2);
                return await recurse();
            } else {
                return log.error(`Error searching messages, API responded with status ${resp.status}!\n`, await resp.json());
            }
        }
 
        const data = await resp.json();
        const total = data.total_results;
        if (!grandTotal) grandTotal = total;
        const discoveredMessages = data.messages.map(convo => convo.find(message => message.hit === true));
        const messagesToDelete = discoveredMessages.filter(msg => {
            return msg.type === 0 || msg.type === 6 || (msg.pinned && includePinned);
        });
        const skippedMessages = discoveredMessages.filter(msg => !messagesToDelete.find(m => m.id === msg.id));
 
        const end = () => {
            log.success(`Ended at ${new Date().toLocaleString()}! Total time: ${msToHMS(Date.now() - start.getTime())}`);
            printDelayStats();
            log.verb(`Rate Limited: ${throttledCount} times. Total time throttled: ${msToHMS(throttledTotalTime)}.`);
            log.debug(`Deleted ${delCount} messages, ${failCount} failed.\n`);
        }
 
        const etr = msToHMS((searchDelay * Math.round(total / 25)) + ((deleteDelay + avgPing) * total));
        log.info(`Total messages found: ${data.total_results}`, `(Messages in current page: ${data.messages.length}, To be deleted: ${messagesToDelete.length}, System: ${skippedMessages.length})`, `offset: ${offset}`);
        printDelayStats();
        log.verb(`Estimated time remaining: ${etr}`)
 
 
        if (messagesToDelete.length > 0) {
 
            if (++iterations < 1) {
                log.verb(`Waiting for your confirmation...`);
                if (!await ask(`Do you want to delete ~${total} messages?\nEstimated time: ${etr}\n\n---- Preview ----\n` +
                    messagesToDelete.map(m => `${m.author.username}#${m.author.discriminator}: ${m.attachments.length ? '[ATTACHMENTS]' : m.content}`).join('\n')))
                    return end(log.error('Aborted by you!'));
                log.verb(`OK`);
            }
 
            for (let i = 0; i < messagesToDelete.length; i++) {
                const message = messagesToDelete[i];
                if (stopHndl && stopHndl() === false) return end(log.error('Stopped by you!'));
 
                log.debug(`${((delCount + 1) / grandTotal * 100).toFixed(2)}% (${delCount + 1}/${grandTotal})`,
                    `Deleting ID:${redact(message.id)} <b>${redact(message.author.username + '#' + message.author.discriminator)} <small>(${redact(new Date(message.timestamp).toLocaleString())})</small>:</b> <i>${redact(message.content).replace(/\n/g, '↵')}</i>`,
                    message.attachments.length ? redact(JSON.stringify(message.attachments)) : '');
                if (onProgress) onProgress(delCount + 1, grandTotal);
 
                let resp;
                try {
                    const s = Date.now();
                    const API_DELETE_URL = `https://discord.com/api/v6/channels/${message.channel_id}/messages/${message.id}`;
                    resp = await fetch(API_DELETE_URL, {
                        headers,
                        method: 'DELETE'
                    });
                    lastPing = (Date.now() - s);
                    avgPing = (avgPing * 0.9) + (lastPing * 0.1);
                    delCount++;
                } catch (err) {
                    log.error('Delete request throwed an error:', err);
                    log.verb('Related object:', redact(JSON.stringify(message)));
                    failCount++;
                }
 
                if (!resp.ok) {
                    // deleting messages too fast
                    if (resp.status === 429) {
                        const w = (await resp.json()).retry_after;
                        throttledCount++;
                        throttledTotalTime += w;
                        deleteDelay = w; // increase delay
                        log.warn(`Being rate limited by the API for ${w}ms! Adjusted delete delay to ${deleteDelay}ms.`);
                        printDelayStats();
                        log.verb(`Cooling down for ${w * 2}ms before retrying...`);
                        await wait(w * 2);
                        i--; // retry
                    } else {
                        log.error(`Error deleting message, API responded with status ${resp.status}!`, await resp.json());
                        log.verb('Related object:', redact(JSON.stringify(message)));
                        failCount++;
                    }
                }
 
                await wait(deleteDelay);
            }
 
            if (skippedMessages.length > 0) {
                grandTotal -= skippedMessages.length;
                offset += skippedMessages.length;
                log.verb(`Found ${skippedMessages.length} system messages! Decreasing grandTotal to ${grandTotal} and increasing offset to ${offset}.`);
            }
 
            log.verb(`Searching next messages in ${searchDelay}ms...`, (offset ? `(offset: ${offset})` : ''));
            await wait(searchDelay);
 
            if (stopHndl && stopHndl() === false) return end(log.error('Stopped by you!'));
 
            return await recurse();
        } else {
            if (total - offset > 0) log.warn('Ended because API returned an empty page.');
            return end();
        }
    }
 
    log.success(`\nStarted at ${start.toLocaleString()}`);
    log.debug(`authorId="${redact(authorId)}" guildId="${redact(guildId)}" channelId="${redact(channelId)}" minId="${redact(minId)}" maxId="${redact(maxId)}" hasLink=${!!hasLink} hasFile=${!!hasFile}`);
    if (onProgress) onProgress(null, 1);
    return await recurse();
}
 
//---- User interface ----//
 
let popover;
let btn;
let stop;
 
function initUI() {
 
    const insertCss = (css) => {
        const style = document.createElement('style');
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
        return style;
    }
 
    const createElm = (html) => {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        return temp.removeChild(temp.firstElementChild);
    }
 
    insertCss(`
        #undicord-btn{position: relative; height: 24px;width: auto;-webkit-box-flex: 0;-ms-flex: 0 0 auto;flex: 0 0 auto;margin: 0 8px;cursor:pointer; color: var(--interactive-normal);}
        #undiscord{position:fixed;top:100px;right:10px;bottom:10px;width:780px;z-index:99;color:var(--text-normal);background-color:var(--background-secondary);box-shadow:var(--elevation-stroke),var(--elevation-high);border-radius:4px;display:flex;flex-direction:column}
        #undiscord a{color:#00b0f4}
        #undiscord.redact .priv{display:none!important}
        #undiscord:not(.redact) .mask{display:none!important}
        #undiscord.redact [priv]{-webkit-text-security:disc!important}
        #undiscord .toolbar span{margin-right:8px}
        #undiscord button,#undiscord .btn{color:#fff;background:#7289da;border:0;border-radius:4px;font-size:14px}
        #undiscord button:disabled{display:none}
        #undiscord input[type="text"],#undiscord input[type="search"],#undiscord input[type="password"],#undiscord input[type="datetime-local"],#undiscord input[type="number"]{background-color:#202225;color:#b9bbbe;border-radius:4px;border:0;padding:0 .5em;height:24px;width:144px;margin:2px}
        #undiscord input#file{display:none}
        #undiscord hr{border-color:rgba(255,255,255,0.1)}
        #undiscord .header{padding:12px 16px;background-color:var(--background-tertiary);color:var(--text-muted)}
        #undiscord .form{padding:8px;background:var(--background-secondary);box-shadow:0 1px 0 rgba(0,0,0,.2),0 1.5px 0 rgba(0,0,0,.05),0 2px 0 rgba(0,0,0,.05)}
        #undiscord .logarea{overflow:auto;font-size:.75rem;font-family:Consolas,Liberation Mono,Menlo,Courier,monospace;flex-grow:1;padding:10px}
    `);
 
    popover = createElm(`
    <div id="undiscord" style="display:none;">
        <div class="header">
            Undiscord - Bulk delete messages
        </div>
        <div class="form">
            <div style="display:flex;flex-wrap:wrap;">
                <span>Authorization <a
                        href="https://github.com/victornpb/deleteDiscordMessages/blob/master/help/authToken.md" title="Help"
                        target="_blank">?</a> <button id="getToken">get</button><br>
                    <input type="password" id="authToken" placeholder="Auth Token" autofocus>*<br>
                    <span>Author <a href="https://github.com/victornpb/deleteDiscordMessages/blob/master/help/authorId.md"
                            title="Help" target="_blank">?</a> <button id="getAuthor">get</button></span>
                    <br><input id="authorId" type="text" placeholder="Author ID" priv></span>
                <span>Guild/Channel <a
                        href="https://github.com/victornpb/deleteDiscordMessages/blob/master/help/channelId.md" title="Help"
                        target="_blank">?</a>
                    <button id="getGuildAndChannel">get</button><br>
                    <input id="guildId" type="text" placeholder="Guild ID" priv><br>
                    <input id="channelId" type="text" placeholder="Channel ID" priv><br>
                    <label><input id="includeNsfw" type="checkbox">NSFW Channel</label><br><br>
                    <label for="file" title="Import list of channels from messages/index.json file"> Import: <span
                            class="btn">...</span> <input id="file" type="file" accept="application/json,.json"></label>
                </span><br>
                <span>Range <a href="https://github.com/victornpb/deleteDiscordMessages/blob/master/help/messageId.md"
                        title="Help" target="_blank">?</a><br>
                    <input id="minDate" type="datetime-local" title="After" style="width:auto;"><br>
                    <input id="maxDate" type="datetime-local" title="Before" style="width:auto;"><br>
                    <input id="minId" type="text" placeholder="After message with Id" priv><br>
                    <input id="maxId" type="text" placeholder="Before message with Id" priv><br>
                </span>
                <span>Search messages <a
                        href="https://github.com/victornpb/deleteDiscordMessages/blob/master/help/filters.md" title="Help"
                        target="_blank">?</a><br>
                    <input id="content" type="text" placeholder="Containing text" priv><br>
                    <label><input id="hasLink" type="checkbox">has: link</label><br>
                    <label><input id="hasFile" type="checkbox">has: file</label><br>
                    <label><input id="includePinned" type="checkbox">Include pinned</label>
                </span><br>
                <span>Search Delay <a
                href="https://github.com/victornpb/deleteDiscordMessages/blob/master/help/delay.md" title="Help"
                target="_blank">?</a><br>
                    <input id="searchDelay" type="number" value="100" step="100"><br>
                </span>
                <span>Delete Delay <a
                href="https://github.com/victornpb/deleteDiscordMessages/blob/master/help/delay.md" title="Help"
                target="_blank">?</a><br>
                    <input id="deleteDelay" type="number" value="1000" step="100">
                </span>
            </div>
            <hr>
            <button id="start" style="background:#43b581;width:80px;">Start</button>
            <button id="stop" style="background:#f04747;width:80px;" disabled>Stop</button>
            <button id="clear" style="width:80px;">Clear log</button>
            <label><input id="autoScroll" type="checkbox" checked>Auto scroll</label>
            <label title="Hide sensitive information for taking screenshots"><input id="redact" type="checkbox">Screenshot
                mode</label>
            <progress id="progress" style="display:none;"></progress> <span class="percent"></span>
        </div>
        <pre class="logarea">
            <center>Star this project on <a href="https://github.com/victornpb/deleteDiscordMessages" target="_blank">github.com/victornpb/deleteDiscordMessages</a>!\n\n
                <a href="https://github.com/victornpb/deleteDiscordMessages/issues" target="_blank">Issues or help</a>
            </center>
        </pre>
    </div>
    `);
 
    document.body.appendChild(popover);
 
    btn = createElm(`<div id="undicord-btn" tabindex="0" role="button" aria-label="Delete Messages" title="Delete Messages">
    <svg aria-hidden="false" width="24" height="24" viewBox="0 0 24 24">
        <path fill="currentColor" d="M15 3.999V2H9V3.999H3V5.999H21V3.999H15Z"></path>
        <path fill="currentColor" d="M5 6.99902V18.999C5 20.101 5.897 20.999 7 20.999H17C18.103 20.999 19 20.101 19 18.999V6.99902H5ZM11 17H9V11H11V17ZM15 17H13V11H15V17Z"></path>
    </svg>
    <br><progress style="display:none; width:24px;"></progress>
</div>`);
 
    btn.onclick = function togglePopover() {
        if (popover.style.display !== 'none') {
            popover.style.display = 'none';
            btn.style.color = 'var(--interactive-normal)';
        }
        else {
            popover.style.display = '';
            btn.style.color = '#f04747';
        }
    };
 
    function mountBtn() {
        const toolbar = document.querySelector('[class^=toolbar]');
        if (toolbar) toolbar.appendChild(btn);
    }
 
    const observer = new MutationObserver(function (_mutationsList, _observer) {
        if (!document.body.contains(btn)) mountBtn(); // re-mount the button to the toolbar
    });
    observer.observe(document.body, { attributes: false, childList: true, subtree: true });
 
    mountBtn();
 
    const $ = s => popover.querySelector(s);
    const logArea = $('pre');
    const startBtn = $('button#start');
    const stopBtn = $('button#stop');
    const autoScroll = $('#autoScroll');
 
    startBtn.onclick = async e => {
        const authToken = $('input#authToken').value.trim();
        const authorId = $('input#authorId').value.trim();
        const guildId = $('input#guildId').value.trim();
        const channelIds = $('input#channelId').value.trim().split(/\s*,\s*/);
        const minId = $('input#minId').value.trim();
        const maxId = $('input#maxId').value.trim();
        const minDate = $('input#minDate').value.trim();
        const maxDate = $('input#maxDate').value.trim();
        const content = $('input#content').value.trim();
        const hasLink = $('input#hasLink').checked;
        const hasFile = $('input#hasFile').checked;
        const includeNsfw = $('input#includeNsfw').checked;
        const includePinned = $('input#includePinned').checked;
        const searchDelay = parseInt($('input#searchDelay').value.trim());
        const deleteDelay = parseInt($('input#deleteDelay').value.trim());
        const progress = $('#progress');
        const progress2 = btn.querySelector('progress');
        const percent = $('.percent');
 
        const fileSelection = $("input#file");
        fileSelection.addEventListener("change", () => {
            const files = fileSelection.files;
            const channelIdField = $('input#channelId');
            if (files.length > 0) {
                const file = files[0];
                file.text().then(text => {
                    let json = JSON.parse(text);
                    let channels = Object.keys(json);
                    channelIdField.value = channels.join(",");
                });
            }
        }, false);
 
        const stopHndl = () => !(stop === true);
 
        const onProg = (value, max) => {
            if (value && max && value > max) max = value;
            progress.setAttribute('max', max);
            progress.value = value;
            progress.style.display = max ? '' : 'none';
            progress2.setAttribute('max', max);
            progress2.value = value;
            progress2.style.display = max ? '' : 'none';
            percent.innerHTML = value && max ? Math.round(value / max * 100) + '%' : '';
        };
 
 
        stop = stopBtn.disabled = !(startBtn.disabled = true);
        for (let i = 0; i < channelIds.length; i++) {
            await deleteMessages(authToken, authorId, guildId, channelIds[i], minId || minDate, maxId || maxDate, content, hasLink, hasFile, includeNsfw, includePinned, searchDelay, deleteDelay, logger, stopHndl, onProg);
            stop = stopBtn.disabled = !(startBtn.disabled = false);
        }
    };
    stopBtn.onclick = e => stop = stopBtn.disabled = !(startBtn.disabled = false);
    $('button#clear').onclick = e => { logArea.innerHTML = ''; };
    $('button#getToken').onclick = e => {
        window.dispatchEvent(new Event('beforeunload'));
        const ls = document.body.appendChild(document.createElement('iframe')).contentWindow.localStorage;
        $('input#authToken').value = JSON.parse(localStorage.token);
    };
    $('button#getAuthor').onclick = e => {
        $('input#authorId').value = JSON.parse(localStorage.user_id_cache);
    };
    $('button#getGuildAndChannel').onclick = e => {
        const m = location.href.match(/channels\/([\w@]+)\/(\d+)/);
        $('input#guildId').value = m[1];
        $('input#channelId').value = m[2];
    };
    $('#redact').onchange = e => {
        popover.classList.toggle('redact') &&
            window.alert('This will attempt to hide personal information, but make sure to double check before sharing screenshots.');
    };
 
    const logger = (type = '', args) => {
        const style = { '': '', info: 'color:#00b0f4;', verb: 'color:#72767d;', warn: 'color:#faa61a;', error: 'color:#f04747;', success: 'color:#43b581;' }[type];
        logArea.insertAdjacentHTML('beforeend', `<div style="${style}">${Array.from(args).map(o => typeof o === 'object' ? JSON.stringify(o, o instanceof Error && Object.getOwnPropertyNames(o)) : o).join('\t')}</div>`);
        if (autoScroll.checked) logArea.querySelector('div:last-child').scrollIntoView(false);
    };
 
    // fixLocalStorage
    window.localStorage = document.body.appendChild(document.createElement('iframe')).contentWindow.localStorage;
 
}
 
initUI();
 
    var hookAjax = '!function(t){function r(n){if(e[n])return e[n].exports;var o=e[n]={exports:{},id:n,loaded:!1};return t[n].call(o.exports,o,o.exports,r),o.loaded=!0,o.exports}var e={};return r.m=t,r.c=e,r.p="",r(0)}([function(t,r,e){e(1)(window)},function(t,r){t.exports=function(t){t.hookAjax=function(t){function r(r){return function(){var e=this.hasOwnProperty(r+"_")?this[r+"_"]:this.xhr[r],n=(t[r]||{}).getter;return n&&n(e,this)||e}}function e(r){return function(e){var n=this.xhr,o=this,i=t[r];if("function"==typeof i)n[r]=function(){t[r](o)||e.apply(n,arguments)};else{var a=(i||{}).setter;e=a&&a(e,o)||e;try{n[r]=e}catch(t){this[r+"_"]=e}}}}function n(r){return function(){var e=[].slice.call(arguments);if(!t[r]||!t[r].call(this,e,this.xhr))return this.xhr[r].apply(this.xhr,e)}}window._ahrealxhr=window._ahrealxhr||XMLHttpRequest,XMLHttpRequest=function(){var t=new window._ahrealxhr;Object.defineProperty(this,"xhr",{value:t})};var o=window._ahrealxhr.prototype;for(var i in o){var a="";try{a=typeof o[i]}catch(t){}"function"===a?XMLHttpRequest.prototype[i]=n(i):Object.defineProperty(XMLHttpRequest.prototype,i,{get:r(i),set:e(i),enumerable:!0})}return window._ahrealxhr},t.unHookAjax=function(){window._ahrealxhr&&(XMLHttpRequest=window._ahrealxhr),window._ahrealxhr=void 0},t.default=t}}]);';
var langCodes = ["ja-JP(日本語)", "zh-CHS(简中)", "en-US(English)", "自动检测/AutoDetect", "Spanish(Español)", "zh-CHT(繁中)", 'portuguese(Português)'];
var GMDiscordTrsOpt = {};
GMDiscordTrsOpt.GMDiscordTrsOn = GM_getValue(['GMDiscordTrsOn']) === true ? true: false;
GMDiscordTrsOpt.GMDiscordTrssplitStrDef = GM_getValue('GMDiscordTrssplitStrDef') ? GM_getValue('GMDiscordTrssplitStrDef') : "\r\n";
GMDiscordTrsOpt.GMDiscordTrsOnlyDist = GM_getValue(['GMDiscordTrsOnlyDist']) === true ? true: false;
GMDiscordTrsOpt.GMDiscordTrsApiKey = GM_getValue('GMDiscordTrsApiKey') ? GM_getValue('GMDiscordTrsApiKey') : "";
GMDiscordTrsOpt.GMDiscordTrsAppId = GM_getValue('GMDiscordTrsAppId') ? GM_getValue('GMDiscordTrsAppId') : "";
GMDiscordTrsOpt.GMDiscordTrsFromLang = !GM_getValue('GMDiscordTrsFromLang') ? 0 : GM_getValue('GMDiscordTrsFromLang');
GMDiscordTrsOpt.GMDiscordTrsToLang = !GM_getValue('GMDiscordTrsToLang') ? 0 : GM_getValue('GMDiscordTrsToLang');
GMDiscordTrsOpt.GMDiscordTrsShowEngine = !GM_getValue('GMDiscordTrsShowEngine') ? false : GM_getValue('GMDiscordTrsShowEngine');
var engineFuncs = {
    Google: function(text, callback) {
        var langPars = ['ja', 'zh-CN', 'en', 'auto', 'es', 'zh-CN', 'pt'];
        GM_xmlhttpRequest({
            method: 'GET',
            url: "https://translate.google.com/translate_a/single?client=at&sl=" + langPars[GMDiscordTrsOpt.GMDiscordTrsFromLang] + "&tl=" + langPars[GMDiscordTrsOpt.GMDiscordTrsToLang] + "&dt=t&q=" + encodeURIComponent(text),
            onload: function(responseDetails) {
                //console.warn(responseDetails);
                try {
                    var result = JSON.parse(responseDetails.response);
                    var tt = "";
                    result[0].forEach(function(a) {
                        tt += a[0]
                    });
                    callback(tt);
                } catch(e) {
                    callback("");
                    console.error(e);
                }
            },
            "headers": {
                "User-Agent": "memoQ",
                "Accept": "*/*",
                "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2"
            },
            onerror: function(error) {
                console.error(error);
            }
        });
    },
    Caiyun: function(text, callback) {
        var langPars = ['ja', 'zh', 'en', 'auto', 'es', 'zh', 'pt'];
        GM_xmlhttpRequest({
            method: 'POST',
            url: "http://api.interpreter.caiyunai.com/v1/translator",
            data: JSON.stringify({
                "source": text,
                "trans_type": langPars[GMDiscordTrsOpt.GMDiscordTrsFromLang] + "2" + langPars[GMDiscordTrsOpt.GMDiscordTrsToLang],
                "request_id": "demo",
                "detect": false,
            }),
            onload: function(responseDetails) {
                try {
                    console.warn(responseDetails);
                    var result = JSON.parse(responseDetails.response);
                    callback(result.target);
                } catch(e) {
                    callback("");
                    console.error(e);
                }
            },
            "headers": {
                "Content-type": "application/json",
                'x-authorization': "token " + GMDiscordTrsOpt.GMDiscordTrsApiKey
            },
            onerror: function(error) {
                console.error(error);
            }
        });
    },
    DeepL: function(text, callback) {
        var langPars = ['JA', 'ZH', 'EN', 'AUTO', 'ES', 'ZH', 'PT'];
        var preArg = "ignore_tags=trsIgnoretag&tag_handling=xml&source_lang=" + langPars[GMDiscordTrsOpt.GMDiscordTrsFromLang] + "&target_lang=" + langPars[GMDiscordTrsOpt.GMDiscordTrsToLang] + "&preserve_formatting=0&auth_key=" + GMDiscordTrsOpt.GMDiscordTrsApiKey;
        GM_xmlhttpRequest({
            method: 'POST',
            url: "https://api.deepl.com/v1/translate",
            data: preArg + "&text=" + encodeURIComponent(text),
            onload: function(responseDetails) {
                try {
                    //console.warn(responseDetails);
                    var result = JSON.parse(responseDetails.response);
                    callback(result.translations[0].text);
                } catch(e) {
                    callback("");
                    console.error(e);
                }
            },
            "headers": {
                "User-Agent": "memoQ",
                "Accept": "*/*",
                "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
                "Content-type": "application/x-www-form-urlencoded",
                "X-Instance": "QzBDQTdCRjNGODREQAAZ0VBNzTTXTRCRUFFMTgwMEUyMDMAAfxQTlBMTIyQjA0MDgwRTM5ODxxsazQTdGRA=="
            },
            onerror: function(error) {
                console.error(error);
            }
        });
    },
    Baidu: function(text, callback) {
        var langPars = ['jp', 'zh', 'en', 'auto', 'spa', 'zh', 'pt'];
        var appid = GMDiscordTrsOpt.GMDiscordTrsAppId;
        var key = GMDiscordTrsOpt.GMDiscordTrsApiKey;
        var salt = "125637";
        var str1 = appid + text + salt + key;
        var sign = md5(str1).toLowerCase();
        var query = "q=" + encodeURIComponent(text) + "&appid=" + encodeURIComponent(appid) + "&salt=" + encodeURIComponent(salt) + "&from=" + encodeURIComponent(langPars[GMDiscordTrsOpt.GMDiscordTrsFromLang]) + "&to=" + encodeURIComponent(langPars[GMDiscordTrsOpt.GMDiscordTrsToLang]) + "&sign=" + encodeURIComponent(sign);
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://api.fanyi.baidu.com/api/trans/vip/translate',
            data: query,
            onload: function(responseDetails) {
                try {
                    //console.warn(responseDetails);
                    var result = JSON.parse(responseDetails.response);
                    var rText = "";
                    for (var i = 0; i < result.trans_result.length; i++) {
                        if (i > 0) {
                            rText += "\r\n";
                        }
                        rText += result.trans_result[i].dst;
                    }
                    callback(rText);
                } catch(e) {
                    callback("");
                    console.error(e);
                }
            },
            "headers": {
                "accept": "*/*",
                "accept-language": "zh-CN,zh;q=0.9,ja-JP;q=0.8,ja;q=0.7,en;q=0.6,eo;q=0.5",
                "cache-control": "no-cache",
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onerror: function(error) {
                console.error(error);
            }
        });
    }
};
GMDiscordTrsOpt.GMDiscordTrsEngine = (Object.keys(engineFuncs).indexOf(GM_getValue('GMDiscordTrsEngine')) !== -1) ? GM_getValue('GMDiscordTrsEngine') : "Google";
GMDiscordTrsOpt.GMDiscordTrsEngineLast = GMDiscordTrsOpt.GMDiscordTrsEngine;
(function() {
    'use strict';
    unsafeWindow.eval(hookAjax);
 
    unsafeWindow.hookAjax({
        setRequestHeader: function(arg, xhr) {
            if (arg[0] == "Authorization") {
                //为其他脚本设置的这个....你可以干掉它.
                unsafeWindow.userToken = arg[1];
            }
        },
        open: function(args, xhr) {
            xhr.url = args[1]
            return false;
        },
        send: function(args, xhr) {
            if (!GMDiscordTrsOpt.GMDiscordTrsOn || GMDiscordTrsOpt.GMDiscordTrsToLang === GMDiscordTrsOpt.GMDiscordTrsFromLang) {
                return false;
            }
            if (xhr.url.match(/https:\/\/discord.com\/api\/v\d+\/channels\/\d+\/messages/)) {
                if (args[0]) {
                    if (xhr.fixed) {
                        return false;
                    }
                    xhr.fixed = true;
                    try{
                        //debugger;
                        var msg = JSON.parse(args[0]);
                        if (msg.content && msg.content.length > 1) {
                            var cb = (function(msg, xhr) {
                                return function(text) {
                                    if(text !== ""){
                                        if(GMDiscordTrsOpt.GMDiscordTrsShowEngine){
                                            text = GMDiscordTrsOpt.GMDiscordTrsEngine + ": " + text;
                                        }
                                        if(GMDiscordTrsOpt.GMDiscordTrsToLang === 5){
                                            text = s2t(text);
                                        }
                                        if(GMDiscordTrsOpt.GMDiscordTrsToLang === 1){
                                            text = t2s(text);
                                        }
                                        if(msg.content && msg.content !== text){
                                            if (GMDiscordTrsOpt.GMDiscordTrsOnlyDist) {
                                                msg.content = text;
                                            } else {
                                                msg.content = msg.content + GMDiscordTrsOpt.GMDiscordTrssplitStrDef + text;
                                            }
                                        }
                                    }
                                    xhr.send(JSON.stringify(msg));
                                }
                            })(msg, xhr);
                            if((GMDiscordTrsOpt.GMDiscordTrsToLang === 5 && GMDiscordTrsOpt.GMDiscordTrsFromLang === 1) || (GMDiscordTrsOpt.GMDiscordTrsToLang === 1 && GMDiscordTrsOpt.GMDiscordTrsFromLang === 5)){
                                setTimeout((function(cb,text){
                                    cb(text);
                                })(cb,msg.content),10);
                                return true;
                            }
                            engineFuncs[GMDiscordTrsOpt.GMDiscordTrsEngine](msg.content, cb);
                            return true;
                        }
                    } catch(e) {
                        console.error(e);
                    }
                    return false;
                }
            }
            return false;
        }
    });
 
    function appendLangTrsSelect(fromSelAppendTo, toSelAppendTo) {
        var fromSel = document.createElement('Select');
        var toSel = document.createElement('Select');
        for (var i = 0; i < langCodes.length; i++) {
            if (i === 3) {
                continue;
            }
            var fromOpt = document.createElement('Option');
            var toOpt = document.createElement('Option');
            fromOpt.innerText = langCodes[i];
            fromOpt.value = i.toString();
            fromSel.appendChild(fromOpt);
            if (i !== 3) { //"自动检测/AutoDetect"
                toOpt.innerText = langCodes[i];
                toOpt.value = i.toString();
                toSel.appendChild(toOpt);
            }
        }
        fromSel.value = GMDiscordTrsOpt.GMDiscordTrsFromLang.toString();
        toSel.value = GMDiscordTrsOpt.GMDiscordTrsToLang.toString();
        fromSel.onchange = function(ev) {
            GMDiscordTrsOpt.GMDiscordTrsFromLang = this.value * 1;
            GM_setValue('GMDiscordTrsFromLang', this.value * 1);
        }
        toSel.onchange = function(ev) {
            GMDiscordTrsOpt.GMDiscordTrsToLang = this.value * 1;
            GM_setValue('GMDiscordTrsToLang', this.value * 1);
        }
        fromSelAppendTo.appendChild(fromSel);
        toSelAppendTo.appendChild(toSel);
    }
 
    function addTextInputGMSet(name, getValWrapFunc, setValWrapFunc, hide) {
        var inputTrs = document.createElement("input");
        inputTrs.type = "text";
        if (hide) {
            inputTrs.style.backgroundColor = "#fff";
            inputTrs.style.color = "#fff";
        }
        var gvar = GMDiscordTrsOpt[name];
        if (getValWrapFunc) {
            gvar = getValWrapFunc(gvar);
        }
        inputTrs.value = gvar;
        var EvFunc = (function(name, getValWrapFunc, setValWrapFunc) {
            return function() {
                var val = this.value;
                if (setValWrapFunc) {
                    val = setValWrapFunc(val);
                }
                GMDiscordTrsOpt[name] = val;
                GM_setValue(name, val);
            }
        })(name, getValWrapFunc, setValWrapFunc);
        inputTrs.onchange = EvFunc;
        inputTrs.onkeydown = EvFunc;
        if (hide) {
            inputTrs.onfocus = function() {
                this.style.color = "#000";
            }
            inputTrs.onblur = function() {
                this.style.color = "#fff";
            }
        }
        return inputTrs;
    }
    function addCheckBoxInputGMSet(name, getValWrapFunc, setValWrapFunc) {
        var inputTrs = document.createElement("input");
        inputTrs.type = "checkbox";
        var gvar = GMDiscordTrsOpt[name];
        if (getValWrapFunc) {
            gvar = getValWrapFunc(gvar);
        }
        inputTrs.checked = gvar;
        var EvFunc = (function(name) {
            return function() {
                var val = this.checked;
                if (getValWrapFunc) {
                    val = setValWrapFunc(val);
                }
                GMDiscordTrsOpt[name] = val;
                GM_setValue(name, val);
            }
        })(name);
        inputTrs.onchange = EvFunc;
        return inputTrs;
    }
    function toggleOptions() {
        var CHackDiscordTrsToolOptionDiv = document.getElementById('CHackDiscordTrsToolOptionDiv');
        if (CHackDiscordTrsToolOptionDiv) {
            CHackDiscordTrsToolOptionDiv.remove();
            return;
        }
        //var computedStyleAppMount = document.defaultView.getComputedStyle(document.getElementById('app-mount'));
        //var computedStyleHeader = document.defaultView.getComputedStyle(document.querySelector('header[class^=header]'));
 
        var wrap = document.createElement("div");
        wrap.id = "CHackDiscordTrsToolOptionDiv";
        wrap.style = "position: fixed;display: inline-block;background-color: var(--background-secondary);color: var(--interactive-active);z-index: 999999999;right: 1em;top: 3em;padding: 1em;border-radius: 1em;box-shadow: 0 0 4px #000;";
 
        wrap.insertAdjacentHTML('beforeend', "<br>Global Switch: ");
        wrap.insertAdjacentElement('beforeend', addCheckBoxInputGMSet('GMDiscordTrsOn'));
 
        wrap.insertAdjacentHTML('beforeend', "<br>Only Send Dest Lang: ");
        wrap.insertAdjacentElement('beforeend', addCheckBoxInputGMSet('GMDiscordTrsOnlyDist'));
 
        wrap.insertAdjacentHTML('beforeend', "<br>Show Engine In Msg: ");
        wrap.insertAdjacentElement('beforeend', addCheckBoxInputGMSet('GMDiscordTrsShowEngine'));
        var inputSplit = addTextInputGMSet("GMDiscordTrssplitStrDef",
                                           function(val) {
            val = JSON.stringify(val);
            val = val.substr(1, val.length - 2);
            return val;
        },
                                           function(val) {
            return JSON.parse('"' + val.replace(/"/g, '\"') + '"');
        });
 
        wrap.insertAdjacentHTML('beforeend', "<br>Split for Src / Dst text: ");
        wrap.insertAdjacentElement('beforeend', inputSplit);
 
        wrap.insertAdjacentHTML('beforeend', "<br>ApiKey: ");
        wrap.insertAdjacentElement('beforeend', addTextInputGMSet("GMDiscordTrsApiKey", undefined, undefined, true));
 
        wrap.insertAdjacentHTML('beforeend', "<br>AppId: ");
        wrap.insertAdjacentElement('beforeend', addTextInputGMSet("GMDiscordTrsAppId", undefined, undefined, true));
        wrap.insertAdjacentHTML('beforeend', "(If needed)");
 
        wrap.insertAdjacentHTML('beforeend', "<br> Engine: ");
        Object.keys(engineFuncs).forEach(function(e) {
            var inputTrsEngine = document.createElement("input");
            inputTrsEngine.type = "radio";
            inputTrsEngine.name = "TrsEnging";
            inputTrsEngine.checked = GMDiscordTrsOpt.GMDiscordTrsEngine === e;
            inputTrsEngine.onchange = (function(e) {
                return function() {
                    GMDiscordTrsOpt.GMDiscordTrsEngine = e;
                    GM_setValue('GMDiscordTrsEngine', e);
                    GM_setValue('GMDiscordTrsEngineAppKey_' + GMDiscordTrsOpt.GMDiscordTrsEngineLast, GMDiscordTrsOpt.GMDiscordTrsApiKey);
                    GM_setValue('GMDiscordTrsEngineAppId_' + GMDiscordTrsOpt.GMDiscordTrsEngineLast, GMDiscordTrsOpt.GMDiscordTrsAppId);
                    var appk = GM_getValue('GMDiscordTrsEngineAppKey_' + e);
                    var appi = GM_getValue('GMDiscordTrsEngineAppId_' + e);
                    if (appk) {
                        GM_setValue('GMDiscordTrsApiKey', appk);
                        GMDiscordTrsOpt.GMDiscordTrsApiKey = appk;
                    } else {
                        GM_setValue('GMDiscordTrsApiKey', "");
                        GMDiscordTrsOpt.GMDiscordTrsApiKey = "";
                    }
                    if (appi) {
                        GM_setValue('GMDiscordTrsAppId', appi);
                        GMDiscordTrsOpt.GMDiscordTrsAppId = appi;
                    } else {
                        GM_setValue('GMDiscordTrsAppId', "");
                        GMDiscordTrsOpt.GMDiscordTrsAppId = "";
                    }
                    GMDiscordTrsOpt.GMDiscordTrsEngineLast = e;
                    toggleOptions();
                    toggleOptions();
                }
            })(e);
            wrap.insertAdjacentElement('beforeend', inputTrsEngine);
            wrap.insertAdjacentHTML('beforeend', " " + e + " ");
        });
 
        wrap.insertAdjacentHTML('beforeend', "<br> ");
        var fromSpan = document.createElement("span");
        var toSpan = document.createElement("span");
        fromSpan.innerText = "Src Lang: ";
        toSpan.innerText = "Dst Lang: ";
        appendLangTrsSelect(fromSpan, toSpan);
        wrap.insertAdjacentElement('beforeend', fromSpan);
        wrap.insertAdjacentElement('beforeend', toSpan);
        document.body.insertAdjacentElement('beforeend', wrap);
    }
 
    setInterval(function() {
        var target = document.querySelector('a[href="https://support.discord.com"]');
        if (target) {
            target.onclick = function(ev) {
                ev.preventDefault();
                ev.stopImmediatePropagation();
                ev.stopPropagation();
                toggleOptions();
            }
        }
    },
                100);
})();
})()