// ==UserScript==
// @name         JVC Premium
// @version      0.2
// @description  Premier jet du script JVC Premium, ai-je besoin de faire une description ?
// @author       Miyuun - Décoratrice d'intérieur de pages webs
// @match        https://www.jeuxvideo.com/*
// @icon         https://www.google.com/s2/favicons?domain=jeuxvideo.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @namespace https://greasyfork.org/users/794216
// @downloadURL https://update.greasyfork.org/scripts/429472/JVC%20Premium.user.js
// @updateURL https://update.greasyfork.org/scripts/429472/JVC%20Premium.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function JVCPremium(options){

        // Entrer ICI entre les guillemets votre clé
        let userId = "B7060F82E791C07117DC11E1B3F9B16B";

        let PremiumFramework = this;
        this.menus = [];
        this.host = "https://jvc-premium.herokuapp.com";
        this.requestLinks = {
            encrypt : this.host + "/encrypt",
            decrypt : this.host + "/decrypt",
            decryptAll : this.host + "/decryptall" // Pas encore disponible, prochaine MaJ ?
        };
        this.defaultOptions = {
            container: ".jv-editor",
            toolbar: ".jv-editor-toolbar",
            wrapper: ".btn-group",
            wrapperClass : "btn-group",
            textarea: ".text-editor > textarea",
            buttonClass: "btn btn-jv-editor-toolbar",
            messageSearch : ".txt-msg.text-enrichi-forum p",
            codeElement : ".code-jv",
            template : "'''Ce message n'est disponible qu'aux membres qui possèdent JVC Premium.'''\n<code>${ENCRYPTED}</code>",
            templateSearch : "Ce message n'est disponible qu'aux membres qui possèdent JVC Premium.",
            templateReplace : "Message décodé grâce à JVC Premium.",
            templateSpoiler : '<div class="bloc-spoil-jv"><input type="checkbox" id="${ID}" class="open-spoil" checked=""><label class="barre-head" for="${ID}"><span class="txt-spoil">Spoil</span><span class="aff-spoil">Afficher</span><span class="masq-spoil">Masquer</span></label><div class="contenu-spoil">${DECRYPTED}</div></div>'
        }
        this.options = {...this.defaultOptions, ...options};

        this.init = function() {

            document.querySelectorAll(this.options.container).forEach((container, index) => {
                PremiumFramework.menus[index] = new PremiumFramework.PremiumMenu(container);
            });

            document.querySelectorAll(this.options.messageSearch).forEach((contenu, index) => {
                PremiumFramework.PremiumDecrypt(contenu);
            });
        }

        this.PremiumMenu = function(container){

            let menu = this;
            this.buttons = [];
            this.textarea = {};
            this.container = container;

            this.init = function() {

                this.element = document.createElement("div");
                this.element.className += PremiumFramework.options.wrapperClass;

                // On crée les boutons
                this.textarea = new this.TexteArea(this);
                this.buttons.push(new this.EncryptionButton(this));

                container.querySelector(PremiumFramework.options.toolbar).append(this.element);
            }

            this.EncryptionButton = function(menu){

                let button = this;

                this.menu = menu;

                this.element = document.createElement("button");
                this.element.className += PremiumFramework.options.buttonClass;

                this.element.setAttribute("type", "button");
                this.element.setAttribute("title", "Premium");

                this.element.innerHTML = "P";

                this.element.onclick = () => {
                    PremiumFramework.PremiumEncrypt(this.menu.textarea);
                }

                menu.element.append(this.element);

                return this;
            }

            this.TexteArea = function(menu){

                let textarea = this;
                this.element = menu.container.querySelector(PremiumFramework.options.textarea)
                this.menu = menu;

                return this;
            }

            this.init();

            return this;
        }

        this.PremiumEncrypt = async function(textarea){
            let start = textarea.element.selectionStart;
            let end = textarea.element.selectionEnd;
            let text = textarea.element.value.substring(start, end);
            let firstCharacter = text[0];
            let lastCharacter = text[-1];

            if(!text) return;

            text = await this.getFormattedText(text).catch((error) => console.log(error));

            var result = await this.getEncryptedText(text).catch((error) => console.log(error));
            var newValue = textarea.element.value.substring(0, start);

            newValue += (firstCharacter == '\n' ? '\n' : '') + PremiumFramework.options.template.replace('${ENCRYPTED}', result) + (lastCharacter == '\n' ? '\n' : '')
            newValue += textarea.element.value.substring(end);

            textarea.element.value = newValue;
        }

        this.PremiumDecrypt = function(messageContainer){
            if(!messageContainer.innerHTML.includes(this.options.templateSearch)) return;

            for (let subElement of messageContainer.children) {
                if(subElement.innerHTML.includes(PremiumFramework.options.templateSearch)){

                    let codeElement = messageContainer.querySelector(PremiumFramework.options.codeElement);
                    let hash = PremiumFramework.generateRandomHash();

                    PremiumFramework.getDecryptedText(codeElement.textContent).then((result) => {

                        var randomHtmlObject = document.createElement('div');
                        randomHtmlObject.innerHTML = PremiumFramework.options.templateSpoiler.replace(/\${ID}/g, hash).replace("${DECRYPTED}", result);;
                        messageContainer.insertBefore(randomHtmlObject, codeElement);
                        subElement.innerHTML = PremiumFramework.options.templateReplace;

                        codeElement.remove();
                    }, (error) => {

                    });
                    break;
                }
            }
        }

        this.getEncryptedText = function(text){

            return new Promise((resolve, reject) => {
                var xhr = new XMLHttpRequest();

                xhr.onreadystatechange = function () {
                    if (this.readyState != 4) return;

                    if(this.status == 200){
                        try {
                                var encryptedText = JSON.parse(this.responseText)?.encryptedText;
                                if(encryptedText) resolve(encryptedText);
                                else reject("Could not parse JSON correctly in getEncryptedText. Undefined value.");
                            }
                            catch (error) {
                                console.error(error);
                                reject("Could not parse JSON correctly in getEncryptedText. Runtime error.");
                            }
                    }else{
                        reject(this.status);
                    }
                };

                xhr.open("POST", PremiumFramework.requestLinks.encrypt, true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify({
                    userId: userId,
                    text: btoa(text)
                }));
            });

        }

        this.getDecryptedText = function(text){

            return new Promise((resolve, reject) => {
                var xhr = new XMLHttpRequest();

                xhr.onreadystatechange = function () {
                    if (this.readyState != 4) return;

                    if(this.status == 200){
                        try {
                                var decryptedText = JSON.parse(this.responseText)?.decryptedText;
                                if(decryptedText) resolve(atob(decryptedText));
                                else reject("Could not parse JSON correctly in getEncryptedText. Undefined value.");
                            }
                            catch (error) {
                                console.error(error);
                                reject("Could not parse JSON correctly in getEncryptedText. Runtime error.");
                            }
                    }else{
                        reject(this.status);
                    }
                };

                xhr.open("POST", PremiumFramework.requestLinks.decrypt, true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify({
                    userId: userId,
                    text: text
                }));
            });

        }

        this.generateRandomHash = function(){
            return Math.random().toString(36).substr(2, 5) + Math.random().toString(36).substr(2, 5);
        }

        this.getFormattedText = function(text){
            return new Promise((resolve, reject) => {
                var xhr = new XMLHttpRequest();

                xhr.onreadystatechange = function () {
                    if (this.readyState != 4) return;

                    if (this.status == 200) {
                        resolve(this.responseText);
                    }
                };

                xhr.open("POST", "https://www.jeuxvideo.com/jvcode/forums.php", true);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                xhr.send("texte=" + encodeURIComponent(text));
            });
        }

        this.init();

    }

    var premium = new JVCPremium();
})();