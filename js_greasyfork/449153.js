// ==UserScript==
// @name         Vanis.io colored name & menue
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  change the colors of the menu and your name
// @author       Yo7
// @match        *://vanis.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vanis.io
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @require https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.0/jquery-confirm.min.js
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449153/Vanisio%20colored%20name%20%20menue.user.js
// @updateURL https://update.greasyfork.org/scripts/449153/Vanisio%20colored%20name%20%20menue.meta.js
// ==/UserScript==

/*
Original script by Nuro#9999
Menu hotkey is shift you can change this on line 303
If you want to add more preset colors go to
*/

(function() {

    //These are your default colors thry dont have to be rbg codes or whatever simply putting "green" or "pink" will also work

    var time = 10 //How fast the wave gradients change
    var nameclr = "#ff5a3d" //Name color
    var gcolor1 = "#23dbcf" //First color in gradient
    var gcolor2 = "#fc74ef" //Second color in gradient

    window.addEventListener('load', (event) => {
    console.log('Run');
            nameclr = nameclr
            gcolor1 = gcolor1
            gcolor2 = gcolor2
        local.MENU_CONFIG.RAINBOW = false //change this to true if you want rainbow to be default (This will override any static colors)
            $('.fade-box').css({
                    background: `linear-gradient(to right bottom,${gcolor1},${gcolor2})`
                })
});

    window.addEventListener('mouseover', (event) => {
    console.log('Run');
            nameclr = nameclr
            gcolor1 = gcolor1
            gcolor2 = gcolor2
        local.MENU_CONFIG.RAINBOW = local.MENU_CONFIG.RAINBOW
            $('.fade-box').css({
                    background: `linear-gradient(to right bottom,${gcolor1},${gcolor2})`
                })
});

    document.addEventListener("keydown", function(e) {
           if (e.key == 'Shift') { //Just change shift to whatever you need // example: (e.key == 'p' || 'P') | (e.key == '1)
               $('#test').toggle();
           };
       });

    var local = {
        MENU_CONFIG: {

            RAINBOW: false,

        },



        COLOR_HUE: 0,
        COLOR_HUE2: 300,
        GAME_WS: null,
        GAME_INIT: false,
        PLAYER_PACKET_SPAWN: [],
        PLAYER_SOCKET: null,
        PLAYER_IS_DEAD: false,
        PLAYER_MOUSE: {
            x: null,
            y: null,
        },
        GAME_BYPASS: {
            mouseFrozen: Symbol(),
            utf8: new TextEncoder()
        }
    }




    function changeHue() {
        355 == local.COLOR_HUE && (local.COLOR_HUE = 0), local.COLOR_HUE++;
        355 == local.COLOR_HUE2 && (local.COLOR_HUE2 = 0), local.COLOR_HUE2++;
        $('.fade-box').css({
            background: 'linear-gradient(to right bottom,hsl('+local.COLOR_HUE+', 50%, 50%),hsl('+local.COLOR_HUE2+', 50%, 50%)'
        })
    }
    function ready() {
        setInterval(() => {
            if(local.MENU_CONFIG.RAINBOW) {
                changeHue()
            }
        }, time)
    }


   const { fillText } = CanvasRenderingContext2D.prototype;
    CanvasRenderingContext2D.prototype.fillText = function(text, x, y) {
        let config = local.SCRIPT_CONFIG
        if(text == document.getElementById("nickname").value) {
            this.fillStyle = nameclr;
        }
        fillText.call(this, ...arguments);
    }
    document.addEventListener("DOMContentLoaded", ready)





   var styleItem = document.createElement("style");
       styleItem.type = "text/css";
       styleItem.appendChild(document.createTextNode(`
.test {
    position: absolute;
    z-index: 1;
    overflow: auto;
    position: relative;
    height: 510px;
    padding: 10px;
    font-size: 5px;
    z-index: 1;
    right: 850px;
    top: 80px;
    overflow: auto;
    height: 100%;
    width: 100%;
    border-radius: 5%;
}

.test {
    position: absolute;
    z-index: 1;
    left: 0;
    top: 0;
    overflow: auto;
    height: 100%;
    width: 100%;
        box-shadow: 0 2px 5px 0 rgb(0 0 0 / 29%), 0 2px 10px 0 rgb(0 0 0 / 29%);
        box-shadow: 0 2px 5px 0 rgb(0 0 0 / 29%), 0 2px 10px 0 rgb(0 0 0 / 29%);
}


#test {
  padding: 10px;
  box-shadow: 0px 0px 10px #FFFFFF;
  text-shadow: 0 0 0px #000000, 0 0 0px #000000, 0 0 50px #000000;
  background: linear-gradient(55deg, #0fb8ad 0%, #1fc8db 51%, rgba(0,0,0,.5); 85%);
        box-shadow: 0 2px 5px 0 rgb(0 0 0 / 29%), 0 2px 10px 0 rgb(0 0 0 / 29%);
    box-shadow: 0 0 2px #6dd1ff,0 10 10 4px #353535, 0 0 0 5px #3e3e3e, inset 0 0 10px rgba(0, 0, 0, 1), 0 5px 20px rgba(0,0,0,.5), inset 0 0 15px rgba(0,0,0,.2);
}

#test {
    padding: 10px;
    box-shadow: 3px 3px 10px #000000;
    border: 3.5px solid black;
}

.indent {
    margin-left: 10px;
}
::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 10px;
}

::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: rgba(0,0,0,1.0);
  -webkit-box-shadow: 0 0 1px rgba(255,255,255,1.0);
}




`))

           document.head.appendChild(styleItem);

           let cursorDisplay = document.createElement("div");
       cursorDisplay.id = "test"
       document.body.prepend(cursorDisplay);
       document.getElementById('test').style.position='absolute'
       document.getElementById('test').style.textAlign='left'
       document.getElementById('test').style.display='none'
       document.getElementById('test').style.width='210px'
       document.getElementById('test').style.height='280px'
       document.getElementById('test').style.top = "150px";
       document.getElementById('test').style.left = "0px";
       document.getElementById('test').style.backgroundColor='rgb(0,0,0,.7)'
       document.getElementById('test').style.color = 'white'
       document.getElementById('test').innerHTML =
`
<body>
<center>
<h2 style="font-size: 10px; color: #34EB8F;">Vanis.io change menu and name color</h2>
<h2 style="font-size: 10px; color: #34EB8F;">By Yo7 • V 1.4</h2>

<h2 style="font-size: 25px; color: #ADFF2F;">Options</h2>

</label">Change name color<input type="checkbox" id="opnameclr"> <br><br>

</label">Change menu gradient<input type="checkbox" id="opgradient"> <br><br>

</label">Create menu gradient<input type="checkbox" id="opcustom"> <br><br>
</center>
`;


          let cursorDisplay2 = document.createElement("div");
       cursorDisplay2.id = "test2"
       document.body.prepend(cursorDisplay2);
       document.getElementById('test2').style.position='absolute'
       document.getElementById('test2').style.textAlign='center'
       document.getElementById('test2').style.display='none'
       document.getElementById('test2').style.width='190px'
       document.getElementById('test2').style.height='200px'
       document.getElementById('test2').style.top = "150px";
       document.getElementById('test2').style.left = '240px';
       document.getElementById('test2').style.backgroundColor='rgb(0,0,0,.7)'
       document.getElementById('test2').style.color = 'white'
       document.getElementById('test2').innerHTML =
           `
<body>
<center>
<h2 style="font-size: 25px; color: #ADFF2F;">Name color</h2>
<button id="nametog" style="background-color: green; color: white; cursor:pointer;">Apply new color</button><br><br>
<input type="text" style="width: 75px;" id="nameclr2" placeholder= "New color">
</center>
`;

    let cursorDisplay3 = document.createElement("div");
       cursorDisplay3.id = "test3"
       document.body.prepend(cursorDisplay3);
       document.getElementById('test3').style.position='absolute'
       document.getElementById('test3').style.textAlign='center'
       document.getElementById('test3').style.display='none'
       document.getElementById('test3').style.width='190px'
       document.getElementById('test3').style.height='600px'
       document.getElementById('test3').style.top = "150px";
       document.getElementById('test3').style.left = '240px';
       document.getElementById('test3').style.backgroundColor='rgb(0,0,0,.7)'
       document.getElementById('test3').style.color = 'white'
       document.getElementById('test3').innerHTML =
           `
<body>
<center>
<h2 style="font-size: 25px; color: #ADFF2F;">Gradients</h2>
<h2 style="font-size: 15px; color: #FFD700;">Wave gradients</h2>
</label">Rainbow<input type="checkbox" id="wg001"> <br>
</label">Pulsor<input type="checkbox" id="wg002"> <br>
<br>
<h2 style="font-size: 15px; color: #FF0000;">Static gradients</h2>
</label">Sunrise<input type="checkbox" id="sg001"> <br>
</label">Sunset<input type="checkbox" id="sg002"> <br>
</label">Ocean<input type="checkbox" id="sg003"> <br>
</label">Nebula<input type="checkbox" id="sg004">
<center>
`;

    let cursorDisplay4 = document.createElement("div");
       cursorDisplay4.id = "test4"
       document.body.prepend(cursorDisplay4);
       document.getElementById('test4').style.position='absolute'
       document.getElementById('test4').style.textAlign='left'
       document.getElementById('test4').style.display='none'
       document.getElementById('test4').style.width='190px'
       document.getElementById('test4').style.height='275px'
       document.getElementById('test4').style.top = "150px";
       document.getElementById('test4').style.left = '240px';
       document.getElementById('test4').style.backgroundColor='rgb(0,0,0,.7)'
       document.getElementById('test4').style.color = 'white'
       document.getElementById('test4').innerHTML =
           `
<body>
<center>
<h2 style="font-size: 25px; color: #ADFF2F;">Custom gradient</h2>
<button id="aplyg" style="background-color: green; color: white; cursor:pointer;">Apply gradient</button><br><br>
<input type="text" style="width: 65px;" class="inputTxt" id="cg1" placeholder="Color 1">
<input type="text" style="width: 65px;" class="inputTxt" id="cg2" placeholder="Color 2">
<center>
`;

    var opnamecheck = document.querySelector("#opnameclr")
    opnamecheck.addEventListener('change', function() {
        if (this.checked) {
        $('#test2').toggle();
            document.getElementById("nametog").checked = false;
        } else {
            $('#test2').toggle();
        }
    });

    var opgradcheck = document.querySelector("#opgradient")
    opgradcheck.addEventListener('change', function() {
        if (this.checked) {
        $('#test3').toggle();
            document.getElementById("sg001").checked = false;
               document.getElementById("sg002").checked = false;
               document.getElementById("sg003").checked = false;
               document.getElementById("sg004").checked = false;

               document.getElementById("wg001").checked = false;
               document.getElementById("wg002").checked = false;
        } else {
            $('#test3').toggle();
        }
    });

    var opcustcheck = document.querySelector("#opcustom")
    opcustcheck.addEventListener('change', function() {
        if (this.checked) {
        $('#test4').toggle();
            document.getElementById("aplyg").checked = false;
        } else {
            $('#test4').toggle();
        }
    });

    var namecheck = document.querySelector("#nametog")
    namecheck.addEventListener('click', function() {
            alert('Your name color will change when you switch to another lobby \n Im working on it :(')
            let nameclr3 = document.getElementById('nameclr2').value
            nameclr = nameclr3
    });

    var sgcheck = document.querySelector("#aplyg")
    sgcheck.addEventListener('click', function() {
            let aplyg2 = document.getElementById('cg1').value
            gcolor1 = aplyg2
            let aplyg3 = document.getElementById('cg2').value
            gcolor2 = aplyg3
            $('.fade-box').css({
                    background: `linear-gradient(to right bottom,${gcolor1},${gcolor2})`
                })
    });

    var wgcheck001 = document.querySelector("#wg001")
    wgcheck001.addEventListener('change', function() {
        if (this.checked) {
            local.MENU_CONFIG.RAINBOW = true;
        } else {
            local.MENU_CONFIG.RAINBOW = false;
        }
    });

    var sgcheck001 = document.querySelector("#sg001")
    sgcheck001.addEventListener('change', function() {
        if (this.checked) {
            local.MENU_CONFIG.RAINBOW = false;
            gcolor1 = "#ff54f9"
            gcolor2 = "#eff542"
            $('.fade-box').css({
                    background: `linear-gradient(to right bottom,${gcolor1},${gcolor2})`
                })
        }
    });

    var sgcheck002 = document.querySelector("#sg002")
    sgcheck002.addEventListener('change', function() {
        if (this.checked) {
            local.MENU_CONFIG.RAINBOW = false;
            gcolor1 = "#d774ed"
            gcolor2 = "#db3030"
            $('.fade-box').css({
                    background: `linear-gradient(to right bottom,${gcolor1},${gcolor2})`
                })
        }
    });

    var sgcheck003 = document.querySelector("#sg003")
    sgcheck003.addEventListener('change', function() {
        if (this.checked) {
            local.MENU_CONFIG.RAINBOW = false;
            gcolor1 = "#23dbcf"
            gcolor2 = "#3c27f5"
            $('.fade-box').css({
                    background: `linear-gradient(to right bottom,${gcolor1},${gcolor2})`
                })
        }
    });

    var sgcheck004 = document.querySelector("#sg004")
    sgcheck004.addEventListener('change', function() {
        if (this.checked) {
            local.MENU_CONFIG.RAINBOW = false;
            gcolor1 = "#000000"
            gcolor2 = "#490fdb"
            $('.fade-box').css({
                    background: `linear-gradient(to right bottom,${gcolor1},${gcolor2})`
                })
        }
    });


})();