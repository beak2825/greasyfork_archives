// ==UserScript==
// @name           IMDb Scout
// @namespace      https://greasyfork.org/users/1057-kannibalox
// @description    Add links from IMDb pages to torrent sites -- easy downloading from IMDb
//
// Preference window for userscripts, hosted by greasyfork:
// @require     https://greasyfork.org/libraries/GM_config/20131122/GM_config.js
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
//
// @version        4.3.12
// @include        http://*.imdb.tld/title/tt*
// @include        http://*.imdb.tld/search/title*
//
// @connect      *
// @grant        GM_log
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
//
// @downloadURL https://update.greasyfork.org/scripts/27526/IMDb%20Scout.user.js
// @updateURL https://update.greasyfork.org/scripts/27526/IMDb%20Scout.meta.js
// ==/UserScript==

if (window.top != window.self) // Don't run on frames or iframes
{
    return;
}

//------------------------------------------------------
// A list of all the sites, and the data necessary to
// check IMDb against them.
// Each site is a dictionary with the following attributes:
//  - name:
//      The site name, abbreviated
//  - searchUrl:
//      The URL to perform the search against, see below for how
//      to tailor the string to a site
//  - matchRegex:
//      The string which appears if the searchUrl *doesn't* return a result
//  - postiveMatch:
//      Changes the test to return true if the searchUrl *does* return
//      a result that matches matchRegex
//  - TV (optional):
//      If true, it means that this site will only show up on TV pages.
//      By default, sites only show up on movie pages.
//  - both (optional):
//      Means that the site will show up on both movie and TV pages
//  - spaceEncode (optional):
//      Changes the character used to encode spaces in movie titles
//      The default is '+'.
//  - goToUrl (optional):
//      Most of the time the same URLs that are used for checking are
//      the ones that are used to actually get to the movie,
//      but this allows overriding that.
//  - loggedOutRegex (optional):
//      If any text on the page matches this regex, the site is treated
//      as being logged out, rather than mising the movie. This option is
//      not effected by postiveMatch.
// To create a search URL, there are four parameters
// you can use inside the URL:
//  - %tt%:
//      The IMDb id with the tt prefix (e.g. tt0055630)
//  - %nott%:
//      The IMDb id without the tt prefix (e.g. 0055630)
//  - %search_string%:
//      The movie title (e.g. Yojimbo)
//  - %year%:
//      The movie year (e.g. 1961)
// See below for examples
//------------------------------------------------------

var sites = [
{   'name': 'ExtraTorrent',
    'searchUrl': 'https://extratorrent.cc/search/?search=%search_string%+%year%',
    'matchRegex': /total <b>0<\/b> torrents found/},
{   'name': 'PHD',
    'searchUrl': 'https://privatehd.to/movies?search=&imdb=%tt%',
    'matchRegex': /class="overlay-container"/,
    'positiveMatch': true},
{   'name': 'PHD',
    'searchUrl': 'https://privatehd.to/tv-shows?search=&imdb=%tt%',
    'matchRegex': /class="overlay-container"/,
    'positiveMatch': true,
    'TV': true},
{   'name': 'RARBG',
    'searchUrl': 'https://rarbg.to/torrents.php?imdb=%tt%',
    'matchRegex': '//dyncdn.me/static/20/images/imdb_thumb.gif',
    'positiveMatch': true,
    'both': true},
{   'name': 'RuT',
    'searchUrl': 'http://rutracker.org/forum/tracker.php?nm=%search_string%+%year%',
    'matchRegex': 'Не найдено',
    'both': true},
{   'name': 'TPB',
    'searchUrl': 'https://thepiratebay.se/search/%tt%',
    'matchRegex': /No hits. Try adding an asterisk in you search phrase.<\/h2>/,
    'both': true},
];

