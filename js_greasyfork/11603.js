// ==UserScript==
// @name           LibraryThing Work Editions Grid
// @namespace      https://greasyfork.org/en/users/14131-brightcopy-edited
// @description    Changes the editions display on the work pages to a sortable grid.
// @include        http*://*.librarything.tld/work/*/editions*
// @include        http*://*.librarything.com/work/*/editions*
// @license        Public Domain
// @version        5
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/11603/LibraryThing%20Work%20Editions%20Grid.user.js
// @updateURL https://update.greasyfork.org/scripts/11603/LibraryThing%20Work%20Editions%20Grid.meta.js
// ==/UserScript==
 
// start: translate only this section
var TRANSLATE_TITLE = 'Title';
var TRANSLATE_AUTHOR = 'Author';
var TRANSLATE_ISBN = 'ISBN';
var TRANSLATE_NUMBER = '#';
var TRANSLATE_MULTI_SORT_HINT = 'Click to allow sorting on multiple columns';
var TRANSLATE_MEDIA = 'Media';
var TRANSLATE_ENTRY = 'Entry'
// end: translate only this section

var SORT_ASCENDING = 0;
var SORT_DESCENDING = 1;

// ISBN of this book
var bookISBN;
try {
    bookISBN = document.body.getElementsByClassName('Z3988')[0].getAttribute('title').match(/rft\.isbn=([^&]+)/)[1];
} catch (e) {}

// creates an editionsDiv table
var editionsDiv = document.getElementById('editions');
var workSimpleHead = document.getElementsByClassName("navInfoTitle")[0].parentNode;
var gridDiv = document.getElementById('ltwegMain');
var byAuthorDiv = document.getElementById('ltwegAuthor');
var byTitleDiv = document.getElementById('ltwegTitle');
var groupedDiv = document.getElementById('ltwegGrouped');

var editionsList = [];
var tableBodyDiv;

var FIELD_MEDIA = 0;
var FIELD_TITLE = 1;
var FIELD_AUTHOR = 2;
var FIELD_ISBN = 3;
var FIELD_COPIES = 4;
var FIELD_ENTRY = 5;

var fields = [
    // translate: if translating, translate only the "label" value to your language
    {name:"Media", label:TRANSLATE_MEDIA, direction:SORT_DESCENDING, sortField:"Media"},
    {name:"Title", label:TRANSLATE_TITLE, direction:SORT_ASCENDING, sortField:"ntitle"},
    {name:"Author", label:TRANSLATE_AUTHOR, direction:SORT_ASCENDING, sortField:"nauthor"},
    {name:"ISBN", label:TRANSLATE_ISBN, direction:SORT_ASCENDING, sortField:"nISBN"},
    {name:"Copies", label:TRANSLATE_NUMBER, direction:SORT_DESCENDING, sortField:"Copies"},
    {name:"EntryFormat", label:TRANSLATE_ENTRY, direction:SORT_DESCENDING, sortField:"EntryFormat"}
];

var sorts = [
    FIELD_COPIES,
    FIELD_TITLE,
    FIELD_AUTHOR,
    FIELD_ISBN, 
    FIELD_MEDIA, 
    FIELD_ENTRY
];

var multisort;

function setEditionStyles() {
    GM_addStyle('.ltwegHeader { text-align:left; border-bottom: 1px solid black; }');

    GM_addStyle('#ltwegEditionsTable td, #ltwegEditionsTable th { padding-left:1em; text-indent:-1em; padding-right: 1em }');
    GM_addStyle('#ltwegEditionsTable.multisort td, #ltwegEditionsTable th { padding-left:1em; text-indent:-1em; padding-right: 1em }');

    GM_addStyle('.ltwegCopies { min-width:20px }');

    GM_addStyle('.ltwegDup { color:#999999 }');
    GM_addStyle('.ltwegRow5 { border-bottom:1px solid #B0B0B0 }');

    GM_addStyle('#ltwegHeaderMultisort { text-align:center } ');
    GM_addStyle('.ltwegHeader { white-space: nowrap } ');

    GM_addStyle('#ltwegHeaderMultisortLink { display:inline-block; width:16px; height:16px; vertical-align:middle; ' +
        'background:url("http://www.librarything.com/pics/c.png") no-repeat scroll -102px 0px transparent; }');

    GM_addStyle('.ltwegMultisortChecked { background-position:-119px 0px !important }');

    GM_addStyle('.ltwegSeparate { display:inline-block; width:20px; height:16px; vertical-align:middle; ' +
        'background:url("http://www.librarything.com/pics/c.png") no-repeat scroll -21px -180px transparent; }');

    GM_addStyle('#ltwegHeaderBody td a:visited, #ltwegHeaderBody a:link { color:black !important }');
    GM_addStyle('#ltwegHeaderBody td.ltwegDup a:visited, #ltwegHeaderBody td.ltwegDup a:link { color:#999999 !important }');

    GM_addStyle('#ltwegEditionsTable tr.selected { background: #AF9 }');
}

