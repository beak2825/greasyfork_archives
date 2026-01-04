// ==UserScript==
// @name         upm
// @namespace    http://tampermonkey.net/
// @version      1.32
// @description  no!
// @author       You
// @match        https://pterclub.com/upload.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/452857/upm.user.js
// @updateURL https://update.greasyfork.org/scripts/452857/upm.meta.js
// ==/UserScript==ssstyle="

(function() {
    document.querySelectorAll('#browsecat')[0].value='413'
    document.querySelectorAll('#compose > table > tbody > tr:nth-child(10) > td.rowfollow > select')[0].value='5'
    document.querySelectorAll('#jinzhuan')[0].checked=true
    document.querySelectorAll('#guanfang')[0].checked=true

    document.querySelectorAll('#compose > table > tbody > tr:nth-child(13) > td.rowfollow > input[type=checkbox]')[0].checked=true
    var divNode

    window.onload=function(){
        divNode = document.querySelector(".wysibb-texarea");
        divNode.setAttribute("oninput","checkTxt()")
        console.log(divNode)
        var setIntervalFun = null;
        setIntervalFun = setInterval("fixend()",500);
    };

    window.checkTxt = function (){
        var tmp =divNode.value.split('mysubtitleQ')
        var len = divNode.value.split('\n').length;
        if(len<12){return 0}tmp
        if(document.getElementsByName('small_descr')[0].value == '')
            document.getElementsByName('small_descr')[0].value=tmp[1]
        divNode.value=tmp[0]
        var pattern_ch = /[\u4e00-\u9fa5]+/
        var pattern_eu = /[A-Za-z\s0-9]+/
        var pattern_ko = /[\uac00-\ud7ff]+/
        var pattern_pingjp = /[\u3040-\u309f+]+/
        var pattern_pianjp = /[\u30a0-\u30ff+]+/

        if(pattern_pingjp.test(tmp[1]) || pattern_pianjp.test(tmp[1])){
            document.querySelectorAll('#compose > table > tbody > tr:nth-child(11) > td.rowfollow > select')[0].value='6'
            console.log('jp video')
        }else if(pattern_ko.test(tmp[1])){
            document.querySelectorAll('#compose > table > tbody > tr:nth-child(11) > td.rowfollow > select')[0].value='5'
            console.log('ko video')
        }
        else if(pattern_ch.test(tmp[1])){
            document.querySelectorAll('#compose > table > tbody > tr:nth-child(11) > td.rowfollow > select')[0].value='1'
            console.log('cn video')
            document.querySelectorAll('#guoyu')[0].checked=true
            document.querySelectorAll('#zhongzi')[0].checked=true
        }else{
            document.querySelectorAll('#compose > table > tbody > tr:nth-child(11) > td.rowfollow > select')[0].value='4'
        }
    };

    window.fixend = function (){
        var len=document.querySelector(".wysibb-texarea").value.length
        if(len >520){
            var end=''
            for(var i=document.querySelector(".wysibb-texarea").value.length-12;i<document.querySelector(".wysibb-texarea").value.length;i++)
            {
                end += document.querySelector(".wysibb-texarea").value[i]
            }
            if(end=="[/img][/url]")document.querySelector(".wysibb-texarea").value+="[/td][/tr][/table]"
        }
    }
})();



