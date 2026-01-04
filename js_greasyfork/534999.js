// ==UserScript==
// @name         MultiFlood
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Multiflood et Affichage page membre
// @match        http://*.fourmizzz.fr/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534999/MultiFlood.user.js
// @updateURL https://update.greasyfork.org/scripts/534999/MultiFlood.meta.js
// ==/UserScript==

//------------------------------------------------------------
// Function
//------------------------------------------------------------

//Permet de savoir si l'attaque précédante était une attaque réduite ou non.
var lastAttaque = false;
if (getCookie("FH_lastAttaque") != ""){
    lastAttaque = JSON.parse(getCookie("FH_lastAttaque"));
} else {
    setCookie("FH_lastAttaque", false, 1);
}
//Calcule la prise optimal en fonction des deux TM
function CalcTMPris(Vtm, Ctm) {
    if (lastAttaque === false) {
        var Prise = parseInt(Ctm * 0.2 + 0.5);

        if (liminf(Vtm + Prise) >= Ctm - Prise) {

            while (liminf(Vtm + Prise) >= Ctm - Prise) {
                Prise -= (Prise / 1000000);
            }
            Prise = parseInt(Prise - 2);
            lastAttaque = true;
            setCookie("FH_lastAttaque", true, 1);
            return Prise;
        } else {

			return Prise;
		}
	} else if (lastAttaque === true) {
		lastAttaque = false;
        setCookie("FH_lastAttaque", false, 1);
		return Prise = parseInt(Ctm * 0.2 + 0.5);
	}
}

function liminf(tm) {
	return parseInt((tm / 2));
}

function limsup(tm) {
	return parseInt((tm * 3));
}


//------------------------------------------------------------
// Fontion Nombre
//------------------------------------------------------------

//Rajoute des espaces dans un nombre
function NB_ES(nb) {
	if (nb === "") {
		return "";
	}

	function test(e) {
		if (e === undefined) {
			return "";
		} else {
			return e;
		}
	}


	//Si sans virgule
	if (parseInt(nb) === nb) {
		var nbtext = String(nb);
		var nbtextfinal = "";
		var i = 0;
		while (i < parseInt(nbtext.length / 3) + 1) {
			nbtextfinal = test(nbtext[nbtext.length - 1 - (i * 3)]) + nbtextfinal;
			nbtextfinal = test(nbtext[nbtext.length - 2 - (i * 3)]) + nbtextfinal;
			nbtextfinal = test(nbtext[nbtext.length - 3 - (i * 3)]) + nbtextfinal;
			if (i < parseInt((nbtext.length - 1) / 3)) {
				nbtextfinal = " " + nbtextfinal;
			}
			i += 1;
		}
		return nbtextfinal;
	} else {
		var int = parseInt(nb);
		var float = nb - parseInt(nb);
		float = parseInt(float * Math.pow(10, String(nb).length - String(int).length - 1));


		//Partie avant la virgule
		var inttext = String(int);
		var inttextfinal = "";
		var i = 0;
		while (i < parseInt(inttext.length / 3) + 1) {
			inttextfinal = test(inttext[inttext.length - 1 - (i * 3)]) + inttextfinal;
			inttextfinal = test(inttext[inttext.length - 2 - (i * 3)]) + inttextfinal;
			inttextfinal = test(inttext[inttext.length - 3 - (i * 3)]) + inttextfinal;
			if (i < parseInt((inttext.length - 1) / 3)) {
				inttextfinal = " " + inttextfinal;
			}
			i += 1;
		}
		inttextfinal = inttextfinal.replace(/ $/, "");

		//Partie aprÃ¨s virgule
		var floattext = String(float);
		var floattextfinal = "";
		var i = 0;
		while (i < parseInt(floattext.length / 3) + 1) {
			floattextfinal = floattextfinal + test(floattext[(i * 3)]);
			floattextfinal = floattextfinal + test(floattext[(i * 3) + 1]);
			floattextfinal = floattextfinal + test(floattext[(i * 3) + 2]);
			if (i < parseInt((floattext.length - 1) / 3)) {
				floattextfinal = floattextfinal + " ";
			}
			i += 1;
		}
		floattextfinal = floattextfinal.replace(/ $/, "");
		floattextfinal = floattextfinal.replace(/^ /, "");


		//return nb final
		return inttextfinal+"."+floattextfinal;
	}
}

