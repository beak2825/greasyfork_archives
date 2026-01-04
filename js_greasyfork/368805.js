// ==UserScript==
// @name        Intel Passcode Mod
// @namespace   IntelMod
// @description Intel Mod
// @include     https://ingress.com/intel
// @version     0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/368805/Intel%20Passcode%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/368805/Intel%20Passcode%20Mod.meta.js
// ==/UserScript==
// Just pray it works
var codes = [];
var oldCodes = [];

function pressEnter()
  {
	try
	{
	  // Create the key press event.
	  var pressEvent = document.createEvent('KeyboardEvent');
	  pressEvent.initKeyEvent("keypress", true, true, window, 
								false, false, false, false, 
								0, 13);

	  var input = document.getElementById('redeem'); // Get the element where you want to press.
	  input.dispatchEvent(pressEvent); // Press the key.
	}
	catch (e) {
		alert (e.message);
	}
  }
  
function sendCode(code) {
    console.log("sending code " + code);
    document.getElementById('redeem').value = code;
    pressEnter();
    console.log("var oldCodes = " + JSON.stringify(oldCodes) + ";");
    console.log("var codes = " + JSON.stringify(codes) + ";");

    setTimeout(function () {
        console.log(document.getElementById('redeem').innerText);
        if ( document.getElementById('dialog-anon-2') && document.getElementById('dialog-anon-2').innerText.indexOf('too hot') > 0 ) {
            console.log("paused code sending for a while...");
            setTimeout(nextCode, 60*30*1000);
        }
        else {
            setTimeout(nextCode, 10000+(Math.random()*5000));
        }
    }, 15000);
}

function nextCode () {
    code = codes.shift();
    if ( code ) {
        sendCode(code);
    }
    else {
        setTimeout(nextCode, 10000);
    }
}


function addCode (code) {
    code = String(code).replace(/[^a-zA-Z0-9]/g, '').toLowerCase().trim();
    if ( code && codes.indexOf(code) === -1 && oldCodes.indexOf(code) !== -1 ) {
        codes.push(code);
    }
    else {
        console.log("invalid code or already known");
    }
}

nextCode();

codes = ["ncw63agent886nz","svo76react439um","HGG75SKEPSIS896NO","shu72xm559zq","hrf47jormungand985zx","WYT27NOT828RM","XFU27AMONGUS276XF","YXU97NOW726DS","tbq79murder785fk","nks35kureze225ub","nqj96denial256yw","ysh33complex482hc","qbm47covcom572vk","PEO84IMPROVE543EX","HUM85UNBOUNDED977UK","jzz94ken867pm","jfv26i595xr","skn87congo762pr","oft62transpose496jv","gbq79mystery945ne","ppg49ghost467pv","rop58darkxm559re"];