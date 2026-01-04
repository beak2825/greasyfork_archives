// ==UserScript==
// @name         AO3 UI changes
// @namespace    http://tampermonkey.net/
// @version      0.5.6
// @description  Customize ui on AO3 work pages
// @author       Melissa Clarke
// @match        http*://archiveofourown.org/works*
// @match        http*://archiveofourown.org/works/*
// @match        http*://archiveofourown.org/collections/*/works*
// @match        http*://archiveofourown.org/collections/*/bookmarks*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462534/AO3%20UI%20changes.user.js
// @updateURL https://update.greasyfork.org/scripts/462534/AO3%20UI%20changes.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var navList = document.querySelector('ul.work.navigation.actions');

    //auto click epub button on download button click
    onDownloadClick();

    //make a kudo button at the top
    cloneKudo();

    //hide buttons
    var buttons = [
        '.actions > li.mark'
        , '.actions > li.chapter'
        , '.actions > li.bookmark'
        , '.actions > li.comments'
        , '.actions > li.share'
        , '.actions > li.style'
    ];
    toggleActionButtons();
    makeToggleButton();

    //display stats under the work date
    showStatsAbove();

    function onDownloadClick(){
        var downloadBtn = document.querySelector('li.download button');
        var epubBtn = document.querySelector('li.download ul li:nth-child(2) a');

        if (!downloadBtn) {
            return;
        }

        downloadBtn.addEventListener('click', function(){
            epubBtn.click();
            this.click();
        });
    }

    function cloneKudo(){
        var kudoForm = document.getElementById('new_kudo');
        if (kudoForm == undefined || kudoForm == null){
            return;
        }

        kudoForm.cloneNode(true);
        kudoForm.style.display = 'inline';
        navList.insertAdjacentElement('beforebegin', kudoForm);
        kudoForm.addEventListener('submit', function(){
            document.getElementById('kudo_submit').style.display = 'none';
        });
    }

    function toggleActionButtons(){
        for (var i in buttons){
            var els = document.querySelectorAll(buttons[i]);
            els.forEach( j => {
				j.style.display = j.style.display == 'none' ? 'inline-block' : 'none';
			});
        }
    }

    function makeToggleButton(){
        const node = document.createElement('li');
        const textnode = document.createTextNode( '\u{1F441}' );
        node.appendChild(textnode);
        node.classList.add('toggle-nav');
        node.addEventListener('click', toggleActionButtons);

        if (navList !== undefined && navList !== null){
            navList.appendChild(node);
        }
    }

    function showStatsAbove() {
        const styleEl = document.createElement('style');
        styleEl.textContent = `
            div.stats {
                display: flex;
                flex-direction: column;
                flex-wrap: wrap;
                font-size: 70%;
                text-align: right;
                position: absolute;
                top: 23px;
                right: 0px;
            }
            div.stat {
                flex-direction: row;
                padding-bottom: 3px;
            }
            div.stat > .label {
                font-weight: bold;
            }
            .bookmark p.status {
                display: none;
            }
            .bookmark .datetime {
                top: 0px;
            }
        `;
        document.head.appendChild(styleEl);

        document.querySelectorAll('.blurb').forEach((work) => {
            const anchor = work.querySelector('h4.heading');

            if (anchor == undefined || anchor == null) {
                return;
            }
            const statArr = [
                { label: 'score', selector: 'dd.kudoshits' },
                { label: 'words', selector: 'dd.words' },
                { label: 'chapters', selector: 'dd.chapters' }
            ];

            const stats = document.createElement('div');
            stats.classList.add('stats');

            statArr.forEach((stat) => {
                try{
                    stats.appendChild(makeStat(work, stat.label, stat.selector));
                }catch(err){
                    console.log(stat.selector, err);
                }
            });

            anchor.after(stats);

        });
    }


    function makeStat(work, label, selector) {
        const stat = document.createElement('div');
        stat.classList.add(label);
        stat.classList.add('stat');

        const labelEl = document.createElement('div');
        labelEl.classList.add('label');
        labelEl.textContent = toTitleCase(label) + ':';
        stat.appendChild(labelEl);

        const valEl = document.createElement('div');
        valEl.classList.add('value');
        valEl.classList.add(work.querySelector(selector).classList);
        valEl.innerHTML = work.querySelector(selector) ? work.querySelector(selector).innerHTML : '';
        stat.appendChild(valEl);

        return stat;
    }


    function toTitleCase(str) {
        if (!str) {
            return "";
        }

        return str
            .toLowerCase()
            .split(" ")
            .map(function (word) {
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(" ");
    }

})();
