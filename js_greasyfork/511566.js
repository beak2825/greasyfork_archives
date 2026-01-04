// ==UserScript==
// @name         Dlsite_FilterScript
// @namespace    http://tampermonkey.net/
// @version      2024-10-05
// @description  自用dlsite过滤脚本
// @author       Ealvn
// @match        https://www.dlsite.com/home/works/translatable*
// @match        https://www.dlsite.com/maniax/works/translatable*

// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/511566/Dlsite_FilterScript.user.js
// @updateURL https://update.greasyfork.org/scripts/511566/Dlsite_FilterScript.meta.js
// ==/UserScript==

(function() {
    //alert("hello");
    //init
    var list = document.querySelectorAll('#search_result_img_box li');
    var hide_flag = true;
    list.forEach((item) => {
        var lan_table = item.querySelectorAll('table[class~="translation_table"] tr');
        hide_flag = true;
        //console.log(lan_table[0].innerHTML);
        lan_table.forEach((item) => {
            var td_table = item.querySelectorAll('td');
            try {
                //console.log(td_table[0].innerHTML);
                //console.log(td_table[2].innerHTML);
                if(td_table[0].innerHTML == "简体中文" && td_table[2].innerHTML == "0"){
                    hide_flag = false;
                }
            }catch{}
        });

        if(hide_flag){
            //console.log(!hide_flag);
            item.style.display='none';
        }
    });

    // Your code here...
})();