// ==UserScript==
// @license      MIT
// @name         屏蔽芊芊经典广告拦截框架
// @namespace    http://tampermonkey.net/
// @version      0.6.6
// @description  芊芊经典广告被拦截后会弹出一个框架，屏蔽的框架。屏蔽简书广告
// @author       Tenfond
// @match        http*://myqqjd.com/*
// @match        http*://www.jianshu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435931/%E5%B1%8F%E8%94%BD%E8%8A%8A%E8%8A%8A%E7%BB%8F%E5%85%B8%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA%E6%A1%86%E6%9E%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/435931/%E5%B1%8F%E8%94%BD%E8%8A%8A%E8%8A%8A%E7%BB%8F%E5%85%B8%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA%E6%A1%86%E6%9E%B6.meta.js
// ==/UserScript==

(() => {
    'use strict';
    let NoBlurStyle = document.createElement("style");
    NoBlurStyle.innerHTML = "" +
        "body > *:not(#wpadminbar):not(.afsuo-cagwq-modal):not(.afsuo-cagwq-wrapper):not(.afsuo-cagwq-blackout) {\n" +
        "    -webkit-filter: blur(0px) !important;\n" +
        "    filter: blur(0px) !important;\n" +
        "    pointer-events: auto !important;\n" +        // 允许元素标签触发事件
        "}\n" +
        "ins.adsbygoogle,ins.adsbygoogle * {\n" +
        "    display: none !important;\n" +
        "    width: 0px !important;\n" +
        "    height: 0px !important;\n" +
        "    max-width: 0px !important;\n" +
        "    max-height: 0px !important;\n" +
        "}\n" +
        "aside[id^=advert],section[aria-label$=-ad] {\n" +    // 第二个是简书的广告
        "    display: none !important;\n" +
        "    height: 0 !important;\n" +
        "    width: 0 !important;\n" +
        "    max-width: 0px !important;\n" +
        "    max-height: 0px !important;\n" +
        "}\n" +
        ".search-wrap.wow.fadeInDown.animated {\n" +
        "    position: fixed; !important;\n" +
        "    margin: auto !important;\n" +
        "}\n" +
        "div#login {\n" +
        "    position: fixed !important;\n" +
        "    transform: translateX(-50%) !important;\n" +
        "    top: 100px; !important;\n" +
        "    left: 50% !important;\n" +
        "    margin: 0 !important;\n" +
        "}\n" +
        "div.search-wrap {\n" +
        "    position: fixed !important;\n" +
        "    transform: translateX(-50%) !important;\n" +
        "    top: 100px; !important;\n" +
        "    left: 50% !important;\n" +
        "    margin: 0 !important;\n" +
        "    width: 80% !important;\n" +
        "    max-width: 500px !important;\n" +
        "}";
    document.head.insertBefore(NoBlurStyle, document.head.firstChild);

    // 让事件触发，以下代码似乎没有效果
    document.oncontextmenu = event => {
        // 开启右键
        event.returnValue = true;
    }

    document.onselectstart = event => {
        // 开启选中文字
        event.returnValue = true;
    }

    document.ondragstart = event => {
        // 允许拖拽图片
        event.returnValue = true;
    }

    document.oncopy = event => {
        // 允许复制
        event.returnValue = true;
    }

    doElement("aside[id^=advert]", ADaside => {
        for (let i = 0; i < ADaside.length; i++) {
            ADaside[i].style = "display: none; height: 0; width: 0;";
        }
    }, 5000);
    doElement("body>div[class$=-wrapper]", wrapper => {
        console.log("检测到了wapper")
        let displayClassNameFirst = wrapper.className.match(/([\w-]+)-wrapper/)[1];
        doElement("body>div." + displayClassNameFirst + "-blackout.active,body>div." + displayClassNameFirst + "-modal.active", function (element) {
            wrapper.style = "display: none; height: 0; width: 0; max-height: 0; max-width: 0;";
            element.style = "display: none; height: 0; width: 0; max-height: 0; max-width: 0;";
            document.body.classList.remove(displayClassNameFirst + "-blur");
        });
    }, 5000);
    doElement("div.login-overlay#login-layer", loginDiv => {
        // 登录按钮生效
        doElement("div.nav-set", loginBtn => {
            loginBtn.onclick = () => loginDiv.style.display = "block";
        });
        // 退出登录环境生效
        loginDiv.onclick = () => loginDiv.style.display = "none";
        doElement("div#login", loginView => {
            loginView.onclick = event => event.stopPropagation();
        });
    });

    function doElement(cssString, doFunction, waitMS = 0) {
        let Element = document.querySelector(cssString);
        if (Element && Element.nodeType === 1) {
            doFunction(Element);
            console.log("已为 " + cssString + " 进行了操作");
        } else if (document.readyState !== "complete" || waitMS > 0) {
            console.log("正在查找 " + cssString);
            setTimeout(function () {
                doElement(cssString, doFunction, document.readyState !== "complete" ? waitMS : waitMS - 310);    // TODO 10毫秒约函数执行时间
            }, 300);
        } else {
            console.log("%c未找到 " + cssString, 'color: #f00;');
        }
    }
})();