// ==UserScript==
// @name        Manage Debian bug reports directly from web
// @description Generate ready-to-send email messages to change the status of bugs (tags and user tags, severity, forwarded address).
// @namespace   https://salsa.debian.org/gioele/
// @version     20160111.0
// @icon        https://www.debian.org/favicon.ico
// @include     https://bugs.debian.org/*
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery-details/0.1.0/jquery.details.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/439601/Manage%20Debian%20bug%20reports%20directly%20from%20web.user.js
// @updateURL https://update.greasyfork.org/scripts/439601/Manage%20Debian%20bug%20reports%20directly%20from%20web.meta.js
// ==/UserScript==

// prevent JQuery conflicts, see http://wiki.greasespot.net/@grant
this.$ = this.jQuery = jQuery.noConflict(true);

function bug_number_str_fn() {
	var bug_link_elem = $('h1 a').first();
	var bug_num_str = bug_link_elem.text().substr(1);

	return bug_num_str;
}

function bug_title_fn() {
	var bug_title_elem = $('h1').first();

	var bug_title_text_node = bug_title_elem
		.contents()
		.filter(function() {
			return this.nodeType == Node.TEXT_NODE;
		}).last();

	var bug_title_text = bug_title_text_node.text().trim();

	return bug_title_text;
}

function bug_package_fn() {
	var bug_package_elem = $('a.submitter').first();

	var bug_package_text = bug_package_elem.text().trim();

	return bug_package_text;
}

function bug_panel_fn() {
	var bug_panel = $('<details id="bugpanel"/>');
	bug_panel.append($("<summary>Additional fields…</summary>"));

	return bug_panel;
}

function href_for_mail(to_address, cc_addresses, reply_to_address, subject, body) {
	reply_to_address = reply_to_address || "";
	body = body || "";
	var href;

	href = "mailto:" + to_address;
	href += "?subject=" + encodeURIComponent(subject);
	for (var cc_address of cc_addresses) {
		href += "&cc=" + cc_address;
	}
	href += "&body=";
	if (reply_to_address != "") {
		href += "Reply-To: " + reply_to_address + "%0D%0A";
	}
	href += encodeURIComponent(body);

	return href;
}

function command_for_action(action, value, bug_number_str) {
	var command;

	switch (action) {
		case 'severity':
			var severity = value;
			command = 'severity ' + bug_number_str + ' ' + severity;
			break;
		case 'tags':
			var diff = value;
			command = 'tags ' + bug_number_str + ' ' + diff;
			break;
		case 'found': // FIXME: support more than one found command
			var version = value;
			command = 'found ' + bug_number_str + ' ' + version;
			break;
		case 'notfound': // FIXME: support more than one notfound command
			var version = value;
			command = 'notfound ' + bug_number_str + ' ' + version;
			break;
		case 'forwarded':
			var url = value;
			command = 'forwarded ' + bug_number_str + ' ' + url;
			break;
		case 'notforwarded':
			command = 'notforwarded ' + bug_number_str;
			break;
	}

	return command
}

function href_for_reply(bug_number_str, bug_package, bug_title, kind, actions) {
	var to_address;
	var reply_to_address = bug_number_str + "@bugs.debian.org";
	var cc_addresses = [];
	var subject = "Re: Bug#" + bug_number_str + ": " + bug_title;
	var body = "";

	// addresses

	switch (kind) {
		case 'reply':
			to_address = bug_number_str + '@bugs.debian.org';
			cc_addresses.push(bug_number_str + '-submitter@bugs.debian.org');
			break;
		case 'close':
			to_address = bug_number_str + '-close@bugs.debian.org';
			break;
		case 'subscribe':
			to_address = bug_number_str + '-subscribe@bugs.debian.org';
			subject = subject.replace(/^Re: /, "Subscribe ");
			reply_to_address = "";
			break;
	}

	// body

	var newline = "\r\n";

	for (var action in actions) {
		var value = actions[action];
		body += 'Control: ' + command_for_action(action, value, '-1') + newline;
	}

	return href_for_mail(to_address, cc_addresses, reply_to_address, subject, body);
}

