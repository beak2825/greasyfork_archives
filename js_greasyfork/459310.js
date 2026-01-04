// ==UserScript==
// @name         知乎热榜首页显示回答数、关注数、浏览数、创建者、创建时间
// @namespace    http://tampermonkey.net/
// @version      2024-03-05
// @description  在知乎的热榜页中，显示每个问题的回答数、关注数、浏览数、创建者、创建时间。
// @author       Fat Cabbage
// @license      MIT
// @match        https://www.zhihu.com/hot
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/459310/%E7%9F%A5%E4%B9%8E%E7%83%AD%E6%A6%9C%E9%A6%96%E9%A1%B5%E6%98%BE%E7%A4%BA%E5%9B%9E%E7%AD%94%E6%95%B0%E3%80%81%E5%85%B3%E6%B3%A8%E6%95%B0%E3%80%81%E6%B5%8F%E8%A7%88%E6%95%B0%E3%80%81%E5%88%9B%E5%BB%BA%E8%80%85%E3%80%81%E5%88%9B%E5%BB%BA%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/459310/%E7%9F%A5%E4%B9%8E%E7%83%AD%E6%A6%9C%E9%A6%96%E9%A1%B5%E6%98%BE%E7%A4%BA%E5%9B%9E%E7%AD%94%E6%95%B0%E3%80%81%E5%85%B3%E6%B3%A8%E6%95%B0%E3%80%81%E6%B5%8F%E8%A7%88%E6%95%B0%E3%80%81%E5%88%9B%E5%BB%BA%E8%80%85%E3%80%81%E5%88%9B%E5%BB%BA%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

let question_status_list = {};

(function () {
    'use strict';

    let wrapper_node_list = document.getElementsByClassName('HotItem-metrics');
    let links_list = document.getElementsByClassName('HotItem-content');

    (async () => {
        for (let i = 0; i < links_list.length; i++) {
            let links = links_list[i].getElementsByTagName('a')
            let href = links[0].href;

            if (/question/.test(href)) {
                let log_href = `${href}/log`

                let match = href.match(/.*\/question\/(\d+)/)
                let id = match ? match[1] : -1;

                if (question_status_list[id] == null) {
                    question_status_list[id] = {};
                }
                question_status_list[id].wrapper_node = wrapper_node_list[i];
                question_status_list[id].updated = true;

                let config = GM_getValue(id, {});

                if (config.last_updated != null) {
                    let time_diff = new Date() - new Date(config.last_updated);
                    time_diff /= 1000 * 60;

                    if (config.followers == null || config.views == null || config.answers == null || time_diff > 5) {
                        console.log("time_diff", time_diff);
                        console.log("知乎热榜首页显示回答数 case1");
                        await fetchDataRow1(href, id);
                    }
                } else {
                    console.log("知乎热榜首页显示回答数 case2");
                    await fetchDataRow1(href, id);
                }

                if (config.author == null || config.time == null) {
                    await fetchDataRow2(log_href, id);
                }

                update_interface_value();
            }
        }
    })();
})();

function fetchDataRow1(href, id) {
    return new Promise(function (resolve) {
        $.get(href, function (res) {
            let dom = new DOMParser().parseFromString(res, 'text/html');
            let values = dom.getElementsByClassName('NumberBoard-itemValue');

            let followers_num = parseInt(values[0].outerText.replaceAll(',', ''));
            let views_num = parseInt(values[1].outerText.replaceAll(',', ''));

            values = dom.getElementsByClassName('List-headerText');
            let answer_num = values[0].outerText;
            answer_num = answer_num.replaceAll(' 个回答', '').replaceAll(',', '')
            answer_num = parseInt(answer_num);

            let config = GM_getValue(id, {});

            config.followers = followers_num;
            config.views = views_num;
            config.answers = answer_num;
            config.last_updated = new Date().toISOString();

            GM_setValue(id, config);

            if (question_status_list[id] == null) {
                question_status_list[id] = {};
            }

            question_status_list[id].updated = true;

            update_interface_value();

            resolve(res);
        });
    });
}

function fetchDataRow2(href, id) {
    return new Promise(function (resolve) {
        $.get(href, function (res) {
            let dom = new DOMParser().parseFromString(res, 'text/html');
            let log_list = dom.getElementsByClassName('zm-item');
            let initial_log = log_list[log_list.length - 1];

            let child1 = initial_log.children[0];
            let author = child1.outerText;
            author = author.replaceAll('添加了问题', '').replaceAll('\n', '');

            let child2 = initial_log.querySelector('time');
            let time = child2.outerText;

            let config = GM_getValue(id, {});

            config.author = author;
            config.time = time;

            GM_setValue(id, config);

            if (question_status_list[id] == null) {
                question_status_list[id] = {};
            }

            question_status_list[id].updated = true;

            update_interface_value();

            resolve(res);
        });
    });
}

function update_interface_value() {
    for (let id in question_status_list) {

        let node = question_status_list[id].wrapper_node;
        let updated = question_status_list[id].updated;

        let config = GM_getValue(id);
        let followers_num = config.followers;
        let views_num = config.views;
        let answer_num = config.answers;
        let author = config.author;
        let created_time = config.time;

        let last_updated = '';
        if (config.last_updated != null) {
            let time_diff = new Date() - new Date(config.last_updated);
            time_diff /= 1000 * 60;

            if (time_diff > 1) {
                time_diff = Math.round(time_diff);
                last_updated = `(${time_diff}分钟前更新)`;
            } else {
                last_updated = "(刚刚更新)";
            }
        }


        if (!updated) {
            continue;
        }

        node = node.childNodes;

        let view_str;
        if (views_num < 1e4) {
            view_str = `${views_num} `;
        } else if (views_num < 1e8) {
            view_str = `${Math.floor(views_num / 1e4)} 万`;
        } else {
            view_str = `${(views_num / 1e8).toFixed(1)} 亿`;
        }

        let match = node[1].nodeValue.match(/\d+.*?热度/);
        let hot = match ? match[0] : -1;

        let row1_text = `${hot} - ${answer_num} 回答 - ${followers_num} 关注 - ${view_str}浏览${last_updated}`
        let row1_node = document.createTextNode(row1_text);

        for (let i = 1; i < node.length - 1; i++) {
            node[i].remove();
        }
        node[0].parentNode.style.bottom = '5px'
        node[0].parentNode.style.zIndex = '1'
        node[0].parentNode.insertBefore(row1_node, node[1])

        if (author != null) {
            let br = document.createElement('br');
            let row2_text = `创建 ${author} | ${created_time}`
            let row2_node = document.createTextNode(row2_text);

            node[0].parentNode.insertBefore(br, node[2]);
            node[0].parentNode.insertBefore(row2_node, node[3])
        }

        config.updated = false;
    }
}
