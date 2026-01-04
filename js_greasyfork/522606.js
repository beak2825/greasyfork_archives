// ==UserScript==
// @name         Poe2MD
// @name:zh-CN   Poe对话导出
// @namespace    https://github.com/hehihi
// @version      1.1.0
// @description  Export Poe conversations to local Markdown files with better formatting
// @description:zh-cn 将Poe对话导出到本地Markdown文件，更好的格式支持
// @author       hehihi
// @match        https://poe.com/chat/*
// @grant        GM_registerMenuCommand
// @require      https://unpkg.com/html-to-md/dist/index.js
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/522606/Poe2MD.user.js
// @updateURL https://update.greasyfork.org/scripts/522606/Poe2MD.meta.js
// ==/UserScript==

GM_registerMenuCommand("Poe2MD", () => {
  function formatTimestamp() {
    const date = new Date();
    return {
      filename: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}_${String(date.getHours()).padStart(2, "0")}-${String(date.getMinutes()).padStart(2, "0")}-${String(date.getSeconds()).padStart(2, "0")}`,
      datetime: date.toLocaleString()
    };
  }

  function cleanMarkdown(markdown) {
    return markdown
      .replace(/\n{3,}/g, '\n\n')        // 移除多余空行
      .replace(/\n\s+\n/g, '\n\n')       // 清理包含空格的空行
      .replace(/```\s+```/g, '')        // 移除空代码块
      .replace(/\[copy\]/gi, '')        // 移除[copy]标记
      .replace(/<button>.*?<\/button>/g, '') // 移除所有按钮
      .replace(/运行|复制/g, '')        // 移除运行和复制文本
      .replace(/\\\|/g, '|')            // 修复表格中的竖线
      .replace(/^[\s\n]*$\n/gm, '')     // 移除仅包含空白字符的行
      .replace(/^(python|javascript|json)\n/gmi, '') // 移除代码块上方的语言标记
      .replace(/⭕|○/g, '')             // 移除圆圈标记
      .replace(/\n+$/g, '\n')           // 统一结尾换行符
      .trim();
  }

  function formatCodeBlock(content) {
    return content.replace(/```(\w+)?\n([\s\S]+?)```/g, (match, lang, code) => {
      code = code
        .replace(/<button>.*?<\/button>/g, '')
        .replace(/运行|复制/g, '')
        .replace(/^(python|javascript|json)\n/gmi, '')
        .replace(/⭕|○/g, '')
        .trim();

      return `\n\n\`\`\`${lang || ''}\n${code}\n\`\`\`\n\n`;
    });
  }


  function getConversationTitle() {
    const titleElement = document.querySelector('[class*="ChatTitle"]');
    return titleElement ? titleElement.textContent.trim() : 'Untitled Conversation';
  }

  function processMessage(element) {
    const messageRow = element.closest('[class*="Message_row"]');
    if (!messageRow) return null;

    // 判断人类消息还是AI消息
    const isHuman = messageRow.className.includes('Message_human');

    let content = html2md(element.innerHTML);
    content = formatCodeBlock(content);
    content = cleanMarkdown(content);

    if (content.trim()) {
      // 不再区分“Assistant”或“Bolt”，仅对“Human”进行标注
      const role = isHuman ? '**Human**' : '';
      return { role, content };
    }
    return null;
  }

  function getMarkdownContent() {
    const { datetime } = formatTimestamp();
    const title = getConversationTitle();
    const messages = Array.from(document.querySelectorAll('[class*="Markdown_markdownContainer"]'))
      .map(processMessage)
      .filter(message => message !== null);

    let markdown = `# ${title}\n\n`;
    markdown += `Date: ${datetime}\n\n`;
    messages.forEach(({ role, content }) => {
      // 如果 role 不为空，就输出加粗的 Human
      if (role) {
        markdown += `${role}\n\n${content}\n\n---\n\n`;
      } else {
        // AI 或其他消息不再单独区分角色
        markdown += `${content}\n\n---\n\n`;
      }
    });

    return cleanMarkdown(markdown);
  }

  function saveStringAsFile(content) {
    const { filename } = formatTimestamp();
    const blob = new Blob([content], { type: "text/markdown" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.md`;
    link.click();

    URL.revokeObjectURL(link.href);
  }

  console.log('Starting Poe2MD export...');
  const content = getMarkdownContent();
  console.log('Generated content:', content);
  saveStringAsFile(content);
});