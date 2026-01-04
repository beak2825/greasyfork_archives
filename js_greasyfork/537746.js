// ==UserScript==
// @name         Visvaris robots
// @namespace    http://tampermonkey.net/
// @version      3000.005
// @description  ok
// @author       You
// @match        https://visvaris.lv/kindergarten/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=visvaris.lv
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/537746/Visvaris%20robots.user.js
// @updateURL https://update.greasyfork.org/scripts/537746/Visvaris%20robots.meta.js
// ==/UserScript==

main();

var observeDOM = (function() {
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

  return function(obj, callback) {
    if (!obj || obj.nodeType !== 1) {
      return;
    }

    if (MutationObserver) {
      // define a new observer
      var mutationObserver = new MutationObserver(callback);

      // have the observer observe for changes in children
      mutationObserver.observe(obj, {childList: true, subtree: true});
      return mutationObserver;
    } else if (window.addEventListener) { // browser support fallback
      obj.addEventListener('DOMNodeInserted', callback, false);
      obj.addEventListener('DOMNodeRemoved', callback, false);
    }
  }
})();



var DateDiff = {
    inDays: function(d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();

        return Math.floor((t2-t1)/(24*3600*1000));
    },
    inWeeks: function(d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();

        return parseInt((t2-t1)/(24*3600*1000*7));
    },
    inMonths: function(d1, d2) {
        var d1Y = d1.getFullYear();
        var d2Y = d2.getFullYear();
        var d1M = d1.getMonth();
        var d2M = d2.getMonth();

        return (d2M+12*d2Y)-(d1M+12*d1Y);
    },
    inYears: function(d1, d2) {
        return d2.getFullYear()-d1.getFullYear();
    }
}

//ja lapa ielādējas un skripts ir procesā
if(window.name == "processing")
{
    var dati = JSON.parse(GM_getValue('skripta_dati', '[]'));
    if(dati.search_step==1)search_step_1(dati)
    else if (dati.search_step==2)search_step_2(dati);
    else if (dati.search_step==3)search_step_3(dati);
    else if (dati.search_step==4)search_step_4(dati);
    else if (dati.search_step==5)search_step_5(dati);
}

