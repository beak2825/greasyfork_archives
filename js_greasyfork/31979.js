// ==UserScript==
// @name         A9 - Shoes (Left Image Problem)
// @namespace    https://github.com/Kadauchi
// @version      1.0.1
// @description  Does things...
// @author       Kadauchi
// @icon         http://i.imgur.com/oGRQwPN.png
// @include      /^https://(www\.mturkcontent|s3\.amazonaws)\.com/
// @require      http://code.jquery.com/jquery-3.2.1.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/31979/A9%20-%20Shoes%20%28Left%20Image%20Problem%29.user.js
// @updateURL https://update.greasyfork.org/scripts/31979/A9%20-%20Shoes%20%28Left%20Image%20Problem%29.meta.js
// ==/UserScript==

if ($(`u:contains(LEFT IMAGE PROBLEM)`).length === 0) return;

$(`body`).prepend(
  `<div style="background-color: lightgreen;">` +
  `<label style="color: black; margin-left: 10px; cursor: help" title="Check Auto Submit to submit when a button is clicked">` +
  `A9 - Shoes (Left Image Problem)` +
  `</label>` +

  `<label style="color: black; float: right; margin-right: 10px;">Auto Submit: ` +
  `<input id="autosubmit" type="checkbox" ${GM_getValue(`autosubmit`) ? `checked` : ``}></input>` +
  `</label>` +
  `</div>`
);

$(`table`).eq(1).children().last().hide().end().eq(0).after(
  `<div id="bad" class="col-xs-6"><b>Problem</b></div>` +
  `<div id="good" class="col-xs-6"><b>No Problem</b></div>`
);

const btns = [
  `Poor lighting / is blurry`,
  `No Boot`,
  `Can't see most / cut off`,
  `Too Small`,
  `No top / side`,
  `Strongly Dissimilar`,
  `Dissimilar`,
  `Neither`,
  `Similar`,
  `Strongly Similar`
];

for (const i in btns) {
  $(`#${i < 5 ? `bad` : `good`}`).append(
	`<button type="button" class="btn btn-primary btns" style="width: 100%; overflow: hidden;" value="${i}">${btns[i]}</button><br>`
  );
}

$(`.btns`).click(e => {
  $(`.btns.btn-success, .btns[value="${e.target.value}"]`).toggleClass(`btn-success`, `btn-primary`);

  $(`:radio`).eq(e.target.value).click();

  if ($(`#autosubmit:checked`).length !== 0) {
	$(`:submit`).click();
  }
});

$(`#autosubmit`).change(e => {
  GM_setValue(`autosubmit`, e.target.checked);
});