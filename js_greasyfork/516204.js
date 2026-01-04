// ==UserScript==
// @name         Coolakov Fixes GFD2
// @namespace    coolakov
// @version      1.3.2
// @description  Enhances the Coolakov most_promoted tool with custom layout, font settings, special buttons, link controls, and regex highlighting.
// @author       GreatFireDragon
// @match        https://coolakov.ru/tools/most_promoted/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coolakov.ru
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/516204/Coolakov%20Fixes%20GFD2.user.js
// @updateURL https://update.greasyfork.org/scripts/516204/Coolakov%20Fixes%20GFD2.meta.js
// ==/UserScript==

const $ = window.jQuery;
const regexAmount = 5; // Amount of Regexes
const types = ["1","2","3","4","5"]; // Updated to 5 categories
const emojis = ["🌑", "🌒", "🌓", "🌔", "🌕"]; // Array of 5 different emojis

// Font styles
const fontStyles = {
	Arial: "Arial, sans-serif",
	"Courier New": "Courier New, monospace",
	Cursive: "cursive",
	Georgia: "Georgia, serif",
	"Garamond Premier Pro": "Garamond Premier Pro, serif",
	"Lucida Bright": "Lucida Bright, sans-serif",
	"Lucida Console": "Lucida Console, monospace",
	"Lucida Grande": "Lucida Grande, sans-serif",
	"Lucida Sans": "Lucida Sans, sans-serif",
	"Lucida Sans Typewriter": "Lucida Sans Typewriter, sans-serif",
	"Lucida Sans Unicode": "Lucida Sans Unicode, sans-serif",
	Monospace: "monospace",
	Serif: "serif",
	"Times New Roman": "Times New Roman, serif",
	Courier: "Courier, monospace",
	"Fira Code": "'Fira Code', monospace"
};

// Data migration (optional)
const migrateData = () => {
	const mappings = {
		"GFD_goodLinks": "GFD_1Links",
		"GFD_neutralLinks": "GFD_2Links",
		"GFD_badLinks": "GFD_3Links"
	};
	Object.keys(mappings).forEach(oldKey => {
		if (localStorage.getItem(oldKey)) {
			localStorage.setItem(mappings[oldKey], localStorage.getItem(oldKey));
			localStorage.removeItem(oldKey);
		}
	});
};
migrateData();

// Load and save settings
const loadSettings = () => {
	const settings = JSON.parse(localStorage.getItem("GFD_settings")) || {};
	const { fontStyle = "" } = settings;
	$("#GFD_fontStyle").val(fontStyle);
	$("body").css("font-family", fontStyle);
};
const saveSettings = () => {
	localStorage.setItem("GFD_settings", JSON.stringify({ fontStyle: $("#GFD_fontStyle").val() }));
};

// Navbar font style control
$("#navbar-header").append(
	$("<select>", {
		id: "GFD_fontStyle",
		title: "Стиль шрифта",
		change: e => { $("body").css("font-family", e.target.value); saveSettings(); }
	}).append(
		Object.entries(fontStyles).map(([key, value]) => $("<option>", { value, text: key }))
	).val(JSON.parse(localStorage.getItem("GFD_settings") || '{}').fontStyle || "serif")
);
loadSettings();

// Remove specific span
$("#myform > div:nth-child(5) > label > span").remove();

// Special Buttons
let clickCounter = parseInt(localStorage.getItem('buttonClickCounter')) || 0;
const updateCounter = () => {
	localStorage.setItem('buttonClickCounter', ++clickCounter);
	console.log(`Количество нажатий: ${clickCounter}`);
};

