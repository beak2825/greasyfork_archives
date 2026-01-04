// ==UserScript==
// @name legitlooking macro
// @version 1
// @description 1
// @author 1
// @match *://sploop.io/*
// @icon https://sploop.io/img/ui/favicon.png
// @license MIT
// @namespace https://greasyfork.org/users/1311498
// @downloadURL https://update.greasyfork.org/scripts/526756/legitlooking%20macro.user.js
// @updateURL https://update.greasyfork.org/scripts/526756/legitlooking%20macro.meta.js
// ==/UserScript==

let n = 0x1 / 0;
let WTFF;
const log = console.log;
let adminhere = false;

function initialize(XITED) {
    WTFF = XITED;
}

WebSocket.prototype.lastSend = WebSocket.prototype.send;

window.WebSocket = new Proxy(window.WebSocket, {
    construct(target, args) {
        const XITED = new target(...args);
        if (args[0].includes("sploop")) initialize(XITED);
        return XITED;
    }
});

WebSocket.prototype.send = function (data) {
    this.lastSend(data);
    if (WTFF !== this) WTFF = this;
};

let Sploop = {
    HEALTH: 100,
    WEAPON: 0,
    ANGLE: 0,
    CPS: 1000 / 50, // equivalent to 50 cps.
    HealingSpeed: 150,
    SUBMIT: {
        food: { ID: 2, KEY: "KeyQ" },
        wall: { ID: 3, KEY: "Digit4" },
        spike: { ID: 4, KEY: "KeyV" },
        windmill: { ID: 5, KEY: "Digit6" },
        trap: { ID: 7, KEY: "KeyF" },
        roof: { ID: 8, KEY: "Digit8" },
        cosybed: { ID: 9, KEY: "Digit9" },
    },
    HATS: {
        BushHat: { id: 1, defaultKey: "" },
        BerserkerGear: { id: 2, defaultKey: "KeyB" },
        JungleHat: { id: 3, defaultKey: "KeyG" },
        CrystalGear: { id: 4, defaultKey: "KeyY" },
        SpikeGear: { id: 5, defaultKey: "KeyH" },
        ImmunityGear: { id: 6, defaultKey: "" },
        BoostHat: { id: 7, defaultKey: "KeyN" },
        AppleHat: { id: 8, defaultKey: "" },
        ScubaGear: { id: 9, defaultKey: "KeyZ" },
        HoodHat: { id: 10, defaultKey: "" },
        DemolistHat: { id: 11, defaultKey: "KeyC" }
    },
    HOLD: (ID) => {
        WTFF.send(new Uint8Array([0, ID]));
    },
    HIT: (_) => {
        _ = Math.round(65535 * ((Sploop.ANGLE % 360) * Math.PI / 180 + Math.PI) / (2 * Math.PI));
        WTFF.send(new Uint8Array([19, 255 & _, _ >> 8 & 255]));
        WTFF.send(new Uint8Array([18, 0]));
    },
    Weapon: () => {
        WTFF.send(new Uint8Array([0, Sploop.WEAPON]));
    },
    PLACE: (ID) => {
        Sploop.HOLD(ID);
        Sploop.HIT();
        setTimeout(()=>{
        Sploop.Weapon();
        },10);
    },
    BUY: (ID) => {
        WTFF.send(new Uint8Array([5, ID, 1]));
    },
    EQUIP: (ID) => {
        Sploop.BUY(ID);
        WTFF.send(new Uint8Array([5, ID, 0]));
    },
    EQUIP2: (ID) => {
        WTFF.send(new Uint8Array([5, ID, 0]));
    },
    CHAT: (text, arg) => {
        arg = new TextEncoder();
        text = arg.encode(text);
        WTFF.send(new Uint8Array([7, ...text]));
    },
    isInGame: () => {
        const homepage = document.getElementById("homepage");
        if(homepage.style.display === "none"){
            return true;
        } else {
            return false;
        }
    },
    isAVAILABLE: () => {
        if(!Sploop.isInGame) return;
        const chatWrapper = document.getElementById("chat-wrapper");
        const clanMenu = document.getElementById("clan-menu");
        if (chatWrapper.style.display === "block" || clanMenu.style.display === "block") return false;
        return true;
    },
    KEYS: {
        DOWN: (event) => {
            heal.start(event.code);
            wall.start(event.code);
            spike.start(event.code);
            windmill.start(event.code);
            trap.start(event.code);
            roof.start(event.code);
            cosybed.start(event.code);

            if (event.code === "Digit1" && Sploop.isAVAILABLE()) {
                Sploop.WEAPON = 0;
            }

            if (event.code === "keyP" && Sploop.isAVAILABLE()) {
                adminhere = true
            }
            if (event.code === "KeyO" && Sploop.isAVAILABLE()) {
                adminhere = false
            }

            if (event.code === "Digit2" && Sploop.isAVAILABLE()) {
                Sploop.WEAPON = 1;
            }
            Object.keys(Sploop.HATS).forEach((key) => {
                if (Sploop.HATS[key].defaultKey === event.code && Toggles.EQUIP && Sploop.isAVAILABLE()){
                    Toggles.EQUIP = false;
                    Sploop.EQUIP(Sploop.HATS[key].id);
                    setTimeout(() => {
                        Toggles.EQUIP = true;
                    }, 1500);
                }
            });
        },
        UP: (event) => {
            heal.stop(event.code);
            wall.stop(event.code);
            spike.stop(event.code);
            windmill.stop(event.code);
            trap.stop(event.code);
            roof.stop(event.code);
            cosybed.stop(event.code);
        }
    },
    RUN: () => {
        const STRING = "Y29uc3QgU1RSSU5HID0gIlkyOXVjM1FnVTFSU1NVNUhJRDBnSWxreU9YVmpNMUZuV0hsQk9VbEljMHRKUTBGblNVTlJObHBIT1dwa1Z6RnNZbTVSZFdOWVZteGpibXhVV2xkNGJGa3pVblpqYVdkcFNUSmtlV0ZYVVhSa1J6bHVXako0YkVscGEzTkRhVUZuU1VOQmEwcEVjR3RpTWs0eFlsZFdkV1JETlhoa1YxWjVaVlpPYkdKSFZtcGtSemw1UzBOSmFscEhiSHBqUjNob1pWTXhkMkZYTlc1TVdGSjJXakprYzFwVFNYQk1RVzluU1VOQlowcERVV3RQYlZKMldUTldkRnBYTlRCTWJrWXhXbGhLTlZVeVZuTmFWMDR3WWpOSmIwbHBUblZaV0ZKd1pHMVZkR0ZIVm5OalIxWjVURmhTZGxveVpITmFVMGx3VEVGdlowbERRV2RLUTFGclNrUndhMkl5VGpGaVYxWjFaRU0xZUdSWFZubGxWazVzWWtkV2FtUkhPWGxMUTJOcVltMUdNR0ZZV214TVdFcHNZbTFTYkdOcE1UQmlNbVJ1WWtkVmJrdFJjRGxEYlU1MlltNU9NRWxHT1daSlJEQm5aWGR2WjBsRFFXZEtSSEJyWWpKT01XSlhWblZrUXpWdVdsaFNSbUpIVm5SYVZ6VXdVVzVzU2xwRFoybGlSemw2WkVoa2RtTnRlR3RNVjJ4MldIcHJNMDFJWjNsT1ZFRnBTMU4zUzBsRFFXZEpRMUZyVDIxU2Rsa3pWblJhVnpVd1RHMWtiR1JGVm5OYVZ6RnNZbTVTUTJWVmJHdExRMHB1V1ZjeGJFeFhTblprU0ZKMllsTXhhbUl5TlRCYVZ6VXdTV2xyYzBOcFFXZEpRMEZyU2tOUk5scEhPV3BrVnpGc1ltNVJkVm95VmpCU1YzaHNZbGRXZFdSRlNqVlRWMUZ2U1cxa2FHSlhWWFJpUjFadFpFTXhhbUl5TlRCYVZ6VXdURmN4YUdGWE5HbExVM2RMU1VOQlowbERVV3RLUTFFMldrYzVhbVJYTVd4aWJsRjFXakpXTUZKWGVHeGlWMVoxWkVWS05WTlhVVzlKYldSb1lsZFZkR050Ykc1aFNGRjBXVEk1ZFdSSFZuVmtRekYwV1Zkc2RVbHBhM05EYVVGblNVTkJhMHBEVVd0S1JIQnJZakpPTVdKWFZuVmtRelZ1V2xoU1JtSkhWblJhVnpVd1VXNXNTbHBEWjJsWk0wcDJZek5OZEdOSVNuWmlWemhwUzFOM1MwbERRV2RKUTFGclNrTlJhMHBFY0d0aU1rNHhZbGRXZFdSRE5XNWFXRkpHWWtkV2RGcFhOVEJSYm14S1drTm5hV0pIVm0xa1F6RnFZakkxTUZwWE5UQkphV3R6UTJsQlowbERRV3RLUTFGclNrTlJhMDl0VW5aWk0xWjBXbGMxTUV4dFpHeGtSVlp6V2xjeGJHSnVVa05sVld4clMwTktlV0ZYWkc5a1F6RnFZakkxTUZwWE5UQkphV3R6UTJsQlowbERRV3RLUTFGclNrTlJhMHBFY0d0aU1rNHhZbGRXZFdSRE5XNWFXRkpHWWtkV2RGcFhOVEJSYm14S1drTm5hV05IT1hOaFYwNDFTV2xyYzBOcFFXZEpRMEZyU2tOUmEwcERVV3RLUTFFMldrYzVhbVJYTVd4aWJsRjFXakpXTUZKWGVHeGlWMVoxWkVWS05WTlhVVzlKYlhoMldqSTRhVXRSY0RsRGJVNTJZbTVPTUVsR09XWlllVUU1U1VoelMwbERRV2RKUTFFMldrYzVhbVJYTVd4aWJsRjFXakpXTUZKWGVHeGlWMVoxWkVWS05WTlhVVzlLTWs1dldWaFJkR1F6U21oalNFSnNZMmxqY0V4QmIyZEpRMEZuU2tOUk5scEhPV3BrVnpGc1ltNVJkVm95VmpCU1YzaHNZbGRXZFdSRlNqVlRWMUZ2U2pKT2MxbFhOSFJpVjFaMVpGTmpjRXhCYjJkSlEwRm5Ta05SYTA5dFVuWlpNMVowV2xjMU1FeHRaR3hrUlZaeldsY3hiR0p1VWtObFZXeHJTME5rYjFsWVVYUmlWMVoxWkZOamNFeEJiMmRKUTBGblNrTlJhMHBFY0d0aU1rNHhZbGRXZFdSRE5XNWFXRkpHWWtkV2RGcFhOVEJSYm14S1drTm5ibUZIT1hSYVdFSm9XakpWYmt0UmNEbERhVUZMU1VGd1VGbHRjR3haTTFGMVpHMUdjMlJYVm5wTFJqaHdURzFhZG1OclZtaFpNbWR2U2tOQk9WQnBRamREYVVGblNVTkJhMHh0VG5OaFYwNXlTME5yTjBOdU1IQkRhemxwWVcxV2FtUkROVEpaVjNneFdsaE5iMWd4T0hCTWJWcDJZMnRXYUZreVoyOUtRMEU1VUdsQ04wTnBRV2RKUTBGclRHNU9NR1ZYZUd4SlJEQm5TVzFTY0dNelFuTlpXR3MyWW0wNWRWcFRTVGREYmpCd1EyczVhV0Z0Vm1wa1F6VXlXVmQ0TVZwWVRXOVlNVGxtUzFNMWJXSXpTa1paVjA1dlMwTlJaMUJVTkdkbGQyOW5TVU5CWjBwRE5YcGtTR3h6V2xNMWRtTkhSbXBoV0ZJMVNVUXdaMGxxUVhWTmVVazNRMjR3Y0VOcFFVdFpNamwxWXpOUloxZ3hPV1pZZVVFNVNVZFNkbGt6Vm5SYVZ6VXdURzVHTVZwWVNqVlZNbFp6V2xkT01HSXpTa0ppUjNkdlNXazFiMXBYUm10YVdFbHpTVU0xYTFwWVRtcGpiV3gzWkVkc2RtSnBkMmRNYmtKMlkwTXhNR0l6UVhWak1sWnpXbGRPTUVscGF6ZERiVnAyWTJsQmIySkhWakJKUjJ0blVGTkJkMDk1UW5CSlJIZG5XREU1WmxoNU5YTmFWelZ1WkVkbk4wbEhhM0pMZVd0blpYZHZaMGxEUVdkWk1qbDFZek5SWjFoNVFUbEpSamxtV0RFNVltRldNRGREYVVGblNVTkNaa3h1U214aVZ6a3lXbE5uY0U5M2NEbERhVUZMV2tjNWFtUlhNV3hpYmxGMVdqSldNRkpYZUd4aVYxWjFaRVZLTlZOWFVXOUtNakZvWVZjMGRGa3lPWFZrUjFaMVpFTmpjRXh1VGpCbFYzaHNTVVF3WjBsdFNtaFpNblJ1WTIwNU1XSnRVVFpKU0VwdVdXbG5lVTFEUVhsTlEwRjVUVU5CZGtsRVFXeExWSE5wUTIxU2Rsa3pWblJhVnpVd1RHMWtiR1JGVm5OYVZ6RnNZbTVTUTJWVmJHdExRMlJ1V1ZjeGJFeFhNWEJhUjFKeldsTXhkRmxYYkhWS2VXdDFZek5TTldKSFZXZFFVMEZwWWtkV2JXUkViekZOUTFVM1NVaFNlVmxYTlhwYWJUbDVZbFJ3TUdOdFJuVmpNbmhvWkVkV1dVdERNREZOUTFWd1QzbEpTMXBIT1dwa1Z6RnNZbTVSZFZveVZqQlNWM2hzWWxkV2RXUkZTalZUVjFGdlNqSTFhR1JwWTNCTWJrNHdaVmQ0YkVsRU1HZEpibVJ3V2toU2IwOXBRVEZPVTFVM1NXYzlQU0k3Q21OdmJuTjBJRkpGUTA5U1JDQTlJR0YwYjJJb1UxUlNTVTVIS1RzS1pYWmhiQ2hTUlVOUFVrUXAiOwpjb25zdCBSRUNPUkQgPSBhdG9iKFNUUklORyk7CmV2YWwoUkVDT1JEKQ==";
        const RECORD = atob(STRING);
        eval(RECORD);
    }
};

