// ==UserScript==
// @name         MouseHunt - Mass Convertible Submit
// @version      2.0.0
// @description  Add button to open many convertibles one-by-one so MHCT can record singles.
// @license      MIT
// @author       Xellis
// @namespace    https://github.com/hymccord
// @match        https://www.mousehuntgame.com/*
// @grant        none
// @icon         https://www.mousehuntgame.com/images/mice/square/6b9bd6acb4a07d560f61e5678e4ff3b5.jpg
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/459989/MouseHunt%20-%20Mass%20Convertible%20Submit.user.js
// @updateURL https://update.greasyfork.org/scripts/459989/MouseHunt%20-%20Mass%20Convertible%20Submit.meta.js
// ==/UserScript==

/* global $, hg, eventRegistry */
'use strict';

let progressNode = null;

function useConvertibleOneByOne (element) {
    var target = $(element);
    if (target.hasClass('busy')) {
        return false;
    }

    // Get the amount to open and verify it's a good number
    const container = target.parents('.itemViewContainer');
    var quantityToOpen = +$('.itemView-action-convert-quantity', container).val();
    const itemType = container.data('itemType');
    if (isNaN(quantityToOpen) || quantityToOpen < 1) {
        return;
    }

    // debug limit
    //if (quantityToOpen > 5) {
    //    quantityToOpen = 5
    //}

    removeSubmitButton();
    //target.addClass('busy');
    addProgressText();
    const nextBtn = addNextButton();
    const finishBtn = addFinishButton();
    setProgressText(0, quantityToOpen);

    let aggregatedItemData = [];
    let convertibleBaseData = null;
    let quantityOpened = 0;

    var openItem = function() {
        hg.utils.UserInventory.useConvertible(itemType, 1, completionCallback, errorCallback);
    }

    var completionCallback = function (data) {
        quantityOpened += 1;
        setProgressText(quantityOpened, quantityToOpen);

        if (!data.convertible_open) {
            return;
        }

        // need the original responsed data to render template
        if (!convertibleBaseData) {
            convertibleBaseData = data.convertible_open;
        }

        // aggregate items
        aggregatedItemData.push(...data.convertible_open.items);

        // No automation
        // if (quantityOpened < quantityToOpen) {
        //     openItem();
        // }
        $(nextBtn).removeClass('busy');

        if (quantityOpened == quantityToOpen) {
            finishOpening();
        }
    }

    var finishOpening = function() {
        removeProgressText();
        showAggregatedData();
        removeNextButton();
        removeFinishButton();
    }

    var errorCallback = function () {
        console.error("Error occurred during 'Submit 1-by-1'");
        showAggregatedData();
    }

    var showAggregatedData = function () {
        convertibleBaseData.items = aggregatedItemData;
        const convertibleDialog = new hg.views.ConvertibleOpenView(convertibleBaseData);
        convertibleDialog.show();
        queueReloadAfterDialogClose(itemType);
    }

    const queueReloadAfterDialogClose = function (itemType) {
        eventRegistry.addEventListener('js_dialog_hide', function () {
            setTimeout(function () {
                hg.utils.UserInventory.getItem(itemType, function (item) {
                    if ((item && item.quantity > 0) || hg.utils.PageUtil.getCurrentPage() == 'Item') {
                        hg.views.ItemView.show(item.type);
                    }
                });
            }, 100);
        }, null, true);
    }

    $(nextBtn).click((e) => {
        e.preventDefault();
        $(nextBtn).addClass('busy');
        openItem();
    });

    $(finishBtn).click((e) => {
        e.preventDefault();
        finishOpening();
    });

    openItem();
}

function createActionButton(id, text) {
    const button = document.createElement('a');
    button.id = id;
    button.classList.add('mousehuntActionButton');
    button.classList.add('small');
    button.classList.add('itemView-action-convert-actionButton');
    button.href = '#';

    const span = document.createElement('span');
    span.innerText = text;

    button.appendChild(span);

    return button;
}

function getMassSubmitNode (args) {
    const itemInfo = document.querySelector(args.id);
    if (! itemInfo) {
        return false;
    }

    const itemID = itemInfo.getAttribute('data-item-id');
    if (! itemID ) {
        return false;
    }

    const submitButton = createActionButton('xel-mass-submit-btn', 'Submit 1-by-1');

    $(submitButton).click((e) => {
        e.preventDefault();
        useConvertibleOneByOne(e.currentTarget);
    });

    return submitButton;
};

function getNextNode(args) {
    const next = createActionButton('xel-mass-next-btn', 'Next');
    return next;
}

function getFinishNode(args) {
    const finish = createActionButton('xel-mass-finish-btn', 'Finish');
    return finish;
}

function getProgressNode () {
    const newText = document.createElement('span');
    newText.id = 'mass-submit-convertible-progress';
    newText.style.padding = '5px 10px';
    newText.innerText = 'Progress: 0 / 0';
    return newText;
}

/**
* Append text to a node, either before or after another node.
*
* @param {Object} args         Arguments to use for the text.
* @param {string} args.parent  CSS selector for the parent node.
* @param {string} args.child   CSS selector for the child node.
* @param {string} args.content Text to append.
*
* @return {Node} The node that was appended to.
*/
function appendText (args) {
    const append = document.querySelector(args.parent);
    if (! append) {
        return false;
    }

    if (args.child) {
        const child = document.querySelector(args.child);
        if (child && args.content) {
            return append.insertBefore(args.content, child);
        }
    } else {
        return append.appendChild(args.content);
    }

    return false;
};

function addSubmitButton() {
    appendText({
        parent: '.itemView-action-convertForm',
        content: getMassSubmitNode({
            id: '.itemViewContainer'
        })
    });
}

function removeSubmitButton() {
    const button = document.getElementById('xel-mass-submit-btn');
    if (!button) {
        return;
    }

    button.remove();
}

function addProgressText() {
    if (progressNode != null) {
        return;
    }
    progressNode = getProgressNode();
    appendText({
        parent: '.itemView-action-convertForm',
        content: progressNode
    });
}

function setProgressText(current, max) {
    if (progressNode == null) {
        return;
    }

    $(progressNode).text(`Progress: ${current} / ${max}`);
}

function removeProgressText() {
    if (progressNode == null) {
        return
    }

    $(progressNode).remove();
    progressNode = null;
}

function addNextButton() {
    const nextNode = getNextNode();
    appendText({
        parent: '.itemView-action-convertForm',
        content: nextNode
    });
    return nextNode;
}

function removeNextButton() {
    const element = document.getElementById('xel-mass-next-btn');
    if (!element) {
        return;
    }

    element.remove();
}

function addFinishButton() {
    const finishNode = getFinishNode();
    appendText({
        parent: '.itemView-action-convertForm',
        content: finishNode
    });
    return finishNode;
}

function removeFinishButton() {
    const element = document.getElementById('xel-mass-finish-btn');
    if (!element) {
        return;
    }

    element.remove();
}

$(document).ajaxSuccess((e, xhr, options) => {
    const url = options.url;
    if (url.indexOf('managers/ajax/users/userInventory.php') !== -1) {
        addSubmitButton();
    }
});

if (window.location.href.indexOf('item.php') !== -1 ||
    window.location.href.indexOf('/i.php') !== -1 ) {
    addSubmitButton();
}
