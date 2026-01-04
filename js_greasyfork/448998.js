// ==UserScript==
// @name         Discord Downloader
// @namespace    http://tampermonkey.net/
// @version      3
// @description  mojeeeee
// @author       ja
// @match        https://darkbox.vip/forum/13-generowanie-link%C3%B3w/*
// @match        https://darkbox.vip/topic/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=darkbox.vip
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448998/Discord%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/448998/Discord%20Downloader.meta.js
// ==/UserScript==

(async function() {

    // ponieważ skrypt przypisany jest do dwóch stron (osobno dla forum z tematami, osobno dla konkretnego tematu) sprawdzamy, na której stronie skrypt się uruchomił
    if (window.location.href.indexOf("https://darkbox.vip/forum/") != -1)
    {
        var iframe_div = document.createElement ('div');
        iframe_div.innerHTML = '<div id="dd_menu_header" style="border:black;border-style:solid;background-color:black;cursor:grab;">&nbsp;</div>' +
            '<iframe id="post_request" style="width:100%;height:600px;"></iframe>' +
            '<div id="dd_menu_footer" style="border:black;border-style:solid;background-color:black;">' +
            '<input id="dd_start" type="button" value="START" />' +
            '<input id="dd_stop" type="button" value="STOP" />' +
            '<input id="dd_reset_linki" type="button" value="reset_linki" style="float:right;" />' +
            '<input id="dd_reset" type="button" value="reset_akcja" style="float:right;" />' +
            '</div>';
        iframe_div.setAttribute ('id', 'iframe_div');
        iframe_div.setAttribute ('style', 'position: fixed;display: block;top: 5%;right: 5%;z-index: 999;width: 60%;height:70%;');
        document.getElementsByTagName("body")[0].appendChild(iframe_div);

        iframe_div = null;

        dragElement(document.getElementById("iframe_div"));

        document.getElementById ("dd_start").addEventListener (
            "click", worker, false
        );

        document.getElementById ("dd_stop").addEventListener (
            "click", stopper, false
        );

        document.getElementById ("dd_reset").addEventListener (
            "click", reset, false
        );

         document.getElementById ("dd_reset_linki").addEventListener (
            "click", reset_linki, false
        );

        if(localStorage.getItem("akcja") == "ruszam")
        {
            worker();
        }
    }
    // Na stronie z postem
    else
    {
        if(localStorage.getItem("akcja") != "stop" && localStorage.getItem("akcja") != "czekam")
        {
            localStorage.setItem('akcja','sprawdzam_post');
            //  if(localStorage.getItem("odpowiedzi") != "udzielone")
            //  var czy_odpowiedzi = false;

            var post = document.getElementsByTagName("article");
            var post_tresc;
            var post_belka_dolna;

            await sleep(1000);
            if(localStorage.getItem("odpowiedzi") != "udzielone")
            {
                for(var z = 1; z<=post.length;z++)
                {
                    if(localStorage.getItem("akcja") != "stop" && localStorage.getItem("akcja") != "czekam")
                    {
                        if(post[z] != undefined)
                        {
                            post_tresc = post[z].lastElementChild.children[0].children[1].children[0];
                            post_belka_dolna = post[z].lastElementChild.children[0].children[1].children[1];

                            // jeżeli post jest ukryty
                            if(post_tresc.children[0] != undefined && post_tresc.children[0].innerText == "Ukryta zawartość.\n\nPodziękuj za ten post, aby zobaczyć ukryte treści." && post_tresc.children[0].innerText != "")
                            {
                                // jeżeli przy poście z odpowiedzią nie ma jeszcze reakcji (wtedy ma 3 atrybuty, z polubieniem ma 4
                                if(post[z].getElementsByClassName("ipsReact_reaction")[0].attributes.length == 3)
                                {
                                    post[z].getElementsByClassName("ipsReact_reaction")[0].children[0].scrollIntoView();
                                    post[z].getElementsByClassName("ipsReact_reaction")[0].children[0].click(); // 5 like na post, nr 5 to pucharek
                                    await sleep(3000); // nie za szybko te lajki xD
                                }
                            }
                            else if(post_tresc.children[1] != undefined && post_tresc.children[1].innerText == "Ukryta zawartość.\n\nPodziękuj za ten post, aby zobaczyć ukryte treści.")
                            {
                                // jeżeli przy poście z odpowiedzią nie ma jeszcze reakcji (wtedy ma 3 atrybuty, z polubieniem ma 4
                                if(post[z].getElementsByClassName("ipsReact_reaction")[0].attributes.length == 3)
                                {
                                    post[z].getElementsByClassName("ipsReact_reaction")[0].children[0].scrollIntoView();
                                    post[z].getElementsByClassName("ipsReact_reaction")[0].children[0].click(); // 5 like na post, nr 5 to pucharek
                                    await sleep(3000); // nie za szybko te lajki xD
                                }
                            }
                            else
                            {

                            }
                        }
                    }
                }
                localStorage.setItem("odpowiedzi","udzielone");
              //  console.log("odpowiedzi : udzielone");
                location.reload();
                await sleep(3000);
            }
            localStorage.setItem("odpowiedzi","");

            post = null
            post_tresc = null;
            post_belka_dolna = null;
            z = null;

            if(localStorage.getItem("akcja") != "stop" && localStorage.getItem("akcja") != "czekam")
            {
                var ile_linkow = document.getElementsByClassName("bimHiddenBox ipsMessage ").length;
                for(var x = 0; x< ile_linkow;x++)
                {
                    if(localStorage.getItem("akcja") != "stop" && localStorage.getItem("akcja") != "czekam")
                    {
                        if(document.getElementsByClassName("bimHiddenBox ipsMessage ")[x].attributes[0].value == "bimHiddenBox")
                        {
                            var premium_link = document.getElementsByClassName("bimHiddenBox ipsMessage ")[x].lastElementChild.innerText;
                            //  console.log(premium_link);

                            if(sprawdz_link(premium_link) == false)
                            {
                                var wiadomosc = premium_link;
                                var zapisane_linki = localStorage.getItem('linki');
                                localStorage.setItem('linki', zapisane_linki + '///' + premium_link);
                                discord_msg(wiadomosc);
                            }
                        }
                    }

                    await sleep(500);
                }

                ile_linkow = null;
                premium_link = null;
                wiadomosc = null;
                zapisane_linki = null;
                x = null;
                localStorage.setItem('akcja','ruszam');

            }
        }

        // czy_odpowiedzi = null;
    }


    // }
    //  console.log(tematy_z_odpowiedzia);

})();


