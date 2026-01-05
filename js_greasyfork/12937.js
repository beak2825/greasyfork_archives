// ==UserScript==
// @name        TVmaze Downloader
// @description Adds download links to TVmaze website
// @namespace   https://greasyfork.org/en/users/814-bunta
// @include     http://www.tvmaze.com/*
// @version     1.3
// @Author      Bunta
// @license     http://creativecommons.org/licenses/by-nc-sa/3.0/us/
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12937/TVmaze%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/12937/TVmaze%20Downloader.meta.js
// ==/UserScript==


/* Console import for testing:
var body = document.getElementsByTagName("body")[0];
var script = document.createElement('script');
script.type = "text/javascript";
script.src = "http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js";
body.appendChild(script);
var $ = JQuery
*/

(function() {
  function Tracker(shortname, icon, searchurl, useNumbers) {
    this.shortname = shortname;
    this.icon = icon;
    this.searchurl = searchurl;
    this.useNumbers = useNumbers;
    
    this.getHTML = function (query, episode) {
      var tShortname = this.shortname;
      var tIcon = this.icon;
      var tSearchURL = this.searchurl;
      var tUseNumbers = this.useNumbers;
      
      // Alter search or link parameters for special cases
      switch (query)
      {
        case "Marvel's Agents of S.H.I.E.L.D":
          query = "Marvels Agents";
          break;
        case "DC's Legends of Tomorrow":
          query = "DCs Legends of Tomorrow";
          break;
        case "Ash vs Evil Dead":
          tSearchURL = "https://kat.cr/usearch/ettv -720 -1080 ";
          tIcon = "https://kat.cr/favicon.ico";
          tShortname = "Kickass";
          break;
        case "Fairy Tail":
          query = "";
          tUseNumbers = false;
          tSearchURL = "http://www.nyaa.se/?page=search&cats=1_37&filter=0&term=fairy+tail+horrible+480";
          tIcon = "http://anidb.net/favicon.ico";
          tShortname = "Anime";
          break;
        case "Fairy Tail Zero":
          query = "";
          tUseNumbers = false;
          tSearchURL = "http://www.nyaa.se/?page=search&cats=1_37&filter=0&term=fairy+tail+zero+horrible+480";
          tIcon = "http://anidb.net/favicon.ico";
          tShortname = "Anime";
          break;
        case "Hunter x Hunter":
          query = "";
          tUseNumbers = false;
          tSearchURL = "http://www.nyaa.se/?page=search&cats=1_37&filter=0&term=hunter+horrible+480p";
          tIcon = "http://anidb.net/favicon.ico";
          tShortname = "Anime";
          break;
        case "God Eater":
          query = "";
          tUseNumbers = false;
          tSearchURL = "http://www.nyaa.se/?page=search&cats=1_37&filter=0&term=god+eater+horrible+480p";
          tIcon = "http://anidb.net/favicon.ico";
          tShortname = "Anime";
          break;
        case "Magi: The Labyrinth of Magic":
          query = "";
          tUseNumbers = false;
          tSearchURL = "http://www.nyaa.se/?page=search&cats=1_37&filter=0&term=magi+hatsuyuki+480";
          tIcon = "http://anidb.net/favicon.ico";
          tShortname = "Anime";
          break;
        case "Naruto: Shippuuden":
          query = "";
          tUseNumbers = false;
          tSearchURL = "http://www.nyaa.se/?page=search&cats=1_37&filter=0&term=naruto+horrible+480p";
          tIcon = "http://anidb.net/favicon.ico";
          tShortname = "Anime";
          break;
        case "Kiseijuu":
          query = "";
          tUseNumbers = false;
          tSearchURL = "http://www.nyaa.se/?page=search&cats=1_37&filter=0&term=parasyte+horrible+480p";
          tIcon = "http://anidb.net/favicon.ico";
          tShortname = "Anime";
          break;
        case "One Piece":
          query = "";
          //tSearchURL = "http://tracker.yibis.com/index.php";
          tUseNumbers = false;
          tSearchURL = "http://www.nyaa.se/?page=search&cats=1_37&filter=0&term=one+piece+horrible+480";
          tIcon = "http://anidb.net/favicon.ico";
          tShortname = "Anime";
          break;
        default:
          break;
      }
      
      var search = "";
      if(tUseNumbers){
        search = query + " " + episode;
      } else {
        search = query;
      }
      
      var html = "<a target=\"_blank\" href=\"" + tSearchURL;  
      html += escape(search);
      html += "\">";

      if (tIcon != "") {
        html += "<img width=\"14\" heigth=\"14\" border=\"0\" src=\"" + tIcon + "\" alt=\"" + tShortname + "\">";
      } else {
        html += tShortname;
      }
      html += "</a>";
      return html;
    }
    
    // Used for old EZTV site POST process
    this.getEZTVPostHTML = function (query) {
      var html = "<font face=\"Verdana, Arial, Helvetica, sans-serif\" size=\"-2\">" +
              "<form target=\"_blank\" action=\"https://eztv.ag/search/\" method=\"POST\" name=\"search\" id=\"search\">" +
              //"<script type=\"text/javascript\">function search_submit_form( obj ) { $( '#' + obj ).click(); return false; }</script>" +
              "<input type=\"submit\" value=\"Search\" name=\"search\" id=\"search_submit\" style=\"display: none;\" />" +
              "<input type=\"hidden\" name=\"SearchString1\" value=\""
      html += query;
              
      html += "\" /><a href=\"javascript:void(0);\" onclick=\"parentNode.submit()\">";

      if (this.icon != "") {
        html += "<img width=\"14\" heigth=\"14\" border=\"0\" src=\"" + this.icon + "\" alt=\"" + this.shortname + "\">";
      } else {
        html += this.shortname;
      }
      html += "</a></form></font>";
      return html;
    }
  }
  
  function addDownloadWatchList(downloadURL) {
    // iterate through all series tables
    $("table.table-striped").each(function() {
      // Create Download column
      $(this).find("thead tr th").last().attr({ colspan: '2' });
      
      // Remove "Mark as watched" text
      $(this).find("span.show-for-medium-up").text("Mark as acquired");
      
      // Get series title
      var showTitle = $(this).parent().parent().prev().children("a").text();
      
      $(this).find("tbody tr").each(function() {
        // Get episode number
        var ep = $(this).find("td").first().text().split(":")[0].replace("x","E");
        var episode = (ep.split("E")[0].length > 1) ? "S" + ep : "S0" + ep;
        
        // Add download link to each episode
        $(this).append("<td style='width:40px'>" + downloadURL.getHTML(showTitle, episode) + "</td>");
      });
    });
    
  }
  
  function addDownloadEpisodeList(downloadURL) {
    // Get series title
    var showTitle = $("h1").text().replace(" - Episode List","");
    
    // iterate through all series tables
    $("table.table-striped").each(function() {
      // Alter "Watched" column header
      $(this).find("thead tr th").last().children("a").text("");
      
      // Create Download column
      $(this).find("thead tr").append("<th></th>");
      
      // Get Season
      var season = $(this).parent().prev().attr("name");
      
      $(this).find("tbody tr").each(function() {
        // Get episode number
        var episode = season + "E" + $(this).find("td").first().text();
        
        // Add download link to each episode
        $(this).append("<td style='width:5px'>" + downloadURL.getHTML(showTitle, episode) + "</td>");
      });
    });
  }
  
  
  // --------------- downloadURL --------------- 
  // FORMAT: Tracker(shortName, iconURL, searchURL, useNumbers)
  //     shortName - Alt display name for link
  //     iconURL - icon displayed for link created
  //     searchURL - URL that search string is appended to
  //     useNumbers - if true adds the episode number to the search URL
  var downloadURL = new Tracker("EZTV", "http://eztv.ag/favicon.ico", "https://eztv.ag/search/", false);
  //downloadURL = new Tracker("Kickass", "https://kastatic.com/images/favicon.ico", "https://kickass.to/usearch/?field=time_add&sorder=desc&q=ettv -720p -1080p ", false);
  // --------------- END OF downloadURL --------------- 

  if($("title").text().contains("Watch List")){
    addDownloadWatchList(downloadURL);
  } else if($("title").text().contains("Episode List")){
    addDownloadEpisodeList(downloadURL);
  }// else if($("title").text().contains("Episode")){
//    addDownloadEpisode(downloadURL);
//  }  
  
})();