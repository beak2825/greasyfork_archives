// ==UserScript==
// @name         搞定水印 RemoveWatermark（搞定设计、创客贴、比格设计、爱设计、易企秀、标小智、标智客等）
// @namespace    https://www.benmao.site
// @version      2.0.1
// @description  🔥搞定水印 RemoveWatermark插件是由笨猫小站开发的一款去水印工具，支持去除在线图文设计平台水印，包括有搞定设计、创客贴、比格设计、爱设计、易企秀、标小智、标智客图片水印。
// @author       笨猫
// @icon         https://achengovo.com/greasyfork/logo.png
// @match        https://*.gaoding.com/*
// @match        https://*.eqxiu.com/*
// @match        https://*.chuangkit.com/*
// @match        https://bigesj.com/*
// @match        https://www.isheji.com/*
// @match        https://www.logosc.cn/*
// @match        https://www.focodesign.com/*
// @match        https://www.logomaker.com.cn/*
// @require      https://update.greasyfork.org/scripts/502757/1422896/Jquery331.js
// @require      https://greasyfork.org/scripts/448541-dom-to-image-js/code/dom-to-imagejs.js?version=1074759
// @require      https://update.greasyfork.org/scripts/457525/1134363/html2canvas%20141.js
// @license      AGPL-3.0
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @compatible    firefox
// @compatible    chrome
// @compatible    opera safari edge
// @compatible    safari
// @compatible    edge

