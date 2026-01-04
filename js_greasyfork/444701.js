// ==UserScript==
// @name         Symless Zendesk Fixer
// @namespace    https://github.com/symless/zendesk-fixer
// @version      0.2.8
// @description  Make Zendesk UX less painful/horrifying.
// @author       Nick Bolton
// @match        *://symless.zendesk.com/*
// @icon         https://d1eipm3vz40hy0.cloudfront.net/images/logos/zendesk-favicon.svg
// @grant        GM.setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444701/Symless%20Zendesk%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/444701/Symless%20Zendesk%20Fixer.meta.js
// ==/UserScript==

const name = 'SZF';
let customElement;
let propertyBoxInterval;
let checkerInterval;

/* globals jQuery, $, waitForKeyElements */

function log(...message) {
    console.log(name, ...message);
}

function getTicketId() {
    let urlMatch = location.href.match("agent/tickets/([0-9]+)");
    if (urlMatch && urlMatch.length > 1) {
        let ticketId = urlMatch[1];
        return ticketId;
    }
    return null;
}

async function getTicketInformation(ticketId) {
    //includes customers' name, email, conversation count, etc
    const url = 'https://symless.zendesk.com/api/lotus/tickets/' + ticketId + '/conversations.json?include=users&sort_order=desc';
    log('API URL', url);

    let email;
    let name;
    let originalName;
    let conversationCount;
    let authorId;
    let response = await fetch(url);
    let data = await response.json();

    conversationCount = data.count;



    async function checkTicketUpdates() {
        checkerInterval = (setInterval(async function() {
            let updatedResponse = await fetch(url);
            let updatedData = await updatedResponse.json();
            let updatedConversationCount = updatedData.count;
            if(conversationCount != updatedConversationCount) {
                conversationCount === updatedConversationCount;
                document.getElementById("messageCount").innerHTML = updatedConversationCount;
            }
        }, 1000));
     }

    checkTicketUpdates();

    $.each(
        data.users,
        function() {
            let user = $(this)[0];
            if (user.role == 'end-user') {
                email = user.email;
                name = user.name;
                authorId = user.id
            }
        }
    );
    log("Unformatted name: ", name);
    originalName = name;

    function formatName() {
        let newName;
        let count = 0;
        name = name.toLowerCase().split(" ");

        name.forEach((nameSection) => {
            nameSection = nameSection.charAt(0).toUpperCase() + nameSection.slice(1);
            if(nameSection.includes("-")) {
                // formats double-barreled names
                let doubleBarrel;
                doubleBarrel = nameSection.slice(nameSection.indexOf("-") + 1);
                doubleBarrel = doubleBarrel.charAt(0).toUpperCase() + doubleBarrel.slice(1);
                nameSection = nameSection.slice(0, nameSection.indexOf("-")) + "-" + doubleBarrel;
            }
            // TODO: this seems complex, can we simplify it?
            if(nameSection.includes("(")) {
                nameSection = nameSection.slice(0, 1) + nameSection.charAt(nameSection.indexOf("(") + 1).toUpperCase() + nameSection.slice(2)
            }
            if(count === 0) {
                newName = nameSection;
            } else {
                newName = newName + " " + nameSection;
            }
            count ++;
        })
        name = newName;
        return name;
    }
    formatName(name);

    log("Formatted name: ", name);
    let userDetails = [email, name, originalName, conversationCount, authorId];
    return userDetails;
}


