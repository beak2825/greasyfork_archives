// ==UserScript==
// @name         DiabloData-Skill
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  技能
// @author       班登
// @match        http://wiki.d.163.com/diablo/skills/*.htm
// @icon         https://www.google.com/s2/favicons?domain=undefined.localhost
// @grant        GM_setClipboard
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/432205/DiabloData-Skill.user.js
// @updateURL https://update.greasyfork.org/scripts/432205/DiabloData-Skill.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const urlMatch = location.href.split('/').pop().split('.')[0].split('-');
    const classType = urlMatch[0];
    const tier = urlMatch[1];

    const skillList = [];
    $('td[width="707"] p').first().children('a').each(function() {
       $(this).attr('href', $(this).attr('href').toLowerCase());
    });


    $('a[name]').each(function() {
        const engName = $(this).attr('name');
        const href = `${classType}-${tier}.htm#${engName}`.toLowerCase();
        let anchorSource = $(`a[href="${href}"]`);
        if (!anchorSource.length) anchorSource = $(`a[href="#${engName}"]`);
        console.log(href);
        let name = anchorSource.first().text();
        const reqLvl = anchorSource[0].nextSibling.textContent.match(/\d+/g)[0] - 0;
        const skillData = {
            name,
            reqLvl,
            _id: `${classType}-${tier}-${engName}`.toLowerCase(),
            classType,
            tier,
            engName
        };

        skillList.push(skillData);
    });

    skillList.forEach((data) => {
        const skillAnchor = $(`a[name="${data.engName}"`);
        const baseInfo = skillAnchor.next().find('tr > td').last().text().split('\n').map(i => i.replace(/\s+/g, ' ').trim());
        const latency = baseInfo.find(i => i.indexOf('延迟') >= 0);
        if (latency) {
            const latencyVal = latency.match(/\d/g)[0] - 0
            data.latency = latencyVal;
        }
        const reqSkill = baseInfo.find(i => i.indexOf('须要技能') >= 0);
        if (reqSkill) {
            const reqSkillVal = reqSkill.replace('须要技能: ', '').match(/[\u4e00-\u9fa5]+/g)
            if (reqSkillVal.length && reqSkillVal[0] !== '无') {
                const reqSkillIds = reqSkillVal.map(i => {
                    const fixedName = i === '心灵战锤' ? '心灵之锤' : i;
                    if (!skillList.find(s => s.name === fixedName)){
                        console.log(i, skillList);
                        return '';
                    }
                    return skillList.find(s => s.name === fixedName)._id
                });
                data.reqSkillIds = reqSkillIds;
            }
        }
        let desc = skillAnchor.parent().next().text();
        if (classType !== 'assassin'){
            if (desc.indexOf('效果') < 0) desc = skillAnchor.parent().next().next().text();
            if (desc.indexOf('效果') < 0) desc = skillAnchor.next().next().next().text();
        }
        if (!desc) desc = skillAnchor.next().next().text();
        if (!desc) desc = skillAnchor.next().next().next().text();
        data.isPassive = desc.indexOf('被动') >= 0;
        data.desc = desc.replace('效果:', '').replace('被动', '').trim();
    });

    const tableDataList = [];
    $('table[width="100%"][cellpadding="1"]').each(function() {
        const tableData = [];
        const table = $(this);
        table.find('tbody tr').each(function() {
            const text = $(this).text().split('\n').map(i => i.replace(/\s+/g, ' ').trim()).filter(i => !!i);
            if (text[0] !== '等级') {
                const dataName = text[0].replace(/\+\%/g, '').trim();
                const existIndex = tableData.findIndex(i => i.name === dataName)
                if (existIndex >= 0) {
                    tableData[existIndex].data = tableData[existIndex].data.concat(text.slice(1))
                }else {
                    tableData.push({
                        name: dataName,
                        data: text.slice(1),
                        isPercent: text[0].indexOf('%') >= 0
                    });
                }
            }
        });

        tableDataList.push(tableData);
    });

    const bonusMap = {};
    $('table[valign="left"][cellpadding="1"]').each(function() {
        const bonusData = $(this).text().split('\n').map(i => i.replace(/\s+/g, ' ').trim()).filter(i => !!i);
        const name = bonusData[0].replace('得到的额外奖励', '').trim();
        const dataStrList = bonusData.slice(1);
        const resultList = dataStrList.map(b => {
            const valMatch = b.match(/(\S+):\D+(\d+)/);
            if (!valMatch) return null;
            return {
                tip: b,
                sourceId: skillList.find(iii => iii.name === valMatch[1])._id,
                target: (tableDataList[skillList.findIndex(iii => iii.name === name)] || []).map(ii => ii.name).find(t => b.indexOf(t)>=0),
                value: valMatch[2] - 0,
                isPercent: b.indexOf('%') >= 0,
            }
        }).filter(i => !!i);
        bonusMap[name] = resultList;
    });
    if (tableDataList.length !== skillList.length) {
        console.error('length not match');
    }
    const data = skillList.map((i, index) => ({
        ...i,
        levelData: tableDataList[index],
        bonusMap: bonusMap[i.name],
    }));

    console.log(data);

    GM_setClipboard(JSON.stringify(data, null, 2));
})();