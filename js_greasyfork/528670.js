// ==UserScript==
// @name         2ch Project Redesign - Enhanced
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Комплексный редизайн для 2ch.hk
// @author       You
// @match        https://2ch.hk/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528670/2ch%20Project%20Redesign%20-%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/528670/2ch%20Project%20Redesign%20-%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration (with persistence) ---
    const defaultConfig = {
        enableCollapsibleThreads: true,
        enableSmoothScrolling: true,
        enableImageZoom: true,
        enablePostHighlighting: true,
        shadowStrength: 'medium', // 'subtle', 'medium', 'strong'
        enableQuickReplyAbove: false,
        enableAutoUpdate: true,     // Auto-update the thread when enabled
    };

    // Load config from storage
    let config = GM_getValue("dvach_redesign_config", defaultConfig);

    // --- Shadow Styles ---
    const shadowStyles = {
        subtle: '0 2px 5px rgba(0,0,0,0.1)',
        medium: '0 4px 8px rgba(0,0,0,0.2)',
        strong: '0 6px 12px rgba(0,0,0,0.3)',
    };
    const selectedShadow = shadowStyles[config.shadowStrength] || shadowStyles.medium;

    // --- CSS ---
    GM_addStyle(`
        body {
            font-family: sans-serif;
            line-height: 1.6;
            margin: 20px;
            background-color: var(--theme_default_bg, #f0f0f0);
            color: var(--theme_default_text, #333);
        }

        header, main, aside, footer {
            margin-bottom: 20px;
            padding: 15px;
            background-color: var(--theme_default_postbg, #fff);
            border-radius: 8px;
            box-shadow: ${selectedShadow};
        }

        a {
            color: var(--theme_default_link, #007bff);
            text-decoration: none;
        }

        a:hover {
            text-decoration: underline;
        }

        .cntnt {
            display: flex;
            flex-wrap: wrap;
        }

        .cntnt__aside {
            width: 250px;
            margin-right: 20px;
        }

        .cntnt__main {
            flex: 1;
        }

        .post {
            margin-bottom: 15px;
            padding: 10px;
            border: 1px solid var(--theme_default_border, #ddd);
            border-radius: 5px;
            background-color: var(--theme_default_postbg, #f9f9f9);
            transition: background-color 0.2s ease;
            box-shadow: ${selectedShadow};
        }

        /* Post Highlighting */
        ${config.enablePostHighlighting ? `
        .post:hover {
            background-color: var(--theme_default_postbghighlight, #e9ecef);
        }
        ` : ''}

        /* Improved comment structure styling */
        .post_type_reply {
            margin-left: 20px;
            border-left: 3px solid var(--theme_default_link, #007bff);
            padding-left: 10px;
        }
        .post_type_reply:before {
            content: none;
        }


        .post__details {
            font-size: 0.9em;
            color: var(--theme_default_alttext, #777);
        }

        .post__message {
            margin-top: 10px;
        }

        .postform {
            width: 100%;
        }

        .input, .button {
            padding: 8px;
            margin-bottom: 8px;
            border: 1px solid var(--theme_default_btnborder, #ccc);
            border-radius: 4px;
        }

        .button {
            background-color: var(--theme_default_link, #007bff);
            color: white;
            cursor: pointer;
        }

        .button:hover {
            background-color: #0056b3;
        }

        .qr {
            background-color: var(--theme_default_postbg, #fff);
            border: 1px solid var(--theme_default_border, #ccc);
            border-radius: 4px;
            padding: 10px;
            margin-bottom: 10px;
			box-shadow: ${selectedShadow};
        }

        .qr__header {
            font-weight: bold;
            margin-bottom: 5px;
            color: var(--theme_default_text, #333);
        }
		.post__images img {
			max-width: 300px;
			height: auto;
			border-radius: 5px;
			margin-right: 10px;
			margin-bottom: 5px;
		}

        /* More general styling for a cleaner look */
        hr {
            border: none;
            border-top: 1px solid var(--theme_default_border, #ccc);
            margin: 20px 0;
        }

		.header__title {
			text-align: center;
			font-size: 2em;
			margin-bottom: 20px;
		}

		/* Basic mobile-responsiveness */
		@media (max-width: 768px) {
			.cntnt {
				flex-direction: column;
			}

			.cntnt__aside {
				width: 100%;
				margin-right: 0;
			}

			.post_type_reply{
				margin-left: 0;
			}
		}

		/* Specific to address sidebar coloring */
		.fm__header {
			background-color: var(--theme_default_postbg);
			color: var(--theme_default_text);
		}

		.fm__sub li a {
			color: var(--theme_default_link); /* Links in sidebar */
		}

        /* Image Zoom */
        ${config.enableImageZoom ? `
        .post__image-link {
            display: inline-block;
            position: relative;
            overflow: hidden;
        }
        .post__image-link:hover img {
            transform: scale(1.2);
            transition: transform 0.2s ease;
            cursor: zoom-in;
        }
        `: ''}

        /* Collapsible Threads */
        ${config.enableCollapsibleThreads ? `
        .thread__collapse-button {
            cursor: pointer;
            color: var(--theme_default_link, #007bff);
            margin-left: 5px;
            font-size: 0.8em;
        }
        .thread__replies.collapsed {
            display: none;
        }
        ` : ''}

        /* Settings Menu Styles */
        #dvach-settings-menu {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: var(--theme_default_postbg, #fff);
            border: 1px solid var(--theme_default_border, #ccc);
            border-radius: 5px;
            padding: 20px;
            z-index: 1000;
            box-shadow: ${selectedShadow};
            min-width: 300px;
        }

        #dvach-settings-menu h2 {
            margin-top: 0;
            margin-bottom: 15px;
            color: var(--theme_default_text, #333);
        }

        #dvach-settings-menu label {
            display: block;
            margin-bottom: 8px;
            color: var(--theme_default_text, #333);
        }
        #dvach-settings-menu select{
            margin-bottom: 8px;
        }

        #dvach-settings-menu button {
            margin-top: 10px;
        }

        #dvach-settings-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 999;
            display: none;
        }
        .newpost__wrapper{
            position: relative;
        }
        #qr-container-top{
            position: absolute;
            top: 35px;
            width: 100%;
        }
        #qr-container-bottom {
            position: relative;
        }

        /* Auto-Update Styling*/

        .autorefresh.modified {
            font-weight: bold;
        }

    `);

    // --- Functions ---
    function GM_addStyle(css) {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
        return style; // Return the style element
    }
    // Collapsible Threads
    function addThreadCollapse() {
        if (!config.enableCollapsibleThreads) return;

        document.querySelectorAll('.thread').forEach(thread => {
            const opPost = thread.querySelector('.post_type_oppost');
            if (!opPost) return;

            const replies = thread.querySelector('.thread__replies') || thread;

            const collapseButton = document.createElement('span');
            collapseButton.classList.add('thread__collapse-button');
            collapseButton.textContent = '[Свернуть]';
            collapseButton.addEventListener('click', () => {
                replies.classList.toggle('collapsed');
                collapseButton.textContent = replies.classList.contains('collapsed') ? '[Развернуть]' : '[Свернуть]';
            });

             // Insert before the refmap, or at the end of details if no refmap
            const refmap = opPost.querySelector('.post__refmap');
			const details = opPost.querySelector(".post__details")
            if (refmap) {
                details.insertBefore(collapseButton, refmap);
            } else {
                details.appendChild(collapseButton);
            }
        });
    }


    // Smooth Scrolling
    function smoothScrollTo(target) {
        if (!config.enableSmoothScrolling) {
            window.location.hash = target;
            return;
        }

        const element = document.querySelector(target);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    function setupSmoothScrollLinks() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                smoothScrollTo(this.getAttribute('href'));
            });
        });
    }


    // --- Settings Menu ---
    function createSettingsMenu() {
        const overlay = document.createElement('div');
        overlay.id = "dvach-settings-overlay";
        document.body.appendChild(overlay);

        const menu = document.createElement('div');
        menu.id = "dvach-settings-menu";
        menu.innerHTML = `
            <h2>Настройки Dвач Redesign</h2>
            <label><input type="checkbox" data-setting="enableCollapsibleThreads"> Сворачиваемые треды</label>
            <label><input type="checkbox" data-setting="enableSmoothScrolling"> Плавная прокрутка</label>
            <label><input type="checkbox" data-setting="enableImageZoom"> Увеличение изображений при наведении</label>
            <label><input type="checkbox" data-setting="enablePostHighlighting"> Подсветка постов при наведении</label>
            <label><input type="checkbox" data-setting="enableQuickReplyAbove"> Быстрый ответ сверху треда</label>
            <label><input type="checkbox" data-setting="enableAutoUpdate"> Автообновление треда</label>
            <label>
                Сила теней:
                <select data-setting="shadowStrength">
                    <option value="subtle">Слабая</option>
                    <option value="medium">Средняя</option>
                    <option value="strong">Сильная</option>
                </select>
            </label>
            <button id="dvach-settings-save">Сохранить</button>
            <button id="dvach-settings-cancel">Отмена</button>
        `;

        document.body.appendChild(menu);

        // Event listeners for checkboxes
        menu.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            const settingName = checkbox.dataset.setting;
            checkbox.checked = config[settingName]; // Set initial state

            checkbox.addEventListener('change', () => {
                config[settingName] = checkbox.checked;
                // No need to save here; save on "Сохранить"
            });
        });

        // Event listener for select
        menu.querySelector('select').addEventListener('change', (event) => {
            config.shadowStrength = event.target.value;
             // No need to save here; save on "Сохранить"
        });

        // Set initial value for the select dropdown
        menu.querySelector(`select[data-setting="shadowStrength"]`).value = config.shadowStrength;


        // Save button
        document.getElementById('dvach-settings-save').addEventListener('click', () => {
            GM_setValue("dvach_redesign_config", config); // Save ALL settings
            menu.style.display = 'none';
            overlay.style.display = 'none';
            location.reload(); // Simplest way to apply changes
        });

        // Cancel button
        document.getElementById('dvach-settings-cancel').addEventListener('click', () => {
            menu.style.display = 'none';
            overlay.style.display = 'none';
        });

        // Add to settings link
        const settingsLink = document.getElementById('settings'); // Existing settings link on Dvach
        if(settingsLink) {
			settingsLink.addEventListener('click', (e) => {
				e.preventDefault();
				menu.style.display = 'block';
                overlay.style.display = 'block';
			});
        }
    }

    // --- Quick reply box logic ---
    function createQuickReplyBoxes() {
        if(config.enableQuickReplyAbove){
            // Quick reply box above the thread
            const threadContainerTop = document.querySelector("#TopNormalReply");
            if(threadContainerTop) {
                const qrContainerTop = document.createElement("div");
                qrContainerTop.id = "qr-container-top";
                const qrFormTop = document.getElementById("qr-postform").cloneNode(true);

                // Clear any previous event listeners before adding our own.
                const newSubmitTop = qrFormTop.querySelector("#qr-submit");
                const clonedSubmitTop = newSubmitTop.cloneNode(true);
                newSubmitTop.parentNode.replaceChild(clonedSubmitTop, newSubmitTop);

                clonedSubmitTop.addEventListener("click", (e) => {
                    e.preventDefault();
                    document.getElementById("qr-postform").querySelector("#qr-shampoo").value = qrFormTop.querySelector("#qr-shampoo").value
                    document.getElementById("qr-postform").requestSubmit();
                })
                qrContainerTop.appendChild(qrFormTop);
                threadContainerTop.appendChild(qrContainerTop);
            }
        }
        // Quick reply box at the bottom of thread.
        const threadContainerBot = document.getElementById("BottomNormalReply");

        if(threadContainerBot) {
            const qrContainerBot = document.createElement("div");
            qrContainerBot.id = "qr-container-bottom";
            const qrFormBot = document.getElementById("qr-postform").cloneNode(true);

            // Clear any previous event listeners before adding our own.
            const newSubmitBot = qrFormBot.querySelector("#qr-submit");
            const clonedSubmitBot = newSubmitBot.cloneNode(true);
            newSubmitBot.parentNode.replaceChild(clonedSubmitBot, newSubmitBot);

            clonedSubmitBot.addEventListener("click", (e) => {
                e.preventDefault();
                document.getElementById("qr-postform").querySelector("#qr-shampoo").value = qrFormBot.querySelector("#qr-shampoo").value
                document.getElementById("qr-postform").requestSubmit();
            });
            qrContainerBot.appendChild(qrFormBot);
            threadContainerBot.appendChild(qrContainerBot);
        }
    }

    // --- Auto-Update ---
    function autoUpdateThread() {
        if (config.enableAutoUpdate) {
            const autoRefreshCheckbox = document.querySelector('.js-refresh-checkbox');
            if (autoRefreshCheckbox && !autoRefreshCheckbox.checked) {
                autoRefreshCheckbox.click(); // Simulate a click to enable it.
				autoRefreshCheckbox.parentElement.classList.add('modified');
            }
        }
    }

    // --- Initialization ---

    // Simplify Aside
    const aside = document.querySelector('.cntnt__aside aside');
    if (aside) {
        const fmSubLists = aside.querySelectorAll('.fm__sub');
        const fmList = aside.querySelector('#fmenu');
        fmSubLists.forEach(subList => {
            Array.from(subList.children).forEach(listItem => {
                fmList.appendChild(listItem);
            });
            subList.remove();
        });
    }

    addThreadCollapse();
    setupSmoothScrollLinks();
    createSettingsMenu();
    createQuickReplyBoxes()
    autoUpdateThread(); // Enable auto-update based on config

    // Fix for quick reply close.
    window.addEventListener('load', () => {
        const qrClose = document.getElementById('qr-close');
        if (qrClose) {
            const qrBox = document.getElementById('qr');
			const displayQr = qrBox.style.display;

            //Clear any previous event listners before adding our own
			if (!qrClose.getAttribute('listener')) {
            	qrClose.addEventListener('click', () => {
            	    qrBox.style.display = 'none';
            	});
				qrClose.setAttribute('listener', 'true');
			}
        }
    });

    // --- Tampermonkey Menu Commands ---
    GM_registerMenuCommand("Настройки Dвач Redesign", () => {
        document.getElementById('dvach-settings-menu').style.display = 'block';
        document.getElementById('dvach-settings-overlay').style.display = 'block';
    });
})();