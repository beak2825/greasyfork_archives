// ==UserScript==
// @name         JavDB_helper
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  have fun
// @author       Yich
// @match        https://javdb.com/*
//@require https://code.jquery.com/jquery-3.3.1.min.js
// @require https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @grant        none
//@run-at  document-end
// @downloadURL https://update.greasyfork.org/scripts/407598/JavDB_helper.user.js
// @updateURL https://update.greasyfork.org/scripts/407598/JavDB_helper.meta.js
// ==/UserScript==

var originStyle = '';
var originImgUrl = '';

$('.item-image').hover(makeBigger,returnToOriginalSize);
waitForKeyElements (".meta", findMaxSizeVideo);


function findMaxSizeVideo(){
    var maxSize=0;
    var maxDom = null;
    $('.meta').each(function(i, obj) {
        var myRegexp = /([\d\.]+)(GB|MB)/g;
        var str = $(obj).text();
        var match = myRegexp.exec(str);
        var size = match[1];
        var mbgb = match[2];
        if(mbgb==="GB")
            size = parseFloat(size) * 1000;
        if(size > maxSize){
            maxSize = size;
            maxDom = obj
        }
    });
    $(maxDom).parents('td').css("background-color","yellow");
}
function makeBigger() {
    var imageDom = $(this).find('img');
    originStyle = imageDom.attr('style');
    imageDom.removeAttr('style');
    originImgUrl = imageDom.data('src');
    //imageDom.attr('src',originImgUrl.replace('thumbs','covers'));
    imageDom.attr('src',originImgUrl);
    $(this).parent().css({height: '+=60%', width: '+=60%'});
    $(this).parent().parent().css('zIndex', '1');
}
function returnToOriginalSize() {
    var imageDom = $(this).find('img');
    imageDom.attr('style',originStyle);
    imageDom.attr('src',originImgUrl);
    $(this).parent().removeAttr('style');
    $(this).parent().parent().removeAttr('style');
}