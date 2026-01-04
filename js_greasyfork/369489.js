// ==UserScript==
// @name         SQL pasta
// @namespace    http://tampermonkey.net/
// @version      0.4.6.4
// @description  try to take over the world!
// @author       You
// @match        http://matchlandstatserver.milamit.cz/phpmyadmin*
// @match        http://bakeacakestatserver.milamit.cz/phpmyadmin*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/369489/SQL%20pasta.user.js
// @updateURL https://update.greasyfork.org/scripts/369489/SQL%20pasta.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var currVersionBake = "1.5.1";
    var currVersionML = "1.5.1";
    var colsBake = "version, event, `action`, `time`, param1, param2, param3, param4, rubies, lives, session_num, board_num, game_event, debug_info";
    var colsML = "event, cur_lives, coins, `time`, resources, rubies, player_level, session_num, param1, param2, param3, param4, CONCAT(build_name, '_', build_level, '_', board_number, '_', mode) AS 'bilboard', version, game_event, debug_info";

    GM_xmlhttpRequest ({
        method:     "GET",
        url:        "https://codepen.io/alanwork100/pen/aRPWBB.css", //RubyButtons
        onload:     function (response){
            GM_addStyle (response.responseText);
            console.log(response);
        }
    });

    function buttons(currVersion, cols){

        if (document.getElementById('SQLButtWrapper') == undefined){
            //Adding buttons wrapper
            var coreDiv = document.createElement("div");
            coreDiv.id = "SQLButtWrapper";

            //Adding button1
            var butt1 = document.createElement("div");
            butt1.innerHTML = "Version";
            butt1.id = "versionButt";
            butt1.className = "defButt SQLPastaButts";

            //Adding button2
            var butt2 = document.createElement("div");
            butt2.innerHTML = "TIME>=";
            butt2.id = "timeForwardButt";
            butt2.className = "defButt SQLPastaButts";

            //Adding button3
            var butt3 = document.createElement("div");
            butt3.innerHTML = "TIME<=";
            butt3.id = "timeBackwardButt";
            butt3.className = "defButt SQLPastaButts";

            //Adding button4
            var butt4 = document.createElement("div");
            butt4.innerHTML = "* / Short";
            butt4.id = "fullTable";
            butt4.className = "defButt SQLPastaButts";

            //Adding button5
            var butt5 = document.createElement("div");
            butt5.innerHTML = "V-";
            butt5.id = "verMinus";
            butt5.className = "defButt SQLPastaButts";

            //Adding button6
            var butt6 = document.createElement("div");
            butt6.innerHTML = "V+";
            butt6.id = "verPlus";
            butt6.className = "defButt SQLPastaButts";

            //Adding button7
            var butt7 = document.createElement("div");
            butt7.innerHTML = "fb";
            butt7.id = "fb";
            butt7.className = "defButt SQLPastaButts";

            //Adding button9
            var butt9 = document.createElement("div");
            butt9.innerHTML = "-";
            butt9.id = "minusDay";
            butt9.className = "defButt SQLPastaButts";

            //Adding button10
            var butt10 = document.createElement("div");
            butt10.innerHTML = "+";
            butt10.id = "plusDay";
            butt10.className = "defButt SQLPastaButts";

            //Adding button12
            var butt12 = document.createElement("div");
            butt12.innerHTML = "-";
            butt12.id = "minusDay2";
            butt12.className = "defButt SQLPastaButts";

            //Adding button13
            var butt13 = document.createElement("div");
            butt13.innerHTML = "+";
            butt13.id = "plusDay2";
            butt13.className = "defButt SQLPastaButts";

            //Appending button(s)
            coreDiv.appendChild(butt1);
            coreDiv.appendChild(butt2);
            coreDiv.appendChild(butt3);
            coreDiv.appendChild(butt4);
            coreDiv.appendChild(butt5);
            coreDiv.appendChild(butt6);
            coreDiv.appendChild(butt7);
            coreDiv.appendChild(butt9);
            coreDiv.appendChild(butt10);
            coreDiv.appendChild(butt12);
            coreDiv.appendChild(butt13);

            //Appending wrapper into DOM
            var ass = document.evaluate("//legend[contains(., 'SQL-запрос к базе данных ')]", document, null, XPathResult.ANY_TYPE, null ).iterateNext();
            ass.parentNode.parentNode.after(coreDiv);
        }
        var val = document.querySelectorAll("textarea#textSqlquery")[0];

        $( "#versionButt" ).off().click(function() {
            if (val.value.match(/version = '/) != undefined) {
                val.value = val.value.replace(/ AND version = '\S*'/, '');
            }
            else {
                val.value += " AND version = '" + currVersion + "'";
            }
        });

        $( "#timeForwardButt" ).off().click(function() {
            if (val.value.match(/AND TIME >= '/) != undefined) {
                val.value = val.value.replace(/ AND TIME >= '\S*\s?(\d|\:)*'/, '');
            }
            else {
                var UTC = new Date();
                var strMonth;
                var strDay;
                strMonth = /.(\d{2})(?=.\d{4})/.exec(UTC.toLocaleString())[1];
                strDay = /^\d{2}/.exec(UTC.toLocaleString());
                var dateTime = UTC.getFullYear() + '-' + strMonth + '-' + strDay + ' 00:00:00';
                val.value += " AND TIME >= '" + dateTime + "'";
            }

        });
        $( "#timeBackwardButt" ).off().click(function() {
            if (val.value.match(/AND TIME <= '/) != undefined) {
                val.value = val.value.replace(/ AND TIME <= '\S*\s?(\d|\:)*'/, '');
            }
            else {
                var UTC = new Date();
                var strMonth;
                var strDay;
                strMonth = /.(\d{2})(?=.\d{4})/.exec(UTC.toLocaleString())[1];
                strDay = /^\d{2}/.exec(UTC.toLocaleString());
                var dateTime = UTC.getFullYear() + '-' + strMonth + '-' + strDay + ' 00:00:00';
                val.value += " AND TIME <= '" + dateTime + "'";
            }
        });

        $( "#fullTable" ).off().click(function() {
            if (/(SELECT )(.*)(?= FROM)/.exec(val.value)[2] != undefined) {
                if(/(SELECT )(.*)(?= FROM)/.exec(val.value)[2] != "*"){
                    val.value = val.value.replace(/(SELECT )(.*)(?= FROM)/.exec(val.value)[2], '*');
                }
                else {
                    val.value = val.value.replace(/(SELECT )(.*)(?= FROM)/.exec(val.value)[2], cols);
                }
            }
        });

        $( "#verMinus" ).off().click(function() {
            if (val.value.match(/version = '/) != undefined) {
                var verRes = val.value.match(/version = '(\d)\.(\d)\.(\d)(?=['|fb'])/);
                var ver1 = parseInt(verRes[1]);
                var ver2 = parseInt(verRes[2]);
                var ver3 = parseInt(verRes[3]);
                if (ver3 == 0){
                    if (ver2 == 0){
                        ver2 = 9;
                        ver1--
                    }
                    else {
                        ver2--
                    }
                    ver3 = 9;
                }
                else{
                    ver3--
                }
                val.value = val.value.replace(/\d\.\d\.\d(?=['|fb'])/, ver1.toString() + '.' + ver2.toString() + '.' + ver3.toString());
            }
        });

        $( "#verPlus" ).off().click(function() {
            if (val.value.match(/version = '/) != undefined) {
                var verRes = val.value.match(/version = '(\d)\.(\d)\.(\d)(?=['|fb'])/);
                var ver1 = parseInt(verRes[1]);
                var ver2 = parseInt(verRes[2]);
                var ver3 = parseInt(verRes[3]);
                if (ver3 == 9){
                    if (ver2 == 9){
                        ver2 = 0;
                        ver1++;
                    }
                    else {
                        ver2++;
                    }
                    ver3 = 0;
                }
                else{
                    ver3++;
                }
                val.value = val.value.replace(/\d\.\d\.\d(?=['|fb'])/, ver1.toString() + '.' + ver2.toString() + '.' + ver3.toString());
            }
        });

        $( "#fb" ).off().click(function() {
            if (val.value.match(/\d\.\d\.\dfb/) == null){
                val.value = val.value.replace(/\d\.\d\.\d/, val.value.match(/\d\.\d\.\d/) + 'fb');
            }
            else {
                val.value = val.value.replace(/\d\.\d\.\dfb/, val.value.match(/\d\.\d\.\d/));
            }
        });

        $( "#minusDay" ).off().click(function() {
            if (val.value.match(/TIME >=/) != null){
                var strYear = /'(\d{4})/.exec(val.value.match(/TIME >= '[^']*'/)[0])[1];
                var strMonth = /-(\d{2})-/.exec(val.value.match(/TIME >= '[^']*'/)[0])[1];
                var strDay = /-(\d{2})(?= )/.exec(val.value.match(/TIME >= '[^']*'/)[0])[1];
                var newDate = new Date();

                newDate.setFullYear(parseInt(strYear), parseInt(strMonth)-1, parseInt(strDay));
                newDate.setDate(newDate.getDate() - 1);
                strYear = /.(\d{4}),/.exec(newDate.toLocaleString())[1];
                strMonth = /.(\d{2})(?=.\d{4})/.exec(newDate.toLocaleString())[1];
                strDay = /^\d{2}/.exec(newDate.toLocaleString());
                var dateTime = strYear + '-' + strMonth + '-' + strDay + ' 00:00:00';
                val.value = val.value.replace(/TIME >= '[^']*'/, "TIME >= '" + dateTime + "'");
            }
        });

        $( "#plusDay" ).off().click(function() {
            if (val.value.match(/TIME >=/) != null){
                var strYear = /'(\d{4})/.exec(val.value.match(/TIME >= '[^']*'/)[0])[1];
                var strMonth = /-(\d{2})-/.exec(val.value.match(/TIME >= '[^']*'/)[0])[1];
                var strDay = /-(\d{2})(?= )/.exec(val.value.match(/TIME >= '[^']*'/)[0])[1];
                var newDate = new Date();

                newDate.setFullYear(parseInt(strYear), parseInt(strMonth)-1, parseInt(strDay));
                newDate.setDate(newDate.getDate() + 1);
                strYear = /.(\d{4}),/.exec(newDate.toLocaleString())[1];
                strMonth = /.(\d{2})(?=.\d{4})/.exec(newDate.toLocaleString())[1];
                strDay = /^\d{2}/.exec(newDate.toLocaleString());
                var dateTime = strYear + '-' + strMonth + '-' + strDay + ' 00:00:00';
                val.value = val.value.replace(/TIME >= '[^']*'/, "TIME >= '" + dateTime + "'");
            }
        });

        $( "#today2" ).off().click(function() {
            if (val.value.match(/TIME <=/) != null){
                var UTC = new Date();
                var strMonth;
                var strDay;
                strMonth = /.(\d{2})(?=.\d{4})/.exec(UTC.toLocaleString())[1];
                strDay = /^\d{2}/.exec(UTC.toLocaleString());
                var dateTime = UTC.getFullYear() + '-' + strMonth + '-' + strDay + ' 00:00:00';
                val.value = val.value.replace(/TIME <= '[^']*'/, "TIME <= '" + dateTime + "'");
            }
        });

        $( "#minusDay2" ).off().click(function() {
            if (val.value.match(/TIME <=/) != null){
                var strYear = /'(\d{4})/.exec(val.value.match(/TIME <= '[^']*'/)[0])[1];
                var strMonth = /-(\d{2})-/.exec(val.value.match(/TIME <= '[^']*'/)[0])[1];
                var strDay = /-(\d{2})(?= )/.exec(val.value.match(/TIME <= '[^']*'/)[0])[1];
                var newDate = new Date();

                newDate.setFullYear(parseInt(strYear), parseInt(strMonth)-1, parseInt(strDay));
                newDate.setDate(newDate.getDate() - 1);
                strYear = /.(\d{4}),/.exec(newDate.toLocaleString())[1];
                strMonth = /.(\d{2})(?=.\d{4})/.exec(newDate.toLocaleString())[1];
                strDay = /^\d{2}/.exec(newDate.toLocaleString());
                var dateTime = strYear + '-' + strMonth + '-' + strDay + ' 00:00:00';
                val.value = val.value.replace(/TIME <= '[^']*'/, "TIME <= '" + dateTime + "'");
            }
        });

        $( "#plusDay2" ).off().click(function() {
            if (val.value.match(/TIME <=/) != null){
                var strYear = /'(\d{4})/.exec(val.value.match(/TIME <= '[^']*'/)[0])[1];
                var strMonth = /-(\d{2})-/.exec(val.value.match(/TIME <= '[^']*'/)[0])[1];
                var strDay = /-(\d{2})(?= )/.exec(val.value.match(/TIME <= '[^']*'/)[0])[1];
                var newDate = new Date();

                newDate.setFullYear(parseInt(strYear), parseInt(strMonth)-1, parseInt(strDay));
                newDate.setDate(newDate.getDate() + 1);
                strYear = /.(\d{4}),/.exec(newDate.toLocaleString())[1];
                strMonth = /.(\d{2})(?=.\d{4})/.exec(newDate.toLocaleString())[1];
                strDay = /^\d{2}/.exec(newDate.toLocaleString());
                var dateTime = strYear + '-' + strMonth + '-' + strDay + ' 00:00:00';
                val.value = val.value.replace(/TIME <= '[^']*'/, "TIME <= '" + dateTime + "'");
            }
        });
    }

    $( document ).ajaxComplete(function() {

        //BAKEACAKE
        if(document.evaluate("//legend[contains(., 'SQL-запрос к базе данных bakeacake:')]", document, null, XPathResult.ANY_TYPE, null ).iterateNext()){
            document.querySelectorAll("textarea#textSqlquery")[0].value = "SELECT " + colsBake + " FROM `bakeacakeios_statisticsbcevent` WHERE device_id = 'xxx' AND version = '" + currVersionBake + "'";

            buttons(currVersionBake, colsBake);
        }

        //MATCHLAND
        else if(document.evaluate("//legend[contains(., 'SQL-запрос к базе данных matchland:')]", document, null, XPathResult.ANY_TYPE, null ).iterateNext()){
            document.querySelectorAll("textarea#textSqlquery")[0].value = "SELECT " + colsML + " FROM `matchlandios_statisticsevent2` WHERE device_id = 'xxx' AND version = '" + currVersionML + "'";

            buttons(currVersionML, colsML);
        }

    });

})();