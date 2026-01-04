// ==UserScript==
// @name         ERP订单数据获取辅助
// @namespace    https://www.erp321.com/
// @version      1.3.20240912
// @description  JST ERP订单数据获取辅助
// @author       TC 技术部
// @include      /^https://w{1,3}.erp321.com/app/order/order/list.aspx
// @grant        unsafeWindow
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @require      https://code.jquery.com/jquery-1.8.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/462159/ERP%E8%AE%A2%E5%8D%95%E6%95%B0%E6%8D%AE%E8%8E%B7%E5%8F%96%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/462159/ERP%E8%AE%A2%E5%8D%95%E6%95%B0%E6%8D%AE%E8%8E%B7%E5%8F%96%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==


(function() {
    'use strict';
    GM_notification({
        timeout:5000,
        text:'请等待页面按钮加载完成后，再处理订单数据！'
    });
    console.log("Hello Tampermonkey");


})();
var orderDatas;
window.onload = function(){
    initButtons();
}

function initButtons(){
    initAddGetOrdersButton();//订单数据获取按钮
    initSetOrdersLabelsButton();//添加标签按钮
    initDelOrdersLabelsButton();//删除标签按钮
    initSplitEle();//分割线
    document.querySelector("#_jt_reload").click();
}

//订单数据获取 按钮初始化
function initAddGetOrdersButton(){
    var mainNode=document.querySelector("#_jt_toolbar_left");
    var button="<div style='float:left;margin:2px 0px 0px 2px;'><button id='button_GetOrderData' class='btn_1' type='button' style='padding-left: 3px;padding-right: 3px;order:-1; outline:none;'>获取数据</button></div>";
    $(mainNode).append(button);
    $(mainNode).on("click","#button_GetOrderData",function(){
        if(orderDatas==null||orderDatas=="")
        {
            commonMsg("tips","未能获取到订单数据，请刷新页面重新尝试！");
            GM_setClipboard ("");
        }
        else
        {
            GM_setClipboard (orderDatas);
            commonMsg("tips","订单数据获取成功，数据的本页面显示的数据，已复制到剪切板\n请在「ERP入单软件」中【粘贴数据】进行入单");
        }
    })
}

