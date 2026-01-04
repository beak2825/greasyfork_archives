// ==UserScript==
// @name         STDB Region Lock Checker
// @namespace    local.CR
// @version      0.2.3
// @description  Get Region Lock Information Quickly
// @author       CharRun
// @match        https://steamdb.info/app/*
// @match        https://steamdb.info/bundle/*
// @grant        GM_xmlhttpRequest
// @icon         https://steamdb.info/static/logos/header.svg
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/373371/STDB%20Region%20Lock%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/373371/STDB%20Region%20Lock%20Checker.meta.js
// ==/UserScript==

/*jshint esversion: 6 */

(function() {

const cr_packages = document.getElementsByClassName('package'),
      cr_count = cr_packages.length;

function init(){      
    window.cr_advanced = (localStorage.getItem("cr_advanced") || "true") === 'true'?true:false;
    window.cr_advancedChecked = cr_advanced?"checked":"unchecked";
    window.cr_autoLoading = (localStorage.getItem("cr_autoLoading") || "false") === 'true'?true:false;
    window.cr_autoLoadingChecked = cr_autoLoading?"checked":"unchecked";
    window.cr_timeDelay = localStorage.getItem("cr_timeDelay") || "3000";
    window.cr_customFullNRWDColor = localStorage.getItem("cr_customFullNRWDColor") || "rgba(130,130,130,.8)";
    window.cr_customFullNRBGColor = localStorage.getItem("cr_customFullNRBGColor") || "rgba(140,193,82,1)";
    window.cr_customFullPOWDColor = localStorage.getItem("cr_customFullPOWDColor") || "rgba(16,71,169,.8)";
    window.cr_customFullPOBGColor = localStorage.getItem("cr_customFullPOBGColor") || "rgba(255,165,0,.8)";
    window.cr_customFullROWDColor = localStorage.getItem("cr_customFullROWDColor") || "rgba(255,255,240,.8)";
    window.cr_customFullROBGColor = localStorage.getItem("cr_customFullROBGColor") || "rgba(229,57,53,.8)";
    window.cr_customMiniNRContant = localStorage.getItem("cr_customMiniNRContant") || "(✿◕‿◕✿)";
    window.cr_customMiniNRWDColor = localStorage.getItem("cr_customMiniNRWDColor") || "rgba(140,193,82,1)";
    window.cr_customMiniNRBGColor = localStorage.getItem("cr_customMiniNRBGColor") || "white";
    window.cr_customMiniNRWWColor = localStorage.getItem("cr_customMiniNRWWColor") || "white";
    window.cr_customMiniNRBBColor = localStorage.getItem("cr_customMiniNRBBColor") || "rgba(140,193,82,1)";
    window.cr_customMiniPOContant = localStorage.getItem("cr_customMiniPOContant") || "(●ˇ∀ˇ●)";
    window.cr_customMiniPOWDColor = localStorage.getItem("cr_customMiniPOWDColor") || "rgba(255,165,0,.8)";
    window.cr_customMiniPOBGColor = localStorage.getItem("cr_customMiniPOBGColor") || "white";
    window.cr_customMiniPOWWColor = localStorage.getItem("cr_customMiniPOWWColor") || "white";
    window.cr_customMiniPOBBColor = localStorage.getItem("cr_customMiniPOBBColor") || "orange";
    window.cr_customMiniROContant = localStorage.getItem("cr_customMiniROContant") || "w(ﾟДﾟ)w";
    window.cr_customMiniROWDColor = localStorage.getItem("cr_customMiniROWDColor") || "rgba(229,57,53,.8)";
    window.cr_customMiniROBGColor = localStorage.getItem("cr_customMiniROBGColor") || "white";
    window.cr_customMiniROWWColor = localStorage.getItem("cr_customMiniROWWColor") || "white";
    window.cr_customMiniROBBColor = localStorage.getItem("cr_customMiniROBBColor") || "rgba(229,57,53,.8)";
}

function addCSS(){
  let head = document.getElementsByTagName('head')[0];
  let styleSheet = document.getElementById('cr_css') || document.createElement('style');
  styleSheet.id = "cr_css";
  styleSheet.innerHTML='.cr_costomBtn:hover::after{visibility:visible;}.cr_cos.cr_costomBtn:hover::after{visibility:visible;}.cr_costomBtn::after{background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABo0lEQVQ4T3XTy4vPYRzF8dewkGjCUqHYTVbKJNcsLNyvo4klWbCSEFsLSmLNSu5ijBCjlOTSbKykhJS/QMO43zr1+da3XzPP8vs8z/s5n3POt8v46zB60YVnODXW0Ww2qxtbcQufcAPbavMq+jEdm3EdX7LXAHL5Ul3ajifYiMUFeF7glbhWD+0IpAHsxi+cRw/m4AH+FSDn1uAd3mAXfuJCA5iGiziE13VpKpZhQin6XN/n4wSiYKTtwUG8wn2sQEwcLBVbcLxAGzAPpxsPjmIBZmIJppRJMetHvTqpYDH1G57iI15Gwc0ypUljNWbhbEdse/EeQ63vgwEktr6S+gdrS825DsA+vMVDTKwEBwI4gIWYXSPEvOS8qTXCZAyU0u94gQ8Y7jQxCdzDchzBnXppHY4hfYg3iflMu0gzKsb9lXP2YubSGi2mfa2R0pOT2JnGNgr2lNwUKTnPxV38rUvpQpqZEkVlivQ7xWsAmfsybtfsj6r7iwowjCtYVV6kCynSaNuDQDJfICPj/Exp7PqCjLY9GOtPTa1TrKzHTfM6D/4HcRpiWhLwq/4AAAAASUVORK5CYII=);border-color:white;border-style:solid;content:"";cursor:pointer;float:right;height:22px;visibility:hidden;width:22px;}.cr_title{width:260px;}.cr_advancedTitle{width:140px;}td.cr_advancedContainer{padding:0;position:relative;}.package .cr_publicContainer.cr_publicContainerCF{text-align:center;}.package .cr_publicContainer.cr_publicContainerOL{text-align:center;background-color:rgba(32,45,21,0.3);}.package .cr_publicContainer.cr_publicContainerSC{text-align:center;}.package .cr_publicContainer.cr_publicContainerNR{color:'+ cr_customFullNRWDColor +';font-weight:bold;text-align:center;background-color:'+ cr_customFullNRBGColor +';}.package .cr_publicContainer.cr_publicContainerPO{color:'+ cr_customFullPOWDColor +';font-weight:bold;text-align:left;background-color:'+ cr_customFullPOBGColor +';}.package .cr_publicContainer.cr_publicContainerRO{color:'+ cr_customFullROWDColor +';font-weight:bold;text-align:left;background-color:'+ cr_customFullROBGColor +';}.package .cr_publicContainer.cr_publicContainerADNR{color:'+ cr_customMiniNRWDColor +';text-align:center;}.package .cr_publicContainer.cr_publicContainerADPO{color:'+ cr_customMiniPOWDColor +';text-align:center;}.package .cr_publicContainer.cr_publicContainerADRO{color:'+ cr_customMiniROWDColor +';text-align:center;}.cr_advancedContainer > .cr_publicContainer{position:absolute;width:100%;height:100%;padding:8px 0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.cr_invisibleContainer{display:none;position:absolute;width:260px;box-shadow:10px 10px 20px 0 rgba(0,0,0,0.2);padding:0 10px;border-radius:25px;background-color:rgba(204,204,204,0.6);z-index:5;top:0;left:140px;}.cr_settingIC{display:none;position:fixed;width:260px;box-shadow:10px 10px 20px 0 rgba(0,0,0,0.2);padding:0 10px;border-radius:25px;background-color:rgba(204,204,204,0.6);z-index:5;}.cr_hiddenContent0{color:'+ cr_customMiniNRWWColor +';background-color:'+ cr_customMiniNRBBColor +';font-size:16px;text-align:center;line-height:150%;margin:10px;border-radius:15px;}.cr_hiddenContent1{color:'+ cr_customMiniPOWWColor +';background-color:'+ cr_customMiniPOBBColor +';font-size:16px;text-align:left;line-height:150%;padding:0 5px;border-radius:15px;}.cr_hiddenContent2{color:'+ cr_customMiniROWWColor +';background-color:'+ cr_customMiniROBBColor +';font-size:16px;text-align:left;line-height:150%;padding:0 5px;border-radius:15px;}.cr_configurationContainer{width:100%;height:100%;z-index:99;overflow:hidden;transition:all 1s;width:0;height:0;background-color:rgba(0,0,0,0.2);position:fixed;top:0;left:0;}.cr_configurationPage{width:auto;min-width:700px;max-width:100%;height:auto;max-height:calc(100vh - 50px);overflow:auto;background-color:rgba(245,245,245);position:absolute;top:50px;left:50%;margin-left:-350px;z-index:3;border-radius:10px;}.cr_configurationPageTitle{text-align:center;}.cr_author{text-align:right;}.cr_settingContainer{position:relative;width:540px;left:50%;margin-left:-270px;transition:all 1.5s;}.cr_switch{width:52px;height:31px;position:relative;border:1px solid #dfdfdf;background-color:#fdfdfd;box-shadow:#dfdfdf 0 0 0 0 inset;border-radius:20px;border-top-left-radius:20px;border-top-right-radius:20px;border-bottom-left-radius:20px;border-bottom-right-radius:20px;background-clip:content-box;display:inline-block;-webkit-appearance:none;-moz-appearance:none;user-select:none;outline:none;transition:background-color ease 0.4s;}.cr_switch:before{content:"";width:29px;height:29px;position:absolute;top:0px;left:0;border-radius:20px;border-top-left-radius:20px;border-top-right-radius:20px;border-bottom-left-radius:20px;border-bottom-right-radius:20px;background-color:#fff;box-shadow:0 1px 3px rgba(0,0,0,0.4);transition:left 0.3s;}.cr_switch:checked{border-color:#64bd63;box-shadow:#64bd63 0 0 0 16px inset;background-color:#64bd63;box-shadow:#dfdfdf 0 0 0 0 inset;transition:border-color 0.4s,background-color ease 0.4s;}.cr_switch:checked:before{transition:left 0.3s;left:21px;}.cr_settingContainer table{width:540px;}.cr_baseSetting td{padding:2px;}.cr_talbeWarp{width:540px;height:auto;overflow:hidden;}.cr_talbeSlider{width:200%}#cr_fmc{float:left;transition:margin 2s ease,opacity 1.5s ease;}#cr_amc{float:left;transition:margin 2s ease,opacity 1.5s ease;}.cr_settingContainer th{top:0!important;text-align:center;width:270px;padding:2px;}.cr_fullModeSetting td[colspan]{text-align:center;}.cr_fullModeSetting td{padding:2px;text-align:right;}.cr_advancedSetting td[colspan]{text-align:center;}.cr_advancedSetting td{padding:2px;text-align:right;}.cr_buttonctn{width:700px;margin-bottom:20px;text-align:center;overflow:hidden;position:relative;}.cr_saveBtn{-moz-box-shadow:inset 0px 1px 0px 0px #bbdaf7;-webkit-box-shadow:inset 0px 1px 0px 0px #bbdaf7;box-shadow:inset 0px 1px 0px 0px #bbdaf7;background:-webkit-gradient(linear,left top,left bottom,color-stop(0.05,#79bbff),color-stop(1,#378de5));background:-moz-linear-gradient(top,#79bbff 5%,#378de5 100%);background:-webkit-linear-gradient(top,#79bbff 5%,#378de5 100%);background:-o-linear-gradient(top,#79bbff 5%,#378de5 100%);background:-ms-linear-gradient(top,#79bbff 5%,#378de5 100%);background:linear-gradient(to bottom,#79bbff 5%,#378de5 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="#79bbff",endColorstr="#378de5",GradientType=0);background-color:#79bbff;-moz-border-radius:6px;-webkit-border-radius:6px;border-radius:6px;border:1px solid #84bbf3;display:inline-block;cursor:pointer;color:#ffffff;font-family:Arial;font-size:20px;font-weight:bold;padding:15px 150px;margin:0 20px;text-decoration:none;text-shadow:0px 1px 0px #528ecc;}.cr_saveBtn:hover{background:-webkit-gradient(linear,left top,left bottom,color-stop(0.05,#378de5),color-stop(1,#79bbff));background:-moz-linear-gradient(top,#378de5 5%,#79bbff 100%);background:-webkit-linear-gradient(top,#378de5 5%,#79bbff 100%);background:-o-linear-gradient(top,#378de5 5%,#79bbff 100%);background:-ms-linear-gradient(top,#378de5 5%,#79bbff 100%);background:linear-gradient(to bottom,#378de5 5%,#79bbff 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="#378de5",endColorstr="#79bbff",GradientType=0);background-color:#378de5;}.cr_reset:active,.cr_saveBtn:active{position:relative;top:2px;}.cr_reset{-moz-box-shadow:inset 0px 1px 0px 0px #f5978e;-webkit-box-shadow:inset 0px 1px 0px 0px #f5978e;box-shadow:inset 0px 1px 0px 0px #f5978e;background:-webkit-gradient(linear,left top,left bottom,color-stop(0.05,#f24537),color-stop(1,#c62d1f));background:-moz-linear-gradient(top,#f24537 5%,#c62d1f 100%);background:-webkit-linear-gradient(top,#f24537 5%,#c62d1f 100%);background:-o-linear-gradient(top,#f24537 5%,#c62d1f 100%);background:-ms-linear-gradient(top,#f24537 5%,#c62d1f 100%);background:linear-gradient(to bottom,#f24537 5%,#c62d1f 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="#f24537",endColorstr="#c62d1f",GradientType=0);background-color:#f24537;-moz-border-radius:6px;-webkit-border-radius:6px;border-radius:6px;border:1px solid #d02718;display:inline-block;cursor:pointer;color:#ffffff;font-family:Arial;font-size:20px;font-weight:bold;padding:15px 15px;margin:0 20px;text-decoration:none;text-shadow:0px 1px 0px #810e05;}.cr_reset:hover{background:-webkit-gradient(linear,left top,left bottom,color-stop(0.05,#c62d1f),color-stop(1,#f24537));background:-moz-linear-gradient(top,#c62d1f 5%,#f24537 100%);background:-webkit-linear-gradient(top,#c62d1f 5%,#f24537 100%);background:-o-linear-gradient(top,#c62d1f 5%,#f24537 100%);background:-ms-linear-gradient(top,#c62d1f 5%,#f24537 100%);background:linear-gradient(to bottom,#c62d1f 5%,#f24537 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="#c62d1f",endColorstr="#f24537",GradientType=0);background-color:#c62d1f;}tomBtn::after{background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABo0lEQVQ4T3XTy4vPYRzF8dewkGjCUqHYTVbKJNcsLNyvo4klWbCSEFsLSmLNSu5ijBCjlOTSbKykhJS/QMO43zr1+da3XzPP8vs8z/s5n3POt8v46zB60YVnODXW0Ww2qxtbcQufcAPbavMq+jEdm3EdX7LXAHL5Ul3ajifYiMUFeF7glbhWD+0IpAHsxi+cRw/m4AH+FSDn1uAd3mAXfuJCA5iGiziE13VpKpZhQin6XN/n4wSiYKTtwUG8wn2sQEwcLBVbcLxAGzAPpxsPjmIBZmIJppRJMetHvTqpYDH1G57iI15Gwc0ypUljNWbhbEdse/EeQ63vgwEktr6S+gdrS825DsA+vMVDTKwEBwI4gIWYXSPEvOS8qTXCZAyU0u94gQ8Y7jQxCdzDchzBnXppHY4hfYg3iflMu0gzKsb9lXP2YubSGi2mfa2R0pOT2JnGNgr2lNwUKTnPxV38rUvpQpqZEkVlivQ7xWsAmfsybtfsj6r7iwowjCtYVV6kCynSaNuDQDJfICPj/Exp7PqCjLY9GOtPTa1TrKzHTfM6D/4HcRpiWhLwq/4AAAAASUVORK5CYII=);border-color:white;border-style:solid;content:"";cursor:pointer;float:right;height:22px;visibility:hidden;width:22px;}.cr_title{width:260px;}.cr_advancedTitle{width:140px;}td.cr_advancedContainer{padding:0;position:relative;}.package .cr_publicContainer.cr_publicContainerCF{text-align:center;}.package .cr_publicContainer.cr_publicContainerOL{text-align:center;background-color:rgba(32,45,21,0.3);}.package .cr_publicContainer.cr_publicContainerSC{text-align:center;}.package .cr_publicContainer.cr_publicContainerNR{color:'+ cr_customFullNRWDColor +';font-weight:bold;text-align:center;background-color:'+ cr_customFullNRBGColor +';}.package .cr_publicContainer.cr_publicContainerPO{color:'+ cr_customFullPOWDColor +';font-weight:bold;text-align:left;background-color:'+ cr_customFullPOBGColor +';}.package .cr_publicContainer.cr_publicContainerRO{color:'+ cr_customFullROWDColor +';font-weight:bold;text-align:left;background-color:'+ cr_customFullROBGColor +';}.package .cr_publicContainer.cr_publicContainerADNR{color:'+ cr_customMiniNRWDColor +';text-align:center;}.package .cr_publicContainer.cr_publicContainerADPO{color:'+ cr_customMiniPOWDColor +';text-align:center;}.package .cr_publicContainer.cr_publicContainerADRO{color:'+ cr_customMiniROWDColor +';text-align:center;}.cr_advancedContainer > .cr_publicContainer{position:absolute;width:100%;height:100%;padding:8px 0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.cr_invisibleContainer{display:none;position:absolute;width:260px;box-shadow:10px 10px 20px 0 rgba(0,0,0,0.2);padding:0 10px;border-radius:25px;background-color:rgba(204,204,204,0.6);z-index:5;top:0;left:140px;}.cr_settingIC{display:none;position:fixed;width:260px;box-shadow:10px 10px 20px 0 rgba(0,0,0,0.2);padding:0 10px;border-radius:25px;background-color:rgba(204,204,204,0.6);z-index:5;}.cr_hiddenContent0{color:'+ cr_customMiniNRWWColor +';background-color:'+ cr_customMiniNRBBColor +';font-size:16px;text-align:center;line-height:150%;margin:10px;border-radius:15px;}.cr_hiddenContent1{color:'+ cr_customMiniPOWWColor +';background-color:'+ cr_customMiniPOBBColor +';font-size:16px;text-align:left;line-height:150%;padding:0 5px;border-radius:15px;}.cr_hiddenContent2{color:'+ cr_customMiniROWWColor +';background-color:'+ cr_customMiniROBBColor +';font-size:16px;text-align:left;line-height:150%;padding:0 5px;border-radius:15px;}.cr_configurationContainer{width:100%;height:100%;z-index:99;overflow:hidden;transition:all 1s;width:0;height:0;background-color:rgba(0,0,0,0.2);position:fixed;top:0;left:0;}.cr_configurationPage{width:auto;min-width:700px;max-width:100%;height:auto;max-height:calc(100vh - 50px);overflow:auto;background-color:rgba(245,245,245);position:absolute;top:50px;left:50%;margin-left:-350px;z-index:3;border-radius:10px;}.cr_configurationPageTitle{text-align:center;}.cr_author{text-align:right;}.cr_settingContainer{position:relative;width:540px;left:50%;margin-left:-270px;transition:all 1.5s;}.cr_switch{width:52px;height:31px;position:relative;border:1px solid #dfdfdf;background-color:#fdfdfd;box-shadow:#dfdfdf 0 0 0 0 inset;border-radius:20px;border-top-left-radius:20px;border-top-right-radius:20px;border-bottom-left-radius:20px;border-bottom-right-radius:20px;background-clip:content-box;display:inline-block;-webkit-appearance:none;-moz-appearance:none;user-select:none;outline:none;transition:background-color ease 0.4s;}.cr_switch:before{content:"";width:29px;height:29px;position:absolute;top:0px;left:0;border-radius:20px;border-top-left-radius:20px;border-top-right-radius:20px;border-bottom-left-radius:20px;border-bottom-right-radius:20px;background-color:#fff;box-shadow:0 1px 3px rgba(0,0,0,0.4);transition:left 0.3s;}.cr_switch:checked{border-color:#64bd63;box-shadow:#64bd63 0 0 0 16px inset;background-color:#64bd63;box-shadow:#dfdfdf 0 0 0 0 inset;transition:border-color 0.4s,background-color ease 0.4s;}.cr_switch:checked:before{transition:left 0.3s;left:21px;}.cr_settingContainer table{width:540px;}.cr_baseSetting td{padding:2px;}.cr_talbeWarp{width:540px;height:auto;overflow:hidden;}.cr_talbeSlider{width:200%}#cr_fmc{float:left;transition:margin 2s ease,opacity 1.5s ease;}#cr_amc{float:left;transition:margin 2s ease,opacity 1.5s ease;}.cr_settingContainer th{top:0!important;text-align:center;width:270px;padding:2px;}.cr_fullModeSetting td[colspan]{text-align:center;}.cr_fullModeSetting td{padding:2px;text-align:right;}.cr_advancedSetting td[colspan]{text-align:center;}.cr_advancedSetting td{padding:2px;text-align:right;}.cr_buttonctn{width:700px;margin-bottom:20px;text-align:center;overflow:hidden;position:relative;}.cr_saveBtn{-moz-box-shadow:inset 0px 1px 0px 0px #bbdaf7;-webkit-box-shadow:inset 0px 1px 0px 0px #bbdaf7;box-shadow:inset 0px 1px 0px 0px #bbdaf7;background:-webkit-gradient(linear,left top,left bottom,color-stop(0.05,#79bbff),color-stop(1,#378de5));background:-moz-linear-gradient(top,#79bbff 5%,#378de5 100%);background:-webkit-linear-gradient(top,#79bbff 5%,#378de5 100%);background:-o-linear-gradient(top,#79bbff 5%,#378de5 100%);background:-ms-linear-gradient(top,#79bbff 5%,#378de5 100%);background:linear-gradient(to bottom,#79bbff 5%,#378de5 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="#79bbff",endColorstr="#378de5",GradientType=0);background-color:#79bbff;-moz-border-radius:6px;-webkit-border-radius:6px;border-radius:6px;border:1px solid #84bbf3;display:inline-block;cursor:pointer;color:#ffffff;font-family:Arial;font-size:20px;font-weight:bold;padding:15px 150px;margin:0 20px;text-decoration:none;text-shadow:0px 1px 0px #528ecc;}.cr_saveBtn:hover{background:-webkit-gradient(linear,left top,left bottom,color-stop(0.05,#378de5),color-stop(1,#79bbff));background:-moz-linear-gradient(top,#378de5 5%,#79bbff 100%);background:-webkit-linear-gradient(top,#378de5 5%,#79bbff 100%);background:-o-linear-gradient(top,#378de5 5%,#79bbff 100%);background:-ms-linear-gradient(top,#378de5 5%,#79bbff 100%);background:linear-gradient(to bottom,#378de5 5%,#79bbff 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="#378de5",endColorstr="#79bbff",GradientType=0);background-color:#378de5;}.cr_reset:active,.cr_saveBtn:active{position:relative;top:2px;}.cr_reset{-moz-box-shadow:inset 0px 1px 0px 0px #f5978e;-webkit-box-shadow:inset 0px 1px 0px 0px #f5978e;box-shadow:inset 0px 1px 0px 0px #f5978e;background:-webkit-gradient(linear,left top,left bottom,color-stop(0.05,#f24537),color-stop(1,#c62d1f));background:-moz-linear-gradient(top,#f24537 5%,#c62d1f 100%);background:-webkit-linear-gradient(top,#f24537 5%,#c62d1f 100%);background:-o-linear-gradient(top,#f24537 5%,#c62d1f 100%);background:-ms-linear-gradient(top,#f24537 5%,#c62d1f 100%);background:linear-gradient(to bottom,#f24537 5%,#c62d1f 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="#f24537",endColorstr="#c62d1f",GradientType=0);background-color:#f24537;-moz-border-radius:6px;-webkit-border-radius:6px;border-radius:6px;border:1px solid #d02718;display:inline-block;cursor:pointer;color:#ffffff;font-family:Arial;font-size:20px;font-weight:bold;padding:15px 15px;margin:0 20px;text-decoration:none;text-shadow:0px 1px 0px #810e05;}.cr_reset:hover{background:-webkit-gradient(linear,left top,left bottom,color-stop(0.05,#c62d1f),color-stop(1,#f24537));background:-moz-linear-gradient(top,#c62d1f 5%,#f24537 100%);background:-webkit-linear-gradient(top,#c62d1f 5%,#f24537 100%);background:-o-linear-gradient(top,#c62d1f 5%,#f24537 100%);background:-ms-linear-gradient(top,#c62d1f 5%,#f24537 100%);background:linear-gradient(to bottom,#c62d1f 5%,#f24537 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="#c62d1f",endColorstr="#f24537",GradientType=0);background-color:#c62d1f;}';
  head.appendChild(styleSheet);
}

function createTitle(){
  let head = document.querySelectorAll("#subs thead tr");
  head.forEach((node,index)=>{
    let exist = /SUBID/ig.exec(node.innerText);
    if (exist) {return head = node;}
  })
  let title = document.createElement('th');

  if (cr_advanced) {
    title.innerHTML = "Mini RLI";
    title.className = "cr_costomBtn cr_advancedTitle";
  }else{
    title.innerHTML = "Region Lock Information";
    title.className = "cr_costomBtn cr_title";
  }
  title.onclick = e => (e.offsetX > title.offsetWidth - 35)?insert():console.log("miss pseudo click");
  head.appendChild(title);
}


function createContainer(){
  if (cr_advanced) {
    for(let num = 0; num < cr_count; num++){
      let mainMiniContainer = document.createElement('td');
      mainMiniContainer.className = "cr_advancedContainer";
      mainMiniContainer.innerHTML = '<div class="cr_publicContainer cr_visibleContainer"status_num="0">Waiting for Check.</div><div class="cr_invisibleContainer"><p class="cr_hiddenContent0"></p><p class="cr_hiddenContent1"></p><p class="cr_hiddenContent2"></p></div>';
      cr_packages[num].appendChild(mainMiniContainer);
      addOperatingMode(mainMiniContainer,num);
    }      
  }else{
    for(let num = 0; num < cr_count; num++){
        let mainFullContainer = document.createElement('td');
        mainFullContainer.setAttribute("class","cr_publicContainer");
        mainFullContainer.setAttribute("status_num","0");
        mainFullContainer.innerHTML = "Waiting for Check.";
        cr_packages[num].appendChild(mainFullContainer);
        addOperatingMode(mainFullContainer,num);
    }
  }
}


function getStatusNum(num){
  let status_num = num >= cr_count?console.log("overflow"):document.getElementsByClassName("cr_publicContainer")[num].getAttribute("status_num");
  return status_num;
}


function addOperatingMode (element,num){
  let invisibleContainer = document.getElementsByClassName("cr_invisibleContainer")[num];
    element.onmouseover = () =>{
        let status_num = getStatusNum(num);
        if (status_num === "0" || status_num === "1" ){
          reciver(num);
        }else if(status_num === "2" || status_num === "3" ){
          //if code == 3 location.reload();
        }else{
          if(cr_advanced)invisibleContainer.style.display = "block";
        } 
    };
  element.onmouseout = () => cr_advanced?invisibleContainer.style.display = "none":null;   
}


function autoLoading(){
  let num = 0;
  if (cr_autoLoading) {
    let delay = setInterval(function(){
      let statusNum = getStatusNum(num);
      for (;statusNum !== "0";) {
        num ++;
        if (num >= cr_count) break;
        statusNum = getStatusNum(num);   
      }
      if(num < cr_count)reciver(num);
      if(num >= cr_count)clearInterval(delay);      
    },cr_timeDelay);
  }
}


function reciver(num){
  if(num >= cr_count) return;
  let subid = cr_packages[num].getAttribute("data-subid");
  GM_xmlhttpRequest({
    url: "https://steamdb.info/sub/"+subid+"/",
    method: "get",
    onload: info => check(num,info.response),
    onerror: output(num,"1"),
    onprogress: output(num,"2"),
     headers :{
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "Windows",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "accept": "text/html"
     }
  });
}

function check(num,info){
  let status_num;
  let detail1;
  let detail2;
  let browserCheck = /checking_browser/.exec(info);
  if (browserCheck) {
    output(num,"3");
    return;
  }
  
  
  
  
//   info = info.split("id=\"info\"")[1].split("id=\"app\"")[0];
//   let allow = /AllowPurchaseFromRestrictedCountries<\/td>\n<td>Yes<\/td>/ig.exec(info);
//   let purchaseContries = /PurchaseRestrictedCountries .*[\s\S].*countries-list">(.*?)<\/td>/ig.exec(info);
//   let runCountries = /onlyallowrunincountries .*[\s\S].*countries-list">(.*?)<\/td>/ig.exec(info);


    var dom = document.createElement("html");
    dom.innerHTML = info;
    let rows = dom.querySelectorAll("#info table tr");
    let allow,
        purchaseContries,
        runCountries = null;
    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
      switch (row.children[0].innerText) {
          // suit interface
            case "AllowPurchaseFromRestrictedCountries":
                allow = row.children[1].innerText == "Yes" ? true : false;
                break;
            case "PurchaseRestrictedCountries":
                purchaseContries = [
                    row.children[1].childNodes[2].textContent,
                    row.children[1].childNodes[0].textContent
                ];
            case "onlyallowrunincountries":
                runCountries = [
                    row.children[1].childNodes[2].textContent,
                    row.children[1].childNodes[0].textContent
                ];
        }
    }

  if(purchaseContries||runCountries){
        if(allow && purchaseContries){
            purchaseContries = purchaseContries[1];
            detail1 = "Purchase Only: " + purchaseContries ;
            status_num = "4";
        }else if (!allow && purchaseContries) {
            purchaseContries = purchaseContries[1];
            detail1 = "Can't Purchase Only: " + purchaseContries;
            status_num = "4";
        }else{
        }

        if(runCountries){
            runCountries = runCountries[1];
            detail2 = "RunOnly: " + runCountries;
            status_num = "4";
        }
    }else{
        status_num = "4";
    }
  output(num,status_num,detail1,detail2);
}

function output (num,status_num,detail1,detail2){
  let publicContainer = document.getElementsByClassName("cr_publicContainer")[num];
  let hiddenContent0 = document.getElementsByClassName("cr_hiddenContent0")[num];
  let hiddenContent1 = document.getElementsByClassName("cr_hiddenContent1")[num];
  let hiddenContent2 = document.getElementsByClassName("cr_hiddenContent2")[num];
  publicContainer.setAttribute("status_num",status_num);

  if(status_num == "1" || status_num == "2" || status_num == "3"){
    switch (status_num){
      case "1":
        publicContainer.className = "cr_publicContainer cr_publicContainerCF";
        publicContainer.innerHTML = "Connection Failed";
        break;
      case "2":
        publicContainer.className = "cr_publicContainer cr_publicContainerOL";
        publicContainer.innerHTML = "On Loading...";
        break;
      case "3":
        publicContainer.className = "cr_publicContainer cr_publicContainerSC";
        publicContainer.innerHTML = "Browser Safety Check";
        break;
      default:    
    }
  }else if(!cr_advanced){
      if(!detail1 && !detail2){
        publicContainer.innerHTML = "No Restriction";
        publicContainer.className = "cr_publicContainer cr_publicContainerNR";

      }else if(detail2){
        detail2 = detail1 + "<br>" + detail2;
        publicContainer.innerHTML = detail2;
        publicContainer.className = "cr_publicContainer cr_publicContainerRO";
      }else{
        publicContainer.innerHTML = detail1;
        publicContainer.className = "cr_publicContainer cr_publicContainerPO";
      }
  }else{
    if(!detail1 && !detail2){
      publicContainer.innerHTML = cr_customMiniNRContant;
      hiddenContent0.innerHTML = "No Restriction";
      publicContainer.className = "cr_publicContainer cr_publicContainerADNR";       
    }else if(detail2){
      publicContainer.innerHTML = cr_customMiniROContant;
      hiddenContent1.innerHTML = detail1;
      hiddenContent2.innerHTML = detail2;
      publicContainer.className = "cr_publicContainer cr_publicContainerADRO";
    }else{
      publicContainer.innerHTML = cr_customMiniPOContant;
      hiddenContent1.innerHTML = detail1;
      publicContainer.className = "cr_publicContainer cr_publicContainerADPO";
    }
  }
}

function insert(){

  document.getElementById("cr_configura")?display():insertMainPage();
   

  function insertMainPage(){
    let body = document.getElementsByTagName('body')[0];
    let configura = document.createElement('div');
    configura.id = "cr_configura";
    configura.innerHTML = '<div class="cr_configurationContainer"><div class="cr_configurationPage"><div class="cr_configurationPageTitle"><h1><b>Configuration Page</b></h1></div><div class="cr_settingContainer package"></div><div class="cr_buttonctn"><button id="cr_saveBtn"class="cr_saveBtn">Save</button><button class="cr_reset"id="cr_resetBtn">Reset</button></div></div><div class="hiddenElements"><div id="cr_iv0"class="cr_settingIC"><p class="cr_hiddenContent0 cr_aa">No Restriction</p><p class="cr_hiddenContent1 cr_bb"></p><p class="cr_hiddenContent2 cr_cc"></p></div><div id="cr_iv1"class="cr_settingIC"><p class="cr_hiddenContent0 cr_aa"></p><p class="cr_hiddenContent1 cr_bb">Purchase Only:RU BY UA AM AZ GE KZ KG MD TJ TM UZ</p><p class="cr_hiddenContent2 cr_cc"></p></div><div id="cr_iv2"class="cr_settingIC"><p class="cr_hiddenContent0 cr_aa"></p><p class="cr_hiddenContent1 cr_bb">Purchase Only:RU BY UA AM AZ GE KZ KG MD TJ TM UZ</p><p class="cr_hiddenContent2 cr_cc">RunOnly:RU BY UA AM AZ GE KZ KG MD TJ TM UZ</p></div></div></div>';
    body.appendChild(configura);  
    insideInit();
    cr_saveBtn.onclick=()=>save();
    cr_resetBtn.onclick=()=>reset();
    document.getElementsByClassName("cr_configurationContainer")[0].onclick = () => exit();
    document.getElementsByClassName("cr_configurationPage")[0].onclick= e => e.stopPropagation();
    setTimeout(()=>display(),100);
  }


  function insideInit(){
    let sc= document.getElementsByClassName("cr_settingContainer")[0];
    sc.innerHTML = '<h2 class="cr_author">Created By<a href="#">CharRun</a></h2><table class="table table-bordered table-hover"><thead><th>Setting</th><th>Value</th></thead><tbody class="cr_baseSetting"><tr><td>Advanced Mode</td><td><input type="checkbox"id="cr_am"class="cr_switch"' +  cr_advancedChecked + '></td></tr><tr><td>Auto Loading</td><td><input type="checkbox"id="cr_al"class="cr_switch"' +  cr_autoLoadingChecked + '></td></tr><tr><td>Time Delay</td><td><input type="text"id="cr_td"placeholder=' + '"' + cr_timeDelay + '"' + '></td></tr></tbody></table><div class="cr_talbeWarp"><div class="cr_talbeSlider"><table id="cr_amc"class="table table-bordered table-hover"><thead><th>Advanced Mode Custom</th><th>DEMO</th></thead><tbody class="cr_advancedSetting"><tr><td colspan="2">No Restriction</td></tr><tr><td><span>Font CLR:</span><input type="text"id="cr_mnrwdc"placeholder=' + '"' + cr_customMiniNRWDColor + '"' + '></td><td><span>BKGD CLR:</span><input type="text"id="cr_mnrbgc"placeholder="Not Available"readonly="readonly"></td></tr><tr><td><span>Font CLR:</span><input type="text"id="cr_mnrwwc"placeholder=' + '"' + cr_customMiniNRWWColor + '"' + '></td><td><span>BKGD CLR:</span><input type="text"id="cr_mnrbbc"placeholder=' + '"' + cr_customMiniNRBBColor + '"' + '></td></tr><tr><td><span>Content:</span><input type="text"id="cr_mnrc"placeholder=' + '"' + cr_customMiniNRContant + '"' + '></td><td class="cr_advancedContainer"><div id="cr_mnrdemo"class="cr_publicContainer cr_publicContainerADNR">' + cr_customMiniNRContant + '</div></td></tr><tr><td colspan="2">Purchase Restriction</td></tr><tr><td><span>Font CLR:</span><input type="text"id="cr_mpowdc"placeholder=' + '"' + cr_customMiniPOWDColor + '"' + '></td><td><span>BKGD CLR:</span><input type="text"id="cr_mpobgc"placeholder="Not Available"readonly="readonly"></td></tr><tr><td><span>Font CLR:</span><input type="text"id="cr_mpowwc"placeholder=' + '"' + cr_customMiniPOWWColor + '"' + '></td><td><span>BKGD CLR:</span><input type="text"id="cr_mpobbc"placeholder=' + '"' + cr_customMiniPOBBColor + '"' + '></td></tr><tr><td><span>Content:</span><input type="text"id="cr_mpoc"placeholder=' + '"' + cr_customMiniPOContant + '"' + '></td><td class="cr_advancedContainer"><div id="cr_mpodemo"class="cr_publicContainer cr_publicContainerADPO">' + cr_customMiniPOContant + '</div></td></tr><tr><td colspan="2">Run Restriction</td><tr><tr><td><span>Font CLR:</span><input type="text"id="cr_mrowdc"placeholder=' + '"' + cr_customMiniROWDColor + '"' + '></td><td><span>BKGD CLR:</span><input type="text"id="cr_mrobgc"placeholder="Not Available"readonly="readonly"></td></tr><tr><td><span>Font CLR:</span><input type="text"id="cr_mrowwc"placeholder=' + '"' + cr_customMiniROWWColor + '"' + '></td><td><span>BKGD CLR:</span><input type="text"id="cr_mrobbc"placeholder=' + '"' + cr_customMiniROBBColor + '"' + '></td></tr><tr><td><span>Content:</span><input type="text"id="cr_mroc"placeholder=' + '"' + cr_customMiniROContant + '"' + '></td><td class="cr_advancedContainer"><div id="cr_mrodemo"class="cr_publicContainer cr_publicContainerADRO">' + cr_customMiniROContant + '</div></td></tr><tr></tbody></table><table id="cr_fmc"class="table table-bordered table-hover"><thead><th>Full Mode Custom</th><th>DEMO</th></thead><tbody class="cr_fullModeSetting"><tr><td colspan="2">No Restriction</td></tr><tr><td><span>Font CLR:</span><input type="text"id="cr_fnrwdc"class="cr_fnrdm"placeholder=' + '"' + cr_customFullNRWDColor + '"' + '></td><td id="cr_fnrdemo"class="cr_publicContainer cr_publicContainerNR ">No Restriction</td></tr><tr><td><span>BKGD CLR:</span><input type="text"id="cr_fnrbgc"class="cr_fnrdm"placeholder=' + '"' + cr_customFullNRBGColor + '"' + '></td><td><!--<a href="#"aria-label="This advertisement place is available."></a>--></td></tr><tr><td colspan="2">Purchase Restriction</td></tr><tr><td><span>Font CLR:</span><input type="text"id="cr_fpowdc"placeholder=' + '"' + cr_customFullPOWDColor + '"' + '></td><td id="cr_fpodemo"class="cr_publicContainer cr_publicContainerPO"rowspan="2">Purchase Only:MY SG PH VN ID KH BN TH MM IN TR LA AE BH KW OM QA SA AU HK TW LK PK NP KR MO CN BD</td></tr><tr><td><span>BKGD CLR:</span><input type="text"id="cr_fpobgc"placeholder=' + '"' + cr_customFullPOBGColor + '"' + '></td><td></td></tr><tr><td colspan="2">Run Restriction</td></tr><tr><td><span>Font CLR:</span><input type="text"id="cr_frowdc"placeholder=' + '"' + cr_customFullROWDColor + '"' + '></td><td id="cr_frodemo"class="cr_publicContainer cr_publicContainerRO"rowspan="2">Purchase Only:RU BY UA AM AZ GE KZ KG MD TJ TM UZ<br>RunOnly:RU BY UA AM AZ GE KZ KG MD TJ TM UZ</td></tr><tr><td><span>BKGD CLR:</span><input type="text"id="cr_frobgc"placeholder=' + '"' + cr_customFullROBGColor + '"' + '></td><td></td></tr><tr></tbody></table></div></div>';
    cr_am.checked?amc():fmc();
    cr_am.onchange=()=>cr_am.checked?amc():fmc();
    sc.style.marginBottom="0";
    sc.style.opacity = "1";
  }


  function fmc(){
    cr_fmc.style.marginTop="0px";
    cr_fmc.style.opacity="1";
    cr_amc.style.marginTop="-454px";
    cr_amc.style.marginLeft="-540px";
    cr_amc.style.opacity="0";

    cr_fnrwdc.oninput=()=>cr_fnrdemo.style.color=cr_fnrwdc.value;
    cr_fnrbgc.oninput=()=>cr_fnrdemo.style.backgroundColor=cr_fnrbgc.value;
    cr_fpowdc.oninput=()=>cr_fpodemo.style.color=cr_fpowdc.value;
    cr_fpobgc.oninput=()=>cr_fpodemo.style.backgroundColor=cr_fpobgc.value;
    cr_frowdc.oninput=()=>cr_frodemo.style.color=cr_frowdc.value;
    cr_frobgc.oninput=()=>cr_frodemo.style.backgroundColor=cr_frobgc.value;
  }

  function amc(){
    cr_fmc.style.marginTop="-344px";
    cr_fmc.style.opacity="0";
    cr_amc.style.marginTop="0px";
    cr_amc.style.marginLeft="0px";
    cr_amc.style.opacity="1";

    settingCss();//Init

    cr_mnrwdc.oninput=()=>cr_mnrdemo.style.color=cr_mnrwdc.value;
    cr_mnrc.oninput=()=>cr_mnrdemo.innerHTML=cr_mnrc.value||cr_customMiniNRContant;
    cr_mnrwwc.oninput=()=>settingCss();
    cr_mnrbbc.oninput=()=>settingCss();
    cr_mnrdemo.onmouseover=()=>{cr_iv0.style.display="block";cr_iv0.style.left= cr_mnrdemo.getBoundingClientRect().right+"px";cr_iv0.style.top = cr_mnrdemo.getBoundingClientRect().top+"px";};
    cr_mnrdemo.onmouseout=()=>cr_iv0.style.display="none";
    cr_mpowdc.oninput=()=>cr_mpodemo.style.color=cr_mpowdc.value;
    cr_mpoc.oninput=()=>cr_mpodemo.innerHTML=cr_mpoc.value||cr_customMiniPOContant;
    cr_mpowwc.oninput=()=>settingCss();
    cr_mpobbc.oninput=()=>settingCss();
    cr_mpodemo.onmouseover=()=>{cr_iv1.style.display="block"; cr_iv1.style.left=cr_mpodemo.getBoundingClientRect().right+"px";cr_iv1.style.top = cr_mpodemo.getBoundingClientRect().top+"px";};
    cr_mpodemo.onmouseout=()=>cr_iv1.style.display="none";
    cr_mrowdc.oninput=()=>cr_mrodemo.style.color=cr_mrowdc.value;
    cr_mroc.oninput=()=>cr_mrodemo.innerHTML=cr_mroc.value||cr_customMiniROContant;
    cr_mrowwc.oninput=()=>settingCss();
    cr_mrobbc.oninput=()=>settingCss(); 
    cr_mrodemo.onmouseover=()=>{cr_iv2.style.display="block";cr_iv2.style.left= cr_mrodemo.getBoundingClientRect().right+"px";cr_iv2.style.top = cr_mrodemo.getBoundingClientRect().top+"px";};
    cr_mrodemo.onmouseout=()=>cr_iv2.style.display="none";

    function settingCss(){
      let head = document.getElementsByTagName('head')[0];
      let style = document.getElementById('cr_settingCSS') || document.createElement('style');
      style.id ='cr_settingCSS';
      style.innerHTML ='.cr_hiddenContent0.cr_aa{color:' + cr_mnrwwc.value + ';background-color:' + cr_mnrbbc.value + '}.cr_hiddenContent1.cr_bb{color:' + cr_mpowwc.value + ';background-color:' + cr_mpobbc.value + '}.cr_hiddenContent2.cr_cc{color:' + cr_mrowwc.value + ';background-color:' + cr_mrobbc.value + '}'; 
      head.appendChild(style);
    }
  }

  function exit(){
    let cfc = document.getElementsByClassName('cr_configurationContainer')[0];
    cfc.style.width = "0";
    cfc.style.height = "0";
    cfc.style.opacity = "0";
  }

  function display(){
    let cfc = document.getElementsByClassName('cr_configurationContainer')[0];
    cfc.style.width = "100%";
    cfc.style.height = "100%";
    cfc.style.opacity = "1";
  }


  function save(){
    localStorage.setItem("cr_advanced" , cr_am.checked);
    localStorage.setItem("cr_autoLoading" , cr_al.checked);
    localStorage.setItem("cr_timeDelay" , cr_td.value);
    localStorage.setItem("cr_customFullNRWDColor" , cr_fnrwdc.value);
    localStorage.setItem("cr_customFullNRBGColor" , cr_fnrbgc.value);
    localStorage.setItem("cr_customFullPOWDColor" , cr_fpowdc.value); 
    localStorage.setItem("cr_customFullPOBGColor" , cr_fpobgc.value);
    localStorage.setItem("cr_customFullROWDColor" , cr_frowdc.value);
    localStorage.setItem("cr_customFullROBGColor" , cr_frobgc.value);
    localStorage.setItem("cr_customMiniNRContant" , cr_mnrc.value);
    localStorage.setItem("cr_customMiniNRWDColor" , cr_mnrwdc.value);
    localStorage.setItem("cr_customMiniNRBGColor" , cr_mnrbgc.value);
    localStorage.setItem("cr_customMiniNRWWColor" , cr_mnrwwc.value);
    localStorage.setItem("cr_customMiniNRBBColor" , cr_mnrbbc.value);
    localStorage.setItem("cr_customMiniPOContant" , cr_mpoc.value);
    localStorage.setItem("cr_customMiniPOWDColor" , cr_mpowdc.value);
    localStorage.setItem("cr_customMiniPOBGColor" , cr_mpobgc.value);
    localStorage.setItem("cr_customMiniPOWWColor" , cr_mpowwc.value);
    localStorage.setItem("cr_customMiniPOBBColor" , cr_mpobbc.value); 
    localStorage.setItem("cr_customMiniROContant" , cr_mroc.value);
    localStorage.setItem("cr_customMiniROWDColor" , cr_mrowdc.value);
    localStorage.setItem("cr_customMiniROBGColor" , cr_mrobgc.value);
    localStorage.setItem("cr_customMiniROWWColor" , cr_mrowwc.value);
    localStorage.setItem("cr_customMiniROBBColor" , cr_mrobbc.value);
    init();  
    addCSS();
    exit();
  }
  function reset(){
    let sc= document.getElementsByClassName("cr_settingContainer")[0];
    localStorage.removeItem("cr_advanced");
    localStorage.removeItem("cr_autoLoading");
    localStorage.removeItem("cr_timeDelay");
    localStorage.removeItem("cr_customFullNRWDColor"); 
    localStorage.removeItem("cr_customFullNRBGColor");
    localStorage.removeItem("cr_customFullPOWDColor"); 
    localStorage.removeItem("cr_customFullPOBGColor");
    localStorage.removeItem("cr_customFullROWDColor");
    localStorage.removeItem("cr_customFullROBGColor");
    localStorage.removeItem("cr_customMiniNRContant");
    localStorage.removeItem("cr_customMiniNRWDColor");
    localStorage.removeItem("cr_customMiniNRBGColor");
    localStorage.removeItem("cr_customMiniNRWWColor");
    localStorage.removeItem("cr_customMiniNRBBColor");
    localStorage.removeItem("cr_customMiniPOContant");
    localStorage.removeItem("cr_customMiniPOWDColor");
    localStorage.removeItem("cr_customMiniPOBGColor");
    localStorage.removeItem("cr_customMiniPOWWColor");
    localStorage.removeItem("cr_customMiniPOBBColor"); 
    localStorage.removeItem("cr_customMiniROContant");
    localStorage.removeItem("cr_customMiniROWDColor");
    localStorage.removeItem("cr_customMiniROBGColor");
    localStorage.removeItem("cr_customMiniROWWColor");
    localStorage.removeItem("cr_customMiniROBBColor");
    init();
    addCSS();
    sc.style.marginBottom = - sc.getBoundingClientRect().height + "px";
    sc.style.opacity = "0";
    setTimeout(()=>insideInit(),1500);   
  }
}

function main(){
  init();  
  addCSS();
  createTitle();
  createContainer();
  autoLoading();
}
main();



})();