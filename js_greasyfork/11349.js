// ==UserScript==
// @name         Nice Alert
// @namespace    http://kmcdeals.com
// @version      1.1
// @description  Changes the brower's alert so it's unobtrusive
// @author       Kmc
// @match        *://*/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11349/Nice%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/11349/Nice%20Alert.meta.js
// ==/UserScript==

addCSS('#alert_box{position: absolute; background-color: #eee; max-height: calc(100vh - 12px); overflow-y: auto; top: 0px; margin: 5px auto; left: 0; right: 0; width: 250px; text-align: center; border: 1px solid black; border-radius: 3px;} #alert_box.hidden{opacity: 0; visibility: hidden; transition: visibility 0s 1500ms, opacity 1500ms linear;} #alert_box.shown{opacity: 1; visibility: visible;} .no-transition{transition: none !important;}');
var alertDiv = addHTML('<div id="alert_box" class="hidden"></div>', document.body),
    alertTimeout;

window.alert = interceptAlert;

function interceptAlert(text){
    alertDiv.innerHTML = text;
    alertDiv.className = 'shown';
    
    if (alertTimeout) clearTimeout(alertTimeout);
    
    alertTimeout = setTimeout(function(){ alertDiv.className = 'hidden'; }, 7000);
}

alertDiv.addEventListener('mouseenter', function(){
    alertDiv.className = 'shown';
    if (alertTimeout) clearTimeout(alertTimeout);
});

alertDiv.addEventListener('mouseleave', function(){
    alertTimeout = setTimeout(function(){ alertDiv.className = 'hidden'; }, 7000);
});

alertDiv.addEventListener('click', function(){
    alertDiv.className = 'hidden no-transition';
    setTimeout(function(){ alertDiv.className = 'hidden'; }, 0);
});

function addCSS(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

function addHTML(html, divToAppend){
    var wrapperDiv = document.createElement('div');
    wrapperDiv.innerHTML = html;
    html = wrapperDiv.firstChild;

    return divToAppend.appendChild(html);
}