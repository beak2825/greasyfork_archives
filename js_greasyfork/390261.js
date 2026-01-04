// ==UserScript==
// @name         Problem Solve Checker
// @namespace    http://tampermonkey.net/
// @version      1
// @description  try to take over the world!
// @author       NOWARATN
// @match        https://rodeo-dub.amazon.com/KTW1/ExSD?yAxis=*
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/390261/Problem%20Solve%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/390261/Problem%20Solve%20Checker.meta.js
// ==/UserScript==

// Zmienne
GM_config.init(
{
    'id': 'ProblemSolve_checker',
    'title': 'Problem Solve Checker',
    'fields':
    {
        'ps_powyzej_checkbox':
        {
            'type': 'checkbox',
        },
        'ps_powyzej_text':
        {
            'type': 'text',
        },
        'ps_coile_checkbox':
        {
            'type': 'checkbox',
        },
        'ps_coile_text':
        {
            'type': 'text',
        },
        'ps_coileunitow_text':
        {
            'type': 'text',
        },
        'ps_godzina_start':
        {
            'type': 'text',
        },
        'ps_ilesekund':
        {
            'type': 'text',
        },
        'ps_ileunitowbylowps':
        {
            'type': 'text',
        }

    }
});

var GM_ps_powyzej_checkbox = GM_config.get('ps_powyzej_checkbox');
var GM_ps_powyzej_text = GM_config.get('ps_powyzej_text');
var GM_ps_coile_checkbox = GM_config.get('ps_coile_checkbox');
var GM_ps_coile_text = GM_config.get('ps_coile_text');
var GM_ps_coileunitow_text = GM_config.get('ps_coileunitow_text');
var GM_ps_godzina_start = GM_config.get('ps_godzina_start');
var GM_ps_ileunitowbylowps = GM_config.get('ps_ileunitowbylowps');
var GM_ps_ilesekund = GM_config.get('ps_ilesekund');


var czy_problemsolving = false;
var start;
var teraz;
var ileunitowjestwps;

for(var i = 0;i<30;i++)
        {
            if(document.getElementsByTagName("tr")[i].children[0].innerText == "ProblemSolving")
            {
                czy_problemsolving = true;
                ileunitowjestwps = document.getElementsByTagName("tr")[i].children[3].innerText;
                console.log(ileunitowjestwps);
            }
        }

if(czy_problemsolving == false)
{ throw new Error("Ta strona nie zawiera wpisu ProblemSolving, wiec nie uruchamiam dalej programu"); }

var ps_div = document.createElement ('div');
    ps_div.innerHTML = '<input type="checkbox" id="ps_powyzej_checkbox"> Informuj, jezeli jest powyzej <input type="text" id="ps_powyzej_text" style="width:4em"> unitów w Problem Solve.<br>' +
        '<input type="checkbox" id="ps_coile_checkbox"> Sprawdzaj, czy przez ostatnie <input type="text" id="ps_coile_text" style="width:4em"> minut kolejka w Problem Solve wzrosla o <input type="text" id="ps_coileunitow_text" style="width:4em"> unitów.';
    ps_div.setAttribute('id', 'ps_checker_div');
    ps_div.setAttribute('style', 'display:block;');
    document.getElementsByClassName("process-path-title")[0].appendChild(ps_div);

var ps_alert_div = document.createElement ('div');
    ps_alert_div.setAttribute('id', 'ps_alert_div');
    ps_alert_div.innerHTML = '<center><font size="40" color="black"><div id="alert_tresc"></div></font><br><input type="button" id="ps_alert_ok" value="OK" style="font-size:40px;">';
    ps_alert_div.setAttribute('style', 'display:none;position:absolute;z-index:9999;');
    document.getElementsByClassName("process-path-title")[0].appendChild(ps_alert_div);

var ps_info_div = document.createElement ('div');
    ps_info_div.setAttribute('id', 'ps_info_div');
    ps_info_div.setAttribute('style', 'display:block;');
    document.getElementsByClassName("process-path-title")[0].appendChild(ps_info_div);


if(GM_ps_powyzej_checkbox == true) { document.getElementById("ps_powyzej_checkbox").checked = true; };
if(GM_ps_coile_checkbox == true) { document.getElementById("ps_coile_checkbox").checked = true; };
if(GM_ps_powyzej_text != "") { document.getElementById("ps_powyzej_text").value = GM_ps_powyzej_text; };
if(GM_ps_coile_text != "") { document.getElementById("ps_coile_text").value = GM_ps_coile_text; };
if(GM_ps_coileunitow_text != "") { document.getElementById("ps_coileunitow_text").value = GM_ps_coileunitow_text; };


document.getElementById("ps_powyzej_checkbox").addEventListener (
    "click", ButtonClick_ps_powyzej_checkbox, false
);

document.getElementById("ps_coile_checkbox").addEventListener (
    "click", ButtonClick_ps_coile_checkbox, false
);

document.getElementById("ps_alert_ok").addEventListener (
    "click", ButtonClick_ps_alert_ok, false
);

