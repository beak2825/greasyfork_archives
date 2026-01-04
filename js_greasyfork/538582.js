// ==UserScript==
// @name         Coolakov Enhancer (Combined)
// @namespace    coolakov
// @version      3.1.0
// @description  Объединенный скрипт: собирает title/description/H1, улучшает интерфейс, добавляет кнопки, подсветку и классификацию ссылок.
// @author       GreatFireDragon
// @match        https://coolakov.ru/tools/most_promoted/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coolakov.ru
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_connect
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @connect      *
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538582/Coolakov%20Enhancer%20%28Combined%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538582/Coolakov%20Enhancer%20%28Combined%29.meta.js
// ==/UserScript==

const $ = window.jQuery;
const regexAmount = 5;
const types = ["1", "2", "3", "4", "5"];
const emojis = ["🌑", "🌒", "🌓", "🌔", "🌕"];

const fontStyles = {
	Arial: "Arial, sans-serif",
	"Courier New": "Courier New, monospace",
	"Times New Roman": "Times New Roman, serif",
	Georgia: "Georgia, serif"
};

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

const loadSettings = () => {
	const settings = JSON.parse(localStorage.getItem("GFD_settings")) || {};
	const { fontStyle = "" } = settings;
	$("#GFD_fontStyle").val(fontStyle);
	$("body").css("font-family", fontStyle);
};
const saveSettings = () => {
	localStorage.setItem("GFD_settings", JSON.stringify({ fontStyle: $("#GFD_fontStyle").val() }));
};

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

$("#myform > div:nth-child(5) > label > span").remove();

let clickCounter = parseInt(localStorage.getItem('buttonClickCounter')) || 0;
const updateCounter = () => {
	localStorage.setItem('buttonClickCounter', ++clickCounter);
	console.log(`Количество нажатий: ${clickCounter}`);
};

function processTextarea(transformFn) {
	const textarea = $("#myform > div:nth-child(5) > textarea");
	const lines = textarea.val()
	.split('\n')
	.map(line => line.replace(/[+\?!#_]/g, ' ').replace(/\(\d+\)/g, ''))
	.filter(line => line.trim() !== '')
	.map(transformFn)
	.map(line => line.replace(/\s\s+/g, ' ').trim())
	.join('\n');
	textarea.val(lines);
	updateCounter();
}

$("<button>", {
	id: "GFD_trimSpecialChars", tabindex: 9,
	text: "Собрать выдачу", class: "GFD_specialButton"
})
	.on("click", () => {
	processTextarea(line => line);
})
	.appendTo("#myform > div:nth-child(6)");

const $input = $("<input>", {
	id: "phrase-input",
	placeholder: "Введите фразы, разделённые запятой..."
});
$("#navbar-header").append($input);

const savedPhrases = localStorage.getItem("phrases");
if (savedPhrases) {
	$input.val(savedPhrases);
}

let $dynamicContainer = $("#dynamic-buttons-container");
if (!$dynamicContainer.length) {
	$dynamicContainer = $("<div>", { id: "dynamic-buttons-container" });
	$("#myform > div:nth-child(6)").append($dynamicContainer);
}

function escapeRegExp(string) { return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

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
					processTextarea(line => new RegExp(escapeRegExp(phrase)).test(line) ? line : `${line} ${phrase}`)
				 );

		$dynamicContainer.append($minus, $plus);
	});
}

let debounceTimer;
$input.on("input", function() {
	clearTimeout(debounceTimer);
	localStorage.setItem("phrases", $input.val());
	debounceTimer = setTimeout(createButtons, 500);
});
$input.on("blur", function() {
	localStorage.setItem("phrases", $input.val());
	createButtons();
});
createButtons();

const linkDiv = $("<div>", { class: "GFD_linksControl" });
const createTextarea = key => $("<textarea>").val(decodeURI(localStorage.getItem(key) ?? ""));
const linkControls = types.map(t => createTextarea(`GFD_${t}Links`));
linkControls.forEach((ta, i) => {
	linkDiv.append(
		ta,
		$("<button>", { text: "🧹 Clear " + types[i] }).on("click", () => clearLinks(types[i]))
	);
});
$("main.main div.container").eq(2).append(linkDiv);
$("main.main div.container").eq(0).remove();