// @downloadURL https://update.greasyfork.org/scripts/502769/%E6%90%9E%E5%AE%9A%E6%B0%B4%E5%8D%B0%20RemoveWatermark%EF%BC%88%E6%90%9E%E5%AE%9A%E8%AE%BE%E8%AE%A1%E3%80%81%E5%88%9B%E5%AE%A2%E8%B4%B4%E3%80%81%E6%AF%94%E6%A0%BC%E8%AE%BE%E8%AE%A1%E3%80%81%E7%88%B1%E8%AE%BE%E8%AE%A1%E3%80%81%E6%98%93%E4%BC%81%E7%A7%80%E3%80%81%E6%A0%87%E5%B0%8F%E6%99%BA%E3%80%81%E6%A0%87%E6%99%BA%E5%AE%A2%E7%AD%89%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/502769/%E6%90%9E%E5%AE%9A%E6%B0%B4%E5%8D%B0%20RemoveWatermark%EF%BC%88%E6%90%9E%E5%AE%9A%E8%AE%BE%E8%AE%A1%E3%80%81%E5%88%9B%E5%AE%A2%E8%B4%B4%E3%80%81%E6%AF%94%E6%A0%BC%E8%AE%BE%E8%AE%A1%E3%80%81%E7%88%B1%E8%AE%BE%E8%AE%A1%E3%80%81%E6%98%93%E4%BC%81%E7%A7%80%E3%80%81%E6%A0%87%E5%B0%8F%E6%99%BA%E3%80%81%E6%A0%87%E6%99%BA%E5%AE%A2%E7%AD%89%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const alifont = 'https://at.alicdn.com/t/c/font_2324127_m4c36wjifv.css';
    const cssurl  = 'https://api.1900.wang/public/monkey/css/remark.css';
    GM_addStyle(`@import url('${alifont}');`);
    GM_addStyle(`@import url('${cssurl}');`);
    const thisReward   = getCookie('catRewardIdent');
    if(thisReward == ""){
        createReward();
    }
    createRemarkBtn();
})();
//创建去水印按钮
function createRemarkBtn(){
    var killMarkObj = document.createElement("div");
        killMarkObj.setAttribute('class', 'kill-mark-slide');
    document.body.appendChild(killMarkObj);
    //去水印
    var killBtnObj = document.createElement("span");
        killBtnObj.setAttribute('class', 'kill-mark-btn');
        killBtnObj.innerHTML = "<i class='catfont benmao-shuiyin'></i> 去水印";
        killBtnObj.addEventListener("click", () => {
            const thisKillmark = getCookie('catKillMark');
            if(thisKillmark != ""){
                killMarks();
            }else{
                createVerify();
            }
        });
    killMarkObj.appendChild(killBtnObj);

    //打个赏
    var rewardBtnObj = document.createElement("span");
        rewardBtnObj.setAttribute('class', 'tome-reward-btn');
        rewardBtnObj.innerHTML = "<i class='catfont benmao-dashang'></i> 打个赏";
        rewardBtnObj.addEventListener("click", () => {
            createReward();
        });
    killMarkObj.appendChild(rewardBtnObj);

    //看教程
    var tutorialBtnObj = document.createElement("a");
        tutorialBtnObj.setAttribute('class', 'tutorial-btn');
        tutorialBtnObj.setAttribute('target', '_blank');
        tutorialBtnObj.setAttribute('href', 'https://www.benmao.site/article.html?id=212');
        tutorialBtnObj.innerHTML = "<i class='catfont benmao-jiaocheng'></i> 看教程";
    killMarkObj.appendChild(tutorialBtnObj);

    
}
//创建打赏
function createReward(){
    var rewardscreen = document.createElement("div");
        rewardscreen.setAttribute('class', 'reward-screen');
    document.body.appendChild(rewardscreen);

    var rewardmodal = document.createElement("div");
        rewardmodal.setAttribute('class', 'reward-modal');
    rewardscreen.appendChild(rewardmodal);

    var titleObj = document.createElement("h2");
        titleObj.textContent = "给我打个赏吧";
        titleObj.setAttribute('class', 'modal-title');
    rewardmodal.appendChild(titleObj);

    var rewardCodeObj = document.createElement("div");
        rewardCodeObj.setAttribute('class', 'reward-code');
    rewardmodal.appendChild(rewardCodeObj);

    var codeImageObj = document.createElement("img");
        codeImageObj.setAttribute('class', 'code-img');
        codeImageObj.src = "https://api.1900.wang/public/monkey/images/enjoy_pay.png";
    rewardCodeObj.appendChild(codeImageObj);

    var rewardBtnsObj = document.createElement("div");
        rewardBtnsObj.setAttribute('class', 'reward-btns');
    rewardmodal.appendChild(rewardBtnsObj);

    var redBtnObj = document.createElement("span");
        redBtnObj.setAttribute('class', 'btn');
        redBtnObj.textContent = "已打赏";
        redBtnObj.addEventListener("click", () => {
            setCookie('catRewardIdent','reward',2)
            hideVerifyModal('reward-screen')
        });
    rewardBtnsObj.appendChild(redBtnObj);
}
//公众号验证(必须验证)
function createVerify(){
    var gzhscreen = document.createElement("div");
        gzhscreen.setAttribute('class', 'verify-screen');
    document.body.appendChild(gzhscreen);

    var gzhmodal = document.createElement("div");
        gzhmodal.setAttribute('class', 'verify-modal');
    gzhscreen.appendChild(gzhmodal);

    var titleObj = document.createElement("h2");
        titleObj.textContent = "使用前验证";
        titleObj.setAttribute('class', 'modal-title');
    gzhmodal.appendChild(titleObj);

    var verifyBoxObj = document.createElement("div");
        verifyBoxObj.setAttribute('class', 'verify-box');
    gzhmodal.appendChild(verifyBoxObj);

    var wxcodeObj = document.createElement("div");
        wxcodeObj.setAttribute('class', 'wxcode');
    verifyBoxObj.appendChild(wxcodeObj);

    var imageObj = document.createElement("img");
        imageObj.setAttribute('class', 'codeimg');
        imageObj.src = "https://api.1900.wang/public/monkey/images/benmao.png";
    wxcodeObj.appendChild(imageObj);

    var inputBoxObj = document.createElement("div");
        inputBoxObj.setAttribute('class', 'input-group');
    verifyBoxObj.appendChild(inputBoxObj);

    var inputObj = document.createElement("input");
        inputObj.setAttribute('placeholder', '输入验证码');
    inputBoxObj.appendChild(inputObj);

    var errorTipsObj = document.createElement("span");
        errorTipsObj.setAttribute('class', 'error-tips');
        errorTipsObj.textContent = "❌验证码错误！";
    inputBoxObj.appendChild(errorTipsObj);

    var verifyButObj = document.createElement("button");
        verifyButObj.setAttribute('class', 'verify-btn');
        verifyButObj.textContent = "验证";
        verifyButObj.addEventListener("click", () => {
            const authkey = $('.input-group input').val().replace(/\s/g, "");
            if(authkey == ""){
                errorTipsObj.textContent = "❌请输入验证码！";
                errorTipsObj.style.display = 'block';
                setTimeout(function(){
                    errorTipsObj.style.display = 'none';
                },3000)
                return false;
            }
            const geturl = 'https://api.1900.wang/benmao/others/verify_code/state';
            $.post(geturl,{authkey:authkey},function(result){
                if(result.code == 1){
                    var today = new Date().toLocaleDateString();
                    setCookie('catKillMark',today,12)
                    createReward();
                    hideVerifyModal('verify-screen');
                }else{
                    errorTipsObj.style.display = 'block';
                    errorTipsObj.textContent = "❌"+result.msg+"！";
                    setTimeout(function(){
                        errorTipsObj.style.display = 'none';
                    },3000)
                }
            })
        });
    inputBoxObj.appendChild(verifyButObj);

    var verifyTipObj = document.createElement("div");
        verifyTipObj.setAttribute('class', 'verify-tip');
        verifyTipObj.innerHTML = "① 扫码关注公众号回复口令<b> 「验证码」 </b><br/>② 将获取到的验证码输入进行验证";
    inputBoxObj.appendChild(verifyTipObj);
    //关闭按钮
    var closeBtnObj = document.createElement("span");
        closeBtnObj.setAttribute('class', 'close-modal');
        closeBtnObj.textContent = "X";
        closeBtnObj.addEventListener("click", () => {
            hideVerifyModal('verify-screen');
        });
    gzhmodal.appendChild(closeBtnObj);
}

