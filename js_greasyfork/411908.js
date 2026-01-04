// ==UserScript==
// @name         Astral's Toolbox
// @namespace    your mom
// @version      69.69
// @description  "toolbox" for various practical purposes
// @author       Astral
// @match        ://diep.io/*
// @downloadURL https://update.greasyfork.org/scripts/411908/Astral%27s%20Toolbox.user.js
// @updateURL https://update.greasyfork.org/scripts/411908/Astral%27s%20Toolbox.meta.js
// ==/UserScript==

///NET PREDICT
var enabled = true
const movementbutton = document.createElement("button");

        movementbutton.style = 'background:#C0C0C0';
        movementbutton.style.position = "relative";
     
   const textNode1 = document.createTextNode('Net Predict');

    movementbutton.appendChild(textNode1);

      movementbutton.addEventListener("click", () => {

        enabled = !enabled
        if (enabled === true){

          input.set_convar('net_predict_movement', false);
        
       
        } else {

            input.set_convar('net_predict_movement', true);
        }
      })
     var enabled = false

   
///UPGRADES
var enabled = true
const upgrades = document.createElement("button");

        upgrades.style = 'background:#A9A9A9'
        upgrades.style.position = 'relative';

    const textNode2 = document.createTextNode('Ren Upgrades');

     upgrades.appendChild(textNode2)

      upgrades.addEventListener("click", () => {

        enabled = !enabled
        if (enabled === true){

          input.set_convar('ren_upgrades', false);
        
       
        } else {

            input.set_convar('ren_upgrades', true);
        }
      })
     var enabled = false


///OUTLINES
var enabled = true
const outlines = document.createElement("button");

        outlines.style = 'background:#808080'
        outlines.style.position = 'relative';

    const textNode3 = document.createTextNode('Outline');

     outlines.appendChild(textNode3)

      outlines.addEventListener("click", () => {

        enabled = !enabled
        if (enabled === true){

          input.set_convar("ren_stroke_soft_color", false);
        
       
        } else {

            input.set_convar("ren_stroke_soft_color", true);
        }
      })
     var enabled = false

const br1 = document.createElement('br');
const br2 = document.createElement('br');

///GLOW
var enabled = true;
var click1 = false;

  const glow = document.createElement("button");

  glow.style = 'background:#FFFFFF'
  glow.style.position = 'relative';

    const textNode8 = document.createTextNode('Glow Theme');

    glow.appendChild(textNode8)

    glow.addEventListener("click", () => {
        enabled = !enabled
        if (enabled === true) {

            input.set_convar('ren_background', false);
            input.set_convar('ren_health_background_color', 0x292929);
            input.set_convar('ren_border_color', 0xffffff);
            input.set_convar('ren_stroke_soft_color_intensity', 0);
            input.set_convar('ren_border_color_alpha', 0.1);

            (async function() {

                let h = document.getElementById("canvas");

                let nigr = h.getContext("2d");

                nigr.strokeCopy = (nigr.stroke);

                if (click1 === false) {
                    nigr.prev = nigr.strokeCopy;

                    nigr.stroke = function() {
                        nigr.prev();
                    };


                    let h2 = document.createElement("canvas");
                    let nigr2 = h2.getContext("2d");

                    h2.width = h.width
                    h2.height = h.height
                    h2.style.position = "absolute"

                    h2.style.top = "0px";
                    h2.style.left = "0px";
                    h2.style.zIndex = -2;

                    document.getElementsByTagName('body')[0].appendChild(h2);
                    h2.style.filter = "opacity(85%) blur(5px) brightness(140%)";
                    h2.style.width = "100%";
                    h2.style.height = "100%";

                    h.style.filter = "brightness(125%) contrast(100%) saturation(140%)";

                    let h3 = document.createElement("canvas");
                    let nigr3 = h3.getContext("2d");

                    h3.width = h.width;
                    h3.height = h.height;

                    h3.style.position = "absolute";

                    h3.style.top = "0px";
                    h3.style.left = "0px";
                    h3.style.zIndex = -3;


                    document.getElementsByTagName('body')[0].appendChild(h3);

                    h3.style.width = "100%";
                    h3.style.height = "100%";

                    function loop() {


                        nigr2.clearRect(0, 0, h2.width, h2.height);

                        nigr2.drawImage(h, 0, 0, h2.width, h2.height);

                        requestAnimationFrame(loop);
                    }

                    loop();

                    click1 = true;
                }
            })();
        } else {

            

            input.set_convar('ren_background', true);
            input.set_convar('ren_health_background_color', 0x292929);
            input.set_convar('ren_border_color', 0x797979);
            input.set_convar('ren_stroke_soft_color_intensity', 0.25);
            input.set_convar('ren_border_color_alpha', 0.1);
        }
    })
    var enabled = false

