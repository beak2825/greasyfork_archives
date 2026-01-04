// ==UserScript==
// @name         PT Medal Monitor
// @namespace    http://tampermonkey.net/
// @version      2025-05-01
// @description  监控所有站点的勋章状况
// @author       Schalkiii
// @match        http*://*/medal*.php*
// @match        http*://*/badge*.php*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @connect *
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521928/PT%20Medal%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/521928/PT%20Medal%20Monitor.meta.js
// ==/UserScript==

// Changelog  2025-05-01:
// 添加、修改了一些站点。
// Changelog  2025-04-05:
// 添加、修改了一些站点。解决相对路径导致的勋章图片显示错误问题。对于不支持的站点搜索「购买」按钮来展示疑似可购买的勋章
// Changelog  2025-02-07:
// 添加、修改了一些站点
// Changelog  2025-01-03:
// 添加、修改了一些站点和match规则
// Changelog  2024-12-29:
// 右上角添加按钮，添加只显示有背景色行功能，即只保留最关键的可领取和未来才可领取的勋章。
// Changelog  2024-12-28:
// 右上角添加按钮，点击才运行。
// 抓取结果展示添加按钮跳转方便领取。
// 可领取勋章背景绿色高亮。
// 未来才开始领取的勋章背景橙色高亮。
// 更新、移除部分网址。
// Changelog  2024-12-27-1:
// 修复手续费抓取。
// Changelog  2025-02-27:
// 添加了一些新开的站点。增加显示页面特殊的未支持站点跳转链接

