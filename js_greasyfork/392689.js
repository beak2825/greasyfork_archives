// ==UserScript==
// @name         Defend Auto Base de 179 Soldiers
// @namespace    -
// @version      1.5
// @description  HIHIHIHIHI
// @author       Coelho
// @match        http://bloble.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392689/Defend%20Auto%20Base%20de%20179%20Soldiers.user.js
// @updateURL https://update.greasyfork.org/scripts/392689/Defend%20Auto%20Base%20de%20179%20Soldiers.meta.js
// ==/UserScript==

window.UIList = window.UIList || [];
window.initFuncs = window.initFuncs || [];
window.statusItems = window.statusItems || [];
window.autoDefense = false;
window.UIList.push({
level: 1,
    x: 5,
    html: '<div id=auto onclick=autodefense()>Defend Base: Active</div>'
});
window.autodefense = function () {
    var elaa = document.getElementById('auto');
    if (autoDefense) {
        autoDefense = false
        elaa.textContent = 'Defend Base: Off'
        clearInterval(teste)
    } else {
        autoDefense = true;
        elaa.textContent = 'Defend Base: On';
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
             }
                   socket.emit("1",4.81,130,1);
                socket.emit("1",5.36,130,1);
                socket.emit("1",6.275,130,1);
                socket.emit("1",6.775,130,1);
                socket.emit("1",7.3,130,1);
                socket.emit("1",7.85,130,1);
                socket.emit("1",8.4,130,1);
                socket.emit("1",8.925,130,1);
                socket.emit("1",9.5,130,1);
                socket.emit("1",10.05,130,1);
                socket.emit("1",10.6,130,1);
                socket.emit("1",4.5889,186.5,1);
                socket.emit("1",5.085,180.5,1);
                socket.emit("1",5.64,180,1);
                socket.emit("1",5.999,180,1);
                socket.emit("1",6.51,185,1);
                socket.emit("1",7.05,185,1);
                socket.emit("1",7.6,185,1);
                socket.emit("1",8.15,185,1);
                socket.emit("1",8.675,185,1);
                socket.emit("1",9.225,185,1);
                socket.emit("1",9.78,185,1);
                socket.emit("1",10.325,185,1);
                socket.emit("1",4.73,245,1);
                socket.emit("1",5.0025,245,1);
                socket.emit("1",5.275,245,1);
                socket.emit("1",5.5475,245,1);
                socket.emit("1",5.82,245,1);
                socket.emit("1",6.0925,245,1);
                socket.emit("1",6.365,245,1);
                socket.emit("1",6.6375,245,1);
                socket.emit("1",6.91,245,1);
                socket.emit("1",7.1825,245,1);
                socket.emit("1",7.455,245,1);
                socket.emit("1",7.7275,245,1);
                socket.emit("1",8.0025,245,1);
                socket.emit("1",8.275,245,1);
                socket.emit("1",8.5475,245,1);
                socket.emit("1",8.82,245,1);
socket.emit("1",9.0925,245,1);
                socket.emit("1",9.3675,245,1);
                socket.emit("1",9.64,245,1);
                socket.emit("1",9.9125,245,1);
                socket.emit("1",10.1875,245,1);
                socket.emit("1",10.4625,245,1);
                socket.emit("1",10.7375,245,1);
           }
    }
    window.statusBar();
    return autoDefense()
