// ==UserScript==
// @name        ore presenze
// @namespace   snac64
// @description ore presenze per Gerip
// @include     http://geripgruppo.servizi.gr-u.it:8080/Dm_akros/servlet/Quadratura.serv_Giornaliera
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/26996/ore%20presenze.user.js
// @updateURL https://update.greasyfork.org/scripts/26996/ore%20presenze.meta.js
// ==/UserScript==

///////   oggetto Orario  /////////

function Orario(){
	this.testo = "";
	this.ore   = 0;
	this.minuti = 0;
};

Orario.prototype.decod = function(txt){
  if (typeof txt == null) {
		txt=" ";
	};
	if (txt == "") {
		txt=" ";
	};
  this.testo = 	txt;
  this.ore   = parseInt(txt.substr(0,2));
	this.minuti = parseInt(txt.substr(3,2));
};

Orario.prototype.cod = function(o,m){
	if (m < 0) {
		m = m + 60;
		o = o - 1;
	};
	if (m >= 120) {
		m = m - 120;
		o = o + 2;
	};
	if (m >= 60) {
		m = m - 60;
		o = o + 1;
	};
	this.ore   = o;
	this.minuti = m;
  if (o <= 9) {
		this.testo = "0" + o;
	} else {
		this.testo = o;
	};
  if (m <= 9) {
		this.testo = this.testo + ": 0" + m;
	} else {
		this.testo = this.testo + ": " + m;
	};
	if (this.testo == "00:00"){
		this.testo = "";
	};
};

Orario.prototype.delta = function(oda,oa){
  this.cod(oa.ore - oda.ore, oa.minuti - oda.minuti);
};

Orario.prototype.somma = function(oda,oa){
  this.cod(oa.ore + oda.ore, oa.minuti + oda.minuti);
};

///////   oggetto Orario  - fine /////////


/////// variabili globali   /////////////

  var documento = {};
  var pausa = [];
  var lavoro = [];
  var maxP = 0;
  var maxL = 0;
  var totP = new Orario();
  var totL = new Orario();

/////// variabili globali   - fine  /////////////


function calcola_intervalli(){
  var entrata = [];
  var uscita = [];
  var i = 0;
  var elemento;
  var timbrE = "timbr_E_ora_"
  var timbrU = "timbr_U_ora_"
  var testo = "";
  do {
    elemento = documento.getElementById(timbrE + i);
    if (elemento == null){
      break;
    };
    testo = elemento.innerText;
    entrata[maxP] = new Orario();
    entrata[maxP].decod(testo);
    maxP ++;
    i++;
    elemento = documento.getElementById(timbrU + i);
    if (elemento== null){
      break;
    };
    testo = elemento.innerText;
    uscita[maxL] = new Orario();
    uscita[maxL].decod(testo);
    maxL ++;
    i ++;
  } while (true);
  for( i = 0; i < maxL; i++){
      lavoro[i] = new Orario();
      lavoro[i].delta(entrata[i], uscita[i]);
      totL.somma(totL,lavoro[i]);
  };
  for( i = 1; i < maxP; i++){
      pausa[i] = new Orario();
      pausa[i].delta(uscita[i-1],entrata[i]);
      totP.somma(totP,pausa[i]);
  };

};

function esegui_tutto(){
  var i = 0;
  var elemento;
  var testo = "";
  calcola_intervalli();
  for( i=0; i<maxL; i++){
    j = i * 2;
    documento.getElementById("timbr_"+j).children[4].innerText = lavoro[i].testo;
  };
  for( i=1; i<maxP; i++){
    j = i * 2;
    documento.getElementById("timbr_"+j).children[0].innerText = pausa[i].testo;
  };
	elemento = document.createElement("tr");
  testo = '<td bgcolor="#CCCCCC" width="10%"><p><b>&nbsp;' + totP.testo +
    '</b></p></td><td width="10%"></td><td width="10%"></td><td width="20%"></td><td bgcolor="#CCCCCC" width="10%"><p><b>&nbsp;' + 
    totL.testo + '</b></p></td><td width="10%"></td><td width="10%"></td><td width="20%"></td>';
	elemento.innerHTML = testo;
	documento.getElementById("tabellaTimbratureSAVFR").appendChild(elemento);
};


var conta = 0;
function test(){
  var elemento;
  documento = document.getElementById("timbrature")
  if (documento == null){
    dummy = setTimeout(test,300);
    conta++
    return;
  }
  documento = document.getElementById("timbrature").contentDocument;
  if (documento == null){
    dummy = setTimeout(test,300);
    conta++
    return;
  }
  elemento = documento.getElementById("tabellaTimbratureSAVFR");
	if (elemento === null){
    dummy = setTimeout(test,300);
    conta++
    return;
  }
//  alert("conta = " + conta);
  esegui_tutto();
};

test();