function href_for_control(bug_number_str, bug_package, bug_title, actions) {
	var to_address = "control@bugs.debian.org";
	var reply_to_address;
	var cc_addresses = [];
	var subject = "";
	var body = "";

	// subject

	var action_names = Object.getOwnPropertyNames(actions);
	if (action_names.length != 0) {
		subject += action_names[0] + " ";
	}
	subject += bug_number_str + " [" + bug_package + "] " + bug_title;

	// body

	var newline = "\r\n";

	body += "package " + bug_package + newline;
	for (var action in actions) {
		var value = actions[action];
		body += command_for_action(action, value, bug_number_str) + newline;
	}
	body += "thanks" + newline;

	return href_for_mail(to_address, cc_addresses, reply_to_address, subject, body);
}

function commands_for_bts(bug_number_str, bug_package, actions) {
	var cmdline = 'bts';

	cmdline += ' package ' + bug_package;

	var first_action = true;
	for (var action in actions) {
		var value = actions[action];
		cmdline += ' , ';
		bug_id = first_action ? bug_number_str : 'it';
		cmdline += command_for_action(action, value, bug_id);
		first_action = false;
	}

	return cmdline;
}

function add_to_info_or_panel(text, field, bug_panel) {
	var field_orig = $('div.buginfo p:contains("' + text + '")');
	if (field_orig.length != 0) {
		field_orig.after(field);
		field_orig.hide();
	} else {
		bug_panel.append(field);
	}
}

function setup_bug_actions_links() {
	var reply_link_elem = $('a:contains("Reply")').first();
	reply_link_elem.attr('id', 'bug-actions-reply');

	reply_link_elem.after($('<a id="bug-actions-close" href="">close</a>'));
	reply_link_elem.after(', ');

	var subscribe_link_elem = $('a:contains("subscribe")').first();
	subscribe_link_elem.attr('id', 'bug-actions-subscribe');
}

function enhance_bug_panel() {
	var bug_number_str = bug_number_str_fn(); // FIXME
	if (bug_number_str == "") { return; }

	var bug_panel = bug_panel_fn();

	var severity_field = $('<p id="severity-field"/>');
	severity_field.append($('<span>Severity:</span>'));
	severity_field.append(' ');
	severity_field.append($('<input id="severity-orig" type="hidden"/>'));
	var severity_select = $('<select id="severity"/>');
	for (var idx in VALID_SEVERITY_LEVELS) {
		severity_level = VALID_SEVERITY_LEVELS[idx];
		severity_select.append('<option value="' + severity_level + '">' + severity_level + '</option>');
	}
	severity_field.append(severity_select);
	severity_field.on("change keyup keydown", function() { update_bug_links(); });
	add_to_info_or_panel("Severity: ", severity_field, bug_panel);

	var tags_field = $('<p id="tags-field"/>');
	tags_field.append($('<span>Tags:</span>'));
	tags_field.append(' ');
	tags_field.append($('<input id="tags-orig" name="tags-orig" type="hidden"/>'));
	tags_field.append($('<input id="tags" name="tags"/>'));
	tags_field.on("change keyup keydown", function() { update_bug_links(); });
	add_to_info_or_panel("Tags: ", tags_field, bug_panel);

	var found_field = $('<p id="found-field"/>');
	found_field.append($('<span>Found in version </span>'));
	found_field.append(' ');
	found_field.append($('<input id="found-orig" name="found-orig" type="hidden"/>'));
	found_field.append($('<input id="found" name="found"/>'));
	found_field.on("change keyup keydown", function() { update_bug_links(); });
	add_to_info_or_panel("Found in version", found_field, bug_panel);

	var forwarded_field = $('<p id="forwarded-url-field"/>');
	forwarded_field.append($('<span>Forwarded to</span>'));
	forwarded_field.append(' ');
	forwarded_field.append($('<input id="forwarded-url-orig" name="forwarded-url-orig" type="hidden"/>'));
	forwarded_field.append($('<input id="forwarded-url" name="forwarded-url" size="60"/>'));
	forwarded_field.on("change keyup keydown", function() { update_bug_links(); });
	add_to_info_or_panel("Forwarded to", forwarded_field, bug_panel);

	var bug_commands_elem = $('<p id="bug-commands"/>');
	bug_commands_elem.append($('<span>Scheduled bug commands</span>'));
	bug_commands_elem.append(' ');
	bug_commands_elem.append($('<span id="bug-commands-count"/>'));
	bug_commands_elem.append(' ');
	bug_commands_elem.append($('<a id="bug-commands-submit-via-control" href="mailto:control@bugs.debian.org">submit via control</a>'));
	bug_commands_elem.append(', ');
	var submit_via_bts_elem = $('<a id="bug-commands-submit-via-bts" href="">via bts</a>');
	submit_via_bts_elem.on('click', function() { $('p#bts-commands-field').show(100); return false; });
	bug_commands_elem.append(submit_via_bts_elem);

	var bts_commands_field = $('<p id="bts-commands-field" style="padding-left: 1em"/>');
	bts_commands_field.append('Use this command line: ');
	bts_commands_field.append(' ');
	bts_commands_field.append($('<input id="bts-commands" readonly="readonly"/>'));
	bts_commands_field.hide();

	var bug_command_list_elem = $('<ul id="bug-command-list"/>');

	var buginfo_elem = $('div.buginfo').last();
	buginfo_elem.after(bug_command_list_elem);
	buginfo_elem.after(bts_commands_field);
	buginfo_elem.after(bug_commands_elem);
	buginfo_elem.after(bug_panel);

	set_initial_values();
	setup_bug_actions_links();
	update_bug_links();
}

