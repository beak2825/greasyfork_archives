// ==UserScript==
// @name        Homeunstuck
// @namespace   abrad45
// @description adds homestuck navigation and pages remaining
// @include     http://www.mspaintadventures.com/*
// @include     http://mspaintadventures.com/*
// @require     https://code.jquery.com/jquery-2.2.3.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.1.1/js.cookie.js
// @version     2.0
// @grant       none
// @history     1.0     20121125 - Initial Release
// @history     1.0.1   20121202 - Modified `endings` to include page 7411, End of A6I4
// @history     1.0.2   20121204 - Changed erroneous ending page number of A6I4 from 7441 to 7411
// @history     1.0.3   20130113 - Modified `endings` to include page 7613, End of A6A5A1
// @history     1.0.4   20130414 - Modified `endings` to remove page 7613, and add 7826 and 8135
// @history     1.1     20130415 - Formatting Changes; Enabled Keyboard Navigation with Left/Right Arrows
// @history     1.2     20130421 - Includes "You've not saved since comic ##" notification
// @history     1.3     20160416 - We're back! Formatting, final update to `endings`, jquery version bump and switch from jquery-cookie to js-cookie.
// @history     2.0     20160417 - Comments; Enabled Saving items as favorite pages for reference later. Fixed bugs on pages > 10000

// @downloadURL https://update.greasyfork.org/scripts/18843/Homeunstuck.user.js
// @updateURL https://update.greasyfork.org/scripts/18843/Homeunstuck.meta.js
// ==/UserScript==

