// ==UserScript==
// @name        PtMovieHelper
// @author ViolentCat
// @namespace   Violentmonkey Scripts
// @match       https://kp.m-team.cc/movie.php*
// @match       https://kp.m-team.cc/movie.php*
// @grant       none
// @version     1.0.1
// @description 用OMDB补全pt(现在只有mt)站上缺失的东西
// @name:zh-CN Pt电影助手
// @description:zh-cn 用OMDB补全pt站上缺失的东西
// @license MIT
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/456763/PtMovieHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/456763/PtMovieHelper.meta.js
// ==/UserScript==
//
var API_KEY = "YOUR_API_KEY"
$(document).ready(() => {
    function createInfoElement(element, omdbResponse) {
        if (omdbResponse == null) return;

        var infoElement = $("<td></td>");
        //set class to "embedded"
        infoElement.addClass("embedded");
        //set style to "text-align: right; width: 100; vertical-align: middle;"
        infoElement.attr("style", "text-align: right; width: 600px; vertical-align: middle;");
        //create a table inside infoElement
        var infoTable = $("<table></table>");
        //create a table row inside infoTable
        var infoTableRow = $("<tr></tr>");

        let genre = omdbResponse.Genre;
        let director = omdbResponse.Director;
        let actors = omdbResponse.Actors;
        let awards = omdbResponse.Awards;
        let rated = omdbResponse.Rated;
        let runtime = omdbResponse.Runtime;
        let imdbRating = omdbResponse.imdbRating;
        let metaScore = omdbResponse.Metascore;

        if (imdbRating == undefined) return;

        infoTableRow.append("<td>" + genre + "</td>");
        infoTableRow.append("<td>" + director + "</td>");
        infoTableRow.append("<td>" + actors + "</td>");
        infoTableRow.append("<td>" + awards + "</td>");
        infoTableRow.append("<td>" + rated + "</td>");
        infoTableRow.append("<td>" + runtime + "</td>");
        infoTableRow.append("<td>" + metaScore + "</td>");
        infoTableRow.append("<td>" + imdbRating + "</td>");

        //
        //add infoTable to infoElement
        infoTable.append(infoTableRow);
        infoElement.append(infoTable);
        element.append(infoElement);
    }

    async function getOmdbInfo(infoRow, name) {

        // Regex match the first appearing 4 digit and the string before it
        // Example: "The Matrix 1999 1080p" -> "(The Matrix)(1999)(1080p)"
        var regex = /(.*)\s\(*(\d{4})\)*\W(.*)/;

        var match = name.match(regex);
        if (match == null) return null;
        // get the first and second group as title and year
        var title = name.match(regex)[1];
        var year = name.match(regex)[2];


        // Replace spaces with +
        title = title.replace(/\s/g, "+");

        console.log(title);
        var omdbUrl = "https://www.omdbapi.com/?apikey=" + API_KEY + "&t=" + title + "&y=" + year;
        let omdbResponse = $.ajax({
            url: omdbUrl,
            type: "GET",
            dataType: "json",
            async: true,
            success: (data) => {

                createInfoElement(infoRow, data)
            }
        }).responseJSON;
        return omdbResponse;
    }

     async function run() {
        // Get the table body
        var torrentTableRows = $("table.torrentname > tbody > tr");
        // Get the torrent name and rating
        for (var i = 0; i < torrentTableRows.length; i++) {
            // Find the first a tag
            var infoRow = torrentTableRows.eq(i)
            var torrentNameElement = torrentTableRows.eq(i).find("td.torrentimg > a").eq(0);
            // Check if the elements are found before trying to access their attributes
            if (infoRow.length && torrentNameElement.length) {
                // get the omdb info

                var omdbResponse = await getOmdbInfo(infoRow, torrentNameElement.attr("title"))

            }
        }
    }
    run().then();
})