function updatePropertyBox(email, name, url, originalName, messageCount, authorId) {

    let box;

    // only allow one running at a time
    clearInterval(propertyBoxInterval);

    log('Finding property box');
    propertyBoxInterval = setInterval(function() {
        let boxes = $('.property_box:visible');
        if (boxes.length != 0) {

            // stop finding property box now we found one
            clearInterval(propertyBoxInterval);
            let newBoxes = [];
            for (let box of boxes) {
                if (box.className == "property_box") {
                     newBoxes.push(box);
                }
            }
            boxes = newBoxes;
            let allPanes = document.getElementById("main_panes").childNodes;
            let newPanes = [];
            for (let pane of allPanes) {
                if (!pane.style.display) {
                    newPanes.push(pane);
                }
            }
            allPanes = newPanes;
            log("Detecting which ticket you are viewing");
            let count = 0;
            for (let pane of allPanes) {
                if(!pane.style.opacity && !pane.style.display) {
                    log("Ticket found");
                    box = boxes[count];
                    break;
                }
                count ++;
            }
            log('Property box found', box);

            const encodedEmail = encodeURIComponent(email);
            let staffUrl = `https://staff.symless.com/resources/users?users_page=1&undefined_search=${encodedEmail}` ;
            let paddleUrl = `https://vendors.paddle.com/orders?start_date=2000-01-01&end_date=3000-01-01&search=${encodedEmail}&action=Search`;

            // remove existing element in case a new one was appended during searching
            if (customElement) {
                customElement.remove();
            }

            let newTicket = 0
            let pendingTicket = 0
            let openTicket = 0
            let holdTicket = 0

            async function detectMultipleTickets() {
                const url = `https://symless.zendesk.com/api/v2/users/${authorId}/tickets/requested.json`

                let response = await fetch(url)
                let data = await response.json()

                for(ticket of data.tickets) {
                    if(ticket.status == "new") {
                        newTicket ++
                    } else if (ticket.status == "pending") {
                        pendingTicket ++
                    } else if (ticket.status == "open") {
                        openTicket ++
                    } else if (ticket.status == "hold") {
                        holdTicket ++
                    }
                }

                document.getElementById("ticket-count-new").innerHTML = document.getElementById("ticket-count-new").innerHTML + newTicket
                document.getElementById("ticket-count-pending").innerHTML = document.getElementById("ticket-count-pending").innerHTML + pendingTicket
                document.getElementById("ticket-count-open").innerHTML = document.getElementById("ticket-count-open").innerHTML + openTicket
                document.getElementById("ticket-count-hold").innerHTML = document.getElementById("ticket-count-hold").innerHTML + holdTicket
            }

            detectMultipleTickets()

            $(box).prepend(
                '<div class="property_box_symless">' +

                '<div style="padding-bottom: 10px">' +
                '<b>Email</b>' +
                ' (<a class="copy-email-button")">copy</a>)' +
                '<br/>' +
                '<span style="white-space: nowrap">' + email + '</span>' +
                '</div>' +

                '<div style="padding-bottom: 10px">' +
                '<b>Name</b>' +
                ' (<a class="copy-name-button")">copy</a>)' +
                '<br/>' +
                '<span style="white-space: nowrap">' + name + '<p id="warning" style="display: inline-block; padding-left: 0.25rem;"</p></span>' +
                '</div>' +

                '<div style="padding-bottom: 10px">' +
                '<b>Tools</b>' +
                '<br/>' +
                '<span style="white-space: nowrap"><a href="' + staffUrl + '" target="_blank">Staff</a></span> | ' +
                '<span style="white-space: nowrap"><a href="' + paddleUrl + '" target="_blank">Paddle</a></span>' +
                '</p>' +
                '</div>' +

                '<div>' +
                '<b>Ticket stats</b>' +
                '<br />' +
                '<p> Messages: <span id="messageCount">' + messageCount + '<span id="emoji" style="padding-left: 0.25rem"></span></span></p>' +

                '</div>' +
                '<div id="related-tickets">' +
                '<b>Related tickets</b>' +
                '<div style="display: flex; margin-top: 0.4rem;">' +
                '<div style="min-width:35px;">' +
                '<div style="max-width: 100%;  display: inline-block;box-sizing: border-box; margin-bottom: 2px;  white-space: nowrap;  text-align: center;    font-size: 9px;       vertical-align: middle;               text-overflow: ellipsis;              text-transform: uppercase;             font-weight: 600;  height: 15px;        line-height: 15px;        border-radius: 3px;   background-color: rgb(255, 176, 87);            color: rgb(112, 56, 21);            width: 15px;">N</div>' +
                '<span id="ticket-count-new" style="padding-top: 3px; padding-left: 5px;"></span>' +
                '</div>' +
                '<div style="min-width:35px;">' +
                '<div style="max-width: 100%;  display: inline-block;box-sizing: border-box; margin-bottom: 2px;  white-space: nowrap;  text-align: center;    font-size: 9px;       vertical-align: middle;               text-overflow: ellipsis;              text-transform: uppercase;             font-weight: 600;  height: 15px;        line-height: 15px;        border-radius: 3px;   background-color: rgb(227, 79, 50);            color: rgb(255, 255, 255);           width: 15px;">O</div>' +
                '<span id="ticket-count-open" style="padding-top: 3px; padding-left: 5px;"></span>' +
                '</div>' +
                '<div style="min-width:35px;">' +
                '<div style="max-width: 100%;  display: inline-block;box-sizing: border-box; margin-bottom: 2px;  white-space: nowrap;  text-align: center;    font-size: 9px;       vertical-align: middle;               text-overflow: ellipsis;              text-transform: uppercase;             font-weight: 600;  height: 15px;        line-height: 15px;        border-radius: 3px;   background-color: rgb(48, 145, 236);            color: rgb(255, 255, 255);           width: 15px;">P</div>' +
                '<span id="ticket-count-pending" style="padding-top: 3px; padding-left: 5px;"></span>' +
                '</div>' +
                '<div style="min-width:35px;">' +
                '<div style="max-width: 100%;  display: inline-block;box-sizing: border-box; margin-bottom: 2px;  white-space: nowrap;  text-align: center;    font-size: 9px;       vertical-align: middle;               text-overflow: ellipsis;              text-transform: uppercase;             font-weight: 600;  height: 15px;        line-height: 15px;        border-radius: 3px;   background-color: rgb(47, 57, 65);            color: rgb(255, 255, 255);           width: 15px;">H</div>' +
                '<span id="ticket-count-hold" style="padding-top: 3px; padding-left: 5px;"></span>' +
                '</div>' +
                '</div>' +
                '<div style="padding-bottom: 10px">' +
                `<b>Useful stuff</b>` +
                '<br/>' +
                '<a class="copy-url-button" style="white-space: nowrap">Open in new tab</a>' +
                '</div>' +
                '</div>'
            );
            customElement = $('.property_box_symless');

            let emailButton = customElement.find(".copy-email-button");
            let nameButton = customElement.find(".copy-name-button");
            let urlButton = customElement.find(".copy-url-button")
            log('Button', emailButton);
            emailButton.click(function() {
                log('Copy', email);
                GM.setClipboard(email);
            });

            log('Button', nameButton);
            nameButton.click(function() {
                log('Copy', name);
                GM.setClipboard(name);
            });
            log('Button', urlButton)
            urlButton.click(function() {
                log('Copy', url);
                window.open(url, '_blank');
            });
            //shows a warning if the two names don't match up, as the macro will be incorrect
            let warning = document.getElementById("warning");
            originalName === name ? warning.innerHTML = "": warning.innerHTML = "⚠️";

            let messageCountDiv = document.getElementById("messageCount");
            let messageCountEmoji = document.getElementById("emoji")

            let messageCountStyler = setInterval(() => {
                if(messageCount >= 10) {
                    messageCountDiv.style.color = "#a31212";
                    messageCountEmoji.innerHTML = "🔥"
                    return;
                }
                if(messageCount > 4) {
                    messageCountDiv.style.color = "#a37812";
                    messageCountEmoji.innerHTML = "📈"
                    return;
                }
                messageCountDiv.style.color = "#29a349";
            }, 1000)
        }
        else {
            log('No property box');
        }
    }, 100);
}

