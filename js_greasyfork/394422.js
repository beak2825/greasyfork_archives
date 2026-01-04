// ==UserScript==
// @name     LImgDLer
// @version  1.9
// @grant    GM_download
// @grant    GM_addStyle
// @include  /^https://(www\.)?(classic\.|Asia|Av|Bade|Behaarte|Bizarr|Busen|Clickandmeet|Deutsche|Devote|Dominante|Erfahrene|Exklusiv|Grosse|Hobby|Junge|Kuss|Latina|Massierende|Molly|Ns|Nymphomane|Orient|Osteuropa|Piercing|Rasierte|Schoko|Tattoo|Ts|Zaertliche|Zierliche)?ladies.de/Sex-Anzeigen//
// @include  https://escorts24.de
// @namespace https://greasyfork.org/users/290665
// @description Auto-DL
// @downloadURL https://update.greasyfork.org/scripts/394422/LImgDLer.user.js
// @updateURL https://update.greasyfork.org/scripts/394422/LImgDLer.meta.js
// ==/UserScript==

var name;
var phonews;
var NAMERAW, PHONE;
jQuery(function () {
    hideSpam();
    setupMutationObserver();
    if (jQuery('.kuenstlername').length) { // modern mode
        NAMERAW = jQuery('.kuenstlername').first().text();
        PHONE = jQuery('.contacts-data strong').first().text();
    } else if (jQuery('.auftrag-name h3').length) { // themenladies
        NAMERAW = jQuery('.auftrag-name h3').first().text();
        PHONE = jQuery('p.telefon strong').first().text();
    } else if (jQuery('div.full_pad.bigfont strong').length) { // classic
        NAMERAW = jQuery('div.full_pad.bigfont strong').text();
        PHONE = jQuery('.div_td_last.lalign.midfont.itxt_pad.icon_text').eq(1).text();
    }
    PHONE = PHONE.replace(/ \/ /, '-');
    let NAME = NAMERAW.replace(/[^\w-\(\)äöüß+ ]/ig, '');
    name = NAME + ' - ' + PHONE
    phonews = PHONE.replace(/[ \-]+/g, '');
    var SEARCHTERM = `("${NAME}" OR "${PHONE}" OR ${phonews})`;

    var dlArea = jQuery('<div id="LImgDLer">'
        + '<div class="title"><span class="Llogo">LImgDLer</span> '
        + '<button id="dlbutton">📥 Download <b>' + name + '</b></button>'
        + '<button id="lhbutton">🔍 search LH</button>'
        + '<button id="copybutton">📋 copy Text</button>'
        + '</div></div>');

    jQuery('body').on('click', '#lhbutton', function (event) {
        event.stopPropagation();
        event.preventDefault();

        var url = 'https://www.google.de/search?as_sitesearch=lusthaus.cc&q=';
        url += SEARCHTERM;
        window.open(url);
    });

    jQuery(dlArea).find('button').data('name', name);
    jQuery('body').on('click', '#dlbutton', function (event) {
        startDownloads(jQuery(event.currentTarget).data('name'));
    });
    jQuery('body').on('click', '#copybutton', function (event) {
        navigator.clipboard.writeText(adData());
    });

    if (jQuery('.auftrag-title').length) { // modern mode
        addStyle();
        jQuery('.auftrag-title').first().append(dlArea);
    } else if (jQuery('div#content div.container').length) { // themenladies
        jQuery('div#content div.container').first().append(dlArea);
        addStyle("themen");
    } else if (jQuery('div.sitemenu').length) { // classic
        jQuery('div.sitemenu').append(dlArea);
        addStyle("classic");
    }
    jQuery('#lhbutton').attr('title', SEARCHTERM);

});

function startDownloads(name) {
    var downloadlist = [];
    if (jQuery('.rsNav img').length) {
        jQuery('.rsNav img').each(function() {
            var link = jQuery(this).attr('src');
            if (link.match(/-FK\./)) return; // skip videos
            link = link.replace(/\?.*/,'');
            downloadlist.push(link.replace(/(\d+)-F(\d+)\./,'$1-A$2.'));
        });
        jQuery('a.gallery_video').each(function() { // get videos
            downloadlist.push($(this).attr('href'));
        });
        downloadListedImages(name,downloadlist);
    } else {
        let firstImgURL = jQuery('div#div_foto img').first().attr('src');
        let matches = firstImgURL.match(/(.*)\/([0-9]+)-F1\.JPG$/);
        let URLprefix = matches[1];
        let ID = matches[2];
        if (ID.length) {
            let dataURL = '/includes/lds/data/js/generic/galerie.inc.php?site=galerie&AuftragsID='+ID+'&param1=0';
            jQuery.get(dataURL, function( result ) {
                let arr = result.match(/var +\$anzeige_FotoID *= *\[ *([ 0-9,]+?) *\]/);
                let imgArray = arr[1].split(',');
                imgArray.forEach(function (nr) {
                    let imgURL = `${URLprefix}/${ID}-A${nr}.JPG`;
                    console.log(imgURL);
                    downloadlist.push(imgURL);
                });
                downloadListedImages(name,downloadlist);
            });
        }
    }
}

