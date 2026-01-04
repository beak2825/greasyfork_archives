// ==UserScript==
// @name         Chute Checker
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Automatyczne sprawdzanie czy pod każdym chute jest otwarty gaylord/cart (czy paczki nie leżą luzem pod chute)
// @author       @nowaratn
// @match        http*://sortcenter-menu-eu.amazon.com/audit/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/447974/Chute%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/447974/Chute%20Checker.meta.js
// ==/UserScript==

var audio = new Audio();
(function () {

    if (window.location.href.indexOf("http://") > -1) {
        window.location = "https://sortcenter-menu-eu.amazon.com/audit/";
    }

    if (window.document.title.indexOf("Invalid cookie set") > -1)
    {

        //    alert("Nie jesteś zalogowany/a na skanerze.\r\nNastąpi otwarcie strony skanera w nowej karcie.\r\n1. Zaloguj się\r\n2. Przejdź na funkcję 103 aby skrypt pobrał odpowiednie uprawnienia\r\n2. Zamknij stronę Skanera\r\n3. Odśwież stronę Visty z Chute Checkerem a będzie działał.");
        //   openWindow("https://sortcenter-menu-eu.amazon.com/containerization/");
        //  return;
    }

    var chute_checker = document.createElement ('div');
    chute_checker.innerHTML = '<div><input type="button" class="cell" id="chute-checker-button" value="CHUTE CHECKER" style="cursor:pointer;float:none;"  />' +
        '<br>' +

        // Tabela MENU
        '<table rules="all" style="margin-top:10px;border-collapse:collapse;border: 1px solid black">' +
        '<tr><td>Auto-sprawdzanie co X minut</td><td><input type="text" id="chute_checker_refresh" style="width:20px;" value="5"/><input id="chute_refresh_checkbox" type="checkbox" title="Zaznacz, aby strona automatycznie sprawdzała stan Chute co X minut" /></td></tr>' +
        '<tr><td>Automatycznie otwieraj wykryte <br> Chute w nowej karcie</td><td><select id="chute_checker_automatycznie"><option value="nie">NIE</option><option value="tak">TAK</option></select></td></tr>' +
        '<tr><td>Powiadomienie dźwiękowe</td>' +
        '<td><select id="chute_sound">' +
        '<option value="default">#default</option>' +
        '<option value="buzzer">#buzzer</option>' +
        '<option value="cat">#cat</option>' +
        '<option value="cow">#cow</option>' +
        '<option value="onion">#onion</option>' +
        '<option value="tada">#taadaa</option>' +
        '<option value="train">#train</option>' +
        '<option value="warning">#warning</option>' +
        '<option value="intro">#intro</option>' +
        '<option value="gg">#GG</option>' +
        '</select><input type="checkbox" id="chute_checker_soundalert" /></td></tr>' +
        '<tr><td style="border:white;padding:10px;"><input id="chute_menu_save" type="button" value="Zapisz" style="cursor:pointer"/></td></tr>' +
        '<tr><td colspan="2">Jeżeli skrypt się uruchamia,<br>ale nie działa przycisk "Chute Checker"<br>(w ogóle nie sprawdza chute), należy:<br>' +
        '1. Otworzyć <a href="http://fcmenu-dub-regionalized.corp.amazon.com/basic/login" target="_blank">skaner</a> w nowej karcie<br>' +
        '2. Wejść na funkcję 103<br>'+
        '3. Odświeżyć tę stronę</td></tr>'+
        '</table>' +
        '</div>' +

        // Tabela Chute
        '<div id="tabelka_div" style="overflow-y:scroll;height:600px;">' +
        '<center style="position:sticky;top:0px;background-color:white;padding-top:5px;"><span style="font-size:16px;margin-bottom:5px;">Sprawdzane Chute</span>' +
        '<span id="sprawdzany_ktore_chute" style="float:right;" >0/207</span></center>' +
        '<table cellpadding="5"  border="1" id="chute_checker_tabelka" style=""><tbody>' +
        '<tr style="position:sticky;top:25px;background-color:azure;" >' +
        '<td>Chute</td>' +
        '<td>Paczki</td>' +
        '<td>Kontenery</td>' +
        '<td>Status</td>' +
        '<td>Link do TT</td>' +
        '</tr>' +
        '</tbody></table></div>' +

        // Tabela defective Chute
        '<div id="tabelka__defective_div" style="overflow-y:scroll;height:600px;">' +
        '<center style="paddint-top:5px;"><span style="font-size:16px;margin-bottom:5px;">Wykryte problemy</span></center>' +
        '<table cellpadding="5"  border="1" id="defective_tabelka" style=""><tbody>' +
        '<tr style="position:sticky;top:0px;background-color:azure;" >' +
        '<td>Chute</td>' +
        '<td>Paczki</td>' +
        '<td>Kontenery</td>' +
        '<td>Status</td>' +
        '<td>Link do TT</td>' +
        '</tr>' +
        '</tbody></table></div>';


    //   '</div></div>';
    chute_checker.setAttribute ('id', 'chute_checker_id');
    chute_checker.setAttribute ('class', '');
    chute_checker.setAttribute ('style', 'display:inline-flex;');
    if(document.getElementById("menu") != undefined)
    {
        document.getElementById("menu").appendChild(chute_checker);
    }
    else
    {
        // alert("Nie jesteś zalogowany/a na skanerze.\r\nNastąpi otwarcie strony skanera w nowej karcie.\r\n1. Zaloguj się\r\n2. Przejdź na funkcję 103 aby skrypt pobrał odpowiednie uprawnienia\r\n2. Zamknij stronę Skanera\r\n3. Odśwież stronę Visty z Chute Checkerem a będzie działał.");
        // openWindow("https://sortcenter-menu-eu.amazon.com/containerization/");
        return;
    }

    document.getElementById ("chute-checker-button").addEventListener (
        "click", chute_check, false
    );

    document.getElementById ("chute_menu_save").addEventListener (
        "click", menu_save, false
    );

    document.getElementById ("chute_sound").addEventListener (
        "change", menu_sound, false
    );


    if(localStorage.getItem("chute_checker_refresh") == "true")
    {
        document.getElementById("chute_refresh_checkbox").checked = true;
    }
    if(localStorage.getItem("chute_checker_refresh_rate") != undefined && localStorage.getItem("chute_checker_refresh_rate") != null)
    {
        document.getElementById("chute_checker_refresh").value = localStorage.getItem("chute_checker_refresh_rate");
    }
    if(localStorage.getItem("chute_opener") == "tak")
    {
        document.getElementById("chute_checker_automatycznie").selectedIndex = 1;
    }
    if(localStorage.getItem("soundalert") == "true")
    {
        document.getElementById("chute_checker_soundalert").checked = true;
    }

    if(localStorage.getItem("sound_type") == "default")
    { document.getElementById("chute_sound").selectedIndex = 0;
     audio = new Audio('https://drive.corp.amazon.com/view/nowaratn@/Red%20Alert-SoundBible.com-108009997.mp3'); }

    if(localStorage.getItem("sound_type") == "buzzer")
    { document.getElementById("chute_sound").selectedIndex = 1;
     audio = new Audio('https://drive.corp.amazon.com/view/nowaratn@/Chute_Checker/BUZZER.mp3'); }

    if(localStorage.getItem("sound_type") == "cat")
    { document.getElementById("chute_sound").selectedIndex = 2;
     audio = new Audio('https://drive.corp.amazon.com/view/nowaratn@/Chute_Checker/CAT_MEOW.mp3'); }

    if(localStorage.getItem("sound_type") == "cow")
    { document.getElementById("chute_sound").selectedIndex = 3;
     audio = new Audio('https://drive.corp.amazon.com/view/nowaratn@/Chute_Checker/COW_MOO.mp3'); }

    if(localStorage.getItem("sound_type") == "onion")
    { document.getElementById("chute_sound").selectedIndex = 4;
     audio = new Audio('https://drive.corp.amazon.com/view/nowaratn@/Chute_Checker/ONION.mp3'); }

    if(localStorage.getItem("sound_type") == "tada")
    { document.getElementById("chute_sound").selectedIndex = 5;
     audio = new Audio('https://drive.corp.amazon.com/view/nowaratn@/Chute_Checker/TA_DA.mp3'); }

    if(localStorage.getItem("sound_type") == "train")
    { document.getElementById("chute_sound").selectedIndex = 6;
     audio = new Audio('https://drive.corp.amazon.com/view/nowaratn@/Chute_Checker/TRAIN_WHISTLE.mp3'); }

    if(localStorage.getItem("sound_type") == "warning")
    { document.getElementById("chute_sound").selectedIndex = 7;
     audio = new Audio('https://drive.corp.amazon.com/view/nowaratn@/Chute_Checker/WARNING_SIREN.mp3'); }

    if(localStorage.getItem("sound_type") == "intro")
    { document.getElementById("chute_sound").selectedIndex = 8;
     audio = new Audio('https://drive.corp.amazon.com/view/nowaratn@/Chute_Checker/intro.mp3'); }

    if(localStorage.getItem("sound_type") == "gg")
    { document.getElementById("chute_sound").selectedIndex = 9;
     audio = new Audio('https://drive.corp.amazon.com/view/nowaratn@/gadu.mp3'); }



    document.getElementById("row1").style.display = "none";
    document.getElementById("row2").style.display = "none";
    document.getElementById("toolbar").style.display = "none";



    setTimeout(function() {
        zbuduj_tabele();
        background_worker();
    },1000);
    //  chute_check();

})();


