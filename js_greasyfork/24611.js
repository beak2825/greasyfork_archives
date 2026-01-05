// ==UserScript==
// @name         Flash Run & Download
// @version      1
// @description  Easily Download & Run Flash from any website
// @author       AnoPem
// @match        *://*/*
// @require      http://code.jquery.com/jquery-latest.js
//@grant         none
// @namespace https://greasyfork.org/users/22390
// @downloadURL https://update.greasyfork.org/scripts/24611/Flash%20Run%20%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/24611/Flash%20Run%20%20Download.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function wrap(element, url){
        var topmostFramesMainBody = $(top.document.body).first();
        if (url.toLowerCase().indexOf("http://")){
            newurl = $(location).attr('href');
            var clean = newurl.lastIndexOf('/') +1;
            url = newurl.substring(0, clean) + url;
        }
        var filename = url.lastIndexOf("/") + 1;
        filename = url.substr(filename).replace(/\_/g, ' ').split('?')[0].split('.')[0];
        if($("*[name='" + filename + "']").length !== 1){
            $(document).ready(function(){
                $(topmostFramesMainBody).prepend("<style>.FlashPJ{calc(100% - 2px);height:30px;clear:both;background-color:linen;border:1px solid #000000;display:none;}.flashPJURL{float:left;margin:0px 10px;height:30px;line-height:30px;color:#000000!important;display:block;font-size:12px;font-weight:normal!important;text-decoration:underline!important;}.FlashPJ span:first-child{float:left;width:85px;height:30px;line-height:30px;margin:0px 10px;color:#000000!important;font-size:14px;font-family:arial;}.FlashPJTitle{float:left;margin:0px 10px;height:30px;line-height:30px;font-family:arial;color:#000000!important;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}.FlashPJClose{float:right;height:10px;width:10px;background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYBAMAAAASWSDLAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAA8rAAAPKwEMainsAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAABhQTFRF////AAAAAAAAAAAAAAAAAAAAAAAAAAAAXGJBvQAAAAd0Uk5TAE2Ej6Hh+UxA/JcAAABqSURBVBhXY2AMYoACVQEGsXIDCJu5PJEhvLwYwjEvL2VQL4dIMZeXF4EIsJQ5WBBCQsUgFEQIQsMUg6RK3KESYCmYBFgKLsHAAFRUAmOjcFCUIRuAYjSypSjOQXYoihdQPIfibZQAQQ4qAPz6NjH0jTzlAAAAAElFTkSuQmCC');background-repeat:no-repeat;background-size:10px 10px;margin:10px 10px;}</style>");
                $('<div class="FlashPJ" name="' + filename + '"><span>Flash Player:</span><span class="FlashPJTitle">' + filename + '</span><a href="flashpj://' + url + '" class="flashPJURL" onclick="$(this).parent().slideUp(200);">Download</a><a href="flashpj-run://' + url + '" class="flashPJURL" onclick="$(this).parent().slideUp(200);">Run</a><a href="javascript:void(0)" class="FlashPJClose" onclick="$(this).parent().slideUp(200);"></a></div>').prependTo(topmostFramesMainBody).slideDown(200);
            });
        }
    }
    function attrCheck(value){
        if($(value).attr('src')){
            wrap($(value), $(value).attr('src'));
        } else if($(value).attr('data')){
            wrap($(value), $(value).attr('data'));
        } else if($(value).attr('movie')){
            wrap($(value), $(value).attr('movie'));
        }
    }
    setInterval(function(){
        $('object:has(embed)').each(function(){
            attrCheck($(this));
        });
        $('object').each(function(){
            attrCheck($(this));
        });
        $('embed').each(function(){
            attrCheck($(this));
        });
    }, 1000);
})();