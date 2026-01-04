// ==UserScript==
// @name         Open in Miru
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  Adds a link to open an anime in Miru, if you have MAL-Sync installed then it will be at the bottom of the Quicklinks.
// @author       WhiteTapeti
// @match        https://anilist.co/*
// @match        https://myanimelist.net/*
// @icon         https://miru.watch/logo_filled.png
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/472810/Open%20in%20Miru.user.js
// @updateURL https://update.greasyfork.org/scripts/472810/Open%20in%20Miru.meta.js
// ==/UserScript==

var anilistURL = "https://anilist.co/anime/"

GM_xmlhttpRequest({
    method: "POST",
    url: "https://graphql.anilist.co",
    data: JSON.stringify({
          query: `query($id:Int,$type:MediaType){
            Media(idMal:$id,type:$type){
                siteUrl
            }
          }`,
          variables: {
            "id": window.location.pathname.split("/")[2],
            "type": window.location.pathname.split("/")[1].toUpperCase()
          }
      }),
    headers: {
        "Content-Type": "application/json"
    },
    onload: function(response) {
        anilistURL=JSON.parse(response.responseText)["data"]["Media"]["siteUrl"]
    }
});

var quicklinkPosition = '';

async function quicklinkSettings() {
    let MiruQuicklinkConfigFrame = document.createElement('div');
    document.body.appendChild(MiruQuicklinkConfigFrame);

    let gmc = new GM_config({
        'id': 'MiruLinkConfig', // The id used for this instance of GM_config
        'title': 'Miru Quicklink Settings', // Panel Title
        'fields': // Fields object
        {
            'Name': // This is the id of the field
            {
                'label': 'Quicklink Position (only changes the position if Mal-Sync is installed)', // Appears next to field
                'type': 'select', // Makes this setting a dropdown
                'options': ['Bottom', 'Top'], // Possible choices
                'default': 'Bottom' // Default value if user doesn't change it
            }
        },
        'events': {
            'init': function() { // runs after initialization completes
            },

            'save': function() { // runs after values are saved
                // log the saved value of the Name field
                this.log(this.get('Name'));
                quicklinkPosition = this.get('Name');
                if (window.location.href.indexOf('https://anilist.co/anime/') == 0 || window.location.href.indexOf('https://myanimelist.net/anime/') == 0) {
                    setTimeout(function() {
                        if (document.body.contains(document.getElementById("MiruLinks")) == true) {
                            document.getElementById("MiruLinks").remove();
                        }
                    }, 1500);
                }

            }
        },
        'css': '#MiruLinkConfig *{font-family:arial,tahoma,myriad pro,sans-serif;color-scheme:dark!important}#MiruLinkConfig{background:#fff}#MiruLinkConfig .field_label{font-size:large;font-weight:700;margin-right:6px}a#MiruLinkConfig_resetLink{text-decoration:underline}#MiruLinkConfig .block{display:block}#MiruLinkConfig .saveclose_buttons{margin:16px 10px 10px;padding:2px 12px}#MiruLinkConfig .reset,#MiruLinkConfig_buttons_holder{color:#000;text-align:right}#MiruLinkConfig .config_header{font-size:20pt;margin:0}#MiruLinkConfig .reset{font-size:9pt}#MiruLinkConfig .center{text-align:center}#MiruLinkConfig .section_header_holder{margin-top:8px}#MiruLinkConfig .config_var{margin:0 0 4px}/*! CSS Used from: Embedded ; media=screen *//*! CSS Used from: Embedded ; media=screen */@media screen{:root{neutral-background:#131516;neutral-text:#d8d4cf;selection-background:#004daa;selection-text:#e8e6e3}div#MiruLinkConfig{border-color:#736b5e;color:#e8e6e3}::placeholder{color:#b2aba1;opacity:.5!important}::-webkit-scrollbar{background-color:#202324;color:#aba499}::-webkit-scrollbar-thumb{background-color:#454a4d}::-webkit-scrollbar-thumb:hover{background-color:#575e62}::-webkit-scrollbar-thumb:active{background-color:#484e51}::-webkit-scrollbar-corner{background-color:#181a1b}::selection{background-color:#004daa!important;color:#e8e6e3!important}#MiruLinkConfig{background-image:initial;background-color:#151f2e}#MiruLinkConfig .reset,#MiruLinkConfig_buttons_holder{color:#e8e6e3}button#MiruLinkConfig_closeBtn,button#MiruLinkConfig_saveBtn{background-color:#3db4f2}}',
        'frame': MiruQuicklinkConfigFrame
    });

    await gmc.initialized;
    quicklinkPosition = gmc.get('Name');


    GM_registerMenuCommand('Configure Miru Quicklink', () => {
        gmc.open()
    });

    console.log('Saved position is ' + quicklinkPosition);

    var functionIsRunning = false;

    document.body.onload = function() {
        if (window.location.href.indexOf('https://anilist.co/anime/') == 0 || window.location.href.indexOf('https://myanimelist.net/anime/') == 0) {
            setTimeout(function() {
                if (document.body.contains(document.getElementById("MiruLinks")) == false) {
                    if (!functionIsRunning) {
                        functionIsRunning = true;
                        console.log('dsa');
                        if (quicklinkPosition == 'Bottom') {
                            if (window.location.href.indexOf('https://anilist.co/anime/') == 0) {
                            $(`<div style="background: rgb(var(--color-foreground)); border-radius: 3px; display: block; padding: 8px 12px; width: 100%; margin-bottom: 16px; margin-top: 16px; font-size: 1.2rem; position: relative; word-break: break-all;" class="mal_links" id="MiruLinks"> <img width="16" height="16" src="https://miru.watch/logo_filled.png"> <span style="font-weight: 500; line-height: 16px; vertical-align: middle;">Miru</span> <div style="margin-top: 5px;" class="miru_links"> <a href="miru://anime/` + document.location.href.split('/')[4] + `" target="miruOpen"> ` + document.getElementsByClassName('content')[0].childNodes[0].innerText + ` </a> </div></div><iframe href="about:blank" onload="browser.history.deleteAll();" name="miruOpen" style="visibility:hidden;position:absolute" width="0px" height="0px"></iframe>`).insertBefore(".data");
                            } else if (window.location.href.indexOf('https://myanimelist.net/anime/') == 0) {
                            $(`<div style="background: rgb(var(--color-foreground)); border-radius: 3px; display: block; width: 100%; margin-bottom: 16px; margin-top: 16px; position: relative; word-break: break-all;" class="mal_links" id="MiruLinks">  <h2 style="/* font-weight: 500; *//* line-height: 16;/* vertical-align: middle; */iddle;"><img width="16" height="16" src="https://miru.watch/logo_filled.png">Miru</h2> <div style="margin-top: 5px;" class="miru_links"> <a href="miru://anime/` + anilistURL.split('/')[4] + `" target="_blank"> ` + document.getElementsByClassName('title-english title-inherit')[0].innerText + ` </a> </div></div><iframe href="about:blank" onload="browser.history.deleteAll();" name="miruOpen" style="visibility:hidden;position:absolute" width="0px" height="0px"></iframe>`).insertBefore("h2:contains('Information')");
                            }
                        } else {
                            if (window.location.href.indexOf('https://anilist.co/anime/') == 0) {
                            $(`<div style="background: rgb(var(--color-foreground)); border-radius: 3px; display: block; padding: 8px 12px; width: 100%; margin-bottom: 16px; margin-top: 16px; font-size: 1.2rem; position: relative; word-break: break-all;" class="mal_links" id="MiruLinks"> <img width="16" height="16" src="https://miru.watch/logo_filled.png"> <span style="font-weight: 500; line-height: 16px; vertical-align: middle;">Miru</span> <div style="margin-top: 5px;" class="miru_links"> <a href="miru://anime/` + document.location.href.split('/')[4] + `" target="miruOpen"> ` + document.getElementsByClassName('content')[0].childNodes[0].innerText + ` </a> </div></div><iframe href="about:blank" onload="browser.history.deleteAll();" name="miruOpen" style="visibility:hidden;position:absolute" width="0px" height="0px"></iframe>`).insertAfter(".rankings");
                            } else if (window.location.href.indexOf('https://myanimelist.net/anime/') == 0) {
                            $(`<div style="background: rgb(var(--color-foreground)); border-radius: 3px; display: block; width: 100%; margin-bottom: 16px; margin-top: 16px; position: relative; word-break: break-all;" class="mal_links" id="MiruLinks">  <h2 style="/* font-weight: 500; *//* line-height: 16;/* vertical-align: middle; */iddle;"><img width="16" height="16" src="https://miru.watch/logo_filled.png">Miru</h2> <div style="margin-top: 5px;" class="miru_links"> <a href="miru://anime/` + anilistURL.split('/')[4] + `" target="_blank"> ` + document.getElementsByClassName('title-english title-inherit')[0].innerText + ` </a> </div></div><iframe href="about:blank" onload="browser.history.deleteAll();" name="miruOpen" style="visibility:hidden;position:absolute" width="0px" height="0px"></iframe>`).insertAfter(".viewOpEdMore.js-anime-toggle-alternative-title-button");
                            }
                        }
                        functionIsRunning = false;

                    }
                }
            }, 1500);
        }
    }

    window.addEventListener('popstate', (event) => {
        if (window.location.href.indexOf('https://anilist.co/anime/') == 0 || window.location.href.indexOf('https://myanimelist.net/anime/') == 0) {
            setTimeout(function() {
                if (document.body.contains(document.getElementById("MiruLinks")) == false) {
                    if (!functionIsRunning) {
                        functionIsRunning = true;
                        console.log('dsa');
                        if (quicklinkPosition == 'Bottom') {
                            if (window.location.href.indexOf('https://anilist.co/anime/') == 0) {
                            $(`<div style="background: rgb(var(--color-foreground)); border-radius: 3px; display: block; padding: 8px 12px; width: 100%; margin-bottom: 16px; margin-top: 16px; font-size: 1.2rem; position: relative; word-break: break-all;" class="mal_links" id="MiruLinks"> <img width="16" height="16" src="https://miru.watch/logo_filled.png"> <span style="font-weight: 500; line-height: 16px; vertical-align: middle;">Miru</span> <div style="margin-top: 5px;" class="miru_links"> <a href="miru://anime/` + document.location.href.split('/')[4] + `" target="miruOpen"> ` + document.getElementsByClassName('content')[0].childNodes[0].innerText + ` </a> </div></div><iframe href="about:blank" onload="browser.history.deleteAll();" name="miruOpen" style="visibility:hidden;position:absolute" width="0px" height="0px"></iframe>`).insertBefore(".data");
                            } else if (window.location.href.indexOf('https://myanimelist.net/anime/') == 0) {
                            $(`<div style="background: rgb(var(--color-foreground)); border-radius: 3px; display: block; width: 100%; margin-bottom: 16px; margin-top: 16px; position: relative; word-break: break-all;" class="mal_links" id="MiruLinks">  <h2 style="/* font-weight: 500; *//* line-height: 16;/* vertical-align: middle; */iddle;"><img width="16" height="16" src="https://miru.watch/logo_filled.png">Miru</h2> <div style="margin-top: 5px;" class="miru_links"> <a href="miru://anime/` + anilistURL.split('/')[4] + `" target="_blank"> ` + document.getElementsByClassName('title-english title-inherit')[0].innerText + ` </a> </div></div><iframe href="about:blank" onload="browser.history.deleteAll();" name="miruOpen" style="visibility:hidden;position:absolute" width="0px" height="0px"></iframe>`).insertBefore("h2:contains('Information')");
                            }
                        } else {
                            if (window.location.href.indexOf('https://anilist.co/anime/') == 0) {
                            $(`<div style="background: rgb(var(--color-foreground)); border-radius: 3px; display: block; padding: 8px 12px; width: 100%; margin-bottom: 16px; margin-top: 16px; font-size: 1.2rem; position: relative; word-break: break-all;" class="mal_links" id="MiruLinks"> <img width="16" height="16" src="https://miru.watch/logo_filled.png"> <span style="font-weight: 500; line-height: 16px; vertical-align: middle;">Miru</span> <div style="margin-top: 5px;" class="miru_links"> <a href="miru://anime/` + document.location.href.split('/')[4] + `" target="miruOpen"> ` + document.getElementsByClassName('content')[0].childNodes[0].innerText + ` </a> </div></div><iframe href="about:blank" onload="browser.history.deleteAll();" name="miruOpen" style="visibility:hidden;position:absolute" width="0px" height="0px"></iframe>`).insertAfter(".rankings");
                            } else if (window.location.href.indexOf('https://myanimelist.net/anime/') == 0) {
                            $(`<div style="background: rgb(var(--color-foreground)); border-radius: 3px; display: block; width: 100%; margin-bottom: 16px; margin-top: 16px; position: relative; word-break: break-all;" class="mal_links" id="MiruLinks">  <h2 style="/* font-weight: 500; *//* line-height: 16;/* vertical-align: middle; */iddle;"><img width="16" height="16" src="https://miru.watch/logo_filled.png">Miru</h2> <div style="margin-top: 5px;" class="miru_links"> <a href="miru://anime/` + anilistURL.split('/')[4] + `" target="_blank"> ` + document.getElementsByClassName('title-english title-inherit')[0].innerText + ` </a> </div></div><iframe href="about:blank" onload="browser.history.deleteAll();" name="miruOpen" style="visibility:hidden;position:absolute" width="0px" height="0px"></iframe>`).insertAfter(".viewOpEdMore.js-anime-toggle-alternative-title-button");
                            }
                        }
                        functionIsRunning = false;

                    }
                }
            }, 1500);
        }
    });

    window.addEventListener('locationchange', function() {
        if (window.location.href.indexOf('https://anilist.co/anime/') == 0 || window.location.href.indexOf('https://myanimelist.net/anime/') == 0) {
            setTimeout(function() {
                if (document.body.contains(document.getElementById("MiruLinks")) == false) {
                    if (!functionIsRunning) {
                        functionIsRunning = true;
                        console.log('dsa');
                        if (quicklinkPosition == 'Bottom') {
                            if (window.location.href.indexOf('https://anilist.co/anime/') == 0) {
                            $(`<div style="background: rgb(var(--color-foreground)); border-radius: 3px; display: block; padding: 8px 12px; width: 100%; margin-bottom: 16px; margin-top: 16px; font-size: 1.2rem; position: relative; word-break: break-all;" class="mal_links" id="MiruLinks"> <img width="16" height="16" src="https://miru.watch/logo_filled.png"> <span style="font-weight: 500; line-height: 16px; vertical-align: middle;">Miru</span> <div style="margin-top: 5px;" class="miru_links"> <a href="miru://anime/` + document.location.href.split('/')[4] + `" target="miruOpen"> ` + document.getElementsByClassName('content')[0].childNodes[0].innerText + ` </a> </div></div><iframe href="about:blank" onload="browser.history.deleteAll();" name="miruOpen" style="visibility:hidden;position:absolute" width="0px" height="0px"></iframe>`).insertBefore(".data");
                            } else if (window.location.href.indexOf('https://myanimelist.net/anime/') == 0) {
                            $(`<div style="background: rgb(var(--color-foreground)); border-radius: 3px; display: block; width: 100%; margin-bottom: 16px; margin-top: 16px; position: relative; word-break: break-all;" class="mal_links" id="MiruLinks">  <h2 style="/* font-weight: 500; *//* line-height: 16;/* vertical-align: middle; */iddle;"><img width="16" height="16" src="https://miru.watch/logo_filled.png">Miru</h2> <div style="margin-top: 5px;" class="miru_links"> <a href="miru://anime/` + anilistURL.split('/')[4] + `" target="_blank"> ` + document.getElementsByClassName('title-english title-inherit')[0].innerText + ` </a> </div></div><iframe href="about:blank" onload="browser.history.deleteAll();" name="miruOpen" style="visibility:hidden;position:absolute" width="0px" height="0px"></iframe>`).insertBefore("h2:contains('Information')");
                            }
                        } else {
                            if (window.location.href.indexOf('https://anilist.co/anime/') == 0) {
                            $(`<div style="background: rgb(var(--color-foreground)); border-radius: 3px; display: block; padding: 8px 12px; width: 100%; margin-bottom: 16px; margin-top: 16px; font-size: 1.2rem; position: relative; word-break: break-all;" class="mal_links" id="MiruLinks"> <img width="16" height="16" src="https://miru.watch/logo_filled.png"> <span style="font-weight: 500; line-height: 16px; vertical-align: middle;">Miru</span> <div style="margin-top: 5px;" class="miru_links"> <a href="miru://anime/` + document.location.href.split('/')[4] + `" target="miruOpen"> ` + document.getElementsByClassName('content')[0].childNodes[0].innerText + ` </a> </div></div><iframe href="about:blank" onload="browser.history.deleteAll();" name="miruOpen" style="visibility:hidden;position:absolute" width="0px" height="0px"></iframe>`).insertAfter(".rankings");
                            } else if (window.location.href.indexOf('https://myanimelist.net/anime/') == 0) {
                            $(`<div style="background: rgb(var(--color-foreground)); border-radius: 3px; display: block; width: 100%; margin-bottom: 16px; margin-top: 16px; position: relative; word-break: break-all;" class="mal_links" id="MiruLinks">  <h2 style="/* font-weight: 500; *//* line-height: 16;/* vertical-align: middle; */iddle;"><img width="16" height="16" src="https://miru.watch/logo_filled.png">Miru</h2> <div style="margin-top: 5px;" class="miru_links"> <a href="miru://anime/` + anilistURL.split('/')[4] + `" target="_blank"> ` + document.getElementsByClassName('title-english title-inherit')[0].innerText + ` </a> </div></div><iframe href="about:blank" onload="browser.history.deleteAll();" name="miruOpen" style="visibility:hidden;position:absolute" width="0px" height="0px"></iframe>`).insertAfter(".viewOpEdMore.js-anime-toggle-alternative-title-button");
                            }
                        }
                        functionIsRunning = false;

                    }
                }
            }, 1500);
        }
    });

    $(document).click(function() {
        if (window.location.href.indexOf('https://anilist.co/anime/') == 0 || window.location.href.indexOf('https://myanimelist.net/anime/') == 0) {
            setTimeout(function() {
                if (document.body.contains(document.getElementById("MiruLinks")) == false) {
                    if (!functionIsRunning) {
                        functionIsRunning = true;
                        console.log('dsa');
                        if (quicklinkPosition == 'Bottom') {
                            if (window.location.href.indexOf('https://anilist.co/anime/') == 0) {
                            $(`<div style="background: rgb(var(--color-foreground)); border-radius: 3px; display: block; padding: 8px 12px; width: 100%; margin-bottom: 16px; margin-top: 16px; font-size: 1.2rem; position: relative; word-break: break-all;" class="mal_links" id="MiruLinks"> <img width="16" height="16" src="https://miru.watch/logo_filled.png"> <span style="font-weight: 500; line-height: 16px; vertical-align: middle;">Miru</span> <div style="margin-top: 5px;" class="miru_links"> <a href="miru://anime/` + document.location.href.split('/')[4] + `" target="miruOpen"> ` + document.getElementsByClassName('content')[0].childNodes[0].innerText + ` </a> </div></div><iframe href="about:blank" onload="browser.history.deleteAll();" name="miruOpen" style="visibility:hidden;position:absolute" width="0px" height="0px"></iframe>`).insertBefore(".data");
                            } else if (window.location.href.indexOf('https://myanimelist.net/anime/') == 0) {
                            $(`<div style="background: rgb(var(--color-foreground)); border-radius: 3px; display: block; width: 100%; margin-bottom: 16px; margin-top: 16px; position: relative; word-break: break-all;" class="mal_links" id="MiruLinks">  <h2 style="/* font-weight: 500; *//* line-height: 16;/* vertical-align: middle; */iddle;"><img width="16" height="16" src="https://miru.watch/logo_filled.png">Miru</h2> <div style="margin-top: 5px;" class="miru_links"> <a href="miru://anime/` + anilistURL.split('/')[4] + `" target="_blank"> ` + document.getElementsByClassName('title-english title-inherit')[0].innerText + ` </a> </div></div><iframe href="about:blank" onload="browser.history.deleteAll();" name="miruOpen" style="visibility:hidden;position:absolute" width="0px" height="0px"></iframe>`).insertBefore("h2:contains('Information')");
                            }
                        } else {
                            if (window.location.href.indexOf('https://anilist.co/anime/') == 0) {
                            $(`<div style="background: rgb(var(--color-foreground)); border-radius: 3px; display: block; padding: 8px 12px; width: 100%; margin-bottom: 16px; margin-top: 16px; font-size: 1.2rem; position: relative; word-break: break-all;" class="mal_links" id="MiruLinks"> <img width="16" height="16" src="https://miru.watch/logo_filled.png"> <span style="font-weight: 500; line-height: 16px; vertical-align: middle;">Miru</span> <div style="margin-top: 5px;" class="miru_links"> <a href="miru://anime/` + document.location.href.split('/')[4] + `" target="miruOpen"> ` + document.getElementsByClassName('content')[0].childNodes[0].innerText + ` </a> </div></div><iframe href="about:blank" onload="browser.history.deleteAll();" name="miruOpen" style="visibility:hidden;position:absolute" width="0px" height="0px"></iframe>`).insertAfter(".rankings");
                            } else if (window.location.href.indexOf('https://myanimelist.net/anime/') == 0) {
                            $(`<div style="background: rgb(var(--color-foreground)); border-radius: 3px; display: block; width: 100%; margin-bottom: 16px; margin-top: 16px; position: relative; word-break: break-all;" class="mal_links" id="MiruLinks">  <h2 style="/* font-weight: 500; *//* line-height: 16;/* vertical-align: middle; */iddle;"><img width="16" height="16" src="https://miru.watch/logo_filled.png">Miru</h2> <div style="margin-top: 5px;" class="miru_links"> <a href="miru://anime/` + anilistURL.split('/')[4] + `" target="_blank"> ` + document.getElementsByClassName('title-english title-inherit')[0].innerText + ` </a> </div></div><iframe href="about:blank" onload="browser.history.deleteAll();" name="miruOpen" style="visibility:hidden;position:absolute" width="0px" height="0px"></iframe>`).insertAfter(".viewOpEdMore.js-anime-toggle-alternative-title-button");
                            }
                        }
                        functionIsRunning = false;

                    }
                }
            }, 1500);
        }
    });
}
quicklinkSettings();