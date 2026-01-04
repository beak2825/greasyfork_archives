// ==UserScript==
// @name         Polski raport TimeOffTask
// @namespace    http://tampermonkey.net/
// @version      1.68
// @description  try to take over the world!
// @author       nowaratn
// @match        https://time-off-task.corp.amazon.com/
// @icon         https://time-off-task.corp.amazon.com/assets/120px-Current_event_clock_3D-afdd35fa5082b64e0b64c2b17c32300ba6b7ff79d19eabcf70571775b91aa4b0.png
// @downloadURL https://update.greasyfork.org/scripts/423579/Polski%20raport%20TimeOffTask.user.js
// @updateURL https://update.greasyfork.org/scripts/423579/Polski%20raport%20TimeOffTask.meta.js
// ==/UserScript==

// GM_config.init(
// {
//   'id': 'ClerkConfig', // The id used for this instance of GM_config
//   'title': 'Clerk Utilities config',
//   'fields':
//   {
//       'Pick':
//       {
//           'label': 'Ile czasu odliczyć z OffTasku dla działu PICK?',
//           'type': 'textbox',
//           'title': 'PICK',
//           'default': 3
//       }
//   }
// });

var pl_button_styl = "border:solid;font-variant:small-caps;font-weight:bold;position:absolute;left:47%;border-color:black;color:floralwhite;background-image:linear-gradient(white,red);";
var skorygowany_czas = 0;

var inter = setInterval(function(){
    if(document.getElementById("progress-report-view") != undefined && document.getElementById("progress-report-view").children[0] != undefined && document.getElementById("progress-report-view").children[0].children[0] != undefined && document.getElementById("progress-report-view").children[0].children[0].children[0] != undefined)
    {
        if(document.getElementById("progress-report-view").children[0].children[0].children[0].innerText == "Report Complete!")
        {
            if(document.getElementById("dodaj_polskie_div") == undefined)
            {
                if(document.getElementsByClassName("container well")[1] != null)
                {
                    var dodaj_polskie = document.createElement ('div');
                    dodaj_polskie.id = "dodaj_polskie_div";
                    dodaj_polskie.class = "col-xs-6 left-form-field";
                    dodaj_polskie.innerHTML = '<br><input type="button" id="dodaj_polskie" class="btn" value="Dodaj guziki raportów PL." style="display:block;z-style:9999;">' +
                        'Automatycznie drukuj raport po naciśnięciu guzika <input type="checkbox" id="auto_druk" style="">';
                    document.getElementsByClassName("container well")[1].appendChild(dodaj_polskie);


                    document.getElementById("dodaj_polskie").addEventListener (
                        "click", ButtonClick_dodajpolskie, false
                    );

                    function ButtonClick_dodajpolskie (zEvent)
                    {

                        var i;
                        for (i = 0;i< document.getElementsByClassName("tot-profile row").length;i++)
                        {
                            var polskibutton = document.createElement ('div');
                            polskibutton.id = "polskibutton_div";
                            polskibutton.class = "polskibutton_class";
                            polskibutton.innerHTML = '<input type="button" id="pl_' + i + '" value="Drukuj raport" style="' + pl_button_styl + '">';
                            document.getElementsByClassName("profile-tot-report-well")[i].appendChild(polskibutton);

                            document.getElementById("pl_" + i).addEventListener (
                                "click", ButtonClick_alert, false
                            );
                        }
                    }
                }
            }


            if(document.getElementById("polskibutton_div") == undefined)
            {
                var i;
                for (i = 0;i< document.getElementsByClassName("tot-profile row").length;i++)
                {
                    var polskibutton = document.createElement ('div');
                    polskibutton.id = "polskibutton_div";
                    polskibutton.class = "polskibutton_class";
                    polskibutton.innerHTML = '<input type="button" id="pl_' + i + '" value="Drukuj raport" style="' + pl_button_styl + '">';
                    document.getElementsByClassName("profile-tot-report-well")[i].appendChild(polskibutton);

                    document.getElementById("pl_" + i).addEventListener (
                        "click", ButtonClick_alert, false
                    );
                }
            }
        }
    }

// if(document.getElementsByClassName("well text-center")[0] != undefined && document.getElementById("odlicz_ile") == undefined)
//     {
//         var odlicz_ile = document.createElement ('div');
//         odlicz_ile.id = "odlicz_ile_div";
//         odlicz_ile.innerHTML = '<br>Odlicz tyle minut pracownikowi z Off Tasku: <input type="text" id="odlicz_ile" style="display:block;z-style:9999;float:right;">' +
//             '<br><br>Automatycznie drukuj raport po naciśnięciu guzika <input type="checkbox" id="auto_druk" style="display:block;z-style:9999;float:right;">';
//         var temp = document.getElementsByClassName("col-xs-6 left-form-field").length
//         document.getElementsByClassName("col-xs-6 left-form-field")[temp-1].appendChild(odlicz_ile);
//     }


},500);

