// ==UserScript==
// @name         dgq63136.cn斗鱼冬瓜强烂梗收集
// @namespace    http://tampermonkey.net/
// @version      2025.07.016.01
// @description  在斗鱼直播间 63136 添加一个按钮,提供在线搜索，复制和一键发送
// @author       Hzm
// @match        https://www.douyu.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511991/dgq63136cn%E6%96%97%E9%B1%BC%E5%86%AC%E7%93%9C%E5%BC%BA%E7%83%82%E6%A2%97%E6%94%B6%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/511991/dgq63136cn%E6%96%97%E9%B1%BC%E5%86%AC%E7%93%9C%E5%BC%BA%E7%83%82%E6%A2%97%E6%94%B6%E9%9B%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加 CSS 样式
    function addStyles(css) {
        let styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.innerHTML = css;
        document.head.appendChild(styleElement);
    }

    const css = `
        #messageBox {
            font-size: 16px;
            position: fixed;
            top: 50px;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #64ce83;
            color: white;
            padding: 10px;
            border-radius: 5px;
            z-index: 2000;
            transition: all 0.3s ease;
        }
        .image-button {
            width: 50px;
            height: 50px;
            background-size: cover;
            margin: 5px;
        }
        .custom-button {
            font-size: 16px;
            padding: 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin-right: 10px; /* 添加边距 */
        }
    `;

    addStyles(css);

    // 创建并设置元素样式
    function createElement(tag, styles, textContent) {
        let element = document.createElement(tag);
        Object.assign(element.style, styles);
        if (textContent) {
            element.innerText = textContent;
        }
        return element;
    }

    // 创建按钮
    let button = createElement("button", {
        fontSize: "16px",
        width:"42px",
        height:"52px",
        position: "absolute",
        zIndex:1000,
        color: "white",
        border: "none",
        right:"280px",
        bottom:"30px",
        borderRadius: "5px",
        marginRight: "44px",
        cursor: "pointer"
    }, "");
    //     searchContainer.appendChild(button);

    // 创建 SVG 图标
    let svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgIcon.setAttribute("t", "1728476138344");
    svgIcon.setAttribute("class", "icon");
    svgIcon.setAttribute("viewBox", "0 0 1080 1024");
    svgIcon.setAttribute("version", "1.1");
    svgIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svgIcon.setAttribute("p-id", "5091");
    svgIcon.setAttribute("width", "42");
    svgIcon.setAttribute("height", "52");

    // 创建路径
    let path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path1.setAttribute("d", "M693.1 238.8s84.2-56.7 115.3-72.7 133.4-55.6 133.4-55.6v637.4S835.6 796 808.4 809.8c-35 17.9-115.3 64.9-115.3 64.9-54.2 32-164.8 57.3-288.4 57.3C226.5 932 82 886.7 82 830.8v3.6-641h645.4");
    path1.setAttribute("fill", "#FFFFFF");
    path1.setAttribute("p-id", "4508");

    let path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path2.setAttribute("d", "M404.8 950.3c-88 0-171-10.8-233.7-30.5C106.6 899.6 70 872 64.4 839.6c-0.5-1.7-0.8-3.4-0.8-5.3v-641c0-10.2 8.3-18.5 18.5-18.5h645.4V194c25.7-16.7 56-35.8 72.5-44.3 31.6-16.3 131-54.8 135.2-56.4 5.7-2.2 12.1-1.5 17.1 2 5 3.4 8 9.1 8 15.2v637.4c0 7.3-4.2 13.8-10.9 16.8-1.1 0.5-106.2 48.1-132.6 61.5-34.1 17.4-113.6 63.9-114.4 64.4-61.5 36.3-178.3 59.7-297.6 59.7zM100.6 830.7c0 13.1 21.4 35.1 81.6 53.9 59.2 18.6 138.3 28.8 222.6 28.8 128.7 0 232.8-27.5 279-54.7 3.3-2 81.2-47.5 116.3-65.4 22.3-11.4 95.4-44.7 123.3-57.4V137.5c-32.1 12.7-86 34.4-106.5 44.9-29.8 15.4-112.7 71.1-113.5 71.6l-20.6-30.7c0.9-0.6 7.6-5.1 17.5-11.7H100.6v619.1z");
    path2.setAttribute("fill", "#232323");
    path2.setAttribute("p-id", "4509");

    let path3 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path3.setAttribute("d", "M693.1 238.8s84.2-56.7 115.3-72.7 133.4-55.6 133.4-55.6v637.4S835.6 796 808.4 809.8c-35 17.9-115.3 64.9-115.3 64.9-54.2 32-164.8 57.3-288.4 57.3C226.5 932 82 886.7 82 830.8v3.6-641h645.4");
    path3.setAttribute("fill", "#FFFFFF");
    path3.setAttribute("p-id", "4510");

    let path4 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path4.setAttribute("d", "M404.8 950.3c-88 0-171-10.8-233.7-30.5C106.6 899.6 70 872 64.4 839.6c-0.5-1.7-0.8-3.4-0.8-5.3v-641c0-10.2 8.3-18.5 18.5-18.5h645.4V194c25.7-16.7 56-35.8 72.5-44.3 31.6-16.3 131-54.8 135.2-56.4 5.7-2.2 12.1-1.5 17.1 2 5 3.4 8 9.1 8 15.2v637.4c0 7.3-4.2 13.8-10.9 16.8-1.1 0.5-106.2 48.1-132.6 61.5-34.1 17.4-113.6 63.9-114.4 64.4-61.5 36.3-178.3 59.7-297.6 59.7zM100.6 830.7c0 13.1 21.4 35.1 81.6 53.9 59.2 18.6 138.3 28.8 222.6 28.8 128.7 0 232.8-27.5 279-54.7 3.3-2 81.2-47.5 116.3-65.4 22.3-11.4 95.4-44.7 123.3-57.4V137.5c-32.1 12.7-86 34.4-106.5 44.9-29.8 15.4-112.7 71.1-113.5 71.6l-20.6-30.7c0.9-0.6 7.6-5.1 17.5-11.7H100.6v619.1z");
    path4.setAttribute("fill", "#232323");
    path4.setAttribute("p-id", "4511");

    let path5 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path5.setAttribute("d", "M298.1 915.2h-29.6v-29.6h29.6v29.6z m0-59.1h-29.6v-29.6h29.6v29.6z m0-59.1h-29.6v-29.6h29.6V797z m0-59.1h-29.6v-29.6h29.6v29.6z m0-59.1h-29.6v-29.6h29.6v29.6z m0-59.2h-29.6V590h29.6v29.6z m0-59.1h-29.6V531h29.6v29.5z m0-59.1h-29.6v-29.6h29.6v29.6z m0-59.1h-29.6v-29.6h29.6v29.6z m0-59.1h-29.6v-29.6h29.6v29.6z m0-59.1h-29.6v-29.6h29.6v29.6z");
    path5.setAttribute("fill", "#232323");
    path5.setAttribute("p-id", "4512");

    let path6 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path6.setAttribute("d", "M136.8 261v617l-47.9-23.4-6.8-621.9 27.4 13.5z");
    path6.setAttribute("fill", "#D0D9DE");
    path6.setAttribute("p-id", "4513");

    let path7 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path7.setAttribute("d", "M404.8 950.3c-88 0-171-10.8-233.7-30.5C106.6 899.6 70 872 64.4 839.6c-0.5-1.7-0.8-3.4-0.8-5.3v-641c0-10.2 8.3-18.5 18.5-18.5h645.4V194c25.7-16.7 56-35.8 72.5-44.3 31.6-16.3 131-54.8 135.2-56.4 5.7-2.2 12.1-1.5 17.1 2 5 3.4 8 9.1 8 15.2v637.4c0 7.3-4.2 13.8-10.9 16.8-1.1 0.5-106.2 48.1-132.6 61.5-34.1 17.4-113.6 63.9-114.4 64.4-61.5 36.3-178.3 59.7-297.6 59.7zM100.6 830.7c0 13.1 21.4 35.1 81.6 53.9 59.2 18.6 138.3 28.8 222.6 28.8 128.7 0 232.8-27.5 279-54.7 3.3-2 81.2-47.5 116.3-65.4 22.3-11.4 95.4-44.7 123.3-57.4V137.5c-32.1 12.7-86 34.4-106.5 44.9-29.8 15.4-112.7 71.1-113.5 71.6l-20.6-30.7c0.9-0.6 7.6-5.1 17.5-11.7H100.6v619.1z");
    path7.setAttribute("fill", "#232323");
    path7.setAttribute("p-id", "4514");

    let path8 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path8.setAttribute("d", "M82.1 193.3a322.7 101.2 0 1 0 645.4 0 322.7 101.2 0 1 0-645.4 0Z");
    path8.setAttribute("fill", "#FFFFFF");
    path8.setAttribute("p-id", "4515");

    let path9 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path9.setAttribute("d", "M404.8 313c-88 0-171-10.8-233.7-30.5-70.3-22-107.5-52.9-107.5-89.2s37.2-67.1 107.5-89.2c62.7-19.7 145.7-30.5 233.7-30.5s171 10.8 233.7 30.5c70.3 22 107.5 52.9 107.5 89.2s-37.2 67.1-107.5 89.2C575.8 302.2 492.8 313 404.8 313z m0-202.4c-84.4 0-163.4 10.2-222.6 28.8-60.2 18.9-81.6 40.9-81.6 53.9 0 13.1 21.4 35.1 81.6 53.9 59.2 18.6 138.3 28.8 222.6 28.8s163.4-10.2 222.6-28.8c60.2-18.9 81.6-40.9 81.6-53.9 0-13.1-21.4-35.1-81.6-53.9-59.2-18.6-138.2-28.8-222.6-28.8z");
    path9.setAttribute("fill", "#232323");
    path9.setAttribute("p-id", "4516");

    let path10 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path10.setAttribute("d", "M307 193.3a97.8 30.7 0 1 0 195.6 0 97.8 30.7 0 1 0-195.6 0Z");
    path10.setAttribute("fill", "#EDF4FC");
    path10.setAttribute("p-id", "4517");

    let path11 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path11.setAttribute("d", "M404.8 242.5c-53.6 0-116.2-12.9-116.2-49.1s62.6-49.1 116.2-49.1 116.2 12.8 116.2 49-62.6 49.2-116.2 49.2z m-74.3-49.2c11.5 5.5 37.3 12.2 74.3 12.2s62.9-6.7 74.3-12.2c-11.5-5.5-37.3-12.2-74.3-12.2s-62.9 6.7-74.3 12.2z");
    path11.setAttribute("fill", "#232323");
    path11.setAttribute("p-id", "4518");

    // 将路径添加到 SVG 图标中
    svgIcon.appendChild(path1);
    svgIcon.appendChild(path2);
    svgIcon.appendChild(path3);
    svgIcon.appendChild(path4);
    svgIcon.appendChild(path5);
    svgIcon.appendChild(path6);
    svgIcon.appendChild(path7);
    svgIcon.appendChild(path8);
    svgIcon.appendChild(path9);
    svgIcon.appendChild(path10);
    svgIcon.appendChild(path11);

    // 将 SVG 图标添加到按钮中
    button.appendChild(svgIcon);



    // 等待页面加载完成，插入按钮到 .ChatToolBar__right 左侧
    function insertButton() {
        let toolbar = document.querySelector('.layout-Player');
        if (toolbar) {
            console.log("111111111111111111111111111");
            toolbar.insertBefore(button, toolbar.firstChild); // 将按钮插入到第一个子元素前
        } else {
            setTimeout(insertButton, 100); // 如果未找到，延时再尝试
        }
    }

    insertButton();

    // 创建搜索表格容器
    let tableContainer = createElement("div", {
        fontSize: "16px",
        borderRadius: "10px", // 添加圆角
        display: "none",
        position: "fixed",
        width: "400px",
        top: "450px",
        right: "20px",
        zIndex: 1001,
        backgroundColor: "#f0f0f0",
        border: "1px solid #ccc",
        maxHeight: "400px",
        overflowY: "auto"
    });
    document.body.appendChild(tableContainer);

    // 搜索框容器
    let searchContainer = createElement("div", {
        fontSize: "16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height:"80px",
    });
    tableContainer.appendChild(searchContainer);

    // 搜索框
    let searchInput = createElement("input", {
        fontSize: "16px",
        width:"330px",
        flex: "1",
        zIndex:"5",
        padding: "0px",
        position: "fixed",
        boxSizing: "border-box",
        marginRight: "10px",
        marginTop: "30px",
        marginLeft: "5px"
    }, null);
    searchInput.type = "text";
    searchInput.placeholder = "  搜索弹幕...  在此复制次数不加";
    searchContainer.appendChild(searchInput);

    // 搜索按钮
    let searchButton = createElement("button", {
        fontSize: "13px",
        zIndex:"5",
        padding: "5px 10px",
        height:"30px",
        position: "fixed",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "5px",
        marginLeft:"345px",
        marginTop:"30px",
        cursor: "pointer"
    }, "搜索");
    searchContainer.appendChild(searchButton);

    { // home按钮
        let svgButton = createElement("button", {
            width: "32px",
            height: "32px",
            fontSize: "13px",
            position: "fixed",
            zIndex:"5",
            padding: "5px",
            backgroundColor: "transparent",
            color: "white",
            border: "none",
            marginBottom: "45px",
            marginLeft: "10px",
            borderRadius: "5px",
            cursor: "pointer"
        }, "");
        searchContainer.appendChild(svgButton);

        // 创建 SVG 图标
        let svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgIcon.setAttribute("t", "1728366472699");
        svgIcon.setAttribute("class", "icon");
        svgIcon.setAttribute("viewBox", "0 0 1080 1024");
        svgIcon.setAttribute("version", "1.1");
        svgIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svgIcon.setAttribute("p-id", "7286");
        svgIcon.setAttribute("width", "27");
        svgIcon.setAttribute("height", "27");

        // 创建路径
        let path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path1.setAttribute("d", "M1077.361778 507.050667L922.794667 369.208889V163.441778h-120.035556v98.702222l-88.689778-79.132444L542.606222 38.001778 371.143111 183.011556 183.580444 350.321778 7.793778 507.050667l73.500444 90.453333L183.580444 506.311111l182.158223-162.588444L542.606222 186.026667l176.753778 157.752889L901.688889 506.311111l102.229333 91.192889z");
        path1.setAttribute("fill", "#389f25");
        path1.setAttribute("p-id", "7287");

        let path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path2.setAttribute("d", "M544.824889 244.906667L368.071111 402.659556 185.856 565.248v386.275556c0 10.410667 4.949333 18.830222 11.150222 18.830222h273.237334v-257.706667h149.219555v257.706667h273.237333c6.144 0 11.150222-8.476444 11.150223-18.887111v-386.275556l-182.158223-162.531555-176.867555-157.752889z");
        path2.setAttribute("fill", "#389f25");
        path2.setAttribute("p-id", "7288");

        // 将路径添加到 SVG 图标中
        svgIcon.appendChild(path1);
        svgIcon.appendChild(path2);

        // 将 SVG 图标添加到按钮中
        svgButton.appendChild(svgIcon);

        // 绑定点击事件
        svgButton.addEventListener("click", function() {
            window.open("https://cdn.hguofichp.cn/zfb.jpg", '_blank'); // 在新窗口中打开链接
        });
    }
    { // power按钮
        let powerButton = createElement("button", {
            width: "32px",
            height: "32px",
            fontSize: "13px",
            zIndex:"5",
            position: "fixed",
            padding: "5px",
            backgroundColor: "transparent",
            color: "white",
            border: "none",
            marginBottom: "45px",
            marginLeft: "50px",
            borderRadius: "5px",
            cursor: "pointer"
        }, "");
        searchContainer.appendChild(powerButton);

        // 创建 SVG 图标
        let svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgIcon.setAttribute("t", "1728366887035");
        svgIcon.setAttribute("class", "icon");
        svgIcon.setAttribute("viewBox", "0 0 1024 1024");
        svgIcon.setAttribute("version", "1.1");
        svgIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svgIcon.setAttribute("p-id", "9769");
        svgIcon.setAttribute("width", "27");
        svgIcon.setAttribute("height", "27");

        // 创建路径
        let path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path1.setAttribute("d", "M395.765333 586.570667h-171.733333c-22.421333 0-37.888-22.442667-29.909333-43.381334L364.768 95.274667A32 32 0 0 1 394.666667 74.666667h287.957333c22.72 0 38.208 23.018667 29.632 44.064l-99.36 243.882666h187.050667c27.509333 0 42.186667 32.426667 24.042666 53.098667l-458.602666 522.56c-22.293333 25.408-63.626667 3.392-54.976-29.28l85.354666-322.421333z");
        path1.setAttribute("fill", "#1296db");
        path1.setAttribute("p-id", "9770");


        svgIcon.appendChild(path1);


        // 将 SVG 图标添加到按钮中
        powerButton.appendChild(svgIcon);

        // 绑定点击事件
        powerButton.addEventListener("click", function() {
            window.open("https://cdn.hguofichp.cn/zfb.jpg", '_blank'); // 在新窗口中打开链接
        });
    }

    { // 问题按钮
        let powerButton = createElement("button", {
            width: "32px",
            height: "32px",
            fontSize: "13px",
            zIndex:"5",
            position: "fixed",
            padding: "5px",
            backgroundColor: "transparent",
            color: "white",
            border: "none",
            marginBottom: "45px",
            marginLeft: "90px",
            borderRadius: "5px",
            cursor: "pointer"
        }, "");
        searchContainer.appendChild(powerButton);

        // 创建 SVG 图标
        let svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgIcon.setAttribute("t", "1728367594482");
        svgIcon.setAttribute("class", "icon");
        svgIcon.setAttribute("viewBox", "0 0 1024 1024");
        svgIcon.setAttribute("version", "1.1");
        svgIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svgIcon.setAttribute("p-id", "13015");
        svgIcon.setAttribute("width", "27");
        svgIcon.setAttribute("height", "27");

        // 创建路径
        let path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path1.setAttribute("d", "M517.119 954.878c244.589 0 442.879-198.289 442.879-442.879 0-244.594-198.289-442.879-442.879-442.879C272.524 69.12 74.24 267.404 74.24 511.999 74.24 756.588 272.524 954.878 517.119 954.878L517.119 954.878zM517.119 891.608c-209.654 0-379.612-169.955-379.612-379.609s169.957-379.612 379.612-379.612 379.609 169.957 379.609 379.612S726.773 891.608 517.119 891.608L517.119 891.608zM523.949 243.992c-54.662 0-97.177 16.705-127.547 50.112-30.367 31.885-44.795 74.402-44.795 127.547l59.98 0c0-37.202 8.35-66.052 25.055-87.31 18.222-25.055 46.312-37.202 84.272-37.202 31.885 0 56.945 8.352 74.405 26.572 16.705 16.702 25.81 40.24 25.81 70.607 0 21.26-7.59 41-22.775 59.98-4.55 6.072-13.665 15.185-25.81 27.33-41 36.445-66.055 65.295-76.685 88.075-9.11 18.98-13.665 40.995-13.665 66.05l0 17.465 60.735 0 0-17.465c0-20.5 4.56-38.725 14.43-55.425 7.59-13.665 18.98-27.335 35.68-41.755 33.405-29.612 53.91-49.352 61.5-58.462 18.98-25.055 28.85-54.665 28.85-88.83 0-45.552-14.425-81.235-42.515-107.05C611.258 256.902 572.544 243.992 523.949 243.992L523.949 243.992zM512.564 706.363c-12.907 0-23.535 3.795-32.647 12.905-9.11 8.345-12.905 18.98-12.905 31.885s3.795 23.54 12.905 32.65c9.112 8.345 19.74 12.905 32.647 12.905 12.91 0 23.535-4.56 32.645-12.905 9.11-8.355 13.665-18.985 13.665-32.65 0-12.905-4.555-23.54-12.905-31.885C536.859 710.158 525.474 706.363 512.564 706.363L512.564 706.363z");
        path1.setAttribute("fill", "#000001");
        path1.setAttribute("p-id", "13016");


        svgIcon.appendChild(path1);


        // 将 SVG 图标添加到按钮中
        powerButton.appendChild(svgIcon);

        // 绑定点击事件
        powerButton.addEventListener("click", function() {
            window.open("https://www.wjx.cn/vm/rQUgnS0.aspx#", '_blank'); // 在新窗口中打开链接
        });
    }


    { // 更新按钮
        let updateButton = createElement("button", {
            width: "32px",
            zIndex:"5",
            height: "32px",
            fontSize: "13px",
            position: "fixed",
            padding: "5px",
            backgroundColor: "transparent",
            color: "white",
            border: "none",
            marginBottom: "45px",
            marginLeft: "130px",
            borderRadius: "5px",
            cursor: "pointer"
        }, "");
        searchContainer.appendChild(updateButton);

        // 创建 SVG 图标
        let svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgIcon.setAttribute("t", "1728372163273");
        svgIcon.setAttribute("class", "icon");
        svgIcon.setAttribute("viewBox", "0 0 1024 1024");
        svgIcon.setAttribute("version", "1.1");
        svgIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svgIcon.setAttribute("p-id", "14109");
        svgIcon.setAttribute("width", "27");
        svgIcon.setAttribute("height", "27");

        // 创建路径
        let path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path1.setAttribute("d", "M705.536 328.544c-314.56-271.744-641.056 51.2-641.056 51.2 352-603.84 772.192-160 772.192-160l121.92-115.52v407.104H554.272zM318.912 695.008c314.496 271.648 641.056-51.2 641.056-51.2-352 603.808-772.192 160-772.192 160L64 919.392V548.704h406.208z");
        path1.setAttribute("fill", "#0590DF");
        path1.setAttribute("p-id", "14110");


        svgIcon.appendChild(path1);


        // 将 SVG 图标添加到按钮中
        updateButton.appendChild(svgIcon);

        // 绑定点击事件
        updateButton.addEventListener("click", function() {
            window.open("https://greasyfork.org/zh-CN/scripts/511991-dgq63136-icu%E6%96%97%E9%B1%BC%E7%8E%A9%E6%9C%BA%E5%99%A8%E7%83%82%E6%A2%97%E6%94%B6%E9%9B%86", '_blank'); // 在新窗口中打开链接
        });
    }

    { // 关闭按钮
        let XButton = createElement("button", {
            width: "32px",
            zIndex:"5",
            height: "32px",
            fontSize: "13px",
            position: "fixed",
            padding: "5px",
            backgroundColor: "transparent",
            color: "black",
            border: "none",
            marginBottom: "45px",
            marginLeft: "370px",
            borderRadius: "5px",
            cursor: "pointer"
        }, "X");
        searchContainer.appendChild(XButton);
        // 按钮点击事件，显示/隐藏搜索框
        XButton.addEventListener("click", function() {
            if (tableContainer.style.display === "none" || tableContainer.style.display === "") {
                tableContainer.style.display = "block";
                table.style.display = "none";  // 默认隐藏表格
            } else {
                tableContainer.style.display = "none";
            }
        });
    }
    {//蒙蔽罩
        let zhanweiButton = createElement("button", {
            width: "400px",
            height: "80px",
            fontSize: "29px",
            position: "fixed",
            zIndex:"4",
            padding: "5px",
            backgroundColor: "#eaf3c6",
            color: "white",
            border: "none",
            borderRadius: "7px 7px 0px 0px",
            cursor: "Default"
        }, "");
        searchContainer.appendChild(zhanweiButton);
    }



    // 创建表格
    let table = createElement("table", {
        fontSize: "16px",
        width: "100%",
        borderCollapse: "collapse"
    });
    tableContainer.appendChild(table);

    // 存储数据的哈希表
    let dataHash = {};

    // 请求后端数据（使用 fetch）
    function fetchDataFromServer(searchQuery) {
        fetch("https://hguofichp.cn:10086/dgq/Query", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                D: "油猴",
                barrage: searchQuery  // 传递搜索的查询条件
            })
        })
            .then(response => response.json())
            .then(res => {
            if (res.code === 200) {
                buildDataHash(res.data); // 构建哈希表并存储数据
            } else {
                console.error("请求失败，返回错误码:", res.msg);
            }
        })
            .catch(error => {
            console.error("请求失败:", error);
        });
    }

    // 构建哈希表
    function buildDataHash(data) {
        dataHash = {}; // 清空哈希表
        data.forEach(item => {
            let lowerCaseBarrage = item.barrage.toLowerCase();
            if (!dataHash[lowerCaseBarrage]) {
                dataHash[lowerCaseBarrage] = [];
            }
            dataHash[lowerCaseBarrage].push(item);
        });
        renderTable(Object.values(dataHash).flat()); // 渲染表格数据
    }

    // 渲染表格数据
    function renderTable(data) {
        table.innerHTML = ""; // 清空表格
        if (data.length === 0) {
            table.style.display = "none";  // 如果没有数据，隐藏表格
        } else {
            table.style.display = "table";  // 如果有数据，显示表格
            data.forEach((item, index) => {
                let row = createElement("tr", {
                    backgroundColor: index % 2 === 0 ? "#f2f2f2" : "#ffffff"
                }, null);

                let barrageCell = createElement("td", {
                    cursor: "pointer",
                    padding: "5px",
                    width: "60%"
                }, item.barrage);
                barrageCell.addEventListener("click", function() {
                    copyToClipboard(item.barrage);
                });
                row.appendChild(barrageCell);

                let copyButtonCell = createElement("td", {
                    width: "8%"
                }, null);
                let copyButton = createElement("button", {
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                }, "复制");
                copyButton.addEventListener("click", function() {
                    copyToClipboard(item.barrage);
                });
                copyButtonCell.appendChild(copyButton);
                row.appendChild(copyButtonCell);

                // 一键发送按钮
                let sendButtonCell = createElement("td", {
                    width: "10%"
                }, null);
                let sendButton = createElement("button", {
                    backgroundColor: "#FF5722",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                }, "一键发送");
                sendButton.addEventListener("click", function() {
                    sendBarrage(item.barrage);  // 调用发送功能
                });
                sendButtonCell.appendChild(sendButton);
                row.appendChild(sendButtonCell);

                table.appendChild(row);
            });
        }
    }

    // 搜索功能
    function performSearch() {
        let searchQuery = searchInput.value.toLowerCase();
        if (!searchQuery) {
            table.style.display = "none";  // 如果搜索框为空，不显示表格
            return;
        }
        fetchDataFromServer(searchQuery);  // 调用 fetchDataFromServer 获取数据
    }

    // 监听搜索按钮点击事件
    searchButton.addEventListener("click", performSearch);

    // 监听回车键事件
    searchInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            performSearch();
        }
    });

    // 显示消息
    function showMessage(text, duration = 2000) {
        let messageBox = document.createElement("div");
        messageBox.id = "messageBox";
        messageBox.innerText = text;

        document.body.appendChild(messageBox);

        setTimeout(() => {
            messageBox.style.opacity = "0";
            setTimeout(() => {
                document.body.removeChild(messageBox);
            }, 300); // 等待过渡动画完成后再移除元素
        }, duration);
    }

    // 按钮点击事件，显示/隐藏搜索框
    button.addEventListener("click", function() {
        if (tableContainer.style.display === "none" || tableContainer.style.display === "") {
            tableContainer.style.display = "block";
            table.style.display = "none";  // 默认隐藏表格
        } else {
            tableContainer.style.display = "none";
        }
    });



    let isDragging = false;
    let offsetX, offsetY;

    tableContainer.addEventListener('mousedown', function(e) {
        isDragging = true;
        offsetX = e.clientX - tableContainer.getBoundingClientRect().left;
        offsetY = e.clientY - tableContainer.getBoundingClientRect().top;
        tableContainer.style.cursor = "grabbing";
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            let left = e.clientX - offsetX;
            let top = e.clientY - offsetY;
            tableContainer.style.left = left + 'px';
            tableContainer.style.top = top + 'px';
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
        tableContainer.style.cursor = "move";
    });

    // 复制到剪贴板
    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            showMessage("✔️✔️复制成功: ✔️✔️");
        } catch (error) {
            showMessage("❌❌复制失败，请尝试手动复制。❌❌");
        }
    }


    // 用于控制发送按钮冷却时间的变量
    let sendButtonCooldown = false;

    // 发送弹幕到 <textarea> 并点击发送按钮
    function sendBarrage(barrageText) {
        // 如果按钮处于冷却状态，则直接返回
        if (sendButtonCooldown) {
            showMessage("❌❌不许刷屏！😡❌❌");
            return;
        }

        sendButtonCooldown = true;  // 设置按钮为冷却状态

        // 找到 textarea 并填入内容
        let textArea = document.querySelector('textarea.ChatSend-txt');
        if (textArea) {
            textArea.value = barrageText;  // 填入弹幕内容

            // 找到发送按钮并模拟点击
            let sendButton = document.querySelector('div.ChatSend-button');
            if (sendButton) {
                sendButton.click();  // 模拟点击发送按钮
                showMessage("✔️✔️弹幕发送成功✔️✔️");
            } else {
                showMessage("❌❌发送失败，请尝试手动复制。❌❌");
            }
        } else {
            showMessage("❌❌发送失败，请尝试手动复制。❌❌");
        }

        // 启动定时器，在5秒后解除冷却状态
        setTimeout(() => {
            sendButtonCooldown = false;
        }, 10000);
    }
})();