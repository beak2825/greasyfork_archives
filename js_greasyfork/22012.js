// ==UserScript==
// @name         Secure share on Imgur.
// @namespace    moe.jixun.script.imgur
// @version      1.1
// @description  Upgrade all "http" url to "https" at sharing fileds.
// @author       Jixun <https://jixun.moe/>
// @include      http://imgur.com/*
// @include      https://imgur.com/*
// @include      http://*.imgur.com/*
// @include      https://*.imgur.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22012/Secure%20share%20on%20Imgur.user.js
// @updateURL https://update.greasyfork.org/scripts/22012/Secure%20share%20on%20Imgur.meta.js
// ==/UserScript==

function fixValue (val) {
    if (val.indexOf('http://') != -1)
        val = val.replace(/\bhttp\b/g, 'https');

    if (val[0] == '[')
        val = '!' + val;

    return val;
}

function injectZeroClip () {
    var oldRender = Imgur.ZeroClippableField.prototype.render;
    Imgur.ZeroClippableField.prototype.render = function () {
        this.props.value = fixValue(this.props.value);
        return oldRender.apply(this, arguments);
    };
}

function injectCopy () {
    var oldRender = Imgur.Elements.Copy.prototype.render;
    Imgur.Elements.Copy.prototype.render = function () {
        this.props.value = fixValue(this.props.value);
        return oldRender.apply(this, arguments);
    };
}

addEventListener('load', function() {
    injectZeroClip();
    injectCopy();
    console.info('Secure share enabled!');
});