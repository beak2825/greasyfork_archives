// ==UserScript==
// @name         东油大物实验选课助手
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  取消教师名称的注释
// @author       cat3399
// @license      GNU GPLv3
// @match        https://10-235-0-15.webvpn.nepu.edu.cn/*
// @grant        none
// @icon         https://bkimg.cdn.bcebos.com/pic/4bed2e738bd4b31cbe08739d80d6277f9e2ff8e4?x-bce-process=image/format,f_auto/watermark,image_d2F0ZXIvYmFpa2UyNzI,g_7,xp_5,yp_5,P_20/resize,m_lfit,limit_1,h_1080
// @downloadURL https://update.greasyfork.org/scripts/490811/%E4%B8%9C%E6%B2%B9%E5%A4%A7%E7%89%A9%E5%AE%9E%E9%AA%8C%E9%80%89%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/490811/%E4%B8%9C%E6%B2%B9%E5%A4%A7%E7%89%A9%E5%AE%9E%E9%AA%8C%E9%80%89%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
// v2.0所有功能
(function() {
    'use strict';

    function unhideAndReplace(temp, names) {
        if (temp) {
            let htmltext = temp.innerHTML;
            htmltext = htmltext.replace(/<!--\s?(.*?)\s?-->/g, '$1');
            names.forEach(function(name) {
                const regex = new RegExp(name, 'g');
                htmltext = htmltext.replace(regex, `${name}（慎选）`);
            });
            // 更新HTML
            temp.innerHTML = htmltext;
        }
    }
    // 四大天王(慢慢更新)
    const namesToReplace = ["李志刚", "刘松江"];

    // 标题栏
    const temp1 = document.querySelector("body > main > div > div.container-fluid > div:nth-child(3) > div > div.panel.panel-primary.filterable > div.panel-body > table > tbody:nth-child(1) > tr");
    unhideAndReplace(temp1, namesToReplace);

    // 内容
    const tbody = document.querySelector("body > main > div > div.container-fluid > div:nth-child(3) > div > div.panel.panel-primary.filterable > div.panel-body > table > tbody:nth-child(2)");
    if (tbody) {
        for (let i = 1; i <= tbody.children.length; i++) {
            const temp = tbody.querySelector(`tr:nth-child(${i})`);
            unhideAndReplace(temp, namesToReplace);
        }
    }
})();
// v0.3新增功能，显示已经完成的实验教师，不包括圆柱体与绪论
(function() {
    'use strict';

    function get_done_info() {
        const done_url_dict = {};
        const done_info_dict = {};
        var done_sy = document.querySelector("body > main > div > div:nth-child(7) > div.panelhi-body > table > tbody:nth-child(2)");
        for (let i = 1; i <= done_sy.children.length; i++) {
            var done_sy_one = document.querySelector(`body > main > div > div:nth-child(7) > div.panelhi-body > table > tbody:nth-child(2) > tr:nth-child(${i})`);
            let name = done_sy_one.querySelector(`td:nth-child(1)`).textContent.trim();
            let year = done_sy_one.querySelector(`td:nth-child(2)`).textContent.trim().substring(0, 9);
            let term = done_sy_one.querySelector(`td:nth-child(2)`).textContent.trim().substring(10, 11);
            let week = done_sy_one.querySelector(`td:nth-child(3)`).textContent.trim();
            let xinqi = done_sy_one.querySelector(`td:nth-child(4)`).textContent.trim();
            let jieci = done_sy_one.querySelector(`td:nth-child(5)`).textContent.trim();
            let room = done_sy_one.querySelector(`td:nth-child(6)`).textContent.trim();
            done_url_dict[name] = `https://10-235-0-15.webvpn.nepu.edu.cn/experiments?exp_name=${name}&half_semi=${term}&page=1&semi_name=${year}&week=${week}`;
            done_info_dict[name] = week + xinqi + jieci + room;
        }
        return { done_url_dict, done_info_dict };
    }

    const { done_url_dict, done_info_dict } = get_done_info();
    var tmp = document.querySelector("body > main > div > div:nth-child(7) > div.panelhi-body > table > tbody:nth-child(1) > tr")
    tmp.innerHTML = `<td> 实验名称 </td>
                <td> 学期 </td>
                <td> 周次  </td>
                <td> 星期  </td>
                <td> 节次  </td>
                <td> 房间  </td>
                <td> 台号  </td>
                <td> 成绩  </td>
                <th>操作</th>
                <td> 教师  </td>`;


    const regex = /<!--\s*<td>(.*?)<\/td>\s*-->/;
    const key = Object.keys(done_url_dict);
    const key_bk = key.slice();
    for (let u = 0; u < key.length; u++) {
        const url = done_url_dict[key[u]];
        fetch(url, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                    'Content-Type': 'text/html; charset=utf-8',
                    'Referer': 'https://10-235-0-15.webvpn.nepu.edu.cn/'
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.text();
                } else {
                    throw new Error('Network response was not ok.');
                }
            })
            .then(html => {
                const htmlContent = new DOMParser().parseFromString(html, 'text/html');
                for (let j = 1; j < 25; j++) {
                    var done_html = htmlContent.querySelector(`body > main > div > div.container-fluid > div:nth-child(3) > div > div.panel.panel-primary.filterable > div.panel-body > table > tbody:nth-child(2) > tr:nth-child(${j})`)
                    var name = done_html.querySelector(`td:nth-child(1)`).textContent.trim();
                    var room = done_html.querySelector(`td:nth-child(2)`).textContent.trim();
                    var week = done_html.querySelector(`td:nth-child(4)`).textContent.trim();
                    var xinqi = done_html.querySelector(`td:nth-child(5)`).textContent.trim();
                    var jieci = done_html.querySelector(`td:nth-child(6)`).textContent.trim();
                    var str = week + xinqi + jieci + room;
                    console.log(name)
                    if (str == done_info_dict[name]) {
                        const match = done_html.innerHTML.match(regex);
                        var insert_index = key_bk.indexOf(key[u]) + 1
                        var newTd = document.createElement("td");
                        newTd.textContent = match[1];
                        // 找到目标行
                        var targetRow = document.querySelector(`body > main > div > div:nth-child(7) > div.panelhi-body > table > tbody:nth-child(2) > tr:nth-child(${insert_index})`);
                        // 创建一个新的 td 元素并将其插入到目标行中
                        targetRow.appendChild(newTd);

                    }else{

                    }

                }
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    }
})();