function menu_sound(){

    var wybor = document.getElementById("chute_sound").value;
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
    if(wybor == "gg")
    {
        audio.pause();
        document.getElementById("chute_sound").selectedIndex = 9;
        audio = new Audio('https://drive.corp.amazon.com/view/nowaratn@/gadu.mp3');
    }
}

async function background_worker(){

    for (var i = 0;i<100000000000;i++)
    {
        var refresh;
        var refresh_rate;
        refresh = localStorage.getItem("chute_checker_refresh");
        refresh_rate = localStorage.getItem("chute_checker_refresh_rate");

        // console.log(refresh);
        // console.log(refresh_rate);

        if(refresh != undefined && refresh == "true")
        {
            chute_check();
        }

        if(refresh_rate != undefined)
        {
            await delay(refresh_rate * 60 * 1000);
        }
        else
        {
            await delay(3 * 60 * 1000);
        }
    }
}

function menu_save(){
    var refresh = document.getElementById("chute_refresh_checkbox").checked;
    var refresh_rate = document.getElementById("chute_checker_refresh").value;
    var chute_opener = document.getElementById("chute_checker_automatycznie").value;
    var soundalert = document.getElementById("chute_checker_soundalert").checked;
    var sound_type = document.getElementById("chute_sound").value;

    localStorage.setItem("chute_checker_refresh",refresh);
    localStorage.setItem("chute_checker_refresh_rate",refresh_rate);
    localStorage.setItem("chute_opener",chute_opener);
    localStorage.setItem("soundalert",soundalert);
    localStorage.setItem("sound_type",sound_type);
}

