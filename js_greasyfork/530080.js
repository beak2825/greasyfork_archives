// ==UserScript==
// @name        选股通盯盘增强
// @author      binary4cat
// @namespace   http://tampermonkey.net/
// @version     2.0.0
// @description 优化xuangutong.com.cn/dingpan页面体验
// @license     Proprietary; All rights reserved. Redistribution or modification prohibited.
// @copyright   2025 binary4cat. Unauthorized copying or distribution is strictly forbidden.
// @match       https://xuangutong.com.cn/dingpan
// @run-at      document-end
// @grant       GM_xmlhttpRequest
// @connect     apphq.longhuvip.com
// @connect     apigate.10jqka.com.cn
// @connect     gist.githubusercontent.com
// @connect     api.github.com
// @require     https://cdn.jsdelivr.net/npm/layui@2.10.0/dist/layui.min.js
// @require     https://cdn.jsdelivr.net/npm/@antv/g2@5.2.12/dist/g2.min.js
// @resource    layUI https://cdn.jsdelivr.net/npm/layui@2.10.0/dist/css/layui.min.css
// @grant       GM_getResourceText
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/530080/%E9%80%89%E8%82%A1%E9%80%9A%E7%9B%AF%E7%9B%98%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/530080/%E9%80%89%E8%82%A1%E9%80%9A%E7%9B%AF%E7%9B%98%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 注入layui样式
    const layuiStyle = GM_getResourceText('layUI');
    GM_addStyle(layuiStyle);

    // 注入其他样式
    GM_addStyle(`
        .stock-badge-corner {
             position: relative;
             top: -0.5em;
             right: -0.2em;
             font-size: 0.6em;
             padding: 0.2em 0.4em;
             color: yellow;
             font-weight: bold;
             border: 0.15em solid red;
             border-radius: 50%;
         }
     `);

    // 拆分cookie键值对
    function parseCookie (cookieStr) {
        const eqIndex = cookieStr.indexOf('=');
        if (eqIndex === -1) return { name: cookieStr.trim(), value: '' };
        const name = cookieStr.substring(0, eqIndex).trim();
        const value = cookieStr.substring(eqIndex + 1).trim();
        return { name, value };
    }
    // 封装 GM_xmlhttpRequest 为 Promise
    function asyncRequest (config) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                ...config,
                onload: resolve,
                onerror: reject
            });
        });
    }

    // 封装安全定时器
    function safeInterval (func, interval) {
        let lastExec = Date.now();
        const loop = () => {
            const now = Date.now();
            if (now - lastExec >= interval) { // 时间戳验证间隔
                func();
                lastExec = now;
            }
            requestAnimationFrame(loop); // 或 setTimeout(loop, 0)
        };
        loop();
    }

    // 封装板块强度表格数据
    function bkqdTable () {
        let body = ''

        let formData = new FormData();
        formData.append('Index', '0');
        formData.append('Order', '1');
        formData.append('PhoneOSNew', '2');
        formData.append('Type', '1');
        formData.append('VerSion', '5.11.0.1');
        formData.append('ZSType', '7');
        formData.append('a', 'RealRankingInfo');
        formData.append('apiv', 'w33');
        formData.append('c', 'ZhiShuRanking');
        formData.append('st', '80');

        return asyncRequest({
            method: "POST",
            url: 'https://apphq.longhuvip.com/w1/api/index.php',
            headers: {
                'Host': 'apphq.longhuvip.com',
                "Accept-Language": "zh-Hans-CN;q=1.0, en-CN;q=0.9",
                "Accept": "/",
                "Connection": "keep-alive",
                "User-Agent": "lhb/5.11.1 (com.kaipanla.www; build:0; iOS 14.6.0) Alamofire/5.11.1",
            },
            data: formData
        }).then(res => {
            // 处理情绪数据
            if (res.status === 200) {
                try {
                    let data = JSON.parse(res.responseText);
                    const rows = data.list.map(obj => {
                        return `<tr><td>${obj[1]}</td><td>${obj[2]}</td><td>${obj[4]}</td><td>${(obj[5] / 1e8).toFixed(2)}亿</td><td>${(obj[6] / 1e8).toFixed(2)}亿</td><td>${(obj[12] / 1e8).toFixed(2)}亿</td></tr>`;
                    });
                    body = rows.join('');
                    return `<table class="layui-table" lay-skin="line" lay-size="sm" lay-even>
  <colgroup>
    <col width="150">
    <col width="150">
    <col>
  </colgroup>
  <thead>
    <tr>
      <th>板块</th>
      <th>强度</th>
      <th>涨速</th>
      <th>成交额</th>
      <th>主力净额</th>
      <th>300W大单净额</th>
    </tr>
  </thead>
  <tbody>
    ${body}
  </tbody>
</table>`
                } catch (e) { console.error('数据解析错误:', e); }
            }
        });
    }

    // 封装大幅回撤表格
    function dfhcTable () {
        let body = ''
        return asyncRequest({
            method: "GET",
            url: 'https://apphq.longhuvip.com/w1/api/index.php?Index=0&Order=0&PhoneOSNew=2&Type=0&VerSion=5.11.0.1&a=SharpWithdrawalList&apiv=w33&c=HomeDingPan&st=20',
            headers: { "Content-Type": "application/json" }
        }).then(res => {
            // 处理情绪数据
            if (res.status === 200) {
                try {
                    let data = JSON.parse(res.responseText);
                    data.info.sort((a, b) => a[5] - b[5])
                    for (let obj of data.info) {
                        // 名称追加标签
                        let name = obj[1]
                        if (obj[3]) {
                            name += ` <span class="layui-badge">${obj[3]}</span>`
                        }
                        if (obj[2] > 0) {
                            name += ` <span class="layui-badge layui-bg-orange">融</span>`
                        }
                        // 涨跌幅设置红绿色
                        let zdf = obj[6].toFixed(2)
                        if (zdf > 0) {
                            zdf = `<text style="color: #ff5722;">${zdf}%</text>`
                        } else {
                            zdf = `<text style="color: #16b777;">${zdf}%</text>`
                        }
                        body += `<tr><td>${obj[0]}</td><td>${name}</td><td>${obj[4]}</td><td>${obj[5].toFixed(2)}%</td><td>${zdf}</td></tr>`
                    }
                    return `<table class="layui-table" lay-skin="line" lay-size="sm" lay-even>
  <colgroup>
    <col width="150">
    <col width="150">
    <col>
  </colgroup>
  <thead>
    <tr>
      <th>股票代码</th>
      <th>股票名称</th>
      <th>价格</th>
      <th>最大回撤幅度</th>
      <th>涨跌</th>
    </tr>
  </thead>
  <tbody>
    ${body}
  </tbody>
</table>`
                } catch (e) { console.error('数据解析错误:', e); }
            }
        });
    }

    // 封装权重表现表格
    function qzbxTable () {
        let body = ''
        return asyncRequest({
            method: "GET",
            url: 'https://apphq.longhuvip.com/w1/api/index.php?Index=0&Order=0&PhoneOSNew=2&Type=0&VerSion=5.11.0.1&a=WeightPerformanceList&apiv=w33&c=HomeDingPan&st=17',
            headers: { "Content-Type": "application/json" }
        }).then(res => {
            // 处理情绪数据
            if (res.status === 200) {
                try {
                    let data = JSON.parse(res.responseText);
                    data.info.sort((a, b) => b[2] - a[2])
                    for (let obj of data.info) {
                        // 涨跌幅设置红绿色
                        let zdf = obj[2].toFixed(2)
                        if (zdf > 0) {
                            zdf = `<text style="color: #ff5722;">${zdf}%</text>`
                        } else {
                            zdf = `<text style="color: #16b777;">${zdf}%</text>`
                        }
                        // 涨速设置红绿色
                        let zs = obj[3].toFixed(2)
                        if (zs > 0) {
                            zs = `<text style="color: #ff5722;">${zs}%</text>`
                        } else {
                            zs = `<text style="color: #16b777;">${zs}%</text>`
                        }
                        body += `<tr><td>${obj[0]}</td><td>${obj[1]}</td><td>${zdf}</td><td>${zs}</td><td>${(obj[4] / 1e8).toFixed(2)}亿</td></tr>`
                    }
                    return `<table class="layui-table" lay-skin="line" lay-size="sm" lay-even>
  <colgroup>
    <col width="150">
    <col width="150">
    <col>
  </colgroup>
  <thead>
    <tr>
      <th>板块代码</th>
      <th>板块名称</th>
      <th>涨跌幅</th>
      <th>涨速</th>
      <th>成交额</th>
    </tr>
  </thead>
  <tbody>
    ${body}
  </tbody>
</table>`
                } catch (e) { console.error('数据解析错误:', e); }
            }
        });
    }

    // 封装严重异动卡片数据
    function yzydtxPanel () {
        let body = ''

        let formData = new FormData();
        formData.append('PhoneOSNew', '2');
        formData.append('Token', '0');
        formData.append('VerSion', '5.11.0.1');
        formData.append('UserID', '0');
        formData.append('a', 'GetPianLiZhi_Index');
        formData.append('apiv', 'w33');
        formData.append('c', 'StockBidYiDong');

        return asyncRequest({
            method: "POST",
            url: 'https://apphq.longhuvip.com/w1/api/index.php',
            headers: {
                'Host': 'apphq.longhuvip.com',
                "Accept-Language": "zh-Hans-CN;q=1.0, en-CN;q=0.9",
                "Accept": "/",
                "Connection": "keep-alive",
                "User-Agent": "lhb/5.11.1 (com.kaipanla.www; build:0; iOS 14.6.0) Alamofire/5.11.1",
            },
            data: formData
        }).then(res => {
            // 处理情绪数据
            if (res.status === 200) {
                try {
                    let data = JSON.parse(res.responseText);
                    data.List.sort((a, b) => {
                        // 1. 主条件：下标2为1的在前，0在后
                        if (a[2] !== b[2]) {
                            return b[2] - a[2]; // 1组在前，0组在后
                        }
                        // 2. 次条件：同组内，下标4的值降序排列
                        return b[6] - a[6];
                    });
                    for (let obj of data.List) {
                        // 当日次日角标
                        let drcr = ''
                        if (obj[2] == 0) {
                            drcr = `<span class="layui-badge layui-bg-orange">当日</span>`
                        } else if (obj[2] == 1) {
                            drcr = `<span class="layui-badge layui-bg-blue">次日</span>`
                        }

                        // 涨跌幅红绿色
                        let zdf = `${obj[4]}%`
                        if (obj[4] > 0) {
                            zdf = `<text style="color: #ff5722;">${obj[4]}%</text>`
                        } else if (obj[4] < 0) {
                            zdf = `<text style="color: #16b777;">${obj[4]}%</text>`
                        }

                        // 提示已触发严重异动
                        let yzyd = ''
                        if (obj[4] > obj[8] && obj[2] == 0) {
                            yzyd = `💥<b style="color: #ff5722;"> 已触发严重异动（是否停牌还要看监管情况）</b>`
                        }

                        body += `<div class="layui-panel" style="margin: 2px;">
  <div style="padding: 10px;">
  <p>${obj[1]} ${zdf}  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;      ${obj[5]}日涨幅偏离值 <text style="color: #ff5722;">${obj[6]}%</text></p>
  <p>${drcr} ${obj[7]}</p>
  ${yzyd}
  <p style="color: rgba(0, 0, 0, 0.5);">${obj[3]}</p>
  </div>
</div>`
                    }
                    return body
                } catch (e) { console.error('数据解析错误:', e); }
            }
        });
    }

    // 封装监管期股票表格数据
    function jgqgpTable () {
        let body = ''

        let formData = new FormData();
        formData.append('PhoneOSNew', '2');
        formData.append('Token', '0');
        formData.append('VerSion', '5.11.0.1');
        formData.append('UserID', '0');
        formData.append('a', 'GetYDTP_ZDJK_Today');
        formData.append('apiv', 'w33');
        formData.append('c', 'StockBidYiDong');

        return asyncRequest({
            method: "POST",
            url: 'https://apphq.longhuvip.com/w1/api/index.php',
            headers: {
                'Host': 'apphq.longhuvip.com',
                "Accept-Language": "zh-Hans-CN;q=1.0, en-CN;q=0.9",
                "Accept": "/",
                "Connection": "keep-alive",
                "User-Agent": "lhb/5.11.1 (com.kaipanla.www; build:0; iOS 14.6.0) Alamofire/5.11.1",
            },
            data: formData
        }).then(res => {
            // 处理情绪数据
            if (res.status === 200) {
                try {
                    let data = JSON.parse(res.responseText);
                    for (let obj of data.List) {
                        let category = ''
                        if (obj[4] == 1) {
                            category = '重点监控'
                        } else if (obj[4] == 2) {
                            category = '动态发布'
                        }
                        body += `<tr><td>${obj[0]}</td><td>${obj[1]}</td><td>${obj[2]}</td><td>${obj[3]}</td><td>${category}</td></tr>`
                    }
                    return `<table class="layui-table" lay-skin="line" lay-size="sm" lay-even>
                               <colgroup>
                                  <col width="150">
                                  <col width="150">
                                  <col>
                               </colgroup>
                               <thead>
                                  <tr>
                                     <th>股票代码</th>
                                     <th>股票名称</th>
                                     <th>监管开始日期</th>
                                     <th>监管结束日期</th>
                                     <th>类别</th>
                                  </tr>
                               </thead>
                               <tbody>
                                  ${body}
                               </tbody>
                            </table>`
                } catch (e) { console.error('数据解析错误:', e); }
            }
        });
    }

    // 封装板块轮动表格
    function bkldTable () {
        return asyncRequest({
            method: "GET",
            url: 'https://apigate.10jqka.com.cn/d/charge/smallcharge/l2/v2/hotCirclePlate?days=10&filter=no_filter',
            headers: { "Content-Type": "application/json" }
        }).then(res => {
            // 处理情绪数据
            if (res.status === 200) {
                try {
                    let body = ''
                    let hot10 = ''
                    let dayTh = ''
                    const colorMap = new Map();
                    const firstColor = '#BF1F00'
                    const secondColor = '#C05500'
                    const thirdColor = '#D59600'

                    let data = JSON.parse(res.responseText);
                    // 先组织近10日热门数据
                    for (let i = 0; i < 10 && i < data.result.qs.length; i++) {
                        if (i == 0) {
                            colorMap.set(data.result.qs[i].stockcode, firstColor);
                            hot10 += `<br><b>🔶<text style="color: ${firstColor};">${data.result.qs[i].stockname}</text></b><br><br>`;
                        } else if (i == 1) {
                            colorMap.set(data.result.qs[i].stockcode, secondColor);
                            hot10 += `<br><b>🔶<text style="color: ${secondColor};">${data.result.qs[i].stockname}</text></b><br><br>`;
                        } else if (i == 2) {
                            colorMap.set(data.result.qs[i].stockcode, thirdColor);
                            hot10 += `<br><b>🔶<text style="color: ${thirdColor};">${data.result.qs[i].stockname}</text></b><br><br>`;
                        } else {
                            hot10 += `<br><b>🔶${data.result.qs[i].stockname}</b><br><br><br>`;
                        }
                    }
                    // 组织板块轮动表数据表头
                    for (let obj of data.result.mrpm.up) {
                        dayTh += `<th>${obj.stocks[0].date}</th>`;
                    }
                    // 组织上涨板块数据
                    for (let i = 0; i < 10 && i < data.result.mrpm.up.length; i++) {
                        body += `<tr><td><text style="color: #ff5722;">${i + 1}</text></td>`;
                        for (let obj of data.result.mrpm.up) {
                            let tr = `<td>${obj.stocks[i].stockname}</td>`
                            if (colorMap.has(obj.stocks[i].stockcode)) {
                                tr = `<td style="background-color: ${colorMap.get(obj.stocks[i].stockcode)};"><text style="color: white;">${obj.stocks[i].stockname}</text></td>`;
                            }
                            body += tr;
                        }
                        body += `</tr>`;
                    }
                    // 组织下跌板块数据
                    for (let i = 0; i < 10 && i < data.result.mrpm.down.length; i++) {
                        body += `<tr><td><text style="color: #16b777;">${10 - i}</text></td>`;
                        for (let obj of data.result.mrpm.down) {
                            let tr = `<td>${obj.stocks[i].stockname}</td>`
                            if (colorMap.has(obj.stocks[i].stockcode)) {
                                tr = `<td style="background-color: ${colorMap.get(obj.stocks[i].stockcode)};"><text style="color: white;">${obj.stocks[i].stockname}</text></td>`;
                            }
                            body += tr;
                        }
                        body += `</tr>`;
                    }

                    return `<div class="layui-row layui-col-space15" style="padding: 6px;">
                                           <div class="layui-col-md1">
                                              <fieldset class="layui-elem-field">
                                                 <legend style="font-size: 20px;">近10日热门</legend>
                                                 ${hot10}
                                              </fieldset>
                                           </div>
                                           <div class="layui-col-md11">
                                              <fieldset class="layui-elem-field">
                                                 <legend>板块轮动表</legend>
                                                 <table class="layui-table" lay-skin="line" lay-size="sm" lay-even>
                                                      <thead>
                                                         <tr>
                                                            <th>排序</th>
                                                            ${dayTh}
                                                         </tr>
                                                      </thead>
                                                      <tbody>
                                                         ${body}
                                                      </tbody>
                                                   </table>
                                              </fieldset>
                                           </div>
                                        </div>`
                } catch (e) { console.error('数据解析错误:', e); }
            }
        });
    }

    // 封装涨跌停折线图数据
    function zdtzxt () {
        let body = ''
        return asyncRequest({
            method: "GET",
            url: 'https://api.github.com/gists/9d1da79aa43cc252ea23b542c50e7895',
            headers: { "Accept": "application/vnd.github+json" }
        }).then(res => {
            // 处理情绪数据
            if (res.status === 200) {
                try {
                    let rawdata = JSON.parse(res.responseText);
                    let data = JSON.parse(rawdata.files["zt_dt_height.json"].content)
                    // 转换为长格式
                    const chartData = data.flatMap(d => [
                        { date: d.date, type: '涨停总数', value: d.total_zt },
                        { date: d.date, type: '连板高度', value: d.zt_height },
                        { date: d.date, type: '连板股数', value: d.re_zt },
                        { date: d.date, type: '跌停股数', value: d.total_dt },
                    ]);
                    const chart = new G2.Chart({
                        container: 'zdt-chart-container',
                        autoFit: true,
                    });

                    chart.options({
                        data: chartData,
                        encode: {
                            x: 'date',
                            y: 'value',
                            color: 'type',
                        },
                        scale: {
                            y: { nice: true },
                            date: {
                                type: 'time',             // 声明时间类型
                                mask: 'YYYY-MM-DD',       // 日期显示格式
                            },
                        },
                        axis: {
                            x: {
                                title: '交易日',
                            },
                            y: {
                                title: '打板数据'
                            }
                        },

                    });


                    chart.line().encode('shape', 'smooth').encode('color', 'type')
                        .scale('color', {
                            range: ['#FFC0CB', '#ff5722', '#FFD700', '#16b777']  // 颜色顺序与 type 字段唯一值顺序一致
                        });

                    chart.point().encode('shape', 'point').tooltip(false);
                    chart.render();
                } catch (e) { console.error('数据解析错误:', e); }
            }
        });

    }

    // 功能0：默认深色模式，因为表格颜色是按照深色背景设置的，白色会错乱
    function darkMode () {
        // 移除水印，修改冲突样式
        GM_addStyle(`
            /*移除水印*/
            .dark .hit-pool__table.table {
                background-image: none !important;
            }
        `);

        // 将class为articles的div直接删除掉（滚动广告）
        const articlesDiv = document.querySelector('div.articles');
        if (articlesDiv) {
            articlesDiv.remove();
        }

        // 将class为ding-side-banner的div直接删除掉（滚动广告）
        const dingSideBanner = document.querySelector('div.ding-side-banner');
        if (dingSideBanner) {
            dingSideBanner.remove();
        }

        // 将class为new的img标签直接删除掉（水印图）
        const newImg = document.querySelector('img.new');
        if (newImg) {
            newImg.remove();
        }

        const observer = new MutationObserver(() => {
            const targetSpan = document.querySelector('div.theme-swapper span i.icon-yejianmoshi')?.closest('span');
            if (!targetSpan) return;

            // 检查类名或伪元素状态
            if (!targetSpan.classList.contains('checked')) {
                const iTag = targetSpan.querySelector('i.icon-yejianmoshi');
                iTag.click();
                console.log('[增强脚本] 修改为深色模式');
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 功能1：设置cookie过期时间为明年今日
    function setLongCookie () {
        const cookies = document.cookie.split(';');
        const nextYearDate = new Date();
        nextYearDate.setFullYear(nextYearDate.getFullYear() + 1); // 固定到当前日期的明年今日

        cookies.forEach(cookie => {
            const { name, value } = parseCookie(cookie);
            const newCookie = `${name}=${value}; expires=${nextYearDate.toUTCString()}; path=/`;
            document.cookie = newCookie;
        });
        console.log('[增强脚本] Cookie已固定至' + nextYearDate.toLocaleDateString() + '过期');
    }

    // 功能2：自动点击展开按钮
    function autoClickExpand () {
        const observer = new MutationObserver(() => {
            const elements = document.querySelectorAll('.ban-table-max');
            for (const div of elements) {
                const icon = div.querySelector('i');
                if (icon?.classList.contains('icon-xiangshang')) {
                    icon.click();
                    console.log('[增强脚本] 检测到展开按钮，已自动点击');
                    break; // 点击后立即终止循环
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 功能3：检测当前页面是否是今日数据，否则刷新页面
    function checkTodayDate () {
        safeInterval(() => {
            const monthElement = document.querySelector('.ban-chart-date-month-week');
            const dayElement = document.querySelector('.ban-chart-date-day');

            if (!monthElement || !dayElement) {
                console.log('未找到日期元素');
                return;
            }

            // 提取页面日期
            const pageMonth = parseInt(monthElement.textContent.replace(/[^0-9]/g, ''));
            const pageDay = parseInt(dayElement.textContent);
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth() + 1;
            const currentDay = currentDate.getDate();

            // 判断是否需要刷新
            if (pageMonth !== currentMonth || pageDay !== currentDay) {
                console.log('检测到日期不一致，即将刷新页面');
                location.reload();
            }
        }, 5 * 60 * 1000);
    }

    // 功能4：展示实时成交额，以及预测成交额
    function showAmount () {
        // 首先将原来的市场热度的图给删掉
        const observer = new MutationObserver(() => {
            const targetDiv = document.querySelector('.ban-chart-temperature');
            if (targetDiv) {
                observer.disconnect();
                targetDiv.replaceChildren();
            }
        });
        observer.observe(document, { childList: true, subtree: true });

        safeInterval(() => {
            // 展示在html中
            let showDiv = document.querySelector('.ban-chart-temperature');
            //showDiv.innerHTML = '<p style="color: yellow;">数据加载中...</p>'; // 加载提示;

            // 并行执行两个请求
            const formData = new FormData();
            formData.append('PhoneOSNew', '2');
            formData.append('Type', '0');
            formData.append('VerSion', '5.11.0.1');
            formData.append('a', 'MarketCapacity');
            formData.append('apiv', 'w33');
            formData.append('c', 'HomeDingPan');
            Promise.all([
                // 请求1：市场情绪数据
                asyncRequest({
                    method: "GET",
                    url: 'https://apphq.longhuvip.com/w1/api/index.php?Index=0&PhoneOSNew=2&VerSion=5.11.0.1&a=ChangeStatistics&apiv=w33&c=HomeDingPan&st=1000',
                    headers: { "Content-Type": "application/json" }
                }),

                // 请求2：量能数据
                asyncRequest({
                    method: "POST",
                    url: 'https://apphq.longhuvip.com/w1/api/index.php',
                    headers: {
                        'Host': 'apphq.longhuvip.com',
                        "Accept-Language": "zh-Hans-CN;q=1.0, en-CN;q=0.9",
                        "Accept": "/",
                        "Connection": "keep-alive",
                        "User-Agent": "lhb/5.11.1 (com.kaipanla.www; build:0; iOS 14.6.0) Alamofire/5.11.1",
                    },
                    data: formData
                })
            ]).then(([res1, res2]) => {
                // 统一处理结果
                const htmlParts = [];
                // 处理情绪数据
                if (res1.status === 200) {
                    try {
                        const data = JSON.parse(res1.responseText);
                        htmlParts.push(`<p style="color: white;font-size: small;">市场强度 ${data?.info[0].strong} 最高 ${data?.info[0].lbgd} 板</p>`);
                    } catch (e) { console.error('数据解析错误:', e); }
                }

                // 处理量能数据
                if (res2.status === 200) {
                    try {

                        const data = JSON.parse(res2.responseText);
                        console.log('ssss', data);
                        let sjln = `<p style="color: #FF0000;font-size: small;">实际量能：${Math.ceil(parseInt(data?.info?.last || '0') / 10000)}亿</p>`;
                        let ycln = `<p style="color: #FFFF00;font-size: small;">预测量能：${data?.info?.yclnstr}</p>`;
                        let zrln = `<p style="color: #ff9800;font-size: small;">昨日量能：${Math.ceil(parseInt(data?.info?.s_zrtj || '0') / 10000)}亿</b>`;
                        // 改变预测量能的颜色
                        const match = data.info.yclnstr.match(/-?\d+\.\d+/)
                        if (match) {
                            const number = parseFloat(match[0])
                            if (number <= 0) {
                                ycln = `<p style="color: #00FF00;font-size: small;">预测量能：${data?.info?.yclnstr}</p>`;
                            }
                        }
                        htmlParts.push(sjln + ycln + zrln);
                    } catch (e) { console.error('数据解析错误:', e); }
                }

                // 统一更新DOM
                showDiv.innerHTML = htmlParts.join('');
            }).catch(err => {
                showDiv.innerHTML = '<p style="color: red;">数据加载失败</p>';
            });
        }, 1000)
    }

    // 功能5：增加更多按钮，展示模态框，展示更多数据
    function addMore () {
        // 展示更多按钮
        const toolbar = document.querySelector(`.ban-table-tab-items`);
        if (!toolbar) return;
        // 提取第一个data-v-属性
        const vueAttr = Array.from(toolbar.attributes)
            .find(attr => attr.name.startsWith('data-v-'));
        // 创建容器并插入
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `<div target="7" ${vueAttr.name} class="ban-table-tab-item" lay-on="moreModal"><span ${vueAttr.name} class="tab-item-text" style="font-weight: bold;color: #ffd700;">更多数据</span></div>`;
        toolbar.insertBefore(wrapper.firstChild, toolbar.lastChild);

        // 添加对话框HTML结构
        layui.use(function () {
            let intervalId = null; // 全局存储定时器ID

            var layer = layui.layer;
            var util = layui.util;
            var table = layui.table;
            // 打开弹窗
            util.on('lay-on', {
                moreModal: function () {
                    // 页面层
                    layer.open({
                        type: 1,
                        area: ['80%', '80%'], // 宽高
                        shadeClose: true,
                        title: '查看更多数据',
                        content: `<div class="layui-tab layui-tab-brief">
                                  <ul class="layui-tab-title">
                                     <li>板块强度</li>
                                     <li>大幅回撤</li>
                                     <li>权重表现</li>
                                     <li>异动停牌</li>
                                     <li>板块轮动</li>
                                     <li>涨跌停数</li>
                                  </ul>
                                  <div class="layui-tab-content">
                                     <div class="layui-tab-item layui-show" id="bkqdDIV"></div>
                                     <div class="layui-tab-item" id="dfhcDIV"></div>
                                     <div class="layui-tab-item" id="qzbxDIV"></div>
                                     <div class="layui-tab-item" id="ydtpDIV">
                                        <div class="layui-row layui-col-space15" style="padding: 6px;">
                                           <div class="layui-col-md5">
                                              <fieldset class="layui-elem-field">
                                                 <legend>严重异动提醒</legend>
                                                 <div class="layui-field-box" id="yzydtxDIV">
                                                 </div>
                                              </fieldset>
                                           </div>
                                           <div class="layui-col-md7">
                                              <fieldset class="layui-elem-field">
                                                 <legend>重点监控</legend>
                                                 <div class="layui-field-box" id="jgqgpDIV">
                                                 </div>
                                              </fieldset>
                                              <fieldset class="layui-elem-field">
                                                 <legend>多次异动</legend>
                                                 <div class="layui-field-box" id="dcydDIV">
                                                 </div>
                                              </fieldset>
                                           </div>
                                        </div>
                                     </div>
                                     <div class="layui-tab-item" id="bkldDIV"></div>
                                     <div class="layui-tab-item"><div id="zdt-chart-container"></div></div>
                                  </div>`,
                        success: function (layero, index) {
                            // 每次打开弹窗前，先清除旧定时器
                            if (intervalId !== null) {
                                clearInterval(intervalId);
                                intervalId = null;
                            }

                            intervalId = setInterval(() => {
                                bkqdTable().then(res => {
                                    const bkqdDIV = document.querySelector(`#bkqdDIV`);
                                    bkqdDIV.innerHTML = res;
                                });
                                dfhcTable().then(res => {
                                    const dfhcDIV = document.querySelector(`#dfhcDIV`);
                                    dfhcDIV.innerHTML = res;
                                });
                                qzbxTable().then(res => {
                                    const qzbxDIV = document.querySelector(`#qzbxDIV`);
                                    qzbxDIV.innerHTML = res;
                                });
                                yzydtxPanel().then(res => {
                                    const yzydtxDIV = document.querySelector(`#yzydtxDIV`);
                                    yzydtxDIV.innerHTML = res;
                                });
                                jgqgpTable().then(res => {
                                    const jgqgpDIV = document.querySelector(`#jgqgpDIV`);
                                    jgqgpDIV.innerHTML = res;
                                });
                                bkldTable().then(res => {
                                    const bkldDIV = document.querySelector(`#bkldDIV`);
                                    bkldDIV.innerHTML = res;
                                });
                            }, 1000)
                            zdtzxt().then();
                        },
                        end: function () {
                            // 弹窗关闭时强制清理定时器
                            if (intervalId !== null) {
                                clearInterval(intervalId);
                                intervalId = null;
                            }
                        },
                    });
                },
            });
        });




    }

    // 功能6：相同板块的名称添加字体颜色，更直观看到变化
    function plateColor () {
        // 1. 颜色池与映射表初始化
        const colorPool = Array.from({ length: 50 }, (_, i) => {
            const hue = (i * (360 / 50)) % 360;
            return (hue < 100 || hue > 160) ? `hsl(${hue},75%,75%)` : null;
        }).filter(Boolean).slice(0, 50);

        const textColorMap = new Map();
        const getUniqueColor = (text) => {
            if (!textColorMap.has(text)) {
                const usedColors = new Set([...textColorMap.values()]);
                const availableColors = colorPool.filter(c => !usedColors.has(c));
                textColorMap.set(text, availableColors[Math.floor(Math.random() * availableColors.length)]);
            }
            return textColorMap.get(text);
        };

        // 全局状态变量：存储当前激活的筛选状态
        let currentFilter = null;
        let currentFilterText = '';

        // 统一的badge点击事件处理函数
        const handleBadgeClick = (e) => {
            e.stopPropagation();

            const clickedBadge = e.target;

            // 1. 提取内容名字：从badge所在的stock-reason-plate-name元素获取
            let contentName = '';
            let parentA = clickedBadge.previousElementSibling;

            // 查找包含stock-reason-plate-name的元素
            if (parentA && parentA.classList.contains('stock-reason-plate')) {
                // 如果badge在parentA后面，查找parentA内的stock-reason-plate-name
                const plateName = parentA.querySelector('.stock-reason-plate-name');
                if (plateName) {
                    contentName = plateName.textContent;
                }
            } else {
                // 降级处理：查找当前tr内的stock-reason-plate-name
                const tr = clickedBadge.closest('tr');
                if (tr) {
                    // 查找与当前badge颜色匹配的stock-reason-plate-name
                    const badgeColor = clickedBadge.style.backgroundColor;
                    const plateNames = tr.querySelectorAll('.stock-reason .stock-reason-plate-name');
                    for (const plateName of plateNames) {
                        if (plateName.style.color === badgeColor) {
                            contentName = plateName.textContent;
                            break;
                        }
                    }
                }
            }

            if (!contentName) return;

            // 2. 定位到上级tr标签
            const tr = clickedBadge.closest('tr');
            if (!tr) return;

            // 3. 实现筛选功能
            filterRowsByContentName(contentName);
        };

        // 筛选函数：根据内容名字筛选表格行
        const filterRowsByContentName = (contentName) => {
            // 获取页面中所有tr标签
            const allTrs = document.querySelectorAll('.ding-scroll-main .hit-pool__table tr');

            // 状态记忆与切换：如果点击同一内容，取消筛选
            if (currentFilterText === contentName) {
                // 恢复所有行的可见状态
                allTrs.forEach(tr => {
                    tr.style.opacity = '1';
                    tr.style.visibility = 'visible';
                    tr.style.display = '';
                    tr.style.pointerEvents = '';
                });
                // 重置筛选状态
                currentFilter = null;
                currentFilterText = '';
                return;
            }

            // 更新筛选状态
            currentFilter = contentName;
            currentFilterText = contentName;

            // 对每个tr标签进行内容匹配检查
            allTrs.forEach(tr => {
                // 查找当前tr中所有的stock-reason-plate-name元素
                const plateNames = tr.querySelectorAll('.stock-reason .stock-reason-plate-name');
                let isMatch = false;

                // 检查当前tr是否包含匹配的内容名字
                plateNames.forEach(plateName => {
                    if (plateName.textContent === contentName) {
                        isMatch = true;
                    }
                });

                // 设置显示/隐藏样式
                if (isMatch) {
                    tr.style.opacity = '1';
                    tr.style.visibility = 'visible';
                    tr.style.display = '';
                    tr.style.pointerEvents = '';
                } else {
                    tr.style.opacity = '0.3';
                    tr.style.visibility = 'hidden';
                    tr.style.display = '';
                    tr.style.pointerEvents = 'none';
                }
            });
        };

        // 2. 表格处理逻辑
        let debounceTimer;
        const processTable = () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const table = document.querySelector('.ding-scroll-main .hit-pool__table');
                if (!table) return;

                // 逆向统计与标记
                const rows = Array.from(table.rows);
                const countMap = new Map();

                // 第一阶段：统计相同文本数量
                rows.forEach(tr => {
                    const spans = tr.querySelectorAll('.stock-reason .stock-reason-plate-name');
                    spans.forEach(span => {
                        if (span) countMap.set(span.textContent, (countMap.get(span.textContent) || 0) + 1);
                    });
                });

                // 保存总数到另一个Map
                const totalMap = new Map(countMap);

                // 为所有tr标签添加过渡动画样式
                rows.forEach(tr => {
                    tr.style.transition = 'opacity 0.3s ease, visibility 0.3s ease';
                });

                // 第二阶段：逆向标记
                rows.forEach(tr => {
                    const targetSpans = tr.querySelectorAll('.stock-reason .stock-reason-plate-name');
                    targetSpans.forEach(targetSpan => {
                        if (!targetSpan) return;

                        const text = targetSpan.textContent;
                        const color = getUniqueColor(text);
                        const currentCount = countMap.get(text);
                        const total = totalMap.get(text);

                        // 样式设置
                        targetSpan.style.cssText = `font-weight:bold; color:${color};`;

                        // 查找上一级的stock-reason-plate a标签
                        const parentA = targetSpan.closest('.stock-reason-plate');

                        // 查找badge：先在parentA后面找，找不到再在targetSpan后面找
                        let badgeSpan;
                        if (parentA) {
                            badgeSpan = parentA.nextElementSibling;
                        } else {
                            badgeSpan = targetSpan.nextElementSibling;
                        }

                        // 确保找到的是layui-badge
                        if (badgeSpan && !badgeSpan.classList.contains('layui-badge')) {
                            badgeSpan = null;
                        }

                        // 动态创建标记
                        if (!badgeSpan) {
                            const newBadge = document.createElement('span');
                            newBadge.className = 'layui-badge';
                            newBadge.textContent = `${currentCount}/${total}`;
                            newBadge.style.cssText = `background-color:${color}; font-weight:bold; color:black; cursor:pointer;`;
                            newBadge.addEventListener('click', handleBadgeClick);
                            if (parentA) {
                                parentA.after(newBadge);
                            } else {
                                targetSpan.after(newBadge); // 降级处理
                            }
                            countMap.set(text, currentCount - 1);
                        } else {
                            // 更新现有badge的文本
                            badgeSpan.textContent = `${currentCount}/${total}`;
                            // 确保现有badge也有点击事件和样式
                            badgeSpan.style.cursor = 'pointer';
                            // 移除旧事件监听器，避免重复绑定
                            badgeSpan.removeEventListener('click', handleBadgeClick);
                            badgeSpan.addEventListener('click', handleBadgeClick);
                            countMap.set(text, currentCount - 1);
                        }
                    });
                });

                // 给股票名称后面直接增加板数
                rows.forEach(tr => {
                    // 暂时不插入，作用不明显，启用的话可以取消注释
                    const limitUpDaysTd = undefined// tr.querySelector('td[target="limit_up_days"]');
                    if (limitUpDaysTd) {
                        const limitUpDaysContent = limitUpDaysTd.textContent.replace(/\s/g, '');
                        if (limitUpDaysContent && limitUpDaysContent != '-') {
                            // 查找 target 为 stock-title 的 td 下的 class 为 stock-title-name 的 span
                            const stockTitleNameSpan = tr.querySelector('td.stock-title .stock-title-name');
                            if (stockTitleNameSpan) {
                                // 检查是否已经存在带有 layui-badge 类的 span 元素
                                const existingSpan = stockTitleNameSpan.nextElementSibling;
                                if (!existingSpan || !existingSpan.classList.contains('stock-badge-corner')) {
                                    const newSpan = document.createElement('span');
                                    // 处理 limitUpDaysContent 的内容
                                    let processedContent = limitUpDaysContent;
                                    if (limitUpDaysContent.includes('首')) {
                                        processedContent = '首';
                                    } else if (/[0-9]/.test(limitUpDaysContent)) {
                                        // 提取阿拉伯数字
                                        const match = limitUpDaysContent.match(/\d+/);
                                        const num = match ? parseInt(match[0]) : null;
                                        if (num !== null && num >= 0 && num <= 20) {
                                            const chineseNumbers = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十'];
                                            processedContent = chineseNumbers[num];
                                        }
                                    }
                                    newSpan.textContent = processedContent;
                                    newSpan.classList.add('stock-badge-corner');
                                    stockTitleNameSpan.insertAdjacentElement('afterend', newSpan);
                                }
                            }
                        }
                    }
                });
            }, 100);
        };

        // 3. MutationObserver配置
        const observer = new MutationObserver(mutations => {
            // 防抖处理，等待DOM完全更新
            setTimeout(processTable, 50);
        });

        // 初始化监听
        const initObserver = () => {
            // 监听表格的父容器（而不是具体的tbody）
            const container = document.querySelector('.ban-table-main');
            if (container) {
                // 检测当前容器内是否存在表格
                const table = container.querySelector('.hit-pool__table');
                if (table) processTable(); // 初始执行

                // 监听父容器的子节点变化（整体替换）
                observer.observe(container, {
                    childList: true,  // 监控子节点的增删
                    subtree: true     // 监控所有后代节点的变化
                });
            } else {
                setTimeout(initObserver, 500);
            }
        };

        // 启动系统
        initObserver();
    }

    // 功能7：显示大涨大跌股票数
    function showDzDdTotal () {
        safeInterval(() => {
            const formData = new FormData();
            formData.append('PhoneOSNew', '2');
            formData.append('VerSion', '5.11.0.1');
            formData.append('a', 'ZhangFuDetail');
            formData.append('apiv', 'w33');
            formData.append('c', 'HomeDingPan');
            asyncRequest({
                method: "POST",
                url: 'https://apphq.longhuvip.com/w1/api/index.php',
                headers: {
                    'Host': 'apphq.longhuvip.com',
                    "Accept-Language": "zh-Hans-CN;q=1.0, en-CN;q=0.9",
                    "Accept": "/",
                    "Connection": "keep-alive",
                    "User-Agent": "lhb/5.11.1 (com.kaipanla.www; build:0; iOS 14.6.0) Alamofire/5.11.1",
                },
                data: formData
            }).then(res => {
                // 处理情绪数据
                if (res.status === 200) {
                    try {
                        let data = JSON.parse(res.responseText);
                        // 步骤1：查找目标元素
                        const parentDiv = document.querySelector('.ban-chart .hit-pool-container');
                        if (!parentDiv) {
                            console.log('未找到父级元素');
                            return;
                        }

                        // 步骤2：查找目标子元素
                        const targetDiv = parentDiv.querySelector('.hit-pool-title');
                        if (!targetDiv) {
                            console.log('未找到目标元素');
                            return;
                        }

                        // 步骤3：动态更新内容
                        console.log(data);
                        let red = parseInt(data?.info['8'] || '0') + parseInt(data?.info['9'] || '0') + parseInt(data?.info['10'] || '0')
                        let green = parseInt(data?.info['-8'] || '0') + parseInt(data?.info['-9'] || '0') + parseInt(data?.info['-10'] || '0')

                        // 移除旧内容（如果存在）
                        const oldContent = targetDiv.querySelector('.dynamic-content');
                        if (!oldContent) {
                            const dynamicContent = document.createElement('span');
                            dynamicContent.innerHTML = `<span style="padding-left: 5px;"><span style="color:#ff5722;" id="dz-red">${red}</span>：<span style="color:#16b777;" id="dd-green">${green}</span></span>`;
                            // 插入新内容
                            targetDiv.insertAdjacentElement('beforeend', dynamicContent);
                            dynamicContent.classList.add('dynamic-content');
                        } else {
                            // 更新数值
                            const dzRed = oldContent.querySelector('#dz-red');
                            dzRed.textContent = red;
                            const ddGreen = oldContent.querySelector('#dd-green');
                            ddGreen.textContent = green;
                        }
                    } catch (e) { console.error('数据解析错误:', e); }
                }
            });
        }, 1000)
    }


    // 初始化执行
    window.addEventListener('load', () => {
        try {
            // 检测页面上的涨跌数据canvas渲染完毕，再执行，否则可能导致canvas渲染出错
            const observer = new MutationObserver((mutations) => {
                const canvas = document.querySelector(".ding-summary-chart canvas");
                if (canvas) {
                    observer.disconnect();
                    // 以下是执行自定义操作
                    darkMode();
                    autoClickExpand();
                    setLongCookie();
                    checkTodayDate();
                    showAmount();
                    addMore();
                    plateColor();
                    showDzDdTotal();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        } catch (e) {
            console.log(`[增强脚本] 执行发生错误：${e}`)
        }
    });
})();