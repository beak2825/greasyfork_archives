// ==UserScript==
// @name         SimpDex Simple Social Dex
// @namespace    https://michde.com
// @version      0.0.0.419
// @description  Make manage and export/import notes across X, Threads, and BlueSky
// @author       @ManInTheDot.com aka @MichDe.com
// @match        https://www.threads.net/*
// @match        https://x.com/*
// @match        https://bsky.app/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520466/SimpDex%20Simple%20Social%20Dex.user.js
// @updateURL https://update.greasyfork.org/scripts/520466/SimpDex%20Simple%20Social%20Dex.meta.js
// ==/UserScript==
(function () {
'use strict';
const storageKey = "ssdxNotes";
const notes = JSON.parse(localStorage.getItem(storageKey) || "{}");
let currentUrl = window.location.href;
function saveNotes() {
localStorage.setItem(storageKey, JSON.stringify(notes));
}
function parsePage() {
const url = window.location.href;
if (url.includes("threads.net")) {
const match = url.match(/@([^\/]+)(\/post\/([^\/]+))?/);
return match
? { site: "threads", type: match[3] ? "post" : "profile", username: `@${match[1]}`, id: match[3] || null }
: null;
}
if (url.includes("x.com")) {
const excludedPaths = ["/messages", "/notifications", "/explore", "/i", "/bookmarks", "/home", "/jobs", "/settings"];
if (excludedPaths.some((path) => url.startsWith(`https://x.com${path}`))) {
return null;
}
const match = url.match(/x\.com\/([^\/]+)(\/status\/(.+))?/);
return match
? { site: "x", type: match[3] ? "status" : "profile", username: match[1], id: match[3] || null }
: null;
}
if (url.includes("bsky.app")) {
const match = url.match(/profile\/([^\/]+)(\/post\/([^\/]+))?/);
return match
? { site: "bsky", type: match[3] ? "post" : "profile", username: match[1], id: match[3] || null }
: null;
}
return null;
}
function generateKey(data) {
return `${data.site}:${data.type}:${data.username}${data.id ? `:${data.id}` : ""}`;
}
function capitalize(str) {
return str.charAt(0).toUpperCase() + str.slice(1);
}
function parseKey(key) {
const parts = key.split(":");
return {
site: parts[0],
type: parts[1],
username: parts[2],
id: parts[3] || null
};
}
function constructUrl(site, type, username, content) {
let baseUrl = "";
switch (site) {
case "threads":
baseUrl = "https://www.threads.net/";
break;
case "x":
baseUrl = "https://x.com/";
break;
case "bsky":
baseUrl = "https://bsky.app/profile/";
break;
default:
return null;
}
if (type === "post") {
return content ? `${baseUrl}${username}/post/${content}` : `${baseUrl}${username}`;
}
if (type === "status") {
return content ? `${baseUrl}${username}/status/${content}` : `${baseUrl}${username}`;
} else {
return `${baseUrl}${username}`;
}
}
function renderNotesPane(data) {
const existingPane = document.querySelector("#ssdxNotesPane");
if (existingPane) existingPane.remove();
const pane = document.createElement("div");
pane.id = "ssdxNotesPane";
pane.setAttribute('style',
'position: fixed; bottom: 69px; right: 69px; background: silver; color: darkslateblue; ' +
'border: 1px solid gold; padding: 0.5em; max-width: 640px; font-family: Consolas, monospace; ' +
'box-shadow: 0 3px 6px rgba(0,0,0,0.3); z-index: 9999; overflow-y: auto; max-height: 86vh;'
);
if (data) {
const key = generateKey(data);
const note = notes[key] || {
linkedUsernames: { threads: "", x: "", bsky: "" },
notes: "",
tags: ""
};
const createLabeledInput = (labelText, id, value, placeholder, width = "95%") => {
const label = document.createElement("label");
label.textContent = labelText;
pane.appendChild(label);
pane.appendChild(document.createElement("br"));
const input = document.createElement("input");
input.type = "text";
input.id = id;
input.value = value || '';
input.placeholder = placeholder || '';
input.style.width = width;
pane.appendChild(input);
pane.appendChild(document.createElement("br"));
return input;
};
const dataInput = createLabeledInput("Data:", "sdxData", key, "", "95%");
dataInput.readOnly = true;
const threadsInput = createLabeledInput("Linked Usernames:", "sdxThreads",
note.linkedUsernames.threads, "Threads");
const xInput = createLabeledInput("", "sdxX",
note.linkedUsernames.x, "X");
const bskyInput = createLabeledInput("", "sdxBsky",
note.linkedUsernames.bsky, "Bluesky");
const notesLabel = document.createElement("label");
notesLabel.textContent = "Notes:";
pane.appendChild(notesLabel);
pane.appendChild(document.createElement("br"));
const notesTextarea = document.createElement("textarea");
notesTextarea.id = "sdxNotes";
notesTextarea.rows = 5;
notesTextarea.style.width = "95%";
notesTextarea.textContent = note.notes || '';
pane.appendChild(notesTextarea);
pane.appendChild(document.createElement("br"));
const tagsInput = createLabeledInput("Tags:", "sdxTags", note.tags);
const createButton = (text, onClick, marginRight = "5px") => {
const button = document.createElement("button");
button.textContent = text;
button.style.marginRight = marginRight;
button.addEventListener("click", onClick);
pane.appendChild(button);
return button;
};
createButton("Save", () => {notes[key] = {
linkedUsernames: {
threads: threadsInput.value.trim(),
x: xInput.value.trim(),
bsky: bskyInput.value.trim(),
},
notes: notesTextarea.value.trim(),
tags: tagsInput.value.trim(),
};saveNotes();pane.remove();});
createButton("Delete", () => {delete notes[key];saveNotes();pane.remove();});
createButton("Close", () => pane.remove());
createButton("All", () => renderNotesPane(null));
} else {
const titleHeader = document.createElement("h3");
titleHeader.textContent = "Notes";
pane.appendChild(titleHeader);
const filterContainer = document.createElement("div");
filterContainer.style.marginBottom = "10px";
const filterLabel = document.createElement("label");
filterLabel.textContent = "Filter by site: ";
filterContainer.appendChild(filterLabel);
const siteFilter = document.createElement("select");
siteFilter.style.marginLeft = "5px";
["All", "Threads", "X", "BlueSky"].forEach(option => {
const opt = document.createElement("option");
opt.value = option.toLowerCase();
opt.textContent = option;
siteFilter.appendChild(opt);
});
filterContainer.appendChild(siteFilter);
pane.appendChild(filterContainer);
const notesContainer = document.createElement("div");
notesContainer.id = "notesContainer";
pane.appendChild(notesContainer);
function renderFilteredNotes(filter) {
while (notesContainer.firstChild) {
notesContainer.removeChild(notesContainer.firstChild);
}
const filteredEntries = Object.entries(notes).filter(([key]) => {
if (filter === "all") return true;
return key.startsWith(filter.toLowerCase());
});
if (filteredEntries.length === 0) {
const noNotes = document.createElement("div");
noNotes.textContent = "No notes available for the selected filter.";
notesContainer.appendChild(noNotes);
return;
}
filteredEntries.forEach(([key, entry]) => {
const [site, type, profile, content] = key.split(":");
const noteDiv = document.createElement("div");
noteDiv.style.border = "1px solid gold";
noteDiv.style.padding = "10px";
noteDiv.style.marginBottom = "10px";
noteDiv.style.borderRadius = "5px";
noteDiv.style.backgroundColor = "ghostwhite";
const headerEl = document.createElement("strong");
headerEl.textContent = `${capitalize(site)} | ${capitalize(type)} | ${profile}`;
noteDiv.appendChild(headerEl);
if (content) {
const contentEl = document.createElement("div");
contentEl.textContent = `Content ID: ${content}`;
noteDiv.appendChild(contentEl);
}
const usernameText = Object.entries(entry.linkedUsernames)
.filter(([, username]) => username)
.map(([platform, username]) => `${capitalize(platform)}: ${username}`)
.join(", ");
const detailsContainer = document.createElement("div");
detailsContainer.style.marginTop = "5px";
const createDetailElement = (label, value) => {
const el = document.createElement("div");
el.textContent = `${label}: ${value || ''}`;
return el;
};
detailsContainer.appendChild(createDetailElement("Notes", entry.notes));
detailsContainer.appendChild(createDetailElement("Tags", entry.tags));
detailsContainer.appendChild(createDetailElement("Usernames", usernameText || 'No linked usernames'));
noteDiv.appendChild(detailsContainer);
const buttonContainer = document.createElement("div");
buttonContainer.style.marginTop = "10px";
const createNoteButton = (text, onClick) => {
const btn = document.createElement("button");
btn.textContent = text;
btn.style.marginRight = "5px";
btn.addEventListener("click", onClick);
buttonContainer.appendChild(btn);
};
createNoteButton("Edit", () => renderNotesPane(parseKey(key)));
createNoteButton("Delete", () => {
delete notes[key];
saveNotes();
renderFilteredNotes(siteFilter.value);
});
createNoteButton("Go To", () => {
const url = constructUrl(site, type, profile, content);
if (url) window.open(url, "_blank");
});
noteDiv.appendChild(buttonContainer);
notesContainer.appendChild(noteDiv);
});
}
renderFilteredNotes("all");
siteFilter.addEventListener("change", () => {
const selectedSite = siteFilter.value === "all" ? "all" : siteFilter.value.toLowerCase();
renderFilteredNotes(selectedSite);
});
const actionContainer = document.createElement("div");
actionContainer.style.marginTop = "10px";
const createActionButton = (text, onClick) => {
const btn = document.createElement("button");
btn.textContent = text;
btn.style.marginRight = "5px";
btn.addEventListener("click", onClick);
actionContainer.appendChild(btn);
};
createActionButton("Export Notes", exportNotes);
createActionButton("Import Notes", () => {
const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.accept = ".csv";
fileInput.addEventListener("change", (event) => {
const file = event.target.files[0];
if (file) {
const reader = new FileReader();
reader.onload = (e) => importNotes(e.target.result);
reader.readAsText(file);
}
});
fileInput.click();
});
pane.appendChild(actionContainer);
const closeButton = document.createElement("button");
closeButton.textContent = "Close";
closeButton.style.display = "block";
closeButton.style.marginTop = "10px";
closeButton.addEventListener("click", () => pane.remove());
pane.appendChild(closeButton);
}
document.body.appendChild(pane);
}
function exportNotes() {
const header = "site|profile|content|usernames|notes|tags";
const rows = [header];
Object.entries(notes).forEach(([key, entry]) => {
const [site, type, profile, content = ""] = key.split(":");
const sanitizedNotes = (entry.notes || "").replace(/\|/g, " ").replace(/\n/g, " ");
const sanitizedTags = (entry.tags || "").replace(/\|/g, " ").replace(/\n/g, " ");
const sanitizedUsernames = JSON.stringify(entry.linkedUsernames || {}).replace(/\|/g, " ");
const row = [
site,
profile.replace(/^@/, ""),
content,
sanitizedUsernames,
sanitizedNotes,
sanitizedTags,
].join("|");
rows.push(row);
});
const csv = rows.join("\n");
const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
const url = URL.createObjectURL(blob);
const link = document.createElement("a");
link.href = url;
link.download = "ssdx_notes_export.csv";
link.click();
URL.revokeObjectURL(url);
}
function importNotes(csvText) {
const lines = csvText.split("\n");
const header = lines.shift().trim();
if (header !== "site|profile|content|usernames|notes|tags") {
alert("Invalid CSV format. Please ensure the header is correct.");
return;
}
lines.forEach((line, index) => {
if (!line.trim()) return;
const [site, profile, content, usernames, notesText, tags] = splitCSVLine(line);
if (!site || !profile) {
console.warn(`Skipping invalid row ${index + 2}: Missing site or profile.`);
return;
}
const key = `${site}:${content ? (site === "x" ? "status" : "post") : "profile"}:${site === "threads" ? "@" + profile : profile}${content ? `:${content}` : ""}`;
try {
const parsedUsernames = JSON.parse(usernames || "{}");
notes[key] = {
linkedUsernames: parsedUsernames,
notes: notesText || "",
tags: tags || "",
};
} catch (error) {
console.error(`Error parsing usernames JSON on row ${index + 2}:`, error);
}
});
saveNotes();
alert("Notes successfully imported.");
renderNotesPane(null);
}
function splitCSVLine(line) {
const parts = [];
let current = '';
let inQuotes = false;
for (let i = 0; i < line.length; i++) {
const char = line[i];
if (char === '"' && (i === 0 || line[i - 1] !== '\\')) {
inQuotes = !inQuotes;
} else if (char === '|' && !inQuotes) {
parts.push(current);
current = '';
} else {
current += char;
}
}
parts.push(current);
return parts.map(part => part.replace(/\\n/g, '\n').trim());
}
function addNoteButton(data) {
const existingButton = document.querySelector("#noteButton");
if (existingButton) existingButton.remove();
const btn = document.createElement("button");
btn.id = "noteButton";
const key = data ? generateKey(data) : null;
const hasNote = key && notes[key];
btn.textContent = data ? "+Note" : "=Note";
btn.setAttribute('style',
'position: fixed; bottom: 210px; right: 42px; background: ' +
(data ? (hasNote ? "springgreen" : "skyblue") : "silver") + '; ' +
'color: whitesmoke; padding: 9px; border: 1px solid gold; border-radius: 3px; cursor: pointer; ' +
'z-index: 9998;'
);
btn.addEventListener("click", () => renderNotesPane(data));
document.body.appendChild(btn);
}
function monitorUrlChanges() {
setInterval(() => {
if (window.location.href !== currentUrl) {
currentUrl = window.location.href;
const existingPane = document.querySelector("#ssdxNotesPane");
if (existingPane) existingPane.remove();
const data = parsePage();
addNoteButton(data);
}
}, 500);
}
function init() {
const data = parsePage();
addNoteButton(data);
monitorUrlChanges();
}
init();
})();