// ==UserScript==
// @name         AppStore QR code
// @namespace    https://www.iplaysoft.com
// @version      1.9
// @description  Add QRCode to AppStore page.
// @author       X-Force
// @match        https://apps.apple.com/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      https://update.greasyfork.org/scripts/558118/1708500/QRious.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/373257/AppStore%20QR%20code.user.js
// @updateURL https://update.greasyfork.org/scripts/373257/AppStore%20QR%20code.meta.js
// ==/UserScript==

/***
 * require      https://cdn.staticfile.net/jquery/3.7.1/jquery.min.js
 * require      https://cdn.staticfile.net/qrious/4.0.2/qrious.min.js
 */

/***************************
 * waitForKeyElements（原样）
 ***************************/
function waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector){
    var targetNodes, btargetsFound;
    targetNodes = (typeof iframeSelector == "undefined") ?
        $(selectorTxt) : $(iframeSelector).contents().find(selectorTxt);

    if (targetNodes && targetNodes.length > 0){
        btargetsFound = true;
        targetNodes.each(function(){
            var jThis = $(this);
            if (!jThis.data("alreadyFound")){
                var cancelFound = actionFunction(jThis);
                if (cancelFound) btargetsFound = false;
                else jThis.data("alreadyFound", true);
            }
        });
    } else {
        btargetsFound = false;
    }

    var controlObj = waitForKeyElements.controlObj || {};
    var controlKey = selectorTxt.replace(/[^\w]/g, "_");
    var timeControl = controlObj[controlKey];

    if (btargetsFound && bWaitOnce && timeControl){
        clearInterval(timeControl);
        delete controlObj[controlKey];
    } else if (!timeControl){
        timeControl = setInterval(function(){
            waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector);
        }, 600);
        controlObj[controlKey] = timeControl;
    }
    waitForKeyElements.controlObj = controlObj;
}


console.log("AppStore QR Stable 3.0 Loaded");
var $ = window.jQuery;

let lastInjectTime = 0;
let obs = null;


/***************************
 * 简化 URL
 ***************************/
function simplifyAppUrl(url){
    const idMatch = url.match(/\/id(\d+)/);
    if (!idMatch) return url;

    const appId = idMatch[1];
    const countryMatch = url.match(/\/([a-z]{2})\/app\//i);
    const country = countryMatch ? countryMatch[1] : 'us';

    return `https://apps.apple.com/${country}/app/id${appId}`;
}


/***************************
 * 主逻辑入口
 ***************************/
function addQR(jNode){
    const url = location.href.split('#')[0];
    if (!url.includes("/app/")) return false;

    const simpleUrl = simplifyAppUrl(url);
    const heroSection = resolveHeroSection(jNode);

    if (!heroSection) return false;

    safeInject(heroSection, simpleUrl);
    return false;
}

function resolveHeroSection(jNode){
    var node = jNode && jNode.length ? jNode[0] : null;
    if (node && node.closest){
        var section = node.closest('section[data-test-id="shelf-wrapper"]');
        if (section) return section;
    }
    var sections = document.querySelectorAll('section[data-test-id="shelf-wrapper"]');
    for (var s of sections){
        if (s.querySelector('.app-icon [data-testid="artwork-component"]')) return s;
    }
    return null;
}


/***************************
 * 防抖 + 安全注入
 ***************************/
function safeInject(heroSection, url){
    const now = performance.now();
    if (now - lastInjectTime < 800) {
        return; // 防止高频注入
    }
    lastInjectTime = now;

    injectQRCode(heroSection, url);
}


/***************************
 * 注入 QR
 ***************************/
function injectQRCode(heroSection, simpleUrl){
    stopObserver();

    // 删除旧的
    let old = document.getElementById("xf_qr_wrapper");
    if (old) old.remove();

    const qrSize = 160;
    const wrapper = document.createElement("div");
    wrapper.id = "xf_qr_wrapper";
    wrapper.style.position = "absolute";
    wrapper.style.right = "50px";
    wrapper.style.top = "50%";
    wrapper.style.transform = "translateY(-50%)";
    wrapper.style.width = qrSize + "px";
    wrapper.style.height = qrSize + "px";
    wrapper.style.padding = "12px";
    wrapper.style.borderRadius = "10px";
    wrapper.style.background = "rgba(255,255,255,0.96)";
    wrapper.style.boxShadow = "0 8px 25px rgba(0,0,0,0.12)";
    wrapper.style.zIndex = "9999";

    const canvas = document.createElement("canvas");
    canvas.id = "xf_qrcode_canvas";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    wrapper.appendChild(canvas);

    ensureHeroSectionLayout(heroSection, qrSize);

    heroSection.appendChild(wrapper);

    new QRious({
        element: canvas,
        value: simpleUrl,
        size: qrSize * 2
    });

    startObserver(heroSection, wrapper, simpleUrl);
}


function ensureHeroSectionLayout(heroSection, qrSize){
    const style = window.getComputedStyle(heroSection);
    if (style.position === "static"){
        heroSection.style.position = "relative";
    }
}


/***************************
 * Observer（只监控 wrapper 是否被删）
 ***************************/
function startObserver(heroSection, wrapper, url){
    obs = new MutationObserver(() => {
        if (!document.body.contains(wrapper)){
            safeInject(heroSection, url);
        }
    });

    obs.observe(heroSection, {
        childList: true
    });
}

function stopObserver(){
    if (obs){
        obs.disconnect();
        obs = null;
    }
}


/***************************
 * 启动入口
 ***************************/
waitForKeyElements(
    'section[data-test-id="shelf-wrapper"] .app-icon [data-testid="artwork-component"]',
    addQR,
    false
);