// ==UserScript==
// @name         BetterLeetcode
// @namespace    Ninkror
// @version      1.0
// @author       Ninkror

// @description  力扣 - 页面清理 | 隐藏会员题目 | 隐藏已完成题目 | 窗口宽度限制 | 去除复制的版权信息 | 中二标题

// @match        https://leetcode.cn/*

// @icon         https://leetcode.cn/favicon.ico

// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand

// @license      GPL

// @require      https://greasyfork.org/scripts/463455-nelementgetter/code/NElementGetter.js?version=1172110
// @downloadURL https://update.greasyfork.org/scripts/484040/BetterLeetcode.user.js
// @updateURL https://update.greasyfork.org/scripts/484040/BetterLeetcode.meta.js
// ==/UserScript==

function problemSetClear() {
    const blockList_problemset = [
        "#leetcode-navbar > div.display-none.m-auto.h-\\[50px\\].w-full.items-center.justify-center.px-6.md\\:flex.max-w-\\[1200px\\] > ul > li:nth-child(6)", //顶栏 左侧 商店
        "#leetcode-navbar > div.display-none.m-auto.h-\\[50px\\].w-full.items-center.justify-center.px-6.md\\:flex.max-w-\\[1200px\\] > div > div > a", //顶栏 右侧 Plus会员

        "#__next > div.flex.min-h-screen.min-w-\\[360px\\].flex-col.text-label-1.dark\\:text-dark-label-1 > div.mx-auto.w-full.grow.p-4.md\\:mt-0.md\\:max-w-\\[888px\\].md\\:p-6.lg\\:max-w-screen-xl.mt-\\[50px\\].dark\\:bg-dark-layer-bg.bg-white > div.grid.grid-cols-4.gap-4.md\\:grid-cols-3.lg\\:grid-cols-4.lg\\:gap-6 > div.z-base.col-span-4.md\\:col-span-2.lg\\:col-span-3 > div.-mr-2.md\\:mr-0", //主栏 推荐
        "#__next > div.flex.min-h-screen.min-w-\\[360px\\].flex-col.text-label-1.dark\\:text-dark-label-1 > div.mx-auto.w-full.grow.p-4.md\\:mt-0.md\\:max-w-\\[888px\\].md\\:p-6.lg\\:max-w-screen-xl.mt-\\[50px\\].dark\\:bg-dark-layer-bg.bg-white > div.grid.grid-cols-4.gap-4.md\\:grid-cols-3.lg\\:grid-cols-4.lg\\:gap-6 > div.z-base.col-span-4.md\\:col-span-2.lg\\:col-span-3 > div:nth-child(2)", //主栏 学习计划

        "#__next > div.flex.min-h-screen.min-w-\\[360px\\].flex-col.text-label-1.dark\\:text-dark-label-1 > div.mx-auto.w-full.grow.p-4.md\\:mt-0.md\\:max-w-\\[888px\\].md\\:p-6.lg\\:max-w-screen-xl.mt-\\[50px\\].dark\\:bg-dark-layer-bg.bg-white > div.grid.grid-cols-4.gap-4.md\\:grid-cols-3.lg\\:grid-cols-4.lg\\:gap-6 > div.z-base.col-span-4.md\\:col-span-2.lg\\:col-span-3 > div:nth-child(4) > div.-mx-4.transition-opacity.md\\:mx-0 > div > div > div.border-divider-border-2.dark\\:border-dark-divider-border-2.border-b > div > div:nth-child(6)", //主栏 题目列表 表头 出现频率
        "#__next > div.flex.min-h-screen.min-w-\\[360px\\].flex-col.text-label-1.dark\\:text-dark-label-1 > div.mx-auto.w-full.grow.p-4.md\\:mt-0.md\\:max-w-\\[888px\\].md\\:p-6.lg\\:max-w-screen-xl.mt-\\[50px\\].dark\\:bg-dark-layer-bg.bg-white > div.grid.grid-cols-4.gap-4.md\\:grid-cols-3.lg\\:grid-cols-4.lg\\:gap-6 > div.z-base.col-span-4.md\\:col-span-2.lg\\:col-span-3 > div:nth-child(4) > div.-mx-4.transition-opacity.md\\:mx-0 > div > div > div:nth-child(2) > div:nth-child(n) > div:nth-child(6)", //主栏 题目列表 表项 出现频率

        "#__next > div.flex.min-h-screen.min-w-\\[360px\\].flex-col.text-label-1.dark\\:text-dark-label-1 > div.mx-auto.w-full.grow.p-4.md\\:mt-0.md\\:max-w-\\[888px\\].md\\:p-6.lg\\:max-w-screen-xl.mt-\\[50px\\].dark\\:bg-dark-layer-bg.bg-white > div.grid.grid-cols-4.gap-4.md\\:grid-cols-3.lg\\:grid-cols-4.lg\\:gap-6 > div.col-span-4.md\\:col-span-1 > div:nth-child(1) > div > div.mb-2.mt-1.min-h-\\[77px\\].px-4", //右侧栏 日历 Plus会员挑战
        "#__next > div.flex.min-h-screen.min-w-\\[360px\\].flex-col.text-label-1.dark\\:text-dark-label-1 > div.mx-auto.w-full.grow.p-4.md\\:mt-0.md\\:max-w-\\[888px\\].md\\:p-6.lg\\:max-w-screen-xl.mt-\\[50px\\].dark\\:bg-dark-layer-bg.bg-white > div.grid.grid-cols-4.gap-4.md\\:grid-cols-3.lg\\:grid-cols-4.lg\\:gap-6 > div.col-span-4.md\\:col-span-1 > div:nth-child(1) > div > div.flex.h-9.items-center.px-4.text-xs.text-label-2.dark\\:text-dark-label-2", //右侧栏 补卡券
        "#__next > div.flex.min-h-screen.min-w-\\[360px\\].flex-col.text-label-1.dark\\:text-dark-label-1 > div.mx-auto.w-full.grow.p-4.md\\:mt-0.md\\:max-w-\\[888px\\].md\\:p-6.lg\\:max-w-screen-xl.mt-\\[50px\\].dark\\:bg-dark-layer-bg.bg-white > div.grid.grid-cols-4.gap-4.md\\:grid-cols-3.lg\\:grid-cols-4.lg\\:gap-6 > div.col-span-4.md\\:col-span-1 > div.mt-4.pt-0\\.5.md\\:top-3", //右侧栏 热门企业题库

        "#__next > div.flex.min-h-screen.min-w-\\[360px\\].flex-col.text-label-1.dark\\:text-dark-label-1 > div.mx-auto.w-full.grow.p-4.md\\:mt-0.md\\:max-w-\\[888px\\].md\\:p-6.lg\\:max-w-screen-xl.mt-\\[50px\\].dark\\:bg-dark-layer-bg.bg-white > div.z-overlay.fixed.bottom-4.right-4.md\\:bottom-\\[31px\\].md\\:right-\\[30px\\]", //右下角浮窗 反馈

        "#__next > div.flex.min-h-screen.min-w-\\[360px\\].flex-col.text-label-1.dark\\:text-dark-label-1 > footer", //底部
    ];
    GM_addStyle(blockList_problemset.join(', ') + '{display: none !important}');
}
function vipProblemHide() {
    GM_addStyle(`
        div[role="row"]:has(.text-brand-orange) {
            display: none !important;
        }
    `);
}
function doneProblemHide() {
    GM_addStyle(`
        div[role="row"]:has(.text-lc-green-60){
            display: none !important;
        }
    `);
}
function problemClear() {
    const globalBlockList = [
        "#__next > div.flex.min-w-\\[360px\\].flex-col.overflow-x-auto.text-label-1.dark\\:text-dark-label-1.h-\\[100vh\\] > div > div > div.relative > nav > div > div > div.relative.ml-4.flex.items-center.gap-2 > a", //顶栏右侧 Plus会员
    ]
    const descriptionBlockList = [
        "div.flexlayout__tab[data-layout-path] > div > div.flex.w-full.flex-1.flex-col.gap-4.overflow-y-auto.px-4.py-5 > div.flex.gap-1 > div.relative.inline-flex.items-center.justify-center.text-caption.px-2.py-1.gap-1.rounded-full.bg-fill-secondary.cursor-pointer.transition-colors.hover\\:bg-fill-primary.hover\\:text-text-primary.text-sd-secondary-foreground.hover\\:opacity-80", //标题下Tag 相关标签、相关企业、提示

        "div.flexlayout__tab[data-layout-path] > div > div.flex.w-full.flex-1.flex-col.gap-4.overflow-y-auto.px-4.py-5 > div.mt-6.flex.flex-col.gap-3 > div:nth-child(2)", //请问您在哪类招聘中遇到此题？
        "div.flexlayout__tab[data-layout-path] > div > div.flex.w-full.flex-1.flex-col.gap-4.overflow-y-auto.px-4.py-5 > div.mt-6.flex.flex-col.gap-3 > div:nth-child(5)", //相关标签
        "div.flexlayout__tab[data-layout-path] > div > div.flex.w-full.flex-1.flex-col.gap-4.overflow-y-auto.px-4.py-5 > div.mt-6.flex.flex-col.gap-3 > hr:nth-child(6)", //相关标签后分隔线
        "div.flexlayout__tab[data-layout-path] > div > div.flex.w-full.flex-1.flex-col.gap-4.overflow-y-auto.px-4.py-5 > div.mt-6.flex.flex-col.gap-3 > div:nth-child(7)", //相关企业
        "div.flexlayout__tab[data-layout-path] > div > div.flex.w-full.flex-1.flex-col.gap-4.overflow-y-auto.px-4.py-5 > div.mt-6.flex.flex-col.gap-3 > hr:nth-child(8)", //相关企业后分隔线

        "div.flexlayout__tab[data-layout-path] > div > div.flex.w-full.flex-1.flex-col.gap-4.overflow-y-auto.px-4.py-5 > div.mt-6.flex.flex-col.gap-3 > div:nth-child(19) > div > div.overflow-hidden.transition-all > div > div > div.mt-4.flex-1 > div > div:nth-child(n) > div > div.mt-2.flex.w-full.flex-col.text-label-2.dark\\:text-dark-label-2 > div.mt-4.flex.items-center.gap-4 > div > div.flex.items-center.gap-4.text-xs.opacity-100", //主评论 分享和更多
        "div.flexlayout__tab[data-layout-path] > div > div.flex.w-full.flex-1.flex-col.gap-4.overflow-y-auto.px-4.py-5 > div.mt-6.flex.flex-col.gap-3 > div:nth-child(19) > div > div.overflow-hidden.transition-all > div > div > div.mt-4.flex-1 > div > div:nth-child(n) > div:nth-child(2) > div.flex.flex-col:nth-child(n) > div > div > div.mt-4.flex.items-center.gap-4.text-xs.text-label-2.dark\\:text-dark-label-2 > div > div.flex.items-center.gap-4.text-xs.opacity-100", //楼中楼 分享和更多

        "div.flexlayout__tab[data-layout-path] > div > div.flex.w-full.flex-1.flex-col.gap-4.overflow-y-auto.px-4.py-5 > div.mt-6.flex.flex-col.gap-3 > div.flex.items-center.justify-between", //贡献者
        "div.flexlayout__tab[data-layout-path] > div > div.flex.w-full.flex-1.flex-col.gap-4.overflow-y-auto.px-4.py-5 > div.mt-8", //© 2024 领扣网络（上海）有限公司

        "div.flexlayout__tab[data-layout-path] > div > div.flex-none > div > div.flex.gap-2 > div:nth-child(2)", //底栏 分享
        "div.flexlayout__tab[data-layout-path] > div > div.flex-none > div > div.flex.gap-2 > button", //底栏 反馈
    ]
    const solutionsBlockList = [
        "div.flexlayout__tab[data-layout-path] > div.h-full.w-full.\\!min-w-\\[440px\\] > div > div > div > div.relative.flex.w-full.flex-1.flex-col.overflow-y-auto > div > div:nth-child(2) > div > div.mt-4.flex-1 > div > div:nth-child(n) > div.flex.w-full.flex-col.py-3 > div.mt-2.flex.w-full.flex-col.text-label-2.dark\\:text-dark-label-2 > div.mt-4.flex.items-center.gap-4 > div > div.flex.items-center.gap-4.text-xs.opacity-100", //主评论 分享和更多
        "div.flexlayout__tab[data-layout-path] > div.h-full.w-full.\\!min-w-\\[440px\\] > div > div > div > div.relative.flex.w-full.flex-1.flex-col.overflow-y-auto > div > div:nth-child(2) > div > div.mt-4.flex-1 > div > div:nth-child(n) > div:nth-child(2) > div:nth-child(n) > div > div > div.mt-4.flex.items-center.gap-4.text-xs.text-label-2.dark\\:text-dark-label-2 > div > div.flex.items-center.gap-4.text-xs.opacity-100", //楼中楼 分享和更多
    ]
    const codeBlockList = [
        "div.flexlayout__tab[data-layout-path] > #editor > div.flex.h-8.items-center.justify-between.border-b.p-1.border-border-quaternary.dark\\:border-border-quaternary > div.flex.flex-nowrap.items-center > div.group.rounded.px-2.py-0.hover\\:bg-fill-secondary.dark\\:hover\\:bg-fill-secondary", //顶栏 左侧 智能模式
        "div.flexlayout__tab[data-layout-path] > #editor > div.flex.justify-between.py-1.pl-3.pr-1 > div.flex.items-center > div.text-caption.flex.items-center.gap-2.text-text-tertiary.dark\\:text-text-tertiary > div", //底栏 左侧 升级云端代码存储
        "div.flexlayout__tab[data-layout-path] > #editor > div.flex.justify-between.py-1.pl-3.pr-1 > div.relative.flex.overflow-hidden.rounded.bg-fill-tertiary.dark\\:bg-fill-tertiary.\\!bg-transparent > div.flex-none.flex > div.group.flex.flex-none.items-center.justify-center", //底栏 右侧 Debug按钮
    ]
    const articleBlockList = [
        "div.flexlayout__tab[data-layout-path] > div.h-full.w-full.\\!min-w-\\[440px\\] > div > div > div > div.relative.flex.w-full.flex-1.flex-col.overflow-y-auto > div > div:nth-child(2) > div > div.mt-4.flex-1 > div > div:nth-child(n) > div.flex.w-full.flex-col.py-3 > div.mt-2.flex.w-full.flex-col.text-label-2.dark\\:text-dark-label-2 > div.mt-4.flex.items-center.gap-4 > div > div.flex.items-center.gap-4.text-xs.opacity-100", //主评论 分享和更多
        "div.flexlayout__tab[data-layout-path] > div.h-full.w-full.\\!min-w-\\[440px\\] > div > div > div > div.relative.flex.w-full.flex-1.flex-col.overflow-y-auto > div > div:nth-child(2) > div > div.mt-4.flex-1 > div > div:nth-child(n) > div:nth-child(2) > div:nth-child(n) > div > div > div.mt-4.flex.items-center.gap-4.text-xs.text-label-2.dark\\:text-dark-label-2 > div > div.flex.items-center.gap-4.text-xs.opacity-100", //楼中楼 分享和更多
    ]

    GM_addStyle(globalBlockList.join(', ') + '{display: none !important}');
    GM_addStyle(descriptionBlockList.join(', ') + '{display: none !important}');
    GM_addStyle(solutionsBlockList.join(', ') + '{display:none!important}')
    GM_addStyle(codeBlockList.join(', ') + '{display:none!important}')
    GM_addStyle(articleBlockList.join(', ') + '{display:none!important}')
}
function widthLimit() {
    GM_addStyle(`
        * {
            max-width: 100vw !important;
        }
    `)
}
function copyNoRight() {
    GM_addStyle(
        '.FN9Jv.WRmCx div.h-4.w-4.cursor-pointer.fill-gray-6.hover\\:fill-gray-7.dark\\:fill-dark-gray-6.dark\\:hover\\:fill-dark-gray-7.absolute.right-0.top-0 {display: none !important}'
    );
    new ElementGetter().each('.FN9Jv.WRmCx > div:has(code)', document, (item) => {
        var copyButton = document.createElement('div');
        copyButton.className = 'px-3 py-3 text-label-4 dark:text-dark-label-4 hover:text-label-1 dark:hover:text-dark-label-1';
        copyButton.style = 'margin-left: auto;';
        copyButton.textContent = '复制';
        copyButton.onclick = function () {
            var nowShow = item.querySelector('div:not(.hidden) > div.group.relative > pre > code');
            nowShow.parentElement.nextElementSibling.click();
            var assistEle = document.createElement('textarea');
            assistEle.value = nowShow.textContent;
            document.body.appendChild(assistEle);
            assistEle.select();
            document.execCommand('copy');
            document.body.removeChild(assistEle);
        };
        item.firstChild.appendChild(copyButton);
    });
    document.addEventListener('copy', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        e.clipboardData.setData('Text', window.getSelection().toString());
    });
}
function handsomeTitle() {
    var exchangeList = {
        "题目描述": {
            "icon": '🏹',
            "text": '大军来袭'
        },
        "题解": {
            "icon": '📚',
            "text": '先贤之力'
        },
        "提交记录": {
            "icon": '🎖',
            "text": '战争勋章'
        },
        "代码": {
            "icon": '🗡',
            "text": '前线战场'
        },
        "题解文章": {
            "icon": '',
            "text": ''
        },
        "测试用例": {
            "icon": '🎯',
            "text": '后方靶场'
        },
        "测试结果": {
            "icon": '🔪',
            "text": '刀光剑影'
        },
    }
    new ElementGetter().each('div.flexlayout__tab_button[data-layout-path]', document, (item) => {
        var baseDiv = item.querySelector('div.flexlayout__tab_button_content > div.relative.flex.items-center.gap-1.overflow-hidden.text-sm.capitalize')
        var iconDiv = baseDiv.children[0]
        var textBaseDiv = baseDiv.children[1]
        var textFirstDiv = textBaseDiv.children[0]
        var textSecondDiv = textBaseDiv.children[1]

        const title = textFirstDiv.textContent
        const exchangeIcon = exchangeList[title] ? exchangeList[title]['icon'] : exchangeList['题解文章']['icon']
        const exchangeText = exchangeList[title] ? exchangeList[title]['text'] : exchangeList['题解文章']['text']

        if(exchangeIcon != '') {
            iconDiv.style = "padding-bottom: 14px"
            iconDiv.innerHTML = exchangeIcon
        }
        if(exchangeText != '') {
            textFirstDiv.textContent = textSecondDiv.textContent = exchangeText
        }
    })
}
function contestClear() {
    const blockElement = [
        "#leetcode-navbar > div.display-none.m-auto.h-\\[50px\\].w-full.items-center.justify-center.px-6.md\\:flex.max-w-\\[1200px\\] > ul > li:nth-child(6)", //顶栏 左侧 商店
        "#leetcode-navbar > div.display-none.m-auto.h-\\[50px\\].w-full.items-center.justify-center.px-6.md\\:flex.max-w-\\[1200px\\] > div > div > button", //顶栏 右侧 Plus会员

        "#lc-footer", //底部
    ]
    GM_addStyle(blockElement.join(', ') + '{display:none!important}')
}

