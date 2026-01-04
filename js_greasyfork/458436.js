// ==UserScript==
// @name         SoyParty-X
// @namespace    datamining
// @version      0.2
// @description  Cure the cancer that is killing soyjak.party
// @author       Chud (You)
// @match        https://soyjak.party/*
// @icon         https://soyjak.party/static/favicon.png
// @grant        none
// @license      wtfpl
// @downloadURL https://update.greasyfork.org/scripts/458436/SoyParty-X.user.js
// @updateURL https://update.greasyfork.org/scripts/458436/SoyParty-X.meta.js
// ==/UserScript==

/* eslint-env jquery */

/*

Changelog:

0.2:

- hidePosts() now detects flood posts.

0.1:

- hidePosts()
- forcedAnonymity()
- highlightTripleParentheses()
- highlightDatamining()
- inlineYoutubePreviews()
- replaceCoalAndGemsWithIcon()
- replaceBumpAndSageWithIcons()

*/

(function SoyPartyX() {
  // true = hide posts where the e-mail is "sage".
  const _hideMailtoSage = true;

  // true = scrub email, trip, and force all names to be "Chud".
  // - Emailfags and tripfags are already hidden.
  // - Namefags aren't hidden, but turning this on will anonymize them.
  // false = don't change posts (default).
  const _enableForcedAnonymity = false;

  // Sets the limit for a post to be considered a flood post.
  // If one of the criteria is met, the post is hidden.
  const floodThresholdLines = 30;
  const floodThresholdCharacters = 3000;

  hidePosts();
  forcedAnonymity(); // Must come AFTER hidePosts()
  highlightTripleParentheses();
  highlightDatamining();
  inlineYoutubePreviews();
  replaceCoalAndGemsWithIcon();
  replaceBumpAndSageWithIcons();

  function hidePosts() {
    $(".post").each((i, el) => {
      const $el = $(el);
      const reasons = [];

      const isOp = $el.hasClass("op");

      if ($el.has(".trip").length) {
        reasons.push("tripfag");
      }
      if (_hideMailtoSage && $el.has('a.email[href^="mailto:sage"]').length) {
        reasons.push("sagefag");
      }
      if ($el.has('a.email:not([href^="mailto:sage"])').length) {
        reasons.push("emailfag");
      }

      const body = $el.has(".body");
      const bodyLines = body.html().split("<br>").length;
      const bodyLength = body.text().length;

      if (
        bodyLines > floodThresholdLines ||
        bodyLength > floodThresholdCharacters
      ) {
        reasons.push(
          `possible flooding: ${bodyLength} characters in ${bodyLines} lines`
        );
      }

      if (reasons.length) {
        const $notice = $("<div>")
          .addClass(`post ${isOp ? "op" : "reply"}`)
          .html(
            `<div class='body'><em>Post hidden (${reasons.join(
              ", "
            )}). Click to show.</em></div>`
          )
          .after($("<br>"));
        $notice.click(() => {
          $el.show();
          if (isOp) $el.prev(".files").show();
          $notice.hide();
        });
        $el.after($notice);
        $el.hide();
        if (isOp) $el.prev(".files").hide();
      }
    });
  }

  function forcedAnonymity() {
    if (!_enableForcedAnonymity) return;
    // Remove all emails.
    $("a.email").prop("outerHTML", "<span class='name'>Chud</span>");
    // Remove all tripcodes.
    $(".trip").prop("outerHTML", "");
    // Set all names to Chud.
    // Make sure not to overwrite (You)'s.
    $(".name")
      .filter((i, el) => !$(el).has(".own_post").length)
      .text("Chud");
  }

  function replaceWordWithIcon(re, icon) {
    const matchesRe = (index, post) => $(post).html().match(re);

    const template = (match) =>
      `<img src="${icon}" style="max-height:2em; vertical-align:middle">`;

    const applyTemplate = (index, post) => {
      const $post = $(post);
      const html = $post.html();
      $post.html(html.replace(re, template));
    };

    $("div.body").filter(matchesRe).each(applyTemplate);
  }

  function replaceCoalAndGemsWithIcon() {
    replaceWordWithIcon(/coal/gi, "https://i.imgur.com/O9iRcRv.png");
    replaceWordWithIcon(/gems?/gi, "https://i.imgur.com/BvjFdau.png");
  }

  function replaceBumpAndSageWithIcons() {
    // replaceWordWithIcon(/bump/gi, "https://i.imgur.com/zM2xOGh.png");
    // replaceWordWithIcon(/sage/gi, "https://i.imgur.com/2bsauzj.png");
    replaceWordWithIcon(/bump/gi, "https://i.imgur.com/Y7cpsW0.png");
    replaceWordWithIcon(/\bsage\b/gi, "https://i.imgur.com/ZarQtY3.png");
  }

  function highlightTripleParentheses() {
    const re = /\(\(\(.+?\)\)\)/g;
    const hasRe = (i, post) => post.innerHTML.match(re);

    const template = (match) =>
      `<span style='background-color:white;color:#0038B8;font-family:monospace;'>${match}</span>`;
    const applyTemplate = (i, post) => {
      post.innerHTML = post.innerHTML.replace(re, template);
    };

    $("div.body").filter(hasRe).each(applyTemplate);
  }

  function highlightDatamining() {
    const reGlowie =
      /data(\s*|-)min(ing|er|ed)|(sell|selling|sold)\s+(my|our)?\s+data|cuckflare|cloudflare|cloud fleur/i;
    const hasReGlowie = (i, post) => post.innerHTML.match(reGlowie);
    const applyTemplate = (i, post) =>
      $(post).css({
        backgroundColor: "#D7EFD7",
        boxShadow: "#66FF66 0 0 2rem 0",
      });
    $(".reply").filter(hasReGlowie).each(applyTemplate);
  }

  function inlineYoutubePreviews() {
    const re = /(?:youtu\.be\/|\/watch\?v=)(.{11})/;
    const previewTemplate = (videoId) =>
      `<a href="https://youtube.com/watch?v=${videoId}">https://youtube.com/watch?v=${videoId}</a><br><img style="max-width:255px;max-height:255px" src="https://i.ytimg.com/vi/${videoId}/hqdefault.jpg" /><br><em>Watch on <a href="https://yewtu.be/${videoId}">Invidious</a> (less datamining)</em><br>`;
    $(".body a")
      .filter(function (i) {
        return $(this).prop("href").match(re);
      })
      .each(function (i) {
        $(this).prop("outerHTML", previewTemplate(this.href.match(re)[1]));
      });
  }
})();