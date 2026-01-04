// ==UserScript==
// @name            ArchForum Markdownunterstützung
// @name:en         ArchForum Markdown-support
// @version         0.1
// @description     Fügt einen Knopf im Archforum hinzu, um in MD geschribenen Text in Beiträgen in die dort notwendiege Syntax zu formatieren.
// @description:en  Add a button that converts Markdown copies to the syntax needed in the Archforum
// @author          Kilian
// @match           https://bbs.archlinux.org/*
// @license         GPLv3
// @namespace       greasyfork.org/users/1489391
// @downloadURL https://update.greasyfork.org/scripts/541119/ArchForum%20Markdownunterst%C3%BCtzung.user.js
// @updateURL https://update.greasyfork.org/scripts/541119/ArchForum%20Markdownunterst%C3%BCtzung.meta.js
// ==/UserScript==

(function() { 
    'use strict';

    // Function to convert Markdown to BBCode
    function convertMarkdownToBBCode(markdown) {
        // Save original code blocks
        const codeBlocks = [];
        const codeBlockPattern = /```([\s\S]*?)```/g;
        let codeBlockMatch;
        let markdownWithoutCodeBlocks = markdown;

        while ((codeBlockMatch = codeBlockPattern.exec(markdown)) !== null) {
            codeBlocks.push(codeBlockMatch[0]);
            markdownWithoutCodeBlocks = markdownWithoutCodeBlocks.replace(codeBlockMatch[0], `{{{CODE_BLOCK_${codeBlocks.length - 1}}}}`);
        }

        // Convert headers
        markdownWithoutCodeBlocks = markdownWithoutCodeBlocks.replace(/^#\s(.*)$/gm, '[size=200]$1[/size]');
        markdownWithoutCodeBlocks = markdownWithoutCodeBlocks.replace(/^##\s(.*)$/gm, '[size=150]$1[/size]');
        markdownWithoutCodeBlocks = markdownWithoutCodeBlocks.replace(/^###\s(.*)$/gm, '[size=120]$1[/size]');

        // Convert bold
        markdownWithoutCodeBlocks = markdownWithoutCodeBlocks.replace(/\*\*(.*?)\*\*/g, '[b]$1[/b]');

        // Convert italic
        markdownWithoutCodeBlocks = markdownWithoutCodeBlocks.replace(/\*(.*?)\*/g, '[i]$1[/i]');

        // Convert underline
        markdownWithoutCodeBlocks = markdownWithoutCodeBlocks.replace(/\_\_([^_]+)\_\_/g, '[u]$1[/u]');

        // Convert strikethrough
        markdownWithoutCodeBlocks = markdownWithoutCodeBlocks.replace(/\~\~([^~]+)\~\~/g, '[s]$1[/s]');

        // Convert links
        markdownWithoutCodeBlocks = markdownWithoutCodeBlocks.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '[url=$2]$1[/url]');

        // Convert images
        markdownWithoutCodeBlocks = markdownWithoutCodeBlocks.replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '[img]$2[/img]');

        // Convert inline code
        markdownWithoutCodeBlocks = markdownWithoutCodeBlocks.replace(/`([^`]+)`/g, '[code]$1[/code]');

        // Convert lists
        markdownWithoutCodeBlocks = markdownWithoutCodeBlocks.replace(/^\*\s(.*)$/gm, '[*] $1');

        // Convert quotes
        markdownWithoutCodeBlocks = markdownWithoutCodeBlocks.replace(/^\>\s(.*)$/gm, '[quote]$1[/quote]');

        // Convert color
        markdownWithoutCodeBlocks = markdownWithoutCodeBlocks.replace(/\[color=([^\]]+)\](.*?)\[\/color\]/g, '[color=$1]$2[/color]');

        // Convert center
        markdownWithoutCodeBlocks = markdownWithoutCodeBlocks.replace(/\[center\](.*?)\[\/center\]/g, '[center]$1[/center]');

        // Convert horizontal rule
        markdownWithoutCodeBlocks = markdownWithoutCodeBlocks.replace(/\[hr\]/g, '[hr]');

        // Convert subscript and superscript
        markdownWithoutCodeBlocks = markdownWithoutCodeBlocks.replace(/\[sub\](.*?)\[\/sub\]/g, '[sub]$1[/sub]');
        markdownWithoutCodeBlocks = markdownWithoutCodeBlocks.replace(/\[sup\](.*?)\[\/sup\]/g, '[sup]$1[/sup]');

        // Convert spoiler
        markdownWithoutCodeBlocks = markdownWithoutCodeBlocks.replace(/\[spoiler\](.*?)\[\/spoiler\]/g, '[spoiler]$1[/spoiler]');

        // Convert table
        markdownWithoutCodeBlocks = markdownWithoutCodeBlocks.replace(/\[table\](.*?)\[\/table\]/gs, '[table]$1[/table]');
        markdownWithoutCodeBlocks = markdownWithoutCodeBlocks.replace(/\[tr\](.*?)\[\/tr\]/g, '[tr]$1[/tr]');
        markdownWithoutCodeBlocks = markdownWithoutCodeBlocks.replace(/\[th\](.*?)\[\/th\]/g, '[th]$1[/th]');
        markdownWithoutCodeBlocks = markdownWithoutCodeBlocks.replace(/\[td\](.*?)\[\/td\]/g, '[td]$1[/td]');

        // Restore original code blocks
        for (let i = 0; i < codeBlocks.length; i++) {
            markdownWithoutCodeBlocks = markdownWithoutCodeBlocks.replace(`{{{CODE_BLOCK_${i}}}}`, `[code]${codeBlocks[i].replace(/```/g, '')}[/code]`);
        }

        return markdownWithoutCodeBlocks;
    }

    // Function to add the convert button
    function addConvertButton() {
        const textarea = document.querySelector('textarea[name="req_message"]');
        if (!textarea) return;

        const button = document.createElement('button');
        button.textContent = 'Convert Markdown to BBCode';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '1000';
        button.style.opacity = '0.7';
        button.style.backgroundColor = '#f0f0f0';
        button.style.color = '#000';
        button.style.border = '1px solid #ccc';
        button.style.borderRadius = '5px';
        button.style.padding = '5px 10px';
        button.style.cursor = 'pointer';

        button.addEventListener('mouseover', () => {
            button.style.opacity = '1';
        });

        button.addEventListener('mouseout', () => {
            button.style.opacity = '0.7';
        });

        button.addEventListener('click', () => {
            textarea.value = convertMarkdownToBBCode(textarea.value);
        });

        document.body.appendChild(button);
    }

    // Run the function to add the button
    addConvertButton();
})();
