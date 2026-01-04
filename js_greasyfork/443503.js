// ==UserScript==
// @name         WhoIsMyClassmate
// @namespace    https://github.com/Oct4Pie/whoismyclassmate
// @updateURL.     https://raw.githubusercontent.com/oct4pie/whoismyclassmate/main/WhoIsMyClassmate.js
// @homepageURL  https://github.com/Oct4Pie/whoismyclassmate
// @supportURL   https://github.com/Oct4Pie/whoismyclassmate/issues
// @version      0.1.1
// @license      MIT
// @description  Find your classmates in Canvas!
// @author       oct4pie
// @include      /^https:\/\/canvas\.[a-zA-Z]+\.[a-zA-Z]+\/conversations*
// @include      /^https:\/\/instructure\.[a-zA-Z]+\.[a-zA-Z]+\/conversations*
// @include      /^https:\/\/[a-zA-Z]+\.instructure\.[a-zA-Z]+\/conversations*
// @icon         https://drive.google.com/uc?export=download&id=1ngEGFOthlcRLIaL_bokPEtGv-FC3Uk1P
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443503/WhoIsMyClassmate.user.js
// @updateURL https://update.greasyfork.org/scripts/443503/WhoIsMyClassmate.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForClass(id) {
        return new Promise(resolve => {
            if (document.getElementsByClassName(id).length > 0) {
                resolve();
            }

            const observer = new MutationObserver((m) => {
                if (document.getElementsByClassName(id).length > 0) {
                    observer.disconnect();
                    resolve();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    waitForClass('message-header-input').then(() => {


        let Panel = document.getElementsByClassName('message-header-input')[0];
        let Button = document.createElement("button");
        Button.innerHTML = "Fetch";
        Button.onclick = () => {
            let courseXPath = "//*[@id=\"compose-new-message\"]/form/div[1]/div/div[1]/div[2]/input";
            let courseName = document.evaluate(courseXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.value;
            var recAPI = `${window.location.origin}/api/v1/search/recipients?`;
            let jsonData = {
                "search": "",
                "per_page": "500",
                "permissions[]": "send_messages_all",
                "messageable_only": "true",
                "synthetic_contexts": "true",
                "context": `${courseName}_students`,
            }
            let keys = Object.keys(jsonData);
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];
                let value = jsonData[key];
                recAPI += `${key}=${value}&`;
            }

            let wrapper = document.querySelector("#wrapper");
            wrapper.style.marginRight = "5%";
            wrapper.style.marginLeft = "5%";
            wrapper.style.marginTop = "2.5%"
            wrapper.style.marginBottom = "2.5%"
            wrapper.style.display = "flex";
            wrapper.style.flexDirection = "row";

            wrapper.innerHTML = "";
            let dialog = document.querySelector("body > div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-draggable.ui-resizable.ui-dialog-buttons.compose-message-dialog");
            dialog.remove();
            document.querySelector("body > div.ui-widget-overlay").remove();
            let mainDiv = document.createElement("div");
            mainDiv.style.width = "100%";
            mainDiv.style.height = "100%";
            mainDiv.style.display = "flex";
            mainDiv.style.flexDirection = "space-between";
            mainDiv.style.flexWrap = "wrap";
            mainDiv.style.justifyContent = "space-around";
            recAPI = recAPI.slice(0, -1);

            fetch(recAPI)
                .then(response => response.json())
                .then(data => {
                    let recipients = data;
                    let ul = document.createElement("ul");
                    ul.classList.add("recipients");
                    for (let i = 0; i < recipients.length; i++) {
                        let id = recipients[i].id;
                        let name = recipients[i].name;
                        let fullName = recipients[i].full_name;
                        let pronouns = recipients[i].pronouns;
                        let avatar = recipients[i].avatar_url;
                        let common_courses = recipients[i].common_courses;

                        let recDiv = document.createElement("div");
                        recDiv.onclick = () => {
                            let user = `${window.location.origin}/courses/${courseName.split("_")[1]}/users/${id}`;
                            window.open(user);
                        }
                        recDiv.style = "width: 12%; height: 12%;";
                        recDiv.classList.add("recipient-div");
                        recDiv.style.margin = "1%";
                        recDiv.style.display = "flex";
                        recDiv.style.flexDirection = "column";
                        recDiv.style.justifyContent = "center";
                        recDiv.style.borderRadius = "10%";
                        recDiv.style.boxShadow = "0px 0px 2px #8c8c8c";
                        recDiv.onmouseenter = () => {
                            recDiv.style.boxShadow = "0px 0px 10px #000000";
                        }
                        recDiv.onmouseleave = () => {
                            recDiv.style.boxShadow = "0px 0px 2px #8c8c8c";
                        }
                        var recName = document.createElement("p");
                        // recName.classList.add("ig-title");
                        recName.innerHTML = `${name}`;
                        recName.style.fontSize = "1.5vw";
                        if (window.innerWidth < 500) {
                            recDiv.style = "width: 24%; height: 24%;";
                            recDiv.style.borderRadius = "20%";
                            recName.style.fontSize = "3.2vw";
                        }
                        recName.style.textAlign = "center";
                        recName.style.fontWeight = "";
                        let recImg = document.createElement("img");
                        recImg.style = "width: 100%; height: 100%;";
                        recImg.src = avatar;
                        recImg.style.borderRadius = "10%";
                        recImg.classList.add("recipient-img");
                        recDiv.appendChild(recImg);
                        recDiv.appendChild(recName);
                        ul.appendChild(recDiv);
                        mainDiv.appendChild(recDiv);
                    }
                    wrapper.appendChild(mainDiv);
                })
        }
        Panel.appendChild(Button);
    });
})();