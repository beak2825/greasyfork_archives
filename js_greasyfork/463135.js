// ==UserScript==
// @name         Stips user blocker.
// @namespace    http://stips.co.il
// @version      0.1
// @description  REALY block users on Stips!
// @author       Avishai
// @match        https://stips.co.il/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=co.il
// @grant        none
// @license GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/463135/Stips%20user%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/463135/Stips%20user%20blocker.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    script()

    //https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists

    async function waitForElement(selector, timeout = null, location = document.body) {
        return new Promise((resolve) => {
            let element = document.querySelector(selector);
            if (element) {
                return resolve(element);
            }

            const observer = new MutationObserver(async () => {
                let element = document.querySelector(selector);
                if (element) {
                    observer.disconnect()
                    resolve(element);
                } else {
                    if (timeout) {
                        async function timeOver() {
                            return new Promise((resolve) => {
                                setTimeout(() => {
                                    observer.disconnect();
                                    resolve(false);
                                }, timeout);
                            });
                        }
                        resolve(await timeOver());
                    }
                }
            });

            observer.observe(location, {
                childList: true,
                subtree: true,
            });
        });
    }

    var currentPath = window.location.pathname;
    setInterval(script, 50);


    async function script() {
        if(window.location.pathname !== currentPath) {
            currentPath = window.location.pathname;

            if(window.location.pathname.includes("ask")) {
                await waitForElement("#elastic-layer-content > div.single-layer.layer-0.ng-star-inserted.visible > app-dynamic-component > app-item-screen > div > div > div.item-screen-content-below-card > div.item-list.ng-star-inserted > app-item-list  > app-item:nth-child(3)")
                console.log("FOUND!!!")
                const answers = document.querySelectorAll("app-item")
                const list = getList()
                if(!list.length) return
                answers.forEach(ans => {
                    list.forEach(id => {
                        if(ans.querySelector("a")?.href.includes(id)){
                            ans.remove()
                            return
                        }
                    })

                })
            } else if(window.location.pathname.includes("profile")) {
                const myId = window.localStorage.getItem("ng2-webstorage|userservice.appuser_a_token").split(".")[0].split("\"")[1] || ""
                const id = window.location.pathname.split("/profile/")[1]
                const list = getList()

                if(myId != id) {
                    let username = document.querySelector("app-user-profile").querySelector(".nickname")
                    if(!username){
                        await waitForElement("app-user-profile .nickname")
                    }
                    username = document.querySelector("app-user-profile").querySelector(".nickname")
                    const button = document.createElement("button")
                    const list = getList()


                    if(list.includes(id)){
                        button.innerText = "unblock"
                        button.addEventListener("click", () => removeUserFromList(id))

                    } else {
                        button.innerText = "block"
                        button.addEventListener("click", () => addUserToList(id))
                    }
                    username.appendChild(button)

                }

                await waitForElement("div .list-single-item")
                const thanksWallMessages = document.querySelectorAll("div .list-single-item")
                thanksWallMessages.forEach(msg => {
                    list.forEach(id => {
                        if(msg.querySelector("a")?.href.includes(id)){
                            msg.remove()
                            return
                        }
                    })
                })
            }
        }
    }

    function getList() {
        const storage = window.localStorage.getItem("blockedUsers")
        let list = JSON.parse(storage || '[]')
        if(!Array.isArray(list)){
            list = []
        }
        return list
    }

    function addUserToList(id) {
        const list = getList()
        if(!list.includes(id)){
            list.push(id)
        }
        window.localStorage.setItem("blockedUsers", JSON.stringify(list))
        window.location.reload()


    }

    function removeUserFromList(id) {
        let list = getList()
        if(list.includes(id)){
            list = list.filter(ids => ids != id)
        }
        window.localStorage.setItem("blockedUsers", JSON.stringify(list))
        window.location.reload()
    }
})();