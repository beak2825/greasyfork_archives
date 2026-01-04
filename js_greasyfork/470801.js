// ==UserScript==
// @name         排名查询
// @namespace    http://blog.sxnxcy.com/
// @version      1.0.4
// @description  搜索引擎排名查询
// @author       xiaobao
// @license      CC-BY-4.0
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_getResourceURL
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @match        *://*.baidu.com/*
// @match        *://*so.toutiao.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.0/jquery.min.js
// @require      https://unpkg.com/layui@2.8.6/dist/layui.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.core.min.js

// @downloadURL https://update.greasyfork.org/scripts/470801/%E6%8E%92%E5%90%8D%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/470801/%E6%8E%92%E5%90%8D%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

(function () {
    console.log("脚本注入成功", GM_info.script.version);
    GM_addStyle(`@import url('https://unpkg.com/layui@2.8.6/dist/css/layui.css');
    .chrome-plugin-demo-panel {
        position: fixed;
        right: 0;
        bottom: 10px;
        padding: 10px;
        width: 500px;
        height: 800px;
        margin-right: 30px;
    }
    #pzdv{
        position: fixed;
        right: 0;
        bottom: 30px;
        padding: 40px;
        margin-right: 40px;
    }
    `);
})();
let nbHtml = `
            <div class="layui-field-box">
                <div class="layui-row layui-col-space5">
                    <div class="layui-col-xs4">
                        <input type="text" id="ys" placeholder="搜索页数" class="layui-input" value="1">
                    </div>
                    <div class="layui-col-xs4">
                        <input type="text" id="sl" placeholder="每页数量" class="layui-input" value="50">
                    </div>
                </div>
                <div class="layui-row">
                    <div class="layui-col-xs12">
                        <textarea id="gjc" placeholder="请输入关键词" class="layui-textarea"
                            style="height: 200px;"></textarea>
                    </div>
                    <div class="layui-col-xs12">
                        <textarea id="ym" placeholder="域名或者链接" class="layui-textarea"
                            style="height: 200px;"></textarea>
                    </div>
                </div>
                <div class="layui-row">
                <hr>
                    <div class="layui-progress layui-progress-big" lay-showPercent="true" lay-filter="demo-filter-progress">
                        <div id="jdt" class="layui-progress-bar" lay-percent="0%">
                        </div>
                    </div>
                </div>
                <div class="layui-row layui-col-space5">
                    <hr>
                    <button id="saveStart" class="layui-btn layui-btn-primary layui-border-blue">开始</button>
                    <button id="clyzm" class="layui-btn layui-btn-primary layui-border-red">已处理验证码</button>
                    <button id="butTest" class="layui-btn layui-btn-primary layui-border-red">下载结果</button>
                    <div class="layui-form">
                        <input id="checkbox1" type="checkbox" name="" title="只取一条">
                    </div>
                </div>
            </div>
`;
let zjg = []
let zarr = []
document.addEventListener('DOMContentLoaded', function () {
    insertPage();
    localStorage.yzm = 1
    $("#pzan").click(function () {
        layer.open({
            type: 1,
            title: "排名查询配置",
            offset: 'auto',
            anim: 'slideLeft', // 从右往左
            area: ['750px', '50%'],
            shade: 0.1,
            shadeClose: false,
            id: 'ID-demo-layer-direction-r',
            content: nbHtml
        });
        layui.use('form', function () {
            var form = layui.form;
            form.render()
        });
        configurationButtonEvent()
    });
})
function sendMessage(title, message) {
    GM_notification({
        text: message,
        title: title,
        timeout: 5000, // 通知显示时间，单位为毫秒，默认为 4000 毫秒
        onclick: function () {
        }
    });
}
// 配置按钮事件
function configurationButtonEvent() {
    $("#saveStart").click(() => {
        setTimeout(function () {
            rw($("#gjc").val(), $("#ym").val())
        }, 500)
    })
    $("#butTest").click(function () {
        xz();
    });
    $("#clyzm").click(function () {
        localStorage.yzm = "1";
        console.log(localStorage.yzm);
    });
}
// 进度条更新
function jdtup(bfb) {
    layui.element.progress('demo-filter-progress', bfb + "%")
    document.querySelector("#jdt").innerText = bfb + "%"
}
//插入配置按钮页
function insertPage() {
    var panel = document.createElement('div');
    panel.id = 'pzdv';
    let html = `<button id="pzan" type="button" class="layui-btn layui-btn-primary" lay-on="test-offset-r"></button>`
    panel.innerHTML = html
    document.body.appendChild(panel);
    document.querySelector("#pzan").innerText = "排名查询 当前版本:" + GM_info.script.version
}
// 任务处理
async function rw(gjc, ym) {
    zjg = []
    zarr = [["关键词", "排名", "域名", "真实地址", "标题"]]
    sendMessage('排名查询', '任务开始');
    jdtup(0)
    let ys = Number(document.querySelector("#ys").value)
    let sl = Number(document.querySelector("#sl").value)
    let gjcsz = gjc.trim().split("\n")
    let ymsz = ym.trim().split("\n")
    if (gjcsz.length != ymsz.length) {
        sendMessage('排名查询', '关键词域名数量不对应任务结束');
        return
    }
    for (let index = 0; index < gjcsz.length; index++) {
        console.log("当前执行：" + gjcsz[index]);
        await singleTaskProcessing(gjcsz[index], ymsz[index], ys, sl)
        jdtup(Math.floor((index + 1) / gjcsz.length * 100))
        await delayedAction()
    }
    sendMessage('排名查询', '任务完成');
    console.log("结果预览:", zjg);
}

