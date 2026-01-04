// ==UserScript==
// @name            [SNOLAB] Alt + 123... Searching Results Links List Batch Open
// @name:zh         [雪星实验室] Alt + 123... 一键批量打开谷歌必应搜索的前2的n次方项搜索结果
// @namespace       snomiao@gmail.com
// @version         1.0.3
// @description     To quickly understand a field, press Alt+1 ...2,3,4...Alt+5 on the search page of Google or Bing to open the search results of the first 2 nth power items and copy the opened ones link. Currently supports: Google, Bing, Zhihu.
// @description:zh  快速了解一个领域用，在谷歌或必应的搜索页面 按 Alt+1 ...2,3,4... Alt+5  将会打开前2的n次方项的搜索结果，并复制打开的链接。目前支持：谷歌、必应、知乎。
// @author          snomiao
// @match           *://google.com/*
// @match           *://bing.com/*
// @match           *://youtube.com/*
// @match           *://zhihu.com/*
// @match           *://and-all-searching-results.com/*
// @match           *://*/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/423896/%5BSNOLAB%5D%20Alt%20%2B%20123%20Searching%20Results%20Links%20List%20Batch%20Open.user.js
// @updateURL https://update.greasyfork.org/scripts/423896/%5BSNOLAB%5D%20Alt%20%2B%20123%20Searching%20Results%20Links%20List%20Batch%20Open.meta.js
// ==/UserScript==

const 最长共列阵输出 = (矩阵, a, b, x, y) =>
    !x || !y
        ? ''
        : a[x - 1] === b[y - 1]
        ? 最长共列阵输出(矩阵, a, b, x - 1, y - 1) + a[x - 1]
        : 矩阵[y][x - 1] > 矩阵[y - 1][x]
        ? 最长共列阵输出(矩阵, a, b, x - 1, y)
        : 最长共列阵输出(矩阵, a, b, x, y - 1);
const 最长共列 = (a, b) => {
    const w = a.length,
        h = b.length;
    const m = Array(1 + h)
        .fill(0)
        .map(() => Array(1 + w).fill(0));
    for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++)
            m[1 + y][1 + x] =
                a[x] === b[y]
                    ? m[y][x] + 1
                    : Math.max(m[y][1 + x], m[1 + y][x]);
    false && console.table(m);
    return 最长共列阵输出(m, a, b, w, h);
};
const 元素特征列取 = (e) =>
    [...e.querySelectorAll('*')].map((e) => e?.tagName + e?.className);
const 特征元素筛函数 = (e) =>
    !'style script span'.toUpperCase().split(' ').includes(e.tagName);
const 元素列表强度 = (e) =>
    e.textContent.length *
    (e.children.length - 1) *
    [...e.children]
        .filter(特征元素筛函数)
        .map(元素特征列取)
        .map((_, i, a) => 最长共列(a[i], a[i + 1] || []))
        .reduce((前, 后) => 前 + 后.length, 0);
const 列元素列提取 = () =>
    [...document.querySelectorAll('div,dl,ul,ol,tbody,table,td')]
        .filter((e) => e.children.length > 1)
        .map((元素) => ({
            元素,
            强度: 元素列表强度(元素),
            特征列: [...元素.children]
                .filter(特征元素筛函数)
                // .filter((e) => !["style", "script", "span"].includes(e.tagName))
                .map(元素特征列取),
        }))
        .sort((a, b) => -(a.强度 - b.强度));
const 标链元素提取 = (e) =>
    e?.querySelector('dd,dt,h1,h2,h3,h4,h5,h6')?.querySelector('a') ||
    [...e?.querySelectorAll('a')]?.filter((e) =>
        e.querySelector('dd,dt,h1,h2,h3,h4,h5,h6')
    )?.[0] ||
    e?.querySelector('a');
const 标链提取 = (元素) => ({
    元素,
    标题: 元素?.textContent?.replace(/\s+/g, ' ').trim(),
    链接: 元素?.href,
});
const 子列父亲节点筛函数 = (eFa, i, a) =>
    !a.some((eSon, j) => i != j && eFa.元素.contains(eSon.元素));
const 页主标链列提取 = () =>
    列元素列提取()
        .filter(子列父亲节点筛函数)
        .filter((e, _, a) => e.强度 > a[0].强度 * 0.1) // 按最强者 10% 筛选
        .sort((a, b) => a.元素.offsetTop - b.元素.offsetTop) // 按垂直位置对比
        .filter(({ 元素, 强度, 特征列 }) => !console.log(元素, 强度, 特征列)) // 元素提取debug
        .map(({ 元素 }) => 元素) // 元素提取
        .flatMap((e) => [...e?.children]?.map?.(标链元素提取) || [])
        .filter((e) => e)
        .map(标链提取)
        .filter(({ 标题, 链接 }) => 标题)
        .filter(({ 标题, 链接 }) => 链接?.match?.(/^http/));
const 文本复制 = (内容) => {
    const input = document.createElement('textarea');
    input.setAttribute('readonly', 'readonly');
    input.setAttribute('value', 内容);
    input.innerHTML = 内容;
    input.setAttribute('style', 'position: fixed; top:0; left:0;z-index: 9999');
    document.body.appendChild(input);
    input.select();
    input.setSelectionRange(0, input.value.length);
    if (document.execCommand('copy')) {
        document.execCommand('copy');
        console.log(`长度为${内容.length}的内容已复制`);
    } else {
        // alert(`长度为${内容.length}的内容复制失败，请检查浏览器配置，或在页面上先按一下键盘任意键解除剪贴板保护`);
    }
    document.body.removeChild(input);
};
const 已打开过的链接 = {};
const 链接打开 = (链接) => {
    if (!已打开过的链接[链接]) {
        window.open(链接);
    }
    已打开过的链接[链接] = 1;
};
const 链接列获取 = (数量 = undefined) => 页主标链列提取().slice(0, 数量);
const md格式链接生成 = ({ 标题, 链接 }) => `- [${标题}](${链接})`;
const 打开一定数量链接 = (数量) => {
    const 链接列 = 链接列获取(数量).reverse(); //在 chrome 下需要反过来才能让第1个链接先打开。。;
    文本复制(链接列.map(md格式链接生成).join('\n\n'));
    链接列.map(({ 链接 }) => 链接).map(链接打开);
};
window.addEventListener('keydown', (e) => {
    if (!e.ctrlKey && !e.shiftKey && e.altKey && e.key.match(/[1-9]/)) {
        const 打开数量 = 2 ** parseInt(e.key);
        打开一定数量链接(打开数量);
    }
});
console.log('[谷歌一键打开前N项搜索结果] LOADED');
// 链接列获取();
