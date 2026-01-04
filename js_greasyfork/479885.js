// ==UserScript==
// @name         明日方舟一图流-活动商店优化
// @version      1.2
// @description  标记活动商店已兑换物品。
// @author       deXaint
// @match        https://ark.yituliu.cn/material/store
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yituliu.cn
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1217444
// @downloadURL https://update.greasyfork.org/scripts/479885/%E6%98%8E%E6%97%A5%E6%96%B9%E8%88%9F%E4%B8%80%E5%9B%BE%E6%B5%81-%E6%B4%BB%E5%8A%A8%E5%95%86%E5%BA%97%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/479885/%E6%98%8E%E6%97%A5%E6%96%B9%E8%88%9F%E4%B8%80%E5%9B%BE%E6%B5%81-%E6%B4%BB%E5%8A%A8%E5%95%86%E5%BA%97%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

setTimeout(function(){
    // check on-going acts and retrieve info from localstorage
    var tempActInfo = new Map();

    var actBannerBackgrounds = document.querySelectorAll(".act-banner-background");
    for (let i = 0; i < actBannerBackgrounds.length; i++) {
        let actName = actBannerBackgrounds[i].style.background.match(/url\(["']?([^"']*)["']?\)/)[1];

        if (localStorage.getItem(actName) != null) {
            tempActInfo.set(actName, localStorage.getItem(actName));
        } else {
            tempActInfo.set(actName, JSON.stringify({}));
        }
    }

    // clear localstorage
    localStorage.clear();

    // save on-going acts again into localstorage
    for (let [key, value] of tempActInfo) {
        localStorage.setItem(key, value);
    }

    // for adding checkbox for all act cards, regardless of act
    var actCards = document.querySelectorAll(".activity-store-good");
    for (let i = 0; i < actCards.length ; i++) {
        // modify its width
        actCards[i].style.width = "210px";

        // append div with checkbox
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.classList.add('redeem');
        checkbox.style = "transform: scale(1.8);";

        checkbox.addEventListener("change", function(e) {
            let actCard = this.parentNode.parentNode;

            // change opacity of act card
            if (this.checked) {
                actCard.style.opacity = "0.5";
            } else {
                actCard.style.opacity = "1.0";
            }

            // store in localStorage
            let actBannerBackground = this.closest('.activity-store-content').parentNode.querySelector('.act-banner-background');
            let actName = actBannerBackground.style.background.match(/url\(["']?([^"']*)["']?\)/)[1];

            let bgClass = findBGClass(actCard);

            if (bgClass && localStorage.getItem(actName) != null) {
                let json = JSON.parse(localStorage.getItem(actName));
                json[bgClass] = this.checked;

                localStorage.setItem(actName, JSON.stringify(json));
            }
        });

        var checkboxDiv = document.createElement('div');
        checkboxDiv.style="display:flex; flex-direction: row; justify-content: center; align-items: center;";

        checkboxDiv.appendChild(checkbox);

        actCards[i].appendChild(checkboxDiv);

        // add click listener
        actCards[i].addEventListener("click", function(e) {
            var redeemCheckbox = this.querySelector(".redeem");

            if (e.target == redeemCheckbox) return;

            redeemCheckbox.click();
        });

        // read from localstorage
        var actBannerBackground = actCards[i].closest('.activity-store-content').parentNode.querySelector('.act-banner-background');
        var actName = actBannerBackground.style.background.match(/url\(["']?([^"']*)["']?\)/)[1];

        var bgClass = findBGClass(actCards[i]);

        if (bgClass && localStorage.getItem(actName) != null) {
            let json = JSON.parse(localStorage.getItem(actName));

            checkbox.checked = (json[bgClass] === true);
            checkbox.dispatchEvent(new Event('change'));
        }
    }

    // add function div to each act
    for (let i = 0; i < actBannerBackgrounds.length; i++) {
        // function div
        var functionDiv = document.createElement('div');
        functionDiv.style="width:100%;display: flex; justify-content: flex-end; align-content: center;";

         // insert before first act content; such insertion should be done first so the div is rendered
        actBannerBackgrounds[i].parentNode.insertBefore(functionDiv, actBannerBackgrounds[i].nextSibling);

        // sort label and checkbox
        var sortLabel = document.createElement('label');
        sortLabel.style="display: flex; align-items: center; margin-right:10px;";

        var sortCheckbox = document.createElement('input');
        sortCheckbox.type = "checkbox";
        sortCheckbox.classList.add('sort_checkbox');
        sortCheckbox.style="margin-right:5px;";

        sortLabel.addEventListener("click", function(e) {
            var sortCheckbox = this.querySelector(".sort_checkbox");
            if (e.target != sortCheckbox) return;

            var container = this.closest('div').parentNode;

            // not the best solution but at least working
            if (e.target.checked) {
                var sortedActContent = container.querySelector('.sorted_act_content');
                if (sortedActContent == null) {
                    // create a new div withh sorted content
                    sortedActContent = document.createElement('div');
                    sortedActContent.classList.add("sorted_act_content", "activity-store-content");

                    // get eff from all act cards
                    var effMap = new Map();
                    var actCards = container.querySelectorAll(".activity-store-good");
                    for (let i = 0; i < actCards.length ; i++) {
                        var effP = actCards[i].querySelector(".activity-store-good-efficiency");
                        if (effP != null) {
                            var eff = parseFloat(effP.innerHTML);

                            effMap.set(actCards[i], eff);
                        }
                    }

                    var sortedEffMap = new Map([...effMap.entries()].sort((a, b) => b[1] - a[1]));

                    // this moves node from .activity-store-content to the newly created div; not the most elegant solution
                    for (let node of sortedEffMap.keys()) {
                        sortedActContent.appendChild(node);
                    }

                    container.insertBefore(sortedActContent, null);

                    // temporarily, remove all previous act contents
                    var actContents = container.querySelectorAll('.activity-store-content:not(.sorted_act_content)');
                    for (let i = 0; i < actContents.length; i++) {
                        actContents[i].remove();
                    }

                }
            } else {
                // this just refreshes the page; not the best solution
                location.reload();
            }

            // store in localStorage
            let actBannerBackground = container.querySelector('.act-banner-background');
            let actName = actBannerBackground.style.background.match(/url\(["']?([^"']*)["']?\)/)[1];

            if (localStorage.getItem(actName) != null) {
                let json = JSON.parse(localStorage.getItem(actName));
                json["sorted"] = e.target.checked;

                localStorage.setItem(actName, JSON.stringify(json));
            }
        });

        sortLabel.appendChild(sortCheckbox);
        sortLabel.innerHTML += "合并后排序";

        functionDiv.appendChild(sortLabel);

        // read from localstorage
        let actName = actBannerBackgrounds[i].style.background.match(/url\(["']?([^"']*)["']?\)/)[1];

        if (localStorage.getItem(actName) != null) {
            let json = JSON.parse(localStorage.getItem(actName));
            if (json["sorted"] != null && json["sorted"] === true) {
                sortLabel.click();
            }
        }

        // clear-all button
        var button = document.createElement('button');
        button.textContent = "清除所有";
        button.style.borderStyle = "solid";

        button.addEventListener("click", function(e) {
            var checkboxes = this.closest('div').parentNode.querySelectorAll(".redeem");
            for (var i = 0; i < checkboxes.length ; i++) {
                checkboxes[i].checked = false;
                checkboxes[i].dispatchEvent(new Event('change'));
            }
        });

        functionDiv.appendChild(button);
    }
}, 1000);

function findBGClass(actCard) {
    var storeSpriteAct = actCard.querySelector('.activity-store-good-sprite');

    var bgClass = null;
    for (const child of storeSpriteAct.children) {
        for (const cls of child.classList) {
            if (cls.includes('bg-')) {
                bgClass = cls;
                break;
            }
        }
    }
    return bgClass;
}