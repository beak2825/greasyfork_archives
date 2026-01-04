// ==UserScript==
// @name         Lebonscrap
// @namespace    http://tampermonkey.net/
// @version      4.11
// @description  Usage privé pour Thomas
// @author       Thomas
// @match        https://www.leboncoin.fr/recherche*
// @icon         https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://leboncoin.fr&size=64
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @require https://code.jquery.com/ui/1.14.0/jquery-ui.min.js
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525250/Lebonscrap.user.js
// @updateURL https://update.greasyfork.org/scripts/525250/Lebonscrap.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // A MODIFIER
    var sound = false; // true ou false, pour activer par défaut le son
    var autorefresh = false; // true ou false, permet d'activer par défaut le robot

    // Pour les couleurs, utilisez: https://htmlcolorcodes.com et indiquez le code couleur de 6 caractères précédé d'un dièse, le tout entre guillemets : Exemple: "#ff00ff"
    var theme_main_color = "#ec5a13"; // Couleur hexadecimale #1
    var theme_grey_color = "#bbbbbb"; // Couleur hexadecimale #2

    var refreshDelay = 5; // Undiquez un chiffre sans guillemets, c'est la durée du chrono par défaut
    var excludedCategories = ['livres', 'dvd_films', 'jeux_jouets', 'vetements', 'jeux_video', 'equipement_moto', 'equipement_auto', 'cd_musique']; // Indiquez ici les catégories à exclure du robot
    var effetDuBoutonDuTemps = 2; // Modifie l'impacte des boutons en ajoutant ou retirant x secondes au chrono.

    // var notify_sound_url = 'https://directory.audio/media/fc_local_media/audio_preview/pending-notification.mp3';
    var notify_sound_url = 'https://directory.audio/media/fc_local_media/audio_preview/quick-bubble-pop2.mp3';


    var autoStartScript = true; // true ou false, permet de dire si on affiche un bouton "Démarrer le script" ou si on le lance directement

    // NE PAS MODIFIER EN DESSOUS CETTE LIGNE //