// 单任务处理
async function singleTaskProcessing(gjc, ym, ys, sl) {
    switch (location.host) {
        case "www.baidu.com":
            baiduPc(gjc, ym, ys, sl)
            break;
        case "m.baidu.com":
            baiduYd(gjc, ym, ys, sl)
            break;
        case "so.toutiao.com":
            touduPc(gjc, ym, ys, sl)
            break;
        default:
            break;
    }
}

async function baiduPc(gjc, ym, ys, sl) {
    let dt = document.getElementById('checkbox1').checked
    for (let index = 0; index < ys; index++) {
        url = "https://www.baidu.com/s?wd=" + encodeURIComponent(gjc) + "&pn=" + index * sl + "&rn=" + sl
        let str = await syncGet2(url) //json接口匹配
        let parser = new DOMParser();
        let doc = parser.parseFromString(str, 'text/html');
        let bqsz = doc.querySelectorAll("#content_left [srcid]");
        for (let bq of bqsz) {
            if (bq.querySelector("H3") != null) {
                let dz = bq.getAttribute("mu")
                let pm = bq.getAttribute("id")
                let bt = bq.querySelector("H3").innerText
                if (getDomain(dz, ym)) {
                    zarr.push([gjc, pm, ym, dz, bt])
                    zjg.push([gjc, pm, ym, dz, bt])
                    console.log(gjc, pm, ym, dz, bt);
                    if (dt) {
                        return //取单条返回
                    }
                }
            }
        }
    }
}
async function baiduYd(gjc, ym, ys, sl) {
    let dt = document.getElementById('checkbox1').checked
    for (let index = 0; index < ys; index++) {
        url = "https://m.baidu.com/s?word=" + encodeURIComponent(gjc) + "&pn=" + index * sl
        let str = await syncGet2(url) //json接口匹配
        let parser = new DOMParser();
        let doc = parser.parseFromString(str, 'text/html');
        let bqsz = doc.querySelectorAll(".c-result.result");
        for (let bq of bqsz) {
            if (bq.querySelector("H3") != null) {
                let xjson = JSON.parse(bq.getAttribute("data-log"))
                let dz = xjson.mu
                let pm = xjson.order + index * 10
                let bt = bq.querySelector("H3").innerText
                if (getDomain(dz, ym)) {
                    zarr.push([gjc, pm, ym, dz, bt])
                    zjg.push([gjc, pm, ym, dz, bt])
                    console.log(gjc, pm, ym, dz, bt);
                    if (dt) {
                        return //取单条返回
                    }
                }
            }
        }
    }
}

async function touduPc(gjc, ym, ys, sl) {
    let dt = document.getElementById('checkbox1').checked
    for (let index = 0; index < ys; index++) {
        url = "https://so.toutiao.com/search?dvpf=pc&source=pagination&keyword=" + encodeURIComponent(gjc) + "&page_num=" + (index)
        let str = await syncGet2(url) //json接口匹配
        let parser = new DOMParser();
        let doc = parser.parseFromString(str, 'text/html');
        let bqsz = doc.querySelectorAll("div.s-result-list div.result-content[data-i]");
        for (let bq of bqsz) {
            if (bq.querySelector("[data-log-extra]") != null) {
                let xjson = JSON.parse(bq.querySelector("[data-log-extra]").getAttribute("data-log-extra"))
                let dz = ""
                console.log(bq.querySelector("[data-log-extra]").getAttribute("data-log-extra"));
                if (xjson.hasOwnProperty("url")) {
                    dz = xjson.url
                } else {
                    if (xjson.result_type == "self_video") {
                        dz = "https://www.toutiao.com/video/" + xjson.search_result_id + "/?channel=&source=search_tab"
                    }
                    if (xjson.result_type == "self_article") {
                        dz = "https://www.toutiao.com/article/" + xjson.search_result_id + "/?channel=&source=search_tab"
                    }
                    if (xjson.result_type == "user") {
                        dz = xjson.common_params.items[0].doc_url
                    }

                }
                let pm = Number(bq.getAttribute("data-i")) * (index + 1) + 1
                let bt = bq.querySelector("a").innerText
                if (getDomain(dz, ym)) {
                    zarr.push([gjc, pm, ym, dz, bt])
                    zjg.push([gjc, pm, ym, dz, bt])
                    console.log(gjc, pm, ym, dz, bt);
                    if (dt) {
                        return //取单条返回
                    }
                }
            }
        }
    }
}
// 延迟
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
//延迟执行
async function delayedAction(s) {
    if (s == null | s == undefined) {
        s = 1000
    }
    await sleep(s);
}
async function xz() {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(zarr);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const downloadLink = document.createElement('a');
    downloadLink.id = "downloadLink"
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'data.xlsx';
    downloadLink.click();
    downloadLink.remove()
}
async function syncGet2(url) {
    let xhr = null
    while (true) {
        if (localStorage.yzm == "1") {
            xhr = new XMLHttpRequest();
            xhr.open('GET', url, false); // 同步请求
            xhr.send();
        }
        if (localStorage.yzm == "1" && xhr && (xhr.responseURL.indexOf("wappass.baidu.com") > -1)) {
            localStorage.yzm = "0"
            sendMessage("百度搜索", "请手动处理验证码")
            window.open(xhr.responseURL)
        } else { //ok
            if (xhr && xhr.responseURL.indexOf("wappass.baidu.com") == -1) {
                return xhr.responseText
            }
        }
        if (localStorage.yzm == "0") {
            console.log("等待验证码处理中...");
            await delayedAction(10000)
            debugger
        }
    }
}


// 链接对比模糊对比 
function getDomain(url, url2) {
    if (url==null || url2==null) {
        return false
    }
    url = url.replaceAll("http://", "").replaceAll("https://", "")
    url2 = url2.replaceAll("http://", "").replaceAll("https://", "")
    return url.indexOf(url2) > -1
}