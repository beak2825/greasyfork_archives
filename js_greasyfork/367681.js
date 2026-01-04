// ==UserScript==
// @name          Twitch Translate Chat Messages
// @namespace     http://userstyles.org
// @description   Double-Click to Translate Twitch Chat Messages
// @author        636597
// @include       *://*.twitch.tv/*
// @run-at        document-start
// @version       1.0
// @downloadURL https://update.greasyfork.org/scripts/367681/Twitch%20Translate%20Chat%20Messages.user.js
// @updateURL https://update.greasyfork.org/scripts/367681/Twitch%20Translate%20Chat%20Messages.meta.js
// ==/UserScript==

var enableTranslation = false;
var destinationLanguage = "en";
// You have to setup some coors enabled https site with
// var GoogleTranslateBase = https://github.com/matheuss/google-translate-api
// or use 
// var GoogleTranslateBase = "https://translation.googleapis.com/language/translate/v2";
// https://console.cloud.google.com/apis/credentials
var gapi_key = "";

// Search for Occurrence *anywhere* in message
var enableBlacklist = false;
var blacklist_anywhere_words = [
];

// Search for these exact words
var blacklist_exact_words = [
    "BTTV!",
    "Prime" ,
    "Subscribe",
    "subscription",
];

function searchBlacklist( wText ) {
    var lower = wText.toLowerCase();
    for ( var i = 0; i < blacklist_anywhere_words.length; ++i ) {
        if ( lower.indexOf( blacklist_anywhere_words[ i ] ) !== -1 ) {
            //console.log( "found anywhere" );
            //console.log( wText );
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
                    //console.log( wText );
                    return true;
                }
            }
        }
    }
    return false;
}

function fixedEncodeURIComponent(str){
    return encodeURIComponent(str).replace(/[!'()]/g, escape).replace(/\*/g, "%2A");
}

var TranslationActive = false;
var gapi_key = "";
var GoogleTranslateEnd = "&key=" + gapi_key;
var TranB1 = "q=";
var TranB2 = "&target=" + destinationLanguage;
function translateText( text , dom_elem ) {
    if ( !text ) { return; }
    if ( !dom_elem ) { return; }
    text = text.trim();
    var query_string = TranB1 + fixedEncodeURIComponent( text ) + TranB2 + GoogleTranslateEnd;
    var anHttpRequest = new XMLHttpRequest();
    anHttpRequest.onreadystatechange = function() {
        if ( anHttpRequest.readyState == 4 && anHttpRequest.status == 200 ) {
            var response = anHttpRequest.responseText;
            console.log( response );
            var translation = JSON.parse( response );
            translation = translation[ "data" ][ "translations" ][ 0 ][ "translatedText" ];
            translation = translation.trim();
            var has_mention_fragment = false;
            var mention_frag_node = null;
            for ( var i = 0; i < dom_elem.childNodes.length; ++i ) {
                if ( dom_elem.childNodes[ i ].className === "mention-fragment" ) { has_mention_fragment = true; mention_frag_node = dom_elem.childNodes[ i ]; }
                var attr = dom_elem.childNodes[ i ].getAttribute( "data-a-target" );
                if ( attr === "chat-message-text" ) {
                    dom_elem.childNodes[ i ].innerHTML = translation;
                    dom_elem.setAttribute( "data-showTranslation" ,  "true" );
                    dom_elem.setAttribute( "data-translatedText" , translation );
                    dom_elem.setAttribute( "data-originalText" ,  text );
                }
            }
            if ( has_mention_fragment ) { dom_elem.removeChild( mention_frag_node ); }
        }
    };
    anHttpRequest.open( "POST", GoogleTranslateBase , true );
    anHttpRequest.setRequestHeader( "Content-Type" , "application/x-www-form-urlencoded; charset=UTF-8" );
    anHttpRequest.send( query_string );
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

                    // Revert Back to Original
                    if ( TranslationActive ) {
                        addedNode.addEventListener( "dblclick" , function() {
                          var that = this;
                          var show_translation = addedNode.getAttribute( "data-showTranslation" );
                          console.log( show_translation );
                          if ( show_translation ) {
                            if ( show_translation === "true" ) {
                                //that.style.background = "red";
                                console.log( "reverting" );
                                console.log( "old text === " );
                                var original_text = addedNode.getAttribute( "data-originalText" );
                                //console.log( original_text );
                                for ( var i = 0; i < addedNode.childNodes.length; ++i ) {
                                    if ( !addedNode.childNodes[ i ] ) { continue; }
                                    var attr = addedNode.childNodes[ i ].getAttribute( "data-a-target" );
                                    if ( attr === "chat-message-text" ) {
                                        addedNode.childNodes[ i ].innerText = original_text;
                                        break;
                                    }
                                }
                                addedNode.setAttribute( "data-showTranslation" , "false" );
                            }
                            else {
                                //that.style.background = "green";
                                addedNode.setAttribute( "data-showTranslation" ,  "true" );
                                var already_translated = addedNode.getAttribute( "data-translatedText" );
                                //console.log( "already_translated text === " );
                                //console.log( already_translated );                                
                                for ( var i = 0; i < addedNode.childNodes.length; ++i ) {
                                    if ( !addedNode.childNodes[ i ] ) { continue; }
                                    var attr = addedNode.childNodes[ i ].getAttribute( "data-a-target" );
                                    if ( attr === "chat-message-text" ) {
                                        addedNode.childNodes[ i ].innerHTML = already_translated;
                                        break;
                                    }
                                }
                            }
                          }
                          else {
                            //that.style.background = "green";
                            var start = msg.indexOf( ":" );
                            var z1 = msg.substring( ( start + 1 ) );
                            translateText( z1 , addedNode );
                          }
                        } , false );
                    }

                    if ( enableBlacklist ) {
                        var remove = searchBlacklist( msg );

                        // If Not Already Set to be Removed , Search Emotes
                        if ( !remove ) {
                            for ( var i = 0; i < addedNode.childNodes.length; ++i ) {
                                if ( !addedNode.childNodes[ i ] ) { continue; }
                                if ( !remove ) {
                                    var alt_text_target = addedNode.childNodes[ i ].getAttribute( "data-a-target" );
                                    if ( alt_text_target === "emote-name" ) {
                                        for ( var j = 0; j < addedNode.childNodes[ i ].childNodes.length; ++j ) {
                                            if ( !addedNode.childNodes[ i ].childNodes[ j ] ) { continue; }
                                            if ( !remove ) {
                                                if ( addedNode.childNodes[ i ].childNodes[ j ].alt ) {
                                                    var test = searchBlacklist( addedNode.childNodes[ i ].childNodes[ j ].alt );
                                                    if ( test ) {
                                                        remove = true;
                                                        break;                                                    
                                                    }
                                                }
                                            }
                                            else { break; }
                                        }
                                    }
                                }
                                else { break; }
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

    if ( enableTranslation && gapi_key ) {
        TranslationActive = true;
        console.log( "Translation Option Loaded" );
    }
    if ( TranslationActive || enableBlacklist ) {
        if ( enableBlacklist ) {
            console.log( "Blacklist Option Loaded" );
        }
        chat_observer.observe( chat_element , observerConfig );
    }
}

(function() {
    var ready = setInterval(function(){
        var x1 = document.querySelectorAll( '[role="log"]' );
        if ( x1 ) { if ( x1[ 0 ] ) { chat_element = x1[0]; clearInterval( ready ); loadObserver(); } }
    } , 2 );
})();