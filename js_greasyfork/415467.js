// ==UserScript==
// @name The-Adjutant
// @description Notifie les morts du journal de bord
// @match https://www.pirates-caraibes.com/fr/index.php?u_i_page=19
// @version 1.0
// @author Gyeongeun
// @namespace Gyeongeun_31399
// @grant none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/415467/The-Adjutant.user.js
// @updateURL https://update.greasyfork.org/scripts/415467/The-Adjutant.meta.js
// ==/UserScript==

//+------------ Options --------------+

//--- Personnages (ID)
const include = [];
const exclude = [];
// saisir entre les crochets la liste
// des IDs sépararés par des virgules;

//--- Nations
const FR=true;
const EN=true;
const NL=true;
const ES=true;
const PR=true;
const Paria=true;

//--- réglages
var seconds = 5;
var autostart=true;




//+------------ setup --------------+

const flagfolder = "https://www.pirates-caraibes.com/media/nationalite/";
const nChecking = [FR, EN, ES, NL, PR];
const nFlag =['francais.gif','anglais.gif','espagnol.gif','hollandais.gif','pirates.gif']
const nFlagP =['paria_francais.gif','paria_anglais.gif','paria_espagnol.gif','paria_hollandais.gif','paria_pirates.gif']
var nationflags=[];

var timer;
var nflag, aflag, isExcluded=false, isIncluded=false;

//+------------ running --------------+
init();
GUI();

//+------------ Functions --------------+


function startActivityRefresh(){
    timer = setInterval(scan, seconds*1000)
}

function cancelActivityRefresh(){
    clearInterval(timer);
}

function turnOn(){
    var startButton=document.querySelector('#sButton');
    startButton.value="stop";
    startButton.addEventListener('click',turnOff,false);
    startActivityRefresh();
}

function turnOff(){
    var startButton=document.querySelector('#sButton');
    startButton.value="start";
    startButton.addEventListener('click',turnOn,false);
    cancelActivityRefresh();
}

function scan(){
    //--- requête
    var nReport=loadReport();
    var table=nReport.getElementById('id_blesse');

    //--- ally = tr2 td3
    var lastn=sessionStorage.lastn;
    var rowA=table.getElementsByTagName("TR")[1];
    var cellA=rowA.getElementsByTagName("TD")[2];
    var srcA=cellA.getElementsByTagName("IMG")[0].src;
    var nameA=cellA.getElementsByTagName("B")[0].innerHTML;
    var onclickA=cellA.innerHTML;
        //var onclickA=cellA.getElementsByTagName("A")[0].onclick;
    var idA=onclickA.match(/pirat_ct_joueur_\d+/i).toString();
    idA=idA.replace("pirat_ct_joueur_","");
    idA=parseInt(idA);
    for(let id in include){
        if(idA==include[id]){isIncluded=true}else{isIncluded=false}
    }
    for(let id in exclude){
        if(idA==exclude[id]){isExcluded=true}else{isExcluded=false}
    }

    //--- ennemy = tr2 td1
    var rowE=table.getElementsByTagName("TR")[1];
    var cellE=rowE.getElementsByTagName("TD")[0];
    var urlE=cellE.getElementsByTagName("A")[0].href;
    var srcE;
    if(urlE!="#"){
        srcE=cellE.getElementsByTagName("IMG")[0].src;
    }else{
        srcE="https://www.pirates-caraibes.com/media/nationalite/neutre.gif";
    }
    var nameE=cellE.getElementsByTagName("B")[0].innerHTML;
    //--- scan
    var permission = Notification.permission;
    if(nameA!=lastn){
    if(isExcluded==false && isIncluded!=true){
    for(var f in nationflags){
        var oneSrc=flagfolder+nationflags[f];
        if(srcA==oneSrc){
            if(permission=="granted") {
                showNotification2(srcE,nameA,nameE);
            }
        }
    }}else if(isIncluded==true){
            if(permission=="granted") {
                showNotification2(srcE,nameA,nameE);
            }
    }}

    sessionStorage.lastn=nameA;
}


function GUI(){
    var startButton = document.createElement('INPUT');
    startButton.id="sButton";
    startButton.type="button";

    var main=document.getElementById('div-content-center');
    main.firstElementChild.appendChild(startButton);

    if(autostart){
        startButton.value="stop";
        main.querySelector('#sButton').addEventListener('click',turnOff,false);
        startActivityRefresh();
    }else{
        startButton.value="start";
        main.querySelector('#sButton').addEventListener('click',turnOn,false);
    };
    // <input type="number" id="mSz" title="Taille du minichat en px" placeholder=""><br>
}

function init(){
    //--- config drapeaux
    for(var n in nChecking){
        if(nChecking[n]){
            nationflags=nationflags.concat(nFlag[n]);
            if(Paria){
                nationflags=nationflags.concat(nFlagP[n]);
        }}
     }

    var table=document.getElementById('id_blesse');
    //--- initialisation memo
    var rowA=table.getElementsByTagName("TR")[1];
    var cellA=rowA.getElementsByTagName("TD")[2];
    var nameA=cellA.getElementsByTagName("B")[0].innerHTML;
    sessionStorage.lastn=nameA;

    //--- notif'
    var permission = Notification.permission;
    if(permission!="granted") {
        Notification.requestPermission();
    }
}

function showNotification2(icon,nameA,nameE){
	var title = nameE;
    var body = "Victime : "+nameA;
	var notification = new Notification(title, { body, icon });
	notification.onclick = () => {
		notification.close();
        window.open("https://www.pirates-caraibes.com/fr/jeu/");
        //window.parent.focus();
	}
}

function loadReport(){
    var theURL="https://www.pirates-caraibes.com/fr/index.php?u_i_page=19";
	var requested;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      requested = this.responseText;
    }
    };
    xhttp.open("GET", theURL, false);
    xhttp.send(null);

	var parser = new DOMParser();
	var htmlDoc = parser.parseFromString(requested, "text/html");
    return htmlDoc;
}