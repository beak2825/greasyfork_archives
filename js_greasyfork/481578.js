// ==UserScript==
// @name         算法思维树
// @namespace    http://falcon.ictbda.cn:89/yoriko/
// @version      0.52
// @description  添加快捷指令（prompts）
// @author       TAIST
// @match        https://poe.com/*
// @match        https://chat.openai.com/*
// @match        http://falcon.ictbda.cn:89/yoriko/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/481578/%E7%AE%97%E6%B3%95%E6%80%9D%E7%BB%B4%E6%A0%91.user.js
// @updateURL https://update.greasyfork.org/scripts/481578/%E7%AE%97%E6%B3%95%E6%80%9D%E7%BB%B4%E6%A0%91.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var isDragging = false;
    var offsetX, offsetY;

    // 定义提示
    var prompts = [

{
    label: "step1：请和我一起设计一个算法，求解一个问题。",
    content: `请和我一起设计一个算法，求解一个问题。
        我把这个问题用”输入、输出“的形式描述如下：
        输入：n个城市，记为1, 2, …, n；每两个城市之间都有一条道路，且道路的长度已知；比如第i个城市和第j个城市之间的道路的长度已知，记为d_ij
        输出：城市的一个顺序，使得从第1个城市出发，按顺序旅行完每个城市一次且仅一次，最终回到第1个城市，这样的总里程最短。`
},
{
     label: "step2：理解一下问题，从最简单的情形入手",
     content:'先理解一下问题，从最简单的情形入手：',
     subpoints: [
         `a. 你能写出这个问题的最简单的实例吗？实例的简单程度，可以用问题”输入“部分的关键数据结构的大小来表示。`,
         `b. 对于这个问题的最简单实例，我们能够求出解吗？能够验证解的正确性吗？`
   ]
},
{
    label: 'step3：和这个问题类似的问题',
    content: `能想起和这个问题类似的问题吗？求解类似问题的算法，直接应用于当前问题的简单实例，能产生出正确解吗？如果不行，是两个问题的哪些差异造成的？请尝试进行改进。`

},
{
    label: 'step4：请写出这个问题的复杂一些的实例',
    content: `写出这个问题的复杂一些的实例，并思考如下两点：`,
    subpoints:[
        `a. 这个复杂实例能够分解成简单实例吗？分解实例的关键是看“输入”部分的关键数据结构是啥，这个数据结构能否分解？`,
       ` b. 这个复杂实例的解能否由简单实例的解组合而成？组合实例解的关键是看”输出“部分的关键数据结构是啥，这个数据结构能否组合？`
    ]
},
{
    'label': 'step5：请尝试设计一个”分而治之“算法',
    'content': '依据上述问题分解与解的组合方法，请尝试设计一个”分而治之“算法。即：先把给定的实例分解成简单实例，递归调用求解，进而把简单实例的解组合成给定实例的解。'
},
{
    label: 'step6：这个问题是最优化问题吗？',
    content: `这个问题是最优化问题吗？如果是，咱们先理解一下问题：写出一个最简单实例，枚举出所有的可行解，对每个可行解算出目标函数值，进而找出最优解。`,
    subpoints:[
        `a. 这个问题能分解成子问题吗？咱们尝试把问题的求解过程描述成“多步决策过程”，即：在每个决策步骤，从多个选择项中选择一个，从而得到解的一个组成部分。`,
        `b. 这个问题有”最优子结构”性质吗？即：能否把子问题的最优解组合起来，得到原问题的最优解？你可以用递归表达式来表示“最优子结构”性质`,
        `c. 这个问题的子问题之间是独立的，还是有重叠的？如果是重叠的，则需要避免多次重复求解一个子问题，具体手段是“以存代算”，即：设计一个数据结构（通常是表格），把已经求解的子问题的解记录下来；求解一个子问题之前，先查询表格，看是否已经求解；如果已经求解过，则不需要重复求解。`,
        ]
},

{
    label: 'step7：请依据上述多步决策过程，设计求解这个问题的动态规划算法。',
    content: '请依据上述多步决策过程，设计求解这个问题的动态规划算法。'
},
{
    label: 'step8：改进这个基础版的动态规划算法',
    content: '咱们尝试改进这个基础版的动态规划算法。',
    subpoints: [
        'a. 这个动态规划算法的空间复杂度是多少？空间复杂度用子问题的数目来衡量。',
        'b. 这个动态规划算法的空间复杂度能够降低吗？咱们从“以算代存”的角度开始思考：',
        '   Ⅰ. 如果只要求计算最优解的值、不要求回溯出最优解的话，能够快速计算吗？',
        '   Ⅱ. 如果要求回溯出最优解的话，导致算法变慢的关键点在哪里？',
        '   Ⅲ. 能否对回溯过程也采用“分而治之”策略？即：把问题分解成两个子问题，先确定多步决策过程中间一步的最优决策项，进而对两个子问题分别进行回溯？',
        'c. 这个动态规划算法的时间复杂度是多少？时间复杂度用子问题的数目和处理每个子问题所需要时间的乘积来衡量。',
        'd. 这个动态规划算法的时间复杂度能够降低吗？咱们从“去除冗余计算”的角度开始思考：',
        '   Ⅰ. 观察几个简单实例上动态规划算法的运行结果，看最优解的回溯路径有何规律（比如出现的位置）？能否利用这个规律减少不必要的计算？',
        '   Ⅱ. 观察几个简单实例上动态规划算法的运行结果，看OPT值表格的数值有何规律？是稀疏的吗？如果稀疏的话，是否只计算几个值即可？我们可以从“观察值在何处发生变化”这个角度入手。',
        '   Ⅲ. 观察几个简单实例上动态规划算法的运行结果，看最优决策项有何规律？比如：最优决策项的范围是否有规律？如果有，是否利用这个规律减少不必要的计算？'
    ]
},
{
    label: 'step9：尝试设计一个贪心算法',
    content: `咱们尝试设计一个贪心算法。`,
    subpoints:[
    'a. 设计贪心算法的第一种思路：先把问题的求解过程描述成多步决策过程，然后将优化目标分解成”每步决策的小目标“；尝试设计一个贪心规则求解出每步小目标的最优解。请列出一个例子，验证所设计的贪心规则，能够求出每步小目标的最优解。最后，写出完整的贪心算法。',
   ` b. 设计贪心算法的第二种思路：先设计一个求解这个优化问题的动态规划算法或整数线性规划算法；然后列出一个问题实例，使用所设计的动态规划算法或整数线性规划算法求出最优解；观察在多步决策过程的每一步，最优决策有何规律？能否总结出“最优决策与部分解之间关系”的规律？请根据上述观察，设计贪心规则，进而设计出贪心算法。`
   ]
},
{
    label: 'step10： 设计“逐步改进”的算法',
    content: `如果这个问题不容易分解成子问题的话，我们尝试设计“逐步改进”的算法：`,
    subpoints:[
    `a. 如何得到一个初始的可行解？注意：这个可行解是原始问题的完整解，包含所有的变量，而不是与某个子问题对应的部分解。`,
    `b. 可行解之间有何关系？能否把一个可行解变换到另一个可行解？计算新可行解的目标函数值，是否比原可行解更优？`,
    `c. 根据上述认识，写出一个“逐步改进”算法：从初始解开始，每一步都对当前可行解进行变换，得到一个更优的可行解，直至得到最优或者足够好的可行解。`
    ]
},
{
    label: 'step11：这个问题的解具有何种形式？',
    content: `这个问题的解具有何种形式？能否写成 x=[x1, x2, …, xn], xi = 0/1 的形式？`,
    subpoints:[
    'a. 如果能写成上述形式，请设计一个基础版的枚举算法，枚举出所有的解，进而找出使得目标函数值最小的最优解。',
    `b. 我们对这个基础版进行改进，改进的核心是“剪枝”，即：想办法估计枚举过程中”中间部分解“的质量，以表示”即使扩展这个部分解，能得到高质量完整解的可能性“。一种可行的方式是估计部分解能够产生的完整解的目标函数值下界。`
    ]
},
{
    label: 'step12：这个问题能够建模成线性规划或者整数线性规划吗？',
    content: `这个问题能够建模成线性规划或者整数线性规划吗？建模的小窍门：把对解的约束先用自然语言描述，具体来说，是与 "if x > 0 then y = 1 else y = 0" 类似的描述，然后再写成整数变量的不等式或者等式。`
}

]

    // 创建文本容器
    var container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '50%';
    container.style.right = '20px';
    container.style.transform = 'translateY(-60%)';
    container.style.width = '250px';
    container.style.height = '500px';
    container.style.background = '#E8E8E8';
    container.style.borderRadius = '5px';
    container.style.padding = '10px';
    container.style.display = 'none';
    container.style.overflow = 'auto';
    document.body.appendChild(container);

    GM_addStyle(`
        .custom-button {
            width: 250px;
            background: #ffffff;
            color: #4682B4;
            border: none;
            border-radius: 5px;
            padding: 5px;
            cursor: pointer;
            text-align: left;
            margin-bottom: 5px;
        }
        .subpoint {
            margin-left: 10px;
            font-size: 80%; /* 缩小字体以体现小点效果 */
            cursor: pointer;
            background-color: #f5f5f5; /* 使用淡灰色背景 */
            padding: 5px; /* 添加一些内边距，使背景更突出 */
            border-radius: 5px; /* 使背景呈现圆角效果 */
            margin-bottom: 5px;
        }

    `);

    // 创建按钮Algorithm Tree
    var button = document.createElement('textarea');
    button.style.position = 'fixed';
    button.style.bottom = '60px';
    button.style.right = '20px';
    button.style.width = '250px';
    button.style.height = '20px';
    button.style.background = '	#ffffff';
    button.style.color = 'black';
    button.style.border = '2px solid black';
    button.style.borderRadius = '5px';
    button.style.padding = '10px';
    button.style.resize = 'none';
    button.readOnly = true;
    button.style.font = '16px Bodoni';
    button.style.textAlign = 'center';
    button.textContent = 'Algorithm co-pilot prompts';
    document.body.appendChild(button);

    // 添加鼠标悬停事件监听器
    button.addEventListener('mouseenter', function () {
        button.style.cursor = 'move';
    });

    button.addEventListener('mouseleave', function () {
        button.style.cursor = 'default';
    });

    // 点击按钮
    button.addEventListener('click', function () {
        if (container.style.display === 'none') {
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    });

    // 移动按钮
    button.addEventListener('mousedown', function (event) {
        isDragging = true;
        offsetX = event.clientX - button.getBoundingClientRect().left;
        offsetY = event.clientY - button.getBoundingClientRect().top;
    });

    document.addEventListener('mousemove', function (event) {
        if (isDragging) {
            button.style.left = event.clientX - offsetX + 'px';
            button.style.top = event.clientY - offsetY + 'px';
        }
    });

    document.addEventListener('mouseup', function () {
        isDragging = false;
    });

    // 使用 Ctrl+Shift+F 或 Cmd+Shift+F 打开或关闭
    document.addEventListener('keydown', function (event) {
        if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'F') {
            event.preventDefault();
            if (container.style.display === 'none') {
                container.style.display = 'block';
            } else {
                container.style.display = 'none';
            }
        }
    });

    // 插入文本框
    function insertPrompt(content) {
        var inputBox = document.querySelector('input[type="text"], textarea');
        const submitButton = document.querySelector('.ChatMessageSendButton_sendButton__4ZyI4');
        if (inputBox) {
            var startPos = inputBox.selectionStart;
            var endPos = inputBox.selectionEnd;
            var text = inputBox.value;
            var newText = text.substring(0, startPos) + content + text.substring(endPos, text.length);
            inputBox.value = newText;
            inputBox.setSelectionRange(startPos + content.length, startPos + content.length);
            inputBox.style.textAlign = 'left';
            inputBox.style.height = inputBox.scrollHeight + 'px';

            // 触发提交按钮点击事件
            if (submitButton && submitButton.disabled === true) {
                submitButton.removeAttribute('disabled');
            }
            if (submitButton) {
                submitButton.click();
            }
        }
    }

