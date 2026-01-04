// ==UserScript==
// @name         WaniKani Review Stats
// @namespace    https://github.com/frogstair
// @version      1.2
// @description  Show some extra statistics about your latest WaniKani review session
// @author       frogstair
// @match        https://www.wanikani.com/review
// @match        https://www.wanikani.com/review/session
// @icon         https://www.google.com/s2/favicons?domain=atomicobject.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428204/WaniKani%20Review%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/428204/WaniKani%20Review%20Stats.meta.js
// ==/UserScript==

var incorrect = {
  reading: {
    radical: {},
    kanji: {},
    vocabulary: {},
  },
  meaning: {
    radical: {},
    kanji: {},
    vocabulary: {},
  },
};

var stats = {
  total_done: 0,
  total_correct: 0,

  total_readings: 0,
  correct_readings: 0,

  total_meanings: 0,
  correct_meanings: 0,

  total_kanji: 0,
  total_kanji_m: 0,
  total_kanji_r: 0,
  correct_kanji_m: 0,
  correct_kanji_r: 0,

  total_vocab: 0,
  total_vocab_m: 0,
  total_vocab_r: 0,
  correct_vocab_m: 0,
  correct_vocab_r: 0,

  total_radicals: 0,
  correct_radicals: 0,
};

var ready = false;
var loader = document.getElementById("loading");
var answered = false;

var obs = new MutationObserver((mutrec) => {
  mutrec.forEach((m) => {
    if (m.attributeName) {
      attach();
    }
  });
});

(function () {
  "use strict";
  if (window.location.pathname != "/review")
    obs.observe(loader, { attributes: true, attributeFilter: ["style"] });
  else attach();
})();

function attach() {
  if (ready) {
    return;
  }
  ready = true;
  obs.disconnect();

  var summary = document.getElementById("reviews-summary");
  if (summary) {
    lesson_complete();
  } else {
    lesson_not_complete();
  }
}

function lesson_complete() {
  if (!localStorage.getItem("wkStats")) {
    return;
  }
  stats = JSON.parse(localStorage.getItem("wkStats"));
  var summary = $("#reviews-summary");

  $("head").append(
    $(`<style>

    table {
      width: 100%;
      text-align: center;
      table-layout: fixed;
    }

    td {
      padding: 5px;
    }

    info_icon {
      margin-left: -0.1em;
      margin-right: 0.2em;
    }

    div.progress_bg {
      margin-top: 5px;
      background-color: #e0e0e0;
      width: 100%;
      border-radius: 10px;
    }

    div.progress_fg {
      background-color: #08c66c;
      width: 0%;
      border-radius: inherit;
    }

    h4 {
      margin: 0.3em !important;
      color: #a2a2a2;
      font-weight: 800;
      line-height: 1em;
    }

    h3.table-head {
      margin: 0.3em !important;
      border-bottom: none !important;
    }
  </style>`)
  );

  var table = $(`<div id="statistics" class="pure-g-r">
  <div id="correct" class="pure-u-1 progress-entry" style="display: block">
    <h2 style="background-color: #0098e4 !important">
      <b>
        <i class="info_icon icon-foo">&#xF05A;</i>
      </b>
      Statistics
    </h2>
    <div class="master active">
      <h3>
        <span>Total answered: <strong id="ta"></strong></span>
      </h3>
      <h3>
        <span>Total correct: <strong id="tc"></strong></span>
      </h3>
      <table>
        <tr>
          <th class="tr">
            <h3 class="table-head">Radicals</h3>
          </th>
          <th class="tk">
            <h3 class="table-head">Kanji</h3>
          </th>
          <th class="tv">
            <h3 class="table-head">Vocabulary</h3>
          </th>
        </tr>
        <tr>
          <td class="tr">
            <span style="color: #a2a2a2" id="radical_count">0 / 0</span>
            <div class="progress_bg">
              <div id="rsl" class="progress_fg">&nbsp;</div>
            </div>
          </td>
          <td class="tk">
            <h4>Meanings</h4>
            <span style="color: #a2a2a2" id="kanji_m_count">0 / 0</span>
            <div class="progress_bg">
              <div id="kmsl" class="progress_fg">&nbsp;</div>
            </div>
            <h4>Readings</h4>
            <span style="color: #a2a2a2" id="kanji_r_count">0 / 0</span>
            <div class="progress_bg">
              <div id="krsl" class="progress_fg">&nbsp;</div>
            </div>
          </td>
          <td class="tv">
            <h4>Meanings</h4>
            <span style="color: #a2a2a2" id="vocab_m_count">0 / 0</span>
            <div class="progress_bg">
              <div id="vmsl" class="progress_fg">&nbsp;</div>
            </div>
            <h4>Readings</h4>
            <span style="color: #a2a2a2" id="vocab_r_count">0 / 0</span>
            <div class="progress_bg">
              <div id="vrsl" class="progress_fg">&nbsp;</div>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</div>
`);

  summary.children().eq(1).after(table);

  if (stats.total_done == 0) $("#statistics").remove();

  if (stats.total_radicals == 0) $(".tr").remove();
  if (stats.total_kanji == 0) $(".tk").remove();
  if (stats.total_vocab == 0) $(".tv").remove();

  $("#ta").text(stats.total_done);
  $("#tc").text(stats.total_correct);
  $("#radical_count").text(
    stats.correct_radicals + " / " + stats.total_radicals
  );
  $("#kanji_m_count").text(stats.correct_kanji_m + " / " + stats.total_kanji_m);
  $("#vocab_m_count").text(stats.correct_vocab_m + " / " + stats.total_vocab_m);

  $("#kanji_r_count").text(stats.correct_kanji_r + " / " + stats.total_kanji_r);
  $("#vocab_r_count").text(stats.correct_vocab_r + " / " + stats.total_vocab_r);

  if (stats.total_radicals != 0)
    $("#rsl").css(
      "width",
      (stats.correct_radicals / stats.total_radicals) * 100 + "%"
    );

  if (stats.total_kanji_m != 0)
    $("#kmsl").css(
      "width",
      (stats.correct_kanji_m / stats.total_kanji_m) * 100 + "%"
    );

  if (stats.total_kanji_r != 0)
    $("#krsl").css(
      "width",
      (stats.correct_kanji_r / stats.total_kanji_r) * 100 + "%"
    );

  if (stats.total_vocab_m != 0)
    $("#vmsl").css(
      "width",
      (stats.correct_vocab_m / stats.total_vocab_m) * 100 + "%"
    );

  if (stats.total_vocab_r != 0)
    $("#vrsl").css(
      "width",
      (stats.correct_vocab_r / stats.total_vocab_r) * 100 + "%"
    );
}