let intervalId;
const observer = new MutationObserver(() => {
	const table = $("#myTable");
	if (table.length) {
		parseTable(table);
		$(".header").eq(3).text("#");
		parseAndHighlightRegexp();
		if (intervalId) { clearInterval(intervalId); }
		intervalId = setInterval(parseAndHighlightRegexp, 100);
		updateCounters();
	}
});
observer.observe($("#result")[0], { childList: true });

for (let i = 0; i < regexAmount; i++) {
	const storageKey = `GFD_highlightRegexp${i + 1}`;
	const storedValue = localStorage.getItem(storageKey) || "";
	$("<textarea>", {
		id: `highlightRegExpTextarea${i + 1}`,
		placeholder: `RegExp highlight ${i + 1}`
	}).val(storedValue).on("input", e => {
		localStorage.setItem(storageKey, e.target.value);
		parseAndHighlightRegexp();
		updateCounters();
	}).appendTo(linkDiv);
}

const getRegexLists = () => Array.from({ length: regexAmount }, (_, i) =>
																			 (localStorage.getItem(`GFD_highlightRegexp${i + 1}`) || "")
																			 .split("\n").map(r => r.trim())
																			 .filter(r => r.length >= 2)
																			 .map(r => { try { return new RegExp(r, 'i') } catch { return null } })
																			 .filter(Boolean)
																			);

function parseAndHighlightRegexp() {
	const regexLists = getRegexLists();
	$("tbody tr").removeClass(
		Array.from({ length: regexAmount }, (_, i) => `GFD_highlight${i + 1}`).join(" ")
	);
	$("tbody tr").each(function () {
		const $row = $(this);
		$row.find("td, a").each(function () {
			const cellText = $(this).text();
			regexLists.forEach((regexList, i) => {
				if (regexList.some(regexp => regexp.test(cellText))) {
					$row.addClass(`GFD_highlight${i + 1}`);
				}
			});
		});
	});
}

function updateCounters() {
	const regexLists = getRegexLists();
	const combinedCounters = Array(regexAmount).fill(0);

	$(".ellipsis").each(function () {
		const $row = $(this);
		let hasActive = false;
		types.forEach((type, index) => {
			if ($row.find(`.GFD_${type}Active`).length) {
				combinedCounters[index]++;
				hasActive = true;
			}
		});
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

	let $counterContainer = $('#result div:first').find('#highlightCounters');
	if (!$counterContainer.length) {
		$counterContainer = $('<div>', { id: 'highlightCounters' }).appendTo($('#result div:first'));
	}
	let $parent = $counterContainer.parent();
	if (!$parent.find('#copyButtons').length) {
		const actions = [
			{ label: 'Copy URLs', sel: "td:nth-child(2) a", attr: "href" },
			{ label: 'Copy Titles', sel: "td:nth-child(3)" },
			{ label: 'Copy Descriptions', sel: "td:nth-child(4)" },
			{ label: 'Copy H1', sel: "td:nth-child(5)" }
		];
		const $copyButtons = $('<div>', { id: 'copyButtons' });
		actions.forEach(({ label, sel, attr }) => {
			$('<button>', { text: label, class: 'GFD_specialButton' })
				.on('click', () => {
				let results = [];
				$("#list-pages #myTable tbody tr").each(function(){
					const $cell = $(this).find(sel);
					let text = attr ? $cell.attr(attr) : $cell.text().trim();
					if(text) results.push(text);
				});
				navigator.clipboard.writeText(results.join("\n"))
					.then(() => console.log(`${label} copied to clipboard`))
					.catch(err => console.error('Failed to copy:', err));
			})
				.appendTo($copyButtons);
		});
		$parent.append($copyButtons);
	}
	$counterContainer.empty();
	combinedCounters.forEach(count => $counterContainer.append(`<p>${count}</p>`));

}


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
		let activeButton = null;
		types.forEach((type, index) => {
			const links = localStorage.getItem(`GFD_${type}Links`)
			? decodeURI(localStorage.getItem(`GFD_${type}Links`)).split("\n") : [];
			const isActive = links.includes(trimmedHref);
			const button = $("<button>", {
				text: isActive ? "❌" : emojis[index],
				class: isActive ? `GFD_${type}Active` : ""
			}).on("click", () => handleButtonClick(button, type, trimmedHref));
			linkCell.parent().append(button);
			if (isActive) activeButton = button;
		});
		if (activeButton) linkCell.parent().find("button").not(activeButton).prop("disabled", true);
		const domain = trimmedHref.split("/")[2].replace("www.", "");
		$("<img>", {
			src: `https://www.google.com/s2/favicons?sz=128&domain=${trimmedHref}`,
			"data-domain": domain,
			title: domain,
		}).appendTo($(this).find("td:first"));
	});
}

