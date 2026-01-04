// ==UserScript==
// @name          Twitch Custom Sharable 20MAR2019
// @namespace     http://userstyles.org
// @description   Sharable Twitch Addon for Friends
// @author        blah_blah_blah
// @include       *://*.twitch.tv/*
// @run-at        document-start
// @version       0.1
// @downloadURL https://update.greasyfork.org/scripts/380678/Twitch%20Custom%20Sharable%2020MAR2019.user.js
// @updateURL https://update.greasyfork.org/scripts/380678/Twitch%20Custom%20Sharable%2020MAR2019.meta.js
// ==/UserScript==

// Search for Occurrence *anywhere* in message
var enableBlacklist = true;
var blacklist_anywhere_words = [
    "https://chessbrah.ting.com/" ,
    "https://www.chessbrah.tv/hos" ,
    "https://www.chessbrah.tv/chess" ,
    "www.chessbrah.tv/chess",
    "https://discord.gg/chessbrah" ,
    "https://youtu.be/Vjr1Hs6iBrA" ,
    "twitter.com/chessbrahTV",
    "https://streamlabs.com/chessbrah",
    "http://chessbrahstore.com/",
    "https://instagram.com/eric.hansen/",
    "bae",
    "chess bay",
];

// Search for these exact words
var blacklist_exact_words = [
    "BTTV!",
    "Prime" ,
    "Subscribe",
    "subscription",
    "chessbrahTV",
    "Vjr1Hs6iBrA",
    "https://youtu.be/Vjr1Hs6iBrA",
];

