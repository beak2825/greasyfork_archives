// ==UserScript==
// @name         IdlePixel+ New Card Interface
// @namespace    lbtechnology.info
// @version      1.2.3
// @description  Improved interface for opening new cards, receiving cards in trade & trading cards
// @author       Zlef
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @icon         https://d1xsc8x7nc5q8t.cloudfront.net/images/tcg_back_50.png
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/490176/IdlePixel%2B%20New%20Card%20Interface.user.js
// @updateURL https://update.greasyfork.org/scripts/490176/IdlePixel%2B%20New%20Card%20Interface.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class TCGRevamp extends IdlePixelPlusPlugin {
        constructor() {
            super("TCG Interface Changes", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                }
            });

            this.showPopup = false;
            this.messageStart = "You got a"
            this.trade = false;
            this.card = "";
            this.refreshTCG = "";
            this.currentPopup = null;
            this.savedUsernamesTCG = null;
            this.previousTradeUsername = null;
            this.inCombat = false;
            this.inCombatTrade = false;
            this.loadUsernames();

            this.overlay = document.createElement('div');
            this.overlay.id = 'newCardOverlay';
            this.overlay.style.position = 'fixed';
            this.overlay.style.top = '0';
            this.overlay.style.left = '0';
            this.overlay.style.width = '100%';
            this.overlay.style.height = '100%';
            this.overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            this.overlay.style.zIndex = '1000';
            this.overlay.style.display = 'flex';
            this.overlay.style.justifyContent = 'center';
            this.overlay.style.alignItems = 'center';
            this.overlay.addEventListener('click', (event) => {
                if (event.target === this.overlay) {
                    this.closePopup();
                }
            });

            window.addEventListener('resize', this.adjustPopupPosition.bind(this));
        }

        onLogin() {
            this.originalTcgGiveCard = Modals.open_tcg_give_card;

            Modals.open_tcg_give_card = (modal_id, card) => {
                if (!modal_id) {
                    this.newTradePopup(card);
                } else {
                    this.originalTcgGiveCard(modal_id, card);
                }
            };

            if (!CardData.data) {
                CardData.fetchData();
            }
            this.monitorRevealTCG();
        }

        saveUsernames(){
            const saveData = JSON.stringify({usernames: this.savedUsernamesTCG});
            localStorage.setItem(`savedUsernamesTCG`, saveData);
        }

        loadUsernames(){
            const savedUsernamesTCG = localStorage.getItem(`savedUsernamesTCG`);

            if (savedUsernamesTCG){
                this.savedUsernamesTCG = JSON.parse(savedUsernamesTCG).usernames;
            } else {
                this.savedUsernamesTCG = [];
            }
        }

        monitorRevealTCG() {
            const originalWebSocketSend = WebSocket.prototype.send;
            const self = this;
            WebSocket.prototype.send = function(data) {
                try {
                    originalWebSocketSend.call(this, data);
                    if (data === 'REVEAL_TCG_CARD') {
                        self.showPopup = true;
                    }
                } catch (error) {
                    console.error('Error in overridden WebSocket send:', error);
                }
            };
        }

        onMessageReceived(data){
            const originalOpenImageModal = Modals.open_image_modal;
            const self = this;

            if (data.includes("OPEN_DIALOGUE")){
                console.log("Open dialogue message received");
                Modals.open_image_modal = function(title, imgUrl, description, footerText, closeBtnText, anotherBtnText, isModalDismissible) {
                    if (description.includes("You were given a card from")) {
                        console.log("Opening custom dialogue");
                        const usernameRegex = /You were given a card from (.*?)<br \/>/;
                        const cardRegex = /<span class='color-grey'>(.*?)<\/span>/;

                        const usernameMatch = description.match(usernameRegex);
                        const cardMatch = description.match(cardRegex);

                        let username = "";
                        let card = "";

                        if (usernameMatch && usernameMatch.length > 1) {
                            username = usernameMatch[1];
                        }

                        if (cardMatch && cardMatch.length > 1) {
                            self.card = cardMatch[1];
                        }

                        self.messageStart = `${username} sent you a`;
                        self.trade = true;
                        self.showPopup = true;
                    } else {
                        console.log("Opening original dialogue");
                        originalOpenImageModal.call(this, title, imgUrl, description, footerText, closeBtnText, anotherBtnText, isModalDismissible);
                    }
                };
            }

            if (data.includes("REFRESH_TCG")){
                this.refreshTCG = data;
                // console.log("In REFRESH_TCG, checking for inCombat");
                if (this.trade && this.inCombat){
                    this.showPopup = false;
                    this.inCombatTrade = true;
                    // console.log("inCombatTrade set to True");
                }
                if (this.showPopup){
                    if (this.trade){
                        this.getCardInfo();
                        this.trade = false;
                        this.card = "";
                    } else {
                        this.getCardInfo();
                    }

                    this.showPopup = false;
                    this.messageStart = "You got a";
                }
            }
            if (data.includes('START_RAID')){
                this.inCombat = true;
                // console.log("In raid");
            }
            if (data.includes('RAIDS_TEAM_INFO_DESTROYED') || data.includes('RAIDS REWARD')){
                // console.log("Exited raid");
                this.inCombat = false;
                if (this.inCombatTrade){
                    // console.log("inCombatTrade is true, opening modal");
                    this.inCombatTrade = false;
                    this.openSimplePopup("Trading Card Game", "You received card(s) during in combat!");
                }
            }
        }

        onCombatStart(){
            this.inCombat = true;
        }

        onCombatEnd(){
            this.inCombat = false;
            if (this.inCombatTrade){
                this.inCombatTrade = false;
                this.openSimplePopup("Trading Card Game", "You received card(s) during in combat!");
            }
        }

        getCardInfoTrade(cardid) {
            const cardData = this.refreshTCG.replace('REFRESH_TCG=', '').split('~');
            const index = cardData.indexOf(cardid);
            const isThisYourCard = [cardData[index], cardData[index + 1], cardData[index + 2]];

            const isHolo = isThisYourCard[2] === 'true';
            const cardHTML = CardData.getCardHTML(isThisYourCard[0], isThisYourCard[1], isHolo);
            return cardHTML;
        }

        getCardInfo() {
            const cardData = this.refreshTCG.replace('REFRESH_TCG=', '').split('~');
            let isHolo = 'false';

            if (this.trade) {
                const cardName = this.card.replace(/ \(holo\)$/, '');
                const index = cardData.indexOf(cardName);
                if (index !== -1) {
                    const id = cardData[index - 1];
                    const nameKey = cardData[index];
                    const holo = cardData[index + 1];
                    isHolo = this.card.includes("(holo)") ? 'true' : holo;
                    this.displayNewCard(id, nameKey, isHolo);
                }
            } else {
                if (cardData.length >= 3) {
                    const id = cardData[0];
                    const nameKey = cardData[1];
                    isHolo = cardData[2];
                    this.displayNewCard(id, nameKey, isHolo);
                }
            }
        }

        getCardInfoUnified(cardPart, identifier) {
            const cardData = this.refreshTCG.replace('REFRESH_TCG=', '').split('~');
            const index = cardData.indexOf(identifier);
            let id, nameKey, holo, isHolo;

            if (identifier === 'card_id') {
                id = cardPart;
                nameKey = cardData[index + 1];
                holo = cardData[index + 2];
            } else if (identifier === 'card_key') {
                id = cardData[index - 1];
                nameKey = cardPart;
                holo = cardData[index + 1];

                if (this.isTrade) {
                    nameKey = this.refactorCardKey(nameKey);
                    holo = this.card.includes("(holo)") ? 'true' : holo;
                }
            } else {
                console.error('Invalid card target type');
                return;
            }

            isHolo = (holo === 'true');
            this.displayNewCard(id, nameKey, isHolo);
        }

        displayNewCard(cardId, cardNameKey, holo) {
            const cardName = cardNameKey.replace('tcg_', '').replace(/_/g, ' ').replace(" icon", "");
            const isHolo = holo === 'true';
            let bloodyVowels = "";

            const vowels = ['a', 'e', 'i', 'o', 'u'];
            if (vowels.some(vowel => cardName.toLowerCase().startsWith(vowel))) {
                bloodyVowels = "n";
            }

            const message = isHolo ? `${this.messageStart} holo ${cardName} card!` : `${this.messageStart}${bloodyVowels} ${cardName} card!`;

            const cardHTML = CardData.getCardHTML(cardId, cardNameKey, isHolo);

            this.newCardOverlay(message, cardHTML);
        }

        updateUserListDisplay() {
            this.userListContainer.innerHTML = '';

            const table = document.createElement('table');
            table.className = 'table table-hover';

            const thead = document.createElement('thead');
            thead.innerHTML = '<tr><th scope="col">Saved users</th><th scope="col"></th></tr>';
            table.appendChild(thead);

            const tbody = document.createElement('tbody');
            table.appendChild(tbody);

            const usernames = this.savedUsernamesTCG;
            const minimumRows = 0;
            const rowsToCreate = Math.max(minimumRows, usernames.length);

            for (let i = 0; rowsToCreate > i; i++) {
                const tr = document.createElement('tr');
                const usernameCell = document.createElement('td');

                usernameCell.style.cursor = 'pointer';
                usernameCell.style.verticalAlign = 'middle';
                usernameCell.style.fontSize = '1.2em';
                usernameCell.addEventListener('click', () => {
                    const usernameInput = document.getElementById('recipientUsernameInput');
                    if (usernameInput) {
                        usernameInput.value = usernames[i];
                    }
                });

                const actionCell = document.createElement('td');
                actionCell.align = "right";
                actionCell.style.width = '80px';

                if (i < usernames.length) {
                    usernameCell.textContent = usernames[i];
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.className = 'btn btn-danger btn-sm';
                    deleteButton.style.padding = '5px 10px';
                    deleteButton.style.height = 'auto';
                    deleteButton.onclick = () => this.deleteUsername(usernames[i]);
                    actionCell.appendChild(deleteButton);
                }

                tr.appendChild(usernameCell);
                tr.appendChild(actionCell);
                tbody.appendChild(tr);
            }

            this.userListContainer.appendChild(table);
        }

        deleteUsername(username) {
            const index = this.savedUsernamesTCG.indexOf(username);
            if (index !== -1) {
                this.savedUsernamesTCG.splice(index, 1);
                this.saveUsernames();
                this.updateUserListDisplay();
            }
        }

        newTradePopup(card) {
            const cardHTML = this.getCardInfoTrade(card).replace(/onclick='[^']+'/g, '');

            const tradePopupStyles = `
			<style>
				#tradePopup {
					display: flex;
					flex-direction: column;
					align-items: center;
					width: 100%;
					max-width: 800px;
					margin: 0 auto;
					background-color: #fff;
					border-radius: 8px;
					box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
					padding: 20px;
					box-sizing: border-box;
				}
				#tradePopup .tradePopup-row {
					display: flex;
					width: 100%;
				}
				#tradePopup .tradePopup-col {
					flex: 1;
					box-sizing: border-box;
				}
				#tradePopup .tradePopup-card-container {
					flex: none;
					width: 35%;
				}
				#tradePopup .tradePopup-button-container {
					display: flex;
					justify-content: right;
					width: 100%;
				}
				#tradePopup button {
					padding: 10px 20px;
					cursor: pointer;
					margin-right: 10px;
				}
                #userListContainer {
					max-height: 230px;
					overflow-y: auto;
				}
			</style>
			`;

            document.head.insertAdjacentHTML('beforeend', tradePopupStyles);

            const popupBox = document.createElement('div');
            popupBox.id = 'tradePopup';

            const rowDiv = document.createElement('div');
            rowDiv.className = 'tradePopup-row';
            popupBox.appendChild(rowDiv);

            const cardColDiv = document.createElement('div');
            cardColDiv.className = 'tradePopup-col tradePopup-card-container';
            rowDiv.appendChild(cardColDiv);

            const formColDiv = document.createElement('div');
            formColDiv.className = 'tradePopup-col';
            rowDiv.appendChild(formColDiv);

            const cardContainer = document.createElement('div');
            cardContainer.innerHTML = cardHTML;
            cardColDiv.appendChild(cardContainer);

            const title = document.createElement('h5');
            title.textContent = "Who do you want to send this card to?";
            title.className = "modal-title";
            formColDiv.appendChild(title);

            const inputGroup = document.createElement('div');
            inputGroup.className = 'input-group mb-3';

            const usernameInput = document.createElement('input');
            usernameInput.type = 'text';
            usernameInput.className = 'form-control';
            usernameInput.id = 'recipientUsernameInput';
            usernameInput.placeholder = 'Enter username';
            if (this.previousTradeUsername){
                usernameInput.value = this.previousTradeUsername;
            }

            inputGroup.appendChild(usernameInput);

            const addUserButton = document.createElement('button');
            addUserButton.textContent = 'SAVE USER';
            addUserButton.className = 'btn btn-secondary';
            addUserButton.type = 'button';

            inputGroup.appendChild(addUserButton);
            formColDiv.appendChild(inputGroup);

            this.userListContainer = document.createElement('div');
            this.userListContainer.id = 'userListContainer';
            formColDiv.appendChild(this.userListContainer);
            this.updateUserListDisplay();

            const sendCardButton = document.createElement('button');
            sendCardButton.textContent = 'SEND CARD';
            sendCardButton.className = 'btn btn-primary';
            sendCardButton.type = 'button';

            const closeButton = document.createElement('button');
            closeButton.textContent = 'CLOSE';
            closeButton.className = 'btn btn-secondary';
            closeButton.type = 'button';

            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'tradePopup-button-container';
            buttonContainer.appendChild(sendCardButton);
            buttonContainer.appendChild(closeButton);
            popupBox.appendChild(buttonContainer);

            const actions = [
                {
                    button: sendCardButton,
                    handler: () => {
                        const recipientUsername = usernameInput.value.trim();
                        this.previousTradeUsername = recipientUsername;
                        IdlePixelPlus.sendMessage(`GIVE_TCG_CARD=${recipientUsername}~${card}`);
                    }
                },
                {
                    button: closeButton,
                    handler: () => {
                        this.closePopup();
                    },
                    closeOnAction: true
                },
                {
                    button: addUserButton,
                    handler: () => {
                        const username = usernameInput.value;
                        if (username && !this.savedUsernamesTCG.includes(username)) {
                            this.savedUsernamesTCG.push(username);
                            this.saveUsernames();
                            this.updateUserListDisplay();
                        }
                    },
                    closeOnAction: false
                }
            ];

            this.launchPopup(popupBox, actions);
        }

        newCardOverlay(message, cardHTML) {
            const popupBox = document.createElement('div');
            popupBox.id = 'newCardPopupBox';
            popupBox.style.width = '300px';
            popupBox.style.margin = '0 auto';
            popupBox.style.backgroundColor = '#fff';
            popupBox.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
            popupBox.style.borderRadius = '8px';
            popupBox.style.padding = '20px';
            popupBox.style.textAlign = 'center';

            const messageP = document.createElement('p');
            messageP.textContent = message;
            messageP.style.fontSize = '18px';
            messageP.style.fontWeight = 'bold';

            const cardContainer = document.createElement('div');
            cardContainer.innerHTML = cardHTML;
            cardContainer.firstChild.style.marginTop = '0px';

            const cardTitle = cardContainer.querySelector('.tcg-card-title');
            const cardInnerText = cardContainer.querySelector('.tcg-card-inner-text');
            if (cardTitle) {
                cardTitle.style.textAlign = 'left';
            }
            if (cardInnerText) {
                cardInnerText.style.textAlign = 'left';
            }

            const openAnotherButton = document.createElement('button');
            openAnotherButton.textContent = 'OPEN ANOTHER';
            openAnotherButton.style.padding = '10px 20px';
            openAnotherButton.style.fontSize = '16px';
            openAnotherButton.style.cursor = 'pointer';
            openAnotherButton.style.marginRight = '10px';

            const tcg_unknown = IdlePixelPlus.getVarOrDefault("tcg_unknown", 0, "int");
            openAnotherButton.disabled = tcg_unknown == 1;

            const closeButton = document.createElement('button');
            closeButton.textContent = 'CLOSE';
            closeButton.style.padding = '10px 20px';
            closeButton.style.fontSize = '16px';
            closeButton.style.cursor = 'pointer';

            const actions = [
                {
                    button: openAnotherButton,
                    handler: () => {
                        IdlePixelPlus.sendMessage("REVEAL_TCG_CARD");
                    }
                },
                {
                    button: closeButton,
                    handler: () => {
                        this.closePopup();
                    },
                    closeOnAction: true
                }
            ];

            popupBox.appendChild(messageP);
            popupBox.appendChild(cardContainer);
            if (!this.trade) {
                popupBox.appendChild(openAnotherButton);
            }
            popupBox.appendChild(closeButton);
            this.trade = false;

            this.launchPopup(popupBox, actions);
        }

        openSimplePopup(message, footer) {
            const popupBox = document.createElement('div');
            popupBox.style.width = '300px';
            popupBox.style.margin = '0 auto';
            popupBox.style.backgroundColor = '#fff';
            popupBox.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
            popupBox.style.borderRadius = '8px';
            popupBox.style.padding = '20px';
            popupBox.style.textAlign = 'center';

            const messageP = document.createElement('p');
            messageP.textContent = message;
            messageP.style.fontSize = '18px';
            messageP.style.fontWeight = 'bold';

            const footerP = document.createElement('p');
            footerP.textContent = footer;
            footerP.style.fontSize = '16px';

            const closeButton = document.createElement('button');
            closeButton.textContent = 'CLOSE';
            closeButton.style.padding = '10px 20px';
            closeButton.style.fontSize = '16px';
            closeButton.style.cursor = 'pointer';

            closeButton.addEventListener('click', () => {
                this.closePopup();
            });

            popupBox.appendChild(messageP);
            popupBox.appendChild(footerP);
            popupBox.appendChild(closeButton);

            this.launchPopup(popupBox, []);
        }

        launchPopup(popup, actions) {
            if (this.currentPopup) {
                if (this.overlay.contains(this.currentPopup)) {
                    this.overlay.removeChild(this.currentPopup);
                }
                this.currentPopup = null;
            }

            this.currentPopup = popup;

            this.overlay.appendChild(popup);
            document.body.appendChild(this.overlay);

            this.adjustPopupPosition();

            actions.forEach(action => {
                const button = action.button;
                button.addEventListener('click', () => {
                    action.handler();
                    if (action.closeOnAction !== false) {
                        this.closePopup();
                    }
                });
            });
        }

        adjustPopupPosition() {
            if (!this.currentPopup) return;

            const viewportHeight = window.innerHeight;
            const popupHeight = this.currentPopup.offsetHeight;
            const scrollOffset = window.pageYOffset || document.documentElement.scrollTop;
            const topPosition = (viewportHeight - popupHeight) / 2 + scrollOffset;
            this.currentPopup.style.position = 'absolute';
            this.currentPopup.style.top = `${topPosition > 0 ? topPosition : 0}px`;
        }

        closePopup() {
            if (this.overlay.contains(this.currentPopup)) {
                this.overlay.removeChild(this.currentPopup);
            }
            document.body.removeChild(this.overlay);
            this.currentPopup = null;
        }
    }

    const plugin = new TCGRevamp();
    IdlePixelPlus.registerPlugin(plugin);

})();
