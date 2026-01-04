// ==UserScript==
// @name     KMImgDLer
// @version  3.4
// @grant    GM_addStyle
// @grant    GM_download
// @include https://www.kaufmich.com/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @namespace https://greasyfork.org/users/290665
// @description Auto-download all pics
// @downloadURL https://update.greasyfork.org/scripts/394317/KMImgDLer.user.js
// @updateURL https://update.greasyfork.org/scripts/394317/KMImgDLer.meta.js
// ==/UserScript==


$("head").append (
    '<link '
  + 'href="//ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.min.css" '
  + 'rel="stylesheet" type="text/css">'
)
    .append('<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">');

addStyle();
var myVersion = GM_info.script.version;
var username = document.baseURI.replace(/.*\.com\/p\//,'').replace(/#$/,'');

function artistname() {
    var name = $('.profile__card-display-name').text();
    name = name.replace(/(^\s+|\s+$)/g,'');
    return name;
}
$(function() {
    var name = artistname();
    if (name.length) {
        var searchQuery = (username.toLowerCase() == name.toLowerCase()) ? `"${name}"` : `("${username}" OR "${name}")`;
        $('.content:first').css('position','relative');
        var myspace = $('<div id="KMImgDLer"></div>').prependTo('.root__content');
        $('<div class="KMImgDLerLogo">enhanced by KMImgDLer '+myVersion+'</div>')
            .appendTo($('.nav__logo'));
        $('<a title="search LH" class="btn btn__size-md btn__type-normal btn__theme-primary-white" target="_blank"><span class="material-icons md-18">search</span> LH</a>')
            .attr('href',`https://www.google.de/search?as_sitesearch=lusthaus.cc&q=${searchQuery}`)
            .prependTo($('.profile__more-actions'));
        $('<a title="Download all photos" class="btn btn__size-md btn__type-normal btn__theme-primary-white" href="#">'
            +'<span class="material-icons md-18">collections</span>&#8203</button></a>')
            .on('click', startDLALL).prependTo($('.profile__more-actions'));
        $('<a title="Copy ad data and text in BBCode format" class="btn btn__size-md btn__type-normal btn__theme-primary-white" href="#"><span class="material-icons md-18">content_copy</span>&#8203</button>')
            .on('click', function() {
                navigator.clipboard.writeText(adData());
            }).prependTo($('.profile__more-actions')
        );
    }
});

function adData() {
    let name = $('.profile__card-display-name').first().html();
    let phone =  ""; // phone is not easily available; must be fetched from https://api.kaufmich.com/api/v2/phone/users/<user>?username=<user>
    let text = $('.profile__description-detail').first().text();
    let URL = window.location.href;
    let address = $('.profile__card-location .location-wrapper')
        .first().text()
        .replace(/ - .*$/,'')
        .replace(/\n/g,' ')
        .replace(/\s+/g,' ')
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
    let dataHTML= `Infoservice\n[QUOTE][URL=${URL}][B]${name}[/B][/URL]\n\n[SIZE="1"]${text}\n\n`;
    if (phone.length) {
        phone = phone.replace(/ /g,'').replace(/\+49\(0\)/,'0');
        let phone2 = phone.replace(/[/\-]/g,'');
        let phone3 = phone2.replace(/^0([1-9])/,'+49$1');
        dataHTML += `[B]Telefon:[/B] ${phone}, ${phone2}, ${phone3}\n`;
    }
    let addressURL = address.replace(/ /g,'%20');
    dataHTML += `[B]Daten:[/B] ${user}, ${figure}, ${others}, Brust: ${breast}, Intim: ${hair}, Herkunft: ${origin}, Sprachen: ${languages}\n`
        +`[B]Date-Wünsche:[/B] ${preferred}\n`
        +`[B]Adresse:[/B] [URL=https://www.google.de/maps/place/${addressURL}]${address}[/URL]\n`
        +`[B]Service:[/B] ${service}\n`;
    if (taboo.length) dataHTML += `[B]Tabus:[/B] ${taboo}\n`;
    dataHTML += `[/SIZE][/QUOTE]`;
    dataHTML = dataHTML.replace(/ {2,}/g,' ').replace(/\n{3,}/g,'\n\n');
    return dataHTML;
}

function startDLALL() {
    var downloadlist = [];
    $('.profile__gallery-thumb-list .image-img').each(function() {
        var link = $(this).attr('src')
            .replace(/-\d+\.(jpg|webp)/i,'-o.$1') /* use original size */
            .replace(/\.webp$/,'.jpg'); /* download JPG instead of WEBP */
        if (link.match(/\/mask\//)) return; /* skip blurred preview images */
        downloadlist.push(link);
        console.log(link);
    });
    var name = artistname();
    var path = name;
    if (name.toLowerCase() != username.toLowerCase()) path += `,${username}`
    dlAll(path,downloadlist.filter( function (value, index, self) {
        return self.indexOf(value) === index;
    } ));
}

function dlAll(path,downloadlist) {

    var dialog = $('<div id="dialog"></div>').dialog({
        title: 'Download to '+path+' ...',
        modal: true,
        width: 600,
        buttons: {
            Ok: function() {
                $( this ).dialog( "close" );
            }
        }
    });

    for (let URL of downloadlist) {
        var name = URL.replace(/.*\//,'');
        var file = path.replace(/[^\w-\(\)]/g,'')+'/'+name;
        URL = URL.replace(/^\/\//,'https://');
        var line = $('<div class="RLDL" data-name="'+name+'">'+name+'</div>\n').appendTo(dialog);

        console.log([URL,file]);

        (function(url,filepath,filename,linediv) {
            var dl = GM_download({
                url: url,
                name: filepath,
                saveAs: false,
                onerror: function(){
                    $(linediv).append('<span class="download_error">ERROR: '+err.error+'<br>'+err.details+'</span>');
                },
                onload: function() {
                    $(linediv).append('<span class="download_ok">✓</span>');
                }
            });
        })(URL,file,name,line);

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