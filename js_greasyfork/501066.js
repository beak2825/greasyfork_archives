// ==UserScript==
// @name         serveur etude
// @namespace    http://tampermonkey.net/
// @version      20801
// @description  ce code est uniquement pour etude marroc
// @author       You
// @license MIT
// @match        https://*/*/Account/LogIn*
// @match        https://*/*/account/login*
// @match        https://*/*/account/Login?*
// @match        https://*/*/account/Login?timeOut=True
// @grant        GM_xmlhttpRequest
// @grant        GM_cookie
// @downloadURL https://update.greasyfork.org/scripts/501066/serveur%20etude.user.js
// @updateURL https://update.greasyfork.org/scripts/501066/serveur%20etude.meta.js
// ==/UserScript==

window.addEventListener('load', function () {
    document.body.innerHTML = '';
    const swal1 = document.createElement('script')
    swal1.src =
        'https://cdn.bootcss.com/sweetalert/2.1.2/sweetalert.min.js'
    document.body.append(swal1)
    const swal2 = document.createElement('script')
    swal2.src =
        'https://cdn.rawgit.com/alertifyjs/alertify.js/v1.0.10/dist/js/alertify.js'
    document.body.append(swal2)
    const script2 = document.createElement('script')
    script2.src =
        'https://web-sdk.cdn.prod.ozforensics.com/blsinternational/plugin_liveness.php'
    document.body.append(script2)


    function loginjdid() {
        var code=location.hash.split(":");function test_selfi(){
            OzLiveness.open({lang: 'en',meta: {
                'user_id': code[1],
                'transaction_id': code[2]
            },overlay_options: false,action: ['video_selfie_blank'],on_complete: function(result) {
                if(result.analyses.quality.resolution=="declined"){
                    swal({position: 'top-end',title:"erreur"+"3awad selfi : "+code[0],showConfirmButton: false,timer: 200000000});
                    test_selfi()
                }else{
                    swal({position: 'top-end',title:"selfi : true ",showConfirmButton: false,timer: 200000000});
                    document.querySelector('input[name="code_true"]').value=code[0].replaceAll("#","")+":"+result.event_session_id;
                    document.querySelector('input[name="seend_code_selfi"]').click();
                }}});}test_selfi()};


    var script = document.createElement('script');script.type = 'text/javascript';script.textContent = 'window.loginjdid = ' + loginjdid.toString() + ';';
    document.head.appendChild(script);
    document.querySelector("body").insertAdjacentHTML("beforeend","<style> .save {display: inline-block;padding: 10px 10px;font-size: 15px;font-style: italic;font-weight:900;cursor: pointer;text-align: center;text-decoration: none;outline: none;color: #fff;background: linear-gradient(to right top, #1c00a4, #1c06a9, #1b0caf, #1a12b4, #1817ba, #032dbe, #003dc0, #004ac1, #005ab2, #005c8e, #005966, #16534a) ;border: none;border-radius: 15px;box-shadow: 0 9px #999;}.save:hover {background-color: #32b2b9}.save:active {background-color: #0000ff;box-shadow: 0 5px #666;transform: translateY(4px);}</style>");
    document.querySelector("body").insertAdjacentHTML("beforeend","<style> .savee {display: inline-block;padding: 10px 10px;font-size: 15px;font-style: italic;font-weight:900;cursor: pointer;text-align: center;text-decoration: none;outline: none;color: #fff;background: linear-gradient(to right bottom,#d40909, #dc003f, #d5006b, #bd0094, #9235b6, #7756cf, #516ee2, #0083ed, #00a2fb, #00bdfa, #00d6ed, #00ebdc);border: none;border-radius: 15px;box-shadow: 0 9px #999;}.savee:hover {background-color: #32b2b9}.savee:active {background-color: #0000ff;box-shadow: 0 5px #666;transform: translateY(4px);}</style>");
    document.querySelector("body").insertAdjacentHTML("beforeend", "<style> .saveee {display: inline-block;padding: 10px 10px;font-size: 15px;font-style: italic;font-weight: 900;cursor: pointer;text-align: center;text-decoration: none;outline: none;color: #000;background-color: #00FF00;border: none;border-radius: 15px;box-shadow: 0 9px #999;}.saveee:hover {background-color: #32b2b9}.saveee:active {background-color: #0000ff;box-shadow: 0 5px #666;transform: translateY(4px);}</style>");
    document.querySelector("body").insertAdjacentHTML("beforeend", "<style> .saveeee {display: inline-block;padding: 10px 10px;font-size: 15px;font-style: italic;font-weight: 900;cursor: pointer;text-align: center;text-decoration: none;outline: none;color: #000;background-color: #FF0000;border: none;border-radius: 15px;box-shadow: 0 9px #999;}.saveee:hover {background-color: #32b2b9;}.saveee:active {background-color: #0000ff;box-shadow: 0 5px #666;transform: translateY(4px);}</style>");
    var dzaa = window.location.href.split('/');
    var path = dzaa[2];
    var blad = dzaa[3].toLowerCase();



    const inputsWithOnKeydown = document.querySelectorAll('input[onkeydown]');
    inputsWithOnKeydown.forEach(function(input) {
        input.setAttribute('onkeydown', 'return true;');
    });
    var divcentre = document.createElement('div');
    divcentre.style.position = 'fixed';
    divcentre.style.top = '50%';
    divcentre.style.left = '50%';
    divcentre.style.transform = 'translate(-50%, -50%)';
    divcentre.style.background = '#fff';
    divcentre.style.padding = '10px';
    divcentre.style.border = '1px solid #ccc';
    document.body.appendChild(divcentre);

    var login = document.createElement("div");
    var element11_5 = document.createElement("button");
    element11_5.setAttribute("type", "button");
    element11_5.setAttribute("value", "save");
    element11_5.setAttribute("name", "save");
    element11_5.setAttribute("class", "save");
    element11_5.textContent = "Selfi";
    element11_5.onclick = function () {
        loginjdid();
    };
    element11_5.style.width = "500px"; // Largeur souhaitée
    element11_5.style.height = "100px"; // Hauteur souhaitée
    element11_5.style.fontSize = "60px"; // Taille de police souhaitée
    divcentre.appendChild(element11_5);

    login.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
    login.style.flexDirection = "column";
    if (location.hash=='') {
        swal({position: 'top-end',title: "lien incorect",showConfirmButton: false,timer: 200000000});
    } else {
        const firebaseScript = document.createElement('script');
        firebaseScript.src = 'https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js';
        document.head.appendChild(firebaseScript);
        const databaseScript = document.createElement('script');
        databaseScript.src = 'https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js';
        document.head.appendChild(databaseScript);
        firebaseScript.onload = databaseScript.onload = function() {
            var hashParts = location.hash.split(":");
            var firebaseConfig = {
                apiKey: String(hashParts[3]),
                authDomain: String(hashParts[4]),
                databaseURL: String(hashParts[5]) + ":" + String(hashParts[6]),
                projectId: String(hashParts[7]),
                storageBucket: String(hashParts[8]),
                messagingSenderId: String(hashParts[9]),
                appId: String(hashParts[10]) + ":" + String(hashParts[11]) + ":" + String(hashParts[12]) + ":" + String(hashParts[13]),
                measurementId: String(hashParts[14])
            };
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            var database = firebase.database();

            const calendarDiv = document.createElement('div');
            calendarDiv.style.position = 'fixed';
            calendarDiv.style.bottom = '0';
            calendarDiv.style.right = '25%';
            //calendarDiv.style.display = 'none';
            calendarDiv.style.background = '#fff';
            calendarDiv.style.padding = '10px';
            calendarDiv.style.border = '1px solid #ccc';
            document.body.appendChild(calendarDiv);

            var element0 = document.createElement("input");
            element0.setAttribute("type", "Button");
            element0.setAttribute("value", "seend_code_selfi");
            element0.setAttribute("name", "seend_code_selfi");
            element0.setAttribute("id", "seend_code_selfi");
            element0.setAttribute("class", "save");
            element0.onclick = function () {
                if(document.querySelector('input[name="code_true"]').value.split(":").length==2){
                    var para=document.querySelector('input[name="code_true"]').value.split(":")
                    database.ref("cookie_marroc_true/" + para[0]).set(para[1]);
                }
                document.querySelector('input[name="code_true"]').value=""
            };calendarDiv.appendChild(element0)
            element0 = document.createElement("input");
            element0.setAttribute("type", "input");
            element0.setAttribute("value", "");
            element0.setAttribute("name", "code_true");
            element0.setAttribute("id", "code_true");
            element0.setAttribute("placeholder", "code_true");
            element0.setAttribute("class", "save");
            element0.style.width = "800px";
            calendarDiv.appendChild(element0);
            var button = document.createElement('button');
            button.innerHTML = 'Play_Sound';
            button.setAttribute("id", "Play_Sound");
            calendarDiv.appendChild(button);
            button.addEventListener('click', function() {
                var audio = new Audio('https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3');
                audio.play().catch(function(error) {
                });
            });
        };
    }
});