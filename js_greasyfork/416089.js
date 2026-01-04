// ==UserScript==
// @name         情境互动教学综合平台
// @namespace    https://xxb.xagu.top
// @version      0.3
// @description  厦门科云教育学院 情境互动教学综合平台题目自动完成
// @author       XAGU
// @include     *://*.acctedu.com*
// @connect      acctedu.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// @grant        window.onurlchange
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/416089/%E6%83%85%E5%A2%83%E4%BA%92%E5%8A%A8%E6%95%99%E5%AD%A6%E7%BB%BC%E5%90%88%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/416089/%E6%83%85%E5%A2%83%E4%BA%92%E5%8A%A8%E6%95%99%E5%AD%A6%E7%BB%BC%E5%90%88%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==


var doc = unsafeWindow;
var url = location.pathname;
var uri = location.search;

doc.alert = console.log;

window.addEventListener ("load", pageFullyLoaded);




function pageFullyLoaded() {
    'use strict';
    var $ = doc.$;
    if(url == '/ukt/practice/FlowPracticeStepTopMenuAction.do'){
        setTimeout(
            function(){
                start();
            }, 1000);
    }
    if(url == '/ukt/flowbillform/SettingForwardAction.do' && uri.search('operation_type=preview_bystep')!=-1){
        dowork();
    }
    if(url == '/ukt/flowbillform/SettingForwardAction.do' && uri.search('operation_type=practice_save')!=-1){
        console.log(url);
    }
    if(url == '/submit'){
        submit();
    }



    function start(){
        if(doc.doStandard.toString().search("不能查看参考答案")!=-1){
            doc.doStandard = function() {
                var bottomWin = getBottomWindow();
                //==================================================================================
                var url_params = doc.location.search.substr(1);;
                console.log(url_params);

                var url = "FlowPracticeStepStandardAjaxAction.do?" + url_params;
                var ajax = new JoinsoftAjax(url);
                var maps = ajax.getMaps();
                if(maps == null || maps.length <= 0){
                    alert("没有需要看答案的单据！");
                    return;
                }

                for(var i=0,len=maps.length;i<len;i++){
                    var billId = maps[i].get("billId");
                    var title = maps[i].get("title");
                    var url_bill = "../flowbillform/SettingForwardAction.do?billId="+billId+"&operation_type=preview_bystep";
                    url_bill += "&" + url_params;
                    appendTagFromParent(bottomWin, "doStandard_" + billId, "看答案-" + title, url_bill, true, (i!=len-1));//是否关闭标签、是否推迟加载，只有最后一个标签不推迟加载
                }
            }
            doc.doStandard(doc);
        } else{
            doc.doStandard(doc);
        }

    }

    function dowork(){

        var sub = doc.parent.parent.frames['contentWin'].frames['node_mainWin_multiTags_tag_default_uid_0'];
        var newBillFormSubmit = sub.billFormSubmit;
        sub.billFormSubmit = function(fbox){
            $(fbox).children().eq(1).val("/submit")
            newBillFormSubmit(fbox);
        }
        sub.do_flow_bill_form(doc.document.forms[0])


    }

   function submit(){

       var topMenuWin = doc.parent.parent.frames['topMenuWin'];
       topMenuWin.confirm = function(){
           return true;
       }
       var newSubmitUrlBeforeSaveBill = topMenuWin.submitUrlBeforeSaveBill;
       topMenuWin.submitUrlBeforeSaveBill = function(submitUrl){
          submitUrl = submitUrl.replace('../','/ukt/');
          console.log(submitUrl);
           newSubmitUrlBeforeSaveBill(submitUrl);
       }
        topMenuWin.doNext(topMenuWin);
    }
};