// ==UserScript==
// @name         VAST-er
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  Value Adding Shipping Tool - Extended Research
// @author       You
// @match        https://trans-logistics-eu.amazon.com/sortcenter/flowrate
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448519/VAST-er.user.js
// @updateURL https://update.greasyfork.org/scripts/448519/VAST-er.meta.js
// ==/UserScript==

const dataArray = [
    ["babbd950-3739-0780-3535-e92517e7044e","STAGE_132_133_1"],
    ["7ac223cf-47cb-4b35-b494-13bacefd5dd7","STAGE_132_133_2"],
    ["d4c22404-9a50-7c7f-4d0b-bc4a1bdcd07d","STAGE_133_134_3"],
    ["82bbd950-50d6-842b-8935-01944d9219c7","STAGE_133_134_1"],
    ["86bbe045-b4ab-63ae-df3b-4f63b462e7b3","STAGE_133_134_2"],
    ["d4c22404-9a50-7c7f-4d0b-bc4a1bdcd07d","STAGE_133_134_3"],
    ["36bbd95a-f48a-e59b-4c03-eb7bcf6a5133","STAGE_134_135_1"],
    ["0abbe046-0ed8-c9d5-2fbd-81a7ed6fa88e","STAGE_134_135_2"],
    ["dcbbe046-17cd-4a8d-36d3-65b39a478f6e","STAGE_134_135_3"],
    ["f6bbe047-4129-f0de-673b-23f82605b546","STAGE_140_141_1"],
    ["d8bc1a3b-8d19-fc53-2e26-52f691235785","STAGE_140_141_2"],
    ["0abe7983-21fa-3e70-967b-1cde0a446264","STAGE_140_141_3"],
    ["54c3bd50-42e9-49ae-f54b-e4d7dfd6e4f6","STAGE_141_142_1"],
    ["30c3bd50-55f1-560b-dd52-db93f58f396d","STAGE_141_142_2"],
    ["5cc34a26-7018-9d4f-dd35-e7fa4a0d0783","STAGE_143_D3_1"],
    ["c8bbe047-cd15-8197-7b6a-21c06e3bb279","STAGE_143_144_1"],
    ["b8bbd975-9998-e70c-2ced-0149936d2525","STAGE_144_145_1"],
    ["ecbbe048-b65a-6405-0c2b-801f7cc9fefe","STAGE_145_146_1"],
    ["2ebbe048-bf77-b03f-be6b-fcf120a62a9e","STAGE_145_146_2"],
    ["7ebbe048-f69f-13b4-fc4f-29ebaf3ecb61","STAGE_146_147_1"],
    ["98bbe049-21a7-06cb-98e4-bf95ab7170f6","STAGE_147_148_2"],
    ["24bbe049-c981-905f-a68d-c9efd7a326ab","STAGE_157_158_1"],
    ["68bbe049-e527-4001-8323-0be0454ff038","STAGE_158_159_1"],
    ["5cbbe04a-0e4f-5165-7a45-1208413575c6","STAGE_159_160_1"],
    ["4abbe04a-14b4-f62f-5b12-7d0d8576209b","STAGE_159_160_2"],
    ["94bbe04a-32f3-6e37-8238-b73a65512d7e","STAGE_160_161_1"],
    ["2ebbe04a-3f37-b4fa-8078-5511e931ba7d","STAGE_160_161_2"],
    ["4ebbe04b-fcf9-0693-8772-cda9ff7d42c1","STAGE_161_162_1"],
    ["00be791d-9fdf-6e3f-ccbf-55583d2acb3c","STAGE_161_162_2"],
    ["72bbe04c-121a-7877-8fe3-8b1468928127","STAGE_162_163_1"],
    ["00bbe04c-1949-4e0c-f9cb-c3e58c109649","STAGE_162_163_2"],
    ["56bbe04c-3b59-7f9f-d600-ed83ccfeaa07","STAGE_163_164_1"],
    ["24bd842c-c1da-f66c-5ac6-7fc8e9cdd78f","STAGE_163_164_2"],
    ["4ebbe04c-956d-7c08-f9b5-1cab718c70b2","STAGE_164_1"],
    ["a0be5f6f-f624-a72a-e7be-c5de545aee09","DEPOST/CHEMNITZ/OB_164"]
];


