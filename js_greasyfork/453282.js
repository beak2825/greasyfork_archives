// ==UserScript==
// @name         Gitlab Username Replicator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Conveniently copy username in gitlab page
// @author       luzhiyuan.deer
// @match        *gitlab.com/*
// @match        *jihulab.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jihulab.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453282/Gitlab%20Username%20Replicator.user.js
// @updateURL https://update.greasyfork.org/scripts/453282/Gitlab%20Username%20Replicator.meta.js
// ==/UserScript==
var copyBtnClass = "copy-text-btn";

(function() {
    'use strict';
    setInterval(function() {initCopyBtn()}, 1000);
    addCssStyle(`.${copyBtnClass} {cursor: pointer; color: #666}`);
})();

function initCopyBtn() {
    [...document.getElementsByClassName("author-username")].forEach(function(userNameElement){
        var btnAlreadyExist = userNameElement.getElementsByClassName(copyBtnClass).length > 0;
        if (btnAlreadyExist) { return; }

        var copyBtn = createCopyBtn();
        userNameElement.appendChild(copyBtn);

        copyBtn.addEventListener("click", function() {
            var username = userNameElement.getElementsByClassName("author-username-link")[0].textContent;
            doCopy(username);
            copyBtn.textContent = "[done]";
            setTimeout(function() {
                copyBtn.textContent = "[copy]";
            }, 300);
        })
    });

    [...document.getElementsByClassName("author-name-link")].forEach(function(userNameElement){
        var btnAlreadyExist = userNameElement.parentNode.getElementsByClassName(copyBtnClass).length > 0;
        if (btnAlreadyExist) { return; }

        var copyBtn = createCopyBtn();
        userNameElement.appendChild(copyBtn);
        appendBrother(copyBtn, userNameElement);

        copyBtn.addEventListener("click", function() {
            var username = "@" + userNameElement.getAttribute("data-username");
            doCopy(username);
            copyBtn.textContent = "[done]";
            setTimeout(function() {
                copyBtn.textContent = "[copy]";
            }, 300);
        })
    });

    [...document.querySelectorAll(".is-merge-request .js-user-link")].forEach(function(userNameElement){
        var btnAlreadyExist = userNameElement.parentNode.getElementsByClassName(copyBtnClass).length > 0;
        if (btnAlreadyExist) { return; }

        var copyBtn = createCopyBtn(" [copy]");
        userNameElement.appendChild(copyBtn);
        appendBrother(copyBtn, userNameElement);

        copyBtn.addEventListener("click", function() {
            var hrefSplited = userNameElement.getAttribute("href").split("/");
            var username = "@" + hrefSplited[hrefSplited.length - 1];
            doCopy(username);
            copyBtn.textContent = " [done]";
            setTimeout(function() {
                copyBtn.textContent = " [copy]";
            }, 300);
        })
    });
}

function createCopyBtn(text="[copy]") {
    var copyBtn = document.createElement("span");
    copyBtn.textContent = text;
    copyBtn.setAttribute("class", copyBtnClass);
    return copyBtn;
}

function doCopy(text) {
    var textareaForCopy = document.createElement("textarea");
    textareaForCopy.textContent = text;
    textareaForCopy.style.position = "fixed";
    document.body.appendChild(textareaForCopy);
    textareaForCopy.select();
    document.execCommand("copy");
    document.body.removeChild(textareaForCopy);
}

function addCssStyle(newStyle) {
    var styleElement = document.getElementById('styles_js');

    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.id = 'styles_js';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
    }

    styleElement.appendChild(document.createTextNode(newStyle));
}

function appendBrother(newElement, targetElement) {
    if(targetElement.nextSibling){
        targetElement.parentNode.insertBefore(newElement, targetElement.nextSibling);
    }else{
        targetElement.parentNode.appendChild(newElement);
    }
}