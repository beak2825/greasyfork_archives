// ==UserScript==
// @name         GuideDownloader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  love u!
// @author       You
// @match        https://guide.medlive.cn/guideline/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABExJREFUaEPtmX1sU1UYxp97b7u2a/fRrfssFhGnYLINMhQhmOkQ5mYUpMSNCcRMnQaqxKBDySIZQiBZGY64yYbMDA0xopkmCxEUtxk3ICAJDmK3ydAsdGPs0tK13fp1r7k3arbuq02/4/pXc/Le9zy/87zvOTfnEojwHxHh+jEHEGoH/18O9CrxOEHifCBWXfTMxq8TPmraIZVK9d7k98qBQAKIi15tl1Vo04RC4VPeQIQNgEj9cntsZU0uy7I93kDMCkDT9H0URQk4W43lrz3iOvttnTcWu8eyLEuCcc5zHxet29weu782lxtnWbZbKBTmeeLErAAGg0FPkmSaL6LHP8tYRqz08nnR7vmi129qk+47+uS/4/9AcOU0MNPcYQNAKedfFBWq7ePFOm/161X1p4r9CuC0mHH73GkwTicUy1cBlAD0+XYQJImEZSsgUaow3NGK0UE9KIkE6YUbJsw/nQNTiWQBJqMflF8BzDd60FmcjwxNOXrrtMisrEZf48dIf3YD/qg/jJwjTeitq0K0agFiFj6M+7eUhSFASQEW7fwAukN7eYChtjPIPlgHXdUeuGw2mPt6IElVIi5zKeZvKg0/gI6iNcjQ7EJqXgFM3df5kuIALm/fjPjsZaAv/IzU1YWIz8rhITxp4qCW0MVX1Fjd1sXPOfhDC67vfReilHSIFclYWv0pLmu24KG33od8yaOTdIW8B6ZaKcc9IwRSGQgBf1yAcThAcv+JyZtcWAJ4c0aEAqCFJMkkfmXNZtLZfVXijWD3WMJithu3vTixMaZJ6JdtdHzuQL7MBayJ5wB8qLewKCEyTo740h1grGYY67Ve4YQFQExRKcY6W5FYWQN6fzkcN3QeQ4QFQGxJGSxnmpFS+yWMDYdg/el0ZAGIc1bwglOPNWPw9Y0Yu/RLZAEQwigkVR1HzAsv4Wa2AozxbmQBcGpTjp5C1MJF6F+T6bF4LjAseoB7H1K16mDr+hW33yyJPABxzkoomzsw8tVnMB6rhr37mscQYeFA0sEGRC3Ogl69CknaRgxXaMCYTR5BhByAkidC1fkn6A93wnSyAULVA0h47wBMTbUgExQgpTFgXU7YdV2w//7bJKiQA8jf3oP4sndwZ/cbvHjWbgNrs0Gavx7G+iqMXbkAQXIaEiu0sLZ9j3uNNRMgQgdAUYjOzUfy4RMwff4JRr45AcfN3v/EkbIYyDW7QchiYbt6CXFbt2G0sxX0gV2hB5A9XwzJyjxInngajr4eDGwt4K7apqx5SpEC8ZLH4Bwa4Hcp97jgOkAQfCnYrl0Bc3cYyTVfoH9tFlxDM16szdjMQQWQPVcEl4GG89ZfSD/5I+5UbIf1XItHu810QUEFkK5dB2mhGlEPLobhyD5Yzn7nk/iQnMRcczKjVsDl8ll8SAD8onpckqCWkL/Fzzkw1YpG/LVKIMrE15yzfqHxdYJAPz8HEOgVni1/xDvwN2GoNU9zDH2sAAAAAElFTkSuQmCC
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441115/GuideDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/441115/GuideDownloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var pdfBtn = $('.pdf_btn a');
    var baseUrl = articleViewer && articleViewer.download_url ? articleViewer && articleViewer.download_url + '&' : '/webres_action/download.php?';
    var h = {
        f: pdfBtn.attr("fid"),
        n: pdfBtn.attr("fn"),
        k: pdfBtn.attr("sk"),
        g: pdfBtn.attr("objid"),
        o: pdfBtn.attr("objtype"),
        r: "web",
        p: "guide_web"
    };
    baseUrl += $.param(h);
    $('.pdf_btn').append("<a href='" + baseUrl + "' target='_blank' style='background-color: #eb7f4c;'>爱心下载</a>");
    console.log(pdfBtn.length);
})();