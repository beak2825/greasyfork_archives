// ==UserScript==
// @name         Bilibili 一键复制视频总结提示词
// @version      1.3.2
// @description  用来一键复制 Bilibili 网页版视频的总结提示词
// @license      MIT
// @author       BHznJNs
// @namespace    https://bilibili.com/
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542349/Bilibili%20%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E8%A7%86%E9%A2%91%E6%80%BB%E7%BB%93%E6%8F%90%E7%A4%BA%E8%AF%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/542349/Bilibili%20%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E8%A7%86%E9%A2%91%E6%80%BB%E7%BB%93%E6%8F%90%E7%A4%BA%E8%AF%8D.meta.js
// ==/UserScript==

const instruction = `\
# 角色

你是一位专业的博客作家和内容编辑，擅长将口语化的视频访谈和演讲稿转化为引人入胜且结构清晰的博客文章。你能够准确模仿给定的转录文本的语言风格，在不丢失原有信息的同时让撰写的文章相比于原本的转录文本更具可读性。

# 任务

你的任务是将用户提供的带有时间戳的视频转录文本，转写成一篇高质量的博客文章。

# 处理步骤

请遵循以下步骤，一步步完成任务：

## 第一步：内容清洗和优化

- 去除口语化表达： 识别并删除填充词（如“嗯”、“啊”、“那个”等）、不必要的重复词句以及口头禅。
- 修正语法和句子结构： 将口语化的、零散的句子改写成语法正确、逻辑连贯的书面语。确保句子流畅、易于理解。
- 去除无关内容：将转录文本中与主要内容无关疑似商品营销的内容去除。
- 纠正错误信息：部分词汇可能会因为转录的原因被识别为同音的词汇，你需要根据上下文正确识别并纠正。

## 第二步：构建博客文章结构

根据优化后的文本内容，构建一篇结构清晰的博客文章，应包含以下要素：
- 引人入胜的标题： 基于文章核心内容，构思一个吸引眼球的标题。
- 前言/引言： 在文章开头撰写一段引言，简要介绍文章主题，并激发读者的阅读兴趣。
- 正文（使用小标题）： 将正文内容划分成几个逻辑清晰的部分，并为每个部分添加简洁明了的小标题。对于复杂的内容，可以适当使用项目符号或编号列表，使信息呈现更加直观。
- 结论： 在文章结尾进行总结，重申核心观点，并可以提出一些启发性的问题或未来的展望。

## 第三步：调整语气和风格

统一风格： 确保整篇文章的语气和风格一致。你的语气和行文风格应该尽量与给定的转录文本保持一致。
提升可读性： 使用简洁的语言和多样的句式，避免冗长复杂的句子。段落之间应有自然的过渡。`;

function getVideoTitle() {
    const titleElement = document.querySelector(".video-info-title .video-title")
    const title = titleElement.textContent;
    return title;
}

async function getTranscription() {
    const aiAssistantButton = document.querySelector("#arc_toolbar_report .video-toolbar-right .video-ai-assistant");
    aiAssistantButton.click();
    const transcriptionBodyQuery = "[data-video-assistant-subject-main]";
    while (!document.querySelector(transcriptionBodyQuery)) {
        console.log("can not find transcriptionBodyQuery");
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    // switch to transcription tab
    document.querySelector("[data-video-assistant-subject-tabs]").childNodes[1].click();

    const transcriptionBodyElement = document.querySelector(transcriptionBodyQuery);
    return transcriptionBodyElement.innerText;
}

const copyButton = document.createElement("button");
copyButton.textContent = "复制总结提示词";
copyButton.style.marginRight = "10px";
copyButton.addEventListener("click", async function() {
    const transcription = await getTranscription();
    const title = await getVideoTitle();
    const prompt = `\
<instruction>
${instruction}
</instruction>

下面是视频的标题和转录文本：

<video-title>${title}</video-title>
<transcription>
${transcription}
</transcription>
`;
    navigator.clipboard.writeText(prompt);
});

(async function() {
    'use strict';
    const toolbar = document.querySelector("#arc_toolbar_report .video-toolbar-right");
    while (!toolbar.querySelector(".video-ai-assistant")) {
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    toolbar.prepend(copyButton);
})();

