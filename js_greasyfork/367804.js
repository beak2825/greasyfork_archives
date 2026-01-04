// ==UserScript==
// @name         Ruby buttons
// @namespace    http://tampermonkey.net/
// @version      0.4.5.1
// @description  try to take over the world!
// @author       You
// @match        http://matchlandserver.milamit.cz/matchland*/admin/matchlandios/messagetoplayer/*
// @match        http://bakeacakeserver.milamit.cz/bakeacake*/admin/bakeacakeios/messagetoplayer/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/367804/Ruby%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/367804/Ruby%20buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Adding buttons
    var coreDiv = document.createElement("div");
    coreDiv.id = "rubyButtsWrapper";
    coreDiv.className = "rubyButtsWrapClass";

    //button1
    var butt1 = document.createElement("div");
    butt1.innerHTML = "5 rubies";
    butt1.id = "rubButt1";
    butt1.className = "rubButt";

    coreDiv.appendChild(butt1);

    //button2
    var butt2 = document.createElement("div");
    butt2.innerHTML = "10 rubies";
    butt2.id = "rubButt2";
    butt2.className = "rubButt";

    coreDiv.appendChild(butt2);

    //button3
    var butt3 = document.createElement("div");
    butt3.innerHTML = "20 rubies";
    butt3.id = "rubButt3";
    butt3.className = "rubButt";

    coreDiv.appendChild(butt3);

    //button4
    var butt4 = document.createElement("div");
    butt4.innerHTML = "25 rubies";
    butt4.id = "rubButt4";
    butt4.className = "rubButt";

    coreDiv.appendChild(butt4);

    document.getElementById("id_param").after(coreDiv);

    if (window.location.href.includes("http://bakeacakeserver.milamit.cz/bakeacake/admin/bakeacakeios/messagetoplayer/")){
        if (!window.location.href.includes("changeMess") && document.getElementById("content").getElementsByTagName("h1")[0].innerHTML != "Change message to player"){
            document.getElementById("id_param").value = '{"gold": 0, "ruby": 25}';
        }

        (function($){
            $( "#rubButt1" ).click(function() {
                document.querySelectorAll("#id_param")[0].value = '{"gold": 0, "ruby": 5}';
            });
            $( "#rubButt2" ).click(function() {
                document.querySelectorAll("#id_param")[0].value = '{"gold": 0, "ruby": 10}';
            });
            $( "#rubButt3" ).click(function() {
                document.querySelectorAll("#id_param")[0].value = '{"gold": 0, "ruby": 20}';
            });
            $( "#rubButt4" ).click(function() {
                document.querySelectorAll("#id_param")[0].value = '{"gold": 0, "ruby": 25}';
            });
        })(django.jQuery);
    }
    else if (window.location.href.includes("http://matchlandserver.milamit.cz/matchland/admin/matchlandios/messagetoplayer/")){
        if (!window.location.href.includes("changeMess") && document.getElementById("content").getElementsByTagName("h1")[0].innerHTML != "Change message to player"){
            document.getElementById("id_param").value = '{"ruby": 25, "imgSource": "EverydayBonusBoxSmall.png"}';
        }

        //=========================================================================================================//
        function krakWin(){
            var krakWindow;
            var backdrop;

            if (document.querySelectorAll("div#krakWindow")[0] == undefined){
                krakWindow = document.createElement("div");
                krakWindow.id = "krakWindow";
            }
            else {
                krakWindow = document.querySelectorAll("div#krakWindow")[0];
            }
            if (document.querySelectorAll("div#krakBackdrop")[0] == undefined){
                backdrop = document.createElement("div");
                backdrop.className = "backdrop";
                backdrop.id = "krakBackdrop";
            }
            else {
                backdrop = document.querySelectorAll("div#krakBackdrop")[0];
            }

            document.querySelectorAll("textarea#id_body")[0].after(krakWindow);
            document.querySelectorAll("div#krakWindow")[0].after(backdrop);

            //Adding filling
            var krakEyeLine = document.createElement("div");
            krakEyeLine.id = "krakenEyes";
            krakEyeLine.className = "krakLines";
            krakEyeLine.innerHTML = "Kraken Eyes";

            var iconMinus = document.createElement("i");
            iconMinus.id = "iconMinusEye";
            iconMinus.className = "icono-minus krakIcono";

            var krakEyeInput = document.createElement("input");
            krakEyeInput.id = "EyeInput";
            krakEyeInput.className = "krakInput";
            krakEyeInput.value = 0;
            var iconPlus = document.createElement("i");
            iconPlus.id = "iconPlusEye";
            iconPlus.className = "icono-plus krakIcono";

            document.querySelectorAll("div#krakWindow")[0].appendChild(krakEyeLine);
            document.querySelectorAll("div#krakWindow")[0].appendChild(iconMinus);
            document.querySelectorAll("div#krakWindow")[0].appendChild(krakEyeInput);
            document.querySelectorAll("div#krakWindow")[0].appendChild(iconPlus);

            var krakGem1Line = document.createElement("div");
            krakGem1Line.id = "krakenGem1";
            krakGem1Line.className = "krakLines";
            krakGem1Line.innerHTML = "Kraken Gem 1";

            var iconMinusGem1 = document.createElement("i");
            iconMinusGem1.id = "iconMinusGem1";
            iconMinusGem1.className = "icono-minus krakIcono";

            var krakInputGem1 = document.createElement("input");
            krakInputGem1.id = "krakInputGem1";
            krakInputGem1.className = "krakInput";
            krakInputGem1.value = 0;

            var iconPlusGem1 = document.createElement("i");
            iconPlusGem1.id = "iconPlusGem1";
            iconPlusGem1.className = "icono-plus krakIcono";

            document.querySelectorAll("div#krakWindow")[0].appendChild(krakGem1Line);
            document.querySelectorAll("div#krakWindow")[0].appendChild(iconMinusGem1);
            document.querySelectorAll("div#krakWindow")[0].appendChild(krakInputGem1);
            document.querySelectorAll("div#krakWindow")[0].appendChild(iconPlusGem1);

            var krakGem2Line = document.createElement("div");
            krakGem2Line.id = "krakenGem2";
            krakGem2Line.className = "krakLines";
            krakGem2Line.innerHTML = "Kraken Gem 2";

            var iconMinusGem2 = document.createElement("i");
            iconMinusGem2.id = "iconMinusGem2";
            iconMinusGem2.className = "icono-minus krakIcono";

            var krakInputGem2 = document.createElement("input");
            krakInputGem2.id = "krakInputGem2";
            krakInputGem2.className = "krakInput";
            krakInputGem2.value = 0;

            var iconPlusGem2 = document.createElement("i");
            iconPlusGem2.id = "iconPlusGem2";
            iconPlusGem2.className = "icono-plus krakIcono";

            document.querySelectorAll("div#krakWindow")[0].appendChild(krakGem2Line);
            document.querySelectorAll("div#krakWindow")[0].appendChild(iconMinusGem2);
            document.querySelectorAll("div#krakWindow")[0].appendChild(krakInputGem2);
            document.querySelectorAll("div#krakWindow")[0].appendChild(iconPlusGem2);

            var krakGem3Line = document.createElement("div");
            krakGem3Line.id = "krakenGem3";
            krakGem3Line.className = "krakLines";
            krakGem3Line.innerHTML = "Kraken Gem 3";

            var iconMinusGem3 = document.createElement("i");
            iconMinusGem3.id = "iconMinusGem3";
            iconMinusGem3.className = "icono-minus krakIcono";

            var krakInputGem3 = document.createElement("input");
            krakInputGem3.id = "krakInputGem3";
            krakInputGem3.className = "krakInput";
            krakInputGem3.value = 0;

            var iconPlusGem3 = document.createElement("i");
            iconPlusGem3.id = "iconPlusGem3";
            iconPlusGem3.className = "icono-plus krakIcono";

            document.querySelectorAll("div#krakWindow")[0].appendChild(krakGem3Line);
            document.querySelectorAll("div#krakWindow")[0].appendChild(iconMinusGem3);
            document.querySelectorAll("div#krakWindow")[0].appendChild(krakInputGem3);
            document.querySelectorAll("div#krakWindow")[0].appendChild(iconPlusGem3);

            var addButton = document.createElement("div");
            addButton.id = "addButton";
            addButton.innerHTML = "Add";

            document.querySelectorAll("div#krakWindow")[0].appendChild(addButton);
        }

        //=========================================================================================================//

        //button5
        var butt5 = document.createElement("div");
        butt5.innerHTML = "Krak me up";
        butt5.id = "krakButt";
        butt5.className = "rubButt";

        document.getElementById("rubyButtsWrapper").after(butt5);

        krakWin(); //create KrakWindow

        (function($){
            $( "#rubButt1" ).click(function() {
                document.querySelectorAll("#id_param")[0].value = '{"ruby": 5, "imgSource": "EverydayBonusBoxSmall.png"}';
            });
            $( "#rubButt2" ).click(function() {
                document.querySelectorAll("#id_param")[0].value = '{"ruby": 10, "imgSource": "EverydayBonusBoxSmall.png"}';
            });
            $( "#rubButt3" ).click(function() {
                document.querySelectorAll("#id_param")[0].value = '{"ruby": 20, "imgSource": "EverydayBonusBoxSmall.png"}';
            });
            $( "#rubButt4" ).click(function() {
                document.querySelectorAll("#id_param")[0].value = '{"ruby": 25, "imgSource": "EverydayBonusBoxSmall.png"}';
            });

            $( "#krakButt" ).click(function() {
                document.querySelectorAll("div#krakWindow")[0].style.display = "block";
                document.querySelectorAll("div#krakBackdrop")[0].style.display = "block";
            });
            $( "#krakBackdrop" ).click(function() {
                document.querySelectorAll("div#krakWindow")[0].style.display = "none";
                document.querySelectorAll("div#krakBackdrop")[0].style.display = "none";
            });

            $( "#iconMinusEye" ).click(function() {
                if (parseInt(document.querySelectorAll("#EyeInput")[0].value) > 0){
                    document.querySelectorAll("#EyeInput")[0].value = parseInt(document.querySelectorAll("#EyeInput")[0].value) - 1;
                }
            });
            $( "#iconPlusEye" ).click(function() {
                document.querySelectorAll("#EyeInput")[0].value = parseInt(document.querySelectorAll("#EyeInput")[0].value) + 1;
            });

            $( "#iconMinusGem1" ).click(function() {
                if (parseInt(document.querySelectorAll("#krakInputGem1")[0].value) > 0){
                    document.querySelectorAll("#krakInputGem1")[0].value = parseInt(document.querySelectorAll("#krakInputGem1")[0].value) - 1;
                }
            });
            $( "#iconPlusGem1" ).click(function() {
                document.querySelectorAll("#krakInputGem1")[0].value = parseInt(document.querySelectorAll("#krakInputGem1")[0].value) + 1;
            });

            $( "#iconMinusGem2" ).click(function() {
                if (parseInt(document.querySelectorAll("#krakInputGem2")[0].value) > 0){
                    document.querySelectorAll("#krakInputGem2")[0].value = parseInt(document.querySelectorAll("#krakInputGem2")[0].value) - 1;
                }
            });
            $( "#iconPlusGem2" ).click(function() {
                document.querySelectorAll("#krakInputGem2")[0].value = parseInt(document.querySelectorAll("#krakInputGem2")[0].value) + 1;
            });

            $( "#iconMinusGem3" ).click(function() {
                if (parseInt(document.querySelectorAll("#krakInputGem3")[0].value) > 0){
                    document.querySelectorAll("#krakInputGem3")[0].value = parseInt(document.querySelectorAll("#krakInputGem3")[0].value) - 1;
                }
            });
            $( "#iconPlusGem3" ).click(function() {
                document.querySelectorAll("#krakInputGem3")[0].value = parseInt(document.querySelectorAll("#krakInputGem3")[0].value) + 1;
            });

            $( "#addButton" ).click(function() {
                console.log(false);
                var str = '{"ruby": 20, "items":[';
                var isEmpty = true;
                if (parseInt(document.querySelectorAll("#EyeInput")[0].value) > 0 || parseInt(document.querySelectorAll("#krakInputGem1")[0].value) > 0 ||
                    parseInt(document.querySelectorAll("#krakInputGem2")[0].value) > 0 || parseInt(document.querySelectorAll("#krakInputGem3")[0].value) > 0){
                    if (parseInt(document.querySelectorAll("#EyeInput")[0].value) > 0){ // Если хотя бы что-то не 0
                        str += '["krakenItem2", "Keys", ' + document.querySelectorAll("#EyeInput")[0].value + ']';
                        isEmpty = false; // ставим флаг для запятой между массивами
                    }
                    if (parseInt(document.querySelectorAll("#krakInputGem1")[0].value) > 0){
                        if (!isEmpty){
                            str += ', ';
                        }
                        str += '["krakenItem3", "Keys", ' + document.querySelectorAll("#krakInputGem1")[0].value + ']';
                        isEmpty = false;
                    }
                    if (parseInt(document.querySelectorAll("#krakInputGem2")[0].value) > 0){
                        if (!isEmpty){
                            str += ', ';
                        }
                        str += '["krakenItem4", "Keys", ' + document.querySelectorAll("#krakInputGem2")[0].value + ']';
                        isEmpty = false;
                    }

                    if (parseInt(document.querySelectorAll("#krakInputGem3")[0].value) > 0){
                        if (!isEmpty){
                            str += ', ';
                        }
                        str += '["krakenItem5", "Keys", ' + document.querySelectorAll("#krakInputGem3")[0].value + ']';
                        isEmpty = false;
                    }

                    str += '], "imgSource": "EverydayBonusBoxSmall.png"}';
                    document.querySelectorAll("#id_param")[0].value = str;
                }

                document.querySelectorAll("div#krakWindow")[0].style.display = "none";
                document.querySelectorAll("div#krakBackdrop")[0].style.display = "none";

            });
        })(django.jQuery);

    }

})();

