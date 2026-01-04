// ==UserScript==
// @name         mikanani批量复制磁链
// @namespace    https://greasyfork.org/users/101223
// @version      1.0.20240427
// @description  蜜柑计划批量复制全部磁链
// @author       Splash
// @license      GPLv3.0-or-later
// @match        https://mikanani.me/
// @match        https://mikanani.me/Home/Bangumi/*
// @match        https://mikanani.me/Home/Search?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mikanani.me
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/521291/mikanani%E6%89%B9%E9%87%8F%E5%A4%8D%E5%88%B6%E7%A3%81%E9%93%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/521291/mikanani%E6%89%B9%E9%87%8F%E5%A4%8D%E5%88%B6%E7%A3%81%E9%93%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (location.href == 'https://mikanani.me/') {
        GM_addStyle(`li.js-expand_bangumi-subgroup {
            cursor: pointer;
        }`);
        const observer = new MutationObserver(function (mutations) {
            for (let i = 0; i < mutations.length; i++) {
                for (let j = 0; j < mutations[i].addedNodes.length; j++) {
                    const dom = mutations[i].addedNodes[j];
                    if (dom.nodeName == 'DIV' && dom.classList.contains('an-res-row')) {
                        try {
                            createCopyButton(dom, true);
                        } catch (e) {
                            console.error(e);
                        }
                    }
                }
            }
        });
        document.querySelectorAll('.row.an-res-row-frame').forEach(el => {
            observer.observe(el, {
                childList: true
            });
        });
    } else {
        const observer = new MutationObserver(function (mutations) {
            for (let i = 0; i < mutations.length; i++) {
                for (let j = 0; j < mutations[i].addedNodes.length; j++) {
                    const dom = mutations[i].addedNodes[j];
                    if (dom.nodeName == 'TABLE' && dom.classList.contains('table-striped') && dom.classList.contains('tbl-border')) {
                        try {
                            createCopyButton(dom);
                        } catch (e) {
                            console.error(e);
                        }
                    }
                }
            }
        });
        observer.observe(document.querySelector('.central-container'), {
            childList: true
        });
        document.querySelectorAll('.table-striped.tbl-border').forEach(el => {
            createCopyButton(el);
        });
    }
    function createCopyButton(el, isHomePage) {
        if (isHomePage) {
            el.querySelectorAll('.res-left ul.list-unstyled.res-ul li').forEach(li => {
                li.title = '复制全部磁链';
                li.addEventListener('click', copyAllHome);
            });
        } else {
            const copyDiv = document.createElement('a');
            copyDiv.href = 'javascript:;';
            copyDiv.innerText = '复制全部磁链';
            copyDiv.style['margin-left'] = '15px';
            copyDiv.onclick = isHomePage ? copyAllHome : copyAll;
            el.querySelector('tr>th').append(copyDiv);
        }
    }
    function copyAll(e) {
        const arr = [];
        e.target.closest('.table-striped.tbl-border').querySelectorAll('a.js-magnet.magnet-link').forEach(el => {
            arr[arr.length] = el.getAttribute('data-clipboard-text');
        });
        navigator.clipboard.writeText(arr.join('\n')).then(() => {
            showCopied(e);
        }).catch(error => {
            showCopied(e, false);
            console.error("复制失败: ", error);
        });
    }
    function copyAllHome(e) {
        const arr = [];
        const activeIndex = e.currentTarget.getAttribute('data-bangumisubgroupindex') * 1;
        e.currentTarget.closest('div.an-res-row').querySelectorAll(`.js-expand_bangumi-subgroup-${activeIndex}-episodes ul.list-unstyled.res-detail-ul>li a.js-magnet.magnet-link`).forEach(el => {
            arr[arr.length] = el.getAttribute('data-clipboard-text');
        });
        navigator.clipboard.writeText(arr.join('\n')).then(() => {
            showCopied(e);
        }).catch(error => {
            showCopied(e, false);
            console.error("复制失败: ", error);
        });
    }
    function showCopied(e, success = true) {
        const copyMessage = document.createElement('div');
        copyMessage.textContent = success ? '已复制到剪贴板！' : '复制失败！';
        copyMessage.style.position = 'fixed';
        copyMessage.style.backgroundColor = success ? '#4aac55' : '#bf120d';
        copyMessage.style.color = '#ffffff';
        copyMessage.style.padding = '8px';
        copyMessage.style.borderRadius = '5px';
        copyMessage.style.transform = 'translateX(10px) translateY(15px)';
        copyMessage.style.transition = 'opacity .7s ease-out, transform .7s ease-out';
        copyMessage.style.zIndex = 99999;
        copyMessage.style.pointerEvents = 'none';
        copyMessage.style.display = 'block';

        copyMessage.style.left = e.clientX + 'px';
        copyMessage.style.top = e.clientY + 'px';

        copyMessage.addEventListener('transitionend', () => {
            copyMessage.remove();
        });
        document.body.append(copyMessage);
        setTimeout(() => {
            copyMessage.style.opacity = 0;
            copyMessage.style.transform = 'translateX(10px) translateY(-10px)';
        }, 10)
    }
})();
