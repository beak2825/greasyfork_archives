// ==UserScript==
// @name         小次郎
// @namespace    http://www.raincat.xin/
// @version      1.0
// @description  获取下载链接
// @author       You
// @match        http://www.avscj008.com/*/*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391684/%E5%B0%8F%E6%AC%A1%E9%83%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/391684/%E5%B0%8F%E6%AC%A1%E9%83%8E.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //拿到下一页（视频页）的地址
    function getVideoUrl(){
        let a=$("#playlist a").attr("href")
        let url=`http://${window.location.host}${a}`
        return url
    }
    //通过ajax到视频页拿到播放地址
    function requestAndGetDownloadUrl(){
        let sourceUrl=getVideoUrl()
        return new Promise((su,sj)=>{
            $.get(sourceUrl,(data,status)=>{
                let startIdx=data.indexOf("xfplay://")
                let endIdx=data.indexOf("\"; ",startIdx)
                let result=data.substring(startIdx,endIdx)
                su(result)
            })
        })
    }
    //构建元素，并加入到页面中
    function createEle(){
        let eleA=$("<a style='padding-top:20px;color:#409EFF;'>复制视频URL</a>")
        eleA.click(async ()=>{
            let url=await requestAndGetDownloadUrl()
            copyText(url)
            let eleB=$("<a style='padding-top:20px;color:#E6A23C;'>已复制成功</a>")
             $("#playlist").append(eleB)
            setTimeout(()=>{
            eleB.remove()
            },1000)
        })
        return eleA
    }
    //添加元素到页面中
    function addEleInPage(){
        let ele=createEle()
        $("#playlist").append(ele)
    }
    // 复制的方法
    function copyText(text, callback){ // text: 要复制的内容， callback: 回调
        var tag = document.createElement('input');
        tag.setAttribute('id', 'cp_hgz_input');
        tag.value = text;
        document.getElementsByTagName('body')[0].appendChild(tag);
        document.getElementById('cp_hgz_input').select();
        document.execCommand('copy');
        document.getElementById('cp_hgz_input').remove();
        if(callback) {callback(text)}
    }
    addEleInPage()

})();