// ==UserScript==
// @name         Robot Leboncoin V2
// @namespace    http://tampermonkey.net/
// @version      2.51
// @description  Pour Thomas
// @author       Thomas
// @match        https://www.leboncoin.fr/recherche?text=%22SEKRETKEY*
// @icon         https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://leboncoin.fr&size=64
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @require https://code.jquery.com/ui/1.14.0/jquery-ui.min.js
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507608/Robot%20Leboncoin%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/507608/Robot%20Leboncoin%20V2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var urlToParse = "https://www.leboncoin.fr/recherche?text=%22SEKRETKEY%22+OU+%22guerre+mondiale%22+OU+militaria+OU+%22casque+adrian%22+OU+cartouchi%C3%A8re+OU+m%C3%A9dailles+guerre+OU+grenade+OU+obus+OU+d%C3%A9militaris%C3%A9+OU+fourreau+OU+%22ancienne+gourde%22+OU+%22gourde+ancienne%22+OU+%22lot+militaire%22+OU+%22soldat%22+OU+%22lot+de+m%C3%A9dailles%22+OU+%2214-18%22+OU+%2239-45%22+OU+%22de+poilu%22+OU+%22de+poilus%22+OU+%22ww1%22+OU+%22ww2%22+OU+%22flak%22+OU+%22m%C3%A9dailles+militaires%22+OU+militaires+OU+%22munitions%22+OU+%22munition%22+OU+%22croix+gamm%C3%A9e%22+OU+%22outil+allemand%22+OU+%22bayonnette%22+OU+%22baionnette%22+ou+%22de+soldat%22&search_in=subject&price=min-300&sort=time&kst=k";
    var lastLbcPost = "";
    var lastLbcPostsArray = [];
    var audioElement = "";
    var sound = false;
    var theme_main_color = "#ec5a13";
    var theme_grey_color = "#bbbbbb";
    var refreshDelay = 10;
    var autorefresh = true;

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
            $('#switchAutorefresh').text('Stop');
        }
        else {
            $('#switchAutorefresh').addClass('scriptButtonDisabled');
            $('#switchAutorefresh').text('Lancer');
        }
    }

    function refreshLbc(){
        //const boutonDerecherche = document.querySelector('.h-2xl');
        //boutonDerecherche.addEventListener('click', () => console.log('clicked'));
       // boutonDerecherche.click();
       // console.log("Recherche actualisée");
        $('.h-2xl').trigger('click');

        var beforeRefresh = lastLbcPost;
        var afterRefresh = getLastLbcPost();



        if(beforeRefresh != afterRefresh && lastLbcPostsArray.indexOf(afterRefresh) === -1){
            if(sound){
                audioElement.play();
            }
            
            lastLbcPostsArray.push(afterRefresh);
            console.log(lastLbcPostsArray);
        }
        deletePremiumPosts();
        /////////////////////////////////////////////////
    }

    function getLastLbcPost(){
        var tempLastLbcPost = document.querySelectorAll('p[data-qa-id]')[0].textContent;
        if(lastLbcPost != tempLastLbcPost){
            lastLbcPost = tempLastLbcPost;
        }
        return lastLbcPost;

    }

    function EditDomLbc(){
        $('h1:first-child').hide();
        $('.py-md:first-child').hide(); // Barre de recherche
        $('div[data-test-id="add-category-banner"]').hide();
        $('<span id="scriptOverlay"></span>').insertAfter('nav:eq(0)');


        $( "#scriptOverlay" ).append( $('<span class="scriptButton scriptButtonDisabled"><span id="refreshCountdown">'+refreshDelay+'</span></span>') );
        $( "#scriptOverlay" ).append( $('<span id="switchSound" class="scriptButton '+((sound)?'':'scriptButtonDisabled')+'">Son</span>') );
        $( "#scriptOverlay" ).append( $('<span id="switchAutorefresh" class="scriptButton">Stop</span>') );
        $( "#scriptOverlay" ).append( $('<span id="manualRefresh" class="scriptButton">Refresh</span>') );
        $('.styles_Listing__isoog').css('margin-top', '-150px');

        var style = $('<style>#scriptOverlay { position: fixed;left: 50px;top:80px; z-index: 999999;background: #000000c7; border-radius: 5px; padding: 30px 10px; cursor: move;} .scriptButtonDisabled {background: '+theme_grey_color+' !important;} .scriptButton { background: '+theme_main_color+';font-size: 30px;padding: 5px;cursor: pointer;text-align:center; min-width: 120px;border-radius: 5px; margin: 5px; display: block; }</style>');
        $('html > head').append(style);

        $('#scriptOverlay').draggable();

    }

    function deletePremiumPosts(){
        document.querySelectorAll('.bg-accent').forEach(function(child){
            child.closest('div[class^="adcard_"]').parentNode.remove();
            console.log('Annonce sponsorisées supprimées');
        });
    }


    function init(){

        audioElement = document.createElement('audio');
        audioElement.setAttribute('src', 'https://directory.audio/media/fc_local_media/audio_preview/pending-notification.mp3');

        EditDomLbc();
        deletePremiumPosts();
    }

    window.addEventListener('load', function() {

        init();

        setInterval(function(){
            var timer = parseInt($('#refreshCountdown').text());
            if(autorefresh){
                timer = timer -1;
                if(timer == 0){
                    timer = refreshDelay;
                    refreshLbc();
                }
                
            }
            $('#refreshCountdown').text(timer);

        }, 1000);

        $(document).on('click', '#switchSound', function(){
            switchSound();
        });
        $(document).on('click', '#switchAutorefresh', function(){
            switchAutorefresh();
        });
        $(document).on('click', '#manualRefresh', function(){
            refreshLbc();
            $('#refreshCountdown').text(refreshDelay);
        });




    }, false);

})();