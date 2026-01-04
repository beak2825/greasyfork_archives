// ==UserScript==
// @name         虎扑助手——一键查看基地所有视频及帖子所有视频图片！
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  在浏览虎扑时可一键查看所有图片和视频
// @author       landswimmer
// @match        https://bbs.hupu.com/*.html
// @match        https://my.hupu.com/*
// @connect      hupu.com
// @grant        GM_xmlhttpRequest
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/396003/%E8%99%8E%E6%89%91%E5%8A%A9%E6%89%8B%E2%80%94%E2%80%94%E4%B8%80%E9%94%AE%E6%9F%A5%E7%9C%8B%E5%9F%BA%E5%9C%B0%E6%89%80%E6%9C%89%E8%A7%86%E9%A2%91%E5%8F%8A%E5%B8%96%E5%AD%90%E6%89%80%E6%9C%89%E8%A7%86%E9%A2%91%E5%9B%BE%E7%89%87%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/396003/%E8%99%8E%E6%89%91%E5%8A%A9%E6%89%8B%E2%80%94%E2%80%94%E4%B8%80%E9%94%AE%E6%9F%A5%E7%9C%8B%E5%9F%BA%E5%9C%B0%E6%89%80%E6%9C%89%E8%A7%86%E9%A2%91%E5%8F%8A%E5%B8%96%E5%AD%90%E6%89%80%E6%9C%89%E8%A7%86%E9%A2%91%E5%9B%BE%E7%89%87%EF%BC%81.meta.js
// ==/UserScript==