//去水印提示（搞定设计）
function gaodingRemarkTips(){
    var markTipScreen = document.createElement("div");
        markTipScreen.setAttribute('class', 'remark-tips-screen');
    document.body.appendChild(markTipScreen);

    var markTipModal = document.createElement("div");
        markTipModal.setAttribute('class', 'remark-tips-modal');
    markTipScreen.appendChild(markTipModal);

    var modalTipTitle = document.createElement("h3");
        modalTipTitle.setAttribute('class', 'modal-title');
        modalTipTitle.textContent = "请确认是否添加屏蔽网络请求！";
    markTipModal.appendChild(modalTipTitle);

    var modalTipInfos = document.createElement("div");
        modalTipInfos.setAttribute('class', 'modal-infos');
    markTipModal.appendChild(modalTipInfos);

    var stepOne = document.createElement("div");
        stepOne.setAttribute('class', 'step-one');
        stepOne.textContent = "1. 作图完成以后按F12打开开发者工具，打开屏蔽网络请求";
    modalTipInfos.appendChild(stepOne);

    var stepOneImg = document.createElement("img");
        stepOneImg.setAttribute('class', 'step-ong-img');
        stepOneImg.src = "https://api.1900.wang/public/monkey/images/gdimgs/step_1.png";
    stepOne.appendChild(stepOneImg);

    var stepTwo = document.createElement("div");
        stepTwo.setAttribute('class', 'step-two');
        stepTwo.textContent = "2. 添加屏蔽请求，输入屏蔽地址：https://www.gaoding.com/api/ccm/editors/risk_materials";
    modalTipInfos.appendChild(stepTwo);

    var stepTwoImg = document.createElement("img");
        stepTwoImg.setAttribute('class', 'step-two-img');
        stepTwoImg.src = "https://api.1900.wang/public/monkey/images/gdimgs/step_2.png";
    stepTwo.appendChild(stepTwoImg);

    var stepThree = document.createElement("div");
        stepThree.setAttribute('class', 'step-three');
        stepThree.textContent = "3. 勾选请求阻止，刷新页面，此时页面中已经没有水印了";
    modalTipInfos.appendChild(stepThree);

    var stepThreeImg = document.createElement("img");
        stepThreeImg.setAttribute('class', 'step-three-img');
        stepThreeImg.src = "https://api.1900.wang/public/monkey/images/gdimgs/step_3.png";
    stepThree.appendChild(stepThreeImg);

    var killtipBtnsObj = document.createElement("div");
        killtipBtnsObj.setAttribute('class', 'kill-tip-btns');
    markTipModal.appendChild(killtipBtnsObj);

    var closeBtnObj = document.createElement("span");
        closeBtnObj.setAttribute('class', 'btn');
        closeBtnObj.textContent = "关闭";
        closeBtnObj.addEventListener("click", () => {
            hideVerifyModal('remark-tips-screen')
        });
    killtipBtnsObj.appendChild(closeBtnObj);

    var rekillBtnObj = document.createElement("span");
        rekillBtnObj.setAttribute('class', 'btn');
        rekillBtnObj.textContent = "已添加，现在去水印";
        rekillBtnObj.addEventListener("click", () => {
            location.reload()
        });
    killtipBtnsObj.appendChild(rekillBtnObj);
}

