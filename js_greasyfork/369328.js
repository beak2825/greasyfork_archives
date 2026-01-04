// ==UserScript==
// @name         AntzzzHelper
// @namespace    https://greasyfork.org/fr/scripts/369328-antzzzhelper
// @version      1.1.1
// @description  Small script for Antzzz
// @author       Askidox
// @match        http://*.antzzz.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369328/AntzzzHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/369328/AntzzzHelper.meta.js
// ==/UserScript==


setTimeout(function () {
	console.log("RELOAD");
	document.location.href = "http://s1.antzzz.org/Reine.php";
}, 300000);
var sec = 300;

setInterval(function () {
    sec -= 30;
    var minute = parseInt(sec / 60);
    var seconde = sec - minute * 60;
    if (sec === 0){
        console.log("\n\nRELOAD\n\n\n\n\n");
    } else if (seconde != 0) {
        console.log("RELOAD dans " + minute + "m " + seconde + "s.");
    } else {
        console.log("RELOAD dans " + minute + "m.");
    }
}, 30000);

//------------------------------------------------------------
// Script Externe
//------------------------------------------------------------

//Nombre
var scriptNB = document.createElement("script");
scriptNB.src = "https://askigame.000webhostapp.com/SCRIPT/nb.js";
document.body.appendChild(scriptNB);

//------------------------------------------------------------
// VAR
//------------------------------------------------------------

var ComptePlus = (gE('menuComptePlus') && gE('menuComptePlus').getElementsByTagName('li').length > 3) ? true : false;
if (ComptePlus) {
	console.log("\n\n\n\n\n/!\\     C+     /!\\\n\n\n\n\n")
};


if (document.URL != "http://antzzz.org/") {
	var TDC = parseInt(document.querySelectorAll(".texte_ligne_boite_info")[3].textContent.replace(/\s/g, ""));
	var nbOuvri = parseInt(document.querySelectorAll(".texte_ligne_boite_info")[0].textContent.replace(/\s/g, ""));
	var nbOuvriSurTDC = getCookie("AntzzzHelper_nbOuvriSurTDC");
	var nbMat = parseInt(document.querySelectorAll(".texte_ligne_boite_info")[2].textContent.replace(/\s/g, ""));
	var nbNou = parseInt(document.querySelectorAll(".texte_ligne_boite_info")[1].textContent.replace(/\s/g, ""));
}

//------------------------------------------------------------
// Fonction
//------------------------------------------------------------
function gE(para) {
	return document.getElementById(para);
}

function sendLog(TEXT) {
    window.open("https://askigame.000webhostapp.com/AntzzzLog/NewLog.php?TEXT="+TEXT)
}

function logRecap(){
    sendLog("€Compte Rendu :_<strong>TDC</strong>: " + NB_ES(TDC) + " <strong>Ouv</strong>: " + NB_ES(nbOuvri) + "(" + NB_ES(parseInt(nbOuvriSurTDC))+" sur TDC) _<strong>Mat</strong>: " + NB_ES(nbMat) + "/"+ NB_ES(parseInt(getCookie("AH_CapaMat"))) + " <strong>Nou</strong>: " + NB_ES(nbNou) + "/" + NB_ES(parseInt(getCookie("AH_CapaNou")))+"_Cout de la prochaine construction: "+NB_ES(parseInt(getCookie("AntzzzHelper_PlusPetitCoutConstruction"))) +"_Cout de la prochaine recherche: " + NB_ES(parseInt(getCookie("AntzzzHelper_PPCLMat"))) + " Mat, " + NB_ES(parseInt(getCookie("AntzzzHelper_PPCLNou"))) + " Nou, " + NB_ES(parseInt(getCookie("AntzzzHelper_PPCLOuv"))) + " Ouv. Labo Need: "+getCookie("AntzzzHelper_PPCLLabo")+" (Actu:"+getCookie("NivLabo")+")");

}



//Nombre
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

		//Partie après virgule
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

//Transforme un nombre littéraire en nombre décimal
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

//Transforme un nombre décimal en nombre littéraire
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
// COMPTE RENDU
//------------------------------------------------------------
console.log("\n\n\nCompte Rendu :\n\n");
try {
	console.log("TDC: " + NB_ES(TDC));
} catch (e) {}
try {
	console.log("Ouvrière: " + NB_ES(nbOuvri) + " (" + NB_ES(parseInt(nbOuvriSurTDC)) + " sur TDC)");
} catch (e) {};
try {
	console.log(NB_ES(nbMat) + "/"+ NB_ES(parseInt(getCookie("AH_CapaMat"))) + " Matériaux et " + NB_ES(nbNou) + "/" + NB_ES(parseInt(getCookie("AH_CapaNou"))) +" Nourritures");
} catch (e) {};
try {
	console.log("Cout de la prochaine construction: " + NB_ES(parseInt(getCookie("AntzzzHelper_PlusPetitCoutConstruction"))));
} catch (e) {};
try {
	console.log("Cout de la prochaine recherche: " + NB_ES(parseInt(getCookie("AntzzzHelper_PPCLMat"))) + " Mat, " + NB_ES(parseInt(getCookie("AntzzzHelper_PPCLNou"))) + " Nou, " + NB_ES(parseInt(getCookie("AntzzzHelper_PPCLOuv"))) + " Ouv. Labo Need: "+getCookie("AntzzzHelper_PPCLLabo")+" (Actu:"+getCookie("NivLabo")+")");
} catch (e) {};

