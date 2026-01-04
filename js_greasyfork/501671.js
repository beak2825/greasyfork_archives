// ==UserScript==
// @name         serveur selfi linck
// @namespace    http://tampermonkey.net/
// @version      2030
// @description  ce code est uniquement pour etude marroc
// @author       You
// @license MIT
// @match        https://www.blsspainmorocco.net/*
// @grant        GM_xmlhttpRequest
// @grant        GM_cookie
// @downloadURL https://update.greasyfork.org/scripts/501671/serveur%20selfi%20linck.user.js
// @updateURL https://update.greasyfork.org/scripts/501671/serveur%20selfi%20linck.meta.js
// ==/UserScript==

if(location.href=='https://www.blsspainmorocco.net/'){
    var iframe = document.createElement('iframe');
    iframe.setAttribute('src', 'https://www.blsspainmorocco.net/MAR/appointment/livenessrequest');
    iframe.setAttribute('allow', 'autoplay');
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none'; // Facultatif, pour retirer les bordures par défaut de l'iframe
    iframe.style.zIndex = '9999'; // Facultatif, pour s'assurer que l'iframe reste au-dessus d'autres éléments
    document.body.appendChild(iframe);

}else{

    document.body.innerHTML = '';
    document.querySelector("body").insertAdjacentHTML("beforeend","<style> .save {display: inline-block;padding: 10px 10px;font-size: 15px;font-style: italic;font-weight:900;cursor: pointer;text-align: center;text-decoration: none;outline: none;color: #fff;background: linear-gradient(to right top, #1c00a4, #1c06a9, #1b0caf, #1a12b4, #1817ba, #032dbe, #003dc0, #004ac1, #005ab2, #005c8e, #005966, #16534a) ;border: none;border-radius: 15px;box-shadow: 0 9px #999;}.save:hover {background-color: #32b2b9}.save:active {background-color: #0000ff;box-shadow: 0 5px #666;transform: translateY(4px);}</style>");
    document.querySelector("body").insertAdjacentHTML("beforeend","<style> .savee {display: inline-block;padding: 10px 10px;font-size: 15px;font-style: italic;font-weight:900;cursor: pointer;text-align: center;text-decoration: none;outline: none;color: #fff;background: linear-gradient(to right bottom,#d40909, #dc003f, #d5006b, #bd0094, #9235b6, #7756cf, #516ee2, #0083ed, #00a2fb, #00bdfa, #00d6ed, #00ebdc);border: none;border-radius: 15px;box-shadow: 0 9px #999;}.savee:hover {background-color: #32b2b9}.savee:active {background-color: #0000ff;box-shadow: 0 5px #666;transform: translateY(4px);}</style>");
    document.querySelector("body").insertAdjacentHTML("beforeend", "<style> .saveee {display: inline-block;padding: 10px 10px;font-size: 15px;font-style: italic;font-weight: 900;cursor: pointer;text-align: center;text-decoration: none;outline: none;color: #000;background-color: #00FF00;border: none;border-radius: 15px;box-shadow: 0 9px #999;}.saveee:hover {background-color: #32b2b9}.saveee:active {background-color: #0000ff;box-shadow: 0 5px #666;transform: translateY(4px);}</style>");
    const daysInNovember = 31;
    var jqueryScript = document.createElement('script');
    jqueryScript.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
    document.head.append(jqueryScript);

    const bootstrapJS = document.createElement('script');
    bootstrapJS.src = 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js';
    document.head.appendChild(bootstrapJS);

    // Create fixed position containers for input elements
    var divGauche2 = document.createElement("div");
    divGauche2.style.position = "fixed";
    divGauche2.style.top = "70%";
    divGauche2.style.left = "50%";
    divGauche2.style.transform = "translate(-50%, -50%)";
    divGauche2.style.zIndex = "9999";
    divGauche2.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
    divGauche2.style.display = "flex";
    divGauche2.style.flexDirection = "column";
    document.body.appendChild(divGauche2);

    var calendarDiv = document.createElement('div');
    var divGauche = document.createElement("div");
    divGauche.style.position = "fixed";
    divGauche.style.top = "50%";
    divGauche.style.left = "50%";
    divGauche.style.transform = "translate(-50%, -50%)";
    divGauche.style.zIndex = "9999";
    divGauche.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
    divGauche.style.display = "flex";
    divGauche.style.flexDirection = "column";
    document.body.appendChild(divGauche);
    document.body.appendChild(calendarDiv);

    // Check if passport number is saved in local storage
    if (localStorage.getItem("passport_num") == null) {
        var element0 = document.createElement("input");
        element0.setAttribute("type", "input");
        element0.setAttribute("value", localStorage.getItem("passport_num") || "");
        element0.setAttribute("name", "entre_passport_number");
        element0.setAttribute("id", "entre_passport_number");
        element0.setAttribute("placeholder", "Enter passport number to create an account");
        element0.style.width = "500px";
        element0.style.height = "50px";
        element0.style.fontWeight = "bold";
        element0.style.fontSize = "20px";
        element0.style.padding = "10px";
        divGauche.appendChild(element0);

        var element1 = document.createElement("input");
        element1.setAttribute("type", "Button");
        element1.setAttribute("value", "Save");
        element1.setAttribute("name", "save");
        element1.setAttribute("class", "save");
        element1.onclick = function () {
            localStorage.setItem("passport_num", document.querySelector('#entre_passport_number').value);
            location.reload();
        };
        divGauche2.appendChild(element1);
    } else {
        var name = "";
        var code = "";
        var solution = "";

        function cherch_transaction_selfi() {
            var queryData = { "id": localStorage.getItem("passport_num") };
            var url = "https://swagdx.com/swagapp/gestion_donnees.php?" + new URLSearchParams(queryData).toString();

            fetch(url)
                .then(response => {
                if (!response.ok) throw new Error('Network Error: ' + response.status);
                return response.json();
            })
                .then(jsonResponse => {
                name = jsonResponse.name;
                code = jsonResponse.code;
                solution = jsonResponse.solution;

                if (!jsonResponse.code) {
                    if (document.querySelector('div[name="alllart_div"]')) document.querySelector('div[name="alllart_div"]').remove();
                    var alertDiv = document.createElement("div");
                    alertDiv.style.position = "fixed";
                    alertDiv.setAttribute("name", "alllart_div");
                    alertDiv.style.top = "50%";
                    alertDiv.style.left = "50%";
                    alertDiv.style.transform = "translate(-50%, -50%)";
                    alertDiv.style.zIndex = "10000";
                    alertDiv.style.backgroundColor = "#f8d7da";
                    alertDiv.style.color = "#721c24";
                    alertDiv.style.padding = "20px";
                    alertDiv.style.borderRadius = "10px";
                    alertDiv.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";
                    alertDiv.textContent = "No selfie request, please wait";
                    document.body.appendChild(alertDiv);
                    setTimeout(cherch_transaction_selfi, 5000);
                } else {
                    var transacttion = jsonResponse.code;

                    if (document.querySelector('input[name="delete"]')) document.querySelector('input[name="delete"]').remove();
                    if (document.querySelector('div[name="alllart_div"]')) document.querySelector('div[name="alllart_div"]').remove();

                    var audio = new Audio('https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3');

                    // Essayez de jouer l'audio et ignorez les erreurs
                    audio.play().catch(function() {
                        // Rien à faire ici, l'erreur est ignorée
                    });

                    var element1 = document.createElement("input");
                    element1.setAttribute("type", "Button");
                    element1.setAttribute("value", "Start Selfie");
                    element1.setAttribute("name", "start_selfie");
                    element1.setAttribute("class", "saveee");
                    element1.onclick = function () {
                        openLivenessCheck(transacttion);
                    };
                    divGauche.appendChild(element1);
                }
            })
                .catch(error => {
                var errorDiv = document.createElement("div");
                errorDiv.style.position = "fixed";
                errorDiv.style.top = "50%";
                errorDiv.style.left = "50%";
                errorDiv.style.transform = "translate(-50%, -50%)";
                errorDiv.style.zIndex = "10000";
                errorDiv.style.backgroundColor = "#f8d7da";
                errorDiv.style.color = "#721c24";
                errorDiv.style.padding = "20px";
                errorDiv.style.borderRadius = "10px";
                errorDiv.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";
                errorDiv.textContent = error;
                document.body.appendChild(errorDiv);
            });
        }

        cherch_transaction_selfi();
    }

    function openLivenessCheck(transacttion) {
        const metadata = {
            user_id: transacttion.split(",")[0],
            transaction_id: transacttion.split(",")[1],
        };
        OzLiveness.open({
            lang: 'en',
            meta: metadata,
            overlay_options: false,
            action: ['video_selfie_blank'],
            on_complete: function (response) {
                if (response.analyses.quality.resolution === 'declined') {
                    alert('Selfie declined, please adjust your face in the center and try again.');
                    openLivenessCheck(transacttion);
                    return;
                } else {
                    const formData = {
                        "code": "",
                        "id": localStorage.getItem("passport_num"),
                        "name": name,
                        "solution": response.event_session_id
                    };
                    var url2 = "https://swagdx.com/swagapp/gestion_donnees.php";
                    fetch(url2, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    })
                        .then(response => response.text())
                        .then(data => {
                        location.reload
                    })
                        .catch(error => {
                        alert('Error occurred:', error);
                    });
                }
            }
        });
    }

    // Button to delete saved passport number
    var deleteButton = document.createElement("input");
    deleteButton.setAttribute("type", "Button");
    deleteButton.setAttribute("value", "Delete Account");
    deleteButton.setAttribute("class", "save");
    deleteButton.setAttribute("name", "delete");
    deleteButton.onclick = function () {
        localStorage.removeItem("passport_num");
        location.reload();
    };
    divGauche2.appendChild(deleteButton);

    jqueryScript.onload = function () {
        const script = document.createElement('script');
        script.src = 'https://web-sdk.spain.prod.ozforensics.com/blsinternational/plugin_liveness.php';
        document.body.append(script);
    };
}