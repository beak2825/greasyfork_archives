// ==UserScript==
// @name         [skypesky 出品]search subtitle for icheckmovies
// @namespace    http://www.skypesky.cn/userjs/search_subtitle_for_icheckmovies
// @version      18.06.01
// @description  search subtitle for icheckmovies
// @author       skypesky
// @include      http*://www.icheckmovies.com/movies/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/368839/%5Bskypesky%20%E5%87%BA%E5%93%81%5Dsearch%20subtitle%20for%20icheckmovies.user.js
// @updateURL https://update.greasyfork.org/scripts/368839/%5Bskypesky%20%E5%87%BA%E5%93%81%5Dsearch%20subtitle%20for%20icheckmovies.meta.js
// ==/UserScript==

(function () {
    'use strict';
    
    const subtitleMap = [
        {
            url: "https://subscene.com/subtitles/title?q={keyword}&l=",
            description: "subscene"
        },        
        {
            url: "https://www.opensubtitles.org/en/search2/sublanguageid-all/moviename-{keyword}",
            description: "opensubtitles"
        },
        {
            url: "https://eztv.ag/search/{keyword}",
            description: "eztv"
        },
        {
            url: "http://1337x.to/search/{keyword}/0/",
            description: "1337x"
        },
        {
            url: "https://yts.am/browse-movies/{keyword}/all/all/0/latest",
            description: "yts.ag"
        }
    ];

    $(function () {
        Server.run(subtitleMap);
    })
})();

var Server = {
    run: function (subtitleMap) {
        // get url
        let data = subtitleMap.map((value, index, array) => {
            // first step: get title
            let title = this.getTitle();
            // second step: replace keyword
            let link = value.url.replace("{keyword}", title);
            console.log(`${link} ${title}`);
            return {
                link: link,
                description: value.description
            };
        });
        console.log(data);
        this.addStyle(data);
    },
    getTitle: function () {
        return $("#movie > h1").text();
    },
    addStyle: function (data) {

        let table = "";
        table += "<table style='text-align: center'>";
        for (let i = 0; i < data.length; i = i + 4) {

            table += "<tr>";

            data[i] ? table += "<td><a href='" + data[i].link + "' target='_blank'>" + data[i].description + "</td>" : "";

            data[i + 1] ? table += "<td><a href='" + data[i + 1].link + "' target='_blank'>" + data[i + 1].description + "</td>" : "";

            data[i + 2] ? table += "<td><a href='" + data[i + 2].link + "' target='_blank'>" + data[i + 2].description + "</td>" : "";

            data[i + 3] ? table += "<td><a href='" + data[i + 3].link + "' target='_blank'>" + data[i + 3].description + "</td>" : "";

            table += "</tr>";
        }
        table += "</table>";
        table += "<hr /><br />";
        console.log(table);
        $("#movieInfo").after(table);
    }
}