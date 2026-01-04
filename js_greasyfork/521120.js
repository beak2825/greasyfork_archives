// ==UserScript==
// @name         北大青鸟云题库解析
// @namespace    http://tampermonkey.net/
// @version      0.0.6
// @description  启动!
// @author       超级猫猫头
// @match        https://tiku.kgc.cn/*
// @icon         https://webstatic.mihoyo.com/bh3/upload/officialsites/201908/ys_1565764084_7084.png
// @grant        none
// @license      GNU GPLv3
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/521120/%E5%8C%97%E5%A4%A7%E9%9D%92%E9%B8%9F%E4%BA%91%E9%A2%98%E5%BA%93%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/521120/%E5%8C%97%E5%A4%A7%E9%9D%92%E9%B8%9F%E4%BA%91%E9%A2%98%E5%BA%93%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

// 检查localStorage中是否已经有firstUse的记录
let firstUse = localStorage.getItem('firstUse') === 'true';

// 显示免责声明和使用说明
if (!firstUse) {
    const userConsent = prompt("欢迎使用北大青鸟云题库解析脚本！\n\n本脚本仅供学习参考使用，不得用于考试作弊等用途。\n请支持原创，任何形式的二次倒卖、转售或出租本脚本的行为均属违法，一经发现，将追究法律责任。\n\n使用本脚本即表示您同意遵守相关法律法规和道德规范。\n\n请输入 '同意' 以继续使用本脚本。");
    if (userConsent === "同意") {
        alert("欢迎使用北大青鸟云题库解析脚本！\n\n按下回车键以开始获取题目解析。\n\n按下j键可在题目报告页一键全对。\n\n按下esc键输出解析。");
        firstUse = true; // 用户同意免责声明，设置firstUse为true
        localStorage.setItem('firstUse', 'true'); // 将firstUse状态保存到localStorage中
    } else {
        alert("您未同意免责声明，如果不想使用脚本可以将脚本删除。");
        throw new Error("用户未同意免责声明，脚本终止执行。"); // 禁止用户使用脚本的所有功能
    }
}


let isFetchingAnalysis = false; // 新增变量，用于跟踪是否正在获取解析

// 等待用户按下回车键
function waitForEnter() {
    return new Promise(resolve => {
        document.addEventListener('keydown', function onKeydown(event) {
            if (event.key === 'Enter') {
                resolve();
            }
        });
    });
}

// 清理 HTML 内容
function cleanHtmlContent(content) {
    // 将 HTML 实体转换为对应的字符
    content = content.replace(/&amp;nbsp;/g, ' ');
    // 移除所有的 HTML 标签
    content = content.replace(/<[^>]+>/g, '');
    // 移除换行符 \r\n
    content = content.replace(/\r\n/g, ' ');
    return content;
}

