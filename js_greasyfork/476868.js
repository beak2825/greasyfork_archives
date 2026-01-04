// ==UserScript==
// @name        智慧团建名单批量导出
// @namespace   Violentmonkey Scripts
// @match       https://zhtj.youth.cn/zhtj/*
// @grant       none
// @version     1.2
// @author      zx108wl
// @description 2023/10/3 20:16:27
// @require    https://cdn.staticfile.org/jszip/3.5.0/jszip.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476868/%E6%99%BA%E6%85%A7%E5%9B%A2%E5%BB%BA%E5%90%8D%E5%8D%95%E6%89%B9%E9%87%8F%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/476868/%E6%99%BA%E6%85%A7%E5%9B%A2%E5%BB%BA%E5%90%8D%E5%8D%95%E6%89%B9%E9%87%8F%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function () {
    'use strict'

    let creatFlag = true;
    setInterval(() => {
        const url = window.location.href;
        if (url === 'https://zhtj.youth.cn/zhtj/center/tuanyuantw/memberlist') {
            if(creatFlag == true){
                creatFlag = false;
                creatButtonDownload();
            }
        } else {
            //creatButtonDownload();
            creatFlag = true;
        }
    }, 500)




    //延时函数
    function sleep(delay) {
        return new Promise((resolve) => setTimeout(resolve, delay))
    }

    //创建“批量下载”按钮
    function creatButtonDownload() {
        var button = document.createElement("a"); //创建一个按钮
        button.textContent = "批量下载";          //按钮内容
        button.setAttribute('data-v-4b8b3d08', '');
        button.id = "batch-download";
        button.className = "el-button blue  el-button--medium";
        button.style = "margin-bottom: 10px; margin-left: 16px;";
        button.addEventListener("click", buttonDownloadAction);   //监听按钮点击事件
        let temp = document.getElementsByClassName('row')[0];
        temp.appendChild(button); //把按钮加入到 x 的子节点中
    }

    async function buttonDownloadAction() {
        let userId = await getUserId();
        let groupId = await getGroupId(userId);
        let blobList = [];
        for(let element in groupId){
            let blobDirt = {
                'name': groupId[element]['leagueName'],
                'blob': getBlob('https://zhtj.youth.cn/v1/center/tuanweiexportmembers/' + groupId[element]['leagueId'], 'GET'),
            }
            blobList.push(blobDirt);
        }
        downloadZip(blobList);
    }

    async function getUserId() {
        let httpRequest = new XMLHttpRequest();                                                 //创建需要的对象
        let userId = '';
        httpRequest.open('POST', 'https://zhtj.youth.cn/v1/center/queryLeagueCadres', true);    //打开连接
        httpRequest.setRequestHeader('Accept', 'application/json, text/plain, */*');            //设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）
        httpRequest.send();                                                                     //发送请求 将情头体写在send中
        // 获取数据后的处理程序
        httpRequest.onreadystatechange = function () {                      //请求后的回调接口，可将请求成功后要执行的程序写在其中
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {//验证请求是否发送成功
                userId = JSON.parse(httpRequest.responseText)['results']['queryLeagueId'];
            }
        };
        await sleep(200);
        if (httpRequest.readyState != 4) {
            httpRequest.abort();
            userId = 'TimeOut!';
        }
        return userId;
    }

    async function getGroupId(userId) {
        let httpRequest = new XMLHttpRequest();                                                 //创建需要的对象
        let list = '';
        httpRequest.open('POST', 'https://zhtj.youth.cn/v1/center/getorgtree', true);
        httpRequest.setRequestHeader('Accept', 'application/json, text/plain, */*');
        httpRequest.send('queryLeagueId = ' + userId);
        httpRequest.onreadystatechange = function () {                      //请求后的回调接口，可将请求成功后要执行的程序写在其中
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {//验证请求是否发送成功
                list = JSON.parse(httpRequest.responseText)["results"]["leagueList"];
            }
        };
        await sleep(200);
        if (httpRequest.readyState != 4) {
            httpRequest.abort();
            list = 'TimeOut!';
        }
        return list;
    }

    //下载完整zip文件
    function downloadZip(blobList) {
        let zip = new JSZip();
        for (let element in blobList) {
            zip.file(blobList[element]['name'] + '.xlsx', blobList[element]['blob']);
        }
        zip.generateAsync({ type: 'blob' }).then(function (content) {
            let filename = '批量下载(' + blobList.length + ').zip';// 下载的文件名
            let eleLink = document.createElement('a');// 创建隐藏的可下载链接
            eleLink.download = filename;
            eleLink.style.display = 'none';
            eleLink.href = URL.createObjectURL(content);// 下载内容转变成blob地址
            document.body.appendChild(eleLink);// 触发点击
            eleLink.click();
            document.body.removeChild(eleLink);// 然后移除
        });
        alert("成功导出" + blobList.length + "个团支部数据！");
        return zip.size
    }

    //返回文件blob
    async function getBlob(fetchUrl, method = "POST", body = null) {
        const response = await window.fetch(fetchUrl, {
            method,
            body: body ? JSON.stringify(body) : null,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
        });
        const blob = await response.blob();
        return blob;
    }
})()