function set_initial_values() {
	// Severity
	var severity_orig_elem = $('div.buginfo p:contains("Severity: ")').first();
	var severity_orig = severity_orig_elem.text().replace(/^Severity: /, "");
	$('input#severity-orig').val(severity_orig);
	$('select#severity').val(severity_orig);

	// Tags
	var tags_orig_elem = $('div.buginfo p:contains("Tags: ")').first();
	var tags_orig = tags_orig_elem.text().replace(/^Tags: /, "");
	$('input#tags-orig').val(tags_orig);
	$('input#tags').val(tags_orig);

	// Found
	var found_orig_elem = $('div.buginfo p:contains("Found in version")').first();
	var found_orig = found_orig_elem.text().replace(/^Found in versions? /, "");
	$('input#found-orig').val(found_orig);
	$('input#found').val(found_orig);

	// Forwarded to
	var forwarded_url_orig_elem = $('div.buginfo p:contains("Forwarded to") a').first();
	var forwarded_url_orig = forwarded_url_orig_elem.attr("href") || "";
	$('input#forwarded-url-orig').val(forwarded_url_orig);
	$('input#forwarded-url').val(forwarded_url_orig);
}

function update_bug_links() {
	var bug_number_str = bug_number_str_fn(); // FIXME
	var bug_title = bug_title_fn();
	var bug_package = bug_package_fn();

	////////////////////////////////////////

	var actions = {}

	var bug_command_list_elem = $('#bug-command-list');
	bug_command_list_elem.empty();

	// severity
	var severity_orig = $('input#severity-orig').val();
	var severity = $('select#severity').val();
	if (severity != severity_orig) {
		bug_command_list_elem.append($('<li>severity ' + severity + ' (was <em>' + severity_orig + '</em>)</li>'));
		actions['severity'] = severity;
	}

	// tags
	var tags_orig = $('input#tags-orig').val();
	var tags = $('input#tags').val();

	function split_tags(value) {
		var pieces = value.split(",");
		pieces = pieces.map(t => t.trim());
		pieces = pieces.filter(t => t != "");
		pieces = pieces.filter(function(el,i,a) { return (i==a.indexOf(el)); });
		return pieces;
	}
	tags_orig = split_tags(tags_orig);
	tags = split_tags(tags);

	var tags_added = tags.filter(tag => tags_orig.indexOf(tag) < 0);
	var tags_removed = tags_orig.filter(tag => tags.indexOf(tag) < 0);
	if (tags_added.length + tags_removed.length != 0) {
		for (var tag_idx in tags_added) {
			bug_command_list_elem.append($('<li>tags + <add>' + tags_added[tag_idx] + '</add></li>'));
		}
		for (var tag_idx in tags_removed) {
			bug_command_list_elem.append($('<li>tags - <del>' + tags_removed[tag_idx] + '</del></li>'));
		}

		var tag_actions = [];
		if (tags_added.length > 0) {
			tag_actions.push(['+ ' + tags_added.join(' ')]);
		}
		if (tags_removed.length > 0) {
			tag_actions.push(['- ' + tags_removed.join(' ')]);
		}
		actions['tags'] = tag_actions.join(' ');
	}

	// found
	var found_orig = $('input#found-orig').val();
	var found = $('input#found').val();

	found_orig = split_tags(found_orig);
	found = split_tags(found);

	var found_added = found.filter(ver => found_orig.indexOf(ver) < 0);
	var found_removed = found_orig.filter(ver => found.indexOf(ver) < 0);
	if (found_added.length + found_removed.length != 0) {
		for (var ver_idx in found_added) {
			bug_command_list_elem.append($('<li>found <add>' + found_added[ver_idx] + '</add></li>'));
		}
		for (var ver_idx in found_removed) {
			bug_command_list_elem.append($('<li>notfound <del>' + found_removed[ver_idx] + '</del></li>'));
		}
	}
	if (found_added.length > 0) {
		actions['found'] = found_added[0]; // FIXME: add more than one version
	}
	if (found_removed.length > 0) {
		actions['notfound'] = found_removed[0]; // FIXME: remove more than one version
	}

	// forwarded
	var forwarded_url_orig = $('input#forwarded-url-orig').val();
	var forwarded_url = $('input#forwarded-url').val();
	if (forwarded_url != forwarded_url_orig) {
		var str;
		if (forwarded_url != "") {
			str = 'forwarded <a href="' + forwarded_url + '">' + forwarded_url + '</a>';
		} else {
			str = 'notforwarded';
		}

		var was;
		if (forwarded_url_orig == "") {
			was = " (was <em>unset</em>)";
		} else {
			was = ' (was <a href="' + forwarded_url_orig + '">' + forwarded_url_orig + '</a>)';
		}

		bug_command_list_elem.append($('<li>' + str + ' ' + was + '</li>'));

		if (forwarded_url != "") {
			actions['forwarded'] = forwarded_url;
		} else {
			actions['notforwarded'] = "";
		}
	}

	// update command list and links

	var commands_count = bug_command_list_elem.children().length;
	if (commands_count == 0) {
		commands_count = "none";
	}
	$('#bug-commands-count').text("(" + commands_count + ")");

	var reply_mail_href = href_for_reply(bug_number_str, bug_package, bug_title, 'reply', actions);
	var close_mail_href = href_for_reply(bug_number_str, bug_package, bug_title, 'close', actions);
	var subscribe_mail_href = href_for_reply(bug_number_str, bug_package, bug_title, 'subscribe', actions);
	$('a#bug-actions-reply').attr("href", reply_mail_href);
	$('a#bug-actions-close').attr("href", close_mail_href);
	$('a#bug-actions-subscribe').attr("href", subscribe_mail_href);

	var control_mail_href = href_for_control(bug_number_str, bug_package, bug_title, actions);
	$('a#bug-commands-submit-via-control').attr("href", control_mail_href);

	var bts_commands = commands_for_bts(bug_number_str, bug_package, actions);
	$('input#bts-commands').val(bts_commands);
}

