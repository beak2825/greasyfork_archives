// ==UserScript==
// @name               ru.wiktionary.org_optimization
// @name:zh-CN         ru.wiktionary.org单词查询优化
// @namespace          ru.wiktionary.words
// @version            0.1.3
// @description        simplify ru.wiktionary.org (remove irrelevant contents); move links to en/zh version after title
// @description:zh-CN  【已完成】精简ru.wiktionary.org单词页面（删除无关内容[其他语言暂时不动]：左边栏完整移除）；增加多语言链接；加上标题单词到千亿词霸到链接【暂缓】删除非俄语的释义，比如乌克兰语
// @author             Sasha
// @match              *://*.wiktionary.org/wiki/*
// @downloadURL https://update.greasyfork.org/scripts/415312/ruwiktionaryorg_optimization.user.js
// @updateURL https://update.greasyfork.org/scripts/415312/ruwiktionaryorg_optimization.meta.js
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
    /*
    var delExLang=function(){
        //利用正则表达式，删除从首个非的h1到div结束的内容
        //<h1><span id=".D0.A0.D1.83.D1.81.D1.81.D0.BA.D0.B8.D0.B9"></span><span class="mw-headline" id="Русский">Русский</span></h1>
        //前一个span不管，只看标题的id
        //<div class="mw-parser-output"><div>
        var output_div=document.getElementsByClassName('mw-parser-output')[0];
    	output_div.innerHTML=name;
    };
    */

    var addRuEnZhLink=function(){
        var h=document.createElement("p");//创建新的<h1> 元素
        var curURL=window.location.href;
        var word=curURL.split("/").pop().split("#")[0]
        var ru=document.createElement("a");
        var en=document.createElement("a");
        var zh=document.createElement("a");
        ru.setAttribute('href',"https://ru.wiktionary.org/wiki/"+word);
        ru.innerHTML="RU "//把百分号编码转回去
        en.setAttribute('href',"https://en.wiktionary.org/wiki/"+word);
        en.innerHTML="EN "//把百分号编码转回去
        zh.setAttribute('href',"https://zh.wiktionary.org/wiki/"+word);
        zh.innerHTML="ZH "//把百分号编码转回去
        h.appendChild(ru);
        h.appendChild(en);
        h.appendChild(zh);
        
        var qianyi=document.createElement("a");
        qianyi.setAttribute('href',"http://www.qianyix.com/words/index.php?q="+word);
        qianyi.innerHTML="千亿"
        h.appendChild(qianyi);
        
        var parentNode=document.getElementById("bodyContent");
        parentNode.prepend(h);
    };
  
    var addQianyiLink=function(){
        var h=document.createElement("h1");//创建新的<h1> 元素
        h.setAttribute('lang',"ru")
        var curURL=window.location.href;
        var word=curURL.split("/").pop().split("#")[0]
        var qianyi=document.createElement("a");
        qianyi.setAttribute('href',"http://www.qianyix.com/words/index.php?q="+word);
        qianyi.innerHTML=decodeURI(word)//把百分号编码转回去
        h.appendChild(qianyi);
        
        var parentNode=document.getElementById("content");
        var firstHeading=document.getElementById("firstHeading");
        parentNode.insertBefore(h,firstHeading);
        parentNode.removeChild(firstHeading);
    };
    var idList=new Array("p-personal","toc")
    idList.forEach(rmById)
    
    /*
    var classNameList=new Array("printfooter")
    classNameList.forEach(rmByClassName)
    */
    
    //delExLang();
    addRuEnZhLink();
    addQianyiLink();
})();