async function onUrlChange() {
    log("URL changed", location.href);

    // stop finding property box if in progress
    clearInterval(propertyBoxInterval);

    clearInterval(checkerInterval)

    // clear the old custom element as soon as possible
    if (customElement) {
        customElement.remove();
    }

    log('Finding ticket ID');
    let ticketId = getTicketId();
    if (ticketId) {
        log('Found ticket ID', ticketId);

        log('Finding email and name');
        let clientDetails = await getTicketInformation(ticketId);
        let email = clientDetails[0];
        let name = clientDetails[1];
        let originalName = clientDetails[2];

        let url = "/agent/tickets/" + ticketId
        let messageCount = clientDetails[3]
        let authorId = clientDetails[4]
        if (email) {
            log('Found email', email);
            log('Found name', name);
            updatePropertyBox(email, name, url ,originalName, messageCount, authorId);
        }
        else {
            log('No email was found');
        }
    }
    else {
        log('No ticket ID was found');
    }
}

function removeEditorWhitespaceParagraphs()
{
    let pElements = [];
    let brCount = 0;

    $('.ck-content p').each(function() {

        if ($(this).children().length == 1) {
            let br = $('br', $(this));
            if (br.length == 1) {
                brCount++;
                pElements.push($(this));
            }
            else {
                // reset if none, as we're looking for 3 in a row.
                brCount = 0;
            }

            if (brCount == 3) {
                brCount = 0;
                pElements[0].detach().appendTo($('.ck-content'));
            }
        }
        else {
            // reset if none, as we're looking for 3 in a row.
            brCount = 0;
        }
    });
}

