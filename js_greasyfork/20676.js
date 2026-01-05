// ==UserScript==
// @name        Github Repository Sorter
// @namespace   http://sunnyrodriguez.com/
// @version     0.2
// @description Sorts Github repositories.
// @author      splttingatms
// @include     /^https?://.*\.?github\.com/\w+/?$/
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @require     https://greasyfork.org/scripts/1003-wait-for-key-elements/code/Wait%20for%20key%20elements.js?version=49342
// @downloadURL https://update.greasyfork.org/scripts/20676/Github%20Repository%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/20676/Github%20Repository%20Sorter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function parseRepoStat(repo, stat) {
        return parseInt(repo.querySelector('[aria-label="' + stat + '"]').text.trim().replace(/,/g, ""));
    }

    function sortBy(stat) {
        var repoCollection = document.getElementsByClassName("repo-list-item");
        var repos = Array.prototype.slice.call(repoCollection);
        repos.sort(function(a, b){
            var starsA = parseRepoStat(a, stat);
            var starsB = parseRepoStat(b, stat);
            return starsA - starsB; // sort low to high
        });

        var list = document.getElementsByClassName("repo-list")[0];
        for (var i = 1; i < repos.length; i++) {
            list.insertBefore(repos[i], list.children[0]); // insert before reverses list to high to low
        }
    }

    function createSortButtonByStat(stat) {
        var item = document.createElement("li");
        item.classList.add("right");
        item.classList.add("ml-3");
        item.style = "list-style-type: none";

        var link = document.createElement("a");
        link.text = "Sort by " + stat;
        link.onclick = function() {
            sortBy(stat);
            var items = document.getElementById("sort-bar").getElementsByTagName("li");
            for (var i = 0; i < items.length; i++) {
                items[i].classList.remove("filter-selected");
            }
            item.classList.add("filter-selected");
        };

        item.appendChild(link);
        return item;
    }

    function addSortButtonsTo(parent) {
        var para = document.createElement("p");
        para.id = "sort-bar";

        var list = document.createElement("ul");
        list.classList.add("right");

        var forkSortButton = createSortButtonByStat("Forks");
        list.appendChild(forkSortButton);

        var starSortButton = createSortButtonByStat("Stargazers");
        list.appendChild(starSortButton);

        para.appendChild(list);
        console.log($(parent));
        document.getElementsByClassName(parent)[0].appendChild(para);
    }

    function isRepositoryTab(jNode) {
        return jNode[0].children[0].classList.contains("repo-tab");
    }

    function isOrganizationPage() {
        return $(".org-name").length > 0;
    }

    // Execute
    if (isOrganizationPage()) {
        addSortButtonsTo("org-toolbar");
    } else {
        waitForKeyElements (".js-repo-filter", function(jNode) {
            if (isRepositoryTab(jNode)) {
                addSortButtonsTo("filter-bar");
            }
        });
    }
})();