(function () {

    document.getElementById("INBOUND").style.display = "none";
    document.getElementById("SORTATION").style.display = "none";
    document.getElementById("OUTBOUND").style.display = "none";
    document.getElementById("PERFORMANCE_METRICS").style.display = "none";


    // vaster menu
    var vaster_menu = document.createElement ('div');
    vaster_menu.innerHTML = '<center><div id="vaster_menu" >' +
        '<input type="button" id="Vaster_Chute_Checker" value="Chute Checker" style="height:auto;font-size:24px;background-color:#d0d0b3;font-variant:all-petite-caps;"/>' +
        '<input type="button" id="Vaster_Stage_Audyt" value="Stage Audit" style="height:auto;font-size:24px;background-color:#d0d0b3;font-variant:all-petite-caps;"/>' +
        '</div></center>';
    vaster_menu.setAttribute ('style', 'position:absolute;transform:translate(-50%,0%);left:50%;z-index:9999;');
    document.getElementById("pageContent").appendChild(vaster_menu);



    // chute checker tab
    var chute_checker = document.createElement ('div');
    chute_checker.innerHTML = '<div id="vista_left_div" style="width:-moz-available;" ><iframe sandbox="allow-same-origin allow-scripts allow-popups allow-forms" src="https://sortcenter-menu-eu.amazon.com/audit/" style="width:100%;height:800px;" ></iframe></div>' +
        '<div id="vista_div_right"  style="border: solid black 2px;height:100%;" >' +
        '<center><span style="font-size:16px;margin-bottom:5px;">Failed Moves</span></center>' +
        '<table cellpadding="5"  border="1" id="chute_checker_vista_failed_tabelka" style="display:inline;"><tbody>' +
        '<tr style="position:sticky;top:0px;background-color:azure;" >' +
        '<td style="padding-inline:5px;" >Paczka</td>' +
        '<td style="padding-inline:5px;" >Stacking filter</td>' +
        '<td style="padding-inline:5px;" >Skan do</td>' +
        '<td style="padding-inline:5px;" >Status</td>' +
        '</tr>' +
        '</tbody></table>' +
        '</div>';
    chute_checker.setAttribute ('id', 'chute_checker_vista');
    chute_checker.setAttribute ('class', '');
    chute_checker.setAttribute ('style', 'display:flex;padding-top:50px;visibility:visible;');
    document.getElementById("pageContent").appendChild(chute_checker);


    var chute_checker_info = document.createElement ('div');
    chute_checker_info.innerHTML = '<div id="vista_info_div">' +
        '<b>Jeżeli w lewym okienku pokazuje się info "Required cookies are not set. Redirecting to login page." należy:</b><br>' +
        '1. Przejść na stronę <a href="http://fcmenu-dub-regionalized.corp.amazon.com/basic/login" target="_blank">skanera</a> w nowej karcie<br>' +
        '2. Zalogować się na skanerze<br>' +
        '3. Wejść tam na funkcję 103 (bardzo ważne)<br>' +
        '4. Można zamknąć stronę Skanera, teraz już Chute Checker będzie działał po odświeżeniu tej strony z VISTA';
    chute_checker_info.setAttribute ('style', 'padding-bottom:25px;padding-top:25px;');
    document.getElementById("mainContent").appendChild(chute_checker_info);


    // Stage audit tab
    var stage_audit = document.createElement ('div');
    stage_audit.innerHTML = '<div id="Stage_audit_left" style="float:left;" /><div id="stages_container" /></div>' +
        '</div>' +
        '<div id="Stage_audit_right" style="float:right;"/> <div id="stages_result" style="width:1000px;height:1000px;padding-left:25px;"/></div>' +
        '</div>';
    stage_audit.setAttribute ('id', 'stage_audit_vista');
    stage_audit.setAttribute ('style', 'padding-top:50px;position:absolute;visibility:hidden;');
    document.getElementById("pageContent").appendChild(stage_audit);



    setTimeout(function() {
        background_worker();
    },1000);


    document.getElementById ("Vaster_Chute_Checker").addEventListener (
        "click", Vaster_Chute_Checker, false
    );

    document.getElementById ("Vaster_Stage_Audyt").addEventListener (
        "click", Vaster_Stage_Audyt, false
    );

    function Vaster_Chute_Checker()
    {
        document.getElementById("chute_checker_vista").style.visibility = "visible";
        document.getElementById("chute_checker_vista").style.display = "flex";

        document.getElementById("Vaster_Chute_Checker").style.color = "black";
        document.getElementById("Vaster_Chute_Checker").style.fontweight = "bold";

        document.getElementById("Vaster_Stage_Audyt").style.color = "white";
        document.getElementById("Vaster_Stage_Audyt").style.fontweight = "normal";

        document.getElementById("stage_audit_vista").style.visibility = "hidden";
        document.getElementById("stage_audit_vista").style.display = "none";
    }

    function Vaster_Stage_Audyt()
    {
        document.getElementById("stage_audit_vista").style.visibility = "visible";
        document.getElementById("stage_audit_vista").style.display = "block";

        document.getElementById("Vaster_Stage_Audyt").style.color = "black";
        document.getElementById("Vaster_Stage_Audyt").style.fontweight = "bold";

        document.getElementById("Vaster_Chute_Checker").style.color = "white";
        document.getElementById("Vaster_Chute_Checker").style.fontweight = "normal";

        document.getElementById("chute_checker_vista").style.visibility = "hidden";
        document.getElementById("chute_checker_vista").style.display = "none";
    }

    // Użycie funkcji do stworzenia tabeli
    const tableElement = createTableFromArray(dataArray);

    // Dodanie tabeli do elementu DOM (na przykład do body)
    document.getElementById("stage_audit_vista").appendChild(tableElement);




})();



