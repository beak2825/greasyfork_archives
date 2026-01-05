// ==UserScript==
// @name           IMDb details page links
// @namespace      IMDb.com
// @description    Adds some links to IMDb details page
// @include        *imdb.com/title/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/jqModal/1.3.0/jqModal.min.js
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_registerMenuCommand
// @grant          GM_addStyle
// @version        2.6
// @downloadURL https://update.greasyfork.org/scripts/11618/IMDb%20details%20page%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/11618/IMDb%20details%20page%20links.meta.js
// ==/UserScript==

// CHANGELOG
// 2.6 - Fix for beta reference view
// 2.5.1 - Fix for reference view
// 2.5 - Fix for new layout
// 2.4 - Fix TV episode pages
// 2.3.2 - Fix new reference view
// 2.3.1 - Fix TV episode pages
// 2.3 - Fix for new layout
// 2.2.1 - Change UI to fit in new IMDb layout
// 2.2 - Add {alttitle}
// 2.1.2 - Replace # with example.com to prevent my movies enhancer
// from highlighting the delete and up/down links
// 2.1.1 - Use JSON instead of eval
// 2.1 - Add up/down for editing sites
// 2.0 - Make links modifiable
// 1.1 - Update URLs

// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String/Trim
if(!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g,'');
    };
}

function defaultSites() {
    return [{title:"Google",           url:"http://www.google.com/search?q={title} {year}"},
            {title:"Subtitles",        url:"http://www.google.com/search?q={title} {year} subtitles"},
            {title:"YouTube",          url:"http://www.youtube.com/results?search_query={title} {year}"},
            {title:"iCheckMovies",     url:"http://www.icheckmovies.com/search/movies/?query={imdbid}"},
            {title:"RottenTomatoes",   url:"http://www.rottentomatoes.com/search/?search={title}"},
            {title:"HDBits",           url:"http://hdbits.org/browse2.php#film/dir=null&searchtype=film&actorfilm=film&search={imdbid}"},
            {title:"AsianDVDClub",     url:"http://asiandvdclub.org/browse.php?search={imdbid}&descr=1"},
            {title:"PassThePopCorn",   url:"http://passthepopcorn.me/torrents.php?searchstr={imdbid}"},
            {title:"KaraGarga",        url:"http://karagarga.in/browse.php?incldead=&d=&sort=&search={imdbidn}&search_type=imdb"},
            {title:"Cinemageddon",     url:"http://cinemageddon.net/browse.php?search={imdbid}&proj=0"},
            {title:"AsiaTorrents",     url:"https://avistaz.to/torrents?in=1&search={title}&tags=&type=0&language=0&subtitle=0&discount=0&rip_type=0&video_quality=0&tv_type=0&uploader="},
            {title:"TehConnection",    url:"http://tehconnection.eu/torrents.php?searchstr={title}"},
            {title:"WhatTheMovie",     url:"http://whatthemovie.com/search?t=movie&q={imdbid}"},
            {title:"Mubi",             url:"http://www.google.com/search?q=site:mubi.com {title} {year}"},
            {title:"ListAL",           url:"http://www.google.com/search?q=site:listal.com {title} {year}"},
            {title:"HanCinema",        url:"http://www.hancinema.net/googlesearch.php?cx=partner-pub-1612871806153672%3A2t41l1-gajp&cof=FORID%3A10&ie=ISO-8859-1&hl=en&q={title}"},
            {title:"Criticker",        url:"http://www.criticker.com/?st=movies&h={imdbid}&g=Go"}];
}

const isReference = document.title.includes("Reference View");

