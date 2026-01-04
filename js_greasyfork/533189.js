// ==UserScript==
// @name          博纳系统辅助工具
// @namespace     http://bonawise.yyhq365.cn/loginController.do?login#
// @version       0.1.3
// @description  清除派工管理的刷新时间, 刷新工单列表, 自动接收工单., 未完成:客服一键派单
// @author       pushOrder
// @include      *onawise.yyhq365.cn/*
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/533189/%E5%8D%9A%E7%BA%B3%E7%B3%BB%E7%BB%9F%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/533189/%E5%8D%9A%E7%BA%B3%E7%B3%BB%E7%BB%9F%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * xhr 请求过滤
     * @param callback
     */
    function addXMLRequestCallback(callback){
        var oldSend, i;
        if( XMLHttpRequest.callbacks ) {
            // we've already overridden send() so just add the callback
            XMLHttpRequest.callbacks.push( callback );
        } else {
            // create a callback queue
            XMLHttpRequest.callbacks = [callback];
            // store the native send()
            oldSend = XMLHttpRequest.prototype.send;
            // override the native send()
            XMLHttpRequest.prototype.send = function(){
                // process the callback queue
                // the xhr instance is passed into each callback but seems pretty useless
                // you can't tell what its destination is or call abort() without an error
                // so only really good for logging that a request has happened
                // I could be wrong, I hope so...
                // EDIT: I suppose you could override the onreadystatechange handler though
                for( i = 0; i < XMLHttpRequest.callbacks.length; i++ ) {
                    XMLHttpRequest.callbacks[i]( this );
                }
                // call the native send()
                oldSend.apply(this, arguments);
            }
        }
    }

    /**
     * maintainListSend页面加载之后, 清除掉对应的时间刷新事件, 并重新查询一次
     */
    function maintainListSend_clearTimeReset(){
        console.log("clearTimeReset")
        $view().removeTask("getTimeSend");
        $view().addTask("autoAccept",autoAccept,1000*60*2);
        var pData=$view().$('FormSendQuery').getFieldOrControl('ButtonQuery').getContainer().getData();
        console.log(pData['recCreateTime@GE']);
        $view().$('FormSendQuery').getFieldOrControl('recCreateTime@GE').setValue('');
        console.log(pData['recCreateTime@LE']);
        $view().$('FormSendQuery').getFieldOrControl('recCreateTime@LE').setValue('');
        lookSendSearch_1();
    }

    /**
     * maintainListSend页面加载之后, 开启自动接单功能, 2分钟内刷新一次
     */
    function autoAccept() {
        var list = [];
        let data = $view().$('TableSendData').datagrid('getRows');
        for (let i = 0; i < data.length; i++) {
            // 待接单状态下直接接单
            if (data[i]['statusCode'] === '03') {
                list.push(data[i].id);
            }
        }
        $.ajax({
            type : 'POST',
            url : 'maintainxController.do?accept',
            data : {id:list.join(",")},
            async : true,
            success : function(data) {
                var d = $.parseJSON(data);
                if (d.success) {
                    tip(d.msg);
                    $view().$('TableSendData').datagrid('reload');
                }
            }
        });
        list = [];
        data = [];
    }

    /**
     * 页面加载之后,去除时间刷新时间
     */


    /**
     * 监听xhr请求, 并触发对应的函数
     */
    addXMLRequestCallback( function( xhr ) {
        xhr.addEventListener("load", function(){
            if ( xhr.readyState == 4 && xhr.status == 200 ) {
                // 监听到
                if ( xhr.responseURL.includes("maintainListSend.view") ) {
                    maintainListSend_clearTimeReset();
                    // clearTimeReset();
                    console.log(xhr);
                    //do something!
                    let response = xhr.responseText;
                    // console.log(response);
                }
                if ( xhr.responseURL.includes("maintainListSend.view") ) {
                    maintainListSend_clearTimeReset();
                    // clearTimeReset();
                    console.log(xhr);
                    //do something!
                    let response = xhr.responseText;
                    // console.log(response);
                }
            }
            let btnPlSend = document.getElementById('btnPlSend').parentElement;
            btnPlSend.innerHTML += "<a id=\"btnPlOrder\" class=\"easyui-linkbutton l-btn\" data-options=\"iconCls:'icon-ok'\"><span class=\"l-btn-left\"><span class=\"l-btn-text icon-ok l-btn-icon-left\">一键派工</span></span></a>"

        });
    });
})();