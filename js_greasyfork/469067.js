// ==UserScript==
// @name         百度还在搜
// @namespace    http://blog.sxnxcy.com/
// @version      1.0.7
// @icon         https://www.baidu.com/favicon.ico
// @description  还在搜
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
// @require      https://cdn.staticfile.org/jquery/3.7.0/jquery.min.js
// @require      https://unpkg.com/layui@2.8.6/dist/layui.js
// @require      https://cdn.staticfile.org/xlsx/0.18.5/xlsx.core.min.js

// @downloadURL https://update.greasyfork.org/scripts/469067/%E7%99%BE%E5%BA%A6%E8%BF%98%E5%9C%A8%E6%90%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/469067/%E7%99%BE%E5%BA%A6%E8%BF%98%E5%9C%A8%E6%90%9C.meta.js
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
    document.addEventListener('DOMContentLoaded', function () {
        insertPage();
        localStorage.yzm = 1
        $("#pzan").click(function () {
            layer.open({
                type: 1,
                title: "还在搜配置",
                offset: 'auto',
                anim: 'slideLeft', // 从右往左
                area: ['650px', '60%'],
                shade: 0.1,
                shadeClose: false,
                id: 'ID-demo-layer-direction-r',
                content: nbHtml
            });
            configurationButtonEvent()
        });
    })
})();
let nbHtml = `
            <div class="layui-field-box">
                <div class="layui-row layui-col-space5">
                    <div class="layui-col-xs4">
                        <input type="text" id="cj" placeholder="搜索深度" class="layui-input" value="3">
                    </div>
                </div>
                <div class="layui-row">
                    <div class="layui-col-xs12">
                        <textarea id="gjc" placeholder="请输入关键词" class="layui-textarea"
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
                    <button id="butTest" class="layui-btn layui-btn-primary layui-border-red">下载结果</button>
                </div>
                <hr>
                <iframe id="nqcs" src="https://www.baidu.com/" frameborder="0" width="100%" height="300"></iframe>
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
            title: "还在搜配置",
            offset: 'auto',
            anim: 'slideLeft', // 从右往左
            area: ['650px', '60%'],
            shade: 0.1,
            shadeClose: false,
            id: 'ID-demo-layer-direction-r',
            content: nbHtml
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
            rw($("#gjc").val())
        }, 500)
    })
    $("#butTest").click(function () {
        xz();
    });
    $("#clyzm").click(function () {
        localStorage.yzm = "1"
    });
    $("#copyjg").click(function () {
        jgclcopy()
    });
}
// 进度条更新
function jdtup(bfb) {
    layui.element.progress('demo-filter-progress', bfb + "%")
    document.querySelector("#jdt").innerText = bfb + "%"
}

function initCustomPanel() {
    var panel = document.createElement('div');
    panel.className = 'chrome-plugin-demo-panel';
    panel.innerHTML = `
	<fieldset class="layui-elem-field">
				<legend id="mc">时间戳检测配置</legend>
				<div class="layui-field-box">
					<div class="layui-row layui-col-space5">
						<div class="layui-col-xs6">
							<input type="text" id="sl" placeholder="输入需要的数量" class="layui-input" value="1">
						</div>
						<div class="layui-col-xs6">
							<input type="text" id="ms" placeholder="增加时间秒数" class="layui-input" value="3600">
						</div>
					</div>
					<div class="layui-row layui-col-space5">
						<div class="layui-col-xs12">
							<textarea id="gjc" placeholder="请输入关键词" class="layui-textarea"
								style="height: 200px;"></textarea>
						</div>
					</div>
					<div class="layui-row layui-col-space5">
						<div class="layui-col-xs12">
						<textarea id="wz" placeholder="请输入域名或者链接" class="layui-textarea"
						style="height: 200px;"></textarea>
						</div>
					</div>
					<div class="layui-row layui-col-space5">
						<button id="saveStart" class="layui-btn layui-btn-primary layui-border-blue">开始</button>
						<button id="copy" class="layui-btn layui-btn-primary layui-border-green">复制结果</button>
						<button id="test" class="layui-btn layui-btn-primary layui-border-red">已处理验证码</button>
					</div>
					<div class="layui-row layui-col-space5">
						<div class="layui-col-xs12">
							<textarea id="jg" placeholder="" class="layui-textarea"
								style="height: 200px;"></textarea>
						</div>
					</div>
					<div class="layui-row layui-col-space5">
						<div id="progress-bar">
							<div id="progress"></div>
							<div id="progress-text"></div>
						</div>
					</div>
				</div>
			</fieldset>
	`;
    document.body.appendChild(panel);
}
//插入配置按钮页
function insertPage() {
    var panel = document.createElement('div');
    panel.id = 'pzdv';
    let html = `<button id="pzan" type="button" class="layui-btn layui-btn-primary" lay-on="test-offset-r"></button>`
    panel.innerHTML = html
    document.body.appendChild(panel);
    document.querySelector("#pzan").innerText = "开启配置页面 当前版本:" + GM_info.script.version
}
// 任务处理
async function rw(gjc) {
    zjg = []
    zarr = [["层级", "原关键词", "采集的关键词"]]
    sendMessage('还在搜索', '任务开始');
    jdtup(0)
    let level = Number(document.querySelector("#cj").value)
    let gjcsz = gjc.trim().split("\n")
    for (let index = 0; index < gjcsz.length; index++) {
        console.log("当前执行：" + gjcsz[index]);
        levelInit(gjcsz[index], level)
        await singleTaskProcessing(gjcsz[index], gjcsz[index], 1, level, "")
        jdtup(Math.floor((index + 1) / gjcsz.length * 100))
        await delayedAction()
    }
    sendMessage('还在搜索', '任务完成');
    console.log("结果预览:", zjg);
}
// 层级初始化
function levelInit(gjc, level) {
    zjg[gjc] = {}
    for (let index = 0; index < level; index++) {
        zjg[gjc][1 + index] = new Array()
    }
}
// 单任务处理
async function singleTaskProcessing(gjc, sgjc, level, levelt, url) {
    if (level > levelt) {
        return
    }
    if (url == "") {
        url = "https://www.baidu.com/s?wd=" + sgjc
    }
    let str = await syncGet2(url) //json接口匹配
    let parser = new DOMParser();
    let doc = parser.parseFromString(str, 'text/html');
    let pageArr = doc.querySelectorAll("a.c-gap-top-xsmall.item_3WKCf")
    for (let index = 0; index < pageArr.length; index++) {
        let a = pageArr[index]
        zjg[gjc][level].push(a.innerText)
        zarr.push([level, gjc, a.innerText])
        console.log(level, gjc, a.innerText, a.href);
        await singleTaskProcessing(gjc, a.innerText, level + 1, levelt, a.href)
        await delayedAction(150)
    }
}
// 延迟
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
function jgclcopy() {
    let t = ""
    for (let index = 0; index < zarr.length; index++) {
        t = t + zarr[index].join("-") + "\n"
    }
    $("#jg").val(t)
    $("#jg").select()
    document.execCommand('copy');
    $("#jg").blur()
    sendMessage('百度搜索', '已复制到剪贴板');
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
            document.querySelector("#nqcs").src = xhr.responseURL
        } else { //ok
            if (xhr && xhr.responseURL.indexOf("wappass.baidu.com") == -1) {
                return xhr.responseText
            }
        }
        if (localStorage.yzm == "0") {
            console.log("等待验证码处理中...");
            await delayedAction(10000)
            if (document.querySelector("#nqcs").src.indexOf("wappass.baidu.com") == -1) {
                localStorage.yzm = "1"
            }
        }
    }
}