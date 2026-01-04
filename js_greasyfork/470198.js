// ==UserScript==
// @name         AP® Score Cheeser
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Cheeses the AP® Exam scores on the College Board website by allowing modification.
// @author       Samathingamajig
// @match        https://apstudents.collegeboard.org/view-scores*
// @icon         https://www.google.com/s2/favicons?domain=collegeboard.org
// @grant        GM_setValue
// @grant        GM_getValue
// AP® is a trademark registered by the College Board, which is not affiliated with, and does not endorse, this product.
// @downloadURL https://update.greasyfork.org/scripts/470198/AP%C2%AE%20Score%20Cheeser.user.js
// @updateURL https://update.greasyfork.org/scripts/470198/AP%C2%AE%20Score%20Cheeser.meta.js
// ==/UserScript==

(async function () {
  "use strict";

  const sidebarBodies = {
    passing: `<div class="align-self-center"><p class="apscores-intro">Most U.S. colleges accept your score for credit and placement.</p><p><a class="cb-btn cb-btn-black cb-margin-sm-up-right-16 cb-margin-xs-bottom-8" href="https://apstudents.collegeboard.org/getting-credit-placement/search-policies/course/2">Find College Credit</a><a id="score-22-2" class="cb-padding-xs-top-4 display-xs-block-only cb-font-size-small" href="https://apstudents.collegeboard.org/about-ap-scores">About your <span class="sr-only">AP Biology</span> score</a></p></div>`,
    failing: `<div class="align-self-center"><p class="apscores-intro">You challenged yourself with college-level coursework.</p><p><a class="cb-btn cb-btn-black cb-margin-sm-up-right-16 cb-margin-xs-bottom-8" href="https://apcentral.collegeboard.org/about-ap/ap-a-glance/discover-benefits">Benefits of Taking AP</a><a id="score-22-2" class="cb-padding-xs-top-4 display-xs-block-only cb-font-size-small" href="https://apstudents.collegeboard.org/about-ap-scores">About your <span class="sr-only">AP Biology</span> score</a></p></div>`,
  };

  const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

  // const snobserver = new MutationObserver((records) => {
  //   for (const record of records) {
  //     if (record.target.classList.contains("align-self-center")) {
  //       console.log(record.target);
  //     }
  //     // if (record.type == "characterData") {
  //     //   console.log(record.oldValue, target, record);
  //     // }
  //   }
  // });
  // snobserver.observe(document.body, {
  //   childList: true,
  //   subtree: true,
  //   characterData: true,
  //   attributes: true,
  //   attributeOldValue: true,
  // });

  // Grab all of the boxes that contain scores
  document.body.style.opacity = "0%"; // Hide the entire page until we can hide the scores themselves
  let ccontainers = [];
  let counter = 0;
  while ((ccontainers = document.querySelectorAll(".apscores-card-col-left.display-flex")).length == 0) {
    await new Promise((res) => setTimeout(res, 10)); // Wait 10 ms
    if (++counter >= 500) {
      document.body.style.opacity = "100%";
      return; // Exit program after 5 seconds of loading
    }
  } // Wait for page to load

  const changeScoreElement = (container, score) => {
    // Replace the old score class with the new one, this is the buildings and stuff you see below a score
    container.classList.forEach(
      (cls) =>
        /apscores-badge-score-\d/.test(cls) &&
        container.classList.replace(cls, `apscores-badge-score-${clamp(score, 1, 5)}`),
    );
    container.childNodes[1].nodeValue = score; // Set the text box that holds the score number
    container.parentNode.parentNode.nextSibling.innerHTML = sidebarBodies[score >= 3 ? "passing" : "failing"]; // Set the sidebar text
  };

  // await new Promise((res) => setTimeout(res, 1000));

  await new Promise((res) => setTimeout(res, 1000));
  // changeScoreElement(ccontainers[0].querySelector(".apscores-badge.apscores-badge-score"), 2);
  console.log(ccontainers[0].querySelector(".apscores-badge.apscores-badge-score"));

  const defaultScore = await GM.getValue("all");

  for (let i = 0; i < ccontainers.length; i++) {
    // Iterate through all the score boxes
    const ccontainer = ccontainers[i];
    const container = ccontainer.querySelector(".apscores-badge.apscores-badge-score");
    if (!container) continue; // Might've accidentally selected an award
    const courseName = ccontainer.parentNode.parentNode.querySelector("h4").innerText; // Grab the course name
    const scoreNode = container.childNodes[1]; // Grab the text box that holds the score number
    const savedScore = await GM.getValue(courseName);
    // if score is explicitly "null", then don't change the score, otherwise change it to the saved score, or the default score as backup, otherwise the current score
    const targetScore =
      savedScore === null ? Number(scoreNode.nodeValue) : savedScore ?? defaultScore ?? Number(scoreNode.nodeValue);
    changeScoreElement(container, targetScore); // Change the score to the target score

    const clickListener = async (e) => {
      e.stopPropagation();
      const shouldEdit = await new Promise((res) => {
        const timeout = setTimeout(() => res(true), 2000); // Wait for a 2 second hold
        const releaseListener = () => {
          res(false);
          clearTimeout(timeout);
          window.removeEventListener("mouseup", releaseListener, true);
        };
        window.addEventListener("mouseup", releaseListener, true);
      });
      if (!shouldEdit) {
        return; // If the user didn't hold down for 2 seconds, don't edit the score
      }

      const container = ccontainer.querySelector(".apscores-badge.apscores-badge-score"); // Have to do this again because reference gets messed
      const scoreNode = container.childNodes[1]; // Grab the text box that holds the score number

      let newScore = Number(scoreNode.nodeValue);
      let all = false;
      while (true) {
        // Keep asking for a new score until the user enters a valid one
        let newScoreTemp = prompt(
          `Enter a new score for ${courseName} (1-5)
        - If you type 'reset' it will reset this score,
        - 'all n' where n is 1-5 will set all scores,
        - 'reset all' or 'all reset' will reset all scores.`.replace(/^\s+/gm, ""),
          scoreNode.nodeValue,
        )
          ?.trim()
          .toLowerCase(); // Prompt the user for a new score
        if (newScoreTemp == null) return; // If the user cancelled, don't do anything
        if (newScoreTemp == "reset") {
          await GM.setValue(courseName, null);
          window.location.reload();
          return;
        }
        if (newScoreTemp == "reset all" || newScoreTemp == "all reset") {
          await Promise.all((await GM.listValues()).map((v) => v.startsWith("AP ") && GM.setValue(v, null)));
          await GM.deleteValue("all");
          window.location.reload();
          return;
        }

        if (!/^(?:all )?[+-]?\d+$/.test(newScoreTemp)) continue; // If the user didn't enter a number, ask again.
        if (newScoreTemp.startsWith("all ")) all = true;
        newScore = Number(newScoreTemp.replace("all ", "")); // Grab the new score
        await GM.setValue("all", newScore);
        break;
      } // Prompt the user for a new score

      if (all) {
        await Promise.all(
          Array.from(ccontainers).map(async (c) => {
            const container = c.querySelector(".apscores-badge.apscores-badge-score");
            if (!container) return;
            const courseName = c.parentNode.parentNode.querySelector("h4").innerText;
            changeScoreElement(container, newScore);
            await GM.setValue(courseName, newScore);
          }),
        );
      } else {
        changeScoreElement(container, newScore); // Change the score to the new score
        await GM.setValue(courseName, newScore); // Save the new score
      }
    };
    ccontainer.addEventListener("mousedown", clickListener); // Listen for a "mousedown" event on each container in this loop
  }

  let latestResize;
  window.addEventListener("resize", async (e) => {
    latestResize = e;
    ccontainers.forEach((c) => (c.parentNode.style.opacity = "0%"));
    await new Promise((res) => setTimeout(res, 100));
    if (latestResize !== e) return;

    await Promise.all(
      Array.from(ccontainers).map(async (c) => {
        const container = c.querySelector(".apscores-badge.apscores-badge-score");
        if (!container) return;
        const courseName = c.parentNode.parentNode.querySelector("h4").innerText;
        const scoreNode = container.childNodes[1];
        const targetScore = (await GM.getValue(courseName)) ?? Number(scoreNode.nodeValue);
        changeScoreElement(container, targetScore);
        return true;
      }),
    );
    ccontainers.forEach((c) => (c.parentNode.style.opacity = "100%"));
  });

  document.body.style.opacity = "100%"; // Reshow the page after hiding the scores and adding the click listeners
})();
