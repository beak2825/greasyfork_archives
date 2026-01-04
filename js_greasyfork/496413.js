// ==UserScript==
// @name        东方财富新版本页面优化去广告
// @namespace   Violentmonkey Scripts
// @match       *://quote.eastmoney.com/concept/*
// @grant       none
// @version     1.2
// @author      -
// @grant        GM_addStyle
// @license MIT
// @description 2024/5/24 10:58:15
// @downloadURL https://update.greasyfork.org/scripts/496413/%E4%B8%9C%E6%96%B9%E8%B4%A2%E5%AF%8C%E6%96%B0%E7%89%88%E6%9C%AC%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/496413/%E4%B8%9C%E6%96%B9%E8%B4%A2%E5%AF%8C%E6%96%B0%E7%89%88%E6%9C%AC%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
(function () {
    const classesToHide = [
        '.hlinetg',
        '.scatg',
        '.emleftfloattg',
        '.footertg',
        '.footer2016',
        '.feedback',
        '.guid',
        '.bp2sll',
        '.bp2slr',
        '#posteditor',
        '.csiderbox:nth-of-type(1)',
        '.csiderbox:nth-of-type(2)',
        '.csiderbox:nth-of-type(5)',
        '.csiderbox:nth-of-type(8)',
        '.history',
        '.zxg_t',
        '.backtop',
        '.zxght'
    ];

    classesToHide.forEach(className => {
        GM_addStyle(`${className} { display: none !important; }`);
    });


    GM_addStyle('#mainlist { max-height: 600px !important;overflow: hidden;overflow-y: auto;width: 1200px}');
    GM_addStyle('.table_list {width: 1200px}')
    GM_addStyle('.mock {z-index: 999999999999999999}')
    GM_addStyle('.bp2sr {position: fixed;top: 26px; right: 12px; overflow-x: auto; height: 1000px;padding-bottom: 24px}');
    GM_addStyle('::-webkit-scrollbar { display: none !important;}');
    GM_addStyle('.mainbody { margin-left: 260px !important }');
    GM_addStyle('.zxglist_ul { height: 800px !important;}');
    document.body.style.overflow = 'hidden';
    document.body.style.overflow = 'auto';

    function reorderDivs() {
        var parent = document.querySelector(".bp2sr");
        var children = Array.from(parent.getElementsByClassName("csiderbox"));
        children.reverse();
        parent.innerHTML = '';
        children.forEach(function (child) {
            parent.appendChild(child);
        });
    }

    window.addEventListener('load', reorderDivs);

    function calcRange(expr) {
        const pattern = /([\d\.]+)\s*([万千亿]?)/g;
        const matches = [...expr.matchAll(pattern)];
        if (matches.length !== 2) return "格式错误";

        const unitMap = { "亿": 1e8, "万": 1e4, "千": 1e3, "": 1 };

        const values = matches.map(m => parseFloat(m[1]) * unitMap[m[2] || ""]);
        const units = matches.map(m => m[2] || "");

        if (units[0] !== units[1]) return "单位不一致";

        const diff = (values[0] - values[1]) / unitMap[units[0]];
        return { value: diff, text: `${diff.toFixed(2)}${units[0]}` };
    }

    const priceContainer = document.querySelector(".csn_wbwc_mm2 table tbody");
    let lastDiff = null;

    if (priceContainer) {
        let resultRow = document.querySelector(".calc-result-row");

        const observer = new MutationObserver(() => {
            const outerText = document.querySelector('.csn_wbwc_mm2 .price_up')?.innerText;
            const innerText = document.querySelector('.csn_wbwc_mm2 .price_down')?.innerText;
            if (!outerText || !innerText) return;

            const result = calcRange(`${outerText} - ${innerText}`);
            if (typeof result === "string") return;

            let trendClass = "";
            let changeText = "";

            if (lastDiff === null) {
                // 首次赋值，变化值显示为差值本身
                changeText = result.text;
                trendClass = result.value > 0 ? "price_up" : result.value < 0 ? "price_down" : "";
            } else {
                const change = result.value - lastDiff;
                if (change > 0) {
                    trendClass = "price_up";
                    changeText = `↑ ${change.toFixed(2)}`;
                } else if (change < 0) {
                    trendClass = "price_down";
                    changeText = `↓ ${Math.abs(change).toFixed(2)}`;
                } else {
                    changeText = `→ 0.00`;
                    // 持平保持上次 class，不变
                }
            }

            lastDiff = result.value;

            observer.disconnect();

            if (!resultRow) {
                resultRow = document.createElement("tr");
                resultRow.className = "calc-result-row";

                const tdLabel = document.createElement("td");
                tdLabel.className = "k";
                tdLabel.textContent = "多空：";

                const tdValue = document.createElement("td");
                tdValue.className = "v";
                const spanValue = document.createElement("span");
                spanValue.className = "calc-result-span";
                tdValue.appendChild(spanValue);

                const tdK2 = document.createElement("td");
                tdK2.className = "k";

                const tdChange = document.createElement("td");
                tdChange.className = "v";
                const spanChange = document.createElement("span");
                spanChange.className = "calc-change-span";
                tdChange.appendChild(spanChange);

                resultRow.appendChild(tdLabel);
                resultRow.appendChild(tdValue);
                resultRow.appendChild(tdK2);
                resultRow.appendChild(tdChange);

                priceContainer.appendChild(resultRow);
            }

            const spanValue = resultRow.querySelector(".calc-result-span");
            const spanChange = resultRow.querySelector(".calc-change-span");

            spanValue.textContent = result.text;

            if (trendClass) {
                spanValue.className = `calc-result-span ${trendClass}`;
                spanChange.className = `calc-change-span ${trendClass}`;
            }
            spanChange.textContent = changeText;

            observer.observe(priceContainer, {
                childList: true,
                subtree: true,
                characterData: true
            });
        });

        observer.observe(priceContainer, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }


    function parseNumberWithUnit(str) {
        if (!str) return 0;
        let num = parseFloat(str);
        if (str.includes('万')) num *= 10000;
        else if (str.includes('千')) num *= 1000;
        else if (str.includes('亿')) num *= 100000000;
        return num;
    }

    function formatAmount(num) {
        if (num >= 1e8) {
            return (num / 1e8).toFixed(2) + '亿';
        } else if (num >= 1e4) {
            return (num / 1e4).toFixed(2) + '万';
        } else {
            return num.toFixed(2) + '元';
        }
    }

    function calculateAmount() {
        const rows = document.querySelectorAll('.mm table tbody tr');
        if (rows.length <= 2) return;

        for (let i = 1; i < rows.length - 1; i++) { // 跳过第一和最后一行
            const row = rows[i];

            // 保证整行不换行
            row.style.whiteSpace = 'nowrap';

            const priceSpan = row.querySelector('td.mock_mm_td span.price_up, td.mock_mm_td span.price_down');
            if (!priceSpan) continue;
            const price = parseFloat(priceSpan.innerText);
            if (isNaN(price)) continue;

            const countSpan = row.querySelector('td.mml span.price_draw');
            if (!countSpan) continue;
            const count = parseNumberWithUnit(countSpan.innerText.trim());
            if (isNaN(count)) continue;

            const amount = price * count * 100;

            let amountTd = row.querySelector('.amount-td');
            if (!amountTd) {
                amountTd = document.createElement('td');
                amountTd.className = 'amount-td';
                amountTd.style.textAlign = 'right';
                amountTd.style.whiteSpace = 'nowrap'; // 金额单元格不换行
                row.appendChild(amountTd);
            }
            amountTd.innerText = formatAmount(amount);
        }
    }

// 初次执行
    calculateAmount();

    const targetNode = document.querySelector('.mm table tbody');

    if (targetNode) {
        const observer = new MutationObserver(mutations => {
            if (mutations.some(m => m.target.classList && m.target.classList.contains('amount-td'))) {
                return;
            }
            observer.disconnect();
            calculateAmount();
            observer.observe(targetNode, {
                childList: true,
                subtree: true,
                characterData: true
            });
        });

        observer.observe(targetNode, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }



})()
