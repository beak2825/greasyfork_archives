// ==UserScript==
// @name         网页翻译插件模板
// @namespace    https://github.com/scarletkc/WebTranslatorPlugin
// @version      0.1
// @description  能够将网页的语言更改为各种其他的语言
// @author       Kc
// @match        *://fog.moe/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GPL-2.0 License
// ==/UserScript==

(function() {
    'use strict';
    var chosenLang = ""; 
    var TranslationsCN = {
        //网页中原文和对应的翻译
        "AnEnglishWord":"翻译后的中文",
        "Hello":"你好"

    };    
    var AllElementClassName = [
        //网页中所有的需要翻译的原文元素的className
        "The First Element Class Name",
        "The Second Element Class Name"

    ];

    function Replace(className,language) {
        //根据className查找元素，并根据选择的language替换元素的文本
        var elements = document.getElementsByClassName(className);         
        var loop = setInterval(function(){
            if(elements.length > 0) {
                for (var i = 0; i < elements.length; i++) {
                    var getText = elements[i].childNodes[0].nodeValue;
                    if(language == "zh-CN") {
                        for(getText in TranslationsCN) {
                            elements[i].childNodes[0].nodeValue = TranslationsCN[getText];
                        }
                    }
                }
                clearInterval(loop);
            }
        },3000);    
        /*setTimeout(function () {
            clearInterval(loop);
        }, 5000);*/                   
    }

    if(true){ //选择一个语言
        chosenLang = "zh-CN" //简体中文
    }

    for(var i = 0; i < AllElementClassName.length; i++) {
        //翻译并替换网页中的全部元素文本
        Replace(AllElementClassName[i],chosenLang);
    }


})();