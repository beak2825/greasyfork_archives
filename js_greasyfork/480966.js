// ==UserScript==
// @name         Hacks For Yohoho.io
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Hacks For Yohoho.io! Including: Infinity Coins, Get All Skins, Get All Pets And Infinity XP!
// @author       Gabi
// @match        https://yohoho.io
// @match        https://yohoho3.com
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480966/Hacks%20For%20Yohohoio.user.js
// @updateURL https://update.greasyfork.org/scripts/480966/Hacks%20For%20Yohohoio.meta.js
// ==/UserScript==

function start() {

//-------------Local Storage--------------

if(localStorage.getItem('ThemeColor')==null) {
    var themeColor = "#ff0000";
} else {
    var themeColor = localStorage.getItem('ThemeColor')
}

if(localStorage.getItem('GUIX')==null) {
    localStorage.setItem('GUIX', "100px")
    localStorage.setItem('GUIY', "100px")
    location.reload()
} else {
    var GUIX = localStorage.getItem('GUIX')
    var GUIY = localStorage.getItem('GUIY')
}



if(localStorage.getItem('SHK')==null) {
      localStorage.setItem('SHK', 'Show/Hide Key')
      location.reload()
} else {
    var SHK = localStorage.getItem('SHK')
}

//-------------HTML--------------

var guiWrap = document.createElement('div')

guiWrap.innerHTML=`
<div id="gui" >
<a id="title" >GabiMod</a>

  <ul>
  <li>
    <input class="check" type="checkbox">
    <a class="checkDesc">Remove Ads</a>
  </li>
  <li>
    <input class="check" type="checkbox">
    <a class="checkDesc">Hide Help list</a>
  </li>
  <li>
    <input class="valInput" placeholder="Set Theme Color" >
    <button class="applyBtn">Apply</button>
  </li>
  <li>
    <input class="valInput" placeholder="Set Coins Value..." >
    <button class="applyBtn">Apply</button>
  </li>
  <li>
    <input class="valInput" placeholder="Set XP Value..." >
    <button class="applyBtn">Apply</button>
  </li>
  <li>
    <input class="valInput" placeholder="Set Best Kills..." >
    <button class="applyBtn">Apply</button>
  </li>
  <li>
    <input class="valInput" placeholder="Set Best Score..." >
    <button class="applyBtn" >Apply</button>
  </li>
  <li>
    <input class="valInput" placeholder="Set Total Kills..." >
    <button class="applyBtn" >Apply</button>
  </li>
  <li>
    <input class="valInput" placeholder="Set Total Wins..." >
    <button class="applyBtn" >Apply</button>
  </li>
  <li>
    <input class="valInput" placeholder="Set Total Gametime..." >
    <button class="applyBtn" >Apply</button>
  </li>
  <li>
    <input class="valInput" placeholder="Set Bot Level..." >
    <button class="applyBtn" >Apply</button>
  </li>
  <li>
    <input class="valInput" placeholder="Set Skin (1-35)..." >
    <button class="applyBtn" >Apply</button>
  </li>
  <li>
    <input class="valInput" placeholder="Set Pet (1-9)..." >
    <button class="applyBtn" >Apply</button>
  </li>
  <li>
    <input class="valInput" placeholder="Set Pet Level..." >
    <button class="applyBtn" >Apply</button>
  </li>
  <select class="drop">
    <option>Show/Hide Key</option>
    <option>a</option>
    <option>b</option>
    <option>c</option>
    <option>d</option>
    <option>e</option>
    <option>f</option>
    <option>g</option>
    <option>h</option>
    <option>i</option>
    <option>j</option>
    <option>k</option>
    <option>l</option>
    <option>m</option>
    <option>n</option>
    <option>o</option>
    <option>p</option>
    <option>q</option>
    <option>r</option>
    <option>s</option>
    <option>t</option>
    <option>u</option>
    <option>v</option>
    <option>w</option>
    <option>x</option>
    <option>y</option>
    <option>z</option>
    <option>/</option>
    <option>,</option>
    <option>.</option>
    <option>-</option>
    <option>'</option>
    <option>*</option>
    <option>+</option>
  </select>
    <button class="applyBtn">Apply</button>
  </li>
  <li>
    <button id="applyAll" style="width:61%; margin-top: 1vw;" class="applyBtn" >Apply All</button>
  </li>

</ul>

</div>
`

//-------------CSS--------------

var guiStyle = document.createElement('style')
guiStyle.innerHTML=`
#gui {
    font-family: "Lucida Console", "Courier New", monospace;
  }

  ul {
    position: relative;
    top: 20%;
    left: 6%;
    padding: 0;
    height: 65%;
    width: 100%;
    overflow:hidden;
    overflow-y:scroll;
  }
  li {
    margin-bottom: 3%;
  }
  #title {
    color: ${themeColor};
    left: 40%;
    top: 7px;
    cursor: move;
    font-size: 13px;
    position: relative;
  }
  #gui {
    height:40%;
    z-index: 100;
    width:30%;
    max-width: 300px;
    opacity: 90%;
    position: absolute;
    left: ${GUIX};
    top: ${GUIY};
    background: black;
    border-radius: 10px;
    border: 1.5px ${themeColor} solid;
  }
  .applyBtn {
    color: #75756e;
    background: none;
    border: 1px ${themeColor} solid;
    border-radius: 4px;
    height: 3vw;
  }
  .valInput {
    width: 40%;
    background: none;
    color: white;
    border: 1px ${themeColor} solid;
    border-radius: 4px;
    height: 2.7vw;
  }

  .drop {
    width: 42%;
    background: none;
    color: white;
    border: 1px ${themeColor} solid;
    border-radius: 4px;
    height: 3vw;
    color: #75756e;
  }
  option {
    background: black;
    color: ${themeColor};
    border: 1px red solid;
    opacity; 90%;
  }

  .checkDesc {
    color: white;
    font-size: 15px;
  }
  .check {
    top: 30%;
    width: 1.3em;
    height: 1.3em;
    border-radius: 30%;
    appearance: none;
    vertical-align: middle;
    outline: ${themeColor} 1px solid;
  }

  .check:checked:after {
      content: "x";
      color: #000000;
      position: relative;
      left: 25%;
      top: -15%;
      font-weight:900;
  }

  .check:checked {
      background-color: ${themeColor};
  }

  ::-webkit-scrollbar {
      display: none;
  }
`

//-------------Javascript--------------

document.body.appendChild(guiStyle)
document.body.appendChild(guiWrap)


//------------Variables----------------


var title = document.getElementById('title')
var gui = document.getElementById('gui')
var applyBtn = document.getElementsByClassName('applyBtn')
var valInput = document.getElementsByClassName('valInput')
var drop = document.getElementsByClassName('drop')
var adCheck = document.getElementsByClassName('check')[0]
var listCheck = document.getElementsByClassName('check')[1]
var checkboxes = document.querySelectorAll('[class="check"]')
var applyAll = document.getElementById('applyAll')


//------------Setup--------------------

gui.style.userSelect="none"
drop[0].value=SHK


//-------Intervals and Timeouts--------

function start() {
    setInterval(function() {
        localStorage.setItem('GUIX', gui.style.left)
        localStorage.setItem('GUIY', gui.style.top)
    },100)
}

setTimeout(function() {
    hms()
},3000)

//------------Local Storages 2---------

function hms() {
    if(localStorage.getItem('check1')==null) {
        adCheck.checked=false
         document.querySelectorAll('[class="inside"]')[2].style.display="block"
    }
    if (localStorage.getItem('check1')=='true'){
        adCheck.checked=true
         document.querySelectorAll('[class="inside"]')[2].style.display="none"
    }
    if(localStorage.getItem('check2')==null) {
        listCheck.checked=false
         document.querySelectorAll('[class="inside"]')[0].style.display="block"
    }
    if (localStorage.getItem('check2')=='true'){
        listCheck.checked=true
         document.querySelectorAll('[class="inside"]')[0].style.display="none"
    }
}

//-------------Event Listeners--------------

window.onload = addListeners();

function addListeners(){
    title.addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, false);
    window.addEventListener('keydown', keydown, false);

}

