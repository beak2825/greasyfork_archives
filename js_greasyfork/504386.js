// ==UserScript==
// @name           ST Spamer
// @description    gartic powerful spammer
// @version        1.0
// @author         STRAGON
// @license        N/A
// @match          *://gartic.io/*
// @match          *://*/*?__cpo=aHR0cHM6Ly9nYXJ0aWMuaW8
// @icon           https://static.cdnlogo.com/logos/s/96/st.svg
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_addValueChangeListener
// @grant          GM_addStyle
// @grant          GM_openInTab
// @namespace      https://greasyfork.org/en/users/1353946-stragon-x
// @downloadURL https://update.greasyfork.org/scripts/504386/ST%20Spamer.user.js
// @updateURL https://update.greasyfork.org/scripts/504386/ST%20Spamer.meta.js
// ==/UserScript==



(function() {
    let originalSend = WebSocket.prototype.send, setTrue = false;
    window.wsObj = {};

    WebSocket.prototype.send = function(data) {
        console.log("Gönderilen Veri: " + data);
        originalSend.apply(this, arguments);
        if (Object.keys(window.wsObj).length == 0) {
            window.wsObj = this;
            window.eventAdd();
        }
    };

    window.eventAdd = () => {
        if (!setTrue) {
            setTrue = 1;
            window.wsObj.addEventListener("message", (msg) => {
                try {
                    let data = JSON.parse(msg.data.slice(2));
                    console.log(data);
                    if (data[0] == 5) {
                        window.wsObj.lengthID = data[1];
                        window.wsObj.id = data[2];
                        window.wsObj.roomCode = data[3];
                    }
                } catch (err) {}
            });
        }
    };

    var buttonss = document.createElement("button");
buttonss.style.position = "fixed";
buttonss.style.right = "2px";
buttonss.style.top = "17%";
buttonss.style.transform = "translateY(-50%)";
buttonss.style.background = "red";
buttonss.style.color = "white";
buttonss.style.border = "none";
buttonss.style.padding = "10px 20px";
buttonss.style.borderRadius = "10px";
buttonss.style.cursor = "pointer";
buttonss.style.zIndex = "99999";
buttonss.style.borderRadius = "100px";
buttonss.style.border = "3px solid black";

buttonss.innerHTML = "&#8592;";

buttonss.addEventListener("click", function() {

  if (panel.style.display === "none" && panel1.style.display === "none" && panel2.style.display === "none") {

    panel.style.display = "block";
    panel1.style.display = "block";
    panel2.style.display = "block";
    panelr.style.display = "block";
    var svg = button3.querySelector('svg');
    var svgx = button1.querySelector('svg');
    var svgy = button2.querySelector('svg');

   svg.setAttribute('stroke', '#ff0000');
   svgy.setAttribute('stroke', '#ff0000');
   svgx.setAttribute('stroke', '#ffffff');
    buttonss.innerHTML = "&#8592;";

  } else {

    panelr.style.display = "none";
    panel.style.display = "none";
    panel1.style.display = "none";
    panel2.style.display = "none";
    buttonss.innerHTML = "&#8594;"; // Change the icon back to a left-facing arrow
  }
});

document.body.appendChild(buttonss);

var panelr = document.createElement("div");
panelr.style.width = "45px";
panelr.style.height = "127px";
panelr.style.backgroundColor = "#000";
panelr.style.borderRadius = "50px";
panelr.style.border = "2px solid #FF0000";
panelr.style.position = "fixed";
panelr.style.right = "7px";
panelr.style.top = "19.5%";
panelr.id = "panelr";
panelr.style.display = "flex";
panelr.style.flexDirection = "column";
panelr.style.justifyContent = "center";
panelr.style.alignItems = "center";
panelr.style.textAlign = "center";
panelr.style.zIndex = "99999";


// Create three buttons
var button1 = document.createElement("button");
button1.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' width='27' height='27' viewBox='0 0 24 24' fill='none' stroke='#ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M20 9v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9'/><path d='M9 22V12h6v10M2 10.6L12 2l10 8.6'/></svg>";
button1.style.marginBottom = "10px";
button1.style.marginTop = "7px";
button1.style.zIndex = "99999";
button1.addEventListener("click", function() {

    var svg = button3.querySelector('svg');
    var svgx = button2.querySelector('svg');
    var svgy = button1.querySelector('svg');


   svg.setAttribute('stroke', '#ff0000');
   svgx.setAttribute('stroke', '#ff0000');
   svgy.setAttribute('stroke', '#ffffff');

    panel.style.display = "block";
    panel1.style.display = "none";
    panel2.style.display = "none";

});

var button2 = document.createElement("button");
button2.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#ff0000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'></path></svg>";
button2.style.marginBottom = "10px";
button2.style.marginTop = "01px";
button2.style.zIndex = "99999";
button2.addEventListener("click", function() {

    var svg = button3.querySelector('svg');
    var svgx = button2.querySelector('svg');
    var svgy = button1.querySelector('svg');


   svg.setAttribute('stroke', '#ff0000');
   svgx.setAttribute('stroke', '#ffffff');
   svgy.setAttribute('stroke', '#ff0000');

    panel.style.display = "none";
    panel1.style.display = "block";
    panel2.style.display = "none";

});


let panel = document.createElement("div");
panel.style.position = "fixed";
panel.style.top = "15%";
panel.style.right = "63px";
panel.style.width = "180px";
panel.style.height = "150px";
panel.style.backgroundColor = "#000";
panel.style.borderRadius = "10px";
panel.style.padding = "8px";
panel.style.zIndex = "1000";
panel.style.textAlign = "center";
panel.style.border = "2px solid red";
panel.style.zIndex = "9999999";
panel.style.display = "block";

var field1 = document.createElement("input");
field1.type = "text";
field1.style.width = "85%";
field1.style.height = "10px";
field1.style.backgroundColor = "#000";
field1.style.border = "2px solid #fff";
field1.style.padding = "10px";
field1.style.marginBottom = "5px";
field1.style.zIndex = "999999";
field1.style.borderRadius = "5px";
field1.style.color = "#fff";
field1.placeholder = "message 1";

var field2 = document.createElement("input");
field2.type = "text";
field2.style.width = "85%";
field2.style.height = "10px";
field2.style.backgroundColor = "#000";
field2.style.border = "2px solid #fff";
field2.style.padding = "10px";
field2.style.marginBottom = "5px";
field2.style.zIndex = "999999";
field2.style.borderRadius = "5px";
field2.style.color = "#fff";
field2.placeholder = "message 2";

var field3 = document.createElement("input");
field3.type = "text";
field3.style.width = "85%";
field3.style.height = "10px";
field3.style.backgroundColor = "#000";
field3.style.border = "2px solid #fff";
field3.style.padding = "10px";
field3.style.marginBottom = "5px";
field3.style.zIndex = "999999";
field3.style.borderRadius = "5px";
field3.style.color = "#fff";
field3.placeholder = "message 3";


var buttonx = document.createElement("button");
buttonx.style.width = "98%";
buttonx.style.height = "30px";
buttonx.style.backgroundColor = "red";
buttonx.style.color = "#fff";
buttonx.style.border = "none";
buttonx.style.borderRadius = "5px";
buttonx.style.cursor = "pointer";
buttonx.innerHTML = "Start";


panel.appendChild(field1);
panel.appendChild(field2);
panel.appendChild(field3);
panel.appendChild(buttonx);

document.body.appendChild(panel);

let intervalId = null;
let isRunning = false;

buttonx.addEventListener('click', () => {
    if (!isRunning) {
        startScript();
        buttonx.innerHTML = 'Stop';
        isRunning = true;
    } else {
        clearInterval(intervalId);
        buttonx.innerHTML = 'Start';
        isRunning = false;
    }

});





function startScript() {

    intervalId = setInterval(function() {
        const invisibleChar = String.fromCharCode(8203);
        const randomInvisibleChars = invisibleChar.repeat(Math.floor(Math.random() * 3) + 1);
        const message1 = `42[11,${window.wsObj.id},"${field1.value}"]`;
        const message2 = `42[11,${window.wsObj.id},"${field2.value}${randomInvisibleChars}"]`;
        const message3 = `42[11,${window.wsObj.id},"${field3.value}"]`;
        window.wsObj.send(message1);
        window.wsObj.send(message2);
        window.wsObj.send(message3);
    }, 2450);

}

    let panel1 = document.createElement("div");
panel1.style.position = "fixed";
panel1.style.top = "15%";
panel1.style.right = "63px";
panel1.style.width = "180px";
panel1.style.height = "150px";
panel1.style.backgroundColor = "#000";
panel1.style.borderRadius = "10px";
panel1.style.padding = "8px";
panel1.style.zIndex = "1000";
panel1.style.textAlign = "center";
panel1.style.border = "2px solid red";
panel1.style.zIndex = "999999";
panel1.style.display = "none";

var field1x = document.createElement("input");
field1x.type = "text";
field1x.style.width = "85%";
field1x.style.height = "10px";
field1x.style.backgroundColor = "#000";
field1x.style.border = "2px solid #fff";
field1x.style.padding = "10px";
field1x.style.marginBottom = "5px";
field1x.style.zIndex = "999999";
field1x.style.borderRadius = "5px";
field1x.style.color = "#fff";
field1x.placeholder = "Answer 1";

var field2x = document.createElement("input");
field2x.type = "text";
field2x.style.width = "85%";
field2x.style.height = "10px";
field2x.style.backgroundColor = "#000";
field2x.style.border = "2px solid #fff";
field2x.style.padding = "10px";
field2x.style.marginBottom = "5px";
field2x.style.zIndex = "999999";
field2x.style.borderRadius = "5px";
field2x.style.color = "#fff";
field2x.placeholder = "Answer 2";

var field3x = document.createElement("input");
field3x.type = "text";
field3x.style.width = "85%";
field3x.style.height = "10px";
field3x.style.backgroundColor = "#000";
field3x.style.border = "2px solid #fff";
field3x.style.padding = "10px";
field3x.style.marginBottom = "5px";
field3x.style.zIndex = "999999";
field3x.style.borderRadius = "5px";
field3x.style.color = "#fff";
field3x.placeholder = "Answer 3";


var buttonxx = document.createElement("button");
buttonxx.style.width = "98%";
buttonxx.style.height = "30px";
buttonxx.style.backgroundColor = "red";
buttonxx.style.color = "#fff";
buttonxx.style.border = "none";
buttonxx.style.borderRadius = "5px";
buttonxx.style.cursor = "pointer";
buttonxx.innerHTML = "Start";


panel1.appendChild(field1x);
panel1.appendChild(field2x);
panel1.appendChild(field3x);
panel1.appendChild(buttonxx);

document.body.appendChild(panel1);

let intervalIdx = null;
let isRunningx = false;

buttonxx.addEventListener('click', () => {
    if (!isRunningx) {
        startScriptx();
        buttonxx.innerHTML = 'Stop';
        isRunningx = true;
    } else {
        clearInterval(intervalIdx);
        buttonxx.innerHTML = 'Start';
        isRunningx = false;
    }

});

function startScriptx() {

    intervalIdx = setInterval(function() {
        const invisibleChar = String.fromCharCode(8203);
        const randomInvisibleChars = invisibleChar.repeat(Math.floor(Math.random() * 3) + 1);
        const message1 = `42[13,${window.wsObj.id},"${field1x.value}"]`;
        const message2 = `42[13,${window.wsObj.id},"${field2x.value}${randomInvisibleChars}"]`;
        const message3 = `42[13,${window.wsObj.id},"${field3x.value}"]`;
        window.wsObj.send(message1);
        window.wsObj.send(message2);
        window.wsObj.send(message3);
    }, 450);

}

let panel2 = document.createElement("div");
panel2.style.position = "fixed";
panel2.style.top = "15%";
panel2.style.right = "63px";
panel2.style.width = "180px";
panel2.style.height = "150px";
panel2.style.backgroundColor = "#000";
panel2.style.borderRadius = "10px";
panel2.style.padding = "8px";
panel2.style.zIndex = "1000";
panel2.style.textAlign = "center";
panel2.style.border = "2px solid red";
panel2.style.zIndex = "99999";
panel2.style.display = "none";

var field1y = document.createElement("input");
field1y.type = "text";
field1y.style.width = "85%";
field1y.style.height = "10px";
field1y.style.backgroundColor = "#000";
field1y.style.border = "2px solid #fff";
field1y.style.padding = "10px";
field1y.style.marginBottom = "5px";
field1y.style.zIndex = "999999";
field1y.style.borderRadius = "5px";
field1y.style.color = "#fff";
field1y.placeholder = "Broadcast 1";

var field2y = document.createElement("input");
field2y.type = "text";
field2y.style.width = "85%";
field2y.style.height = "10px";
field2y.style.backgroundColor = "#000";
field2y.style.border = "2px solid #fff";
field2y.style.padding = "10px";
field2y.style.marginBottom = "5px";
field2y.style.zIndex = "999999";
field2y.style.borderRadius = "5px";
field2y.style.color = "#fff";
field2y.placeholder = "Broadcast 2";

var field3y = document.createElement("input");
field3y.type = "text";
field3y.style.width = "85%";
field3y.style.height = "10px";
field3y.style.backgroundColor = "#000";
field3y.style.border = "2px solid #fff";
field3y.style.padding = "10px";
field3y.style.marginBottom = "5px";
field3y.style.zIndex = "999999";
field3y.style.borderRadius = "5px";
field3y.style.color = "#fff";
field3y.placeholder = "Broadcast 3";


var buttonxxx = document.createElement("button");
buttonxxx.style.width = "98%";
buttonxxx.style.height = "30px";
buttonxxx.style.backgroundColor = "red";
buttonxxx.style.color = "#fff";
buttonxxx.style.border = "none";
buttonxxx.style.borderRadius = "5px";
buttonxxx.style.cursor = "pointer";
buttonxxx.innerHTML = "Start";


panel2.appendChild(field1y);
panel2.appendChild(field2y);
panel2.appendChild(field3y);
panel2.appendChild(buttonxxx);

document.body.appendChild(panel2);

let intervalIdxx = null;
let intervalIdy = null;
let isRunningxx = false;

buttonxxx.addEventListener('click', () => {
    if (!isRunningxx) {
        startScripts();
        buttonxxx.innerHTML = 'Stop';
        isRunningxx = true;

    } else {
        clearInterval(intervalIdxx);
        clearInterval(intervalIdy);
        buttonxxx.innerHTML = 'Start';
        isRunningxx = false;

    }
});

function startScripts() {
    intervalIdxx = setInterval(() => {
        executeScriptxx();
    }, 450);

    intervalIdy = setInterval(() => {
        executeScripty();
    }, 2450);
}

function executeScriptxx() {
    const invisibleChar = String.fromCharCode(8203);
    const randomInvisibleChars = invisibleChar.repeat(Math.floor(Math.random() * 3) + 1);
    const message1 = `42[13,${window.wsObj.id},"${field1y.value}"]`;
    const message2 = `42[13,${window.wsObj.id},"${field2y.value}${randomInvisibleChars}"]`;
    const message3 = `42[13,${window.wsObj.id},"${field3y.value}"]`;
    window.wsObj.send(message1);
    window.wsObj.send(message2);
    window.wsObj.send(message3);
}

function executeScripty() {
    const invisibleChar = String.fromCharCode(8203);
    const randomInvisibleChars = invisibleChar.repeat(Math.floor(Math.random() * 3) + 1);
    const message4 = `42[11,${window.wsObj.id},"${field1y.value}"]`;
    const message5 = `42[11,${window.wsObj.id},"${field2y.value}${randomInvisibleChars}"]`;
    const message6 = `42[11,${window.wsObj.id},"${field3y.value}"]`;
    window.wsObj.send(message4);
    window.wsObj.send(message5);
    window.wsObj.send(message6);
}


var button3 = document.createElement("button");
button3.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#ff0000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'></path><polyline points='22,6 12,13 2,6'></polyline></svg>";
button3.style.marginBottom = "7px";
button3.style.zIndex = "99999";

button3.addEventListener("click", function() {

    var svg = button3.querySelector('svg');
    var svgx = button2.querySelector('svg');
    var svgy = button1.querySelector('svg');

   svg.setAttribute('stroke', '#ffffff');
   svgx.setAttribute('stroke', '#ff0000');
   svgy.setAttribute('stroke', '#ff0000');

    panel.style.display = "none";
    panel1.style.display = "none";
    panel2.style.display = "block";

});

// Add buttons to panel
panelr.appendChild(button1);
panelr.appendChild(button2);
panelr.appendChild(button3);

// Add panel to body
document.body.appendChild(panelr);



})();