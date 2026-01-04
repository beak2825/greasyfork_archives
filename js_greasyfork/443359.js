// ==UserScript==
// @name         看看我赚了多少钱
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  我就看看赚了多少钱
// @author       Chengguan
// @match        https://avalon.gaoding.com/*
// @match        https://ke.huaban.com/admin/*
// @match        https://market.gaoding.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gaoding.com
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @run-at       document-body
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443359/%E7%9C%8B%E7%9C%8B%E6%88%91%E8%B5%9A%E4%BA%86%E5%A4%9A%E5%B0%91%E9%92%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/443359/%E7%9C%8B%E7%9C%8B%E6%88%91%E8%B5%9A%E4%BA%86%E5%A4%9A%E5%B0%91%E9%92%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';

     function relativeLocate(dayNum = 0) {
        var dataObject = new Date();
        dataObject.setHours(dataObject.getHours() + 8 + dayNum * 24);
        var dataStr = dataObject.toJSON().substr(0, 10);

        var timeStart_str = `${dataStr}+00:00:00`
        var timeEnd_str = `${dataStr}+23:59:59`

        return ({
            start: timeStart_str,
            end: timeEnd_str
        });
    }

    let business_id = 57;
    let page_size = 100;
    let prevList = [];


    function getData(page_num = 1, timeRange, resolve) {
        GM_xmlhttpRequest({
            method: "get",
            url: `https://api-market.gaoding.com/oms/admin/orders?business_id=${business_id}&status=7&page_num=${page_num}&page_size=${page_size}&created_at%5Bgte%5D=${timeRange.start}&created_at%5Blte%5D=${timeRange.end}`,
            // data: 'typeName=【' + id + '】' + res.data.title + '&content=' +res.rows[i].title + '&answer='+myAnswer+'&options=' +JSON.stringify(myOptions),
            headers:  {
                // "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function(res){
                if(res.status === 200){
                    console.log(`第${page_num}页: 成功`)

                    const json = JSON.parse(res.responseText);
                    prevList = [...prevList, ...json]
                    if (json.length >= page_size) {
                        return getData(page_num + 1, timeRange, resolve);
                    } else {
                        resolve(prevList);
                    }
                }else{
                    console.log('失败')
                    console.log(res)
                }
            },
            onerror : function(err){
                console.log('error')
                console.log(err)
            }
        });
    }

    function printData(list) {
        const data = [];
        const map = {};
        let plusOrderNumber = 0;
        list.forEach((item) => {
          // const goodName = item.skus[0].ref_body.name;
          const goodName = item.skus.map((sku) => sku.ref_body.name).join("\n");
          if (map[goodName]) {
            map[goodName]["数量"] += 1;
            map[goodName]["价格"] += item.amount;
          } else {
            map[goodName] = {
              商品名称: goodName,
              数量: 1,
              价格: item.amount,
            };
            data.push(map[goodName]);
          }

          if (goodName.includes("稿定")) {
            plusOrderNumber += 1;
          }
        });

        data.sort((a, b) => a["数量"] - b["数量"]);
        console.table(data);

        // 按价格排序
        const priceGroup = []
        const maps = {};
        list.forEach((item) => {
            if (!maps[item.amount]) {
                maps[item.amount] = {'价格': item.amount, '订单笔数': 0, '合计金额': 0 };
                priceGroup.push(maps[item.amount]);
            }
            maps[item.amount]['订单笔数'] += 1;
            maps[item.amount]['合计金额'] = maps[item.amount]['订单笔数'] * item.amount;
        })

        console.table(priceGroup);
    }

    GM_registerMenuCommand('【素材】今天', () => {
        // relativeLocate(0);
        const result = new Promise((resolve) => {
            const timeRage = relativeLocate(0);
            console.info(`时间：${timeRage.start} -- ${timeRage.end}`);
            getData(1, timeRage, resolve);
        });
        result.then(printData);
    }, 't');

    GM_registerMenuCommand('【素材】昨天', () => {
       // relativeLocate(0);
        const result = new Promise((resolve) => {
            const timeRage = relativeLocate(-1);
            console.info(`时间：${timeRage.start} -- ${timeRage.end}`);
            getData(1, timeRage, resolve);
        });
        result.then(printData);
    }, 'y');

    GM_registerMenuCommand('【素材】前天', () => {
       const result = new Promise((resolve) => {
        const timeRage = relativeLocate(-2);
        console.info(`时间：${timeRage.start} -- ${timeRage.end}`);
        getData(1, timeRage, resolve);
        });
        result.then(printData);
    }, 'b');

//     GM_registerMenuCommand('【素材】统计', () => {
//         var nodes = [...document.querySelectorAll('.gda-table-row>td:nth-of-type(3)')];
//         var maps = {};
//         var all = nodes.reduce((acc, node) => {
//             var num = Number(node.innerText.replace(/\D+/, ''));
//             maps[num] = (maps[num] || 0) + 1;
//             return acc + num;
//         }, 0);

//         var prices = Object.keys(maps).sort((a, b) => parseInt(b) - parseInt(a)).map(key => {
//             var label = `价格 ${key}：`
//             return `${label.padEnd(15)} ${maps[key]}笔`
//         });

//         var messageStr = `
//     我今天赚了 ${all}
//     订单数：${nodes.length}
//     平均单价： ${all / nodes.length}
//     ------------------
//             ${prices.join('\n            ')}
// `;
//         console.info(messageStr);
//         alert(messageStr);
//     }, 's');
})();