

// ==UserScript==
// @name         BOF Stat
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  在BOF详情页显示投票的地区详情表格
// @author       Xs!
// @match        https://manbow.nothing.sh/event/event.cgi?action=More_def*
// @icon         https://www.google.com/s2/favicons?domain=nothing.sh
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452728/BOF%20Stat.user.js
// @updateURL https://update.greasyfork.org/scripts/452728/BOF%20Stat.meta.js
// ==/UserScript==
(function() {
    'use strict';

    /*
     * 统计仅分数结果
     * 分数结果 type = 'vote'
     * 包含 point、name、region 三个字段
     */
    function statVote() {
        const postList = [...document.querySelectorAll('.feature-box')];
        let res = [];
        for(let item of postList) {
            const imgEl = item.querySelector('img.flag')
            const tempRes = {
                type: 'vote',
                point: Number(item.querySelector('.fbox-icon').textContent),
                name: item.querySelector('h4.nobottommargin').textContent.trim(),
                region: imgEl ? imgEl.title : '?',
            };
            res.push(tempRes);
        }
        return res;
    }
    /*
     * 统计短评结果
     * 短评结果 type = 'short'
     * 包含 point、name、region、content 四个字段
     */
    function statShort() {
        const postList = [...document.querySelectorAll('.col_full > .col_full > .col_full > .spost')];
        let res = [];
        for(let item of postList) {
            const pointEl = item.querySelector('.points_oneline');
            const imgEl = item.querySelector('img.flag');
            const tempRes = {
                type: 'short',
                point: pointEl ? Number(pointEl.textContent) : -1,
                name: item.querySelector('.icon-user').parentNode.textContent.trim(),
                region: imgEl ? imgEl.title : '?',
                content: item.querySelectorAll('.entry-title')[1].textContent
            };
            res.push(tempRes);
        }
        return res;
    }
    /*
     * 统计长评及其回复结果
     * type = 'long' / 'response'
     * 包含 point、name、region、content、label、responses 五个字段
     * label 是一个string[]，包含形如 labelName: labelValue 形式的字符串
     * responses 是一个长评数组，包含此条长评的回复
     */
    function statLong() {
        const postList = [...document.querySelectorAll('.col_full + .spost')];
        let res = [];
        let rootTemp = null;
        for(let item of postList) {
            const contentEl = item.nextElementSibling;
            if(contentEl.querySelector('button[name=shortimpressionr-form-submit]')) {
                if(rootTemp) {
                    res.push(rootTemp);
                    rootTemp = null;
                }
                continue;
            }
            const pointEl = item.querySelector('.points_normal');
            const imgEl = item.querySelector('img.flag');
            const tempRes = {
                type: 'response',
                point: pointEl ? Number(pointEl.textContent): -1,
                name: item.querySelector('.entry-title strong').textContent.trim(),
                region: imgEl ? imgEl.title : '?',
                content: contentEl.innerHTML,
                label: [...item.querySelectorAll('.label')].map(label => label.textContent.trim())
            };
            if(rootTemp) {
                rootTemp.responses.push(tempRes);
            }
            else {
                rootTemp = {
                    ...tempRes,
                    type: 'long',
                    responses: []
                }
            }
        }
        return res;
    }
    // 取得所有的投票结果，可以直接处理这个数组
    const resJson = [...statVote(), ...statShort(), ...statLong()];
    console.log('[BOF Stat] 获取数据：', resJson);

    // 统计各个地区的投票情况
    function statRegion() {
        let resObj = {};
        let sumPoint = 0;
        let voteSum = 0;
        // 把长评的回复展开
        const wraplongRes = resJson.filter(item => item.type === 'long').reduce((prev, current) => {
            return prev.concat(current.responses);
        }, []);
        const resAll = [...resJson, ...wraplongRes];
        for(let item of resAll) {
            const region = item.region;
            if(!resObj[region]) {
                resObj[region] = {
                    count: 0,
                    point: 0,
                    pCount: 0,
                    posts: []
                };
            }
            resObj[region].count += 1;
            resObj[region].posts.push(item);
            if(item.point !== -1) {
                resObj[region].point += item.point;
                resObj[region].pCount += 1;
                sumPoint += item.point;
                voteSum += 1;
            }
        }
        // 展开成数组并排序
        const resArr = Object.getOwnPropertyNames(resObj)
        .map(region => ({
            name: region,
            result: resObj[region]
        }))
        .sort((l, r) => r.result.point - l.result.point);

        return {
            regionData: resArr,
            sumPoint,
            voteSum
        };
    }

    // 渲染区域统计结果
    function renderRegion(regionObj) {
        const {
            regionData,
            sumPoint,
            voteSum,
        } = regionObj;
        let resHtml = `<table class="table table-striped">
        <thead>
        <tr>
            <th>Region</th>
            <th>Total</th>
            <th>Total Ratio</th>
            <th>Scorers</th>
            <th>Scorers Ratio</th>
            <th>Average</th>
            <th>Only Comments</th>
        </tr>
        </thead>`;
        resHtml += regionData
        .map(region => {
            const regionName = region.name;
            const { count, point, pCount } = region.result;
            const countPercent = (pCount / voteSum * 100).toFixed(2);
            const pointPercent = (point / sumPoint* 100).toFixed(2);
            const avgPoint = (point / pCount).toFixed(2);
            const onlyComment = count - pCount;
            const regionIcon = regionName !== '?' ?
                `<img src="./images/flags/${regionName}.png" class="flag" style="margin-right: 5px; vertical-align: top;">`
                :
                '';
            return `<tr>
            <th>
                ${regionIcon}${regionName}
            </th>
            <th class="region_point">${point}</th>
            <th>${pointPercent}%</th>
            <th>${pCount}</th>
            <th>${countPercent}%</th>
            <th>${avgPoint}</th>
            <th>${onlyComment}</th>
            </tr>`
        })
        .join('');
        resHtml += '</tr></table>'
        return resHtml;
    }

    function render() {
        // 创建渲染区域
        const div = document.createElement('div');
        const contentDiv = document.createElement('div');
        div.className = 'content-wrap';
        contentDiv.className = 'container clearfix';
        div.appendChild(contentDiv);
        const target = document.querySelector('.content-wrap:nth-child(2)');
        target.parentNode.insertBefore(div, target);

        let renderHTML = '';
        // 以下放置渲染内容
        renderHTML += renderRegion(statRegion())
        contentDiv.innerHTML =renderHTML;
    }

    render();
})();