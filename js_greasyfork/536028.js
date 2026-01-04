// ==UserScript==
// @name         Nodejs.cn旗下中文网广告隐藏
// @description  包含TypeScript、Tailwind、npm、Electron、pnpm、React、ESLint、Nuxt、Koa、Lodash、Fastify等常用的中文网，旗下中文网广告规则一致
// @namespace
// @include      *://ts.nodejs.cn/*
// @include      *://mermaid.nodejs.cn/*
// @include      *://tailwind.nodejs.cn/*
// @include      *://vueuse.nodejs.cn/*
// @include      *://nest.nodejs.cn/*
// @include      *://moment.nodejs.cn/*
// @include      *://playwright.nodejs.cn/*
// @include      *://npm.nodejs.cn/*
// @include      *://electron.nodejs.cn/*
// @include      *://pnpm.nodejs.cn/*
// @include      *://next.nodejs.cn/*
// @include      *://unocss.nodejs.cn/*
// @include      *://chart.nodejs.cn/*
// @include      *://expo.nodejs.cn/*
// @include      *://react.nodejs.cn/*
// @include      *://pptr.nodejs.cn/*
// @include      *://eslint.nodejs.cn/*
// @include      *://xlsx.nodejs.cn/*
// @include      *://reactflow.nodejs.cn/*
// @include      *://bootstrap.nodejs.cn/*
// @include      *://ionic.nodejs.cn/*
// @include      *://marked.nodejs.cn/*
// @include      *://axios.nodejs.cn/*
// @include      *://yarn.nodejs.cn/*
// @include      *://nvm.nodejs.cn/*
// @include      *://nuxt.nodejs.cn/*
// @include      *://d3.nodejs.cn/*
// @include      *://vue-flow.nodejs.cn/*
// @include      *://quill.nodejs.cn/*
// @include      *://eslint-vue.nodejs.cn/*
// @include      *://strapi.nodejs.cn/*
// @include      *://express.nodejs.cn/*
// @include      *://less.nodejs.cn/*
// @include      *://rn.nodejs.cn/*
// @include      *://tauri.nodejs.cn/*
// @include      *://babel.nodejs.cn/*
// @include      *://day.nodejs.cn/*
// @include      *://prettier.nodejs.cn/*
// @include      *://prisma.nodejs.cn/*
// @include      *://cra.nodejs.cn/*
// @include      *://sass.nodejs.cn/*
// @include      *://socket.nodejs.cn/*
// @include      *://mongoose.nodejs.cn/*
// @include      *://pixi.nodejs.cn/*
// @include      *://husky.nodejs.cn/*
// @include      *://rx.nodejs.cn/*
// @include      *://lerna.nodejs.cn/*
// @include      *://react-navigation.nodejs.cn/*
// @include      *://stylelint.nodejs.cn/*
// @include      *://zod.nodejs.cn/*
// @include      *://koa.nodejs.cn/*
// @include      *://svelte.nodejs.cn/*
// @include      *://lodash.nodejs.cn/*
// @include      *://qrcode.nodejs.cn/*
// @include      *://sequelize.nodejs.cn/*
// @include      *://floating.nodejs.cn/*
// @include      *://astro.nodejs.cn/*
// @include      *://jest.nodejs.cn/*
// @include      *://swc.nodejs.cn/*
// @include      *://typeorm.nodejs.cn/*
// @include      *://fastify.nodejs.cn/*
// @include      *://mysql2.nodejs.cn/*
// @include      *://storybook.nodejs.cn/*
// @include      *://clipboard.nodejs.cn/*
// @include      *://sharp.nodejs.cn/*
// @include      *://postcss.nodejs.cn/*
// @include      *://graphql.nodejs.cn/*
// @include      *://cheerio.nodejs.cn/*
// @include      *://rollup.nodejs.cn/*
// @include      *://dotenv.nodejs.cn/*
// @include      *://typescript-eslint.nodejs.cn/*
// @include      *://terser.nodejs.cn/*
// @include      *://react-hook-form.nodejs.cn/*
// @include      *://vuetify.nodejs.cn/*
// @include      *://swr.nodejs.cn/*
// @include      *://animate-css.nodejs.cn/*
// @include      *://docusaurus.nodejs.cn/*
// @include      *://flow.nodejs.cn/*
// @include      *://lint-staged.nodejs.cn/*
// @include      *://knex.nodejs.cn/*
// @include      *://shadcn.nodejs.cn/*
// @include      *://trpc.nodejs.cn/*
// @include      *://faker.nodejs.cn/*
// @include      *://redux.nodejs.cn/*
// @include      *://jsdom.nodejs.cn/*
// @include      *://jsonwebtoken.nodejs.cn/*
// @include      *://ajv.nodejs.cn/*
// @include      *://styled-components.nodejs.cn/*
// @include      *://luxon.nodejs.cn/*
// @include      *://zustand.nodejs.cn/*
// @include      *://mdx.nodejs.cn/*
// @include      *://commander.nodejs.cn/*
// @include      *://assemblyscript.nodejs.cn/*
// @include      *://pino.nodejs.cn/*
// @include      *://hono.nodejs.cn/*
// @include      *://msw.nodejs.cn/*
// @include      *://winston.nodejs.cn/*
// @include      *://mocha.nodejs.cn/*
// @include      *://formik.nodejs.cn/*
// @include      *://mikro-orm.nodejs.cn/*
// @include      *://stylus.nodejs.cn/*
// @include      *://jsdoc.nodejs.cn/*
// @include      *://meteor.nodejs.cn/*
// @include      *://redis.nodejs.cn/*
// @include      *://inquirer.nodejs.cn/*
// @include      *://gulp.nodejs.cn/*
// @include      *://vue-test.nodejs.cn/*
// @include      *://mobx.nodejs.cn/*
// @include      *://biome.nodejs.cn/*
// @include      *://handlebars.nodejs.cn/*
// @include      *://htmx.nodejs.cn/*
// @include      *://hexo.nodejs.cn/*
// @include      *://zx.nodejs.cn/*
// @include      *://preact.nodejs.cn/*
// @include      *://pug.nodejs.cn/*
// @include      *://parcel.nodejs.cn/*
// @include      *://pg.nodejs.cn/*
// @include      *://chalk.nodejs.cn/*
// @include      *://cron.nodejs.cn/*
// @include      *://superagent.nodejs.cn/*
// @include      *://glob.nodejs.cn/*
// @include      *://async.nodejs.cn/*
// @include      *://xstate.nodejs.cn/*
// @include      *://react-redux.nodejs.cn/*
// @include      *://modernizr.nodejs.cn/*
// @version      0.2.2
// @author       ymzhao
// @namespace 
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/536028/Nodejscn%E6%97%97%E4%B8%8B%E4%B8%AD%E6%96%87%E7%BD%91%E5%B9%BF%E5%91%8A%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/536028/Nodejscn%E6%97%97%E4%B8%8B%E4%B8%AD%E6%96%87%E7%BD%91%E5%B9%BF%E5%91%8A%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==
GM_addStyle(`
    #bottomad, /* 底部广告 */
    .mymn-full, /* 底部广告 */
    .mymn-full-space /* 底部广告 */
    {
        display: none !important;
    }
    body:has(.fc-message-root) {
        overflow: initial !important;
    }
`);

