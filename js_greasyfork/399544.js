// ==UserScript==
// @name         DSRPG UI updates
// @namespace    DSRPG UI updates
// @version      1.0
// @description  Real time UI updates
// @author       Elewar
// @match        *://dsrpg.co/*
// @match        *://www.dsrpg.co/*
// @run-at 	     document-end
// @downloadURL https://update.greasyfork.org/scripts/399544/DSRPG%20UI%20updates.user.js
// @updateURL https://update.greasyfork.org/scripts/399544/DSRPG%20UI%20updates.meta.js
// ==/UserScript==

/**************   Tested on Chrome verison: 80.0.3987.149 (Official version) (x64)   **************/

(function ()
{
    'use strict';

    if(document.location.href === "https://dsrpg.co/m.php?action=viewc")
    {
        document.getElementById("chat-frame").addEventListener("load", function ()
        {
            let w = this.contentWindow;

            let proxy = w.XMLHttpRequest.prototype.open;
            w.XMLHttpRequest.prototype.open = function ()
            {
                this.addEventListener('load', function ()
                {
                    getPage("/main.php?action=view");
                });
                return proxy.apply(this, arguments);
            }
        });
    }
    function fetchData(data, type, url) {
        if ( !!data && data !== "stop") {
            try
            {
                    let main = top.document.getElementById("main"),
                        w = main.contentWindow;

                    if(!w.getPage) w.getPage = getPage;

                    let dataPanels = data.querySelectorAll(".col-sm-12.addBorder"),
                        mainPanels = main.contentDocument.querySelectorAll(".col-sm-12.addBorder");

                    for (let i = 0; i< dataPanels.length; i++) {

                        mainPanels[i].innerHTML = dataPanels[i].innerHTML;

                        if( dataPanels[i].querySelectorAll("a[href*='/potions.php?action']") )
                        {
                            let links = mainPanels[i].querySelectorAll("a[href*='/potions.php?action']");

                            for(let j = 0; j < links.length; j++) {
                                links[j].href = `javascript:getPage("${links[j].href}")`;
                            }
                        }
                    };
            }
            catch(e) {  }
        }
    }

    function getPage(url) {
        url = url || "/main.php?action=view";
        let xhr = new XMLHttpRequest();
        if ( url === "/main.php?action=view" ) xhr.responseType = "document";
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200 )
            {
                if ( url.match(/(finish-crafting.*craft\=Y)/g) || url.match(/(refresh-autos)/g) ) {
                    getPage("/main.php?action=view");
                }
                else
                {
                    fetchData(this.response, this.responseType, this.responseURL);
                }
            }
        }
        xhr.open("GET", url, true);
        xhr.send();
    }
})();