// ==UserScript==
// @name         Show 30d Sales of the Temu
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Show 30d sales of the Temu (动态适配样式类名)
// @author       ismile
// @match        https://agentseller.temu.com/*
// @match        https://seller.kuajingmaihuo.com/*
// @grant        none
// @icon         data:image/svg+xml;base64,PHN2ZyB0PSIxNzMzMzAxNDkwNjI0IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEyMjkgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjEyNTk3IiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTExNjkuMzk4Mjk0IDkzMS43OTE0NjloLTEwODcuMDkwMDQ4VjQyLjEyNDczOWEzOC44MjQ2NDUgMzguODI0NjQ1IDAgMCAwLTM4LjgyNDY0NC00MS4xNTQxMjNDMTkuNDEyMzIyIDAuOTcwNjE2IDYuOTg4NDM2IDE5LjQxMjMyMiA2Ljk4ODQzNiA0Mi4xMjQ3Mzl2OTE4LjU5MTA5YTQxLjczNjQ5MyA0MS43MzY0OTMgMCAwIDAgMjkuNzAwODUzIDM5Ljk4OTM4NCA0MS41NDIzNyA0MS41NDIzNyAwIDAgMCAyMi41MTgyOTQgNi43OTQzMTNoMTExMC4xOTA3MTFhMzYuODgzNDEyIDM2Ljg4MzQxMiAwIDAgMCA0MC45Ni0zNi44ODM0MTIgMzguODI0NjQ1IDM4LjgyNDY0NSAwIDAgMC00MC45Ni0zOC44MjQ2NDV6IiBmaWxsPSIjZDQyMzdhIiBwLWlkPSIxMjU5OCIvPjxwYXRoIGQ9Ik0xNTEuNjEwMjM3IDc0Ny4zNzQ0MDhoMTA3LjU0NDI2NWEzMS4yNTM4MzkgMzEuMjUzODM5IDAgMCAwIDI3Ljk1Mzc0NC0xNi44ODg3MjFsNjYuNTg0MjY2LTkzLjk1NTY0IDEwMy44NTU5MjQgMjEyLjE3NjY4M2EzMS42NDIwODUgMzEuNjQyMDg1IDAgMCAwIDI4LjUzNjExNCAxNy42NjUyMTNoMi4zMjk0NzhhMzEuODM2MjA5IDMxLjgzNjIwOSAwIDAgMCAyOS44OTQ5NzctMjEuNTQ3Njc4bDE2NC44MTA2MTYtNDgzLjE3MjcwMSA5Ny4wNjE2MTEgMjk1LjY0OTY2OGEzMS42NDIwODUgMzEuNjQyMDg1IDAgMCAwIDI1LjIzNjAxOSAyMS4zNTM1NTUgMzQuNzQ4MDU3IDM0Ljc0ODA1NyAwIDAgMCAxMS44NDE1MTcgMi4zMjk0NzhoMTY3LjUyODM0MWE4MC45NDkzODQgODAuOTQ5Mzg0IDAgMCAwIDY3LjM2MDc1OCAzMi4wMzAzMzJjNDEuOTMwNjE2IDAgNzYuMDk2MzAzLTI2Ljk4MzEyOCA3Ni4wOTYzMDQtNjAuMTc4MTk5cy0zNC4xNjU2ODctNTkuOTg0MDc2LTc2LjA5NjMwNC01OS45ODQwNzZhODQuMDU1MzU1IDg0LjA1NTM1NSAwIDAgMC02MS41MzcwNjEgMjQuODQ3NzczSDgzNC43Mjk4NThsLTExOS45NjgxNTItMzYyLjQyODA1N2EzMS42NDIwODUgMzEuNjQyMDg1IDAgMCAwLTYwLjk1NDY5Mi0yLjkxMTg0OGwtMTcxLjYwNDkyOSA1MDIuNTg1MDIzTDM4OC4yNDY0NDUgNTYzLjkyNzk2MmMtMC45NzA2MTYtMS43NDcxMDktMS45NDEyMzItMy40OTQyMTgtMy4xMDU5NzEtNS4yNDEzMjdhMzUuNTI0NTUgMzUuNTI0NTUgMCAwIDAtOC43MzU1NDUtOS4xMjM3OTEgMzEuNjQyMDg1IDMxLjY0MjA4NSAwIDAgMC00NC4wNjU5NzIgNy4zNzY2ODJsLTg5LjY4NDkyOSAxMjcuMTUwNzExSDE1MS42MTAyMzdhMzEuNjQyMDg1IDMxLjY0MjA4NSAwIDEgMCAwIDYzLjI4NDE3MXoiIGZpbGw9IiNkNDIzN2EiIHAtaWQ9IjEyNTk5Ii8+PHBhdGggZD0iTTg4My4yNjA2NjQgMzA3LjY4NTMwOGMtNDYuMDA3MjA0IDAtOTUuMzE0NTAyLTIzLjQ4ODkxLTk3LjA2MTYxMi04OS4yOTY2ODJ2LTYuMDE3ODJoNjQuMDYwNjY0djUuNjI5NTczYTMyLjYxMjcwMSAzMi42MTI3MDEgMCAwIDAgNjUuMDMxMjc5LTIuMTM1MzU1IDMwLjQ3NzM0NiAzMC40NzczNDYgMCAwIDAtMzMuOTcxNTY0LTMzLjE5NTA3MWgtMTMuMzk0NTAyVjEyNi4xODAwOTVoMTMuMzk0NTAyQTI2Ljk4MzEyOCAyNi45ODMxMjggMCAwIDAgOTEyLjM3OTE0NyA5Ny4wNjE2MTFhMjkuMTE4NDgzIDI5LjExODQ4MyAwIDEgMC01OC4yMzY5NjctMS41NTI5ODV2NS40MzU0NWgtNjQuMDYwNjYzdi02LjYwMDE5QTg2Ljk2NzIwNCA4Ni45NjcyMDQgMCAwIDEgODgyLjg3MjQxNyA3Ljk1OTA1MmE4Ni41Nzg5NTcgODYuNTc4OTU3IDAgMCAxIDkyLjAxNDQwOCA4Ni45NjcyMDQgNjYuOTcyNTEyIDY2Ljk3MjUxMiAwIDAgMS0yNy4xNzcyNTIgNTguMjM2OTY3IDc0LjU0MzMxOCA3NC41NDMzMTggMCAwIDEgMzEuMjUzODM5IDY0LjQ0ODkxYzAgNTQuMTYwMzc5LTM3LjY1OTkwNSA5MC4wNzMxNzUtOTUuNzAyNzQ4IDkwLjA3MzE3NXpNMTEwMC4yOTA0MjcgMzA3LjY4NTMwOGE4Ny4xNjEzMjcgODcuMTYxMzI3IDAgMCAxLTkyLjAxNDQwOC05MC4yNjcyOTlWOTguMDMyMjI3YTkyLjAxNDQwOCA5Mi4wMTQ0MDggMCAwIDEgMTgzLjgzNDY5MiAwdjExOS4zODU3ODJhODYuOTY3MjA0IDg2Ljk2NzIwNCAwIDAgMS05MS44MjAyODQgOTAuMjY3Mjk5eiBtMC0yNDEuNDg5Mjg5YTI4LjkyNDM2IDI4LjkyNDM2IDAgMCAwLTI4LjczMDIzNyAzMi42MTI3MDF2MTE4LjIyMTA0M2EyOC41MzYxMTQgMjguNTM2MTE0IDAgMCAwIDI4LjczMDIzNyAzMi40MTg1NzhjMTcuNjY1MjEzIDAgMjguNTM2MTE0LTEyLjQyMzg4NiAyOC41MzYxMTMtMzIuNDE4NTc4Vjk4LjgwODcyYzAtMjAuMTg4ODE1LTEwLjg3MDktMzIuNjEyNzAxLTI4LjUzNjExMy0zMi42MTI3MDF6IiBmaWxsPSIjZDQyMzdhIiBwLWlkPSIxMjYwMCIvPjwvc3ZnPg==
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523271/Show%2030d%20Sales%20of%20the%20Temu.user.js
// @updateURL https://update.greasyfork.org/scripts/523271/Show%2030d%20Sales%20of%20the%20Temu.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // 通过稳定的 bg-shell-theme-* 类名动态提取会变化的 index-module__* 类名
    const getDynamicClass = (stableClass, dynamicPrefix) => {
        const element = document.querySelector(`.${stableClass}`);
        if (!element) return '';
        return Array.from(element.classList).find(cls => cls.startsWith(dynamicPrefix)) || '';
    };

    // 获取元素的完整 className（用于需要多个类名的情况）
    const getFullClassName = (stableClass) => {
        const element = document.querySelector(`.${stableClass}`);
        return element ? element.className : '';
    };

    // 动态获取样式类名的配置
    const getDynamicClasses = () => {
        // 展开状态 - 菜单容器类
        const menuContainer = getFullClassName('bg-shell-theme-menu-mms');
        // 展开状态 - 子菜单类
        const subMenu = getFullClassName('bg-shell-theme-mms-subMenu');
        
        // 菜单项类 - 需要组合 item 和 highlight 类
        const itemClass = getDynamicClass('bg-shell-theme-mms-menu-item', 'index-module__item___');
        const highlightClass = getDynamicClass('bg-shell-theme-mms-menu-item', 'index-module__highlight___');
        const menuItemBase = `${itemClass} ${highlightClass} bg-shell-theme-mms-menu-item `;
        
        // 菜单图标类 - 从已有的菜单图标元素中提取
        const menuIconElement = document.querySelector('.bg-shell-theme-mms-menu-item .beast-icon')?.parentElement;
        const menuIcon = menuIconElement ? 
            Array.from(menuIconElement.classList).find(cls => cls.startsWith('index-module__menuIcon___')) || '' : '';
        
        // 菜单标题类
        const menuTitle = getFullClassName('bg-shell-theme-first-mms-title');
        
        // 菜单提示类 - 从标题旁边的 hint 元素提取
        const hintElement = document.querySelector('.bg-shell-theme-first-mms-title')?.parentElement?.querySelector('[class*="mmsHint"]');
        const menuHint = hintElement ? 
            Array.from(hintElement.classList).find(cls => cls.includes('mmsHint')) || '' : '';
        
        // 折叠状态 - 图标提示类
        const iconHintElement = document.querySelector('[class*="mmsIconHint"]');
        const menuIconHint = iconHintElement ?
            Array.from(iconHintElement.classList).find(cls => cls.includes('mmsIconHint')) || '' : '';

        return {
            // 展开状态样式
            menuContainer,                                              // 菜单容器
            subMenu,                                                    // 子菜单
            menuItemExpanded: menuItemBase + 'bg-shell-theme-mms-menu-item-unfold', // 展开的菜单项
            menuIcon,                                                   // 菜单图标
            menuTitle,                                                  // 菜单标题
            menuHint,                                                   // 菜单提示
            // 折叠状态样式
            menuContainerFold: menuContainer.replace('bg-shell-theme-menu-mms', 'bg-shell-theme-menu-mms-fold'), // 折叠的菜单容器
            menuItemFold: menuItemBase.trim(),                          // 折叠的菜单项
            menuIconHint                                                // 折叠图标提示
        };
    };

    const agentseller = location.host.includes("agentseller.temu.com");
    
    // 基础配置（不包含动态类名）
    const baseConfig = agentseller ? {
        url: "https://agentseller.temu.com/bg/swift/api/common/statistics/web/queryStatisticDataFullManaged",
        referer: "https://agentseller.temu.com/",
        path: "main",
        mallidKey: "agentseller-mall-info-id",
    } : {
        url: "https://seller.kuajingmaihuo.com/marvel/cn/api/sales/management/web/queryStatisticDataSupplier",
        referer: "https://seller.kuajingmaihuo.com/",
        path: "goods",
        mallidKey: "mall-info-id",
    };

    // 获取完整配置（包含动态类名）
    let config = null;
    const getConfig = () => {
        // 如果配置为空，或者动态类名未获取到（为空字符串），则重新获取
        if (!config || !config.menuContainer) {
            const dynamicClasses = getDynamicClasses();
            // 只有当成功获取到主要类名时才缓存配置
            if (dynamicClasses.menuContainer) {
                config = { ...baseConfig, ...dynamicClasses };
                console.log('[30d Sales] 动态样式类名获取成功:', dynamicClasses);
            } else {
                // 返回临时配置，不缓存，下次会继续尝试
                return { ...baseConfig, ...dynamicClasses };
            }
        }
        return config;
    };
    
    // 刷新动态类名（当检测到页面更新时）
    const refreshConfig = () => {
        config = null;
        return getConfig();
    };

    let initValue = "loading...";

    let isCollapsedToExpanded = false;
    
    // 预加载数据的 Promise - 在脚本开始时就立即获取数据
    let preloadPromise = (() => {
        console.log('[30d Sales] Starting data fetch immediately...');
        const url = baseConfig.url;
        const headers = {
            "anti-content": "",
            "content-type": "application/json",
            referer: baseConfig.referer,
            mallid: localStorage.getItem(baseConfig.mallidKey) || "",
        };
        return fetch(url, {
            method: "POST", headers: headers, body: JSON.stringify({}),
        }).then(response => response.json())
        .then(data => {
            if (data.success && data.result) {
                const result = {
                    thirtyDaysSaleVolume: data.result.thirtyDaysSaleVolume || "N/A",
                    qualityAfterSaleRatio90d: data.result.qualityAfterSaleRatio90d || "N/A",
                };
                initValue = result.thirtyDaysSaleVolume;
                console.log('[30d Sales] Data fetched immediately:', result);
                return result;
            } else {
                console.error("Failed to fetch data: ", data.errorMsg || "Unknown error!");
                return {
                    thirtyDaysSaleVolume: "N/A", qualityAfterSaleRatio90d: "N/A",
                };
            }
        }).catch(error => {
            console.error("Error fetching data: ", error);
            return {
                thirtyDaysSaleVolume: "N/A", qualityAfterSaleRatio90d: "N/A",
            };
        });
    })();

    const fetchData = async () => {
        const cfg = getConfig();
        const url = cfg.url;
        const headers = {
            "anti-content": "",
            "content-type": "application/json",
            referer: cfg.referer,
            mallid: localStorage.getItem(cfg.mallidKey) || "",
        };
        try {
            const response = await fetch(url, {
                method: "POST", headers: headers, body: JSON.stringify({}),
            });
            const data = await response.json();

            if (data.success && data.result) {
                return {
                    thirtyDaysSaleVolume: data.result.thirtyDaysSaleVolume || "N/A",
                    qualityAfterSaleRatio90d: data.result.qualityAfterSaleRatio90d || "N/A",
                };
            } else {
                console.error("Failed to fetch data: ", data.errorMsg || "Unknown error!");
                return {
                    thirtyDaysSaleVolume: "N/A", qualityAfterSaleRatio90d: "N/A",
                };
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
            return {
                thirtyDaysSaleVolume: "N/A", qualityAfterSaleRatio90d: "N/A",
            };
        }
    };

    const createExpandedElement = () => {
        const cfg = getConfig();
        const newItem = document.createElement("div");
        newItem.className = "sales-30days";
        newItem.innerHTML = `
            <div class="${cfg.menuContainer}">
                <div class="${cfg.subMenu}" style="max-height: 0px;">
                    <div style="height: 320px;"></div>
                </div>
                <div><a data-tracking-id="menu-${cfg.referer}${cfg.path}/flow-grow" data-report-click-text="近30日销量"
                        href="${cfg.referer}${cfg.path}/flow-grow"
                        class="${cfg.menuItemExpanded}"
                        style="padding-left: 8px; font-size: 14px;">
                        <div class="${cfg.menuIcon}"><span role="img"
                                class="beast-icon" style="font-size: 16px; opacity: 1;">
                                <svg t="1733242526900" class="icon" viewBox="0 0 1229 1024" version="1.1"
                                    xmlns="http://www.w3.org/2000/svg" p-id="12245" width="1em" height="1em" fill="currentColor"
                                    aria-hidden="true" focusable="false">
                                    <path
                                        d="M1169.398294 931.791469h-1087.090048V42.124739a38.824645 38.824645 0 0 0-38.824644-41.154123C19.412322 0.970616 6.988436 19.412322 6.988436 42.124739v918.59109a41.736493 41.736493 0 0 0 29.700853 39.989384 41.54237 41.54237 0 0 0 22.518294 6.794313h1110.190711a36.883412 36.883412 0 0 0 40.96-36.883412 38.824645 38.824645 0 0 0-40.96-38.824645z"
                                        fill="currentColor" p-id="12246"></path>
                                    <path
                                        d="M151.610237 747.374408h107.544265a31.253839 31.253839 0 0 0 27.953744-16.888721l66.584266-93.95564 103.855924 212.176683a31.642085 31.642085 0 0 0 28.536114 17.665213h2.329478a31.836209 31.836209 0 0 0 29.894977-21.547678l164.810616-483.172701 97.061611 295.649668a31.642085 31.642085 0 0 0 25.236019 21.353555 34.748057 34.748057 0 0 0 11.841517 2.329478h167.528341a80.949384 80.949384 0 0 0 67.360758 32.030332c41.930616 0 76.096303-26.983128 76.096304-60.178199s-34.165687-59.984076-76.096304-59.984076a84.055355 84.055355 0 0 0-61.537061 24.847773H834.729858l-119.968152-362.428057a31.642085 31.642085 0 0 0-60.954692-2.911848l-171.604929 502.585023L388.246445 563.927962c-0.970616-1.747109-1.941232-3.494218-3.105971-5.241327a35.52455 35.52455 0 0 0-8.735545-9.123791 31.642085 31.642085 0 0 0-44.065972 7.376682l-89.684929 127.150711H151.610237a31.642085 31.642085 0 1 0 0 63.284171z"
                                        fill="currentColor" p-id="12247"></path>
                                    <path
                                        d="M883.260664 307.685308c-46.007204 0-95.314502-23.48891-97.061612-89.296682v-6.01782h64.060664v5.629573a32.612701 32.612701 0 0 0 65.031279-2.135355 30.477346 30.477346 0 0 0-33.971564-33.195071h-13.394502V126.180095h13.394502A26.983128 26.983128 0 0 0 912.379147 97.061611a29.118483 29.118483 0 1 0-58.236967-1.552985v5.43545h-64.060663v-6.60019A86.967204 86.967204 0 0 1 882.872417 7.959052a86.578957 86.578957 0 0 1 92.014408 86.967204 66.972512 66.972512 0 0 1-27.177252 58.236967 74.543318 74.543318 0 0 1 31.253839 64.44891c0 54.160379-37.659905 90.073175-95.702748 90.073175zM1100.290427 307.685308a87.161327 87.161327 0 0 1-92.014408-90.267299V98.032227a92.014408 92.014408 0 0 1 183.834692 0v119.385782a86.967204 86.967204 0 0 1-91.820284 90.267299z m0-241.489289a28.92436 28.92436 0 0 0-28.730237 32.612701v118.221043a28.536114 28.536114 0 0 0 28.730237 32.418578c17.665213 0 28.536114-12.423886 28.536113-32.418578V98.80872c0-20.188815-10.8709-32.612701-28.536113-32.612701z"
                                        fill="currentColor" p-id="12248"></path>
                                </svg>
                            </span></div>
                        <div class="${cfg.menuTitle}">
                            <div class="bg-shell-theme-name ">
                                <div data-testid="beast-core-ellipsis">
                                    <div class="elli_outerWrapper_5-120-1 elli_lineClamp_5-120-1 beast-core-ellipsis-1">
                                        <style data-testid="beast-core-ellipsis-style">
                                            .beast-core-ellipsis-1 {
                                                -webkit-line-clamp: 1;
                                                -webkit-box-orient: vertical;
                                            }
                                        </style>近30日销量: <span id="loading-span">${initValue}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="${cfg.menuHint}"></div>
                        </div>
                    </a></div>
            </div>
          `;
        // 添加调试日志
        console.log('[30d Sales] createExpandedElement:', {
            initValue,
            isCollapsedToExpanded,
            host: location.host
        });
        
        // 数据获取逻辑已移至 manageElement 函数中，确保在元素插入 DOM 后再获取
        isCollapsedToExpanded = false;
        return newItem;
    };

    const createCollapsedElement = () => {
        const cfg = getConfig();
        const newItem = document.createElement("div");
        newItem.className = "fold-sales-30days";
        newItem.innerHTML = `
            <div class="${cfg.menuContainerFold}">
                <div><a data-tracking-id="menu-${cfg.referer}${cfg.path}/flow-grow" data-report-click-text="近30日销量"
                        href="${cfg.referer}${cfg.path}/flow-grow"
                        class="${cfg.menuItemFold}"
                        style="padding-left: 16px; font-size: 14px;">
                        <div class="${cfg.menuIcon}"><span role="img" class="beast-icon"
                                style="font-size: 16px; opacity: 1;"><svg t="1733242526900" class="icon" viewBox="0 0 1229 1024"
                                    version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12245" width="1em" height="1em"
                                    fill="currentColor" aria-hidden="true" focusable="false">
                                    <path
                                        d="M1169.398294 931.791469h-1087.090048V42.124739a38.824645 38.824645 0 0 0-38.824644-41.154123C19.412322 0.970616 6.988436 19.412322 6.988436 42.124739v918.59109a41.736493 41.736493 0 0 0 29.700853 39.989384 41.54237 41.54237 0 0 0 22.518294 6.794313h1110.190711a36.883412 36.883412 0 0 0 40.96-36.883412 38.824645 38.824645 0 0 0-40.96-38.824645z"
                                        fill="currentColor" p-id="12246"></path>
                                    <path
                                        d="M151.610237 747.374408h107.544265a31.253839 31.253839 0 0 0 27.953744-16.888721l66.584266-93.95564 103.855924 212.176683a31.642085 31.642085 0 0 0 28.536114 17.665213h2.329478a31.836209 31.836209 0 0 0 29.894977-21.547678l164.810616-483.172701 97.061611 295.649668a31.642085 31.642085 0 0 0 25.236019 21.353555 34.748057 34.748057 0 0 0 11.841517 2.329478h167.528341a80.949384 80.949384 0 0 0 67.360758 32.030332c41.930616 0 76.096303-26.983128 76.096304-60.178199s-34.165687-59.984076-76.096304-59.984076a84.055355 84.055355 0 0 0-61.537061 24.847773H834.729858l-119.968152-362.428057a31.642085 31.642085 0 0 0-60.954692-2.911848l-171.604929 502.585023L388.246445 563.927962c-0.970616-1.747109-1.941232-3.494218-3.105971-5.241327a35.52455 35.52455 0 0 0-8.735545-9.123791 31.642085 31.642085 0 0 0-44.065972 7.376682l-89.684929 127.150711H151.610237a31.642085 31.642085 0 1 0 0 63.284171z"
                                        fill="currentColor" p-id="12247"></path>
                                    <path
                                        d="M883.260664 307.685308c-46.007204 0-95.314502-23.48891-97.061612-89.296682v-6.01782h64.060664v5.629573a32.612701 32.612701 0 0 0 65.031279-2.135355 30.477346 30.477346 0 0 0-33.971564-33.195071h-13.394502V126.180095h13.394502A26.983128 26.983128 0 0 0 912.379147 97.061611a29.118483 29.118483 0 1 0-58.236967-1.552985v5.43545h-64.060663v-6.60019A86.967204 86.967204 0 0 1 882.872417 7.959052a86.578957 86.578957 0 0 1 92.014408 86.967204 66.972512 66.972512 0 0 1-27.177252 58.236967 74.543318 74.543318 0 0 1 31.253839 64.44891c0 54.160379-37.659905 90.073175-95.702748 90.073175zM1100.290427 307.685308a87.161327 87.161327 0 0 1-92.014408-90.267299V98.032227a92.014408 92.014408 0 0 1 183.834692 0v119.385782a86.967204 86.967204 0 0 1-91.820284 90.267299z m0-241.489289a28.92436 28.92436 0 0 0-28.730237 32.612701v118.221043a28.536114 28.536114 0 0 0 28.730237 32.418578c17.665213 0 28.536114-12.423886 28.536113-32.418578V98.80872c0-20.188815-10.8709-32.612701-28.536113-32.612701z"
                                        fill="currentColor" p-id="12248"></path>
                                </svg></span></div>
                        <div class="${cfg.menuIconHint}"></div>
                    </a></div>
            </div>
          `;
        isCollapsedToExpanded = true;
        return newItem;
    };

    const fillQualityAfterSalesRate = () => {
        let hasFetched = false;

        const observer = new MutationObserver(() => {
            const target = document.querySelector("div:nth-child(2) > a > span");
            if (target) {
                if (target.innerText === "去查看" && !hasFetched) {
                    hasFetched = true;
                    fetchData().then((res) => {
                        if (res.qualityAfterSaleRatio90d !== "N/A") {
                            target.innerText = `${(res.qualityAfterSaleRatio90d * 100).toFixed(2)}% 去查看`;
                            hasFetched = false;
                        }
                    });
                }
            } else {
                hasFetched = false;
            }
        });

        observer.observe(document.body, {
            childList: true, subtree: true,
        });
    };

    const manageElement = (container, elementClass, othersClass, createElementFn) => {
        if (!container) return;
        let existingElement = container.querySelector(`.${elementClass}`);
        let othersElement = container.querySelector(`.${othersClass}`);
        if (othersElement) {
            othersElement.remove();
        }

        if (!existingElement) {
            existingElement = createElementFn(isCollapsedToExpanded);
            container.appendChild(existingElement);
            
            // 对于展开元素，确保在插入 DOM 后再开始获取数据
            if (elementClass === "sales-30days") {
                // 使用 requestAnimationFrame 确保元素已经渲染
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        const loadingSpan = document.getElementById("loading-span");
                        
                        // 检查预加载的数据是否已经准备好
                        preloadPromise.then((res) => {
                            if (res && loadingSpan) {
                                // 数据已经准备好了，直接显示
                                loadingSpan.innerText = `${res.thirtyDaysSaleVolume}`;
                                initValue = res.thirtyDaysSaleVolume;
                                console.log('[30d Sales] Data displayed from preload:', res);
                            }
                        }).catch((error) => {
                            console.error('[30d Sales] Preload error:', error);
                            // 如果预加载失败，尝试重新获取
                            fetchData().then((res) => {
                                if (res && loadingSpan) {
                                    loadingSpan.innerText = `${res.thirtyDaysSaleVolume}`;
                                    initValue = res.thirtyDaysSaleVolume;
                                }
                            });
                        });
                    });
                });
            }
        } else if (container.lastChild !== existingElement) {
            container.appendChild(existingElement);
        }
    };

    const observeSidebar = () => {
        const expandedSelector = ".bg-shell-theme-mmsMenuBox";
        const collapsedSelector = ".bg-shell-theme-fold-mmsMenuBox";

        const expandedContainer = document.querySelector(expandedSelector);
        const collapsedContainer = document.querySelector(collapsedSelector);

        // 确保配置有效（动态类名已获取）才创建元素
        const cfg = getConfig();
        if (!cfg.menuContainer) {
            // 配置未准备好，等待下次 DOM 变化时重试
            return;
        }

        manageElement(expandedContainer, "sales-30days", "fold-sales-30days", createExpandedElement);
        manageElement(collapsedContainer, "fold-sales-30days", "sales-30days", createCollapsedElement);
    };

    const targetNode = document.body;
    const observer = new MutationObserver(() => {
        observeSidebar();
    });

    observer.observe(targetNode, {
        childList: true, subtree: true,
    });
    fillQualityAfterSalesRate();
})();
