// ==UserScript==
// @name        KMImgDLer
// @version     3.5
// @grant       GM_addStyle
// @grant       GM_download
// @include     https://www.kaufmich.com/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require     https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @namespace   https://greasyfork.org/users/290665
// @description Auto-download all pics
// @downloadURL https://update.greasyfork.org/scripts/394317/KMImgDLer.user.js
// @updateURL https://update.greasyfork.org/scripts/394317/KMImgDLer.meta.js
// ==/UserScript==

$("head").append(
    '<link '
    + 'href="//ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.min.css" '
    + 'rel="stylesheet" type="text/css">'
)
    .append('<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">');

addStyle();
var myVersion = GM_info.script.version;

function artistname() {
    var name = $('.profile__card-display-name').text();
    name = name.replace(/(^\s+|\s+$)/g, '');
    return name;
}

// Hauptfunktion zum Einfügen der Buttons
function initUI() {
    // Wenn wir nicht auf einer Profilseite sind oder kein Name da ist, abbrechen
    var name = artistname();
    if (!name.length) return;

    var username = document.baseURI.replace(/.*\.com\/p\//, '').replace(/#$/, '');

    // 1. Logo einfügen (Prüfen ob schon da)
    if ($('.KMImgDLerLogo').length === 0) {
        $('<div class="KMImgDLerLogo">enhanced by KMImgDLer ' + myVersion + '</div>')
            .appendTo($('.nav__logo'));
    }

    // 2. Buttons Container prüfen
    var $actionContainer = $('.profile__more-actions');
    if ($actionContainer.length === 0) return; // Container noch nicht geladen

    // 3. Buttons einfügen (Prüfen ob schon da anhand einer Klasse oder ID)
    if ($('#km-custom-search-btn').length === 0) {

        var searchQuery = (username.toLowerCase() == name.toLowerCase()) ? `"${name}"` : `("${username}" OR "${name}")`;

        // Style fix für Content
        $('.content:first').css('position', 'relative');

        // Buttons erstellen
        $('<a id="km-custom-search-btn" title="search LH" class="btn btn__size-md btn__type-normal btn__theme-primary-white" target="_blank"><span class="material-icons md-18">search</span> LH</a>')
            .attr('href', `https://www.google.de/search?as_sitesearch=lusthaus.cc&q=${searchQuery}`)
            .prependTo($actionContainer);

        $('<a id="km-custom-dl-btn" title="Download all photos" class="btn btn__size-md btn__type-normal btn__theme-primary-white" href="#">'
            + '<span class="material-icons md-18">collections</span>&#8203</button></a>')
            .on('click', function(e) {
                e.preventDefault(); // Verhindert Springen nach oben
                startDLALL(username);
            }).prependTo($actionContainer);

        $('<a id="km-custom-copy-btn" title="Copy ad data and text in BBCode format" class="btn btn__size-md btn__type-normal btn__theme-primary-white" href="#"><span class="material-icons md-18">content_copy</span>&#8203</button>')
            .on('click', function(e) {
                e.preventDefault();
                navigator.clipboard.writeText(adData());
            }).prependTo($actionContainer);
    }
}

// Observer starten
var observer = new MutationObserver(function(mutations) {
    // Wir prüfen bei jeder Änderung, ob unsere UI noch da ist
    initUI();
});

// Wir beobachten den gesamten Body auf Änderungen (Unterelemente und Kind-Elemente)
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Einmalig initial starten (falls DOM schon fertig ist)
$(document).ready(function() {
    initUI();
});


// --- Helper Functions ---

function adData() {
    let name = $('.profile__card-display-name').first().html();
    let phone = "";
    let text = $('.profile__description-detail').first().text();
    let URL = window.location.href;
    let address = $('.profile__card-location .location-wrapper')
        .first().text()
        .replace(/ - .*$/, '')
        .replace(/\n/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    let service = '';
    $('.static-tag--light').each(function() {
        if (service.length) service += ', ';
        service += $(this).text();
    });
    let taboo = '';
    $('.static-tag--grey').each(function() {
        if (taboo.length) taboo += ', ';
        taboo += $(this).text();
    });

    let user = $('.user').first().text();
    let figure = $('.figure').first().text();
    let breast = $('.breast').first().text();
    let origin = $('.origin').first().text();
    let languages = $('.languages').first().text();
    let others = $('.others').first().text();
    let hair = $('.hair').first().text();
    let preferred = $('.profile__preferred-data-text').first().text();
    let dataHTML = `Infoservice\n[QUOTE][URL=${URL}][B]${name}[/B][/URL]\n\n[SIZE="1"]${text}\n\n`;
    if (phone.length) {
        phone = phone.replace(/ /g, '').replace(/\+49\(0\)/, '0');
        let phone2 = phone.replace(/[/\-]/g, '');
        let phone3 = phone2.replace(/^0([1-9])/, '+49$1');
        dataHTML += `[B]Telefon:[/B] ${phone}, ${phone2}, ${phone3}\n`;
    }
    let addressURL = address.replace(/ /g, '%20');
    dataHTML += `[B]Daten:[/B] ${user}, ${figure}, ${others}, Brust: ${breast}, Intim: ${hair}, Herkunft: ${origin}, Sprachen: ${languages}\n`
        + `[B]Date-Wünsche:[/B] ${preferred}\n`
        + `[B]Adresse:[/B] [URL=https://www.google.de/maps/place/${addressURL}]${address}[/URL]\n`
        + `[B]Service:[/B] ${service}\n`;
    if (taboo.length) dataHTML += `[B]Tabus:[/B] ${taboo}\n`;
    dataHTML += `[/SIZE][/QUOTE]`;
    dataHTML = dataHTML.replace(/ {2,}/g, ' ').replace(/\n{3,}/g, '\n\n');
    return dataHTML;
}

function startDLALL(username) {
    var downloadlist = [];
    $('.profile__gallery-thumb-list .image-img').each(function() {
        var link = $(this).attr('src')
            .replace(/-\d+\.(jpg|webp)/i, '-o.$1') /* use original size */
            .replace(/\.webp$/, '.jpg'); /* download JPG instead of WEBP */
        if (link.match(/\/mask\//)) return; /* skip blurred preview images */
        downloadlist.push(link);
        console.log(link);
    });
    var name = artistname();
    var path = name;
    if (name.toLowerCase() != username.toLowerCase()) path += `,${username}`
    dlAll(path, downloadlist.filter(function(value, index, self) {
        return self.indexOf(value) === index;
    }));
}

function dlAll(path, downloadlist) {

    var dialog = $('<div id="dialog"></div>').dialog({
        title: 'Download to ' + path + ' ...',
        modal: true,
        width: 600,
        buttons: {
            Ok: function() {
                $(this).dialog("close");
            }
        }
    });

    for (let URL of downloadlist) {
        var name = URL.replace(/.*\//, '');
        var file = path.replace(/[^\w-\(\)]/g, '') + '/' + name;
        URL = URL.replace(/^\/\//, 'https://');
        var line = $('<div class="RLDL" data-name="' + name + '">' + name + '</div>\n').appendTo(dialog);

        console.log([URL, file]);

        (function(url, filepath, filename, linediv) {
            var dl = GM_download({
                url: url,
                name: filepath,
                saveAs: false,
                onerror: function(err) {
                    $(linediv).append('<span class="download_error">ERROR: ' + err.error + '<br>' + err.details + '</span>');
                },
                onload: function() {
                    $(linediv).append('<span class="download_ok">✓</span>');
                }
            });
        })(URL, file, name, line);

    }
}

function addStyle() {
    GM_addStyle(`
.download_error {
    color: white;
    background-color: #880010;
    padding: 1px 4px;
    border-radius: 2px;
    margin: 0px 4px;
}

.download_ok {
    color: white;
    background-color: #10a020;
    padding: 1px 4px;
    border-radius: 2px;
    margin: 0px 4px;
}
#KMImgDLer {
    position: absolute;
    top: 85px;
    overflow: visible;
    z-index: 10000;
}
.KMImgDLerLogo {
    position: absolute;
    color: white;
    font-size: 11px;
    top: 21px;
    left: 32px;
}
.material-icons {
    position: relative;
    top: 6px;
}`);
}