async function chute_check(){
    // document.getElementById("chute_checker_id").style.cursor = "wait";

    var ile = tablica.length;
    var i = 0;
    var linijka;
    var chute_opener = localStorage.getItem("chute_opener");
    var soundalert = localStorage.getItem("soundalert");

    czysc_defecty();

    processTablica(tablica, ile)

    document.getElementById("chute_checker_id").style.cursor = "auto";


};

var csrf;

function findStateChangeReason(obj) {
    var result = "0";

    function searchForEvents(o) {
        if (o !== null && typeof o === 'object') {
            // Jeśli klucz 'events' istnieje na tym poziomie, dodaj do wyników
            if (o.hasOwnProperty('endToken')) {
                result = o.endToken;
            }
            // Rekurencyjne przeszukanie każdej właściwości obiektu
            for (const key of Object.keys(o)) {
                searchForEvents(o[key]);
            }
        }
    }

    searchForEvents(obj);
    return result;
}


function getCsrfToken() {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://trans-logistics-eu.amazon.com/sortcenter/tantei?nodeId=KTW1',
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    try {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');
                        const csrfToken = doc.querySelector("input[name='__token_']").value;
                        // console.log(csrfToken);
                        resolve(csrfToken);
                    } catch (e) {
                        reject('Błąd parsowania HTML: ' + e.message);
                    }
                } else {
                    reject(`HTTP error! status: ${response.status}`);
                }
            },
            onerror: function(error) {
                reject('Błąd przy żądaniu GET: ' + error);
            }
        });
    });
}

async function processTablica(tablica, ile) {

    getCsrfToken()
        .then(async csrfToken => {
        for (let i = 0; i < ile; i++)
        {
            if (tablica[i] != undefined)
            {
                document.getElementById("sprawdzany_ktore_chute").innerText =
                    i + 1 + "/" + ile;

                let chute_info = await httpGetAsync(
                    "https://sortcenter-menu-eu.amazon.com/audit/backend/getContainerInfo?containerId=" +
                    tablica[i][1]
                );



                // console.log(csrfToken);
                csrf = csrfToken;

                const rawData = '{"query":"\\nquery ($queryInput: [SearchTermInput!]!, $startIndex: String) {\\n  searchEntities(searchTerms: $queryInput) {\\n    searchTerm {\\n      nodeId\\n      nodeTimezone\\n      searchId\\n      searchIdType\\n      resolvedIdType\\n    }\\n    contents(pageSize: 100, startIndex: $startIndex, forwardNavigate: true) {\\n      contents {\\n        containerId\\n        containerLabel\\n        containerType\\n        stackingFilter\\n        criticalPullTime\\n        isEmpty\\n        isClosed\\n        isForcedMove\\n        associationReason\\n        associatedUser\\n        timeOfAssociation\\n        cleanupAllowed\\n      }\\n      endToken\\n    }\\n  }\\n}\\n","variables":{"queryInput":[{"nodeId":"KTW1","searchId":"' + tablica[i][1] + '","searchIdType":"UNKNOWN"}],"startIndex":"' + "0" + '"}}';
                postJsonAndGetContents(rawData).then(async contents =>{

                    if(contents.contents)
                    {
                        var chuteCount = contents.contents.length;
                        // console.log(contents.contents);
                        var containerId;
                        var closeTime;


                        contents.contents.forEach(async item => {
                            if(item.isClosed && !item.isEmpty)
                            {
                                containerId = item.containerId;
                                // jeżeli zamknięty (a nadal pod chute), to sprawdź godzine zamknięcia osobnym zpaytaniem
                                const rawData2 = '{"query":"\\nquery ($queryInput: [SearchTermInput!]!) {\\n  searchEntities(searchTerms: $queryInput) {\\n    searchTerm {\\n      nodeId\\n      nodeTimezone\\n      searchId\\n      searchIdType\\n      resolvedIdType\\n    }\\n    events {\\n      identifier\\n      description {\\n        ... on AuditAttemptEventDescription {\\n          auditStatus\\n          userProvidedValue\\n          actualValue\\n        }\\n        ... on ContainerMoveFailureEventDescription {\\n          failureReason\\n          attemptLocationId\\n          attemptLocationLabel\\n          attemptDestinationId\\n          attemptDestinationLabel\\n        }\\n        ... on ContainerAssociationEventDescription {\\n          associationReason\\n          childContainerId\\n          childContainerLabel\\n          parentContainerId\\n          parentContainerLabel\\n          parentContainerType\\n        }\\n        ... on ContainerAuditEventDescription {\\n          stateChangeReason\\n          currentStateId\\n          currentStateScannables\\n          currentStateParentId\\n          currentStateParentLabel\\n          previousStateHasDeparted\\n          previousStateLocationId\\n          previousStateLocationLabel\\n          previousStateParentId\\n          previousStateParentLabel\\n        }\\n        ... on LoadPlanUpdateEventDescription {\\n          currentAssociatedTrailerId\\n          currentLoadState\\n          currentOperationType\\n          previousAssociatedTrailerId\\n          previousLoadState\\n        }\\n        ... on AmphoraEventDescription {\\n          cloudAuthId\\n          actionType\\n          epochMilli\\n          naturalKeys\\n          relation\\n          relations {\\n            key\\n            value\\n          }\\n          target\\n          targets\\n          openContent\\n          patch\\n          definitionId\\n          workRequest\\n          workRequestInfo\\n          workState\\n          workStateInfo\\n          assemblyType\\n          workCreateUpdate\\n        }\\n      }\\n      byUser\\n      byModule\\n      lastUpdateTime\\n    }\\n  }\\n}\\n","variables":{"queryInput":[{"nodeId":"KTW1","searchId":"' + containerId + '","searchIdType":"UNKNOWN"}]}}';


                                // sprawdź eventy i godz. zamknięcia
                                postJsonAndGetEvents(rawData2).then(events =>{

                                    events.forEach(async item => {
                                        if(item.description.stateChangeReason == "CLOSE")
                                        {
                                            closeTime = parseInt(item.lastUpdateTime);
                                            console.log(item.description);
                                            // console.log(closeTime);
                                            // console.log(closeTime + 900000);
                                            // console.log(Date.now());
                                            // console.log(closeTime < (Date.now() - 900000));

                                            if(closeTime < (Date.now() - 900000))
                                            {
                                                if(!document.getElementById('dwelling_' + tablica[i][0]))
                                                {
                                                    var url =
                                                        "https://trans-logistics-eu.amazon.com/sortcenter/tantei?nodeId=KTW1&searchType=Container&searchId=" +
                                                        containerId;

                                                    var linijkaa =
                                                        "<td>" +
                                                        tablica[i][0] +
                                                        '</td>' +
                                                        '<td id="dwelling_' + tablica[i][0] + '" style="background-color:pink;">' +
                                                        '</td><td id="">' +
                                                        '</td><td id="">Dwelling Container!' +
                                                        '</td><td><a href="' + url + '">' +
                                                        tablica[i][0] +
                                                        "</a></td>";
                                                    document.getElementById("defective_tabelka").children[0].innerHTML +=
                                                        linijkaa;
                                                }
                                            }
                                        }
                                        await delay(300);
                                    });
                                }).catch(error => console.error(error));
                            }
                        });
                    }
                }).catch(error => console.error(error));


                let status = getFromBetween.get(chute_info, 'status":"', '"}');
                if (status != "BackendError") {
                    let paczki = getFromBetween.get(
                        chute_info,
                        'elementalChildrenCount":',
                        ',"status'
                    );
                    let kontenery = getFromBetween.get(
                        chute_info,
                        'compoundChildrenCount":',
                        ',"startTime'
                    );
                    let label = getFromBetween.get(chute_info, 'label":"', '","IS_AUDIT');

                    if (paczki[0] != undefined && paczki[0] != null) {
                        document.getElementById("paczki_" + label[0]).innerText = paczki[0];

                        if (paczki[0] > 0) {
                            let url =
                                "https://trans-logistics-eu.amazon.com/sortcenter/tantei?nodeId=KTW1&searchType=Container&searchId=" +
                                tablica[i][1];
                            document.getElementById("paczki_" + label[0]).style.backgroundColor =
                                "pink";
                            let linijka =
                                "<td>" +
                                tablica[i][0] +
                                '</td><td id="" style="background-color:pink;">' +
                                paczki[0] +
                                '</td><td id="">' +
                                '</td><td id="">' +
                                '</td><td><a href="' +
                                url +
                                '">' +
                                tablica[i][0] +
                                "</a></td>";
                            document.getElementById("defective_tabelka").children[0].innerHTML +=
                                linijka;

                            // if (chute_opener == "tak") {
                            //     openWindow(url);
                            // }
                            if (localStorage.getItem("soundalert") == "true") {
                                audio.play();
                            }
                        } else {
                            document.getElementById("paczki_" + label[0]).style.backgroundColor =
                                "lightgreen";
                        }
                    }

                    if (kontenery[0] != undefined && kontenery[0] != null) {
                        document.getElementById("kontenery_" + label[0]).innerText =
                            kontenery[0];

                        if (kontenery[0] > 1) {
                            document.getElementById("kontenery_" + label[0]).style.backgroundColor =
                                "yellow";
                        } else {
                            document.getElementById("kontenery_" + label[0]).style.backgroundColor =
                                "lightgreen";
                        }
                    }
                } else {
                    break;
                }
            }
            await delay(300);
        }
    })
        .catch(error => console.error('Błąd:', error));
}