applyBtn[0].addEventListener('click', function() {
    localStorage.setItem('ThemeColor', valInput[0].value)
    location.reload()
})
applyBtn[1].addEventListener('click', function() {
    localStorage.setItem('coinsOwned', valInput[1].value)
    location.reload()
})
applyBtn[2].addEventListener('click', function() {
    localStorage.setItem('playerXP', valInput[2].value)
    location.reload()
})
applyBtn[3].addEventListener('click', function() {
    localStorage.setItem('bestKills', valInput[3].value)
    location.reload()
})
applyBtn[4].addEventListener('click', function() {
    localStorage.setItem('bestScore', valInput[4].value)
    location.reload()
})
applyBtn[5].addEventListener('click', function() {
    localStorage.setItem('totalKills', valInput[5].value)
    location.reload()
})
applyBtn[6].addEventListener('click', function() {
    localStorage.setItem('totalWins', valInput[6].value)
    location.reload()
})
applyBtn[7].addEventListener('click', function() {
    localStorage.setItem('totalGameTime', valInput[7].value)
    location.reload()
})
applyBtn[8].addEventListener('click', function() {
    localStorage.setItem('abBotSkillLevel', valInput[8].value)
    location.reload()
})
applyBtn[9].addEventListener('click', function() {
    localStorage.setItem('playerSkin', valInput[9].value)
    location.reload()
})
applyBtn[10].addEventListener('click', function() {
    localStorage.setItem('playerPet', valInput[10].value)
    location.reload()
})
applyBtn[11].addEventListener('click', function() {
    localStorage.setItem('playerPetLevel', valInput[11].value)
    location.reload()
})
applyBtn[12].addEventListener('click', function() {
    if(drop[0].value=="Show/Hide Key") {
        alert("failed")
    } else {
        localStorage.setItem('SHK', drop[0].value)
        location.reload()
    }
})
applyAll.addEventListener('click', function() {
   for(var i=0;i<applyBtn.length;i++) {
       applyBtn[i].click()
   }
})


