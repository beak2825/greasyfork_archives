// ==UserScript==
// @name         autowritebycomplanywork
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动周报脚本2
// @author       wlt
// @source       http://wwww.baidu.com/
// @include      http://lucloud.group:9009/ms/base/login/*
// @icon64      https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.ruiwen.com%2Fallimg%2F1808%2F5b80650664c8b96375.jpg%3Fx-oss-process%3Dstyle%2Fqr.sundxs&refer=http%3A%2F%2Fpic.ruiwen.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1627451179&t=6529ca9c90b6bc0f2101d5e1c8af7061
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @antifeature
// @downloadURL https://update.greasyfork.org/scripts/429053/autowritebycomplanywork.user.js
// @updateURL https://update.greasyfork.org/scripts/429053/autowritebycomplanywork.meta.js
// ==/UserScript==

window.onload = function(){
  'use strict';
    function setdata(jobname2,phone2,bzgzqk2,xzgzjh2,czwt2){
        setTimeout("$(\"#ms-content-formdiv form[msform='true'] input[fname='str29']\").trigger(\"active\");",2000);
        setTimeout("$(\"#ms-content-formdiv form[msform='true'] input[fname='str1']\").trigger(\"active\");",2000);
        setTimeout("$(\"#ms-content-formdiv form[msform='true'] input[fname='str29']\").trigger('click');",3000);
        setTimeout("$(\"div[class='chosen-drop'] ul li:first\").trigger('click');",4000);
        setTimeout("$(\"#ms-content-formdiv form[msform='true'] input[fname='str1']\").trigger('click');",5000);
        setTimeout("$(\"div[class='chosen-drop'] ul li\").each(function(i,item){if(item.getAttribute(\"dvalue\") == '个人')$(item).trigger(\"click\");})",6000);
        setTimeout("$(\"#ms-content-toolbar-savebar span a#ms-module-content-save\").trigger(\"click\");",8000);
        setTimeout("$(\"div#ms-wf-msflow-mstree-nodeuser div[mstree='true'] li ul li ul li ul li a\").each(function(i,item){if(item.title == \"欧阳伟\")$(item).trigger(\"click\")})",14000);
        setTimeout("$(\"#ms-wf-flow-msflow-flowbar button#submit\").trigger(\"click\")",15000);
        $("#ms-content-formdiv form[msform='true'] input[fname='str7']").val(jobname2);
        $("#ms-content-formdiv form[msform='true'] input[fname='str8']").val(phone2);
        $("#ms-content-formdiv form[msform='true'] textarea[fname='content']").val(bzgzqk2);
        $("#ms-content-formdiv form[msform='true'] textarea[fname='str20']").val(xzgzjh2);
        $("#ms-content-formdiv form[msform='true'] textarea[fname='str19']").val(czwt2);
    };
    var gobaltimer1;
    function status1(){
        try{
          if($("#ms-main-side-menu li[title='办公自动化系统'] a[code='0110']") != 0){
              console.log("进度1");
              console.log(gobaltimer1);
              clearInterval(gobaltimer1);
              setTimeout("$(\"#ms-main-side-menu li[title='办公自动化系统'] a[code='0110']\").trigger(\"click\");",3000);
          }
        }catch(e){
              GM_log("阶段1异常"+e);
        }
    };
    var gobaltimer2;
    function status2(){
        try{
            if($(".page-tabs-content a[name='申请审批事项']").length == 0 && $(".ms-menu-name a[code='01100005']").length != 0){
            console.log("进度2");
            console.log(gobaltimer2);
            clearInterval(gobaltimer2);
            setTimeout("$(\".ms-menu-name a[code='01100005']\").trigger(\"click\");",3000);
          }
        }catch(e){
            GM_log("阶段2异常"+e);
        }

    };
    var gobaltimer3;
    function status3(){
        try{
            if($("#ms-oa-docs-mstree div[mstree=true] li a[title='工作周报']").length != 0){
            console.log("进度3");
            console.log(gobaltimer3);
            clearInterval(gobaltimer3);
            setTimeout("$(\"#ms-oa-docs-mstree div[mstree=true] li a[title='工作周报']\").trigger(\"click\");$(\"#ms-content-toolbar-loadbar a[variable='add']\").trigger(\"click\");",3000);
          }
        }catch(e){
            GM_log("阶段3异常"+e);
        }
    };
    var gobaltimer4;
    function status4(){
        if($("#ms-content-formdiv form[msform='true']").length != 0){
            console.log("进度4");
            console.log(gobaltimer4);
            clearInterval(gobaltimer4);
            setdata("java开发","13480022132","1.湖北所政模块相关功能开发\n2.水文局项目因客户需求，将shiro组件版本升级。","1.湖北项目所政模块相关功能开发\n","1.无");
        }
    };
    function run(){
      console.log("-------脚本执行！");
      gobaltimer1 = setInterval(status1,2000);
      gobaltimer2 = setInterval(status2,2000);
      gobaltimer3 = setInterval(status3,2000);
      gobaltimer4 = setInterval(status4,2000);
      console.log("-------定时器设置完毕！");
    };
    run();
};
(function() {

})();