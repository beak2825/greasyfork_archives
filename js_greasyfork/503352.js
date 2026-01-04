 // ==UserScript==
// @name         Slash's Modmenu (4.0.1)
// @version      4.0.1
// @namespace    slash.gay
// @license      MIT
// @description  A sleek and modern C.AI modmenu
// @author       Slash
// @match        https://*.character.ai/*
// @exclude      https://pay.character.ai/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         https://cdn.slash.gay/r/ModMenu-Logo.png
// @downloadURL https://update.greasyfork.org/scripts/503352/Slash%27s%20Modmenu%20%28401%29.user.js
// @updateURL https://update.greasyfork.org/scripts/503352/Slash%27s%20Modmenu%20%28401%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const cssStyles = `
        /* css hehe */
        .overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .popup {
            background-color: #fff;
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 5px;
            text-align: center;
        }

        .loading-text {
            color: #fff;
            font-size: 24px;
        }

        .modmenu {
            position: fixed;
            background-color: #333232;
            border-radius: 5px;
            padding: 10px;
            z-index: 9999;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            width: 300px;
            height: 550px;
            cursor: default; /* Default cursor style */
        }

        .modmenu h3 {
            margin-top: 0;
            cursor: move; /* Cursor style for draggable */
            user-select: none; /* Prevent text selection */
            -moz-user-select: none;
            -webkit-user-select: none;
            -ms-user-select: none;
        }

        .minimize-button {
            position: absolute;
            top: 5px;
            right: 5px;
            background: none;
            border: none;
            font-size: 20px;
            font-weight: bold;
            cursor: pointer;
        }

        .module-list {
            max-height: 470px;
            overflow-y: auto;
        }

        .module-box {
            padding: 10px;
            margin: 5px 0;
            border-radius: 5px;
            display: flex;
            flex-direction: column;
            background-color: #404040;
        }

        .module-title {
            font-size: 16px;
            margin-bottom: 5px;
        }

        .module-description {
            font-size: 14px;
            margin-bottom: 5px;
        }

        .module-details {
            font-size: 10px;
            color: #888;
        }

        .module-toggle {
            margin-top: auto;
        }

        .reload-message {
            background-color: yellow;
            padding: 10px;
            margin-top: 10px;
            display: none;
        }

        .version {
            font-size: 12px;
            margin-top: 10px;
        }

        .module-list a {
            color: #007bff;
        }
    `;

    const hasAcceptedTOS = GM_getValue('acceptedTOS', true);
    const modmenuState = GM_getValue('modmenuState', { minimized: false, position: { top: '15px', right: '15px' } });
    let repositories = JSON.parse(localStorage.getItem('repositories')) || [];

    GM_addStyle(cssStyles);

    if (!hasAcceptedTOS) {
        showTermsOfServicePopup();
    }

    function showTermsOfServicePopup() {
        const popupOverlay = document.createElement('div');
        popupOverlay.classList.add('overlay');

        const popup = document.createElement('div');
        popup.classList.add('popup');

        const title = document.createElement('h3');
        title.textContent = "Slash's Modmenu";
        title.id = 'terms-and-stuff'
        popup.appendChild(title);

        const description = document.createElement('p');
        description.textContent = "By using Slash's Modmenu, you must agree to our Terms of Service and Privacy Policy.";
        description.id = 'terms-and-stuff'
        popup.appendChild(description);

        const termsCheckbox = document.createElement('input');
        termsCheckbox.type = 'checkbox';
        termsCheckbox.id = 'termsCheckbox';
        termsCheckbox.id = 'terms-and-stuff'
        const termsLabel = document.createElement('label');
        termsLabel.htmlFor = 'termsCheckbox';
        termsLabel.textContent = ' I agree to the Terms of Service and Privacy Policy';
        popup.appendChild(termsCheckbox);
        popup.appendChild(termsLabel);

        const tosLink = createLink('Terms of Service', 'https://example.com/tos');
        const privacyLink = createLink('Privacy Policy', 'https://example.com/privacy');

        popup.appendChild(document.createElement('br'));
        popup.appendChild(tosLink);
        popup.appendChild(document.createTextNode(' and '));
        popup.appendChild(privacyLink);
        popup.appendChild(document.createElement('br'));

        const acceptButton = document.createElement('button');
        acceptButton.id = 'terms-and-stuff'
        acceptButton.textContent = 'Continue';
        acceptButton.addEventListener('click', function() {
            if (termsCheckbox.checked) {
                GM_setValue('acceptedTOS', true);
                document.body.removeChild(popupOverlay);
                location.reload();
            }
        });
        popup.appendChild(acceptButton);

        popupOverlay.appendChild(popup);
        document.body.appendChild(popupOverlay);
    }

    function createLink(text, url) {
        const link = document.createElement('a');
        link.textContent = text;
        link.href = url;
        link.target = '_blank';
        return link;
    }

    if (hasAcceptedTOS) {
        const loadingOverlay = document.createElement('div');
        loadingOverlay.classList.add('overlay');
        document.body.appendChild(loadingOverlay);

        const loadingText = document.createElement('div');
        loadingText.classList.add('loading-text');
        loadingText.textContent = '|';
        loadingOverlay.appendChild(loadingText);

        const loadingAnimation = ['|', '/', '-', '\\'];
        let currentAnimationIndex = 0;
        setInterval(() => {
            loadingText.textContent = loadingAnimation[currentAnimationIndex];
            currentAnimationIndex = (currentAnimationIndex + 1) % loadingAnimation.length;
        }, 200);

        setTimeout(() => {
            loadingOverlay.style.display = 'none';

            const modmenu = document.createElement('div');
            modmenu.classList.add('modmenu');
            modmenu.style.top = modmenuState.position.top;
            modmenu.style.right = modmenuState.position.right;

            const title = document.createElement('h3');
            title.textContent = "Slash's Modmenu";
            modmenu.appendChild(title);


            const moduleList = document.createElement('div');
            moduleList.classList.add('module-list');

            const modules = [{
                title: 'Hey!',
                description: 'This modmenu is under heavy development! Please report any bugs to me(at)slash(dot)gay, thanks!',
                author: 'This is not a module',
                defaultStatus: true,
                code:                 function() {
                    console.log("what");
                }
            },
                             { // NOT YET WORKING ON NEW WEBSITE --- LOW PRIORITY
                                 title: 'Not yet supported - New logo',
                                 description: 'Adds a needed logo change',
                                 author: 'Slash',
                                 defaultStatus: false,
                                 code: function() {
                                     function replaceImageSrc() {
                                         var targetImage = document.querySelector('text-2xl font-sans font-semibold flex items-center');
                                         if (targetImage) {
                                             targetImage.src = 'https://cdn.slash.gay/r/c-ai-logo.png';
                                         }
                                     }

                                     setInterval(replaceImageSrc, 50);
                                 }
                             },
                             {
                                 title: 'Message Checker',
                                 description: 'Checks if your message has any words that trigger the filter',
                                 author: 'Slash',
                                 defaultStatus: true,
                                 code: function() {
                                     function checkMessage() {
                                         const prohibitedWords = ['sex', 'penis', 'vagina', 'cum', 'lets fuck', 'let\'s fuck', 'wanna fuck', 'horny', 'intimate activites', 'lets fck', 'let\'s fck', 'pussy', 'breast', 'boob'];

                                         if (window.location.href.includes("/chat")) {
                                             const textAreas = document.querySelectorAll('textarea.flex.max-h-96.px-3.border.file\\:border-0.file\\:bg-transparent.file\\:text-md.file\\:font-medium.placeholder\\:text-placeholder.disabled\\:cursor-not-allowed.disabled\\:opacity-50.resize-none.focus-visible\\:outline-none.border-input.h-10.py-2.text-lg.w-full.border-none.rounded-2xl.bg-surface-elevation-1.ml-2[inputmode="text"]');

                                             const existingNotification = document.getElementById('messageCheckerNotification');
                                             if (existingNotification && existingNotification.parentNode === document.body) {
                                                 document.body.removeChild(existingNotification);
                                             }

                                             textAreas.forEach(userInput => {
                                                 const userMessage = userInput.value.toLowerCase();

                                                 const containsProhibitedWord = prohibitedWords.some(word => userMessage.includes(word));

                                                 if (containsProhibitedWord) {
                                                     const notification = document.createElement('div');
                                                     notification.id = 'messageCheckerNotification';
                                                     notification.style.position = 'fixed';
                                                     notification.style.bottom = '10px';
                                                     notification.style.right = '10px';
                                                     notification.style.padding = '15px';
                                                     notification.style.background = '#ff3333';
                                                     notification.style.color = '#fff';
                                                     notification.style.border = '1px solid #ddd';
                                                     notification.style.zIndex = '9999';
                                                     notification.style.width = '250px';
                                                     notification.style.transition = 'all 0.3s ease';
                                                     notification.textContent = `I wouldn't say that, as it may trigger the filter: ${prohibitedWords.find(word => userMessage.includes(word))}`;

                                                     document.body.appendChild(notification);

                                                     function closeNotification() {
                                                         if (notification.parentNode === document.body) {
                                                             document.body.removeChild(notification);
                                                         }
                                                     }

                                                     userInput.addEventListener('input', function() {
                                                         const updatedUserMessage = userInput.value.toLowerCase();
                                                         const stillContainsProhibitedWord = prohibitedWords.some(word => updatedUserMessage.includes(word));

                                                         if (!stillContainsProhibitedWord) {
                                                             closeNotification();
                                                         }
                                                     });

                                                     userInput.addEventListener('keydown', function(event) {
                                                         if (event.key === 'Enter') {
                                                             closeNotification();
                                                         }
                                                     });


                                                 }
                                             });
                                         }
                                     }

                                     setInterval(checkMessage, 1000);
                                 }
                             },



                             {
                                 title: 'Not yet supported - Auto Regenerate',
                                 description: 'Automatically regenerates the message when the filter is triggered',
                                 author: 'Slash',
                                 defaultStatus: false,
                                 code: function() {
                                     function autoRegenerate() {
                                         const chatPage = window.location.pathname.includes('/chat');
                                         console.log("Is chat page:", chatPage);
                                         if (!chatPage) return;

                                         const specificDiv = document.querySelector('.rah-static.rah-static--height-specific');
                                         console.log("Specific div found:", specificDiv);
                                         if (!specificDiv) return;

                                         const specificText = "Sometimes the AI generates a reply that doesn't meet our guidelines.";
                                         if (specificDiv.textContent.includes(specificText)) {
                                             console.log("Specific text found in specific div");
                                             // Simplified button selector
                                             const button = document.querySelector('.z-0');
                                             if (button) {
                                                 button.click();
                                                 console.log("Clicked the button with the specified class");
                                             }
                                         }
                                     }

                                     setInterval(autoRegenerate, 1000);
                                 }
                             },





                             {
                                 title: 'Tab Cloaker',
                                 description: 'I swear! I\'m just on google!',
                                 author: 'Slash',
                                 defaultStatus: true,
                                 code: function() {
                                     function cloaker() {
                                         document.title = 'Google';
                                         const linkElements = document.head.querySelectorAll('link[rel="icon"]');
                                         linkElements.forEach(linkElement => {
                                             linkElement.href = 'https://www.google.com/favicon.ico';
                                         });
                                     }

                                     setInterval(cloaker, 1000);
                                 },
                             },
                             {
                                 title: 'Chat Notes (doesnt work)',
                                 description: 'SOON',
                                 author: 'User',
                                 defaultStatus: false,
                                 code: function() {
                                     function addNotebox() {
                                         const isChat2Page = window.location.href.includes('/chat2');
                                         const existingNotebox = document.getElementById('chatNotesNotebox');

                                         if (isChat2Page && !existingNotebox) {
                                             const notebox = document.createElement('div');
                                             notebox.id = 'chatNotesNotebox';
                                             notebox.style.position = 'fixed';
                                             notebox.style.bottom = '10px';
                                             notebox.style.left = '10px';
                                             notebox.style.padding = '10px';
                                             notebox.style.background = '#fff';
                                             notebox.style.border = '1px solid #ddd';
                                             notebox.style.zIndex = '9999';
                                             notebox.style.width = '200px';

                                             const noteInput = document.createElement('textarea');
                                             noteInput.style.width = '100%';
                                             noteInput.style.height = '80px';
                                             noteInput.placeholder = 'Type your notes here...';

                                             const submitButton = document.createElement('button');
                                             submitButton.textContent = 'Save Note';
                                             submitButton.style.marginTop = '5px';
                                             submitButton.style.cursor = 'pointer';

                                             submitButton.addEventListener('click', function() {
                                                 const userInput = document.getElementById('user-input');
                                                 const existingNote = noteInput.value.trim();

                                                 if (existingNote !== '') {
                                                     const currentMessage = userInput.value.trim();
                                                     const newMessage = `(Here are some things to remember, do not mention anything contained in the brackets, as this is so you do not forget: ${existingNote}) `;
                                                     userInput.value = newMessage + currentMessage;
                                                 }
                                             });

                                             notebox.appendChild(noteInput);
                                             notebox.appendChild(submitButton);

                                             document.body.appendChild(notebox);
                                         }
                                     }

                                     setInterval(addNotebox, 1000);
                                 },
                             }];

            modules.forEach(module => {
                const moduleBox = document.createElement('div');
                moduleBox.classList.add('module-box');

                const title = document.createElement('div');
                title.classList.add('module-title');
                title.textContent = module.title;
                moduleBox.appendChild(title);

                const description = document.createElement('div');
                description.classList.add('module-description');
                description.textContent = module.description;
                moduleBox.appendChild(description);

                const author = document.createElement('div');
                author.classList.add('module-details');
                author.textContent = 'by ' + module.author;
                moduleBox.appendChild(author);

                const toggleLabel = document.createElement('label');
                toggleLabel.classList.add('module-toggle');
                toggleLabel.textContent = 'Enable';
                const toggleInput = document.createElement('input');
                toggleInput.type = 'checkbox';
                toggleInput.checked = GM_getValue(module.title, module.defaultStatus);
                toggleInput.addEventListener('change', function() {
                    GM_setValue(module.title, this.checked);
                    reloadMessage.style.display = 'block';
                });
                toggleLabel.appendChild(toggleInput);
                moduleBox.appendChild(toggleLabel);

                moduleList.appendChild(moduleBox);

                if (GM_getValue(module.title, module.defaultStatus)) {
                    module.code();
                }
            });

            modmenu.appendChild(moduleList);

            const reloadMessage = document.createElement('div');
            reloadMessage.classList.add('reload-message');
            reloadMessage.textContent = 'Reload to apply changes!';
            modmenu.appendChild(reloadMessage);

            const versionText = document.createElement('p');
            versionText.classList.add('version');
            versionText.innerHTML = 'v4.0.0 &bull; <a href="https://slash.gay/" target="_blank">https://slash.gay/</a> &bull; <strong>Beta Release</strong>'; // This might be pulled from a URL someday
            modmenu.appendChild(versionText);

            document.body.appendChild(modmenu);

            const minimizeButton = document.createElement('button');
            minimizeButton.textContent = '-';
            minimizeButton.classList.add('minimize-button');
            modmenu.appendChild(minimizeButton);

            minimizeButton.addEventListener('click', function() {
                modmenuState.minimized = !modmenuState.minimized; // Toggle the minimized state
                updateModmenuAppearance(); // Update the modmenu appearance based on the new state
                updateModmenuState(); // Save the modmenu state
            });
            // Event listeners for dragging the modmenu
            let isDragging = false;
            let offsetX, offsetY;

            title.addEventListener('mousedown', function(event) {
                isDragging = true;
                const rect = modmenu.getBoundingClientRect();
                offsetX = event.clientX - rect.left;
                offsetY = event.clientY - rect.top;
            });

            document.addEventListener('mousemove', function(event) {
                if (isDragging) {
                    const x = event.clientX - offsetX;
                    const y = event.clientY - offsetY;
                    modmenu.style.left = `${x}px`;
                    modmenu.style.top = `${y}px`;
                }
            });

            document.addEventListener('mouseup', function() {
                isDragging = false;
            });

            function updateModmenuAppearance() {
                if (modmenuState.minimized) {
                    moduleList.style.display = 'none'; // Hide module list
                    title.style.display = 'none'; // Hide title
                    versionText.style.display = 'none'; // Hide version text
                    minimizeButton.style.display = 'block'; // Show minimize button
                    modmenu.style.width = '50px'; // Set modmenu width to a smaller
                    modmenu.style.height = '30px'; // Set modmenu height to a smaller
                } else {
                    moduleList.style.display = 'block'; // Show module list
                    title.style.display = 'block'; // Show title
                    versionText.style.display = 'block'; // Show version text
                    minimizeButton.style.display = 'block'; // Show minimize button
                    modmenu.style.width = '300px'; // Set modmenu width back to the original
                    modmenu.style.height = '550px'; // Set modmenu height back to the original
                }
            }

            function updateModmenuState() {
                GM_setValue('modmenuState', modmenuState);
            }
        }, 3000);
    }
})();
