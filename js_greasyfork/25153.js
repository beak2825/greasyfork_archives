// ==UserScript==
// @name        Massive Reset for Lon-Capa
// @description One click button to reset whole section
// @namespace   https://peijunz.github.io
// @author      Peijun Zhu
// @include     http://nplq1.phyast.pitt.edu/adm/grades
// @include     http://homework.phyast.pitt.edu/adm/grades
// @version     2017.09.07.2
// @grant       none
// @icon        http://www.courseweaver.com/images/lc_logo.png
// @downloadURL https://update.greasyfork.org/scripts/25153/Massive%20Reset%20for%20Lon-Capa.user.js
// @updateURL https://update.greasyfork.org/scripts/25153/Massive%20Reset%20for%20Lon-Capa.meta.js
// ==/UserScript==
function resetAll() {
    l = document.getElementsByTagName('select');
    for (index = 0; index < l.length; ++index) {
        if (!l[index].value) {
            l[index].value = 'reset status';
        }
    }
}
id = "resetall_button";
t = document.getElementById(id);
if(t === null){
    var resetButton = document.createElement("input");
    resetButton.setAttribute("id", id);
    resetButton.type = "button";
    resetButton.value = "Reset Current Section";
    resetButton.onclick = resetAll;
    document.body.appendChild(resetButton);
}
