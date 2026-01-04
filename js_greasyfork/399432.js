// ==UserScript==
// @name         ckFreq-关键词密度词频统计-GzNotes.com
// @namespace    https://www.gznotes.com/manual/helpDoc/ckFreq.php
// @description  自动统计页面关键词次数和频率，部分关键词取自meta keywords，部分来自自定规则。
// @version      0.1
// @license      GPL-3.0-only
// @author       Daniel Ting
// @create       2020-04-03
// @supportURL   https://www.gznotes.com/manual/helpDoc/ckFreq.php
// @exclude      *://*.gznotes.com/wp-admin*
// @match        *://*.gznotes.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399432/ckFreq-%E5%85%B3%E9%94%AE%E8%AF%8D%E5%AF%86%E5%BA%A6%E8%AF%8D%E9%A2%91%E7%BB%9F%E8%AE%A1-GzNotescom.user.js
// @updateURL https://update.greasyfork.org/scripts/399432/ckFreq-%E5%85%B3%E9%94%AE%E8%AF%8D%E5%AF%86%E5%BA%A6%E8%AF%8D%E9%A2%91%E7%BB%9F%E8%AE%A1-GzNotescom.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (parent !== self) return;
    let div = document.createElement('div'),
        htmlA = `
<style>
#ckFreqLogo{float:left;clear:left;width:99px;}
.hide{display:none;}
.kFrqBg{background:#009fff;color:#fff;}
#ckFreq th,
#ckFreq td{text-align:center;border:1px solid #00daff;min-width:90px;}
#kFrqBar{height:auto;width:18px;font-size:14px;position:absolute;right:-18px;cursor:pointer}
</style>
<b id="ckFreqLogo" class="kFrqBg">ckFreq</b>
<b id="kFrqBar" class="kFrqBg">展开·关闭</b>
<b id="kFrqDesc">2% - 8%，推荐 5%</b>
<table id="ckFreq">
<thead class="kFrqBg">
<tr>
<th>key</th>
<th>frq</th>
<th>insensitive</th>
</tr>
</thead>
<tbody>`,
        htmlB = `</tbody></table>`,

        //过滤部分无意义，不能组成词条的标点
        //有的关键词需要空格，所以空格不过滤了
        allText = document.body.innerText.replace(/[。，！？—、|·…\t\r\n]*/g, ''),
        allLen = allText.length,
        kwMeta = document.querySelector('[name=keywords]'),
        pageKW = kwMeta ? kwMeta.content.split(',') : [],
        customKw = [];
    let ps = document.querySelectorAll('.single article .entry-content p');
    if (ps) {
        ps = Array.from(ps).filter(o => o.innerText.trim());
        let pl = ps.length;
        //let count = 0;
        while (pl--) {
            let p = ps[pl];
            if (~p.innerText.indexOf('关键词：')) {
                let pText = p.innerText.replace('关键词：', '');
                customKw = pText && pText.split('、');
                break;
            }
            // if (count++ > 20) break;
        }
    }
    let keys = new Set(pageKW.concat(customKw).filter(o => o));
    Array.from(keys).forEach(o => {
        let l = o.length,
            matchRes = allText.match(new RegExp(`${o}`, 'g')),
            matchResLow = allText.match(new RegExp(`${o}`, 'gi')),
            times = matchRes ? matchRes.length : 0,
            timesLow = matchRes ? matchResLow.length : 0;
        htmlA += `
<tr>
<td>${o}</td>        
<td>${(100 * (l * times) / allLen).toFixed(1)}% (${times})</td>        
<td>${(100 * (l * timesLow) / allLen).toFixed(1)}% (${timesLow})</td>        
</tr>`;
    });
    div.style = 'top:20%;left:5px;max-width:600px;position:fixed;text-align:center;background:#fff;min-height:120px';
    div.innerHTML = htmlA + htmlB;
    document.body.append(div);
    div.querySelector('#kFrqBar').addEventListener('click', () => {
        div.querySelectorAll('#ckFreqLogo,#kFrqDesc,#ckFreq').forEach(o => o.classList.toggle('hide'));
    });
})();