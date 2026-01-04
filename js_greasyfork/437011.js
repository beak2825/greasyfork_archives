// ==UserScript==
// @name         kibana tools inactive
// @namespace    http://tampermonkey.net/
// @version      1.35
// @description  Kibana tools about error review.
// @author       simpleyzh
// @match        https://*.elastic-cloud.com:*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437011/kibana%20tools%20inactive.user.js
// @updateURL https://update.greasyfork.org/scripts/437011/kibana%20tools%20inactive.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...

    const serviceNames = 'NOT error_code: UNAUTHORIZED and app:"customer-service-site" OR app:"order-service" OR app:"customer-service" OR app:"zendesk-integration-service" OR app:"order-issue-service" OR app:"order-search-service" OR app:"fulfillment-service" or app:"payment-service" or app:"tax-service" or app:"stripe-integration-service" or app:"apple-pay-integration-service"';
    const btnStyle = "padding:5px 15px 5px 15px; margin:0 10px 0 10px; font-size:15px;color:white;cursor: pointer;border:solid 1px; border-radius:25px;background-color: #229ffd;";
    const spanStyle = "padding-left: 20px; font-size:15px;color:#a0006b;cursor: pointer;";
    const reviewers = ["ebin", "alex", "tkank", "simple"];
    const firstReviewerIndex = 0; // who is the 2023-01-01
    const dateMap = eval("(" + '{"2023-01-01":true,"2023-01-02":true,"2023-01-03":false,"2023-01-04":false,"2023-01-05":false,"2023-01-06":false,"2023-01-07":true,"2023-01-08":true,"2023-01-09":false,"2023-01-10":false,"2023-01-11":false,"2023-01-12":false,"2023-01-13":false,"2023-01-14":true,"2023-01-15":true,"2023-01-16":false,"2023-01-17":false,"2023-01-18":false,"2023-01-19":false,"2023-01-20":true,"2023-01-21":true,"2023-01-22":true,"2023-01-23":true,"2023-01-24":true,"2023-01-25":true,"2023-01-26":true,"2023-01-27":true,"2023-01-28":false,"2023-01-29":false,"2023-01-30":false,"2023-01-31":false,"2023-02-01":false,"2023-02-02":false,"2023-02-03":false,"2023-02-04":true,"2023-02-05":true,"2023-02-06":false,"2023-02-07":false,"2023-02-08":false,"2023-02-09":false,"2023-02-10":false,"2023-02-11":true,"2023-02-12":true,"2023-02-13":false,"2023-02-14":false,"2023-02-15":false,"2023-02-16":false,"2023-02-17":false,"2023-02-18":true,"2023-02-19":true,"2023-02-20":false,"2023-02-21":false,"2023-02-22":false,"2023-02-23":false,"2023-02-24":false,"2023-02-25":true,"2023-02-26":true,"2023-02-27":false,"2023-02-28":false,"2023-03-01":false,"2023-03-02":false,"2023-03-03":false,"2023-03-04":true,"2023-03-05":true,"2023-03-06":false,"2023-03-07":false,"2023-03-08":false,"2023-03-09":false,"2023-03-10":false,"2023-03-11":true,"2023-03-12":true,"2023-03-13":false,"2023-03-14":false,"2023-03-15":false,"2023-03-16":false,"2023-03-17":false,"2023-03-18":true,"2023-03-19":true,"2023-03-20":false,"2023-03-21":false,"2023-03-22":false,"2023-03-23":false,"2023-03-24":false,"2023-03-25":true,"2023-03-26":true,"2023-03-27":false,"2023-03-28":false,"2023-03-29":false,"2023-03-30":false,"2023-03-31":false,"2023-04-01":true,"2023-04-02":true,"2023-04-03":false,"2023-04-04":false,"2023-04-05":true,"2023-04-06":false,"2023-04-07":false,"2023-04-08":true,"2023-04-09":true,"2023-04-10":false,"2023-04-11":false,"2023-04-12":false,"2023-04-13":false,"2023-04-14":false,"2023-04-15":true,"2023-04-16":true,"2023-04-17":false,"2023-04-18":false,"2023-04-19":false,"2023-04-20":false,"2023-04-21":false,"2023-04-22":true,"2023-04-23":false,"2023-04-24":false,"2023-04-25":false,"2023-04-26":false,"2023-04-27":false,"2023-04-28":false,"2023-04-29":true,"2023-04-30":true,"2023-05-01":true,"2023-05-02":true,"2023-05-03":true,"2023-05-04":false,"2023-05-05":false,"2023-05-06":false,"2023-05-07":true,"2023-05-08":false,"2023-05-09":false,"2023-05-10":false,"2023-05-11":false,"2023-05-12":false,"2023-05-13":true,"2023-05-14":true,"2023-05-15":false,"2023-05-16":false,"2023-05-17":false,"2023-05-18":false,"2023-05-19":false,"2023-05-20":true,"2023-05-21":true,"2023-05-22":false,"2023-05-23":false,"2023-05-24":false,"2023-05-25":false,"2023-05-26":false,"2023-05-27":true,"2023-05-28":true,"2023-05-29":false,"2023-05-30":false,"2023-05-31":false,"2023-06-01":false,"2023-06-02":false,"2023-06-03":true,"2023-06-04":true,"2023-06-05":false,"2023-06-06":false,"2023-06-07":false,"2023-06-08":false,"2023-06-09":false,"2023-06-10":true,"2023-06-11":true,"2023-06-12":false,"2023-06-13":false,"2023-06-14":false,"2023-06-15":false,"2023-06-16":false,"2023-06-17":true,"2023-06-18":true,"2023-06-19":false,"2023-06-20":false,"2023-06-21":false,"2023-06-22":true,"2023-06-23":true,"2023-06-24":true,"2023-06-25":false,"2023-06-26":false,"2023-06-27":false,"2023-06-28":false,"2023-06-29":false,"2023-06-30":false,"2023-07-01":true,"2023-07-02":true,"2023-07-03":false,"2023-07-04":false,"2023-07-05":false,"2023-07-06":false,"2023-07-07":false,"2023-07-08":true,"2023-07-09":true,"2023-07-10":false,"2023-07-11":false,"2023-07-12":false,"2023-07-13":false,"2023-07-14":false,"2023-07-15":true,"2023-07-16":true,"2023-07-17":false,"2023-07-18":false,"2023-07-19":false,"2023-07-20":false,"2023-07-21":false,"2023-07-22":true,"2023-07-23":true,"2023-07-24":false,"2023-07-25":false,"2023-07-26":false,"2023-07-27":false,"2023-07-28":false,"2023-07-29":true,"2023-07-30":true,"2023-07-31":false,"2023-08-01":false,"2023-08-02":false,"2023-08-03":false,"2023-08-04":false,"2023-08-05":true,"2023-08-06":true,"2023-08-07":false,"2023-08-08":false,"2023-08-09":false,"2023-08-10":false,"2023-08-11":false,"2023-08-12":true,"2023-08-13":true,"2023-08-14":false,"2023-08-15":false,"2023-08-16":false,"2023-08-17":false,"2023-08-18":false,"2023-08-19":true,"2023-08-20":true,"2023-08-21":false,"2023-08-22":false,"2023-08-23":false,"2023-08-24":false,"2023-08-25":false,"2023-08-26":true,"2023-08-27":true,"2023-08-28":false,"2023-08-29":false,"2023-08-30":false,"2023-08-31":false,"2023-09-01":false,"2023-09-02":true,"2023-09-03":true,"2023-09-04":false,"2023-09-05":false,"2023-09-06":false,"2023-09-07":false,"2023-09-08":false,"2023-09-09":true,"2023-09-10":true,"2023-09-11":false,"2023-09-12":false,"2023-09-13":false,"2023-09-14":false,"2023-09-15":false,"2023-09-16":true,"2023-09-17":true,"2023-09-18":false,"2023-09-19":false,"2023-09-20":false,"2023-09-21":false,"2023-09-22":false,"2023-09-23":true,"2023-09-24":true,"2023-09-25":false,"2023-09-26":false,"2023-09-27":false,"2023-09-28":false,"2023-09-29":true,"2023-09-30":true,"2023-10-01":true,"2023-10-02":true,"2023-10-03":true,"2023-10-04":true,"2023-10-05":true,"2023-10-06":true,"2023-10-07":false,"2023-10-08":false,"2023-10-09":false,"2023-10-10":false,"2023-10-11":false,"2023-10-12":false,"2023-10-13":false,"2023-10-14":true,"2023-10-15":true,"2023-10-16":false,"2023-10-17":false,"2023-10-18":false,"2023-10-19":false,"2023-10-20":false,"2023-10-21":true,"2023-10-22":true,"2023-10-23":false,"2023-10-24":false,"2023-10-25":false,"2023-10-26":false,"2023-10-27":false,"2023-10-28":true,"2023-10-29":true,"2023-10-30":false,"2023-10-31":false,"2023-11-01":false,"2023-11-02":false,"2023-11-03":false,"2023-11-04":true,"2023-11-05":true,"2023-11-06":false,"2023-11-07":false,"2023-11-08":false,"2023-11-09":false,"2023-11-10":false,"2023-11-11":true,"2023-11-12":true,"2023-11-13":false,"2023-11-14":false,"2023-11-15":false,"2023-11-16":false,"2023-11-17":false,"2023-11-18":true,"2023-11-19":true,"2023-11-20":false,"2023-11-21":false,"2023-11-22":false,"2023-11-23":false,"2023-11-24":false,"2023-11-25":true,"2023-11-26":true,"2023-11-27":false,"2023-11-28":false,"2023-11-29":false,"2023-11-30":false,"2023-12-01":false,"2023-12-02":true,"2023-12-03":true,"2023-12-04":false,"2023-12-05":false,"2023-12-06":false,"2023-12-07":false,"2023-12-08":false,"2023-12-09":true,"2023-12-10":true,"2023-12-11":false,"2023-12-12":false,"2023-12-13":false,"2023-12-14":false,"2023-12-15":false,"2023-12-16":true,"2023-12-17":true,"2023-12-18":false,"2023-12-19":false,"2023-12-20":false,"2023-12-21":false,"2023-12-22":false,"2023-12-23":true,"2023-12-24":true,"2023-12-25":false,"2023-12-26":false,"2023-12-27":false,"2023-12-28":false,"2023-12-29":false,"2023-12-30":true,"2023-12-31":true}' + ")");

    // load format btn
    waitElementLoaded("embPanel__titleInner", function (elments) {
        addTodayReviewer(elments[1]);
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
            // waitElementLoaded("euiPagination", function (navs) {
            //     navs[0].addEventListener("click", func)
            // })
        })
    });

    function addTodayReviewer(el) {
        console.log("run addTodayReviewer, and el =>" + el);
        let para = document.createElement("span");
        para.setAttribute("style", "padding-left: 20px; font-size:20px;color:#a0006b;");
        para.innerText = "reviewer => " + reviewer(new Date())
        el.appendChild(para);
    }

    function reviewer(now) {
        if (now.getMonth() == 0 && now.getDate() == 1) return reviewers[firstReviewerIndex]
        let index = firstReviewerIndex;
        let year = 2023;
        for (let month = 1; month <= 12; month++) {
            for (let day = 1; day <= new Date(year, month, 0).getDate(); day++) {
                if (day == 1 && month == 1) continue;
                let key = year + "-" + formatD(month) + "-" + formatD(day);
                let date = new Date(new Date(key).setDate(new Date(key).getDate() - 1))
                var holiday = dateMap[year + "-" + formatD(date.getMonth() + 1) + "-" + formatD(date.getDate())];
                if (holiday != undefined && !holiday) {
                    index++
                }
                // 剪枝
                if (now.getMonth() + 1 == month && now.getDate() == day) {
                    return reviewers[index % reviewers.length]
                }
            }
        }
    }

    function formatD(num) {
        return num >= 10 ? num : "0" + num;
    }

    function addlink(el) {
        console.log("run addlink, and el =>" + el);
        appendBtn(el, "link", "link", addLinkBtn);

        // let para = document.createElement("span");
        // para.setAttribute("id", "link");
        // para.setAttribute("style", btnStyle);
        // para.innerText = "link"
        // el.appendChild(para);
        // document.getElementById("link").onclick = addLinkBtn;

        addLinkBtn();
    }

    function addLinkBtn() {
        waitElementLoaded("euiTitle--xsmall", function (els) {
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
        var nodes = el.parentNode.getElementsByClassName("euiDataGridRowCell")[0].parentNode.children;

        console.log("run addSearch, el => " + el);
        for (var i = 3; i < nodes.length; i = i + 4) {
            let action = nodes[i].getElementsByClassName("tbvChartCellContent")[0].innerText;
            let result = nodes[i - 2].getElementsByClassName("tbvChartCellContent")[0].innerText;
            let error_code = nodes[i - 1].getElementsByClassName("tbvChartCellContent")[0].innerText;

            // var func = () => { search(action, result) };
            const ahref = url().replace("{action}", action.replaceAll("\/", "%2F"))
                .replace("{result}", result).replace("{app_name}", app_name).replace("{error_code}", error_code);
            if (nodes[i + 1].getElementsByClassName("search").length == 0) {
                var para = document.createElement("a");
                para.setAttribute("class", "search");
                para.setAttribute("href", ahref);
                para.setAttribute("target", "_blank");
                para.setAttribute("style", spanStyle);
                para.innerText = "search"
                // para.onclick = func;
                nodes[i + 1].appendChild(para);
            } else {
                console.log("search btn had.")
                nodes[i + 1].getElementsByClassName("search")[0].href = ahref;
            }
        }
    }

    function addFormatBtn(el) {
        console.log("run addFormatBtn, and el =>" + el);
        appendBtn(el, "format", "format", format);

        // let para = document.createElement("span");
        // para.setAttribute("id", "format");
        // para.setAttribute("style", btnStyle);
        // para.innerText = "format"
        // el.appendChild(para);
        // document.getElementById("format").onclick = format;
    }

    function addSearchToday(el) {
        console.log("run addSearchToday, and el => " + el);
        appendBtn(el, "search-today", "day", searchToday);

        // let para = document.createElement("span");
        // para.setAttribute("id", "search-today");
        // para.setAttribute("style", btnStyle);
        // para.innerText = "day"
        // el.appendChild(para);
        // document.getElementById("search-today").onclick = searchToday;
    }

    function addServices(el) {
        console.log("run addCCP, and el => " + el);
        // let para = document.createElement("span");
        // para.setAttribute("id", "services");
        // para.setAttribute("style", btnStyle);
        // para.innerText = "services"
        // el.appendChild(para);
        // document.getElementById("services").onclick = copyText;

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
            alert("time not found in the url.");
            return;
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
        // 如果昨天是节假日，则是节假日开始的前一天，否则是昨天
        if (isHoliday(lowDay)) {
            lowDay = findDate(lowDay);
        }
        let time = "time:(from:'{lowDay}T02:00:00.000Z',to:'{upDay}T02:00:00.000Z'))";
        return time.replace("{lowDay}", getDay(lowDay)).replace("{upDay}", getDay(upDay));
    }

    function getDay(date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        return year + "-" + month + "-" + day;
    }

    function findDate(date) {
        let low = new Date(date.setDate(date.getDate() - 1));
        while (isHoliday(low)) {
            low = new Date(date.setDate(date.getDate() - 1))
        }
        return low;
    }

    function isHoliday(date) {
        return dateMap[date.getFullYear() + "-" + formatD(date.getMonth() + 1) + "-" + formatD(date.getDate())];
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
})();