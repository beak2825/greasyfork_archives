// ==UserScript==
// @name         Auto Fill Tickboxes on Display Case
// @namespace    http://torn.com/
// @version      0.1
// @description  Making bogies life easier since 2021
// @author       Sterling [1616063]
// @match        https://www.torn.com/displaycase.php*
// @require      https://code.jquery.com/jquery-2.2.3.min.js
// @grant        GM.addStyle
// @downloadURL https://update.greasyfork.org/scripts/423924/Auto%20Fill%20Tickboxes%20on%20Display%20Case.user.js
// @updateURL https://update.greasyfork.org/scripts/423924/Auto%20Fill%20Tickboxes%20on%20Display%20Case.meta.js
// ==/UserScript==

var checkAllButtonContainer = document.createElement ('div');
checkAllButtonContainer.innerHTML = '<button class="button">Check/Uncheck All</button>';
checkAllButtonContainer.setAttribute ('id', 'checkAllButtonContainer');

document.body.appendChild (checkAllButtonContainer);

GM.addStyle ( `
    #checkAllButtonContainer {
        position:               absolute;
        top:                    0;
        left:                   0;
        background:             darkgrey;
        z-index:                1100;
        color:                  black;
        text-align:             center;
        cursor:                 pointer;
    }`
            );

$("button").click(function(){
  $(".prettycheckbox a").toggleClass("checked");
});
