// ==UserScript==
// @name         GOG DB Plus
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add GOGDB button to GOG game page. 为GOG游戏页面添加GOGDB按钮。
// @author       WK
// @match        https://www.gog.com/*/game/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAA9lBMVEX////MyN6If7OJgLOWjrvw7/auqMuMgLSxqM2kksSbhr+fhL/WyuM4IYccAHk2IYMuGYAAAHKkncTe2+ksDX4+JYcoAH6voMs8AIhaJ5djL5tYDpD9/P5wY6P8+v759fytm8tLBJDn5PCSbLVpJJh7cKjDvdf08vmaeLvDudj18vpjJJw0HXxyZ6AwAHteQpSAa6prSp9LApmDY7ikhslVRY1jU5aIZLx/Wbh4TbRzNK2pgM2JRLpUPotbNo7IruCRWMOeZMigV8XVwOa6i9Z3Wp95VaKXccOifMlQIoh8W69nP59lOahQNJRmUqSAabNCI5VKOY9tff7FAAABPUlEQVR4Ac3RVXaDUABF0Rt3RRp5wRrDIe7unvkPJs7qbz9zcDYOvjGX2+PxeH3wewKBQBC+UDgciUQ/GIsnEslUmkrRDEOz1E8mm8vlc28jdIHjqXiaivs5LshSgihx3G+RvJUuAb4nloHyEytAteic6aAMyE9UHqjiXVLTS5KRpgzTsuwMJdTq9WjDwXSz2ZIML7FM27arHNXudKON3gdJRalIRgjgCOEA8DyP/uBjzeHQHBkCPo0n0+l0MMO7UsmyrIjk4LzfXywWc/yj4HK5XEWVav1REPP1q80Ht9snymJnt8vu+Z1aPzzGg4MlEIKgSAHho3I642wjknUw8Lp4RgICDpYuzl/RCV+BP+7iuNKxcirgfPpDLaVpSZecSjJM/FoZFtC6osR+0OV5RHHe58KFtB9pL/wefGF369AsI1+AY60AAAAASUVORK5CYII=
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530602/GOG%20DB%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/530602/GOG%20DB%20Plus.meta.js
// ==/UserScript==

(function() {
    var layoutDiv = document.querySelector('div.layout.ng-scope');
    var card_product = layoutDiv.getAttribute("card-product");
    addGOGDBButton(card_product);

  function addGOGDBButton(card_product) {
  // Get "Buy now" button
  const originalButton = document.querySelector('button.button--big.buy-now-button');

  // Cheeck if "Buy now" button exists
  if (!originalButton) {
    console.error("'Buy now' Button not found。");
    return;
  }

  // Create a new button
  const newButton = document.createElement('button');

  // Copy original button's classname & attribute
  newButton.className = originalButton.className;
  newButton.setAttribute('onclick', "window.open('https://www.gogdb.org/product/"+card_product+"','_blank')");
  newButton.setAttribute('title', "Show in GOGDB");

  // Set text to new button
  newButton.textContent = 'GOGDB';

  // Inser new button afrer the original button
  originalButton.parentNode.insertBefore(newButton, originalButton.nextSibling);
}

})();