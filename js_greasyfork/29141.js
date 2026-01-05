// ==UserScript==
// @name         Bundle Stars Keys Retrieve
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  Retrieve keys from Bundle Stars
// @icon         https://cdn.bundlestars.com/production/brand/apple-touch-icon-180x180.png
// @author       Bisumaruko
// @include      http*://*bundlestars.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29141/Bundle%20Stars%20Keys%20Retrieve.user.js
// @updateURL https://update.greasyfork.org/scripts/29141/Bundle%20Stars%20Keys%20Retrieve.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = selector => document.querySelector(selector),
        $$ = selector => Array.from(document.querySelectorAll(selector)),
        BSRetrive = {};

    BSRetrive.init = function () {
        var style = document.createElement('style');

        style.type = 'text/css';
        style.innerHTML = `
            .BSRetrive {
                width: 100%;
                height: 200px;
                display: flex;
                flex-direction: column;
                box-sizing: border-box;
                border: 1px solid #424242;
                color: #999999;
            }
            .BSRetrive > textarea {
                width: 100%;
                height: 150px;
                border: none;
                background-color: #303030;
                color: #DDD;
                box-sizing: border-box;
                resize: none;
            }
            .BSRetrive > div {
                width: 100%;
                padding-top: 5px;
                box-sizing: border-box;
            }
            .BSRetrive button, .BSRetrive select {
                height: 34px;
                margin-right: 10px;
                padding: 6px 12px;
                border: 1px solid transparent;
                background-color: #262626;
                color: #DEDEDE;
                box-sizing: border-box;
                outline: none;
                cursor: pointer;
            }
            .BSRetrive button:hover, .BSRetrive select:hover {
                color: #A8A8A8;
            }
            .BSRetrive label {
                margin-right: 10px;
                color: #DEDEDE;
            }
            .BSRetrive select {
                max-width:200px;
            }
            .BSRetrive select, .BSRetrive span {
                margin-right: 0;
                margin-left: 10px;
                float: right;
            }
            .BSRetrive span {
                margin-top: 5px;
            }
        `;

        document.head.appendChild(style);
    };

    BSRetrive.setup = function () {
        if ($('.BSRetrive')) return;

        var anchor = $('h2');
        if (!anchor || anchor.textContent.trim() !== 'Order Keys') return;

        var BSContainer = document.createElement('div');

        BSContainer.className = 'BSRetrive';
        BSContainer.innerHTML = `
            <textarea></textarea>
            <div>
                <button class="BSButtonReveal">Reveal</button>
                <button class="BSButtonRetrieve">Retrieve</button>
                <button class="BSButtonCopy">Copy</button>
                <button class="BSButtonReset">Reset</button>
                <label><input type="checkbox" class="BSCheckboxTitle">Include Game Title</label>
                <label><input type="checkbox" class="BSCheckboxJoin">Join Keys</label>
                <select class="BSSelectTo"></select>
                <span>to</span>
                <select class="BSSelectFrom"></select>
            </div>
        `;

        anchor.parentNode.insertBefore(BSContainer, anchor);

        $('.BSButtonReveal').addEventListener('click', () => {
            let keys = this.selector('.key-container a[ng-click^="redeemSerial"]');

            if (keys) {
                for (let key of keys) {
                    if (!key.closest('.ng-hide')) key.click();
                }
            } else msg.alert('Empty search, please select the correct options');
        });

        $('.BSButtonRetrieve').addEventListener('click', () => {
            let containers = this.selector('.key-container');

            if (containers) {
                let keys = [],
                    includeTitle = $('.BSCheckboxTitle').checked,
                    separator = $('.BSCheckboxJoin').checked ? ',' : "\n"

                for (let container of containers) {
                    let key = container.querySelector('input');

                    if (!key) continue;
                    keys.push(
                        includeTitle ?
                        container.previousElementSibling.textContent + ', ' + key.value :
                        key.value
                    );
                }

                $('.BSRetrive textarea').textContent = keys.join(separator);
            } else msg.alert('Empty search, please select the correct options');
        });

        $('.BSButtonCopy').addEventListener('click', () => {
            $('.BSRetrive textarea').select();
    		document.execCommand('copy');
        });

        $('.BSButtonReset').addEventListener('click', () => {
            $('.BSRetrive textarea').textContent = '';
        });

        this.baseElements = [document];
        var blocks = $$('hr ~ div > div:not(.ng-hide)'),
            selectFrom = $('.BSSelectFrom');

        selectFrom.appendChild(new Option('All', 0));

        for (let block of blocks) {
            let option,
                bundle = block.querySelector('h3'),
                tiers = Array.from(block.querySelectorAll('h4'));

            if (tiers.length > 1) { //bundles (multiple tiers)
                for (let tier of tiers) {
                    selectFrom.appendChild(new Option(
                        bundle.textContent + ' ' + tier.textContent,
                        this.baseElements.push(tier.parentNode) - 1
                    ));
                }
            } else if (bundle) { //bundles (single tier)
                selectFrom.appendChild(new Option(
                    bundle.textContent,
                    this.baseElements.push(bundle.nextElementSibling) - 1
                ));
            } else { //individual games
                selectFrom.appendChild(new Option(
                    block.querySelector('.title').textContent,
                    this.baseElements.push(block) - 1
                ));
            }
        }

        $('.BSSelectTo').innerHTML = selectFrom.innerHTML;
    };

    BSRetrive.selector = function (selector) {
        var results = [],
            from = parseInt($('.BSSelectFrom').value),
            to = parseInt($('.BSSelectTo').value);

        if (Number.isInteger(from) && Number.isInteger(to)) {
            if (from === 0 && to > 0) from = 1;
            if (from > 0 && to === 0) to = this.baseElements.length - 1;

            for (var index = Math.min(from, to); index <= Math.max(from, to); index++) {
                let node = this.baseElements[index], result;

                if (node) result = Array.from(node.querySelectorAll(selector));
                if (result) results = results.concat(result);
            }
        }
        return results;
    };

    var msg = {
        box: null,
        init() {
            var style = document.createElement('style');

            style.type = 'text/css';
            style.innerHTML = `
                .BSRetrive_msg {
                    display: none;
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    padding: 10px 20px;
                    border: 1px solid #424242;
                    background-color: rgb(32, 32, 32);
                    color: #FFF;
                    font-size: larger;
                }
                .BSRetrive_msg-show {
                    display: block;
                }
            `;
            document.head.appendChild(style);

            var BSRetrive_msg = document.createElement('div');

            BSRetrive_msg.classList.add('BSRetrive_msg');
            document.body.appendChild(BSRetrive_msg);
            this.box = BSRetrive_msg;
        },
        alert(text) {
            this.box.textContent = text;
            this.box.classList.add('BSRetrive_msg-show');
            setTimeout(this.hide.bind(this), 3000);
        },
        hide() {
            this.box.classList.remove('BSRetrive_msg-show');
        }
    };

    msg.init();

    BSRetrive.init();

    new MutationObserver(mutations => {
        for (let mutation of mutations) {
            if (!mutation.removedNodes.length) continue;
            if (mutation.removedNodes[0].id === 'loading-bar-spinner') BSRetrive.setup();
        }
    }).observe(document.body, {childList: true});

})();
