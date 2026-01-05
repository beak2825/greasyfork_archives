// ==UserScript==
// @name          Torrentz : The Bobcat add-on
// @namespace     http://torrentzBobCat
// @homepage      http://www.youtube.com/watch?v=1QyuIDw0CIw&feature=youtu.be
// @description   Torrentz.eu: Add IMDB ratings, download links, movie plot/actors, and other goodies. Also features an light built-in serie tracker. Torrentz gets so much simpler and efficient! Demo video here: http://www.youtube.com/watch?v=1QyuIDw0CIw&feature=youtu.be
// @author        CoolMatt
// @version        1.6.1
// @grant         GM_xmlhttpRequest
// @include       *://torrentz.*
// @match         *://torrentz.com/*
// @match         *://torrentz.eu/*
// @match         *://torcache.net/*

// @downloadURL https://update.greasyfork.org/scripts/2319/Torrentz%20%3A%20The%20Bobcat%20add-on.user.js
// @updateURL https://update.greasyfork.org/scripts/2319/Torrentz%20%3A%20The%20Bobcat%20add-on.meta.js
// ==/UserScript==
// @date    19 Jun 2013
// @license    GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html


//Define the namespace
var Torrentz = Torrentz || {};
Torrentz.GM = {};
Torrentz.GM.BobCatTorrentz = {};

