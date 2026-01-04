// ==UserScript==
// @name         LiveWorkSheet solver (english)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Solves liveworksheets.com exercises
// @author       SOMEBODY
// @grant        none
// @match        https://www.liveworksheets.com/*
// @require http://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/420766/LiveWorkSheet%20solver%20%28english%29.user.js
// @updateURL https://update.greasyfork.org/scripts/420766/LiveWorkSheet%20solver%20%28english%29.meta.js
// ==/UserScript==
/*jshint esversion: 8 */

(function () {
  "use strict";
  var selectableDiv,
    megoldasArray,
    joindiv,
    selectboxok,
    editablediv,
    howManyManual = 0,
    howManyManualCounted = false;

  function GM_addStyle(css) {
    var head, style;
    head = document.getElementsByTagName("head")[0];
    if (!head) {
      return;
    }
    style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = css;
    head.appendChild(style);
  }

  window.addEventListener(
    "load",
    function () {
      GM_addStyle(`
      .modal {
        z-index: -1;
        opacity: 0;
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgb(0,0,0);
        background-color: rgba(0,0,0,0.4);
      }`);

      GM_addStyle(`.modal-content {
        background-color: #fefefe;
        margin: 15% auto;
        padding: 20px;
        border: 1px solid #888;
        width: 80%;
      }`);

      GM_addStyle(`.close {
        color: #aaa;
        float: right;
        font-size: 28px;
        font-weight: bold;
      }`);

      GM_addStyle(`.close:hover,
      .close:focus {
        color: black;
        text-decoration: none;
        cursor: pointer;
      }`);

      GM_addStyle(`.hideModal{
        z-index:-1;
        opacity:0 !important;
        animation: hide .25s;
        transform: scale(0);
        }@keyframes hide {
        from{
          z-index:2;
        transform: scale(1);
            opacity:1;
        } to{
          z-index:-1;
            transform: scale(0);
            opacity: 0;
        }
    }`);
      GM_addStyle(`.showModal{
        opacity:1 !important;
        z-index:2;
        animation: show .2s;
        transform: scale(1);
    }
    @keyframes show {
      from{
        transform: scale(0);
        opacity:0 !important;
        z-index:-1;
      } to{
        transform: scale(1);
        opacity: 1 !important;
        z-index:2;
      }
    }`);

      if (
        $(
          "#capainfo > table > tbody > tr > td:nth-child(1) > table:nth-child(2) > tbody > tr > td:nth-child(3)"
        )[0] != null &&
        $(
          "#capainfo > table > tbody > tr > td:nth-child(1) > table:nth-child(2) > tbody > tr > td:nth-child(3)"
        )[0] != undefined
      ) {
        $(
          "#capainfo > table > tbody > tr > td:nth-child(1) > table:nth-child(2) > tbody > tr > td:nth-child(3)"
        )[0].innerHTML =
          "<span onClick='toggleSolveModal()'><center><img src='https://www.liveworksheets.com/images/comprobarrespuestas.jpg' style='cursor:pointer'></center><a href='javascript:void(1)'><h3>Auto-fill worksheet</h3></a></span>";
      } else {
        var tempHtml = $("#capaeditar")[0].innerHTML;
        $("#capaeditar")[0].innerHTML =
          "<span onClick='toggleSolveModal()'><center><img src='https://www.liveworksheets.com/images/comprobarrespuestas.jpg' style='cursor:pointer'></center><a href='javascript:void(1)'><h3Auto-fill worksheet</h3></a></span><br>" +
          tempHtml;
      }

      $("body")[0].innerHTML += `
      <!-- The Modal -->
<div id="modal" class="modal hideModal" style="display: none;">
  <!-- Modal content -->
  <div class="modal-content">
    <span class="close">&times;</span>
    <center><h2 id="howManyManual" style="color: red;"></h2></center>
    <table style="width: 100%;">
      <tbody>
        <tr>
          <td style="width: 50%;">
            <span onClick="solveWorkShit();toggleSolveModal()">
              <img
                src="https://www.liveworksheets.com/images/comprobarrespuestas.jpg"
                style="cursor: pointer;"
              />
              <a href="javascript:void(1)"
                ><h3>Teljes feladatlap kitöltése<br>Solve worksheet automatically</h3></a
              ></span
            >
          </td>
          <td style="width: 50%;">
            <h2>Only solve certain tasks</h2>
            <input type="checkbox" id="btn1" name="btn1" value="btn1" />
            <label for="btn1">Drop-down menu</label><br />
            <input type="checkbox" id="btn2" name="btn2" value="btn2" />
            <label for="btn2">Optional buttons</label><br />
            <input type="checkbox" id="btn3" name="btn3" value="btn3" />
            <label for="btn3">Checkered</label><br />
            <input type="checkbox" id="btn4" name="btn4" value="btn4" />
            <label for="btn4">Typist</label><br />
            <input type="checkbox" id="btn5" name="btn5" value="btn5" />
            <label for="btn5">Connecting</label><br />
            <input type="checkbox" id="btn6" name="btn6" value="btn6" />
            <label for="btn6">Drag and drop</label><br />
            <br>
            <button type="button" onClick="solveSpecific()">Kitöltés!</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>`;
      $(".close")[0].onclick = function () {
        window.toggleSolveModal();
      };
    },
    false
  );

  window.saveVariables = function saveVariables() {
    selectableDiv =
      $("#selectablediv")[0] != null && $("#selectablediv")[0] != undefined
        ? $("#selectablediv")[0]
        : [];
    megoldasArray = JSON.parse(window.contenidojson);
    joindiv =
      $(".joindiv")[0] != null && $(".joindiv")[0] != undefined
        ? $(".joindiv")
        : [];
    selectboxok =
      $(".selectbox")[0] != null && $(".selectbox")[0] != undefined
        ? $(".selectbox")
        : [];
    editablediv =
      $(".editablediv")[0] != null && $(".editablediv")[0] != undefined
        ? $(".editablediv")
        : [];
  };

  window.toggleSolveModal = function toggleSolveModal() {
    saveVariables();
    if ($(".modal")[0].style.display == "none") {
      $(".modal")[0].style.display = "block";
    }
    if (howManyManual == 0 && howManyManualCounted == false) {
      howManyManualCounted = true;
      for (const n of megoldasArray) {
        if (n[0] == "") {
          howManyManual++;
        }
      }
      if (howManyManual != 0) {
        $("#howManyManual")[0].innerHTML =
          "Figyelem!<br>Van " +
          String(howManyManual) +
          "db, amit manuálisan kell megoldanod!";
      }
    }
    for (var i = 1; i <= 6; i++) {
      $("#btn" + String(i))[0].checked = false;
    }
    $(".modal").toggleClass("showModal");
    $(".modal").toggleClass("hideModal");
    /*if ($(".modal")[0].style.display == "none") {
      $(".modal")[0].style.display = "block";
    } else {
      $(".modal")[0].style.display = "none";
    }*/
  };

  window.solveSpecific = function solveSpecific() {
    //Legördülő
    if ($("#btn1")[0].checked) {
      solveSelectBox();
    }
    //Választható
    if ($("#btn2")[0].checked) {
      solveGreenButton();
    }
    //Pipa
    if ($("#btn3")[0].checked) {
      solveCheckMark();
    }
    //Begépelő
    if ($("#btn4")[0].checked) {
      solveInputField();
    }
    //Öszekötős
    if ($("#btn5")[0].checked) {
      solveJoins();
    }
    //Fogd es huzd
    if ($("#btn6")[0].checked) {
      solveDragAndDrop();
    }
    toggleSolveModal();
  };

  //Solves worksheet, returns false if an error happened
  window.solveWorkShit = function solveWorkShit() {
    try {
      saveVariables();
      //Solve selectBoxes (dropdowns)
      solveSelectBox();
      //Solve green pressable buttons
      solveGreenButton();
      //Solve input fields
      solveInputField();
      //Solve checkMarks
      solveCheckMark();
      //solve joins
      solveJoins();
      //Solve drag&drops
      solveDragAndDrop();
    } catch (e) {
      return false;
    }
    return true;
  };

  //Solve dropdowns
  window.solveSelectBox = async function solveSelectBox() {
    saveVariables();
    try {
      //Selectboxok
      for (let i = 0; i < selectboxok.length; i++) {
        for (let j = 0; j < selectboxok[i].length; j++) {
          if (selectboxok[i][j].value == "right") {
            selectboxok[i][j].selected = "selected";
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  window.solveGreenButton = async function solveGreenButton() {
    saveVariables();
    try {
      //Zold gombok
      for (let i = 0; i < megoldasArray.length; i++) {
        if (String(megoldasArray[i][0]).includes("select")) {
          if (
            String(megoldasArray[i][0]).includes("yes") &&
            clickedanswer[i] != "yes"
          ) {
            selectanswer(i);
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  window.solveInputField = async function solveInputField() {
    saveVariables();
    try {
      //Beirhato szoveg
      for (let i = 0; i < editablediv.length; i++) {
        var str = editablediv[i].id;
        var string = megoldasArray[str.substring(7, str.length)][0];
        if (string.includes("/")) {
          editablediv[i].innerHTML = string.replace("$", "'").split("/")[0];
        } else {
          editablediv[i].innerHTML = string.replace("$", "'");
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  window.solveCheckMark = async function solveCheckMark() {
    saveVariables();
    try {
      //Pipa dobozok
      for (let i = 0; i < megoldasArray.length; i++) {
        if (
          String(megoldasArray[i][0]).includes("tick") &&
          String(megoldasArray[i][0]).includes("yes")
        ) {
          if (clickedanswer[i] != "yes") {
            tickanswer(i);
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  window.solveJoins = async function solveJoins() {
    saveVariables();
    function indi(inputTomb, keresendo) {
      var returnArray = [];

      for (let i = 0; i < inputTomb.length; i++) {
        if (String(inputTomb[i][0]) == keresendo) {
          returnArray.push(i);
        }
      }
      return returnArray;
    }

    try {
      //Az osszekotos
      for (let i = 0; i < joindiv.length; i++) {
        joindiv[i].onmousedown = "";
        joindiv[i].ontouchstart = "";
      }
      for (let i = 0; i < window.contenidorellenado.length; i++) {
        window.contenidorellenado[i][5] = window.contenidorellenado[i][0];
      }

      for (let i = 0; i < megoldasArray.length; i++) {
        if (megoldasArray[i][0].includes("join")) {
          var arr = indi(megoldasArray, megoldasArray[i][0]);
          var y1 =
            Number(
              String($("#joindiv" + String(arr[0]))[0].style.top).split("px")[0]
            ) +
            Number(
              String($("#joindiv" + String(arr[0]))[0].style.height).split(
                "px"
              )[0]
            ) /
              2;
          var x1 =
            Number(
              String($("#joindiv" + String(arr[0]))[0].style.left).split(
                "px"
              )[0]
            ) +
            Number(
              String($("#joindiv" + String(arr[0]))[0].style.width).split(
                "px"
              )[0]
            ) /
              2;
          var x2 =
            Number(
              String($("#joindiv" + String(arr[1]))[0].style.left).split(
                "px"
              )[0]
            ) +
            Number(
              String($("#joindiv" + String(arr[1]))[0].style.width).split(
                "px"
              )[0]
            ) /
              2;
          var y2 =
            Number(
              String($("#joindiv" + String(arr[1]))[0].style.top).split("px")[0]
            ) +
            Number(
              String($("#joindiv" + String(arr[1]))[0].style.height).split(
                "px"
              )[0]
            ) /
              2;
          $("#elsvgdefinitivo")[0].innerHTML +=
            '<line x1="' +
            String(x1) +
            '" y1="' +
            String(y1) +
            '" x2="' +
            String(x2) +
            '" y2="' +
            String(y2) +
            '" stroke="darkblue" stroke-width="5"/>';

          arr = [];
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  window.solveDragAndDrop = async function solveDragAndDrop() {
    saveVariables();
    try {
      //Drag&Drop
      for (let i = 0; i < megoldasArray.length; i++) {
        var tempArray = [];
        if (String(megoldasArray[i][0]).includes("drag")) {
          tempArray.push(i);
          for (let j = 0; j < megoldasArray.length; j++) {
            try {
              if (
                megoldasArray[j][0] ==
                "drop" +
                  String(megoldasArray[i][0]).slice(
                    4,
                    String(megoldasArray[i][0]).length
                  )
              ) {
                tempArray.push(j);
                $("#dragablediv" + String(tempArray[0]))[0].style.top = $(
                  "#dropdiv" + String(tempArray[1])
                )[0].style.top;
                $("#dragablediv" + String(tempArray[0]))[0].style.left = $(
                  "#dropdiv" + String(tempArray[1])
                )[0].style.left;
                tempArray = [];
              }
            } catch (err) {
              console.error(err);
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };
})();
