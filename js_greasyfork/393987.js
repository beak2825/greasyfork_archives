// ==UserScript==
// @name        GT学院助手
// @namespace   gt-china.com.cn
// @match       *://training.gt-china.com.cn/teelms/showMyCourse.shtml?id=*
// @grant       GM_setClipboard
// @version     1.0.2
// @author      jaybird
// @description 自动听课，视频下载
// @icon        http://yanxuan.nosdn.127.net/3c9e3a7eb5790cadf4d46ad4460f19fe.png
// @downloadURL https://update.greasyfork.org/scripts/393987/GT%E5%AD%A6%E9%99%A2%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/393987/GT%E5%AD%A6%E9%99%A2%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

const STUDYWARE_SELECTOR = '#mainPanel #result1 [onclick^=studyWare]';
let g_course = null;

function getTpl(index) {
    let {url, name} = doDownload(index);
    let content = `<a style="color:#14c7d0" download=${name} href=${url} onclick="doCmd(this, 'copyName', ${index})">点击下载</a>`;
    if (g_course.table[index].percent != 100) {
        content += `
<button class="btn mytheme-bg" id="btnCommitAll" onclick="doCmd(this,'all', ${index})">
    <i class="fa fa-thumbs-up"> 一键听课</i>
</button>`;
    } else {
        content += `
<button class="btn mytheme-bg">
    <i class="fa fa-fast-ok-sign">课程已完成</i>
</button>
`;
    }
    return `<span class="gt-course-op">${content}</span>`;
}

//移除loading效果
function completeLoading() {
    document.getElementById('loadingDiv').style.display = 'none';
}
//展示loading效果
function showLoading() {
    document.getElementById('loadingDiv').style.display = 'block';
}

function createDom(tpl, index = 0) {
    let objE = document.createElement('div');
    objE.innerHTML = tpl;
    return objE.childNodes[index];
}

function initLoading() {
    //在页面未加载完毕之前显示的loading Html自定义内容
    var _LoadingHtml = `<div id="loadingDiv" style="display: none; ">
    <div id="over" style=" position: absolute;top: 0;left: 0; width: 100%;height: 100%; background-color: #444242;opacity:0.5;z-index: 1000;">
    </div>
    <div id="layout" style="position: absolute;top: 40%; left: 40%;width: 20%; height: 20%;  z-index: 1001;text-align:center;">
        <h1>加载中。。。</h1>
    </div>
</div>`;
    document.body.appendChild(createDom(_LoadingHtml, 0));
}

async function getCourseInfo() {
    var s = new Date().getTime();
    let url = dataURL_do;
    if (dataURL_do.indexOf('?') == -1) {
        url = dataURL_do + '?s=' + s;
    } else if (dataURL_do.indexOf('&s=') == -1) {
        url = dataURL_do + '&s=' + s;
    }
    return await fetch(url, {
        method: 'GET'
    })
        .then(response => response.text())
        .then(text => {
            var data = eval('(' + text + ')');
            return data;
        })
        .catch(error => error);
}

async function doTask(index, task) {
    let d = g_course;
    let params = Object.assign(task, {
        pid: d.id,
        id: d.table[index].id,
        s: new Date().getTime()
    });
    let arry = [];
    for (let k in params) {
        arry.push(k + '=' + d[k]);
    }
    let url = `do/study_do.php?${arry}`;
    return await fetch(url, { method: 'GET' })
        .then(response => response.data)
        .catch(error => error);
}

async function doStart(index) {
    return doTask(index, { task: 'start' });
}

async function doSetTime(target, index, seconds) {
    showLoading();
    target.disabled = true;
    if (g_course.table[index].totalTime == 0) {
        doStart(index);
        refreshData();
    }
    return doTask(index, { task: 'setTime', totalSessionTime: seconds })
        .then(res => {
            window.getData();
            refreshData();
            target.disabled = false;
            completeLoading();
        })
        .catch(e => {
            target.disabled = false;
            completeLoading();
        });
}

function getVideoName(index){
  let relUrl = g_course.table[index].wareurl;
  return g_course.table[index].name + relUrl.substr(relUrl.lastIndexOf('.'));
}

function doDownload(index) {
    let relUrl = g_course.table[index].wareurl;
    let url = `http://training.gt-china.com.cn:8081/${relUrl}`;
    return {url, name:getVideoName(index)};
}

unsafeWindow.doCmd = function(target, cmd, index) {
    switch (cmd) {
        case 'all':
            doSetTime(target, index, g_course.classHour * 60 * 60 + 1);
            break;
        case 'download':
            doDownload(index);
            break;
        case 'copyName':
            GM_setClipboard(getVideoName(index));
            break;
        default:
            break;
    }
}

function initButton() {
    let op = document.querySelector('.gt-course-op');
    if (op) {
        op.parentNode.removeChild(op);
    }
    let domTitles = document.querySelectorAll(STUDYWARE_SELECTOR);
    if (domTitles.length > g_course.table.length) {
        alert('解析出错啦，赶紧反馈这个页面吧');
        return;
    }
    for (let index = 0; index < domTitles.length; index++) {
        const domTitle = domTitles[index];
        if (domTitle) {
            let op = createDom(getTpl(index));
            let b = domTitle.parentNode.querySelector('b');
            domTitle.parentNode.insertBefore(op, b.nextElementSibling);
        }
    }
}

async function refreshData() {
    g_course = await getCourseInfo();
    if (!g_course || !g_course.table) {
        console.log('get info error');
        return;
    }
    completeLoading();
    initButton();
}
initLoading();
showLoading();
refreshData();
