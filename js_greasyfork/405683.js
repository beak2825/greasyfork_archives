// ==UserScript==
// @name         初音的青葱Onedrive微云自动填充密码并点击[多网页版]
// @namespace    http://tampermonkey.net/
// @version      2.4.2
// @description  网站变更
// @author       aotmd
// @match        https://mkgal-my.sharepoint.com/*
// @match        https://mkfx-my.sharepoint.cn/*
// @match        https://mkgal.com/*
// @match        https://*.mkgal.com/*
// @match		 https://share.weiyun.com/*
// @match        https://www.yngal.com/*
// @match        https://www.fufugal.com/*
// @icon         https://www.fufugal.com/static/images/login.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405683/%E5%88%9D%E9%9F%B3%E7%9A%84%E9%9D%92%E8%91%B1Onedrive%E5%BE%AE%E4%BA%91%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E5%AF%86%E7%A0%81%E5%B9%B6%E7%82%B9%E5%87%BB%5B%E5%A4%9A%E7%BD%91%E9%A1%B5%E7%89%88%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/405683/%E5%88%9D%E9%9F%B3%E7%9A%84%E9%9D%92%E8%91%B1Onedrive%E5%BE%AE%E4%BA%91%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E5%AF%86%E7%A0%81%E5%B9%B6%E7%82%B9%E5%87%BB%5B%E5%A4%9A%E7%BD%91%E9%A1%B5%E7%89%88%5D.meta.js
// ==/UserScript==

(function () {
    let setting = {
        //取不到值的默认密码
        "Onedrive默认密码": "MKFX",
        //过低将无法填充密码
        "微云延时": 500,
    };

    addLoadEvent(function () {
        let url = window.location.href;
        if (/mkgal\.com\/.+/i.test(url) || /yngal\.com\/.+/i.test(url)) {
            let downloadLink = document.getElementsByTagName("h6");
            for (let i = 0; i < downloadLink.length; i++) {
                if (/微云/.test(downloadLink[i].innerText)) {
                    let weiYun = downloadLink[i].parentNode;
                    deleteRedundantEmptyTextNodes(weiYun);
                    let child = weiYun.childNodes;
                    let password = child[2].getElementsByTagName("span")[0].innerText;
                    child[1].href = setQueryString(child[1].href, "password", password);
                }
            }
        } else if (/https:\/\/mkfx-my\.sharepoint\.cn\/.+/i.test(url) || /https:\/\/mkgal-my\.sharepoint\.com\/.+/i.test(url)) {
            if (getQueryString('password') == null) {
                document.getElementById("txtPassword").value = setting.Onedrive默认密码;
            } else {
                document.getElementById("txtPassword").value = getQueryString('password')
            }
            document.getElementById("btnSubmitPassword").click();
        } else if (/https:\/\/share\.weiyun\.com\/.+/i.test(url)) {/*微云自动填充密码*/
            if (getQueryString('password') != null) {
                setTimeout(function () {
                    /**
                     * 自定义输入事件触发事件
                     * @param dom 元素
                     * @param st 内容
                     */
                    window.inputValue = function (dom, st) {
                        let evt = new InputEvent('input', {
                            inputType: 'insertText',
                            data: st,
                            dataTransfer: null,
                            isComposing: false
                        });
                        dom.value = st;
                        dom.dispatchEvent(evt);
                    };
                    let inputDom = document.getElementsByClassName("input-txt")[0];
                    window.inputValue(inputDom, getQueryString('password'));
                    document.getElementsByClassName("btn btn-l btn-main")[0].click();
                }, setting.微云延时);
            }
        }
    });

    /**
     * 删除多余的空文本节点,为nextSibling,等节点操作一致性做准备
     * @param elem 要优化的父节点
     */
    function deleteRedundantEmptyTextNodes(elem) {
        let elemList = elem.childNodes;
        for (let i = 0; i < elemList.length; i++) {
            /*当为文本节点并且为不可见字符时删除节点*/
            if (elemList[i].nodeName === "#text" && /^\s+$/.test(elemList[i].nodeValue)) {
                elem.removeChild(elemList[i])
            }
        }
    }

    /**
     * 获取url的参数
     * @param name 参数名称
     * @returns {string|null}
     */
    function getQueryString(name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        let r = decodeURI(window.location.search).substr(1).match(reg);
        if (r != null) return (r[2]);
        return null;
    }

    /**
     * 设置url的参数
     * @param url 要设置的url
     * @param name 变量名称
     * @param data 数据
     */
    function setQueryString(url, name, data) {
        let index = url.lastIndexOf('?');
        if (index === -1) {
            if (url[url.length - 1] !== '/') {
                return url + '?' + name + '=' + data;
            } else {
                return url.substring(0, url.length - 1) + '?' + name + '=' + data + '/';
            }
        } else {
            if (url[url.length - 1] !== '/') {
                return url + '&' + name + '=' + data;
            } else {
                return url.substring(0, url.length - 1) + '&' + name + '=' + data + '/';
            }
        }
    }

    /**
     * 添加浏览器执行事件
     * @param func 无参匿名函数
     */
    function addLoadEvent(func) {
        let oldOnload = window.onload;
        if (typeof window.onload != 'function') {
            window.onload = func;
        } else {
            window.onload = function () {
                try {
                    oldOnload();
                } catch (e) {
                    console.log(e);
                } finally {
                    func();
                }
            }
        }
    }
})();