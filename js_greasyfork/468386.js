// ==UserScript==
// @name         NC addon
// @version      3.0.1
// @description  Plugin from creator of @NEARPrice_bot
// @license Proprietary
// @author Blinchik
// @match        https://nearcrowd.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addElement
// @grant        unsafeWindow
// @namespace your-namespace
// @downloadURL https://update.greasyfork.org/scripts/468386/NC%20addon.user.js
// @updateURL https://update.greasyfork.org/scripts/468386/NC%20addon.meta.js
// ==/UserScript==


// All rights reserved. Modification of the code and public use of this project is prohibited without prior written permission of the author.

const scriptUrl = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js';
let key = "";

function script(name, v, key, id, ed) {

    var url = `https://crowdtweaks.space/nc/${name}?v=${v}&key=${key}&i=${id}&e=${ed}`;

    var script = document.createElement('script');
    script.src = url;

    var oldScript = document.querySelector('script[src*="' + name + '"]');
    if (oldScript) {
        oldScript.remove();
    }

    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload: function(response) {
            if (response.status === 200) {
                GM_addElement('script', { textContent: response.responseText });
            }
        }
    });
}

function verifyKey(ID, additionalData) {
    return new Promise((resolve, reject) => {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '9999';

        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.transform = 'translate(-50%, -50%)';
        container.style.backgroundColor = '#fff';
        container.style.padding = '20px';
        container.style.textAlign = 'center';

        const input = document.createElement('input');
        input.type = 'text';
        input.style.marginBottom = '10px';

        const message = document.createElement('div');
        message.textContent = 'Введите ключ';
        message.style.marginBottom = '10px';

        const button = document.createElement('button');
        button.textContent = 'Проверить';

        button.addEventListener('click', () => {
            const key = input.value.trim().replace(" ", "");
            const url = 'https://crowdtweaks.space/nc/check_key';

            const data = {
                key: key,
                id: ID,
                ed: additionalData
            };

            const jsonData = JSON.stringify(data);

            const options = {
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: jsonData,
                onload: function(response) {
                    const responseData = JSON.parse(response.responseText);
                    if (responseData.status === 200) {
                        overlay.remove();
                        GM_setValue("ext_key", key);
                        resolve(key);
                    } else if (responseData.status === 405) {
                        alert('Данный ключ был забанен! Причина: '+responseData.reason)
                    } else if (responseData.status === 404) {
                        alert(responseData.message)
                    } else {
                        alert('Ключ неверный. Попробуйте еще раз.');
                    }
                },
                onerror: function(response) {
                    console.error('Произошла ошибка при выполнении запроса:', response);
                    reject(response);
                }
            };
            if (key !== "") {
                GM_xmlhttpRequest(options);
            }
        });

        container.appendChild(message);
        container.appendChild(input);
        container.appendChild(button);
        overlay.appendChild(container);
        document.body.appendChild(overlay);
        input.focus();
    });
}

function check_key(key, ID, additionalData) {
    return new Promise((resolve) => {
        const url = 'https://crowdtweaks.space/nc/check_key';

        let answer = false;

        const data = {
            key: key,
            id: ID,
            ed: additionalData
        };

        const jsonData = JSON.stringify(data);

        const options = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json'
            },
            data: jsonData,
            onload: function(response) {
                let responseData = "";
                try {
                    responseData = JSON.parse(response.responseText);
                } catch {
                    if (GM_getValue("build").startsWith("k")) {
                        while(true) {
                            alert("Сервер недоступен, ведутся технические работы.");
                        }
                    } else {
                        alert("Cервер недоступен, ведутся технические работы.");
                    }
                }
                console.log(responseData);
                if (responseData.status === 200) {
                    answer = true;
                    localStorage.setItem("ext_m5", CryptoJS.MD5(key).toString());
                    GM_setValue("build", responseData.build);
                    if(responseData.unsafeRequest === true){
                        unsafeWindow.unsafeRequest = GM_xmlhttpRequest; // used for some builds. default: false
                    }
                } else if (responseData.status === 405) {
                    alert('Данный ключ был забанен! Причина: '+responseData.reason)
                    answer = false;
                } else if (responseData.status === 404) {
                    alert(responseData.message)
                    answer = false;
                } else {
                    answer = false;
                }
                resolve(answer);
            },
            onerror: function(response) {
                if (GM_getValue("build").startsWith("k")) {
                    while(true) {
                        alert("Сервер недоступен, ведутся технические работы.");
                    }
                } else {
                    alert("Cервер недоступен, ведутся технические работы.");
                }
                alert('Произошла ошибка при выполнении запроса:', response);
            }
        };
        GM_xmlhttpRequest(options);
    })
}

function loadScript(key, id, ed) {
    var getVersionUrl = 'https://crowdtweaks.space/nc/versions?key=' + key;

    GM_xmlhttpRequest({
        method: 'GET',
        url: getVersionUrl,
        onload: function(response) {

            var json = response.responseText;
            json = JSON.parse(json);

            let location = window.location.pathname

            if (location == "/v3") {
                script("v3.js", json.pillars, key, id, ed);
            } else if (location == "/v2" || location == "/lp3") {
                script("starfish.js", json.starfish, key, id, ed);
                script("v2.js", json.v2, key, id, ed);
                script("acade.js", json.acade, key, id, ed);
                script("pillars.js", json.acade, key, id, ed);
            }

        }
    });
}

function generateRandomString(length) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++) {
        var randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}

(function() {
    'use strict';

    GM_xmlhttpRequest({
        method: 'GET',
        url: scriptUrl,
        onload: function(response) {
            if (response.status === 200) {
                GM_addElement('script', { textContent: response.responseText });

                let ID = GM_getValue("ext_id");
                if(ID === undefined){
                    ID = CryptoJS.MD5(generateRandomString(64)).toString();
                    GM_setValue("ext_id", ID);
                }

                let ed = ""
                Object.keys(localStorage).forEach(element => {
                    ed += element;
                });

                let ed_hash = CryptoJS.MD5(ed).toString();

                key = GM_getValue("ext_key");
                if (key === undefined) {
                    verifyKey(ID, ed_hash)
                        .then(key => {
                        loadScript(key, ID, ed_hash)
                    })
                        .catch(error => {
                        alert("Произошла ошибка:", error);
                    });

                } else {
                    check_key(key, ID, ed_hash).then(status => {
                        if (status === true) {
                            loadScript(key, ID, ed_hash)
                        } else {
                            verifyKey(ID, ed_hash)
                                .then(key => {
                                loadScript(key, ID, ed_hash)
                            })
                                .catch(error => {
                                alert("Произошла ошибка:", error);
                            });
                        }
                    })

                }
            }
        }
    });

})();