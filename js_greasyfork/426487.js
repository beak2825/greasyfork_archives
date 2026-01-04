// ==UserScript==
// @name         CzyjeAuto.exe
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Oznacza auta dla danego Clerka w SSP.
// @author       NOWARATN
// @match        https://trans-logistics-eu.amazon.com/ssp/dock/ob
// @icon         https://icons.iconarchive.com/icons/custom-icon-design/flatastic-2/256/truck-icon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426487/CzyjeAutoexe.user.js
// @updateURL https://update.greasyfork.org/scripts/426487/CzyjeAutoexe.meta.js
// ==/UserScript==

setTimeout(function() {

    var lista = "";
    var lista_temp = "";
    var i,j,k,l, vrid_col,vrid_row,location;
    var vrid,kto,brama;

    var node = document.createElement ('div');
    node.innerHTML = '<input type="button" id="czyj_guzik_id" value="Wprowadź liste VRID"><input type="button" id="wczytaj_guzik_id" value="wczytaj"></input><textarea id="textarea_id" style="visibility:hidden;"></textarea>';
    node.setAttribute ('id', 'czyj_div_id');
    node.setAttribute ('style', 'left:300px;top:10px;z-index:99999;position:fixed;');
    document.getElementsByTagName("body")[0].appendChild(node);

    document.getElementById ("czyj_guzik_id").addEventListener (
        "click", CzyjeAutoAction, false
    );
    document.getElementById ("wczytaj_guzik_id").addEventListener (
        "click", WczytajAction, false
    );

    function CzyjeAutoAction (zEvent)
    {
        if(document.getElementById("textarea_id").style.visibility == "visible")
            document.getElementById("textarea_id").style.visibility = "hidden";
        else
            document.getElementById("textarea_id").style.visibility = "visible";
    }

    function WczytajAction (zEvent)
    {
        lista = document.getElementById("textarea_id").value.split("\n");
      //  console.log(lista);
    }

    for(i=0;i<20;i++)
    {
        if(document.getElementsByTagName("tr")[i].children[1] != undefined && document.getElementsByTagName("tr")[i].children[1].innerText == "Alerts")
        {
            vrid_row = i;
           // console.log(vrid_row);
        }


    }

    for(i=0;i<40;i++)
    {
        if(document.getElementsByTagName("tr")[vrid_row] != undefined && document.getElementsByTagName("tr")[vrid_row].children[i] != undefined && document.getElementsByTagName("tr")[vrid_row].children[i].innerText == "VR Id")
        {
            vrid_col = i;
          //  console.log(vrid_col);
        }

        if(document.getElementsByTagName("tr")[vrid_row] != undefined && document.getElementsByTagName("tr")[vrid_row].children[i] != undefined && document.getElementsByTagName("tr")[vrid_row].children[i].innerText == "Location")
        {
            location = i;
            console.log(location);
        }
    }

    setInterval(function(){
        if(lista != "")
        {
            for(j=10;j<=50;j++)
            {
                for(k=0;k<lista.length;k++)
                {
                    if(document.getElementsByTagName("tr")[j].children[vrid_col] != undefined)
                    {
                        if(lista[k] != undefined)
                        {
                            lista_temp = lista[k].split("\t");
                            vrid = lista_temp[0];
                            brama = lista_temp[1];
                            kto = lista_temp[2];

                            if(vrid != undefined && vrid != "")
                            {
                                if(document.getElementsByTagName("tr")[j].children[vrid_col].innerText.substr(0,9) == vrid)
                                {
                                    document.getElementsByTagName("tr")[j].style.color = "darkviolet";
                                    if(document.getElementsByTagName("tr")[j].children[location] != undefined)
                                    {
                                          // Jeżeli już jest na bramie
                                        if(document.getElementsByTagName("tr")[j].children[location].children[0] != undefined && document.getElementsByTagName("tr")[j].children[location].children[0].children[1] != undefined && document.getElementsByTagName("tr")[j].children[location].children[0].children[1].innerText.length < 8)
                                        {
                                            document.getElementsByTagName("tr")[j].children[location].children[0].children[1].innerText = document.getElementsByTagName("tr")[j].children[location].innerText + " [" + brama + "](" + kto + ")";
                                        }
                                        else if(document.getElementsByTagName("tr")[j].children[location].innerText.length < 8)
                                        {
                                          //  console.log(document.getElementsByTagName("tr")[j].children[location].innerText);
                                          //  console.log(kto);
                                            document.getElementsByTagName("tr")[j].children[location].innerText = document.getElementsByTagName("tr")[j].children[location].innerText + " [" + brama + "](" + kto + ")";
                                            break;
                                        }
                                    }
                                }
                            }
                            else
                            {
                                if(document.getElementsByTagName("tr")[j].children[vrid_col].innerText.substr(0,9) == lista[k])
                                {
                                    document.getElementsByTagName("tr")[j].style.color = "darkviolet";
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    }, 3000);
}, 5000);