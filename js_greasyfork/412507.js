// ==UserScript==
// @name         Mangadex List Exporter
// @namespace    https://github.com/MarvNC
// @version      0.22
// @description  A userscript for exporting a MangaDex list to a .xml file for import to anime list sites.
// @author       Marv
// @match        https://mangadex.org/list*
// @icon         https://mangadex.org/favicon.ico
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412507/Mangadex%20List%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/412507/Mangadex%20List%20Exporter.meta.js
// ==/UserScript==

// 1000ms delay between requests for MangaDex
const DELAY = 1000;

(function () {
  'use strict';

  // main function that executes on button click
  let save = async () => {
    // disable the button
    btn.onclick = null;

    let userID = /(?<=\/list\/)\d+/.exec(document.URL)[0];
    let url = `https://mangadex.org/api/v2/user/${userID}/followed-manga`;
    let response = await $.get(url);
    let IDs = response.data;
    console.log(IDs);

    // prettier-ignore
    let xml = 
`<?xml version="1.0" encoding="UTF-8" ?>
	
<!--
Created by Mangadex List Export userscript
Programmed by Marv
-->

<myanimelist>

	<myinfo>
		<user_export_type>2</user_export_type>
	</myinfo>

`;
    // create timer counting down to remaining time
    let countdownTimer = document.createElement('p');
    countdownTimer.style = 'text-align:center;';
    btn.parentElement.appendChild(countdownTimer);

    // loop through each manga ID in IDs
    for (let i = 0; i < IDs.length; i++) {
      console.log(`${i + 1} of ${IDs.length}: Getting details for manga ID: ${IDs[i].mangaId}`);
      // update time remaining, accounting for different delays
      countdownTimer.innerHTML = `Export time remaining: ${formatSeconds(
        ((IDs.length - i - 1) * DELAY) / 1000
      )}`;
      // get the info from the manga then add it to xml
      getMangaInfo(IDs[i]).then((mangaInfo) => {
        btn.innerHTML = `${i + 1} of ${IDs.length} entries: Retrieved data for ${
          mangaInfo.mangaTitle
        }`;
        // prettier-ignore
        xml += 
`	<manga>
		<manga_mangadb_id>${mangaInfo.malID}</manga_mangadb_id>
		<manga_mangadex_id>${mangaInfo.mdID}</manga_mangadex_id>
		<manga_anilist_id>${mangaInfo.alID}</manga_anilist_id>
		<manga_kitsu_id>${mangaInfo.kitsuID}</manga_kitsu_id>
		<manga_mangaupdates_id>${mangaInfo.muID}</manga_mangaupdates_id>
		<manga_animeplanet_slug><![CDATA[${mangaInfo.apSlug}]]></manga_animeplanet_slug>
		<manga_title><![CDATA[${mangaInfo.mangaTitle}]]></manga_title>
		<my_read_volumes>${mangaInfo.volume}</my_read_volumes>
		<my_read_chapters>${mangaInfo.chapter}</my_read_chapters>
		<my_start_date>0000-00-00</my_start_date>
		<my_finish_date>0000-00-00</my_finish_date>
		<my_score>${mangaInfo.rating}</my_score>
		<my_status>${mangaInfo.status}</my_status>
		<update_on_import>0</update_on_import>
	</manga>

`;
      });
      await timer(DELAY);
    }
    xml += `</myanimelist>`;
    btn.innerHTML = `Completed list export of ${IDs.length} entries!`;
    // save the xml string as an xml with current date as filename
    let date = new Date();
    let filename = `mangalist_${date.toISOString()}.xml`;
    let blob = new Blob([xml], {
      type: 'application/xml',
    });
    saveAs(blob, filename);
  };

  // the button to add
  var btn = document.createElement('BUTTON');
  btn.innerHTML = `Click to export list; remember to set view mode to 'Simple list'`;
  btn.onclick = save;
  // add the button after user banner
  document.getElementsByClassName('card mb-3')[0].append(btn);
})();

// accepts a manga list object thing
var getMangaInfo = async (manga) => {
  const statuses = {
    1: 'Reading',
    2: 'Completed',
    3: 'On hold',
    4: 'Plan to read',
    5: 'Dropped',
    6: 'Re-reading',
  };

  let url = `https://mangadex.org/api/v2/manga/${manga.mangaId}`;
  let mangaInfo = (await $.get(url)).data;
  let status = statuses[manga.followType];

  let muID, alID, apSlug, kitsuID, malID;

  if (mangaInfo.links) {
    muID = mangaInfo.links.mu ? mangaInfo.links.mu : 0;
    alID = mangaInfo.links.al ? mangaInfo.links.al : 0;
    apSlug = mangaInfo.links.ap ? mangaInfo.links.ap : 0;
    kitsuID = mangaInfo.links.kt ? mangaInfo.links.kt : 0;
    malID = mangaInfo.links.mal ? mangaInfo.links.mal : 0;
  }

  let rating = manga.rating ? manga.rating : 0;

  return {
    mangaTitle: htmlDecode(mangaInfo.title),
    status: status,
    rating: rating,
    muID: muID,
    alID: alID,
    apSlug: apSlug,
    kitsuID: kitsuID,
    malID: malID,
    mdID: manga.mangaId,
    volume: manga.volume,
    chapter: manga.chapter,
  };
};

// Returns a Promise that resolves after "ms" Milliseconds
var timer = (ms) => {
  return new Promise((res) => setTimeout(res, ms));
};

// seconds to HH:MM:SS
var formatSeconds = (seconds) => {
  return new Date(seconds * 1000).toISOString().substr(11, 8);
};

var htmlDecode = (value) => {
  return $('<textarea/>').html(value).text();
};
