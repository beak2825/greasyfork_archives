// ==UserScript==
// @name         e-hentai検索結果閲覧性向上
// @namespace    e-hentaiImproveSearchabilityOfBrowsingResults
// @version      0.1
// @description  ----
// @author       You
// @match        https://e-hentai.org/*
// @exclude      https://e-hentai.org/s/*
// @exclude      https://e-hentai.org/g/*
// @grant        none
/* load jQuery */
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/371471/e-hentai%E6%A4%9C%E7%B4%A2%E7%B5%90%E6%9E%9C%E9%96%B2%E8%A6%A7%E6%80%A7%E5%90%91%E4%B8%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/371471/e-hentai%E6%A4%9C%E7%B4%A2%E7%B5%90%E6%9E%9C%E9%96%B2%E8%A6%A7%E6%80%A7%E5%90%91%E4%B8%8A.meta.js
// ==/UserScript==

function main(){
    $('.it2').css('visibility', 'visible');
    $('.it2').css('position', 'static');
    $('.it2').css('border', '');
    $('.it2').css('word-wrap', 'break-word');
    $('.it2').css('vertical-align', 'middle');
    $('.it2').css('display', 'inline-block');

    $('.it3').css('display', 'inline-block');
    $('.it3').css('float', 'none');

    $('.it4').css('margin-top', 'auto');
    $('.it4').css('float', 'none');
    $('.it4').css('vertical-align', 'middle');
    $('.it4').css('position', 'absolute');
    $('.it4').css('top', '50%');
    $('.it4').css('left', '100%');
    $('.it4').css('margin-top', '8px');
    $('.it4').css('margin-left', '-85px');

    $('.it5').css('display', 'inline-block');
    $('.it5').css('float', 'none');

    $('.it2 img').removeAttr('alt');
    $('.it5 a').removeAttr('onmouseout');
    $('.it5 a').removeAttr('onmouseover');

    var $obj = $('td.itd');
    console.log($obj.length);
    for(var i=0,l=$obj.length;i<l;i++){
        var obj_event = $obj.eq(i).attr('onmouseover');
        $obj.eq(i).attr('onload' , obj_event);
        //$obj.eq(i).removeAttr('onmouseover');
        $obj.eq(i).load();
        //console.log(obj_event);
    }
}

var THRESHOLD = 300;
var _height = Math.max.apply( null, [document.body.clientHeight , document.body.scrollHeight, document.documentElement.scrollHeight, document.documentElement.clientHeight] );
setInterval(function(){
    if (Math.max.apply( null, [document.body.clientHeight , document.body.scrollHeight, document.documentElement.scrollHeight, document.documentElement.clientHeight] ) != _height) {
        main();
    }
    _height = Math.max.apply( null, [document.body.clientHeight , document.body.scrollHeight, document.documentElement.scrollHeight, document.documentElement.clientHeight] );
    //console.log(_height);
}, 300);












main();