$(function () {
    if (/s=6/.test(window.location.search)) {
        var faves = !!localStorage;
        var favoritesLSKey = 'homeunstuck-faves';

        var URL = window.location.search;
        var comic = Number(URL.substr(URL.length - 6));
        var comicNumberLength = String(comic).length
        var urlRoot = URL.substr(0, URL.length - comicNumberLength);
        var firstPage = 1901;
        var lastPage = 10028;

        if (!comic) {
            urlRoot = "?s=6&p=00";
            comic = firstPage;
        }

        var nextURL = '/' + urlRoot + (+comic + 1);
        var prevURL = '/' + urlRoot + (+comic - 1);

        // starting from the top so I can display nothing if there is no end to the current act
        var endings = [
            2147,       // End of Act I
            2658,       // End of Act II
            3053,       // End of Act III
            3257,       // End of Intermission 1
            3888,       // End of Act IV
            4525,       // End of Act V Act I
            6010,       // End of Act V
            6012,       // End of Intermission 2
            6184,       // End of Act VI Act I
            6290,       // End of Act VI Intermission 1
            6566,       // End of Act VI Act II
            6716,       // End of Act VI Intermission 2
            7162,       // End of Act VI Act III
            7337,       // End of Act VI Intermission 3
            7339,       // End of Act VI Act IV
            7411,       // End of Act VI Intermission 4
            7826,       // End of Act VI Act V
            8135,       // End of Act VI Intermission 5
            8177,       // End of Act VI Act VI Act I
            8374,       // End of Act VI Act VI Intermission 1
            8430,       // End of Act VI Act VI Act II
            8752,       // End of Act VI Act VI Intermission 2
            8801,       // End of Act VI Act VI Act III
            8820,       // End of Act VI Act VI Intermission 3
            8843,       // End of Act VI Act VI Act IV
            9308,       // End of Act VI Act VI Intermission 4
            9348,       // End of Act VI Act VI Act V
            9986,       // End of Act VI Act VI Intermission 5
            10026,      // End of Act VI Act VI Act VI
            10028       // End of Act VI
        ];

        // Find out which part of the story we're in
        var currentStorySection = endings.length;
        while(comic < endings[--currentStorySection]) {}
        // We've gone too far. Course correct!
        currentStorySection++;

        // Add `#homeunstuck` for later appending
        $('table[width=600]')
            .first()
            .parent()
                .css('position', 'relative')
                .prepend(
                    $('<div />', {
                        'id': 'homeunstuck',
                        'css': {
                            'position': 'absolute',
                            'left': '35px',
                            'width': '100px',
                        }
                    })
                );

        // Put some arrows (and a favorites icon) in there
        $('#homeunstuck')
            .append(
                $('<a />', {
                    'id': 'homeunstuck-prev',
                    'href': prevURL,
                    'html': '&#8592;',
                    'css': {
                        'margin-right': '10px',
                        'text-decoration': 'none',
                    }
                })
            ).append(
                $('<a />', {
                    'id': 'homeunstuck-next',
                    'href': nextURL,
                    'html': '&#8594;',
                    'css': { 'text-decoration': 'none' }
                })
            );

        // Add in Faves if we can
        if (!!faves) {
            $('#homeunstuck-prev')
                .after(
                    $('<a />', {
                        'id': 'homeunstuck-save',
                        'href': '#',
                        'html': getFavoriteIcon(comic),
                        'css': {
                            'margin-right': '10px',
                            'text-decoration': 'none',
                            'color': 'rgb(0, 0, 238)',
                        }
                    })
                );
        }

        // You're not leaving homestuck with these arrows!
        if (comic === firstPage) {
            $('#homeunstuck-prev').remove();
        } else if(comic === lastPage) {
            $('#homeunstuck-next').remove();
        }

        // Add pages left notice
        if (!isNaN(endings[currentStorySection] - comic)) {
            $('#homeunstuck')
                .append($('<div />', {
                    'text': endings[currentStorySection] - comic + ' left',
                    'id': 'homeunstuck_pages_left'
                })
            );
        }

        // Cache some cookies
        var story = Cookies.get('s_cookie');
        var page = Cookies.get('p_cookie');

        // If you have saved the game, and you're in Homestuck,
        //      and you've not saved in more than 24 pages...
        if (
            !!story &&
            !!page &&
            Number(story) === 6 &&
            (comic - page.substr(-comicNumberLength) > 24)
        ) {
            // Tell the user that they forgot to save!
            $('#homeunstuck').append(
                $('<div />',
                    {
                        'text': "You've not saved since comic " + Cookies.get('p_cookie').substr(-comicNumberLength),
                        'css': {
                            'color': '#900',
                            'font-weight': 'bold'
                        }
                    }
                )
            );
        }

        // Enable keyboard navigation of Homestuck
        $(window).keyup(function (e) {
            if (e.which === 37) {
                window.location = prevURL;          // left
            } else if (e.which === 39) {
                window.location = nextURL;          // right
            } else if (e.which === 70) {
                $('#favorites-toggle').click();     // f (favorites)
            } else if (e.which === 83) {
                $('#homeunstuck-save').click();     // s (save)
            }
        });

        $('#homeunstuck')
            .on('click', '#homeunstuck-save', function (e) {
                e.preventDefault();
                saveFavorite();

                $(this).html(getFavoriteIcon(comic));
                updateFavoritesList();
            }).on('click', '#favorites-toggle', function () {
                var isFavoritesListVisible = !!$('#favorites-list').length;

                $(this).text((isFavoritesListVisible ? "Show" : "Hide") + " Favorites");

                if (!!isFavoritesListVisible) {
                    $('#favorites-list').remove();
                } else {
                    $('#favorites-toggle')
                        .after($('<ol />', {
                            'id': 'favorites-list'
                        })
                    );

                    updateFavoritesList();
                }
            });

        if (!!faves && !!numberOfFavorites()) {
            $('#homeunstuck')
                .after($('<div />', {
                    'id': favoritesLSKey,
                })
                ).append($('<button />', {
                    'id': 'favorites-toggle',
                    'text': 'Show Favorites',
                    'data': {
                        'state': 'hidden'
                    }
                })
            );
        }
    }

    function updateFavoritesList() {
        if (numberOfFavorites()) {
            $('#favorites-list').html('');
            var favorites = getLocalStorage();
            for (var page in favorites) {
                var item = favorites[page];
                $('#favorites-list').append(
                    $('<li />').append($('<a />', {
                        'text': item.comic,
                        'title': item.title,
                        'href': urlRoot + item.comic
                    }))
                );
            }
        }
    }

    function getFavoriteIcon(page) {
        return (!!isFavorite(page) ? '&#9733;' : '&#9734;');
    }

    function getComicTitle() {
        return $('font[size=6]').text().replace('\n', '') || "Error Occurred";
    }

    function saveFavorite() {
        updateLocalStorage(comic, {
            "comic": comic,
            "title": getComicTitle(),
        });
    }

    function updateLocalStorage(page, val) {
        var favorites = getLocalStorage(favoritesLSKey);
        if (!!favorites[page]) {
            // No longer a favorite
            delete favorites[page];
        } else {
            // Add this to favorites
            favorites[page] = val;
        }

        setLocalStorage(favorites);
    }

    function getLocalStorage() {
        return JSON.parse(localStorage.getItem(favoritesLSKey)) || {};
    }

    function isFavorite(page) {
        var favorites = getLocalStorage(favoritesLSKey);

        return !!favorites[page];
    }

    function numberOfFavorites() {
        return Object.keys(getLocalStorage()).length;
    }

    function setLocalStorage(val) {
        localStorage.setItem(favoritesLSKey, JSON.stringify(val));
    }
});