// ...

// 创建按钮
prompts.forEach(function (prompt) {
    var subpointsContainer = document.createElement('div');
    subpointsContainer.style.display = 'none'; // 初始时隐藏小点
    var promptButton = document.createElement('button');
    promptButton.textContent = prompt.label;
    promptButton.className = 'custom-button';
    promptButton.addEventListener('click', function () {
        if (subpointsContainer.style.display === 'none') {
            insertPrompt(prompt.content); // 输入内容
        }
        toggleSubpoints(subpointsContainer); // Toggle subpoints visibility

        // 清空subpointsContainer，防止重复添加小点
        subpointsContainer.innerHTML = '';

        if (prompt.subpoints) {
            prompt.subpoints.forEach(function (subpoint) {
                var subpointElement = document.createElement('div');
                subpointElement.className = 'subpoint';
                subpointElement.textContent = '• ' + subpoint;
                subpointElement.addEventListener('click', function () {
                    insertPrompt(subpoint.substring(2)); // Exclude the bullet point
                });
                subpointsContainer.appendChild(subpointElement);
            });
        }
    });
    container.appendChild(promptButton);
    container.appendChild(subpointsContainer);
});

// 添加函数来切换小点的可见性
function toggleSubpoints(subpointsContainer) {
    if (subpointsContainer.style.display === 'none') {
        subpointsContainer.style.display = 'block'; // Show subpoints
    } else {
        subpointsContainer.style.display = 'none'; // Hide subpoints
    }
}

// ...



})();

