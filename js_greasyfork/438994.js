// ==UserScript==
// @name        Paket-i Şerif
// @author      ScriptAdam
// @namespace   ScriptAdam
// @version     2.1
// @description Script Paketi
// @include     https://tr*.klanlar.org/game.php?*
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/438994/Paket-i%20%C5%9Eerif.user.js
// @updateURL https://update.greasyfork.org/scripts/438994/Paket-i%20%C5%9Eerif.meta.js
// ==/UserScript==

(() => {
  let scripts = [
    {
      name: "Plan",
      url: "javascript:$.getScript('https://twscripts.dev/scripts/singleVillagePlanner.js');",
    },
    {
      name: "Zamanlayıcı",
      url: "javascript:$.getScript('https://twscripts.dev/scripts/massCommandTimer.js');",
    },
    {
      name: "Kilit",
      url: "javascript:$.getScript('https://twscripts.dev/scripts/singleVillageSnipe.js');",
    },
    {
      name: "Fake+",
      url: "javascript:$.getScript('https://twscripts.dev/scripts/evolvedFakeTrain.js');",
    },
    {
      name: "Komutlar",
      url: "javascript:$.getScript('https://twscripts.dev/scripts/commandsOverview.js');",
    },
    {
      name: "Gelenler",
      url: "javascript:var NOBLE_GAP=100;var FORMAT='%unit%  %sent%';$.getScript('https://twscripts.dev/scripts/incomingsOverview.js');",
    },
    {
      name: "Maden Dengeleyici",
      url: "javascript:$.getScript('https://shinko-to-kuma.com/scripts/WHBalancerShinkoToKuma.js');",
    },
    {
      name: "Maden İstek",
      url: "javascript:$.getScript('https://shinko-to-kuma.com/scripts/requestScript.js');",
    },
    {
      name: "Katlama Yardımcısı",
      url: "javascript:$.getScript('https://shinko-to-kuma.com/scripts/res-senderV2.js');",
    },
    {
      name: "Klan Bilgisi",
      url: "javascript:$.getScript('https://shinko-to-kuma.com/scripts/tribeMembersTroopCalculator.js');",
    },
  ];

  sinlyRoutine();

  function sinlyRoutine() {
    if (localStorage.quicko == "0") {
      barLoader();
    } else {
      bar();
      barLoader();
    }
  }
  function bar() {
    let quicko = `<td id="quicko" class="menu quickbar packDiv labeled-box">`;
    for (const script of scripts) {
      quicko += `
  <a class="packA" onclick="${script.url}">
    ${script.name}
  </a>
  &bull;`;
    }
    quicko += `<a class="packA" id="villageNotes">Köy Notu</a></td>
<style>
.packDiv {
display: flex;
flex: 1;
justify-content: flex-start;
gap: 5px;
border-width:1px;
border-style: solid solid none solid;
justify-content: center;
align-items: center;
font-size: 10px;
}
.packA {
cursor: progress;
}
</style>`;

    document
      .getElementById("contentContainer")
      .insertAdjacentHTML("afterbegin", quicko);

    document
      .getElementById("villageNotes")
      .addEventListener("click", villageNotes);
  }

  function barLoader() {
    const toggler = `
<div
id="toggle"
class="quest"
style="
  background-image: url(https://img.icons8.com/cotton/16/000000/octahedron.png);
  display: block;
  margin-left: auto;
  margin-right: auto;
"></div>
`;
    document
      .getElementById("questlog_new")
      .insertAdjacentHTML("beforeend", toggler);
    document.getElementById("toggle").onclick = () => {
      let q = document.getElementById("quicko");
      if (q) {
        if (q.style.display === "none") {
          q.style.display = "flex";
          localStorage.quicko = 1;
        } else {
          q.style.display = "none";
          localStorage.quicko = 0;
        }
      } else {
        bar();
        localStorage.quicko = 1;
      }
    };
  }

  function villageNotes() {
    var scriptData = {
      prefix: "setGetVillageNotes",
      name: "Set/Get Village Notes",
      version: "v1.2.1",
      author: "RedAlert",
      authorUrl: "https://twscripts.dev/",
      helpLink:
        "https://forum.tribalwars.net/index.php?threads/set-get-village-note.286051/",
    };

    // Globals
    var allowedScreens = ["report", "info_command"];

    // Translations
    var translations = {
      en_DK: {
        "Set/Get Village Notes": "Set/Get Village Notes",
        Help: "Help",
        "Note added!": "Note added!",
        "Note can not be added for this report!":
          "Note can not be added for this report!",
        "Report Link": "Report Link",
        "No notes found for this village!": "No notes found for this village!",
        "This script requires Premium Account to be active!":
          "This script requires Premium Account to be active!",
        "Finished!": "Finished!",
      },
    };

    // Init Set Village Notes
    function initSetVillageNote() {
      let noteText = "";
      let villageId;

      const defenderPlayerName = $("table#attack_info_def")[0].rows[0].cells[1]
        .textContent;
      if (defenderPlayerName !== "---") {
        // Prepare note data
        if (defenderPlayerName == game_data.player.name) {
          villageId = $("table#attack_info_att")[0]
            .rows[1].cells[1].getElementsByTagName("span")[0]
            .getAttribute("data-id");
        } else {
          villageId = $("table#attack_info_def")[0]
            .rows[1].cells[1].getElementsByTagName("span")[0]
            .getAttribute("data-id");
        }

        noteText += "\n" + $("#report_export_code")[0].innerHTML + "\n";

        // Add note on village
        TribalWars.post(
          "info_village",
          {
            ajaxaction: "edit_notes",
            id: villageId,
          },
          {
            note: noteText,
          },
          function () {
            UI.SuccessMessage(tt("Note added!"), 2000);
            if (jQuery("#report-next").length) {
              document.getElementById("report-next").click();
            } else {
              UI.SuccessMessage(tt("Finished!"), 2000);
              window.location.assign(game_data.link_base_pure + "report");
            }
          }
        );
      } else {
        UI.ErrorMessage(tt("Note can not be added for this report!"), 2000);
      }
    }

    // Init Get Village Notes
    function initGetVillageNote() {
      $.get(
        $(".village_anchor").first().find("a").first().attr("href"),
        function (html) {
          const note = jQuery(html).find("#own_village_note .village-note");
          if (note.length > 0) {
            const noteContent = `
                  <div id="ra-village-notes" class="vis">
                      <div class="ra-village-notes-header">
                          <h3>${tt(scriptData.name)}</h3>
                      </div>
                      <div class="ra-village-notes-body">
                          ${note[0].children[1].innerHTML}
                      </div>
                  </div>
                  <style>
                      #ra-village-notes { position: relative; display: block; width: 100%; height: auto; clear: both; margin: 15px auto; padding: 10px; box-sizing: border-box; }
                      .ra-village-notes-footer { margin-top: 15px; }
                  </style>
              `;
            jQuery("#content_value table:eq(0)").after(noteContent);
          }
        }
      );
    }

    // Helper: Format as number
    function formatAsNumber(number) {
      return parseInt(number).toLocaleString("de");
    }

    // Helper: Get parameter by name
    function getParameterByName(name, url = window.location.href) {
      return new URL(url).searchParams.get(name);
    }

    // Helper: Text Translator
    function tt(string) {
      var gameLocale = game_data.locale;

      if (translations[gameLocale] !== undefined) {
        return translations[gameLocale][string];
      } else {
        return translations["en_DK"][string];
      }
    }

    (function () {
      const gameScreen = getParameterByName("screen");
      const gameView = getParameterByName("view");
      const commandId = getParameterByName("id");

      if (game_data.features.Premium.active) {
        if (allowedScreens.includes(gameScreen)) {
          if (gameScreen === "report" && gameView !== null) {
            initSetVillageNote();
          } else if (gameScreen === "info_command" && commandId !== null) {
            initGetVillageNote();
          } else {
            window.location.assign(game_data.link_base_pure + "report");
          }
        } else {
          window.location.assign(game_data.link_base_pure + "report");
        }
      }
    })();
  }
})();
