// ==UserScript==
// @name         MarktEnhancer
// @namespace https://greasyfork.org/users/290665
// @version      1.5.1
// @description  Usability fixes
// @match        https://*.markt.de/*
// @grant    GM_addStyle
// @grant    GM_download
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @resource
// @downloadURL https://update.greasyfork.org/scripts/400746/MarktEnhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/400746/MarktEnhancer.meta.js
// ==/UserScript==

addStyle();
const myVersion = GM_info.script.version;

var dlname;
var PHONE = "";
var NAME = "";
var TITLE = "";
$(function() {

    $("head").append ('<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" type="text/css">');
    var encphone = $('#clsy-c-expose-phone-number').data('phone');
    var phone = (typeof encphone !== 'undefined') ? decPh(encphone) : '';
//    console.log("phone: ",$('#clsy-c-expose-phone-number').data('phone')," -> ",phone);

    if (phone.length) {
        phone = phone.replace(/\+ +/,'+');
        var url = phone.replace(/[ -]+/g,'');
        var search = phone.replace(/ +/g,'%20');
    }
    PHONE = phone;
    PHONE = PHONE.replace(/\+49 ?/,'0').replace(/ \/ /,'-');

    $('#clsy-c-expose-phone-number').replaceWith("<a href=\"tel:"+phone+"\">"+PHONE+"</a>");

    var NAMEO = $('#clsy-c-expose-header').first().text();
    TITLE = NAMEO;
    NAME = NAMEO;

    if (PHONE.match(/^(015\d\d)(\d+)$/)) {
        PHONE = PHONE.replace(/^(015\d\d)(\d+)$/,"$1-$2");
    } else if (PHONE.match(/^(01[67]\d)(\d+)$/)) {
        PHONE = PHONE.replace(/^(01[67]\d)(\d+)$/,"$1-$2");
    }

    var phonews = PHONE.replace(/[ \-/]+/g,'');
    let profilename;
    let profilesearch = '';
    if ($('.clsy-c-userbox__profile-name').length) {
        profilename = $('.clsy-c-userbox__profile-name').text();
        NAME =  profilename + " - " + NAME;
        TITLE = profilename + " - " + TITLE;
        profilesearch = `"${profilename}" OR `;
    }
    var SEARCHTERM = `(${profilesearch}"${NAMEO}" OR "${PHONE}" OR ${phonews})`;

    NAME = NAME.replace(/ß/,'ss')
        .replace(/[^\w-\(\)äöü ]/ig,'')
        .replace(/\b(scharfe?|sexy|neue?[sr]?|will|[dw]ie|[wd]er|biete|auch|an|[wd]as|und|[dz]u|zu[rm]|sie|in|add?resse|m[üu]e?nchen|geile?|mit|aus|mega|service|original|100|(ph|f)otos?|top|private?)\b/ig,'')
        .replace(/ +/g,' ')
        .replace(/(^ | $)/g,'')
        .substring(0,64);

    dlname = NAME + (PHONE ? ' - ' + PHONE: '');


    var dlArea = $('<div id="markt-enhancer"></div>');
    $(dlArea).append($(`<button id="cpbutton"><span class="material-icons md-18">content_copy</span> Text</button>`).attr('title',`Text kopieren`));
    $(dlArea).append($(`<button id="lhbutton"><span class="material-icons md-18">person_search</span> LH</button>`).attr('title',`Suche nach ${SEARCHTERM}`));
    $(dlArea).append($(`<button id="dlbutton"><span class="material-icons md-18">file_download</span> Bilder</button>`).attr('title',`Download-Ordner: ${dlname}`));
    $(dlArea).append(`<div class="me-logo">MarktEnhancer ${myVersion}</div><div class="dl-area"></div>`);

    $('body').on('click', '#dlbutton', function(event) {
        event.stopPropagation();
        event.preventDefault();
        start();
    });

    $('body').on('click', '#lhbutton', function(event) {
        event.stopPropagation();
        event.preventDefault();

        var url = 'https://www.google.de/search?as_sitesearch=lusthaus.cc&q=';
        url += SEARCHTERM;
        window.open(url);
    });
    $('body').on('click', '#cpbutton', function(event) {
        event.stopPropagation();
        event.preventDefault();
        navigator.clipboard.writeText(adData());
    });



    $('.clsy-header__inner').first().append(dlArea);
});

