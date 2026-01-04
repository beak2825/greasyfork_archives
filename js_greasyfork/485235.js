// ==UserScript==
// @name         优酷xxx下载
// @license      GPL-3.0-only
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  输入id，下载视频
// @author       TSCats
// @match        *://www.youku.com/*
// @match        *://youku.com/*
// @match        *://v.youku.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485235/%E4%BC%98%E9%85%B7xxx%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/485235/%E4%BC%98%E9%85%B7xxx%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
'use strict';

// let idLists = [];
let idsStr = '';
let fileData = [];
let isGetUrlIng = false;
const startUrl = 'http://127.0.0.1:3000/start';
let concurrencyValue = 5;
let dirPath = '';
let onlyMp4 = false;
let isShow = true;
let instInp = function () {
    // 获取或创建一个输入框元素的引用，这里假设id为"myInput"
    let inputElement = document.getElementById("myInput");
    NomlInputClass(inputElement);
    // 监听输入框的input事件
    inputElement.addEventListener('input', function (event) {
        // 将输入的内容保存到window.aa中
        idsStr = event.target.value;
    });
}
let instInp2 = function () {
    // 获取或创建一个输入框元素的引用，这里假设id为"myInput"
    let inputElement = document.getElementById("myInput1");
    NomlInputClass(inputElement);
    // 监听输入框的input事件
    inputElement.addEventListener('input', function (event) {
        // 将输入的内容保存到window.aa中
        let a = event.target.value;
        if (!a || a <= 0) {
            a = 5
        }
        concurrencyValue = a;
    });
}
let instInp3 = function () {
    // 获取或创建一个输入框元素的引用，这里假设id为"myInput"
    let inputElement = document.getElementById("dirPath");
    NomlInputClass(inputElement);
    // 监听输入框的input事件
    inputElement.addEventListener('input', function (event) {
        // 将输入的内容保存到window.aa中
        dirPath = event.target.value;
        console.log(dirPath);
    });
}
let initBtn = function () {
    var btn = document.getElementById("myBtn");
    NomlClass(btn);
    btn.addEventListener('click', async function (event) {
        if (isGetUrlIng) {
            alert('视频链接获取中，等下先再点击提交吧');
            return;
        }
        if (concurrencyValue >= 20) {
            alert('并行超过20个啦，改小点再试试啰');
            return;
        }

        let ids = betterIds();
        if (idsStr.length <= 0 || ids.length <= 0) {
            alert('获取不到id喔，或者重新再粘贴一次试试');
            return;
        }

        let urls = getUrl(ids);
        isGetUrlIng = true;
        console.log(urls);
        let arr = [];
        arr = splitArrayIntoChunks(urls, 5);
        for (let i = 0; i < arr.length; i++) {
            let datas = await aroundSendGETRequest(arr[i]);
            await aroundToDown(datas);
        }

        alert('播放串传输完成，正在后台下载中，可以进行下一波提交下载了');

        fileData = [];
        isGetUrlIng = false;
    });
}

let initBtn2 = function () {
    var btn = document.getElementById("myBtn2");
    NomlClass(btn,'#909399');
    btn.addEventListener('click', async function (event) {
        onlyMp4 = !onlyMp4;
        if(onlyMp4){
            btn.style.backgroundColor = "#67c23a";
        }else{
            btn.style.backgroundColor = '#909399';
        }
    });
}

let initBtn3 = function () {
    let updateYouKu = document.getElementById('updateYouKu');
    NomlClass(updateYouKu);
    updateYouKu.onclick = function(){
        window.open('https://greasyfork.org/zh-CN/scripts/485235-%E4%BC%98%E9%85%B7xxx%E4%B8%8B%E8%BD%BD','_blank');
    }
}

let initBtn4 = function () {
    let showYouKuBox = document.getElementById('showYouKuBox');
    NomlClass(showYouKuBox);
    showYouKuBox.onclick = function(){
        let youKuBox = document.getElementById('youKuBox');
        isShow = !isShow;
        let w = 800;
        let h = 460;
        let minW = 138;
        let minH = 40;
        if(isShow){
            showYouKuBox.innerHTML = '隐藏';
            youKuBox.style.width = w+'px';
            youKuBox.style.height = h+'px';
        }else{
            showYouKuBox.innerHTML = '展开';
            youKuBox.style.width = minW+'px';
            youKuBox.style.height = minH+'px';
        }
    }
}

