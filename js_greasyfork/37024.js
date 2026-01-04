// ==UserScript==
// @name     410'n ed
// @version  1.2.1
// @description Script permettant petut-être de combattre les 410
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @include  https://www.jeuxvideo.com/forums/*
// @include  http://www.jeuxvideo.com/forums/*
// @grant    none
// @namespace https://greasyfork.org/users/103119
// @downloadURL https://update.greasyfork.org/scripts/37024/410%27n%20ed.user.js
// @updateURL https://update.greasyfork.org/scripts/37024/410%27n%20ed.meta.js
// ==/UserScript==   

var archiverButton = document.createElement("input");
archiverButton.type = "button";
archiverButton.value = "REC";
archiverButton.addEventListener("click", function() {archiver();});
archiverButton.setAttribute("style","border: 1px solid black; width: 40px; height: 30px; position: absolute; right: 1.5%; top: 17%;font-size: 12px;");
document.getElementsByClassName("jv-header-top")[0].appendChild(archiverButton);

var searchButton = document.createElement("input");
searchButton.type = "button";
searchButton.value = "Rechercher ?";
searchButton.addEventListener("click", function() {search();});
searchButton.setAttribute("style","border: 1px solid black; width: 100px; height: 30px; position: absolute; right: 30.5%; top: 17%;font-size: 12px;");
document.getElementsByClassName("jv-header-top")[0].appendChild(searchButton);

function archiver() {
var page = document.location.href;
var msg = [];

for (i = 0; i < document.getElementsByClassName("txt-msg  text-enrichi-forum ").length; i++) {
  msg[i] = document.getElementsByClassName("txt-msg  text-enrichi-forum ")[i].innerHTML;
}

var obj = {
    "site": document.location.href,
    "msg1": msg[0],
    "msg2": msg[1],
    "msg3": msg[2],
    "msg4": msg[3],
    "msg5": msg[4],
    "msg6": msg[5],
    "msg7": msg[6],
    "msg8": msg[7],
    "msg9": msg[8],
    "msg10": msg[9],
    "msg11": msg[10],
    "msg12": msg[11],
    "msg13": msg[12],
    "msg14": msg[13],
    "msg15": msg[14],
    "msg16": msg[15],
    "msg17": msg[16],
    "msg18": msg[17],
    "msg19": msg[18],
    "msg20": msg[19]
};

var data = JSON.stringify(obj);

$.ajax({
       url: "https://api.myjson.com/bins",
       type: "POST",
       data: data,
       contentType: "application/json; charset=utf-8",
       dataType: "json",
       success: function (data, textStatus, jqXHR) {
           var json = JSON.stringify(data);
           console.log(json);
           alert("La page a été sauvegardé avec succès !");
           rajouterListe(json);
      }
});
  
}

function rajouterListe(json) {
  var json = JSON.parse(json);
  var uriCreate = json.uri;
  var uriActu = document.location.href;
  console.log(uriCreate);
  console.log(uriActu);
  
  var obj = {
    "siteJv": uriActu,
    "siteArch": uriCreate
};
  
  var data = JSON.stringify(obj);
  
  var http = new XMLHttpRequest();
  var url = "https://samsamdu44.000webhostapp.com/script/traitement.php";
  var params = "data="+data;
  
  http.open("POST", url, true);
  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  
  http.onreadystatechange = function() {
    if (http.readyState == 4 && http.status == 200) {
        alert("La page a été ajouté a la liste des archives avec succès !");
    }
}
  
  http.send(params);
}

function search() {
if (document.getElementsByClassName("img-erreur img-responsive text-center")[0] !== undefined ) {
  var http = new XMLHttpRequest();
  http.open("GET", "https://samsamdu44.000webhostapp.com/script/database.txt", false); 
  http.send(null);
  var database = http.responseText;
  var url = document.location.href;
  if (database.indexOf(url) != -1) {
    alert("Le topic est bien archivé !");
    
    var data = database.substring(database.indexOf(url));
    data = data.substring(data.indexOf('","siteArch":"'));
    data = data.substring(14, data.indexOf('"}'));
    console.log(data);
    
    if (window.confirm("Visionner les messages ?")) { 
    	window.open("http://samsamdu44.000webhostapp.com/script/jsonviewer.php?msg="+data);
		}
  }
  else {
    alert("Ce topic n'a pas été archivé.");
  }
}
  
	else {
  	alert("Ce topic n'a pas été 410'ed.");
 	}
 }