// ==UserScript==
// @name         深圳人社虚假定位
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  深圳技工、职工院校实习打卡 虚拟定位 深圳人社 
// @author       Orange add
// @match        https://hrsspub.sz.gov.cn/jgxxfw/yidong/student/kq/xskq.html
// @icon         https://www.google.com/s2/favicons?domain=sz.gov.cn
// @license MIT
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_getTabs
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_info

// @downloadURL https://update.greasyfork.org/scripts/439851/%E6%B7%B1%E5%9C%B3%E4%BA%BA%E7%A4%BE%E8%99%9A%E5%81%87%E5%AE%9A%E4%BD%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/439851/%E6%B7%B1%E5%9C%B3%E4%BA%BA%E7%A4%BE%E8%99%9A%E5%81%87%E5%AE%9A%E4%BD%8D.meta.js
// ==/UserScript==
unsafeWindow.GM_setValue = GM_setValue;
unsafeWindow.GM_getValue = GM_getValue;
unsafeWindow.GM_addStyle = GM_addStyle;
unsafeWindow.GM_deleteValue = GM_deleteValue;
unsafeWindow.GM_listValues = GM_listValues;
unsafeWindow.GM_addValueChangeListener = GM_addValueChangeListener;
unsafeWindow.GM_removeValueChangeListener = GM_removeValueChangeListener;
unsafeWindow.GM_log = GM_log;
unsafeWindow.GM_getResourceText = GM_getResourceText;
unsafeWindow.GM_getResourceURL = GM_getResourceURL;
unsafeWindow.GM_registerMenuCommand = GM_registerMenuCommand;
unsafeWindow.GM_unregisterMenuCommand = GM_unregisterMenuCommand;
unsafeWindow.GM_openInTab = GM_openInTab;
unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest;
unsafeWindow.GM_download = GM_download;
unsafeWindow.GM_getTab = GM_getTab;
unsafeWindow.GM_saveTab = GM_saveTab;
unsafeWindow.GM_getTabs = GM_getTabs;
unsafeWindow.GM_notification = GM_notification;
unsafeWindow.GM_setClipboard = GM_setClipboard;
unsafeWindow.GM_info = GM_info;
(function() {
    'use strict';
    unsafeWindow.submit = function(){
        containCircle = kqddCircles[0];
        var obj = {};
        obj.cnz022 = sxid;
        obj.cnz058 = xssxglid;
        obj.cne640 = containCircle.center.lat;
        obj.cne641 = containCircle.center.lng;
        obj.cne642 = containCircle.title;
        if(!flag){
            return;
        }
        flag = false;
        $.ajax({
            url:g_domain.baseRequest+'/ydfw/student/addKqjl',
            data:{
                xskqjlxxDTO:JSON.stringify(obj)
            },
            success:function (text) {
                flag = true;
                var res = JSON.parse(text);
                if(res.status==200){
                    alert('虚拟定位打卡成功');
                    window.history.back(-1);
                }else if(res.status==401){
                    window.location.href='/jgxxfw/yidong/login.html';
                }else{
                    alert(res.message);
                }
            },
            error:function (text) {
                flag = true;
            }
        });
    }
        unsafeWindow.dingwei = function(){
        getLocation(function (data) {
            parseLocation(data.lat,data.lng,function (result) {
                var latLng = kqddCircles[0].center;
                setCenter(latLng);
                mark(map,latLng);
                console.log(latLng);
                for (var i =0;i<kqddCircles.length;i++){
                    if(isContain(kqddCircles[i],latLng.lat,latLng.lng)){
                        $('#site').html(kqddCircles[i].title);
                        containCircle = kqddCircles[i];
                        if(!containCircle){
                            dingwei();
                        } else {
                            return;
                        }
                    }
                }
            });
        });//定位
    }
})();