function ButtonClick_alert (zEvent)
{
    var skorygowany_czas_oryginal = 0;
    var skorygowany_czas_nowy = 0;
    var odlicz_ile = 0;
    var ile = 0;
    var element = zEvent.target;
    var ktory = "";
    var dom;
    var tabelka_odlicz = "";
    var duration = "";

    ktory = element.id.substring(3,element.id.length);
    //console.log(ktory);
    var backup;
    backup = document.getElementsByClassName("tot-profile row")[ktory].innerHTML;
    dom = document.getElementsByClassName("tot-profile row")[ktory];
    ile = dom.getElementsByClassName("table table-bordered tot-table")[1].children[1].children.length

    // odlicz_ile = parseInt(document.getElementById("odlicz_ile").value);
    // if(!Number.isInteger(odlicz_ile))
    // {
    //     document.getElementById("odlicz_ile").focus();
    //     document.getElementById("odlicz_ile").scrollIntoView();
    //     document.getElementById("odlicz_ile").focus();
    //     alert("Podana wartość minut do odliczenia nie jest liczbą (wpisano: " + odlicz_ile + ")");
    //     return;
    // }

// dodajemy kolumne "okres trwania ToT"
//    dom.getElementsByClassName("table table-bordered tot-table")[1].children[0].innerHTML = "<tr> <th>Start</th> <th>End</th> <th>Duration</th> <th>Okres trwania ToT</th> <th>Date / Time</th> <th>Task</th> <th>Process</th> <th>Quantity</th> </tr>"


//     for (var j = 0;j<ile;j++)
//     {
//         duration = dom.getElementsByClassName("table table-bordered tot-table")[1].children[1].children[j].children[2].innerText; // innerText: "00:07:43"
//         //console.log(duration);

//      //   dom.getElementsByClassName("table table-bordered tot-table")[1].children[1].children[j].children[2].innerText = odlicz_minuty(duration,odlicz_ile);

//         var dodaj_komorke_wynik = document.createElement ('td');
//         dodaj_komorke_wynik.innerHTML = odlicz_minuty(duration,odlicz_ile,"normalny");
//         dom.getElementsByClassName("table table-bordered tot-table")[1].children[1].children[j].children[2].appendChild(dodaj_komorke_wynik);

//     }

    //
    // tabelka TOTAL
    //
    //var total = dom.getElementsByClassName("table table-bordered tot-table")[1].children[2];
    // console.log("skorygowany_czas " + skorygowany_czas);
    // skorygowany_czas_oryginal = dom.getElementsByClassName("table table-bordered tot-table")[1].children[2].children[2].children[1].innerText; // "01:13:44"
    // console.log("skorygowany_czas_oryginal " + skorygowany_czas_oryginal);
    // skorygowany_czas_nowy = odlicz_minuty(skorygowany_czas_oryginal,skorygowany_czas,"skorygowany");
    // console.log("skorygowany_czas_nowy " + skorygowany_czas_nowy);
  //  dom.getElementsByClassName("table table-bordered tot-table")[1].children[2].children[2].children[0].innerText = skorygowany_czas_nowy;

    var strona = document.getElementsByClassName("tot-profile row")[ktory].innerHTML;

    strona = strona.replace('<button type="button" class="btn profile-refresh-button">Refresh</button>','');
    strona = strona.replace('<button type="button" class="btn profile-remove-button">Remove</button>','');
    strona = strona.replace('<td class="shift-info-edit-form-button">','');
    strona = strona.replace('<button class="btn shift-info-edit-button" type="button">Edit Times</button>','');
    strona = strona.replace('<button type="button" class="btn tot-table-print-button">Print Report</button>','');
    strona = strona.replace('<input type="button" id="pl_' + ktory + '" value="Drukuj raport" style="' + pl_button_styl + '">','');

    strona = strona.replace('<img src="//','<img src="https://');
    strona = strona.replaceAll('FC Management Area ID','ID obszaru na dziale');
    strona = strona.replaceAll('Shift','Zmiana');
    strona = strona.replaceAll('Warehouse','Budynek');

    strona = strona.replaceAll('Start','Godzina rozpoczęcia');
    strona = strona.replaceAll('First Break','Pierwsza przerwa');
    strona = strona.replaceAll('Lunch','Przerwa obiadowa');
    strona = strona.replaceAll('Second Break','Druga przerwa');
    strona = strona.replaceAll('Third Break','Trzecia przerwa');
    strona = strona.replaceAll('End','Godzina zakończenia');

    strona = strona.replaceAll('Clock Time Details','Odbicia na zegarze');
    strona = strona.replaceAll('Clock In','Odbicie na zegarze');
    strona = strona.replaceAll('Clock Out','Wybicie na zegarze');

    strona = strona.replaceAll('Duration','Czas trwania');
    strona = strona.replaceAll('Date / Time','Data / Czas');

    strona = strona.replaceAll('Process','Proces');
    strona = strona.replaceAll('Quantity','Ilość');

    strona = strona.replaceAll('Totals','Suma');
    strona = strona.replaceAll('Adjusted Time off Task','Skorygowany czas poza procesem');
    strona = strona.replaceAll('Actual Time off Task','Czas poza procesem');
    strona = strona.replaceAll('Task','Ścieżka procesowa');

    strona = strona.replaceAll(' CEST','');

    var windowFeatures = "menubar=no,location=no,resizable=yes,scrollbars=yes,status=yes,width=1000px,height=700px";
    var w = window.open('', 'ToT Raport',windowFeatures);
    w.document.body.innerHTML =
        '<head><title>TOT Report</title>' +
        '<style>table, th, td {border: 1px solid black;} td {padding-right: 5px; padding-left: 2px;} ' +
        '</style></head><body>'+
        strona +
        '<br><br>' +
        '<label>Pracownik:</label>' +
        '<label>___________________________________________</label>'+
        '<label style="padding-left: 3em;">Data:</label>'+
        '<label>________________</label></body>';

    if (document.getElementById("auto_druk").checked == true)
    {
        w.print();
        w.close();
    }



    document.getElementsByClassName("tot-profile row")[ktory].innerHTML = backup;
    strona = "";
    backup = "";

    document.getElementById(element.id).addEventListener (
                        "click", ButtonClick_alert, false
                    );

    skorygowany_czas = 0;
    element = null;
}

