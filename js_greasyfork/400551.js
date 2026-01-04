// ==UserScript==
// @name            清华大学网络学堂加强(第三方修改)
// @name:en         Web Learning of Tsinghua University (THU) Assistant(3rd-party modified)
// @description     本脚本在Rinki Yang的脚本的基础上改动而成.
// @description:en  A navigation bar will be added.
// @version         0.31
// @author          Gravifer, Rinki Yang
// @match           *://learn.tsinghua.edu.cn/f/wlxt/index/course/student/
// @grant           none
// @namespace       https://greasyfork.org/users/478888-gravifer
// @downloadURL https://update.greasyfork.org/scripts/400551/%E6%B8%85%E5%8D%8E%E5%A4%A7%E5%AD%A6%E7%BD%91%E7%BB%9C%E5%AD%A6%E5%A0%82%E5%8A%A0%E5%BC%BA%28%E7%AC%AC%E4%B8%89%E6%96%B9%E4%BF%AE%E6%94%B9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/400551/%E6%B8%85%E5%8D%8E%E5%A4%A7%E5%AD%A6%E7%BD%91%E7%BB%9C%E5%AD%A6%E5%A0%82%E5%8A%A0%E5%BC%BA%28%E7%AC%AC%E4%B8%89%E6%96%B9%E4%BF%AE%E6%94%B9%29.meta.js
// ==/UserScript==
// Original Information:
// @name            清华大学网络学堂加强
// @name:en         Web Learning of Tsinghua University (THU) Assistant
// @description     网络学堂顶部加入提示导航栏
// @description:en  A navigation bar will be added.
// @version         0.3
// @author          Ryncke
// @match           *://learn.tsinghua.edu.cn/f/wlxt/index/course/student/
// @grant           none
// @namespace       https://greasyfork.org/users/442347

