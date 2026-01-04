// ==UserScript==
// @name         Gats.io right click for spacebar (07/2025)
// @version      2.5
// @description  Now working ability to press the right click in order to use the spacebar. Now also works for shield!
// @author       Rayan223
// @match        https://gats.io
// @icon         none
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/825882
// @downloadURL https://update.greasyfork.org/scripts/433998/Gatsio%20right%20click%20for%20spacebar%20%28072025%29.user.js
// @updateURL https://update.greasyfork.org/scripts/433998/Gatsio%20right%20click%20for%20spacebar%20%28072025%29.meta.js
// ==/UserScript==

function playing() {
    var menu = document.getElementById('slct');
    if (menu.className == "container"){
        return false
    }else{
        return true
    }
};

document.addEventListener('mousedown', e => {
    if(playing() && event.which == 3){
        Connection.list[0].socket.send('k,5,1');
    }
});

document.addEventListener('mouseup', e => {
    if(playing() && event.which == 3){
        Connection.list[0].socket.send('k,5,0');
    }
});