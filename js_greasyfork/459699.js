// ==UserScript==
// @name         Analysis For Pacific Of Meituan
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Analysis For Pacific!
// @author       xbf321
// @match        *://*.sankuai.com/*
// @match        https://h5.51ping.com/*
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @connect      sankuai.com
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/459699/Analysis%20For%20Pacific%20Of%20Meituan.user.js
// @updateURL https://update.greasyfork.org/scripts/459699/Analysis%20For%20Pacific%20Of%20Meituan.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const CURRENT_MIS_NAME = 'current-mis-name';
    const DEVICE_ID_KEY = 'device-id';
    const VERSION = GM_info.script.version;

    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    function genderUUID() {
        return (
            S4() +
            S4() +
            "-" +
            S4() +
            "-" +
            S4() +
            "-" +
            S4() +
            "-" +
            S4() +
            S4() +
            S4()
        );
    };

    function getElementLeft(element) {
        let actualLeft = element.offsetLeft;
        let current = element.offsetParent;
        while (current !== null) {
            actualLeft += current.offsetLeft;
            current = current.offsetParent;
        }
        return actualLeft;
    }

    function getElementTop(element) {
        let actualTop = element.offsetTop;
        let current = element.offsetParent;

        while (current !== null) {
            actualTop += current.offsetTop;
            current = current.offsetParent;
        }
        return actualTop;
    }

    function getXPath(element) {
        let selector = "";
        let foundRoot;
        let currentElement = element;
        do {
            const tagName = currentElement.tagName.toLowerCase();
            const parentElement = currentElement.parentElement;
            if (parentElement.childElementCount > 1) {
                const parentsChildren = [...parentElement.children];
                let tag = [];
                parentsChildren.forEach((child) => {
                    if (child.tagName.toLowerCase() === tagName) tag.push(child);
                });

                if (tag.length === 1) {
                    selector = `/${tagName}${selector}`;
                } else {
                    const position = tag.indexOf(currentElement) + 1;
                    selector = `/${tagName}[${position}]${selector}`;
                }
            } else {
                selector = `/${tagName}${selector}`;
            }

            currentElement = parentElement;
            foundRoot = parentElement.tagName.toLowerCase() === "html";
            if (foundRoot) selector = `/html${selector}`;
        } while (foundRoot === false);
        return selector;
    }

    function getDeviceId() {
        let deviceId = GM_getValue(DEVICE_ID_KEY, null);
        if (!deviceId) {
            deviceId = genderUUID();
            GM_setValue(DEVICE_ID_KEY, deviceId);
        }
        return deviceId;
    }

    async function sendBackend(param) {
        const requestURL = "https://worker.service.test.sankuai.com/felog/api/fe/logs?logType=OTHER_LOGS";
        // const requestURL = "https://sep-pacific.sankuai.com/felog/api/fe/logs?logType=OTHER_LOGS";
        // 附加公共参数
        const deviceId = getDeviceId();

        Object.assign(param, {
            timestamp: +new Date().getTime(),
            version: VERSION,
            // 每一个设备唯一码，便于定位问题
            deviceId,
        });

        const postData = {
            info: param,
            logType: "GLOBAL_CLICK",
        };
       const promise = new Promise((resolve, reject) => {
           GM_xmlhttpRequest({
               url: requestURL,
               method: "POST",
               headers: {
                   "content-type": "application/json",
                   "user-agent": navigator.userAgent,
               },
               data: JSON.stringify(postData),
               responseType: "json",
               onload(response) {
                   if (response.status === 200) {
                       const data = response.response;
                       resolve(data);
                   } else {
                       reject(response);
                   }
               },
               onerror: (err) => {
                   reject(err);
               },
           });
        });
        return promise;
    }

    function getMISName() {
        let misName = GM_getValue(CURRENT_MIS_NAME);
        if (!misName) {
          try {
              let misInfo = localStorage.getItem("csMisInfo");
              misInfo = JSON.parse(misInfo);
              misName = misInfo.loginName || '';
              if (misName) {
                  GM_setValue(CURRENT_MIS_NAME, misName);
              }
          } catch (err) {
              misName = '';
          }
        }
        return misName;
    }

    function registerGlobalClickEvent() {
      window.addEventListener(
          "click",
          async (e) => {
              const { target } = e;
              const { nodeName, innerText } = target;
              const { title } = document;
              const { hostname, href } = document.location;
              const { width: screenWidth, height: screenHeight } = window.screen;
              let pageY = 0;
              let pageX = 0;
              let xpath = '';
              const misName = getMISName();
              try {
                  xpath = getXPath(target);
              } catch(err) {
                  xpath = '';
              }
              try {
                  pageY = getElementTop(target);
                  pageX = getElementLeft(target);
              } catch(err) {
                  pageY = 0;
                  pageX = 0;
              }
              const data = {
                  // 点击X位置
                  pageX,
                  // 点击Y位置
                  pageY,
                  // 节点名称，如：div/input/span/button ..
                  nodeName,
                  // 节点内容
                  innerText,
                  // 页面 URL
                  url: href,
                  // mis号，只有登陆太平洋才会有
                  misName,
                  // 节点路径
                  xpath,
                  // 页面标题
                  title,
                  // 屏幕尺寸
                  screenWidth,
                  screenHeight,
              };
              await sendBackend(data);
          });
    }

    async function registerTabChangeEvent() {
        const { document, pageUrl, outerHeight: screenHeight, outerWidth: screenWidth } = unsafeWindow;
        const { title } = document;
        const misName = getMISName();
        const data = {
            pageX: 0,
            pageY: 0,
            innerText: "",
            xpath: "",
            nodeName: "tab",
            url: pageUrl,
            title,
            screenWidth,
            screenHeight,
            misName,
        };
        await sendBackend(data);
    }

    registerTabChangeEvent();

    registerGlobalClickEvent();

})();