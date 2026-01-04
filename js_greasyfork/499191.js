// ==UserScript==
// @name        123Pan去广告
// @namespace   http://tampermonkey.net/
// @match       https://www.123pan.com/*
// @match       https://www.123pan.cn/*
// @match       https://www.123684.com/*
// @match       https://www.123865.com/*
// @match       https://www.123912.com/*
// @grant       unsafeWindow
// @grant       GM_addStyle
// @run-at      document-start
// @version     2.0
// @license     MIT
// @author      Berger
// @description 去广告、修改会员[会员无实际效果，仅供娱乐]


// @note         2.0 [修复]精简失效等问题
// @note         1.9 [适配]域名
// @note         1.8 [修复]一些已知的BUG
// @note         1.7 [新增]适配网页下载
// @note         1.6 [适配]123Pan cn域名
// @note         1.5 [修复]无法上传文件的BUG
// @note         1.4 [修复]一些已知的BUG
// @note         1.3 [新增]文件列表默认修改为更新时间降序排序
// @note         1.2 [修复]一些已知的BUG
// @note         1.1 [新增]手机端去广告
// @note         1.0 [新增]PC去广告 [新增]会员修改
// @downloadURL https://update.greasyfork.org/scripts/499191/123Pan%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/499191/123Pan%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==


(function () {
        'use strict';

        const store = {
            modifiedUserInfo: null, path: null,
        };

        const utils = {
            removeElement(element) {
                if (element) {
                    element.remove()
                }
            },

            removeElementWithCheck(className) {
                this.checkElement(className, function (element) {
                    utils.removeElement(element)
                })
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
            }
        }

        store.path = new URLSearchParams(new URL(location.href).search).get('path');

        function modifyUserInfoResponse(originalResponse) {
            try {
                const modifiedUserInfoResponse = originalResponse
                modifiedUserInfoResponse.data.SpacePermanent = 5 * 1024 * 1024 * 1024 * 1024 //总容量
                modifiedUserInfoResponse.data.SpaceTempExpr = "2099-01-01T00:00:00+00:00" //容量过期时间
                modifiedUserInfoResponse.data.Vip = true // 是否为VIP
                modifiedUserInfoResponse.data.VipLevel = 2 // VIP等级
                modifiedUserInfoResponse.data.VipExpire = "2099-01-01 08:00:00" // VIP过期时间
                modifiedUserInfoResponse.data.SpaceBuy = true // 是否购买容量
                modifiedUserInfoResponse.data.GrowSpaceAddCount = 128 // 容量等级
                modifiedUserInfoResponse.data.IsAuthentication = true
                modifiedUserInfoResponse.data.SignType = 1

                store.modifiedUserInfo = modifiedUserInfoResponse.data.user
                return modifiedUserInfoResponse
            } catch (error) {
                console.log(error)
                return originalResponse // 返回原始响应内容
            }
        }

        function applyInterceptors() {
            const originOpen = XMLHttpRequest.prototype.open;
            const originalSend = XMLHttpRequest.prototype.send;
            const originalRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

            XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
                this._url = url;
                this._method = method;

                // 检查并修改 /b/api/share/get 请求的 orderBy 和 orderDirection 参数
                if (url.includes('/b/api/share/get')) {
                    if (!url.includes('orderBy=create_at') && !url.includes('orderDirection=desc')) {
                        this._url = url.replace('orderBy=file_name', 'orderBy=create_at')
                            .replace('orderDirection=asc', 'orderDirection=desc');
                    }
                }

                // 监听 /info 请求的响应
                if (url.indexOf('/info') !== -1) {
                    this.addEventListener('readystatechange', function () {
                        if (this.readyState === 4) {
                            const res = JSON.parse(this.responseText);
                            const modifiedUserInfoResponse = modifyUserInfoResponse(res);
                            Object.defineProperty(this, "responseText", {
                                writable: true,
                            });
                            this.responseText = modifiedUserInfoResponse;
                        }
                    });
                }

                originOpen.call(this, method, this._url, async, user, password);
            };

            XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
                if (this._url.includes('/b/api/share/download/info')) {
                    let headers = {
                        "user-agent": "123pan/v2.4.0(Android_7.1.2;Xiaomi)",
                        "platform": "android",
                        "app-version": "61",
                        "x-app-version": "2.4.0"
                    }
                    if (header.toLowerCase() in headers) {
                        value = headers[header.toLowerCase()];
                    }
                }
                return originalRequestHeader.apply(this, [header, value]);
            };

            XMLHttpRequest.prototype.send = function (body) {
                originalSend.call(this, body);
            };
        }

        function editShareDownloadButton() {
            const mobileDownloadButton = `<svg class="icon undefined" aria-hidden="true"><use xlink:href="#icon-share_folders_downloads"></use></svg>下载文件(插件)`
            const webDownloadButton = `<svg class="icon undefined" aria-hidden="true" style="color:#ffffff;margin-right:5px"><use xlink:href="#top_btn_download2"></use></svg>浏览器下载(插件)`

            if (location.href.indexOf('123pan.com/s') || location.href.indexOf('123pan.cn/s')) {
                const mobileDownloadButtonList = document.querySelectorAll('.appBottomBtnNew ')
                if (mobileDownloadButtonList.length > 0) {
                    mobileDownloadButtonList[0].innerHTML = mobileDownloadButton
                }

                const webDownloadButtonList = document.querySelectorAll('.register ')
                if (webDownloadButtonList.length > 0) {
                    webDownloadButtonList[0].innerHTML = webDownloadButton
                    webDownloadButtonList[0].style.width = '150px'
                }
            }
        }

        applyInterceptors()


        // 移除电脑端广告
        function removeAdForPC() {
            // 顶部广告
            utils.removeElementWithCheck('div.mfy-main-layout__head')

            // 右下角广告
            utils.removeElementWithCheck('div.activity-box')

            //产品商城
            utils.removeElementWithCheck('div.sider-member-btn')

            // 其他网盘转入
            utils.removeElementWithCheck('div.special-menu-item-container')

        }

        function removeUploadAD() {
            const targetNode = document.querySelector('div[class="layout-dom"]');
            if (!targetNode) {
                return; // 如果未找到目标节点，则提前退出
            }
            const config = {childList: true, subtree: true}; // 添加 subtree 选项，以监听子节点的变动

            const observer = new MutationObserver((mutationsList, observer) => {
                for (const mutation of mutationsList) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1 && node.classList.contains('upbody')) {
                            const uploadAD = node.querySelector('div.uppy-Dashboard-slowSpeed-banner')
                            if (uploadAD) {
                                uploadAD.remove()
                            }
                            observer.disconnect(); // 找到目标节点后断开观察器
                            return; // 退出循环以避免多次触发
                        }
                    }
                }
            });

            observer.observe(targetNode, config);
        }


        // 移除手机端广告
        function removeAdForMobile() {
            GM_addStyle('.banner-container-h5{display:none !important}');//右侧登录提示栏
        }


        let main = {
            init() {
                removeAdForMobile()
                removeAdForPC()
                removeUploadAD()
                editShareDownloadButton()
            },
        }

        window.addEventListener('DOMContentLoaded', main.init);
    }
)()

