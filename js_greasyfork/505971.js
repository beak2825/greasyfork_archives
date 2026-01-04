// ==UserScript==
// @name         SIT上应大教务 -  生成json文件
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  通过对课表页面进行解析，生成一个json文件，随后即可将此json文件导入到小应生活中以查看课程表
// @author       洛狼狼
// @license      MIT
// @match      *://jwxt.sit.edu.cn/*
// @match      *://jwxt.sit.edu.cn/jwglxt/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/505971/SIT%E4%B8%8A%E5%BA%94%E5%A4%A7%E6%95%99%E5%8A%A1%20-%20%20%E7%94%9F%E6%88%90json%E6%96%87%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/505971/SIT%E4%B8%8A%E5%BA%94%E5%A4%A7%E6%95%99%E5%8A%A1%20-%20%20%E7%94%9F%E6%88%90json%E6%96%87%E4%BB%B6.meta.js
// ==/UserScript==

var ClassScheduleToJSONURL = "kbcx/xskbcx_cxXskbcxIndex.html"; // 学生课表查询页面

var setTimeout_ = 3000;
(function () {
    'use strict';
    console.log("Loading...");
    unsafeWindow.addEventListener("load", main);

})();

function main() {
    var windowURL = window.location.href;
    if (windowURL.indexOf(ClassScheduleToJSONURL) != -1) {
        ClassScheduleToJSON();
    }
}

function ClassScheduleToJSON() {
    // 在课表上方创建一个点击按钮
    // --------------------------------------------------------------------------
    // unsafeWindow.addEventListener ("load", pageFullyLoaded);
    pageFullyLoaded();
    //加载完成后运行
    function pageFullyLoaded() {
        console.log("Get timetable page ...");
        let div = document.getElementsByClassName("btn-toolbar pull-right")[0];
        let btn = document.createElement("button");
        btn.className = "btn btn-default";
        btn.id = "exportbtn";
        let sp = document.createElement("span");
        sp.innerText = "下载课程表文件";
        sp.className = "bigger-120 glyphicon glyphicon-file";
        btn.append(sp);
        div.appendChild(btn);

        btn.onclick = function () {
            let xnm = document.getElementById("xnm").value;
            let xqm = document.getElementById("xqm").value;
            generateJson(xnm, xqm);
        }
    }

    // 默认超时时间是5秒
    function timeoutFetch(timeout = 5000) {
        return (url, option = {}) => {
            const controller = new AbortController()
            option.signal = controller.signal
            // 设置一个定时器，超时后调用abort方法结束当前请求
            const tid = setTimeout(() => {
                console.error(`Fetch timeout: ${url}`)
                controller.abort('timeout')
            }, timeout)
            return fetch(url, option).finally(() => {
                clearTimeout(tid) // 得到请求结果后，要清除定时器
            })
        }
    }
  

    function saveData(e, t) {
        var a = document.createElement("a");
        document.body.appendChild(a), a.style = "display: none";
        var n = JSON.stringify(e),
            c = new Blob([n], { type: "octet/stream" }),
            d = window.URL.createObjectURL(c);
        a.href = d, a.download = t, a.click(), window.URL.revokeObjectURL(d);
        alert("json文件已生成，可将该生成的文件导入到小应生活中，即可查看课程表");
    }

    function generateJson(xnm, xqm) {
        (async () => {
            let e = new FormData;
            e.append("xnm", xnm), e.append("xqm", xqm);
            try {
                let t = await timeoutFetch()("http://jwxt.sit.edu.cn/jwglxt/kbcx/xskbcx_cxXsgrkb.html?gnmkdm=N253508", { method: "POST", body: e }), a = await t.json();
                console.log(a), a && saveData(a, "Timetable.json")
            } catch (e) {
                console.error(e)
                alert("下载失败，可能是服务器连接超时或其他错误，请刷新或稍后再试");
            }
        })();
    }
}