Torrentz.GM.BobCatTorrentz = {

    //Store info about movies of the page
    PageCache_movieInfo: {},

    //Lookup table [torrentId -> movieKey] - as several torrents can point at the same movie info
    PageCache_lk_id_info: {},

    start: function () {
        // Load and inject css
        initCss();

        // Add the 'bobcat touch'
        this.addBadgeAndButtons();

        //// Prevent scripts to bounce you to another page
        //window.onbeforeunload = function () {
        //    return "Exit this page?";
        //};

        // Hide visual spam
        $("div.cloud").hide();

        // Load store
        var moviesStore = Enbalaba.GetLocalStore("moviesInfo"),
            moviesData = moviesStore.get(),
            that = this,
            results;

        //Calculate cache size and clear it if too big
        this.checkCacheSize(moviesStore);

        //Get rid of this incredibly annoying & ridiculous advertising banner
        $("body>iframe:first").hide();

        // Append download modal
        $("body").append("<div id=\"downloadModalOverlay\"></div><div id=\"downloadModal\"><p>Click a link below in order to download your torrent</p><div class=\"torrentContainer\"></div></div");
        $("#downloadModal,#downloadModalOverlay").click(function (e) { $("#downloadModal,#downloadModalOverlay").hide(); });

        //Start processing of the rows
        results = $(".results");

        results.find("h3:first").append("<span>|&nbsp</span><b title='IMDB Rating. Brought to you by the Torrentz Dominion Plugin'>Rating</b>");
        results.children("dl").each(function (index) {
            that.processRow($(this), moviesData, false);
        });

        //Add events for when the row is clicked
        results.find("dt").click(function () {
            var dt = $(this),
                divDesc = dt.find(".movieDesc"),
                info = null,
                text, id, divQuality, lk, aElement;

            if (divDesc.length == 0) {
                // First time the user clicks here
                // Init the description container
                aElement = dt.children("a:first");
                if (aElement.length == 0) return;
                id = aElement.attr("href").substr(1).toUpperCase();
                if (!id) return;

                //Query cache to retrieve movie info
                if (that.PageCache_lk_id_info[id]) {
                    info = that.PageCache_movieInfo[that.PageCache_lk_id_info[id]];
                }

                if (info) {
                    // Info found in cache
                    text = "<div class='plot'><b>Plot</b>: " + info.Plot + "</div><div class='actorsInfo'> <b>Actors</b>: " + info.Actors + "</div>";
                }
                else {
                    //No info > display the title
                    text = aElement.attr("title");
                }

                divDesc = $("<div class='movieDesc'>" + text + "</div>");

                divQuality = $("<div class='divQuality'></div>");
                lk = $("<div class='hyperlink fleft'>See user comments</div>");
                lk.hover(function (e) {
                    if ($(this).data('processed')) return;
                    that.getQuality($(this.parentNode), aElement.attr("href")); e.stopPropagation(); $(this).hide();
                    $(this).data('processed', true);
                });

                divQuality.append(lk).append($("<img class='spinner fleft'></div><div class='qualityComments'><div/>").hide());
                divDesc.append(divQuality).hide();
                dt.append(divDesc);
            }

            // Animate the pane
            if (divDesc.is(":hidden")) {
                divDesc.children().hide();
                divDesc.slideDown(200, function () { divDesc.children().show(); });
                dt.children(".expand").addClass("collapse");
            }
            else {
                divDesc.slideUp();
                dt.children(".expand").removeClass("collapse");
            }
        });

        // Once a day, the serie tracker check if there are new episodes available
        this.checkForNewEpisodes();
    }

    , processRow: function (row, moviesData, isIFrameDownload) {
        if (!row) return;
        var tags = null,
            lk = row.find("dt>a"),
            name, torrentId;

        if (lk.length > 0) {
            var id = lk.attr("href").substr(1).toUpperCase(),   //Get id from href
                info = lk.parent().text(),
                index = info.indexOf('\u00BB'), //Look for the utf-8 character >> in the row
                rightCol = row.find("dd"),
                torrentId = lk.attr("href").substr(1).toUpperCase(),
                type, year;

            rightCol.addClass("actionAndStatsColumns");
            row.find("dt").css("width", "600px");

            if (index > -1) {
                tags = info.substr(index + 1);
                name = info.substr(0, index);
            }
            lk.attr("title", tags ? "Tags: " + tags : info).parent().html(lk); //Remove info to make some room

            type = this.getType(name, tags);
            if (this.isTVSerie(name)) {
                type = "tv"; //extra verification as sometimes a tv serie is not tagged as such
            }
            if (type == "movie") {
                if (!moviesData) return;
                lk.css('color', '#3F14FF');

                var yearIndex = name.search(/\s[0-9]{4}\s/); //Year is mandatory
                if (yearIndex != -1) {
                    year = name.substr(yearIndex + 1, 4);
                    name = name.substr(0, yearIndex);
                    //console.log(name + ":" + year);

                    info = moviesData[(name + year).toLowerCase()]; //Search in cache
                    if (info) {
                        this.PageCache_movieInfo[(name + year).toLowerCase()] = info;
                        this.PageCache_lk_id_info[id] = (name + year).toLowerCase();

                        lk.text(name + " " + year);
                        rightCol.append($("<a class='rateBox' " + (info.ImdbID && info.ImdbID != "" ? "target='_blank' href='http://www.imdb.com/title/" + info.ImdbID + "'" : "") + " >" + info.ImdbRating + "</a>"));
                    }
                    else {
                        this.searchIMDBinfo(
                            name,
                            year,
                            torrentId,
                            function (movieData) {
                            // Add rating link in the DOM
                            rightCol.append($("<a class='rateBox' " +
                                (movieData.ImdbID ? "target='_blank' href='http://www.imdb.com/title/" + movieData.ImdbID + "'" : "") +
                                " >" + movieData.ImdbRating + "</a>"));
                        });
                    }
                }
            }

            else if (type == "tv") {
                lk.css('color', 'black' /*'#47D4FF'*/);
            }
            else {
                lk.css('color', '#555');
            }
            //Add download link
            rightCol.prepend('<a class="downloadLink hyperlink" style="float:left" href="http://torcache.net/torrent/' + id + '.torrent" target="_blank" rel="nofollow">Download</a>');
            // 
            lk.parent().prepend("<div class='expand fleft'></div>");
        }
    }

    , getType: function (name, tags) {
        if (tags.indexOf("movies") > -1) return "movie";
        else if (tags.indexOf("tv") > -1) return "tv";
        else if (tags.indexOf("games") > -1) return "game";
    }
    /*As sometimes the tv serie is not tagged as such. This test will help catch those ones*/
    , isTVSerie: function (fullName) {
        return (
            new RegExp(/[sS][0-9]+[eE][0-9]+/).test(fullName)
        || new RegExp(/[0-9]+[x][0-9]+/).test(fullName)
        || new RegExp(/season[\s]?[0-9]{1,2}[\s]/i).test(fullName)
        );
    }

    /* Make a query to the IMDB database to get data for the specified movie*/
    , searchIMDBinfo: function (name, year, torrentId, successCallback, isRetry) {
        var url = encodeURI("http://www.omdbapi.com/?t=" + name + "&y=" + year + "&plot=full&r=json"),
            that = this;
        // Cross the same origin policy boundaries: Torrentz (https) to IMDB (http)
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function (response) {
                var obj = $.parseJSON(response.responseText),
                    moviesStore, moviesData, movieData;

                if (obj) {
                    if (obj.imdbRating) {
                        // That's a legit object
                        moviesStore = Enbalaba.GetLocalStore("moviesInfo");
                        moviesData = moviesStore.get();
                        if (moviesData) {
                            refName = (name + "&y=" + year).toLowerCase();
                            movieData = {
                                ImdbRating: obj.imdbRating,
                                Plot: obj.Plot,
                                Actors: obj.Actors,
                                ImdbID: obj.imdbID,
                                Poster: obj.Poster,
                                Genre: obj.Genre,
                                Runtime: obj.Runtime,
                                Metascore: obj.Metascore
                            };

                            // Store in cache
                            that.PageCache_movieInfo[refName] = movieData;
                            // Link the torrent id to a movie data key in the movie cache (several torrent can point at the same key)
                            that.PageCache_lk_id_info[torrentId] = refName;

                            // Save in store
                            moviesData[refName] = movieData;
                            moviesStore.set(moviesData);
                        }
                        if (typeof successCallback === "function") {
                            successCallback(movieData);
                        }
                    } else if (obj.Response == "False") {
                        if (isRetry != true) {
                            //Tries a second search, if applicable
                            var name2 = name.replace(/thats/gi, "that's")
                                            .replace(/it's/gi, "its")
                                            .replace(/spiderman/i, "spider man")
                                            .replace(/extended$/i, "");
                            if (name2 != name) {
                                that.searchIMDBinfo(name2, year, torrentId, successCallback, true);
                                return;
                            }
                        }
                        // Display error in console
                        console.info(name + ": " + obj.Error);
                    }
                }
            }
        });


        return;
    }

     , tempID: 0
     , getQuality: function ($qualityDiv, url) {

         url = "https://torrentz.eu" + url;
         //console.info(url);
         $qualityDiv.find(".spinner").show();
         var id = "divComment" + (this.tempID++);
         $("<div style='display:none' id='" + id + "'></div>").load(url, function (data) {
             var comments = $(data).find("div.comment .com"),
                 qualityComments = [];

             for (var i = 0, comment; i < comments.length; i++) {
                 comment = $(comments[i]).text();
                 if (comment.length > 400) comment = comment.substr(0, 400) + " (...)";
                 qualityComments.push(comment);
             }
             $qualityDiv.find(".spinner").hide();
             $qualityDiv.find(".qualityComments").show().html("<b>User comment:</b><br/>" + qualityComments.join("<br/>"));
             $(id).empty(); //free memory of the temporary div
         });
     }

    /*
     * Calculate cache size and clear it if too big
     */
 , checkCacheSize: function (moviesStore) {
     var cacheSize,
         k,
         that = this,
         moviesData = moviesStore.get();

     try {
         //Works in all recent browsers
         cacheSize = Object.keys(moviesData).length;
     }
     catch (err) {

         cacheSize = 0;
         for (k in moviesData) {
             if (moviesData.hasOwnProperty(k)) cacheSize++;
         }
     }
     console.log("Bobcat - Cache size:" + cacheSize);
     if (cacheSize > 150) {
         //Clear the cache from time to time
         moviesStore.set({});
         console.info("Bobcat - Movie cache cleared");
     }
 }

    /*
     * Add badges and buttons
     */
  , addBadgeAndButtons: function () {
      //Add bobcat badge in the top banner
      $("div.top").append("<div id='bobcatLogoContainer' class='bobcatLogo'><a href='http://www.youtube.com/watch?v=1QyuIDw0CIw&feature=youtu.be'>with the Bobcat add-on</a></div>");

      //Add serie tracker button
      var btST = $("<button type='button' id='btSerieTracker' class='bcButton bobcatStamp'>Serie Tracker</button>"),
          that = this;
      btST.click(function () { that.onclick_btSerieTracker(); });
      $("div.results h2").append(btST);
      //this.onclick_btSerieTracker(); //~~ Uncomment when developping serie tracker
  }

    //---------------------
    //-----SERIE TRACKER---
    //---------------------
  , _ddSeasonHTML: ""
  , _ddEpisodeHTML: ""
  , onclick_btSerieTracker: function () {
      if (!this.SerieTrackerMode) {
          $("div.results h3").nextAll().hide();
          $("div.recent").hide();
          $("#serieContainer").show();
          $("#btSerieTracker").text("Return to List");
          if (this.SerieTrackerMode == null) { //init serie tracker

              var serieTrakerLastCheckedStore = Enbalaba.GetLocalStore("serieTrackerLastCheck")
            , serieTrakerLastChecked = serieTrakerLastCheckedStore.get();
              serieTrakerLastCheckedStore.set({ FoundNewEpisodes: false, LastChecked: encodeDate(new Date()) });
              delete serieTrakerLastCheckedStore;

              var serieStore = Enbalaba.GetLocalStore("trackedSeriesInfo"), serieInfo = serieStore.get();
              if (!serieInfo.Ids) serieStore.set({ Ids: [], CurrentId: 1 });

              $("div.results").after("<div class='results' id='serieContainer'><dl></dl><div id='addSerieContainer' style='float:left;position:relative;'> <h2>Track a new Serie</h2>"
              + "<div class='row'><div class='col1'><label>Name</label></div><div  class='col2'><input type='text' id='st_tbNameNew' class='bcTextbox'/></div> <div class='col3'><span id='st_lblSuggestion'></span></div></div>"
              + "<div class='row'><div class='col1'><label>Season</label></div><div  class='col2'><select id='st_ddSeasonNew' class='bcSelect'><option></option></select></div></div>"
              + "<div class='row'><div class='col1'><label>Episode</label></div><div  class='col2'><select id='st_ddEpisodeNew' class='bcSelect'><option></option></select></div></div>"
              + "<button type='button' id='btAddSerie' class='bcButton'>Add This Serie</button><span id='st_lblOutput' style='color:red'></span><br/>"
              + "<input type='checkbox' id='cbIsFinishedSeason'/><label for='cbIsFinishedSeason'>I know this season is finished and has </label><input type='input' id='tbSeasonNbEpisodes' style='width:20px' maxlength=2 value='20'/> episodes</div>"
              //+ "<div id='st_lblNotes' style='position:absolute;top:30px;left:30px' >Bobcat-Torrentz will check once a day for new episodes of tracked series<div/>"
              + "</div>"
              + "<div style='clear:both;cursor:pointer' id='st_btDeleteAll' >Delete All Tracked Series<div/>"
              + "<div style='width:500px;border-radius:6px; border-size:1px;margin-top:25px'>The Bobcat addon will check once a day your tracked series for new episodes.<br/><img src='http://i.imgur.com/n7tvk8I.png'/>: New episode(s)<br/><img src='http://i.imgur.com/tDWKswF.png'/>: No new episodes</div>");
              //$("div.note").css("width", "400px").html("The Bobcat addon will check once a day your tracked series for new episodes.<br/><img src='http://i.imgur.com/n7tvk8I.png'/>:New episode(s)<br/><img src='http://i.imgur.com/tDWKswF.png'/>: No new episodes");

              /*Populate dropdowns*/
              var i, htmlddSeasons = "", htmlddEpisodes = "";
              for (i = 1; i < 16; i++) htmlddSeasons += "<option value='" + i + "'>" + i + "</option>";
              for (i = 1; i < 31; i++) htmlddEpisodes += "<option value='" + i + "'>" + i + "</option>";
              $("#st_ddSeasonNew").html(htmlddSeasons);
              $("#st_ddEpisodeNew").html(htmlddEpisodes);


              htmlddSeasons = ""; //blank variable because of closures
              htmlddEpisodes = "";

              /*Display Series*/
              this.displayTrackedSeries();

              /*Search for new*/
              this.searchForNewEpisodes(this.episodeFoundCallback);

              /*Add Serie event*/
              var that = this;
              $("#btAddSerie").click(function () {
                  var name = $("#st_tbNameNew").val();
                  if ($.trim(name) == "") {
                      $("#st_lblOutput").text("Enter a Name");
                  }
                  else { //---ADDITION
                      var store = Enbalaba.GetLocalStore("trackedSeriesInfo"), serieInfo = store.get()
                      , id = serieInfo.CurrentId;
                      serieInfo.CurrentId = id + 1;
                      serieInfo.Ids.push(id);
                      store.set(serieInfo);

                      var store = Enbalaba.GetLocalStore("ts_" + id)
                      , isFinished = $("#cbIsFinishedSeason").is(":checked")
                      , serie = { Name: name, Season: parseInt($("#st_ddSeasonNew").val(), 10), Current: { e: parseInt($("#st_ddEpisodeNew").val(), 10) }, History: [], id: id };
                      if (isFinished) {
                          serie.isFinished = true;
                          serie.NbTotEpisodes = parseInt($("#tbSeasonNbEpisodes").val(), 10);
                          if (isNaN(serie.NbTotEpisodes)) { alert("Enter a valid number of episodes"); return; }
                      }
                      store.set(serie);

                      that.displayTrackedSeries();
                      that.searchForNewEpisodes(that.episodeFoundCallback);
                      //that.displayTrackedSeries(serieStore);
                      $("#st_lblOutput").text("");
                  }
              });

              $("#st_lblSuggestion").click(function () {
                  $("#st_tbNameNew").val($(this).text());
              });
              // Logic serie name live suggestions
              $("#st_tbNameNew").keypress(function (e) {
                  if (e.keyCode >= 20 && e.keyCode <= 40 && e.keyCode != 32) return true; //arrows, shift, and other keys that don't change the input. 32 is 'space'
                  var txt = $(this).val();
                  if (txt.length >= 3) {
                      var url = encodeURI("https://torrentz.eu/suggestions.php?q=" + $.trim(txt));
                      $("<span></span>").css("display", "none").load(url, function (data) {
                          var res = $.parseJSON(data);

                          if (res && res.length == 2 && res[1] != null && res[1].length > 0) {
                              console.log(res[1][0]);
                              $("#st_lblSuggestion").text(res[1][0]);
                          }
                          else $("#st_lblSuggestion").val("-");
                      });
                  }
              });
              $("#st_btDeleteAll").click(function () {
                  if (confirm("Do you want to delete all the currently tracked series ?")) {
                      Enbalaba.GetLocalStore("trackedSeriesInfo").set({ Ids: [], CurrentId: 1 });
                      that.displayTrackedSeries();
                  }

              });

          }
          this.SerieTrackerMode = true;

      }
      else {
          // Back to the list of torrents
          this.SerieTrackerMode = false;
          $("div.results h3,div.recent").nextAll().not("#downloadModal,#downloadModalOverlay").show();
          $("#serieContainer").hide();
          $("#btSerieTracker").text("Serie Tracker");
      }
  }

  , displayTrackedSeries: function () {
      var serieIds = Enbalaba.GetLocalStore("trackedSeriesInfo").get().Ids;
      var dl = $("#serieContainer dl");

      dl.empty();
      for (var i = 0, serie, id; i < serieIds.length; i++) {
          this.displaySerie(serieIds[i]);
      }
  }

  , displaySerie: function (serieId) {
      var serie = Enbalaba.GetLocalStore("ts_" + serieId).get(), time
      , hasNew = false;

      if (!serie.History) serie.History = [];

      var html = "<div class='trackedSerieContainer'  data-id='" + serie.id + "'>"
        + "<div class='trackedSerieHeader'>"
        + "<div class='st_name st-col1'>"
        + "<div class='deleteIcon fleft' data-id='" + serie.id + "' title='delete' style='margin-right:2px'></div>"
        + serie.Name + "</div>"
        + "<div class='st-col2'><b>Season " + serie.Season + "</b></div>"
        + "<div class='episode st-col3'><b>" + (serie.History.length > 0 ? "Episode " + serie.History[0].e : " - ") + "</b></div>"
        + "<div class='st-col4'>" + (serie.isFinished ? "" : "Tracking: On") + "</div>"
        + "</div>"
        + "<div class='trackerSerieBody' style='display:none'>";

      //History

      if (serie.History.length == 0) {
          html += "<div style='margin-left:50px'>No results found</div>";
      }
      else {
          for (var j = 0, h, d, l = serie.History.length; j < l; j++) {
              h = serie.History[j];
              d = (h.d ? new Date(new Date() - getDateFromDateString(h.d)) : null);

              if (d) {
                  if (d.getMonth() > 0) {
                      dif = d.getMonth() + " month" + (d.getMonth() == 1 ? "" : "s") + " ago";
                  }
                  else {
                      time = d.getDate() - 1;
                      if (time == 0) {
                          time = "today";
                          hasNew = true;
                      }
                      else time += " days ago";
                  }
              }
              html += "<div class='st-row' data-serieData='" + (serie.id + "_" + h.e) + "'><div class='st-col1'>&nbsp</div> <div class='st-col2'>Episode " + h.e + "</div><div class='st-col3'>"
              + (h.f ? "<span class='st-btShowLk hyperlink'>Show Links<span>" : "<span>Not found</span>") + "</div>"
              + "<div class='st-col4'>" + time + "</div>"
              + "</div> ";
          }
      }
      html += "</div></div>";
      var el = $("#serieContainer .trackedSerieContainer").filter(function () { return $(this).data("id") == serieId; }), newEl = $(html);
      delete html; //for the closure

      if (el.length > 0) el.empty().replaceWith(newEl);
      else $("#serieContainer dl").append(newEl);

      var that = this;

      newEl.find("div.deleteIcon").click(function (e) { e.stopImmediatePropagation(); that.onclick_deleteTrackedSerie(this); });
      newEl.find("span.st-btShowLk").click(function (e) { that.onclick_showLinks(this); });
      newEl.find("div.trackedSerieHeader").addClass(hasNew ? "hasNew" : "").click(function (e) { that.onclick_serieHeader(this); });

  }

    // Once a day, the serie tracker check if there are new episodes available.
    , checkForNewEpisodes: function () {
        var serieTrakerLastCheckedStore = Enbalaba.GetLocalStore("serieTrackerLastCheck"),
            serieTrakerLastChecked = serieTrakerLastCheckedStore.get(),
            today = encodeDate(new Date());

        if (!serieTrakerLastChecked || serieTrakerLastChecked.LastChecked != today) {
            //Start daily search
            serieTrakerLastCheckedStore.set({ FoundNewEpisodes: false, LastChecked: today });
            this.searchForNewEpisodes(this.episodeFoundCallback_2);
        }
        else if (serieTrakerLastChecked.FoundNewEpisodes) {
            //A search was previously done, but the user didn't go to the serie tracker. Add a specific icon to signal new episode available.
            $("#btSerieTracker").css("color", "Blue").removeClass("bobcatStamp").addClass("bobcatStamp2");
        }
    }

  , searchForNewEpisodes: function (callback) {

      var serieInfo = Enbalaba.GetLocalStore("trackedSeriesInfo").get()
      , that = this
      , today = encodeDate(new Date());

      if (serieInfo && serieInfo.Ids) {
          for (var i = 0, store, serie, search, ids = serieInfo.Ids; i < ids.length; i++) {
              //serie = series[i];
              store = Enbalaba.GetLocalStore("ts_" + ids[i]);
              serie = store.get();
              if (!serie.isFinished || serie.History.length == 0) {

                  this.lookForEpisode(serie, serie.Current.e, callback, store);
              }
          }
      }
  }

   , lookForEpisode: function (serie, episode, callback, store) {
       var search = serie.Name + " S" + (serie.Season < 10 ? "0" : "") + serie.Season + "E" + (episode < 10 ? "0" : "") + episode
      , url = encodeURI("https://torrentz.eu/search?f=" + search)
      , that = this;
       //console.info(url);
       search = search.toLowerCase();
       $("<span></span>").css("display", "none").load(url, function (data) {
           var rows = $(this).find("div.results dl"), results = [];
           //console.info(rows.length + " results");

           for (var i = 0, $row, txt; i < rows.length; i++) {
               $row = $(rows[i]);
               txt = $row.find("dt").text().toLowerCase();
               if (txt.indexOf(search) > -1) { //we need to be sure the results returned are related to the search
                   results.push($row);
               }
           }
           if (callback) callback(serie, episode, results, store, that);
           $(this).empty(); //free memory of the temporary div
       });
   }

  , episodeFoundCallback: function (s, e, results, store, context) {

      if (results.length < 1) { //NO EPISODE FOUND
          if (s.isFinished && e < s.NbTotEpisodes) {
              s.History.splice(0, 0, { e: e, f: false, d: encodeDate(new Date()) }); //insert new entry in history - at the begining
              s.Current.e = parseInt(s.Current.e, 10) + 1;
              store.set(s);
              context.displaySerie(s.id); //redisplay the result for the serie
              context.lookForEpisode(s, e + 1, context.episodeFoundCallback, store); //rec
          }
      }
      else { //EPISODE FOUND
          //console.info("New episode Found for " + s.Name);
          //New episode found
          s.History.splice(0, 0, { e: e, f: true, d: encodeDate(new Date()) }); //insert new entry in history - at the begining
          s.Current.e = parseInt(s.Current.e, 10) + 1;
          store.set(s);
          context.displaySerie(s.id); //redisplay the result for the serie
          var el = $("#serieContainer .trackedSerieContainer").filter(function () { return $(this).data("id") == s.id; });
          el.find(".trackedSerieHeader").css("color", "Blue");

          context.lookForEpisode(s, s.Current.e, context.episodeFoundCallback, store); //rec
      }
  }

    // Function called the first time the user visit torrentz in the day, 
    // even if he hasn't entered the Section Tracker section
  , episodeFoundCallback_2: function (s, e, results) {
      if (results.length > 0) {
          var serieTrakerLastCheckedStore = Enbalaba.GetLocalStore("serieTrackerLastCheck")
            , serieTrakerLastChecked = serieTrakerLastCheckedStore.get();

          $("#btSerieTracker").css("color", "Blue"); //.text("Serie Tracker ( New Episodes! )");
          serieTrakerLastCheckedStore.set({ FoundNewEpisodes: true, LastChecked: encodeDate(new Date()) });
      }
  }

  // Handler for when a followed-serie header is clicked
  , onclick_serieHeader: function (headerEl) {
      headerEl = $(headerEl);
      var body = headerEl.parent().children(".trackerSerieBody");
      if (body.is(":visible")) {
          body.slideUp(200, function () { });
      }
      else body.slideDown(200, function () { });
  }
  // Handler for when the user clicks on "Show Links"
  , onclick_showLinks: function (lk) {

      lk = $(lk);
      var row = lk.parent().parent()
      , that = this
      , data = row.data("seriedata"), dataParts; //row store some data : serieId_episodeNumber
      var existingBox = row.parent().children(".st-link-container").filter(function () { return $(this).data("seriedata") == data; });
      if (existingBox.length != 0) {
          existingBox.remove();
      }
      else {
          if (data) {
              dataParts = data.split('_'); //format: "serieId _episodeNumber"
              var serie = this.getSerieFromStore(dataParts[0]);

              this.lookForEpisode(serie, dataParts[1], function (s, e, results) {

                  var html = "<div class='st-link-container' data-seriedata='" + data + "'>",
                      max = (results.length < 3 ? results.length : 3);
                  for (var i = 0; i < max; i++) { //show only 3 first
                      r = results[i];
                      that.processRow(r, null, true);
                      html += "<div class='st-row'><div class='st-link-col1'>" + r.find("dt").html() + "</div>";
                      html += "<div class='st-link-col2'>" + r.find("dd").html() + "</div> ";
                      html += "</div>";
                  }
                  var linkContainer = $(html);
                  row.after(linkContainer);
              });
          }
      }
  }
   , onclick_deleteTrackedSerie: function (element) {
       //serie deletion

       var name = $(element).parent().text(), id = $(element).data('id');
       if (confirm("Are you sure you want to delete the entry for '" + name + "'")) {

           var store = Enbalaba.GetLocalStore("trackedSeriesInfo"), serieInfo = store.get();
           serieInfo.Ids = $.grep(serieInfo.Ids, function (value) { return value != id; });
           store.set(serieInfo);

           store = Enbalaba.GetLocalStore("ts_" + id); //.get();
           store.set({}); //TODO : real deletion
           this.displayTrackedSeries();
           //console.info("deleted");
       }
       //else console.info("Not deleted");
   }

  , getSerieFromStore: function (id) {
      var serieStore = Enbalaba.GetLocalStore("ts_" + id), serie = serieStore.get();
      return serie;
  }

}

