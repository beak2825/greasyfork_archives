// ==UserScript==
// @name         BL R9.75 Mission 11/16 Trail/Convince Script
// @namespace    Bootleggers R9.75
// @version      0.0.4
// @description  Trail PietroGrazia every 4mins/Try convince IreneJohnson not to testify every 2mins
// @author       BD
// @include      https://www.bootleggers.us/user/PietroGrazia
// @include      https://www.bootleggers.us/user/IreneJohnson
// @update       https://greasyfork.org/scripts/376458-bl-r9-75-mission-11-16-trail-convince-script/code/BL%20R975%20Mission%201116%20TrailConvince%20Script.user.js
// @downloadURL https://update.greasyfork.org/scripts/376458/BL%20R975%20Mission%201116%20TrailConvince%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/376458/BL%20R975%20Mission%201116%20TrailConvince%20Script.meta.js
// ==/UserScript==

$(document).ready(function() {
    if (window.location.href == "https://www.bootleggers.us/user/PietroGrazia") {
    var notTrailing = document.querySelectorAll("[value='Do it!']")[0];
    if (notTrailing) {
        document.querySelectorAll("[value='Do it!']")[0].click();
    } else {
        setTimeout(function() {
            document.querySelectorAll("[value='Continue tailing!']")[0].click();
        }, 241000);
    }
    } else if (window.location.href == "https://www.bootleggers.us/user/IreneJohnson") {
        if ($("center")[0]) {
            if ($("center")[0].textContent.includes("testify")) {
                setTimeout(function() {
                    document.querySelectorAll("[value='Do it!']")[0].click();
                }, 121000);
                $(document.querySelectorAll("[value='Do it!']")[0].parentElement.parentElement.parentElement.parentElement.parentElement).append($("<center><font id='reload' color='red'><b>Retrying in: 120</b></font></center>"));
                var reloadTime = 121;
                setInterval(function() {
                    reloadTime--;
                    $("#reload")[0].innerHTML = "<b>Retrying in: " + reloadTime + "</b>";
                }, 1000);
            }
        } else {
            document.querySelectorAll("[value='Do it!']")[0].click();
        }
    }
});