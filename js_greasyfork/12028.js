// ==UserScript==
// @name        Blackbird Technologies: Tag short text segments for a given characteristic
// @namespace   https://greasyfork.org/en/users/13132-rosesword975
// @author      rosesword975 help from ikarma
// @description Auto select true
// @version     1.1
// @include     https://www.mturkcontent.com/dynamic/*
// @include     https://tagger.search.blackbird.am/tagger/*
// @grant       none
// @require     http://code.jquery.com/jquery-2.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/12028/Blackbird%20Technologies%3A%20Tag%20short%20text%20segments%20for%20a%20given%20characteristic.user.js
// @updateURL https://update.greasyfork.org/scripts/12028/Blackbird%20Technologies%3A%20Tag%20short%20text%20segments%20for%20a%20given%20characteristic.meta.js
// ==/UserScript==

// Just change 'true' to 'false' depending on the hit

$("input[value='true']").click(); 

// Enter will submit the HIT.
window.onkeydown = function(event) {
    if (event.keyCode === 13) {
        $("button[name='SubmitButton']" ).click();
    };
};   
                  
                  
//test page
//https://tagger.search.blackbird.am/tagger/hit_type/text/?assignmentId=ASSIGNMENT_ID_NOT_AVAILABLE&hitId=3HFWPF5AK9TCMVXON04NN6O8D9FS3I