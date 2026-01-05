// ==UserScript==
// @name        HotsLogs Popular Talent Builds on Top
// @description On a HotsLogs.com hero details page, this script moves the Popular Talent Builds grid near the top of the page instead of being under the "All Talents" grid.
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @namespace   ToddMoon.com
// @include     http://www.hotslogs.com/Sitewide/HeroDetails*
// @version     1.1
// @grant       none
// @license     https://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/16434/HotsLogs%20Popular%20Talent%20Builds%20on%20Top.user.js
// @updateURL https://update.greasyfork.org/scripts/16434/HotsLogs%20Popular%20Talent%20Builds%20on%20Top.meta.js
// ==/UserScript==

//The MIT License (MIT)
//
//Copyright (c) 2016 Todd Moon
//
//Permission is hereby granted, free of charge, to any person obtaining a copy
//of this software and associated documentation files (the "Software"), to deal
//in the Software without restriction, including without limitation the rights
//to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//copies of the Software, and to permit persons to whom the Software is
//furnished to do so, subject to the following conditions:
//
//The above copyright notice and this permission notice shall be included in all
//copies or substantial portions of the Software.
//
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//SOFTWARE.

(function(){

    this.$ = this.jQuery = jQuery.noConflict(true);

    var talentGrid = $("#ctl00_MainContent_ctl00_MainContent_RadGridHeroTalentStatisticsPanel");
    var popularBuildsGrid = $("#ctl00_MainContent_ctl00_MainContent_RadGridPopularTalentBuildsPanel");

    var headings = $("#talentDetails > h2");

    if( talentGrid && popularBuildsGrid )
    {       
        headings.first().insertBefore( talentGrid );
        popularBuildsGrid.insertBefore( talentGrid );
        $("<h2>Talent Utilization</h2>").insertBefore( talentGrid );
    };
})();