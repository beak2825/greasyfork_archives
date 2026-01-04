// ==UserScript==
// @name         Everphoto downloader
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  download everphoto full mediums
// @author       www
// @match        https://web.everphoto.cn/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477527/Everphoto%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/477527/Everphoto%20downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const usComponent = `
<style>
    #us-downloader-list li{
        display: inline-block;
        padding-right: 10px;
        font-size: 17px;
    }

    #us-downloader-list input[type="checkbox"]{
        width: 18px;
        height: 20px;
    }
</style>
<div id="us-downloader" style="background: white; padding: 20px;"> 
        <p>everphoto批量下载工具</p>
        <p>请先完成登陆，点击开始下载按钮开始批量打包下载过程。下载过程会分多个zip包连续下载，一个zip包含500个媒体文件。最下方展示全部文件的下载进度，下载完成的日期会打勾。全部下载完成将弹框提示并终止。</p>
        <p>下载的zip包命名规范为图片拍摄起始日期，例如20201001_20201030.zip表示拍摄日期从2020年10月1日到2020年10月30日。</p>
        <p>下载过程支持失败自动重试。若不小心退出页面窗口，可重新刷新打开，会弹框提示从断点位置重试。</p>
        <div> <button id="us-downloader-start"> 一键下载 </button> </div>
        <div id="us-downloader-downloading" style="display: none;"> 正在下载压缩包 <span id="us-downloader-file"></span>.. 
            <progress aria-busy="true"> </progress> <span id="us-downloader-progress"></span>
            <div>下载日期列表,打勾表示已完成下载
                <ul id="us-downloader-list" style="
                    height: 100px;
                    overflow: scroll;
                ">
                </ul>
                <p>总体下载进度</p>
                <progress id="us-downloader-full-progress"> </progress> 已完成 <span id="us-downloader-cursor">0</span>张图片下载，总共 <span id="us-downloader-total">0</span>张图片
            </div>
        </div>
