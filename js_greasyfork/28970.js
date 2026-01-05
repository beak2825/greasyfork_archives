// ==UserScript==
// @name        	AITL Parser
// @namespace   	DreadCast
// @include     	https://www.dreadcast.eu/Main
// @grant       	none
// @author 			Kmaschta
// @date 			15/04/2017
// @version 		1.1
// @description 	Parse les corporations de l'AITL
// @compat 			Firefox, Chrome
// @require      	http://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/28970/AITL%20Parser.user.js
// @updateURL https://update.greasyfork.org/scripts/28970/AITL%20Parser.meta.js
// ==/UserScript==

// 1.1: Rend les colonnes des chiffress formatées comme des nombres

jQuery.noConflict();

const download = function(data) {
    const blobName = 'corporations_aitl.csv';
    const fakeLink = document.createElement('a');
    fakeLink.style.display = 'none';
    document.body.appendChild(fakeLink);

    fakeLink.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(data));
    fakeLink.setAttribute('download', blobName);
    fakeLink.click();
};

const getCurrentDate = function() {
    const now = new Date();
    const year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();

    if (month < 10) { month = "0" + month; }
    if (day < 10) { day = "0" + day; }

    return [year, month, day].join('-');
};

const initialize = function() {
    const corporationTitle = $('.aitl .corporations .titre')[0];
    const downloadButton = $('<button>Download</button>');

    downloadButton.click(function() {
        const corporations = [];
        const rows = $('.aitl .corporations tbody tr');

        rows.each(function(i, row) {
            if (i === 0) return;

            const [rank, title, ca, capital, employee] = $(row).text().trim().split(/[\t\r\n]+/);
            corporations.push({ rank, title, ca, capital, employee });
        });

        const now = new Date();
        const date = getCurrentDate();
        const head = 'Date, Rang, Nom, Chiffre, Capital, Employés\n';
        const rowsString = corporations.map(function(corpo) {
            return date + ',"'+
                corpo.rank +'","'+
                corpo.title.replace('"', '\\"') +'",="'+
                corpo.ca +'",="'+
                corpo.capital +'","'+
                corpo.employee +'"';
        });

        download(head + rowsString.join('\n'));
    });

    downloadButton.appendTo(corporationTitle);
};

$(document).ready(function() {
    console.log('AITL Parser on');

    $(document).ajaxComplete(function(evt, xhr, options) {
        if(/ItemAITL\/Corporation\/Find/.test(options.url)) {
            initialize();
        }
    });
});