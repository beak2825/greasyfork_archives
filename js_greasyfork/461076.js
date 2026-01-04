// ==UserScript==
// @name         kibana tools v2
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  Kibana tools v2 about error review.
// @author       simpleyzh
// @match        https://kibana.remarkablefoods.net/*
// @match        https://kibana.foodtruck-uat.com/*
// @match        https://kibana.foodtruck-qa.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461076/kibana%20tools%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/461076/kibana%20tools%20v2.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...

    // 修改原有的条件判断
    if (window.location.href.includes('/action-pattern/')) {
        waitElementLoaded("euiBreadcrumbs euiHeaderBreadcrumbs css-1rf186f-euiHeaderBreadcrumbs", function (elements) {
            handleUrlChange();
        });
    }

    let lastUrl = window.location.href;
    new MutationObserver(() => {
        const url = window.location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            handleUrlChange();
        }
    }).observe(document, { subtree: true, childList: true });


    waitElementLoaded("euiButton css-m9lfq3-euiButtonDisplay-s-defaultMinWidth-base-primary", function (elments) {
        elments[0].click();
    });

    if (window.location.host !== 'kibana.remarkablefoods.net') {
        return;
    }

    const serviceNames = 'app:"apple-pay-integration-service" or app:"customer-service-site" or app:"fulfillment-service" or app:"order-eta-service" or app:"order-number-service" or app:"order-service" or app:"tax-service" or app:"dbw-order-service" or app:"gift-card-order-service" or app:"order-search-service" or app:"payment-service" or app:"stripe-integration-service" or app:"zendesk-integration-service" or app:"forter-integration-service" or app:"oms-task-service" or app:"decagon-integration-service" or app:"shipping-api" or app:"shipping-bo-site" or app:"shipping-scheduler-service" or app:"shipping-service" or app:"shipping-site"';
    const btnStyle = "padding:5px 15px 5px 15px; margin:0 10px 0 10px; font-size:15px;color:white;cursor: pointer;border:solid 1px; border-radius:25px;background-color: #229ffd;";
    const spanStyle = "padding-left: 20px; font-size:15px;color:#a0006b;cursor: pointer;";    

    // load format btn
    waitElementLoaded("embPanel__titleInner", function (elments) {
        addFormatBtn(elments[1]);
        addSearchToday(elments[1]);
        addServices(elments[1]);
        addlink(elments[1])
    }, 2);

    // load link btn and add search link
    waitElementLoaded("euiButton euiButton--primary euiButton--fill euiSuperUpdateButton", function (elments) {
        console.log("find refresh btn")
        elments[0].addEventListener("click", addLinkBtn);
    });

    // load page nav fresh
    waitElementLoaded("euiDataGrid__pagination", function (elments) {
        console.log("find nav btn");
        [].forEach.call(elments, function (el) {
            let func = () => { clearSearch(el); }
            el.getElementsByTagName("nav")[0].addEventListener("click", func);
        })
    });

  
    function formatD(num) {
        return num >= 10 ? num : "0" + num;
    }

    function addlink(el) {
        console.log("run addlink, and el =>" + el);
        appendBtn(el, "link", "link", addLinkBtn);
        addLinkBtn();
    }

    function addLinkBtn() {
        waitElementLoaded("euiTitle", function (els) {
            console.log("find link btn related class");
            for (let i = 0; i < els.length; i++) {
                let func = () => { addSearch(els[i]); }
                if (els[i].getElementsByClassName("link").length == 0) {
                    let para = document.createElement("span");
                    para.setAttribute("class", "link");
                    para.setAttribute("style", spanStyle);
                    para.innerText = "link";
                    para.addEventListener("click", func);
                    els[i].appendChild(para);
                } else {
                    els[i].getElementsByClassName("link")[0].onclick = func;
                }
            }
        });
    }

    function waitElementLoaded(className, func, minSize = 1) {
        var count = 0;
        let timer = setInterval(() => {
            count++;
            if (count > 50) {
                clearInterval(timer);
            }
            let element = document.getElementsByClassName(className);
            if (element.length >= minSize) {
                clearInterval(timer);
                func(element);
            }
        }, 1500);
    }

    function addSearch(el) {
        if (el == undefined) {
            console.log("run addSearch,unknown el");
            return;
        }

        var app_name = getAppName(el);
        var nodes = el.parentNode.getElementsByClassName("euiDataGridRowCell")[0].parentNode.parentNode.childNodes;

        console.log("run addSearch, el => " + el);
        for (var i = 1; i < nodes.length; i = i + 1) {
            let result = nodes[i].getElementsByClassName("tbvChartCellContent")[0].innerText;
            let error_code = nodes[i].getElementsByClassName("tbvChartCellContent")[1].innerText;
            let action = nodes[i].getElementsByClassName("tbvChartCellContent")[2].innerText;

            const ahref = url().replace("{action}", action.replaceAll("\/", "%2F"))
                .replace("{result}", result).replace("{app_name}", app_name).replace("{error_code}", error_code);
            if (nodes[i].getElementsByClassName("search").length == 0) {
                var para = document.createElement("a");
                para.setAttribute("class", "search");
                para.setAttribute("href", ahref);
                para.setAttribute("target", "_blank");
                para.setAttribute("style", spanStyle);
                para.innerText = "search"
                // para.onclick = func;
                nodes[i].getElementsByClassName("tbvChartCellContent")[3].appendChild(para);
            } else {
                console.log("search btn had.")
                nodes[i].getElementsByClassName("search")[0].href = ahref;
            }
        }
    }

    function addFormatBtn(el) {
        console.log("run addFormatBtn, and el =>" + el);
        appendBtn(el, "format", "format", format);
    }

    function addSearchToday(el) {
        console.log("run addSearchToday, and el => " + el);
        appendBtn(el, "search-today", "day", searchToday);
    }

    function addServices(el) {
        console.log("run addCCP, and el => " + el);
        var btn = appendBtn(el, "services", "services", copyText);

        let input = document.createElement("input");
        input.setAttribute("id", "copy-board");
        input.setAttribute("style", "position: absolute;top: 0;left: 0;opacity: 0;z-index: -10;");
        btn.appendChild(input);
    }

    function appendBtn(el, id, text, clickFunc) {
        console.log("appendBtn, el => " + el);
        let btn = document.createElement("button");
        btn.setAttribute("id", id);
        btn.setAttribute("style", btnStyle);
        btn.innerText = text;
        el.appendChild(btn);
        document.getElementById(id).onclick = clickFunc;

        return btn;
    }


    function copyText() {
        let input = document.getElementById("copy-board");
        input.value = serviceNames;
        input.select(); // 选中文本
        document.execCommand("copy"); // 执行浏览器复制命令
        alert("复制成功");
    }

    //
    function searchToday() {
        console.log("run searchToday");
        let local = window.location.href;
        let timeIndex = local.lastIndexOf("time:(");
        if (timeIndex <= 0) {
            if (local.lastIndexOf("error-dashboard") <= 0) {
                alert("wrong page")
                return;
            }
            local = window.location.protocol + "//" + window.location.host + "/app/dashboards#/view/error-dashboard?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-24h,to:now))";
            timeIndex = local.lastIndexOf("time:(")
        }

        let timeRangeStr = timeRanges(new Date());
        console.log("timeRangeStr => " + timeRangeStr);
        console.log("local substring => " + local.substring(timeIndex));
        if (timeRangeStr === local.substring(timeIndex)) {
            return;
        }

        window.location.replace(local.substring(0, timeIndex) + timeRangeStr);
    }

    function timeRanges(date) {
        let lowDay = new Date(date.setDate(date.getDate() - 1));
        let upDay = new Date();
        var curReviewer = dateMap[upDay.getFullYear() + "-" + formatD(upDay.getMonth() + 1) + "-" + formatD(upDay.getDate())];
        // 如果昨天是节假日，则是节假日开始的前一天，否则是昨天
        if (isHoliday(lowDay, curReviewer)) {
            lowDay = findDate(lowDay, curReviewer);
        }
        let time = "time:(from:'{lowDay}T05:00:00.000Z',to:'{upDay}T05:00:00.000Z'))";
        return time.replace("{lowDay}", getDay(lowDay)).replace("{upDay}", getDay(upDay));
    }

    function getDay(date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        return year + "-" + month + "-" + day;
    }

    function findDate(date, curReviewer) {
        let low = new Date(date.setDate(date.getDate() - 1));
        while (isHoliday(low, curReviewer)) {
            low = new Date(date.setDate(date.getDate() - 1))
        }
        return low;
    }

    // 昨天跟今天是同一个人review，则昨天是holiday
    function isHoliday(lowDay, curReviewer) {
        var lowDayReviewer = dateMap[lowDay.getFullYear() + "-" + formatD(lowDay.getMonth() + 1) + "-" + formatD(lowDay.getDate())];
        return lowDayReviewer && curReviewer && lowDayReviewer == curReviewer;
    }

    function format() {
        console.log('run format');
        var elments = document.getElementsByClassName("tbvChart__split");
        for (var i = 0; i < elments.length; i++) {
            elments[i].style.height = "300px";
        }

        for (var j = 0; j < elments.length; j++) {
            elments[j].style.flex = "none";
        }

        var size = 300 * elments.length + 400;
        var els = document.getElementsByClassName("dshLayout--viewing");
        els[0].style.height = size + "px";
        els[0].children[1].style.height = size + "px";
    }

    function clearSearch(el) {
        console.log("run clearSearch")
        let searchs = el.parentNode.getElementsByClassName("search");
        for (let i = searchs.length - 1; i >= 0; i--) {
            searchs[i].parentNode.removeChild(searchs[i]);
        }
    }

    function url() {
        var href = "https://{host}/app/discover#/?_g=(filters:!(),query:(language:kuery,query:''),refreshInterval:(pause:!t,value:0),{time_condition})&_a=(columns:!(action,app,result,error_code),filters:!(),index:trace-pattern,interval:auto,query:(language:kuery,query:'action:%22{action}%22%20and%20app:%22{app_name}%22%20and%20error_code:%22{error_code}%22%20and%20result:{result}'),sort:!(!('@timestamp',desc)))";

        return href.replace('{host}', window.location.host).replace('{time_condition}', time_condition(window.location.href));
    }

    function time_condition(url) {
        var default_time = 'time:(from:now-24h%2Fh,to:now)';

        var start_index = url.indexOf("time:(");
        if (!start_index) return default_time;
        var last_index;
        for (var i = start_index; i < url.length; i++) {
            if (url.charAt(i) == ')') {
                last_index = i;
                break;
            }
        }
        return url.substring(start_index, last_index + 1);
    }

    function getAppName(el) {
        let text = el.innerText;
        let last_index = text.indexOf(":");
        return text.substring(0, last_index);
    }

    function addCustomBreadcrumb() {
        const div = document.querySelector('div.header__breadcrumbsAppendExtension');
        if (!div) return;

        // 创建按钮元素
        const button = document.createElement('button');
        button.id = 'trace-button';
        button.textContent = 'trace';
        button.className = 'eui-button';
        button.style = "margin-left:20px;background-color: rgb(204, 228, 245);color: rgb(0, 97, 166);padding: 2px 10px; border: solid 1px;border-radius: 25px;";

        // 添加点击事件监听器
        button.addEventListener('click', () => {
            const currentUrl = new URL(window.location.href);
            const host = currentUrl.host;
            const queryString = window.location.href.split('?')[1] || '';
            const newUrl = `${currentUrl.protocol}//${host}/app/discover#/doc/trace-pattern/trace-*?${queryString}`;
            window.location.assign(newUrl);
        });

        // 添加按钮到页面
        div.appendChild(button);
    }

    // 添加 URL 变化监听
    function handleUrlChange() {
        const hasActionPattern = window.location.href.includes('/action-pattern/');
        const traceButton = document.getElementById('trace-button');
        const div = document.querySelector('div.header__breadcrumbsAppendExtension');

        if (hasActionPattern) {
            // 如果URL包含 action-pattern 且按钮不存在，则添加按钮
            if (!traceButton && div) {
                addCustomBreadcrumb();
            }
        } else {
            // 如果URL不包含 action-pattern 且按钮存在，则移除按钮
            if (traceButton) {
                traceButton.remove();
            }
        }
    }
})();