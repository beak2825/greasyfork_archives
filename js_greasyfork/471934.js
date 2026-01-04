// ==UserScript==
// @name         [AO3] Default Filters
// @namespace    https://greasyfork.org/en/users/1138163-dreambones
// @version      1.2.2
// @description  Automatically set global filters for AO3 searches.
// @author       DREAMBONES
// @match        http*://archiveofourown.org/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471934/%5BAO3%5D%20Default%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/471934/%5BAO3%5D%20Default%20Filters.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Config is case-insensitive. Enclose all config parameters in quotes unless stated otherwise.
    var config = {
        Sort: "",
        Language: "",

        IncludeRatings: [],
        ExcludeRatings: [],

        IncludeWarnings: [],
        ExcludeWarnings: [],

        IncludeCategories: [],
        ExcludeCategories: [],

        IncludeFandoms: [],
        ExcludeFandoms: [],

        IncludeCharacters: [],
        ExcludeCharacters: [],

        IncludeRelationships: [],
        ExcludeRelationships: [],

        IncludeAdditionalTags: [],
        ExcludeAdditionalTags: [],

        Crossovers: "",
        CompletionStatus: "",

        // Set word counts to "null" if you don't want a threshold. Type a number (NOT enclosed in quotes) to set an upper/lower threshold.
        MinWordCount: null,
        MaxWordCount: null,
    }

    var domainRe = /https?:\/\/archiveofourown\.org\/(works|tags).*/i
    if (domainRe.test(document.URL)) {
        selectDropdownOption("#work_search_sort_column", config.Sort);
        selectDropdownOption("#work_search_language_id", config.Language);

        selectListOption("#include_rating_tags > ul", config.IncludeRatings);
        selectListOption("#exclude_rating_tags > ul", config.ExcludeRatings);
        selectListOption("#include_archive_warning_tags > ul", config.IncludeWarnings);
        selectListOption("#exclude_archive_warning_tags > ul", config.ExcludeWarnings);
        selectListOption("#include_category_tags > ul", config.IncludeCategories);
        selectListOption("#exclude_category_tags > ul", config.ExcludeCategories);
        selectListOption("#include_fandom_tags > ul", config.IncludeFandoms);
        selectListOption("#exclude_fandom_tags > ul", config.ExcludeFandoms);
        selectListOption("#include_character_tags > ul", config.IncludeCharacters);
        selectListOption("#exclude_character_tags > ul", config.ExcludeCharacters);
        selectListOption("#include_relationship_tags > ul", config.IncludeRelationships);
        selectListOption("#exclude_relationship_tags > ul", config.ExcludeRelationships);
        selectListOption("#include_freeform_tags > ul", config.IncludeAdditionalTags);
        selectListOption("#exclude_freeform_tags > ul", config.ExcludeAdditionalTags);

        selectListOption("#work_crossover > ul", config.Crossovers);
        selectListOption("#work_complete > ul", config.CompletionStatus);

        if (config.MinWordCount != null) {
            var minWords = document.querySelector("#work_search_words_from");
            minWords.setAttribute("value", config.MinWordCount);
        }

        if (config.MaxWordCount != null) {
            var maxWords = document.querySelector("#work_search_words_to");
            maxWords.setAttribute("value", config.MaxWordCount);
        }

        function selectDropdownOption(query, option) {
            if (option.length) {
                option = new RegExp(option, "i")
                var list = document.querySelector(query);
                for (var i = 0; i < (list.length); i++) {
                    if (option.test(list[i].innerHTML)) {
                        list[i].setAttribute("selected", "");
                        break;
                    }
                }
            }
        }

        function selectListOption(query, option) {
            if (option.length) {
                option = new RegExp(option, "i")
                var list = document.querySelector(query).children;
                for (var i = 0; i < (list.length); i++) {
                    var span = list[i].querySelectorAll("span")[1];
                    var input = list[i].querySelector("input");
                    if (Array.isArray(option)) {
                        for (var ii = 0; ii < (option.length); ii++) {
                            if (option.test(span.innerHTML)) {
                                input.setAttribute("checked", "");
                                let listControls = document.querySelector(`button[aria-controls="${document.querySelector(query).parentNode.id}"]`);
                                let listExpanded = listControls.getAttribute("aria-expanded");
                                if (!listExpanded) { listControls.click(); }
                            }
                        }
                    }
                    else {
                        if (option.test(span.innerHTML)) {
                            input.setAttribute("checked", "");
                            let listControls = document.querySelector(`button[aria-controls="${document.querySelector(query).parentNode.id}"]`);
                            let listExpanded = listControls.getAttribute("aria-expanded");
                            if (!listExpanded) { listControls.click(); }
                        }
                    }
                }
            }
        }
    }
})();