// ==UserScript==
// @name         QQ群成员列表导出工具
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  将QQ群成员的列表存储为csv格式文件
// @author       御琪幽然
// @match        https://qun.qq.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/474019/QQ%E7%BE%A4%E6%88%90%E5%91%98%E5%88%97%E8%A1%A8%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/474019/QQ%E7%BE%A4%E6%88%90%E5%91%98%E5%88%97%E8%A1%A8%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

/**
 * 参考文章：https://www.lanol.cn/post/253.html
 * 使用教程视频：https://www.bilibili.com/video/BV1QK4y1C7ZU
 * 发布于：https://greasyfork.org/zh-CN
 * 开源于：https://github.com
 * 用于：https://qun.qq.com/#/member-manage/base-manage
 *
 */

(function () {
    // 0.如果当前的网页链接不为targetURL，则不执行脚本

    // let targetURL = "https://qun.qq.com/qun-manage/#/member-manage/base-manage";
    // 在不知道什么时候换了新的网址
    let targetURL = "https://qun.qq.com/#/member-manage/base-manage";
    if (window.location.href != targetURL) {
        console.log("当前网页链接不为" + targetURL + "，脚本不执行");
        alert("当前网页链接不为" + targetURL + "，脚本不执行");
        return;
    }
    console.log("当前网页链接为" + targetURL + "，脚本开始执行");

    // 1.变量定义
    let isLogDebug = true;

    // 2.函数定义
    function consoleLog(message) {
        if (isLogDebug == false) {
            return;
        }
        console.log(message);
    }

    function getSkey() {
        let e = "skey";
        const t = document.cookie.match(new RegExp(`(^| )${e}=([^;]*)(;|$)`));
        // 如果t不为null，则返回t[2]，否则返回空字符串
        return t ? decodeURIComponent(t[2]) : '';
    }

    /**
     * 生成发送请求需要的bkn参数
     */
    function generateBKN() {
        let e = getSkey(); // 类似于@xCmnZlnC6
        let t = 5381;
        for (let n = 0, r = e.length; n < r; ++n) {
            t += (t << 5) + e.charAt(n).charCodeAt(0);
        }
        return String(t & 2147483647)
    };

    /**
     * 将Date对象转换成yyyy-MM-dd HH-mm-ss格式的字符串
     * @param {Date} date
     * @returns
     */
    function convertDateToString(date) {
        return date.getFullYear()
            + "-" + (date.getMonth() + 1)
            + "-" + date.getDate() + " " + date.getHours()
            + "-" + date.getMinutes() + "-" + date.getSeconds();
    }

    /**
     * 获取群成员信息
     * @param {*} gc QQ群号
     * @param {*} st 开始的索引
     * @param {*} end 结束的索引（与开始的索引最大值不能相差40以上）
     * @param {*} sort 排序方式
     * @param {*} bkn bkn参数
     * @returns
     */
    function get_members(gc, st, end, sort, bkn) {
        let url = "https://qun.qq.com/cgi-bin/qun_mgr/search_group_members";
        let data = `gc=${gc}&st=${st}&end=${end}&sort=${sort}&bkn=${bkn}`;

        let result = fetch(url, {
            credentials: "include",
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0",
                Accept: "application/json, text/javascript, */*; q=0.01",
                "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
            },
            referrer: "https://qun.qq.com/member.html",
            body: data,
            method: "POST",
            mode: "cors",
        })
            .then((response) => response.json())
            .then((data) => {
                consoleLog("data内容为：")
                consoleLog(data)
                consoleLog("==========")
                if (isLogDebug) {
                    // consoleLog(data);
                    data.mems.forEach(function (item) {
                        consoleLog(combineTextFromItem(item));
                    });
                }

                return data;
            });
        consoleLog("result内容为：")
        consoleLog(result)
        consoleLog("==========")
        return result;
    }

    /**
     * 将item内的信息拼接成文本
     * @param {*} item
     * @returns
     */
    function combineTextFromItem(item) {
        // 0为群主，1为管理员，2为普通成员
        let role = item.role == 0 ? "群主" : item.role == 1 ? "管理员" : "普通成员";
        // 0为男，1为女，未知为-1
        let g = item.g == 0 ? "男" : item.g == 1 ? "女" : "未知";
        let jt = item.join_time == 0 ? "未知" : new Date(item.join_time * 1000).toLocaleString();
        let lst = item.last_speak_time == 0 ? "未曾发言" : new Date(item.last_speak_time * 1000).toLocaleString();

        // 将item.nick和item.card中的转义文本修改为正常文本
        item.nick = item.nick.replace(/&amp;/g, "&");
        item.nick = item.nick.replace(/&lt;/g, "<");
        item.nick = item.nick.replace(/&gt;/g, ">");
        item.nick = item.nick.replace(/&quot;/g, "\"\"");
        item.nick = item.nick.replace(/&#39;/g, "'");
        item.nick = item.nick.replace(/&nbsp;/g, " ");

        item.card = item.card.replace(/&amp;/g, "&");
        item.card = item.card.replace(/&lt;/g, "<");
        item.card = item.card.replace(/&gt;/g, ">");
        item.card = item.card.replace(/&quot;/g, "\"\"");
        item.card = item.card.replace(/&#39;/g, "'");
        item.card = item.card.replace(/&nbsp;/g, " ");

        //将每个变量用英文引号包裹起来，然后用逗号连接起来，最后加上换行符
        return `"${item.nick}","${item.card}","${role}","${item.uin}","${g}","${item.qage}","${jt}","${lst}"\n`;
    }

    function createButton() {
        // 点击按钮，调用get_members函数，把结果以csv格式保存到本地
        // 编码使用utf-8 with bom，以防止乱码
        // 创建type="button" class="t-button t-button--theme-primary t-button--variant-base"的button
        let button = document.createElement("button");
        button.type = "button";
        button.className = "t-button t-button--theme-primary t-button--variant-base";
        button.innerHTML = "将群成员列表存储为csv文件";

        button.onclick = async function () {
            // 此时禁用按钮并修改按钮文字
            button.innerHTML = "正在获取群成员列表中";
            button.disabled = true;

            let selectedGroup = document.getElementsByClassName("_selectQun_1mksq_1 t-select-option t-is-selected")[0];
            if (selectedGroup == null || selectedGroup == undefined) {
                alert("请先手动选择一个群后，再点击按钮！");
                button.innerHTML = "将群成员列表存储为csv文件";
                button.disabled = false;
                return;
            }

            // innerText是群名
            let groupName = selectedGroup.innerText
            // innerText是带括号的群号，需要去掉括号
            let gc = selectedGroup.children[0].children[0].children[1].children[0].innerText.match(/(\d+)/)[1];

            // 从class="t-pagination__total"的元素里获取群成员数量，它的格式为“共 xx 条”，需要提取数字
            let count = document.getElementsByClassName("t-pagination__total")[0].innerText.match(/(\d+)/)[1];

            let bkn = generateBKN();

            // csv的标题
            let csvTitle = [
                "QQ昵称",
                "群昵称",
                "群身份",
                "QQ号",
                "性别",
                "Q龄",
                "入群时间",
                "最后发言时间"
            ];
            let csvContent = ""
            //将csvTitle数组里的每个元素用制表符连接起来，然后加上换行符，存储到csvContent变量里
            csvContent += csvTitle.join(",") + "\n";

            /* 旧的方法
            let memberList = [];
            let memberCount = parseInt(count);

            for (let startIndex = 0; startIndex < memberCount; startIndex += 21) {
                let endIndex = Math.min(startIndex + 20, memberCount);

                let result = get_members(gc, startIndex, endIndex, 0, bkn);
                result.then((data) => {
                    // 把mems数组里所有对象放到result数组里
                    memberList = memberList.concat(data.mems);
                });
                saveButton.innerHTML = `正在获取群成员列表(${startIndex}/${memberCount})，请耐心等待`;
                await new Promise(resolve => setTimeout(resolve, 200));
            }
            */

            let memberList = [];
            let memberCount = parseInt(count);

            let promises = [];
            for (let startIndex = 0; startIndex < memberCount; startIndex += 21) {
                let endIndex = Math.min(startIndex + 20, memberCount);
                let result = get_members(gc, startIndex, endIndex, 0, bkn);
                promises.push(result);
                button.innerHTML = `正在获取群成员列表(${startIndex}/${memberCount})，请耐心等待`;
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            Promise.all(promises).then((results) => {
                results.forEach((data) => {
                    memberList = memberList.concat(data.mems);
                });

                //改了这里↓
                //遍历memberList数组，把每个对象的属性输出到csv变量里
                memberList.forEach((item) => {
                    csvContent += combineTextFromItem(item);
                });

                //存储为csv文件
                let blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8" });
                let a = document.createElement("a");
                a.download = "群成员列表-" + groupName + "-" + convertDateToString(new Date()) + ".csv";
                a.href = URL.createObjectURL(blob);
                a.click();

                //将标题切换回去
                button.innerHTML = "将群成员列表存储为csv文件";
                button.disabled = false;
                //改了这里↑

            }).catch((error) => {
                console.error(error);
            });
        };


        // 创建class="t-button__text" style="z-index: 1;"的span
        let span = document.createElement("span");
        span.className = "t-button__text";
        span.style.zIndex = "1";
        // 将span添加到button里
        button.appendChild(span);

        return button;
    }

    /**
     * 创建容器元素
     */
    function createElement(headerPanel) {
        // 创建一个class="t-col t-col-12 t-col-offset-0 t-col-pull-0 t-col-push-0 t-col-order-0" style="padding-left: 4px; padding-right: 4px;"的div
        let div1 = document.createElement("div");
        div1.className = "t-col t-col-12 t-col-offset-0 t-col-pull-0 t-col-push-0 t-col-order-0";
        div1.style.paddingLeft = "4px";
        div1.style.paddingRight = "4px";

        // 创建一个class="t-form__item t-form-item__groupId" style="width: 100%; max-width: 580px;"的div
        let div2 = document.createElement("div");
        div2.className = "t-form__item t-form-item__groupId";
        div2.style.width = "100%";
        div2.style.maxWidth = "580px";

        // 创建一个class="t-form__label t-form__label--right" style="width: 100px;"的div
        let labelDiv = document.createElement("div");
        labelDiv.className = "t-form__label t-form__label--right";
        labelDiv.style.width = "100px";
        // 创建一个label并添加到labelDiv里
        let label = document.createElement("label");
        label.innerHTML = "脚本功能";
        labelDiv.appendChild(label);

        // 创建button
        let button = createButton();

        // 将labelDiv添加到div2里
        div2.appendChild(labelDiv);
        // 将button添加到div2里
        div2.appendChild(button);
        // 将div2添加到div1里
        div1.appendChild(div2);
        // 将div1添加到headerPanel的最前面
        headerPanel.insertBefore(div1, headerPanel.firstChild);
    }

    // 3.执行功能
    consoleLog("脚本开始执行");

    // 顶部面板元素
    let headerPanel;

    // 等到headerPanel的元素加载完毕后，再添加元素
    let checkheaderPanelExist = setInterval(function () {
        if (headerPanel != null && headerPanel != undefined) {
            createElement(headerPanel);
            clearInterval(checkheaderPanelExist);
        }
        else {
            headerPanel = document.querySelector("#app > div > div > div.t-layout._sideContainer_199np_6 > main > main > div > div > div._defaultLayout_1866x_1._powerDesignBlock_zj60n_1._powerDesignBlock_zj60n_1 > section > form > div")
        }
    }, 200);
})();
