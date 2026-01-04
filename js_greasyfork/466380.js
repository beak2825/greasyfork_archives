// ==UserScript==
// @name         amazon export img
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  amazon导出产品详情图片
// @author       You
// @match        https://www.amazon.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_registerMenuCommand
// @require https://cdn.bootcdn.net/ajax/libs/jszip/3.6.0/jszip.min.js
// @require https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466380/amazon%20export%20img.user.js
// @updateURL https://update.greasyfork.org/scripts/466380/amazon%20export%20img.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getBase64(imgUrl) {
        return new Promise((resolve, reject) => {
            fetch(imgUrl).then(res => res.blob())
                .then(res => {
                let fr = new FileReader();
                fr.onload = function (e) {
                    resolve(e.target.result)
                };
                fr.onerror = function () {
                    console.log('读取错误！')
                    reject('读取错误')
                };
                fr.readAsDataURL(res);//如果是转文字，第二个参数可以使用编码
            }).catch(e => {
                reject(e)
            })
        })
    }


    function exportImg() {
        const bannerBg = document.querySelector('.apm-brand-story-hero img').src;
        console.log('--------------bannerBg------------');
        console.log(bannerBg);

        const bannerDoms = document.querySelectorAll('.apm-brand-story-card img');
        let bannerItemImgs = []
        console.log('--------------bannerItems------------');
        bannerDoms.forEach((el) => {
            bannerItemImgs.push(el.src)
        })
        console.log(bannerItemImgs);

        const heroDoms = document.querySelectorAll('.apm-hero-image img')
        let heroImgs = []
        console.log('--------------heroImg------------');
          heroDoms.forEach((el) => {
            heroImgs.push(el.src)
        })
        console.log(heroImgs);

        const detailDoms = document.querySelectorAll('.celwidget > .aplus-module-wrapper > img')
        let detailImgs = []
        console.log('--------------detailImg------------');
         detailDoms.forEach((el) => {
            detailImgs.push(el.src)
        })
        console.log(detailImgs);


        const stepDoms = document.querySelectorAll('th p img');
        let stepImgs = []
        console.log('--------------stepItems------------');
        stepDoms.forEach((el) => {
           stepImgs.push(el.src)
        })
        console.log(stepImgs);



        const href = window.location.href
        const regex = /\/dp\/(.+?)\/ref/;
        const asin = href.match(regex)[1];

        let imgUrls = []
        imgUrls.push(bannerBg)
        imgUrls = imgUrls.concat(bannerItemImgs)
        imgUrls = imgUrls.concat(heroImgs)
        imgUrls = imgUrls.concat(detailImgs)
        imgUrls = imgUrls.concat(stepImgs)

         console.log(`一共${imgUrls.length}张图`);

        // 创建zip文件对象
        const zip = new JSZip();


       // 使用fetch获取图片数据
        Promise.all(imgUrls.map(url => getBase64(url)))
        .then(responses => {
            console.log(`成功${responses.length}`);
            // 遍历响应结果并将图片数据添加至zip文件对象中
            responses.forEach((response, index) => {
                const imgUrl = imgUrls[index];
                const imgName = imgUrl.substring(imgUrl.lastIndexOf('/') + 1);

                response = response.replace(/^data:image\/(png|jpg|jpeg);base64,/, "")
                zip.file(imgName, response, { base64: true });

            });


            // 生成zip文件并下载
            zip.generateAsync({ type: 'blob', compression: 'STORE' })
                .then(content => {
                saveAs(content, asin + '.zip');
            })
                .catch(e => {
                console.log('生成zip', e)
            });



        })
        .catch(e => {
          console.log(e)
        });

    }


    GM_registerMenuCommand("导出数据", function () {
       exportImg()
    });


})();