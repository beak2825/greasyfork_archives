// ==UserScript==
// @name        JLU评教系统小助手
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  JLU教务评教系统的优化脚本
// @author       JLUer&Diotima
// @match        https://uims.jlu.edu.cn/ntms/page/eval/eval_detail_*.html?eitem=*
// @match        https://webvpn.jlu.edu.cn/https/77726476706e69737468656265737421e5fe4c8f693a6445300d8db9d6562d/ntms/page/eval/eval_detail_*.html?eitem=*
// @grant        none
// @license      MIT 
// @require https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/437655/JLU%E8%AF%84%E6%95%99%E7%B3%BB%E7%BB%9F%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/437655/JLU%E8%AF%84%E6%95%99%E7%B3%BB%E7%BB%9F%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

ImportCss();
ScriptWithJquery();


function ImportCss() {
    var jqueryScriptBlock = document.createElement('style');
    jqueryScriptBlock.type = 'text/css';
    jqueryScriptBlock.innerHTML = "#fast_eval{position:fixed;bottom:50%;left:1px;border:1px solid gray;padding:3px;width:12px;font-size:12px;cursor:pointer;border-radius: 3px;}";
    document.getElementsByTagName('head')[0].appendChild(jqueryScriptBlock);
   ntms.widget._AutoTimer.prototype._static.MIN_INTERVAL_MS=0
}


function ScriptWithJquery() {
    //var Eval=["11","12","14","15","21","22","23","31","32","33","41","42","43","51","52"],EvalException = ["prob13", "sat6", "mulsel71", "prob73"],ExceptionVal = ["N", "A", "K", "Y"];
    var Eval=["01","02","03","04","05","06","07","08","09","10"],
        EvalException = ["sat11","sat12","sat13","judge01"],ExceptionVal = ["A","A","A","Y"];
     $(document.body).append("<div id='fast_eval'>一键好评</div>");
     $('#fast_eval').click(function () {
         Eval.forEach(function(a,n,arr){
             $("input[name='p"+a+"'][value='A']").click();
         });
         EvalException.forEach(function(a,n,arr){
             $("input[name='"+a+"'][value='"+ExceptionVal[n]+"']").click();
         });
         alert("填写完成！");
     });
}