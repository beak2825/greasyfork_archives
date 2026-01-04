// ==UserScript==
// @license MIT
// @name         LiveWorkSheetCheet
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  Lahendab LiveWorkSheete ise kui sa ei viitsi
// @author       Mingi tüüp
// @grant        none
// @match        https://www.liveworksheets.com/*
// @require http://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/434999/LiveWorkSheetCheet.user.js
// @updateURL https://update.greasyfork.org/scripts/434999/LiveWorkSheetCheet.meta.js
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
          "<span onClick='toggleSolveModal()'><center><img src='data:image/jpeg;base64,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' style='cursor:pointer'></center><a href='javascript:void(1)'><h3>Vajuta siia kui ei viitsi teha!</h3></a></span>";
      } else {
        var tempHtml = $("#capaeditar")[0].innerHTML;
        $("#capaeditar")[0].innerHTML =
          "<span onClick='toggleSolveModal()'><center><img src='data:image/jpeg;base64,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' style='cursor:pointer'></center><a href='javascript:void(1)'><h3>Vajuta siia kui ei viitsi teha!</h3></a></span><br>" +
          tempHtml;
        }

        $("body")[0].innerHTML += `
      <!-- The Modal -->
<div id="modal" class="modal hideModal" style="display: none;">
  <!-- Modal content -->
  <div class="modal-content">
    <span class="close">&times;</span>
    <center><h2 id="howManyManual" style="color: black;"></h2></center>
    <table style="width: 60%;">
    </script>
      <a href="https://discord.gg/UD3ApXNpzx" target="_blank">Tule meie discordi serveri!</a>
      <tbody>
        <tr>
          <td style="width: 5%;">
          <img src='https://i.imgur.com/kjLzQbQ.jpg'>
          <span onClick="solveWorkShit();toggleSolveModal()">
          </td>
          <td style="width: 50%;">
            <h2>Vali missugune ülesanne on! Või ole laisk ja vajuta "Vali kõik".</h2>
            <input type="checkbox" id="btn0" name="btn0" value="btn0" />
            <label for="btn0">Vali kõik</label><br />
            <input type="checkbox" id="btn1" name="btn1" value="btn1" />
            <label for="btn1">Rippvalik</label><br />
            <input type="checkbox" id="btn2" name="btn2" value="btn2" />
            <label for="btn2">Valikuline</label><br />
            <input type="checkbox" id="btn3" name="btn3" value="btn3" />
            <label for="btn3">Ruuduline</label><br />
            <input type="checkbox" id="btn4" name="btn4" value="btn4" />
            <label for="btn4">Kirjutada</label><br />
            <input type="checkbox" id="btn5" name="btn5" value="btn5" />
            <label for="btn5">Ühendada</label><br />
            <input type="checkbox" id="btn6" name="btn6" value="btn6" />
            <label for="btn6">Lohistada</label><br />
            <br>
            <button type="button" onClick="solveSpecific()">Hui viitsid teha, vajuta siia et automaatselt teha!</button>
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
                    "<br>Kasuta vastutustundlikult, ära ole sus impostor."
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
        if ($("#btn0")[0].checked) {
            solveSelectBox();
            solveGreenButton();
            solveCheckMark();
            solveInputField();
            solveJoins();
            solveDragAndDrop();
        }
        if ($("#btn1")[0].checked) {
            solveSelectBox();
        }
        if ($("#btn2")[0].checked) {
            solveGreenButton();
        }
        if ($("#btn3")[0].checked) {
            solveCheckMark();
        }
        if ($("#btn4")[0].checked) {
            solveInputField();
        }
        if ($("#btn5")[0].checked) {
            solveJoins();
        }
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
                    if (selectboxok[i][j].value == '1') {
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
        try {k
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
