// ==UserScript==
// @name         gitlab-booster
// @namespace    vite-plugin-monkey
// @version      1.5.2
// @author
// @description  Boost productivity for code reviewers on gitlab
// @license      AGPL-3.0-or-later
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gitlab.com
// @homepage     https://github.com/braineo/gitlab-booster#readme
// @homepageURL  https://github.com/braineo/gitlab-booster#readme
// @source       https://github.com/braineo/gitlab-booster.git
// @supportURL   https://github.com/braineo/gitlab-booster/issues
// @match        https://gitlab.com/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @grant        GM_addElement
// @grant        window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/509169/gitlab-booster.user.js
// @updateURL https://update.greasyfork.org/scripts/509169/gitlab-booster.meta.js
// ==/UserScript==

(function ($) {
  'use strict';

  var _GM_addElement = /* @__PURE__ */ (() => typeof GM_addElement != "undefined" ? GM_addElement : void 0)();
  const waitForKeyElements = function(selectorOrFunction, callback, waitOnce, interval, maxIntervals) {
    if (typeof waitOnce === "undefined") {
      waitOnce = true;
    }
    if (typeof interval === "undefined") {
      interval = 300;
    }
    if (typeof maxIntervals === "undefined") {
      maxIntervals = -1;
    }
    if (typeof waitForKeyElements.namespace === "undefined") {
      waitForKeyElements.namespace = Date.now().toString();
    }
    var targetNodes = typeof selectorOrFunction === "function" ? selectorOrFunction() : document.querySelectorAll(selectorOrFunction);
    var targetsFound = targetNodes && targetNodes.length > 0;
    if (targetsFound) {
      targetNodes.forEach(function(targetNode) {
        var attrAlreadyFound = `data-userscript-${waitForKeyElements.namespace}-alreadyFound`;
        var alreadyFound = targetNode.getAttribute(attrAlreadyFound) || false;
        if (!alreadyFound) {
          var cancelFound = callback(targetNode);
          if (cancelFound) {
            targetsFound = false;
          } else {
            targetNode.setAttribute(attrAlreadyFound, "true");
          }
        }
      });
    }
    if (maxIntervals !== 0 && !(targetsFound && waitOnce)) {
      maxIntervals -= 1;
      setTimeout(function() {
        waitForKeyElements(
          selectorOrFunction,
          callback,
          waitOnce,
          interval,
          maxIntervals
        );
      }, interval);
    }
  };
  _GM_addElement("link", {
    rel: "stylesheet",
    href: "https://cdn.jsdelivr.net/npm/nf-sauce-code-pro@2.1.3/nf-font.min.css"
  });
  const getApiUrl = (url) => {
    return `${window.location.origin}/api/v4${url}`;
  };
  async function fetchGitLabData(url) {
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" }
    });
    if (!response.ok) {
      console.error("Failed to fetch GitLab data:", response.statusText);
      return null;
    }
    return await response.json();
  }
  let currentUser;
  function createThreadsBadge(element, badgeClassName, resolved, resolvable) {
    const li = $("<li/>").addClass("issuable-comments d-none d-sm-flex").prependTo(element);
    $("<span/>").addClass(
      `gl-badge badge badge-pill badge-${badgeClassName} sm has-tooltip`
    ).text(`${resolved}/${resolvable} threads resolved`).prependTo(li);
  }
  function createThreadActionBadges(element, action) {
    const li = $("<li/>").addClass("issuable-comments d-none d-sm-flex").prependTo(element);
    const createIconText = (icon, title, text, badgeClassName) => {
      return $("<span/>", {
        title,
        class: `gl-badge badge badge-pill ${badgeClassName ? `badge-${badgeClassName}` : ""} sm has-tooltip`
      }).css({
        "font-family": "SauceCodePro Mono"
      }).text(`${icon} ${text ?? ""}`);
    };
    if (action.waitForOursCount) {
      createIconText(
        "",
        "need your response",
        action.waitForOursCount.toString(),
        "danger"
      ).prependTo(li);
    }
    if (action.waitForTheirsCount) {
      createIconText(
        "",
        "wait for response",
        action.waitForTheirsCount.toString(),
        "muted"
      ).prependTo(li);
    }
    if (action.otherUnresolvedCount) {
      createIconText(
        "",
        "other threads",
        action.otherUnresolvedCount.toString(),
        "warning"
      ).prependTo(li);
    }
    if (action.needUserReview) {
      createIconText("", "need your review", void 0, "danger").prependTo(
        li
      );
    }
  }
  function createDiffStat(element, fileCount, addLineCount, deleteLinCount) {
    $("<div/>").css({ display: "flex", "flex-direction": "row", gap: "3px" }).append(
      $("<div/>", { class: "diff-stats-group" }).append(
        $("<span/>", {
          class: "gl-text-gray-500 bold",
          text: `${fileCount} files`
        })
      ),
      $("<div/>", {
        class: "diff-stats-group gl-display-flex gl-align-items-center bold"
      }).css({
        color: "var(--gl-color-green-600)"
      }).append($("<span/>").text("+"), $("<span/>").text(`${addLineCount}`)),
      $("<div/>", {
        class: "diff-stats-group gl-display-flex gl-align-items-center bold"
      }).css({
        color: "var(--gl-color-red-600)"
      }).append($("<span/>").text("-"), $("<span/>").text(`${deleteLinCount}`))
    ).prependTo(element);
  }
  function createIssueCardMergeRequestInfo(element, opened, total) {
    const inline = $("<span/>").appendTo(element);
    $("<div/>", {
      class: "issue-milestone-details gl-flex gl-max-w-15 gl-gap-2 gl-mr-3 gl-inline-flex gl-max-w-15 gl-cursor-help gl-items-center gl-align-bottom gl-text-sm gl-text-gray-500"
    }).append(
      $("<span/>", {
        title: "Merge requests"
      }).css({
        "font-family": "SauceCodePro Mono",
        "font-size": "1.1rem"
      }).text(""),
      $("<span/>", {
        class: "gl-inline-block gl-truncate gl-font-bold"
      }).text(total === 0 ? "-/-" : `${total - opened}/${total}`)
    ).appendTo(inline);
  }
  function createIssueCardIterationInfo(element, rollover) {
    if (rollover < 1) {
      return;
    }
    const inline = $("<span/>").appendTo(element);
    $("<div/>", {
      class: "issue-milestone-details gl-flex gl-max-w-15 gl-gap-2 gl-mr-3 gl-inline-flex gl-max-w-15 gl-cursor-help gl-items-center gl-align-bottom gl-text-sm gl-text-gray-500"
    }).append(
      $("<span/>", {
        class: "gl-inline-block gl-truncate gl-font-bold"
      }).text(`🔄×${rollover}`)
    ).appendTo(inline);
  }
  function ensurePanelLayout() {
    const layout = document.querySelector("div.layout-page");
    if (!layout) {
      return;
    }
    $(layout).css({ display: "flex" });
  }
  function ensureSidePanel(panelName, url) {
    const buttonId = `close-${panelName.toLowerCase().replaceAll(" ", "-")}`;
    if (!document.querySelector(`#${buttonId}`)) {
      const topBar = document.querySelector(".top-bar-container");
      if (!topBar) {
        return;
      }
      $(topBar).append(
        $("<button/>", {
          id: buttonId,
          class: "btn btn-default btn-md gl-button btn-close js-note-target-close btn-comment btn-comment-and-close"
        }).append($("<span/>").text(`Close ${panelName}`))
      );
      $(`#${buttonId}`).on("click", () => {
        $("#issue-booster").remove();
        $(`#${buttonId}`).remove();
      });
    }
    const layout = document.querySelector("div.layout-page");
    if (!layout) {
      return;
    }
    $("#issue-booster").remove();
    _GM_addElement(layout, "iframe", {
      id: "issue-booster",
      src: url,
      // @ts-ignore // typing says style is readonly
      style: (
        // make issue panel sticky
        "width: 100%; height: 100vh; position: sticky; align-self: flex-start; top: 0; flex: 0 0 40%;"
      )
    });
  }
  const createOpenModalButton = (url) => {
    return $("<button/>", { class: "btn btn-default btn-sm gl-button" }).css({
      "font-family": "SauceCodePro Mono"
    }).text("").on("click", (e) => {
      e.stopPropagation();
      openModal(url);
    });
  };
  const openModal = (url) => {
    let modal = $("#gitlab-booster-modal");
    if (!modal.length) {
      const modalContent = $("<div/>", { class: "modal-content" }).append(
        $("<header/>", { class: "modal-header" }).append(
          $("<h2/>", { textContent: "Quick preview" }),
          $("<button/>", {
            class: "btn btn-default btn-md gl-button btn-close js-note-target-close btn-comment btn-comment-and-close"
          }).append($("<span/>").text("Close Modal")).on("click", () => {
            modal.hide();
          })
        )
      );
      modal = $("<div/>", {
        id: "gitlab-booster-modal",
        class: "modal fade show gl-modal"
      }).append(
        $("<div/>", { class: "modal-dialog modal-lg" }).css({ "max-width": "80vw" }).append(modalContent)
      ).appendTo($("body"));
      _GM_addElement(modalContent[0], "iframe", {
        id: "issue-booster",
        className: "modal-body",
        // @ts-ignore // typing says style is readonly
        style: "height: 80vh;"
      });
    }
    const iframe = modal.find("#issue-booster")[0];
    if (iframe && iframe.src !== url) {
      iframe.src = url;
    }
    modal.show();
  };
  const getUser = async () => {
    return fetchGitLabData(getApiUrl("/user"));
  };
  async function addMergeRequestThreadMeta(element, mergeRequestUrl) {
    const discussions = await fetchGitLabData(
      `${mergeRequestUrl}/discussions.json`
    ) ?? [];
    let resolvable = 0;
    let resolved = 0;
    for (const discussion of discussions) {
      if (discussion.resolvable) {
        resolvable += 1;
      }
      if (discussion.resolved) {
        resolved += 1;
      }
    }
    const listItem = await fetchGitLabData(
      `${mergeRequestUrl}.json`
    );
    if (!currentUser) {
      currentUser = await getUser();
    }
    const userId = currentUser == null ? void 0 : currentUser.id;
    let renderFallback = true;
    if (listItem && userId) {
      const mergeRequest = await fetchGitLabData(
        getApiUrl(
          `/projects/${encodeURIComponent(
          listItem.target_project_full_path
        )}/merge_requests/${listItem.iid}`
        )
      );
      if (mergeRequest) {
        const action = {
          waitForOursCount: 0,
          waitForTheirsCount: 0,
          otherUnresolvedCount: 0,
          needUserReview: false
        };
        const isUserAuthor = mergeRequest.author.id === userId;
        const isUserReviewer = mergeRequest.assignees.some((user) => user.id === userId) || mergeRequest.reviewers.some((user) => user.id === userId);
        if (isUserAuthor) {
          renderFallback = false;
          for (const discusstion of discussions) {
            if (discusstion.resolvable && !discusstion.resolved && discusstion.notes.length > 0) {
              if (discusstion.notes.at(-1).author.id === userId) {
                action.waitForTheirsCount += 1;
              } else {
                action.waitForOursCount += 1;
              }
            }
          }
          createThreadActionBadges(element, action);
        } else if (isUserReviewer) {
          renderFallback = false;
          action.needUserReview = true;
          for (const discusstion of discussions) {
            if (discusstion.resolvable && !discusstion.resolved && discusstion.notes.length > 0) {
              if (discusstion.notes.at(0).author.id === userId) {
                action.needUserReview = false;
                if (discusstion.notes.at(-1).author.id === userId) {
                  action.waitForTheirsCount += 1;
                } else {
                  action.waitForOursCount += 1;
                }
              }
            }
            if (discusstion.individual_note && discusstion.notes.length > 0) {
              const note = discusstion.notes[0];
              if ((note.note === "requested changes" || note.note === "approved this merge request") && note.author.id === userId) {
                action.needUserReview = false;
              }
            }
            action.otherUnresolvedCount = resolvable - resolved - action.waitForTheirsCount - action.waitForOursCount;
          }
          createThreadActionBadges(element, action);
        }
      }
    }
    if (!renderFallback) {
      return;
    }
    if (resolvable > resolved) {
      createThreadsBadge(element, "danger", resolved, resolvable);
    } else if (resolved === resolvable && resolvable > 0) {
      createThreadsBadge(element, "success", resolved, resolvable);
    }
  }
  async function addMergeRequestDiffMeta(element, mergeRequestUrl) {
    const diffsMeta = await fetchGitLabData(
      `${mergeRequestUrl}/diffs_metadata.json`
    );
    if (!diffsMeta) {
      return;
    }
    const { addedLineCount, deleteLinCount, fileCount } = dehydrateDiff(diffsMeta);
    createDiffStat(element, fileCount, addedLineCount, deleteLinCount);
  }
  function dehydrateDiff(diffsMeta) {
    const excludeRegexps = [
      /\.po$/,
      // translation files
      /mocks/,
      // mocks
      /(spec|test)\.\w+$/,
      // tests
      /package-lock.json/
      // auto generated files
    ];
    let addedLineCount = 0;
    let deleteLinCount = 0;
    let fileCount = 0;
    file_loop: for (const file of diffsMeta.diff_files) {
      for (const excludeRegexp of excludeRegexps) {
        if (excludeRegexp.test(file.new_path)) {
          continue file_loop;
        }
      }
      addedLineCount += file.added_lines;
      deleteLinCount += file.removed_lines;
      fileCount += 1;
    }
    return {
      addedLineCount,
      deleteLinCount,
      fileCount
    };
  }
  async function enhanceMergeRequestList() {
    var _a;
    const mergeRequests = document.querySelectorAll(".merge-request");
    ensurePanelLayout();
    for (const mergeRequest of mergeRequests) {
      const mergeRequestUrl = (_a = mergeRequest.querySelector(
        ".merge-request-title-text a"
      )) == null ? void 0 : _a.href;
      if (!mergeRequestUrl) {
        continue;
      }
      const metaList = $(mergeRequest).find(".issuable-meta ul, ul.controls")[0];
      addMergeRequestThreadMeta(metaList, mergeRequestUrl);
      addMergeRequestDiffMeta(metaList, mergeRequestUrl);
      createOpenModalButton(mergeRequestUrl).css({
        paddingTop: 0,
        paddingBottom: 0
      }).appendTo(metaList);
    }
  }
  async function enhanceMergeRequestDetailPage() {
    var _a;
    const reviewerPanel = document.querySelector(".block.reviewer");
    const getTitle = () => {
      var _a2;
      return ((_a2 = document.querySelector("h1.title")) == null ? void 0 : _a2.innerText) ?? "";
    };
    const title = getTitle();
    const csrfToken = (_a = document.querySelector(
      'meta[name="csrf-token"]'
    )) == null ? void 0 : _a.content;
    const mrisDraft = title.length > 0 && title.toLowerCase().startsWith("draft:");
    if (!reviewerPanel) {
      return;
    }
    const convertButton = reviewerPanel.querySelector("#convert-to-draft-button");
    if (mrisDraft && convertButton) {
      convertButton.remove();
      return;
    }
    if (!mrisDraft && !convertButton && csrfToken) {
      const $description = $(
        /* HTML */
        `
      <div
        id="convert-to-draft-button"
        class="gl-flex"
        style="padding-top: 1rem; align-items: center"
      >
        <span class="gl-mb-0 gl-inline-block gl-text-sm gl-text-subtle"
          >Still in progress?</span
        >
        <button
          class="gl-ml-2 !gl-text-sm btn gl-button btn-confirm btn-sm btn-confirm-tertiary"
        >
          <span class="gl-button-text" style="font-size: 0.7rem;"
            >Convert to draft</span
          >
        </button>
      </div>
    `
      );
      $description.find(".gl-button").on("click", async () => {
        const urlMatch = window.location.pathname.match(
          /\/(.+)\/-\/merge_requests\/(\d+)/
        );
        if (!urlMatch) {
          console.error("Could not parse MR URL");
          return;
        }
        const projectPath = urlMatch[1];
        const mrIid = urlMatch[2];
        const title2 = getTitle();
        await fetch(
          getApiUrl(
            `/projects/${encodeURIComponent(projectPath)}/merge_requests/${mrIid}`
          ),
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "X-CSRF-Token": csrfToken
            },
            body: JSON.stringify({ title: `Draft: ${title2}` })
          }
        );
        window.location.reload();
      });
      $description.appendTo(reviewerPanel);
    }
  }
  async function enhanceIssueDetailPage() {
    waitForKeyElements(
      "#developmentitems > div.crud-body > div > ul > li",
      (mergeRequest) => {
        (async () => {
          console.debug(
            "inserting merge request meta to related merge requests",
            mergeRequest
          );
          const statusBadge = mergeRequest.querySelector(
            "div.item-meta span.gl-badge-content"
          );
          const mergeRequestStatus = (statusBadge == null ? void 0 : statusBadge.textContent) ?? "opened";
          const mergeRequestAnchor = mergeRequest.querySelector(".item-title a");
          const mergeRequestUrl = mergeRequestAnchor == null ? void 0 : mergeRequestAnchor.href;
          if (!mergeRequestUrl) {
            return;
          }
          switch (mergeRequestStatus == null ? void 0 : mergeRequestStatus.trim().toLowerCase()) {
            case "merged": {
              break;
            }
            case "closed": {
              $(mergeRequestAnchor).css({
                "text-decoration": "line-through"
              });
              $(mergeRequest).css({
                filter: "grayscale(1)"
              });
              return;
            }
            default: {
              $(mergeRequestAnchor).css({
                color: "var(--primary)"
              });
            }
          }
          const diffsMeta = await fetchGitLabData(
            `${mergeRequestUrl}/diffs_metadata.json`
          );
          if (!diffsMeta) {
            return;
          }
          const metaDiv = mergeRequest.querySelector(
            ".item-meta .item-attributes-area"
          );
          if (!metaDiv) {
            return;
          }
          createOpenModalButton(mergeRequestUrl).appendTo(metaDiv);
          if (mergeRequestStatus === "opened") {
            await addMergeRequestThreadMeta(metaDiv, mergeRequestUrl);
            await addMergeRequestDiffMeta(metaDiv, mergeRequestUrl);
          }
          $("<span/>").text(diffsMeta.project_path).prependTo(metaDiv);
        })();
      },
      true
    );
  }
  function enhanceIssueList() {
    ensurePanelLayout();
    waitForKeyElements("ul.issues-list > li", (issue) => {
      var _a;
      const issueUrl = (_a = issue.querySelector("a")) == null ? void 0 : _a.href;
      if (!issueUrl) {
        console.error("cannot find url for issue");
        return;
      }
      $(issue).on("click", () => {
        ensureSidePanel("Issue Panel", issueUrl);
      });
      return true;
    });
  }
  const enhanceIssueCard = async (mutationList) => {
    var _a;
    for (const mutation of mutationList) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        for (const node of mutation.addedNodes) {
          if (node instanceof Element && node.matches("li.board-card")) {
            const issueUrl = (_a = node.querySelector(
              "h3.board-card-title > a"
            )) == null ? void 0 : _a.href;
            const infoItems = node.querySelector(
              "span.board-info-items"
            );
            if (!issueUrl || !infoItems) {
              continue;
            }
            const issue = await fetchGitLabData(`${issueUrl}.json`);
            if (!issue) {
              continue;
            }
            const relatedMergeRequest = await fetchGitLabData(
              getApiUrl(
                `/projects/${issue.project_id}/issues/${issue.iid}/related_merge_requests`
              )
            ) ?? [];
            const total = relatedMergeRequest.length;
            const opened = relatedMergeRequest.filter(
              (mergeRequest) => mergeRequest.state === "opened"
            ).length;
            createIssueCardMergeRequestInfo(infoItems, opened, total);
            const iterationEvents = await fetchGitLabData(
              getApiUrl(
                `/projects/${issue.project_id}/issues/${issue.iid}/resource_iteration_events`
              )
            ) ?? [];
            createIssueCardIterationInfo(
              infoItems,
              iterationEvents.filter((event) => event.action === "add").length - 1
            );
          }
        }
      } else if (mutation.type === "attributes") ;
    }
    return;
  };
  const observer = new MutationObserver(enhanceIssueCard);
  const enhanceIssueBoard = () => {
    observer.disconnect();
    const boardElement = document.querySelector(".boards-list");
    if (!boardElement) {
      return;
    }
    observer.observe(boardElement, {
      attributes: false,
      childList: true,
      subtree: true
    });
  };
  const issueDetailRegex = /\/issues\/\d+/;
  const mergeRequestDetailRegex = /\/merge_requests\/(\d+)/;
  const mergeRequestListRegex = /\/merge_requests(?!\/\d+)/;
  const epicListRegex = /\/epics(?!\/\d+)/;
  const issueBoardRegex = /\/boards(?:\/\d+)?(?:\/)?(?:\?|$)/;
  const enhance = () => {
    if (mergeRequestListRegex.test(window.location.href)) {
      enhanceMergeRequestList();
    }
    if (mergeRequestDetailRegex.test(window.location.href)) {
      enhanceMergeRequestDetailPage();
    }
    if (issueDetailRegex.test(window.location.href)) {
      enhanceIssueDetailPage();
    }
    if (epicListRegex.test(window.location.href)) {
      enhanceIssueList();
    }
    if (issueBoardRegex.test(window.location.href)) {
      enhanceIssueBoard();
    }
  };
  window.onload = enhance;
  if (window.onurlchange === null) {
    window.addEventListener("urlchange", enhance);
  }

})($);