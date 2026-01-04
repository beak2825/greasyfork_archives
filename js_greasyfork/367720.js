// ==UserScript==
// @name         ScrapTF winning chance
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Readds the winning chance % to raffle pages, plus a couple other things
// @author       You
// @match        https://scrap.tf/raffles/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/367720/ScrapTF%20winning%20chance.user.js
// @updateURL https://update.greasyfork.org/scripts/367720/ScrapTF%20winning%20chance.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(typeof HTMLCollection.prototype.forEach !== 'function') {
        HTMLCollection.prototype.forEach - Array.prototype.forEach;
    }

    const LolScrap = {
        currentChance: 0,
        winningChanceContainer: null,
        items: 0,

        commentButton: null,
        commentInput: null,

        comments : [
            '%s win chance!!',
            'only %s chance to win :((',
            'hey guys I have %s chance to win!',
            '%s!1!1',
            'omg %s chance',
            'only %s chance :(  I have never won or bought a unusual and I have no change of winning anything :p :(',
            '%s to win but keeps going down :(',
            '%s chance plsplspls',
            'I have %s chance to win, whats yours??',
            '%s of winning we i hope the person who win\'s this (not me by a long shot thats just my luck) enjoys it',
            '%s i wont win :( WHY THIS SITE HATE ME',
            'when you dont win the unusual raffle you have a %s chance of winning',
            'i never win these, especially not with %s :((',
        ],

        init: function() {
            let initialEntries = parseInt(document.querySelector('#raffle-num-entries').dataset.total);

            this.commentButton = document.querySelector('.btn-raffle-comment');
            this.commentInput = document.querySelector('#poll-comment');

            this.addWinChance();
            this.addBanChance();
            this.addCommentListener();
            this.addStyles();

            this.oldHandleData = unsafeWindow.ScrapTF.Raffles.HandleData;
            this.items = this.countItems();

            unsafeWindow.ScrapTF.Raffles.HandleData = data => {
                const entries = parseInt(data.data.entries.replace(',', ''));

                this.updateWinChance(entries);
                this.oldHandleData(data);
            };

            this.updateWinChance(initialEntries);
        },

        addWinChance: function() {
            let tips = document.getElementById('raffle-tips').previousElementSibling,
                winningChanceLabel = document.createElement('dt'),
                winningChance = document.createElement('dd');

            winningChance.id = 'winning-chance';

            winningChanceLabel.innerText = 'Winning Chance:';
            winningChance.innerText = '%';

            tips.insertAdjacentElement('beforebegin', winningChanceLabel);
            tips.insertAdjacentElement('beforebegin', winningChance);

            this.winningChanceContainer = winningChance;
        },

        addBanChance: function() {
            const chance = (Math.random() * 100).toFixed(4);
            let banChanceLabel = document.createElement('dt'),
                banChance = document.createElement('dd');

            banChance.id = 'ban-chance';

            banChanceLabel.innerText = 'Ban Chance:';
            banChance.innerText = `~${chance}%`;

            this.winningChanceContainer.insertAdjacentElement('afterEnd', banChance);
            this.winningChanceContainer.insertAdjacentElement('afterEnd', banChanceLabel);

            this.banChance = banChance;
        },

        addCommentListener: function() {
            this.commentButton.addEventListener('contextmenu', e => {
                e.preventDefault();
               this.generateComment();
            });
        },

        addStyles: function() {
            let sheet = unsafeWindow.document.styleSheets[0];
            sheet.insertRule('.raffle-info-col, .raffle-user-col { height: 250px !important; }', sheet.cssRules.length);
        },

        updateWinChance: function(entries) {
            const chance = (this.items / entries).toFixed(4);

            this.currentChance = chance;
            this.winningChanceContainer.innerText = `~${chance}%`;
        },

        generateComment: function() {
            let comment = this.comments[Math.floor(Math.random()* this.comments.length)];

            comment = comment.replace('%s', this.currentChance + '%');

            this.commentInput.value = comment;
        },

        countItems: function() {
            const itemsContainer = document.querySelector('.items-container');
            let count = 0,
                countedGroups = [],
                items = Array.from(itemsContainer.children);

            console.log(itemsContainer.children);

            for(let item of items) {
                const group = item.dataset.group;

                if(group) {
                    if(countedGroups.indexOf(group) > -1) {
                        continue;
                    } else {
                         countedGroups.push(group);
                    }
                }

                count++;
            }

            return count;
        },
    };

    LolScrap.init();
})();

