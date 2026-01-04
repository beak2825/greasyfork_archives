// ==UserScript==
// @name         ✌学学习通|智慧树|国开|智慧职教|青书学堂|在线100分|考教育云课堂|学起plus|再起航|融学|U校园等等|各类继续教育通用视频均支持视频加速服务|指定倍速✌👈🥇
// @namespace    white996_1
// @version      1.1.1
// @description  【超星学习通】【智慧树】【国家智慧中小学】【u校园】【国家开放大学】[在线100分]【自考教育云课堂】【职教云系列】【雨课堂系列】【讯网】【朝明在线】【麦能网】【融学APP】【技能云】【168网校】【英华学堂系列都可】【继续教育类】【柠檬文才】【亿学宝云】【优课学堂】【清华社】【安徽继续教育】 【上海开放大学】【学历邦】【兰州继教】【继教在线】【思钮教育】【春风雨教育】【龙知网】【重庆高校】【新锦和】【中国石油大学】【尚学课堂】【新京人】【百通学堂】【点墨云】【博学】【联大】【课程伴侣】【出头科技】【良师在线】【中国大学】【在浙学】【棉花糖】【朝明在线】【学习公社】【河南宗教】【welearn随行课堂】【睿学】【兰州继教】【文鼎】【绎通云】【池馆】【utalk】【168网校】【我学习】【FIF英语】【百万扩招】【和学在线】【人卫慕课】【绎通云】【再起航】【i学】【慕享】【高校邦】【好策】【优学院】 【学起Plus】【青书学堂】【含弘慕课】【微知库】【学堂在线】使用前请务必打开浏览器开发者模式，按F2后即可执行，使用前一定要看脚本使用说明|作者：white996_1
// @author       white996_1
// @run-at       document-end
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528612/%E2%9C%8C%E5%AD%A6%E5%AD%A6%E4%B9%A0%E9%80%9A%7C%E6%99%BA%E6%85%A7%E6%A0%91%7C%E5%9B%BD%E5%BC%80%7C%E6%99%BA%E6%85%A7%E8%81%8C%E6%95%99%7C%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%7C%E5%9C%A8%E7%BA%BF100%E5%88%86%7C%E8%80%83%E6%95%99%E8%82%B2%E4%BA%91%E8%AF%BE%E5%A0%82%7C%E5%AD%A6%E8%B5%B7plus%7C%E5%86%8D%E8%B5%B7%E8%88%AA%7C%E8%9E%8D%E5%AD%A6%7CU%E6%A0%A1%E5%9B%AD%E7%AD%89%E7%AD%89%7C%E5%90%84%E7%B1%BB%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E9%80%9A%E7%94%A8%E8%A7%86%E9%A2%91%E5%9D%87%E6%94%AF%E6%8C%81%E8%A7%86%E9%A2%91%E5%8A%A0%E9%80%9F%E6%9C%8D%E5%8A%A1%7C%E6%8C%87%E5%AE%9A%E5%80%8D%E9%80%9F%E2%9C%8C%F0%9F%91%88%F0%9F%A5%87.user.js
// @updateURL https://update.greasyfork.org/scripts/528612/%E2%9C%8C%E5%AD%A6%E5%AD%A6%E4%B9%A0%E9%80%9A%7C%E6%99%BA%E6%85%A7%E6%A0%91%7C%E5%9B%BD%E5%BC%80%7C%E6%99%BA%E6%85%A7%E8%81%8C%E6%95%99%7C%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%7C%E5%9C%A8%E7%BA%BF100%E5%88%86%7C%E8%80%83%E6%95%99%E8%82%B2%E4%BA%91%E8%AF%BE%E5%A0%82%7C%E5%AD%A6%E8%B5%B7plus%7C%E5%86%8D%E8%B5%B7%E8%88%AA%7C%E8%9E%8D%E5%AD%A6%7CU%E6%A0%A1%E5%9B%AD%E7%AD%89%E7%AD%89%7C%E5%90%84%E7%B1%BB%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E9%80%9A%E7%94%A8%E8%A7%86%E9%A2%91%E5%9D%87%E6%94%AF%E6%8C%81%E8%A7%86%E9%A2%91%E5%8A%A0%E9%80%9F%E6%9C%8D%E5%8A%A1%7C%E6%8C%87%E5%AE%9A%E5%80%8D%E9%80%9F%E2%9C%8C%F0%9F%91%88%F0%9F%A5%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const selectors = {
        bilibili: 'bwp-video',
        douyin: '.xg-video-container video',
        other: '上面两个无用，忽略就行'
    };

    function registerMenu() {
        try {
            GM_registerMenuCommand("减速/加速", () => {
                const rate = prompt("请输入您的速率(0-16)", "2.0");
                if (isValidRate(rate)) {
                    setPlaybackRate(rate);
                } else {
                    alert("无效数值");
                }
            }, "rate");
        } catch (error) {
            console.error("注册菜单命令失败:", error);
        }
    }

    function isValidRate(rate) {
        return !isNaN(rate) && rate >= 0 && rate <= 16;
    }

    function onKeyDown(event) {
        if (event.key === 'F2' || event.keyCode === 113) {
            event.preventDefault();
            promptForRate();
        }
    }

    function promptForRate() {
        const rate = prompt("请输入您的速率(0-16)", "2.0");
        if (isValidRate(rate)) {
            setPlaybackRate(rate);
        } else {
            alert("无效数值");
        }
    }

    function setPlaybackRate(rate) {
        let video = findVideoElement();
        if (video) {
            video.playbackRate = parseFloat(rate);
        } else {
            console.error("未找到视频元素");
        }
    }

    function findVideoElement() {
        let video = null;
        Object.keys(selectors).forEach((key) => {
            if (location.host.replace(/\./g, "").includes(key)) {
                video = document.querySelector(selectors[key]);
            }
        });

        return video || document.querySelector('video');
    }

    registerMenu();
    document.addEventListener('keydown', onKeyDown);

})();
