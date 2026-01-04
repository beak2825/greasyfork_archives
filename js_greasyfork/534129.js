// ==UserScript==
// @name         显示并复制当前页面 Cookie 列表
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  获取当前网站的 cookie，分号拆分成列表，在右上角显示/隐藏列表，并可一键复制所有 cookie
// @author       Lmt
// @match        https://oms.flightroutes24.com/
// @match        https://oms-deva.flightroutes24.com/
// @match        https://oms-devb.flightroutes24.com/
// @match        https://oms-devc.flightroutes24.com/
// @match        https://oms-deve.flightroutes24.com/
// @match        https://b2b-deve.flightroutes24.com/*
// @match        https://b2b-devb.flightroutes24.com/*
// @match        https://flightroutes24.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534129/%E6%98%BE%E7%A4%BA%E5%B9%B6%E5%A4%8D%E5%88%B6%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9D%A2%20Cookie%20%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/534129/%E6%98%BE%E7%A4%BA%E5%B9%B6%E5%A4%8D%E5%88%B6%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9D%A2%20Cookie%20%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮容器
    const container = document.createElement('div');
    container.id = 'cookie-display-container';
    Object.assign(container.style, {
        position: 'fixed',
        top: '55px',
        right: '10px',
        zIndex: 9999,
        fontFamily: 'Arial, sans-serif'
    });
    document.body.appendChild(container);

     // SVG 图标字符串（根据用户提供）
    const svgIcon = `
<svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
  <path d="M1003.56796 470.474919c-59.400116-20.998041-99.598195-77.398151-99.598194-140.398274 1.202002-10.20202-3.600007-18.600036-11.400023-25.800051-6.600013-5.402011-16.798033-7.800015-25.198049-6.602013-50.402098 7.200014-98.400192-7.200014-135.000264-36.600071s-62.402122-73.798144-66.60013-125.398245c-0.600001-9.002018-6.002012-17.402034-13.802027-22.800045-7.800015-4.802009-17.398034-6.002012-26.400051-2.402004-81.600159 29.400057-158.400309-22.200043-188.998369-92.398181-6.002012-13.202026-19.802039-20.40204-34.200067-17.398034-115.202225 25.80005-218.802427 98.120192-289.600566 189.32237-163.79832 210.600411-147.000287 500.402977 36.600072 684.603337 199.80239 199.196389 522.00102 199.196389 721.203408 0 92.39818-92.40218 153.4003-224.126438 153.4003-364.524712-1.206002-19.802039-1.806004-33.000064-20.40604-39.604077z" fill="#FEA832" />
  <path d="M1023.968 510.076996c0 140.398274-61.000119 272.122531-153.4003 364.524712-199.200389 199.196389-521.401018 199.196389-721.203408 0l583.003138-613.527198c36.600071 29.400057 84.598165 43.798086 135.000264 36.600071 8.400016-1.198002 18.600036 1.202002 25.198049 6.602013 7.800015 7.200014 12.602025 15.59603 11.400023 25.800051 0 63.000123 40.198079 119.400233 99.598194 140.398274 18.604036 6.604013 19.204038 19.802039 20.40404 39.602077z" fill="#FE9923" />
  <path d="M386.968756 624.999221c-15.000029-13.198026-35.402069-20.998041-57.000112-20.998041-49.802097 0-90.000176 40.198079-90.000175 90.000175 0 23.400046 9.002018 44.400087 23.400045 60.000118 16.198032 18.600036 40.198079 30.000059 66.60013 30.000058 49.802097 0 90.000176-40.202079 90.000176-90.000176-0.002-28.202055-12.602025-52.800103-33.000064-69.002134z" fill="#994C0F" />
  <path d="M629.96723 604.00118c-49.628097 0-90.000176-40.372079-90.000175-90.000176s40.372079-90.000176 90.000175-90.000176 90.000176 40.372079 90.000176 90.000176-40.370079 90.000176-90.000176 90.000176zM599.967172 844.001648c-33.076065 0-60.000117-26.924053-60.000117-60.000117s26.924053-60.000117 60.000117-60.000117 60.000117 26.924053 60.000117 60.000117-26.924053 60.000117-60.000117 60.000117z" fill="#713708" />
  <path d="M359.966703 424.000828c-33.076065 0-60.000117-26.924053-60.000117-60.000117s26.924053-60.000117 60.000117-60.000117 60.000117 26.924053 60.000117 60.000117-26.924053 60.000117-60.000117 60.000117z" fill="#994C0F" />
  <path d="M808.477579 636.261243m-30.000059 0a30.000059 30.000059 0 1 0 60.000118 0 30.000059 30.000059 0 1 0-60.000118 0Z" fill="#713708" />
  <path d="M208.456407 516.261008m-30.000058 0a30.000059 30.000059 0 1 0 60.000117 0 30.000059 30.000059 0 1 0-60.000117 0Z" fill="#994C0F" />
  <path d="M419.96682 694.001355c0 49.798097-40.198079 90.000176-90.000176 90.000176-26.400052 0-50.402098-11.400022-66.60013-30.000058l123.600242-129.002252c20.40004 16.202032 33.000064 40.80008 33.000064 69.002134z" fill="#713708" />
</svg>
    `;
    const closeSvg = `
    <svg t="1745723968944" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8249" width="24" height="24"><path d="M846.005097 957.24155c-28.587082 0-57.174164-10.911514-78.996169-32.733519L96.632851 254.131955c-43.644009-43.644009-43.644009-114.348328 0-157.992337s114.348328-43.644009 157.992337 0L925.001265 766.515694c43.644009 43.644009 43.644009 114.348328 0 157.992337C903.17926 946.330036 874.592179 957.24155 846.005097 957.24155z" fill="#FF4400" p-id="8250"></path><path d="M175.62902 957.24155c-28.587082 0-57.174164-10.911514-78.996169-32.733519-43.644009-43.644009-43.644009-114.348328 0-157.992337L767.008928 96.139617c43.644009-43.644009 114.348328-43.644009 157.992337 0s43.644009 114.348328 0 157.992337L254.625188 924.508032C232.803183 946.330036 204.216101 957.24155 175.62902 957.24155z" fill="#FF4400" p-id="8251"></path></svg>
    `;
    const copySvg = `
    <svg t="1745724396068" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13600" width="24" height="24"><path d="M675.84 266.24H389.12c-67.584 0-122.88 55.296-122.88 122.88v286.72c-53.248-2.048-81.92-32.768-81.92-90.112V272.384c0-57.344 30.72-90.112 90.112-90.112h313.344c53.248 2.048 86.016 30.72 88.064 83.968z" opacity=".3" p-id="13601"></path><path d="M438.272 348.16h313.344c57.344 0 90.112 30.72 90.112 90.112v313.344c0 57.344-30.72 90.112-90.112 90.112H438.272c-57.344 0-90.112-30.72-90.112-90.112V438.272c0-59.392 30.72-90.112 90.112-90.112z" p-id="13602"></path></svg>
    `;

    // “显示/关闭 Cookie 列表”按钮（使用 SVG）
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'cookie-display-button';
    toggleBtn.innerHTML = svgIcon;
    Object.assign(toggleBtn.style, {
        marginRight: '5px',
        padding: '5px',
        cursor: 'pointer',
        border: 'none',
        background: 'transparent'
    });
    container.appendChild(toggleBtn);

    // “复制所有 Cookie”按钮
    const copyBtn = document.createElement('button');
    copyBtn.id = 'cookie-copy-button';
    copyBtn.innerHTML = copySvg;
    Object.assign(copyBtn.style, {
        padding: '5px',
        cursor: 'pointer',
        border: 'none',
        background: 'transparent',
         display: 'none',
    });
    container.appendChild(copyBtn);

    // 创建列表面板（初始隐藏）
    const panel = document.createElement('div');
    panel.id = 'cookie-display-panel';
    Object.assign(panel.style, {
        display: 'none',
        marginTop: '5px',
        padding: '8px',
        maxWidth: '300px',
        maxHeight: '400px',
        overflowY: 'auto',
        background: '#f9f9f9',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
    });
    container.appendChild(panel);

    // 解析并渲染 Cookie 列表
    function renderCookies() {
        panel.innerHTML = '';
        const raw = document.cookie || '';
        const items = raw.split(';').map(s => s.trim()).filter(s => s);
        if (items.length === 0) {
            const empty = document.createElement('div');
            empty.textContent = '(无可用 Cookie)';
            panel.appendChild(empty);
            return;
        }
        const ul = document.createElement('ul');
        ul.style.padding = '0';
        ul.style.margin = '0';
        ul.style.listStyle = 'none';
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            li.style.padding = '2px 0';
            li.style.borderBottom = '1px solid #eee';
            ul.appendChild(li);
        });
        panel.appendChild(ul);
    }

    // 切换显示/隐藏列表
    toggleBtn.addEventListener('click', () => {
        if (panel.style.display === 'none') {
            renderCookies();
            panel.style.display = 'block';
            toggleBtn.innerHTML = closeSvg;
            copyBtn.style.display = 'inline-block';
        } else {
            panel.style.display = 'none';
            toggleBtn.innerHTML = svgIcon;
            copyBtn.style.display = 'none';
        }
    });

    // 复制所有 Cookie 到剪贴板
    copyBtn.addEventListener('click', () => {
        const allCookies = document.cookie || '';
        if (!allCookies) {
            alert('当前无可用 Cookie');
            return;
        }
        // 使用 Clipboard API
        navigator.clipboard.writeText(allCookies)
            .then(() => {
                copyBtn.textContent = '已复制！';
                setTimeout(() => { copyBtn.innerHTML = copySvg; }, 1500);
            })
            .catch(err => {
                console.error('复制失败', err);
                alert('复制失败，请检查浏览器权限');
            });
    });
})();
