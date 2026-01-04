// ==UserScript==
// @name         AMImgDLer
// @version      1.1
// @namespace    https://greasyfork.org/users/290665
// @description  Easily download photos
// @grant        GM_download
// @grant        GM_addStyle
// @match        *://*.augsburg-models.com/model/*
// @icon         https://www.google.com/s2/favicons?domain=augsburg-models.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js
// @downloadURL https://update.greasyfork.org/scripts/429370/AMImgDLer.user.js
// @updateURL https://update.greasyfork.org/scripts/429370/AMImgDLer.meta.js
// ==/UserScript==

$(function() {
    addStyle();
    $(document).on('keydown', function(ev) {
        if (ev.keyCode == 27) {
           removebigcanvas();
        }
    });

    $('head').append('<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">');

    var buttons = $("<div>").attr('id','amimgdler').prependTo('#modelcardtabs');
    console.log(buttons);
    $('<div class="AMDLversion"><a title="Click to check for update!" href="https://sleazyfork.org/de/scripts/429370-amimgdler">'
      +GM_info.script.name+'</a> '
      +GM_info.script.version+'</div>')
        .appendTo(buttons);
    $('<div style="border:none;" class="ui-state-default ui-corner-top amimgdler-btn"><a href="#"> show all</a></div>').on('click', function() {
        showall(allImgURLs(),path);
    }).appendTo(buttons);
    $('<div style="border:none;" class="ui-state-default ui-corner-top amimgdler-btn"><a href="#"><span class="material-icons md-18">download</span>  Download all</a></div>').on('click', function() {
        dlAll(path);
    }).appendTo(buttons);
    $('<div style="border:none;" class="ui-state-default ui-corner-top amimgdler-btn"><a href="#"><span class="material-icons md-18">search</span> LH</a></div>').on('click', function() {
        LHsearch(NAME,PHONE);
    }).appendTo(buttons);

    var NAME = $('.geoadress span').first().text().trim();
    var PHONE = $('a.tel').first().text().trim()
    var adno = location.href.replace(/.*\/model\/([0-9]+).*/,"$1");
    var path = NAME + " - " + PHONE + " (AM-"+adno+")";
});
function LHsearch(name,phone) {
    phone = phone.replace(/ /g,'').replace(/\+49(\(0\))?/,'0').replace(/[/\-]/g,'');

    let phones = [phone];
    phones.push(phone.replace(/^(\d{4})/,"$1-"));
    phones.push(phone.replace(/^(\d{5})/,"$1-"));
    phones.push(phone.replace(/^(015510)/,"$1-"));
    phones.push(`+49${phone}`);

    var searchterm = `${name}`;
    for (const ph of phones) {
        searchterm += ` OR ${ph}`;
    }
    var url = 'https://www.google.de/search?as_sitesearch=lusthaus.cc&';
    url += `q=(${searchterm})`;
    window.open(url);
}
function allImgURLs() {
    let URLs = [];
    $('.thumb').each(function() {
        URLs.push(
            $(this).attr('rel')
        );
    });
    return URLs;
}
function dlAll(path) {
    let URLs = allImgURLs();

    var dialog = $('<div id="dialog" style="column-count:4;" title="Download to '+path+' ..."></div>').dialog({
        width: 400,
        height:400
    }).on('close', function() {
        console.log("cancel downloads now");
    });
    var downloads = [];
    for (var URL of URLs.values()) {
        var name = URL.replace(/.*\//,'');
        var file = path+'/'+name;
        URL = URL.replace(/^\/\//,'https://');
        var line = $('<div class="RLDL" data-name="'+name+'">'+name+'</div>\n').appendTo(dialog);
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
function showall(images,title) {
    var bigcanvas = $("<div class=\"bigcanvas\"></div>");
    var buttonsdiv = $('<div class="buttons"><span>'+title+'<span> <button class="RLDLbutton">close (ESC)</button></div>')
        .on('click', removebigcanvas).appendTo(bigcanvas);
    $(bigcanvas).appendTo('body');
    for (let image of images) {
        $('<img src="'+image+'">').on('error', function() {
            $(this).remove();
        }).appendTo(bigcanvas);
    }
}
function removebigcanvas() {
    $('.bigcanvas').remove();
    window.scrollTo(0, 0);
}

function addStyle() {
        GM_addStyle(`
#modelcardtabs .amimgdler-btn {
    display: inline-block;
    background: linear-gradient(180deg, white, #b70002 50%);
    border-radius: 8px;
    padding: 4px 8px;
    margin-left: 8px;
}

#modelcardtabs .amimgdler-btn>a {
    height: 14px;
    width: auto;
    font-size: 12px;

}

li.amimgdler-btn.ui-state-default {
    background: none !important;
}

.bigcanvas img {
    max-width: 100%;
    max-height: 100vh;
    margin: 1px;
}

.bigcanvas {
    position: absolute;
    top: 1px;
    z-index: 10000;
    background-color: #88062ad0;
    text-align: center;
    left: 1px;
    right: 1px;
    font-size: 22px;
}

.bigcanvas .buttons {
    position: sticky;
    top: 0;
    left: 0;
    color: white;
    padding: 4px;
    background: rgba(0, 0, 0, 0.3);
}

#RLImgDLer a.imgdl,
#RLImgDLer a.RLDLbutton {
    color: white;
    margin: 0 2px;
    padding: 0 4px;
    font-size: 12px;
    background: #b51f2d;
    border-radius: 2px;
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

.RLDLbutton {
    position: relative;
    vertical-align: top;
    padding: 2px 6px;
    font-size: 14px;
    color: #fff;
    text-align: center;
    text-shadow: 0 1px 2px rgba(0, 0, 0, .25);
    background: #b51f2d;
    border: 0;
    border-bottom-color: currentcolor;
    border-bottom-style: none;
    border-bottom-width: 0;
    border-bottom: 2px solid #da1c37;
    cursor: pointer;
    border-radius: 3px;
    margin-left: 4px;
    margin-right: 4px;
    line-height: 20px;
    top: 1px;
}

.RLDLbuttongroup {
    position: absolute;
    right: 15px;
    top: 3px;
}

.AMDLversion {
    color: #b70002;
    display: inline-block;
    margin-left: 8px;
    position: relative;
    font-size: 12px;
}

.AMDLversion a {
    color: inherit;
    text-decoration: underline;
    font-size: inherit;
}

#allImg {
    border: 3px solid #88062a;
    background-color: white;
    padding: 4px;
    margin-top: 4px;
    box-shadow: 0 0 10px black;
    overflow: hidden auto;
}

div#sedcard-gallery {
    overflow: visible;
}

.material-icons.md-18 {
    font-size: 18px;
    position: relative;
    top: 4px;
    line-height: 4px;
}
`);
}