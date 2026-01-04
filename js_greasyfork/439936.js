// ==UserScript==
// @name         MHenhancer
// @namespace    https://greasyfork.org/users/290665
// @version      1.4
// @description  Link fixer, Image Downloader
// @include      /https://(www\.)?modelle-hamburg\.de/.*/[^/]*_\d+(\.html)?/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=modelle-hamburg.de
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @resource     IMPORTED_CSS https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @downloadURL https://update.greasyfork.org/scripts/439936/MHenhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/439936/MHenhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(GM_getResourceText("IMPORTED_CSS"));
    GM_addStyle(`
.toast {
    position: absolute;
    background-color: #cc0b75;
    top: -23px;
    width: 98%;
    text-align: center;
    color: #fff;
    font-weight: bold;
}
`);
    let baseURL = window.location.protocol + "//" + window.location.host;
    let buttons = jQuery('#mainframe > div.row > div:nth-child(2) > div:first-child');
    window.setTimeout(getPhone, 500);
    window.setTimeout(getPhone, 1000);
    window.setTimeout(getPhone, 2000);
    window.setTimeout(getPhone, 3000);
    jQuery('<button id="downloadAll" class="mh-gradient-lightblue mh-btn-default mh-btn-slim" title="Alle Bilder herunterladen"\
        style="margin-left:16px;position:relative; top:-4px;"><span class="glyphicon glyphicon-download"></span>\
        herunterladen</span></button>')
        .on('click', downloadAll)
        .appendTo('#image-active-tab > a');
    jQuery('<div class="col-sm-1"><button class="mh-btn-default mh-btn-slim m-l-sm" title="Anzeigentext für ein Forum kopieren">\
        <span class="glyphicon glyphicon-copy"></span></button></div>')
        .on('click', copyText)
        .appendTo(buttons);
    jQuery('<div class="col-sm-1"><button class="mh-btn-default mh-btn-slim m-l-sm" title="Anzeigenlink kopieren">\
        <span class="glyphicon glyphicon-share"></span></button></div>')
        .on('click', shareLink)
        .appendTo(buttons);
    jQuery('<div class="col-sm-1"><button class="mh-btn-default mh-btn-slim m-l-sm" title="Im Lusthaus suchen (in neuem Tab)">\
        <span class="glyphicon glyphicon-search"></span>LH</button></div>')
        .on('click', LHsearch)
        .appendTo(buttons);
    function downloadAll() {
        let path = getAdName() + " (MH " + getAdID() + ")";
        let phone = getPhone();
        if (phone) path += " - " + phone;
        var dialog = $('<div id="dialog" title="Download to '+path+' ..."></div>').dialog({
            width: 640,
            height:480
        }).on('close', function() {
            console.log("cancel downloads now");
        });

        let imgList = [];
        jQuery('.image-gallery-main img[data-flickity-superlazyload]').each(function() {
            let image = jQuery(this).attr('data-flickity-superlazyload');
            if (image) {
                console.log("Found ",image);
                imgList.push(image);
            } else {
                console.log("ERROR",image);
            }
        });
        for (let name of imgList) {
            console.log("Download ", name);
            let URL = `${baseURL}/images/_${name}`;

            let file = (path+'/'+name+".jpg").replace(/\/\d+\//,'/');
            var line = jQuery('<div class="RLDL" data-name="'+name+'">'+file+'</div>\n').appendTo(dialog);

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
        let name = getAdName();
        let phone = getPhone();
        if (! phone) phone = "";
        phone = phone.replace(/ /g,'').replace(/\+49\(0\)/,'0');
        let phone2 = phone.replace(/[/\-]/g,'');
        let phone3 = phone2.replace(/^0([1-9])/,'+49$1');

        let subheader = $('#images h1.model-name').first().html();
        if (subheader) subheader = subheader.replace(/^(.+?) - /,'');
        let text = $('#mainframe .about-text').first().text();
/*
        let clublink = $('div#clublink a').attr('href');
        let clubname = $('div#clublink a').text().replace(/> /,'');
        let club = '';
        if (clubname) {
            club = `[URL=https://www.rotelaterne.de${clublink}]${clubname}[/URL], `;
        }
        */
        let URL = properLink();
        let street = $('#anfahrtbox table tr:first-child td').text();
        street ||= $('#mainframe > div.row > div:nth-child(2) > div.panel.panel-default.mh-panel.model-panel.panel-last.fixed-about-me > div.panel-body > table > tbody > tr:nth-child(2) > td').text();
        if (street.match(/Sage ich Dir am Telefon/i)) street = '';
        let city = $('#anfahrtbox table tr:nth-child(2) td').text();
        city ||= $('#mainframe > div.row > div:nth-child(2) > div.panel.panel-default.mh-panel.model-panel.panel-last.fixed-about-me > div.panel-body > table > tbody > tr:nth-child(3) > td').text();
        let address = street ? street + ", " + city : city;
        let service = $('#mainframe div.service-panel ul').html();
        if (service) {
            service = service
                .replace(/\n/g,'')
                .replace(/<label>.*<\/label>/,'')
                .replace(/<\/li>\s*<li>/g,', ')
                .replace(/<.+?>/g,'')
                .replace(/\[B\]/g,'\n[B]')
                .replace(/\[\/B\]/g,':[/B]')
                .replace(/^[ ,]+/g,'');
        }
        let data = $('#mainframe table.model-details').html();
        if (data) {
            data = data
                .replace(/\n/g,'')
                .replace(/<(\/)?th>/g,'[$1B]')
                .replace(/<.+?>/g,' ')
                .replace(/ *\[B\]/g,', [B]')
                .replace(/\[\/B\]/g,':[/B]')
                .replace(/ +/g,' ')
                .replace(/^[ ,]+/g,'');
        }
        let adid = getAdID();
        let dataBB= `Infoservice\n[QUOTE][SIZE="1"]MHID = ${adid} | MHID${adid}\n\n[URL=${URL}][B]${name}[/B]\n${subheader}[/URL]\n\n${text}\n\n`
        +`${data}\n`
        +`[B]Telefon:[/B] [URL="tel:${phone3}"]${phone}[/URL], ${phone2}, ${phone3}\n`
        +(address ? `[B]Adresse:[/B] [URL="https://www.google.de/maps/place/${address}"]${address}[/URL]\n`:'')
        +`[B]Service:[/B] ${service}\n`
        +`[/SIZE][/QUOTE]`;
        dataBB = dataBB.replace(/ {2,}/g,' ').replace(/\n{3,}/,'\n\n');
        navigator.clipboard.writeText(dataBB);
        jQuery('<div class="toast">Infotext kopiert!</div>').appendTo(buttons).delay(1000).fadeOut(1000);
    }
    function shareLink() {
        let link = properLink();
        console.log("Link: ",link);
        navigator.clipboard.writeText(link);
        jQuery('<div class="toast">Kopiert!</div>').appendTo(buttons).delay(1000).fadeOut(1000);
    }
    function properLink() {
        let id = getAdID();
        let link = `${baseURL}/modelle/x/x/_${id}.html`;
        return link;
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
        let ID = url.match(/_(\d+)(\.html.*)?$/);console.log
        return ID[1];
    }
    function getAdName() {
        let el = jQuery('#mainframe > div.row > div:nth-child(2) > div.panel.panel-default.mh-panel.model-panel.panel-last.fixed-about-me > div.panel-body > table > tbody > tr:nth-child(1) > td');
        if (el.length) return jQuery(el).text();
    }
    function getPhone() {
        if ( typeof getPhone.counter == 'undefined' ) getPhone.counter = 0;
        if (jQuery('a[href^="tel:"]').length) {
            let phoneurl = jQuery('a[href^="tel:"]').attr('href');
            return phoneurl.replace(/^tel:/,'');
        } else {
            getPhone.counter++;
            jQuery('input.phonebutton').trigger('click');
        }
    }
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
})();