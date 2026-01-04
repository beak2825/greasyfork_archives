// ==UserScript==
// @name         文泉学堂下载
// @namespace    
// @version      0.54.6
// @author       
// @grant        none
// @description  基于Culaccino的文泉学堂PDF下载0.53版本，适应了新的页面。仅在chrome中测试成功。使用方法：打开电子书页面后，在页面中任意点击一次，然后点击左上角页码框，即开始下载。
// @match        https://*.wqxuetang.com/read/pdf?*
// @require      https://cdn.staticfile.org/jspdf/1.5.3/jspdf.min.js
// @run-at       document-start

// @downloadURL https://update.greasyfork.org/scripts/447413/%E6%96%87%E6%B3%89%E5%AD%A6%E5%A0%82%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/447413/%E6%96%87%E6%B3%89%E5%AD%A6%E5%A0%82%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    const downloadNum = 30 //每次达到此页数就自动保存，可根据实际情况改动
    var imgBox, nowPage,startPage, allPage, doc, size, name, startNum = 1,isStart = false, isReady = false, pageList, dataIndex, beginTime = new Date(),dataList = {}
    const baseURL = `https://${window.location.host}/`
    
    const bid = window.location.href.replace(baseURL + "read/pdf?bid=", "")
    
    Array.prototype.remove = function (val) {
        const index = this.indexOf(val);
        if (index > -1) this.splice(index, 1)
    }
    function print() {
        console.log(...arguments)
    }
    function sleep(min, max) {
        min *= 1000;
        max *= 1000;
        const time = !min ? max : Math.floor(Math.random() * (max - min + 1)) + min;
        print('等待时间：', time)
        return new Promise((resolve) => setTimeout(resolve, time));
    }
    function createList(now) {
        let arr = []
        for (let i = now || nowPage; i < Math.min((now || nowPage) + downloadNum, allPage + 1); i++) arr.push(i)
        startNum = arr[0]
        return arr
    }
   
    function savePDF(num) {
        doc.save(`${name}_${num !== allPage ? num - downloadNum + 1 : num - (num - startPage)%downloadNum}-${num}.pdf`)
        if (num !== allPage) doc = new jspdf.jsPDF(size[0] < size[1] ? "" : "l", 'pt', size)
        print("总耗时 " + parseInt((new Date() - beginTime) / 1000 / 60) + " 分钟")
    }
    function getName() {
        name = document.getElementsByClassName("page-head-s")[0].innerHTML
    }

    function getCanvasContext(canvas) {
        return canvas.__proto__.getContext.call(canvas,"2d");
    }

    function loadScript(src) {
        let spt = document.createElement('script')
        spt.src = src
        spt.type = 'text/javascript'
        let header = document.getElementsByTagName('header')[0]
        header.appendChild(spt)
    }

    function antiAntiDebug() {
        if((function(){}).constructor === Function) {
            Function.prototype.constructor = function(){}
        }
    }
    async function autoScroll(num, isCorrect = true) {
        if (pageList[num - 1] === pageList[pageList.length - 1]) num = 0
        print('从第' + pageList[num] + '页开始, 索引号：' + num + ', 共' + pageList.length + '页')

        for(let p = 0; p < pageList.length; p++) {
            let pageNo = pageList[p]
            //document.documentElement.scrollTop = imgBox[pageList[num]].offsetTop
            imgBox[pageNo].scrollIntoView()
            let bandImgs = imgBox[pageNo].childNodes[1]
            let waitTimes = 3;
            while (bandImgs.children.length <= 0 && waitTimes-- > 0) {
                await sleep(8, 10)
            }

            if(size == undefined) {
                size = [0, 0]
                for( i = 0; i < bandImgs.children.length; i++) {
                    var img = bandImgs.childNodes[i]
                    while(!img.complete) {
                        await sleep(0.5,1)
                    }
                    let w = img.naturalWidth, h=img.naturalHeight
                    size = [size[0] + w, h]
                }
                var canvas = document.createElement("canvas");
                canvas.width = size[0]
                canvas.height = size[1]
                print('页面：', size[0], 'X', size[1])
            }

            if (doc == undefined) {
                doc = new jspdf.jsPDF(size[0] < size[1] ? "" : "l", 'pt', [size[0], size[1]])
            }

            var startX = 0
            for(var i = 0; i < bandImgs.children.length; i++) {
                img = bandImgs.childNodes[i]
                while(!img.complete) {
                    await sleep(0.5,1)
                }
                let w = img.naturalWidth, h=img.naturalHeight

                //print('图像：', w, h)
                getCanvasContext(canvas).drawImage(img, startX, 0, w, h);
                startX += w
            }
            //var image = canvas.toDataURL("image/png");
            //canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            //window.location.href=image;
            //var w=window.open('about:blank','image from canvas')
            //w.document.write("<img src='"+image+"' alt='from canvas'/>");

            doc.addImage(canvas, 'JPEG', 0, 0, size[0], size[1], undefined, 'SLOW')
            getCanvasContext(canvas).clearRect(0, 0, size[0], size[1]);
            print('pageNo：', pageNo, ',  p', p, '/', pageList.length -1)

            if ((p + 1) % downloadNum === 0) {
                savePDF(pageNo)
                pageList = createList(pageNo + 1)
                p = -1
            } else if (p == allPage || p == pageList.length - 1) {
                isStart = !isStart
                savePDF(pageList[0])
                return
            } else {
                doc.addPage()
            }
        }
    }

    function main() {
        if(!isReady) {
            print("正在启动插件...")
            loadScript('https://cdn.staticfile.org/jspdf/2.5.1/jspdf.umd.js')

            document.getElementsByClassName("page-head-nav")[0].onclick = function () {
                if (!isStart) {
                    print("开始下载......")
                    const numBox = document.getElementsByClassName("page-head-tol")[0].innerHTML
                    getName()
                    imgBox = document.getElementsByClassName("page-img-box")
                    startPage = nowPage = parseInt(numBox.slice(0, numBox.indexOf("/") - 1))
                    allPage = imgBox.length - 1
                    isStart = !isStart
                    pageList = dataIndex = createList()
                    autoScroll(0)
                } else return
            }
            window.onbeforeunload = function () {if (isStart) return "leave？"}
            window.removeEventListener('click', main)
            print("启动插件成功，请点击左上角页码框开始下载。")
        }
    }

    if (window.addEventListener) {
        window.addEventListener('DOMContentLoaded', main, false);
        window.addEventListener('load', main, false);
        window.addEventListener('click', main, false);
    } else if (window.attachEvent) {
        window.attachEvent('onload', main); //IE
    }

    antiAntiDebug();
    //setTimeout(main, 3000)
})();