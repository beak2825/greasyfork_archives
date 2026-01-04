// ==UserScript==
// @name         Torn Addiction Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Torn Addiction Warning
// @author       Chriserino[2685070]
// @license MIT
// @match        https://www.torn.com/index.php
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/439786/Torn%20Addiction%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/439786/Torn%20Addiction%20Script.meta.js
// ==/UserScript==
let key = GM_getValue("tornApiKey");
let userID = GM_getValue("tornUserID");
let company = [];
let addiction = "";

//Do after loading page
(function() {
    // Set GM Values if not set
    if(key == null || key == ""){
        let apiPrompt = prompt("First Time Setup. \nPlease enter your API Key (located on the preferences page under API Key.)");
        GM_setValue("tornApiKey", apiPrompt); //Saves API Key
    }


    if (userID == null || userID == ""){
        let script = document.getElementsByTagName('script');
        for (let i = 0; i < script.length; i++){
            if (script[i].hasAttributes()){
                let att = script[i].attributes;
                let output = "";
                for ( let j = 0; j < att.length; j++){
                    if (att[j].name == "uid") {
                        output = `${att[j].name} -> ${att[j].value}`;
                        GM_setValue("tornUserID", att[j].value);
                    }
                }
                console.log(output);
            }
        }
    }

    let tornAPI = "https://api.torn.com/company/?selections=employees&key=" + key;

    $.getJSON( tornAPI, function(json){
        try{
            company = json;
        } catch (err) {
            alert("There has been an error while fetching your data. Try resetting your API Key.");
            console.log("err | " + err);
        }
        let count = Object.keys(company.company_employees).length;
        addiction = company.company_employees[userID].effectiveness.addiction;
        if (addiction < 0){$( ".content-title" ).before(`<div style="color: red"><b>Warning! Addiction: ${addiction}</b></div>`);}
        //else {$( ".content-title" ).before(`<div style="color: green"><b>Addiction: ${addiction}</b></div>`);}
    });

    })();