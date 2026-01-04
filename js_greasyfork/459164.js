// ==UserScript==
// @name         Account Generator
// @version      2.2
// @license      MIT
// @description  When a password input is detected, it will generate a Email;Username;Password combination and set it to clipboard, then it waits until a email was received and alerts the user of it
// @author       TheEmptynessProject (https://github.com/TheEmptynessProject)
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @namespace    https://github.com/TheEmptynessProject/AccountGenUniversal
// @downloadURL https://update.greasyfork.org/scripts/459164/Account%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/459164/Account%20Generator.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let passLen = 16; //Set to your desired password length
    GM_registerMenuCommand('Generate', generate);
            function generatePassword(leng) {
                const lowerLetters = "abcdefghijklmnopqrstuvwxyz";
                const upperLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                const numbers = "1234567890";
                const symbols = "\|!@#%&/([)]=}?+*~^,.:-_<>";
                const all = lowerLetters + upperLetters + numbers + symbols;
                let pass = "";

                pass += lowerLetters[Math.floor(Math.random() * lowerLetters.length)];
                pass += upperLetters[Math.floor(Math.random() * upperLetters.length)];
                pass += numbers[Math.floor(Math.random() * numbers.length)];
                pass += symbols[Math.floor(Math.random() * symbols.length)];

                for (let i = 4; i < leng; i++) {
                    pass += all[Math.floor(Math.random() * all.length)];
                }

                pass = pass.split('').sort(function() {
                    return 0.5 - Math.random()
                }).join('');

                return pass;
            }

            function getEmail() {
                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: "https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1",
                        onload: function(response) {
                            let res = JSON.parse(response.response)[0]
                            resolve(res);
                        }
                    });
                });
            }

            function waitForEmail(email) {
                const intervalId2 = setInterval(function() {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: `https://www.1secmail.com/api/v1/?action=getMessages&login=${email.substring(0, email.indexOf('@'))}&domain=${email.substring(email.indexOf('@') + 1)}`,
                        onload: function(response) {
                            const ref_response = JSON.parse(response.responseText);

                            if (ref_response.length > 0) {
                                const first_msg = ref_response[0];
                                const msg_id = first_msg.id;
                                const from_msg = first_msg.from || 'Unknown Sender';
                                const subject = first_msg.subject || 'No Subject';
                                const date = first_msg.date || 'No Date';

                                const msg_details = `From: ${from_msg}\nSubject: ${subject}`;

                                GM_xmlhttpRequest({
                                    method: "GET",
                                    url: `https://www.1secmail.com/api/v1/?action=readMessage&login=${email.substring(0, email.indexOf('@'))}&domain=${email.substring(email.indexOf('@') + 1)}&id=${msg_id}`,
                                    onload: function(bodyResponse) {
                                        const msg_body_response = JSON.parse(bodyResponse.responseText);
                                        const msg_body = msg_body_response.body || 'No Body';
                                        console.log("Received EMAIL");
                                        clearInterval(intervalId2);
                                        openEmailInNewTab(msg_body);
                                    }
                                });
                            }
                        }
                    });
                }, 1000);
            }

            function openEmailInNewTab(content) {
                const dataUri = 'data:text/html,' + encodeURIComponent(content);
                const newTab = window.open(dataUri, '_blank');
                if (!newTab) {
                    alert('Popup blocked. Please allow popups and try again. Logged email to console and set url to clipboard.');
                    GM_setClipboard(dataUri);
                    console.log(content);
                }
            }

            async function generate() {
                let email = await getEmail();
                let pass = generatePassword(passLen);
                let user = "";
                const first = [
                    'James', 'Sophia', 'Ahmed', 'Maria', 'Chen', 'Isabella', 'Muhammad', 'Emma', 'Juan', 'Aya',
                    'Mateo', 'Fatima', 'Liam', 'Sophie', 'Raj', 'Mia', 'Luca', 'Sofia', 'Yuki', 'Andrei',
                    'Olivia', 'Pedro', 'Amara', 'Kai', 'Leila', 'Alejandro', 'Elsa', 'Ahmed', 'Amina', 'Viktor',
                    'Alice', 'Diego', 'Maya', 'Hugo', 'Sarah', 'Ivan', 'Jasmine', 'Santiago', 'Camila', 'Felix',
                    'Aisha', 'Daniel', 'Nia', 'Fabio', 'Anastasia', 'Khaled', 'Luna', 'Oscar', 'Priya', 'Amir'
                ];
                const second = [
                    'Zephyr', 'Jamboree', 'Whimsy', 'Gobsmack', 'Bumble', 'Quasar', 'Lullaby', 'Zigzag', 'Sassafras', 'Galaxy',
                    'Quokka', 'Noodle', 'Bamboo', 'Pumpernickel', 'Sphinx', 'Lollipop', 'Blizzard', 'Muffin', 'Quicksilver', 'Jellybean',
                    'Penguin', 'Chameleon', 'Umbrella', 'Moonbeam', 'Sasquatch', 'Jigsaw', 'Kangaroo', 'Rhubarb', 'Waffle', 'Flapdoodle',
                    'Brouhaha', 'Cactus', 'Turbulence', 'Platypus', 'Tango', 'Fandango', 'Gobbledygook', 'Kaleidoscope', 'Serenity',
                    'Avalanche', 'Phoenix', 'Pegasus', 'Spectre', 'Cascade', 'Veridian', 'Abyss', 'Torrent', 'Cascade', 'Mirage'
                ];
                user = first[Math.round(Math.random() * first.length)] + second[Math.round(Math.random() * second.length)];
                let output = email + ";" + user + ";" + pass
                GM_setClipboard(output);
                waitForEmail(email);
            }
})();
