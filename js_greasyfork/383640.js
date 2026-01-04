// ==UserScript==
// @name         凯氏卫星定位监控系统日期字段同步
// @namespace    https://penicillin.github.io/
// @version      0.2.1
// @description  屏蔽凯氏卫星历史记录日期输入框的日期选择控件，并对两个日期框做数据同步
// @author       静夜轻风
// @match        http://www.fzksgps.com/Main/Index.html
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/383640/%E5%87%AF%E6%B0%8F%E5%8D%AB%E6%98%9F%E5%AE%9A%E4%BD%8D%E7%9B%91%E6%8E%A7%E7%B3%BB%E7%BB%9F%E6%97%A5%E6%9C%9F%E5%AD%97%E6%AE%B5%E5%90%8C%E6%AD%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/383640/%E5%87%AF%E6%B0%8F%E5%8D%AB%E6%98%9F%E5%AE%9A%E4%BD%8D%E7%9B%91%E6%8E%A7%E7%B3%BB%E7%BB%9F%E6%97%A5%E6%9C%9F%E5%AD%97%E6%AE%B5%E5%90%8C%E6%AD%A5.meta.js
// ==/UserScript==

(function() {
    var interval = setInterval(function(){
        try{
            document.getElementsByTagName('iframe')[1].contentWindow.document.getElementById("function").contentWindow.document.getElementsByTagName('iframe')[3].style.display='none';
            var iframeDocument=document.getElementsByTagName('iframe')[1].contentWindow.document.getElementById("function").contentWindow.document.getElementById("search").contentWindow.document;
            clearInterval(interval);
            console.log('OK....');
            setInterval(function(){ clock(); }, 3000);
            function clock()
            {
                var leftText=iframeDocument.getElementById("tb_F");
                var rightText=iframeDocument.getElementById("tb_G");
                if (leftText && rightText !== null){
                    rightText.value=leftText.value.substring(0,10)+" 20:00:00";
                }
            }
        }catch(err){
            console.log('Waitting....');
        }
    }
                               , 2000);}
)();