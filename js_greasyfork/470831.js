// ==UserScript==
// @name         ChatGPT: Readability Styles for Engineers
// @namespace    zschuessler
// @version      1.0.3
// @description  Makes long, complicated, software-related chats much more readable.
// @author       zlschuessler@gmail.com
// @license      Unlicense
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chat.openai.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470831/ChatGPT%3A%20Readability%20Styles%20for%20Engineers.user.js
// @updateURL https://update.greasyfork.org/scripts/470831/ChatGPT%3A%20Readability%20Styles%20for%20Engineers.meta.js
// ==/UserScript==

(function () {
    let domSelectors = {
        messageContainers: 'article.text-token-text-primary',
        messageCodeBlocks: 'article.w-full > div pre',
        messageParagraphs: 'article.w-full > div p, article.w-full > div ul p, article.w-full > div ol p, article.w-full > div ol ul li'
    }

    create_style_node_for_css(`
    :root {
      --user-chat-width: 80vw;
    }

    .w-full .mx-auto {
      width: 100vw;
      max-width: 100%;
      padding: 0;
    }

    article .prose {
      width: 80vw;
      max-width: 100%;
      margin: 0 auto;
    }

    article .prose > * {
      max-width: 750px;
    }

    article.w-full .prose > pre {
      width: 80vw;
      overflow: auto;
      max-width: 100%;
    }


    /***
    *Individual message divs:
    * - Now full width
    * - Reduces padding
    * - Forces scrollbar for extra-big code blocks
    */
    ${domSelectors.messageContainers} {
        min-width: 100%;
        padding: 2em 0 3.5em 0;
        overflow: hidden;
        border-bottom: 1px dashed #b2b2b2;
    }

    /**
     * Message paragraphs
     * Puts a max width on paragraphs while keeping the container full width
     * This achieves a more readable paragraph width but still allows full width code blocks
     *
    ${domSelectors.messageParagraphs} {
       max-width: 750px;
       margin: 0 0 15px 0;
    }*/

    /**
     * Message Code Blocks
     * Scales code blocks to be 100%, but never more than 80vw.
     * This makes code blocks infinitely more readable on all viewports.
     *
     ${domSelectors.messageCodeBlocks} {
        width: 80vw;
        overflow: auto;
        max-width: 100%;
      }*/

    /**
     * Force scrollbars
     * Necessary for large code blocks that need to avoid line wrapping
     /
     .w-full {
       overflow: hidden;
     }

   `);
})();

// Simple helper function to create the style tag
function create_style_node_for_css(cssStr) {
    let styleTag = document.createElement('style');
    styleTag.textContent = cssStr;

    let styleTagContainer = document.getElementsByTagName('head')[0]
        || document.body
        || document.documentElement;

    styleTagContainer.appendChild(styleTag);
}
