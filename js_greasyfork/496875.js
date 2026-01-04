// ==UserScript==
// @name        helpers
// @license     MIT
// @namespace   rtonne
// @match       https://anilist.co/*
// @version     1.0
// @author      Rtonne
// @description Helpers library for AniList Edit Multiple Media Simultaneously
// ==/UserScript==

/**
 * @typedef {{message: string, status: number, locations: {line: number, column: number}[]}} AniListError
 * @typedef {{message: string} | AniListError} FetchError
 */

/**
 * Uses a MutationObserver to wait until the element we want exists.
 * This function is required because elements take a while to appear sometimes.
 * https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
 * @param {string} selector A string for document.querySelector describing the elements we want.
 * @returns {Promise<HTMLElement[]>} The list of elements found.
 */
function waitForElements(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelectorAll(selector));
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelectorAll(selector));
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

/**
 * Returns if anime or manga has advanced scoring enabled.
 * @returns {Promise<{data: {anime: boolean, manga: boolean}} | {data: {}, errors: FetchError[]}>}
 */
async function isAdvancedScoringEnabled() {
  const query = `
    query {
      User(name: "${window.location.href.split("/")[4]}") {
        mediaListOptions {
          animeList {
            advancedScoringEnabled
          }
          mangaList {
            advancedScoringEnabled
          }
        }
      }
    }
  `;

  const { data, errors } = await anilistFetch(
    JSON.stringify({ query: query, variables: {} })
  );
  if (errors) {
    return { data: {}, errors };
  }
  const return_data = {
    anime:
      data["User"]["mediaListOptions"]["animeList"]["advancedScoringEnabled"],
    manga:
      data["User"]["mediaListOptions"]["mangaList"]["advancedScoringEnabled"],
  };
  return { data: return_data };
}

/**
 * Get data from a group of entries.
 * @param {int[]} media_ids
 * @param {"id"|"isFavourite"|"customLists"|"advancedScores"} field
 * @returns {Promise<{data: any[]} | {data: any[], errors: FetchError[]}>}
 */
async function getDataFromEntries(media_ids, field) {
  const query = `query ($media_ids: [Int], $page: Int, $per_page: Int) {
    Page(page: $page, perPage: $per_page) {
      mediaList(mediaId_in: $media_ids, userName: "${
        window.location.href.split("/")[4]
      }", compareWithAuthList: true) {
        ${field !== "isFavourite" ? field : "media{isFavourite}"}
      }
    }
  }`;
  const page_size = 50;

  let errors;
  let data = [];
  for (let i = 0; i < media_ids.length; i += page_size) {
    const page = media_ids.slice(i, i + page_size);
    const variables = {
      media_ids: page,
      page: 1,
      per_page: page_size,
    };
    const response = await anilistFetch(
      JSON.stringify({
        query: query,
        variables: variables,
      })
    );
    if (response.errors) {
      errors = response.errors;
      break;
    }
    data.push(
      ...response.data["Page"]["mediaList"].map((entry) => {
        if (field === "isFavourite") {
          return entry["media"]["isFavourite"];
        }
        return entry[field];
      })
    );
  }
  if (errors) {
    return { data, errors };
  }
  return { data };
}

/**
 * Make a GraphQL mutation to a single entry on AniList
 * @param {number} id The id of the entry to update. Not media_id (use turnMediaIdsIntoIds() to get the actual id). Should be an int.
 * @param {Object} values The values to update
 * @param {("CURRENT"|"PLANNING"|"COMPLETED"|"DROPPED"|"PAUSED"|"REPEATING")} [values.status]
 * @param {number} [values.score]
 * @param {number} [values.scoreRaw] Should be an int.
 * @param {number} [values.progress] Should be an int.
 * @param {number} [values.progressVolumes] Should be an int.
 * @param {number} [values.repeat] Should be an int.
 * @param {number} [values.priority] Should be an int.
 * @param {boolean} [values.private]
 * @param {string} [values.notes]
 * @param {boolean} [values.hiddenFromStatusLists]
 * @param {string[]} [values.customLists]
 * @param {number[]} [values.advancedScores]
 * @param {Object} [values.startedAt]
 * @param {number} [values.startedAt.year] Should be an int.
 * @param {number} [values.startedAt.month] Should be an int.
 * @param {number} [values.startedAt.day] Should be an int.
 * @param {Object} [values.completedAt]
 * @param {number} [values.completedAt.year] Should be an int.
 * @param {number} [values.completedAt.month] Should be an int.
 * @param {number} [values.completedAt.day] Should be an int.
 * @returns {Promise<{errors: FetchError[]} | {}>}
 */
