// ==UserScript==
// @name         A New Avatar
// @version      2025.11.27
// @license      GNU GPLv3
// @description  Neopets "Favorite Picker" for your avatars
// @match        https://www.neopets.com/settings/neoboards*
// @icon         https://images.neopets.com/new_shopkeepers/t_1900.gif
// @author       Posterboy
// @namespace    https://youtube.com/@Neo_Posterboy
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539371/A%20New%20Avatar.user.js
// @updateURL https://update.greasyfork.org/scripts/539371/A%20New%20Avatar.meta.js
// ==/UserScript==

(function () {
console.log("Avatar Selector: Script started");

// ==============
// Styling
// ==============

const styles = {
selectionDiv: {
position: "fixed",
top: "50%",
left: "50%",
transform: "translate(-50%, -50%)",
backgroundColor: "#fff",
borderRadius: "12px",
padding: "20px",
boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
zIndex: 10000,
display: "grid",
gridTemplateColumns: "repeat(4, 90px)",
gridTemplateRows: "repeat(3, 90px)",
gap: "15px",
minWidth: "400px",
userSelect: "none",
},
avatarImage: (selected) => ({
width: "80px",
height: "80px",
cursor: "pointer",
border: selected ? "5px solid #4CAF50" : "5px solid gray",
borderRadius: "8px",
boxSizing: "border-box",
}),
submitButton: {
marginTop: "15px",
cursor: "pointer",
width: "auto",
padding: "8px 16px",
position: "relative",
left: "50%",
transform: "translateX(-50%)",
},
exitButton: {
position: "absolute",
top: "15%",
right: "10px",
width: "55px",
height: "70%",
display: "flex",
alignItems: "center",
justifyContent: "center",
cursor: "pointer",
},
qButton: {
position: "absolute",
top: "-6px",
right: "-6px",
width: "22px",
height: "22px",
borderRadius: "50%",
backgroundColor: "rgba(255, 223, 0, 0.35)",
fontWeight: "bold",
display: "flex",
alignItems: "center",
justifyContent: "center",
cursor: "pointer",
border: "2px solid",
fontSize: "14px",
zIndex: 10
}
};


// ==============
// User Interface
// ==============

let avatarArray = [];
let selectionDiv = null;

const startTime = Date.now();
const interval = setInterval(() => {
const avatars = Array.from(document.querySelectorAll("img")).filter(img =>
img.src.includes("neopets.com/neoboards/avatars/")
);

if (avatars.length > 0 || Date.now() - startTime > 10000) {
createInitButton();
clearInterval(interval);
}
}, 500);

function createInitButton() {
if (document.getElementById("avatar-init-button")) return;

const btn = document.createElement("button");
btn.id = "avatar-init-button";
btn.textContent = "Avatar Picker";
btn.className = "settings-button";
Object.assign(btn.style, {
maxWidth: "200px",
marginLeft: "10px",
width: "100%",
boxSizing: "border-box"
});

btn.addEventListener("click", initializeAvatars);

const changeAvatarBtn = document.getElementById("avvie_btn");
if (changeAvatarBtn && changeAvatarBtn.parentNode) {
const wrapper = document.createElement("div");
wrapper.style.display = "flex";
wrapper.style.gap = "10px";
wrapper.style.alignItems = "flex-start";
changeAvatarBtn.parentNode.insertBefore(wrapper, changeAvatarBtn);
wrapper.appendChild(changeAvatarBtn);
wrapper.appendChild(btn);
} else {
document.body.appendChild(btn);
}
}

function showSelectionDiv(batch) {
removeSelectionDiv();

selectionDiv = document.createElement("div");
selectionDiv.className = "togglePopup__2020 movePopup__2020 invDesc";
Object.assign(selectionDiv.style, {
display: "block",
position: "fixed",
top: "50%",
left: "50%",
transform: "translate(-50%, -50%)",
zIndex: 10000,
minWidth: "450px"
});

const header = document.createElement("div");
header.className = "popup-header__2020";

const title = document.createElement("h3");
title.textContent = "Select Your Favorite(s)";
header.appendChild(title);

const exitBtn = document.createElement("div");
exitBtn.className = "inv-popup-exit button-default__2020 button-red__2020 popup-right-button__2020";
exitBtn.title = "Close";
Object.assign(exitBtn.style, styles.exitButton);
exitBtn.addEventListener("click", removeSelectionDiv);

const exitX = document.createElement("div");
exitX.className = "button-x__2020";
exitBtn.appendChild(exitX);
header.appendChild(exitBtn);

selectionDiv.appendChild(header);

const body = document.createElement("div");
body.className = "popup-body__2020";
body.style.maxHeight = "400px";
body.style.overflowY = "auto";

const grid = document.createElement("div");
grid.style.display = "grid";
grid.style.gridTemplateColumns = "repeat(4, 90px)";
grid.style.gridTemplateRows = "repeat(3, 90px)";
grid.style.gap = "15px";
grid.style.justifyContent = "center";
grid.style.userSelect = "none";

const batchState = new Map();
batch.forEach(a => batchState.set(a.src, false));

batch.forEach(a => {

const wrapper = document.createElement("div");
wrapper.style.position = "relative";
wrapper.style.width = "80px";
wrapper.style.height = "80px";

const img = document.createElement("img");
img.src = `${a.src}?t=${Date.now()}`;
img.title = a.alt || "No description";
Object.assign(img.style, styles.avatarImage(false));

img.addEventListener("click", () => {
const current = batchState.get(a.src);
batchState.set(a.src, !current);
Object.assign(img.style, styles.avatarImage(!current));
});

const qBtn = document.createElement("div");
qBtn.textContent = "?";
Object.assign(qBtn.style, styles.qButton);

qBtn.addEventListener("click", (event) => {
event.stopPropagation();
const query = encodeURIComponent(a.alt || "");
window.open(`https://www.jellyneo.net/?go=avatars&s=${query}`, "_blank");
});

wrapper.appendChild(img);
wrapper.appendChild(qBtn);
grid.appendChild(wrapper);
});

body.appendChild(grid);

const submitBtn = document.createElement("button");
submitBtn.textContent = "Submit";
submitBtn.className = "button-default__2020 button-yellow__2020";
Object.assign(submitBtn.style, styles.submitButton);

submitBtn.addEventListener("click", () => {
batch.forEach(a => {
a.tag = batchState.get(a.src) ? "selected" : "eliminated";
});
startEliminationRound();
});

body.appendChild(submitBtn);
selectionDiv.appendChild(body);
document.body.appendChild(selectionDiv);
}

function removeSelectionDiv() {
if (selectionDiv) {
selectionDiv.remove();
selectionDiv = null;
}
}

// ==============
// Background Functions
// ==============

function initializeAvatars() {
const avatars = Array.from(document.querySelectorAll("img")).filter(img =>
img.src.includes("neopets.com/neoboards/avatars/")
);

avatarArray = avatars.map(img => ({
src: img.src,
alt: img.alt || "",
tag: "selected"
}));


console.log("Avatar Selector: Found", avatarArray.length, "avatars");

if (avatarArray.length === 0) {
alert("No avatars found.");
} else {
startEliminationRound();
}
}

function getSelectedAvatars() {
return avatarArray.filter(a => a.tag === "selected");
}

function startEliminationRound() {
const remaining = getSelectedAvatars();
console.log("Avatar Selector: Starting elimination round, avatars left:", remaining.length);

if (remaining.length === 1) {
if (selectionDiv) {
while (selectionDiv.childNodes.length > 1) {
selectionDiv.removeChild(selectionDiv.lastChild);
}
} else {
selectionDiv = document.createElement("div");
document.body.appendChild(selectionDiv);
}

const body = document.createElement("div");
body.className = "popup-body__2020";
body.style.textAlign = "center";
body.style.padding = "20px";

const avatarImg = document.createElement("img");
avatarImg.src = remaining[0].src;
avatarImg.style.width = "80px";
avatarImg.style.height = "80px";
const message = document.createElement("p");
message.textContent = "Congratulations! This is your favorite avatar.";
message.style.fontWeight = "bold";

body.appendChild(avatarImg);
body.appendChild(message);
selectionDiv.appendChild(body);

return;
}

const batch = pickRandomBatch(remaining);
showSelectionDiv(batch);
}

function pickRandomBatch(selected) {
if (selected.length <= 12) return selected.slice();

const shuffled = [...selected];
for (let i = shuffled.length - 1; i > 0; i--) {
const j = Math.floor(Math.random() * (i + 1));
[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
}
return shuffled.slice(0, 12);
}
})();