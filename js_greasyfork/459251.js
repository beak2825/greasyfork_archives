// ==UserScript==
// @name         记住Google搜索语言设置
// @namespace    https://github.com/laisc7301/remember-google-language
// @version      2.6
// @description  自动记住Google搜索的结果语言的设置，不用每次设置语言
// @author       睿虎
// @match        https://www.google.com/search*
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @run-at       document-start
// @homepage     https://laisc7301.github.io/blog/
// @license      Apache License 2.0
// @downloadURL https://update.greasyfork.org/scripts/459251/%E8%AE%B0%E4%BD%8FGoogle%E6%90%9C%E7%B4%A2%E8%AF%AD%E8%A8%80%E8%AE%BE%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/459251/%E8%AE%B0%E4%BD%8FGoogle%E6%90%9C%E7%B4%A2%E8%AF%AD%E8%A8%80%E8%AE%BE%E7%BD%AE.meta.js
// ==/UserScript==

(function() {

    var url = unsafeWindow.location.href;

    //url="https://www.google.com/search?q=tensorflow&lr=lang_zh-CN|lang_zh-TW&newwin";
    //url="https://www.google.com/search?q=tensorflow&lr=&";
    //url="https://www.google.com/search?q=tensorflow";

    //---------------------------------------1------------------------------------------------
    //第一部分：检测语言设置，保存语言设置，应用设置


    var regex11 = /&lr=\S{0,}?&|&lr=\S{0,}?$|\?lr=\S{0,}?&|\?lr=\S{0,}/;
    var url11 = url.match(regex11);//获取url中的语言设置
    //url11="lr=lang_zh-CN|lang_zh-TW";

    if(url11!=null){//若url中的语言设置存在，则保存
        var regex12 = /&|\?/g;
        var url12 = url11.toString().replace(regex12,"");
        if(url12!="lr="){
            GM_setValue("googleLanguage", url12);//保存语言设置
        }else{//如果语言设置为空，则清除设置
            GM_deleteValue("googleLanguage");
            var regex13 = /&lr=&|&lr=|lr=&|lr=/g;
            var url13 = unsafeWindow.location.href;
            var url14 = url13.toString().replace(regex13,"&");
            unsafeWindow.location.href = url14;
        }
    }else{
        var set1 = GM_getValue("googleLanguage","none");
        if(set1!="none"){//如果存在设置，则自动跳转到设置的语言
            unsafeWindow.location.href += "&" + set1;
        }

    }

    //--------------------2-----------------------
    //第二部分：设置【清除】按钮的链接

    var clean1 = null;

    var waitload = setInterval(function() {
        clean1 = document.getElementsByClassName("rZBQ0c")[0];
        if(clean1!=undefined){
            clean1.href += "&lr=";
            clearInterval(waitload);
        };
        //alert(123);

        var url21 = unsafeWindow.location.href;
        var regex21 = /&lr=\S{0,}?&|&lr=\S{0,}?$|\?lr=\S{0,}?&|\?lr=\S{0,}/;
        var url22 = url21.match(regex21);//获取url中的语言设置
        if(url22==null){
            clearInterval(waitload);
        }else{
            var regex22 = /&|\?/g;
            var url23 = url22.toString().replace(regex22,"");
            if(url23=="lr="){
                clearInterval(waitload);
            }
        }



    }, 100);



    //--------------------3-----------------------
    //第三部分：设置【不限语言】按钮的链接
    var myelement00 = null;

    var waitload2 = setInterval(function() {


        var myelement = document.getElementsByClassName("YpcDnf");
        for(let i=0; i<myelement.length;i++){
            let myelement2 = myelement[i].children;
            for(let i2=0; i2<myelement2.length;i2++){
                if(myelement2[i2].innerHTML=="不限语言"){
                    //alert(myelement2[i2].innerHTML);
                    myelement00 = myelement2[i2];
                }
            }
        }
        if(myelement00!=null){
            myelement00.href += "&lr=";
            clearInterval(waitload2);
        };
        //alert(123);


        var url31 = unsafeWindow.location.href;
        var regex31 = /&lr=\S{0,}?&|&lr=\S{0,}?$|\?lr=\S{0,}?&|\?lr=\S{0,}/;
        var url32 = url31.match(regex31);//获取url中的语言设置
        if(url32==null){
            clearInterval(waitload2);
        }else{
            var regex32 = /&|\?/g;
            var url33 = url32.toString().replace(regex32,"");
            if(url33=="lr="){
                clearInterval(waitload2);
            }
        }


    }, 100);


})();