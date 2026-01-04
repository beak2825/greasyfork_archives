// ==UserScript==
// @name         valetudo joystick control
// @description  control your vacuum cleaner with joystick!
// @version      0.1
// @author       57r31
// @match        http://192.168.1.43
// @grant        none
// @namespace https://greasyfork.org/users/684324
// @downloadURL https://update.greasyfork.org/scripts/410435/valetudo%20joystick%20control.user.js
// @updateURL https://update.greasyfork.org/scripts/410435/valetudo%20joystick%20control.meta.js
// ==/UserScript==

//window.addEventListener("gamepadconnected", (joy) => console.log(joy.gamepad));

function joyControl() {
    try {
        const Y = navigator.getGamepads()[0].axes[2].toFixed(2)
        const X = navigator.getGamepads()[0].axes[1].toFixed(2)
        //console.log(X,Y)

        if (window.manualControlEnabled) {
            //console.log('moving', Y/10, X/10)
            window.manualMoveRobot(Y/-2,X/5*-1)
        }
    } catch(e) {}
}

const haveJoy = navigator.getGamepads()
if (!haveJoy || haveJoy.length === 0) return
else setInterval(joyControl, 300)



