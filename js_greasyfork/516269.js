// ==UserScript==
// @name         MaxHome增强插件
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  随机每日一言、工作时长统计
// @author       luc
// @match        http://it.maxvisioncloud.com:52800/maxhome/*
// @icon         http://maxvision.eicp.net:52800/maxhome/ui/images/logo.png
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      MIT
// @connect      codelife.cc
// @downloadURL https://update.greasyfork.org/scripts/516269/MaxHome%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/516269/MaxHome%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const textElement = document.querySelector('.header-marquee-item1');

    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://api.codelife.cc/yiyan/random?lang=cn',
        onload: function(response) {
            const data = JSON.parse(response.responseText);
            if (data.code === 200) {
                const hitokoto = data.data.hitokoto;
                if (textElement) {
                    textElement.textContent = hitokoto;

                    const elementWidth = textElement.offsetWidth;
                    const parentWidth = textElement.parentElement.offsetWidth;

                    if (elementWidth > parentWidth) {
                        textElement.style.whiteSpace = 'nowrap';
                        textElement.style.overflow = 'hidden';
                        textElement.style.textOverflow = 'ellipsis';
                        textElement.style.display = 'inline-block';
                        textElement.style.animation = 'marquee 20s linear infinite';

                        GM_addStyle(`
                            @keyframes marquee {
                                0% { transform: translateX(100%); }
                                100% { transform: translateX(-100%); }
                            }
                        `);
                    } else {
                        textElement.style.animation = 'none';
                    }
                }
            }

            const titleElement = document.querySelector('.person_head .title');
            let userName = '';
            if (titleElement) {
                userName = titleElement.textContent.trim();
            }

            const myCounterElement = document.querySelector('.appcheckcount');
            if (myCounterElement) {
                const startDate = new Date('2021-04-27');
                const currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0);
                startDate.setHours(0, 0, 0, 0);

                const timeDiff = currentDate - startDate;
                const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

                const options = { month: '2-digit', day: '2-digit' };
                const datePart = currentDate.toLocaleDateString('zh-CN', options).replace(/\//g, '月') + '日';
                const weekdayNames = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
                const weekdayPart = weekdayNames[currentDate.getDay()];

                GM_addStyle(`
                    .counter-box {
                        display: flex;
                        align-items: center;
                        margin-bottom: 20px;
                        border: 1px solid #E5E5E5;
                    }
                    .counter-text {
                        color: #333;
                        margin: 20px auto 20px 20px;
                    }
                    .counter-text-large {
                        font-size: 24px;
                        font-weight: bold;
                    }
                    .counter-date-box {
                        text-align: center;
                        margin-right: 20px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                    .counter-date {
                        background-color: #ff5722;
                        color: #ffffff;
                        padding: 4px 10px;
                        border-radius: 0px 0px 4px 4px;
                        font-size: 12px;
                        line-height: 1.3;
                        display: inline-block;
                        margin-top: 0;
                    }
                    .counter-number {
                        font-size: 30px;
                        font-weight: bold;
                        color: #ff5722;
                        margin-top: 4px;
                    }
                    .small-text {
                        font-size: 15px;
                        color: #333;
                    }
                    .right_applicat {
        margin-top: 30px;
    }
                `);

                const newHtml = `
                    <div class="counter-box">
                        <div class="counter-text">
                            <div class="counter-text-large">Hi,亲爱的${userName}</div>
                            <div class="small-text" style="margin-top: 10px;">今天是你在Maxvision的</div>
                        </div>
                        <div class="counter-date-box">
                            <div class="counter-date">
                                <div>${datePart}</div>
                                <div>${weekdayPart}</div>
                            </div>
                            <div style="margin-bottom: 20px;margin-top: 10px;">
                                <span class="small-text">第</span>
                                <span class="counter-number">${daysDiff}</span>
                                <span class="small-text">天</span>
                            </div>
                        </div>
                    </div>
                `;
                myCounterElement.insertAdjacentHTML('beforebegin', newHtml);
            }

            const applicatListElement = document.querySelector('.applicat_list');
            if (applicatListElement) {
                const newHtml = `
<a href="https://www.kdocs.cn/folder/cs9bS5uTPQE4" target="_blank" class="link-instanted">
						<div class="item">
							<div class="image" style="position: relative">
								<img src="/maxhome/ui/images/crms.png" alt="">
							</div>
							<div class="text">部门共享文档</div>
						</div>
					</a>
                `;
                applicatListElement.insertAdjacentHTML('beforeend', newHtml);
            }
        }
    });
})();











