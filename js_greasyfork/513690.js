// ==UserScript==
// @name         Quick Loan & Retrieve
// @namespace    http://tampermonkey.net/
// @version      2024-10-27
// @description  Allows for a faction lead to quickly retrieve and reloan weapons. Please note that it stores it locally in the browser.
// @author       olesien
// @match        https://www.torn.com/factions.php?step=your*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513690/Quick%20Loan%20%20Retrieve.user.js
// @updateURL https://update.greasyfork.org/scripts/513690/Quick%20Loan%20%20Retrieve.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle ( `
     .c-retrieve-btn-container {
        display: flex;
        align-items: center;
        float: right;
     }

     .c-retrieve-btn {
        color: red;
        text-align: center;
        margin-left: auto;
        margin-top: 5px;
        padding: 10px;
        border-radius: 5px;
     }

     .c-retrieve-btn:hover {
        cursor: pointer;
        color: darkred;
     }
    `);
    let watchingFac = false;

    let obv2 = null;

    const loanedOut = JSON.parse(localStorage.getItem("armory-quick-loan") ?? "[]");

    const storeUser = (pid, pname, armoryid) => {
        const existingIndex = loanedOut.findIndex(item => item.armoryid == armoryid);
        if (existingIndex >= 0) {
            loanedOut.splice(existingIndex, 1, {pid, pname, armoryid});
        } else {
            loanedOut.push({pid, pname, armoryid});
        }
        localStorage.setItem("armory-quick-loan", JSON.stringify(loanedOut));
    }

    const findByArmoryId = (armoryid) => {
        return loanedOut.find(item => item.armoryid === armoryid);
    }

    const loan = async (armoryId, itemId, playerName, playerId) => {
        await fetch("https://www.torn.com/factions.php?rfcv=" + getRFC(), {
            "credentials": "include",
            "headers": {
                "Accept": "*/*",
                "Accept-Language": "en-US,en;q=0.5",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                "Priority": "u=0"
            },
            "referrer": window.location.href,
            "body": `ajax=true&step=armouryActionItem&role=loan&item=${armoryId}&itemID=${itemId}&user=${playerName}+%5B${playerId}%5D&quantity=1`,
            "method": "POST",
            "mode": "cors"
        });

        //                     success	true
        // text	"You loaned <b>1x AK74U</b> to yourself from the faction's armory."
    }

    const retrieve = async (armoryId, itemId, playerName, playerId) => {
        await fetch("https://www.torn.com/factions.php?rfcv=" + getRFC(), {
            "credentials": "include",
            "headers": {
                "Accept": "*/*",
                "Accept-Language": "en-US,en;q=0.5",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                "Priority": "u=0"
            },
            "referrer": window.location.href,
            "body": `ajax=true&step=armouryActionItem&role=retrieve&item=${armoryId}&itemID=${itemId}&user=${playerName}+%5B${playerId}%5D`,
            "method": "POST",
            "mode": "cors"
        });
        //                     success	true
        // text	"You retrieved <b>1x 9mm Uzi</b> from <a href="/profiles.php?XID=2187764" target="_parent">olesien</a>"
    }

    const addButtons = (item, itemAction) => {
        const retrieveOrLoan = itemAction.children[0];
        const newElement = document.createElement("p");
        newElement.role = "button";
        newElement.classList.add("active");
        newElement.classList.add("retrieve");
        const imgWrap = item.querySelector(".img-wrap"); //data-armoryid data-itemid
        const itemId = imgWrap.dataset.itemid;
        const armoryId = imgWrap.dataset.armoryid;

        const loanedEl = item.querySelector(".loaned");
        if (retrieveOrLoan.innerText.includes("Loan") || retrieveOrLoan.innerText.includes("Return")) {
            //Alter loan logic


            const existing = findByArmoryId(armoryId);

            if (existing) {
                newElement.innerText = "Return";
                newElement.style.color = "green";
                newElement.addEventListener("click", () => {
                    const playerId = existing.pid;
                    const playerName = existing.pname;
                    loan(armoryId, itemId, playerName, playerId);
                    //Change a tag
                    const newATag = document.createElement("a");
                    newATag.classList.add("h");
                    newATag.classList.add("t-blue");
                    newATag.href = "/profiles.php?XID=" + playerId;
                    newATag.innerText = playerName;
                    loanedEl.innerText = "";
                    loanedEl.appendChild(newATag);
                    newElement.innerText = "Retrieve";

                    const give = item.querySelector(".give");
                    const checkBoxContainer = item.querySelector(".checkbox-container");
                    if (give && checkBoxContainer) {
                        const input = checkBoxContainer.querySelector("input");
                        give.classList.remove("active"); //Note that this doesn't actually work
                        checkBoxContainer.classList.remove("active");
                        input.disabled = true;
                    }
                    addButtons(item, itemAction);

                });


                itemAction.insertBefore(newElement, itemAction.firstChild);
                retrieveOrLoan.remove();
            }



        } else {
            const loanedATag = loanedEl.querySelector("a");
            if (loanedATag) {
                //Alter retrieve logic
                newElement.innerText = "Retrieve";
                newElement.addEventListener("click", () => {
                    //Store the user for later
                    const pid = Number(loanedATag.href.replace(/\D/g,''));
                    const pname = loanedATag.innerText;
                    retrieve(armoryId, itemId, pname, pid);
                    storeUser(pid, pname, armoryId);
                    loanedATag.remove();
                    loanedEl.innerText = "Available";
                    newElement.innerText = "Loan";

                    const give = item.querySelector(".give");
                    const checkBoxContainer = item.querySelector(".checkbox-container");
                    if (give && checkBoxContainer) {
                        const input = checkBoxContainer.querySelector("input");
                        give.classList.add("active"); //Note that this doesn't actually work
                        checkBoxContainer.classList.add("active");
                        input.disabled = false;
                    }

                    addButtons(item, itemAction, pid, pname);
                });
                itemAction.insertBefore(newElement, itemAction.firstChild);
                retrieveOrLoan.remove();

            }

        }
    }



    const checkFacItems2 = (wrapper) => {
        console.log("Checking items");
        Array.from(wrapper.children).forEach((item) => {
            const nameElement = item.querySelector(".name");

            const itemAction = item.querySelector(".item-action");
            if (itemAction && itemAction.children.length > 0 && !itemAction.classList.contains("rl_edited")) {
                itemAction.classList.add("rl_edited");
                addButtons(item, itemAction);

            }

        });
    }

    const addToHeader = () => {
        if (document.querySelector(".c-retrieve-btn-container")) return;
        const clearBtnContainer = document.createElement("div");
        clearBtnContainer.classList.add("c-retrieve-btn-container");
        //Select cart
        const clearBtn = document.createElement("button");
        clearBtn.classList.add("c-retrieve-btn");
        clearBtn.innerText = "Clear Retrievals";

        const links = document.querySelector("#top-page-links-list");
        clearBtnContainer.appendChild(clearBtn);
        if (links) {
            links.appendChild(clearBtnContainer);
        }

        clearBtn.addEventListener("click", () => {
            console.log("clearing");
            localStorage.removeItem("armory-quick-loan");
            location.reload();
        });
    }

    //Set up the listener for the page load
    const observ2 = (itemList) => {
        if (location.href.includes("&type=1#/tab=armoury")) {
            console.log("category-wrap", itemList);
            if (!watchingFac) {
                return obv2.disonnect(); //It's rerendering so we want to end this instance
            }
            //Faction item list page
            obv2= new MutationObserver((_, observer) => {
                checkFacItems2(itemList);
            });
            checkFacItems2(itemList);
            addToHeader();
            console.log("Setting fac obsever on", itemList);
            if (obv2) obv2.observe(itemList, { attributes: true, childList: true, subtree: true, characterData: true }); //{ attributes: true, childList: true, subtree: true, characterData: true }
        }
    }

    const watchForLoad2 = () => {

        const observer = new MutationObserver((_, observer) => {
            if (!location.href.includes("sub=donate") && location.href.includes("sub=")) {

                let wrapper = document.querySelector(".item-list");
                if (wrapper && !watchingFac) {
                    watchingFac = true;
                    observ2(wrapper);
                    //observer.disconnect();
                }
            }
            if (!document.querySelector(".item-list")) {
                console.log("Unwatching fac due to rerender");
                watchingFac = false; //It will be
            }
        });
        observer.observe(document, { subtree: true, childList: true });
    }
    watchForLoad2();
    //Watch for URL changes
    window.addEventListener("hashchange", (event) => {
        if (location.href.includes("&type=1#/tab=armoury")) {
            //console.log("Reconnecting observer");
            obv2.disconnect();
            watchForLoad2();

        }
    })
})();