// ==UserScript==
// @name         What.CD Spotify 
// @namespace    https://greasyfork.org/users/62518
// @description  Add a Spotify link & embedded player to torrents on What.CD
// @version      0.32
// @match        https://what.cd/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/22659/WhatCD%20Spotify.user.js
// @updateURL https://update.greasyfork.org/scripts/22659/WhatCD%20Spotify.meta.js
// ==/UserScript==
// spacepandas edit hack thing, credits to orkyl and aphex80 for all the actual work

var maxSizeCache = 1000;
var stringSimilarityThreshold = 0.6;
localStorage.what = localStorage.what || JSON.stringify([]);

var curColor = GM_getValue("color", "black");
var curPosition = GM_getValue("position", "above");

GM_registerMenuCommand("What.CD Spotify: Switch widget theme colors", function() {
    if (curColor === "black") {
        if(confirm("Switch to white Spotify widget theme?")) {
            GM_setValue("color", "white");
            location.reload();
        }
    } else if (curColor === "white")  {
        if(confirm("Switch to black Spotify widget theme?")) {
            GM_setValue("color", "black");
            location.reload();
        }
    }   
});

GM_registerMenuCommand("What.CD Spotify: Switch widget position relative to artwork", function() {
    if (curPosition === "above") {
        if(confirm("Move the Spotify widget below Album/Artist artwork?")) {
            GM_setValue("position", "below");
            location.reload();
        }
    } else if (curPosition === "below")  {
        if(confirm("Move the Spotify widget above Album/Artist artwork?")) {
            GM_setValue("position", "above");
            location.reload();
        }
    }   
});

function createSpotifyLink(link, imageSource) {
    var a = document.createElement('a');
    a.href = link;
    a.title = 'Listen in Spotify';
    var img = document.createElement('img');
    img.style.border = 'none';
    img.style.marginLeft = '3px';
    img.style.marginRight = '3px';
    img.src = imageSource;
    img.width = 15;
    a.appendChild(img);
    return a;
}

function createSpotifyLinkGreen(link) {
    return createSpotifyLink(link, 'data:image/png;charset=utf-8;base64,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');
}

function createSpotifyLinkBlue(link) {
    return createSpotifyLink(link, 'data:image/png;charset=utf-8;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAACXBIWXMAAAsTAAALEwEAmpwYAAAKnGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iCiAgICAgICAgICAgIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+NzIwMDAwLzEwMDAwPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjAwMDAvMTAwMDA8L3RpZmY6WVJlc29sdXRpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj4zMDA8L2V4aWY6UGl4ZWxYRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpDb2xvclNwYWNlPjY1NTM1PC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj4zMDA8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3BuZzwvZGM6Zm9ybWF0PgogICAgICAgICA8eG1wTU06T3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6OTNkMzUxMGItNTUxNi00ZGVmLTlkZTEtODk4MzJhMDRjYTk1PC94bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpIaXN0b3J5PgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE0IChNYWNpbnRvc2gpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICAgICA8c3RFdnQ6Y2hhbmdlZD4vPC9zdEV2dDpjaGFuZ2VkPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE1LTA1LTA5VDAxOjM5OjQyKzAyOjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjkzZDM1MTBiLTU1MTYtNGRlZi05ZGUxLTg5ODMyYTA0Y2E5NTwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5zYXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE0IChNYWNpbnRvc2gpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICAgICA8c3RFdnQ6Y2hhbmdlZD4vPC9zdEV2dDpjaGFuZ2VkPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE1LTA1LTA5VDAxOjQwOjQ0KzAyOjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjAwZTBhNmVhLWRjOWEtNGMxNi04NzM3LTJkNjYyZDQ0ODY3Mzwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5zYXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgPC9yZGY6U2VxPgogICAgICAgICA8L3htcE1NOkhpc3Rvcnk+CiAgICAgICAgIDx4bXBNTTpJbnN0YW5jZUlEPnhtcC5paWQ6MDBlMGE2ZWEtZGM5YS00YzE2LTg3MzctMmQ2NjJkNDQ4NjczPC94bXBNTTpJbnN0YW5jZUlEPgogICAgICAgICA8eG1wTU06RG9jdW1lbnRJRD5hZG9iZTpkb2NpZDpwaG90b3Nob3A6MDgzODgzNGEtMzY2YS0xMTc4LWI3YTctZTczODljZjUxOTUzPC94bXBNTTpEb2N1bWVudElEPgogICAgICAgICA8eG1wOkNyZWF0ZURhdGU+MjAxNS0wNS0wOFQyMjo1NToxMyswMjowMDwveG1wOkNyZWF0ZURhdGU+CiAgICAgICAgIDx4bXA6TWV0YWRhdGFEYXRlPjIwMTUtMDUtMDlUMDE6NDA6NDQrMDI6MDA8L3htcDpNZXRhZGF0YURhdGU+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDE1LTA1LTA5VDAxOjQwOjQ0KzAyOjAwPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNCAo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');
}