function lesson_not_complete() {
  var ansform = $("#answer-form");

  ansform
    .children()
    .eq(1)
    .eq(1)
    .eq(3)
    .on("mouseup", function () {
      setTimeout(complete_item, 100);
    });
  $(document).on("keyup", function (e) {
    if (e.key == "Enter") {
      setTimeout(complete_item, 100);
    }
  });
}

function complete_item() {
  var response = $("#user-response");
  var form = response.parent();

  var is_incorrect = form.hasClass("incorrect");
  var is_correct = form.hasClass("correct");
  var has_answer = is_incorrect || is_correct;

  var type = $("#character").attr("class").split(/\s+/)[0];
  var is_reading = $("#question-type").hasClass("reading");

  var category = is_reading ? "reading" : "meaning";
  var char = $("#character").children().first().text();
  if (incorrect[category][type][char]) return;

  var a = answered;
  if (answered) answered = false;

  if (!has_answer) return;

  if (a) return;
  answered = true;

  stats.total_done++;

  switch (type) {
    case "vocabulary":
      stats.total_vocab++;
      if (is_reading) stats.total_vocab_r++;
      else stats.total_vocab_m++;
      break;
    case "kanji":
      stats.total_kanji++;
      if (is_reading) stats.total_kanji_r++;
      else stats.total_kanji_m++;
      break;
    case "radical":
      stats.total_radicals++;
      break;
  }

  if (is_reading) stats.total_readings++;
  else if (type != "radical") stats.total_meanings++;

  if (!is_incorrect) {
    stats.total_correct++;

    var pf = is_reading ? "_r" : "_m";

    switch (type) {
      case "vocabulary":
        stats["correct_vocab" + pf]++;
        break;
      case "kanji":
        stats["correct_kanji" + pf]++;
        break;
      case "radical":
        stats.correct_radicals++;
        break;
    }

    if (is_reading) stats.correct_readings++;
    else stats.correct_meanings++;
  } else incorrect[category][type][char] = true;

  localStorage.setItem("wkStats", JSON.stringify(stats));
}
