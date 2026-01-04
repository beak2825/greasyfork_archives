// ==UserScript==
// @name         DCF Shoes
// @namespace    https://github.com/Kadauchi
// @version      1.0.0
// @description  Does things...
// @author       Kadauchi
// @icon         http://i.imgur.com/oGRQwPN.png
// @include      /^https://(www\.mturkcontent|s3\.amazonaws)\.com/
// @require      http://code.jquery.com/jquery-3.2.1.min.js
// @hitsave      https://www.mturkcontent.com/dynamic/hit?hitId=3B9J25CZ25XTLM7CXH8H64573T6CSB
// @downloadURL https://update.greasyfork.org/scripts/30680/DCF%20Shoes.user.js
// @updateURL https://update.greasyfork.org/scripts/30680/DCF%20Shoes.meta.js
// ==/UserScript==

if ($(`td:contains(Shoe feature labelling)`).length === -1) return;

$(`.task_details, .task_parameters, .holder, br`).hide();

$(`.holder`).after(`
<img src="${$(`td:contains(Link to shoe image)`).next().find(`a`).prop(`href`)}" *width="400px" *height="200px">
<br><br>
<div id="presets" />
<br>
<div><table id="answers" /></div>
`);

const presets = [
  [`Athletic`,  1, 3, 1, 1, 1, 1],
  [`Other`,     1, 3, 1, 1, 3, 3],
  [`Dress`,     1, 3, 3, 1, 3, 3],
  [`Flat`,      1, 3, 3, 2, 3, 3],
  [`Flip Flop`, 1, 3, 2, 3, 3, 3],
  [`Reset`,     3, 4, 4, 4, 4, 6]
];

for (let i = 0; i < presets.length; i ++) {
  $(`#presets`).append(`<button type="button" class="presets_list" style="margin-right: 3px;" idx="${i}"">${presets[i][0]}</button>`);
}

const answers = [
  [`Good`,       `Bad`,            `Other`],
  [`High Heel`,  `Low Heel`,       `Flat Shoe`, `Unsure`],
  [`Laces`,      `Buckle / Strap`, `None`,      `Unsure`],
  [`Closed Top`, `Open Top`,       `Sandal`,    `Unsure`],
  [`Trainer`,    `Boot`,           `Other`,     `Unsure`],
  [`Branded`,    `White`,          `Black`,     `Brown`, `Colour`, `Unsure`]
];

for (let i = 0; i < answers.length; i ++) {
  let html = ``;

  for (let j = 0; j < answers[i].length; j ++) {
	html += `<td><button type="button" class="answers_list${i}" style="width: 100%;" sel="${i}" opt="${j}">${answers[i][j]}</button></td>`;
  }

  $(`#answers`).append(`<tr>${html}</tr>`);
}

$(`[class^=presets_list]`).click(function () {
  const idx = $(this).attr(`idx`);

  for (let i = 0; i < 6; i ++) {
	$(`#answers`).find(`tr`).eq(i).find(`button`).eq(presets[idx][i + 1] - 1).click();
  }
});

$(`[class^=answers_list]`).click(function () {
  const sel = $(this).attr(`sel`);
  const opt = $(this).attr(`opt`);

  $(`select`).eq(sel).find(`option`).eq(opt).prop(`selected`, true);
  $(`[class=${$(this).attr('class')}]`).css(`background-color`, ``);
  $(this).css(`background-color`,`lightgreen`);
});

for (let i = 0; i < 6; i ++) {
  $(`#answers`).find(`tr`).eq(i).find(`button`).eq([3, 4, 4, 4, 4, 6][i] - 1).click();
}

document.addEventListener(`keydown`, function (event) {
  if (event.keyCode === 13) {
	$(`#submitButton`).click();
  }
});