// ==UserScript==
// @name         dspace自动生成二维码
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  测试测试
// @author       feisun
// @match        *://pre-d.alitrip.com/*
// @match        *://d.alitrip.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=alitrip.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448105/dspace%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90%E4%BA%8C%E7%BB%B4%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/448105/dspace%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90%E4%BA%8C%E7%BB%B4%E7%A0%81.meta.js
// ==/UserScript==



(function() {
    'use strict';
    const appendDivId = 'feisun_append_info'

    setTimeout(()=>{
        // 添加头部引入文件
        appendHead()
        // 开局监控一波
        monitorCard();
        // 如果有点击的话，重新监控新的节点
        document.querySelector('#scene_jstree_div').addEventListener('click',()=>{
            setTimeout(()=>{
                monitorCard();
            },300)
        })
    },500)

    function monitorCard(){
        // 查找到所有卡片
        const cardList = document.querySelectorAll('#scene-card-list .card-item');
        if(cardList&&cardList.forEach){
            console.log(cardList,'cardList')
            // 对每一个生成一个监听事件
            cardList.forEach(cardDom=>{
                var observe=new MutationObserver(function (mutations,observe) {
                    console.log('检测到了');
                    console.log(mutations,'mutations');
                    console.log(observe,'observe');
                    let addNode = mutations.filter((item)=>{ return item.addedNodes.length!==0})[0].addedNodes[0];
                    console.log(addNode.href,'获取到的链接');

                    let appendDiv = getInfoDiv(addNode.href);
                    // 如果已经有了，先移除旧的，再加上去新的
                    if(cardDom.querySelector('#'+appendDivId)){
                        cardDom.removeChild(cardDom.querySelector('#'+appendDivId))
                    }
                    cardDom.appendChild(appendDiv)
                });
                // 开始监听
                setTimeout(()=>{
                    console.log('监听dom',cardDom.querySelector('.runResult'))
                    observe.observe(cardDom.querySelector('.runResult'),{ childList: true});

                },100)
            })
        }
    }
    // 生成额外展示的div
    function getInfoDiv(url){
        let div = document.createElement('div');
        div.id = appendDivId;
        div.style= 'display: flex;justify-content: space-around;align-items: center;';
        // 二维码
        const qrcodeImg = document.createElement('img');
        qrcodeImg.src = `https://gqrcode.alicdn.com/img?type=hv&w=300&h=300&text=${encodeURIComponent(url)}`
        // 链接
        const Urls = document.createElement('div');
        const qUrl = document.createElement('div');
        qUrl.innerHTML = `q=${encodeURIComponent(url)}（点击复制`;
        qUrl.style='margin: 20px;padding: 20px;cursor: pointer;'
        qUrl.addEventListener('click',()=>{
            setClipboard(`q=${encodeURIComponent(url)}`)
        })
        const originUrl = document.createElement('div');
        originUrl.style='margin: 20px;padding: 20px;cursor: pointer;'
        originUrl.innerHTML = `qrCode=${encodeURIComponent(url)}（点击复制`
        originUrl.addEventListener('click',()=>{
            setClipboard(`qrCode=${encodeURIComponent(url)}`)
        })
        const h5PreUrl = document.createElement('a');
        h5PreUrl.style='margin: 20px;padding: 20px;cursor: pointer'
        h5PreUrl.href = `https://market.wapa.taobao.com/app/trip/rx-bus-utils/pages/offline?qrCode=${encodeURIComponent(url)}`
        h5PreUrl.target='_blank'
        h5PreUrl.innerHTML = `h5预发（点击跳转`

        const h5Url = document.createElement('a');
        h5Url.style='margin: 20px;padding: 20px;cursor: pointer'
        h5Url.href = `https://market.m.taobao.com/app/trip/rx-bus-utils/pages/offline?qrCode=${encodeURIComponent(url)}`
        h5Url.target='_blank'
        h5Url.innerHTML = `h5线上（点击跳转`

        Urls.appendChild(qUrl);
        Urls.appendChild(originUrl);
        Urls.appendChild(h5PreUrl);
        Urls.appendChild(h5Url);

        // 添加到div上面
        div.appendChild(qrcodeImg);
        div.appendChild(Urls);
        return div;
    };
    // 添加头部引入的css 和script
    function appendHead(){
        const head = document.getElementsByTagName('head')[0];
        const cssURL = 'https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css';
        const linkTag = document.createElement('link');
        linkTag.href = cssURL;
        linkTag.setAttribute('rel','stylesheet');
        linkTag.setAttribute('media','all');
        linkTag.setAttribute('type','text/css');
        var script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/toastify-js';
        head.appendChild(linkTag);
        head.appendChild(script);
    };
    // 设置剪贴板
    function setClipboard(text){
        navigator.clipboard.writeText(text).then(function() {
            console.log('复制成功')
            Toastify&&Toastify({
                text: "复制成功",
                duration: 3000
            }).showToast();
        }, function() {
            Toastify&&Toastify({
                text: "复制失败",
                duration: 3000
            }).showToast();
            console.log('复制失败')
        });
    }
    // Your code here...
})();