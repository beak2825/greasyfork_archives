// ==UserScript==
// @name               Noapte si zi
// @license            xD3MEnTu Ro1
// @version            1.00
// @description        Modificarea luminozitatii 
// @author             DEMENTU Ro1
// @include 	       https://*.the-west.*/game.php*
// @namespace https://greasyfork.org/users/1053629
// @downloadURL https://update.greasyfork.org/scripts/477522/Noapte%20si%20zi.user.js
// @updateURL https://update.greasyfork.org/scripts/477522/Noapte%20si%20zi.meta.js
// ==/UserScript==


(function() {

    var rangeInput = document.createElement('input');
    rangeInput.type = 'range';
    rangeInput.min = 0;
    rangeInput.max = 100;



    rangeInput.style.position = 'fixed';



    document.body.appendChild(rangeInput);

    rangeInput.addEventListener('input', function() {
        var valoareStralucire = this.value;
        var stralucireTotala = "valoareStralucire";
    });
})();