function adData() {
    let title = $('.clsy-c-expose__subject').first().text();
    let url = location.href;
    let body = ($('.clsy-contentsection__subsection').eq(1).text()).trim();
    if (body) body.replace(/\n{2,}/g,"\n\n");
    let attributes = "";
    $('.clsy-attribute-list:first .clsy-attribute-list__item').each(function() {
        let key = ($(this).find('> .clsy-attribute-list__label').text()).trim();
        if (! key.length) return;
        let value = ($(this).find('> .clsy-attribute-list__description').text()).trim();
        attributes += (attributes.length?', ':'');
        attributes += `${key}: [B]${value}[/B]`;
    });
    if (attributes.length) attributes = "\n\n" +attributes + "\n";
    let phone = PHONE.replace(/\D/g,'');
    phone = phone +", "+phone.replace(/^(\d\d\d\d)(.*)/,"$1-$2")
        + ", "+phone.replace(/^(\d\d\d\d\d)(.*)/,"$1-$2")
        + ", [URL=tel:"+phone.replace(/^0/,"+49")+"]"
        + phone.replace(/^0/,"+49")+"[/URL]";
    let place = ($('.clsy-c-expose-details__location').first().text()).trim();

    let bbcode=`Infoservice\n[QUOTE][B][URL=${url}]${TITLE}[/URL][/B]\n\n`;
    bbcode += `${phone}\n`;
    bbcode += "[URL=https://google.de/maps/place/" + encodeURIComponent(place) + `]${place}[/URL]\n\n`;
    bbcode += `[SIZE="1"]${body}${attributes}[/SIZE]`;
    bbcode += "[/QUOTE]";
    return bbcode.replace(/[ \t\xa0]+/g,' ');
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

#markt-enhancer {
	max-height: 150px;
	overflow: auto;
	background-color: rgb(140, 65, 92);
	padding: 4px;
	font-size: 10px;
	position: absolute;
	left: 180px;
	top: 0px;
	z-index: 10;
	color: white;
}

#markt-enhancer button {
	background-color: #f39a00;
	border: none;
	padding: 6px 12px;
	float: right;
	border-radius: 4px;
	text-align: center;
	cursor: pointer;
	margin: 0 0 0 4px;
}

#markt-enhancer button:hover {
	background-color: #fdb332;
}

#markt-enhancer dl-area {
    column-count: 2;
}

.material-icons.md-18 { font-size: 18px; }

`);
}


function start() {
    var downloadlist = [];
    $('[data-fancybox]').each(function() {
        let link = $(this).attr('href');
        if (!link) link = $(this).attr('data-src');
        if (link && link.length) {
            downloadlist.push(link);
        }
    });
    dlAll(dlname,downloadlist);
}

function dlAll(path,downloadlist) {

    var dialog = $('<div id="markt-enhancerdialog" title="Download to '+path+' ..."></div>').appendTo($('#markt-enhancer'));

    for (let URL of downloadlist) {
        var name = URL.replace(/\/image$/,'').replace(/.*\//,'');
        name += ".jpg";
        var file = path.replace(/[^\w-\(\) ]/g,'')+'/'+name;
        URL = URL.replace(/^\/\//,'https://');
        var line = $('<div class="RLDL" data-name="'+name+'">'+name+'</div>\n').appendTo(dialog);

        (function(url,filepath,filename,linediv) {
          /*  console.log(url);
            console.log(filepath);
            console.log(filename); */
            var dl = GM_download({
                url: url,
                name: filepath,
                saveAs: false,
                onerror: function(err){
                    $(linediv).append('<span class="download_error">ERROR: '+err.error+'<br>'+err.details+'</span>');
                },
                onload: function() {
                    $(linediv).append('<span class="download_ok">✓</span>');
                }
            });
        })(URL,file,name,line);

    }
}
function decPh(input) {
    if (typeof input === 'undefined') return;
    return input.replace(/A/g,'8').replace(/B/g,'4').replace(/C/g,'7').replace(/D/g,'1').replace(/E/g,'9').replace(/F/g,'6').replace(/G/g,'0').replace(/H/g,'5').replace(/I/g,'3').replace(/J/g,'2');
}