function parseConstants() {
    if (document.title.length < 1) { return null; }
    let title = document.title.substring(0, document.title.length - 7);
    let rx = /(.*)\(.*?([0-9]{4}).*/g;
    let ms = rx.exec(document.title);
    if (ms !== null && ms.length) {
        return {title: encodeURIComponent(ms[1].trim()),
            year: ms[2],
            imdbid: window.location.href.match(/(tt[0-9]+)/)[0],
            imdbid_n: window.location.href.match(/(tt[0-9]+)/)[0].replace("tt", "")};
            //alttitle: encodeURIComponent(alt_title)};
    }

    return null;
}

var App = {
    links: [],
    init: function() {
        App.buildLinks();

        // Add modal
        if (isReference ) {
            GM_addStyle("#linkbar { width:600px; margin-left: 0px; } #linkbar a { color: #136CB2; }");
        }
        else {
            if (document.title.includes("Reference view")) {
                // Beta reference view
                GM_addStyle("#linkbar { width:800px; margin-left: 23px; } #linkbar a { color: var(--ipt-on-base-accent2-color); }");
            }
            else {
                GM_addStyle("#linkbar { width:800px; margin-left: 23px; } #linkbar a { color: #fff; }");
            }
        }
        GM_addStyle('.jqmWindow {display: none; position: absolute; font-family: verdana, arial, sans-serif; ' +
        'background-color:#fff; color:#000; padding: 12px 30px; overflow-y: scroll; font-size: 14px} .jqmOverlay { background-color:#000 }');

        var cfgMainHtml = '<div id="dialog" class="jqmWindow"></div>';
        $(cfgMainHtml).css({
            top: '17%', left: '50%', marginLeft: '-425px', width: '850px', height: '450px'
        }).appendTo('body');
        $('#dialog').jqm();
    },
    buildLinks: function() {
        var sites = GM_getValue("sites");
        if(sites !== undefined && sites !== null) {
            sites = JSON.parse(sites);
        }
        else {
            GM_setValue("sites", JSON.stringify(defaultSites()));
            sites = defaultSites();
        }

        var $root = isReference ? document.querySelector("#main > section > section > div") : document.querySelectorAll("section")[4];

        $("#linkbar").remove();
        var $c = $("<section></section>");
        $c.attr("id", "linkbar");
        $c.css({display: "flex", flexFlow: "row wrap", role: "presentation"});

        if (isReference) {
            $root.append(document.createElement("hr"));
        }
        $root.append($c[0]);

        // Render sites
        for(var i = 0; i < sites.length; ++i) {
            App.addSite(sites[i]);
        }
    },
    addSite: function(site) {
        var c = parseConstants();
        if (c === null) {
            return;
        }

        var url = site.url.replace("{title}", c.title)
                            .replace("{year}", c.year)
                            .replace("{imdbid}", c.imdbid)
                            .replace("{imdbidn}", c.imdbid_n);
        var $root = $("#linkbar");
        var $link = $("<a></a>");
        $link.attr("href", url);
        $link.text(site.title);
        let $article = $("<article></article>");
        if (isReference) {
            $article.css({width: "150px"});
        }
        else {
            $article.css({width: "200px"});
        }
        $article.append($link);
        $root.append($article);
    },
    displayEditor: function() {
        var sites = GM_getValue("sites");
        if(sites !== undefined) {
            sites = JSON.parse(sites);
        }

        var c = parseConstants();
        var out = `<div><p>{title} = ${c.title}</p>
                  <p>{year} = ${c.year}</p>
                  <p>{imdbid} = ${c.imdbid}</p>
                  <p>{imdbidn} = ${c.imdbid_n}</p><table>`;

      var addRow = function(i, title, url) {
            return `<tr class="site-${i}"><td style="width: 6%"><a href="http://example.com/#delete" class="delete">Delete</a></td>
                      <td style="width: 18%"><input type="text" style="width: 100%" value="${title}"></td>
                      <td style="width: 62%"><input type="text" style="width: 100%" value="${url}"></td>
                      <td style="width: 14%; padding-left: 8px"><a href="http://example.com/#up" class="up">Up</a>
                      | <a href="http://example.com/#down" class="down">Down</a></td></tr>`;
        }
        for(var i = 0; i < sites.length; ++i) {
            out += addRow(i, sites[i].title, sites[i].url);
        }
        out += '</table><p><button id="add">Add new</button> <button id="restore">Restore defaults</button></p>';
        $("#dialog").html(out);
        $("#dialog").jqmShow();

        $("#dialog").on("change input paste", "tr[class^=site] input", App.saveEditor);

        $("#dialog").on("click", "a.delete", function(e){
            e.preventDefault();
            var response = window.confirm("Delete?");
            if(!response) {
                return;
            }

            $(this).parent().parent().remove();
            App.saveEditor();
        });

        $("#dialog").on("click", "a.up, a.down", function(e) {
            e.preventDefault();

            var $t = $(this);
            var $parent = $t.parent().parent();
            if($t.is(".up")) {
                $parent.insertBefore($parent.prev());
            }
            else {
                $parent.insertAfter($parent.next());
            }

            App.saveEditor();
        });

        $("#add", "#dialog").on("click", function() {
            var $table = $("table", "#dialog");
            $table.append(addRow($table.find("tr").length, '', ''));
        });

        $("#restore", "#dialog").on("click", function() {
            var response = window.confirm("Restore defaults? (This will remove all links!)");
            if(!response) {
                return;
            }

            GM_setValue("sites", JSON.stringify(defaultSites()));
            App.buildLinks();
            $("#dialog").jqmHide();
        });
    },
    saveEditor: function() {
        // Save result
        var $rows = $("tr", "#dialog");
        var mapped = $rows.map(function(index, elem){
            var $fields = $(elem).find("input");
            return {title: $fields.eq(0).val(), url: $fields.eq(1).val()};
        });

        GM_setValue("sites", JSON.stringify(mapped.get()));

        App.buildLinks();
    }
};

$(document).ready(() => { setTimeout(App.init, 500); });

GM_registerMenuCommand("Edit sites", App.displayEditor);