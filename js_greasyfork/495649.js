// ==UserScript==
// @name         婚贝，作品分享同步功能
// @namespace    http://tampermonkey.share.net/
// @version      1.20
// @description  婚贝，作品分享同步功能，目前支持海报、MV、翻页、长页 作品同步。需要前置数据，请参考：https://greasyfork.org/zh-CN/scripts/495568-%E5%A9%9A%E8%B4%9D-%E4%BD%9C%E5%93%81%E5%88%86%E4%BA%AB%E5%90%8C%E6%AD%A5%E5%8A%9F%E8%83%BD-%E8%8E%B7%E5%8F%96%E6%A8%A1%E6%9D%BF%E4%BF%A1%E6%81%AF
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
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/495649/%E5%A9%9A%E8%B4%9D%EF%BC%8C%E4%BD%9C%E5%93%81%E5%88%86%E4%BA%AB%E5%90%8C%E6%AD%A5%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/495649/%E5%A9%9A%E8%B4%9D%EF%BC%8C%E4%BD%9C%E5%93%81%E5%88%86%E4%BA%AB%E5%90%8C%E6%AD%A5%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let requestObject = {
        getDataUrl: 'https://www.hunbei.com/index/Editor/getPosters',
        saveDataUrl: 'https://www.hunbei.com/index/Editor/updatePoster',
        getMVDataUrl: 'https://www.hunbei.com/api/video/read',
        saveMVDataUrl: 'https://www.hunbei.com/api/video/updateAllSceneData',
        getLongPageDataUrl: 'https://www.hunbei.com/index/Editor/getScenes',
        saveLongPageDataUrl: 'https://www.hunbei.com/index/Editor/updateScenes',
        flipPages:'https://www.hunbei.com/index/Editor/getScenes',
        saveFlipPages:'https://www.hunbei.com/index/Editor/updateScenes',
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
            if (self._url.includes(requestObject.saveDataUrl)) {
                let secretData=string2Object(data)
                secretData.elements=JSON.parse(decodeURIComponent(secretData.elements));
                console.log("secretData", secretData);
                let pageData=GM_getValue(document.location.href.split('scene_id=')[1] + "","")
                console.log("pageData",pageData);
                if(pageData===""||pageData.useful===1){
                    console.log("jump catch")
                }else {
                    secretData.pageData=pageData.secret;
                    secretData.elements=pageData.updateData.global
                    console.log('Payload:', secretData);
                    secretData.elements=encodeURIComponent(JSON.stringify(secretData.elements));
                    data=object2String(secretData)
                    GM_deleteValue(document.location.href.split('scene_id=')[1] + "")
                }

            }else if (self._url.includes(requestObject.saveMVDataUrl)){
                let sendData=string2Object(data)
                let MVPageData=GM_getValue(document.location.href.split('video_id=')[1] + "","")
                if(MVPageData===""||MVPageData.useful===1){
                    console.log("jump catch")
                }else {
                    sendData.audio=encodeURIComponent(JSON.stringify(MVPageData.updateData.audio));
                    sendData.sceneList=encodeURIComponent(JSON.stringify(MVPageData.updateData.sceneData));
                    data=object2String(sendData);
                    GM_deleteValue(document.location.href.split('video_id=')[1] + "")
                }
                console.log("send MV Data",sendData);

            }else if(self._url.includes(requestObject.saveLongPageDataUrl)){
                let sendData=string2Object(data)
                console.log('长页：',sendData)
                let pageData=GM_getValue(document.location.href.split('scene_id=')[1] + "","")
                console.log("pageData",pageData);
                if(pageData===""||pageData.useful===1){
                    console.log("jump catch")
                }else {
                    pageData.updateData.global.useFont=JSON.parse(pageData.updateData.global.useFont);
                    sendData.pageData=pageData.secret;
                    sendData.globalData=(JSON.stringify(pageData.updateData.global));
                    console.log('longPage save Payload:', sendData);
                    data=object2String(sendData)
                    GM_deleteValue(document.location.href.split('scene_id=')[1] + "")
                }
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
                    console.log(responseObject.data)
                    let res = decryptByAES(responseObject.data);
                    getOriPageData(res.data)
                    console.log('--------get Page Data----------')
                    let storageData=GM_getValue(document.location.href.split('scene_id=')[1] + "")
                    console.log("scene id:"+document.location.href.split('scene_id=')[1] + "")
                    console.log("get local encryptData: ",storageData)
                }else if (self.responseURL.includes(requestObject.getMVDataUrl)){
                    let responseObject = JSON.parse(self.responseText);
                    console.log("response data:",responseObject.data)
                    getOriPageData(responseObject.data)
                    console.log('--------get MV Page Data----------')

                }else if(self.responseURL.includes(requestObject.getLongPageDataUrl)){
                    let responseObject = JSON.parse(self.responseText);
                    console.log(responseObject.data)
                    let res = decryptByAES(responseObject.data);
                    getOriPageData(res.data)
                    // console.log('encrypt:',encrypt(JSON.stringify(oriData.pages)))
                    console.log('--------get LongPage/flip Data----------')
                    let storageData=GM_getValue(document.location.href.split('scene_id=')[1] + "")
                    console.log("scene id:"+document.location.href.split('scene_id=')[1] + "")
                    console.log("get local encryptData: ",storageData)
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
    let encrypt=(e)=>{
        let t = "SMCs5dzwOfTePGZh";
        -1 !== window.location.href.indexOf("xiaobao.cc") && (t = "ZMns9dzwOfTwPGZh");
        var n = CryptoJS.enc.Utf8.parse(t);
        return CryptoJS.AES.encrypt(e, n, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        }).ciphertext.toString()
    }

    let encryptByLongPage=(data)=>{
        let t = "SMCs5dzwOfTePGZh";
        let n = CryptoJS.enc.Utf8.parse(t);
    }
    let getOriPageData = (data) => {
        //global数据获取
        // oriData.sys_id=res.global.sys_id;
        // console.log("oriData.sys_id",oriData.sys_id);
        oriData = data
        if(oriData.global){
            oriData.global.useFont=JSON.parse(oriData.global.useFont)
        }
        console.log("oriData: ", oriData);
    }
    /**
     *
     * @param obj
     * @returns {*}
     */
    let getUpdatePageData = (obj) => {
        let data=obj.data;
        data.global.uid = window.localStorage.userId
        if(oriData.global.ver){
            data.global.ver=oriData.global.ver
        }
        data.global.title = data.global.title + "--海报--作品分享"
        if (oriData.sys_id === "") {
            throw Error("can't get sys_id!")
        }
        data.global.sys_id = oriData.global.sys_id
        //pages update
        for (let i = 0; i < data.pages.length; i++) {
            //console.log('sys_id update: ', data.pages[i].sys_id)
            data.pages[i].sceneId = document.location.href.split('scene_id=')[1];
            //console.log('sceneId update: ',data.pages[i].sceneId)
            data.pages[i].uid = window.localStorage.userId;
            data.pages[i].pageId = oriData.pages[i].pageId;
            //console.log('uid update: ',data.pages[i].uid)
            //pages->elements  update
            for (let j = 0; j < data.pages[i].elements.length; j++) {
                data.pages[i].elements[j].id = "copy-" + (+new Date + Math.round(1e7 * Math.random()));
            }
        }
        console.log('updated data:', data)
        let storageObj = {
            useful: 0,
            updateData: data,
            secret: encrypt(JSON.stringify(data.pages))
        }
        GM_setValue(document.location.href.split('scene_id=')[1] + "", storageObj);
        console.log("storageObj: ", GM_getValue(document.location.href.split('scene_id=')[1] + ""));
        return data

    }
    addXMLRequestCallback();
    /**
     *
     * @param data
     */
    let getUpdateMVPageData = (data) => {
        data.title=oriData.title+'--mv作品分享';
        data.text_count=data.title.length || oriData.text_count;
        data.systemUser=oriData.systemUser;
        data.temp_id=oriData.temp_id;
        data.uid=oriData.uid;
        data.videocode=oriData.videocode;
        //sceneData
        for (let i = 0, len = data.sceneData.length; i < len; i++) {
            data.sceneData[i].id = oriData.sceneData[i].id;
        }
        console.log('updated mv data:', data)
        let storageObj = {
            useful: 0,
            updateData: data,
        }
        GM_setValue(document.location.href.split('video_id=')[1] + "", storageObj);
        console.log("MV storageObj: ", GM_getValue(document.location.href.split('video_id=')[1] + ""));
    }
    let resolveLongPageData = (obj) => {
        let data=obj.data
        data.global.uid = window.localStorage.userId
        data.global.ver = oriData.global.ver
        data.global.title = data.global.title + "--长页/翻页--作品分享"
        for (let i = 0; i < data.pages.length; i++) {
            data.pages[i].pageId=oriData.pages[i].pageId;
        }
        // console.log('data.pages:',data.pages)
        let storageObj = {
            useful: 0,
            updateData: data,
            secret: encrypt(JSON.stringify(data.pages))
        }
        GM_setValue(document.location.href.split('scene_id=')[1] + "", storageObj);
        console.log("storageObj: longpage", GM_getValue(document.location.href.split('scene_id=')[1] + ""));
        return data
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
        <button id="resolve_btn"  class="mybtn1">点击解析海报</button>
        <button id="resolve_btn_mv"  class="mybtn1">点击解析MV</button>
        <button id="resolve_btn_long_page"  class="mybtn1">解析长页</button>
        <button id="resolve_btn_flip_page"  class="mybtn1">解析翻页</button>
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
            if(value==='')
                return;
            if(document.location.href.includes('https://h5.hunbei.com/h5mv')){
                window.location.href=value;
                location.reload();
            }else{
                let obj = decryptByAES(value);
                getUpdatePageData(obj);
                //location.reload();
                //document.getElementsByClassName('right-btn')[0].click()
            }

        })
        document.getElementById('resolve_btn_mv').addEventListener('click', () => {
            let value = document.getElementById('encryptData').value;
            if(value!==''){
                getUpdateMVPageData(JSON.parse(value));
                //减少操作
                document.getElementsByClassName('right-btn')[0].click()
                //location.reload();
            }
        })
        document.getElementById('resolve_btn_long_page').addEventListener('click',()=>{
            let value = document.getElementById('encryptData').value
            if(value==='')
                return;
            let obj = decryptByAES(value);
            resolveLongPageData(obj);
                //location.reload();
                //document.getElementsByClassName('right-btn')[0].click()

        })
        document.getElementById('resolve_btn_flip_page').addEventListener('click',()=>{
            let value = document.getElementById('encryptData').value
            if(value==='')
                return;
            let obj = decryptByAES(value);
            resolveLongPageData(obj);
            //location.reload();
            //document.getElementsByClassName('right-btn')[0].click()

        })

    }

})();