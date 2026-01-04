// ==UserScript==
// @name         GGn E-Books upload assistant
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Scans the filename for month, year, issue, format, language and fills in info based on that
// @author       fordtransit
// @match        https://gazellegames.net/upload.php*
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/508013/GGn%20E-Books%20upload%20assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/508013/GGn%20E-Books%20upload%20assistant.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const MonthsToFind = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december', 'christmas']; // Possible additions could be Summer, Fall, Spring, Easter, ...
    const languageMap = {
        'en': 'English',
        'fr': 'French',
        'es': 'Spanish',
        'de': 'German',
        'it': 'Italian',
        'pt': 'Portuguese',
        'cz': 'Czech',
        'zh': 'Chinese',
        'ja': 'Japanese',
        'ko': 'Korean',
        'pl': 'Polish',
        'ru': 'Russian'
    };
    const fileFormats = ['pdf', 'epub', 'mobi', 'cbz', 'cbr', 'cb7', 'azw3'];

    function performScript() {
        let FoundMonth = [];
        let FoundYear = [];
        let FullTitle = [];
        let FoundLanguages = [];
        let FoundFileFormats = [];
        let Issue = [];

        const Title = document.getElementById('title').value;
        const fileInputValue = $("#file").val().toLowerCase();

        MonthsToFind.forEach(month => {
            const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
            if (fileInputValue.includes(month.toLowerCase())) {
                FoundMonth.push(capitalizedMonth);
            }
        });

        const yearPattern = /\b(19|20)\d{2}\b/g;
        let yearmatch;

        while ((yearmatch = yearPattern.exec(fileInputValue)) !== null) {
            const year = parseInt(yearmatch[0]);
            FoundYear.push(year);
        }

        const regex = /\((.*?)\)/g;
        let match;

        while ((match = regex.exec(fileInputValue)) !== null) {
            const abbreviation = match[1].toLowerCase();
            if (languageMap[abbreviation]) {
                FoundLanguages.push(languageMap[abbreviation]);
            }
        }

        fileFormats.forEach(format => {
            if (fileInputValue.includes(format)) {
                FoundFileFormats.push(format.toUpperCase());
            }
        });

        // Issue number patterns
    const numberPattern = /\b\d{3,}\b/g;     // At least 3 digits
    const hashPattern = /#(\d+)/g;           // Digits after #
    const issuePattern = /Issue\s+(\d+)/gi;  // Digits after Issue

    function formatIssueNumber(number) {
        return number.padStart(3, '0');
    }

    function isValidIssue(number) {
        const num = parseInt(number);
        return !FoundYear.includes(num);
    }

    while ((match = numberPattern.exec(fileInputValue)) !== null) {
        const number = match[0];
        if (isValidIssue(number)) {
            Issue.push(formatIssueNumber(number));
        }
    }

    while ((match = hashPattern.exec(fileInputValue)) !== null) {
        const number = match[1];
        if (isValidIssue(number)) {
            Issue.push(formatIssueNumber(number));
        }
    }

    while ((match = issuePattern.exec(fileInputValue)) !== null) {
        const number = match[1];
        if (isValidIssue(number)) {
            Issue.push(formatIssueNumber(number));
        }
        }

        Issue = [...new Set(Issue)];

        if (FoundMonth.length > 0 && FoundYear.length > 0) {
            FullTitle = Title + " (" + FoundMonth.join(", ") + " " + FoundYear.join(", ") + ")";
            document.getElementById('remaster').checked = !document.getElementById('remaster').checked;
            document.getElementById('remaster_true').classList.remove('hidden');
            $("#remaster_year").val(FoundYear.join(", "));
        } else if (FoundYear.length > 0) {
            FullTitle = Title + " (" + FoundYear.join(", ") + ")";
            document.getElementById('remaster').checked = !document.getElementById('remaster').checked;
            document.getElementById('remaster_true').classList.remove('hidden');
            $("#remaster_year").val(FoundYear.join(", "));
        } else {
            FullTitle = Title;
        }

        $("#release_title").val(FullTitle);

        if (FoundLanguages.length > 0) {
            const detectedLanguage = FoundLanguages[0];
            $("#language").val(detectedLanguage);
        } else {
            $("#language").val('English');
        }

        if (FoundFileFormats.length > 0) {
            const detectedFormat = FoundFileFormats[0];
            $("#format").val(detectedFormat);
        }

        if (Issue.length > 0) {
            const detectedIssue = Issue[0];
            $("#issue").val(detectedIssue);
        }
    }

    $("#file").on('change', function() {
        if ($("#categories").val() === 'E-Books') {
            performScript();
        }
    });

})();