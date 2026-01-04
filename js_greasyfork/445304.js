// ==UserScript==
// @name         xjtu-xiaomi-courseSync
// @namespace    xjtuCourseSync
// @version      1.1.2
// @description  sync course info from xjtu-ehall to xiaomi-xiaoai-app!
// @author       a-student-from-xian_wise_university
// @match        http://ehall.xjtu.edu.cn/jwapp/sys/wdkb/*
// @icon         none
// @connect      i.ai.mi.com
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445304/xjtu-xiaomi-courseSync.user.js
// @updateURL https://update.greasyfork.org/scripts/445304/xjtu-xiaomi-courseSync.meta.js
// ==/UserScript==


(function () {
    'use strict';
    let Waitingload = setInterval(() => {
        if (document.getElementById("vue-report") && document.getElementById("set_xiaomi_URL") == null) { CodeBegin(); }
    }, 300);

    let CodeBegin = () => {
        clearInterval(Waitingload);
        //p
        let infoP = document.createElement("p");
        infoP.id = "xiaomi_infoP";
        infoP.innerText = "请在下方的第一个输入框中输入可编辑课程表的地址(请确保该课程表为空，链接在小爱课程表-我的设置-使用PC编辑课表中获取)，" +
            "\n第二个输入框中按照默认值的格式填入学期（第一位年份是进入该学年的年份，如19级同学的大二第二学期是2020-2021-2，小学期在最后一位对应3）";
        //input
        let infoInput = document.createElement("textarea");
        infoInput.id = "xiaomi_URL_input";
        infoInput.value = "";
        infoInput.setAttribute("cols", "55");
        infoInput.setAttribute("rows", "2");

        let smstInput = document.createElement("textarea");
        smstInput.id = "Semester_input";
        smstInput.value = "2022-2023-1";
        smstInput.setAttribute("cols", "15");
        smstInput.setAttribute("rows", "1");
        //button
        let infoSettingstn = document.createElement("button");
        infoSettingstn.innerHTML = "确定";
        infoSettingstn.style = "background-color:gray;color:white;text-align:center;width:74px;";
        infoSettingstn.setAttribute("id", "set_xiaomi_URL");
        infoSettingstn.addEventListener("click", Main);

        //append
        let viewReportDiv = document.getElementById("vue-report");
        viewReportDiv.appendChild(document.createElement("br"));
        viewReportDiv.appendChild(document.createElement("br"));
        viewReportDiv.appendChild(infoP);
        viewReportDiv.appendChild(document.createElement("br"));
        viewReportDiv.appendChild(infoInput);
        viewReportDiv.appendChild(document.createElement("br"));
        viewReportDiv.appendChild(smstInput);
        viewReportDiv.appendChild(document.createElement("br"));
        viewReportDiv.appendChild(infoSettingstn);
        viewReportDiv.appendChild(document.createElement("br"));

    };

    async function Main() {
        let xiaomiRUL = document.getElementById("xiaomi_URL_input").value;
        xiaomiRUL = xiaomiRUL.substring(xiaomiRUL.search("token=") + 6);
        console.log(xiaomiRUL);
        xiaomiRUL = window.atob(xiaomiRUL);
        console.log(xiaomiRUL);
        let re = /(.+?)%26(.+?)%26(.+?)%26(.+)/g;
        xiaomiRUL = xiaomiRUL.matchAll(re).next().value;
        const userID = xiaomiRUL[1];
        const deviceId = xiaomiRUL[2];
        //const expire_time = xiaomiRUL[3];
        const ctId = xiaomiRUL[4];
        let Semester = document.getElementById("Semester_input").value;

        let f = await fetch("http://ehall.xjtu.edu.cn/jwapp/sys/wdkb/modules/xskcb/xskcb.do", {
            "credentials": "include",
            "headers": {
                "User-Agent": navigator.userAgent,
                "Accept": "application/json, text/javascript, */*; q=0.01", "Accept-Language": "en-US,en;q=0.5",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", "X-Requested-With": "XMLHttpRequest"
            },
            "referrer": "http://ehall.xjtu.edu.cn/jwapp/sys/wdkb/*default/index.do?amp_sec_version_=1&EMAP_LANG=zh&THEME=millennium",
            "body": "XNXQDM=" + Semester, "method": "POST", "mode": "cors"
        });
        if (f && f.status == 200) {
            f = await f.json();
            f = f.datas.xskcb.rows;
            let okNum = 0, err601Num = 0, errOther = 0; let infoP_Obj = document.getElementById("xiaomi_infoP");
            let errC = document.createElement("p"); document.getElementById("vue-report").appendChild(errC);
            errC = document.getElementById("vue-report").lastChild; errC.style = "color:red";
            function myResponse(xhr) {
                let rsp = JSON.parse(xhr.responseText); console.log(rsp);
                if (rsp.code == 0) { okNum++; } else if (rsp.code == 601) { err601Num++; } else { errOther++; }
                infoP_Obj.innerText = "从ehall共获取" + f.length + "个课程单元。\n成功添加" + okNum +
                    "个，因课表非空(error code: 601)添加失败" + err601Num + "个，因其他未知错误添加失败" + errOther + "个。\n失败的课程名如下:";
                if (rsp.code != 0) { errC.innerText += ("[error code: " + rsp.code + "]" + this.para + "\n"); }
            }
            for (let i = 0; i < f.length; i++) {
                const element = f[i];
                console.log(element);
                let s0 = "{\"userId\":" + userID + ",\"deviceId\":\"" + deviceId + "\",\"ctId\":" + ctId + ",\"course\":{\"name\":\"" +
                    element.KCM + "\",\"position\":\"" + element.JASMC + "\",\"teacher\":\"" + element.SKJS + "\",\"weeks\":\"" +
                    getWeeks(element.SKZC) + "\",\"day\":" + element.SKXQ + getColorMode(element.KHC + element.KCM) +
                    getSections(element.KSJC, element.JSJC) + "\"},\"sourceName\":\"course-app-browser\"}";

                GM_xmlhttpRequest({
                    url: "https://i.ai.mi.com/course-multi/courseInfo",
                    credentials: "omit",
                    referrer: "https://i.ai.mi.com/h5/precache/ai-schedule/",
                    method: "POST",
                    data: s0,
                    headers: {
                        "User-Agent": navigator.userAgent, "Accept": "application/json", "Accept-Language": "en-US,en;q=0.5",
                        "Content-Type": "application/json", "Access-Control-Allow-Origin": "true", "Sec-Fetch-Dest": "empty",
                        "Sec-Fetch-Mode": "cors", "Sec-Fetch-Site": "same-origin"
                    },
                    onload: myResponse.bind({
                        para: "课程名:" + element.KCM + ",星期:" + element.SKXQ + ",节次:" +
                            getSections(element.KSJC, element.JSJC) + ",周数:" + getWeeks(element.SKZC)
                    })
                });
            }
        }
        else { window.alert("在ehall获取课表信息失败！"); }
    }

    let getWeeks = s => {
        //"111111111111111100"
        let res = "";
        for (let i = 0; i < s.length; i++) {
            if (s[i] - '0') {
                res += (i + 1).toString() + ',';
            }
        }
        res = res.substring(0, res.length - 1);
        return res;
        //"1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16"
    }

    let getSections = (s1, s2) => {
        //"5"
        //"6"
        let res = "";
        for (let i = parseInt(s1); i <= parseInt(s2); i++) {
            res += i.toString() + ',';
        }
        res = res.substring(0, res.length - 1);
        return res;
        //"5,6"
    }

    let colorM = ["00A6F2", "E5F4FF", "FC6B50", "FDEBDE", "3CB3C8", "DEFBF8",
        "7D7AEA", "EDEDFF", "FF9900", "FCEBCD", "EF5B75", "FFEFF0",
        "5B8EFF", "EAF1FF", "F067BB", "FFEDF8", "F067BB", "FFEDF8",
        "CBA713", "FFF8C8", "B967E3", "F9EDFF", "6E8ADA", "F3F2FD"];
    const ModeNum = 12;

    let getColorMode = courseId => {
        if (myHash(courseId) % (ModeNum + 1) == ModeNum) {
            courseId = myHash(courseId + "为了均匀，先mod质数13，" +
                "如果不幸得12，再从这里mod质数11") % (ModeNum - 1);
        }
        else { courseId = myHash(courseId) % (ModeNum + 1); }
        let res = ",\"style\":\"{\\\"color\\\":\\\"#" +
            colorM[courseId * 2] +
            "\\\",\\\"background\\\":\\\"#" +
            colorM[courseId * 2 + 1] +
            "\\\"}\",\"sections\":\"";
        return res;
        //",\"style\":\"{\\\"color\\\":\\\"#00A6F2\\\",\\\"background\\\":\\\"#E5F4FF\\\"}\",\"sections\":\""
    }

    let myHash = s => {
        let hash = 0, chr = 'a';
        if (s.length === 0) return hash;
        for (let i = 0; i < s.length; i++) {
            chr = s.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return Math.abs(hash) + 1;
    }

    // Content below learnt from here
    // https://userscripts-mirror.org/topics/193
    // A great resource on the theory and practice of lexical closures and partial application is Brockman's
    // [Object-Oriented Event Listening through Partial Application in JavaScript](http://www.brockman.se/writing/method-references.html.utf8).
    // The title sets out to solve the same kind of issue under another set of circumstances (event listeners),
    // but the solution and all understanding of the problem applies to those circumstances and yours alike.
    // You'll have this problem in many similar situations until you understand how closures work in javascript, and then be rid of the issue.
    Function.prototype.bind = function (thisObject) {
        var method = this;
        var oldargs = [].slice.call(arguments, 1);
        return function () {
            var newargs = [].slice.call(arguments);
            return method.apply(thisObject, oldargs.concat(newargs));
        };
    }

    // for (let i = 0; i < 3; i++) {
    //     GM_xmlhttpRequest({
    //         method: 'GET',
    //         url: 'http://ehall.xjtu.edu.cn/jwapp/sys/wdkb/*default/index.do?amp_sec_version_=1&EMAP_LANG=zh&THEME=millennium',
    //         onload: myCallback.bind({ myVar:"test", v2: 0 })
    //     });
    // }


    // // variables from the {...} literal above are now found in the `this' object:
    // function myCallback(xhr) {
    //     alert(this.myVar);
    //     console.log(this.v2);
    //     console.log(xhr.responseText);
    //     //...
    // }
    //------------------------------------------------------------------------//
    //This also allows you to pass additional function arguments to myCallback,
    //bound in before the request argument, if you'd like to, perhaps like this:
    //     var url = 'http://www.somewhere.com/something.xml';
    //     GM_xmlhttpRequest({
    //         method: 'GET',
    //         url: url,
    //         onload: myCallback.bind({}, url, some_variable)
    //     });

    //     // 2nd onward argument to bind get prepended to the xhr callback's args:
    //     function myCallback(url, myVar, request) {
    //         alert(myVar);
    //   ...
    //     }
})();