// ==UserScript==
// @name         台州市专业技术人员继续教育学习平台-tzvtc
// @namespace    代刷vx：shuake345
// @version      0.1
// @description  自动学习|需配合软件方可秒刷|代刷vx：shuake345
// @author       代刷vx：shuake345
// @match        *://zjjxjy.tzvtc.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475900/%E5%8F%B0%E5%B7%9E%E5%B8%82%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0-tzvtc.user.js
// @updateURL https://update.greasyfork.org/scripts/475900/%E5%8F%B0%E5%B7%9E%E5%B8%82%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0-tzvtc.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function sk(){

        if(document.querySelector('[class="layui-btn layui-btn-sm"]').length!==null){
           document.querySelector('[class="layui-btn layui-btn-sm"]').click()
        setTimeout(dj,1524)
           }else{
           document.querySelector('[class="next layui-laypage-next"]').click()
               setTimeout(sk,2525)
    }
    }
    setTimeout(sk,1525)

    function dj(){
        document.querySelector('[class="layui-layer-btn1"]').click()

        setTimeout(gb,1524)
        //setTimeout(bc,2524)
    }
    function bc(){
    document.querySelector('iframe').contentWindow.document.querySelector('[class="layui-btn layui-btn layui-btn-warm"]').click()
        setTimeout(shuaxin,1524)
    }
    function shuaxin(){
    document.querySelector('iframe').contentWindow.document.querySelector('[class="layui-btn  layui-btn-normal"]').click()
        setTimeout(gb,1524)
    }
    function gb(){
        document.querySelector('iframe').contentWindow.document.getElementById('closeIframe').click()
    }

})();