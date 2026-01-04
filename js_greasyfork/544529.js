// ==UserScript==
// @name         AlphaXiv Supercharger
// @name:zh-CN   AlphaXiv 超级增强器 
// @namespace    http://tampermonkey.net/
// @version      15.0
// @description  The definitive, working toolkit. Corrected match patterns ensure it works on ALL paper URLs (including versions). Reliable, simple, and finally correct.
// @description:zh-CN  终极、可用的工具套装。已修正匹配规则，确保在所有论文URL上（包括带版本号的）都能生效。可靠、简单，这才是最终正确的版本。
// @author       YourName, World-Class UX Expert & original authors
// @match        https://arxiv.org/abs/*
// @match        https://www.arxiv.org/abs/*
// @match        https://alphaxiv.org/abs/*
// @match        https://www.alphaxiv.org/abs/*
// @match        https://alphaxiv.org/overview/*
// @match        https://www.alphaxiv.org/overview/*
// @grant        GM_addStyle
// @icon         https://alphaxiv.org/icon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544529/AlphaXiv%20Supercharger.user.js
// @updateURL https://update.greasyfork.org/scripts/544529/AlphaXiv%20Supercharger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentHostname = window.location.hostname;
    const currentPathname = window.location.pathname;

    // ===================================================================
    //  SECTION 1: Code for arXiv.org pages
    // ===================================================================
    if (currentHostname.includes('arxiv.org')) {
        try {
            const createLinkToAlphaXiv = (name, url) => {
                const link = document.createElement('a');
                link.style.cssText = `display: inline-block; border-left: 2px solid #fff; padding-left: 10px; margin-left: 10px;`;
                link.target = '_blank';
                link.href = url;
                link.textContent = name;
                return link;
            };
            const href = window.location.href;
            const alphaXivEntry = createLinkToAlphaXiv('AlphaXiv', href.replace('arxiv.org', 'alphaxiv.org'));
            const target = document.querySelector('.header-breadcrumbs');
            if (target) {
                target.appendChild(alphaXivEntry);
            }
        } catch (error) {
            console.error('[AlphaXiv Supercharger] Error on arXiv page:', error);
        }
    }

    // ===================================================================
    //  SECTION 2: Code for AlphaXiv.org pages
    // ===================================================================
    else if (currentHostname.includes('alphaxiv.org')) {
        try {
            // --- PART 2A: "Back to ArXiv" button (Runs ONLY on /abs/*) ---
            if (currentPathname.startsWith('/abs/')) {
                 const backButtonObserver = new MutationObserver(() => {
                    const targetContainer = document.querySelector(".flex.items-center.space-x-2");
                    if (targetContainer && !targetContainer.querySelector('a[href*="arxiv.org"]')) {
                        const newButton = document.createElement('a');
                        newButton.href = window.location.href.replace('alphaxiv.org', 'arxiv.org');
                        newButton.target = '_blank';
                        newButton.className = 'group flex h-[30px] items-center justify-between rounded-lg border px-2 text-sm transition-all border-gray-600 bg-white text-gray-600 hover:bg-gray-100';
                        const buttonText = document.createElement('span');
                        buttonText.textContent = 'Back to ArXiv';
                        buttonText.className = 'font-medium text-gray-600';
                        newButton.appendChild(buttonText);
                        targetContainer.appendChild(newButton);
                    }
                });
                backButtonObserver.observe(document.body, { childList: true, subtree: true });
            }

            // --- PART 2B: Prompt Palette (Runs on BOTH /overview/* AND /abs/*) ---
            if (currentPathname.startsWith('/overview/') || currentPathname.startsWith('/abs/')) {
                const MODULES = [
                    { title: '① 快速通读', prompts: [
                        { id: 'quick-chatgpt', type: 'ChatGPT', label: '结构化总结', value: `请帮我概括这篇论文的核心结构，包括：\n- 标题与作者单位\n- 背景与研究动机\n- 研究问题或假设\n- 方法概述（含模型/算法名称）\n- 实验与结果关键数据\n- 创新点与贡献总结（3条以内）\n- 局限与未来工作\n请使用简洁清晰的分点格式。` },
                        { id: 'quick-claude', type: 'Claude', label: '导师式讲解', value: `假设你是一位讲解论文的导师，请用通俗的语言向本科生解释这篇论文在做什么。不要逐段总结，而是围绕“这项研究想解决什么问题？用了什么办法？发现了什么？”三个问题来展开，让读者在三分钟内明白这篇论文的价值。` },
                        { id: 'gemini-1-nav', type: 'Gemini', label: '摘要重构', value: `请快速通读以下论文内容，为我输出一份结构清晰的导航摘要笔记，包括：\n\n- 研究主题与目标\n- 作者提出的主要方法或模型\n- 数据来源与实验设置（简要）\n- 论文的主要结论与贡献\n\n请使用分段 Markdown 格式输出，每段标题清晰，适合在 Notion 或 Obsidian 中作为阅读导图使用。` }
                    ]},
                    { title: '② 方法详解', prompts: [
                        { id: 'method-chatgpt', type: 'ChatGPT', label: '逐步解析', value: `请对论文中的方法部分进行逐步解析，要求包括：\n1. 每个模块的输入、输出和作用；\n2. 使用了哪些关键技术或机制（如 Transformer、GNN 等）；\n3. 如涉及数学公式，请简要通俗化解释；\n4. 用结构图或流程图式样展示整体框架。` },
                        { id: 'method-claude', type: 'Claude', label: '故事化解读', value: `这篇论文的方法部分信息量很大，我想通过“讲故事”的方式理解：请像讲一个项目开发故事一样，把研究者是怎么一步步设计这个方法的讲出来，包括他们遇到什么挑战、为何选这个结构、每一步的逻辑联系。` },
                        { id: 'gemini-2-tech', type: 'Gemini', label: '技术框架', value: `请从本文的方法部分中，提炼核心算法或系统架构，并按以下结构展开说明：\n\n- 方法的基本动机与原理\n- 各个模块的输入、处理逻辑、输出\n- 如果可能，请用 Markdown 列表或伪代码描述整体流程\n- 尝试用生活/比喻方式解释机制，以帮助非专业者理解其工作原理\n\n输出结构清晰，并尽可能避免照抄原文。` }
                    ]},
                    { title: '③ 实验洞察', prompts: [
                        { id: 'exp-chatgpt', type: 'ChatGPT', label: '逻辑分析', value: `请分析论文的实验部分，重点包括：\n- 所使用的数据集及其代表性；\n- 对比实验设置是否合理；\n- 评估指标是否充分；\n- 结果是否显著优于现有方法；\n- 结果支持作者的哪些结论？\n请用逻辑清晰的分析语言表达。` },
                        { id: 'exp-claude', type: 'Claude', label: '审稿人视角', value: `请结合实验数据，为我讲清楚：这个模型到底好在哪里？是不是所有指标都更好？有没有反常的情况？作者是否过度解读结果了？如果你是审稿人，你会如何评价这些实验？` },
                        { id: 'gemini-3-insight', type: 'Gemini', label: '结果解读', value: `请帮我解读论文中的实验部分，具体包括：\n\n- 使用了哪些数据集和实验设置？\n- 作者设计了哪些对比组（baseline）与评估指标？\n- 实验结果说明了什么？作者是否充分支持其论点？\n- 如有图表，请尝试用文字重建并说明关键趋势与对比结果\n\n请以审稿人视角进行分析，指出实验设计是否有缺陷或值得商榷之处。` }
                    ]},
                    { title: '④ 批判思考', prompts: [
                        { id: 'crit-chatgpt', type: 'ChatGPT', label: '价值评估', value: `请帮我总结该论文的主要创新点，并评估其在已有文献中的相对价值。是否为增量性工作？是否填补了空白？是否存在方法泛化性、数据依赖性等潜在问题？` },
                        { id: 'crit-claude', type: 'Claude', label: '优劣思辨', value: `我想更深入思考这篇论文的价值与问题：请从“做得很好”和“还有待改进”的角度各列出 2-3 点，并结合你的推理说明这些优劣的判断依据。` },
                        { id: 'gemini-4-crit', type: 'Gemini', label: '价值评估', value: `请基于以下论文内容，从价值评估与方法局限的角度提出深入分析，包含：\n\n- 该论文的创新之处在哪？对学术或实际应用有何意义？\n- 作者的方法可能在哪些场景下失效？有何关键假设？\n- 是否存在样本偏差、推理链不完整、评估方式不足等问题？\n- 如果我是该论文的审稿人，我可能会提出哪些问题？\n\n请用批判性但中立的语气，输出思辨性结论。` }
                    ]},
                    { title: '⑤ 论文对比', prompts: [
                        { id: 'comp-chatgpt', type: 'ChatGPT', label: '表格化对比', value: `我有多篇论文，请你帮助我比较它们在以下方面的异同：\n- 研究目标与问题设定；\n- 所用方法或模型结构；\n- 数据集/评估方式；\n- 关键结果与性能差距；\n- 各自的创新点或不足之处。\n请形成一个对比表格或分类结构化总结。` },
                        { id: 'comp-claude', type: 'Claude', label: '知识演化视角', value: `这些论文之间有哪些研究思路上的“流派”？谁是改进谁的？是否可以归纳出一个共同的问题脉络或技术发展链条？请从知识演化视角帮助我看清“谁启发了谁”。` },
                        { id: 'gemini-5-comp', type: 'Gemini', label: '对照研究', value: `请将该论文与以下一篇/几篇相关论文进行对比分析：\n\n- 核心目标与方法差异\n- 模型设计或实验设置的演化轨迹\n- 各自的适用场景与扩展性\n- 是否形成互补关系，或存在范式冲突？\n\n请输出成一份表格对比 + 简要总结，用知识演化视角说明新论文的位置。` }
                    ]},
                    { title: '⑥ 深度精读', prompts: [
                        { id: 'deep-gemini', type: 'Gemini', label: '结构化精读', value: `你是一位训练有素的科研助手，擅长跨学科论文的结构化理解、批判性分析与工程/应用层面迁移。\n\n我将向你提供一篇论文，请你严格按照以下结构，提炼核心信息，并输出清晰的 Markdown 格式研究笔记：\n\n---\n\n### 1️⃣ 研究动机与问题陈述\n- 论文试图解决的关键问题是什么？\n- 它为何重要？在该领域中处于什么位置？\n\n---\n\n### 2️⃣ 核心贡献（用简洁点列总结）\n- 列出本文的主要贡献（不少于3条）\n- 哪些是创新点，哪些是对现有工作的拓展？\n\n---\n\n### 3️⃣ 方法与框架结构\n- 描述论文提出的方法或架构的整体框架\n- 可以列表或绘制简易流程图（建议使用 Markdown 列表或图解语言）\n\n---\n\n### 4️⃣ 数据与实验设计（如适用）\n- 数据来源和处理方式？\n- 实验如何设置？评估指标和结果如何？\n\n---\n\n### 5️⃣ 优势与局限\n- 本方法/研究的亮点有哪些？\n- 是否存在局限、盲点或待改进之处？\n\n---\n\n### 6️⃣ 应用场景与迁移价值\n- 成果可应用于哪些实际问题或领域？\n- 能否迁移到其他任务、学科或系统中？\n\n---\n\n### 7️⃣ 个人思考与后续探索\n- 你对这篇论文的最大收获或疑问是什么？\n- 如果继续这项研究，你可能采取哪些方向？\n\n---\n\n📝 输出要求：\n- 用 **Markdown** 格式组织输出（适合导入 Notion / Obsidian / Docs）\n- 尽量使用自己的语言重述，不照搬原文\n- 如果有图示建议，可使用文字/列表描述流程\n- 适用于任何学科，不要假设是 AI 论文` },
                        { id: 'deep-claude', type: 'Claude', label: '深度阅读', value: `你是一位深度思维型的科研与系统助理，擅长阅读复杂论文、理解其结构、提炼关键思想，并将研究成果转化为结构化笔记、可复现工程方案或进一步的探索路径。\n\n我将提供一篇论文的全文、摘要或片段，请严格按以下结构进行系统性解读，并用你自己的语言表达：\n\n---\n\n## 🧩 1. 研究动机与核心问题\n- 本文试图解决的核心问题是什么？\n- 这个问题在该领域的重要性体现在哪些方面？\n- 作者如何界定了问题的边界与挑战？\n\n## 🧱 2. 主要贡献总结（简洁有力，不少于3点）\n- 本文的关键贡献包括哪些方面？\n- 哪些属于方法/系统/实验创新，哪些属于理论或分析角度？\n\n## 🧠 3. 方法/系统结构图解\n- 简述作者提出的整体方法或系统架构，分模块说明每部分的功能\n- 如果是模型方法，请说明输入、处理机制与输出过程\n- 请用文字/伪代码/流程图或 Markdown 列表方式组织结构\n\n## 🧪 4. 数据、实验设计与结果（如适用）\n- 使用了哪些数据集？处理流程？\n- 实验设置如何？采用了哪些对比方法和指标？\n- 结果体现了哪些优势或特征？\n\n## 📊 5. 优势与局限与反思\n- 本文方法的亮点在哪里？是否有普适性？\n- 作者有没有回避或未充分讨论的问题？\n- 你是否发现可能存在的假设盲点、工程难点或方法局限？\n\n## 🚀 6. 迁移应用与启发\n- 本文的思路或方法可以迁移到哪些实际任务或领域？\n- 如果要落地为产品或系统，需要补充哪些模块？\n\n## 🔭 7. 延展思考或进一步研究方向\n- 如果你要继续这项研究，你会做哪些改进或拓展？\n- 有哪些你希望模型进一步挖掘或未被回答的问题？\n\n---\n\n📌 输出要求：\n- 用 Markdown 格式清晰组织内容\n- 每一部分都尽量用自己的语言重述，不照搬论文原话\n- 如需辅助说明结构，请用伪代码或有层级的 Markdown 列表\n- 如果输入的是 PDF OCR 或文本块，请自动识别结构内容并整理成以上结构\n\n🧭 角色提示（可选）：\n如适用，请以“工程复现视角”/“博士申请笔记”/“系统研读讲义”/“会议报告摘要”等不同目标给出推荐改写方式。` },
                        { id: 'deep-grok', type: 'Grok', label: '高效解读', value: `你是一个严谨的科研助手与系统分析专家，擅长快速提炼科研论文的关键思想、结构框架、方法机制与实际意义。我将提供一篇论文内容（可为全文、摘要、截图OCR或主要段落），请你按以下结构系统地完成内容解读：\n\n---\n\n## 📘 1. 研究背景与核心问题\n- 本文研究了什么问题？为何重要？现实背景或理论缺口是什么？\n- 有哪些已有方法存在不足？本文打算如何突破？\n\n## 🧠 2. 核心贡献概括（不少于三点，点列式）\n- 本文的创新点、提出的新方法或系统\n- 与已有工作相比，在哪些维度有所改进？\n\n## 🧱 3. 方法原理 / 系统架构\n- 如果是理论/建模类：解释主要模型、推理机制、公式结构  \n- 如果是系统/工程类：模块组成、处理流程、信息流动  \n- 使用结构化形式：如 Markdown 层级列表、流程图（文本描述）或伪代码\n\n## 🧪 4. 数据与实验设计（如适用）\n- 使用了哪些数据集、实验设置、比较基准（baseline）？\n- 有哪些评估指标？结果说明了什么？\n\n## ✅ 5. 方法优点与不足\n- 作者在哪些地方表现出色？方法/设计是否具备可复现性与通用性？\n- 有哪些值得关注的假设、限制、风险或模糊点？\n\n## 🚀 6. 应用潜力与迁移可能\n- 本研究可以应用于哪些实际任务或行业？\n- 能否拓展到不同场景/任务？是否具有跨学科意义？\n\n## 🔍 7. 衍生问题与延展方向\n- 若继续探索，你有哪些改进想法？\n- 有哪些该论文未触及但你认为重要的研究问题？\n\n---\n\n🎯 输出要求：\n- 用 **Markdown** 或 **分段结构** 输出\n- 不照搬原文，用自己的语言总结\n- 可插入结构图（文本形式）或伪代码，说明处理流程\n- 如我输入的是截图/OCR内容，请你自动提取核心信息并按上述格式组织` }
                    ]}
                ];
                GM_addStyle(`:root { --menu-bg: #fff; --menu-shadow: rgba(0, 0, 0, 0.1); --menu-border: #E2E8F0; --menu-text: #2D3748; --menu-group-text: #718096; --search-bg: #F7FAFC; --search-border-focus: #4299E1; --tag-bg: #EDF2F7; --tag-text: #4A5568; --tag-hover-bg: #E2E8F0; --tag-model-text: #718096; --trigger-bg: #F7FAFC; --trigger-border: #E2E8F0; --trigger-hover-bg: #EDF2F7; } html.dark { --menu-bg: #2D3748; --menu-shadow: rgba(0, 0, 0, 0.4); --menu-border: #4A5568; --menu-text: #E2E8F0; --menu-group-text: #A0AEC0; --search-bg: #1A202C; --search-border-focus: #63B3ED; --tag-bg: #4A5568; --tag-text: #CBD5E0; --tag-hover-bg: #718096; --tag-model-text: #A0AEC0; --trigger-bg: #2D3748; --trigger-border: #4A5568; --trigger-hover-bg: #1A202C; } #prompt-workbench-container-v15 { position: relative; margin-bottom: 12px; font-family: sans-serif; } #prompt-trigger-bar-v15 { width: 100%; padding: 8px 12px; font-size: 14px; font-weight: 600; color: var(--menu-text); background-color: var(--trigger-bg); border: 1px solid var(--trigger-border); border-radius: 8px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: background-color 0.2s, border-radius 0.2s; box-sizing: border-box; } #prompt-trigger-bar-v15.open { border-bottom-left-radius: 0; border-bottom-right-radius: 0; } #prompt-panel-v15 { display: none; position: absolute; left: 0; right: 0; bottom: 100%; z-index: 1000; background-color: var(--menu-bg); border: 1px solid var(--menu-border); border-bottom: none; border-top-left-radius: 8px; border-top-right-radius: 8px; box-shadow: 0 -4px 12px var(--menu-shadow); max-height: 50vh; overflow: hidden; flex-direction: column; } #prompt-panel-v15.visible { display: flex; } #prompt-menu-filter-container-v15 { padding: 12px; border-bottom: 1px solid var(--menu-border); flex-shrink: 0; } #prompt-menu-filter-v15 { width: 100%; padding: 10px 12px; font-size: 14px; border-radius: 8px; border: 1px solid var(--menu-border); background-color: var(--search-bg); color: var(--menu-text); box-sizing: border-box; } #prompt-menu-filter-v15:focus { outline: none; border-color: var(--search-border-focus); box-shadow: 0 0 0 1px var(--search-border-focus); } #prompt-menu-palette-container-v15 { padding: 8px 12px 12px 12px; overflow-y: auto; flex-grow: 1; } .prompt-menu-group-v15 { margin-top: 12px; } .prompt-menu-group-v15:first-child { margin-top: 0; } .prompt-menu-group-title-v15 { margin-bottom: 8px; padding: 0 4px; font-size: 12px; font-weight: bold; color: var(--menu-group-text); text-transform: uppercase; letter-spacing: 0.05em; } .prompt-menu-tag-container-v15 { display: flex; flex-wrap: wrap; gap: 8px; } .prompt-menu-tag-v15 { padding: 5px 10px; font-size: 13px; font-weight: 500; border-radius: 16px; background-color: var(--tag-bg); color: var(--tag-text); cursor: pointer; transition: background-color 0.2s, color 0.2s; display: flex; align-items: center; gap: 6px; } .prompt-menu-tag-v15 .model-name { font-size: 11px; font-weight: 700; color: var(--tag-model-text); opacity: 0.8; } .prompt-menu-tag-v15:hover { background-color: var(--tag-hover-bg); }`);
                const injectText = (value, editor) => {
                    if (!editor) return;
                    const pElement = editor.querySelector('p');
                    if (pElement) {
                        pElement.textContent = value;
                        pElement.classList.remove('is-empty');
                        const trailingBreak = pElement.querySelector('.ProseMirror-trailingBreak');
                        if (trailingBreak) trailingBreak.remove();
                        editor.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                        editor.focus();
                    }
                };

                const checkPromptInterval = setInterval(() => {
                    const editor = document.querySelector('.ProseMirror[contenteditable="true"]');
                    if (editor && !document.getElementById('prompt-workbench-container-v15')) {
                        const workbenchContainer = document.createElement('div');
                        workbenchContainer.id = 'prompt-workbench-container-v15';
                        const triggerBar = document.createElement('div');
                        triggerBar.id = 'prompt-trigger-bar-v15';
                        triggerBar.innerHTML = `<span>✨ Prompt Palette / 提示词库</span><span>▲</span>`;
                        const panel = document.createElement('div');
                        panel.id = 'prompt-panel-v15';
                        panel.innerHTML = `<div id="prompt-menu-filter-container-v15"><input type="text" id="prompt-menu-filter-v15" placeholder="🔍 搜索..." /></div><div id="prompt-menu-palette-container-v15"></div>`;
                        workbenchContainer.append(triggerBar, panel);
                        editor.parentElement.before(workbenchContainer);

                        const paletteContainer = panel.querySelector('#prompt-menu-palette-container-v15');
                        const filterInput = panel.querySelector('#prompt-menu-filter-v15');
                        MODULES.forEach(module => {
                            const group = document.createElement('div');
                            group.className = 'prompt-menu-group-v15';
                            group.innerHTML = `<div class="prompt-menu-group-title-v15">${module.title}</div><div class="prompt-menu-tag-container-v15"></div>`;
                            const tagContainer = group.querySelector('.prompt-menu-tag-container-v15');
                            module.prompts.forEach(prompt => {
                                const tag = document.createElement('div');
                                tag.className = 'prompt-menu-tag-v15';
                                tag.innerHTML = `<span class="model-name">${prompt.type}</span> ${prompt.label}`;
                                tag.onclick = () => {
                                    const currentEditor = document.querySelector('.ProseMirror[contenteditable="true"]');
                                    injectText(prompt.value, currentEditor);
                                    panel.classList.remove('visible');
                                    triggerBar.classList.remove('open');
                                };
                                tagContainer.appendChild(tag);
                            });
                            paletteContainer.appendChild(group);
                        });
                        triggerBar.onclick = (e) => {
                            e.stopPropagation();
                            const isVisible = panel.classList.toggle('visible');
                            triggerBar.classList.toggle('open', isVisible);
                            if (isVisible) { filterInput.focus(); }
                        };
                        filterInput.oninput = () => {
                            const query = filterInput.value.toLowerCase();
                            paletteContainer.querySelectorAll('.prompt-menu-group-v15').forEach(group => {
                                let hasVisibleTag = false;
                                group.querySelectorAll('.prompt-menu-tag-v15').forEach(tag => {
                                    const text = tag.textContent.toLowerCase();
                                    if (text.includes(query)) {
                                        tag.style.display = 'flex';
                                        hasVisibleTag = true;
                                    } else {
                                        tag.style.display = 'none';
                                    }
                                });
                                group.style.display = hasVisibleTag ? 'block' : 'none';
                            });
                        };
                        document.addEventListener('click', () => {
                            panel.classList.remove('visible');
                            triggerBar.classList.remove('open');
                        });
                        clearInterval(checkPromptInterval);
                    }
                }, 500);
            }
        } catch (error) {
            console.error('[AlphaXiv Supercharger] Error on AlphaXiv page:', error);
        }
    }
})();