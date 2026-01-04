// ==UserScript==
// @name         VIP图片查看
// @namespace    http://tampermonkey.net/
// @version      2025-01-19
// @description  try to take over the world!
// @author       You
// @match        *://*.ootaotu.com/*
// @match        *://*.xstuji.com/*
// @require      https://lib.baomitu.com/jquery/2.2.4/jquery.min.js
// @icon         https://wx3.sinaimg.cn/orj360/00874gKJgy1hy0ac5vkzgj32s0460hdt.jpg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525237/VIP%E5%9B%BE%E7%89%87%E6%9F%A5%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/525237/VIP%E5%9B%BE%E7%89%87%E6%9F%A5%E7%9C%8B.meta.js
// ==/UserScript==
(function () {
    'VIP图片查看';

    function appendImages() {
        const scotDiv = document.querySelector('.scot');
        if (scotDiv) {
            // 获取最后一个 a 元素
            const lastA = scotDiv.lastElementChild;
            const firstA = scotDiv.firstElementChild;
            if (firstA) {
                var lastImg = firstA.querySelector('img');
                if (lastImg) {
                    var lastUrl = lastImg.src;
                    // 提取图片 URL 中的数字部分
                    console.log(lastUrl)
                    const parts = lastUrl.match(/(\d+)\.jpg$/);
                    if (parts && parts[1]) {
                        scotDiv.innerHTML = '';
                        var lastId = parseInt(parts[1]);
                        //lastId = 1;
                        const num = getTotalImageCount();

                        for (let i = 1; i <= num; i++) {
                            const newId = lastId + i;
                            // 生成新的图片 URL
                            const newUrl = lastUrl.replace(/(\d+)\.jpg$/, newId + '.jpg');
                            const newA = document.createElement('a');
                            newA.href = newUrl;
                            const newImg = document.createElement('img');
                            newImg.classList.add('lazy');
                            newImg.dataset.original = newUrl;
                            newImg.src = newUrl;
                            newImg.style.display = 'inline';
                            newA.appendChild(newImg);
                            scotDiv.appendChild(newA);
                        }
                        addLinkToSfnav(num + '张图片加载成功');
                    } else {
                        addLinkToSfnav('无法提取图片地址中的数字部分');
                    }
                } else {
                    addLinkToSfnav('未找到 img 元素');
                }
            } else {
                addLinkToSfnav('未找到 a 元素');
            }
        } else {
            addLinkToSfnav('未找到 div.scot 元素');
        }
    }

    function checkIfLoaded() {
        const images = document.querySelectorAll('div.scot img');
        let allLoaded = true;
        for (let i = 0; i < images.length; i++) {
            if (!images[i].complete) {
                allLoaded = false;
                break;
            }
        }
        if (allLoaded) {
            appendImages();
        } else {
            // 继续检查
            setTimeout(checkIfLoaded, 100);
        }
    }

    function addLinkToSfnav(msg) {
        const sfnavDiv = document.querySelector('.sfnav');
        if (sfnavDiv) {
            const newLink = document.createElement('a');
            newLink.href = "/#";

            const icon = document.createElement('i');
            icon.classList.add('fa', 'fa-diamond');
            newLink.appendChild(icon);

            const textNode = document.createTextNode(msg);
            newLink.appendChild(textNode);

            sfnavDiv.appendChild(newLink);
        } else {
            console.error('未找到 div.sfnav 元素');
        }
    }
    function hidediv(classname){
        const cs = document.querySelector('.' + classname);
        if(cs){cs.style.display = 'none';}
    }
    function getTotalImageCount() {
        const spDiv = document.querySelector('.sp');
        if (spDiv) {
            spDiv.style.display = 'none';
            const iElements = spDiv.querySelectorAll('.i1');
            if (iElements.length > 0) {
                const firstIElement = iElements[0];
                const text = firstIElement.textContent.trim();
                const number = parseInt(text);
                if (!isNaN(number)) {
                    console.log('全本完整作品的图片总数:', number);
                    return number;
                }
            }
        }
        console.error('未找到包含图片数量的元素或数字解析失败');
        return null;
    }
    hidediv('gaoliang');


    window.onload = function () {
        checkIfLoaded();
        hidediv('gaoliang');
        //getTotalImageCount();
        //addLinkToSfnav();
    };

})();