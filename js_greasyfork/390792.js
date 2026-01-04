// ==UserScript==
// @name         b站封面替换右侧广告 bilibili 哔哩哔哩
// @namespace    http://tampermonkey.net/
// @version      1.5.8
// @description  脚本将视频右侧的广告替换为视频封面
// @author       You
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/bangumi/play/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390792/b%E7%AB%99%E5%B0%81%E9%9D%A2%E6%9B%BF%E6%8D%A2%E5%8F%B3%E4%BE%A7%E5%B9%BF%E5%91%8A%20bilibili%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/390792/b%E7%AB%99%E5%B0%81%E9%9D%A2%E6%9B%BF%E6%8D%A2%E5%8F%B3%E4%BE%A7%E5%B9%BF%E5%91%8A%20bilibili%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9.meta.js
// ==/UserScript==

(function () {
    // 获取相对body的y
    function getOffsetTopByBody(el) {
        let offsetTop = 0
        while (el && el.tagName !== 'BODY') {
            offsetTop += el.offsetTop
            el = el.offsetParent
        }
        return offsetTop
    }
    // 获取相对body的x
    function getOffsetLeftByBody(el) {
        let offsetLeft = 0
        while (el && el.tagName !== 'BODY') {
            offsetLeft += el.offsetLeft
            el = el.offsetParent
        }
        return offsetLeft
    }
    // 获取元素位置信息
    function getRect(el){
        var rect = {}
        rect.x = getOffsetLeftByBody(el)
        rect.y = getOffsetTopByBody(el)
        rect.height = el.offsetHeight
        rect.width = el.offsetWidth
        return rect
    }

    // 初始化封面图DOM元素
    function genStructure() {
        var container = document.createElement('div')
        var box = document.createElement('a')
        var image = document.createElement('img')
        image.id = 'my-cover-image'
        image.style = 'height:auto;width:100%;display:block;'
        image.setAttribute('av', '000000')
        box.id = 'my-cover-box'
        box.target = '_blank'
        box.style.fontSize = '0px'
        box.appendChild(image)
        container.id = 'my-cover-container'
        container.style = 'position: absolute; width: 320px; height: auto; overflow: hidden; border-radius: 2px; background: #eee;z-index:1;'
        container.appendChild(box)
        return container
    }

    // css注入
    function injectCSS(){
        if(document.getElementsByClassName('close-btn')[0]){
            const close = document.getElementsByClassName('close-btn')[0]
            close.style.zIndex='-1';

        }else{
        
        requestAnimationFrame(injectCSS)
        }
    }
    injectCSS()

    //封面DOM元素嵌入
    var sideAd = null
    if (window.location.href.indexOf('bilibili.com/bangumi/play/') > 0) {
        var anchor = document.getElementById('recom_module')
        sideAd = document.createElement('div')
        sideAd.id = 'slide_ad'
        sideAd.style.position = 'reletive'
        sideAd.style.marginBottom = '12px'
        anchor.parentElement.removeChild(anchor.previousSibling)
        anchor.parentElement.insertBefore(sideAd, anchor)
    }


    var container = genStructure()
    var side = document.getElementsByClassName('r-con')[0] || document.getElementsByClassName('plp-r')[0]
    // var sideRect = side.getBoundingClientRect()
    sideAd = document.getElementById('slide_ad')
    // container.style.width = sideRect.width
    container.style.width = sideAd.offsetWidth
    container.style.left = getOffsetLeftByBody(sideAd).toString() + 'px'
    container.style.top = getOffsetTopByBody(sideAd).toString() + 'px'
    document.body.appendChild(container)


    // 封面图绑定函数
    function setImage(url, bv) {
        document.getElementById('my-cover-image').src = url
        document.getElementById('my-cover-image').setAttribute('bv', bv)
        document.getElementById('my-cover-box').href = url
    }

    // 获取meta
    function getMateByProperty(preoerty) {
        var metas = document.head.getElementsByTagName('meta')
        for (var i in metas) {
            if (metas[i].getAttribute('property') == preoerty) {
                return metas[i]
            }
        }
        return undefined
    }

    // 在meta获取失败时用api获取封面图地址
    function loadImage(bvid) {
        var apiurl = 'https://api.bilibili.com/x/web-interface/view?bvid='
        var xhr = new XMLHttpRequest()
        xhr.open('GET', apiurl + bvid, true)
        xhr.onload = function () {
            if (this.status === 200) {
                var rtx = this.responseText
                console.log(rtx)
                var imgurl = rtx.match(/"pic":"(.*?)",/)[1]
                var ci = document.getElementById('my-cover-image')
                if (ci.src.indexOf(imgurl) < 0) {
                    setImage(imgurl, bvid)
                }
            }
        }
        xhr.send()
    }


    // 常驻检查器
    function init() {

        var sideAd = document.getElementById('slide_ad')

        var sideAdRect = getRect(sideAd)
        var container = document.getElementById('my-cover-container')
        var containerRect = getRect(container)

        if (containerRect.x != sideAdRect.x) {
            container.style.left = sideAdRect.x.toString() + 'px'
        }
        if (containerRect.y != sideAdRect.y) {
            container.style.top = sideAdRect.y.toString() + 'px'
        }
        if (containerRect.width != sideAdRect.width) {
            container.style.width = sideAdRect.width.toString() + 'px'

        }
        if (sideAdRect.height != containerRect.height) {
            sideAd.style.height = containerRect.height.toString() + 'px'
        }
        
        var urlMeta = getMateByProperty('og:url')
        var coverMeta = getMateByProperty('og:image')
        if (urlMeta && coverMeta && document.getElementById('my-cover-image')) {
            var bvid = urlMeta.getAttribute('content').match(/BV[0-9a-zA-Z]+/)[0]

            var image = document.getElementById('my-cover-image')
            if (image.getAttribute('bv') != bvid) {
               loadImage(bvid)
            }
        }

        const sideAd2 = document.getElementsByClassName('vcd')[0]
        if(sideAd2){
            sideAd2.parentNode.innerHTML = ''
        }
        requestAnimationFrame(function () {
            init();
        })
    }
    init()
})();