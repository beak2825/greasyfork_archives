// ==UserScript==
// @name         ADC MAL Jikan
// @namespace    https://greasyfork.org/users/957127
// @version      1.3
// @description  Adds a fallback mechanism for MAL API
// @match        https://asiandvdclub.org/upload
// @icon         https://asiandvdclub.org/images/favicon/favicon.ico
// @author       Renzoku
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457417/ADC%20MAL%20Jikan.user.js
// @updateURL https://update.greasyfork.org/scripts/457417/ADC%20MAL%20Jikan.meta.js
// ==/UserScript==

const JIKAN_API = "https://api.jikan.moe/";
const JIKAN_VERSION = 'v4';
const MAL_REQ_PATTERN = /type=anime&scrp=okey&content_url=https:\/\/myanimelist\.net\/anime\/(?<MALID>\d+)/i;

(function() {
  'use strict';

  const jikanResponseParser = function({ data }) {
    let content = "";
    let info = {
      Synonyms: data.title_synonyms ? data.title_synonyms.join(", "): "",
      English: data.title_english,
      Japanese: data.title_japanese,
      Type: data.type,
      Episodes: data.episodes,
      Aired: data.aired.string,
      Duration: data.duration,
      Studios: data.studios.map((studio) => studio.name).join(', '),
      Genres: data.genres.map((genre) => genre.name).join(', '),
      Summary: data.synopsis
    }

    for (const [key, value] of Object.entries(info)) {
      if (!value) continue;
      if (key === "Synonyms") content += `${key}: ${value} `;
      else if (key === "Summary") content += `\n\n${value}`;
      else content += `${key}: ${value}\n`;
    }

    return [content, data.images.jpg.large_image_url];
  };

  window.addEventListener('load', function() {
    if (!unsafeWindow.jQuery) return;

    unsafeWindow.jQuery.ajaxPrefilter(function(options, originalOptions, jqXHR) {
      let match = decodeURIComponent(options.data).match(MAL_REQ_PATTERN);
      if (!match || !match.groups) return;

      let success = options.success;
      options.success = function(data, textStatus, jqXHR) {
        const MALID = match.groups['MALID'];
        const url = new URL(`${JIKAN_VERSION}/anime/${MALID}/full`, JIKAN_API);
        let parsedData = JSON.parse(data);

        if (!parsedData["content_info"].trim() || !parsedData["image"]) {
          console.log("Trying Jikan API...");
          unsafeWindow.jQuery.ajax({
            method: "GET",
            url: url.href,
            async: false,
            success: function(_data) {
              const [content, imageUrl] = jikanResponseParser(_data);
              const newData = JSON.stringify({
                "content_info": content,
                "image": imageUrl,
              });
              data = newData;
              console.log("Jikan API success");
            }
          });
        }
        if(typeof(success) === "function") return success(data, textStatus, jqXHR);
      };
    });
  }, false);
})();
