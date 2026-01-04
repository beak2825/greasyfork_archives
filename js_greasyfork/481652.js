// ==UserScript==
// @name         Add repo/branch links to GitHub's "Comparing Changes" page
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  This adds a link to the fork's branch on the GitHub "Comparing changes" page (AKA the "Create a Pull Request" page). See https://stackoverflow.com/questions/77623282/how-do-i-get-my-remote-branch-url-from-the-github-create-pull-request-page for more details.
// @author       DanKaplanSES
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481652/Add%20repobranch%20links%20to%20GitHub%27s%20%22Comparing%20Changes%22%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/481652/Add%20repobranch%20links%20to%20GitHub%27s%20%22Comparing%20Changes%22%20page.meta.js
// ==/UserScript==

// Official update link: https://greasyfork.org/en/scripts/481652/versions/new

const browseRepoHtml = `<div class="browse-repo"><a href="#" target="_blank">Browse Repo</a></div>`;
const browseBranchHtml = `<div class="browse-branch"><a href="#" target="_blank">Browse Branch</a></div>`;

jQuery.noConflict(true)(function ($) {
  function getEvents(jQueryElement) {
    const element = jQueryElement.get(0);
    const elemEvents = $._data(element, "events");
    const allDocEvnts = $._data(document, "events");
    function equalEvents(evt1, evt2) {
      return evt1.guid === evt2.guid;
    }

    for (let evntType in allDocEvnts) {
      if (allDocEvnts.hasOwnProperty(evntType)) {
        const evts = allDocEvnts[evntType];
        for (let i = 0; i < evts.length; i++) {
          if ($(element).is(evts[i].selector)) {
            if (elemEvents == null) {
              elemEvents = {};
            }
            if (!elemEvents.hasOwnProperty(evntType)) {
              elemEvents[evntType] = [];
            }
            if (
              !elemEvents[evntType].some(function (evt) {
                return equalEvents(evt, evts[i]);
              })
            ) {
              elemEvents[evntType].push(evts[i]);
            }
          }
        }
      }
    }
    return elemEvents;
  }

  $.fn.onFirst = function (name, fn) {
    this.bind(name, fn);
    for (let i = 0, _len = this.length; i < _len; i++) {
      let elem = this[i];
      let handlers = $._data(elem).events[name.split(".")[0]];
      handlers.unshift(handlers.pop());
    }
  };

  let hrefs = [];

  function modifyWhenReady(modificationFunction, isReady) {
    function modifyIfReady() {
      if (isReady()) {
        modificationFunction();
      }
    }
    modifyIfReady();
    setInterval(modifyIfReady, 1500);
  }

  function modifyRangeEditor() {
    hrefs = [];
    $(`.range-cross-repo-pair details`).wrap(
      `<div class="details-container"></div>`
    );

    const tempHrefs = [];
    $(`.details-container`).each(function (index) {
      const containerType =
        $(this).find(`summary.branch`).length > 0 ? `branch` : `repo`;
      const html = containerType === `repo` ? browseRepoHtml : browseBranchHtml;
      const href = hrefString(containerType, index);
      const containerContentsHidden = $(this).find(`details`).is(`:hidden`);
      $(this)
        .css({ display: containerContentsHidden ? `none` : `inline-block` })
        .append(html)
        .css({ "text-align": `center` })
        .find(`a`)
        .attr({ id: `browse-link-${index}`, href });
      tempHrefs.push(href);
    });

    $(`.range-editor .pre-mergability, .range-editor .d-inline-block`).css({
      "vertical-align": `top`,
    });

    hrefs = tempHrefs; // Only assigned when the loop has finished. This ensures modifyFiles only runs when all hrefs exist.
  }

  function hrefString(containerType, index) {
    switch (containerType) {
      case "repo":
        return `/` + $(`.css-truncate-target`)[index].textContent;
      case "branch":
        return (
          `/` +
          $(`.css-truncate-target`)[index - 1].textContent +
          `/tree/` +
          $(`.css-truncate-target`)[index].textContent
        );
      default:
        throw new Error(`Unexpected containerType: ${containerType}`);
    }
  }

  function modifyFiles() {
    const hrefOfBranchWithChanges = hrefs[hrefs.length - 1];
    hrefs = [];
    $(`#files a.Link--primary`).each(function (index) {
      const hrefToFile = $(this).attr("title");
      const detailsMenu = $(this).parents(`.file-header`).find(`details-menu`);

      const viewFileButton = detailsMenu.find(`a:contains('View file')`);
      const viewFileHref = hrefOfBranchWithChanges + "/" + hrefToFile;
      viewFileButton.replaceWith(
        $(
          `<a href="${viewFileHref}" class="pl-5 dropdown-item btn-link" target="_blank">View file</a>`
        )
      );

      const editFileButton = detailsMenu.find(`button:contains('Edit file')`);
      const editFileHref =
        hrefOfBranchWithChanges.replace(/\/tree\//, `/edit/`) +
        "/" +
        hrefToFile;
      editFileButton.replaceWith(
        $(
          `<a href="${editFileHref}" class="pl-5 dropdown-item btn-link" target="_blank">Edit file</a>`
        )
      );
    });
  }

  function resetRangeEditor() {
    $(`.range-cross-repo-pair details`).each(function (index) {
      const parent = $(this).parents(`.range-cross-repo-pair`);
      parent.append($(this)); // make $(this) a direct child
    });

    $(`.details-container`).remove();
  }

  modifyWhenReady(modifyRangeEditor, () => {
    return (
      location.pathname.indexOf(`/compare/`) !== -1 &&
      $(`#browse-link-0`).length === 0 &&
      $(`.range-cross-repo-pair details`).length > 0
    );
  });

  modifyWhenReady(modifyFiles, () => {
    return (
      location.pathname.indexOf(`/compare/`) !== -1 &&
      $(`#files`).length > 0 &&
      hrefs.length > 0
    );
  });

  modifyWhenReady(
    () => {
      $(`.js-toggle-range-editor-cross-repo`).onFirst(
        "click",
        resetRangeEditor
      );
    },
    () => {
      return (
        location.pathname.indexOf(`/compare/`) !== -1 &&
        getEvents($(`.js-toggle-range-editor-cross-repo`)) === undefined
      );
    }
  );

  $(`.js-toggle-range-editor-cross-repo`).onFirst("click", resetRangeEditor);
});
