// ==UserScript==
// @name         Fiverr - Inbox Enhancer + (Optimized)
// @namespace    https://www.fiverr.com/web_coder_nsd
// @description  Optimized version: Lightweight inbox enhancer with reduced memory usage, back to top, markdown conversion, chat features
// @version      7.5
// @author       Noushad Bhuiyan (Optimized by Claude)
// @icon         https://www.fiverr.com/favicon.ico
// @match        https://*.fiverr.com/inbox*
// @license      MIT
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/482121/Fiverr%20-%20Inbox%20Enhancer%20%2B%20%28Optimized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/482121/Fiverr%20-%20Inbox%20Enhancer%20%2B%20%28Optimized%29.meta.js
// ==/UserScript==


(function () {
    'use strict';

    /*
     FEATURES:
    // Removed: "search" feature
     • Add a "back to top" button
     • converts markdown type message to "unicode" formatted plain text
     • removes ordered message block (Seems like you already have an active order with ....)
     • removes annonying message warnings
     • adds clear all message button
     • ChatGPT search by user (might need another helper script)
     • Auto writes the name if you type {disp}
     • Show other conversation's last full message on tooltip
     • Copy Selected Conversations
     • copy conversations and create new chat in DeepSeek
     • translation converter widget
     • Advanced Quick Reply
     • Gemini API based AI reply generator
    */

    /* HOW TO USE GEMINI API */
    /* Get Gemini API Key:
     *   • Option 1 - Google AI Studio (for prototyping):
     *   1. Visit https://makersuite.google.com/app/apikey
     *   2. Click "Create API Key"
     *   3. Copy your API key
     *
     *   • Option 2 - Vertex AI (for production):
     *   1. Go to https://console.cloud.google.com/apis/credentials
     *   2. Create a new project or select existing
     *   3. Enable the Vertex AI API
     *   4. Click "Create Credentials" → "Service Account"
     *   5. Download JSON key file
     *
     *   Note:
     *   - For testing/prototyping, use Option 1
     *   - For production/enterprise, use Option 2
     *   - Check country availability at https://ai.google.dev/available_regions
     */
    /* HOW TO USE GEMINI API ENDS */

    var displayNameTriggerText = '{disp}'

    // ========== OPTIMIZATION: Inject CSS once for common styles ==========
    const STYLES = Object.freeze(`
        .scroll-top-btn, .select-msg-btn, .clear-button, .openWithChatGPTBtn, .openWithDeepseekBtn {
            contain: layout style;
        }
        #advanced-quick-reply button {
            contain: layout style;
        }
        .accordion-item {
            contain: layout style paint;
        }
        #translationConverter {
            contain: layout style;
        }
    `);
    const styleSheet = document.createElement('style');
    styleSheet.textContent = STYLES;
    document.head.appendChild(styleSheet);

    var selector = {
        msgWrapper: ".message-wrapper",
        msgBody: ".message-body",
        msgBody2: ".text",
        msgTimestamp: 'time',
        scrollContent: ".content",
        chatTopButtonSection: ".upper-row aside",
        processingReloadBtn: ".reloadBtn.processing",
        textArea: "textarea#send-message-text-area",
        termsError: ".terms-error",
        userName: ".flex-items-baseline span",
        orderMsgBlock: ".fiverr-message-wrapper .button-link.hover-green",
        detailsPane: '[data-testid="details-pane"]',
        msgHeader: ".header",
        msgContent: ".message-content",
        clientTime: 'header time'
    };

    // DOM SELECTORS - Update these when Fiverr changes their DOM structure
    const DOM_SELECTORS = {
        // Message containers - updated to handle both regular and reply messages
        MESSAGE_WRAPPER: ".message-wrapper",
        MESSAGE: ".message",
        MESSAGE_FLOW: ".message-flow",

        // Message content
        MESSAGE_CONTENT: ".message-content",
        HEADER: ".header",

        // Sender identification - more flexible selectors
        SENDER_NAME: "p:has(strong), .header p, div[class*='a17q9316s'] p",
        TIMESTAMP: "time",
        AVATAR_FIGURE: "figure[title]",

        // Message body - updated to handle nested structures
        MESSAGE_BODY: "p",
        MESSAGE_BODY_CONTAINER: "div[class*='a17q93kp']"
    };

    var API_ACTIONS = {
        "explainIt": `explainIt`,
        "buildReply": `buildReply`,
        "guessNextReply": `guessNextReply`
    }

    var svgLoading = `<svg version="1.1" id="L4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve" width="20px" height="20px" style="
    align-content: center;">
    <circle fill="#3aba6b" stroke="none" cx="6" cy="50" r="6">
    <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.1"></animate>
    </circle>
    <circle fill="#3aba6b" stroke="none" cx="26" cy="50" r="6">
    <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.2"></animate>
    </circle>
    <circle fill="#3aba6b" stroke="none" cx="46" cy="50" r="6">
    <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.3"></animate>
    </circle>
    </svg>`
    const advancedReplyBtns = {

        'Greet': `<svg width="20" height="20" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M92.0412 66.892C97.0035 62.7544 101.154 58.4936 104.227 54.1536C107.958 48.885 110 43.6389 110 38.4626C110 32.8753 108.36 27.6519 105.255 23.7705C101.841 19.5036 96.8747 17.0908 90.8191 17.0022C87.2496 16.9519 83.9682 17.7588 80.9937 19.2687C79.971 19.7878 79.0045 20.3791 78.1342 21.0757L73.5327 25.3052L69.5243 21.475C68.4658 20.6728 67.33 19.9514 66.1157 19.3305C63.1787 17.8285 59.9454 17.0026 56.4347 17.002C50.3121 17.0031 45.2932 19.4009 41.8464 23.708C39.4135 26.7481 37.876 30.6208 37.3189 34.8391C38.8826 35.3131 40.4044 35.929 41.878 36.6825C42.3784 36.9384 42.8706 37.2088 43.3545 37.4932C43.526 33.5883 44.7326 30.1044 46.7263 27.6131C49.0104 24.7587 52.254 23.2527 56.4358 23.252C58.8744 23.2524 61.1401 23.8058 63.2701 24.8951C64.8962 25.7267 66.3952 26.8436 67.7527 28.2199C68.0967 28.613 68.373 28.9225 68.6753 29.2549C68.7637 29.3521 68.8497 29.4461 68.9312 29.5347L73.4441 34.4446L78.0513 29.6231C78.1125 29.5591 78.1766 29.4915 78.2422 29.4215C78.4619 29.1877 78.6731 28.9564 78.9025 28.6961C79.1043 28.4635 79.2517 28.2897 79.416 28.0859C79.4386 28.0576 79.4608 28.0296 79.5506 27.9138L79.3255 28.1911L79.486 28.0046L79.2445 28.2695C79.2706 28.2425 79.2967 28.2156 79.3809 28.1296C80.7255 26.7643 82.2105 25.6601 83.8225 24.8418C85.9673 23.7532 88.2551 23.2167 90.731 23.2516C94.8784 23.3123 98.1063 24.8397 100.374 27.6747C102.524 30.362 103.75 34.186 103.75 38.4626C103.75 42.1107 102.249 46.1321 99.1264 50.5418C96.6864 53.9874 93.3477 57.5352 89.1658 61.1367C89.1664 61.2175 89.1667 61.2983 89.1667 61.3792C89.1667 64.3839 88.6494 67.3811 87.6442 70.3676C89.1376 69.2467 90.6079 68.0871 92.0412 66.892ZM46.4493 48.2219L51.0508 43.9924C51.9211 43.2958 52.8877 42.7044 53.9103 42.1853C56.8848 40.6755 60.1662 39.8686 63.7358 39.9189C69.7914 40.0075 74.758 42.4202 78.1713 46.6871C81.2763 50.5686 82.9167 55.792 82.9167 61.3792C82.9167 66.5556 80.8745 71.8017 77.1437 77.0703C74.0704 81.4103 69.9201 85.671 64.9579 89.8087C61.1267 93.0031 57.0313 95.9443 52.9363 98.5693C51.5029 99.4881 50.1708 100.303 48.9732 101.004C48.5521 101.251 48.1773 101.466 47.8529 101.649C47.6551 101.761 47.5162 101.838 47.4402 101.879L46.4533 102.417L45.4686 101.875C45.3927 101.833 45.2539 101.755 45.0563 101.643C44.7321 101.458 44.3574 101.241 43.9365 100.992C42.7393 100.285 41.4076 99.4637 39.9745 98.5384C35.8806 95.8949 31.7862 92.9384 27.9561 89.7341C22.9954 85.5838 18.8464 81.3206 15.7742 76.9906C12.0429 71.7318 10 66.5125 10 61.3792C10 55.7774 11.6472 50.5183 14.7631 46.6246C18.2099 42.3175 23.2287 39.9198 29.3513 39.9187C32.8621 39.9193 36.0953 40.7452 39.0324 42.2471C40.2466 42.8681 41.3825 43.5894 42.441 44.3917L46.4493 48.2219ZM36.1867 47.8117C34.0567 46.7225 31.7911 46.1691 29.3524 46.1687C25.1706 46.1694 21.9271 47.6754 19.6429 50.5297C17.4857 53.2255 16.25 57.0834 16.25 61.3792C16.25 64.979 17.7488 68.973 20.8714 73.3739C23.5286 77.1188 27.251 80.9953 31.9666 84.9405C35.4417 87.8479 39.2893 90.6562 43.3649 93.2878C44.4369 93.9801 45.4777 94.6292 46.4679 95.2248C47.4557 94.6355 48.4939 93.9931 49.5634 93.3075C53.6368 90.6964 57.4822 87.9044 60.9553 85.0084C65.6679 81.079 69.3877 77.2083 72.043 73.4584C75.1656 69.0487 76.6667 65.0274 76.6667 61.3792C76.6667 57.1027 75.4405 53.2786 73.2908 50.5913C71.0229 47.7564 67.795 46.229 63.6476 46.1683C61.1718 46.1334 58.884 46.6698 56.7392 47.7585C55.1272 48.5767 53.6422 49.6809 52.2976 51.0463C52.2134 51.1323 52.1872 51.1592 52.1612 51.1862L47.6645 46.8455L52.4027 50.9212L52.2422 51.1078L47.504 47.032L52.4673 50.8304C52.3774 50.9463 52.3553 50.9743 52.3327 51.0026C52.1684 51.2064 52.021 51.3802 51.8192 51.6128C51.5898 51.8731 51.3786 52.1043 51.1589 52.3382C51.0932 52.4081 51.0291 52.4758 50.968 52.5398L46.3608 57.3613L41.8478 52.4514C41.7663 52.3628 41.6804 52.2688 41.592 52.1716C41.2896 51.8391 41.0134 51.5297 40.6694 51.1366C39.3119 49.7603 37.8129 48.6433 36.1867 47.8117Z" fill="#3aba6b"/>
        <path d="M33.9447 73.8894C36.1233 73.8894 37.8894 72.1233 37.8894 69.9447C37.8894 67.7661 36.1233 66 33.9447 66C31.7661 66 30 67.7661 30 69.9447C30 72.1233 31.7661 73.8894 33.9447 73.8894Z" fill="#3aba6b"/>
        <path d="M60.2416 73.8894C62.4202 73.8894 64.1863 72.1233 64.1863 69.9447C64.1863 67.7661 62.4202 66 60.2416 66C58.063 66 56.2969 67.7661 56.2969 69.9447C56.2969 72.1233 58.063 73.8894 60.2416 73.8894Z" fill="#3aba6b"/>
        <path d="M47.0931 73.8894C49.2718 73.8894 51.0379 72.1233 51.0379 69.9447C51.0379 67.7661 49.2718 66 47.0931 66C44.9145 66 43.1484 67.7661 43.1484 69.9447C43.1484 72.1233 44.9145 73.8894 47.0931 73.8894Z" fill="#3aba6b"/>
        </svg>
        `,
        'No Time': `<svg width="20" height="20" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M86.1768 79.2303C88.4275 79.2303 90.2521 77.4058 90.2521 75.1551C90.2521 72.9044 88.4275 71.0798 86.1768 71.0798C83.9261 71.0798 82.1016 72.9044 82.1016 75.1551C82.1016 77.4058 83.9261 79.2303 86.1768 79.2303Z" fill="#3aba6b"/>
        <path d="M86.0996 65.0169C85.4288 65.0176 84.7836 64.7594 84.2985 64.2961C83.8134 63.8328 83.5258 63.2002 83.4956 62.5301L82.5733 43.254C82.5534 42.7701 82.6317 42.2872 82.8034 41.8344C82.9752 41.3816 83.2368 40.9683 83.5726 40.6193C83.9084 40.2703 84.3113 39.993 84.7572 39.8039C85.2031 39.6149 85.6826 39.5181 86.1669 39.5194C86.652 39.5195 87.1322 39.618 87.5782 39.809C88.0241 40.0001 88.4267 40.2796 88.7615 40.6308C89.0962 40.982 89.3562 41.3975 89.5257 41.8521C89.6951 42.3068 89.7706 42.7911 89.7474 43.2757L88.6906 62.5474C88.6562 63.2122 88.3685 63.8386 87.8866 64.2979C87.4047 64.7572 86.7653 65.0144 86.0996 65.0169Z" fill="#3aba6b"/>
        <path d="M88.9483 97.0112C89.8394 97.0112 90.5685 97.7371 90.5685 98.6314C90.5685 99.5258 90.5685 103.492 90.5685 103.492H29C29 103.492 29 99.5258 29 98.6314C29 97.7371 29.7259 97.0112 30.6202 97.0112H36.0318C36.3007 75.4363 50.3934 68.4823 50.3934 59.7623C50.3934 50.9968 36.0415 50.4136 35.9054 22.4809H30.6202C29.7259 22.4809 29 21.755 29 20.8607C29 19.9663 29 16 29 16H90.5685C90.5685 16 90.5685 19.9663 90.5685 20.8607C90.5685 21.755 89.8394 22.4809 88.9483 22.4809H83.9904C83.8543 50.4136 69.5024 50.9968 69.5024 59.7623C69.5024 68.4823 83.5983 75.4363 83.8673 97.0112H88.9483ZM65.0046 59.7623C65.0046 50.9612 79.3598 50.4136 79.4927 22.4809H40.4031C40.536 50.4136 54.8912 50.9612 54.8912 59.7623C54.8912 68.2231 40.792 75.3553 40.5263 97.0112H42.9825C43.5593 95.0896 45.4744 92.7792 48.7829 91.0682L53.083 88.8745C55.7855 87.4778 57.4058 86.5348 57.9437 86.0488C58.4816 85.5627 59.0908 84.4739 59.7713 82.7824C60.4874 84.4707 61.0999 85.5595 61.6184 86.0488C62.1368 86.5381 63.7376 87.4778 66.4272 88.8745L70.7046 91.0682C73.9936 92.7792 75.9023 95.0896 76.4693 97.0112H79.3663C79.1006 75.3553 65.0046 68.2231 65.0046 59.7623ZM61.6313 55.0053C61.2425 55.77 60.9152 57.225 60.6559 59.3702C60.5911 60.0183 60.4486 60.9936 60.2185 62.2931C59.9917 60.9936 59.8458 60.0183 59.781 59.3702C59.5185 57.225 59.1913 55.7733 58.7992 55.0053C58.4071 54.2438 57.3021 52.8731 55.4777 50.8867L51.4239 46.4537C48.6533 43.466 46.8776 41.3209 46.0966 40.0247C50.9054 43.0869 55.6008 44.6196 60.1828 44.6196C64.7648 44.6196 69.4764 43.0869 74.3177 40.0247C73.5076 41.3209 71.7253 43.466 68.9742 46.4537L64.9366 50.8867C63.1219 52.8731 62.0169 54.2438 61.6313 55.0053Z" fill="#3aba6b"/>
        </svg>
        `,
        'Checking': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 116.5 122.88" width="20" height="20">
        <defs>
        <style>
        .cls-1 {
            fill: #3aba6b;
            stroke: #3aba6b;
            stroke-width: 4px;
        }
        </style>
        </defs>
        <path class="cls-1" d="M17.88,22.75a2.19,2.19,0,0,1,3.05.6L22,24.66l3.84-4.87a2.2,2.2,0,1,1,3.4,2.78L23.6,29.66a2.74,2.74,0,0,1-.52.5A2.21,2.21,0,0,1,20,29.55L17.28,25.8a2.21,2.21,0,0,1,.6-3.05ZM81.13,59a27.86,27.86,0,0,1,23.31,43.1l12.06,13.14-8.31,7.6L96.56,110.09A27.86,27.86,0,1,1,81.13,59ZM38.47,71.54a3.07,3.07,0,0,1-2.9-3.17,3,3,0,0,1,2.9-3.17h9a3.07,3.07,0,0,1,2.9,3.17,3,3,0,0,1-2.9,3.17ZM93,44.89c-.56,2.11-5.31,2.43-6.38,0V7.43a1.06,1.06,0,0,0-.3-.76,1.08,1.08,0,0,0-.75-.3H7.39a1,1,0,0,0-1,1.06V95.74a1,1,0,0,0,1,1.05H37.72c3.21.34,3.3,5.88,0,6.38H7.43A7.48,7.48,0,0,1,0,95.74V7.43A7.3,7.3,0,0,1,2.19,2.19,7.35,7.35,0,0,1,7.43,0H85.6a7.32,7.32,0,0,1,5.24,2.19A7.39,7.39,0,0,1,93,7.43c0,36.56,0-18,0,37.46ZM38.44,27.47a3.07,3.07,0,0,1-2.91-3.17,3,3,0,0,1,2.91-3.17H68.21a3.07,3.07,0,0,1,2.91,3.17,3,3,0,0,1-2.91,3.17Zm0,22a3.06,3.06,0,0,1-2.91-3.16,3,3,0,0,1,2.91-3.17H68.21a3.07,3.07,0,0,1,2.91,3.17,3,3,0,0,1-2.91,3.16Zm32.19,40a3.4,3.4,0,0,1-.38-.49,3.71,3.71,0,0,1-.29-.56A3.54,3.54,0,0,1,75.05,84a2.78,2.78,0,0,1,.56.41l0,0c1,.93,1.28,1.12,2.36,2.08l.92.83,7.58-8.13c3.21-3.3,8.32,1.53,5.12,4.9L82.15,94.26l-.47.5a3.56,3.56,0,0,1-5,.22l0,0L76,94.28c-.58-.52-1.18-1-1.79-1.57-1.4-1.22-2.22-1.89-3.54-3.21ZM81.15,64.85A22.17,22.17,0,1,1,59,87,22.17,22.17,0,0,1,81.15,64.85ZM23.54,63.59a5.1,5.1,0,1,1-5.09,5.09,5.09,5.09,0,0,1,5.09-5.09ZM25.66,42a2.09,2.09,0,0,1,3,0,2.12,2.12,0,0,1,0,3l-2.07,2.13,2.07,2.13a2.1,2.1,0,0,1-3,3l-2.05-2.1-2.07,2.11a2.07,2.07,0,0,1-3,0,2.13,2.13,0,0,1,0-3l2.08-2.13L18.57,45a2.1,2.1,0,0,1,0-3,2.07,2.07,0,0,1,2.94,0l2.06,2.11L25.66,42Z"/></svg>`,
        'What do you need?': `<svg width="20" height="20" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M60 10C32.4051 10 10 32.4051 10 60C10 69.5282 12.6718 78.4308 17.3077 86.0103C17.4923 86.3026 17.5538 86.6205 17.5026 86.9333C16.7897 91.0615 15.1846 100.374 15.1846 100.374C14.9744 101.6 15.3692 102.851 16.2462 103.733C17.1231 104.621 18.3744 105.026 19.6 104.821C19.6 104.821 29.0513 103.262 33.2 102.59C33.5128 102.533 33.8205 102.595 34.0821 102.759C41.6667 107.359 50.5282 110 60 110C87.5949 110 110 87.5949 110 60C110 32.4051 87.5949 10 60 10ZM23.6821 96.3487C26.5487 95.8769 29.9026 95.3282 31.9538 94.9949C34.0923 94.641 36.2872 95.0769 38.1026 96.2C44.4923 100.077 51.9846 102.308 60 102.308C83.3487 102.308 102.308 83.3487 102.308 60C102.308 36.6513 83.3487 17.6923 60 17.6923C36.6513 17.6923 17.6923 36.6513 17.6923 60C17.6923 68.0564 19.9487 75.5846 23.8513 81.9641C25.0154 83.8308 25.4564 86.0615 25.0821 88.2359L23.6821 96.3487Z" fill="#3aba6b"/>
        <path d="M60.1783 80.5129C62.0674 80.5129 63.5988 78.9815 63.5988 77.0924C63.5988 75.2033 62.0674 73.6719 60.1783 73.6719C58.2892 73.6719 56.7578 75.2033 56.7578 77.0924C56.7578 78.9815 58.2892 80.5129 60.1783 80.5129Z" fill="#3aba6b"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M61.7474 58.2718C65.1628 57.5538 67.732 54.5128 67.732 50.882C67.732 46.7179 64.3525 43.3333 60.1833 43.3333C57.091 43.3333 54.4295 45.2 53.2602 47.8666C52.4089 49.8102 50.1423 50.6974 48.1936 49.8461C46.25 49 45.3628 46.7282 46.2141 44.7846C48.5679 39.4051 53.9371 35.641 60.1833 35.641C68.5936 35.641 75.4243 42.4718 75.4243 50.882C75.4243 57.9538 70.5987 63.9025 64.0654 65.6256C64.0397 66.0769 64.0295 66.4769 64.0295 66.7282C64.0295 66.7589 64.0295 66.7948 64.0295 66.8256C64.0295 66.882 64.0295 66.9333 64.0243 66.9846V67.0051C63.932 69.0461 62.2448 70.6718 60.1833 70.6718C58.0602 70.6718 56.3371 68.9487 56.3371 66.8256C56.3371 66.8 56.3371 66.7743 56.3371 66.7487C56.3371 66.4718 56.3525 65.441 56.4397 64.3795C56.5372 61.3487 58.7525 58.7948 61.7474 58.2718ZM61.7474 58.2718C61.7269 58.2769 61.7064 58.2769 61.691 58.282L61.8602 58.2513C61.8243 58.2564 61.7833 58.2666 61.7474 58.2718Z" fill="#3aba6b"/>
        </svg>
        `,
        "Let's Join": `<svg width="20" height="20" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 35H24.7833C34.3908 35 43.3906 39.6857 48.9 47.5556C51.6142 51.4331 55.2235 54.599 59.4218 56.7847C63.6201 58.9704 68.2836 60.1115 73.0167 60.1111H105.4" stroke="#3aba6b" stroke-width="10.0444" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M15 85.2223H24.7933C29.5236 85.2223 34.1841 84.081 38.3791 81.8952C42.5741 79.7094 46.1798 76.5436 48.89 72.6667C51.6001 68.7898 55.2058 65.624 59.4008 63.4382C63.5958 61.2524 68.2563 60.1111 72.9866 60.1111H100.378" stroke="#3aba6b" stroke-width="10.0444" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M90.3359 75.1778L105.403 60.1112L90.3359 45.0445" stroke="#3aba6b" stroke-width="10.0444" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        `,
        'Not Interested': `<svg viewBox="0 0 10 10" width="18" height="15" fill="#3aba6b" stroke="#3aba6b" stroke-width="2">
        <line x1="1" y1="1" x2="9" y2="9"></line>
        <line x1="9" y1="1" x2="1" y2="9"></line>
        </svg>`,
        'Explain it': `<svg xmlns="http://www.w3.org/2000/svg" fill="#3aba6b" width="20" height="20px" viewBox="0 0 16 16"> <g id="SVGRepo_bgCarrier" stroke-width="0"/> <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/> <g id="SVGRepo_iconCarrier"> <path style="fill: #3aba6b;"d="M12.52.55l-5,5h0L.55,12.51l3,3,12-12Zm-4,6,4-4,1,1-4,4.05ZM2.77,3.18A3.85,3.85,0,0,1,5.32,5.73h0A3.85,3.85,0,0,1,7.87,3.18h0A3.82,3.82,0,0,1,5.32.64h0A3.82,3.82,0,0,1,2.77,3.18ZM8.5,2.55h0A2,2,0,0,1,9.78,1.27h0A1.92,1.92,0,0,1,8.5,0h0A1.88,1.88,0,0,1,7.23,1.27h0A1.92,1.92,0,0,1,8.5,2.55Zm-6.36,0h0A1.92,1.92,0,0,1,3.41,1.27h0A1.88,1.88,0,0,1,2.14,0h0A1.92,1.92,0,0,1,.86,1.27h0A2,2,0,0,1,2.14,2.55ZM14.73,6.22h0a1.94,1.94,0,0,1-1.28,1.27h0a1.94,1.94,0,0,1,1.28,1.27h0A1.9,1.9,0,0,1,16,7.49h0A1.9,1.9,0,0,1,14.73,6.22Z"/> </g> </svg>`,
        'Build the reply': `<svg width="20" height="20" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style="fill:none;">
        <path d="M43.9084 41.4813L35.9844 49.4055L43.9084 57.3295" stroke="#3aba6b" stroke-width="5.94299" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M75.6094 41.4813L83.5334 49.4055L75.6094 57.3295" stroke="#3aba6b" stroke-width="5.94299" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M63.7131 40.1746L55.7891 58.6378" stroke="#3aba6b" stroke-width="5.94299" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M42.5 94.0002H40C20 94.0002 10 89.0002 10 64.0002V39C10 19 20 9 40 9H80C100 9 110 19 110 39V64.0002C110 84.0002 100 94.0002 80 94.0002H77.5C75.95 94.0002 74.45 94.7502 73.5 96.0002L66 106C62.7 110.4 57.3 110.4 54 106L46.4999 96.0002C45.6999 94.9002 43.9 94.0002 42.5 94.0002Z" stroke="#3aba6b" stroke-width="7.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        `,
        'Guess next reply': `<svg width="20" height="20" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M67.4922 15C78.7639 15 89.5739 19.4777 97.5442 27.448C105.515 35.4183 109.992 46.2283 109.992 57.5C109.992 68.7717 105.515 79.5817 97.5442 87.552C89.5739 95.5223 78.7639 100 67.4922 100H64.9922V104.95C64.9922 105.614 64.8614 106.271 64.6073 106.884C64.3532 107.497 63.9808 108.054 63.5113 108.523C63.0418 108.992 62.4845 109.364 61.8713 109.617C61.258 109.871 60.6008 110.001 59.9372 110C47.6372 109.99 35.1772 105.885 25.7222 97.48C16.1822 88.99 10.0022 76.375 9.99219 60.045V57.5C9.99219 46.2283 14.4699 35.4183 22.4402 27.448C30.4104 19.4777 41.2205 15 52.4922 15H67.4922ZM67.4922 25H52.4922C43.8727 25 35.6061 28.4241 29.5112 34.519C23.4163 40.614 19.9922 48.8805 19.9922 57.5L19.9972 60.825C20.1972 74.035 25.2022 83.635 32.3722 90.005C38.5622 95.515 46.5772 98.8 54.9922 99.725V95.05C54.9922 92.26 57.2522 90 60.0422 90H67.4922C76.1117 90 84.3782 86.5759 90.4732 80.481C96.5681 74.386 99.9922 66.1195 99.9922 57.5C99.9922 48.8805 96.5681 40.614 90.4732 34.519C84.3782 28.4241 76.1117 25 67.4922 25ZM42.4922 50C44.4813 50 46.389 50.7902 47.7955 52.1967C49.202 53.6032 49.9922 55.5109 49.9922 57.5C49.9922 59.4891 49.202 61.3968 47.7955 62.8033C46.389 64.2098 44.4813 65 42.4922 65C40.5031 65 38.5954 64.2098 37.1889 62.8033C35.7824 61.3968 34.9922 59.4891 34.9922 57.5C34.9922 55.5109 35.7824 53.6032 37.1889 52.1967C38.5954 50.7902 40.5031 50 42.4922 50ZM77.4922 50C79.4813 50 81.389 50.7902 82.7955 52.1967C84.202 53.6032 84.9922 55.5109 84.9922 57.5C84.9922 59.4891 84.202 61.3968 82.7955 62.8033C81.389 64.2098 79.4813 65 77.4922 65C75.5031 65 73.5954 64.2098 72.1889 62.8033C70.7824 61.3968 69.9922 59.4891 69.9922 57.5C69.9922 55.5109 70.7824 53.6032 72.1889 52.1967C73.5954 50.7902 75.5031 50 77.4922 50Z" fill="#3aba6b"/>
        </svg>
        `,


    };

    // ========== OPTIMIZATION: Pre-compiled regex patterns (created once, reused) ==========
    const REGEX_PATTERNS = {
        numberWithBold: /(\d+)\. (\*\*.*?\*\*)/g,
        header: /### (.*?)(\r\n|\r|\n|$)/g,
        bold: /\*\*(.*?)\*\*/g,
        bullet1: /^   - /gm,
        bullet2: /^    - /gm,
        bullet3: /^        - /gm,
        weHaveYourBack: /WE HAVE YOUR BACK/i,
        forAddedSafety: /For added safety/i,
        fiverrPro: /Fiverr Pro/i
    };

    // ========== OPTIMIZATION: DOM element cache to avoid repeated queries ==========
    const domCache = new Map();
    function getCachedElement(selector) {
        if (!domCache.has(selector)) {
            domCache.set(selector, document.querySelector(selector));
        }
        return domCache.get(selector);
    }
    function clearCache() { domCache.clear(); }

    // ========== OPTIMIZATION: Debounce for MutationObserver ==========
    let debounceTimer = null;
    function debouncedCallback(fn, delay = 100) {
        return function(...args) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    class GeminiClient {
        constructor() {
            this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
            this.primaryModel = 'gemini-2.0-flash';
            this.fallbackModel = 'gemini-2.5-flash';
        }

        async init() {
            let apiKey = localStorage.getItem('gemini_api_key');
            if (!apiKey) {
                apiKey = prompt('Please enter your Gemini API key:');
                if (!apiKey) {
                    throw new Error('API key is required');
                }
                localStorage.setItem('gemini_api_key', apiKey);
            }
            this.apiKey = apiKey;
        }

        async fetchFromModel(model, prompt) {
            const response = await fetch(`${this.baseUrl}/${model}:generateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });
            return response;
        }

        async generateContent(prompt) {
            if (!this.apiKey) {
                await this.init();
            }

            try {
                // Try primary model
                let response = await this.fetchFromModel(this.primaryModel, prompt);

                // If rate-limited, switch to fallback model
                if (response.status === 429) {
                    console.warn(`Rate limit on ${this.primaryModel}, switching to ${this.fallbackModel}...`);
                    response = await this.fetchFromModel(this.fallbackModel, prompt);
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                return data.candidates?.[0]?.content?.parts?.[0]?.text || '[No response text]';

            } catch (error) {
                console.error('Error calling Gemini API:', error);
                throw error;
            }
        }
    }


    // Modified version of your existing function
    async function callGeminiAPI(action, conversationText, command) {
        try {

            var prompt = conversationText
            var timeEls = document.querySelectorAll(selector.clientTime)
            var clinetCurrentTime = ''
            if (action == 'explainIt') {
                prompt += `\nThis is the last conversation with my client. Can you explain it to me in simple terms? I am just a programmer, so please make it as simple as possible. Now, explain it based on what I ask to you, follow the conversation context and help me : ${command}. you must return the response in JSON schema like this: {clientMood:"String", explanation:"String", suggestion:"String", whatToSay:"String"}`
            }
            if (action == 'buildReply') {
                clinetCurrentTime = timeEls[timeEls.length - 1].textContent
                prompt += `\nThis is the last conversation with my client. My name is Noushad, and do not mention the client name in response.  Now, generate me a reply what I can write next based on the above context and the command I will give you. for example if I give you command that "tell him I am busy" you may write a profound reply to professionally neglect the offer of the client saying I am busy in current schedule. Note: Give precise and supportive message in conversation style. do not reply it as a e-mail body style. make it as if you are sms texting with the client. Just send me the reply, no emojis. This is the current time of the client: ${clinetCurrentTime}, based on the current time, and the last section of the conversation, analyze the mood detection of the client + design a wish (if needed) and convincing/polite message. reply and tell the client properly in professional way, here's my command to you: ${command}`
            }
            if (action == 'guessNextReply') {
                clinetCurrentTime = timeEls[timeEls.length - 1].textContent
                prompt += `\nThis is the last conversation with my client. My name is Noushad, and do not mention the [client name] in response.  Now, give me a reply what I can write next based on the above context. Note: Give precise and supportive message in conversation style. do not reply it as a e-mail body style. make it as if you are sms texting with the client. Remember you are acting as me (a programmer who is trying to understand the client and help find out the solution). Just send me the next reply based on the current context , nothing extra, no emojis`

            }

            const gemini = new GeminiClient();

            const response = await gemini.generateContent(prompt);
            return response;
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'An error occurred while calling the API');
            throw error;
        }
    }

    // ========== OPTIMIZATION: Inline SVG icons (no external Font Awesome) ==========
    const ICONS = Object.freeze({
        checkSquare: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <path d="M9 11l3 3L22 4"></path>
        </svg>`,
        arrowCircleUp: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 8v8M8 12l4-4 4 4"></path>
        </svg>`,
        times: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>`
    });

    /* ----- SCROLL TO TOP CODE STARTS ----- */
    function addScrollToTopBtn() {
        const chatTopButtonSection = document.querySelector(selector.chatTopButtonSection);
        if (chatTopButtonSection) {
            var existingScrollTopBtn = document.querySelector(".scroll-top-btn");
            if (existingScrollTopBtn) existingScrollTopBtn.remove();

            const scrollTopButton = document.createElement("button");
            scrollTopButton.innerHTML = ICONS.arrowCircleUp;
            scrollTopButton.className = "scroll-top-btn";
            scrollTopButton.title = "Scroll to Top";
            scrollTopButton.addEventListener("click", toggleScrollToTop);

            chatTopButtonSection.appendChild(scrollTopButton);
        }
    }

    let scrolling = false;

    function toggleScrollToTop() {
        const scrollTopButton = document.querySelector(".scroll-top-btn");

        if (scrolling) {
            // Stop scrolling
            scrolling = false;
            scrollTopButton.classList.remove("active"); // Remove the "active" class
        } else {
            // Start scrolling
            scrolling = true;
            scrollTopButton.classList.add("active"); // Add the "active" class
            innerScroll();
        }

        function innerScroll() {
            const element = document.querySelector(selector.scrollContent);
            if (element && scrolling) {
                console.log('scrolling');
                element.scrollTo({ top: 0, behavior: "smooth" });

                // Check if the content includes the specific text
                if (element.textContent.includes("WE HAVE YOUR BACKFor added safety and your protection, keep payments and communications within Fiverr. Learn more")) {
                    console.log('done');
                    scrolling = false; // Set to false to stop further scrolling
                    scrollTopButton.classList.remove("active"); // Remove the "active" class
                }

                setTimeout(innerScroll, 1000);
            }
        }
    }
    /* ----- SCROLL TO TOP CODE ENDS ----- */


    // ========== OPTIMIZATION: Pre-allocated char mappings for markdown conversion ==========
    const CHAR_MAPPING = Object.freeze({
        'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝',
        'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧',
        'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭', 'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱',
        'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻',
        'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅',
        'y': '𝘆', 'z': '𝘇'
    });

    const CHAR_MAPPING_UNDERLINE = Object.freeze({
        'A': 'A͟', 'B': 'B͟', 'C': 'C͟', 'D': 'D͟', 'E': 'E͟', 'F': 'F͟', 'G': 'G͟', 'H': 'H͟', 'I': 'I͟', 'J': 'J͟',
        'K': 'K͟', 'L': 'L͟', 'M': 'M͟', 'N': 'N͟', 'O': 'O͟', 'P': 'P͟', 'Q': 'Q͟', 'R': 'R͟', 'S': 'S͟', 'T': 'T͟',
        'U': 'U͟', 'V': 'V͟', 'W': 'W͟', 'X': 'X͟', 'Y': 'Y͟', 'Z': 'Z͟', 'a': 'a͟', 'b': 'b͟', 'c': 'c͟', 'd': 'd͟',
        'e': 'e͟', 'f': 'f͟', 'g': 'g͟', 'h': 'h͟', 'i': 'i͟', 'j': 'j͟', 'k': 'k͟', 'l': 'l͟', 'm': 'm͟', 'n': 'n͟',
        'o': 'o͟', 'p': 'p͟', 'q': 'q͟', 'r': 'r͟', 's': 's͟', 't': 't͟', 'u': 'u͟', 'v': 'v͟', 'w': 'w͟', 'x': 'x͟',
        'y': 'y͟', 'z': 'z͟'
    });

    const NUMBER_FORMATTING = Object.freeze({
        '1': '⑴', '2': '⑵', '3': '⑶', '4': '⑷', '5': '⑸', '6': '⑹', '7': '⑺', '8': '⑻', '9': '⑼', '0': '⑽'
    });

    const NEGATIVE_TEXTS = Object.freeze([
        { original: "email", replacement: "e-mail" },
        { original: "emails", replacement: "e-mails" },
        { original: "Email", replacement: "E-mail" },
        { original: "Emails", replacement: "E-mails" },
        { original: "pay", replacement: "𝗉𝖺𝗒" },
        { original: "money", replacement: "𝗆𝗈𝗇𝖾𝗒" }
    ]);

    function convertMarkdownToUnicode(text) {
        // Format numbers using pre-compiled regex
        text = text.replace(REGEX_PATTERNS.numberWithBold, (_, number, txt) => {
            let formattedNumber = '';
            for (const digit of number) {
                formattedNumber += NUMBER_FORMATTING[digit];
            }
            return formattedNumber + '. ' + txt;
        });

        // Header conversion using pre-compiled regex
        text = text.replace(REGEX_PATTERNS.header, (_, header) => {
            for (const [sourceChar, targetChar] of Object.entries(CHAR_MAPPING_UNDERLINE)) {
                header = header.replace(new RegExp(sourceChar, 'g'), targetChar);
            }
            for (const [sourceChar, targetChar] of Object.entries(CHAR_MAPPING)) {
                header = header.replace(new RegExp(sourceChar, 'g'), targetChar);
            }
            return "❒ " + header + " ❱";
        });

        // Bold text conversion using pre-compiled regex
        text = text.replace(REGEX_PATTERNS.bold, (_, boldText) => {
            for (const [sourceChar, targetChar] of Object.entries(CHAR_MAPPING)) {
                boldText = boldText.replace(new RegExp(sourceChar, 'g'), targetChar);
            }
            return boldText;
        });

        // Convert hyphens to bullet points using pre-compiled regex
        text = text.replace(REGEX_PATTERNS.bullet1, "   ◉ ");
        text = text.replace(REGEX_PATTERNS.bullet2, "    • ");
        text = text.replace(REGEX_PATTERNS.bullet3, "        ‣ ");

        // Negative text replacements
        for (const { original, replacement } of NEGATIVE_TEXTS) {
            text = text.replace(new RegExp(`\\b${original}\\b`, 'g'), replacement);
        }

        return text;
    }


    function addMsgClearBtn() {
        var existingClrBtn = document.querySelector('.clear-button');
        if (!existingClrBtn) {
            // Create the button element
            const clearButton = document.createElement('button');
            clearButton.innerHTML = ICONS.times;
            clearButton.classList.add('clear-button');
            // Set the button's tooltip
            clearButton.title = 'Clear all text';
            // Find the #send-message-text-area element
            const textareaContainer = document.querySelector('#send-message-text-area');
            // Insert the button before the ##send-message-text-area
            if (textareaContainer) {
                textareaContainer.parentNode.insertBefore(clearButton, textareaContainer);
                textareaContainer.parentNode.style.alignItems = 'anchor-center'
                textareaContainer.parentNode.style.display = 'flex'
                textareaContainer.parentNode.style.flexDirection = 'row';
            }

            // Add click event to clear text in the specified textarea
            clearButton.addEventListener('click', function () {
                const textArea = document.querySelector(selector.textArea);
                if (textArea) {
                    setText("")
                }
            });
        }
    }

    // ========== OPTIMIZATION: Pre-defined reply actions (created once, reused) ==========
    const REPLY_ACTIONS = Object.freeze({
        'Greet': () => {
            setText('Welcome {disp}, thank you for reaching out!', true)
        },
        'No Time': () => {
            setText(' But I am sorry to say I am packed for the next couple of weeks.', false, true)
        },
        'Checking': () => {
            setText(' Let me check out your requirements and attachments for a moment, please!', false, true)
        },
        'What do you need?': () => {
            setText(' Could you please provide more details about what the requirement?', false, true)
        },
        "Let's Join": () => {
            setText(` Let's join here : https://remotedesktop.google.com/support/?lfhs=2

            1. Once you go to the link in the browser, you will see an icon of download. Click on it, it will install the program on your device.

            2. After installing, go to the page again, and you will see "Generate Code" button. If you click on it, it will give you an access code.

            3. Please share the access code with me to join you.`, false, true)
        },
        'Not Interested': () => {
            setText('I am sorry, I am not able to implement this.', false, true)
        },
        'Explain it': async () => {
            var userInput = prompt("Please enter your command:")
            if (!userInput) return
            var conversationText = conversationFormatter(false, false)
            function showResponsePopup(response) {
                const existingPopup = document.getElementById('response-popup');
                if (existingPopup) document.body.removeChild(existingPopup);
                const popup = document.createElement('div');
                popup.id = 'response-popup';
                popup.style.cssText = "overflow: scroll; height: 70vh;position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1000; background: white; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.3); border-radius: 8px";
                popup.innerHTML = `<h2>AI Response</h2>
                    <p><strong>Client Mood:</strong> ${response.clientMood || 'N/A'}</p>
                    <p><strong>Explanation:</strong> ${response.explanation || 'N/A'}</p>
                    <p><strong>Suggestion:</strong> ${response.suggestion || 'N/A'}</p>
                    <p><strong>What to Say:</strong> ${response.whatToSay || 'N/A'}</p>
                    <button id="closePopup">Close</button>`;
                document.body.appendChild(popup);
                document.getElementById('closePopup').addEventListener('click', () => document.body.removeChild(popup));
            }
            try {
                var reply = await callGeminiAPI(API_ACTIONS["explainIt"], conversationText, userInput)
                var start = reply.indexOf('{');
                var end = reply.lastIndexOf('}');
                var replyString = reply.substring(start, end + 1);
                showResponsePopup(JSON.parse(replyString));
            } catch (error) {
                setText(reply, false, false)
                showResponsePopup({ clientMood: 'N/A', explanation: reply, suggestion: reply, whatToSay: 'N/A' });
            }
        },
        'Build the reply': async () => {
            var userInput = prompt("Please enter your command:")
            if (!userInput) return
            var conversationText = conversationFormatter(false, false)
            var reply = await callGeminiAPI(API_ACTIONS["buildReply"], conversationText, userInput)
            setText(reply, false, false)
        },
        'Guess next reply': async () => {
            var conversationText = conversationFormatter(false, false)
            var nextReply = await callGeminiAPI(API_ACTIONS["guessNextReply"], conversationText, "")
            setText(nextReply, false, false)
        }
    });

    function addAdvancedQuickReplySection() {
        const offerButton = document.querySelector('[data-testid="create-custom-offer-button"]');
        const actionBar = offerButton?.closest('div');

        var existingDiv = document.querySelector('#advanced-quick-reply')
        if (actionBar && !existingDiv) {
            const newDiv = document.createElement('div');
            newDiv.id = 'advanced-quick-reply';
            newDiv.style.cssText = 'display:flex;gap:10px;border:2px solid rgb(0 5 30 / 6%);border-radius:12px;padding:5px;align-items:center;';

            // ========== OPTIMIZATION: Event delegation for all buttons ==========
            // Single listener instead of individual listeners per button
            newDiv.addEventListener('click', async (e) => {
                const btn = e.target.closest('button[data-action]');
                if (!btn) return;

                const action = btn.dataset.action;
                const svg = btn.dataset.svg;

                // Async actions with loading state
                if (action === "Guess next reply" || action === "Build the reply" || action === 'Explain it') {
                    btn.style.backgroundColor = 'transparent';
                    btn.innerHTML = svgLoading;
                    btn.disabled = true;
                    btn.classList.add('disabled-btn');

                    try {
                        await REPLY_ACTIONS[action]();
                    } finally {
                        btn.disabled = false;
                        btn.classList.remove('disabled-btn');
                        btn.innerHTML = svg;
                    }
                } else {
                    // Sync actions
                    REPLY_ACTIONS[action]();
                }
            });

            // ========== OPTIMIZATION: DocumentFragment for bulk insert (single reflow) ==========
            const fragment = document.createDocumentFragment();
            Object.entries(advancedReplyBtns).forEach(([key, svg]) => {
                const btn = document.createElement('button');
                btn.dataset.action = key;
                btn.dataset.svg = svg;
                btn.style.cssText = 'border-radius:5px;margin:0;padding:0;display:inherit;';
                btn.innerHTML = svg;

                // Hover effect for background
                btn.addEventListener('mouseover', () => {
                    if (!btn.disabled) {
                        btn.style.backgroundColor = '#4e536e5e';
                        btn.title = key;
                    }
                });

                btn.addEventListener('mouseout', () => {
                    btn.style.backgroundColor = 'transparent';
                });

                fragment.appendChild(btn);
            });
            newDiv.appendChild(fragment);

            actionBar.insertBefore(newDiv, actionBar.children[0]);
        }
    }

    function setText(text, removePrevValue = true, addEnter = false) {
        let input = document.querySelector(selector.textArea);
        if (!input) return;
        let lastValue = input.value;

        // Clear the previous value if removePrevValue is true
        if (removePrevValue) {
            input.value = '';
        }

        input.value += text; // Append the new text
        let event = new Event('input', { bubbles: true });
        // hack React15
        event.simulated = true;
        // hack React16 内部定义了descriptor拦截value，此处重置状态
        let tracker = input._valueTracker;
        if (tracker) {
            tracker.setValue(lastValue);
        }
        input.dispatchEvent(event);
        if (addEnter) {
            input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
        }
    }

    function showOtherMsgTooltip() {
        var contacts = document.querySelectorAll(".contact")
        const contactExcerpts = document.querySelectorAll(".contact-excerpt span");
        contacts.forEach(function (contact) {
            var open_url_div = contact.querySelector("#open_url")
            if (!open_url_div) {
                var username = contact.querySelector("figure").title;
                var url = "/inbox/" + username;
                //var asideDiv = contact.querySelector(".aside-area");
                var asideDiv = contact.querySelector("aside");
                var link = document.createElement("a");
                link.setAttribute("id", "open_url");
                link.setAttribute("href", url);
                link.style = "margin:0px;padding: 0 3px;display: flex;"
                link.setAttribute("target", "_blank"); // Open link in new tab
                var icon = document.createElement("img");
                icon.setAttribute("src", "https://cdn-icons-png.flaticon.com/16/12690/12690112.png");
                icon.setAttribute("height", "18px")
                link.appendChild(icon); // Append the image to the link
                asideDiv.appendChild(link);
            }
        });
        contactExcerpts.forEach(function (contactExcerpt) {
            const textContent = contactExcerpt.innerText;
            contactExcerpt.setAttribute('title', textContent);
        });
    }

    function createGPTConv() {
        const prevBtn = document.querySelector('.createGPTconvBtn');
        if (prevBtn) prevBtn.remove()
        const customBtnArea = document.querySelector('[data-testid="details-pane"] .custom-btn-area');
        const button = customBtnArea.appendChild(document.createElement('button'));
        button.className = "createGPTconvBtn"
        const image = button.appendChild(document.createElement('img'));
        image.src = 'https://cdn-icons-png.flaticon.com/512/7512/7512915.png';
        image.alt = 'Create Conversation Icon';
        button.title = 'Create New Conversation in DeepSeek';
        button.addEventListener('click', () => { conversationFormatter(true) });
    }

    function createOpenInChatGPTBtn() {
        const prevBtn = document.querySelector('.openWithDeepseekBtn');
        if (prevBtn) prevBtn.remove()
        const customBtnArea = document.querySelector('[data-testid="details-pane"] .custom-btn-area');
        const button = customBtnArea.appendChild(document.createElement('button'));
        button.className = "openWithDeepseekBtn"
        const image = button.appendChild(document.createElement('img'));
        image.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/DeepSeek-icon.svg/1200px-DeepSeek-icon.svg.png';
        image.alt = 'Deepseek Icon';
        button.title = 'Open Conversation in Deepseek';
        button.addEventListener('click', () => window.open(`https://chat.deepseek.com?search=${window.location.pathname.split('/').pop()}`, '_blank'));
    }

    // ========== OPTIMIZATION: Lazy-load translation iframe (only loads when clicked) ==========
    let translationIframeLoaded = false;

    async function addTranslationIframe() {
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Check if already exists
        if (document.getElementById('translationConverter')) {
            console.log('Translation converter already exists.');
            return;
        }

        const detailsPane = document.querySelector('[data-testid="details-pane"]');
        if (!detailsPane) return;

        // Create a collapsible widget placeholder (no iframe loaded yet)
        const translationWidget = document.createElement('div');
        translationWidget.id = 'translationConverter';
        translationWidget.style.cssText = 'margin-top: 20px; width: -webkit-fill-available; margin-left: 0; margin-right: 0; padding: 0;';

        // Create header with click-to-expand
        const header = document.createElement('div');
        header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #f0f0f0; border-radius: 8px 8px 0 0; cursor: pointer;';
        const title = document.createElement('h6');
        title.style.cssText = 'margin: 0;';
        title.textContent = 'Translation Widget';
        const toggleIcon = document.createElement('span');
        toggleIcon.className = 'toggle-icon';
        toggleIcon.style.cssText = 'font-size: 12px;';
        toggleIcon.textContent = '▼ Click to expand';
        header.appendChild(title);
        header.appendChild(toggleIcon);

        // Create content container (initially hidden/collapsed)
        const content = document.createElement('div');
        content.id = 'translation-content';
        content.style.cssText = 'display: none; padding: 10px; border: 1px solid #ccc; border-top: none; border-radius: 0 0 8px 8px; min-height: 400px;';
        const placeholder = document.createElement('p');
        placeholder.style.cssText = 'text-align: center; color: #666;';
        placeholder.textContent = 'Click above to load translator';
        content.appendChild(placeholder);

        // Toggle visibility on click
        header.addEventListener('click', async () => {
            const isHidden = content.style.display === 'none';
            content.style.display = isHidden ? 'block' : 'none';
            header.querySelector('.toggle-icon').textContent = isHidden ? '▲ Click to collapse' : '▼ Click to expand';

            // Load iframe only on first expand
            if (isHidden && !translationIframeLoaded) {
                translationIframeLoaded = true;
                content.textContent = ''; // Clear placeholder
                const iframe = document.createElement('iframe');
                iframe.id = 'translation-iframe';
                iframe.src = 'https://noushadbug.github.io/translator-interface-web/';
                iframe.style.cssText = 'padding: 0; border: none; border-radius: 8px; height: 400px; width: 100%;';
                content.appendChild(iframe);
            }
        });

        translationWidget.appendChild(header);
        translationWidget.appendChild(content);
        detailsPane.appendChild(translationWidget);
    }

    function addTopButtons() {
        addScrollToTopBtn();
    }

    function addDetailsPaneButtons() {
        //adding the button div first
        const detailsPane = document.querySelector(selector.detailsPane);
        if (detailsPane) {
            var existingDiv = detailsPane.querySelector(".custom-btn-area")
            if (existingDiv) existingDiv.remove()
            const customBtnArea = document.createElement('div');
            customBtnArea.classList.add('custom-btn-area');
            customBtnArea.id = "custom-btn-area"
            customBtnArea.style.display = 'flex';
            customBtnArea.style.justifyContent = 'center';

            // Insert custom-btn-area before translationConverter if it exists
            const translationConverter = document.getElementById('translationConverter');
            if (translationConverter) {
                detailsPane.insertBefore(customBtnArea, translationConverter);
            } else {
                detailsPane.appendChild(customBtnArea);
            }

            createOpenInChatGPTBtn();
            createGPTConv()
            addTranslationIframe()
        }
    }

    function conversationFormatter(isChatGPTRedirect = true) {
        let conversationText = '';
        let wrappers = [];
        let url = '';

        // Get all messages from the conversation
        const messageFlow = document.querySelector(DOM_SELECTORS.MESSAGE_FLOW);
        if (messageFlow) {
            // Get all message elements from the flow
            wrappers = Array.from(messageFlow.querySelectorAll(DOM_SELECTORS.MESSAGE));
            // Also check for any message-wrapper elements that might not have the .message class
            const additionalWrappers = Array.from(messageFlow.querySelectorAll(DOM_SELECTORS.MESSAGE_WRAPPER))
                .filter(w => !wrappers.includes(w));
            wrappers = wrappers.concat(additionalWrappers);
        }
        url = `https://chat.deepseek.com/?createChat=${window.location.pathname.split('/').pop()}`;

        wrappers.forEach(wrapper => {
            let messageBody = '';
            let originalMessage = ''; // Store original message being replied to
            let senderText = 'Unknown';
            let isMe = false;
            let isReply = false;

            // Method 1: Try to extract sender from the message content area
            const messageContent = wrapper.querySelector(DOM_SELECTORS.MESSAGE_CONTENT);
            if (messageContent) {
                // Try multiple selector patterns for sender name
                const senderSelectors = [
                    DOM_SELECTORS.SENDER_NAME,
                    ".header p",
                    "div[class*='a17q9316s'] p",
                    "div[class*='a17q9316t'] p",
                    "p:has(strong)"
                ];

                for (const selector of senderSelectors) {
                    const senderEl = messageContent.querySelector(selector);
                    if (senderEl && senderEl.textContent.trim()) {
                        senderText = senderEl.textContent.trim();
                        break;
                    }
                }

                // Check if this is a reply message by looking for the "Replied" text
                const repliedIndicator = Array.from(messageContent.querySelectorAll("p")).find(p =>
                    p.textContent.trim() === "Replied"
                );

                if (repliedIndicator) {
                    isReply = true;

                    // Extract the original message being replied to
                    // Look for the container with the original message content based on the HTML structure provided
                    // The original message is in the nested structure: div[role='button'] > div > div > p (the last p element)
                    const buttonContainer = messageContent.querySelector("div[role='button']");
                    if (buttonContainer) {
                        // Navigate to the specific container that holds the original message
                        const originalMessageContainer = buttonContainer.querySelector("div.a17q9316n.a17q930.a17q93109.a17q93177.a17q93190.a17q931b8");
                        if (originalMessageContainer) {
                            // Get the last p element which contains the actual message content
                            const messageParagraphs = originalMessageContainer.querySelectorAll("p");
                            if (messageParagraphs.length > 0) {
                                // The actual message is typically in the last p element or the one with substantial content
                                const messageTexts = Array.from(messageParagraphs)
                                    .map(p => p.textContent.trim())
                                    .filter(text => {
                                        // Filter out common metadata and names
                                        if (!text || text.length <= 5) return false;
                                        if (text.includes("Replied")) return false;

                                        // Filter out timestamps and names
                                        if (/\b(AM|PM)\b/.test(text)) return false;
                                        if (/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/.test(text)) return false;
                                        if (/^\w{1,2}\s*$/.test(text)) return false;

                                        // Filter out names (2-3 words, no substantive content)
                                        const namePattern = /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2}$/;
                                        if (namePattern.test(text)) return false;

                                        // Check if text contains actual message content
                                        const messageIndicators = /[.!?]|\b(how|what|when|where|why|who|can|could|would|should|is|are|was|were|have|has|will|would|please|thank|hi|hello|hey|yes|no|ok|okay|sure|well|so|but|and|or|if|then|because|since|although|however|therefore)\b/i;

                                        return messageIndicators.test(text) || text.length > 20;
                                    });

                                // Join the filtered texts or take the last one if no filtering results
                                originalMessage = messageTexts.length > 0
                                    ? messageTexts.join(' ').trim()
                                    : Array.from(messageParagraphs).pop().textContent.trim();
                            }
                        }

                        // Fallback: Try the broader approach if the specific selector fails
                        if (!originalMessage) {
                            const messageContentElements = buttonContainer.querySelectorAll("p");
                            const contentTexts = Array.from(messageContentElements)
                                .map(p => p.textContent.trim())
                                .filter(text => {
                                    // Apply same filtering logic
                                    if (!text || text.length <= 5) return false;
                                    if (text.includes("Replied")) return false;
                                    if (/\b(AM|PM)\b/.test(text)) return false;
                                    if (/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/.test(text)) return false;
                                    if (/^\w{1,2}\s*$/.test(text)) return false;
                                    const namePattern = /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2}$/;
                                    if (namePattern.test(text)) return false;
                                    const messageIndicators = /[.!?]|\b(how|what|when|where|why|who|can|could|would|should|is|are|was|were|have|has|will|would|please|thank|hi|hello|hey|yes|no|ok|okay|sure|well|so|but|and|or|if|then|because|since|although|however|therefore)\b/i;
                                    return messageIndicators.test(text) || text.length > 20;
                                });
                            originalMessage = contentTexts.join(' ').trim();
                        }
                    }

                    // Fallback: Look for the message content in the a17q93d container
                    if (!originalMessage) {
                        const msgContainer = messageContent.querySelector("div[class*='a17q93d'] p");
                        if (msgContainer) {
                            const texts = Array.from(msgContainer.querySelectorAll("p"))
                                .map(p => p.textContent.trim())
                                .filter(text => {
                                    // Apply same filtering logic as above
                                    if (!text || text.length <= 5) return false;
                                    if (text.includes("Replied")) return false;

                                    // Filter out timestamps
                                    if (/\b(AM|PM)\b/.test(text)) return false;
                                    if (/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/.test(text)) return false;

                                    // Filter out single or two character text
                                    if (/^\w{1,2}\s*$/.test(text)) return false;

                                    // Filter out names (2-3 words, no substantive content)
                                    const namePattern = /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2}$/;
                                    if (namePattern.test(text)) return false;

                                    // Filter out name patterns that might include middle initials
                                    if (/^[A-Z][a-z]+\s+[A-Z]\.?\s+[A-Z][a-z]+/.test(text)) return false;

                                    // Check if text contains actual message content
                                    const messageIndicators = /[.!?]|\b(how|what|when|where|why|who|can|could|would|should|is|are|was|were|have|has|will|would|please|thank|hi|hello|hey|yes|no|ok|okay|sure|well|so|but|and|or|if|then|because|since|although|however|therefore)\b/i;

                                    return messageIndicators.test(text) || text.length > 20;
                                });
                            originalMessage = texts.join(' ').trim();
                        }
                    }

                    // Extract the actual reply message from a17q93kp container
                    const replyContainer = messageContent.querySelector("div[class*='a17q93kp'] p");
                    if (replyContainer) {
                        messageBody = replyContainer.textContent.trim();
                    }
                } else {
                    // Also check for other reply structures
                    const replyIndicators = [
                        messageContent.querySelector("div[class*='a17q93xw']"),
                        messageContent.querySelector(".quote"),
                        messageContent.querySelector("[class*='reply']"),
                        messageContent.querySelector("[class*='quoted']")
                    ];

                    if (replyIndicators.some(indicator => indicator)) {
                        isReply = true;

                        // Try to extract the original message being replied to
                        const quotedContainers = [
                            messageContent.querySelector("div[class*='a17q93xw']"),
                            messageContent.querySelector("div[class*='a17q93y']"),
                            messageContent.querySelector(".original-message"),
                            messageContent.querySelector("[class*='original']")
                        ];

                        for (const container of quotedContainers) {
                            if (container) {
                                const quotedText = container.textContent.trim();
                                if (quotedText && quotedText.length > 10) {
                                    originalMessage = quotedText;
                                    break;
                                }
                            }
                        }
                    }
                }

                // Extract message body from multiple possible containers (only if not already extracted)
                if (!messageBody && !isReply) {
                    const bodyContainers = [
                        messageContent.querySelector(DOM_SELECTORS.MESSAGE_BODY_CONTAINER),
                        messageContent.querySelector("div[class*='a17q93kp']"),
                        messageContent.querySelector("div[class*='a17q93c']"),
                        messageContent
                    ];

                    for (const container of bodyContainers) {
                        if (container) {
                            // Get all p elements and filter out non-content ones
                            const pList = container.querySelectorAll(DOM_SELECTORS.MESSAGE_BODY);
                            const contentParagraphs = Array.from(pList).filter(p => {
                                const text = p.textContent.trim();
                                // Filter out system messages and timestamps
                                return text &&
                                       !text.includes('WE HAVE YOUR BACK') &&
                                       !text.includes('For added safety') &&
                                       !text.includes('This message relates to') &&
                                       !text.includes('Fiverr Pro') &&
                                       !/^[A-Z]{1,2}\s*$/.test(text) && // Filter out single letters (avatars)
                                       !p.closest("div[class*='a17q93xw']"); // Skip quoted content in main body
                            });

                            if (contentParagraphs.length > 0) {
                                messageBody = contentParagraphs
                                    .map(p => p.textContent.trim())
                                    .join(' ')
                                    .trim();
                                break;
                            }
                        }
                    }
                }
            }

            // Method 2: If no content found, try alternative extraction
            if (!messageBody) {
                const allParagraphs = wrapper.querySelectorAll("p");
                const textContents = Array.from(allParagraphs)
                    .map(p => p.textContent.trim())
                    .filter(text => text &&
                                   text.length > 5 && // Skip very short texts
                                   !text.includes('WE HAVE YOUR BACK') &&
                                   !text.includes('For added safety') &&
                                   !text.includes('This message relates to') &&
                                   !text.includes('Fiverr Pro') &&
                                   !/^[A-Z]{1,2}\s*$/.test(text));

                messageBody = textContents.join(' ').trim();
            }

            // Determine if it's from "Me" or "Client"
            isMe = senderText === 'Me' ||
                   wrapper.querySelector("figure[title*='web_coder_nsd']") ||
                   wrapper.textContent.includes('Me:');

            if (messageBody) {
                if (isReply && originalMessage) {
                    // Format as reply with original message
                    conversationText += isMe
                        ? `Me: REPLIED TO "${originalMessage.substring(0, 100)}${originalMessage.length > 100 ? '...' : ''}"\n       > ${messageBody}\n\n`
                        : `Client: REPLIED TO "${originalMessage.substring(0, 100)}${originalMessage.length > 100 ? '...' : ''}"\n       > ${messageBody}\n\n`;
                } else {
                    // Regular message
                    conversationText += isMe ? `Me: ${messageBody}\n\n` : `Client: ${messageBody}\n\n`;
                }
            }
        });

        GM_setClipboard(conversationText, 'text');

        if (isChatGPTRedirect) {
            window.open(url, '_blank');
        } else {
            return conversationText;
        }
    }


    function updateTabTitle() {
        // Get username from the last part of the URL
        const pathParts = window.location.pathname.split('/');
        const username = pathParts[pathParts.length - 1];

        if (username && username.trim()) {
            document.title = `${username} | Inbox`;
        } else {
            // Fallback to inbox if username not found
            document.title = 'inbox';
        }
    }

    function displayNamePlacer() {
        // Get the textarea and user name elements using the provided selectors
        const textarea = document.querySelector(selector.textArea);
        const userNameElement = document.querySelector(selector.userName);

        // Check if the elements are found
        if (textarea && userNameElement) {
            // Check if the trigger text is present in the textarea value
            if (textarea.value.includes(displayNameTriggerText) || textarea.value.toLowerCase().includes('[client name]')) {
                // Replace the trigger text with the user name
                const newText = textarea.value.replace(displayNameTriggerText, userNameElement.innerText).replace('[client name]', userNameElement.innerText).replace('[Client name]', userNameElement.innerText);
                // Update the textarea value
                setText(newText)
            }
        }
    }

    // ...existing code...

    function createAccordion(element, title) {
        // Check if the element already has the accordion class
        if (element.classList.contains("accordion")) {
            return;
        }
        element.classList.add("accordion")
        element.classList.add("p-0")
        // Create the accordion HTML structure
        const accordionHTML = `
        <div class="accordion-item">
        <div class="accordion-item-header">
        <span class="accordion-item-header-title">${title}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down accordion-item-header-icon">
        <path d="m6 9 6 6 6-6" />
        </svg>
        </div>
        <div class="accordion-item-description-wrapper">
        <div class="accordion-item-description">
        <hr>
        ${element.innerHTML}
        </div>
        </div>
        </div>
        `;

        // Replace the content of the element with the accordion HTML
        element.innerHTML = accordionHTML;

        // Get the newly created accordion item
        const accordionItem = element.querySelector('.accordion-item');

        // Add click event listener to toggle the accordion
        const accordionHeader = accordionItem.querySelector('.accordion-item-header');
        accordionHeader.addEventListener("click", () => {
            accordionItem.classList.toggle("open");
        });
    }


    // ========== OPTIMIZATION: Flags to prevent redundant processing ==========
    const processedElements = new WeakSet();

    // Observe mutations in the inbox
    const inboxObserverCallback = function (mutations) {
        // Early exit if no relevant mutations
        let hasRelevantMutation = false;
        for (const mutation of mutations) {
            if (mutation.target.id === "send-message-text-area" ||
                mutation.target.classList?.contains("layout_service") ||
                mutation.target.querySelector?.('[data-testid="buyer-analytics"]')) {
                hasRelevantMutation = true;
                break;
            }
        }
        if (!hasRelevantMutation) return;

        for (const mutation of mutations) {
            // Optimized: Use cached element queries and early exits
            var sellerPlusSection = document.querySelector('[data-testid="buyer-analytics"]');
            if (sellerPlusSection && !sellerPlusSection.querySelector('.accordion-item')) {
                createAccordion(sellerPlusSection, "Seller Plus Details");
            }

            const orderCardElement = document.querySelector('[role="order-card"]');
            if (orderCardElement && !orderCardElement.querySelector('.accordion-item')) {
                const div = orderCardElement.closest(".w7m89t0");
                if (div && !processedElements.has(div)) {
                    createAccordion(div, "Order History");
                    processedElements.add(div);

                    const userCardElement = document.querySelector(".MYCOWEK");
                    if (userCardElement && !processedElements.has(userCardElement)) {
                        createAccordion(userCardElement, "User Details");
                        processedElements.add(userCardElement);
                    }
                }
            }

            const buyerPane = document.querySelector('[data-testid="buyer-analytics"]')
            if (buyerPane && !processedElements.has(buyerPane)) {
                if (!buyerPane.textContent.includes("Metrics below reflect past orders with public reviews, except where noted.")) {
                    buyerPane.remove();
                } else {
                    processedElements.add(buyerPane);
                }
            }

            if (mutation.target.id == "send-message-text-area") {
                // removing terms-error/warning texts which is annonying
                var termsError = document.querySelector(selector.termsError)
                if (termsError) termsError.style.display = 'none';
                // replacing markdown format to unicode
                displayNamePlacer()
                const textArea = document.querySelector(selector.textArea);
                if (!textArea) return;
                var rawValue = textArea.value;
                var markedDownValue = convertMarkdownToUnicode(rawValue);

                if (rawValue !== markedDownValue) {
                    setText(markedDownValue);
                } else {
                    textArea.value = markedDownValue;
                }
            }

            if (mutation.type === 'childList' && mutation.target.classList.contains("layout_service")) {
                // removing oredered message block
                const orderMsgEl = document.querySelector(selector.orderMsgBlock);
                if (orderMsgEl) {
                    orderMsgEl.click();
                }

                // Update tab title with username
                updateTabTitle();

                showOtherMsgTooltip();
                const textArea = document.querySelector(selector.textArea);
                if (textArea && !textArea.hasAttribute('data-scroll-set')) {
                    textArea.style.overflowY = "scroll";
                    textArea.setAttribute('data-scroll-set', 'true');
                }
                addMsgClearBtn();
                addTopButtons();
                addDetailsPaneButtons();
                addAdvancedQuickReplySection();

                const detailsPane = document.querySelector('[data-testid="details-pane"]');
                if (detailsPane && !detailsPane.classList.contains("min-width-pane")) {
                    detailsPane.classList.add("min-width-pane");

                    // Get all child elements of detailsPane
                    const elements = Array.from(detailsPane.children);

                    // Sort the elements while prioritizing the first three child elements
                    elements.sort((a, b) => {
                        const priorityElements = ['custom-btn-area', 'search-area', 'nav-buttons'];
                        const indexA = priorityElements.indexOf(a.id);
                        const indexB = priorityElements.indexOf(b.id);

                        if (indexA !== -1 && indexB !== -1) {
                            return indexA - indexB;
                        }

                        if (indexA !== -1) return -1;
                        if (indexB !== -1) return 1;

                        return a.id.localeCompare(b.id);
                    });

                    // Clear the detailsPane
                    detailsPane.innerHTML = '';

                    // Append the sorted elements back to detailsPane
                    elements.forEach(element => {
                        detailsPane.appendChild(element);
                    });
                }
            }
        }
    };

    // ========== OPTIMIZATION: Debounced observer to reduce processing frequency ==========
    const inboxObserver = new MutationObserver(debouncedCallback(inboxObserverCallback, 50));

    // ========== OPTIMIZATION: Target specific elements instead of entire document ==========
    function startObserver() {
        // First, try to observe the main inbox container
        const inboxContainer = document.querySelector('.layout_service') || document.querySelector('[data-testid="inbox-layout"]') || document.body;
        inboxObserver.observe(inboxContainer, { childList: true, subtree: true });
    }

    // Start observing
    startObserver();

    // Initial tab title update
    setTimeout(updateTabTitle, 1000);

    // Append the keyframes CSS to the head
    const keyframesCSS = `@keyframes rotateInfinite{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}`;
    const otherCSS = `.message-container{display: flex !important;flex-direction: row !important;}.accordion {--border-color: #cccccc;--background-color: #f1f1f1;--transition: all 0.2s ease;display: flex;flex-direction: column;gap: 10px;max-width: 500px;}.accordion .accordion-item {border: 1px solid var(--border-color);border-radius: 5px;}.accordion .accordion-item .accordion-item-description-wrapper hr {border: none;border-top: 1px solid var(--border-color);visibility: visible;}.accordion .accordion-item.open .accordion-item-description-wrapper hr {visibility: visible;}.accordion .accordion-item .accordion-item-header {background-color: var(--background-color);display: flex;align-items: center;justify-content: space-between;padding: 10px;cursor: pointer;}.accordion .accordion-item .accordion-item-header .accordion-item-header-title {font-weight: 600;}.accordion .accordion-item .accordion-item-header .accordion-item-header-icon {transition: var(--transition);}.accordion .accordion-item.open .accordion-item-header .accordion-item-header-icon {transform: rotate(-180deg);}.accordion .accordion-item .accordion-item-description-wrapper {margin:0 1em 0 1em;display: grid;grid-template-rows: 0fr;overflow: hidden;transition: var(--transition);}.accordion .accordion-item.open .accordion-item-description-wrapper {grid-template-rows: 1fr;}.accordion .accordion-item .accordion-item-description-wrapper .accordion-item-description {min-height: 0;}.accordion .accordion-item .accordion-item-description-wrapper .accordion-item-description p {padding: 10px;line-height: 1.5;}.highlighted-background{background:cornsilk;}.min-width-pane{min-width: 350px !important;padding-right: 12px;}.highlighted-count{text-align:center;margin:auto .3em}.nav-buttons span{margin-left:.1em;margin-right:.1em;cursor:pointer;border-radius:50%;background:#000;color:#fff;padding:.3em;width:1.1em}.nav-buttons{margin-left:auto;margin-right:auto;}.scroll-top-btn{background:#000;color:#fff;border-radius:50%;border:2px solid #000}.scroll-top-btn.active{background:#000;color:#ff0;border-radius:50%;border:2px solid #000}.highlighted{border:4px solid #54d314;border-radius:2em}.pseudo-search{width:100%;display:inline;border-bottom:2px solid #ccc;padding:10px 15px}.pseudo-search input{border:0;background-color:transparent;width:95%;}.pseudo-search input:focus{outline:0}.pseudo-search button,.pseudo-search i{border:none;background:0 0;cursor:pointer}.pseudo-search select{border:none}.custom-btn-area{border: 2px solid;border-radius: 2em;}.custom-btn-area img{height: 30px;}.custom-btn-area button{padding: 0.2em;display: flex;}.clear-button{background:#80808099;margin:5px;color:#fff;padding:1px 9px;border-radius:50px;}
    .scroll-top-btn,.search-btn{font-size:20px;margin:3px;}.disabled-btn{opacity:0.6;cursor:not-allowed;pointer-events: none;}`;
    const styleTag = document.createElement('style');
    styleTag.textContent = keyframesCSS + otherCSS;
    document.head.appendChild(styleTag);


})();