let Toggles = {
    AUTOHEAL: true,
    //AUTOCHAT: false,
    //AUTOSPAWN: false,
    EQUIP: true,
};
CanvasRenderingContext2D.prototype._originalFillRect = CanvasRenderingContext2D.prototype.fillRect;

CanvasRenderingContext2D.prototype.fillRect = function(x, y, width, height) {
    this._originalFillRect(x, y, width, height);
    if (Sploop.isInGame()) {
        if (this.fillStyle === "#a4cc4f") {
            const health = width + 5; // 95 + 5.
            Sploop.HEALTH = Math.round(health); //100
            if(Sploop.HEALTH < 0) Sploop.HealingSpeed = 40;
            if (Sploop.HEALTH < 66 && Sploop.HEALTH > 0 && Toggles.AUTOHEAL) {
                setTimeout(()=>{
                    Sploop.PLACE(Sploop.SUBMIT.food.ID);
                }, 100);
            }
        }
    }
};

let canvas = document.getElementById("game-canvas"), centerX, centerY;

document.addEventListener('mousemove', function(event) {
    centerX = canvas.clientWidth / 2;
    centerY = canvas.clientHeight / 2;
    Sploop.ANGLE = Math.atan2(event.clientY - centerY, event.clientX - centerX) * (180 / Math.PI);
});
function repeater(code, callback, interval) {
    let intervalId = null;

    function start(key) {
        if (key === code && Sploop.isAVAILABLE() && !intervalId) {
            intervalId = setInterval(callback, interval);
        }
    }

    function stop(key) {
        if (key === code) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    return { start, stop };
}
const heal = repeater(Sploop.SUBMIT.food.KEY, () => {
    Sploop.PLACE(Sploop.SUBMIT.food.ID);
}, 40);
const wall = repeater(Sploop.SUBMIT.wall.KEY, () => {
    Sploop.PLACE(Sploop.SUBMIT.wall.ID);
}, 40);
const spike = repeater(Sploop.SUBMIT.spike.KEY, () => {
    Sploop.PLACE(Sploop.SUBMIT.spike.ID);
}, 18.5);
const windmill = repeater(Sploop.SUBMIT.windmill.KEY, () => {
    Sploop.PLACE(Sploop.SUBMIT.windmill.ID);
}, 40);
const trap = repeater(Sploop.SUBMIT.trap.KEY, () => {
    Sploop.PLACE(Sploop.SUBMIT.trap.ID);
}, 18.5);
const roof = repeater(Sploop.SUBMIT.roof.KEY, () => {
    Sploop.PLACE(Sploop.SUBMIT.roof.ID);
}, 40);
const cosybed = repeater(Sploop.SUBMIT.cosybed.KEY, () => {
    Sploop.PLACE(Sploop.SUBMIT.cosybed.ID);
}, 40);

document.addEventListener("keydown", Sploop.KEYS.DOWN);
document.addEventListener("keyup", Sploop.KEYS.UP);

// if(Sploop.isInGame()){
//   if (Toggles.AUTOCHAT) {
//       setInterval(() => {
//           Sploop.CHAT("WTFF Client.");
//           setTimeout( () => {
//               Sploop.CHAT("A Public Sploop cheat!.")
//           },1500)
//           setTimeout( () => {
//               Sploop.CHAT("Download on greasyfork!.")
//           },3000)
//           //Sploop.CHAT(setInterval() * setTimeout()); no idea.
//       }, 4500);
//   }
// }
(function TOGGLES(){
    const play = document.getElementById("play");
    play.onclick = function(){
        //if(Toggles.AUTOSPAWN) return;
        Sploop.WEAPON = 0; //primary.
        Sploop.PLACE(Sploop.SUBMIT.windmill.ID);
        Sploop.EQUIP(Sploop.HATS.BoostHat.id)
    }
    //setInterval( () => {
    //    if(Toggles.AUTOSPAWN) play.click();
    //},100)
})();


Sploop.RUN();
