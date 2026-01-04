// ==UserScript==
// @name         Automatic Replay Code
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  shows replay code on reset in practice mode
// @author       oki, meppydc
// @match        https://*jstris.jezevec10.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427874/Automatic%20Replay%20Code.user.js
// @updateURL https://update.greasyfork.org/scripts/427874/Automatic%20Replay%20Code.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //if (Game['prototype']['pmode'] == 2) {
        if (typeof trim != "function") { var trim = a => { a = a.slice(0, -1); a = a.substr(a.indexOf("{") + 1); return a } }
        if (typeof getParams != "function") { var getParams = a => { var params = a.slice(a.indexOf("(") + 1); params = params.substr(0, params.indexOf(")")).split(","); return params } }

        window.copyReplayText = function (number) {
            var copyText = document.getElementById("replay" + number);
            copyText.select();
            document.execCommand("copy");
            document.getElementById("replayButton" + number).innerHTML = "Copied!"
            setTimeout(() => {
                document.getElementById("replayButton" + number).innerHTML = "Copy"
            }, 1000);

        }

        // var replayCounter = Game['prototype'].toString()
        //             replayCounter = "this['replayCounter']=1;" + trim(replayCounter)
        //             Game['prototype'] = new Function(replayCounter);


        function beforeFunction() {
            //how many pieces should the replay at least have
            let piecesPlacedCutoff = 1

            if (typeof this['replayCounter'] == "undefined") {
                this['replayCounter'] = 1
            }

            this['Replay']['getData']();
            //console.log(this["Replay"].string)
            //console.log(this.GameStats.stats)

            if (!this['starting'] && this.GameStats.stats.BLOCKS.value > piecesPlacedCutoff && this['pmode'] == 2) {
                //console.log(this["replayCounter"])

                let replayHTML = "<div style='font-size:14px;'>Userscript Generated Replay <b>#" + this["replayCounter"] + "</b> </div>";
                replayHTML += '<div style="font-size:16px;">Time:  <b>' + this.GameStats.stats.CLOCK.value + '</b> Blocks:  <b>' + this.GameStats.stats.BLOCKS.value + '</b> Waste:  <b>' + this.GameStats.stats.WASTE.value + '</b> </div>'
                replayHTML += '<textarea id=replay' + this["replayCounter"] + ' readonly style="width:75%;" onclick="this.focus();this.select()">' + this['Replay']['string'] + '</textarea>';
                replayHTML += '<button id=replayButton' + this["replayCounter"] + ' onclick=window.copyReplayText(' + this["replayCounter"] + ')>Copy</button>'
                this["Live"]['chatMajorWarning'](replayHTML);
                this["replayCounter"]++;

                //this['Replay']['uploadError'](this["Live"], 'FROM_USERSCRIPT_UWU');

                // document.querySelector("#chatInput").value = "/replay"
                // document.querySelector("#sendMsg").click()
                // document.querySelector("#stage").click()
            }
        };

        //add function to readyGo
        var readyGoFunc = Game['prototype']['startPractice'].toString()
        var params3 = getParams(readyGoFunc)
        readyGoFunc = trim(beforeFunction.toString()) + trim(readyGoFunc)
        Game['prototype']['startPractice'] = new Function(...params3, readyGoFunc);

    //}

    // window.addEventListener('load', function () {
    //    var resetKey = Game['Settings']['controls'][8]
    // console.log("resetKey")
    // //console.log(resetKey)
    // window.addEventListener('keydown', (e) => {
    //     if(e.keyCode === 49) {
    //         document.querySelector("#chatInput").value = "/replay"
    // document.querySelector("#sendMsg").click()
    // document.querySelector("#stage").click()
    //     }
    // });
    // });


})();