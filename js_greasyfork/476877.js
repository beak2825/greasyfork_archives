// ==UserScript==
// @name         Mobile Confluence Tools
// @namespace    http://www.akuvox.com/
// @version      0.6
// @description  confluence auto fill
// @author       bink
// @match        http://192.168.10.2:83/pages/*
// @grant        none
// @license      bink
// @downloadURL https://update.greasyfork.org/scripts/476877/Mobile%20Confluence%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/476877/Mobile%20Confluence%20Tools.meta.js
// ==/UserScript==

(function () {

    String.prototype.replaceAll = function (s1, s2) {
        var value;
        value = this.replace(s1, s2);
        for (var i = 0; i < 25; i++) {
            value = value.replace(s1, s2);
        }
        return value;
    }

    /*库方法*/
    HTMLElement.prototype.appendHTML = function (html) {
        var divTemp = document.createElement("div"), nodes = null
            , fragment = document.createDocumentFragment();
        divTemp.innerHTML = html;
        nodes = divTemp.childNodes;
        for (var i = 0, length = nodes.length; i < length; i += 1) {
            fragment.appendChild(nodes[i].cloneNode(true));
        }
        this.appendChild(fragment);
        nodes = null;
        fragment = null;
    };

    //主函数开始
    //创建button
    var result = createButton();
    function getSaturdayDates() {
        const today = new Date();
        const currentDayOfWeek = today.getDay(); // 获取当前星期几 (0 表示星期天, 1 表示星期一, 以此类推)
        // 计算上周六的日期
        const lastSaturday = new Date(today);
        lastSaturday.setDate(today.getDate() - currentDayOfWeek - 1); // 当前日期减去当前星期几的天数再减去一天，即为上周六的日期

        // 计算本周六的日期
        const thisSaturday = new Date(today);
        thisSaturday.setDate(today.getDate() + (6 - currentDayOfWeek)); // 当前日期加上距离本周六的天数，即为本周六的日期

        // 计算下周六的日期
        const nextSaturday = new Date(today);
        nextSaturday.setDate(today.getDate() + (6 - currentDayOfWeek) + 7); // 当前日期加上距离下周六的天数，即为下周六的日期

        // 格式化日期为 YYYY-MM-DD
        const formatDate = date => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        return {
            lastSaturday: formatDate(lastSaturday),
            thisSaturday: formatDate(thisSaturday),
            nextSaturday: formatDate(nextSaturday)
        };
    }

    function getMonthRanges() {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1; // 月份从0开始，需要加1
        // 计算本月第一天
        const firstDayOfCurrentMonth = new Date(currentYear, currentMonth - 1, 1);
        // 计算本月最后一天
        const lastDayOfCurrentMonth = new Date(currentYear, currentMonth, 0);
        // 计算下月第一天
        const firstDayOfNextMonth = new Date(currentYear, currentMonth, 1);
        // 计算下月最后一天
        const lastDayOfNextMonth = new Date(currentYear, currentMonth + 1, 0);
        // 格式化日期为 YYYY-MM-DD
        const formatDate = date => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };
        return {
          firstDayOfCurrentMonth: formatDate(firstDayOfCurrentMonth),
          lastDayOfCurrentMonth: formatDate(lastDayOfCurrentMonth),
          firstDayOfNextMonth: formatDate(firstDayOfNextMonth),
          lastDayOfNextMonth: formatDate(lastDayOfNextMonth)
        };
      }

      function formatDateToYearMonth(inputDate) {
        const date = new Date(inputDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${year}${month}`;
      }

      function formatDateToYearMonthDay(inputDate) {
        const date = new Date(inputDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
      }

    //自己的方法
    //flag：0本周、1下周、2下月
    function autoCompeleteDailyData(flag) {

        //获得人名，userid
        var userInfo = document.getElementById("user-menu-link");
        var userId = userInfo.getAttribute("data-username");
        var userName = userInfo.getAttribute("title");
        const {
            lastSaturday,
            thisSaturday,
            nextSaturday
        } = getSaturdayDates();

        //填入标题
        var title = document.getElementById("content-title-div").getElementsByTagName("input")[0];
        //填入表格数据
        for (var i = 0; i < document.getElementById("wysiwygTextarea_ifr").contentDocument.getElementsByClassName("editor-inline-macro").length; i++) {
            var data = document.getElementById("wysiwygTextarea_ifr").contentDocument.getElementsByClassName("editor-inline-macro")[i].getAttribute("data-macro-parameters");
            console.log("chenmj", data);
            //替换 userid
            data = data.replaceAll("minjie.chen", userId);
            //替换开始日期
            if(flag == 0) {
                //本周
                data = data.replace(/"Target end" > (\d{4}-\d{2}-\d{2}) AND "Target end" <\\= (\d{4}-\d{2}-\d{2})/g, `"Target end" > ${lastSaturday} AND "Target end" <\\= ${thisSaturday}`);
                title.value = userName + " - " + formatDateToYearMonthDay(lastSaturday) + "~" + formatDateToYearMonthDay(thisSaturday);
            } else if (flag == 1) {
                //下周
                data = data.replace(/"Target end" > (\d{4}-\d{2}-\d{2}) AND "Target end" <\\= (\d{4}-\d{2}-\d{2})/g, `"Target end" > ${thisSaturday} AND "Target end" <\\= ${nextSaturday}`);
                title.value = userName + " - " + formatDateToYearMonthDay(thisSaturday) + "~" + formatDateToYearMonthDay(nextSaturday);
            }
            console.log("final data = ", data);
            document.getElementById("wysiwygTextarea_ifr").contentDocument.getElementsByClassName("editor-inline-macro")[i].setAttribute("data-macro-parameters", data);
        }
    }

    function autoCompeleteMonthData(flag) {
        //获得人名，userid
        var userInfo = document.getElementById("user-menu-link");
        var userId = userInfo.getAttribute("data-username");
        var userName = userInfo.getAttribute("title");
        const {
            firstDayOfCurrentMonth,
            lastDayOfCurrentMonth,
            firstDayOfNextMonth,
            lastDayOfNextMonth
        } = getMonthRanges();
        //填入标题
        var title = document.getElementById("content-title-div").getElementsByTagName("input")[0];

        //填入表格数据
        for (var i = 0; i < document.getElementById("wysiwygTextarea_ifr").contentDocument.getElementsByClassName("editor-inline-macro").length; i++) {
            var data = document.getElementById("wysiwygTextarea_ifr").contentDocument.getElementsByClassName("editor-inline-macro")[i].getAttribute("data-macro-parameters");
            console.log("chenmj", data);
            if (null == data) {
                continue;
            }
            //替换 userid

            data = data.replaceAll("minjie.chen", userId);
            //替换开始日期
            if(flag == 0) {
                //本月
                //const regex = /due >\\= (\d{4}-\d{2}-\d{2}) AND due <\\= (\d{4}-\d{2}-\d{2})/g;
                const regex = /"Target end" >\\= (\d{4}-\d{2}-\d{2}) AND "Target end" <\\= (\d{4}-\d{2}-\d{2})/g;
                // 使用正则表达式对象的 exec 方法进行匹配
                const match = regex.exec(data);
                // 检查是否找到匹配项
                if (match) {
                    const startDate = match[1]; // 第一个捕获组
                    const endDate = match[2]; // 第二个捕获组
                    console.log(`找到匹配项，开始日期：${startDate}，结束日期：${endDate}`);
                } else {
                    console.log('未找到匹配项');
                }
                data = data.replace(/due >\\= (\d{4}-\d{2}-\d{2}) AND due <\\= (\d{4}-\d{2}-\d{2})/g, `due >\\= ${firstDayOfCurrentMonth} AND due <\\= ${lastDayOfCurrentMonth}`);
                data = data.replace(/"Target end" >\\= (\d{4}-\d{2}-\d{2}) AND "Target end" <\\= (\d{4}-\d{2}-\d{2})/g, `"Target end" >\\= ${firstDayOfCurrentMonth} AND "Target end" <\\= ${lastDayOfCurrentMonth}`);
                title.value = userName + " - 工作日志 - " + formatDateToYearMonth(firstDayOfCurrentMonth);
            } else if (flag == 1) {
                //下月
                data = data.replace(/due >\\= (\d{4}-\d{2}-\d{2}) AND due <\\= (\d{4}-\d{2}-\d{2})/g, `due >\\= ${firstDayOfNextMonth} AND due <\\= ${lastDayOfNextMonth}`);
                data = data.replace(/"Target end" >\\= (\d{4}-\d{2}-\d{2}) AND "Target end" <\\= (\d{4}-\d{2}-\d{2})/g, `"Target end" >\\= ${firstDayOfNextMonth} AND "Target end" <\\= ${lastDayOfNextMonth}`);
                title.value = userName + " - 工作日志 - " + formatDateToYearMonth(firstDayOfNextMonth);
            }
            console.log("final data = ", data);

            document.getElementById("wysiwygTextarea_ifr").contentDocument.getElementsByClassName("editor-inline-macro")[i].setAttribute("data-macro-parameters", data);
        }
    }

    function createButton() {
        var title = document.getElementById("editor-precursor");
        if (null == title) {
            return -1;
        }
        //找到日常工作，认为是在编辑日常工作
        var workspace = document.getElementById("breadcrumbs").getElementsByTagName("li")[0].innerHTML;

        if (workspace.indexOf("日常工作") < 0) {
            return -1;
        }

        var html0 = "<button class='aui-button aui-button-subtle rte-button-restrictions' type='button' data-tooltip='未限制' id='autoCompeleteCurrentDailyData' data-explicit-restrictions='false' data-inherited-restrictions='false'  original-title=''><span class='aui-icon aui-icon-small aui-iconfont-edit'></span>一键填入本周日报数据</button>";
        title.childNodes[0].childNodes[0].appendHTML(html0);
        document.getElementById('autoCompeleteCurrentDailyData').addEventListener('click', function (ev) {
            autoCompeleteDailyData(0);
        });

        var html2 = "<button class='aui-button aui-button-subtle rte-button-restrictions' type='button' data-tooltip='未限制' id='autoCompeleteNextDailyData' data-explicit-restrictions='false' data-inherited-restrictions='false'  original-title=''><span class='aui-icon aui-icon-small aui-iconfont-edit'></span>一键填入下周日报数据</button>";
        title.childNodes[0].childNodes[0].appendHTML(html2);
        document.getElementById('autoCompeleteNextDailyData').addEventListener('click', function (ev) {
            autoCompeleteDailyData(1);
        });

        var html3 = "<button class='aui-button aui-button-subtle rte-button-restrictions' type='button' data-tooltip='未限制' id='autoCompeleteCurrentMonthData' data-explicit-restrictions='false' data-inherited-restrictions='false'  original-title=''><span class='aui-icon aui-icon-small aui-iconfont-edit'></span>一键填入本月月报数据</button>";
        title.childNodes[0].childNodes[0].appendHTML(html3);
        document.getElementById('autoCompeleteCurrentMonthData').addEventListener('click', function (ev) {
            autoCompeleteMonthData(0);
        });

        var html4 = "<button class='aui-button aui-button-subtle rte-button-restrictions' type='button' data-tooltip='未限制' id='autoCompeleteNextMonthData' data-explicit-restrictions='false' data-inherited-restrictions='false'  original-title=''><span class='aui-icon aui-icon-small aui-iconfont-edit'></span>一键填入下月月报数据</button>";
        title.childNodes[0].childNodes[0].appendHTML(html4);
        document.getElementById('autoCompeleteNextMonthData').addEventListener('click', function (ev) {
            autoCompeleteMonthData(1);
        });

    }
})();