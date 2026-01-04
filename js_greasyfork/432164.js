// ==UserScript==
// @name         ADAPT_Automat
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       nowaratn
// @match        https://fclm-portal.amazon.com/employee/timeDetails?warehouseId=KTW1&employeeId=106590673
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432164/ADAPT_Automat.user.js
// @updateURL https://update.greasyfork.org/scripts/432164/ADAPT_Automat.meta.js
// ==/UserScript==

setTimeout(function() {

//     if(document.getElementById("wlacznik_div") == undefined)
//     {
//         var wlacznik = document.createElement ('div');
//         wlacznik.innerHTML = '[AUTOMAT] <input id="checkbox_id" type="checkbox" />';
//         wlacznik.setAttribute ('id', 'wlacznik_div');
//         wlacznik.setAttribute ('style', '');
//         document.getElementsByTagName("body")[0].appendChild(wlacznik);

//         document.getElementById("checkbox_id").addEventListener (
//             "click", ButtonClickCheckbox, false
//         );

//         function ButtonClickCheckbox (zEvent)
//         {
//             console.log(document.getElementById("checkbox_id").checked)

//             // Został odznaczony
//             if(document.getElementById("checkbox_id").checked == false)
//             {
//                 localStorage.setItem("adapt_automat","nie");

//             }

//             if(document.getElementById("checkbox_id").checked == true) // zaznaczony
//             {
//                 localStorage.setItem("adapt_automat","tak");
//             }
//         };


//         setTimeout(function() {
//             if(localStorage.getItem("adapt_automat") == "tak")
//             {
//                 document.getElementById("checkbox_id").checked = true;
//             }
//             else
//             {
//                 document.getElementById("checkbox_id").checked = false;
//             }
//         },500);

//     }

    // setTimeout(function() {
        // if(localStorage.getItem("adapt_automat") == "tak")
        // {
            var accept = false;
            var input;
            input = document.getElementsByTagName("input");

            var badge;

            for(var i = 0;i<input.length;i++)
            {
                // Zaznacz radio acknowledgement
                if(input[i].type == "radio" && input[i].value == "acknowledge")
                {
                    input[i].click();
                }
                // Wpisz badge ze strony
                if(input[i].type == "textbox")
                {

                }
            }

            // Accept
            if(accept == true)
            {
                setTimeout(function() {
                    document.getElementById(" ").click();
                },2000);
            }
      //  }
    // },1000);


},3000);