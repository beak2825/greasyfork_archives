// ==UserScript==
// @name         Defend Auto Base Automatico
// @namespace    -
// @version      1.5
// @description  Obg IP arco iris
// @author       IP Pandinha ^^
// @match        http://bloble.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392755/Defend%20Auto%20Base%20Automatico.user.js
// @updateURL https://update.greasyfork.org/scripts/392755/Defend%20Auto%20Base%20Automatico.meta.js
// ==/UserScript==

window.UIList = window.UIList || [];
window.initFuncs = window.initFuncs || [];
window.statusItems = window.statusItems || [];
window.autoDefense = false;
window.UIList.push({
level: 3,
    x: 4,
    html: '<div id=auto onclick=autodefense()>Defend Active</div>'
});
window.autodefense = function () {
    var elaa = document.getElementById('auto');
    if (autoDefense) {
        autoDefense = false
        elaa.textContent = 'Defend: Off'
        clearInterval(teste)
    } else {
        autoDefense = true;
        elaa.textContent = 'Defend: On';
        window.teste = setInterval(autodefesa, 250)
        function autodefesa() {
              socket.emit("1", 7.86, 311, 1);
             socket.emit("1", 8.06, 311, 1);
             socket.emit("1", 8.26, 311, 1);
             socket.emit("1", 8.46, 311, 1);
             socket.emit("1", 8.66, 311, 1);
             socket.emit("1", 8.86, 311, 1);
             socket.emit("1", 9.06, 311, 1);
             socket.emit("1", 9.26, 311, 1);
             socket.emit("1", 9.46, 311, 1);
             socket.emit("1", 9.66, 311, 1);
             socket.emit("1", 9.86, 311, 1);
             socket.emit("1", 10.28, 311, 1);
             socket.emit("1", 10.70, 311, 1);
             socket.emit("1", 10.90, 311, 1);
             socket.emit("1", 11.10, 311, 1);
             socket.emit("1", 11.30, 311, 1);
             socket.emit("1", 11.72, 311, 1);
             socket.emit("1", 12.14, 311, 1);
             socket.emit("1", 12.34, 311, 1);
             socket.emit("1", 12.54, 311, 1);
             socket.emit("1", 12.74, 311, 1);
             socket.emit("1", 12.94, 311, 1);
             socket.emit("1", 13.14, 311, 1);
             socket.emit("1", 13.34, 311, 1);
             socket.emit("1", 13.54, 311, 1);
             socket.emit("1", 13.74, 311, 1);
             socket.emit("1", 13.94, 311, 1);
             socket.emit("1", 10.07, 311, 1);
             socket.emit("1", 10.49, 311, 1);
             socket.emit("1", 11.51, 311, 1);
             socket.emit("1", 11.93, 311, 1);
             socket.emit("1", 4.8625, 245, 1);
             socket.emit("1", 5.1125, 245, 1);
             socket.emit("1", 5.3625, 245, 1);
             socket.emit("1", 5.6125, 245, 1);
             socket.emit("1", 5.8625, 245, 1);
             socket.emit("1", 6.1125, 245, 1);
             socket.emit("1", 6.3625, 245, 1);
             socket.emit("1", 6.6125, 245, 1);
             socket.emit("1", 6.8625, 245, 1);
             socket.emit("1", 7.14, 245, 1);
             socket.emit("1", 7.39, 245, 1);
             socket.emit("1", 7.64, 246, 1);
             socket.emit("1", 7.89, 246, 1);
             socket.emit("1", 8.14, 246, 1);
             socket.emit("1", 8.39, 246, 1);
             socket.emit("1", 8.635, 246, 1);
             socket.emit("1", 8.885, 246, 1);
             socket.emit("1", 2.5825, 245, 1);
             socket.emit("1", 2.8625, 245, 1);
             socket.emit("1", 3.1125, 245, 1);
             socket.emit("1", 3.3625, 245, 1);
             socket.emit("1", 3.6125, 245, 1);
             socket.emit("1", 3.8625, 245, 1);
             socket.emit("1", 4.1125, 245, 1);
             socket.emit("1", 4.3625, 245, 1);
             socket.emit("1", 4.6125, 245, 1);
             socket.emit("1", 4.726, 190, 1);
             socket.emit("1", 5.725, 190, 1);
             socket.emit("1", 2.75, 190, 1);
             socket.emit("1", 3.74, 190, 1);
             socket.emit("1", 5.725, 190, 1);
             socket.emit("1", 2.75, 190, 1);
             socket.emit("1", 6.7215, 189.5, 1);
             socket.emit("1", 5.06, 185, 1);
             socket.emit("1", 5.4, 185, 1);
             socket.emit("1", 6.045, 186, 1);
             socket.emit("1", 6.374, 185, 1);
             socket.emit("1", 5.4, 185, 1);
             socket.emit("1", 7.0425, 188.5, 1);
             socket.emit("1", 7.365, 185, 1);
             socket.emit("1", 7.712, 187.45, 1);
             socket.emit("1", 8.035, 188.5, 1);
             socket.emit("1", 8.36, 185, 1);
             socket.emit("1", 2.425, 188, 1);
             socket.emit("1", 3.075, 184, 1);
             socket.emit("1", 5.06, 185, 1);
             socket.emit("1", 3.42, 186, 1);
             socket.emit("1", 3.74, 190, 1);
             socket.emit("1", 4.06, 186, 1);
             socket.emit("1", 4.39, 185, 1);
             socket.emit("1", 4.725, 130, 1);
             socket.emit("1", 5.245, 130, 1);
             socket.emit("1", 5.715, 130, 1);
             socket.emit("1", 6.185, 130, 1);
             socket.emit("1", 6.655, 130, 1);
             socket.emit("1", 7.13, 130, 1);
             socket.emit("1", 7.6, 130, 1);
             socket.emit("1", 1.85, 130, 1);
             socket.emit("1", 2.32, 130, 1);
             socket.emit("1", 2.79, 130, 1);
             socket.emit("1", 3.265, 130, 1);
             socket.emit("1", 3.735, 130, 1);
             socket.emit("1", 4.205, 130, 1);
      setTimeout(function() {
            vender();
        }, 3000);

        setTimeout(function() {
            REMONTAR();
        }, 35);
        setTimeout(function() {
            evoluir();
        }, 280);

    }

    function vender() {
  for (var a = [], d = 0; d < units.length; ++d) units[d].type === 3 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Wall' && a.push(units[d].id);
    socket.emit("3", a)
}}


;
 function REMONTAR() {
socket.emit("1",4.725,130,7);
                socket.emit("1",5.245,130,4);
                socket.emit("1",5.715,130,4);
                socket.emit("1",6.185,130,4);
                socket.emit("1",6.655,130,4);
                socket.emit("1",7.13,130,4);
                socket.emit("1",7.6,130,4);
                socket.emit("1",1.85,130,4);
                socket.emit("1",2.32,130,4);
                socket.emit("1",2.79,130,4);
                socket.emit("1",3.265,130,4);
                socket.emit("1",3.735,130,4);
                socket.emit("1",4.205,130,4);
                socket.emit("1",5.06,185,4);
                socket.emit("1",5.4,185,4);
                socket.emit("1",5.725,190,4);
                socket.emit("1",6.045,186,4);
                socket.emit("1",6.374,185,4);
                socket.emit("1",6.7215,189.5,4);
                socket.emit("1",7.0425,188.5,4);
                socket.emit("1",7.365,185,4);
                socket.emit("1",7.712,187.45,4);
                socket.emit("1",8.035,188.5,4);
                socket.emit("1",8.36,185,4);
                socket.emit("1",2.425,188,4);
                socket.emit("1",2.75,190,4);
                socket.emit("1",3.075,184,4);
                socket.emit("1",3.42,186,4);
                socket.emit("1",3.74,190,4);
                socket.emit("1",4.06,186,4);
                socket.emit("1",4.39,185,4);
                socket.emit("1",4.8625,245,4);
                socket.emit("1",5.1125,245,4);
                socket.emit("1",5.3625,245,4);
                socket.emit("1",5.6125,245,4);
                socket.emit("1",5.8625,245,4);
                socket.emit("1",6.1125,245,4);
                socket.emit("1",6.3625,245,4);
                socket.emit("1",6.6125,245,4);
                socket.emit("1",6.8625,245,4);
                socket.emit("1",7.14,245,4);
                socket.emit("1",7.39,245,4);
                socket.emit("1",7.64,246,4);
                socket.emit("1",7.89,246,4);
                socket.emit("1",8.14,246,4);
                socket.emit("1",8.39,246,4);
                socket.emit("1",8.635,246,4);
                socket.emit("1",8.885,246,4);
                socket.emit("1",2.5825,245,4);
                socket.emit("1",2.8625,245,4);
                socket.emit("1",3.1125,245,4);
                socket.emit("1",3.3625,245,4);
                socket.emit("1",3.6125,245,4);
                socket.emit("1",3.8625,245,4);
                socket.emit("1",4.1125,245,4);
                socket.emit("1",4.3625,245,4);
                socket.emit("1",4.6125,245,4);
                socket.emit("1",7.86,311,1);
                socket.emit("1",8.06,311,1);
                socket.emit("1",8.26,311,1);
                socket.emit("1",8.46,311,1);
                socket.emit("1",8.66,311,1);
                socket.emit("1",8.86,311,1);
                socket.emit("1",9.06,311,1);
                socket.emit("1",9.26,311,1);
                socket.emit("1",9.46,311,1);
                socket.emit("1",9.66,311,1);
                socket.emit("1",9.86,311,1);
                socket.emit("1",10.28,311,1);
                socket.emit("1",10.70,311,1);
                socket.emit("1",10.90,311,1);
                socket.emit("1",11.10,311,1);
                socket.emit("1",11.30,311,1);
                socket.emit("1",11.72,311,1);
                socket.emit("1",12.14,311,1);
                socket.emit("1",12.34,311,1);
                socket.emit("1",12.54,311,1);
                socket.emit("1",12.74,311,1);
                socket.emit("1",12.94,311,1);
                socket.emit("1",13.14,311,1);
                socket.emit("1",13.34,311,1);
                socket.emit("1",13.54,311,1);
                socket.emit("1",13.74,311,1);
                socket.emit("1",13.94,311,1);
                socket.emit("1",10.07,311,8);
                socket.emit("1",10.49,311,8);
                socket.emit("1",11.51,311,8);
                socket.emit("1",11.93,311,8);
    }
  function REMONTAR() {
socket.emit("1",4.725,130,7);
                socket.emit("1",5.245,130,4);
                socket.emit("1",5.715,130,4);
                socket.emit("1",6.185,130,4);
                socket.emit("1",6.655,130,4);
                socket.emit("1",7.13,130,4);
                socket.emit("1",7.6,130,4);
                socket.emit("1",1.85,130,4);
                socket.emit("1",2.32,130,4);
                socket.emit("1",2.79,130,4);
                socket.emit("1",3.265,130,4);
                socket.emit("1",3.735,130,4);
                socket.emit("1",4.205,130,4);
                socket.emit("1",5.06,185,4);
                socket.emit("1",5.4,185,4);
                socket.emit("1",5.725,190,4);
                socket.emit("1",6.045,186,4);
                socket.emit("1",6.374,185,4);
                socket.emit("1",6.7215,189.5,4);
                socket.emit("1",7.0425,188.5,4);
                socket.emit("1",7.365,185,4);
                socket.emit("1",7.712,187.45,4);
                socket.emit("1",8.035,188.5,4);
                socket.emit("1",8.36,185,4);
                socket.emit("1",2.425,188,4);
                socket.emit("1",2.75,190,4);
                socket.emit("1",3.075,184,4);
                socket.emit("1",3.42,186,4);
                socket.emit("1",3.74,190,4);
                socket.emit("1",4.06,186,4);
                socket.emit("1",4.39,185,4);
                socket.emit("1",4.8625,245,4);
                socket.emit("1",5.1125,245,4);
                socket.emit("1",5.3625,245,4);
                socket.emit("1",5.6125,245,4);
                socket.emit("1",5.8625,245,4);
                socket.emit("1",6.1125,245,4);
                socket.emit("1",6.3625,245,4);
                socket.emit("1",6.6125,245,4);
                socket.emit("1",6.8625,245,4);
                socket.emit("1",7.14,245,4);
                socket.emit("1",7.39,245,4);
                socket.emit("1",7.64,246,4);
                socket.emit("1",7.89,246,4);
                socket.emit("1",8.14,246,4);
                socket.emit("1",8.39,246,4);
                socket.emit("1",8.635,246,4);
                socket.emit("1",8.885,246,4);
                socket.emit("1",2.5825,245,4);
                socket.emit("1",2.8625,245,4);
                socket.emit("1",3.1125,245,4);
                socket.emit("1",3.3625,245,4);
                socket.emit("1",3.6125,245,4);
                socket.emit("1",3.8625,245,4);
                socket.emit("1",4.1125,245,4);
                socket.emit("1",4.3625,245,4);
                socket.emit("1",4.6125,245,4);
                socket.emit("1",7.86,311,1);
                socket.emit("1",8.06,311,1);
                socket.emit("1",8.26,311,1);
                socket.emit("1",8.46,311,1);
                socket.emit("1",8.66,311,1);
                socket.emit("1",8.86,311,1);
                socket.emit("1",9.06,311,1);
                socket.emit("1",9.26,311,1);
                socket.emit("1",9.46,311,1);
                socket.emit("1",9.66,311,1);
                socket.emit("1",9.86,311,1);
                socket.emit("1",10.28,311,1);
                socket.emit("1",10.70,311,1);
                socket.emit("1",10.90,311,1);
                socket.emit("1",11.10,311,1);
                socket.emit("1",11.30,311,1);
                socket.emit("1",11.72,311,1);
                socket.emit("1",12.14,311,1);
                socket.emit("1",12.34,311,1);
                socket.emit("1",12.54,311,1);
                socket.emit("1",12.74,311,1);
                socket.emit("1",12.94,311,1);
                socket.emit("1",13.14,311,1);
                socket.emit("1",13.34,311,1);
                socket.emit("1",13.54,311,1);
                socket.emit("1",13.74,311,1);
                socket.emit("1",13.94,311,1);
                socket.emit("1",10.07,311,8);
                socket.emit("1",10.49,311,8);
                socket.emit("1",11.51,311,8);
                socket.emit("1",11.93,311,8);
    }

 function evoluir() {
    for(i=0;i<units.length;++i){
            if(3==units[i].type&&"circle"==units[i].shape&&units[i].owner==player.sid){
                socket.emit("4",units[i].id,1);
            }
        }


    }



                         socket.emit("1", 7.86, 311, 1);
             socket.emit("1", 8.06, 311, 1);
             socket.emit("1", 8.26, 311, 1);
             socket.emit("1", 8.46, 311, 1);
             socket.emit("1", 8.66, 311, 1);
             socket.emit("1", 8.86, 311, 1);
             socket.emit("1", 9.06, 311, 1);
             socket.emit("1", 9.26, 311, 1);
             socket.emit("1", 9.46, 311, 1);
             socket.emit("1", 9.66, 311, 1);
             socket.emit("1", 9.86, 311, 1);
             socket.emit("1", 10.28, 311, 1);
             socket.emit("1", 10.70, 311, 1);
             socket.emit("1", 10.90, 311, 1);
             socket.emit("1", 11.10, 311, 1);
             socket.emit("1", 11.30, 311, 1);
             socket.emit("1", 11.72, 311, 1);
             socket.emit("1", 12.14, 311, 1);
             socket.emit("1", 12.34, 311, 1);
             socket.emit("1", 12.54, 311, 1);
             socket.emit("1", 12.74, 311, 1);
             socket.emit("1", 12.94, 311, 1);
             socket.emit("1", 13.14, 311, 1);
             socket.emit("1", 13.34, 311, 1);
             socket.emit("1", 13.54, 311, 1);
             socket.emit("1", 13.74, 311, 1);
             socket.emit("1", 13.94, 311, 1);
             socket.emit("1", 10.07, 311, 1);
             socket.emit("1", 10.49, 311, 1);
             socket.emit("1", 11.51, 311, 1);
             socket.emit("1", 11.93, 311, 1);
             socket.emit("1", 4.8625, 245, 1);
             socket.emit("1", 5.1125, 245, 1);
             socket.emit("1", 5.3625, 245, 1);
             socket.emit("1", 5.6125, 245, 1);
             socket.emit("1", 5.8625, 245, 1);
             socket.emit("1", 6.1125, 245, 1);
             socket.emit("1", 6.3625, 245, 1);
             socket.emit("1", 6.6125, 245, 1);
             socket.emit("1", 6.8625, 245, 1);
             socket.emit("1", 7.14, 245, 1);
             socket.emit("1", 7.39, 245, 1);
             socket.emit("1", 7.64, 246, 1);
             socket.emit("1", 7.89, 246, 1);
             socket.emit("1", 8.14, 246, 1);
             socket.emit("1", 8.39, 246, 1);
             socket.emit("1", 8.635, 246, 1);
             socket.emit("1", 8.885, 246, 1);
             socket.emit("1", 2.5825, 245, 1);
             socket.emit("1", 2.8625, 245, 1);
             socket.emit("1", 3.1125, 245, 1);
             socket.emit("1", 3.3625, 245, 1);
             socket.emit("1", 3.6125, 245, 1);
             socket.emit("1", 3.8625, 245, 1);
             socket.emit("1", 4.1125, 245, 1);
             socket.emit("1", 4.3625, 245, 1);
             socket.emit("1", 4.6125, 245, 1);
             socket.emit("1", 4.726, 190, 1);
             socket.emit("1", 5.725, 190, 1);
             socket.emit("1", 2.75, 190, 1);
             socket.emit("1", 3.74, 190, 1);
             socket.emit("1", 5.725, 190, 1);
             socket.emit("1", 2.75, 190, 1);
             socket.emit("1", 6.7215, 189.5, 1);
             socket.emit("1", 5.06, 185, 1);
             socket.emit("1", 5.4, 185, 1);
             socket.emit("1", 6.045, 186, 1);
             socket.emit("1", 6.374, 185, 1);
             socket.emit("1", 5.4, 185, 1);
             socket.emit("1", 7.0425, 188.5, 1);
             socket.emit("1", 7.365, 185, 1);
             socket.emit("1", 7.712, 187.45, 1);
             socket.emit("1", 8.035, 188.5, 1);
             socket.emit("1", 8.36, 185, 1);
             socket.emit("1", 2.425, 188, 1);
             socket.emit("1", 3.075, 184, 1);
             socket.emit("1", 5.06, 185, 1);
             socket.emit("1", 3.42, 186, 1);
             socket.emit("1", 3.74, 190, 1);
             socket.emit("1", 4.06, 186, 1);
             socket.emit("1", 4.39, 185, 1);
             socket.emit("1", 4.725, 130, 1);
             socket.emit("1", 5.245, 130, 1);
             socket.emit("1", 5.715, 130, 1);
             socket.emit("1", 6.185, 130, 1);
             socket.emit("1", 6.655, 130, 1);
             socket.emit("1", 7.13, 130, 1);
             socket.emit("1", 7.6, 130, 1);
             socket.emit("1", 1.85, 130, 1);
             socket.emit("1", 2.32, 130, 1);
             socket.emit("1", 2.79, 130, 1);
             socket.emit("1", 3.265, 130, 1);
             socket.emit("1", 3.735, 130, 1);
             socket.emit("1", 4.205, 130, 1);


    window.statusBar();
    return autoDefense()
}