function createTableFromArray(dataArray) {
    // Tworzenie tabeli
    const table = document.createElement('table');

    // Iteracja przez tablicę
    for (let i = 0; i < dataArray.length; i++) {
        const row = document.createElement('tr');
        row.id = dataArray[i][1];
        row.style = "padding-left:2px;";
        const cell1 = document.createElement('td'); // Pierwsza kolumna
        const cell2 = document.createElement('td'); // Druga kolumna
        const cell3 = document.createElement('td'); // Trzecia kolumna
        const cell4 = document.createElement('td'); // Czwarta kolumna
        const cell5 = document.createElement('td'); // Piąta kolumna

        cell1.style = "padding:2px;background-color:silver;color:black;";
        cell2.style = "padding:2px;background-color:silver;color:black;";
        cell3.style = "padding:2px;background-color:silver;color:black;";
        cell4.style = "padding:2px;background-color:silver;color:black;";
        cell5.style = "padding:2px;background-color:silver;color:black;";

        // Ustalenie tekstu dla pierwszej i drugiej komórki
        // cell1.textContent = dataArray[i][1]; // Drugi element
        // cell2.textContent = dataArray[i][0]; // Pierwszy element

        // Tworzenie hiperłącza
        const link = document.createElement('a');
        link.href = "https://trans-logistics-eu.amazon.com/sortcenter/tantei?nodeId=KTW1&searchType=Container&searchId=" + dataArray[i][0]; // Link prowadzi do pierwszego elementu
        link.style.color = "purple";
        link.textContent = dataArray[i][1]; // Tekst hiperłącza

        // Dodawanie hiperłącza do pierwszej komórki
        cell1.appendChild(link);

        // https://drive.corp.amazon.com/view/nowaratn@/vaster/not_ok_check.png

        // Druga kolumna z guzikiem OK
        const button_ok = document.createElement('button');
        button_ok.style = 'background:url("https://drive.corp.amazon.com/view/nowaratn@/vaster/ok_check.png") no-repeat; display:ruby-text-container; width:20px; background-size:contain;';
        cell4.appendChild(button_ok);


         // Trzevia kolumna z guzikiem NOK
        const button_nok = document.createElement('button');
        button_nok.style = 'background:url("https://drive.corp.amazon.com/view/nowaratn@/vaster/not_ok_check.png") no-repeat; display:ruby-text-container; width:20px; background-size:contain;';
        cell5.appendChild(button_nok);




        // Czwarta kolumna pusta
        // Nie trzeba dodawać żadnej zawartości


        // Piąta kolumna z obrazkiem
        const button_info = document.createElement('button');
        button_info.style = 'background:url("https://drive.corp.amazon.com/view/nowaratn@/vaster/info_check.png") no-repeat; display:ruby-text-container; width:20px; background-size:contain;';
        cell3.appendChild(button_info);


        // Dodawanie komórek do wiersza
        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);
        row.appendChild(cell4);
        row.appendChild(cell5);

        // Dodawanie wiersza do tabeli
        table.appendChild(row);

        row.style.borderBottom = '1px solid #000'; // Możesz dostosować styl linii
        row.style.padding = "2px";
    }

    table.style.position = "absolute";
    table.style.border = "solid 3px black";
    table.style.width = "auto";

    // Zwracanie gotowej tabeli
    return table;
}


