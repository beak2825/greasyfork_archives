// ==UserScript==
// @name                  浴火凤凰京东购物助手
// @name:en               JD.com Shopping Assistant
// @name:zh-CN            浴火凤凰京东购物助手
// @namespace             https://github.com/kingphoenix2000/tampermonkey_scripts
// @supportURL            https://github.com/kingphoenix2000/tampermonkey_scripts
// @version               0.1.3
// @author                浴火凤凰(QQ:307053741,油猴脚本讨论QQ群:194885662)
// @description           在京东商城的商品搜索结果页面商品列表顶部生成一个筛选按钮，点击按钮会生成一系列筛选条件，可以按照店铺、商品标签、商品内容包含的关键字、商品价格、商品评价数等等类别进行筛选。作者：浴火凤凰(QQ:307053741,油猴脚本讨论QQ群:194885662)
// @description:en        Generate a filter button at the top of the goods list on the goods search results page of JD.com. Clicking the button will generate a series of filter conditions, so goods can be filtered according to the categories of shop name, goods label, keywords, goods price, goods comments, etc.作者：浴火凤凰(QQ:307053741,油猴脚本讨论QQ群:194885662)
// @description:zh-CN     在京东商城的商品搜索结果页面商品列表顶部生成一个筛选按钮，点击按钮会生成一系列筛选条件，可以按照店铺、商品标签、商品内容包含的关键字、商品价格、商品评价数等等类别进行筛选。作者：浴火凤凰(QQ:307053741,油猴脚本讨论QQ群:194885662)
// @homepage              https://blog.csdn.net/kingwolf_javascript/
// @include               https://search.jd.com/*
// @include               https://list.jd.com/search*
// @include               https://list.jd.com/list.html?*
// @grant                 none
// @downloadURL https://update.greasyfork.org/scripts/391176/%E6%B5%B4%E7%81%AB%E5%87%A4%E5%87%B0%E4%BA%AC%E4%B8%9C%E8%B4%AD%E7%89%A9%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/391176/%E6%B5%B4%E7%81%AB%E5%87%A4%E5%87%B0%E4%BA%AC%E4%B8%9C%E8%B4%AD%E7%89%A9%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function setJDHelper() {
        function addDiv(div) {
            document.querySelector("#ecommerce_filter").appendChild(div);
        }


        let arr = document.querySelectorAll("#J_goodsList > ul > li.gl-item");
        //结合Ctrl删除项目
        for (let i = 0; i < arr.length; i++) {
            // arr[i].removeEventListener("click");
            arr[i].addEventListener("click", function (e) {
                if (e.ctrlKey === true) {
                    e.preventDefault();
                    this.remove();
                    return false;
                }
                return true;
            }, true);
        }


        function getShopList() {
            let shopListWrapper = {};
            let shopListObj = {};
            let shopNameTimes = {};//统计每个店铺出现的次数
            let shopNodes = document.querySelectorAll("#J_goodsList > ul > li> div.gl-i-wrap div.p-shop > span.J_im_icon > a");
            for (let i = 0; i < shopNodes.length; i++) {
                const shopNode = shopNodes[i];
                shopListObj[shopNode.innerText] = shopNode.href;
                if (!shopNameTimes[shopNode.innerText]) {
                    shopNameTimes[shopNode.innerText] = 1;
                }
                else {
                    shopNameTimes[shopNode.innerText]++;
                }
            }
            shopListWrapper.shopNameTimes = shopNameTimes;
            shopListWrapper.shopListObj = shopListObj;
            // console.log(shopListWrapper);
            return shopListWrapper;
        }
        function getTagList() {
            let tagListWrapper = {};
            let tagListObj = {};
            let tagNameTimes = {};//统计每个店铺出现的次数
            let tagNodes = document.querySelectorAll("#J_goodsList > ul > li> div.gl-i-wrap div.p-icons > i");
            for (let i = 0; i < tagNodes.length; i++) {
                const tagNode = tagNodes[i];
                tagListObj[tagNode.innerText] = tagNode.dataset.tips;
                if (!tagNameTimes[tagNode.innerText]) {
                    tagNameTimes[tagNode.innerText] = 1;
                }
                else {
                    tagNameTimes[tagNode.innerText]++;
                }
            }
            tagListWrapper.tagNameTimes = tagNameTimes;
            tagListWrapper.tagListObj = tagListObj;
            console.log(tagListWrapper);
            return tagListWrapper;
        }
        let operationTypeDiv = document.createElement("div");
        let operationType = "shopName";
        function setTypeSelection(object) {
            let select = document.createElement("select");
            select.innerHTML = '';
            select.style.cssText = "width: 250px;height: 23px;";
            for (const key in object) {
                if (object.hasOwnProperty(key)) {
                    const value = object[key];
                    select.innerHTML += `<option value="${key}">${value}</option>`;
                }
            }
            select.onchange = function () {
                // console.log(this.value);
                operationType = this.value;
                lastViewDiv.style.display = "none";
                lastViewDiv = document.getElementById(operationType + "_div");
                lastViewDiv.style.display = "block";
            }
            operationTypeDiv.appendChild(select);
            addDiv(operationTypeDiv);
        }

        function setShowAllBtn() {
            let input = document.createElement("input");
            input.type = "checkbox";
            input.id = "filterType";
            operationTypeDiv.appendChild(input);
            let label = document.createElement("label");
            label.innerText = "在原来过滤结果基础上进行再次过滤";
            label.htmlFor = "filterType";
            operationTypeDiv.appendChild(label);

            let button = document.createElement("input");
            button.type = "button";
            button.value = "显示全部商品";
            button.style.cssText = "margin-left:15px;";
            button.onclick = function () {
                let items = document.querySelectorAll("#J_goodsList > ul > li.gl-item");
                let len = items.length;
                for (let i = 0; i < len; i++) {
                    let li = items[i];
                    li.style.display = "list-item";
                }
            }
            operationTypeDiv.appendChild(button);
        }
        function setShowBtn() {
            let button = document.createElement("input");
            button.type = "button";
            button.value = "只显示";
            button.style.cssText = "margin-left:15px;";
            button.onclick = function () {
                switch (operationType) {
                    case "shopName":
                        handleShopFilter("list-item", "none");
                        break;
                    case "tagName":
                        handleTagFilter("list-item", "none");
                        break;
                    case "price":
                        handlePriceFilter("list-item", "none");
                        break;
                    case "comment":
                        handleCommentFilter("list-item", "none");
                        break;
                    case "allkeyword":
                        handleAllkeywordFilter("list-item", "none");
                        break;
                    case "anykeyword":
                        handleAnykeywordFilter("list-item", "none");
                        break;
                    default:
                        break;
                }
            }
            operationTypeDiv.appendChild(button);
        }
        function setHideBtn() {
            let button = document.createElement("input");
            button.type = "button";
            button.value = "只隐藏";
            button.style.cssText = "margin-left:15px;";
            button.onclick = function () {
                switch (operationType) {
                    case "shopName":
                        handleShopFilter("none", "list-item");
                        break;
                    case "tagName":
                        handleTagFilter("none", "list-item");
                        break;
                    case "price":
                        handlePriceFilter("none", "list-item");
                        break;
                    case "comment":
                        handleCommentFilter("none", "list-item");
                        break;
                    case "allkeyword":
                        handleAllkeywordFilter("none", "list-item");
                        break;
                    case "anykeyword":
                        handleAnykeywordFilter("none", "list-item");
                        break;
                    default:
                        break;
                }
            }
            operationTypeDiv.appendChild(button);
        }
        function setShopFilter() {
            let shopListWrapper = getShopList();
            let shopListObj = shopListWrapper.shopListObj;
            let shopNameTimes = shopListWrapper.shopNameTimes;
            let div1 = document.createElement("h3");
            div1.innerHTML = "筛选规则：多选情况下，只要包含勾选的多个店铺名字其中之一即被视为符合筛选结果。单选不受影响。";
            div1.style.cssText = "margin:5px;color:red;";
            let div2 = document.createElement("div");
            div2.innerHTML = '';
            div2.id = 'shopName_div';
            let keys = Object.keys(shopListObj);
            let len = keys.length;
            for (let i = 0; i < len; i++) {
                const key = keys[i];
                div2.innerHTML += `<input type="checkbox" name="shoplist" value="${key}" id="${'shoplist_' + i}"/><label for="${'shoplist_' + i}">${key + '(' + shopNameTimes[key] + ')'
                    }</label > `;
            }
            div2.insertBefore(div1, div2.firstChild);
            addDiv(div2);
        }
        function setTagFilter() {
            let tagListWrapper = getTagList();
            let tagListObj = tagListWrapper.tagListObj;
            let tagNameTimes = tagListWrapper.tagNameTimes;
            let div1 = document.createElement("h3");
            div1.innerHTML = "筛选规则：多选情况下，单个商品必须同时包含勾选的多个标签名字才被视为符合筛选结果。单选不受影响。";
            div1.style.cssText = "margin:5px;color:red;";
            let div2 = document.createElement("div");
            div2.innerHTML = '';
            div2.id = 'tagName_div';
            div2.style.cssText = "display:none;"
            let keys = Object.keys(tagListObj);
            let len = keys.length;
            for (let i = 0; i < len; i++) {
                const key = keys[i];
                div2.innerHTML += `<input type="checkbox" name="taglist" value="${key}" id="${'taglist_' + i}"/><label for="${'taglist_' + i}">${key + '(' + tagNameTimes[key] + ')'
                    }</label > `;
            }
            div2.insertBefore(div1, div2.firstChild);
            addDiv(div2);
        }
        function setPriceFilter() {
            let div1 = document.createElement("h3");
            div1.innerHTML = "筛选规则：例子：3xxx表示3000多，35xx表示3500多，5xx表示500多，56x表示560多。";
            div1.style.cssText = "margin:5px;color:red;";
            let div2 = document.createElement("div");
            div2.innerHTML = '<input type="text" placeholder="请输入价格" value="" style="width:100px;height:23px;" />元';
            div2.id = 'price_div';
            div2.style.cssText = "display:none;"
            div2.insertBefore(div1, div2.firstChild);
            addDiv(div2);
        }
        function setCommentFilter() {
            let div1 = document.createElement("h3");
            div1.innerHTML = "筛选规则：例子：3xx表示300多，35x表示350多，5xx表示500多，56x表示560多。";
            div1.style.cssText = "margin:5px;color:red;";
            let div2 = document.createElement("div");
            div2.innerHTML = '<input type="text" placeholder="请输入评价数" value="" style="width:100px;height:23px;" />万+条评价';
            div2.id = 'comment_div';
            div2.style.cssText = "display:none;"
            div2.insertBefore(div1, div2.firstChild);
            addDiv(div2);
        }
        function setAllkeywordFilter() {
            let div1 = document.createElement("h3");
            div1.innerHTML = "筛选规则：最多支持输入5个关键字，以空格隔开。商品必须同时包含输入的所有关键字才算符合筛选结果，单个关键字不受影响。";
            div1.style.cssText = "margin:5px;color:red;";
            let div2 = document.createElement("div");
            div2.innerHTML = '<input type="text" placeholder="请输入多个关键字，以空格隔开" value="" style="width:300px;height:23px;" />';
            div2.id = 'allkeyword_div';
            div2.style.cssText = "display:none;"
            div2.insertBefore(div1, div2.firstChild);
            addDiv(div2);
        }
        function setAnykeywordFilter() {
            let div1 = document.createElement("h3");
            div1.innerHTML = "筛选规则：最多支持输入5个关键字，以空格隔开。商品包含输入的任何一个关键字就算符合筛选结果，单个关键字不受影响。";
            div1.style.cssText = "margin:5px;color:red;";
            let div2 = document.createElement("div");
            div2.innerHTML = '<input type="text" placeholder="请输入多个关键字，以空格隔开" value="" style="width:300px;height:23px;" />';
            div2.id = 'anykeyword_div';
            div2.style.cssText = "display:none;"
            div2.insertBefore(div1, div2.firstChild);
            addDiv(div2);
        }
        function handleShopFilter(display1, display2) {
            let items = document.querySelectorAll("#J_goodsList > ul > li.gl-item");
            let len = items.length;
            let shoplist = document.getElementsByName("shoplist");
            let len2 = shoplist.length;
            let shopNames = [];
            for (let i = 0; i < len2; i++) {
                const shop = shoplist[i];
                if (shop.checked) { shopNames.push(shop.value); }
            }
            // console.log("选择的店铺列表", shopNames);
            let checked = document.querySelector("#filterType").checked;
            for (let i = 0; i < len; i++) {
                let li = items[i];
                let shopNode = li.querySelector("div.p-shop > span > a");
                //判断店铺名字是否相等
                if (shopNode) {
                    let text = shopNode.innerText;
                    if (shopNames.includes(text)) {
                        if (display1 == "list-item") {
                            if (!checked) { li.style.display = display1; }
                        }
                        else {
                            li.style.display = display1;
                        }
                    }
                    else {
                        if (display2 == "list-item") {
                            if (!checked) { li.style.display = display2; }
                        }
                        else {
                            li.style.display = display2;
                        }
                    }

                }
            }
        }
        function handleTagFilter(display1, display2) {
            let items = document.querySelectorAll("#J_goodsList > ul > li.gl-item");
            let len = items.length;
            let taglist = document.getElementsByName("taglist");
            let len2 = taglist.length;
            let tagNames = [];
            for (let i = 0; i < len2; i++) {
                const tag = taglist[i];
                if (tag.checked) { tagNames.push(tag.value.replace(/\(\d+\)/, "")); }
            }
            // console.log("选择的标签列表", tagNames);
            let validNodes = [];
            let invalidNodes = [];
            for (let i = 0; i < len; i++) {
                let li = items[i];
                let tagNode = li.querySelector("div.p-icons");
                //判断店铺名字是否相等
                if (tagNode) {
                    let text = tagNode.innerText;
                    let b = false;//没找到
                    for (let i = 0; i < tagNames.length; i++) {
                        const tag = tagNames[i];
                        if (!text.includes(tag)) { b = true; break; }
                    }
                    if (b == true) { invalidNodes.push(li); }
                    else { validNodes.push(li); }
                }
            }
            let checked = document.querySelector("#filterType").checked;
            for (let i = 0; i < validNodes.length; i++) {
                const li = validNodes[i];
                if (display1 == "list-item") {
                    if (!checked) { li.style.display = display1; }
                }
                else {
                    li.style.display = display1;
                }
            }
            for (let i = 0; i < invalidNodes.length; i++) {
                const li = invalidNodes[i];
                if (display2 == "list-item") {
                    if (!checked) { li.style.display = display2; }
                }
                else {
                    li.style.display = display2;
                }
            }
        }
        function handlePriceFilter(display1, display2) {
            let text = document.querySelector("#price_div > input").value.toLowerCase().trim();
            text = text.replace(/x/g, '\\d');
            let reg = new RegExp('^' + text + '\\.', 'i');

            // console.log(text);
            let items = document.querySelectorAll("#J_goodsList > ul > li.gl-item");
            let len = items.length;
            let validNodes = [];
            let invalidNodes = [];
            for (let i = 0; i < len; i++) {
                let li = items[i];
                let priceNode = li.querySelector("div.p-price > strong > i");
                //判断店铺名字是否相等
                if (priceNode) {
                    let price = priceNode.innerText;
                    if (reg.test(price)) { validNodes.push(li); }
                    else { invalidNodes.push(li); }
                }
            }

            let checked = document.querySelector("#filterType").checked;
            for (let i = 0; i < validNodes.length; i++) {
                const li = validNodes[i];
                if (display1 == "list-item") {
                    if (!checked) { li.style.display = display1; }
                }
                else {
                    li.style.display = display1;
                }
            }
            for (let i = 0; i < invalidNodes.length; i++) {
                const li = invalidNodes[i];
                if (display2 == "list-item") {
                    if (!checked) { li.style.display = display2; }
                }
                else {
                    li.style.display = display2;
                }
            }
        }
        function handleCommentFilter(display1, display2) {
            let text = document.querySelector("#comment_div > input").value.toLowerCase().trim();
            text = text.replace(/x/g, '\\d');
            let reg = new RegExp('^' + text + '(\\.\\d)?万+', 'i');

            // console.log(text);
            let items = document.querySelectorAll("#J_goodsList > ul > li.gl-item");
            let len = items.length;
            let validNodes = [];
            let invalidNodes = [];
            for (let i = 0; i < len; i++) {
                let li = items[i];
                let priceNode = li.querySelector("div.p-commit > strong > a");
                //判断店铺名字是否相等
                if (priceNode) {
                    let price = priceNode.innerText;
                    if (reg.test(price)) { validNodes.push(li); }
                    else { invalidNodes.push(li); }
                }
            }
            let checked = document.querySelector("#filterType").checked;
            for (let i = 0; i < validNodes.length; i++) {
                const li = validNodes[i];
                if (display1 == "list-item") {
                    if (!checked) { li.style.display = display1; }
                }
                else {
                    li.style.display = display1;
                }
            }
            for (let i = 0; i < invalidNodes.length; i++) {
                const li = invalidNodes[i];
                if (display2 == "list-item") {
                    if (!checked) { li.style.display = display2; }
                }
                else {
                    li.style.display = display2;
                }
            }
        }
        function handleAllkeywordFilter(display1, display2) {
            let text = document.querySelector("#allkeyword_div > input").value.toLowerCase().trim();
            let keywords = text.split(/\s+/);
            let items = document.querySelectorAll("#J_goodsList > ul > li.gl-item");
            let len = items.length;
            let validNodes = [];
            let invalidNodes = [];
            for (let i = 0; i < len; i++) {
                let li = items[i];
                let priceNode = li.querySelector("div.p-name");
                //判断店铺名字是否相等
                if (priceNode) {
                    let text = priceNode.innerText.toLowerCase().trim();
                    let b = false;//没找到
                    let len = keywords.length;
                    if (len > 5) { len = 5; }
                    for (let i = 0; i < len; i++) {
                        const keyword = keywords[i];
                        if (!text.includes(keyword)) { b = true; break; }
                    }
                    if (b == true) { invalidNodes.push(li); }
                    else { validNodes.push(li); }
                }
            }
            let checked = document.querySelector("#filterType").checked;
            for (let i = 0; i < validNodes.length; i++) {
                const li = validNodes[i];
                if (display1 == "list-item") {
                    if (!checked) { li.style.display = display1; }
                }
                else {
                    li.style.display = display1;
                }
            }
            for (let i = 0; i < invalidNodes.length; i++) {
                const li = invalidNodes[i];
                if (display2 == "list-item") {
                    if (!checked) { li.style.display = display2; }
                }
                else {
                    li.style.display = display2;
                }
            }
        }
        function handleAnykeywordFilter(display1, display2) {
            let text = document.querySelector("#anykeyword_div > input").value.toLowerCase().trim();
            let keywords = text.split(/\s+/);
            let items = document.querySelectorAll("#J_goodsList > ul > li.gl-item");
            let len = items.length;
            let validNodes = [];
            let invalidNodes = [];
            for (let i = 0; i < len; i++) {
                let li = items[i];
                let priceNode = li.querySelector("div.p-name");
                //判断店铺名字是否相等
                if (priceNode) {
                    let text = priceNode.innerText.toLowerCase().trim();
                    let b = false;//没找到
                    let len = keywords.length;
                    if (len > 5) { len = 5; }
                    for (let i = 0; i < len; i++) {
                        const keyword = keywords[i];
                        if (text.includes(keyword)) { b = true; break; }
                    }
                    if (b == true) { validNodes.push(li); }
                    else { invalidNodes.push(li); }
                }
            }
            let checked = document.querySelector("#filterType").checked;
            for (let i = 0; i < validNodes.length; i++) {
                const li = validNodes[i];
                if (display1 == "list-item") {
                    if (!checked) { li.style.display = display1; }
                }
                else {
                    li.style.display = display1;
                }
            }
            for (let i = 0; i < invalidNodes.length; i++) {
                const li = invalidNodes[i];
                if (display2 == "list-item") {
                    if (!checked) { li.style.display = display2; }
                }
                else {
                    li.style.display = display2;
                }
            }
        }




        let obj = {
            shopName: "1.按照店铺进行筛选",
            tagName: "2.按照商品标签筛选",
            allkeyword: "3.按照商品同时包含所有关键字筛选",
            anykeyword: "4.按照商品包含任何一个关键字筛选",
            price: "5.按照商品价格筛选",
            comment: "6.按照商品评价数筛选",
        };
        setTypeSelection(obj);
        setShowAllBtn();
        setShowBtn();
        setHideBtn();
        setShopFilter();
        setTagFilter();
        setPriceFilter();
        setCommentFilter();
        setAllkeywordFilter();
        setAnykeywordFilter();
        let lastViewDiv = document.getElementById("shopName_div");
    }


    if (location.href.toLowerCase().includes("https://search.jd.com/")
        || location.href.toLowerCase().includes("https://list.jd.com/")) {
        let div = document.createElement("div");
        div.id = "ecommerce_filter_wrapper";
        let ecommerce_filter = document.createElement("div");
        ecommerce_filter.id = "ecommerce_filter";
        ecommerce_filter.style.cssText = "margin-top: 10px;";
        let button1 = document.createElement("input");
        button1.type = "button";
        button1.value = "重新生成筛选系统";
        button1.onclick = function () {
            let items = document.querySelectorAll("#J_goodsList > ul > li.gl-item");
            if (items.length < 60) { alert("请先使用鼠标滚动到页面底部\n等待内容全部加载完毕，然后再点击本按钮！"); return; }
            document.querySelector("#ecommerce_filter").innerHTML = "";
            setJDHelper();
        }
        let span = document.createElement("span");
        span.innerHTML = '<a style="color:red;font-size: 16px;" href="https://greasyfork.org/zh-CN/users/289205-%E6%B5%B4%E7%81%AB%E5%87%A4%E5%87%B0" target="_blank">★★★京东购物助手，作者：浴火凤凰(QQ:307053741)★★★专业接单Chrome浏览器扩展开发定制、油猴脚本开发定制，欢迎来聊★★★</a>';
        div.appendChild(button1);
        div.appendChild(span);
        div.appendChild(ecommerce_filter);
        document.querySelector("#J_filter").appendChild(div);

    }
    // Your code here...
})();
