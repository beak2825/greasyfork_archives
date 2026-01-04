// ==UserScript==
// @name         Gota.io Skins Website Enhancer
// @namespace    https://skins.gota.io/
// @version      1.1
// @description  Turns the skin page into dark theme, re-adjusted fonts and added new skin submission features!
// @author       alex
// @match        https://skins.gota.io/*
// @grant        GM_addStyle
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/411585/Gotaio%20Skins%20Website%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/411585/Gotaio%20Skins%20Website%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function() {
        function assignClass(classname, arg) {
            if (document.getElementsByClassName(classname) == null) return;
            document.getElementsByClassName(classname)[0].id = arg;
        }
        let form = document.getElementById('additional');
        let button = document.getElementById('hideformbutton');

        function setVal(id, arg) {
            return localStorage.setItem(id, arg);
        }

        function getVal(id) {
            return localStorage.getItem(id);
        }

        function applied() {
            let skinName = document.getElementById('starterName').value;
            let skinImage = document.getElementById('starterSkin').value;
            let skinInfo = document.getElementById('starterInfo').value;

            setVal('nameStorage', skinName);
            setVal('imageStorage', skinImage);
            setVal('infoStorage', skinInfo);
        }
        assignClass(`container theme-showcase`, `skinsBg`);

        if (window.location.href == `https://skins.gota.io/skin_request.php`) {
            let newDiv = document.createElement("div");
            newDiv.style = `text-align: center`;
            newDiv.className = "form-group";
            newDiv.id = "moreInfo";
            newDiv.style.color = "white";
            newDiv.style.fontFamily = "Montserrat, sans-serif";

            document.body.appendChild(newDiv);

            document.getElementById(`moreInfo`).innerHTML += `<br>
<div id = "additional">
<h1>Additional Options</h1><br>

<label class="col-md-4 control-label" for="starterName">Starter Value for skin name</label>
<div class="col-md-4">
<input id="starterName" type="text" placeholder="bnok" class="form-control input-md">
</div><br><br>

<label class="col-md-4 control-label" for="starterSkin">Starter Value for skin image</label>
<div class="col-md-4">
<input id="starterSkin" type="text" placeholder="https://i.imgur.com/.png" class="form-control input-md">
</div><br><br>

<label class="col-md-4 control-label" for="starterInfo">Starter Value for other information</label>
<div class="col-md-4">
<input id="starterInfo" type="text" placeholder="just accept my skin kthx" class="form-control input-md">
</div><br><br><br>

<button class = 'btn btn-info' style = 'width: 350px' onclick = 'alert("When you enter a value in something like the Starter Value for skin name textbox, when you press apply changes, the skin name box will automatically start with what you entered. So if I entered bnok into the box, pressed apply changes then refresh, the skin name box will start with bnok.")'; class = 'btn btn-danger'>What do these additional options mean?</button><br><br>
<button class = 'btn btn-primary' style = 'width: 350px' onclick = applied()>Apply changes</button><br><br>
</div>
<button class = 'btn btn-danger' style = 'width: 350px' onclick = additionalTweaks() id = 'hideformbutton'></button>
`
            var scriptElem = document.createElement('script');
            scriptElem.innerHTML = `
function additionalTweaks() {
if (document.getElementById('hideformbutton').innerHTML.startsWith('Hide')) {
  document.getElementById('hideformbutton').innerHTML = 'Show additional options';
  document.getElementById('additional').style = 'display: none';
  localStorage.setItem('onoff', 'off')
} else {
if (document.getElementById('hideformbutton').innerHTML.startsWith('Show')) {
  document.getElementById('hideformbutton').innerHTML = 'Hide additional options';
  document.getElementById('additional').style = 'display: block';
  localStorage.setItem('onoff', 'on')
}
}
}
function applied() {
let skinName = document.getElementById('starterName').value;
let skinImage = document.getElementById('starterSkin').value;
let skinInfo = document.getElementById('starterInfo').value;

setVal('nameStorage', skinName);
setVal('imageStorage', skinImage);
setVal('infoStorage', skinInfo);
}

        if (localStorage.getItem('onoff') == 'off') {
            document.getElementById('hideformbutton').innerHTML = 'Show additional options';
            document.getElementById('additional').style = 'display: none';
        } else {
          if (localStorage.getItem('onoff') == 'on') {
             document.getElementById('hideformbutton').innerHTML = 'Hide additional options';
             document.getElementById('additional').style = 'display: block';
          }
        }

`;
            document.body.appendChild(scriptElem);
            document.getElementById('skinName').value = getVal('nameStorage');
            document.getElementById('skinImage').value = getVal('imageStorage');
            document.getElementById('otherInfo').value = getVal('infoStorage');
            document.getElementById('starterName').value = getVal('nameStorage');
            document.getElementById('starterSkin').value = getVal('imageStorage');
            document.getElementById('starterInfo').value = getVal('infoStorage');
        }

        GM_addStyle(`@import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');
body {
background-color: #242424;
font-family: 'Montserrat', sans-serif;
color: white;
}
.jumbotron {
background-color: #3b3b3b;
}
#skinsBg {
background-color: #3b3b3b;
};
legend {
font-size:0px;
}
`)
    }
})();