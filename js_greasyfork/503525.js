// ==UserScript==
// @name         Masterix BumpyBall Client
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Cheat client for Pucks.io and Bumpyball.io by Masterix
// @author       Masterix
// @match        https://www.pucks.io/*
// @match        https://www.bumpyball.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pucks.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503525/Masterix%20BumpyBall%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/503525/Masterix%20BumpyBall%20Client.meta.js
// ==/UserScript==

/*=============================================================================================================
  SCRIPT BY MASTERIX! #MCC
  If you want to change/edit my console, please contact me via Discord. Thank you!
  Discord ==> masterix9759
  Thanks for using my cheat. <3
=============================================================================================================*/

// TIP: Click on the "e" key to open the cheat.

let selectedCar;
let usernamearray=[];
let playername;
let controlinterval, controlintervalOwn;
let loaded = false;

//------------------------------------------------SERVER BROWSER------------------------------------------------//

//Amsterdam
const amsterdam_01_8080 = new WebSocket('wss://amsterdam-01.usemapsettings.com:8080/server');
const amsterdam_01_8081 = new WebSocket('wss://amsterdam-01.usemapsettings.com:8081/server');
const amsterdam_01_8082 = new WebSocket('wss://amsterdam-01.usemapsettings.com:8082/server');
const amsterdam_01_8083 = new WebSocket('wss://amsterdam-01.usemapsettings.com:8083/server');
const amsterdam_01_8084 = new WebSocket('wss://amsterdam-01.usemapsettings.com:8084/server');
const amsterdam_01_8085 = new WebSocket('wss://amsterdam-01.usemapsettings.com:8085/server');
const practice_amsterdam_01_8086 = new WebSocket('wss://amsterdam-01.usemapsettings.com:8086/server');
const practice_amsterdam_01_8087 = new WebSocket('wss://amsterdam-01.usemapsettings.com:8087/server');

//Frankfurt
const frankfurt_01_8080 = new WebSocket('wss://frankfurt-01.usemapsettings.com:8080/server');
const frankfurt_01_8081 = new WebSocket('wss://frankfurt-01.usemapsettings.com:8081/server');
const frankfurt_01_8082 = new WebSocket('wss://frankfurt-01.usemapsettings.com:8082/server');
const frankfurt_01_8083 = new WebSocket('wss://frankfurt-01.usemapsettings.com:8083/server');
const frankfurt_01_8084 = new WebSocket('wss://frankfurt-01.usemapsettings.com:8084/server');
const frankfurt_01_8085 = new WebSocket('wss://frankfurt-01.usemapsettings.com:8085/server');
const practice_frankfurt_01_8086 = new WebSocket('wss://frankfurt-01.usemapsettings.com:8086/server');
const practice_frankfurt_01_8087 = new WebSocket('wss://frankfurt-01.usemapsettings.com:8087/server');

//New York City
const newyorkcity_02_8080 = new WebSocket('wss://newyorkcity_02.usemapsettings.com:8080/server');
const newyorkcity_02_8081 = new WebSocket('wss://newyorkcity_02.usemapsettings.com:8081/server');
const newyorkcity_02_8082 = new WebSocket('wss://newyorkcity_02.usemapsettings.com:8082/server');
const newyorkcity_02_8083 = new WebSocket('wss://newyorkcity_02.usemapsettings.com:8083/server');
const newyorkcity_02_8084 = new WebSocket('wss://newyorkcity_02.usemapsettings.com:8084/server');
const newyorkcity_02_8085 = new WebSocket('wss://newyorkcity_02.usemapsettings.com:8085/server');
const practice_newyorkcity_02_8086 = new WebSocket('wss://newyorkcity_02.usemapsettings.com:8086/server');
const practice_newyorkcity_02_8087 = new WebSocket('wss://newyorkcity_02.usemapsettings.com:8087/server');
const practice_newyorkcity_02_8088 = new WebSocket('wss://newyorkcity_02.usemapsettings.com:8088/server');
const practice_newyorkcity_02_8089 = new WebSocket('wss://newyorkcity_02.usemapsettings.com:8089/server');

//San Francisco
const sanfrancisco_01_8080 = new WebSocket('wss://sanfrancisco-01.usemapsettings.com:8080/server');
const sanfrancisco_01_8081 = new WebSocket('wss://sanfrancisco-01.usemapsettings.com:8081/server');
const sanfrancisco_01_8082 = new WebSocket('wss://sanfrancisco-01.usemapsettings.com:8082/server');
const sanfrancisco_01_8083 = new WebSocket('wss://sanfrancisco-01.usemapsettings.com:8083/server');
const sanfrancisco_01_8084 = new WebSocket('wss://sanfrancisco-01.usemapsettings.com:8084/server');
const sanfrancisco_01_8085 = new WebSocket('wss://sanfrancisco-01.usemapsettings.com:8085/server');
const practice_sanfrancisco_01_8086 = new WebSocket('wss://sanfrancisco-01.usemapsettings.com:8086/server');
const practice_sanfrancisco_01_8087 = new WebSocket('wss://sanfrancisco-01.usemapsettings.com:8087/server');

//Singapore
const singapore_01_8080 = new WebSocket('wss://singapore-01.usemapsettings.com:8080/server');
const singapore_01_8081 = new WebSocket('wss://singapore-01.usemapsettings.com:8081/server');
const singapore_01_8082 = new WebSocket('wss://singapore-01.usemapsettings.com:8082/server');
const singapore_01_8083 = new WebSocket('wss://singapore-01.usemapsettings.com:8083/server');
const singapore_01_8084 = new WebSocket('wss://singapore-01.usemapsettings.com:8084/server');
const singapore_01_8085 = new WebSocket('wss://singapore-01.usemapsettings.com:8085/server');
const practice_singapore_01_8086 = new WebSocket('wss://singapore-01.usemapsettings.com:8086/server');
const practice_singapore_01_8087 = new WebSocket('wss://singapore-01.usemapsettings.com:8087/server');

//--------------------------------------------------------------------------------------------------------------//

const client = {};

