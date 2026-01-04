// ==UserScript==
// @name         阿里巴巴SKU图片提取
// @namespace    detail.1688.com
// @version      0.2.1
// @description  阿里巴巴SKU图片批量下载
// @author       You
// @match        *://detail.1688.com/*
// @icon         data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAABILAAASCwAAAAAAAAAAAAAAc/9KAHP/5wBz//8Ac///AHP//wBz//8Ac///AHP//wBz//8Ac///AHP//wBz//8Ac///AHP//wBz/+QAc/9KAHP/5gBz//8Ac///AHP//wBz//8Ac///AHP//wBz//8Ac///AHP//wBz//8Ac///AHP//wBz//8Ac///AHP/5wBz//8Ac///AHP//wBz//8Ac///AHP//wBz//8Ac///AHP//wBz//8Ac///AHP//wBz//8Ac///AHP//wBz//8Ac///JpH//+jz/////////////8Xg//+Gv///AH///wBz//8Ac///Vab//9Xo//+v1P//Xqr//wBz//8Ac///AHP////////2+v//AHP//wBz//8Ac///AHX//yiS//8AeP//AHP//8fh////////frv//63T///V6P//frv//wBz/////////////wCA//8Ac///AHP//wBz//8Ac///AHP//wBz//8rk////////wCC//8Ac///AHP//wBz//8Ac///msn/////////////rtT//wBz//8Ac///AHP//wBz//8Ac///AHP//4e/////////AHP//wBz//8Ac///AHP//wB0/////////////9/u//+t0///rtT//5/M//8Ac///AHP//wBz//8Ac///zOT//8Tg//8Ac///AHP//wBz//8Ac///LZT/////////////f7v//wBz//8Aev//2uv//wB9//8Ac///AHP//wBz////////Xqr//wBz//8Ac///AHP//wBz//9Dnf////////////8Ac///AHP//wBz//8Ac///AHP//wBz//8Ac///LZT///////8Ac///AHP//wBz//8Ac///AHP//xuN///8/f///////7na//9Gn///AHb//wBz//8Ac///AHP//wBz///3+///G43//wBz//8Ac///AHP//wBz//8Ac///AHP//4jA///////////////////3+///bLP//wBz//+JwP///////wB4//8Ac///AHP//wBz//8Ac///AHP//wBz//8Ac///AHP//0+j//+22P//9fr/////////////3e3//y+U//8Ac///AHP//wBz//8Ac///AHP//wBz//8Ac///AHP//wBz//8Ac///AHP//wBz//8Ac///AHP//wBz//8Ac///AHP//wBz/+YAc///AHP//wBz//8Ac///AHP//wBz//8Ac///AHP//wBz//8Ac///AHP//wBz//8Ac///AHP//wBz/+YAc/9JAHP/5gBz//8Ac///AHP//wBz//8Ac///AHP//wBz//8Ac///AHP//wBz//8Ac///AHP//wBz/+YAc/9JAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==
// @grant    GM_registerMenuCommand
// @grant    GM_setClipboard
// @grant    GM_download
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453020/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4SKU%E5%9B%BE%E7%89%87%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/453020/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4SKU%E5%9B%BE%E7%89%87%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var skuNamePicurl = ``;

    // 截取图片链接
    function getPicURL(url){
        url = url.split("\")")[0].split("(\"")[1];
        return url;
    }


    // 获取图片类型后缀
    function getPicType(url){
        let picType = ["jpg","jpeg","png","webp"];
        for (let i=0;i<picType.length;i++){
            let addon = picType[i];
            if (url.endsWith(addon)){
                return `.${addon}`;
            }
        }
    }

    // 图片在颜色选项背景的情况
    function atColorBackground(area,dl){
        dl=isNaN(dl)?false:dl;
        console.log("atColorBackground");
        let skuList = area.getElementsByClassName("prop-item-inner-wrapper");
        for (let i=0;i<skuList.length;i++){
            let sku = skuList[i];
            let name = sku.getElementsByClassName("prop-name")[0].innerText;
            let pic = sku.getElementsByClassName("prop-img")[0].style.background;
            pic = getPicURL(pic);
            skuNamePicurl += `${name}\t${pic}\n`;
            if(dl){
                name = `SKU-${name}${getPicType(pic)}`;
                GM_download(pic,name,false);
            }
            console.log(`${name}\t${pic}`);
        }
    }

    // 图片在规格选项的情况
    function atModuleBackground(area,dl){
        dl=isNaN(dl)?false:dl;
        console.log("atModuleBackground");
        let skuList = area.getElementsByClassName("sku-item-wrapper");
        for (let i=0;i<skuList.length;i++){
            let sku = skuList[i];
            let name = sku.getElementsByClassName("sku-item-name")[0].innerText;
            let pic = sku.getElementsByClassName("sku-item-image")[0].style.background;
            pic = getPicURL(pic);
            skuNamePicurl += `${name}\t${pic}\n`;
            if(dl){
                name = `SKU-${name}${getPicType(pic)}`;
                GM_download(pic,name,false);
            }
            console.log(`${name}\t${pic}`);
        }
    }

    // 主函数
    function getSkuPic(dl){
        dl=isNaN(dl)?true:dl;
        console.log("getSkuPic");
        // 获取SKU区域
        let area = document.getElementsByClassName("pc-sku-wrapper")[0];
        try{
            atColorBackground(area,dl);
        }catch(e){
            console.log("非颜色选项",e);
        }
        try{
            atModuleBackground(area,dl);
        }catch(e){
            console.log("非规格选项",e);
        }
    }

    // 获取颜色/尺寸
    function getColorSize(){
        let rel = "";
        for(let el of document.querySelectorAll("div.prop-name")){
            rel += `\n${el.innerText}`;
        }
        rel += "\n"
        for(let el of document.querySelectorAll("div.sku-item-name")){
            rel += `\n${el.innerText}`;
        }
        return rel;
    }

    GM_registerMenuCommand("提取SKU图片",function(){
        skuNamePicurl = "";
        getSkuPic();
    });

    GM_registerMenuCommand("复制SKU信息",function(){
        skuNamePicurl = document.title + "\n" +location.href.split(".html")[0]+".html\n\n";
        getSkuPic(false);
        skuNamePicurl += getColorSize();
        console.log(skuNamePicurl);
        GM_setClipboard(skuNamePicurl);
        alert("复制成功");
    });
})();