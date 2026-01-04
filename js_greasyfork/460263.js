// ==UserScript==
// @name         [BROKEN] Arras.io - Start Menu Modifier
// @version      1.6
// @description  [BROKEN] Makes the start menu better to look at, adds a setting to hide empty servers, shows hidden servers.
// @author       Taureon
// @run-at       document-end
// @match        https://arras.io/
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace https://greasyfork.org/users/935758
// @downloadURL https://update.greasyfork.org/scripts/460263/%5BBROKEN%5D%20Arrasio%20-%20Start%20Menu%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/460263/%5BBROKEN%5D%20Arrasio%20-%20Start%20Menu%20Modifier.meta.js
// ==/UserScript==

//What would I need to do to become part of the development team?
//-Taureon

//see all servers
try {
let k = JSON.parse(GM_getValue('arras.io', '{}'));
k.privilege = 10;
GM_setValue('arras.io', JSON.stringify(k));
} catch (err) {
    console.log('no privilege', err);
}

window.addEventListener("load", ()=>{

//unused element that takes up space
document.querySelector(".menuTabs").remove();

//default by having the changelog tab selected instead
document.querySelector("#changelogTabs").children[3].click();

//add UI for the server hider
let empties = [],
    span = document.createElement("span"),
    check = document.createElement("input");
span.innerText = "Hide empty Servers";
span.style.display = "flex";
check.type = "checkbox";
check.checked = !!localStorage.getItem("hideEmptyServers");
check.style.width = "13px";
check.style.height = "13px";
check.style.marginTop = "0px";
check.style.marginBottom = "0px";
check.oninput = () => {
    empties.forEach((x) => (x.hidden = check.checked));
    localStorage.setItem("hideEmptyServers", check.checked ? " " : "");
};
span.append(check);
document.getElementById("serverFilterRegion").append(span);
document.getElementById("serverFilterRegion").style.display = "flex";

let setHeight = (style, x) => style.maxHeight = style.height = x,
    doThing = () => {
        try {
            empties = Array.from(document.getElementById("serverSelector").children).slice(1).filter((x) => x.children[2].innerText.split("/")[0] == "0");
            check.oninput();

            let rules = Array.from(Array.from(document.styleSheets).find((x) => x.href.includes("arras")).rules);

            for (let ruleName of [".serverSelector", ".slider", ".sliderHolder", ".startMenuHolder", ".startMenuHolder.changelogHolder", ".startMenu", ".mainWrapper", ".shadowScroll", "#startMenuSlidingTrigger", "#startMenuWrapper", "#patchNotes"]) {
                let style = rules.find((x) => x.selectorText == ruleName).style;

                switch (ruleName) {
                    case ".serverSelector":
                        setHeight(style, "calc(100% - 159px)");
                        break;
                    case ".slider":
                        setHeight(style, "min-content");
                        break;
                    case ".sliderHolder":
                        setHeight(style, "calc(100% - 50px)");
                        break;
                    case ".startMenuHolder":
                        setHeight(style, "calc(100% - 20px)");
                        break;
                    case "#startMenuSlidingTrigger":
                        style.padding = "10px";
                        break;
                    case ".startMenuHolder.changelogHolder":
                        setHeight(style, "calc(100% - 20px)");
                        style.display = "block";
                        break;
                    case ".startMenu":
                        setHeight(style, "calc(100%)");
                        break;
                    case "#startMenuWrapper":
                        setHeight(style, "calc(100% - 20px)");
                        break;
                    case "#patchNotes":
                        setHeight(style, "calc(100% - 39px)");
                        break;
                    case ".mainWrapper":
                        style.padding = "20px 20px 20px 20px";
                        setHeight(style, "calc(100% - 40px)");
                        break;
                    case ".shadowScroll":
                        style.background = style.backgroundSize = style.backgroundColor = style.backgroundRepeat = style.backgroundAttachment = "";
                }
            }

            //When you're using document.querySelector()
            // https://youtu.be/mdquYEw36TU
            setHeight(document.querySelector("#startMenuWrapper > div > div.startMenuHolder.mainHolder > div.sliderHolder > div:nth-child(1)").style, "calc(100% - 315px)");
        } catch (err) {}
    };

doThing();
setInterval(doThing, 1000);

});