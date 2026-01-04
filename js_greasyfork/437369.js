// ==UserScript==
// @name         启信宝增强
// @namespace    https://github.com/the-eric-kwok/my_userscripts
// @version      0.14
// @description  在启信宝公司页面插入复制公司名称、复制电话、复制地址、复制高管信息按钮
// @author       EricKwok
// @supportURL   https://github.com/the-eric-kwok/my_userscripts/issues
// @match        *://www.qixin.com/*
// @match        *://www.szjzy.org.cn/member*
// @match        *://xib.smartapp.knowlegene.com/marketing/*
// @require      https://cdn.jsdelivr.net/npm/clipboard@2.0.8/dist/clipboard.min.js
// @icon         https://www.qixin.com/favicon.ico
// @run-at       document-idle
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/437369/%E5%90%AF%E4%BF%A1%E5%AE%9D%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/437369/%E5%90%AF%E4%BF%A1%E5%AE%9D%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

let love = false;

/**
 * Auto remove on-page advertisement
 * @param {string} selector CSS selector of AD the root node of AD content
 */
function removeAd(selector) {
    window.setInterval(function () {
        if (document.querySelectorAll(selector).length > 0) {
            for (let ad of document.querySelectorAll(selector)) {
                ad.parentNode.removeChild(ad);
                ad.remove();
            }
        }
    }, 100);
}

/**
 * Copy a string to system clipboard
 * @param {string} str String to be copied
 */
function copyMe(str) {
    /**
     * Copy to clipboard in legacy(old) way, this is a fallback option, in order to be compatible with old browser like IE.
     */
    function _legacyCopy() {
        console.log("正在使用传统方法复制");
        let tmpInput = document.createElement('input');
        document.insertAdjacentHTML("afterend", tmpInput)
        tmpInput.value = str;
        tmpInput.focus();
        tmpInput.select();
        if (document.execCommand('copy')) {
            document.execCommand('copy');
        }
        tmpInput.blur();
        console.log('复制成功');
        tmpInput.remove();

    }

    if (navigator.clipboard && window.isSecureContext) {
        console.log("正在使用 navigator clipboard api 进行复制操作");
        navigator.clipboard.writeText(str)
            .then(() => {
                console.log('复制成功');
            })
            .catch(err => {
                console.log("navigator clipboard api 复制时出错，将使用传统方法进行复制")
                _legacyCopy();
            });
    } else {
        _legacyCopy();
    }
}

/**
 * 在元素内注入复制按钮
 * @param {HTMLElem} elem 要注入复制按钮的页面元素
 * @param {String} text 复制到剪贴板的文本
 * @param {String} className 复制按钮的自定义 className
 * @param {String} style 复制按钮的自定义 style
 * @param {String} injectAt 注入位置，可选的值为：beforebegin、afterbegin、beforeend、afterend
 * @returns {Boolean} 如果执行完成则返回 true，否则返回 false
 */
function addCopyBtn(elem, text, className = "", style = "", injectAt = "beforeend") {
    if (!elem) {
        return false;
    }
    let id = parseInt(Math.random() * 1000);
    let copyBtn = ` <a id="btn${id}" data-clipboard-text="${text}" class="${className}" style="${style}">复制</a>`
    elem.insertAdjacentHTML(injectAt, copyBtn);
    let clipboard = new ClipboardJS(`#btn${id}`);
    clipboard.on('success', function () {
        document.querySelector(`#btn${id}`).innerText = "成功✅";
        window.setTimeout(function () {
            document.querySelector(`#btn${id}`).innerText = "复制";
        }, 1000);
    });
    return true;
}

/**
 * 生成范围内随机数
 * @param {int} min: 最小值
 * @param {int} max: 最大值
 * @returns `number`
 */
function randBetween(min, max) {
    if (min > max) {
        let tmp = max;
        max = min;
        min = tmp;
    }
    return parseInt(Math.random() * (max - min + 1) + min, 10)
}

/**
 * Shows an alert with a message in specific format when called
 * @param {string} msg Message to be shown in error message
 */