function main()
{
    var mt = document.getElementById("content");
    if(!mt) return;
    //title
    var myVersion = GM_info.script.version;
    var title = document.createElement("h3");
    title.innerHTML='Visvaris robots  v'+myVersion;
    mt.appendChild(title);
    //textarea
    var input = document.createElement("textarea");
    input.id="demo_input_area";
    input.setAttribute('rows', 5);
    //pieliekam meklēšanas ievadlauku
    //let sp2 = document.getElementById("footer");
    mt.appendChild(input);
    //v space
    var br = document.createElement("br");
    mt.appendChild(br);
    //poga privātie PII
    var btn = document.createElement('input');
    btn.value="Pārbaudīt pPII";
    btn.className = "button";
    btn.type = "submit";
    btn.addEventListener("click", function(){
        var input_lines=input.value;
        input_lines=input_lines.replace(/[ ]+/g, '');//spaces
        input_lines=input_lines.replace(/\t/g, '');//tabs
        input_lines=input_lines.replace(/['"]+/g, '');//quotes
        input_lines = input_lines.replace(/\r\n/g,"\n").split("\n");//split lines to array
        input_lines = input_lines.filter(elm => elm);//remove empty lines
        var dati = {
            current_line: 0,
            search_step: 1,
            search_type: 1,
            lines:input_lines,
            results:[]
        };
        //atzīmējam šo tabu kā procesējošu
        window.name = "processing";
        search_step_1(dati);
    });
    mt.appendChild(btn);
    //h space
    var span = document.createElement("span");
    span.innerHTML=' ';
    mt.appendChild(span);
    //poga rinda BUPS
    var btn2 = document.createElement('input');
    btn2.value="Pārbaudīt rindu/BUPS";
    btn2.className = "button";
    btn2.type = "submit";
    btn2.addEventListener("click", function(){
        var input_lines=input.value;
        input_lines=input_lines.replace(/[ ]+/g, '');//spaces
        input_lines=input_lines.replace(/\t/g, '');//tabs
        input_lines=input_lines.replace(/['"]+/g, '');//quotes
        input_lines = input_lines.replace(/\r\n/g,"\n").split("\n");//split lines to array
        input_lines = input_lines.filter(elm => elm);//remove empty lines
        var dati = {
            current_line: 0,
            search_step: 1,
            search_type: 2,
            lines:input_lines,
            results:[]
        };
        //atzīmējam šo tabu kā procesējošu
        window.name = "processing";
        search_step_1(dati);
    });
    mt.appendChild(btn2);
    //h space
    span = document.createElement("span");
    span.innerHTML=' ';
    mt.appendChild(span);
    //poga kopet tabulu
    var btn3 = document.createElement('input');
    btn3.value="Nokopēt tabulu";
    btn3.className = "button";
    btn3.type = "submit";
    btn3.addEventListener("click", function(){
        copytable('robota_rezultati');
    });
    mt.appendChild(btn3);
    //v space
    br = document.createElement("br");
    mt.appendChild(br);

}

//atveram meklēšanas lapu
function search_step_1(dati)
{
    //atzīmējam, ka pēc pārlādēšanas būs 2. solis
    dati.search_step=2;
    //saglabājam datus GM lai tie ir pieejami arī pēc lapas pārlādēšanas
    GM_setValue('skripta_dati', JSON.stringify(dati));
    //ejam uz meklēšanas lapu
    document.location.href = 'https://visvaris.lv/kindergarten/PersonList';
}

//veicam aizpildam meklēšanas laukus un nospiežam pogu meklēt
function search_step_2(dati)
{
    //ievadam meklējamo tekstu
    var search_input = document.getElementById("PersistedModel_Code");
    var pk = dati.current_line;
        search_input.value=dati.lines[pk];
        //atzīmējam, ka pēc pārlādēšanas būs 3. solis
        dati.search_step=3;
        //saglabājam datus GM lai tie ir pieejami arī pēc lapas pārlādēšanas
        GM_setValue('skripta_dati', JSON.stringify(dati));
        //nospiežam pogu
        observeDOM(document.getElementById("PERSON_LIST_GRIDVIEW"), wait_1 );
        document.getElementById("search").click();
}

function wait_1(m)
{
   var addedNodes = [];
   //m.forEach(record => record.addedNodes.length & addedNodes.push(...record.addedNodes));
   //console.clear();
   //console.log('Added:', addedNodes);
    m.forEach((element) =>
    {
        //console.log(element);
        element.addedNodes.forEach((element2)=>{
            //console.log(element2.id);
            if(element2.id=='PERSON_LIST_GRIDVIEW_CallbackState')search_step_3();
        }
        );
    });

}

//atrastajā sarakstā atvērsim pirmo atrasto ierakstu
function search_step_3()
{
    var dati = JSON.parse(GM_getValue('skripta_dati', '[]'));
    var el1 = document.getElementById("PERSON_LIST_GRIDVIEW_DXMainTable");
    var el2=el1.getElementsByClassName("link")[0];
    //var el3 = el2.getElementsByTagName("a")[0];
    //atzīmējam, ka pēc pārlādēšanas būs 3. solis
    dati.search_step=4;
    //saglabājam datus GM lai tie ir pieejami arī pēc lapas pārlādēšanas
    GM_setValue('skripta_dati', JSON.stringify(dati));
    //ejam uz produkta lapu
    document.location.href = el2.href;
}

//personas lapā atradīsim datus
function search_step_4(dati)
{
    var rez={};
    rez.mates_adrese='';
    rez.teva_adrese='';
    rez.pieteikuma_statuss='';
    rez.derigs_ppii='';
    rez.derigs_bups='';
    rez.opcija1='';
    rez.opcija2='';
    rez.opcija3='';
    var pieteikuma_statuss_atbilst=false;
    var lidzfinansejuma_pieteikuma_statuss_atbilst=false;
    var deklarets_jelgava=false;
    var tevs_deklarets_jelgava=false;
    var mate_deklareta_jelgava=false;
    var step_5_url='';
    rez.lidzfinansejuma_pieteikuma_statuss='';
    var el;
    //pk
    el = document.getElementById("content");
    el=el.getElementsByClassName("formtable")[0];
    el=el.getElementsByTagName("tr")[0];
    el=el.getElementsByTagName("td")[1];
    el = el.innerHTML;
    el = el.replace(/^\s+|\s+$/gm,'');//aizvācam liekās atstarpes
    rez.pk=el;
    //adrese
    el = document.getElementById("content");
    el=el.getElementsByClassName("formtable")[0];
    el=el.getElementsByTagName("tr")[3];
    el=el.getElementsByTagName("td")[1];
    el = el.innerHTML;
    rez.adrese=el;
    if(el.indexOf("Jelgava,")>0)deklarets_jelgava=true;
    //dzimšanas datums
    el = document.getElementById("content");
    el=el.getElementsByClassName("formtable")[0];
    el=el.getElementsByTagName("tr")[4];
    el=el.getElementsByTagName("td")[1];
    el = el.innerHTML;
    rez.dz_datums=el;
    //vecums
    var datums=el.substring(6, 10)+'-'+el.substring(3, 5)+'-'+el.substring(0, 2) ;
    var d1 = new Date(datums);
    var d2 = new Date();
    var menesi = DateDiff.inMonths(d1, d2);
    var v2=menesi % 12;
    var v1=Math.floor(menesi/12);
    if(menesi>=18)rez.vecums = 'Jā '+v1+'g.'+v2+'m.';
    else rez.vecums = 'Nē '+v1+'g.'+v2+'m.';

    //vecāku dati
    el = document.getElementById("tab-connectedpersons");
    el = el.getElementsByTagName("tr");
    for (let persona of el)
    {
        var el2=persona.getElementsByTagName("td");
        if(el2[3])//izlaižam heder rindu
        {
            if(el2[3].innerHTML=='Tēvs')
            {
                rez.teva_adrese=el2[4].innerHTML;
                if(el2[4].innerHTML.indexOf("Jelgava,")>0)tevs_deklarets_jelgava=true;
            }
            if(el2[3].innerHTML=='Māte')
            {
                rez.mates_adrese=el2[4].innerHTML;
                if(el2[4].innerHTML.indexOf("Jelgava,")>0)mate_deklareta_jelgava=true;
            }
        }
    }
    //pieteikumi
    el = document.getElementById("tab-applications");
    el=el.getElementsByTagName("tr");
    for (let pieteikums of el)
    {
        el2=pieteikums.getElementsByTagName("td");
        if(el2[4])//izlaižam heder rindu
        {
            if(rez.pieteikuma_statuss!='')rez.pieteikuma_statuss+=', ';
            rez.pieteikuma_statuss+=el2[4].innerHTML;
            if(el2[4].innerHTML=='Jauns')
            {
                pieteikuma_statuss_atbilst=true;
                step_5_url = el2[0].firstChild.href;
            }
        }
    }
    //līdzfinansējuma pieteikumi
    el = document.getElementById("tab-cofinancing");
    el=el.getElementsByTagName("tr");
    for (let pieteikums of el)
    {
        el2=pieteikums.getElementsByTagName("td");
        if(el2[3])//izlaižam heder rindu
        {
            if(rez.lidzfinansejuma_pieteikuma_statuss!='')rez.lidzfinansejuma_pieteikuma_statuss+=', ';
            rez.lidzfinansejuma_pieteikuma_statuss+=el2[3].innerHTML;
            if(el2[3].innerHTML=='Līgums ir parakstīts un līdzfinansējums ir piešķirts' || el2[3].innerHTML=='Iesniegums saskaņots un līgums sagatavots')
            {
                lidzfinansejuma_pieteikuma_statuss_atbilst=true;
            }
        }
    }
    if(deklarets_jelgava && (tevs_deklarets_jelgava || mate_deklareta_jelgava) && menesi>=18 && lidzfinansejuma_pieteikuma_statuss_atbilst)
    {
        rez.derigs_ppii='Jā';
    }
    if(deklarets_jelgava && (tevs_deklarets_jelgava || mate_deklareta_jelgava) && menesi>=18 && pieteikuma_statuss_atbilst && !lidzfinansejuma_pieteikuma_statuss_atbilst)
    {
        rez.derigs_bups='Jā';
    }
    //saglabāsim  rezultātos
    dati.results[dati.current_line]=rez;
    if(dati.search_type==2 && pieteikuma_statuss_atbilst)
    {
        //atzīmējam, ka pēc pārlādēšanas būs 5. solis
        dati.search_step=5;
        //saglabājam datus GM lai tie ir pieejami arī pēc lapas pārlādēšanas
        GM_setValue('skripta_dati', JSON.stringify(dati));
        //ejam uz aktīvā rindas pieteikuma lapu
        document.location.href = step_5_url;
    }
    else
    {
        finish_row(dati,rez)
    }
}

function search_step_5(dati)
{
    //alert('step 5');
    var el = document.getElementById("SELECTED_INSTITUTION_LIST_GRIDVIEW_DXMainTable");
    el=el.getElementsByClassName("dxgvDataRow_MansWeb");
    var i=0;
    for (let prioritate of el)
    {
        i++;
        var el2=prioritate.getElementsByTagName("td");
        if(i==1)dati.results[dati.current_line].opcija1=el2[1].innerHTML;
        if(i==2)dati.results[dati.current_line].opcija2=el2[1].innerHTML;
        if(i==3)dati.results[dati.current_line].opcija3=el2[1].innerHTML;
        //alert(el2[1].innerHTML);
    }
    finish_row(dati);
}

function finish_row(dati)
{
    //console.log(dati);
    if(dati.current_line+1 < dati.lines.length)
    {
        //nākošais meklējamais vārds
        dati.current_line++;
        search_step_1(dati);
    }else
    {
        if(dati.search_type==1)display_data_1(dati);//pPPI
        if(dati.search_type==2)display_data_2(dati);//rinda,BUPS
    }
}

function display_data_1(dati)//pPII
{
    //console.log(dati.results);
    //var textarea = document.getElementById("demo_input_area");
    //textarea.value = dati.results.join("\n");
    //beidzam processingu
    var table = document.createElement('table');
    table.setAttribute('border', 1);
    table.setAttribute('id', 'robota_rezultati');
    table.setAttribute('style','border-collapse: collapse;');
    var tr = document.createElement('tr');
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var td3 = document.createElement('td');
    var td4 = document.createElement('td');
    var td5 = document.createElement('td');
    var td6 = document.createElement('td');
    var td7 = document.createElement('td');
    var td8 = document.createElement('td');
    var td9 = document.createElement('td');
    //var td10 = document.createElement('td');
    var text1 = document.createTextNode('pk');
    var text2 = document.createTextNode('dz.dat.');
    var text3 = document.createTextNode('adrese');
    var text4 = document.createTextNode('tēva adrese');
    var text5 = document.createTextNode('mātes adrese');
    var text6 = document.createTextNode('pieteikuma statuss rindā');
    var text7 = document.createTextNode('līdzfinansējuma pieteikuma (līguma) statuss');
    var text8 = document.createTextNode('vecāks par 1,5 gadiem');
    var text9 = document.createTextNode('der/neder pPII');
    //var text10 = document.createTextNode('BUPS');
    td1.appendChild(text1);
    td2.appendChild(text2);
    td3.appendChild(text3);
    td4.appendChild(text4);
    td5.appendChild(text5);
    td6.appendChild(text6);
    td7.appendChild(text7);
    td8.appendChild(text8);
    td9.appendChild(text9);
    //td10.appendChild(text10);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tr.appendChild(td6);
    tr.appendChild(td7);
    tr.appendChild(td8);
    tr.appendChild(td9);
    //tr.appendChild(td10);
    table.appendChild(tr);

    dati.results.forEach((element)=>{
        var tr = document.createElement('tr');
        var td1 = document.createElement('td');
        var td2 = document.createElement('td');
        var td3 = document.createElement('td');
        var td4 = document.createElement('td');
        var td5 = document.createElement('td');
        var td6 = document.createElement('td');
        var td7 = document.createElement('td');
        var td8 = document.createElement('td');
        var td9 = document.createElement('td');
        //var td10 = document.createElement('td');

        var text1 = document.createTextNode(element.pk);
        var text2 = document.createTextNode(element.dz_datums);
        var text3 = document.createTextNode(element.adrese);
        var text4 = document.createTextNode(element.teva_adrese);
        var text5 = document.createTextNode(element.mates_adrese);
        var text6 = document.createTextNode(element.pieteikuma_statuss);
        var text7 = document.createTextNode(element.lidzfinansejuma_pieteikuma_statuss);
        var text8 = document.createTextNode(element.vecums);
        var text9 = document.createTextNode(element.derigs_ppii);
        //var text10 = document.createTextNode(element.derigs_bups);

        td1.appendChild(text1);
        td2.appendChild(text2);
        td3.appendChild(text3);
        td4.appendChild(text4);
        td5.appendChild(text5);
        td6.appendChild(text6);
        td7.appendChild(text7);
        td8.appendChild(text8);
        td9.appendChild(text9);
        //td10.appendChild(text10);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);
        tr.appendChild(td7);
        tr.appendChild(td8);
        tr.appendChild(td9);
        //tr.appendChild(td10);

        table.appendChild(tr);
    })
    var mt = document.getElementById("content");
    var br = document.createElement("br");
    mt.appendChild(br);
    br = document.createElement("br");
    mt.appendChild(br);
    mt.appendChild(table);
    window.name = "ok";
}

function display_data_2(dati)//BUPS rinda
{
    //console.log(dati.results);
    //var textarea = document.getElementById("demo_input_area");
    //textarea.value = dati.results.join("\n");
    //beidzam processingu
    var table = document.createElement('table');
    table.setAttribute('border', 1);
    table.setAttribute('id', 'robota_rezultati');
    table.setAttribute('style','border-collapse: collapse;');
    var tr = document.createElement('tr');
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var td3 = document.createElement('td');
    var td4 = document.createElement('td');
    var td5 = document.createElement('td');
    var td6 = document.createElement('td');
    var td7 = document.createElement('td');
    var td8 = document.createElement('td');
    var td9 = document.createElement('td');
    var td10 = document.createElement('td');
    var td11 = document.createElement('td');
    var td12 = document.createElement('td');
    var text1 = document.createTextNode('pk');
    var text2 = document.createTextNode('dz.dat.');
    var text3 = document.createTextNode('adrese');
    var text4 = document.createTextNode('tēva adrese');
    var text5 = document.createTextNode('mātes adrese');
    var text6 = document.createTextNode('pieteikuma statuss rindā');
    var text7 = document.createTextNode('līdzfinansējuma pieteikuma (līguma) statuss');
    var text8 = document.createTextNode('vecāks par 1,5 gadiem');
    var text9 = document.createTextNode('BUPS');
    var text10 = document.createTextNode('pr_1');
    var text11 = document.createTextNode('pr_2');
    var text12 = document.createTextNode('pr_3');
    td1.appendChild(text1);
    td2.appendChild(text2);
    td3.appendChild(text3);
    td4.appendChild(text4);
    td5.appendChild(text5);
    td6.appendChild(text6);
    td7.appendChild(text7);
    td8.appendChild(text8);
    td9.appendChild(text9);
    td10.appendChild(text10);
    td11.appendChild(text11);
    td12.appendChild(text12);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tr.appendChild(td6);
    tr.appendChild(td7);
    tr.appendChild(td8);
    tr.appendChild(td9);
    tr.appendChild(td10);
    tr.appendChild(td11);
    tr.appendChild(td12);
    table.appendChild(tr);

    dati.results.forEach((element)=>{
        var tr = document.createElement('tr');
        var td1 = document.createElement('td');
        var td2 = document.createElement('td');
        var td3 = document.createElement('td');
        var td4 = document.createElement('td');
        var td5 = document.createElement('td');
        var td6 = document.createElement('td');
        var td7 = document.createElement('td');
        var td8 = document.createElement('td');
        var td9 = document.createElement('td');
        var td10 = document.createElement('td');
        var td11 = document.createElement('td');
        var td12 = document.createElement('td');

        var text1 = document.createTextNode(element.pk);
        var text2 = document.createTextNode(element.dz_datums);
        var text3 = document.createTextNode(element.adrese);
        var text4 = document.createTextNode(element.teva_adrese);
        var text5 = document.createTextNode(element.mates_adrese);
        var text6 = document.createTextNode(element.pieteikuma_statuss);
        var text7 = document.createTextNode(element.lidzfinansejuma_pieteikuma_statuss);
        var text8 = document.createTextNode(element.vecums);
        var text9 = document.createTextNode(element.derigs_bups);
        var text10 = document.createTextNode(element.opcija1);
        var text11 = document.createTextNode(element.opcija2);
        var text12 = document.createTextNode(element.opcija3);

        td1.appendChild(text1);
        td2.appendChild(text2);
        td3.appendChild(text3);
        td4.appendChild(text4);
        td5.appendChild(text5);
        td6.appendChild(text6);
        td7.appendChild(text7);
        td8.appendChild(text8);
        td9.appendChild(text9);
        td10.appendChild(text10);
        td11.appendChild(text11);
        td12.appendChild(text12);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);
        tr.appendChild(td7);
        tr.appendChild(td8);
        tr.appendChild(td9);
        tr.appendChild(td10);
        tr.appendChild(td11);
        tr.appendChild(td12);

        table.appendChild(tr);
    })
    var mt = document.getElementById("content");
    var br = document.createElement("br");
    mt.appendChild(br);
    br = document.createElement("br");
    mt.appendChild(br);
    mt.appendChild(table);
    window.name = "ok";
}

function copytable(el) {
  var urlField = document.getElementById(el)
  var range = document.createRange()
  range.selectNode(urlField)
  window.getSelection().addRange(range)
  document.execCommand('copy')
}

