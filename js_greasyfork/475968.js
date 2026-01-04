// ==UserScript==
// @name         AO3 First Relationship Tag Filter
// @namespace    https://greasyfork.org/en/users/1178894-sunny13
// @version      0.7.1
// @description  Hides works that don't have the relationship tag you're browsing as the first tag. Can be disabled when browsing other tags.
// @author       sunny13
// @include      http://archiveofourown.org/*
// @include      https://archiveofourown.org/*
// @grant        none
// @license      MIT
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/475968/AO3%20First%20Relationship%20Tag%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/475968/AO3%20First%20Relationship%20Tag%20Filter.meta.js
// ==/UserScript==

(function($) {
    $(document).ready(function() {
        var tagsToSkip = ["Creator Chose Not To Use Archive Warnings", "Graphic Depictions Of Violence", "Major Character Death", "Rape/Non-Con", "Underage", "No Archive Warnings Apply"];
         console.log('Script is running');
        // Extract the relationship tag from the URL of the page you are browsing
        var currentURL = window.location.href;
        var relationshipTagFromURL = currentURL.match(/\/tags\/([^/]+)\/works(?:[?#]|$)|[?&]tag_id=([^&]*?)(?=&page=|&|$)/);

        if (!relationshipTagFromURL) {
            // If the relationship tag cannot be extracted, do nothing
            return;
        }

        function decodeAndNormalize(str) {
            // Decode URL-encoded characters
            const decodedStr = decodeURIComponent(str);

            // Normalize the string and remove diacritic marks
            const normalizedStr = decodedStr.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

            return normalizedStr;
        }

        // Extract and convert the relationship tag to the desired format
        var rawRelationshipTag = relationshipTagFromURL[1] || relationshipTagFromURL[2];
        var extractedRelationshipTag = decodeAndNormalize(rawRelationshipTag.replace(/%20/g, ' ')
            .replace(/\*s\*/g, '/')
            .replace(/%7C/g, '|')
            .replace(/\*a\*/g, '&')
            .replace(/\+/g, ' ')
            .replace(/%28/g, '(')
            .replace(/%22/g, '"')
            .replace(/%29/g, ')')
            .replace(/\*d\*/g, '.'));
        var simplifiedRelationshipTag = extractedRelationshipTag.replace(/\s*\([^)]*\)\s*/g, '').replace(/\s*&\s*/g, ' & ').replace(/(\/\s*)you\b/gi, "$1reader").replace(/(&\s*)you\b/gi, "$1reader").replace(/Your\s+Name/g, "reader").replace(/\by\/n\b/gi, "reader").replace(/"/g, '').trim();
        var reversedRelationshipTag = extractedRelationshipTag.split('/').reverse().join('/');
        var reversedPlatonicTag = extractedRelationshipTag.replace(' & ', '&').split('&').reverse().join(' & ');
        var reversedSimplifiedRelationshipTag = simplifiedRelationshipTag.split('/').reverse().join('/');
        var reversedSimplifiedPlatonicTag = simplifiedRelationshipTag.replace(' & ', '&').split('&').reverse().join(' & ');
        var refinedRelationshipTag = simplifiedRelationshipTag.replace(/\s*\|\s*(?![^|&\/]*[&\/])[^|]*$/, '');
        var reversedRefinedRelationshipTag = refinedRelationshipTag.split('/').reverse().join('/');
        var reversedRefinedPlatonicTag = refinedRelationshipTag.replace(' & ', '&').split('&').reverse().join(' & ');

        // Function to generate alternative sides (AltSides)
function generateAltSides(side) {
    var words = side.split(' '); // Split side into words
    var altSides = [];

    // Generate all contiguous combinations
    for (var i = 0; i < words.length; i++) {
        for (var j = i; j < words.length; j++) {
            var altSide = words.slice(i, j + 1).join(' ');
            if (!altSides.includes(altSide)) {
                altSides.push(altSide);
            }
        }
    }

    // Generate non-contiguous combinations like "James Barnes"
    for (var i = 0; i < words.length; i++) {
        for (var j = i + 1; j < words.length; j++) {
            var altSide = words[i] + ' ' + words[j];
            if (!altSides.includes(altSide)) {
                altSides.push(altSide);
            }
        }
    }

    console.log('AltSides for side:', side, altSides);
    return altSides;
}

        // Function to generate tag variation
        function generateTagVariation(simplifiedRelationshipTag) {
            var sides = simplifiedRelationshipTag.split(/\s*\/\s*|\s*&\s*/); // Split into sides using "/" or "&"
            var altSidesList = sides.map(generateAltSides);

            // Generate all possible combinations of AltSides
            var tagVariations = altSidesList.reduce(function (combinations, altSides) {
                return combinations.flatMap(function (combination) {
                    return altSides.map(function (altSide) {
                        return combination.concat(altSide);
                    });
                });
            }, [[]]);

            // Join AltSides with original delimiters to create tagVariation
            var tagVariationList = tagVariations.map(function (variation) {
                return variation.join(simplifiedRelationshipTag.includes('/') ? '/' : ' & ');
            });

            console.log('Tag Variations:', tagVariationList);
            return tagVariationList;
        }

        // Function to generate reverse tag variation
        function generateReverseTagVariation(tagVariationList) {
            var reverseTagVariations = tagVariationList.flatMap(function (originalTag) {
                var newSides = originalTag.split(/\s*\/\s*|\s*&\s*/); // Split the original tag into NewSides
                var newSidesPermutations = permute(newSides); // Generate all possible permutations of NewSides

                // Join NewSides with original delimiters to create reverseTagVariation
                return newSidesPermutations.map(function (permutation) {
                    return permutation.join(originalTag.includes('/') ? '/' : ' & ');
                });
            });

            console.log('Reverse Tag Variations:', reverseTagVariations);
            return reverseTagVariations;
        }

        // Function to generate permutations of an array
        function permute(arr) {
            if (arr.length === 0) {
                return [[]];
            }

            var result = [];
            for (var i = 0; i < arr.length; i++) {
                var rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
                var permutations = permute(rest);
                for (var j = 0; j < permutations.length; j++) {
                    result.push([arr[i], ...permutations[j]]);
                }
            }

            return result;
        }

        var tagVariations = generateTagVariation(simplifiedRelationshipTag);
        var reverseTagVariations = generateReverseTagVariation(tagVariations);

        $('<style>').text(
            '.workhide{border: 1px solid #ccc; margin: 0.643em 0em; padding: 0.429em 0.75em; height: 29px; display: block !important;}' +
            '.workhide .left{float: left; padding-top: 5px;}' +
            '.workhide .right{float: right;}'
        ).appendTo($('head'));

        // Function to check if the filter should be applied
        function shouldApplyFilter() {
            var filterEnabled = localStorage.getItem('filterEnabled');
            return filterEnabled !== 'false';
        }

        // Function to apply or remove the filter
        function applyOrRemoveFilter() {
            if (shouldApplyFilter()) {
                applyFilter();
            } else {
                removeFilter();
            }
        }

        // Function to hide works
        function applyFilter() {
            // Iterate through each work blurb on the page
            $('.index .blurb').each(function() {
                var tags = $(this).find('ul.tags');
                var tags2 = $(tags).find('.relationships a').toArray().map(tag => $(tag).text().trim());
                var relationshipTags = $(tags).find('.relationships a').toArray().map(tag => {
                    return decodeAndNormalize($(tag).text().trim().toLowerCase()
                        .replace(/\s*\|\s*(?![^|&\/]*[&\/])[^|]*$/, '')
                        .replace(/\s*-\s*relationship/, '')
                        .replace(/"/g, '')
                        .replace(/ x /g, '/')
                        .replace(/implied\s*/, '')
                        .replace(/\s*\([^)]*\)\s*/g, '')
                        .replace(/\s*&\s*/g, ' & ')
                        .replace(/(\/\s*)you\b/gi, "$1reader")
                        .replace(/(&\s*)you\b/gi, "$1reader")
                        .replace(/your\s+name/g, "reader")
                        .replace(/\by\/n\b/gi, "reader")
                        .replace(/female\s+reader/g, "reader")
                        .replace(/male\s+reader/g, "reader")
                        .replace(/fem!reader/g, "reader")
                        .replace(/xreader/g, "/reader").trim());
                });

                var shouldHide = false; // Flag to determine if we should hide the work blurb

                for (var i = 0; i < relationshipTags.length; i++) {
                    var tag = relationshipTags[i];

                    if (tagsToSkip.includes(tag)) {
                        shouldHide = true;
                    } else {
                        // Check if the first non-skipped tag matches the extracted relationship tag
                        if (shouldHide || tag !== extractedRelationshipTag.toLowerCase() && tag !== simplifiedRelationshipTag.toLowerCase() && tag !== reversedRelationshipTag.toLowerCase() && tag !== reversedSimplifiedRelationshipTag.toLowerCase() && tag !== reversedSimplifiedPlatonicTag.toLowerCase() && tag !== reversedPlatonicTag.toLowerCase() && tag !== refinedRelationshipTag.toLowerCase() && tag !== reversedRefinedRelationshipTag.toLowerCase() && tag !== reversedRefinedPlatonicTag.toLowerCase() && !tagVariations.some(variation => typeof variation === 'string' && variation.toLowerCase() === tag) && !reverseTagVariations.some(variation => typeof variation === 'string' && variation.toLowerCase() === tag)) {
                            // Hide the work blurb
                            $(this).hide();
                            var firstTag = tags2.find(t => !tagsToSkip.includes(t));

                            // Add a button to show the work blurb
                            var button = document.createElement('div');
                            button.setAttribute('class', 'workhide');
                            button.innerHTML = `<div class="left">This work does not prioritize the tag you are browsing. The first tag on this work is: <b>${firstTag}</b></div><div class="right"><button type="button" class="showwork">Show Work</button></div>`;
                            $(this).after(button);

                            // Adjust the width of the left message to accommodate different tag lengths
                            var leftMessage = $(button).find('.left');
                            var buttonWidth = $(button).width();
                            var leftMessageWidth = buttonWidth - $(button).find('.right').width() - 5;
                            $(leftMessage).width(leftMessageWidth);

                            $(this).css('display', 'none'); // Hide
                             setTimeout(() => {
                            $(this).css('display', 'none'); // Force reflow
                            }, 0);

                            setTimeout(function() {
                                var leftMessage = $(button).find('.left');
                                var buttonHeight = $(leftMessage).outerHeight(true) + 5; // Adjust 5 for padding and margin
                                $(button).height(buttonHeight);
                            }, 0);

                        } else {
                            // Show the work blurb
                            $(this).show();
                        }
                        break; // No need to check the rest of the tags
                    }
                }
            });
        }

        // Function to remove the filter
        function removeFilter() {
            // Remove the filter by showing all works and hiding any "Show Work" buttons
            $('.index .blurb').show();
            $('.workhide').remove();
        }

        // Toggle the filter when the "Toggle Filter" button is clicked
        function toggleFilter() {
            var filterEnabled = localStorage.getItem('filterEnabled');
            if (filterEnabled !== 'false') {
                localStorage.setItem('filterEnabled', 'false');
                $('#toggleIndicator').text('Off'); // Update the indicator text to "Off"
            } else {
                localStorage.setItem('filterEnabled', 'true');
                $('#toggleIndicator').text('On'); // Update the indicator text to "On"
            }
            applyOrRemoveFilter();
        }

        // Function to add the dropdown menu
        function addDropdownMenu() {
            // Create the menu button
            var menuButton = $('<li class="dropdown"></li>').html('<a>First Tag Filter</a>');

            // Create the dropdown menu
            var dropdownMenu = $('<ul class="menu dropdown-menu"></ul>');

            // Create the "Toggle Filter" button with the initial text based on the current filter state
            var filterEnabled = localStorage.getItem('filterEnabled');
            var toggleButtonText = filterEnabled === 'true' ? 'On' : 'Off';
            var toggleButton = $('<li></li>').html('<a>Toggle Filter: <span id="toggleIndicator">' + toggleButtonText + '</span></a>');
            toggleButton.click(toggleFilter);

            // Add the "Toggle Filter" button to the menu
            dropdownMenu.append(toggleButton);

            // Add the menu button to the header menu
            $('ul.primary.navigation.actions li.search').before(menuButton);

            // Add the dropdown menu to the menu button
            menuButton.append(dropdownMenu);
        }

        // Apply or remove the filter when the page loads
        applyOrRemoveFilter();

        // Add the dropdown menu
        addDropdownMenu();

        // Show the hidden work blurb when the "Show Work" button is clicked
        $(document).on('click', '.showwork', function() {
            var workBlurb = $(this).parents('.workhide').prev();
            $(workBlurb).show();
            $(this).parents('.workhide').remove();
        });

        console.log('Script running');
    });
})(window.jQuery);
