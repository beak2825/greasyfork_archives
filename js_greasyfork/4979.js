// ==UserScript==
// @name       Mousehunt Rift Mist
// @author     black.carrot
// @version    1
// @description  trial version of rift mist script
// @match      *www.mousehuntgame.com*
// @namespace  tjbqhxbqzkbwhxbwzgbt
// @downloadURL https://update.greasyfork.org/scripts/4979/Mousehunt%20Rift%20Mist.user.js
// @updateURL https://update.greasyfork.org/scripts/4979/Mousehunt%20Rift%20Mist.meta.js
// ==/UserScript==

window.setInterval(function() {

    
    var name = document.getElementsByClassName('mistQuantity').innerHTML;
    
    if (name === "0/20") { document.getElementsByClassName('mistButton').click();}
	
    alert("Button 1 was clicked!");

    


    
    }, 5000);