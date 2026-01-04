// ==UserScript==
// @name        gitlab merge requests enhance
// @namespace   gitlab_mr_enhance
// @match       https://*git*/*/*/-/merge_requests
// @grant       none
// @version     1.0.1
// @author      hunsh
// @homepageURL https://github.com/hunshcn/js-gitlab-merge-request-enhance
// @license     MIT
// @description 2022/11/23 18:24:23
// @downloadURL https://update.greasyfork.org/scripts/455293/gitlab%20merge%20requests%20enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/455293/gitlab%20merge%20requests%20enhance.meta.js
// ==/UserScript==
(function () {
  async function getMergeRequestInfo(link, metaList) {
    const response = await fetch(`${link}/discussions.json`)
    const data = await response.json()
    let resolvable = 0;
    let resolved = 0;
    data.forEach(item => {
      if (item.resolvable) resolvable++;
      if (item.resolved) resolved++;
    });

    if (resolvable > resolved) {
      createThreadsBadge(metaList, "#ffd3d3", resolved, resolvable);
    } else if (resolved === resolvable && resolvable > 0) {
      createThreadsBadge(metaList, "#8fc7a6", resolved, resolvable);
    }
  }
  async function checkRebase(link, metaList) {
    const response = await fetch(`${link}/widget.json`);
    const data = await response.json();
    if (data.should_be_rebased) {
      let text = "need rebase";
      if (data.mergeable_discussions_state)
        createRebaseBadge(metaList, text);
      else
        createLocallyBadge(metaList, text);
    }
  }
  function createBadge(element, color, text, callback) {
    const li = $("<li/>")
      .addClass("issuable-comments d-none d-sm-flex")
      .prependTo(element);
    const i = $("<span/>")
      .addClass("badge color-label")
      .css("background-color", color)
      .css("padding", "2px 8px")
      .css("color", "#333333")
      .text(text);
    if (callback !== undefined)
      callback(i);
    i.prependTo(li);
  }

  function createThreadsBadge(element, color, resolved, resolvable) {
    createBadge(element, color, `${resolved} / ${resolvable} threads resolved`, function(i) {i.css("cursor", "default")});
  }
  function createLocallyBadge(element) {
    createBadge(element, '#ff7171', 'need rebase locally', function(i) {i.css("cursor", "default")});
  }
  function createRebaseBadge(element) {
    createBadge(element, '#b5fcfe', 'need rebase', function (i) {
      i.css("cursor", "pointer")
      //   .on('click', function() {

      // })
    })
  }

  $(".merge-request").each(function() {
    const anchor = $(this).find(".merge-request-title-text a")[0];
    const metaList = $(this).find(".issuable-meta ul")[0];

    if (!metaList.innerHTML.includes('MERGED')) {
      getMergeRequestInfo(anchor.href, metaList).then();
      checkRebase(anchor.href, metaList).then();
    }
  });
})()