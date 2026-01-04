// ==UserScript==
// @name         Ask for Permission
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Helps you ask for permission to repost something from Fur Affinity
// @author       Mantikor
// @license      GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @match        https://www.furaffinity.net/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        GM.addValueChangeListener
// @grant        GM.deleteValue
// @grant        GM.getValue
// @grant        GM.log
// @grant        GM.notification
// @grant        GM.openInTab
// @grant        GM.registerMenuCommand
// @grant        GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/438327/Ask%20for%20Permission.user.js
// @updateURL https://update.greasyfork.org/scripts/438327/Ask%20for%20Permission.meta.js
// ==/UserScript==

// Notes about the header
// The match pattern https://www.furaffinity.net/* matches all pages on Fur Affinity

(async function() {
    'use strict';

    // --------------------------------------------------------------------------------
    // Notifications: Error, Success
    // --------------------------------------------------------------------------------
    const error_extracting_name_post = "Couldn't extract Post Title.";
    const error_extracting_name_recipient = "Couldn't extract Recipient Name.";
    const error_extracting_name_sender = "Couldn't extract Sender Name.\nYou are probably not logged in to Fur Affinity.";
    const error_extracting_url_newpm = "Couldn't extract Note URL.";
    const error_finding_message = "Couldn't find Message field.";
    const error_finding_subject = "Couldn't find Subject field.";
    const error_table_name_recipient_empty = "Recipient Name in row <row> is empty";
    const error_table_url_newpm_exists = "Table row <row> already contains Note URL:\n<url_newpm>";
    const error_table_url_newpm_invalid = "Note URL in row <row> is not valid:\n<url_newpm>";
    const success_settings_reset = "Settings reset.";
    const success_settings_saved = "Settings saved.";
    const success_user_information_copied = "User information copied to 'Ask User and Others' tab.";

    // --------------------------------------------------------------------------------
    // FA: newpm
    // --------------------------------------------------------------------------------
    // Extract the "message" textarea from a newpm page
    const newpm_extract_message = {css: "textarea[name='message']", func: e => e, min: 1, max: 1, index: 0, re: null};
    // Extract the "subject" input from a newpm page
    const newpm_extract_subject = {css: "input[name='subject']", func: e => e, min: 1, max: 1, index: 0, re: null};
    // Extract the system message
    // User Fender has declined to participate in the note system. You may attempt to find alternate means of contact listed on their userpage or in one of their journals.
    const newpm_extract_system_message = {css: "div.redirect-message", func: e => e, min: 1, max: 1, index: 0, re: null};
    // Check if we're on a newpm page; the trailing [^$]+ matches the query string (must be present to trigger AfP)
    // https://www.furaffinity.net/newpm/fender/
    const newpm_regexp = /^https:\/\/www\.furaffinity\.net\/newpm\/[^\/]+\/[^$]+$/;

    // --------------------------------------------------------------------------------
    // FA: user
    // --------------------------------------------------------------------------------
    // Extract name_recipient from a user page
    // <meta property="og:title" content="Userpage of Fender -- Fur Affinity [dot] net" />
    const user_extract_name_recipient = {css: "meta[property='og:title']", func: e => e.content, min: 1, max: 1, index: 0, re: /^Userpage of (?<value>[^$]+) -- Fur Affinity \[dot\] net$/};
    // Extract url_newpm from a user page
    // <a class="button usernav-watch-flex-button hideondesktop" href="/newpm/fender/">Note</a>
    const user_extract_url_newpm = {css: "a[href*='newpm']", func: e => e.href, min: 1, max: 1, index: 0, re: null};
    // Check if we're on a user page; the trailing slash isn't required, because some links to user pages omit it
    // https://www.furaffinity.net/user/fender/
    const user_regexp_url = /^https:\/\/www\.furaffinity.net\/user\/[^$]+$/;

    // --------------------------------------------------------------------------------
    // FA: view
    // --------------------------------------------------------------------------------
    // Extract name_sender from a view page
    // <a href="/user/mantikor"><img class="loggedin_user_avatar menubar-icon-resize avatar" style="cursor:pointer" alt="Mantikor" src="//a.furaffinity.net/9999999999/mantikor.gif"/></a>
    const view_extract_name_sender = {css: "img.loggedin_user_avatar", func: e => e.alt, min: 2, max: 2, index: 0, re: null};
    // Extract name_post from a view page
    // <meta property="og:title" content="Fender (Character Sheet) by Fender" />
    const view_extract_name_post = {css: "meta[property='og:title']", func: e => e.content, min: 1, max: 1, index: 0, re: /^(?<value>[^$]+) by [^$]+$/};
    // Extract name_recipient from a view page
    // <meta property="og:title" content="Fender (Character Sheet) by Fender" />
    const view_extract_name_recipient = {css: "meta[property='og:title']", func: e => e.content, min: 1, max: 1, index: 0, re: /^[^$]+ by (?<value>[^$]+)$/};
    // Extract url_newpm from a view page
    // <div class="note"><a href="/newpm/fender/">Note</a></div>
    const view_extract_url_newpm = {css: "a[href*='newpm']", func: e => e.href, min: 2, max: 2, index: 0, re: null};
    // Check if we're on a view page; the trailing slash isn't required, because some links to view pages omit it; the trailing [^$]* matches optional URL fragments (i.e. links to comments)
    // https://www.furaffinity.net/view/4483888/
    const view_regexp_url = /^(?<url>https:\/\/www\.furaffinity\.net\/view\/\d+)[^$]*$/;

    // --------------------------------------------------------------------------------
    // AfP: Ask User and Others
    // --------------------------------------------------------------------------------
    // Used to check if we're on the "Ask User and Others" page => Replace the 404 page; the trailing [^$]+ matches the query string (must be present to trigger AfP)
    // AfP uses a regexp literal instead of a constructed regexp, because the latter doesn't escape periods in the URL:
    // const regexp_ask_user_and_others = new RegExp(url_ask_user_and_others + "[^$]+");
    const ask_user_and_others_regexp_url = /^https:\/\/www\.furaffinity\.net\/userscripts\/ask-for-permission\/ask-user-and-others\/[^$]+$/;
    // Opened when the user clicks "Ask for Permission -> Ask User and Others"
    const ask_user_and_others_url = "https://www.furaffinity.net/userscripts/ask-for-permission/ask-user-and-others/";

    // --------------------------------------------------------------------------------
    // AfP: Settings
    // --------------------------------------------------------------------------------
    // Opened when the user clicks "Ask for Permission -> Settings"
    // Also: Used to check if we're on the "Settings" page => Replace the 404 page
    const settings_url = "https://www.furaffinity.net/userscripts/ask-for-permission/config/";

    // --------------------------------------------------------------------------------
    // Other constants
    // --------------------------------------------------------------------------------
    // AfP passes name_userscript in all query strings, so other userscripts that use query strings don't trigger AfP
    const name_userscript = "Ask for Permission";
    // Separates the last and second-to-last other recipient in message_ask_user_and_others
    const separator_and = " and ";
    // Separates the other recipients (except the last one) in message_ask_user_and_others
    const separator_comma = ", ";

    const template_settings = `
<!DOCTYPE html>
<html>
	<head>
		<title>Ask for Permission: Settings</title>
	</head>
	<body>
		<h1>Ask for Permission: Settings</h1>
		<p>
			<label for="subject">Subject</label>
			<br>
			<input type="text" id="subject" size="75">
			</textarea>
		</p>
		<p>
			<label for="message_ask_user_only">Message (Ask User Only)</label>
			<br>
			<textarea id="message_ask_user_only" rows=10 cols=75>
			</textarea>
		</p>
		<p>
			<label for="message_ask_user_and_others">Message (Ask User and Others)</label>
			<br>
			<textarea id="message_ask_user_and_others" rows=10 cols=75>
			</textarea>
		</p>
		<p>
			<button id="save_settings_button">Save Settings</button>
		</p>
		<p>
			<button id="reset_settings_button" disabled>Reset Settings</button>
			<input type="checkbox" id="reset_settings_checkbox">
			<label for="reset_settings_checkbox">Enable the "Reset Settings" button</label>
		</p>
	</body>
</html>`
.trim()

    const template_ask_user_and_others = `
<!DOCTYPE html>
<html>
	<head>
		<title>Ask for Permission: Ask User and Others</title>
	</head>
	<body>
	<h1>Ask for Permission: Ask User and Others</h1>
	<table id="name_table">
		<thead>
			<tr>
				<th scope="col">Note URL</th>
				<th scope="col">Recipient Name</th>
				<th scope="col"></th>
				<th scope="col"></th>
			</tr>
		</thead>
		<tbody>
		</tbody>
	</table>
	<p>
		<button id="create_messages_button">Create Messages</button>
	</p>
	<template id="table_row">
		<tr>
			<td>
				<input type="text" name="url_newpm" size="50">
			</td>
			<td>
				<input type="text" name="name_recipient" size="50">
			</td>
			<td>
				<button name="row_add">Add Row</button>
			</td>
			<td>
				<button name="row_delete">Delete Row</button>
			</td>
		</tr>
	</template>
	</body>
</html>
`.trim()

    const template_subject = "Uploading \"<name_post>\" to e621?";

    const template_message_ask_user_only = `
Hi <name_recipient>,

may I upload <url_post> to https://e621.net/posts ?

--
<name_sender>
`.trim();

    const template_message_ask_user_and_others = `
Hi <name_recipient>,

may I upload <url_post> to https://e621.net/posts ?
I'll also ask <names_recipients_other>.

--
<name_sender>
`.trim();

    function capitalizeFirstLetter(text) {
        return text.substr(0, 1).toUpperCase() + text.substr(1);
    }

    function createElement(tag_name, attributes, text_content) {
        let element = document.createElement(tag_name);

        for (const key in attributes) {
            element.setAttribute(key, attributes[key]);
        }

        if (text_content) {
            element.appendChild(document.createTextNode(text_content));
        }

        return element;
    }

    function extract(doc, info) {
        let elements = doc.querySelectorAll(info.css);

        if ((elements.length < info.min) || (elements.length > info.max)) {
            return null;
        }

        let text = info.func(elements[info.index]);
        if (! info.re) {
            return text;
        }
        if (! info.re.test(text)) {
            return null;
        }

        return text.match(info.re).groups.value;
    }

    function queryString(url, data) {
        let query_string = new URL(url);

        for (const [key, value] of Object.entries(data)) {
            query_string.searchParams.set(key, value);
        }

        return query_string.href;
    }

    function replaceDocument(doc, html) {
        let newDoc = new DOMParser().parseFromString(html, "text/html");
        ["head", "body"].forEach(element_name => {
            doc[element_name].remove();
            doc.documentElement.append(newDoc[element_name]);
        })
    }

    // Ask User and Others:
    // Add a new row to the table
    // Returns true if the new row was successfully added to the table, false otherwise
    function tableAddRow(table, index, url_newpm, name_recipient, row_delete) {
        let tbody = table.tBodies[0];

        if (url_newpm) {
            // Check if there's already a row containing url_newpm
            for (const row of tbody.rows) {
                let inputs = row.querySelectorAll("input");
                if (inputs[0].value == url_newpm) {
                    GM.notification({text: error_table_url_newpm_exists.replaceAll("<row>", row.rowIndex).replaceAll("<url_newpm>", url_newpm)});
                    return false;
                }
            }
        }

        // Create the new row
        let table_row = document.getElementById("table_row").content.firstElementChild.cloneNode(true);
        let inputs = table_row.querySelectorAll("input");
        inputs[0].value = url_newpm ? url_newpm : "";
        inputs[1].value = name_recipient ? name_recipient: "";
        if (! row_delete) {
            // Remove the "Delete Row" button
            let buttons = table_row.querySelectorAll("button");
            buttons[1].remove();
        }
        tbody.insertBefore(table_row, tbody.rows[index]);

        return true;
    }

    function ask(ask_others) {
        let name_post;
        let name_recipient;
        let name_sender;
        let url_newpm;
        let url_post;
        let url_tab;

        let elements;

        // url_post
        url_post = document.URL.match(view_regexp_url).groups.url;

        // name_sender
        name_sender = extract(document, view_extract_name_sender);
        if (! name_sender) {
            GM.notification({text: error_extracting_name_sender});
            return;
        }
        name_sender = capitalizeFirstLetter(name_sender);

        // name_post
        name_post = extract(document, view_extract_name_post);
        if (! name_post) {
            GM.notification({text: error_extracting_name_post});
            return;
        }
        // name_recipient
        name_recipient = extract(document, view_extract_name_recipient);
        if (! name_recipient) {
            GM.notification({text: error_extracting_name_recipient});
            return;
        }
        name_recipient = capitalizeFirstLetter(name_recipient);

        // url_newpm
        url_newpm = extract(document, view_extract_url_newpm);
        if (! url_newpm) {
            GM.notification({text: error_extracting_url_newpm});
            return;
        }

        if (ask_others) {
            url_tab = queryString(ask_user_and_others_url, {name_userscript: name_userscript, name_post: name_post, name_recipient: name_recipient, url_post: url_post, url_newpm: url_newpm, name_sender: name_sender});
        }
        else {
            url_tab = queryString(url_newpm, {name_userscript: name_userscript, name_post: name_post, name_recipient: name_recipient, url_post: url_post, names_recipients_other: "", name_sender: name_sender});
        }

        GM.openInTab(url_tab, {active: true, insert: true, setParent: true});
    }

    function askUserOnly() {
        ask(false);
    }

    function askUserAndOthers() {
        ask(true);
    }

    async function copyUserInformation() {
        let name_recipient;
        let url_newpm;
        let elements;

        // Extract name_recipient
        name_recipient = extract(document, user_extract_name_recipient);
        if (! name_recipient) {
            GM.notification({text: error_extracting_name_recipient});
            return;
        }
        name_recipient = capitalizeFirstLetter(name_recipient);

        // Extract url_newpm
        url_newpm = extract(document, user_extract_url_newpm);
        if (! url_newpm) {
            GM.notification({text: error_extracting_url_newpm});
            return;
        }

        // Send url_newpm and name_recipient to the "Ask User and Others" page
        //await GM.deleteValue("data_ask_user_and_others");
        await GM.setValue("data_ask_user_and_others", {url_newpm: url_newpm, name_recipient: name_recipient});

        // Close active tab:
        // Not possible with an XMonkey userscript
    }

    async function fillSettingsFields() {
        let [subject, message_ask_user_only, message_ask_user_and_others] = await Promise.all([
            GM.getValue("subject", template_subject),
            GM.getValue("message_ask_user_only", template_message_ask_user_only),
            GM.getValue("message_ask_user_and_others", template_message_ask_user_and_others)
        ]);
        document.getElementById("subject").value = subject;
        document.getElementById("message_ask_user_only").value = message_ask_user_only;
        document.getElementById("message_ask_user_and_others").value = message_ask_user_and_others;
    }

    function settings() {
        GM.openInTab(settings_url, {active: true, insert: true, setParent: true});
    }

    // --------------------------------------------------------------------------------
    // Settings
    // --------------------------------------------------------------------------------
    if (document.URL == settings_url) {
        // Replace the 404 page with the "Settings" page
        replaceDocument(document, template_settings);
        // Fill Subject and Messages
        fillSettingsFields();
        // Add event listeners
        // -- Save Settings button
        document.getElementById("save_settings_button").addEventListener("click", async function(event) {
            await Promise.all([
                GM.setValue("subject", document.getElementById("subject").value),
                GM.setValue("message_ask_user_only", document.getElementById("message_ask_user_only").value),
                GM.setValue("message_ask_user_and_others", document.getElementById("message_ask_user_and_others").value)
            ]);
            GM.notification({text: success_settings_saved});
        });
        // -- Reset Settings button
        document.getElementById("reset_settings_button").addEventListener("click", async function(event) {
            await Promise.all(["subject", "message_ask_user_only", "message_ask_user_and_others"].map(key => GM.deleteValue(key)));
            fillSettingsFields();
            GM.notification({text: success_settings_reset});

            document.getElementById("reset_settings_checkbox").checked = false;
            document.getElementById("reset_settings_button").disabled = true;
        });
        // -- Reset Settings checkbox
        document.getElementById("reset_settings_checkbox").addEventListener("change", async function(event) {
            document.getElementById("reset_settings_button").disabled = !event.target.checked;
        });
    }
    // --------------------------------------------------------------------------------
    // Ask User and Others
    // --------------------------------------------------------------------------------
    else if (ask_user_and_others_regexp_url.test(document.URL)) {
        GM.registerMenuCommand("Settings", settings);

        // Replace the 404 page with the "Ask User and Others" page
        replaceDocument(document, template_ask_user_and_others);

        // Extract parameters
        let params = new URL(document.URL).searchParams;

        // Fill the first row in the table
        let table = document.getElementById("name_table");
        tableAddRow(table, 0, params.get("url_newpm"), params.get("name_recipient"), false);

        // Add event listeners
        // -- GM Value Change
        GM.addValueChangeListener("data_ask_user_and_others", async function(name, old_value, new_value, remote) {
            if (remote) {
                // Add a new row at the bottom of the table
                let row_added = tableAddRow(table, -1, new_value.url_newpm, new_value.name_recipient, true);
                if (row_added) {
                    GM.notification({text: success_user_information_copied});
                }
                await GM.deleteValue("data_ask_user_and_others");
            }
        });
        // -- Table
        table.addEventListener("click", function(event) {
            switch (event.target.name) {
                case "row_add":
                    tableAddRow(table, event.target.parentElement.parentElement.rowIndex, null, null, true);
                    break;
                case "row_delete":
                    table.deleteRow(event.target.parentElement.parentElement.rowIndex);
                    break;
            }
        });
        // -- Create Messages button
        document.getElementById("create_messages_button").addEventListener("click", function(event) {
            let recipient_info = [];

            // Create a list of recipient information
            for (const row of table.tBodies[0].rows) {
                let inputs = row.querySelectorAll("input");
                recipient_info.push({url_newpm: inputs[0].value, name_recipient: inputs[1].value});
            }

            // Check if every recipient information is valid
            for (let i = 0; i < recipient_info.length; i++) {
                // Check url_newpm
                try {
                    let url = new URL(recipient_info[i].url_newpm);
                }
                catch (error) {
                    GM.notification({text: error_table_url_newpm_invalid.replaceAll("<row>", i + 1).replaceAll("<url_newpm>", recipient_info[i].url_newpm)});
                    return;
                }
                // Check name_recipient
                if (recipient_info[i].name_recipient == "") {
                    GM.notification({text: error_table_name_recipient_empty.replaceAll("<row>", i + 1)});
                    return;
                }
            }

            // Create Notes
            recipient_info.forEach(function(item, index, array) {
                let names_recipients_other = recipient_info.map(x => x.name_recipient).filter((filter_item, filter_index) => filter_index != index);
                let url_tab;

                if (names_recipients_other.length == 0) {
                    url_tab = queryString(item.url_newpm, {name_userscript: params.get("name_userscript"), name_post: params.get("name_post"), name_recipient: item.name_recipient, url_post: params.get("url_post"), names_recipients_other: "", name_sender: params.get("name_sender")});
                }
                else {
                    let last_element = names_recipients_other.pop();
                    if (names_recipients_other.length == 0) {
                        names_recipients_other = last_element;
                    }
                    else {
                        names_recipients_other = names_recipients_other.join(separator_comma) + separator_and + last_element;
                    }
                    url_tab = queryString(item.url_newpm, {name_userscript: params.get("name_userscript"), name_post: params.get("name_post"), name_recipient: item.name_recipient, url_post: params.get("url_post"), names_recipients_other: names_recipients_other, name_sender: params.get("name_sender")});
                }

                GM.openInTab(url_tab, {active: true, insert: true, setParent: true});
            });
        });
    }
    // --------------------------------------------------------------------------------
    // User
    // --------------------------------------------------------------------------------
    else if (user_regexp_url.test(document.URL)) {
        GM.registerMenuCommand("Copy User Information", copyUserInformation);
        GM.registerMenuCommand("Settings", settings);
    }
    // --------------------------------------------------------------------------------
    // View
    // --------------------------------------------------------------------------------
    else if (view_regexp_url.test(document.URL)) {
        GM.registerMenuCommand("Ask User Only", askUserOnly);
        GM.registerMenuCommand("Ask User and Others", askUserAndOthers);
        GM.registerMenuCommand("Settings", settings);
    }
    // --------------------------------------------------------------------------------
    // New PM
    // --------------------------------------------------------------------------------
    else if (newpm_regexp.test(document.URL)) {
        GM.registerMenuCommand("Settings", settings);

        // Check if the user has disabled notes
        let system_message = extract(document, newpm_extract_system_message);
        if (system_message) {
            return;
        }

        // Extract parameters
        let params = new URL(document.URL).searchParams;
        if (params.get("name_userscript") != name_userscript) {
            // AfP didn't open this newpm page
            return;
        }

        // Subject
        let subject = await GM.getValue("subject", template_subject);
        subject = subject.replaceAll("<name_post>", params.get("name_post"));

        let element_subject = extract(document, newpm_extract_subject);
        if (! element_subject) {
            GM.notification({text: error_finding_subject});
            return;
        }
        element_subject.value = subject;

        // Message
        let message;
        if (params.get("names_recipients_other") == "") {
            message = await GM.getValue("message_ask_user_only", template_message_ask_user_only);
        }
        else {
            message = await GM.getValue("message_ask_user_and_others", template_message_ask_user_and_others);
        }

        for (const element of ["name_recipient", "url_post", "names_recipients_other", "name_sender"]) {
            message = message.replaceAll("<" + element + ">", params.get(element));
        }

        let element_message = extract(document, newpm_extract_message);
        if (! element_message) {
            GM.notification({text: error_finding_message});
            return;
        }
        element_message.value = message;
    }
    else {
        GM.registerMenuCommand("Settings", settings);
    }
})();