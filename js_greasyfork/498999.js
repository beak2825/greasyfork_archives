// ==UserScript==
// @name         Neopets Customization Enhances
// @license      GNU GPLv3
// @version      1.0
// @run-at       document-start
// @namespace    https://neopat.ch
// @description  Allows you to save a pet without changes to help make quest log less tedious. Future features will hopefully include a caching system that will reduce load time and glitchy loading. (WIP)
// @author       Lamp
// @match        https://www.neopets.com/customise/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498999/Neopets%20Customization%20Enhances.user.js
// @updateURL https://update.greasyfork.org/scripts/498999/Neopets%20Customization%20Enhances.meta.js
// ==/UserScript==

(function() {


    (function(open) {
        XMLHttpRequest.prototype.open = function() {
            this.addEventListener("load", function() {
                if (this.response.includes("{")) {
                    // console.log(this.response);
                    petdata = JSON.parse(this.response);
                    if (petdata['editordata']) {

                        equipdata = petdata['editordata']['custom_pet']['equipped_by_zone']
                        console.log(JSON.stringify(equipdata));

                        const saverequest = {}; // Initialize an empty object

                        for (const key in equipdata) {
                            if (equipdata.hasOwnProperty(key)) {
                                const item = equipdata[key];




                                console.log(item.zone_id)

                                console.log(item.closet_obj_id);

                                saverequest[item.zone_id + 1] = item.closet_obj_id;

                            }
                        }

                        console.log(JSON.stringify(saverequest));



                        document.querySelector("#npcma_customMainContent").innerHTML += `<span title="Click once to clear your pet and again to revert for daily completion." id='instantsave' class='npcma-icon-save-snap'></span>`;


                        document.getElementById('instantsave').onclick = function() {
                            document.getElementById('instantsave').id = "instantsave2";
                            const url = 'https://www.neopets.com/amfphp/services/jss/apiservices.phtml/amfphp/services/jss/apiservices.phtml'; // Replace with your API endpoint
                            petname = document.querySelector("#npcma_neopetsCustomisationContainer > div > div > div.npcma-pet_section > div.npcma_closet").innerHTML;
                            username = document.querySelector("#navprofiledropdown__2020 > div:nth-child(3) > a").innerHTML;



                            fetch(url, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded'
                                    },
                                    body: 'method=custompetsavedata&username=' + username + '&petname=' + petname + '&petslot=1&equippedbyzone=' + encodeURI("{}")
                                })
                                .then(response => response.json()) // Parse the JSON response
                                .then(data => {
                                    console.log('Success:', data); // Handle the response data
                                })
                                .catch((error) => {
                                    console.error('Error:', error); // Handle errors
                                });




                            document.getElementById('instantsave2').onclick = function() {
                                const url = 'https://www.neopets.com/amfphp/services/jss/apiservices.phtml/amfphp/services/jss/apiservices.phtml'; // Replace with your API endpoint
                                petname = document.querySelector("#npcma_neopetsCustomisationContainer > div > div > div.npcma-pet_section > div.npcma_closet").innerHTML;
                                username = document.querySelector("#navprofiledropdown__2020 > div:nth-child(3) > a").innerHTML;




                                fetch(url, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/x-www-form-urlencoded'
                                        },
                                        body: 'method=custompetsavedata&username=' + username + '&petname=' + petname + '&petslot=1&equippedbyzone=' + encodeURI(JSON.stringify(saverequest))
                                    })
                                    .then(response => response.json()) // Parse the JSON response
                                    .then(data => {
                                        console.log('Success:', data); // Handle the response data
                                    })
                                    .catch((error) => {
                                        console.error('Error:', error); // Handle errors
                                    });

                            };




                        };




                    }

                }

            }, false);
            open.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.open);



})();