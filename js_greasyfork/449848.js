// ==UserScript==
// @name         Problem Solverer
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Count units for Problem Solve
// @author       @nowaratn
// @match        https://rodeo-dub.amazon.com/KTW1/ItemList?_enabledColumns=on&WorkPool=ProblemSolving*
// @match        https://hooks.chime.aws
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/449848/Problem%20Solverer.user.js
// @updateURL https://update.greasyfork.org/scripts/449848/Problem%20Solverer.meta.js
// ==/UserScript==

GM_config.init(
    {
        'id': 'Problem_Solverer',
        'title': 'Problem_Solverer config',
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

var audio = new Audio();
(function() {

    var wiadomosc;
    var czy_alert = GM_config.get('Czy_alert');
    var chime_webhook = GM_config.get('chime_webhook');

    // jeżeli na stronie RODEO
    if(window.location.href.indexOf("https://rodeo-dub.amazon.com/KTW1/ItemList") > -1)
    {
        var problem_solver_menu = document.createElement('div');
        problem_solver_menu.innerHTML = '<img src="https://drive-render.corp.amazon.com/view/nowaratn@/clock.png" /><div id="status" style="width:2em;margin-left:5px;" title="Czas pozostały do odświeżenia strony"></div>' +
            '<img src="https://drive.corp.amazon.com/view/nowaratn@/package.png" /><div id="ps_count" style="width:2em;margin-left:5px;" title="Obecna ilość paczek dla PS"></div>' +

            '<div id="refresh_status" style="cursor:pointer;">' +
            '<img id="problem_solver_menu_button" src="https://drive-render.corp.amazon.com/view/nowaratn@/megaphone.png" style="width:24px;height:24px;background-repeat:round;"/>' +
            '<span id="refresh_status_text" style="font-weight:bolder;margin-left:5px;">OFF</span>' +
            '</div>' +

            '<div id="ps_menu_box" style="display:none;background-color:white;z-index:999;position:fixed;left:20px;top:15%;">' +
            '<table rules="all" style="border-collapse:collapse;border: 1px solid black;">' +
            '<tr><td style="padding:5px;">Auto-sprawdzanie co X sekund</td><td style="padding:5px;"><input type="text" id="ps_refresh_rate" style="width:35px;" value="60"/><input id="ps_checkbox" type="checkbox" title="Zaznacz, aby strona automatycznie sprawdzała stan Chute co X minut" /></td></tr>' +
            '<tr><td style="padding:5px;">Powiadom jeżeli więcej niż</td><td style="padding:5px;"><input type="text" id="ps_powyzej" style="width:35px;" value="5"/> unitów</td></tr>' +
            '<tr><td style="padding:5px;">Powiadomienie dźwiękowe</td>' +
            '<td style="padding:5px;"><select id="ps_sound">' +
            '<option value="default">#1</option>' +
            '<option value="buzzer">#2</option>' +
            '<option value="cat">#3</option>' +
            '<option value="cow">#4</option>' +
            '<option value="onion">#5</option>' +
            '<option value="tada">#6</option>' +
            '<option value="train">#7</option>' +
            '<option value="warning">#8</option>' +
            '<option value="intro">#9</option>' +
            '</select><input type="checkbox" id="ps_soundalert" /></td></tr>' +
            '<tr><td style="padding:5px;"><a style="cursor:help;" title="Naciśnij aby przejść na stronę Wikipedii" href="https://w.amazon.com/bin/view/Users/nowaratn/TaskMaster/Chime_webhook_URL/" target="_blank">Chime Webhook</a> URL</td><td><input type="text" id="ps_webhook" style="width:100%;" value=""/></td></tr>' +
            '<tr><td style="border:white;padding:10px;"><input id="ps_menu_save" type="button" value="Zapisz" style="cursor:pointer"/></td></tr>' +
            '</table>' +
            '<iframe style="display:none;" id="infobox_chime" src="https://hooks.chime.aws" ></iframe></div>';
        problem_solver_menu.setAttribute ('id', 'ps_div');
        problem_solver_menu.setAttribute ('class', '');
        problem_solver_menu.setAttribute ('style', 'float:left;margin-left:20px;display:flex;border:black;border-style:solid;padding:2px;');
        document.getElementById("content-panel-padding").insertBefore(problem_solver_menu, document.getElementById("content-panel-padding").getElementsByClassName("csv-excel-links")[0]);

        document.getElementById ("refresh_status").addEventListener (
            "click", problem_solver_menu_action, false
        );

        problem_solver_menu = null;

        document.getElementById ("ps_menu_save").addEventListener (
            "click", menu_save, false
        );

        document.getElementById ("ps_sound").addEventListener (
            "change", menu_sound, false
        );


        if(localStorage.getItem("ps_powyzej") != undefined)
        {
            document.getElementById("ps_powyzej").value = localStorage.getItem("ps_powyzej")
        }

        if(localStorage.getItem("ps_webhook") != undefined)
        {
            document.getElementById("ps_webhook").value = localStorage.getItem("ps_webhook")
        }

        if(localStorage.getItem("ps_refresh") == "true")
        {
            document.getElementById("ps_checkbox").checked = true;
            document.getElementById("refresh_status_text").innerText = "ON";
            document.getElementById("refresh_status_text").style.color = "yellowgreen";
            onTimer();
        }
        else
        {
            document.getElementById("ps_checkbox").checked = false;
            document.getElementById("refresh_status_text").innerText = "OFF";
            document.getElementById("refresh_status_text").style.color = "red";
            clearInterval(checkExist);
        }
        if(localStorage.getItem("ps_refresh_rate") != undefined && localStorage.getItem("ps_refresh_rate") != null)
        {
            document.getElementById("ps_refresh_rate").value = localStorage.getItem("ps_refresh_rate");
        }
        if(localStorage.getItem("ps_soundalert") == "true")
        {
            document.getElementById("ps_soundalert").checked = true;
        }

        if(localStorage.getItem("ps_sound_type") == "default")
        { document.getElementById("ps_sound").selectedIndex = 0;
         audio = new Audio('https://drive.corp.amazon.com/view/nowaratn@/Red%20Alert-SoundBible.com-108009997.mp3'); }

        if(localStorage.getItem("ps_sound_type") == "buzzer")
        { document.getElementById("ps_sound").selectedIndex = 1;
         audio = new Audio('https://drive.corp.amazon.com/view/nowaratn@/Chute_Checker/BUZZER.mp3'); }

        if(localStorage.getItem("ps_sound_type") == "cat")
        { document.getElementById("ps_sound").selectedIndex = 2;
         audio = new Audio('https://drive.corp.amazon.com/view/nowaratn@/Chute_Checker/CAT_MEOW.mp3'); }

        if(localStorage.getItem("ps_sound_type") == "cow")
        { document.getElementById("ps_sound").selectedIndex = 3;
         audio = new Audio('https://drive.corp.amazon.com/view/nowaratn@/Chute_Checker/COW_MOO.mp3'); }

        if(localStorage.getItem("ps_sound_type") == "onion")
        { document.getElementById("ps_sound").selectedIndex = 4;
         audio = new Audio('https://drive.corp.amazon.com/view/nowaratn@/Chute_Checker/ONION.mp3'); }

        if(localStorage.getItem("ps_sound_type") == "tada")
        { document.getElementById("ps_sound").selectedIndex = 5;
         audio = new Audio('https://drive.corp.amazon.com/view/nowaratn@/Chute_Checker/TA_DA.mp3'); }

        if(localStorage.getItem("ps_sound_type") == "train")
        { document.getElementById("ps_sound").selectedIndex = 6;
         audio = new Audio('https://drive.corp.amazon.com/view/nowaratn@/Chute_Checker/TRAIN_WHISTLE.mp3'); }

        if(localStorage.getItem("ps_sound_type") == "warning")
        { document.getElementById("ps_sound").selectedIndex = 7;
         audio = new Audio('https://drive.corp.amazon.com/view/nowaratn@/Chute_Checker/WARNING_SIREN.mp3'); }

        if(localStorage.getItem("ps_sound_type") == "intro")
        { document.getElementById("ps_sound").selectedIndex = 8;
         audio = new Audio('https://drive.corp.amazon.com/view/nowaratn@/Chute_Checker/intro.mp3'); }



        setTimeout(function() {
            background_worker();
        },1000);
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

})();

var z = localStorage.getItem("ps_refresh_rate");
if(z == undefined || z == "")
{
    z = 60;
}
var checkExist;

function onTimer() {
    checkExist = setInterval(function() {
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

async function background_worker(){

    for (var i = 0;i<100000000000;i++)
    {
        var refresh;
        var refresh_rate;
        refresh = localStorage.getItem("ps_refresh");
        refresh_rate = localStorage.getItem("ps_refresh_rate");

    //    console.log(refresh);
    //    console.log(refresh_rate);

        if(refresh != undefined && refresh == "true")
        {
            ps_check();
        }

        if(refresh_rate != undefined)
        {
            await sleep(refresh_rate * 60 * 1000);
            location.reload();
        }
        else
        {
            await sleep(3 * 60 * 1000);
            location.reload();
        }

        refresh = null;
        refresh_rate = null;
    }
}

async function ps_check()
{
    var soundalert = localStorage.getItem("ps_soundalert");
    var ProcessPath;
    var condition;
    var count = 0;
    // Najpierw sprawdź gdzie są odpowiednie kolumny
    for(var j = 0;j<=document.getElementsByClassName("result-table shipment-list tablesorter")[0].getElementsByTagName("tr")[0].children.length;j++)
    {
        if(document.getElementsByClassName("result-table shipment-list tablesorter")[0].getElementsByTagName("tr")[0].children[j] != undefined)
        {
            if(document.getElementsByClassName("result-table shipment-list tablesorter")[0].getElementsByTagName("tr")[0].children[j].innerText == "Process Path")
            {
                ProcessPath = j;
            }

            if(document.getElementsByClassName("result-table shipment-list tablesorter")[0].getElementsByTagName("tr")[0].children[j].innerText == "Condition")
            {
                condition = j;
            }
        }
    }

    for(var i = 1;i<=document.getElementsByClassName("result-table shipment-list tablesorter")[0].getElementsByTagName("tr").length;i++)
    {
        // jeżeli nie FracsDamageMulti
        if(document.getElementsByClassName("result-table shipment-list tablesorter")[0].getElementsByTagName("tr")[i] != undefined)
        {
            if(document.getElementsByClassName("result-table shipment-list tablesorter")[0].getElementsByTagName("tr")[i].children[ProcessPath].innerText != "PPFracsDamageMulti")
            {
                // jeżeli nie c4, c5, c7
                var kondycja = document.getElementsByClassName("result-table shipment-list tablesorter")[0].getElementsByTagName("tr")[i].children[condition].innerText;
                if(kondycja != "4" && kondycja != "5" && kondycja != "7")
                {
                    count++;
                }
            }
        }
    }

    document.getElementById("ps_count").innerHTML = count;
    if(parseInt(count) >= parseInt(document.getElementById("ps_powyzej").value))
    {
        document.getElementById("ps_count").style.color = "red";
        if(soundalert == "true")
        {
        //    console.log("muzyczka");
            audio.play();
        }
    }

    if(parseInt(count) >= 1000 && parseInt(count) != localStorage.getItem('ile_bylo'))
    {
        GM_config.set('Czy_alert', true);
        GM_config.set('Wiadomosc', ":red_circle::warning::red_circle: Kolejka w PS przekroczyła 1000 i wynosi: " + count);
        GM_config.save();
        localStorage.setItem('ile_bylo', count);
    }
    else if(parseInt(count) >= 500 && parseInt(count) != localStorage.getItem('ile_bylo'))
    {
        GM_config.set('Czy_alert', true);
        GM_config.set('Wiadomosc', ":red_circle: Kolejka w PS przekroczyła 500 i wynosi: " + count);
        GM_config.save();
        localStorage.setItem('ile_bylo', count);
    }
    else if(parseInt(count) >= 300 && parseInt(count) != localStorage.getItem('ile_bylo'))
    {
        GM_config.set('Czy_alert', true);
        GM_config.set('Wiadomosc', ":warning: Kolejka w PS przekroczyła 300 i wynosi: " + count);
        GM_config.save();
        localStorage.setItem('ile_bylo', count);
    }


    soundalert = null;
    ProcessPath = null
    condition = null;
    count = null;
    i = null;
    j = null;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function menu_save(){
    var refresh = document.getElementById("ps_checkbox").checked;
    var refresh_rate = document.getElementById("ps_refresh_rate").value;
    var soundalert = document.getElementById("ps_soundalert").checked;
    var sound_type = document.getElementById("ps_sound").value;
    var ps_powyzej = document.getElementById("ps_powyzej").value;
    var ps_webhook = document.getElementById("ps_webhook").value;

    localStorage.setItem("ps_refresh",refresh);
    localStorage.setItem("ps_refresh_rate",refresh_rate);
    localStorage.setItem("ps_soundalert",soundalert);
    localStorage.setItem("ps_sound_type",sound_type);
    localStorage.setItem("ps_powyzej",ps_powyzej);
    localStorage.setItem("ps_webhook",ps_webhook);

    GM_config.set('chime_webhook',ps_webhook);
    GM_config.save();

    document.getElementById("ps_menu_box").style.display = "none";
    if(refresh == false)
    {
        document.getElementById("refresh_status_text").innerText = "OFF";
        document.getElementById("refresh_status_text").style.color = "red";
    }
    else
    {
        document.getElementById("refresh_status_text").innerText = "ON";
        document.getElementById("refresh_status_text").style.color = "yellowgreen";
    }


    refresh = null;
    refresh_rate = null;
    soundalert = null;
    sound_type = null;
    ps_powyzej = null;
    ps_webhook = null;
    location.reload();
}

function menu_sound(){

    var wybor = document.getElementById("ps_sound").value;
    if(wybor == "default")
    {
        audio.pause();
        audio = new Audio('https://drive.corp.amazon.com/view/nowaratn@/Red%20Alert-SoundBible.com-108009997.mp3');
        audio.play();
    }

    if(wybor == "buzzer")
    {
        audio.pause();
        audio = new Audio('https://drive.corp.amazon.com/view/nowaratn@/Chute_Checker/BUZZER.mp3');
        audio.play();
    }

    if(wybor == "cat")
    {
        audio.pause();
        audio = new Audio('https://drive.corp.amazon.com/view/nowaratn@/Chute_Checker/CAT_MEOW.mp3');
        audio.play();
    }

    if(wybor == "cow")
    {
        audio.pause();
        audio = new Audio('https://drive.corp.amazon.com/view/nowaratn@/Chute_Checker/COW_MOO.mp3');
        audio.play();
    }
    if(wybor == "onion")
    {
        audio.pause();
        audio = new Audio('https://drive.corp.amazon.com/view/nowaratn@/Chute_Checker/ONION.mp3');
        audio.play();
    }
    if(wybor == "tada")
    {
        audio.pause();
        audio = new Audio('https://drive.corp.amazon.com/view/nowaratn@/Chute_Checker/TA_DA.mp3');
        audio.play();
    }
    if(wybor == "train")
    {
        audio.pause();
        audio = new Audio('https://drive.corp.amazon.com/view/nowaratn@/Chute_Checker/TRAIN_WHISTLE.mp3');
        audio.play();
    }
    if(wybor == "warning")
    {
        audio.pause();
        audio = new Audio('https://drive.corp.amazon.com/view/nowaratn@/Chute_Checker/WARNING_SIREN.mp3');
        audio.play();
    }
    if(wybor == "intro")
    {
        audio.pause();
        audio = new Audio('https://drive.corp.amazon.com/view/nowaratn@/Chute_Checker/intro.mp3');
        audio.play();
    }

    wybor = null;
}

async function problem_solver_menu_action()
{
    if(document.getElementById("ps_menu_box").style.display == "none")
    {
        document.getElementById("ps_menu_box").style.display = "block";
    }
    else
    {
        document.getElementById("ps_menu_box").style.display = "none";
    }
}














