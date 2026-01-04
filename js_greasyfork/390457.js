// ==UserScript==
// @name         Gladiatus Fighter
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  try to take over the world!
// @author       TomaszFromasz
// @match        https://s1-pl.gladiatus.gameforge.com/game/index.php?*
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/390457/Gladiatus%20Fighter.user.js
// @updateURL https://update.greasyfork.org/scripts/390457/Gladiatus%20Fighter.meta.js
// ==/UserScript==

GM_config.init(
{
    'id': 'Gladiatus_Fighter',
    'title': 'Gladiatus Fighter',
    'fields':
    {
        'ile_razy':
        {
            'type': 'text',
            'default': '',
        },
        'przeciwnik':
        {
            'type': 'text',
            'default': '',
        }
    }
});

var hp;
var enemy;
var i;
var tabela_przeciwnik = [];
var ile_razy = 0;
var wybrany_przeciwnik = 0;

if(GM_config.get('ile_razy') != ""){ ile_razy = GM_config.get('ile_razy'); }
if(GM_config.get('przeciwnik') != ""){ wybrany_przeciwnik = GM_config.get('przeciwnik'); }

// Jesteśmy na stronie wyprawy
if(document.getElementsByClassName("expedition_button awesome-button")[0] != null)
{
    enemy = document.getElementsByClassName("expedition_name");
    for(i=0;i<4;i++)
    {
        tabela_przeciwnik[i] = document.getElementsByClassName("expedition_name")[i].innerText;
    }

    var Fighter_div = document.createElement ('div');
    Fighter_div.innerHTML = ' <select id="przeciwnik_select"><option value="' + tabela_przeciwnik[0] +'">' + tabela_przeciwnik[0] +'</option>  <option value="' + tabela_przeciwnik[1] + '">' + tabela_przeciwnik[1] +'</option><option value="' + tabela_przeciwnik[2] + '">' + tabela_przeciwnik[2] +'</option><option value="' + tabela_przeciwnik[3] + '">' + tabela_przeciwnik[3] +'</option></select> ';
    Fighter_div.innerHTML += '<input type="textbox" id="ile_razy_atak" size="3em"></input> <input type="button" id="atakuj_button" value="atakuj"></input>';
    Fighter_div.setAttribute ('id', 'fighter_div');
    Fighter_div.setAttribute ('style', 'margin:-20px;');
    document.getElementById("mainnav").appendChild(Fighter_div);

    document.getElementById("ile_razy_atak").value = ile_razy;
    document.getElementById("przeciwnik_select").selectedIndex = wybrany_przeciwnik;


    document.getElementById ("atakuj_button").addEventListener (
        "click", ButtonClickAction, false
    );

    function ButtonClickAction (zEvent)
    {
        ile_razy = document.getElementById("ile_razy_atak").value;
        wybrany_przeciwnik = document.getElementById("przeciwnik_select").selectedIndex;

        GM_config.set('przeciwnik', wybrany_przeciwnik);
        GM_config.set('ile_razy', ile_razy);
        GM_config.save();
    }
}

if(document.getElementsByClassName("button2")[0] != null && document.getElementsByClassName("button2")[0].value == "Arena")
{
    var str = document.getElementsByTagName('html')[0].innerHTML;
    var player_id = substrInBetween(str,"var playerId","var dollId");
    player_id = substrInBetween(player_id,"      = ",";");

    console.log(player_id);
    var Arena_div = document.createElement ('div');
    Arena_div.innerHTML = '<iframe id="Gladiatus_stats" src="https://s1-pl.gladiatus.gameforge.com/game/index.php?mod=player&p=' + player_id + '"></iframe>';
    Arena_div.setAttribute ('id', 'arena_div');
    Arena_div.setAttribute ('style', 'display:none;');
    document.getElementById("footer_inner").appendChild(Arena_div);

    var Arena_staty_div = document.createElement ('div');
    Arena_staty_div.innerHTML = '';
    Arena_staty_div.setAttribute ('id', 'arena_staty_div');
    Arena_staty_div.setAttribute ('style', 'display:inline;');
    document.getElementById("charstats").parentNode.appendChild(Arena_staty_div);

    setTimeout(function() {
        var iframe = document.getElementById('Gladiatus_stats');
        var win = iframe.contentWindow; // reference to iframe's window
        var frame = iframe.contentDocument? iframe.contentDocument: iframe.contentWindow.document;

        var Twoje_staty = frame.getElementsByClassName("charstats_bg");
        var przeciwnik_staty = document.getElementsByClassName("charstats_bg");
        var z = 2;

        for(i = 0; i <= 10 ; i++)
        {
            if(Twoje_staty[i].children.length == 3)
            {
                z = 2;
            }
            else
            {
                z = 1;
            }
            document.getElementById("arena_staty_div").innerHTML += Twoje_staty[i].children[z].innerText + '<br>';

            if(parseInt(Twoje_staty[i].children[z].innerText) < parseInt(przeciwnik_staty[i].children[z].innerText))
            {
                przeciwnik_staty[i].children[z].style.color = "red";
                przeciwnik_staty[i].children[z].innerText = przeciwnik_staty[i].children[z].innerText + " / " + Twoje_staty[i].children[z].innerText;
            }
            else
            {
                przeciwnik_staty[i].children[z].style.color = "green";
                przeciwnik_staty[i].children[z].innerText = przeciwnik_staty[i].children[z].innerText + " /" + Twoje_staty[i].children[z].innerText;
            }
            z = 2;
        }
    }, 1 * 1000);
}

var interval = setInterval(function() {
    hp = document.getElementById("header_values_hp_percent").innerText; // 93%
    hp = hp.substring(0,2); // 93
    console.log(hp);

    if(hp < 20 && document.getElementById("header_values_hp_percent").innerText.length < 4)
    {
        console.log("Mało HP, czekam");
        location.reload();
    }
    if(document.getElementsByClassName("expedition_cooldown_reduce").length > 0)
    {
        if(document.getElementsByClassName("expedition_cooldown_reduce")[3].innerHTML.includes("res3.gif") == true)
        {
            clearInterval(interval);
            location.reload();
        }
    }

    // Jeżeli zwycięzca
    if(document.getElementById("reportHeader") != null)
    {
        document.getElementsByClassName("cooldown_bar_link")[0].click();
    }

    if(ile_razy >= 1)
    {
        if(document.getElementsByClassName("expedition_cooldown_reduce").length > 0)
        {
            if(document.getElementsByClassName("expedition_cooldown_reduce")[3].innerHTML.includes("expedition_points2") == false && document.getElementsByClassName("expedition_cooldown_reduce")[3].innerHTML.includes("res3.gif") == true)
            {
                console.log("Walka za rubiny? Poczekam.");
                setTimeout(function(){
                    location.reload();
                }, 60000);
            }
        }
        if(document.getElementsByClassName("section-header")[0].innerText == "---")
        {
            location.reload();
        }
        if(document.getElementsByClassName("expedition_button awesome-button")[wybrany_przeciwnik].className.includes("disabled") == false && document.getElementsByClassName("expedition_cooldown_reduce").length == 0)
        {
            ile_razy--;
            GM_config.set('ile_razy', ile_razy);
            GM_config.save();
            document.getElementsByClassName("expedition_button awesome-button")[wybrany_przeciwnik].click();
        }

    }


console.log("czekam");
},30000);

function substrInBetween(whole_str, str1, str2){
  var strlength1 = str1.length;
  return whole_str.substring(
                whole_str.indexOf(str1) + strlength1,
                whole_str.indexOf(str2)
               );

   }