// ==UserScript==
// @name           Hornex Build Saver+
// @name:ja        hornex ビルド保存&配置スクリプト
// @namespace      http://tampermonkey.net/
// @version        3.0.2
// @description    Click button to save/load your build.
// @description:ja 左のボタンを押してビルドを保存＆配置できます。
// @author         AstRatJP
// @author         aragami070
// @match          https://hornex.pro/*
// @license        MIT
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/479070/Hornex%20Build%20Saver%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/479070/Hornex%20Build%20Saver%2B.meta.js
// ==/UserScript==

let numBuildsLimit = 10
let minNumBuilds = 1

/*
READ ME:
-The original script is by AstRatJP
-https://greasyfork.org/en/scripts/475349-hornex-build-saver
-Don't change the following codes unless you know what are you doing, they exist for a reason.
*/

let numBuilds = localStorage.getItem('HBSsavedNumBuilds');
if (!numBuilds) {
    localStorage.setItem(`HBSsavedNumBuilds`, 5);
    numBuilds = localStorage.getItem('HBSsavedNumBuilds');
}
const nameLenLimit = 50; //this is to prevent you being stupid and blow up your own pc by putting a whole essay

let rnames = [];
let sbuttons = []
let lbuttons = []

for (let i=1; i<=numBuildsLimit; i++) {
    let savedName = localStorage.getItem(`HBSr${i}savedname`);
    if (!savedName) {
        savedName = i.toString();
        localStorage.setItem(`HBSr${i}savedname`, savedName);
    }
    rnames.push(savedName)
}

console.log('Found saved build names: '+rnames)

let containerDiv = document.createElement('div');
containerDiv.style.width = '55px';
containerDiv.style.alignItems = 'start';
containerDiv.style.gridAutoFlow = 'column';
containerDiv.style.display = 'grid';
document.querySelector(".btn.shop-btn").before(containerDiv);

let addBTN = document.createElement('div');
addBTN.classList.add("btn");
addBTN.style.backgroundColor = "lime";
addBTN.textContent = "+";
addBTN.style.height = '7px';
addBTN.style.width = '7px';
addBTN.style.padding = '5px 5px';
addBTN.addEventListener('click', () => { addBuild() });
addBTN.addEventListener('touchstart', () => { addBuild() });
containerDiv.appendChild(addBTN);
let removeBBtn = document.createElement('div');
removeBBtn.classList.add("btn");
removeBBtn.style.backgroundColor = "red";
removeBBtn.textContent = "-";
removeBBtn.style.height = '7px';
removeBBtn.style.width = '7px';
removeBBtn.style.padding = '5px 5px';
removeBBtn.addEventListener('click', () => { removeBuild() });
removeBBtn.addEventListener('touchstart', () => { removeBuild() });
containerDiv.appendChild(removeBBtn);

// rename button
let renameBTN = document.createElement('div');
renameBTN.classList.add("btn");
renameBTN.style.backgroundColor = "#BBBBBB";
renameBTN.textContent = "Rename";
renameBTN.style.height = '10px'
renameBTN.addEventListener('click', () => { renameBuild() });
renameBTN.addEventListener('touchstart', () => { renameBuild() });
document.querySelector(".btn.shop-btn").before(renameBTN);

// toggle button
let toggleBTN = document.createElement('div');
toggleBTN.classList.add("btn");
toggleBTN.style.backgroundColor = "#BBBBBB";
toggleBTN.textContent = "Toggle";
toggleBTN.style.height = '10px'
toggleBTN.addEventListener('click', () => { toggleButton() });
toggleBTN.addEventListener('touchstart', () => { toggleButton() });
document.querySelector(".btn.shop-btn").before(toggleBTN);

// remove button
let removeBTN = document.createElement('div');
removeBTN.classList.add("btn");
removeBTN.style.backgroundColor = "tomato";
removeBTN.textContent = "Clear Row";
removeBTN.style.height = '10px'
removeBTN.addEventListener('click', () => { removePrimaryPetals() });
removeBTN.addEventListener('touchstart', () => { removePrimaryPetals() });
document.querySelector(".btn.shop-btn").before(removeBTN);

