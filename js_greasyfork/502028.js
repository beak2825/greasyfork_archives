// ==UserScript==
// @name         Event Collapse
// @namespace    collapse.zero.nao
// @version      0.5
// @description  event hides
// @author       nao
// @match        https://www.torn.com/page.php?sid=events*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502028/Event%20Collapse.user.js
// @updateURL https://update.greasyfork.org/scripts/502028/Event%20Collapse.meta.js
// ==/UserScript==

let current = "";
let count = 0;
let el;

function check(){
    $("ul[class^='eventsList'] > li:not(processed)").each(function(){
        if ($(this).attr("processed")){
            return;
        }
        let text = $("p", $(this)).text();
        let format = $("p", $(this)).html();

        if (current == text){
            count += 1;
            $("p", $(el)).html(`<b style="color:red">( ${count} )</b> ${format}`);
            $(this).hide();
        }
        else{
            current = text;
            count = 1;
            el = $(this);
        }

        $(this).attr("processed", "true");


    });
   // console.log(data);

}

setInterval(check,500);