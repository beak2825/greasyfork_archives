// ==UserScript==
// @name         ILenhancer
// @namespace    https://greasyfork.org/users/290665
// @version      0.4.2
// @description  Enhances instaladies
// @match        https://instaladies.de/ladies/*
// @icon         https://www.google.com/s2/favicons?domain=instaladies.de
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @resource     IMPORTED_CSS https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/435682/ILenhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/435682/ILenhancer.meta.js
// ==/UserScript==

var NAME, PHONE;
$(function() {
    GM_addStyle(GM_getResourceText("IMPORTED_CSS"));
    addStyle();
    $('head').append('<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">');

    var R = $('<div id="ILenhancer"></div>').appendTo('#youzify-profile-header .youzify-inner-content');
    var buttons = $('<div class="ILbuttongroup"></div>').appendTo(R);
    $('<div class="ILversion"><a title="Click to check for update!" href="https://sleazyfork.org/de/scripts/435682-ilenhancer">'
      +GM_info.script.name+'</a> '
      +GM_info.script.version+'</div>')
        .appendTo(R);

    NAME = $($('.youzify-name h2:first-child').contents()[0]).text();
    PHONE = jQuery('.youzify-box-phone span').first().text();
    if (PHONE) PHONE = PHONE.replace(/ \/ /,'-');

    let tel = PHONE.replace(/^\+?49 */,'0');
    var dlpath = NAME+' - '+tel;
    dlpath = dlpath.replace(/[^\w\s-\(\)]/g,'');

    $(`<button type="button" class="btn btn-outline-primary" title="alle Bilder herunterladen nach ${dlpath}">`
      +`<span class="dashicons dashicons-download"></span> Photos </button>`)
        .on('click', function() {
        downloadAll(dlpath);
    }).appendTo(buttons);

/*
    $('<button type="button" class="btn btn-outline-primary" id="copyData"><span class="dashicons dashicons-clipboard"></span> copy text</button>').on('click', function() {
        navigator.clipboard.writeText(adData());
    }).appendTo(buttons);
*/
    $('<button type="button" class="btn btn-outline-primary" id="LHsearch"><span class="dashicons dashicons-search"></span> LH</button>').on('click', function() {
        LHsearch();
    }).appendTo(buttons);
});
function LHsearch() {
    let name = NAME;
    let phone = PHONE;
    if (! phone) phone = "";
    phone = phone.replace(/\+49(\(0\))? */,'0');
    var phone2 = phone.replace(/[/\- ]/g,'');

    var searchterm = `("${name}"` + (
        phone ? ` OR "${phone}"` + (phone == phone2?'':` OR ${phone2}`)
              :''
        )
        +')';
    var url = 'https://www.google.de/search?as_sitesearch=lusthaus.cc&';
    url += 'q='+searchterm;
    window.open(url);
}
function adData() {
    let name = $('h1').first().html();
    let phone = $('.one a').first().text();
    if (! phone) phone = "";
    phone = phone.replace(/ /g,'').replace(/\+49\(0\)/,'0');
    let phone2 = phone.replace(/[/\-]/g,'');
    let phone3 = phone2.replace(/^0([1-9])/,'+49$1');

    let subheader = $('div.title').first().html();
    let text = $('div.maincontent').first().text();
    let clublink = $('div#clublink a').attr('href');
    let clubname = $('div#clublink a').text().replace(/> /,'');
    let club = '';
    if (clubname) {
        club = `[URL=https://www.rotelaterne.de${clublink}]${clubname}[/URL], `;
    }
    let URL = window.location.href;
    let address = $('div.tablet-info-address').text().replace(/Adresse/,'').replace(/\n/g,' ');
    let service = $('div.tablet-info-service').html()
        .replace(/\n/g,'')
        .replace(/<(\/)?h2>/g,'[$1B]')
        .replace(/\[B\]/g,'\n[B]')
        .replace(/\[\/B\]/g,':[/B]');
    let languages = '';
    let dataHTML= `Infoservice\n[QUOTE][SIZE="1"][URL=${URL}][B]${name}[/B]\n${subheader}[/URL]\n\n${text}\n\n`
        +`[B]Telefon:[/B] ${phone}, ${phone2}, ${phone3}\n`
        +`[B]Adresse:[/B] ${club}${address}`
        +`${service}\n`
        +`[/SIZE][/QUOTE]`;
    dataHTML = dataHTML.replace(/ {2,}/g,' ').replace(/\n{3,}/,'\n\n');
    return dataHTML;
}
function downloadAll(path) {
    var URLs = allImgURLs();

    var dialog = $('<div id="dialog" title="Download to '+path+' ..."></div>').dialog({
        width: 500,
        height:400
    }).on('close', function() {
        console.log("cancel downloads now");
    });
    var downloads = [];
    for (var URL of URLs.values()) {
        var name = URL.replace(/.*\//,'');
        if (!name.length) continue;
        var file = path+'/'+name;
        URL = URL.replace(/^\/\//,'https://');
        var line = $('<div class="ILDL" data-name="'+name+'">'+name+'</div>\n').appendTo(dialog);
        (function(url,filepath,filename,linediv) {
            console.log(`Downloading ${filepath}`);
            var dl = GM_download({
                url: url,
                name: filepath,
                saveAs: false,
                onerror: function(){
                    $(linediv).addClass('dlerror')
                    .append('<span class="download_error">ERROR: '+err.error+'<br>'+err.details+'</span>');
                },
                onload: function() {
                    $(linediv).addClass('dlsuccess')
                        .append('<span class="download_ok">✓</span>');
                }
            });
            downloads.push(dl);
        })(URL,file,name,line);
    }
}

var GM_download_emu = function(url, name) {
    GM_xmlhttpRequest({
    	method: 'GET',
    	url: url,
    	onload: function(r) {
            var bb = new Blob([r.responseText], {type: 'text/plain'});
	    saveAs(bb, name);
    	}
    });
};

function allImgURLs() {
    var URLs = [];
    $('.youzify-portfolio-content a, .youzify-media-group-photos a').each( function() {
        URLs.push($(this).attr('href'));
    });
    return URLs;
}

function addStyle() {
        GM_addStyle(`
#ILenhancer {
    position: absolute;
    left: 0;
    right: 30px;
    z-index: 1000;
    color: white;
    padding: 0 312px;
    box-sizing: border-box;
    height: 48px;
    bottom: 0px;
    white-space: nowrap;
}
#ILenhancer button.btn.btn-outline-primary {
    color: white;
    margin-right: 12px;
    border-color: white;
}
.ILversion {
    font-size: 75%;
    font-weight: 700;
    margin-top: 6px;
}
.ILDL {
    font-size: 11px;
}
.ILDL.dlerror {
    background-color: red;
}
.ILDL.dlsuccess {
    background-color: #d5f9e4;
}

`);
}
