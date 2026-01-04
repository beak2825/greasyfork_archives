// ==UserScript==
// @name         Cellcraft.io -EXP, Level and coins top left
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  smd
// @author       Attack
// @match        https://cellcraft.io/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495741/Cellcraftio%20-EXP%2C%20Level%20and%20coins%20top%20left.user.js
// @updateURL https://update.greasyfork.org/scripts/495741/Cellcraftio%20-EXP%2C%20Level%20and%20coins%20top%20left.meta.js
// ==/UserScript==

(() => {
    const divs = {},
    push = (...args) => {
        args.forEach(item => {
            divs[item] = document.createElement("div");
        });
    }, newStyle = text => {
        const style = document.createElement("style");
        style.innerText = text;
        document.head.appendChild(style);
    };
    String.prototype.toNumber = function() {
        return+`${this}`;
    };
    let exp;
    push(
        'menu',
        'level',
        'progressXP',
        'expBar',
        'progressCoins',
        'fix'
    );
    try {
        document.querySelector('.main-menu-shortcut').remove();
    } catch {
        throw new Error("That element doesn't exist! or has already been removed.");
    };

    divs.menu.classList.add(
        'main-menu-shortcut'
    );
    divs.level.id = '\x6ce\x76e\x6c2';
    divs.level.innerText = '\x30';
    divs.level.onclick = function() {
        try {
            window.closeAdvert();
        } catch {
            try {
                document.querySelector(".wrapper").style.display = 'block';
            } catch {};
        }
    };

    divs.fix.classList.add('\x6eo\x65V\x71y');

    divs.expBar.style = `display: none; flex-direction: column; padding: 10px; position: absolute; top: 125px; left: 10px; background-color: rgb(0 0 0 / 85%); border-radius: .5rem; color: #ddd; font-size: 15px;`;

    divs.progressXP.innerHTML = '<div class="progress-bar" style="height: 100%; background-color: rgb(47, 147, 255); color: rgb(255, 255, 255); font-size: 13px; display: flex; align-items: center; width: 50%;">50%</div>';
    divs.progressXP.classList.add(
        'progressXP'
    );
    divs.progressXP.onclick = function() {
        divs.expBar.style.display != 'flex' ? divs.expBar.style.display = 'flex' : divs.expBar.style.display = 'none';
    };

    divs.progressCoins.innerText = '\x30';
    divs.progressCoins.classList.add(
        'progress-bar-coins', 'progressCoins'
    );

    try {
        document.querySelector('.inner-overlays').appendChild(divs.menu);
    } catch {
        document.body.appendChild(divs.menu);
    };

    divs.menu.append(divs.level, divs.fix);
    divs.fix.append(divs.progressXP, divs.progressCoins);

    document.body.appendChild(divs.expBar);

    const toValue = text => {
        return `${text}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }, updateExpBar = () => {
        const level = document.getElementById("level"),
              progress = document.querySelector(".progress-bar");

        let levelExp = parseInt(level.innerText) * 1e3;

        exp = ~~((levelExp / 100) * parseFloat(progress.style.width));
        let x = `<div>Current Exp: ${toValue(exp)} / ${toValue(levelExp)}</div> <div>Exp until level up: ${toValue(level.innerText * 1e3 - exp)}</div> <div>Lifetime EXP: ${toValue((exp) + (parseInt(level.innerText) * (parseInt(level.innerText) - 1)) / 2 * (1e3))}</div>`;
        if(divs.expBar.innerHTML != x) {
            divs.expBar.innerHTML = x;
        } else return;
    };
    updateExpBar();

    setInterval(function() {
        updateExpBar();
        if(divs.progressXP.children[0].innerText != divs.progressXP.children[0].style.width) {
            divs.progressXP.children[0].innerText = divs.progressXP.children[0].style.width;
        } else return;
        divs.level.innerText.toNumber() >= 50 ? divs.level.style.background = 'linear-gradient(rgb(227, 118, 85) 50%, rgb(214, 98, 73) 50%)' : divs.level.style.background = 'linear-gradient(rgb(85, 146, 227) 50%, rgb(73, 133, 214) 50%)';
    }, 10);
    newStyle('#level2 { font-size: 18px; height: 50px; width: 50px; cursor: pointer; text-align: center; border: 2px solid rgb(71, 75, 86); border-radius: 4px; padding: 5px; background: linear-gradient(rgb(85, 146, 227) 50%, rgb(73, 133, 214) 50%); display: flex; align-items: center; justify-content: center; color: rgb(255, 255, 255); } .\x6eo\x65V\x71y { height: 51px; width: 132px; } .progressXP { overflow: hidden; border-radius: 2px; background-color: rgb(56, 58, 66); padding: 1px; box-shadow: rgb(46, 49, 56) 0px 0px 7px 2px inset; border: 1px solid rgb(63, 81, 181); width: 130px; height: 24.5px; margin-left: 1.5px; } .progressCoins { border: 1px solid rgb(222, 125, 0); background: linear-gradient(rgb(250, 199, 11) 50%, rgb(245, 200, 7) 50%); box-shadow: rgb(245, 194, 7) 0px 0px 2px 0px; height: 24.5px; width: 129px; border-radius: 1px; font-size: 13px; color: rgb(255, 255, 255); text-align: center; text-shadow: rgb(0, 0, 0) -1px -1px 0px, rgb(0, 0, 0) 1px -1px 0px, rgb(0, 0, 0) -1px 1px 0px, rgb(0, 0, 0) 1px 1px 0px; display: flex; align-items: center; justify-content: center; margin: 0px 0px 0px 2.5px; }');
})();