// ==UserScript==
// @name         超星慕课时间轴Chao Xing Mook Timeline Hijack Script
// @namespace    https://82flex.com/
// @version      1
// @description  狗日的超星慕课安全教育
// @author       i_82
// @match        http://*.chaoxing.com/knowledge/cards*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14748/%E8%B6%85%E6%98%9F%E6%85%95%E8%AF%BE%E6%97%B6%E9%97%B4%E8%BD%B4Chao%20Xing%20Mook%20Timeline%20Hijack%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/14748/%E8%B6%85%E6%98%9F%E6%85%95%E8%AF%BE%E6%97%B6%E9%97%B4%E8%BD%B4Chao%20Xing%20Mook%20Timeline%20Hijack%20Script.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var HtmlUtil = {
    htmlEncodeByRegExp:function (str){  
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&/g,"&amp;");
        s = s.replace(/</g,"&lt;");
        s = s.replace(/>/g,"&gt;");
        s = s.replace(/\'/g,"&#39;");
        s = s.replace(/\"/g,"&quot;");
        return s;  
    },
    htmlDecodeByRegExp:function (str){  
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&amp;/g,"&");
        s = s.replace(/&lt;/g,"<");
        s = s.replace(/&gt;/g,">");
        s = s.replace(/&#39;/g,"\'");
        s = s.replace(/&quot;/g,"\"");
        return s;  
    }
};

function getByClass(sClass){
    var aResult = [];
    var aEle = document.getElementsByTagName('*');
    for (var i = 0; i < aEle.length; i++) {
        var arr = aEle[i].className.split(/\s+/);
        for(var j = 0; j < arr.length; j++){
            if(arr[j] == sClass){
                aResult.push(aEle[i]);
            }
        }
    }
    return aResult;
}

if (typeof mArg == "object") {
    if (mArg.attachments[0].isPassed == true) {
        alert('Warning: This job has been finished once.');
    } else {
        mArg.attachments[0].isPassed = true;
        mArg.attachments[0].headOffset = 1478000;
        mArg.attachments[0].playTime = 1478000;
        mArg.attachments[0].job = false;
        var aBox = getByClass("ans-attach-online");
        if (aBox[0]) {
            var htmlData = aBox[0].getAttribute("data");
            var bBox = getByClass("ans-cc");
            if (bBox[0]) {
                bBox[0].innerHTML = '<p><iframe frameborder="0" scrolling="no" class="ans-module ans-attach-online ans-insertvideo-module" module="insertvideo" data="'
                    + HtmlUtil.htmlEncodeByRegExp(htmlData)
                    + '" type="online"></iframe><br/></p>';
                uParse(".ans-cc", null, mArg);
                alert('Chao Xing Mook Timeline Hijack Script\nJavascript Injection Succeed!\nCracked by i_82 (i.82@me.com).');
            }
        }
    }
}