//Transforme un nombre littÃ©raire en nombre dÃ©cimal
function TX_NB(nb) {
	if (nb === "") {
		return "";
	}
	nb = nb.replace(/k/ig, "000");
	nb = nb.replace(/m/ig, "000000");
	nb = nb.replace(/g/ig, "000000000");
	nb = nb.replace(/t/ig, "000000000000");
	nb = nb.replace(/\D/ig, "");
	return parseInt(nb);

}

//Transforme un nombre dÃ©cimal en nombre littÃ©raire
function NB_TX(nb) {
	if (nb === "") {
		return "";
	}
	var nbtext = String(parseInt(nb));
	if (nb >= 1000000000000) {
		return parseInt(nb / 10000000000) / 100 + "T";
	} else if (nb >= 1000000000 && nb < 1000000000000) {
		return parseInt(nb / 10000000) / 100 + "G";
	} else if (nb >= 1000000 && nb < 1000000000) {
		return parseInt(nb / 10000) / 100 + "M";
	} else if (nb >= 1000 && nb < 1000000) {
		return parseInt(nb / 10) / 100 + "K";
	} else {
		return nb;
	}
}



//------------------------------------------------------------
// COOKIE
//------------------------------------------------------------


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}




//------------------------------------------------------------
// SCRIPT
//------------------------------------------------------------


