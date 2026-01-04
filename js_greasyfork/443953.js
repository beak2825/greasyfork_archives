// ==UserScript==
// @name         Code Injector - Starblast.io
// @version      1.0.8
// @description  Allows different userscripts to define functions that modify the game's code
// @author       Pixelmelt & Excigma & kklkkj
// @namespace    https://greasyfork.org/en/users/226344
// @license      GPL-3.0
// @match        https://starblast.io/
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443953/Code%20Injector%20-%20Starblastio.user.js
// @updateURL https://update.greasyfork.org/scripts/443953/Code%20Injector%20-%20Starblastio.meta.js
// ==/UserScript==
 
/* Create a logger */
const log = (msg) => console.log(`%c[Mod injector] ${msg}`, "color: #06c26d");

console.clear()

/* Stop non modified scripts from executing */
document.open();
/* little message telling the user to wait for mods to load */
document.write(`<html><head><title>Loading...</title></head><body style="background-color:#293449;"><div style="margin: auto; width: 50%;"><h1 style="text-align: center;padding: 170px 0;">Loading mods</h1><h1 style="text-align: center;">Please wait</h1></div></body></html>`);
document.close();
log(`Started`)
function injectLoader(){
    /* dont inject into anything but the main page */
    if (window.location.pathname != "/"){log(`Injection not needed`); return}
    /*
    Set to a specific vesion of sb because of rotating var names.
    If you want to use the most recent version of sb for your mod-
    BE WARNED your mod could break at any time due to rotating variable names

    Changing this URL could lead to your ECP being stolen, be careful!
    */
    var url = "https://starblast.io";
    
    /* Grab the contents of the link*/
    var xhr = new XMLHttpRequest();
    log("Fetching starblast src...");
    xhr.open("GET", url);
    
    /* When the request finishes... */
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var starSRC = xhr.responseText;
            if(starSRC != undefined){
                log(`Src fetched successfully`)
            }else{
                log(`Src fetch failed`)
                alert("An error occurred whilst fetching game code");
            }
    
            const start_time = performance.now();
            
            log("Patching src...");
            
            if (!window.sbCodeInjectors) {
                log("Did not find any Starblast.io userscripts to load. This may be an error, make sure you have scripts installed.");
                log(`Proceeded to load normally.`)
            } else {
                /* Loop through `sbCodeInjectors` and pass src code in for them to modify */
                let error_notified = false;
                for (const injector of window.sbCodeInjectors) {
                    try {
                        /* Run injector from other userscripts */
                        if (typeof injector === "function") starSRC = injector(starSRC);
                        else {
                            log("Injector was not a function");
                            console.log(injector);
                        }
                    } catch (error) {
                        /* Only notify the user once if any userscript fails to load
                        helpful to prevent spamming alerts() */
                        
                        if (!error_notified) {
                            /* An injector from one of the other userscripts failed to load */
                            alert("One of your Starblast.io userscripts was unable to be loaded");
                            error_notified = true;
                        }
    
                        console.error(error);
                    }
                }
            }
                
            const end_time = performance.now();
            log(`Patched src successfully (${(end_time - start_time).toFixed(0)}ms)`);
        
            /* Finish up and write the modified code to the docuent */
            document.open();
            document.write(starSRC);
            document.close();

            // run function once docuemnt is loaded
            document.addEventListener("DOMContentLoaded", function() {
                log("Document loaded");
                setTimeout(() => {
                    if (!window.sbCodeRunners) {
                        log("No CodeRunners found")
                    }else{
                        log("CodeRunners found")
                        for(const runner of window.sbCodeRunners){
                            try{
                                if(typeof runner === "function"){
                                    runner();
                                }else{
                                    log("CodeRunner was not a function");
                                    console.log(runner);
                                }
                            }catch(err){
                                console.error(err);
                            }
                        }
                    };
                }, 30);
            });
        

        }};
    /* Send the request */
    xhr.send();
}
/* ms before trying to inject mods */
setTimeout(injectLoader, 1);