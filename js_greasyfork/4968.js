// ==UserScript==
// @name       YChart HIT Helper
// @namespace  http://ericfraze.com
// @version    0.5
// @description  Opens the link on a Ychart hit
// @include    https://www.mturk.com/mturk/accept*
// @include    https://www.mturk.com/mturk/submit*
// @include    https://www.mturk.com/mturk/continue*
// @include    https://www.mturk.com/mturk/previewandaccept*
// @copyright  2014+, Eric Fraze
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/4968/YChart%20HIT%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/4968/YChart%20HIT%20Helper.meta.js
// ==/UserScript==

 $(document).ready(function() {
    // Make sure the hit has been accepted
    if ($("input[name='/submit']").length>0) {
        //Open the link that you always have to click in a new tab
        $('a:contains("Click here to go to the home page for the company")').filter(function(index)
        {
            window.open($(this).prop('href'), 'YChart');
            return false;
        });
        
        //Check Yes radio button
        $("#Answer_3").prop("checked", true)

        //Select text box
        $("#Answer_1_FreeText").select();
    }
});