</div>
`;

    document.body.insertAdjacentHTML('afterbegin', usComponent);

    const us_download_start_elem = document.getElementById("us-downloader-start");
    const us_download_progress_elem = document.getElementById("us-downloader-progress");
    const us_download_file_elem = document.getElementById("us-downloader-file");
    const us_download_list_elem = document.getElementById("us-downloader-list");
    const us_download_downloading = document.getElementById("us-downloader-downloading");
    const us_download_full_progress_elem = document.getElementById("us-downloader-full-progress");
    const us_download_cursor_elem = document.getElementById("us-downloader-cursor");
    const us_download_total_elem = document.getElementById("us-downloader-total");

    // db medium records
    let medium_records = [];
    // record download files
    let downloadedMediums = [];
    let chunkSize = 500;
    let downloadCursor = 0;
    let downloadedDates = [];
    let pendingDownloadMediums = [];
    let retryCount = 0;

    function resetDownloadCursor(downloadCursorStore){
        let promptCursor = prompt("检测到上次下载中断的位置(已下载图片数)，是否从此位置开始?确认从上次下载断点开始，取消将从头开始下载", downloadCursorStore);
        if(promptCursor){
            promptCursor = parseInt(promptCursor);
            if(promptCursor % chunkSize !== 0 && !confirm(`设置的值不是${chunkSize}的整数倍，是否确认设置？`)){
                resetDownloadCursor(downloadCursorStore);
            }else{
                downloadCursor = promptCursor;
            }
        }
    }

    let downloadCursorStore = localStorage.getItem("_everphoto_downloader_cursor")
    if(downloadCursorStore !== null){
        resetDownloadCursor(downloadCursorStore);
    }

    let chunkSizeStore = localStorage.getItem("_everphoto_downloader_chunksize");
    if(chunkSizeStore !== null){
        chunkSize = parseInt(chunkSizeStore);
    }


    // 1. wait until load complete
    function waitForRoute(r){
        return new Promise((resolve) => {
            const checkExistence = () => {
              if (document.body.classList.contains(r)) {
                resolve();
              } else {
                setTimeout(checkExistence, 100); // Check again after a delay
              }
            };
            checkExistence();
          });
    }

    // 2. open DB
    function openDB(dbName){
        const dbRequest = indexedDB.open(dbName);
        return new Promise((resolve, reject) => {
            dbRequest.onsuccess = function(e){
                resolve(e.target.result);
            };
            dbRequest.onerror = function(e){
                reject(e);
            };
        });
    }

    function updateDatesList(records){
        let last_dt = null;
        for(let i=0; i< records.length; i++){
            let dt = getDate(records[i].date);
            if (last_dt != dt) {
                if(i < downloadCursor){
                    us_download_list_elem.insertAdjacentHTML('beforeend', `<li><input id="us-download-date-${dt}" type="checkbox" checked="checked" disabled="disabled">${dt}</li>`);
                }else{
                    us_download_list_elem.insertAdjacentHTML('beforeend', `<li><input id="us-download-date-${dt}" type="checkbox" disabled="disabled">${dt}</li>`);
                }
                last_dt = dt;
            }
        }
        us_download_full_progress_elem.setAttribute('value', downloadCursor);
        us_download_full_progress_elem.setAttribute('max', medium_records.length);
        us_download_cursor_elem.textContent = Math.min(downloadCursor, medium_records.length);
        us_download_total_elem.textContent = medium_records.length;
    }

    function markPendingDatesDone(){
        for(let i =0; i < pendingDownloadMediums.length; i++){
            let dt = getDate(pendingDownloadMediums[i].date);
            let li_elem = document.getElementById('us-download-date-'+dt);
            if(li_elem){
                li_elem.setAttribute('checked', 'checked');
            }
        }
        us_download_full_progress_elem.setAttribute('value', downloadCursor);
        us_download_full_progress_elem.setAttribute('max', medium_records.length);
        us_download_cursor_elem.textContent = Math.min(downloadCursor, medium_records.length);
        us_download_total_elem.textContent = medium_records.length;
    }

    // 3. scan mediaTable
    function scanMedia(db){
        return new Promise((resolve) => {
            let records = [];
            db.transaction('media').objectStore('media').index('generated_at').openKeyCursor(null, "prev").onsuccess = (event) => {
                const cursor = event.target.result;
                if(cursor){
                    records.push({'date': cursor.key, 'id': cursor.primaryKey});
                    cursor.continue();
                }else{
                    // window.records = records;
                    medium_records = records;
                    updateDatesList(records);
                    resolve();
                }
            };
        });
    }

    function getDate(d){
        return String(d.getFullYear()) + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
    }

    function getUserName(){
        return document.title.split(' - ')[0].trim();
    }

    // 4. batch download
    function batchDownload(){
        pendingDownloadMediums = [];
        for(let i=0; i< chunkSize && i + downloadCursor < medium_records.length; i++){
            pendingDownloadMediums.push(medium_records[downloadCursor + i]);
        }
        downloadCursor += chunkSize;
        if(pendingDownloadMediums.length > 0) {
            const ep_token = localStorage.ep_token;
            const ep_uid = localStorage.ep_uid;
            let ids = [];
            for(let i=0; i<pendingDownloadMediums.length; i++){
                const r = pendingDownloadMediums[i];
                ids.push(r.id);
                downloadedMediums.push(r.id);
                const date = getDate(r.date);
                let lastDownloadDate = null;
                if(downloadedDates.length > 0){
                    lastDownloadDate = downloadedDates[downloadedDates.length -1];
                }
                if(lastDownloadDate != date){
                    downloadedDates.push(date);
                }
            }
            return fetch('api/media/archive', {
                'method': 'post',
                'headers': {
                    'Authorization': `Bearer ${ep_token}`,
                    'x-uid': ep_uid,
                    'x-bigint-support': false,
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                  },
                'body': `media=${ids.join('-')}`,
            }).then((res) => res.json()).then((ret) => {
                const startDate = getDate(pendingDownloadMediums[0].date);
                const endDate = getDate(pendingDownloadMediums[pendingDownloadMediums.length - 1].date);
                const userName = getUserName();
                const file_name = `${userName}_${startDate}_${endDate}.zip`;
                us_download_file_elem.textContent = file_name;
                GM_download({
                    'url': ret.data.url,
                    'name': file_name,
                    'saveAs': true,
                    'onload': function(){
                        retryCount = 0; // reset retry
                        markPendingDatesDone();
                        localStorage.setItem("_everphoto_downloader_cursor", downloadCursor); // commit cursor
                        batchDownload();
                    },
                    'onprogress': function(e){
                        const loading_size = parseInt(e.position / 1024 / 1024);
                        us_download_progress_elem.textContent = `${loading_size} MB`;
                    },
                    'onerror': function(e){
                        console.error(e);
                        downloadCursor -= chunkSize;
                        retryCount ++;
                        if(retryCount > 5){
                            chunkSize = Math.max(50, chunkSize - 100);
                            localStorage.setItem("_everphoto_downloader_chunksize", chunkSize);
                            alert(`重试次数过多，下载任务失败! 尝试降低打包文件数为${chunkSize}，请刷新页面后重试下载。`);
                            return;
                        }
                        batchDownload(); // retry
                    }
                });
            });
        } else {
            localStorage.removeItem("_everphoto_downloader_cursor"); // reset cursor
            localStorage.removeItem("_everphoto_downloader_chunksize"); // reset cursor
            alert('全部下载完毕!')
        }
    }

    function catchError(e){
        console.error(e);
        alert('error: ' + e);
    }

    us_download_start_elem.onclick = function(e){
        waitForRoute('route-dashboard').then(() => openDB('everphoto')).then(scanMedia).then(batchDownload).catch(catchError);
        us_download_downloading.removeAttribute("style");
        us_download_start_elem.setAttribute('disabled', 'disabled');
    };

})();