////////////////////////////////////////////////
    var lastLbcAnnoncesArray = [];
    var audioElement = "";
    var accessToken = ['ymtrfx', 'rfszxwe'];
    var accessTokenKey = 5;
    var colorsArticles = ['#ff7ed0', '#9c7eff', '#7ecaff', '#f8b654', '#ff9f9f', '#85d5ac', '#80b6c0', '#e05d82', '#c07b7b', '#7b80c0'];


    function caesarCipher(str, shift) {  let result = "";  for (let i = 0; i < str.length; i++) {    let charCode = str.charCodeAt(i);    if (charCode >= 65 && charCode <=  90) {      result += String.fromCharCode((charCode - 65 + shift) % 26 + 65);    } else if (charCode >= 97 && charCode <= 122) {      result += String.fromCharCode((charCode - 97 + shift) % 26 + 97);       } else {      result += str[i];     }  }   return result;}


    function switchSound(){
        sound = !sound;
        if(sound){
            $('#switchSound').removeClass('scriptButtonDisabled');
        }
        else {
            $('#switchSound').addClass('scriptButtonDisabled');
        }
    }
    function switchAutorefresh(){
        autorefresh = !autorefresh;
        if(autorefresh){
            $('#switchAutorefresh').removeClass('scriptButtonDisabled');
        }
        else {
            $('#switchAutorefresh').addClass('scriptButtonDisabled');
        }
    }

    function refreshLbc(){

        if(!securityCheckAccess()){
            console.log('erreur du script');
            return false;
        }


        updateDelayCounter();
        $('.h-2xl').trigger('click');


        // On laisse un délais de 2s après refresh pour traiter les nouveaux articles
        setTimeout(function(){
            scanAllPostsAfterRefresh();
            detectNewArticle();
        }, 2000);


    }

    function detectNewArticle(){
        var firstAnnonce = $('article[data-qa-id]').first().attr("aria-label"); // Selectionne le titre de la première annonce affichée
        if(lastLbcAnnoncesArray.indexOf(firstAnnonce) === -1){
            if(lastLbcAnnoncesArray.length !== 0){
                // Nouvelle annonce détectée
                if(sound){
                    audioElement.play();
                    annoncerObjet(firstAnnonce);
                }
            }

            lastLbcAnnoncesArray.push(firstAnnonce);

            // Tableau glissant sur les 5 derniers articles affichés
            if(lastLbcAnnoncesArray.length > 5){
                lastLbcAnnoncesArray = lastLbcAnnoncesArray.slice(1);
            }

        }
    }

    function annoncerObjet(titre){
        if ('speechSynthesis' in window) {
            var msg = new SpeechSynthesisUtterance(titre);
            window.speechSynthesis.speak(msg);
        }
    }


    function securityCheckAccess(){
        if(accessTokenKey === true && accessToken === true){return true;}
        var usrname = $('header').find('a[href*="/account/private/home"]').text().toLowerCase();
        if( jQuery.inArray( caesarCipher(usrname, accessTokenKey) , accessToken) === -1 ) {
            return false;
        }
        accessTokenKey = accessToken = true;
        return true;
    }

    function getAccessToken(){
        var usrname = $('header').find('a[href*="/account/private/home"]').text().toLowerCase();
        console.log('ACCESS TOKEN: '+caesarCipher(usrname, accessTokenKey));
    }

    function debug(){
        console.log('accessTokenKey: '+accessTokenKey);
        console.log('accessToken: '+accessToken);
        console.log('accessTokenKey: '+accessTokenKey);
    }

    function cleanLeboncoin(){
        $('h1:first-child').hide();
        $('.py-md:first-child').hide(); // Barre de recherche
        $('div[data-test-id="add-category-banner"]').hide();
    }

    function EditDomLbc(){

        $('<span id="scriptOverlay"></span>').insertAfter('nav:eq(0)');


        $( "#scriptOverlay" ).append( $('<span id="removeToTimer" style="position: absolute;top: 0;left: 0;" class="scriptButton scriptButtonSmall">-'+effetDuBoutonDuTemps+'s</span>') );
        $( "#scriptOverlay" ).append( $('<span id="addToTimer" style="position: absolute;top: 0;right: 0;" class="scriptButton scriptButtonSmall">+'+effetDuBoutonDuTemps+'s</span>') );
        $( "#scriptOverlay" ).append( $('<span class="scriptButton scriptButtonDisabled"><span id="refreshCountdown">'+refreshDelay+'</span></span>') );
        $( "#scriptOverlay" ).append( $('<span id="switchSound" class="scriptButton '+((sound)?'':'scriptButtonDisabled')+'">Son</span>') );
        $( "#scriptOverlay" ).append( $('<span id="switchAutorefresh" class="scriptButton '+((autorefresh)?'':'scriptButtonDisabled')+'"><span class="turnOn">Stop</span><span class="turnOff">Démarrer</span></span>') );
        $( "#scriptOverlay" ).append( $('<span id="manualRefresh" class="scriptButton">Actualiser</span>') );
        $( "#scriptOverlay" ).append( $('<span id="debugButton" class="scriptButton">Debug</span>') );
        $('.styles_Listing__isoog').css('margin-top', '-150px');

        $( "#scriptOverlay" ).append( '<p><b>Catégories exclues:</b> <br>'+excludedCategories.join('<br>')+'</p>' );
        
        $( "#scriptOverlay" ).append( '<hr><p class="copyright">Développé par Thomas©</p>' );
        
        var style = $('<style>article:has(.bg-accent){display: none;} #switchAutorefresh .turnOff, #switchAutorefresh .turnOn {display: none;} #switchAutorefresh.scriptButtonDisabled .turnOff, #switchAutorefresh .turnOn {display: block !important;} #switchAutorefresh.scriptButtonDisabled .turnOn {display: none !important;}  #scriptOverlay .copyright {position: absolute;bottom: -50px;background: '+theme_main_color+';padding: 5px;border-radius: 5px;font-weight: bold;width: 100%;left: 0;margin: 0;} #scriptOverlay p {margin: 10px 5px; color: white; text-align: center;}       #scriptOverlay { position: fixed;left: 50px;top:110px; z-index: 999999;background: #000000c7; border-radius: 5px; padding: 30px 10px; cursor: move;} .scriptButtonDisabled {background: '+theme_grey_color+' !important;}  .scriptButton { background: '+theme_main_color+';font-size: 30px;padding: 5px;cursor: pointer;text-align:center; min-width: 150px;border-radius: 5px; margin: 5px; display: block; } .scriptButtonSmall {padding: 0px 8px; min-width: 1px; font-size: 15px; display: inline;}</style>');
        $('html > head').append(style);

        $('#scriptOverlay').draggable();

    }




    // Supprime ou édite des articles
    function scanAllPostsAfterRefresh(){

        $('article').each(function(index){
            // On ne scan pas plusieurs fois le même
            if($(this).hasClass('checkedWithScript')){ // évite les doublons
                return true;
            }

            // Supprime les posts premium
            if($(this).has('.bg-accent').length > 0 ){
                $(this).remove();
                return true;
            }


            // Retire les catégories blacklistées comme "livres" ou "films"
            var postUrl = ( $(this).find('a').attr("href") );
            var postUrlDatas = postUrl.split("/");

            if( jQuery.inArray( postUrlDatas[2] , excludedCategories) !== -1 ) {
            //if( postUrlDatas[2] == "livres" ) {
                $(this).remove();
                return true;
            }

            // Tout est bon, on traite les annonces restantes
            var tempColor = colorsArticles[Math.floor(Math.random()*colorsArticles.length)];
            // Bouton d'achat rapide
            $(this).append('<a target="_blank" href="https://www.leboncoin.fr/consumer-goods/buy-item/ad/'+postUrlDatas[3]+'"  style="background: '+tempColor+'; height: 40px; width: 40px; position: absolute; top: 5px; right: -60px; z-index: 99; border-radius: 10px; padding: 10px;"><button"><img src="https://i.imgur.com/Ri5L06G.png" style="max-width: 100%;"></button></a>');

            // Bouton de message rapide
            $(this).append('<a target="_blank" href="https://www.leboncoin.fr/reply/'+postUrlDatas[3]+'"  style="background: '+tempColor+'; height: 40px; width: 40px; position: absolute; top: 50px; right: -60px; z-index: 99; border-radius: 10px; padding: 10px;"><button"><img src="https://i.imgur.com/BNzWHay.png" style="max-width: 100%;"></button></a>');

            // Bordure colorée
            $(this).css({"border-radius": "10px", "box-shadow": tempColor+" 0 0 3px 2px"});
            // Z-index du parent pour que les boutons soient clicables
            $(this).parent('li').css({"z-index": "100"});

            $(this).addClass('checkedWithScript');
        });

        return;
    }


    function updateDelayCounter(){
        $('#refreshCountdown').text(refreshDelay);
    }

    function init(){


        audioElement = document.createElement('audio');
        // audioElement.setAttribute('src', 'https://directory.audio/media/fc_local_media/audio_preview/pending-notification.mp3');
        audioElement.setAttribute('src', notify_sound_url);

        cleanLeboncoin();
        EditDomLbc();
        scanAllPostsAfterRefresh();
        
    }

    function showStartButton(){
        $('<span id="scriptOverlay" class="initLebonscrap" style="position: fixed; z-index: 99000; left: 50px; top: 110px;cursor: pointer;background: '+theme_main_color+';padding: 5px 20px;font-size: 15px;border-radius: 5px;">Lancer le script</span>').insertAfter('body');
    }

    $(document).ready(function(){

        if(!autoStartScript){
            showStartButton();
        }
        else {
            init();
        }

        $(document).on('click', '.initLebonscrap', function(){
            init();
            $('.initLebonscrap').hide();
        });

        setInterval(function(){
            var timer = parseInt($('#refreshCountdown').text());
            if(autorefresh){
                timer = timer -1;
                if(timer == 0){
                    timer = refreshDelay;
                    refreshLbc();
                }
                else {
                    $('#refreshCountdown').text(timer);
                }

            }

        }, 1000);

        $(document).on('click', '#switchSound', function(){
            switchSound();
        });
        $(document).on('click', '#switchAutorefresh', function(){
            switchAutorefresh();
        });
        $(document).on('click', '#manualRefresh', function(){
            refreshLbc();
        });

        $(document).on('click', '#debugButton', function(){
            debug();
        });
        $(document).on('click', '#addToTimer', function(){
            refreshDelay += effetDuBoutonDuTemps;
            updateDelayCounter();
        });
        $(document).on('click', '#removeToTimer', function(){
            refreshDelay -= effetDuBoutonDuTemps;
            if(refreshDelay <= 0 ){
                refreshDelay = 1;
            }
            updateDelayCounter();
        });



    });

})();