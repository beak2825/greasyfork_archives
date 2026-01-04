// ==UserScript==
// @name         mangagunDownloader
// @namespace    http://tampermonkey.net/
// @version      20250204.1
// @author       人間になりたいですわ.wav
// @description  成为人类
// @match        https://mangagun.net/*.html
// @connect      ihlv1.xyz
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mangagun.net
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.js
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517329/mangagunDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/517329/mangagunDownloader.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function plus0(v, total) {
        if (total == undefined) {
            if (parseInt(v) < 10) {
                v = '0' + v
            };
            if (parseInt(v) < 100) {
                v = '0' + v
            };
        }
        return v
    };

    async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    var threadLimit = 15;
    var preferSuffix = 'jpeg';
    var archieveNameModel = '#漫画杂志名# #章节名# 生肉';
    const archieveSuffix = '.zip';

    let parser = new DOMParser();
    async function downloadChapter(chapterName,chapterUrl) {
        let downloadCount = 0;
        let finishedCount = 0;
        
        function downloader(url, nowIndex) {
            GM_xmlhttpRequest({//下载图片
                method: "GET",
                headers: {
                    "Referer": "https://mangagun.net/",
                },
                url: url,
                responseType: 'blob',
                onload: async function (e) {
                    //delete AbortControllers[url];//下载完毕 不需要终止了
                    let blob = e.response;
                    downloadCount -= 1;
                    let fileName = plus0(nowIndex + 1) + '.' + preferSuffix;
                    zip.file(fileName, blob);//推入zip
                    //document.querySelector("#dl-detail-mdiv").removeChild(dlDetailDOM);//已完成下载和解码 移除下载任务的显示
                    finishedCount += 1;//加入到完成数组 用于下载统计
                    //更新进度条
                    let pgs = ((finishedCount / totalPage) * 100).toFixed(2) + '%';
                    document.querySelector("#dl-pgs-show").style.width = pgs;
                    document.querySelector("#dl-progress-text").textContent = pgs;
                },
                /*
                onprogress: (e) => {
                    console.log(fileName,((e.loaded / e.total) * 100).toFixed(2),'%');
                }
                */
            })
        };

        let chapterHtml = await fetch(chapterUrl, {
            "referrer": "https://mangagun.net/",
            "method": "GET",
        });
        chapterHtml = await chapterHtml.text();
        let chapterDoc = parser.parseFromString(chapterHtml, "text/html");
        let chapterId = chapterDoc.querySelector('input[id=chapter]').value;
        let imgHtml = await fetch(`https://mangagun.net/app/manga/controllers/cont.Showimage.php?cid=${chapterId}`, {
            "referrer": "https://mangagun.net/",
            "method": "GET",
        });
        imgHtml = await imgHtml.text();
        let imgDoc = parser.parseFromString(imgHtml, "text/html");
        let imgList = [];
        imgDoc.querySelectorAll('img.chapter-img').forEach((ele) => {
            imgList.push(ele.dataset.srcset.replaceAll('\n', ''));
        });

        let seriesName = document.querySelector('ul.manga-info > h3').textContent;
        var zipName = archieveNameModel.replace('#漫画杂志名#', seriesName).replace('#章节名#', chapterName);
        let totalPage = imgList.length;

        document.querySelector("#dl-pgs-mdiv").style.visibility = 'visible';

        const zip = new JSZip();

        for (let i = 0; i < imgList.length; i++) {
            let ele = imgList[i];

            while (downloadCount >= threadLimit) {//同时下载数超过限制后 等待
                console.log('wait for contined.');
                await sleep(500);
            };

            let nowIndex = i;
            downloadCount += 1;

            downloader(ele, nowIndex);
        };

        while (finishedCount != totalPage) {
            console.log('wait for finish.')
            await sleep(500);
        };

        await zip.generateAsync({ type: "blob" })
            .then(function (content) {
                var objectUrl = URL.createObjectURL(content);
                var a = document.createElement("a");
                a.setAttribute('href', objectUrl);
                a.setAttribute('download', '');
                a.setAttribute('target', '_blank');
                a.download = zipName + '.zip';
                a.click();
            });
        console.log('all finished.');
        return true;

    }

    function init () {
        GM_addStyle(`
            .episode__dl{
                --swiper-theme-color: #e63556;
                --swiper-navigation-size: 44px;
                -webkit-text-size-adjust: none;
                word-break: normal;
                word-wrap: break-word;
                color: #000;
                box-sizing: border-box;
                border: 0;
                font: inherit;
                vertical-align: baseline;
                position: absolute;
                right: 0;
                display: block;
                width: 40%;
                padding: .8em 1.4em .8em 0;
                margin: 0 auto;
                text-align: right;
                font-size: 24px;
                font-weight: 500;
                background-image: url('data:image/svg+xml;charset=utf8,%3Csvg%20id%3D%22%E3%83%AC%E3%82%A4%E3%83%A4%E3%83%BC_1%22%20data-name%3D%22%E3%83%AC%E3%82%A4%E3%83%A4%E3%83%BC%201%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20222.03%20407.29%22%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill%3A%23e63556%3B%7D%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cpolygon%20class%3D%22cls-1%22%20points%3D%2218.39%20407.29%200%20388.91%20185.26%20203.65%200%2018.39%2018.39%200%20222.03%20203.65%2018.39%20407.29%22%2F%3E%3C%2Fsvg%3E');
                background-repeat: no-repeat;
                background-size: 4% auto;
                background-position: center right;
                bottom: 4rem;
                transition: 0.3s ease-in-out;
            }
            div.episode__dl:hover {
                background-color: antiquewhite;
            }
            `);
        GM_addStyle(`
            div.PCM-dl-container {
                display: flex;
                align-items: center;
                padding: 0 2rem;
                transition: 0.3s ease-in-out;
            }
            #dl-progress-text{
                font-size: 1.5rem;
                color: #000;
            }
            div.PCM-dl-container:hover {background-color: #ffc107;}
            div.PCM-prdVol_dl-container {
                font-size: 16px;
                padding: 0 2rem;
                height: 45px;
                border-radius: 3px;
                background: dodgerblue;
                border: none;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: PingFang SC, Helvetica Neue, Microsoft YaHei, sans-serif;
                cursor: pointer;
                margin-left: 14px;
            }
            .zhFont {
                font-family: PingFang SC, Helvetica Neue, Microsoft YaHei, sans-serif;
            }
            div.swal2-container {
                font-family: PingFang SC, Helvetica Neue, Microsoft YaHei, sans-serif;
            }
            #swal2-html-container {
                font-size: 2em;
            }
            @-webkit-keyframes spin {
                from {
                    -webkit-transform: rotate(0deg);
                }
                to {
                    -webkit-transform: rotate(360deg);
                }
            }
            @keyframes spin {
                from {
                    transform: rotate(0deg);
                }
                to {
                    transform: rotate(360deg);
                }
            }
            #dl-pgs-mdiv {
                position:fixed;z-index:10;bottom:2rem;left:1rem;text-align:center;border-radius:8px;background-color:#ededed;padding:.5rem;visibility: hidden;
            }
            #dl-settings-mdiv {
                position: fixed;z-index: 10;bottom: 2rem;left: 1rem;text-align: center;border-radius: 8px;background-color: rgb(237, 237, 237);padding: 0.5rem;height: 3rem;opacity: 0.3;
                transition: 0.2s ease-in-out 0s;
            }
            #dl-settings-mdiv:hover {
                opacity: 1;
            }
            #dl-settings-mdiv svg:hover,.bi-arrow-repeat:hover,.bi-x:hover{
                -webkit-animation: spin 1s linear 0.2s infinite;
                animation: spin 1s linear 0.2s infinite;
            }
            #dl-detail-mdiv {
                height: 500px;
                background: white;
                border-radius: 8px;
                overflow: hidden;
                transition: 0.3s ease-in-out;
                max-height: 0px;
            }
            div.dl-detail-sg {
                display: flex;
                background: #b3d6f5;
                padding: 0 5%;
            }
            div.dl-detail-sg:first-child {
                border-radius: 8px 8px 0 0
            }
            div.dl-detail-sg > p{
                line-height: 3rem;
                font-size: 1.5rem;
                width: 100%;
                text-align: left;
            }
            div.dl-detail-sg.err {
                background: red;
                color: white;
            }
            div.dl-detail-sgbtns {
                padding: 0 0.25rem;
                display: flex;
                transition: 0.2s ease-in-out 0s;
            }
            div.dl-detail-sgbtns:hover {
                background: #f5ff00;
            }
            .bi-arrow-repeat,.bi-x {
                width: 3rem;
                padding: 0 0.5rem;
                cursor: pointer;
                transition: 0.2s ease-in-out 0s;
            }
        `);
        GM_addStyle(`
            ul.list-chapters > a{
                display: flex;
            }
            ul.list-chapters > a > li{
                width: 100%
            }
        `);

        let pgs = document.createElement('div');
        document.body.appendChild(pgs);
        pgs.outerHTML = `<div id="dl-pgs-mdiv"><div id="dl-pgs-area"><div class="g-container" style="margin-bottom: 0.2rem;width:20rem;height:2em;border-radius:25px;background-color:#fff"><div class="g-progress" style="width: 0%;height:inherit;border-radius:25px;background:linear-gradient(to right,#6dd6f8,#6d9df8);transition:width .2s linear;max-width:inherit" id="dl-pgs-show"></div></div><p id="dl-progress-text">0%</p></div><div id="dl-detail-mdiv"></div></div>`;
        document.querySelector('#dl-pgs-area').onclick = () => {
            if (!document.querySelector("#dl-detail-mdiv").style.maxHeight) {
                document.querySelector("#dl-detail-mdiv").style.maxHeight = '500px';
                document.querySelector("#dl-detail-mdiv").style.overflowY = 'auto';
            } else {
                document.querySelector("#dl-detail-mdiv").style.maxHeight = '';
                document.querySelector("#dl-detail-mdiv").style.overflowY = '';
            }
        };

        document.querySelectorAll('ul.list-chapters > a').forEach((ele)=>{
            let dlbtn = document.createElement('button');
            dlbtn.classList.add('btn','btn-primary','text-nowrap');
            dlbtn.textContent = '下载';
            let chapterName = ele.querySelector('div.chapter-name').textContent;
            let chapterUrl = ele.href;
            dlbtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                downloadChapter(chapterName,chapterUrl);
            }
            ele.appendChild(dlbtn);
        })
    };

    let t1 = setInterval(()=>{
        if (document.querySelectorAll('ul.list-chapters > a').length != 0) {
            clearInterval(t1)
            init();
        }
    },300)
})();