//订单数据 已入单标签 按钮初始化
function initSetOrdersLabelsButton(){
    var mainNode=document.querySelector("#_jt_toolbar_left");
    var button="<div style='float:left;margin:2px 0px 0px 2px;'><button id='button_SetLabel' class='btn_3' type='button' style='padding-left: 3px;padding-right: 3px;order:-1; outline:none;'>加入单</button></div>";
    $(mainNode).append(button);
    $(mainNode).on("click","#button_SetLabel",function(){
        commonConfirm("add","是否为当前订单添加【已入单】标签？\n正常情况下全选在点击按钮");
    })
}
//删除 已入单标签 按钮初始化
function initDelOrdersLabelsButton(){
    var mainNode=document.querySelector("#_jt_toolbar_left");
    var button="<div style='float:left;margin:2px 0px 0px 2px;'><button id='button_DelLabel' class='btn_2' type='button' style='padding-left: 3px;padding-right: 3px;order:-1; outline:none;'>删</button></div>";
    $(mainNode).append(button);
    $(mainNode).on("click","#button_DelLabel",function(){
        commonConfirm("del","是否为当前订单删除【已入单】标签？\n正常情况下全选在点击按钮");
    })

}
//分割线
function initSplitEle(){
    var mainNode=document.querySelector("#_jt_toolbar_left");
    var splitEle="<li class='_jt_tool_spt' style='float:left;margin:6px 2px 0px 2px;'><span class='_jt_tool_spt_bg'></span></li>";
    $(mainNode).append(splitEle);
}
//confirm
function commonConfirm(flag,msg){
    var cDocument=window.parent.window.parent.document.querySelector("#content > div:nth-child(1) > div > div>iframe").contentDocument;
    if(cDocument==null)
    {
        cDocument= window.parent.window.parent.document.querySelector("#epaasDialogFrame").contentDocument;
    }
    var confirmEle=cDocument.querySelector("#confirm_top");
    confirmEle.querySelector("#confirm_text").innerText=msg;
    confirmEle.setAttribute('style',"display:display");
    $(confirmEle).on("click","#confirm_confirm",function(){
        confirmEle.setAttribute('style',"display:none");
        if(flag=="add")
        {
            autoSetOrDelOrderLabel(flag);
        }else if(flag=="del")
        {
            autoSetOrDelOrderLabel(flag);
        }
    })
    $(confirmEle).on("click","#confirm_close",function(){
        confirmEle.setAttribute('style',"display:none");
    })
}
//alert
function commonMsg(flag,msg)
{
    var cDocument=window.parent.window.parent.document.querySelector("#content > div:nth-child(1) > div > div>iframe").contentDocument;
    if(cDocument==null)
    {
        cDocument= window.parent.window.parent.document.querySelector("#epaasDialogFrame").contentDocument;
    }
    var msgEle=cDocument.querySelector("#msg_top");
    msgEle.querySelector("#msg_text").innerText=msg;
    msgEle.setAttribute('style',"display:display");
    if(flag=="tips")
    {
        $(msgEle).on("click","#msg_close",function(){
            msgEle.setAttribute('style',"display:none");
        })
    }
}
//添加/删除 【已入单】标签
var isByButton;
function autoSetOrDelOrderLabel(flag){
    isByButton=true;
    var checkEles=document.querySelector("#_jt_h_checked");
    if(checkEles!=null)
    {
        var startEle=document.querySelector("#MM_Btn > span._db_txt._db_pic");
        if(startEle!=null)
        {
            startEle.click();
            var setLabelEle=document.querySelector("#mm_setlabel");
            if(setLabelEle!=null)
            {
                setLabelEle.click();
                document.querySelector("#float_top").style.display="none"
            }
        }
    }
    document.querySelector("#float_frame").onload=function()
    {
        if(isByButton)
        {
            var addOrDelTypeEle=null;
            if(flag=="add")
            {
                addOrDelTypeEle=document.querySelector("#float_frame").contentDocument.querySelector("#set_type_add");
            }
            else if(flag=="del")
            {
                addOrDelTypeEle=document.querySelector("#float_frame").contentDocument.querySelector("#set_type_remove")
            }
            if(addOrDelTypeEle!=null)
            {
                addOrDelTypeEle.click();
                var labelEle=document.querySelector("#float_frame").contentDocument.querySelector("#label_-172482526");
                if(labelEle!=null)
                {
                    labelEle.click();
                    var confirmAddEle=document.querySelector("#float_frame").contentDocument.querySelector("#btn1");
                    if(confirmAddEle!=null)
                    {
                        confirmAddEle.click();
                        isByButton=false;
                        document.querySelector("#float_top").removeAttribute('display');
                    }
                }
            }
        }
    }

}

addXMLRequestCallback(function(xhr) {
    xhr.addEventListener("load", function(){
        if(xhr.responseURL.indexOf('LoadDataToJSON')!=-1){
            // orderDatas=null;
            if( xhr.readyState == 4 && xhr.status == 200 ) {
                var responseStr=xhr.response;
                if(responseStr.startsWith("0|"))
                {
                    responseStr=responseStr.substr(2);
                }
                if(JSON.parse(JSON.parse(responseStr).ReturnValue).datas.length>0)
                {
                    orderDatas=xhr.response;
                }
            }
        }
    });
});
function addXMLRequestCallback(callback){
    var oldSend, i;
    if( XMLHttpRequest.callbacks ) {
        XMLHttpRequest.callbacks.push( callback );
    } else {
        XMLHttpRequest.callbacks = [callback];
        oldSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function(){
            for( i = 0; i < XMLHttpRequest.callbacks.length; i++ ) {
                XMLHttpRequest.callbacks[i]( this );
            }
            oldSend.apply(this, arguments);
        }
    }
}