var icon_sites = [
{   'name': 'OpenSubtitles',
    'searchUrl': 'http://www.opensubtitles.org/en/search/imdbid-%tt%'},
{   'name': 'YouTube.com',
    'searchUrl': 'https://www.youtube.com/results?search_query="%search_string%"+%year%+trailer'},
{   'name': 'Rotten Tomatoes',
    'searchUrl': 'https://www.rottentomatoes.com/search/?search=%search_string%'},
{   'name': 'Subscene',
    'searchUrl': 'http://subscene.com/subtitles/title?q=%search_string%'},
{   'name': 'Wikipedia',
    'searchUrl': 'https://en.wikipedia.org/w/index.php?search=%search_string%&go=Go'},
{   'name': 'Can I Stream.It? (Movie)',
    'searchUrl': 'http://www.canistream.it/search/movie/%search_string%',
    'showByDefault': true},
{   'name': 'Can I Stream.It? (TV)',
    'searchUrl': 'http://www.canistream.it/search/tv/%search_string%',
    'showByDefault': true},
{   'name': 'Amazon',
    'searchUrl': 'http://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Dmovies-tv&field-keywords=%search_string%',
    'showByDefault': true},
{   'name': 'Netflix',
    'searchUrl': 'http://www.netflix.com/search/%search_string%',
    'showByDefault': true},
];

// For internal use (order matters)
var valid_states = [
    'found',
    'missing',
    'logged_out',
    'error'
]

