// ==UserScript==
// @name         Stowe Isams原神平台
// @namespace    https://greasyfork.org/zh-CN/scripts/481191-stowe-isams%E5%8E%9F%E7%A5%9E%E5%B9%B3%E5%8F%B0
// @version      0.5.1
// @description  原神，启动！
// @author       ZZW
// @match        *://stowe.isamshosting.cloud/*
// @match        *://stowe.students.isamshosting.cloud/*
// @icon         https://stowe.students.isamshosting.cloud/styling/icons/head/favicon-32x32.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481191/Stowe%20Isams%E5%8E%9F%E7%A5%9E%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/481191/Stowe%20Isams%E5%8E%9F%E7%A5%9E%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const { href } = window.location
    // 登陆页替换
    if (href.startsWith('https://stowe.isamshosting.cloud/auth/Account/Login')) {
        console.log("I原：检测到isams登录页，开始替换");
        function replaceBackground() {
            // 先置顶登陆框，以免被视频遮挡
            // （虽然这不是一个很优雅的做法，但是足够应付了，毕竟我们只需要一个登陆框，这样做也可以和页脚的那一栏黑边说拜拜了
            const loginBox = document.querySelector('.login-box');
            if (loginBox) {
                console.log("I原：看我抬起登陆框～～")
                loginBox.style.zIndex = '9999'; // 设置一个较高的 z-index，确保登录框在页面最顶端
                loginBox.style.borderRadius = '50px'; // 添加圆角边框
                loginBox.style.padding = '40px'; // 添加内边距
                loginBox.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                loginBox.style.backdropFilter = 'blur(3px)';
                loginBox.style.transform = 'translate(50%, -10%)';

                let isInLoginBox = false;
                var scale = 1;
                loginBox.addEventListener('mouseenter', function() {
                    isInLoginBox = true;
                    scale = 1.1;
                    loginBox.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
                    loginBox.style.backdropFilter = 'blur(5px)';
                });

                loginBox.addEventListener('mouseleave', function() {
                    isInLoginBox = false;
                    scale = 1;
                    loginBox.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    loginBox.style.backdropFilter = 'blur(3px)';
                });

                document.addEventListener('mousemove', function(e) {
                    if (!isInLoginBox||isInLoginBox) {
                        loginBox.style.transition = 'transform 0.3s ease-out, background-color 0.3s ease-in-out, backdrop-filter 0.1s ease-in-out'; // 添加过渡效果
                        const xAxis = (window.innerWidth / 5*3 - e.pageX) / 25;
                        const yAxis = -(window.innerHeight / 2 - e.pageY) / 25;

                        loginBox.style.transform = `translate(50%, -10%) perspective(1000px) rotateY(${xAxis}deg) rotateX(${yAxis}deg) scale(${scale})`;
                    }
                });


            }
            else{
                console.log("I原：咦？没有找到登陆框诶。不管它了，继续～")
            }

            // 添加视频并置于登陆框下方
            const layoutImg = document.getElementById('layout-body');

            if (layoutImg) {
                console.log("I原：进行一个原神背景的插入～")
                const video = document.createElement('video');
                video.poster = 'https://ys.mihoyo.com/main/_nuxt/img/47f71d4.jpg';
                video.src = 'https://ys.mihoyo.com/main/_nuxt/videos/3e78e80.mp4';
                video.autoplay = true;
                video.loop = true;
                video.muted = true;
                video.style.position = 'fixed';
                video.style.top = '0';
                video.style.left = '0';
                video.style.width = '100%';
                video.style.height = '100%';
                video.style.objectFit = 'cover';
                video.style.zIndex = '9998';

                layoutImg.parentNode.insertBefore(video, layoutImg);


            }
        }
        // 替换logo
        const schoolLogo = document.querySelector('.logo-school');
        if (schoolLogo) {
            console.log("I原：换掉学校logo～")
            schoolLogo.src = 'https://upload.wikimedia.org/wikipedia/commons/3/34/Genshin_Chinese_logo.svg';
            schoolLogo.style.width = '85px'; // 调整图像宽度
            schoolLogo.style.height = 'auto'; // 自动调整高度以保持比例
        }
        else{
            console.log("I原：咦？没有找到学校logo诶。不管它了，继续～")
        }
        // 登陆链接文字
        const loginbutton = document.querySelector('#single-external-provider-link');
        if (loginbutton) {
            console.log("I原：进行一个登陆链接的修改～")
            loginbutton.textContent = '通过米哈游登陆';
        }
        else{
            console.log("I原：咦？没有找到登陆链接诶。不管它了，继续～")
        }
        // 登陆子标题文本
        const loginSubheading = document.querySelector('.login-subheading');
        if (loginSubheading) {
            console.log("I原：进行一个登陆页面子标题的修改～")
            loginSubheading.textContent = 'Stowe 原神中心';
        }
        else{
            console.log("I原：咦？没有找到登陆页面子标题诶。不管它了，继续～")
        }

        replaceBackground()
        console.log("I原：搞定！")
    }
    // isams学生页替换
    else if (href.startsWith('https://stowe.students.isamshosting.cloud')) {
        console.log("I原：isams平台内容页，开始替换");
        // 让页面的空白处透明
        console.log("I原：重新装修元素中。。。")
        var spContainer = document.getElementById('SP_Container');

        if (spContainer) {
            // 设置 SP_Container 元素的背景为透明
            spContainer.style.backgroundColor = 'transparent';
            spContainer.style.opacity = '1'; // 透明度
        }

        var spContent = document.getElementById('SP_Content');

        if (spContent) {
            spContent.style.backgroundColor = 'rgba(255, 255, 255, 0.75)'; //半透明背景，不影响文字
            spContent.style.backdropFilter = 'blur(5px)'; // 毛玻璃效果

        }
        // 头图替换
        const schoolBanner = document.querySelector('.banner > img:nth-child(1)');
        if (schoolBanner) {
            console.log("I原：换一个好看的新头图～")
            schoolBanner.src = 'https://s2.loli.net/2023/12/02/xmoMs1Xytekniwc.png';
        }
        else{
            console.log("I原：咦？没有找到学校头图诶。不管它了，继续～")
        }

        // 替换logo
        const mainLogo = document.querySelector('#main-logo > img:nth-child(1)');
        if (mainLogo) {
            console.log("I原：换一个好看的新logo～")
            mainLogo.src = 'https://upload.wikimedia.org/wikipedia/commons/3/34/Genshin_Chinese_logo.svg';
            mainLogo.style.width = '85px'; // 调整图像宽度
            mainLogo.style.height = 'auto'; // 自动调整高度以保持比例
        }
        else{
            console.log("I原：咦？没有找到学校logo诶。不管它了，继续～")
        }

        // 去除header白色背景
        const header = document.getElementById('header')
        if (header) {
            header.style.backgroundColor = 'transparent';
            var mainLogoContainer = header.querySelector('.main-logo-container');
            if (mainLogoContainer) {
                mainLogoContainer.style.backgroundColor = 'rgba(200, 200, 200, 0.4)';
                mainLogoContainer.style.backdropFilter = 'blur(5px)';
            }
        }

        console.log("I原：墙面装修完成～进行一个原神背景的插入～")
        // 添加背景视频
        var video = document.createElement('video');
        video.poster = 'https://ys.mihoyo.com/main/_nuxt/img/47f71d4.jpg';
        video.src = 'https://ys.mihoyo.com/main/_nuxt/videos/3e78e80.mp4';
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.style.position = 'fixed';
        video.style.top = '0';
        video.style.left = '0';
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover';
        video.style.zIndex = '-1';

        document.body.appendChild(video);
        console.log("I原：搞定！")
    }
    else{
        console.log("I原：不替换");
    }

})();