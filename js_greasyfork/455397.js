// ==UserScript==
// @name               1911_planet_no_mobile
// @name:zh-CN         1911星球免绑定手机
// @namespace          planet.tsinghua
// @version            0.0.1
// @description        1911_planet
// @description:zh-CN  1911星球免手机
// @author             Sasha
// @match              *://planet.tsinghua.edu.cn/*
// @downloadURL https://update.greasyfork.org/scripts/455397/1911_planet_no_mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/455397/1911_planet_no_mobile.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /*
    var rmByClassName=function(tmpClassName){
        var tmp=document.getElementsByClassName(tmpClassName)[0];
        if(tmp){
            tmp.parentNode.removeChild(tmp);
        }
    };
    */
    var rmById=function(tmpId){
        var tmp=document.getElementById(tmpId);
        if(tmp){
            tmp.parentNode.removeChild(tmp);
        }
    };
    rmById("append_parent");
    /*
    var delExLang=function(){
        //利用正则表达式，删除从首个非的h1到div结束的内容
        //<h1><span id=".D0.A0.D1.83.D1.81.D1.81.D0.BA.D0.B8.D0.B9"></span><span class="mw-headline" id="Русский">Русский</span></h1>
        //前一个span不管，只看标题的id
        //<div class="mw-parser-output"><div>
        var output_div=document.getElementsByClassName('mw-parser-output')[0];
    	output_div.innerHTML=name;
    };id="fwin_xbindmobile"
    fwinmask
    append_parent
    */


})();