function script(){

    //------------------------------------------------------------
    // VAR
    //------------------------------------------------------------

    //Get Pseudo
    var Pseudo = document.getElementById("pseudo").textContent;

    //------------------------------------------------------------
    // FHDIV
    //------------------------------------------------------------

    /*var version = "1.0";

    var FH_DIV = document.getElementById("boiteComptePlus");
    document.querySelectorAll(".titre_colonne_cliquable").forEach(function(aze){
        aze.style.position = "none";
    })
    document.querySelector(".contenu_boite_compte_plus").style.position = "none";

    var divTitre = document.createElement("div");
    divTitre.className = "titre_colonne_cliquable";
    var aTitre = document.createElement("a");
    aTitre.href = "javascript:void()";
    aTitre.textContent = "FH v"+version;
    divTitre.appendChild(aTitre);
    FH_DIV.appendChild(divTitre);*/



    //------------------------------------------------------------
    // Code Par Page
    //------------------------------------------------------------

    if (/Membre\.php\?Pseudo=/.test(document.URL)){
        //------------------------------------------------------------
        // Page Profils de Joueur
        //------------------------------------------------------------
        console.log("Page: Profils de Joueur");

        if (document.querySelectorAll(".tableau_score").length === 2){
            var TMCible = document.querySelectorAll(".tableau_score tr")[1].children[1].textContent.replace(/ /g, "");

            var MFAuto = document.createElement("li");
            var Lien = document.createElement("a");
            Lien.textContent = "MultiFlood";
            Lien.href = document.querySelectorAll(".tableau_score")[1].children[1].querySelector("li a").href;
            Lien.addEventListener("click", function(){
                setCookie("FH_MF", true, 1);
                setCookie("FH_MF_TDCMOI", parseInt(document.getElementById("quantite_tdc").textContent));
                setCookie("FH_MF_TDCCIBLE", TMCible, 1);
            });
            MFAuto.appendChild(Lien);
            document.querySelectorAll(".tableau_score")[1].children[1].appendChild(MFAuto);
        }
    } else if (/ennemie\.php\?Attaquer=/.test(document.URL)) {
        //------------------------------------------------------------
        // Page Lancement Attaque
        //------------------------------------------------------------
        console.log("Page: Lancement Attaque");
        if (getCookie("FH_MF")){
            var tdcJ = parseInt(getCookie("FH_MF_TDCMOI"));
            var tdcE = parseInt(getCookie("FH_MF_TDCCIBLE"));
            if (tdcE > liminf(tdcJ) && tdcE < limsup(tdcE)){
                var Armee = [];
                var TroupeAttaque = [];
                for (var i = 1; i <= 14; i++){
                    var inputTroupe = document.getElementById("unite"+i);
                    if (inputTroupe != null){
                        Armee.push(parseInt(inputTroupe.value.replace(/ /g, "")));
                    } else {
                        Armee.push(0);
                    }
                    TroupeAttaque.push(0);
                }

                var Prise = CalcTMPris(tdcJ, tdcE);
                var futurTdcE = tdcE - Prise;
                var futurTdcJ = tdcJ + Prise;
                for (var a = 0; a < 14; a++){
                    if (Prise <= Armee[a]){
                        TroupeAttaque[a] += Prise;
                        a = 14;
                    } else {
                        TroupeAttaque[a] += Armee[a];
                        Prise -= Armee[a];
                    }
                }
                console.log(Prise);
                $.ajax({
                    dataType: "html",
                    type: 'POST',
                    async: false,
                    url: document.getElementById("formulaireChoixArmee").action,
                    data: {
                        unite1: TroupeAttaque[0],
                        unite2: TroupeAttaque[1],
                        unite3: TroupeAttaque[2],
                        unite4: TroupeAttaque[3],
                        unite5: TroupeAttaque[4],
                        unite6: TroupeAttaque[5],
                        unite7: TroupeAttaque[6],
                        unite8: TroupeAttaque[7],
                        unite9: TroupeAttaque[8],
                        unite10: TroupeAttaque[9],
                        unite11: TroupeAttaque[10],
                        unite12: TroupeAttaque[11],
                        unite13: TroupeAttaque[12],
                        unite14: TroupeAttaque[13],
                        t: document.querySelector("input#t").value,
                        pseudoCible: document.querySelector("[name=pseudoCible]").value,
                        ChoixArmee: "Attaquer "+document.querySelector("[name=pseudoCible]").value+" !"
                    },
                    contentType: "application/x-www-form-urlencoded; charset=utf-8",
                    success: function (data) {
                        console.log("Flood Lance Succes");
                        setCookie("FH_MF_TDCMOI", futurTdcJ, 1);
                        setCookie("FH_MF_TDCCIBLE", futurTdcE, 1);
                        location.reload();
                    }
                });
            } else {
                alert("Attaques Lancées ! \nLa cible aura "+NB_ES(parseInt(getCookie("FH_MF_TDCCIBLE")))+" tdc à la fin des floods.");
                document.querySelector("#centre center").innerHTML += "<br><strong>TDC de la cible: "+NB_ES(parseInt(getCookie("FH_MF_TDCCIBLE")))+"<strong>";
                setCookie("FH_MF_TDCCIBLE", "", -1);
                setCookie("FH_MF", "", -1);
                setCookie("FH_MF_TDCMOI", "", -1);
                setCookie("FH_lastAttaque", "", -1);
            }

        }




    } else if (/alliance\.php\?Membres/.test(document.URL)){
        //------------------------------------------------------------
        // Page Membre Alliance
        //------------------------------------------------------------
        console.log("Page: Membre Alliance");
        //Coloration Ligne Joueur
        var trJoueur = document.querySelector("[href=\"Membre.php?Pseudo="+Pseudo+"\"]").parentElement.parentElement;
        trJoueur.style.backgroundColor = "white";

        //Si attaquable ou non
        var tableauHTML = document.getElementById("tabMembresAlliance").lastChild.children;
        var tableau = [];
        for (var i = 1; i < tableauHTML.length; i++){
            tableau.push(tableauHTML[i]);
        }
        var tdcJoueur = parseInt(document.getElementById("quantite_tdc").textContent);
        tableau.forEach(function(trJoueurActu){
            var tdcJA = parseInt(trJoueurActu.children[5].textContent.replace(/ /g, ""));
            if (tdcJA<tdcJoueur*3 && tdcJA>tdcJoueur/2){
                trJoueurActu.children[5].style.color = "red";
                trJoueurActu.children[5].setAttribute("alt", "Attaquable");
            }
        });

    }
}

setTimeout(script, 1000);