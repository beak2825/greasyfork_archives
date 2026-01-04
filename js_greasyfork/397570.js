// ==UserScript==
// @name         XVideos - Adds Sort by Views/Earnings for "This Month" and "Last Month" to Global Statistics Page
// @namespace    https://xvideos.com/
// @version      0.1
// @description  Adds new sort options in the "This Month" and "Last Month" columns to sort by Views or Earnings. Useful for content creator and producers that monetize their videos on xvideos.com.
// @author       Aiden Valentine
// @match        https://www.xvideos.com/account/uploads/statistics*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397570/XVideos%20-%20Adds%20Sort%20by%20ViewsEarnings%20for%20%22This%20Month%22%20and%20%22Last%20Month%22%20to%20Global%20Statistics%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/397570/XVideos%20-%20Adds%20Sort%20by%20ViewsEarnings%20for%20%22This%20Month%22%20and%20%22Last%20Month%22%20to%20Global%20Statistics%20Page.meta.js
// ==/UserScript==

(function(){
    // Default Values
    var elem = '<a href="https://www.xvideos.com/account/uploads/statistics/s:v-2002:desc" id="v-2002"><span class="txt">V</span></a>';
    $('#video-tab-list > thead > tr:nth-child(1) > th:nth-child(10)').append(elem);
    var elem2 = '<a href="https://www.xvideos.com/account/uploads/statistics/s:e-2002:desc" id="e-2002"><span class="txt">E</span></a>';
    $('#video-tab-list > thead > tr:nth-child(1) > th:nth-child(10)').append(elem2);
    var elem3 = '<a href="https://www.xvideos.com/account/uploads/statistics/s:v-2003:desc" id="v-2003"><span class="txt">V</span></a>';
    $('#video-tab-list > thead > tr:nth-child(1) > th:nth-child(9)').append(elem3);
    var elem4 = '<a href="https://www.xvideos.com/account/uploads/statistics/s:e-2003:desc" id="e-2003"><span class="txt">E</span></a>';
    $('#video-tab-list > thead > tr:nth-child(1) > th:nth-child(9)').append(elem4);

    // Logic
    var url = "https://www.xvideos.com/account/uploads/statistics/";
    if (window.location.href == url+"s:v-2002:desc") {
      $("#v-2002").attr("href", url+"s:v-2002:asc");
    }
    if (window.location.href == url+"s:e-2002:desc") {
      $("#e-2002").attr("href", url+"s:e-2002:asc");
    }
    if (window.location.href == url+"s:v-2003:desc") {
      $("#v-2003").attr("href", url+"s:v-2003:asc");
    }
    if (window.location.href == url+"s:e-2003:desc") {
      $("#e-2003").attr("href", url+"s:e-2003:asc");
    }
})();