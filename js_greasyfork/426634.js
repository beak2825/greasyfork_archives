// ==UserScript==
// @name        Fix Assetto Downloadsection - racedepartment.com
// @namespace   Violentmonkey Scripts
// @match       https://www.racedepartment.com/downloads/categories/assetto-corsa.1/
// @grant       none
// @version     1.0
// @author      -
// @description 17.5.2021, 21:48:28
// @downloadURL https://update.greasyfork.org/scripts/426634/Fix%20Assetto%20Downloadsection%20-%20racedepartmentcom.user.js
// @updateURL https://update.greasyfork.org/scripts/426634/Fix%20Assetto%20Downloadsection%20-%20racedepartmentcom.meta.js
// ==/UserScript==

var i2 = 0;

function resolveAfterHalfSecond() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('resolved');
    }, 250);
  });
}

async function asyncCall() {
  console.log('calling');
  const result = await resolveAfterHalfSecond();
  console.log(result);
  // expected output: "resolved"
  scan();
  console.log(i2);
  document.querySelector("h1").innerHTML = "Spaghetto Corsa";
  document.querySelector(".p-description").innerHTML = "Mods for Spaghetto Corsa | Kunsoos Siismulaalzioni";
  
  document.querySelectorAll(".structItem-title")[1].style.fontWeight = "bold";
  if (i2 == 0){
      asyncCall();
  }
}

function scan() {
  var x;
  var i;
  x = document.querySelectorAll(".username");
  for (i=i2; i < x.length; i++) {
    console.log(x[i]);
    x[i].style.color = "#6392FA";
    document.querySelectorAll(".structItem-title")[i].style.fontWeight = "bold";
    i2=i;
    //visibility: hidden;
  }
}
asyncCall();