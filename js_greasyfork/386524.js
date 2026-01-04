// ==UserScript==
// @name		moar markdown
// @version		0.5
// @description adds more markdown rules to kotchan.org
// @author		Fat and gay Alex
// @match		https://www.kotchan.org/chat/*
// @match		http://www.kotchan.org/chat/*
// @match		*kotchan.org/chat/*
// @namespace https://greasyfork.org/users/310751
// @downloadURL https://update.greasyfork.org/scripts/386524/moar%20markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/386524/moar%20markdown.meta.js
// ==/UserScript==


var newRules = `
[/\\[sup\\]/g, function(m, o) {
	var body = this.parse(rules, /\\[\\/sup\\]/g);
	o.push($("<sup/>").append(body));
}],
[/\\[sub\\]/g, function(m, o) {
	var body = this.parse(rules, /\\[\\/sub\\]/g);
	o.push($("<sub/>").append(body));
}],` // this adds our new rules, don't forget to double backslash and an ending comma!!!!!!


function main() {
	var newFunc = apply_rules.toString()
	.replace(/.*{/,'')							// strip function update_chat(new_data, first_load) {
	.replace(/}$/,'')							// strip } at the end of the function
	.replace(/rules = \[/,'rules = ['+newRules)	// add new rules to rule array

	apply_rules = new Function ('data', 'post', 'id' , newFunc); // override the update_chat function
};


if (document.getElementById('body')) {
	// escape scope
	var script = document.getElementsByTagName('head')[0].appendChild(document.createElement('script'));
	script.setAttribute('type', 'text/javascript');
	script.textContent = main();
} // Thanks to "The Almighty Pegasus Epsilon" <pegasus@pimpninjas.org>

