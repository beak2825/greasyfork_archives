// ==UserScript==
// @name         Broken Entries
// @namespace    https://www.youtube.com/channel/UCSSG_PQJer_dPKI5d1kTpUg
// @version      0.1
// @description  Script that shows Completed Entries with progress different than the Entry Data says!
// @author       NurarihyonMaou
// @match        https://anilist.co/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anilist.co
// @require      https://code.jquery.com/jquery-3.6.0.js
// @downloadURL https://update.greasyfork.org/scripts/453666/Broken%20Entries.user.js
// @updateURL https://update.greasyfork.org/scripts/453666/Broken%20Entries.meta.js
// ==/UserScript==

'use strict';
const $ = window.jQuery;
const x_csrf_token = $("head script:contains('window.al_token')").text().split(/[“"”]+/g)[1];
const url = 'https://anilist.co/graphql';
async function sendQuery(query, variables = {}) {
    let dataToReturn;

    let options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-csrf-token": x_csrf_token,
      },
      body: JSON.stringify({
        query: query,
        variables: variables,
      }),
    };

    await fetch(url, options)
      .then(handleResponse)
      .then(handleData)
      .catch(handleError);

    function handleResponse(response) {
      return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
      });
    }

    function handleData(data) {
      return (dataToReturn = data);
    }

    function handleError(error) {
      console.error(error);
      return false;
    }
    return dataToReturn;
  }


//query ($userName: String) $userName
let query = `{MediaListCollection(userName: "rivyaaa", type: MANGA, status:COMPLETED){
    lists{
        name
        entries {
         progress
          progressVolumes
            mediaId
            media{
              chapters
              volumes
                title {
                    romaji
                    english
                    native
                    userPreferred
                    }
                relations {
                      nodes {
                      id
                    type
                      }
                }
                idMal
                }
            }
        }
    }
}`;

$(window).ready(async function(){

const data = await sendQuery(query);

let broken = [];

data.data.MediaListCollection.lists.forEach((list) => {
    list.entries.forEach((entry) => {

if((entry.media.chapters != null && entry.progress != entry.media.chapters) || (entry.media.volumes != null && entry.progressVolumes != entry.media.volumes))
    broken.push({id : entry.mediaId, title : entry.media.title.userPreferred});
    });
});

let links = "";

broken.forEach((broken_entry) => {
    links += `<tr><td><a href='https://anilist.co/manga/${broken_entry.id}'>${broken_entry.title}</a></td></tr>`;
});

$('body').append(links);
});