// Block these "known" "toxic" Twitch Chess Users
var blacklist_toxic_usernames = [ "brickballerbrand","brewmasta","jj_dynasty","smoknhotgirl","limebr","sleazyart","moobot","poopydickens","aniketm117","cherrera96","neotris9","wittyseal","anon012","movingdutchman","cwizzo3000","joaopires92","toddl1088","blswagger07","veteranbailey11b","tlbogdan94","cherub_enjel","whosteeenoh","abscynthe","zebraismyboss","nelsonmoore1","rjaxon18","moscatel87","justice_scalia","hollyisthicc","klimtkiller","ruiisuuu","floppytuesday","fourir","absorbingunderwear","perpetualstalemate","soundsofkilling","offllineplayer","vyenos2507","ibschi","monnomtwitch","jojogoloa","lillmackish","thancin","reflypubg","romanchessmaster2","heldmat","oui_ouims","apsyrtos","enpawnsmom","karpovgambit64","harstar_","casual_mate_in_24","that_fat_kiddd","good_evening17","goonrecruiter","applemangobanana","huhting","nargathronic","unnamedcomet","guytori","pushdapawns","dog_king_101","maartenols","flolj","kingofthechickengods","nickyownsyou","custom_mods","evcon69","poya221b","klausyboi","borispasskey","exploreri","chickaboogaagabooga","nescafestrong","aminorph","oinest","tssn_alfa","xisumasassamtea","iam_veryedgy","pinkpocky","wiedehopf","xdslammed","croskie","zippyrm","thatthomas","iamnobodyreally","mate_in_china","spoiled_kitty","smashhhhhhhh","alexgabrielov","ctm095","moopus","darkengine_","dtg412","poopoosticky","dantuch","joaoalexandre0","kentimeter_","scoffman_bratr","drdremate","corluxx","zeldaalasca","harpvr23","painpita","cr7sbestfriend","bendoverfinegold","apolchess","boranibanjan","senjai","amans_bum","aleha95","seldom_pooper","useruseruser0","hopinthedelorean","stc2018","janvreid","ballcream5000","the_sniper_chess","hirnloserverlierer","microwaved_poop","theliquidator101","hasantrix","thebingleboop","streamelements","stevencumlings","thenarthin","doorsnake","methematics4477","awesome843","ipooopmypants","masokistgirl","magician_531","tricaset","cai__","little_turd","dalehb21603","chessyspagett","torqueytv","stevew90","sanguinephoenixx","jakeloans","i_eat_yummy_poo","zak9819","alqaeda0470","vertwitch","killyoselffool","mightypleb","j3wmanchu","i_poop_at_chess","pawnsplatter","justaddblu","oyvindmal","killer123miner","riataman","son0fabirch","f8b9","irnjuggle28","phillyboy8008","johahi","the_tasty_pickle","piecelovehappiness","klutchdr","checkmateeerree123","badhabitmarco","erperry1","killerayanda","chessbae94","chessjack11","immortalcobb","michaelscott101","lazy_sapien","mrlpoo","paleemperor94","kopper2002","sleepyirv","prkid86","seanyang0813","joebruin","lackiluke_","catweb99","kodytrent","dstark93","edgeoftommrrow","sewicsyde","mikoisfantastic","claracottontail","lookatthis1","tssvfttsos","d_price0407","fishimpersonator","goldnuscarlsen","string_dogg","krazyvibezz","rabid_skwirl","fut02","heinmint93","hsingh574","deletedys","jeralllop","dimitriraymondo88","dchunter1213","cattherinesmith","movebymove","poopgod","everclear06","vikcch","deitmar_ch","thesilverniko","forceadraw","twitchuser34526","llawliet187","theratrivertrapper","amirrimidaiw","daaaaaaaaniel","goodchessmind","eeandy3","davidfernando84","alchemist888","joyouslovehello","lyghtryder","cr34myl33754uc3","martineden41","thebestguydude","ayyyayyyyron","lakarahh","bottleandglass","emilynella","tetrolobs","basherpubg","ftpower718","brujaweb","eliemilikow","mewando","pawngrubber","grittywillis","kappa_fappa","jimjamthemanfam","melbaa","ryanmp99","nikolastheiss","ender_ccz","zpoutinez","knewkn0w","sirraptor_","protectedpasser","kolt54321","alectv","berenzen_kt","doxsaint","martaway","unrim","de_greenlight","drblueman","the_boomer123","sergioktl","jharnisch4","greip_","butipoopfromthere2","arnastu","tnkhanh","adam_jason_babcock","karkblodslegge","ooloncolluphid","hl275","martimportugaltheman","palmroth197","gopher_tv","vanquisher13","mcblyutman","jdgfcr","lordmilio","fractalflowers","penguingm999","doctorlono","figeon","blackferne","dark_knight_chessbrah","itellirate","whoispenguingm1","mcjgp","inklingismidtier","wolfsbane93","andyisyoda","pokercommentator","oledole","phoolala","idontdeservetolive2","wollycc","myarchimedes314","armymedicrn","skylargames","jeremyb311","bjh13","mite_ms","ryanwannabe","bilborados","kyoretsue","furrylover228","powerchess","cloroxbleach34","torifanforever","grantics","thulester","oooslo","langrehr8751","chompas11","vitothehero","samlinho","balajid13","sharbel95","aaronpkelly","sealxteam6","jubaskete","gm_johndavis_59","inserttoken","tolesag","sardonicpawn","alexz323","ewizzle","gummybearthug","addwaah","nomenescire","booobyfischer","en_croissant","ultra1280","gmstreamer","myspiku","altruisticraven","tito85","lawrencelafonti","thetimeofnick","sertmansc","dzabs","frantorius","pdxzionlion","moonbutter","krapstain13","kahnet","twoy519","gm_sleepless","majesticness17","jeegs2424","edvedder758","theycallmetalon","strugglebusses","clumsyrook","blackpainted","over_thetop","robocooldude2468","thewhitetw1","aquilaungula","babi79","heatmizer","fatfattie1","ertugrull01","thatsmate","caruana_at_blitz","yesihaveautism","gobbedy","fractal_dust","unc0nv3ntional","biotelomeres","ralph_wigum_","nigelbushy","jingram16","its_doobuh","theunlikelyknight","nevermoreless","dnepom","drainus","reedthedamnbook","gmultraplayer","teabagyoazz","lillebq","gordon112007","madphantasy94","crazycoffeeman","pettayt","obrestad99","pr0n00b_","aleksjac","blunderyears","bradcoulding","theendgamemagician","twitch2week2slo","livetera1","applejuicelikeskc","dns_2222","chesscomet","renttodaynooooot","kingoldman926","cotillionxy","tellusumpin","rrhydd","anotherswedishplayer","booshu","warmpepsi","santiaprende","gilad905","alekz14","livkalo","ruzzle26","ave1842","vea1337","biscuitfiend2592","bama3737","rocknrolljb","eggnchips66"
];

