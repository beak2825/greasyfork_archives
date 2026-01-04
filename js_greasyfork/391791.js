// ==UserScript==
// @name         Scanned Checker
// @namespace    http://tampermonkey.net/
// @version      1
// @description  No description.
// @author       NOWARATN
// @match        https://rodeo-dub.amazon.com/KTW1/ExSD?yAxis=*
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/391791/Scanned%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/391791/Scanned%20Checker.meta.js
// ==/UserScript==

// Zmienne
GM_config.init(
{
    'id': 'Scanned_checker',
    'title': 'Scanned Checker',
    'fields':
    {
        'scanned_powyzej_checkbox':
        {
            'type': 'checkbox',
        },
        'scanned_powyzej_text':
        {
            'type': 'text',
        },
        'scanned_coile_checkbox':
        {
            'type': 'checkbox',
        },
        'scanned_coile_text':
        {
            'type': 'text',
        },
        'scanned_coileunitow_text':
        {
            'type': 'text',
        },
        'scanned_godzina_start':
        {
            'type': 'text',
        },
        'scanned_ilesekund':
        {
            'type': 'text',
        },
        'scanned_ileunitowbylowps':
        {
            'type': 'text',
        }

    }
});

//var snd = new Audio('http://soundbible.com/mp3/Police-TheCristi95-214716303.mp3');

var GM_scanned_powyzej_checkbox = GM_config.get('scanned_powyzej_checkbox');
var GM_scanned_powyzej_text = GM_config.get('scanned_powyzej_text');
var GM_scanned_coile_checkbox = GM_config.get('scanned_coile_checkbox');
var GM_scanned_coile_text = GM_config.get('scanned_coile_text');
var GM_scanned_coileunitow_text = GM_config.get('scanned_coileunitow_text');
var GM_scanned_godzina_start = GM_config.get('scanned_godzina_start');
var GM_scanned_ileunitowbylowps = GM_config.get('scanned_ileunitowbylowps');
var GM_scanned_ilesekund = GM_config.get('scanned_ilesekund');


var czy_problemscanned = false;
var start;
var teraz;
var ileunitowjestwscanned;

for(var i = 0;i<30;i++)
        {
            if(document.getElementsByTagName("tr")[i].children[0].innerText == "Scanned")
            {
                czy_problemscanned = true;
                ileunitowjestwscanned = document.getElementsByTagName("tr")[i].children[1].innerText;
                console.log(ileunitowjestwscanned);
            }
        }

if(czy_problemscanned == false)
{ throw new Error("Ta strona nie zawiera wpisu ProblemSolving, wiec nie uruchamiam dalej programu"); }

var scanned_div = document.createElement ('div');
    scanned_div.innerHTML = '<input type="checkbox" id="scanned_powyzej_checkbox"> Informuj, jezeli jest powyzej <input type="text" id="scanned_powyzej_text" style="width:4em"> unitów w Scanned.<br>' +
        '<input type="checkbox" id="scanned_coile_checkbox"> Sprawdzaj, czy przez ostatnie <input type="text" id="scanned_coile_text" style="width:4em"> minut ilosc w Scanned wzrosla o <input type="text" id="scanned_coileunitow_text" style="width:4em"> unitow.<br>' +
        '<audio autoplay="true" id="alert_sound" style="display:none;" controls src="http://soundbible.com/mp3/Police-TheCristi95-214716303.mp3"></audio>';
    scanned_div.setAttribute('id', 'scanned_checker_div');
    scanned_div.setAttribute('style', 'display:block;');
    document.getElementsByClassName("process-path-title")[0].appendChild(scanned_div);

var scanned_alert_div = document.createElement ('div');
    scanned_alert_div.setAttribute('id', 'scanned_alert_div');
    scanned_alert_div.innerHTML = '<center><font size="40" color="black"><div id="alert_tresc"></div></font><br><input type="button" id="scanned_alert_ok" value="OK" style="font-size:40px;">';
    scanned_alert_div.setAttribute('style', 'display:none;position:absolute;z-index:9999;');
    document.getElementsByClassName("process-path-title")[0].appendChild(scanned_alert_div);

