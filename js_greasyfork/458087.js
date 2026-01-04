// ==UserScript==
// @name         国家中小学智慧教育平台 免登录查看电子课本
// @namespace    https://gist.github.com/htfc786/3b8a7b79c927ceefc6ebc1c56eb839ce
// @version      0.3.0
// @description  国家中小学智慧教育平台免登录查看电子课本 by htfc786
// @author       htfc786
// @match        https://basic.smartedu.cn/tchMaterial/*
// @icon         https://basic.smartedu.cn/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458087/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%20%E5%85%8D%E7%99%BB%E5%BD%95%E6%9F%A5%E7%9C%8B%E7%94%B5%E5%AD%90%E8%AF%BE%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/458087/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%20%E5%85%8D%E7%99%BB%E5%BD%95%E6%9F%A5%E7%9C%8B%E7%94%B5%E5%AD%90%E8%AF%BE%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    function log(message){
        console.log("免登录查看电子课本脚本:",message);
    }
    log("script run...")

    const INFOAPI = "https://s-file-2.ykt.cbern.com.cn/zxx/ndrs/resources/tch_material/details/";
    var if_big = false;

    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
        }
        return(false);
    }
    function removeMessageBox() {
        let messageBoxDom = document.querySelector(".fish-modal-root")
        if (!messageBoxDom){
            setTimeout(removeMessageBox,10);
            return
        }
        messageBoxDom.outerHTML = ""
        messageBoxDom.classList = []
    }
    var contentId = getQueryVariable("contentId");
    var requests_url = INFOAPI + contentId + ".json";

    var xhr = new XMLHttpRequest();
    xhr.open("get", requests_url, true);

    xhr.onload = function (e) {
        //转换json
        var data = JSON.parse(e.currentTarget.responseText);
        var PdfUrl = data.ti_items[1].ti_storages[0];
        //获取到PdfUrl
        log("PdfUrl: "+PdfUrl);
        let pdfShow = document.querySelector("#main-content > div.content > div.index-module_special-edu-detail_aH1Nr > div > div > div.imageList-module_special-edu-image-list-wrapper_18zfs > div > div");
        if (!pdfShow){
            pdfShow = document.querySelector("#main-content > div.content > div.index-module_special-edu-detail_aH1Nr > div");
            pdfShow.style.cssText = "padding: 0; position: relative; z-index: 1200;"
            document.querySelector("#main-content > div.content > div.index-module_special-edu-detail_aH1Nr").style.cssText = " height: 600px;";
            document.body.style.cssText = "";
        }
        removeMessageBox();
        pdfShow.innerHTML = '加载中...'

        //使用fetch预下载pdf
        fetch(PdfUrl).then((response) => {
            // 进度条：https://blog.csdn.net/milimu/article/details/135506336
            if (response.status === 200) {
                // 进度条相关
                // 获取 Response 对象的 body 属性的读取器（reader）。body 属性是一个可读的流（ReadableStream），可以用来读取响应体的数据。
                const reader = response.body.getReader();
                const contentLength = +response.headers.get('Content-Length');
                let receivedLength = 0;
                let chunks = [];
                // 读取一个数据块。这个方法返回一个 Promise，当一个数据块被读取时，这个 Promise 就会解析为一个包含 done 和 value 属性的对象。done 属性表示是否已经读取完所有数据，value 属性是一个 Uint8Array，包含了读取到的数据块。
                return reader.read().then(function processChunk({ done, value }) {
                    if (done) {
                        //console.log('下载完成');
                        pdfShow.innerHTML = '下载完成'
                        // 将 chunks 数组中的所有数据块复制到一个新的 Uint8Array 中，然后使用这个 Uint8Array 创建一个 Blob 对象
                        let data = new Uint8Array(receivedLength);
                        let position = 0;
                        for(let chunk of chunks) {
                            data.set(chunk, position);
                            position += chunk.length;
                        }
                        return new Blob([data]);
                    }
                    // 将读取到的数据块添加到 chunks 数组中。
                    chunks.push(value);
                    // 更新已接收的数据长度。
                    receivedLength += value.length;
                    // console.log(`已下载：${receivedLength}，总大小：${contentLength}`);
                    // pdfShow.innerHTML = `已下载：${receivedLength}，总大小：${contentLength}`
                    const progerss = receivedLength/contentLength
                    const pre = parseFloat(progerss*100).toFixed(0)
                    pdfShow.innerHTML = `已下载${ pre }%...`
                    // 递归调用 reader.read()，直到读取完所有数据。
                    return reader.read().then(processChunk);
                });
            } else {
                // console.log('下载失败')
                pdfShow.innerHTML = `下载失败`
            }
        }).then((response)=>{
            // 读取器，读取blob,转换pdf
            const blob = new Blob([response], {
                type: "application/pdf",
            });
            let PdfUrl = URL.createObjectURL(blob)

            log("ObjectURL: "+PdfUrl);

            pdfShow.innerHTML = '<embed id="pdfWatch" src="'+ PdfUrl +'" style="height: 100%; width: 100%; " />'
            pdfShow.innerHTML += '<a id="pdfBig" target="_blank" style="width: 60px;height: 20px;background-color: rgba(102,204,255,0.5);position: absolute;text-align: center;line-height: 20px;color: #fff;font-size: 12px;left: 0;top: 0;z-index: 100000;">网页全屏</a>'

            document.body.innerHTML += '<a href="'+PdfUrl+'" target="_blank" style="width: 70px; height: 60px; background-color: red; position: fixed; text-align: center; line-height: 30px; color: #fff; font-size: 20px; left: 0; bottom: 0; z-index: 1100;">新页面打开</a>'

            let bodycssbak = "";
            //监听全屏按钮
            var pdfBig = document.querySelector("#pdfBig");
            var pdfWatch = document.querySelector("#pdfWatch");
            pdfBig.onclick = function (){
                if (if_big){
                    pdfWatch.style.cssText = "height: 100%; width: 100%;";
                    pdfBig.style.cssText = "width: 60px;height: 20px;background-color: rgba(102,204,255,0.5);position: absolute;text-align: center;line-height: 20px;color: #fff;font-size: 12px;left: 0;top: 0;z-index: 100000;";
                    pdfBig.text = '网页全屏';
                    document.body.style.cssText = bodycssbak
                    if_big = false;
                } else {
                    pdfWatch.style.cssText = `width: 100%;height: 100%;position: fixed;top: 0;right: 0;bottom: 0;left: 0;z-index: 100000;`;
                    pdfBig.style.cssText = "width: 60px;height: 20px;background-color: rgba(102,204,255,0.5);position: fixed;text-align: center;line-height: 20px;color: #fff;font-size: 12px;left: 0;top: 0;z-index: 1000000;";
                    pdfBig.text = "取消全屏";
                    bodycssbak = document.body.style.cssText
                    document.body.style.cssText+="overflow: hidden;"
                    if_big = true;
                }
            }
            removeMessageBox();
        })
        removeMessageBox();
    }

    let waittime = 0;
    let wait = () => {
        if (waittime>500){
            log("wait too many times!!!")
            log("exit")
            return;
        }
        if(!document.querySelector("#main-content > div.content > div.index-module_special-edu-detail_aH1Nr > div > div > div.imageList-module_special-edu-image-list-wrapper_18zfs > div > div")
           && !document.querySelector("#main-content > div.content > div.index-module_special-edu-detail_aH1Nr > div")){
            waittime++;
            log("wait...")
            setTimeout(wait, 100)
            return;
        }
        log("send request")
        xhr.send();
        removeMessageBox();
    }
    wait()
})();