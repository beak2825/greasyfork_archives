// ==UserScript==
// @name         WME MapRaid Total Edits
// @namespace    https://greasyfork.org/en/users/45389-mapomatic
// @version      2023.02.07.001
// @description  retrieve edit counts for mapraid stats
// @author       MapOMatic
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/.*$/
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/28283/WME%20MapRaid%20Total%20Edits.user.js
// @updateURL https://update.greasyfork.org/scripts/28283/WME%20MapRaid%20Total%20Edits.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var re = /"editingActivity":(\[.*?\])/i;
    var users = ['JasonN899','FzNk','SkiDooGuy','fjsawicki','hawkeygoal','Doryphore_6'];

    function writeOutput(output) {
        console.log(output.join('\n'));
    }

    function getUserInfoRecursive(userIdx, output) {
        output = output || [];
        var userName = users[userIdx];
        console.log('---- getUserInfoRecursive - ' + userName);
        var url = 'https://www.waze.com/user/editor/' + userName;
        var error;

        GM_xmlhttpRequest({
            method: 'GET',
            url,
            onload: res => {
                var userInfo = [userName];
                var text = res.responseText;
                var matches = text.match(re);
                if (matches) {
                    var editCounts = JSON.parse(matches[1]);
                    Array.prototype.push.apply(userInfo,editCounts);
                    output.push(userInfo.join('\t'));
                } else {
                    output.push([userInfo, '???'].join('\t'));
                }
                if (userIdx === users.length - 1) {
                    writeOutput(output);
                    console.log ('--------- ' + output.length);
                } else {
                    getUserInfoRecursive(++userIdx, output);
                }
            },
            onerror: e => { console.log('MapRaid Edit Count Error!', e); getUserInfoRecursive(userIdx, output); }
        });
    }

    function getAllUserEditCounts() {
        getUserInfoRecursive(0);
    }

    getAllUserEditCounts();
})();