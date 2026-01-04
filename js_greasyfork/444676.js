// ==UserScript==
// @name         Bonk Camera Controls
// @version      1.1.2
// @author       Shaunxx & AA1134
// @description  Adds camera movement and speed adjustment to replays
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-start
// @grant        none
// @license      GPL-3.0
// @namespace    https://greasyfork.org/en/users/911845
// @downloadURL https://update.greasyfork.org/scripts/444676/Bonk%20Camera%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/444676/Bonk%20Camera%20Controls.meta.js
// ==/UserScript==

const injectorName = `Camera`;
const errorMsg = `Whoops! ${injectorName} was unable to load.
This may be due to an update to Bonk.io. If so, please report this error!
This could also be because you have an extension that is incompatible with \
${injectorName}`;

function injector(src){
  let newSrc = src;

  // replay speed slider
  const slider = document.getElementById("bgreplay_timescrub")
  slider.style.visibility = "inherit"
  slider.max = 2
  slider.step = 0.1
  // replaces screen shake with camera pan
  let screenshake = `if(L1Q.shk && (L1Q.shk.x != 0 || L1Q.shk.y != 0)){this.shakeTweenGroup.removeAll();var p1Q=new TWEEN.Tween(this.shakeTweenObject,this.shakeTweenGroup);var Y1Q=50;var C1Q=800;p1Q.to({x:L1Q.shk.x,y:L1Q.shk.y},Y1Q);p1Q.easing(TWEEN.Easing.Cubic.Out);p1Q.onComplete(()=>{var m1Q=new TWEEN.Tween(this.shakeTweenObject,this.shakeTweenGroup);m1Q.to({x:0,y:0},C1Q);m1Q.easing(TWEEN.Easing.Elastic.Out);G9b.g9b();m1Q.start();});p1Q.start();}`
  newSrc = newSrc.replace(screenshake, `
                var render = this
                window.moveCamera = function() {
                    if (render.isReplay == "replay") {
                        render.shakeTweenGroup.removeAll();
                        var p1Q = new TWEEN.Tween(render.shakeTweenObject, render.shakeTweenGroup);
                        p1Q.to({
                            x: cameraX,
                            y: cameraY
                        }, 0);
                        p1Q.easing(TWEEN.Easing.Cubic.Out);
                        p1Q.start();
                    }
                }
                `)

    // function spam xd
   newSrc = newSrc.replace("I8yy[443628]=(function(){", `I8yy[443628] = (function() {
    var keys = {}
    n = 20
    function handleKeyPress(evt) {
        let { keyCode, type } = evt || Event;
        let isKeyDown = (type == 'keydown');
        keys[keyCode] = isKeyDown;
        if (isKeyDown && keys[104])       {                     // NUMPAD_UP
            if (keys[100])                { moveTwo(n, n);   }  // NUMPAD_LEFT
            else if (keys[102])           { moveTwo(-n, n);  }  // MUMPAD_RIGHT
            else                          { cameraY += n;    }
        }else if (isKeyDown && keys[98])  {                     // NUMPAD_DOWN
            if (keys[100])                { moveTwo(n, -n);  }  // NUMPAD_LEFT
            else if (keys[102])           { moveTwo(-n, -n); }  // NUMPAD_RIGHT
                else                      { cameraY -= n;    }
        }else if (isKeyDown && keys[100]) { cameraX += n;    }  // NUMPAD_LEFT
        else if (isKeyDown && keys[102])  { cameraX -= n;    }  // NUMPAD_RIGHT
        else if (isKeyDown && keys[101])  { resetCamera()    }  // NUMPAD_CENTER
        else if (isKeyDown && keys[103])  { changeZoom(-1)   }  // NUMPAD_HOME
        else if (isKeyDown && keys[105])  { changeZoom(1)    }  // NUMPAD_PGUP
        else                              { return;          }
        window.moveCamera();
    };

    function moveTwo(x, y) {
        cameraX += x
        cameraY += y
    }
    function changeZoom(n) {
        if (1/(n*0)===1/0) {
            zoom1 -= 50
            zoom2 -= 50
        }
        else {
            zoom1 += 50
            zoom2 += 50
        }
    }
    function resetCamera() {
        cameraX = 0;
        cameraY = 0;
    }
    window.addEventListener("keyup", handleKeyPress);
    window.addEventListener("keydown", handleKeyPress);
    cameraX = 0
    cameraY = 0
`)

  if(src === newSrc) throw "Injection failed!";
  console.log(injectorName+" injector run");
  return newSrc;
}

// Compatibility with Excigma's code injector userscript
if(!window.bonkCodeInjectors) window.bonkCodeInjectors = [];
window.bonkCodeInjectors.push(bonkCode => {
	try {
		return injector(bonkCode);
	} catch (error) {
		alert(errorMsg);
		throw error;
	}
});