/**
 * 需要手动清除的广告选择器列表（css优先级不够）
 * - .adsbygoogle: 全屏谷歌广告
 * - .fc-message-root: 不定时全屏弹出，强制点击观看广告
 */
const adSelectors = ['.adsbygoogle','.fc-message-root'];

/**
 * 清理广告函数
 * 遍历所有广告选择器，找到匹配的元素并隐藏它们
 */
function cleanAds() {
    adSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(ad => {
            ad.style.setProperty('display', 'none', 'important');
        });
    });
}

/**
 * 初始化MutationObserver来监听DOM变化
 */
function watchForNewAds() {
    // 创建一个观察器实例并传入回调函数
    const observer = new MutationObserver((mutations) => {
        // 检查是否有节点被添加
        const hasAddedNodes = mutations.some(mutation => 
            mutation.addedNodes && mutation.addedNodes.length > 0
        );
        
        if (hasAddedNodes) cleanAds();
    });

    // 配置观察选项
    const config = { 
        childList: true,  // 观察子节点的添加或删除
        subtree: true     // 观察所有后代节点
    };

    // 开始观察document.body
    observer.observe(document.body, config);
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    cleanAds();
    watchForNewAds();
});

// 确保在DOM完全加载前插入的内容也能被处理
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    cleanAds();
    watchForNewAds();
}

// ----------获取Nodejs.cn（https://nodejs.cn/）旗下中文网匹配信息------------
// Array.from(document.querySelectorAll('#partner_item_box>.cate_item>a'))
//     .map(e => {
//         const host = e.href?.match(/^https?:\/\/([^/]+)\/?/i)?.[1]
//         return host && `// @include      *://${host}/*`
//     })
//     .filter(Boolean)
//     .join('\n')