//去水印功能
function killMarks(){
    const doctitle = document.title;
    if(/(稿定设计)/.test(doctitle)) {
        gaodingRemarkTips()
    }else if (/(易企秀)/.test(doctitle)){
        $("div.eqc-watermark").css("position", "static");
        $(".eqc-wm-close").remove();
        let oldStr = window.document.body.innerHTML;
        var newStr = document.getElementsByClassName("safe-space")[0].innerHTML;
        newStr = newStr.replaceAll('data-hint="双击或从素材库拖拽进行替换"', "");
        newStr = newStr.replaceAll("hint--top", "");
    }else if (/(创客贴)/.test(doctitle)) {
        const newStr = document.getElementsByClassName("canvas-slot-inner")[0].innerHTML;
            window.document.body.innerHTML = newStr;
        $("div.water-mark").remove();
        $("body").css("overflow", "visible");
    }else if (/(笔格设计)/.test(doctitle)) {
        $(".water").remove();
    }else if (/(爱设计)/.test(doctitle)) {
        $("#editorDrag > div.undefined.scrolly > div.scrolly-viewport.editor-center > div > div:nth-child(1)").remove();
        $(".editor-watermask").remove();
        $(".editor-header").remove();
        $(".editor-aside").remove();
        $(".editor-panel").remove();
        $("#rongqi").remove();
        $("#outbuttons").remove();
        $(".control-panel").remove()
    }else if (/(标小智)/.test(doctitle)) {
        $(".watermarklayer").remove();
        $('#watermark').remove()
    }else if (/(标智客)/.test(doctitle)) {
        $(".watermark").remove();
    }
}
//设置Cookie
function setCookie(name, value, hours) {
    var d = new Date()
    d.setTime(d.getTime() + (hours*60*60*1000))
    var expires = "expires=" + d.toUTCString()
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}
//获取Cookie
function getCookie(ckname) {
    var name = ckname + "="
    var ca = document.cookie.split(';')
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i]
        while (c.charAt(0) == '') c = c.substring(1)
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length)
    }
    return ""
}
//关闭验证
function hideVerifyModal(elem){
    $('.'+elem).remove();
}
