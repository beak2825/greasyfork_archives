// ==UserScript==
// @name         Bilibili CV Downloader
// @namespace    https://github.com/hv0905/bilibiliCv_downloader
// @version      1.4
// @description  Easy to download images from BilibiliCV!!
// @author       EdgeNeko(Github@hv0905)
// @match        *://www.bilibili.com/read/cv*
// @grant        GM_download
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @connect      i0.hdslb.com
// @downloadURL https://update.greasyfork.org/scripts/375810/Bilibili%20CV%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/375810/Bilibili%20CV%20Downloader.meta.js
// ==/UserScript==

//Bilibili CV Downloader
//build with love by EdgeNeko
//Github: @hv0905
//github project: https://github.com/hv0905/bilibiliCv_downloader/

'use strict';

const baseDownload = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTQ1Mzk5NzI5NzM1IiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI5MzciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNMTYwIDMyYy0xMiAwLTI0LjggNC44LTMzLjYgMTQuNFMxMTIgNjggMTEyIDgwdjg2NGMwIDEyIDQuOCAyNC44IDE0LjQgMzMuNiA5LjYgOS42IDIxLjYgMTQuNCAzMy42IDE0LjRoNzA0YzEyIDAgMjQuOC00LjggMzMuNi0xNC40IDkuNi05LjYgMTQuNC0yMS42IDE0LjQtMzMuNlYzMDRMNjQwIDMySDE2MHoiIGZpbGw9IiM1QUNDOUIiIHAtaWQ9IjI5MzgiPjwvcGF0aD48cGF0aCBkPSJNOTEyIDMwNEg2ODhjLTEyIDAtMjQuOC00LjgtMzMuNi0xNC40LTkuNi04LjgtMTQuNC0yMS42LTE0LjQtMzMuNlYzMmwyNzIgMjcyeiIgZmlsbD0iI0JERUJENyIgcC1pZD0iMjkzOSI+PC9wYXRoPjxwYXRoIGQ9Ik01MDAuOCA2ODQuOGMzLjIgMi40IDYuNCA0LjggMTEuMiA0LjggNCAwIDgtMS42IDExLjItNC44bDE0Mi40LTEzNmMyLjQtMi40IDMuMi01LjYgMS42LTguOC0xLjYtMy4yLTQtNC44LTcuMi00LjhINTc2di0xMzZjMC00LTEuNi04LTQuOC0xMS4yLTMuMi0zLjItNy4yLTQuOC0xMS4yLTQuOEg0NjRjLTQgMC04IDEuNi0xMS4yIDQuOC0zLjIgMy4yLTQuOCA3LjItNC44IDExLjJ2MTM2SDM2NGMtMy4yIDAtNi40IDEuNi03LjIgNC44LTEuNiAzLjIgMCA2LjQgMS42IDguOGwxNDIuNCAxMzZ6TTcxMiA3NTEuMkgzMTJjLTguOCAwLTE2IDcuMi0xNiAxNnM3LjIgMTYgMTYgMTZoNDAwYzguOCAwIDE2LTcuMiAxNi0xNnMtNy4yLTE2LTE2LTE2eiIgZmlsbD0iI0ZGRkZGRiIgcC1pZD0iMjk0MCI+PC9wYXRoPjwvc3ZnPg==';
var lastDownloadTime = 0;
var missionCount = 0;
var completedMissionCount = 0;
var replaceTarget;
var downloaded = false;

function ondownload() {
    'use strict';
    setNotifyText('开始下载');
    let elements = document.getElementsByClassName('img-box');
    for (let i = 0; i < elements.length; i++) {
        let img = elements[i].querySelector('img').dataset.src;
        if (!img) {
            continue;
        }
        let txt = "";
        if (elements[i].querySelector('.caption')) {
            //caption
            txt = elements[i].querySelector('.caption').innerHTML.trim();
        }
        let imgOriginal = img.split('@')[0];
        let fileName;
        if(txt.length == 0){
            let urlSplit = imgOriginal.split('/');
            fileName = urlSplit[urlSplit.length - 1];
        }else{
            let extSplits = imgOriginal.split('.');
            fileName = txt.replace('\\','_').replace('/','_').replace('?','_').replace(':','_').replace('*','_').replace('|','_').replace('<','_').replace('>','_').replace('"','_') + '.' + extSplits[extSplits.length - 1];
        }
        console.log(`[${i}]准备下载:${imgOriginal}  文件名:${fileName}`);
        missionCount++;
        //瞬间完成
        downloadFileBlob('https:' + imgOriginal, fileName, i);
    }
}

function downloadFileBlob(url, fileName, i) {
    'use strict';
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        responseType: 'blob',
        timeout: 180000,
        onload: function (xhr) {
            let blobURL = window.URL.createObjectURL(xhr.response); // 返回的blob对象是整个response，而非responseText
            saveBlob(blobURL, fileName);
        },
        onprogress: function (xhr) {
            let loaded = parseInt(xhr.loaded / 1000);
            let total = parseInt(xhr.total / 1000);
            console.log(`[${i}]正在下载:${fileName}  进度:${(loaded / total)}`);
        },
    });


}

function saveBlob(blob, fileName) {
    'use strict';
    if (new Date().getTime() - lastDownloadTime < 200) {
        setTimeout(() => {
            saveBlob(blob, fileName);
        }, 200 - (new Date().getTime() - lastDownloadTime));
        return;
    }
    lastDownloadTime = new Date().getTime();
    console.log("正在保存:" + fileName);
    let a = $('<a>')
        .attr('href', blob)
        .attr('download', fileName)
        .appendTo('body');

    a[0].click();

    a.remove();
    window.URL.revokeObjectURL(blob);
    completedMissionCount++;
    checkIfCompleted();
}

function checkIfCompleted() {
    'use strict';
    if (missionCount <= completedMissionCount) {
        alert('所有下载操作已完成!\n你可以关闭网页了');
        setNotifyText('下载完成!');
    } else {
        setNotifyText(`下载进度:${completedMissionCount}/${missionCount}`);
    }
}

function setNotifyText(text) {
    'use strict';
    replaceTarget.children[1].innerText = text;
}



(function () {
    'use strict';
    onload = function () {
        replaceTarget = this.document.getElementsByClassName('help')[0];
        let replaceA = replaceTarget.parentElement;
        replaceA.href = 'javascript:void(0)';
        replaceA.target = '';
        replaceA.onclick = function () {
            if (downloaded) return;
            if (confirm('确认下载全部图片?\n注意:在弹出下载成功提示前请不要关闭窗口,否则无法保证所有图片均下载完成\n要查看进度,请点击F12并转到Console')) {
                ondownload();
                downloaded = true;
            }
        }
        replaceTarget.children[0].style.backgroundImage = 'url(' + baseDownload + ')';
        replaceTarget.children[1].innerText = '下载所有图片';
        replaceTarget.children[2].innerText = 'by EdgeNeko'
    };
})();
