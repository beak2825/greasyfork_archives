// ==UserScript==
// @name         Movie Info Scraper
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  Scrape the movie/TV information from a webpage.
// @author       wklchris
// @match        https://www.themoviedb.org/tv/*
// @supportURL   https://github.com/wklchris/Movie-Info-Scraper
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408000/Movie%20Info%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/408000/Movie%20Info%20Scraper.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Check if HTML display language is ZH
  let htmlLanguage = document.getElementsByTagName('html')[0].getAttribute('lang');
  let isHtmlLangZh = (htmlLanguage.indexOf('zh') >= 0);

  let btnText = "Copy TV names to Clipboard";
  let copyMessage = "TV filenames have been copied to clipboard. Example:";
  if (isHtmlLangZh) {
      btnText = "复制 TV 名称";
      copyMessage = "TV 名称已复制到剪贴板。示例：";
  }

  // Copy a string variable to clipboard.
  function copyToClipboard(str, copyMessage) {
      // Create a textarea for copy
      let strArea = document.createElement('textarea');
      strArea.value = str;
      document.body.appendChild(strArea);
      strArea.select();
      // Prepare the pop-up message if it is non-empty
      if (copyMessage) {
          try {
              document.execCommand('copy');
          } catch (err) {
              copyMessage = "Copy failed."
          } finally {
              alert(copyMessage)
          }
      }
      // Delete the element
      document.body.removeChild(strArea);
  }

  // Replace invalid characters in filename strings
  function escapeCharsInFilename(fname) {
    let escapes = {
      "!": "！", "?": "？",
      ":": "：", ";": "；",
      "/": "-", "\\": "-", "|": "-",
      "%": "-", "*": "-", "\"": '-',
      "<": "(", ">": ")"
    };
    // For non-zh user, disable zh punctuations
    if (!isHtmlLangZh) {
      for (const c of ["!", "?", ":", ";"]) {
        escapes[c] = ""
      }
    }
    let s = fname;
    for (const [c, val] of Object.entries(escapes)) {
      s = s.replaceAll(c, val);
    }
    return s;
  }

  // Copy all TV names in current webpage, with a Kodi-compatible format:
  //     [TV Series Name]-S[Season]E[Eposide].[Current Eposide Title]
  function copyTVNames(copyMessage='') {
      let parentDOM = document.getElementsByTagName('h3');
      // Split by colon for tvtitle
      let title_regex = /^(.+?)(\(\d*\))?[\s—]*The Movie Database.*/g;
      let tvtitle = document.title.replace(title_regex, '$1').replace(/\s+/g, '');
      let fileNameGroup = [];
      for (let i = 0; i < parentDOM.length; i++) {
          let ep = parentDOM[i].querySelector(".no_click.open");
          if (ep != null) {
              let season = ep.getAttribute('data-season-number');
              let episode = ep.getAttribute('data-episode-number');
              let eptitle = ep.innerHTML;
              // Filenames are in a Kodi-compatible format
              let fname = tvtitle + '-S' + season.padStart(2, '0') + 'E' + episode.padStart(2, '0') + '.' + eptitle;
              fname = escapeCharsInFilename(fname);
              fileNameGroup.push(fname);
          }
      }
      // Add an example from copied filenames
      copyMessage += `\n\n${fileNameGroup[0]}\n... (total ${fileNameGroup.length})`;
      copyToClipboard(fileNameGroup.join('\n'), copyMessage);
  }

  // Add a button for copyTVNames()
  let btnMovieFileName = document.createElement('button');
  btnMovieFileName.innerHTML = btnText;
  btnMovieFileName.onclick = function () { copyTVNames(copyMessage); };
  document.getElementsByClassName("filter")[0].appendChild(btnMovieFileName);
})();