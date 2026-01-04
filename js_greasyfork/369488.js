// ==UserScript==
// @name         statserv_button
// @namespace    http://tampermonkey.net/
// @version      0.4.8
// @description  try to take over the world!
// @author       You
// @match        http://matchlandstatserver.milamit.cz/phpmyadmin/*
// @match        http://bakeacakestatserver.milamit.cz/phpmyadmin/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// jshint multistr: true
// @downloadURL https://update.greasyfork.org/scripts/369488/statserv_button.user.js
// @updateURL https://update.greasyfork.org/scripts/369488/statserv_button.meta.js
// ==/UserScript==


(function() {
    'use strict';

    GM_xmlhttpRequest ({
        method:     "GET",
        url:        "https://codepen.io/alanwork100/pen/MPZmpw.css", //SQL
        onload:     function (response){
            GM_addStyle (response.responseText);
            console.log(response);
        }
    });
    GM_xmlhttpRequest ({
        method:     "GET",
        url:        "https://codepen.io/alanwork100/pen/aRPWBB.css", //RubyButtons
        onload:     function (response){
            GM_addStyle (response.responseText);
            console.log(response);
        }
    });

    $( document ).ajaxComplete(function() {
        //When ajax loaded new content
        console.log('ajaxComplete :)');

        for(var i = 0; i<document.querySelectorAll('input.textfield[name=session_max_rows]').length; i++){
            document.querySelectorAll('input.textfield[name=session_max_rows]')[i].value = 600;
        }

        if (document.getElementsByClassName('common_hidden_inputs')[0] != undefined){
            if (document.getElementById('ButtWrapper') == undefined){
                //Adding buttons wrapper
                var coreDiv = document.createElement("div");
                coreDiv.id = "ButtWrapper";

                //Adding button1
                var butt1 = document.createElement("div");
                butt1.innerHTML = "0/600/20";
                butt1.id = "defButt1";
                butt1.className = "defButt";

                var butt2 = document.createElement("div"); //small rollout button
                butt2.id = "dBRollout";

                var butt3 = document.createElement("div"); //minus button
                butt3.id = "minusRollout";
                butt3.className = "RolloutLilButts buttHid";

                var wrap1 = document.createElement("div"); // "-" wrap (positioned inside minus button)
                wrap1.className = "suppDiv";
                wrap1.innerHTML = "-";

                var butt4 = document.createElement("div"); //plus button
                butt4.id = "plusRollout";
                butt4.className = "RolloutLilButts buttHid";

                var wrap2 = document.createElement("div"); // "+" wrap (positioned inside plus button)
                wrap2.className = "suppDiv";
                wrap2.innerHTML = "+";

                var caretLeftWrap = document.createElement("div");
                caretLeftWrap.className = "caretWrap buttHid";
                caretLeftWrap.innerHTML = "^";
                caretLeftWrap.id = "caretL";

                var caretRightWrap = document.createElement("div");
                caretRightWrap.className = "caretWrap buttHid";
                caretRightWrap.innerHTML = "^";
                caretRightWrap.id = "caretR";

                //Appending button(s)
                coreDiv.appendChild(butt1);
                butt1.appendChild(butt2);
                butt2.appendChild(butt3);
                butt2.appendChild(butt4);
                butt3.appendChild(wrap1);
                butt4.appendChild(wrap2);
                butt3.before(caretLeftWrap);
                butt4.after(caretRightWrap);

                //Appending wrapper into DOM
                document.querySelectorAll("input[value='Показать :']")[0].before(coreDiv);
            }
        }
        else {console.log('no need for button on this page');}

        function calc(val){
            var tmpNum = parseInt(document.getElementsByClassName('success')[0].innerHTML.match(/(\d+)(?= всего)/)[0]) - val;
            if (tmpNum < 0){
                tmpNum = 0;
            }
            document.querySelectorAll('input.textfield[name=pos]')[0].value = tmpNum
            document.querySelectorAll('input.textfield[name=repeat_cells]')[0].value = 20;
        }

        $( "#defButt1" ).click(function(e) {
            if(e.target !== e.currentTarget) return;
            calc(600);
        });

        function rolloutFunc(){
            if (document.querySelector("#dBRollout").className == ""){
                $("#dBRollout").toggleClass("dBRolloutBig");
                $("#minusRollout").toggleClass("buttHid");
                $("#plusRollout").toggleClass("buttHid");
                $("#caretL").toggleClass("buttHid");
                $("#caretR").toggleClass("buttHid");
            }
            else {
                $("#dBRollout").toggleClass("dBRolloutBig");
                $("#minusRollout").toggleClass("buttHid");
                $("#plusRollout").toggleClass("buttHid");
                $("#caretL").toggleClass("buttHid");
                $("#caretR").toggleClass("buttHid");
            }
        }

        $( "#dBRollout" ).off().click(function(e) {
            if(e.target !== e.currentTarget) return;
            rolloutFunc();
        });

        $( ".caretWrap" ).off().click(function(e) {
            if(e.target !== e.currentTarget) return;
            rolloutFunc();
        });

        $( "#plusRollout" ).off().click(function() {
            var cell = document.querySelectorAll('input.textfield[name=session_max_rows]')[0];
            if (cell.value == 100){
                $( "#minusRollout" ).toggleClass("rubButtDisabled");
            }
            var tmp = parseInt(cell.value) + 100
            calc(tmp);
            cell.value = tmp;
        });

        $( "#minusRollout" ).off().click(function() {
            var cell = document.querySelectorAll('input.textfield[name=session_max_rows]')[0];
            if (cell.value == 200){
                var tmp = parseInt(cell.value) - 100
                calc(tmp);
                cell.value = tmp;
                $( "#minusRollout" ).toggleClass("rubButtDisabled");
                console.log("dis");
            }
            else if (cell.value == 100){
                return;
            }
            else{
                var tmp1 = parseInt(cell.value) - 100
                calc(tmp1);
                cell.value = tmp1;
            }
        });
    });

})();