// ==UserScript==
// @name        ProjectFreeTV Episode Links
// @namespace   pftvepisodelinks
// @include     http*://projectfreetv.im/watch/*
// @version     1
// @grant       none
// @description Enhance Project Free TV viewing page with links to previous and next episodes
// @downloadURL https://update.greasyfork.org/scripts/21168/ProjectFreeTV%20Episode%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/21168/ProjectFreeTV%20Episode%20Links.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Global utility methods
  HTMLCollection.prototype.any = function() {
    return this.length > 0;
  };
  HTMLCollection.prototype.first = function() {
    if (this == null) { throw new Error("The source is null"); }
    if (!this.any()) { throw new Error("The source sequence is empty"); }
    return this[0];
  };
  HTMLCollection.prototype.firstOrDefault = function(criteria) {
    for (var i = 0; i < this.length; i++) {
      if (criteria(this[i])) {
        return this[i];
      }
    }
    return null;
  };
  
  // HTTP client class
  var HttpClient = function() {
  };
  HttpClient.getAsync = function(url) {
    return new Promise(function(resolve, reject) {
      var request = new XMLHttpRequest();
      request.open("GET", url);
      
      request.onload = function() {
        if (request.status != 200) {
          reject(new Error("Non-success status code. Status:" + request.status + ", Text:" + request.statusText));
          return;
        }
        
        resolve(request.response);
      };
      
      request.onerror = function() {
        reject(new Error("Network error"));
      }
      
      request.send();
    });
  };
  HttpClient.getHtmlDocAsync = function(url) {
    return HttpClient.getAsync(url).then(function(response) {
      var doc = document.implementation.createHTMLDocument("response");
      doc.documentElement.innerHTML = response;
      return doc;
    });
  };
  
  // Episode class
  var Episode = function(series, season, episode) {
    this.series = series;
    this.season = season;
    this.episode = episode;
  };
  
  Episode.prototype.getAdjacentEpisodesAsync = function() {
    return HttpClient.getHtmlDocAsync(this.getLink()).then(function(response) {
      var div = response.getElementsByClassName("navlinks").first();
      var links = div.getElementsByTagName("a");
      var prevAnchor = links.firstOrDefault(function(a) { return a.rel == "prev"; });
      var nextAnchor = links.firstOrDefault(function(a) { return a.rel == "next"; });
      
      return {
        previous: Episode.createFromLink(prevAnchor ? prevAnchor.href : null),
        next: Episode.createFromLink(nextAnchor ? nextAnchor.href : null)
      };
    }).catch(function(error) {
      return {
        previous: null,
        next: null
      };
    });
  };
  
  Episode.prototype.getNextEpisodeOrDefault = function() {
    return new Episode(this.series, this.season, this.episode + 1);
  };
  
  Episode.prototype.getPreviousEpisodeOrDefault = function() {
    if (this.episode < 1) {
      return null;
    }
    return new Episode(this.series, this.season, this.episode - 1);
  };
  
  Episode.prototype.getLink = function() {
    return "http://projectfreetv.im/episode/" + this.toString().toLowerCase().replace(/ /g, "-");
  };
  
  Episode.prototype.toString = function() {
    return this.series + " Season " + this.season + " Episode " + this.episode;
  };
  
  Episode.prototype.toShortString = function() {
    return "S" + this.season + "E" + this.episode;
  }
  
  // Static helper methods
  Episode.createFromTitle = function(title) {
    var parsedEpisode = title.match(/(.+) Season (\d+) Episode (\d+)/);
    var series = parsedEpisode[1];
    var season = Number.parseInt(parsedEpisode[2]);
    var episode = Number.parseInt(parsedEpisode[3]);
    return new Episode(series, season, episode);
  };
  
  Episode.createFromLink = function(link) {
    if (link == null) {
      return null;
    }
    
    var parsedEpisode = link.match(/\/episode\/(\S+)/);
    var title = parsedEpisode[1].replace(/-|\//g, " ").trim().toLowerCase().replace(/\b[a-z]/g, String.toUpperCase);
    return Episode.createFromTitle(title);
  }
  
  function createEpisodeAnchor(episode, text, float) {
    var anchor = document.createElement("a");
    anchor.href = episode.getLink();
    anchor.innerText = text + episode.toShortString();
    anchor.style.float = float;
    return anchor;
  };
  
  function run() {
    try {
      var title = document.getElementsByClassName("title").first();
      var curr = Episode.createFromTitle(title.innerText);
      
      var header = title.parentElement;
      title.style.margin = 0; // so that links sit flush with episode title

      curr.getAdjacentEpisodesAsync().then(function(episodes) {
        if (episodes.previous != null) {
          header.appendChild(createEpisodeAnchor(episodes.previous, "Previous ", "left"));
        }
        if (episodes.next != null) {
          header.appendChild(createEpisodeAnchor(episodes.next, "Next ", "right"));
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  run();
}) ();