function getCache(key) {
    var list = JSON.parse(localStorage.what);
    var res = null;
    $(list).each(function(i, el) {
        if (el.key === key) {
            res = el.value;
            return false;
        }
    });
    return res;
}

function setCache(o) {
    var list = JSON.parse(localStorage.what);
    if (list.length == maxSizeCache) {
        list.shift();
    }
    list.push(o);
    localStorage.what = JSON.stringify(list);
}

function getSpotifyArtistId(whatArtist, onSuccess) {

    var cachedArtistId = getCache(whatArtist);
    if (cachedArtistId !== null && cachedArtistId !== '') {
        onSuccess(cachedArtistId);
        return;
    }

    var encodedArtist = whatArtist.replace(" ", "+").replace("&", "");
    if (encodedArtist === '') {
        onSuccess('');
        return;
    }

    $.get('https://api.spotify.com/v1/search?q=' + encodedArtist + '&type=artist', function(data) {
        var artists = data.artists.items;
        if (artists !== null && artists.length > 0) {
            var bestArtistId = null;
            var rank = 0;
            $(artists).each(function(i, artist) {
                if (rank < sSimilarity(artist.name.toUpperCase(), whatArtist.toUpperCase())) {
                    rank = sSimilarity(artist.name.toUpperCase(), whatArtist.toUpperCase());
                    bestArtistId = artist.id;
                }
            });
            setCache({ key: whatArtist, value: bestArtistId });
            onSuccess(bestArtistId);
        } else {
            onSuccess('');
        }
    });
}

function getSpotifyArtistAlbums(artistId, onSuccess) {

    $.get('https://api.spotify.com/v1/artists/' + artistId + '/albums?limit=50', function(data) {
        var albumItems = data.items;
        var albums = [];
        $(albumItems).each(function(i, albumItem) {
            albums.push({ name : albumItem.name, id : albumItem.id });
        });
        onSuccess(albums);
    });
}

function getSpotifyArtistAlbumId(artistId, whatAlbum, onSuccess) {

    var cachedAlbumId = getCache(whatAlbum);
    if (cachedAlbumId !== null && cachedAlbumId !== '') {
        onSuccess(cachedAlbumId);
        return;
    }

    $.get('https://api.spotify.com/v1/artists/' + artistId + '/albums', function(data) {
        var albums = data.items;
        var albumId = "";
        if (albums !== null && albums.length > 0) {
            $(albums).each(function(j, album) {
                if (sSimilarity(album.name.toUpperCase(), whatAlbum.toUpperCase()) >= stringSimilarityThreshold) {
                    albumId = album.id;
                    return false;
                }
            });
            setCache({ key: whatAlbum, value: albumId });
            onSuccess(albumId);
        } else {
            onSuccess('');
        }
    });
}

// DOM methods

var dom = {
  id: function (id) { return document.getElementById(id); },
  qs: function (s, p) { return (p || document).querySelector(s); },
  qsa: function (s, p) { return (p || document).querySelectorAll(s); },
  cl: function (cl, p) { return (p || document).getElementsByClassName(cl); },
  tag: function (tag, p) { return (p || document).getElementsByTagName(tag); },
  txt: function (txt) { return document.createTextNode(txt); },
  app: function (parent, var_args) {
    for (var i = 1, il = arguments.length; i < il; ++i) {
      var child = arguments[i];
      if (typeof child == 'string') child = this.txt(child);
      if (child) parent.appendChild(child);
  }
},
mk: function (tag, attr, var_args) {
    var elem = document.createElement(tag);
    if (attr) for (var a in attr) if (attr.hasOwnProperty(a)) elem[a] = attr[a];
    if (arguments.length > 2) {
      var args = Array.prototype.slice.call(arguments, 2);
      args.unshift(elem);
      this.app.apply(this, args);
  }
  return elem;
},
par: function (tag, el) {
    do el = el.parentNode;
    while (el && el.tagName != tag.toUpperCase());
    return el;
}
};

