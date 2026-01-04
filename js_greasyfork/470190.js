// ==UserScript==
// @name         中小学教材下载工具
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  下载工具
// @match        https://book.pep.com.cn/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.0/FileSaver.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.9.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
// @grant        GM_registerMenuCommand
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/470190/%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%95%99%E6%9D%90%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/470190/%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%95%99%E6%9D%90%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const { jsPDF } = window.jspdf

    const download = async (type = 'image') => {
        let msg = '数据越多需要等待时间越长，一般会在1分钟以内开始下载\n关闭弹窗后开始处理'
        if (type == 'pdf') {
            msg = '数据越多需要等待时间越长，一般会在1分钟以内开始下载\n数据过多时将会分为多个pdf进行下载，需自己手动合并\n如果无法下载可手动修改代码降低单个pdf大小(limit)或使用压缩下载\n关闭弹窗后开始处理'
        } else if (type == 'pdfCompressed') {
            msg = '只保存为单个pdf，文件体积小，但需耗费较多时间（大约为未压缩时的5~10倍）\n关闭弹窗后开始处理'
        }
        alert(msg)

        let maxPage = document.querySelector('#currentPageIndexTextField').value.split('/').pop()
        let softName = document.title
        let fileExtension = 'jpg'
        let id = location.pathname.split('/')[1]
        let imgList = []
        for (let i = 1; i <= maxPage; i++) {
            imgList.push(`https://book.pep.com.cn/${id}/files/mobile/${i}.${fileExtension}`)
        }
        console.log(imgList);

        if (type == 'image') {
            let promiseList = []
            let fileExtension = imgList[0].split('?')[0].split('.').pop()
            for (let img of imgList) {
                console.log(img);
                promiseList.push(new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'get',
                        url: img,
                        responseType: 'blob',
                        onload(xhr) {
                            resolve(xhr.response)
                        }
                    })
                }))
            }
            let list = await Promise.all(promiseList)
            let zip = new JSZip();
            let folder = zip.folder('images')
            for (let i = 0; i < list.length; i++) {
                console.log(`${i + 1}/${maxPage}`)
                folder.file(`${i + 1}.${fileExtension}`, list[i], { blob: true })
            }
            console.log('正在打包成压缩包......');
            zip.generateAsync({ type: 'blob' }).then((content) => {
                saveAs(content, `${softName}.zip`)
            })
        } else if (type == 'pdf') {
            let promiseList = []
            let { width, height } = await getPdfSize(imgList[0], fileExtension)
            console.log(width, height);
            for (let img of imgList) { promiseList.push(getImageData(img, width, height, fileExtension)) }
            let imgDataList = await Promise.all(promiseList)
            let imgDataListSplit = []
            // 单个pdf大小限制
            let limit = Math.pow(2, 26)
            let length = 0
            let tempList = []
            for (let i = 0; i < imgDataList.length; i++) {
                let imgData = imgDataList[i]
                length += imgData.length
                if (length < limit) {
                    tempList.push(imgData)
                } else {
                    imgDataListSplit.push(tempList)
                    length = imgData.length
                    tempList = [imgData]
                }
                if (i == imgDataList.length - 1) {
                    imgDataListSplit.push(tempList)
                }
            }
            console.log(imgDataListSplit);
            for (let i = 0; i < imgDataListSplit.length; i++) {
                let imgDataList = imgDataListSplit[i]
                let pdf = new jsPDF(width > height ? 'l' : 'p', 'pt', [width, height])
                for (let j = 0; j < imgDataList.length; j++) {
                    console.log(`${j + 1}/${imgDataList.length}(${i + 1}/${imgDataListSplit.length})`)
                    let imgData = imgDataList[j]
                    pdf.addImage(imgData, fileExtension, 0, 0, width, height)
                    if (j < imgDataList.length - 1) pdf.addPage()
                }
                if (imgDataListSplit.length == 1) {
                    pdf.save(`${softName}.pdf`)
                } else {
                    pdf.save(`${softName}（${i + 1}）.pdf`)
                }
            }
        } else if (type == 'pdfCompressed') {
            let promiseList = []
            let fileExtension = imgList[0].split('?')[0].split('.').pop()
            let { width, height } = await getPdfSize(imgList[0], fileExtension)
            console.log(width, height);
            for (let img of imgList) { promiseList.push(getImageData(img, width, height, fileExtension)) }
            let imgDataList = await Promise.all(promiseList)
            let pdf = new jsPDF(width > height ? 'l' : 'p', 'pt', [width, height])
            for (let i = 0; i < imgDataList.length; i++) {
                console.log(`${i + 1}/${maxPage}`)
                let imgData = imgDataList[i]
                pdf.addImage(imgData, fileExtension, 0, 0, width, height, '', 'FAST')
                if (i < imgDataList.length - 1) pdf.addPage()
            }
            pdf.save(`${softName}.pdf`)
        }
    }

    const getPdfSize = (imgUrl, fileExtension) => {
        return new Promise((resolve, reject) => {
            if (fileExtension == 'svg') {
                GM_xmlhttpRequest({
                    method: 'get',
                    url: imgUrl,
                    onload(xhr) {
                        let div = document.createElement('div')
                        div.innerHTML = xhr.responseText
                        let viewBox = div.querySelector('svg').getAttribute('viewBox')
                        let list = viewBox.split(' ')
                        let width = Number(list[2])
                        let height = Number(list[3])
                        resolve({
                            width,
                            height
                        })
                    }
                })
            } else {
                let img = document.createElement('img')
                img.src = imgUrl
                img.onload = () => {
                    resolve({
                        width: Number(img.width),
                        height: Number(img.height)
                    })
                }
            }
        })
    }

    const getImageData = (imgUrl, width, height, fileExtension) => {
        return new Promise(async (resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'get',
                url: imgUrl,
                responseType: 'blob',
                onload(xhr) {
                    let res = URL.createObjectURL(xhr.response)
                    let img = document.createElement('img')
                    img.src = res
                    img.onload = () => {
                        let canvas = document.createElement('canvas')
                        let ctx = canvas.getContext('2d')
                        if (fileExtension == 'svg') {
                            canvas.width = width * 2
                            canvas.height = height * 2
                        } else {
                            canvas.width = width
                            canvas.height = height
                        }
                        ctx.fillStyle = 'white'
                        ctx.fillRect(0, 0, canvas.width, canvas.height)
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
                        console.log(imgUrl);
                        resolve(canvas.toDataURL())
                    }
                },
                onerror(e) {
                    console.log('异常', e);
                }
            })
        })
    }

    GM_registerMenuCommand('保存为图片(ctrl+z)', () => {
        return download('image')
    })
    GM_registerMenuCommand('保存为pdf(ctrl+x)', () => {
        return download('pdf')
    })
    GM_registerMenuCommand('压缩保存为pdf(ctrl+v)', () => {
        return download('pdfCompressed')
    })
    window.onkeydown = (event) => {
        if (event.ctrlKey && event.keyCode === 90) download('image')
        if (event.ctrlKey && event.keyCode === 88) download('pdf')
        if (event.ctrlKey && event.keyCode === 86) download('pdfCompressed')
    }
})();