//Basic Class to deal with the localstorage
Enbalaba = {};

//Add CSS
function initCss() {
    var css = [
        " .rateBox{ margin-left:10px;position:relative;bottom:0; cursor: pointer; padding:1px; background-color:#EEE; border:#AAA solid 1px; border-radius:4px}"
        , ".bobcatLogo{background:transparent url(http://i.imgur.com/MlVVyzX.png) no-repeat scroll 0 0}"
        , "#bobcatLogoContainer a{color:White}"
        , "#bobcatLogoContainer a:hover{color:White}"
        , ".bobcatStamp{background:transparent url(http://i.imgur.com/tDWKswF.png) no-repeat scroll 0 0}"
        , ".bobcatStamp2{background:transparent url(http://i.imgur.com/n7tvk8I.png) no-repeat scroll 0 0}"
        , "#bobcatLogoContainer{color:White;height:30px;width:200px;float:left;padding-left:50px;padding-top:5px; margin-top:10px;font-size:12px}"
        , ".downloadLink{margin-right:20px}"
        , ".moreLk{padding-left:30px;cursor:pointer}"
        , ".movieDesc{width:530px;margin:10px 0px 40px 0px;color:Black;white-space:normal}"
        , ".fleft{ float:left}"
        , "dd.actionAndStatsColumns{ width:480px !important; overflow:hidden;}"
        , "dt:hover{ background-color:#EEE}"
        , ".qualityComments{float:clear}"
        , ".spinner{ background:url(http://www.andrewdavidson.com/articles/spinning-wait-icons/wait16trans.gif) no-repeat left center;width: 16px;height: 16px}"
        , ".actorsInfo,.qualityComments,.divQuality,.plot{ margin-top:11px;margin-bottom:5px; font-size:12px;font-family:Verdana,Tahoma,sans-serif}"
        , "#pluginZoneContainer{ position:absolute; left: 210px; top:10px; width: 200px; height: 200px;background-color:Gray}"
        , ".expand{  background:transparent url(http://i.imgur.com/mIIop2R.png) no-repeat scroll 0 0; width:15px; height: 9px; position: relative; top:3px}" //arrow1.png
        , ".deleteIcon{  background:transparent url(http://i.imgur.com/4RjuUFU.png) no-repeat scroll 0 0; width:15px; height: 13px; position: relative; top:3px}"
        , ".downloadIcon{  background:transparent url(http://i.imgur.com/7Jkx1N9.png) no-repeat scroll 0 0; width:17px; height: 18px; position: relative; top:3px}"
        , ".deleteIcon:hover{ background-color:#CCC}"
        , ".collapse{  background-image:url(http://i.imgur.com/apcKFJ5.png)}"//arrow2.png
        , "#downloadModal{ position: fixed; left: 20%; top:200px; width: 720px; height: 160px; background-color: white; border:8px solid #DDD; border-radius: 6px;padding: 15px; display:none}",
        , "#downloadModalOverlay{ position: fixed;top:0;left:0;width:100%;height:100%;background-color: rgb(100,100,100);filter: alpha(opacity=80);opacity:0.8; display:none}",
        , ".torrentContainer{white-space: nowrap; overflow: hidden; margin: 20px 0}"
        , ".torrentContainer li{ margin-bottom: 15px}"

        , ".btSerieTrackerHighlight{color:Yellow !important}"
        , "#btSerieTracker{ padding-left:40px;margin-left:20px; background-color:White;background-position:3px 3px}"
        , "#addSerieContainer{ width:50%;   border: 1px solid #B5B8C8; margin: 30px 0px; padding:20px; border-radius: 15px}"
        , "#st_tbNameNew{ width : 150px}"
        , "#btAddSerie{ margin: 10px 0px}"
        , "#cbIsFinishedSeason{margin-right:7px}"
        , "#st_lblSuggestion{ color:Grey; font-size:11px;cursor:pointer}"
        , ".trackedSerieHeader{ margin: 15px 0px}"
        , ".trackedSerieHeader,.st-row{clear:both;width:100%;font-size:12px;height:15px}"
        , ".trackedSerieHeader>div,.st-row>div{ margin-right:30px;float:left}"
        , ".st-col1{ width:200px}"
        , ".st-col2,.st-col3{ width:100px}"
        , ".st-link-col1{width:500px}"
        , ".st_name{font-weight:bold}"
        , " .st-link-container{margin:10px; border:1px solid #AAA;padding:20px}"
        , ".st-link-col2 span{ margin-right:10px}"
        , ".st-link-col2 .u{ font-weight:bold}"
        , "div.trackedSerieHeader{cursor:pointer}"
        , "div.trackedSerieHeader:hover{ background-color:#EEE}"
        , ".hasNew{color:Blue}"

    //Generic
        , ".hyperlink{color:#0066EE;text-decoration:none;cursor:pointer;text-decoration:underline}"
        , ".bcButton{color:#6B3F2E; border-radius: 6px; border: 1px solid #6B3F2E; height:25px; padding-bottom:1px; min-width:80px; font-weight:bold;cursor:pointer}"
        , ".bcButton:hover{color:#AA3F2E; }"
        , ".bcTextbox{background-color:#FFF;border: 1px solid #B5B8C8; font-size: 14px; height: 16px;  line-height: 14px; padding: 2px; vertical-align: middle;border-radius: 5px; color:color:#6B3F2E}"
        , ".bcSelect{ background-color:#FFFFFF;height:26px;line-height:26px;border:1px solid #CCCCCC;color:Black;font-size:16px;    padding:4px;border-radius:5px}"
        , " .col1{ float:left; width:100px; }"
        , ".col2{ float:left; width:200px}"
        , ".col3{ float:left; width:200px}"
        , ".row{ clear:both; width : 500px; margin:10px 0px; padding-bottom:20px}"
    ];
    css = css.join("\n");
    if (typeof GM_addStyle != "undefined") GM_addStyle(css);
    else if (typeof PRO_addStyle != "undefined") PRO_addStyle(css);
    else if (typeof addStyle != "undefined") addStyle(css);
    else {
        var heads = document.getElementsByTagName("head");
        if (heads.length > 0) {
            var node = document.createElement("style");
            node.type = "text/css";
            node.appendChild(document.createTextNode(css));
            heads[0].appendChild(node);
        }
    }
}