function replaceSelectedText(replacementText) {
    var sel, range;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(replacementText));
        }
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        range.text = replacementText;
    }
}

function selectElementContents(el) {
    var range = document.createRange();
    range.selectNodeContents(el);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}

function removeEditorZeroWidthSpaceChars()
{
    // TODO: try to remove ZWSP using regex (previous attempt didn't work)
    $('.ck-content p').each(function() {
        let html = $(this).html();
        const zwspChar = 8203;
        let newHtml = '';
        let charRemoved = false;
        for (let i = 0; i < html.length; i++) {
            if (html.charCodeAt(i) != zwspChar) {
                newHtml += html[i];
            }
            else {
                charRemoved = true;
            }
        }
        if (charRemoved) {
            $(this).get(0).innerHTML = newHtml;
        }
    });
}

function cleanEditorText()
{
    log('cleaning editor text');
    //removeEditorWhitespaceParagraphs(); // doesn't work
    removeEditorZeroWidthSpaceChars();
}

function onMacroMenuVisibilityChanged(visible)
{
    log('macro menu visible', visible);
    if (visible) {
        return;
    }

    // HACK: wait a while after macro menu goes away;
    // Zendesk doesn't apply the macro until a little while
    // after the meny has gone.
    // TODO: find a more elegant way such as waiting for the
    // editor DOM tree to change.
    setTimeout(function() {
        cleanEditorText();
    }, 2000);
    log('scheduled editor text clean');
}

function detectBodyChange()
{
    let lastMacroMenuVisible = false;
    let domChangeIgnore = false;

    $("body").on('DOMSubtreeModified', function() {
        if (domChangeIgnore) {
            return;
        }
        // ignore any more changes as we may be changing things
        domChangeIgnore = true;
        let length = $("[data-test-id='ticket-footer-macro-menu']").children().length;
        let macroMenuVisible = length != 0;
        if (macroMenuVisible != lastMacroMenuVisible) {
            onMacroMenuVisibilityChanged(macroMenuVisible);
        }
        lastMacroMenuVisible = macroMenuVisible;
        domChangeIgnore = false;
    });
}

(function() {
    'use strict';

    detectBodyChange();

    setInterval(function () {
        if (this.lastPathStr !== location.pathname ||
            this.lastQueryStr !== location.search ||
            this.lastPathStr === null ||
            this.lastQueryStr === null) {
            this.lastPathStr = location.pathname;
            this.lastQueryStr = location.search;
            onUrlChange();
        }
    }, 222);
})();