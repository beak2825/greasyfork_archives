// ==UserScript==
// @name         girlygirlpic写真一键批量下载
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  girlygirlpic写真批量下载
// @author       ygy
// @match        https://*.girlygirlpic.com/a/*
// @match        https://girlygirlpic.com/a/*
// @require      https://cdn.staticfile.org/jquery/2.1.3/jquery.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/axios/1.1.3/axios.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=girlygirlpic.com
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453902/girlygirlpic%E5%86%99%E7%9C%9F%E4%B8%80%E9%94%AE%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/453902/girlygirlpic%E5%86%99%E7%9C%9F%E4%B8%80%E9%94%AE%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let fileList = []
    function getFIleList(){
        let $imgs = $("picture>img")
        if ($imgs.length==0){
            console.log("error!")
            return false
        }
        console.log("共"+$imgs.length+"张")
        let flist = []
        for (let i=0;i<$imgs.length;i++){
            flist.push({
                path: $imgs[i].getAttribute('data-src'),
                fileName: i+".jpg"
            })
        }
        fileList = flist
        console.log(fileList)
    }
    function handleDownload(file_name) {
        $('.downloadBtn').attr('disabled',true)
        const zip = new JSZip()
        const cache = {}
        const promises = []
        let n = 0
        let pre_str = "共"+fileList.length+"张:"
        setBtnText("已完成"+n+"张",pre_str)
        fileList.forEach((item,index) => {
            // console.log('item', item)
            const promise = getFile(item.path).then(data => {
                // eslint-disable-next-line camelcase
                const file_name = item.fileName
                zip.file(file_name, data, {binary: true})
                n += 1
                setBtnText("已完成"+n+"张",pre_str)
                // cache[file_name] = data
            })
            promises.push(promise)
        })
        Promise.all(promises).then(() => {
            zip.generateAsync({type: 'blob'}).then(content => {
                // 生成二进制流
                // FileSaver.saveAs(content, '文件下载.zip') // 利用file-saver保存文件  自定义文件名
                // eslint-disable-next-line no-undef
                saveAs(content, file_name+'.zip') // 利用file-saver保存文件  自定义文件名
                setBtnText("成功："+n+"失败："+(fileList.length-n),"下载完成！"+pre_str)
                $('.downloadBtn').attr('disabled',false)
            })
        })
    }
    function getFile(url) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'get',
                url: url,
                responseType: 'blob'
                // responseType: 'arraybuffer'
            })
                .then(data => {
                console.log('data', data)
                resolve(data.data)
            })
                .catch(error => {
                reject(error.toString())
            })
        })
    }
    function multiDownload(){
        getFIleList()
        if (fileList.length <= 0){
            alert("没有图片！")
            return false
        }
        let opt = confirm("共获取了"+fileList.length+"张照片，是否开始下载？")
        if (opt == false){
            alert("已终止。。。")
            return false
        }
        handleDownload(getZipName())
    }
    function getZipName(){
        return $(".post-title.entry-title>.on-popunder").text()
    }
    function setBtnText(str,prefix=''){
        $('.downloadBtn').attr('value',prefix+str)
    }
    function insertBtn(){
        let $dev = $(".zilla-social.size-16px")
        let $btn = $('<span><input class="downloadBtn" type="button"  value="批量下载" ></span>')
        $dev.append($btn)
    }
    function scriptStart(){
        insertBtn()
        $('.downloadBtn').on('click',multiDownload)
    }
    setTimeout(scriptStart,5000)


    // Your code here...
})();