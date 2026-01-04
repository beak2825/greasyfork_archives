// ==UserScript==
// @name         HordesChatEnhancements
// @namespace    sxxe@gmx.de
// @version      0.4
// @description  Makes the hordes chat window more usable
// @author       sxe
// @include      *hordes.io/play*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @require      https://cdn.jsdelivr.net/gh/dmhendricks/jquery-waituntilexists/jquery.waitUntilExists.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394052/HordesChatEnhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/394052/HordesChatEnhancements.meta.js
// ==/UserScript==

(function () {
  "use strict"

    /*
    * Make chat more visible
    */
    var style = `
       <style>
          .channelselect { margin-top: 5px; }
          .chattabs { margin-left: 3px; margin-top: -6px; }
          .chattab { border: 0px !important; border-radius: 2px 2px 0 0; background-color: rgba(0, 0, 0, 0.5) !important; padding: 7px; padding-top: 4px;}
          .tabSelected { color: #DE8272; }
          #chat { background-color: rgba(0, 0, 0, 0.5); height: 170px !important; }
          #chat div { background-color: unset !important; }
       </style>
    `;
    $('html > head').append($(style));

    /*
    * Add real tabs to chat, like in other mmos
    */
    var tabs = `
       <div class="lowercontainer svelte-1vrlsr3">
          <div class="chattabs svelte-1vrlsr3">
             <small class="btn border black chattab svelte-1vrlsr3">all</small>
             <small class="btn border black chattab svelte-1vrlsr3">faction</small>
             <small class="btn border black chattab svelte-1vrlsr3">party</small>
             <small class="btn border black chattab svelte-1vrlsr3">clan</small>
             </div>
       </div>
    `;

    $("#chat").waitUntilExists(function(){
        $('#chat').before(tabs);

        $( ".chattab" ).click(function() {
            //console.log($( this ).text());
            var clickedTab = $( this );
            var clickedTabText = clickedTab.text();
            // mark tab
            markTab(clickedTabText);

            // click channel buttons
            var filtersToMark = [];
            if (clickedTabText === 'all')
                filtersToMark = ['global','faction','party','clan','inv'];
            else if (clickedTabText === 'faction')
                filtersToMark = ['faction'];
            else if (clickedTabText === 'party')
                filtersToMark = ['party'];
            else if (clickedTabText === 'clan')
                filtersToMark = ['clan'];

            selectChannel(filtersToMark);
        });

        // initialy slt global tab
        selectChannel(['global','faction','party','clan','inv']);
        markTab('all');
    });

    function selectChannel(filters) {
        $(".channelselect > small").each(function( index ) {
 			var filter = $( this );
            var filterText = filter.text();
            //console.log(index + " " + "'" + filterText + "'");

            if ( filters.includes(filterText) ) {
                if (filter.hasClass('textgrey') ) {
                    //console.log(index + " " + filterText);
                    filter.click();
                }
            } else {
                if ( !filter.hasClass('textgrey') ) {
                    //console.log(index + " " + filterText);
                    filter.click();
                }
            }
         });
    }

    function markTab(tab) {
        $("small.chattab").each(function( index ) {
 			var tab2 = $( this );
            var tab2Text = tab2.text();
            //console.log(tab + " " + "'" + tab2Text + "'");

            if ( tab == tab2Text ) {
                tab2.removeClass('tabSelected').addClass('tabSelected');
            } else {
                tab2.removeClass('tabSelected');
            }
         });
    }
})()