(function() {
    'use strict';

    var table_head = document.querySelector("body > main > div > div:nth-child(6) > div.panelhi-body > table > tbody:nth-child(1) > tr");
    console.log(table_head.children.length);
    var lastest = document.querySelector(`body > main > div > div:nth-child(6) > div.panelhi-body > table > tbody:nth-child(1) > tr > td:nth-child(${table_head.children.length})`);
    var now_week = lastest.textContent.match(/\d+/g)[0];
    var next_week = parseInt(now_week) + 1;
    var next_next_week = parseInt(now_week) + 2;
    if (now_week <= 15) {
        var cell1 = document.createElement("td");
        cell1.textContent = ` 第${next_week}周(较准) `;
        table_head.appendChild(cell1);
        var cell2 = document.createElement("td");
        cell2.textContent = ` 第${next_next_week}周(仅供参考) `;
        table_head.appendChild(cell2);

        var table_content = document.querySelector("body > main > div > div:nth-child(6) > div.panelhi-body > table > tbody:nth-child(2)");
        for (var i = 1; i <= table_head.children.length; i++) {
            var siyan = table_content.querySelector(`tr:nth-child(${i})`);
            var name = siyan.querySelector(`td:nth-child(1)`).textContent.trim();
            var year = siyan.querySelector(`td:nth-child(2)`).textContent.trim().substring(0, 9);
            var term = siyan.querySelector(`td:nth-child(2)`).textContent.trim().substring(10, 11);
            var url1 = `https://10-235-0-15.webvpn.nepu.edu.cn/experiments?exp_name=${name}&half_semi=${term}&page=1&semi_name=${year}&week=${next_week}`;
            var url2 = `https://10-235-0-15.webvpn.nepu.edu.cn/experiments?exp_name=${name}&half_semi=${term}&page=1&semi_name=${year}&week=${next_next_week}`;
            var link1 = document.createElement('a');
            link1.className = 'btn-sm btn-info';
            link1.href = url1;
            link1.textContent = '选课';
            var link2 = document.createElement('a');
            link2.className = 'btn-sm btn-info';
            link2.href = url2;
            link2.textContent = '选课';
            var td1 = document.createElement('td');
            var td2 = document.createElement('td');
            td1.appendChild(link1);
            td2.appendChild(link2);
            siyan.appendChild(td1);
            siyan.appendChild(td2);
        }
    }
})();