for (let i=1; i<=numBuilds; i++) {
    let buildS = document.createElement('div');
    buildS.classList.add("btn", `s${i}`, "hidden");
    buildS.textContent = `Save ${rnames[i-1]}`;
    buildS.style.height = '10px'
    buildS.addEventListener('click', () => { saveBuild(i) });
    buildS.addEventListener('touchstart', () => { saveBuild(i) });
    document.querySelector(".btn.shop-btn").before(buildS);
    sbuttons.push(buildS);
};

for (let i=1; i<=numBuilds; i++) {
    let buildL = document.createElement('div');
    buildL.classList.add("btn");
    buildL.textContent = rnames[i-1];
    buildL.style.height = '10px'
    buildL.addEventListener('click', () => { setBuild(i) });
    buildL.addEventListener('touchstart', () => { setBuild(i) });
    document.querySelector(".btn.shop-btn").before(buildL);
    lbuttons.push(buildL);
};

const styleHidden = document.createElement('style');
styleHidden.innerHTML = ".hidden { display: none !important; } ";
document.body.appendChild(styleHidden);

const input = document.querySelector('.chat-input');
const inputName = document.querySelector('.grid .nickname');
let chatFocus = false;
let nameFocus = false;
let mouseMoved = false;


input.addEventListener('focus', () => {
    chatFocus = true;
});
inputName.addEventListener('focus', () => {
    nameFocus = true;
});
input.addEventListener('blur', () => {
    chatFocus = false;
})
inputName.addEventListener('blur', () => {
    nameFocus = false;
});
document.addEventListener('mousemove', () => {
    mouseMoved = true;
});


async function removePrimaryPetals() {
    const elements = Array.from(document.querySelectorAll(".petals:not(.small) .petal.empty .petal"));
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const slot = document.querySelector(".petal-rows");
        const longPressEvent = new MouseEvent("mousedown", {
            bubbles: true,
            cancelable: true,
            view: window,
            buttons: 1,
            button: 0,
        });
        const mouseUpEvent = new MouseEvent("mouseup", {
            bubbles: true,
            cancelable: true,
            view: window,
            buttons: 0,
        });
        element.dispatchEvent(longPressEvent);
        const top = element.style.top;
        const left = element.style.left;


        const endTime = Date.now() + 500;
        mouseMoved = false;
        while (Date.now() < endTime) {
            if (mouseMoved) {
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 1));
        }



        let slotTop = slot.style.top;
        slot.style.top = "0%";
        element.dispatchEvent(mouseUpEvent);
        slot.style.top = slotTop;
    }
}


async function removeAllPetals() {
    const elements = Array.from(document.querySelectorAll(".petals .petal.empty .petal"));
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const slot = document.querySelector(".petal-rows");
        const longPressEvent = new MouseEvent("mousedown", {
            bubbles: true,
            cancelable: true,
            view: window,
            buttons: 1,
            button: 0,
        });
        const mouseUpEvent = new MouseEvent("mouseup", {
            bubbles: true,
            cancelable: true,
            view: window,
            buttons: 0,
        });
        element.dispatchEvent(longPressEvent);
        const top = element.style.top;
        const left = element.style.left;


        const endTime = Date.now() + 500;
        mouseMoved = false;
        while (Date.now() < endTime) {
            if (mouseMoved) {
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 1));
        }



        let slotTop = slot.style.top;
        slot.style.top = "0%";
        element.dispatchEvent(mouseUpEvent);
        slot.style.top = slotTop;
    }
}





function saveBuild(i) {
    let petalPosition = "";
    let tier = "";
    const petals = Array.from(document.querySelectorAll(".petals .petal.empty .petal"));
    const savedBuild = [];
    for (let i = 0; i < petals.length; i++) {
        if (petals[i].classList.item(2) === "no-icon" || petals[i].classList.item(3) === "no-icon") {
            petalPosition = petals[i].querySelector(".petal-icon").style.backgroundPosition;
        } else {
            petalPosition = petals[i].style.backgroundPosition;
        }
        if (petals[i].classList.item(1) === "spin") {
            tier = petals[i].classList.item(2);
        } else {
            tier = petals[i].classList.item(1);
        }
        savedBuild.push(petalPosition, tier);
    }
    localStorage.setItem(`savedBuild${i}`, JSON.stringify(savedBuild));
    if (document.querySelector(`.s${i}`).textContent !== "Saved!") {
        const oldText = document.querySelector(`.s${i}`).textContent.toString();
        document.querySelector(`.s${i}`).textContent = "Saved!";
        setTimeout(()=>{ document.querySelector(`.s${i}`).textContent = oldText; }, 1000);
    }
}


