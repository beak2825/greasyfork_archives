// ==UserScript==
// @name             鼠标滚轮增强
// @namespace        mouse_wheel_strengthening
// @version          1.0.0
// @icon             data:image/png;base64,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
// @description      滚动鼠标滚轮控制视频前进或者后退。
// @license          MIT
// @author           Subdue
// @supportURL       https://github.com/Subdue0/tampermonkey_scripts
// @include          *
// @require          https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @run-at           document-idle
// @grant            unsafeWindow
// @grant            GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/437205/%E9%BC%A0%E6%A0%87%E6%BB%9A%E8%BD%AE%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/437205/%E9%BC%A0%E6%A0%87%E6%BB%9A%E8%BD%AE%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==
/* jshint esversion: 6 */
/* eslint-disable no-undef */


(function () {
    'use strict';



    // 步进秒数
    var step = 5;



    // 计数初始变量
    var i = -1;
    var j = 0;
    // 视频初始变量
    var videoWidth, videoHeight, parentWidth, parentHeight = 0;
    // 工具方法
    var utils = {
        // 获取父元素层级
        _getParentLevel: function (element) {
            i++;
            if (i === 0) {
                videoWidth = element.offsetWidth;
                videoHeight = element.offsetHeight;
                return utils._getParentLevel(element.parentElement);
            } else {
                parentWidth = element.offsetWidth;
                parentHeight = element.offsetHeight;
                if (videoWidth !== parentWidth || videoHeight !== parentHeight) {
                    return --i;
                } else {
                    if (element.tagName === "BODY") {
                        return --i;
                    } else {
                        return utils._getParentLevel(element.parentElement);
                    }
                }
            }
        },
        // 获取父元素
        _getParentElement: function (element, level) {
            j++;
            if (level === j) {
                return element.parentElement;
            } else {
                return utils._getParentElement(element.parentElement, level);
            }
        },
        // 匹配特殊站点
		matchSiteHost: function (url) {
			var host = ["mgtv", "bilibili.com/video/", "bilibili.com/bangumi/play/"];
			var matchedHost = "其他";
			for (var j=0; j<host.length; j++)
			{
				var matchedIndex = url.indexOf(host[j]);
				if (matchedIndex !== -1 && matchedIndex <= 30) {
					matchedHost = host[j];
					break;
				}
			}
			return matchedHost;
		},
        getSiteVideoTopBox: function (host, element) {
            // 初始化全局变量
            i = -1;
            j = 0;
            videoWidth = 0;
            videoHeight = 0;
            parentWidth = 0;
            parentHeight = 0;
            // 获取父元素层级
            var level = utils._getParentLevel(element);
            // 适配芒果TV、哔哩哔哩
            switch(host) {
                case "mgtv":
                    return utils._getParentElement(element, level + 2);
                case "bilibili.com/video/":
                    return utils._getParentElement(element, level + 1);
                case "bilibili.com/bangumi/":
                    return utils._getParentElement(element, level + 3);
                default:
                    if (level === 0) {
                        return element;
                    } else {
                        return utils._getParentElement(element, level);
                    }
            }
        },
    };
    function main() {
        // 初始变量
        var queryResult = null;
        var videoTag = null;
        var videoTopBox = null;

        // 哔哩哔哩普通视频比较特殊，可操作的视频标签为bwp-video，但是番剧和电影之类可操作的视频标签为video
        var currentHost = utils.matchSiteHost(window.location.href);
        if (currentHost === "bilibili.com/video/") {
            queryResult = $('bwp-video');
        } else {
            queryResult = $('video');
        }

        // 如果有多个video标签，取视频没被静音的那个（突发奇想~·~）
        if (!(queryResult instanceof HTMLElement)) {
            if (queryResult.length === 0) {
                return;
            } else {
                var pausedFlag = false;
                for (var k=0; k<queryResult.length; k++)
                {
                    if (queryResult[k].paused === false) {
                        pausedFlag = true;
                        videoTag = queryResult[k];
                        break;
                    }
                }
                if (!pausedFlag) {
                    videoTag = queryResult[0];
                }
            }
        }

        // 可操作的视频顶层容器
        videoTopBox = utils.getSiteVideoTopBox(currentHost, videoTag);

        // 绑定滚轮事件
        var handleMouseWheel = function(e) {
            // 阻止滚动事件的继续传播，并且阻止浏览器默认行为
            e.stopPropagation();
            e.preventDefault();
            // 通过滚轮控制视频后退或前进
            if (e.wheelDelta < 0) {
                videoTag.currentTime = videoTag.currentTime - step;
            } else {
                videoTag.currentTime = videoTag.currentTime + step;
            }
        };
        // 第三个参数为true，表示该监听器监听捕获阶段的事件，因为捕获阶段事件较早，可以阻止事件传播到目标、冒泡阶段
        // 如果使用默认参数：false，则只是阻止冒泡阶段事件的向上传播，而捕获阶段的事件早已触发，会造成目标内层事件触发
        // 简而言之，由外而内—捕获阶段、目标阶段、由内而外—冒泡阶段，事件得从捕获阶段开始阻止传播，这样可以避免事件往内层渗透、往外层冒泡
        videoTopBox.addEventListener("mousewheel", handleMouseWheel, true);
    }
    $(function() {
        // 监听全屏事件
        document.addEventListener("fullscreenchange", main);
        // 入口函数
        setTimeout(main, 3000);
    });
})();