const handleButtonClick = (button, type, href) => {
	const index = types.indexOf(type);
	let links = localStorage.getItem(`GFD_${type}Links`)
	? decodeURI(localStorage.getItem(`GFD_${type}Links`)).split("\n") : [];
	if ($(button).text() === "❌") {
		links = links.filter(item => item !== href);
		$(button).text(emojis[index]).removeClass(`GFD_${type}Active`);
		$(button).siblings("button").prop("disabled", false);
	} else {
		links.push(href);
		$(button).text("❌").addClass(`GFD_${type}Active`);
		$(button).siblings("button").prop("disabled", true);
	}
	localStorage.setItem(`GFD_${type}Links`, encodeURI(links.join("\n")));
	updateTextareas();
	updateCounters();
};

const updateTextareas = () => {
	linkControls.forEach((ta, i) => ta.val(decodeURI(localStorage.getItem(`GFD_${types[i]}Links`) || "")));
};

const clearLinks = (type) => {
	localStorage.removeItem(`GFD_${type}Links`);
	window.location.reload();
};

const lastValue = localStorage.getItem("GFD_lastValue");
if (lastValue !== null) {
	$("#myform > div:nth-child(5) > textarea").val(lastValue);
	$("#myform > div:nth-child(6) > input").click();
}
$("#myform > div:nth-child(5) > textarea").on("input", () => {
	localStorage.setItem("GFD_lastValue", $("#myform > div:nth-child(5) > textarea").val());
});

parseAndHighlightRegexp();

const cache = JSON.parse(localStorage.getItem('cache')) || {};
const MAX_CACHE_SIZE = 5000;

// Trim cache if necessary
if (Object.keys(cache).length > MAX_CACHE_SIZE) {
    Object.keys(cache).slice(0, Object.keys(cache).length - MAX_CACHE_SIZE).forEach(k => delete cache[k]);
    localStorage.setItem('cache', JSON.stringify(cache));
}

const saveCache = () => localStorage.setItem('cache', JSON.stringify(cache));
const supportsRangeCache = {};
let skipDomains = JSON.parse(localStorage.getItem('GFD_skipDomains')) || ['megamarket.ru', "market.yandex.ru", "ozon.ru", "ozon.by", "avito.ru"];

// Create and append textarea for skipDomains
const textarea = Object.assign(document.createElement('textarea'), {
    value: skipDomains.join(', '),
    title: "Домены для которых никогда не собирать тайтл, дескрипшн и H1",
});
document.querySelector("#navbar-header").appendChild(textarea);

textarea.addEventListener('change', () => {
    skipDomains = textarea.value.split(',').map(d => d.trim()).filter(Boolean);
    localStorage.setItem('GFD_skipDomains', JSON.stringify(skipDomains));
    refreshTable();
});

// Normalize URLs
const normalizeUrl = url => /^https?:\/\//i.test(url.trim()) ? url.trim() : `http://${url.trim()}`;

// Get headers based on user agent
const getUserAgentHeaders = ua => {
    const agents = {
        'Googlebot': 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/118.0.5993.70 Safari/537.36)',
        'YandexBot': 'Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)'
    };
    return ua ? { 'User-Agent': agents[ua], 'X-User-Agent': agents[ua] } : {};
};

