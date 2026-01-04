// ==UserScript==
// @name         畫面處理操作(版面、換頁)
// @namespace    http://tampermonkey.net/
// @version      2025-12-31
// @description  版面調整、滑鼠連點兩下換頁
// @author       You
// 
// @connect      黃金屋
// @match        https://tw.hjwzw.com/Book/Read/*
// @connect      稷下書院
// @match        https://www.novel543.com/*.html
// @match        https://read.timotxt.com/*.html
// @match        https://look.thisiscm.com/*.html
// @connect      colamanga
// @match        https://www.colamanga.com/manga-*.html
// @connect      小說狂人
// @match        https://czbooks.net/n/*?chapterNumber=*
// @match        https://czbooks.net/n/*
// @connect      破萬卷
// @match        https://powanjuan.cc/*
// @connect      台灣小說
// @match        https://twkan.com/txt/*
//
// @connect      方吉君速報
// @match        https://rinakawaei.blogspot.com/*
// @connect      AO翻迷因儲存區
// @match        https://aofunmemes.blogspot.com/*
// @connect      日本推特集散地
// @match        https://mrkoiwai.blogspot.com/*
// 
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537118/%E7%95%AB%E9%9D%A2%E8%99%95%E7%90%86%E6%93%8D%E4%BD%9C%28%E7%89%88%E9%9D%A2%E3%80%81%E6%8F%9B%E9%A0%81%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537118/%E7%95%AB%E9%9D%A2%E8%99%95%E7%90%86%E6%93%8D%E4%BD%9C%28%E7%89%88%E9%9D%A2%E3%80%81%E6%8F%9B%E9%A0%81%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 平台列表
    const platformList = {
        // 
        hjwzw: '黃金屋',
        novel543: '稷下書院',
        timotxt: '稷下書院',
        thisiscm: '稷下書院',
        colamanga: 'colamanga',
        czbooks: '小說狂人',
        powanjuan: '破萬卷',
        twkan: '台灣小說',
        // 
        rinakawaei: '方吉君速報',
        aofunmemes: 'AO翻迷因儲存區',
        mrkoiwai: '日本推特集散地',
    }
    // 確認是哪平台
    const getPlatform = () => {
        // 目前網域
        const hostname = window.location.hostname
        //alert(hostname)
        //使用Object.keys()方法取得物件的Key的陣列
        for (var platformKey of Object.keys(platformList)) {
            // alert(platformKey+": "+platformList[platformKey]);
            if (hostname.includes(platformKey)) {
                return platformList[platformKey]
            }
        }
    }
    // 取得平台資訊
    const platformName = getPlatform()

    // 移除物件
    const removePstCommon = (postObj, removeTarget) => {
        let beRemoveObj = postObj.querySelector(removeTarget)
        if(beRemoveObj){
            beRemoveObj.remove()
        }
    }

    // 常駐調整
    const doPermanent = () => {
        // 對應平台調整
        if ('黃金屋' == platformName) {
            // 黃金屋的話
            // 改變顏色
            document.body.style.backgroundColor = "#000000";
            document.body.style.color = "#dddddd";
        } else if ('稷下書院' == platformName) {
            // 稷下書院
            // 清除廣告
            let gadBlock = document.getElementsByClassName('gadBlock')
            //console.log(typeof gadBlock)
            for (const [key, item] of Object.entries(gadBlock)) {
                item.remove()
            }
        } else if ('colamanga' == platformName) {

        } else if ('小說狂人' == platformName) {
            // 上方 menu
            let menu = document.querySelector('ul.nav.menu')
            let menuParent = menu.parentNode
            menuParent.remove()
            // 特殊功能
            let chapterDetail = document.querySelector('div.chapter-detail')
            let customsFunction = chapterDetail.querySelector('div.customs-function')
            customsFunction.remove()
            // 調整畫面佔寬
            // let chapterDetail = document.querySelectorAll('.chapter-detail')
            // chapterDetail[0].style.width = '100%'
            // 隱藏廣告
            let ads = document.querySelectorAll('.ads')
            let adsParentElement = ads[0].parentElement
            adsParentElement.remove()
            // 下方 footer
            let footer = document.querySelector('div.footer')
            footer.remove()
        } else if ('破萬卷' == platformName) {
            //
        } else if ('台灣小說' == platformName) {
            // 
            removePstCommon(document, 'div.top_Scroll')
            removePstCommon(document, 'div.yuedutuijian')
            removePstCommon(document, 'div#goTopBtn')
            removePstCommon(document, 'div.pagefootermenu')
            removePstCommon(document, 'div#baocuo')

        } else if ('方吉君速報' == platformName) {
            // console.info(platformName)
            // 精選
            let postContent = document.querySelector('.post-content')
            if (postContent) {
                // 精選 - 文字區塊 寬度變成 100%
                let postTextContainer = postContent.querySelector('.post-text-container')
                postTextContainer.style.width = '100%'
                // 精選 - 圖片
                let thumbLink = postContent.querySelector('.thumb-link')
                thumbLink.style.width = '200px'
                // 精選 - 文字區塊 - 留言 移除 // featured-post-snippet snippet-container r-snippet-container
                removePstCommon(postContent, '.snippet-container')
                // 精選 - 文字區塊 - footer 移除
                removePstCommon(postContent, '.post-footer')
            }

            // 最新
            let postOuterContainerAry = document.querySelectorAll('.post-outer-container')
            for (let i = 0; i < postOuterContainerAry.length; i++) {
                let postOuterContainer = postOuterContainerAry[i]
                if (postOuterContainer) {
                    // 寬度變成 100%
                    postOuterContainer.style.width = '100%'
                    // 讓圖片和發布日期變成並行, 移除發布日期 position
                    let snippetThumbnail = postOuterContainer.querySelector('.snippet-thumbnail')
                    snippetThumbnail.style.display = 'flex'
                    let postHeader = postOuterContainer.querySelector('.post-header')
                    postHeader.style.position = 'unset'
                    // 
                    let snippetThumbnailImg = snippetThumbnail.querySelector('img')
                    snippetThumbnailImg.style.width = '200px'
                    // 讓圖片和標題變成並行
                    let post = postOuterContainer.querySelector('.post')
                    post.style.display = 'flex'
                    // 留言 post-footer 移除
                    removePstCommon(postOuterContainer, '.post-footer')
                }
            }
        } else if ('AO翻迷因儲存區' == platformName) {
            // 隱藏 追蹤就可以擺脫演算法限制囉 區塊
            let Followers = document.querySelector('.Followers')
            Followers.remove()
            //
            let FeaturedPost1 = document.querySelector('#FeaturedPost1')
            if (FeaturedPost1) {
                FeaturedPost1.style.paddingTop = '5px'
                FeaturedPost1.style.paddingBottom = '5px'
                //
                let post = FeaturedPost1.querySelector('.post')
                post.style.display = 'flex'
                post.style.justifyContent = 'space-between'
                //
                let snippetThumbnail = FeaturedPost1.querySelector('.snippet-thumbnail')
                snippetThumbnail.style.width = '128px'
                snippetThumbnail.style.marginBottom = 0
                let snippetThumbnailImg = snippetThumbnail.querySelector('img')
                snippetThumbnailImg.style.marginTop = 0
                //
                removePstCommon(FeaturedPost1, '.post-snippet')
                //
                removePstCommon(FeaturedPost1, '.post-share-buttons')
                //
                removePstCommon(FeaturedPost1, '.post-bottom')
            }
            // 
            let postOuterContainerAry = document.querySelectorAll('.post-outer-container')
            for (let i = 0; i < postOuterContainerAry.length; i++) {
                let postOuterContainer = postOuterContainerAry[i]
                if (postOuterContainer) {
                    postOuterContainer.style.paddingTop = '5px'
                    postOuterContainer.style.paddingBottom = '5px'
                    //
                    removePstCommon(postOuterContainer, 'a')
                    //
                    let post = postOuterContainer.querySelector('.post')
                    post.style.display = 'flex'
                    post.style.justifyContent = 'space-between'
                    //
                    let container = postOuterContainer.querySelector('.container')
                    container.style.marginTop = 0
                    container.style.marginBottom = 0
                    //
                    removePstCommon(postOuterContainer, '.post-snippet')
                    //
                    removePstCommon(postOuterContainer, '.post-share-buttons')
                    //
                    removePstCommon(postOuterContainer, '.post-bottom')
                }
            }
        } else if ('日本推特集散地' == platformName) {
            console.log(platformName)
            // 把最新的圖片縮小到跟其他的一樣
            let FeaturedPost1 = document.querySelector('#FeaturedPost1')
            if (FeaturedPost1) {
                FeaturedPost1.style.paddingTop = '5px'
                FeaturedPost1.style.paddingBottom = '5px'
                //
                let snippetThumbnail = FeaturedPost1.querySelector('.snippet-thumbnail')
                snippetThumbnail.style.width = '128px'
                snippetThumbnail.style.marginBottom = 0
                let snippetThumbnailImg = snippetThumbnail.querySelector('img')
                snippetThumbnailImg.style.marginTop = 0
                //
                removePstCommon(FeaturedPost1, '.post-share-buttons')
                //
                removePstCommon(FeaturedPost1, '.post-bottom')
            }

            //
            let postOuterContainerAry = document.querySelectorAll('.post-outer-container')
            for (let i = 0; i < postOuterContainerAry.length; i++) {
                let postOuterContainer = postOuterContainerAry[i]
                if (postOuterContainer) {
                    postOuterContainer.style.paddingTop = '5px'
                    postOuterContainer.style.paddingBottom = '5px'
                    //
                    let container = postOuterContainer.querySelector('.container')
                    container.style.marginTop = 0
                    container.style.marginBottom = 0
                    //
                    removePstCommon(postOuterContainer, '.post-share-buttons')
                    //
                    removePstCommon(postOuterContainer, '.post-bottom')
                }
            }

        }
    }
    // 常駐調整
    doPermanent()

    // 去到下一頁
    const goNext = (aObj, checkStr) => {
        let hrefStr = aObj.href
        if (undefined == checkStr) {
            aObj.click()
        } else if (-1 == hrefStr.indexOf(checkStr)) {
            // 對按鍵觸發
            aObj.click()
            // 將網址轉過去
            //location.href = hrefStr;
        } else {
            alert('沒有下一章了！');
        }
    }
    // 依據不同平台往下一頁的不同判斷
    const goNextByPlatform = () => {
        console.log(platformName)
        // 對應平台操作
        if ('黃金屋' == platformName) {
            // 黃金屋的話 觸發原生操作 N
            var e = new KeyboardEvent('keydown', { 'keyCode': 78, 'which': 78 }); // input "N"
            document.dispatchEvent(e);
        } else if ('稷下書院' == platformName) {
            // 稷下書院, 找按鍵
            let footNav = document.getElementsByClassName('foot-nav')
            let a = footNav[0].getElementsByTagName('a')
            let aLastSelect = a[a.length - 1];
            goNext(aLastSelect, "end")
        } else if ('colamanga' == platformName) {
            // colamanga
            let headpager = document.getElementsByClassName('mh_headpager')
            let a = headpager[0].getElementsByTagName('a')
            let aLastSelect = a[a.length - 1];
            goNext(aLastSelect, "alert")
        } else if ('小說狂人' == platformName) {
            let chapterNav = document.getElementsByClassName('chapter-nav')
            let a = chapterNav[0].getElementsByClassName('next-chapter')
            let aLastSelect = a[a.length - 1];
            goNext(aLastSelect)
        } else if ('破萬卷' == platformName) {
            // 找網址 用'/'分切 取最後再用'.'分切 第一
            let mPage = document.getElementsByClassName('mPage')
            let links = mPage[0].querySelectorAll('a')
            let aLastSelect = Array.from(links).find(a => a.textContent.trim() === '下一节')
            goNext(aLastSelect)
        } else if ('台灣小說' == platformName) {
            let page1 = document.querySelector('.page1')
            let links = page1.querySelectorAll('a')
            let aLastSelect = Array.from(links).find(a => a.textContent.trim() === '下一章')
            goNext(aLastSelect)
        }
    }
    // 滑鼠雙擊事件
    document.addEventListener('dblclick', event => {
        console.log('dblclick')
        goNextByPlatform()
    })
    // 特定按鍵
    document.addEventListener("keydown", event => {
        if (event.code === "ArrowRight" || event.key === "ArrowRight") {
            goNextByPlatform()
        } else if (event.code === "ArrowLeft" || event.key === "ArrowLeft") {

        }
    })

})();