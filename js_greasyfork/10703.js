// ==UserScript==
// @name                T-Rex Family Forum script
// @namespace           https://www.greasyfork.org/fr/scripts/10703-t-rex-family-forum-script
// @grant               GM_xmlhttpRequest
// @grant               GM_deleteValue
// @grant               GM_getValue
// @grant               GM_listValues
// @grant               GM_setValue
// @version             20181011.01
// @released            2015-06-29
// @License             http://www.gnu.org/copyleft/gpl.html - GPL license
// @description         Modify display of Forum pages.
// @icon                https://pbs.twimg.com/profile_images/1882669212/trex_normal.jpg
// @include             http://t-rex-club-forum.soforums.com/*
// @downloadURL https://update.greasyfork.org/scripts/10703/T-Rex%20Family%20Forum%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/10703/T-Rex%20Family%20Forum%20script.meta.js
// ==/UserScript==
//------------------------------------------------------------------------------

console.log("Starting T-Rex Family Forum script from:", window.parent.location);
function run() {
    //console.log("Run() ...");

    // jQuery loading
    function addJQuery(callback) {
        var script = document.createElement("script");
        script.setAttribute("src", "http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
        script.addEventListener('load', function() {
            var script = document.createElement("script");
            script.textContent = "window.JQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
            document.body.appendChild(script);
        }, false);
        document.body.appendChild(script);
    }

    // Do Main modifications !!!
    function main() {
        
        /*console.log('*** Remove Text signatures')
        //JQ('[class=postbody]').remove();
        //-------------
        */
        
        if ( JQ('.postdetails > img').length ) {
            console.log('*** Change Author profile image size');
            JQ('.postdetails > img').width('25%');
        }   //-------------

        if ( JQ('[class$=photo]').length ) {
            console.log('*** Reduce Author Avatar image size');
            JQ('[class$=photo]').width('50%');
        }   //-------------

        if ( JQ('[title$=Zodiaque]').length ) {
            console.log('*** Remove Chinois, Zodiac, Sexe signs from Profile');
            JQ('[title$=Zodiaque]').remove();
            JQ('[title$=Sexe]').remove();
            JQ('[title$=Chinois]').remove();
        }   //-------------        

        console.log('*** Ads #0: Change BODY top padding to 0px');
        document.body.style.padding = "0px";
        //-------------
        
        if ( JQ('.forumline:contains("Publicité")').length ) {
            console.log('*** Ads #1: Remove Google Ads');
            JQ('.forumline:contains("Publicité")').each( function(){
                JQ(this).remove();
            });        
        }   //-------------

        var TARGET2 = document.getElementById(document._tmpFrameIdX);
        if (TARGET2) {
            console.log('*** Ads #2: Found DIV for %s... Hide it.',document._tmpFrameIdX);
            TARGET2.style.display = "none";
            TARGET2.remove();
        }   //-------------
        
        if ( JQ('#XOOITTOOLBARFRAME').length ) {
            console.log('*** Ads #3: Remove XOOIT toolbar');
            JQ('#XOOITTOOLBARHELP').remove(); 
            JQ('#XOOITTOOLBARFRAME').remove(); 
        }   //-------------

        if ( JQ('.postdetails:contains("Sujet du message")').length ) {
            console.log('*** Remove "Sujet" text line from comments & highlight Post date/time');
            JQ('.postdetails:contains("Sujet du message")').each( function(){
                JQ(this).css('font-weight', 'bold');
                JQ(this).css('color', 'red');
                JQ(this).html(JQ(this).html().replace(/Sujet du message.*-->/, '').replace(/Posté le:/,''));
            });        
        }   //-------------

        
        if ( JQ('.thLeft').length ) {
            console.log('*** Remove Comment TD Head text (Auteur / Message) for %s entries', JQ('.thLeft').length );
            JQ('.thLeft').height('4');
            JQ('.thLeft').text('');
            JQ('.thRight').height('4');
            JQ('.thRight').text('');
            console.log('*** Reduce left column width from 150px to 125px (more comment text available)');
            JQ('.thLeft').width('125px');
        }   //-------------

        if ( JQ('.maintitle').length ) {
            var TITLE = JQ('.maintitle').text()   ;
            var TITLEURL = document.location.href ;
            console.log('*** Add Topic Title on top of page : ',TITLEURL);
            JQ("body").append("<div id='TitleOverlay'></div>");

            JQ("#TitleOverlay")
            .css({
                'opacity': 0.9,
                'position': 'fixed',
                'top': 0,
                'left': 0,
                'background-color': 'darkgrey',
                'text-align': 'center',
                'width': '100%'});
            JQ("#TitleOverlay").append('<A HREF=' + TITLEURL + '>[ ' + TITLE + ' ]</A> <A HREF="/"><img width=8%  height=8% style="PADDING-LEFT: 30px; vertical-align:middle;" src="http://i61.tinypic.com/t5je46.jpg" text="Index Forum!"></A>');
            JQ("#TitleOverlay").addClass('maintitle');
        }   //-------------

        console.log('*** Reduce Content size to fit mobile view');
        JQ('span.mainmenu').html(JQ('span.mainmenu').html().replace(/Vous n.avez pas de nouveaux messages/, 'Messages'));  // Reduit ligne de Menu
        JQ('.liteoption.button2:submit').val("Prévisualisation");             // Reduit Button d'envoi
        JQ('.liteoption.button2:button').val("Prévisualisation & Ortho.");    // Reduit Button d'envoi2
        JQ('select[name=f]').width('100px');                                  // Selecteur bas de page 'Sauter vers'
        JQ('select[name=postorder]').width('100px');                          // Selecteur bas de page 'Ordre des Posts'
        JQ('#helpbox1').remove();                                             // Ligne d'aide Edition commentaire trop longue.
        
        JQ(window).resize(checkWidth);
        function checkWidth() {
            var windowwidth = JQ(window).width();
            console.log('*** Resizing width to %s px', windowwidth);
            JQ('img').each( function() {
                var image = JQ(this);
                if ((image.width() + 200) > windowwidth) {
                    if (image.attr('src') != 'http://img.xooimage.com/files4/n/a/nav_shadow-93052.gif') {
                        console.log('SET IMAGE WIDTH AUTO FOR ' + image.attr('src'));
                        image.width('100%'); 
                    } else {
                        console.log('REMOVE IMAGE             ' + image.attr('src'));
                        image.remove(); 
                    }
                }    // Resize auto pour toutes les images > window width 
            });
        } //--- End checkWidth()
        checkWidth();                  // Execute une fois au demarrage...
        JQ(window).resize(checkWidth); // Execute en cas de resize de la fenetre...

    } // END MAIN

    // load jQuery and execute the main function
    //console.time('MODIFICATION TIME');
    addJQuery(main); 
    //console.timeEnd('MODIFICATION TIME');

}

//------------------------------------------------------------------------------
window.setTimeout(run, 500);
//------------------------------------------------------------------------------
