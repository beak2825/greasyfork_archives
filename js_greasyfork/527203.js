// ==UserScript==
// @name            e621 highlight searched tags
// @namespace       https://greasyfork.org/ru/users/303426-титан
// @version         1.0.2
// @description     Higghlight searched tags in the tag panel on the left side of the page
// @author          Титан
// @license         GPL-3.0-only
// @match           https://e621.net/*
// @match           https://e926.net/*
// @require         https://greasyfork.org/scripts/21927-arrive-js/code/arrivejs.js
// @grant           GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/527203/e621%20highlight%20searched%20tags.user.js
// @updateURL https://update.greasyfork.org/scripts/527203/e621%20highlight%20searched%20tags.meta.js
// ==/UserScript==


//box-shadow variant:
//2px 2px 2px rgba(0, 0, 0, 0.5), -2px -2px 2px rgb(202 198 198 / 30%)
let css = `
.highlight {
	box-shadow:
		inset 1px 1px 2px rgba(0, 0, 0, 0.5),
        inset -1px -1px 2px rgba(255, 255, 255, 0.3);
	border-radius: 8px;
    padding: 3px;
	text-shadow: 0 0 3px #000;
}
.mandatory-highlight {
	background-color: #efbc4d88!important;
}
.optional-highlight {
	background-color: #9cd10099!important;
}
.wildcard-highlight {
	background-color: #8500d188!important;
}
`

GM_registerMenuCommand("Reinitialize highlights", function() {
	let TagList = document.querySelector("#tag-list");
	if (TagList) {
		RemoveHighlights(TagList);
		HighlightTags(TagList);
	}
});

function HighlightTags(TagList) {
	let searchInput = document.querySelector("#tags").textContent;
	let tags = TagList.querySelectorAll("ul > li a.search-tag");
	let searchTags = searchInput.split(" ");
	// optional tags start with "~". Find  them and remove the "~"
	let searchTagsOptional = searchTags.filter(tag => tag.startsWith("~")).map(tag => ReplaceEvery(tag.slice(1), "_", " "));
	// wildcard tags... have a wildcard somewhere
	let searchTagsWildcard = searchTags.filter(tag => tag.includes("*")).map(tag => ReplaceEvery(tag, "_", " "));
	// other tags are mandatory
	let searchTagsMandatory = searchTags.filter(tag => !tag.startsWith("~") && !tag.startsWith("-") && !tag.includes("*")).map(tag => ReplaceEvery(tag, "_", " "));

	// highlight tags
	tags.forEach(tag => {
		let tagText = tag.textContent.toLowerCase()
		let tagClassList = ["highlight"];
		if (searchTagsMandatory.includes(tagText)) {
			tagClassList.push("mandatory-highlight");
		} else if (searchTagsOptional.includes(tagText)) {
			tagClassList.push("optional-highlight");
		} else if (searchTagsWildcard.some(wildcard => {
			let regex = new RegExp(wildcard.replace("*", ".*"), "i");
			return regex.test(tagText);
		})) {
			tagClassList.push("wildcard-highlight");
		}
		if (tagClassList.length > 1)
			tag.classList.add(...tagClassList);
	});
}

function RemoveHighlights(TagList) {
	let tags = TagList.querySelectorAll("ul > li a.search-tag");
	tags.forEach(tag => {
		tag.classList.remove("highlight", "mandatory-highlight", "optional-highlight", "wildcard-highlight");
	});
}

function ReplaceEvery(string, search, replace) {
	return string.split(search).join(replace);
}


let arriveOptions = {
	fireOnAttributesModification: true,
	existing: true
};
document.arrive("#tag-list", arriveOptions, function(TagList) {
	HighlightTags(TagList);
});

// apply css
let style = document.createElement("style");
style.innerHTML = css;
document.head.appendChild(style);