// 获取题目解析
async function getQuestionAnalysis() {
    if (isFetchingAnalysis) {
        console.log('已经有获取解析的操作正在进行，忽略本次请求。');
        return;
    }

    isFetchingAnalysis = true; // 设置为正在获取解析

    // 创建进度显示元素
    const progressElement = document.createElement('div');
    progressElement.style.position = 'fixed';
    progressElement.style.top = '10px';
    progressElement.style.right = '10px';
    progressElement.style.backgroundColor = 'rgb(51, 51, 51)'; // 修改此处颜色
    progressElement.style.border = 'none'; // 去除外边框
    progressElement.style.padding = '5px';
    progressElement.style.zIndex = 1000;
    progressElement.style.color = 'rgb(160, 192, 1)'; // 修改文字颜色
    document.body.appendChild(progressElement);

    // 获取网页源代码
    const pageSource = document.documentElement.outerHTML;

    // 使用正则表达式查找题目 id
    const pattern = /javascript:markQuestion\((\d+)\)/g;
    let matches;
    const analysisList = [];
    const processedIds = new Set();
    let id = 0; // 初始化计数器为0

    while ((matches = pattern.exec(pageSource)) !== null) {
        const questionId = matches[1];
        if (!processedIds.has(questionId)) {
            processedIds.add(questionId);
            id += 1; // 每次循环开始时递增计数器

            // 更新进度显示
            progressElement.textContent = `正在获取第 ${id} 题的解析...`;

            // 拼接 URL
            const url = `https://tiku.kgc.cn/testing/questionAnalysis/${questionId}`;

            // 使用 fetch API 获取解析内容
            const response = await fetch(url);
            const analysis = await response.text();

            // 使用正则表达式匹配 "content" 字段
            const contentPattern = /"content":"([^"]*)"/g;
            let contentMatches;
            let contentId = 0;
            while ((contentMatches = contentPattern.exec(analysis)) !== null) {
                contentId += 1;
                const content = contentMatches[1];
                // 清理 HTML 内容
                const cleanContent = cleanHtmlContent(content);
                analysisList.push({ id, contentId, content: cleanContent });
            }
        }
    }

    // 所有解析获取完毕，更新进度显示
    progressElement.textContent = '所有解析已获取完毕(按下esc键输出解析)';

    // 等待2秒后隐藏进度显示元素
    setTimeout(() => {
        progressElement.style.display = 'none';
    }, 2000);

    // 在这里保存解析，而不是立即输出
    // 假设我们将解析保存在一个全局变量中
    window.analysisList = analysisList;

    isFetchingAnalysis = false; // 获取解析完成，设置为未在获取解析
}

// 监听回车键按下事件
document.addEventListener('keydown', async function onKeydown(event) {
    if (event.key === 'Enter') {
        await getQuestionAnalysis();
    }
});

// 监听 ESC 键按下事件
document.addEventListener('keydown', async function onKeydown(event) {
    if (event.key === 'Escape') {
        // 在这里输出之前保存的解析
        const outputWindow = window.open('', '_blank');
        if (window.analysisList) {
            window.analysisList.forEach(({ id, contentId, content }) => {
                if (content) {
                    // 在每个解析后添加换行符
                    outputWindow.document.write(`第 ${id} 题的第 ${contentId} 个解析: ${content}<br><br>`);
                } else {
                    outputWindow.document.write(`第 ${id} 题的第 ${contentId} 个解析未找到<br><br>`);
                }
            });
        } else {
            outputWindow.document.write('暂无解析内容');
        }
    }
});

//自由改名
const userNameElement = document.getElementById('userName');
if (userNameElement) {
    userNameElement.contentEditable = true;
}

// 一键全对
document.addEventListener('keydown', function onKeydown(event) {
    if (event.key === 'j') {
        
        // 使用 XPath 查找包含 "本次考试得分为：" 的元素
        function findScoreElement() {
            const xpath = "//span[contains(text(), '本次考试得分为：')]";
            return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        }

        // 获取<span class="reds">元素中的得分
        const redsElement = document.querySelector('span.reds');
        if (redsElement) {
            // 将得分更改为100
            redsElement.textContent = '100';
        }

        // 使用 XPath 查找得分元素并修改其内容
        const scoreElement = findScoreElement();
        if (scoreElement) {
            scoreElement.innerHTML = '本次考试得分为：<i>100分</i>';
        }

        // 获取所有class="red"的li元素
        const redListElements = document.getElementsByClassName('red');

        // 使用forEach方法一次性移除所有元素的red属性
        Array.from(redListElements).forEach(element => {
            element.classList.remove('red');
        });

        // 获取<p class="grays">元素中的x
        const graysElement = document.querySelector('p.grays');
        if (graysElement) {
            const text = graysElement.textContent;
            const match = text.match(/共(\d+)道题/);
            if (match) {
                const x = match[1];

                // 获取<p class="size">元素
                const sizeElement = document.querySelector('p.size');
                if (sizeElement) {
                    sizeElement.textContent = `${x}`;
                }
            }
        }
    }
});
