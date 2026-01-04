// ==UserScript==
// @name         AutoBid
// @namespace    mzblueAT
// @version      0.2
// @description  mz plugin
// @author       bluemz
// @match        https://www.managerzone.com/?p=transfer&sub=players&u=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/476807/AutoBid.user.js
// @updateURL https://update.greasyfork.org/scripts/476807/AutoBid.meta.js
// ==/UserScript==

var autoTransfor = {
    intervalIds : [],
    interval: 60 * 1000,//毫秒
    timeDiff: 5,//分钟
    load: function() {
        console.log('##########')
        var element = document.querySelector('#searchform');

        var div = document.createElement('div');

        var input = document.createElement('input');
        input.id = 'at_amount'
        input.type = 'text';
        input.placeholder = '请输入最高价';

        // 添加CSS样式
        input.style.width = '200px';
        input.style.padding = '5px';
        input.style.margin = '5px';

        // 创建一个按钮元素
        var button = document.createElement('button');
        button.type = 'button';
        button.id = "at_bid_button"
        button.innerHTML = '开始出价';

        // 添加CSS样式
        button.style.color = 'black';
        button.style.fontWeight = "bold";
        button.style.height = "24px";
        button.style.boxShadow = "2px 2px 5px rgba(0, 0, 0, 0.5)";
        button.style.border = "none";
        button.style.backgroundImage = "linear-gradient(to bottom,  #eaeff2 0%,#c6ced2 50%,#a7aeb2 51%,#d2d7dc 94%,#8b8e91 100%)";
        button.style.padding = "3px 10px";
        button.style.textAlign = "center";
        button.style.textDecoration = "none";
        button.style.display = "inline-block";
        button.style.fontSize = "10px";
        button.style.margin = "4px 2px";
        button.style.cursor = "pointer";
        button.style.borderRadius = "5px";
        autoTransfor.setButtonAble(button, false)


        // 添加点击事件处理程序
        button.addEventListener('click', function() {
            autoTransfor.onStartClick();
        });


        // 创建一个按钮元素
        var stopButton = document.createElement('button');
        stopButton.type = 'button';
        stopButton.id = "at_stop_bid"
        stopButton.innerHTML = '结束出价';

        // 添加CSS样式
        stopButton.style.color = 'black';
        stopButton.style.fontWeight = "bold";
        stopButton.style.height = "24px";
        stopButton.style.boxShadow = "2px 2px 5px rgba(0, 0, 0, 0.5)";
        stopButton.style.border = "none";
        stopButton.style.backgroundImage = "linear-gradient(to bottom,  #eaeff2 0%,#c6ced2 50%,#a7aeb2 51%,#d2d7dc 94%,#8b8e91 100%)";
        stopButton.style.padding = "3px 10px";
        stopButton.style.textAlign = "center";
        stopButton.style.textDecoration = "none";
        stopButton.style.display = "inline-block";
        stopButton.style.fontSize = "10px";
        stopButton.style.margin = "4px 2px";
        stopButton.style.cursor = "pointer";
        stopButton.style.borderRadius = "5px";
        autoTransfor.setButtonAble(stopButton, true)


        // 添加点击事件处理程序
        stopButton.addEventListener('click', function() {
            autoTransfor.onStopClick();
        });
        stopButton.enable = false;

        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.justifyContent = 'left';
        div.appendChild(input)
        div.appendChild(button)
        div.appendChild(stopButton)

        // 将按钮插入到页面中
        element.appendChild(div);

    },
    onStopClick: function() {
        autoTransfor.stopBid()
        //alert("已停止出价")
    },
    onStartClick: function() {
        console.log("## onStartClick ##")
        autoTransfor.startBid()
        var input = document.getElementById('at_amount');
        var amount = parseInt(input.value)
        if (!amount) {
            alert("请输入最高金额!")
            autoTransfor.stopBid()
            return;
        }

        if (autoTransfor.checkPage() === false) {
            alert("你访问的页面不正确")
            autoTransfor.stopBid()
            return;
        }

        var amountWan = amount / 10000;
        if (amountWan > 1) {
            alert("最高金额：" + amountWan + "万\n出价时间：" + autoTransfor.getStartBidTime());
        } else {
            alert("最高金额：" + amount + "\n出价时间：" + autoTransfor.getStartBidTime())
        }

        var bid_button = document.getElementById('at_bid_button');
        bid_button.disable = true;

        //var interval = 60 * 1000;
        var playerid = autoTransfor.getPlayerId();
        console.log(playerid)
//        var intervalId = setInterval(autoTransfor.makeBuy, interval);
        var intervalId = setInterval(function() {
            autoTransfor.makeBuy(playerid);
        }, autoTransfor.interval);
        autoTransfor.intervalIds.push(intervalId);

        /*setTimeout(function() {
            clearInterval(intervalId);
        }, interval)*/
    },
    makeBuy: function(playerid) {
        if (autoTransfor.checkPage() === false) {
            console.log("你访问的页面不正确")
            autoTransfor.stopBid()
            return;
        }

        var timeDiff = autoTransfor.getDeadlineDiff();
        if (timeDiff > autoTransfor.timeDiff) {
            console.log("时间没到");
            return;
        }

        var curTeam = autoTransfor.getCurBidTeam();
        var alliance = "『盛世メ名門』";
        if (curTeam.indexOf(alliance) !== -1) {
            console.log("同一个联盟")
            return;
        }

        var input = document.getElementById('at_amount');
        var max_num = parseInt(input.value)

        var newBid = autoTransfor.getCurBidVaule() * 1.05;
        var asking = autoTransfor.getAskingValue();
        var curValue = (newBid === 0)?asking:newBid;
        console.log("当前出价：" + curValue)
        if (curValue > max_num) {
            console.log("出价超标")
            //autoTransfor.stopBid()
            //alert("自动出价结束：超出预算");
            //return;
        }

        var link = document.querySelector('a[href="javascript: buy(' + playerid + ');"]');
        console.log(link)
        link.click()

        setTimeout(function() {
            //不弹出确认框
            var script = document.createElement('script');
            script.textContent = 'function confirm(str){return true;} function alert(str){return true;}';
            (document.head || document.documentElement).appendChild(script);
            script.parentNode.removeChild(script);

            //var buyform = document.querySelector('.buyform')
            //var currency = buyform.querySelector('input#buyform_bid_player_currency')
            //console.log(currency.value.replace(/\s/g, ''))
            //var currency_num = parseInt(currency.value.replace(/\s/g, ''));
            //console.log(currency_num)

            //var input = document.getElementById('at_amount');
            //var max_num = parseInt(input.value)
            var newBidInBuyForm = autoTransfor.getCurBidVauleInBuyForm() * 1.05;
            var askingInBuyForm = autoTransfor.getAskingValueInBuyForm();
            var curValueInBuyForm = (newBidInBuyForm === 0)? askingInBuyForm : newBidInBuyForm;

            console.log("BuyForm:" + curValueInBuyForm);

            console.log(max_num)
            if (curValueInBuyForm > max_num) {
                console.log("出价超标")
                eval("powerboxClose('transfer_buy_form');");
                autoTransfor.stopBid()
                alert("自动出价结束：超出预算");
                return;
            }

            //点击出价按钮
            var bid_button = buyform.querySelector('a#transfer_place_bid_button')
            bid_button.click()

            //如果购买失败，则关闭form
            setTimeout(()=> {
                var error = buyform.querySelector('div.transfer_bid_error_container.form_error_content.clearfix')
                console.log(error)
                if (error) {
                    eval("powerboxClose('transfer_buy_form');");
                }
            }, 5000)

        }, 10 * 1000);
    },
    getDeadlineDiff: function() {
        var date = new Date();
        console.log(date)
        var xpathResult = document.evaluate("/html/body/div[3]/div[3]/div[3]/div[2]/div[2]/div/div[2]/div[5]/div/div/div/div[2]/div/div[1]/table/tbody/tr[3]/td[2]/strong", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        var dateElement = xpathResult.singleNodeValue;
        //console.log(dateElement)
        var deadline = new Date(dateElement.textContent)
        //console.log("#####", deadline)
        var timeDiff = deadline.getTime() - date.getTime();
        var minuteDiff = timeDiff / (1000 * 60)
        console.log("## 距离出价还有:" + minuteDiff)
        return minuteDiff;
    },
    getStartBidTime: function() {
        var xpathResult = document.evaluate("/html/body/div[3]/div[3]/div[3]/div[2]/div[2]/div/div[2]/div[5]/div/div/div/div[2]/div/div[1]/table/tbody/tr[3]/td[2]/strong", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        var dateElement = xpathResult.singleNodeValue;
        var deadline = new Date(dateElement.textContent)
        const start = new Date(deadline.getTime() - 5 * 60 * 1000);
        let year = start.getFullYear();
        let month = String(start.getMonth() + 1).padStart(2, "0");
        let day = String(start.getDate()).padStart(2, "0");
        let hour = String(start.getHours()).padStart(2, "0");
        let minute = String(start.getMinutes()).padStart(2, "0");

        let output = `${year}-${month}-${day} ${hour}:${minute}`;
        return output;
    },
    getPlayerId: function() {
        var thePlayers_0 = document.getElementById('thePlayers_0');
        var dateElement = thePlayers_0.querySelector('.player_id_span');
        return dateElement.textContent;
    },
    getValue: function(xpath) {
        var xpathResult = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        var dateElement = xpathResult.singleNodeValue;
        if (!dateElement) {
            return -1;
        }
        var array = dateElement.textContent.replace(/\s/g, '').match(/(\d+)(\D+)/);
        console.log(array)
        if (array.length !== 3){
            return -2;
        }
        if (array[2] !== "MM"){
            return -3
        }
        return array[1]
    },
    getAskingValue: function(){
        return autoTransfor.getValue('/html/body/div[3]/div[3]/div[3]/div[2]/div[2]/div/div[2]/div[5]/div/div/div/div[2]/div/div[1]/table/tbody/tr[4]/td[2]/strong');
    },
    getAskingValueInBuyForm: function(){
        return autoTransfor.getValue('//*[@id="lightboxContent_transfer_buy_form"]/div/table/tbody/tr[2]/td/table/tbody/tr/td/table/tbody/tr/td/div/div/dl/dd[3]/span[2]');
    },
    getCurBidVaule: function() {
        return autoTransfor.getValue('/html/body/div[3]/div[3]/div[3]/div[2]/div[2]/div/div[2]/div[5]/div/div/div/div[2]/div/div[2]/table/tbody/tr/td[1]/table/tbody/tr/td[2]/strong');
    },
    getCurBidVauleInBuyForm: function() {
        return autoTransfor.getValue('//*[@id="lightboxContent_transfer_buy_form"]/div/table/tbody/tr[2]/td/table/tbody/tr/td/table/tbody/tr/td/div/div/dl/dd[4]/span[2]/text()');
    },
    getCurBidTeam: function() {
        var xpathResult = document.evaluate("/html/body/div[3]/div[3]/div[3]/div[2]/div[2]/div/div[2]/div[5]/div/div/div/div[2]/div/div[2]/table/tbody/tr/td[1]/table/tbody/tr[2]/td/a", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        var dateElement = xpathResult.singleNodeValue;
        if(dateElement){
            return dateElement.textContent;
        } else {
            return "";
        }
    },
    setButtonAble: function(btn, disabled){
        btn.disabled = disabled;
        btn.style.color = (disabled===true)?'#ccc':'black';
        btn.style.backgroundImage = (disabled === false)?
            "linear-gradient(to bottom,  #eaeff2 0%,#c6ced2 50%,#a7aeb2 51%,#d2d7dc 94%,#8b8e91 100%)"
        :"linear-gradient(to bottom,  #a4a4a4 0%,#7d7d7d 5%,#6b6b6b 50%,#474747 51%,#595959 98%,#444444 100%)";
        btn.style.opacity = (disabled === false)? "1": "0.5";
    },
    startBid: function(){
        var start_button = document.getElementById('at_bid_button');
        var stop_button = document.getElementById('at_stop_bid');
        var max_input = document.getElementById('at_amount');
        autoTransfor.setButtonAble(stop_button, false)//enable
        autoTransfor.setButtonAble(start_button, true)//disable
        max_input.disabled = true;
        autoTransfor.changeWebinfo(true)
    },
    stopBid: function(){
        for (var i = 0; i < autoTransfor.intervalIds.length; i++) {
            clearInterval(autoTransfor.intervalIds[i]);
        }
        autoTransfor.intervalIds = [];
        var start_button = document.getElementById('at_bid_button');
        var stop_button = document.getElementById('at_stop_bid');
        var max_input = document.getElementById('at_amount');
        autoTransfor.setButtonAble(stop_button, true)//disable
        autoTransfor.setButtonAble(start_button, false)//enable
        max_input.disabled = false;
        autoTransfor.changeWebinfo(false)
    },
    checkPage: function() {
        var thePlayers_0 = document.getElementById('thePlayers_0');
        var thePlayers_1 = document.getElementById('thePlayers_1');

        if (!thePlayers_0) {
            return false;
        }
        if (thePlayers_1) {
            return false;
        }
        return true;
    },
    changeWebinfo: function(isBiding) {

        var iconUrl = "favicon.ico?v2";
        if (isBiding === true) {
            document.title = "自动出价中";
            iconUrl = "https://www.google.com/s2/favicons?sz=64&domain=openai.com"
        } else {
            document.title = "转会市场 - ManagerZone";
            iconUrl = "favicon.ico?v2";
        }

        // 更换网页图标
        const favicon = document.querySelector("link[rel='shortcut icon']") || document.querySelector("link[rel='icon']");
        if (favicon) {
            favicon.href = iconUrl;
        } else {
            const newFavicon = document.createElement("link");
            newFavicon.rel = "shortcut icon";
            newFavicon.href = iconUrl;
            document.head.appendChild(newFavicon);
        }
    }
};

(function() {
    'use strict';
    autoTransfor.load();
})();

