// ==UserScript==
// @name         Google Meet Extender
// @version      1
// @description  Export attendance and chat log from a Google Meet call
// @author       Campanini Federico
// @require      https://cdn.jsdelivr.net/gh/soufianesakhi/node-creation-observer-js@edabdee1caaee6af701333a527a0afd95240aa3b/release/node-creation-observer-latest.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.26.0/moment.min.js
// @match        https://meet.google.com/*
// @namespace https://greasyfork.org/users/573445
// @downloadURL https://update.greasyfork.org/scripts/404217/Google%20Meet%20Extender.user.js
// @updateURL https://update.greasyfork.org/scripts/404217/Google%20Meet%20Extender.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const buttonTemplate = '<div class="cU0hbd"><div  role="button" class="uArJ5e UQuaGc kCyAyd kW31ib Bs3rEf M0yUEe" aria-disabled="false" tabindex="1"><div class="Fvio9d MbhUzd" jsname="ksKsZd"></div><div class="e19J0b CeoRYc"></div><span jsslot="" class="l4V7wb Fxmcue"><span class="NPEfkd RveJvd snByac"><i class="google-material-icons EVe89b D0baBe" aria-hidden="true">help</i><span class="GsqdZ K74C9e">!!BUTTONTEXT!!</span></span></span></div></div>';

    const types = {
        CHAT: 'chat',
        ATTENDANCE: 'attendance'
    }

    const translations = {
        en : {
            attendanceFileName: "attendance",
            chatFileName: "chat",
            exporting : "Exporting...",
            exportingLogError: "error in exportToFile",
            exportingError: "Error during export",
            exportTypeError: "exportType error",
            postExportError: "error in postExportToFile",
            resetError: "Error during reset",
            exportComplete: "Export complete",
            exported: "exported",
            exportChatLog: "Export chat log",
            exportAttendance: "Export attendance"
        },
        it : {
            attendanceFileName: "presenze",
            chatFileName: "chat",
            exporting : "Sto Esportando...",
            exportingLogError: "Errore in exportToFile",
            exportingError: "Errore in fase di esportazione",
            exportTypeError: "errore exportType",
            postExportError: "errore in postExportToFile",
            resetError: "Errore in fase di reset",
            exportComplete: "Esportazione completata",
            exported: "esportato",
            exportChatLog: "Esporta chat log",
            exportAttendance: "Esporta registro presenze"
        }
    };

    //check if there is an appropriate translation for the browser, defaults to english
    var browserLanguage = (navigator.language || navigator.userLanguage).substring(0, 2).toLowerCase();
    const lang = translations.hasOwnProperty(browserLanguage)? browserLanguage : "en";


    //create buttons when sidebar opens
    NodeCreationObserver.onCreation('.fe4pJf.Pdo15c', function (element) {
        //create buttons and find the text node
        var attendanceButton = htmlToElement(buttonTemplate);
        var chatButton = htmlToElement(buttonTemplate);

        var attendanceButtonText = attendanceButton.childNodes[0].childNodes[2].childNodes[0].childNodes[1];
        var chatButtonText = chatButton.childNodes[0].childNodes[2].childNodes[0].childNodes[1];

        //assign the correct text and icon
        resetButtonText(attendanceButtonText, types.ATTENDANCE);
        resetButtonText(chatButtonText, types.CHAT);

        //assign correct logic to button click
        attendanceButton.addEventListener("click", function(){ exportToFile("TnISae CnDs7d hPqowe crOkHf", attendanceButtonText, translations[lang].attendanceFileName, types.ATTENDANCE); });
        chatButton.addEventListener("click", function(){ exportToFile("z38b6 CnDs7d hPqowe", chatButtonText, translations[lang].chatFileName, types.CHAT); });

        //insert them at the top
        element.parentNode.insertBefore(attendanceButton, element);
        element.parentNode.insertBefore(chatButton, element);
    });


    function exportToFile(containerClassName, buttonText, fileName, exportType){
        try {
            buttonText.innerHTML = translations[lang].exporting;
            buttonText.parentNode.childNodes[0].innerHTML = "hourglass_empty";
            var container = document.getElementsByClassName(containerClassName)[0];
            container.style.transform = "scale(.1)";

            //give it enough time to load everything after shrinking
            setTimeout(function() {
                postExportToFile(container, buttonText, fileName, exportType);
            }, 2000);
        }
        catch (err) {
            console.log(translations[lang].exportingLogError + " (" + exportType + ")");
            buttonText.innerHTML = translations[lang].exportingError;
            setTimeout(function() {
                resetButtonText(buttonText, exportType);
            }, 3000);
            console.log(err);
        }
    }

    function postExportToFile(container, buttonText, fileName, exportType){
        try {
            var now = new Date();

            var fileText = "";

            switch(exportType){
                case types.CHAT:
                    fileText = chatExportLogic(container);
                    break;
                case types.ATTENDANCE:
                    fileText = attendanceExportLogic();
                    break;
                default:
                    throw translations[lang].exportTypeError;
            }


            const blob = new Blob([fileText], { type: 'text/plain' });
            const a = document.createElement('a');
            a.setAttribute('download', fileName + " " + moment().format("DD-MM-yyyy") + ".txt");
            a.setAttribute('href', window.URL.createObjectURL(blob));
            a.click();

            container.style.transform = "scale(1)";
        }
        catch (err) {
            console.log(translations[lang].postExportError + " (" + exportType + ")");
            buttonText.innerHTML = translations[lang].resetError;
            console.log(err);
        }

        buttonText.innerHTML = translations[lang].exportComplete;
        setTimeout(function() {
            resetButtonText(buttonText, exportType);
        }, 3000);
        console.log(exportType + " " + translations[lang].exported);
    }

    function chatExportLogic(container){
        var fileText = "";

        container.childNodes.forEach(function (element){
          var consecutiveMessages = element.childNodes[1].childNodes.forEach(function (msg){
                fileText += element.getAttribute("data-sender-name") + " (" + element.getAttribute("data-formatted-timestamp") + "):  \t" + msg.getAttribute("data-message-text") + "\n";
            });
            fileText += "\n";
        });

        return fileText;
    }

    function attendanceExportLogic(){
        var fileText = "";

        document.querySelectorAll(".G3llDe.Dxboad > .cS7aqe.NkoVdd").forEach(function (element){
          fileText += element.innerHTML + "\n";
        });

        return fileText;
    }

    //assign the correct text and icon
    function resetButtonText(buttonText, exportType){
        switch(exportType){
            case types.CHAT:
                buttonText.innerHTML = translations[lang].exportChatLog;
                buttonText.parentNode.childNodes[0].innerHTML = "message";
                break;
            case types.ATTENDANCE:
                buttonText.innerHTML = translations[lang].exportAttendance;
                buttonText.parentNode.childNodes[0].innerHTML = "assignment_ind";
                break;
            default:
                throw translations[lang].exportTypeError;
        }
    }

    //used to create button element from a string
    function htmlToElement(html) {
        var template = document.createElement('template');
        html = html.trim();
        template.innerHTML = html;
        return template.content.firstChild;
    }

})();
