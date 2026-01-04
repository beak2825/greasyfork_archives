// ==UserScript==
// @name         mt-xuecheng
// @namespace    http://tampermonkey.net/
// @version      1.4.2
// @description  学城表格批量操作工具
// @author       Nan & Qiqi
// @match        https://km.sankuai.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465767/mt-xuecheng.user.js
// @updateURL https://update.greasyfork.org/scripts/465767/mt-xuecheng.meta.js
// ==/UserScript==

function ASLink(tbody, columnIndex) {
    const hasChinese = (str) => /[\u4E00-\u9FA5]+/g.test(str);

    const rows = tbody.getElementsByTagName('tr');
    for (const row of rows) {
        const columnNode = row.children[columnIndex];
        const unit = columnNode.textContent.trim();
        if (unit && !hasChinese(unit)) {
            const url = `https://avatar.mws.sankuai.com/avatar-hulk-new/group-new?appkey=${unit}&env=prod`;
            columnNode.firstElementChild.innerHTML = `<a href="${url}" target="_blank" rel="noopener" class="pk-link">${unit}</a>`;
        }
    }
}

function OctoLink(tbody, columnIndex) {
    const hasChinese = (str) => /[\u4E00-\u9FA5]+/g.test(str);

    const rows = tbody.getElementsByTagName('tr');
    for (const row of rows) {
        const columnNode = row.children[columnIndex];
        const unit = columnNode.textContent.trim();
        if (unit && !hasChinese(unit)) {
            const url = `https://avatar.mws.sankuai.com/#/service/detail/octo?appkey=${unit}&env=prod&q=&statusDesc&protocol&port`;
            columnNode.firstElementChild.innerHTML = `<a href="${url}" target="_blank" rel="noopener" class="pk-link">${unit}</a>`;
        }
    }
}

function AvatarLink(tbody, columnIndex) {
    // 判断字符串是否包含中文
    const hasChinese = (str) => /[\u4E00-\u9FA5]+/g.test(str);

    // 获取用户输入的表格序号和列序号
    // let [tableIndex, columnIndex] = [
    //     parseInt(prompt('请输入你要操作第几个表格：', '1')) - 1,
    //     parseInt(prompt('请输入你要操作第几列数据：', '1')) - 1
    // ];

    // 对用户输入进行合法性校验
    // tableIndex = isNaN(tableIndex) ? 0 : tableIndex;
    // columnIndex = isNaN(columnIndex) ? 0 : columnIndex;

    // let linkSystem;
    // while (true) {
    //     linkSystem = prompt('请输入你要超链接到的平台（支持Avatar、Octo、弹性）：', 'Avatar');
    //     if (linkSystem === 'Avatar' || linkSystem === 'Octo' || linkSystem === '弹性') {
    //         break;
    //     } else {
    //         alert('输入不合法，请重新输入');
    //     }
    // }

    // 获取指定表格的所有行数据
    // const rows = document.querySelector(`table:nth-of-type(${tableIndex + 1}) tbody`).querySelectorAll('tr');
    const rows = tbody.getElementsByTagName('tr');

    // 遍历所有行数据
    for (const row of rows) {
        const columnNode = row.children[columnIndex];
        const unit = columnNode.textContent.trim();
        if (unit && !hasChinese(unit)) {
            // if (linkSystem === 'Avatar') {
            //     const url = `https://avatar.mws.sankuai.com/#/service/detail/info?appkey=${unit}&env=prod`;
            //     columnNode.firstElementChild.innerHTML = `<a href="${url}" target="_blank" rel="noopener" class="pk-link">${unit}</a>`;
            // }
            // if (linkSystem === 'Octo') {
            //     const url = `https://avatar.mws.sankuai.com/#/service/detail/octo?appkey=${unit}&env=prod&q=&statusDesc&protocol&port`;
            //     columnNode.firstElementChild.innerHTML = `<a href="${url}" target="_blank" rel="noopener" class="pk-link">${unit}</a>`;
            // }
            // if (linkSystem === '弹性') {
            //     const url = `https://avatar.mws.sankuai.com/avatar-hulk-new/group-new?appkey=${unit}&env=prod`;
            //     columnNode.firstElementChild.innerHTML = `<a href="${url}" target="_blank" rel="noopener" class="pk-link">${unit}</a>`;
            // }

            const url = `https://avatar.mws.sankuai.com/#/service/detail/info?appkey=${unit}&env=prod`;
            columnNode.firstElementChild.innerHTML = `<a href="${url}" target="_blank" rel="noopener" class="pk-link">${unit}</a>`;
        }
    }

    // 弹出提示框提示批量添加超链接成功
    // alert('批量添加超链接成功');
}

