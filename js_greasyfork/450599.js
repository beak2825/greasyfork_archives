// ==UserScript==
// @name         知识星球按日期查询
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  https://api.zsxq.com/v2/groups/{id}/topics?scope=all&count=20&begin_time=2022-09-01T00%3A00%3A00.000%2B0800&end_time=2022-10-01T00%3A00%3A00.000%2B08
// @author       非
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/jquery/latest/jquery.min.js
// @require      https://cdn.jsdelivr.net/momentjs/latest/moment.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/bootstrap-daterangepicker/3.1/daterangepicker.min.js
// @match        https://wx.zsxq.com/dweb2/index/group/*
// @icon         https://wx.zsxq.com/dweb2/assets/images/favicon_32.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450599/%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83%E6%8C%89%E6%97%A5%E6%9C%9F%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/450599/%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83%E6%8C%89%E6%97%A5%E6%9C%9F%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

;(() => {
    let dateRange = [];

    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.href="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css";
    document.head.appendChild(link);

    let navBarElem = document.querySelector('.zsxq-content-datepicker');

    // Remove existing
    navBarElem && navBarElem.remove();

    // navBar button
    navBarElem = document.createElement('div');
    navBarElem.classList.add('zsxq-content-datepicker');
    navBarElem.innerHTML = '<input id="demo" type="text" name="daterange"/>';

    // --- CSS Style ---
    const styleElem = document.createElement('style');
    styleElem.type = 'text/css';
    styleElem.innerHTML = `
.zsxq-content-datepicker {
position: fixed;
top: 1rem;
right: 30rem;
bottom: 3.5rem;
z-index: 1999;
width: 2rem;
height: 2rem;
color: white;
font-size: 1.5rem;
line-height: 2rem;
text-align: center;
cursor: pointer;
}
`;

    document.body.appendChild(navBarElem);
    document.head.appendChild(styleElem);

    function simulateMouseClick(targetNode) {
        function triggerMouseEvent(targetNode, eventType) {
            var clickEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent(eventType, true, true);
            targetNode.dispatchEvent(clickEvent);
        }

        ["mouseover", "mousedown", "mouseup", "click"].forEach(function (eventType) {
            triggerMouseEvent(targetNode, eventType);
        });
    }

    // 重新ajax请求url
    const originOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (_, url) {
        let match = /https\:\/\/api\.zsxq\.com\/v2\/groups\/\d+\/topics\?scope=all\&count=20/.test(url)
        if (dateRange.length == 2 && match) {
            url += `&begin_time=${dateRange[0]}T00%3A00%3A00.000%2B0800&end_time=${dateRange[1]}T00%3A00%3A00.000%2B0800`
            // console.log("url", url)
            dateRange = [];
        }

        originOpen.apply(this, arguments);
    };

    // 日期选择器
    $('#demo').daterangepicker({
        "showDropdowns": true,
        "autoApply": false,
        ranges: {
            '今天': [moment(), moment()],
            '昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            '最近 7 天': [moment().subtract(6, 'days'), moment()],
            '最近 30 天': [moment().subtract(29, 'days'), moment()],
            '当月': [moment().startOf('month'), moment().endOf('month')],
            '上月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        "locale": {
            "format": "YYYY-MM-DD",
            "separator": " 至 ",
            "applyLabel": "查询",
            "cancelLabel": "取消",
            "fromLabel": "From",
            "toLabel": "To",
            "customRangeLabel": "自定义",
            "weekLabel": "W",
            "daysOfWeek": [
                "日",
                "一",
                "二",
                "三",
                "四",
                "五",
                "六"
            ],
            "monthNames": [
                "1月",
                "2月",
                "3月",
                "4月",
                "5月",
                "6月",
                "7月",
                "8月",
                "9月",
                "10月",
                "11月",
                "12月"
            ],
            "firstDay": 1
        },
        "alwaysShowCalendars": true,
        "startDate": moment().subtract(6, 'days').format('YYYY-MM-DD'),
        "endDate": moment().format('YYYY-MM-DD'),
        "opens": "left"
    }, function(start, end, label) {
        let s = start.format('YYYY-MM-DD');
        let e = end.add(1, "days").format('YYYY-MM-DD');
        console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
        dateRange = [s, e];
    });
    $('#demo').on('apply.daterangepicker', function(ev, picker) {
        let search = document.querySelector("body > app-root > app-index > div > app-topic-flow > div > app-month-selector > ul > li:nth-child(1) > div")
        simulateMouseClick(search);
    });
})()