function ButtonClick_ps_powyzej_checkbox (zEvent)
{
    if(document.getElementById("ps_powyzej_checkbox").checked == true)
    {
        GM_config.set('ps_powyzej_checkbox', true);
        GM_config.save();
    }
    else
    {
        GM_config.set('ps_powyzej_checkbox', false);
        GM_config.save();
    }
}

function ButtonClick_ps_coile_checkbox (zEvent)
{
    if(document.getElementById("ps_coile_checkbox").checked == true)
    {
        start = Math.floor(Date.now() / 1000);
        start = parseFloat(start);

        GM_config.set('ps_coile_checkbox', true);
        GM_config.set('ps_godzina_start', start);
        GM_config.save();

    }
    else
    {
        GM_config.set('ps_godzina_start', "");
        GM_config.set('ps_coile_checkbox', false);
        GM_config.save();
    }
}

function ButtonClick_ps_alert_ok (zEvent)
{
    document.getElementById("ps_alert_div").style = "display:none;"
}

document.getElementById("ps_powyzej_text").addEventListener("keyup", function(event) {
                    event.preventDefault();
                    if (event.keyCode != 0) {
                        var temp = document.getElementById("ps_powyzej_text").value;
                        GM_config.set('ps_powyzej_text', temp);
                        GM_config.save();}
                    });

document.getElementById("ps_coile_text").addEventListener("keyup", function(event) {
                    event.preventDefault();
                    if (event.keyCode != 0) {
                        var temp = document.getElementById("ps_coile_text").value;
                        GM_config.set('ps_coile_text', temp);
                        GM_config.save();}
                    });

document.getElementById("ps_coileunitow_text").addEventListener("keyup", function(event) {
                    event.preventDefault();
                    if (event.keyCode != 0) {
                        var temp = document.getElementById("ps_coileunitow_text").value;
                        GM_config.set('ps_coileunitow_text', temp);
                        GM_config.set('ps_ileunitowbylowps', ileunitowjestwps);
                        GM_config.save();}
                    });



if(document.getElementById("ps_powyzej_checkbox").checked == true)
{
    if(GM_ps_powyzej_text != "")
    {
        if(parseInt(ileunitowjestwps) > parseInt(GM_ps_powyzej_text))
        {
            document.getElementById("alert_tresc").innerText = 'Jest ponad \r\n' + ileunitowjestwps + "\r\n\w ProblemSolving!";
            document.getElementById("ps_alert_div").setAttribute('style', 'background-color:red;display:block;position:absolute;z-index:9999;top:40%;left:20%;padding:50px;')
        }
    }
}

if(document.getElementById("ps_coile_checkbox").checked == true)
{
    teraz = Math.floor(Date.now() / 1000);
    teraz = parseFloat(teraz);

    document.getElementById("ps_info_div").innerText = "TERAZ     vs    BYLO\r\n";
    document.getElementById("ps_info_div").innerText += teraz + " vs " + GM_ps_godzina_start + "\r\n";
    document.getElementById("ps_info_div").innerText += unixto(teraz) + " vs " + unixto(GM_ps_godzina_start) + "\r\n";
    document.getElementById("ps_info_div").innerText += ileunitowjestwps + " vs " + GM_ps_ileunitowbylowps;

    if(GM_ps_godzina_start != "")
    {
        var sekundy = parseInt(GM_ps_coile_text) * 60;
        var roznica = ileunitowjestwps - parseInt(GM_ps_ileunitowbylowps);
        console.log(sekundy);
        if(teraz > (parseInt(GM_ps_godzina_start) + sekundy) || ileunitowjestwps >  parseInt(GM_ps_ileunitowbylowps) + parseInt(GM_ps_coileunitow_text))
        {
            if(ileunitowjestwps >  parseInt(GM_ps_ileunitowbylowps) + parseInt(GM_ps_coileunitow_text))
            {
                window.blur();
                window.focus();
                var temp = document.getElementById("ps_alert_div").innerHtml;
                document.getElementById("alert_tresc").innerText = 'Ilosc unitow w ProblemSolving wzrosla o: \r\n' + roznica + "\r\n\w ciagu " + sekundy/60 + " minut/y";
                document.getElementById("ps_alert_div").setAttribute('style', 'background-color:red;display:block;position:absolute;z-index:9999;top:40%;left:20%;padding:50px;')

              //  var ans = confirm("Ilosc unitow w PS wzrosla o " + (ileunitowjestwps - parseInt(GM_ps_ileunitowbylowps)) + " w ciagu " + (parseInt(sekundy) / 60) + " minut/y");
            }

            GM_config.set('ps_ileunitowbylowps', ileunitowjestwps);
            GM_config.set('ps_godzina_start', teraz);
            GM_config.save();
        }
        else if(ileunitowjestwps >  parseInt(GM_ps_ileunitowbylowps) + parseInt(GM_ps_coileunitow_text))
        {
            GM_config.set('ps_ileunitowbylowps', ileunitowjestwps);
            GM_config.set('ps_godzina_start', teraz);
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