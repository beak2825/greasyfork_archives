// ==UserScript==
// @name         translate player message
// @namespace    http://tampermonkey.net/
// @version      0.5.3
// @description  try to take over the world!
// @author       You
// @match        http://matchlandserver.milamit.cz/matchland*/admin/matchlandios/helpdeskmessage/*/?_changelist_filters=q*
// @match        http://bakeacakeserver.milamit.cz/bakeacake*/admin/bakeacakeios/helpdeskmessage/*/?_changelist_filters=q*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/367807/translate%20player%20message.user.js
// @updateURL https://update.greasyfork.org/scripts/367807/translate%20player%20message.meta.js
// ==/UserScript==

(function() {
    'use strict';
    (function($) {
        var lang,
            abbrFlag = false;

        function translate(text){
            var apiLink = 'https://translate.yandex.net/api/v1.5/tr.json/translate?',
                apiKey = 'key=trnsl.1.1.20180327T152227Z.1ee479033a7cd31b.a1b02d0a270a0176d9f0d51b3500135e5f382b18',
                sourceText = '',
                transLang = '&lang=en',
                format = '&format=plain';
            //& [options=<translation options>]
            //& [callback=<name of the callback function>]

            sourceText = text.replace(/\s/g, "+");
            var endPoint = apiLink + apiKey + '&text=' + sourceText + transLang + format;

//             console.log(endPoint);
            return endPoint;

        }
        //==============================================================
        //Escaping characters for URL
        //==============================================================
        function escapeChar(text){
            const regex = /#/gm
            console.log(text.replace(regex, "%23"))
            return text.replace(regex, "%23")
        }
        //==============================================================
        //Normalizing string case
        //==============================================================
        function fixCase(string){
            var lowerString = string.toLowerCase(); //сначала всё в нижний кейс
            const regex = /^.|\.\s?./g;
            let m;

            String.prototype.replaceAt=function(index, replacement) { //функция для замены символов в строке по индексу
                return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
            }

            while ((m = regex.exec(lowerString)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }

                m.forEach(function callback(currentValue, index, array){
                    lowerString = lowerString.replaceAt(m.index, currentValue.toUpperCase())
                });
            }

            return lowerString;
        }

        //==============================================================
        //Replacing native abbreviations
        //==============================================================
        function replaceAbbr(language, message){
            // dictionaries --------------------------------------------------------
            var abbrsDe = ["Liebe Grüße", "Mit freundlichen Grüßen", "Viele Grüße"],
                regexDe = [/lg/igm, /mfg/igm, /vg/igm],

                abbrsIt = ["$1per", "perchè"],
                regexIt = [/(\W|^)(x)/igm, /xkè/igm],

                abbrsEs = ["por qué", "por qué", "por qué", "$1por", "$1que", "$1que", "por fa(vor)",
                           "que tal", "que tal", "que te pasa", "que te pasa", "igual", "más", "menos", "$1es", "$1el", "$1de"],
                regexEs = [/xq/igm, /xk/igm, /pq/igm, /(\W|^)(x)/igm, /(\W|^)(q)/igm, /(\W|^)(k)/igm, /xf/igm, /qtl/igm, /ktl/igm,
                           /qtpsa/igm, /ktpsa/igm, /\=/igm, /\+/igm, /\-/igm, /(\W|^)(s)/igm, /(\W|^)(l)/igm, /(\W|^)(d)/igm];
            // ---------------------------------------------------------------------

            if (language == "de-en") {
                abbrFlag = true;
                abbrsDe.forEach(
                    function callback(curVal, index, array){
                        message = message.replace(regexDe[index], curVal);
                    }
                );
            }
            else if (language == "it-en") {
                abbrFlag = true;
                abbrsIt.forEach(
                    function callback(curVal, index, array){
                        message = message.replace(regexIt[index], curVal);
                    }
                );
            }
            else if (language == "es-en") {
                abbrFlag = true;
                abbrsEs.forEach(
                    function callback(curVal, index, array){
                        message = message.replace(regexEs[index], curVal);
                    }
                );
            }
            return message;
        }
        //==============================================================

        function newLink(interLang){
            if ($("#add_id_reply") != undefined){
                var newHref1 = $("#add_id_reply").attr("href") + "&messagelang=" + interLang;
                $("#add_id_reply").attr("href", newHref1);
            }
            if ($("#change_id_reply") != undefined){
                var newHref2 = $("#change_id_reply").attr("href") + "&messagelang=" + interLang;
                $("#change_id_reply").attr("href", newHref2);
            }
        }

        //==============================================================
        //MAIN
        //==============================================================
        var translatedPlayerMessage,
            abbrPlayerMessage,
            origFullMessage = $("#id_body").val(),
            playerMessage = $("#id_body").val().match(/[^\n]*(?=\n\n Monetized)/)[0],
            flag = false; // does player's message has been already translated, saved and language is determened
        if ($("#id_body").val().match(/\[\S*-\S*\]/) == null){ //if the player message hasn't been translated and saved (opening already replied message)
            flag = true;

            $('<textarea/>', { //creating hidden textarea for load()
                value: 'text',
                id: 'hiddenTxtArea',
                style: 'display: none;'
            }).appendTo("body");

            $('#hiddenTxtArea').load(translate(escapeChar(fixCase(playerMessage)))); // <----- добавить функцию экранирования сюда
        }
        else{
            lang = /\[(\S*-\S*)\]/.exec($("#id_body").val())[1];
        }

        $( document ).ajaxComplete(function(){
            if (!abbrFlag) {
                translatedPlayerMessage = $("#hiddenTxtArea").html().match(/(?:\\.|[^"\\])*(?="])/)[0];
                lang = $("#hiddenTxtArea").val().match(/[a-z\-]*(?=","text)/)[0];

                if (lang == "en-en") {
                    $("#id_body").val(origFullMessage);
                }
                else if (lang == "ru-en") {
                    $("#id_body").val(origFullMessage);
                }
                else {
                    var replacedMessage = replaceAbbr(lang,fixCase(playerMessage)); // trying to replace abbreviations
                    if (abbrFlag) { //if something is replaced - translate updated message again
                        $("#hiddenTxtArea").val(origFullMessage.replace(playerMessage, replacedMessage));
                        abbrPlayerMessage = $("#hiddenTxtArea").val().match(/[^\n]*(?=\n\n Monetized)/)[0];
                        $('#hiddenTxtArea').load(translate(abbrPlayerMessage));
                    }
                    else {
                        var newFullMessage = origFullMessage.replace(playerMessage, playerMessage + '\n\n' + '[' + lang + ']' + '\n' + translatedPlayerMessage);
                        $("#id_body").val(newFullMessage);
                    }
                }
            }
            else {
                translatedPlayerMessage = $("#hiddenTxtArea").html().match(/(?:\\.|[^"\\])*(?="])/)[0];
                var newFullMessage1 = origFullMessage.replace(playerMessage, abbrPlayerMessage + '\n\n' + '[' + lang + ']' + '\n' + translatedPlayerMessage);
                $("#id_body").val(newFullMessage1);
            }
        });

        if (flag){
            $( document ).ajaxComplete(function(){
                newLink(lang);
            });
        }
        else {
            newLink(lang);
        }

    })(django.jQuery);

})();