function setPetal(petalPosition, tier) {
    const petal = document.querySelector(`.common [style*="background-position: ${petalPosition}"].${tier}`);

    const longPressEvent = new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
        view: window,
        buttons: 1,
        button: 0,
    });
    const mouseUpEvent = new MouseEvent("mouseup", {
        bubbles: true,
        cancelable: true,
        view: window,
        buttons: 0,
    });
    petal.dispatchEvent(longPressEvent);
    petal.dispatchEvent(mouseUpEvent);
}

function closeInventory() {
    const closeBtn = document.querySelector(".dialog.inventory .btn.close-btn");

    const clickEvent = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true
    });
    closeBtn.dispatchEvent(clickEvent);
}

async function setBuild(i) {
    const savedBuild = JSON.parse(localStorage.getItem(`savedBuild${i}`));
    await removeAllPetals();
    for (let i = 0; i < savedBuild.length; i += 2) {
        setPetal(savedBuild[i], savedBuild[i + 1]);
    }
    await closeInventory();
}

function renameBuild() {
    let build = prompt('Build no. to rename: ');
    build = parseInt(build);
    if ( build===null ) { return; } else if ( build>parseInt(localStorage.getItem('HBSsavedNumBuilds')) || build<1 || isNaN(build) ) {
        alert('Invalid build #!');
        return;
    }

    const name = prompt('New name: ');
    if ( name===null ) { return; } else if ( name.length > nameLenLimit) {
        alert('Too long!');
        return;
    }

    localStorage.setItem(`HBSr${build}savedname`, name)

    sbuttons[build-1].textContent = 'Save '+name;
    lbuttons[build-1].textContent = name;

    console.log(`Successfully renamed build ${build} to ${name}`)
}

function toggleButton() {
    for (let i=0; i<=(parseInt(localStorage.getItem('HBSsavedNumBuilds'))-1); i++) {
        sbuttons[i].classList.toggle('hidden');
        lbuttons[i].classList.toggle('hidden');
    };
}

function addBuild() {
    const currentNumBuilds = parseInt(localStorage.getItem('HBSsavedNumBuilds'));
    if (currentNumBuilds>=numBuildsLimit) {
        localStorage.setItem(`HBSsavedNumBuilds`, numBuildsLimit);
        return;
    }
    localStorage.setItem(`HBSsavedNumBuilds`, currentNumBuilds+1);
    let buildS = document.createElement('div');
    buildS.classList.add("btn", `s${currentNumBuilds+1}`, "hidden");
    buildS.textContent = `Save ${localStorage.getItem(`HBSr${currentNumBuilds+1}savedname`)}`;
    buildS.style.height = '10px'
    buildS.addEventListener('click', () => { saveBuild(currentNumBuilds+1) });
    buildS.addEventListener('touchstart', () => { saveBuild(currentNumBuilds+1) });
    document.querySelector(".btn.shop-btn").before(buildS);
    sbuttons.push(buildS);
    let buildL = document.createElement('div');
    buildL.classList.add("btn");
    buildL.textContent = localStorage.getItem(`HBSr${currentNumBuilds+1}savedname`);
    buildL.style.height = '10px'
    buildL.addEventListener('click', () => { setBuild(currentNumBuilds+1) });
    buildL.addEventListener('touchstart', () => { setBuild(currentNumBuilds+1) });
    document.querySelector(".btn.shop-btn").before(buildL);
    lbuttons.push(buildL);
    console.log('added 1 build')
}

function removeBuild() {
    const currentNumBuilds = parseInt(localStorage.getItem('HBSsavedNumBuilds'));
    if (currentNumBuilds<=minNumBuilds) {
        localStorage.setItem(`HBSsavedNumBuilds`, minNumBuilds);
        return;
    }
    localStorage.setItem(`HBSsavedNumBuilds`, currentNumBuilds-1);
    sbuttons[currentNumBuilds-1].remove();
    lbuttons[currentNumBuilds-1].remove();
    sbuttons.pop();
    lbuttons.pop();
    console.log('removed 1 build')
}