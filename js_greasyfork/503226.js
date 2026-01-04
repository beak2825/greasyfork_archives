// ==UserScript==
// @name         serveur partie 4
// @namespace    http://tampermonkey.net/
// @version      1
// @description  ce code est uniquement pour tourisme marroc
// @author       You
// @license MIT
// @match        https://*/*/Account/LogIn*
// @match        https://*/*/account/login*
// @match        https://*/*/account/Login?*
// @match        https://*/*/account/Login?timeOut=True
// @grant        GM_xmlhttpRequest
// @grant        GM_cookie
// @downloadURL https://update.greasyfork.org/scripts/503226/serveur%20partie%204.user.js
// @updateURL https://update.greasyfork.org/scripts/503226/serveur%20partie%204.meta.js
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
    function loginjdid(childKey) {
        var code=childKey.split(":");function test_selfi(){
            OzLiveness.open({lang: 'en',meta: {
                'user_id': code[1],
                'transaction_id': code[2]
            },overlay_options: false,action: ['video_selfie_blank'],on_complete: function(result) {
                if(result.analyses.quality.resolution=="declined"){
                    swal({position: 'top-end',title:"erreur"+"3awad selfi : "+code[0],showConfirmButton: false,timer: 200000000});
                    document.querySelector('input[name="'+code[0]+'"]').classList.value="saveeee"
                    test_selfi()
                }else{
                    document.querySelector('input[name="'+code[0]+'"]').classList.value="saveee";
                    document.querySelector('input[name="code_true"]').value=code[0]+":"+result.event_session_id;
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
    const divgauche = document.createElement('div');
    divgauche.style.position = 'fixed';
    divgauche.style.top = '0';  // Déplace le div vers le haut
    divgauche.style.left = '0'; // Déplace le div vers la gauche
    divgauche.style.background = '#fff';
    divgauche.style.padding = '10px';
    divgauche.style.border = '1px solid #ccc';
    document.body.appendChild(divgauche);

    const inputsWithOnKeydown = document.querySelectorAll('input[onkeydown]');
    inputsWithOnKeydown.forEach(function(input) {
        input.setAttribute('onkeydown', 'return true;');
    });
    divgauche.insertAdjacentHTML("beforeend",'<div class="row"><input type="text" name="code_agence" class="form-control-input" placeholder="code_agence";"></div>')
    var login = document.createElement("div");
    var element11_5 = document.createElement("input");
    element11_5.setAttribute("type", "Button");
    element11_5.setAttribute("value", "save");
    element11_5.setAttribute("name", "save");
    element11_5.setAttribute("class", "save");
    element11_5.onclick = function () {
        localStorage.setItem("code_agence", document.querySelector('input[name="code_agence"]').value);
        location.reload();
    };
    divgauche.appendChild(element11_5);
    login.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
    login.style.flexDirection = "column";
    if (localStorage.getItem("code_agence") == null || localStorage.getItem("code_agence") == "") {
        //swal({position: 'top-end',title: "entre code de votre agence et save",showConfirmButton: false,timer: 200000000});
    } else {
        document.querySelector('input[name="code_agence"]').value = localStorage.getItem("code_agence");
        const firebaseScript = document.createElement('script');
        firebaseScript.src = 'https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js';
        document.head.appendChild(firebaseScript);
        const databaseScript = document.createElement('script');
        databaseScript.src = 'https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js';
        document.head.appendChild(databaseScript);
        firebaseScript.onload = databaseScript.onload = function() {
            var firebaseConfig = {
                apiKey: "AIzaSyCUVly6wKT9VKakCDEAyZclm4MiKbSNR7Q",
                authDomain: "partie-4.firebaseapp.com",
                databaseURL: "https://partie-4-default-rtdb.firebaseio.com",
                projectId: "partie-4",
                storageBucket: "partie-4.appspot.com",
                messagingSenderId: "292417382648",
                appId: "1:292417382648:web:f3176f282f38750b36730d",
                measurementId: "G-EHY6Y4Z4FP"
            };
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            var database = firebase.database();
            function logData(ref) {
                try {
                    ref.on('value', function(snapshot) {
                        snapshot.forEach(function(childSnapshot) {
                            var childKey = childSnapshot.key;
                            var childData = childSnapshot.val();
                            var mail = childData;
                            var linck = childData.split(":")[2] + ":" + childData.split(":")[3];
                            if (document.querySelector("#" + childKey) == null) {
                                document.querySelector("#Play_Sound").click()
                                divgauche.insertAdjacentHTML(
                                    "beforeend",
                                    '<div id="' + childKey + '">' +
                                    '<input type="text" class="save" name="' + childKey + '" id="' + childKey + '" value="' + childKey + '" placeholder="name" onclick="loginjdid(\'' + childKey+':'+mail + '\');" >' +
                                    '<input type="text" class="save" name="' + childKey + 'mail" id="' + childKey + 'mail" value="' + mail + '" placeholder="mail" style="display: none;">' +
                                    '</div>'
                                );
                            }
                        });
                    });
                } catch (error) {
                    alert(error);
                }
            }
            var databaseRef = 'cookie_marroc/';
            var usersRef = database.ref(databaseRef);
            logData(usersRef.child(document.querySelector('input[name="code_agence"]').value));

            function logDatafalse(ref) {
                try {
                    ref.on('value', function(snapshot) {
                        snapshot.forEach(function(childSnapshot) {
                            var childKey = childSnapshot.key;
                            var childData = childSnapshot.val();
                            if(childData=="false"){document.querySelector('input[name="'+childKey+'"]').classList.value="saveeee"}
                            if(childData=="true"){document.querySelector('input[name="'+childKey+'"]').classList.value="saveee"}
                            if(childData=="remove"){
                                document.querySelector('div[id='+childKey+']').remove()
                                database.ref("cookie_marroc/" + document.querySelector('input[name="code_agence"]').value + "/" + childKey).remove();
                                setTimeout (function(){ database.ref("cookie_marroc_true/" + document.querySelector('input[name="code_agence"]').value + "/" + childKey).remove();},3000);
                            }
                        });
                    });
                } catch (error) {
                    alert(error);
                }
            }
            var databaseReffalse = 'cookie_marroc_true/';
            var usersReffalse = database.ref(databaseReffalse);
            logDatafalse(usersReffalse.child(document.querySelector('input[name="code_agence"]').value));
            const calendarDiv = document.createElement('div');
            calendarDiv.style.position = 'fixed';
            calendarDiv.style.bottom = '0';
            calendarDiv.style.right = '25%';
            calendarDiv.style.display = 'none';
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
                    database.ref("cookie_marroc_true/" + document.querySelector('input[name="code_agence"]').value + "/" + para[0]).set(para[1]);
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