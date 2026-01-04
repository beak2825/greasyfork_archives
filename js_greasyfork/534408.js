// ==UserScript==
// @name         Boss直聘JD/HR信息提取
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  提取Boss直聘页面的JD和HR信息并复制到剪贴板
// @author       Padiya
// @match        https://www.zhipin.com/web/geek/jobs*
// @match        https://www.zhipin.com/job_detail/*
// @match        https://www.zhipin.com/gongsi/job/*
// @grant        GM_setClipboard
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/534408/Boss%E7%9B%B4%E8%81%98JDHR%E4%BF%A1%E6%81%AF%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/534408/Boss%E7%9B%B4%E8%81%98JDHR%E4%BF%A1%E6%81%AF%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 页面配置映射
    const PAGE_CONFIGS = {
        'job-recommend': {
            jdSelector: '#wrap > div.page-jobs-main > div.job-recommend-result > div > div > div.job-detail-container > div.job-detail-box > div.job-detail-body > p',
            hrSelector: '#wrap > div.page-jobs-main > div.job-recommend-result > div > div > div.job-detail-container > div.job-detail-box > div.job-detail-body > div.job-boss-info > div:nth-child(2) > h2',
            companyTitleSelector: '#wrap > div.page-jobs-main > div.job-recommend-result > div > div > div.job-detail-container > div.job-detail-box > div.job-detail-body > div.job-boss-info > div:nth-child(2) > div'
        },
        'job_detail': {
            jdSelector: '#main > div.job-box > div > div.job-detail > div:nth-child(1) > div.job-sec-text',
            hrSelector: '#main > div.job-box > div > div.job-detail > div:nth-child(1) > div.job-boss-info > h2',
            companyTitleSelector: '#main > div.job-box > div > div.job-detail > div:nth-child(1) > div.job-boss-info > div.boss-info-attr'
        },
        'gongsi': {
            jdSelector: '#content > div > div.company-position-box > div.company-position-job.clearfix > div.position-job-content > div > div.job-detail-body > p',
            hrSelector: '#content > div > div.company-position-box > div.company-position-job.clearfix > div.position-job-content > div > div.job-detail-body > div.job-boss-info > h2',
            companyTitleSelector: '#content > div > div.company-position-box > div.company-position-job.clearfix > div.position-job-content > div > div.job-detail-body > div.job-boss-info > div.boss-info-attr'
        }
    };

    // 创建样式
    function createStyle() {
        const style = document.createElement('style');
        style.innerHTML = `
            #boss-extractor-btn {
                position: fixed;
                bottom: 30px;
                right: 30px;
                z-index: 9999;
                padding: 12px 24px;
                background: linear-gradient(135deg, #ff6b6b, #ff8e53);
                color: white;
                border: none;
                border-radius: 50px;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            #boss-extractor-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 6px 20px rgba(255, 107, 107, 0.6);
            }
            #boss-extractor-btn:active {
                transform: translateY(1px);
            }
            #boss-extractor-btn::before {
                content: "📋";
                margin-right: 8px;
                font-size: 18px;
            }
            .boss-tooltip {
                position: fixed;
                bottom: 90px;
                right: 30px;
                z-index: 10000;
                padding: 12px 20px;
                background: #4CAF50;
                color: white;
                border-radius: 8px;
                font-size: 14px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                animation: fadeIn 0.3s, fadeOut 0.3s 2s forwards;
                transform-origin: right bottom;
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeOut {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(-10px); }
            }
        `;
        document.head.appendChild(style);
    }

    // 显示Tooltip提示
    function showTooltip(message) {
        const existingTooltip = document.querySelector('.boss-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }

        const tooltip = document.createElement('div');
        tooltip.className = 'boss-tooltip';
        tooltip.textContent = message;
        document.body.appendChild(tooltip);

        setTimeout(function() {
            tooltip.remove();
        }, 2500);
    }

    // 处理HR名字中的SVG内容
    function cleanHRName(text) {
        if (!text) return '未找到HR信息';
        return text.split('\n')[0].trim();
    }

    // 解析公司名和头衔信息
    function parseCompanyAndTitle(text) {
        if (!text) return { company: '未找到公司信息', title: '未找到头衔信息' };

        const cleanedText = text.trim();
        const separator = cleanedText.includes('·') ? '·' : ' ';
        const parts = cleanedText.split(separator).map(part => part.trim()).filter(part => part);

        if (parts.length >= 2) {
            return {
                company: parts[0],
                title: parts[1]
            };
        } else if (parts.length === 1) {
            return {
                company: parts[0],
                title: '未找到头衔信息'
            };
        }
        return {
            company: '未找到公司信息',
            title: '未找到头衔信息'
        };
    }

    // 获取当前页面配置
    function getCurrentPageConfig() {
        const currentUrl = window.location.href;
        if (currentUrl.includes('geek/jobs')) return PAGE_CONFIGS['job-recommend'];
        if (currentUrl.includes('job_detail')) return PAGE_CONFIGS['job_detail'];
        if (currentUrl.includes('gongsi')) return PAGE_CONFIGS['gongsi'];
        return null;
    }

    // 移除包含boss(不区分大小写)的span元素
    function removeBossSpans(element) {
        if (!element) return;

        const spans = element.querySelectorAll('span');
        spans.forEach(span => {
                span.remove();
        });
    }

    // 安全的文本提取方法（处理style标签和boss span）
    function getCleanText(element) {
        if (!element) return '未找到信息';

        // 克隆元素以避免修改原始DOM
        const clone = element.cloneNode(true);

        // 移除所有style标签
        const styles = clone.querySelectorAll('style');
        styles.forEach(function(style) {
            style.remove();
        });

        // 移除包含boss的span元素
        removeBossSpans(clone);

        return clone.textContent ? clone.textContent.trim() : '未找到信息';
    }

    // 获取JD和HR信息
    function getJobInfo() {
        const config = getCurrentPageConfig();
        if (!config) return '当前页面不支持信息提取';

        const jdElement = document.querySelector(config.jdSelector);
        const hrElement = document.querySelector(config.hrSelector);
        const companyTitleElement = document.querySelector(config.companyTitleSelector);

        const jdContent = jdElement ? getCleanText(jdElement) : '未找到JD信息';
        const hrContent = hrElement ? cleanHRName(getCleanText(hrElement)) : '未找到HR信息';
        const { company, title } = companyTitleElement ? parseCompanyAndTitle(getCleanText(companyTitleElement)) : { company: '未找到公司信息', title: '未找到头衔信息' };

        return '【职位描述】\n' + jdContent +
               '\n\n【招聘员信息】\n' + hrContent + ' / 职位：'+title +
               '\n\n【公司信息】\n' + company
    }

    // 主初始化函数
    function init() {
        createStyle();

        const button = document.createElement('button');
        button.id = 'boss-extractor-btn';
        button.textContent = '提取JD/HR信息';
        document.body.appendChild(button);

        button.addEventListener('click', function() {
            const jobInfo = getJobInfo();
            GM_setClipboard(jobInfo, 'text');
            showTooltip('✅ 复制成功！信息已保存到剪贴板');
        });
    }

    init();
})();