function removeLink(tbody, columnIndex) {
    const hasChinese = (str) => /[\u4E00-\u9FA5]+/g.test(str);

    // const rows = tbody.getElementsByTagName('tr');
    // for (let j = 1; j < rows.length; j++) {
    //     const columes = rows[j].children;
    //     const unit = columes[columnIndex].textContent.trim()
    //     console.log(unit)
    //     if (!hasChinese(unit) && unit.length > 0) {
    //         columes[columnIndex].firstElementChild.innerHTML = '<a>' + unit + '</a>'
    //     }
    // }


    const rows = tbody.getElementsByTagName('tr');
    Array.from(rows).forEach((row) => {
        const columns = row.children;
        const unit = columns[columnIndex].textContent.trim();
        console.log(unit);
        if (!hasChinese(unit) && unit.length > 0) {
            columns[columnIndex].firstElementChild.innerHTML = '<a>' + unit + '</a>';
        }
    });
}

function changeName(tbody, columnIndex) {
    //适用于一个单元格内一个mis/name或者name/mis或者mis
    const regMisName = /^([a-z.]+\d*)[/:]([\u4e00-\u9fa5]+)$/;
    const regNameMis = /^([\u4e00-\u9fa5]+)[/:]([a-z.]+\d*)$/;
    const regMis = /^([a-z.]+\d*)$/;
    //适用于一个单元格多个mis（需要包含逗号）
    const regComma = /,|，/;
    // 获取行元素
    const rows = tbody.getElementsByTagName('tr');
    for (let j = 1; j < rows.length; j++) {
        // var columes = rows[j].getElementsByTagName('td')
        const columes = rows[j].children;
        const unit = columes[columnIndex].textContent.trim()
        console.log(unit)
        if (regMisName.test(unit)) {
            const regArr = unit.match(regMisName);
            columes[columnIndex].firstElementChild.innerHTML = '<a class=\"ct-mention\" data-type=\"ct-mention\" data-uid=\"' + regArr[1] + '\" data-anchor=\"568f1fe1-c527-4438-981a-fedb944fea5f\">@<b>' + regArr[2] + '</b></a>';
        }
        if (regNameMis.test(unit)) {
            const regArr = unit.match(regNameMis);
            columes[columnIndex].firstElementChild.innerHTML = '<a class=\"ct-mention\" data-type=\"ct-mention\" data-uid=\"' + regArr[2] + '\" data-anchor=\"568f1fe1-c527-4438-981a-fedb944fea5f\">@<b>' + regArr[1] + '</b></a>';
        }
        if (regMis.test(unit)) {
            const regArr = unit.match(regMis);
            const node = columes[columnIndex];
            fetch("https://km.sankuai.com/api/users/neixin/search?input=" + regArr[0] + "&pageSize=20&pageNo=0", {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "zh-CN,zh;q=0.9",
                    "cache-control": "no-cache",
                    "pragma": "no-cache",
                    "sec-ch-ua": "\"Google Chrome\";v=\"105\", \"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"105\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"macOS\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-requested-with": "XMLHttpRequest"
                },
                "referrer": "https://km.sankuai.com/page/1364263363?action=edit",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "include"
            }).then(data => data.json()).then(res => {
                const {data: {users}} = res;
                //const userName = users[0] ? `${Object.values(users[0])[0].name}` : ''
                //判断user是否存在
                const userName = users[0] && Object.values(users[0])[0].name ? `${Object.values(users[0])[0].name}` : '';
                //判断user的长度是否大于0
                //const userName = users.length > 0 && Object.values(users[0])[0].name ? `${Object.values(users[0])[0].name}` : '';
                if (userName) {
                    //闭包查找
                    // node.firstElementChild.innerHTML = '<a class=\"ct-mention\" data-type=\"ct-mention\" data-uid=\"' + regArr[0] + '\" data-anchor=\"568f1fe1-c527-4438-981a-fedb944fea5f\">@<b>' + userName + '</b></a>';
                    node.firstElementChild.innerHTML = `<a class="ct-mention" data-type="ct-mention" data-uid="${regArr[0]}" data-anchor="568f1fe1-c527-4438-981a-fedb944fea5f">@<b>${userName}</b></a>`;
                }
            });
        }
        if (regComma.test(unit)) {
            if ((unit.includes(',')) || (unit.includes('，'))) {
                // 按照，分为list，并且去掉空格
                const misids = unit.replace(/，/g, ',').split(',').map(item => item.trim());
                const node = columes[columnIndex];
                console.log(node)

                // const misids = ['jiangnan35', 'wuqiqi05', 'zhangnan78'];
                const promises = misids.map(misid => {
                    if (regMis.test(misid)){
                        return fetch(`https://km.sankuai.com/api/users/neixin/search?input=${misid}&pageSize=20&pageNo=0`, {
                            "headers": {
                                "accept": "*/*",
                                "accept-language": "zh-CN,zh;q=0.9",
                                "cache-control": "no-cache",
                                "pragma": "no-cache",
                                "sec-ch-ua": "\"Google Chrome\";v=\"105\", \"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"105\"",
                                "sec-ch-ua-mobile": "?0",
                                "sec-ch-ua-platform": "\"macOS\"",
                                "sec-fetch-dest": "empty",
                                "sec-fetch-mode": "cors",
                                "sec-fetch-site": "same-origin",
                                "x-requested-with": "XMLHttpRequest"
                            },
                            "referrer": "https://km.sankuai.com/page/1364263363?action=edit",
                            "referrerPolicy": "strict-origin-when-cross-origin",
                            "body": null,
                            "method": "GET",
                            "mode": "cors",
                            "credentials": "include"
                        }).then(data => data.json()).then(res => {
                            const {data: {users}} = res;
                            const userName = users[0] ? `${Object.values(users[0])[0].name}` : '';
                            return [userName, misid];
                        });
                    }
                    else if (regMisName.test(misid)){
                        return [misid.split('/')[1], misid.split('/')[0]]
                    }
                    else if (regNameMis.test(misid)){
                        return [misid.split('/')[0], misid.split('/')[1]]
                    }
                });

                    Promise.all(promises).then(userNames => {
                        const userList = [];
                        var pushValues = ''
                        for (let i = 0; i < userNames.length; i++) {
                            if (userNames[i][0]) {
                                userList.push(userNames[i]);
                                pushValues += '<a class=\"ct-mention\" data-type=\"ct-mention\" data-uid=\"' + userNames[i][1] + '\" data-anchor=\"568f1fe1-c527-4438-981a-fedb944fea5f\">@<b>' + userNames[i][0] + '</b></a>'
                            }
                        }
                        // console.log(userList);
                        console.log(pushValues)
                        node.firstElementChild.innerHTML = pushValues
                    });
            }
        }
    }

    // alert('批量@人员成功')
}


