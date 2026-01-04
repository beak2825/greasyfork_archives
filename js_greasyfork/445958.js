// ==UserScript==
// @name         SNenhancer
// @version      0.5
// @description  Image Downloader
// @match        https://sexnord.net/*profile/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sexnord.net
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @resource     IMPORTED_CSS https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @namespace    https://greasyfork.org/users/290665

// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445958/SNenhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/445958/SNenhancer.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author ttt555
/////// @collaborator 
// ==/OpenUserJS==

var profiledata;
function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

jQuery(function() {
    $('head').append('<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">');
    waitForElm('.profile-name').then((elm) => {
        startSNE();
    });
});


function startSNE() {
    console.log("SNE started!");
    'use strict';
    GM_addStyle(GM_getResourceText("IMPORTED_CSS"));
    GM_addStyle(`
#sne-buttons {
    position: absolute;
    left: 150px;
}
#sne-buttons > button {
    margin-left: 4px;
}
#sne-buttons .mat-button span.material-icons {
    line-height: 24px;
    vertical-align: middle;
    margin-left:4px;
}
.snedl {
    font-size:12px;
}
.snelogo {
    font-size: 12px;
    color: #fdba58;
    padding-left: 8px;
}
.toast {
    position: absolute;
    background-color: #a5670c;
    bottom: -24px;
    width: 98%;
    text-align: center;
    color: #fff;
    font-weight: bold;
    right: 1px;
    padding: 4px 0;
    border-radius: 4px;
}
`);

    let jsontext = $('app-profile-schema script').first().text();
    profiledata = JSON.parse(jsontext);

    let baseURL = window.location.protocol + "//" + window.location.host;
    let buttons = $('<div id="sne-buttons"><div class="snelogo">SNEnhancer</div></div>').appendTo('.profile-stats');
    jQuery('<button id="downloadAll" class="mat-focus-indicator btn-orange mat-button mat-button-base" title="Alle Bilder herunterladen">\
         <span class="material-icons">photo_library</span><span class="material-icons">download</span></button>')
        .on('click', downloadAll)
        .appendTo(buttons);
    jQuery('<button class="mat-focus-indicator btn-orange mat-button mat-button-base" title="Anzeigentext für ein Forum kopieren">\
        <span class="material-icons">content_copy</span></button>')
        .on('click', copyText)
        .appendTo(buttons);
    jQuery('<button class="mat-focus-indicator btn-orange mat-button mat-button-base" title="Anzeigenlink kopieren">\
        <span class="material-icons">share</span></button>')
        .on('click', shareLink)
        .appendTo(buttons);
    jQuery('<button class="mat-focus-indicator btn-orange mat-button mat-button-base" title="Im Lusthaus suchen (in neuem Tab)">\
        <span class="material-icons">search</span>LH</button>')
        .on('click', LHsearch)
        .appendTo(buttons);

    function downloadAll(event) {
        event.stopPropagation();
        let path = getAdName() + " (SN " + getAdID() + ")";
        let phone = getPhone();
        if (phone) path += " - " + phone;
        var dialog = $('<div id="dialog" title="Download to '+path+' ..."></div>').dialog({
            width: 640,
            height:480
        }).on('close', function() {
            console.log("cancel downloads now");
        });

        let imgList = [];
        jQuery('.mat-card img').each(function() {
                console.log(this);
            let image = $(this).attr('src');
            imgList.push(image.replace(/.*\/[a-z][0-9]+_/,''));
        });
        for (let name of imgList) {
            console.log("Download ", name);
            let URL = `${baseURL}/p/${name}`;

            let file = (path+'/'+name).replace(/\/\d+\//,'/');
            var line = jQuery('<div class="snedl" data-name="'+name+'">'+file+'</div>\n').appendTo(dialog);

            (function(url,filepath,filename,linediv) {
                var dl = GM_download({
                    url: url,
                    name: filepath,
                    saveAs: false,
                    onerror: function(){
                        jQuery(linediv).append('<span class="download_error">ERROR: '+err.error+'<br>'+err.details+'</span>');
                    },
                    onload: function() {
                        jQuery(linediv).append('<span class="download_ok">✓</span>');
                    }
                });
//                downloads.push(dl);
            })(URL,file,name,line);

        }

    }
    function copyText() {
        event.stopPropagation();
        let name = getAdName();
        let phone = getPhone();
        let adid = getAdID();
        if (! phone) phone = "";
        phone = phone.replace(/ /g,'').replace(/\+49\(0\)/,'0');
        let phone2 = phone.replace(/[/\-]/g,'').replace(/^(015..)/,"$1-").replace(/^(01[67].)/,"$1-");
        let phone3 = phone.replace(/^0([1-9])/,'+49$1');

        let text = $('.pr-about p').first().text();
        if (text) {
            text = text.replace(/Bitte erw.hne bei deinem Anruf, dass du mich auf .*? gefunden hast\./,'');
        }
/*
        let clublink = $('div#clublink a').attr('href');
        let clubname = $('div#clublink a').text().replace(/> /,'');
        let club = '';
        if (clubname) {
            club = `[URL=https://www.rotelaterne.de${clublink}]${clubname}[/URL], `;
        }
        */
        let URL = properLink();
        let address = $('.address').text();

        let services = $('.pr-services li').map(function(){
            return $.trim($(this).text());
        }).get();
        let service = "";
        if (services) {
            service = services.join(", ");
        }
        let attributes = [];
        $('.pr-profil [fxlayout=column]').each(function() {
            attributes.push("[B]"+$(this).find('strong').text()+"[/B] "+$(this).find('span').text());
        });

        let data = attributes.join(", ");
        let dataBB= `Infoservice\n[QUOTE][SIZE="1"][URL=${URL}][B]${name}[/B][/URL] ([B]SN ${adid}[/B])\n\n${text}\n\n`
        +`${data}\n`
        +`[B]Telefon:[/B] [URL="tel:${phone3}"]${phone}[/URL], ${phone2}, ${phone3}\n`
        +(address ? `[B]Adresse:[/B] [URL="https://www.google.de/maps/place/${address}"]${address}[/URL]\n`:'')
        +`[B]Service:[/B] ${service}\n`
        +`[/SIZE][/QUOTE]`;
        dataBB = dataBB.replace(/ {2,}/g,' ').replace(/\n{3,}/,'\n\n');
        navigator.clipboard.writeText(dataBB);
        console.log(dataBB);
        jQuery('<div class="toast">Infotext kopiert!</div>').appendTo(buttons).delay(1000).fadeOut(1000);
    }
    function shareLink() {
        event.stopPropagation();
        let link = properLink();
        console.log("Link: ",link);
        navigator.clipboard.writeText(link);
        jQuery('<div class="toast">Link kopiert!</div>').appendTo(buttons).delay(1000).fadeOut(1000);
    }
    function properLink() {
        return profiledata['url'];
    }
    function LHsearch() {
        let phone = getPhone();
        let name = getAdName();
        if (! phone) phone = "";
        phone = phone.replace(/[ \/\-]/g,'').replace(/\+49\(0\)/,'0').replace(/^49/,'0');
        let phone2;
        if (phone.match(/^015/)) {
            phone2 = phone.replace(/^(.....)(.*)/g,'$1-$2');
        } else {
            phone2 = phone.replace(/^(....)(.*)/g,'$1-$2');
        }
        var searchterm = '("'+name+'"'+(phone? ' OR ' +phone+ (phone == phone2?'':' OR '+phone2):'')+')';
        var url = 'https://www.google.de/search?as_sitesearch=lusthaus.cc&';
        url += 'q='+searchterm;
        window.open(url);
    }

    function getAdID() {
        let url = location.href.replace(/\?.*/,''); // cut any parameters
        let ID = url.match(/profile\/(\d+)/);
        return ID[1];
    }
    function getAdName() {
        if (profiledata['name']) {
            return profiledata['name'];
        } else {
            let el = jQuery('h1 > strong');
            if (el.length) return jQuery(el).text();
        }
    }
    function getPhone() {
        return profiledata['telephone'];
    }
};