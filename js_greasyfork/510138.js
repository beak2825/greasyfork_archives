// ==UserScript==
// @name         tradingview chart assistant
// @namespace    http://tampermonkey.net/
// @version      2025-11-14
// @description  insert a link go finviz chart link
// @author       goodzhuwang
// @match        https://*.tradingview.com/chart/*/?symbol=*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510138/tradingview%20chart%20assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/510138/tradingview%20chart%20assistant.meta.js
// ==/UserScript==

function findElementsByClassRegex(classNameRegex) {
    const selector = `*[class*="${classNameRegex.source}"]`;
    return document.querySelectorAll(selector);
}

(function() {
        "use strict";


        // 1. 定义你的 CSS 样式字符串
        const myCss = `
        	/* 定义一个你想要使用的 CSS 类 */
			._TCA_finviz-link {
			    display: flex;
			    align-items: center;
			    justify-content: center;
			    height: 44px;
			    cursor: pointer;
	        }

	        ._TCA_finviz-link_inner{
		        display: flex;
		    	align-items: center;
		    	justify-content: center;
		        height: 38px;
		        width: 38px;
		        border-radius: 8px;
			    color:#333;
	        }

	        ._TCA_finviz-link_inner:hover{
				background-color:#ebebeb;
	        }
	    `;

        // 2. 调用 GM_addStyle 将 CSS 注入页面
        GM_addStyle(myCss);

        const ext_name = "tradingview_chart_assistant";

        console.debug(`${ext_name} running`);

        let max_times = 10;
        let times = 0;
        let _interval = setInterval(function() {
                // 达到最大次数，就算了。
                if (times >= max_times) {
                    console.debug(`${ext_name}达到最大检测次数，算了`);
                    if (_interval) {
                        clearInterval(_interval);
                        _interval = null;
                    }
                }
                let symbol = document.querySelector(".js-button-text") ?.textContent;
                if (!symbol) {
                    console.debug(`没有找到股票代码`);
                    return;
                }

                // 在特定的的位置插入一个a
                const targets = findElementsByClassRegex(/filler-/);
                const domElement = targets && targets.length && targets[0];

                if (!domElement) {
                    console.debug(`没有找到插入位置`);
                } else {
                    let finviz_link_url = `https://finviz.com/quote.ashx?t=${symbol}&ty=c&ta=1&p=d`;

                    let finviz_link = document.querySelector("._TCA_finviz-link");
                    if (!finviz_link) {
                        const finviz_link = document.createElement("div");


                        // 你要插入的 HTML 字符串
                        const newHTML = `
				          <a class="_TCA_finviz-link" href=${finviz_link_url} target="_blank" title="点击查看finviz图表">
				            <div class="_TCA_finviz-link_inner">
				              Finv
				            </div>
				          </a>
				        `;

                        finviz_link.innerHTML = newHTML;

                        domElement.insertAdjacentHTML('beforeend', newHTML);
                    }

                    times++;
                }
        }, 5000);
})();