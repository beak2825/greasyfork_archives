// ==UserScript==
// @name         MWI QoL Hide Full Party
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Tools for MilkyWayIdle. Allows you to enable or disable the display of full parties.
// @author       AlexZaw
// @license      MIT License
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @downloadURL https://update.greasyfork.org/scripts/531074/MWI%20QoL%20Hide%20Full%20Party.user.js
// @updateURL https://update.greasyfork.org/scripts/531074/MWI%20QoL%20Hide%20Full%20Party.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hideFullPartyStyle = document.createElement('style');
hideFullPartyStyle.textContent = `
  .hidden-party {
    display: none !important;
  }
  .showHideFullparty-chk{
    accent-color: var(--color-success);
    margin: 0;
    width: 20px;
    height: 21px;

  }

  .showHideContainer {
    gap: 10px;
  }
  `;

document.head.appendChild(hideFullPartyStyle);
let showHideCheckbox;
let showHideText;
let showFullPartyFlag = true;

new MutationObserver(waitMainPanelElem).observe(document, {
    childList: true,
    subtree: true,
});

function waitMainPanelElem(changes, observer) {
    if (document.querySelector('.MainPanel_mainPanel__Ex2Ir')) {
        observer.disconnect();
        observeMainPanelChanges();
    }
}

function observeMainPanelChanges() {
    new MutationObserver(onMainPanelChange).observe(
        document.querySelector('.MainPanel_mainPanel__Ex2Ir'),
        {
            childList: true,
            subtree: true,
        }
    );
}

function onMainPanelChange(mutationList) {
    try {
        if (
            document
                .querySelector('.FindParty_optionsContainer__3WFfI')
                .querySelector('.Button_button__1Fe9z')
        ) {
            addButton();
        }
    } catch (error) {
        return false;
    }

    try {
        if (document.querySelector('.FindParty_partyList__3lirO')) {
            observePartyList();
        }
    } catch (error) {
        return false;
    }
}

function addButton() {
    if (!document.querySelector('.showHideFullparty-chk')) {
        const showHideContainer = document.createElement('label');
        showHideText = document.createElement('span');
        showHideCheckbox = document.createElement('input');
        showHideCheckbox.type = 'checkbox';
        showHideContainer.classList.add(
            'Button_button__1Fe9z',
            'showHideContainer'
        );
        showHideCheckbox.classList.add('showHideFullparty-chk');
        showHideText.innerText = 'Hide full';
        showHideCheckbox.addEventListener('change', showHide);
        showHideContainer.appendChild(showHideCheckbox);
        showHideContainer.appendChild(showHideText);
        document
            .querySelector('.FindParty_optionsContainer__3WFfI')
            .appendChild(showHideContainer);
    }
}

function observePartyList() {
    new MutationObserver(showHide).observe(
        document.querySelector('.FindParty_partyList__3lirO'),
        {
            childList: true,
        }
    );
}

function showHide(mutationList, observer) {
    if (showHideCheckbox.checked) {
        showFullPartyFlag = false;
    } else {
        showFullPartyFlag = true;
    }

    const partyList = document.querySelector(
        '.FindParty_partyList__3lirO'
    ).children;
    [...partyList].forEach(function (party) {
        if (!isFree(party) && showFullPartyFlag == false) {
            party.classList.add('hidden-party');
        } else {
            party.classList.remove('hidden-party');
        }
    });
}

function isFree(party) {
    return party
        .querySelector('[class*="FindParty_partySlots"]')
        .querySelectorAll('[class*="FindParty_empty"]').length;
}

})();