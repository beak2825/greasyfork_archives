// ==UserScript==
// @name         translate message to player
// @namespace    http://tampermonkey.net/
// @version      0.2.7.4
// @description  try to take over the world!
// @author       You
// @match        http://matchlandserver.milamit.cz/matchland*/admin/matchlandios/messagetoplayer/add/?_to_field=id&_popup=1*
// @match        http://matchlandserver.milamit.cz/matchland*/admin/matchlandios/messagetoplayer/*&changeMess*
// @match        http://bakeacakeserver.milamit.cz/bakeacake*/admin/bakeacakeios/messagetoplayer/add/?_to_field=id&_popup=1*
// @match        http://bakeacakeserver.milamit.cz/bakeacake*/admin/bakeacakeios/messagetoplayer/*&changeMess*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/367806/translate%20message%20to%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/367806/translate%20message%20to%20player.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function translate(text){
        var apiLink = 'https://translate.yandex.net/api/v1.5/tr.json/translate?';
        var apiKey = 'key=trnsl.1.1.20180327T152227Z.1ee479033a7cd31b.a1b02d0a270a0176d9f0d51b3500135e5f382b18';
        var sourceText = '';
        var sourceLang = '&lang=en-';
        var transLang = /messagelang=(\w+)/.exec(document.location.href)[1];
        var format = '&format=plain';
        //& [options=<translation options>]
        //& [callback=<name of the callback function>]

        sourceText = text.replace(/\s/g, "+");
        sourceText = sourceText.replace(/\&/g, "%26");
        var endPoint = "";
        endPoint = apiLink + apiKey + '&text=' + sourceText + sourceLang + transLang + format;

        console.log(endPoint);
        return endPoint;
    }


    //translateButton
    var supWrapper = document.createElement("div");
    supWrapper.id = "supWrapper";
    supWrapper.className = "supWrap";
    var transButton = document.createElement("div");
    transButton.innerHTML = "Translate me!";
    transButton.id = "transButton";
    transButton.className = "rubButt specialButt";
    document.getElementsByClassName('form-row field-param')[0].before(supWrapper);
    document.getElementById("supWrapper").appendChild(transButton);

    var dFlag; // if the language en or ru - disable the button and don't react on the clicks
    if ((document.location.href.match(/en-en/) != null) && (document.location.href.match(/en-en/)[0] == "en-en")){
        dFlag = true;
        transButton.className += " rubButtDisabled";
    }
    else if ((document.location.href.match(/ru-en/) != null) && (document.location.href.match(/ru-en/)[0] == "ru-en")){
        dFlag = true;
        transButton.className += " rubButtDisabled";
    }

    //fix border style
    document.getElementsByClassName("form-row field-body")[0].style.borderBottom = "none";

    (function($) { //Django wrapper

        $( "#transButton" ).click(function() { //translateButton click handler
            if (!dFlag){
                var i = 0;
                var j = 0;
                var tmpStr;
                var callbackCounter = 0;
                var messTextArray = document.getElementById("id_body").value.split("\n");

                //PARSING MESSAGE//

                //adding lines position markers
                while (i < messTextArray.length){

                    tmpStr = " /" + i;
                    messTextArray[i] = messTextArray[i].replace(/$/gm, tmpStr);
                    //
                    i++;
                }

                i = 0; //reseting i after prev. while cycle

                while (i < messTextArray.length){
                    if(i == messTextArray.length - 1){ //last index check (no need to add \n at the end of the line)
                        //uploading lines for translating
                        $('#id_body').load(translate(messTextArray[i]),
                                           function(){ //summoning callback function
                            //parsing the answer
                            j= / ?\/(\d{1,2})(?="]})/.exec($('#id_body').html())[1]; //matching the marker (in raw loaded json response from translate.yandex)
                            messTextArray[j] = /"text":\["(.*)(?= ?\/\d{1,2})/.exec($('#id_body').html())[1]; //matching the message itself (same as above ^)
                            callbackCounter += 1;
                            //                         console.log(callbackCounter);
                            //
                            //check if we need to put the lines back already
                            if (callbackCounter == messTextArray.length){ //callback counter comparison
                                i = 0;
                                document.getElementById("id_body").value = "";
                                while(i < messTextArray.length){
                                    document.getElementById("id_body").value += messTextArray[i];
                                    i++;
                                }
                            }
                            //
                        });
                    }
                    else{ // adding \n at the end of the line
                        if (messTextArray[i] != ""){
                            //here's all the same as above (almost)
                            $('#id_body').load(translate(messTextArray[i]),
                                               function(){
                                j= / ?\/(\d{1,2})(?="]})/.exec($('#id_body').html())[1];
                                messTextArray[j] = /"text":\["(.*)(?= ?\/\d{1,2})/.exec($('#id_body').html())[1] + '\n';
                                messTextArray[j] = messTextArray[j].replace(/\\"/g, '"');
                                callbackCounter += 1;
                                //                             console.log(callbackCounter);

                                if (callbackCounter == messTextArray.length){
                                    i = 0;
                                    document.getElementById("id_body").value = "";
                                    while(i < messTextArray.length){
                                        document.getElementById("id_body").value += messTextArray[i];
                                        console.log(messTextArray[i]);
                                        i++;
                                    }
                                }

                            });
                        }
                        else { //empty lines check
                            messTextArray[i] = "\n"; //adding new line symbols for empty lines
                            callbackCounter += 1; //fake callback counter (just for simplicity)
                        }
                    }

                    i++;

                } //while
            }
        });//translateButton click handler
    })(django.jQuery);
})();