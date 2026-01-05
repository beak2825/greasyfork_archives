// ==UserScript==
// @name         HEYZO解除登录验证
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://www.heyzo.com/moviepages*
// @grant        none
// @require      https://code.jquery.com/jquery-1.7.1.min.js
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/29598/HEYZO%E8%A7%A3%E9%99%A4%E7%99%BB%E5%BD%95%E9%AA%8C%E8%AF%81.user.js
// @updateURL https://update.greasyfork.org/scripts/29598/HEYZO%E8%A7%A3%E9%99%A4%E7%99%BB%E5%BD%95%E9%AA%8C%E8%AF%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
     var $ = $ || window.$;
    
    // alert("start");
    // document.title = "";
    function titleAdd(str){
        document.title = document.title + "<>" + str;
    }
    
//     $('head script[type="text/javascript"]').each(function () {
//         // var script = $(this).html();
//         var src = $(this).prop("src");
//         if(src && src.indexOf("/heyzo.js") > -1){
//             alert(src);
//         }
//     });
//     $('head script[src*="/heyzo.js"]').ready(function(){
//         // alert("/heyzo.js");
        
//         titleAdd("/heyzo.js");
//         isLogin = function (){
//             return true;
//         };
//     });
    
    // alert($("#section_gallery").length);
    if($("#section_gallery").length > 0){
        // alert($("#section_gallery").html());
        var sg = $("#section_gallery");
        
        // var ts = $("<textarea>");
        // sg.append(ts);
        // sg.find(".yoxview > a").each(function(){
        //     // var t = $(this).html();
        //     // if($.trim(t)){
        //     //     alert(t);
        //     // }
        //     var ot = $(this).prop("outerHTML");
        //     ts.val(ts.val() + "\n" + ot);
        // });
        
        var $a = sg.find(".yoxview > a.lightbox");
        // var $a = sg.find(".yoxview > .lightbox ");
        var $img = sg.find(".yoxview > img.nonmember");
        // alert($a.length + "-" + $img.length);
        
        var aHrefReg = /(.*\/)(\d+)(\.\w+)$/;
        var _a = $a.first();
        var _a_img = _a.find("img");
        var _a_href = _a.attr("href");
        // var _a_href_1 = _a_href.replace(aHrefReg, "$1");
        // var _a_href_2 = _a_href.replace(aHrefReg, "$2");
        // var _a_href_3 = _a_href.replace(aHrefReg, "$3");
        // alert(_a_href_1);
        
        var imgSrcReg = /(.*\/)([^\d]*)(\d+)(\.\w+)$/;
        var _img = $img.first();
        var _img_src = _img.attr("src");
        // alert(_img_src);
        // var _src_2 = _img_src.replace(imgSrcReg, "$2");
        // alert(_src_2);

        // 复制第一个a标签，更改图片地址
        function newA(img){
            var src = img.attr("src");
            var imgNum = src.replace(imgSrcReg, "$3");
            
            var newTag = _a.clone(true);
            var newHref = newTag.attr("href").replace(aHrefReg, "$1" + imgNum + "$3");
            newTag.attr("href", newHref);
            
            var newTagA = newTag.find("img");
            var newTagASrc = newTagA.attr("src", src);
            
            // alert(newTag.attr("href"));
            // alert(newTag.find("img").attr("href"));
            return newTag;
        }
        
        // 将img替换为新的a标签
        var _lastTag = $a.last();
        var newTags = null;
        $img.each(function(){
            var img = $(this);
            var _newAasImg = newA(img);
            if(newTags){
                newTags.add(_newAasImg);
                // alert("add");
            }else{
                newTags = _newAasImg;
            }
            img.remove();
            _lastTag.after(_newAasImg);
            _lastTag = _newAasImg;
            // return false;
        });
        // alert(newTags.length);
        // $img.remove();
        // _lastTag.after(newTags);
    }
    $("#section_gallery").ready(function(){
        // 完全加载完成时
        // alert("section_gallery");
        // titleAdd("section_gallery");
    });
    
    //alert(isLogin);
    //document.title = isLogin;
     //user_jp_hzo_nml = 1;
     //user_en_hzo_nml = 1;
    isLogin = function (){
        return true;
    };

    // Your code here...
})();