function parseEditions() {
    var editionRE = /(<span class="formatnotice">[^<]*<\/span> \u2014 )?(.*?) <span class="copies">\((<span[^>]*>)?(.*?)onclick="c_sw\((\d+),(\d+).*$/;
    /* editionRE examples / explanations:
       editionRE[1] = <span class="formatnotice">Video Recording</span> — 
       editionRE[2] = Title / Author / ISBN / Manual entry (with HTML and possible absent Author & ISBN & Manual entry)
       editionRE[3] = <span class="trans" id="..."> (parenthesized to add the ? after it)
       editionRE[4] = # of copies (or "no copies")
       editionRE[5] = separation number for edition
       editionRE[6] = separation number for work
    */

    // Make an array of the editions. They each end in <br>
    var editions = editionsDiv.innerHTML.split("<br>");

    for ( i=0 ; i < editions.length - 1; i++ ) { // -1 because the last one's going to be nothing/whitespace following the last <br>

      var matchedEdition = editions[i].match(editionRE);
      
      // Get "Video recording" or whatever (leave blank if doesn't exist)
      var media = matchedEdition[1] !== undefined ? matchedEdition[1] : "";
      media = media.replace(/^[^>]*>/, "").replace(/<.*$/,"").replace(/ /g, "&nbsp;");

      // Setting up some variables
      var author = ISBN = entryFormat = "";
      var editionData = editions[i].match(editionRE)[2].split('<span class="divider">/</span>');
      
      // The title should be the first item in the "editionData" array
      var title = editionData[0];

      // Check if there's an entry format (e.g. Manual Entry), which gets surrounded by a <span ... class="trans"> on the non-English sites
      var tempLastIndex = editionData[editionData.length - 1];
      var inTagRE = /^<[^>]+>([^<]*)<\/[span]+>/; 
      if (tempLastIndex == "Manual Entry") { // What to do for other text?
        entryFormat = tempLastIndex;
      } else if (inTagRE.test(tempLastIndex)) { // <span class="trans">Entrada manual</span> or <a href="#">ISBN Record</a>, for example
        entryFormat = tempLastIndex.match(inTagRE)[1];
      }
      entryFormat = entryFormat.replace(/ /g, "&nbsp;");
      
      // Check if there's an ISBN
      if (entryFormat != "") { editionData.splice(-1, 1) } // Remove any entry format from the array
      var isbnMatch = false;
      var isbnMatch = editionData[editionData.length - 1].match(/^ISBN (\d{9,10}X?)$/);
      if (isbnMatch) {
        ISBN = isbnMatch[1];
        editionData.splice(-1, 1); // Remove the ISBN from the array
      }
      
      // Check if there's an author
      author = editionData.length > 1 ? editionData[editionData.length - 1] : "";
      
      // Get the number of copies
      var copies = parseInt(matchedEdition[4]) || 0;

      // Get the numbers needed for separation
      var separate = [matchedEdition[5], matchedEdition[6]];
      
      // If media format or entry format don't exist, use "(default)"
      if (media == "") media = "<i>(default)</i>";
      if (entryFormat == "") entryFormat = "<i>(default)</i>";

      var edition = {Copies:copies, ntitle:normalize(title), nauthor:normalize(author), nISBN:normalize(ISBN), separate:separate, Media:media, EntryFormat:entryFormat};
      
      edition.ISBNraw = ISBN;
      
        if (ISBN != '') {
            ISBN = '<a href="/search.php?search=' + ISBN + 
                '&searchtype=media&searchtype=media&sortchoice=0">' + ISBN + '</a>';
        }

        if (title != '') {
            title = '<a href="/search.php?search=' + ltSearchEscape(title) + 
                '&searchtype=worktitles&searchtype=worktitles&sortchoice=0">' + title + '</a>';
        }

        if (author != '') {
            author = '<a href="/search.php?search=' + ltSearchEscape(author) + 
                '&searchtype=authorname&searchtype=authorname&sortchoice=0">' + author.replace(" ", "&nbsp;") + '</a>'; // nbsp to prevent most author wrapping
        }

        edition.Title = title;
        edition.Author = author;
        edition.ISBN = ISBN;

        editionsList.push(edition);
    }
}

function normalize(value) {
    if (value == null) {
        return ''
    }
    else {
        return value.toLowerCase().replace(/[^a-z0-9]/g, "");
    }
}

function editionsCompareWrap(b1, b2) {
    var result = editionsCompare(b1, b2);

    return result;
}

function editionsCompare(b1, b2) {
    for (var i = 0; i < (multisort && multisortChecked() ? sorts.length : 1); i++) {
        var field = fields[sorts[i]];
        if (b1[field.sortField] < b2[field.sortField]) {
            if (field.direction == SORT_ASCENDING) {
                return -1
            }
            else //if (field.direction == SORT_DESCENDING)
            {
                return 1
            }
        }
        else if (b1[field.sortField] > b2[field.sortField]) {
            if (field.direction == SORT_ASCENDING) {
                return 1
            }
            else //if (field.direction == SORT_DESCENDING)
            {
                return -1
            }
        }
    }

    return 0;
}

function buildEditionsTable() {
    var i;
    var html = '<table style="border-collapse: collapse; min-width:80%" id="ltwegEditionsTable">' +
        '<thead><tr>';

    for (i = 0; i < fields.length; i++) {
        var field = fields[i];

        html +=
            '<th class="ltwegHeader ltweg' + field.name + '">' +
                '<a id="ltwegHeaderLink' + i + '" class="ltwegHeaderLinkSort" href="javascript:return false;">' +
                field.label +
                '<sup> </sup>' +
                '<sup class="ltwegSortArrow">' +
                '<img id="ltwegSortArrow' + i + '" src="" style="display:none">' +
                '</sup>' +
                '<sup id="ltwegHeaderSup' + i + '" style="display:none"> </sup>' +
                '</a>' +
                '</th>'
    }

    html +=
        '<th class="ltwegHeader" id="ltwegHeaderMultisort">' +
            '<a id="ltwegHeaderMultisortLink" href="javascript:return false;" title="' + TRANSLATE_MULTI_SORT_HINT + '"></a>' +
            '</th>';

    html += '</tr></thead><tbody id="ltwegHeaderBody"></tbody></table>';

    editionsDiv.style.display = 'none';
    gridDiv = document.createElement('div');
    editionsDiv.parentNode.appendChild(gridDiv);
    gridDiv.innerHTML = html;

    var span = document.createElement('span');
    workSimpleHead.appendChild(span);
    span.style.cssFloat = 'right';
    span.style.fontWeight = 'normal';

    var gridLink = document.createElement('a');
    gridLink.setAttribute('href', '#');
    gridLink.appendChild(document.createTextNode('grid'));
    span.appendChild(gridLink);

    span.appendChild(document.createTextNode(' | '));

    var originalLink = document.createElement('a');
    originalLink.setAttribute('href', '#');
    originalLink.appendChild(document.createTextNode('original'));
    span.appendChild(originalLink);
    gridLink.style.fontWeight = 'bold';
    
    gridLink.addEventListener('click', function (e) {
        gridLink.style.fontWeight = 'bold';
        originalLink.style.fontWeight = 'normal';
        originalLink.style.display = '';
        editionsDiv.style.display = 'none';
        gridDiv.style.display = '';
        e.preventDefault();
    }, false);
    originalLink.addEventListener('click', function (e) {
        gridLink.style.fontWeight = 'normal';
        originalLink.style.fontWeight = 'bold';
        editionsDiv.style.display = '';
        gridDiv.style.display = 'none';
        e.preventDefault();
    }, false);

    tableBodyDiv = document.getElementById('ltwegHeaderBody');

    document.getElementById('ltwegHeaderLink0').addEventListener('click', function (e) {
        doHeaderClick(e, 0)
    }, false);
    document.getElementById('ltwegHeaderLink1').addEventListener('click', function (e) {
        doHeaderClick(e, 1)
    }, false);
    document.getElementById('ltwegHeaderLink2').addEventListener('click', function (e) {
        doHeaderClick(e, 2)
    }, false);
    document.getElementById('ltwegHeaderLink3').addEventListener('click', function (e) {
        doHeaderClick(e, 3)
    }, false);
    document.getElementById('ltwegHeaderLink4').addEventListener('click', function (e) {
        doHeaderClick(e, 4)
    }, false);
    document.getElementById('ltwegHeaderLink5').addEventListener('click', function (e) {
        doHeaderClick(e, 5)
    }, false);

    multisort = document.getElementById('ltwegHeaderMultisortLink');
    multisort.addEventListener('click', doMultisortClick, false);

    syncArrows();

    buildEditions();
}

function buildEditions() {
    editionsList.sort(editionsCompareWrap);

    var selectedISBN = (window.location.search.match(/isbn=([^&]+)/) || []).pop();
    if (selectedISBN === undefined) {
        selectedISBN = bookISBN;
    }

    var html = '';
    var anchored = false;

    var lastClass = 'ltwegEven';
    for (var i = 0; i < editionsList.length; i++) {
        var edition = editionsList[i];

        html += '<tr class="' + ((edition.ISBNraw === selectedISBN) ? 'selected ' : '') +
            (edition.thisBook ? 'thisbook ' : '') + ((editionsList.length > 9) &&
            (i % 5 == 4) ? 'ltwegRow5' : '') + '">';

        for (var f = 0; f < fields.length; f++) {

            var field = fields[f];

            html += '<td' + (isDup(i, field) && f != FIELD_COPIES ? ' class="ltwegDup"' : '') + '>';

            if (edition.ISBNraw === selectedISBN && !anchored && window.location.search !== '') {
                html += '<a name="grid"></a>';
                anchored = true;
            }
            
            html += edition[field.name] + '</td>';
        }

        html += '<td class="' + lastClass + '"></a><a href="/work_separate.php?book=' +
            edition.separate[0] + '&work=' + edition.separate[1] + '"><span class="ltwegSeparate"></span></a></td>';

        html += '</tr>';
    }

    tableBodyDiv.innerHTML = html;

    if (anchored) {
        window.location.hash = '#grid';
    }
}

function isDup(i, field) {
    return i != 0 && editionsList[i][field.sortField] == editionsList[i - 1][field.sortField];
}

function multisortChecked() {
    return multisort.className != '';
}

function doMultisortClick(e) {
    stopBubbling(e);

    var isMultisort = !multisortChecked();  // about to flip
    multisort.className = isMultisort ? 'ltwegMultisortChecked' : '';

    syncArrows();
}

function syncArrows() {
    var isMultisort = multisortChecked();  // about to flip

    for (i = 0; i < fields.length; i++) {
        var sup = document.getElementById('ltwegHeaderSup' + i);
        sup.style.display = isMultisort ? '' : 'none';
        setTextContent(sup, sorts.indexOf(i) + 1);

        var arrow = document.getElementById('ltwegSortArrow' + i);

        arrow.style.display = (isMultisort || sorts[0] == i) ? '' : 'none';

        arrow.src = (fields[i].direction == SORT_ASCENDING) ?
            'http://static.librarything.com/pics/sort-up.gif'
            : 'http://static.librarything.com/pics/sort-down.gif';
    }
}

function doHeaderClick(e, clickedIndex) {
    stopBubbling(e);

    var isMultisort = multisortChecked();

    if (isMultisort && sorts[sorts.length - 1] == clickedIndex || !isMultisort && sorts[0] == clickedIndex) {
        fields[clickedIndex].direction =
            (fields[clickedIndex].direction == SORT_ASCENDING ? SORT_DESCENDING : SORT_ASCENDING)
    }
    else {
        for (var i = 0; i < sorts.length; i++) {
            if (sorts[i] == clickedIndex) {
                sorts.splice(i, 1);
                break;
            }
        }

        if (isMultisort) {
            sorts.push(clickedIndex)
        }
        else {
            fields[clickedIndex].direction = SORT_ASCENDING;
            sorts.unshift(clickedIndex);
        }
    }

    syncArrows();

    buildEditions();

    return false;
}

function stopBubbling(e) {
    if (!e) {
        e = window.event;
    }

    e.cancelBubble = true;
    if (e.stopPropagation) {
        e.stopPropagation();
    }
}

function setTextContent(node, text) {
    if (node.innerText) {
        node.innerText = text
    }
    else if (node.textContent) {
        node.textContent = text;
    }
}

function ltSearchEscape(s) {
    return encodeURIComponent(unescapeHTML(s))
        .replace(/%20/g, '+')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29');
}

function unescapeHTML(s) {
    return s
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
}


try {
    if (editionsDiv && workSimpleHead && !gridDiv) {
        setEditionStyles();
        parseEditions();
        buildEditionsTable();
    }
} catch (err) {
    console.log(err);
}