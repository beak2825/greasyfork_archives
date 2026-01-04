// ==UserScript==
// @name         文泉学堂即时下载
// @namespace    http://tampermonkey.net/
// @version      0.31
// @description  try to take over the world!
// @author       ycf
// @match        https://*.wqxuetang.com/read/pdf/*
// @grant        none
// @require      https://cdn.staticfile.org/blueimp-md5/2.12.0/js/md5.min.js
// 基于 https://greasyfork.org/zh-CN/scripts/396025-%E6%96%87%E6%B3%89%E5%AD%A6%E5%A0%82pdf%E4%B8%8B%E8%BD%BD 修改
// @downloadURL https://update.greasyfork.org/scripts/396305/%E6%96%87%E6%B3%89%E5%AD%A6%E5%A0%82%E5%8D%B3%E6%97%B6%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/396305/%E6%96%87%E6%B3%89%E5%AD%A6%E5%A0%82%E5%8D%B3%E6%97%B6%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    var imgBox
    var name = ''
    var fuzzyCount = 0 // 连续出现模糊图片计数
    var startPage, allPage = 1
    var isStart, isBanned = false
    var pageList = []
    var coverMD5, lastMD5
    const fuzzyCountLimit = 3 // 连续出现模糊图片的次数达到此值，脚本暂停
    const limitNum = [64655, 22471]
    const limitMD5 = ["aba56eca9b49564cb47bce3f57bd14c2", "d9fff72044ac9a2726972b9dba58aa4e"]
    // 用于获取书名
    const baseURL = `https://${window.location.host}/`
    if(baseURL.indexOf("www") > -1){window.location.href=window.location.href.replace("www","lib-nuanxin")}
    const bid = window.location.href.replace(baseURL + "read/pdf/","")
    const agent = navigator.userAgent
    const headers = {
        "headers": {
            "User-Agent": agent,
            "Accept": "*/*",
            "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
            "Cache-Control": "max-age=0"
        },
        "referrer": window.location.href,
        "method": "GET"
    }
    Array.prototype.remove = function (val) {
        const index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    }
    function sleep (max,min) {
        const time = !min ? max : Math.floor(Math.random() * (max - min + 1) ) + min;
        return new Promise((resolve) => setTimeout(resolve, time));
    }
    function imgCheck(c){
        if(c.length in limitNum && md5(c) in limitMD5){
            return false
        }
        return true
    }
    function getName(v){
        name = v.data.name
    }
    function getInfo(url){
        const data = fetch(url, headers).then(function(res){
            if(res.status >=200 && res.status <300){
                return res.json();
            }else{
                throw new Error(res.statusText)
            }
        })
        data.then(v=>{getName(v)})
    }
    function downloadImg(content, fileName) { //下载base64图片
        var base64ToBlob = function(code) {
            let parts = code.split(';base64,');
            let contentType = parts[0].split(':')[1];
            let raw = window.atob(parts[1]);
            let rawLength = raw.length;
            let uInt8Array = new Uint8Array(rawLength);
            for(let i = 0; i < rawLength; ++i) {
                uInt8Array[i] = raw.charCodeAt(i);
            }
            return new Blob([uInt8Array], {
                type: contentType
            });
        };
        let aLink = document.createElement('a');
        let blob = base64ToBlob(content); //new Blob([content]);
        let evt = document.createEvent("HTMLEvents");
        evt.initEvent("click", true, true); //initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
        aLink.download = fileName;
        aLink.href = URL.createObjectURL(blob);
        aLink.click();
    }
    async function autoScroll(index){ // 自动滚动并下载当前页面图片
        if (!isStart){
            return
        }
        if (pageList.length === 0) {
            console.log('结束')
            alert('运行结束')
            isStart = false
            return
        }
        if (index >= pageList.length){
            index = 0
        }
        console.log(`跳转到${pageList[index]}页`)
        document.documentElement.scrollTop = imgBox[pageList[index]].offsetTop // 跳转到对应页
        let src = imgBox[index].firstChild.getAttribute("src")
        if(!src || src.indexOf("data:image/") === -1){ // 未获取到清晰图片，稍作等待
            await sleep(3000,5000) // 等待时间范围，可调整
            src = imgBox[pageList[index]].firstChild.getAttribute("src")
        }
        if(!src || src.indexOf("width=160") > -1 || !imgCheck(src)){ // 缩略图，暂时跳过
            fuzzyCount += 1
            if(fuzzyCount >= fuzzyCountLimit){
                isStart = false
                alert(`连续出现 ${fuzzyCount} 次模糊图片，请检查是否需要滑动验证`)
                return
            }
            console.log(`${pageList[index]}页模糊，暂时跳过`)
            autoScroll(index += 1)
        }else{ // base64 图片
            fuzzyCount = 0
            let srcMD5 = md5(src)
            console.log(`MD5: ${srcMD5}`)
            if(!coverMD5 && index === 0 && pageList[index] === 1){ // 封面
                console.log('记录封面 MD5')
                coverMD5 = srcMD5
            }else{ // 其他页面
                if(coverMD5 === srcMD5 || lastMD5 === srcMD5){ // 其他页面出现封面，或和上一张图片一样（解决未从第一页开始下载没有封面数据的情况）
                    isStart = false
                    isBanned = true
                    alert('检测到封面或和上一张图片一样（最后一张下载的可能是封面，注意清理），请刷新或更换IP')
                    return
                }
            }
            lastMD5 = srcMD5 // 记录 MD5
            // 下载图片
            downloadImg(src, `${bid}_${name}_${pageList[index]}.jpg`)
            pageList.remove(pageList[index])
            autoScroll(index)
        }
    }
    window.onload = function(){
        // 获取书名信息
        getInfo("https://lib-nuanxin.wqxuetang.com/v1/read/initread?bid="+bid)
        document.getElementById("pagebox").onclick = function(){
            if (!isStart) { // 未运行
                if (isBanned){ // 因下载到封面而暂停无法直接继续运行，先排查问题
                    alert('请刷新页面（最后一张下载的有可能是封面，注意清理）')
                    return
                }
                if (!imgBox){ // 首次运行
                    console.log('初始化...')
                    const numBox = document.getElementsByClassName("page-head-tol")[0].innerHTML
                    imgBox = document.getElementsByClassName("page-img-box")
                    startPage = parseInt(numBox.slice(0, numBox.indexOf("/") - 1))
                    allPage = imgBox.length - 1
                    console.log(name + ' 共：' + allPage + '页')
                    // 需要下载的范围
                    for(let i = startPage; i <= allPage; i++){
                        pageList.push(i)
                    }
                    console.log(pageList)
                }
                isStart = true
                autoScroll(0)
            }else{ // 运行中
                isStart = false
                alert('当前页面下载后，将暂停运行')
                return
            }
        }
        window.onbeforeunload=function(){
            if(isStart) {
                return "leave？";
            }
        }
    }
})();