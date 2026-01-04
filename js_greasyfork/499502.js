// ==UserScript==
// @name         移除执教云/智慧职教/icve平台的事件监听器
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  移除icve考试期间切换屏幕检查的方法
// @author       Yitong233
// @match        *://*.icve.com.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499502/%E7%A7%BB%E9%99%A4%E6%89%A7%E6%95%99%E4%BA%91%E6%99%BA%E6%85%A7%E8%81%8C%E6%95%99icve%E5%B9%B3%E5%8F%B0%E7%9A%84%E4%BA%8B%E4%BB%B6%E7%9B%91%E5%90%AC%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/499502/%E7%A7%BB%E9%99%A4%E6%89%A7%E6%95%99%E4%BA%91%E6%99%BA%E6%85%A7%E8%81%8C%E6%95%99icve%E5%B9%B3%E5%8F%B0%E7%9A%84%E4%BA%8B%E4%BB%B6%E7%9B%91%E5%90%AC%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeMethods() {
        // 假设这些方法存在于某个对象中，例如 `exam`
        let objNames = ['exam', 'someOtherObject']; // 根据实际情况调整对象名称

        objNames.forEach(name => {
            if (window[name] && typeof window[name] === 'object') {
                let obj = window[name];

                if (obj.winFlag && typeof obj.winFlag === 'function') {
                    obj.winFlag = function() {
                        console.log(name + '.winFlag function removed.');
                    };
                }

                if (obj.check && typeof obj.check === 'function') {
                    obj.check = function() {
                        console.log(name + '.check function removed.');
                    };
                }

                if (obj.onVisibilityChange && typeof obj.onVisibilityChange === 'function') {
                    obj.onVisibilityChange = function() {
                        console.log(name + '.onVisibilityChange function removed.');
                    };
                }

                if (obj.onmouseleaveChange && typeof obj.onmouseleaveChange === 'function') {
                    obj.onmouseleaveChange = function() {
                        console.log(name + '.onmouseleaveChange function removed.');
                    };
                }

                if (obj.isScreen && typeof obj.isScreen === 'function') {
                    obj.isScreen = function() {
                        console.log(name + '.isScreen function removed.');
                    };
                }
            }
        });

        // 如果方法存在于 Vue 组件中
        if (window.Vue) {
            Vue.mixin({
                beforeCreate() {
                    if (this.$options.methods) {
                        if (this.$options.methods.winFlag) {
                            this.$options.methods.winFlag = function() {
                                console.log('winFlag function removed.');
                            };
                        }

                        if (this.$options.methods.check) {
                            this.$options.methods.check = function() {
                                console.log('check function removed.');
                            };
                        }

                        if (this.$options.methods.onVisibilityChange) {
                            this.$options.methods.onVisibilityChange = function() {
                                console.log('onVisibilityChange function removed.');
                            };
                        }

                        if (this.$options.methods.onmouseleaveChange) {
                            this.$options.methods.onmouseleaveChange = function() {
                                console.log('onmouseleaveChange function removed.');
                            };
                        }

                        if (this.$options.methods.isScreen) {
                            this.$options.methods.isScreen = function() {
                                console.log('isScreen function removed.');
                            };
                        }
                    }
                }
            });
        }
    }

    function removeVisibilityChangeListeners() {
        const originalDocumentAddEventListener = document.addEventListener.bind(document);

        document.addEventListener = function(type, listener, options) {
            if (type === 'visibilitychange') {
                console.log('VisibilityChange listener prevented:', listener);
            } else {
                originalDocumentAddEventListener(type, listener, options);
            }
        };

        // 清除已经存在的 visibilitychange 事件监听器
        const events = getEventListeners(document);
        const visibilityChangeListeners = events.visibilitychange || [];
        visibilityChangeListeners.forEach(listener => {
            document.removeEventListener('visibilitychange', listener.listener);
        });

        console.log('All visibilitychange listeners removed');
    }

    // 延迟执行以确保目标脚本已加载
    setTimeout(() => {
        removeMethods();
        removeVisibilityChangeListeners();
    }, 3000);
})();