async function updateEntry(id, values) {
  const query = `
  mutation (
    $id: Int
    $status: MediaListStatus
    $score: Float
    $scoreRaw: Int
    $progress: Int
    $progressVolumes: Int
    $repeat: Int
    $priority: Int
    $private: Boolean
    $notes: String
    $hiddenFromStatusLists: Boolean
    $customLists: [String]
    $advancedScores: [Float]
    $startedAt: FuzzyDateInput
    $completedAt: FuzzyDateInput
  ) {SaveMediaListEntry(
      id: $id
      status: $status
      score: $score
      scoreRaw: $scoreRaw
      progress: $progress
      progressVolumes: $progressVolumes
      repeat: $repeat
      priority: $priority
      private: $private
      notes: $notes
      hiddenFromStatusLists: $hiddenFromStatusLists
      customLists: $customLists
      advancedScores: $advancedScores
      startedAt: $startedAt
      completedAt: $completedAt
    ) {
      id
    }
  }`;

  const variables = {
    id,
    ...values,
  };

  const { errors } = await anilistFetch(
    JSON.stringify({
      query: query,
      variables: variables,
    })
  );
  //TODO maybe get all media fields on update to check if they're the same, as validation
  if (errors) {
    return { errors };
  }
  // I'm returning empty object instead of void so that checking for errors outside is easier
  return {};
}

/**
 * Make a GraphQL mutation to update multiple entries on AniList
 * @param {number[]} ids The ids of the entries to update. Not media_ids (use turnMediaIdsIntoIds() to get the actual ids). Should be ints.
 * @param {Object} values The values to update
 * @param {("CURRENT"|"PLANNING"|"COMPLETED"|"DROPPED"|"PAUSED"|"REPEATING")} [values.status]
 * @param {number} [values.score]
 * @param {number} [values.scoreRaw] Should be an int.
 * @param {number} [values.progress] Should be an int.
 * @param {number} [values.progressVolumes] Should be an int.
 * @param {number} [values.repeat] Should be an int.
 * @param {number} [values.priority] Should be an int.
 * @param {boolean} [values.private]
 * @param {string} [values.notes]
 * @param {boolean} [values.hiddenFromStatusLists]
 * @param {number[]} [values.advancedScores]
 * @param {Object} [values.startedAt]
 * @param {number} [values.startedAt.year] Should be an int.
 * @param {number} [values.startedAt.month] Should be an int.
 * @param {number} [values.startedAt.day] Should be an int.
 * @param {Object} [values.completedAt]
 * @param {number} [values.completedAt.year] Should be an int.
 * @param {number} [values.completedAt.month] Should be an int.
 * @param {number} [values.completedAt.day] Should be an int.
 * @returns {Promise<{errors: FetchError[]} | {}>}
 */
async function batchUpdateEntries(ids, values) {
  const query = `
  mutation (
    $ids: [Int]
    $status: MediaListStatus
    $score: Float
    $scoreRaw: Int
    $progress: Int
    $progressVolumes: Int
    $repeat: Int
    $priority: Int
    $private: Boolean
    $notes: String
    $hiddenFromStatusLists: Boolean
    $advancedScores: [Float]
    $startedAt: FuzzyDateInput
    $completedAt: FuzzyDateInput
  ) {UpdateMediaListEntries(
      ids: $ids
      status: $status
      score: $score
      scoreRaw: $scoreRaw
      progress: $progress
      progressVolumes: $progressVolumes
      repeat: $repeat
      priority: $priority
      private: $private
      notes: $notes
      hiddenFromStatusLists: $hiddenFromStatusLists
      advancedScores: $advancedScores
      startedAt: $startedAt
      completedAt: $completedAt
    ) {
      id
    }
  }`;

  const variables = {
    ids,
    ...values,
  };

  const { errors } = await anilistFetch(
    JSON.stringify({
      query: query,
      variables: variables,
    })
  );
  //TODO maybe get all media fields on update to check if they're the same, as validation
  if (errors) {
    return { errors };
  }
  // I'm returning empty object instead of void so that checking for errors outside is easier
  return {};
}

