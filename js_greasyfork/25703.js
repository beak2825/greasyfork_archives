// ==UserScript==
// @name        eBay Filter Active Inventory
// @namespace   riceball
// @description Search filter for the current inventory
// @include     http://my.ebay.com/*
// @version     1
// @grant       none
// @resource $ 
// @downloadURL https://update.greasyfork.org/scripts/25703/eBay%20Filter%20Active%20Inventory.user.js
// @updateURL https://update.greasyfork.org/scripts/25703/eBay%20Filter%20Active%20Inventory.meta.js
// ==/UserScript==

/*
  This is a script for people selling things on eBay.
  
  This script adds a "filter" box to the table of active listings.
  You can type in a search term, and everything matching the term
  will be filtered in.  Everything else will be deleted from the 
  list.  After you filter, you cannot "undo" or remove the filter
  to see all the rows again.  You need to refresh the page.
  
  Display a lot of rows to have more stuff to filter.
  
  The best way to use this is to title your listings consistently,
  so you can quickly find subsets of your listings.  
*/

function mytool($) {
    function myfilter(evt) {
        evt.preventDefault();
        console.log("myfilter called");
        var search = new RegExp($("#mysearchfield").val(), 'iu');
        $(".my_itl-itR").each(function (idx, el) {
            var title = $(this).find("td").eq(3).find("div>div>a.g-asm").attr("title");
            if (! title.match(search)) {
                console.log( title, " did not match");
                //$(this).hide();
                $(this).remove();
            } else {
                console.log( title, " matches");
            }
        });
    }

    function button_attacher() {
        console.log("button_attacher trying to attach");
        if ($('#ItemDisplayContainer_SellingNext').length > 0) {
	        $mybutton = $('<input id="mysearchfield" value="" style="margin-left: 7px;" /><button id="mysearchbutton" style="margin-right: 9px;">Filter</button>');
	        $mybutton.click(myfilter);
	        $thing = $('#ItemDisplayContainer_SellingNext').find('.r3_hm>table>tbody>tr>td>h2:first');
	        $thing.append($mybutton);
	        window.clearInterval(myattacher);
	        myattacher = undefined;
        } else {
	        console.log("found no dialog - skipping");
        }
    }

    myattacher = window.setInterval(button_attacher, 1000); // every 10 seconds, try to attach the button to the dialog.

}

// Check if jQuery's loaded
function GM_wait() {
    if (typeof window.jQuery == 'undefined') {
        window.setTimeout(GM_wait, 100);
    } else {
        mytool(window.jQuery);
    }
}

GM_wait();