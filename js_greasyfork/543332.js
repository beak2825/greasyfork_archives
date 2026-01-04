// ==UserScript==
// @name        Filmweb Serial Date
// @namespace   https://greasyfork.org/pl/users/636724-cml99
// @match       http*://www.filmweb.pl/serial/*
// @match       http*://www.filmweb.pl/tvshow/*
// @grant       GM_xmlhttpRequest
// @grant       GM.xmlHttpRequest
// @grant       GM_addStyle
// @version     1.0.0
// @author      CML99
// @description Wyświetla datę premiery pierwszego odcinka w głównej sekcji serialu.
// @description:en  Displays release date of the first episode in the tv serie's main section.
// @license     CC-BY-NC-SA-4.0
// @icon        https://www.google.com/s2/favicons?sz=64&domain=filmweb.pl
// @downloadURL https://update.greasyfork.org/scripts/543332/Filmweb%20Serial%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/543332/Filmweb%20Serial%20Date.meta.js
// ==/UserScript==


/* Mini Serial */
var intvEpisodesList = setInterval(function() {
  var episodesList = document.querySelector('.filmInfo__info > a[href$="/episode/list"]');
  if (episodesList.length < 1) {
    return false;
  }
  clearInterval(intvEpisodesList);

  const urlSplit = window.location.pathname.split('/').filter(segment => segment);
  let urlType = urlSplit[0];
  let urlTitle = urlSplit[1];

  var episodesFrameNode = document.createElement('div');
  episodesFrameNode.setAttribute('id', 'episodesFrameContainer');
  episodesFrameNode.innerHTML = '<iframe src="https://www.filmweb.pl/' + urlType +'/' + urlTitle + '/episode/list" style="display: none;" id="episodesFrame" scrolling="no" height="128px" width="256px"></iframe>';
  episodesList.after(episodesFrameNode);

  var intvEpisode = setInterval(function() {
    var episode1year = document.getElementById('episodesFrame').contentWindow.document.querySelector('.preview__link[href$="/episode/1"] > .preview__year');
    if (episode1year.length < 1) {
      return false;
    }
    clearInterval(intvEpisode);
    const episode1date = document.getElementById('episodesFrame').contentWindow.document.querySelector('.preview__link[href$="/episode/1"] > .preview__year')?.textContent?.trim().toString();

    var episodeInfoDateNode = document.createElement('h3');
    episodeInfoDateNode.setAttribute('class', 'filmInfo__header');

    var episodeInfoDateLabel = document.createElement('span');
    episodeInfoDateLabel.innerHTML = "premiera";
    episodeInfoDateNode.appendChild(episodeInfoDateLabel);

    var episodeInfoDateValue = document.createElement('span');
    episodeInfoDateValue.setAttribute('class', 'filmInfo__info');
    episodeInfoDateValue.innerHTML = '<a href="https://www.filmweb.pl/' + urlType +'/' + urlTitle + '/episode/list">' + episode1date + ' (pierwszy odcinek)</a>';
    episodeInfoDateNode.appendChild(episodeInfoDateValue);

    var filmInfoHeader = document.querySelector('.filmInfo .filmInfo__header:last-of-type');
    filmInfoHeader.after(episodeInfoDateNode);

    setTimeout(function(){
      episodesFrameNode.remove();
    }, 3000);
  }, 5000);
}, 500);


/* Full Serial */
var intvSeasonsList = setInterval(function() {
  var seasonsList = document.querySelector('.filmInfo__info--seasons.has-current-season .squareNavigation');
  if (seasonsList.length < 1) {
    return false;
  }
  clearInterval(intvSeasonsList);

  const urlSplit = window.location.pathname.split('/').filter(segment => segment);
  let urlType = urlSplit[0];
  let urlTitle = urlSplit[1];

  var seasonFrameNode = document.createElement('div');
  seasonFrameNode.setAttribute('id', 'seasonFrameContainer');
  seasonFrameNode.innerHTML = '<iframe src="https://www.filmweb.pl/' + urlType +'/' + urlTitle + '/season/1" style="display: none;" id="seasonFrame" scrolling="yes" height="240px" width="480px"></iframe>';
  seasonsList.after(seasonFrameNode);

  var intvSeason = setInterval(function() {
    var season1year = document.getElementById('seasonFrame').contentWindow.document.querySelector('.preview__link[href$="/episode/1/1"] > .preview__year');
    if (season1year.length < 1) {
      return false;
    }
    clearInterval(intvSeason);
    const season1date = document.getElementById('seasonFrame').contentWindow.document.querySelector('.preview__link[href$="/episode/1/1"] > .preview__year')?.textContent?.trim().toString();

    var seasonInfoDateNode = document.createElement('h3');
    seasonInfoDateNode.setAttribute('class', 'filmInfo__header');

    var seasonInfoDateLabel = document.createElement('span');
    seasonInfoDateLabel.innerHTML = "premiera";
    seasonInfoDateNode.appendChild(seasonInfoDateLabel);

    var seasonInfoDateValue = document.createElement('span');
    seasonInfoDateValue.setAttribute('class', 'filmInfo__info');
    seasonInfoDateValue.innerHTML = '<a href="https://www.filmweb.pl/' + urlType +'/' + urlTitle + '/season/1">' + season1date + ' (pierwszy odcinek)</a>';
    seasonInfoDateNode.appendChild(seasonInfoDateValue);

    var filmInfoHeaderLast = document.querySelector('.filmInfo .filmInfo__header:last-of-type');
    filmInfoHeaderLast.after(seasonInfoDateNode);

    setTimeout(function(){
      seasonFrameNode.remove();
    }, 3000);
  }, 8000);
}, 500);


GM_addStyle ( `
  .filmInfo__header.hide[data-premiere], .filmInfo__info.hide[data-premiere] { display: grid !important; }
` );