function replaceSearchUrlParams(site, movie_id, movie_title) {
    var search_url = site['searchUrl']
    // If an array, do a little bit of recursion
    if ($.isArray(search_url)) {
        var search_array = [];
        $.each(search_url, function(index, url) {
            search_array[index] = replaceSearchUrlParams(url, movie_id, movie_title);
        });
        return search_array;
    }
    var space_replace = ('spaceEncode' in site) ? site['spaceEncode'] : '+'
    var search_string = movie_title.replace(/ +\(.*/, '').replace(/[^a-zA-Z0-9]/g, ' ').replace(/ +/g, space_replace);
    var movie_year = document.title.replace(/^(.+) \((.*)([0-9]{4})(.*)$/gi, '$3');
    return search_url.replace(/%tt%/g, 'tt' + movie_id)
                     .replace(/%nott%/g, movie_id)
                     .replace(/%search_string%/g, search_string)
                     .replace(/%year%/g, movie_year);
}

function getPageSetting(key) {
    return (onSearchPage ? GM_config.get(key + '_search') : GM_config.get(key + '_movie'))
}

// Small utility function to return a site's icon
function getFavicon(site, hide_on_err) {
    if (typeof(hide_on_err) === 'undefined') hide_on_err = false;
    if ('icon' in site) {
        var favicon = site['icon'];
    } else {
        var url = new URL(site['searchUrl'])
        var favicon = url.origin + '\/favicon.ico';
    }
    var img = $('<img />').attr({'style': '-moz-opacity: 0.4; border: 0; vertical-align: text-top',
                             'width': '16',
                             'src': favicon,
                             'title': site['name'],
                             'alt': site['name']});
    if (hide_on_err) img.attr('onerror', "this.style.display='none';");
    return img;
}

// Adds search links to an element
// state should always be one of the values defined in valid_states
function addLink(elem, link_text, target, site, state) {
    var link = $('<a />').attr('href', target).attr('target', '_blank');
    if ($.inArray(state, valid_states) < 0) {
        console.log("Unknown state " + state);
    }
    if (getPageSetting('use_icons')) {
        var icon = getFavicon(site);
        icon.css({'border-width': '3px', 'border-style': 'solid', 'border-radius': '2px'});
        if (state == 'error' || state == 'logged_out') {
            icon.css('border-color', 'red');
        } else if (state == 'missing') {
            icon.css('border-color', 'yellow');
        } else {
            icon.css('border-color', 'green');
        }
        link.append(icon);
    } else {
        if (state == 'missing' || state == 'error' || state == 'logged_out') {
            link.append($('<s />').append(link_text));
        } else {
            link.append(link_text);
        }
        if (state == 'error' || state == 'logged_out') {
            link.css('color', 'red');
        }
    }

    if (!onSearchPage) {
        $('#imdbscout_' + state).append(link).append(' ');
    } else {
        var result_box = $(elem).find('td.result_box');
        if (result_box.length > 0) {
            $(result_box).append(link);
        } else {
            $(elem).append($('<td />').append(link).addClass('result_box'));
        }
    }
}

// Performs an ajax request to determine
// whether or not a url should be displayed
function maybeAddLink(elem, link_text, search_url, site) {
    // If the search URL is an array, recurse briefly on the elements.
    if ($.isArray(search_url)) {
        $.each(search_url, function(index, url) {
            maybeAddLink(elem, link_text + '_' + (index + 1).toString(), url, site);
        });
        return;
    }
    var target = site['goToUrl'];
    var success_match = ('positiveMatch' in site) ? site['positiveMatch'] : false;
    GM_xmlhttpRequest({
        method: 'GET',
        url: search_url,
        onload: function(response_details) {
            if (String(response_details.responseText).match(site['matchRegex']) ? !(success_match) : success_match) {
                if (!getPageSetting('hide_missing')) {
                    addLink(elem, link_text, target, site, 'missing');
                }
            } else if (site['loggedOutRegex'] && String(response_details.responseText).match(site['loggedOutRegex'])) {
                    addLink(elem, link_text, target, site, 'logged_out');
            } else {
                addLink(elem, link_text, target, site, 'found');
            }
        },
	onerror: function(response) {
            addLink(elem, link_text, target, site, 'error');
	},
	onabort: function(response) {
            addLink(elem, link_text, target, site, 'error');
	}
    });
}

// Run code to create fields and display sites
function perform(elem, movie_id, movie_title, is_tv, is_movie) {
    var site_shown = false;
    $.each(sites, function(index, site) {
        if (site['show']) {
            site_shown = true;
            // If we're on a TV page, only show TV links.
            if ((Boolean(site['TV']) == is_tv ||
                 Boolean(site['both'])) ||
                (!is_tv && !is_movie)) {
                searchUrl = replaceSearchUrlParams(site, movie_id, movie_title);
                // Ugly hack
                if ('goToUrl' in site) {
                    site['goToUrl'] = replaceSearchUrlParams({
                        'searchUrl': site['goToUrl'],
                        'spaceEncode': ('spaceEncode' in site) ? site['spaceEncode'] : '+'
                    }, movie_id, movie_title);
                } else {
                    site['goToUrl'] = searchUrl;
                }
                if (getPageSetting('call_http')) {
                    maybeAddLink(elem, site['name'], searchUrl, site);
                } else {
                    addLink(elem, site['name'], searchUrl, site, 'found');
                }
            }
        }
    });
    if (!site_shown) {
         $(elem).append('No sites enabled! You can change this via the Greasemonkey option "IMDb Scout Preferences".');
    }
}

//------------------------------------------------------
// Button Code
//------------------------------------------------------

function displayButton() {
    var p = $('<p />').attr('id', 'imdbscout_button');
    p.append($('<button>Load IMDb Scout</button>').click(function() {
        $('#imdbscout_button').remove();
        if (onSearchPage) {
            performSearch();
        } else {
            performPage();
        }
    }));
    if (onSearchPage) {
        $('#sidebar').append(p);
    } else if ($('h1.header:first').length) {
        $('h1.header:first').parent().append(p);
    } else {
        $('#title-overview-widget').parent().append(p);
    }
}

//------------------------------------------------------
// Icons at top bar
//------------------------------------------------------

// Adds a dictionary of icons to the top of the page.
// Unlike the other URLs, they aren't checked to see if the movie exists.
function addIconBar(movie_id, movie_title) {
    if ($('h1.header:first').length) {
        var iconbar = $('h1.header:first').append($('<br/>'));
    } else if ($('.title_wrapper h1')) {
        var iconbar = $('.title_wrapper h1').append($('<br/>'));
    } else {
        var iconbar = $('#tn15title .title-extra');
    }
    $.each(icon_sites, function(index, site) {
        if (site['show']) {
            var search_url = replaceSearchUrlParams(site, movie_id, movie_title);
            var image = getFavicon(site);
            var html = $('<span />').append($('<a />').attr('href', search_url)
                        .addClass('iconbar_icon').append(image));
            iconbar.append(html).append(' ');
        }
    });
    //If we have access to the openInTab function, add an Open All feature
    if (GM_openInTab) {
        var aopenall = $('<a />').text('Open All')
                                 .attr('href', 'javascript:;')
                                 .attr('style', 'font-weight:bold;font-size:10px;font-family: Calibri, Verdana, Arial, Helvetica, sans-serif;');
        aopenall.click(function() {
            $('.iconbar_icon').each(function() {
                GM_openInTab($(this).attr('href'));
            });
        }, false);
        iconbar.append(aopenall);
    }
}

//------------------------------------------------------
// Search page code
//------------------------------------------------------

function performSearch() {
    //Add css for the new table cells we're going to add
    var styles = '.result_box {width: 335px}';
        styles += ' .result_box a { margin-right: 5px; color: #444;} ';
        styles += ' .result_box a:visited { color: #551A8B; }';
        styles += ' #content-2-wide #main, #content-2-wide';
        styles += ' .maindetails_center {margin-left: 5px; width: 1001px;} ';
    GM_addStyle(styles);

    //Loop through each result row
    $('div#main table.results tr.detailed').each(function() {
        var link = $(this).find('.title>a');
        var is_tv = Boolean($(this).find('.year_type').html()
                            .match('TV Series'));
        var is_movie = Boolean($(this).find('.year_type').html()
                               .match(/\(([0-9]*)\)/));
        var movie_title = link.html();
        var movie_id = link.attr('href').match(/tt([0-9]*)\/?$/)[1];

        $(this).find('span.genre a').each(function() {
            if ($(this).html() == 'Adult') {
                $(this).parent().parent().parent()
                    .css('background-color', 'red');
            }
        });
        perform($(this), movie_id, movie_title, is_tv, is_movie);
    });
}

//------------------------------------------------------
// TV/movie page code
//------------------------------------------------------

function performPage() {
    var movie_title = $('title').text().match(/^(.*?) \(/)[1];
    var movie_id = document.URL.match(/\/tt([0-9]+)\//)[1].trim('tt');
    var is_tv_page = Boolean($('title').text().match('TV Series')) ||
        Boolean($('.tv-extra').length);
    var is_movie_page = Boolean($('title').text().match(/.*? \(([0-9]*)\)/));
    //Create area to put links in
    perform(getLinkArea(), movie_id, movie_title,
            is_tv_page, is_movie_page);
    addIconBar(movie_id, movie_title);
}

//------------------------------------------------------
// Find/create elements
//------------------------------------------------------

function getLinkArea() {
    // If it already exists, just return it
    if ($('#imdbscout_header').length) {
        return $('#imdbscout_header');
    }
    var p = $('<p />').append('<h2>' + GM_config.get('imdbscout_header_text') + '</h2>').attr('id', 'imdbscout_header').css({
        'padding': '0px 20px',
        'font-weight': 'bold'
    });
    $.each(valid_states, function(i, name) {
        if (GM_config.get('one_line')) {
            p.append($('<span />').attr('id', 'imdbscout_' + name));
        } else {
            var title = $('<span>' + name.replace('_', ' ') + ': </span>').css({
                'textTransform': 'capitalize',
                'min-width': '100px',
                'display': 'inline-block'
            });
            p.append($('<div />').attr('id', 'imdbscout_' + name).append(title));
        }
    });
    if ($('h1.header:first').length) {
        $('h1.header:first').parent().append(p);
    } else if ($('#title-overview-widget').length) {
        $('#title-overview-widget').parent().append(p);
    } else {
        $('#tn15rating').before(p);
    }
    return $('#imdbscout_header');
}

//------------------------------------------------------
// Code being run (main)
//------------------------------------------------------

// Get everything configured

// Create the non-site dictionary for GM_config
var config_fields = {
    'imdbscout_header_text': {
        'label': 'Header text:',
        'type': 'text',
        'default': 'Pirate this film: '
    },
    'call_http_movie': {
        'section': 'Movie Page:',
        'type': 'checkbox',
        'label': 'Actually check for torrents?',
        'default': true
    },
    'load_on_start_movie': {
        'type': 'checkbox',
        'label': 'Load on start?',
        'default': true
    },
    'hide_missing_movie': {
        'type': 'checkbox',
        'label': 'Hide missing links?',
        'default': false
    },
    'use_icons_movie': {
        'type': 'checkbox',
        'label': 'Use icons instead of text?',
        'default': false
    },
    'one_line': {
        'type': 'checkbox',
        'label': 'Show results on one line?',
        'default': true
    },
    'call_http_search': {
        'section': 'Search Page:',
        'type': 'checkbox',
        'label': 'Actually check for torrents?',
        'default': true
    },
    'load_on_start_search': {
        'type': 'checkbox',
        'label': 'Load on start?',
        'default': true
    },
    'hide_missing_search': {
        'type': 'checkbox',
        'label': 'Hide missing links?',
        'default': false
    },
    'use_icons_search': {
        'type': 'checkbox',
        'label': 'Use icons instead of text?',
        'default': false
    }
};

// Add each site to a GM_config dictionary schema
// The GM_config default for checkboxes is false
$.each(sites, function(index, site) {
        config_fields['show_' + site['name'] + (site['TV'] ? '_TV' : '')] = {
            'section': (index == 0) ? ['Torrents:'] : '',
            'type': 'checkbox',
            'label': ' ' + site['name'] + (site['TV'] ? ' (TV)' : '')
        };
});

// Icon sites should be shown by default though,
// since they barely use any resources.
$.each(icon_sites, function(index, icon_site) {
    config_fields['show_icon_' + icon_site['name']] = {
        'section': (index == 0) ? ['Other sites:'] : '',
        'type': 'checkbox',
        'label': ' ' + icon_site['name'],
        'default': ('showByDefault' in icon_site) ?
            icon_site['showByDefault'] : true
    };
});

// Initialize and register GM_config
GM_config.init({
    'id': 'imdb_scout',
    'title': 'IMDb Scout Preferences',
    'fields': config_fields,
    'css':  '.section_header { \
                background: white   !important; \
                color:  black       !important; \
                border: 0px         !important; \
                text-align: left    !important;} \
             .field_label { \
                font-weight: normal !important;}',
    'events':
    {
        'open': function() {
            $('#imdb_scout').contents().find('#imdb_scout_section_2').find('.field_label').each(function(index, label) {
                url = new URL(sites[index].searchUrl);
                $(label).append(' ' + '<a class="grey_link" target="_blank" style="color: gray; text-decoration : none" href="' + url.origin + '">'
                + (/www./.test(url.hostname) ? url.hostname.match(/www.(.*)/)[1] : url.hostname)  + '</a>');
                $(label).prepend(getFavicon(sites[index], true));
            });
            $('#imdb_scout').contents().find('#imdb_scout_section_3').find('.field_label').each(function(index, label) {
                $(label).prepend(getFavicon(icon_sites[index], true));
            });
        }
    }
});
GM_registerMenuCommand('IMDb Scout Preferences', function() {GM_config.open()});

// Fetch per-site values from GM_config
$.each(sites, function(index, site) {
    site['show'] = GM_config.get('show_' + site['name'] +
                                 (site['TV'] ? '_TV' : ''));
});

$.each(icon_sites, function(index, icon_site) {
    icon_site['show'] = GM_config.get('show_icon_' + icon_site['name']);
});

// Are we on a search page?
// This variable is camelCased to show it's global
// Hopefully it can be factored out of the global scope in the future
var onSearchPage = Boolean(location.href.match('search'));

$('title').ready(function() {
if (!onSearchPage && GM_config.get('load_on_start_movie')) {
        performPage();
} else if (onSearchPage && GM_config.get('load_on_start_search')) {
        performSearch();
} else {
    displayButton();
}
});
