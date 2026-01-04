// ==UserScript==
// @name         Zmiany na Ziemi (baBlock Plus)
// @namespace    http://tampermonkey.net/
// @version      7.1
// @description  Ukrywa komentarze nielubianych przez ciebie osób. Będą niewidoczne jedynie u ciebie. Kliknij na ciemny pasek spoiler, by wyświetlić ukryty komentarz.
// @author       Wołowina
// @match        https://zmianynaziemi.pl/*
// @include      https://zmianynaziemi.pl/*
// @icon         https://i.imgur.com/HlGqUnc.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452807/Zmiany%20na%20Ziemi%20%28baBlock%20Plus%29.user.js
// @updateURL https://update.greasyfork.org/scripts/452807/Zmiany%20na%20Ziemi%20%28baBlock%20Plus%29.meta.js
// ==/UserScript==

//▓▓▓▓▓▓▓▓▓▓▓▓▓█NOWOŚCI█▓▓▓▓▓▓▓▓▓▓▓▓▓
// Wersja 7.1:
//  Pasek działa teraz jak spoiler. Dodano możliwość wyświetlenia ukrytych komentarzy przy pomocy kliknięcia na niego
//  Usprawnienia kodu
//  Zmniejszone marginesy, lepsza czytelność na telefonie
//  Poprawiony i bardziej czytelny wygląd komentarzy, także na telefonach


//▓▓▓▓▓▓█USTAWIENIA BLOKOWANIA█▓▓▓▓▓▓
const czcionka = 0.0; // (1.0 widoczne , 0.25 małe , 0.0 niewidoczne)
const nowywyglad = true; //Usprawniony wygląd komentarzy (true  ok, false  nie)

const zarejestrowani = [ //poniżej lista zarejestrowanych po przecinku
'ba',

];

const anonimowi = [ //poniżej lista anonimowych po przecinku
'Zenek ;)',
//'chazarska logika',

];

//▓▓▓▓▓▓▓▓▓▓▓▓▓█ŹRÓDŁO█▓▓▓▓▓▓▓▓▓▓▓▓▓▓
const registeredCount = zarejestrowani.length;
function registeredusersposts() {// registered users handler
    var ARTICLE = document.getElementsByClassName('comment clearfix');
	for(var i=0; i<ARTICLE.length; i++){
        var user = ARTICLE[i].getElementsByClassName('username')[0].innerHTML; //registered user
        for(var j=0; j<registeredCount; j++){
            if (user.toLowerCase() == zarejestrowani[j].toLowerCase()) {
                var elems = ARTICLE[i].getElementsByClassName('field field-name-comment-body field-type-text-long field-label-hidden view-mode-full')[0];
                if (user.toLowerCase() != "mordo schab ciało") {
                    elems.style.fontSize = czcionka.toString()+"em";
                }
                if (user.toLowerCase() != "mordo schab ciało") {
                    elems.style.backgroundColor = "#777";
                }else{
                    elems.style.backgroundColor = "#FCB";
                }
                elems.style.padding = "12px";
                //elems.style.color = "whitesmoke";
			}
		}
	}
}

const anonymousCount = anonimowi.length;
function anonymoususersposts() {// anonymous users handler
    var ANONARTICLE = document.getElementsByClassName('comment comment-by-anonymous clearfix');
	for(var i=0; i<ANONARTICLE.length; i++){
        var anon = ANONARTICLE[i].getElementsByClassName('username')[0].innerHTML; //anonymous
        for(var j=0; j<anonymousCount; j++){
            if (anon == anonimowi[j]+' (anonim)') {
                var elems = ANONARTICLE[i].getElementsByClassName('field field-name-comment-body field-type-text-long field-label-hidden view-mode-full')[0];
                if (anon != "Wołowina (anonim)") {
                    elems.style.fontSize = czcionka.toString()+"em";
                }
                if (anon != "Wołowina (anonim)") {
                    elems.style.backgroundColor = "#777";
                }else{
                    elems.style.backgroundColor = "#FCB";
                }
                elems.style.padding = "12px";
                //elems.style.color = "whitesmoke";
            }
		}
	}
}

function unspoiler() {
    var FIELD = document.getElementsByClassName('field field-name-comment-body field-type-text-long field-label-hidden view-mode-full');
	for(let i=0; i<FIELD.length; i++){
        FIELD[i].addEventListener('click', function(){
            FIELD[i].style.fontSize = "1.0em";
            FIELD[i].style.backgroundColor = "#FDFDFD";
        });
    }
}

function margins(){
var INTENDENT = document.getElementsByClassName('indented');
    for(var i=0; i<INTENDENT.length; i++){
        var vmargin = INTENDENT[i];
        vmargin.style.marginLeft = "16px";
        //vmargin.style.color = "black";

        var parent = vmargin.parentNode;
        var containerid = 1;
        while (parent.className == vmargin.className) {
            parent = parent.parentNode;
        containerid++;
        }
        var vcolor = (255-containerid*16).toString(16);
        vmargin.style.background = "#"+vcolor+vcolor+vcolor;
    }
        var classes = document.getElementsByClassName('links inline');
        /*for(var j=0; j<classes.length; j++){
            classes[j].style.background = "#FDFDFD";
        }*/
        classes = document.getElementsByClassName('comment clearfix');
        for(var j=0; j<classes.length; j++){
            classes[j].style.boxShadow = "0px 0px 2px #000";
            classes[j].style.border = "0";
            classes[j].style.margin = "4px 0px 4px 16px";
            classes[j].style.background = "#FDFDFD";
        }
        classes = document.getElementsByClassName('comment comment-by-anonymous clearfix');
        for(j=0; j<classes.length; j++){
            classes[j].style.boxShadow = "0px 0px 2px #000";
            classes[j].style.border = "0";
            classes[j].style.margin = "4px 0px 4px 16px";
            classes[j].style.background = "#FDFDFD";
        }
}


registeredusersposts();
anonymoususersposts();
unspoiler();
if (nowywyglad){
    margins();
}