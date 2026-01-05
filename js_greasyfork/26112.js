// ==UserScript==
// @name         Chiphell自动填充验证码
// @namespace    http://www.chiphell.com/
// @version      0.2
// @description  自动填充在Chiphell上发帖和回复时的第一个验证码
// @author       1461748123
// @include      http://www.chiphell.com/*
// @include      https://www.chiphell.com/*
// @downloadURL https://update.greasyfork.org/scripts/26112/Chiphell%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E9%AA%8C%E8%AF%81%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/26112/Chiphell%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E9%AA%8C%E8%AF%81%E7%A0%81.meta.js
// ==/UserScript==

window.addEventListener('load',
function() {
    fillCaptcha();
    checkCaptcha();
},
false);

function fillCaptcha() {
    var captcha = getCaptcha();
    var input = document.getElementsByName('secanswer')[0];
    input.value = input.defaultValue = captcha;
}

function checkCaptcha() {
    eval(document.getElementsByName('secanswer')[0].getAttribute("onblur"));
}

function getCaptcha() {
    var html = document.getElementsByClassName('p_pop p_opt')[0].innerHTML;
    var key = getKey(html);
    var secret = getSecret(html);
    return secret.substring(getCaptchaStartLocation(key), getCaptchaEndLocation(key)) + 'CHH';
}

function getKey(html) {
    var end = html.indexOf('位');
    return html.substring(56, end);
}

function getSecret(html) {
    var start = html.indexOf('CHH</b><br><b style=\"color:red;\">') + 33;
    var end = html.indexOf(' </b>');
    return html.substring(start, end).replace(/ /g, "");
}

function getCaptchaStartLocation(key) {
    var spacer = key.indexOf('-');
    return key.substring(0, spacer) - 1;
}

function getCaptchaEndLocation(key) {
    var spacer = key.indexOf('-');
    return key.substring(spacer + 1);
}