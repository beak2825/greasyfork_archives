// ==UserScript==
// @name         VIBScoreReader
// @namespace    https://bgm.tv/user/552807
// @version      v0.1
// @description  在番剧界面直接显示VIB评分
// @author       ImQQiaoO
// @include      /^https?:\/\/(bangumi|bgm|chii)\.(tv|in)\/subject\/.*$/
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474155/VIBScoreReader.user.js
// @updateURL https://update.greasyfork.org/scripts/474155/VIBScoreReader.meta.js
// ==/UserScript==

let curr_subject = window.location.href;
let target_url = curr_subject + "/stats";
let VIB_score = "--";

function get_aver(VIB_content) {
    let VIB_scorers_index = [];
    let VIB_scorers_num = [];
    let mark = 11;
    let VIB_marker_sum = 0;
    let total_VIB_mark = 0;
    // 将VIBContent从字符串转换为数组
    VIB_content = VIB_content[0];

    for (let j = 0; j < 10; j++) {
        VIB_scorers_index[j] = VIB_content.slice(VIB_content.indexOf("{"), VIB_content.indexOf("}") + 1);
        VIB_content = VIB_content.slice(VIB_content.indexOf("}") + 1);

        if (VIB_scorers_index[j].includes("\"vib\"")) {
            VIB_scorers_num[j] = parseInt(VIB_scorers_index[j].slice(VIB_scorers_index[j].lastIndexOf(":") + 1, VIB_scorers_index[j].lastIndexOf("}")));
        } else {
            VIB_scorers_num[j] = 0;
        }
    }

    for (let j = 0; j < 10; j++) {
        mark--;
        VIB_marker_sum += VIB_scorers_num[j];
        total_VIB_mark += mark * VIB_scorers_num[j];
    }

    return total_VIB_mark / VIB_marker_sum;
}

fetch(target_url)
    .then(response => {
        if (response.ok) {
            return response.text();
        } else {
            throw new Error('无法获取目标页面的内容');
        }
    })
    .then(pageHTML => {
        if (pageHTML.indexOf("VIB") !== -1) {
            let regex_pattern = "\"chart_root\":\"chartVIB\",\"data\":.*,\"series_set\":"; // 正则表达式
            let VIB_content = pageHTML.match(regex_pattern); // 使用match()方法匹配正则表达式
            VIB_score = get_aver(VIB_content).toFixed(4);

            // 在这里处理获取到的内容
            console.log(VIB_score);
        } else {
            VIB_score = "--";
            // 在这里处理获取到的内容
            console.log(VIB_score);
        }
        // 创建一个新元素来显示VIB评分
        let vibScoreElement = document.createElement("span");
        vibScoreElement.innerText = "VIB评分：" + VIB_score;

        // 找到原评分的元素
        let originalScoreElement = document.querySelector(".number");

        // 将vibScoreElement插入到原评分元素的后面
        originalScoreElement.parentNode.insertBefore(vibScoreElement, originalScoreElement.nextSibling);

    })
    .catch(error => {
        console.error('请求目标页面时出错:', error);
    });