///GHOST THEME
var enabled = true
const ghost = document.createElement("button");

        ghost.style = 'background:#FFFFFF';
        ghost.style.position = "relative";
     
   const textNode4 = document.createTextNode('Ghost Theme');

    ghost.appendChild(textNode4);

      ghost.addEventListener("click", () => {

        enabled = !enabled
        if (enabled === true){

          var c = document.getElementById('canvas')

          var ctx = c.getContext("2d");

          document.getElementsByTagName('body')[0].appendChild(c);

              ctx.globalAlpha = 0.6

          input.set_convar('ren_border_color_alpha', 2)

      document.body.appendChild(movementbutton);

      document.body.appendChild(upgrades);

      document.body.appendChild(outlines);

      document.body.appendChild(br1);

      document.body.appendChild(br2);

      document.body.appendChild(glow);

      document.body.appendChild(ghost);

      document.body.appendChild(ui);

        } else {

          var c = document.getElementById('canvas')

          var ctx = c.getContext("2d");

          document.getElementsByTagName('body')[0].appendChild(c);

            ctx.globalAlpha = 1

            input.set_convar('ren_border_color_alpha', 0.25)
 
      document.body.appendChild(movementbutton);

      document.body.appendChild(upgrades);

      document.body.appendChild(outlines);

      document.body.appendChild(br1);

      document.body.appendChild(br2);

      document.body.appendChild(glow);

      document.body.appendChild(ghost);

      document.body.appendChild(ui);

          }
      })
     var enabled = false

///NO UI
var enabled = true
const ui = document.createElement("button");

        ui.style = 'background:#FFFFFF';
        ui.style.position = "relative";
     
   var textNode5 = document.createTextNode('Ren UI');

    ui.appendChild(textNode5);

      ui.addEventListener("click", () => {

        enabled = !enabled
        if (enabled === true){

          input.set_convar('ren_ui', false);
        
       
        } else {

            input.set_convar('ren_ui', true);
        }
      })
     var enabled = false

document.body.appendChild(movementbutton);
document.body.appendChild(upgrades)
document.body.appendChild(outlines);

document.body.appendChild(br1);
document.body.appendChild(br2);

document.body.appendChild(glow);
document.body.appendChild(ghost);
document.body.appendChild(ui);

///TURN MENU OFF

var enabled = true
document.addEventListener('keydown',function(aMX){

  var key = aMX.keyCode

  if(key == 191){

      enabled = !enabled
      
      if (enabled === true){

          movementbutton.style.display = 'none'

          upgrades.style.display = 'none'

          outlines.style.display = 'none'

          glow.style.display = 'none'

          ghost.style.display = 'none'

          ui.style.display = 'none'

      } else {

          movementbutton.style.display = 'initial'

          upgrades.style.display = 'initial'

          outlines.style.display = 'initial'

          glow.style.display = 'initial'

          ghost.style.display = 'initial'

          ui.style.display = 'initial'

      }
  }
})
var enabled = false

alert('Thanks for using my script. You can show or hide the button menu using the "/" key. -Astral (aMX#0069)')