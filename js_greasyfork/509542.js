// ==UserScript==
// @name         ChatGPT Export to Markdown (Enhanced with Data)
// @namespace    https://chatgpt.com
// @version      1.3
// @description  Export ChatGPT conversation to a Markdown file across multiple sites with correct content extraction.
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @match        https://*.chatgpt.com/*
// @require      https://cdn.jsdelivr.net/npm/@kudoai/chatgpt.js@3.2.0/dist/chatgpt.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509542/ChatGPT%20Export%20to%20Markdown%20%28Enhanced%20with%20Data%29.user.js
// @updateURL https://update.greasyfork.org/scripts/509542/ChatGPT%20Export%20to%20Markdown%20%28Enhanced%20with%20Data%29.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    // Ensure chatgpt.js is loaded
    await chatgpt.isLoaded();

    // Function to create and insert the export button
    const createExportButton = () => {
        // Check if the button already exists
        if (document.getElementById('export-to-markdown-btn')) {
            return;
        }

        // Create and style the export button
        const button = document.createElement('button');
        button.id = 'export-to-markdown-btn';
        button.innerHTML = 'Export to Markdown';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.padding = '10px';
        button.style.zIndex = '10000'; // High zIndex to ensure visibility
        button.style.backgroundColor = '#4CAF50';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        document.body.appendChild(button);

        console.log('Export button added.');

        // Button click handler to export conversation
        button.addEventListener('click', async () => {
            try {
                // Fetch the current conversation data
                const chatData = await chatgpt.getChatData("active", ["msg"], "both");
                const chatTitleData = await chatgpt.getChatData("active", "title");

                // Use the chat's title or a fallback
                const chatTitle = chatTitleData.title || 'ChatGPT_Conversation';
                const sanitizedTitle = chatTitle.replace(/[<>:"/\\|?*]+/g, ''); // Remove invalid filename characters

                // Convert the conversation data to a markdown format
                let markdownContent = `# ${chatTitle}\n\n`;
                chatData.forEach((msg, index) => {
                    markdownContent += `### Message ${index + 1}\n\n`;
                    markdownContent += `**User:**\n\n${msg.user}\n\n`;
                    markdownContent += `**ChatGPT:**\n\n${msg.chatgpt}\n\n---\n`;
                });

                // Create a Blob object from the markdown content
                const blob = new Blob([markdownContent], { type: 'text/markdown' });

                // Create a link element to download the markdown file
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `${sanitizedTitle}.md`;
                link.click();

                // Notify the user
                chatgpt.notify('✅ Exported to Markdown successfully!', 'topRight', 2);
            } catch (error) {
                chatgpt.notify('❌ Failed to export conversation!', 'topRight', 2);
                console.error('Export to Markdown failed:', error);
            }
        });
    };

    // MutationObserver to ensure button is always present
    const observer = new MutationObserver(() => {
        createExportButton(); // Ensure the button is recreated if it's removed
    });

    // Start observing changes in the body
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial delay before inserting the button to ensure the page is fully loaded
    setTimeout(createExportButton, 3000); // Delay by 3 seconds to ensure all dynamic content is loaded
})();
