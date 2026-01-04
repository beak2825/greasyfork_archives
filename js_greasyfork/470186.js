// ==UserScript==
// @name         FILL THE WALL
// @namespace    fill.the.wall
// @version      1.0.4a
// @description  Fill any slot on the wall
// @author       Heasleys4hemp
// @match        https://www.torn.com/factions.php?step=your*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/470186/FILL%20THE%20WALL.user.js
// @updateURL https://update.greasyfork.org/scripts/470186/FILL%20THE%20WALL.meta.js
// ==/UserScript==

// Function for intercepting fetch requests to view responses
function interceptFetch(url,q, callback) {
    var originalFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = function() {
        return originalFetch.apply(this, arguments).then(function(data) {
            let dataurl = data.url.toString();
            if (dataurl.includes(url) && dataurl.includes(q)) {
                const clone = data.clone();
                clone.json().then((response) => callback(response, data.url));
            }
            return data;
        });
    };
}

//used for error/success messages
const fadeDelay = 250;
const fadeDuration = 1000;

GM_addStyle(`
.wb_div {
    position: absolute;
    z-index: 1000;
}

.wb_torn_button {
    background: transparent linear-gradient(180deg ,#CCCCCC 0%,#999999 60%,#666666 100%) 0 0 no-repeat;
    border-radius: 5px;
    font-family: Arial,sans-serif;
    font-size: 14px;
    font-weight: 700;
    text-align: center;
    letter-spacing: 0;
    color: #333;
    text-shadow: 0 1px 0 #ffffff66;
    text-decoration: none;
    text-transform: uppercase;
    margin: 0;
    border: none;
    outline: none;
    overflow: visible;
    box-sizing: border-box;
    line-height: 16px;
    padding: 4px 8px;
    height: auto;
    white-space: nowrap;
    cursor: pointer;
}

.wb_torn_button:hover, .wb_torn_button:focus {
    background: transparent linear-gradient(180deg,#E5E5E5 0%,#BBBBBB 60%,#999999 100%) 0 0 no-repeat;
    color: #333
}

.wb_torn_button.disabled,.wb_torn_button:disabled,.wb_torn_button:hover.disabled,.wb_torn_button:hover:disabled {
    color: #777;
    color: var(--btn-disabled-color);
    box-shadow: 0 1px 0 #ffffffa6;
    box-shadow: var(--btn-disabled-box-shadow);
    text-shadow: 0 -1px 0 #ffffff66;
    text-shadow: var(--btn-disabled-text-shadow);
    background: transparent linear-gradient(180deg,#999999 0%,#CCCCCC 100%) 0 0 no-repeat;
    background: var(--btn-disabled-background);
    cursor: default
}
`);

(function() {
    interceptFetch("torn.com","faction_wars.php", (response, url) => {
        //https://www.torn.com/faction_wars.php?redirect=false&step=getwarusers&factionID=0&userID=0&warID=1
        if (url.includes('step=getwarusers') && url.includes('warID=')) {
            // Obtain the warID using regex
            const reg = /warID=([0-9]+)/g;
            const match = reg.exec(url);
            if(match == null){
                return;
            }
            const warID = match[1];
            if (!isNaN(warID)) {
                insertSpamWall(warID);
            }
        }
    });
})();

//Insert the spam wall join button to the page
function insertSpamWall(warID) {
    //Add the physical button
    $('.faction-war-info').prepend(`<div class="wb_div"><button class="wb_torn_button" id="spamJoin">JOIN A SLOT</button></div>`);
    // Click event for button
    $('#spamJoin').click(function(e) {
        
        //Get button positioning, for the error/success messages
        const pos = $('#spamJoin').offset();

        e.preventDefault();
        const elList = $('.faction-war .members-list > li.join'); // Get list of joinable slots on wall
        const index = elList.random().index(); //Get a random index based on the list of joinable slots

        if (elList.length == 0 || index < 0) {
            let span = $('<span>')
            .css({
                "color": "var(--default-red-color)",
                "position": "absolute",
                "transform": "translate(5%, -135%)",
                "opacity": "1",
                "left": pos.left + 'px',
                "top": pos.top + 'px',
                "z-index": "999"
            })
            .append("No slots open")
            .appendTo(document.body);

            setTimeout(function() {
                span.css({ opacity: "0", transition: "opacity 1s ease-in-out" });
                setTimeout(function() { span.remove(); }, fadeDuration);
            }, fadeDelay);
            return;
        }


        const joinURL = 'https://www.torn.com/faction_wars.php?redirect=false&step=joinwar&factionID=0';

        //Send the Territory War ID, and the index of the slot on the wall
        const formData = {
            'warID': warID,
            'index': index
        }

        $.ajax({
            type: "POST",
            url: joinURL,
            data: formData,
            dataType: 'json',
            success: function(data) {
                console.log(data);
                if (data) {

                    if (data.error) {
                        console.error(data.error);
                    }

                    if (data.success == false) {
                        let span = $('<span>')
                        .css({
                            "color": "var(--default-red-color)",
                            "position": "absolute",
                            "transform": "translate(5%, -135%)",
                            "opacity": "1",
                            "left": pos.left + 'px',
                            "top": pos.top + 'px',
                            "z-index": "999"
                        })
                        .append(data.msg)
                        .appendTo(document.body);

                        setTimeout(function() {
                            span.css({ opacity: "0", transition: "opacity 1s ease-in-out" });
                            setTimeout(function() { span.remove(); }, fadeDuration);
                        }, fadeDelay);
                    }

                    if (data.success) {
                        let span = $('<span>')
                        .css({
                            "color": "var(--default-green-color)",
                            "position": "absolute",
                            "transform": "translate(5%, -135%)",
                            "opacity": "1",
                            "left": pos.left + 'px',
                            "top": pos.top + 'px',
                            "z-index": "999"
                        })
                        .append("Success!")
                        .appendTo(document.body);

                        setTimeout(function() {
                            span.css({ opacity: "0", transition: "opacity 1s ease-in-out" });
                            setTimeout(function() { span.remove(); }, fadeDuration);
                        }, fadeDelay);
                    }
                }
            }
        });
    });
}


//Function for randomly selecting an index based on a jQuery selection of elements
$.fn.random = function() {
    return this.eq(Math.floor(Math.random() * this.length));
}