// ==UserScript==
// @name         交易星球-手续费页面 增强工具
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  高亮显示自选的期货品种
// @author       Mormont
// @match        https://www.jiaoyixingqiu.com/shouxufei
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jiaoyixingqiu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532324/%E4%BA%A4%E6%98%93%E6%98%9F%E7%90%83-%E6%89%8B%E7%BB%AD%E8%B4%B9%E9%A1%B5%E9%9D%A2%20%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/532324/%E4%BA%A4%E6%98%93%E6%98%9F%E7%90%83-%E6%89%8B%E7%BB%AD%E8%B4%B9%E9%A1%B5%E9%9D%A2%20%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    "use strict";
    const HIGHLIGHT_SYMBOLS = [
        "白银",
        "螺纹钢",
        "热卷",
        "不锈钢",
        "沪铝",
        "沪锌",
        "沪镍",
        "沪铅",
        "橡胶",
        "合成橡胶",
        "燃油",
        "沥青",
        "纸浆",
        "玻璃",
        "纯碱",
        "甲醇",
        "棉花",
        "白糖",
        "对二甲苯",
        "锰硅",
        "硅铁",
        "尿素",
        "红枣",
        "PVC",
        "玉米",
        "聚丙烯",
        "苯乙烯",
        "塑料",
        "乙二醇",
        "碳酸锂",
        "工业硅",
    ];
    const highlightColor = "#ffffb8";

    const $table = document.getElementById("heyuetbl");
    const $newTable = $table.cloneNode(true);
    const $trs = $newTable.querySelectorAll("tr");

    const log = (...rest) => {
        console.log("[MyTools]:", ...rest);
    };

    // 隐藏侧边栏
    const hideDom = () => {
        [".site-header", "#article_content", ".aside-container", ".comments-box"].forEach((item) => {
            document.querySelector(item).setAttribute("style", "display: none;");
        });
    };

    // 添加 手续费/万元
    const addFee = () => {
        let count = 0;
        $trs.forEach((el) => {
            const dataStr = el.getAttribute("data");
            if (dataStr) {
                count = 0;
                const id = dataStr.split(",")[0];
                const fee = el.querySelector(`#td_fee_all_${id}`).textContent;
                const bond = el.querySelector(`#td_bz_${id}`).textContent;
                const newColumn = document.createElement("td");
                newColumn.setAttribute("title", "买1万元标的所需的手续费");
                newColumn.setAttribute("style", "color: blue; font-weight: bold;");
                newColumn.textContent = ((fee / bond) * 10000).toFixed(2);
                el.insertBefore(newColumn, el.querySelector(`#td_mao_${id}`));
                // 不折行
                ["kai", "pz", "pj"].forEach((item) => {
                    const $el = el.querySelector(`#td_fee_${item}_${id}`);
                    $el.innerHTML = $el.innerHTML.replace("<br>", " ");
                });
                // 每跳毛利取整
                const $mao = el.querySelector(`#td_mao_${id}`);
                $mao.textContent = parseInt($mao.textContent);
            } else {
                count += 1;
                let newColumn;
                switch (count) {
                    case 1:
                        el.querySelector('td[colspan="15"]').setAttribute("colspan", 16);
                        break;
                    case 2:
                        el.querySelector('td[colspan="4"]').setAttribute("colspan", 5);
                        break;
                    case 3:
                        newColumn = document.createElement("td");
                        newColumn.setAttribute("width", 100);
                        newColumn.textContent = "手续费/万元";
                        el.appendChild(newColumn);
                        break;
                    default:
                }
            }
        });
    };

    // 高亮显示关注的标的
    const highlight = () => {
        const symbolsMap = HIGHLIGHT_SYMBOLS.reduce((acc, curr) => ({ [curr]: true, ...acc }), {});
        $trs.forEach((el) => {
            const dataStr = el.getAttribute("data");
            if (dataStr) {
                const name = el.querySelector("a").textContent.replace(/\d+/, "").trim();
                if (symbolsMap[name]) {
                    el.classList.add("xyz");
                }
            }
        });
    };

    const addStyle = () => {
        const style = document.createElement("style");
        style.innerHTML = `
        .xyz { background-color: ${highlightColor} !important; }
        .wrapper { width: 100vw !important; margin: 0 !important; white-space: nowrap; }
        `;
        document.head.appendChild(style);
    };

    // 刷新DOM
    const refreshTable = () => {
        $table.parentNode.replaceChild($newTable, $table);
    };

    // 监听table数据变化
    const monitor = () => {
        const diff = (newArr, oldArr) => {
            const diffKeys = ["id", "margin", "f_kai", "f_pz", "f_pj"];
            const diffRes = [];
            const oldMap = oldArr.reduce((acc, curr) => ({ ...acc, [curr.name]: curr }), {});

            for (const item of newArr) {
                const oldItem = oldMap[item.name];
                if (!oldItem) {
                    continue;
                }

                const diffItems = diffKeys
                    .map((k) => {
                        const val = item[k];
                        const oldVal = oldItem[k];
                        if (val !== oldVal) {
                            return { key: k, value: [val, oldVal] };
                        }
                    })
                    .filter((v) => !!v);

                if (diffItems.length) {
                    diffRes.push({ name: item.name, diff: diffItems });
                }
            }

            return diffRes;
        };

        const keyMap = {
            id: "代码",
            margin: "手续费比例",
            f_kai: "开仓",
            f_pz: "平昨",
            f_pj: "平今",
        };

        const getRes = (diffArr) => {
            return (
                diffArr
                    .map(({ name, diff }) => {
                        const str = diff.map(({ key, value }) => `${keyMap[key]}(${value[1]} -> ${value[0]})`).join(", ");
                        return `${name}: ${str}`;
                    })
                    .join("\n") || ""
            );
        };

        const tableData = [];
        $trs.forEach((el) => {
            const dataStr = el.getAttribute("data");
            if (dataStr) {
                const data = dataStr.split(",");
                tableData.push({
                    name: el.querySelector(".heyuealink").textContent.replace(/\d+$/, ""),
                    id: data[0],
                    margin: data[2], // 保证金比例
                    type: data[5], // 手续费类型, 0:百分比, 1:固定值
                    f_kai: data[6], // 手续费: 开仓
                    f_pz: data[7], // 手续费: 平昨
                    f_pj: data[8], // 手续费: 平今
                });
            }
        });

        const $updateTime = document.querySelector(".fee_uptime");
        const TIME_REGEX = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/g;
        const [feeTime, priceTime] = $updateTime.textContent.match(TIME_REGEX);
        const STORAGE_NAME = "__monitor__";
        let storage = JSON.parse(localStorage.getItem(STORAGE_NAME)) || {};
        const storageKeys = Object.keys(storage).sort((a, b) => (a > b ? -1 : 1));
        const prevTime = storageKeys[0] === feeTime ? storageKeys[1] : storageKeys[0];
        log("time keys", storageKeys, prevTime);

        const $container = document.querySelector(".entry-content");
        const $div = document.createElement("div");
        $div.setAttribute("style", "color: red; font-weight: bold; white-space: pre-wrap;");

        let str = "数据无变化";

        if (prevTime) {
            const prevData = storage[prevTime];
            const res = getRes(diff(tableData, prevData));
            str = `上次更新时间: ${prevTime}\n${res}`;
        }

        $div.textContent = str;
        $container.insertBefore($div, $container.querySelector("#article_content"));



        if (storageKeys[0] !== feeTime) {
            storageKeys.slice(3).forEach((item) => {
                delete storage[item];
            });
            storage[feeTime] = tableData;
            localStorage.setItem("__monitor__", JSON.stringify(storage));
            log("storaged");
        }
    };

    try {
        hideDom();
        addFee();
        highlight();
        addStyle();
        refreshTable();
        monitor();
    } catch (error) {
        log(error);
    }
})();