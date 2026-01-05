// ==UserScript==
// @name            BIB :: Amazon
// @namespace       BIB_Amazon
// @version         0.6.0
// @description     Search, Request and Upload from Amazon
// @grant           GM_deleteValue
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_xmlhttpRequest
// @connect         amazon.*
// @connect         *
// @include         http*://www.amazon.*/*/dp/*
// @include         http*://www.amazon.*/dp/*
// @include         http*://www.amazon.*/gp/*
// @include         http*://www.amazon.*/s/*
// @include         http*://bibliotik.me/upload/ebooks*
// @include         http*://bibliotik.me/requests/create/ebooks*
// @include         http*://redacted.ch/upload.php
// @include         http*://redacted.ch/requests.php*
// @include         http*://brokenstones.club/upload.php
// @require         https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/27751/BIB%20%3A%3A%20Amazon.user.js
// @updateURL https://update.greasyfork.org/scripts/27751/BIB%20%3A%3A%20Amazon.meta.js
// ==/UserScript==

// 0.6.0 
//   - Added another amazon book url
//   - Replaced WCD with RED
//   - Fixed RED upload
//   - Added RED create request & request search
//   - Fixed not getting page count from books on amazon.com.mx
//   - If page count not found, now shows 0 instead of gibberish  
//
// Known issues
//   - BS upload form fill doesn't work

var bookLanguage = 'English';

var authors = [],
    contributors = [],
    editors = [],
    translators = [];

var debug = true,
    uploadRED = true,
    uploadBS = false;

var windowHostname = window.location.hostname,
    windowLocation = window.location.toString();

// MARK: Helper functions

// Scrape Amazon
// https://gist.github.com/destroytoday/6706265

(function ($) {
    // text with line breaks
    // http://stackoverflow.com/questions/22678446/how-to-keep-line-breaks-when-using-text-method-for-jquery
    $.fn.innerText = function (msg) {
        if (msg) {
            if (document.body.innerText) {
                for (var i in this) {
                    this[i].innerText = msg;
                }
            } else {
                for (var i in this) {
                    this[i].innerHTML.replace(/&amp;lt;br&amp;gt;/gi, "n").replace(/(&amp;lt;([^&amp;gt;]+)&amp;gt;)/gi, "");
                }
            }
            return this;
        } else {
            if (document.body.innerText) {
                return this[0].innerText;
            } else {
                return this[0].innerHTML.replace(/&amp;lt;br&amp;gt;/gi, "n").replace(/(&amp;lt;([^&amp;gt;]+)&amp;gt;)/gi, "");
            }
        }
    };
}(jQuery));

jQuery.expr[':'].regex = function (elem, index, match) {
    var matchParams = match[3].split(','),
        validLabels = /^(data|css):/,
        attr = {
            method: matchParams[0].match(validLabels) ?
                matchParams[0].split(':')[0] : 'attr',
            property: matchParams.shift().replace(validLabels, '')
        },
        regexFlags = 'ig',
        regex = new RegExp(matchParams.join('').replace(/^s+|s+$/g, ''), regexFlags);
    return regex.test(jQuery(elem)[attr.method](attr.property));
};

function ContainsAny(str, items) {
    for (var i in items) {
        var item = items[i];
        if (str.indexOf(item) > -1) {
            return true;
        }
    }
    return false;
}

