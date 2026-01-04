// ==UserScript==
// @name         CRM_TOOLS
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  try to take over the world!
// @author       Everest
// @match        http://localhost/xcrm/
// @match        https://i.alibaba.com/index.htm*
// @match        https://login.alibaba.com/*
// @match        https://passport.alibaba.com/mini_login.htm*
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlHttpRequest
// @grant        GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/375837/CRM_TOOLS.user.js
// @updateURL https://update.greasyfork.org/scripts/375837/CRM_TOOLS.meta.js
// ==/UserScript==

let METHOD_CONFIG = {
    CRM_CLOSEDDIALOG: 1,
    CRM_UPDATEALIPARAMS: 2,
    ALI_GETALIPARAMS: 101
};

let CONFIG = {
    AUTO_RENEW: true,
    RENEW_URL: "https://posting.aliexpress.com/wsproduct/manage/ajax/renew_ajax.do",
    CHECKRENEW_URL: "https://posting.aliexpress.com/wsproduct/manage/list.htm?type=online&refreshOffLineTime=3"
};

Date.prototype.Format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

function GM_onMessage(label, callback) {
    GM_addValueChangeListener(label, function(name, old_value, new_value, remote) {
        callback.apply(undefined, [name, old_value, new_value, remote]);//第一个参数为对象,将代替Function类里this对象,第二个参数为数组, 被调用函数参数列表
    });
}

function GM_sendMessage(label) {
    GM_setValue(label, Array.from(arguments).slice(1));
}

function message(name, old_value, new_value, remote){
    try{
        let data = JSON.parse(GM_getValue(name));
        GM_log(data);
        if(data != null && data.type){
            switch (data.type){
                case METHOD_CONFIG.CRM_CLOSEDDIALOG:
                    $(document).dialog("close", "Ali-Login");
                    addLog({time: (new Date()).Format("yyyy-MM-dd hh:mm:ss"), platform: "Alibaba", operation: "登录", detail:"..."});
                    if(CONFIG.AUTO_RENEW){
                        checkRenew();
                    }
                    break;
                    case METHOD_CONFIG.CRM_UPDATEALIPARAMS:
                    setAliParams(data.aliParams);
                    if(getReturnDialogId() == "Ali-Login"){
                        checkKeywordsRank();
                    }
                    break;
                case METHOD_CONFIG.ALI_GETALIPARAMS:

                    break;
                default:
                    break;
            }

        }
    } catch (e) {

    }
}

function setAliParam(){
    let aliParams = {ctoken: "", dmtrack_pageid: "", _csrf_token_: "", _dt_p4p_id_: ""}
    let rex = /ctoken=(.*?)&/;
    let ctoken = rex.exec(document.cookie)[1];
    aliParams.ctoken = ctoken;
    aliParams.dmtrack_pageid = dmtrack_pageid;
    if(typeof(BP) !== "undefined"){
        aliParams._csrf_token_ = window.BP.EXTRA_PARAMS._csrf_token_;
        aliParams._dt_p4p_id_ = window.BP.EXTRA_PARAMS._dt_p4p_id_;
    }
    GM_sendMessage("xcrm_msg", JSON.stringify({type: METHOD_CONFIG.CRM_UPDATEALIPARAMS, aliParams: aliParams, r: Math.random()}));
}

