// ==UserScript==
// @name     [AO3 Wrangling] Resort Fandoms
// @description Lets you change where specific fandoms are sorted on the wrangling homepage.
// @version  1.2
// @grant    none
// @author   Ebonwing
// @license  GPL-3.0 <https://www.gnu.org/licenses/gpl.html>
// @match        *://*.archiveofourown.org/tag_wranglers/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @namespace https://greasyfork.org/users/819864
// @downloadURL https://update.greasyfork.org/scripts/459093/%5BAO3%20Wrangling%5D%20Resort%20Fandoms.user.js
// @updateURL https://update.greasyfork.org/scripts/459093/%5BAO3%20Wrangling%5D%20Resort%20Fandoms.meta.js
// ==/UserScript==


/*********
*
* Define your fandoms here. For each fandom you want sorted differently, copypaste an additional ["Fandom 1","Fandom 2"], entry below.
* Fandom 1 is the fandom you want moved. Fandom 2 is the fandom you want it moved after. 
* In the example, Tears of Artamon - Sarah Ash would now be listed after Xenoblade Chronicles (Video Game).
* If your fandom name includes any "s, you will have to prepend them with a \; for example, "NordVPN "Critical Role Nordverse" Commercials" has to be written as "NordVPN \"Critical Role Nordverse\" Commercials".
*
*********/

const fandom_list = [
  ["Tears of Artamon - Sarah Ash", "Xenoblade Chronicles (Video Game)"],
  ];




var fandom_rows = [];

$('div.tag_wranglers-show.dashboard #user-page table tbody tr').each(function() {
    var row = $(this);
		var tag_counters = row.find('th');

      for (let i = 0; i < fandom_list.length; i++) {
        
        if(tag_counters[0].firstChild.innerText === fandom_list[i][0] || tag_counters[0].firstChild.innerText === fandom_list[i][1]){
          
          fandom_rows.push(row)
            
      	}
      }


});

for (let i = 0; i < fandom_list.length; i++) {
  var row_before = null;
  var row_move = null;
  for (let j = 0; j < fandom_rows.length; j++) {
    var tag_counters = fandom_rows[j].find('th');
    if(tag_counters[0].firstChild.innerText === fandom_list[i][0]){
         row_move =  fandom_rows[j];
    } else if(tag_counters[0].firstChild.innerText === fandom_list[i][1]){
         row_before =  fandom_rows[j];
    }
  }
  
  row_before[0].parentNode.insertBefore(row_move[0], row_before[0].nextSibling);
  
}


