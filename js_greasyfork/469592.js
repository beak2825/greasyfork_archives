// ==UserScript==
// @name     [AO3 Wrangling] Total Unwrangled Numbers
// @description Adds a button to calculate the number of unwrangled tags on your wrangling home.
// @version  1.1
// @grant    none
// @author   Ebonwing
// @match        *://*.archiveofourown.org/tag_wranglers/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @namespace https://greasyfork.org/users/819864
// @downloadURL https://update.greasyfork.org/scripts/469592/%5BAO3%20Wrangling%5D%20Total%20Unwrangled%20Numbers.user.js
// @updateURL https://update.greasyfork.org/scripts/469592/%5BAO3%20Wrangling%5D%20Total%20Unwrangled%20Numbers.meta.js
// ==/UserScript==




    const anchor = $('.heading')[2]
    const btn = document.createElement("button")
    btn.innerText = "Calculate Unwrangled Tags"
    btn.style.fontSize = "0.8rem"
    btn.style.float = "right"
    anchor.appendChild(btn)


		btn.addEventListener("click", function(e) {
      
        var number = 0;

        $('div.tag_wranglers-show.dashboard #user-page table tbody tr').each(function() {
          
            var row = $(this);
            var tag_counters = row.find('th');

            for (let i = 4; i < 7; i++) {
              
                if(row[0].children[i].innerText != ""){
                    number += Number(row[0].children[i].innerText);
                }

            }

        });
      
      btn.innerText = number + " Unwrangled Tags"
      
    });
