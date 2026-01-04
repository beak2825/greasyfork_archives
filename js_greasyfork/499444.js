// ==UserScript==
// @name         山东省教师教育网|继续教育培训|国家中小学智慧教育平台|各种网课|
// @namespace    http://www.qlteacher.com
// @version      1.2
// @description  有偿带学，各种网课，详情请加图片中微信
// @author       小鲨鱼
// @match        *://www.qlteacher.com/*
// @match        *://xue-test.ykt.eduyun.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499444/%E5%B1%B1%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E6%95%99%E8%82%B2%E7%BD%91%7C%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%9F%B9%E8%AE%AD%7C%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%7C%E5%90%84%E7%A7%8D%E7%BD%91%E8%AF%BE%7C.user.js
// @updateURL https://update.greasyfork.org/scripts/499444/%E5%B1%B1%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E6%95%99%E8%82%B2%E7%BD%91%7C%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%9F%B9%E8%AE%AD%7C%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%7C%E5%90%84%E7%A7%8D%E7%BD%91%E8%AF%BE%7C.meta.js
// ==/UserScript==

(function() {
    // 创建一个容器来显示图片和文字
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '50%'; // 垂直居中
    container.style.left = '50%'; // 水平居中
    container.style.transform = 'translate(-50%, -50%)'; // 居中偏移
    container.style.backgroundColor = 'white';
    container.style.padding = '20px';
    container.style.border = '1px solid #ccc';
    container.style.zIndex = '9999';

    // 添加图片
    const image = document.createElement('img');
    image.src = 'https://i.postimg.cc/FKSwbZsW/88888888.jpg'; // 替换为您的图片 URL
    image.style.width = '300px';
    container.appendChild(image);

    // 添加文字
    const text = document.createElement('p');
    text.textContent = '有偿带学，各种网课，详情请加图片中微信'; // 替换为您的文字内容
    text.style.fontSize = '16px';
    container.appendChild(text);

    // 添加关闭按钮
    const closeButton = document.createElement('button');
    closeButton.textContent = '关闭';
    closeButton.addEventListener('click', () => {
        container.style.display = 'none';
    });
    container.appendChild(closeButton);

    // 将容器添加到页面
    document.body.appendChild(container);
})();