var scanned_info_div = document.createElement ('div');
    scanned_info_div.setAttribute('id', 'scanned_info_div');
    scanned_info_div.setAttribute('style', 'display:block;');
    document.getElementsByClassName("process-path-title")[0].appendChild(scanned_info_div);


if(GM_scanned_powyzej_checkbox == true) { document.getElementById("scanned_powyzej_checkbox").checked = true; };
if(GM_scanned_coile_checkbox == true) { document.getElementById("scanned_coile_checkbox").checked = true; };
if(GM_scanned_powyzej_text != "") { document.getElementById("scanned_powyzej_text").value = GM_scanned_powyzej_text; };
if(GM_scanned_coile_text != "") { document.getElementById("scanned_coile_text").value = GM_scanned_coile_text; };
if(GM_scanned_coileunitow_text != "") { document.getElementById("scanned_coileunitow_text").value = GM_scanned_coileunitow_text; };


document.getElementById("scanned_powyzej_checkbox").addEventListener (
    "click", ButtonClick_scanned_powyzej_checkbox, false
);

document.getElementById("scanned_coile_checkbox").addEventListener (
    "click", ButtonClick_scanned_coile_checkbox, false
);

document.getElementById("scanned_alert_ok").addEventListener (
    "click", ButtonClick_scanned_alert_ok, false
);

function ButtonClick_scanned_powyzej_checkbox (zEvent)
{
    if(document.getElementById("scanned_powyzej_checkbox").checked == true)
    {
        GM_config.set('scanned_powyzej_checkbox', true);
        GM_config.save();
    }
    else
    {
        GM_config.set('scanned_powyzej_checkbox', false);
        GM_config.save();
    }
}

function ButtonClick_scanned_coile_checkbox (zEvent)
{
    if(document.getElementById("scanned_coile_checkbox").checked == true)
    {
        start = Math.floor(Date.now() / 1000);
        start = parseFloat(start);

        GM_config.set('scanned_coile_checkbox', true);
        GM_config.set('scanned_godzina_start', start);
        GM_config.save();

    }
    else
    {
        GM_config.set('scanned_godzina_start', "");
        GM_config.set('scanned_coile_checkbox', false);
        GM_config.save();
    }
}

function ButtonClick_scanned_alert_ok (zEvent)
{
    document.getElementById("scanned_alert_div").style = "display:none;"
    snd.pause();
}

document.getElementById("scanned_powyzej_text").addEventListener("keyup", function(event) {
                    event.preventDefault();
                    if (event.keyCode != 0) {
                        var temp = document.getElementById("scanned_powyzej_text").value;
                        GM_config.set('scanned_powyzej_text', temp);
                        GM_config.save();}
                    });

document.getElementById("scanned_coile_text").addEventListener("keyup", function(event) {
                    event.preventDefault();
                    if (event.keyCode != 0) {
                        var temp = document.getElementById("scanned_coile_text").value;
                        GM_config.set('scanned_coile_text', temp);
                        GM_config.save();}
                    });

document.getElementById("scanned_coileunitow_text").addEventListener("keyup", function(event) {
                    event.preventDefault();
                    if (event.keyCode != 0) {
                        var temp = document.getElementById("scanned_coileunitow_text").value;
                        GM_config.set('scanned_coileunitow_text', temp);
                        GM_config.set('scanned_ileunitowbylowps', ileunitowjestwscanned);
                        GM_config.save();}
                    });