/**
 * Make a GraphQL mutation to toggle the favourite status for an entry on AniList
 * @param {{animeId: number} | {mangaId: number}} id Should be ints.
 * @returns {Promise<{errors: FetchError[]} | {}>}
 */
async function toggleFavouriteForEntry(id) {
  const query = `
  mutation {ToggleFavourite(
    ${id.animeId ? "animeId: " + id.animeId : ""}
    ${id.mangaId ? "mangaId: " + id.mangaId : ""}
    ) {
      ${id.mangaId ? "manga" : "anime"} {
        nodes {
          id
        }
      }
    }
  }
  `;

  const { errors } = await anilistFetch(
    JSON.stringify({
      query: query,
      variables: {},
    })
  );
  // Not doing extra validation because the data returned depends on if its toggled on or off.
  // We could check if the entry id has been added/removed to the node list but if we have more
  // than 50 favourites I think we would need to query multiple pages, and I don't feel like doing it.
  if (errors) {
    return { errors };
  }
  // I'm returning empty object instead of void so that checking for errors outside is easier
  return {};
}

/**
 * Make a GraphQL mutation to delete an entry on AniList
 * @param {number} id Should be an int.
 * @returns {Promise<{errors: FetchError[]} | {}>}
 */
async function deleteEntry(id) {
  const query = `
  mutation (
    $id: Int
  ) {DeleteMediaListEntry(
        id: $id
    ) {
      deleted
    }
  }`;

  const variables = {
    id,
  };

  const { data, errors } = await anilistFetch(
    JSON.stringify({
      query: query,
      variables: variables,
    })
  );

  if (errors) {
    return { errors };
  } else if (data && !data["DeleteMediaListEntry"]["deleted"]) {
    console.error(
      `The deletion request threw no errors but id ${id} was not deleted.`
    );
    return {
      errors: [
        {
          message: `The deletion request threw no errors but id ${id} was not deleted.`,
        },
      ],
    };
  }
  // I'm returning empty object instead of void so that checking for errors outside is easier
  return {};
}

/**
 * Requests from the AniList GraphQL API.
 * Uses a url and token specific to the website for simplicity
 * (the user doesn't need to get a token) and for no rate limiting.
 * @param {string} body A GraphQL query string.
 * @returns A dict with the json data or the errors.
 */
async function anilistFetch(body) {
  const tokenScript = document
    .evaluate("/html/head/script[contains(., 'window.al_token')]", document)
    .iterateNext();
  const token = tokenScript.innerText.substring(
    tokenScript.innerText.indexOf('"') + 1,
    tokenScript.innerText.lastIndexOf('"')
  );

  let url = "https://anilist.co/graphql";
  let options = {
    method: "POST",
    headers: {
      "X-Csrf-Token": token,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body,
  };

  function handleResponse(response) {
    return response.json().then(function (json) {
      return response.ok ? json : Promise.reject(json);
    });
  }

  /**
   * @param {{data: any}} response
   */
  function handleData(response) {
    return response;
  }

  /**
   * @param {{data: {[_: string]: null}, errors: AniListError[]} | Error} e
   * @returns {{errors: FetchError[]}}
   */
  function handleErrors(e) {
    // alert(
    //   "An error ocurred when requesting from the AniList API. Check the console for more details."
    // );
    console.error(e);
    if (e instanceof Error) {
      return { errors: [{ message: e.toString() }] };
    }
    return { errors: e.errors };
  }

  return await fetch(url, options)
    .then(handleResponse)
    .then(handleData)
    .catch(handleErrors);
}
