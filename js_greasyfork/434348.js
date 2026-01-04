// ==UserScript==
// @name         TaskMaster 3000
// @namespace    http://tampermonkey.net/
// @version      6
// @description  Tasko-przypominacz
// @author       nowaratn
// @match        https://fclm-portal.amazon.com/reports/functionRollup?reportFormat=HTML&warehouseId=KTW1&processId=1002960*
// @match        https://hooks.chime.aws
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/434348/TaskMaster%203000.user.js
// @updateURL https://update.greasyfork.org/scripts/434348/TaskMaster%203000.meta.js
// ==/UserScript==

GM_config.init(
    {
        'id': 'Taskmaster',
        'title': 'Taskmaster config',
        'fields':
        {
            'Czy_alert':
            {
                'label': 'czy alert',
                'type': 'checkbox',
                'title': '',
                'default': false
            },
            'Wiadomosc':
            {
                'label': 'jaka wiadomosc',
                'type': 'text',
                'title': '',
                'default': ''
            },
            'chime_webhook':
            {
                'label': 'jaki webhook',
                'type': 'text',
                'title': '',
                'default': ''
            }
        }
    });



setTimeout(function() {

    // ZMIENNE GLOBALNE
    var wiadomosc;
    // var czy_alert = false;
    var czy_alert = GM_config.get('Czy_alert');
    var chime_webhook = GM_config.get('chime_webhook');

    // STRONA FCLM
    if(window.location.href.indexOf("https://fclm-portal.amazon.com/reports/functionRollup?reportFormat=HTML&warehouseId=KTW1&processId=1002960") > -1)
    {
        // ZMIENNE
        var pracownik = document.getElementsByClassName("empl-all empl-amzn");
        var i;
        var j;
        var k = 0;
        var l;
        var managers = [];
        var unique_managers = [];

        // INFOBOX
        var infobox = document.createElement ('div');
        infobox.innerHTML = '<div id="infobox_divheader" style="border-style:solid !important;cursor:move;background-color:greenyellow;">' +
            '<p id="tytul_okienka_pomocy" style="text-align:center;margin:0px;">TaskMaster</p></div>' +
            '<div id="taskmaster_buttons" style="text-align:center;padding:10px;"><input id="by_manager_button" type="button" value="By Manager" /><input id="by_aa_list" type="button" value="By Associates List" disabled />' +
            '<input id="opcje" type="button" value="Options" style="float:right;" /></div>' +
            '<div id="infobox_tresc_id" style="padding:10px;"></div>' +
            '<div id="infobox_bottom_id" style="padding:10px;"></div>' +
            '<div id="infobox_hidden" style="display:none;">' +
            '<iframe id="infobox_hidden_iframe" src="https://fclm-portal.amazon.com/employee/employeeRoster?reportFormat=HTML&warehouseId=KTW1&departmentId=1299&employeeStatusActive=true&_employeeStatusActive=on&_employeeStatusLeaveOfAbsence=on&_employeeStatusExempt=on&employeeTypeAmzn=true&_employeeTypeAmzn=on&_employeeTypeTemp=on&_employeeType3Pty=on&Manager+Name=Manager+Name&hideColumns=Photo%2CEmployee+ID%2CUser+ID%2CEmployee+Name%2CBadge+Barcode+ID%2CDepartment+ID%2CEmployment+Start+Date%2CEmployment+Type%2CEmployee+Status%2CTemp+Agency+Code%2CJob+Title%2CManagement+Area+ID%2CShift+Pattern%2CBadge+RFID%2CExempt&submit=true" ></iframe>' +
            '<iframe style="" id="infobox_chime" src="https://hooks.chime.aws" ></iframe></div>';
        infobox.setAttribute ('id', 'infobox_div');
        infobox.setAttribute ('style', 'position:fixed;width:500px;height:90%;background-color:silver;right:5%;top:10px;resize:both;overflow:auto;color:black;display:block;z-index:1010;background-color:yellowgreen;');
        document.getElementsByTagName("body")[0].appendChild(infobox);

        // ALERT BOX
        var alertbox = document.createElement ('div');
        alertbox.innerHTML = '<div id="alertbox_divheader" style="border-style:solid !important;cursor:move;background-color:yellow;">' +
            '<p id="tytul_okienka_pomocy" style="text-align:center;margin:0px;">Alerts</p></div>' +
            '<div id="alertbox_tresc_id" style="padding:10px;overflow:auto;"></div>' +
            '<center><div id="bottom_menu" style="display:inline-flex;">' +
            '<div id="bottom_menu_left" style="padding:10px;text-align:left;"><input type="button" id="Open_all_Tasks" value="Open all Tasks" title="Otwórz widok tasku każdego pracownika w nowej karcie" /></div>' +
            '<div id="alertbox_bottom_id" style="padding:10px;text-align:center;"><input type="button" id="retask" value="Re-Task" disabled="true" /><input type="button" value="Ignore" id="ignore_task" /></div>' +
            '<div id="bottom_menu_right" style="padding:10px;text-align:right;"><input type="button" id="Ignore_all" value="Ignore all" /></div></center>' +
            '<div>';
        alertbox.setAttribute ('id', 'alertbox_div');
        alertbox.setAttribute ('style', 'position:fixed;width:30%;height:50%;background-color:silver;left:30%;top:10px;overflow:auto;color:black;display:none;z-index:1010;background-color:gold;');
        document.getElementsByTagName("body")[0].appendChild(alertbox);

        // OPCJE BOX
        var opcjebox = document.createElement ('div');
        opcjebox.innerHTML = '<div id="opcjebox_divheader" style="border-style:solid !important;cursor:move;background-color:whitesmoke;">' +
            '<p id="tytul_okienka_opcje" style="text-align:center;margin:0px;">Options</p></div>' +
            '<div id="opcjebox_tresc_id" style="border-style:groove;">' +
            '<table border="1"><thead>' +
            '<tr><th>TASK</th><th>Alert after X min</th><th>Max X min on task</th></tr>' +
            '</thead><tbody>' +
            '<tr><td>OPS_EMP_ENGAGEMENT</td><td><input id="OPS_EMP_ENGAGEMENT_alert_min" type="textbox" value="55" style="width:30px;" /></td><td><input id="OPS_EMP_ENGAGEMENT_max_min" type="textbox" value="60" style="width:30px;" ></td></tr>' +
           // '<tr><td>SFT_ASSOC_SFTY_COMM</td><td><input id="SFT_ASSOC_SFTY_COMM_alert_min" type="textbox" value="22" style="width:30px;" /></td><td><input id="SFT_ASSOC_SFTY_COMM_max_min" type="textbox" value="25" style="width:30px;" ></td></tr>' +
            '<tr><td>HR_INTERVIEWS</td><td><input id="HR_INTERVIEWS_alert_min" type="textbox" value="7" style="width:30px;" /></td><td><input id="HR_INTERVIEWS_max_min" type="textbox" value="10" style="width:30px;" ></td></tr>' +
            '<tr><td>HR_OTHER/MISC</td><td><input id="HR_OTHERMISC_alert_min" type="textbox" value="27" style="width:30px;" /></td><td><input id="HR_OTHERMISC_max_min" type="textbox" value="30" style="width:30px;" ></td></tr>' +
            '<tr><td>HR_INVESTIG/APPEALS</td><td><input id="HR_INVESTIGAPPEALS_alert_min" type="textbox" value="5" style="width:30px;" /></td><td><input id="HR_INVESTIGAPPEALS_max_min" type="textbox" value="10" style="width:30px;" ></td></tr>' +
            '<tr><td>OPS_ASSOCIATE_ENGAGE</td><td><input id="OPS_ASSOCIATE_ENGAGE_alert_min" type="textbox" value="35" style="width:30px;" /></td><td><input id="OPS_ASSOCIATE_ENGAGE_max_min" type="textbox" value="40" style="width:30px;" ></td></tr>' +
            '<tr><td>HR_SITE_ACCOMM</td><td><input id="HR_SITE_ACCOMM_alert_min" type="textbox" value="5" style="width:30px;" /></td><td><input id="HR_SITE_ACCOMM_max_min" type="textbox" value="10" style="width:30px;" ></td></tr>' +

            '<tr><td>HR_GROUP_EVENTS</td><td><input id="HR_GROUP_EVENTS_alert_min" type="textbox" value="40" style="width:30px;" /></td><td><input id="HR_GROUP_EVENTS_max_min" type="textbox" value="45" style="width:30px;" ></td></tr>' +

            '</tbody></table>' +
            '<br>' +
            '<table border="1"><thead>' +
            '<tr><th>Inne ustawienia</th></tr>' +
            '<tr><td title="Zaznaczenie tej opcji spowoduje wyłączenie powiadomień na stronie.">Informować tylko na chime?</td><td><input type="checkbox" id="czy_tylko_chime" title="Zaznaczenie tej opcji spowoduje wyłączenie powiadomień na stronie."/></td></tr>' +
            '<tr><td>Chime webhook URL</td><td><input id="chime_webhook_url" type="textbox" style="width:150px;" /></td></tr>' +
            '<tr><td>Informować o zbliżeniu się do czasu tasku?</td><td><input type="checkbox" id="czy_info_alert" checked="false" /></td></tr>' +
            '<tr><td>Odświeżaj skrypt co X sekund</td><td><input type="textbox" id="refresh_rate" value="60" style="width:30px;" /></td></tr>' +
            '<tr><td>Wyczyść zapisane dane skryptu (managerów)</td><td><input type="button" id="localstorage_remove" checked="false" value="Czyść" /></td></tr>' +
            '</tbody></table>' +
            '<div id="opcjebox_menu" style="padding:5px;"><input id="opcje_zastosuj" type="button" value="Zastosuj" ><input id="opcje_zamknij" type="button" value="Zamknij" >' +
            '' +
            '</div></div>';
        opcjebox.setAttribute ('id', 'opcjebox_div');
        opcjebox.setAttribute ('style', 'position:fixed;background-color:aliceblue;left:45%;top:10px;overflow:auto;color:black;display:none;z-index:1010;');
        document.getElementsByTagName("body")[0].appendChild(opcjebox);


        // Dragable windows
        dragElement(document.getElementById("opcjebox_div"));
        dragElement(document.getElementById("infobox_div"));
        dragElement(document.getElementById("alertbox_div"));


        // Events
        document.getElementById ("ignore_task").addEventListener (
            "click", ignore_task, false
        );

        document.getElementById ("by_manager_button").addEventListener (
            "click", by_manager_button, false
        );

        document.getElementById ("by_aa_list").addEventListener (
            "click", by_aa_list, false
        );

        document.getElementById ("Open_all_Tasks").addEventListener (
            "click", Open_all_Tasks, false
        );

        document.getElementById ("Ignore_all").addEventListener (
            "click", Ignore_all, false
        );

        document.getElementById ("opcje_zastosuj").addEventListener (
            "click", opcje_zastosuj, false
        );

        document.getElementById ("opcje").addEventListener (
            "click", Opcje, false
        );

        document.getElementById ("opcje_zamknij").addEventListener (
            "click", opcje_zamknij, false
        );

        document.getElementById ("localstorage_remove").addEventListener (
            "click", localstorage_remove, false
        );





        // Inicjalizacja
        var OPS_EMP_ENGAGEMENT_alert_min;
        var OPS_EMP_ENGAGEMENT_max_min;
        // var SFT_ASSOC_SFTY_COMM_alert_min;
        // var SFT_ASSOC_SFTY_COMM_max_min;
        var HR_INTERVIEWS_alert_min;
        var HR_INTERVIEWS_max_min;
        var HR_OTHERMISC_alert_min;
        var HR_OTHERMISC_max_min;
        var HR_INVESTIGAPPEALS_alert_min;
        var HR_INVESTIGAPPEALS_max_min;
        var OPS_ASSOCIATE_ENGAGE_alert_min;
        var OPS_ASSOCIATE_ENGAGE_max_min;

        var HR_SITE_ACCOMM_alert_min;
        var HR_SITE_ACCOMM_max_min;

        var HR_GROUP_EVENTS_alert_min;
        var HR_GROUP_EVENTS_max_min;

        ////
        if(localStorage.getItem("HR_GROUP_EVENTS_alert_min") != "" && localStorage.getItem("HR_GROUP_EVENTS_alert_min") != null)
        {
            HR_GROUP_EVENTS_alert_min = localStorage.getItem("HR_GROUP_EVENTS_alert_min");
            document.getElementById("HR_GROUP_EVENTS_alert_min").value = HR_GROUP_EVENTS_alert_min;
        }
        else
        {
            HR_GROUP_EVENTS_alert_min = 40;
            document.getElementById("HR_GROUP_EVENTS_alert_min").value = HR_GROUP_EVENTS_alert_min;
        }

        if(localStorage.getItem("HR_GROUP_EVENTS_max_min") != "" && localStorage.getItem("HR_GROUP_EVENTS_max_min") != null)
        {
            HR_GROUP_EVENTS_max_min = localStorage.getItem("HR_GROUP_EVENTS_max_min");
            document.getElementById("HR_GROUP_EVENTS_max_min").value = HR_GROUP_EVENTS_max_min;
        }
        else
        {
            HR_GROUP_EVENTS_max_min = 45;
            document.getElementById("HR_GROUP_EVENTS_max_min").value = HR_GROUP_EVENTS_max_min;
        }


        ///

        if(localStorage.getItem("OPS_EMP_ENGAGEMENT_alert_min") != "" && localStorage.getItem("OPS_EMP_ENGAGEMENT_alert_min") != null)
        {
            OPS_EMP_ENGAGEMENT_alert_min = localStorage.getItem("OPS_EMP_ENGAGEMENT_alert_min");
            document.getElementById("OPS_EMP_ENGAGEMENT_alert_min").value = OPS_EMP_ENGAGEMENT_alert_min;
        }
        else
        {
            OPS_EMP_ENGAGEMENT_alert_min = 55;
            document.getElementById("OPS_EMP_ENGAGEMENT_alert_min").value = OPS_EMP_ENGAGEMENT_alert_min;
        }

        if(localStorage.getItem("OPS_EMP_ENGAGEMENT_max_min") != "" && localStorage.getItem("OPS_EMP_ENGAGEMENT_max_min") != null)
        {
            OPS_EMP_ENGAGEMENT_max_min = localStorage.getItem("OPS_EMP_ENGAGEMENT_max_min");
            document.getElementById("OPS_EMP_ENGAGEMENT_max_min").value = OPS_EMP_ENGAGEMENT_max_min;
        }
        else
        {
            OPS_EMP_ENGAGEMENT_max_min = 60;
            document.getElementById("OPS_EMP_ENGAGEMENT_max_min").value = OPS_EMP_ENGAGEMENT_max_min;
        }

        if(localStorage.getItem("czy_tylko_chime") == "true")
        {
            document.getElementById("czy_tylko_chime").checked = true;
        }
        else
        {
            document.getElementById("czy_tylko_chime").checked = false;
        }

        if(localStorage.getItem("refresh_rate") != undefined && localStorage.getItem("refresh_rate") != "" && localStorage.getItem("refresh_rate") != null)
        {
            document.getElementById("refresh_rate").value = localStorage.getItem("refresh_rate");
        }
        else
        {
            document.getElementById("refresh_rate").value = "60";
        }





//         if(localStorage.getItem("SFT_ASSOC_SFTY_COMM_alert_min") != "" && localStorage.getItem("SFT_ASSOC_SFTY_COMM_alert_min") != null)
//         {
//             SFT_ASSOC_SFTY_COMM_alert_min = localStorage.getItem("SFT_ASSOC_SFTY_COMM_alert_min");
//             document.getElementById("OPS_EMP_ENGAGEMENT_alert_min").value = OPS_EMP_ENGAGEMENT_alert_min;
//         }
//         else
//         {
//             SFT_ASSOC_SFTY_COMM_alert_min = 20;
//             document.getElementById("OPS_EMP_ENGAGEMENT_alert_min").value = OPS_EMP_ENGAGEMENT_alert_min;
//         }


//         if(localStorage.getItem("SFT_ASSOC_SFTY_COMM_max_min") != "" && localStorage.getItem("SFT_ASSOC_SFTY_COMM_max_min") != null)
//         {
//             SFT_ASSOC_SFTY_COMM_max_min = localStorage.getItem("SFT_ASSOC_SFTY_COMM_max_min");
//             document.getElementById("SFT_ASSOC_SFTY_COMM_max_min").value = SFT_ASSOC_SFTY_COMM_max_min;
//         }
//         else
//         {
//             SFT_ASSOC_SFTY_COMM_max_min = 25;
//             document.getElementById("SFT_ASSOC_SFTY_COMM_max_min").value = SFT_ASSOC_SFTY_COMM_max_min;
//         }

        if(localStorage.getItem("HR_INTERVIEWS_alert_min") != "" && localStorage.getItem("HR_INTERVIEWS_alert_min") != null)
        {
            HR_INTERVIEWS_alert_min = localStorage.getItem("HR_INTERVIEWS_alert_min");
            document.getElementById("HR_INTERVIEWS_alert_min").value = HR_INTERVIEWS_alert_min;
        }
        else
        {
            HR_INTERVIEWS_alert_min = 7;
            document.getElementById("HR_INTERVIEWS_alert_min").value = HR_INTERVIEWS_alert_min;
        }

        if(localStorage.getItem("HR_INTERVIEWS_max_min") != "" && localStorage.getItem("HR_INTERVIEWS_max_min") != null)
        {
            HR_INTERVIEWS_max_min = localStorage.getItem("HR_INTERVIEWS_max_min");
            document.getElementById("HR_INTERVIEWS_max_min").value = HR_INTERVIEWS_max_min;
        }
        else
        {
            HR_INTERVIEWS_max_min = 10;
            document.getElementById("HR_INTERVIEWS_max_min").value = HR_INTERVIEWS_max_min;
        }

        if(localStorage.getItem("HR_OTHERMISC_alert_min") != "" && localStorage.getItem("HR_OTHERMISC_alert_min") != null)
        {
            HR_OTHERMISC_alert_min = localStorage.getItem("HR_OTHERMISC_alert_min");
            document.getElementById("HR_OTHERMISC_alert_min").value = HR_OTHERMISC_alert_min;
        }
        else
        {
            HR_OTHERMISC_alert_min = 27;
            document.getElementById("HR_OTHERMISC_alert_min").value = HR_OTHERMISC_alert_min;
        }

        if(localStorage.getItem("HR_OTHERMISC_max_min") != "" && localStorage.getItem("HR_OTHERMISC_max_min") != null)
        {
            HR_OTHERMISC_max_min = localStorage.getItem("HR_OTHERMISC_max_min");
            document.getElementById("HR_OTHERMISC_max_min").value = HR_OTHERMISC_max_min;
        }
        else
        {
            HR_OTHERMISC_max_min = 30;
            document.getElementById("HR_OTHERMISC_max_min").value = HR_OTHERMISC_max_min;
        }


        if(localStorage.getItem("HR_INVESTIGAPPEALS_max_min") != "" && localStorage.getItem("HR_INVESTIGAPPEALS_max_min") != null)
        {
            HR_INVESTIGAPPEALS_max_min = localStorage.getItem("HR_INVESTIGAPPEALS_max_min");
            document.getElementById("HR_INVESTIGAPPEALS_max_min").value = HR_INVESTIGAPPEALS_max_min;
        }
        else
        {
            HR_INVESTIGAPPEALS_max_min = 10;
            document.getElementById("HR_INVESTIGAPPEALS_max_min").value = HR_INVESTIGAPPEALS_max_min;
        }

        if(localStorage.getItem("HR_INVESTIGAPPEALS_alert_min") != "" && localStorage.getItem("HR_INVESTIGAPPEALS_alert_min") != null)
        {
            HR_INVESTIGAPPEALS_alert_min = localStorage.getItem("HR_INVESTIGAPPEALS_alert_min");
            document.getElementById("HR_INVESTIGAPPEALS_alert_min").value = HR_INVESTIGAPPEALS_alert_min;
        }
        else
        {
            HR_INVESTIGAPPEALS_alert_min = 5;
            document.getElementById("HR_INVESTIGAPPEALS_alert_min").value = HR_INVESTIGAPPEALS_alert_min;
        }



        if(localStorage.getItem("OPS_ASSOCIATE_ENGAGE_alert_min") != "" && localStorage.getItem("OPS_ASSOCIATE_ENGAGE_alert_min") != null)
        {
            OPS_ASSOCIATE_ENGAGE_alert_min = localStorage.getItem("OPS_ASSOCIATE_ENGAGE_alert_min");
            document.getElementById("OPS_ASSOCIATE_ENGAGE_alert_min").value = OPS_ASSOCIATE_ENGAGE_alert_min;
        }
        else
        {
            OPS_ASSOCIATE_ENGAGE_alert_min = 35;
            document.getElementById("OPS_ASSOCIATE_ENGAGE_alert_min").value = OPS_ASSOCIATE_ENGAGE_alert_min;
        }

        if(localStorage.getItem("OPS_ASSOCIATE_ENGAGE_max_min") != "" && localStorage.getItem("OPS_ASSOCIATE_ENGAGE_max_min") != null)
        {
            OPS_ASSOCIATE_ENGAGE_max_min = localStorage.getItem("OPS_ASSOCIATE_ENGAGE_max_min");
            document.getElementById("OPS_ASSOCIATE_ENGAGE_max_min").value = OPS_ASSOCIATE_ENGAGE_max_min;
        }
        else
        {
            OPS_ASSOCIATE_ENGAGE_max_min = 40;
            document.getElementById("OPS_ASSOCIATE_ENGAGE_max_min").value = OPS_ASSOCIATE_ENGAGE_max_min;
        }



        if(localStorage.getItem("HR_SITE_ACCOMM_max_min") != "" && localStorage.getItem("HR_SITE_ACCOMM_max_min") != null)
        {
            HR_SITE_ACCOMM_max_min = localStorage.getItem("HR_SITE_ACCOMM_max_min");
            document.getElementById("HR_SITE_ACCOMM_max_min").value = HR_SITE_ACCOMM_max_min;
        }
        else
        {
            HR_SITE_ACCOMM_max_min = 10;
            document.getElementById("HR_SITE_ACCOMM_max_min").value = HR_SITE_ACCOMM_max_min;
        }

        if(localStorage.getItem("HR_SITE_ACCOMM_alert_min") != "" && localStorage.getItem("HR_SITE_ACCOMM_alert_min") != null)
        {
            HR_SITE_ACCOMM_alert_min = localStorage.getItem("HR_SITE_ACCOMM_alert_min");
            document.getElementById("HR_SITE_ACCOMM_alert_min").value = HR_SITE_ACCOMM_alert_min;
        }
        else
        {
            HR_SITE_ACCOMM_alert_min = 5;
            document.getElementById("HR_SITE_ACCOMM_alert_min").value = HR_SITE_ACCOMM_alert_min;
        }


        if(localStorage.getItem("chime_webhook") != "" && localStorage.getItem("chime_webhook") != null)
        {
            document.getElementById("chime_webhook_url").value = localStorage.getItem("chime_webhook");
        }

        if(localStorage.getItem("czy_info_alert") != "" && localStorage.getItem("czy_info_alert") != null)
        {
            if(localStorage.getItem("czy_info_alert") == "true")
            {
                document.getElementById("czy_info_alert").checked = true;
            }
            else
            {
                document.getElementById("czy_info_alert").checked = false;
            }
        }
        else
        {
            localStorage.setItem("czy_info_alert",document.getElementById("czy_info_alert").checked);
        }

        // sprawdzenie taskow pracownikow
        var audio1 = new Audio('https://ob-clock.000webhostapp.com/bike_horn.mp3');
        var audio2 = new Audio('https://ob-clock.000webhostapp.com/air_horn.mp3');

        j = 0;
        var unique_manager = [];
        var tablica = [["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],
                       ["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],
                       ["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],
                       ["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],
                       ["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],
                       ["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],
                       ["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""]]; // nie umiem w tablice, ale skoro dziala...
        var pracownik_link;
        var alertu = false;

        for(i=0;i<=pracownik.length;i++)
        {
            if(pracownik[i] != undefined)
            {
                var kto = pracownik[i].children[2].innerText;
                var godziny = parseFloat(pracownik[i].children[8].innerText);
                var manager = pracownik[i].children[3].innerText;
                var x = 0;
                var rodzaj;
                var max = false;

                // HR_GROUP _EVENTS
                // 40 minut ostrzezenie
                // 45 min alert
                if(pracownik[i].parentElement.parentElement.innerText.substr(0,16) == "HR_GROUP _EVENTS")
                {
                    if(sessionStorage.getItem(manager) == "true" || localStorage.getItem(manager) == "true")
                    {
                        if(godziny >= (HR_GROUP_EVENTS_max_min / 60) && sessionStorage.getItem(kto + "HR_GROUP _EVENTS") != "ignore")
                        {
                            tablica[j][0] = manager;
                            tablica[j][1] = kto;
                            tablica[j][2] = "HR_GROUP _EVENTS";
                            rodzaj = '<span style="color:red;">Przekroczył/a czas na tasku <span class="task">HR_GROUP _EVENTS</span></span>';
                            tablica[j][3] = rodzaj;
                            pracownik_link = pracownik[i].children[1].innerHTML.replace("title=","target=\"_blank\" title=");
                            pracownik_link = pracownik_link.replace("\n        ","").replace("\n","");
                            tablica[j][4] = pracownik_link;
                            max = true;
                            j++;
                            alertu = true;
                            // audio2.play();
                            // document.getElementById("alertbox_div").style.display = "block";
                            // document.getElementById("alertbox_tresc_id").innerHTML += '<p style="font-align:center;" id="p_' + kto + '"><input type="checkbox" id="' + kto + '" /><b>' + kto + ' (<span>' + pracownik[i].children[1].innerHTML.replace("title=","target=\"_blank\" title=") + '</span>)</b><br>' + manager + '<br>Przekroczył/a czas na tasku<br><span style="font-style:italic;" class="task">OPS_EMP_ENGAGEMENT</span></p>';

                        }
                        else if(godziny >= (HR_GROUP_EVENTS_alert_min / 60) && sessionStorage.getItem(kto + "HR_GROUP _EVENTS") != "ignore" && max == false && localStorage.getItem("czy_info_alert") == "true")
                        {
                            tablica[j][0] = manager;
                            tablica[j][1] = kto;
                            tablica[j][2] = "HR_GROUP _EVENTS";
                            rodzaj = 'Zbliża się do limitu czasu na tasku <span class="task">HR_GROUP _EVENTS</span>';
                            tablica[j][3] = rodzaj;
                            pracownik_link = pracownik[i].children[1].innerHTML.replace("title=","target=\"_blank\" title=");
                            pracownik_link = pracownik_link.replace("\n        ","").replace("\n","");
                            tablica[j][4] = pracownik_link;
                            max = true;
                            j++;
                            alertu = true;
                            // audio1.play();
                            // document.getElementById("alertbox_div").style.display = "block";
                            // document.getElementById("alertbox_tresc_id").innerHTML += '<p style="font-align:center;" id="p_' + kto + '"><input type="checkbox" id="' + kto + '" /><b>' + kto + ' (<span>' + pracownik[i].children[1].innerHTML.replace("title=","target=\"_blank\" title=") + '</span>)</b><br>' + manager + '<br>Zbliża się do limitu czasu tasku<br><span style="font-style:italic;"  class="task">OPS_EMP_ENGAGEMENT</span></p>';
                        }
                    }
                }

                // OPS_EMP_ENGAGEMENT
                // 51 minut ostrzezenie
                // 57 min alert
                if(pracownik[i].parentElement.parentElement.innerText.substr(0,18) == "OPS_EMP_ENGAGEMENT")
                {
                    if(sessionStorage.getItem(manager) == "true" || localStorage.getItem(manager) == "true")
                    {
                        if(godziny >= (OPS_EMP_ENGAGEMENT_max_min / 60) && sessionStorage.getItem(kto + "_OPS_EMP_ENGAGEMENT") != "ignore")
                        {
                            tablica[j][0] = manager;
                            tablica[j][1] = kto;
                            tablica[j][2] = "OPS_EMP_ENGAGEMENT";
                            rodzaj = '<span style="color:red;">Przekroczył/a czas na tasku <span class="task">OPS_EMP_ENGAGEMENT</span></span>';
                            tablica[j][3] = rodzaj;
                            pracownik_link = pracownik[i].children[1].innerHTML.replace("title=","target=\"_blank\" title=");
                            pracownik_link = pracownik_link.replace("\n        ","").replace("\n","");
                            tablica[j][4] = pracownik_link;
                            max = true;
                            j++;
                            alertu = true;
                            // audio2.play();
                            // document.getElementById("alertbox_div").style.display = "block";
                            // document.getElementById("alertbox_tresc_id").innerHTML += '<p style="font-align:center;" id="p_' + kto + '"><input type="checkbox" id="' + kto + '" /><b>' + kto + ' (<span>' + pracownik[i].children[1].innerHTML.replace("title=","target=\"_blank\" title=") + '</span>)</b><br>' + manager + '<br>Przekroczył/a czas na tasku<br><span style="font-style:italic;" class="task">OPS_EMP_ENGAGEMENT</span></p>';

                        }
                        else if(godziny >= (OPS_EMP_ENGAGEMENT_alert_min / 60) && sessionStorage.getItem(kto + "_OPS_EMP_ENGAGEMENT") != "ignore" && max == false && localStorage.getItem("czy_info_alert") == "true")
                        {
                            tablica[j][0] = manager;
                            tablica[j][1] = kto;
                            tablica[j][2] = "OPS_EMP_ENGAGEMENT";
                            rodzaj = 'Zbliża się do limitu czasu na tasku <span class="task">OPS_EMP_ENGAGEMENT</span>';
                            tablica[j][3] = rodzaj;
                            pracownik_link = pracownik[i].children[1].innerHTML.replace("title=","target=\"_blank\" title=");
                            pracownik_link = pracownik_link.replace("\n        ","").replace("\n","");
                            tablica[j][4] = pracownik_link;
                            max = true;
                            j++;
                            alertu = true;
                            // audio1.play();
                            // document.getElementById("alertbox_div").style.display = "block";
                            // document.getElementById("alertbox_tresc_id").innerHTML += '<p style="font-align:center;" id="p_' + kto + '"><input type="checkbox" id="' + kto + '" /><b>' + kto + ' (<span>' + pracownik[i].children[1].innerHTML.replace("title=","target=\"_blank\" title=") + '</span>)</b><br>' + manager + '<br>Zbliża się do limitu czasu tasku<br><span style="font-style:italic;"  class="task">OPS_EMP_ENGAGEMENT</span></p>';
                        }
                    }
                }

                // // SFT_ASSOC_SFTY_COMM
                // // 18 minut ostrzezenie
                // // 22 min alert
                // if(pracownik[i].parentElement.parentElement.innerText.substr(0,19) == "SFT_ASSOC_SFTY_COMM")
                // {
                //     if(sessionStorage.getItem(pracownik[i].children[3].innerText) == "true")
                //     {
                //         if(godziny >= (SFT_ASSOC_SFTY_COMM_max_min / 60)  && sessionStorage.getItem(kto + "_SFT_ASSOC_SFTY_COMM") != "ignore")
                //         {
                //             audio2.play();
                //             document.getElementById("alertbox_div").style.display = "block";
                //             document.getElementById("alertbox_tresc_id").innerHTML += '<p style="font-align:center;" id="p_' + kto + '"><input type="checkbox" id="' + kto + '" /><b>' + kto + ' (<span>' + pracownik[i].children[1].innerHTML.replace("title=","target=\"_blank\" title=") + '</span>)</b><br>Przekroczył/a czas na tasku<br><span class="task">SFT_ASSOC_SFTY_COMM</span></p>';
                //         }
                //         else if(godziny >= (SFT_ASSOC_SFTY_COMM_alert_min / 60) && sessionStorage.getItem(kto + "_SFT_ASSOC_SFTY_COMM") != "ignore")
                //         {
                //             audio1.play();
                //             document.getElementById("alertbox_div").style.display = "block";
                //             document.getElementById("alertbox_tresc_id").innerHTML += '<p style="font-align:center;" id="p_' + kto + '"><input type="checkbox" id="' + kto + '" /><b>' + kto + ' (<span>' + pracownik[i].children[1].innerHTML.replace("title=","target=\"_blank\" title=") + '</span>)</b><br>Zbliża się do limitu czasu tasku<br><span class="task">SFT_ASSOC_SFTY_COMM</span></p>';
                //         }
                //     }
                // }


                // HR_INTERVIEWS
                // 7 minut ostrzezenie
                // 10 min alert
                if(pracownik[i].parentElement.parentElement.innerText.substr(0,13) == "HR_INTERVIEWS")
                {
                    if(sessionStorage.getItem(pracownik[i].children[3].innerText) == "true"  || localStorage.getItem(manager) == "true")
                    {
                        if(godziny >= (HR_INTERVIEWS_max_min / 60)  && sessionStorage.getItem(kto + "_HR_INTERVIEWS") != "ignore")
                        {
                            tablica[j][0] = manager;
                            tablica[j][1] = kto;
                            tablica[j][2] = "HR_INTERVIEWS";
                            rodzaj = '<span style="color:red;">Przekroczył/a czas na tasku <span class="task">HR_INTERVIEWS</span></span>';
                            tablica[j][3] = rodzaj;
                            pracownik_link = pracownik[i].children[1].innerHTML.replace("title=","target=\"_blank\" title=");
                            pracownik_link = pracownik_link.replace("\n        ","").replace("\n","");
                            tablica[j][4] = pracownik_link;
                            max = true;
                            j++;
                            alertu = true;
                            // audio2.play();
                            // document.getElementById("alertbox_div").style.display = "block";
                            // document.getElementById("alertbox_tresc_id").innerHTML += '<p style="font-align:center;" id="p_' + kto + '"><input type="checkbox" id="' + kto + '" /><b>' + kto + ' (<span>' + pracownik[i].children[1].innerHTML.replace("title=","target=\"_blank\" title=") + '</span>)</b><br>' + manager + '<br>Przekroczył/a czas na tasku<br><span style="font-style:italic;"  class="task">HR_INTERVIEWS</span></p>';
                        }
                        else if(godziny >= (HR_INTERVIEWS_alert_min / 60) && sessionStorage.getItem(kto + "_HR_INTERVIEWS") != "ignore" && max == false && localStorage.getItem("czy_info_alert") == "true")
                        {
                            tablica[j][0] = manager;
                            tablica[j][1] = kto;
                            tablica[j][2] = "HR_INTERVIEWS";
                            rodzaj = 'Zbliża się do limitu czasu na tasku <span class="task">HR_INTERVIEWS</span>';
                            tablica[j][3] = rodzaj;
                            pracownik_link = pracownik[i].children[1].innerHTML.replace("title=","target=\"_blank\" title=");
                            pracownik_link = pracownik_link.replace("\n        ","").replace("\n","");
                            tablica[j][4] = pracownik_link;
                            max = true;
                            j++;
                            alertu = true;
                            // audio1.play();
                            // document.getElementById("alertbox_div").style.display = "block";
                            // document.getElementById("alertbox_tresc_id").innerHTML += '<p style="font-align:center;" id="p_' + kto + '"><input type="checkbox" id="' + kto + '" /><b>' + kto + ' (<span>' + pracownik[i].children[1].innerHTML.replace("title=","target=\"_blank\" title=") + '</span>)</b><br>' + manager + '<br>Zbliża się do limitu czasu tasku<br><span style="font-style:italic;"   class="task">HR_INTERVIEWS</span></p>';
                        }
                    }
                }


                // HR_OTHERMISC
                //  minut ostrzezenie
                // 30 min alert
                if(pracownik[i].parentElement.parentElement.innerText.substr(0,13) == "HR_OTHER/MISC")
                {
                    if(sessionStorage.getItem(pracownik[i].children[3].innerText) == "true"  || localStorage.getItem(manager) == "true")
                    {
                        if(godziny >= (HR_OTHERMISC_max_min / 60)  && sessionStorage.getItem(kto + "_HR_OTHERMISC") != "ignore")
                        {
                            tablica[j][0] = manager;
                            tablica[j][1] = kto;
                            tablica[j][2] = "HR_OTHER/MISC";
                            rodzaj = '<span style="color:red;">Przekroczył/a czas na tasku <span class="task">HR_OTHER/MISC</span></span>';
                            tablica[j][3] = rodzaj;
                            pracownik_link = pracownik[i].children[1].innerHTML.replace("title=","target=\"_blank\" title=");
                            pracownik_link = pracownik_link.replace("\n        ","").replace("\n","");
                            tablica[j][4] = pracownik_link;
                            max = true;
                            j++;
                            alertu = true;
                            // audio2.play();
                            // document.getElementById("alertbox_div").style.display = "block";
                            // document.getElementById("alertbox_tresc_id").innerHTML += '<p style="font-align:center;" id="p_' + kto + '"><input type="checkbox" id="' + kto + '" /><b>' + kto + ' (<span>' + pracownik[i].children[1].innerHTML.replace("title=","target=\"_blank\" title=") + '</span>)</b><br>' + manager + '<br>Przekroczył/a czas na tasku<br><span style="font-style:italic;"   class="task">HR_OTHER/MISC</span></p>';
                        }
                        else if(godziny >= (HR_OTHERMISC_alert_min / 60) && sessionStorage.getItem(kto + "_HR_OTHERMISC") != "ignore" && max == false && localStorage.getItem("czy_info_alert") == "true")
                        {
                            tablica[j][0] = manager;
                            tablica[j][1] = kto;
                            tablica[j][2] = "HR_OTHER/MISC";
                            rodzaj = 'Zbliża się do limitu czasu na tasku <span class="task">HR_OTHER/MISC</span>';
                            tablica[j][3] = rodzaj;
                            pracownik_link = pracownik[i].children[1].innerHTML.replace("title=","target=\"_blank\" title=");
                            pracownik_link = pracownik_link.replace("\n        ","").replace("\n","");
                            tablica[j][4] = pracownik_link;
                            max = true;
                            j++;
                            alertu = true;
                            // audio1.play();
                            // document.getElementById("alertbox_div").style.display = "block";
                            // document.getElementById("alertbox_tresc_id").innerHTML += '<p style="font-align:center;" id="p_' + kto + '"><input type="checkbox" id="' + kto + '" /><b>' + kto + ' (<span>' + pracownik[i].children[1].innerHTML.replace("title=","target=\"_blank\" title=") + '</span>)</b><br>' + manager + '<br>Zbliża się do limitu czasu tasku<br><span style="font-style:italic;"   class="task">HR_OTHER/MISC</span></p>';
                        }
                    }
                }


                // HR_INVESTIG/APPEALS
                // 5 minut ostrzezenie
                // 10 min alert
                if(pracownik[i].parentElement.parentElement.innerText.substr(0,19) == "HR_INVESTIG/APPEALS")
                {
                    if(sessionStorage.getItem(pracownik[i].children[3].innerText) == "true"  || localStorage.getItem(manager) == "true")
                    {
                        if(godziny >= (HR_INVESTIGAPPEALS_max_min / 60)  && sessionStorage.getItem(kto + "_HR_INVESTIGAPPEALS") != "ignore")
                        {
                            tablica[j][0] = manager;
                            tablica[j][1] = kto;
                            tablica[j][2] = "HR_INVESTIG/APPEALS";
                            rodzaj = '<span style="color:red;">Przekroczył/a czas na tasku <span class="task">HR_INVESTIG/APPEALS</span></span>';
                            tablica[j][3] = rodzaj;
                            pracownik_link = pracownik[i].children[1].innerHTML.replace("title=","target=\"_blank\" title=");
                            pracownik_link = pracownik_link.replace("\n        ","").replace("\n","");
                            tablica[j][4] = pracownik_link;
                            max = true;
                            j++;
                            alertu = true;
                            // audio2.play();
                            // document.getElementById("alertbox_div").style.display = "block";
                            // document.getElementById("alertbox_tresc_id").innerHTML += '<p style="font-align:center;" id="p_' + kto + '"><input type="checkbox" id="' + kto + '" /><b>' + kto + ' (<span>' + pracownik[i].children[1].innerHTML.replace("title=","target=\"_blank\" title=") + '</span>)</b><br>' + manager + '<br>Przekroczył/a czas na tasku<br><span style="font-style:italic;"   class="task">HR_INVESTIG/APPEALS</span></p>';
                        }
                        else if(godziny >= (HR_INVESTIGAPPEALS_alert_min / 60) && sessionStorage.getItem(kto + "_HR_INVESTIGAPPEALS") != "ignore" && max == false && localStorage.getItem("czy_info_alert") == "true")
                        {
                            tablica[j][0] = manager;
                            tablica[j][1] = kto;
                            tablica[j][2] = "HR_INVESTIG/APPEALS";
                            rodzaj = 'Zbliża się do limitu czasu na tasku <span class="task">HR_INVESTIG/APPEALS</span>';
                            tablica[j][3] = rodzaj;
                            pracownik_link = pracownik[i].children[1].innerHTML.replace("title=","target=\"_blank\" title=");
                            pracownik_link = pracownik_link.replace("\n        ","").replace("\n","");
                            tablica[j][4] = pracownik_link;
                            max = true;
                            j++;
                            alertu = true;
                            // audio1.play();
                            // document.getElementById("alertbox_div").style.display = "block";
                            // document.getElementById("alertbox_tresc_id").innerHTML += '<p style="font-align:center;" id="p_' + kto + '"><input type="checkbox" id="' + kto + '" /><b>' + kto + ' (<span>' + pracownik[i].children[1].innerHTML.replace("title=","target=\"_blank\" title=") + '</span>)</b><br>' + manager + '<br>Zbliża się do limitu czasu tasku<br><span style="font-style:italic;"   class="task">HR_INVESTIG/APPEALS</span></p>';
                        }
                    }
                }


                // OPS_ASSOCIATE_ENGAGE
                // 35 minut ostrzezenie
                // 40 min alert
                if(pracownik[i].parentElement.parentElement.innerText.substr(0,20) == "OPS_ASSOCIATE_ENGAGE")
                {
                    if(sessionStorage.getItem(pracownik[i].children[3].innerText) == "true"  || localStorage.getItem(manager) == "true")
                    {
                        if(godziny >= (OPS_ASSOCIATE_ENGAGE_max_min / 60)  && sessionStorage.getItem(kto + "_OPS_ASSOCIATE_ENGAGE") != "ignore")
                        {
                            tablica[j][0] = manager;
                            tablica[j][1] = kto;
                            tablica[j][2] = "OPS_ASSOCIATE_ENGAGE";
                            rodzaj = '<span style="color:red;">Przekroczył/a czas na tasku <span class="task">OPS_ASSOCIATE_ENGAGE</span></span>';
                            tablica[j][3] = rodzaj;
                            pracownik_link = pracownik[i].children[1].innerHTML.replace("title=","target=\"_blank\" title=");
                            pracownik_link = pracownik_link.replace("\n        ","").replace("\n","");
                            tablica[j][4] = pracownik_link;
                            max = true;
                            j++;
                            alertu = true;
                            // audio2.play();
                            // document.getElementById("alertbox_div").style.display = "block";
                            // document.getElementById("alertbox_tresc_id").innerHTML += '<p style="font-align:center;" id="p_' + kto + '"><input type="checkbox" id="' + kto + '" /><b>' + kto + ' (<span>' + pracownik[i].children[1].innerHTML.replace("title=","target=\"_blank\" title=") + '</span>)</b><br>' + manager + '<br>Przekroczył/a czas na tasku<br><span style="font-style:italic;"   class="task">OPS_ASSOCIATE_ENGAGE</span></p>';
                        }
                        else if(godziny >= (OPS_ASSOCIATE_ENGAGE_alert_min / 60) && sessionStorage.getItem(kto + "_OPS_ASSOCIATE_ENGAGE") != "ignore" && max == false && localStorage.getItem("czy_info_alert") == "true")
                        {
                            tablica[j][0] = manager;
                            tablica[j][1] = kto;
                            tablica[j][2] = "OPS_ASSOCIATE_ENGAGE";
                            rodzaj = 'Zbliża się do limitu czasu na tasku <span class="task">OPS_ASSOCIATE_ENGAGE</span>';
                            tablica[j][3] = rodzaj;
                            pracownik_link = pracownik[i].children[1].innerHTML.replace("title=","target=\"_blank\" title=");
                            pracownik_link = pracownik_link.replace("\n        ","").replace("\n","");
                            tablica[j][4] = pracownik_link;
                            max = true;
                            j++;
                            alertu = true;
                            // audio1.play();
                            // document.getElementById("alertbox_div").style.display = "block";
                            // document.getElementById("alertbox_tresc_id").innerHTML += '<p style="font-align:center;" id="p_' + kto + '"><input type="checkbox" id="' + kto + '" /><b>' + kto + ' (<span>' + pracownik[i].children[1].innerHTML.replace("title=","target=\"_blank\" title=") + '</span>)</b><br>' + manager + '<br>Zbliża się do limitu czasu tasku<br><span style="font-style:italic;"   class="task">OPS_ASSOCIATE_ENGAGE</span></p>';
                        }
                    }
                }



                // HR_SITE_ACCOMM
                // 5 minut ostrzezenie
                // 10 min alert
                if(pracownik[i].parentElement.parentElement.innerText.substr(0,14) == "HR_SITE_ACCOMM")
                {
                    if(sessionStorage.getItem(pracownik[i].children[3].innerText) == "true"  || localStorage.getItem(manager) == "true")
                    {
                        if(godziny >= (HR_SITE_ACCOMM_max_min / 60)  && sessionStorage.getItem(kto + "_HR_SITE_ACCOMM") != "ignore")
                        {
                            tablica[j][0] = manager;
                            tablica[j][1] = kto;
                            tablica[j][2] = "HR_SITE_ACCOMM";
                            rodzaj = '<span style="color:red;">Przekroczył/a czas na tasku <span class="task">HR_SITE_ACCOMM</span></span>';
                            tablica[j][3] = rodzaj;
                            pracownik_link = pracownik[i].children[1].innerHTML.replace("title=","target=\"_blank\" title=");
                            pracownik_link = pracownik_link.replace("\n        ","").replace("\n","");
                            tablica[j][4] = pracownik_link;
                            max = true;
                            j++;
                            alertu = true;
                            // audio2.play();
                            // document.getElementById("alertbox_div").style.display = "block";
                            // document.getElementById("alertbox_tresc_id").innerHTML += '<p style="font-align:center;" id="p_' + kto + '"><input type="checkbox" id="' + kto + '" /><b>' + kto + ' (<span>' + pracownik[i].children[1].innerHTML.replace("title=","target=\"_blank\" title=") + '</span>)</b><br>' + manager + '<br>Przekroczył/a czas na tasku<br><span style="font-style:italic;"   class="task">HR_SITE_ACCOMM</span></p>';
                        }
                        else if(godziny >= (HR_SITE_ACCOMM_alert_min / 60) && sessionStorage.getItem(kto + "_HR_SITE_ACCOMM") != "ignore" && max == false && localStorage.getItem("czy_info_alert") == "true")
                        {
                            tablica[j][0] = manager;
                            tablica[j][1] = kto;
                            tablica[j][2] = "HR_SITE_ACCOMM";
                            rodzaj = "Zbliża się do limitu czasu na tasku HR_SITE_ACCOMM";
                            tablica[j][3] = rodzaj;
                            pracownik_link = pracownik[i].children[1].innerHTML.replace("title=","target=\"_blank\" title=");
                            pracownik_link = pracownik_link.replace("\n        ","").replace("\n","");
                            tablica[j][4] = pracownik_link;
                            max = true;
                            j++;
                            alertu = true;
                            // audio1.play();
                            // document.getElementById("alertbox_div").style.display = "block";
                            // document.getElementById("alertbox_tresc_id").innerHTML += '<p style="font-align:center;" id="p_' + kto + '"><input type="checkbox" id="' + kto + '" /><b>' + kto + ' (<span>' + pracownik[i].children[1].innerHTML.replace("title=","target=\"_blank\" title=") + '</span>)</b><br>' + manager + '<br>Zbliża się do limitu czasu tasku<br><span style="font-style:italic;"   class="task">HR_SITE_ACCOMM</span></p>';
                        }
                    }
                }



                // Taski zabronione
                var task = pracownik[i].parentElement.parentElement.innerText;
                task = task.substring(0,task.indexOf(" "));
                task = task.toLowerCase();

                if(task.toLowerCase() == "safety" || task.toLowerCase() == "human_resources" || task.toLowerCase() == "admin_meetings" || task.toLowerCase() == "amcare_nonocc_in" ||
                   task.toLowerCase() == "3rd_party" || task.toLowerCase() == "works_council")
                {
                    if(sessionStorage.getItem(kto + "_" + task) != "ignore")
                    {
                        tablica[j][0] = manager;
                        tablica[j][1] = kto;
                        tablica[j][2] = task;
                        rodzaj = "Jest na Tasku który nie powinien być używany!";
                        tablica[j][3] = rodzaj;
                        pracownik_link = pracownik[i].children[1].innerHTML.replace("title=","target=\"_blank\" title=");
                        pracownik_link = pracownik_link.replace("\n        ","").replace("\n","");
                        tablica[j][4] = pracownik_link;
                        max = true;
                        j++;
                        alertu = true;
                        // audio2.play();
                        // document.getElementById("alertbox_div").style.display = "block";
                        // document.getElementById("alertbox_tresc_id").innerHTML += '<p style="font-align:center;" id="p_' + kto + '"><input type="checkbox" id="' + kto + '" /><b>' + kto + ' (<span>' + pracownik[i].children[1].innerHTML.replace("title=","target=\"_blank\" title=") + '</span>)</b><br>' + manager + '<br>Jest na Tasku który nie powinien być używany!<br><span style="font-style:italic;"   class="task">' + task.toLowerCase() + '</span></p>';
                    }
                }
            }
        }

        //
        // Sortujemy wynik Alertow po managerach
        //

        if(alertu == true)
        {
            var temp = [];
            for(i = 0;i<=j;i++)
            {
                temp[i] = tablica[i][0];
            }
            var uniq_manag = [];
            uniq_manag = temp.filter(onlyUnique);

            // tablica[j][0] = manager;
            // tablica[j][1] = kto;
            // tablica[j][2] = "HR_SITE_ACCOMM";
            // tablica[j][3] = rodzaj;
            // tablica[j][4] = pracownik_link;

            var info_strona = [];
            var z = 0;
            var ile = 0;

            for(j=0;j<=tablica.length;j++)
            {
                if(tablica[j] != undefined)
                {
                    if(tablica[j][0] != "")
                    {
                        ile++; // ile pelnych elementow tablicy
                    }
                }
            }


            for(i=0;i<=uniq_manag.length;i++)
            {
                for(j=0;j<=ile;j++)
                {
                    if(tablica[j] != undefined)
                    {
                        if(tablica[j][0] == uniq_manag[i])
                        {
                            if(info_strona[uniq_manag[i]] == undefined)
                            {
                                info_strona[uniq_manag[i]] = '<span style="display:inline-block;padding-bottom:1%;" id="p_' + tablica[j][1] + '"><input type="checkbox" id="' + tablica[j][1] + '" class="pracownik"/><b>' + tablica[j][1] + ' (<span class="pracownik_link">' + tablica[j][4] + '</span>)</b><br>' + tablica[j][3] + '</span><br>';
                            }
                            else
                            {
                                info_strona[uniq_manag[i]] = info_strona[uniq_manag[i]] + '<span style="display:inline-block;padding-bottom:1%;" id="p_' + tablica[j][1] + '"><input type="checkbox" id="' + tablica[j][1] + '" class="pracownik"/><b>' + tablica[j][1] + ' (<span class="pracownik_link">' + tablica[j][4] + '</span>)</b><br>' + tablica[j][3] + '</span><br>';
                            }
                        }
                    }
                }
            }

            // console.log(info_strona);

            var wiadomosc_HTML;
            wiadomosc = "";
            var wiadomosc_tresc = "|";

            // Tutaj info dla okienka na stronie
            for(i = 0;i<=uniq_manag.length;i++)
            {
                if(uniq_manag[i] != undefined && uniq_manag[i] != "" && uniq_manag[i] != null)
                {
                    document.getElementById("alertbox_tresc_id").innerHTML += '<span style="font-variant: petite-caps;font-weight: bold;font-size:130%;"><center>' + uniq_manag[i] + '</center></span><br>' + info_strona[uniq_manag[i]] + '<hr>';
                    if(i==0)
                    {
                        wiadomosc = wiadomosc + uniq_manag[i] + '|\n|---|\n';
                    }
                    else
                    {
                        wiadomosc = wiadomosc + '**' + uniq_manag[i] + '**|\n';
                    }

                    wiadomosc_HTML = htmlToElements(info_strona[uniq_manag[i]]);

                  //  console.log(wiadomosc_HTML);

                    for(j=0;j<=wiadomosc_HTML.length;j++)
                    {
                        if(wiadomosc_HTML[j] != undefined)
                        {
                            if(wiadomosc_HTML[j].children != undefined && wiadomosc_HTML[j].children[3] != undefined)
                            {
                                // console.log(wiadomosc_HTML[j].children[3].innerText);
                                var emoji = "";
                                if(wiadomosc_HTML[j].children[3].previousSibling.textContent.substr(0,2) == "Zb")
                                {
                                    emoji = ":warning:";
                                }
                                else
                                {
                                    emoji = ":red_circle:";
                                }

                                wiadomosc_tresc = wiadomosc_tresc + wiadomosc_HTML[j].children[1].innerText + '|' + emoji + " " + wiadomosc_HTML[j].children[3].previousSibling.textContent + wiadomosc_HTML[j].children[3].innerText + '|\n|';
                            }
                        }
                    }

                    wiadomosc = wiadomosc + wiadomosc_tresc;
                    wiadomosc_tresc = "";
                }
            }

            var temp_alert = false;

            // Jeżeli ma być tylko wiadomość na Chime
            if(localStorage.getItem("czy_tylko_chime") == "true")
            {
                temp_alert = true;
            }
            else
            {
                document.getElementById("alertbox_div").style.display = "block";
                document.getElementById("alertbox_div").scrollTo(0,0);
                audio2.play();
            }

            

            wiadomosc = '/md |' + wiadomosc;
            wiadomosc = wiadomosc.slice(0,-1);
           // console.log(wiadomosc);



            // Jeżeli jest alert, wyslij info na Chime
            if(document.getElementById("alertbox_div").style.display == "block" || temp_alert == true)
            {
                czy_alert = true;
                GM_config.set('Czy_alert', true);
                GM_config.set('Wiadomosc', wiadomosc);
                GM_config.save();
            }

            alertu == false;
        }




        if(sessionStorage.getItem("Taskmaster_type") == "by_manager" && sessionStorage.getItem("Taskmaster_checked") == "true" || localStorage.getItem("Taskmaster_checked") == "true")
        {
            document.getElementById("by_manager_button").click();

            if(document.getElementById("alertbox_div").style.display != "block" && (sessionStorage.getItem("Taskmaster_run") == "true" || localStorage.getItem("Taskmaster_run") == "true"))
            {
                console.log("problem?");
                onTimer();
            }
        }

        function Opcje (zEvent)
        {
            if(document.getElementById("opcjebox_div").style.display == "block")
            {
                document.getElementById("opcjebox_div").style.display = "none";
            }
            else
            {
                document.getElementById("opcjebox_div").style.display = "block";
            }
        }

        function opcje_zastosuj (zEvent)
        {
            var webhook;
            webhook = document.getElementById("chime_webhook_url").value;

            if(document.getElementById("czy_tylko_chime").checked == true && webhook == "")
            {
                alert("Nie możesz wybrać powiadomień jedynie na Chime i nie wpisać URL Webhooka. Popraw to proszę");
                return;
            }


            var OPS_EMP_ENGAGEMENT_alert_min
            var OPS_EMP_ENGAGEMENT_max_min
            // var SFT_ASSOC_SFTY_COMM_max_min
            // var SFT_ASSOC_SFTY_COMM_alert_min
            var HR_INTERVIEWS_alert_min;
            var HR_INTERVIEWS_max_min;
            var HR_OTHERMISC_alert_min;
            var HR_OTHERMISC_max_min;
            var HR_INVESTIGAPPEALS_alert_min;
            var HR_INVESTIGAPPEALS_max_min;
            var OPS_ASSOCIATE_ENGAGE_alert_min;
            var OPS_ASSOCIATE_ENGAGE_max_min;
            var HR_SITE_ACCOMM_alert_min;
            var HR_SITE_ACCOMM_max_min;

            var HR_GROUP_EVENTS_alert_min;
            var HR_GROUP_EVENTS_max_min;

            OPS_EMP_ENGAGEMENT_alert_min = document.getElementById("OPS_EMP_ENGAGEMENT_alert_min").value;
            OPS_EMP_ENGAGEMENT_max_min = document.getElementById("OPS_EMP_ENGAGEMENT_max_min").value;
            // SFT_ASSOC_SFTY_COMM_alert_min = document.getElementById("SFT_ASSOC_SFTY_COMM_alert_min").value;
            // SFT_ASSOC_SFTY_COMM_max_min = document.getElementById("SFT_ASSOC_SFTY_COMM_max_min").value;
            HR_INTERVIEWS_alert_min = document.getElementById("HR_INTERVIEWS_alert_min").value;
            HR_INTERVIEWS_max_min = document.getElementById("HR_INTERVIEWS_max_min").value;
            HR_OTHERMISC_alert_min = document.getElementById("HR_OTHERMISC_alert_min").value;
            HR_OTHERMISC_max_min = document.getElementById("HR_OTHERMISC_max_min").value;
            HR_INVESTIGAPPEALS_alert_min = document.getElementById("HR_INVESTIGAPPEALS_alert_min").value;
            HR_INVESTIGAPPEALS_max_min = document.getElementById("HR_INVESTIGAPPEALS_max_min").value;
            OPS_ASSOCIATE_ENGAGE_alert_min = document.getElementById("OPS_ASSOCIATE_ENGAGE_alert_min").value;
            OPS_ASSOCIATE_ENGAGE_max_min = document.getElementById("OPS_ASSOCIATE_ENGAGE_max_min").value;
            HR_SITE_ACCOMM_alert_min = document.getElementById("HR_SITE_ACCOMM_alert_min").value;
            HR_SITE_ACCOMM_max_min = document.getElementById("HR_SITE_ACCOMM_max_min").value;

            HR_GROUP_EVENTS_alert_min = document.getElementById("HR_GROUP_EVENTS_alert_min").value;
            HR_GROUP_EVENTS_max_min = document.getElementById("HR_GROUP_EVENTS_max_min").value;

            if(isNaN(OPS_EMP_ENGAGEMENT_alert_min) || isNaN(OPS_EMP_ENGAGEMENT_max_min) || isNaN(HR_GROUP_EVENTS_alert_min) || isNaN(HR_GROUP_EVENTS_max_min)
               || isNaN(HR_INTERVIEWS_alert_min) || isNaN(HR_INTERVIEWS_max_min) || isNaN(HR_OTHERMISC_alert_min) || isNaN(HR_OTHERMISC_max_min) || isNaN(HR_INVESTIGAPPEALS_alert_min)
               || isNaN(HR_INVESTIGAPPEALS_max_min) || isNaN(OPS_ASSOCIATE_ENGAGE_alert_min) || isNaN(OPS_ASSOCIATE_ENGAGE_max_min) || isNaN(HR_SITE_ACCOMM_alert_min) || isNaN(HR_SITE_ACCOMM_max_min))
            {
                alert("Któraś z wartości nie jest liczbą");
                return;
            }
            else
            {
                localStorage.setItem("OPS_EMP_ENGAGEMENT_alert_min", OPS_EMP_ENGAGEMENT_alert_min);
                localStorage.setItem("OPS_EMP_ENGAGEMENT_max_min", OPS_EMP_ENGAGEMENT_max_min);
                // localStorage.setItem("SFT_ASSOC_SFTY_COMM_alert_min", SFT_ASSOC_SFTY_COMM_alert_min);
                // localStorage.setItem("SFT_ASSOC_SFTY_COMM_max_min", SFT_ASSOC_SFTY_COMM_max_min);
                localStorage.setItem("HR_INTERVIEWS_alert_min", HR_INTERVIEWS_alert_min);
                localStorage.setItem("HR_INTERVIEWS_max_min", HR_INTERVIEWS_max_min);
                localStorage.setItem("HR_OTHERMISC_alert_min", HR_OTHERMISC_alert_min);
                localStorage.setItem("HR_OTHERMISC_max_min", HR_OTHERMISC_max_min);
                localStorage.setItem("HR_INVESTIGAPPEALS_alert_min", HR_INVESTIGAPPEALS_alert_min);
                localStorage.setItem("HR_INVESTIGAPPEALS_max_min", HR_INVESTIGAPPEALS_max_min);
                localStorage.setItem("OPS_ASSOCIATE_ENGAGE_alert_min", OPS_ASSOCIATE_ENGAGE_alert_min);
                localStorage.setItem("OPS_ASSOCIATE_ENGAGE_max_min", OPS_ASSOCIATE_ENGAGE_max_min);
                localStorage.setItem("HR_SITE_ACCOMM_alert_min", HR_SITE_ACCOMM_alert_min);
                localStorage.setItem("HR_SITE_ACCOMM_max_min", HR_SITE_ACCOMM_max_min);

                localStorage.setItem("HR_GROUP_EVENTS_alert_min", HR_GROUP_EVENTS_alert_min);
                localStorage.setItem("HR_GROUP_EVENTS_max_min", HR_GROUP_EVENTS_max_min);
            }

            if(webhook != "" && webhook != undefined)
            {
                GM_config.set('chime_webhook', webhook);
                localStorage.setItem("chime_webhook", webhook);;
                GM_config.save();
            }
            else
            {
                alert("Nie uzupełniłeś pola \"Chime Webhook URL\", w związku z czym nie będziesz otrzymywał powiadomień na Chime");
            }

            if(document.getElementById("czy_info_alert").checked == true)
            {
                localStorage.setItem("czy_info_alert", true);;
            }
            else
            {
                localStorage.setItem("czy_info_alert", false);;
            }

            if(document.getElementById("czy_tylko_chime").checked == true)
            {
                localStorage.setItem("czy_tylko_chime", true);;
            }
            else
            {
                localStorage.setItem("czy_tylko_chime", false);;
            }

            if(!isNaN(document.getElementById("refresh_rate").value))
            {
                localStorage.setItem("refresh_rate", document.getElementById("refresh_rate").value);
            }
            else
            {
                alert("Czas odświeżania skryptu nie jest liczbą.");
                return;
            }

            if (document.getElementById("opcjebox_div").style.display == "block") {
                document.getElementById("opcjebox_div").style.display = "none";
            }
        }

        function opcje_zamknij (zEvent)
        {
            if (document.getElementById("opcjebox_div").style.display == "block") {
                document.getElementById("opcjebox_div").style.display = "none";
            }
        }

        function Open_all_Tasks (zEvent)
        {
            var alertbox_tresc = document.getElementById("alertbox_tresc_id");
            var ile = alertbox_tresc.getElementsByTagName("input").length;
            var m;

            // alertbox_tresc.getElementsByTagName("span")[m].getElementsByTagName("a")[0].href

            for(m=0;m<ile;m++)
            {
                window.open(alertbox_tresc.getElementsByClassName("pracownik_link")[m].getElementsByTagName("a")[0].href, '_blank');
            }
        }

        function ignore_task (zEvent)
        {
            var alertbox_tresc = document.getElementById("alertbox_tresc_id");
            var ile = alertbox_tresc.getElementsByTagName("input").length;
            var m;
            var alert_kto = alertbox_tresc.getElementsByTagName("input");

            for(m=0;m<=ile;m++)
            {
                if(alert_kto[m] != undefined)
                {
                    if(alert_kto[m].checked == true && alert_kto[m].parentElement.style.display != "none")
                    {
                        sessionStorage.setItem(alert_kto[m].id + "_" + alertbox_tresc.getElementsByClassName("task")[m].innerText,"ignore");
                        document.getElementById("p_" + alert_kto[m].id).style.display = "none";
                    }
                }
            }

            SprawdzCzySchowac();
        }

        function Ignore_all (zEvent)
        {
            var alertbox_tresc = document.getElementById("alertbox_tresc_id");
            var ile = alertbox_tresc.getElementsByTagName("input").length;
            var m;
            var alert_kto = alertbox_tresc.getElementsByTagName("input");

            for(m=0;m<=ile;m++)
            {
                if(alert_kto[m] != undefined)
                {
                    if(alert_kto[m].parentElement.style.display != "none")
                    {
                        sessionStorage.setItem(alert_kto[m].id + "_" + alertbox_tresc.getElementsByClassName("task")[m].innerText,"ignore");
                        document.getElementById("p_" + alert_kto[m].id).style.display = "none";
                    }
                }
            }

            SprawdzCzySchowac();
        }

        function SprawdzCzySchowac()
        {
            var schowaj = true;
            var ile = document.getElementById("alertbox_tresc_id").getElementsByTagName("input").length;

            for(var m=0;m<ile;m++)
            {
                if(document.getElementById("alertbox_tresc_id").getElementsByTagName("input")[m].parentElement.style.display != "none")
                {
                    schowaj = false;
                }
            }

            if(schowaj == true)
            {
                document.getElementById("alertbox_div").style.display = "none";
                onTimer();
            }
        }


        function by_manager_button (zEvent)
        {
            var checkExist = setInterval(function()
                                         {
                var iframe = document.getElementById('infobox_hidden_iframe');
                var innerDoc = iframe.contentDocument || iframe.contentWindow.document;

                if (innerDoc.getElementsByClassName("sortable employeeList result-table")[0] != undefined )
                {
                    var ile = innerDoc.getElementsByClassName("sortable employeeList result-table")[0].children[1].children.length;
                    var managers = [];
                    var unique_managers = [];

                    for(var i = 0;i<=ile;i++)
                    {
                        if(innerDoc.getElementsByClassName("sortable employeeList result-table")[0].children[1].children[i] != undefined)
                        {
                            managers[i] = innerDoc.getElementsByClassName("sortable employeeList result-table")[0].children[1].children[i].innerText;
                            managers[i] = managers[i].replace("\n\t\t\t\t\t","");
                            managers[i] = managers[i].replace("\n\n\t\t\t\t\t","");
                        }
                    }

                    unique_managers = managers.filter(onlyUnique);
                    unique_managers = unique_managers.sort();

                    if(document.getElementById("infobox_tresc_id").innerHTML == "")
                    {
                        document.getElementById("infobox_tresc_id").innerHTML = "";

                        for(l=0;l<unique_managers.length;l++)
                        {
                            if(unique_managers[l] != "")
                            {
                                if(sessionStorage.getItem(unique_managers[l]) == "true" || localStorage.getItem(unique_managers[l]) == "true")
                                {
                                    document.getElementById("infobox_tresc_id").innerHTML += '<input type="checkbox" checked="true" id="' + unique_managers[l] + '" />' + unique_managers[l] + '<br>';
                                }
                                else
                                {
                                    document.getElementById("infobox_tresc_id").innerHTML += '<input type="checkbox" id="' + unique_managers[l] + '" />' + unique_managers[l] + '<br>';
                                }
                            }
                        }

                        document.getElementById("infobox_bottom_id").innerHTML += '<div style="display:-webkit-inline-box;"><input type="button" id="manager_checked" value="RUN" style="float:left;" />&nbsp;' +
                            '<p id="status" style="background-size:16px 17px;width:16px;height:16px;" />' +
                            '<div id="mycounter"></div></div>';
                        document.getElementById("infobox_bottom_id").innerHTML += '<input type="button" id="add_manager" style="float:right;" value="Save this selection" /><br>';
                      //  document.getElementById("infobox_bottom_id").innerHTML += '<div id="add_manager_div" style="display:none;float:right;"><input type="textbox" id="manager_name" style="float:right;" /></div>';// +
                            //'<input type="button" id="add_manager_button" value="Add" /></div>';

                        document.getElementById ("manager_checked").addEventListener (
                            "click", manager_checked, false
                        );
                        document.getElementById ("add_manager").addEventListener (
                            "click", add_manager_div, false
                        );
                        // document.getElementById ("add_manager_button").addEventListener (
                        //     "click", add_manager, false
                        // );
                    }

                    clearInterval(checkExist);
                }
                else
                {

                }
            }, 500);
        }


        function download_manager_list(zEvent)
        {
            var iframe = document.getElementById('infobox_hidden_iframe');
            var innerDoc = iframe.contentDocument || iframe.contentWindow.document;

            var ile = innerDoc.getElementsByClassName("sortable employeeList result-table")[0].children[1].children.length;
            var managers = [];
            var unique_managers = [];

            for(var i = 0;ile;i++)
            {
                managers[i] = innerDoc.getElementsByClassName("sortable employeeList result-table")[0].children[1].children[i].innerText;
            }

            unique_managers = managers.filter(onlyUnique);

            // console.log(unique_managers);
            // console.log(unique_managers[0]);
            // console.log(unique_managers[1]);
        }

        function gra_w_zielone(zEvent)
        {
            zEvent.target.style.backgroundColor = "yellowgreen";

            setTimeout(function() {
                zEvent.target.style.backgroundColor = "";
            },2000);
        }

        function localstorage_remove(zEvent)
        {
            gra_w_zielone(zEvent);

            var t = 0;
            for(var i = 0; i <= 5000 ; i++)
            {
                if(localStorage.key(t) != undefined && (localStorage.getItem(localStorage.key(t)) == "false" || localStorage.getItem(localStorage.key(t)) == "true"))
                {
                    localStorage.removeItem(localStorage.key(t));
                }
                else
                {
                    t++;
                }
            }
        }



        function add_manager_div (zEvent)
        {
            gra_w_zielone(zEvent);
            var checked = false;

            for(i=0;i<=$("input:checkbox").length;i++)
            {
                if($("input:checkbox")[i] != undefined)
                {
                    if($("input:checkbox")[i].id != "adjust_plan_checkbox" && $("input:checkbox")[i].id != "empty_lines_checkbox")
                    {
                        if($("input:checkbox")[i].checked == true)
                        {
                            localStorage.setItem($("input:checkbox")[i].id,true);
                            checked = true;
                        }
                        else
                        {
                            localStorage.setItem($("input:checkbox")[i].id,false);
                        }
                    }
                }
            }


            if(checked == true)
            {
                localStorage.setItem("Taskmaster_run",true);
                localStorage.setItem("Taskmaster_checked", true);
            }



            // if(document.getElementById("add_manager_div").style.display == "none")
            // {
            //     document.getElementById("add_manager_div").style.display = "flex";
            // }
            // else
            // {
            //     document.getElementById("add_manager_div").style.display = "none";
            // }
        }

        function add_manager (zEvent)
        {

          

            //         var manager_name = document.getElementById("manager_name").value;
            //         if(document.getElementById("manager_name").value != "")
            //         {
            //             if(document.getElementById(manager_name) == undefined)
            //             {
            //                 document.getElementById("infobox_tresc_id").innerHTML += '<input type="checkbox" checked="true" id="' + manager_name + '" />' + manager_name + '<br>';

            //                 var added_manager = sessionStorage.getItem("added_manager");
            //                 if(added_manager == null)
            //                 {
            //                     sessionStorage.setItem("added_manager",manager_name);
            //                 }
            //                 else
            //                 {
            //                     added_manager = added_manager + ";" + manager_name;
            //                     sessionStorage.setItem("added_manager",added_manager);
            //                 }

            //                 document.getElementById("manager_name").value = "";
            //                 document.getElementById("add_manager_div").style.display = "none";
            //             }
            //         }
        }

        // RUN
        function manager_checked (zEvent)
        {
            sessionStorage.setItem("Taskmaster_type","by_manager");
            var checked = false;

            for(i=0;i<=$("input:checkbox").length;i++)
            {
                if($("input:checkbox")[i] != undefined)
                {
                    if($("input:checkbox")[i].id != "adjust_plan_checkbox" && $("input:checkbox")[i].id != "empty_lines_checkbox")
                    {
                        if($("input:checkbox")[i].checked == true)
                        {
                            sessionStorage.setItem($("input:checkbox")[i].id,true);
                            checked = true;
                        }
                        else
                        {
                            sessionStorage.setItem($("input:checkbox")[i].id,false);
                        }
                    }
                }
            }

            if(checked == true)
            {
                document.getElementById("manager_checked").disabled = true
                sessionStorage.setItem("Taskmaster_checked", true);
                sessionStorage.setItem("Taskmaster_run",true);
                window.location.reload();
            }
            else
            {
                document.getElementById("manager_checked").disabled = true
                sessionStorage.setItem("Taskmaster_checked", false);
                window.location.reload();
            }
        }

        function by_aa_list (zEvent)
        {

            //     document.getElementById("infobox_chime").src =

            //         var iframe = document.getElementById('infobox_hidden_iframe');
            //         var innerDoc = iframe.contentDocument || iframe.contentWindow.document;

            //         var ile = innerDoc.getElementsByClassName("sortable employeeList result-table")[0].children[1].children.length;
            //         var managers = [];
            //         var unique_managers = [];

            //         for(var i = 0;i<=ile;i++)
            //         {
            //             if(innerDoc.getElementsByClassName("sortable employeeList result-table")[0].children[1].children[i] != undefined)
            //             {
            //                 managers[i] = innerDoc.getElementsByClassName("sortable employeeList result-table")[0].children[1].children[i].innerText;
            //                 managers[i] = managers[i].replace("\n\t\t\t\t\t","");
            //                 managers[i] = managers[i].replace("\n\n\t\t\t\t\t","");
            //             }
            //         }

            //         unique_managers = managers.filter(onlyUnique);
            //         unique_managers = unique_managers.sort();

            //         if(document.getElementById("infobox_tresc_id").innerHTML == "")
            //         {
            //             for(l=0;l<unique_managers.length - 1;l++)
            //             {
            //                 if(sessionStorage.getItem(unique_managers[l]) == "true")
            //                 {
            //                     document.getElementById("infobox_tresc_id").innerHTML += '<input type="checkbox" checked="true" id="' + unique_managers[l] + '" />' + unique_managers[l] + '<br>';
            //                 }
            //                 else
            //                 {
            //                     document.getElementById("infobox_tresc_id").innerHTML += '<input type="checkbox" id="' + unique_managers[l] + '" />' + unique_managers[l] + '<br>';
            //                 }
            //             }

            //             document.getElementById("infobox_bottom_id").innerHTML += '<div style="display:-webkit-inline-box;"><input type="button" id="manager_checked" value="RUN" style="float:left;" />&nbsp;' +
            //                 '<p id="status" style="background-size:16px 17px;width:16px;height:16px;" />' +
            //                 '<div id="mycounter"></div></div>';
            //             document.getElementById("infobox_bottom_id").innerHTML += '<input type="button" id="add_manager" style="float:right;" value="My Manager is not listed" /><br>';
            //             document.getElementById("infobox_bottom_id").innerHTML += '<div id="add_manager_div" style="display:none;float:right;"><input type="textbox" id="manager_name" style="float:right;" />' +
            //                 '<input type="button" id="add_manager_button" value="Add" /></div>';

            //             document.getElementById ("manager_checked").addEventListener (
            //                 "click", manager_checked, false
            //             );
            //             document.getElementById ("add_manager").addEventListener (
            //                 "click", add_manager_div, false
            //             );
            //             document.getElementById ("add_manager_button").addEventListener (
            //                 "click", add_manager, false
            //             );
            //         }
        }

        // Jezeli dodano managera z palca:
        var added_manager = sessionStorage.getItem("added_manager");
        if(added_manager != null)
        {
            if (added_manager.indexOf(';') > -1)
            {
                var dodani = added_manager.split(";");

                for(i=0;i<dodani.length;i++)
                {
                    document.getElementById("infobox_tresc_id").innerHTML += '<input type="checkbox" checked="true" id="' + dodani[i] + '" />' + dodani[i] + '<br>';
                }
            }
            else
            {
                document.getElementById("infobox_tresc_id").innerHTML += '<input type="checkbox" checked="true" id="' + added_manager + '" />' + added_manager + '<br>';
            }
        }
    }

    // dla iFrame na Chime
    if(window.location.href.indexOf("https://hooks.chime.aws") > -1)
    {
        var webhook = GM_config.get('chime_webhook');
        if(webhook != "" && webhook != undefined)
        {
            // Iframe JS
            var guzior = document.createElement ('div');
            guzior.innerHTML = '<input type="button" id="guzior_id" value="guzik"></input>';

            // var script = document.createElement ('script');
            // script.type = "text/javascript";
            // script.src = 'javascript:function chimechime() { var xhr = new XMLHttpRequest(); ' +
            //     'var url = ""; ' +
            //     'xhr.open("POST", url, true); xhr.setRequestHeader("Content-Type", "application/JSON"); ' +
            //     'var data = JSON.stringify({"Content": "Test wiadomosci elo elo"}); xhr.send(data); };'
            // document.getElementsByTagName("body")[0].appendChild(script);
            document.getElementsByTagName("body")[0].appendChild(guzior);

            document.getElementById ("guzior_id").addEventListener (
                "click", guzior_event, false
            );

            function guzior_event (zEvent)
            {
                var xhr = new XMLHttpRequest();
                var url = webhook;
                xhr.open("POST", url, true);
                xhr.setRequestHeader("Content-Type", "application/JSON");
                var data = JSON.stringify({"Content": wiadomosc});
                xhr.send(data);
            }

            var interval_chime = setInterval(function(){
                if(GM_config.get('Czy_alert') == true)
                {
                    wiadomosc = GM_config.get('Wiadomosc');

                    GM_config.set('Czy_alert', false);
                    GM_config.set('Wiadomosc', "");
                    GM_config.save();

                    document.getElementById ("guzior_id").click();
                    clearInterval(interval_chime);
                }
            },10000);
        }
    }


},3000);















// FUNKCJE

function htmlToElements(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.childNodes;
}

function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();

    // Change this to div.childNodes to support multiple top-level nodes.
    return div.firstChild;
}

var getFromBetween = {
    results:[],
    string:"",
    getFromBetween:function (sub1,sub2) {
        if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
        var SP = this.string.indexOf(sub1)+sub1.length;
        var string1 = this.string.substr(0,SP);
        var string2 = this.string.substr(SP);
        var TP = string1.length + string2.indexOf(sub2);
        return this.string.substring(SP,TP);
    },
    removeFromBetween:function (sub1,sub2) {
        if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
        var removal = sub1+this.getFromBetween(sub1,sub2)+sub2;
        this.string = this.string.replace(removal,"");
    },
    getAllResults:function (sub1,sub2) {
        // first check to see if we do have both substrings
        if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return;

        // find one result
        var result = this.getFromBetween(sub1,sub2);
        // push it to the results array
        this.results.push(result);
        // remove the most recently found one from the string
        this.removeFromBetween(sub1,sub2);

        // if there's more substrings
        if(this.string.indexOf(sub1) > -1 && this.string.indexOf(sub2) > -1) {
            this.getAllResults(sub1,sub2);
        }
        else return;
    },
    get:function (string,sub1,sub2) {
        this.results = [];
        this.string = string;
        this.getAllResults(sub1,sub2);
        return this.results;
    }
};

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function toUniqueArray(a){
    var newArr = [];
    for (var i = 0; i < a.length; i++) {
        if (newArr.indexOf(a[i]) === -1) {
            newArr.push(a[i]);
        }
    }
  return newArr;
}

function sortFunction(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] < b[0]) ? -1 : 1;
    }
}

var z = localStorage.getItem("refresh_rate");

if(z == undefined || z == "")
{
    z = 60;
}

function onTimer() {
    var checkExist = setInterval(function() {
        if (document.getElementById('status') != undefined)
        {
            document.getElementById('status').innerHTML = z;
            z--;
            if (z < 0) {
                window.location.reload();
            }
            else {
                setTimeout(onTimer, 1000);
            }
            clearInterval(checkExist);
        }
    },100);
}

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }

}
