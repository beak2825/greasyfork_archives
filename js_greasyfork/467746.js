// ==UserScript==
// @name         Auction Copy
// @namespace    m0tch.torn.auctionCopy
// @version      0.1
// @description  Add button in Auction House to copy details
// @author       m0tch
// @run-at       document-end
// @grant        GM_addStyle
// @match        https://www.torn.com/amarket.php*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467746/Auction%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/467746/Auction%20Copy.meta.js
// ==/UserScript==

GM_addStyle(`
.m0tch-btn {
    height: 17px;
    line-height: 17px;
}

.m0tch-btn:active, .m0tch-btn:disabled, .m0tch-btn.disabled, a.m0tch-btn:active, a.m0tch-btn.disabled, a.m0tch-btn.disabled:active {
    height: 17px;
    line-height: 18px;
}
`);


function addCopyButtons(node){
    console.log(node);
    if (!node) return;
    // if (document.getElementById("rank-container")) return;
    let numMembers = document.querySelectorAll(".items-list")[0].children.length - 1;
    if(document.querySelectorAll(".items-list")[0].querySelectorAll('.ajax-preloader').length != 20){
        return;
    }

    let list = document.querySelectorAll(".items-list")[0]

    for (var i = 0; i < numMembers; i++){
        let itemContent = list?.children[i];
        var item = document.createElement("button");
        item.className = "torn-btn m0tch-btn";
        item.innerText = "Copy";
        item.addEventListener("click", () => {
            let name = itemContent.querySelector(".item-name").innerText;
            let dmg = itemContent.querySelector(".bonus-attachment-item-damage-bonus").parentElement.lastChild.innerText;
            let acc = itemContent.querySelector(".bonus-attachment-item-accuracy-bonus").parentElement.lastChild.innerText;
            let timeLeft = itemContent.querySelector(".dh-time").innerText;

            let icons = itemContent.querySelectorAll(".bonus-attachment-icons");
            var bonus = "";
            for (let i = 0; i < icons.length; i++) {
                var bname = icons[i].title.split('>')[1].split('<')[0]
                var value = icons[i].title.split('%')[0].split('>')[3] + "% "

                if (bname == 'Irradiate' || bname == 'Smash') {
                    value = ''
                }
                else if (bname == 'Disarm') {
                    value = icons[i].title.split(' turns')[0].split('for ')[1] + " T "
                }
                else if (bname == 'Bloodlust') {
                    value = icons[i].title.split(' of')[0].split('by ')[1] + " "

                }
                else if (bname == 'Execute') {
                    value = icons[i].title.split(' life')[0].split('below ')[1] + " "
                }
                else if (bname == 'Penetrate') {
                    value = icons[i].title.split(' of')[0].split('Ignores ')[1] + " "
                }
                else if (bname == 'Eviscerate') {
                    value = icons[i].title.split(' extra')[0].split('them ')[1] + " "
                }
                if (i > 0){
                    bonus += " + ";
                }
                bonus += value + bname;
            }
            navigator.clipboard.writeText(bonus + " " + name + " (" + dmg + " dmg, " + acc + " acc) in AH with " + timeLeft + " left");
        });
        var timeWrapper = itemContent?.querySelector(".time-wrap");
        if (timeWrapper) {
            timeWrapper.appendChild(item);
        }
    }
}

new MutationObserver(mutations => {
    console.log(mutations.length + " mutations occurred");
    console.log(document.querySelector(".items-list"))
    for (var mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Check if the added nodes are within the elements to be ignored
                var ignoredElements = document.querySelectorAll('.hasCountdown');
                for (var i = 0; i < ignoredElements.length; i++) {
                    if (ignoredElements[i].contains(mutation.target)) {
                        // Ignore changes within the specified elements
                        return;
                    }
                }
            }
        }
        addCopyButtons(document.querySelector && document.querySelector(".items-list"));
}).observe(document.querySelector(".items-list"), {childList: true, subtree: false});