console.log("\n\n");

if (getCookie("AH_CompteRenduLogFait") != "true"){
    logRecap()
    setCookie("AH_CompteRenduLogFait", true, 1800/86400);
}

//------------------------------------------------------------
// Var Dev
//------------------------------------------------------------



//------------------------------------------------------------
// Code Par Page
//------------------------------------------------------------

if (document.URL === "http://antzzz.org/") {
	//------------------------------------------------------------
	// Code Page Login
	//------------------------------------------------------------
	setTimeout(function () {
		window.location.href = document.getElementById("boutonJouer").href;
	}, 10000);
} else if (document.URL === "http://s1.antzzz.org/Reine.php") {

	//------------------------------------------------------------
	//Check Cookie
	//------------------------------------------------------------
	if (getCookie("AntzzzHelper_PlusPetitCoutConstruction") === "") {
		console.log("Go To Construction: GetCookie PlusPetitCoutConstruction");
		setCookie("AntzzzHelper_LanceBuild", 2, 1);
		document.location.href = "http://s1.antzzz.org/construction.php";
	}

	if (getCookie("AntzzzHelper_nbOuvriSurTDC") === "") {
		console.log("Go To Ressource: GetCookie nbOuvriSurTDC");
		setCookie("AntzzzHelper_AddOuvri", true, 1);
		document.location.href = "http://s1.antzzz.org/Ressources.php";
	}

	if (getCookie("AntzzzHelper_LanceBuild") === "2") {
		setTimeout(function () {
			setCookie("AntzzzHelper_LanceBuild", "", -1);
		}, 500);
	}

	if (getCookie("AntzzzHelper_PPCLMat") === "" || getCookie("AntzzzHelper_PPCLNou") === "" || getCookie("AntzzzHelper_PPCLOuv") === "" ||  getCookie("AntzzzHelper_PPCLLabo") === "") {
		console.log("Go To Recherche: GetCookies");
		setCookie("AntzzzHelper_RtnReine", true, 1);
		document.location.href = "http://s1.antzzz.org/laboratoire.php";
	}

    if (getCookie("AH_CapaNou") === "" || getCookie("AH_CapaMat") === ""){
        console.log("Go To Construction: GetCookies");
        setCookie("AntzzzHelper_RtnReine", true, 1);
        document.location.href = "http://s1.antzzz.org/construction.php";
    }

    if (getCookie("AH_ConsEnCour") === "" && getCookie("AH_NoConsEnCour") != "true"){
        console.log("Go To Construction: GetCookies");
        setCookie("AH_CheckConsEnCour", true, 1);
        document.location.href = "http://s1.antzzz.org/construction.php";
    }

    if (getCookie("AH_RechEnCour") === "" && getCookie("AH_NoRechEnCour") != "true"){
        console.log("Go To Recherche: GetCookies");
        setCookie("AH_CheckRechEnCour", true, 1);
        document.location.href = "http://s1.antzzz.org/laboratoire.php";
    }

    if (getCookie("AH_NivLaboNeedOK") === "" || getCookie("AH_NivLaboNeedNonOK") === ""){
        console.log("Go To Recherche: GetCookies");
		setCookie("AntzzzHelper_RtnReine", true, 1);
		document.location.href = "http://s1.antzzz.org/laboratoire.php";
    }

    if (getCookie("AH_NivLabo") === ""){
        console.log("Go To Construction: GetCookies");
		setCookie("AntzzzHelper_RtnReine", true, 1);
        document.location.href = "http://s1.antzzz.org/construction.php";
    }

    //------------------------------------------------------------
    // Code Reine
    //------------------------------------------------------------


	//Voir s'il faut pondre
	var TpsFinPonte = 0;
	if (document.querySelector(".tableau_leger") != null) {
		var TpsFinPonteBrute = document.querySelector(".tableau_leger").children[0].lastChild.lastChild.textContent.replace(/ /g, "");
		var testTpsFinPonte = /^reste\((\d+),/
		testTpsFinPonte.test(TpsFinPonteBrute);
		TpsFinPonte = parseInt(RegExp.$1);
	}
	if (TpsFinPonte < 3600) {
		//Choisir Ponte
		var nbTotalOuvriAvecPonte = nbOuvri;
		if (document.querySelector(".tableau_leger") != null) {
			var nbPonte = document.querySelector(".tableau_leger").lastChild.querySelectorAll("tr").length - 1;
			var testPonteOuvri = /workers$/;
			for (var i = 1; i <= nbPonte; i++) {
				if (/workers$/.test(document.querySelector(".tableau_leger").lastChild.querySelectorAll("td")[i * 4].textContent)) {
					nbTotalOuvriAvecPonte += parseInt(document.querySelector(".tableau_leger").lastChild.querySelectorAll("td")[i * 4].textContent.replace(/\D/g, ""));
				}
			}
		}
        if (nbTotalOuvriAvecPonte < TDC * 2) {
            if (nbNou > 5) {
                var nbNewOuvri = Math.floor((nbNou - 1) / 5);
                var tpsParOuvriTEXT = document.getElementById("cout_temps").textContent;
                tpsParOuvriTEXT = tpsParOuvriTEXT.replace(/ /g, "");
                var nbJOuv = 0;
                var nbhOuv = 0;
                var nbmOuv = 0;
                var nbsOuv = 0;
                if (/(\d*)J/.test(tpsParOuvriTEXT)){
                    nbJOuv = parseInt(RegExp.$1);
                }
                if (/(\d*)h/.test(tpsParOuvriTEXT)){
                    nbhOuv = parseInt(RegExp.$1);
                }
                if (/(\d*)m/.test(tpsParOuvriTEXT)){
                    nbmOuv = parseInt(RegExp.$1);
                }
                if (/(\d*)s/.test(tpsParOuvriTEXT)){
                    nbsOuv = parseInt(RegExp.$1);
                }

                var tpsParOuvri = nbJOuv * (3600*24) + nbhOuv * 3600 + nbmOuv * 60 + nbsOuv;

                if (nbTotalOuvriAvecPonte + nbNewOuvri > TDC * 2) { //Si pas assez d'ouvri
                    console.log("3")
                    if ((TDC * 2 - nbTotalOuvriAvecPonte) * tpsParOuvri > 3600){ //Si ponte trop longue (>1h)
                        nbNewOuvri = Math.ceil(3600/tpsParOuvri);
                        console.log("1")
                    } else {
                        nbNewOuvri = TDC * 2 - nbTotalOuvriAvecPonte;
                        console.log("2")
                    }
                }

                $.ajax({
                    dataType: "html",
                    type: 'POST',
                    async: false,
                    url: "Reine.php",
                    data: {
                        unePonte: "oui",
                        typeUnite: "ouvriere",
                        t: document.querySelector("input#t").value,
						input_cout_nombre: 0,
						nombre_de_ponte: nbNewOuvri
					},
					contentType: "application/x-www-form-urlencoded; charset=utf-8",
					success: function (data) {
						console.log("Lancement Ponte (Ouvris)");
						sendLog("Lancement Ponte: "+nbNewOuvri+" Ouv ("+tpsParOuvri*nbNewOuvri+"s)");
						location.reload();
					}
				});
			}
		} else {
			if (nbNou > 16) {
				var nbNewJSN = Math.floor((nbNou - 1) / 16);

                var tpsParJSNTEXT = document.getElementById("cout_temps1").textContent;
                tpsParJSNTEXT = tpsParJSNTEXT.replace(/ /g, "");
                var nbJJSN = 0;
                var nbhJSN = 0;
                var nbmJSN = 0;
                var nbsJSN = 0;
                if (/(\d*)J/.test(tpsParJSNTEXT)){
                    nbJJSN = parseInt(RegExp.$1);
                }
                if (/(\d*)h/.test(tpsParJSNTEXT)){
                    nbhJSN = parseInt(RegExp.$1);
                }
                if (/(\d*)m/.test(tpsParJSNTEXT)){
                    nbmJSN = parseInt(RegExp.$1);
                }
                if (/(\d*)s/.test(tpsParJSNTEXT)){
                    nbsJSN = parseInt(RegExp.$1);
                }

                var tpsParJSN = nbJJSN * (3600*24) + nbhJSN * 3600 + nbmJSN * 60 + nbsJSN;

                if (nbNewJSN * tpsParJSN > 3600){ //Si ponte trop longue
                    nbNewJSN = Math.ceil (3600/tpsParJSN);
                }

				$.ajax({
					dataType: "html",
					type: 'POST',
					async: false,
					url: "Reine.php",
					data: {
						unePonte: "oui",
						typeUnite: "unite1",
						t: document.querySelector("input#t").value,
						destination1: 3,
						input_cout_nombre: 0,
						nombre_de_ponte: nbNewJSN
					},
					contentType: "application/x-www-form-urlencoded; charset=utf-8",
					success: function (data) {
						console.log("Lancement Ponte (JSN)");
                        sendLog("Lancement Ponte: "+nbNewJSN+" JSN ("+tpsParJSN*nbNewJSN+"s)");
						location.reload();
                    }
                });
            }
        }
    }


    //Go page en fonction de certaines conditions
    if (nbOuvriSurTDC < TDC && nbOuvriSurTDC < nbOuvri) {
        //Si des ouvris à attribuer
        console.log("Go To Ressource: Assigner Ouvries");
        setCookie("AntzzzHelper_AddOuvri", true, 1);
        sendLog("Nouveau TDC: "+TDC);
        document.location.href = "http://s1.antzzz.org/Ressources.php";
    } else if (nbMat > getCookie("AntzzzHelper_PlusPetitCoutConstruction") && getCookie("AH_ConsEnCour") === "") {
        //Si une construction peut être lancée
        console.log("Go To Construction:  Lancer Construction");
        setCookie("AntzzzHelper_LanceBuild", 1, 1);
        document.location.href = "http://s1.antzzz.org/construction.php";
    } else if (nbMat > getCookie("AntzzzHelper_PPCLMat") && nbNou > getCookie("AntzzzHelper_PPCLNou") && nbOuvri - TDC > getCookie("AntzzzHelper_PPCLOuv") && getCookie("AH_NivLabo") >= getCookie("AntzzzHelper_PPCLLabo") && getCookie("AH_RechEnCour") === "") {
        //Si une recherche peut être lancée
        console.log("Go To Laboratoire:  Lancer Recherche");
        setCookie("AntzzzHelper_LanceSearch", 1, 1);
        document.location.href = "http://s1.antzzz.org/laboratoire.php";
    } else if (getCookie("ArmeeEnChasse") === ""){
        console.log("Go To AcquerirTerrain:  Lancer Chasse");
        setCookie("AntzzzHelper_LanceChasse", 1, 1);
        document.location.href = "http://s1.antzzz.org/AcquerirTerrain.php";
    }

    //Definir Coef Nou/Mat
    if (/\d+/.test(getCookie("AH_CapaNou"))){
        var capaNou = parseInt(getCookie("AH_CapaNou"));
        var coefNouSurCapa = nbNou/capaNou;
        var lastCoef = (getCookie("AH_CoefMat") != "") ? parseFloat(getCookie("AH_CoefMat")) : 0;
        if (coefNouSurCapa <= 0.25){
            if (lastCoef != 1/2){
                setCookie("AH_CoefMat", 1/2, 7);
                console.log("Go To Ressource: Changement Coef");
                setCookie("AntzzzHelper_RtnReine", true, 1);
                document.location.href = "http://s1.antzzz.org/Ressources.php";
            }
        } else if (coefNouSurCapa <= 0.5) {
            if (lastCoef != 3/5){
                setCookie("AH_CoefMat", 3/5, 7);
                console.log("Go To Ressource: Changement Coef");
                setCookie("AntzzzHelper_RtnReine", true, 1);
                document.location.href = "http://s1.antzzz.org/Ressources.php";
            }
        } else {
            if (lastCoef != 1){
                setCookie("AH_CoefMat", 1, 7);
                console.log("Go To Ressource: Changement Coef");
                setCookie("AntzzzHelper_RtnReine", true, 1);
                document.location.href = "http://s1.antzzz.org/Ressources.php";
            }
        }
    }

} else if (document.URL.indexOf("Ressources") != -1) {

    //------------------------------------------------------------
    // Code Ressources
    //------------------------------------------------------------

    //Répartition Ressource
    var nb_ouv_on_mat = parseInt(gE('RecolteMateriaux').value.replace(/\s/g, ""));
    var nb_ouv_on_nou = parseInt(gE('RecolteNourriture').value.replace(/\s/g, ""));
    setCookie("AntzzzHelper_nbOuvriSurTDC", nb_ouv_on_mat + nb_ouv_on_nou, 7);

    var CoefMat = (getCookie("AH_CoefMat") != "") ? parseFloat(getCookie("AH_CoefMat")) : 3/5;

    var OuvIdealMat = Math.round(TDC * CoefMat);
    var OuvIdealNou = TDC - OuvIdealMat;


    if (nb_ouv_on_mat + nb_ouv_on_nou < Math.min(TDC, nbOuvri * 0.99999) || (OuvIdealNou != nb_ouv_on_nou && OuvIdealNou < nbOuvri) ) {
        if (OuvIdealNou != nb_ouv_on_nou) {
            gE('RecolteNourriture').value = OuvIdealNou;
            gE('RecolteMateriaux').value = 0;
            document.getElementsByName('ChangeRessource')[0].type = 'hidden';


        } else {
            gE('RecolteMateriaux').value = Math.min(TDC - nb_ouv_on_nou, nbOuvri - nb_ouv_on_nou);
            document.getElementsByName('ChangeRessource')[0].type = 'hidden';

		}
        gE("boite_ouvriere").getElementsByTagName('form')[0].submit();
	}

	if (getCookie("AntzzzHelper_AddOuvri")) {
		console.log("Go To Reine dans 10 secondes: Ouvrière Ajoutées");
		setTimeout(function () {
			setCookie("AntzzzHelper_AddOuvri", "", -1);
			document.location.href = "http://s1.antzzz.org/Reine.php";
		}, 10000);
    }

    if (getCookie("AntzzzHelper_RtnReine")) {
        console.log("Go To Reine dans 10 secondes : RtnReine");
        setTimeout(function () {
            setCookie("AntzzzHelper_RtnReine", "", -1);
            document.location.href = "http://s1.antzzz.org/Reine.php";
        }, 10000);
    }

} else if (document.URL.indexOf("construction") != -1) {
    //------------------------------------------------------------
    // Code Construction
    //------------------------------------------------------------

    //Lancer construction

    var MinConstruction = 0;
	//PPCC = PlusPetitCoutConstruction
	function getPlusPetitCout(Min) {
		var PlusPetitCoutConstruction = 1000000000000;
		var batiment = "";
        var stop = false;
		for (var i = 0; i < 13; i++) {
			var coutActu = (parseInt((document.querySelectorAll("[title=Materials]")[i].children[1].textContent).replace(/ /g, "")));
            if ((i === 3 || i === 4) && coutActu<getCookie("AH_CapaMat")){ //Avantage pour les TDPs
                coutActu = coutActu*0.75;
            } else if (i === 5 && coutActu<getCookie("AH_CapaMat")){ //Avantage ++ pour le labo
                coutActu = coutActu*0.6;
            }
            if (PlusPetitCoutConstruction > coutActu && coutActu > Min && (document.querySelectorAll(".desciption_amelioration")[i].querySelectorAll(".verificationNonOK").length === 0)) {
                if (i === 1 && getCookie("AH_CapaNou")*0.9 < nbNou){ //Si entrepotNou remplis
                    PlusPetitCoutConstruction = coutActu;
                    batiment = document.querySelectorAll(".desciption_amelioration")[i].children[0].textContent;
                } else if (i === 3 || i === 4) {
                    coutActu = coutActu*4/3;
                } else if (i === 5){
                    coutActu = coutActu*5/3;
                    stop = true;
                }
                PlusPetitCoutConstruction = coutActu;
                batiment = document.querySelectorAll(".desciption_amelioration")[i].children[0].textContent;
            }
            if (stop){
                i = 13;
            }
        }
        return {
            PPCC: PlusPetitCoutConstruction,
            batiment: batiment
        };
    }

    var PPCC = getPlusPetitCout(MinConstruction).PPCC;
    var batiment = getPlusPetitCout(MinConstruction).batiment;

    console.log("Prochain Batiment: "+batiment);

    function makeBatiment() {
        if (getCookie("AntzzzHelper_LanceBuild") === "1" && nbMat > PPCC && document.querySelector("[title=\"Build : " + batiment + " \"]") != null) {
            setCookie("AntzzzHelper_LanceBuild", 2, 1);
            console.log("Build : " + batiment);
            sendLog("Lancement Construction: "+batiment);
            window.location.href = document.querySelector("[title=\"Build : " + batiment + " \"]").parentElement.href;
        } else if (nbMat > PPCC && document.querySelector("[title=\"Build : " + batiment + " \"]") === null) {
            MinConstruction = PPCC;
            PPCC = getPlusPetitCout(MinConstruction).PPCC;
            batiment = getPlusPetitCout(MinConstruction).batiment;
			setCookie("AntzzzHelper_PlusPetitCoutConstruction", PPCC, 7);
			if (nbMat > PPCC && document.querySelector("[title=\"Build : " + batiment + " \"]") != null) {
				makeBatiment();
			} else if (nbMat < PPCC) {
				if (getCookie("AntzzzHelper_LanceBuild") === "1"){
                    console.log("Go To Reine dans 10 secondes: Pas assez de ressource");
                    setTimeout(function () {
                        setCookie("AntzzzHelper_LanceBuild", "", -1);
                        document.location.href = "http://s1.antzzz.org/Reine.php";
                    }, 10000);
                }
			} else if (nbMat > PPCC && document.querySelector("[title=\"Build : " + batiment + " \"]") === null) {
				MinConstruction = PPCC;
				PPCC = getPlusPetitCout(MinConstruction).PPCC;
				batiment = getPlusPetitCout(MinConstruction).batiment;
				setCookie("AntzzzHelper_PlusPetitCoutConstruction", PPCC, 7);
				makeBatiment();
			}
		}
	}

	makeBatiment();

	setCookie("AntzzzHelper_PlusPetitCoutConstruction", PPCC, 7);
	if (getCookie("AntzzzHelper_LanceBuild") === "2") {
		console.log("Go To Reine dans 10 secondes.");
		setTimeout(function () {
			setCookie("AntzzzHelper_LanceBuild", "", -1);
            document.location.href = "http://s1.antzzz.org/Reine.php";
        }, 10000);
    }

    //Prendre CapaEntrepot
    var testCapaEntrepot = /Currentcapacity:(\d+)Capacityat/;
    var textCENou = document.getElementById("descriptionComplete9").textContent;
    textCENou = textCENou.replace(/ /g, "");
    textCENou = textCENou.replace(/\n/g, "");
    testCapaEntrepot.test(textCENou)
    var CENou = parseInt(RegExp.$1);

    var textCEMat = document.getElementById("descriptionComplete10").textContent;
    textCEMat = textCEMat.replace(/ /g, "");
    textCEMat = textCEMat.replace(/\n/g, "");
    testCapaEntrepot.test(textCEMat)
    var CEMat = parseInt(RegExp.$1);

    setCookie("AH_CapaNou", CENou, 7);
    setCookie("AH_CapaMat", CEMat, 7);


    //get Fin construction
    var spanConstruction = document.querySelector("#centre strong span");
    if (spanConstruction != null){
        var TEXTFinCons = spanConstruction.textContent;
        TEXTFinCons = TEXTFinCons.replace(/ /g, "");
        var nbJFinCons = 0;
        var nbhFinCons = 0;
        var nbmFinCons = 0;
        var nbsFinCons = 0;
        if (/(\d*)days?/.test(TEXTFinCons)){
            nbJFinCons = parseInt(RegExp.$1);
        }
        if (/(\d*)hours?/.test(TEXTFinCons)){
            nbhFinCons = parseInt(RegExp.$1);
        }
        if (/(\d*)minutes?/.test(TEXTFinCons)){
            nbmFinCons = parseInt(RegExp.$1);
        }
        if (/(\d*)seconds?/.test(TEXTFinCons)){
            nbsFinCons = parseInt(RegExp.$1);
        }
        var TPSFinCons = nbJFinCons * (3600*24) + nbhFinCons * 3600 + nbmFinCons * 60 + nbsFinCons;

        setCookie("AH_NoConsEnCour", "", -1);
        setCookie("AH_ConsEnCour", true, (TPSFinCons+60)/86400);
    } else if (getCookie("AH_CheckConsEnCour")){
        setCookie("AH_NoConsEnCour", true, 1800/86400);
        console.log("Go To Reine dans 10 secondes : CheckNoCons");
        setTimeout(function () {
            setCookie("AH_CheckConsEnCour", "", -1);
            document.location.href = "http://s1.antzzz.org/Reine.php";
        }, 10000);
    }

    //Get Niv Labo
    var NivLabo = document.getElementById("descriptionComplete8").parentElement.querySelector(".niveau_amelioration").textContent.replace(/\D/g, "");
    setCookie("AH_NivLabo", NivLabo, 7);

    if (getCookie("AntzzzHelper_RtnReine")) {
        console.log("Go To Reine dans 10 secondes : RtnReine");
        setTimeout(function () {
            setCookie("AntzzzHelper_RtnReine", "", -1);
            document.location.href = "http://s1.antzzz.org/Reine.php";
        }, 10000);
    }

} else if (document.URL.indexOf("laboratoire") != -1) {
    //------------------------------------------------------------
    // Code Laboratoire
    //------------------------------------------------------------

    //Get NivLaboNeed
    var PlusGrandOk = 0;
    var PlusPetitNonOk = 999;
    var RegtestOK = /^verificationOK$/;
    var RegGetNivLabo = /Laboratory level (\d*)/
    var Requirements = document.querySelectorAll(".cliquable3");
    var LaboNeedParBatiment = [];
    Requirements.forEach(function(NivLaboText){
        if (/Laboratory/.test(NivLaboText.textContent)){
            var NB;
            if (RegtestOK.test(NivLaboText.classList[1])){
            parseInt(RegGetNivLabo.test(NivLaboText.textContent));
            NB = RegExp.$1;
            PlusGrandOk = (PlusGrandOk<NB) ? NB : PlusGrandOk;
        } else {
            parseInt(RegGetNivLabo.test(NivLaboText.textContent));
            NB = RegExp.$1;
            PlusPetitNonOk = (PlusPetitNonOk>NB) ? NB : PlusPetitNonOk;
        }
            LaboNeedParBatiment.push(NB);
        }
    });


    setCookie("AH_NivLaboNeedOK", PlusGrandOk, 7);
    setCookie("AH_NivLaboNeedNonOK", PlusPetitNonOk, 7);

    //Get Plus petit cout de recherche

    var MinLaboratoire = 0;
    //PPCL = PlusPetitCoutlaboratoire
    function getPlusPetitCout(Min) {
        var recherche = "";
        var PPCLMat = 1000000000000;
        var PPCLNou = 0;
        var PPCLOuv = 0;
        var PPCLLabo = 0;

        for (var i = 0; i < 10; i++) {
            var coutActuMat = (parseInt((document.querySelectorAll(".materiaux")[i].textContent).replace(/ /g, "")));
            var coutActuNou = (parseInt((document.querySelectorAll(".nourriture")[i].textContent).replace(/ /g, "")));
            var coutActuOuv = (parseInt((document.querySelectorAll(".ouvriere")[i].textContent).replace(/ /g, "")));
            if (i === 0 && coutActuMat<getCookie("AH_CapaMat") && coutActuNou<getCookie("AH_CapaNou") && ((LaboNeedParBatiment[i] <= PlusGrandOk || PlusGrandOk === 0)) || (PlusGrandOk === 0 && LaboNeedParBatiment[i] === PlusPetitNonOk) && (document.querySelectorAll(".desciption_amelioration")[i].querySelectorAll(".verificationNonOK").length === 0 || (document.querySelectorAll(".desciption_amelioration")[i].querySelectorAll(".verificationNonOK").length === 1 && /Laboratory/.test(document.querySelectorAll(".desciption_amelioration")[i].querySelectorAll(".verificationNonOK")[0])))){
                PPCLMat = coutActuMat;
                PPCLNou = coutActuNou;
                PPCLOuv = coutActuOuv;
                PPCLLabo = LaboNeedParBatiment[i];
                recherche = document.querySelectorAll(".desciption_amelioration")[i].children[0].textContent;
                i = 10;
            }
            if (PPCLMat > coutActuMat && coutActuMat > Min && coutActuOuv < nbOuvri - nbOuvriSurTDC && ((LaboNeedParBatiment[i] <= PlusGrandOk || PlusGrandOk === 0)) || (PlusGrandOk === 0 && LaboNeedParBatiment[i] === PlusPetitNonOk) && (document.querySelectorAll(".desciption_amelioration")[i].querySelectorAll(".verificationNonOK").length === 0 || (document.querySelectorAll(".desciption_amelioration")[i].querySelectorAll(".verificationNonOK").length === 1 && /Laboratory/.test(document.querySelectorAll(".desciption_amelioration")[i].querySelectorAll(".verificationNonOK")[0])))) {
                PPCLMat = coutActuMat;
                PPCLNou = coutActuNou;
                PPCLOuv = coutActuOuv;
                PPCLLabo = LaboNeedParBatiment[i];
                recherche = document.querySelectorAll(".desciption_amelioration")[i].children[0].textContent
            }
        }
        return {
            PPCLMat: PPCLMat,
            PPCLNou: PPCLNou,
            PPCLOuv: PPCLOuv,
            PPCLLabo: PPCLLabo,
            recherche: recherche
        };
    }
    var PPCLMat = getPlusPetitCout(MinLaboratoire).PPCLMat;
    var PPCLNou = getPlusPetitCout(MinLaboratoire).PPCLNou;
    var PPCLOuv = getPlusPetitCout(MinLaboratoire).PPCLOuv;
    var PPCLLabo = getPlusPetitCout(MinLaboratoire).PPCLLabo;


    var recherche = getPlusPetitCout(MinLaboratoire).recherche;
    console.log("Prochaine Recherche: "+recherche);

    setCookie("AntzzzHelper_PPCLMat", PPCLMat, 7);
    setCookie("AntzzzHelper_PPCLNou", PPCLNou, 7);
    setCookie("AntzzzHelper_PPCLOuv", PPCLOuv, 7);
    setCookie("AntzzzHelper_PPCLLabo", PPCLLabo, 7);



    //Lancer Recherche

    function LaunshSearch(){
        if (getCookie("AntzzzHelper_LanceSearch") === "1" && nbMat > PPCLMat && nbNou > PPCLNou && nbOuvri - nbOuvriSurTDC > PPCLOuv && getCookie("NivLabo") >= PPCLLabo && document.querySelector("[title=\"Research : " + recherche + "\"]") != null){
            setCookie("AntzzzHelper_LanceSearch", 2, 1);
            console.log("Search : " + recherche);
            sendLog("Lancement Recherche: "+recherche);
            window.location.href = document.querySelector("[title=\"Research : " + recherche + "\"]").parentElement.href;

        }
    }



    if (getCookie("AntzzzHelper_LanceSearch") === "2") {
		console.log("Go To Reine dans 10 secondes: Construiction lancée.");
		setTimeout(function () {
			setCookie("AntzzzHelper_LanceSearch", "", -1);
            document.location.href = "http://s1.antzzz.org/Reine.php";
        }, 10000);
    }

    LaunshSearch();

    //------------------------------------------------------------
    //
    //------------------------------------------------------------


    function makeBatiment() {
        if (getCookie("AntzzzHelper_LanceBuild") === "1" && nbMat > PPCC && document.querySelector("[title=\"Build : " + batiment + " \"]") != null) {
            window.location.href = document.querySelector("[title=\"Build : " + batiment + " \"]").parentElement.href;
            setCookie("AntzzzHelper_LanceBuild", 2, 1);
            console.log(document.querySelector("[title=\"Build : " + batiment + " \"]").parentElement.href);
        } else if (nbMat > PPCC && document.querySelector("[title=\"Build : " + batiment + " \"]") === null) {
            MinConstruction = PPCC;
            PPCC = getPlusPetitCout(MinConstruction).PPCC;
            batiment = getPlusPetitCout(MinConstruction).batiment;
            setCookie("AntzzzHelper_PlusPetitCoutConstruction", PPCC, 7);
            if (nbMat > PPCC && document.querySelector("[title=\"Build : " + batiment + " \"]") != null) {
                makeBatiment();
            } else if (nbMat < PPCC) {
                if (getCookie("AntzzzHelper_LanceBuild") === "1"){
                    console.log("Go To Reine dans 10 secondes: Pas assez de ressource");
                    setTimeout(function () {
                        setCookie("AntzzzHelper_LanceBuild", "", -1);
                        document.location.href = "http://s1.antzzz.org/Reine.php";
                    }, 10000);
                }
            } else if (nbMat > PPCC && document.querySelector("[title=\"Build : " + batiment + " \"]") === null) {
                MinConstruction = PPCC;
                PPCC = getPlusPetitCout(MinConstruction).PPCC;
                batiment = getPlusPetitCout(MinConstruction).batiment;
                setCookie("AntzzzHelper_PlusPetitCoutConstruction", PPCC, 7);
                makeBatiment();
            }
        }
    }
    //------------------------------------------------------------
    //
    //------------------------------------------------------------

    //get Fin Recherche
    var spanRecherche = document.querySelector("#centre strong span");
    if (spanConstruction != null){
        var TEXTFinRech = spanConstruction.textContent;
        TEXTFinCons = TEXTFinCons.replace(/ /g, "");
        var nbJFinRech = 0;
        var nbhFinRech = 0;
        var nbmFinRech = 0;
        var nbsFinRech = 0;
        if (/(\d*)days?/.test(TEXTFinCons)){
            nbJFinRech = parseInt(RegExp.$1);
        }
        if (/(\d*)hours?/.test(TEXTFinCons)){
            nbhFinRech = parseInt(RegExp.$1);
        }
        if (/(\d*)minutes?/.test(TEXTFinCons)){
            nbmFinRech = parseInt(RegExp.$1);
        }
        if (/(\d*)seconds?/.test(TEXTFinCons)){
            nbsFinRech = parseInt(RegExp.$1);
        }
        var TPSFinRech = nbJFinRech * (3600*24) + nbhFinRech * 3600 + nbmFinRech * 60 + nbsFinRech;

        setCookie("AH_NoRechEnCour", "", -1);
        setCookie("AH_RechEnCour", true, (TPSFinRech+60)/86400);
    } else if (getCookie("AH_CheckRechEnCour")){
        setCookie("AH_NoRechEnCour", true, 1800/86400);
        console.log("Go To Reine dans 10 secondes : CheckNoRech");
        setTimeout(function () {
            setCookie("AH_CheckRechEnCour", "", -1);
            document.location.href = "http://s1.antzzz.org/Reine.php";
        }, 10000);
    }

    if (getCookie("AntzzzHelper_RtnReine")) {
        console.log("Go To Reine dans 10 secondes : RtnReine");
        setTimeout(function () {
            setCookie("AntzzzHelper_RtnReine", "", -1);
            document.location.href = "http://s1.antzzz.org/Reine.php";
        }, 10000);
    }
} else if (document.URL.indexOf("AcquerirTerrain") != -1){
    //------------------------------------------------------------
    // Code Lancer Chasse
    //------------------------------------------------------------



    if (getCookie("AntzzzHelper_LanceChasse") === "1"){

        var nbTdcChasse = 25 + (25*((parseInt(TDC/1000))))

        function calculTempsChasse(bonus,terrainActuel)
        {
            var tempsBase = parseInt(terrainActuel) + nbTdcChasse ;
            var tempsFinal = Math.ceil( tempsBase * Math.pow(0.9 , parseInt(bonus) ) ) ;
            return tempsFinal ;
        }

        if (parseInt(gE("unite1").value.replace(/ /g, "")) >= 100){

            $.ajax({
                dataType: "html",
                type: 'POST',
                async: false,
                url: "AcquerirTerrain.php",
                data: {
                    AcquerirTerrain: nbTdcChasse,
                    unite1: (gE("unite1") != null) ? gE("unite1").value : 0,
                    unite2: (gE("unite2") != null) ? gE("unite2").value : 0,
                    unite3: (gE("unite3") != null) ? gE("unite3").value : 0,
                    t: document.querySelector("input#t").value,
                    pseudoCible: "",
                    ChoixArmee: "Lanch the hunt !"
                },
                contentType: "application/x-www-form-urlencoded; charset=utf-8",
                success: function (data) {
                    console.log("Launch Hunt Succes");
                    sendLog("Lancement Chasse");
                    setCookie("AntzzzHelper_LanceChasse", 2, 1);
                    setCookie("ArmeeEnChasse", true, (calculTempsChasse(' 0', TDC)+60)/86400);
                    location.reload();
                }
            });
        } else {
            console.log("Go To Reine dans 10 secondes : Armée trop faible");
            setTimeout(function () {
                setCookie("AntzzzHelper_LanceChasse", "", -1);
                setCookie("ArmeeEnChasse", true, 1800/86400)
                document.location.href = "http://s1.antzzz.org/Reine.php";
            }, 10000);
        }
    } else if (getCookie("AntzzzHelper_LanceChasse") === "2"){
        if(gE("tabChoixArmee") == null){
            console.log("Go To Reine dans 10 secondes : Chasse lancée");
            setTimeout(function () {
                setCookie("AntzzzHelper_LanceChasse", "", -1);
                document.location.href = "http://s1.antzzz.org/Reine.php";
            }, 10000);
        }
    }

}
