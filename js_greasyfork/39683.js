// ==UserScript==
// @name         Dyslexicus
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  On nique vos soeurs les Bots
// @author       You
// @include  http://www.jeuxvideo.com/*
// @include  https://www.jeuxvideo.com/*
// @match  http://www.jeuxvideo.com/*
// @match  https://www.jeuxvideo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39683/Dyslexicus.user.js
// @updateURL https://update.greasyfork.org/scripts/39683/Dyslexicus.meta.js
// ==/UserScript==



    // Your code here...
function melange(mot){
    var motTransform=mot;
    var motTemp="";
    var j=1;
    var longueurMot=mot.length;
    if (longueurMot>3){
        //On parcourt le mot en partant de la 2ème lettre, d'indice i=1

        for (var i=1;i<longueurMot-2;i++){
            // mot vide temporaire que l'on va remplir ensuite
            motTemp="";
            // on calcule un indice aléatoire entre la position i+1 et l'avant dernière lettre du mot
            j =i+1+Math.floor((longueurMot-2-i)*Math.random());

            //On remplit toutes les lettres du mot vide, en inversant les positions i et j par rapport au mot de départ
            for(var k=0;k<longueurMot;k++){
                if (k===i){
                    motTemp+=motTransform[j];
                }
                else if(k===j){
                    motTemp+=motTransform[i];
                }
                else {motTemp+=motTransform[k];}

            }
            // on stocke le mot modifié, et on passe à la suite pour modifier la position suivante
            motTransform=motTemp;

        }
    }
    return motTransform;
}


function changeTexte() {

    //On recupère ce qui est prêt à être posté
var text=document.getElementById("message_topic").value;

// On sépare ce texte avec les conventions d'écriture :
// pa - PAragraphes, séparés par "\n"
// papt - parties de PAragraphes, separées par des PoinTs "."
// paex - sous-parties de PAragraphes, separées par des points d'EXclamation "!"
// paint - sous-parties de paragraphes, separées par des points d'INTerrogation "?"
// On a enlevé les types de points les plus courants, il nous reste normallement une liste de phrases, que l'on va séparer :
// phpv - bouts de PHrases séparées par des Points Virgule ";"
// phv - bouts de PHrases séparées par des Virgules ","
// phdp bouts de PHrases séparées par Deux Points ":"
// On a enlevé toute la ponctuation courante, il reste donc des bouts élémentaires de phrase
// mots - On sépare ces bouts par les espaces " ", il nous reste donc une liste de mots
// on transforme ensuite ces mots 1 par 1 par la fonction melange(); et ensuite on remonte toute la chaine
// Les valeurs modifiées sont stockées dans des variables dont le nom commence par n comme nouveau, et qui correspondent aux autres
// on remonte d'un étage grâce à la fonction : Etage.push(EtageInférieur.join(Séparateur de l'étage inférieur)), qui remplit progressivement la liste Etage. Chaque élément de cette liste est un élement de l'étage inférieur regroupé par join()
//
var pa = text.split("\n");
var npa = [];
for(var i=0;i<pa.length;i++){
    var papt=pa[i].split(".");
    var npapt=[];
        for(var j=0;j<papt.length;j++){
        var paex=papt[j].split("!");
        var npaex=[];
            for(var k=0;k<paex.length;k++){
            var paint=paex[k].split("?");
            var npaint=[];
                for(var l=0;l<paint.length;l++){
                var phpv=paint[l].split(";");
                var nphpv=[];
                    for(var m=0;m<phpv.length;m++){
                    var phv=phpv[m].split(",");
                    var nphv=[];
                        for(var n=0;n<phv.length;n++){
                        var phdp=phv[n].split(":");
                        var nphdp=[];
                            for(var p=0;p<phdp.length;p++){
                            var mots=phdp[p].split(" ");
                            var nmots=[];
                                for(var q=0;q<mots.length;q++){

                                    nmots.push(melange(mots[q]));

                                    }
                            nphdp.push(nmots.join(" "));
                                }
                        nphv.push(nphdp.join(":"));


                        }

                    nphpv.push(nphv.join(","));
                    }
                npaint.push(nphpv.join(";"));
                }
            npaex.push(npaint.join("?"));
            }
        npapt.push(npaex.join("!"));
        }

npa.push(npapt.join("."));
}
ntext=npa.join("\n");
document.getElementById("message_topic").value=ntext;
}

// Ajoute un boutton pour effectuer les modifications :
document.getElementsByClassName("col-md-12 bloc-editor-forum")[1].innerHTML += "<button tabindex=\"5\" type=\"button\" class=\"btn btn-poster-msg datalayer-push js-post-topic\">Psetor</button>";
var button = document.getElementsByClassName("btn-poster-msg")[1];
button.addEventListener("click", changeTexte, true);