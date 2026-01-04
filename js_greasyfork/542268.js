// ==UserScript==
// @name Arcaea中国大陆登录、下载修复
// @namespace http://tampermonkey.net/
// @version 1.0
// @description 修复下载按钮并替换Play商店链接为c版安装包，同时启用账号登录。
// @author DeepSeek&Manus feat.金谷那明KimKona
// @match *://*.lowiro.com/*
// @grant GM_xmlhttpRequest
// @connect webapi.lowiro.com
// @run-at document-start
// @license AGPL License
// @downloadURL https://update.greasyfork.org/scripts/542268/Arcaea%E4%B8%AD%E5%9B%BD%E5%A4%A7%E9%99%86%E7%99%BB%E5%BD%95%E3%80%81%E4%B8%8B%E8%BD%BD%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/542268/Arcaea%E4%B8%AD%E5%9B%BD%E5%A4%A7%E9%99%86%E7%99%BB%E5%BD%95%E3%80%81%E4%B8%8B%E8%BD%BD%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let apkDownloadUrl = null;//此段DeepSeek辅助，获取含APK下载链接的回复
    async function fetchApkInfo() {
        if (apkDownloadUrl) return { url: apkDownloadUrl };
        try {
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://webapi.lowiro.com/webapi/serve/static/bin/arcaea/apk",
                    onload: function(res) {
                        resolve(res);
                    },
                });
            });
            const data = JSON.parse(response.responseText);
            if (data.success && data.value && data.value.url) {
                apkDownloadUrl = data.value.url; // 提取URL
                return { url: data.value.url, version: data.value.version };
            }
        } catch (e){}
        return null;
    }

    // Intercept Object.defineProperty to control key properties
    //此段Manus写的
    const originalDefineProperty = Object.defineProperty;

    Object.defineProperty = function(obj, prop, descriptor) {
        // 强制启用isAllowedOnline
        if (prop === 'isAllowedOnline' && descriptor.configurable) {
            console.log('Intercepting isAllowedOnline property definition');
            descriptor.get = function() { return true; };
            descriptor.set = function(value) { console.log('Attempted to set isAllowedOnline to', value); };
        }
        // 强制ChinaAPK
        if (prop === 'chinaApk' && descriptor.configurable) {
            console.log('Intercepting chinaApk property definition');
            let _value = descriptor.value;
            descriptor.get = function() { return _value; };
            descriptor.set = function(value) {
                _value = value;
                //chinaApk未定义
                if (!value || !value.url) {
                    fetchApkInfo().then(apkInfo => {
                        if (apkInfo) {
                            console.log('Forcing chinaApk to:', apkInfo);
                            _value = apkInfo; // 直接设置为内置值
                        }
                    });
                }
            };
        }
        // 强制禁用isIosCn
        if (prop === 'isIosCn' && descriptor.configurable) {
            console.log('Intercepting isIosCn property definition');
            descriptor.get = function() { return false; };
            descriptor.set = function(value) { console.log('Attempted to set isIosCn to', value); };
        }
        return originalDefineProperty(obj, prop, descriptor);
    };

    // 调整页面元素，此段Manus创作
    const observer = new MutationObserver((mutationsList, observer) => {
        // Target the main app-stores div
        const appStoresDiv = document.querySelector('.app-stores');
        if (appStoresDiv) {
            // Ensure the app-stores div is visible
            appStoresDiv.style.display = ''; // Remove any display: none
            appStoresDiv.style.visibility = ''; // Remove any visibility: hidden

            // APK下载按钮
            const downloadApkButton = appStoresDiv.querySelector('.download-apk');
            const googlePlayButton = appStoresDiv.querySelector('.google-play');
            const appStoreButton = appStoresDiv.querySelector('.app-store');
            const availableAndroidContainer = appStoresDiv.querySelector('.available-android-container');

            // If APK button exists, ensure it's visible and hide others
            if (downloadApkButton) {
                downloadApkButton.style.display = '';
                downloadApkButton.style.visibility = '';
                // Hide Google Play and App Store buttons if they are present
                if (googlePlayButton) googlePlayButton.style.display = 'none';
                if (appStoreButton) appStoreButton.style.display = 'none';
                if (availableAndroidContainer) availableAndroidContainer.style.display = 'none';
            } else {
                // If APK button doesn't exist, try to force its creation by manipulating Vue state
                // This part is more heuristic and depends on Vue's internal rendering.
                // We need to ensure that the conditions for rendering the APK button are met.
                // The conditions are: isAllowedOnline is true, chinaApk has a value, and isIosCn is false.
                // We are already intercepting these properties, but sometimes Vue might have already rendered
                // based on initial values. We can try to trigger a re-render by setting them again.

                // Look for the Vue instance or its reactive properties on the window object
                if (window.__VUE_DEVTOOLS_GLOBAL_HOOK__ && window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue) {
                    const Vue = window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue;
                    const app = document.querySelector('#app'); // Assuming the main app element has id 'app'
                    if (app && app.__vue__ && app.__vue__.$children) {
                        app.__vue__.$children.forEach(child => {
                            // Check if this child component is the one responsible for the app-stores section
                            // This is a heuristic, look for components that have these properties
                            if (child.isAllowedOnline !== undefined || child.chinaApk !== undefined || child.isIosCn !== undefined) {
                                if (child.isAllowedOnline !== true) {
                                    console.log('Forcing isAllowedOnline to true on component instance');
                                    child.isAllowedOnline = true;
                                }
                                // Ensure chinaApk is set if it's not already
                                if (!child.chinaApk || !child.chinaApk.url) {
                                    console.log('Attempting to set chinaApk on component instance');
                                    fetchApkInfo().then(apkInfo => {
                                        if (apkInfo) {
                                            child.chinaApk = apkInfo;
                                            console.log('Set chinaApk on component instance to:', apkInfo);
                                        }
                                    });
                                }
                                // Force isIosCn to false to ensure Android APK path is taken
                                if (child.isIosCn !== false) {
                                    console.log('Forcing isIosCn to false on component instance');
                                    child.isIosCn = false;
                                }
                            }
                        });
                    }
                }
            }

            //替换Google Play下载链接
            if (googlePlayButton) {
                fetchApkInfo().then(apkInfo => {
                    if (apkInfo && apkInfo.url) {
                        const googlePlayLink = googlePlayButton.closest('a');
                        if (googlePlayLink) {
                            console.log('Replacing Google Play link with APK URL:', apkInfo.url);
                            googlePlayLink.href = apkInfo.url;
                            // Optionally, change the text or add a class to indicate it's an APK link
                            // googlePlayButton.textContent = 'Download APK';
                            // googlePlayButton.classList.add('apk-link-replaced');
                        }
                    }
                });
            }
        }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
    if (window.isAllowedOnline !== undefined) {
        window.isAllowedOnline = true;
    }
    if (window.isIosCn !== undefined) {
        window.isIosCn = false;
    }
    if (window.chinaApk !== undefined) {
        fetchApkInfo().then(apkInfo => {
            if (apkInfo) {
                window.chinaApk = apkInfo;
            }
        });
    }

})();