/* Parse a string with a basic format (yyyyMMdd HHmmss) to a date object */
function getDateFromDateString(dateString, isUTCDate) {
    try {
        //This is for Javascript to understand format 'yymmdd hhmmmss'
        var year = dateString.substring(0, 4),
                month = dateString.substring(4, 6),
                day = dateString.substring(6, 8),
                hours = dateString.substring(9, 11),
                minutes = dateString.substring(11, 13),
                seconds = dateString.substring(13, 15);
        var date = new Date(year, month - 1, day, hours, minutes, seconds, "00"); // months are 0-based
        if (isUTCDate == true) { //Must convert the date from UTC/GMT to local time
            var n = date.getTimezoneOffset();
            date.setMinutes(date.getMinutes() - n);
        }
        return date;
    }
    catch (err) {
        return new Date(dateString);
    }
}

/* Encode a date : "yyyyMMdd" */
function encodeDate(d) {
    var twoDigit = function (val) { if (val < 10) return "0" + val; else return val; };
    if (d && d.getMonth) return d.getFullYear().toString() + twoDigit((d.getMonth() + 1)) + twoDigit(d.getDate()); // + " " + twoDigit(d.getHours()) + twoDigit(d.getMinutes()) + twoDigit(d.getSeconds());
    else return null;
}