// Decode HTML entities safely
const decodeEntities = str => {
    if (typeof str !== 'string') return '-';
    const entities = {
        '&nbsp;': ' ', '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'",
        '&copy;': '©', '&reg;': '®', '&euro;': '€', '&trade;': '™', '&mdash;': '—', '&ndash;': '–',
        '&uarr;': '↑', '&darr;': '↓', '&larr;': '←', '&rarr;': '→', '&harr;': '↔', '&bull;': '•',
        '&hellip;': '…', '&laquo;': '«', '&raquo;': '»', '&lsquo;': '‘', '&rsquo;': '’',
        '&ldquo;': '“', '&rdquo;': '”', '&frasl;': '⁄', '&times;': '×', '&divide;': '÷', '&para;': '¶'
    };
    return str.replace(/&amp;#(\d+);|&#(\d+);|&\w+;/g, (match, dec1, dec2) => {
        if (dec1) return String.fromCharCode(dec1);
        if (dec2) return String.fromCharCode(dec2);
        return entities[match] || match;
    });
};

// Update cell content
const updateCell = (cell, text) => {
    cell.textContent = text;
    cell.title = text;
    if (text.startsWith('Error') || text.includes('not found') || text === '-') cell.classList.add('GFD_title_error');
};

// Extract title, description, and H1 from HTML
const extractContent = text => ({
    title: (text.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1]?.trim(),
    description: (text.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) || [])[1]?.trim(),
    h1: (text.match(/<h1[^>]*>([^<]*)<\/h1>/i) || [])[1]?.trim()
});

// Fetch data with optional range and user agent
const fetchData = (url, cellTitle, cellDesc, cellH1, range, ua) => {
    if (cache[url]) {
        updateCell(cellTitle, cache[url].title);
        updateCell(cellDesc, cache[url].description);
        updateCell(cellH1, cache[url].h1);
        return;
    }

    cellTitle.textContent = cellDesc.textContent = cellH1.textContent = 'Fetching... 0';
    let seconds = 0;
    const timer = setInterval(() => {
        seconds++;
        cellTitle.textContent = `Fetching... ${seconds}`;
        cellDesc.textContent = `Fetching... ${seconds}`;
        cellH1.textContent = `Fetching... ${seconds}`;
    }, 1000);

    GM_xmlhttpRequest({
        method: 'GET',
        url,
        headers: { ...(range ? { 'Range': range } : {}), ...getUserAgentHeaders(ua) },
        onload: res => {
            clearInterval(timer);
            if ([200, 206].includes(res.status)) {
                const { title, description, h1 } = extractContent(res.responseText);

                const fields = { // Safely decode entities and handle missing fields
                    title: decodeEntities(title) || 'missing',description: decodeEntities(description) || 'missing',h1: decodeEntities(h1) || 'missing'
                };

                // Update cells and cache the results
                [ cellTitle, cellDesc, cellH1 ].forEach((cell, index) => {
                    const fieldKey = Object.keys(fields)[index]; // Get the corresponding field key (title, description, h1)
                    updateCell(cell, fields[fieldKey]);
                });
                cache[url] = fields;
                saveCache();
            } else {
                handleError(url, cellTitle, cellDesc, cellH1, range, ua, res.status);
            }
        },
        onerror: () => {
            clearInterval(timer);
            handleError(url, cellTitle, cellDesc, cellH1, range, ua, 'Network Error');
        },
        ontimeout: () => {
            var RequestTimesOut = 'Request timed out';
            clearInterval(timer);
            [ cellTitle, cellDesc, cellH1 ].forEach(cell => updateCell(cell, RequestTimesOut));
        },
        timeout: 10000
    });
};

// Handle fetch errors with retries
const handleError = (url, cellTitle, cellDesc, cellH1, range, ua, status) => {
    if (ua === 'Googlebot') {
        fetchData(url, cellTitle, cellDesc, cellH1, range, 'YandexBot'); // Retry with YandexBot
    } else if (ua === 'YandexBot') {
        fetchData(url, cellTitle, cellDesc, cellH1, range, null); // Final attempt without specifying User-Agent
    } else { // Final failure, cache '-' and update cells
        updateCell(cellTitle, 'fetch error'); updateCell(cellDesc, 'fetch error'); updateCell(cellH1, 'fetch error');
        // cache[url] = { title: '-', description: '-', h1: '-' };
        // saveCache();
    }
};

