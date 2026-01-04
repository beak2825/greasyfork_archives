// ==UserScript==
// @name         echou
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  你打字带空格
// @author       relic
// @match        https://bbs.sgamer.com/forum.php?mod=post*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389615/echou.user.js
// @updateURL https://update.greasyfork.org/scripts/389615/echou.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.replace = function (text){
        text=text.replace(/\s*/g,"");
        var txt_split=text.split('');
        var arr = new Array();
        for(var index=0 ; index < txt_split.length;index++){
            arr.push(txt_split[index]);
            var reg=new RegExp("[\\u4E00-\\u9FFF]+","g");
            if(reg.test(txt_split[index])){
                arr.push(' ');
            }
        }
        var txt_new=arr.join('');
        return txt_new;
    }

    var z = document.getElementsByClassName("z");
    z[2].innerHTML+= "&nbsp;&nbsp;<a href='javascript:void(0);' onclick='echou()' > 恶臭</a>";

    window.echou=function () {
        var title = document.getElementById("subject");
        title.value=window.replace(title.value);
        var msg = document.getElementById('e_iframe').contentWindow.document.getElementsByTagName('body')[0];
        var str = msg.innerHTML;
        //str = str.replace(/<\/?[^>]*>/g,'');
        str=str.replace(/&nbsp;/ig,'');
        msg.innerHTML= window.replace(str);
    }
})();