// ==UserScript==
// @name        TVmaze Downloader 2019
// @description Adds download links to TVmaze website
// @include     https://www.tvmaze.com/*
// @version     1.01
// @Author      bnor
// @license     http://creativecommons.org/licenses/by-nc-sa/3.0/us/
// @grant       none
// @namespace https://greasyfork.org/users/173683
// @downloadURL https://update.greasyfork.org/scripts/375329/TVmaze%20Downloader%202019.user.js
// @updateURL https://update.greasyfork.org/scripts/375329/TVmaze%20Downloader%202019.meta.js
// ==/UserScript==

(function() {
    function Tracker(shortname, icon, logic) {
        this.shortname = shortname;
        this.icon = icon;
        this.logic = logic;

        this.getHTML = function (query, episodeName,episodeNumber) {
            var tShortname = this.shortname;
            var tIcon = this.icon;

            var html = "<a target=\"_blank\" href=\"";
            html += logic(query,episodeName,episodeNumber);
            html += "\">";

            if (tIcon !== "") {
                html += "<img width=\"14\" heigth=\"14\" border=\"0\" src=\"" + tIcon + "\" alt=\"" + tShortname + "\">";
            } else {
                html += tShortname;
            }
            html += "</a>";
            return html;
        };
    }

    function addDownloadWatchList(downloadURL) {
        // iterate through all series tables
        $("article.episode-row").each(function() {
            // Create Download column
            var linksDiv = $(this).find("div.tributton-watch").last();

            // get current episode number
            var lastEpisodeNumber=$(this).parent().parent().find("div.watched-eps").first().text().trim().split("/")[0];
            var episodeNumber=Number(lastEpisodeNumber)+$(this).index();

            // Get series title
            var showTitle = $(this).parent().parent().prev().children("a").text();
            showTitle = showTitle.replace(".","").replace("'","").replace("!","");
            // Get episode name
            var episodeName = $(this).find("div.small-6.medium-7.cell.center").first().text();
            episodeName = episodeName.split(":")[0].trim();

            var htmlString="";
            // Add download link to each episode
            for(var i=0;i<downloadURL.length;++i){
                htmlString+=downloadURL[i].getHTML(showTitle, episodeName,episodeNumber);
            }
            linksDiv.append("<td style='width:40px'>" + htmlString + "</td>");

        });

    }


    // --------------- downloadURL ---------------
    // FORMAT: Tracker(shortName, iconURL, searchURL, useNumbers)
    //     shortName - Alt display name for link
    //     iconURL - icon displayed for link created
    //     searchURL - URL that search string is appended to
    //     useNumbers - if true adds the episode number to the search URL
    var trackEztv = new Tracker("EZTV", "http://eztv.io/favicon.ico", (name,episodeName,episodeNumber)=>{
        //1x02 > S01E02
        var season=Number(episodeName.split("x")[0]);
        var number=Number(episodeName.split("x")[1]);
        if(season<10){
            season="0"+season;
        }
        if(number<10){
            number="0"+number;
        }

        episodeName= "S"+season+"E"+number;
        return "https://eztv.io/search/"+name+" "+episodeName;
    });
    var trackHs = new Tracker("HS", "", (name,episodeName,episodeNumber)=>{
        var map=[];
        map["That Time I Got Reincarnated as a Slime"]="tensei-shitara-slime-datta-ken";
        map["Ms vampire who lives in my neighborhood."]="tonari-no-kyuuketsuki-san";
        map["So Many Colors in the Future What a Wonderful World"]="Irozuku Sekai no Ashita kara";

        if(map[name] !== undefined){
            name=map[name];
        }
        if(episodeNumber<10){
            episodeNumber="0"+episodeNumber;
        }
        return "https://horriblesubs.info/shows/"+name+"/#"+episodeNumber;
    });

    //downloadURL = new Tracker("Kickass", "https://kastatic.com/images/favicon.ico", "https://kickass.to/usearch/?field=time_add&sorder=desc&q=ettv -720p -1080p ", false);
    // --------------- END OF downloadURL ---------------

    if($("title").text().indexOf("Watch List")===0){
        addDownloadWatchList([trackEztv,trackHs]);
    }

})();