function gc(max) {
    var arr = [];
    for (var i = 0; i < max; i++) {
        arr.push(i);
    }
    return arr.length;
}

async function stopper()
{
    localStorage.setItem("akcja","czekam");
    localStorage.setItem("odpowiedzi", null);
}

function reset()
{
    localStorage.removeItem('akcja');
    localStorage.setItem("odpowiedzi", null);
}

function reset_linki()
{
    localStorage.removeItem('linki');
    localStorage.setItem("odpowiedzi", null);
}

async function worker()
{
    // przygotowujemy pustą zmienna typu tablica (array) na tematy które mają odpowiedź
    // var tematy_z_odpowiedzia = [];

    // przygotowujemy zmienną do liczenia tematów z odpowiedziami
    // var j = 0;

    // sprawdzamy ile jest tematow na stronie
    // var ile_tematow = document.getElementsByClassName("ipsDataItem ipsDataItem_responsivePhoto  ").length;

    // liczymy ilość stron aby można było przewinąć tyle razy
    // bbierzemy wartość z guzika "przejdź do ostatniej strony"
    // var ile_stron = document.getElementsByClassName("ipsPagination_last")[0].firstChild.attributes[2].value;


    // zbieramy wszystkie tematy na stronie do tablicy (array)
    var tematy = document.getElementsByClassName("ipsDataItem ipsDataItem_responsivePhoto  ");

    // // dla każdej strony po kolei wykonujemy pętlę na sprawdzenie tematów
    // for(var strona = 1; strona<= ile_stron;strona++)
    // {
    // Standardowa pętla FOR - Sprawdzamy każdy temat po kolei, czy ma (już) odpowiedzi (z linkami)

    if(localStorage.getItem("akcja") != "stop" && localStorage.getItem("akcja") != "czekam")
    {
        for(var i = 0; i< tematy.length;i++)
        {
            if(localStorage.getItem("akcja") != "stop" && localStorage.getItem("akcja") != "czekam")
            {
                // jeżeli(post[w kolejności pętli = i].dziecko[2] od dziecko[0] od dziecko[0] - czyli dokładnie liczba odpowiedzi jest inna niż 0
                if(document.getElementsByClassName("ipsDataItem ipsDataItem_responsivePhoto  ")[i].children[2].children[0].children[0].innerText != "0")
                {
                    // dodajemy do tablicy z tematami z odpowiedziami link do posta
                    // children[1].children[0].lastElementChild.children[0] = trzeba odwołać się bezpośrednio do samej nazwy tematu, która zawiera link (href)
                    //tematy_z_odpowiedzia[j] = tematy[i].children[1].children[0].lastElementChild.children[0].href;

                    document.getElementById("post_request").src = tematy[i].children[1].children[0].lastElementChild.children[0].href;

                    await sleep(2000);
                    while(localStorage.getItem('akcja') == "czekam" || localStorage.getItem('akcja') == "sprawdzam_post")
                    {
                        console.log("czekam");
                        await sleep(1000);
                    }

                    // ponieważ nasza pętla opiera się na i , zmienną j musimy sami zwiększać o 1 gdy znajdziemy temat z odpowiedziami i chcemy go dodać do tablicy
                    // j++;
                }
            }
        }

        tematy = null;
        i = null;
        // Po pętli możemy przejść na kolejną stronę
        await sleep(1000);
        if(document.getElementsByClassName("ipsPagination_next")[0].className != "ipsPagination_next ipsPagination_inactive")
        {
            document.getElementsByClassName("ipsPagination_next")[0].lastChild.click();
            await sleep(10000);
            localStorage.setItem('akcja','ruszam');
            document.getElementById("dd_start").click();
         //   worker();
        }
        // jeżeli nie ma następnej strony, idziemy na pierwszą
        else
        {
          //  for (var y = 0; y<2; y++)
          //  {
           //     // repeat until you have enough:
          //      gc(Math.pow(2, y));
           // }
         //   y = null;
            localStorage.setItem('akcja','ruszam');
            document.getElementsByClassName("fa fa-angle-double-left")[0].click();
            await sleep(1000);
            location.reload();
          //  worker();
        }
    }
}


function sprawdz_link(link)
{
    var tablica_linkow = localStorage.getItem('linki');
    if(tablica_linkow == null)
    {
        return false;
    }

    var linki = tablica_linkow.split("///");

    for(var x = 0; x< linki.length;x++)
    {
        if(linki[x] == link)
        {
            linki = null;
            tablica_linkow = null;
            return true;
        }
    }
    linki = null;
    tablica_linkow = null;
    return false;
}


// funkcja ktora pozwala zrobić pauze w kodzie na dany okres czasu, dzięki niej będziemy czekać aż strona się załaduje
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function discord_msg(wiadomosc)
{
    fetch(
        '',
        {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // the username to be displayed
                username: 'YHUwebhook',
                // the avatar to be displayed
                avatar_url:
                'https://cdn.icon-icons.com/icons2/390/PNG/512/pirate-hook_39481.png',
                // contents of the message to be sent
                content:
                wiadomosc,
                // enable mentioning of individual users or roles, but not @everyone/@here
                allowed_mentions: {
                    parse: ['users', 'roles'],
                },
                // embeds to be sent
                embeds: [

                ],
            }),
        }
    );
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