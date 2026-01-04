// ==UserScript==
// @name         Javdb便捷存入清单
// @namespace    https://greasyfork.org/zh-CN/scripts/532552
// @version      2025011801
// @description  用于快速将当前的视频存入清单!
// @author       Dong
// @license      MIT
// @icon         https://javdb.com/favicon-32x32.png
// @include      /^https?:\/\/(\w*\.)?javdb(\d)*\.com\/v.*$/
// @match        *://*.javdb.com/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @connect      javdb.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/532552/Javdb%E4%BE%BF%E6%8D%B7%E5%AD%98%E5%85%A5%E6%B8%85%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/532552/Javdb%E4%BE%BF%E6%8D%B7%E5%AD%98%E5%85%A5%E6%B8%85%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle('.jd-message{position:fixed;top:20px;left:50%;transform:translate(-50%);z-index:9999;font-size:14px;padding: 11px 15px;border-radius: 4px;}.jd-message__default{background-color:rgb(243.9,244.2,244.8);border:1px solid rgb(232.8,233.4,234.6);color:#909399}.jd-message__success{background-color:rgb(239.8,248.9,235.3);border:1px solid rgb(224.6,242.8,215.6);color:#67c23a}.jd-message__warning{background-color:rgb(252.5,245.7,235.5);border:1px solid rgb(250,236.4,216);color:#e6a23c}.jd-message__error{background-color:rgb(254,240.3,240.3);border:1px solid rgb(253,225.6,225.6);color:#f56c6c}.jb-list{padding: 15px 12px;box-sizing:border-box;display:flex;flex-wrap:wrap;justify-content:flex-start;gap:10px;width:100%;height:100%;z-index:1;transition:right 0.2s ease-in-out;color:#000}.jb-button{position:relative;display:flex;align-items:center;justify-content:center;box-sizing:border-box;padding:3px 10px;border-radius:4px;font-weight:500;font-size:14px;border:1px solid #dcdfe6;color:#606266;cursor:pointer}.jb-button:visited{color:#606266}.jb-button:hover{text-decoration:none;color:#409eff;border:1px solid #c6e2ff;background-color:#ecf5ff}.jb-button_green{color:#fff !important;background-color:#67c23a}.jb-button_green:hover{color:#fff !important;background-color:#95d475}.jb-button_red{color:#fff !important;background-color:#f56c6c}.jb-button_red:hover{color:#fff !important;background-color:#f89898}.jb-loading{display:inline-block;width:14px;height:14px;margin-right:10px;border:2px dashed #dcdfe6;border-top-color:transparent;border-radius:100%;animation:btnLoading infinite 1s linear}@keyframes btnLoading{0%{transform:rotate(0)}to{transform:rotate(360deg)}}')


    /* globals jQuery, $, waitForKeyElements */
    console.log('!!!')
    const jbRoot = document.createElement('div')
    jbRoot.classList.add('jb-list')

    const downloadBtn = document.createElement('button')
    downloadBtn.innerText = '下载保存'
    downloadBtn.classList.add('jb-button')
    downloadBtn.classList.add('jb-button_red')
    downloadBtn.addEventListener('click', function() {
        openDetailedList()
        readFolder(compose(downloadToFolder, formatFolder))
    })

    const tempBtn = document.createElement('button')
    tempBtn.innerText = '临时保存'
    tempBtn.classList.add('jb-button')
    tempBtn.classList.add('jb-button_green')
    tempBtn.addEventListener('click', function() {
        openDetailedList()
        readFolder(compose(saveToFolder, formatFolder))
    })

    jbRoot.appendChild(downloadBtn)
    jbRoot.appendChild(tempBtn)
    $('.movie-panel-info').append(jbRoot)

    function downloadToFolder(folders) {
        handleDownload(folders)
        // 从临时保存中移除
        folders.forEach((item)=> {
            if(!checkIsDownloadPackage(item.folderName) && $(item.origin).find('input').is(':checked')) {
                $(item.origin).find('input').click()
            }
        })
    }

    function handleDownload(folders) {
        // const downloadPackage = ['預設清單', 'download', '已下载']
        let saved = false
        for(let i=0; i<folders.length; i++) {
            const item = folders[i]
            if (checkIsDownloadPackageWithStart(item.folderName) && item.folderNumber < 500) {
                $(item.origin).find('input').click()
                saved = true
                break
            }
        }
        if (!saved) {
            showMessage('下载文件夹空间不够了', 'error')
        } else {
            showMessage('存入下载文件夹成功', 'success')
            setTimeout(()=> {
                $('#modal-save-list').find('.delete').click()
                console.log( $('#tabs-container').offset().top)

                document.scrollingElement.scrollTo({top: $('#tabs-container').offset().top - 100})
            }, 100)

        }
    }

    function checkIsDownloadPackageWithStart(folderName) {
        const downloadPackage = ['download', '預設清單', '已下载']
        return downloadPackage.reduce((ori, item)=> {
            return ori || (folderName.includes(item) && folderName.startsWith(item))
        }, false)
    }

    function saveToFolder(folders) {
        // 包含savedPackage内则代表已下载
        const downloaded = folders.reduce((ori, item)=> {
            return ori || ($(item.origin).find('input').is(':checked') && checkIsDownloadPackage(item.folderName))
        }, false)
        console.log('downloaded >>> ', downloaded)
        if (downloaded) {
            showMessage('下载过了吧', 'warning')
            return
        }
        const checkedFolder = folders.filter(item=> $(item.origin).find('input').is(':checked'))
        if (checkedFolder.length === 0) {
            // 没有被保存过
            handleSave(folders)
            return
        }
        // 被保存过
        const temped = folders.reduce((ori, item)=> {
            return ori || ($(item.origin).find('input').is(':checked') && checkIsTempPackage(item.folderName))
        }, false)
        console.log('temped >>> ', temped)
        if (temped) {
            showMessage('保存过了吧', 'warning')
            return
        } else {
            showMessage('保存过但没在临时或待下载清单里', 'error')
        }

    }

    function handleSave(folders) {
        // const tempPackage = ['待下载', '临时']
        let saved = false
        for(let i=0; i<folders.length; i++) {
            const item = folders[i]
            if (checkIsTempPackage(item.folderName) && item.folderNumber < 500) {
                $(item.origin).find('input').click()
                saved = true
                break
            }
        }
        if (!saved) {
            showMessage('临时文件夹空间不够了', 'error')
        } else {
            showMessage('存入临时或待下载清单成功', 'success')
        }
    }

    function checkIsTempPackage(folderName) {
        const tempPackage = ['待下载', '临时']
        return tempPackage.reduce((ori, item)=> {
            return ori || folderName.includes(item)
        }, false)
    }

    function checkIsDownloadPackage(folderName) {
        const downloadPackage = ['download', '預設清單', '已下载']
        return downloadPackage.reduce((ori, item)=> {
            return ori || folderName.includes(item)
        }, false)
    }


    function formatFolder(folderList){
        const folderArr = []
        folderList.each(function(){
            const folderText = $(this).text().replace(/[\s\n]/g, "")
            folderArr.push({
                origin: this,
                folderNumber: extractFolderNumber(folderText),
                folderName: extractFolderName(folderText),
                originText: folderText
            })
        })
        return folderArr
    }
    let count = 0
    let timeoutInstance = null
    function readFolder(cb) {
        count++
        const folderList = $('.modal-card-body').find('p.control')
        if (count >= 100){
            if (timeoutInstance !== null) {
                clearTimeout(timeoutInstance)
                timeoutInstance = null
            }
            count = 0
            return []
        }
        if (!folderList || folderList.length === 0) {
            timeoutInstance = setTimeout(function(){
                readFolder(cb)
            },100)
        } else {
            cb(folderList)
        }
    }

    function openDetailedList() {
        $('#save-list-button').click()
    }


    function extractFolderName(str){
        return str.replace(/\([^)]*\)/g, '');
    }

    function extractFolderNumber(str){
        const resultMatch = str.match(/\(([^)]+)\)/);
        const value = resultMatch ? resultMatch[1] : null;
        return +value
    }

    function compose(...fns) {
        return function (input) {
            return fns.reduceRight((value, fn) => fn(value), input);
        };
    }
    const messageInstance = []
    function showMessage(message, type = 'default') {
        const messageBox = document.createElement('div')
        messageBox.classList.add('jd-message')
        messageBox.classList.add(`jd-message__${type}`)
        messageBox.innerText = message
        messageBox.style.top = `${20 * (messageInstance.length + 1) + messageInstance.length * 44.6}px`

        messageInstance.push(messageBox)
        document.body.appendChild(messageBox)
    }

    // Your code here...
})();