async function postJsonAndGetContents(rawData) {
    try {
        const jsonData = JSON.parse(rawData);

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://trans-logistics-eu.amazon.com/sortcenter/tantei/graphql',
                headers: {
                    'Content-Type': 'application/json',
                    'anti-csrftoken-a2z': csrf // Dodanie tokenu CSRF do nagłówków
                },
                data: JSON.stringify(jsonData),
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const data = JSON.parse(response.responseText);
                            resolve(data.data.searchEntities[0].contents ? data.data.searchEntities[0].contents : []);
                        } catch (e) {
                            reject('Błąd parsowania odpowiedzi JSON: ' + e.message);
                        }
                    } else {
                        reject(`HTTP error! status: ${response.status}`);
                    }
                },
                onerror: function(error) {
                    reject('Błąd przy żądaniu POST: ' + error);
                }
            });
        });
    } catch (error) {
        console.error('Błąd przy żądaniu POST:', error);
        return []; // Zwraca pustą tablicę w przypadku błędu
    }
}



async function postJsonAndGetEvents(rawData) {
    try {
        console.log(rawData);
        const jsonData = JSON.parse(rawData);


        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://trans-logistics-eu.amazon.com/sortcenter/tantei/graphql',
                headers: {
                    'Content-Type': 'application/json',
                    'anti-csrftoken-a2z': csrf // Dodanie tokenu CSRF do nagłówków
                },
                data: JSON.stringify(jsonData),
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const data = JSON.parse(response.responseText);
                            resolve(data.data.searchEntities[0].events ? data.data.searchEntities[0].events : []);
                        } catch (e) {
                            reject('Błąd parsowania odpowiedzi JSON: ' + e.message);
                        }
                    } else {
                        reject(`HTTP error! status: ${response.status}`);
                    }
                },
                onerror: function(error) {
                    reject('Błąd przy żądaniu POST: ' + error);
                }
            });
        });
    } catch (error) {
        console.error('Błąd przy żądaniu POST:', error);
        return []; // Zwraca pustą tablicę w przypadku błędu
    }
}