function embedSpotifyPlaylist(id) {
    var themecolor = GM_getValue("color", "black");
    var h = "320"; // height must be at least 80px more than width (minimum: 250px) or the compact player is rendered
    // frameborder & allowtransparency values required to render correctly!

    var url = "https://embed.spotify.com/?uri=" + id + "&theme=" + themecolor;

    var box = dom.mk('div', {className: 'box'},
        dom.mk('div', {className: 'head'},
          dom.mk('strong', null, 'Listen')),
        dom.mk('div', {className: 'player'},
            dom.mk('a', {position: "relative", left: "-16px"},
                dom.mk('p', null,
                    dom.mk('iframe', {src: url, width: "240px", height: h, frameborder: "0", allowtransparency: "true", style: "border:none;"})))));

    var elem = dom.cl('box')[0];

    if(GM_getValue("position", "above") === "above") {
        elem.parentNode.insertBefore(box, elem);
    } else {
        if(dom.cl('box_image')[0] === null) {
            elem.parentNode.insertBefore(box, elem);
        }
        elem.appendChild(box);
    }

}


/*************************************/
/************* Top 10 ****************/
/*************************************/
if (window.location.href.indexOf('top10.php') > -1) {
    var processTable = function (table) {
        var groups = $('div.group_info', table);
        $(groups).each(function(i, group) {
            var whatArtist = $(group).find('a[href*="artist.php"]')[0];
            var whatAlbum = $(group).find('a[href*="torrents.php?id"]')[0];
            whatAlbum = $(whatAlbum).text();
            whatArtist = $(whatArtist).text();

            getSpotifyArtistId(whatArtist, function(artistId) {
                if (artistId !== '' && artistId !== undefined) {
                    getSpotifyArtistAlbumId(artistId, whatAlbum, function(albumId) {
                        var a = null;
                        if (albumId !== '') {
                            a = createSpotifyLinkGreen('spotify:album:' + albumId);
                        } else {
                            a = createSpotifyLinkBlue('spotify:artist:' + artistId);
                        }
                        $(group).prepend(a);
                    });
                }
            });
        });
    };

    $('.torrent_table').each(function () { processTable(this); });

    new MutationObserver(function (mutes) {
        mutes.forEach(function (m) {
            $(m.addedNodes).each(function () {
                if (this.nodeName == 'TABLE') processTable(this);
            });
        });
    }).observe(document.querySelector('.thin'), { childList: true });
}

/*************************************/
/*********** Artist page *************/
/*************************************/
if (window.location.href.indexOf('artist.php') > -1) {
    var whatArtist = $('h2').text();
    getSpotifyArtistId(whatArtist, function(artistId) {
        if (artistId !== '' && artistId !== undefined) {
            var a = createSpotifyLinkBlue('spotify:artist:' + artistId);
            $('h2').append(a);
            embedSpotifyPlaylist('spotify:artist:' + artistId); 
            
            getSpotifyArtistAlbums(artistId, function(albums) {
                var groups = $('#torrents_album, #torrents_ep').find('div.group_info');
                $(groups).each(function(i, group) {
                    var whatAlbum = $(group).find('a[href*="torrents.php?id"]')[0];
                    whatAlbum = $(whatAlbum).text();
                    var album = $.grep(albums, function(album) {
                        return sSimilarity(album.name.toUpperCase(), whatAlbum.toUpperCase()) >= stringSimilarityThreshold;
                    });
                    if (album.length > 0) {
                        setCache({ key: whatAlbum, value: album[0].id });
                        var a = createSpotifyLinkGreen('spotify:album:' + album[0].id);
                        $(group).prepend(a);
                    }
                });
            });
        }
    });
}

