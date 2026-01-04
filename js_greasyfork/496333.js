// ==UserScript==
// @name         八图h5分享/代发布，获取H5信息
// @namespace    http://tampermonkey.8tuh5Sharer.net/
// @version      1.0
// @description  八图h5分享/代发布，作品分享同步功能，用于获取模板信息，前置准备脚本。
// @author       zouys
// @match        https://www.zhizuoh5.com/editor/*
// @icon         https://www.zhizuoh5.com/favicon.ico
// @require      https://fastly.jsdelivr.net/npm/crypto-js@4.2.0
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/496333/%E5%85%AB%E5%9B%BEh5%E5%88%86%E4%BA%AB%E4%BB%A3%E5%8F%91%E5%B8%83%EF%BC%8C%E8%8E%B7%E5%8F%96H5%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/496333/%E5%85%AB%E5%9B%BEh5%E5%88%86%E4%BA%AB%E4%BB%A3%E5%8F%91%E5%B8%83%EF%BC%8C%E8%8E%B7%E5%8F%96H5%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let requestObject = {
        getDataUrl: 'https://www.zhizuoh5.com/api/getScene',
        saveDataUrl: 'https://h5.hunbei.com/index/Editor/updatePoster',
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
                    console.log(responseObject.obj)
                    oriData.secret=responseObject.obj;
                }else if(0){
                    let responseObject = JSON.parse(self.responseText);
                    console.log(responseObject.data)
                    oriData.MVData=responseObject.data;
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
        document.getElementById('encryptData').value = oriData.secret ;
        setTimeout(()=>{
            document.getElementById('encryptData').value = oriData.secret;
        },2000)
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
    }

})();