// ==UserScript==
// @name         RLImgDLer
// @description  Eases the downloading of ad pictures
// @version      2.10
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        unsafeWindow
// @include      https://www.rotelaterne.de/*
// @namespace    https://greasyfork.org/users/290665
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @resource     IMPORTED_CSS https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @downloadURL https://update.greasyfork.org/scripts/382681/RLImgDLer.user.js
// @updateURL https://update.greasyfork.org/scripts/382681/RLImgDLer.meta.js
// ==/UserScript==

var NAME, PHONE, ADNO;
var ALLPHONES = [];
const maxImgSize = '8';
const maxAds = "16";

$(function() {
    GM_addStyle(GM_getResourceText("IMPORTED_CSS"));
    addStyle();
    $('head').append('<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">');
    $('div.ad:has(.affiliate), div.random-ad:has(.affiliate)').addClass('hidden-affiliate'); // hide affiliate ads
    $(document).on('keydown', function(ev) {
        if (ev.keyCode == 27) {
           removebigcanvas();
        }
    });

    let R = $('<div id="RLImgDLer"></div>');

    NAME = $('h1:first-child').html();
    PHONE = $('.phone-number').first().find('a').first().html();
    if (PHONE) PHONE = PHONE.replace(/ \/ /,'-');

    $('.phone-number').first().find('a').each(function(i,el) {
        let phone = $(el).text().trim();
        if (phone) phone = phone.replace(/ \/ /,'-');
        ALLPHONES.push(phone);
    });

    $('.phone-number').clone().appendTo('#contact');

    // let allphoneshtml = ALLPHONES.join("<br/>\n");
    // $("<div class=\"phone-numbers\"></div>").html(allphoneshtml).appendTo("#contact");

    var adlist = $('#sedcard-mobile-gallery a');
    if (adlist.length == 0) return;
    var admatch = adlist.first().attr('href').match(/\/(\d+)\/images\/\d\/(\d{8}\.\w+)$/);
    var adno = admatch[1];
    ADNO=adno;
    var imgHi = 0;
    var imgPath;
    let buttons = $('<div class="RLDLbuttongroup"></div>');

    $('<button class="RLDLbutton" id="onePage" title="alle Bilder auf einer Seite zeigen"><span class="material-icons md-18">grid_on</span> all</button>').on('click', function() {
        showall(adno,imgHi,imgPath);
    }).appendTo(buttons);
    
    $('<button class="RLDLbutton" id="dl-all" title="alle Bilder herunterladen, max. 729x729px"><span class="material-icons md-18">photo_library</span> <span class="material-icons md-18">download</span></button>').on('click', function() {
        var path = NAME+' - '+PHONE+' ('+adno+')';
        path = path.replace(/[^\w\s-\(\)]/g,'');
        dlAll(adno,imgHi,imgPath,path,'8');
    }).appendTo(buttons);
    $('<button class="RLDLbutton" id="copyData" title="Anzeigendaten für Forum kopieren (BBCode)"><span class="material-icons md-18">content_copy</span> LH</button>').on('click', function() {
        navigator.clipboard.writeText(adData('BB'));
        copied(this);
    }).appendTo(buttons);
    $('<button class="RLDLbutton" id="copyData" title="Anzeigendaten als Text kopieren"><span class="material-icons md-18">content_copy</span> txt</button>').on('click', function() {
        navigator.clipboard.writeText(adData());
        copied(this);
    }).appendTo(buttons);
    $('<button class="RLDLbutton" id="LHsearch" title="im Lusthaus suchen"><span class="material-icons md-18">search</span> LH</button>').on('click', function() {
        LHsearch();
    }).appendTo(buttons);
    $("<div class=\"adid\">Ad ID = <b>"+adno+'</b>, <a title="Click to check for update!" href="https://sleazyfork.org/de/scripts/382681-rlimgdler">'+GM_info.script.name+'</a> '+GM_info.script.version +'</div>').appendTo(R);
    $(buttons).appendTo(R);
    $('#sedcard-gallery li img').each(function() {
        let src = $(this).attr('src');
        let targetnew = src.replace(/(\/\d+\/images)\/\d\/(\d{8}\.\w+)$/, '$1/'+maxImgSize+'/$2');
        let imgnum = src.replace(/^.*(\/\d+\/images)\/\d\/(\d{8})\.\w+$/, '$2');
        $(this).css("position","relative");
        imgPath = src.substr(0,src.length-15);
        if (imgnum > imgHi) imgHi = imgnum;
        $('<a>').prependTo($(this).parent()).attr({
            'href' : targetnew,
            'class' : 'imgdl',
            'data-imgno' : parseInt(imgnum),
            'download': ''
        }).html(parseInt(imgnum));
    });
    $(R).appendTo('#top-info');

    $(document).on( 'click', '.ad-image img', function(ev) {
        if ($(this).hasClass('zoomed')) {
            $(this).removeClass("zoomed");
            $('.ad-image, .ad-image-wrapper').css('overflow','hidden');
        } else {
            var url = $(this).attr('src');
            var url_orig = url.replace(/images\/\d\//,'images/8/');
            $('.ad-image, .ad-image-wrapper').css('overflow','visible');
            $(this).attr('src',url_orig).addClass("zoomed");
        }
    });
});
function copied(element) {
   $("<div><span class=\"material-icons md-18\">done</span></div>")
    .width($(element).width()).appendTo($(element)).addClass("copied")
    .hide( "drop", { direction: "up" }, 2000 );
}
function LHsearch() {
    let name = $('h1').first().html();
    let phone = PHONE;
    if (! phone) phone = "";
    phone = phone.replace(/ /g,'').replace(/\+49\(0\)/,'0');
    var phone2 = phone.replace(/[/\-]/g,'');
    var adname = window.location.pathname.replace(/^\//,'');

    var searchterm = '("'+adname+'" OR '+name+(phone? ' OR ' +phone+ (phone == phone2?'':' OR '+phone2):'')+')';
    var url = 'https://www.google.de/search?as_sitesearch=lusthaus.cc&';
    url += 'q='+searchterm;
    window.open(url);
}
function adData(format) {
    let name = NAME;
    let phone = PHONE;
    if (! phone) phone = "";
    phone = phone.replace(/ /g,'').replace(/\+49\(0\)/,'0');
    let phone2 = phone.replace(/[/\-]/g,'');
    let phone3 = phone2.replace(/^0([1-9])/,'+49$1');

    let subheader = $('.slogan').first().text().trim();
    let text = $('#maintext > div')
        .contents()
        .filter(function() {
            return this.nodeType == Node.TEXT_NODE;
        })
        .map(function() {
            return $.trim(this.textContent);
        });  
    text = ($.makeArray(text).join("\n")).trim();
    let times = $('.times').first().text().trim();
    if (times) {
        times = times.replace(/ +/g, " ").replace(/\n\s*(\r?\n)+/g, "\n")
            .replace(/:\n/g,': ').replace(/\n/g,', ');
    }
    let clublink = $('#address a').attr('href');
    let clubname = $('#address a').text().replace(/\s*>/,'');
    let club = '';
    if (clubname) {
        club = `[URL=https://www.rotelaterne.de${clublink}]${clubname}[/URL], `;
    }
    let URL = window.location.href;
    let adPath = URL.replace(/.*\//,'');
    let address = $('#address').text().replace(/Adresse/,'').replace(/\n/g,' ');
    let addresslines = $('#address').contents().filter(function() {
        return this.nodeType == Node.TEXT_NODE && $.trim(this.nodeValue) !== '';
    });
    let gmap_address;
    // console.info(addresslines);
    if (addresslines) {
        let line0 = addresslines[0] ? $.trim(addresslines[0].textContent) : "";
        let line1 = addresslines[1] ? $.trim(addresslines[1].textContent) : "";
        address = line1;
        if (line0) {
            address += (address.length ? ", ":"") + line0
        }
        gmap_address = encodeURIComponent(address);
    };
    let service = '';
    $('#service li').each(function(){
        if (service.length) service += ", ";
        service += $(this).text().trim();
    });
    let attributesHTML = '';
    let attributesTXT = '';
    $('#about-me span:nth-of-type(odd)').each(function() {
        if (attributesHTML.length) attributesHTML += ", ";
        attributesHTML += $(this).text().trim() + " [B]";
        attributesHTML += $(this).next().text().trim() + "[/B]";
        if (attributesTXT.length) attributesTXT += "\n";
        attributesTXT += $(this).text().trim() + " ";
        attributesTXT += $(this).next().text().trim();
    });
    let dataHTML = "Infoservice\n"
        +`[QUOTE][CENTER][SIZE="1"][COLOR="DimGray"]rotelaterne.de/${adPath}[/COLOR][/SIZE][/CENTER]`
        +`[URL=${URL}][SIZE="3"][B]${name}[/B][/SIZE]\n`
        +`${subheader}[/URL]`
        +`[SIZE="1"]\n\n${text}\n\n`
        +`${attributesHTML}\n`
        +`Service: [B]${service}[/B]\n\n`
        +`[B]Telefon:[/B] [SIZE="3"]${phone}[/SIZE], ${phone2}, ${phone3}\n`
        +`[B]Adresse:[/B] ${club} [URL=https://www.google.de/maps/place/${gmap_address}]${address}[/URL]\n`
        + (times ? `[B]Zeiten[/B]: ${times}\n` : "")
        +`[/SIZE][/QUOTE]`;
    dataHTML = dataHTML.replace(/ {2,}/g,' ').replace(/\n{3,}/,'\n\n');
    if (PHONE) PHONE = PHONE.replace(/ \/ /,'-');

    let dataTXT = `${name}\n${subheader}\n\n`
        +`${text}\n\n`
        +`${attributesTXT}\n\n`
        +`Service: ${service}\n\n`
        +`Adresse: ${clubname}, ${address}\n`
        +`Telefon: ` + ALLPHONES.join(", ") + `\n`
        + (times ? `Zeiten: ${times}\n` : "")
        +`\n${URL}\n`;
    return format == "BB" ? dataHTML : dataTXT;
}
function dlAll(adno,imgHi,imgPath,path,size=maxImgSize) {
    var URLs = allImgURLs(adno,imgPath,size);

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

function allImgURLs(adno,imgPath,size=maxImgSize) {
    let URLs = [];
    $('#sedcard-gallery img').each(function(id,el) {
        let url = $(el).attr('src');
        URLs.push(url.replace(/(\/images)\/\d\//,'$1/8/'));
    });
    return [...new Set(URLs)];
}
function showall(adno,imgHi,imgPath) {
    $(".bigcanvas").remove();
    var bigcanvas = $("<div class=\"bigcanvas\"></div>");
    var buttonsdiv = $('<div class="buttons"><span>'+NAME+' '+(PHONE ? PHONE : ' ') + ' (' + ADNO + ')<span> <button class="RLDLbutton">close (ESC)</button></div>').on('click', removebigcanvas).appendTo(bigcanvas);
    $('#dl-all').clone(true).appendTo(buttonsdiv);
    $(bigcanvas).appendTo('body');

    var URLs = allImgURLs(adno,imgPath);

    for (const imgurl of URLs) {
        $(`<img src="${imgurl}">`).on('error', function() {
            $(this).remove();
        }).appendTo(bigcanvas);
    }
}
function removebigcanvas() {
    $('.bigcanvas').remove();
    window.scrollTo(0, 0);
}

unsafeWindow.allImgURLs=allImgURLs;

function addStyle() {
        GM_addStyle(`
#RLImgDLer {
    color: #4c4040;
    padding: 2px 0 0 0;
    box-sizing: border-box;
    font-size: 12px;
    position: absolute;
    right: 200px;
    bottom: 15px;
}
#RLImgDLer a.imgdl,
#RLImgDLer a.RLDLbutton {
    color: #4c4040;
    margin: 0 2px 0 0;
    padding: 0 4px;
    font-size: 12px;
    background:#b51f2d;
    border-radius:2px;
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
    padding: 4px 8px;
    font-size: 16px;
    color: #880602;
    background: #fff;
    font-weight: bold;
    cursor: pointer;
    border-radius: 6px;
    margin: 0 4px 0 0;
    line-height: 28px;
    border: 1px solid #880602;
    position: relative;
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
.ad-image img.zoomed {
    width:max-content;
    height:max-content;
    cursor:url(data:image/png;base64,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),auto;
}
.ad-image img {
    cursor:url(data:image/png;base64,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),auto;
}
div#sedcard-gallery {
    overflow:visible;
}
.adid {
    background: #ffffff59;
    padding: 1px 4px;
    display: inline-block;
    margin-bottom: 2px;
}
.material-icons.md-18 {
    font-size: 18px;
    position: relative;
    top: 4px;
    line-height: 12px;
}

.bigcanvas img {
    max-width:100%;
    max-height:100vh;
    margin:1px;
}
.bigcanvas {
    position: absolute;
    top: 1px;
    z-index: 10000;
    background-color:#88062ad0;
    text-align: center;
    left: 1px;
    right: 1px;
}
.bigcanvas .buttons {
    position:sticky;
    top:0;
    left:0;
    color:white;
    padding:4px;
    background:rgba(0,0,0,0.3);
}
a.imgdl {
    position: absolute !important;
    z-index: 5;
    bottom: 0px;
    font-weight: 400;
    right: 5px;
    color: white;
    text-shadow: 0px 0px 4px black;
    font-size: 12px;
}
#sedcard-gallery ul li {
    position: relative;
}
.copied {
    position: absolute;
    left: 0px;
    display: inline-block;
    z-index: 20;
    padding: 4px 8px;
    bottom: 40px;
    border-radius: 5px;
    background: #880602;
    color: white;
    height: 20px;
}

#contact .phone-number a {
    background-image: url(templates/new/img/phone.png);
    background-repeat: no-repeat;
    background-size: 20px 20px;
    background-position: 20px 50%;
}
#contact a {
    display: inline-block;
    position: relative;
    border: 1px solid #880620;
    border-radius: 5px;
    margin: 0.5em;
    padding: 1em 1.5em 1em 3em;
    font-weight: bold;
}
.hidden-affiliate {
    filter: grayscale(100%);
    opacity: 0.2;
}
.affiliate_container, #header-banner {
    display: none !important;
}

`);
}