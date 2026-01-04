// ==UserScript==
// @name         Trudy's Surprise auto-collect
// @namespace    neopets
// @version      2021.02.15
// @description  Auto collect without waiting for the fucking wheel to stop spinning
// @match        http://www.neopets.com/trudys_surprise.phtml*
// @downloadURL https://update.greasyfork.org/scripts/421716/Trudy%27s%20Surprise%20auto-collect.user.js
// @updateURL https://update.greasyfork.org/scripts/421716/Trudy%27s%20Surprise%20auto-collect.meta.js
// ==/UserScript==

$.ajax({
    type: "POST",
    url: "/trudydaily/ajax/claimprize.php",
    data: {"action": "beginroll"},
    dataType: "json",
    success: data => {
        console.log(data);
        if (data?.["prizes"]) {
            let prizes = data["prizes"];
            $.ajax({
                type: "POST",
                url: "/trudydaily/ajax/claimprize.php",
                data: {"action": "prizeclaimed"},
                dataType: "json",
                success: data => {
                    console.log(data);
                    let showPrize = [];
                    if (data?.["error"] === "") {
                        for (let prize of prizes) {
                            if (prize.name === "NP") {
                                const amount = prize.value;
                                showPrize.push(amount + " NP");
                            }
                            if (prize.url !== "") {
                                const item = prize.name;
                                showPrize.push(item);
                            }
                        }
                    }
                    let text = `Prizes won:\n`;
                    for (let prize of showPrize) {
                        text += prize + `\n`;
                    }
                    console.log(text);
                    window.alert(text);
                    window.replace("http://www.neopets.com/trudys_surprise.phtml?delevent=yes");
                }
            });
        } else {
            window.alert("You have claimed your prize for today");
        }
    }
});