(function() {
    'use strict';

    // 定义站点配置
const SITES = [
    { name: '1PTBA', url: 'https://1ptba.com/medal.php' },
    { name: '52PT', url: 'https://52pt.site/medal.php' },
    { name: 'Audiences', url: 'https://audiences.me/medal_center.php' },
    { name: 'BTSchool', url: 'https://pt.btschool.club/medal.php' },
    { name: 'BYR', url: 'https://byr.pt/medal.php' },
    { name: 'CHDBits', url: 'https://ptchdbits.co/medal.php' },
    { name: 'CMCT', url: 'https://springsunday.net/badges.php' },
    { name: 'CarPt', url: 'https://carpt.net/medal.php' },
    { name: 'DiscFan', url: 'https://discfan.net/medal.php' },
    { name: 'Dragon', url: 'https://www.dragonhd.xyz/medal.php' },
    { name: 'FreeFarm', url: 'https://pt.0ff.cc/medal.php' },
    { name: 'GPW', url: 'https://greatposterwall.com/medal.php' },
    { name: 'HDArea', url: 'https://hdarea.club/medal.php' },
    { name: 'HDAtmos', url: 'https://hdatmos.club/medal.php' },
    { name: 'HDCity', url: 'https://hdcity.city/medal.php' },
    { name: 'HDDolby', url: 'https://www.hddolby.com/medals.php' },
    { name: 'HDHome', url: 'https://hdhome.org/medal.php' },
    { name: 'HDPost', url: 'https://pt.hdpost.top/medal.php' },
    { name: 'HDPt', url: 'https://hdpt.xyz/medal.php' },
    { name: 'HDSky', url: 'https://hdsky.me/medal.php' },
    { name: 'HDTime', url: 'https://hdtime.org/medal.php' },
    { name: 'HDU', url: 'https://pt.hdupt.com/medal.php' },
    { name: 'HDVideo', url: 'https://hdvideo.one/medal.php' },
    { name: 'HDfans', url: 'http://hdfans.org/medal.php' },
    { name: 'HITPT', url: 'https://www.hitpt.com/medal.php' },
    { name: 'HUDBT', url: 'https://hudbt.hust.edu.cn/medal.php' },
    { name: 'HaiDan', url: 'https://www.haidan.video/medal.php' },
    { name: 'ITZMX', url: 'https://pt.itzmx.com/medal.php' },
    { name: 'JoyHD', url: 'https://www.joyhd.net/medal.php' },
    { name: 'NanYang', url: 'https://nanyangpt.com/medal.php' },
    { name: 'Oshen', url: 'http://www.oshen.win/medal.php' },
    { name: 'OurBits', url: 'https://ourbits.club/medal.php' },
    { name: 'PThome', url: 'https://www.pthome.net/medal.php' },
    { name: 'PTsbao', url: 'https://ptsbao.club/medal.php' },
    { name: 'SoulVoice', url: 'https://pt.soulvoice.club/medal.php' },
    { name: 'TCCF', url: 'https://et8.org/medal.php' },
    { name: 'TJUPT', url: 'https://www.tjupt.org/medal.php' },
    { name: 'TLFbits', url: 'https://pt.eastgame.org/medal.php' },
    { name: 'TTG', url: 'https://totheglory.im/mall.php?cid=5' },
    { name: 'WT-Sakura', url: 'https://wintersakura.net/medal.php' },
    { name: 'Monika', url: 'https://monikadesign.uk/medal.php' },
    { name: '红叶', url: 'https://leaves.red/medal.php' },
    { name: 'ICC', url: 'https://www.icc2022.com/medal.php' },
    { name: 'CyanBug', url: 'https://cyanbug.net/medal.php' },
    { name: '海棠', url: 'https://www.htpt.cc/medal.php' },
    { name: '杏林', url: 'https://xingtan.one/medal.php' },
    { name: 'SRVFI', url: 'https://srvfi.top/medal.php' },
    { name: 'OKPT', url: 'https://www.okpt.net/medal.php' },
    { name: 'OKPT-Page2', url: 'https://www.okpt.net/medal.php?page=1' },
    { name: 'GGPT', url: 'https://www.gamegamept.com/medal.php' },
    { name: 'Panda', url: 'https://pandapt.net/medal.php' },
    { name: 'KuFei', url: 'https://kufei.org/medal.php' },
    { name: 'RouSi', url: 'https://rousi.zip/medal.php' },
    { name: '悟空', url: 'https://wukongwendao.top/medal.php' },
    { name: 'PTCafe', url: 'https://ptcafe.club/medal.php' },
    { name: 'PTChina', url: 'https://ptchina.org/medal.php' },
    { name: 'GTK', url: 'https://pt.gtkpw.xyz/medal.php' },
    { name: 'ECUST', url: 'https://pt.ecust.pp.ua/medal.php' },
    { name: 'iloli', url: 'https://share.ilolicon.com/medal.php' },
    { name: 'CrabPt', url: 'https://crabpt.vip/medal.php' },
    { name: 'CrabPt-Page2', url: 'https://crabpt.vip/medal.php?page=1' },
    { name: 'PTFans', url: 'https://ptfans.cc/medal.php' },
    { name: '影', url: 'https://star-space.net/medal.php' },
    { name: 'PTzone', url: 'https://ptzone.xyz/medal.php' },
    { name: '雨', url: 'https://raingfh.top/medal.php' },
    { name: 'PTLGS', url: 'https://ptlgs.org/medal.php' },
    { name: 'NJTUPT', url: 'https://njtupt.top/medal.php' },
    { name: 'FRDS', url: 'https://pt.keepfrds.com/medal.php' },
    { name: 'U2', url: 'https://u2.dmhy.org/medal.php' },
    { name: 'Ubits', url: 'https://ubits.club/medal.php' },
    { name: 'KamePT', url: 'https://kamept.com/medal.php' },
    { name: '伞', url: 'https://sanpro.pw/medal.php' },
    { name: 'DevTracker', url: 'https://tracker.ldo.pics/medal.php' },
    { name: '唐门', url: 'https://tmpt.top/medal.php' },
    { name: 'HDBao', url: 'https://hdbao.cc/medal.php' },
    { name: 'AFUN', url: 'https://www.ptlover.cc/medal.php' },
    { name: 'LemonHDNet', url: 'https://lemonhd.net/medal.php' },
    { name: 'Sewer', url: 'https://sewerpt.com/medal.php' },
    { name: 'HDV', url: 'https://hdvideo.one/medal.php' },
    { name: 'RailGun', url: 'https://bilibili.download/medal.php' },
    { name: 'A4A', url: 'https://a4apt.com/medal.php' },
    { name: '葫芦娃', url: 'https://pt.541542.xyz/medal.php' },
    { name: 'Playlet', url: 'https://playletpt.xyz/medal.php' },
// unsurpport but try to find button
    { name: '星陨阁', url: 'https://xingyunge.top/medal.php' },
    { name: '财神', url: 'https://cspt.top/medal.php' },
    { name: '财神-Page2', url: 'https://cspt.top/medal.php?page=1' },
    { name: 'PTer', url: 'https://pterclub.com/medal.php' },
    { name: 'ZMPT', url: 'https://zmpt.cc/medal.php' },
    { name: '象岛', url: 'https://ptvicomo.net/medal.php' },
    { name: '麒麟', url: 'https://www.hdkyl.in/medal.php' },
    { name: 'Piggo', url: 'https://piggo.me/medal.php' },
    { name: 'QingWa', url: 'https://qingwapt.com/medal.php' },
    { name: 'AGSV', url: 'https://www.agsvpt.com/medal.php' },
    { name: 'YemaPT', url: 'https://www.yemapt.org/#/consumer/badge' },
    { name: 'HHClub', url: 'https://hhanclub.top/medal.php' },
];

const usupportUrls = [
    { name: '星陨阁', url: 'https://xingyunge.top/medal.php' },
    { name: '财神', url: 'https://cspt.top/medal.php' },
    { name: 'PTer', url: 'https://pterclub.com/medal.php' },
    { name: 'ZMPT', url: 'https://zmpt.cc/medal.php' },
    { name: '象岛', url: 'https://ptvicomo.net/medal.php' },
    { name: '麒麟', url: 'https://www.hdkyl.in/medal.php' },
    { name: 'Piggo', url: 'https://piggo.me/medal.php' },
    { name: 'QingWa', url: 'https://qingwapt.com/medal.php' },
    { name: 'AGSV', url: 'https://www.agsvpt.com/medal.php' },
    { name: 'YemaPT', url: 'https://www.yemapt.org/#/consumer/badge' },
    { name: 'HHClub', url: 'https://hhanclub.top/medal.php' },
];

const offlineUrls = [
    { name: 'RS', url: 'https://resource.xidian.edu.cn/medal.php' },
    { name: 'DaJiao', url: 'https://dajiao.cyou/medal.php' },
    { name: 'HaresClub', url: 'https://club.hares.top/medal.php' },
    { name: '回声PT', url: 'https://hspt.club/medal.php' },
];

// Medal.php 404的站点，可能是站点没有勋章功能
const noneMedalUrls = [
    { name: 'ZHUQUE', url: 'https://zhuque.in/medal.php' },
    { name: 'PTT', url: 'https://www.pttime.org/medal.php' },
    { name: 'jpop', url: 'https://jpopsuki.eu/medal.php' },
    { name: 'HONE', url: 'https://hawke.uno/medal.php' },
    { name: 'FNP', url: 'https://fearnopeer.com/medal.php' },
    { name: 'LemonHD', url: 'https://lemonhd.club/medal.php' },
    { name: 'HDSpace', url: 'https://hd-space.org/medal.php' },
    "https://52pt.site/medal.php",
    "https://audiences.me/medal.php",
    "https://pt.btschool.club/medal.php",
    "https://ptchdbits.co/medal.php",
    "https://www.dragonhd.xyz/medal.php",
    "https://hdarea.club/medal.php",
    "https://hdcity.city/medal.php",
    "https://hdhome.org/medal.php",
    "https://pt.hdpost.top/medal.php",
    "https://hdsky.me/medal.php",
    "https://hd-space.org/medal.php",
    "https://pt.hdupt.com/medal.php",
    "https://www.hitpt.com/medal.php",
    "https://hudbt.hust.edu.cn/medal.php",
    "https://www.haidan.video/medal.php",
    "https://club.hares.top/medal.php",
    "https://pt.itzmx.com/medal.php",
    "https://www.joyhd.net/medal.php",
    "https://nanyangpt.com/medal.php",
    "https://ourbits.club/medal.php",
    "https://www.pthome.net/medal.php",
    "https://ptsbao.club/medal.php",
    "https://et8.org/medal.php",
    "https://monikadesign.uk/medal.php",
    "https://www.htpt.cc/medal.php",
    "https://fearnopeer.com/medal.php",
    "https://star-space.net/medal.php",
    "https://lemonhd.club/medal.php",
    "https://pt.keepfrds.com/medal.php",
    "https://u2.dmhy.org/medal.php",
    "https://jpopsuki.eu/medal.php",
    "https://pt.eastgame.org/medal.php",
    "https://www.tjupt.org/medal.php",
    "https://byr.pt/medal.php",
    "https://resource.xidian.edu.cn/medal.php",
    "https://hawke.uno/medal.php"
];

const newSITES = SITES.filter(site => {
    return!noneMedalUrls.includes(site.url);
});

    // 添加未支持站点列表
     function createUnsupportSection() {
         const container = document.createElement('div');
         container.style.margin = '120px 20px 20px'; // 留出顶部空间给按钮
         container.style.padding = '20px';
         container.style.border = '1px solid #ffd700';
         container.style.borderRadius = '5px';
         container.style.backgroundColor = '#fffbe6';

         const header = document.createElement('h2');
         header.textContent = '未支持站点（点击访问）';
         header.style.color = '#856404';
         header.style.marginTop = '0';

         const list = document.createElement('div');
         list.style.display = 'grid';
         list.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
         list.style.gap = '10px';
         list.style.marginTop = '10px';

         usupportUrls.forEach(site => {
             const link = document.createElement('a');
             link.href = site.url;
             link.textContent = site.name;
             link.target = '_blank';
             link.style.display = 'block';
             link.style.padding = '8px';
             link.style.backgroundColor = '#fff3cd';
             link.style.border = '1px solid #ffeeba';
             link.style.borderRadius = '4px';
             link.style.color = '#856404';
             link.style.textDecoration = 'none';
             link.style.transition = 'all 0.2s';

             link.addEventListener('mouseover', () => {
                 link.style.backgroundColor = '#ffeeba';
                 link.style.transform = 'translateY(-2px)';
             });

             link.addEventListener('mouseout', () => {
                 link.style.backgroundColor = '#fff3cd';
                 link.style.transform = 'none';
             });

             list.appendChild(link);
         });

         container.appendChild(header);
         container.appendChild(list);
         document.body.appendChild(container);
     }

//console.log(newSITES);

// 新增：显示购买按钮警告
function showPurchaseButtonWarning(siteName, siteUrl, buttons) {
    const container = document.createElement('div');
    container.style.cssText = `
        margin: 20px;
        padding: 20px;
        border: 2px solid #ff4444;
        border-radius: 5px;
        background: #fff3f3;
        position: relative;
    `;

    const header = document.createElement('h3');
    header.innerHTML = `⚠️ ${siteName} 检测到潜在购买按钮`;
    header.style.color = '#cc0000';

    const link = document.createElement('a');
    link.href = siteUrl;
    link.textContent = '前往查看';
    link.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        padding: 5px 10px;
        background: #ff4444;
        color: white;
        border-radius: 3px;
        text-decoration: none;
    `;

    const list = document.createElement('ul');
    list.style.paddingLeft = '20px';

    buttons.forEach((btn, index) => {
        const li = document.createElement('li');
        li.style.margin = '10px 0';
        li.innerHTML = `
            <strong>按钮 ${index + 1}:</strong>
            <div style="color: #666">${btn.text}</div>
            <div style="font-size: 0.9em; color: #999">上下文: ${btn.context}</div>
        `;
        list.appendChild(li);
    });

    container.appendChild(header);
    container.appendChild(link);
    container.appendChild(list);
    document.body.appendChild(container);
}


// 在页面上展示表格
function displayTableOnPage(medals, siteName, siteUrl) {
    // 创建表格容器
    const container = document.createElement('div');
    container.style.margin = '20px';
    container.style.padding = '20px';
    container.style.border = '1px solid #ccc';
    container.style.borderRadius = '5px';
    container.style.backgroundColor = '#f9f9f9';

    // 创建站点标题
    const siteHeader = document.createElement('h2');
    siteHeader.textContent = `${siteName} (一共 ${medals.length} 个勋章)`;
// 创建链接
const link = document.createElement('a');
link.href = siteUrl; // 设置链接的 URL
link.textContent = '访问站点'; // 链接显示的文本
link.style.color = '#007bff'; // 设置链接颜色
link.style.textDecoration = 'none'; // 去掉下划线
link.style.marginLeft = '10px'; // 添加左边距
link.style.fontWeight = 'bold'; // 加粗字体

// 添加点击事件，确保链接在新标签页打开
link.addEventListener('click', function (event) {
    event.preventDefault(); // 阻止默认行为
    window.open(siteUrl, '_blank'); // 在新标签页打开链接
});

// 将链接添加到标题中
siteHeader.appendChild(link);

// 将标题添加到容器中
container.appendChild(siteHeader);

    // 创建表格
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginBottom = '20px';

    // 创建表头
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = ['图片', '名称', '描述', '可购买时间', '有效期', '奖励倍数', '价格', '库存', '可购买', '手续费'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        th.style.border = '1px solid #ddd';
        th.style.padding = '8px';
        th.style.backgroundColor = '#f2f2f2';
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // 创建表格内容
    const tbody = document.createElement('tbody');
    medals.forEach(medal => {
        const row = document.createElement('tr');

        // 如果勋章可购买，则高亮显示该行
        if (medal.canBuy) {
            row.style.backgroundColor = '#e6ffe6'; // 使用浅绿色背景高亮
            row.style.fontWeight = 'bold'; // 加粗字体
        }

    // 检查可购买时间的开始点是否在未来
    const availableTime = medal.availableTime;
    if (availableTime && availableTime.trim() !== '不限 ~ 不限') {
        const startTimeStr = availableTime.split('~')[0].trim(); // 获取开始时间部分
        if (startTimeStr !== '不限') {
            const startTime = new Date(startTimeStr); // 将字符串转换为日期对象
            const now = new Date(); // 获取当前时间
            if (startTime > now) { // 如果开始时间在未来
                row.style.backgroundColor = '#ffe6cc'; // 使用橙色背景高亮
                row.style.fontWeight = 'bold'; // 加粗字体
            }
        }
    }
        const columns = [
            `<img src="${medal.image}" width="50" height="50">`,
            medal.name,
            medal.description,
            medal.availableTime,
            medal.validity,
            medal.bonusMultiplier,
            medal.price,
            medal.stock,
            medal.canBuy ? '是' : '否',
            medal.giftFee
        ];
        columns.forEach(columnText => {
            const td = document.createElement('td');
            td.innerHTML = columnText;
            td.style.border = '1px solid #ddd';
            td.style.padding = '8px';
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    // 将表格添加到容器中
    container.appendChild(table);

    // 将容器添加到页面中
    document.body.appendChild(container);
}

// 从HTML字符串中提取勋章数据
function extractMedalsFromHtml(html, siteName, siteUrl) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const medals = [];
    let foundPurchaseButtons = [];

    // 查找包含勋章数据的表格
    const tables = doc.querySelectorAll('table');
    let medalTable = null;

    // 查找包含正确列头的表格
    for (const table of tables) {
    const headers = table.querySelectorAll('.colhead');
    if (headers.length >= 7) {
        // 检查是否包含简体或繁体的“购买”或“价格”字样
        const hasBuyOrPriceInHeader = Array.from(headers).some(header => {
            const text = header.textContent;
            return (text.includes('购买') || text.includes('購買') || text.includes('价格') || text.includes('價格'));
        });
        if (hasBuyOrPriceInHeader) {
            medalTable = table;
            break;
        }
    }
}

    if (!medalTable) {
        console.error(`[${siteName}] 未找到勋章表格`);
        // 查找所有按钮和链接
        const buttons = doc.querySelectorAll('button, a, input[type="button"], input[type="submit"]');

        buttons.forEach(btn => {
            const btnText = (btn.textContent || btn.value || '').trim();
            // 匹配中英文购买关键词（简体、繁体）
            if (/(购买|購買|Buy|消费)/i.test(btnText)) {
                // 获取上下文信息
                const context = btn.closest('tr, div, li')?.textContent?.trim().substring(0, 100) || '无上下文信息';

                const excludePattern = /(不可|已经|已过)/i;
                // 检查文本内容
                const buttonText = (btn.textContent || btn.value || '').trim();
                const containsExcluded = excludePattern.test(buttonText) || excludePattern.test(context);

                    // 检查按钮属性
                const isDisabled = btn.disabled ||
                      btn.closest('.disabled') ||
                      btn.style.display === 'none';
                if (!isDisabled && !containsExcluded) {
                    foundPurchaseButtons.push({
                        text: btnText,
                        context: context,
                        element: btn.outerHTML
                    });
                }
            }
        });

        // 如果有找到购买按钮
        if (foundPurchaseButtons.length > 0) {
            console.warn(`[${siteName}] 发现疑似购买按钮 (${foundPurchaseButtons.length}个)`);
            // 在页面显示警告
            showPurchaseButtonWarning(siteName, siteUrl, foundPurchaseButtons);
        }
        return medals;
    }

    // 处理勋章表格中的行
    medalTable.querySelectorAll('tbody > tr').forEach(row => {
        // Skip header row
        if (!row.querySelector('.colhead')) {
            // 确保行中有图片和数据
            const imgElement = row.querySelector('td:nth-child(1) img');
            const nameElement = row.querySelector('td:nth-child(2) h1');

            if (imgElement && nameElement) {
                const imgSrc = imgElement.getAttribute('src');
                const imageUrl = new URL(imgSrc, siteUrl).href;

                const medal = {
                    site: siteName,
                    image: imageUrl,
                    //image: imgElement.src || '',
                    name: nameElement.textContent.trim() || '',
                    description: row.querySelector('td:nth-child(2)')?.textContent.trim().replace(nameElement.textContent, '').trim() || '',
                    availableTime: row.querySelector('td:nth-child(3)')?.textContent.trim().replace(/\s+/g, ' ') || '',
                    validity: row.querySelector('td:nth-child(4)')?.textContent.trim() || '',
                    bonusMultiplier: row.querySelector('td:nth-child(5)')?.textContent.trim() || '',
                    price: parseInt(row.querySelector('td:nth-child(6)')?.textContent.replace(/,/g, ''), 10) || 0,
                    stock: row.querySelector('td:nth-child(7)')?.textContent.trim() || '',
                    canBuy:!row.querySelector('td:nth-child(8) input')?.disabled,
                    giftFee: row.querySelector('td:nth-child(9) span.nowrap')?.textContent.replace('手續費: ', '').replace('手续费: ', '') || ''
                };

                medals.push(medal);
            }
        }
    });
    console.group(`${siteName} (一共 ${medals.length} 个勋章)`);
    console.table(medals);
    console.groupEnd();
    // 在页面上展示表格
    displayTableOnPage(medals,siteName,siteUrl);
    return medals;
}

// 从单个站点抓取勋章
async function scrapeSite(site) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: site.url,
            headers: {
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            },

            onload: function (response) {
                if (response.status === 200) {
                    const medals = extractMedalsFromHtml(response.responseText, site.name, site.url);
                    resolve(medals);
                } else {
                    console.log(response);
                    reject(new Error(`HTTP error! status: ${response.status}`));
                }
            },
            onerror: function (error) {
                console.error(`[${site.name}] 抓取失败:`, error);
                reject(error);
            }
        });
    });
}


// 抓取所有站点的勋章
async function scrapeAllSites() {
    try {
        // 并行请求所有站点
        const allMedals = await Promise.allSettled(
            newSITES.map(site => scrapeSite(site))
        );

        // 合并所有结果
        const flatMedals = allMedals.flat();

        // 按站点分组显示结果
        const groupedMedals = {};
        flatMedals.forEach(medal => {
            if (!groupedMedals[medal.site]) {
                groupedMedals[medal.site] = [];
            }
            groupedMedals[medal.site].push(medal);
        });

        // 打印结果
        for (const [site, medals] of Object.entries(groupedMedals)) {
            console.group(`${site} (共有 ${medals.length} 个勋章)`);
            console.table(medals);
            console.groupEnd();
        }

        return flatMedals;
    } catch (error) {
        console.error('抓取过程出错:', error);
        throw error;
    }
}

window.addEventListener('load', function () {
// 创建未支持站点区块
createUnsupportSection();
// 创建按钮容器
const buttonContainer = document.createElement('div');
buttonContainer.style.position = 'fixed'; // 固定在页面显眼位置
buttonContainer.style.top = '20px';
buttonContainer.style.right = '20px';
buttonContainer.style.display = 'flex'; // 使用 Flex 布局
buttonContainer.style.gap = '10px'; // 按钮之间的间距
buttonContainer.style.zIndex = '1000'; // 确保按钮在最上层

// 创建“开始抓取勋章”按钮
const scrapeButton = document.createElement('button');
scrapeButton.textContent = '开始抓取勋章';
scrapeButton.style.padding = '10px 20px';
scrapeButton.style.backgroundColor = '#007bff';
scrapeButton.style.color = '#fff';
scrapeButton.style.border = 'none';
scrapeButton.style.borderRadius = '5px';
scrapeButton.style.cursor = 'pointer';

// 创建“隐藏无背景色行”按钮
const hideButton = document.createElement('button');
hideButton.textContent = '隐藏无背景色行';
hideButton.style.padding = '10px 20px';
hideButton.style.backgroundColor = '#28a745'; // 绿色背景
hideButton.style.color = '#fff';
hideButton.style.border = 'none';
hideButton.style.borderRadius = '5px';
hideButton.style.cursor = 'pointer';

// 将按钮添加到按钮容器中
buttonContainer.appendChild(scrapeButton);
buttonContainer.appendChild(hideButton);

// 将按钮容器添加到页面中
document.body.appendChild(buttonContainer);

// “开始抓取勋章”按钮点击事件
scrapeButton.addEventListener('click', function () {
    scrapeButton.textContent = '抓取中...'; // 点击后改变按钮文字
    scrapeButton.disabled = true; // 禁用按钮，防止重复点击

    scrapeAllSites()
        .then(medals => {
            console.log('所有站点抓取完成，总共抓取到', medals.length, '个勋章');
            scrapeButton.textContent = '抓取完成'; // 抓取完成后更新按钮文字
        })
        .catch(error => {
            console.error('抓取过程出错:', error);
            scrapeButton.textContent = '抓取出错，重试'; // 出错后更新按钮文字
            scrapeButton.disabled = false; // 允许用户重试
        });
});

// “隐藏无背景色行”按钮点击事件
hideButton.addEventListener('click', function () {
    const tables = document.querySelectorAll('table'); // 获取页面中的所有表格
    if (tables.length === 0) {
        console.error('未找到表格');
        return;
    }

    let isHidden = hideButton.textContent === '显示所有行'; // 当前是否为隐藏状态

    tables.forEach(table => {
        const rows = table.querySelectorAll('tbody tr'); // 获取当前表格的所有行

        rows.forEach(row => {
            const backgroundColor = row.style.backgroundColor;

            // 如果没有背景色或背景色为默认值
            if (!backgroundColor || backgroundColor === '' || backgroundColor === 'transparent') {
                row.style.display = isHidden ? '' : 'none'; // 切换隐藏/显示
            }
        });
    });

    // 切换按钮文字
    hideButton.textContent = isHidden ? '隐藏无背景色行' : '显示所有行';
});


});
})();