async function background_worker(){

    for (var i = 0;i<100000000000;i++)
    {
        var refresh;
        var refresh_rate;
        refresh = localStorage.getItem("chute_checker_refresh");
        refresh_rate = localStorage.getItem("chute_checker_refresh_rate");
        get_failed_moves();
        // console.log(refresh);
        // console.log(refresh_rate);

        if(refresh != undefined && refresh == "true")
        {
            get_failed_moves();
        }

        if(refresh_rate != undefined)
        {
            await sleep(refresh_rate * 60 * 1000);
        }
        else
        {
            await sleep(3 * 60 * 1000);
        }
    }
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

async function get_failed_moves(){

    czysc_failed();
    var audio;

    // Jaka zmiana
    var d = new Date();
    var godzina = d.getHours();

    var dzien = d.getDate();
    var miesiac = d.getMonth();
    miesiac = miesiac + 1;
    var rok = d.getFullYear();

    var data_start;
    var dzien_start;
    var miesiac_start;
    var rok_start;

    var dzien_koniec;
    var miesiac_koniec;
    var rok_koniec;

    var data_koniec;
    var start_time_ms;
    var end_time_ms;

    var dzisiaj;
    var wczoraj;
    var jutro;

    // DS
    // Jeżeli dzienna zmiana to spoko
    if(godzina >= 7 && godzina <=17)
    {
        dzien = d.getDate();
        miesiac = d.getMonth();
        miesiac = miesiac + 1;
        rok = d.getFullYear();

        data_start = rok + '/' + miesiac + '/' + dzien + ' 7:00';
        data_koniec = rok + '/' + miesiac + '/' + dzien + ' 17:30';
        start_time_ms = Math.floor(new Date(data_start).getTime() / 1000);
        end_time_ms = Math.floor(new Date(data_koniec).getTime() / 1000)
    }
    else
    {
        // NS po północy
        // jeżeli po północy to start dzien wcześniej
        if(godzina >= 0 && godzina <= 6)
        {
            dzisiaj = new Date();
            jutro = new Date(dzisiaj);
            jutro.setDate(dzisiaj.getDate() + 1);


            dzien_start = dzisiaj.getDate();
            miesiac_start = dzisiaj.getMonth();
            rok_start = dzisiaj.getFullYear();

            dzien_koniec = jutro.getDate();
            miesiac_koniec = jutro.getMonth();
            rok_koniec = jutro.getFullYear();

            data_start = rok_start + '/' + miesiac_start + '/' + dzien_start + ' 18:30';
            data_koniec = rok_koniec + '/' + miesiac_koniec + '/' + dzien_koniec + ' 06:00';
            start_time_ms = Math.floor(new Date(data_start).getTime() / 1000);
            end_time_ms = Math.floor(new Date(data_koniec).getTime() / 1000)
        }
        // NS przed północą
        // jeżeli przed północą to zaczynamy dzisiaj, ale konczymy jutro
        else
        {
            dzisiaj = new Date();
            wczoraj = new Date(dzisiaj);
            wczoraj.setDate(dzisiaj.getDate() - 1);


            dzien_start = wczoraj.getDate();
            miesiac_start = wczoraj.getMonth();
            rok_start = wczoraj.getFullYear();

            dzien_koniec = dzisiaj.getDate();
            miesiac_koniec = dzisiaj.getMonth();
            rok_koniec = dzisiaj.getFullYear();

            data_start = rok_start + '/' + miesiac_start + '/' + dzien_start + ' 18:30';
            data_koniec = rok_koniec + '/' + miesiac_koniec + '/' + dzien_koniec + ' 06:00';
            start_time_ms = Math.floor(new Date(data_start).getTime() / 1000);
            end_time_ms = Math.floor(new Date(data_koniec).getTime() / 1000)
        }
    }

    //    console.log(start_time_ms);
    //    console.log(end_time_ms);

    var url = "jsonObj=%7B%22nodeId%22%3A%22KTW1%22%2C%22nodeType%22%3A%22FC%22%2C%22entity%22%3A%22getQualityMetricDetails%22%2C%22metricType%22%3A%22FAILED_MOVES%22%2C%22containerTypes%22%3A%5B%22PACKAGE%22%2C%22PALLET%22%2C%22GAYLORD%22%2C%22BAG%22%2C%22CART%22%5D%2C%22startTime%22%3A";
    url += start_time_ms + '000';
    url += "%2C%22endTime%22%3A";
    url += end_time_ms + '000';
    url += "%2C%22metricsData%22%3A%7B%22nodeId%22%3A%22KTW1%22%2C%22pageType%22%3A%22OUTBOUND%22%2C%22refreshType%22%3A%22%22%2C%22device%22%3A%22DESKTOP%22%2C%22nodeType%22%3A%22FC%22%2C%22userAction%22%3A%22FAILED_MOVES_SUBMIT_CLICK%22%7D%7D";
    var failed_moves = await httpGetAsync("https://trans-logistics-eu.amazon.com/sortcenter/vista/controller/getQualityMetricDetails?" + url);

    var tablica = failed_moves.split("},{");

    //    console.log(tablica);

    for(var i=0;i<tablica.length;i++)
    {
        //   console.log(tablica[i]);

        // Jeżeli jest bląd
        if (tablica[i].indexOf("reason") > -1)
        {
            var status = getFromBetween.get(tablica[i],'reason":"','","successfulScans');
            var stacking_filter = getFromBetween.get(tablica[i],'stackingFilter":"','","destination');
            var destination = getFromBetween.get(tablica[i],'destination":"','","workInSeconds');
            var source = getFromBetween.get(tablica[i],'source":"','","userName');
            var login = getFromBetween.get(tablica[i],'userLogin":"','","location');
            var container_id = getFromBetween.get(tablica[i],'containerId":"','","trackingId');

            document.getElementById("chute_checker_vista_failed_tabelka").innerHTML = document.getElementById("chute_checker_vista_failed_tabelka").innerHTML +
                '<tr style="font-size:16px;padding-inline:5px;display:inline;"><td><a href="https://trans-logistics-eu.amazon.com/sortcenter/tt?setNodeId=KTW1&setContainerId=' + container_id + '" >' + container_id + '</a></td>' +
                '<td style="padding-inline:5px;" >' + stacking_filter + '</td>' +
                '<td style="padding-inline:5px;" >' + destination + '</td>' +
                '<td style="padding-inline:5px;" >' + status + '</td>' +
                '<td></td></tr>';

            audio = new Audio('https://drive.corp.amazon.com/view/nowaratn@/Chute_Checker/Failed_move.mp3');
            audio.play();
        }
        // jeżeli nie ma błędów
        else
        {
            document.getElementById("chute_checker_vista_failed_tabelka").innerHTML = document.getElementById("chute_checker_vista_failed_tabelka").innerHTML + "<center style='font-size:32px;'>Brak błędów</center>";
        }
    }
}

function czysc_failed(){

    var ile = document.getElementById("chute_checker_vista_failed_tabelka").children.length;
    var i = 1;
    for (i;i<=ile;i++)
    {
        if(document.getElementById("chute_checker_vista_failed_tabelka").children[i] != undefined)
        {
            document.getElementById("chute_checker_vista_failed_tabelka").children[i].remove();
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

