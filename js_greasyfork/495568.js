// ==UserScript==
// @name         婚贝，作品分享同步功能，获取模板信息
// @namespace    http://tampermonkey.getEncrypt.net/
// @version      1.21
// @description  婚贝，作品分享同步功能，用于获取模板信息，支持海报、MV、长页、翻页
// @author       zouys
// @match        *.hunbei.com/h5_poster/*
// @match        *.hunbei.com/h5mv/*
// @match        *.hunbei.com/long_page/*
// @match        *.hunbei.com/pages/*
// @icon         https://img.douyucdn.cn/data/yuba/default/2021/08/26/202108260113528146305214128.jpg?i=3729ce896e75556d73b47749933df87293
// @require      https://fastly.jsdelivr.net/npm/crypto-js@4.2.0
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/495568/%E5%A9%9A%E8%B4%9D%EF%BC%8C%E4%BD%9C%E5%93%81%E5%88%86%E4%BA%AB%E5%90%8C%E6%AD%A5%E5%8A%9F%E8%83%BD%EF%BC%8C%E8%8E%B7%E5%8F%96%E6%A8%A1%E6%9D%BF%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/495568/%E5%A9%9A%E8%B4%9D%EF%BC%8C%E4%BD%9C%E5%93%81%E5%88%86%E4%BA%AB%E5%90%8C%E6%AD%A5%E5%8A%9F%E8%83%BD%EF%BC%8C%E8%8E%B7%E5%8F%96%E6%A8%A1%E6%9D%BF%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let requestObject = {
        getDataUrl: 'https://www.hunbei.com/index/Editor/getPosters',
        saveDataUrl: 'https://www.hunbei.com/index/Editor/updatePoster',
        getMVDataUrl: 'https://www.hunbei.com/api/video/read',
        saveMVDataUrl: 'https://www.hunbei.com/api/video/updateAllSceneData',
        getLongPageDataUrl: 'https://www.hunbei.com/index/Editor/getScenes',
        flipPages:'https://www.hunbei.com/index/Editor/getScenes'
    }
    let oriData = {
        sys_id: '',
        pages: [{}]
    }
    let pageData = ""

    /**
     *
     * */
    function addXMLRequestCallback() {

        // oldSend 旧函数 i 循环
        let oldSend = XMLHttpRequest.prototype.send;
        let oldOpen = XMLHttpRequest.prototype.open;


        XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
            this._url = url; // 将 URL 存储在 XMLHttpRequest 实例的 _url 属性中
            oldOpen.apply(this, arguments);
        };

        XMLHttpRequest.prototype.send = function (data) {
            let self = this;
            this.addEventListener('load', function() {
                if (self.responseURL.includes(requestObject.getDataUrl)) {
                    // console.log('ready:', self.responseText)
                    let responseObject = JSON.parse(self.responseText);
                    console.log(responseObject.data)
                    oriData.secret=responseObject.data;
                }else if(self.responseURL.includes(requestObject.getMVDataUrl)){
                    let responseObject = JSON.parse(self.responseText);
                    console.log(responseObject.data)
                    oriData.MVData=responseObject.data;
                }else if(self.responseURL.includes(requestObject.getLongPageDataUrl)){
                    let responseObject = JSON.parse(self.responseText);
                    console.log("response data:",responseObject.data)
                    console.log('--------get Long Page Data----------')
                    oriData.secret=responseObject.data;
                    let res=decryptByAES(responseObject.data);
                    console.log(res);
                }
            });

            oldSend.call(this, data);
        };

    }
    let string2Object=(string)=>{
        let object={};
        string.split('&').forEach(function(item) {
            let parts = item.split('=');
            object[parts[0]] = parts[1];
        });
        return object;
    }
    let object2String=(object)=>{
        return Object.keys(object).map(function (key) {
            return key + '=' + object[key];
        }).join('&');
    }
    /**
     *
     * @param secret
     * @returns {{data: any, secret}}
     */
    let decryptByAES = (secret) => {
        // console.log("cryptoJs:", CryptoJS)
        if (CryptoJS === undefined) {
            throw error('cryptoJS requires error!');
        }
        var n = CryptoJS.enc.Utf8.parse("SMCs5dzwOfTePGZh")
            , r = CryptoJS.enc.Hex.parse(secret)
            , i = CryptoJS.enc.Base64.stringify(r);
        let result = CryptoJS.AES.decrypt(i, n, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        }).toString(CryptoJS.enc.Utf8).toString(CryptoJS.enc.Utf8)
        let res = JSON.parse(result);
        for (let i = 0, len = res.pages.length; i < len; i++) {
            res.pages[i].elements = JSON.parse(res.pages[i].elements)
        }
        return {
            secret:secret,
            data:res
        };
    }

    addXMLRequestCallback();

    window.onload = () => {
        let css = `.mydiv1{
            position: absolute;
            z-index: 9999999999;
            left: 100px;
            top: 300px;
            display: none;
        }
        .mybtn1 {
            z-index: 9999999999;
            position: relative;
            left: 20px;
            margin-left: 20px;
            font-size: inherit;
            font-family: inherit;
            color: white;
            padding: 0.5em 1em;
            outline: none;
            border: none;
            background-color: hsl(236, 32%, 26%);
            overflow: hidden;
            transition: color 0.4s ease-in-out;
        }
        .mybtn2 {
            z-index: 9999999999;
            position: absolute;
            top: 300px;
            font-size: inherit;
            font-family: inherit;
            color: white;
            padding: 0.5em 1em;
            outline: none;
            border: none;
            background-color: hsl(236, 32%, 26%);
            overflow: hidden;
            transition: color 0.4s ease-in-out;
        }

        .mybtn2::before,.mybtn1::before {
            content: '';
            z-index: -1;
            position: absolute;
            top: 100%;
            right: 100%;
            width: 1em;
            height: 1em;
            border-radius: 50%;
            background-color: #3cefff;
            transform-origin: center;
            transform: translate3d(50%, -50%, 0) scale3d(0, 0, 0);
            transition: transform 0.45s ease-in-out;
        }

        .mybtn2:hover,.mybtn1:hover {
            cursor: pointer;
            color: #161616;
        }

        .mybtn2:hover::before,.mybtn1:hover::before {
            transform: translate3d(50%, -50%, 0) scale3d(15, 15, 15);
        }`;
        GM_addStyle(css);
        let html = `<div>
    <button id="show_btn" class="mybtn2">获取模版</button>
    <div class="mydiv1" style="width: 500px;height: 400px;">
        <label>
            <textarea id="encryptData" style="background-color: aqua;width: 100%;height: 80%;" placeholder="模版加密数据"
                      required="required"></textarea>
        </label>
        <button id="resolve_btn"  class="mybtn1">点击复制</button>
    </div>
</div>`;
        let div = document.createElement('div');
        div.innerHTML = html;
        document.body.appendChild(div);
        let isShow = 0
        document.getElementById('show_btn').addEventListener("click", () => {
            isShow++
            if (isShow % 2 === 1) {
                document.getElementsByClassName('mydiv1')[0].style.display = 'block'
            } else {
                document.getElementsByClassName('mydiv1')[0].style.display = 'none'
            }
        })
        document.getElementById('resolve_btn').addEventListener('click', () => {
            let text = document.getElementById('encryptData')

            if(text.value==='')
                return;
            navigator.clipboard.writeText(text.value)
                .then(() => {
                    alert('已成功复制到剪贴板');
                })
                .catch(err => {
                    alert('复制失败')
                    console.error('复制失败：', err);
                });
            //location.reload();
            //document.getElementsByClassName('right-btn')[0].click()
        })
        document.getElementById('encryptData').value = oriData.secret || JSON.stringify(oriData.MVData);
        setTimeout(()=>{
            document.getElementById('encryptData').value = oriData.secret || JSON.stringify(oriData.MVData);
        },2000)
    }

})();