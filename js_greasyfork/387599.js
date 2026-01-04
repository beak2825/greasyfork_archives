// ==UserScript==
// @name         Damai - Stage 1
// @namespace    http://tampermonkey.net/
// @version      0.3.2 - Bham Init
// @description  try to take over the world!
// @author       Mr.FireAwayH
// @match        https://detail.damai.cn/item.htm*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387599/Damai%20-%20Stage%201.user.js
// @updateURL https://update.greasyfork.org/scripts/387599/Damai%20-%20Stage%201.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var dates = [];
    var itemId = 0;
    var performId = 0;
    var skuId = 0;

    var clock = function(){
        var clockHTML = "<div id='timedate' style='right: 0px;top: 10%; font: small-caps bold 60px/150% \"Segoe UI\", Frutiger, \"Frutiger Linotype\", \"Dejavu Sans\", \"Helvetica Neue\", Arial, sans-serif;width: 600px;color:#fff;z-index: 99999999999;position: fixed;background: red;'><a id='h'>12</a> : <a id='m'>00</a>: <a id='s'>00</a>: <a id='mi'>000</a> </div>";
        var clockDiv = document.createElement("div");
        document.body.appendChild(clockDiv);
        clockDiv.outerHTML = clockHTML;

        Number.prototype.pad = function(n) {
            for (var r = this.toString(); r.length < n; r = 0 + r);
            return r;
        };

        var updateClock = function() {
            var now = new Date();
            var milli = now.getMilliseconds(),
                sec = now.getSeconds(),
                min = now.getMinutes(),
                hou = now.getHours(),
                mo = now.getMonth(),
                dy = now.getDate(),
                yr = now.getFullYear();
            var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            var tags = ["h", "m", "s", "mi"],
                corr = [hou.pad(2), min.pad(2), sec.pad(2), milli];
            for (var i = 0; i < tags.length; i++)
                document.getElementById(tags[i]).firstChild.nodeValue = corr[i];
        }

        var initClock = function() {
            updateClock();
            window.setInterval(updateClock, 1);
        }

        initClock();
    }

    var autoClick = function(){
        var autoClickHandler = function(){
            var h = window.hour.value;
            var m = window.min.value;
            var s = window.sec.value;
            var time = new Date();
            try{
                time.setHours(h);
                time.setMinutes(m);
                time.setSeconds(s);
                var diff = time - Date.now();
                if(diff < 0){
                    alert("请输入未来的时/分/秒");
                }else{
                    setTimeout(function(){
                        var subFrames = document.querySelectorAll(".subframe");
                        subFrames.forEach(f => {
                            var subEnter = f.contentWindow.hidden;
                            if(subEnter){
                                subEnter.click();
                                subEnter.innerText = "如果没有窗口弹出 请设置允许弹出窗口（地址栏右侧，五角星左边）";
                                subEnter.style.display = "block";
                            }
                        });
                    }, diff);
                    window.autosubmit.innerText = "设置成功";
                }
            }catch(e){
                alert("请输入正确的时/分/秒");
            }
        }


        var autoHTML = "<div id='autoClick' style='width: 150px;font-size: 15px;line-height: 20px;position: absolute;top: 0px;right: 0;'> <p>时<input id='hour' type='text' style='width: 90%'></p> <p>分<input id='min' type='text' style='width: 90%'></p> <p>秒<input id='sec' type='text' style='width: 90%'></p> <p><button id='autosubmit' style='width: 100%; cursor: pointer;'>设置自动提交</button></p> </div>";
        var autoDiv = document.createElement("div");
        window.timedate.appendChild(autoDiv);
        autoDiv.outerHTML = autoHTML;
        window.autosubmit.onclick = autoClickHandler;


    }

    var priceHandler = function(e){
        skuId = e.target.value;
        var node = document.querySelector(".perform__order__box");
        if(window.enter){
            node.removeChild(window.enter);
            node.removeChild(window.hidden);
        }
        if(skuId > -1){
            var selectSeat = document.querySelector(".service").innerText.indexOf("不支持选座") === -1;
            var enterButtonHTML = "";
            var link = "";
            if(selectSeat){
                link = `https://seatsvc.damai.cn/tms/selectSeat?itemId=${itemId}&performId=${performId}&skuId=${skuId}&projectId=${itemId}&spm=a2oeg.project.projectinfo.dbuy`;
                enterButtonHTML = `<a id='enter' href='${link}' target='_blank'>点这里</a><button id='hidden' onclick='window.open("${link}")' style='display:none'></button>`;
            }else{
                var num = 1;
                var numDom = document.querySelector(".cafe-c-input-number-input-wrap input");
                if(numDom){
                    num = numDom.value;
                }
                link = `https://buy.damai.cn/orderConfirm?exParams=%7B%22damai%22%3A%221%22%2C%22channel%22%3A%22damai_app%22%2C%22umpChannel%22%3A%2210002%22%2C%22atomSplit%22%3A%221%22%2C%22serviceVersion%22%3A%221.8.5%22%7D&buyParam=${itemId}_${num}_${skuId}&buyNow=true&spm=a2oeg.project.projectinfo.dbuy`;
                enterButtonHTML = `<a id='enter' href='${link}' target='_blank'>点这里</a><button id='hidden' onclick='window.open("${link}")' style='display:none'></button>`;
            }
            var enterButton = document.createElement("a");
            node.appendChild(enterButton);
            enterButton.outerHTML = enterButtonHTML;
        }else{
            node.removeChild(window.enter);
            node.removeChild(window.hidden);
        }
    }

    var dateHandler = function(e){
        var value = e.target.value;
        var node = document.querySelector(".perform__order__box");
        if(window.prices){
            node.removeChild(window.prices);
        }

        if(window.enter){
            node.removeChild(window.enter);
            node.removeChild(window.hidden);
        }

        if(value > -1){
            var priceSelectHTML = "<select id='prices'><option value='-1'>请选择票价</option>";
            var perform = dates[value];
            itemId = perform.itemId;
            performId = perform.performId;

            perform.skuList.forEach(n => {
                priceSelectHTML += `<option value="${n.skuId}">${n.skuName}</option>`;
            });
            priceSelectHTML += "</select>";
            var priceSelect = document.createElement("select");
            node.appendChild(priceSelect);
            priceSelect.outerHTML = priceSelectHTML;
            window.prices.onchange = priceHandler;
        }else{
            node.removeChild(window.prices);
        }
    }

    var multiMode = function(){
        var num = Number(prompt("输入同时抢票数量（请输入阿拉伯数字）"));
        if(!Number.isNaN(num)){
            var link = `${location.href}&multi=${num}`;
            location.href = link;
        }else{
            multiMode();
        }
    }

    var setup = function(){
        document.body.removeChild(window.hint);
        var data = JSON.parse(window.dataDefault.innerText).performBases;
        dates = data.map(s => s.performs.flat()).flat();

        if(location.search.indexOf("multi") === -1){
            var multiHTML = "<a style='background: red; color: white; cursor: pointer' id='multi'>多开模式 暂仅建议不可选座类使用</a></br>";
            var dateSelectHTML = `${multiHTML}<select id='performs'><option value='-1'>请选择日期</option>`;
            dates.map(s => s.performName).forEach((n, i) => {
                dateSelectHTML += `<option value="${i}">${n}</option>`;
            });
            dateSelectHTML += "</select>";

            var dateSelect = document.createElement("select");
            document.querySelector(".perform__order__box").appendChild(dateSelect);
            dateSelect.outerHTML = dateSelectHTML;
            window.performs.onchange = dateHandler;
            window.multi.onclick = multiMode;

            if(location.search.indexOf("sub") === -1){
                clock();
                autoClick();
            }else{
                window.multi.parentNode.removeChild(window.multi);
                var css = document.createElement("style");
                document.body.appendChild(css);
                css.outerHTML = "<style> .search-header, .cover, .dm-header-wrap{display: none !important; } .cont{padding-left: 0px !important;}</style>";
            }
        }else{
            var link = location.href;
            var arr = link.split("multi=");
            var newLink = arr[0];
            var num = arr[1].split("&")[0];
            var container = document.createElement("div");
            document.body.appendChild(container);
            container.setAttribute("style", "position: absolute; height: 100%; background: wheat; top: 0; width: 100%;");

            var width = (95 / num) + "%";
            var style = `width: ${width}; height: 100%; border: 5px solid red;`;

            for(var i = 0; i < num; i++){
                var sub = document.createElement("iframe");
                sub.className = "subframe";
                sub.src = `${newLink}&sub=${i + 1}`;
                container.appendChild(sub);
                sub.setAttribute("style", style);
            }
            clock();
            autoClick();
        }
    }

    var init = function(){
        var css = document.createElement("style");
        document.body.appendChild(css);
        css.outerHTML = "<style> .sidebar{display: none !important;} </style>";

        var a = document.createElement("div");
        document.body.appendChild(a);
        a.outerHTML = "<div id='hint' style='position: absolute;width: 30%;background: red;top: 40%;text-align: center;left: 40%;color: white;font-size: 40px;'>抢票辅助工作中</div>";
        setTimeout(setup, 5000);
    }

    window.onload = init;
})();