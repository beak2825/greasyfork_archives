// ==UserScript==
// @name         MAL Full History
// @namespace    Check Your Full Watching History on MAL!
// @version      1.1
// @description  Just an Easy Script that lets You to check Your Full Watching History on MAL
// @author       NurarihyonMaou
// @match        https://anime.plus/*/list,anime
// @match        https://myanimelist.net/ajaxtb.php*
// @icon         https://www.google.com/s2/favicons?domain=anime.plus
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @require      http://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/430856/MAL%20Full%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/430856/MAL%20Full%20History.meta.js
// ==/UserScript==

const $ = window.jQuery;

let id = [];
let CurrentTitle;
let FullHistory = [];

function ExportDataToCSV($table, filename) {
  let csv = "";
  let rows = $table.find("tr");

  $.each(rows, function (index, row) {

        $.each($(row).find("td"), function (index, entry) {
            if (index < 2) csv += $(entry).text() + "|";
            else csv += $(entry).text() + "\n";
        });
  });

  let csvData = "data:application/csv;charset=utf-8," + encodeURIComponent(csv);

  $(this).attr({
    download: filename,
    href: csvData,
    target: "_blank",
  });
}

function FillTable() {

  for (let e = 0; e < FullHistory.length; e++) {
    $("table").append(
      "<tr><td>" +
        FullHistory[e].Title +
        "</td><td>" +
        FullHistory[e].Ep +
        "</td>" +
        "<td>" +
        FullHistory[e].Date +
        "</td></tr>"
    );
  }

  $("body table td").css("padding", "10px").css("border", "1px black solid");
  $("body table td").css("background-color", "#4B5054");
}

if (window.location.pathname.split("/")[2] === "list,anime") {
  alert("Start");
  $("tbody")
    .find(".status-F, .status-C, .status-H, .status-D")
    .next()
    .children()
    .each(function () {
      id.push($(this).attr("href").slice(30));
    });
  GM_setValue("id", id);
  document.location =
    "https://myanimelist.net/ajaxtb.php?keepThis=true&detailedaid=" + id[0];
}

if (window.location.pathname.split("/")[1] === "ajaxtb.php") {

  $("body").css("background-color", "#7E848A").css("color", "#2db300");

  id = GM_getValue("id");

  $("body").html(
    "<h1><center><label for='p1'>Fetching Data</label></br><progress id='p1' value='0' max='" +
      id.length +
      "'></progress></center></h1>"
  );

  for (let i = 0; i < id.length; i++) {
    $.ajax({
      method: "GET",
      url:
        "https://myanimelist.net/ajaxtb.php?keepThis=true&detailedaid=" + id[i],
      complete: function (data) {
        data = data.responseText;

        CurrentTitle = $(data)
          .find(".normal_header")
          .text()
          .replace(" Episode Details", "");

        $($(data).find(".spaceit_pad").get().reverse()).each(function () {
          FullHistory.push({
            Title: CurrentTitle,
            Ep: $(this).text().replace("Ep ", "").split(",")[0],
            Date: $(this)
              .append(":00")
              .text()
              .replace("Ep ", "")
              .replace("watched", "")
              .replace(" Remove", "")
              .split(",")[1]
              .replace("on ", "")
              .replace("at ", "")
              .replace("  ", ""),
          });
        });

        if ($("#p1").attr("value") < i) $("#p1").attr("value", i + 1);

        if (i == id.length - 1) {
          $("body").html("<center><h1>Wait for a few Seconds</h1></center>");
          setTimeout(function () {
            FullHistory.sort(function (a, b) {
              return (
                Date.parse(a.Date) - Date.parse(b.Date) ||
                parseInt(a.Ep) - parseInt(b.Ep) ||
                a.Title - b.Title
              );
            });
            $("body").html(
                "<center><h1>Records: " +
                  FullHistory.length +
                  "<table><br><a href='' class='Export'>Export Data to CSV</a><tr><td>Title</td><td>Ep</td><td>Date</td></tr>"
              );
              $("body").on("click", ".Export", function () {
                ExportDataToCSV.apply(this, [$("body table"), "FullWatchingHistory.csv"]);
              });
            FillTable();
          }, 3000);
        }
      },
      error: function () {
        alert("Unexpected Error Occured");
      },
    });
  }
}