function downloadListedImages(path,downloadlist) {
    var dialog = jQuery('<div id="LImgDLerdialog" title="Download to '+path+' ..."></div>').appendTo(jQuery('#LImgDLer'));

    for (let URL of downloadlist) {
        var name = URL.replace(/.*\//,'');
        var file = path.replace(/[^\w-\(\)äöüß+ ]/ig,'')+'/'+name;
        URL = URL.replace(/^\/\//,'https://');
        var line = jQuery('<div class="RLDL" data-name="'+name+'">'+name+'</div>\n').appendTo(dialog);

        (function(url,filepath,filename,linediv) {
            var dl = GM_download({
                url: url,
                name: filepath,
                saveAs: false,
                onerror: function(err){
                    jQuery(linediv).append('<span class="download_error">ERROR: '+err.error+'<br>'+err.details+'</span>');
                },
                onload: function() {
                    jQuery(linediv).append('<span class="download_ok">✓</span>');
                }
            });
        })(URL,file,name,line);

    }
}
function adData() {
    let phone = phonews.replace(/\+49\(0\)/,'0');
    let phone2 = phone.replace(/^(01[67].)/,'$1-');
    phone2 = phone2.replace(/^(015510)/,'$1-');
    phone2 = phone2.replace(/^(015..)(\d+)$/,'$1-$2');
    let phone3 = phonews.replace(/^0([1-9])/,'+49$1');

    let daten = "";
    jQuery('.attribute-column > .row').each(function(){
        let key = jQuery(this).find('strong').first().text().trim();
        let values = [];
        jQuery(this).find('p').each(function() {
            values.push(jQuery(this).text().trim());
        });
        let value = values.join(', ');
        if (key.length && value.length) {
            if (daten.length) daten += ", ";
            daten += `${key}: [B]${value}[/B]`;
        }
    });

    let clubname = jQuery('[property=locationName]').first().text().trim();
    let clublink = jQuery('a[property=ladyLocation').attr('href');
    let club = '';
    if (clubname) {
        club = `[URL=https://ladies.de${clublink}]${clubname}[/URL], `;
    }
    let URL = window.location.href;
    let address =
        ((jQuery('[itemprop=address] [property=streetAddress]').first().text() || '')
        + ", "
        + (jQuery('[itemprop=address] [itemprop=postalCode]').first().attr('content') || '')
        + " "
        + (jQuery('[itemprop=address] [itemprop=addressLocality]').first().text() || jQuery('.contacts-data .address-details').first().text().replace(/[\s\n]+/g,' ').replace(/(^[\s\n]+|[\s\n]+$)/g,'') || '')
         ).replace(/^[, ]+/,'');

    if (address.length) {
        address = `[URL=https://www.google.de/maps/place/${address}]${address}[/URL]`;
    }
    let description = $('#description > div')
        .clone()
        .find("span")
        .remove()
        .end()
        .text()
        .trim();

    let service = '';

    jQuery('.profil .column-group').each(function(){
        let key = jQuery(this).find('strong').first().text().trim();
        let values = [];
        jQuery(this).find('.attribute-item').each(function() {
            values.push(jQuery(this).text().trim());
        });
        let value = values.join(', ');
        if (key.length && value.length) {
            if (service.length) service += ", ";
            service += `${key}: [B]${value}[/B]`;
        }
    });



    let languages = '';
    let dataHTML= `Infoservice\n[QUOTE][URL=${URL}][B]${NAMERAW}[/B][/URL]\n\n`
        +`[SIZE="1"]${description}\n\n${daten}\n\n`
        +`${service}\n`
        +`Telefon: [B][SIZE=3]${phone2}[/SIZE][/B], ${phone}, ${phone3}\n`
        +`Adresse: [B]${club}${address}[/B]\n`
        +`[/SIZE][/QUOTE]`;
    dataHTML = dataHTML.replace(/ {2,}/g,' ').replace(/\n{3,}/,'\n\n');
    return dataHTML;
}
function hideSpam() {
    jQuery('div.anzeige').has('span.webcam-markierung').remove();
    jQuery('div.anzeige').has('div.closed-info').css('opacity','0.3');
    jQuery('section#page-top-sol').remove();
}
function setupMutationObserver() {
    const observer = new MutationObserver(hideSpam);
    let target = jQuery('ul.pagination');
    if (target.length) {
        observer.observe(jQuery(target).get(0), {
            attributes: true,
            childList: true,
            subtree: true
        });
    }
}

function addStyle(mode) {
    let styles = [];
    styles["classic"] = `
#LImgDLer {
    left: 174px;
    top: 109px;
    right: 202px;
    line-height: 10px;
    font-size:9px;
}
.Llogo {
	font-size: 16px;
	top: 2px;
}
#LImgDLer button {
	padding: 4px 12px;
    font-size:11px;
}
button:hover {
    cursor:pointer;
}
    `;
    styles["themen"] = `
div#content div.container {
  position:relative;
}
#LImgDLer {
    left: 16px;
    top: 50px;
    right: 15px;
    line-height: 10px;
}
.Llogo {
	font-size: 17px;
	top: 1px;
}
#LImgDLer button {
	padding: 4px 12px;
}

    `;

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

#LImgDLer {
	max-height: 180px;
	font-size: 10px;
	position: absolute;
	left: 240px;
	top: 0;
	right: 30px;
}
#LImgDLer button {
	background-color: #e28c13;
	border: none;
	margin: 0px 4px;
	padding: 10px 12px;
	line-height: 15px;
	font-size: 15px;
	color: white;
}
#LImgDLer > div.title {
    background-color:#6f789f;
}

#LImgDLerdialog {
    background-color: rgba(255, 255, 255, .52);
    overflow: auto;
    column-width: 110px;
    padding:4px;
}
.Llogo {
	padding: 0 12px;
	color: #e69536;
	font-size: 24px;
	font-weight: 700;
	text-shadow: 0 0 1.5px black;
	font-style: italic;
	top: 3px;
	position: relative;
	line-height: 12px;
}
`);
    if (mode && styles[mode]) {
        GM_addStyle(styles[mode]);
    }
}