function searchBlacklist( wText ) {

    var lower = wText.toLowerCase();

    for ( var i = 0; i < blacklist_toxic_usernames.length; ++i ) {
        if ( lower.indexOf( blacklist_toxic_usernames[ i ] ) !== -1 ) {
            //console.log( "found known "toxic" username" );
            console.log( wText );
            return true;
        }
    }

    for ( var i = 0; i < blacklist_anywhere_words.length; ++i ) {
        if ( lower.indexOf( blacklist_anywhere_words[ i ] ) !== -1 ) {
            //console.log( "found anywhere" );
            console.log( wText );
            return true;
        }
    }
    var x11 = wText.split( ":" )[ 1 ];
    if ( x11 ) {
        x11 = x11.split( " " );
        for ( var j = 0; j < x11.length; ++j ) {
            for ( var i = 0; i < blacklist_exact_words.length; ++i ) {
                if ( x11[ j ] === blacklist_exact_words[ i ] ) {
                    //console.log( "found exact" );
                    console.log( wText );
                    return true;
                }
            }
        }
    }
    return false;
}


var chat_element = null;
var chat_observer = null;
var observerConfig = {
    attributes: true,
    childList: true,
    characterData: true
};

function loadObserver() {
    chat_observer = new MutationObserver(function(mutations) {
        mutations.forEach(function( mutation , index ) {
            if ( mutation.type === "childList" ) {
                var addedNode = mutation.addedNodes[0];
                if( addedNode ) {
                    var msg = addedNode.innerText;
                    if ( enableBlacklist ) {
                        var remove = searchBlacklist( msg );
                        // If Not Already Set to be Removed , Search Emotes
                        if ( !remove ) {
                            //console.log( addedNode.innerHTML );
                            var searchText = addedNode.innerHTML;
                            var candidates = [];
                            if ( searchText ) {
                                var re = new RegExp( 'alt="' , "gi" );
                                var starts = new Array();
                                while ( re.exec( searchText ) ){
                                    starts.push( re.lastIndex );
                                }
                                if ( starts.length > 0 ) {
                                    for ( var i = 0; i < starts.length; ++i ) {
                                        var stop = searchText.indexOf( '"' , starts[ i ] );
                                        if ( stop ) {
                                            candidates.push( searchText.substring( starts[ i ] , stop ) );
                                        }
                                    }
                                }

                            }
                            if ( candidates.length > 1 ) {
                                for ( var i = 1; i < candidates.length; ++i ) {
                                    if ( !remove ) {
                                        remove = searchBlacklist( candidates[ i ] );
                                    }
                                    else { break; }
                                }
                                //console.log( candidates );
                            }

                        }

                        if ( remove ) {
                            if ( addedNode.parentNode ) {
                                try {
                                    addedNode.setAttribute( "style", "visibility: hidden !important" );
                                    addedNode.setAttribute( "style", "height: 0 !important" );
                                    addedNode.setAttribute( "style", "padding: 0 !important" );
                                    addedNode.innerHTML = "";
                                }
                                catch( e ) { console.log( e ); }
                            }
                        }
                    }
                }
            }
        });
    });

    if ( enableBlacklist ) {
        chat_observer.observe( chat_element , observerConfig );
        console.log( "Blacklist Option Loaded" );
    }

}

(function() {
    var ready = setInterval(function(){
        var x1 = document.querySelectorAll( '[role="log"]' );
        if ( x1 ) { if ( x1[ 0 ] ) { chat_element = x1[0]; clearInterval( ready ); loadObserver(); } }
    } , 2 );
    setTimeout( function() {
        clearInterval( ready );
    } , 10000 );
})();