// Check if server supports range requests
const checkRangeSupport = url => new Promise(resolve => {
    const domain = new URL(url).origin;
    if (supportsRangeCache[domain] !== undefined) return resolve(supportsRangeCache[domain]);

    GM_xmlhttpRequest({
        method: 'HEAD',
        url,
        headers: getUserAgentHeaders('Googlebot'),
        onload: res => {
            const supports = /Accept-Ranges:\s*bytes/i.test(res.responseHeaders);
            supportsRangeCache[domain] = supports;
            resolve(supports);
        },
        onerror: () => {
            supportsRangeCache[domain] = false;
            resolve(false);
        }
    });
});

// Process each URL
const processUrl = async (url, cellTitle, cellDesc, cellH1) => {
    const normalized = normalizeUrl(url);
    let domain;
    try {
        domain = new URL(normalized).hostname.replace(/^www\./, '');
    } catch (e) {
        // Invalid URL
        updateCell(cellTitle, '-');updateCell(cellDesc, '-');updateCell(cellH1, '-');
        cache[normalized] = { title: '-',description: '-',h1: '-' };
        saveCache();
        return;
    }

    if (skipDomains.includes(domain)) {
        updateCell(cellTitle, '-');updateCell(cellDesc, '-');updateCell(cellH1, '-');
        return;
    }

    if (cache[normalized]) {
        updateCell(cellTitle, cache[normalized].title); updateCell(cellDesc, cache[normalized].description); updateCell(cellH1, cache[normalized].h1);
        return;
    }

    const supportsRange = await checkRangeSupport(normalized);
    fetchData(normalized, cellTitle, cellDesc, cellH1, supportsRange ? 'bytes=0-1024' : null, 'Googlebot');
};

// Process the table by adding headers and cells
const processTable = table => {
    const header = table.querySelector('thead tr');
    if (header && !header.querySelector('.title-header')) {
        ['Title', 'Description', 'H1'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            th.classList.add(`${text.toLowerCase()}-header`);
            header.insertBefore(th, header.lastElementChild);
        });
    }

    table.querySelectorAll('tbody tr').forEach(row => {
        if (!row.querySelector('.title-cell')) {
            const cells = ['title', 'description', 'h1'].map(cls => {
                const td = document.createElement('td');
                td.classList.add(`${cls}-cell`);
                const div = document.createElement('div');
                td.appendChild(div);
                row.insertBefore(td, row.lastElementChild);
                return div;
            });

            const link = row.cells[1]?.querySelector('a');
            if (link) {
                processUrl(link.href, cells[0], cells[1], cells[2]);
            } else {
                updateCell(cells[0], '-'); updateCell(cells[1], 'No link'); updateCell(cells[2], 'No link');
            }
        }
    });
};

// Refresh table based on updated skipDomains
const refreshTable = () => {
    document.querySelectorAll('#list-pages #myTable').forEach(table => {
        table.querySelectorAll('tbody tr').forEach(row => {
            const cellTitle = row.querySelector('.title-cell div');
            const cellDesc = row.querySelector('.description-cell div');
            const cellH1 = row.querySelector('.h1-cell div');
            const link = row.cells[1]?.querySelector('a');
            if (link) {
                processUrl(link.href, cellTitle, cellDesc, cellH1);
            } else {
                updateCell(cellTitle, '-'); updateCell(cellDesc, 'No link'); updateCell(cellH1, 'No link');
            }
        });
    });
};

// Initial processing
document.querySelectorAll('#list-pages #myTable').forEach(processTable);

// Observe mutations to handle dynamic changes
const observer2 = new MutationObserver(() => document.querySelectorAll('#list-pages #myTable').forEach(processTable));
observer2.observe(document.body, { childList: true, subtree: true });