function errorAlert(msg) {
    let loveLetter = [
        "你老公又在写 bug 了！赶紧拍个照告诉他！",
        "脚本出问题啦，拍个照发给老公修复噢～",
        "绝对不是脚本的问题！肯定是启信网更改了页面排版！不管怎么说还是拍个照告诉老公吧～",
    ];
    if (love)
        alert(`${loveLetter[randBetween(0, loveLetter.length - 1)]}\n出问题的网址是：${location.href}\n错误信息：${msg}`);
    else
        alert(`脚本出现了问题\n出问题的网址是：${location.href}\n错误信息：${msg}`);
}

function loveUxxx() {
    // Change avator
    if (document.querySelectorAll("img.avator").length > 0) {
        for (let avator of document.querySelectorAll("img.avator")) {
            avator.src = "https://i.loli.net/2021/11/08/dfo6OqKGVjRgwzB.gif";
        }
    }
    if (location.href.includes("qixin.com/user/home/center")) {
        if (document.querySelectorAll(".has-img").length > 0) {
            for (let avatar of document.querySelectorAll(".has-img")[0].children) {
                avatar.src = "https://i.loli.net/2021/11/08/dfo6OqKGVjRgwzB.gif";
            }
        }
    }
}

function qixinEnhance() {
    window.onload = window.setTimeout(function () {
        removeAd(".app-corner-marker");
        removeAd(".web-diversion-container");
        removeAd(".app-web-diversion-default");
        removeAd(".fixed-tool");
        removeAd(".app-home-carousel");
        removeAd(".footer-top");
        removeAd(".app-events-dialog-config-modal");
        removeAd(".app-favorite-tip");
        if (love) {
            loveUxxx();
        }

        let companyName = "";
        let telephone = "";
        let address = "";
        let senior = "";

        // 替换分隔符
        let delimiter = /[、，。\/\\\.,兼]/g;
        // 需要排除的职位（匹配「其他人员」「xx董事」「董事」「xx委员xx」，但不匹配「董事长」、「董事会」等）
        let job = /其他人员[,\s]|[^,\s]*董事[,\s]|[^,\s]*董事$|[^,\s]*委员[^,\s]*[,\s]?/g;
        // 将职位括号内内容删除
        let quote = /（.*?）|\(.*?\)/g;
        // 删除开头或末尾的分隔符
        let commaAtBeginingOrEnd = /^\s*,|,\s*$/g;

        if (location.href.includes("qixin.com/search")) {
            window.setInterval(function () {
                // 搜索结果页注入
                document.querySelectorAll("div.company-item > div.col-2 > div.col-2-1 > .company-title").forEach((elem) => {
                    // 插入复制公司标题按钮
                    if (!elem.innerText.match(/复制|✅/)) {
                        addCopyBtn(elem, elem.innerText.trim(), "margin-l-0-3x font-14", "color:#1678F0;font-weight: normal;");
                    }
                });
                document.querySelectorAll("div.company-item > div.col-2 > div.col-2-1 > div:nth-child(4) > span:nth-child(1)").forEach((elem) => {
                    // 插入复制公司邮箱按钮（当公司无邮箱信息时此栏显示的是电话，因此也需要处理电话的情况）
                    if (!elem.innerText.match(/复制|✅/)) {
                        let innerText = elem.innerText.replace("邮箱：", "").replace("电话：", "").replace("地址：", "").trim();
                        if (innerText !== "-") {
                            addCopyBtn(elem, innerText);
                        }
                    }
                })
                document.querySelectorAll("div.company-item > div.col-2 > div.col-2-1 > div:nth-child(4) > span:nth-child(2)").forEach((elem) => {
                    // 插入复制公司电话按钮
                    if (!elem.innerText.match(/复制|✅/)) {
                        let innerText = elem.innerText.replace("电话：", "").trim();
                        if (innerText !== "-") {
                            addCopyBtn(elem, innerText);
                        }
                    }
                });
                document.querySelectorAll("div.company-item > div.col-2 > div.col-2-1 > div:nth-child(5) > span").forEach((elem) => {
                    // 插入复制公司地址按钮
                    if (!elem.innerText.match(/复制|✅/)) {
                        let innerText = elem.innerText.replace("地图显示", "").replace("最新地址", "").replace("地址：", "").trim();
                        if (innerText !== "-") {
                            addCopyBtn(elem.querySelector("a"), innerText, null, null, "beforebegin");
                        }
                    }
                });
            }, 1000);
        } else if (location.href.includes("qixin.com/publicly/") || location.href.includes("qixin.com/company/")) {
            // 公司详情页注入
            /**
             * Add copy info button to page.
             * @param {string} companyName Company name which will be copid to clipboard when button clicked
             * @param {string} telephone Telephone number which will be copid to clipboard when button clicked
             * @param {string} address Company address which will be copid to clipboard when button clicked
             * @param {string} senior Senior executive of company which will be copid to clipboard when button clicked
             */
            function addBtns(companyName, telephone, address, senior) {
                if (arguments.length < 4) {
                    console.error("Arguments of function addBtns not match, should be exactly 4 args.");
                    errorAlert("Arguments of function addBtns not match, should be exactly 4 args.")
                    return;
                }
                let companyCase;
                if (location.href.includes("qixin.com/publicly"))
                    companyCase = 'publicy';
                else if (location.href.includes("qixin.com/company/") && (!document.querySelector(".info-hk")))
                    companyCase = 'company';
                else if (document.querySelector(".info-hk"))
                    companyCase = 'hk_company';
                else
                    companyCase = 'default';
                let _class = {
                    'publicy': 'head-tag font-12 inline-block isBlue m-l-10',
                    'company': 'head-tag font-12 inline-block isBlue m-l-10',
                    'hk_company': 'label label-yellow font-12',
                    'default': ''
                };
                let ids = ["copy_com", "copy_tel", "copy_add", "copy_sen"];
                let items = ["公司名称", "电话", "地址", "高管信息"];
                let _btnHtml = (companyCase === 'hk_company') ? "" : "<br>";
                for (let i = 0; i < arguments.length; i++) {
                    if (arguments && arguments[i].length > 0) {
                        _btnHtml += `<a id="${ids[i]}" class="${_class[companyCase]}">复制${items[i]}</a>`;
                    }
                }
                if (document.querySelector(".app-head-basic"))
                    document.querySelector(".app-head-basic").querySelector(".claim-tag").insertAdjacentHTML("afterend", _btnHtml);
                else if (document.querySelector(".company-name"))
                    document.querySelector(".company-name").insertAdjacentHTML("afterend", _btnHtml);
                else if (document.querySelector(".title"))
                    document.querySelector(".title").insertAdjacentHTML("beforeend", _btnHtml)
                for (let i = 0; i < arguments.length; i++) {
                    if (arguments[i].length > 0) {
                        let _args = arguments;
                        let _i = i;
                        document.getElementById(ids[_i]).onclick = function () {
                            copyMe(_args[_i]);
                            let originalText = document.getElementById(ids[_i]).innerText;
                            document.getElementById(ids[_i]).innerText = "✅复制成功！";
                            setTimeout(() => document.getElementById(ids[_i]).innerText = originalText, 1000);
                        }
                    }
                }
            }
            // 从「head」栏中读取
            if (document.querySelector(".phone-valid")) {
                let telElem = document.querySelector(".phone-valid").parentElement.getElementsByClassName("span-info");
                if (telElem.length > 0) {
                    telephone = telElem[0].innerText.trim();
                } else errorAlert("Telephone number inside header not found.");
            } else console.log("HTML class \".phone-valid\" not found")
            if (document.querySelector(".company-name")) {
                companyName = document.querySelector(".company-name").innerText;
                console.log("name: " + companyName);
            } else console.log("HTML class \".company-name\" not found")

            // 从「企业概况」栏中读取
            if (document.getElementById("overview") && !document.getElementById("overview").innerText.includes("暂无信息")) {
                let table = document.getElementById("overview").getElementsByTagName("tbody");
                if (table.length > 0) {
                    let rows = table[0].rows;
                    for (let row of rows) {
                        for (let i = 0; i < row.cells.length; i++) {
                            if (row.cells[i].innerHTML.includes("地址")) {
                                address = (address.length > 0) ? address : row.cells[i + 1].innerText.replace("查看地图", "").replace("附近企业", "").trim();
                            }
                            else if (row.cells[i].innerHTML.includes("企业名称")) {
                                companyName = (companyName.length > 0) ? companyName : row.cells[i + 1].innerText.trim();
                            }
                            else if (row.cells[i].innerHTML.includes("联系电话")) {
                                telephone += (telephone.length == 0 ? "" : ',') + row.cells[i + 1].innerHTML.trim();
                            }
                        }
                    }
                } else errorAlert("Table inside #overview element not found.");
            } else console.log("HTML element id \"overview\" not found or doesn't contain information.");

            // 从「高管信息」栏中读取
            if (document.getElementById("employee") && !document.getElementById("employee").innerText.includes("暂无信息")) {
                let table = document.getElementById("employee").getElementsByTagName("tbody");
                if (table.length > 0) {
                    let rows = table[0].rows;
                    for (let j = 0; j < rows.length; j++) {
                        let row = rows[j];
                        for (let i = 0, count = 0; i < row.cells.length && count < 4; i++) {
                            if (row.cells[i].innerHTML.includes("姓名")) {
                                let _job = rows[j + 1].cells[i + 1].innerText.trim().replace(/\s/g, "").replace(delimiter, ",").replace(job, "").replace(quote, "").replace(commaAtBeginingOrEnd, "");
                                if (_job.length > 0) {
                                    senior += row.cells[i + 1].innerText.replace("查看简历", "").trim() + ":";
                                    senior += _job;
                                    senior += "、";
                                    count++;
                                }
                            }
                        }
                    }
                    senior = senior.substring(0, senior.length - 1);
                } else errorAlert("Table inside #employee element not found.");
            } else console.log("HTML element id \"employee\" not found or doesn't contain information.");

            // 从「工商信息」栏中读取
            if (document.getElementById("icinfo") && !document.getElementById("icinfo").innerText.includes("暂无信息")) {
                let table = document.getElementById("icinfo").getElementsByTagName("tbody");
                if (table.length > 0) {
                    let rows = table[0].rows;
                    for (let row of rows) {
                        for (let i = 0; i < row.cells.length; i++) {
                            if (row.cells[i].innerHTML.includes("地址")) {
                                address = row.cells[i + 1].innerText.replace("查看地图", "").replace("附近企业", "").trim();
                            }
                            else if (row.cells[i].innerHTML.includes("联系电话")) {
                                telephone += (telephone.length == 0 ? "" : ',') + row.cells[i + 1].innerHTML.trim();
                            }
                        }
                    }
                } else errorAlert("Table inside #icinfo element not found.");
            } else console.log("HTML element id \"icinfo\" not found or doesn't contain information.");

            // 从「主要人员」栏中读取
            if (document.getElementById("employees") && !document.getElementById("employees").innerText.includes("暂无信息")) {
                let table = document.getElementById("employees").getElementsByTagName("tbody");
                if (table.length > 0) {
                    let rows = table[0].rows;
                    for (let row of rows) {
                        for (let i = 0; i < row.cells.length; i++) {
                            if (row.cells[i].innerHTML.includes("ent-name")) {
                                let name = row.cells[i].querySelector(".ent-name>.ui-link-shareholder").querySelector("a");
                                if (!name) name = row.cells[i].querySelector(".ent-name>.ui-link-shareholder");  // 如果高管姓名非超链接，则直接读取 ui-link-shareholder
                                let _job = row.cells[i + 1].innerText.trim().replace(/\s/g, "").replace(delimiter, ",").replace(job, "").replace(quote, "").replace(commaAtBeginingOrEnd, "");
                                if (_job.length > 0) {
                                    senior += name.innerText.trim() + ":";
                                    senior += _job;
                                    senior += "、";
                                }
                            }
                        }
                    }
                    senior = senior.substring(0, senior.length - 1);
                } else errorAlert("Table inside #employees element not found.");
            } else console.log("HTML element id \"employees\" not found or doesn't contain information.");

            // 从「企业概况」栏中读取（香港公司）
            if (document.getElementById("appHkOverview") && !document.getElementById("appHkOverview").innerText.includes("暂无信息")) {
                let table = document.getElementById("appHkOverview").getElementsByTagName("tbody");
                if (table.length > 0) {
                    let rows = table[0].rows;
                    for (let row of rows) {
                        for (let i = 0; i < row.cells.length; i++) {
                            if (row.cells[i].innerHTML.includes("地址")) {
                                address = (address.length > 0) ? address : row.cells[i + 1].innerText.replace("查看地图", "").replace("附近企业", "").trim();
                            }
                            else if (row.cells[i].innerHTML.includes("企业名称")) {
                                companyName = (companyName.length > 0) ? companyName : row.cells[i + 1].innerText.trim();
                            }
                            else if (row.cells[i].innerHTML.includes("联系电话")) {
                                telephone += (telephone.length == 0 ? "" : ',') + row.cells[i + 1].innerHTML.trim();
                            }
                        }
                    }
                } else errorAlert("Table inside #appHkOverview element not found.");
            } else console.log("HTML element id \"icinfo\" not found or doesn't contain information.");

            // 从「高管信息」栏中读取（香港公司）
            if (document.getElementById("hkExecutive") && !document.getElementById("hkExecutive").innerText.includes("暂无信息")) {
                let table = document.getElementById("hkExecutive").getElementsByTagName("tbody");
                if (table.length > 0) {
                    let rows = table[0].rows;
                    for (let j = 0; j < rows.length; j++) {
                        let row = rows[j];
                        for (let i = 0, count = 0; i < row.cells.length && count < 4; i++) {
                            if (row.cells[i].innerHTML.includes("姓名")) {
                                let _job = rows[j + 1].cells[i + 1].innerText.trim().replace(/\s/g, "").replace(delimiter, ",").replace(job, "").replace(quote, "").replace(commaAtBeginingOrEnd, "");
                                if (_job.length > 0) {
                                    senior += row.cells[i + 1].innerText.replace("查看简历", "").trim() + ":";
                                    senior += _job;
                                    senior += "、";
                                    count++;
                                }
                            }
                        }
                    }
                    senior = senior.substring(0, senior.length - 1);
                } else errorAlert("Table inside #hkExecutive element not found.");
            } else console.log("HTML element id \"employees\" not found or doesn't contain information.");
            addBtns(companyName, telephone, address, senior);
        }
    }, 1000);
}