function showDownloadDialog(id) {
    if (!id) return;

    var urls = ["http://torcache.net/torrent/", "http://torrage.com/torrent/", "http://zoink.it/torrent/"],
        html = "<ul>",
        fileName = id + ".torrent",
        template = "<li><a href=\"{url}\" target=\"_blank\" rel=\"nofollow\">{url}</a></li>";

    $.each(urls, function (i, x) {
        html += template.replace(/{url}/g, x + fileName);
    });
    html += "</ul>";
    // Show modal and overlay
    $('#downloadModal,#downloadModalOverlay').show();
    // Empty and populate modal
    $('#downloadModal .torrentContainer').empty().html(html);
}


//--Application specific. Ensure Singleton, single location to set up the specific configs. Better to use that than using new Enbalaba.LocalStore()
Enbalaba.GetLocalStore = (function () {
    var _stores = []; //*Private*
    return function (name) {
        if (!_stores[name]) {
            var config = {};
            switch (name) {
                case "moviesInfo": config = { MaxProperties: 100 }; break;
                case "trackedSeries": config = { IsArray: true }; break;
            }
            _stores[name] = new Enbalaba.LocalStore(name, config);
        }
        return _stores[name];
    }
})();
//--------------
Enbalaba.LocalStore = function (name, config) {
    this.Name = name;
    var defaultConfig = { EmptyValue: {}, MaxTotalSize: 250000 };
    //Notes : 1 char = 2octets (Strings in JavaScript are UTF-16, so each character requires two bytes of memory)
    if (!config) config = {};
    else {
        if (config.IsArray == true) defaultConfig = { EmptyValue: [], MaxItems: 100, MaxTotalSize: 250000 }; //MaxTotalSize for arrays (usually used for MRU)== 500Ko        
    }
    this.Config = $.extend(defaultConfig, config);
};