var decodeEntities = (function () {
    // this prevents any overhead from creating the object each time
    var element = document.createElement('div');

    // regular expression matching HTML entities
    var entity = /&(?:#x[a-f0-9]+|#[0-9]+|[a-z0-9]+);?/ig;

    return function decodeHTMLEntities(str) {
        // find and replace all the html entities
        str = str.replace(entity, function (m) {
            element.innerHTML = m;
            return element.textContent;
        });

        // reset the value
        element.textContent = '';

        return str;
    };
}());

// MARK: Start

function toolbarLink(title, link, className) {
    if (className) {
        return ' <a target="_blank" class="' + className + '" href="' + link + '">' + title + '</a>';
    } else {
        return ' <a target="_blank" href="' + link + '">' + title + '</a>';
    }
}

function addToolbar(title, author) {
    var toolbar = '<span id="bibtoolbar"><br/>Bib: ';
    toolbar += toolbarLink('Title', searchBibliotik(title, author));
    toolbar += toolbarLink('Author', searchBibliotikAuthor(author));
    toolbar += toolbarLink('Requests', searchBibliotikRequests(title, author));
    toolbar += ' |' + toolbarLink('Request', 'https://bibliotik.me/requests/create/ebooks', 'bib');
    toolbar += toolbarLink('Upload', 'https://bibliotik.me/upload/ebooks', 'bib');
    if (uploadRED) {
        toolbar += '<br/>RED: ';
        toolbar += toolbarLink('Title', searchRED(author, title));
        toolbar += toolbarLink('Author', searchRED(author));
        toolbar += toolbarLink('Requests', searchREDRequests(author, title));
        toolbar += ' |' + toolbarLink('Request', 'https://redacted.ch/requests.php?action=new', 'RED');
        toolbar += toolbarLink('Upload', 'https://redacted.ch/upload.php', 'RED');
    }
    if (uploadBS) {
        toolbar += '<br/>BrokenStones: ';
        toolbar += toolbarLink('Title', searchBS(author, title));
        toolbar += toolbarLink('Author', searchBS(author));
        toolbar += ' |' + toolbarLink('Upload', 'https://brokenstones.club/upload.php', 'BS');
    }
    toolbar += '<br/><span class="search1">Search:</span>';
    if (windowHostname === 'www.amazon.fr') {
        toolbar += toolbarLink('Gallimard', searchGallimard(title, author));
        toolbar += toolbarLink('pretnumerique.ca', 'http://banq.pretnumerique.ca/resources?utf8=%E2%9C%93&q=' +
            title + ' ' + author);
    } else {
        toolbar += toolbarLink('BN', searchBN(title, author));
        toolbar += toolbarLink('GoodReads', searchGoodReads(title, author));
    }
    if (windowHostname === 'www.amazon.it') {
        toolbar += toolbarLink('MLOL', 'http://www.medialibrary.it/media/ricerca.aspx?&keywords=' +
            title + ' ' + author + '&portalId=1&seltip=330');
    }
    if (windowHostname !== 'www.amazon.fr') {
        toolbar += toolbarLink('OD', searchOverDrive(title, author));
    }
    toolbar += toolbarLink('WorldCat', searchWorldCat(title, author));
    toolbar += '</span>';
    // '<span id="axis" style="display:none"><br/>Axis 360: </span>';

    var toolbarPlace = $('#rightCol');
    if (!toolbarPlace) {
        toolbarPlace = $('#tafContainerDiv');
    }
    if (toolbarPlace.length && $('#buybox').length) {
        console.log('TOOLBAR: old layout');
        toolbarPlace.prepend('<div id="tellAFriendBylineBox_feature_div" class="feature a-section a-text-center a-spacing-small">' + toolbar + '</div>');
    } else {
        // new layout
        console.log('TOOLBAR: new layout');
        toolbarPlace = $('#tellAFriendBylineBox_feature_div');
        toolbarPlace.prepend(toolbar);
    }
}

function amazonBookPage() {
    var mainTitle = getMainTitle(),
        mainAuthor = getMainAuthor();

    var titleHeader = $('span.a-size-medium.a-color-secondary.a-text-normal:last');
    var kindleHeader = $('span.a-size-large.a-color-secondary.a-text-normal');

    var language = $('li:contains("Language:"), li:contains("Langue"), li:contains("Sprache:"), li:contains("Idioma:"), li:contains("Lingua:")');
    if (language) {
        language = language.text().split(': ')[1];
        console.log('Language: ' + language);
        bookLanguage = language;
    }

    // after language
    addToolbar(mainTitle, mainAuthor);

    if (titleHeader.length) {
        bibMatches(mainTitle, mainAuthor, titleHeader);
    } else {
        bibMatches(mainTitle, mainAuthor, kindleHeader);
    }

    if (debug) {
        getBookInfo(false);
        //printInfo();
    }

    // Expand description
    let seeAll = $('#bdSeeAllPrompt');
    if (seeAll) {
        seeAll.click()
    }

    $(document.body).on("click", ".bib", {save: true}, getBookInfo);
    $(document.body).on("click", ".RED", {save: true}, getBookInfo);

    $('a.a-link-normal').attr('target', '_self'); // remove _blank from default links [href$=amazon]

    $('li.a-carousel-card').each(function () {
        var titleItem = $(this).find('div.p13n-sc-truncated');
        var title = titleItem.text().trim();
        title = mainTitleText(title);

        var authorItem = $(this).find('div.a-row.a-size-small:first');
        var author = authorItem.text().trim();
        // author = getMainAuthor(author);

        console.log('Searching: ' + title + ' / ' + author);
        // bibMatches(title, author, titleItem);

        titleItem.find('a').attr('target', '_blank');

        authorItem.append('<br/>' +
            '<a style="color:gray" target="_blank" href="' + searchBibliotik(title, author) + '">Bib</a>' +
            ' <a style="color:gray" target="_blank" href="' + searchBibliotikAuthor(author) + '">auth</a>');
    });

}

function amazonSearch() {
    $('div.s-item-container').each(function () {
        var image = $(this).find('div.a-row').find('div.a-fixed-left-grid-col.a-col-left').find('img.s-access-image');
        var imageUrl = image.attr('src').split('_')[0] + 'jpg';

        var anchor = $(this).find('div.a-row').find('a');
        anchor.attr('href', imageUrl);
        anchor.attr('target', '_blank');
    });
}

function bibMatches(title, author, insertionPoint) {
    var searchUrl2 = '';
    var searchUrl1 = 'https://bibliotik.me/torrents/?search=' + quoteWords(title);
    if (author.length) {
        searchUrl2 = '+%40creators+' + author + '&retail=retail' + searchBibliotikLanguage();
    }
    var searchUrl3 = ''; // '+%40publishers+Penguin';  // TODO, publishers?

    GM_xmlhttpRequest({
        method: "GET",
        url: searchUrl1 + searchUrl2 + searchUrl3,
        onload: function (response) {
            var responseObject = $(response.responseText);
            var results = $('td.pagination:first', responseObject).text().match(/\d/);
            if (results) {
                insertionPoint.append(' (' + results + ')');
            } else {
                insertionPoint.append(' (0)');
                insertionPoint.css({'color': 'red'});
            }
            // TODO: add class
        }
    });
}

function fixAuthors(authors) {
    authors = $.map(authors, function (author) {
        return author.replace("Dr. ", "")
            .replace(", MD", "")
            .replace(", Ph.D.", "")
            .replace(" Ph.D.", "")
            .replace(" USA Inc.", "");
    });
    return authors;
}

function getAuthors() {
    // reset arrays
    authors.length = 0;
    editors.length = 0;
    contributors.length = 0;
    translators.length = 0;

    var authorStrings = ["Author", "Auteur", "Autore", "Autor", "作者"];
    var editorStrings = ["ditor", "Editeur", "Sous la direction", "cura", "Herausgeber", "编者"];
    var translatorStrings = ["Translator", "Traduction", "Traduttore", "Traductor", "Übersetzer"];

    $('span.author > a').add('span.a-declarative > a.a-link-normal.contributorNameID').filter(function () {
        var currentAuthor = $(this).text().trim();

        var role;
        var roles;
        if ($(this).next('span').length === 0) {
            roles = $(this).parent().next().text().trim();
            roles = roles.replace('(', '').replace(')', '').split(', ');
        } else {
            roles = $(this).next().text().trim();
            roles = roles.replace('(', '').replace(')', '').split(', ');
        }

        if (roles) {
            roles.forEach(function (role) {
                console.log('Author role: ' + currentAuthor + ' ' + role);
                if (ContainsAny(role, authorStrings)) {
                    authors.push(currentAuthor);
                    return (false);
                }
                if (ContainsAny(role, editorStrings)) {
                    editors.push(currentAuthor);
                    return (false);
                }
                if (ContainsAny(role, translatorStrings)) {
                    translators.push(currentAuthor);
                    return (false);
                }
                // if not in any other.
                contributors.push(currentAuthor);
                return (false);
            });
        } else {
            authors.push(currentAuthor);
        }
    });
    authors = fixAuthors(authors);
    editors = fixAuthors(editors);
    contributors = fixAuthors(contributors);
    translators = fixAuthors(translators);
    console.log("Authors: " + authors.join(", "));
    console.log("Editors: " + editors.join(", "));
    console.log("Contributors: " + contributors.join(", "));
    console.log("Translators: " + translators.join(", "));
}

function getDescription() {
    var description = $('#bookDesc_override_CSS').next().text();

    console.log(description);

    description = description
        .replace('  ', ' ')
        .replace(/<[^\/>][^>]*><\/[^>]+>/g, "")
        .replace(/<P.*?>/g, "<p>")
        .replace(/<p.*?>/g, "<p>")
        .replace(/<p>\s*/g, "<p>")
        .replace(/<i>\s*<p>/gi, '<p><i>')
        .replace(/<p>(.*?)<\/p>/g, "\n\n$1")
        .replace(/<div>(.*?)<\/div>/g, "$1")
        .replace(/<i> <br>/gi, "<br><i>")
        .replace(/<b>(.*?)<\/b>/gi, "[b]$1[/b]")
        .replace(/<i>(.*?)<\/i>/gi, "[i]$1[/i]")
        .replace(/<cite>(.*?)<\/cite>/g, "[i]$1[/i]")
        .replace(/<em>(.*?)<\/em>/gi, "[i]$1[/i]")
        .replace(/<h2>(.*?)<\/h2>/g, "\n\n$1")
        .replace(/<h3>(.*?)<\/h3>/g, "\n\n$1")
        .replace(/<em>\s*<\/em>/gi, " ")
        .replace(/<b>\s*<\/b>/gi, " ")
        .replace(/<i>\s*<\/i>/gi, " ")
        .replace(/<\/i><i>/gi, "")
        .replace(/<\/b><b>/gi, "")
        .replace(/<\/i>\s*<i>/gi, " ")
        .replace(/<\/b>\s*<b>/gi, " ")
        .replace(/<\/p>\s*<p>/gi, "\n\n")
        .replace(/<div>\s*<p>/gi, "")
        .replace(/<\/div>/gi, "")
        .replace(/<span class="h\d+">(.*?)<\/span>/g, "\n$1")
        .replace(/<ul>\s*<li>/gi, "\n\n• ")
        .replace(/<\/li>\s*<li>/gi, "\n• ")
        .replace(/<\/li>\s*<\/ul>/gi, "\n")
        .replace(/<ul>(.*?)<\/ul>/g, "\n$1")
        .replace(/<ul>\s*/g, "")
        .replace(/<ol>/gi, "\n")
        .replace(/<li>/gi, "\n• ")
        .replace(/<p\/>/gi, "")
        .replace(/<\/p><br> <br><p>/gi, "\n\n")
        .replace(/<br>/gi, "\n")
        .replace(/<br\/>/gi, "\n")
        .replace(/<p>/gi, "\n")
        .replace(/<div>/gi, "")
        .replace(/<blockquote>/gi, "")
        .replace(/<\/blockquote>/gi, "")
        .replace(/<br\s\/>/gi, "\n")
        .replace(/<b> /gi, " [b]")
        .replace(/<b>/gi, "[b]")
        .replace(/ <\/b>/gi, "[/b] ")
        .replace(/<\/b>/gi, "[/b]")
        .replace(/<strong>/gi, "[b]")
        .replace(/<\/strong>/gi, "[/b]")
        .replace(/<em>/gi, "[i]")
        .replace(/<\/em>/gi, "[\/i]")
        .replace('[b] [/b]', '')
        .replace('[/b][b]', '')
        .replace('[i] [/i]', '')
        .replace('[i][/i]', '')
        .replace('[i]From the Trade Paperback edition.[/i]', '')
        .replace('[i]From the Hardcover edition.[/i]', '')
        .replace(/\s*\n/gim, '\n')
        .replace(/\n\[\/i]/g, '[/i]\n')
        .replace(/\n\s*\n/gim, '\n\n')
        .replace(/\n\s*\n\s*\n/gim, '\n\n')
        .trim();
    description = description.replace(/<(?:.|\s)*?>/g, "");
    description = decodeEntities(description);

    // spanish
    var publisher = getPublisher();
    if (publisher.length) {
        if (publisher.indexOf('Nowtilus') > -1 || publisher.indexOf('Tombooktu') > -1) {
            description = description
                .replace(/\[\/i]\n\n\[i]-/g, '[/i]\n[i]-')
                .replace(/\[i]- /g, '[i]• ')
                .replace(/\[\/i]\(/g, '[/i]\n(')
                .replace(/\) \[b]/g, ')\n\n[b]');
        }
    }

    console.log(description);
    return description;
}

function getISBN() {
    var isbn = $('li:contains("ISBN-10: ")').text();
    isbn = isbn.replace("ISBN-10: ", ""); // pop : instead?
    console.log('ISBN: ' + isbn);
    return isbn;
}

function getImageUrl() {
    var imageURL = $("#imgBlkFront");
    if (imageURL.length) {
        imageURL = imageURL.attr('data-a-dynamic-image')
                .match(new RegExp('{"' + "(.*)" + '.jpg'))[1].split(/_(.+)?/)[0] + "jpg";
        return imageURL;
    }

    imageURL = $('#mainImageContainer').find('img').attr('data-a-dynamic-image');
    if (imageURL) {
        imageURL = imageURL.match(new RegExp('{"' + "(.*)" + '.jpg'))[1].split(/_(.+)?/)[0] + "jpg";
        return imageURL;
    }

    imageURL = $('#ebooks-img-canvas');
    if (imageURL) {
        return imageURL.find('img').attr('src');
    }

    imageURL = $('#main-image');
    if (imageURL) {
        console.log('other image'); // debug
        imageURL = imageURL.attr('rel')[1].split(/_(.+)?/)[0] + "jpg";
        return imageURL;
    }
}

function getLanguage() {
    // workaround for Hindi set to English
    if (getTitle().indexOf('(Hindi Edition') > -1) {
        return 'Hindi';
    }

    var language = $('#productDetailsTable').find('li:contains("Language:"), li:contains("Langue"):first, li:contains("Lingua:"), li:contains("Idioma:"), li:contains("Sprache:")');
    if (language.length) {
        language = language.text().split(':')[1].trim();
        console.log('Language: ' + language);
        return language;
    }
    return ''
}

function getPageCount() {
    var pages = $('li:contains(" pages"), li:contains("Lunghezza stampa:"), li:contains("Seitenzahl"), li:contains("Longitud de impresión:"), li:contains("Taschenbuch:"), li:contains(" páginas")');
    if (pages.length) {
        pages = pages.text().match(/(\d+)/);
        if (pages) {
            pages = pages[0];
        }
    }
    if (!pages.length) {
        pages = "0";
    }
    console.log('Pages: ' + pages);
    return pages;
}

function getPublisher() {
    var publisher = $('li:contains("Publisher:"), li:contains("Editeur :"), li:contains("Editor:"), li:contains("Editore:"), li:contains("Editor:"), li:contains("Verlag:")');

    if (!publisher.length) {
        return '';
    }

    var publisherText = publisher.text();

    publisherText = publisherText.split(': ')[1];
    if (publisherText.indexOf("(") >= 0) {
        publisherText = publisherText.substr(0, publisherText.indexOf(' ('));
    }
    if (publisherText.indexOf(";") >= 0) {
        publisherText = publisherText.split(';')[0];
    }
    if (publisherText.indexOf(", Inc.") >= 0) {
        publisherText = publisherText.substr(0, publisherText.indexOf(', Inc.'));
    }

    publisherText = publisherText
        .replace(", Inc.", "")
        .replace(", LLC", "")
        .replace(", UK", "")
        .replace(", USA", "");
    publisherText = publisherText.trim();

    return publisherText;
}

function getTitle() {
    var title = $("#productTitle");

    if (title.length === 0) {
        title = $('#ebooksProductTitle');
    }

    var titleText = title.text().replace(/, (\d+)th Edition/, " ($1th Edition)");
    titleText = titleText
        .replace(' (Spanish Edition)', '')
        .replace(': (Hindi Edition)', '')
        .replace(' (Hindi Edition)', '');
    return titleText;
}

function getYear() {
    var year = $('li:contains("Publisher: "), li:contains("Editor:"), li:contains("Editore:"), li:contains("Editeur"), li:contains("Verlag")').text().match(/\d{4}/);
    console.log('Year: ' + year);
    return year;
}

function getBookInfo(save) {
    var title = getTitle();

    console.log('Title: ' + title);

    getAuthors();

    var description = getDescription();
    var isbn = getISBN();

    var publisher = getPublisher();
    console.log('Publisher: ' + publisher);

    var year = getYear();

    var pages = getPageCount();

    var imageURL = getImageUrl();
    console.log('Image: ' + imageURL);

    var language = getLanguage();

    if (save) {
        console.log('Saving Amazon info.');
        if (authors.length > 0) {
            GM_setValue('amazonAuthors', authors.join(", "));
        } else {
            GM_setValue('amazonAuthors', "[none]");
        }

        GM_setValue('amazonContributors', contributors.join(", "));
        GM_setValue('amazonEditors', editors.join(", "));
        GM_setValue('amazonTranslators', translators.join(", "));
        // GM_setValue('amazonAuthor', author);
        GM_setValue('amazonTitle', title);
        GM_setValue('amazonPublisher', publisher);
        GM_setValue('amazonLanguage', language);
        GM_setValue('amazonYear', year);
        GM_setValue('amazonPages', pages);
        GM_setValue('amazonISBN', isbn);
        GM_setValue('amazonImage', String(imageURL));
        GM_setValue('amazonDescription', description);
        GM_setValue('amazonURL', String(window.location.href));

        var type = $('span.zg_hrsr_ladder > a').text();
        if (ContainsAny(type, ["Literature", "Fantasy", "Mystery", "Poetry", "Graphic Novel", "Belletristik", "literatur"])) {
            GM_setValue('amazonTags', "fiction, ");
        } else {
            GM_setValue('amazonTags', "nonfiction, ");
        }
        if (type.indexOf("Criticism") >= 0) {
            GM_setValue('amazonTags', "nonfiction, ");
        }
    }
}

function getMainAuthor() {
    var author = $(".a-link-normal.contributorNameID:first").text().replace(/ [A-Z]\. /, " ");
    if (!author) {
        author = $('.author.notFaded > .a-link-normal:first').text().replace(/ [A-Z]\. /, " ")
            .replace(/ Ph\.D\./g, "");
    }
    if (!author) {
        author = $('.contributorNameTrigger:first').text().replace(/ [A-Z]\. /, " ");
    }
    return author;
}

function getMainTitle() {
    var title = $("#productTitle");
    if (title.length === 0) {
        title = $("#btAsinTitle");
    }
    if (title.length === 0) {
        title = $('#ebooksProductTitle');
    }

    var titleText = title.text().replace(/, \d+th Edition/, '').replace(/ (\d+th Edition)/, '');

    if (titleText.indexOf('(') >= 0) {
        titleText = titleText.substr(0, titleText.indexOf(' ('));
    }
    if (titleText.indexOf('[') >= 0) {
        titleText = titleText.substr(0, titleText.indexOf(' ['));
    }
    if (titleText.indexOf(':') >= 0) {
        titleText = titleText.substr(0, titleText.indexOf(':'));
    }
    titleText = titleText.replace(/:/, ' ');
    return titleText;
}

function mainTitleText(title) {
    var titleText = title.replace(/, \d+th Edition/, '').replace(/ (\d+th Edition)/, '');

    if (titleText.indexOf('(') >= 0) {
        titleText = titleText.substr(0, titleText.indexOf(' ('));
    }
    if (titleText.indexOf('[') >= 0) {
        titleText = titleText.substr(0, titleText.indexOf(' ['));
    }
    if (titleText.indexOf(':') >= 0) {
        titleText = titleText.substr(0, titleText.indexOf(':'));
    }
    titleText = titleText.replace(/:/, ' ');
    return titleText;
}

function printInfo() {
    var results = "";

    if (authors.length > 0) {
        results += '<br/>Authors: ' + authors.join(', ');
    }
    if (editors.length > 0) {
        results += '<br/>Editors: ' + editors.join(', ');
    }
    if (contributors.length > 0) {
        results += '<br/>Contributors: ' + contributors.join(', ');
    }
    if (translators.length > 0) {
        results += '<br/>Translators: ' + translators.join(', ');
    }
    results += '<br/>Time: ' + String(infoTime.toPrecision(5));
    $('#bibtoolbar').append(results);
}

// MARK: Search

function quoteWords(word) {
    return encodeURIComponent(word.replace(/((?=\S*[!'-])([a-zA-Z'!-]+))/, '"$1"'));
}

function searchBN(title, author) {
    return "http://www.barnesandnoble.com/s/" + encodeURIComponent(title) + " " + author;
}

function searchBibliotik(title, author) {
    var url = 'https://bibliotik.me/torrents/?orderby=added&order=desc&search=' + title;

    if (author.length) {
        author = author.replace(/ [A-Z]\. /, " ");
        url += ' @creators ' + author;
    }
    url += url + searchBibliotikLanguage();
    return url;
}

function searchBibliotikAuthor(author) {
    author = author.replace(/ [A-Z]\. /, " ");
    return 'https://bibliotik.me/torrents/?orderby=added&order=desc&search=' + '@creators ' +
        author + searchBibliotikLanguage();
}

function searchBibliotikLanguage() {
    switch (bookLanguage) {
        case 'Français':
        case 'French':
            return '&lan%5B%5D=3';
        case 'German':
        case 'Deutsch':
            return '&lan%5B%5D=2';
        case 'Italian':
        case 'Italiano':
            return '&lan%5B%5D=5';
        case 'Spanish':
        case 'Español':
            return '&lan%5B%5D=4';
        case 'Portugués':
            return '&lan%5B%5D=14';
        default:
            return '';
    }
}

function searchBibliotikRequests(title, author) {
    if (author.length) {
        author = author.replace(/ [A-Z]\. /, " ");
        return 'https://bibliotik.me/requests/?orderby=added&order=desc&search=' + title +
            ' @creators ' + author;
    } else {
        return 'https://bibliotik.me/requests/?orderby=added&order=desc&search=' + title;
    }
}

function searchGallimard(title, author) {
    return 'http://www.gallimardnumerique.com/listeliv.php?mots_recherche=' + encodeURIComponent(title) + '+' + author;
}

function searchGoodReads(title, author) {
    if (author.length) {
        return "https://www.goodreads.com/search?utf8=%E2%9C%93&query=" + encodeURIComponent(title) + ' ' + author;
    } else {
        return "https://www.goodreads.com/search?utf8=%E2%9C%93&query=" + encodeURIComponent(title);
    }
}

function searchOverDrive(title, author) {
    return "https://www.overdrive.com/search?&autoLibrary=f&autoRegion=t&showAvailable=False&q=" +
        encodeURIComponent(title) + " " + author;
}

function searchBS(author, title) {
    var search = 'https://brokenstones.club/torrents.php?order_by=time&order_way=desc&filter_cat%5B8%5D=1&action=basic&searchsubmit=1&searchstr=';
    if (typeof title !== 'undefined') {
        return search + quoteWords(author) + ' ' + quoteWords(title);
    } else {
        author = author.replace(/ [A-Z]\. /, " ");
        return search + quoteWords(author);
    }
}

function searchRED(author, title) {
    var search = 'https://redacted.ch/torrents.php?order_by=time&order_way=desc&filter_cat%5B3%5D=1&action=basic&searchsubmit=1&searchstr=';
    if (typeof title !== 'undefined') {
        return search + quoteWords(author) + ' ' + quoteWords(title);
    } else {
        author = author.replace(/ [A-Z]\. /, " ");
        return search + quoteWords(author);
    }
}

function searchREDRequests(author, title) {
    var searchRED = quoteWords(title);
    return 'https://redacted.ch/requests.php?submit=true&tags=&tags_type=1&show_filled=on&filter_cat[3]=1&search=' + searchRED;
}

function searchWorldCat(title, author) {
    return 'https://www.worldcat.org/search?q=ti%3A' + encodeURIComponent(title) + '+au%3A' + author + '&qt=advanced';
}

// MARK: Fill forms

function resetValues() {
    GM_deleteValue('amazonTitle');
    GM_deleteValue('amazonAuthors');
    GM_deleteValue('amazonEditors');
    GM_deleteValue('amazonContributors');
    GM_deleteValue('amazonTranslators');
    GM_deleteValue('amazonLanguage');
    GM_deleteValue('amazonPublisher');
    GM_deleteValue('amazonISBN');
    GM_deleteValue('amazonPages');
    GM_deleteValue('amazonYear');
    GM_deleteValue('amazonTags');
    GM_deleteValue('amazonImage');
    GM_deleteValue('amazonDescription');
    GM_deleteValue('amazonURL');
}

function fillFormLanguage(language) {
    var languageField = $('#LanguageField');

    switch (language) {
        case 'Français':
        case 'French':
            languageField.val(3);
            $('#TagsField').val("");
            break;
        case 'German':
        case 'Deutsch':
            languageField.val(2);
            break;
        case 'Hindi':
            languageField.val(38);
            break;
        case 'Italian':
        case 'Italiano':
            languageField.val(5);
            break;
        case 'Latin':
        case 'Latein':
            languageField.val(6);
            break;
        case 'Portugués':
            languageField.val(14);
            break;
        case 'Spanish':
        case 'Español':
            languageField.val(4);
            break;
        default:
            break;
    }
}

function fillFormBibliotik() {
    var formatField = $('#FormatField');
    formatField.val(21);
    
    $('#RetailField').prop("checked", true);
    
    if (!GM_getValue('amazonPublisher')) {
        return
    }

    console.log('Amazon form.');
    if (debug) {
        // $('fieldset').after('<br/>Amazon upload.');
    }

    $('#TitleField').val(GM_getValue('amazonTitle'));

    if (GM_getValue('amazonAuthors') !== "[none]") {
        $('#AuthorsField').val(GM_getValue('amazonAuthors'));
    }

    var contributorsField = $('#ContributorsField');
    var translatorsField = $('#TranslatorsField');

    $('#EditorsField').val(GM_getValue('amazonEditors'));
    contributorsField.val(GM_getValue('amazonContributors'));
    translatorsField.val(GM_getValue('amazonTranslators'));
    if (translatorsField.val() !== "" || contributorsField.val() !== "") {
        $('#toggle')[0].click();
    }

    $('#PublishersField').val(GM_getValue('amazonPublisher'));

    var language = GM_getValue('amazonLanguage', '');
    fillFormLanguage(language);

    if (windowLocation.indexOf("requests") >= 0) {
        $('#NotesField').val(GM_getValue('amazonDescription'));
        $('#RetailField').prop("checked", true);
        
        var formatsField = $("#FormatsField1");
        formatsField.focus();
    } else {
        $('#IsbnField').val(GM_getValue('amazonISBN'));
        $('#PagesField').val(GM_getValue('amazonPages'));
        $('#YearField').val(GM_getValue('amazonYear'));
        $('#TagsField').val(GM_getValue('amazonTags'));
        $('#ImageField').val(GM_getValue('amazonImage'));
        $('#DescriptionField').val(GM_getValue('amazonDescription'));
        
        formatField.focus();
    }

    resetValues();
}

function createUploadBS() {
	console.log('BrokenStones upload.');

    $('#categories').val(7);
    $('#categories').change();

    var delay = 3000; //1 seconds

    setTimeout(function () {
        $('#tags').val("ebooks");
        $('#title').val(GM_getValue('amazonTitle') + ' - ' + GM_getValue('amazonAuthors'));
        $('#image').val(GM_getValue('amazonImage'));
        $('#desc').val(GM_getValue('amazonDescription'));

        GM_deleteValue('amazonTitle');
        GM_deleteValue('amazonAuthors');
        GM_deleteValue('amazonDescription');
    }, delay);

    console.log('Amazon upload.');
}

function createUploadRED(){
    var tags = GM_getValue('amazonTags');
    
    if (tags === "nonfiction, ") {
        tags = "non.fiction, ";
    }
    
    if (GM_getValue('amazonAuthors', false)) {

        $('#categories').val(2);
        $('#categories').change(); // Change dynamic form

        var delay = 2750; //2.75 seconds

        setTimeout(function () {
            $('#title').val(GM_getValue('amazonAuthors') + ' - ' + GM_getValue('amazonTitle'));
            $('#tags').val(tags);
            $('#image').val(GM_getValue('amazonImage'));
            $('#desc').val(GM_getValue('amazonDescription') + "\n\n" + "Pages: " + GM_getValue('amazonPages') + "\n" + "Year: " + GM_getValue('amazonYear') + "\n" + "ISBN: " + "\n" + "Format: Retail AZW3" + "\n" + "More info: [url=" + GM_getValue('amazonURL') + "]Amazon[/url]");

            GM_deleteValue('amazonTitle');
            GM_deleteValue('amazonAuthors');
            GM_deleteValue('amazonDescription');
            GM_deleteValue('amazonTags');
        }, delay);

        console.log('Amazon upload.');
    }
}

function createRequestRED(){
    var tags = GM_getValue('amazonTags');
    
    if (tags === "nonfiction, ") {
        tags = "non.fiction, ";
    }
    
    if (GM_getValue('amazonAuthors', false)) {

        $('#categories').val("E-Books");
        $('#categories').change(); // Change dynamic form

        var delay = 2750; //2.75 seconds

        setTimeout(function () {
            $('input[name=title]').val(GM_getValue('amazonAuthors') + ' - ' + GM_getValue('amazonTitle'));
            $('#tags').val(tags);
            $('input[name=image]').val(GM_getValue('amazonImage'));
            $('textarea[name=description]').val(GM_getValue('amazonDescription') + "\n\n" + "[url=" + GM_getValue('amazonURL') + "]Amazon[/url]");

            GM_deleteValue('amazonTitle');
            GM_deleteValue('amazonAuthors');
            GM_deleteValue('amazonDescription');
            GM_deleteValue('amazonTags');
        }, delay);

        console.log('Amazon upload.');
    }
}

if (windowHostname === 'brokenstones.club') {
    console.log('BrokenStones upload.');
    createUploadBS();
}

if (windowHostname === 'redacted.ch') {
    var pathname = window.location.pathname;
    
    if (pathname === "/upload.php") {
        createUploadRED();
    }
    if (pathname === "/requests.php"){
        createRequestRED();
    }
}

if (windowHostname.indexOf('dp/')) {
    if ($('li:contains("ISBN-10:"),li:contains("ASIN:")')) {
        amazonBookPage();
    }
}

if (windowHostname.indexOf('search-alias/')) {
    amazonSearch();
}

if (windowHostname === 'bibliotik.me') {
    fillFormBibliotik();
}