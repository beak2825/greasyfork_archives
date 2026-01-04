// ==UserScript==
// @name         BIhelper
// @version      1.2
// @grant        GM_download
// @grant        GM_addStyle
// @namespace    https://greasyfork.org/users/290665
// @description  Auto-DL
// @include      https://www.berlinintim.de/*
// @downloadURL https://update.greasyfork.org/scripts/421394/BIhelper.user.js
// @updateURL https://update.greasyfork.org/scripts/421394/BIhelper.meta.js
// ==/UserScript==

$(function() {
    addstyle();

    var NAME = $('title')
        .text()
        .replace(/ +$/,'');
    var PHONE = $('.telefon_button').last().attr('href');
    PHONE = PHONE
        .replace(/^javascript:.*/i,'')
        .replace(/^#/i,'')
        .replace(/tel:/,'')
        .replace(/\+49 */,'0')
        .replace(/ \/ /,'-')
        .replace(/ +/,'-');
    NAME = NAME.replace(/(Privatmodell|(Highclass-)?Escort|Gastmodell|Transsexuelle)\s*/ig,'');
    NAME = NAME.replace(/[^\w-\(\)äöüÄÖÜß ]/g,'');
    var name = NAME + (PHONE?' - ' + PHONE:'');
    var dlArea = $('<div id="BIhelper"></div>');
    $('<button title="download '+name+'"><span class="material-icons md-18">download</span></b></button>')
        .data('name',name)
        .on('click', function(event) {
            downloadAll($(event.currentTarget).data('name'));
        }).appendTo(dlArea);
    $('<button title="copy text"><span class="material-icons md-18">content_copy</span></b></button>')
        .on('click', function(event) {
            navigator.clipboard.writeText(adData());
            $("<div>OK</div>").appendTo($(this))
                .delay(2000).fadeOut(1000, function() {
                $(this).remove();
            });
        }).appendTo(dlArea);

    $(dlArea).find("button").addClass("head_btn");

    $(dlArea).find('button');
    $('.hl_date').first().append(dlArea);
});

function downloadAll(name) {
    let downloadlist = [];
    $('img.slider_img').each(function() {
        var link = $(this).attr('src');
        if (link.length) {
            downloadlist.push(link.replace(/\?.*/,''));
        }
    });
    let listUnique = [...new Set(downloadlist)];
    startDownload(name,listUnique);
}

function startDownload(path,downloadlist) {

    var dialog = $('<div id="BIhelperdialog" title="Download to '+path+' ..."></div>').appendTo($('#BIhelper'));

    for (let URL of downloadlist) {
        var name = URL.replace(/.*\//,'');
        var file = path.replace(/[^\w-\(\)äöüÄÖÜß ]/g,'')+'/'+name;
        URL = URL.replace(/^\/\//,'https://');
        var line = $('<div class="BIDL" data-name="'+name+'">'+name+'</div>').appendTo(dialog);
        (function(url,filepath,filename,linediv) {
            var dl = GM_download({
                url: url,
                name: filepath,
                saveAs: false,
                onerror: function(err){
                    console.error(err);
                    $(linediv).append('<span class="download_error">ERROR: '+err.error+' - '+err.details+'</span>')
                        .delay(2000).fadeOut(1000, function() {
                            $(this).remove();
                        });
                },
                onload: function() {
                    $(linediv).append('<span class="download_ok">✓</span>')
                        .delay(2000).fadeOut(1000, function() {
                            $(this).remove();
                        });
            },
            });
        })(URL,file,name,line);

    }
}
function adData() {
    let name = $('h1.ellipsis').text();

    let subheader = "";
    let text = "";
    $('.sedcard_facts_modell .blocktext_hl').each(function(undefined,el) {
        let key = $(el).text().trim();
        let val = $(el).nextUntil('.blocktext_hl').find("*").addBack().contents()
         .filter(function() {
          return (this.nodeType === 3) && ($(this).text().match(/\w/i));
        })
        .map(function() {
            return $(this).text().trim().replace(/\u00A0/,' ')
        }).get().join(", ");
        if (key && val) text += $(el).text().trim() + " [B]" + val + "[/B]\n";
    });
    $('div.block_teaser .blocktext_hl').each(function(undefined,el) {
        let key = $(el).text().trim();
        let val = $(el).nextUntil('.blocktext_hl').find("*").not(".sternchentext").addBack().contents()
         .filter(function() {
          return (this.nodeType === 3) && ($(this).text().match(/\w/i));
        })
        .map(function() {
            return $(this).text().trim().replace(/\u00A0/,' ')
        }).get().join(", ");
        if (key && val) text += $(el).text().trim() + " [B]" + val + "[/B]\n";
    });
    let stbr = [];
    $("h2:contains(Mein Steckbrief)").parent().parent().parent().find('.block_teaser div.row').each(function(undefined,el) {
        let key = $(el).children("div").eq(0).text().replace(/\u00A0/,' ').trim();
        let val = $(el).children("div").eq(1).text().replace(/\u00A0/,' ').trim();
        if (key && val) stbr.push(`${key}: [B]${val}[/B]`);
    });

    text += stbr.join(", ");

    let URL = window.location.href;
    let address = $('#adress_0 > div').first().contents().filter(function() {
        return (this.nodeType === 3) && ($(this).text().match(/\w/i));
    }).map(function() {
        return $(this).text().trim().replace(/\u00A0/,' ')
    }).get().join(", ");
    let gmap_address = encodeURIComponent(address);
    let adressdetail = $('#adressdetail0').text().trim();
    // let service = $('div.tablet-info-service').html()
    //     .replace(/\n/g,'')
    //     .replace(/<(\/)?h2>/g,'[$1B]')
    //     .replace(/\[B\]/g,'\n[B]')
    //     .replace(/\[\/B\]/g,':[/B]');
    // let languages = '';
    let dataHTML = "Infoservice\n"
        +`[QUOTE][URL=${URL}][SIZE="3"][B]${name}[/B][/SIZE]\n`
        +`${subheader}[/URL]`
        +`[SIZE="1"]\n${text}\n\n`
        // +`[B]Telefon:[/B] [SIZE="3"]${phone}[/SIZE], ${phone2}, ${phone3}\n`
        +`[B]Adresse:[/B] [URL=https://www.google.de/maps/place/${gmap_address}]${address}[/URL] ${adressdetail}`
        // +`${service}\n`
        +`[/SIZE][/QUOTE]`;
    dataHTML = dataHTML.replace(/ {2,}/g,' ').replace(/\n{3,}/,'\n\n');
    //console.log(dataHTML);
    return dataHTML;
}


function addstyle() {
    $('head').append('<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">');
    GM_addStyle(`
    #BIhelper {
        max-height: 150px;
        overflow: auto;
        font-size: 10px;
        position: absolute;
        right: 10px;
        top: 11px;
        z-index: 100;
    }

    #BIhelper button {
        padding: 5px 10px;
        background-color: #980403;
        color: #fff;
        border: none;
        margin-left: 8px;
        position: relative;
        overflow: visible;
    }

    .BIDL {
        background-color: black;
    }
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

    `);
}