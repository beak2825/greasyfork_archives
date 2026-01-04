// ==UserScript==
// @author        Odd
// @description   Automatically sorts Caption Contest entries by quantity of votes
// @include       http://www.neopets.com/games/caption_browse.phtml*
// @name          Caption Contest Sorter
// @namespace     Odd@Clraik
// @version       1.0
// @downloadURL https://update.greasyfork.org/scripts/374957/Caption%20Contest%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/374957/Caption%20Contest%20Sorter.meta.js
// ==/UserScript==

(function () {

    function formatNumber(value) {

        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    $(document).ready(function () {

        var elements = $(".content a[href*='caption_browse.phtml?page=']");

        if (elements.length) {

            var entries = [];
            var entry = { caption: "", href: "", user: "", votes: 0 };
            var entryMissingP = $(elements[0]);

            //Adds the first entry on the page, which is not inside a elements element for some reason

            entry.href = entryMissingP.attr("href");
            entry.votes = parseInt(entryMissingP.prev().remove().text().match(/[\d\,]+/)[0].replace(/\,/g, ""));

            entryMissingP.prev().remove();

            entry.caption = entryMissingP[0].previousSibling.textContent;

            entryMissingP[0].parentNode.removeChild(entryMissingP[0].previousSibling);

            entryMissingP.prev().remove();

            entry.user = entryMissingP.prev().remove().text().match(/by\x20+([^\:]*)/i)[1];

            entryMissingP.remove();

            entries.push(entry);

            $((elements = elements.parent())[0])
                .before("<br><br><table id=\"sortedEntries\"><tr style=\"font-weight: bold;\"><td style=\"text-align: center; width: 45px;\">Rank</td><td style=\"text-align: center; width: 55px;\">Votes</td><td>User</td><td>Caption</td><td></td></tr></table>");

            for (var i = 0; i < elements.length; i++) {

                entry = $(elements[i]).remove();

                entries.push({

                    caption: entry[0].childNodes[2].textContent,
                    href: entry.find("a").attr("href"),
                    user: entry.find("b").text().match(/by\x20+([^\:]*)/i)[1],
                    votes: parseInt(entry.find("i").text().match(/[\d\,]+/)[0].replace(/\,/g, ""))
                });
            }

            entries.sort(function (entry1, entry2) { return (entry2.votes - entry1.votes); });

            var sortedEntries = $("#sortedEntries > tbody");

            for (var i = 0; i < entries.length; i++)
                sortedEntries.append("<tr><td style=\"text-align: center;\">" + (i + 1) + "</td><td style=\"text-align: center;\">" + formatNumber(entries[i].votes) + "</td><td>" + entries[i].user + "</td><td style=\"height: 45px; max-width: 450px;\">" + entries[i].caption + "</td><td style=\"padding-left: 16px;\"><a href=\"" + entries[i].href + "\">Vote</a></td></tr>");
        }
    });
})();