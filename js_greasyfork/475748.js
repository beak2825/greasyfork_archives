// ==UserScript==
// @name         zip解压工具
// @namespace    unzipandreadtext
// @version      1.0.2
// @description  传入zip文件链接，返回其中第一个txt文件中的内容。
// @author       sehuatang_chen
// @license      MIT

// @grant        GM_xmlhttpRequest
// ==/UserScript==
(function(){
    let script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.src = "https://cdn.bootcdn.net/ajax/libs/jszip/3.9.1/jszip.min.js";
    document.documentElement.appendChild(script);
})()
const headers={
    'User-agent': navigator.userAgent,
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
}
//下载并解压入参地址的zip文件。不支持密码。返回Promise
function readZip(link) {
    return new Promise((resolve, reject) => {
        const jszip = new JSZip()
        let _header = {
            ...headers,
            'Referer':link
        }
        GM_xmlhttpRequest({
            method: 'GET',
            url: link,
            headers: _header,
            responseType: 'blob',
            onload: (result) => {
                if (result.status === 200 || result.status === 304) {
                    jszip.loadAsync(result.response).then(zip => resolve(zip)).catch(err => reject(err));
                }else{
                    console.log(result)
                    reject("download err.")
                }
            }
        });
    })
}
//下载并解压入参地址的zip文件，文本方式读取其中第一个文件的内容。不支持密码。返回Promise
// readfirsttxtfileinzip(zipdownloadlink).then( text => {
//     console.log(text)
// }).catch( error => {
//     console.log(error)
// })
function readfirsttxtfileinzip(link){
    return readZip(link).then(zip => {
        for (let key in zip.files) {
            if (!zip.files[key].dir) {
                return zip.file(zip.files[key].name).async('string')
            }
        }
    })
}