function fnChangeMis() {
    let td = contextmenuElement.tagName.toLowerCase() === "td" ? contextmenuElement : contextmenuElement.parentNode;
    const col = td.cellIndex;
    let tbody = td.parentNode.parentNode;
    changeName(tbody, col)
}

function fnChangeAppkeyAvatar() {
    console.log("change appkey", contextmenuElement)
    let td = contextmenuElement.tagName.toLowerCase() === "td" ? contextmenuElement : contextmenuElement.parentNode;
    const col = td.cellIndex;
    let tbody = td.parentNode.parentNode;
    AvatarLink(tbody, col)
}

function fnChangeAppkeyOcto() {
    console.log("change appkey", contextmenuElement)
    let td = contextmenuElement.tagName.toLowerCase() === "td" ? contextmenuElement : contextmenuElement.parentNode;
    const col = td.cellIndex;
    let tbody = td.parentNode.parentNode;
    OctoLink(tbody, col)
}

function fnChangeAppkeyAs() {
    console.log("change appkey", contextmenuElement)
    let td = contextmenuElement.tagName.toLowerCase() === "td" ? contextmenuElement : contextmenuElement.parentNode;
    const col = td.cellIndex;
    let tbody = td.parentNode.parentNode;
    ASLink(tbody, col)
}

