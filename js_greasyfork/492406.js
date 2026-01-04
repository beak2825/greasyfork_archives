// ==UserScript==
// @name         去水印--支持婚贝、图怪兽、创客贴、易企秀
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  支持婚贝、图怪兽、创客贴、易企秀的设计图片去水印，去水印后自行截图即可。
// @author       ZouYS
// @match        https://ue.818ps.com/v4/*
// @match        https://818ps.com/u/*
// @match        https://www.eqxiu.com/*
// @match        https://h5.hunbei.com/*
// @match        https://approval.818ps.com/ue/*
// @match        https://www.chuangkit.com/odyssey/design*
// @match        https://www.chuangkit.com/sharedesign*
// @icon         https://img0.baidu.com/it/u=3057892570,2098051223&fm=253&fmt=auto&app=138&f=PNG?w=256&h=256
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492406/%E5%8E%BB%E6%B0%B4%E5%8D%B0--%E6%94%AF%E6%8C%81%E5%A9%9A%E8%B4%9D%E3%80%81%E5%9B%BE%E6%80%AA%E5%85%BD%E3%80%81%E5%88%9B%E5%AE%A2%E8%B4%B4%E3%80%81%E6%98%93%E4%BC%81%E7%A7%80.user.js
// @updateURL https://update.greasyfork.org/scripts/492406/%E5%8E%BB%E6%B0%B4%E5%8D%B0--%E6%94%AF%E6%8C%81%E5%A9%9A%E8%B4%9D%E3%80%81%E5%9B%BE%E6%80%AA%E5%85%BD%E3%80%81%E5%88%9B%E5%AE%A2%E8%B4%B4%E3%80%81%E6%98%93%E4%BC%81%E7%A7%80.meta.js
// ==/UserScript==
/*请勿随意传播，自己使用就好，不然很容易被官方ban*/
(function() {
    'use strict';

    /*
 * @Author: zouys 1423980405@qq.com
 * @Date: 2024-04-12 14:49:35
 * @LastEditors: zouys 1423980405@qq.com
 * @LastEditTime: 2024-05-14 12:29:31
 * @FilePath: \Project_client\water-mask.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
    var chuangKitUrl='';


    /**获取创可贴链接 */
    var getImg=(delay)=>{
        setTimeout(() =>{
            if(document.querySelector('img[alt="设计缩略图"]')==null){
                getImg(1000);
                return
            }
            let imgURL=document.querySelector('img[alt="设计缩略图"]').src
            console.log(imgURL);
            downloadImage(imgURL,new Date().getTime.toString())
        },delay || 3000)
    }
    /**
     * 捕获请求获取url
     * */
    let getImageUrlFromXHR=()=>{

    }
    function addXMLRequestCallback() {
        let url={
            shareInfo:'https://gw.chuangkit.com/team/share/getShareInfoV3.do'
        }
        // oldSend 旧函数 i 循环
        var oldSend = XMLHttpRequest.prototype.send;
        var oldOpen = XMLHttpRequest.prototype.open;


        XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
            this._url = url; // 将 URL 存储在 XMLHttpRequest 实例的 _url 属性中
            oldOpen.apply(this, arguments);
        };
        XMLHttpRequest.prototype.send = function (data) {
            var self = this;
            //拦截返回请求
            this.addEventListener('load', function() {
                if (self.responseURL.includes(url.shareInfo)) {
                    let responseObject = JSON.parse(self.responseText);
                    chuangKitUrl= responseObject.body.bean.imgUrl;
                    console.log('捕获请求,url:',chuangKitUrl)
                }else if (1){

                }
            });

            oldSend.call(this, data);
        };

    }
    addXMLRequestCallback()
    /**
     * 图怪兽去水印
     * https://ue.818ps.com/v4/
     */
    var doTuGuaiShou=async()=>{
        //获取分享链接
        await document.querySelector('.headerBtnItem.userShare').click();

        setTimeout(() => {
            var shareURL = document.getElementById('link').value.split('：')[1];
            console.log(shareURL);

            var newWindow = window.open(shareURL);
            console.log('new window：',newWindow);


            /*同源通信策略
            newWindow.onload = () => {
                let newWindowDocument = newWindow.document;
                let approvalIframe = newWindowDocument.getElementById('approval-iframe');
                console.log('newWindowDocument：',newWindowDocument);
                if (approvalIframe) {
                    let approvalIframeSrc = approvalIframe.src;
                    console.log('Approval Iframe Source:', approvalIframeSrc);

                    var secWindow = window.open(approvalIframeSrc);

                    secWindow.onload = () => {
                        let secWindowDocument = secWindow.document;
                        let imageWatermark = secWindowDocument.querySelector('.image-watermark');

                        if (imageWatermark) {
                            imageWatermark.remove();
                        }

                        // 使用循环确保移除所有类名为 '.image-watermark' 的元素
                        while (secWindowDocument.querySelector('.image-watermark')) {
                            secWindowDocument.querySelector('.image-watermark').remove();
                        }
                    };
                } else {
                    console.log('No approval iframe found in the new window.');
                }
            };*/
        }, 1000);
    }

    /**
     * https://www.eqxiu.com/
     * 易企秀去水印
     */

    var doYiQiXiu=()=>{
        while(document.querySelector('.eqc-watermark')!=null) {
            document.querySelector('.eqc-watermark').remove()
        }
        // while(document.querySelector('[data-hint="双击或从素材库拖拽进行替换"]')!=null)
        document.querySelector('[data-hint="双击或从素材库拖拽进行替换"]').remove()
    }

    /**
     * 婚贝
     * https://h5.hunbei.com/
     */
    var doHunBe=async()=>{
        //去除页面监听
        // 保存 MutationObserver 的原始引用
        var originalMutationObserver = window.MutationObserver;

        // 重写 MutationObserver 的原型
        window.MutationObserver = function(callback) {
            // 返回一个空的对象，模拟 MutationObserver 的行为，但不执行任何操作
            this.observe = function() {};
            this.disconnect = function() {};
            this.takeRecords = function() {};
        };
        // 为了兼容性，保留原始的 MutationObserver 属性
        window.MutationObserver.prototype = originalMutationObserver.prototype;
        console.log(1)
        // 保存原始的 addEventListener 方法
        var originalAddEventListener = Element.prototype.addEventListener;

        // 重写 addEventListener 方法
        Element.prototype.addEventListener = function(type, listener, options) {
            // 如果是要添加的事件是 'DOMNodeInserted'
            if (type === 'DOMNodeInserted') {

            } else {
                // 对于其他类型的事件，调用原始的 addEventListener 方法
                originalAddEventListener.call(this, type, listener, options);
            }
        };
        // 使用 setTimeout 来延迟执行循环体

        // setTimeout(function() {
        //     do {
        //         var watermark = document.getElementById('water-mark');
        //         if (watermark) {
        //             watermark.remove();
        //         }
        //     } while (watermark !== undefined);
        // }, 0);
        await sleep(2000);
        document.getElementById('water-mark') &&  document.getElementById('water-mark').remove();
        document.getElementById('water-mark') && document.getElementById('water-mark').remove();
        // console.log('MutationObserver');
        setTimeout(() => {
            console.log('3');
            document.getElementById('water-mark').remove();
            setTimeout(() => {
                if(document.getElementById('water-mark')===null) {
                    alert('去除水印成功！');
                }
            }, 1000);
        },1000)

    }



    /**
     * 创客贴
     * https://www.chuangkit.com/odyssey/design
     */
    var doChuangKeTie=()=>{
        document.querySelector('.personal-share-design-warp-btn').click()
        setTimeout(() => {
            var chuangkitURL=document.querySelector('.link-text').innerText
            var chuangkitWindow=window.open(chuangkitURL)
            setTimeout(()=>{
                console.log('sencond page loaded');
                let mydom=chuangkitWindow.document
                //图片链接
                let chuangkitImgURL=mydom.querySelector('img[alt="设计缩略图"]')
                console.log('chuangkitImgURL',chuangkitImgURL);
            },3000)
            chuangkitWindow.onload=()=>{
                console.log('sencond page loaded');
                let mydom=chuangkitWindow.document
                //图片链接
                let chuangkitImgURL=mydom.querySelector('img[alt="设计缩略图"]')
                console.log('chuangkitImgURL',chuangkitImgURL);
            }
        },1000);
    }
    function downloadImage(url, filename) {
        var link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    async function sleep(time) {
        console.log('睡眠' + time / 1000 + 's')
        //if(time < 1000)time=1000
        return await new Promise((resolve) => setTimeout(resolve, time));
    }


    window.onload = () =>{
        console.log('loaded: url:',location.href)
        console.log('state： ', document.readyState)
        let needSrc=location.href;
        //图怪兽分享界面直接获取链接
        //非同源通信策略
        if(window.location.href.includes('https://818ps.com/u/')){
            console.log('share page')
            let approvalIframe = document.getElementById('approval-iframe');
            console.log('approvalIframe:',approvalIframe);
            if (approvalIframe) {
                let approvalIframeSrc = approvalIframe.src;
                console.log('Approval Iframe Source:', approvalIframeSrc);
                let size = prompt('图片大小(默认520，越大越清晰)','520' ); //将输入的内容赋给变量 name
                let substring=approvalIframeSrc.split('height=')[1]= size || '520';
                approvalIframeSrc=approvalIframeSrc.split('height=')[0]+'height='+substring;
                let secWindow = window.open(approvalIframeSrc);

            }
            window.close();
            return
        }
        if(window.location.href.includes("https://approval.818ps.com/ue/")){
            console.log(window.location.href.includes("https://approval.818ps.com/ue/"))
            console.log('检查水印')
            try {
                while(document.querySelectorAll('.image-watermark')!=null){
                    document.querySelector('.image-watermark').remove();
                }
            }catch (e) {
                console.log(e);
            }
            let approvalIframeSrc = location.href;
            console.log('Approval Iframe Source:', approvalIframeSrc);

            let size = prompt('图片大小(建议520以上，越大越清晰)--重复弹窗请点击取消！' ); //将输入的内容赋给变量 name
            if(size===null){
                return;
            }else {
                let substring=approvalIframeSrc.split('height=')[1]= size;
                approvalIframeSrc=approvalIframeSrc.split('height=')[0]+'height='+substring;
                let secWindow = window.open(approvalIframeSrc);
            }
            return
        }
        if(window.location.href.includes("https://www.chuangkit.com/sharedesign")){
            //console.log('获取图片链接')
            let imgURL
            console.log('chuangKitUrl:',chuangKitUrl);
            if(chuangKitUrl!==''){
                imgURL='https:'+chuangKitUrl;
                downloadImage(imgURL,new Date().getTime.toString())
            }else {
                setTimeout(() =>{

                    if(document.querySelector('img[alt="设计缩略图"]').src){
                        imgURL=document.querySelector('img[alt="设计缩略图"]').src
                    }else {

                    }
                    // console.log(imgURL);
                    downloadImage(imgURL,new Date().getTime.toString())
                },5000)
            }

            return
        }
        let showWindow = document.createElement('button')
        showWindow.style.width = '100px'
        showWindow.style.height = '40px'
        showWindow.innerText = '一键祛除水印'
        showWindow.style.position = 'fixed'
        showWindow.style.right = '50%'
        showWindow.style.top = '0px'
        showWindow.style.zIndex = '9999999'
        showWindow.style.backgroundColor = 'yellow'
        showWindow.style.color = 'red'
        showWindow.addEventListener('click', () =>{
            /**婚贝 */
            if(window.location.href.includes('https://h5.hunbei.com/')){
                doHunBe();
            }
            /**图怪兽 */
            if(window.location.href.includes('https://ue.818ps.com/v4/')){
                doTuGuaiShou();
            }
            /**易企秀 */
            if(window.location.href.includes('https://www.eqxiu.com/')){
                doYiQiXiu();
            }
            /**创客贴 */
            if(window.location.href.includes('https://www.chuangkit.com/odyssey/design')){
                doChuangKeTie();
            }
        })
        document.body.appendChild(showWindow)

    }
})();