        // ==UserScript==
        // @name         Jellyfin Lyrics
        // @namespace    https://greasyfork.org/fr/scripts/437761-jellyfin-lyrics
        // @version      0.2
        // @description  Adds a button on the playingBar to toggle Lyrics
        // @author       Guillome91
        // @match        https://brocloud.dynv6.net/web/*
        // @require      https://code.jquery.com/jquery-3.6.0.min.js
        // @require      https://code.jquery.com/ui/1.13.0/jquery-ui.js
        // @resource     customCSS https://code.jquery.com/ui/1.13.0/themes/base/jquery-ui.css
        // @icon         https://brocloud.dynv6.net/web/favicon.ico
        // @encoding     utf-8
        // @grant        GM_addStyle
        // @grant        GM_xmlhttpRequest
        // @grant        GM_getResourceText
        // @connect      musixmatch.com
        // @connect      google.com
        // @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437761/Jellyfin%20Lyrics.user.js
// @updateURL https://update.greasyfork.org/scripts/437761/Jellyfin%20Lyrics.meta.js
        // ==/UserScript==

        (function() {
            'use strict';
            console.log('Jellyfin Lyrics loaded');
            var cssText = GM_getResourceText("customCSS");
            GM_addStyle(cssText);

            var song = {
                title: "",
                artist: "",
                lyrics : ""
            }

            function format(type,str){
                var p = str;
                switch (type) {
                    case 'mx':
                        p = str
                        .replaceAll('(Original Mix)','')
                        .replaceAll(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,'-')
                        .replaceAll(/\s/g,'-');
                        if (p.charAt(p.length-1) == '-') p = p.slice(0,p.length-1);
                        break;
                    case 'gg':
                        p.replaceAll(/\s/g,'+');
                        break;

                    default:
                        break;
                }
                return p;
            }

            function createNodes(){
                // Lyrics toggle panel
                const popup = document.createElement('div');
                popup.innerHTML=`
                <div id="effect" class="ui-widget-content ui-corner-all" style="position: fixed;width: 240px;height: 300px;overflow: hidden;overflow-y:scroll;
                padding: 0.4em;bottom:67px;z-index:999;">
                    <h3 class="ui-widget-header ui-corner-all" style="margin: 0;padding: 0.4em;text-align: center">Lyrics   <button id="close" style="float: right;">x</button></h3>
                    <div id="toFill"></div>
                </div>`;
                popup.id = "toggler";
                popup.setAttribute('style','width: 500px;height: 200px;');
                document.body.appendChild(popup);
                $('#effect').hide();

                // button
                if (document.querySelector('button.lyricButton') == null){
                    // create button
                    console.log('creation du button lyric');
                    const parent = document.querySelector('button.nextTrackButton');
                    parent.insertAdjacentHTML('afterend','<button id="opener" is="paper-icon-button-light" class="lyricButton mediaButton paper-icon-button-light"><span class="material-icons assignment"></span></button>');
                    //add lyrics
                }
                else console.log('button already there');

                $( function() {
                    var isAnimating = false;
                    function runEffect(){
                        $( "#effect" ).stop().toggle("slide",function(){
                            $('#effect').stop();
                        });
                    };
                    $("#opener").on( "click", function() {
                        if(isAnimating){
                            return;
                        }
                        isAnimating = true;
                        runEffect();
                        setTimeout(()=>{
                            isAnimating = false;
                        },400);
                    });
                    $("#close").on( "click", function() {
                        if(isAnimating){
                            return;
                        }
                        isAnimating = true;
                        runEffect();
                        setTimeout(()=>{
                            isAnimating = false;
                        },400);
                    });
                  });
            }
            function clearLyrics(){
                song.lyrics="";
                document.querySelector('#toFill').innerHTML= "";
            }

            function textNodesUnder(el){
                var n, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
                while(n=walk.nextNode()) a.push(n.textContent);
                return a;
            }

            function getLyricsWithGoogle(){
                 return new Promise((resolve,reject)=>{
                        const google_url = 'https://www.google.com/search?q='+song.title.replaceAll(/\s/g,'+')+'+'+song.artist.replaceAll(/\s/g,'+')+'+paroles';
                        console.log(google_url);
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: google_url,
                            onload:(response)=>{
                                var parser = new DOMParser();
                                var dom = parser.parseFromString(response.responseText,"text/html");
                                const data_lyrics = dom.querySelectorAll('[data-lyricid]')[0];
                                if (typeof data_lyrics != 'undefined'){
                                    console.log("Retrieved from Google");
                                    resolve(data_lyrics);

                                }else {
                                    console.error('Unable to find lyrics on Google');
                                    reject();
                                }
                            }

                        });
                    });
            }

            function getLyricsWithMusicXMatch(){
                return new Promise((resolve,reject)=>{
                    const musicxmatch_url = 'https://www.musixmatch.com/fr/paroles/'+format('mx',song.artist)+'/'+format('mx',song.title)+'/embed';
                    console.log(musicxmatch_url)
                    GM_xmlhttpRequest({ //get search page wth scrap
                        method: "GET",
                        url: musicxmatch_url,
                        onload: function(musicXmatch_response){
                            const parser = new DOMParser();
                            const dom = parser.parseFromString(musicXmatch_response.responseText,"text/html");
                            //we scrap the first webpage
                            const data = dom.querySelector('div.track-widget-body');
                            if (typeof data != 'undefined'){
                                song.lyrics = data.innerHTML.trim();
                                resolve(data);
                            }else {
                                console.error('Unable to find on MusicXMatch');
                                throw new Error('Unable to find lyrics Anywhere');
                            }
                        }
                    });
                });
            }


            function getInfos(){
                if (typeof $('.nowPlayingBarText div a')[0].innerHTML != "undefined"){
                    song.title = $('.nowPlayingBarText div a')[0].innerHTML;
                    song.artist = $('.nowPlayingBarText div a')[1].innerHTML;
                    console.log(song.artist+' '+song.title);
                    getLyricsWithGoogle()
                        .then(data =>{
                            if (typeof data != 'undefined'){ //google
                                const lyrics = textNodesUnder(data);
                                lyrics.forEach((elem)=>{
                                    song.lyrics += '<p>'+elem+'</p>';
                                });
                            } else throw new Error('Lyrics undefined');

                        },getLyricsWithMusicXMatch)
                        .catch((e)=>{
                            console.log(e.message);
                        })
                        .then(()=> document.querySelector('#toFill').insertAdjacentHTML('beforeend',song.lyrics) );
                }else{
                    setTimeout(()=>{
                        getInfos();
                    },1000);
                }

            }

            function load(){
                    if (document.querySelector('audio') != null && document.querySelector('div.nowPlayingBar') != null){
                        var audioElement = document.querySelector('audio');
                        createNodes();
                        getInfos();
                        audioElement.addEventListener('play',()=>{
                            setTimeout(()=>{
                                clearLyrics();
                                getInfos();
                                console.log("EventListener: "+song.title+' '+song.artist+' is playing');
                            },1000);
                        });
                    }else{
                        setTimeout(()=>{
                            load();
                        },1000);
                    }
            }

            function waitForKeyElements (
                selectorTxt,    /* Required: The jQuery selector string that
                                    specifies the desired element(s).
                                */
                actionFunction, /* Required: The code to run when elements are
                                    found. It is passed a jNode to the matched
                                    element.
                                */
                bWaitOnce,      /* Optional: If false, will continue to scan for
                                    new elements even after the first match is
                                    found.
                                */
                iframeSelector  /* Optional: If set, identifies the iframe to
                                    search.
                                */
            ) {
                var targetNodes, btargetsFound;

                if (typeof iframeSelector == "undefined")
                    targetNodes     = $(selectorTxt);
                else
                    targetNodes     = $(iframeSelector).contents ()
                                                       .find (selectorTxt);

                if (targetNodes  &&  targetNodes.length > 0) {
                    btargetsFound   = true;
                    /*--- Found target node(s).  Go through each and act if they
                        are new.
                    */
                    targetNodes.each ( function () {
                        var jThis        = $(this);
                        var alreadyFound = jThis.data ('alreadyFound')  ||  false;

                        if (!alreadyFound) {
                            //--- Call the payload function.
                            var cancelFound     = actionFunction (jThis);
                            if (cancelFound)
                                btargetsFound   = false;
                            else
                                jThis.data ('alreadyFound', true);
                        }
                    } );
                }
                else {
                    btargetsFound   = false;
                }

                //--- Get the timer-control variable for this selector.
                var controlObj      = waitForKeyElements.controlObj  ||  {};
                var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
                var timeControl     = controlObj [controlKey];

                //--- Now set or clear the timer as appropriate.
                if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
                    //--- The only condition where we need to clear the timer.
                    clearInterval (timeControl);
                    delete controlObj [controlKey]
                }
                else {
                    //--- Set a timer, if needed.
                    if ( ! timeControl) {
                        timeControl = setInterval ( function () {
                                waitForKeyElements (    selectorTxt,
                                                        actionFunction,
                                                        bWaitOnce,
                                                        iframeSelector
                                                    );
                            },
                            300
                        );
                        controlObj [controlKey] = timeControl;
                    }
                }
                waitForKeyElements.controlObj   = controlObj;
            }

            waitForKeyElements('audio',function(){
                load();
            });
        })();

