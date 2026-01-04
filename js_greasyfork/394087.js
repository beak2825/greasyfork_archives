// ==UserScript==
// @name     Filtre Anti-Spam MP
// @description Filtre les spams de MP sur JVC selon les patterns définis par l'utilisateur
// @version  12
// @match        http://www.jeuxvideo.com/*
// @match        http://m.jeuxvideo.com/*
// @match        https://www.jeuxvideo.com/*
// @match        https://m.jeuxvideo.com/*
// @author       Tsr_crew & Alectrona
// @license      MIT
// @language     fr
// @require			http://code.jquery.com/jquery-3.4.1.min.js
// @grant    GM.getValue
// @grant    GM.setValue
// @namespace https://greasyfork.org/users/396340
// @downloadURL https://update.greasyfork.org/scripts/394087/Filtre%20Anti-Spam%20MP.user.js
// @updateURL https://update.greasyfork.org/scripts/394087/Filtre%20Anti-Spam%20MP.meta.js
// ==/UserScript==

var bl1 = [];
var bl2 = [];
var bl3 = [];
var bl1tags;
var bl2tags;
var bl3tags;
var nbrep;
var nbrepattendues;

document.getElementsByClassName('jv-account-number-mp')[0].className = "jv-account-number-mp";

var harcelement = document.getElementsByClassName('jv-nav-harassment-warning')[0];
harcelement.innerHTML = "";
harcelement.style.height = "27px";
harcelement.style.padding = "1px";
harcelement.style.textAlign = "center";
var node = document.createElement("input");
node.setAttribute("type", "button");
node.setAttribute("value", "Liste noire des pseudos");
node.setAttribute("style", "color:black;");
node.setAttribute("id", "editbl1");
harcelement.appendChild(node);

var node2 = document.createElement("input");
node2.setAttribute("type", "button");
node2.setAttribute("value", "Liste noire des objets");
node2.setAttribute("style", "color:black;");
node2.setAttribute("id", "editbl2");
harcelement.appendChild(node2);

var node3 = document.createElement("input");
node3.setAttribute("type", "button");
node3.setAttribute("value", "Liste noire des contenus");
node3.setAttribute("style", "color:black;");
node3.setAttribute("id", "editbl3");
harcelement.appendChild(node3);
  
document.getElementById('editbl1').onclick = function() {editbl1();};
document.getElementById('editbl2').onclick = function() {editbl2();};
document.getElementById('editbl3').onclick = function() {editbl3();};
document.getElementsByClassName('jv-account-number-mp')[0].onclick = function() {ctrcheck();};

document.getElementById('page-topics').onclick = function(){
  var dropdown = document.getElementsByClassName('jv-nav-dropdown-container')[1];
  dropdown.style.display="none";
};

document.getElementsByClassName('jv-global-menu')[0].onclick = function(){
  var dropdown = document.getElementsByClassName('jv-nav-dropdown-container')[1];
  dropdown.style.display="none";
};

document.getElementsByClassName('jv-nav-account-notif')[0].onclick = function(){
  var dropdown = document.getElementsByClassName('jv-nav-dropdown-container')[1];
  dropdown.style.display="none";
};

document.getElementsByClassName('jv-nav-account-user')[0].onclick = function(){
  var dropdown = document.getElementsByClassName('jv-nav-dropdown-container')[1];
  dropdown.style.display="none";
};

document.getElementsByClassName('jv-nav-account-mp')[0].onclick = function(){
  var dropdown = document.getElementsByClassName('jv-nav-dropdown-container')[1];
  if (dropdown.style.display=="none") {
    dropdown.style.display="block";
  }
  else {
    dropdown.style.display="none";  
  }

};


function ctrcheck() {

spamchecker(false);
document.getElementsByClassName('jv-account-number-mp')[0].setAttribute('data-val', 0);
document.getElementsByClassName('jv-account-number-mp')[0].className = "jv-account-number-mp";
var mpluhash = document.getElementsByClassName('jv-nav-dropdown-link account-mp-reset')[0].dataset.url;
$.get('https://www.jeuxvideo.com' + mpluhash);
  
setTimeout(function(){

var docLinks = document.getElementsByClassName('jv-nav-dropdown-details');
var parent;
for(var i=0;i < docLinks.length; i++){
	var k = 0;
	var blmatch = 1;
	while(k < bl1.length && blmatch == 1) {
 var auth = docLinks[i].childNodes[0].innerHTML.toLowerCase();
 var str = bl1[k];
 if (str && auth.includes(str)) {
   parent = docLinks[i].parentNode;
   parent.style.display = "none";
//   docLinks[i].className = "spammeur";
   blmatch = 0;
 }
    k++;
	}
  
	var m = 0;
	while(m < bl2.length && blmatch == 1) {
 var auth2 = docLinks[i].childNodes[1].title.toLowerCase();;
 var str2 = bl2[m];
 if (str2 && auth2.includes(str2)) {
   parent = docLinks[i].parentNode;
   parent.style.display = "none";
//   docLinks[i].className = "spammeur";
   blmatch = 0;
 }
    m++;
	}
}
}, 500);
}

