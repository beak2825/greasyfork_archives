// ==UserScript==
// @name         Jira simplification for daily scrum screen sharing
// @namespace    https://atlassian.net/
// @version      0.2
// @description  Make Jira a little be more cool for daily scrum ceremony throw screen share.
// @author       florent.ou@l214.com
// @license      MIT 
// @match        https://*.atlassian.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459707/Jira%20simplification%20for%20daily%20scrum%20screen%20sharing.user.js
// @updateURL https://update.greasyfork.org/scripts/459707/Jira%20simplification%20for%20daily%20scrum%20screen%20sharing.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var r = document.querySelector(':root');
    r.style.setProperty('--ds-background-neutral-subtle-hovered', '#6bb1f6');
    r.style.setProperty('--ds-border-focused', '#ffffff');

    function addElement(EltName, EltContent, ParentName) {
        let parent, elt;
        parent = document.getElementsByTagName(ParentName)[0];
        elt = document.createElement(EltName);
        elt.setAttribute('id',EltName +'-added');
        elt.innerHTML = EltContent;
        parent.appendChild(elt);
        return elt;
    }
    function addGlobalStyle(css) {
        return addElement('style', css, 'head');
    }
    var styleElt = addGlobalStyle(`
    #button-added {position: fixed; bottom:0; right:0; cursor: pointer;}
    body.scrum .bUVHxt,
    body.scrum .dvjujU,
    body.scrum .XXbvY,
    body.scrum .dowUUC > div > .css-1pa8dxh,
    body.scrum .cVFuO,
    body.scrum header,
    body.scrum #ak-jira-navigation,
    body.scrum .sc-1boey8w-0:nth-child(n + 3),
    body.scrum .guavb6-5.iVOgsI,
    body.scrum .fXZWOO,
    body.scrum .bynBpJ,
    body.scrum .bgHZPu
    { display:none !important; }
    body.scrum .guavb6-2.jPYWbI { display: inline-block; }
    body.scrum .css-1q41chj { display: block; }
    body.scrum #ak-main-content { margin-top: 13px; }
    body.scrum .atlaskit-portal {z-index:1 !important;}
    body.scrum .atlaskit-portal .css-10ki349 { width: auto; min-height:none; border: none; box-shadow: none; top: -43px !important; left: 19px !important;}
    body.scrum .atlaskit-portal .css-10ki349 button { padding:0; min-height:unset; -webkit-appearance: none;}
    body.scrum .guavb6-0.cFXfzH {visibility: hidden;}
    `);

    let intervalRef
//    window.onload = function() {
//
//    }

    let button = addElement('button', 'Start scrum mode', 'body');
    button.addEventListener('click', (event) => {
        if(button.innerHTML === 'Start scrum mode') {
            document.body.classList.add("scrum")
            const plusPeople = document.querySelector('input[data-test-id="filters.ui.filters.assignee.stateless.show-more-button.assignee-filter-show-more"]')
            plusPeople.click()
            intervalRef = setInterval(function(){
                if(document.querySelector("span[aria-label='Paco']") === null) {
                    plusPeople.click()
                }
            }, 4000);
            button.innerHTML = 'Stop scrum mode'
        }
        else {
            document.body.classList.remove("scrum")
            clearInterval(intervalRef)
            button.innerHTML = 'Start scrum mode'
        }
    });

})();