Enbalaba.LocalStore.prototype = {

    _isSupported: !(typeof localStorage == 'undefined' || typeof JSON == 'undefined'),

    set: function (val) {
        if (this._isSupported) {
            if ($.isArray(val) && val.length > this.Config.MaxItems) {
                for (var i = 0, dif = val.length - this.Config.MaxItems; i < dif; i++) val.shift(); //remove X first elements
            }

            var s = JSON.stringify(val);

            if (s.length > this.Config.MaxTotalSize) return false; //todo: something more significant
            localStorage.setItem(this.Name, s);
            return true;
        }
    }

    /*Get the value associated with the store are. Can return null, except if Config.EmptyValue has been defined */
    , get: function () {
        if (this._isSupported) {
            var s = localStorage.getItem(this.Name);
            if (s != null && s != "") {
                return JSON.parse(s);
            }
            else if (this.Config.EmptyValue) return this.Config.EmptyValue;
        }
        if (this.Config.EmptyValue) return this.Config.EmptyValue;
        return null;
    }
};

Torrentz.GM.BobCatTorcache = {
    start: function () {
        console.log('TORCACHE');
        var url = window.location.href,
            ok = true;
        $('center').hide();

        // The process is a bit tricky because of some proxy rules
        // When we hit the page from outside, the webpage is rendered, when the same url is hit from inside Torcache,
        // the file is actually downloaded, and no page redirection is triggered, except if the torrent file isn't found.
        //

        if (url.indexOf('?ok') === -1) {
            // First time we hit the page
            // Try download the file. If file not found, an immediate redirection will occur. If the file is found, no redirection will be done
            window.location = window.location.href + '?ok';

            // For successes. Let's go away now
            setTimeout(function () { window.location = 'http://torcache.net/?ok=1'; }, 1000);

        } else if (url.indexOf('ok=') === -1) {
            // Most likely a 404 if we end up here
            ok = $('h1').text().indexOf('404') === -1;
            if (!ok) {
                // For failures
                window.location = 'http://torcache.net/?ok=' + (ok ? 1 : 0);
            }
        } else {
            $('.container-fluid').hide();
            if (url.indexOf('ok=1') !== -1){
                $('body').append('<h2>Bobcat: Download successful. You can now close this window</h2>');
            } else if(url.indexOf('ok=0') !== -1){
                $('body').append('<h2>Bobcat: 404 Torrent not found. You can now close this window</h2>');
            }
        }

    }
};
if (window.location.href.indexOf('torcache') !== -1) {
    Torrentz.GM.BobCatTorcache.start();
}
else {
    Torrentz.GM.BobCatTorrentz.start();
}
