// ==UserScript==
// @name         Previo Redmine Gitlab MR Links
// @namespace    thetomcz.previo.redmine.gitlab.mrlinks
// @version      0.2
// @icon         https://www.previo.cz/icons/share/128x128/favicon.ico
// @description  Change text of gitlab links from plain URL to readable ones
// @match        https://redmine.previo.info/*issues?*
// @author       Tomáš Hejl <tomas.hejl@previo.info>
// @match        https://redmine.previo.info/issues/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501571/Previo%20Redmine%20Gitlab%20MR%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/501571/Previo%20Redmine%20Gitlab%20MR%20Links.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let IssueMRLinks = {

        domain : "https://gitlab.previo.info/",

        run : function () {
            console.log("MRLInks");
            $("a.external[href^='" + IssueMRLinks.domain + "']").each(function () {
                console.log($(this));
                IssueMRLinks.processGitlabLink($(this));
            });
        },

        processGitlabLink($link) {
            let href = $link.attr("href");
            let splitByMR = href.split("/merge_requests/");

            if (splitByMR.length > 1) {
                let mrNr = splitByMR[1];
                let projectName = splitByMR[0].replace(IssueMRLinks.domain, '').replace('/-', '');
                if (projectName === "previo/previo") {
                    projectName = "previo1";
                }
                if (projectName === "previo/previo2") {
                    projectName = "previo2";
                }
                $link.text(projectName + " #" + mrNr);
            }
        },

    };

    IssueMRLinks.run();
})();