// ==UserScript==
// @name The West market rework
// @description The West market report icon rework
// @author Jaklee
// @version 0.1
// @grant none
// @include http://*.the-west.*/game.php*
// @include https://*.the-west.*/game.php*
// @include http://*.tw.innogames.*/game.php*
// @include https://*.tw.innogames.*/game.php*
// @namespace https://greasyfork.org/users/890912
// @downloadURL https://update.greasyfork.org/scripts/441916/The%20West%20market%20rework.user.js
// @updateURL https://update.greasyfork.org/scripts/441916/The%20West%20market%20rework.meta.js
// ==/UserScript==

(function() {
   checkDOMChange();
})();

function checkDOMChange()
{
    if( document.getElementsByClassName("marketplace").length > 0 )
    {
        document.querySelectorAll('[id^="mpb_marketOfferReport"]').forEach(
        x=>
        {
            var row = x.parentNode.parentNode;
            var offerMsgImg = row.querySelector(".cell_7").querySelector("img"); // Check if there is any "comment" for the offer
            if( offerMsgImg !== null )
            {
                // Replace report icon with more sofisticated warn icon (without brown background...)
                x.src="https://westhu.innogamescdn.com/images/icons/warn_circle.png";
                x.height=16;

                // Relocate the report icon next to the "info" icon
                offerMsgImg.parentNode.insertBefore(x,offerMsgImg);
            }
            else
            {
                // Remove "report" button if there is no message which can be reported...
                x.remove();
            }
        }
        );
    }

    // call the function again after 200 milliseconds
    // TODO Call this function only if market is opened / next page clicked / etc
    setTimeout( checkDOMChange, 200 );
}