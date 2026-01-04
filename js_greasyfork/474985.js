// ==UserScript==
// @name         Collect attack information | Religious Extremists 2023 Elimination
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  Religious extremists attack data collection
// @author       Tbelkas
// @match        https://www.torn.com/competition.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474985/Collect%20attack%20information%20%7C%20Religious%20Extremists%202023%20Elimination.user.js
// @updateURL https://update.greasyfork.org/scripts/474985/Collect%20attack%20information%20%7C%20Religious%20Extremists%202023%20Elimination.meta.js
// ==/UserScript==

(function() {
    'use strict';
   var originalOpen = XMLHttpRequest.prototype.open;

var accessor = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'responseText');

      function sendData(body){
       fetch("https://tornium.com/api/religious/attacks", {
               method: "PUT",
               body: JSON.stringify(body),
               headers: {
                   "Content-type": "application/json; charset=UTF-8"
               }
           })
                .then(response => {console.log(response)})
                .catch(err => {console.log(err)});
    }

    function constructResponseObject(listItem){
        let listItemLeft = listItem.getElementsByTagName("li")[0].getElementsByClassName("elimination-team-logo")[0].classList[1];
        let rightItemLeft = listItem.getElementsByTagName("li")[2].getElementsByClassName("elimination-team-logo")[0].classList[1];

        let listItemStatus = listItem.getElementsByClassName("middle-block")[0];

        let playerLeft = listItemStatus.getElementsByClassName("left")[0];
        let playerRight = listItemStatus.getElementsByClassName("right")[0];

        let nameLeftDiv = playerLeft.getElementsByClassName("name")[0];
        let nameRightDiv = playerRight.getElementsByClassName("name")[0];

        let didLeftWin = nameLeftDiv.classList.contains('won');
        let leftObject = {"team": listItemLeft, "name": nameLeftDiv.innerText};
        let rightObject = {"team": rightItemLeft, "name": nameRightDiv.innerText};
        let requestModel = {'winner': didLeftWin ? leftObject : rightObject, 'loser': !didLeftWin ? leftObject : rightObject};
        return requestModel;
    }

  function ParseResponse(competitionList) {
      if(!competitionList.length) return;
      let listItems = Object.values(competitionList[0].getElementsByTagName('li')).filter(x => x.className === '');
      let models = listItems.map((x) => constructResponseObject(x));
      let request = {'result': models};
      sendData(request);
  }

Object.defineProperty(XMLHttpRequest.prototype, 'responseText', {
	get: function() {
        if(window.location.hash != '#/p=recent') return accessor.get.call(this);
        let myDoc = new DOMParser();
        let response = accessor.get.call(this);
        let myElement = myDoc.parseFromString(response, 'text/html');
        let competitionList = document.getElementsByClassName("competition-list bottom-round");
        ParseResponse(competitionList);
		return response;
	}
});

})();