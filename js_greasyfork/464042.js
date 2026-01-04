// ==UserScript==
// @name         体育考试
// @version      max
// @description  ZCMU体育理论题隐藏菜单显示，自动答题。感谢ChatGPT的大力支持！适用于思博特系统
// @author       CraftY
// @match        *://*/clientWeb/quesiton/questionList.jsp?*
// @match        *://*/clientWeb/quesiton/questionForward.jsp?*
// @match     *://*/student/common/left1.jsp*
// @match    http*://wvpn.zcmu.edu.cn/*/clientWeb/quesiton/questionList.jsp?*
// @match     http*://wvpn.zcmu.edu.cn/*/clientWeb/quesiton/questionForward.jsp?*
// @match    http*://wvpn.zcmu.edu.cn/*student/common/left1.jsp*
// @namespace https://greasyfork.org/users/804016
// @downloadURL https://update.greasyfork.org/scripts/464042/%E4%BD%93%E8%82%B2%E8%80%83%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/464042/%E4%BD%93%E8%82%B2%E8%80%83%E8%AF%95.meta.js
// ==/UserScript==
(function () {
    'use strict';
    if (isURL('left')){
    var cheatItem = `<li style="list-style-image:url(/SportWeb/images/ico/11.gif) "><a href="#"  onclick="javascript:window.open('/student/researchTest.jsp','main','')">C问卷调查</a></li>
	<li style="list-style-image:url(/SportWeb/images/ico/11.gif) "><a href="#"  onclick="javascript:window.open('/student/stuQuestion1.jsp','main','')">C学生自评</a></li>
   <li style="list-style-image:url(/SportWeb/images/ico/11.gif) "><a href="#"  onclick="javascript:window.open('/student/videoStudentList.jsp','main','')">C在线教学</a></li>
	<li style="list-style-image:url(/SportWeb/images/ico/11.gif) "><a href="#"  onclick="javascript:window.open('/student/studentGymClassFind.jsp','main','')">C选课查询</a></li>
	<li style="list-style-image:url(/SportWeb/images/ico/11.gif) "><a href="#"  onclick="javascript:window.open('/student/gymClassCheck.jsp','main','')">C学生选课</a></li>
	<li style="list-style-image:url(/SportWeb/images/ico/11.gif) "><a href="#"  onclick="javascript:window.open('/student/studentQueryHealthInfo.jsp','main','')">C查看体质测试成绩</a></li>
	<li style="list-style-image:url(/SportWeb/images/ico/11.gif) "><a href="#"  onclick="javascript:window.open('/SportWeb/essential_info/school/school_info.jsp?headerid=1','main','')">C学生选课查询</a></li><li style="list-style-image:url(/SportWeb/images/ico/11.gif) "><a href="#" onclick="javascript:window.open('/clientWeb/quesiton/gymListForward.jsp','main','')">C进入理论考试</a></li>`
    document.querySelector("#menu3_child > ul").insertAdjacentHTML("afterend", cheatItem);
    }
    if (isURL('/clientWeb/quesiton/questionList.jsp')) {
        var Totaltd;
        someOtherFunction();
        async function someOtherFunction() {
            // wait for getAnswer() to finish
            Totaltd = await getAnswer();

            // call autoCheck() here
            autoCheck();
        }
        setTimeout(autoCheck(), 5000);
        async function getAnswer() {
            await new Promise(resolve => setTimeout(resolve, 2000)); // delay for 2 seconds
            let stuNo = document.getElementsByName('tmpStuNo')[0].value;
            let gymClassNo = document.getElementsByName('tmpGymClassNo')[0].value;
            let tmplink = location.href;
            let link = tmplink.slice(0, tmplink.indexOf('/weixin/main.js'));
            link += "/clientWeb/quesiton/questionDetails.jsp?stuNo=" + stuNo + "&gymClassNo=" + gymClassNo + "&flag=0"
            let response = await fetch(link, { method: "GET" });
            if (response.status === 200) {
                let html = await response.text();
                let parser = new DOMParser();
                let doc = parser.parseFromString(html, "text/html");
                let tds = doc.getElementsByTagName("td");
                return tds;
            } else {
                throw new Error("Failed to fetch page");
            }
        }
        function autoCheck() {
            setTimeout(function () {
                let result = [];
                let final = [];
                let answer = [];
                let list = [];
                let items = document.querySelectorAll('#qryType');
                for (let i = 1; i < Totaltd.length; i++) { list[i] = Totaltd[i].textContent; }
                for (let j = 1; j < list.length; j = j + 2) { answer[j] = list[j]; }
                let r = answer.filter(function (s) {
                    return s && s.trim();
                });
                for (let i = 0; i < r.length; i++) {
                    final[i] = r[i].slice(r[i].indexOf('正确答案：') + 5);
                    result[i] = final[i].match(/[A-Z]/g);
                    switch (result[i].toString()) {
                        case 'A':
                            items[i * 4].click();
                            break;
                        case 'B':
                            items[i * 4 + 1].click();
                            break;
                        case 'C':
                            items[i * 4 + 2].click();
                            break;
                        default:
                            items[i * 4 + 3].click();
                    }

                }
            }, 1000)
        }
    }
    if (isURL('/clientWeb/quesiton/questionForward.jsp')) {
        let a = $('a').attr('onclick');
        let cheatKs;
        let cheatView;
        if (a.includes("beginKs")) {
            cheatKs = a;
            cheatView = a.replace('beginKs', 'viewDetails');
        } else if (a.includes("viewDetails")) {
            cheatKs = a.replace('viewDetails', 'beginKs');
            cheatView = a;
        }
        //Micode.addStyle(`
        //.cheat{display:inline}button {width: 130px;height: 40px;background: linear-gradient(to bottom, #4eb5e5 0%,#389ed5 100%); /* W3C */border: none;border-radius: 5px;position: relative;border-bottom: 4px solid #2b8bc6;color: #fbfbfb;font-weight: 600;font-family: 'Open Sans', sans-serif;text-shadow: 1px 1px 1px rgba(0,0,0,.4);font-size: 15px;text-align: left;text-indent: 5px;box-shadow: 0px 3px 0px 0px rgba(0,0,0,.2);cursor: pointer;display: inline-block;margin: 0 auto;margin-bottom: 20px;margin-left:350px;margin-top:100px;}button:active {box-shadow: 0px 2px 0px 0px rgba(0,0,0,.2);top: 1px;}button:after {content: "";width: 0;height: 0;display: block;border-top: 20px solid #187dbc;border-bottom: 20px solid #187dbc;border-left: 16px solid transparent;border-right: 20px solid #187dbc;position: absolute;opacity: 0.6;right: 0;top: 0;border-radius: 0 5px 5px 0;}button.back {text-align: right;padding-right: 12px;box-sizing: border-box;}button.back:after {content: "";width: 0;height: 0;display: block;border-top: 20px solid #187dbc;border-bottom: 20px solid #187dbc;border-right: 16px solid transparent;border-left: 20px solid #187dbc;position: absolute;opacity: 0.6;left: 0;top: 0;border-radius: 5px 0 0 5px;}button.site {width: 40px;text-align: center;text-indent: 0;}button.site:after{display: none;}.holder {width: 400px;background: #efefef;padding: 30px 10px;box-sizing: border-box;margin: 0 auto;margin-top: 20px;text-align: center;}`);
        var box = `<div class='cheat'><button id="cheatBeginKs" onclick=${cheatKs}>Cheat进入考试</button><button id="cheatView" onclick=${cheatView}>Cheat查看试卷</button></div>`;
        //console.log(document.getElementsByTagName("body")[0])
        document.getElementsByTagName("body")[0].insertAdjacentHTML("afterend", box)
    }
    function isURL(x) {
        return window.location.href.indexOf(x) != -1;
    }
})();