function editbl1() {
  var newbl1 = prompt("------------------------------- Saisissez les patterns de PSEUDOS à blacklister, séparés d'une virgule. (Insensible à la casse) -------------------------------", bl1tags);
  if (newbl1 != null) {
    newbl1 = newbl1.toLowerCase();
		bl1tags = newbl1;
    bl1 = newbl1.split(',');
    GM.setValue("abl1", JSON.stringify(bl1));
    
    var docLinks = document.getElementsByClassName('jv-nav-dropdown-details');
var parent;
for(var i=0;i < docLinks.length; i++){
	var k = 0;
	var blmatch = 1;
	while(k < bl1.length && blmatch == 1) {
 var auth = docLinks[i].childNodes[0].innerHTML.toLowerCase();
 var str = bl1[k];
 if (str && auth.includes(str)) {
   parent = docLinks[i].parentNode;
   parent.style.display = "none";
//   docLinks[i].className = "spammeur";
   blmatch = 0;
 }
    k++;
	}
  
	var m = 0;
	while(m < bl2.length && blmatch == 1) {
 var auth2 = docLinks[i].childNodes[1].title.toLowerCase();;
 var str2 = bl2[m];
 if (str2 && auth2.includes(str2)) {
   parent = docLinks[i].parentNode;
   parent.style.display = "none";
//   docLinks[i].className = "spammeur";
   blmatch = 0;
 }
    m++;
	}
    if(docLinks[i].parentNode.style.display == "none" && blmatch == 1) {
  		docLinks[i].parentNode.style.display = "";
  }
}
  }
}

function editbl2() {
  var newbl2 = prompt("---------------------------- Saisissez les patterns d'OBJETS DE MP à blacklister, séparés d'une virgule. (Insensible à la casse) ----------------------------", bl2tags);
  if (newbl2 != null) {
    newbl2 = newbl2.toLowerCase();
    bl2tags = newbl2;
    bl2 = newbl2.split(',');
    GM.setValue("abl2", JSON.stringify(bl2));
    
    var docLinks = document.getElementsByClassName('jv-nav-dropdown-details');
var parent;
for(var i=0;i < docLinks.length; i++){
	var k = 0;
	var blmatch = 1;
	while(k < bl1.length && blmatch == 1) {
 var auth = docLinks[i].childNodes[0].innerHTML.toLowerCase();
 var str = bl1[k];
 if (str && auth.includes(str)) {
   parent = docLinks[i].parentNode;
   parent.style.display = "none";
//   docLinks[i].className = "spammeur";
   blmatch = 0;
 }
    k++;
	}
  
	var m = 0;
	while(m < bl2.length && blmatch == 1) {
 var auth2 = docLinks[i].childNodes[1].title.toLowerCase();;
 var str2 = bl2[m];
 if (str2 && auth2.includes(str2)) {
   parent = docLinks[i].parentNode;
   parent.style.display = "none";
//   docLinks[i].className = "spammeur";
   blmatch = 0;
 }
    m++;
	}
    if(docLinks[i].parentNode.style.display == "none" && blmatch == 1) {
  		docLinks[i].parentNode.style.display = "";
  }
}
  }
}

function editbl3() {
  var newbl3 = prompt("------------------------ Saisissez les patterns de CONTENUS DE MP à blacklister, séparés d'une virgule. (Insensible à la casse) ------------------------", bl3tags);
  if (newbl3 != null) {
    newbl3 = newbl3.toLowerCase();
    bl3tags = newbl3;
    bl3 = newbl3.split(',');
    GM.setValue("abl3", JSON.stringify(bl3));
  }
}

