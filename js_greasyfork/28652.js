// ==UserScript==
// @name         sweet SUGAR
// @namespace    http://tampermonkey.net/
// @version      0.37
// @description  script for making Sugar CRM sweeter
// @author       Yaroslav Shepilov (buggygm@gmail.com)
// @include       https://sugar*
// @require https://greasyfork.org/scripts/6250-waitforkeyelements/code/waitForKeyElements.js?version=23756
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28652/sweet%20SUGAR.user.js
// @updateURL https://update.greasyfork.org/scripts/28652/sweet%20SUGAR.meta.js
// ==/UserScript==

(function() {
    'use strict';

    waitForKeyElements(".subpanel-header > h4", fillNotes);
    waitForKeyElements("tr.single[name^=Emails_]", fillEmails);
    waitForKeyElements("span[data-fieldname='case_number'] div.ellipsis_inline", improveHeader);
    waitForKeyElements(".tab-pane", moveFields);
    waitForKeyElements(".drawer.active", prefillNote);
    waitForKeyElements("textarea.input-xlarge", autoexpandTextArea);
    waitForKeyElements('.module-list ul.nav.megamenu', addSweetSugarConf);

    var userData = null;

    var oldSearch = SUGAR.App.api.search;
    SUGAR.App.api.search = function(params, handlers) {
        if ((oldSearch) && (handlers.success)) {
            var oldSuccessHandler = handlers.success;
            handlers.success = function(data) {
                oldSuccessHandler(data);

                _.each(data.records, function(record) {
                    var searchLinkSelectors = $('.typeahead.dropdown-menu > li > a[href$=' + record.id + ']');

                    if (searchLinkSelectors.size() == 1) {
                        var dateElement = document.createElement('div');
                        dateElement.innerHTML = new Date(record.date_modified).toLocaleString('en-GB', {year: '2-digit' , month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'});
                        dateElement.style.textAlign = 'right';
                        dateElement.style.fontSize = '0.8em';
                        dateElement.style.lineHeight = '0.8em';
                        dateElement.style.paddingTop = '2px';

                        var linkElement = searchLinkSelectors.get(0);
                        linkElement.appendChild(dateElement);
                    }
                });

            };

            return oldSearch.call(this, params, handlers);
        }
    };

    var loadUser = setInterval(function() {
        if (SUGAR.App && SUGAR.App.user.id) {
            clearInterval(loadUser);
            $.ajax({
                url: 'https://sugar.360t.com/rest/v10/Users/' + SUGAR.App.user.id,
                context: document.body,
                headers: { 'OAuth-Token': getAuthToken() },
                dataType: "json",
                success: function (data) {
                    userData = data;
                }});
        }
    }, 100);

    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    function insertBefore(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode);
    }

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    function getAuthToken() {
        var authToken = localStorage.getItem('dev:SugarCRM:AuthAccessToken');
        if (authToken) {
            authToken = authToken.replace(/'/g, "").replace(/"/g,'');
        }
        console.log('AuthToken: ' + authToken);

        return authToken;
    }

    function performOnUserData(callback) {
        if (userData) {
            callback(userData);
            return;
        }

        var waitUser = setInterval(function() {
            if (userData) {
                clearInterval(waitUser);
                callback(userData);
            }
        }, 100);
    }

    function textToHtml(text) {
        var replaced = text;

        replaced = replaced.replace(/&(?![A-z]+;)/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
        replaced = urlsToAnchors(replaced);
        replaced = replaced.replace(/(?:\r\n|\r|\n)/g, '<br />');

        return replaced;
    }

    function escapeRegex(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    function isWordBounded(text, from, to) {
        if (from > 0) {
            var previousChar = text.charAt(from - 1);
            if (previousChar.replace(/\s/, '') !== '') {
                return false;
            }
        }

        if (to < text.length) {
            var nextChar = text.charAt(to);
            if (nextChar.replace(/\s/, '') !== '') {
                return false;
            }
        }

        return true;
    }

    function wrapMatches(replacedRegexPattern, text, tagName, trim) {
        var startRegex = new RegExp('([\\s=>]|^)' + replacedRegexPattern, 'g');
        var endRegex = new RegExp(replacedRegexPattern + '([\\s\\n,.<]|$)', 'g');

        var startMatchArray;
        var endMatchArray;

        while ((startMatchArray = startRegex.exec(text)) !== null) {
            var startIndex = startMatchArray.index;

            if (startMatchArray[1] !== '') {
                startIndex++;
            }

            var endIndex = -1;

            while ((endMatchArray = endRegex.exec(text)) !== null) {
                if (endMatchArray.index <= startIndex) {
                    endRegex.lastIndex = startIndex + 1;
                    continue;
                }

                endIndex = endRegex.lastIndex;

                if (endMatchArray[endMatchArray.length - 1] !== '') {
                    endIndex --;
                }

                break;
            }

            if (endIndex > 0) {
                var wrappedText = text.substring(startRegex.lastIndex, endMatchArray.index);
                if (wrappedText.length === 0) {
                    continue;
                }

                if (trim) {
                    wrappedText = wrappedText.trim();
                }

                text = text.replaceSubstring(
                    startIndex,
                    endIndex,
                    '<' + tagName + '>' + wrappedText + '</' + tagName + '>');

                startRegex.lastIndex = endIndex + 1;
            }
        }

        return text;
    }

    function toMarkdownHtml(text) {
        try {
            text = text.replace(/&(?![A-z];)/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&apos;');

            var replacedText = wrapMatches('```', text, 'pre', true);
            replacedText = replacedText.replace(/<\/pre>(?:\r\n|\r|\n)/g, '</pre>');

            var lines = replacedText.split(/(?:\r\n|\r|\n)/g);

            var replacedLines = [];
            lines.forEach(function (line, index) {

                var replacements = {
                    '*': 'strong',
                    '_': 'em',
                    '+': 'u',
                    '`': 'pre'};
                for (var markdownChar in replacements) {
                    var tag = replacements[markdownChar];

                    var escapedChar = escapeRegex(markdownChar);

                    line = wrapMatches(escapedChar, line, tag);
                }

                replacedLines.push(line);
            });

            replacedText = replacedLines.join('\n');

            var lineQuoteRegex = new RegExp('^&gt;(.*)(\n|$)', 'gm');
            var lineQuoteMatches;
            while ((lineQuoteMatches = lineQuoteRegex.exec(replacedText)) !== null) {
                var quote = lineQuoteMatches[1];

                replacedText = replacedText.replaceSubstring(lineQuoteMatches.index,
                                                             lineQuoteRegex.lastIndex-1,
                                                             '<blockquote>' + quote + '</blockquote>');
            }
            replacedText = replacedText.replace(/<\/blockquote>\n<blockquote>/g, '\n');


            replacedText = urlsToAnchors(replacedText);
            replacedText = replacedText.replace(/(?:\r\n|\r|\n)/g, '<br />');

            return replacedText;

        } catch (exception) {
            console.log(exception);
            return text;
        }
    }

    function urlsToAnchors(escapedHtml) {
        var urlRegex = new RegExp('https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}' +
                                  '(\\.*([-a-zA-Z0-9@:%_\+~#?//=])+(&amp;)?)*',
                                  'g');

        var matchArray;
        var result = escapedHtml; //.replace(/&amp;/g, '&');
        var firstMatch = true;

        while ((matchArray = urlRegex.exec(result)) !== null) {
            var link = matchArray[0].trim();
            var anchorText = '<a target="_blank" href="' + link + '">' + link + '</a>';
            result = result.replaceSubstring(
                matchArray.index,
                urlRegex.lastIndex,
                anchorText);

            urlRegex.lastIndex += anchorText.length - link.length;
        }

        return result;
    }

    String.prototype.replaceSubstring=function(start, end, replacement) {
        var result = '';
        if (start > 0) {
            result += this.substr(0, start);
        }

        result += replacement;

        if (end < (this.length - 1)) {
            result += this.substr(end, this.length);
        }

        return result;
    };

    function startsWith(text, substring) {
        return text.substring(0, substring.length) === substring;
    }

    function removeFromList(element, list) {
        var index =  list.indexOf(element);
        if (index < 0) {
            return;
        }

        list.splice(index, 1);
    }

    function trimWithNbsp(text) {
        var whitespace = '(([\\s\\u00a0])|(&nbsp;))';
        return text.replace(new RegExp('(?:^' + whitespace + '+)|(?:' + whitespace + '+$)', 'g'), '');
    }

    function createRowCell(previousRow) {
        var columnsCount = $(previousRow).children('td').size();

        var cell = document.createElement("td");
        cell.colSpan = columnsCount;
        cell.style.textAlign = 'left';

        var newRow = document.createElement("tr");
        newRow.className += " single";
        newRow.appendChild(cell);

        insertAfter(newRow, previousRow);

        return cell;
    }

    function createTextElement() {
        var element = document.createElement('div');

        element.style.overflow = "hidden";
        element.style.wordWrap = "break-word";
        element.style.whiteSpace = "pre-wrap";
        element.style.textAlign = "justify";
        element.style.paddingRight = "20px";

        return element;
    }

    function wrapWithMore(element, maxHeight) {
        var elementHeight = $(element).height();

        if (elementHeight && (elementHeight > (maxHeight + 50))) {
            var moreButton = document.createElement('button');
            moreButton.className += 'btn-link btn-invisible toggle-text';
            moreButton.style.marginBottom = '2px';
            moreButton.style.display = 'block';
            moreButton.onclick = function () {
                if (moreButton.innerHTML == 'more') {
                    element.style.maxHeight = null;
                    moreButton.innerHTML = 'less';
                } else {
                    element.style.maxHeight = maxHeight + "px";
                    moreButton.innerHTML = 'more';
                }
            };
            element.style.maxHeight = maxHeight + "px";
            moreButton.innerHTML = 'more';
            insertAfter(moreButton, element);
        }
    }

    function createNoteAttachementLink(note) {
        var panel = document.createElement('span');
        panel.style.position = 'static';
        panel.style.height = '100%';
        panel.style.marginTop = '0';
        panel.style.border = 'none';
        panel.style.width = 'auto';
        panel.style.padding = '0';
        panel.style.display = 'inline-flex';
        panel.style.flexDirection = 'column';
        panel.style.alignItems = 'center';

        var attachmentField = 'filename';
        var filename = note.get('filename');
        if (!filename && note.get('attachment2_c')) {
            filename = note.get('attachment2_c');
            attachmentField = 'attachment2_c';
        }

        if (!filename) {
            return null;
        }

        var fileType = note.get('file_mime_type');
        var imageAttachment = fileType && (fileType.indexOf('image') !== -1);

        var noteId = note.get('id');

        var attachAnchor = document.createElement("a");
        panel.appendChild(attachAnchor);
        attachAnchor.innerHTML = filename;
        attachAnchor.download = filename;

        var attachUrl = "rest/v10/Notes/" + noteId + "/file/" + attachmentField + "?force_download=1&1491235740805=1&platform=base";
        attachAnchor.href = attachUrl;

        if (imageAttachment) {
            var fileExtension = filename.split('.').pop();

            var imgElement = document.createElement('img');
            imgElement.className = 'image-preview';
            imgElement.src = attachUrl;
            imgElement.style.verticalAlign = 'middle';
            resizePreviewsToConfig($(imgElement));

            var imgAnchor = document.createElement('a');
            imgAnchor.appendChild(imgElement);
            imgAnchor.href = "rest/v10/Notes/" + noteId + "/file/" + attachmentField + "?force_download=0&1491235740805=1&platform=base";

            panel.appendChild(imgAnchor);
        }

        return panel;
    }

    function createNoteAttachementLabel() {
        var result = document.createElement('div');
        result.style.display = 'inline-block';

        var attachmentImage = document.createElement('img');
        attachmentImage.src = "themes/default/images/attachment.gif?v=QL9jTMYSQcOmOk5_HOXMMw";
        attachmentImage.style.float = "left";
        result.appendChild(attachmentImage);


        var attachmentLabel = document.createElement('i');
        attachmentLabel.innerHTML = 'Attachments:';
        attachmentLabel.style.marginRight = '6px';
        result.appendChild(attachmentLabel);

        return result;
    }

    function createDialog(dialogId, clickable) {
        var dialog = document.createElement('div');

        dialog.className = 'dropdown-menu';
        dialog.style.position = 'fixed';
        dialog.style.padding = '16px';
        dialog.style.backgroundColor = '#fff';
        dialog.id = dialogId;
        $(dialog).hide();

        clickable.onclick = function() {
            if ($(dialog).is(":visible")) {
                $(dialog).hide();
            } else {
                $(dialog).show();

                var dialogWidth = dialog.offsetWidth;
                var buttonX = $(clickable).offset().left;
                var dialogX = buttonX - (dialogWidth / 2);
                dialog.style.left = dialogX + 'px';
                dialog.style.top = $(clickable).offset().top + clickable.offsetHeight + 'px';
            }
        };

        jQuery('body')
            .bind('click', function(e) {
            if($(dialog).is(":visible")) {
                if ((e.target != dialog)
                    && !$.contains(dialog, e.target)
                    && !$.contains(clickable.parentNode, e.target)) {
                    $(dialog).hide();
                }
            }
        });

        return dialog;
    }

    function loadPreviewSizeIndex() {
        var sizeIndex = localStorage.getItem('sweetSugar_preview_size_index');

        if (sizeIndex) {
            return sizeIndex;
        }

        return 2;
    }

    function resizePreviewsToConfig(imgSelector) {
        var sizeIndex = loadPreviewSizeIndex();

        var size = Math.pow(sizeIndex, 3) * 4;
        if (sizeIndex > 0) {
            size += 30;
        }

        var sizeCss = size + 'px';
        imgSelector.css({
            'width': 'auto',
            'height': 'auto',
            'max-width': sizeCss,
            'max-height': sizeCss});
    }

    function isMarkdownEnabled() {
        var enabled = localStorage.getItem('sweetSugar_markdown_enabled');

        if ((enabled === false) || (enabled === 'false')){
            return false;
        }

        return true;
    }

    function setMarkdownEnabled(enabled) {
        localStorage.setItem('sweetSugar_markdown_enabled', enabled);
    }

    function findField(obj, fieldName) {
        var walked = [];
        var stack = [{obj: obj, stack: ''}];
        while(stack.length > 0)
        {
            var item = stack.shift();
            var obj = item.obj;
            for (var property in obj) {
                if (obj.hasOwnProperty(property)) {
                    if (property == fieldName) {
                        console.log(item.stack + '.' + property + "=" + obj[property]);
                    }

                    if (typeof obj[property] == "object") {
                        var alreadyFound = false;
                        for(var i = 0; i < walked.length; i++)
                        {
                            if (walked[i] === obj[property])
                            {
                                alreadyFound = true;
                                break;
                            }
                        }
                        if (!alreadyFound)
                        {
                            walked.push(obj[property]);
                            stack.push({obj: obj[property], stack: item.stack + '.' + property});
                        }
                    }
                }
            }
        }

        console.log('Done');
    }

    function fillNotes (jNode) {
        var notesSection = null;

        var notesSection = null;
        if (jNode.text() == 'Notes') {
            notesSection = jNode.parent().parent();
        }

        if (notesSection != null) {
            var notesElement = notesSection[0];
            var notesTab = notesElement;
            while (notesTab != null) {
                if ($(notesTab).hasClass("tabbable")) {
                    break;
                }
                notesTab = notesTab.parentNode;
            }

            if (notesTab != null) {
                var tabContainer = notesTab.parentNode;
                tabContainer.insertBefore(notesTab, tabContainer.childNodes[0]);
            }


            var content = notesSection.find(".flex-list-view-content");
            var rows = content.find("tr");

            rows.each(function() {
                var name = $(this).attr("name");
                var rowElement = $(this).get(0);

                if (name) {
                    var id = name.replace("Notes_", "");
                    var url = "rest/v10/Notes/" + id + "?view=record";

                    var noteBean = SUGAR.App.data.createBean('Notes', {id:id});
                    noteBean.fetch({success: function() {
                        var cell = createRowCell(rowElement);

                        var description = noteBean.get('description');
                        if (!description) {
                            description = noteBean.get('name');
                        }

                        var textNode = createTextElement();
                        $(textNode).addClass('sweetNote');

                        var descriptionHtml = isMarkdownEnabled() ? toMarkdownHtml(description) : textToHtml(description);
                        textNode.innerHTML = "<b>" + noteBean.get('created_by_name') + "</b>: " + descriptionHtml;

                        cell.appendChild(textNode);
                        wrapWithMore(textNode, 200);

                        var tradeId = noteBean.get('trade_id_c');
                        if (tradeId && (tradeId.toLowerCase() != 'n/a') && (tradeId.toLowerCase() != 'na')) {
                            var tradeIdPanel = document.createElement('div');
                            tradeIdPanel.style.marginTop = '12px';
                            cell.appendChild(tradeIdPanel);

                            var tradeIdTitle = document.createElement('i');
                            tradeIdTitle.innerHTML = 'Trade id:\u00A0';
                            tradeIdPanel.appendChild(tradeIdTitle);

                            var tradeIdLabel = document.createTextNode(tradeId);
                            tradeIdPanel.appendChild(tradeIdLabel);
                        }

                        var attachmentAnchor = createNoteAttachementLink(noteBean);

                        if (attachmentAnchor) {
                            var attachmentPanel = document.createElement('div');
                            attachmentPanel.style.marginTop = '12px';
                            attachmentPanel.appendChild(createNoteAttachementLabel());
                            attachmentPanel.appendChild(attachmentAnchor);

                            cell.appendChild(attachmentPanel);
                        }
                    }});
                }
            });
        }
    }

    function fillEmails(emailRowNodes) {
        if (emailRowNodes.size() < 1) {
            return;
        }

        emailRowNodes.each(function() {
            var name = $(this).attr("name");

            if (!name) {
                return;
            }

            var id = name.replace("Emails_", "");

            var emailRow = this;


            var emailBean = SUGAR.App.data.createBean('Emails', {id:id});
            emailBean.fetch({success: function() {
                var cell = createRowCell(emailRow);

                var emailBody = emailBean.get('description');
                if (!emailBody) {
                    var tempElement = document.createElement('div');
                    tempElement.innerHTML = emailBean.get('description_html');
                    insertAfter(tempElement, emailRow);
                    emailBody = tempElement.innerText;

                    tempElement.parentNode.removeChild(tempElement);
                }

                var endPatterns = ['kind regards', 'mit freundlichen', 'best regards', 'regards,', 'thanks and regards', 'from:.*\nsent:', 'on .+ wrote:', '[-]+Original Message', 'many thanks and regards'];
                for (i = 0; i < endPatterns.length; i++ ) {
                    var patternString = endPatterns[i];
                    var pattern = new RegExp(patternString, 'ig');
                    var match = pattern.exec(emailBody);

                    if (match) {
                        emailBody = emailBody.substring(0, match.index);
                    }
                }

                emailBody = emailBody.replace(/&nbsp;/g, ' ').trim();
                emailBody = emailBody.replace(/&[rl]squo;/g, "'").trim();

                var sender = emailBean.get('from_addr_name');

                var textNode = createTextElement();

                textNode.innerHTML = "<b>" + sender + "</b>: " + textToHtml(emailBody);

                cell.appendChild(textNode);
                wrapWithMore(textNode, 200);

                var notes = SUGAR.App.data.createBeanCollection('Notes');
                notes.fetch({
                    filter:[{'parent_id':id}],
                    success: function() {
                        if (notes.length <= 0) {
                            return;
                        }

                        var attachmentPanel = document.createElement('div');
                        cell.appendChild(attachmentPanel);

                        attachmentPanel.appendChild(createNoteAttachementLabel());

                        var linksPanel = document.createElement('div');
                        linksPanel.style.display = 'inline-flex';
                        linksPanel.style.flexWrap = 'wrap';
                        linksPanel.style.position = 'relative';
                        attachmentPanel.appendChild(linksPanel);

                        for (i = 0; i < notes.length; i++) {
                            var note = notes.models[i];

                            var linkElement = createNoteAttachementLink(note);
                            linkElement.style.marginRight = '16px';
                            linkElement.style.marginTop = '12px';

                            linksPanel.appendChild(linkElement);
                        }
                    }
                });
            }});
        });
    }

    function improveHeader(jNode) {
        if (jNode.size() < 1) {
            return;
        }

        var clientServices = null;
        var clientServicesSelector = $("span[data-fieldname='client_services_status_c'] span.detail");
        if (clientServicesSelector) {
            clientServices = clientServicesSelector.text().trim();
        }


        var caseNumberElement = jNode.get(0);
        var caseNumber = caseNumberElement.innerText;

        var headerCell = $('div.headerpane span[data-name="name"]');
        var headerCellElement = headerCell.get(0);

        var numberCellContainer = document.createElement('span');
        numberCellContainer.style.paddingRight = '0px';
        $(numberCellContainer).addClass('record-cell');

        var headerNumberElement = document.createElement('b');
        headerNumberElement.innerHTML = caseNumber;

        numberCellContainer.appendChild(headerNumberElement);

        headerCellElement.style.paddingLeft = '15px';

        if (clientServices) {
            var newClientServicesElement = document.createElement('sup');
            newClientServicesElement.innerHTML = clientServices;
            newClientServicesElement.style.backgroundColor = 'red';
            newClientServicesElement.style.borderRadius = '3px';
            newClientServicesElement.style.color = 'white';
            newClientServicesElement.style.padding = '1px';
            newClientServicesElement.style.paddingLeft = '2px';

            var numberDelimeter = document.createTextNode('\u00A0');
            numberCellContainer.appendChild(numberDelimeter);

            numberCellContainer.appendChild(newClientServicesElement);
        }

        insertBefore(numberCellContainer, headerCellElement);

        var nameElement = headerCell.find('div.ellipsis_inline').get(0);
        if (nameElement) {
            headerCellElement.title = nameElement.innerText;
        }
    }

    function moveFields(jNode) {
        if (jNode.size() < 1) {
            return;
        }

        var fieldsNode = null;
        for (i = 0; i < jNode.size(); i++) {
            var nodeId = jNode.get(i).id;

            if (startsWith(nodeId, 'icc_cases_contact_infoview')) {
                fieldsNode = $(jNode.get(i));
                break;
            }
        }

        if (fieldsNode === null) {
            return;
        }

        console.log('moveFields: fieldsNode.children("div").size() = ' + fieldsNode.children('div').size());

        var uselessElements = [];
        var allFields = {};
        var allFieldNames = {};
        var visibleFields = null;
        var savedVisibleFields = localStorage.getItem('sweetSugar_visible_fields');
        if (savedVisibleFields) {
            try {
                visibleFields = JSON.parse(savedVisibleFields);
            } catch (Error) {
                savedVisibleFields = null;
                visibleFields = ['assigned_user_name', 'icc_cases_assignee_group', 'description'];
            }
        } else {
            visibleFields = ['assigned_user_name', 'icc_cases_assignee_group', 'description'];
        }

        fieldsNode.find('.icc_cases_contact_info').css('paddingBottom', '0');

        fieldsNode.children('div').each(function() {
            $(this).children('div.record-panel-header').each(function() {
                $(this).hide();
                uselessElements.push(this);

                $(this).removeClass('record-panel-header'); //this guy has display: block !important and cannot be hidden easily
            });
            $(this).find('.record-panel-content').css('padding-top', '0px');

            var assignedUserElement = null;
            var assignedGroupElement = null;
            var descriptionElement = null;

            $(this).find('div.record-cell').each(function() {
                var dataName = $(this).attr('data-name');

                this.style.paddingBottom = '12px';

                allFields[dataName] = this;
                allFieldNames[dataName] = $(this).find('.record-label').text().trim();

                if (dataName == 'assigned_user_name') {
                    assignedUserElement = this;
                } else if (dataName == 'icc_cases_assignee_group') {
                    assignedGroupElement = this;
                } else if (dataName == 'description') {
                    descriptionElement = this;
                }

                if (visibleFields && (visibleFields.indexOf(dataName) == -1)) {
                    $(this).hide();
                    uselessElements.push(this);
                }
            });

            if ((assignedUserElement !== null) && (assignedGroupElement !== null)) {
                var nextToUserElement = null;
                if (assignedUserElement.previousElementSibling) {
                    nextToUserElement = assignedUserElement.previousElementSibling;
                } else {
                    nextToUserElement = assignedUserElement.nextElementSibling;
                }

                var nextToGroupElement = null;
                if (assignedGroupElement.previousElementSibling) {
                    nextToGroupElement = assignedGroupElement.previousElementSibling;
                } else {
                    nextToGroupElement = assignedGroupElement.nextElementSibling;
                }

                if (nextToUserElement && nextToGroupElement && (nextToGroupElement != assignedUserElement)) {
                    var assignedGroupParent = assignedGroupElement.parentNode;

                    insertBefore(assignedGroupElement, assignedUserElement);
                    assignedGroupParent.appendChild(nextToUserElement);
                    assignedGroupParent.appendChild(nextToGroupElement);
                }

                $(assignedUserElement).removeClass('span6');
                $(assignedUserElement).addClass('span4');

                $(assignedGroupElement).removeClass('span6');
                $(assignedGroupElement).addClass('span4');

                var assignToMeButton = document.createElement('button');
                assignToMeButton.className = 'rowaction btn';
                assignToMeButton.innerHTML = 'Assign to me';
                assignToMeButton.onclick = function() {
                    var model = SUGAR.App.controller.context.get('model');
                    model.set('assigned_user_id', SUGAR.App.user.id);
                    model.set('assigned_user_name', SUGAR.App.user.full_name);
                    model.save();
                };

                var unassignButton = document.createElement('button');
                unassignButton.className = 'rowaction btn';
                unassignButton.innerHTML = 'Unassign';
                unassignButton.onclick = function() {
                    var model = SUGAR.App.controller.context.get('model');
                    model.set('assigned_user_id', '');
                    model.set('assigned_user_name', '');
                    model.save();
                };

                var assignButtonsContainer = document.createElement('span');
                $(assignButtonsContainer).addClass('span4');
                $(assignButtonsContainer).addClass('table-cell');
                insertAfter(assignButtonsContainer, assignedUserElement);
                assignButtonsContainer.appendChild(assignToMeButton);
                assignButtonsContainer.appendChild(unassignButton);

                performOnUserData(function(userData) {
                    if (userData.department != 'IT') {
                        return;
                    }

                    var assignToCasButton = document.createElement('button');
                    assignToCasButton.className = 'rowaction btn';
                    assignToCasButton.innerHTML = 'Assign to CAS';
                    assignToCasButton.onclick = function() {
                        var model = SUGAR.App.controller.context.get('model');

                        var casId = '9b554277-734a-ec40-310c-5368a7ebae22';

                        var clientServices = model.get('client_services_status_c');
                        if (clientServices == "CCAS") {
                            casId = '8d35652a-6818-3b57-38d2-538d9da53163';
                        }

                        model.set('assigned_user_id', '');
                        model.set('assigned_user_name', '');
                        model.set('icc_cases_assignee_group', casId);
                        model.save();
                    };

                    insertAfter(assignToCasButton, assignToMeButton);
                });
            }


            if (descriptionElement !== null) {
                descriptionElement.style.marginTop = '20px';

                var descriptionEditSelector = $(descriptionElement).find('span.record-edit-link-wrapper');
                if (descriptionEditSelector && (descriptionEditSelector.size() > 0)) {
                    var descriptionEditArea = descriptionEditSelector.get(0);
                    descriptionEditArea.style.width = '0px';
                    descriptionEditArea.style.height = '0px';
                }
            }
        });

        var tabsHeaderSelector = fieldsNode.first().closest('.content-tabs').find('#recordTab');
        if (tabsHeaderSelector.size() == 0) {
            tabsHeaderSelector = $('#recordTab');
        }

        if (tabsHeaderSelector && (tabsHeaderSelector.size() > 0)) {
            var elementsHidden = true;

            var moreFieldsButton = document.createElement('button');
            moreFieldsButton.innerHTML = 'More fields';
            moreFieldsButton.className += 'btn';
            moreFieldsButton.style.width = '110px';
            moreFieldsButton.style.marginLeft = '60px';
            moreFieldsButton.style.marginBottom = '5px';

            moreFieldsButton.onclick = function() {
                for (i = 0; i < uselessElements.length; i++) {
                    if (elementsHidden) {
                        $(uselessElements[i]).show();
                    } else {
                        $(uselessElements[i]).hide();
                    }
                }

                elementsHidden = !elementsHidden;
                if (elementsHidden) {
                    moreFieldsButton.innerHTML = 'More fields';
                } else {
                    moreFieldsButton.innerHTML = 'Less fields';
                }
            };

            var fieldsConfigButton = document.createElement('a');
            fieldsConfigButton.setAttribute('data-toggle', 'dropdown');
            fieldsConfigButton.setAttribute('rel', 'tooltip');
            fieldsConfigButton.className = 'dropdown-toggle btn btn-invisible';

            var fieldConfigButtonIcon = document.createElement('i');
            fieldConfigButtonIcon.setAttribute('data-action', 'loading');
            fieldConfigButtonIcon.className = 'icon-cog';
            fieldsConfigButton.appendChild(fieldConfigButtonIcon);

            var fieldsConfigButtonPanel = document.createElement('div');
            fieldsConfigButtonPanel.style.marginBottom = '5px';
            fieldsConfigButtonPanel.className = 'btn-group';
            fieldsConfigButtonPanel.appendChild(fieldsConfigButton);

            tabsHeaderSelector.get(0).appendChild(moreFieldsButton);
            tabsHeaderSelector.get(0).appendChild(fieldsConfigButtonPanel);

            var fieldsSelectionDialog = createDialog('fieldsSelectionDialog', fieldsConfigButton);
            fieldsSelectionDialog.style.width = '700px';
            fieldsSelectionDialog.style.display = 'flex';
            fieldsSelectionDialog.style.flexWrap = 'wrap';
            fieldsSelectionDialog.style.padding = '16px 16px 0px';
            $(fieldsSelectionDialog).hide();

            var addCheckbox= function (container, name, value, oncheck) {
                var checkbox = document.createElement('input');
                checkbox.type = "checkbox";
                checkbox.name = name;
                checkbox.checked = value;
                checkbox.id = name;
                checkbox.onclick = function() {
                    oncheck(checkbox.checked);
                };

                var label = document.createElement('label');
                label.htmlFor = name;
                label.appendChild(document.createTextNode(name));
                label.style.display = 'inline-block';
                label.style.margin = '0';
                label.style.marginLeft = '4px';
                label.style.verticalAlign = 'middle';

                var checkboxContainer = document.createElement('div');
                checkboxContainer.appendChild(checkbox);
                checkboxContainer.appendChild(label);
                checkboxContainer.style.width = '30%';
                checkboxContainer.style.marginBottom = '16px';

                container.appendChild(checkboxContainer);
            };


            for (var key in allFieldNames) {
                if (allFieldNames.hasOwnProperty(key)) {
                    var active = visibleFields.indexOf(key) >= 0;
                    var field = allFields[key];

                    var createCheckFunction = function(key, field) {
                        return function(checked) {
                            if (checked) {
                                if (elementsHidden) {
                                    $(field).show();
                                }
                                removeFromList(field, uselessElements);
                                visibleFields.push(key);
                            } else {
                                if (elementsHidden) {
                                    $(field).hide();
                                }
                                uselessElements.push(field);
                                removeFromList(key, visibleFields);
                            }

                            localStorage.setItem('sweetSugar_visible_fields', JSON.stringify(visibleFields));
                        };
                    };
                    addCheckbox(fieldsSelectionDialog, allFieldNames[key], active, createCheckFunction(key, field));
                }
            }

            tabsHeaderSelector.get(0).appendChild(fieldsSelectionDialog);
        }
    }

    function prefillNote(jNode) {
        var noteImage = jNode.find('span[data-original-title="Note"]');
        if (noteImage.size() == 0) {
            return;
        }

        var findField = function(dataName) {
            var elements = jNode.find(".record-cell[data-name='" + dataName + "']");

            if (elements.size() == 1) {
                return elements.get(0);
            }

            return null;
        };

        var findRow = function(dataName) {
            var field = findField(dataName);
            if (field) {
                return field.parentNode;
            }
            return null;
        };

        var attachment2Field = findField('attachment2_c');
        if (attachment2Field) {
            $(attachment2Field).hide();
        }

        performOnUserData(function(userData) {
            if (userData.department != 'IT') {
                return;
            }

            var model = SUGAR.App.drawer.getComponent("base").model;
            model.set('note_type_c', "Investigation_Result");

            var typeRow = findRow("note_type_c");

            var descriptionRow = findRow("description");
            var sreTeamRow = findRow("team_c");
            var investigationTimeRow = findRow("investigation_time_c");
            var investigationResultRow = findRow("investigation_result_product_c");
            var attachmentRow = findRow("filename");

            insertAfter(descriptionRow, typeRow);
            insertAfter(attachmentRow, descriptionRow);
            insertAfter(sreTeamRow, attachmentRow);
            insertAfter(investigationTimeRow, sreTeamRow);
            insertAfter(investigationResultRow, investigationTimeRow);
        });
    }

    function autoexpandTextArea(textAreaSelector) {
        if (textAreaSelector.size() == 0) {
            return;
        }
        textAreaSelector.each(function() {
            var textarea = this;

            var defHeight = textarea.offsetHeight;
            var autoExpand = function(e) {
                textarea.style.height = ""; /* Reset the height*/
                textarea.style.height = Math.max(textarea.scrollHeight + 50, defHeight) + "px";
            };

            textarea.addEventListener('input', autoExpand);
            autoExpand();
        });

        try {
            // disable textarea trimming on focus lost
            SUGAR.App.view.fields.BaseNotesTextareaField.prototype.unformat = function (value) {
                return value;
            };
        } catch (error) {
            console.log(error);
        }
    }

    function addSweetSugarConf(menuSelector) {
        var lastMenuItem = menuSelector.find('> li.dropdown.more');
        if (lastMenuItem.size() == 0) {
            return;
        }

        var moduleListModule = SUGAR.App.additionalComponents.header.getComponent("module-list");
        if (!moduleListModule) {
            console.log("Couldn't find module list. Skipping adding config button because it will kill Sugar");
            return;
        }

        var sweetItem = document.createElement('li');
        sweetItem.className += 'dropdown';
        sweetItem.setAttribute('module', 'sweetSugar');

        var buttonSpan = document.createElement('span');
        buttonSpan.className += 'btn-group';
        sweetItem.appendChild(buttonSpan);

        var sweetAnchor = document.createElement('a');
        sweetAnchor.className += 'btn btn-invisible btn-link';
        sweetAnchor.innerHTML = 'Sweet Sugar';
        $(sweetAnchor).toggleClass('scroll').removeAttr('href');
        buttonSpan.appendChild(sweetAnchor);

        var arrowButton = document.createElement('button');
        arrowButton.type = 'button';
        arrowButton.title = 'More';
        arrowButton.className = 'btn btn-invisible dropdown-toggle';
        arrowButton.innerHTML = '<i class="icon-caret-down"></i>';
        buttonSpan.appendChild(arrowButton);

        insertBefore(sweetItem, lastMenuItem.get(0));

        var dialog = createDialog('sweetSugarConfigDialog', buttonSpan);
        dialog.style.width = '350px';
        dialog.id = 'sweetConfigDialog';
        sweetItem.appendChild(dialog);
        $(dialog).hide();

        var dialogTitle = document.createElement('h4');
        dialogTitle.innerHTML = 'Sweet Sugar settings';
        dialogTitle.style.textAlign = 'center';
        dialogTitle.style.marginBottom = '20px';
        dialog.appendChild(dialogTitle);

        var fieldsTable = document.createElement('table');
        dialog.appendChild(fieldsTable);
        var rowIndex = 0;

        var previewSizeLabel = document.createElement('label');
        previewSizeLabel.innerHTML = 'Image preview';
        previewSizeLabel.labelFor = 'previewSizeSlider';
        var previewSizeValueLabel = document.createElement('label');

        var previewSizeSlider = document.createElement("input");
        previewSizeSlider.id = 'previewSizeSlider';
        previewSizeSlider.setAttribute("type", "range");
        previewSizeSlider.max = 4;
        previewSizeSlider.style.width = '150px';

        previewSizeSlider.value = loadPreviewSizeIndex();
        var previewSizeMap = { 0: 'Disabled', 1: 'Small', 2: 'Medium', 3: 'Large', 4: 'Huge' };
        previewSizeSlider.oninput = function (e) {
            var sizeIndex = previewSizeSlider.value;
            previewSizeValueLabel.innerHTML = '(' + previewSizeMap[sizeIndex] + ')';

            localStorage.setItem('sweetSugar_preview_size_index', sizeIndex);

            resizePreviewsToConfig($('img.image-preview'));
        };
        previewSizeSlider.oninput();

        var previewSizeRow = fieldsTable.insertRow(rowIndex++);
        previewSizeRow.insertCell(0).appendChild(previewSizeLabel);
        previewSizeRow.insertCell(1).appendChild(previewSizeSlider);
        previewSizeRow.insertCell(2).appendChild(previewSizeValueLabel);

        var markdownEnabledLabel = document.createElement('label');
        markdownEnabledLabel.innerHTML = 'Markdown enabled';
        markdownEnabledLabel.htmlFor = 'markdownEnabledCheckbox';

        var markdownEnabledCheckbox = document.createElement('input');
        markdownEnabledCheckbox.type = 'checkbox';
        markdownEnabledCheckbox.id = 'markdownEnabledCheckbox';
        markdownEnabledCheckbox.checked = isMarkdownEnabled();
        markdownEnabledCheckbox.onclick = function() {
            setMarkdownEnabled(markdownEnabledCheckbox.checked);
        };
        var markdownEnabledRow = fieldsTable.insertRow(rowIndex++);
        markdownEnabledRow.insertCell(0).appendChild(markdownEnabledLabel);
        markdownEnabledRow.insertCell(1).appendChild(markdownEnabledCheckbox);

        var isRemovableModuleOld = moduleListModule.isRemovableModule;
        moduleListModule.isRemovableModule = function (moduleName) {
            if (!moduleName) {
                return false;
            }

            return isRemovableModuleOld.call(this, moduleName);
        };

    }

    addGlobalStyle('.sweetNote blockquote { ' +
                   'background: #f9f9f9; ' +
                   'border-left: 6px solid #bbb; ' +
                   'margin: 10px 0px 2px 0px; ' +
                   'padding: 0.6em 1em; ' +
                   '}');
    addGlobalStyle('.sweetNote pre { ' +
                   'background: #f9f9f9; ' +
                   'border: 1px solid #ccc; ' +
                   'padding: 10px; ' +
                   'background: #f5f5f5; ' +
                   'border-radius: 3px; ' +
                   'margin: 4px; ' +
                   'word-wrap: break-word; ' +
                   'white-space: pre-wrap;'+
                   '}');
    addGlobalStyle('.sweetNote *, .sweetNote { ' +
                   'font-size: 13px;' +
                   'text-rendering: optimizeLegibility;' +
                   '}');

    addGlobalStyle('#sweetConfigDialog table { ' +
                   ' border-collapse: separate;' +
                   ' border-spacing: 8px 24px;' +
                   '}');


})();