function splitArrayIntoChunks(arr, chunkSize) {
    let chunks = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
}

async function aroundSendGETRequest(urls) {
    let datas = [];
    for (let i = 0; i < urls.length; i++) {
        datas.push(await sendGETRequest(urls[i]));
    }
    return datas;
}

async function aroundToDown(arr) {
    const response = await fetch(startUrl + '?concurrencyValue=' + concurrencyValue + '&dirPath=' + encodeURIComponent(dirPath), {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(arr)
    })
    if (response.ok) {
        //
    }
}

let initElement = function () {
    let ele = document.createElement("div");
    ele.innerHTML = `<div id="youKuBox" style="transition: all 0.5s; overflow: hidden; z-index: 3000; background: white; width: 800px; height: 460px; padding: 24px; color: #5e6d82; box-shadow: rgba(232, 237, 250, 0.6) 0px 0px 8px 0px, rgba(232, 237, 250, 0.5) 0px 2px 4px 0px; position: fixed; top: 80px; left: 50px;">
        <div>
            <button id="showYouKuBox">隐藏</button>
            <div style="width: 100%;height: 30px;text-align: center;">优酷xxx下载工具</div>
            <div> 1.先随便跳转一个播放页再开始操作</div>
            <div style="width: 1px;height: 1px;padding: 10px 0;"></div>
            <div>
                <span>2.填入id，多个的话用逗号隔开 比如：</span>
                <span style="color: #67c23a;">123,2344</span>
                <label for="myInput"></label>
                <input id="myInput" type="text" id="myInput" name="myInput" id="" placeholder="填入id">
             </div>
             <div style="width: 1px;height: 1px;padding: 10px 0;"></div>
             <div>
                 <span>3.填入同时下载数，不填的话 默认5</span>
                 <label for="myInput1"></label>
                 <input id="myInput1" type="text" id="myInput1" name="myInput1" id="" placeholder="同时下载数" style="width: 70px;">
                </div>
            <div style="width: 1px;height: 1px;padding: 10px 0;"></div>
            <div>
                <span>4.填入文件保存路径，不填的话 默认当前目录下的video</span> 
                <label for="dirPath">保存路径：</label>
                <input id="dirPath" type="text" id="dirPath" name="dirPath" placeholder="文件路径">
            </div>
            <div style="width: 1px;height: 1px;padding: 10px 0;"></div>
            <button id="myBtn">提交</button>
            <div style="width: 10px;height: 10px;"> </div>
            
            <div style="width: 90%;height: 1px;background-color: #dcdfe6;margin: 10px 0;"></div>
            <button id="updateYouKu">升级油猴插件</button>
            <button style="margin-left:20px;" id="myBtn2">当下载后时长与现网时长不一致就 点击这里 再下载</button>
        </div>
      </div>`;

    document.body.appendChild(ele);
    setTimeout(() => {
        // 两秒后开始绑定事件
        document.getElementById('youKuInputBox').style.opacity = '1';
    }, 2000)
    setTimeout(() => {
        instInp();
        instInp2()
        instInp3();
        initBtn();
        initBtn2();
        initBtn3();
        initBtn4();
    },1000)
}
let NomlClass = function (ele,color){
    color = color || '#409eff';
    ele.style.padding = '9px 15px';
    ele.style.backgroundColor = color;
    ele.style.border = `1px solid ${color}`;
    ele.style.outline = 'none';
    ele.style.color = 'white';
    ele.style.borderRadius = '3px';
}

let NomlInputClass = function (ele){
    ele.style.backgroundColor = '#fff';
    ele.style.border = '1px solid #dcdfe6';
    ele.style.borderRadius = '4px';
    ele.style.boxSizing = 'border-box';
    ele.style.color = '#606266';
    ele.style.display = 'inline-block';
    ele.style.fontSize = 'inherit';
    ele.style.height = '40px';
    ele.style.lineHeight = '40px';
    ele.style.outline = 'none';
    ele.style.padding = '0 15px';
    ele.style.transition = 'border-color .2s cubic-bezier(.645,.045,.355,1)';
    ele.style.width = '100%';

    ele.addEventListener('focus',function(){
        ele.style.borderColor = '#409eff';
    })
    ele.addEventListener('blur',function(){
        ele.style.borderColor = '#dcdfe6';
    })
}
let betterIds = function () {
    // 将id空格和换行变成逗号
    let ids1 =  idsStr.replace(/\s/g, ",");
    // 防止写错先替换中文逗号先
    let ids = ids1.replace(/，/g, ",");
    let idsList = ids.split(',');
    // 去重
    idsList = [...new Set(idsList)];
    return idsList;
}