function fnRemoveLink() {
    console.log("change appkey", contextmenuElement)
    let td = contextmenuElement.tagName.toLowerCase() === "td" ? contextmenuElement : contextmenuElement.parentNode;
    const col = td.cellIndex;
    let tbody = td.parentNode.parentNode;
    removeLink(tbody, col)
}

let contextmenuElement;
contextmenuElement = null;


// 兼容学城1.0和2.0
function createMenuNode(content, fn, version) {
    // 兼容1.0和2.0样式
    console.log(content, version)
    // var menuNode = null;
    let menuNode;
    if (version === 1) {
        menuNode = document.createElement("div");
        menuNode.setAttribute("class", "ct-table-context-item")
        menuNode.textContent = content
    } else {
        menuNode = document.createElement("li");
        menuNode.setAttribute("class", "ant-menu-item ant-menu-item-only-child");
        menuNode.setAttribute("role", "menuitem");
        menuNode.setAttribute("tabindex", "-1");
        menuNode.setAttribute("aria-disabled", "false");
        menuNode.setAttribute("data-menu-id", "rc-menu-uuid-71892-11-toggleColHeader");
        menuNode.innerHTML = `<span class="ant-menu-title-content">
       <div class="oafe-drop-menu-item-wrapper item-wrapper-normal"><span class="sub-item-label">
               <div style="line-height: 1; overflow: hidden;">
                   <div style="font-size: 12px; line-height: 16px;">` + content + `</div>
               </div>
           </span></div>
       </span>
       `
    }

    menuNode.addEventListener("click", fn);
    return menuNode
}

// 油猴脚本执行
(function () {
    'use strict';

    document.oncontextmenu = function (e) {
        let menu = document.querySelector(".pk-table-context-menu") ? document.querySelector(".pk-table-context-menu") : document.querySelector(".ct-table-context-menu");
        if (menu && !menu.contains(e.target)) {
            const version = "ct-table-context-menu" === menu.className ? 1 : 2;
            contextmenuElement = e.target;
            let split
            if (version === 1) {
                split = document.createElement("div");
                split.setAttribute("class", "ant-menu-item-divider")
            }
            if (version === 2) {
                split = document.createElement("li");
                split.setAttribute("class", "ant-menu-item-divider");
            }

            let menuNode1 = createMenuNode("批量@", fnChangeMis, version);
            let menuNode2 = createMenuNode("删除超链接", fnRemoveLink, version);
            let menuNode3 = createMenuNode("+Avatar超链接", fnChangeAppkeyAvatar, version);
            let menuNode4 = createMenuNode("+Octo超链接", fnChangeAppkeyOcto, version);
            let menuNode5 = createMenuNode("+弹性超链接", fnChangeAppkeyAs, version);

            if (version === 1) {
                menu.append(split, menuNode1, menuNode2, menuNode3, menuNode4, menuNode5);
            }
            if (version === 2) {
                menu.children[0].children[0].insertBefore(menuNode1, menu.children[0].children[0].children[0])
                const nodes = [split, menuNode5, menuNode4, menuNode3, menuNode2];
                nodes.forEach(node => {
                    menuNode1.insertAdjacentElement('afterend', node);
                });
            }


        }
    }
})();