const pathName = window.location.pathname;
const problemSet = pathName.startsWith('/problemset/');
const problems = pathName.startsWith('/problems/');
const contest = pathName.startsWith('/contest/');

const funcList = [
    {
        name: 'problemSetClear',
        menu: '题目集页面清理',
        match: problemSet,
        func: problemSetClear,
    },
    {
        name: 'vipProblemHide',
        menu: '隐藏VIP题目',
        match: problemSet,
        func: vipProblemHide,
    },
    {
        name: 'doneProblemHide',
        menu: '隐藏已完成题目',
        match: problemSet,
        func: doneProblemHide,
    },
    {
        name: 'problemClear',
        menu: '题目页面清理',
        match: problems,
        func: problemClear,
    },
    {
        name: 'widthLimit',
        menu: '窗口宽度限制',
        match: problems,
        func: widthLimit,
    },
    {
        name: 'copyNoRight',
        menu: '没有版权信息的复制',
        match: problems,
        func: copyNoRight,
    },
    {
        name: 'handsomeTitle',
        menu: '中二标题',
        match: problems,
        func: handsomeTitle,
    },
    {
        name: 'contestClear',
        menu: '竞赛主页面清理',
        match: contest,
        func: contestClear,
    },
];

funcList.forEach((item) => {
    if (item.match) {
        const name = item.name;
        const menu = item.menu;
        if (GM_getValue(name) == undefined) {
            GM_setValue(name, true);
        }
        const open = GM_getValue(name);
        GM_registerMenuCommand(`${open ? '✅' : '❌'}${menu}`, function () {
            GM_setValue(name, !open);
            window.location.reload();
        });
        if (open) {
            item.func();
            console.log(`${name} - ${menu} - 已开启`);
        }
    }
});