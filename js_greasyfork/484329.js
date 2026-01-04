// ==UserScript==
// @name         ERP订单发货内网同步撕单
// @namespace    https://www.erp321.com/
// @version      1.6
// @description  JST ERP订单发货内网同步撕单
// @author       Kind
// @match        */app/wms/send/send.aspx*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @require      https://code.jquery.com/jquery-1.8.1.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484329/ERP%E8%AE%A2%E5%8D%95%E5%8F%91%E8%B4%A7%E5%86%85%E7%BD%91%E5%90%8C%E6%AD%A5%E6%92%95%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/484329/ERP%E8%AE%A2%E5%8D%95%E5%8F%91%E8%B4%A7%E5%86%85%E7%BD%91%E5%90%8C%E6%AD%A5%E6%92%95%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("Hello Tampermonkey");
    // Your code here...
})();

var appId;
var userID;
var userName;
var ServerURL1='https://file.139sl.cn/erp_send.php';//主服务器 2024-08更换
var ServerURL2='https://erp321.jnyujie.cn/erp_send.php';//备用服务器
window.onload = function(){
    var appEle=window.parent.document.querySelector("#authorize_co_id");
    if(appEle!=null)
    {
        appId=window.parent.document.querySelector("#authorize_co_id").getAttribute("value");
    }
    var scriptnodes =window.parent.parent.document.querySelectorAll("body > script");
    if(scriptnodes.length>0){
        for (var n = 0; n < scriptnodes.length; n++){
            if(scriptnodes[n].innerText.indexOf('客户信息 客服系统专用')!=-1){
                var dataInnerText=scriptnodes[n].innerText;
                var uiArr =dataInnerText.split('\n');
                if (uiArr.length > 13){
                    var userData = uiArr[13];
                    var userJsonData = JSON.parse(userData.substring(userData.indexOf('{'), userData.lastIndexOf('}') + 1));
                    userName= userJsonData.userName;
                    userID = userJsonData.userID;
                    if (appId == undefined) {
                        appId = userJsonData.companyID;
                    }
                }
            }
        }
    }else{
        alert("未获取到ERP用户，请刷新");
    }

    //var beforeEle=document.querySelector("#form1 > table:nth-child(25) > tbody > tr > td:nth-child(3) > div:nth-child(1)");//null ×
    //var beforeEle=document.querySelector("#form1 > table:nth-child(27) > tbody > tr > td:nth-child(3) > div:nth-child(1)"); //ok √
    var beforeEle=document.querySelector('#form1 > table:last-of-type > tbody > tr > td:nth-child(3) > div:nth-child(1)');//ok √
    var myEle="<div id='myEle' style='height:50px;width:700px;'><iframe frameborder='no' src='"+ServerURL1+"?appId="+appId+"' style='overflow-y: scroll;border:0px;padding:0px;width:100%;height:100%;'></iframe></div>"
    $(beforeEle).after(myEle);

    var rdContainer=document.querySelector("#btnconfirm_panel");
    var myRadioEle="<div style='float:right;margin-right:120px;margin-top:4px'><input type='radio' name='iframelink' id='link1' checked='checked'><label for='link1' style='font-size: 14px; font-family: Microsoft YaHei;font-weight:bold'>1号服务器</label>&nbsp;&nbsp;&nbsp;<input type='radio' name='iframelink' id='link2'><label for='link2' style='font-size: 14px; font-family: Microsoft YaHei;font-weight:bold'>2号服务器</label></div>"
    $(rdContainer).append(myRadioEle);
    $(rdContainer).on("change","#link1",function(){
        document.querySelector("#myEle > iframe").src=ServerURL1;
    });
    $(rdContainer).on("change","#link2",function(){
        document.querySelector("#myEle > iframe").src=ServerURL2;
    });

}
addXMLRequestCallback(function(xhr) {
    xhr.addEventListener("load", function() {
        if (xhr.responseURL.indexOf('send.aspx?wave=true') != -1) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                if(xhr.response!=null){
                    var responseVal=JSON.parse(xhr.response.substr(2));
                    if(responseVal.ReturnValue!=null)
                    {
                        if(JSON.stringify(responseVal.ReturnValue)!='{}')
                        {
                            var rvJson=responseVal.ReturnValue;
                            if(rvJson.code==0&&rvJson.errorMessage=="")
                            {
                                if(document.querySelector("#link1").checked)
                                {
                                    document.querySelector("#myEle > iframe").src=ServerURL1+"?appId="+appId+"&userID="+userID+"&userName="+userName+"&kuaidihao="+rvJson.l_id;
                                }
                                if(document.querySelector("#link2").checked)
                                {
                                    document.querySelector("#myEle > iframe").src=ServerURL2+"?appId="+appId+"&userID="+userID+"&userName="+userName+"&kuaidihao="+rvJson.l_id;
                                }
                            }
                            // else{
                            //     if(document.querySelector("#link1").checked)
                            //     {
                            //         document.querySelector("#myEle > iframe").src=ServerURL1;
                            //     }
                            //     if(document.querySelector("#link2").checked)
                            //     {
                            //         document.querySelector("#myEle > iframe").src=ServerURL2;
                            //     }
                            // }

                        }

                    }
                }

            }
        }
    });
});

function addXMLRequestCallback(callback) {
    var oldSend, i;
    if (XMLHttpRequest.callbacks) {
        XMLHttpRequest.callbacks.push(callback);
    } else {
        XMLHttpRequest.callbacks = [callback];
        oldSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function() {
            for (i = 0; i < XMLHttpRequest.callbacks.length; i++) {
                XMLHttpRequest.callbacks[i](this);
            }
            oldSend.apply(this, arguments);
        }
    }
}
