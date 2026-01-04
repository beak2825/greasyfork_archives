// ==UserScript==
// @name         一键查看虎扑帖子所有视频图片！
// @namespace    http://tampermonkey.net/
// @version      0.24
// @description  在浏览虎扑时可一键查看所有图片和视频
// @author       ss
// @match        https://bbs.hupu.com/*.html
// @match        https://m.hupu.com/*
// @match        https://my.hupu.com/*
// @connect      hupu.com
// @grant        GM_xmlhttpRequest
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/472301/%E4%B8%80%E9%94%AE%E6%9F%A5%E7%9C%8B%E8%99%8E%E6%89%91%E5%B8%96%E5%AD%90%E6%89%80%E6%9C%89%E8%A7%86%E9%A2%91%E5%9B%BE%E7%89%87%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/472301/%E4%B8%80%E9%94%AE%E6%9F%A5%E7%9C%8B%E8%99%8E%E6%89%91%E5%B8%96%E5%AD%90%E6%89%80%E6%9C%89%E8%A7%86%E9%A2%91%E5%9B%BE%E7%89%87%EF%BC%81.meta.js
// ==/UserScript==

(function () {
    //第一部分，布局相关
    let picModeBtn = document.createElement("div");
    picModeBtn.innerHTML = "看图";
    picModeBtn.id = "picModeBtn";
    picModeBtn.style.cssText = "\
        position: fixed;\
        right: 25px;\
        bottom: 258px;\
        border-bottom: 1px solid #ddd;\
        height: 50px;\
        width: 48px;\
        display: flex;\
        justify-content: center;\
        align-items: center;\
        color: #ea0e20;\
        background: #fff;\
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
        flex-wrap: wrap;\
        overflow: auto;\
        background-color: #222;\
    ";

    let placeHolder = document.createElement("div");
    placeHolder.innerHTML = "本帖没有图片哦";
    placeHolder.style.cssText = "\
        display: none;\
        color: white;\
    ";

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
    picModeDiv.append(placeHolder, closeBtn);
    fragment.append(picModeDiv);

    //第二部分，网络请求
    let imgList = [];
    // let imgBuffer = [];
    let pageIndex = 1;

    /**
     * 
     * @param {*} eachReply 对每层楼的内容进行处理
     */
    function dataHandler(eachReply) {
        // 主贴内容
        if (pageIndex === 1) {
          let reResult = eachReply.content.match(/src='.*?'/g);
          if (reResult && reResult.length > 0) {
              document.body.appendChild(picModeBtn);
              reResult.forEach(ele => {
                  if (ele.match(/\.mp4/)) {
                      let videoSrc = ele.substr(5, ele.length - 6)
                      console.log(videoSrc)
                      imgList.push(videoSrc);
                      appendVideo(videoSrc)
                  } else if (ele.match(/\?/g)) {
                      let imgSrc = ele.match(/src=.*?\?/g)[0].replace(/\\/g, "").substr(5, ele.length - 7)
                      imgList.push(imgSrc);
                      appendImg(imgSrc)
                  }
              });
          }
        }

        // 回帖内容-图片类型
        let images = eachReply.images || [];
        // console.log('images', images)
        if (images.length > 0) {
            document.body.appendChild(picModeBtn);
            images.forEach(ele => {
                let imgSrc = ele.src
                // 重复图片不添加
                let containItem = imgList.some(item => item.split('?')[0] === imgSrc.split('?')[0])
                if (!containItem) {
                    imgList.push(imgSrc)
                    appendImg(imgSrc)
                }
            });
        }

        // 回帖内容-视频类型
        let relyVideoObj = eachReply.video
        if (Object.prototype.toString.call(relyVideoObj) === '[object Object]') {
            appendVideo(relyVideoObj.src)
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
        console.log('url===>', baseUrl + pageIndex)
        let responseData = JSON.parse(response).data;
        if (pageIndex === 1) {
            dataHandler(responseData.t_detail);
            // responseData.lr_list.forEach(dataHandler);
        }
        responseData.r_list.forEach(dataHandler);
        if (++pageIndex <= responseData.r_total_page) {
            getAllImg();
        }
    }

    function appendImg(imgSrc) {
        let pic = document.createElement("img");
        pic.style.cssText = "\
            max-width: 400px;\
            max-height: 400px;\
        ";
        pic.src = imgSrc
        picModeDiv.append(pic)
    }

    function appendVideo(videoSrc) {
        let mp4 = document.createElement("video");
        mp4.controls = "true";
        mp4.style.cssText = "\
        max-width: 400px;\
        max-height: 400px;\
        ";
        mp4.src = videoSrc
        picModeDiv.append(mp4)
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
    }

    let baseUrl;
    function getUrl() {
        if (window.location.host == 'bbs.hupu.com' || window.location.host == 'm.hupu.com') {
            baseUrl = 'https://m.hupu.com/api/v1/bbs-thread-frontend/' + window.location.href.match(/[0-9]{8}/) + '?page=';//提取帖子id
            getAllImg();
        } else {
            baseUrl = 'https://my.hupu.com/' + window.location.href.match(/[0-9]+/) + '/topic-list-main-';
            getAllTopFloor();
        }
    }

    getUrl()

    if (window.screen.width >= 1441) {
        picModeBtn.style.right = '88px'
    }

    function closeHandler() {
        placeHolder.style.display = picModeDiv.style.display = "none";
        fragment.appendChild(document.getElementById("insertDiv"));
        document.body.appendChild(rawFragment);
    }
    closeBtn.onclick = closeHandler;
    picModeBtn.onclick = function () {
        imgList = [...new Set(imgList)];
        rawFragment.append(document.querySelector(".hp-wrap"));
        imgList.length ? '' : placeHolder.style.display = "initial";
        picModeDiv.style.display = "block";
        document.body.append(fragment);
    }
})();