// ==UserScript==
// @name         获取公众号卡号
// @namespace    http://tampermonkey.net/
// @version      2022.05.15
// @description  获取公众号卡号信息
// @author       Bendon
// @match        https://mp.weixin.qq.com/merchant/membercardmgr?*
// @icon         https://res.wx.qq.com/a/wx_fed/assets/res/NTI4MWU5.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/435907/%E8%8E%B7%E5%8F%96%E5%85%AC%E4%BC%97%E5%8F%B7%E5%8D%A1%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/435907/%E8%8E%B7%E5%8F%96%E5%85%AC%E4%BC%97%E5%8F%B7%E5%8D%A1%E5%8F%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //alert(0);

    window.addEventListener('load', function () {
        var keyCount = "CardCount";
        var key = "CardData";

        if(document.body.innerText.indexOf("没有符合条件的会员，请确认后重新搜索")>-1){
            var noMobileCount = 0
            if(parseInt(localStorage.getItem(keyCount))>0){
                jsArray = JSON.parse(localStorage.getItem(key));
                var newArray = []
                jsArray.forEach(function(item, index, arr) {
                    if(item["mobile"]) {
                        newArray.push(item);
                    }
                    else{
                        noMobileCount++;
                    }
                });
                localStorage.setItem(key+"-nomobile",JSON.stringify(newArray));
            }
            alert("处理完成，共获取"+localStorage.getItem(keyCount) +"条数据,其中无mobile数据："+noMobileCount+"条");
            return;
        }
        var count = 0;
        var countStr = localStorage.getItem(keyCount);
        if(countStr){
          count = parseInt(countStr);
        }
        if(count==0){
          localStorage.removeItem(key);
        }

        var localData = localStorage.getItem(key);
        var jsArray = [];
        if(localData){
            jsArray = JSON.parse(localData);
        }
        if(wx.cgiData.userlist.datas){
           jsArray = jsArray.concat(wx.cgiData.userlist.datas);
           var len = wx.cgiData.userlist.datas.length;
           count += len;
           console.info("wx.cgiData.userlist.datas.length:+"+len);
           localStorage.setItem(keyCount,count);
        }
        localData = JSON.stringify(jsArray);
        localStorage.setItem(key,localData);

        document.getElementById("js_next_page").click();
    });
})();