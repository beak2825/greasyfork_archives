// ==UserScript==
// @name        自用小工具
// @namespace   http://tampermonkey.net/
// @match       https://applnn.cc/
// @match       https://applnn.cc/*
// @match       https://www.applnn.cc/
// @match       https://www.applnn.cc/*
// @match       https://*.lanzout.com/
// @match       https://*.lanzout.com/*
// @match       https://www.aliyundrive.com/*
// @grant       unsafeWindow
// @grant       GM_addStyle
// @grant       GM_notification
// @run-at      document-start
// @version     1.96
// @license     MIT
// @author      Berger
// @description 去广告
// @downloadURL https://update.greasyfork.org/scripts/499224/%E8%87%AA%E7%94%A8%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/499224/%E8%87%AA%E7%94%A8%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const url = window.location.href;

    const utils = {
        removeElementArrays(elementList) {
            if (elementList.length > 0) {
                elementList.forEach(element => {
                    element.remove()
                })
            }
        },

        removeElement(element) {
            if (element) {
                element.remove()
            }
        },

        responseInterceptors(fetchUrl, handleFunction) {
            const originOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function (method, url) {
                if (url.indexOf(fetchUrl) !== -1) {
                    this.addEventListener('readystatechange', function () {
                        if (this.readyState === 4) {
                            const response = JSON.parse(this.responseText)
                            const modifiedResponse = handleFunction(response)
                            Object.defineProperty(this, "responseText", {
                                writable: true,
                            });
                            this.responseText = JSON.stringify(modifiedResponse)
                        }
                    })
                }


                originOpen.apply(this, arguments);
            }
        },

        checkElement(className, callback) {
            const observer = new MutationObserver(function (mutationsList, observer) {
                const element = document.querySelector(className);
                if (element) {
                    observer.disconnect();
                    callback(element)
                }
            });

            observer.observe(document.body, {childList: true, subtree: true});
        },

        checkElementDIY(className, parentElement, callback) {
            const observer = new MutationObserver(function (mutationsList, observer) {
                const element = parentElement.querySelector(className);
                if (element) {
                    observer.disconnect();
                    callback(element)
                }
            });

            observer.observe(document.body, {childList: true, subtree: true});
        },

        notifyTool(title, message) {
            GM_notification({
                text: message,
                timeout: 3000,
                title: title,
            });
        }
    }

    function app_lnn_AD_normal() {
        const noticeBoard = document.querySelector('div[id="gong-box"]');
        utils.removeElement(noticeBoard)

        const homeTopAd_1 = document.querySelector('div[id="home-row-gg"]');
        utils.removeElement(homeTopAd_1)

        const homeTopAd_2 = document.querySelector('div[id="home-row-gg2"]');
        utils.removeElement(homeTopAd_2)

        const essayTopAd = document.querySelector('div[class="single-top-html"]');
        utils.removeElement(essayTopAd)

        utils.checkElement('.inner-wrapper-sticky>.sidebar-innter', function (essaySideBar) {
            utils.removeElement(essaySideBar.children[0])
            utils.removeElement(essaySideBar.children[2])
            // console.log(essaySideBar.children)
        })

        const essayBottomAd = document.querySelector('.single-bottom-html');
        utils.removeElement(essayBottomAd)

        const downloadAd = document.querySelectorAll('div[class="n_banner_inner"]');
        utils.removeElementArrays(downloadAd)

        const downloadBanner = document.querySelector('.download-page-info')
        utils.removeElement(downloadBanner.nextElementSibling)
    }

    function lan_z_out_AD_normal() {
        const downloadAD = document.querySelectorAll('div[class="appad"]');
        utils.removeElementArrays(downloadAD)

        const downloadBottomAd = document.querySelectorAll('div:not([class]):not([id])');
        utils.removeElementArrays(downloadBottomAd)
        console.log(downloadBottomAd)
    }

    function get_aliDrive_refresh_token() {
        utils.checkElement('.nav-tab-content--9YjBf', function (leftNavDiv) {
            const tokenBtn = document.createElement('div')
            tokenBtn.className = 'nav-tab-item--WhAQf'
            tokenBtn.innerHTML =
                `
                <span class="nav-tab-item-icon--Yz81j"><span data-role="icon" data-render-as="svg" data-icon-type="PDSRecord1" class="icon--D3kMk "><svg viewBox="0 0 1024 1024"><use xlink:href="#PDSRecord1"></use></svg></span></span>
                <span class="nav-tab-item-name--eOuOe tipsText">复制Token</span>
                `
            leftNavDiv.appendChild(tokenBtn)

            tokenBtn.addEventListener('click', function () {
                const refreshToken = JSON.parse(localStorage.getItem('token'))['refresh_token']
                if (refreshToken) {
                    navigator.clipboard.writeText(refreshToken).then(() => {
                        const statusSpan = tokenBtn.querySelector('.tipsText');
                        statusSpan.textContent = '复制成功√';
                        setTimeout(() => {
                            statusSpan.textContent = '复制Token';
                        }, 2000);
                    })
                } else {
                    alert('获取失败！')
                }

            })
        })

    }


    let main = {
        initNormal() {
            if (url.indexOf('applnn.cc') !== -1) {
                app_lnn_AD_normal()
            } else if (url.indexOf('lanzout.com') !== -1) {
                lan_z_out_AD_normal()
            } else if (url.indexOf('aliyundrive.com') !== -1) {
                get_aliDrive_refresh_token()
            }
        },
    }

    window.addEventListener('DOMContentLoaded', main.initNormal);
})();
