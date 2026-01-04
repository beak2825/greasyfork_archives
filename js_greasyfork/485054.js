// ==UserScript==
// @name         Gatech Canvas Team Annoucement Script for TA
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Perform multiple actions
// @author       thuanvo09
// @match        https://gatech.instructure.com/groups/*/discussion_topics/new?is_announcement=true
// @grant        window.close
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485054/Gatech%20Canvas%20Team%20Annoucement%20Script%20for%20TA.user.js
// @updateURL https://update.greasyfork.org/scripts/485054/Gatech%20Canvas%20Team%20Annoucement%20Script%20for%20TA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // For open multiple tabs using Chrome console

    /*



    const start_team_id = 356322
    const end_team_id = 356348

    // teams left
    const ignore = [356340, 356342]

function urlGen(team_id) {
        return `https://gatech.instructure.com/groups/${team_id}/discussion_topics/new?is_announcement=true`
    }

    for (let i = start_team_id; i <= end_team_id; i+=2) {
        if (ignore.includes(i)) {
            continue
        }
        const url = urlGen(i)
        window.open(url, '_blank')
    }




    */

    const post_title = "This is a title";

    // convert markdown to html, use html in the content

    const post_content =
`
<p><em>This&nbsp;</em></p>
<h3><strong>is&nbsp;</strong></h3>
<p>an</p>
<pre>annoucement</pre>
`;

    const start_team_id = 356322
    const start_team_num = 87
    const end_team_id = 356348
    const end_team_num = 100

    function getTeamNumber(team_url) {
        return (team_url-start_team_id)/(end_team_id-start_team_id)*(end_team_num-start_team_num)+start_team_num
    }


    function final_msg() {
        const current_url = document.URL
        const regex = /\/groups\/(\d+)/;
        const match = regex.exec(current_url);
        const extractedNumber = match && match[1];
        return `<p>Hello team ${getTeamNumber(extractedNumber)}</p>${post_content}`
    }

    function openAndModify() {
        window.onload = function () {
            setTimeout(() => {

                // title
                const title_inp = document.getElementById("discussion-title");
                title_inp.value = post_title;

                document.getElementsByClassName("css-lgvgsl-view--inlineBlock-baseButton")[3].click()

                // content
                const content_inp = document.getElementById("discussion-topic-message11")


                content_inp.value = final_msg()


                document.getElementsByClassName("css-lgvgsl-view--inlineBlock-baseButton")[0].click()

                // BE CAREFUL WITH THIS ACTION, NEED TO TEST
                // SUBMIT
                // document.getElementsByClassName("submit_button")[0].click()

                //                 console.log('closing')
                //                 window.close()


            }, 2000);
        };
    }

    openAndModify();



})();