function spamchecker(rcpt) {
var cpt = 0;
$.get('https://www.jeuxvideo.com/messages-prives/boite-reception.php', function (data) {
    var nonlu = {};
    var cptarti = {};
    var container = document.implementation.createHTMLDocument().documentElement;
    container.innerHTML = data;
    var mpssss = container.getElementsByClassName('row-mp');
    var spamsatuer = [];
    var spamsatuer2 = [];
    for (var i = 1; i < mpssss.length; i++) {
    	var mprchilds = mpssss[i].children;
      var pseudo = mprchilds[0].firstChild.firstChild.innerHTML.toLowerCase();
      var objet = mprchilds[1].firstChild.innerHTML.toLowerCase();
      var lien = mprchilds[1].firstChild.href; // ajouter "https://www.jeuxvideo.com" au début
  	  var id = mprchilds[3].firstChild.value;
        nonlu[id] = (mpssss[i].className == "row-mp");
        cptarti[id] = false;
			var k = 0;
      var m = 0
			var blmatch = false;
			while(k < bl1.length && blmatch == false) {
 				var str = bl1[k];
 				if (str && pseudo.includes(str)) {
					spamsatuer.push(id);
			  	blmatch = true;
 				}
    		k++;
			}
      while(m < bl2.length && blmatch == false) {
 				var str2 = bl2[m];
 				if (str2 && objet.includes(str2)) {
					spamsatuer.push(id);
          blmatch = true;
 				}

    		m++;
			}
      if (blmatch == false && mpssss[i].className == "row-mp") {
      cpt++;
      cptarti[id] = true;
      nonlu[id] = false; //pas très propre mais ça évite de recompter le mp une seconde fois pour le compteur de mp non lu

      }

   	}

    var u = 1;
    while (u < mpssss.length) {
      var mprchilds2 = mpssss[u].children;
      var lien2 = mprchilds2[1].firstChild.href; // ajouter "https://www.jeuxvideo.com" au début
  	  var id2 = mprchilds2[3].firstChild.value;



        $.get('https://www.jeuxvideo.com' + lien2, function (dat) {

        var cont = document.implementation.createHTMLDocument().documentElement;
        cont.innerHTML = dat;
            var idz = cont.getElementsByClassName("btn btn-actualiser icon-spinner11")[0].href.slice(32, 40);
            var x = cont.getElementsByClassName("bloc-jvcode-msg hide")[0];
            var y = x.textContent.toLowerCase();

            var k = 0;
			var blmatch2 = false;
			while(k < bl3.length && blmatch2 == false) {
 				var str2 = bl3[k];

 				if (str2 && y.includes(str2)) {
					spamsatuer.push(idz);
                    blmatch2 = true;
                    if (cptarti[idz]) {
                        cpt--;
                    }
 				}

    		k++;
			}
            if (blmatch2 == false && nonlu[idz]) {
                cpt++;
            }


//alert("u : " + u + " mpsss.length : " + mpssss.length);
/*        if(u == (mpssss.length - 1)) {
            alert("voila");
                            var selector2 = container.querySelectorAll("#b-reception > form > input[type=hidden]");
        const randomKey2 = selector2[3].name;
        var obj2 = {
            fs_session: selector2[0].value,
            fs_timestamp: selector2[1].value,
            fs_version: selector2[2].value,
            "conv_select[]": [],
            conv_move: "666"
        };
        obj2[randomKey2] = selector2[3].value;
        spamsatuer2.forEach(e => {
            obj2["conv_select[]"].push(e)
        });
    		$.post("https://www.jeuxvideo.com/messages-prives/boite-reception.php", obj2);
//alert(2);
                    } */
        });
//        console.log("u : " + u + " mpsss : " + (mpssss.length - 1));
        u++;
    }


//      Promise.all(promises).then(values => console.log(values))

        var selector = container.querySelectorAll("#b-reception > form > input[type=hidden]");
        const randomKey = selector[3].name;
        var obj = {
            fs_session: selector[0].value,
            fs_timestamp: selector[1].value,
            fs_version: selector[2].value,
            "conv_select[]": [],
            conv_move: "666"
        };
        obj[randomKey] = selector[3].value;

    setTimeout(function(){
        spamsatuer.forEach(e => {
            obj["conv_select[]"].push(e)
        });
    		$.post("https://www.jeuxvideo.com/messages-prives/boite-reception.php", obj);

          			if (rcpt == true) {
        document.getElementsByClassName('jv-nav-dropdown-title')[0].innerHTML = "<img src='https://image.jeuxvideo.com/smileys_img/5.gif'> Patch anti-spam appliqué <img src='https://image.jeuxvideo.com/smileys_img/5.gif'>";

  			if (cpt > 0) {
          	document.getElementsByClassName('jv-account-number-mp')[0].setAttribute('data-val', cpt);
        		document.getElementsByClassName('jv-account-number-mp')[0].className = "jv-account-number-mp has-notif";
        }
        }

    }, 2000);
  // actualiser le compteur de MP
});
}
//ON ATTEND LE CHARGEMENT DES BLACKLISTS DE L'UTILISATEUR

(async function() {
  
bl1 = await GM.getValue('abl1','["leao","riyadmahrez"]');
bl2 = await GM.getValue('abl2','["vous 25€ par","discord des igoent"]');
bl3 = await GM.getValue('abl3','["drystylejap","https://discord.gg/MHdPC2m"]');
var dropdown = document.getElementsByClassName('jv-nav-dropdown-container')[1];
dropdown.style.display="none";
bl1 = JSON.parse(bl1);
bl2 = JSON.parse(bl2);
bl3 = JSON.parse(bl3);
bl1tags = bl1.join();
bl2tags = bl2.join();
bl3tags = bl3.join();
spamchecker(true);
})();