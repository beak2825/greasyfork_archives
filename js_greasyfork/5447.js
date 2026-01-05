// ==UserScript==
// @name       WorldContagion collecte souche
// @version    0.12
// @description  Collecte des ressources souche automatiquement, il faut se placer sur la page souche pour que ça fonctionne
// @match      http://www.worldcontagion.com/contagion/souche/* 
// @match      http://www.worldcontagion.com/contagion/souche 
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/5790
// @downloadURL https://update.greasyfork.org/scripts/5447/WorldContagion%20collecte%20souche.user.js
// @updateURL https://update.greasyfork.org/scripts/5447/WorldContagion%20collecte%20souche.meta.js
// ==/UserScript==
 
function setCookie(nom, valeur, expire, chemin, domaine, securite){
    document.cookie = nom + ' = ' + escape(valeur) + '  ' +
        ((expire == undefined) ? '' : ('; expires = ' + expire.toGMTString())) +
        ((chemin == undefined) ? '' : ('; path = ' + chemin)) +
        ((domaine == undefined) ? '' : ('; domain = ' + domaine)) +
        ((securite == true) ? '; secure' : '');
}
 
function getCookie(name){
    if(document.cookie.length == 0)
        return null;
   
    var regSepCookie = new RegExp('(; )', 'g');
    var cookies = document.cookie.split(regSepCookie);
   
    for(var i = 0; i < cookies.length; i++){
        var regInfo = new RegExp('=', 'g');
        var infos = cookies[i].split(regInfo);
        if(infos[0] == name){
            return unescape(infos[1]);
        }
    }
    return null;
}
 
 
function collecte()
{
    var nombreCollecte = getCookie('collecte');
    
    if(nombreCollecte == null)
        nombreCollecte = 0;
   
    var jourDerniereCollecte = getCookie('jour');
   
    console.log('Tentative de collecte');
   
    console.log(nombreCollecte);
    var list = window.document.getElementsByTagName('div');
   
    var dtExpire = new Date();
       
    for(var i=0;i<list.length;i++)
    {
        var attribut = list[i].getAttribute('onclick');
        if (/souche\.collecte/.test(attribut))
        {
            list[i].click();
           
            //Date du jour
            var date = new Date();
           
            
            
            // Le cookie a une durée de vie d'un mois
            dtExpire.setTime(date.getTime() + 3600 * 1000 * 24 * 31);
           
            var newNombreCollecte = parseInt(nombreCollecte)+1;
           
            if(date.getDate() != parseInt(jourDerniereCollecte))
            {
                newNombreCollecte = 1;  
            }
            setCookie('jour', date.getDate(), dtExpire, '/' );
            setCookie('mois', date.getMonth(), dtExpire, '/' );
            setCookie('annee', date.getFullYear(), dtExpire, '/' );
            setCookie('heure', date.getHours(), dtExpire, '/' );
            setCookie('minute', date.getMinutes(), dtExpire, '/' );
                                               setCookie('collecte', newNombreCollecte, dtExpire, '/' );
        }
    }
}
 
//Creation du bloc contenant les informations
function createBloc()
{
    var nombreCollecte = getCookie('collecte');
    var jour = getCookie('jour');
    var mois = getCookie('mois');
    var annee = getCookie('annee');
   
    var heure = getCookie('heure');
    var minute = getCookie('minute');
   
    if(parseInt(minute) <10)
        minute = "0"+minute;
   
    //Bloc collecte
    var divBloc = document.createElement("div");
   
    divBloc.className = "right-bloc";
   
    divBloc.innerHTML = "<span class='texte16 yellow'>Collecte automatique</span><br>";
   
    var divTable = document.createElement("div");
   
    divTable.className = "div-table";
   
    
    
    var table = document.createElement("table");
   
    var tbody = document.createElement("tbody");
   
    var tr = document.createElement("tr");
   
    //Première ligne
    var td = document.createElement("td");
    td.style.width = "50%";
    td.innerText = "Collectes aujourd'hui : ";
    tr.appendChild(td);
    td = document.createElement("td");
                td.style.width = "50%";
    if(nombreCollecte != null)
    	td.innerText = nombreCollecte;
    tr.appendChild(td);
   
     tbody.appendChild(tr);
   
    //Deuxième ligne
    tr = document.createElement("tr");
    td = document.createElement("td");
    td.style.width = "50%";
    td.innerText = "Dernière collecte à : ";
    tr.appendChild(td);
   
    td = document.createElement("td");
    td.style.width = "50%";
    if(heure != null && minute != null)
    	td.innerText = heure+":"+minute;
    tr.appendChild(td);
   
    tbody.appendChild(tr);
   
    table.appendChild(tbody);
   
    divTable.appendChild(table);
   
    divBloc.appendChild(divTable);
   
    var blocDroite = document.getElementById('souche-right');
    var blocContester = document.getElementById('souche-right-contester');
   
    blocDroite.insertBefore(divBloc, blocContester);
   
    
    //Création du bloc de séparation
    var div = document.createElement("div");
   
    div.className = "right-top-margin";
       
    blocDroite.insertBefore(div, blocContester);   
    
    
}
 
createBloc();
 
 
var timer = setInterval(collecte, 1000);
