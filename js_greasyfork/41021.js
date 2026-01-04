// ==UserScript==
// @name          Twitch Chat Blacklist Words
// @namespace     http://userstyles.org
// @description   Blacklist Block Words in Twitch Chat
// @author        8932276449
// @include       *://*.twitch.tv/*
// @run-at        document-start
// @version       0.8
// @downloadURL https://update.greasyfork.org/scripts/41021/Twitch%20Chat%20Blacklist%20Words.user.js
// @updateURL https://update.greasyfork.org/scripts/41021/Twitch%20Chat%20Blacklist%20Words.meta.js
// ==/UserScript==

// Search for Occurance *anywhere* in message
var blacklist_aggressive_words = [
    "bae" ,
];

// Search for these exact words
var blacklist_exact_words = [
    "Prime" ,
    "Subscribe",
    "subscription",
];

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
                var remove = false;
                if( addedNode ) {
                    var msg = addedNode.innerText;
                    for ( var i = 0; i < blacklist_aggressive_words.length; ++i ) {
                        if ( msg.toLowerCase().indexOf( blacklist_aggressive_words[ i ] ) !== -1 ) {
                            //console.log( "found aggressive" );
                            //console.log( msg );
                            remove = true;
                            break;
                        }
                    }
                    if ( !remove ) {
                        var x11 = msg.split( ":" )[1];
                        if ( x11 ) {
                            x11 = x11.split( " " );
                            for ( var j = 0; j < x11.length; ++j ) {
                                if ( !remove ) {
                                    for ( var i = 0; i < blacklist_exact_words.length; ++i ) {
                                        if ( x11[ j ] === blacklist_exact_words[ i ] ) {
                                            //console.log( "found exact" );
                                            //console.log( msg );
                                            remove = true;
                                            break;
                                        }
                                    }
                                }
                                else { break; }
                            }
                        }
                    }
                    if ( !remove ) {
                        for ( var i = 0; i < addedNode.childNodes.length; ++i ) {
                            if ( !remove ) {
                                var alt_text_target = addedNode.childNodes[ i ].getAttribute( "data-a-target" );
                                if ( alt_text_target === "emote-name" ) {
                                    for ( var j = 0; j < addedNode.childNodes[ i ].childNodes.length; ++j ) {
                                        if ( !remove ) {
                                            if ( addedNode.childNodes[ i ].childNodes[ j ].alt ) {
                                                for ( var q = 0; q < blacklist_aggressive_words.length; ++q ) {
                                                    if ( addedNode.childNodes[ i ].childNodes[ j ].alt.toLowerCase().indexOf( blacklist_aggressive_words[ q ] ) !== -1 ) {
                                                        //console.log( "found aggressive in emote" );
                                                        //console.log( msg );
                                                        remove = true;
                                                        break;
                                                    }
                                                }
                                                if ( !remove ) {
                                                    for ( var x = 0; x < blacklist_exact_words.length; ++x ) {
                                                        if ( blacklist_exact_words[ x ] === addedNode.childNodes[ i ].childNodes[ j ].alt ) {
                                                            //console.log( "found exact in emote" );
                                                            //console.log( addedNode.childNodes[ i ].childNodes[ j ].alt );
                                                            remove = true;
                                                            break;
                                                        }
                                                    }
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
                                addedNode.setAttribute("style", "visibility: hidden !important");
                                addedNode.setAttribute("style", "height: 0 !important");
                                addedNode.setAttribute("style", "padding: 0 !important");
                                addedNode.innerHTML = "";
                            }
                            catch( e ) { console.log( e ); }
                        }
                    }
                }
            }
        });
    });

    chat_observer.observe( chat_element , observerConfig );
    console.log( "Twitch Blacklist Words Loaded" );
}

(function() {
    var ready = setInterval(function(){
        var x1 = document.querySelectorAll( '[role="log"]' );
        if ( x1 ) { if ( x1[ 0 ] ) { chat_element = x1[0]; clearInterval( ready ); loadObserver(); } }
    } , 2 );
})();