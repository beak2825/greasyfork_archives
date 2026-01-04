// ==UserScript==
// @name         FlowYo
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Flow multitool
// @author       NOWARATN
// @match        https://picking-nexus.dub.amazon.com/KTW1/PPProperties/*
// @match        https://fccollateui-dub.amazon.com/warehouse/KTW1/auto_collate
// @match        https://ktw1-portal.amazon.com/gp/picking/batches.html*
// @match        https://rodeo-dub.amazon.com/KTW1/ExSD?yAxis=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389941/FlowYo.user.js
// @updateURL https://update.greasyfork.org/scripts/389941/FlowYo.meta.js
// ==/UserScript==


var $ = window.jQuery;

// Kolorowanie Min. Prio
if(window.location.href.indexOf("picking-nexus.dub.amazon.com/KTW1/PPProperties/") > -1)
{
    if(document.getElementById("minPriorityOptions").innerText == "0 - Min Priority")
        document.getElementById("minPriorityOptions").style = "color:green;";
    if(document.getElementById("minPriorityOptions").innerText == "4 - Normal")
        document.getElementById("minPriorityOptions").style = "color:yellow;";
    if(document.getElementById("minPriorityOptions").innerText == "10 - Premium")
        document.getElementById("minPriorityOptions").style = "color:orange;";
    if(document.getElementById("minPriorityOptions").innerText == "16 - Same/Next")
        document.getElementById("minPriorityOptions").style = "color:red;";
}

// Policz batche
if(window.location.href.indexOf("ktw1-portal.amazon.com/gp/picking/batches.html") > -1)
{
    var div_batch_textarea = document.createElement ('div');
    div_batch_textarea.innerHTML = '<input type="textarea" id="batch_textarea_Medium" rows="3" style="width:12em;"></input></br><input type="textarea" id="batch_textarea_large" rows="3" style="width:12em;"></input>'; /////// tekst w guziku
    div_batch_textarea.setAttribute('id', 'multi_textarea_div');
    document.getElementsByClassName("picking-color6")[0].appendChild(div_batch_textarea);

    setInterval(function(){
    var medium = 0;
    var large = 0;
    var ile = document.getElementsByTagName("td").length;

    for(var i = 0;i<ile;i++)
    {
     if(document.getElementsByTagName("td")[i].title == " Code ")
     {
         if(document.getElementsByTagName("td")[i].innerText == "MM")
         {
             medium++;
         }
         if(document.getElementsByTagName("td")[i].innerText == "MXL")
         {
             large++;
         }
     }
    }

    document.getElementById("batch_textarea_Medium").value = "MultiMedium (MM): [" + medium + "]";
    document.getElementById("batch_textarea_large").value = "MultiXLarge (MXL): [" + large + "]";
    },5000);
}

// Pokaż routing
if(window.location.href.indexOf("rodeo-dub.amazon.com/KTW1/ExSD?yAxis=") > -1)
{
    var div_routing_textarea = document.createElement ('div');
    div_routing_textarea.innerHTML = '<input type="textarea" id="routing_textarea" style="width:90em;"></input>'; /////// tekst w guziku
    div_routing_textarea.setAttribute('id', 'routing_textarea_div');
    div_routing_textarea.setAttribute('style', 'display:inline;');
    document.getElementsByClassName("filter-count-page-age-timer")[0].appendChild(div_routing_textarea);

    var tabele = document.getElementsByClassName("table-wrapper");
    var kierunek = "";
    var ilosc = "";
    var wynik = "";

    for(var i = 1;i<tabele.length;i++)
    {
        kierunek = tabele[i].children[0].id;
        kierunek = kierunek.substring(0, kierunek.length -5);

        for(var j = 0;j<tabele[i].children[0].children[0].children.length;j++)
        {
           // console.log(tabele[i].children[0].children[0].children[j].children[0]);
            var gdzie = tabele[i].children[0].children[0].children[j].children[0].innerText;
            if(gdzie.includes("PickingPickedRouting"))
            {
                console.log("if");
                ilosc = tabele[i].children[0].children[0].children[j].children[1].innerText;
                ilosc = ilosc.replace(/\s/g, "");
                ilosc = ilosc.replace(/ /g, '')
                console.log(ilosc);
            }
        }
        if(ilosc != "0" && ilosc != "" && ilosc != " ")
        {
            wynik = wynik + kierunek + ": " + ilosc + "   ";
        }
        ilosc = 0;
    }
    console.log(wynik);
    document.getElementById("routing_textarea").value = wynik;

}


// Multi Collate
if(window.location.href.indexOf("fccollateui-dub.amazon.com/warehouse/KTW1/auto_collate") > -1)
{
    var div_guzik_multi = document.createElement ('div');
    div_guzik_multi.innerHTML = '<button id="multi_collate_guzik" type="button" style="">multi</button>'; /////// tekst w guziku
    div_guzik_multi.setAttribute('id', 'multi_collate_guzik_div');
    div_guzik_multi.setAttribute('style', 'display:inline;');
    document.getElementById("sub-header-info").appendChild(div_guzik_multi);

    var div_multi_textarea = document.createElement ('div');
    div_multi_textarea.innerHTML = '<input type="textarea" id="multi_textarea" rows="3" style=""></input>'; /////// tekst w guziku
    div_multi_textarea.setAttribute('id', 'multi_textarea_div');
    div_multi_textarea.setAttribute('style', 'display:none;');
    document.getElementById("multi_collate_guzik_div").appendChild(div_multi_textarea);

    var div_guzik_auto = document.createElement ('div');
    div_guzik_auto.innerHTML = '<button id="auto_collate_guzik" type="button" style="">colate all</button>'; /////// tekst w guziku
    div_guzik_auto.setAttribute('id', 'auto_collate_guzik_div');
    div_guzik_auto.setAttribute('style', 'display:none;');
    document.getElementById("multi_textarea_div").appendChild(div_guzik_auto);


    document.getElementById("multi_collate_guzik").addEventListener (
        "click", ButtonClickAutoCollate, false
    );

    document.getElementById("auto_collate_guzik").addEventListener (
        "click", ButtonClickAutoCollateAll, false
    );

    var textarea = document.getElementById("multi_textarea_div");
    function ButtonClickAutoCollate (zEvent)
    {
        if(textarea.getAttribute("style") == "display:none;")
        {
            document.getElementById("multi_textarea_div").setAttribute("style","display:block;float:inline-end;");
            document.getElementById("auto_collate_guzik_div").setAttribute("style","display:block;float:inline-end;");
        }
        else
        {
            document.getElementById("multi_textarea_div").setAttribute("style","display:none;");
            document.getElementById("auto_collate_guzik_div").setAttribute("style","display:none;");
        }
    }

    function ButtonClickAutoCollateAll (zEvent)
    {
        var textarea2 = document.getElementById("multi_textarea");
        var shipmenty_string;
        var tablica;
        var i = 0;

        shipmenty_string = textarea2.value;
        tablica = shipmenty_string.split(" ");

        console.log(shipmenty_string);
        console.log(tablica[0]);
        console.log(tablica[2]);

        var filtered = tablica.filter(function (el) {
            return el != null;
        });

        var counter = 0;
        var inter = setInterval(function(){
            if(tablica[i] != "" || tablica[i] != null || tablica[i] != 'undefined')
            {
                document.getElementById("consumer_reference_id").value = tablica[counter];
                document.getElementsByClassName("btn btnPrimary btnMedium inline-form")[0].click();

                counter++;
                if(counter === 10 || counter == tablica.length) {
                    clearInterval(inter);
                }
            }
        }, 3000);
    }

}
