// ==UserScript==
// @name         SnugyExtension 5peps
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Menu + name color for you and you friends.
// @author       SmugVanis
// @match        *://vanis.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vanis.io
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @require https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.0/jquery-confirm.min.js
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464109/SnugyExtension%205peps.user.js
// @updateURL https://update.greasyfork.org/scripts/464109/SnugyExtension%205peps.meta.js
// ==/UserScript==

(function() {

    var time = 15
    var nameclr
    var f1nameclr
    var f2nameclr
    var f3nameclr
    var f4nameclr
    var f5nameclr
    window.addEventListener('load', (event) => {
    console.log('Run');
            nameclr = "#ff5a3d"
            f1nameclr = "#FF0000"
            f2nameclr = "#FF00CD"
            f3nameclr = "#DE00FF"
            f4nameclr = "#1100FF"
            f5nameclr = "#00CDFF"
        local.MENU_CONFIG.RAINBOW = true
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
            background: 'linear-gradient(to bottom,hsl('+local.COLOR_HUE+', 50%, 50%),hsl('+local.COLOR_HUE2+', 50%, 50%)'
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
        //-------------------------------------------------------Friends start-----------------------------------------------------------------------------------------------------------------------
         if(text === "fr1") {
            document.getElementById("nickname").value
            this.fillStyle = f1nameclr;
        }
         if(text === "fr2") {
            document.getElementById("nickname").value
            this.fillStyle = f2nameclr;
        }
         if(text === "fr3") {
            document.getElementById("nickname").value
            this.fillStyle = f3nameclr;
        }
         if(text === "fr4") {
            document.getElementById("nickname").value
            this.fillStyle = f4nameclr;
        }
         if(text === "fr5") {
            document.getElementById("nickname").value
            this.fillStyle = f5nameclr;
         }
        //-------------------------------------------------------------------------friends end--------------------------------------------------------------------------------------------------------
        fillText.call(this, ...arguments);
    }
    document.addEventListener("DOMContentLoaded", ready)
   var styleItem = document.createElement("style");
       styleItem.type = "text/css";
       styleItem.appendChild(document.createTextNode(`
.menu {
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

.menu {
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


#menu {
  padding: 10px;
  box-shadow: 0px 0px 10px #FFFFFF;
  text-shadow: 0 0 0px #000000, 0 0 0px #000000, 0 0 50px #000000;
  background: linear-gradient(55deg, #0fb8ad 0%, #1fc8db 51%, rgba(0,0,0,.5); 85%);
        box-shadow: 0 2px 5px 0 rgb(0 0 0 / 29%), 0 2px 10px 0 rgb(0 0 0 / 29%);
    box-shadow: 0 0 2px #6dd1ff,0 10 10 4px #353535, 0 0 0 5px #3e3e3e, inset 0 0 10px rgba(0, 0, 0, 1), 0 5px 20px rgba(0,0,0,.5), inset 0 0 15px rgba(0,0,0,.2);
}

#menu {
    padding: 10px;
    box-shadow: 3px 3px 10px #000000;
    border: 3.5px solid black;
}

#nameclr2{
    display: inline
}
#innameclr2{
    display: inline
}

#f1nameclr2{
   display: inline
}
#inf1nameclr2{
   display: inline
}
#f2nameclr2{
   display: inline
}
#inf2nameclr2{
   display: inline
}
#f3nameclr2{
   display: inline
}
#inf3nameclr2{
   display: inline
}
#f4nameclr2{
   display: inline
}
#inf4nameclr2{
   display: inline
}
#f5nameclr2{
   display: inline
}
#inf5nameclr2{
   display: inline
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

       document.addEventListener("keydown", function(e) {
           if (e.key == 'Shift') {
               $('#menu1').toggle();
               $('#menu2').toggle();
           };
       });
          let cursorDisplay1 = document.createElement("div");
       cursorDisplay1.id = "menu1"
       document.body.prepend(cursorDisplay1);
       document.getElementById('menu1').style.position='absolute'
       document.getElementById('menu1').style.textAlign='center'
       document.getElementById('menu1').style.display='none'
       document.getElementById('menu1').style.width='15%'
       document.getElementById('menu1').style.height='20px%'
       document.getElementById('menu1').style.top = "0px";
       document.getElementById('menu1').style.left = '50%';
       document.getElementById('menu1').style.backgroundColor='rgb(0,0,0,.7)'
       document.getElementById('menu1').style.color = 'white'
       document.getElementById('menu1').innerHTML =
           `
<body>
<center>
<h2 style="font-size: 25px; color: #FFFFFF;">Snugy-Extension</h2>
<input type="text" style="width: 50%; height: 40px"; id="nameclr2" placeholder= "Your color">
<input type="color" id="innameclr2">
<button id="nametog" style="background-color: black; width: 100%; height: 30px; color: white; cursor:pointer;">Apply</button>
</center>
`;


          let cursorDisplay2 = document.createElement("div");
       cursorDisplay2.id = "menu2"
       document.body.prepend(cursorDisplay2);
       document.getElementById('menu2').style.position='absolute'
       document.getElementById('menu2').style.textAlign='center'
       document.getElementById('menu2').style.display='none'
       document.getElementById('menu2').style.width='15%'
       document.getElementById('menu2').style.height='950px%'
       document.getElementById('menu2').style.top = "0%";
       document.getElementById('menu2').style.left = '35%';
       document.getElementById('menu2').style.backgroundColor='rgb(0,0,0,.7)'
       document.getElementById('menu2').style.color = 'white'
       document.getElementById('menu2').innerHTML =
           `
<body>
<center>
<h3 style="font-size: 25px; color: #FFFFFF;">Friends Color</h3>
<input type="text" style="width: 50%; height: 40px";   id="f1nameclr2" placeholder= "Friend1 color">
<input type="color" id="inf1nameclr2">
<input type="text" style="width: 50%; height: 40px";   id="f2nameclr2" placeholder= "Friend2 color">
<input type="color" id="inf2nameclr2">
<input type="text" style="width: 50%; height: 40px";   id="f3nameclr2" placeholder= "Friend3 color">
<input type="color" id="inf3nameclr2">
<input type="text" style="width: 50%; height: 40px";   id="f4nameclr2" placeholder= "Friend4 color">
<input type="color" id="inf4nameclr2">
<input type="text" style="width: 50%; height: 40px";   id="f5nameclr2" placeholder= "Friend5 color">
<input type="color" id="inf5nameclr2">
<button id="fnametog" style="background-color: black; width: 100%; height: 30px; color: white; cursor:pointer;">Apply</button>
</center>
`;
    var namecheck = document.querySelector("#nametog")
    namecheck.addEventListener('click', function() {
            alert('Name color set! Leave server and join back.')
            let nameclr3 = document.getElementById('innameclr2').value
            nameclr = nameclr3
        document.getElementById('nameclr2').value = nameclr3;
    });
    var f1namecheck = document.querySelector("#fnametog")
    f1namecheck.addEventListener('click', function fnameclr1() {
            let f1nameclr3 = document.getElementById('inf1nameclr2').value
            f1nameclr = f1nameclr3
        document.getElementById('f1nameclr2').value = f1nameclr3;
    });

    var f2namecheck = document.querySelector("#fnametog")
    f2namecheck.addEventListener('click', function fnameclr2() {
            let f2nameclr3 = document.getElementById('inf2nameclr2').value
            f2nameclr = f2nameclr3
                document.getElementById('f2nameclr2').value = f2nameclr3;
    });
    var f3namecheck = document.querySelector("#fnametog")
    f3namecheck.addEventListener('click', function fnameclr3() {
            let f3nameclr3 = document.getElementById('inf3nameclr2').value
            f3nameclr = f3nameclr3
                document.getElementById('f3nameclr2').value = f3nameclr3;
    });
    var f4namecheck = document.querySelector("#fnametog")
    f4namecheck.addEventListener('click', function fnameclr4() {
            let f4nameclr3 = document.getElementById('inf4nameclr2').value
            f4nameclr = f4nameclr3
                document.getElementById('f4nameclr2').value = f4nameclr3;
    });
    var f5namecheck = document.querySelector("#fnametog")
    f5namecheck.addEventListener('click', function fnameclr5() {
        alert('Friends names color set! Leave server and join back.')
            let f5nameclr3 = document.getElementById('inf5nameclr2').value
            f5nameclr = f5nameclr3
                document.getElementById('f5nameclr2').value = f5nameclr3;
    });
})();