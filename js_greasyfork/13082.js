// ==UserScript==
// @name        MyEpisodes Downloader
// @description Adds download links to MyEpisodes website
// @namespace   https://greasyfork.org/en/users/814-bunta
// @include     *myepisodes.com/allinone*
// @include     *myepisodes.com/epslist*
// @include     *myepisodes.com/show*
// @include     *myepisodes.com/epsbyshow*
// @version     1.12.1
// @Author      Bunta
// @license     http://creativecommons.org/licenses/by-nc-sa/3.0/us/
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13082/MyEpisodes%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/13082/MyEpisodes%20Downloader.meta.js
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
    function Tracker(shortname, icon, searchurl, useNumbers, appendText='') {
      this.shortname = shortname;
      this.icon = icon;
      this.searchurl = searchurl;
      this.useNumbers = useNumbers;
      this.appendText = appendText;
      
      this.getHTML = function (query, episode) {
        var tShortname = this.shortname;
        var tIcon = this.icon;
        var tSearchURL = this.searchurl;
        var tUseNumbers = this.useNumbers;
        
        query = query.replace("'","");
        
        // Alter search or link parameters for special cases
        switch (query)
        {
          case "The Promised Neverland":
            query = "";
            tUseNumbers = false;
            tSearchURL = "https://animekaizoku.com/the-promised-neverland-season-2-39617/";
            tIcon = "https://animekaizoku.com/favicon.ico";
            tShortname = "Anime";
            break;
          case "That Time I Got Reincarnated as a Slime":
            query = "";
            tUseNumbers = false;
            tSearchURL = "https://animekaizoku.com/that-time-i-got-reincarnated-as-a-slime-season-2-39551/";
            tIcon = "https://animekaizoku.com/favicon.ico";
            tShortname = "Anime";
            break;
          case "World Trigger":
            query = "";
            tUseNumbers = false;
            tSearchURL = "https://nyaa.si/?f=0&c=1_2&q=World+Trigger+SSA";
            tIcon = "https://nyaa.si/static/favicon.png";
            tShortname = "Anime";
            break;
          case "Boku no Hero Academia":
            query = "";
            tUseNumbers = false;
            tSearchURL = "https://nyaa.si/?f=0&c=1_2&q=Boku+no+Hero+Academia";
            tIcon = "https://nyaa.si/static/favicon.png";
            tShortname = "Anime";
            break;
          case "Vinland Saga":
            query = "";
            tUseNumbers = false;
            tSearchURL = "https://nyaa.si/?f=0&c=1_2&q=vinland+saga";
            tIcon = "https://nyaa.si/static/favicon.png";
            tShortname = "Anime";
            break;
          case "Sword Art Online":
            query = "";
            tUseNumbers = false;
            tSearchURL = "https://nyaa.si/?f=0&c=1_2&q=sword+art+online+judas";
            tIcon = "https://nyaa.si/static/favicon.png";
            tShortname = "Anime";
            break;
          case "Tokyo Ghoul":
            query = "";
            tUseNumbers = false;
            tSearchURL = "https://nyaa.si/?f=0&c=1_2&q=tokyo+ghoul";
            tIcon = "https://nyaa.si/static/favicon.png";
            tShortname = "Anime";
            break;
          case "Attack on Titan":
            query = "";
            tUseNumbers = false;
            tSearchURL = "https://animekaizoku.com/attack-on-titan-the-final-season-40028/";
            tIcon = "https://animekaizoku.com/favicon.ico";
            tShortname = "Anime";
            break;
          case "Fairy Tail":
            query = "";
            tUseNumbers = false;
            tSearchURL = "https://nyaa.si/?f=0&c=1_2&q=fairy+tail";
            tIcon = "https://nyaa.si/static/favicon.png";
            tShortname = "Anime";
            break;
          case "Fairy Tail Zero":
            query = "";
            tUseNumbers = false;
            tSearchURL = "https://nyaa.si/?f=0&c=1_2&q=fairy+tail+zero";
            tIcon = "https://nyaa.si/static/favicon.png";
            tShortname = "Anime";
            break;
          case "Hunter x Hunter":
            query = "";
            tUseNumbers = false;
            tSearchURL = "https://nyaa.si/?f=0&c=1_2&q=hunter";
            tIcon = "https://nyaa.si/static/favicon.png";
            tShortname = "Anime";
            break;
          case "God Eater":
            query = "";
            tUseNumbers = false;
            tSearchURL = "https://nyaa.si/?f=0&c=1_2&q=god+eater";
            tIcon = "https://nyaa.si/static/favicon.png";
            tShortname = "Anime";
            break;
          case "Magi: The Labyrinth of Magic":
            query = "";
            tUseNumbers = false;
            tSearchURL = "https://nyaa.si/?f=0&c=1_2&q=magi+hatsuyuki+480";
            tIcon = "https://nyaa.si/static/favicon.png";
            tShortname = "Anime";
            break;
          case "Naruto: Shippuuden":
            query = "";
            tUseNumbers = false;
            tSearchURL = "https://nyaa.si/?f=0&c=1_2&q=naruto";
            tIcon = "https://nyaa.si/static/favicon.png";
            tShortname = "Anime";
            break;
          case "Boruto: Naruto Next Generations":
            query = "";
            tUseNumbers = false;
            tSearchURL = "https://nyaa.si/?f=0&c=1_2&q=boruto";
            tIcon = "https://nyaa.si/static/favicon.png";
            tShortname = "Anime";
            break;
          case "Kiseijuu":
            query = "";
            tUseNumbers = false;
            tSearchURL = "https://nyaa.si/?f=0&c=1_2&q=parasyte";
            tIcon = "https://nyaa.si/static/favicon.png";
            tShortname = "Anime";
            break;
          case "One Piece":
            query = "";
            tUseNumbers = false;
            //tSearchURL = "http://tracker.yibis.com/index.php";
            //tSearchURL = "https://nyaa.si/?f=0&c=1_2&q=one+piece";
            tSearchURL = "https://animekaizoku.com/one-piece-21/";
            tIcon = "https://animekaizoku.com/favicon.ico";
            tShortname = "Anime";
            break;
          default:
            break;
        }
        
        // Add episode numbers if enabled
        if(tUseNumbers){
            query = query + " " + episode;
        }
        
        var html = "<a target=\"_blank\" href=\"" + tSearchURL;  
        html += escape(query);
        html += appendText;
        html += "\">";
  
        if (tIcon != "") {
          html += "<img width=\"14\" height=\"14\" border=\"0\" src=\"" + tIcon + "\" alt=\"" + tShortname + "\">";
        } else {
          html += tShortname;
        }
        html += "</a>";
        return html;
      }
  
      // Used for old EZTV site POST process
      this.getEZTVHTML = function (query) {
        var html = "<font face=\"Verdana, Arial, Helvetica, sans-serif\" size=\"-2\">" +
          "<form target=\"_blank\" action=\"https://eztv.ag/search/\" method=\"POST\" name=\"search\" id=\"search\">" +
          // "<script type=\"text/javascript\">function search_submit_form( obj ) { $( '#' + obj ).click(); return false; }</script>" +
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
    
    function addDownloadAllInOne(downloadURL) {
      WaitForState("div#serieswatch table span.shows").done(function() {
        // iterate through series table
        var seriesTable = $("div#serieswatch").children("table");
  
        // Create Download column
        seriesTable.find("tr.header").append("<td style=\"border-bottom: solid 1px black;\">Download</td>");
  
        // iterate through rows
        seriesTable.find("tr[class!=header]").each(function() {
          // Get series title
          var showTitle = $(this).find("span.shows").text();
  
          // Get episode number
          var episode = $(this).find("td b").first().text().trim();
  
          // Add download link to each episode
          $(this).append("<td>" + downloadURL.getHTML(showTitle, episode) + "</td>");
        });
      });
    }
    
    function addDownloadEpisodeList(downloadURL) {
      WaitForState("div#myepisodes_views table.mylist").done(function() {
        // iterate through series table
        var seriesTable = $("div#myepisodes_views table.mylist");
        
        // Create Download column
        seriesTable.find("tr.header").append("<th title=\"Download\">D</th>");
  
        // iterate through rows
        seriesTable.find("tr[class!=header]").each(function() {
          // Get series title
          var showTitle = $(this).find("td.showname a").text();
  
          // Get episode number
          var episode = "S" + $(this).find("td.longnumber").text().replace("x", "E");
  
          // Add download link to each episode
          $(this).append("<td>" + downloadURL.getHTML(showTitle, episode) + "</td>");
        });
      });
    }
  
    function addDownloadEpisodesByShow(downloadURL) {
      WaitForState("div#myepisodes_views table.mylist").done(function() {
        var showTitle = $("div.showname").next().text()
        
        // iterate through series table
        var seriesTable = $("div#myepisodes_views table.mylist");
        
        // Create Download column
        seriesTable.find("tr.header").append("<th title=\"Download\">D</th>");
  
        // iterate through rows
        seriesTable.find("tr.odd, tr.even").each(function() {
            // Get episode number
            var episode = "S" + $(this).find("td.longnumber").text().replace("x", "E");
  
            // Add download link to each episode
            $(this).append("<td>" + downloadURL.getHTML(showTitle, episode) + "</td>");
        });
      });
    }
  
    function WaitForState(query) {
      var dfd = $.Deferred();
      window.setTimeout(function() {AttemptResolve(query, dfd);}, 100); // Doesn't work without a short delay
      return dfd;
    }
  
    function AttemptResolve(query, dfd) {
      if (query === "" || $(query).length) {
       dfd.resolve();
      } else {
       window.setTimeout(function() {AttemptResolve(query, dfd);}, 100); // Try again in a little bit
      }
    }

    function useSeenOnly() {
        acquiredLinks = $("div#serieswatch table tbody td a[href$='seen=0']");
        acquiredLinks.attr('href', function (i, attr) {
            return attr.replace('seen=0','seen=1');
        });
        // Dim "Coming" icons
        $("img[src*='coming.gif']").attr('style',"filter: sepia(50%) grayscale(70%);");
        // Enhance "Acquire" icons
        $("img[src*='acquire.gif']").attr('style',"filter: saturate(150%);");
    }
    
    // --------------- downloadURL --------------- 
    var downloadURL = new Tracker("EZTV", "https://eztv.ag/favicon.ico", "https://eztv.ag/search/", false);
    var downloadURL2 = new Tracker("IPT", "https://ipt.lol/favicon.ico", "https://iptorrents.com/t?99=&q=", false, "#torrents");
    //var downloadURL = new Tracker("Kickass", "https://kastatic.com/images/favicon.ico", "https://kickass.to/usearch/?field=time_add&sorder=desc&q=ettv -720p -1080p ", false));
    // --------------- END OF downloadURL ---------------
    var seenLinksOnly = false;
  
    if (window.location.href.indexOf("allinone") > -1) {
      addDownloadAllInOne(downloadURL);
      addDownloadAllInOne(downloadURL2);
      if (seenLinksOnly) { useSeenOnly(); }
    } else if (window.location.href.indexOf("epslist") > -1) {
      addDownloadEpisodeList(downloadURL);
    } else if (window.location.href.indexOf("show") > -1) {
      addDownloadEpisodesByShow(downloadURL);
    }
    
  })();