// ==UserScript==
// @name         e-hentai作品ページ閲覧性向上
// @namespace    e-hentaiWorkPageImprovementOfBrowsability
// @version      0.1
// @description  ----
// @author       You
// @match        https://e-hentai.org/s/*
// @grant        none
/* load jQuery */
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/371470/e-hentai%E4%BD%9C%E5%93%81%E3%83%9A%E3%83%BC%E3%82%B8%E9%96%B2%E8%A6%A7%E6%80%A7%E5%90%91%E4%B8%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/371470/e-hentai%E4%BD%9C%E5%93%81%E3%83%9A%E3%83%BC%E3%82%B8%E9%96%B2%E8%A6%A7%E6%80%A7%E5%90%91%E4%B8%8A.meta.js
// ==/UserScript==

function main(){
    $('script').remove();
    $('body').removeAttr('style');
    $('.sni').removeAttr('ID');
    $('.sni').removeAttr('style');
    $('.sni').css('min-width','0');
    $('iframe').remove();
    $('#i3').removeAttr('ID');
    imageResize();
}
function imageResize(){
    $('img').css('width'      , 'auto');
    $('img').css('height'     , 'auto');
    $('img').css('max-width'  , '100%');
    $('img').css('max-height' , window.innerHeight);
    $('img').removeAttr('onerror');
    $('img').removeAttr('onclick');
    $('img').removeAttr('ID');
    $('body').removeAttr('style');
}
main();

var THRESHOLD = 300;
var _height = Math.max.apply( null, [document.body.clientHeight , document.body.scrollHeight, document.documentElement.scrollHeight, document.documentElement.clientHeight] );
setInterval(function(){
    if (Math.max.apply( null, [document.body.clientHeight , document.body.scrollHeight, document.documentElement.scrollHeight, document.documentElement.clientHeight] ) != _height) {
        imageResize();
    }
    _height = Math.max.apply( null, [document.body.clientHeight , document.body.scrollHeight, document.documentElement.scrollHeight, document.documentElement.clientHeight] );
    //console.log(_height);
}, 300);