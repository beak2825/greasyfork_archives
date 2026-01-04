// ==UserScript==
// @name         Entry Deleter
// @namespace    https://www.youtube.com/@NurarihyonMaou
// @version      0.2
// @description  Script that lets You to delete multiple Anime Entries at once by selecting them in AnimeList SubPage on AniList
// @author       NurarihyonMaou
// @match        https://anilist.co/user/*/animelist*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anilist.co
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/460393/Entry%20Deleter.user.js
// @updateURL https://update.greasyfork.org/scripts/460393/Entry%20Deleter.meta.js
// ==/UserScript==

const $ = window.jQuery;
const x_csrf_token = $("head script:contains('window.al_token')");

let url = "https://anilist.co/graphql";
let entriesToDelete = [], entriesLinks = [];
let listEntries;

let deleteQuery = `mutation($id: Int){
                                 DeleteMediaListEntry(id: $id) {
                                        deleted
                                        }
                                }`;

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

(function init() {
  listEntries = document.getElementsByClassName("list-entries");

  if (listEntries.length > 0) {
    $("body")
      .find("div.list-entries div.entry")
      .each(function (index, item) {
        $(item).append(
          `<input type='checkbox' class='entriesToDelete' value='${index}'/>`
        );
      });

    $("body").on("click", "input.entriesToDelete", function () {
      let isChecked = $(this).prop("checked");
      let entryNumber = $(this).val();
      let entryID = parseInt(
        $(this)
          .parent()
          .find("div.title")
          .children()
          .attr("href")
          .split('/')[2]
      );
      entriesLinks[entryID] =  $(this).parent().find("div.title").children().attr("href");
      console.log($(this).parent().find("div.title").text());

      if (isChecked == true) entriesToDelete[entryNumber] = entryID;
      else entriesToDelete[entryNumber] = null;

      console.log(entriesToDelete);

    });
    $("div.actions").append(
      "<button type='button' id='deleteSelectedEntries'>Delete Selected Entries</button>"
    );

    $("body").on("click", "button#deleteSelectedEntries", function () {
      let areYouSure = confirm(
        `Are you sure You want to Delete ${entriesToDelete.filter(Boolean).length} Selected Entries?`
      );

      if (areYouSure != true)
        return;
      entriesToDelete.forEach(async(entry) => {
        let result = await sendQuery(deleteQuery, { id: entry });

        if(result == true)
            console.log("Succesfully Deleted - "+entriesLinks[entry]);
        else
            console.log("Failed to Delete - "+entriesLinks[entry]);;
      });
    });
  } else setTimeout(init, 0);
})();