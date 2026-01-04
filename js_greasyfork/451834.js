// ==UserScript==
// @name         Cookie Clicker Helper
// @namespace    https://orteil.dashnet.org/cookieclicker/
// @version      1.0
// @description  try to take over the cookies!
// @author       Hubertokf
// @match        *://orteil.dashnet.org/cookieclicker/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @grant		 GM_addStyle
// @grant		 GM_getValue
// @grant		 GM_setValue
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451834/Cookie%20Clicker%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/451834/Cookie%20Clicker%20Helper.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var $ = window.jQuery;

    console.log("Cookie Clicker Helper Init")

    function cookieHack() {
        function centerObj(o) {
            var offset = o.offset();
            var width = o.width();
            var height = o.height();

            var centerX = offset.left + width / 2;
            var centerY = offset.top + height / 2;
            var pos = {
                x: centerX,
                y: centerY,
            };

            return pos;
        }

        $(document).keydown(function( event ) {
            if ( event.which == 72 ) {
                $("#hackbox").toggle();
            }
        });

        $("body").on("mousedown", "#septop", function (e) {
            e.preventDefault();
            $(this)
                .parent()
                .addClass("draggable")
                .parents()
                .on("mousemove", function (e) {
                $(".draggable")
                    .offset({
                    top: e.pageY - 10,
                    left: e.pageX - $(".draggable").outerWidth() / 2,
                })
                    .on("mouseup", function () {
                    $(this).removeClass("draggable");
                });
            });
        }).on("mouseup", function () {
            $(".draggable").removeClass("draggable");
        });


        var styles = `
        #hackbutton {
        	bottom: 16px;
        	right: 0;
        	height: 45px;
        	left: 0;
        	margin-left: auto;
        	margin-right: auto;
        	padding-top: 6px;
        	background-position: 0px -48px;
        }

        #septop{
        	position: relative;
        }

        #septop:active{
          cursor: move;
        }

        #hackboxClose{
          text-align: right;
          float: right;
          cursor: pointer;
          font-size: 15px;
          font-weight: bold;
          padding: 0 5px;
        }

        #hackbox{
        	display: none;
          width: 300px;
          /* height: 200px; */
          margin: 0 auto;
          right: 0;
          left: 0;
          top: 200px;
          position: absolute;
        	background-color: rgba(0,0,0,0.6);
          z-index: 99999999;
        }

        #hackcredits{
          margin-top: 20px;
          font-size: 9px;
          text-align: right;
          color: #aaa;
          margin: 4px;
        }

        #hacklist{
          padding: 20px;
        }

        #hacklist li{
          margin-bottom: 10px;
          min-height: 22px;
        }

        .hackitem{
          font-family: 'Kavoon', Georgia,serif;
          font-size: 18px;
          text-shadow: 0px 0px 4px #000;
          color: #fff;
          float: left;
          line-height: 22px;
        }

        .swcookie{
          float: right !important;
        }























        /* Toogle button */

        /* ============================================================
          COMMON
        ============================================================ */
        #wrapper {
          min-width: 600px;
        }

        .settings {
          display: table;
          width: 100%;
        }
        .settings .row {
          display: table-row;
        }
        .settings .question,
        .settings .switch {
          display: table-cell;
          vertical-align: middle;
          padding: 10px;
        }
        .settings .question {
          width: 600px;
          font-family: "Roboto Slab", serif;
          font-size: 20px;
        }

        /* ============================================================
          COMMON
        ============================================================ */
        .cmn-toggle {
          position: absolute;
          margin-left: -9999px;
          visibility: hidden;
        }
        .cmn-toggle + label {
          display: block;
          position: relative;
          cursor: pointer;
          outline: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        /* ============================================================
          SWITCH 1 - ROUND
        ============================================================ */
        input.cmn-toggle-round + label {
          padding: 2px;
          width: 42px;
          height: 18px;
          background-color: rgba(0,0,0,0.5);
          -webkit-border-radius: 60px;
          -moz-border-radius: 60px;
          -ms-border-radius: 60px;
          -o-border-radius: 60px;
          border-radius: 60px;
        }
        input.cmn-toggle-round + label:before, input.cmn-toggle-round + label:after {
          display: block;
          position: absolute;
          top: 1px;
          left: 1px;
          bottom: 1px;
          content: "";
        }
        input.cmn-toggle-round + label:before {
          right: 1px;
          background-color: #555;
          -webkit-border-radius: 60px;
          -moz-border-radius: 60px;
          -ms-border-radius: 60px;
          -o-border-radius: 60px;
          border-radius: 60px;
          -webkit-transition: background 0.4s;
          -moz-transition: background 0.4s;
          -o-transition: background 0.4s;
          transition: background 0.4s;
        }
        input.cmn-toggle-round + label:after {
          width: 20px;
          background-color: #ddd;
          -webkit-border-radius: 100%;
          -moz-border-radius: 100%;
          -ms-border-radius: 100%;
          -o-border-radius: 100%;
          border-radius: 100%;
          -webkit-box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
          -moz-box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
          -webkit-transition: margin 0.4s;
          -moz-transition: margin 0.4s;
          -o-transition: margin 0.4s;
          transition: margin 0.4s;
        }
        input.cmn-toggle-round:checked + label:before {
          background-color: #8ce196;
        }
        input.cmn-toggle-round:checked + label:after {
          margin-left: 25px;
        }
        `

        const getUpgrades = () => [
            {name: "Cursor", id: "#product0"},
            {name: "Vovó", id: "#product1"},
            {name: "Fazenda", id: "#product2"},
            {name: "Mina", id: "#product3"},
            {name: "Fábrica", id: "#product4"},
            {name: "Banco", id: "#product5"},
            {name: "Templo", id: "#product6"},
            {name: "Torre de bruxos", id: "#product7"},
            {name: "Carregamento", id: "#product8"},
            {name: "Laboratório de alquimia", id: "#product9"},
            {name: "Portal", id: "#product10"},
            {name: "Máquina do tempo", id: "#product11"},
            {name: "Condensador antimatéria", id: "#product12"},
            {name: "Prisma", id: "#product13"},
            {name: "Criador do acaso", id: "#product14"},
            {name: "Motor fractal", id: "#product15"},
            {name: "Console de javascript", id: "#product16"},
            {name: "Ocioverso", id: "#product17"},
            {name: "Confeiteiro de córtex", id: "#product18"},
        ]

        var box = `
            <div id='hackbox' class=''>
                <div id='septop' class='separatorBottom'>
                <div id='hackboxClose'>X</div>
            </div>
                <ul id='hacklist'>
                    <li>
                        <div class='hackitem'>Auto Click</div>
                        <div class='switch swcookie'>
                            <input id='autoclick' class='cmn-toggle cmn-toggle-round' type='checkbox'>
                            <label for='autoclick'></label>
                        </div>
                    </li>
                    <li>
                        <div class='hackitem'>Clicks per second</div>
                        <input type="number" id="cps" min="0" value="100" style="width: 50px; float: right;">
                    </li>
                    <li>
                        <div class='hackitem'>Auto Gold Cookie</div>
                        <div class='switch swcookie'>
                            <input id='autogoldcookie' class='cmn-toggle cmn-toggle-round' type='checkbox'>
                            <label for='autogoldcookie'></label>
                        </div>
                    </li>
                    <li>
                        <div class='hackitem'>Auto Cervo Natal</div>
                        <div class='switch swcookie'>
                            <input id='autocervonatal' class='cmn-toggle cmn-toggle-round' type='checkbox'>
                            <label for='autocervonatal'></label>
                        </div>
                    </li>
                    <li>
                        <div class='hackitem'>Auto upgrade</div>
                        <div class='switch swcookie'>
                            <input id='autoupgrade' class='cmn-toggle cmn-toggle-round' type='checkbox'>
                            <label for='autoupgrade'></label>
                        </div>
                        <select id="upgrade-selector">
                        ${getUpgrades().map((upgrade)=>`<option value=${upgrade.id}>${upgrade.name}</option>`)}
                            <option></option>
                        </select>
                    </li>
                    <div>
                </ul>
            <div id='hackcredits'>Made by Fozter | v0.6</div>
        </div>;
        `

        var headID = document.getElementsByTagName("head")[0];
        var cssNode = document.createElement("style");
        cssNode.type = "text/css";
        cssNode.rel = "stylesheet";
        cssNode.innerHTML = styles

        $("head").prepend(cssNode);

        $("body").prepend(box);

        $("body").on("click", "#hackboxClose", function () {
            $("#hackbox").hide();
        });



        var autoclick;
        var autogoldcookie;
        var autocervonatal;
        var autoupgrade;
        var cps;
        var upgrade;




        $('#cps').on("change input", function() {
            if ($(this).val() > 0) {
                cps = $(this).val();

                if (autoclick) {
                    clearInterval(autoclick);
                    autoclick = setInterval(function () {
                        $("#bigCookie").click();
                    }, cps);
                }
            }
        });

        $("body").on("click", "#autoupgrade", function () {
            $(this).toggleClass("btactv");

            if ($(this).hasClass("btactv")) {
                autoupgrade = setInterval(() => {
                    upgrade = $('#upgrade-selector').val();
                    $(upgrade).click();
                    //$(document.elementFromPoint(centerObj($("#bigCookie")).x, centerObj($("#bigCookie")).y )).click();
                }, 5000);
            } else {
                clearInterval(autoupgrade);
            }
        });

        $("body").on("click", "#autoclick", function () {
            $(this).toggleClass("btactv");

            if ($(this).hasClass("btactv")) {
                autoclick = setInterval(function () {
                    $("#bigCookie").click();
                    //$(document.elementFromPoint(centerObj($("#bigCookie")).x, centerObj($("#bigCookie")).y )).click();
                }, cps);
            } else {
                clearInterval(autoclick);
            }
        });

        $("body").on("click", "#autocervonatal", function () {
            $(this).toggleClass("btactv");

            if ($(this).hasClass("btactv")) {
                autocervonatal = setInterval(function () {
                    $("#seasonPopup").click();
                }, 5000);
            } else {
                clearInterval(autocervonatal);
            }
        });

        $("body").on("click", "#autogoldcookie", function () {
            $(this).toggleClass("btactv");
            if ($(this).hasClass("btactv")) {
                autogoldcookie = setInterval(function () {
                    //$("#goldenCookie").click();
                    $(".shimmer").click();
                    //$(document.elementFromPoint(centerObj($("#goldenCookie")).x, centerObj($("#bigCookie")).y )).click();
                }, 5000);
            } else {
                clearInterval(autogoldcookie);
            }
        });

        $("body").on("click", "#autoupgrade", function () {
            $(this).toggleClass("btactv");
            if ($(this).hasClass("btactv")) {
                autogoldcookie = setInterval(function () {
                    //$("#goldenCookie").click();
                    $(".shimmer").click();
                    //$(document.elementFromPoint(centerObj($("#goldenCookie")).x, centerObj($("#bigCookie")).y )).click();
                }, 5000);
            } else {
                clearInterval(autogoldcookie);
            }
        });
    }

    $( document ).ready(function() {
        cookieHack()
    });



})();