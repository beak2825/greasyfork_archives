// ==UserScript==
// @name         R&R
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  select games
// @author       botclimber
// @match        https://www.betclic.pt/*
// @grant        https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css
// @downloadURL https://update.greasyfork.org/scripts/416008/RR.user.js
// @updateURL https://update.greasyfork.org/scripts/416008/RR.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function(){ core(); }, 2000);

    function core(){
        const queryString = window.location.search, params = new URLSearchParams(queryString), paramId = params.get('id'),
              page = params.get('mainPage');
        var paramIndex = parseInt(params.get('index'));

        if(page == 1){
            document.getElementsByClassName("bettingslip_footerContentRowWinnings")[0].innerHTML = "<button style='color:green;background-color:white;' type'button' onclick=' localStorage.setItem(\"ctr_cl\", 100); '>RUN</button>";
            document.getElementsByClassName("bettingslip_footerContentRowWinnings")[0].innerHTML += "<button style='margin-left:5px;' type'button' onclick=' localStorage.setItem(\"ctr_cl\", 0); localStorage.setItem(\"obj\", 0); window.location.href=\"https://www.betclic.pt/futebol-s1?mainPage=1\";' >RESET</button>";

            var dataOFF = document.getElementsByClassName("betBox cardMatch cardMatch_compat"), dataON = document.getElementsByClassName("betBox cardMatch cardMatch_compat is-live"),
                data = {
                'ctr_cl': localStorage.getItem("ctr_cl"),
                'existsId': null,
                'id': null,
                'tHome': null,
                'tAway': null
            };

            if((dataOFF.length - dataON.length) < 20 && data.ctr_cl > 0){ window.scrollTo(0,document.body.scrollHeight); }

            for(var i = dataON.length; i < dataOFF.length && data.ctr_cl > 0; i++){
                var exists = localStorage.getItem(dataOFF[i].getElementsByClassName("is-linkTel prebootFreeze h_100")[0].href);

                data.tHome = dataOFF[i].getElementsByClassName("betBox_contestantName")[0].textContent;
                data.tAway = dataOFF[i].getElementsByClassName("betBox_contestantName")[1].textContent;

                data.id = dataOFF[i].getElementsByClassName("is-linkTel prebootFreeze h_100")[0].href

                /* CORE CONDITION STATEMENT */
                if( !isNaN(paramIndex) ){
                    data.tHome = dataOFF[paramIndex+1].getElementsByClassName("betBox_contestantName")[0].textContent;
                    data.tAway = dataOFF[paramIndex+1].getElementsByClassName("betBox_contestantName")[1].textContent;
                    data.existsId = localStorage.getItem(dataOFF[paramIndex+1].getElementsByClassName("is-linkTel prebootFreeze h_100")[0].href); // verify is id exists

                    if(data.existsId == undefined ){
                        if( !data.tHome.includes(" F.") && !data.tAway.includes(" F.") && !data.tHome.includes(" W.") && !data.tAway.includes(" W.") ){ // chose only no Female games

                            data.id = dataOFF[paramIndex+1].getElementsByClassName("is-linkTel prebootFreeze h_100")[0].href

                            data.ctr_cl--;
                            localStorage.setItem("ctr_cl", data.ctr_cl);
                            window.location.href = data.id+"?id="+data.id+"&index="+(paramIndex+1); // solve i guess
                            break;
                        }

                    }else paramIndex = paramIndex + 1;

                }else if( exists == undefined ){
                    if( !data.tHome.includes(" F.") && !data.tAway.includes(" F.") && !data.tHome.includes(" W.") && !data.tAway.includes(" W.") ){ // chose only no Female games
                        data.ctr_cl--;
                        localStorage.setItem("ctr_cl", data.ctr_cl);
                        window.location.href = data.id+"?id="+data.id+"&index="+i;
                        break;
                    }
                }
                /* ------------------------ */

            }

            if(data.ctr_cl > 0) window.scrollTo(0,document.body.scrollHeight); // scroll if href undefined
        }
    }

})();