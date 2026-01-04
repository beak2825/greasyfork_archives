// ==UserScript==
// @name        tapas - hide top/bottom/side bars
// @match       https://tapas.io/*
// @license      MIT
// @grant       none
// @version     0.1
// @author      mortellys
// @compatible  written and tested entirely on firefox
// @description 2/12/2024, 4:54:58 PM
// @namespace https://greasyfork.org/users/1260653
// @downloadURL https://update.greasyfork.org/scripts/487213/tapas%20-%20hide%20topbottomside%20bars.user.js
// @updateURL https://update.greasyfork.org/scripts/487213/tapas%20-%20hide%20topbottomside%20bars.meta.js
// ==/UserScript==

let eyeIconVis = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAABkklEQVR4nO2WvUoDQRSFPwsjoomk8wHEUpNgL9aKnVjYii/hT2FEIwgS8hBKgp1gY6ddYpGHWPNjKRKrRAZuYBj3zu5iRIs9cJs7557D3Duzs5AixT/AGlAGHoEOMJDoSO4UKE3ScBt4AUYxowls/cRwGXhIYOjGPbCU1HQX+AgR6wGHQAGYkygCR7Lm8t+BnTiGU8A5MAwRqQNZT61Za4TUGa0z0VZNa0rb6r5CRyPMfARUNY0rpaAXsVMXOaCvaF265APPITEztZERgVcgACqSs3Hs0dsfk1aBTw/RrNuohHBMzkbRozcAVgypFXEt3DYHIRyTs5GN0GwZUvsXjHMRmm1D2lCuzzgKMVp9kaDVQ2B9TKx6iObjYCMj5oHncJ149K5dsecJXacF4E3RegKm3YK8Z96NBB+QO89c81rhorwumnkuYqeaaVO0vZgFbhWBvnwczLs7L1GSmWrtvRHNWDAt21OuTtwIRCPOiL4hKy+LthutK+WEB1LFDLApr5c5/V3r16cruZpwDDdFCv4MXw/YJO5+W1zLAAAAAElFTkSuQmCC";
let eyeIconInvis = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB0UlEQVR4nO3XsWpUQRTG8V8KFY0JBDRoL1gpSZ5AUWy0tRA7SaPPYFREUFGQkGcQhLSCCJY2mljEBNKlCBHdhFSisYkrg7NwudyZuazL2uTAFLv3m++/O3POmTv8jduYNOS4gy5Whw0/ic8Rvo7TB/BhxGTc66Y9P48HeIst/MQevuIdHmJmkPAb+Bg/txlLuDYIeLfP8RpnBgXvYC4u+zGMYhp347M6/DuutwXex60G+C+czcwbw2ID/DceYSQ1MTx4EcX7CXipyYwk4F3Mp+CPa8IUfK0AH8d2Av60Lp5NCAP8cgN8E7v4gic4XPObyyTdbE90LtZjSjjVItsDvBrTGb+9mJyWC2URMlcBHv55PdFynstBtFIQBRMFeFj2aowWPFeC6GJM+TZLnYJv1hJuKuO3jws94XxGGJpDKlLZfi/j97xqELLyfULYSSx3E3w1NplUOb3BobrBRGa/F3Odp6HDNXl8wvGUwal4uqTg4y3h9fEBJxTiKF4lDLZjc5iJv753SFzKwF82lGQywrLejPWZK4tSe+30+wI5Fk+WnX+Al3p7No7gKhZi9n+Lre8HNuJ3z3ClMmdg8H7i4NW5+z8uDdU9D9emoUaAhwuiP6xsQKy3OineAAAAAElFTkSuQmCC";

// Insert the eye button for visibility toggling.

let viewer = document.getElementsByClassName("js-viewer-wrapper");
if (viewer.length > 0) {
  // Proceed if we did find a viewer for pages.
  let imgVis = document.createElement("img");
  imgVis.style="opacity:0.2";
  imgVis.alt="Toggle for displaying top and bottom bars.";
  imgVis.src = eyeIconVis;
  let imgInvis = document.createElement("img");
  imgInvis.style="opacity:0.2";
  imgInvis.alt="Toggle for displaying top and bottom bars.";
  imgInvis.classList="hidden";
  imgInvis.src = eyeIconInvis;
  let div = document.createElement("div");
  div.style="margin: 4px; position: fixed; cursor: pointer; width: 20px; height: 20px;";
  div.id="bars-toggle-btn";
  div.appendChild(imgVis);
  div.appendChild(imgInvis);

  viewer[0].insertBefore(div, viewer[0].firstChild);
}

// Wait for page to finish drawing (To the best of our ability without extra magic), to make sure we can grab the bars, etc.
window.addEventListener('load', function() {
  let toggler = document.getElementById("bars-toggle-btn");

  if (toggler) {
    let topbars = document.getElementsByClassName("js-top-nav-wrap");
    let bottombars = document.getElementsByClassName("toolbar");
    let sidebarsSeries = document.getElementsByClassName("js-series-section");
    let sidebarsComments = document.getElementsByClassName(" js-comment-section");
    let insideViewer = document.getElementsByClassName("js-vw-outer");
    toggler.addEventListener("click", function(){
        topbars[0].classList.toggle("hidden");
        bottombars[0].classList.toggle("hidden");
        sidebarsSeries[0].classList.toggle("hidden");
        sidebarsComments[0].classList.toggle("hidden");
        toggler.children[0].classList.toggle('hidden');
        toggler.children[1].classList.toggle('hidden');
    })
  }
})
