// ==UserScript==
// @license MIT
// @name         Chaoxing
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  超星学习通复制乱码问题解决
// @author       Juhayna
// @match        http://mooc1.chaoxing.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453920/Chaoxing.user.js
// @updateURL https://update.greasyfork.org/scripts/453920/Chaoxing.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var cxtext;
    var cx_font_fun = function(){
        //console.log("得到:",window.frames[0].name);
        //console.log(document.body.innerHTML);
        var frame = window.frames[0];
        if(frame && frame.name === 'frame_content'){
           console.log(frame);
        }
        else{
           return;
        }
        var i;
        var cx_text = frame.document.documentElement.outerHTML;// cx_st.innerHTML;
        var pattern = /charset=utf-8;base64,\S+'/;
        var res = pattern.exec(cx_text)[0];
        var font_data = res.substring(21,res.length-1);
        //console.log(font_data);
        console.log("success get font_data!");
        //请求
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://beanlite.fun:3399/font');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4 && xhr.status === 200) {
                var res = JSON.parse(xhr.responseText);
                if(res.success){
                   console.log(res);
                   localStorage.setItem('curFontMap',JSON.stringify(res.data));
                   return;
                }
            }
        }
        xhr.send(JSON.stringify({data:font_data}));
    };
    var check = function(){
        var frame = window.frames[0];
        if(frame && frame.name === 'frame_content'){
           cxtext = frame.document.documentElement.querySelectorAll(".font-cxsecret");
           if(cxtext.length > 0){
            var curFontMap = JSON.parse(localStorage.getItem('curFontMap'));
            if(curFontMap.length === 0){
                setTimeout(check,100);
            }
            else{
                var cxmap = new Map(curFontMap);
                for(var e of cxtext){
                    for(var i=0;i<e.innerHTML.length;i++){
                        if(cxmap.get(e.innerHTML[i])){
                            e.innerHTML = e.innerHTML.replace(e.innerHTML[i],cxmap.get(e.innerHTML[i]));
                        }
                    }
                }
            }
        }
        }
        return;
    }
    localStorage.setItem('curFontMap',JSON.stringify([])); //先将其置为空
    window.onload = function(){
        cx_font_fun();
        setTimeout(check,100);
    };
})();