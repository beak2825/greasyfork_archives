// ==UserScript==
// @name         speedBinbDownloaderV0
// @namespace    http://tampermonkey.net/
// @version      2024-11-08
// @description  下载
// @author       人間になりたいうた.wav
// @connect      localhost
// @description  成为人类
// @match        https://storia.takeshobo.co.jp/manga/*/
// @match        https://webcomicgamma.takeshobo.co.jp/manga/*/
// @match        https://gammaplus.takeshobo.co.jp/manga/*/
// @match        https://comic-meteor.jp/*/
// @match        https://www.123hon.com/nova/web-comic/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=takeshobo.co.jp
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11.12.0/dist/sweetalert2.all.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.js
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/516340/speedBinbDownloaderV0.user.js
// @updateURL https://update.greasyfork.org/scripts/516340/speedBinbDownloaderV0.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var mgName = '';
    var threadLimit = 15;
    var preferSuffix = 'jpeg';
    var archieveNameModel = '#漫画杂志名# #章节名# 生肉';
    var botUrl = '0';
    var botAuth = 'Bearer 0';
    const archieveSuffix = '.zip';

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
        div.cmdlbtn {
            -webkit-text-size-adjust: 100%;
            -webkit-tap-highlight-color: transparent;
            font-size: 14px;
            letter-spacing: 1px;
            line-height: 150%;
            font-weight: 500;
            border-collapse: separate;
            border-spacing: 5px 0;
            box-sizing: inherit;
            display: table-cell!important;
            height: 48px;
            text-align: center;
            max-width: 160px;
            vertical-align: middle;
            color: #fff;
            transition: 1s;
            opacity: 1;
            cursor: pointer;
            background-color: cornflowerblue;
            width: 75px;
        }
        div.cmdlbtn:hover {
            opacity: .7;
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
            font-size: 1.5rem
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
        button.dlBtn_123hon {
            list-style: none;
            text-decoration: none;
            margin: 0;
            vertical-align: baseline;
            background: transparent;
            cursor: pointer;
            display: block;
            width: 200px;
            box-sizing: border-box;
            padding: 10px 0;
            background-color: #f2f2f2;
            text-align: center;
            color: #231815;
            font-size: 15px;
            transition: 0.2s;
        }
    `);

    async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function dataURLToArrayBuffer(dataURL) {
        var base64 = dataURL.split(",")[1];
        var binary = atob(base64);
        var length = binary.length;
        var buffer = new ArrayBuffer(length);
        var view = new Uint8Array(buffer);

        for (var i = 0; i < length; i++) {
            view[i] = binary.charCodeAt(i);
        }

        return buffer;
    };

    async function sendToQQGroup(group_id, base64, fn, folder_id = "") {
        let uploadJson = {
            "group_id": group_id,
            "file": "base64://" + base64,
            "name": fn,
            "folder_id": folder_id
        };
        console.log(uploadJson);
        return new Promise(resolve => {
            GM_xmlhttpRequest({//下载图片
                method: "POST",
                data: JSON.stringify(uploadJson),
                url: botUrl + 'upload_group_file',
                headers: {
                    'Authorization': botAuth
                },
                onload: function (e) {
                    console.log(e);
                    resolve(true);
                },
                onerror: (e) => {
                    resolve(false);
                }
            });
        });
    }
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

    async function download(url, chapterName) {
        var downloadingArr = [];
        var finishArr = [];

        async function decryptImg(blobUrl, coords, realWidth, realHeight) {//图像B64数据，解密数组，宽，高
            // 创建Canvas
            let imgData = await new Promise((resolve, reject) => {//需要生成img实例才能用于绘制canvas
                const img = new Image();
                img.onload = () => {
                    resolve(img);
                };
                img.onerror = (err) => {
                    reject(err);
                };
                img.src = blobUrl;
            });
            const canvas = document.createElement('canvas');
            canvas.height = realHeight
            canvas.width = realWidth;//创建一个画布
            const ctx = canvas.getContext('2d');//取得ctx
            // 在Canvas上绘制图片
            // 开始绘画
            for (let i = 0; i < coords.length; i++) {
                let ele = coords[i];
                let cell_width = ele.width;
                let cell_height = ele.height;
                let sx = ele.xsrc;
                let sy = ele.ysrc;
                let dx = ele.xdest;
                let dy = ele.ydest;
                ctx.drawImage(imgData, sx, sy, cell_width, cell_height, dx, dy, cell_width, cell_height);
            }
            // 将Canvas转换为Buffer
            var dataURL = canvas.toDataURL('image/' + preferSuffix, 1);
            var buffer = dataURLToArrayBuffer(dataURL);
            return buffer;
        };
        async function downloader(urlPrefix, ptimgJsonSrc, nowIndex) {
            let isError = true;
            let decInfoUrl = urlPrefix + ptimgJsonSrc;
            let encInfo;
            //下載decinfo
            do {
                try {
                    encInfo = await fetch(decInfoUrl);
                    encInfo = await encInfo.json();
                    isError = false;
                } catch (error) {
                    isError = true;
                }
            } while (isError);
            let decInfo = getDecryptInfo(encInfo, ptimgJsonSrc);
            let imgUrl = urlPrefix + decInfo.imgSrc;
            if (website == '123hon') {
                imgUrl = urlPrefix + "/data" + decInfo.imgSrc;
            }
            //下載img
            let data;
            do {
                try {
                    let img = await fetch(imgUrl);
                    data = await img.blob();
                    isError = false;
                } catch (error) {
                    isError = true;
                }
            } while (isError);
            downloadingArr.splice(downloadingArr.indexOf(nowIndex), 1);
            let blobUrl = URL.createObjectURL(data);
            let decBuffer = await decryptImg(blobUrl, decInfo.coords, decInfo.realWidth, decInfo.realHeight);
            URL.revokeObjectURL(blobUrl);

            let fileName = plus0(nowIndex + 1) + '.' + preferSuffix;
            zip.file(fileName, decBuffer);//推入zip

            finishArr.push(nowIndex);
            //更新进度条
            let pgs = ((finishArr.length / totalPage) * 100).toFixed(2) + '%';
            document.querySelector("#dl-pgs-show").style.width = pgs;
            document.querySelector("#dl-progress-text").textContent = pgs;
        }

        let urlPrefix = url;
        let html = await fetch(url);
        html = await html.text();
        let parser = new DOMParser();
        let mgDoc = parser.parseFromString(html, "text/html");
        let contentDom = mgDoc.querySelector('#content');
        let imgJsonList = [];
        for (let i = 0; i < contentDom.children.length; i++) {//注意 可能第一張圖片就是0002開頭
            const ele = contentDom.children[i];
            let src = ele.dataset.ptimg;
            if (website == '123hon') {
                src = "/" + src;
            }
            imgJsonList.push(src);
        }

        var totalPage = imgJsonList.length;

        var zipName = archieveNameModel.replace('#漫画杂志名#', mgName).replace('#章节名#', chapterName)

        const zip = new JSZip();

        document.querySelector("#dl-pgs-mdiv").style.visibility = 'visible';

        for (let i = 0; i < imgJsonList.length; i++) {
            let ptimgJsonRelativeSrc = imgJsonList[i];

            while (downloadingArr.length > threadLimit) {//同时下载数超过限制后 等待
                console.log('wait for contined.');
                await sleep(500);
            };

            let nowIndex = i;
            downloadingArr.push(nowIndex);

            downloader(urlPrefix, ptimgJsonRelativeSrc, nowIndex);
        };

        while (finishArr.length != totalPage) {
            console.log('wait for finish.')
            await sleep(500);
        };

        await Swal.fire({
            title: "确认文件名",
            input: "text",
            inputLabel: "直接确认或修改文件名后提交（取消则输出默认文件名）",
            inputValue: zipName,
            showCancelButton: true,
            allowEscapeKey: false,
            allowEnterKey: false,
            allowOutsideClick: false,
            inputValidator: (value) => {
                if (!value) {
                    return "You need to write something!";
                }
            }
        }).then((res) => {
            if (res.isConfirmed) {
                zipName = res.value;
            }
        });

        let sendQQ = false, saveZip = false;
        /*
        await Swal.fire({
            title: "请确认保存方式",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "下载压缩包并发送至QQ",
            denyButtonText: "仅发送至QQ",
            cancelButtonText: "仅下载压缩包",
            allowEscapeKey: false,
            allowEnterKey: false,
            allowOutsideClick: false,
        }).then((result) => {
            if (result.isConfirmed) {
                sendQQ = true;
                saveZip = true;
            } else if (result.isDenied) {
                sendQQ = true;
            } else if (result.isDismissed) {
                saveZip = true;
            }
        });
        */
        saveZip = true;
        if (saveZip) {
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
        };

        if (sendQQ) {
            await zip.generateAsync({ type: "base64" })
                .then(async function (b64) {
                    let res = await sendToQQGroup("772701089", b64, zipName + ".zip", "");
                    console.log(res);
                });
        }

        console.log('all finished.');

        setTimeout(() => {
            document.querySelector("#dl-pgs-mdiv").style.visibility = 'hidden';
            document.querySelector("#dl-pgs-show").style.width = '0%';
            document.querySelector("#dl-progress-text").textContent = '0%';
        }, 3000);

        return true;
    }

    function getDecryptInfo(t, ptimgUrl) {//t为接收到的Json信息
        function Ph(t, i) {//t = object; i = "i:4,4+106,150>212,0"
            var n = i.match(/^([^:]+):(\d+),(\d+)\+(\d+),(\d+)>(\d+),(\d+)$/);
            if (!n)
                throw new Error("Invalid format for Image Transfer : " + i);
            var r = n[1];
            if (!(r in t))
                throw new Error("resid " + r + " not found.");
            return {
                resid: r,
                xsrc: parseInt(n[2], 10),
                ysrc: parseInt(n[3], 10),
                width: parseInt(n[4], 10),
                height: parseInt(n[5], 10),
                xdest: parseInt(n[6], 10),
                ydest: parseInt(n[7], 10)
            }
        }
        let relativePath = ptimgUrl.match(/(.*?\/).*/)[1];
        var n = {}, r = [];
        if (!("resources" in t))
            throw new Error("resources not found.");
        for (var e in t.resources) {
            var s = t.resources[e];
            if (!("src" in s))
                throw new Error("resources[" + e + "].src not found.");
            if ("string" != typeof s.src || "" === s.src)
                throw new Error("Invalid value " + s.src + " in resources[" + e + "].src");
            var h = -1
                , u = -1;
            if ("width" in s) {
                if (!("number" == typeof s.width && 0 < s.width))
                    throw new Error("Invalid value " + s.width + " in resources[" + e + "].width");
                h = s.width
            }
            if ("height" in s) {
                if (!("number" == typeof s.height && 0 < s.height))
                    throw new Error("Invalid value " + s.height + " in resources[" + e + "].height");
                u = s.height
            };
            relativePath = relativePath + s.src
            n[e] = {//此处的src是相对src
                src: relativePath,
                width: h,
                height: u
            }
        }
        if (!("views" in t))
            throw new Error("views not found.");
        if (!Array.isArray(t.views))
            throw new Error("views is not array.");
        for (var o = 0; o < t.views.length; o++) {
            var a = t.views[o];
            if (!("width" in a))
                throw new Error("views[" + o + "].width not found.");
            if ("number" != typeof a.width || a.width <= 0)
                throw new Error("Invalid value " + a.width + " in views[" + o + "].width");
            if (!("height" in a))
                throw new Error("views[" + o + "].height not found.");
            if ("number" != typeof a.height || a.height <= 0)
                throw new Error("Invalid value " + a.height + " in views[" + o + "].height");
            if (!("coords" in a))
                throw new Error("views[" + o + "].coords not found.");
            if (!Array.isArray(a.coords))
                throw new Error("views[" + o + "].coords is not array.");
            if (0 === a.coords.length)
                throw new Error("views[" + o + "].coords is empty.");
            for (var f = [], c = 0; c < a.coords.length; c++) {
                if ("string" != typeof a.coords[c])
                    throw new Error("views[" + o + "].coords[" + c + "] is not string.");
                f.push(Ph(n, a.coords[c]))
            }
        };
        return {
            imgSrc: relativePath,
            coords: f,
            realHeight: a.height,
            realWidth: a.width
        };
    };

    function init(website) {
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
        switch (website) {
            case "takeshobo":
                mgName = document.querySelector("ul.manga__title > li").textContent;
                document.querySelectorAll('a.read__link').forEach((ele) => {
                    let node = document.createElement('div');
                    if (!!ele.querySelector('li.episode')) {
                        if (ele.querySelector('div.episode__read').textContent == '読む') {
                            let chapterName = ele.querySelector('li.episode').textContent;
                            node.className = 'episode__dl';
                            node.textContent = '下載';
                            ele.appendChild(node);
                            node.onclick = (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                download(ele.href, chapterName);
                            }
                        }
                    }
                })
                break;
            case "cm":
                mgName = document.querySelector("meta[property='og:title']").content;
                document.querySelectorAll('div.work_episode_table').forEach((ele) => {
                    let node = document.createElement('div');
                    if (!!ele.querySelector('div.work_episode_link_btn')) {
                        let chapterName = ele.querySelector("div.work_episode_txt").textContent.replaceAll('\n', '').replaceAll(' ', '')
                        let chapterLink = ele.querySelector('a').href;
                        node.className = 'cmdlbtn';
                        node.textContent = '下載';
                        ele.insertBefore(node, ele.querySelector('div.js-modal__main'));
                        node.onclick = (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            download(chapterLink, chapterName);
                        }
                    }
                });
                break;
            case "123hon":
                mgName = document.querySelector("h2.center").textContent;
                for (let i = 0; i < document.querySelector('div.read-episode').children.length; i++) {
                    const ele = document.querySelector('div.read-episode').children[i];
                    if (!ele.querySelector('button.dlBtn_123hon')) {
                        let node = document.createElement('button');
                        let chapterName = ele.querySelector("span.story-num").textContent;
                        let chapterLink = ele.querySelector('div.btn >a').href;
                        node.className = 'dlBtn_123hon';
                        node.textContent = 'Download';

                        let btnDom = ele.querySelector('div.btn')
                        btnDom.insertBefore(node, btnDom.querySelector('a'));

                        node.onclick = (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            download(chapterLink, chapterName);
                        }
                    }
                }
                break;
            default:
                break;
        }
    }

    //检测加载实际

    let wc = {
        "storia.takeshobo.co.jp": {
            "domName": 'a.read__link',
            "website": "takeshobo"
        },
        "webcomicgamma.takeshobo.co.jp": {
            "domName": 'a.read__link',
            "website": "takeshobo"
        },
        "gammaplus.takeshobo.co.jp": {
            "domName": 'a.read__link',
            "website": "takeshobo"
        },
        'comic-meteor.jp': {
            "domName": 'div.work_episode_link_btn',
            "website": "cm"
        },
        "www.123hon.com": {
            "domName": 'ul.item-list',
            "website": "123hon"
        }
    };
    let domian = document.domain;
    let hint = wc[domian].domName;
    var website = wc[domian].website;
    let t1 = setInterval(() => {
        if (document.querySelectorAll(hint).length > 0) {
            clearInterval(t1)
            init(website);
        }
    }, 300)

})();

