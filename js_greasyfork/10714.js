// ==UserScript==
// @name          ArenaBG Extended userscript
// @namespace     http://arenabg.com
// @description   Replace ".", "_" and "-" with blank space, added category buttons under torrent search.
// @include       http://arenabg.com/*
// @include       http://*.arenabg.com/
// @require       http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @author        beBoss
// @version       7.7
// @downloadURL https://update.greasyfork.org/scripts/10714/ArenaBG%20Extended%20userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/10714/ArenaBG%20Extended%20userscript.meta.js
// ==/UserScript==

// Torrents page
$('tbody tr td:nth-child(2) div:nth-child(2) a').each(function () {
    $(this).text($(this).text().replace(/(?:(v\d+(?:\.\d+)+) *)?[._ -]+/g, "$1 "));
});

// Top 10
$('table.torrents-present.table-bordered.table-striped tbody tr td:nth-child(2) a').each(function () {
    $(this).text($(this).text().replace(/(?:(v\d+(?:\.\d+)+) *)?[._ -]+/g, "$1 "));
});

// Last for online watch with subtitles
$('table.torrents-online.table-bordered.table-striped tbody tr td:nth-child(2) a').each(function () {
    $(this).text($(this).text().replace(/(?:(v\d+(?:\.\d+)+) *)?[._ -]+/g, "$1 "));
});

// Torrent details link
$('table.table-striped.table-details tbody tr td:nth-child(2) a').each(function () {
    $(this).text($(this).text().replace(/(?:(v\d+(?:\.\d+)+) *)?[._ -]+/g, "$1 "));
});

// Torrent details link 2
$('.col-xs-12.col-sm-12.col-md-12.col-lg-12 .text-normal a').each(function () {
    $(this).text($(this).text().replace(/(?:(v\d+(?:\.\d+)+) *)?[._ -]+/g, "$1 "));
});

//Add category buttons
$('.col-md-6 .form-group.mb0').each(function () {
    $(this).append(
        "<br />" + "<br />" + "<br />" +
        "<form id=\"beBossButtons\" method=\"post\">" +
        "<table><tr>" +
        "<td><button id=\"all-btn\"  class=\"btn btn-sm btn-green4\"><i class=\"fa fa-search\"></i> All</button></td>" +
        "<td><button id=\"software-btn\"  class=\"btn btn-sm btn-green4\"><i class=\"fa fa-search\"></i> Software</button></td>" +
        "<td><button id=\"games-btn\" class=\"btn btn-sm btn-green4\"><i class=\"fa fa-search\"></i> Games</button></td>" +
        "<td><button id=\"music-btn\" class=\"btn btn-sm btn-green4\"><i class=\"fa fa-search\"></i> Music</button></td>" +
        "<td><button id=\"movies-btn\"  class=\"btn btn-sm btn-green4\"><i class=\"fa fa-search\"></i> Movies</button></td>" +
        "<td><button id=\"series-btn\"  class=\"btn btn-sm btn-green4\"><i class=\"fa fa-search\"></i> Series</button></td>" +
        "<td><button id=\"documentaries-btn\" class=\"btn btn-sm btn-green4\"><i class=\"fa fa-search\"></i> Documentaries</button></td>" +
        "<td><button id=\"misc-btn\"  class=\"btn btn-sm btn-green4\"><i class=\"fa fa-search\"></i> Misc</button></td>" +
        "<td><button id=\"xxx-btn\"  class=\"btn btn-sm btn-green4\"><i class=\"fa fa-search\"></i> XXX</button></td>" +
        "<td><button id=\"beBoss-btn\"  class=\"btn btn-sm btn-green4\"><i class=\"fa fa-search\"></i> About beBoss</button></td>" +
        "</tr></form>");
});


$('#all-btn').click(function () {
    var form = document.getElementById("beBossButtons");
    var input = $("<input>")
        .attr("type", "hidden")
        .attr("name", "type").val(0);
    $('#beBossButtons').append($(input));
    form.action = "search";
    form.submit();
});

$('#software-btn').click(function () {
    var form = document.getElementById("beBossButtons");
    var input = $("<input>")
        .attr("type", "hidden")
        .attr("name", "type").val("software");
    $('#beBossButtons').append($(input));
    form.action = "search";
    form.submit();
});

$('#games-btn').click(function () {
    var form = document.getElementById("beBossButtons");
    var input = $("<input>")
        .attr("type", "hidden")
        .attr("name", "type").val("games");
    $('#beBossButtons').append($(input));
    form.action = "search";
    form.submit();
});

$('#music-btn').click(function () {
    var form = document.getElementById("beBossButtons");
    var input = $("<input>")
        .attr("type", "hidden")
        .attr("name", "type").val("music");
    $('#beBossButtons').append($(input));
    form.action = "search";
    form.submit();
});

$('#movies-btn').click(function () {
    var form = document.getElementById("beBossButtons");
    var input = $("<input>")
        .attr("type", "hidden")
        .attr("name", "type").val("movies");
    $('#beBossButtons').append($(input));
    form.action = "search";
    form.submit();
});

$('#series-btn').click(function () {
    var form = document.getElementById("beBossButtons");
    var input = $("<input>")
        .attr("type", "hidden")
        .attr("name", "type").val("series");
    $('#beBossButtons').append($(input));
    form.action = "search";
    form.submit();
});

$('#documentaries-btn').click(function () {
    var form = document.getElementById("beBossButtons");
    var input = $("<input>")
        .attr("type", "hidden")
        .attr("name", "type").val("documentaries");
    $('#beBossButtons').append($(input));
    form.action = "search";
    form.submit();
});

$('#xxx-btn').click(function () {
    var form = document.getElementById("beBossButtons");
    var input = $("<input>")
        .attr("type", "hidden")
        .attr("name", "type").val("xxx");
    $('#beBossButtons').append($(input));
    form.action = "search";
    form.submit();
});

$('#misc-btn').click(function () {
    var form = document.getElementById("beBossButtons");
    var input = $("<input>")
        .attr("type", "hidden")
        .attr("name", "type").val("misc");
    $('#beBossButtons').append($(input));
    form.action = "search";
    form.submit();
});

$('#beBoss-btn').click(function () {
    var form = document.getElementById("beBossButtons")
    form.action = "http://beBoss.bg";
    form.setAttribute("target", "_blank");
    form.submit();
});