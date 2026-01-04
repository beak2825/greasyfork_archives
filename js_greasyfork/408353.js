// ==UserScript==
// @name         Bollettino Facile
// @version      1.20
// @description  Il bollettinoonline è più facile
// @author Maxeo | maxeo.net
// @match        https://www.bollettinoonline.it/
// @match        https://www.bollettinoonline.it/crea/
// @icon https://www.maxeo.net/imgs/icon/android-chrome-192x192.png
// @namespace https://greasyfork.org/users/88678
// @license https://creativecommons.org/licenses/by-sa/4.0/
// @downloadURL https://update.greasyfork.org/scripts/408353/Bollettino%20Facile.user.js
// @updateURL https://update.greasyfork.org/scripts/408353/Bollettino%20Facile.meta.js
// ==/UserScript==

(function () {
    function spell_my_int(numstr, centOOttanta) {
        mono = new Array("", "uno", "due", "tre", "quattro", "cinque", "sei", "sette", "otto", "nove");
        duplo = new Array("dieci", "undici", "dodici", mono[3] + "dici", "quattordici", "quindici", "sedici", "dicias" + mono[7], "dici" + mono[8], "dician" + mono[9]);
        deca = new Array("", duplo[0], "venti", mono[3] + "nta", "quaranta", "cinquanta", "sessanta", "settanta", "ottanta", "novanta");
        cento = new Array("cent", "cento");
        mili = new Array();
        mili[0] = new Array("", "mille", "milione", "miliardo", "bilione", "biliardo");
        mili[1] = new Array("", "mila", "milioni", "miliardi", "bilioni", "biliardi");
        text = new Array();
        cifra = new Array();
        result = "";
        sezione = 0;
        // In Javascript si fa così per dire che questo parametro e' opzionale, con valore false di default
        centOOttanta = centOOttanta || false;
        numstr += '';
        // Non deve cominciare per zero altrimenti parseInt() impazzisce...
        while (numstr.substr(0, 1) == "0" && numstr.length != 1) {
            numstr = numstr.substr(1, numstr.length);
        }
        num = parseInt(numstr);
        switch (numstr.length % 3) {
            case 1:
                numstr = "00" + numstr;
                break;
            case 2:
                numstr = "0" + numstr;
        }
        numlen = numstr.length;
        if (isNaN(num)) {
            return "Non e' un numero!";
        } else if (num < 0) {
            return "Numero negativo!";
        } else if (numstr.length > 6 * 3) {
            return "Limite superato!";
        } else if (num == 0) {
            return "zero";
        }
        while ((sezione + 1) * 3 <= numlen) {
            subnumerostring = numstr.substr(((numlen - 1) - ((sezione + 1) * 3)) + 1, 3);
            if (subnumerostring != "000") {
                subnumero = parseInt(subnumerostring);
                cifra[0] = subnumerostring.substr(0, 1);
                cifra[1] = subnumerostring.substr(1, 1);
                cifra[2] = subnumerostring.substr(2, 1);
                prime2cifre = parseInt(cifra[1] * 10) + parseInt(cifra[2]);
                if (prime2cifre < 10) {
                    text[2] = mono[cifra[2]];
                    text[1] = "";
                } else if (prime2cifre < 20) {
                    text[2] = "";
                    text[1] = duplo[prime2cifre - 10];
                } else {
                    //	ventitre => ventitrè
                    if (sezione == 0 && cifra[2] == 3) {
                        text[2] = "tre'";
                    } else {
                        text[2] = mono[cifra[2]];
                    }
                    //	novantaotto => novantotto
                    if (cifra[2] == 1 || cifra[2] == 8) {
                        text[1] = deca[cifra[1]].substr(0, deca[cifra[1]].length - 1);
                    } else {
                        text[1] = deca[cifra[1]];
                    }
                }
                if (cifra[0] == 0) {
                    text[0] = "";
                } else {
                    //	centoottanta => centottanta
                    if (!centOOttanta && cifra[1] == 8 || (cifra[1] == 0 && cifra[2] == 8)) {
                        IDcent = 0;
                    } else {
                        IDcent = 1;
                    }
                    if (cifra[0] != 1) {
                        text[0] = mono[cifra[0]] + cento[IDcent];
                    } else {
                        text[0] = cento[IDcent];
                    }
                }
                //	unomille	=> mille
                //	miliardo	=> unmiliardo
                if (subnumero == 1 && sezione != 0) {
                    if (sezione >= 2) {
                        result = "un" + mili[0][sezione] + result;
                    } else {
                        result = mili[0][sezione] + result;
                    }
                } else {
                    result = text[0] + text[1] + text[2] + mili[1][sezione] + result;
                }
            }
            sezione++;
        }
        return result;
    }

    function aggiornaBollettino() {
        let interiInp = document.querySelector('form input[name="interi"]');
        let interiValue = interiInp.value + "";
        let centesimiInp = document.querySelector('form input[name="centesimi"]');
        let centesimiValue = centesimiInp.value + "";

        if (interiValue.replace(/^[0-9]+$/, "") == "") {
            interiInp.style.color = '#000'
        } else {
            interiInp.style.color = 'red';
        }
        if (centesimiValue.replace(/^[0-9]{2}$/, "") == "") {
            centesimiInp.style.color = '#000'
        } else {
            centesimiInp.style.color = 'red';
        }
        let valoreLettere = spell_my_int(interiValue * 1);
        let forzalettere = false;
        if (centesimiValue.length) {
            valoreLettere += "/"
            if (centesimiValue * 1 < 10) {
                valoreLettere += forzalettere ? "zero" : '0';
            }
            valoreLettere += forzalettere ? spell_my_int(centesimiValue * 1) : centesimiValue;
        }

        document.querySelector('form input[name="eurolettere"]').value = valoreLettere.toUpperCase();

    }

    function caricaBaseBollettino() {
        document.querySelector('form input[name="intestato_a"]').value = "IREN SPA LUCE GAS 1";
        document.querySelector('form input[name="cc"]').value = "38186193"
    }

    function loadHash() {
        var myHash = document.location.hash.substr(2).split('&');
        if (myHash.length > 3) {
            var myDataHash = [];
            for (var index in myHash) {
                var mySplit = myHash[index].split("=");
                myDataHash[mySplit[0]] = decodeURIComponent(mySplit[1]);
            }
            if (myDataHash['importo'] * 1 > 0) {
                var importo = myDataHash['importo'].replace('.', ',').split(',');
                document.querySelector('form input[name="eseguito_da"]').value = myDataHash['first_name'];
                document.querySelector('form input[name="via_piazza"]').value = myDataHash['address1']+' '+myDataHash['address2'];
                document.querySelector('form input[name="cap"]').value = myDataHash['postal_code'];
                document.querySelector('form input[name="localita"]').value = myDataHash['city'];
                //document.querySelector('form input[name="interi"]').value = importo[0];
                //document.querySelector('form input[name="centesimi"]').value = importo[1];
                document.querySelector('form input[name="causale"]').value = "CONTRATTO: " + myDataHash['numero_contratto'] + ' BOLLETTA: ' + myDataHash['num_documento']+' SCAD: 15/09/2020';
                aggiornaBollettino();
            }

        }
    }

    document.querySelector('form input[name="interi"]').addEventListener('keyup', aggiornaBollettino);
    document.querySelector('form input[name="centesimi"]').addEventListener('keyup', aggiornaBollettino);
    caricaBaseBollettino();
    loadHash();


})();