function mouseUp()
{
    window.removeEventListener('mousemove', divMove, true);
    document.body.style.userSelect="all"
}

function mouseDown(e){
    document.body.style.userSelect="none"
    window.addEventListener('mousemove', divMove, true);
}

function divMove(e) {
    start()
    gui.style.left=e.clientX-150+"px"
    gui.style.top=e.clientY-10+"px"
}
function keydown(e) {
    if(e.key==`${SHK}`) {
         show();
    }
}

adCheck.addEventListener('click', function() {

    if(adCheck.checked==true) {
        localStorage.setItem('check1', true)
        document.querySelectorAll('[class="inside"]')[2].style.display="none"
    }

    if(adCheck.checked==false) {
        localStorage.setItem('check1', null)
         document.querySelectorAll('[class="inside"]')[2].style.display="block"
    }
})
listCheck.addEventListener('click', function() {

    if(listCheck.checked==true) {
        localStorage.setItem('check2', true)
        document.querySelectorAll('[class="inside"]')[0].style.display="none"
    }

    if(listCheck.checked==false) {
        localStorage.setItem('check2', null)
         document.querySelectorAll('[class="inside"]')[0].style.display="block"
    }
})

var show = function() {
    var on = false;
    return function() {
    if(!on) {
        on = true;
        gui.style.display="block"
        return;
    }
     gui.style.display="none"
     on = false;
}
}();
show()
}
start()