function getCookie(name) {
    let cookieArr = document.cookie.split(";");

    for (let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");

        // Removing whitespace at the beginning of the cookie name
        while (cookiePair[0].charAt(0) === " ") {
            cookiePair[0] = cookiePair[0].substring(1);
        }

        if (cookiePair[0] === name) {
            return decodeURIComponent(cookiePair[1]);
        }
    }

    return "";
}

let getUrl = function (ids) {
    let urls = [];
    let ccode = '0502';
    let cKey = 'DIl58SLFxFNndSV1GFNnMQVYkx1PP5tKe1siZu/86PR1u/Wh1Ptd+WOZsHHWxysSfAOhNJpdVWsdVJNsfJ8Sxd8WKVvNfAS8aS8fAOzYARzPyPc3JvtnPHjTdKfESTdnuTW6ZPvk2pNDh4uFzotgdMEFkzQ5wZVXl2Pf1/Y6hLK0OnCNxBj3+nb0v72gZ6b0td+WOZsHHWxysSo/0y9D2K42SaB8Y/+aD2K42SaB8Y/+ahU+WOZsHcrxysooUeND'
    let utid = getCookie('cna');
    let client_ts = Math.floor(Date.now() / 1000).toString();
    let client_ip = '192.168.1.1';
    cKey = encodeURIComponent(cKey);

    for (let i = 0; i < ids.length; i++) {
        if (!ids[i]) continue;
        let id = ids[i];
        // 去除id空格
        const pattern = /[\s/,]/g;
        id = id.replace(pattern, '');
        let time = Date.now();
        let baseUrl = `https://ups.youku.com/ups/get.json?vid=${id}&ccode=${ccode}&client_ip=${client_ip}&client_ts=${client_ts}&ckey=${cKey}&utid=${utid}&_t=${time}`;
        urls.push({url:baseUrl, id});
    }
    // console.log(urls);
    return urls;
}

async function sendGETRequest(data) {
    try {
        const response = await fetch(data.url, {method: 'GET', credentials: 'include'});
        if (response.ok) {
            let text = await response.text(); // 或者 .json() 如果返回的是 JSON 数据
            text = JSON.parse(text);
            return await betterUrlData(text,data.id);
        } else {
            console.error('Error: ', response.statusText);
        }
    } catch (error) {
        console.error('Request failed:', error);
    }
}

let getStream = function (data,streams){
    let result = streams[streams.length - 1]||[];
    let lang = 'guoyu';
    let dvd = data.dvd;

    if (dvd&&dvd.audiolang&&Array.isArray(dvd.audiolang)&&dvd.audiolang.length>1){
        streams.forEach( item => {
            if (item.audio_lang === lang){
                result = item;
            }
        });
    }
    return [result];
}
let removeSpecialCharacters = function(str) {
    // 去除制表符、换行符
    str = str.replace(/\t|\n|\r/g, '');
    // 去除其他非数字、字母、汉字和空格的字符
    return str.replace(/[^\w\s\u4e00-\u9fa5]/g, '');
}
let betterUrlData = function (data,id) {
    return new Promise((resolve, reject) => {
        let error = data.data.error || null;
        if (error) {
            console.log(error);
            resolve({error,id:id||''});
            return;
        }
        let PTitle = '';
        let stage = '';
        let time = Date.now();
        try {
            PTitle = data.data.show.title;
            stage = data.data.show.stage;
        }catch(e){
            PTitle = `${time}未知`;
            stage = `${time}未知`;
        }
        let RTitle = data.data.video.title;
        let stream = getStream(data.data,data.data.stream);
        // let stream = [data.data.stream[data.data.stream.length - 1]] || [];
        // let stream = data.data.stream || [];
        PTitle = removeSpecialCharacters(PTitle);
        RTitle = removeSpecialCharacters(RTitle);
        let betterData = {
            PTitle,
            RTitle,
            stream,
            error,
            id,
            stage,
            onlyMp4
        };
        // fileData.push(betterData);
        resolve(betterData);
    })
}

// XNTkzNTE4MjE5Mg==,XNTkzNzYyNTY2OA==，XNjI5MTIxMjMwMA==
// XNTkzNzYyNTY2OA==


setTimeout(function () {
    initElement();
}, 3000);
