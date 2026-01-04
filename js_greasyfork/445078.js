// ==UserScript==
// @name         AddAmpliseqSuplimetaryZIP
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Adds download links for suplimentary files for Ampliseq Results
// @author       Alexander.Varchenko@gmail.com
// @match        *.cosmosid.com/samples/*
// @icon         <$ICON$>
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445078/AddAmpliseqSuplimetaryZIP.user.js
// @updateURL https://update.greasyfork.org/scripts/445078/AddAmpliseqSuplimetaryZIP.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let artifacts = ["ampliseq-supplementary-relaxed","ampliseq-supplementary-stringent"]
    let fileExt='suplimentary.zip'

    function waitForId(selector) {
        return new Promise(resolve => {
            if (document.getElementById(selector)) {
                return resolve(document.getElementById(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.getElementById(selector)) {
                    resolve(document.getElementById(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    waitForId('analysis-select').then(analysis=>{
        if(analysis.innerText.includes('Ampliseq')){
            let token = localStorage.getItem('token');
            console.log("Token found"+token)
            //let export_btn = document.getElementById('export-menu-button');
            waitForId('export-menu-button').then(export_btn=>{
                let run_id = window.location.pathname.split('/').pop().slice(-36);
                let artifact_id = window.location.pathname.split('/').pop().slice(0,-36);
                artifacts.forEach(artifact=>{
                    let url=`/api/metagenid/v1/runs/${run_id}/artifacts/${artifact}`;
                    fetch(url, {
                        "headers": {
                            "x-token": token,
                            "pragma": 'no-cache',
                            "cache-control": 'no-cache'
                        }
                    }).then( res => {
                        if (res.ok){
                            return res.json()
                        }
                        throw 'Failed to obtain artifact from '+res.url
                    }).then( response => {
                        if(response.status=="Success"){
                            var file = response.data;
                            var a = document.createElement("a");
                            a.href = file;
                            a.text=artifact
                            a.setAttribute("download", artifact_id+fileExt);//artifact+filename?
                            export_btn.parentNode.insertBefore(a, export_btn.nextSibling)
                        }
                    });
                });
            });
        };
    });
})();