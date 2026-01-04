// ==UserScript==
// @name         盼之插件（十七天下第一）
// @namespace    http://tampermonkey.net/
// @version      2024-10-11
// @description  用于在盼之逆水寒界面查看号时，能够把用户的内功和打造提到上面去
// @license      CC-BY-NC-SA-4.0;
// @author       喵十七
// @match        https://www.pzds.com/goodsDetails/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512209/%E7%9B%BC%E4%B9%8B%E6%8F%92%E4%BB%B6%EF%BC%88%E5%8D%81%E4%B8%83%E5%A4%A9%E4%B8%8B%E7%AC%AC%E4%B8%80%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/512209/%E7%9B%BC%E4%B9%8B%E6%8F%92%E4%BB%B6%EF%BC%88%E5%8D%81%E4%B8%83%E5%A4%A9%E4%B8%8B%E7%AC%AC%E4%B8%80%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function Nsh() {
        this.data = null
    }

    Nsh.prototype = {
    };

    Nsh.prototype.setData = function(data){
        this.data = data
    }

    Nsh.prototype.getNgDataUrl = function(data){
        return this.data[0].detailsData.detailsImages.find(v=>v.indexOf("quanbuneigong") !== -1) || ''
    }

    Nsh.prototype.getDzDataUrl = function(data){
        return this.data[0].detailsData.detailsImages.find(v=>v.indexOf("teji_pingtu") !== -1) || ''
    }

    Nsh.prototype.setBoxEl = function(){
        let beforeEl = document.getElementById("contentTop")
        let beforeElParent = beforeEl.parentElement
        beforeEl.insertAdjacentHTML(
            'beforebegin',
            '<div class="el-image details-img" data-v-0fec51ae="" data-v-3e368de4=""><img src="' + this.getNgDataUrl()  + '" class="el-image__inner el-image__preview"><!----></div>'
        )
        beforeEl.insertAdjacentHTML(
            'beforebegin',
            '<div class="el-image details-img" data-v-0fec51ae="" data-v-3e368de4=""><img src="' + this.getDzDataUrl()  + '" class="el-image__inner el-image__preview"><!----></div>'
        )
    }
    let nshPz = new Nsh()
    window.onload=function(){
        let timer = setInterval(()=>{
            if(window.__NUXT__ && window.__NUXT__.data && window.__NUXT__.data.length > 0){
                if(window.__NUXT__.data[0].detailsData !== undefined){
                    nshPz.setData(window.__NUXT__.data)
                    try{
                        nshPz.setBoxEl()
                    }catch(err){
                        console.log(err)
                    }
                    console.log(nshPz.getNgDataUrl())
                    console.log(nshPz.getDzDataUrl())
                    clearInterval(timer)
                }
            }
            console.log('测试是否启动成功')
        },500)
        }
})();