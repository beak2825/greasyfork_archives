// ==UserScript==
// @name        Bug de Tanks
// @namespace    -
// @version      1.5
// @description  HIHIHIHIHI
// @author       MODERNO
// @match        http://bloble.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404611/Bug%20de%20Tanks.user.js
// @updateURL https://update.greasyfork.org/scripts/404611/Bug%20de%20Tanks.meta.js
// ==/UserScript==

window.UIList = window.UIList || [];
window.initFuncs = window.initFuncs || [];
window.statusItems = window.statusItems || [];
window.autoDefense = false;
window.UIList.push({
level: 1,
    x: 5,
  
        html: '<div id=auto onclick=autodefense()>Bug de tanks: Active</div>'
});
window.autodefense = function () {
    var elaa = document.getElementById('auto');
    if (autoDefense) {
        autoDefense = false
        elaa.textContent = 'Bug de tanks: Off'
        clearInterval(teste)
    } else {
        autoDefense = true;
        elaa.textContent = 'Bug de tanks: On';
        window.teste = setInterval(autodefesa, 250)
        function autodefesa() {
                      socket.emit("4",0,0,1);}
    };
    window.statusBar();
    return autoDefense()
}