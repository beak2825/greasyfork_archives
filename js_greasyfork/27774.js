// ==UserScript==
// @name         幕布增强-行数
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       AloudmyRC
// @match        https://mubu.com/edit/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27774/%E5%B9%95%E5%B8%83%E5%A2%9E%E5%BC%BA-%E8%A1%8C%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/27774/%E5%B9%95%E5%B8%83%E5%A2%9E%E5%BC%BA-%E8%A1%8C%E6%95%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var fn=[];
    fn.addStyle=function(){
        $('head').append(`
<style>
#editor-header .action.ex-NodeCount{

    color: #333;
    width: auto;
    padding: 0 12px;
}
</style>
`);
    };
    fn.NodeCount=[];
    fn.NodeCount.core=function(el){
        var len = document.querySelectorAll('.node').length;
        el.innerText=len+'行';
        return len;
    };
    fn.NodeCount.init=function(){
        $('.right').before('<div class="ex-NodeCount action"></div>');
        var el = document.querySelector('.ex-NodeCount');
        fn.NodeCount.listen(el);
        fn.NodeCount.ready(el);
    };
    fn.NodeCount.ready=function(el){
        $().ready(function(){
        fn.NodeCount.core(el);
            var ti= setInterval(function(){
               if(fn.NodeCount.core(el)>0){
                   clearInterval(ti);
               }
            },1000);
        });
    };
    fn.NodeCount.listen=function(el){
        var key = [8,13];
        var keyCtrl = [88,86,67];
        document.onkeydown=function(event){
            var e = event || window.event || arguments.callee.caller.arguments[0];
            var currKey = e.keyCode||e.which||e.charCode;
            if((keyCtrl.indexOf(currKey)>-1 && (e.ctrlKey||e.metaKey)) || (key.indexOf(currKey)>-1)){
               fn.NodeCount.core(el);
            }
        };
    };

    fn.main=function(){
        fn.addStyle();
        fn.NodeCount.init();
    };
    fn.main();
})();