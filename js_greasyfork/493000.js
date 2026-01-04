// ==UserScript==
// @name         漫畫網站移除廣告、自動下載
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  移除廣告、自動下載
// @author       YRSEK
// @match        http://v.comicbus.com/*
// @match        https://v.comicbus.com/*
// @match        https://www.55manshu.com/*
// @match        https://v.nowcomic.com/*
// @match        https://www.55comics.com/*
// @match        https://v.nowcomic.com/*
// @match        http://18h.mm-cg.com/*
// @match        https://18h.animezilla.com/*
// @require      http://code.jquery.com/jquery-3.2.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493000/%E6%BC%AB%E7%95%AB%E7%B6%B2%E7%AB%99%E7%A7%BB%E9%99%A4%E5%BB%A3%E5%91%8A%E3%80%81%E8%87%AA%E5%8B%95%E4%B8%8B%E8%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/493000/%E6%BC%AB%E7%95%AB%E7%B6%B2%E7%AB%99%E7%A7%BB%E9%99%A4%E5%BB%A3%E5%91%8A%E3%80%81%E8%87%AA%E5%8B%95%E4%B8%8B%E8%BC%89.meta.js
// ==/UserScript==
 
class _8comic{
    constructor(){
        this.page = 1;
        this.pageSize = 1;
        this.url = document.baseURI;
    }
 
    // 移除廣告
    removeADs() {
    }
 
    // 自訂功能列
    myfunction() {
        // 加入上下集的按鈕
        $(`#TheImg`).parent().append(`<div style="width: 40px;height: 40px;position: fixed;bottom: 50px;right: 50px;">
<input type="button" onclick="pv();return false;" id="prevvol" value="上 一 集">
<input type="button" onclick="nv();return false;" id="nextvol" value="下 一 集">
</div>`);
    }
 
    // 解析漫畫網址並下載
    analytics_Vols() {
        this.page = 1;
        this.pageSize = $(`select[name=select] option`).length;
 
        // 解析參數
        var current = 1;
        if (this.url.split('=')[1].indexOf('-') > -1)
        {
            var spUrl = this.url.split('=')[1];
            this.page = spUrl.split('-')[1];
        }
    }
 
    // 產生放圖片的版面
    genLayout(){
        $(`#TheImg`).parent().append(`<div id="myContent"></div>`);
        $(`#TheImg`).remove();
        for (let i = this.page; i <= this.pageSize; i++) {
            $(`#myContent`).append(`<div id='p${i}'></div><hr />第${i}頁<hr />`);
        }
    }
 
    // 下載漫畫
    DownloadImg(page) {
        this.pasteComic(this.analytics_JS(page), page);
    }
 
    // 解析混淆JS
    analytics_JS(page) {
        p = page;
        var data = $('body').html();
        var start = data.indexOf(`ge('TheImg').src='`);
        var end = data.indexOf(`.jpg';`);
        var sc = data.substring(start, end);
        var target = `${sc.replace(`ge('TheImg').src=`,'')}.jpg'`;
 
        return eval(target);
    }
 
    // 貼上漫畫網址
    pasteComic(imgUrl, page){
        var pageImg = `<img src='${imgUrl}' />`;
        $(`#myContent #p${page}`).append(pageImg);
    }
}
 
class _18mmcg{
    constructor(){
        this.page = 1;
        this.pageSize = 1;
        this.url = document.baseURI;
    }
 
    // 移除廣告
    removeADs() {
        $('iframe').remove();
        $('#ArticlesEx_box').remove();
        $('.ut_ad_box').remove();
    }
 
    // 產生放圖片的版面
    genLayout(){
        $('#show_cg_html').empty();
        for (let i = this.page; i <= this.pageSize; i++) {
            $('#show_cg_html').append(`<div id='p${i}'></div><hr />第${i}頁<hr />`);
        }
    }
 
    // 解析漫畫網址並下載
    analytics_Vols() {
        this.pageSize = Large_cgurl.length - 1;
    }
 
    // 下載漫畫
    DownloadImg(page) {
        this.pasteComic(Large_cgurl[page], page);
    }
 
 
    // 貼上漫畫網址
    pasteComic(imgUrl, page){
        var pageImg = `<img src='${imgUrl}' />`;
        $(`#show_cg_html #p${page}`).append(pageImg);
    }
}
 
class _animezilla{
    constructor(){
        this.page = 1;
        this.pageSize = 1;
        this.url = document.baseURI;
    }
 
    // 移除廣告
    removeADs() {
        $(`#manga-top`).remove();
        $(`.entry-meta`).remove();
        $(`#bentries`).remove();
        $(`.post-ratings`).remove();
        $(`#manga-bottom`).remove();
    }
 
    // 解析漫畫網址並下載
    analytics_Vols() {
        this.page = 1;
        this.pageSize = $(`a.last`)[0].href.split('/')[$(`a.last`)[0].href.split('/').length - 1];
    }
 
    // 產生放圖片的版面
    genLayout(){
        $('#page-current').empty();
        for (let i = this.page; i <= this.pageSize; i++) {
            $('#page-current').append(`<div id='p${i}'></div><hr />第${i}頁<hr />`);
        }
    }
 
    // 下載漫畫
    DownloadImg(page) {
        var pasteComic = this.pasteComic;
        $.get(`${this.url}/${page}`, function(data){
            pasteComic($(data).find('#comic').attr('src'), page);
        });
    }
 
    // 貼上漫畫網址
    pasteComic(imgUrl, page){
        var pageImg = `<img src='${imgUrl}' />`;
        $(`#page-current #p${page}`).append(pageImg);
    }
}
 
(function() {
    'use strict';
    //console.log(`location.hostname`,location.hostname);
 
    switch(location.hostname){
        case 'v.comicbus.com':
        case 'v.nowcomic.com':
            var _8c = new _8comic();
            _8c.removeADs();
            _8c.myfunction();
            _8c.analytics_Vols();
            _8c.genLayout();
            for (let i = _8c.page; i <= _8c.pageSize; i++) {
                _8c.DownloadImg(i);
            }
            break;
        case '18h.mm-cg.com':
            var _18mm = new _18mmcg();
            _18mm.removeADs();
            _18mm.analytics_Vols();
            _18mm.genLayout();
            for (let i = _18mm.page; i <= _18mm.pageSize; i++) {
                _18mm.DownloadImg(i);
            }
            break;
        case '18h.animezilla.com':
            var _anime = new _animezilla();
            _anime.removeADs();
            _anime.analytics_Vols();
            _anime.genLayout();
            for (let i = _anime.page; i <= _anime.pageSize; i++) {
                _anime.DownloadImg(i);
            }
            break;
    }
 
 
})();