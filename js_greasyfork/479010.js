// ==UserScript==
// @name         Evoworld.io cелектор серверов Европы
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.1
// @description  a cheat that can connect to a disabled server and so on
// @author       <<<>>>
// @match        https://evoworld.io/
// @icon         https://www.google.com/s2/favicons?sz=64&doyyy=evoworld.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479010/Evoworldio%20c%D0%B5%D0%BB%D0%B5%D0%BA%D1%82%D0%BE%D1%80%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2%20%D0%95%D0%B2%D1%80%D0%BE%D0%BF%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/479010/Evoworldio%20c%D0%B5%D0%BB%D0%B5%D0%BA%D1%82%D0%BE%D1%80%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2%20%D0%95%D0%B2%D1%80%D0%BE%D0%BF%D1%8B.meta.js
// ==/UserScript==
(function() {
    'use scrict';

   let overlayHTML = `
<div id="box">
    <div class="yyy" id="box2">

<select class="selectServer" id="selectServer"><option value="wss://162-19-84-53.evoworld.io:1540" ="">Europe 1 (?/?)</option><option value="wss://51-178-74-235.evoworld.io:1540" ="">Europe 2 (?/?)</option><option value="wss://162-19-84-53.evoworld.io:2540" ="">Europe 3 (?/?)</option><option value="wss://51-178-74-235.evoworld.io:2540" ="">Europe 4 (?/?)</option><option value="wss://162-19-84-53.evoworld.io:3540">Europe 5 (?/?)</option><option value="wss://51-178-74-235.evoworld.io:3540">Europe 6 (?/?)</option><option value="wss://15-235-86-116.evoworld.io:1540">Europe 7 (?/?)</option><option value="wss://162-19-84-53.evoworld.io:4540">Europe 8 (?/?)</option><option value="wss://51-178-74-235.evoworld.io:4540">Europe 9 (?/?)</option><option value="wss://162-19-84-53.evoworld.io:5540">Europe 10 (?/?)</option><option value="wss://51-178-74-235.evoworld.io:5540">Europe 11 (?/?)</option><option value="wss://162-19-84-53.evoworld.io:6540">Europe 12 (?/?)</option><option value="wss://51-178-74-235.evoworld.io:6540"> </option></select>
</div>
</div>

<style>
#box {
    z-index: 10;
    position: absolute;
    top: 220px;
    left: 7px;
    transition: 0.5s;
    }

#box2 {
    padding: 15px;
    margin-bottom: 5px;
    display: grid;
    }

section {
    margin: auto;
   display: flex;
    justify-content: space-between;padding:5px;
    }

.yyy {
    background-color: #ffffff;
    letter-spacing: 2px;
    font-weight: bold;
    font-size: 15px;
    font-family: 'Normal', normal-serif;
    color:white;
    border-radius: 8px;
    }
p {
    text-align: center;
    border-bottom:1px solid white;
    border-top:1px solid white;
}

label {
    font-weight: bold}

.button {
  margin: auto;
  background-color: #f1f1f1;
  color: white;
  font-size: 16px;
  border: none;
  padding: 8px;
  border-radius: 6px;
  transition: 0.15s;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  border: 5px solid #121414;
}

.dropdown-content1 {
  display: none;
  position: absolute;
  left: 170px;
  background-color: #f1f1f1;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  border: 5px solid #121414;
}

.dropdown-content2 {
  display: none;
  position: absolute;
  left: 340px;
  background-color: #f1f1f1;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  border: 5px solid #121414;
}

.dropdown-content3 {
  display: none;
  position: absolute;
  left: 510px;
  background-color: #f1f1f1;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  border: 5px solid #121414;
}

.dropdown-content4 {
  display: none;
  position: absolute;
  left: 680px;
  background-color: #f1f1f1;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  border: 5px solid #121414;
}

.dropdown-content p {
  color: grey;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  transition: 0.3s;
}

.dropdown-content1 p {
  color: grey;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  transition: 0.3s;
}

.dropdown-content2 p {
  color: grey;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  transition: 0.3s;
}

.dropdown-content3 p {
  color: grey;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  transition: 0.3s;
}

.dropdown-content4 p {
  color: grey;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  transition: 0.3s;
}



.dropdown-content p:hover {background-color: #f1f1f1;}

.dropdown-content1 p:hover {background-color: #f1f1f1;}

.dropdown-content2 p:hover {background-color: #121414;}

.dropdown-content3 p:hover {background-color: #121414;}

.dropdown-content4 p:hover {background-color: #f1f1f1;}

.custom-button p:hover {background-color: #121414;}

.dropdown:hover .dropdown-content {display: block; background-color: #242829;}

.dropdown:hover .dropdown-content1 {display: block; background-color: #f1f1f1;}

.dropdown:hover .dropdown-content2 {display: block; background-color: #242829;}

.dropdown:hover .dropdown-content3 {display: block; background-color: #f1f1f1;}

.dropdown:hover .dropdown-content4 {display: block; background-color: #f1f1f1;}

.dropdown:hover .button {background-color: #f1f1f1;}
</style>
`

function get(x)            { return document.getElementById(x); };

let overlay             = document.createElement("div");
    overlay.innerHTML   = overlayHTML;
    document.body.appendChild(overlay);

let acc                 = get("accordian"),
    box                  = get ("box");

})();