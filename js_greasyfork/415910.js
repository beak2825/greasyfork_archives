// ==UserScript==
// @name         Mines
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  don't read line 319
// @author       Daemonheim
// @include      *https://runechat.com/mines*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/415910/Mines.user.js
// @updateURL https://update.greasyfork.org/scripts/415910/Mines.meta.js
// ==/UserScript==


var itemsProcessed = 0;
// set up the mutation observer
var observer = new MutationObserver(function (mutations, me) {
  // `mutations` is an array of mutations that occurred
  // `me` is the MutationObserver instance
  var canvas = document.querySelector("#app > div.mines > div.options > div.mode-selector > button.mode-button.manual.active");
  if (canvas) {
    handleCanvas(canvas);
    me.disconnect();
    return;
  }
});


observer.observe(document, {
  childList: true,
  subtree: true
});




function handleCanvas(canvas) {












document.querySelector("#app > div.mines > div.options > div.mode-selector > button.mode-button.auto").onclick=function(){

var myElements = document.getElementsByClassName("segment clickable");
for(var i = 1; i < myElements.length; i++){

    if(myElements[i].style.backgroundColor=="rgb(50, 205, 50)")
{console.log("element checked");
myElements[i].click()};

}
};






var panel =document.createElement("div");
panel.style.cssText="position:relative;left:1px;top:7px;height:297px;width:300px;background-color:#223d53"
document.querySelector("#app > div.mines > div.options").appendChild(panel);

var c1 = document.createElement("INPUT");
c1.setAttribute("type", "checkbox");
c1.style.cssText="position:relative;left:6px;top:6px;width:50px;height:50px"
panel.appendChild(c1);
var c2 = document.createElement("INPUT");
c2.setAttribute("type", "checkbox");
c2.style.cssText="position:relative;left:6px;top:6px;width:50px;height:50px"
panel.appendChild(c2);
var c3 = document.createElement("INPUT");
c3.setAttribute("type", "checkbox");
c3.style.cssText="position:relative;left:6px;top:6px;width:50px;height:50px"
panel.appendChild(c3);
var c4 = document.createElement("INPUT");
c4.setAttribute("type", "checkbox");
c4.style.cssText="position:relative;left:6px;top:6px;width:50px;height:50px"
panel.appendChild(c4);
var c5 = document.createElement("INPUT");
c5.setAttribute("type", "checkbox");
c5.style.cssText="position:relative;left:6px;top:6px;width:50px;height:50px"
panel.appendChild(c5);
var c6 = document.createElement("INPUT");
c6.setAttribute("type", "checkbox");
c6.style.cssText="position:relative;left:6px;top:6px;width:50px;height:50px"
panel.appendChild(c6);
var c7= document.createElement("INPUT");
c7.setAttribute("type", "checkbox");
c7.style.cssText="position:relative;left:6px;top:6px;width:50px;height:50px"
panel.appendChild(c7);
var c8 = document.createElement("INPUT");
c8.setAttribute("type", "checkbox");
c8.style.cssText="position:relative;left:6px;top:6px;width:50px;height:50px"
panel.appendChild(c8);
var c9 = document.createElement("INPUT");
c9.setAttribute("type", "checkbox");
c9.style.cssText="position:relative;left:6px;top:6px;width:50px;height:50px"
panel.appendChild(c9);
var c10 = document.createElement("INPUT");
c10.setAttribute("type", "checkbox");
c10.style.cssText="position:relative;left:6px;top:6px;width:50px;height:50px"
panel.appendChild(c10);
var c11 = document.createElement("INPUT");
c11.setAttribute("type", "checkbox");
c11.style.cssText="position:relative;left:6px;top:6px;width:50px;height:50px"
panel.appendChild(c11);
var c12 = document.createElement("INPUT");
c12.setAttribute("type", "checkbox");
c12.style.cssText="position:relative;left:6px;top:6px;width:50px;height:50px"
panel.appendChild(c12);
var c13 = document.createElement("INPUT");
c13.setAttribute("type", "checkbox");
c13.style.cssText="position:relative;left:6px;top:6px;width:50px;height:50px"
panel.appendChild(c13);
var c14 = document.createElement("INPUT");
c14.setAttribute("type", "checkbox");
c14.style.cssText="position:relative;left:6px;top:6px;width:50px;height:50px"
panel.appendChild(c14);
var c15 = document.createElement("INPUT");
c15.setAttribute("type", "checkbox");
c15.style.cssText="position:relative;left:6px;top:6px;width:50px;height:50px"
panel.appendChild(c15);
var c16 = document.createElement("INPUT");
c16.setAttribute("type", "checkbox");
c16.style.cssText="position:relative;left:6px;top:6px;width:50px;height:50px"
panel.appendChild(c16);
var c17 = document.createElement("INPUT");
c17.setAttribute("type", "checkbox");
c17.style.cssText="position:relative;left:6px;top:6px;width:50px;height:50px"
panel.appendChild(c17);
var c18 = document.createElement("INPUT");
c18.setAttribute("type", "checkbox");
c18.style.cssText="position:relative;left:6px;top:6px;width:50px;height:50px"
panel.appendChild(c18);
var c19 = document.createElement("INPUT");
c19.setAttribute("type", "checkbox");
c19.style.cssText="position:relative;left:6px;top:6px;width:50px;height:50px"
panel.appendChild(c19);
var c20 = document.createElement("INPUT");
c20.setAttribute("type", "checkbox");
c20.style.cssText="position:relative;left:6px;top:6px;width:50px;height:50px"
panel.appendChild(c20);
var c21 = document.createElement("INPUT");
c21.setAttribute("type", "checkbox");
c21.style.cssText="position:relative;left:6px;top:6px;width:50px;height:50px"
panel.appendChild(c21);
var c22 = document.createElement("INPUT");
c22.setAttribute("type", "checkbox");
c22.style.cssText="position:relative;left:6px;top:6px;width:50px;height:50px"
panel.appendChild(c22);
var c23 = document.createElement("INPUT");
c23.setAttribute("type", "checkbox");
c23.style.cssText="position:relative;left:6px;top:6px;width:50px;height:50px"
panel.appendChild(c23);
var c24 = document.createElement("INPUT");
c24.setAttribute("type", "checkbox");
c24.style.cssText="position:relative;left:6px;top:6px;width:50px;height:50px"
panel.appendChild(c24);
var c25 = document.createElement("INPUT");
c25.setAttribute("type", "checkbox");
c25.style.cssText="position:relative;left:6px;top:6px;width:50px;height:50px"
panel.appendChild(c25);

















c1.addEventListener('change', (event) => {
  if (event.target.checked) {
   document.querySelector("#app > div.mines > div.game > div > div:nth-child(1)").style.cssText="background-color:#32CD32";
  } else {
document.querySelector("#app > div.mines > div.game > div > div:nth-child(1)").style.cssText="background-color:#223d53";
  }
});
c2.addEventListener('change', (event) => {
  if (event.target.checked) {
   document.querySelector("#app > div.mines > div.game > div > div:nth-child(2)").style.cssText="background-color:#32CD32";
  } else {
document.querySelector("#app > div.mines > div.game > div > div:nth-child(2)").style.cssText="background-color:#223d53";
  }
});
c3.addEventListener('change', (event) => {
  if (event.target.checked) {
   document.querySelector("#app > div.mines > div.game > div > div:nth-child(3)").style.cssText="background-color:#32CD32";
  } else {
document.querySelector("#app > div.mines > div.game > div > div:nth-child(3)").style.cssText="background-color:#223d53";
  }
});
c4.addEventListener('change', (event) => {
  if (event.target.checked) {
   document.querySelector("#app > div.mines > div.game > div > div:nth-child(4)").style.cssText="background-color:#32CD32";
  } else {
document.querySelector("#app > div.mines > div.game > div > div:nth-child(4)").style.cssText="background-color:#223d53";
  }
});
c5.addEventListener('change', (event) => {
  if (event.target.checked) {
   document.querySelector("#app > div.mines > div.game > div > div:nth-child(5)").style.cssText="background-color:#32CD32";
  } else {
document.querySelector("#app > div.mines > div.game > div > div:nth-child(5)").style.cssText="background-color:#223d53";
  }
});
c6.addEventListener('change', (event) => {
  if (event.target.checked) {
   document.querySelector("#app > div.mines > div.game > div > div:nth-child(6)").style.cssText="background-color:#32CD32";
  } else {
document.querySelector("#app > div.mines > div.game > div > div:nth-child(6)").style.cssText="background-color:#223d53";
  }
});
c7.addEventListener('change', (event) => {
  if (event.target.checked) {
   document.querySelector("#app > div.mines > div.game > div > div:nth-child(7)").style.cssText="background-color:#32CD32";
  } else {
document.querySelector("#app > div.mines > div.game > div > div:nth-child(7)").style.cssText="background-color:#223d53";
  }
});
c8.addEventListener('change', (event) => {
  if (event.target.checked) {
   document.querySelector("#app > div.mines > div.game > div > div:nth-child(8)").style.cssText="background-color:#32CD32";
  } else {
document.querySelector("#app > div.mines > div.game > div > div:nth-child(8)").style.cssText="background-color:#223d53";
  }
});
c9.addEventListener('change', (event) => {
  if (event.target.checked) {
   document.querySelector("#app > div.mines > div.game > div > div:nth-child(9)").style.cssText="background-color:#32CD32";
  } else {
document.querySelector("#app > div.mines > div.game > div > div:nth-child(9)").style.cssText="background-color:#223d53";
  }
});
c10.addEventListener('change', (event) => {
  if (event.target.checked) {
   document.querySelector("#app > div.mines > div.game > div > div:nth-child(10)").style.cssText="background-color:#32CD32";
  } else {
document.querySelector("#app > div.mines > div.game > div > div:nth-child(10)").style.cssText="background-color:#223d53";
  }
});
c11.addEventListener('change', (event) => {
  if (event.target.checked) {
   document.querySelector("#app > div.mines > div.game > div > div:nth-child(11)").style.cssText="background-color:#32CD32";
  } else {
document.querySelector("#app > div.mines > div.game > div > div:nth-child(11)").style.cssText="background-color:#223d53";
  }
});
c12.addEventListener('change', (event) => {
  if (event.target.checked) {
   document.querySelector("#app > div.mines > div.game > div > div:nth-child(12)").style.cssText="background-color:#32CD32";
  } else {
document.querySelector("#app > div.mines > div.game > div > div:nth-child(12)").style.cssText="background-color:#223d53";
  }
});
c13.addEventListener('change', (event) => {
  if (event.target.checked) {
   document.querySelector("#app > div.mines > div.game > div > div:nth-child(13)").style.cssText="background-color:#32CD32";
  } else {
document.querySelector("#app > div.mines > div.game > div > div:nth-child(13)").style.cssText="background-color:#223d53";
  }
});
c14.addEventListener('change', (event) => {
  if (event.target.checked) {
   document.querySelector("#app > div.mines > div.game > div > div:nth-child(14)").style.cssText="background-color:#32CD32";
  } else {
document.querySelector("#app > div.mines > div.game > div > div:nth-child(14)").style.cssText="background-color:#223d53";
  }
});
c15.addEventListener('change', (event) => {
  if (event.target.checked) {
   document.querySelector("#app > div.mines > div.game > div > div:nth-child(15)").style.cssText="background-color:#32CD32";
  } else {
document.querySelector("#app > div.mines > div.game > div > div:nth-child(15)").style.cssText="background-color:#223d53";
  }
});
c16.addEventListener('change', (event) => {
  if (event.target.checked) {
   document.querySelector("#app > div.mines > div.game > div > div:nth-child(16)").style.cssText="background-color:#32CD32";
  } else {
document.querySelector("#app > div.mines > div.game > div > div:nth-child(16)").style.cssText="background-color:#223d53";
  }
});
c17.addEventListener('change', (event) => {
  if (event.target.checked) {
   document.querySelector("#app > div.mines > div.game > div > div:nth-child(17)").style.cssText="background-color:#32CD32";
  } else {
document.querySelector("#app > div.mines > div.game > div > div:nth-child(17)").style.cssText="background-color:#223d53";
  }
});
c18.addEventListener('change', (event) => {
  if (event.target.checked) {
   document.querySelector("#app > div.mines > div.game > div > div:nth-child(18)").style.cssText="background-color:#32CD32";
  } else {
document.querySelector("#app > div.mines > div.game > div > div:nth-child(18)").style.cssText="background-color:#223d53";
  }
});
c19.addEventListener('change', (event) => {
  if (event.target.checked) {
   document.querySelector("#app > div.mines > div.game > div > div:nth-child(19)").style.cssText="background-color:#32CD32";
  } else {
document.querySelector("#app > div.mines > div.game > div > div:nth-child(19)").style.cssText="background-color:#223d53";
  }
});
//Rules are made to be broken i guess
c20.addEventListener('change', (event) => {
  if (event.target.checked) {
   document.querySelector("#app > div.mines > div.game > div > div:nth-child(20)").style.cssText="background-color:#32CD32";
  } else {
document.querySelector("#app > div.mines > div.game > div > div:nth-child(20)").style.cssText="background-color:#223d53";
  }
});
c21.addEventListener('change', (event) => {
  if (event.target.checked) {
   document.querySelector("#app > div.mines > div.game > div > div:nth-child(21)").style.cssText="background-color:#32CD32";
  } else {
document.querySelector("#app > div.mines > div.game > div > div:nth-child(21)").style.cssText="background-color:#223d53";
  }
});
c22.addEventListener('change', (event) => {
  if (event.target.checked) {
   document.querySelector("#app > div.mines > div.game > div > div:nth-child(22)").style.cssText="background-color:#32CD32";
  } else {
document.querySelector("#app > div.mines > div.game > div > div:nth-child(22)").style.cssText="background-color:#223d53";
  }
});
c23.addEventListener('change', (event) => {
  if (event.target.checked) {
   document.querySelector("#app > div.mines > div.game > div > div:nth-child(23)").style.cssText="background-color:#32CD32";
  } else {
document.querySelector("#app > div.mines > div.game > div > div:nth-child(23)").style.cssText="background-color:#223d53";
  }
});
c24.addEventListener('change', (event) => {
  if (event.target.checked) {
   document.querySelector("#app > div.mines > div.game > div > div:nth-child(24)").style.cssText="background-color:#32CD32";
  } else {
document.querySelector("#app > div.mines > div.game > div > div:nth-child(24)").style.cssText="background-color:#223d53";
  }
});
c25.addEventListener('change', (event) => {
  if (event.target.checked) {
   document.querySelector("#app > div.mines > div.game > div > div:nth-child(25)").style.cssText="background-color:#32CD32";
  } else {
document.querySelector("#app > div.mines > div.game > div > div:nth-child(25)").style.cssText="background-color:#223d53";
  }
});
};//canvas end
