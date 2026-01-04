// ==UserScript==
// @name        web scraping
// @namespace    http://tampermonkey.net/
// @version      2024-03-28
// @description  scraping the data
// @author       Surya
// @match        https://squas.in/v1/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=squas.in
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491074/web%20scraping.user.js
// @updateURL https://update.greasyfork.org/scripts/491074/web%20scraping.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let data = document.querySelector('.solution-subheading').textContent;
    console.log("scraped data", data)

    async function postData(){
        try {
            if(data){
                const cleanData = data.trim();
                let requestBody = {
                    data: cleanData
                }
                await fetch('http://localhost:5000/dummy', {
                    method: "POST",
                    headers: {
                        'Content-Type': "application/json"
                    },
                    body: JSON.stringify(requestBody)
                })
                data = await data.json()
                console.log("success");
            }
        } catch (error) {
            console.log("error", error);
        }
    }
    postData()
})();