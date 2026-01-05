// ==UserScript==
// @name           Hype Machine direct download links
// @author         @tonyskn @obmas @blissofbeing @nitrocode
// @version        0.2.7
// @description    Add download links next to tracks on The Hype Machine.
// @include        http://hypem.com/*
// @require        https://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js
// @namespace https://greasyfork.org/users/128110
// @downloadURL https://update.greasyfork.org/scripts/30114/Hype%20Machine%20direct%20download%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/30114/Hype%20Machine%20direct%20download%20links.meta.js
// ==/UserScript==
// Add "Download" link next to songs on the HypeMachine ( http://hypem.com )
// Latest version at: https://github.com/nitrocode/hypem-userscript

function main(){
    var seen = [];

    /**
     * Adds links to each Hype Machine song
     * No parameters
     * Nothing to return
     */
    function addLinks() {
        if (typeof displayList !== "undefined") {
            var TrackList = displayList.tracks;
            // if the TrackList is undefined, re-run the function in 1 sec
            if (TrackList === undefined || TrackList.length < 1) {
                setTimeout(addLinks, 1000);
            } else {
                // should get an array of 20 songs
                var tracks = $('div.section-player');
                tracks.each(function(index, element) {
                    // Check if this particular element has already been processed through a previous call
                    if (!$(element).find('a#download').length) {
                        var trackKey = TrackList[index].key;
                        if (seen.indexOf(trackKey) === -1) {
                            seen.push(trackKey);
                            var trackId = TrackList[index].id;
                            var trackArtist = TrackList[index].artist;
                            var trackSong = TrackList[index].song;
                            var trackTitle = trackArtist + " - " + trackSong;
                            // this url gets the actual music file location
                            var urlFileLoc = "/serve/source/" + trackId + "/" + trackKey;
                            $.getJSON(urlFileLoc, function(data) {
                                // add a new <li><a> tag to ui.tools
                                $('<li>').append(
                                    $('<a>', {
                                        'href': data['url'],
                                        'style': 'font-family: machine_bitsregular; font-size: 20px; float: right; position: absolute; right: -15px; top: 10px;',
                                        'title': trackTitle,
                                        'id': 'download',
                                        'target': "_blank",
                                        // this doesn't work due to cross origin...
                                        'download': trackTitle + '.mp3',
                                        // This shows the download icon using hype's machine_bitsregular font
                                        'text': 'H'
                                    })
                                ).appendTo($(element).find('ul.tools'));
                                console.log('Added download link to: ' + trackTitle);
                            });
                        }
                        index++;
                    }
                });
                $(".section.same .tools").css('top','29px');
            }
        }
    }

    // Display links after an Ajax update is complete
    if (typeof jQuery === "function") {
        $(document).ajaxComplete(function() {
            addLinks();
        });
    }
}

// inject script
var script = document.createElement('script');
script.appendChild(document.createTextNode('(' + main + ')();'));
(document.body || document.head || document.documentElement).appendChild(script);