function processTextarea(transformFn) {
	const textarea = $("#myform > div:nth-child(5) > textarea");
	const lines = textarea.val()
	.split('\n')
	.map(line => line.replace(/[+:.\-\?!#_]/g, ' ').replace(/\(\d+\)/g, ''))
	.filter(line => line.trim() !== '')
	.map(transformFn)
	.map(line => line.replace(/\s\s+/g, ' ').trim())
	.join('\n')
	textarea.val(lines);
	updateCounter();
}

// FORM ACTIONS
// Create the default "Собрать выдачу" button.
$("<button>", {
    id: "GFD_trimSpecialChars", tabindex: 9,
    text: "Собрать выдачу", class: "GFD_specialButton"
})
.on("click", () => {
    processTextarea(line => line);
})
.appendTo("#myform > div:nth-child(6)");

// Create an input for comma-separated phrases and append it to the navbar.
const $input = $("<input>", {
    id: "phrase-input",
    placeholder: "Введите фразы, разделённые запятой..."
});
$("#navbar-header").append($input);

// Load saved phrases from localStorage (if any) and set them in the input.
const savedPhrases = localStorage.getItem("phrases");
if (savedPhrases) {
    $input.val(savedPhrases);
}

// Create (or select) a container for dynamic buttons.
// Using a separate container ensures the default button is not overwritten.
let $dynamicContainer = $("#dynamic-buttons-container");
if (!$dynamicContainer.length) {
    $dynamicContainer = $("<div>", { id: "dynamic-buttons-container" });
    $("#myform > div:nth-child(6)").append($dynamicContainer);
}

// Utility function to escape regex special characters in a phrase.
function escapeRegExp(string) {return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');}

// Create buttons: '-' removes the phrase, '+' appends it if absent.
function createButtons() {
  $dynamicContainer.empty();
  const phrases = $input.val().split(",").map(s => s.trim()).filter(Boolean);
  phrases.forEach(phrase => {
    const $minus = $("<button>", {
      text: `- '${phrase}'`, tabindex: 9, class: "GFD_specialButton"
    }).on("click", () =>
      processTextarea(line => line.replace(new RegExp(escapeRegExp(phrase), 'g'), ''))
    );

    const $plus = $("<button>", {
      text: `+ '${phrase}'`, tabindex: 9, class: "GFD_specialButton"
    }).on("click", () =>
      processTextarea(line => new RegExp(escapeRegExp(phrase)).test(line) ? line : `${line} ${phrase}` )
    );

    $dynamicContainer.append($minus, $plus);
  });
}

// Update buttons (and save to localStorage) after the user stops typing.
let debounceTimer;
$input.on("input", function() {
    clearTimeout(debounceTimer);
    // Save the current phrases into localStorage.
    localStorage.setItem("phrases", $input.val());
    debounceTimer = setTimeout(createButtons, 500);
});

// Also update buttons on blur (when the input loses focus).
$input.on("blur", function() {
    localStorage.setItem("phrases", $input.val());
    createButtons();
});

// Create initial buttons from the loaded phrases.
createButtons();

// Link Controls
const linkDiv = $("<div>", { class: "GFD_linksControl" });
const createTextarea = key => $("<textarea>").val(decodeURI(localStorage.getItem(key) ?? ""));

// Create 5 link textareas and clear buttons using a loop
const linkControls = types.map(t => createTextarea(`GFD_${t}Links`));
linkControls.forEach((ta, i) => {
	linkDiv.append(
		ta,
		$("<button>", { text: "🧹 Clear " + types[i] }).on("click", () => clearLinks(types[i]))
	);
});
$("main.main div.container").eq(2).append(linkDiv);

// Remove first header container
$("main.main div.container").eq(0).remove();

let intervalId;
const observer = new MutationObserver(() => {
    const table = $("#myTable");
    if (table.length) {
        parseTable(table);
        $(".header").eq(3).text("#");
        parseAndHighlightRegexp();
        // Clear the previous interval if it exists
        if (intervalId) { clearInterval(intervalId); }
        intervalId = setInterval(parseAndHighlightRegexp, 100);
        updateCounters();
    }
});
observer.observe($("#result")[0], { childList: true });


// Create 5 RegExp highlight textareas
for (let i = 0; i < regexAmount; i++) {
	const storageKey = `GFD_highlightRegexp${i + 1}`;
	const storedValue = localStorage.getItem(storageKey) || "";
	$("<textarea>", {
		id: `highlightRegExpTextarea${i + 1}`,
		placeholder: `RegExp highlight ${i + 1}`
	}).val(storedValue).on("input", e => {
		localStorage.setItem(storageKey, e.target.value);
		parseAndHighlightRegexp();
		updateCounters(); // Update counters when regex textareas change
	}).appendTo(linkDiv);
}

// Function to generate regex lists
const getRegexLists = () => Array.from({ length: regexAmount }, (_, i) =>
	(localStorage.getItem(`GFD_highlightRegexp${i + 1}`) || "")
	.split("\n").map(r => r.trim())
	.filter(r => r.length >= 2)
	.map(r => { try { return new RegExp(r, 'i') } catch { return null } })
	.filter(Boolean)
);

// Function to parse and highlight using regex
function parseAndHighlightRegexp() {
	const regexLists = getRegexLists(); // Generate regex lists

	// Remove existing highlight classes
	$("tbody tr").removeClass(
		Array.from({ length: regexAmount }, (_, i) => `GFD_highlight${i + 1}`).join(" ")
	);

	// Highlight matching rows
	$("tbody tr").each(function () {
		const $row = $(this);

		$row.find("td, a").each(function () {
			const cellText = $(this).text(); // Get the text content of the <td>

			regexLists.forEach((regexList, i) => {
				if (regexList.some(regexp => regexp.test(cellText))) {
					$row.addClass(`GFD_highlight${i + 1}`);
				}
			});
		});
	});
};

// Function to calculate and update counters
function updateCounters() {
	const regexLists = getRegexLists(); // Generate regex lists
	const combinedCounters = Array(regexAmount).fill(0); // Single counter array for active + regex

	// Count active and regex links
	$(".ellipsis").each(function () {
		const $row = $(this);

		// Check for active buttons in the row
		let hasActive = false;
		types.forEach((type, index) => {
			if ($row.find(`.GFD_${type}Active`).length) {
				combinedCounters[index]++;
				hasActive = true;
			}
		});

		// If no active button, process regex highlights
		if (!hasActive) {
			$row.find("a").each(function () {
				const linkText = $(this).text();
				regexLists.forEach((regexList, i) => {
					if (regexList.some(regexp => regexp.test(linkText))) {
						combinedCounters[i]++;
					}
				});
			});
		}
	});

	// Update or create the counter container
	const $counterContainer = $('#result div:first').find('#highlightCounters').length
	? $('#result div:first').find('#highlightCounters').empty()
	: $('<div>', { id: 'highlightCounters' }).appendTo($('#result div:first'));

	// Add combined counters
	combinedCounters.forEach(count => $counterContainer.append(`<p>${count}</p>`));
};


// Parse table
function parseTable(table) {
	$("tbody tr", table).each(function() {
		const linkCell = $(this).find("td:nth-child(2) a");
		const trimmedHref = linkCell.attr("href");

		let linkText;
		try {
			linkText = decodeURIComponent(trimmedHref.replace(/^https?:\/\//i, "").replace(/^www\./, ""));
		} catch (e) {
			linkText = trimmedHref.replace(/^https?:\/\//i, "").replace(/^www\./, "");
		}

		const linkParts = linkText.split("/").filter(Boolean);
		linkCell.empty().append(
			linkParts.map((part, index) =>
				$("<span>", { class: index === 0 ? "GFD_domain" : index === 1 ? "GFD_category" : "", text: part })
				.append(index < linkParts.length - 1 ? "/" : "")
			)
		);

		// Add buttons for 1 to 5
		let activeButton = null;
		types.forEach((type, index) => {
			const links = localStorage.getItem(`GFD_${type}Links`)
			? decodeURI(localStorage.getItem(`GFD_${type}Links`)).split("\n") : [];
			const isActive = links.includes(trimmedHref);
			const button = $("<button>", {
				text: isActive ? "❌" : emojis[index], // Assign emoji based on type
				class: isActive ? `GFD_${type}Active` : ""
			}).on("click", () => handleButtonClick(button, type, trimmedHref));
			linkCell.parent().append(button);
			if (isActive) activeButton = button;
		});
		if (activeButton) linkCell.parent().find("button").not(activeButton).prop("disabled", true);

		// Favicon (click does nothing now)
		const domain = trimmedHref.split("/")[2].replace("www.", "");
		$("<img>", {
			src: `https://www.google.com/s2/favicons?sz=128&domain=${trimmedHref}`,
			"data-domain": domain,
			title: domain,
		}).appendTo($(this).find("td:first"));
	});
};

// Handle button clicks
const handleButtonClick = (button, type, href) => {
	const index = types.indexOf(type); // Find the index of the type
	let links = localStorage.getItem(`GFD_${type}Links`)
	? decodeURI(localStorage.getItem(`GFD_${type}Links`)).split("\n") : [];

	if ($(button).text() === "❌") {
		// If the button is active, deactivate it
		links = links.filter(item => item !== href);
		$(button).text(emojis[index]).removeClass(`GFD_${type}Active`); // Set emoji from the array
		$(button).siblings("button").prop("disabled", false);
	} else {
		// If the button is inactive, activate it
		links.push(href);
		$(button).text("❌").addClass(`GFD_${type}Active`); // Set active state
		$(button).siblings("button").prop("disabled", true);
	}

	localStorage.setItem(`GFD_${type}Links`, encodeURI(links.join("\n")));
	updateTextareas();
	updateCounters();
};

// Update textareas
const updateTextareas = () => {
	linkControls.forEach((ta, i) => ta.val(decodeURI(localStorage.getItem(`GFD_${types[i]}Links`) || "")));
};

// Clear links
const clearLinks = (type) => {
	localStorage.removeItem(`GFD_${type}Links`);
	window.location.reload();
};

// Restore last textarea value
const lastValue = localStorage.getItem("GFD_lastValue");
if (lastValue !== null) {
	$("#myform > div:nth-child(5) > textarea").val(lastValue);
	$("#myform > div:nth-child(6) > input").click();
}
$("#myform > div:nth-child(5) > textarea").on("input", () => {
	localStorage.setItem("GFD_lastValue", $("#myform > div:nth-child(5) > textarea").val());
});

// Initial highlight
parseAndHighlightRegexp();