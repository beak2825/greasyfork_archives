// ==UserScript==
// @name         点击后替换JS
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  点击按钮后进行JavaScript文件替换
// @author       Rich_DooRoo
// @match        https://play.pixels.xyz/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508081/%E7%82%B9%E5%87%BB%E5%90%8E%E6%9B%BF%E6%8D%A2JS.user.js
// @updateURL https://update.greasyfork.org/scripts/508081/%E7%82%B9%E5%87%BB%E5%90%8E%E6%9B%BF%E6%8D%A2JS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetPath = '/_next/static/chunks/167.e2040ca51dd35366.js'; // 目标JS路径

    const replacements = [
        {
            search: 'q=Math.max(3,Math.floor((null!==(l=null===(i=C[0])||void 0===i?void 0:i.price)&&void 0!==l?l:0)*1.2));',
            replace: 'q=Math.max(1,Math.floor((null!==(l=null===(i=C[0])||void 0===i?void 0:i.price)&&void 0!==l?l:0)*1.0));'
        },
        {
            startPattern: 'H=e=>{var t;let{request:i,reward:n,canFill:l,onFill:a,playerClassId:r}=e,{t:o}=(0,x.$)("ui");return(0,s.jsx)',
            endPattern: '{defaultValue:"DELIVER"})})]})]})})})}',
            replace: `H = e => {
    var t;
    let { request: i, reward: n, canFill: l, onFill: a, playerClassId: r } = e, { t: o } = (0, x.$)("ui");

    // 读取当前 Orderbuy 内容，初始化为空字符串
    let storedOrderbuy = localStorage.getItem("Orderbuy") || "";
    let orderbuyArray = storedOrderbuy.split(",").filter(Boolean);

    // 查找是否已经有相同的物品，如果有则更新数量
    let itemEntryIndex = orderbuyArray.findIndex(entry => entry.split("-")[0] === i.item.name);
    if (itemEntryIndex > -1) {
        // 如果找到相同的物品，累加数量
        let [name, quantity] = orderbuyArray[itemEntryIndex].split("-");
        quantity = parseInt(quantity) + i.quantity;
        orderbuyArray[itemEntryIndex] = name + "-" + quantity;
    } else {
        // 如果是新物品，添加到数组
        orderbuyArray.push(i.item.name + "-" + i.quantity);
    }

    // 保存更新后的 Orderbuy 字符串到 localStorage
    let updatedOrderbuy = orderbuyArray.join(",");
    localStorage.setItem("Orderbuy", updatedOrderbuy);

    // 输出最终保存的 Orderbuy 数据
    console.log("Final Saved Orderbuy:", updatedOrderbuy);

    // 获取价格并显示（可以在保存后继续执行其他操作）
    const itemNameToIdMap = {
        "Flex Master 3000": "itm_iamrich"  // 仅保留一个映射
    };

    let itemId = itemNameToIdMap[i.item.name];
    let uniqueId = i.item.id || Math.random().toString(36).substr(2, 9); // 确保唯一性

    if (itemId) {
        let mid = "6630b9f054c3ca96743cad99";
        console.log("Fetching price for item:", itemId, "with mid:", mid);

        ed.Z.fetchMarketplaceListingsForItem(itemId, mid).then(data => {
            let listings = data.listings;
            if (listings && listings.length > 0) {
                let price = listings[0].price;
                let totalCost = price * i.quantity;
                document.getElementById("item-price-" + uniqueId).textContent = "单价: " + price + " 花销: " + totalCost;
            }
        }).catch(error => {
            console.error("Error fetching listings for item:", itemId, error);
        });
    }

    return (0, s.jsx)("div", {
        className: u()(k()["store-item-container"], k().order),
        children: (0, s.jsx)("div", {
            className: u()(k()["card-content-wrapper"], k()["store-locked"], { [k()["order-class-".concat(r)]]: !!r }),
            children: (0, s.jsxs)("div", {
                className: k()["card-content"],
                children: [
                    (0, s.jsxs)("div", {
                        className: k()["card-header"],
                        children: [
                            (0, s.jsx)("div", {
                                children: !!n.skill.skillType && (0, s.jsx)(U, { skill: n.skill.skillType, xp: n.skill.xp })
                            }),
                            (0, s.jsx)("div", {
                                children: (0, s.jsx)(q, {
                                    currency: w.Z.getGameCurrency(null !== (t = n.currency.currencyId) && void 0 !== t ? t : w.Z.getDefaultCurrency()),
                                    balance: n.currency.amount,
                                    styles: { display: "inline" },
                                    small: !0,
                                    short: !0
                                })
                            })
                        ]
                    }),
                    (0, s.jsx)(G, {
                        itemData: i.item,
                        itemImage: i.item.image
                    }),
                    (0, s.jsxs)("div", {
                        className: k()["item-quantity"],
                        children: ["x", (0, s.jsx)("span", { children: i.quantity })]
                    }),
                    (0, s.jsxs)("div", {
                        className: k()["card-footer"],
                        children: [
                            (0, s.jsx)("div", { className: k()["card-title"], children: i.item.name }),
                            (0, s.jsx)("div", { id: "item-price-" + uniqueId, children: itemId ? "获取价格中..." : null }),
                            (0, s.jsx)("button", {
                                type: "button",
                                className: u()(k()["btn-max"], y().pushbutton),
                                disabled: !l,
                                onClick: a,
                                children: o("store.orders.deliver", { defaultValue: "$$$Luck$$$" })
                            })
                        ]
                    })
                ]
            })
        })
    });
}`
        }
    ];

    // 修改JS内容函数
    function modifyJSContent(text) {
        replacements.forEach(replacement => {
            if (replacement.search && replacement.replace) {
                const searchRegex = new RegExp(replacement.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
                if (text.includes(replacement.search)) {
                    text = text.replace(searchRegex, replacement.replace);
                } else {
                    console.log('匹配失败:' + replacement.search);
                }
            } else if (replacement.startPattern && replacement.endPattern && replacement.replace) {
                const startIndex = text.indexOf(replacement.startPattern);
                const endIndex = text.indexOf(replacement.endPattern, startIndex);
                if (startIndex !== -1 && endIndex !== -1) {
                    text = text.substring(0, startIndex) + replacement.replace + text.substring(endIndex + replacement.endPattern.length);
                } else {
                    console.log('匹配失败:' + replacement.startPattern + ' 到 ' + replacement.endPattern);
                }
            }
        });
        return text;
    }

    // 拦截通过 <script> 标签加载的 JS 文件
    function interceptScriptTags() {
        const originalCreateElement = document.createElement;
        document.createElement = function() {
            const element = originalCreateElement.apply(this, arguments);
            if (arguments[0].toLowerCase() === 'script') {
                Object.defineProperty(element, 'src', {
                    set: function(url) {
                        if (url.endsWith('.js') && url.includes(targetPath)) {
                            fetch(url)
                                .then(response => response.text())
                                .then(text => {
                                    let modifiedText = modifyJSContent(text);
                                    const blob = new Blob([modifiedText], { type: 'text/javascript' });
                                    const newUrl = URL.createObjectURL(blob);
                                    element.setAttribute('src', newUrl);
                                });
                        } else {
                            element.setAttribute('src', url);
                        }
                    }
                });
            }
            return element;
        };
    }

    // 绑定点击事件，点击后启动拦截
    function init() {
        const button = document.createElement('button');
        button.textContent = '启动替换JS';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.left = '10px';
        button.style.zIndex = 9999;
        document.body.appendChild(button);

        button.addEventListener('click', function() {
            alert('开始拦截并替换JS文件');
            interceptScriptTags();
        });
    }

    // 等待页面加载完成后添加按钮
    window.addEventListener('load', init);

})();