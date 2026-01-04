// ==UserScript==
// @name         FFXIV huijiwiki 雇员探险查询物品价格
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  增强灰机wiki的“雇员探险/任务一览”页面，实现调用universalis的API查询筹集委托的物品价格
// @author       人工智能
// @license GNU GPLv3
// @match        https://ff14.huijiwiki.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/440390/FFXIV%20huijiwiki%20%E9%9B%87%E5%91%98%E6%8E%A2%E9%99%A9%E6%9F%A5%E8%AF%A2%E7%89%A9%E5%93%81%E4%BB%B7%E6%A0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/440390/FFXIV%20huijiwiki%20%E9%9B%87%E5%91%98%E6%8E%A2%E9%99%A9%E6%9F%A5%E8%AF%A2%E7%89%A9%E5%93%81%E4%BB%B7%E6%A0%BC.meta.js
// ==/UserScript==

function removeElementsByClass(className){
    var elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}

function getServerName(){
    var uni_dc = document.getElementsByClassName("uni-dc")[0];
    var uni_server = document.getElementsByClassName("uni-server")[0];
    var server = uni_dc.value=="0"?uni_server.value:uni_dc.value;
    if(server == ""){
        alert("请选择服务器！");
    }
    return server;
}

function priceAjaxReady(http_request, r, item_num){
    if (http_request.readyState == 4 )
    {
        if(http_request.status == 200){
            // 使用 JSON.parse 解析 JSON 数据
            var jsonObj = JSON.parse(http_request.responseText);

            var cheapest = jsonObj.listings[0].pricePerUnit;
            var worldName = jsonObj.listings[0].worldName;
            r.innerHTML = worldName + "：" + cheapest;

            // 收益试算
            var item_num_arr = item_num.split("/");
            for(var i=0; i<item_num_arr.length; i++){
                item_num_arr[i] = (parseInt(cheapest)*parseInt(item_num_arr[i])).toString();
            }

            var benefit = item_num_arr.join(" / ");
            var benefit_td = document.createElement("td");
            benefit_td.className = "uni-table";
            benefit_td.innerHTML = benefit;
            r.parentNode.appendChild(benefit_td);
        }
    }
}

function historyAjaxReady(http_request, r, item_id, item_num){
    if (http_request.readyState == 4 )
    {
        if(http_request.status == 200){
            // 使用 JSON.parse 解析 JSON 数据
            var jsonObj = JSON.parse(http_request.responseText);

            var history = jsonObj.entries;
            var now = parseInt(Date.now()/1000);
            var numIn24 = 0;
            var currencyIn24 = 0;
            for(var i=0; i<history.length; i++){
                if(now - parseInt(history[i].timestamp) < 86400){
                    numIn24 += parseInt(history[i].quantity);
                    currencyIn24 += parseInt(history[i].quantity)*parseInt(history[i].pricePerUnit);
                }
            }
            if(numIn24 == 0){
                r.innerHTML = "（" + numIn24 + "）";
            }else{
                var average = parseInt(currencyIn24/numIn24);
                r.innerHTML = average + "（" + numIn24 + "）";

                // 收益试算
                var item_num_arr = item_num.split("/");
                for(var j=0; j<item_num_arr.length; j++){
                    item_num_arr[j] = (parseInt(average)*parseInt(item_num_arr[j])).toString();
                }

                var benefit = item_num_arr.join(" / ");
                var benefit_td = document.createElement("td");
                benefit_td.className = "uni-table";
                benefit_td.innerHTML = benefit;
                r.parentNode.appendChild(benefit_td);
            }
        }else{
            var mode = "history";

            var button_price = document.createElement("button");
            button_price.innerHTML = "失败重试";
            button_price.className = "button-price";
            button_price.style = "padding: 2px 10px; margin: 0 4px; background-color: #334b80; color: #fff; border-radius: 5px; border: 1px #3c3c3c solid; font-weight: bold;";
            button_price.setAttribute("data-name", item_id);
            button_price.setAttribute("item-num", item_num);

            if(mode == "cheapest"){
                button_price.addEventListener("click", function(){
                    getPrice(this);
                });
            }else{
                button_price.addEventListener("click", function(){
                    getHistory(this);
                });
            }

            r.innerHTML = "";
            r.appendChild(button_price);
        }
    }
}

function getPrice(button){
    // Universalis地址，可手动修改为其他源
    // var universalis = "https://universalis.diemoe.net";
    var universalis = "https://universalis.app";

    var server = getServerName();
    if(server == ""){
        return;
    }
    var item_id = button.getAttribute("data-name");
    var item_num = button.getAttribute("item-num");
    var api = universalis + "/api/" + server + "/" + item_id;

    // Ajax
    var http_request = new XMLHttpRequest();

    var r = button.parentNode;
    http_request.onreadystatechange = function(){
        priceAjaxReady(http_request, r, item_num);
    }
    http_request.open("GET", api, true);
    r.innerHTML = "加载中...";
    http_request.send();
}

