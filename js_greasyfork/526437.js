// ==UserScript==
// @name         vitePress页面打印
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  一键调用打印功能，适用于所有页面，打印前隐藏特定元素(VPSidebar, VPLocalNav has-sidebar, .container > aside, VPDocFooter)并修改VPContent的padding，找不到元素时继续执行并将错误打印到控制台，增加打印预览功能
// @author       lengsukq
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/526437/vitePress%E9%A1%B5%E9%9D%A2%E6%89%93%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/526437/vitePress%E9%A1%B5%E9%9D%A2%E6%89%93%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isPreview = GM_getValue('isPreview', false); //  初始状态从GM_getValue中读取，默认为false

    function togglePrintPreview() {
        isPreview = !isPreview; // 切换预览状态
        GM_setValue('isPreview', isPreview); // 保存预览状态

        // 获取元素
        const sidebar = document.querySelector('.VPSidebar');
        const nav = document.querySelector('.VPNav');
        const containerAside = document.querySelector('.container > aside'); //  精确选择 .container 下面的 .aside
        const prevNext = document.querySelector('.prev-next');
        const vpContent = document.getElementById('VPContent');
        const vpLocalNav = document.querySelector('.VPLocalNav.has-sidebar');
        const vpDocFooter = document.querySelector('.VPDocFooter'); // 获取 VPDocFooter 元素

        // 保存原始样式
        const originalStyle = {
            sidebar: sidebar ? sidebar.style.display : null,
            nav: nav ? nav.style.display : null,
            containerAside: containerAside ? containerAside.style.display : null,
            prevNext: prevNext ? prevNext.style.display : null,
            vpContentPadding: vpContent ? vpContent.style.padding : null,
            vpLocalNavDisplay: vpLocalNav ? vpLocalNav.style.display : null,
            vpDocFooter: vpDocFooter ? vpDocFooter.style.display : null // 保存 VPDocFooter 的原始 display 样式
        };

        // 根据预览状态，显示或隐藏元素，并修改VPContent的padding
        if (isPreview) {
            // 隐藏元素
            try {
                sidebar && (sidebar.style.display = 'none');
            } catch (error) {
                console.error('vitePress 打印脚本：隐藏 sidebar 元素时出错', error);
            }

            try {
                nav && (nav.style.display = 'none');
            } catch (error) {
                console.error('vitePress 打印脚本：隐藏 nav 元素时出错', error);
            }

            try {
                containerAside && (containerAside.style.display = 'none'); // 隐藏 .container > aside
            } catch (error) {
                console.error('vitePress 打印脚本：隐藏 .container > aside 元素时出错', error);
            }

            try {
                prevNext && (prevNext.style.display = 'none');
            } catch (error) {
                console.error('vitePress 打印脚本：隐藏 prevNext 元素时出错', error);
            }

            try {
                vpLocalNav && (vpLocalNav.style.display = 'none');
            } catch (error) {
                console.error('vitePress 打印脚本：隐藏 VPLocalNav 元素时出错', error);
            }

            try {
                vpDocFooter && (vpDocFooter.style.display = 'none'); // 隐藏 VPDocFooter 元素
            } catch (error) {
                console.error('vitePress 打印脚本：隐藏 VPDocFooter 元素时出错', error);
            }

            // 修改 VPContent 的 padding
            try {
                vpContent && (vpContent.style.padding = '0');
            } catch (error) {
                console.error('vitePress 打印脚本：修改 VPContent 的 padding 时出错', error);
            }
        } else {
            // 恢复显示和 padding
            try {
                sidebar && (sidebar.style.display = originalStyle.sidebar || '');
            } catch (error) {
                console.error('vitePress 打印脚本：恢复 sidebar 元素显示时出错', error);
            }

            try {
                nav && (nav.style.display = originalStyle.nav || '');
            } catch (error) {
                console.error('vitePress 打印脚本：恢复 nav 元素显示时出错', error);
            }

            try {
                containerAside && (containerAside.style.display = originalStyle.containerAside || ''); // 恢复 .container > aside
            } catch (error) {
                console.error('vitePress 打印脚本：恢复 .container > aside 元素显示时出错', error);
            }

            try {
                prevNext && (prevNext.style.display = originalStyle.prevNext || '');
            } catch (error) {
                console.error('vitePress 打印脚本：恢复 prevNext 元素显示时出错', error);
            }

            try {
                vpLocalNav && (vpLocalNav.style.display = originalStyle.vpLocalNavDisplay || '');
            } catch (error) {
                console.error('vitePress 打印脚本：恢复 VPLocalNav 元素显示时出错', error);
            }

            try {
                vpDocFooter && (vpDocFooter.style.display = originalStyle.vpDocFooter || ''); // 恢复 VPDocFooter 元素的显示
            } catch (error) {
                console.error('vitePress 打印脚本：恢复 VPDocFooter 元素显示时出错', error);
            }

            try {
                vpContent && (vpContent.style.padding = originalStyle.vpContentPadding || '');
            } catch (error) {
                console.error('vitePress 打印脚本：恢复 VPContent 的 padding 时出错', error);
            }
        }
    }

    function printPage() {
        // 获取元素
        const sidebar = document.querySelector('.VPSidebar');
        const nav = document.querySelector('.VPNav');
        const containerAside = document.querySelector('.container > aside'); //  精确选择 .container 下面的 .aside
        const prevNext = document.querySelector('.prev-next');
        const vpContent = document.getElementById('VPContent');
        const vpLocalNav = document.querySelector('.VPLocalNav.has-sidebar');
        const vpDocFooter = document.querySelector('.VPDocFooter'); // 获取 VPDocFooter 元素

        // 保存原始样式
        const originalStyle = {
            sidebar: sidebar ? sidebar.style.display : null,
            nav: nav ? nav.style.display : null,
            containerAside: containerAside ? containerAside.style.display : null,
            prevNext: prevNext ? prevNext.style.display : null,
            vpContentPadding: vpContent ? vpContent.style.padding : null,
            vpLocalNavDisplay: vpLocalNav ? vpLocalNav.style.display : null,
            vpDocFooter: vpDocFooter ? vpDocFooter.style.display : null // 保存 VPDocFooter 的原始 display 样式
        };

        // 隐藏元素
        try {
            sidebar && (sidebar.style.display = 'none');
        } catch (error) {
            console.error('vitePress 打印脚本：隐藏 sidebar 元素时出错', error);
        }

        try {
            nav && (nav.style.display = 'none');
        } catch (error) {
            console.error('vitePress 打印脚本：隐藏 nav 元素时出错', error);
        }

        try {
            containerAside && (containerAside.style.display = 'none'); // 隐藏 .container > aside
        } catch (error) {
            console.error('vitePress 打印脚本：隐藏 .container > aside 元素时出错', error);
        }

        try {
            prevNext && (prevNext.style.display = 'none');
        } catch (error) {
            console.error('vitePress 打印脚本：隐藏 prevNext 元素时出错', error);
        }

        try {
            vpLocalNav && (vpLocalNav.style.display = 'none');
        } catch (error) {
            console.error('vitePress 打印脚本：隐藏 VPLocalNav 元素时出错', error);
        }

        try {
            vpDocFooter && (vpDocFooter.style.display = 'none'); // 隐藏 VPDocFooter 元素
        } catch (error) {
            console.error('vitePress 打印脚本：隐藏 VPDocFooter 元素时出错', error);
        }

        // 修改 VPContent 的 padding
        try {
            vpContent && (vpContent.style.padding = '0');
        } catch (error) {
            console.error('vitePress 打印脚本：修改 VPContent 的 padding 时出错', error);
        }

        // 打印
        window.print();

        // 恢复显示和 padding
        try {
            sidebar && (sidebar.style.display = originalStyle.sidebar || '');
        } catch (error) {
            console.error('vitePress 打印脚本：恢复 sidebar 元素显示时出错', error);
        }

        try {
            nav && (nav.style.display = originalStyle.nav || '');
        } catch (error) {
            console.error('vitePress 打印脚本：恢复 nav 元素显示时出错', error);
        }

        try {
            containerAside && (containerAside.style.display = originalStyle.containerAside || ''); // 恢复 .container > aside
        } catch (error) {
            console.error('vitePress 打印脚本：恢复 .container > aside 元素显示时出错', error);
        }

        try {
            prevNext && (prevNext.style.display = originalStyle.prevNext || '');
        } catch (error) {
            console.error('vitePress 打印脚本：恢复 prevNext 元素显示时出错', error);
        }

        try {
            vpLocalNav && (vpLocalNav.style.display = originalStyle.vpLocalNavDisplay || '');
        } catch (error) {
            console.error('vitePress 打印脚本：恢复 VPLocalNav 元素显示时出错', error);
        }

        try {
            vpDocFooter && (vpDocFooter.style.display = originalStyle.vpDocFooter || ''); // 恢复 VPDocFooter 元素的显示
        } catch (error) {
            console.error('vitePress 打印脚本：恢复 VPDocFooter 元素显示时出错', error);
        }

        try {
            vpContent && (vpContent.style.padding = originalStyle.vpContentPadding || '');
        } catch (error) {
            console.error('vitePress 打印脚本：恢复 VPContent 的 padding 时出错', error);
        }
    }

    GM_registerMenuCommand("切换打印预览", togglePrintPreview);
    GM_registerMenuCommand("打印页面", printPage);
})();
