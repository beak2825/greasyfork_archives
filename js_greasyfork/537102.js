// ==UserScript==
// @name         巴中开放大学专业技术人员继续教育基地|巴中开放大学公需科目刷课
// @namespace    此为免费版，只能切课，完整版需付费，介意勿扰
// @version      1.0
// @description  只能自动切课，不能秒刷，网站更新巨频繁，免费版失效请勿喷，如需完整版秒刷功能，请+V:vasing2  ,
// @author       vasing2
// @match        https://bzys.jjyxt.cn/*
// @icon         https://bzys.jjyxt.cn/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/537102/%E5%B7%B4%E4%B8%AD%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%9F%BA%E5%9C%B0%7C%E5%B7%B4%E4%B8%AD%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E5%85%AC%E9%9C%80%E7%A7%91%E7%9B%AE%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/537102/%E5%B7%B4%E4%B8%AD%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%9F%BA%E5%9C%B0%7C%E5%B7%B4%E4%B8%AD%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E5%85%AC%E9%9C%80%E7%A7%91%E7%9B%AE%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        #auto-course-notice {
            position: fixed;
            top: 20px;
            left: 20px;
            background: linear-gradient(135deg, #4776E6, #8E54E9);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 9999;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            max-width: 300px;
            font-family: "Microsoft YaHei", sans-serif;
            opacity: 0.9;
            transition: all 0.3s ease;
            border-left: 5px solid #ff8a00;
        }
        #auto-course-notice:hover {
            opacity: 1;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }
        #auto-course-notice .title {
            font-weight: bold;
            margin-bottom: 8px;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        #auto-course-notice .icon {
            margin-right: 8px;
            font-size: 18px;
        }
        #auto-course-notice .content {
            line-height: 1.5;
        }
        #auto-course-notice .contact {
            margin-top: 8px;
            font-style: italic;
            font-size: 13px;
            opacity: 0.9;
        }
    `);

    // 创建通知元素
    function createNotice() {
        const notice = document.createElement('div');
        notice.id = 'auto-course-notice';
        notice.innerHTML = `
            <div class="title">
                <span><span class="icon">🚀</span>巴中开放大学专业技术人员继续教育基地自动学习</span>
            </div>
            <div class="content">
                自动切课脚本已激活。使用方法：打开课程列表，点击第一节课，脚本会在学完后自动开始剩下的课程。 网站更新巨频繁，免费版有部分浏览器已失效不能工作。请购买完整版秒刷
            </div>
            <div class="contact">
                如需秒刷课程请+微信: vasing2
            </div>
        `;
        document.body.appendChild(notice);
    }

    // 等待页面加载完成后添加通知
    window.addEventListener('load', function() {
        createNotice();
        initAutoSwitchCourse();
    });

    // 初始化自动切课功能
    function initAutoSwitchCourse() {
        // 监听XHR请求
        const originalXHR = window.XMLHttpRequest;
        window.XMLHttpRequest = function() {
            const xhr = new originalXHR();

            const originalOpen = xhr.open;
            xhr.open = function() {
                this.addEventListener('load', function() {
                    if (this.responseURL.includes('/pro/system/section/updateSysOrder')) {
                        console.log('检测到课程完成，准备切换到下一课程');
                        setTimeout(sendRecordRequest, 2000);
                    }
                });
                return originalOpen.apply(this, arguments);
            };

            return xhr;
        };
    }

    // 发送学习记录请求
    function sendRecordRequest() {
        // 从页面URL获取当前课程ID
        const urlParams = new URLSearchParams(window.location.search);
        const courseId = urlParams.get('id');

        if (!courseId) {
            console.log('未找到课程ID，无法继续');
            return;
        }

        // 获取token
        const token = getToken();
        if (!token) {
            console.log('未找到授权token，无法继续');
            return;
        }

        // 获取用户ID和组织ID (这些可能需要从页面或其他请求中提取)
        // 以下是示例值，实际使用时需要从页面获取
        const userId = getUserId();
        const orgId = getOrgId();
        const sectionId = getSectionId();

        if (!userId || !orgId || !sectionId) {
            console.log('缺少必要参数，无法继续');
            return;
        }

        // 发送记录请求
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://bzys.jjyxt.cn/pro/course/record/Record',
            headers: {
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'authorization': `Bearer ${token}`,
                'content-type': 'application/json;charset=UTF-8',
                'origin': 'https://bzys.jjyxt.cn',
                'referer': `https://bzys.jjyxt.cn/course/detail?id=${courseId}`,
                'sec-ch-ua': '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
                'weburl': 'bzys.jjyxt.cn'
            },
            data: JSON.stringify({
                "courseId": courseId,
                "sectionId": sectionId,
                "userId": userId,
                "orgId": orgId
            }),
            onload: function(response) {
                console.log('记录请求完成，准备进入下一课程');
                goToNextSection();
            }
        });
    }

    // 获取Token
    function getToken() {
        // 从cookie或localStorage获取token
        const token = document.cookie.split(';').find(c => c.trim().startsWith('PC-Token='));
        if (token) {
            return token.split('=')[1];
        }
        return null;
    }

    // 获取用户ID
    function getUserId() {
        // 这里需要从页面或其他数据中提取用户ID
        // 示例实现，实际使用时需要调整
        return 14482; // 示例值
    }

    // 获取组织ID
    function getOrgId() {
        // 这里需要从页面或其他数据中提取组织ID
        // 示例实现，实际使用时需要调整
        return 159; // 示例值
    }

    // 获取课程章节ID
    function getSectionId() {
        // 这里需要从页面或其他数据中提取章节ID
        // 示例实现，实际使用时需要调整
        return 124601; // 示例值
    }

    // 跳转到下一个章节
    function goToNextSection() {
        // 找到下一个章节元素并点击
        // 这部分需要根据网站DOM结构调整
        const nextSectionElement = document.querySelector('.next-section-selector'); // 替换为实际选择器
        if (nextSectionElement) {
            nextSectionElement.click();
        } else {
            console.log('未找到下一章节元素');
        }
    }
})();