// ==UserScript==
// @name        Alienware Arena - Daily Quests
// @match       https://*.alienwarearena.com/*
// @icon        https://eu.alienwarearena.com/favicon.ico
// @version     1.0
// @author      eegee
// @download    https://gist.github.com/eegeeZA/823491a8883f2eb0296f4122fe632122/raw/alienware-arena_daily-quests.user.js
// @namespace   https://gist.github.com/eegeeZA/823491a8883f2eb0296f4122fe632122
// @description Quick link to thread or solution of the Daily Quest.
// @downloadURL https://update.greasyfork.org/scripts/424843/Alienware%20Arena%20-%20Daily%20Quests.user.js
// @updateURL https://update.greasyfork.org/scripts/424843/Alienware%20Arena%20-%20Daily%20Quests.meta.js
// ==/UserScript==

$(function () {
  const questTitle = $(".quest-title.text-info");
  if (!questTitle.length) {
    return;
  }

  const controlsId = "daily-controls";
  questTitle.after(`<span id="${controlsId}"></span>`);
  questTitle.wrap(`<a href="javascript:void(0)"></a>`);

  let cleanedQuestTitle = questTitle
    .html()
    .trim()
    .replace(/[^a-z ]/gi, "");
  const rankedResults = [];

  $.get(`/search/forum_topic/${encodeURI(`Daily ${cleanedQuestTitle}`)}`)
    .then(populateRankedResults)
    .then(() =>
      Promise.all(
        rankedResults.map((result) => $.get(result.link).catch(() => ""))
      )
    )
    .then((subResults) =>
      subResults.forEach(
        (subResult, index) =>
          (rankedResults[index].nestedLink = $(subResult)
            .find(".discussion__op-content.ucf__content a")
            .attr("href"))
      )
    )
    .then(() => updateControls(0));

  function populateRankedResults(searchResults) {
    $(searchResults)
      .find(".search-results__item")
      .each((_, result) => {
        const link = $(result).closest("a").attr("href");
        const title = $(result).find("h1").html();
        const [, replies] = $(result)
          .html()
          .match(/Replies: (\d+)/);
        rankedResults.push({ link, title, replies: Number(replies) });
      });

    rankedResults.sort((a, b) => {
      if (a.title.includes("Solved") && !b.title.includes("Solved")) {
        return -1;
      }
      if (!a.title.includes("Solved") && b.title.includes("Solved")) {
        return 1;
      }
      return b.replies - a.replies;
    });
  }

  function updateControls(index) {
    let controls = $(`#${controlsId}`);
    if (!rankedResults.length) {
      controls.replaceWith(`
      <span id="${controlsId}" style="margin-left: auto; white-space: nowrap;">
        <small>(no results)</small>
      </span>
    `);
      return;
    }

    const previousButton = "daily-previous";
    const nextButton = "daily-next";
    controls = $(`
    <span id="${controlsId}" style="margin-left: auto; user-select: none; white-space: nowrap; text-align: center;">
      <small class="text-monospace" style="display: block;">${index + 1}/${
      rankedResults.length
    }</small>
      <i id="${previousButton}" class="fas fa-arrow-circle-left" aria-hidden="true"></i>
      <i id="${nextButton}" class="fas fa-arrow-circle-right" aria-hidden="true"></i>
    </span>
  `).replaceAll(controls);

    if (index > 0) {
      $(`#${previousButton}`)
        .on("click", () => updateControls(index - 1))
        .addClass("text-success");
    }
    if (index < rankedResults.length - 1) {
      $(`#${nextButton}`)
        .on("click", () => updateControls(index + 1))
        .addClass("text-success");
    }

    let rankedResult = rankedResults[index];
    questTitle.closest("a").attr("href", rankedResult.link);
    if (rankedResult.nestedLink) {
      controls.append(
        `<small class="text-info" style="display: block;"><a href="${rankedResult.nestedLink}">sub-link</a></small>`
      );
    }
  }
});