function openWindow( url )
{
    window.open(url, '_blank');
    window.focus();
}

function czysc_defecty(){

    var ile = document.getElementById("defective_tabelka").children[0].children.length;
    var i = 0;
    for (i;i<=ile;i++)
    {
        if(document.getElementById("defective_tabelka").children[0].children[1] != undefined)
        {
            document.getElementById("defective_tabelka").children[0].children[1].remove();
        }
    }
}

function zbuduj_tabele(){
    var ile = tablica.length;
    var i = 0;
    var linijka;

    for (i;i<=ile;i++)
    {
        if(tablica[i] != undefined)
        {
            linijka = '<td>' + (tablica[i][0]) + '</td><td id="paczki_' + (tablica[i][0]) + '" >' + '</td><td id="kontenery_' + (tablica[i][0]) + '">' + '</td><td id="status_' + (tablica[i][0]) + '">' + '</td><td><a href="https://trans-logistics-eu.amazon.com/sortcenter/tantei?nodeId=KTW1&searchType=Container&searchId=' + (tablica[i][1]) + '">' + (tablica[i][0]) + '</a></td>';
            document.getElementById("chute_checker_tabelka").children[0].innerHTML = document.getElementById("chute_checker_tabelka").children[0].innerHTML + linijka;
        }
    }

}


function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

async function httpGetAsync(theUrl)
{
    return new Promise((resolve, reject) => {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                resolve(xmlHttp.responseText);
        }
        xmlHttp.open("GET", theUrl, true); // true for asynchronous
        xmlHttp.send(null);
    });
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