function add_style_elem() {
	var style_str = "\
#bugpanel, #bugpanel p {\
	font-family: sans-serif; font-size: 110%;\
	margin: 0; border: 0;\
}\
#bugpanel input, .buginfo input,\
#bugpanel select, .buginfo select,\
#bts-commands-field input {\
	margin-top: 0; margin-bottom: 0;\
	border: thin solid #cecece;\
	background-color: inherit;\
}\
#bugpanel > * { padding-left: 2em; }\
#bugpanel summary { padding-left: inherit; }\
p#bug-commands { margin: 0; font-size: 90%; color: #686868; }\
";
	$('body').append($('<style type="text/css">' + style_str + '</style>'));
}

var VALID_SEVERITY_LEVELS = [ 'critical', 'grave', 'serious', 'important', 'normal', 'minor', 'wishlist' ];
var VALID_TAGS = [ 'patch', 'wontfix', 'moreinfo', 'unreproducible', 'help', 'pending', 'security', 'upstream', 'confirmed', 'fixed', 'fixed-upstream', 'fixed-in-experimental', 'd-i', 'ipv6', 'lfs', 'l10n', 'potato', 'woody', 'sarge', 'sarge-ignore', 'etch', 'etch-ignore', 'lenny', 'lenny-ignore', 'squeeze', 'squeeze-ignore', 'wheezy', 'wheezy-ignore', 'jessie', 'jessie-ignore', 'sid', 'experimental' ]

add_style_elem();
enhance_bug_panel();
$('details').details();

// This is free software released into the public domain (CC0 license).
