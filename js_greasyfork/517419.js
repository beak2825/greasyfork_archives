// ==UserScript==
// @name         AO3: Translation Logic
// @namespace    https://greasyfork.org/en/users/906106-escctrl
// @description	 provides logic that can be used in other scripts which have the translation phrases
// @history      0.2 some fixes in the translations
// @history      0.1 initial version of the first few pages
// @author       escctrl
// @version      0.2
// @match        https://archiveofourown.org/*
// @license      MIT
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/517419/AO3%3A%20Translation%20Logic.user.js
// @updateURL https://update.greasyfork.org/scripts/517419/AO3%3A%20Translation%20Logic.meta.js
// ==/UserScript==

/* eslint-disable no-multi-spaces */
/* global jQuery */

(function($) {
    'use strict';

    const fields = {
        //  [0] = original display text of the field (or some unique descriptor)
        //  [1] = [0] function name to find element
        //        [1] array of parameters to give that function
        //  [2] = [0] function name to replace text in that element
        //        [1] (array of) parameter(s) to give that function
        menu: [
            ["Fandom",                             ["getByUrl", ['/menu/fandoms']],                                       ['setText'] ],
            ["All Fandoms",                        ["getByUrl", ['/media', '$']],                                         ['setText'] ],
            ["Anime & Manga",                      ["getBySelect", ['li#medium_5 a']],                                    ['setText'] ],
            ["Books & Literature",                 ["getBySelect", ['li#medium_3 a']],                                    ['setText'] ],
            ["Cartoons & Comics & Graphic Novels", ["getBySelect", ['li#medium_4 a']],                                    ['setText'] ],
            ["Celebrities & Real People",          ["getBySelect", ['li#medium_7 a']],                                    ['setText'] ],
            ["Movies",                             ["getBySelect", ['li#medium_2 a']],                                    ['setText'] ],
            ["Music & Bands",                      ["getBySelect", ['li#medium_6 a']],                                    ['setText'] ],
            ["Other Media",                        ["getBySelect", ['li#medium_8 a']],                                    ['setText'] ],
            ["Theater",                            ["getBySelect", ['li#medium_30198 a']],                                ['setText'] ],
            ["TV Shows",                           ["getBySelect", ['li#medium_1 a']],                                    ['setText'] ],
            ["Video Games",                        ["getBySelect", ['li#medium_476 a']],                                  ['setText'] ],
            ["Uncategorized Fandoms",              ["getBySelect", ['li#medium_9971 a']],                                 ['setText'] ],
            ["Browse",                             ["getByUrl", ['/menu/browse']],                                        ['setText'] ],
            ["Works",                              ["getByUrl", ['/works', '$', 'ul.primary.navigation']],                ['setText'] ],
            ["Bookmarks",                          ["getByUrl", ['/bookmarks', '$', 'ul.primary.navigation' ]],           ['setText'] ],
            ["Tags",                               ["getByUrl", ['/tags', '$', 'ul.primary.navigation']],                 ['setText'] ],
            ["Collections",                        ["getByUrl", ['/collections', '$', 'ul.primary.navigation']],          ['setText'] ],
            ["Search",                             ["getByUrl", ['/menu/search']],                                        ['setText'] ],
            ["Works",                              ["getByUrl", ['/works/search', '$']],                                  ['setText'] ],
            ["Bookmarks",                          ["getByUrl", ['/bookmarks/search', '$']],                              ['setText'] ],
            ["Tags",                               ["getByUrl", ['/tags/search', '$']],                                   ['setText'] ],
            ["People",                             ["getByUrl", ['/people/search', '$' ]],                                ['setText'] ],
            ["About",                              ["getByUrl", ['/menu/about']],                                         ['setText'] ],
            ["About Us",                           ["getByUrl", ['/about', '']],                                          ['setText'] ],
            ["News",                               ["getByUrl", ['/admin_posts', '$']],                                   ['setText'] ],
            ["FAQ",                                ["getByUrl", ['/faq', '$']],                                           ['setText'] ],
            ["Wrangling Guidelines",               ["getByUrl", ['/wrangling_guidelines', '$']],                          ['setText'] ],
            ["Donate or Volunteer",                ["getByUrl", ['/donate', '$']],                                        ['setText'] ],
            ["Log In",                             ["getByUrl", ['/users/login', '*']],                                   ['setText'] ],
            ["Log Out",                            ["getByUrl", ['/users/logout', '*']],                                  ['setText'] ],
            ["User name or email",                 ["getBySelect", ['label[for="user_session_login_small"]']],            ['setText'] ],
            ["Password",                           ["getBySelect", ['label[for="user_session_password_small"]']],         ['setText'] ],
            ["Remember me",                        ["getBySelect", ['label[for="user_remember_me_small"]']],              ['setText', new RegExp(/Remember Me$/)] ],
            ["Forgot password",                    ["getByUrl", ['/users/password/new', '$']],                            ['setText'] ],
            ["Get an invitation",                  ["getByUrl", ['/invite_requests', '$']],                               ['setText'] ],
            ["Log In",                             ["getBySelect", ['form#new_user_session_small input[type="submit"]']], ['setAttr', 'value'] ],
            ["Search Button",                      ["getBySelect", ['form#search input.button']],                         ['setAttr', 'value'] ],
        ],
        greeting: [
            ["Hi",               ["getChild", [0, '> a']],                                  ['setText', new RegExp(/^Hi/)] ],
            ["My Dashboard",     ["getChild", [0, 'ul.dropdown-menu li:nth-of-type(1) a']], ['setText'] ],
            ["My Subscriptions", ["getByUrl", ['/subscriptions', '$']],                     ['setText'] ],
            ["My Works",         ["getByUrl", ['/works', '$']],                             ['setText'] ],
            ["My Bookmarks",     ["getByUrl", ['/bookmarks', '$']],                         ['setText'] ],
            ["My History",       ["getByUrl", ['/readings', '$']],                          ['setText'] ],
            ["My Preferences",   ["getByUrl", ['/preferences', '$']],                       ['setText'] ],
            ["Post",             ["getChild", [1, '> a']],                                  ['setText'] ],
            ["New Work",         ["getChild", [1, 'ul.dropdown-menu li:nth-of-type(1) a']], ['setText'] ],
            ["Import Work",      ["getChild", [1, 'ul.dropdown-menu li:nth-of-type(2) a']], ['setText'] ],
        ],
        footer: [
            ["Customize",                        ["getChild", [-4, 'h4.heading']],          ['setText'] ],
            ["Default",                          ["getByUrl", ['/skins/unset', '$']],       ['setText'] ],
            ["Happy 17th!",                      ["getByUrl", ['/skins/2110030/set', '$']], ['setText'] ],
            ["Low Vision Default",               ["getByUrl", ['/skins/891/set', '$']],     ['setText'] ],
            ["Reversi",                          ["getByUrl", ['/skins/929/set', '$']],     ['setText'] ],
            ["Snow Blue",                        ["getByUrl", ['/skins/932/set', '$']],     ['setText'] ],
            ["About the Archive",                ["getChild", [-3, 'h4.heading']],          ['setText'] ],
            ["Site Map",                         ["getByUrl", ['/site_map', '$']],          ['setText'] ],
            ["Diversity Statement",              ["getByUrl", ['/diversity', '$']],         ['setText'] ],
            ["Terms of Service",                 ["getByUrl", ['/tos', '$']],               ['setText'] ],
            ["DMCA Policy",                      ["getByUrl", ['/dmca', '$']],              ['setText'] ],
            ["Contact Us",                       ["getChild", [-2, 'h4.heading']],          ['setText'] ],
            ["Policy Questions & Abuse Reports", ["getByUrl", ['/abuse_reports/new', '$']], ['setText'] ],
            ["Technical Support & Feedback",     ["getByUrl", ['/support', '$']],           ['setText'] ],
            ["Development",                      ["getChild", [-1, 'h4.heading']],          ['setText'] ],
            ["Known Issues",                     ["getByUrl", ['/known_issues', '$']],      ['setText'] ],
        ],
        dash: [
            ["Dashboard",     ["getBySelect", ['a:first-of-type[href^="/users/"]']], ['setText'] ],
            ["Profile",       ["getByUrl", ['/profile', '$']],                       ['setText'] ],
            ["Pseuds",        ["getBySelect", ['li.pseud > a']],                     ['setText'] ],
            ["Preferences",   ["getByUrl", ['/preferences', '$']],                   ['setText'] ],
            ["Skins",         ["getByUrl", ['/skins', '$']],                         ['setText'] ],
            ["Works",         ["getByUrl", ['/works', '$']],                         ['setText'] ],
            ["Drafts",        ["getByUrl", ['/works/drafts', '$']],                  ['setText'] ],
            ["Series",        ["getByUrl", ['/series', '$']],                        ['setText'] ],
            ["Bookmarks",     ["getByUrl", ['/bookmarks', '$']],                     ['setText'] ],
            ["Collections",   ["getByUrl", ['/collections', '$']],                   ['setText'] ],
            ["Inbox",         ["getByUrl", ['/inbox', '*']],                         ['setText'] ],
            ["Statistics",    ["getByUrl", ['/stats', '$']],                         ['setText'] ],
            ["History",       ["getByUrl", ['/readings', '$']],                      ['setText'] ],
            ["Subscriptions", ["getByUrl", ['/subscriptions', '$']],                 ['setText'] ],
            ["Sign-ups",      ["getByUrl", ['/signups', '$']],                       ['setText'] ],
            ["Assignments",   ["getByUrl", ['/assignments', '$']],                   ['setText'] ],
            ["Claims",        ["getByUrl", ['/claims', '$']],                        ['setText'] ],
            ["Related Works", ["getByUrl", ['/related_works', '$']],                 ['setText'] ],
            ["Gifts",         ["getByUrl", ['/gifts', '$']],                         ['setText'] ],
        ],
        blurb: [
            ["by",                          ["getBySelect", ['div.header h4.heading']],                         ['setNode', [0]] ],
            ["for",                         ["getBySelect", ['div.header h4.heading']],                         ['setNode', [1]] ],
            ["_PostDate",                   ["getBySelect", ['div.header p.datetime']],                         ['setDate'] ],
            ["Language",                    ["getBySelect", ['dt.language']],                                   ['setText', new RegExp(/[A-Za-z]+/)] ],
            ["Words",                       ["getBySelect", ['dt.words']],                                      ['setText', new RegExp(/[A-Za-z]+/)] ],
            ["Chapters",                    ["getBySelect", ['dt.chapters']],                                   ['setText', new RegExp(/[A-Za-z]+/)] ],
            ["Comments",                    ["getBySelect", ['dt.comments']],                                   ['setText', new RegExp(/[A-Za-z]+/)] ],
            ["Kudos",                       ["getBySelect", ['dt.kudos']],                                      ['setText', new RegExp(/[A-Za-z]+/)] ],
            ["Bookmarks",                   ["getBySelect", ['dt.bookmarks']],                                  ['setText', new RegExp(/[A-Za-z]+/)] ],
            ["Collections",                 ["getBySelect", ['dt.collections']],                                ['setText', new RegExp(/[A-Za-z]+/)] ],
            ["Hits",                        ["getBySelect", ['dt.hits']],                                       ['setText', new RegExp(/[A-Za-z]+/)] ],
            ["Works",                       ["getBySelect", ['dt.works']],                                      ['setText', new RegExp(/[A-Za-z]+/)] ],
            ["Part # of",                   ["getBySelect", ['']],                                              ['setText'] ],
            ["Last visited",                ["getBySelect", ['h4.viewed span']],                                ['setText', new RegExp(/[A-Za-z ]+/)] ],
            ["Visited # times",             ["getBySelect", ['']],                                              ['setText'] ],
            ["_VisitDate",                  ["getBySelect", ['h4.viewed']],                                     ['setDate'] ],
            ["Latest version",              ["getBySelect", ['h4.viewed']],                                     ['setText', "Latest version"] ],
            ["Minor edits made since then", ["getBySelect", ['h4.viewed']],                                     ['setText', "Minor edits made since then"] ],
            ["Update available",            ["getBySelect", ['h4.viewed']],                                     ['setText', "Update available"] ],
            ["Marked for Later",            ["getBySelect", ['h4.viewed']],                                     ['setText', "Marked for Later"] ],
            ["Bookmarked by",               ["getBySelect", ['.byline']],                                       ['setText', new RegExp(/^\s*Bookmarked by/)] ],
            ["Delete from History",         ["getBySelect", ['form.ajax-remove input[name="commit"]']],         ['setAttr', 'value'] ],
            ["Save as Bookmark",            ["getBySelect", ['a[id^="bookmark_form_trigger"][href$="/new"]']],  ['setText'] ],
            ["Edit",                        ["getBySelect", ['a[id^="bookmark_form_trigger"][href$="/edit"]']], ['setText'] ],
            ["Delete",                      ["getBySelect", ['a[data-method="delete"]']],                       ['setText'] ],
            ["Add to Collection",           ["getBySelect", ['li#add_collection_link a']],                      ['setText'] ],
            ["Share",                       ["getBySelect", ['li.share a']],                                    ['setText'] ],
            ["All Bookmarks",               ["getBySelect", ['.showme a']],                                     ['setText'] ],
            ["Edit",                        ["getBySelect", ['a[href^="/works/"][href$="/edit"]']],             ['setText'] ],
            ["Edit Tags",                   ["getBySelect", ['a[href^="/works/"][href$="/edit_tags"]']],        ['setText'] ],
        ],
        browse: [
            // ["# of # Works in",            ["getBySelect", ['h2.heading']], ['setNode', [0, new RegExp(/([0-9,]+ - [0-9,]+) of ([0-9,]+) Works in|([0-9,]+) Works? in/)]] ],
            // ["# of # Bookmarked Items in", ["getBySelect", ['h2.heading']], ['setNode', [0, new RegExp(/([0-9,]+ - [0-9,]+) of ([0-9,]+) Bookmarked Items in/)]] ],
        ],
    };

    // an object of functions lets us later access those by name in a variable
    let myFunctions = {
        getByUrl: function (within, param) {
            // param: [0] = url part to be found
            //        [1] = how to match against href (* contain, ^ start with, $ end with, if empty string match exactly)
            //        [2] = optional further selectors of parents of the <a>
            return $(within).find(`${(param[2] == null) ? "" : param[2]} a[href${(param[1] == null) ? "" : param[1]}="${param[0]}"]`).toArray();
        },
        getBySelect: function (within, param) { return $(within).find(param[0]).toArray(); },
        getChild: function (within, param) {
            // param: [0] = index of child we want, [1] = further selectors
            return $(within).children().eq(param[0]).find(param[1]).toArray();
        },
        setText: function (elem, text, param) {
            // param = a text or regex that needs to be replaced; if null, we can replace the whole thing
            // careful! this rewrites the innerHTML, so if it contained HTML elements with event handlers, those are likely gone!
            elem.innerHTML = (param == null) ? text : elem.innerHTML.replace(param, text);
        },
        setNode: function (elem, text, param) {
            // param: [0] = index of textnode we want (we ignore ones that are just whitespace)
            //        [1] = a text or regex that needs to be replaced; if null, we can replace the whole thing
            let node = $(elem).contents().filter( function() { return (this.nodeType === 3 && this.nodeValue.trim() !== ""); } ).eq(param[0]).get(0);

            // textnodes might not exist (like "for" in blurbs) while the selected element always exists, hence another check
            if (node !== undefined) {
                /*
                // if we have to replace some text
                if (text.indexOf("#") !== -1) {
                    let matchedgroups = node.nodeValue.match(param[1]);
                    if (matchedgroups === null) return;
                    let newtext = "";
                    let group = 0;
                    for (let c of text) {
                        if (c === "#") {
                            group++;
                            newtext += matchedgroups[group];
                        }
                        else newtext += c;
                    }
                    param[1] = null;
                    text = newtext;
                }
                */
                node.nodeValue = (param[1] == null) ? text : node.nodeValue.replace(param[1], text);
            }
        },
        setAttr: function (elem, text, param) {
            // param = the name of the attribute we're trying to overwrite
            elem.setAttribute(param, text);
        },
        setDate: function (elem) {
            let month = elem.innerHTML.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/)[0];
            let newtext = translation.get(month) || "";
            if (newtext !== "") myFunctions.setText(elem, newtext, month);
        },
    };

    function runThroughFields(section, within) {
        // using the within parameter to speed up jQuery selections by prefiltering to certain parts of the page
        for (let i of section) {
            let newtext = translation.get(i[0]) || "";
            let elements = myFunctions[i[1][0]](within, i[1][1]);
            for (let e of elements) { replaceField(i[2][0], e, newtext, i[2][1]); }
        }
    }

    function replaceField(func, element, newtext, params) {
        // we don't replace text if we'd run into errors (undefined) or if the replacement text is empty
        if (element !== undefined && $(element).length !== 0) {
            if (func === "setDate") myFunctions.setDate(element);
            else if (newtext !== "") myFunctions[func](element, newtext, params);
        }
    }

    function startReplacing() {
        // header, main navigation and footer parts of the page (won't exist if retry later)
        if ($('#header').length === 1) runThroughFields(fields.menu, $('#header'));
        if ($('#footer').length === 1) runThroughFields(fields.footer, $('#footer').find('ul.navigation'));

        // menu options for logged-in users (won't exist if logged out/guest)
        if ($('#greeting').length === 1) runThroughFields(fields.greeting, $('#greeting').find('ul.user.navigation'));

        // left sidebar on user pages
        if ($('#dashboard').length === 1) {
            runThroughFields(fields.dash, $('#dashboard'));

            // special: the .current viewed page that isn't a link. thankfully the original <span> content matches the key in our Map()
            let curr_elem = $('#dashboard').find('li span.current').get(0);
            let curr_text = curr_elem.innerText.match(/[A-Za-z ]+/)[0].trim(); // grab only the text part (no brackets or numbers)
            replaceField('setText', curr_elem, translation.get(curr_text) || "", new RegExp(curr_text)); // replace only that text part
        }

        // any and all work blurbs (including when viewing bookmarks)
        if ($('#main').find('.blurb').length > 0) runThroughFields(fields.blurb, $('#main').find('.blurb'));

        // browsing a tag
        if ($('#main').hasClass('works-index') || $('#main').hasClass('bookmarks-index')) runThroughFields(fields.browse, $('#main'));
    }

    // this is the part which should be contained in a separate translation script which @require's this here script
    // to keep the original text, you can leave the second quotes empty
    // note that some texts appear in multiple places around the interface, and only need to be translated once
    //   example: "Works" is part of the top menu, and doesn't have to be translated again for the left-side user navigation
    //   exception: when the displayed text isn't an exact match, e.g. "Works" vs. "My Works"
    const translation = new Map([

        // header and main menu at the top of the page
            ["Fandom", "Fandom Medien"],
            ["All Fandoms", "Alle Medien"],
            ["Anime & Manga", ""],
            ["Books & Literature", "Bücher & Literatur"],
            ["Cartoons & Comics & Graphic Novels", ""],
            ["Celebrities & Real People", "Prominente & echte Personen"],
            ["Movies", "Filme"],
            ["Music & Bands", "Musik & Bands"],
            ["Other Media", "Andere Medien"],
            ["Theater", ""],
            ["TV Shows", "Fernsehserien"],
            ["Video Games", "Videospiele"],
            ["Uncategorized Fandoms", "Unkategorisierte Fandoms"],
            ["Browse", "Stöbern"],
            ["Works", "Werke"],
            ["Bookmarks", "Lesezeichen"],
            ["Tags", ""],
            ["Collections", "Sammlungen"],
            ["Search", "Suche"],
            ["People", "Leute"],
            ["About", "Weitere Infos"],
            ["About Us", "Über uns"],
            ["News", "Neuigkeiten"],
            ["FAQ", ""],
            ["Wrangling Guidelines", "Tag Wrangling Standards"],
            ["Donate or Volunteer", "Spenden oder Helfen"],
            ["Log In", "Einloggen"],
            ["Log Out", "Ausloggen"],
            ["User name or email", "Username oder Email"],
            ["Password", "Passwort"],
            ["Remember me", "Eingeloggt bleiben"],
            ["Forgot password", "Passwort vergessen?"],
            ["Get an invitation", "Einladung erhalten"],
            ["Search Button", "Suchen"],

        // greeting and menu options for logged-in users
            ["Hi", "Hallo"],
            ["My Dashboard", "Mein Dashboard"],
            ["My Subscriptions", "Meine Abos"],
            ["My Works", "Meine Werke"],
            ["My Bookmarks", "Meine Lesezeichen"],
            ["My History", "Mein Verlauf"],
            ["My Preferences", "Meine Einstellungen"],
            ["Post", "Erstellen"],
            ["New Work", "Neues Werk"],
            ["Import Work", "Werk Importieren"],

        // footer
            ["Customize", "Individualisieren"],
            ["Default", "Default (Standard)"],
            ["Happy 17th!", "Happy 17th! (dunkel)"],
            ["Low Vision Default", "Low Vision Default (für Sehbehinderungen)"],
            ["Reversi", "Reversi (dunkel)"],
            ["Snow Blue", ""],
            ["About the Archive", "Über das Archiv"],
            ["Site Map", "Seitenübersicht"],
            ["Diversity Statement", ""],
            ["Terms of Service", "Nutzungsbedingungen"],
            ["DMCA Policy", "Urheberrecht-Richtlinie"],
            ["Contact Us", "Kontaktiere uns"],
            ["Policy Questions & Abuse Reports", "Fragen zu Richtlinien oder Missbrauch melden"],
            ["Technical Support & Feedback", "Technische Hilfe oder Feedback"],
            ["Development", "Entwicklung"],
            ["Known Issues", "Bekannte Probleme"],

        // left-side navigation when viewing a user
            ["Dashboard", "Übersicht"],
            ["Profile", "Profil"],
            ["Pseuds", "Künstlernamen"],
            ["Preferences", "Einstellungen"],
            ["Skins", ""],
            ["Drafts", "Entwürfe"],
            ["Series", "Serien"],
            ["Inbox", "Messages"],
            ["Statistics", "Statistiken"],
            ["History", "Verlauf"],
            ["Subscriptions", "Abos"],
            ["Sign-ups", ""],
            ["Assignments", ""],
            ["Claims", ""],
            ["Related Works", "Verwandte Werke"],
            ["Gifts", "Geschenke"],

        // blurb
            ["by", " von "],
            ["for", " für "],
            ["Language", "Sprache"],
            ["Words", "Worte"],
            ["Chapters", "Kapitel"],
            ["Comments", "Kommentare"],
            ["Kudos", ""],
            ["Hits", "Besuche"],
            ["Part # of", "Teil # von"],
            ["Last visited", "Zuletzt besucht"],
            ["Visited # times", "# mal besucht"],
            ["Latest version", "Neueste Version"],
            ["Minor edits made since then", "Kleine Änderungen seither"],
            ["Update available", "Update verfügbar"],
            ["Marked for Later", "Aufgehoben ist nicht aufgeschoben"],
            ["Bookmarked by", "Lesezeichen gesetzt von"],

        // blurb buttons
            ["Edit", "Bearbeiten"],
            ["Delete", "Löschen"],
            ["Edit Tags", "Tags ändern"],
            ["Add to Collection", "Zu Sammlung hinzufügen"],
            ["Share", "Teilen"],
            ["Delete from History", "Aus Verlauf löschen"],
            ["Save as Bookmark", "Lesezeichen setzen"],
            ["All Bookmarks", "Alle Lesezeichen sehen"],
            ["", ""],
            ["", ""],

        // months
            ["Jan", ""],
            ["Feb", ""],
            ["Mar", "März"],
            ["Apr", ""],
            ["May", "Mai"],
            ["Jun", "Juni"],
            ["Jul", "Juli"],
            ["Aug", ""],
            ["Sep", ""],
            ["Oct", "Okt"],
            ["Nov", ""],
            ["Dec", "Dez"],

        // works and bookmarks pages
            ["# of # Works in", "# von # Werken in "],
            ["# of # Bookmarked Items in", "# von # Lesezeichen in "],
            ["", ""],
    ]);
    startReplacing();

})(jQuery);