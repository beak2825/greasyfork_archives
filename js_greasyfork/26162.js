// ==UserScript==
// @name         Search CRMScor
// @version      0.2.04A
// @description  Aide à la recherche d'annonce depuis scorimmo
// @author       LucCB
// @include      https://pro.scorimmo.com/*lead*
// @include      https://pro.scorimmo.com/*email*
// @require      http://code.jquery.com/jquery-latest.js
// @namespace    https://greasyfork.org/fr/users/10913
// @downloadURL https://update.greasyfork.org/scripts/26162/Search%20CRMScor.user.js
// @updateURL https://update.greasyfork.org/scripts/26162/Search%20CRMScor.meta.js
// ==/UserScript==


// Déclaration des variables
$( document ).ready(function() {

    var codeInsee ="";
    var codeDept = "";
    MainCreate();
    // Création du menu

    function MainCreate(){
        // Création du menu
        $('.univers .collection-list .ads').append('<div id="DivExtBT" style="text-align: center;margin-top:5px"><a class="violet-button BT_Source"> Rechercher</a></div>');
        $("#DivExtBT").css("margin-bottom", "15px");
    }




    $('.BT_Source').click(function() {

        var univer = $(this).parents().parents().parents().parents().parents(".univers");
        var universname = univer.find('h4 span label').html();
        var Source = GetID("Source",univer);
        var ref = GetID("Ref",univer);
        var Prix = GetID("Prix",univer);
        let Surface = GetID("Area", univer);
        let SurfaceMin = ValMin(Surface,5);
        let SurfaceMax = ValMax(Surface,5);
        let track = "";
        var PDV = $('#posInfos div h3').html();
        //var lien = "https://www.google.fr/search?q=" + Source + "+ " + GetID("Ref",univer) + "+ " + PDV;
        let lien = "http://www.leboncoin.fr/recherche?category=8";
        if(GetID("CP",univer) !== ""){
            lien += "&location="+ GetID("CP",univer);
        }
        if(Prix !== ""){
            lien += "&price=" + ValMin(Prix,5000) + "-" + ValMax(Prix,5000);
        }
        if(ref !== ""){
            lien += "&text=" + ref ;
        }
        if(Surface !== ""){
            lien += "&square=" + SurfaceMin + "-" + SurfaceMax;
        }
        var codePostal;
        $.getJSON("https://geo.api.gouv.fr/communes?nom=" + GetID("City",univer)  + "&codePostal=" + GetID("CP",univer), function( data ) {

            $.each(data,function(index,d){
                codeInsee = d.code;
                codeDept = d.codeDepartement;
                codePostal = d.codesPostaux[0];
            });

            switch (universname){
                case ("Transaction") :


                    if (Source.indexOf("Leboncoin") !== -1) {
                        track = 'Transaction / Leboncoin';

                        lien = "http://www.leboncoin.fr/recherche?category=9";
                        if(GetID("CP",univer) !== ""){
                            lien += "&location="+ GetID("CP",univer);
                        }
                        if(Prix !== ""){
                            lien += "&price=" + ValMin(Prix,5000) + "-" + ValMax(Prix,5000);
                        }
                        if(ref !== ""){
                            lien += "&text=" + ref ;
                        }
                        if(Surface !== ""){
                            lien += "&square=" + SurfaceMin + "-" + SurfaceMax;
                        }


                    }
                    else if (Source.indexOf("Se Loger") !== -1) {
                        track = 'Transaction / Se Loger';

                        lien = "http://www.seloger.com/list.htm?idtt=2&idtypebien=2,1&ci=" + codeInsee.slice(0, 2) + "0" + codeInsee.slice(2) + "&tri=initial&pxmin=" + ValMin(Prix,5000) + "&pxmax=" + ValMax(Prix,5000) ;

                    }
                    else if (Source.indexOf("Ouest France") !== -1) {
                        track = 'Transaction / Ouest France';

                        lien = "https://www.ouestfrance-immo.com/acheter/" + GetID("City",univer).replace(/ /g, "-") + "-" + codeDept + "-" + GetID("CP",univer) + "/?types=maison,appartement&classifs=studio,t1,2-pieces,3-pieces,4-pieces,5-pieces,6-pieces-et-plus,chambre,loft&prix=" + ValMin(Prix,5000) + "_" + ValMax(Prix,5000)  + "&surface="+ SurfaceMin + "_" + SurfaceMax;

                    }
                    else if (Source.indexOf("bien-ici.com") !== -1) {
                        track = 'Transaction / bien-ici.com';

                        lien = "https://www.bienici.com/recherche/achat/" + GetID("City",univer) + "?prix-min=" + ValMin(Prix,5000) + "&prix-max=" + ValMax(Prix,5000)  + "&surface-min=" + SurfaceMin + "&surface-max=" + SurfaceMax ;

                    }
                    else {
                        track = 'Transaction / Other';
                        lien = "http://www.leboncoin.fr/recherche?category=9";

                        if(GetID("CP",univer) !== ""){
                            lien += "&location="+ GetID("CP",univer);
                        }
                        if(Prix !== ""){
                            lien += "&price=" + ValMin(Prix,5000) + "-" + ValMax(Prix,5000);
                        }
                        if(ref !== ""){
                            lien += "&text=" + ref ;
                        }
                        if(Surface !== ""){
                            lien += "&square=" + SurfaceMin + "-" + SurfaceMax;
                        }


                    }

                    break;
                case ("Location") :
                    track = 'Location / Other';

                    lien = "http://www.leboncoin.fr/recherche?category=10";
                    if(GetID("CP",univer) !== ""){
                        lien += "&location="+ GetID("CP",univer);
                    }
                    if(Prix !== ""){
                        lien += "&price=" + ValMin(Prix,50) + "-" + ValMax(Prix,50);
                    }
                    if(ref !== ""){
                        lien += "&text=" + ref ;
                    }
                    if(Surface !== ""){
                        lien += "&square=" + SurfaceMin + "-" + SurfaceMax;
                    }


                    break;

                case "Construction" :
                    track = 'Construction / Other';
                    lien = "http://www.leboncoin.fr/recherche?category=9";
                    if(GetID("CP",univer) !== ""){
                        lien += "&location="+ GetID("CP",univer);
                    }
                    if(Prix !== ""){
                        lien += "&price=" + ValMin(Prix,5000) + "-" + ValMax(Prix,5000);
                    }
                    if(ref !== ""){
                        lien += "&text=" + ref ;
                    }
                    if(Surface !== ""){
                        lien += "&square=" + SurfaceMin + "-" + SurfaceMax;
                    }

                    break;
            }

            window.open(lien);
            console.log({'univers': universname,'source': Source, 'Ref': ref, 'Prix': Prix, 'Surface' : Surface,  'URL': lien, 'loc':{'Ville' : GetID("City",univer).replace(/ /g, "-"), 'Dept.' : codeDept, 'CP': GetID("CP",univer)},"Route" : track });
        });
    });



    // Formatage d'un text sans les accents

    function sansAccent(str) {
        var accent = [
            /[\300-\306]/g, /[\340-\346]/g, // A, a
            /[\310-\313]/g, /[\350-\353]/g, // E, e
            /[\314-\317]/g, /[\354-\357]/g, // I, i
            /[\322-\330]/g, /[\362-\370]/g, // O, o
            /[\331-\334]/g, /[\371-\374]/g, // U, u
            /[\321]/g, /[\361]/g, // N, n
            /[\307]/g, /[\347]/g, // C, c
        ];
        var noaccent = ['A', 'a', 'E', 'e', 'I', 'i', 'O', 'o', 'U', 'u', 'N', 'n', 'C', 'c'];

        for (var i = 0; i < accent.length; i++) {
            str = str.replace(accent[i], noaccent[i]);
        }

        return str;
    }


    // Recherche des valeurs

    function GetID(ID,univer) {

        try {
            var tempo = "";
            if(ID == "Source"){
                if($('.leadOrigin.cf span:gt(1)').text() !== "")
                    return $('.leadOrigin.cf span:gt(1)').text();
                else
                    return $('.source-lead-select .customSelectInner').text();}

            if (ID === "City"){
                tempo = univer.find('.field.cf:gt(2) :input').val();
                tempo = sansAccent(tempo);
                tempo = tempo.toLowerCase();
                return tempo;
            }
            if (ID === "CP"){
                tempo = univer.find('input.lead-zip').val();
                return tempo;

            }


            if (ID == "Ref")
            {
                tempo = univer.find(".ad-reference :input").val();
                return tempo;
            }

            if (ID == "Area")
            {
                tempo = univer.find(".property-area :input").val();
                return tempo;
            }

            if(ID == "Prix"){
                tempo = univer.find('.ad-price :input').val();
                tempo = tempo.replace(/ /g, "");
                return tempo;
            }

            return "";
        }
        catch (err) {
            console.log('Données introuvables '+err);
        }
    }


    //Recherche par le nom de la ville :le code postal, le codeInsee et le code departement

    function Insee(Ville,Dept)
    {
        $.getJSON("https://geo.api.gouv.fr/communes?nom=" + Ville + "&codeDepartement=" + Dept, function( assessments ) {
            $.each(assessments,function(index,d){
                codeInsee = d.code;
                codeDept = d.codeDepartement;
            });
        });
    }

    // Créer une valeur minimum

    function ValMin(val, marge) {
        val = val.replace(/ /g, "");
        if (val <= marge)
            return "";
        else {
            var tempo = parseInt(val);
            return tempo - marge;
        }
    }

    // Créer une valeur maximum

    function ValMax(val, marge) {
        val = val.replace(/ /g, "");
        if(val !== ""){
            var tempo = parseInt(val);
            return tempo + marge;
        }
        else
            return "";

    }
});