function checkRenew(){
    GM_xmlhttpRequest({ //获取列表
        method : "GET",
        headers: {"Accept": "text/html,application/xhtml+xml,application/xml"},
        url :  CONFIG.CHECKRENEW_URL,
        onload : function (response) {
            //index++;
            //匿名函数封装解决setTimeout传递参数问题

            let timeStr = response.responseText.match(/class="p-time-left"\s*(.*)>\s*(.*).\s*<\/td/gm);
            console.log(timeStr);

            let idStr = response.responseText.match(/data-uid="([0-9]*)"/gm);
             console.log(idStr);
            let nextCheckTime = 0;//s 秒
            let renewIds = [];
            for(let i = 0; i < timeStr.length; i++){
                let timeArr = timeStr[i].match(/>\s*([0-9]*)\s*(.*)\s*</);
                if(timeArr.length >= 3) {
                    if (timeArr[1] <= 10 && timeArr[2] == "分钟"){//有效期在10分钟内自动延长有效期
                        let idArr = idStr[i].match(/"([0-9]*)"/);
                        if(idArr.length >= 2) {
                           renewIds.push(idArr[1]);
                        }
                    } else {
                        let time = timeArr[2] == "小时" ? timeArr[1] * 3600 : timeArr[2] == "分钟" ? timeArr[1] * 60 : 86400;//s
                        nextCheckTime = nextCheckTime == 0 || time < nextCheckTime ? time : nextCheckTime;
                    }

                }

            }

            if(nextCheckTime > 0) {
                setTimeout(checkRenew, nextCheckTime * 1000);
                console.log("setNext" + nextCheckTime);
            }
            console.log(renewIds);
            if(renewIds.length > 0) {
                let umidToken = /umidToken:'(.*)'/.exec(response.responseText);
                let csrfToken = /csrfToken:'(.*)'/.exec(response.responseText);
                autoRenew(renewIds, umidToken[1], csrfToken[1]);
            }

            addLog({time: (new Date()).Format("yyyy-MM-dd hh:mm:ss"), platform: "Aliexpress", operation: "检查产品下架时间", detail:"下次检查时间：" + nextCheckTime + ", 产品id: " + renewIds});

        }
    });
}
function autoRenew(renewIds, umidToken, csrfToken){
    let json = {"productIds":renewIds, "umidToken":umidToken};
    let requestParams = "?_csrf_token=" + csrfToken + "&json=" + JSON.stringify(json);
    GM_xmlhttpRequest({ //获取列表
        method : "GET",
        headers: {"Accept": "application/json"},
        url :  CONFIG.RENEW_URL + encodeURI(requestParams),
        onload : function (response) {
            //console.log(response.responseText);
            let result = JSON.parse(response.responseText);
            if(result.data){
                addLog({time: (new Date()).Format("yyyy-MM-dd hh:mm:ss"), platform: "Aliexpress", operation: "自动延长产品有效期", detail:"totalCount：" + result.data.resultSummary.totalCount + ", failedCount:" + result.data.resultSummary.failedCount + ", errMsg:" + result.data.errMsg});
            }
        }
    });

}

function autoLogin() {
    let hasLogin = document.querySelector("#has-login-submit")
    if (!hasLogin) {
        var ali_settings = GM_getValue('xcrm_settings','{"keywordInterval":"","cycleInterval":"","aliUserName":"","aliUserPassword":""}');
        let settings = JSON.parse(ali_settings);
        document.querySelector("#fm-login-id").value = settings.aliUserName;
        document.querySelector("#fm-login-password").value = settings.aliUserPassword;
        setTimeout("document.querySelector('#fm-login-submit').click();", 2000);
    } else {
        //hasLogin.click();
    }
}

(function() {
    'use strict';


    if(/https:\/\/login.alibaba.com/.test(window.location.href) > 0){
        //alert("xxxz");
    }else if(/http:\/\/localhost\/xcrm\//.test(window.location.href) > 0){
        $(document).dialog({id:'Ali-Login', url:'/xcrm/index.php?s=/Home/Public/alilogin/navTabId/Home', title:'Alibaba Login', width: 900, height: 500});
        GM_onMessage("xcrm_msg", message);
        //alert(GM_getValue("xcrm"));
    } else if (/https:\/\/i.alibaba.com/.test(window.location.href) > 0) {
        setAliParam();
        GM_onMessage("alibaba_msg", message);
        GM_sendMessage("xcrm_msg", JSON.stringify({type: METHOD_CONFIG.CRM_CLOSEDDIALOG, r: Math.random()}));
    } else if(/^https?:\/\/passport.alibaba.com/.test(window.location.href)) {
        autoLogin();
    }
})();