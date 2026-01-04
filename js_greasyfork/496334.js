// ==UserScript==
// @name         八图，h5分享同步功能
// @namespace    http://tampermonkey.8tushare.net/
// @version      1.01
// @description  八图，h5分享同步功能，目前仅支持H5作品同步。需要前置数据，请参考：
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
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/496334/%E5%85%AB%E5%9B%BE%EF%BC%8Ch5%E5%88%86%E4%BA%AB%E5%90%8C%E6%AD%A5%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/496334/%E5%85%AB%E5%9B%BE%EF%BC%8Ch5%E5%88%86%E4%BA%AB%E5%90%8C%E6%AD%A5%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let requestObject = {
        getDataUrl: 'https://www.zhizuoh5.com/api/getScene',
        savePageUrl: 'https://www.zhizuoh5.com/api/savePage',
        saveSceneUrl: 'https://www.zhizuoh5.com/api/saveScene',
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
            // 拦截发送请求
            if (self._url.includes(requestObject.savePageUrl)) {
                let secretData = string2Object(data)
                secretData.elements = JSON.parse(decodeURIComponent(secretData.elements));
                console.log("secretData", secretData);
                let pageData = GM_getValue(document.location.href.split('scene_id=')[1] + "", "")
                console.log("pageData", pageData);
                if (pageData === "" || pageData.useful === 1) {
                    console.log("jump catch")
                } else {
                    secretData.pageData = pageData.secret;
                    secretData.elements = pageData.updateData.global
                    console.log('Payload:', secretData);
                    secretData.elements = encodeURIComponent(JSON.stringify(secretData.elements));
                    data = object2String(secretData)

                }

            } else if (self._url.includes(requestObject.saveSceneUrl)) {
                let sendData = string2Object(data)
                let MVPageData = GM_getValue(document.location.href.split('video_id=')[1] + "", "")
                if (MVPageData === "" || MVPageData.useful === 1) {
                    console.log("jump catch")
                } else {
                    sendData.audio = encodeURIComponent(JSON.stringify(MVPageData.updateData.audio));
                    sendData.sceneList = encodeURIComponent(JSON.stringify(MVPageData.updateData.sceneData));
                    data = object2String(sendData);
                    GM_deleteValue(document.location.href.split('video_id=')[1] + "")
                }
                console.log("send MV Data", sendData);

            }

            //拦截返回请求,获取模版加密数据
            /*this.addEventListener('load', function() {
                if (self.responseURL.includes(requestObject.getDataUrl)) {
                    let responseObject = JSON.parse(self.responseText);
                    console.log('responseObject:',responseObject);
                    if(responseObject.code==="200" && responseObject.msg==="success"){
                        console.log('responseObject.data:',responseObject.data);
                        responseObject.data='111111111111111'
                        console.log('changed responseObject:',responseObject);
                        // 修改响应数据
                        let modifiedResponse = JSON.stringify(responseObject);

                        // 将修改后的响应发送给浏览器
                        Object.defineProperty(self, 'response', { writable: true });
                        Object.defineProperty(self, 'responseText', { writable: true });
                        self.response = modifiedResponse;
                        self.responseText = modifiedResponse;
                        console.log('self',this)
                    }
                }
            });*/
            //拦截返回请求,获取模版加密数据
            this.addEventListener('load', function () {
                if (self.responseURL.includes(requestObject.getDataUrl)) {
                    // console.log('ready:', self.responseText)
                    let responseObject = JSON.parse(self.responseText);
                    console.log(responseObject.obj)
                    let res = decryptByAES(responseObject.obj);
                    getOriPageData(res)
                    console.log('--------get Page Data----------')
                    // let storageData=GM_getValue(document.location.href.split('scene_id=')[1] + "")
                    // console.log("scene id:"+document.location.href.split('scene_id=')[1] + "")
                    // console.log("get local encryptData: ",storageData)
                } else if (0) {

                }
            });

            oldSend.call(this, data);
        };

    }

    /**
     *
     * @param t
     * @returns {any}
     */

    let decryptByAES = (t) => {
        // console.log("cryptoJs:", CryptoJS)
        var e = t.slice(-32);
        e = CryptoJS.MD5(e).toString();
        var n = CryptoJS.enc.Utf8.parse(e.substring(0, 16))
            , i = CryptoJS.enc.Utf8.parse(e.substring(16))
            , r = t.slice(0, -32);
        return JSON.parse(CryptoJS.AES.decrypt(r, i, {
            iv: n,
            padding: CryptoJS.pad.Pkcs7
        }).toString(CryptoJS.enc.Utf8))
    }
    let string2Object = (string) => {
        let object = {};
        string.split('&').forEach(function (item) {
            let parts = item.split('=');
            object[parts[0]] = parts[1];
        });
        return object;
    }
    let object2String = (object) => {
        return Object.keys(object).map(function (key) {
            return key + '=' + object[key];
        }).join('&');
    }

    let encrypt = (e) => {
        var t = "SMCs5dzwOfTePGZh";
        -1 !== window.location.href.indexOf("xiaobao.cc") && (t = "ZMns9dzwOfTwPGZh");
        var n = CryptoJS.enc.Utf8.parse(t);
        return CryptoJS.AES.encrypt(e, n, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        }).ciphertext.toString()
    }
    let getOriPageData = (data) => {
        //global数据获取
        // oriData.sys_id=res.global.sys_id;
        // console.log("oriData.sys_id",oriData.sys_id);
        oriData = data
        console.log("oriData: ", oriData);
    }
    /**
     *
     * @param obj
     * @returns {*}
     */
    let getUpdatePageData = (obj) => {
        // obj.content.scene
        let data = obj.content;
        data.scene.code = oriData.content.scene.code;
        data.scene.id = oriData.content.scene.id;
        data.scene.title = data.scene.title + '--八图作品分享';
        // obj.content.list
        //console.log("des data", data);
        try {
            for (let i = 0, len = data.list.length; i < len; i++) {
                //console.log(`oriData.content.list[${i}]:`,oriData.content.list[i])
                data.list[i].sceneId = data.scene.id;
                data.list[i].id = oriData.content.list[i].id;
                //获取form信息
                for (let j = 0, jLen = data.list[i].elements.length; j < jLen; j++) {
                    let property = data.list[i].elements[j];
                    if (property.properties && property.properties.placeholder && property.properties.placeholder !== '') {
                        let objForm = {
                            id: property.id,
                            name: property.properties.placeholder
                        }
                        // console.log('data.scene.form',data.scene.form)
                        // data.scene.form ? console.log(true) : console.log(false)
                        data.scene.form===undefined ? data.scene.form = [objForm] : data.scene.form.push(objForm)

                    }
                }
            }
        }catch (e){
            alert("请确保模板的页面数量相同！"+e)
        }
        console.log('updated data:', data)
        let storageObj = {
            useful: 0,
            updateData: data,
        }
        GM_setValue(window.sceneId, storageObj);
        console.log("storageObj: ", GM_getValue(window.sceneId));
        return data
    }
    let savePageRequest=(page,p)=>{
        fetch("https://www.zhizuoh5.com/api/savePage", {
            "headers": {
                "accept": "*/*",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                "content-type": "application/json",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Microsoft Edge\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            "referrer": `https://www.zhizuoh5.com/editor/u1505282mm8fp.html?p=${p}`,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": JSON.stringify({
                obj:page
            }),
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        }).then(r => {
            console.log(`request savePageRequest(page ${p}):`, r);
        });
    }
    let saveSceneRequest=(scene,p)=>{
        fetch("https://www.zhizuoh5.com/api/saveScene", {
            "headers": {
                "accept": "*/*",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                "content-type": "application/json",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Microsoft Edge\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            "referrer": `https://www.zhizuoh5.com/editor/u1505282mm8fp.html?p=${p}`,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": JSON.stringify(scene),
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        }).then(r => {
            console.log(`request saveSceneRequest(page ${p}):`, r);
        });
    }
    addXMLRequestCallback();
    const pageEncrypt=(t)=>{
        let e = JSON.stringify(t)
            , n = CryptoJS.MD5(Date.now()).toString()
            , i = CryptoJS.enc.Utf8.parse(n.slice(0, 16))
            , r = CryptoJS.enc.Utf8.parse(n.slice(16))
            , o = "AES-128-CBC"
            , s = CryptoJS.AES.encrypt(e, r, {
            algorithm: o,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
            iv: i
        }).toString();
        return s + n
    }

    let saveH5=async ()=>{
        let data=GM_getValue(document.location.href.split('video_id=')[1] + "")
        if(data!==""){
            data=data.updateData;
            let i,len;
            for( i= 0, len = data.list.length; i < len; i++) {
                //保存每一页
               await savePageRequest(pageEncrypt(data.list[i]),i+1);
            }
            //保存模板
            await saveSceneRequest(data.scene,i+1);
        }

    }
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
    <button id="show_btn" class="mybtn2">解析模版</button>
    <div class="mydiv1" style="width: 500px;height: 400px;">
        <label>
            <textarea id="encryptData" style="background-color: aqua;width: 100%;height: 80%;" placeholder="输入获得的模版加密数据"
                      required="required"></textarea>
        </label>
        <button id="resolve_btn"  class="mybtn1">点击解析H5</button>
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
            let value = document.getElementById('encryptData').value
            if (value === '')
                return;
            let obj = decryptByAES(value);
            getUpdatePageData(obj);
            saveH5().then(r => {
                location.reload();
            });
            //location.reload();
            //document.getElementsByClassName('right-btn')[0].click()


        })
    }

})();