// ==UserScript==
// @name         mjai.ekyu.moe 牌谱分析汉化
// @name:en      mjai.ekyu.moe Mahjong Log Report zh-cn translation
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  汉化mjai.ekyu.moe牌谱分析页面
// @description:en  Translating reports of mjai from English to Simplified Chinese.
// @author       JCarlson
// @match        https://mjai.ekyu.moe/report/*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ekyu.moe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448847/mjaiekyumoe%20%E7%89%8C%E8%B0%B1%E5%88%86%E6%9E%90%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/448847/mjaiekyumoe%20%E7%89%8C%E8%B0%B1%E5%88%86%E6%9E%90%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

/**
 * @param {string} kyokuString 英文局名
 */
const kyokuConvert = (kyokuString) => {

    let matchResult = kyokuString.match(/^(East|South|West|North)\s*(\d)(-(\d+))?$/);

    if (matchResult) {
        let resultString = "";
        resultString += ({'East': "东", "South": "南", "West": "西", "North": "北"})[matchResult[1]];
        resultString += matchResult[2] + '局';
        if (matchResult[4]) resultString += matchResult[4] + "本场";
        return resultString;
    }
    
    return kyokuString;
}

const personConvert = (person) => ({"Shimocha": "下家", "Toimen": "对家", "Kamicha": "上家", "Self": "自家"})[person] || person;
const scoreWay = (score) => ({"Tsumo by": "自摸", "Ron by": "荣和"})[score] || score;

/**
 * @param {string} endStatus 英文结束状态
 */
const endStatusConvert = (endStatus) => {
    if (endStatus === 'Ryuukyoku') return "流局";

    let matchResult = endStatus.match(/^((Tsumo by)|(Ron by))&nbsp;(Shimocha|Toimen|Kamicha|Self).(\d+)$/u); //这里使用'u'的理由是会涉及到手指unicode。

    if (matchResult) {
        //Tsumoby / Ronby -> 1
        //座位 -> 4
        //分数 -> 5
        return personConvert(matchResult[4]) + scoreWay(matchResult[1]) + " " + matchResult[5] + " 点";
    }

    return endStatus;
}

const turnConvert = (turnText) => {
    let matchResult = turnText.match(/^Turn (\d+) $/);
    if (matchResult) return "第" + matchResult[1] + "巡 ";
    return turnText;
}
/**
 * @param {string} shanten 
 * @returns 
 */
const shantenConvert = (shanten) => {
    const texts = ["听牌", "一向听", "两向听", "三向听", "四向听", "五向听", "六向听"];
    let shantenText = shanten.trim()
    if (shantenText === 'tenpai') return texts[0];
    let matchResult = shantenText.match(/^(\d) shanten$/);
    if (matchResult) {
        return texts[parseInt(matchResult[1])] || shanten;
    }
    return shanten;
}

/**
 * @param {string} actionText 
 */
const actionTextConvert = (actionText) => ({
    'Discard' : '打',
    'Pass': '过',
    'Chii': '吃',
    'Pon': '碰',
    'Kan': '杠',
    'Ron': '荣和',
    'Tsumo': '自摸'
})[actionText] || actionText;

/**
 * @param {ChildNode} actionNode
 */
const actionNodeConvertion = (actionNode) => {
    if (actionNode.nodeType === 3) {
        let nodeValue = actionNode.nodeValue.trim();
        actionNode.nodeValue = " " + actionTextConvert(nodeValue) + " ";
    }
}


/**
 * @param {HTMLElement} section 
 */
