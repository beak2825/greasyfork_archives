// ==UserScript==
// @name         Fiverr :: Companion Kit
// @namespace    fiverr.com/web_coder_nsd
// @version      0.2.45
// @description  Balance Masker + Random Reload and Countdown + Insert inbox links with user avatars on the Fiverr seller dashboard and add a link with an icon in the inbox
// @author       noushadBug
// @match        *://www.fiverr.com/*
// @icon         https://www.fiverr.com/favicon.ico
// @license      MIT
// @grant        GM_registerMenuCommand
// @run-at       document-start

// @downloadURL https://update.greasyfork.org/scripts/500093/Fiverr%20%3A%3A%20Companion%20Kit.user.js
// @updateURL https://update.greasyfork.org/scripts/500093/Fiverr%20%3A%3A%20Companion%20Kit.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //--------- PRE-LOADING SECTION ---------//
    var style, loader;
    function earlyLoader() {
        style = document.createElement('style');
        style.innerHTML = `
    #early-loader {
        position: fixed;
        top: 0; left: 0;
        width: 100vw;
        height: 100vh;
        background: rgb(0 0 0 / 17%);
        backdrop-filter: blur(12px) saturate(180%);
        -webkit-backdrop-filter: blur(12px) saturate(180%);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        z-index: 99999;
        opacity: 1;
        transition: opacity 2s ease-in-out;
        overflow: hidden;
    }
 
    #early-loader::before {
        content: '';
        position: absolute;
        top: 0;
        left: -75%;
        width: 50%;
        height: 100%;
        background: linear-gradient(
            120deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
        );
        animation: shimmer 1s infinite;
        pointer-events: none;
    }
 
    @keyframes shimmer {
        0%   { left: -75%; }
        100% { left: 125%; }
    }
 
    #early-loader.hide {
        opacity: 0.05;
        pointer-events: none;
    }
 
    #early-loader img {
        width: 64px;
        height: 64px;
        margin-bottom: 20px;
        border-radius: 40px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.6), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        animation: pulse 2s infinite ease-in-out;
    }
 
    #early-loader span {
        font-size: 25px;
        font-weight: bold;
        color: aquamarine;
        text-shadow: 0 0 8px #000;
    }
 
    @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50%      { transform: scale(1.15); opacity: 0.8; }
    }
    `;

        loader = document.createElement('div');
        loader.id = 'early-loader';

        const logo = document.createElement('img');
        logo.src = 'https://www.fiverr.com/favicon.ico';

        const text = document.createElement('span');
        text.textContent = 'Loading Fiverr...';

        loader.appendChild(logo);
        loader.appendChild(text);
        document.documentElement.appendChild(style);
        document.documentElement.appendChild(loader);
    }
    function fadeOutLoader() {
        setTimeout(() => {
            // Add fade-out effect
            loader.classList.add('hide');
            setTimeout(() => {
                loader.remove();
                style.remove();
            }, 200);
        }, 200);
    }
    earlyLoader();


    window.addEventListener('load', () => {
        fadeOutLoader()
    });


    //--------- PRE-LOADING SECTION ---------//


    const selectors = {
        orderFilterSelect: '.statuses-select',
        dashboardWrapper: '.dashboard-wrapper',
        rightPanel: '.right-panel',
        dashboardBox: '.dashboard-box',
        clientFeedback: '[name="message-box-text-area"]',
        orderHeaderWrapper: '.header-row-wrapper',
        orderHeader: '.header-row',
        footerSitemaps: '.footer-wrapper .bottom',
        footerSitemaps2: '.footer-collapsibles',
        sellerEduWrapper: '.seller-education-wrapper',
        userConversations: '.user-conversations',
        buyerUserName: '.buyer-username',
        listBuyerUserName: '.conversation-title',
        dashboardConversationList: '.items-ul',
        dashboardOrderViewButtonSections: '.cta-wrapper',
        dashboardOrderViewButtons: '.order-data .cta-wrapper a.font-accent',
        dashboardInboxUserImages: '.items-ul figure',
        dashboardOrderPrice: '.price span',
        orderCard: '.order-card-wrapper',
        msgWrapper: ".message-wrapper",
        msgTimestamp: 'time',
        msgHeader: ".header",
        msgContent: ".message-content",
        checkbox: ".select-msg-checkbox"
    };

    // Securely load or prompt for GAS script ID
    var GOOGLE_APPS_SCRIPT_ID = localStorage.getItem('fiverr_script_id');
    if (!GOOGLE_APPS_SCRIPT_ID) {
        GOOGLE_APPS_SCRIPT_ID = prompt("Enter your Google Apps Script ID:");
        if (!GOOGLE_APPS_SCRIPT_ID) return alert("❌ Script ID is required.");
        localStorage.setItem('fiverr_script_id', GOOGLE_APPS_SCRIPT_ID);
    }

    GM_registerMenuCommand("Reset Script ID", () => {
        localStorage.removeItem('fiverr_script_id');
        alert("Script ID reset. Reloading...");
        location.reload();
    });

    window.addEventListener('DOMContentLoaded', () => {

        // Ensure freelancer list is pulled once and reused
        let freelancerList = [];
        let statusOptions = [];
        let orderAssignments = {};
        let orderStatuses = {};
        let orderPercentages = {};
        let initialDataFetched = false;
        let initialDataFetchPromise = null;
        var gigDetailText = "Create deliverables as discussed"; // Default text for gig details

        document.addEventListener('click', (e) => {
            if (e.target == document.querySelector('span [data-testid="create-custom-offer-button"]')) {
                console.log("!!! clicked on custom offer button");
                setTimeout(() => {
                    setDefaultGigDetailText();
                }, 300);
            }
        });
        // It adds a default text to the gig detail textarea if it's empty in the inbox page's custom offer.
        async function setDefaultGigDetailText() {
            console.log("called function: setDefaultGigDetailText");
            var conversations = conversationFormatter();
            console.log("Conversations:", conversations);
            if (conversations) {
                console.log("Condition met: Conversations found.");
                try {
                    console.log("Attempting to generate AI response...");
                    const gemini = new GeminiClient();
                    const prompt = `You are an AI assistant that helps Fiverr sellers create custom offers based on conversations with buyers. Use the following conversation to generate a detailed project overview text for the gig details textarea.your job is to give me actionable and to the point final agreed deliverables by "me", do not sugarcoat anything but be very precise.\\n\n${conversations}\n\n\nPlease provide the final agreed deliverables in a concise manner. Remember only list of agreed points and what will be the deliverables that's it. Do not include any other information or greetings.`;
                    const aiResponse = await gemini.generateContent(prompt);
                    if (aiResponse) {
                        console.log("Condition met: AI response received.");
                        console.log("AI Response:", aiResponse);
                        gigDetailText = convertMarkdownToUnicode(aiResponse);
                    } else {
                        console.log("Condition not met: No AI response. Using default text.");
                        gigDetailText = "Create deliverables as discussed";
                    }
                    var offerPopUpDetailText = document.querySelectorAll('form textarea');
                    if (offerPopUpDetailText.length > 0) {
                        if (offerPopUpDetailText.length > 0) {
                            setText(offerPopUpDetailText[0], gigDetailText);
                        }
                    }
                }
                catch (error) {
                    console.log("Error caught during AI response generation.");
                    console.error(error);
                    gigDetailText = "Create deliverables as discussed";
                    var offerPopUpDetailText = document.querySelectorAll('form textarea');
                    if (offerPopUpDetailText.length > 0) {
                        if (offerPopUpDetailText.length > 0) {
                            setText(offerPopUpDetailText[0], gigDetailText);
                        }
                    }
                }


                // gigDetails[0].value = "Create deliverables as discussed";
            } else {
                console.log("Condition not met: No conversations found. Using default text.");
                gigDetailText = "Create deliverables as discussed";
            }

        }

        function conversationFormatter() {
            let conversationText = '';
            let wrappers = [];
            wrappers = document.querySelector(".message-flow").childNodes[0].childNodes

            wrappers.forEach((wrapper, idx) => {
                const messageContent = wrapper.querySelector(selectors.msgContent);
                if (!messageContent) {
                    console.warn(`⚠️ No message content in wrapper ${idx}`);
                    return;
                }

                const timestampEl = wrapper.querySelector(selectors.msgTimestamp);
                let senderText = 'Unknown';

                if (timestampEl) {
                    const senderEl = timestampEl?.parentElement?.parentElement?.firstChild;
                    if (senderEl) {
                        senderText = senderEl.textContent.trim();
                    }
                } else {
                    console.warn(`⚠️ No timestamp found in wrapper ${idx}`);
                }

                const isMe = senderText === 'Me';
                const pList = messageContent.querySelectorAll('p');
                const paragraphs = pList.length > 1 ? [pList[1]] : [];
                const messageBody = paragraphs.map(p => p.textContent.trim()).join(' ').trim();

                if (messageBody) {
                    conversationText += isMe ? `Me: ${messageBody}\n\n` : `Client: ${messageBody}\n\n`;
                } else {
                    console.warn(`⚠️ Empty message body in wrapper ${idx}`);
                }
            });

            const checkboxes = document.querySelectorAll(selectors.checkbox);
            if (checkboxes.length) {
                checkboxes.forEach(cb => cb.remove());
            }

            console.log("📄 Final conversation text:\n", conversationText);
            return conversationText;
        }
        function convertMarkdownToUnicode(text) {
            // Replace characters one by one in headers and bold texts
            const charMapping = {
                'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝',
                'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧',
                'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭', 'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱',
                'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻',
                'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅',
                'y': '𝘆', 'z': '𝘇'
            };

            const charMappingUnderline = {
                'A': 'A͟', 'B': 'B͟', 'C': 'C͟', 'D': 'D͟', 'E': 'E͟', 'F': 'F͟', 'G': 'G͟', 'H': 'H͟', 'I': 'I͟', 'J': 'J͟',
                'K': 'K͟', 'L': 'L͟', 'M': 'M͟', 'N': 'N͟', 'O': 'O͟', 'P': 'P͟', 'Q': 'Q͟', 'R': 'R͟', 'S': 'S͟', 'T': 'T͟',
                'U': 'U͟', 'V': 'V͟', 'W': 'W͟', 'X': 'X͟', 'Y': 'Y͟', 'Z': 'Z͟', 'a': 'a͟', 'b': 'b͟', 'c': 'c͟', 'd': 'd͟',
                'e': 'e͟', 'f': 'f͟', 'g': 'g͟', 'h': 'h͟', 'i': 'i͟', 'j': 'j͟', 'k': 'k͟', 'l': 'l͟', 'm': 'm͟', 'n': 'n͟',
                'o': 'o͟', 'p': 'p͟', 'q': 'q͟', 'r': 'r͟', 's': 's͟', 't': 't͟', 'u': 'u͟', 'v': 'v͟', 'w': 'w͟', 'x': 'x͟',
                'y': 'y͟', 'z': 'z͟'
            };

            const numberFormatting = {
                '1': '⑴', '2': '⑵', '3': '⑶', '4': '⑷', '5': '⑸', '6': '⑹', '7': '⑺', '8': '⑻', '9': '⑼', '0': '⑽'
            };

            // Format numbers as 𝟙 𝟚 𝟛 ...
            text = text.replace(/(\d+)\. (\*\*.*?\*\*)/g, (_, number, text) => {
                let formattedNumber = '';
                // Format each digit of the number
                for (const digit of number) {
                    formattedNumber += numberFormatting[digit];
                }
                // Add a dot and the formatted text at the end
                formattedNumber += '. ' + text;
                return formattedNumber;
            });

            // Header conversion with English alphabets replacement
            text = text.replace(/### (.*?)(\r\n|\r|\n|$)/g, (_, header) => {
                // Replace English alphabets using charMapping
                for (const [sourceChar, targetChar] of Object.entries(charMappingUnderline)) {
                    const regex = new RegExp(sourceChar, 'g');
                    header = header.replace(regex, targetChar);
                }
                // Replace English alphabets using charMapping
                for (const [sourceChar, targetChar] of Object.entries(charMapping)) {
                    const regex = new RegExp(sourceChar, 'g');
                    header = header.replace(regex, targetChar);
                }
                return ("❒ " + header + " ❱");
            });

            // Bold text conversion with English alphabets replacement
            text = text.replace(/\*\*(.*?)\*\*/g, (_, boldText) => {
                // Replace English alphabets using charMapping
                for (const [sourceChar, targetChar] of Object.entries(charMapping)) {
                    const regex = new RegExp(sourceChar, 'g');
                    boldText = boldText.replace(regex, targetChar);
                }
                return boldText;
            });

            // Convert hyphens to bullet points
            text = text.replace(/^   - /gm, "   ◉ ");
            // Convert hyphens to bullet points
            text = text.replace(/^    - /gm, "    • ");
            // Convert hyphens to bullet points
            text = text.replace(/^        - /gm, "        ‣ ");

            const negativeTexts = [
                { original: "email", replacement: "e-mail" },
                { original: "emails", replacement: "e-mails" },
                { original: "Email", replacement: "E-mail" },
                { original: "Emails", replacement: "E-mails" },
                { original: "pay", replacement: "𝗉𝖺𝗒" },
                { original: "money", replacement: "𝗆𝗈𝗇𝖾𝗒" }
            ];

            text = replaceNegativeTexts(text, negativeTexts)
            return text;
        }

        async function ensureInitialData() {
            if (initialDataFetched) return;

            if (!initialDataFetchPromise) {
                initialDataFetchPromise = fetch(`https://script.google.com/macros/s/${GOOGLE_APPS_SCRIPT_ID}/exec?action=read_initial_data`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            freelancerList = data.freelancers;
                            orderAssignments = data.assignments || {};
                            orderStatuses = data.statuses || {};
                            orderPercentages = data.percentages || {};
                            statusOptions = data.statusOptions || ["Processing", "Have to pay", "Cancelled", "Delivered"]; // fallback
                            initialDataFetched = true;
                        } else {
                            throw new Error("Initial data load failed");
                        }
                    })
                    .catch(err => {
                        console.warn("Initial data fetch failed", err);
                        initialDataFetched = false;
                        initialDataFetchPromise = null;
                    });
            }

            await initialDataFetchPromise;
        }

        function changeDashboardLayout() {
            const userConversations = document.querySelector(selectors.userConversations);
            const rightPanel = document.querySelector(selectors.rightPanel);
            const dashboardBox = document.querySelector(selectors.dashboardBox);
            const dashboardWrapper = document.querySelector(selectors.dashboardWrapper);
            if (!dashboardWrapper.getAttribute('changed-layout')) {
                dashboardWrapper.style.cssText = 'display: grid; max-width: 85%; grid-template-columns: 4fr 6fr 0fr;';
                rightPanel.style.cssText = 'grid-area: initial; margin:10px;';
                dashboardBox.style.cssText = 'grid-area: initial; margin:10px;';
                userConversations.style.cssText = 'margin: 10px; height: 123%; transform-origin: top; scale: 0.8; -webkit-transform-origin-x: right;';
                dashboardWrapper.innerHTML = '';
                if (userConversations.parentNode) {
                    userConversations.parentNode.removeChild(userConversations);
                }
                dashboardWrapper.appendChild(userConversations);
                dashboardWrapper.appendChild(rightPanel);
                dashboardWrapper.appendChild(dashboardBox);
                const truncateStyle = `.seller-dashboard-wrapper{transform: scale(0.7);}.user-conversations .conversation .conversation-description{font-size: large;}.order-data .cta-wrapper{min-width: 50px;} .cta-wrapper a { display: inline-block; padding: 6px 0px 3px !important; transition: transform 0.4s ease, box-shadow 0.4s ease, border 0.3s ease, padding 0.3s ease, background-color 0.3s ease, color 0.3s ease; will-change: transform, box-shadow, border, padding; transform-origin: center; } .cta-wrapper a:hover { border: 1px outset #84b2d9 !important; padding: 6px 2px 3px !important; transform: translateY(-3px) skewX(-3deg); box-shadow: 0 6px 15px rgba(0, 123, 255, 0.4); border-radius: 8px; } .user-conversations .truncate { max-width: 300px; }
.user-conversations .items-container{height:100% !important}
.blurred-price-style { opacity: 0; transition: filter 0.3s ease; } .eye-toggle-btn { cursor: pointer; margin-right: 8px; width: 18px; height: 18px; vertical-align: middle; }
            .active-orders-wrapper{background: #fff0f0; border-radius: 2em; padding: 1em;}
            .seller-performance-wrapper .widget-card,
                .user-conversations{filter:drop-shadow(1px 1px 2px pink);border-radius: 1em;}
            .user-conversations header,.card-inner,.filter-wrapper{border-radius: 1em !important;}
            .user-conversations header{border-bottom-left-radius: 0 !important; border-bottom-right-radius: 0 !important;}.dashboard-box{align-self: start; justify-self: start; transform-origin: top; width: 115%;}`;
                const styleTag = document.createElement('style');
                styleTag.textContent = truncateStyle;
                document.head.appendChild(styleTag);
                dashboardWrapper.setAttribute('changed-layout', 'true');
            }
        }

        const hideBalCSS = '.order-page .order-summary .status .order-status{width:max-content;}.order-card-wrapper .order-card .gig-image-wrapper{border-radius: 10px;}.order-card-wrapper .card-inner{padding: 5px;margin: 5px;}a.user-balance{opacity:100}.fade-bal{opacity:0;}.hide-bal {color:#fff0!important;border:#fff0!important;width:15px!important;height:20px!important;border-radius:50%;background:url(https://emoji.discadia.com/emojis/45be724f-b444-4277-be9c-00cd1e39c26e.PNG) no-repeat center center;background-size:contain;}';
        const orderCSS = '@keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }.gig-header{height:80px;}.start-tracking-button { background: #d3ffff; width: 88px; height: 20px; margin: 1px 5px; border-radius: 4px; font-size: 9px; font-weight: 700; line-height: 17px; padding: 0px 8px; text-align: center; }';
        const styleTag = document.createElement('style');
        styleTag.textContent = hideBalCSS + orderCSS;
        document.head.appendChild(styleTag);

        if (window.location.href.includes("seller_dashboard")) {
            const countdownContainer = Object.assign(document.createElement('div'), { style: 'position: fixed; top: 2px; right: 30%; padding: 10px; border: 1px solid rgb(204, 204, 204); filter: drop-shadow(2px 4px 6px black); border-radius: 5px; z-index: 1000;' });
            const countdownText = document.createElement('span');
            countdownText.id = 'countdownText';
            countdownContainer.appendChild(countdownText);
            const toggleButton = Object.assign(document.createElement('button'), { textContent: 'Stop', style: 'margin-left:10px;color:white;background-color:#444;border:1px solid #ccc;border-radius:5px;' });
            countdownContainer.appendChild(toggleButton);
            document.body.appendChild(countdownContainer);
            let countdownInterval, randomTime;
            let isRunning = true;
            function formatTime(ms) {
                const minutes = String(Math.floor(ms / 60000)).padStart(2, '0');
                const seconds = String(Math.floor(ms / 1000) % 60).padStart(2, '0');
                return `${minutes}:${seconds}`;
            }
            function updateCountdown() {
                if (randomTime <= 0) {
                    clearInterval(countdownInterval);
                    location.reload();
                } else {
                    countdownText.textContent = `Reload in: ${formatTime(randomTime)}`;
                    randomTime -= 1000;
                }
            }
            function startCountdown() {
                randomTime = Math.floor(Math.random() * (240000 - 120000 + 1)) + 120000;
                countdownInterval = setInterval(updateCountdown, 1000);
                updateCountdown();
            }
            function stopCountdown() {
                clearInterval(countdownInterval);
                countdownText.textContent = 'Countdown stopped';
            }
            function toggleCountdown() {
                if (isRunning) {
                    stopCountdown();
                    toggleButton.textContent = 'Start';
                } else {
                    startCountdown();
                    toggleButton.textContent = 'Stop';
                }
                isRunning = !isRunning;
            }
            toggleButton.addEventListener('click', toggleCountdown);
            startCountdown();
        }

        function modifyDashboard() {
            document.querySelectorAll(selectors.sellerEduWrapper).forEach(link => {
                if (link) link.remove();
            });
        }

        function toggleBlur() {
            const blurClass = 'blurred-price-style';
            const prices = document.querySelectorAll(selectors.dashboardOrderPrice);
            prices.forEach(el => el.classList.toggle(blurClass));
        }

        function insertGroupByUI() {
            const orderFilterSelect = document.querySelector(selectors.orderFilterSelect);
            if (!orderFilterSelect || document.querySelector('.group-by-wrapper')) return;

            const wrapper = document.createElement('div');
            wrapper.className = 'group-by-wrapper';
            wrapper.style.cssText = 'display: flex; align-items: center; gap: 8px; margin: 4px 0px';

            const label = document.createElement('label');
            label.textContent = 'Group By';
            label.style.cssText = 'font-weight: bold; font-size: 13px;';

            const icon = document.createElement('img');
            icon.src = 'https://cdn-icons-png.flaticon.com/32/3999/3999436.png';
            icon.style.cssText = 'width: 18px; height: 18px;';

            const select = document.createElement('select');
            select.style.cssText = 'padding: 4px 8px; border-radius: 6px; font-size: 12px; background: #f0f0f0; border: 1px solid #ccc;';
            ['Default', 'Freelancer', 'Work Status'].forEach(optionText => {
                const option = document.createElement('option');
                option.value = optionText.toLowerCase().replace(' ', '_');
                option.textContent = optionText;
                select.appendChild(option);
            });

            select.addEventListener('change', (e) => handleGroupByChange(e.target.value));

            wrapper.appendChild(label);
            wrapper.appendChild(icon);
            wrapper.appendChild(select);

            orderFilterSelect.insertAdjacentElement('afterend', wrapper);
        }


        function handleGroupByChange(groupType) {
            if (groupType === 'default') {
                restoreDefaultOrderView();
            } else if (groupType === 'freelancer') {
                groupOrdersByFreelancer();
            } else if (groupType === 'work_status') {
                groupOrdersByStatus();
            }
        }
        function restoreDefaultOrderView() {
            const orderWrapper = document.querySelector('.order-cards-wrapper');
            if (!orderWrapper) return;
            // reload page to original, or store original HTML and reset it
            location.reload(); // simple for now
        }

        function groupOrdersByFreelancer() {
            const orders = Array.from(document.querySelectorAll('.order-card-wrapper'));
            const grouped = {};

            orders.forEach(order => {
                const freelancerSelect = order.querySelector('.freelancer-assign-dropdown');
                const freelancer = freelancerSelect?.value || 'Noushad Bhuiyan';
                if (!grouped[freelancer]) grouped[freelancer] = [];
                grouped[freelancer].push(order);
            });

            renderGroupedOrders(grouped);
        }

        function groupOrdersByStatus() {
            const orders = Array.from(document.querySelectorAll('.order-card-wrapper'));
            const grouped = {};

            orders.forEach(order => {
                const freelancerStatusSelect = order.querySelector('.freelancer-status');
                const status = freelancerStatusSelect?.value?.trim();
                if (!status) return; // 🚫 skip empty or not set
                if (!grouped[status]) grouped[status] = [];
                grouped[status].push(order);
            });

            renderGroupedOrders(grouped);
        }



        function renderGroupedOrders(grouped) {
            const orderWrapper = document.querySelector('.order-cards-wrapper ul');
            if (!orderWrapper) return;
            orderWrapper.innerHTML = '';

            Object.entries(grouped).forEach(([groupName, orders]) => {
                const header = document.createElement('h6');
                header.textContent = groupName;
                header.style.cssText = 'margin: 20px 6px 5px; font-weight: bold; color: #555;';
                orderWrapper.appendChild(header);

                orders.forEach(order => {
                    orderWrapper.appendChild(order);
                });
            });
        }


        function injectEyeIcon() {
            const alreadyInserted = document.querySelector('.eye-toggle-btn');
            if (alreadyInserted) return;

            const targets = document.querySelectorAll(selectors.orderFilterSelect);
            if (!targets.length) return;

            const img = document.createElement('img');
            img.src = 'https://iconmonstr.com/wp-content/g/gd/makefg.php?i=../releases/preview/2017/png/iconmonstr-eye-9.png&r=0&g=100&b=15';
            img.className = 'eye-toggle-btn';
            img.title = 'Toggle Price Blur';
            img.addEventListener('click', toggleBlur);

            // Insert only once before the first select
            targets[0].parentNode.insertBefore(img, targets[0]);
        }

        function applyInitialBlur() {
            const blurClass = 'blurred-price-style';
            const prices = document.querySelectorAll(selectors.dashboardOrderPrice);
            prices.forEach(el => el.classList.add(blurClass));
        }
        async function createFreelancerDropdown(orderId, price) {
            await ensureInitialData();

            const wrapper = document.createElement('div');
            wrapper.style.cssText = 'display:flex;flex-direction:column;align-items:flex-start;margin:0px 3px;width:min-content;';

            const select = document.createElement("select");
            select.className = "freelancer-assign-dropdown";
            select.style.cssText = "margin-bottom:4px;padding:3px 6px;font-size:11px;border-radius:6px;border:1px solid #ccc;cursor:pointer;background:#f9f9f9;width:140px;";

            const assigned = orderAssignments[orderId] || "";
            select.appendChild(new Option("Noushad Bhuiyan", "", !assigned, !assigned));
            freelancerList.forEach(name => {
                const opt = new Option(name, name, false, name === assigned);
                select.appendChild(opt);
            });

            const infoWrapper = document.createElement('div');
            infoWrapper.style.cssText = "display:flex;align-items:center;gap:4px;margin-top:2px;";

            const percentInput = document.createElement('input');
            percentInput.type = 'text';
            percentInput.placeholder = '?';
            percentInput.style.cssText = "width:100%;padding:2px 4px;font-size:10px;border:1px solid #ccc;border-radius:5px;text-align:right;";
            percentInput.value = orderPercentages[orderId] || '';

            const percentSymbol = document.createElement('span');
            percentSymbol.textContent = '%';
            percentSymbol.style.cssText = "font-size:11px;color:#666;";

            const statusSelect = document.createElement('select');
            statusSelect.style.cssText = "padding:2px 4px;font-size:10px;border:1px solid #ccc;border-radius:5px;background:#f9f9f9;";
            statusSelect.className = "freelancer-status";
            const currentStatus = orderStatuses[orderId] || "";

            // Always show ❌ Not Set first
            statusSelect.appendChild(new Option("❌ Not Set", "", false, !currentStatus));

            statusOptions.forEach(opt => {
                const option = new Option(opt, opt, false, opt === currentStatus);
                statusSelect.appendChild(option);
            });

            // Status Change Event
            statusSelect.addEventListener('change', async () => {
                const freelancer = select.value;
                const newStatus = statusSelect.value;
                if (!freelancer || !newStatus) return;
                const url = `https://script.google.com/macros/s/${GOOGLE_APPS_SCRIPT_ID}/exec?action=update_status&orderId=${orderId}&freelancer=${encodeURIComponent(freelancer)}&status=${encodeURIComponent(newStatus)}`;
                try {
                    showOrderFeedbackIcon(wrapper, 'loading'); // <<<<<
                    const res = await fetch(url);
                    const result = await res.json();
                    if (!result.success) throw new Error(result.message || "Unknown error");
                    console.log(`✅ Status updated to ${newStatus}`);
                    showOrderFeedbackIcon(wrapper, 'done'); // <<<<<
                } catch (err) {
                    console.error("❌ Status update failed", err);
                }
            });


            select.addEventListener("change", async () => {
                const freelancer = select.value;
                const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                const url = `https://script.google.com/macros/s/${GOOGLE_APPS_SCRIPT_ID}/exec?action=insert_assignment&orderId=${orderId}&price=${price}&freelancer=${encodeURIComponent(freelancer)}&date=${encodeURIComponent(date)}`;
                try {
                    showOrderFeedbackIcon(wrapper, 'loading'); // <<<<< ADD THIS
                    const res = await fetch(url);
                    const result = await res.json();
                    if (!result.success) throw new Error(result.message || "Unknown error");
                    alert(freelancer ? `✅ Assigned to ${freelancer}` : "🧹 Assignment cleared");
                    if (freelancer) {
                        percentInput.value = '100';
                    } else {
                        percentInput.value = '';
                    }
                    statusSelect.value = "Processing"; // Reset after reassign
                    showOrderFeedbackIcon(wrapper, 'done'); // <<<<< ADD THIS
                } catch (err) {
                    alert("❌ Assignment failed. Check console.");
                    console.error(err);
                }
            });


            percentInput.addEventListener('change', async () => {
                const freelancer = select.value;
                const percent = percentInput.value.trim();
                if (!freelancer || !percent) return;
                const url = `https://script.google.com/macros/s/${GOOGLE_APPS_SCRIPT_ID}/exec?action=update_involvement&orderId=${orderId}&freelancer=${encodeURIComponent(freelancer)}&percent=${encodeURIComponent(percent)}`;
                try {
                    showOrderFeedbackIcon(wrapper, 'loading'); // <<<<<
                    const res = await fetch(url);
                    const result = await res.json();
                    if (!result.success) throw new Error(result.message || "Unknown error");
                    console.log(`✅ Updated ${freelancer}'s involvement to ${percent}%`);
                    showOrderFeedbackIcon(wrapper, 'done'); // <<<<<
                } catch (err) {
                    console.error("❌ Involvement update failed", err);
                }
            });


            infoWrapper.appendChild(percentInput);
            infoWrapper.appendChild(percentSymbol);
            infoWrapper.appendChild(statusSelect);

            wrapper.appendChild(select);
            wrapper.appendChild(infoWrapper);

            return wrapper;
        }

        async function addConversationInboxLinks() {
            document.querySelectorAll('.items-ul figure').forEach((figure, i) => {
                // Get the username from the title attribute of each figure element
                const username = figure.title;
                var conv = figure.closest('.conversation');
                // Find the closest '.conversation' element and the '.user-star' within it
                const userStarElement = conv.querySelector('.user-star');

                if (userStarElement && !conv.querySelector('.dash-inbox-link')) {
                    // Create the new 'a' element
                    const newLink = Object.assign(document.createElement('a'), { href: `https://fiverr.com/inbox/${username}`, target: '_blank', className: 'dash-inbox-link', style: 'padding: 0 !important;', innerHTML: '<img src="https://cdn-icons-png.flaticon.com/16/12690/12690112.png" height="25">' });
                    // Prevent the parent div click event when clicking on the link
                    newLink.addEventListener('click', (e) => {
                        e.stopPropagation();
                    });

                    // Insert the 'a' element after the '.user-star' element
                    userStarElement.insertAdjacentElement('afterend', newLink);
                }
            });
        }


        async function addInboxLinks() {
            const wrappers = document.querySelectorAll(selectors.dashboardOrderViewButtonSections);
            for (const wrapper of wrappers) {
                if (wrapper.querySelector('.inbox-link')) continue;
                const buyerName = wrapper.parentElement.querySelector(selectors.buyerUserName)?.textContent?.trim();
                if (!buyerName) continue;
                wrapper.insertAdjacentHTML('afterbegin', `<a href="https://fiverr.com/inbox/${buyerName}" target="_blank" class="inbox-link" style="padding: 0 !important;"><img src="https://cdn-icons-png.flaticon.com/16/9195/9195886.png" height="18"></a>`);
                const orderId = wrapper.querySelector('a.font-accent')?.href.split('/manage_orders/')[1];
                wrapper.querySelector('a.font-accent').target = "_blank";
                const price = wrapper.closest(selectors.orderCard).querySelector(selectors.dashboardOrderPrice)?.textContent?.trim();
                if (orderId) {
                    const dropdown = await createFreelancerDropdown(orderId, price);
                    wrapper.parentElement.appendChild(dropdown);
                }
            }
        }


        function autoClickGotIt() {
            if (!location.href.includes('/orders/')) return;

            const tryClick = () => {
                const btn = Array.from(document.querySelectorAll('[role="dialog"] button'))
                    .find(b => b.textContent.trim() === 'Got it!');
                if (btn) { btn.click(); return true; }
                return false;
            };

            if (tryClick()) return;

            const mo = new MutationObserver(() => {
                if (tryClick()) mo.disconnect();
            });
            mo.observe(document.body, { childList: true, subtree: true });

            setTimeout(() => mo.disconnect(), 15000);
        }


        function setText(element, text, removePrevValue = true, addEnter = false) {
            const input = element
            if (!input) return;
            const lastValue = input.value;

            // Clear the previous value if removePrevValue is true
            if (removePrevValue) {
                input.value = '';
            }

            input.value += text; // Append the new text
            const event = new Event('input', { bubbles: true });
            // hack React15
            event.simulated = true;
            // hack React16
            const tracker = input._valueTracker;
            if (tracker) {
                tracker.setValue(lastValue);
            }
            input.dispatchEvent(event);
            if (addEnter) {
                input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
            }
        }

        function insertAdvancedOrderSections() {
            if (!document.querySelector('#start-tracking')) {
                const button = document.createElement('button');
                button.innerText = 'Start Tracking';
                button.id = 'start-tracking';
                button.classList.add('start-tracking-button');
                const container = document.querySelector('.gig-title-text-container .status');
                if (container) container.appendChild(button);
            }
            const summaryContentList = document.querySelector('.summary-content ul');
            if (summaryContentList && !summaryContentList.querySelector('.dropdown-content')) {
                const newLi = document.createElement('li');
                newLi.innerHTML = `
                <div class="dropdown">
                    <button class="dropdown-button">More</button>
                    <div class="dropdown-content">
                        <a href="#" class="dropdown-item">Create a new order</a>
                    </div>
                </div>`;
                summaryContentList.appendChild(newLi);
            }
        }

        function setOrderProcess() {
            const clientFeedbackTextbox = document.querySelector(selectors.clientFeedback);
            if (clientFeedbackTextbox && !clientFeedbackTextbox.value)
                clientFeedbackTextbox.value = "Outstanding buyer! Will love to work again.";
            document.querySelector("#Header").style.cssText = `position: fixed; z-index: 7;width: -webkit-fill-available;`;
            if (!document.querySelector('#nav-btn')) {
                const buttonContainer = document.createElement('div');
                buttonContainer.style.cssText = 'position: fixed; top: 60px; right: 50%; z-index: 9999; display: flex; place-items: center;';
                buttonContainer.id = "nav-btn";
                document.body.appendChild(buttonContainer);
                const goToTopButton = document.createElement('button');
                goToTopButton.style.cssText = 'margin-right: 8px; background: #77A398; width: 32px; height: 32px; border-radius: 50%; display: flex; justify-content: center; align-items: center;';
                goToTopButton.textContent = '↑';
                let go2Top = true;
                goToTopButton.addEventListener('click', () => {
                    window.scrollTo({ top: go2Top ? 0 : document.body.scrollHeight, behavior: 'smooth' });
                    goToTopButton.textContent = go2Top ? '↓' : '↑';
                    go2Top = !go2Top;
                });
                buttonContainer.appendChild(goToTopButton);
            }
            if (document.querySelector(selectors.footerSitemaps))
                document.querySelector(selectors.footerSitemaps).style.cssText = `display: none;`;
            if (document.querySelector(selectors.footerSitemaps2))
                document.querySelector(selectors.footerSitemaps2).style.cssText = `display: none;`;
        }

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                const balanceElement = document.querySelector('a.user-balance');
                balanceElement?.classList.add('fade-bal');
                if (balanceElement && !balanceElement.hasAttribute('data-modified')) {
                    balanceElement.classList.add("hide-bal");
                    balanceElement?.classList.remove('fade-bal');
                    balanceElement.addEventListener('mouseover', function () {
                        balanceElement.classList.remove("hide-bal");
                        setTimeout(() => balanceElement.classList.add("hide-bal"), 2000);
                    });
                    balanceElement.setAttribute('data-modified', 'true');

                    fadeOutLoader()

                }
                if (mutation.addedNodes.length) {
                    if (window.location.href.includes('/seller_dashboard')) {
                        addInboxLinks();
                        addConversationInboxLinks();
                        modifyDashboard();
                        applyInitialBlur();
                        insertGroupByUI();
                        injectEyeIcon();
                        changeDashboardLayout();
                        insertAllOrderFeedbackIcons();
                        const sellerEduWrapper = document.querySelector(selectors.sellerEduWrapper);
                        if (sellerEduWrapper) sellerEduWrapper.remove();
                    }
                    if (window.location.href.includes('/orders/')) {
                        insertAdvancedOrderSections();
                        setOrderProcess();
                        addAIReplyButton();
                        autoClickGotIt();
                    }
                    if (window.location.href.includes('/inbox/') &&
                        mutation.target.children.length > 0 &&
                        mutation.target.children[0].nodeName === "FORM") {
                        var offerPopUpDetailText = document.querySelectorAll('form textarea');
                        if (offerPopUpDetailText.length > 0) {
                            if (offerPopUpDetailText.length > 0 && !offerPopUpDetailText[0].value) {
                                setText(offerPopUpDetailText[0], gigDetailText);
                            }
                        }
                    }
                }
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });

        if (window.location.href.includes('/seller_dashboard')) {
            addConversationInboxLinks();
            addInboxLinks();
            modifyDashboard();
            applyInitialBlur();
            insertGroupByUI();
            injectEyeIcon();
            changeDashboardLayout()
            insertAllOrderFeedbackIcons();
            const sellerEduWrapper = document.querySelector(selectors.sellerEduWrapper);
            if (sellerEduWrapper) sellerEduWrapper.remove();
        }
        if (window.location.href.includes('/orders/')) {
            insertAdvancedOrderSections();
            setOrderProcess();
            addAIReplyButton();
            autoClickGotIt();
        }

        function convertMarkdownToUnicode(text) {
            const charMapping = {
                'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝',
                'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧',
                'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭', 'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱',
                'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻',
                'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅',
                'y': '𝘆', 'z': '𝘇'
            };
            const charMappingUnderline = {
                'A': 'A͟', 'B': 'B͟', 'C': 'C͟', 'D': 'D͟', 'E': 'E͟', 'F': 'F͟', 'G': 'G͟', 'H': 'H͟', 'I': 'I͟', 'J': 'J͟',
                'K': 'K͟', 'L': 'L͟', 'M': 'M͟', 'N': 'N͟', 'O': 'O͟', 'P': 'P͟', 'Q': 'Q͟', 'R': 'R͟', 'S': 'S͟', 'T': 'T͟',
                'U': 'U͟', 'V': 'V͟', 'W': 'W͟', 'X': 'X͟', 'Y': 'Y͟', 'Z': 'Z͟', 'a': 'a͟', 'b': 'b͟', 'c': 'c͟', 'd': 'd͟',
                'e': 'e͟', 'f': 'f͟', 'g': 'g͟', 'h': 'h͟', 'i': 'i͟', 'j': 'j͟', 'k': 'k͟', 'l': 'l͟', 'm': 'm͟', 'n': 'n͟',
                'o': 'o͟', 'p': 'p͟', 'q': 'q͟', 'r': 'r͟', 's': 's͟', 't': 't͟', 'u': 'u͟', 'v': 'v͟', 'w': 'w͟', 'x': 'x͟',
                'y': 'y͟', 'z': 'z͟'
            };
            const numberFormatting = {
                '1': '⑴', '2': '⑵', '3': '⑶', '4': '⑷', '5': '⑸', '6': '⑹', '7': '⑺', '8': '⑻', '9': '⑼', '0': '⑽'
            };
            text = text.replace(/(\d+)\. (\*\*.*?\*\*)/g, (_, number, textPart) => {
                let formattedNumber = '';
                for (const digit of number) {
                    formattedNumber += numberFormatting[digit];
                }
                formattedNumber += '. ' + textPart;
                return formattedNumber;
            });
            text = text.replace(/### (.*?)(\r\n|\r|\n|$)/g, (_, header) => {
                for (const [sourceChar, targetChar] of Object.entries(charMappingUnderline)) {
                    const regex = new RegExp(sourceChar, 'g');
                    header = header.replace(regex, targetChar);
                }
                for (const [sourceChar, targetChar] of Object.entries(charMapping)) {
                    const regex = new RegExp(sourceChar, 'g');
                    header = header.replace(regex, targetChar);
                }
                return ("❒ " + header + " ❱");
            });
            text = text.replace(/\*\*(.*?)\*\*/g, (_, boldText) => {
                for (const [sourceChar, targetChar] of Object.entries(charMapping)) {
                    const regex = new RegExp(sourceChar, 'g');
                    boldText = boldText.replace(regex, targetChar);
                }
                return boldText;
            });
            text = text.replace(/^   - /gm, "   ◉ ");
            text = text.replace(/^    - /gm, "    • ");
            text = text.replace(/^        - /gm, "        ‣ ");
            return text;
        }


        async function generateAndPopulateTextareas() {
            try {
                const gemini = new GeminiClient();
                const collectedData = collectData();
                const prompt = `{
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a professional assistant skilled at generating concise, client-focused responses. Your goal is to Generate output in the following JSON format without any extraneous text or markdown. Context is: the user is trying to apply in a freelance work/project and you need to help him. Keep the questions relevant and brief, aimed at clarifying client requirements. The cover letter should be short, conversational, professional, and encourage collaboration, avoiding overly formal greetings like 'Dear Hiring Manager.'\\n\\nExample Response Format:\\n{\\n  \\"questions\\": \\"Generated questions here\\",\\n  \\"coverLetter\\": \\"Generated cover letter here\\"}\\n\\nContext about the user:\\nName: Noushad\\nProfession: Web Developer and Programmer specializing in business automation, Google Apps Script, Userscript, and Python.\\nExperience: Over 5 years of industry experience, 328+ successful projects, and a 4.9/5 rating from 224 reviews.\\nServices: Custom browser extensions, Google Apps Script automations, data processing, web development, and bug fixing for HTML, CSS, JavaScript, and Python.\\nAchievements: Saved clients over 20 hours per week and improved efficiency by 30%.\\n\\nInclude the project details in your analysis and tailor the response accordingly."
                    },
                    {
                        "role": "user",
                        "content": "Project Details: ${collectedData}"
                    }
                ],
                "json_schema": {
                    "name": "client_interaction",
                    "schema": {
                        "type": "object",
                        "properties": {
                            "questions": {
                                "type": "string",
                                "description": "Relevant questions to clarify client requirements and about the project. Must return with each of question's new line."
                            },
                            "coverLetter": {
                                "type": "string",
                                "description": "A concise, conversational, professional cover letter to engage the client."
                            }
                        },
                        "required": ["questions", "coverLetter"],
                        "additionalProperties": false
                    }
                }
            }`;
                const aiResponse = await gemini.generateContent(prompt);
                if (aiResponse) {
                    document.querySelector('.gemini-button-loading').style.display = 'none';
                    document.querySelector('#gemini-button img').style.display = 'block';
                }
                document.querySelector('#gemini-button').style.pointerEvents = 'auto';
                let responseJson;
                try {
                    responseJson = JSON.parse(aiResponse);
                } catch (error) {
                    console.warn("First JSON parsing failed. Trying again...");
                    responseJson = tryParseAgain(aiResponse);
                }
                const questionsTextarea = document.querySelector('textarea[name="questions"]');
                const coverLetterTextarea = document.querySelector('textarea[placeholder="Hi, my name is..."]');
                if (responseJson) {
                    const questionsContent = responseJson.questions || "";
                    const coverLetterContent = responseJson.coverLetter || "";
                    if (questionsTextarea) setText(questionsTextarea, convertMarkdownToUnicode(questionsContent))
                    if (coverLetterTextarea) setText(coverLetterTextarea, convertMarkdownToUnicode(coverLetterContent))
                } else {
                    console.error("Error: Response could not be parsed correctly after two attempts.");
                }
            } catch (error) {
                console.error("Error populating textareas:", error);
            }
        }
        function insertAllOrderFeedbackIcons() {
            document.querySelectorAll('.order-data').forEach(orderData => {
                const userElement = orderData.querySelector('.user');
                if (!userElement || orderData.querySelector('.order-feedback-icon')) return;

                const icon = document.createElement('img');
                icon.className = 'order-feedback-icon';
                icon.style.cssText = `
                width:16px;
                height:16px;
                margin-left:4px;
                vertical-align:middle;
                opacity:0;
                transition:opacity 0.5s ease;
                position:relative;
                display:inline-block;
                top:2px;
            `;
                userElement.insertAdjacentElement('afterend', icon);
            });
        }

        function showOrderFeedbackIcon(wrapperElement, state) {
            const orderData = wrapperElement.closest('.order-data');
            if (!orderData) return;

            const userElement = orderData.querySelector('.user');
            if (!userElement) return;

            let icon = orderData.querySelector('.order-feedback-icon');
            if (!icon) {
                icon = document.createElement('img');
                icon.className = 'order-feedback-icon';
                icon.style.cssText = `
                width:16px;
                height:16px;
                margin-left:4px;
                vertical-align:middle;
                opacity:0;
                transition:opacity 0.5s ease;
                position:relative;
                display:inline-block;
                top:2px;
            `;
                icon.alt = 'Loading...';
                userElement.insertAdjacentElement('afterend', icon);
            }

            if (state === 'loading') {
                icon.src = 'https://cdn-icons-png.flaticon.com/512/6356/6356625.png';
                icon.style.opacity = '1';
                icon.style.animation = 'spin 1s linear infinite';
            } else if (state === 'done') {
                icon.src = 'https://cdn-icons-png.flaticon.com/32/443/443138.png';
                icon.style.opacity = '1';
                icon.style.animation = 'none';
                setTimeout(() => {
                    icon.style.opacity = '0';
                }, 1000);
            }
        }

        function showOrderFeedbackIcon(wrapperElement, state) {
            const orderData = wrapperElement.closest('.order-data');
            if (!orderData) return;

            const userElement = orderData.querySelector('.user');
            if (!userElement) return;

            let icon = orderData.querySelector('.order-feedback-icon');
            if (!icon) {
                icon = document.createElement('img');
                icon.className = 'order-feedback-icon';
                icon.style.cssText = `
                width:16px;
                height:16px;
                margin-left:4px;
                vertical-align:middle;
                opacity:0;
                transition:opacity 0.5s ease;
                position:relative;
                display:inline-block;
                top:2px;
            `;
                icon.alt = 'Loading...';
                userElement.insertAdjacentElement('afterend', icon);
            }

            if (state === 'loading') {
                icon.src = 'https://cdn-icons-png.flaticon.com/512/6356/6356625.png';
                icon.style.opacity = '1';
                icon.style.animation = 'spin 1s linear infinite'; // <-- this line alone is NOT enough
                icon.style.animationName = 'spin';                 // <-- THIS is what was missing
                icon.style.animationDuration = '1s';
                icon.style.animationTimingFunction = 'linear';
                icon.style.animationIterationCount = 'infinite';
            } else if (state === 'done') {
                icon.src = 'https://cdn-icons-png.flaticon.com/32/443/443138.png';
                icon.style.opacity = '1';
                icon.style.animation = 'none';
                setTimeout(() => {
                    icon.style.opacity = '0';
                }, 1000);
            }
        }



        function tryParseAgain(rawResponse) {
            let jsonString;
            const markdownMatch = rawResponse.match(/```json\s*([\s\S]*?)\s*```/i);
            if (markdownMatch && markdownMatch[1]) {
                jsonString = markdownMatch[1].trim();
            } else {
                jsonString = rawResponse.replace(/```/g, '').trim();
            }
            try {
                return JSON.parse(jsonString);
            } catch (error) {
                console.error("Second attempt at parsing also failed.");
                return null;
            }
        }

        function collectData() {
            const title = document.querySelector('[tabid="tabs-4:tab-0"] h3')?.textContent || "No Title";
            const data = {};
            document.querySelectorAll('[tabid="tabs-4:tab-0"] h1').forEach(h1 => {
                const key = h1.textContent.trim();
                const value = h1.closest('div')?.querySelector('p')?.textContent.trim() || "No Value";
                data[key] = value;
            });
            return `Project Title: ${title}\nDetails:\n` +
                Object.entries(data).map(([key, value]) => `* ${key}: ${value}`).join("\n");
        }

        class GeminiClient {
            constructor() {
                this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
                this.preferredModel = 'gemini-2.0-flash';
                this.fallbackModel = 'gemini-1.5-flash';
                this.apiKey = null;
            }

            async init() {
                let apiKey = localStorage.getItem('gemini_api_key');
                if (!apiKey) {
                    apiKey = prompt('Please enter your Gemini API key:');
                    if (!apiKey) throw new Error('API key is required');
                    localStorage.setItem('gemini_api_key', apiKey);
                }
                this.apiKey = apiKey;
            }

            async request(model, prompt) {
                return fetch(`${this.baseUrl}/${model}:generateContent?key=${this.apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                });
            }

            sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

            async generateContent(prompt) {
                if (!this.apiKey) await this.init();

                // Try gemini-2.0-flash first
                let res = await this.request(this.preferredModel, prompt);
                if (res.ok) {
                    const data = await res.json();
                    return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
                }

                // If not rate limit, fail fast
                if (res.status !== 429) {
                    throw new Error(`HTTP error ${res.status}`);
                }

                // Fallback to gemini-1.5-flash
                const max429Retries = 2; // retry only for 429
                let attempts = 0;

                while (true) {
                    if (attempts > 0) await this.sleep(400 * attempts); // simple backoff for 429
                    res = await this.request(this.fallbackModel, prompt);

                    if (res.ok) {
                        const data = await res.json();
                        return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
                    }

                    if (res.status === 429 && attempts < max429Retries) {
                        attempts++;
                        continue; // retry only on 429
                    }

                    // one soft retry for transient 503 on fallback (no loop)
                    if (res.status === 503) {
                        await this.sleep(800);
                        const retry = await this.request(this.fallbackModel, prompt);
                        if (retry.ok) {
                            const data = await retry.json();
                            return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
                        }
                        throw new Error(`HTTP error ${retry.status}`);
                    }

                    throw new Error(`HTTP error ${res.status}`);
                }
            }
        }


        function insertIconButton() {
            const pElement = document.querySelector('form').closest('div');
            const button = document.createElement('button');
            button.style.border = 'none';
            button.id = 'gemini-button';
            button.style.background = 'transparent';
            button.style.cursor = 'pointer';
            button.title = 'Click to execute function';
            const icon = document.createElement('img');
            icon.src = 'https://camo.githubusercontent.com/77ba4ba362fc39151379e4e7691125c8bb130eb2ade811ce9f76d4d5236c6847/68747470733a2f2f75706c6f61642e77696b696d656469612e6f72672f77696b6970656469612f636f6d6d6f6e732f7468756d622f662f66302f476f6f676c655f426172645f6c6f676f2e7376672f3132303070782d476f6f676c655f426172645f6c6f676f2e7376672e706e67';
            icon.alt = 'Icon';
            icon.style.width = '24px';
            icon.style.height = '24px';
            button.appendChild(icon);
            const svgLoading = `<svg class="gemini-button-loading" style="display: none;" version="1.1" id="L4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve" width="20px" height="20px">
  <circle fill="#A7FFC9" stroke="none" cx="6" cy="50" r="6">
    <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.1"></animate>
  </circle>
  <circle fill="#A7FFC9" stroke="none" cx="26" cy="50" r="6">
    <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.2"></animate>
  </circle>
  <circle fill="#A7FFC9" stroke="none" cx="46" cy="50" r="6">
    <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.3"></animate>
  </circle>
</svg>`;
            button.addEventListener('click', function () {
                button.innerHTML += svgLoading;
                button.style.pointerEvents = 'none';
                document.querySelector('.gemini-button-loading').style.display = 'block';
                document.querySelector('#gemini-button img').style.display = 'none';
                generateAndPopulateTextareas();
            });
            pElement.parentElement.insertBefore(button, pElement);
            document.querySelector('#gemini-button').parentElement.insertAdjacentHTML('beforeend', svgLoading);
        }

        function insertSecondButton() {
            const pElement = document.querySelector('form').closest('div');
            const aiButton = document.createElement('button');
            aiButton.style.border = 'none';
            aiButton.id = 'ai-custom-button';
            aiButton.style.background = 'transparent';
            aiButton.style.cursor = 'pointer';
            aiButton.style.marginLeft = '10px';
            aiButton.title = 'Provide custom question ideas';

            const icon = document.createElement('img');
            icon.src = 'https://cdn-icons-png.flaticon.com/512/7563/7563562.png';
            icon.alt = 'AI Custom';
            icon.style.width = '24px';
            icon.style.height = '24px';
            aiButton.appendChild(icon);

            // Add loading indicator
            const svgLoading = `<svg class="ai-custom-loading" style="display: none;" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve" width="20px" height="20px">
      <circle fill="#A7FFC9" stroke="none" cx="6" cy="50" r="6">
        <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.1"></animate>
      </circle>
      <circle fill="#A7FFC9" stroke="none" cx="26" cy="50" r="6">
        <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.2"></animate>
      </circle>
      <circle fill="#A7FFC9" stroke="none" cx="46" cy="50" r="6">
        <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.3"></animate>
      </circle>
    </svg>`;

            aiButton.addEventListener('click', function () {
                const customPrompt = prompt('Enter your question ideas or topics you want to ask the client:');
                if (customPrompt) {
                    aiButton.innerHTML += svgLoading;
                    aiButton.style.pointerEvents = 'none';
                    document.querySelector('.ai-custom-loading').style.display = 'block';
                    icon.style.display = 'none';
                    generateCustomContent(customPrompt);
                }
            });

            // Insert after the existing gemini button
            const existingButton = document.querySelector('#gemini-button');
            if (existingButton) {
                existingButton.parentElement.insertBefore(aiButton, existingButton.nextSibling);
            } else {
                pElement.parentElement.insertBefore(aiButton, pElement);
            }

            // Add the loading SVG to the DOM
            aiButton.parentElement.insertAdjacentHTML('beforeend', svgLoading);
        }

        async function generateCustomContent(customPrompt) {
            try {
                const gemini = new GeminiClient();
                const collectedData = collectData();
                const prompt = `{
            "messages": [
                {
                    "role": "system",
                    "content": "You are a professional assistant skilled at generating concise, client-focused responses. Your goal is to Generate output in the following JSON format without any extraneous text or markdown. Context is: the user is trying to apply in a freelance work/project and you need to help him. Include the following question ideas from the user in your generated questions: '${customPrompt}'\\n\\nExample Response Format:\\n{\\n  \\"questions\\": \\"Generated questions here\\",\\n  \\"coverLetter\\": \\"Generated cover letter here\\"}\\n\\nContext about the user:\\nName: Noushad\\nProfession: Web Developer and Programmer specializing in business automation, Google Apps Script, Userscript, and Python.\\nExperience: Over 5 years of industry experience, 328+ successful projects, and a 4.9/5 rating from 224 reviews.\\nServices: Custom browser extensions, Google Apps Script automations, data processing, web development, and bug fixing for HTML, CSS, JavaScript, and Python.\\nAchievements: Saved clients over 20 hours per week and improved efficiency by 30%.\\n\\nInclude the project details in your analysis and tailor the response accordingly."
                },
                {
                    "role": "user",
                    "content": "Project Details: ${collectedData}"
                }
            ],
            "json_schema": {
                "name": "client_interaction",
                "schema": {
                    "type": "object",
                    "properties": {
                        "questions": {
                            "type": "string",
                            "description": "Relevant questions to clarify client requirements and about the project, incorporating the user's question ideas. Must return with each of question's new line."
                        },
                        "coverLetter": {
                            "type": "string",
                            "description": "A concise, conversational, professional cover letter to engage the client."
                        }
                    },
                    "required": ["questions", "coverLetter"],
                    "additionalProperties": false
                }
            }
        }`;

                const aiResponse = await gemini.generateContent(prompt);
                if (aiResponse) {
                    document.querySelector('.ai-custom-loading').style.display = 'none';
                    document.querySelector('#ai-custom-button img').style.display = 'block';
                }
                document.querySelector('#ai-custom-button').style.pointerEvents = 'auto';

                let responseJson;
                try {
                    responseJson = JSON.parse(aiResponse);
                } catch (error) {
                    console.warn("First JSON parsing failed. Trying again...");
                    responseJson = tryParseAgain(aiResponse);
                }

                const questionsTextarea = document.querySelector('textarea[name="questions"]');
                const coverLetterTextarea = document.querySelector('textarea[placeholder="Hi, my name is..."]');

                if (responseJson) {
                    const questionsContent = responseJson.questions || "";
                    const coverLetterContent = responseJson.coverLetter || "";
                    if (questionsTextarea) setText(questionsTextarea, convertMarkdownToUnicode(questionsContent))
                    if (coverLetterTextarea) setText(coverLetterTextarea, convertMarkdownToUnicode(coverLetterContent))
                } else {
                    console.error("Error: Response could not be parsed correctly after two attempts.");
                }
            } catch (error) {
                console.error("Error generating custom content:", error);
            }
        }

        // Add this function to fix the AI reply generation
        function addAIReplyButton() {
            // Only run on order pages
            if (!window.location.href.includes('/orders/')) return;

            // Check if button already exists to prevent duplicates
            if (document.querySelector('.ai-reply-button')) return;

            // Find the target element
            const targetElement = document.querySelectorAll('.title-content .stamp')[0]?.parentElement?.parentElement;
            if (!targetElement) return;

            // Create the AI reply button
            const button = document.createElement('button');
            button.className = 'ai-reply-button';
            button.title = 'Generate Reply';
            button.style.cssText = `
        background: transparent;
        border: none;
        cursor: pointer;
        margin-left: 10px;
        display: inline-flex;
        align-items: center;
        position: relative;
        top: 2px;
    `;

            // Add icon
            const icon = document.createElement('img');
            icon.src = 'https://cdn1.iconfinder.com/data/icons/artificial-intelligence-280/64/Chat_AI_Prompt_Chatbot_Text_Message-512.png';
            icon.style.width = '24px';
            icon.style.height = '24px';
            button.appendChild(icon);

            // Add loading indicator
            const loadingSVG = `
        <svg class="ai-reply-loading" style="display: none; position: absolute;" width="24" height="24" viewBox="0 0 100 100">
            <circle fill="#1dbf73" stroke="none" cx="20" cy="50" r="10">
                <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.1"/>
            </circle>
            <circle fill="#1dbf73" stroke="none" cx="50" cy="50" r="10">
                <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.3"/>
            </circle>
            <circle fill="#1dbf73" stroke="none" cx="80" cy="50" r="10">
                <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.5"/>
            </circle>
        </svg>
    `;
            button.insertAdjacentHTML('afterbegin', loadingSVG);

            // Add click handler
            button.addEventListener('click', generateOrderAIReply);

            // Insert button
            targetElement.appendChild(button);
        }

        async function generateOrderAIReply() {
            // Show loading state
            const button = document.querySelector('.ai-reply-button');
            const icon = button.querySelector('img');
            const loading = button.querySelector('.ai-reply-loading');

            icon.style.display = 'none';
            loading.style.display = 'block';

            try {
                // Get the conversation history
                const conversation = convertFiverrChatToText();

                // Prompt user for direction
                const userCommand = window.prompt('What kind of reply would you like to generate?');

                if (!userCommand) {
                    // User cancelled
                    icon.style.display = 'block';
                    loading.style.display = 'none';
                    return;
                }

                // Create the prompt text
                const promptText = `You are a helpful assistant for a Fiverr seller named Noushad who's responding to a client.
 
Here is the conversation history:
${conversation}
 
Noushad wants to send a conversational styled (no e-mail style) reply that is: ${userCommand}
 
Generate a professional and friendly response that Noushad can send to this client. The response should be appropriately formatted and ready to paste directly into the chat. Keep it concise (under 150 words) while addressing the client's needs.`;

                // Use the existing GeminiClient
                const aiClient = new GeminiClient();

                // Generate the AI response
                const aiResponse = await aiClient.generateContent(promptText);

                // Find the message textarea and directly insert the text
                const messageBox = document.querySelector('textarea');
                if (messageBox) {
                    setText(messageBox, aiResponse);
                } else {
                    console.error("Couldn't find message box to insert text");
                }
            } catch (error) {
                console.error('Error generating AI reply:', error);
                alert('Error generating AI reply: ' + error.message);
            } finally {
                // Reset button state
                icon.style.display = 'block';
                loading.style.display = 'none';
            }
        }

        function convertFiverrChatToText() {
            // Find all message sections
            const messageSections = document.querySelectorAll('.activity-wrap.is-message');

            let conversation = "";

            // Process each message section
            messageSections.forEach(section => {
                // Get the message content
                const messageContent = section.querySelector('.message-content')?.textContent.trim();
                if (!messageContent) return; // Skip if no content

                // Determine the sender by looking for specific elements
                const clientElement = section.querySelector('.stamp.link.message-sent');
                const sender = clientElement ? "Client" : "Me";

                // Add to conversation
                conversation += `${sender}: ${messageContent}\n`;
            });

            return conversation;
        }

        // --- Timezone Converter for Inbox (Constant Offset, Dual Input + Slider, aside insertion, optimized) ---
        // v0.2.34 Timezone converter optimized for efficiency and minimal DOM impact
        let tzConverterObserver = null;
        function insertTimezoneConverter() {
            if (!window.location.href.includes('/inbox/')) return;
            const timeEls = document.querySelectorAll('header time');
            //if (timeEls.length < 2) return;
            const buyerTimeEl = timeEls[timeEls.length - 1];
            const header = buyerTimeEl.closest('header');
            if (!header) return;
            const aside = header.querySelector('aside');
            if (!aside) return;
            if (aside.querySelector('#tz-converter-wrapper')) return;

            function parseTime12(str) {
                const match = str.match(/(\d{1,2}):(\d{2})\s*([AP]M)/i);
                if (!match) return null;
                let hour = parseInt(match[1], 10);
                const min = parseInt(match[2], 10);
                const ampm = match[3].toUpperCase();
                if (ampm === 'PM' && hour !== 12) hour += 12;
                if (ampm === 'AM' && hour === 12) hour = 0;
                return { hour, min };
            }
            function formatTime12(hour, min) {
                const ampm = hour >= 12 ? 'PM' : 'AM';
                let h = hour % 12;
                if (h === 0) h = 12;
                return `${h}:${min.toString().padStart(2, '0')} ${ampm}`;
            }
            function clampTime(hour, min) {
                hour = ((hour % 24) + 24) % 24;
                min = ((min % 60) + 60) % 60;
                return { hour, min };
            }
            function addMinutes(time, delta) {
                let total = time.hour * 60 + time.min + delta;
                let hour = Math.floor((total / 60) % 24);
                let min = ((total % 60) + 60) % 60;
                if (hour < 0) hour += 24;
                return { hour, min };
            }

            const buyerTimeStr = buyerTimeEl.textContent.trim();
            const buyerTime = parseTime12(buyerTimeStr);
            if (!buyerTime) return;

            const now = new Date();
            let userLocalHour = now.getHours();
            let userLocalMin = now.getMinutes();

            let buyerTotalMin = buyerTime.hour * 60 + buyerTime.min;
            let userTotalMin = userLocalHour * 60 + userLocalMin;
            let initialOffsetMin = userTotalMin - buyerTotalMin;
            if (initialOffsetMin < -12 * 60) initialOffsetMin += 24 * 60;
            if (initialOffsetMin > 14 * 60) initialOffsetMin -= 24 * 60;

            let shiftMin = 0; // slider value in minutes
            let constantOffsetMin = initialOffsetMin; // Now mutable

            // Create wrapper
            const wrapper = document.createElement('span');
            wrapper.className = 'tz-converter-wrapper';
            wrapper.id = 'tz-converter-wrapper';
            wrapper.style.cssText = 'display:inline-flex;align-items:center;margin-left:12px;gap:6px;';

            // Buyer input
            const buyerInput = document.createElement('input');
            buyerInput.type = 'text';
            buyerInput.value = formatTime12(buyerTime.hour, buyerTime.min);
            buyerInput.style.cssText = 'width:70px;font-size:13px;text-align:center;border:1px solid #ccc;border-radius:4px;padding:2px 4px;';
            wrapper.appendChild(buyerInput);

            // Slider
            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = -12 * 60;
            slider.max = 14 * 60;
            slider.step = 15; // 15 min steps
            slider.value = 0;
            slider.style.width = '90px';
            wrapper.appendChild(slider);

            // User input
            const userInput = document.createElement('input');
            userInput.type = 'text';
            userInput.value = formatTime12(userLocalHour, userLocalMin);
            userInput.style.cssText = 'width:70px;font-size:13px;text-align:center;border:1px solid #ccc;border-radius:4px;padding:2px 4px;';
            wrapper.appendChild(userInput);

            // Difference display
            const diffSpan = document.createElement('span');
            diffSpan.style.cssText = 'font-size:11px;color:#888;margin-left:6px;';
            wrapper.appendChild(diffSpan);

            function updateUI(from) {
                let buyerNow = addMinutes(buyerTime, shiftMin);
                let userNow = addMinutes(buyerNow, constantOffsetMin);
                buyerInput.value = formatTime12(buyerNow.hour, buyerNow.min);
                userInput.value = formatTime12(userNow.hour, userNow.min);
                slider.value = shiftMin;
                let diffH = constantOffsetMin / 60;
                let sign = diffH > 0 ? '+' : (diffH < 0 ? '-' : '±');
                diffSpan.textContent = `(${sign}${Math.abs(diffH).toFixed(2)}h vs buyer)`;
            }

            // Use direct listeners for clarity and performance
            buyerInput.addEventListener('change', () => {
                const t = parseTime12(buyerInput.value);
                if (!t) {
                    updateUI();
                    return;
                }
                // Recalculate offset based on new buyer time and current user time
                const now = new Date();
                let currentUserHour = now.getHours();
                let currentUserMin = now.getMinutes();
                let newBuyerTotalMin = t.hour * 60 + t.min;
                let currentUserTotalMin = currentUserHour * 60 + currentUserMin;
                let newOffsetMin = currentUserTotalMin - newBuyerTotalMin;
                if (newOffsetMin < -12 * 60) newOffsetMin += 24 * 60;
                if (newOffsetMin > 14 * 60) newOffsetMin -= 24 * 60;
                constantOffsetMin = newOffsetMin;
                // Reset shift to 0 since we're setting a new base
                shiftMin = 0;
                // Update only user input and slider, keep buyer input as entered
                let userNow = addMinutes(t, constantOffsetMin);
                userInput.value = formatTime12(userNow.hour, userNow.min);
                slider.value = shiftMin;
                let diffH = constantOffsetMin / 60;
                let sign = diffH > 0 ? '+' : (diffH < 0 ? '-' : '±');
                diffSpan.textContent = `(${sign}${Math.abs(diffH).toFixed(2)}h vs buyer)`;
            });
            userInput.addEventListener('change', () => {
                const t = parseTime12(userInput.value);
                if (!t) {
                    updateUI();
                    return;
                }
                let inputMin = t.hour * 60 + t.min;
                let origMin = buyerTime.hour * 60 + buyerTime.min + constantOffsetMin;
                shiftMin = inputMin - origMin;
                updateUI('user');
            });
            slider.addEventListener('input', () => {
                shiftMin = parseInt(slider.value, 10);
                updateUI('slider');
            });

            updateUI('init');
            aside.appendChild(wrapper);
        }

        // Efficient observer for inbox header/aside only
        function setupTzConverterObserver() {
            if (!window.location.href.includes('/inbox/')) {
                if (tzConverterObserver) {
                    tzConverterObserver.disconnect();
                    tzConverterObserver = null;
                }
                return;
            }
            if (tzConverterObserver) return; // Already set up
            let debounceTimer = null;
            tzConverterObserver = new MutationObserver(() => {
                if (debounceTimer) clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    insertTimezoneConverter();
                }, 100);
            });
            // Only observe the main content area for header/aside changes
            const main = document.querySelector('main');
            if (main) {
                tzConverterObserver.observe(main, { childList: true, subtree: true });
            } else {
                tzConverterObserver.observe(document.body, { childList: true, subtree: true });
            }
            // Initial run
            insertTimezoneConverter();
        }

        // Setup observer on DOMContentLoaded and on navigation
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupTzConverterObserver);
        } else {
            setupTzConverterObserver();
        }
        window.addEventListener('popstate', setupTzConverterObserver);
        window.addEventListener('pushstate', setupTzConverterObserver);
        window.addEventListener('replaceState', setupTzConverterObserver);


        // Add to your existing code
        if (window.location.href.includes('briefs/overview/matches') && window.location.href.includes('?type=question')) {
            setInterval(() => {
                if (!document.querySelector('#gemini-button')) {
                    insertIconButton();
                }
                if (!document.querySelector('#ai-custom-button')) {
                    insertSecondButton();
                }
            }, 1000);
        }
    });

})();