// ==UserScript==
// @name         CorrLinks
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fix formatting
// @author       Ping
// @match        https://www.corrlinks.com/Inbox.aspx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386749/CorrLinks.user.js
// @updateURL https://update.greasyfork.org/scripts/386749/CorrLinks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getAspElement(name) {
        return document.getElementById('ctl00_mainContentPlaceHolder_' + name);
    }

    // The "only unread messages" view is too confusing; if we're landing on it,
    // just go to the regular inbox view.
    if (document.location.search == '?UnreadMessages') {
        document.location = 'Inbox.aspx';
        return;
    }

    var startDate = getAspElement('startDateTextBox');
    if (startDate) {
        startDate.value = '1/1/2019';
        getAspElement('inboxGridView').style.opacity = 0.2;
        getAspElement('updateButton').click();
    }

    function moveMessageToDiv() {
        var message = getAspElement('messageTextBox');
        if (message) {
            console.log('Moving message', message, 'into a new div element.');
            //message.style.display = 'none';
            var div = document.createElement('div');
            div.className = 'message';
            div.innerText = message.value;
            var span = message.parentNode;
            span.appendChild(div);
            span.removeChild(message);
            span.parentNode.nextElementSibling.id = 'rules';
            span.parentNode.nextElementSibling.nextElementSibling.id = 'printing';
        }
        window.setTimeout(moveMessageToDiv, 200);
    }

    function findButtons() {
        var bar = document.getElementById('buttonBar');
        if (!bar) {
            bar = document.createElement('div');
            var names = ['printButton', 'replyButton', 'deleteButton', 'cancelButton'];
            for (var i = 0; i < names.length; i++) {
                var button = getAspElement(names[i]);
                if (button) {
                    button.parentNode.id = 'buttonBar';
                }
            }
        }
        window.setTimeout(findButtons, 200);
    }

    var head = document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
div.container, div.container input, div.footer {
  font-family: helvetica, arial, sans-serif;
  font-size: 15px;
  line-height: 1.6;
}

div.container, div.footer, div.footer td {
  width: auto;
  border: none;
}

div.footer, #ctl00_footerUpdatePanel div.container {
  font-size: 12px;
  background: #eee;
  border-top: 1px solid #ddd;
  color: #666;
}

div.footer a, #ctl00_footerUpdatePanel a {
  color: #69c;
}

div.footer {
  padding-bottom: 2em;
  margin-top: 0;
}

div.footer table {
  width: 100% !important;
}

div.container, div.footer td {
  padding: 1em;
}

#header {
  display: none;
}

div.container, div.container input, .MessageDataGrid, .message {
}

.MessageDataGrid.Item, .MessageDataGrid.BoldItem {
  padding-right: 1em;
  border: 1px solid #fff;
  white-space: nowrap;
}

th.MessageDataGrid a {
  color: #084;
}

div.row span.controlLabel {
  width: 60px;
}

div.row:last-child {
  font-size: 12px;
  color: #666;
}

#ctl00_mainContentPlaceHolder_messagePanel span.formElement {
  float: none !important;
}

#ctl00_mainContentPlaceHolder_messagePanel span.formElement input {
  border: 1px solid #fff;
  padding-left: 0.5em;
}

label {
  color: #000 !important;
}

label[for="ctl00_mainContentPlaceHolder_messageTextBox"] {
  visibility: hidden;
}

.message {
  display: inline-block;
  border: 1px solid #fff;
  padding-top: 0.5em;
  padding-left: 0.5em;
  max-width: 40em;
}

#buttonBar, #ctl00_mainContentPlaceHolder_labelMessageViewable {
  display: block;
  width: 100%;
  background: #eee;
  position: fixed;
  top: 0;
  left: 0;
  padding: 0.5em 1em 0.5em 0;
  border-bottom: 1px solid #ddd;
}

#ctl00_mainContentPlaceHolder_labelMessageViewable {
  font-weight: bold;
  color: #f00;
  padding: 0.8em 0 0.8em 2em;
}

#ctl00_mainContentPlaceHolder_mainPanel {
  margin-top: 3em;
}

#ctl00_mainContentPlaceHolder_printButton {
  display: none;
}

#buttonBar input {
  margin-right: 0.5em;
}

#rules .controlLabel {
  display: none;
}

#rules .formElement {
  display: inline-block;
  padding-left: 0.5em;
  padding-top: 3em;
  line-height: 1.2;
  font-size: 12px;
  color: #999;
}

#printing .formElement {
  display: inline-block;
}
`;
    head.appendChild(style);

    moveMessageToDiv();
    findButtons();
})();
