// ==UserScript==
// @name         MVIgnore
// @namespace    BanzaiTrampantonjilygil
// @version      2024-07-17
// @description  Es preferible ser el enemigo de alguien bueno, que el amigo de alguien que es mala persona.
// @author       Trampantojo
// @license      Public Domain
// @match        https://www.mediavida.com/foro/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mediavida.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491364/MVIgnore.user.js
// @updateURL https://update.greasyfork.org/scripts/491364/MVIgnore.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class MVGarbageCleaner {
        #selectors;
        #usersBlocked;
        #rootNode;

        constructor(root_node) {
            this.#rootNode = root_node;
            this.#usersBlocked = JSON.parse(localStorage.getItem('mvignore2') || '{}');
            this.#updateSelectors();
            const mutationObserver = new MutationObserver(this.#cleanObserver.bind(this));
            mutationObserver.observe(document.body, { childList:true, subtree:true });
        }

        #replaceNodeContent(node) {
            node.textContent = "Contenido ignorado";
        }

        #updateSelectors() {
            this.#selectors = {
                messages: Object.entries(this.#usersBlocked).map(item => `
                    div[data-autor="${item[0]}"],
                    #temas tr:has(a[original-title^="${item[0]} cre"]),
                    div[data-uid="${item[1]}"]
                  `).join(','),
                xpath: Object.entries(this.#usersBlocked).map(item => `contains(cite, '${item[0]}')`).join(' or '),
            };
        }

        #getObserverNode(node) {
            if (node.parentNode.tagName === "BLOCKQUOTE") {
               return node.parentNode;
            }
            return node;
        }
        #cleanObserver(infos) {
            if (this.#selectors.xpath) {
                infos.forEach(rec => {
                    if (rec.target.id === "tooltip" || rec.target.tagName === "P") {
                        const res_xpath = document.evaluate(`//*[${this.#selectors.xpath}][1]`, rec.target, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
                        if (res_xpath.singleNodeValue) {
                            this.#replaceNodeContent(this.#getObserverNode(res_xpath.singleNodeValue));
                        }
                    }
                });
            }
        }

        clean() {
            if (this.#selectors.messages && this.#rootNode) {
                this.#rootNode.querySelectorAll(this.#selectors.messages).forEach(elm => this.#replaceNodeContent(elm));
            }
        }

        addUser(uid, user_name) {
            this.#usersBlocked[user_name] = uid;
            localStorage.setItem('mvignore2', JSON.stringify(this.#usersBlocked));
            this.#updateSelectors();
        }
    };

    const cleaner = new MVGarbageCleaner(document.getElementById('content'));
    cleaner.clean();

    // Monkey-Patch!
    const origShowCard = window.showCard;
    window.showCard = function ($user_card) {
        const $mute_btn = $user_card.find('#mute-user');
        const uid = $mute_btn.data('uid');
        const name = $mute_btn.data('name');
        const $ignore_global_btn = $("<a type='button' id='mute-user-global' class='btn'><i class='fa fa-fire-extinguisher'></i> Ignorar globalmente</a>");
        $ignore_global_btn.data({uid, name});
        $ignore_global_btn.on('click', function() {
            const data = $(this).data();
            cleaner.addUser(data.uid, data.name);
            cleaner.clean();
        });
        $ignore_global_btn.insertAfter($mute_btn);
        origShowCard(...arguments);
    };
})();