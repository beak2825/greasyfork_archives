// ==UserScript==
// @name         复制 Classviva 的题目为 HTML 代码
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  复制 Classviva 的题目为 HTML 代码，便于使用 AI 进行题目的分析及解答
// @author       GamerNoTitle
// @match        *://*.classviva.org/*
// @match        *://*.classviva.hkust-gz.edu.cn/*
// @icon         https://www.classviva.org/pluginfile.php?file=%2F1%2Fcore_admin%2Flogocompact%2F100x100%2F1731391655%2Ffavicon.png
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539284/%E5%A4%8D%E5%88%B6%20Classviva%20%E7%9A%84%E9%A2%98%E7%9B%AE%E4%B8%BA%20HTML%20%E4%BB%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/539284/%E5%A4%8D%E5%88%B6%20Classviva%20%E7%9A%84%E9%A2%98%E7%9B%AE%E4%B8%BA%20HTML%20%E4%BB%A3%E7%A0%81.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('[ClassViva-Copier] 脚本已加载。');

    // 关于图标 SVG
    const aboutIconSVG = `<svg t="1749807240654" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4284" width="1em" height="1em" fill="currentColor" style="vertical-align: -0.125em; display:inline-block!important;"><path d="M512 992C246.912 992 32 777.088 32 512 32 246.912 246.912 32 512 32c265.088 0 480 214.912 480 480 0 265.088-214.912 480-480 480z m-59.072-512v236.32a54.144 54.144 0 1 0 108.288 0V480a54.144 54.144 0 1 0-108.288 0z m53.76-226.464c-14.72 0-27.232 4.544-37.568 15.136-11.04 9.856-16.192 22.72-16.192 38.656 0 15.136 5.152 28 16.192 38.624 10.336 10.592 22.848 15.904 37.6 15.904a57.6 57.6 0 0 0 39.04-15.168c10.304-10.592 15.456-23.456 15.456-39.36s-5.12-28.8-15.456-38.656c-10.304-10.56-23.584-15.136-39.04-15.136z" p-id="4285"></path></svg>`;

    // GitHub 图标的 SVG
    const githubIconSVG = `<svg t="1749807508558" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5253" width="1em" height="1em" fill="currentColor" style="vertical-align: -0.125em; display:inline-block!important;"><path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9 23.5 23.2 38.1 55.4 38.1 91v112.5c0.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z" p-id="5254"></path></svg>`;

    // Blog 图标 SVG
    const blogIconSVG = `<svg t="1749807544363" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7287" width="1em" height="1em" fill="currentColor" style="vertical-align: -0.125em; display:inline-block!important;"><path d="M369.437585 678.288281l64.901149 86.490863 22.083971 0L607.479073 605.751221l119.321596 159.027923 71.447239 0L607.479073 513.579985 445.380208 688.829358 369.437585 585.346495 233.094314 764.780167l71.446215 0L369.437585 678.288281zM274.238386 272.66096l63.698764 0 0 63.698764-63.698764 0L274.238386 272.66096 274.238386 272.66096zM385.055285 272.66096l365.597629 0 0 63.698764L385.055285 336.359724 385.055285 272.66096 385.055285 272.66096zM274.238386 400.058488l63.698764 0 0 62.822814-63.698764 0L274.238386 400.058488 274.238386 400.058488zM385.055285 400.058488l365.597629 0 0 62.822814L385.055285 462.881302 385.055285 400.058488 385.055285 400.058488zM892.880195 257.394255c0-70.117964-56.839543-126.957507-126.959553-126.957507L258.096754 130.436748c-70.117964 0-126.95853 56.839543-126.95853 126.957507l0 507.817748c0 70.120011 56.840566 126.960577 126.95853 126.960577l507.823887 0c70.120011 0 126.959553-56.840566 126.959553-126.960577L892.880195 257.394255 892.880195 257.394255zM849.773422 756.258073c0 50.774407-41.159422 91.934852-91.933829 91.934852l-490.787886 0c-50.773384 0-91.933829-41.160445-91.933829-91.934852L175.117878 265.479397c0-50.77236 41.160445-91.938945 91.933829-91.938945l490.787886 0c50.774407 0 91.933829 41.166585 91.933829 91.938945L849.773422 756.258073 849.773422 756.258073zM830.055334 741.916437" fill="#272636" p-id="7288"></path></svg>`;

    // 油叉图标 SVG
    const greasyforkIconSVG = `<svg t="1749807671406" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8281" width="1em" height="1em" fill="currentColor" style="vertical-align: -0.125em; display:inline-block!important;"><path d="M398.10844445 966.08711111c-98.87288889-11.60533333-174.19377778-64.62577778-241.664-133.68888889-31.17511111-31.97155555-6.71288889-60.87111111 3.5271111-86.69866667 6.94044445-17.52177778 25.6-6.82666667 29.35466667 12.288 3.86844445 19.56977778-5.34755555 41.52888889 9.89866667 66.1048889 15.58755555-21.04888889 9.216-39.48088889 10.46755556-56.09244445 1.13777778-14.56355555 4.66488889-28.10311111 20.9351111-29.01333333 18.77333333-1.024 18.20444445 14.79111111 19.456 28.33066666 1.59288889 16.72533333-5.12 35.15733333 11.60533334 58.02666667 13.08444445-31.51644445 9.55733333-57.23022222 5.46133333-81.69244445-2.95822222-17.74933333-17.63555555-33.45066667-35.95377777-23.66577777-34.01955555 18.09066667-66.21866667-9.32977778-101.48977778 3.86844444v72.704C59.392 708.26666667 36.63644445 616.33422222 28.89955555 517.68888889c21.95911111-3.072 39.48088889-1.25155555 48.24177778 18.77333333 13.08444445 29.92355555-21.27644445 34.58844445-40.39111111 63.14666667 43.46311111-6.25777778 63.37422222-19.91111111 62.00888889-53.47555556-1.59288889-41.87022222-28.21688889-52.90666667-69.40444444-45.85244444 6.82666667-173.056 80.55466667-309.81688889 224.71111111-400.95288889 129.82044445-82.03377778 272.49777778-97.84888889 419.27111111-42.78044445 3.41333333 1.25155555 5.46133333 5.91644445 8.07822222 9.10222223-44.82844445 26.39644445-12.85688889 58.93688889-10.46755556 89.088 15.01866667-29.35466667 8.07822222-60.30222222 8.98844445-90.68088889C779.37777778 81.92 922.73777778 214.12977778 933.20533333 297.75644445c-21.04888889-31.17511111-53.36177778-11.60533333-84.08177778-20.0248889 8.87466667 34.01955555-7.96444445 68.15288889 11.94666667 101.60355556 17.18044445-17.18044445 8.53333333-34.47466667 10.01244445-49.94844444 1.59288889-15.92888889 3.64088889-32.08533333 23.09688888-31.63022222 17.86311111 0.45511111 16.27022222 16.95288889 17.52177778 30.1511111 1.59288889 16.27022222-5.91644445 34.816 11.49155556 53.70311112 15.70133333-31.06133333 3.75466667-59.16444445 8.53333333-85.44711112 12.51555555-7.05422222 13.53955555 5.12 16.04266667 10.92266667 58.93688889 133.91644445 58.59555555 267.94666667-0.91022222 401.74933333-8.64711111 19.56977778-9.44355555 19.22844445-58.93688889 38.912-11.264-21.95911111-27.19288889-36.40888889-57.79911111-24.34844444 37.77422222 2.84444445 23.66577778 61.55377778 75.776 55.18222222-56.09244445 84.53688889-125.15555555 142.90488889-217.88444445 168.96-87.15377778 24.46222222-174.53511111 52.90666667-267.60533333 31.17511112-10.35377778-2.38933333-19.22844445-3.64088889-23.552-14.10844445 31.17511111 5.91644445 60.64355555-13.53955555 91.81866666-4.89244445-32.88177778-35.72622222-62.12266667-19.79733333-90.5671111 6.37155556zM125.952 249.96977778c-12.40177778 19.79733333-5.91644445 28.89955555 2.84444445 37.66044444 63.71555555 63.60177778 127.08977778 127.54488889 191.37422222 190.57777778 16.384 16.15644445 39.36711111 24.23466667 59.96088888 13.65333333 27.07911111-13.99466667 41.52888889-2.27555555 59.27822223 15.58755556 104.33422222 105.472 209.35111111 210.37511111 314.82311111 314.82311111 35.27111111 34.92977778 67.47022222 35.49866667 87.83644444 4.32355555 21.04888889-32.19911111-0.22755555-53.248-20.48-73.61422222-101.14844445-101.60355555-202.41066667-203.20711111-304.35555555-304.01422222-21.61777778-21.39022222-42.43911111-38.68444445-25.37244445-74.52444444 8.64711111-18.09066667-0.34133333-39.48088889-15.58755555-54.84088889-50.97244445-51.31377778-101.71733333-102.96888889-153.37244445-153.6-18.31822222-17.86311111-32.99555555-41.30133333-59.84711111-49.83466667-4.66488889 5.91644445-11.15022222 11.49155555-10.24 13.312 33.67822222 66.44622222 101.83111111 102.62755555 144.04266667 162.58844444-11.71911111 15.24622222-23.77955555 30.37866667-45.16977778 41.5288889-26.28266667-27.19288889-51.08622222-56.88888889-79.98577778-81.69244445-25.82755555-22.18666667-41.52888889-61.32622222-85.67466666-58.02666667 37.54666667 65.536 100.92088889 107.40622222 146.31822222 168.39111112-18.09066667 9.67111111-24.34844445 29.696-43.57688889 34.01955555-6.71288889 6.144-13.53955555 12.288-20.25244445 18.432-47.21777778-54.49955555-94.32177778-108.99911111-142.56355555-164.75022222z m459.09333333 481.39377777c-18.65955555-14.22222222-38.22933333-23.89333333-43.69066666-45.5111111-16.49777778 8.76088889-3.29955555 30.49244445-27.98933334 33.2231111-29.01333333 3.29955555-16.72533333-27.98933333-37.54666666-33.33688888-18.432 41.30133333-8.41955555 81.92 2.50311111 120.14933333 4.43733333 15.47377778 26.05511111 16.384 43.12177777 5.57511111-32.08533333-24.34844445-32.08533333-24.34844445-26.28266666-73.27288889 9.32977778 0 19.11466667-0.45511111 28.672 0.34133333 2.38933333 0.22755555 4.32355555 4.43733333 6.48533333 6.94044445 1.47911111 74.752 4.43733333 78.50666667 65.87733333 56.20622222-41.87022222 0.68266667-45.28355555-16.384-46.5351111-40.27733333-1.47911111-26.28266667 17.52177778-22.30044445 35.38488888-30.03733334z m-151.43822222 94.43555556V683.46311111c-23.21066667 17.63555555-2.38933333 41.52888889-18.54577778 52.224h-51.76888888c-8.07822222-15.92888889 4.55111111-37.20533333-17.63555556-52.56533333V822.61333333c25.48622222-21.16266667 4.55111111-47.104 20.70755556-64.05688888 17.52177778 0.22755555 35.49866667-5.46133333 51.99644444 3.5271111 6.144 18.54577778-4.43733333 39.59466667 15.24622222 63.71555556z m447.37422222-292.63644444c3.072 28.78577778 5.46133333 63.26044445 46.08 62.80533333 40.27733333-0.45511111 44.37333333-34.24711111 44.25955556-65.536-0.11377778-29.696-5.57511111-60.87111111-42.66666667-62.12266667-41.07377778-1.47911111-44.71466667 31.85777778-47.67288889 64.85333334zM540.55822222 324.15288889c1.25155555 31.744 16.04266667 51.08622222 48.35555556 51.88266666 31.744 0.79644445 50.40355555-15.70133333 51.31377777-47.67288888 0.91022222-31.63022222-15.70133333-50.28977778-47.78666666-51.42755556-31.744-1.024-48.69688889 16.27022222-51.88266667 47.21777778z m-11.03644444-164.97777778c26.39644445-72.59022222 15.70133333-87.83644445-70.54222223-101.03466666 7.05422222 32.768-7.28177778 66.56 15.58755556 97.7351111 6.37155555-18.54577778 5.80266667-37.20533333 6.59911111-55.86488888 0.56888889-12.85688889 7.62311111-22.86933333 21.27644445-22.75555556 15.01866667 0.22755555 16.72533333 12.40177778 18.20444444 24.576 2.27555555 17.97688889-6.144 38.11555555 8.87466667 57.344z m39.82222222-108.08888889c-21.504 85.90222222-12.74311111 97.28 72.13511111 98.75911111-5.57511111-30.83377778 8.87466667-63.82933333-11.03644444-96.59733333-16.15644445 19.456-7.168 38.34311111-9.55733334 55.52355555-2.048 14.90488889-7.62311111 27.19288889-23.89333333 25.94133334-14.56355555-1.13777778-14.90488889-14.67733333-16.49777778-26.624-2.16177778-17.29422222 7.168-36.18133333-11.15022222-57.00266667z m85.78844445 337.69244445c22.18666667-28.78577778 13.65333333-47.67288889 15.92888888-64.96711112 1.93422222-14.90488889 7.39555555-26.96533333 23.66577778-25.94133333 14.56355555 0.91022222 15.01866667 14.22222222 16.83911111 26.16888889 2.61688889 17.52177778-8.07822222 38.22933333 18.54577778 63.14666667-0.11377778-39.25333333 8.76088889-68.26666667-5.91644445-95.232-17.52177778-32.31288889-48.58311111 0.91022222-69.0631111-14.44977778v111.27466667zM632.03555555 728.17777778c-18.432 5.12-24.80355555-19.56977778-42.09777777-3.41333333 5.00622222 42.66666667-5.00622222 88.064 6.48533333 138.24 21.95911111-17.63555555 9.10222222-38.34311111 17.29422222-52.7928889 50.28977778 12.51555555 63.03288889 3.52711111 53.93066667-46.64888888-10.69511111 20.93511111-20.36622222 44.82844445-42.66666667 29.696-27.19288889-18.432-11.94666667-40.16355555 7.05422222-65.08088889zM339.28533333 566.272c-21.504-20.93511111-13.76711111-56.88888889-52.11022222-74.52444445 13.76711111 36.52266667 23.09688889 65.30844445 35.49866667 92.61511112 8.192 18.09066667 27.648 19.79733333 32.65422222 1.93422222 5.12-17.86311111 24.46222222-35.04355555 13.88088889-57.344-22.30044445 3.29955555-15.24622222 25.03111111-29.92355556 37.31911111z m79.98577778-28.78577778c-13.08444445 4.66488889-29.12711111 10.12622222-28.10311111 31.17511111 1.024 19.79733333 13.65333333 29.92355555 32.768 27.648 17.86311111-2.16177778 29.92355555-11.49155555 27.53422222-32.768-1.93422222-17.97688889-11.71911111-25.71377778-32.19911111-26.05511111z m-149.39022222 75.20711111c-12.06044445-48.01422222-16.72533333-95.80088889-1.024-144.04266666-40.96 48.24177778-32.31288889 96.48355555 1.024 144.04266666z m34.92977778 204.11733334c3.29955555 0 6.71288889-0.11377778 10.01244444-0.11377778V678.11555555c-3.29955555 0-6.71288889 0.11377778-10.01244444 0.11377778v138.58133334z m505.74222222-301.16977778c-36.52266667-7.96444445-73.27288889-13.76711111-108.65777778 1.82044444 36.52266667 11.37777778 72.704 13.42577778 108.65777778-1.82044444z m-0.22755556 41.07377778c-36.40888889-9.32977778-72.704-13.42577778-108.544 0.22755555 36.29511111 12.85688889 72.47644445 11.71911111 108.544-0.22755555z m2.16177778-181.02044445c8.30577778-33.22311111 15.36-66.67377778-3.98222222-98.41777777-5.34755555 32.99555555-12.51555555 65.87733333 3.98222222 98.41777777z m-696.32 122.19733333c-5.91644445 33.22311111-13.08444445 66.67377778 3.52711111 106.26844445 14.44977778-52.45155555 14.10844445-73.728-3.52711111-106.26844445z m408.68977778-124.47288888c4.66488889-31.744 11.15022222-64.73955555-4.20977778-96.256-17.06666667 32.19911111-5.91644445 63.82933333 4.20977778 96.256zM379.79022222 110.25066667h-85.67466667c33.67822222 21.39022222 59.392 17.06666667 85.67466667 0z" fill="#060606" p-id="8282"></path><path d="M901.46133333 531.79733333c1.25155555-19.11466667 0.68266667-42.66666667 23.89333334-43.12177778 27.30666667-0.56888889 25.94133333 24.80355555 26.16888888 44.37333334 0.22755555 18.31822222-0.34133333 41.75644445-23.43822222 42.32533333-27.53422222 0.68266667-24.80355555-25.03111111-26.624-43.57688889zM588.45866667 296.73244445c19.56977778 0.79644445 31.51644445 10.12622222 31.63022222 30.1511111 0.11377778 17.29422222-9.89866667 27.76177778-27.19288889 29.01333334-17.29422222 1.25155555-28.89955555-7.62311111-31.28888889-24.68977778-2.50311111-19.456 7.50933333-31.06133333 26.85155556-34.47466666z" fill="#060606" p-id="8283"></path></svg>`;


    // --- 导航栏通知函数 ---
    let notificationElement = null; // 用于存储通知元素的引用
    let notificationTimeout = null; // 用于控制通知淡出和移除的定时器

    /**
     * 在导航栏显示一个临时通知
     * @param {string} message 要显示的通知消息
     */
    function showNavbarNotification(message) {
        // 如果当前有通知正在显示，先清除旧的，确保只显示最新消息
        if (notificationTimeout) {
            clearTimeout(notificationTimeout);
            if (notificationElement) {
                notificationElement.remove(); // 立即移除旧元素
                notificationElement = null;
            }
        }

        const aboutLi = document.getElementById('my-about-dropdown');
        const notificationsLi = document.querySelector('li.nav-item div#nav-notification-popover-container')?.closest('li');

        const targetInsertionPoint = aboutLi || notificationsLi;
        const navUl = targetInsertionPoint ? targetInsertionPoint.parentNode : null;

        if (!navUl || !targetInsertionPoint) {
            console.error('[ClassViva-Copier] 无法找到导航栏插入点（“关于”菜单或通知铃铛），无法显示通知。');
            return;
        }

        notificationElement = document.createElement('li');
        notificationElement.id = 'myNavbarNotification';
        notificationElement.classList.add('nav-item', 'd-flex', 'align-items-center', 'my-custom-notification', 'mr-3');

        notificationElement.innerHTML = `
            <span style="
                background-color: #d4edda;
                color: #155724;
                padding: 5px 10px;
                border-radius: 5px;
                font-size: 14px;
                opacity: 0;
                transition: opacity 0.5s ease-in-out;
                white-space: nowrap;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            ">${message}</span>
        `;

        // 将通知元素插入到目标元素的前面
        navUl.insertBefore(notificationElement, targetInsertionPoint);

        // 强制浏览器回流/重绘，以便后续的opacity过渡生效
        void notificationElement.offsetWidth;

        // 让消息淡入
        notificationElement.querySelector('span').style.opacity = '1';
        console.log('[ClassViva-Copier] 导航栏通知显示:', message);

        // 设置定时器，在显示一段时间后淡出并移除通知
        notificationTimeout = setTimeout(() => {
            const innerSpan = notificationElement.querySelector('span');
            if (innerSpan) {
                innerSpan.style.opacity = '0'; // 淡出
                // 在淡出动画完成后彻底移除元素
                setTimeout(() => {
                    if (notificationElement && notificationElement.parentNode) {
                        notificationElement.remove();
                        notificationElement = null;
                        console.log('[ClassViva-Copier] 导航栏通知已移除。');
                    }
                }, 500);
            }
        }, 3000);
    }
    // --- 导航栏通知函数结束 ---

    /**
     * 添加 【关于】 下拉菜单到导航栏
     */
    function addAboutMenu() {
        // 查找导航栏中通知铃铛所在的 li 元素
        const notificationsLi = document.querySelector('li.nav-item div#nav-notification-popover-container')?.closest('li');
        const navUl = notificationsLi ? notificationsLi.parentNode : null;

        if (!navUl || !notificationsLi) {
            console.error('[ClassViva-Copier] 未找到导航栏通知铃铛或其父UL元素，无法添加菜单。');
            return;
        }

        // 检查是否已经添加过【关于】菜单
        if (document.getElementById('my-about-dropdown')) {
            console.log('[ClassViva-Copier] 菜单已存在，跳过添加。');
            return;
        }

        // 创建【关于】菜单的 li 元素
        const aboutLi = document.createElement('li');
        aboutLi.id = 'my-about-dropdown';
        aboutLi.classList.add('dropdown', 'nav-item'); // 模仿现有dropdown结构

        // 创建下拉菜单的触发链接
        const aboutToggle = document.createElement('a');
        aboutToggle.classList.add('dropdown-toggle', 'nav-link', 'icon-no-margin');
        aboutToggle.href = '#';
        aboutToggle.setAttribute('data-toggle', 'dropdown');
        aboutToggle.setAttribute('aria-haspopup', 'true');
        aboutToggle.setAttribute('aria-expanded', 'false');
        aboutToggle.setAttribute('aria-label', '关于脚本');
        aboutToggle.setAttribute('aria-controls', 'my-about-menu');

        // 插入图标和文本
        aboutToggle.innerHTML = `${aboutIconSVG}<span class="d-none d-md-inline-flex ml-1">关于</span><b class="caret"></b>`;

        // 创建下拉菜单内容 div
        const aboutMenuDiv = document.createElement('div');
        aboutMenuDiv.id = 'my-about-menu';
        aboutMenuDiv.classList.add('dropdown-menu', 'dropdown-menu-right', 'menu', 'align-tr-br');
        aboutMenuDiv.setAttribute('role', 'menu');
        aboutMenuDiv.setAttribute('aria-labelledby', 'my-about-toggle');

        // 添加下拉菜单项
        aboutMenuDiv.innerHTML = `
            <a href="https://github.com/GDUTMeow/ClassViva-Copier" class="dropdown-item menu-action" role="menuitem" target="_blank" rel="noopener noreferrer">
                ${githubIconSVG}
                <span class="menu-action-text ml-1">Github 脚本仓库</span>
            </a>
            <a href="https://greasyfork.org/zh-CN/scripts/539284-%E5%A4%8D%E5%88%B6-classviva-%E7%9A%84%E9%A2%98%E7%9B%AE%E4%B8%BA-html-%E4%BB%A3%E7%A0%81" class="dropdown-item menu-action" role="menuitem" target="_blank" rel="noopener noreferrer">
                ${greasyforkIconSVG}
                <span class="menu-action-text ml-1">GreasyFork</span>
            </a>
            <div class="dropdown-divider" role="presentation"><span class="filler"> </span></div>
            <a href="https://github.com/GamerNoTitle" class="dropdown-item menu-action" role="menuitem" target="_blank" rel="noopener noreferrer">
                ${githubIconSVG}
                <span class="menu-action-text ml-1">@GamerNoTitle</span>
            </a>
            <a href="https://bili33.top" class="dropdown-item menu-action" role="menuitem" target="_blank" rel="noopener noreferrer">
                ${blogIconSVG}
                <span class="menu-action-text ml-1">作者博客</span>
            </a>
        `;

        // 组装并插入元素
        aboutLi.appendChild(aboutToggle);
        aboutLi.appendChild(aboutMenuDiv);
        navUl.insertBefore(aboutLi, notificationsLi);

        console.log('[ClassViva-Copier] 【关于】菜单已添加到导航栏。');
    }


    /**
     * 为符合条件的题目添加复制按钮
     */
    function addCopyButtons() {
        const questionIdRegex = /^question-\d+-\d+$/;
        const allPotentialQuestionDivs = document.querySelectorAll('div[id^="question-"]');

        console.log(`[ClassViva-Copier] 发现 ${allPotentialQuestionDivs.length} 个潜在的题目元素 (基于ID前缀).`);

        allPotentialQuestionDivs.forEach(questionDiv => {
            if (questionIdRegex.test(questionDiv.id)) {
                const infoElement = questionDiv.querySelector('.info');
                const localTestOpaqueqeElement = questionDiv.querySelector('.local_testopaqueqe');

                if (infoElement && localTestOpaqueqeElement && !infoElement.querySelector('.copy-question-html-btn')) {
                    console.log(`[ClassViva-Copier] 正在为题目 ID: ${questionDiv.id} 添加复制按钮.`);

                    const copyButton = document.createElement('button');
                    copyButton.textContent = '复制本题 HTML';
                    copyButton.classList.add('copy-question-html-btn');

                    // 自定义按钮样式
                    copyButton.style.cssText = `
                        margin-top: 8px;
                        padding: 5px 10px;
                        background-color: #8e8cd8;
                        color: #fff;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 14px;
                        transition: background-color 0.2s ease, transform 0.1s ease;
                        font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
                    `;

                    // 添加hover和点击效果
                    copyButton.addEventListener('mouseover', () => {
                        copyButton.style.backgroundColor = '#b2a5ff';
                    });
                    copyButton.addEventListener('mouseout', () => {
                        copyButton.style.backgroundColor = '#8e8cd8';
                    });
                    copyButton.addEventListener('mousedown', () => {
                        copyButton.style.transform = 'scale(0.98)';
                    });
                    copyButton.addEventListener('mouseup', () => {
                        copyButton.style.transform = 'scale(1)';
                    });


                    copyButton.addEventListener('click', function (event) {
                        event.preventDefault();

                        const htmlToCopy = localTestOpaqueqeElement.outerHTML;

                        GM_setClipboard(htmlToCopy);

                        console.log(`[ClassViva-Copier] 用户触发了复制操作，尝试将题目 ${questionDiv.id} 复制到用户剪贴板中……`);

                        // 调用导航栏通知函数
                        showNavbarNotification('题目 ' + questionDiv.id + ' 的 HTML 代码已复制！');
                    });

                    infoElement.appendChild(copyButton);
                }
            }
        });
    }

    // --- MutationObserver 和事件监听部分 ---
    const observer = new MutationObserver(mutations => {
        let relevantChangeDetected = false;
        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 检查是否是题目相关的DOM变化
                        if (node.matches('div[id^="question-"]') || node.querySelector('div[id^="question-"]')) {
                            relevantChangeDetected = true;
                        }
                        const navUlExists = document.querySelector('ul.nav.navbar-nav.ml-auto');
                        const notificationsLiExists = document.querySelector('li.nav-item div#nav-notification-popover-container');
                        if (navUlExists && notificationsLiExists && !document.getElementById('my-about-dropdown')) {
                            if (node.matches('li.nav-item') || node.closest('li.nav-item')) {
                                setTimeout(addAboutMenu, 100); // 稍作延迟，确保DOM稳定
                            }
                        }
                    }
                }
            }
            if (relevantChangeDetected) {
                console.log('[ClassViva-Copier] MutationObserver 检测到相关 DOM 变化，尝试添加按钮...');
                setTimeout(addCopyButtons, 200);
            }
        }
    });

    document.addEventListener('DOMContentLoaded', () => {
        console.log('[ClassViva-Copier] DOMContentLoaded 事件触发.');
        addCopyButtons();
        addAboutMenu();

        observer.observe(document.body, { childList: true, subtree: true });
        console.log('[ClassViva-Copier] MutationObserver 已开始观察 DOM 变化.');
    });

    window.addEventListener('load', () => {
        console.log('[ClassViva-Copier] 窗口加载完成，正在添加元素……');
        addCopyButtons();
        addAboutMenu();
        showNavbarNotification('ClassViva-Copier 脚本已加载！');
    });

})();