if(document.getElementById("scanned_powyzej_checkbox").checked == true)
{
    if(GM_scanned_powyzej_text != "")
    {
        if(parseInt(ileunitowjestwscanned) > parseInt(GM_scanned_powyzej_text))
        {
            window.focus();

            var source = "http://soundbible.com/mp3/Police-TheCristi95-214716303.mp3"
            var audio = document.createElement("audio");
            audio.autoplay = true;
            audio.load()
            audio.addEventListener("load", function() {
                audio.play();
            }, true);
            audio.src = source;

//             let data = {content: "Test321"};
//             var xhr = new XMLHttpRequest();
//             xhr.open("POST", "https://hooks.chime.aws/incomingwebhooks/c2a39ab6-8892-43e9-aa83-38d704a3140e?token=a2FaTlFreHp8MXxyY1ZnSDhxWjBiNmV3aENlZUVEcGxONVpKbGY4Qm1yX0M2YnFyQTNHRWpN", true);
//             xhr.setRequestHeader('Content-Type', 'application/json');
//             xhr.setRequestHeader('Access-Control-Allow-Origin', 'allow');

//             xhr.send(JSON.stringify(data));

            document.getElementById("alert_tresc").innerText = 'Jest ponad \r\n' + ileunitowjestwscanned + "\r\n\w Scanned!";
            document.getElementById("scanned_alert_div").setAttribute('style', 'background-color:red;display:block;position:absolute;z-index:9999;top:40%;left:20%;padding:50px;')
        }
    }
}

if(document.getElementById("scanned_coile_checkbox").checked == true)
{
    teraz = Math.floor(Date.now() / 1000);
    teraz = parseFloat(teraz);

    document.getElementById("scanned_info_div").innerText = "\r\n---------------------------\r\nTERAZ     vs    BYLO\r\n";
    document.getElementById("scanned_info_div").innerText += teraz + " vs " + GM_scanned_godzina_start + "\r\n";
    document.getElementById("scanned_info_div").innerText += unixto(teraz) + " vs " + unixto(GM_scanned_godzina_start) + "\r\n";
    document.getElementById("scanned_info_div").innerText += ileunitowjestwscanned + " vs " + GM_scanned_ileunitowbylowps;

    if(GM_scanned_godzina_start != "")
    {
        var sekundy = parseInt(GM_scanned_coile_text) * 60;
        var roznica = ileunitowjestwscanned - parseInt(GM_scanned_ileunitowbylowps);
        console.log(sekundy);
        if(teraz > (parseInt(GM_scanned_godzina_start) + sekundy) || ileunitowjestwscanned >  parseInt(GM_scanned_ileunitowbylowps) + parseInt(GM_scanned_coileunitow_text))
        {
            if(ileunitowjestwscanned >  parseInt(GM_scanned_ileunitowbylowps) + parseInt(GM_scanned_coileunitow_text))
            {
                window.blur();
                window.focus();
               // snd.play();
                var temp = document.getElementById("scanned_alert_div").innerHtml;
                document.getElementById("alert_tresc").innerText = 'Ilosc unitow w Scanned wzrosla o: \r\n' + roznica + "\r\n\w ciagu " + sekundy/60 + " minut/y";
                document.getElementById("scanned_alert_div").setAttribute('style', 'background-color:red;display:block;position:absolute;z-index:9999;top:40%;left:20%;padding:50px;')

              //  var ans = confirm("Ilosc unitow w PS wzrosla o " + (ileunitowjestwscanned - parseInt(GM_scanned_ileunitowbylowps)) + " w ciagu " + (parseInt(sekundy) / 60) + " minut/y");
            }

            GM_config.set('scanned_ileunitowbylowps', ileunitowjestwscanned);
            GM_config.set('scanned_godzina_start', teraz);
            GM_config.save();
        }
        else if(ileunitowjestwscanned >  parseInt(GM_scanned_ileunitowbylowps) + parseInt(GM_scanned_coileunitow_text))
        {
            GM_config.set('scanned_ileunitowbylowps', ileunitowjestwscanned);
            GM_config.set('scanned_godzina_start', teraz);
            GM_config.save();
        }
    }
}


function unixto(unix)
{
var date = new Date(unix*1000);
var hours = date.getHours();
var minutes = "0" + date.getMinutes();
var seconds = "0" + date.getSeconds();
var unixto = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return unixto;
}