(function() {
    let alert = '%cCONSOLE LAUNCHED';
    let color = 'color:red;';
    let size = 'font-size:20px;';
    console.warn(alert,color+size);
    console.warn(alert,color+size);
    console.warn(alert,color+size);

    const originalWebSocket = window.WebSocket;
    window.WebSocket = function(...args) {
        const ws = new originalWebSocket(...args);
        const originalSend = ws.send;
        const originalOnMessage = ws.onmessage;
        client.ws = ws;

        ws.send = function(data) {
            if (data instanceof ArrayBuffer) {
                const uint8Array = new Uint8Array(data);
                //console.log("Data:",data);
                const decoder = new TextDecoder();
                if(loaded == false){
                    loaded = true;
                    const usernameStartIndex = 6;
                    let usernameEndIndex = usernameStartIndex;
                    while (usernameEndIndex < uint8Array.length && uint8Array[usernameEndIndex] >= 32 && uint8Array[usernameEndIndex] <= 126) {
                        usernameEndIndex++;
                    }
                    console.log('===============================================');
                    console.log(ws);
                    const usernameArray = uint8Array.slice(usernameStartIndex, usernameEndIndex);
                    usernamearray=Array.from(usernameArray);
                    const getUser = decoder.decode(usernameArray).trim().replace(/[^\x20-\x7E]/g, '');
                    console.log('Logged User:', getUser);
                    playername = getUser;
                    ConsoleLoaded(getUser);
                }
                //console.log('Message Data:', uint8Array);
                //select car
                if(selectedCar==0){
                    var car0 = [8, 1, 18, 47, 10, usernamearray.length, ...usernamearray, 18, 28, 109, 53, 120, 117, 114, 120, 100, 65, 49, 71, 90, 85, 71, 104, 50, 82, 112, 50, 78, 70, 79, 84, 73, 82, 90, 110, 106, 49, 24, 230, 6, 32, 0, 56, 1];
                    originalSend.call(this, new Uint8Array(car0));
                    gameInstance.SendMessage('NetworkLayer','SetSkin', selectedCar);
                }
                if (selectedCar == 1) {
                    var car1 = [8, 1, 18, 47, 10, usernamearray.length, ...usernamearray, 18, 28, 109, 53, 120, 117, 114, 120, 100, 65, 49, 71, 90, 85, 71, 104, 50, 82, 112, 50, 78, 70, 79, 84, 73, 82, 90, 110, 106, 49, 24, 230, 6, 32, 1, 56, 1];
                    originalSend.call(this, new Uint8Array(car1));
                    gameInstance.SendMessage('NetworkLayer','SetSkin', selectedCar);
                }
                if (selectedCar == 2) {
                    var car2 = [8, 1, 18, 47, 10, usernamearray.length,...usernamearray, 18, 28, 109, 53, 120, 117, 114, 120, 100, 65, 49, 71, 90, 85, 71, 104, 50, 82, 112, 50, 78, 70, 79, 84, 73, 82, 90, 110, 106, 49, 24, 230, 6, 32, 2, 56, 1];
                    originalSend.call(this, new Uint8Array(car2));
                    gameInstance.SendMessage('NetworkLayer','SetSkin', selectedCar);
                }
                if (selectedCar == 3) {
                    var car3 = [8, 1, 18, 47, 10, usernamearray.length, ...usernamearray, 18, 28, 109, 53, 120, 117, 114, 120, 100, 65, 49, 71, 90, 85, 71, 104, 50, 82, 112, 50, 78, 70, 79, 84, 73, 82, 90, 110, 106, 49, 24, 230, 6, 32, 3, 56, 1];
                    originalSend.call(this, new Uint8Array(car3));
                    gameInstance.SendMessage('NetworkLayer','SetSkin', selectedCar);
                }
                if (selectedCar == 4) {
                    var car4 = [8, 1, 18, 47, 10, usernamearray.length, ...usernamearray, 18, 28, 109, 53, 120, 117, 114, 120, 100, 65, 49, 71, 90, 85, 71, 104, 50, 82, 112, 50, 78, 70, 79, 84, 73, 82, 90, 110, 106, 49, 24, 230, 6, 32, 4, 56, 1];
                    originalSend.call(this, new Uint8Array(car4));
                    gameInstance.SendMessage('NetworkLayer','SetSkin', selectedCar);
                }
                if (selectedCar == 5) {
                    var car5 = [8, 1, 18, 47, 10, usernamearray.length, ...usernamearray, 18, 28, 109, 53, 120, 117, 114, 120, 100, 65, 49, 71, 90, 85, 71, 104, 50, 82, 112, 50, 78, 70, 79, 84, 73, 82, 90, 110, 106, 49, 24, 230, 6, 32, 5, 56, 1];
                    originalSend.call(this, new Uint8Array(car5));
                    gameInstance.SendMessage('NetworkLayer','SetSkin', selectedCar);
                }
                if (selectedCar == 6) {
                    var car6 = [8, 1, 18, 47, 10, usernamearray.length, ...usernamearray, 18, 28, 109, 53, 120, 117, 114, 120, 100, 65, 49, 71, 90, 85, 71, 104, 50, 82, 112, 50, 78, 70, 79, 84, 73, 82, 90, 110, 106, 49, 24, 230, 6, 32, 6, 56, 1];
                    originalSend.call(this, new Uint8Array(car6));
                    gameInstance.SendMessage('NetworkLayer','SetSkin', selectedCar);
                }
                if (selectedCar == 7) {
                    var car7 = [8, 1, 18, 47, 10, usernamearray.length,...usernamearray, 18, 28, 109, 53, 120, 117, 114, 120, 100, 65, 49, 71, 90, 85, 71, 104, 50, 82, 112, 50, 78, 70, 79, 84, 73, 82, 90, 110, 106, 49, 24, 230, 6, 32, 7, 56, 1];
                    originalSend.call(this, new Uint8Array(car7));
                    gameInstance.SendMessage('NetworkLayer','SetSkin', selectedCar);
                }
                if (selectedCar == 8) {
                    var car8 = [8, 1, 18, 47, 10, usernamearray.length, ...usernamearray, 18, 28, 109, 53, 120, 117, 114, 120, 100, 65, 49, 71, 90, 85, 71, 104, 50, 82, 112, 50, 78, 70, 79, 84, 73, 82, 90, 110, 106, 49, 24, 230, 6, 32, 8, 56, 1];
                    originalSend.call(this, new Uint8Array(car8));
                    gameInstance.SendMessage('NetworkLayer','SetSkin', selectedCar);
                }
                if (selectedCar == 9) {
                    var car9 = [8, 1, 18, 47, 10, usernamearray.length, ...usernamearray, 18, 28, 109, 53, 120, 117, 114, 120, 100, 65, 49, 71, 90, 85, 71, 104, 50, 82, 112, 50, 78, 70, 79, 84, 73, 82, 90, 110, 106, 49, 24, 230, 6, 32, 9, 56, 1];
                    originalSend.call(this, new Uint8Array(car9));
                    gameInstance.SendMessage('NetworkLayer','SetSkin', selectedCar);
                }
                if (selectedCar == 10) {
                    var car10 = [8, 1, 18, 47, 10, usernamearray.length, ...usernamearray, 18, 28, 109, 53, 120, 117, 114, 120, 100, 65, 49, 71, 90, 85, 71, 104, 50, 82, 112, 50, 78, 70, 79, 84, 73, 82, 90, 110, 106, 49, 24, 230, 6, 32, 10, 56, 1];
                    originalSend.call(this, new Uint8Array(car10));
                    gameInstance.SendMessage('NetworkLayer','SetSkin', selectedCar);
                }
                if (selectedCar == 11) {
                    var car11 = [8, 1, 18, 47, 10, usernamearray.length, ...usernamearray, 18, 28, 109, 53, 120, 117, 114, 120, 100, 65, 49, 71, 90, 85, 71, 104, 50, 82, 112, 50, 78, 70, 79, 84, 73, 82, 90, 110, 106, 49, 24, 230, 6, 32, 11, 56, 1];
                    originalSend.call(this, new Uint8Array(car11));
                    gameInstance.SendMessage('NetworkLayer','SetSkin', selectedCar);
                }
                if (selectedCar == 12) {
                    var car12 = [8, 1, 18, 47, 10, usernamearray.length, ...usernamearray, 18, 28, 109, 53, 120, 117, 114, 120, 100, 65, 49, 71, 90, 85, 71, 104, 50, 82, 112, 50, 78, 70, 79, 84, 73, 82, 90, 110, 106, 49, 24, 230, 6, 32, 12, 56, 1];
                    originalSend.call(this, new Uint8Array(car12));
                    gameInstance.SendMessage('NetworkLayer','SetSkin', selectedCar);
                }
                if (selectedCar == 13) {
                    var car13 = [8, 1, 18, 47, 10, usernamearray.length, ...usernamearray, 18, 28, 109, 53, 120, 117, 114, 120, 100, 65, 49, 71, 90, 85, 71, 104, 50, 82, 112, 50, 78, 70, 79, 84, 73, 82, 90, 110, 106, 49, 24, 230, 6, 32, 13, 56, 1];
                    originalSend.call(this, new Uint8Array(car13));
                    console.log("Pusher selected");
                    gameInstance.SendMessage('NetworkLayer','SetSkin', selectedCar);
                }
                // NOT AVAILABLE
                // if (selectedCar == 14) {
                //     var car14 = [8, 1, 18, 45, 10, 6, 77, 84, 88, 54, 54, 54, 18, 28, 109, 53, 120, 117, 114, 120, 100, 65, 49, 71, 90, 85, 71, 104, 50, 82, 112, 50, 78, 70, 79, 84, 73, 82, 90, 110, 106, 49, 24, 230, 6, 32, 14, 56, 1];
                //     originalSend.call(this, new Uint8Array(car14));
                // }

                originalSend.call(this, data);
            }  else {
                console.log('Client Request:', data);
                originalSend.call(this, data);
            }
        };

        return ws;
    };

    document.addEventListener('keydown',e=>{
        switch(e.key){
            case'e':
                id('cheatwindow').style.display='block';
                break;
        }});

    const cheat = top.cheat = {

        unknownmessage: (name) => {
            var message = id('cheatinput').value;
            var encoder = new TextEncoder();
            var encodedMessage = encoder.encode(name+message);
            var messageLength = encodedMessage.length;
            var header = [8, 5, 18, messageLength + 5, 8, 223, 18, 18, messageLength];
            var chatArray = new Uint8Array(header.length + messageLength);
            chatArray.set(header);
            chatArray.set(encodedMessage, header.length);
            client.ws.send(new Uint8Array(chatArray));
            //}
        },

        spambymcc: () => {
            //console.log('Spam by MCC');
            var chatarray = [8, 5, 18, 75, 8, 144, 2, 18, 70, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61,
                             61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 83, 80, 65, 77, 32, 66, 89, 32, 35, 77, 67, 67, 61, 61, 61, 61,
                             61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61];
            client.ws.send(new Uint8Array(chatarray));
            client.ws.send(new Uint8Array(chatarray));
            client.ws.send(new Uint8Array(chatarray));
            client.ws.send(new Uint8Array(chatarray));
            client.ws.send(new Uint8Array(chatarray));
            client.ws.send(new Uint8Array(chatarray));
            client.ws.send(new Uint8Array(chatarray));
            client.ws.send(new Uint8Array(chatarray));
            client.ws.send(new Uint8Array(chatarray));
            client.ws.send(new Uint8Array(chatarray));
        },
        clearchat: () => {
            var chatarray = [8, 5, 18, 9, 8, 223, 18, 18, 4, 32, 227, 133, 164];
            client.ws.send(new Uint8Array(chatarray));
            client.ws.send(new Uint8Array(chatarray));
            client.ws.send(new Uint8Array(chatarray));
            client.ws.send(new Uint8Array(chatarray));
            client.ws.send(new Uint8Array(chatarray));
            client.ws.send(new Uint8Array(chatarray));
            client.ws.send(new Uint8Array(chatarray));
            client.ws.send(new Uint8Array(chatarray));
            client.ws.send(new Uint8Array(chatarray));
            client.ws.send(new Uint8Array(chatarray));
            client.ws.send(new Uint8Array(chatarray));
            client.ws.send(new Uint8Array(chatarray));
            client.ws.send(new Uint8Array(chatarray));
        },
    };

    //******************************************Cheat Console UI******************************************//

    window.id = top.id = id => top.document.getElementById(id);
    window.crt = top.crt = crt => top.document.createElement(crt);

    window.infobutton = top.infobutton = (name) => {
        let element = crt('input');
        element.id = 'infobutton';
        element.value = name;
        element.type = 'button';
        element.style = button1_CSS;
        element.style.color = 'lightgreen';
        element.style.cursor='default';
        id('cpage1').appendChild(element);
        const page = id('cpage1');
        page.insertBefore(element, page.firstChild); //Puts the button at the beginning
    };

    window.noteLabel = top.noteLabel = (name, affi, al = 0) => {
        let element = crt('label');
        element.id = 'noteLabel';
        if(alert !=1){
            element.innerText = name;
        }
        element.style.color = '#FE2E2E';
        element.style.cursor='default';
        element.style.position='absolute';
        element.style.marginTop='35%';
        element.style.marginLeft='10px';
        element.style.fontSize='18px';
        id(affi).appendChild(element);

        if (al == 1)
            window.alert(name);
    };

    window.noteLabelWithAlert = top.noteLabelWithAlert = (name, altext, affi, m_top='3%', m_left='92%') => {
        let element = crt('label');
        element.id = 'noteLabel';
        element.innerText = name;
        element.style.color = 'white';
        element.style.cursor='default';
        element.style.position='absolute';
        element.style.marginTop=m_top;
        element.style.marginLeft=m_left;
        element.style.fontSize='18px';
        element.style.background='#333';
        element.style.borderRadius='100%';
        element.style.padding='1px 9px 1px 9px';
        element.style.cursor='pointer';
        id(affi).appendChild(element);
        element.addEventListener('click',()=>{
            window.alert(altext);
        });
    };

    window.generalbutton = top.generalbutton = (name,func=()=>{}) => {
        let element = crt('input');
        element.id = 'generalbutton';
        element.value = name;
        element.type = 'button';
        element.style = button1_CSS;
        element.style.color = 'white';
        element.style.cursor='pointer';
        id('cpage1').appendChild(element);
        element.addEventListener('click', func);
        element.classList.add('generalbutton');
    };

    window.player = top.player = (name, forecolor='white', func = () => {}) => {
        let element = crt('input');
        element.id = 'player';
        element.value = name;
        element.type = 'button';
        element.style = button1_CSS;
        element.style.color = forecolor;
        element.style.cursor = 'pointer';
        id('cpage4').appendChild(element);

        buttonanimations(element);
        element.addEventListener('click', func);
    };

    window.switchteams = top.switchteams = (name, func = () => {}) => {
        let element = crt('input');
        element.id = 'switchteams';
        element.value = name;
        element.type = 'button';
        element.style = button1_CSS;
        element.style.cursor = 'default';
        id('cpage5').appendChild(element);

        buttonanimations(element);
        element.addEventListener('click', func);
    };

    window.tabbutton = top.tabbutton = (name, Id, func=()=>{}) => {
        let element = crt('input');
        element.id = Id;
        element.value = name;
        element.type = 'button';
        element.style = tabs_CSS;
        id('leftsidebar').appendChild(element);
        element.addEventListener('click', func);
    };

    window.cheatbutton1 = top.cheatbutton1 = (name, forecolor, func = () => {}) => {
        let element = crt('input');
        element.id = 'cheatbutton1';
        element.value = name;
        element.type = 'button';
        element.style = button1_CSS;
        element.style.color = forecolor;
        element.style.cursor = 'default';
        id('cpage2').appendChild(element);

        buttonanimations(element);
        element.addEventListener('click', func);
    };

    window.carcheat = top.carcheat = (name, func = () => {}) => {
        let element = crt('input');
        element.id = 'cheatbutton1';
        element.value = name;
        element.type = 'button';
        element.style = button1_CSS;
        element.style.color = 'white';
        element.style.cursor = 'default';
        id('cpage3').appendChild(element);

        buttonanimations(element);
        element.addEventListener('click', func);
    };

    window.cheatinput = top.cheatinput = () => {
        let element = crt('input');
        element.id = 'cheatinput';
        element.placeholder='Enter message...';
        element.value = name;
        element.style = input_CSS;
        id('cpage2').appendChild(element);
    };

    function buttonanimations(elem){
        elem.addEventListener('mouseover', () => elem.style = button1_CSS_hover);
        elem.addEventListener('mouseout', () => elem.style = button1_CSS);
        elem.addEventListener('mousedown', () => elem.style = button1_CSS_down);
        elem.addEventListener('mouseup', () => elem.style = button1_CSS);
    }

    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey) {
            event.stopPropagation();
            event.stopImmediatePropagation();
        }
    }, true);

    //---Styles---//

    const cheatWindow_CSS = `
        display:block;
        background: #1a1b16;
        border-radius: 15px;
        border: 1px #646464 solid;
        width: 600px;
        height: 400px;
        z-index: 99999;
        position:absolute;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
        box-shadow:0px 0px 5px 5px #333333;
    `;

    const windowtitle_CSS = `
        height:6%;
        background:#161616;
        top:0;
        left:0;
        right:0;
        border-top-left-radius:15px;
        border-top-right-radius:15px;
        color:white;
        text-align:center;
        font-size:130%;
        padding:1%;
    `;

    const closewindow_CSS = `
        height:6%;
        background:red;
        width:6%;
        top:0;
        right:0;
        border-top-right-radius:15px;
        color:white;
        text-align:center;
        font-size:20px;
        padding:1%;
        position:absolute;
        cursor:pointer;
    `;

    const cpages_CSS = `
        display: grid;
        height:91%;
        width:435px;
        background:transparent;
        right:0;
        bottom:0;
        color:white;
        position:absolute;
        border-bottom-right-radius:15px;
        grid-template-columns:1fr 1fr;
        grid-template-rows:1fr 1fr 1fr 1fr 1fr;
        z-index:10;
        overflow-x:hidden;
        overflow-y:auto;
    `;

    const aboutpage_CSS = `
        display: block;
        height:91%;
        width:435px;
        background:transparent;
        right:0;
        bottom:0;
        color:white;
        position:absolute;
        border-bottom-right-radius:15px;
        z-index:10;
        overflow-x:hidden;
        overflow-y:auto;
    `;

    const cpages_CSS_block = `
        display: block;
        height:91%;
        width:435px;
        background:transparent;
        right:0;
        bottom:0;
        color:white;
        border-bottom-right-radius:15px;
        grid-template-columns:1fr 1fr;
        grid-template-rows:1fr 1fr 1fr 1fr 1fr;
        z-index:10;
        overflow-x:hidden;
        overflow-y:auto;
    `;

    const button1_CSS = `
        border-radius:15px;
        background:#333333;
        border:none;
        height:auto;
        width:90%;
        padding:10px;
        margin:10px;
        font-size:16px;
        cursor:pointer;
        color:white;
    `;

    const button1_CSS_hover = `
        border-radius:15px;
        background:#404040;
        border:none;
        height:auto;
        width:90%;
        padding:10px;
        margin:10px;
        font-size:16px;
        cursor:pointer;
        color:white;
    `;

    const button1_CSS_down = `
        border-radius:15px;
        background:#282828;
        border:none;
        height:auto;
        width:90%;
        padding:10px;
        margin:10px;
        font-size:16px;
        cursor:pointer;
        color:white;
    `;

    const input_CSS = `
        border-radius:15px;
        background:#252525;
        border:none;
        height:auto;
        width:180px;
        padding:10px;
        margin:10px;
        font-size:16px;
        color:white;
    `;

    const left_sidebar = `
        display: grid;
        height:91%;
        width:25%;
        background:#111111;
        left:0;
        bottom:0;
        color:white;
        position:absolute;
        border-bottom-left-radius:15px;
        grid-template-columns:1fr;
        grid-template-rows:1fr 1fr 1fr 1fr 1fr 1fr;
        z-index:12;
    `;
    const tabs_CSS = `
        width:auto;
        background:transparent;
        left:0;
        right:0;
        color:white;
        border:none;
        border-bottom:1px #252525 solid;
    `;

    const tabs_CSS_active = `
        width:auto;
        background:#222;
        left:0;
        right:0;
        color:white;
        border:none;
        border-bottom:1px #252525 solid;
    `;

    const tabs_CSS_hover = `
        width:auto;
        background:#666;
        left:0;
        right:0;
        color:white;
        border:none;
        border-bottom:1px #252525 solid;
    `;

    //---Content---//

    const cwindow = document.createElement("div");
    cwindow.id = 'cheatwindow';
    cwindow.style = cheatWindow_CSS;
    cwindow.style.display='none';
    document.body.appendChild(cwindow);

    const el = id('cheatwindow');
    let offsetX, offsetY;

    const cwindow_title = document.createElement("div");
    cwindow_title.id = 'cheatwindowtitle';
    cwindow_title.style = windowtitle_CSS;
    cwindow_title.style.userSelect='none';
    cwindow_title.innerText = 'Masterix BumpyBall Client';
    id('cheatwindow').appendChild(cwindow_title);
    cwindow_title.addEventListener('mousedown', function(e){
        offsetX = e.clientX - el.offsetLeft;
        offsetY = e.clientY - el.offsetTop;

        document.addEventListener('mouseup', stopMoving);
        document.addEventListener('mousemove', startMoving);
    });

    function startMoving(e){
        el.style.left = e.clientX - offsetX + "px";
        el.style.top = e.clientY - offsetY + "px";
    }

    function stopMoving(e){
        document.removeEventListener('mouseup', stopMoving);
        document.removeEventListener('mousemove', startMoving);
    }

    const close_cwindow = document.createElement("div");
    close_cwindow.id = 'close_cwindow';
    close_cwindow.style = closewindow_CSS;
    close_cwindow.innerText = 'X';
    id('cheatwindowtitle').appendChild(close_cwindow);
    close_cwindow.addEventListener('click', () => {
        id('cheatwindow').style.display = 'none';
    });

    const leftsidebar = document.createElement("div");
    leftsidebar.id = 'leftsidebar';
    leftsidebar.style = left_sidebar;
    id('cheatwindow').appendChild(leftsidebar);

    const cpage1 = document.createElement("div");
    cpage1.id = 'cpage1';
    cpage1.style = cpages_CSS;
    id('cheatwindow').appendChild(cpage1);

    const cpage2 = document.createElement("div");
    cpage2.id = 'cpage2';
    cpage2.style = cpages_CSS;
    cpage2.style.display='none';
    id('cheatwindow').appendChild(cpage2);

    const cpage3 = document.createElement("div");
    cpage3.id = 'cpage3';
    cpage3.style = cpages_CSS;
    cpage3.style.display='none';
    id('cheatwindow').appendChild(cpage3);

    const cpage4 = document.createElement("div");
    cpage4.id = 'cpage4';
    cpage4.style = cpages_CSS;
    cpage4.style.display='none';
    id('cheatwindow').appendChild(cpage4);

    const cpage5 = document.createElement("div");
    cpage5.id = 'cpage5';
    cpage5.style = cpages_CSS;
    cpage5.style.display='none';
    id('cheatwindow').appendChild(cpage5);

    const cpage6 = document.createElement("div");
    cpage6.id = 'cpage6';
    cpage6.style = aboutpage_CSS;
    cpage6.innerHTML=`
    <h3>About</h3>

    <p> Creator: Masterix<br>
        Version: 1.0<br>
        Release date: 13th August 2024<br><br>
        Thanks for using my cheat client. <3
    </p>

    <div class="aboutButtonsDIV">
        <button class="sm_button" onclick="javascript:window.open('https://youtube.com/@masterix9944');"><img class="sm_image" src="https://www.google.com/s2/favicons?sz=64&domain=youtube.com"></img>Masterix</button>
        <button class="sm_button" onclick="javascript:window.open('https://www.youtube.com/@whiztech200');"><img class="sm_image" src="https://www.google.com/s2/favicons?sz=64&domain=youtube.com"></img>WhizTech</button>
        <button class="sm_button" onclick="javascript:window.open('https://www.instagram.com/whiztechh/');"><img class="sm_image" src="https://www.google.com/s2/favicons?sz=64&domain=instagram.com"></img>WhizTech</button>
    </div>

    <style>
    h3{
        text-align:center;
        padding-bottom:0px;
    }
    p{
        margin-top:-50px;
    }
    .sm_button{
        border-radius:15px;
        background:#333;
        border:none;
        color:white;
        height:40px;
        width:93%;
        align-items:center;
        justify-content: center;
        display:flex
    }
    .sm_image{
        height:20px;
        margin-right:10px;
    }
    .sm_button:hover{
        background:#444;
        cursor:pointer;
    }
    .aboutButtonsDIV{
        display:grid;
        margin-top:-30px;
        grid-template-columns:1fr 1fr;
        grid-template-rows:0.5fr;
    }
    </style>`;
    cpage6.style.display='none';
    id('cheatwindow').appendChild(cpage6);

    //***********************************************************************************************************************//

    function control(key, code, whichkeycode, delay){
        controlinterval = setInterval(() => {
            const event = new KeyboardEvent('keydown', {
                key: key,
                code: code,
                which: whichkeycode,
                keyCode: whichkeycode,
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(event);
        }, delay);
    };

    function controlOwn(key, code, whichkeycode, delay){
        controlintervalOwn = setInterval(() => {
            const event = new KeyboardEvent('keydown', {
                key: key,
                code: code,
                which: whichkeycode,
                keyCode: whichkeycode,
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(event);
        }, delay);
    }

    function KeyW_down() {
        const event = new KeyboardEvent('keydown', { key: 'w', code: 'KeyW', which: 87, keyCode: 87, bubbles: true, cancelable: true });
        document.dispatchEvent(event);
    }

    function KeyW_up() {
        const event = new KeyboardEvent('keyup', { key: 'w', code: 'KeyW', which: 87, keyCode: 87, bubbles: true, cancelable: true });
        document.dispatchEvent(event);
    }

    function KeyA_down() {
        const event = new KeyboardEvent('keydown', { key: 'a', code: 'KeyA', which: 65, keyCode: 65, bubbles: true, cancelable: true });
        document.dispatchEvent(event);
    }

    function KeyA_up() {
        const event = new KeyboardEvent('keyup', { key: 'a', code: 'KeyA', which: 65, keyCode: 65, bubbles: true, cancelable: true });
        document.dispatchEvent(event);
    }

    function KeyS_down() {
        const event = new KeyboardEvent('keydown', { key: 's', code: 'KeyS', which: 83, keyCode: 83, bubbles: true, cancelable: true });
        document.dispatchEvent(event);
    }

    function KeyS_up() {
        const event = new KeyboardEvent('keyup', { key: 's', code: 'KeyS', which: 83, keyCode: 83, bubbles: true, cancelable: true });
        document.dispatchEvent(event);
    }

    function KeyD_down() {
        const event = new KeyboardEvent('keydown', { key: 'd', code: 'KeyD', which: 68, keyCode: 68, bubbles: true, cancelable: true });
        document.dispatchEvent(event);
    }

    function KeyD_up() {
        const event = new KeyboardEvent('keyup', { key: 'd', code: 'KeyD', which: 68, keyCode: 68, bubbles: true, cancelable: true });
        document.dispatchEvent(event);
    }

    let autogascheat = crt('input');
    autogascheat.id = 'autogascheat';
    autogascheat.value = 'Auto Gas: OFF';
    autogascheat.type = 'button';
    autogascheat.style = button1_CSS;
    id('cpage4').appendChild(autogascheat);

    buttonanimations(autogascheat);
    autogascheat.addEventListener('click', ()=>{

        if (autogascheat.value == 'Auto Gas: OFF') {
            autogascheat.value = 'Auto Gas: ON';
            control('w', 'KeyW', 87, 0);
        }

        else if (autogascheat.value == 'Auto Gas: ON') {
            clearInterval(controlinterval);
            KeyW_up();
            autogascheat.value = 'Auto Gas: OFF';
        }
    });

    let startinstruction = crt('input');
    startinstruction.id = 'startinstruction';
    startinstruction.value = 'Start Set';
    startinstruction.type = 'button';
    startinstruction.style = button1_CSS;
    startinstruction.style.border = '1px #666 solid';
    id('cpage4').appendChild(startinstruction);

    startinstruction.addEventListener('click', () => {
        let duration = id('instructiondurationinput').value;
        if (startinstruction.value == 'Start Set' && id('instructionlistbox').value != 0 && id('instructiondurationinput').value != 0) {
            startinstruction.value = 'Stop Set';
            var cmd = instructionlistbox.value.split('\n');
            for (let i = 0; i < cmd.length; i++) {
                setTimeout(() => {
                    switch (cmd[i]) {
                        case 'forward':
                            KeyA_up();
                            KeyD_up();
                            KeyS_up();

                            KeyW_up();
                            KeyW_down();
                            break;
                        case 'left':
                            KeyW_up();
                            KeyD_up();
                            KeyS_up();

                            KeyA_up();
                            KeyA_down();
                            break;
                        case 'right':
                            KeyA_up();
                            KeyW_up();
                            KeyS_up();

                            KeyD_up();
                            KeyD_down();
                            break;
                        case 'backward':
                            KeyA_up();
                            KeyW_up();
                            KeyD_up();

                            KeyS_up();
                            KeyS_down();
                            break;
                        case 'stop':
                            KeyA_up();
                            KeyW_up();
                            KeyD_up();
                            KeyS_up();
                            break;
                    }
                }, (i+1) * duration);
            }
        } else if (startinstruction.value == 'Stop Set') {
            KeyA_up();
            KeyW_up();
            KeyD_up();
            KeyS_up();
            startinstruction.value = 'Start Set';
        }

        else {
            window.alert("Please provide a value in the input fields.");
            startinstruction.value = 'Start Set';
        }
    });

    let instructionlabel = crt('label');
    instructionlabel.innerText='Instruction Set';
    instructionlabel.style.gridColumn='span 2';
    instructionlabel.style.marginTop='15px';
    instructionlabel.style.marginLeft='15px';
    id('cpage4').appendChild(instructionlabel);

    let instructiondurationinput = crt('input');
    instructiondurationinput.id='instructiondurationinput';
    instructiondurationinput.innerText='Instruction Set';
    instructiondurationinput.style = input_CSS;
    instructiondurationinput.style.gridColumn='span 2';
    instructiondurationinput.style.marginTop='12.5%';
    instructiondurationinput.style.marginLeft='210px';
    instructiondurationinput.style.position='fixed';
    instructiondurationinput.style.height='15px';
    instructiondurationinput.placeholder='Set duration (in ms) ...';
    id('cpage4').appendChild(instructiondurationinput);

    let instructionlistbox = crt('textarea');
    instructionlistbox.id='instructionlistbox';
    instructionlistbox.type='textarea';
    instructionlistbox.style=input_CSS;
    instructionlistbox.style.marginTop='-30px';
    instructionlistbox.placeholder=`Example:\nforward\nleft\nstop\nbackward\nright\n...`;
    instructionlistbox.style.resize='none';
    instructionlistbox.style.height='200px';
    instructionlistbox.style.width='380px';
    instructionlistbox.style.fontSize='16px';
    instructionlistbox.style.gridColumn='span 2';
    instructionlistbox.style.gridRow='span 3';
    id('cpage4').appendChild(instructionlistbox);

    noteLabelWithAlert('i', 'Five commands can be specified in an instruction set.\nThey are as follows:\n'+
                       'forward\nbackward\nleft\nright\nstop\n\n'+
                       'In the text field for set duration, a number in milliseconds must be entered for how long a command should be executed.\nFor example, the car moves forward for 5 seconds (5000 ms).\n\n'+
                       'The syntax is kept simple, one command per line (example is displayed in the text field).', 'cpage4', '19%', '40%');

    //*******************************************************************************************************************************************//

    const teamblue = [8, 5, 18, 15, 8, 223, 18, 18, 10, 47, 116, 101, 97, 109, 32, 98, 108, 117, 101];
    const teamred = [8, 5, 18, 13, 8, 6, 18, 9, 47, 116, 101, 97, 109, 32, 114, 101, 100];
    const teamspect = [8, 5, 18, 20, 8, 223, 18, 18, 15, 47, 116, 101, 97, 109, 32, 115, 112, 101, 99, 116, 97, 116, 111, 114];

    switchteams('Team Blue',()=>{
        client.ws.send(new Uint8Array(teamblue));
    });

    switchteams('Team Red',()=>{
        client.ws.send(new Uint8Array(teamred));
    });

    switchteams('Team Spectator',()=>{
        client.ws.send(new Uint8Array(teamspect));
    });

    let autoteambutton = crt('input');
    autoteambutton.id = 'autoteambutton';
    autoteambutton.value = 'Team Switch: OFF';
    autoteambutton.type = 'button';
    autoteambutton.style = button1_CSS;
    autoteambutton.style.color = 'white';
    autoteambutton.style.cursor = 'default';
    id('cpage5').appendChild(autoteambutton);
    buttonanimations(autoteambutton);
    let autoteaminterval;
    autoteambutton.addEventListener('click', ()=>{
        if(autoteambutton.value =='Team Switch: OFF'){
            let switchFlag = true;
            autoteambutton.value ='Team Switch: ON';
            autoteaminterval = setInterval(() => {
                if (switchFlag) {
                    client.ws.send(new Uint8Array(teamblue));
                } else {
                    client.ws.send(new Uint8Array(teamred));
                }
                switchFlag = !switchFlag;
            }, 150);
        }else if(autoteambutton.value =='Team Switch: ON'){
            autoteambutton.value ='Team Switch: OFF'
            clearInterval(autoteaminterval);
        }
    });
    noteLabel('Only works in practice servers.','cpage5',0);

    //***********************************************************************************************************************//

    generalbutton('Quit Game',()=>{
        gameInstance.Quit();
    });
    generalbutton('Sign Out',()=>{
        firebase.auth().signOut();
    });
    generalbutton('Change Player Name',()=>{
        var playername = prompt('Change player name:');
        gameInstance.SendMessage('GameCanvas', 'SetPlayerNameExternal', playername );
    });
    cheatinput();

    let checkboxname = crt('input');
    checkboxname.id='checkbox';
    checkboxname.type='checkbox';
    checkboxname.name='checkbox';
    checkboxname.style.height='20px';
    checkboxname.style.marginLeft = '-170px';
    let chklabel = crt('label');
    chklabel.htmlFor = 'checkbox';
    chklabel.innerText = 'Send With Name';
    chklabel.style.marginTop = '5px';
    chklabel.style.marginLeft = '-180px';
    cheatbutton1('Send Message', 'white', () => {
        if (checkboxname.checked){cheat.unknownmessage(playername+": ");}
        else{cheat.unknownmessage('');}
    });
    id('cpage2').appendChild(checkboxname);
    id('cpage2').appendChild(chklabel);
    cheatbutton1('SPAM BY #MCC', 'white', () => {cheat.spambymcc();});
    cheatbutton1('Clear Chat', 'white', () => {cheat.clearchat();});

    noteLabelWithAlert('i', 'Choose a car before you join a server!\n\nSometimes selected vehicles are not taken over and you only get the standard vehicle (default).\nRejoining a few times or reloading the game often helps.','cpage3');
    const selectedcarLabel = document.createElement("label");
    selectedcarLabel.id = 'selectedcarLabel';
    selectedcarLabel.innerText='Selected Vehicle:';
    selectedcarLabel.style.margin='13px';
    selectedcarLabel.style.fontSize='18px';
    selectedcarLabel.style.gridColumn = 'span 2';
    id('cpage3').appendChild(selectedcarLabel);

    carcheat('Standard',()=>{
        selectedCar=0;
        selectedcarLabel.innerText='Selected Vehicle: Standard';
    });

    carcheat('Cruiser',()=>{
        selectedCar=1;
        selectedcarLabel.innerText='Selected Vehicle: Cruiser';
    });

    carcheat('Tricked Out',()=>{
        selectedCar=2;
        selectedcarLabel.innerText='Selected Vehicle: Tricked Out';
    });

    carcheat('Bugged Out',()=>{
        selectedCar=3;
        selectedcarLabel.innerText='Selected Vehicle: Bugged Out';
    });
    carcheat('Taxi Cab',()=>{
        selectedCar=4;
        selectedcarLabel.innerText='Selected Vehicle: Taxi Cab';
    });

    carcheat('Hot Rod',()=>{
        selectedCar=5;
        selectedcarLabel.innerText='Selected Vehicle: Hot Rod';
    });

    carcheat('Drag Racer',()=>{
        selectedCar=6;
        selectedcarLabel.innerText='Selected Vehicle: Drag Racer';
    });

    carcheat('Classic',()=>{
        selectedCar=7;
        selectedcarLabel.innerText='Selected Vehicle: Classic';
    });

    carcheat('Soccer Van',()=>{
        selectedCar=8;
        selectedcarLabel.innerText='Selected Vehicle: Soccer Van';
    });

    carcheat('Cement Mixer',()=>{
        selectedCar=9;
        selectedcarLabel.innerText='Selected Vehicle: Cement Mixer';
    });

    carcheat('Apocalypse',()=>{
        selectedCar=10;
        selectedcarLabel.innerText='Selected Vehicle: Apocalypse';
    });

    carcheat('Dump Truck',()=>{
        selectedCar=11;
        selectedcarLabel.innerText='Selected Vehicle: Dump Truck';
    });

    carcheat('Steam Roller',()=>{
        selectedCar=12;
        selectedcarLabel.innerText='Selected Vehicle: Steam Roller';
    });

    carcheat('Pusher',()=>{
        selectedCar=13;
        selectedcarLabel.innerText='Selected Vehicle: Pusher';
    });

    tabbutton('General', 'genTab',()=>{
        cpage1_open();
    });
    tabbutton('Player', 'playerTab',()=>{
        cpage4_open();
    });
    tabbutton('Teams', 'teamsTab',()=>{
        cpage5_open();
    });
    tabbutton('Game Chat', 'gchatTab',()=>{
        cpage2_open();
    });
    tabbutton('Unlock Vehicles', 'uvehiclesTab',()=>{
        cpage3_open();
    });
    tabbutton('About', 'aboutTab',()=>{
        cpage6_open();
    });

    function ConsoleLoaded(user){
        infobutton('User: '+user);
    }

    function cpage1_open(){
        id('genTab').style=tabs_CSS_active;
        cpage1.style.display='grid'; //open

        var tabs =[id('playerTab'), id('teamsTab'), id('gchatTab'), id('uvehiclesTab'), id('aboutTab')];
        var pages =[cpage2,cpage3,cpage4,cpage5,cpage6];

        tabs.forEach(tab =>{tab.style=tabs_CSS;});
        id('aboutTab').style.borderBottomLeftRadius='15px';
        pages.forEach(page =>{page.style.display='none';});

    }

    function cpage2_open(){
        id('gchatTab').style=tabs_CSS_active;
        cpage2.style.display='grid'; //open

        var tabs =[id('genTab'), id('playerTab'), id('teamsTab'), id('uvehiclesTab'), id('aboutTab')];
        var pages =[cpage1,cpage3,cpage4,cpage5,cpage6];

        tabs.forEach(tab =>{tab.style=tabs_CSS;});
        id('aboutTab').style.borderBottomLeftRadius='15px';
        pages.forEach(page =>{page.style.display='none';});
    }

    function cpage3_open(){
        id('uvehiclesTab').style=tabs_CSS_active;
        cpage3.style.display='grid'; //open

        var tabs =[id('genTab'), id('playerTab'), id('teamsTab'), id('gchatTab'), id('aboutTab')];
        var pages =[cpage1,cpage2,cpage4,cpage5,cpage6];

        tabs.forEach(tab =>{tab.style=tabs_CSS;});
        id('aboutTab').style.borderBottomLeftRadius='15px';
        pages.forEach(page =>{page.style.display='none';});
    }

    function cpage4_open(){
        id('playerTab').style=tabs_CSS_active;
        cpage4.style.display='grid'; //open

        var tabs =[id('genTab'), id('uvehiclesTab'), id('teamsTab'), id('gchatTab'), id('aboutTab')];
        var pages =[cpage1,cpage2,cpage3,cpage5,cpage6];

        tabs.forEach(tab =>{tab.style=tabs_CSS;});
        id('aboutTab').style.borderBottomLeftRadius='15px';
        pages.forEach(page =>{page.style.display='none';});
    }

    function cpage5_open(){
        id('teamsTab').style=tabs_CSS_active;
        cpage5.style.display='grid'; //open

        var tabs =[id('genTab'), id('uvehiclesTab'), id('playerTab'), id('gchatTab'), id('aboutTab')];
        var pages =[cpage1,cpage2,cpage3,cpage4,cpage6];

        tabs.forEach(tab =>{tab.style=tabs_CSS;});
        id('aboutTab').style.borderBottomLeftRadius='15px';
        pages.forEach(page =>{page.style.display='none';});
    }

    function cpage6_open(){
        id('aboutTab').style=tabs_CSS_active;
        id('aboutTab').style.borderBottomLeftRadius='15px';
        cpage6.style.display='grid'; //open

        var tabs =[id('genTab'), id('uvehiclesTab'), id('playerTab'), id('gchatTab'), id('teamsTab')];
        var pages =[cpage1,cpage2,cpage3,cpage4,cpage5];

        tabs.forEach(tab =>{tab.style=tabs_CSS;});
        pages.forEach(page =>{page.style.display='none';});
    }

    //**********************OTHER STYLE INITS**********************//

    id('aboutTab').style.borderBottomLeftRadius='15px';
})();