function getHistory(button){
    // Universalis地址，可手动修改为其他源
    var universalis = "https://universalis.app";

    var server = getServerName();
    if(server == ""){
        return;
    }
    var item_id = button.getAttribute("data-name");
    var item_num = button.getAttribute("item-num");
    var api = universalis + "/api/history/" + server + "/" + item_id;

    // Ajax
    var http_request = new XMLHttpRequest();

    var r = button.parentNode;
    http_request.onreadystatechange = function(){
        historyAjaxReady(http_request, r, item_id, item_num);
    }
    http_request.open("GET", api, true);
    r.innerHTML = "加载中...";
    http_request.send();
}

function confirmLazyMode(){
    if(confirm("是否开启懒人模式？")){
        lazyMode();
        document.getElementsByClassName("uni-table uni-table-th")[0].removeEventListener("click", confirmLazyMode);
    }
}

function lazyMode(){
    var buttons = document.getElementsByClassName("button-price");
    for(var i=0; i<buttons.length; i++){
        buttons[i].addEventListener("mouseover", function(){
            this.click();
        });
    }
}

(function() {
    'use strict';

    // 在URL中匹配“雇员探险/任务一览”
    var url = window.location.href;
    var find_url_gytxrwyl = url.search(/wiki\/%E9%9B%87%E5%91%98%E6%8E%A2%E9%99%A9\/%E4%BB%BB%E5%8A%A1%E4%B8%80%E8%A7%88/);
    if(find_url_gytxrwyl > 0){
        //把准备按钮放到筹集委托后
        var cjwt = document.getElementsByClassName("filter-div--ul-style")[0];
        var button_prepare = document.createElement("div");
        button_prepare.id = "button_prepare";
        button_prepare.innerHTML = "询价准备";
        button_prepare.className = "filter-div--category-style";
        button_prepare.style = "cursor: pointer; background-color:#587e39";
        button_prepare.addEventListener("click", function() {
            var mode = "history";
            var find_table = document.getElementsByClassName("wikitable sortable table--dark-pc-even")[0];
            var rows = find_table.rows;

            if(rows[0].cells[1].innerHTML.indexOf("目标物品") != -1){
                removeElementsByClass("uni-table");
                var uni_th = document.createElement("th");
                uni_th.className = "unsortable uni-table uni-table-th";
                uni_th.style = "width: 160px";
                uni_th.innerHTML = mode=="cheapest"?"最低价":"均价<br>（24小时交易数量）";
                uni_th.addEventListener("click", confirmLazyMode);
                rows[0].appendChild(uni_th);
                var uni_cal_th = document.createElement("th");
                uni_cal_th.className = "unsortable uni-table";
                uni_cal_th.innerHTML = "收益试算（未扣税）";
                uni_cal_th.style = "width: 200px";
                rows[0].appendChild(uni_cal_th);
            }else{
                alert("未找到筹集委托列表");
                return;
            }
            for(var i = 1; i<rows.length; i++ ){
                var uni_td = document.createElement("td");
                uni_td.className = "uni-table";
                //uni_td.style = "text-align:right";

                var item_id = rows[i].cells[1].getElementsByClassName("item-link")[0].getAttribute("data-name");
                var item_num = rows[i].cells[2].innerHTML.replace(/\s/g,"");
                var button_price = document.createElement("button");
                button_price.innerHTML = "询价";
                button_price.className = "button-price";
                button_price.style = "padding: 2px 10px; margin: 0 4px; background-color: #334b80; color: #fff; border-radius: 5px; border: 1px #3c3c3c solid; font-weight: bold;";
                button_price.setAttribute("data-name", item_id);
                button_price.setAttribute("item-num", item_num);

                if(mode == "cheapest"){
                    button_price.addEventListener("click", function(){
                        getPrice(this);
                    });
                }else{
                    button_price.addEventListener("click", function(){
                        getHistory(this);
                    });
                }

                rows[i].appendChild(uni_td).appendChild(button_price);
            }
        });
        cjwt.appendChild(document.createElement("li")).appendChild(button_prepare);
        // WorldOrDc
        var dc_select = document.createElement("select");
        dc_select.className = "uni-dc";
        dc_select.style = "margin: 2px; padding: 4px; border-radius: 5px;";
        dc_select.innerHTML = "<option value='0'>手动输入</option>" +
            "<option value='LuXingNiao'>陆行鸟</option>" +
            "<option value='MoGuLi'>莫古力</option>" +
            "<option value='MaoXiaoPang'>猫小胖</option>" +
            "<option value='DouDouChai'>豆豆柴</option>";
        dc_select.addEventListener("change", function() {
            if(this.value == "0"){
                document.getElementsByClassName("uni-server")[0].style.display = "block";
            }else{
                document.getElementsByClassName("uni-server")[0].style.display = "none";
            }
        });

        var server_input = document.createElement("input");
        server_input.className = "uni-server";
        server_input.style = "margin: 2px; padding: 2px; height: 28px; width: 200px; border-radius: 5px;";
        server_input.placeholder = "大区/服务器（英文拼音）";

        cjwt.appendChild(document.createElement("li")).appendChild(dc_select);
        cjwt.appendChild(document.createElement("li")).appendChild(server_input);
    }
})();