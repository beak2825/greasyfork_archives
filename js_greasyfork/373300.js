// ==UserScript==
// @name         Remove Conundrum Attacks (MM Remix)
// @namespace    http://www.mattmorrison.co.uk/
// @version      0.2
// @description  Amalgamate multiple conundrum attacks on the apterous front page into one entry
// @author       Matt Morrison (inspired by Matty Artell)
// @match        https://www.apterous.org/index.php
// @match        https://www.apterous.org/
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373300/Remove%20Conundrum%20Attacks%20%28MM%20Remix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/373300/Remove%20Conundrum%20Attacks%20%28MM%20Remix%29.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    // ABUSE OPTIONS
    var abuse = true; // set to false to turn off
    var abuseList = ["fucking","bloody","shitting","stupid","meaningless and empty","yawn-inducing","vacuous","unremarkable"];
    var abuseWhen = 5; // minimum number of max games to abuse for

    // what to search for in the news entries to know we've found a max game we want to collect
    var delist = {
      "normal": "tied the high score for Conundrum Attack",
      "nice": "tied the high score for Nice Conundrum Attack"
    };

    // set up top level of object where we collect game data
    var maxes = {};
    $.each(delist, function(gametype, gamestring){
        maxes[gametype] = {};
    });

    // loop through every news item about high scores (all have hap_2 class)
    var news = $("ul.news_list li.hap_2");
    $.each(news, function(){
       var item = $(this);
       $.each(delist, function(gametype, gamestring){
          var itemtext = item.text().replace(/ +(?= )/g,''); // there is an issue with a double space in "tied the high score  for"!
          if (itemtext.indexOf(gamestring) > -1){

              // find all the links in this block and use them to collect the data we need
              var links = item.find("a");
              var thisgame = {};
              $.each(links, function(){
                  var url = this.href;
                  var text = $(this).text();

                  if (url.indexOf("viewuser.php?") > -1){
                      // user
                      thisgame.user = text;
                      thisgame.userlink = url;
                  } else if (url.indexOf("viewformat.php?") > -1){
                      // format
                      thisgame.format = text;
                      thisgame.formatlink = url;
                  } else if (url.indexOf("viewgame.php?") > -1 && text.indexOf("points") > -1) {
                      // the game
                      thisgame.score = text;
                      thisgame.gamelink = url;
                  }
              });

              // check if this person already has a max registered, if not create object
              if (typeof maxes[gametype][thisgame.user] === "undefined"){
                  maxes[gametype][thisgame.user] = {
                      "links" : {
                          "user": thisgame.userlink,
                          "format": thisgame.formatlink
                      },
                      "format" : thisgame.format,
                      "score" : thisgame.score,
                      "games" : []
                  };

                  // mark this item with the data we need later when amalgamating all the user's maxes in this format
                  item.addClass("maxSummary");
                  item.data("user",thisgame.user);
                  item.data("format",gametype);
              } else {
                  // mark this item for killing later since it's not the first occurrence of a max in this format for this user
                  item.addClass("killThisMax");
              }

              // record game
              maxes[gametype][thisgame.user]["games"].push(thisgame.gamelink);
          }
       });
    });

    // at this point all news items have been processed, and their data collected

    // kill the duplicates
    $(".killThisMax").remove();

    // replace each 'first time' with new almagamated content
    var firstTimers = $(".maxSummary");
    $.each(firstTimers, function(){
        var user = $(this).data("user");
        var format = $(this).data("format");

        var summary = "";

        // get data for this combination of user and format
        var data = maxes[format][user];
        var uid = data.links.user.substr(data.links.user.lastIndexOf("=")); // trim uid off the end of userlink, used for CSS class that highlights friends/yourself
        var gamecount = data.games.length;

        if (gamecount > 1){
            var gamelist = "";

            summary = "<a class='evergreen u"+uid+"' href='"+data.links.user+"'>"+user+"</a> tied the <a href='"+data.links.format+"'>"+data.format+"</a> high score "+gamecount;

            // abuse if required
            if (abuse && gamecount >= abuseWhen){
                var randomAbuse = abuseList[Math.floor(Math.random() * abuseList.length)];
                summary = summary.concat(" "+randomAbuse);
            }

            // create list of games
            var i;
            for (i = 0; i < gamecount; i++){
                if (i > 0){
                    gamelist = gamelist.concat(',<span style="font-size:5px"> </span>');
                }
                gamelist = gamelist.concat("<a href='"+data.games[i]+"'>"+(i+1)+"</a>");
            }
            summary = summary.concat(" times ("+gamelist+").");
        } else {
            // only one game, we can do something more simple (we could even have chosen to leave it as is, but I think cutting out the "20 maxes" bit is beneficial too)
            summary = "<a class='evergreen u"+uid+"' href='"+data.links.user+"'>"+user+"</a> tied the <a href='"+data.links.format+"'>"+data.format+"</a> high score with <a href='"+data.games[0]+"'>"+data.score+"</a>."
        }

        // replace it up
        $(this).html(summary);
    });

})(jQuery);