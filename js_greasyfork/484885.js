// ==UserScript==
// @name         Telegram Group Message
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Send messages to Telegram chat groups
// @author       bessadam
// @match        https://web.telegram.org/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484885/Telegram%20Group%20Message.user.js
// @updateURL https://update.greasyfork.org/scripts/484885/Telegram%20Group%20Message.meta.js
// ==/UserScript==

window.addEventListener("load", (event) => {
    (function() {
        'use strict';

        const globalVariables = {
            sendingDelay: 3000, // Delay before sending
            sendingInProcess: false, // is messages sending in process
        };

        GM_addStyle(`
            .popupWrapperStyles {
                display: flex;
                justify-content: center;
                align-items: center;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 9999;
            }

            .popupBlockStyles, .progressBarContainerStyles {
                display: flex;
                flex-direction: column;
                gap: 16px;
                position: relative;
                max-width: 400px;
                width: 100%;
                padding: 16px;
                background-color: #212121;
                border: 1px solid #fff;
                border-radius: 10px;
                padding: 20px;
            }

            .headingModalStyles {
                color: #fff;
                font-size: 18px;
                font-weigth: bold;
            }

            .closeModalBtnStyles {
                position: absolute;
                top: 10px;
                right: 10px;
                cursor: pointer;
            }

            .closeModalBtnStyles svg {
                fill: #fff;
            }

            .inputBlockStyles {
                widht: 100%;
                padding: 10px 20px;
                border: 1px solid #fff;
                border-radius: 10px;
                color: #fff;
            }

            .submitMessageBtnStyles {
                width: fit-content;
                color: #fff;
                border: 1px solid #fff;
                padding: 5px 15px;
                border-radius: 10px;
            }

            .initBtnStyles {
                display: flex;
                justify-content: center;
                align-items: center;
                position: fixed;
                bottom: 1.25rem;
                left: 1.25rem;
                max-width: 54px;
                max-height: 54px;
                padding: 5px 10px;
                border-radius: 50%;
                background-color: #8774e1;
                z-index: 999;
            }

            .initBtnStyles:hover {
                background-color: var(--dark-primary-color);
            }

             .initBtnStyles svg g path {
                 fill: #fff;
            }

          .tag-input {
            width: 100%;
            min-height: 100px;
            max-height: 400px;
            border: 1px solid #ccc;
            border-radius: 10px;
            padding: 10px;
            font-size: 16px;
            line-height: 1.5;
            outline: none;
            overflow: auto;
            resize: vertical;
          }

          .progressBarStyles {
              position: relative;
              background-color: #333;
              width: 100%;
              height: 30px;
              margin: 16px 0;
              transform: skew(30deg);
              transition: .2s;
            }
            .progressBarStyles:before {
              --width: calc(var(--p) * 1%);
              content: "";
              position: absolute;
              top: 0;
              left: 0;
              width: 0;
              height: 100%;
              background-color: #8774e1;
              z-index: 0;
              animation: load .5s forwards linear;
              transition: .2s;
            }
            .progressBarStyles:after {
              counter-reset: progress var(--p);
              content: counter(progress) "%";
              color: #000;
              position: absolute;
              left: 5%;
              top: 50%;
              transform: translateY(-50%) skewX(-30deg);
              z-index: 1;
              transition: .2s;
            }
            @keyframes load {
              to {
                width: var(--width);
              }
            }
     `);

        function createInitBtn() {
            const initBtn = document.createElement("button");
            initBtn.classList.add("initBtnStyles");
            initBtn.innerHTML = `<svg width="42px" height="42px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z" fill="#1C274C"></path> <path d="M15 12C15 12.5523 15.4477 13 16 13C16.5523 13 17 12.5523 17 12C17 11.4477 16.5523 11 16 11C15.4477 11 15 11.4477 15 12Z" fill="white"></path> <path d="M11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12Z" fill="white"></path> <path d="M7 12C7 12.5523 7.44772 13 8 13C8.55228 13 9 12.5523 9 12C9 11.4477 8.55228 11 8 11C7.44772 11 7 11.4477 7 12Z" fill="white"></path> </g></svg>`;
            initBtn.addEventListener("click", () => {
                const activeTabIndex = checkTabActive().id;
                if(activeTabIndex !== 0) openModal();
                else alert("In the first folder the script doesn't work for security reasons");
            })
            document.body.appendChild(initBtn);
        }

        createInitBtn();
        const popupWrapper = document.createElement('div');

        function initPopup() {
            popupWrapper.classList.add("popupWrapperStyles");

            const popupBlock = document.createElement('div');
            popupBlock.classList.add("popupBlockStyles");

            const headingModal = document.createElement("span");
            headingModal.classList.add("headingModalStyles");
            headingModal.innerText = `Sending message to each chat in folder`;

            const closeModalBtn = document.createElement("span");
            closeModalBtn.classList.add("closeModalBtnStyles");
            closeModalBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 30 30"><path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"></path></svg>`;
            closeModalBtn.addEventListener("click", closeModal);

            const submitMessageBtn = document.createElement("button");
            submitMessageBtn.classList.add("submitMessageBtnStyles");
            submitMessageBtn.innerText = "Send";

            submitMessageBtn.addEventListener("click", sendMessage);

            const textArea = document.createElement('div');
            textArea.classList.add("tag-input");
            textArea.contentEditable = "true";

            function sendMessage() {
                if (textArea.innerText.trim().length) {
                    sendMessages(textArea.innerText);
                    textArea.innerText = "";
                    closeForm();
                } else {
                    alert("Type at least 1 character");
                }
            }

            popupBlock.appendChild(closeModalBtn);
            popupBlock.appendChild(headingModal);
            popupBlock.appendChild(textArea);
            popupBlock.appendChild(submitMessageBtn);

            popupWrapper.appendChild(popupBlock);

            // popupWrapper.addEventListener("click", (e) => {
                // if(e.target === e.currentTarget) {
                    // closeModal();
                // }
            // });
        }

        function openModal() {
            document.body.appendChild(popupWrapper);
            document.body.style.overflow = "hidden";
            initPopup();
        }

        function closeModal() {
            if(globalVariables.sendingInProcess) {
                globalVariables.sendingInProcess = false;
                popupWrapper.removeChild(document.querySelector(".progressBarContainerStyles"));
                document.body.removeChild(popupWrapper);
                document.body.style.overflow = "auto";
            } else {
                closeForm();
                document.body.removeChild(popupWrapper);
                document.body.style.overflow = "auto";
            }
        }

        function closeForm() {
            popupWrapper.removeChild(document.querySelector(".popupBlockStyles"));
        }

        function sendMessages(msg) {
            const chats = checkTabChats();
            const progressBarBlock = showProgressBar();

            (async () => {
                for (let i = 0; i < chats.length; i++) {
                    if(!globalVariables.sendingInProcess) return;

                    const block = chats[i].querySelector(".c-ripple");
                    const mouseDownEvent = new MouseEvent('mousedown', {
                        bubbles: true,
                        cancelable: true,
                    });
                    block.dispatchEvent(mouseDownEvent);
                    await new Promise(resolve => {
                        setTimeout(() => {
                            if(!globalVariables.sendingInProcess) return;

                            const chatInput = document.querySelector(".input-message-input");
                            const submitBtn = document.querySelector(".btn-send");
                            chatInput.innerText = msg;
                            submitBtn.click();
                            // Filling the progress bar
                            const percent = ((i + 1) / chats.length) * 100;
                            progressBarBlock.style.setProperty("--p", percent.toFixed());

                            chatInput.innerText = "";
                            resolve();
                        }, globalVariables.sendingDelay);
                    });
                }
            })();
        };

        function showProgressBar() {
            globalVariables.sendingInProcess = true;

            const progressBarContainer = document.createElement("div");
            progressBarContainer.classList.add("progressBarContainerStyles");

            const progressBarBlock = document.createElement("div");
            progressBarBlock.classList.add("progressBarStyles");

            const closeModalBtn = document.createElement("span");
            closeModalBtn.classList.add("closeModalBtnStyles");
            closeModalBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 30 30"><path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"></path></svg>`;
            closeModalBtn.addEventListener("click", closeModal);

            progressBarContainer.appendChild(closeModalBtn);
            progressBarContainer.appendChild(progressBarBlock);
            popupWrapper.appendChild(progressBarContainer);

            return progressBarBlock;
        };


        function checkTabActive() {
           const nav = document.querySelector("nav.menu-horizontal-div#folders-tabs");
           const activeTabIndex = [...nav.querySelectorAll(".menu-horizontal-div-item.rp")].findIndex(tab => tab.classList.contains("active"));
           const activeTabValue = [...nav.querySelectorAll(".menu-horizontal-div-item.rp")].find(tab => tab.classList.contains("active")).textContent;

            return {id: activeTabIndex, value: activeTabValue};
        };

        function checkTabChats() {
            // List of all chats
            const folderChatsContainer = [...document.querySelectorAll(".tabs-tab.chatlist-parts")];
            // Container with chats
            const activeFolderChatsContainer = [...folderChatsContainer].find(folder => folder.classList.contains("active"));
            // List of all chats in the active container
            const chats = [...activeFolderChatsContainer.querySelectorAll(".chatlist-chat")];

            return chats;
        };
    })();
});