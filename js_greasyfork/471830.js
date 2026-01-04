// ==UserScript==
// @name         Simple PloudOS DynamicIP Copy
// @namespace    https://github.com/HageFX-78
// @version      0.3.2
// @description  Adds a simple button to copy Dynamic IP address from PloudOS manage page
// @author       HageFX78
// @license      MIT
// @match        https://ploudos.com/manage/*/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/471830/Simple%20PloudOS%20DynamicIP%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/471830/Simple%20PloudOS%20DynamicIP%20Copy.meta.js
// ==/UserScript==

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// Simple Script that adds a button to ploudos.com on your server's manage page to copy dyamic IP address
//
// This was created out of frustration of the site's dynamic IP text background being blue, making it hard
// to see when highlighted, sometimes Ctrl-C straight up doesn't work on that text.
//
// Button will only show up when the server is started, button will remain there if the server is stopped
// it would only lose its functionality until the server is restarted again.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

GM_addStyle ( `

#dyncp {
    padding: 10px 14px 10px 14px;
    border-style: none;
    border-radius: 2px;
    font-size: 14px;
    font-weight: bold;
    position: absolute;
    left: 70%;
    top: 10.4em;
}

.not_copied:hover{
    background-color: green;
}
.not_copied {
    color: white;
    background-color: #32CD32;
}
.copied {
    color: white;
    background-color: #265730;
}

` );

window.addEventListener('load', function() {
    'use strict';

    function copy(str) {
        let temp = document.createElement('textarea');
        document.body.appendChild(temp);
        temp.value = str;
        temp.select();
        document.execCommand('copy');
        temp.remove();
    }

    function addCopyBtn(ele)//Adds button after h2 element of "Status" instead of table ( with id='status') as  the table would be refreshed every second by PloudOS itself
    {

        let btn = document.createElement("button");
        btn.id = "dyncp";
        btn.className = "not_copied";
        btn.innerHTML = "Copy Dyn. IP";
        btn.onclick = () =>{
            btn.innerHTML = "Copied"
            btn.className = "copied"
            setTimeout(resetButton, 1000, btn);
            let dynmTag = document.getElementsByTagName("tr");
            const str = dynmTag[2].textContent.replace("Dyn. IP", '').trim();
            copy(str);
        }

        ele.appendChild(btn);
    }
    function serverIsStarted()
    {
        if(document.getElementsByTagName("h2")[0].textContent != "Status") return; //Check if page is main page

        let dynmTag = document.getElementsByTagName("tr"); //Table rows are used to determine if the server is started

        if(typeof(dynmTag) != 'undefined' && dynmTag != null && dynmTag.length == 5) // If table rows is 5, it means server is started
        {
            obs.disconnect();
            let tagTopPlaceBtn = document.getElementsByTagName("h2")[0];
            addCopyBtn(tagTopPlaceBtn);
        }
        else
        {
            obs.observe(document.getElementById('status'),{childList: true}); //To start observing if server is started if not
        }
    }
    function resetButton(btn)
    {
        btn.className = "not_copied";
        btn.innerHTML = "Copy Dyn. IP";
    }

    var obs = new MutationObserver(function (e) {
        if (e[0].removedNodes){
            console.log("Rechecking server start status."); //When table is refreshed, checks if server is started again
            serverIsStarted();
        };
    });

    serverIsStarted();//init
});
