// ==UserScript==
// @name         Don't translate tags in OSMWIKI!
// @name:zh-CN         不要翻译 OSMWIKI 的tag!
// @name:zh-TW         不要翻譯 OSMWIKI 的tag!
// @name:ja         OSMWIKIタグを翻訳しないでください！
// @namespace    https://www.jianshu.com/u/8f333703e491
// @version      0.2
// @description  Prevent tags in OpenStreetMap Wiki from being translated by browser.
// @description:zh-CN  避免浏览器翻译 OpenStreetMap Wiki 上的tag。
// @description:zh-TW  避免瀏覽器翻譯 OpenStreetMap Wiki 上的tag。
// @description:ja  OpenStreetMap Wikiのタグがブラウザーによって翻訳されないようにします。
// @icon               https://www.openstreetmap.org/favicon.ico
// @author       Xiao_Le
// @include      *://wiki.openstreetmap.org*
// @match        *://wiki.openstreetmap.org*
// @downloadURL https://update.greasyfork.org/scripts/396892/Don%27t%20translate%20tags%20in%20OSMWIKI%21.user.js
// @updateURL https://update.greasyfork.org/scripts/396892/Don%27t%20translate%20tags%20in%20OSMWIKI%21.meta.js
// ==/UserScript==
window.onload = function(){
    $('p tt').each(function (i, e) {$(this).attr('id', 'tag');});
    $('p tt').each(function (i, e) {$(this).attr('class', 'mw-content-ltr notranslate');});
    $('li tt').each(function (i, e) {$(this).attr('id', 'tag');});
    $('li tt').each(function (i, e) {$(this).attr('class', 'mw-content-ltr notranslate');});
    $('td tt').each(function (i, e) {$(this).attr('id', 'tag');});
    $('td tt').each(function (i, e) {$(this).attr('class', 'mw-content-ltr notranslate');});
}