(
// setInterval(
 function() {
    'use strict';
    var i, j;//for循环专用变量

    var boxdetail_title = document.querySelector("#course1 > dl:nth-child(1) > dt");
    if (boxdetail_title != null) {
        boxdetail_title.parentNode.removeChild(boxdetail_title);
    }

    var refresh = document.createElement("a");
    refresh.innerText = "↻";
    // refresh.style.cssText = "color: #8fca6e; font-size: 18px; margin-left: 10px";
    refresh.style.cssText = "font-size: 18px; margin-left: 10px";
    // refresh.onmouseover = function () { this.style.color = '#4fc2b9' };
    refresh.onmouseover = function () { this.style.color = '#8fca6e' };
    refresh.onmouseout = function () { this.style.color = '' };
    refresh.onclick = function () {
        document.getElementsByClassName("nav")[0].removeChild(document.getElementById("reminder"));
        document.getElementsByClassName("bg")[0].removeChild(document.getElementById("floater"));
        main();
    };

    // var head = document.head || document.getElementsByTagName('head')[0];
    // var keepalive = document.createElement('meta');
    // function keepalive() {
    //     document.getElementsByClassName("nav")[0].removeChild(document.getElementById("reminder"));
    //     document.getElementsByClassName("bg")[0].removeChild(document.getElementById("floater"));
    //     main();
    // } setTimeout(keepalive(),1000);
    function relativeTime(dateString) {
        var values = dateString.split(" ");
        dateString = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
        var parsed_date = Date.parse(dateString);
        var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
        var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
        delta = delta + (relative_to.getTimezoneOffset() * 60);
        if (delta < 60) {
            return ' 刚刚';
        } else if (delta < 120) {
            return ' 1 分钟前';
        } else if (delta < (60 * 60)) {
            return ' ' + (parseInt(delta / 60)).toString() + ' 分钟前';
        } else if (delta < (120 * 60)) {
            return ' 1 小时前';
        } else if (delta < (24 * 60 * 60)) {
            return ' ' + (parseInt(delta / 3600)).toString() + ' 小时前';
        } else if (delta < (48 * 60 * 60)) {
            return ' 1 天前';
        } else {
            return ' ' + (parseInt(delta / 86400)).toString() + ' 天前';
        }
    }
    window.addEventListener("load", main);
    var intkeepalive = setInterval( function () {
        document.getElementsByClassName("nav")[0].removeChild(document.getElementById("reminder"));
        document.getElementsByClassName("bg")[0].removeChild(document.getElementById("floater"));
        main();
    }, 300000);
    // window.setInterval(keepalive,1000)
    // setInterval(function(){ alert("Hello"); }, 3000);
    function main() {
        //对原网页进行微调
        for (i = 0; i < document.getElementsByClassName("num faqi").length; i++) {
            document.getElementsByClassName("num faqi")[i].style.marginRight = "6px"
        }
        // var boxdetail_title = document.querySelector("#course1 > dl:nth-child(1) > dt");
        // boxdetail_title.parentNode.removeChild(boxdetail_title);
        // /html/body/div[5]/div/div[1]/dl[1]/dt
        //创建元素
        var reminder = document.createElement("ol");
        // reminder.style.cssText = "height: 48px; line-height: 48px; background-color: #fff; margin-top:-15px";
        reminder.setAttribute("class","title");
        reminder.style.cssText = "height: 48px; line-height: 48px; margin-top: -20px; margin-bottom: -20px; margin-left:10px";
        reminder.id = "reminder";
        var reminder_div = document.createElement("div");
        reminder_div.style.cssText = "position: relative; margin: 0 auto;"
        reminder_div.setAttribute("class", "content");
        var reminder_li = new Array();
        for (i = 0; i < 2; i++) {
            reminder_li[i] = document.createElement("a");
            // reminder_li[i].style.cssText = "color: #1392f1; font-size: 18px;"
            reminder_li[i].style.cssText = "color: #8fca6e; font-size: 18px;"
            reminder_li[i].innerHTML = "　";
        }
        var floater = document.createElement("div");
        floater.style.cssText = "width: 290px; position: absolute; box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.25); background-color: rgb(255, 255, 255, 0.8); display: none;";
        floater.id = "floater";
        floater.onmouseover = function () { floater.style.display = ""; };
        floater.onmouseout = function () { floater.style.display = "none"; };
        var floater_div = new Array();
        for (i = 0; i < 3; i++) {
            floater_div[i] = document.createElement("div");
            floater_div[i].style.cssText = "display: none; margin: 10px 20px;";
            floater.append(floater_div[i]);
        }

        //获取信息
        var coursnum = document.getElementsByClassName("orange stud").length;//课程数目
        var cur = new Array();//cur是current，当前课程
        var sum = { 0: 0, 1: 0, 2: 0 }
        for (i = 0; i < coursnum; i++) {
            cur[0] = document.getElementsByClassName("orange stud")[i];
            cur[1] = document.getElementsByClassName("wee stud")[i];
            cur[2] = document.getElementsByClassName("green stud")[i];
            for (j = 0; j < 3; j++) {
                if (parseInt(cur[j].innerText) > 0) {
                    sum[j] = sum[j] + parseInt(cur[j].innerText);
                    let floater_a1 = document.createElement("a");
                    floater_a1.innerHTML = document.getElementsByClassName("title stu")[i].innerHTML.split("(")[0];
                    floater_a1.href = document.getElementsByClassName("uuuhhh")[5 * i + j].href;
                    floater_a1.onmouseover = function () { this.style.color = '#4fc2b9'; }
                    floater_a1.onmouseout = function () { this.style.color = '#1392f1'; }
                    floater_a1.style.cssText = "display:inline-block;font-size:18px;line-height:36px;color:#1392f1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:180px;"
                    let floater_a2 = document.createElement("a");
                    floater_a2.innerHTML = "（" + parseInt(cur[j].innerText) + "）";
                    floater_a2.style.cssText = "font-size: 18px; line-height: 36px; color: #1392f1; float: right;"
                    let floater_p = document.createElement("p");
                    floater_p.append(floater_a1);
                    floater_p.append(floater_a2);
                    floater_div[j].append(floater_p);
                }
            }
        }

        //创建文本元素
        var reminder_a = new Array();
        var str = { 0: "未读公告 ", 1: "未读课件 ", 2: "未提交作业 " };
        for (i = 0; i < 3; i++) {
            reminder_a[i] = document.createElement("a");
            // reminder_a[i].style.cssText = "color: #1392f1; font-size: 18px;"
            reminder_a[i].style.cssText = "font-size: 18px;"
            // reminder_a[i].innerHTML = "有" + sum[i] + str[i];
            reminder_a[i].innerHTML = str[i] + sum[i];
            if (sum[i] > 0) {
                // reminder_a[i].style.color = "#f4c300";
                reminder_a[i].style.color = "#1392f1";
                reminder_a[i].onmouseover = function () {
                    this.style.color = '#4fc2b9';
                    floater.style.display = "";
                    floater.style.left = this.getBoundingClientRect().left + 20 + "px";
                    floater.style.top = this.getBoundingClientRect().bottom + "px";
                };
                // reminder_a[i].onmouseout = function () { this.style.color = '#f4c300'; floater.style.display = "none"; };
                reminder_a[i].onmouseout = function () { this.style.color = "#1392f1"; floater.style.display = "none"; };
            }
        }
        reminder_a[0].onmousemove = function () { floater_div[0].style.display = ""; floater_div[1].style.display = "none"; floater_div[2].style.display = "none"; };
        reminder_a[1].onmousemove = function () { floater_div[0].style.display = "none"; floater_div[1].style.display = ""; floater_div[2].style.display = "none"; };
        reminder_a[2].onmousemove = function () { floater_div[0].style.display = "none"; floater_div[1].style.display = "none"; floater_div[2].style.display = ""; };
        //
            var original_title = document.createElement("a");
            original_title.setAttribute("class","title");
            original_title.innerHTML = "所学课程";
        //
        //粘贴元素
        reminder.append(reminder_div); // reminder_div.append(original_title);
        reminder_div.append(reminder_a[0]); reminder_div.append(reminder_li[0]); reminder_div.append(reminder_a[1]);
        reminder_div.append(reminder_li[1]); reminder_div.append(reminder_a[2]); reminder_div.append(refresh);
        document.getElementsByClassName("nav")[0].insertBefore(reminder, document.getElementById("myTabContent"));
        document.getElementsByClassName("bg")[0].append(floater);
        //
            var refresh_tag = document.createElement("a");
            refresh_tag.style.cssText = "font-size: 12px; margin-left: 10px"
            var curtime = (new Date()).Format("yyyy-MM-dd hh:mm:ss");
            refresh_tag.innerHTML = "最近刷新于 " + curtime; reminder_div.append(refresh_tag);
        //
        // boxdetail_title.parantNode.replaceChild(boxdetail_title,reminder);
    };
}
// ,5000)
)();