function odlicz_minuty(duration,odlicz,jaki)
{
    // innerText: "00:07:43"
    var i,j,k;
    var split;
    var wynik;

    var wyjscie = "";

    // innerText: "00:07:43"
    split = duration.split(":");

    // 00
    // 07
    // 43

    for(i=0;i<split.length;i++)
    {
        if(jaki == "normalny")
        {
            if(split[0] != "00") // off task dłuższy niż godzina?
            {
                //console.log("niemozliwe");

            }
            if(split[1] >= (10 + odlicz)) // wynik to nadal będzie kilkanaście minut (liczba dziesiętna się nie zmienia)
            {
               // console.log("1111");
                wynik = split[1] - odlicz;
               // console.log(wynik);
                if(wynik.length == 1)
                {
                    wynik = "0" + wynik;
                }
                wyjscie = split[0] + ":" + wynik + ":" + split[2];
              //  console.log(wyjscie);
                skorygowany_czas = skorygowany_czas + odlicz;
                return wyjscie;
            }
            else if(split[1] - odlicz >= 0)
            {
              //  console.log("3333");
                wynik = split[1] - odlicz;
              //  console.log(wynik);
                wyjscie = split[0] + ":0" + wynik + ":" + split[2];
             //   console.log(wyjscie);
                skorygowany_czas = skorygowany_czas + odlicz;
                return wyjscie;
            }
            else
            {
                return duration;
            }
        }
        else if (jaki == "skorygowany")
        {
            console.log("odliczam: " + odlicz);
            var ile_minut = 0;
            var ile_godzin = 0;
            var ile_minut_wynik = 0;

            var temp;
            var temp2;
            var temp3;

            if(split[0] != "00") // off task dłuższy niż godzina?
            {
                ile_godzin = split[0].substring(1);
                ile_minut = ile_godzin * 60;
            }
            console.log("ile_minut z samych godzin " + ile_minut);

            if(split[1].substring(0,1) >= 1) // jezeli minuty to liczba dwucyfrowa
            {

                ile_minut += parseInt(split[1]);
            }
            else
            {
                ile_minut += parseInt(split[1].substring(1));
            }

            console.log("ile_minut " + ile_minut);

            ile_minut_wynik = parseInt(ile_minut) - parseInt(odlicz);

            console.log("ile_minut_wynik " + ile_minut_wynik);

            // Skorygowany czas ma ponad godzinę
            if(ile_minut_wynik >= 60)
            {
                temp = (ile_minut_wynik % 60).toString();
                if(temp.length == 1)
                {
                    temp = "0" + temp;
                }

                temp2 = Math.floor(ile_minut_wynik/60).toString();
                if(temp2.length == 1)
                {
                    temp2 = "0" + temp2;
                }

                return temp2 + ":" + temp + ":" + split[2].toString();
            }
            else
            {
                return "00:" + (ile_minut_wynik % 60).toString() + ":" + split[2].toString();
            }
        }
    }
}