// ==UserScript==
// @name         gitlab for kop front
// @namespace    http://tampermonkey.net/
// @version      2025-11-06
// @description  선택한 mr들의 아사나 링크를 한번에 복사하세요
// @author       dh.jo
// @match        https://gitlab.kolonfnc.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js

// @downloadURL https://update.greasyfork.org/scripts/543324/gitlab%20for%20kop%20front.user.js
// @updateURL https://update.greasyfork.org/scripts/543324/gitlab%20for%20kop%20front.meta.js
// ==/UserScript==

GM_addStyle(`
.mr-list .merge-request.merged {
	position: relative;
}
.mr-checkbox {
    position: absolute;
    top: 50%;
    left: -6px;
    transform: translate(-100%, -50%);
}
#CopyAsanaLinks {
	position: relative;
}
#CopyAsanaLinks .loadingDiv {
 	position: absolute;
    width: 95%;
    background: #ffffffcf;
}
`);

(function() {
    'use strict';
var $ = window.jQuery;

if (location.pathname.includes("/merge_requests/") && $(".merge-request-details").length) {
  const $title = $(".title.page-title");
  const $issue = $title.find("a").first();

  if ($issue.length) {
    $.get($issue.attr("href"))
      .done(function (html) {
        const $doc = $($.parseHTML(html));
        const $asanaLink = $doc
          .find('a[href^="https://app.asana.com/"]')
          .filter(function () {
            return $(this).text().trim() === "Asana task";
          })
          .first();

        if ($asanaLink.length) {
          const asanaHref = $asanaLink.attr("href");

          // Asana 버튼 추가
          const $asanaBtn = $(`<button type="button" id="copyAsanaLink" style="font-size: 0.5em; height: 34px; vertical-align: text-top; margin-left: 16px;">Asana</button>`);
          $asanaBtn.on("click", function () {
            window.open(asanaHref);
          });
          $title.append($asanaBtn);

          // Copy 버튼 추가
          const copyText = $title.contents().get(2).textContent.trim() + asanaHref;
          const $copyBtn = $(`<button type="button" id="copyAsanaLink" style="font-size: 0.5em; height: 34px; vertical-align: text-top; margin-left: 4px;">Copy</button>`);
          $copyBtn.on("click", function () {
            navigator.clipboard.writeText(copyText);
          });
          $title.append($copyBtn);
        }
      })
      .fail(function (err) {
        console.error("Failed to fetch page:", err);
      });
  }


    function generateCommitCopy() {
        const $commitLink = $('[data-testid="commit-link"]');
        if ($commitLink.length) {
            $commitLink.after(`<button class="btn gl-px-3! btn-default btn-sm gl-button btn-default-tertiary btn-icon" type="button" data-clipboard-text="${$commitLink.text()}"><svg class="s16 gl-icon gl-button-icon " data-testid="copy-to-clipboard-icon"><use href="/assets/icons-33d285b77c0f9173f577e26a550fb6463b9913e368ebfcdbb54022aff27051db.svg#copy-to-clipboard"></use></svg></button>`)
        }
    }
    generateCommitCopy();
    window.onload = generateCommitCopy;
}

if ($(".mr-list .merge-request.merged").length) {
  $(".mr-list .merge-request.merged a").each((i, e) => {
    $(e).attr("tabindex", "-1");
  });
  $(".mr-list .merge-request.merged").each((i, e) => {
    $(e).prepend('<input type="checkbox" class="mr-checkbox" tabindex="0">');
  });

  $(".top-area .nav-controls").prepend('<button class="gl-button btn btn-md btn-default gl-mr-3" type="button" id="CopyAsanaLinks" style="display: none">Copy Asana Links</button>');

  $(".mr-checkbox").on("change", () => {
    if ($(".mr-checkbox:checked").length) {
      $("#CopyAsanaLinks").show();
    } else {
      $("#CopyAsanaLinks").hide();
    }
  });

  $("#CopyAsanaLinks").on("click", () => {
  	$("#CopyAsanaLinks").append('<div class="loadingDiv"><span aria-label="Loading" class="gl-spinner gl-spinner-md gl-spinner-dark gl-vertical-align-text-bottom!"></span></div>');

    const targetLinks = [];

    const requests = $(".mr-checkbox:checked")
      .map((i, e) => {
        const $mr = $(e).parent().find(".merge-request-title a");
        const mrUrl = $mr.attr("href");

        return $.get(mrUrl)
          .then((html) => {
            const $docDetail = $($.parseHTML(html));
            const $title = $docDetail.find(".title.page-title");
            const $issue = $title.find("a").first();

            if ($issue.length) {
              const issueUrl = $issue.attr("href");

              return $.get(issueUrl).then((_html) => {
                const $docIssue = $($.parseHTML(_html));
                const $asanaLink = $docIssue
                  .find('a[href^="https://app.asana.com/"]')
                  .filter(function () {
                    return $(this).text().trim() === "Asana task";
                  })
                  .first();

                if ($asanaLink.length) {
                  const asanaHref = $asanaLink.attr("href");
                  const copyText = $title.contents().get(2).textContent.trim() + asanaHref;
                  targetLinks.push(copyText);
                }
              });
            }
          })
          .catch((err) => {
            console.error("Failed to fetch page:", err);
          });
      })
      .get(); // jQuery map 결과를 일반 배열로 변환

    Promise.all(requests).then(() => {
      if (targetLinks.length > 0) {
        const finalText = targetLinks.join("\n");
        navigator.clipboard
          .writeText(finalText)
          .then(() => {
            console.log("Copied to clipboard successfully!");
            $('#CopyAsanaLinks .loadingDiv').remove();
          })
          .catch((err) => {
            console.error("Failed to copy to clipboard:", err);
          });
      } else {
        console.warn("No Asana links found to copy.");
      }
    });
  });
}



})();