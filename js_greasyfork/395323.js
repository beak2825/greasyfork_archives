// ==UserScript==
// @name         Bilibili 2020 拜年祭火锅加菜
// @namespace    https://yinr.cc/
// @version      1.4.4
// @description  Bilibili 2020 拜年祭火锅自动加菜、偷吃
// @author       Yinr
// @icon         https://www.bilibili.com/favicon.ico
// @match        https://www.bilibili.com/blackboard/xianxing2020bnj.html*
// @run-at       document-idle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/395323/Bilibili%202020%20%E6%8B%9C%E5%B9%B4%E7%A5%AD%E7%81%AB%E9%94%85%E5%8A%A0%E8%8F%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/395323/Bilibili%202020%20%E6%8B%9C%E5%B9%B4%E7%A5%AD%E7%81%AB%E9%94%85%E5%8A%A0%E8%8F%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEF_MINUS = false;
    const DEF_AUTO_CLOSE_MODAL = true;
    const DEF_AUTO_TIME = 666;
    const DEF_TAKE_REST = true;
    const DEF_REST_TIMEOUT = 60 * 1000;

    GM_setValue('minus', GM_getValue('minus', DEF_MINUS));
    GM_setValue('autoCloseModal', GM_getValue('autoCloseModal', DEF_AUTO_CLOSE_MODAL));
    let autoTime = GM_getValue('autoTime', DEF_AUTO_TIME);
    GM_setValue('autoTime', autoTime);

    // 消息提示
    let biliHotLog = (msg, type = 'debug') => {
        if (type === 'debug' || type === 'd') {
            console.debug(msg);
        } else if (type === 'info' || type === 'i') {
            console.log(msg);
        } else {
            console[type](msg);
        }
    }

    // 获取范围内随机浮点数
    let getRandom = (min = 0, max = 1) => {
        return Math.random() * (max - min) + min;
    }

    // 获取弹出框关闭按钮
    let modalCheck = () => document.querySelector("div.modal-wrap div.close-button");

    // 弹出框内容是否以存在记录
    let modalExist = (val, modal = GM_getValue('modalLog', [])) => {
        return modal.filter((el) => el.type == val.type).some((el) => {
            for (let i in el) {
                if (el[i] !== val[i]) {
                    return(false);
                }
            }
            return(true)
        })
    }

    // 弹出框内容记录
    let modalLog = (obj) => {
        biliHotLog(obj, 'info');
        let log = GM_getValue('modalLog', []);
        if (!modalExist(obj, log)) {
            log.push(obj);
            GM_setValue('modalLog', log);
        } else {
            biliHotLog('card is existed');
        }
    }

    let doHotId;
    let stopHot = () => {
        if (doHotId) {
            clearInterval(doHotId);
        }
    }

    let doHot = (time = autoTime) => {
        let range = 2000;
        let min = Math.max(time - range / 2, 500);
        let max = Math.max(time + range / 2, 1000);
        let randTime = getRandom(min, max);
        biliHotLog('biliHot: doHot in about ' + Math.floor(randTime) + 'ms', 'info');
        doHotId = setInterval(hotOnce, randTime);
    }

    function hotOnce() {
        let minus = GM_getValue('minus', DEF_MINUS);
        let autoCloseModal = GM_getValue('autoCloseModal', DEF_AUTO_CLOSE_MODAL);

        let addBtn = /*() =>*/ document.querySelector("#app div.button.add > div.interactive");
        let minusBtn = /*() =>*/ document.querySelector("#app div.button.minus > div.interactive");

        if (modalCheck()) {
            let modalDiv = document.querySelector("div.modal-wrap.fade.entered > div > div > div > div");
            if (modalDiv) {
                if (modalDiv.className === 'thousand-thanks') {
                    modalLog({
                        type: modalDiv.className,
                        nick: modalDiv.querySelector("div.nick").innerText,
                        pic: modalDiv.querySelector("div.pic img").src,
                        desc: modalDiv.querySelector("div.desc").innerText,
                    });
                } else if (modalDiv.className === 'special-food-get-daze') {
                    modalLog({
                        type: modalDiv.className,
                        action: modalDiv.querySelector("div.action").innerText,
                        pic: modalDiv.querySelector("div.pic img").src,
                        desc: modalDiv.querySelector("div.desc").innerText,
                    });
                } else if (modalDiv.className === 'touchi-card') {
                    modalLog({
                        type: modalDiv.className,
                        action: modalDiv.querySelector("div.action").innerText,
                        pic: modalDiv.querySelector("div.img img").src,
                    });
                } else if (modalDiv.className === 'title') {
                    modalDiv = modalDiv.parentElement;
                    modalLog({
                        type: 'Info',
                        title: modalDiv.querySelector("div.title").innerText,
                        message: modalDiv.querySelector("div.message").innerText,
                    });
                } else {
                    try {
                        modalLog({
                            type: modalDiv.className,
                            title: modalDiv.querySelector("div.title").innerText || "",
                            action: modalDiv.querySelector("div.action").innerText || "",
                            nick: modalDiv.querySelector("div.nick").innerText || "",
                            pic: modalDiv.querySelector("div.pic img").src || "",
                            desc: modalDiv.querySelector("div.desc").innerText || "",
                            message: modalDiv.querySelector("div.message").innerText || "",
                            dbg: modalDiv.outerHTML,
                        });
                    } catch (e) {
                        let STOP_IN_ERR = false;
                        biliHotLog(modalDiv.parentElement, 'info');
                        biliHotLog(e, 'info');
                        if (STOP_IN_ERR) {
                            stopHot();
                        }
                        return;
                    }
                }
            }
            if (autoCloseModal) {
                biliHotLog('Got sth. And closed.');
                modalCheck().click();
            } else {
                biliHotLog('Got sth. And stopped add.');
                stopHot();
                return;
            }
        } else {
            biliHotLog('adding');
            addBtn.click();
            if (minus && minusBtn.innerHTML === '') {
                biliHotLog('minusing');
                minusBtn.click();
                minus--;
            }
        }
        if (DEF_TAKE_REST && getRandom() < 0.05) {
            biliHotLog('biliHot: take a rest now', 'info');
            stopHot();
            setTimeout(doHot, DEF_REST_TIMEOUT);
        }
    }

    (function() {
        // Uniq modalLog
        let tmpLog = [];
        let modal = GM_getValue('modalLog', []);
        modal.forEach((el) => {
            if (!modalExist(el, tmpLog)) {
                tmpLog.push(el);
            }
        })
        GM_setValue('modalLog', tmpLog);
    })();

    unsafeWindow.biliHot = (() => {
        let biliHot = {};
        biliHot.hotOnce = hotOnce;
        biliHot.doHot = doHot;
        biliHot.stopHot = stopHot;
        biliHot.modalLog = () => {
            return GM_getValue('modalLog', []);
        };
        biliHot.config = {
            minus: (val) => {
                if (val === undefined) {
                    return GM_getValue('minus', DEF_MINUS);
                } else if (val === true) {
                    GM_setValue('minus', val);
                } else {
                    GM_setValue('minus', parseInt(val) || 0);
                }
            },
            autoCloseModal: (val) => {
                if (val === undefined) {
                    return GM_getValue('autoCloseModal', DEF_AUTO_CLOSE_MODAL);
                } else {
                    GM_setValue('autoCloseModal', Boolean(val));
                }
            },
            autoTime: (val) => {
                if (val === undefined) {
                    return GM_getValue('autoTime', DEF_AUTO_TIME);
                } else {
                    GM_setValue('autoTime', parseInt(val) || DEF_AUTO_TIME);
                }
            }
        }
        return(biliHot);
    })();

    let autoStartUp = () => {
        setTimeout(() => {
            let con = document.querySelector("#reserve > div.award-list-container");
            if (con) {
                con.scrollIntoView();
                doHot();
            } else {
                autoStartUp();
            }
        }, 3000);
    }
    autoStartUp();

})();