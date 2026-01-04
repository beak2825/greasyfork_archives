// ==UserScript==
// @name         Idlescape Notepad
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  Notepad for Idlescape
// @author       Grettz
// @match        *://*.idlescape.com/game*
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/409904/Idlescape%20Notepad.user.js
// @updateURL https://update.greasyfork.org/scripts/409904/Idlescape%20Notepad.meta.js
// ==/UserScript==

(function() {
  'use strict';
  // Notes button
  $("#usersOnline").prepend('<button id="notesButton">Notes</button>');
  $("#notesButton").css("background-color", "inherit").css("color", "inherit").css("float", "left").css("border", "none").css("outline", "none");
  // Notepad
  $('.game-content').append(
    '<div id="notesContainer">' +
      '<textarea id="notesArea" name="Notes"></textarea>' +
      '<input type="button" id="saveNote" value="Save Note">' +
    '</div>'
  );
  $("#notesContainer").css("position", "relative").css("top", 0).css("left", 0).css("z-index", 100010);
  $("#notesContainer").css("display", "none").css("height", "0px").css("width", "0px");
  $("#notesArea").css("background-color", "white").css("resize", "both").css("white-space", "pre");

  // Open/Close Notepad
  let notesOpen = false;
  $("#notesButton").on("click", () => {
    if (!notesOpen) { // Open notepad
      let width = "350px";
      let height = "200px";
      // Get saved notepad size from session
      let storedWidth = sessionStorage.getItem("notepadWidth");
      let storedHeight = sessionStorage.getItem("notepadHeight");
      if (storedWidth && storedHeight) {
        width = storedWidth;
        height = storedHeight;
      };

      // Show and animate notepad
      $("#notesContainer").css("display", "block");
      $("#notesArea").animate({
        width: width,
        height: height
      }, 350, () => {
        notesOpen = true;
      });

    } else { //  Close notepad
      // Save notepad size for session
      let width = $("#notesArea").width() + 6 + "px";
      let height = $("#notesArea").height() + 6 + "px";
      sessionStorage.setItem("notepadWidth", width);
      sessionStorage.setItem("notepadHeight", height);
      $("#notesArea").animate({
        width: "0px",
        height: "0px"
      }, 350, () => {
        $("#notesContainer").css("display", "none");
        notesOpen = false;
      });
    };
  });

  // Save button
  $("#saveNote").on("click", () => {
    saveNotes();
  });

  function saveNotes() {
    let notes = $("#notesArea").val();
    localStorage.setItem("notesData", notes);
    console.log("Notes saved!");
  };

  function loadNotes() {
    let notes = localStorage.getItem("notesData");
    if (notes == "undefined" || notes == null) {
      $("#notesArea").val("New Note");
      return
    };
    $("#notesArea").val(notes);
    console.log("Notes loaded!");
  };

  window.addEventListener("beforeunload", saveNotes);
  window.addEventListener("load", loadNotes);
})();