/*************************************/
/*********** Torrent page ************/
/*************************************/
if (window.location.href.indexOf('torrents.php?id') > -1) {
    var whatArtist = $('h2 > a').text();
    var whatAlbum = $('h2 > span').text();

    getSpotifyArtistId(whatArtist, function(artistId) {
        if (artistId !== '' && artistId !== undefined) {
            getSpotifyArtistAlbumId(artistId, whatAlbum, function(albumId) {
                var a = null;
                if (albumId !== '') {
                    a = createSpotifyLinkGreen('spotify:album:' + albumId);
                    embedSpotifyPlaylist('spotify:album:' + albumId);
                } else {
                    a = createSpotifyLinkBlue('spotify:artist:' + artistId);
                }
                $('h2').append(a);
            });
        }
    });
}

/*************************************/
/******* Bookmark artist page ********/
/*************************************/
if (window.location.href.indexOf('bookmarks.php?type=artists') > -1) {
    var tds = $('.artist_table').find('.rowa, .rowb').find('td');
    var artists = $('.artist_table').find('a[href*="artist.php?id"]');
    $(artists).each(function(i, artistElement) {
        artist = $(artistElement).text();
        getSpotifyArtistId(artist, function(artistId) {
            if (artistId !== '') {
                var a = createSpotifyLinkGreen('spotify:artist:' + artistId);
                var x = $('div.group_info')[i];
                $(tds[i]).prepend(a);
            } 
        });
    });
}

/*************************************/
/******* Bookmark torrent page *******/
/*************************************/
if (window.location.href.indexOf('bookmarks.php?type=torrents') > -1) {
    var groups = $('.group');
    $(groups).each(function(i, group) {
        var whatArtistElement = $(group).find('a[href*="artist.php"]')[0];
        var whatAlbumElement = $(group).find('a[href*="torrents.php?id"]')[0];
        whatAlbum = $(whatAlbumElement).text();
        whatArtist = $(whatArtistElement).text();

        getSpotifyArtistId(whatArtist, function(artistId) {
            if (artistId !== '' && artistId !== undefined) {
                getSpotifyArtistAlbumId(artistId, whatAlbum, function(albumId) {
                    var a = null;
                    if (albumId !== '') {
                        a = createSpotifyLinkGreen('spotify:album:' + albumId);
                    } else {
                        a = createSpotifyLinkBlue('spotify:artist:' + artistId);
                    }
                    $(whatArtistElement).before(a);
                });
            }
        });
    });
}

var sSimilarity = function(sa1, sa2){
    // Compare two strings to see how similar they are.
    // Answer is returned as a value from 0 - 1
    // 1 indicates a perfect similarity (100%) while 0 indicates no similarity (0%)
    // Algorithm is set up to closely mimic the mathematical formula from
    // the article describing the algorithm, for clarity. 
    // Algorithm source site: http://www.catalysoft.com/articles/StrikeAMatch.html
    // (Most specifically the slightly cryptic variable names were written as such
    // to mirror the mathematical implementation on the source site)
    //
    // 2014-04-03
    // Found out that the algorithm is an implementation of the Sørensen–Dice coefficient [1]
    // [1] http://en.wikipedia.org/wiki/S%C3%B8rensen%E2%80%93Dice_coefficient
    //
    // The algorithm is an n-gram comparison of bigrams of characters in a string


    // for my purposes, comparison should not check case or whitespace
    var s1 = sa1.replace(/\s/g, "").toLowerCase();
    var s2 = sa2.replace(/\s/g, "").toLowerCase();

    function intersect(arr1, arr2) {
        // I didn't write this.  I'd like to come back sometime
        // and write my own intersection algorithm.  This one seems
        // clean and fast, though.  Going to try to find out where
        // I got it for attribution.  Not sure right now.
        var r = [], o = {}, l = arr2.length, i, v;
        for (i = 0; i < l; i++) {
            o[arr2[i]] = true;
        }
        l = arr1.length;
        for (i = 0; i < l; i++) {
            v = arr1[i];
            if (v in o) {
                r.push(v);
            }
        }
        return r;
    }

    var pairs = function(s){
        // Get an array of all pairs of adjacent letters in a string
        var pairs = [];
        for(var i = 0; i < s.length - 1; i++){
            pairs[i] = s.slice(i, i+2);
        }
        return pairs;
    };

    //console.log(intersect(pairs(s1), pairs(s2)))
    var similarity_num = 2 * intersect(pairs(s1), pairs(s2)).length;
    var similarity_den = pairs(s1).length + pairs(s2).length;
    var similarity = similarity_num / similarity_den;
    return similarity;
};