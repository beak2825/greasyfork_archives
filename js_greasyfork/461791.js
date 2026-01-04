// ==UserScript==
// @name         TTAM assets
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  assets search
// @author       You
// @match        https://business.tiktok.com/manage/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461791/TTAM%20assets.user.js
// @updateURL https://update.greasyfork.org/scripts/461791/TTAM%20assets.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    try{
    const scrollAuto = (sum) => {
        const allItems = document.querySelectorAll('.side-list-item.item').length;
        if(allItems < sum) {
            const ele = document.querySelector('.list-wrapper');
            ele && (ele.scrollTop = ele.scrollHeight);
            setTimeout(() => {
                scrollAuto(sum);
            }, 500)
        } else {
            console.log('ready')
        }
    }
    const org_id = (new URLSearchParams(location.search)).get('org_id')
    const fetchAssets = (page = 1) => fetch(`https://business.tiktok.com/api/v2/bm/asset/list/?org_id=${org_id}&attr_source=&source_biz_id=&attr_type=web&asset_type=8&page=${page}&limit=50`, {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
            "sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Google Chrome\";v=\"110\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-csrftoken": "20IMTxgQ0VYU3bqOyu6sNt6LN7FR4kjF"
        },
        "referrer": "https://business.tiktok.com/manage/tiktok?org_id=7072278056253014018",
        "referrerPolicy": "origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    }).then(res => res.json()).then(res => res.data);
    const onePage = await fetchAssets(1);
    scrollAuto(onePage.pagination.total_count)
    const pages = Math.ceil(onePage.pagination.total_count / 50);
    const allData = await Promise.all(Array(pages).fill(0).map((_, pageIndex) => pageIndex === 0 ? Promise.resolve(onePage.assets) : fetchAssets(pageIndex+1).then(res => res.assets)))
    console.log(allData.flat())
    const filter = document.createElement('input');
    filter.addEventListener('input', e => {
        const filterV = e.target.value
        const filterData = allData.flat().filter(e =>filterV ? e.asset_id.toLowerCase().includes(filterV.toLowerCase()) || e.asset_name.toLowerCase().includes(filterV.toLowerCase()):true)
        Array.from(document.querySelectorAll('.side-list-item.item')).forEach(ele => {
            if(filterData.some(d => ele.querySelector('.content .name.vi-tooltip').innerText.trim() === d.asset_name.trim())){
                ele.style.display = 'flex'
            } else {
                ele.style.display = 'none'
            }
        })
    })
    document.querySelector('.asset-list-container .operator').appendChild(filter)
    }catch(err) {
        console.error(err)
    }
})();