// ==UserScript==
// @name         Quokagaga
// @namespace    https://greasyfork.org/users/290665
// @version      1.1
// @description  Usability fixes
// @match        https://*.quoka.de/*
// @grant        GM_addStyle
// @grant        GM_download
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/422492/Quokagaga.user.js
// @updateURL https://update.greasyfork.org/scripts/422492/Quokagaga.meta.js
// ==/UserScript==

addStyle();
const myVersion = GM_info.script.version;

var dlname = "xxx";

jQuery(function() {

    jQuery("li.div-gpt-goeafe").hide(); // hide ads

    var phone = jQuery(".phone-contacts li[data-qa-contact]").data('qa-contact');
    var PHONE = "";

    if (phone && phone.length) {
        phone = phone.replace(/\+ +/,'+');
        var url = phone.replace(/[ -]+/g,'');
        var search = phone.replace(/ +/g,'%20');
        PHONE = phone;
        PHONE = PHONE.replace(/\+49 ?/,'0').replace(/ \/ /,'-');
    }

    jQuery('a.display-phone-number').parent().replaceWith(jQuery(".phone-contacts li[data-qa-contact]").show());

    var NAMEO = jQuery('h1[itemprop=name]').text();
    var NAME = NAMEO;

    if (NAME) {
        NAME = NAME.replace(/ß/,'ss')
            .replace(/[^\w-\(\)äöü ]/ig,'')
            .replace(/\b(scharfe?|sexy|neue?[sr]?|will|[dw]ie|[wd]er|biete|auch|an|[wd]as|und|[dz]u|zu[rm]|sie|in|add?resse|m[üu]e?nchen|geile?|mit|aus|mega|service|original|100|(ph|f)otos?|top|private?)\b/ig,'')
            .replace(/ +/g,' ')
            .replace(/(^ | $)/g,'')
            .substring(0,64);
        dlname = NAME + (PHONE ? ' - ' + PHONE: '');
    }


    var phonews = PHONE.replace(/ /g,'');
    var SEARCHTERM = `("${NAMEO}" OR "${PHONE}" OR ${phonews})`;

    var dlArea = jQuery('<div id="quokagaga" class="box blue brd-grey util-links"><ul></ul></div>');
    jQuery(dlArea).find("ul").append(`<div class="me-logo">Quokagaga ${myVersion}</div>`);
    jQuery(dlArea).find("ul").append(jQuery(`<li><a id="lhbutton"><b>🔍 LH</b></a></li>`).attr('title',`Suche nach ${SEARCHTERM}`));
    jQuery(dlArea).find("ul").append(jQuery(`<li><a id="dlbutton"><span>💾 Bilder herunterladen</a></li>`).attr('title',`Download-Ordner: ${dlname}`));
    jQuery(dlArea).append(`<div class="dl-area"></div>`);
    jQuery(".user-info-wrapper").after(dlArea);

    jQuery('body').on('click', '#dlbutton', function(event) {
        event.stopPropagation();
        event.preventDefault();
        start();
    });

    jQuery('body').on('click', '#lhbutton', function(event) {
        event.stopPropagation();
        event.preventDefault();

        var url = 'https://www.google.de/search?as_sitesearch=lusthaus.cc&q=';
        url += SEARCHTERM;
        window.open(url);
    });
});

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

#quokagaga {
	overflow: auto;
}

#quokagaga a {
	cursor: pointer;
}

#quokagaga a:hover {
	background-color: #fcce2b;
}
.me-logo {
	background: #2c97de;
	color: white;
	padding: 8px 12px;
	text-align: right;
}
`);
}


function start() {
    var AdNo = JSON.parse(jQuery('#AdDetailData').text())['adno']
    jQuery.ajax({
        url: "/index.php?controller=ajax&action=getimages",
        dataType: "json",
        data: {
            adno: AdNo
        }
    }).done((function (i) {
        dlAll(dlname,i.images);
    }));
}


function dlAll(path,downloadlist) {

    var dialog = jQuery('<div id="quokagagadialog" title="Download to '+path+' ..."></div>').appendTo(jQuery('#quokagaga'));

    for (let image of downloadlist) {
        var URL = image['src'];
        var name = URL.replace(/.*\//,'');
        var file = path.replace(/[^\w-\(\) ]/g,'')+'/'+name;
        URL = URL.replace(/^\/\//,'https://');
        var line = jQuery('<div class="RLDL" data-name="'+name+'">'+name+'</div>\n').appendTo(dialog);

        (function(url,filepath,filename,linediv) {
          /*  console.log(url);
            console.log(filepath);
            console.log(filename); */
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
