// ==UserScript==
// @name         and6dl
// @description  Eases the downloading of ad pictures
// @version      0.2
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @include      https://and6.com/sex-model/*
// @include      https://www.and6.com/sex-model/*
// @namespace    https://greasyfork.org/users/290665
// @resource     IMPORTED_CSS https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @downloadURL https://update.greasyfork.org/scripts/454104/and6dl.user.js
// @updateURL https://update.greasyfork.org/scripts/454104/and6dl.meta.js
// ==/UserScript==

$(function() {
    GM_addStyle(GM_getResourceText("IMPORTED_CSS"));
    addStyle();
    $('head').append('<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">');
    var R = $('<div id="and6dl"></div>');
    R.prependTo('#left');
    $('<div class="and6dlversion"><a title="Click to check for update!" href="https://greasyfork.org/en/scripts/454104-and6dl">'+GM_info.script.name+'</a> '+GM_info.script.version+'</div>').appendTo(R);
    $('<button><span class="material-icons md-18">download</span></button>')
        .attr('title','Download all photos')
        .on('click', function(ev) {
        dlAll();
    }).appendTo(R);
    $('<button><span class="material-icons md-18">content_copy</span></button>')
        .attr('title','Copy ad data')
        .on('click', function(ev) {
        dlAll();
    }).appendTo(R);
    $('<button><span class="material-icons md-18">search</span></button>')
        .attr('title','Search LH')
        .on('click', function(ev) {
        dlAll();
    }).appendTo(R);
    /* restore right click functionality */
/*    $('img').each(function(el) {
        console.log($(el).get(0));
        $(el).get(0).removeEvents('contextmenu');
    });*/

});
function LHsearch() {
    let name = $('.head.info > span').text();
    let phone = $('.one a').first().html();
    if (! phone) phone = "";
    phone = phone.replace(/ /g,'').replace(/\+49\(0\)/,'0');
    var phone2 = phone.replace(/[/\-]/g,'');
    var adname = window.location.pathname.replace(/^\//,'');

    var searchterm = '("'+adname+'" OR '+name+(phone? ' OR ' +phone+ (phone == phone2?'':' OR '+phone2):'')+')';
    var url = 'https://www.google.de/search?as_sitesearch=lusthaus.cc&';
    url += 'q='+searchterm;
    window.open(url);
}
function adData() {
    let name = $('.head.info > span').text();
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
function dlAll() {

    $('.load-more').trigger('click');

    let path = $('.head.info > span').text();
    var URLs = allImgURLs();
console.log(URLs);
    var dialog = $('<div id="dialog" title="Download to '+path+' ..."></div>').dialog({
        width: 500,
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

function allImgURLs() {
    var URLs = [];
    $('#gallery img').each(function(no,el) {
        let url = $(el).attr('src').replace(/\?.*/,'').replace(/_p[pl]\./,'_orig.');

        URLs.push(url);
    });
    return URLs;
}
function addStyle() {
        GM_addStyle(`
#and6dl {
    box-sizing: border-box;
    background: linear-gradient(180deg, rgba(223,58,138,0.3) 0%, rgba(206,30,105,0.3) 100%);
    padding:2px;
    border-radius: 4px;
    text-align: right;
}
#and6dl button {
    background: rgb(223,58,138);
    background: linear-gradient(180deg, rgba(223,58,138,1) 0%, rgba(206,30,105,1) 100%);
    color: white;
    margin: 0 2px;
    padding: 0 4px;
    border-radius: 4px;
    height: 24px;
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

.and6dlversion {
    display: inline-block;
    margin-left: 8px;
}
.RLDLversion a {
    color: inherit;
    text-decoration: underline;
}
#allImg {
    border: 3px solid #88062a;
    background-color: white;
    padding: 4px;
    margin-top: 4px;
    box-shadow: 0 0 10px black;
    overflow: hidden auto;
}
.material-icons.md-18 {
    font-size: 18px;
    position: relative;
    line-height: 12px;
}
`);
}