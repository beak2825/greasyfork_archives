// ==UserScript==
// @name         Arekino MiniScripty
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Vsetky skripty skombinovane
// @author       You
// @match        https://www.darkelf.cz/*
// @match        http://deficurky.detimes.cz/*
// @grant        GM_setValue
// @require      https://unpkg.com/sweetalert/dist/sweetalert.min.js
// @downloadURL https://update.greasyfork.org/scripts/395664/Arekino%20MiniScripty.user.js
// @updateURL https://update.greasyfork.org/scripts/395664/Arekino%20MiniScripty.meta.js
// ==/UserScript==

(function() {
    'use strict';
    addHighlightPlayerForMagic();
    addConfirmDialogNewTurn();
    removeAccentsFromOptions();
    //magickeHlaseniaPreZemku();
    //moNeutralky();
    //cervenaMagiaPriZemke();
    tlacitkaPriKuzleni();
    zobrazPrvyKlanIhned();
    odhadVHlaseniach();
    plosnyNakupDomov();
    akcnyPocitacUtoku();
    //preklikNaDeFicurky()
    upozornovacNaKuzla();


    function addHighlightPlayerForMagic()
    {
        if(!(document.URL.match("https://www.darkelf.cz/e.asp.*")||document.URL.match("https://www.darkelf.cz/l.asp.*")))
        {
            return;
        }

        const b = document.createElement("button");
        document.querySelectorAll("img[src='images/s/o.gif']")[1].parentElement.parentElement.append(b)
        b.onclick = HighLightPlayer;

        function HighLightPlayer(){
            let playerId= document.querySelectorAll("img[src='images/s/o.gif']")[1].parentElement.href.split('=')[1];
            let landDivs = [...window.parent.document.getElementsByName("mapa")[0].contentDocument.querySelectorAll('[id^=x][data-id_player="'+playerId+'"]')];
            let landIds = landDivs.map(x=>x.attributes["data-id"].value);
            let landNames = landDivs.map(x=>x.attributes["data-name"].value);

            let zipped = landIds.map((x,i)=>[x, landNames[i]]);

            const MAP_CASTING_LS_LANDS = "DE_mapCasting_lands";
            let leagueId = window.parent.document.getElementsByName("mapa")[0].contentDocument.body.onload.toString().split("'")[1];
            function getStorageKeyWithLeague(leagueId) {
                return `${MAP_CASTING_LS_LANDS}_${leagueId}`;
            }
            function setMapCastingLands(leagueId, lands) {
                console.log(leagueId,lands,getStorageKeyWithLeague(leagueId))
                window.localStorage.setItem(getStorageKeyWithLeague(leagueId), JSON.stringify({
                    lands,
                    updatedAt: Date.now()
                }));
            }
            setMapCastingLands(leagueId,zipped);
        }

    }

    function addConfirmDialogNewTurn()
    {
        if(!document.URL.match("https://www.darkelf.cz/Lista_Horni.asp"))
        {
            return;
        }
        const link = document.querySelector('a[href*="konec_kola.asp"]');
        link.addEventListener('click',async (e) => {
            e.preventDefault();
                let swalResult = await swal("", {
                    buttons: {
                        klikOdlog: "Kliknut kolo a relog",
                        klik: "Kliknut kolo",
                        cancel: "neklik"
                }});
                    switch (swalResult) {

                        case "klikOdlog":
                            await fetch('https://www.darkelf.cz/konec_kola.asp');
                            await fetch('https://www.darkelf.cz/odlogovat.asp')
                            window.parent.location.href = 'https://www.darkelf.cz/ligy.asp';
                            break;

                        case "klik":
                            await fetch('https://www.darkelf.cz/konec_kola.asp');
                            window.parent.location.href = 'https://www.darkelf.cz/world.htm';
                            break;

                        default:
                            break;
            }

        })
    }



    function removeAccentsFromOptions()
    {
        if (document.title === 'Aliance') {
            return
        }
        Array.prototype.slice.call(document.getElementsByTagName('Option')).forEach(x=>{x.innerText = x.innerText.normalize("NFD").replace(/[\u0300-\u036f]/g, "");});
        Array.prototype.slice.call(document.getElementsByTagName('Select')).forEach(x=>{ x.style.textAlign = "left";});
    }//x.className = 'list';

    function upozornovacNaKuzla()
    {
        if (document.title === 'Magie - sesílání kouzel') {
            let a = Array.prototype.slice.call(window.parent.frames[3].document.getElementsByClassName("land selectedLand")).map(x=>x.dataset.name).sort();
            if(a.length>0)
            {
            let div = document.createElement('div');
                div.innerText = "Su zaciarknute tieto zemky("+a.length+"): "+a.join(', ');
                document.body.prepend(div);
            let b = document.querySelector("#textAreaMagic");
            b.value = a.join(', ');
            }

        }
    }

    function preklikNaDeFicurky()
    {if (document.URL.match("https://www.darkelf.cz/e.asp.*")) {
        const btn = document.createElement('button');
        btn.innerHTML = 'DEfičurky';
        btn.className = 'butt_sml';
        btn.type = 'button';
        btn.onclick = (e) => {
            var domy = parseInt(document.getElementsByTagName('td')[15].innerText);
            var obyv = parseInt(document.getElementsByTagName('td')[17].innerText);
            var pocetVojakov = parseInt(document.getElementsByTagName('td')[19].innerText);
            var listaInf = getFrameDocument("lista_informace");
            var kola = listaInf.getElementsByTagName("span")[3].innerText;
            var pos = kola.search('\/');
            var odtahanychKol = parseInt(kola);
            var maxKol = parseInt(kola.substr(pos + 1));
            var pocetKol = maxKol - odtahanychKol;
            var listaHor = getFrameDocument("Lista_Horni")
            var odkazNaHlaseni = listaHor.querySelector('a[href="hlaseni.asp"]');
            var pocasCele = odkazNaHlaseni.children[0].title;
            pos = pocasCele.search("Počasí:");
            pos = pos + 14 + pocasCele.substr(pos + 13).search("-");
            var pocasie = parseInt(pocasCele.substr(pos));
            window.open("http://deficurky.detimes.cz/?domy=" + domy + "&obyv=" + obyv + "&voj=" + pocetVojakov + "&kola=" + pocetKol + "&pocasie=" + pocasie, '_blank');
        }
        const td = document.createElement('td');
        const tr = document.createElement('tr');
        td.append(tr);
        tr.append(btn);
        document.getElementsByTagName('tbody')[3].prepend(td);

    }
     if (document.URL.match("http://deficurky.detimes.cz/.*")) {
         var url = new URL(document.URL);
         if (url.searchParams.get("obyv") != undefined) {
             document.getElementsByTagName('input')[4].value = url.searchParams.get("obyv");
         }
         if (url.searchParams.get("kola") != undefined) {
             document.getElementsByTagName('input')[5].value = url.searchParams.get("kola");
         }
         if (url.searchParams.get("domy") != undefined) {
             document.getElementsByTagName('input')[10].value = url.searchParams.get("domy");
         }
         if (url.searchParams.get("pocasie") != undefined) {
             document.getElementsByTagName('input')[11].value = url.searchParams.get("pocasie");
         }
         if (url.searchParams.get("voj") != undefined) {
             document.getElementsByTagName('input')[12].value = url.searchParams.get("voj");
         }
     }

     function getFrameDocument(frameName) {
         const frame = window.parent.document.getElementsByName(frameName)[0];
         return frame.contentDocument;
     }
    }

    function magickeHlaseniaPreZemku()
    {
        if(!document.URL.match("https://www.darkelf.cz/l.asp\\?id=.*"))
        {
            return;
        }
        const toNodes = html =>
        new DOMParser().parseFromString(html, 'text/html').body.childNodes;

        var MenoZemky = (document.getElementsByTagName('th')[0].innerText.substring(10))+"-";//niektore zemky su prefixom inych, najdi aj s - uprostred Osada - Nespokojenost
        //var AlliesId=[];
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = onReadyAliPage;
        var url = "https://www.darkelf.cz/aliance.asp";
        xhttp.open("GET",url);
        xhttp.send();

        function onReadyAliPage()
        {
            if (this.readyState == 4 && this.status == 200) {
                var pocetNajdenych = 0;
                var response = this.responseText;
                var pos;
                do
                {
                    pos = response.search("forum_hrac")+11;
                    if(pos!=10)
                    {
                        pocetNajdenych+=1;
                        response = response.substring(pos);
                        var alliesId=parseInt(response);
                        var xhttp1 = new XMLHttpRequest();
                        xhttp1.onreadystatechange = onReadyHlaseniPage;
                        var url1 = "https://www.darkelf.cz/hlaseni.asp?id_player="+alliesId;
                        xhttp1.open("GET",url1);
                        xhttp1.responseType = 'blob';
                        xhttp1.send();

                        //AlliesId.push(parseInt(response));
                    }
                }
                while (pos!=10)
                    if(pocetNajdenych==0)
                    {
                        xhttp1 = new XMLHttpRequest();
                        xhttp1.onreadystatechange = onReadyHlaseniPage;
                        url1 = "https://www.darkelf.cz/hlaseni.asp";
                        xhttp1.open("GET",url1);
                        xhttp1.responseType = 'blob';
                        xhttp1.send();}
            }
        }

        function onReadyHlaseniPage()
        {
            if (this.readyState == 4 && this.status == 200) {
                var a = new FileReader();
                a.readAsText(this.response,'windows-1250');
                a.onloadend = function(){
                    var response = a.result
                    var dom = new DOMParser().parseFromString(response, 'text/html');
                    var hlasenia = dom.getElementsByTagName('tr');
                    var arrHlasenia = Array.from(hlasenia);
                    arrHlasenia.forEach((x,index)=>{
                        var pos=x.innerText.search(MenoZemky);
                        if(pos!=-1)
                        {
                        }
                        if(pos!=-1)
                        {
                            x.removeChild(x.childNodes[1]);
                            x.removeChild(x.childNodes[8]);
                            x.removeChild(x.childNodes[4]);
                            document.body.appendChild(x);
                            document.body.appendChild(arrHlasenia[index+1]);
                        }
                    })
                }

            }
        }

    }

    function moNeutralky()
    {
        if(!document.URL.match("https://www.darkelf.cz/l.asp\\?id=.*"))
        {
            return;
        }
        if (document.getElementsByTagName('td')[1].innerHTML != "\nNeobsazená země\n") {
            return;
        }
        //read input
        var string = document.getElementsByTagName('td')[5].innerHTML;
        var pos = string.search("<");
        var vojsko = string.substring(1, pos);
        var obranaElem = document.getElementsByTagName('td')[6].innerHTML;
        pos = obranaElem.search(">");
        var obranaString = obranaElem.substring(pos + 1, pos + 5);
        var obrana = parseInt(obranaString);
        var bonus = 0;
        var tdElements = document.getElementsByTagName('td');
        for (var i = 0; i < tdElements.length; i++) {
            var s = tdElements[i].innerHTML;
            var najdene = s.search("obrana");
            if (najdene == -1) {
                continue;
            }
            bonus = parseInt(s);
            break;
        }
        var denElement = parent.frames.Lista_Horni.document.getElementsByTagName('span')[0];
        var den;
        if (denElement == null) {
            var position = parent.frames.Lista_Horni.document.getElementsByTagName('a')[7].outerHTML.search('Den');
            var notParsedDen = parent.frames.Lista_Horni.document.getElementsByTagName('a')[7].outerHTML.substr(position + 4, 3);
            den = parseInt(notParsedDen);
        } else {
            den = denElement.innerHTML;
        }

        // calculate
        var MO = calulateMO(vojsko, obrana, bonus, den);
        //insert into document
        var zNode = document.createElement('td');
        if (MO != undefined) {
            for (var item in MO) {
                zNode.innerHTML += '<p style="color:red">MO: ' + item + ' - ' + Math.round(MO[item] * 1000)/10 + '%</p>';
            }
        } else {
            zNode.innerHTML = '<p style="color:red">Odlogla neutralka</p>';
        }
        zNode.setAttribute('id', 'myContainer');
        document.getElementsByTagName('td')[5].parentElement.parentElement.appendChild(zNode);


        function choose(n, k) {
            var hore = 1;
            var dole = 1;
            for (var i = 2; i <= n; i++) {
                hore *= i;
            }
            for (i = 2; i <= k; i++) {
                dole *= i
            }
            for (i = 2; i <= n - k; i++) {
                dole *= i
            }
            return hore / dole;
        }

        function calulateMO(vojsko, sila, bonus, den) {
            var i;
            var maxJednotiek = Math.floor((vojsko - 16) / 6) + 1;
            for (i = 0; i < maxJednotiek; i++) {
                var pocetDvojek = (vojsko - i * 6) / 8;
                var ZvysokPoDvojkach = (vojsko - i * 6) % 8;
                if (ZvysokPoDvojkach != 0) {
                    continue; //tolkoto jednotiek nemoze byt
                }
                var obrana = Math.floor((i * 5 + pocetDvojek * 4) * (1 + (bonus / 100))) + 10;
                var obyv = sila - Math.floor((i * 5 + pocetDvojek * 4) * (1 + (bonus / 100))) - 1;
                var maxObyv = +10 + +den;
                if (obyv <= (maxObyv)) {
                    obyv = sila - Math.floor((i * 5 + pocetDvojek * 4) * (1 + (bonus / 100))) - 1;
                    var domky = Math.max(48, i + pocetDvojek + obyv);
                    var MO = Math.floor((pocetDvojek * pocetDvojek * 3) / domky);
                    console.log(i+"-0-"+pocetDvojek+" "+obyv);
                    var minDomky = Math.max(48, i + pocetDvojek + obyv);
                    var results = new Object();
                    if (i > den * 2 + 6 || pocetDvojek > den * 2 + 2) {
                        return undefined;
                    }
                    for (var j = 0; j <= den; j++) {
                        var mocnina = Math.pow(0.5, den);
                        var kombinacne = choose(den, j)
                        var probability = mocnina * kombinacne;
                        MO = Math.floor((pocetDvojek * pocetDvojek * 3) / (minDomky + j));
                        if (results[MO] == undefined) {
                            results[MO] = probability;
                        } else {
                            results[MO] += probability;
                        }
                    }

                    return results;
                }
            }
        }

    }

    function cervenaMagiaPriZemke()
    {
        if(!document.URL.match("https://www.darkelf.cz/l.asp\\?id=.*"))
        {
            return;
        }
        const toNodes = html =>
        new DOMParser().parseFromString(html, 'text/html').body.childNodes;

        var MenoZemky = (document.getElementsByTagName('th')[0].innerText.substring(10))+"-";//niektore zemky su prefixom inych, najdi aj s - uprostred Osada - Nespokojenost
        //console.log(MenoZemky);
        //var AlliesId=[];
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = onReadyAliPage;
        var url = "https://www.darkelf.cz/aliance.asp";
        xhttp.open("GET",url);
        xhttp.send();

        function onReadyAliPage()
        {
            if (this.readyState == 4 && this.status == 200) {
                var pocetNajdenych = 0;
                var response = this.responseText;
                var pos;
                do
                {
                    pos = response.search("forum_hrac")+11;
                    if(pos!=10)
                    {
                        pocetNajdenych+=1;
                        response = response.substring(pos);
                        var alliesId=parseInt(response);
                        var xhttp1 = new XMLHttpRequest();
                        xhttp1.onreadystatechange = onReadyHlaseniPage;
                        var url1 = "https://www.darkelf.cz/spells_list.asp?id_player="+alliesId;
                        xhttp1.open("GET",url1);
                        xhttp1.responseType = 'blob';
                        xhttp1.send();

                        //AlliesId.push(parseInt(response));
                    }
                }
                while (pos!=10)
                    if(pocetNajdenych==0)
                    {
                        xhttp1 = new XMLHttpRequest();
                        xhttp1.onreadystatechange = onReadyHlaseniPage;
                        url1 = "https://www.darkelf.cz/hlaseni.asp";
                        xhttp1.open("GET",url1);
                        xhttp1.responseType = 'blob';
                        xhttp1.send();}
                //console.log(AlliesId);
            }
        }

        function onReadyHlaseniPage()
        {
            if (this.readyState == 4 && this.status == 200) {
                var a = new FileReader();
                a.readAsText(this.response,'windows-1250');
                a.onloadend = function(){
                    var response = a.result
                    var dom = new DOMParser().parseFromString(response, 'text/html');
                    //console.log(dom.childNodes[7].getElementsByTagName('tr'));
                    var hlasenia = dom.getElementsByTagName('font');
                    var arrHlasenia = Array.from(hlasenia);
                    arrHlasenia.forEach((x,index)=>{
                        var pos=x.innerText.search(MenoZemky);
                        if(pos!=-1)
                        {
                            console.log("nasiel som hlasenie"+index);
                        }
                        if(pos!=-1)
                        {
                            document.body.appendChild(x);
                        }
                    })
                }

            }
        }
    }

    function tlacitkaPriKuzleni()
    {
        if (document.title === 'Magie - sesílání kouzel') {

            const submitButton = document.getElementsByName('Seslat')[0];
            const cbs = document.getElementsByClassName('list');
            console.log(cbs.length)

            const br = document.createElement('br');

            submitButton.parentElement.prepend(br);
            submitButton.parentElement.prepend(br.cloneNode());
            //submitButton.parentElement.prepend(smdBtn);
            //submitButton.parentElement.prepend(csBtn);
            create_button_with_id('SMD',180,false);
            create_button_with_id('CS',160,false);
            create_button_with_id('Ukradni Peniaze',90,false);
            create_button_with_id('Ukradni Manu',100,false);
            submitButton.parentElement.prepend(br.cloneNode());
            create_button_with_id('SMD na DE',180,true);
            create_button_with_id('CS na DE',160,true);


            function create_button_with_id(name,id,zem_de)
            {
                const Batn = document.createElement('button');
                Batn.innerHTML = name;
                Batn.className = 'butt_sml';
                Batn.type = 'button';
                Batn.onclick = (e) => {
                    e.preventDefault();
                    Array.from(document.getElementsByClassName('list')).forEach(cb => {cb.value = id});
                    var zem_de_id = 66;
                    if(zem_de)
                    {
                        console.log('wololo')
                        document.getElementById('cb_enemy_lands').value = zem_de_id;
                    }
                };
                submitButton.parentElement.prepend(Batn);

            }
        }
    }

    function zobrazPrvyKlanIhned()
    {
        if(document.URL!="https://www.darkelf.cz/ch/forum_clans.asp")
        {
            return;
        }

        if(document.getElementsByTagName('select')[0].selectedIndex == 0){
            document.getElementsByTagName('select')[0].selectedIndex = 1;
            (document.forms.chooseClan.submit());

        }
    }

    function odhadVHlaseniach()
    {
        if(!document.URL.match("https://www.darkelf.cz/hlaseni.asp.*"))
        {
            return;
        }
        var nonNegativeInteger = /\d+/;
        var nonNegativeIntegers = /\d+/g;
        var onlyNonNegativeInteger = /^\d+$/;


        var table = document.getElementsByTagName("table")[1];
        var rows = table.getElementsByTagName("tr");
        for(var r=0; r<rows.length-1; r+=2) {
            if(rows[r].innerHTML.indexOf("images/s/m3.gif") == -1) // image of battle
            {
                continue;
            }
            var lines = rows[r+1].innerHTML.split(/<br ?\/?>/i);
            if(lines.length < 4) // too few lines
            {
                continue;
            }
            lines[0] = lines[0].replace(/<.*?>/g," ");
            var isAttack = lines[0].indexOf("zaútočilo") != -1;
            var isDefence = lines[0].indexOf("napadena") != -1;
            if(!isAttack && !isDefence)
            {
                continue;
            }
            // default setting is isAttack
            var strengthLine = 0;
            var usedUnitsLine = 1;
            var lostUnitsLine = 2;
            var multiplicator = 3;
            var string = "Odhadovaná obrana";
            if(isDefence) {
                if(lines.length < 5) // too few lines
                {
                    continue;
                }
                strengthLine = 1;
                if(lines[2].indexOf("spojenecká vojska") != -1) {
                    usedUnitsLine = 4;
                    lostUnitsLine = 5;
                } else {
                    usedUnitsLine = 2;
                    lostUnitsLine = 3;
                }
                multiplicator = 6;
                string = "Odhadovaný útok";
            }
            var strength = parseInt(lines[strengthLine].match(nonNegativeInteger));
            var index = lines[usedUnitsLine].indexOf("Hrdina");
            if(index == -1)
            {
                index = lines[usedUnitsLine].length;
            }
            var usedUnits = lines[usedUnitsLine].substring(0,index).match(nonNegativeIntegers);
            if(usedUnits == null) // no soldiers used
            {
                continue;
            }
            var lostUnits = lines[lostUnitsLine].match(nonNegativeIntegers);
            var maxUsedUnits = 0;
            for(var u in usedUnits)
            {
                maxUsedUnits = Math.max(parseInt(usedUnits[u]), maxUsedUnits);
            }
            if(lostUnits == null)
            {
                lostUnits = new Array(0);
            }
            var maxLostUnits = 0;
            for(u in lostUnits)
            {
                maxLostUnits = Math.max(parseInt(lostUnits[u]), maxLostUnits);
            }
            var min = Math.floor((maxLostUnits / maxUsedUnits) * multiplicator * strength);
            var max = Math.floor((((maxLostUnits+1) / maxUsedUnits) * multiplicator * strength)-1);
            if(isAttack) {
                if(max >= strength && lines[0].indexOf("zvítězilo") != -1)
                {
                    max = strength -1;
                }
                if(min < strength && lines[0].indexOf("poraženo") != -1)
                {
                    min = strength;
                }
            }
            if(isDefence) {
                if(max > strength)
                {
                    max = strength -1;
                }
            }
            var cell = rows[r+1].getElementsByTagName("td")[0];
            cell.innerHTML = cell.innerHTML + "<br><br>" + string + " " + min + " - " + max;
        }
    }

    function plosnyNakupDomov()
    {
        if(!document.URL.match("https://www.darkelf.cz/auto_domy.asp"))
        {
            return;
        }
        function onC(e)
        {
            var howMuch = parseInt(document.getElementsByTagName('input')[5].value);
            trs.forEach((tr)=>
                        { var settingUp = tr.childNodes[3].childNodes[0];
                         var houses = parseInt(tr.childNodes[4].childNodes[0].childNodes[0].innerText);
                         settingUp.value=howMuch-houses;}
                       )
        }


        var trs = Array.from(document.getElementsByTagName('tr')).slice(3);



        const Batn = document.createElement('input');
        Batn.type="button";
        Batn.value = "Klikni vsade rovnako domov";
        Batn.style = "padding-top:2px;padding-bottom:2px;margin-left:15px;color:#999999;";
        Batn.className = 'butt_sml';
        Batn.type = 'button';
        Batn.onclick = onC;

        document.getElementsByTagName('tr')[2].lastElementChild.append(Batn);
    }

    function akcnyPocitacUtoku()
    {
        if(!document.URL.match("https://www.darkelf.cz/a.asp.*"))
        {
            return;
        }
        if(document.getElementsByTagName('td')[0].innerText=="Bojeschopnost")
        {
            var bojeschopnost = document.getElementsByTagName('td')[1].innerText.substr(0,2);
            var utok = eval(document.getElementsByTagName('td')[3].innerText);
            var vysledok = Math.floor(utok*bojeschopnost/100);
            document.getElementsByTagName('td')[3].innerText=document.getElementsByTagName('td')[3].innerText+" = "+vysledok
        }
    }
})();