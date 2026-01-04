// ==UserScript==
// @name     SGImgDLer
// @version  1.0
// @grant    GM_download
// @grant    GM_addStyle
// @match    https://sexxxgirls.com/girl/*
// @namespace https://greasyfork.org/users/290665
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @description Auto-DL
// @downloadURL https://update.greasyfork.org/scripts/395972/SGImgDLer.user.js
// @updateURL https://update.greasyfork.org/scripts/395972/SGImgDLer.meta.js
// ==/UserScript==

$(function() {
    addStyle()
    var NAME = $('#main_container>#bread_crumbs>ul>ol').text();
    var PHONE = $('#df_field_phone_number .value strong').first().text()
    NAME = NAME.replace(/[^\w-\(\) ]/g,'');

    var name = NAME;
    if (PHONE) {
        PHONE = PHONE.replace(/ *\/ */g,'-');
        name += ' - ' + PHONE;
    }
    var button = $('<div id="SGImgDLer"><button>Download <b>'+name+'</b></button></div>');

    button.on('click', function() {
        start(name);
    });
    $('#bread_crumbs').append(button);

});

function start(name) {
    var downloadlist = [];
    $('.swiper-wrapper li img').each(function() {
        var link = $(this).attr('src');
        downloadlist.push(link.replace(/(\d+)-F(\d+)\./,'$1-A$2.'));
    });
    dlAll(name,downloadlist);
}

function dlAll(path,downloadlist) {

    var dialog = $('<div id="SGImgDLerdialog" title="Download to '+path+' ..."></div>').appendTo($('#SGImgDLer'));

    for (let URL of downloadlist) {
        var name = URL.replace(/.*\//,'');
        var file = path.replace(/[^\w-\(\) ]/g,'')+'/'+name;
        URL = URL.replace(/^\/\//,'https://');
        var line = $('<div class="RLDL" data-name="'+name+'">'+name+'</div>\n').appendTo(dialog);

        (function(url,filepath,filename,linediv) {
            var dl = GM_download({
                url: url,
                name: filepath,
                saveAs: false,
                onerror: function(err){
                    $(linediv).append('<span class="download_error">ERROR: '+err.error+'<br>'+err.details+'</span>');
                    console.error(url,filepath,err);
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
/* i really want this to be global */
@import url('https://fonts.googleapis.com/css?family=Roboto+Condensed:400,400i,700,700i|Roboto:400,400i,500,500i,700,700i&display=swap');
#SGImgDLer {
    max-height: 150px;
    overflow: auto;
    background-color: rgba(255, 255, 255, .52);
    padding: 4px;
    font-size: 10px;
    column-count: 2;
    display: inline-block;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 10;
}
#SGImgDLer button {
    column-span: all;
    display:block;
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

