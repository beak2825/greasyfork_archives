// ==UserScript==
// @name         纯文字转换
// @namespace    https://OliverCWY.github.io
// @version      0.1
// @description  将网页转换为纯文字（BETA）
// @author       OliverCWY
// @match        *://*
// @match        *://*/*
// @match        *://*/*/*
// @match        *://*/*/*/*
// @match        *://*/*/*/*/*
// @match        *://*/*/*/*/*/*
// @match        *://*/*/*/*/*/*/*
// @match        *://*/*/*/*/*/*/*/*
// @match        *://*/*/*/*/*/*/*/*/*
// @match        *://*/*/*/*/*/*/*/*/*/*
// @match        *://*/*/*/*/*/*/*/*/*/*/*
// @match        *://*/*/*/*/*/*/*/*/*/*/*/*
// @match        *://*/*/*/*/*/*/*/*/*/*/*/*/*
// @match        *://*/*/*/*/*/*/*/*/*/*/*/*/*/*
// @match        *://*/*/*/*/*/*/*/*/*/*/*/*/*/*/*
// @match        *://*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*
// @match        *://*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*
// @match        *://*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*
// @match        *://*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*
// @match        *://*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*
// @match        *://*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*
// @match        *://*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*
// @match        *://*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*
// @match        *://*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*
// @match        *://*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*
// @match        *://*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*
// @match        *://*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*
// @match        *://*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*
// @match        *://*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*
// @match        *://*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*
// @match        *://*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*
// @match        *://*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*
// @match        *:///*
// @match        *:///*/*
// @match        *:///*/*/*
// @match        *:///*/*/*/*
// @match        *:///*/*/*/*/*
// @match        *:///*/*/*/*/*/*
// @match        *:///*/*/*/*/*/*/*
// @match        *:///*/*/*/*/*/*/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27712/%E7%BA%AF%E6%96%87%E5%AD%97%E8%BD%AC%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/27712/%E7%BA%AF%E6%96%87%E5%AD%97%E8%BD%AC%E6%8D%A2.meta.js
// ==/UserScript==

(function () {
    document.body.innerHTML="<p style='z-index:2;position:fixed;text-align:center;bottom:0'><button id='stupid' >切<br>换<br>纯<br>文<br>本<br></button></p><br>"+document.body.innerHTML;
    function rpl(str){
        var s="",n=false,tmp="",tmp2="";
        for(var i=0;i<str.length;i++){
            if(n){
                if(str[i]==' '||str[i]=='>'){if(tmp=='br'||tmp=='p'||tmp[0]=='h'||tmp=="table"||tmp=="tr")s+="<br>";else s+=" ";}
                if(tmp=='a'){s+="<a ";n=false;tmp="";continue;}
                if(tmp=='/a'){if(tmp=='/a')s+="</a>";n=false;tmp="";continue;}
                if(str[i]=='>'){tmp="";n=false;continue;}
                tmp+=str[i];
            }else if(str[i]=="<")n=true;
            else s+=str[i];
        }
        if(tmp=='br'||tmp=='p'||tmp[0]=='h')s+="<br>";
        s=s.replace("切<br>换<br>纯<br>文<br>本<br>","");
        return s;
    }
    $('#stupid').on({
        click: function () {
            document.body.innerHTML="<div><a id='back' href='' onclick='window.location.reload(true)'>切换回原网页</a><br>"+rpl(document.body.innerHTML.replace(/<(style|script|iframe)[^>]*?>[\s\S]+?<\/\1\s*>/gi,''))+"</div>";
            return false;
    }});
})();