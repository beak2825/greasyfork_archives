// ==UserScript==
// @name         Check FMC Comments
// @namespace    http://tampermonkey.net/
// @version      2.01
// @description  Check if any late departure VRID doesn't have a comment.
// @author       NOWARATN
// @match        https://trans-logistics-eu.amazon.com/fmc/execution/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395602/Check%20FMC%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/395602/Check%20FMC%20Comments.meta.js
// ==/UserScript==

setInterval(function() {
    console.log("test");
    if(document.getElementsByClassName("datatable-widget-left-inline")[0] != undefined && document.getElementById("FMC_Comments_id") == null || document.getElementById("FMC_Comments_id") == undefined)
    {
        console.log("test2");

        // Guzik do sprawdzania wyjazdów
        var Wyjazdy = document.createElement ('div');
        Wyjazdy.innerHTML = '<button id="Button_Sprawdz_wyjazd" type="button" class="a-button a-button-thumbnail a-spacing-none a-button-base fmc-icon-btn float-left start" style="position:absolute;z-index:9999;display:ruby;">SPRAWDŹ KOMENTARZE</button>';
        Wyjazdy.setAttribute ('id', 'FMC_Comments_id');
        document.getElementsByClassName("widget-holder")[0].children[0].appendChild(Wyjazdy);

        document.getElementById ("Button_Sprawdz_wyjazd").addEventListener (
            "click", ButtonClick2, false
        );

        // Okienko informacyjne
        var Okienko = document.createElement ('div');
        Okienko.innerHTML = '<div id="Okienko_info" style="z-index:3;position:fixed;display:none;width:600px;height:420px;background-color:#EBB1B1;color:#973939;left:60vw;top:20vh;' +
            'border: 2px solid #973939;border-radius: 10px;margin: 0 auto 15px;text-align: center;padding: 20px;font-size:large;">' +
            '<div id="zamknij" style="float:right;margin-top:-30px;margin-right:-30px;cursor:pointer;color: #fff;border: 1px solid #AEAEAE;border-radius: 30px;background: #605F61;font-size: 24px;font-weight: bold;display: inline-block;line-height: 0px;padding: 11px 3px;">x</div>' +
            '<div id="Okienko_infoheader">' +
            'Lista pojazdów, które nie wyjechały z Yardu KTW1 na czas:<br>' +
            '(oraz nie posiadają stosownego komentarza)</div><br><br>' +
            '<div id="Okienko_info_lista" style="text-align:left;color:black;float:left;"></div><div id="Okienko_info_lista2" style="text-align:right;color:grey;float:right;"><div></div><br>' +
            '';
        Okienko.setAttribute ('id', 'myContainer2');
        document.getElementsByClassName("widget-holder")[0].children[0].appendChild(Okienko);

        document.getElementById ("zamknij").addEventListener (
            "click", ButtonClickZamknij, false
        );

        // Przewijanie okienka
        dragElement(document.getElementById("Okienko_info"));
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

        function ButtonClickZamknij (zEvent)
        {
            document.getElementById("Okienko_info_lista").innerText = "";
            document.getElementById("Okienko_info").style.display = "none";
        }

        function ButtonClick2 (zEvent)
        {


            //document.getElementsByClassName("ui-icon ui-icon-triangle-1-s")[0].click();
            var linijki;
            var i = 0;
            var k = 2;
            var licznik = 0;
            var komentarz = "";
            var comudolega = "";
            linijki = document.getElementsByClassName("ui-icon ui-icon-triangle-1-e");
            console.log(linijki.length);
            for(i;i<linijki.length;i++)
            {
                if(linijki[i] != null)
                {
                    linijki[i].click();

                    if(document.getElementsByClassName("stop-departure")[2].children[0] == null)
                    {
                        k=7;
                    }
                    else
                    {
                        k=2;
                    }

                    var powinien_wyjechac = document.getElementsByClassName("stop-departure")[k].children[0].attributes[0].value;
                    if(powinien_wyjechac != null)
                    {
                        powinien_wyjechac = powinien_wyjechac.substring(0, powinien_wyjechac.length - 3);
                        // console.log(powinien_wyjechac);
                        if(document.getElementsByClassName("stop-departure")[k+1].children[0].children[0].children[0].children[1].children[0] != null)
                        {
                            var wyjazd = document.getElementsByClassName("stop-departure")[k+1].children[0].children[0].children[0].children[1].children[0].attributes[0].nodeValue;
                            wyjazd = wyjazd.substring(0, wyjazd.length - 3);

                            if(wyjazd > powinien_wyjechac)
                            {
                                // Jeżeli brak komentarza:
                                komentarz = document.getElementsByClassName("stop-departure")[k+2].children[0].children[0].children[0].children[1].innerText
                                if(komentarz == "")
                                {
                                    komentarz = komentarz.toLowerCase();
                                    console.log(komentarz.length);
                                    // if(komentarz != "" && !komentarz.includes("root cause") ||  !komentarz.includes("rc"))
                                    //  { comudolega = "No Root Cause." }

                                    console.log(document.getElementsByClassName("stop-departure")[k+2]);
                                    document.getElementById("Okienko_info").style.display = "block";
                                    console.log("Wyjazd: "+wyjazd+"  - Powinien wyjechać: "+powinien_wyjechac);
                                    var VRID;
                                    var LANE;
                                    var y;
                                    var VRID_i;
                                    var LANE_i;

                                    for(y=0;y<document.getElementById("fmc-execution-plans-vrs").children[0].children[0].children.length;y++)
                                    {
                                        if(document.getElementById("fmc-execution-plans-vrs").children[0].children[0].children[y].innerText == "VR ID")
                                        { VRID_i = y }
                                        if(document.getElementById("fmc-execution-plans-vrs").children[0].children[0].children[y].innerText == "Facility Sequence")
                                        { LANE_i = y }
                                    }


                                    VRID = document.getElementsByTagName("tbody")[1].rows[i].children[VRID_i].innerText;
                                    LANE = document.getElementsByTagName("tbody")[1].rows[i].children[LANE_i].innerText;
                                    document.getElementById("Okienko_info_lista").innerText = document.getElementById("Okienko_info_lista").innerText + VRID + " : " + LANE + " \r\n";
                                    document.getElementById("Okienko_info_lista2").innerText = document.getElementById("Okienko_info_lista2").innerText = comudolega + " \r\n";
                                    document.getElementsByClassName("ui-icon ui-icon-triangle-1-s")[0].parentElement.parentElement.style.color = "red";
                                    comudolega = "";
                                    licznik++;
                                }
                            }
                        }
                    }
                    if(document.getElementsByClassName("ui-icon ui-icon-triangle-1-s")[0] != null)
                    {
                        document.getElementsByClassName("ui-icon ui-icon-triangle-1-s")[0].click();
                    }
                }
            }
            if(licznik > 0)
            {
                document.getElementById("Button_Sprawdz_wyjazd").style.color = "red";
            }
            else{
                document.getElementById("Button_Sprawdz_wyjazd").style.color = "green"; }
        }
        //clearInterval(timer);
    }
}, 500);