function szjzyEnhance() {
    window.onload = function () {
        document.querySelectorAll(".name").forEach((elem) => {
            let companyName = elem.firstChild.data;
            let id = parseInt(Math.random() * 10000);
            let btnHtml = `<a id="btn${id}" data-clipboard-text="${companyName}">复制公司名称</a>`
            elem.parentElement.insertAdjacentHTML("afterend", btnHtml);
            let clipboard = new ClipboardJS(`#btn${id}`);
            clipboard.on('success', function () {
                document.querySelector(`#btn${id}`).innerText = "复制成功✅";
                window.setTimeout(function () {
                    document.querySelector(`#btn${id}`).innerText = "复制公司名称";
                }, 1000);
            });
            console.log(companyName);
        });
    }
}

function xibEnhance() {
    if (location.href.includes("xib.smartapp.knowlegene.com/marketing/track")) {
        window.setInterval(function () {
            if (document.querySelector(".el-dialog--primary") && !document.querySelector("#copyCompanyName")) {
                let companyName = document.querySelector(".el-dialog--primary").getAttribute("aria-label").split("-")[0];
                let copyBtn = `<a id="copyCompanyName" data-clipboard-text="${companyName}"> 复制公司名称</a>`
                document.querySelector(".el-dialog--primary").querySelector(".el-dialog__title").insertAdjacentHTML("afterend", copyBtn);
                let clipboard = new ClipboardJS(`#copyCompanyName`);
                clipboard.on('success', function () {
                    document.querySelector(`#copyCompanyName`).innerText = "复制成功✅";
                    window.setTimeout(function () {
                        document.querySelector(`#copyCompanyName`).innerText = "复制公司名称";
                    }, 1000);
                });
            }
        }, 100);
    } else if (location.href.includes("xib.smartapp.knowlegene.com/marketing/expand")) {
        let interval = window.setInterval(function () {
            let nameElem = document.querySelector("#knowlegene-marketing > div.exact-marketing-wrapper > div.main-content-box > div > div:nth-child(2) > div:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(2)");
            if (nameElem && nameElem.innerText !== "-") {
                let elems = []
                // 企业基本信息 -> 企业名称
                elems.push(document.querySelector("#knowlegene-marketing > div.exact-marketing-wrapper > div.main-content-box > div > div:nth-child(2) > div:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(2)"))
                // 企业基本信息 -> 注册地址
                elems.push(document.querySelector("#knowlegene-marketing > div.exact-marketing-wrapper > div.main-content-box > div > div:nth-child(2) > div:nth-child(2) > table > tbody > tr:nth-child(7) > td"));
                // 企业陌拜营销线索 -> 企业名称
                elems.push(document.querySelector("#knowlegene-marketing > div.exact-marketing-wrapper > div.main-content-box > div > div:nth-child(3) > div:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(2)"));
                // 企业陌拜营销线索 ->  注册地址
                elems.push(document.querySelector("#knowlegene-marketing > div.exact-marketing-wrapper > div.main-content-box > div > div:nth-child(3) > div:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(2)"));
                // 企业陌拜营销线索 -> 企业联系电话
                elems.push(document.querySelector("#knowlegene-marketing > div.exact-marketing-wrapper > div.main-content-box > div > div:nth-child(3) > div:nth-child(2) > table > tbody > tr:nth-child(3) > td:nth-child(2)"));
                // 企业陌拜营销线索 -> 办公地址
                elems.push(document.querySelector("#knowlegene-marketing > div.exact-marketing-wrapper > div.main-content-box > div > div:nth-child(3) > div:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(4)"));
                // 企业陌拜营销线索 -> 董事长/总裁/总经理
                elems.push(document.querySelector("#knowlegene-marketing > div.exact-marketing-wrapper > div.main-content-box > div > div:nth-child(3) > div:nth-child(2) > table > tbody > tr:nth-child(4) > td:nth-child(2)"));
                for (let elem of elems) {
                    addCopyBtn(elem, elem.innerText);
                }
                window.clearInterval(interval);
            }
        }, 1000);
        window.setInterval(function () {
            if (document.querySelector(".el-dialog--primary") && !document.querySelector("#copyCompanyName")) {
                let companyName = document.querySelector(".el-dialog--primary").getAttribute("aria-label").split("-")[0];
                let copyBtn = `<a id="copyCompanyName" data-clipboard-text="${companyName}"> 复制公司名称</a>`
                document.querySelector(".el-dialog--primary").querySelector(".el-dialog__title").insertAdjacentHTML("afterend", copyBtn);
                let clipboard = new ClipboardJS(`#copyCompanyName`);
                clipboard.on('success', function () {
                    document.querySelector(`#copyCompanyName`).innerText = "复制成功✅";
                    window.setTimeout(function () {
                        document.querySelector(`#copyCompanyName`).innerText = "复制公司名称";
                    }, 1000);
                });
            }
        }, 100);
    }
}

(function () {
    'use strict';
    if (location.href.includes("qixin.com")) {
        qixinEnhance();
    } else if (location.href.includes("szjzy.org.cn")) {
        szjzyEnhance();
    } else if (location.href.includes("xib.smartapp.knowlegene.com")) {
        xibEnhance();
    }

})();