(function () {
    //第一部分，布局相关
    let picModeBtn = document.createElement("div");
    picModeBtn.innerHTML = "看图";
    picModeBtn.style.cssText = "\
        position: fixed;\
        right: calc(2% + 4px);\
        bottom: 50px;\
        border: 1px solid #999;\
        border-radius: 3px;\
        height: 40px;\
        width: 40px;\
        display: flex;\
        justify-content: center;\
        align-items: center;\
        cursor: pointer;\
    ";

    let picModeDiv = document.createElement("div");
    picModeDiv.id = "insertDiv";
    picModeDiv.style.cssText = "\
        position: fixed;\
        top: 0;\
        width: 100vw;\
        height: 100vh;\
        z-index: 1000;\
        display: flex;\
        justify-content: center;\
        align-items: center;\
        background-color: #222;\
    ";

    let placeHolder = document.createElement("div");
    placeHolder.innerHTML = "本帖没有图片哦";
    placeHolder.style.cssText = "\
        display: none;\
        color: white;\
    ";

    let pic = document.createElement("img");
    let mp4 = document.createElement("video");
    mp4.controls = "true";
    pic.style.cssText = mp4.style.cssText = "\
        display: none;\
        max-width: 100vw;\
        max-height: 100vh;\
    ";

    let touchPadLeft = document.createElement("div");
    let touchPadRight = document.createElement("div");
    touchPadLeft.style.cssText = touchPadRight.style.cssText = "\
        visibility: hidden;\
        position: fixed;\
        top: calc(50vh - 25px);\
        border: 25px solid transparent;\
        height: 0;\
        width: 0;\
        mix-blend-mode: difference;\
        cursor: pointer;\
    ";
    touchPadLeft.style.left = touchPadRight.style.right = "20px";
    touchPadLeft.style.borderRightColor = touchPadRight.style.borderLeftColor = "rgba(128,128,128,0.8)";

    let closeBtn = document.createElement("div");
    closeBtn.innerHTML = "X";
    closeBtn.style.cssText = "\
        position: fixed;\
        top: 20px;\
        right: 30px;\
        color: rgba(128,128,128,0.8);\
        font-size: 30px;\
        mix-blend-mode: difference;\
        cursor: pointer;\
    ";

    let fragment = document.createDocumentFragment();
    let rawFragment = document.createDocumentFragment();
    picModeDiv.append(pic, placeHolder, mp4, touchPadLeft, touchPadRight, closeBtn);
    fragment.append(picModeDiv);

    //第二部分，网络请求
    let imgList = [];
    let imgBuffer = [];
    let pageIndex = 1;
    let ended = 0;

    /**
     * 
     * @param {*} eachReply 对每层楼的内容进行处理
     */
    function dataHandler(eachReply) {
        let reResult = eachReply.content.match(/src='.*?'/g);
        if (reResult) {
            document.body.appendChild(picModeBtn);
            reResult.forEach(rawSrc => {
                if (rawSrc.match(/\.mp4/g)) {
                    imgList.push(rawSrc.substr(5, rawSrc.length - 6).replace(/\\/g, ""));
                } else if (rawSrc.match(/\?/g)) {
                    imgList.push(rawSrc.match(/src=.*?\?/g)[0].replace(/\\/g, "").substr(5, rawSrc.length - 7));
                    let bufferNode = new Image();
                    bufferNode.src = rawSrc.match(/src=.*?\?/g)[0].replace(/\\/g, "").substr(5, rawSrc.length - 7);
                    imgBuffer.push(bufferNode);
                }
            });
        }
    }
    /**
     * @description promise版本的xhr
     * @param {*} url 请求的网址
     * @returns 请求的响应，包装为一个resolved promise对象
     */
    function _fetch(url) {
        return new Promise((resolve, reject) => {
            let config = {
                method: 'GET',
                url: url,
                onload: (e) => {
                    if (e.status >= 200 && e.status < 300) {
                        resolve(e.response);
                    } else {
                        reject(e.statusText);
                    }
                }
            };
            GM_xmlhttpRequest(config);
        })
    }

    async function getAllImg() {
        let response = await _fetch(baseUrl + pageIndex);
        let responseData = JSON.parse(response).data;
        if (pageIndex === 1) {
            dataHandler(responseData.t_detail);
            responseData.lr_list.forEach(dataHandler);
        }
        responseData.r_list.forEach(dataHandler);
        if (++pageIndex <= responseData.r_total_page) {
            getAllImg();
        }else{
            ended = 1;
        }
    }

    let domParser = new DOMParser();
    async function getAllTopFloor() {
        let response = await _fetch(baseUrl + pageIndex);
        let myDoc = domParser.parseFromString(response, 'text/html');
        let result = myDoc.querySelectorAll('.p_title a');
        let postIds = [];
        for (let i = 0; i < result.length; i++) {
            postIds.push(result[i].href);
        }
        async function getImg(url) {
            let response = await _fetch(url);
            let responseData = JSON.parse(response).data;
            dataHandler(responseData.t_detail);
        }
        for (let id of postIds) {
            let url = 'https://m.hupu.com/api/v1/bbs-thread-frontend/' + id.match(/[0-9]{8}/);
            getImg(url);
        }
        if (!myDoc.querySelectorAll('#j_next').length) {
            ended = 1;
        }
    }

    let baseUrl;
    function getUrl() {
        if (window.location.host == 'bbs.hupu.com') {
            baseUrl = 'https://m.hupu.com/api/v1/bbs-thread-frontend/' + window.location.href.match(/[0-9]{8}/) + '?page=';//提取帖子id
            getAllImg();
        } else {
            baseUrl = 'https://my.hupu.com/' + window.location.href.match(/[0-9]+/) + '/topic-list-main-';
            getAllTopFloor();
        }
    }

    getUrl()

    //第三部分，交互控制相关
    let i = 0;
    function imgSwitch() {
        if (imgList[i].match(/\.mp4/)) {
            mp4.src = imgList[i];
            mp4.style.display = "initial";
            pic.style.display = "none";
        } else {
            pic.src = imgList[i];
            pic.style.display = "initial";
            mp4.style.display = "none";
        }
        if (i == 0) {
            touchPadLeft.style.visibility = "hidden";
        } else {
            touchPadLeft.style.visibility = "visible";
        }
        if (i == imgList.length - 1) {
            touchPadRight.style.visibility = "hidden";
        } else {
            touchPadRight.style.visibility = "visible";
        }
    }
    function closeHandler() {
        placeHolder.style.display = pic.style.display = mp4.style.display = "none";
        touchPadRight.style.visibility = touchPadLeft.style.visibility = "hidden";
        if (imgList.length) {
            i = 0;
            pic.src = imgList[i];
        }
        fragment.appendChild(document.getElementById("insertDiv"));
        document.body.appendChild(rawFragment);
    }
    function switchToLast() {
        if (i > 0) {
            i--;
            imgSwitch();
        }
    }
    function switchToNext() {
        if (i < imgList.length - 1) {
            i++;
            imgSwitch();
            if (i > imgList.length - 5 && !ended) {
                pageIndex++;
                getUrl();
            }
        }
    }

    document.onkeydown = (e) => {
        if (rawFragment) {
            switch (e.keyCode) {
                case 39:
                    switchToNext();
                    break;
                case 37:
                    switchToLast();
                    break;
                case 27:
                    closeHandler();
                    break;
                default:
                    break;
            }
        }
    }
    touchPadLeft.onclick = switchToLast;
    touchPadRight.onclick = switchToNext;
    closeBtn.onclick = closeHandler;
    picModeBtn.onclick = function () {
        imgList = [...new Set(imgList)];
        rawFragment.append(document.querySelector(".hp-wrap"));
        imgList.length ? imgSwitch() : placeHolder.style.display = "initial";
        document.body.append(fragment);
    }
})();