// ==UserScript==
// @name        XVmanager++
// @namespace    http://your.homepage/
// @version      0.1.71
// @description  enter something useful
// @author       Juliano63
// @match        http://www.xvmanager.com/*
// @exclude      http://www.xvmanager.com/*matchs_feuilleDeMatch*
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @require https://cdnjs.cloudflare.com/ajax/libs/Chart.js/1.0.2/Chart.min.js
// @downloadURL https://update.greasyfork.org/scripts/11894/XVmanager%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/11894/XVmanager%2B%2B.meta.js
// ==/UserScript==


function enchere_confirm(){

	contenu = "<div align='center'><br>Voulez-vous vraiment enchérir sur ce joueur (youhou) ?<br><b>";
	contenu += "Enchérir de : </b>";

	contenu += "<input type=text size=6 onChange='CHPoste.Montant.value=this.value'> ";
	contenu += "<img src='Images/ovalie.gif' width='12' height='12' title='Ovalies'><br><br>";
	contenu += "<input type='button' Value='Enchérir' name='Achat' class='Connect' onClick='CHPoste.submit();'> ";
	contenu += "<input class='Connect' type='button' Value='Annuler' ";
	contenu += "OnClick=\"window.document.getElementById('fenetreCH').innerHTML=''; afficherSelect(); CHPoste.Encherir.value=''; $('#Fiche2').hide();\"></div>";
    AffMessage(contenu,"","Fiche2",null,null,null,(posY-150),"oui");
}


function enchereHandler(node){
        idposte = node.getAttribute('onclick');
        idposte = idposte.substr(idposte.indexOf("=")+1);
        idposte = idposte.substr(0, idposte.indexOf("; "));
    CHPoste.Encherir.value=idposte;enchere_confirm();

}


function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) === 0) return c.substring(name.length,c.length);
    }
    return "";
}