const translateSection = (section) => {

    let [heading, replay, stats] = section.childNodes;

    // 单局标题
    let kyokuText = heading.firstChild.firstChild.innerText;
    let newKyokuText = kyokuConvert(kyokuText)
    heading.firstChild.firstChild.innerText = newKyokuText;
    let endStatusText = heading.lastChild.firstChild.innerHTML;
    heading.lastChild.firstChild.innerHTML = endStatusConvert(endStatusText);

    // 回放
    replay.firstChild.firstChild.innerText = "回放查看";

    // EV
    stats.childNodes.forEach((gameStat, index) => {
        if (index === 0) {
            // EV
            gameStat.firstChild.innerText = newKyokuText + "开始时的最终期望";
            let table = gameStat.lastChild;
            let thead_tr = table.firstChild.firstChild;
            let theadText = ["玩家", "当前点数", "一位率(%)", "二位率(%)", "三位率(%)", "四位率(%)"]
            thead_tr.childNodes.forEach((th, index) => {
                th.innerText = theadText[index];
            })

            let tbody = table.lastChild;
            let tbodyPlayerTexts = ["自家", "下家", "对家", "上家"];
            tbody.childNodes.forEach((tr, index) => {
                tr.firstChild.innerText = tbodyPlayerTexts[index];
            })
        } else {
            let childNodes = gameStat.childNodes;
            // 第一个child：Summary
            let summary = childNodes[0];

            // 巡目
            let turn = summary.firstChild.nodeValue;
            summary.firstChild.nodeValue = turnConvert(turn);
            // 巡目信息
            let turn_info = summary.lastChild;
            // 向听数
            let turn_info_HTML = "";
            let shanten = turn_info.childNodes[0];
            turn_info_HTML += " &nbsp;&nbsp;&nbsp;" + shantenConvert(shanten.nodeValue) + "&nbsp;&nbsp;&nbsp;";
            // 判断子节点数量
            if (turn_info.childNodes.length === 3) {
                // 具有loss信息
                let myAction = turn_info.childNodes[1].innerText.slice(2);
                let actionCounts = turn_info.childNodes[2].nodeValue.slice(1);
                turn_info_HTML += " " + actionCounts + "种决策中<span class=\"order-loss\">排名第" + myAction + "</span>";
            }
            turn_info.innerHTML = turn_info_HTML;


            // 第二个child：自己手牌
            let tehai_state = childNodes[1];
            tehai_state.childNodes.forEach(li => {
                if (li.hasAttributes()) {
                    const before = li.getAttribute('before');
                    if (before) {
                        const attributeText = before.trim();
                        // 两种类型： Draw 或者 某家切牌
                        if (attributeText === 'Draw') {
                            li.setAttribute('before', "摸 ");
                        } else if (attributeText.match(/^(Shimocha|Toimen|Kamicha).*cuts/u)) {
                            let person = personConvert(attributeText.match(/^(Shimocha|Toimen|Kamicha).*cuts/u)[1]);
                            li.setAttribute('before', person + "打 ");
                        }
                    }
                    const after = li.getAttribute('after');
                    if (after) {
                        li.setAttribute('after', " 并宣言立直")
                    }
                }
            })

            // 第三个child: <span>玩家打牌
            childNodes[2].childNodes.forEach(node => actionNodeConvertion(node));

            // 第四个到倒数第二个child，Mortal引擎答案
            for (let i = 3; i < childNodes.length - 1; i++) {
                actionNodeConvertion(childNodes[i]);
            }

            // 最后一个child，Details
            let details = childNodes[childNodes.length - 1];

            let table = details.firstChild;

            // 替换表头 Action
            table.firstChild.firstChild.firstChild.childNodes[0].nodeValue = "行动 (";
            let q_function = table.firstChild.firstChild.childNodes[1];
            q_function.innerHTML = "最大回报 (" + q_function.innerHTML + ")";
            let pi_function = table.firstChild.firstChild.childNodes[2];
            pi_function.innerHTML = "执行的概率*100 (" + pi_function.innerHTML + ")";

            let tbody = table.lastChild;
            tbody.childNodes.forEach(tr => {
                tr.childNodes.forEach(td => {
                    td.childNodes.forEach(node => actionNodeConvertion(node));
                })
            })

            // 添加中文 Summary
            let detailSummary = document.createElement('summary');
            detailSummary.appendChild(document.createTextNode("详细"));
            details.insertBefore(detailSummary, details.firstChild);
        }
    })

}

(function() {
    'use strict';

    // 标题部分

    {
        document.querySelector('.subtitle').innerHTML += ("<div>汉化作者： JCarlson</div>");
        document.querySelector('.subtitle').nextSibling.firstChild.innerText = "页面布局";
    }

    // 页面布局

    {
        const vhFixer = (id, text) => {
            let parent = document.querySelector('#' + id).parentElement;
            const radioButton = parent.firstChild;
            const cloned = radioButton.cloneNode(true);
            parent.innerHTML = "";
            parent.appendChild(cloned);
            parent.innerHTML += text;
        }
    
        vhFixer("radio_style_v", "纵向");
        vhFixer("radio_style_h", "横向");
    }

    let [summary, metadata, faq] = document.querySelectorAll('details');

    // 游戏简介
    {
        summary.firstChild.innerHTML = "游戏简介";

        let kyokuList = summary.lastChild.firstChild;
        let endStatusList = summary.lastChild.lastChild;

        kyokuList.childNodes.forEach(kyokuItem => {
            const kyokuText = kyokuItem.firstChild.innerText;
            kyokuItem.firstChild.innerText = kyokuConvert(kyokuText);
        })

        endStatusList.childNodes.forEach(endStatusItem => {
            const endStatusText = endStatusItem.firstChild.innerHTML;
            endStatusItem.firstChild.innerHTML = endStatusConvert(endStatusText);
        })

    }
    // 元数据
    {
        metadata.firstChild.innerHTML = "元数据";

        let metadataHeaders = document.querySelectorAll('dt');

        let texts = ["分析引擎", "Softmax 温度系数 (\uD835\uDF0F)", "游戏时长", "玩家ID", "Log ID", "牌谱读取时间", "牌谱分析时间", "评分", "mjai-reviewer 版本号", "报告生成时间"];

        metadataHeaders.forEach((header, index) => {
            header.innerHTML = texts[index];
        })
    }
    // FAQ
    {
        faq.lastChild.innerText = "在线FAQ"
    }

    // 每一局的牌谱处理
    {
        let sections = document.querySelectorAll('section');
        sections.forEach(section => translateSection(section));
    }

})();