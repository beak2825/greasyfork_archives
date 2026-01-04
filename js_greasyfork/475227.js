// ==UserScript==
// @name     StackOverflow: Downvote helper
// @description Makes it easier to give explanations on downvotes
// @namespace ClasherKasten
// @version  0.6.1
// @include https://stackoverflow.com/questions/*
// @grant    none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475227/StackOverflow%3A%20Downvote%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/475227/StackOverflow%3A%20Downvote%20helper.meta.js
// ==/UserScript==

/*
TODO:
- add optional/additional infos (how to {mre,ask})
*/

const options = {
  beingunresponsive: "Being unresponsive",
  imageofanexception: "Image of an exception",
  imageofcode: "Image of code",
  itsnotworking: "It's not working",
  noattempt: "No attempt",
  nocode: "No code",
  nodebugging: "No debugging",
  noexceptiondetails: "Missing exception details",
  nomcve: "No MCVE/MRE",
  noresearch: "No research",
  toomuchcode: "Too much code",
  toomuchinfo: "Too much information",
  unclearquestion: "Unclear what you're asking",
  unreadablecode: "Unreadable code",
  wronglanguage: "Wrong language",
};

const downvotedListHTML = Object.keys(options)
  .map((key) => {
    return `
        <li>
            <label>
                <input type="checkbox" name="downvote-reason-form" value="${key}">
                <span class="action-name"><a href="https://idownvotedbecau.se/${key}" target="_blank">${options[key]}</a></span>
            </label>
        </li>
    `;
  })
  .join("");

const modalHTML = `
  <div id="popup-flag-post" class="popup responsively-horizontally-centered-legacy-popup z-modal" data-controller="se-draggable" style="max-width: 600px; position: absolute; top: ${
    window.innerHeight / 5
  }px; left: calc(50% - 300px); display: block;">
    <div class="popup-close">
			<a title="close this popup (or hit Esc)">
				×
			</a>
		</div>
    <form id="dv-explanation" data-showretract="">
      <div>
        <h2 style="margin-bottom:12px;" class="c-move" data-se-draggable-target="handle">
          I downvoted because:
        </h2>
        <div class="flag-description"></div>
        <ul class="action-list">
          ${downvotedListHTML}
        </ul>
      </div>
      <div class="popup-actions">
        <div class="d-flex gs8 gsx ai-center">
          <button class="s-btn s-btn__primary flex--item js-popup-submit">
            Downvote with explanation(s)
          </button>
        </div>
      </div>
    </form>
  </div>
`;

const downvote_btn = document.querySelector(".js-vote-down-btn");

if (downvote_btn !== null && downvote_btn !== undefined) {
  console.log('registering event');
  downvote_btn.addEventListener("click", (event) => {
    // pre-check up
    event.preventDefault();
    if (downvote_btn.getAttribute('aria-pressed') === 'true') {
    	return;
    }

    // set up modal
    const element = document.querySelector(".js-menu-popup-container");
    element.innerHTML = modalHTML;

    // modal actions
    const form = document.querySelector("#dv-explanation");
    const cancel_btn = document.querySelector('.popup-close');
    form.onsubmit = (event) => {
      event.preventDefault();
      const comment_btn = document.querySelector(".js-add-link.comments-link");
      const question_id = window.location.href.match("questions/(\\d+)")[1];
      const commentParts = [];
      const selected = [];
      const checkBoxes = document.querySelectorAll(
      	'input[name="downvote-reason-form"]'
      );
      let idx = 0;
      for (const checkBox of Array.from(checkBoxes)) {
        if (checkBox.checked) {
          selected.push(idx);
        }
        idx++;
      }
      selected.forEach((sidx) => {
        const key = Object.keys(options)[sidx];
        commentParts.push(
          `[${options[key]}](https://idownvotedbecau.se/${key})`
        );
      });
      
      if (commentParts.length === 0) {
      	element.innerHTML = '';
        return
      }
      
      // write default comment 
      comment_btn.click();
      const comment_field = document.querySelector(
        `textarea#comment-input-${question_id}`
      );
      comment_field.value = `Downvoted because: ${commentParts.join(", ")}`;
      element.innerHTML = '';
    };
    cancel_btn.onclick = (event) => {
    	element.innerHTML = '';
      downvote_btn.click();
    };
  });
}