function getMatchStats(equipeId, match_id)
{
        var xmlHttp = new XMLHttpRequest();
    var associativeArray = {};
    var theUrl = 'http://www.xvmanager.com/_popUpMarqueurs.php?name=' + getCookie('LaSession') + '&Match='+match_id;
    var indexEquipe= 0;
    var isSupporter =false;
    
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    html = xmlHttp.responseText;

	var doc = new DOMParser().parseFromString(html, "text/html");
        
//    var w = window.open('', '_blank');
//    w.document.body.innerHTML = xmlHttp.responseText;
    
    var xPathRes = doc.evaluate ('/html/body/table/tbody/tr/td[2]/table[2]/tbody/tr[1]/td/i/b', doc, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (i = 0; i < xPathRes.snapshotLength; i++) {
        if( xPathRes.snapshotItem(i).innerHTML == "Stats Supporter" )
        {
            isSupporter = true;
        }
    }
    
    
    xPathRes = doc.evaluate ('/html/body/table/tbody/tr/td[1]/table[1]/tbody/tr[2]/td[1]', doc, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (i = 0; i < xPathRes.snapshotLength; i++) {

        
        
        firstEquipeId = xPathRes.snapshotItem(i).innerHTML;
        firstEquipeId = firstEquipeId.substr(firstEquipeId.indexOf("FicheEquipe(") + 12);
                  end = firstEquipeId.indexOf(")");
                  firstEquipeId = firstEquipeId.substr(0, end);
        if(firstEquipeId != equipeId)
        {
           indexEquipe = 1;
        }
        
    }
    
    index = indexEquipe*3 +1;
    xPathRes = doc.evaluate ('/html/body/table/tbody/tr/td[1]/table[1]/tbody/tr[2]/td['+index+']/b', doc, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (i = 0; i < xPathRes.snapshotLength; i++) {

        nom = xPathRes.snapshotItem(i).innerHTML;
    }
    associativeArray['Nom'] = nom;

    index = indexEquipe +1;
    xPathRes = doc.evaluate ('/html/body/table/tbody/tr/td[1]/table[1]/tbody/tr[3]/td['+index+']', doc, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (i = 0; i < xPathRes.snapshotLength; i++) {

        force = xPathRes.snapshotItem(i).innerHTML;
        force = force.replace(/ /g, "");
        force = force.replace(":", "");
        force = force.replace("Force", "");
        force = force.replace(/&nbsp/g, "");
        force = force.replace(/;/g, "");
    }
    xPathRes = doc.evaluate ('/html/body/table/tbody/tr/td[1]/table[1]/tbody/tr[4]/td['+index+']', doc, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (i = 0; i < xPathRes.snapshotLength; i++) {

        forme = xPathRes.snapshotItem(i).innerHTML;
        forme = forme.replace(/ /g, "");
        forme = forme.replace(":", "");
        forme = forme.replace("Forme", "");
        forme = forme.replace(/&nbsp/g, "");
        forme = forme.replace(/;/g, "");
        forme = forme.replace(/%/g, "");
    }

    associativeArray['Forme'] = forme;
    force = (force*100) / forme;
    
    associativeArray['Force'] = force.toFixed(2);
    
    
    index = 3 + 2 * indexEquipe;
    xPathRes = doc.evaluate ('/html/body/table/tbody/tr/td[2]/table[1]/tbody/tr[2]/td['+index+']', doc, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (i = 0; i < xPathRes.snapshotLength; i++) {

        forcePack = xPathRes.snapshotItem(i).innerHTML;
        forcePack = forcePack.replace(/ /g, "");
        forcePack = forcePack.replace(":", "");
        forcePack = forcePack.replace(/&nbsp/g, "");
        forcePack = forcePack.replace(/;/g, "");
        forcePack = forcePack.replace(/%/g, "");
        forcePack = forcePack.replace(/Pts/g, "");
    }
    forcePack = (forcePack*100) / forme;
    associativeArray['ForcePack'] = forcePack.toFixed(2);

    
    xPathRes = doc.evaluate ('/html/body/table/tbody/tr/td[2]/table[1]/tbody/tr[5]/td['+index+']', doc, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (i = 0; i < xPathRes.snapshotLength; i++) {

        cohesion = xPathRes.snapshotItem(i).innerHTML;
        cohesion = cohesion.replace(/ /g, "");
        cohesion = cohesion.replace(":", "");
        cohesion = cohesion.replace(/&nbsp/g, "");
        cohesion = cohesion.replace(/;/g, "");
        cohesion = cohesion.replace(/%/g, "");
        cohesion = cohesion.replace(/Pts/g, "");
    }
    associativeArray['Cohesion'] = cohesion;
    
    if(isSupporter)
    {
        index = 3 + 2 * indexEquipe;
        xPathRes = doc.evaluate ('/html/body/table/tbody/tr/td[2]/table[2]/tbody/tr[position()>3 and position()<18]/td[position()=1]', doc, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        xPathRes2 = doc.evaluate ('/html/body/table/tbody/tr/td[2]/table[2]/tbody/tr[position()>3 and position()<18]/td[position()='+index+']', doc, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        for (i = 0; i < xPathRes.snapshotLength; i++) {
            

            titre = xPathRes.snapshotItem(i).innerHTML;
            titre = titre.replace(/ /g, "");
            titre = titre.replace(":", "");
            titre = titre.replace(/&nbsp/g, "");
            titre = titre.replace(/;/g, "");
            titre = titre.replace(/%/g, "");
            titre = titre.replace(/Pts/g, "");
            valeur = xPathRes2.snapshotItem(i).innerHTML;
            valeur = valeur.replace(/ /g, "");
            valeur = valeur.replace(":", "");
            valeur = valeur.replace(/&nbsp/g, "");
            valeur = valeur.replace(/;/g, "");
            valeur = valeur.replace(/%/g, "");
            valeur = valeur.replace(/Pts/g, "");
            valeur = (valeur*100) / forme;
            associativeArray[titre] = valeur.toFixed(2);
        }
    }

return associativeArray;
    



}



function getEquipeMatch(equipeId, niveau)
{
    var xmlHttp = new XMLHttpRequest();
    var theUrl = 'http://www.xvmanager.com/ClubHouse.php?page=matchs_hist.php&EquipeId='+equipeId+'&name=' + getCookie('LaSession')+'&sel='+niveau;
    
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    html = xmlHttp.responseText;
	var doc = new DOMParser().parseFromString(html, "text/html");
    
    //var w = window.open('', '_blank');
    //w.document.body.innerHTML = xmlHttp.responseText;
    
    
    var xPathRes = doc.evaluate ('//*[@id="Page"]/table/tbody/tr[2]/td[6]', doc, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (i = 0; i < xPathRes.snapshotLength; i++) {

        //iert(xPathRes.snapshotItem(i).innerHTML);
        match_id = xPathRes.snapshotItem(i).innerHTML;
        match_id = match_id.substr(match_id.indexOf("FicheMatch('") + 12);
                  end = match_id.indexOf("')");
                  match_id = match_id.substr(0, end);
        return match_id;
        
        }

}

function displayEquipes(node){
    
    console.log("here " + i);
    var niveau = 'Senior';
    if(node.innerHTML.indexOf("silver_medal") > 0)
    {
        niveau= 'Espoir';
    }
    
    myEquipe = getMyEquipeId();
    
    ficheEquipe1 = node.innerHTML;
    ficheEquipe1 = ficheEquipe1.substr(ficheEquipe1.indexOf("(")+1);
    ficheEquipe1 = ficheEquipe1.substr(0, ficheEquipe1.indexOf(")"));
    
    if( myEquipe != ficheEquipe1 )
    {
        ficheEquipe2 = ficheEquipe1;
        ficheEquipe1 = myEquipe;
    }
    else
    {
        ficheEquipe2 = node.innerHTML;
        ficheEquipe2 = ficheEquipe2.substr(ficheEquipe2.lastIndexOf("(")+1);
        ficheEquipe2 = ficheEquipe2.substr(0, ficheEquipe2.lastIndexOf(")"));
    }

    match_id = getEquipeMatch(ficheEquipe1, niveau);
    associative1 = getMatchStats(ficheEquipe1, match_id);

    
    match_id = getEquipeMatch(ficheEquipe2, niveau);
    associative2 = getMatchStats(ficheEquipe2, match_id);
    
    content='<table style="width:100%">';
    content+='  <tr align="center" ><td></td><td>'+associative1['Nom']+'</td> <td>'+associative2['Nom']+'</td><td>Diff<td></tr>';
    var i = 0;
    for(var key in associative1) 
    { 
        diff = 0;
        if(key == "Nom") continue;
        if( ++i == 5 )
        {
             content+='<tr align="center" ><td colspan=4> Stats Supporter </td></tr>';
        }
        content+='<tr align="center" ';
        if( i > 1 )
        {
            diff = associative1[key] - associative2[key];
            diff = diff.toFixed(2);
            if( diff < -20 )
            {
                content+= " bgcolor='#FA5858'>";
            }
            else if( diff < 10 )
            {
                content+= " bgcolor='#FF9966'>";
            }
            else
            {
                content+= " bgcolor='#66FF66'>";
            }
        }
        else
        {
            content+='>';
        }
        content+='<td>'+key+'</td>'+'<td>'+associative1[key]+'</td>'+'<td>'+associative2[key]+'</td>';
        if( i > 1 )
        {
            content += '<td>'+diff+'</td>';
        }
        content +='</tr>';
    }
    content+='</table>';
    AffMessage(content,"","Fiche2",null,null,null,(posY+10),"oui");
    

}


function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200 && callback != null)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function my_refresh(responseText)
{
	var doc = new DOMParser().parseFromString(responseText, "text/html");
    var etatTerrain = "";

    var xPathRes = doc.evaluate ('//*[@id="Page"]/table/tbody/tr[1]/td/b[1]/font', doc, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (i = 0; i < xPathRes.snapshotLength; i++) {

        
        
        etatTerrain = xPathRes.snapshotItem(i).innerHTML;
        etatTerrain = etatTerrain.replace("(", "");
        etatTerrain = etatTerrain.replace(")", "");
    }
    xPathRes = document.evaluate ('//*[@id="CadreInfos"]/table[1]/tbody/tr[2]/td/table/tbody/tr[1]/td/a[4]/font[2]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (i = 0; i < xPathRes.snapshotLength; i++) {
        xPathRes.snapshotItem(i).innerHTML = etatTerrain;
    }
//    location.reload();
}


function getMatchFMM(equipeId, match_id)
{
        var xmlHttp = new XMLHttpRequest();
    var associativeArray = {};
    var theUrl = 'http://www.xvmanager.com/_popUpMarqueurs.php?name=' + getCookie('LaSession') + '&Match='+match_id;
    var indexEquipe= 0;
    
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    html = xmlHttp.responseText;

	var doc = new DOMParser().parseFromString(html, "text/html");
    
    
    var xPathRes = doc.evaluate ('/html/body/table/tbody/tr/td[1]/table[1]/tbody/tr[2]/td[1]', doc, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (i = 0; i < xPathRes.snapshotLength; i++) {

        
        
        firstEquipeId = xPathRes.snapshotItem(i).innerHTML;
        firstEquipeId = firstEquipeId.substr(firstEquipeId.indexOf("FicheEquipe(") + 12);
                  end = firstEquipeId.indexOf(")");
                  firstEquipeId = firstEquipeId.substr(0, end);
        if(firstEquipeId != equipeId)
        {
           indexEquipe = 1;
        }
        
    }
    

    index = indexEquipe +1;
    xPathRes = doc.evaluate ('/html/body/table/tbody/tr/td[1]/table[1]/tbody/tr[3]/td['+index+']', doc, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (i = 0; i < xPathRes.snapshotLength; i++) {

        force = xPathRes.snapshotItem(i).innerHTML;
        force = force.replace(/ /g, "");
        force = force.replace(":", "");
        force = force.replace("Force", "");
        force = force.replace(/&nbsp/g, "");
        force = force.replace(/;/g, "");
    }
    xPathRes = doc.evaluate ('/html/body/table/tbody/tr/td[1]/table[1]/tbody/tr[4]/td['+index+']', doc, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (i = 0; i < xPathRes.snapshotLength; i++) {

        forme = xPathRes.snapshotItem(i).innerHTML;
        forme = forme.replace(/ /g, "");
        forme = forme.replace(":", "");
        forme = forme.replace("Forme", "");
        forme = forme.replace(/&nbsp/g, "");
        forme = forme.replace(/;/g, "");
        forme = forme.replace(/%/g, "");
    }

    associativeArray['Force'] = (force*100) / forme;
    
    
    index = 3 + 2 * indexEquipe;
    xPathRes = doc.evaluate ('/html/body/table/tbody/tr/td[2]/table[1]/tbody/tr[2]/td['+index+']', doc, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (i = 0; i < xPathRes.snapshotLength; i++) {

        forcePack = xPathRes.snapshotItem(i).innerHTML;
        forcePack = forcePack.replace(/ /g, "");
        forcePack = forcePack.replace(":", "");
        forcePack = forcePack.replace(/&nbsp/g, "");
        forcePack = forcePack.replace(/;/g, "");
        forcePack = forcePack.replace(/%/g, "");
        forcePack = forcePack.replace(/Pts/g, "");
    }
    associativeArray['ForcePack'] = (forcePack*100) / forme;
    

    return associativeArray;
    



}
    
 function getMyEquipeId() {   
     firstEquipeId = "";
        var infoEquipe = document.evaluate ("//*[@id='CadreInfos']/table[1]/tbody/tr[2]/td/table/tbody/tr[1]/td", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        for (i = 0; i < infoEquipe.snapshotLength; i++) {
            
            firstEquipeId = infoEquipe.snapshotItem(i).innerHTML;
            firstEquipeId = firstEquipeId.substr(firstEquipeId.indexOf("FicheEquipe(") + 12);
            end = firstEquipeId.indexOf(")");
            firstEquipeId = firstEquipeId.substr(0, end);
        
        }
     return firstEquipeId;
 }



function getLastMatchDate(nbDate, equipeId, espoir, unity) {
  var date = new Date();
    date.setDate(date.getDate() -1);
    var xmlHttp = new XMLHttpRequest();
   var i = 0;
    var array_return = new Array();
    var array_date = new Array();
    var array_FMM = new Array();
    var array_Pack = new Array();
  var fund = false;
  while ( i < nbDate )
  {
      fund = false;
      if (date.getDay() === 0 || date.getDay() === 6 || date.getDay() === 3) {
          month = date.getMonth()+1;
          monthString= "";
          if(month < 10 )
              monthString = "0";
          monthString += month;
          
          theUrl = "http://www.xvmanager.com/ClubHouse.php?page=matchs_calendrier.php&Sel=Senior&Mois=0&name="+getCookie('LaSession')+"&LaDate="+date.getFullYear()+"-"+monthString+"-"+date.getDate();
          if(espoir)
          {
              theUrl += "&Sel=Espoir";
          }
          xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
          xmlHttp.send(  );
          
          html = xmlHttp.responseText;

          var doc = new DOMParser().parseFromString(html, "text/html");
          var fiche = doc.evaluate ("//*[@id='ImageCal']", doc, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
          for (j= 0; j< fiche.snapshotLength; j++) {
              if( fiche.snapshotItem(j).innerHTML.indexOf("FicheMatch") > 0){
                  match_id = fiche.snapshotItem(j).innerHTML;
                  match_id = match_id.substr(match_id.indexOf("FicheMatch('") + 12);
                  end = match_id.indexOf("')");
                  match_id = match_id.substr(0, end);
                  my_array = getMatchFMM(equipeId, match_id);
                  array_date.unshift(date.getFullYear()+"-"+monthString+"-"+date.getDate());
                  array_FMM.unshift(my_array['Force']);
                  array_Pack.unshift(my_array['ForcePack']);
                  i = i + 1;
                  if( unity === "Mois")
                      date.setDate(date.getDate() -30);
                  else if( unity === "Semaine")
                      date.setDate(date.getDate() -7);
                  else
                      date.setDate(date.getDate() -1);
                  fund = true;
                  break;
              }
          }
          
      }
      if (!fund) date.setDate(date.getDate() -1);
      
  }
   array_return.push(array_date);
   array_return.push(array_FMM);
   array_return.push(array_Pack);
   return array_return;
    
}



function generateGraph(unity, duration){
            var espoir = false;
        firstEquipeId = getMyEquipeId();
        if(window.location.href.indexOf("Sel=Espoir") > 0)
        {
            espoir = true;
        }
        array = getLastMatchDate(duration, firstEquipeId, espoir,unity);

            var ctx = $("#graph").get(0).getContext("2d");
        
        
        var data = {
    labels: array[0],
    datasets: [
        {
            label: "FMM",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: array[1]
        },
        {
            label: "Force Pack",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: array[2]
        }
    ]
    };
        var options = {
  legendTemplate : '<ul>'
                  +'<% for (var i=0; i<datasets.length; i++) { %>'
                    +'<li>'
            +'<span style=\"background-color:<%=datasets[i].fillColor%>;overflow:auto\"></span>'
                    +'<% if (datasets[i].label) { %><%= datasets[i].label %><% } %>'
                  +'</li>'
                +'<% } %>'
              +'</ul>'
  }

  //don't forget to pass options in when creating new Chart
  var lineChart = new Chart(ctx).Line(data, options);
  //var lineChart = new Chart(ctx).Line(data);

  //then you just need to generate the legend
  var legend = lineChart.generateLegend();
    $('#legendDiv').empty();
  //and append it to your page somewhere
  $('#legendDiv').append(legend);
}


function _appelAsync() {
    //function(){httpGetAsync("?page=infra_stade.php&name="+getCookie('LaSession')+"&reparer=1", my_refresh);}
    
    $('input:checked').each(function() {
        var appUrl = "http://www.xvmanager.com/ClubHouse.php?page=equipe_effectif.php&app="+$(this).attr('value')+"&Sel=Senior&name="+getCookie('LaSession');
        console.log(appUrl);
         httpGetAsync(appUrl, null);
    });
    location.reload();
}

$(function() {
// code here
    var i; 
    var toevualuate = '//*[@id="CadreInfos"]/table[5]/tbody/tr[2]/td/table/tbody/tr/td/table/tbody/tr';
    if(window.location.href.indexOf("ClubHouse.php") > 0)
    {
        var test = document.evaluate ('//*[@id="CadreInfos"]/table[4]/tbody/tr[1]/td/table/tbody/tr/td', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        for (i = 0; i < test.snapshotLength; i++) {
            if(test.snapshotItem(i).innerHTML.indexOf('Prochains') != -1)
            {
                console.log(test.snapshotItem(i).innerHTML);
                toevualuate = '//*[@id="CadreInfos"]/table[4]/tbody/tr[2]/td/table/tbody/tr/td/table/tbody/tr'
            }

        }
        //*[@id="CadreInfos"]/table[4]/tbody/tr[1]/td/table/tbody/tr/td
        
        //ajout des fonctions pour avoir les KPI des equipes
        var matchavenir = document.evaluate (toevualuate, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        for (i = 0; i < matchavenir.snapshotLength; i++) {

            matchavenir.snapshotItem(i).addEventListener('click', function () {
                displayEquipes(this);
            });

        }
        //ajout d'un bouton pour reparer le terrain
        var cadreInfo = document.evaluate ('//*[@id="CadreInfos"]/table[1]/tbody/tr[2]/td/table/tbody/tr[1]/td', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        for (i = 0; i < cadreInfo.snapshotLength; i++) {

            var btn = document.createElement("BUTTON");        // Create a <button> element
            btn.className="Bouton1"
            var t = document.createTextNode("Reparer Terrain");       // Create a text node
            btn.appendChild(t);                                // Append the text to <button>

            btn.onclick = function(){httpGetAsync("?page=infra_stade.php&name="+getCookie('LaSession')+"&reparer=1", my_refresh);};


            cadreInfo.snapshotItem(i).appendChild(btn);  


        }
    }
    
    if(window.location.href.indexOf("equipe_effectif.php") > 0)
    {
        var CadreBis = document.evaluate ('//*[@id="CadreBis"]/table/tbody//tr[position() > 1]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        for (i = 0; i < CadreBis.snapshotLength; i++) {
            if( i < CadreBis.snapshotLength -1)
            {
                var td = document.createElement("TD");
                td.align = "center";
                var chk = document.createElement("input");        // Create a <button> element
                chk.type = "checkbox";
                var a = document.evaluate ('td[2]/a', CadreBis.snapshotItem(i), null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                chk.value = a.snapshotItem(0).getAttribute("name");
                //chk.checked = "test";
                //*[@id="CadreBis"]/table/tbody/tr[24]/td[2]/a
                td.appendChild(chk);
                CadreBis.snapshotItem(i).appendChild(td);  
            }
            else
            {
                var td = document.createElement("TD");
                td.align = "center";
                var btn = document.createElement("BUTTON");        // Create a <button> element
                btn.className="Bouton2";
                btn.value = "Appeler sélectionnés"
                var t = document.createTextNode("Appeler sélectionnés");
                btn.appendChild(t);
                td.appendChild(btn);
                
                btn.onclick = _appelAsync;
                CadreBis.snapshotItem(i).appendChild(td);  
            }
        }
    }
    
    //Modification des encheres
    if(window.location.href.indexOf("equipe_encheres.php") > 0) 
    {

        var xPathRes = document.evaluate ("//a[@href='#1' and contains(@onclick, 'CHPoste')]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

        for (i = 0; i < xPathRes.snapshotLength; i++) {

            xPathRes.snapshotItem(i).addEventListener('click', function () {
                enchereHandler(this);
            });
        }
    }

    //Construction de graph des stats
    if(window.location.href.indexOf("stats_detaillees.php") > 0) //If it is a valid video
    {
    
        var xPathRes = document.evaluate ("//*[@id='Page']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

        for (i = 0; i < xPathRes.snapshotLength; i++) {
            var canv = document.createElement('canvas');
            canv.setAttribute("style","width:98%");
            canv.id = 'graph';
            xPathRes.snapshotItem(i).appendChild(canv);
            
            var div = document.createElement('div');
            div.id = 'legendDiv';
            div.setAttribute("style","width:98%");
            xPathRes.snapshotItem(i).appendChild(div);
            
            var select_div = document.createElement('div');
            select_div.id = 'selectDiv';
            select_div.setAttribute("style","width:98%");
            xPathRes.snapshotItem(i).appendChild(select_div);
        }
        
        //Create array of options to be added
        var select_array = ["Jours","Semaine","Mois"];

        //Create and append select list
        var selectList = document.createElement("select");
        selectList.id = "graphSelect";
        //div.appendChild(selectList);

        //Create and append the options
        for (i = 0; i < select_array.length; i++) {
            var option = document.createElement("option");
            option.value = select_array[i];
            option.text = select_array[i];
            selectList.appendChild(option);
        }
        
        
        $('#selectDiv').append(selectList);
        $('#graphSelect').on('change', function() {
            generateGraph( this.value,5 ); // or $(this).val()
        });
        
        generateGraph("Jours", 5);


        
        
    }

});