var tablica = [
    ["FLAT-A-105","0ac35b7d-329c-11b0-7a6a-0d772a831f4a"],
    ["FLAT-A-106","80c35b7c-ccce-6ba0-c439-ed6b397878bb"],
    ["FLAT-A-107","fac35b7c-8bf3-5763-cc4e-b9a4a924c996"],
    ["FLAT-A-108","b6c35b7c-5b68-7d0e-e172-2f68563497f5"],
    ["FLAT-A-109","d2c35b7c-2148-0660-30dc-b1391b7e1a15"],
    ["FLAT-A-110","aac35b67-3092-5a03-ba78-8d3bd21c19bd"],
    ["FLAT-A-117","04c35b65-44ad-9883-c58f-1128e75d1685"],
    ["FLAT-A-118","56c35dee-0f62-1bba-343a-c6261f81000e"],
    ["FLAT-A-119","30c35b65-fcdd-b352-b4bf-7f347a52a539"],
    ["FLAT-A-120","12c35b65-b170-d71d-f647-9b43b325af46"],
    ["FLAT-A-121","2cc35b63-db70-8b5b-6e88-17336f8777b4"],
    ["FLAT-A-122","f4c35b64-a354-55f1-d533-1330095c58ab"],
    ["FLAT-A-124","e6c35b63-4b8b-8fc3-cf1c-f5e4e822da63"],
    ["FLAT-A-125","d2c35b62-b9d8-f21f-036f-f59a30a813c7"],
    ["FLAT-A-127","50c35b63-9fa8-3e6b-4250-7ffd192427fb"],
    ["FLAT-A-128","7ac35b62-4a86-7d6e-df7e-0c55973d3065"],
    ["FLAT-A-129","bac35b61-d6a7-3d75-31af-e622e1790b79"],
    ["FLAT-A-130","70c35b62-86d1-4e1a-20a7-09eccd5ac72c"],
    ["FLAT-A-132","a6c35b61-5e4b-a27a-32ce-5bd71c94e29c"],
    ["FLAT-A-133","bac35b61-9df2-1456-1eac-259be48fef8d"],
    ["FLAT-A-136","a2c35b5e-f95a-62b8-3630-5c1b23de5e23"],
    ["FLAT-A-137","74c35b61-02f7-4741-1603-13167e1de739"],
    ["FLAT-A-139","a2c35af2-ec0e-74aa-712f-f9cc6bbb9ff5"],
    ["FLAT-A-140","d4c35b5d-0e21-bc8b-9d19-546dcc76fcbb"],
    ["FLAT-A-141","4cc35da9-fb49-b258-f8af-95c607629fe7"],
    ["FLAT-A-142","a2c3654a-f26c-d858-d8e2-7fd1fa277401"],
    ["FLAT-A-144","9ac362ef-b561-923d-fccc-b0c7eef01be6"],
    ["FLAT-A-147","90c362f2-4fa1-45a8-9ac7-70f10b559b94"],
    ["FLAT-A-148","4ac362f2-6900-1f82-dcbe-c3352d22ef54"],
    ["FLAT-A-149","3cc362f2-7a23-3f53-ef2d-73fb4e952c2b"],
    ["FLAT-A-150","5ac362f2-9793-3a8e-1f74-fe475b2329c0"],
    ["FLAT-A-152","6ac362f3-83ef-844f-3ae2-4526eb0de054"],
    ["FLAT-A-153","6ac35dac-b127-5ff5-d096-6796074e5ef9"],
    ["FLAT-A-156","f4c35f41-2a39-f834-6f31-7835d8e51130"],
    ["FLAT-A-157","2ec35f41-2134-bc31-bbab-bf196c4c71fe"],
    ["FLAT-A-158","14c35f41-18d8-d57c-5e1b-9387dbcab7d7"],
    ["FLAT-A-160","a4c35f41-102d-72c1-ab42-d3d02df5b70c"],
    ["FLAT-A-161","1cc35f41-07a9-4049-19e9-0aa241bc1732"],
    ["FLAT-A-162","30c35f40-ff79-bb65-d6f1-fd89b3ed8e2d"],
    ["FLAT-A-163","bac35f40-f3ab-ae5c-ff1b-7a096047a3d0"],
    ["FLAT-A-165","9ac35f40-ea35-bbb7-54e7-7571acb0a159"],
    ["FLAT-A-166","92c35f40-e029-776a-cf46-aef44343a209"],
    ["FLAT-A-167","3ac35f40-d830-3d71-2ab8-b49c71458cb4"],
    ["FLAT-A-169","a2c35f40-d069-add3-b129-a3a506464510"],
    ["FLAT-A-170","50c35f40-c6d3-897a-72f0-f1482ae21d45"],
    ["FLAT-A-171","f6c35f40-bc17-3547-e9bb-29278c5d2c66"],
    ["FLAT-A-172","44c35dbc-e9e4-c828-789f-7cae40e1affb"],
    ["FLAT-A-173","5cc358e7-39c8-332e-4b79-1953a9ee9768"],
    ["FLAT-A-174","80c35f40-a3a1-51b5-c920-5e011e734695"],
    ["FLAT-A-175","b2c35a1f-db48-4331-db77-36f7b14c1a7c"],
    ["FLAT-A-177","72c35a18-0ddf-8d21-5f2b-8508c11f5ba3"],
    ["FLAT-A-178","4ec358e0-5f74-ec9c-397b-63884106f7d6"],
    ["FLAT-A-179","80c35a17-c789-5d5c-86c0-873822c6bf3b"],
    ["FLAT-A-180","48c35a17-99b4-a656-f927-5dc6779073ec"],
    ["FLAT-A-184","60c3629f-ffa8-26d9-0524-a0635be687c6"],
    ["FLAT-A-185","9ec35a16-eb10-d81a-e6ae-12d238a25ef5"],
    ["FLAT-A-186","48c362a0-32b2-7271-74c7-8b8fb942a494"],
    ["FLAT-A-187","2ec35a16-c0e7-4238-8a5d-49e83c1c20fa"],
    ["FLAT-A-188","7cc35a16-a04d-b609-e543-c5d5e08a98b0"],
    ["FLAT-A-189","e8c35a16-7c92-0f33-0a7d-44c0bbb8e005"],
    ["FLAT-A-190","34c35a16-4b0b-0542-97e9-5355f23fbe56"],
    ["FLAT-A-191","e8c35a16-1c61-ae91-27ac-0aa8883f5776"],
    ["FLAT-A-192","1cc35a15-f6f7-4747-3ce0-a25aa938bd38"],
    ["FLAT-A-193","7ec35a15-ce59-a2cd-4a51-248431f47591"],
    ["FLAT-A-194","dac35a15-a549-9f37-7f2e-279db2fc6f14"],
    ["FLAT-A-195","a0c35a15-80a5-339a-35b3-9229c64066de"],
    ["FLAT-A-196","aec35a15-54c4-38df-9ef1-eaa0486a0de2"],
    ["FLAT-A-197","c2c35a15-34d3-37b3-fa6b-504edc5e30cf"],
    ["FLAT-A-198","02c35a15-0ad0-f1c5-b598-c963dc5f18c2"],
    ["FLAT-A-199","80c35a14-e08f-1875-adac-55674a7e6edc"],
    ["FLAT-A-200","d0c35a14-035f-59f6-3e4b-0ab9ccc14fb4"],
    ["FLAT-A-201","dec35a13-746c-bfc4-d8c7-f36c7570e26c"],
    ["FLAT-A-202","1cc358d3-8b1a-3cfe-b524-794bc75301a1"],
    ["FLAT-A-203","fac354ab-cd33-7e77-6ccd-9c7c77fc0da0"],
    ["FLAT-A-204","2ac354ab-9b8e-6c20-80b0-8e2fc72d291c"],
    ["FLAT-A-205","f0c354ab-84b9-2ea1-3ab5-038e5d7c4dec"],
    ["FLAT-A-206","3ac354ab-6604-4433-c56d-1fa6c4495765"],
    ["FLAT-A-207","8ac354ab-489a-ec2b-3421-14c501ffacfa"],
    ["FLAT-A-302","1cc35b64-31d2-52cf-8e6b-1dc705b2c12e"],
    ["FLAT-A-303","c6c35b62-fbb4-43af-32f8-59fcd40e8035"],
    ["FLAT-A-314","f0c35b5f-7a43-4483-1fe7-70185a98ab8d"],
    ["FLAT-A-315","5cc35b5f-4b9c-8d3c-eae3-d60675ff4a4c"],
    ["FLAT-A-316","20c35b60-9883-3019-b13a-a7a472cabed9"],
    ["FLAT-A-317","7ac35b5f-bf5c-8ae6-a46a-048a330c57a4"],
    ["FLAT-A-318","d6c35b5c-3b79-7852-0bc0-13c6a803d0d7"],
    ["FLAT-A-319","c2c35b00-52d6-7479-1e4b-e03f7108e2ad"],
    ["FLAT-A-320","20c35b5e-0c92-0faf-08f9-26ce422e624b"],
    ["FLAT-A-321","86c36299-9547-1c9c-faeb-a0b91d66da3a"],
    ["FLAT-A-322","44c36299-b369-36fa-b59a-dc2567c1cabb"],
    ["FLAT-A-323","5ec36299-dbf7-9ae8-6692-90ff1462f3a1"],
    ["FLAT-A-324","a6c36299-f007-7408-c161-795aa2919099"],
    ["FLAT-A-325","e8c3629a-0752-4047-3a12-cc7665b47e91"],
    ["FLAT-A-326","1ec3629a-1f9e-b8bf-06cc-03e6e22de23f"],
    ["FLAT-A-327","b6c3629a-3cd0-1b53-03c1-645d9dd08857"],
    ["FLAT-A-328","72c3629a-6fb2-db96-e9b2-e821dc923f7c"],
    ["FLAT-A-329","dec3629a-867c-bb0b-ba06-e62e6947c350"],
    ["FLAT-A-330","fcc3629a-a0ad-209e-b768-cc327a4a03f9"],
    ["FLAT-A-331","44c3629a-be34-07e1-86e3-b82858f2e3f1"],
    ["FLAT-A-332","3ac3629a-e194-3103-54b4-24bae6c290a1"],
    ["FLAT-A-333","10c3629b-0041-8d67-30e9-ecb25c05efee"],
    ["FLAT-A-334","08c3629b-5a81-d384-d935-a6d6dc3d3680"],
    ["FLAT-A-335","38c3629b-6dc1-f8be-3ca7-7eff69d94090"],
    ["FLAT-A-336","a4c3629b-93c9-c944-ed08-365d9278a437"],
    ["FLAT-A-337","fcc3629b-b94c-b5de-1dcc-98c0ee192599"],
    ["FLAT-A-338","a8c35ae3-52db-94d1-0cfd-7426f991b760"],
    ["FLAT-A-339","5cc3629c-08a9-0f2d-7897-3c5437187bc8"],
    ["FLAT-A-340","08c3629c-4022-5d4a-430e-7f956b0fcaf6"],
    ["FLAT-A-341","5cc3629c-5e23-3084-f6df-8f93d9d5d041"],
    ["FLAT-A-342","26c3629c-76e5-7788-aaaf-b1e6d5189c94"],
    ["FLAT-A-343","76c3629c-8e38-62ee-bf3d-91e1fd1615b6"],
    ["FLAT-A-344","a4c3629c-eb99-3e09-0566-34a2a6d9dfa1"],
    ["FLAT-A-345","c2c3629d-0e52-045e-5e3e-39e81a94b63f"],
    ["FLAT-A-346","bec3629d-3cf2-0807-ff6e-66f4fb19af09"],
    ["FLAT-A-347","34c3629d-6649-81a1-ed7d-9c4bd9333c1c"],
    ["FLAT-A-348","5ec3629d-809a-64ff-6492-f0fad20e920f"],
    ["FLAT-A-349","8ec3629d-983a-5034-3595-65dbc7f52c27"],
    ["FLAT-A-350","3ac3629e-1341-23c5-7953-8a3f9fe3ef37"],
    ["FLAT-A-351","76c3629e-27ce-1600-7e6e-8434d050ff18"],
    ["FLAT-A-352","b0c3629e-6488-fb78-cd3d-6857646075c5"],
    ["FLAT-A-353","26c3629e-82b3-b7e3-98c4-93f48eff67fd"],
    ["FLAT-A-354","4ec3629e-9f8b-995e-35fc-aaf32b660daf"],
    ["FLAT-A-355","e6c3629e-b696-1a94-81aa-19e159461b47"],
    ["FLAT-A-356","2ec36180-cc1e-7abb-52e7-861d6f17571b"],
    ["FLAT-A-357","b6c36180-e4fa-55eb-2b85-50d974bfec3e"],
    ["FLAT-A-358","84c36180-f597-d149-ae10-1b838ea5cc7c"],
    ["FLAT-A-359","26c3629f-bd9f-6899-c5c6-a2ed3214a768"],
    ["FLAT-A-360","9ac36181-0b9f-2933-a7be-1bdbfd37b48e"],
    ["FLAT-A-361","3ec35ad9-fa6c-af09-bf76-24cd8f036b69"],
    ["FLAT-A-362","38c35ad1-4c4d-c4ae-af47-ecf72df06a32"],
    ["FLAT-A-363","fac362ca-8ae1-3b1b-b190-5d3635b66ec2"],
    ["FLAT-A-364","9ec362ca-aea8-6137-5e66-c79384316793"],
    ["FLAT-A-365","46c362ca-dc7d-4ae8-9445-2e1cb9ab8a17"],
    ["FLAT-A-366","d0c362ca-ee93-1307-6ad4-53a7b6958baf"],
    ["FLAT-A-367","aec362cb-051a-c30b-cf52-d728a2a3211f"],
    ["FLAT-A-368","88c362cb-194b-93ca-287f-85d5b3b4432b"],
    ["FLAT-A-369","b0c362cb-2de3-0a31-9cf8-68f146379467"],
    ["FLAT-A-370","1ac362cb-4b10-4d92-de28-7ea0d960a01c"],
    ["FLAT-A-371","4cc362cb-707f-4977-3568-f4190abbe62f"],
    ["FLAT-A-372","e2c362cb-832c-3925-d9c5-55e9cd0a5039"],
    ["FLAT-A-373","4ac362cb-9d36-6250-7abc-b3031f03f6f2"],
    ["FLAT-A-374","9ec36181-1b22-aef7-1a90-d072006aa995"],
    ["FLAT-A-375","d4c362cb-b42f-b850-b14e-7b527ab5bab3"],
    ["FLAT-A-376","d0c362cd-5f87-2509-cc6e-2ec476b035f0"],
    ["FLAT-A-377","50c362cd-70fe-2d54-158e-d6bbf4f130f6"],
    ["FLAT-A-378","6cc362cd-872b-cebe-a43e-80a5c9b4a7ba"],
    ["FLAT-A-379","0ec362cd-a565-0715-c484-30a45f836206"],
    ["FLAT-A-380","b6c362cd-c83e-3b72-9b68-4670a6cdac04"],
    ["FLAT-A-381","34c362cd-d9b2-df0b-c22f-75cc75a293ff"],
    ["FLAT-A-382","eac362ce-10b0-26a4-1688-201ebd55f431"],
    ["FLAT-A-383","04c362cd-fcf1-7129-b623-6b849a841ee9"],
    ["FLAT-A-384","6ac362ce-3d4b-11a3-ae29-a48f42256a16"],
    ["FLAT-A-385","38c362ce-63e3-ddb8-b420-4d3d7529c397"],
    ["FLAT-A-386","d4c362ce-72ea-c0aa-ba30-cb626dc2946a"],
    ["FLAT-A-387","1ac362ce-8c31-ccbf-f697-d4919ba4ab74"],
    ["FLAT-A-388","60c362cf-9bfc-da6d-b429-2aeb47df38d8"],
    ["FLAT-A-389","5ac362cf-aecc-a61e-5a7e-24fc380b39ce"],
    ["FST-A-123","7ac1c064-46b6-782d-b13d-fcc4d39bb941"],
    ["FST-A-164","a2c1c064-6707-534a-352a-a2efa63924a3"],
    ["FST-A-168","92c1c064-23a5-cc4d-9b12-58dcb7d74fe2"],
    ["FST-A-176","90c1c064-8bf4-ae5b-183d-f61948d20ade"],
    ["FST-A-184","4cc1c064-c74c-cf04-75f1-59152a52ae1e"],
    ["FST-A-335","bcc1c063-abca-2228-a4f8-68d89cca4146"],
    ["FST-A-337","7ac1c063-d120-25cc-3c7b-7480994a5a29"],
    ["FST-A-341","14c1c063-efe9-f2bb-01f1-41a0a6662d7d"],
    ["BOX-A-001-A","1cc367a0-9e44-d84d-55e2-189db1a9b842"],
    ["BOX-A-001-B","5cc367a0-b5c7-6b78-e1e5-a50591f37baf"],
    ["BOX-A-001-C","9ac367a0-cd67-b9d5-9bc4-eaba212134ab"],
    ["BOX-A-001-D","16c367a0-dadc-440b-9a30-d519321aa522"],
    ["BOX-A-001-E","eec367a0-ec95-ba32-db0e-f969fe592e8d"],
    ["BOX-A-001-F","7ac367a1-08ed-bfd3-0321-748622da9039"],
    ["BOX-A-001-G","e2c367a1-199a-eec3-ff15-077ddc9f674f"],
    ["BOX-A-001-H","eec367a1-31fa-c69b-90fb-22ac9b21a414"],
    ["BOX-A-001-i","dec367a1-543d-c7d9-3526-a26338c35b18"],
    ["BOX-A-001-J","e2c367a1-6ca0-356e-4333-6f936729c448"],
    ["BOX-A-001-K","bac367a1-882c-04ce-5537-da4e73d34e2c"],
    ["BOX-A-002-A","9cc367a1-c96e-a947-d33e-af2bc0315821"],
    ["BOX-A-002-B","9ac367a1-dbd9-fd26-b3eb-dd6d6fb03ed3"],
    ["BOX-A-002-C","98c367a2-09bb-6bad-5221-3556c7b043c2"],
    ["BOX-A-002-D","08c367a2-1ea3-7feb-e875-f49bfb942f6d"],
    ["BOX-A-002-E","bcc367a2-3403-5dbf-4d30-28ab28917a25"],
    ["BOX-A-002-F","74c367a2-54e1-31af-0798-cbe346595e48"],
    ["BOX-A-002-G","24c367a2-76ff-29ea-5470-cc9e86d8c3ca"],
    ["BOX-A-002-H","60c367a2-9951-2b23-04c6-fd2fbf9145b5"],
    ["BOX-A-002-i","86c367a2-b25d-4130-ce34-7f90d17f582e"],
    ["BOX-A-002-J","46c367a2-cedf-fdbd-23e3-2c9509c076df"],
    ["BOX-A-002-K","e2c367a2-f22e-e407-aeb4-dce95435739e"],
    ["BOX-A-003-A","6ec367a3-154c-5d5f-c361-7117c7c97f18"],
    ["BOX-A-003-B","28c367a3-2820-4c87-25be-3128b067ed32"],
    ["BOX-A-003-C","6cc367a3-3e3e-a017-2725-df7b0e9e050c"],
    ["BOX-A-003-D","10c367a3-77fc-b6ca-1981-5d1247fcd288"],
    ["BOX-A-003-E","cac367a3-8e42-c6dc-d043-b36d28d77331"],
    ["BOX-A-003-F","d2c367a3-a4f0-892a-1f48-21acb37b1659"],
    ["BOX-A-003-G","cac367a4-0f20-23ec-e562-046dc6a54e0a"],
    ["BOX-A-003-H","bac367a4-2d86-f952-b3e4-39009515d98f"],
    ["BOX-A-003-i","e0c367a4-42f1-ac1c-0714-d82363fc0d68"],
    ["BOX-A-003-J","bac367a4-5c46-1732-647a-8c816581af6c"],
    ["BOX-A-003-K","b0c367a5-4026-ba25-cbdf-7951bf3a4f9a"]
]