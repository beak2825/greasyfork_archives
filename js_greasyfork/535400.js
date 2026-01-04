// ==UserScript==
// @name           WarezBookLC - WarezBook Link Checker (Updated WarBB LC)
// @description    Automatically checks for dead links from various file hosting services.
// @version        1.1
// @license        Please do not modify yourself, contact HD3D with any problems on Warezbook.org
// @author         HD3D / Original by dkitty
// @include        *warezbook.org*
// @match          *warezbook.org*
// @match          *wplocker.com*
// @include        *wplocker.com*
// @match          *myboerse.bz*
// @include        *myboerse.bz*
// @include        *file:///*
// @match          *file:///*
// @include        *safelinking*
// @match          *safelinking*
// @include        *kprotector.com/*
// @match          *kprotector.com/*
// @include        *kprotector.com/*
// @match          *kprotector.com/*
// @include        *junque.org*
// @match          *junque.org*
// @include		   *file:///*
// @grant          GM_xmlhttpRequest
// @grant          GM_addStyle
// @grant          GM_registerMenuCommand
// @grant          GM_getResourceText
// @require        https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @require	 	   https://ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/jquery-ui.min.js
// @noframes
// @connect *


// @namespace https://greasyfork.org/users/493379
// @downloadURL https://update.greasyfork.org/scripts/535400/WarezBookLC%20-%20WarezBook%20Link%20Checker%20%28Updated%20WarBB%20LC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535400/WarezBookLC%20-%20WarezBook%20Link%20Checker%20%28Updated%20WarBB%20LC%29.meta.js
// ==/UserScript==

var $ = window.jQuery;//OR

var WarezLC_version = "1.1";

var deadLinkValues = [];

//separate alternative domains with "|" char (first name is considered being main)
var allHostNames = ["1fichier.com|dl4free.com","4bigbox.com", "4fastfile.com", "4upfiles.com|4up.me|4up.im", "adrive.com", "alfafile.net", "allmyvideos.net", "amonshare.com", "anonfile.com", "anonfiles.com",
                    "anysend.com", "archive.org", "axifile.com", "backin.net", "bankupload.com", "bayfiles.com", "bdupload.asia|bdupload.in", "bezvadata.cz", "bin.ge", "bittload.com", "box.com","centfile.com", "chayfile.com",
                    "clicknupload.org|clicknupload.co|clicknupload.cc|clicknupload.to|clicknupload.club|clicknupload.red|clicknupload.click|clicknupload.site|clicknupload.xyz|clicknupload.vip|clicknupload.online|clicknupload.download|clickndownload.org|",
                    "cloud-up.be", "dailyuploads.net", "daofile.com", "data.hu", "daten-hoster.de|filehosting.org","dbree.co", "dbree.org", "dbupload.co", "ddl.to|ddownload.com", "demo.ovh.eu", "depositfiles.com|dfiles.eu", "desiupload.co|desiupload.to",
                    "divshare.com", "divxstage.eu", "dosya.tc", "downloadani.me", "down.fast-down.com","down.mdiaload.com",
                    "drive.google.com", "droidbin.com", "dropapk.to|dropapk.com|drop.download", "dropbox.com", "dropjiffy.com", "duckload.in", "easybytez.com", "easyload.io", "edisk.cz", "ex-load.com", "exclusivefaile.com|exclusiveloader.com",
                    "exfile.ru", "expressleech.com", "fastclick.to","fastshare.cz", "fastupload.org", "fastupload.ro","fikper.com", "fboom.me|fileboom.me", "file-space.org", "file-speed.com", "file-up.org|file-upload.com|file-upload.cc",
                    "file-upload.net", "file.al", "file4go.com", "file4safe.com", "file4u.pl", "filebeam.com", "filebig.net", "filebonus.net|filebonus.com","filecrypt.cc", "filedais.com", "filedropper.com|filesavr.com", "filefactory.com",
                    "filefox.cc", "filehost.ro", "fileim.com", "filejoker.net", "filemonster.net", "filepi.com", "filepup.net", "filerio.in", "files.fm", "files.mail.ru", "filesabc.com", "fileshare.ro", "filesline.com",
                    "filesmonster.com", "filestore.com.ua", "filestore.to", "filesupload.org", "fileswap.com", "filetut.com", "fileup.cc", "flashx.tv", "flyfiles.net", "free.fr", "fshare.vn", "gboxes.com",
                    "ge.tt", "gigabase.com", "gigapeta.com", "gigasize.com","gofile.io", "google.com","gulf-up.com", "happystreams.net", "herosh.com", "hidemyass.com", "hightail.com|yousendit.com", "hostuje.net", "howfile.com", "hulkload.com",
                    "hyperfileshare.com", "ifolder.ru|rusfolder.com", "inclouddrive.com", "indishare.org|indishare.me", "intoupload.net|intoupload.com", "iranupload.com", "junocloud.me", "katfile.com",
                    "keep2share.cc|keep2share.com|k2s.cc|keep2s.cc", "kie.nu", "kiwi6.com", "koofile.com", "krakenfiles.com", "lafiles.com", "leteckaposta.cz|sharegadget.com", "letsupload.co", "limelinx.com", "limevideo.net", "linkz.ge", "load.to",
                    "loadpot.net", "localhostr.com|lh.rs|hostr.co", "lomafile.com", "longfiles.com", "loudupload.com", "m5zn.com", "maherfire.com", "mediafire.com", "medoupload.com", "mega-myfile.com","mega4up.org|mega4upload.com", "mega.co.nz|mega.nz",
                    "megafiles.se", "megaup.net", "megaupload.is", "mightyupload.com", "mixdrop.co", "mixloads.com", "moevideo.net", "mshare.xyz|mshares.net|mshare.io|mshares.co", "mystore.to", "myvdrive.com",
                    "narod.ru|narod.yandex.ru", "nippyshare.com", "nitroflare.com|nitroflare.net|nitro.download", "novafile.com", "nowvideo.eu", "ortofiles.com", "oxycloud.com", "ozofiles.com", "prefiles.com",
                    "putcker.com", "quickshare.cz", "rapidfiles.com", "rapidfileshare.net", "rapidgator.net|rg.to", "rarefile.net", "redbunker.net", "remixshare.com", "rghost.net", "rockdizfile.com", "rosharing.com",
                    "sdilej.cz", "secureupload.eu", "seecloud.cc","send.cm", "sendfile.su", "sendit.cloud", "sendspace.com", "share4web.com", "shared.com", "sharemods.com", "shareplace.com", "skydrive.live.com",
                    "solidfiles.com", "spaceforfiles.com|filespace.com", "speedshare.eu", "spicyfile.com", "storagely.com", "streamwire.net","takefile.link", "tempfiles.net", "terafiles.net", "thaicyberupload.com",
                    "tikfile.com", "tinyupload.com", "todayfile.com", "toofile.com", "trainbit.com", "tropicshare.com", "turbobit.pl|turbobit.net|turb.pw|turb.cc|turb.to|turboget.net", "turtleshare.com", "tusfiles.net",
                    "uloz.to|ulozto.cz|bagruj.cz|zachowajto.pl|ulozto.net", "ulozisko.sk", "uloziste.com", "unlimitshare.com", "up-4ever.org|upload-4ever.com|upload-4ever.net|up-4.net", "up-load.io", 'uploady.io',"up09.com",  "upfile.vn", "upload.ee",
                    "upload2box.com", "uploadbank.com", "uploadbaz.com", "uploadbaz.me|uploadbaz.net", "uploadboy.com|uploadboy.me", "uploadbuzz.cc", "uploadc.com", "uploadcloud.pro","uploadev.org", "uploadever.com",
                    "upload-4ever.com", 'uploadgig.com', "uploadkadeh.ir", "uploadmb.com", "uploadpages.com", "uploadrive.com", "uploads.bizhat.com", "uploadto.us|ultramegabit.com", "uploadzeal.com", "uplod.io", "uplod.ir",
                    "uplooad.net", "upnito.sk", "uppit.com|up.ht", "uptobox.com","upstore.net|upsto.re", "userscloud.com", "usersdrive.com", "userupload.net","veehd.com", "video.tt", "videobb.com", "vidup.me", "vipshare.me", "vshare.eu", "vshare.is","wbook.ufile.io",
                    "wdupload.com", "webshare.cz", "weshare.me", "wikifortio.com", "wikisend.com", "wikiupload.com", "wipfiles.net", "workupload.com", "worldbytez.com", "wupfile.com", "wyslijto.pl", "xdisk.cz", "xvidstage.com",
                    "yourfilelink.com", "yourfiles.to", "yourfilestore.com", "yourupload.com", "youwatch.org", "zalaa.com", "zalil.ru", 'myfiles.onl',"fileupload.pw","rapidcloud.cc",'filerice.com','pixeldrain.com',
                   'internxt.com'];

//separate alternative domains with "|" char (first name is considered being main)
var allContainerNames = ["safelinking.net","safelinking.com",];

//separate alternative domains with "|" char (first name is considered being main)
var allObsoleteNames = ['uploadship.com','dropgalaxy.in',"uploaded.to|ul.to|uploaded.net","uploader.link","free-uploading.com","fileape.com","rapidu.net","uploadhub.io","zippyshare.com","anonfiles.com","1dl.net",];

var wbbCensoredHosts = ["2downloadz.com","4downfiles.co","4downfiles.org","4shared.com","adf.ly","adfoc.us","anafile.com","bit.ly","catshare.net","dailyfiles.net","digzip.com","directmirror.com","dirrectmirror.com","dl4.ru",
                        "embedupload.com","exoshare.com","fff.re","filebebo.com","filemaze.ws","filemirrorupload.com","fileneo.com","filesha.com","filetolink.com","filevice.com","flashmirrors.com","gamefront.com","go4up.com",
                        "goo.gl","hellshare.com","imxd.net","is.gd","jheberg.net","keeplinks.me","keepshare.net","kingfile.pl","letitbit.net","linkcrypt.ws","linksave.in","lix.in","maxmirror.com","megaupper.com","mirrorafile.com",
                        "mirrorcreator.com|mir.cr","mirrorupload.net","mtsafelinking.org","muchshare.net","multi-up.com","multiload.cz","multishare.cz","multisiteupload.com","multiup.org","multiupload.com|multiupload.nl",
                        "ncrypt.in","netfolder.in","q.gs","qooy.com","queenshare.com","rapidu.net","relink.us","sflk.in","share-links.biz|s2l.biz","sharebee.com","sharecash.org","shareflare.net","sharing.zone","speed-down.org",
                        "speedy.sh|speedyshare.com","tiny.cc","tinyurl.com","toturl.us","ufile.eu","unibytes.com","unlimit.co.il","uploadblast.com","uploadjockey.com","uploadmagnet.com","uploadmirrors.com","uploadonall.com",
                        "uploadseeds.com","uploadtubes.com","uploadzero.com","urlz.so","vidxden.com"];



String.prototype.contains = function(searchString) {
    if (searchString.constructor === RegExp) {
        if (searchString.test(this)) return true;
        else return false;

    } else if (searchString.constructor === String) {
        function replaceStr(string) {
            return string.replace(new RegExp(RAND_STRING, 'g'), '|');
        }

        searchString = searchString.replace(/\\\|/g, RAND_STRING);
        var searchArray = searchString.split('|');

        if (searchArray.length > 1) {
            var found = false;
            var i = searchArray.length;

            while (i--) {
                if (this.indexOf(replaceStr(searchArray[i])) > -1) {
                    found = true;
                    break;
                }
            }

            return found;

        } else {
            if (this.indexOf(replaceStr(searchString)) > -1) return true;
            else return false;
        }
    } else {
        throw new TypeError('String.contains: Input is not valid, string or regular expression required, ' + searchString.constructor.name + ' given.');
    }
}

var firstRun = JSON.parse(localStorage.getItem("WarBB_First_Run"));
if (firstRun == null) firstRun = true;

var chromeBrowser = /chrom(e|ium)/.test(navigator.userAgent.toLowerCase());

var preferences = JSON.parse(localStorage.getItem("WarBB_Preferences"));

allHostNames.sort();
allContainerNames.sort();
allObsoleteNames.sort();

var RAND_STRING = "8QyvpOSsRG3QWq";

var WBB_MODE = false;
if (window.location.host.contains('warezbook.org')) {
    WBB_MODE = true;
}

var ANONYMIZE_SERVICE;
var ANONYMIZERS = [ ''];

var TOOLTIP_MAXWIDTH = 600; //in pixels

//global settings start
var Do_not_linkify_DL_links, Display_tooltip_info, Last_Update_Check, Allow_spaces_in_DL_links, Display_full_links_in_link_containers, Show_Update_Notification, Focus_First_Link;
var Processbox_Pos_X, Processbox_Pos_Y, Progressbox_Scaling;

var cLinksTotal = 0;
var cLinksDead = 0;
var cLinksAlive = 0;
var cLinksUnava = 0;
var cLinksUnknown = 0;
var cLinksProcessed = 0;

$('head').append('<warbb name="filehosts" live="" dead="" unava="" unknown="" />'); //for cross-script compatibility

var intervalId; //for updateProgress()

//icon resources
var alive_link_png = 'data:image/png;base64,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';
var adead_link_png = 'data:image/png;base64,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';
var unava_link_png = 'data:image/png;base64,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';
var unknown_link_png = 'data:img/png;base64,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';
var processing_link_gif = 'data:image/gif;base64,R0lGODlhEAALAPQAAP///wAAANra2tDQ0Orq6gYGBgAAAC4uLoKCgmBgYLq6uiIiIkpKSoqKimRkZL6+viYmJgQEBE5OTubm5tjY2PT09Dg4ONzc3PLy8ra2tqCgoMrKyu7u7gAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCwAAACwAAAAAEAALAAAFLSAgjmRpnqSgCuLKAq5AEIM4zDVw03ve27ifDgfkEYe04kDIDC5zrtYKRa2WQgAh+QQJCwAAACwAAAAAEAALAAAFJGBhGAVgnqhpHIeRvsDawqns0qeN5+y967tYLyicBYE7EYkYAgAh+QQJCwAAACwAAAAAEAALAAAFNiAgjothLOOIJAkiGgxjpGKiKMkbz7SN6zIawJcDwIK9W/HISxGBzdHTuBNOmcJVCyoUlk7CEAAh+QQJCwAAACwAAAAAEAALAAAFNSAgjqQIRRFUAo3jNGIkSdHqPI8Tz3V55zuaDacDyIQ+YrBH+hWPzJFzOQQaeavWi7oqnVIhACH5BAkLAAAALAAAAAAQAAsAAAUyICCOZGme1rJY5kRRk7hI0mJSVUXJtF3iOl7tltsBZsNfUegjAY3I5sgFY55KqdX1GgIAIfkECQsAAAAsAAAAABAACwAABTcgII5kaZ4kcV2EqLJipmnZhWGXaOOitm2aXQ4g7P2Ct2ER4AMul00kj5g0Al8tADY2y6C+4FIIACH5BAkLAAAALAAAAAAQAAsAAAUvICCOZGme5ERRk6iy7qpyHCVStA3gNa/7txxwlwv2isSacYUc+l4tADQGQ1mvpBAAIfkECQsAAAAsAAAAABAACwAABS8gII5kaZ7kRFGTqLLuqnIcJVK0DeA1r/u3HHCXC/aKxJpxhRz6Xi0ANAZDWa+kEAA7AAAAAAAAAAAA';
var WarBBLogo = "data:image/png;base64,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";

//initiate notification box
$("body").append("<b class='WarBBInfoBox' style='position: fixed; top: 2px; padding-left:30px; padding-right: 5px; display:none; background: white url(" + WarBBLogo + ") no-repeat 0% 50%; background-size:28px; font-size: 20px; border:1px solid #4DD9FF; z-index:3;'></b>");

//global settings end

function linkify(filterId) { //code from http://userscripts.org/scripts/review/2254 Linkify ting

    if (!filterId) {
        var regexy = "", ikkeTilladteTags = [];


        var allLinksRegex = "(?:http:\/\/.+?\\?)?(?:https?:\/\/)?"
		+ "[0-9A-Za-z]+(?:[\\.-][0-9A-Za-z]+)*\\.[A-Za-z]+"   //instead of totalourls
		+ "[\\w\\–\\-\\.+$!*\\/()\\[\\]\',~%?:@#&=\\\\\\—;…×Ã\\_\\u0080-\\u03FF’‘"
        +   (Allow_spaces_in_DL_links ? "\\u0020" : "") + "]*";

        if (Do_not_linkify_DL_links) {
            ikkeTilladteTags = ['a', 'head', 'script', 'style', 'title', 'option', 'iframe', 'textarea', 'span']; //tags, hvor det der stAÎžâ€™Î’ÂĄr inden i ikke skal vAÎžâ€™Î’Â¦re links
        } else {
            ikkeTilladteTags = ['a', 'head', 'script', 'style', 'title', 'option', 'iframe', 'textarea']; //tags, hvor det der stAÎžâ€™Î’ÂĄr inden i ikke skal vAÎžâ€™Î’Â¦re links
        }

        var linkRegex = new RegExp(allLinksRegex, "g");
        var censors = ['Disallowed',
                       'Dissalowed',
                       'Dead File Host',
                       'Disallowed host',
                       'Direct links only',
                       'Folders are not allowed',
                       'Multi hosts disallowed',
                       'Protected links are not allowed',
                       "Due To The Increase In Phishing,? We Now Disallow Protected URL'?s",
                       "Not allowed Direct links only",
                       "not allowed, please post direct links",
                       "Spam",
                       "If you are reading this report this SPAMMER to a moderator",
                       "3rd Party links are not allowed. Direct Links Only",
                       "Direct links only - please report me",
                       "Spyware",
                       "\\s*Ad\\-fly\\s*links\\s*are\\s*fobidden\\.\\s*Direct\\s*links only\\s*",
                       "Disallowed - Direct links only",
                       "Protected links not allowed"];

        var regexParts = [ 'https?:\/\/', //protocol
                          '[\\w\\.\\-]+' //host/server
                         ];

        var censorRegex = new RegExp('(?:' + regexParts.join('') + '\/\\?)?' //anonymizers
                                     + '(?:' + regexParts.join('|') + '|' + regexParts.join('') + ')' //all possible combinations of protocol + subdomain
                                     + '~[ ]*(?:' //opening of the censor + non-capturing group (for the different censors)
                                     + censors.join("|") //body of the non-capturing group, different options for censor contents
                                     + ')(?:\\.|)'+ '[ ]*~' //closing of the group and the censor
                                     + '[\\w\\–\\-\\.+$!*\\/()\\[\\]\',~%?:@#&=\\\\\\—;…×Ã\\_\\u0080-\\u03FF’‘]+', //different characters possible in URL after the censor (END OF CENSOR BODY)
                                     'ig'); //case insensitive, multiple matches on multiple lines
        var ignoreImage = /(?:\.png|\.jpg|\.gif|\.jpeg|\.bmp)$/i, textNode, muligtLink;

        var path = "//text()[not(parent::" + ikkeTilladteTags.join(" or parent::") + ") and contains(.,'/')]";
        var textNodes = document.evaluate(path, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

        var i = textNodes.snapshotLength;

        while (i--) {
            textNode = textNodes.snapshotItem(i);
            muligtLink = $.trim(textNode.nodeValue); //all links on page without whitespace

            if (censorRegex.test(muligtLink)) {
                var span = document.createElement('span'), lastLastIndex = 0, myArray = null;
                censorRegex.lastIndex = 0;

                while (myArray = censorRegex.exec(muligtLink)) {
                    var link = $.trim(myArray[0]); //removes whitespace from beginning and end of link (can sometimes cause issues when spaces are still picked up by the regex even when Allow_spaces_in_DL_links is false)

                    if (ignoreImage.test(link.replace(/\[\/img\]$/, ""))) continue;

                    span.appendChild(document.createTextNode(muligtLink.substring(lastLastIndex, myArray.index)));

                    var $span = $('<span class="obsolete_link" warlc_error="Cause of error: <b>Censored link.</b>">' + link + '</span>');

                    $span.appendTo(span);

                    updateHosts('dead', 'censored links');
                    cLinksTotal++; cLinksProcessed++; cLinksDead++;

                    lastLastIndex = censorRegex.lastIndex;
                }

                span.appendChild(document.createTextNode(muligtLink.substring(lastLastIndex)));
                textNode.parentNode.replaceChild(span, textNode);

                $('span.obsolete_link', textNode.parentNode).mouseover(displayTooltipError);
            } else if (linkRegex.test(muligtLink)) {
                var span = document.createElement('span'), lastLastIndex = 0, myArray = null;
                linkRegex.lastIndex = 0;

                while (myArray = linkRegex.exec(muligtLink)) {
                    var link = $.trim(myArray[0]); //removes whitespace from beginning and end of link (can sometimes cause issues when spaces are still picked up by the regex even when Allow_spaces_in_DL_links is false)
                    var hostName = gimmeHostName2(link);
                    var hostNameSafe = hostName.toString().replace(/\./g, "_dot_").replace(/\-/g, "_dash_").toLowerCase();
                    if (hostName == gimmeHostName(window.location.hostname) || !hostsIDs[hostNameSafe] || ignoreImage.test(link.replace(/\[\/img\]$/, ""))) {
                        continue;
                    }

                    span.appendChild(document.createTextNode(muligtLink.substring(lastLastIndex, myArray.index)));

                    var $a = $("<a>" + link + "</a>")

                    if (!link.match(/https?:\/\//)) {
                        link = 'http://' + link;
                    }

                    $a.attr("href", link.replace(/\[\/hide:\w+\]/,"")).appendTo(span);

                    lastLastIndex = linkRegex.lastIndex;
                }

                span.appendChild(document.createTextNode(muligtLink.substring(lastLastIndex)));
                textNode.parentNode.replaceChild(span, textNode);
            }
        }
    }

    var jQ;
    filterId ? jQ = "a." + filterId : jQ = "a";
    var as = $(jQ);
    var i = as.length;
    var currA, hostNameSafe, hostID;
    while(i--) {

        currA = as[i];
        if (currA.href && /^https?:\/\//.test(currA.href) && gimmeHostName2(currA.href) != -1 && gimmeHostName2(currA.href) != gimmeHostName(window.location.host) && (!currA.className || currA.className == "processing_link" || currA.className == filterId)) {
            hostNameSafe = gimmeHostName2(currA.href).replace(/\./g, "_dot_").replace(/\-/g, "_dash_").toLowerCase();
            if (!hostsIDs[hostNameSafe]) {
                if (filterId) cLinksTotal--; currA.className = '';
                continue;
            } else {
                var ix = hostsIDs[hostNameSafe].length;
                while(ix--) {
                    if (new RegExp(hostsIDs[hostNameSafe][ix].linkRegex).test(currA.href)) {
                        currA.className = "processing_link";
                        hostID = hostsIDs[hostNameSafe][ix].hostID;
                        hostsCheck[hostID].links.push(currA);
                        foundMirrors[hostID.substr(0,2)].push(hostID);
                    }
                }
            }
        }
    }
}

function add_WARLC_style()
{
    if (!(document.getElementsByTagName('WARLC')[0]))
    {
        var meta_not_to_add_more_style = document.createElement("WARLC");
        meta_not_to_add_more_style.setAttribute('content', 'war_links_checker');
        meta_not_to_add_more_style.setAttribute('name', 'description');
        document.getElementsByTagName('head')[0].appendChild(meta_not_to_add_more_style);

        GM_addStyle(
            ".alive_link {background:transparent url(" + alive_link_png + ") no-repeat scroll 100% 50%;background-size:13px;padding-right:13px;color:green !important;}\
.adead_link {background:transparent url(" + adead_link_png + ") no-repeat scroll 100% 50%;background-size:13px;padding-right:13px;color:red !important;}\
.obsolete_link {background:transparent url(" + adead_link_png + ") no-repeat scroll 100% 50%;background-size:13px;padding-right:13px;color:red !important;}\
.unava_link {background:transparent url(" + unava_link_png + ") no-repeat scroll 100% 50%;background-size:14px;padding-right:13px;color:#FF9900 !important;}\
.unknown_link {background:transparent url(" + unknown_link_png + ") no-repeat scroll 100% 50%;padding-right:13px;background-size:13px;color:rgb(0, 150, 255) !important}\
.processing_link {background:transparent url(" + processing_link_gif + ") no-repeat scroll 100% 50%;background-size:13px;padding-right:16px;color:grey !important;}\
.container_link {background:transparent url(" + processing_link_gif + ") no-repeat scroll 100% 50%;background-size:13px;padding-right:16px;color:grey !important;}"
        );
    }
}

var warlcTooltip = null, mouseoverLink = null; //link href with mouse cursor over it

var lastX = 0, lastY = 0;

$(document).ready(initTooltip);

//inits tooltip
function initTooltip()
{
    warlcTooltip = document.createElement("div");
    warlcTooltip.setAttribute("style", "background: #EAEAEA; box-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);padding: 6px 6px 6px 6px; border-radius:2px; border:2px solid #6699CC; color:#000000;font-family:Verdana,sans-serif;font-size:11px;position:absolute;z-index:1000; max-width: " + TOOLTIP_MAXWIDTH + "px;");
    warlcTooltip.style.visibility = "hidden";
    document.body.appendChild(warlcTooltip);
}

function updateHosts(status, hostname) {
    $('warbb[name="filehosts"]').attr(status, function(index, value) {
        if (!value.contains(hostname)) {
            value += hostname + ",";
            return value;
        }
    });
}

//"mousemove" event handler for all links
function moveTooltip(event)
{
    if ((Math.abs(lastX - event.clientX) + Math.abs(lastY - event.clientY)) < 6)
    {
        //no need to reflow if the cursor moved just a little
        return;
    }
    else
    {
        lastX = event.clientX;
        lastY = event.clientY;
    }

    posX = event.clientX + window.pageXOffset + 10;
    posY = event.clientY + window.pageYOffset;

    var ttHeight = warlcTooltip.offsetHeight;
    var ttFreeSpace = window.innerHeight - event.clientY;

    if (ttHeight > ttFreeSpace)
    {    //prevents tooltip from getting out of the window
        posY -= (ttHeight - (ttFreeSpace)) + 10;
    }
    else
    {
        posY += 7;
    }

    warlcTooltip.style.top = posY + "px";
    warlcTooltip.style.left = posX + "px";
}

//"mouseout" event handler for all links
function hideTooltip(){
    warlcTooltip.style.visibility = "hidden";
    mouseoverLink = null;
}


//"mouseover" event handler for dead links
//displays tooltip error message on dead links
function displayTooltipError()
{
    mouseoverLink = this.href;

    this.addEventListener("mouseout", hideTooltip);
    this.addEventListener("mousemove", function(event) { moveTooltip(event); });

    warlcTooltip.innerHTML = '<b>LOADING...</b>';
    warlcTooltip.style.minWidth = 0;
    warlcTooltip.style.visibility = "visible";

    if ($(this).attr('warlc_error')) { //an error message is already known and stored in warlc_error attribute
        warlcTooltip.innerHTML = $(this).attr('warlc_error');
    }
    else
    {
        loadErrorInfo(this);
    }

    function loadErrorInfo(link)
    {
        var href = link.href;
        if (link.href.contains('anysend.com') && link.name) href = link.name;
        href = href.replace(/quickshare\.cz\/.+/, "quickshare.cz/chyba");

        GM_xmlhttpRequest({
            method: 'GET',
            url: href.replace(ANONYMIZE_SERVICE, ""),
            timeout:3000,
            headers: {
                'User-agent': rUA(),
                'Accept': 'text/xml,application/x-httpd-php',
                'Referer': ""
            },
            onload: function(result) {
                var res = result.responseText;

                //TODO: errorRegexs -
                var errorRegexs =     [    //generic error messages follow
                    /(empty directory)/i,
                    /(soubor nebyl nalezen)/i,
                    /((?:file|page|link|folder)(?:is|not|does|has been|was|has| ){1,}(?:found|available|blocked|exists?|deleted|removed|expired))/i,

                    //server specific error messages follow
                    /class="alert alert-warning">\s*(.+?)\s*<\/div>/, //ddownload.com
                    /msg error" style="cursor: default">(.+?)<\/div>/, //sendspace
                    /color:red;font\-weight:bold;border\-style:dashed;font-size:12px;border\-width:2px;><tr><td align=center>(.+?)<\/td>/, //fastshare
                    /errorIcon">\s*<p><strong>(.+?)<br \/>/, //filefactory
                    /<embed src="\/wp\/img\/icon-error.svg" alt="(.+?)"/, //filefactory
                    /no_download_msg">\s*(.+?)<span/, //depositfiles
                    /(Takový soubor neexistuje. Je možné, že byl již smazán.)/, //quickshare
                    /file_info file_info_deleted">\s*<h1>(.+?)<\/h1>/, //filepost
                    /<br \/>\s*<p style="color:#000">(.+?)<\/p>\s*<\/center>/, //letitbit
                    /(?:error_div">|<\/h1><p>)<strong>(.+?)<\/strong>/, //share-rapid,quickshare
                    /class="red">(.+?)<(?:span|br)>/, //megashares
                    /class="wp640">\s*<h1 class="h1">(.+?)<\/h1>/, //uloz.to
                    /download_file">\s*<tr>\s*<td>(.+?)<\/td>/, //hotfile
                    /error\.gif" \/>\s*(.+?)\s*<\/div>/, //uploading.com
                    /not-found">\s*<p>(.+?)<\/p>/, //bayfiles
                    /(Your file could not be found. Please check the download link.)/, //stahnu.to
                    /error_msg">\s*(<h3>.+?<\/h3><ul>(.+?)<\/ul>)/, //edisk
                    /error">\s*(?:<[bp]>)?\s*(.+?)<\/[bp]>/, //filesmonster, shragle, gigapeta
                    ///center aC">\s*<h1>(.+?)<br \/>/, //uploaded.to
                    /<td colspan="2">\s*<i>(.+?)<\/i>/, //ul.to/f
                    /icon_err">\s*<h1>(.+?)<\/h1>/, //filejungle
                    /Code: ER_NFF_\d+<\/h2>\s*(.+?)\s*<\/div>/, //netload
                    /<span style="color:red;" class="result-form">(.+?)<\/span>/, //safelinking
                    /<span style="color:red;" class="result-form">(.+?)<\/span>/, //kprotector
                    /(The file link that you requested is not valid.)/, //2shared
                    /error_msg_title">(.+?)<\/h3>/, //mediafire
                    /<span class="bold">(?:<br \/>)+(.+?)<\/span>/, //filebox
                    /err">(.+?)</, //speedy-share, will work for others
                    /<h2 class="error">(.+?)<\/h2>/, //gigasize.com
                    /<h1 class="filename" id="status">(.+?)<\/h1>/, //anysend.com
                    /<title>(Removed download) \| AnySend<\/title>/, //anysend.com
                    /<div class="row info-box info-box-blue text-center">\s*(.+?)\s*<\/div>/, //filefox.cc
                    /class="alert alert-danger">This file is no longer available/,//k2s.cc


                ];
                var errorIdx = errorRegexs.length;

                var error = "Cause of error: <b>unknown</b>";
                var errorCandidate = "";
                while(errorIdx--)
                {
                    var errorCandidate = res.match(errorRegexs[errorIdx]);
                    if (errorCandidate != null)
                    {
                        error = "Cause of error: <b>" + errorCandidate[1].replace(/&nbsp;/g," ") + "</b>";
                        break;
                    }
                }

                //link attributes
                $(link).attr('warlc_error', error);

                if (mouseoverLink == link.href) //mouse cursor is still over the link
                {
                    warlcTooltip.innerHTML = error;
                }
            }
        });
    }
}

//"mouseover" event handler for alive links
//displays tooltip info (file size, file name,...) on alive links
function displayTooltipInfo()
{
    mouseoverLink = this.href;

    //exclude direct download filehostings
    if (this.href.contains(/(?:uloziste\.com|filemonster\.net|uploadbin\.net|adrive\.com|dropbox(?:usercontent)?\.com|karelia\.pro|archive\.org|demo\.ovh\.eu)/))
    {
        return;
    }

    this.addEventListener("mouseout", hideTooltip);
    this.addEventListener("mousemove", function(event) { moveTooltip(event); });

    warlcTooltip.innerHTML = '<b>LOADING...</b>';
    warlcTooltip.style.minWidth = 0;
    warlcTooltip.style.visibility = "visible";

    if (this.warlc_tooltipcache) //file size is already known and stored in warlc_filename and warlc_filesize attributes
    {
        warlcTooltip.innerHTML = this.warlc_tooltipcache;
    }
    else if (this.href.includes('fastclick.to') || this.href.includes('drop.download') || this.href.includes('clicknupload.') || this.href.includes('up-load.io')||this.href.includes('1dl.net')||this.href.includes('clickndownload.org')){
        loadInfoFastClick(this);
    }


    else if (this.href.includes('fikper.com')){
         loadInfoFikper(this);
    }

    else if (this.href.includes('webshare.cz')){
         loadInfoWebShare(this);
    }

    else if (this.href.includes('nitro.download') || this.href.includes('nitroflare.')){
         loadInfoNitroFlare(this);
    }

    else
    {
        loadInfo(this);
    }

    function loadInfoFastClick(link) {
        var method = '';
        var url='';


       // Extract the domain from the link
        var domainMatch = link.href.match(/(?:https?:\/\/)?(?:www\.)?((fastclick\.to|drop\.download|1dl\.net|up-load\.io|clickndownload\.org|clicknupload\.[^\s\/]+))/);

        var domain = domainMatch ? domainMatch[1] : 'drop.download'; // Default to 'drop.download' if no match

        if (domain === 'clicknupload' || domain.startsWith('clicknupload.')||domain.startsWith('clickndownload.'))
                                                           {
                method = 'Slow+Download';
                domain = 'clickndownload\.org';
        }
        else if (domain.startsWith('up-load.io'))
        {
             method = 'Free+Download';
             domain = 'up-load.io';
        }
        else {
            method = 'Free+Download+>>';
        }


        var id=link.href.match(/(?:fastclick\.to|drop\.download|1dl\.net|up-load\.io|clicknupload\.[^\s\/]+|clickndownload\.org)\/(\w+)(\/)?/)[1];

            GM_xmlhttpRequest(
                {
                    method: "POST",
                    url: 'https://' + domain + '/' + id,
                    timeout: 0,
                    data:  "op=download1&id=" + id + "&method_free=" + method,
                    headers: {
                        'User-agent': rUA(),
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    onload: function(result)
                    {
                        var res = result.response;
                        // res = res.response.folder_info;

                        var nameRegexs = 	[
                                                 /<div class="col-12 col-lg-auto flex-grow-1 flex-shrink-1">\s*<div class="h5">(.+?)<\/div>/,
                                                 /class="dfilename">(.+?)<\/span>/, //fastclick.to
                                                 /<div class="name">\s*<h4>(.+?)<\/h4>/, //1dl.net
                                            ];
                        var nameIdx = nameRegexs.length;

                        var quantRegex = '(?:M|G|K)?i?(?:B)(?:[y|i]te?s?)?';
                        var valRegex = '\\d+(?:[\\., ]\\d+){0,2}'; 				// 111([., ]222)?([., ]333)?
                        var uniSizeRegex = valRegex + '(?:\\s*|&nbsp;)' + quantRegex;
                        var preSizeRegex = '(?::|\\(|>|>, | - )';
                        var postSizeRegex = '(?:\\))?';
                        var sizeRegexs = 	[
                                              preSizeRegex + "\\s*(" + uniSizeRegex + ")\\s*" + postSizeRegex,
                                             'class="statd">size<\/span>\\s*<span>(.+?)<\/span>', //fastclick.to , drop.download
                                             'statd">size<\/span>\\s*<span>(.+?)<\/span>', //fastclick.to
                                             'Uploaded on .+?<\/span>\\s*<span>(.+?)<\/span>\s*<span>.+? Downloads<\/span>', //1dl.net
                                             'class="small">size</div>\\s*<div class="h5 mb-0">(.+?)</div>', //fastclick.to , drop.download

									];
                        var sizeIdx = sizeRegexs.length;

                        var tooltip = "File Name: <b>";
                        var fileName = "unknown";
                        var nameCandidate = "";
                        while(nameIdx--)
                        {
                            nameCandidate = res.match(nameRegexs[nameIdx]);
                            if (nameCandidate != null)
                            {
                                fileName = nameCandidate[1].replace(/&nbsp;/g," ");
                                break;
                            }
                        }
                        tooltip += fileName + "</b><br>File Size:  <b>";

				var fileSize = "unknown";
				var sizeCandidate = "";
                        while(sizeIdx--)
                        {
                            sizeCandidate = res.match(new RegExp(sizeRegexs[sizeIdx], "i"));
                            if (sizeCandidate != null)
                            {
                                fileSize = sizeCandidate[1].replace(/&nbsp;/g," ");
                                if (/^\d+$/.test(fileSize) && fileSize >= 1024) //assume bytes
                                {
                                    if(fileSize > (1<<30)) fileSize = Math.round(10 * fileSize / (1<<30)) / 10 + ' GB';
                                    else if(fileSize > (1<<20)) fileSize = Math.round(fileSize / (1<<20)) + ' MB';
                                    else fileSize = Math.round(fileSize / 1024) + ' KB';
                                }
                                break;
                            }
                        }
                        tooltip += fileSize + "</b>";

                        link.warlc_tooltipcache = tooltip;

                        warlcTooltip.style.minWidth = TOOLTIP_MAXWIDTH;

				if (mouseoverLink == link.href) //mouse cursor is still over the link
				{
					warlcTooltip.innerHTML = tooltip;
				}
                    }
                });
    }

    function loadInfoFikper(link){
        var linkId = link.href.match(/fikper\.com\/(\w+)/)[1];
        var fileName = "unknown";
        var fileSize = "unknown";
        var sizeCandidate ='';

        GM_xmlhttpRequest(
                    {
                        method: "POST",
                        url: 'https://sapi.fikper.com',
                        headers: {
                            'User-agent': rUA(),
                            'Content-type': 'application/json',
                            'Referer': ""
                        },
                        data: JSON.stringify({'fileHashName': linkId}),
                        onload: function (result)
                        {
                            var quantRegex = '(?:M|G|K)?i?(?:B)(?:[y|i]te?s?)?';
                            var valRegex = '\\d+(?:[\\., ]\\d+){0,2}'; 			// 111([., ]222)?([., ]333)?
                            var uniSizeRegex = valRegex + '(?:\\s*|&nbsp;)' + quantRegex;
                            var preSizeRegex = '(?::|\\(|>|>, | - )';
                            var postSizeRegex = '(?:\\))?';

                            var res = $.parseJSON(result.responseText);

                            if(Boolean(res.name)){
                                fileName = res.name;}
                            if(Boolean(res.size)){
                                sizeCandidate = res.size;}
                            if (sizeCandidate != null)
                            {
                                fileSize = sizeCandidate.replace(/&nbsp;/g," ");
                                if (/^\d+$/.test(fileSize) && fileSize >= 1024) //assume bytes
                                {
                                    if(fileSize > (1<<30)) fileSize = Math.round(10 * fileSize / (1<<30)) / 10 + ' GB';
                                    else if(fileSize > (1<<20)) fileSize = Math.round(fileSize / (1<<20)) + ' MB';
                                    else fileSize = Math.round(fileSize / 1024) + ' KB';
                                }
                            }

                            var tooltip = "File Name: <b>";

                            tooltip += fileName + "</b><br>File Size:  <b>";
                            tooltip += fileSize + "</b>";
                            link.warlc_tooltipcache = tooltip;
                            warlcTooltip.style.minWidth = TOOLTIP_MAXWIDTH;
                            if (mouseoverLink == link.href) //mouse cursor is still over the link
                            {
                                warlcTooltip.innerHTML = tooltip;
                            }
                        }
                    });
    }

    function loadInfoWebShare(link){

        var linkId = link.href.match(/(en\.)?webshare\.cz\/(?:(?:#\/)?(file|group)\/)?(\w+)/)[3];
        var fileName = "unknown";
        var fileSize = "unknown";
        var sizeCandidate ='';

		GM_xmlhttpRequest(
            {
					method: 'POST',
					url: "https://webshare.cz/api/tied_files/",
					headers: {
						'User-agent': rUA(),
						'Content-type': 'application/x-www-form-urlencoded',
						'Referer': "",
					},
					data: "wst=&offset=0&limit=25&ident=" + linkId,
					onload: function (result)
					{
                        debugger;
                         var res = result.responseText;
                        var quantRegex = '(?:M|G|K)?i?(?:B)(?:[y|i]te?s?)?';
                            var valRegex = '\\d+(?:[\\., ]\\d+){0,2}'; 			// 111([., ]222)?([., ]333)?
                            var uniSizeRegex = valRegex + '(?:\\s*|&nbsp;)' + quantRegex;
                            var preSizeRegex = '(?::|\\(|>|>, | - )';
                            var postSizeRegex = '(?:\\))?';

						fileName = res.match(/<name>(.+?)<\/name>/)[1];
                        sizeCandidate = res.match(/<size>(.+?)<\/size>/)[1];

                         if (sizeCandidate != null)
                            {
                                fileSize = sizeCandidate.replace(/&nbsp;/g," ");
                                if (/^\d+$/.test(fileSize) && fileSize >= 1024) //assume bytes
                                {
                                    if(fileSize > (1<<30)) fileSize = Math.round(10 * fileSize / (1<<30)) / 10 + ' GB';
                                    else if(fileSize > (1<<20)) fileSize = Math.round(fileSize / (1<<20)) + ' MB';
                                    else fileSize = Math.round(fileSize / 1024) + ' KB';
                                }
                            }

                            var tooltip = "File Name: <b>";

                            tooltip += fileName + "</b><br>File Size:  <b>";
                            tooltip += fileSize + "</b>";
                            link.warlc_tooltipcache = tooltip;
                            warlcTooltip.style.minWidth = TOOLTIP_MAXWIDTH;
                            if (mouseoverLink == link.href) //mouse cursor is still over the link
                            {
                                warlcTooltip.innerHTML = tooltip;
                            }
					}
				}
        );


    }

    function loadInfoNitroFlare(link){

        var linkId = link.href.match(/(?:nitroflare\.(?:com|net)|nitro\.download)\/view\/(\w+)(?:|\/)/)[1];
        var fileName = "unknown";
        var fileSize = "unknown";
        var sizeCandidate ='';

		GM_xmlhttpRequest(
                    {
                        method: "GET",
                        url: 'https://nitroflare.net/api/v2/getFileInfo?files=' + linkId,
                        headers: {
                            'User-agent': rUA(),
                            'Content-type': 'application/json',
                            'Referer': ""
                        },
                        onload: function (result)
                        {
                            var res = $.parseJSON(result.responseText);
                            var quantRegex = '(?:M|G|K)?i?(?:B)(?:[y|i]te?s?)?';
                            var valRegex = '\\d+(?:[\\., ]\\d+){0,2}'; 			// 111([., ]222)?([., ]333)?
                            var uniSizeRegex = valRegex + '(?:\\s*|&nbsp;)' + quantRegex;
                            var preSizeRegex = '(?::|\\(|>|>, | - )';
                            var postSizeRegex = '(?:\\))?';

						fileName = res.result.files[linkId].name;
                        sizeCandidate = res.result.files[linkId].size;

                         if (sizeCandidate != null)
                            {
                                fileSize = sizeCandidate.replace(/&nbsp;/g," ");
                                if (/^\d+$/.test(fileSize) && fileSize >= 1024) //assume bytes
                                {
                                    if(fileSize > (1<<30)) fileSize = Math.round(10 * fileSize / (1<<30)) / 10 + ' GB';
                                    else if(fileSize > (1<<20)) fileSize = Math.round(fileSize / (1<<20)) + ' MB';
                                    else fileSize = Math.round(fileSize / 1024) + ' KB';
                                }
                            }

                            var tooltip = "File Name: <b>";

                            tooltip += fileName + "</b><br>File Size:  <b>";
                            tooltip += fileSize + "</b>";
                            link.warlc_tooltipcache = tooltip;
                            warlcTooltip.style.minWidth = TOOLTIP_MAXWIDTH;
                            if (mouseoverLink == link.href) //mouse cursor is still over the link
                            {
                                warlcTooltip.innerHTML = tooltip;
                            }
					}
				}
        );
    }

    function loadInfo(link) {
        var href = link.href;
        if (link.href.contains('anysend.com')) href = link.name;
        href = href.replace(/.*(?:share-online\.biz|egoshare\.com)\/(?:dl\/|download\.php\?id=|\?d=)(\w+)/, 'http://api.share-online.biz/linkcheck.php?links=$1');
        href = href.replace(/.*(?:uploaded|ul)\.(?:to|net)\/(?:files?\/|\?(?:lang=\w{2}&)?id=|f(?:older)?\/)?(?!img|coupon)(\w+)/, 'http://uploaded.net/api/filemultiple?apikey=lhF2IeeprweDfu9ccWlxXVVypA5nA3EL&id_0=$1');
        href = href.replace(/.*(?:depositfiles\.(?:com|lt|org)|dfiles\.(?:eu|ru))\/(?:en\/|ru\/|de\/|es\/|pt\/|)files\/(\w+)/, 'http://depositfiles.com/api/get_download_info.php?id=$1&format=json')

        GM_xmlhttpRequest({
            method: 'GET',
            url: href.replace(ANONYMIZE_SERVICE, ""),
            headers: {
                'User-agent': rUA(),
                'Accept': 'text/xml,application/x-httpd-php',
                'Referer': ""
            },
            onload: function(result) {
                var res = result.responseText;
                console.log(res)

                var nameRegexs = [    /File Name: (.+?)<\/p>/, //filesmall
                                      /h1 title="(.+?)" class="section_title video_title text-left float-left"/, //fastsharez.cz,
                                      /(?:finfo|(?:file[-_]?)?name)(?:"|')?>\s*?(.+?)<\/?(?:h1|a|b|div|span style|td)/, //hellshare, uploaded.to, netload, badongo, 4fastfile, filefreak
                                      /class="file-title">(.+?)(?:\s*\(\d+\.\d+ [A-Z]{2}\))<\/h1>/,// uptobox
                                      /fl" title="(.+?)">/, //edisk
                                      /<title>\s*(?:Download)?\s*(.+?)\s*(?::: DataPort|\| Ulož|- Share\-Rapid|- WEBSITENAME|download Extabit|- download now for free|\| refile)/, //dataport, uloz.to, share-rapid, shragle, extabit, filefactory, refile.net
                                      /<h3>Stahujete soubor: <\/h3>\s*<div class="textbox">(.+?)<\/div>/, //webshare
                                      /<h3><b><span style=color:black;>(.+?)<\/b><\/h3><br>/, //fastshare
                                      /title="download (.+?)">/, //sendspace
                                      /Stáhnout soubor: (.+?)<\/h1>/, //quickshare
                                      /fz24">Download:\s*<strong>(.+?)<\/strong>/, //crocko
                                      /\w+:<\/b> (.+?)<\/h2>/, //filevelocity
                                      /'file\-icon\d+ \w+'>(?:<\/span><span>)?(.+?)<\/span>/, //hitfile,
                                      /id="file-title">(.+?)<\/span>/, // turbobit
                                      /d0FileName =  "(.+?)";/, //letitbit
                                      /file(?:_name|-info)" title="">\w+: <span>(.+?)<\/span>/, //vip-file, shareflare
                                      /download_file_title" title="(.+?)">/, //mediafire
                                      /dl\-btn\-label"> (.+?) <\/div>/, //mediafire
                                      /id="file_title">(.+?)<\/h1>/, //uploading.com
                                      /recent-comments"><h2>(.+) &nbsp;/, //xdisk
                                      /fname" value="(.+?)">/, //sharerun, syfiles, grupload,
                                      /download\-header">\s*<h2>File:<\/h2>\s*<p title="(.+?)">/, //bayfiles
                                      /description">\s*<p><b>Soubor: (.+?)<\/b>/, //bezvadata
                                      /Complete name                            : (.+?)<br \/>/, //bezvadata
                                      /itemprop="name">(.+?)<\/span>/, //bezvadata
                                      /Downloading:\s*<\/strong>\s*<a href="">\s*(.+?)\s*<\/a>/, //rapidgator
                                      /Downloading:\s*<\/strong>\s*<a href="">\s*(.+?)\s*<\/a>/, //alfafile
                                      /Downloading:<\/strong> (.+?) <span>/, //hotfile
                                      /<h1 class="black xxl" style="letter-spacing: -1px" title="(.+?)">/, //megashares
                                      /(?:Filename|Dateiname):<\/b>(?:<\/td><td nowrap>)?(.+?)(?:<br>|<\/td>)/, //billionuploads
                                      /File Download Area<\/center><\/h1><center><h3>(.+?)<\/h3>/, //filebeam
                                      /<h2 class="float\-left">(.+?)<\/h2>/, //easyfilesharing
                                      /<h1 id="file_name" class=".+?" title="(.+?)">/, //box.com
                                      /file_info">\s+<h2><strong>(.+?)<\/strong>/, //fliiby
                                      /dateiname'>(.+?)<\/h1>/, //file-upload.net
                                      /Filename:<\/p>\s+<\/div>\s+<div class=".+?">\s+<p>\s+(.+?)\s+<\/p>/, //sharesix
                                      /File Name:<\/dt>\s+<dd>(.+?)<\/dd>/, //gamefront
                                      /dir="ltr">(.+?) <\/td>/, //unlimitshare.com
                                      /nom_de_fichier">(.+?)<\/div>/, //uploadhero
                                      /OK;(.+?);\d+/, //share-online
                                      /\{"file_info":\{"size":"\d+","name":"(.+?)"\},"/, //depositfiles.com
                                      /(?:Filename|Nom du fichier) :<\/th><td>(.+?)<\/td>/, //1fichier.com
                                      /<div id="file_name" class="span8">\n\s+<h2>(.+?)<\/h2>/, //filefactory.com
                                      /<span class="bgbtn sprite fileIcon ext\w+"><\/span>\s+<strong title="(.+?)">/, //gigasize.com
                              //      /<span class="label label-important">Downloading<\/span>\s<br>\s(.+?)\s[\d\.]+\s\w+\s<\/h4>/, //nowdownload.eu
                                      /<!-- File header informations  -->\n\s*<br\/>\n\s*<h1>(.+?)<\/h1>/, //mixturecloud.com
                                      /<span class="file-name">(.+?)<\/span>/, //anysend.com
                                      /<td class="dofir" title="(.+?)">/, //billionuploads.com
                                   // /<title>uploadto.us - (.+?)<\/title>/, //uploadto.us|ultramegabit.com
                                      /<div id="download\-title">\n\s*<h2>(.+?)<\/h2>/, //solidfiles.com
                                      /<div class="content_m"><div class="download"><h1>(.+?)<\/h1>/, //mystore.to
                                      /<h4 class="dl_name w420" >\s*(.+?) <span/, //myvdrive.com
                                      /<div class='badge pull-right'>.+?<\/div>\s*<h1>Download (.+?)<\/h1>/, //filemonkey.in
                                      /<div id="file_name" title="(.+?)">/, //uploadable.ch
                                      /src="img\/view_arrow_ltr.png" alt="">\s*<span title="(.+?)">/,//nitroflare.com
                                      /<h1 class="title mb-2">(.+?)<\/h1>/,//dropapk.to
                                      /<p>Download the file (.+?) now.<\/p>/, //workupload.com
                                      /<h1>(.+?)<\/h1>/, //yourupload.com
                                      /<span class="name-file">(.+?)<\/span>/,//k2s.cc
                                      /<p>(.+?)<\/p>\s*<p class="file-size">/, //filefox.cc
                                      /<div class="name">\s*<h4>(.+?)<\/h4>/, //usersdrive.com
                                      /<span class="dfilename">(.+?)<\/span>/, //bdupload.asia
                                      /<div class="desc">\s*<span>(.+?)<\/span>\s*<p>/, //intoupload.net
                                      /<div class="param">\s*<span class="name">(.+?)<\/span><br>\s*<span class="size">/, //easybytez.com
                                      /<div class="heading-1">(.+?)<\/div>/, //filesupload.org
                                      /<h1 class="text-center text-wordwrap">(.+?)<\/h1>/, //file.bz
                                      /<h2 class="file-name">(.+?)<\/h2>/, //FF
                                      /<b>File Name: <\/b>\s*(.+?) \(/, //uploadpages.com/
                                      /<td class="titre normal" style="width:180px">Filename :<\/td>\s*<td class="normal">(.+?)<\/td>/,
                                      /<h1 class="pageTitle">File: <b>(.+?)<\/b><\/h1>/, //upload.ee
                                      /class="filename">(.+?)<span class="filesize">/,//uploadgig.com
                                      /<h1 style="font-size:23px">(.+?)<\/h1>/, //
                                      /class="name position-relative">\s*<h4>(.+?)<\/h4>/, //
                                      /Download File\s*<span>(.+?)<\/span><\/h2>/, //TakeFile
                                      /<span class="coin-name">\s*<h5>(.+?)<\/h5>/, //krakenfiles.com
                                      /<td style="word-break: break-all;">(.+?)<\/td>/,//workupload.com
                                     ];
                var nameIdx = nameRegexs.length;


                //      [sizeRegexs]
                //      /    \    \?
                //   prefix (size) postfix
                //           /   \
                //          val  quant

                var quantRegex = '(?:M|G|K)?i?(?:B)(?:[y|i]te?s?)?';
                var valRegex = '\\d+(?:[\\., ]\\d+){0,2}'; // 111([., ]222)?([., ]333)?

                var uniSizeRegex = valRegex + '(?:\\s*|&nbsp;)' + quantRegex;

                var preSizeRegex = '(?::|\\(|>|>, | - |\\[)';
                var postSizeRegex = '(?:\\))?';

                var sizeRegexs = [     preSizeRegex + "\\s*(" + uniSizeRegex + ")\\s*" + postSizeRegex,
                                      'FileSize_master">(.+?)<\/strong>', //hellshare
                                      'Velikost: <strong>(.+?)<\/strong>', //warserver
                                      'online,\\w+,(\\d+),', //uploaded.net
                                      '"file_info":{"size":"(\\d+)","name":', //depositfiles.com
                                      '(?:File size|Taille) :<\/th><td>(.+?)<\/td>', //1fichier.com
                                      ';(\\d+)\n$', //share-online.biz
                                      'label-important">Downloading<\/span>.+?(' + uniSizeRegex + ') <\/h4>', //nowdownload.eu
                                      '<h5>Size : (' + uniSizeRegex + ')<\/h5>', //mixturecloud.com,
                                      '<td>\\n\\s*Total size:\\n\\s*</td>\\n\\s*<td>\\n\\s*(.+?)\\s*</td>', //anysend.com
                                      'span class="filename_normal">\\((' + uniSizeRegex + ')\\)</span>', //uploadable.ch
                                      'class="fa fa-bars"><\/i>\\s*(.+?)(?:\\s*|&nbsp;)' + quantRegex + '<\/td>', //filesharez.cz
                                      '<li>File size:\\s*<span>(.+?)<\/span><\/li>', //mediafire
                                 ];
                var sizeIdx = sizeRegexs.length;

                var tooltip = "File Name: <b>";

                var fileName = "unknown";
                var nameCandidate = "";
                while(nameIdx--)
                {
                    nameCandidate = res.match(nameRegexs[nameIdx]);
                    if (nameCandidate != null)
                    {
                        fileName = nameCandidate[1].replace(/&nbsp;/g," ").replace("<br>", "");
                        break;
                    }
                }

                tooltip += fileName + "</b><br>File Size:  <b>";

                var fileSize = "unknown";
                var sizeCandidate = "";
                while(sizeIdx--)
                {
                    sizeCandidate = res.match(new RegExp(sizeRegexs[sizeIdx], "i"));
                    if (sizeCandidate != null)
                    {
                        fileSize = sizeCandidate[1].replace(/&nbsp;/g," ");
                        if (/^\d+$/.test(fileSize) && fileSize >= 1024) ///assume bytes
                        {
                            if(fileSize > (1<<30)) fileSize = Math.round(10 * fileSize / (1<<30)) / 10 + ' GB';
                            else if(fileSize > (1<<20)) fileSize = Math.round(fileSize / (1<<20)) + ' MB';
                            else fileSize = Math.round(fileSize / 1024) + ' KB';
                        }
                        break;
                    }
                }

                tooltip += fileSize + "</b>";

                // Safelinking package info
                if (href.contains('safelinking.net/'))
                {
                    var linkStatus = res.match(/<span style="color:green;" class="result-form">(.+?)<\/span>/);
                    var linkTitle = res.match(/link\-title">(.+?)<\/span>/);
                    var linkDesc = res.match(/description" class="result-form">(.+?)<\/span>/);
                    if (linkStatus) { tooltip = "<b>Link status:</b> " + linkStatus[1].replace(/<\/?strong>/,"").replace(/<br\/>/, " "); }
                    if (linkTitle) { tooltip += "<br><b>Title:</b> " + linkTitle[1]; }
                    if (linkDesc) { tooltip += "<br><b>Description:</b> " + linkDesc[1]; }
                }
                if (href.contains('safelinking.com/'))
                {
                    var linkStatus = res.match(/<span style="color:green;" class="result-form">(.+?)<\/span>/);
                    var linkTitle = res.match(/link\-title">(.+?)<\/span>/);
                    var linkDesc = res.match(/description" class="result-form">(.+?)<\/span>/);
                    if (linkStatus) { tooltip = "<b>Link status:</b> " + linkStatus[1].replace(/<\/?strong>/,"").replace(/<br\/>/, " "); }
                    if (linkTitle) { tooltip += "<br><b>Title:</b> " + linkTitle[1]; }
                    if (linkDesc) { tooltip += "<br><b>Description:</b> " + linkDesc[1]; }
                }

                // kprotector package info
                // if (href.contains('kprotector.com/'))
                // {
                //     var linkStatus = res.match(/<span style="color:green;" class="result-form">(.+?)<\/span>/);
                //     var linkTitle = res.match(/link\-title">(.+?)<\/span>/);
                //     var linkDesc = res.match(/description" class="result-form">(.+?)<\/span>/);
                //     if (linkStatus) { tooltip = "<b>Link status:</b> " + linkStatus[1].replace(/<\/?strong>/,"").replace(/<br\/>/, " "); }
                //     if (linkTitle) { tooltip += "<br><b>Title:</b> " + linkTitle[1]; }
                //     if (linkDesc) { tooltip += "<br><b>Description:</b> " + linkDesc[1]; }
                // }

                link.warlc_tooltipcache = tooltip;

                if (mouseoverLink == link.href) //mouse cursor is still over the link
                {
                    warlcTooltip.innerHTML = tooltip;
                }
            }
        });
    }
}

//function to return hostname + tld
function gimmeHostName(link) {
    if (link.contains(/([\w-]+\.(?:com?\.\w{2}|in\.ua|uk\.com|\w{2,8}))(?::\d+)?$/)) return link.match(/([\w-]+\.(?:com?\.\w{2}|in\.ua|uk\.com|\w{2,8}))(?::\d+)?$/)[1];
    else {
        console.warn("gimmeHostName error.", link);
        return -1;
    }
}
//Second gimmehostname function to match whole hostname
function gimmeHostName2(link) {
    link = link.replace(/http:\/\/.*?\?http:\/\//, 'http://'); //anonymizers
    if (link.contains(/(?:https?:\/\/)?(?:www\.|[\w\.])*?[\w-]+\.(?:com?\.\w{2}|in\.ua|uk\.com|\w{2,8})(?::\d+)?\//)) return link.match(/(?:https?:\/\/)?(?:www\.|[\w\.])*?([\w-]+\.(?:com?\.\w{2}|in\.ua|uk\.com|\w{2,8}))(?::\d+)?\//)[1];
    else if (link.contains(".1fichier.com")) { return "1fichier.com";}
    else {
        console.warn("gimmeHostName error.", link);
        return -1;
    }
}

function uniqArray(array) {
    var uniqueArray = [];
    $.each(array, function(i, el){
        if($.inArray(el, uniqueArray) === -1) uniqueArray.push(el);
    });
    return uniqueArray;
}

function randArr(array) {
    return array[Math.floor(Math.random() * array.length)];
}

var UA = { //obj used for rUA()
    OSes: [
        "Windows NT 5.1",
        "Windows NT 6.1; WOW64",
        "Windows NT 10.0; Win64; x64",
        "Windows NT 6.3; Win64; x64",
        "Macintosh; Intel Mac OS X 10_9_2",
        "Macintosh; Intel Mac OS X 10_9_3",
        "Macintosh; Intel Mac OS X 10_10_0"
    ],
    UAs: [
        "Mozilla/5.0 (%) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/537.36", //Chrome 35
        "Mozilla/5.0 (%) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.67 Safari/537.36", //Chrome 36
        "Mozilla/5.0 (%) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2049.0 Safari/537.36", //Chrome 37
        "Mozilla/5.0 (%) Gecko/20100101 Firefox/30.0", //FF 30
        "Mozilla/5.0 (%) Gecko/20100101 Firefox/31.0", //FF 31
        "Mozilla/5.0 (%) AppleWebKit/600.1.8 (KHTML, like Gecko) Version/8.0 Safari/600.1.8" //Safari 6
    ]
}

function rUA() { //generates a random user agent to fool websites about browser signatures
    return navigator.userAgent;//randArr(UA.UAs).replace('%', randArr(UA.OSes));
}

function sendMessage(content)
{
    var msgDiv = "<div class='WarBBInfoMsg'>" + content + "</div>";
    $(".WarBBInfoBox").append(msgDiv).show();
    setTimeout(function(){$(".WarBBInfoBox").hide()}, 5000);
}

function genset(pref, def) {
    var val = preferences.general[pref];
    if (val == undefined) val = def;
    return val;
}

function lsSave() {
    localStorage.setItem("WarBB_Preferences", JSON.stringify(preferences));
}

function setVariables()
{
    if (firstRun)
    {
        console.warn('First run, compiling preferences object...');
        preferences = {
            hosts: {},
            general: {}
        }

        lsSetVal("general", "Display_tooltip_info", true);
        lsSetVal("general", "Display_full_links_in_link_containers", false);
        lsSetVal("general", "Allow_spaces_in_DL_links", false);
        lsSetVal("general", "Do_not_linkify_DL_links", false);
        lsSetVal("general", "Filefactory_API_Check", false);
        lsSetVal("general", "Rapidgator_API_Check", false);
        lsSetVal("general", "Processbox_Pos_Y", 0);
        lsSetVal("general", "Processbox_Pos_X", 90);
        lsSetVal("general", "Progressbox_Scaling", 100);
        lsSetVal("general", "Last_Update_Check", new Date().valueOf());
        lsSetVal("general", "Ref_anonymize_service", ANONYMIZERS[0]);
        lsSetVal("general", "Show_Update_Notification", true);
        lsSetVal("general", "Focus_First_Link", false);

        localStorage.setItem("WarBB_First_Run", false);
        lsSave();
    }

    Display_tooltip_info = genset("Display_tooltip_info", true);
    Display_full_links_in_link_containers = genset("Display_full_links_in_link_containers", true);
    Allow_spaces_in_DL_links = genset("Allow_spaces_in_DL_links", false);
    Do_not_linkify_DL_links = genset("Do_not_linkify_DL_links", false);
    Processbox_Pos_Y = genset("Processbox_Pos_Y", 0);
    Processbox_Pos_X = genset("Processbox_Pos_X", 90);
    Progressbox_Scaling = genset("Progressbox_Scaling", 100);
    Last_Update_Check = genset("Last_Update_Check", 0);
    Show_Update_Notification = genset("Show_Update_Notification", true);
    Focus_First_Link = genset("Focus_First_Link", false);
    ANONYMIZE_SERVICE = genset("Ref_anonymize_service", ANONYMIZERS[0]);
    ANONYMIZE_SERVICE = (ANONYMIZE_SERVICE != 'NoRed' ? ANONYMIZE_SERVICE : '');
}

function hostSet(key, def) { //will get the value of the key in pref object, if key is undefined -> opposite value of default returned (to keep the compatibility with old GM_getValue and the inversed default values in WarBB 2.0)
    var val = preferences.hosts[key];
    if (val == undefined) val = !def;
    return val;
}

function lsSetVal(section, key, value) { //replacement of GM_setValue, valid for both sections of preferences object
    preferences[section][key] = value;
    lsSave();
}

// Delinkifies the links
// params:
// links -> list of links or link components (note they should be sufficiently unique to identify the link on page,
// e.g. 'uloz.to/xs68skxl8')
function delinkifySnapshot(snapshot)
{
    var n = snapshot.snapshotLength;

    while (n--)
    {
        thisLink = snapshot.snapshotItem(n);

        var spanElm = document.createElement("span");
        spanElm.className = thisLink.className;
        spanElm.innerHTML = thisLink.innerHTML;

        if (Display_tooltip_info)
        {
            spanElm.href = thisLink.href;

            switch (thisLink.className){
                case "alive_link": spanElm.addEventListener("mouseover", displayTooltipInfo, false); break;
                case "adead_link": spanElm.addEventListener("mouseover", displayTooltipError, false); break;
                case "obsolete_link": spanElm.addEventListener("mouseover", displayTooltipError, false); break;
                case "unava_link": //reserved
                default:
            }
        }

        thisLink.parentNode.replaceChild(spanElm, thisLink);
    }
}


function checkLinks(filterId)
{
    start(filterId);
}

/**
     * Initialises progress box including event binding and CSS
     */
function initProgressBox()
{
    if ($("#warlc-progressbox").length > 0)
        return;

    //progressbox css
    var progressboxCss = "#warlc-progressbox  {position:fixed; background:white; bottom:" + Processbox_Pos_Y + "%; left:" + Processbox_Pos_X + "%; padding:5px; font-size:10px; font-weight:bold; font-family:Helvetica; width:130px; cursor:default; border:1px solid #4DD9FF; z-index:200;}\
\
#warlc-hostdetails  {position:fixed; background:white; bottom:" + (parseInt(Processbox_Pos_Y) + 9) + "%; left:" + Processbox_Pos_X + "%; padding:5px; font-size:10px; font-weight:bold; cursor:default; border:1px solid #4DD9FF; display:none; z-index:201;}\
\
.warlc-progressbox-contents {right: 5px;}\
\
.warlc-progressbar {text-align:left; background: lightGrey; height:3px; margin-bottom:5px; width:0px; border-radius:1.5px; }\
\
.warlc-progressitem { display: block; padding:2.5px 0px 2.5px 20px }\
\
.alive {color: rgb(133, 195, 49); background:transparent url(" + alive_link_png + ") no-repeat scroll 0% 50%;background-size:15px;}\
\
.adead {color: red; background:transparent url(" + adead_link_png + ") no-repeat scroll 0% 50%;background-size:15px;}\
\
.unava {color: #FF9900; background:transparent url(ToBeAddedLater) no-repeat scroll 0% 50%;background-size:15px;}\
\
.unknown {color: rgb(0, 150, 255); background:transparent url(" + unknown_link_png + ") no-repeat scroll 0% 50%;background-size:15px;}\
\
.processing {color: grey; background:transparent url(" + processing_link_gif + ") no-repeat scroll 0% 50%;}"

    if (Progressbox_Scaling != 100) {
        $.each(progressboxCss.match(/[\d\.]+px/g), function(i, el) { //dynamic rescaling of the progressbox according to user settings
            progressboxCss = progressboxCss.replace(new RegExp(el + "(?!" + RAND_STRING + ")"), parseFloat(el) * Progressbox_Scaling/100 + "px" + RAND_STRING); //RAND_STRING to prevent the same value replaced twice
        });
    }

    progressboxCss = progressboxCss.replace(new RegExp(RAND_STRING, "g"), "").replace("ToBeAddedLater", unava_link_png); //inserting the unava_link_png at the end because the function messes up its base64 string

    GM_addStyle(progressboxCss);

    $('body').append('    <div id="warlc-progressbox">\
<div class="warlc-progressbox-contents">\
<div class="warlc-progressbar" aria-valuenow=0></div>\
<div class="warlc-progressitems">\
<span class="warlc-progressitem alive"></span>\
<span class="warlc-progressitem adead"></span>\
<span class="warlc-progressitem unava"></span>\
<span class="warlc-progressitem unknown"></span>\
<span class="warlc-progressitem processing"></span>\
</div>\
</div>\
</div>\
<div id="warlc-hostdetails"></div>');

    $('#warlc-progressbox').hide().click(function(){
        clearInterval(intervalId);
        $(this).hide();
        return false;
    });

    $(".warlc-progressitem").hover(function() {
        showHostDetails(this);
    }, function() {
        showHostDetails("none");
    });

}

function showHostDetails(item) {
    var $div = $("#warlc-hostdetails");
    if (item == "none") {
        $div.hide().removeClass();
        if ($("#warlc-progressbox").css("display") != "none") intervalId = setInterval(function() { updateProgress(); }, 1000);
    }
    else {
        function help(status) {
            return $('warbb[name="filehosts"]').attr(status);
        }
        var statusArr;
        var divTxt = "The following hosts ";
        switch(item.className) {
            case "warlc-progressitem alive": divTxt += "have been found alive: "; statusArr = help('live'); break;
            case "warlc-progressitem adead": divTxt += "have been found dead: "; statusArr = help('dead'); break;
            case "warlc-progressitem unava": divTxt += "have been found unavailable: "; statusArr = help('unava'); break;
            case "warlc-progressitem unknown": divTxt += "are unknown: "; statusArr = help('unknown'); break;
            case "warlc-progressitem processing": divTxt += "are still processing: "; statusArr = getProcHosts(); break;
        }
        $div.addClass(item.className);
        $("#warlc-progressbox").append($div);
        if (statusArr == "") divTxt = divTxt.replace("The following", "No").replace(":", ".");
        $div.text(divTxt + statusArr.slice(0,statusArr.length-1).replace(/,/g, ", "));
        clearInterval(intervalId);
        $div.show();
    }

}

function getProcHosts() {
    var filehostsProc = "";
    var $links = $(".processing_link");
    if ($links.length > 0) {
        var i = $links.length;
        var hostname;
        while (i--)
        {
            hostname = gimmeHostName2($links[i].href);
            if (!filehostsProc.contains(hostname)) {
                filehostsProc += hostname + ",";
            }
        }
    }
    return filehostsProc;
}

function dismissProgressbar() {
    $(".warlc-progressbar").fadeOut();
    $(".warlc-progressitem.processing").fadeOut();
    clearInterval(intervalId); //stops refreshing the stats
}

/**
     * Updates progress data in progress box
     */
var percAlive, percDead, percUnava, percProc, percUnknown;
function updateProgress()
{
    if (cLinksTotal) // some links were detected on page
    {
        var percProgress = Math.round(((100 / cLinksTotal) * cLinksProcessed));
        var $progressItems = $('.warlc-progressitems > .warlc-progressitem');

        $(".warlc-progressbar").css("width", percProgress + "%");
        $(".warlc-progressbar").attr("aria-valuenow", percProgress);

        percAlive = Math.round((cLinksAlive / cLinksTotal) * 100);
        percDead = Math.round((cLinksDead / cLinksTotal) * 100);
        percUnava = Math.round((cLinksUnava / cLinksTotal) * 100);
        percUnknown = Math.round((cLinksUnknown / cLinksTotal) * 100);
        percProc = Math.round(((cLinksTotal - cLinksProcessed) / cLinksTotal) * 100);

        $progressItems.first().text(cLinksAlive + " - " + percAlive + "% Alive")
            .next().text(cLinksDead + " - " + percDead + "% Dead")
            .next().text(cLinksUnava + " - " + percUnava + "% Unavailable")
            .next().text(cLinksUnknown + " - " + percUnknown + "% Unknown")
            .next().text(cLinksTotal - cLinksProcessed + " - " + percProc + "% Processing");
        if (percProgress > 0) $("#warlc-progressbox").show();
        if (percProgress == 100) dismissProgressbar();

        if (Focus_First_Link) {
            $('html, body').animate({
                scrollTop: ($("a[class$='_link']").first().offset().top)
            }, 500);
        }
    }

    // setSessionStorage();
}

function check_all_links()
{
    add_WARLC_style();

    initProgressBox();
    intervalId = setInterval(function(){updateProgress();}, 1000);

    start(null);
}

function KeyDownHandler(event)
{
    var kcode = (event.keyCode) ? event.keyCode : event.which;
    if (event.ctrlKey && event.shiftKey)
    {
        switch(kcode)
        {
            case 89 : check_all_links(); break;
            case 67 : configuration(); break;
        }
    }
}

//
//
//   SCRIPT EXECUTION START POINT
//
//

//init the stuff
setVariables();

//register GM menu commands & keyboard shortcut event handler
$(document).keydown(KeyDownHandler);
GM_registerMenuCommand("[WarBB - Warez-BB Links Checker] Configuration  (CTRL + SHIFT + C)", configuration);
GM_registerMenuCommand("[WarBB - Warez-BB Links Checker] Check All Links (CTRL + SHIFT + Y)", check_all_links);

//start linkchecking
$(document).ready(function() {
  check_all_links();

});
//
//
//   SCRIPT EXECUTION END POINT
//
//

//shows configuration box
function configuration()
{

    //prevent multiple creating of config window
    if ($("#hideshow").length)
    {
        $("#hideshow").show();
        return;
    }

    var settingsIcon = "data:image/png;base64,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";

    var configcss = '\
.popup_block .popup fieldset{\
padding: 1%;\
border-style: none;\
border-width: 0;\
border-color: white;\
margin-bottom: 1px;\
}\
.popup_block .popup hr {\
height: 1px;\
border-color:black;\
}\
#WarBBTitle{\
font-size: 2em;\
width:100%;\
}\
#hideshow {\
position: fixed;\
width: 100%;\
height: 100%;\
top: 0;\
left: 0;\
font-size:12px;\
z-index:2147483647;\
text-align:left;\
}\
#fade {\
background: #000;\
position: fixed;\
width: 100%;\
height: 100%;\
opacity: .80;\
-ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=80)";\
left: 0;\
z-index: 10;\
}\
.popup_block {\
font-family:verdana;\
color:black;\
background: #ddd;\
padding: 10px 20px;\
border: 2px solid #4DD9FF;\
float: left;\
width: 700px;\
position: absolute;\
top: 7%;\
left: 50%;\
bottom: 7%;\
margin: 0 0 0 -350px;\
-moz-border-radius:10px;\
z-index: 100;\
}\
.popup_block .popup {\
display: block;\
float: left;\
width: 100%;\
height: 95%;\
background: #fff;\
margin: 10px 0px;\
border: 1px solid #4DD9FF;\
}\
.popup p {\
padding: 1px 10px;\
margin: 0px 0;\
-x-system-font:none;\
font-family:verdana,geneva,lucida,"lucida grande",arial,helvetica,sans-serif;\
font-size:10pt;\
font-size-adjust:none;\
font-stretch:normal;\
font-style:normal;\
font-variant:normal;\
font-weight:normal;\
line-height:normal;\
}\
#note {\
font-size:7pt;\
color:gray;\
padding: 1px 10px;\
margin: 0px 0;display:inline-block;\
min-width:100px;\
}\
#configinfo {\
font-size:8pt;\
color:gray;\
padding: 1px 10px;\
margin: 0px 0;display:inline-block;width:60em;\
}\
#WarBBTabs > input[type="button"], .WarBBButtons > input[type="button"] {\
display: inline-block;\
font-size: 12px;\
font-weight: normal;\
background-color: rgb(238, 238, 238);\
background-position: 0px -178px;\
background-repeat: repeat-x;\
text-shadow: 0px 1px rgb(255, 255, 255);\
padding: 4px 8px;\
position: relative;\
overflow: hidden;\
color: rgb(51, 51, 51);\
margin: 0 0;\
border: 1px solid rgb(170, 170, 170);\
border-radius: 0 0 0 0;\
box-shadow: 0px 12px rgb(255, 255, 255) inset;\
float: left;\
}\
#WarBBTabs > input[type="button"] {\
border-bottom: none;\
}\
#WarBBSeparator {\
border-bottom: 1px solid rgb(170, 170, 170);\
margin-top: 24px;\
}\
#selectAllButton {\
border-radius: 3px 0 0 3px;\
border-right: none;\
}\
#invertButton {\
border-radius: 0 3px 3px 0;\
border-left: none;\
}\
#WarBBTabs > input[name="WarBBHosts"] {\
border-radius: 3px 0 0 0;\
border-right:none;\
margin-left:10px;\
}\
#WarBBTabs > input[name="WarBBAbout"] {\
border-radius: 0 3px 0 0;\
border-left:none;\
}\
.WarBBButtons > input[type="button"]:hover {\
padding: 5px 8px 3px;\
box-shadow: 0 0 white;\
background: none;\
}\
#WarBBTabs > input.activeTab {\
padding: 5px 8px 3px;\
box-shadow: 0 0 white;\
background: none;\
}\
.WarBBTab {\
display: none;\
}\
.WarBBButtons, #WarBBTabs, #warlcsitelist1 {\
margin-left: 5px;\
}\
#warlcsitelist1 {\
border-top: 1px solid grey;\
padding-top: 5px;\
overflow:auto;\
margin-top:2px;\
}\
.WarBBTabContainer {\
overflow:auto;\
}\
input:hover+label {\
background:#F1F77C;\
font-size:110%;\
}\
.popup_block .popup legend {\
display:block;\
width:100%;\
padding:0;\
margin-bottom:2px;\
font-size:15px;\
line-height:inherit;\
color:#333;\
border:0;\
border-bottom:1px solid #e5e5e5\
}\
';

    GM_addStyle(configcss);

    var configurationinnerHTML =
        '<div id="fade"></div>\
<div class="popup_block">\
<div class="popup">\
<div id="WarBBTitle" style="height: 1.2em"><img src=' + settingsIcon + ' style="height:35px;margin-left:2px;vertical-align:middle;"></img>WarBB - Configuration</div><br>\
<div id="WarBBTabs">\
<input type="button" name="WarBBHosts" class="activeTab" value="Filehostings">\
<input type="button" name="WarBBSettings" value="Settings">\
<input type="button" name="WarBBAbout" value="About">\
</div>\
<div id="WarBBSeparator"></div>\
<div id="WarBBHosts" class="WarBBTab">\
<br><div class="WarBBButtons">\
<input type="button" id="selectAllButton" value="Select All">\
<input type="button" id="selectNoneButton" value="Select None">\
<input type="button" id="invertButton" value="Invert">\
</div><br><br>\
<input style="margin-left:5px;" type="textbox" placeholder="Search filehost" id="hostSearchBox" value="">\
<div id="warlcsitelist1"><span>Empty</span></div>\
</div>\
<div id="WarBBSettings" class="WarBBTab">\
<br>\
<div id="WarBBPreferences" class="WarBBTabContainer">\
<fieldset>\
<legend>General settings</legend>\
<p><input type="checkbox" id="Do_not_linkify_DL_links"> Do NOT linkify DL links</p>\
<p><input type="checkbox" id="Allow_spaces_in_DL_links"> Allow spaces in DL links<br><div id="configinfo">Note: All links must end with a new line!</div></p>\
<p><input type="checkbox" id="Display_full_links_in_link_containers"> Display full links in link containers</p>\
<p><input type="checkbox" id="Display_tooltip_info"> Display tooltip info<br><div id="configinfo">Note: File name, file size, error messages etc.</div></p>\
<p><input type="checkbox" id="Show_Update_Notification">Show notification when WarBB is up to date</p>'
    //<p><input type="checkbox" id="Focus_First_Link">Focus on the first link found</p>\
    + '</fieldset>\
<fieldset>\
<legend>Progressbox settings</legend>\
<p>Horizontal positioning of the progressbox: <input type="text" id="Processbox_Pos_X"><br><div id="configinfo">Note: Define this value in percentages starting from the left of the screen.</div></p>\
<p>Vertical positioning of the progressbox: <input type="text" id="Processbox_Pos_Y"><br><div id="configinfo">Note: Define this value in percentages starting from the bottom of the screen.</div></p>\
<p>Scaling of the progressbox: <input type="text" id="Progressbox_Scaling"><br><div id="configinfo">Note: Resizes the progressbox. Define this value in percentages. 100% = full size, 200% = double size, etc</div></p>\
</fieldset>\
<fieldset>\
<legend>Host options</legend>\
<p>Anonymizer:\
<select style="margin-left:5px;" id="redirector">\
<option>Lorem ipsum dolorem</option>\
</select></p>\
<p><input type="checkbox" id="Filefactory_API_Check"> Check Filefactory.com links through API</p>\
<p><input type="checkbox" id="Rapidgator_API_Check"> Check Rapidgator.net links through API</p>\
<div id="configinfo">Note: We cannot guarantee this will work. If disabled, WarBB will use a website check instead.</div>\
</fieldset>\
</div>\
</div>\
<div id="WarBBAbout" class="WarBBTab">\
<br>\
<div class="WarBBTabContainer">\
<fieldset>\
<legend>WarBB3 - WarezLC Link Checker v' + WarezLC_version + '</legend>\
<p>Authors: HD3D (<a href="https://www.warezbook.org/u/HD3D">GreasyFork</a>)</p>\
<p>Based on W.A.R. Links Checker - Dev</p>\
<p>Original by dkitty</p>\
<p>Graphics by LiabilityZero (<a href="#">Warez-BB</a>)</p>\
</fieldset>\
<br />\
<fieldset>\
<legend>Currently supported</legend>\
<p>Filehostings: ' + allHostNames.length + '<br />\
Containers: ' + allContainerNames.length + '<br />\
Obsolete sites: ' + allObsoleteNames.length + '<br /></p>\
</fieldset>\
<br />\
<fieldset>\
<legend>Uses</legend>\
<p>adam_3\'s <a href="http://userscripts.org/scripts/show/2254">Linkify ting</a> (modified)</p>\
<p><a href="https://jquery.com/">jQuery</a> JavaScript Library</p>\
</fieldset>\
<br />\
<fieldset>\
<legend>License</legend>\
<p>GPL version 3 or any later version (<a href="http://www.gnu.org/copyleft/gpl.html">http://www.gnu.org/copyleft/gpl.html</a>)</p>\
</fieldset>\
</div>\
</div>\
</div>\
</div>';

    $('body').append('<div id="hideshow">' + configurationinnerHTML + '</div>');
    $("#WarBBHosts").show();

    //sets height of warlcsitelist1
    var totalHeight = $(".popup").height();
    $("#warlcsitelist1").height(totalHeight - 155); $(".WarBBTabContainer").height(totalHeight - 90);
    $("#WarBBSeparator").css("margin-top", 9 + $(".activeTab").height() + "px"); //because the buttons have a different height on the different themes

    $("#WarBBTabs > input[type='button']").click(function() {
        var $target = $(this);
        var current = "#" + $(".activeTab").removeClass().attr("name"); $(current).hide();
        var targetTab = "#" + $target.addClass("activeTab").attr("name"); $(targetTab).show();
    });

    $("#fade").click(function(event) {
        $("#hideshow").hide(); event.preventDefault();
    });

    var elmHostList = document.getElementById("warlcsitelist1");

    buildSettings();
    buildSitelist("", allHostNames, elmHostList);
    appendObsolete("", allObsoleteNames, elmHostList);

    //handler for checkbox state change
    function changeConfiguration(e)
    {
        var element = e.target;

        if (element.type == 'checkbox')
        {
            if (element.checked == 1)
            {
                lsSetVal("hosts", element.id, true);
            }
            else
            {
                lsSetVal("hosts", element.id, false);
            }

        }
    }

    //Selects all filehosting checkboxes
    function selectAll()
    {
        $(":checkbox:visible:not(:checked)").prop("checked",true)
            .each(function(index, element){lsSetVal("hosts", this.id, true)});
    }

    //Deselects all filehosting checkboxes
    function selectNone()
    {
        $(":checkbox:visible:checked").prop("checked",false)
            .each(function(index, element){lsSetVal("hosts", this.id, false)});
    }

    //Inverts filehosting checkboxes selection
    function selectInvert()
    {
        var $checked = $(":checkbox:visible:checked");
        var $unchecked = $(":checkbox:visible:not(:checked)");

        $unchecked.prop("checked",true)
            .each(function(index, element){lsSetVal("hosts", this.id, true)});
        $checked.prop("checked",false)
            .each(function(index, element){lsSetVal("hosts", this.id, false)});
    }

    //Sets anonymizer setting
    function changeAnonymizer()
    {
        var val = $("#redirector").val();
        lsSetVal("general", "Ref_anonymize_service", (val == ANONYMIZERS.length ? '' : ANONYMIZERS[val]));
        $('#redirector option[value=' + val + ']').prop('selected', true);
    }

    //Sets selected redirector option
    var anonlist = "";
    $(ANONYMIZERS).each(function(index, value) {
        anonlist += '<option value=' + index  + (value == ANONYMIZE_SERVICE ? ' selected' : '') + '>' + gimmeHostName2(value) + '</option>';
    });
    anonlist += '<option value="' + ANONYMIZERS.length + '">No referer</option>';
    $('#redirector').html(anonlist);

    //Sets Processbox position setting
    function changeProgBox(event) {
        var setting;
        switch(event.data.set) {
            case "X": setting = "Processbox_Pos_X"; break;
            case "Y": setting = "Processbox_Pos_Y"; break;
            case "Scale": setting = "Progressbox_Scaling"; break;
        }

        var $setting = $("#" + setting);
        var newSet = $setting.val().replace("%", "");
        lsSetVal("general", setting, newSet);
    }

    //Sets value of Processbox position
    $("#Processbox_Pos_X").val(Processbox_Pos_X + "%");
    $("#Processbox_Pos_Y").val(Processbox_Pos_Y + "%");
    $("#Progressbox_Scaling").val(Progressbox_Scaling + "%");

    function buildSettings()
    {
        $("#WarBBPreferences :checkbox").each(function(){
            $(this).prop("checked", genset($(this).attr("id")))
                .click(function(e){
                lsSetVal("general", $(this).attr("id"), $(this).prop("checked"));
                setVariables();
            });
        })
    }

    //Dynamic build of host list
    //param search         [string]    searches for hostnames matching search substring
    //param siteNames     [array]        array of site names
    //param targetNode     [DOM Node]    where the list should be built
    //                                first child node is replaced
    function buildSitelist(search, siteNames, targetNode)
    {
        var searchRegex = new RegExp("\\|?([\\w\\.-]*" + search.replace(/\./g,"\\.").replace(/-/g, "\\-") + "[\\w\\.-]*)\\|?", "i");

        $(targetNode).empty().append("<fieldset id='WarBBHosts1'><legend>Filehosts</legend></fieldset>");
        var $targetNode = $("#WarBBHosts1");

        var searchedSite = "";
        $.each(siteNames, function(i, site){
            if (searchedSite = site.match(searchRegex))
            {
                var baseSite = site.replace(/\|.+/, ""); //filehosting main domain

                //ensuring backward compatibility with the rest of code, to be refactored later
                var oldRSLCvalue = "Check_" + baseSite.replace(/\|.+/, "").replace(/\./g,"_dot_").replace(/-/g, "_dash_") + "_links";
                //

                $targetNode.append('<input type="checkbox" id="' + oldRSLCvalue +'" />\
<label for="' + oldRSLCvalue + '">' + searchedSite[1] + '</label>' +
                                   ((searchedSite[1] != baseSite) ? ('<div id="note"> ( ~ ' + baseSite + ' )</div>') : (""))
                );

                $("#" + oldRSLCvalue).prop("checked", hostSet(oldRSLCvalue, false))
                    .change(changeConfiguration);

                $targetNode.append('<br />');
            }
        });

        $(targetNode).append("<fieldset id='WarBBHosts2'><legend>Containers</legend></fieldset>");
        $targetNode = $("#WarBBHosts2");

        searchedSite = "";
        $.each(allContainerNames, function(i, site) {
            if (searchedSite = site.match(searchRegex)) {
                var oldRSLCvalue = "Check_" + searchedSite[1].replace(/\|.+/, "").replace(/\./g,"_dot_").replace(/-/g, "_dash_") + "_links";
                $targetNode.append('<input type="checkbox" id="' + oldRSLCvalue +'" />\
<label for="' + oldRSLCvalue + '">' + searchedSite[1] + '</label>');
                $("#" + oldRSLCvalue).prop("checked", hostSet(oldRSLCvalue, false))
                    .change(changeConfiguration);
                $targetNode.append('<br />');
            }
        });
    }

    //obsolete hosts checkbox
    function appendObsolete(search, siteNames, targetNode) {
        var searchRegex = new RegExp("\\|?([\\w\\.-]*" + search.replace(/\./g,"\\.").replace(/-/g, "\\-") + "[\\w\\.-]*)\\|?", "i");
        $(targetNode).append('<fieldset id="WarBBHosts3"><legend>Obsolete hosts</legend><input type="checkbox" id="Obsolete_file_hosts" /><label for="Obsolete_file_hosts">Check obsolete file hosts</label><br /></fieldset>');
        $("#Obsolete_file_hosts").prop("checked", hostSet("Obsolete_file_hosts", false))
            .change(changeConfiguration);

        var $targetNode = $("#WarBBHosts3");

        var foundName = "";
        $.each(siteNames, function(i, site){
            if (foundName = siteNames[i].match(searchRegex))
            {
                $targetNode.append('<div id="note">' + foundName[1] + '</div>');
            }
        })
    }

    //event listener binding
    $("#hostSearchBox").keyup(function() {
        buildSitelist($("#hostSearchBox").val(), allHostNames, elmHostList);
        appendObsolete($("#hostSearchBox").val(), allObsoleteNames, elmHostList);
    });
    $("#selectAllButton").click(selectAll);
    $("#selectNoneButton").click(selectNone);
    $("#invertButton").click(selectInvert);
    $("#redirector").change(changeAnonymizer);
    $("#Processbox_Pos_X").change({ set: "X" }, changeProgBox);
    $("#Processbox_Pos_Y").change({ set: "Y" }, changeProgBox);
    $("#Progressbox_Scaling").change({ set: "Scale" }, changeProgBox);

    //buttons and edit boxes init end
}

//Objects for linkchecking
var hostsIDs = {}; //hosts IDs and link regexes
var hostsCheck = {}; //host status IDs and links
var foundMirrors = { //mirrors found on the page, listed by type of check
    BC: [],
    HC: [],
    OH: [],
    RH: [],
    WC: []
}

//begin standard link checking algorithm
function start(filterId)
{
    var doNotLinkify = Do_not_linkify_DL_links;
    var redirectorTypes = { "HTTP_302": 0,
                           "INNER_LINK": 1};

    // USER SELECTED FILE HOSTS INITIALIZATION START
    if (!filterId) {
        initFileHosts();
        initBulkHosts();
        initRedirectors();
        initFileHostsHeadersOnly();
    }
    // USER SELECTED FILE HOSTS INITIALIZATION END

    // LINKIFICATION START
    linkify(filterId);
    //LINKIFICATION END

    //
    //HANDLING REDIRECTORS START
    //
    var redirFunctions = {
        //HTTP_302
        tries: 0,
        processRedirectorLink: function(link, redirectorId) {
           console.log(link);
            link.className = 'container_link';
            var hostname = gimmeHostName2(link.href);
            if (link.href.match("safelinking")) { link.href = link.href.replace(/http:\/\//,"https://"); }
            GM_xmlhttpRequest({
                method: 'HEAD',
                url: link.href,
                headers: {
                    'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
                    'Accept': 'text/xml',
                    'Referer': ""
                },
                onload: function(result) {

                    if (result.status == 404 || result.messsage == "not found ") {
                        if (result.finalUrl.match(/skydrive\.live\.com/)) return;
                        else {
                            link.className = 'adead_link';
                            hostsCheck[redirectorId].cProcessed++;
                            cLinksProcessed++; cLinksDead++;
                            if (filehostsDead.search(hostname) == -1) filehostsDead += hostname + ",";
                        }
                    }
                    else if (result.finalUrl.replace("https", "http") == link.href || result.finalUrl == link.href) // service hasn't redirected anywhere
                    {

                        if (result.status == 404) {
                            link.className = 'adead_link';
                            hostsCheck[redirectorId].cProcessed++;
                            cLinksProcessed++; cLinksDead++;
                            if (filehostsDead.search(hostname) == -1) filehostsDead += hostname + ",";
                        }
                        else if (redirFunctions.tries < 25) {
                            redirFunctions.tries++;
                            processRedirectorLink(link, redirectorId);
                        } else if (redirFunctions.tries >= 25) {
                            cLinksProcessed++; cLinksUnknown++;
                            hostsCheck[redirectorId].cProcessed++;
                            link.className = 'unknown_link';
                            if (filehostsUnknown.search(hostname) == -1) filehostsUnknown += hostname + ",";
                        }
                    }
                    else
                    {
                        hostsCheck[redirectorId].cProcessed++;
                        if (Display_full_links_in_link_containers){
                            link.innerHTML = result.finalUrl;
                        }

                        link.href = result.finalUrl;

                        if (hostsCheck[redirectorId].cProcessed >= hostsCheck[redirectorId].cTotal){
                            checkLinks('container_link');
                        }
                    }
                },
                onerror: function(result) { //probably caused by unresponsive filehosting
                    hostsCheck[redirectorId].cProcessed++;
                    link.className = 'adead_link';
                    cLinksProcessed++; cLinksDead++;
                    if (filehostsDead.search(hostname) == -1) filehostsDead += hostname + ",";
                    if (hostsCheck[redirectorId].cProcessed >= hostsCheck[redirectorId].cTotal)
                        checkLinks('container_link');
                }
            });
        },

        //INNER_LINK (Hotfile.com/links/)
        processRedirectorLinkEx: function(link, redirectorId)
        {
            link.className = 'container_link';

            GM_xmlhttpRequest({
                method: 'GET',
                url: link.href,
                headers: {
                    'User-agent': rUA(),
                    'Accept': 'text/xml',
                    'Referer': ""
                },
                onload: function(result) {
                    link.href = result.responseText.match(hostsCheck[redirectorId].innerLinkRegex)[1];

                    hostsCheck[redirectorId].cProcessed++;

                    if (hostsCheck[redirectorId].cProcessed >= hostsCheck[redirectorId].cTotal)
                        checkLinks('container_link');
                }
            });
        }
    }

    foundMirrors.RH = uniqArray(foundMirrors.RH);
    redirLength = foundMirrors.RH.length;
    if (redirLength > 0) {
        //process redirector links
        var hostID, links, y;
        for(var redirIdx = 0; redirIdx < redirLength; redirIdx++)
        {
            hostID = foundMirrors.RH[redirIdx];
            links = uniqArray(hostsCheck[hostID].links)
            hostsCheck[hostID].cTotal = links.length;

            cLinksTotal += links.length;
            y = links.length;

            while(y--) {
                switch(hostsCheck[hostID].type) {
                    case redirectorTypes.HTTP_302:       redirFunctions.processRedirectorLink(links[y], hostID); break;
                    case redirectorTypes.INNER_LINK:     redirFunctions.processRedirectorLinkEx(links[y], hostID); break;
                    default:
                }
            }

            hostsCheck[hostID].links = [];
        }
    }
    foundMirrors.RH = [];
    //
    //HANDLING REDIRECTORS END
    //

    //STANDARD LINKCHECKING START
    foundMirrors.WC = uniqArray(foundMirrors.WC);
    var WCLength = foundMirrors.WC.length;
    if (WCLength > 0) {
        var hostID, links, isAliveRegex, isDeadRegex, isUnavaRegex, tryLoop, y;
        while(WCLength--) {
            hostID = foundMirrors.WC[WCLength];
            links = uniqArray(hostsCheck[hostID].links);

            if (filterId == null)
            {
                cLinksTotal += links.length;
            }

            isAliveRegex = hostsCheck[hostID].liveRegex;
            isDeadRegex = hostsCheck[hostID].deadRegex;
            isUnavaRegex = hostsCheck[hostID].unavaRegex;
            tryLoop = hostsCheck[hostID].tryLoop;

            y = links.length;

            while (y--)
            {
                geturl(links[y], isAliveRegex, isDeadRegex, isUnavaRegex, tryLoop);
            }
            hostsCheck[hostID].links = [];
        }
    }
    foundMirrors.WC = [];
    //STANDARD LINKCHECKING END

    //OBSOLETE FILE HOSTS PROCESSING START
    foundMirrors.OH = uniqArray(foundMirrors.OH);
    var OHLength = foundMirrors.OH.length;
    if (OHLength > 0) {
        var hostID, links, y;
        while(OHLength--) {
            hostID = foundMirrors.OH[OHLength];
            links = uniqArray(hostsCheck[hostID].links);

            if (filterId == null)
            {
                cLinksTotal += links.length;
            }

            y = links.length;

            while (y--)
            {
                $(links[y]).attr('warlc_error', 'Cause of error: <b>Obsolete filehosting.</b>');
                displayTheCheckedLink(links[y], "obsolete_link");
            }
            hostsCheck[hostID].links = [];
        }
    }
    foundMirrors.OH = [];
    //OBSOLETE FILE HOSTS PROCESSING END

    //DIRECT LINKCHECKING START
    foundMirrors.HC = uniqArray(foundMirrors.HC);
    var HCLength = foundMirrors.HC.length;
    if (HCLength > 0) {
        var hostID, links, isAliveRegex, isDeadRegex, y;
        while(HCLength--) {
            hostID = foundMirrors.HC[HCLength];
            links = uniqArray(hostsCheck[hostID].links);

            if (filterId == null)
            {
                cLinksTotal += links.length;
            }

            isAliveRegex = hostsCheck[hostID].liveRegex;
            isDeadRegex = hostsCheck[hostID].deadRegex;

            y = links.length;

            while (y--)
            {
                geturlHeader(links[y], isAliveRegex, isDeadRegex);
            }
            hostsCheck[hostID].links = [];
        }
    }
    foundMirrors.HC = [];
    //DIRECT LINKCHECKING END

    //Bulkcheck hosts controller
    foundMirrors.BC = uniqArray(foundMirrors.BC);
    var BCLength = foundMirrors.BC.length;
    if (BCLength > 0) {
        var hostID, links, y, corrLink, m, n;
        while(BCLength--) {
            hostID = foundMirrors.BC[BCLength];
            links = uniqArray(hostsCheck[hostID].links);
            if (filterId == null)
            {
                cLinksTotal += links.length;
            }

            //Replace anchors by href's, and processes link corrections
            y = links.length;
            while(y--) {
                corrLink = links[y].href;
                if (hostsCheck[hostID].corrMatch && hostsCheck[hostID].corrMatch.test(corrLink)) corrLink = corrLink.match(hostsCheck[hostID].corrMatch)[1]; //link match corrections
                if (hostsCheck[hostID].corrReplWhat && hostsCheck[hostID].corrReplWith) corrLink = corrLink.replace(hostsCheck[hostID].corrReplWhat, hostsCheck[hostID].corrReplWith); //link replace corrections
                links[y] = corrLink;
            }

            //Filter out dupe links
            links = uniqArray(links);

            m = links.length;
            n = hostsCheck[hostID].blockSize;
            if (m > n) {
                //insert block separators (RAND_STRING) into the array
                for(var i = n; i < (Math.floor(m/n)+1)*n; i += n + 1)
                {
                    links.splice(i, 0, RAND_STRING);
                }
            }

            var sep = hostsCheck[hostID].splitSeparator;

            hostsCheck[hostID].func.call({links:          links.join(sep).replace(new RegExp(sep.replace(/\\/g, "\\") + RAND_STRING + sep.replace(/\\/g, "\\"), "g"), RAND_STRING).replace(new RegExp(RAND_STRING + "$"), "").split(RAND_STRING),
                                          apiUrl:         hostsCheck[hostID].apiUrl,
                                          postData:       hostsCheck[hostID].postData,
                                          resLinkRegex:   hostsCheck[hostID].resLinkRegex,
                                          resLiveRegex:   hostsCheck[hostID].resLiveRegex,
                                          resDeadRegex:   hostsCheck[hostID].resDeadRegex,
                                          resUnavaRegex:  hostsCheck[hostID].resUnavaRegex,
                                          separator:         sep
                                         });

            hostsCheck[hostID].links.length = 0;
        }
    }
    foundMirrors.BC = [];

    //Processes link
    //
    // [string]        link            link URL
    // [string]     isAliveRegex    alive link regex
    // [string]     isDeadRegex        dead link regex
    // [string]     isUnavaRegex    unavailable link regex
    // [boolean]    tryLoop            repeats request until succeeded
    function geturl(link, isAliveRegex, isDeadRegex, isUnavaRegex, tryLoop)
    {
        //host exceptions
        if ((link.href.contains("yourfilelink.com/")) && (!link.href.contains("&dv=1"))) link.href += "&dv=1"; //to bypass yourfilelink wait times
        link.href = link.href.replace("shareplace.com/?", "shareplace.com/index1.php?a="); //to bypass shareplace iframe on shareplace.com/?{id} links
        link.href = link.href.replace('ultramegabit.com', 'uploadto.us'); //to bypass ultramegabit ssl certificates warnings

        if (
            (link.href.contains("http://uploadgig.com/"))
            ||(link.href.contains("http://alfafile.net/"))
           // ||(link.href.contains("http://uploadboy.com/"))
           ) //force https access to uploadgig
            {
                link.href = link.href.replace("http://", "https://");
            }

        var cnudomains = ["clicknupload.club", "clicknupload.co","clicknupload.cc","clicknupload.to"];
        var cnuNewDomains = "clickndownload.org";

        link.href = cnudomains.reduce((href, cnudomains) => href.replace(cnudomains, cnuNewDomains), link.href);

        GM_xmlhttpRequest(
            {

                method: 'GET',
                url: link.href,
                headers: {
                    'User-agent': rUA(),
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Charset': 'windows-1250,utf-8;q=0.7,*;q=0.7',
                    'Referer': ""
                },
                onload: function (result)
                {

                    var res = result.responseText;

                   if(res ===undefined && result.finalUrl.contains("megaup.net/") && result.status==404)
                   {
                       displayTheCheckedLink(link, 'adead_link');
                        return;
                   }

                    if(res !== undefined)
                    {
                        if (res.contains(isAliveRegex))
                        {
                            displayTheCheckedLink(link, 'alive_link');
                            return;
                        }

                        if (res.contains(isDeadRegex))
                        {
                            displayTheCheckedLink(link, 'adead_link');
                            return;
                        }

                        if (res.contains(isUnavaRegex))
                        {
                            displayTheCheckedLink(link, 'unava_link');
                            return;
                        }
                        var resStatus = result.status;

                        if (resStatus == 404)
                        {
                            displayTheCheckedLink(link, 'adead_link');
                            return;
                        }

                        if (resStatus == 500 || resStatus == 503 || resStatus == 403 || res.contains('>Too Many Requests')) //not found/available/temp. unava/too many requests: solely for k2s.cc
                        {
                            if (tryLoop)
                            {
                                //wait 1-5 seconds and repeat the request
                                setTimeout(function(){geturl(link, isAliveRegex, isDeadRegex, isUnavaRegex, tryLoop)}, 1000 + (Math.random() * 4000));
                            }
                            else
                            {
                                displayTheCheckedLink(link, 'unava_link');
                            }

                            return;
                        }
                    }

                    displayTheCheckedLink(link, 'unknown_link');
                    res = "";
                },
                onerror: function ()
                {
                    displayTheCheckedLink(link, 'unknown_link');
                }
            });
    }
    //here the header only request are made
    function geturlHeader(link, isAliveRegex, isDeadRegex)
    {

        if (link.href.contains("disk.karelia.pro/") && !link.href.contains(/karelia\.pro\/fast\/\w+\/.+?/)) {
            geturl(link, 'diskFile\"', '<div id="center">\n+<\/div>', 'optional--', false);
            return;
        }

        if (link.href.contains("demo.ovh.") && link.href.contains("/download/")) {
            specificOvhCheck(link);
            return;
        }

        GM_xmlhttpRequest(
            {
                method: 'HEAD',
                url: link.href,
                headers: {
                    'User-agent': rUA(),
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Charset': 'windows-1250,utf-8;q=0.7,*;q=0.7',
                    'Referer': ""
                },
                onload: function (result)
                {
                    var resStatus = result.status;
                    var resHeaders = "";
                    var finalUrl = result.finalUrl;

                    if (finalUrl.contains("filefactory.com/error.php?code=251") ) {
                        //specificOvhCheck(link);
                        displayTheCheckedLink(link, 'adead_link');
                        return;
                    }
                    if (finalUrl.contains("megaup.net/error.html?e=File+has+been+removed+due+to+inactivity.") ) {
                        //specificOvhCheck(link);
                        displayTheCheckedLink(link, 'adead_link');
                        return;
                    }

                    if (resStatus == 403 || resStatus == 404 || resStatus == 500) //not found/available
                    {
                        displayTheCheckedLink(link, 'adead_link');
                        return;
                    }

                    if (resStatus == 509) //public traffic exhausted
                    {
                        displayTheCheckedLink(link, 'unava_link');
                        return;
                    }

                    resHeaders = result.responseHeaders;

                    if (resHeaders.contains(isDeadRegex) && !link.href.contains('archive.org/'))
                    {
                        displayTheCheckedLink(link, 'adead_link');
                        return;
                    } else if (link.href.contains('archive.org/') && resHeaders.contains(isDeadRegex)) {
                        specArchCheck(link);
                        return;
                    }

                    if (resHeaders.contains(isAliveRegex))
                    {
                        displayTheCheckedLink(link, 'alive_link');
                        return;
                    }

                    if (link.href.contains('rapidgator.net|rg.to')) {
                        geturl(
                            link,
                            /btm" style="height: \d+px;">\s*<p/,
                            '<h3>File not found</h3>|<span>Get the advantages of premium-account',
                            'optional--|You can download files up to',
                            true);
                        return;
                    }

                    if (link.href.contains('alfafile.net')) {
                        geturl(
                            link,
                            /id="slow_download_btn"/,
                            '<h3>File not found</h3>|<span>Get the advantages of premium-account',
                            'optional--',
                            true);
                        return;
                    }

                    displayTheCheckedLink(link, 'unknown_link');
                },
                onerror: function ()
                {
                    displayTheCheckedLink(link, 'unknown_link');
                }
            });
    }

    function specArchCheck(link) {
        var alive = /<title>Index of/;
        var dead = /<h1>Item not available<\/h1>/;
        var unava = /optional--/;
        geturl(link, alive, dead, unava);
    }

    //Specific handler for demo.ovh.com/download/ direct link
    function specificOvhCheck(link) {
        GM_xmlhttpRequest(
            {
                method: 'HEAD',
                url: link.href,
                headers: {
                    'User-agent': rUA(),
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Charset': 'windows-1250,utf-8;q=0.7,*;q=0.7',
                    'Referer': ""
                },
                onload: function (result)
                {
                    var resHeaders = "";
                    resHeaders = result.responseHeaders;
                    if (resHeaders.contains('Content-Type: application/octet-stream'))
                    {
                        displayTheCheckedLink(link, 'alive_link');
                        return;
                    }

                    if (resHeaders.contains('Content-Type: text/html'))
                    {
                        var liveRegex = 'download.gif"';
                        var deadRegex = 'p_point">';
                        var unavRegex = 'optional--';
                        geturl(link, liveRegex, deadRegex, unavRegex);
                        return;
                    }

                },
                onerror: function ()
                {
                    displayTheCheckedLink(link, 'unava_link');
                }
            });
    }

    //Delinkfifies the <a> element object
    function delinkifyLink(link)
    {
        var spanElm = document.createElement("span");
        spanElm.className = link.className;
        spanElm.innerHTML = link.innerHTML;

        if (Display_tooltip_info)
        {
            spanElm.href = link.href;
            $(spanElm).attr('warlc_error', $(link).attr('warlc_error'));

            switch (link.className){
                case "alive_link": spanElm.addEventListener("mouseover", displayTooltipInfo, false); break
                case "adead_link": spanElm.addEventListener("mouseover", displayTooltipError, false); break;
                case "unava_link": //reserved
                default:
            }
        }

        link.parentNode.replaceChild(spanElm, link);
    }

    //Assigns result status to the <a> element object and calls delinkifying eventually
    //Possible result states: adead_link, alive_link, unava_link
    function displayTheCheckedLink(link, resultStatus)
    {
        link.className = resultStatus;
        var hostname = gimmeHostName2(link.href);
        link.href = ANONYMIZE_SERVICE + link.href;

        if (Display_tooltip_info)
        {
            switch (resultStatus){
                case "alive_link": link.addEventListener("mouseover", displayTooltipInfo, false); break;
                case "adead_link": link.addEventListener("mouseover", displayTooltipError, false); break;
                case "obsolete_link": link.addEventListener("mouseover", displayTooltipError, false); break;
                case "unava_link": //reserved
                default:
            }
        }

        if (doNotLinkify)
        {
            delinkifyLink(link);
        }

        cLinksProcessed++;

        if (resultStatus == "alive_link")
        {
            cLinksAlive++;
            updateHosts('live', hostname);
            return;
        }

        if (resultStatus == "adead_link")
        {
            cLinksDead++;
            updateHosts('dead', hostname);
            deadLinkValues.push(JSON.stringify(link.href));
            // console.log(link.href);
            return;
        }

        if (resultStatus == "obsolete_link")
        {
            cLinksDead++;
            updateHosts('dead', hostname);
            deadLinkValues.push(JSON.stringify(link.href));
            // console.log(link.href);
            return;
        }

        if (resultStatus == "unava_link")
        {
            updateHosts('unava', hostname);
            cLinksUnava++;
        }

        if (resultStatus == "unknown_link")
        {
            updateHosts('unknown', hostname);
            cLinksUnknown++;
        }

    }

    function DisplayTheCheckedLinks(links, resultStatus, tooltipInfo)
    {
        //(a[href*=link_1], a[href*=link_2], ..., a[href*=link_n])
        var $links = $('a[href*="' + links.join('"], a[href*="') + '"]');

        if (Do_not_linkify_DL_links)
        {    //TODO into separate jQuery function
            $links.replaceWith(function(){
                return '<span href="' + this.href + '">' + $(this).text() + '</span>';
            });

            $links = $('span[href*="' + links.join('"], span[href*="') + '"]');
        }
        $links.removeClass().addClass(resultStatus);
        if (tooltipInfo && resultStatus == 'unknown_link' && Display_tooltip_info) {
            $links.mouseover(displayTooltipError);
            $links.attr('warlc_error', 'Cause of error: <b>' + tooltipInfo + '</b>');
        }
        var hostname = gimmeHostName2($links[0].href);
        $links.each(function() {
            if (!this.href.contains('mega.co.nz|mega.nz')) this.href = ANONYMIZE_SERVICE + $(this).attr("href");
        });

        switch(resultStatus)
        {
            case "alive_link":        cLinksAlive += $links.length;
                if (Display_tooltip_info) $links.mouseover(displayTooltipInfo);
                updateHosts('live', hostname);
                break;
            case "adead_link":         cLinksDead += $links.length;
                if (Display_tooltip_info) $links.mouseover(displayTooltipError);
                updateHosts('dead', hostname);

                if(typeof $links !== 'undefined')
                {
                    $links.each(function(){
                    //debugger;
                    deadLinkValues.push(JSON.stringify(this.href));
                    });
                }
                break;
            case "obsolete_link":    cLinksDead += $links.length;
                if (Display_tooltip_info) $links.mouseover(displayTooltipError);
                updateHosts('dead', hostname);
                $links.each(function(){
                    deadLinkValues.push(JSON.stringify(this.href));
                });

                break;
            case "unava_link":      cLinksUnava += $links.length;
                updateHosts('unava', hostname);
                break;
            case "unknown_link":    cLinksUnknown += $links.length;
                updateHosts('unknown', hostname);
                break;
            default:
        }

        cLinksProcessed += $links.length;
    }

    function initRedirectors()
    {
        var aRCount = 1;
        function addRedirector(hostName, linkRegex, redirType, innerLinkRegex)
        {
            hostName = hostName.split("|");
            var i = hostName.length;

            var hostID = "RH" + aRCount;

            while(i--) {
                var filehost = hostName[i].replace(/\./g, "_dot_").replace(/\-/g, "_dash_");
                if (!hostsIDs[filehost]) {
                    hostsIDs[filehost] = [];
                }
                hostsIDs[filehost].push({
                    hostID: hostID,
                    linkRegex: linkRegex,
                });
            }
            var RHObj = {
                cProcessed: 0,
                cTotal: 0,
                type: redirType,
                innerLinkRegex: innerLinkRegex,
                links: []
            }

            hostsCheck[hostID] = RHObj;
            aRCount++;
        }

        if (hostSet("Check_safelinking_dot_net_direct_links", false))
        {
            addRedirector(
                'safelinking.net|safelinking.com',
                'safelinking\\.(?:net|com)\/d\/[a-zA-Z0-9-_]+',
                redirectorTypes.HTTP_302,
                null);
        }
        // if (hostSet("Check_kprotector_dot_com_links", false))
        // {
        //     addRedirector(
        //         'kprotector.com',
        //         'kprotector\\.com\/p\\d{1,3}\/\\w{10}',
        //         redirectorTypes.HTTP_302,
        //         null);
        // }

    }

    function initBulkHosts()
    {
        var aHCount = 1;
        function addHost(hostName, linkRegex, blockSize, corrMatch, corrReplWhat, corrReplWith, splitSeparator,
                          apiUrl, postData, resLinkRegex, resLiveRegex, resDeadRegex, resUnavaRegex, func)
        {

            hostName = hostName.split("|");
            var i = hostName.length;

            var hostID = "BC" + aHCount;

            while(i--) {

                var filehost = hostName[i].replace(/\./g, "_dot_").replace(/\-/g, "_dash_");
                if (!hostsIDs[filehost]) {
                    hostsIDs[filehost] = [];
                }
                hostsIDs[filehost].push({
                    hostID: hostID,
                    linkRegex: linkRegex,
                });
            }

            // debugger;

            var BCObj = {
                blockSize: 50,
                corrMatch: corrMatch,
                corrReplWhat: corrReplWhat,
                corrReplWith: corrReplWith,
                splitSeparator: '\r\n',
                apiUrl: apiUrl,
                postData: postData,
                resLinkRegex: resLinkRegex,
                resLiveRegex: resLiveRegex,
                resDeadRegex: resDeadRegex,
                resUnavaRegex: resUnavaRegex,
                func: genBulkCheck,
                links: []
            }

            if (blockSize != null) {
                BCObj.blockSize = blockSize;
            }
            if (splitSeparator != null) {
                BCObj.splitSeparator = splitSeparator;
            }
            if (func != null) {
                BCObj.func = func;
            }

            hostsCheck[hostID] = BCObj;
            aHCount++;

        }

        var genType1 = [{    host: "rarefile.net",            apiurl: "default"                                       },
                        {    host: "filesabc.com",            apiurl: "http://filesabc.com/checkfiles.html"           },
                        {    host: "uploadbaz.com",           apiurl: "default"                                       },
                        {    host: "filemaze.ws",             apiurl: "default"                                       },
                     // {    host: "novafile.com",            apiurl: "http://novafile.com/checkfiles.html"           },
                        {    host: "youwatch.org",            apiurl: "http://youwatch.org/checkfiles.html"           },
                        {    host: "allmyvideos.net",         apiurl: "http://allmyvideos.net/checkfiles.html"        },
                        {    host: "filesline.com",           apiurl: "default"                                       },
                        {    host: "file4safe.com",           apiurl: "http://www.file4safe.com/?op=checkfiles"       },
                        {    host: "loadpot.net",             apiurl: "http://www.loadpot.net/checkfiles.html"        },
                        {    host: "uploadzeal.com",          apiurl: "http://www.uploadzeal.com/checkfiles.html"     },
                        {    host: "vidspot.net",             apiurl: "http://vidspot.net/?op=checkfiles"             },

                       ];


        var genType2 = [{    host: "dailyuploads.net",        apiurl: "https://dailyuploads.net/?op=checkfiles"       },
                        {    host: "mightyupload.com",        apiurl: "https://mightyupload.com/?op=check_files"      },
                        {    host: "megafiles.se",            apiurl: "http://megafiles.se/?op=checkfiles"            },
                        {    host: "daj.to",                  apiurl: "http://daj.to/?op=checkfiles"                  },
                        {    host: "vidup.me",                apiurl: "http://vidup.me/?op=checkfiles"                },
                        {    host: "amonshare.com",           apiurl: "http://amonshare.com/?op=checkfiles"           },
                        {    host: "medoupload.com",          apiurl: "http://medoupload.com/?op=checkfiles"          },
                        {    host: "file-speed.com",          apiurl: "http://file-speed.com/?op=checkfiles"          },
                        {    host: "secureupload.eu",         apiurl: "http://www.secureupload.eu/checklinks.html"    },
                        {    host: "rockdizfile.com",         apiurl: "http://rockdizfile.com/?op=checkfiles"         },
                        {    host: "ortofiles.com",           apiurl: "http://www.ortofiles.com/?op=checkfiles"       },
                        {    host: "expressleech.com",        apiurl: "http://expressleech.com/?op=checkfiles"        },
                        {    host: "upshared.com",            apiurl: "http://upshared.com/?op=checkfiles"            },
                        {    host: "exclusivefaile.com",      apiurl: "http://exclusiveloader.com/?op=checkfiles"     },
                        {    host: "exclusiveloader.com",     apiurl: "http://exclusiveloader.com/?op=checkfiles"     }, //same host as exclusivefaile.com
                        {    host: "rapidfileshare.net",      apiurl: "http://www.rapidfileshare.net/?op=checkfiles"  },
                        {    host: "sendmyway.com",           apiurl: "http://www.sendmyway.com/?op=checkfiles"       },
                        {    host: "unlimitshare.com",        apiurl: "http://www.unlimitshare.com/?op=checkfiles"    },
                        {    host: "speedshare.eu",           apiurl: "http://speedshare.eu/?op=checkfiles"           },
                        {    host: "uploadboy.com",           apiurl: "https://uploadboy.com/?op=checkfiles"          },
                        {    host: "uploadboy.me",            apiurl: "https://uploadboy.com/?op=checkfiles"          },
                        {    host: "spicyfile.com",           apiurl: "http://spicyfile.com/checkfiles.html"          },
                        {    host: "hugefiles.cc",            apiurl: "http://www.hugefiles.cc/?op=checkfiles"        },
                        {    host: "backin.net",              apiurl: "http://backin.net/?op=checkfiles"              },
                        {    host: "todayfile.com",           apiurl: "http://todayfile.com/?op=checkfiles"           },
                        {    host: "koofile.com",             apiurl: "http://koofile.com/op/checkfiles"              },
                        {    host: "limevideo.net",           apiurl: "http://limevideo.net/?op=checkfiles"           },
                        {    host: "lunaticfiles.com",        apiurl: "http://lunaticfiles.com/?op=checkfiles"        },
                        {    host: "vozupload.com",           apiurl: "http://vozupload.com/?op=checkfiles"           },
                        {    host: "wupfile.com",             apiurl: "http://wupfile.com/?op=check_files"           },
                        {    host: "anafile.com",             apiurl: "http://www.anafile.com/?op=checkfiles"         },
                        {    host: "rosharing.com",           apiurl: "http://rosharing.com/?op=checkfiles"           },
                        {    host: "storagely.com",           apiurl: "http://storagely.com/?op=checkfiles"           },
                        {    host: "wipfiles.net",            apiurl: "http://wipfiles.net/?op=checkfiles"            },
                        {    host: "filedais.com",            apiurl: "http://www.filedais.com/?op=checkfiles"        },
                        {    host: "vshare.eu",               apiurl: "http://vshare.eu/?op=checkfiles"               },
                        {    host: "spaceforfiles.com",       apiurl: "http://www.filespace.com/?op=checkfiles"       },
                        {    host: "filespace.com",           apiurl: "http://www.filespace.com/?op=checkfiles"       }, //same host as spaceforfiles
                        {    host: "up09.com",                apiurl: "http://file.up09.com/?op=checkfiles"           },
                        {    host: "lomafile.com",            apiurl: "http://lomafile.com/?op=checkfiles"            },
                        {    host: "sharemods.com",           apiurl: "http://sharemods.com/?op=checkfiles"           },
                        {    host: "worldbytez.com",          apiurl: "http://worldbytez.com/?op=checkfiles"          },
                        {    host: "vipshare.me",             apiurl: "http://vipshare.me/?op=checkfiles"             },
                        {    host: "loudupload.com",          apiurl: "http://loudupload.net/?op=checkfiles"          },
                        {    host: "loudupload.net",          apiurl: "http://loudupload.net/?op=checkfiles"          },
                        {    host: "uploadkadeh.ir",          apiurl: "http://uploadkadeh.ir/?op=checkfiles"          },
                        {    host: "gboxes.com",              apiurl: "http://www.gboxes.com/?op=checkfiles"          },
                        {    host: "chayfile.com",            apiurl: "http://www.chayfile.com/checkfiles"            },
                        {    host: "filetut.com",             apiurl: "http://filetut.com/?op=checkfiles"             },
                        {    host: "iranupload.com",          apiurl: "http://iranupload.com/?op=checkfiles"          },
                        {    host: "tikfile.com",             apiurl: "http://tikfile.com/?op=checkfiles"             },
                        {    host: "uplod.ir",                apiurl: "http://uplod.ir/?op=checkfiles"                },
                        {    host: "upload.ac",               apiurl: "https://upload.ac/?op=checkfiles"              },
                        {    host: "uplod.io",                apiurl: "https://upload.ac/?op=checkfiles"              }, //same host as uplodac
                        {    host: "ozofiles.com",            apiurl: "http://ozofiles.com/?op=checkfiles"			  },
                     // {    host: "indishare.org",           apiurl: "https://www.indishare.org/?op=check_files"     },
                     // {    host: "indishare.me",            apiurl: "https://www.indishare.org/?op=check_files"     },
                        {    host: "dl.bdupload.asia",        apiurl: 'http://bdupload.asia/?op=checkfiles'           },
                        {    host: 'faststore.org',           apiurl: 'http://faststore.org/?op=checkfiles'           },
                        {    host: 'bankupload.com',          apiurl: 'http://bankupload.com/?op=checkfiles'          },
                        {    host: "longfiles.com",           apiurl: 'http://longfiles.com/?op=checkfiles'           },
                        {    host: "katfile.com",             apiurl: 'https://katfile.com/?op=checkfiles'            },
                        {    host: "sendit.cloud",            apiurl: 'https://sendit.cloud/checkfiles.html'          },
                        {    host: "takefile.link",           apiurl: 'https://takefile.link/?op=checkfiles'          },
                        {    host: "xubster.com",             apiurl: 'https://xubster.com/?op=checkfiles'            }

                       ];

                    var genType3 = [
                        {    host: 'rockfile.co',             apiurl: 'http://rockfile.co/checklinks'               },
                        {    host: 'duckload.in',             apiurl: 'http://duckload.in/?op=check_files'          },
                        {    host: 'uploadcloud.pro',         apiurl: 'https://www.uploadcloud.pro/?op=check_files' },
                        {    host: 'daofile.com',             apiurl: 'https://daofile.com/?op=check_files'         },
                        {    host: 'nelion.me',               apiurl: 'https://nelion.me/?op=check_files'           },
                        {    host: 'up-load.io',              apiurl: 'https://up-load.io/?op=check_files'          },
                        {    host: 'upload-4ever.com',        apiurl: 'https://www.upload-4ever.com/?op=check_files'},
                        {    host: 'file-upload.com',         apiurl: 'https://www.file-upload.com/?op=check_files' },
                        {    host: "usersdrive.com",          apiurl: "https://usersdrive.com/?op=check_files"      },
                        {    host: "myfiles.onl",             apiurl: "https://myfiles.onl/?op=check_files"         },
                        {    host: "fileupload.pw",           apiurl: "https://fileupload.pw/?op=check_files"       },
                        {    host: "mega4upload.com",         apiurl: "https://mega4upload.com/?op=check_files"     },
                        {    host: "mega4up.org",             apiurl: "https://mega4upload.com/?op=check_files"     },
                        {    host: "file.al",                 apiurl: "https://file.al/?op=check_files"             },
                        // {    host: "1dl.net",                 apiurl: 'https://1dl.net/?op=check_files'             },
                        {    host:"gulf-up.com",              apiurl:'https://www.gulf-up.com/?op=check_files'      },
                        {    host: "hot4share.com",           apiurl: 'https://hot4share.com/?op=check_files'       },
                        {    host: "send.cm",                 apiurl: 'default'                                     },
                        {    host: "europeup.com",            apiurl: 'https://www.europeup.com/?op=check_files'    },
                        {    host: "desiupload.co",           apiurl: 'https://desiupload.co/?op=check_files'       },
                        {    host: "desiupload.to",           apiurl: 'https://desiupload.co/?op=check_files'       },
                        {    host: "down.fast-down.com",      apiurl: 'https://down.fast-down.com/?op=check_files'  },
                        {    host: "hxfile.co",               apiurl: 'default'                                     },
                        {    host: "uploadbank.com",          apiurl: 'https://www.uploadbank.com/?op=check_files'  },
                        {    host: "rapidcloud.cc",           apiurl: 'https://rapidcloud.cc/?op=check_files'       },
                        {    host: "filerice.com",            apiurl: 'https://filerice.com/?op=check_files'        },
                        {    host: "uploady.io",              apiurl: 'https://uploady.io/?op=check_files'          },
                        {    host: "userupload.net",              apiurl: 'https://userupload.net/?op=check_files'          },



                    ];

        //xfilesharing 1.0
        function addGenericType1()
        {
            var i = genType1.length;

            while(i--)
            {
                var host = genType1[i].host;
                var apiUrl = genType1[i].apiurl;

                if (apiUrl == "default") apiUrl = "http://www." + host + "/?op=check_files";

                if (hostSet("Check_" + host.replace(/\./g, "_dot_").replace(/-/g, "_dash_") + "_links", false))
                {
                    var regexSafe = host.replace(/\./g, "\\.").replace(/-/g, "\\-");

                    addHost(
                        host, //hostname
                        regexSafe + "\/\\w+", //linkregex
                        null, //blocksize i.e. no of links
                        new RegExp("(https?:\/\/(?:|www\\.)" + regexSafe + "\/\\w+)",""), //corrmatch
                        null, //corrreplwhat
                        null, //corrreplwith
                        null, //separator
                        apiUrl, //api url
                        "op=check_files&process=Check+URLs&list=", //postdata
                        new RegExp("(" + regexSafe + "\/\\w+)",""), //linkregex
                        new RegExp("<font color='green'>https?:\/\/(?:|www\.)" + regexSafe + "\/\\w+","g"), //liveregex
                        new RegExp("<font color='red'>https?:\/\/(?:|www\.)" + regexSafe + "\/\\w+","g"), //deadregex
                        new RegExp("<font color='orange'>https?:\/\/(?:|www\.)" + regexSafe + "\/\\w+","g"), //unavaregex
                        null //function delegate
                    )
                }
            }
        }

        //xfilesharing 2.0
        function addGenericType2()
        {
            var i = genType2.length;

            while(i--)
            {
                if (apiUrl == "default") apiUrl = "https://" + host + "/?op=check_files";
                var host = genType2[i].host;
                var apiUrl = genType2[i].apiurl;


                if (hostSet("Check_" + host.replace(/\./g, "_dot_").replace(/-/g, "_dash_") + "_links", false))
                {
                    var regexSafe = host.replace(/\./g, "\\.").replace(/-/g, "\\-");

                    addHost(
                        host, //hostname
                        "https?:\/\/(www\\.|file\\.|1dl\\.|down\\.)?" + regexSafe + "\/\\w+", //linkregex
                        null, //blocksize
                        new RegExp("(https?:\/\/(www\\.|down\\.|1dl\\.|file\\.)?" + regexSafe + "\/\\w+)",""), //corrmatch
                        null, //corrreplwhat
                        null, //corrreplwith
                        null, //separator
                        apiUrl, //api url
                        "op=checkfiles&process=Check+URLs&list=", //postdata
                        new RegExp("(" + regexSafe + "\/\\w+)",""), //linkregex
                        new RegExp(regexSafe + "\/\\w+.*?\\s*<\/td>\\s*<td style=\\s*\"color:(?:green|#00f100);","g"), //liveregex
                        new RegExp(regexSafe + "\/\\w+.*?\\s*<\/td>\\s*<td style=\\s*\"color:(?:red|#f10000);","g"), //deadregex
                        new RegExp(regexSafe + "\/\\w+.*?\\s*<\/td>\\s*<td style=\\s*\"color:orange;","g"), //unavaregex
                        null //function delegate
                    )
                }
            }
        }

        function addGenericType3()
        {
            var i = genType3.length;

            while(i--)
            {
                var host = genType3[i].host;
                var apiUrl = genType3[i].apiurl;

                //if (host=="down.fast-down.com") debugger;

                if (apiUrl == "default") apiUrl = "https://" + host + "/?op=check_files";

                if (hostSet("Check_" + host.replace(/\./g, "_dot_").replace(/-/g, "_dash_") + "_links", false))
                {
                    var regexSafe = host.replace(/\./g, "\\.").replace(/-/g, "\\-");
                    addHost(
                        host, //hostname
                        "https?:\/\/(www\\.|file\\.|dl1\\.)?" + regexSafe + "(?:\/d\/|\/)\\w+", //linkregex
                        null, //blocksize
                        new RegExp("(https?:\/\/(www\\.|dl1\\.|file\\.)?" + regexSafe + "(?:\/d\/|\/)\\w+)",""), //corrmatch
                        null, //corrreplwhat
                        null, //corrreplwith
                        null, //separator
                        apiUrl, //api url
                        "op=check_files&process=Check+URLs&list=", //postdata
                        new RegExp("(" + regexSafe + "(?:\/d\/|\/)\\w+)",""), //linkregex
                        new RegExp(regexSafe + "(?:\/d\/|\/)\\w+.*?\\s*<\/td>\\s*<td style=\\s*\"color:(?:green|#00f100);","g"), //liveregex
                        new RegExp(regexSafe + "(?:\/d\/|\/)\\w+.*?\\s*<\/td>\\s*<td style=\\s*\"color:(?:red|#f10000);","g"), //deadregex
                        new RegExp(regexSafe + "(?:\/d\/|\/)\\w+.*?\\s*<\/td>\\s*<td style=\\s*\"color:orange;","g"), //unavaregex
                        null //function delegate
                    )
                }
            }
        }


        // TEMPLATE
        // if (hostSet("Check__dot_com_links", false))
        // {
        // addHost(
        // "", //hostname
        // "", //linkregex
        // null, //blocksize
        // null, //corrmatch
        // null, //corrreplwhat
        // null, //corrreplwith
        // null, //separator
        // "", //api url
        // "", //postdata
        // /()/, //linkregex
        // //liveregex
        // //deadregex
        // //unavaregex
        // null //function delegate
        // )
        // }


        addGenericType1();
        addGenericType2();
        addGenericType3();

        if (hostSet("Check_myvdrive_dot_com_links", false))
        {
            addHost(
                "myvdrive.com|fileserving.com", //hostname
                "(?:fileserving|myvdrive)\\.com\/files\/[\\w-]+", //linkregex
                null, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                "http://www.myvdrive.com/Public/linkchecker", //api url
                "links=", //postdata
                /(?:fileserving|myvdrive)\.com\/(files\/[\w-]+)/, //linkregex
                /icon_file_check_valid"><\/span>\s*http:\/\/(?:www\.)?(?:fileserving|myvdrive)\.com\/files\/[\w-]+/g, //liveregex
                /icon_file_check_(?:removed|notvalid)"><\/span>\s*http:\/\/(?:www\.)?(?:fileserving|myvdrive)\.com\/files\/[\w-]+/g, //deadregex
                null, //unavaregex
                null //function delegate
            )
        }

        if (hostSet("Check_drop_dot_download_links", false))
        {
            addHost(
                "drop.download", //hostname
                "(?:drop)\\.download\/[\\w-]+", //linkregex
                null, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                "https://drop.download/check_files/", //api url
                "op=check_files&process=Check+URLs&list=", //postdata
                /(drop\.download\/\w+)/, //linkregex
                /drop\.download\/\w+.*?<\/td>\s*<td class="py-2 pr-2">\s*<span style="background-color:green;/g, //liveregex
                /drop\.download\/\w+.*?<\/td>\s*<td class="py-2 pr-2">\s*<span style="background-color:red;/g, //deadregex
                /drop\.download\/\w+.*?<\/td>\s*<td class="py-2 pr-2">\s*<span style="background-color:orange;/g, //unavaregex
                null //function delegate
            )
        }

        if (hostSet("Check_down_mdiaload_dot_com_links", false))
        {
            addHost(
                "mdiaload.com", //hostname
                "(down\\.|)mdiaload\\.com\/\\w+", //linkregex
                null, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                "https://down.mdiaload.com/?op=check_files", //api url
                "op=check_files&process=Check+URLs&list=", //postdata
                /(down\.mdiaload\.com\/\w+)/, //linkregex
                /down\.mdiaload\.com\/\w+.*?<\/td>\s*<td style="color:green;/g, //liveregex
                /down\.mdiaload\.com\/\w+.*?<\/td>\s*<td style="color:red;">Not found!<\/td>/g, //deadregex
                /down\.mdiaload\.com\/\w+.*?<\/td>\s*<td style="color:orange;/g, //unavaregex
                null //function delegate
            )
        }

        if (hostSet("Check_fastclick_dot_to_links", false))
        {
            addHost(
                "fastclick.to", //hostname
                "fastclick\\.to\/\\w+", //linkregex
                null, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                "https://drop.download/check_files/", //api url
                "op=check_files&process=Check+URLs&list=", //postdata
                /(fastclick\.to\/\w+)/, //linkregex
                /fastclick\.to\/\w+.*?<\/td>\s*<td class="py-2 pr-2">\s*<span style="background-color:green;/g, //liveregex
                /fastclick\.to\/\w+.*?<\/td>\s*<td class="py-2 pr-2">\s*<span style="background-color:red;/g, //deadregex
                /fastclick\.to\/\w+.*?<\/td>\s*<td class="py-2 pr-2">\s*<span style="background-color:orange;/g, //unavaregex
                null //function delegate
            )
        }

        /*if (hostSet("Check_edisk_dot_cz_links", false))
        {
            addHost(
                "edisk.cz|edisk.sk|edisk.eu", //hostname
                "(?:(?:muj|data)\\d*\\.|)edisk\\.(?:cz|sk|eu)\/(?:|(?:cz|sk|en|pl)\/)", //linkregex
                null, //blocksize
                null, //corrmatch
                /edisk\.\w{2}\/(?:|\w{2}\/)stahni/, //corrreplwhat
                'edisk.cz/stahni', //corrreplwith
                null, //separator
                'http://www.edisk.cz/zkontrolovat-odkazy',
                'submitBtn=Zkontrolovat&checkFiles=',
                /((?:download|stahn(?:i|out-soubor))\/\d+)/,
                /"ano"\/>\s*<\/td>\s*<td>\s*http:\/\/.+/g,
                /"ne"\/>\s*<\/td>\s*<td>\s*http:\/\/.+/g,
                null,
                null //function delegate
            )
        }*/

        if (hostSet("Check_bezvadata_dot_cz_links", false))
        {
            addHost(
                "bezvadata.cz", //hostname
                "(?:beta\\.|)bezvadata\.cz\/stahnout\/\\d+\\w+", //linkregex
                null, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                'http://bezvadata.cz/nastroje/kontrola-odkazu?do=kontrolaOdkazuForm-submit',
                'zkontrolovat=Zkontrolovat&odkazy=',
                /(bezvadata\.cz\/stahnout\/\d+)/,
                /bezvadata\.cz\/stahnout\/.+?<\/td>\s*<td style="background-color: #d9ffb2/g,
                /bezvadata\.cz\/stahnout\/.+?<\/td>\s*<td style="background-color: #ffb2b2/g,
                null,
                null //function delegate
            )
        }

        if (hostSet("Check_depositfiles_dot_com_links", false))
        {
            addHost(
                "depositfiles.com|dfiles.eu|dfiles.ru|depositfiles.org|depositfiles.lt", //hostname
                "(?:depositfiles\\.(?:com|lt|org)|dfiles\\.(?:eu|ru))\/(?:en\/|ru\/|de\/|es\/|pt\/|)files\/\\w+", //linkregex
                100000, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                null,
                null,
                null,
                null,
                null,
                null,
                depositfilesBulkCheck //function delegate
            )
        }

        if (hostSet("Check_safelinking_dot_net_links", false))
        {
            addHost(
                "safelinking.net|safelinking.com", //hostname
                "safelinking\\.(?:net|com)\/(?!d\/)(?:p\/|)\\w+", //linkregex
                100000, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                null,
                null,
                null,
                null,
                null,
                null,
                safeLinkingBulkCheck //function delegate
            )
        }

        if (hostSet("Check_turbobit_dot_net_links", false))
        {
            addHost(
                "turbobit.net|turbobit.pl|turb.pw|turb.to|turb.cc|turboget.net|trbbt.net", //hostname
                "(?:(?:trbbt.net|(turbobit\\.(?:net|pl)))|(?:turb\\.(?:pw|(?:cc|to))|turboget\\.net))\/\\w+", //linkregex
                100000, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                null,
                null,
                null,
                null,
                null,
                null,
                turbobitBulkCheck //function delegate
            )
        }

        if (hostSet("Check_nitroflare_dot_com_links", false))
        {
            //debugger;
            addHost(
                "nitroflare.com|nitroflare.net|nitro.download", //hostname
                "(?:nitroflare\\.(?:com|net)|nitro\\.download)\/view\/\\w+", //linkregex
                100000, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                null,
                null,
                null,
                null,
                null,
                null,
                NitroFlareBulkCheck //function delegate
            )
        }

        if (hostSet("Check_videobb_dot_com_links", false))
        {
            addHost(
                "videobb.com", //hostname
                "videobb\\.com\/(?:video\/|watch_video\\.php\\?v=)\\w+", //linkregex
                null, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                'http://www.videobb.com/link_checker.php',
                'links=',
                /(videobb\.com\/(?:watch_video\.php\?v?=|video\/)\w+)/,
                /<td>http:\/\/(?:www\.|)videobb.com\/(?:watch_video\.php\?v?=|video\/)\w+<\/td>\s+<td>.+?<\/td>\s+<td>\d+:\d+<\/td>\s+<td>Available/g,
                /<td>http:\/\/(?:www\.|)videobb.com\/(?:watch_video\.php\?v?=|video\/)\w+<\/td>\s+<td>(?:|.+?)<\/td>\s+<td>N\/A<\/td>\s+<td>Not Available/g,
                null,
                null //function delegate
            )
        }

        if (hostSet("Check_filefactory_dot_com_links", false) && genset("Filefactory_API_Check", false))
        {
            addHost(
                "filefactory.com", //hostname
                "filefactory\\.com\/+file\/[a-z0-9]", //linkregex
                50000, //blocksize
                null, //corrmatch
                /(?:www\.|)filefactory\.com\/+file/, //corrreplwhat
                'www.filefactory.com/file', //corrreplwith
                "\n", //separator
                "https://www.filefactory.com/account/tools/link-checker.php", //api url
                "Submit=Check+Links&links=", //postdata
                /filefactory\.com\/(file\/\w+(?:|\/)(?:|\w+))/, //linkregex
                />http:\/\/(?:www\.)?filefactory\.com\/file\/\w+(?:|\/)(?:|\w+)<\/a>/g, //liveregex
                /<span class="hidden-xs">http(?:s|):\/\/(?:www\.)?filefactory\.com\/file\/\w+(?:|\/)(?:|\w+)<\/span>/g, //deadregex
                /<i class="icon-wrench.+\n.+\n.+http:\/\/(?:www\.)?filefactory\.com\/file\/\w+/g, //unavaregex
                null //function delegate
            );
        }

        if (hostSet("Check_rapidgator_dot_net_links", false) && genset("Rapidgator_API_Check", false))
        {
            addHost(
                "rapidgator.net", //hostname
                "(?:rapidgator\\.net|rg.to)\/file\/\\w+", //linkregex
                5000, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                null, //api url
                null, //postdata
                null, //linkregex
                null, //liveregex
                null, //deadregex
                null, //unavaregex
                RapidgatorBulkCheck //function delegate
            );
        }

        // if (hostSet("Check_mega4upload_dot_com_links", false))
        // {
        //     addHost(
        //         "mega4upload.com|mega4up.org", //hostname
        //         "(?:mega4upload\\.com|mega4up\\.org)\/\\w+", //linkregex
        //         null, //blocksize
        //         null, //corrmatch
        //         null, //corrreplwhat
        //         null, //corrreplwith
        //         null, //separator
        //         'https://mega4upload.com/?op=check_files',
        //         "op=check_files&process=Check+URLs&list=",
        //         /(mega4upload\.com|mega4up\.org\/\w+)/,
        //         /mega4upload\.com|mega4up\.org\/\w+.*?<\/td>\s*<td style="color:green;">/g, //liveregex
        //         /mega4upload\.com|mega4up\.org\/\w+.*?<\/td>\s*<td style="color:red;">/g, //deadregex
        //         /mega4upload\.com|mega4up\.org\/\w+.*?<\/td>\s*<td style="color:orange;">/g, //unavaregex
        //         null //function delegate
        //     )
        // }

        // if (hostSet("Check_upload4ever_dot_com_links", false))
        // {
        //     addHost(
        //         "upload-4ever.com", //hostname
        //         "upload-4ever\\.com\/\\w+", //linkregex
        //         null, //blocksize
        //         null, //corrmatch
        //         null, //corrreplwhat
        //         null, //corrreplwith
        //         null, //separator
        //         "https://www.upload-4ever.com/?op=check_files",
        //         "op=check_files&process=Check+URLs&list=",
        //         /(upload-4ever\.com\/\w+)/,
        //         /upload-4ever\.com\/\w+.*?<\/td>\s*<td style="color:green;">/g, //liveregex
        //         /upload-4ever\.com\/\w+.*?<\/td>\s*<td style="color:red;">/g, //deadregex
        //         /upload-4ever\.com\/\w+.*?<\/td>\s*<td style="color:orange;">/g, //unavaregex
        //         null //function delegate
        //     )
        // }

        if (hostSet("Check_intoupload_dot_net_links", false))
        {
            addHost(
                "intoupload.net|intoupload.com", //hostname
                "intoupload\\.(?:net|com)\/\\w+", //linkregex
                null, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                'https://intoupload.net/?op=check_files',
                "op=check_files&process=Check+URLs&list=",
                /(intoupload\.(?:net|com)\/\w+)/,
                /intoupload\.(?:net|com)\/\w+.*?<\/td>\s*<td style="color:green;">/g, //liveregex
                /intoupload\.(?:net|com)\/\w+.*?<\/td>\s*<td style="color:red;">/g, //deadregex
                /intoupload\.(?:net|com)\/\w+.*?<\/td>\s*<td style="color:orange;">/g, //unavaregex
                null //function delegate
            )
        }
        if (hostSet("Check_letsupload_dot_co_links", false))
        {
            addHost(
                "letsupload.co", //hostname
                "letsupload\\.co\/\\w+", //linkregex
                null, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                'https://letsupload.co/link_checker.html',
                "submitme=1&submit=submit&file_urls=",
                /(letsupload\.co\/\w+)/,
                /letsupload\.co\/\w+.*?<\/td>\s*<td style="text-align: center; width: 120px;">\s*<span style="color: green;">/g, //liveregex
                /letsupload\.co\/\w+.*?<\/td>\s*<td style="text-align: center; width: 120px;">\s*<span style="color: (?:red|gray);">/g, //deadregex
                /letsupload\.co\/\w+.*?<\/td>\s*<td style="text-align: center; width: 120px;">\s*<span style="color: orange;">/g, //unavaregex
                null //function delegate
            )
        }

        if (hostSet("Check_oxycloud_dot_com_links", false))
        {
            addHost(
                "oxycloud.com", //hostname
                "oxycloud\\.com\/\\w+", //linkregex
                null, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                'https://oxycloud.com/link_checker.html',
                "submitme=1&submit=submit&file_urls=",
                /(oxycloud\.com\/\w+)/,
                /oxycloud\.com\/\w+.*?<\/td>\s*<td style="text-align: center; width: 120px;">\s*<span style="color: green;">/g, //liveregex
                /oxycloud\.com\/\w+.*?<\/td>\s*<td style="text-align: center; width: 120px;">\s*<span style="color: (?:red|gray);">/g, //deadregex
                /oxycloud\.com\/\w+.*?<\/td>\s*<td style="text-align: center; width: 120px;">\s*<span style="color: orange;">/g, //unavaregex
                null //function delegate
            )
        }

        if (hostSet("Check_uploadify_dot_net_links", false))
        {
            addHost(
                "uploadify.net", //hostname
                "uploadify\\.net\/\\w+", //linkregex
                null, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                'https://uploadify.net/link_checker.html',
                "submitme=1&submit=submit&file_urls=",
                /(uploadify\.net\/\w+)/,
                /uploadify\.net\/\w+.*?<\/td>\s*<td style="text-align: center; width: 120px;">\s*<span style="color: green;">/g, //liveregex
                /uploadify\.net\/\w+.*?<\/td>\s*<td style="text-align: center; width: 120px;">\s*<span style="color: (?:red|gray);">/g, //deadregex
                /uploadify\.net\/\w+.*?<\/td>\s*<td style="text-align: center; width: 120px;">\s*<span style="color: orange;">/g, //unavaregex
                null //function delegate
            )
        }

        if (hostSet("Check_9xupload_dot_xyz_links", false))
        {
            addHost(
                "9xupload.xyz|9xupload.info|9xupload.me", //hostname
                "(9xupload\\.xyz|9xupload.info|9xupload.me)\/\\w+", //linkregex
                null, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                'https://9xupload.xyz/?op=checkfiles',
                "op=checkfiles&process=Check+URLs&list=",
                /(9xupload\.(?:xyz|info|me)\/\w+)/,
                /9xupload\.(?:xyz|info|me)\/\w+.*?<\/td>\s*<td style="color:green;">/g, //liveregex
                /9xupload\.(?:xyz|info|me)\/\w+.*?<\/td>\s*<td style="color:red;">/g, //deadregex
                /9xupload\.(?:xyz|info|me)\/\w+.*?<\/td>\s*<td style="color:orange;">/g, //unavaregex
                null //function delegate
            )
        }

        //         if (hostSet("Check_usersdrive_dot_com_links", false))
        //         {
        //             addHost(
        //                 "usersdrive.com", //hostname
        //                 "usersdrive\\.com\/\\w+", //linkregex
        //                 null, //blocksize
        //                 null, //corrmatch
        //                 null, //corrreplwhat
        //                 null, //corrreplwith
        //                 null, //separator
        //                 'https://usersdrive.com/?op=check_files', //api url
        //                 "op=check_files&send=Check+URLs&list=", //postdata
        //                 /usersdrive\.com\/\w+/, //linkregex
        //                 /usersdrive\.com\/\w+.*?<\/td><td style="color:green;">/g, //liveregex
        //                 /usersdrive\.com\/\w+.*?<\/td><td style="color:red;">/g, //deadregex
        //                 /usersdrive\.com\/\w+.*?<\/td><td style="color:orange;">/g, //unavaregex
        //                 null //function delegate
        //             );
        //         }

        if (hostSet("Check_megashares_dot_com_links", false))
        {
            addHost(
                "megashares.com",
                "(?:d01\.)?megashares\.com\/(?:dl\/|(?:index\\.php)?\\?d01=)\\w+",
                null, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                "http://d01.megashares.com/checkit.php",
                "submit_links=Check+Links&check_links=",
                /megashares\.com\/(?:dl\/|(?:index\.php)?\?d01=)(\w+)/,
                /megashares\.com\/(?:dl\/|(?:index\.php)?\?d01=)\w+.*?\s*-\s*ok/g,
                /megashares\.com\/(?:dl\/|(?:index\.php)?\?d01=)\w+.*?\s*-\s*invalid/g,
                null,
                null
            )
        }

        if (hostSet("Check_mega_dot_co_dot_nz_links", false))
        {
            addHost(
                "mega.co.nz|mega.nz",
                "mega(?:\\.co)?\\.nz\/(#!|file\\/)\\w+",
                100000, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                null,
                null,
                null,
                null,
                null,
                null,
                megaBulkCheck //function delegate
            )
        }

        if (hostSet("Check_k2s_dot_cc_api_links", false))
        {
            addHost(
                "keep2share.cc|keep2share.com|k2s.cc|keep2s.cc",
                "(?:keep2share\\.(?:cc|com)|(?:k2s|keep2s)\\.cc)\/file\/\\w+",
                100000, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                null,
                null,
                null,
                null,
                null,
                null,
                k2sBulkCheck //function delegate
            )
        }

        if (hostSet("Check_tezfiles_dot_com_links", false))
        {
            addHost(
                "tezfiles.com",
                "(?:tezfiles\\.com)\/\\w+",
                100000, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                null,
                null,
                null,
                null,
                null,
                null,
                k2sBulkCheck //function delegate
            )
        }

        if (hostSet("Check_fboom_dot_me_links", false))
        {
            addHost(
                "fboom.me|fileboom.me",
                "(?:(?:fboom\\.me)|(?:fileboom\\.me))\/file\/\\w+",
                100000, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                null,
                null,
                null,
                null,
                null,
                null,
                k2sBulkCheck //function delegate
            )
        }



        if (hostSet("Check_fikper_dot_com_links", false))
        {
            addHost(
                "fikper.com",
                "(?:fikper\\.com)\/\\w+",
                100000, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                null,
                null,
                null,
                null,
                null,
                null,
                fikperBulkCheck //function delegate
            )
        }
        if (hostSet("Check_googleDrive_dot_com_links", false))
        {
            addHost(
                "google.com",
                "(?:drive\\.google\\.com)\/file\/d\/\\w+",
                100000, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                null,
                null,
                null,
                null,
                null,
                null,
                googleDriveBulkCheck //function delegate
            )
        }
        if (hostSet("Check_gofile_dot_io_links", false))
        {
            addHost(
                "gofile.io",
                "(?:gofile\\.io)\/d\/\\w+",
                100000, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                null,
                null,
                null,
                null,
                null,
                null,
                gofileBulkCheck //function delegate
            )
        }

        if (hostSet("Check_gofile_dot_io_links", false))
        {
            addHost(
                "gofile.io",
                "(?:gofile\\.io)\/d\/\\w+",
                100000, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                null,
                null,
                null,
                null,
                null,
                null,
                gofileBulkCheck //function delegate
            )
        }

        if (hostSet("Check_gofile_dot_cc_links", false))
        {
            addHost(
                "gofile.cc",
                "gofile\\.cc\/\\w+",
                100000, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                null,
                null,
                null,
                null,
                null,
                null,
                gofileccBulkCheck //function delegate
            )
        }

        if (hostSet("Check_myfile_dot_is_links", false))
        {
            addHost(
                "myfile.is|myfile.org",
                "myfile\\.(?:is|org)\/\\w+",
                100000, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                null,
                null,
                null,
                null,
                null,
                null,
                myfileisBulkCheck //function delegate
            )
        }

        if (hostSet("Check_megaupload_dot_is_links", false))
        {
            addHost(
                "megaupload.is",
                "megaupload\\.is\/\\w+",
                100000, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                null,
                null,
                null,
                null,
                null,
                null,
                megauploadisBulkCheck //function delegate
            )
        }

        if (hostSet("Check_vshare_dot_is_links", false))
        {
            addHost(
                "vshare.is",
                "vshare\\.is\/\\w+",
                100000, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                null,
                null,
                null,
                null,
                null,
                null,
                vshareisBulkCheck //function delegate
            )
        }

        if (hostSet("Check_bayfiles_dot_com_links", false))
        {
            addHost(
                "bayfiles.com|bayfiles.net",
                "bayfiles\\.(?:com|net)\/\\w+",
                100000, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                null,
                null,
                null,
                null,
                null,
                null,
                bayfilesBulkCheck //function delegate
            )
        }

        if (hostSet("Check_upload_dot_st_links", false))
        {
            addHost(
                "upload.st",
                "upload\\.st\/\\w+",
                100000, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                null,
                null,
                null,
                null,
                null,
                null,
                uploadstBulkCheck //function delegate
            )
        }

        if (hostSet("Check_internxt_dot_com_links", false))
        {
            addHost(
                "internxt.com",
                "internxt\\.com\/d\/sh\/file\/\\w+",
                100000, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                null,
                null,
                null,
                null,
                null,
                null,
                internxtBulkCheck //function delegate
            )
        }

        if (hostSet("Check_anonfile_com_st_links", false))
        {
            addHost(
                "anonfile.com|anonfiles.com",
                "anonfile(?:s|)\\.com\/\\w+",
                100000, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                null,
                null,
                null,
                null,
                null,
                null,
                anonfileBulkCheck //function delegate
            )
        }

        if (hostSet("Check_4upfiles_dot_com_links", false))
        {
            addHost(
                "4up.me|4up.im|4upfiles.com",
                "(?:4upfiles\\.com|4up\\.(?:me|im))\/\\w+",
                null, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                "http://4upfiles.com/?op=checkfiles", //api url
                "op=checkfiles&process=Check+URLs&list=", //postdata
                /(4up(?:files)?\.(?:com|me|im)\/\w+)/, //linkregex
                /4up(?:files)?\.(?:com|me|im)\/\w+.*?<\/td>\s*<td style=\"color:green;\">/g, //liveregex
                /4up(?:files)?\.(?:com|me|im)\/\w+.*?<\/td>\s*<td style=\"color:red;\">/g, //deadregex
                /4up(?:files)?\.(?:com|me|im)\/\w+.*?<\/td>\s*<td style=\"color:orange;\">/g, //unavaregex
                null //function delegate
            )
        }

        // if (hostSet("Check_uploaded_dot_to_links", false))
        // {
        //     addHost(
        //         "uploaded.to|uploaded.net|ul.to",
        //         '(?:uploaded\\.(?:to|net)|ul\\.to)\/(?:files?\/|f\/|\\?(?:lang=\\w{2}&)?id=|folder\/)?(?!img\/|coupon\/)\\w+',
        //         1000,
        //         /(?:uploaded|ul)\.(?:to|net)\/(?:files?|f|\?(?:lang=\w{2}&)?id=|f\/|folder)?\/*(?!img\/|coupon\/)(\w+)/,
        //         null,
        //         null,
        //         null,
        //         null,
        //         null,
        //         null,
        //         null,
        //         null,
        //         null,
        //         uploadedBulkCheck
        //     )
        // }

        if (hostSet("Check_junocloud_dot_me_links", false))
        {
            addHost(
                "junocloud.me",
                "junocloud\\.me\/\\w+",
                null,
                null,
                null,
                null,
                null,
                "http://junocloud.me/checkfiles.html",
                "op=checkfiles&process=Check+URLs&list=",
                /(junocloud\.me\/\w+)/,
                /junocloud\.me\/\w+.*?<span style="color: green;/g,
                /junocloud\.me\/\w+.*?<span style="color: red;/g,
                /junocloud\.me\/\w+.*?<span style="color: orange;/g,
                null //function delegate
            )
        }

        if (hostSet("Check_filesupload_dot_org_links", false))
        {
            addHost(
                "filesupload.org", //hostname
                "filesupload\\.org\/\\w+", //linkregex
                null, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                'https://filesupload.org/link_checker.html',
                "submitme=1&submit=submit&file_urls=",
                /(filesupload\.org\/\w+)/,
                /filesupload\.org\/\w+.*?<\/td>\s*<td style="text-align: center; width: 120px;">\s*<span style="color: green;">/g, //liveregex
                /filesupload\.org\/\w+.*?<\/td>\s*<td style="text-align: center; width: 120px;">\s*<span style="color: (?:red|gray);">/g, //deadregex
                /filesupload\.org\/\w+.*?<\/td>\s*<td style="text-align: center; width: 120px;">\s*<span style="color: orange;">/g, //unavaregex
                null //function delegate
            )
        }



        if (hostSet("Check_indishare_dot_org_links", false))
        {
            addHost(
                "indishare.org|indishare.me|indishare.in", //hostname
                "(?:\\w+\\.)indishare\\.(?:org|me|in)\/\\w+", //linkregex
                null, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                'https://www.indishare.org/?op=check_files',
                "op=check_files&process=Check+URLs&list=",
                /((?:\w+\.)indishare\.(?:org|me|in)\/\w+)/,
                /(?:\w+\.)indishare\.(?:org|me|in)\/\w+.*?<\/td>\s*<td style="color:green;">/g, //liveregex
                /(?:\w+\.)indishare\.(?:org|me|in)\/\w+.*?<\/td>\s*<td style="color:red;">/g, //deadregex
                /(?:\w+\.)indishare\.(?:org|me|in)\/\w+.*?<\/td>\s*<td style="color:orange;">/g, //unavaregex
                null //function delegate
            )
        }

        if (hostSet("Check_filejoker_dot_net_links", false))
        {
            addHost(
                "filejoker.net", //hostname
                "filejoker\\.net\/\\w+", //linkregex
                null, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                'https://filejoker.net/?op=checkfiles',
                "op=checkfiles&process=1&list=",
                /(filejoker\.net\/\w+)/,
                /color='green'>https:\/\/filejoker\.net\/\w+.*?\s*found/g, //liveregex
                /color='red'>https:\/\/filejoker\.net\/\w+.*?\s*not found!/g, //deadregex
                /color='orange'>https:\/\/filejoker\.net\/\w+.*?/g, //unavaregex
                null //function delegate
            )
        }

        if (hostSet("Check_novafile_dot_com_links", false))
        {
            addHost(
                "novafile.com", //hostname
                "novafile\\.com\/\\w+", //linkregex
                null, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                'https://novafile.com/checkfiles.html',
                "op=checkfiles&process=1&list=",
                /(novafile\.com\/\w+)/,
                /color='green'>https:\/\/novafile\.com\/\w+.*?\s*found/g, //liveregex
                /color='red'>https:\/\/novafile\.com\/\w+.*?\s*not found!/g, //deadregex
                /color='orange'>https:\/\/novafile\.com\/\w+.*?/g, //unavaregex
                null //function delegate
            )
        }

        if (hostSet("Check_up_dash_4ever_dot_org_links", false))
        {
            addHost(
                "up-4ever.org|upload-4ever.com|upload-4ever.net|up-4.net", //hostname
                "(?:up-4ever\\.org|upload-4ever\\.com|upload-4ever\\.net|up-4\\.net)\/\\w+", //linkregex
                null, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                'https://www.up-4ever.net/?op=check_files',
                "op=check_files&process=Check+URLs&list=",
                /((?:up-4ever\.org|upload-4ever\.com|upload-4ever\.net|up-4\.net)\/\w+)/,
                /(?:up-4ever\.org|upload-4ever\.com|upload-4ever\.net|up-4\.net)\/\w+.*?<\/td>\s*<td style="color:green;">/g, //liveregex
                /(?:up-4ever\.org|upload-4ever\.com|upload-4ever\.net|up-4\.net)\/\w+.*?<\/td>\s*<td style="color:red;">/g, //deadregex
                /(?:up-4ever\.org|upload-4ever\.com|upload-4ever\.net|up-4\.net)\/\w+.*?<\/td>\s*<td style="color:orange;">/g, //unavaregex
                null //function delegate
            )
        }

        if (hostSet("Check_centfile_dot_com_links", false))
        {
            addHost(
                "centfile.com", //hostname
                "centfile\\.com\/\\w+", //linkregex
                null, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                'https://www.centfile.com/?op=checkfiles',
                "op=checkfiles&process=Check+URLs&list=",
                /(centfile\.com\/\w+)/,
                /centfile\.com\/\w+.*?<\/td>\s*<td style="color:green;">/g, //liveregex
                /centfile\.com\/\w+.*?<\/td>\s*<td style="color:red;">/g, //deadregex
                /centfile\.com\/\w+.*?<\/td>\s*<td style="color:orange;">/g, //unavaregex
                null //function delegate
            )
        }

        if (hostSet("Check_filebonus_dot_net_links", false))
        {
            addHost(
                "filebonus.net|filebonus.com", //hostname
                "filebonus\\.(?:net|com)\/\\w+", //linkregex
                null, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                'http://filebonus.net/?op=check_files',
                "op=check_files&process=Check+URLs&list=",
                /(filebonus\.(?:net|com)\/\w+)/,
                /filebonus\.(?:net|com)\/\w+.*?<\/td>\s*<td style="color:green;">/g, //liveregex
                /filebonus\.(?:net|com)\/\w+.*?<\/td>\s*<td style="color:red;">/g, //deadregex
                /filebonus\.(?:net|com)\/\w+.*?<\/td>\s*<td style="color:orange;">/g, //unavaregex
                null //function delegate
            )
        }

        if (hostSet("Check_hulkload_dot_com_links", false))
        {
            addHost(
                "hulkload.com", //hostname
                "hulkload\\.com\/\\w+", //linkregex
                null, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                'http://hulkload.com/?op=checkfiles',
                "op=checkfiles&process=Check+URLs&list=",
                /(hulkload\.com\/\w+)/,
                /hulkload\.com\/\w+.*?<small><font style="color:green;">/g, //liveregex
                /hulkload\.com\/\w+.*?<small><font style="color:red;">/g, //deadregex
                /hulkload\.com\/\w+.*?<small><font style="color:orange;">/g, //unavaregex
                null //function delegate
            )
        }

        if (hostSet("Check_dropapk_dot_to_links", false))
        {
            addHost(
                "dropapk.to|dropapk.com", //hostname
                "dropapk\\.(?:to|com)\/\\w+", //linkregex
                null, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                'https://drop.download/check_files',
                "op=check_files&process=Check+URLs&list=",
                /(dropapk\.(?:to|com)\/\w+)/,
                /dropapk\.(?:to|com)\/\w+.*?<\/td>\s*<td class="py-2 pr-2">\s*<span style="background-color:green;/g, //liveregex
                /dropapk\.(?:to|com)\/\w+.*?<\/td>\s*<td class="py-2 pr-2">\s*<span style="background-color:red;/g, //deadregex
                /dropapk\.(?:to|com)\/\w+.*?<\/td>\s*<td class="py-2 pr-2">\s*<span style="background-color:orange;/g, //unavaregex
                null //function delegate
            )
        }

        if (hostSet("Check_heroupload_dot_com_links", false))
        {
            addHost(
                "heroupload.com", //hostname
                "heroupload\\.com\/\\w+", //linkregex
                null, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                'https://www.heroupload.com/link_checker.html',
                "submitme=1&submit=submit&file_urls=",
                /(heroupload\.com\/\w+)/,
                /heroupload\.com\/\w+.*?<\/td>\s*<td style="text-align: center; width: 120px;">\s*<span style="color: green;">/g, //liveregex
                /heroupload\.com\/\w+.*?<\/td>\s*<td style="text-align: center; width: 120px;">\s*<span style="color: red;">/g, //deadregex
                /heroupload\.com\/\w+.*?<\/td>\s*<td style="text-align: center; width: 120px;">\s*<span style="color: orange;">/g, //unavaregex
                null //function delegate
            )
        }

        if (hostSet("Check_fireload_dot_com_links", false))
        {
            addHost(
                "fireload.com", //hostname
                "fireload\\.com\/\\w+", //linkregex
                null, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                'https://www.fireload.com/link_checker',
                "submitme=1&submit=submit&file_urls=",
                /(fireload\.com\/\w+)/,
                /fireload\.com\/\w+.*?<\/td>\s*<td style="text-align: center; width: 120px;">\s*<span style="color: green;">/g, //liveregex
                /fireload\.com\/\w+.*?<\/td>\s*<td style="text-align: center; width: 120px;">\s*<span style="color: red;">/g, //deadregex
                /fireload\.com\/\w+.*?<\/td>\s*<td style="text-align: center; width: 120px;">\s*<span style="color: orange;">/g, //unavaregex
                null //function delegate
            )
        }

        if (hostSet("Check_douploads_dot_net_links", false))
        {
            addHost(
                "douploads.com|douploads.net", //hostname
                "douploads\\.(?:com|net)\/\\w+", //linkregex
                null, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                'https://douploads.net/?op=check_files',
                "op=check_files&process=Check+URLs&list=",
                /(douploads\.(?:net|com)\/\w+)/,
                /douploads\.(?:net|com)\/\w+.*?<\/td>\s*<td>\s*<span class="badge badge-green">/g, //liveregex
                /douploads\.(?:net|com)\/\w+.*?<\/td>\s*<td>\s*<span class="badge badge-red">/g, //deadregex
                /douploads\.(?:net|com)\/\w+.*?<\/td>\s*<td>\s*<span class="badge badge-orange">/g, //unavaregex
                null //function delegate
            )
        }

        if (hostSet("Check_uploadrar_dot_com_links", false))
        {
            addHost(
                "uploadrar.com", //hostname
                "uploadrar\\.com\/\\w+", //linkregex
                null, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                'https://uploadrar.com/?op=check_files',
                "op=check_files&process=Check+URLs&list=",
                /(uploadrar\.com\/\w+)/,
                /uploadrar\.com\/\w+.*?<\/td>\s*<td style="color:green;">/g, //liveregex
                /uploadrar\.com\/\w+.*?<\/td>\s*<td style="color:red;">/g, //deadregex
                /uploadrar\.com\/\w+.*?<\/td>\s*<td style="color:orange;">/g, //unavaregex
                null //function delegate
            )
        }

        if (hostSet("Check_bdupload_dot_asia_links", false))
        {
            addHost(
                "bdupload.asia|bdupload.in", //hostname
                "(?:dl\\.|)bdupload\\.(?:in|asia)\\/\\w+", //linkregex
                null, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                'https://bdupload.asia/?op=checkfiles',
                "op=checkfiles&process=Check+URLs&list=",
                /((?:dl\.|)bdupload\.(?:in|asia)\/\w+)/, //link Regex
                /(?:dl\.|)bdupload\.(?:in|asia)\/\w+.*?<\/td>\s*<td style="color:green;">/g, //liveregex
                /(?:dl\.|)bdupload\.(?:in|asia)\/\w+.*?<\/td>\s*<td style="color:red;">/g, //deadregex
                /(?:dl\.|)bdupload\.(?:in|asia)\/\w+.*?<\/td>\s*<td style="color:orange;">/g, //unavaregex
                null //function delegate
            )
        }

        if (hostSet("Check_terafile_dot_co_links", false))
        {
            addHost(
                "terafile.co|lumfile.com|lumfile.eu|lumfile.se", //hostname
                "(?:terafile\\.co|lumfile\\.(?:com|eu|se))\/\\w+", //linkregex
                null, //blocksize
                /(http:\/\/(?:www\.|)(?:lumfile\.(?:com|eu|se)|terafile\.co)\/\w+)/, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                'http://www.terafile.co/?op=checkfiles',
                'op=checkfiles&process=Check+URLs&list=',
                /((?:terafile\.co|lumfile\.(?:se|eu|com))\/\w+)/,
                /(?:terafile\.co|lumfile\.(?:se|eu|com))\/\w+.*?<\/td>\s*<td style="color:green;">/g, //liveregex
                /(?:terafile\.co|lumfile\.(?:se|eu|com))\/\w+.*?<\/td>\s*<td style="color:red;">/g, //deadregex
                /(?:terafile\.co|lumfile\.(?:se|eu|com))\/\w+.*?<\/td>\s*<td style="color:orange;">/g, //unavaregex
                null //function delegate
            )
        }

        if (hostSet("Check_ge_dot_tt_links", false))
        {
            addHost(
                "ge.tt", //hostname
                "ge\\.tt\/(?:api\/1\/files\/)?\\w+", //linkregex
                1000000, //blocksize
                /ge\.tt\/(?:api\/1\/files\/)?(\w+.*)/, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                'https://open.ge.tt/1/files/', //api url
                null, //postdata
                null, //linkregex
                null, //liveregex
                null, //deadregex
                null, //unavaregex
                gettBulkCheck //function delegate
            )
        }

        if (hostSet("Check_filepup_dot_net_links", false))
        {
            addHost(
                "filepup.net", //hostname
                "filepup\\.net\/(?:files|get)\/\\w+", //linkregex
                null, //blocksize
                null, //corrmatch
                /\/get\/(\w+)\/.+/, //corrreplwhat
                "/files/$1.html", //corrreplwith
                null, //separator
                'http://www.filepup.net/link_checker.php', //api url
                'task=doCheck&submit=Check+Links&urls=', //postdata
                /filepup\.net\/files(\/\w+)/, //linkregex
                /green">http:\/\/(?:www\.)?filepup\.net\/files\/\w+/g, //liveregex
                /red">http:\/\/(?:www\.)?filepup\.net\/files\/\w+/g, //deadregex
                /orange">http:\/\/(?:www\.)?filepup\.net\/files\/\w+/g, //unavaregex
                null //function delegate
            )
        }

        if (hostSet("Check_anysend_dot_com_links", false))
        {
            addHost(
                "anysend.com", //hostname
                "anysend\\.com\/\\w{32}", //linkregex
                100000, //blocksize
                /anysend\.com\/(\w{32})/, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                null, //api url
                null, //postdata
                null, //linkregex
                null, //liveregex
                null, //deadregex
                null, //unavaregex
                anysendBulkCheck //function delegate
            )
        }

        if (hostSet("Check_webshare_dot_cz_links", false))
        {
            addHost(
                "webshare.cz", //hostname
                "(en\\.)?webshare\\.cz\/(?:#\/|)(?:file|group)\/\\w+", //linkregex
                100000, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                null, //api url
                null, //postdata
                null, //linkregex
                null, //liveregex
                null, //deadregex
                null, //unavaregex
                webshareBulkCheck //function delegate
            )
        }

        if (hostSet("Check_uploadable_dot_ch_links", false))
        {
            addHost(
                "uploadable.ch", //hostname
                "uploadable\\.ch\/file\/\\w+", //linkregex
                null, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                'http://www.uploadable.ch/check.php', //api url
                'urls=', //postdata
                /(uploadable\.ch\/file\/\w+)/, //linkregex
                /<div class="col1"><a href="">http:\/\/(?:www\.)?uploadable\.ch\/file\/\w+.*<\/a><\/div>\s+<div class="col2">.+<\/div>\s+<div class="col3">.+<\/div>\s+<div class="col4"><span class="[\w\s]+">&nbsp;<\/span>\s+<span class="left">Available<\/span>/g, //liveregex
                /<div class="col1"><a href="">http:\/\/(?:www\.)?uploadable\.ch\/file\/\w+.*<\/a><\/div>\s+<div class="col2">.+<\/div>\s+<div class="col3">.+<\/div>\s+<div class="col4"><span class="[\w\s]+">&nbsp;<\/span>\s+<span class="left">Not Available<\/span>/g, //deadregex
                null, //unavaregex
                null //function delegate
            )
        }

        if (hostSet("Check_prefiles_dot_com_links", false))
        {
            addHost(
                "prefiles.com", //hostname
                "prefiles\\.com\/\\w+", //linkregex
                null, //blocksize
                /(https?:\/\/(?:www\.)?prefiles\.com\/\w+)/, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                "http://prefiles.com/checker", //api url
                "op=checkfiles&list=", //postdata
                /(prefiles\.com\/\w+)/, //linkregex
                /prefiles\.com\/\w+.*<\/div>\s*<div class="copy" style="color:#6ab621;">/g, //liveregex
                /prefiles\.com\/\w+.*<\/div>\s*<div class="copy" style="color:#f10000;">/g, //deadregex
                null, //unavaregex
                null //function delegate
            )
        }

        /*if (hostSet("Check_rapidu_dot_net_links", false))
        {
            addHost(
                "rapidu.net", //hostname
                "rapidu\\.net\/\\d+", //linkregex
                1000000, //blocksize
                /rapidu\.net\/(\d+)/, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                "http://rapidu.net/api/getFileDetails/", //api url
                "id=", //postdata
                null, //linkregex
                null, //liveregex
                null, //deadregex
                null, //unavaregex
                rapiduBulkCheck //function delegate
            )
        }*/

        //         if (hostSet("Check_uplea_dot_com_links", false))
        //         {
        //             addHost(
        //                 "uplea.com", //hostname
        //                 "uplea\\.com\/dl\/\\w+", //linkregex
        //                 1000000, //blocksize
        //                 /(https?:\/\/(?:www\.)?uplea\.com\/dl\/\w+)/, //corrmatch
        //                 null, //corrreplwhat
        //                 null, //corrreplwith
        //                 null, //separator
        //                 "http://api.uplea.com/api/check-my-links", //api url
        //                 null, //postdata
        //                 null, //linkregex
        //                 null, //liveregex
        //                 null, //deadregex
        //                 null, //unavaregex
        //                 upleaBC //function delegate
        //             )
        //         }

                if (hostSet("Check_pixeldrain_dot_com_links", false))
                {
                    addHost(
                        "pixeldrain.com", //hostname
                        "pixeldrain\\.com\/u\/\\w+", //linkregex
                        1000000, //blocksize
                        /(https?:\/\/(?:www\.)?pixeldrain\.com\/u\/\w+)/, //corrmatch
                        null, //corrreplwhat
                        null, //corrreplwith
                        null, //separator
                        null, //api url
                        null, //postdata
                        null, //linkregex
                        null, //liveregex
                        null, //deadregex
                        null, //unavaregex
                        pixeldrainBC //function delegate
                    )
                }

        // if (hostSet("Check_oboom_dot_com_links", false))
        // {
        //     addHost(
        //         "oboom.com", //hostname
        //         "oboom\\.com\/#?\\w{8}", //linkregex
        //         null, //blocksize
        //         /oboom\.com\/#?(\w{8})/, //corrmatch
        //         null, //corrreplwhat
        //         null, //corrreplwith
        //         null, //separator
        //         null, //api url
        //         null, //postdata
        //         null, //linkregex
        //         null, //liveregex
        //         null, //deadregex
        //         null, //unavaregex
        //         oboomBulk //function delegate
        //     )
        // }

        if (hostSet("Check_inclouddrive_dot_com_links", false))
        {
            addHost(
                "inclouddrive.com", //hostname
                "inclouddrive\\.com\/(?:file|#\/file_download)\/[a-zA-Z0-9_-]+", //linkregex
                100000000, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                null, //api url
                null, //postdata
                null, //linkregex
                null, //liveregex
                null, //deadregex
                null, //unavaregex
                inclouddriveCheck //function delegate
            );
        }

        if (hostSet("Check_fastshare_dot_cz_links", false))
        {
            addHost(
                "fastshare.cz|fastshare.live", //hostname
                "fastshare\\.(?:cz|live)\/\\d+\/\\w*", //linkregex
                100000000, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                null, //api url
                null, //postdata
                null, //linkregex
                null, //liveregex
                null, //deadregex
                null, //unavaregex
                fastsharedotczCheck //function delegate
            );
        }

        function genBulkCheck()
        {
            var blockIdx = this.links.length;

            while (blockIdx--)
            {
                postRequest(this.apiUrl, this.postData, this.links[blockIdx],
                            this.resLinkRegex, this.resLiveRegex, this.resDeadRegex, this.resUnavaRegex, this.separator);

            }

            //this function called while direct checking or bulk checking through link checker page
            function postRequest(api, postData, links, linkRegex, liveRegex, deadRegex, unavaRegex, sep)
            {
                GM_xmlhttpRequest(
                    {
                        method: 'POST',
                        url: api,
                        headers: {
                            'User-agent': rUA(),
                            'Content-type': 'application/x-www-form-urlencoded',
                            'Referer': api,
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        data: postData + encodeURIComponent(links),
                        onload: function (result)
                        {
                            //debugger;
                            var res = result.responseText;

                            if ((res.contains(">DDoS protection by CloudFlare") && res.contains(">Checking your browser before accessing<")) || res.contains('<iframe src="/_Incapsula_Resource?') || res.contains('>Please complete the security check')) {
                                DisplayTheCheckedLinks(links.split(sep), 'unknown_link', 'Captcha required to check links');
                                sendMessage('Some links require you to fill out a captcha! Please open them manually.')
                            }

                            var i;

                            var livelinks = res.match(liveRegex);
                            var deadlinks = res.match(deadRegex);

                            //console.log(livelinks);
                            //console.log(deadlinks);

                            if (livelinks != null)
                            {
                                i = livelinks.length - 1;
                                do
                                {
                                    livelinks[i] = livelinks[i].match(linkRegex)[1];
                                }
                                while (i--);
                                DisplayTheCheckedLinks(livelinks, 'alive_link');
                            }

                            if (deadlinks != null)
                            {
                                i = deadlinks.length - 1;
                                do
                                {
                                    deadlinks[i] = deadlinks[i].match(linkRegex)[1];
                                }
                                while (i--);
                                DisplayTheCheckedLinks(deadlinks, 'adead_link');
                            }

                            if (unavaRegex != null)
                            {
                                var unavalinks = res.match(unavaRegex)
                                if (unavalinks)
                                {
                                    i = unavalinks.length - 1;
                                    do
                                    {
                                        unavalinks[i] = unavalinks[i].match(linkRegex)[1];
                                    }
                                    while (i--);
                                    DisplayTheCheckedLinks(unavalinks, 'unava_link');
                                }
                            }
                        },
                        onerror: function (e) {
                            //debugger;
                            var linkArr = links.split(sep);
                            DisplayTheCheckedLinks(linkArr, "unknown_link");
                        }
                    });

            }
        }

        //specialized bulkchecking handlers follow
        function OnefichierCheck() {
            var blockIdx = this.links.length;

            while (blockIdx--)
            {
                postRequest(this.apiUrl, this.postData, this.links[blockIdx].split(this.separator).join('&links[]='),
                            this.resLinkRegex, this.resLiveRegex, this.resDeadRegex, this.resUnavaRegex, '&links[]=');

            }

            function postRequest(api, postData, links, linkRegex, liveRegex, deadRegex, unavaRegex, sep)
            {
                GM_xmlhttpRequest(
                    {
                        method: 'POST',
                        url: api,
                        headers: {
                            'User-agent': rUA(),
                            'Content-type': 'application/x-www-form-urlencoded',
                            'Referer': api,
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        data: postData + encodeURIComponent(links).replace(/%26links%5B%5D%3D/g, '&links[]='), //replace for 1Fichier (Doesn't recognize different request parameters)
                        onload: function (result)
                        {
                            var res = result.responseText;

                            //console.log(res);

                            var i;

                            var livelinks = res.match(liveRegex);
                            var deadlinks = res.match(deadRegex);

                            //console.log(livelinks);
                            //console.log(deadlinks);

                            if (livelinks != null)
                            {
                                i = livelinks.length - 1;
                                do
                                {
                                    livelinks[i] = livelinks[i].match(linkRegex)[1];
                                }
                                while (i--);
                                DisplayTheCheckedLinks(livelinks, 'alive_link');
                            }

                            if (deadlinks != null)
                            {
                                i = deadlinks.length - 1;
                                do
                                {
                                    deadlinks[i] = deadlinks[i].match(linkRegex)[1];
                                }
                                while (i--);
                                DisplayTheCheckedLinks(deadlinks, 'adead_link');
                            }

                            if (unavaRegex != null)
                            {
                                var unavalinks = res.match(unavaRegex)
                                if (unavalinks)
                                {
                                    i = unavalinks.length - 1;
                                    do
                                    {
                                        unavalinks[i] = unavalinks[i].match(linkRegex)[1];
                                    }
                                    while (i--);
                                    DisplayTheCheckedLinks(unavalinks, 'unava_link');
                                }
                            }

                            var unknownlinks = res.match(/https?:\/\/\w+\.1fichier.com.*;;;BAD LINK/g);
                            if (unknownlinks) {
                                i = unknownlinks.length - 1;
                                do
                                {
                                    unknownlinks[i] = unknownlinks[i].match(linkRegex)[1];
                                }
                                while (i--);
                                DisplayTheCheckedLinks(unknownlinks, 'unknown_link');
                            }
                        },
                        onerror: function (e) {
                            var linkArr = links.split(sep);
                            DisplayTheCheckedLinks(linkArr, "unknown_link");
                        }
                    });

            }
        }

        function inclouddriveCheck() {
            var links = this.links[0].split('\r\n');
            var x = links.length;
            var link;
            while (x--) {
                checkLink(links[x]);
            }

            function checkLink(link) {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: link.replace('/file/', '/index.php/file_download/').replace('/#/', '/index.php/'),
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    onload: function (result) {
                        var res = result.responseText;
                        if (res.contains('<p style="font-size:17px;">The requested file isn\'t anymore!</p>')) {
                            DisplayTheCheckedLinks([link], 'adead_link');
                        } else if (res.contains('<button style="border:none;" id="download_from_link"')) {
                            DisplayTheCheckedLinks([link], 'alive_link');
                        } else {
                            DisplayTheCheckedLinks([link], 'unknown_link');
                        }
                    }
                });
            }
        }

        function fastsharedotczCheck() {
            debugger;
            var links = this.links[0].split('\r\n');
            var x = links.length;
            var link;
            while (x--) {
                checkLink(links[x]);
            }

            function checkLink(link) {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: 'https://fastshare.cz/linkchecker?reg=' + encodeURIComponent(link.replace('/fastshare.live/', '/fastshare.cz/')),
                    // headers: {
                    //     'X-Requested-With': 'XMLHttpRequest'
                    // },
                    onload: function (result) {
                        debugger;
                        var res = result.responseText;
                        if (res.contains('span style=color:red>Neaktivní<\/span>')) {
                            DisplayTheCheckedLinks([link], 'adead_link');
                        } else if (res.contains('span style=color:green>Aktivní<\/span>')) {
                            DisplayTheCheckedLinks([link], 'alive_link');
                        } else {
                            DisplayTheCheckedLinks([link], 'unknown_link');
                        }
                    }
                });
            }
        }



        //         function upleaBC() {
        //             var json = {
        //                 links: this.links[0].split('\r\n')
        //             };

        //             GM_xmlhttpRequest({
        //                 method: 'POST',
        //                 url: this.apiUrl,
        //                 data: 'json=' + JSON.stringify(json),
        //                 headers: {
        //                     'User-agent': rUA(),
        //                     'Content-type': 'application/x-www-form-urlencoded',
        //                     'Referer': 'http://uplea.com/checker',
        //                     'X-Requested-With': 'XMLHttpRequest'
        //                 },
        //                 onload: function(result) {
        //                     var res = JSON.parse(result.responseText);

        //                     if (res.error.length > 0) {
        //                         var mes = 'Error in checking Uplea.com! Error message(s):';
        //                         $.each(res.error, function(key, val) { mes += '\r\n' + val; });
        //                         console.warn(mes); return;
        //                     }

        //                     var deadlinks = [], alivelinks = [], unavalinks = [];
        //                     $.each(res.result, function(key, val) {
        //                         if (val.status == 'OK') alivelinks.push(val.link);
        //                         else if (val.status == 'DELETE') deadlinks.push(val.link);
        //                         else unknownlinks.push(val.link);
        //                     });

        //                     if (deadlinks.length > 0) DisplayTheCheckedLinks(deadlinks, 'adead_link');
        //                     if (alivelinks.length > 0) DisplayTheCheckedLinks(alivelinks, 'alive_link');
        //                     if (unknownlinks.length > 0) DisplayTheCheckedLinks(unavalinks, 'unknown_link');
        //                 }
        //             });
        //         }

        /*function rapiduBulkCheck() {
            var arr = this.links[0].split('\r\n').join(',');
            GM_xmlhttpRequest({
                method: 'POST',
                url: this.apiUrl,
                data: this.postData + arr,
                headers: {
                    'User-agent': rUA(),
                    'Content-type': 'application/x-www-form-urlencoded',
                    'Referer': 'http://rapidu.net',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                onload: function(result) {
                    var res = JSON.parse(result.responseText);
                    var deadlinks = [], alivelinks = [];
                    $.each(res, function(key, value) {
                        if (value.fileStatus && value.fileStatus == 1) {
                            alivelinks.push(value.fileId);
                        } else if (value.fileStatus && value.fileStatus == 0) {
                            deadlinks.push(value.fileId);
                        }
                    });

                    if (deadlinks.length > 0) DisplayTheCheckedLinks(deadlinks, 'adead_link');
                    if (alivelinks.length > 0) DisplayTheCheckedLinks(alivelinks, 'alive_link');
                }
            });
        }*/


        function anysendBulkCheck() {
            var arr = this.links[0].split('\r\n');
            var blockIdx = arr.length;
            while (blockIdx--) {
                check(arr[blockIdx]);
            }

            function check(id) {
                GM_xmlhttpRequest({
                    url: 'http://im.anysend.com/check_file.php?key=' + id,
                    method: 'GET',
                    onload: function(result) {
                        var res = result.responseText;
                        if (res.contains(/"[0-9\.]+"/)) {
                            DisplayTheCheckedLinks([id], 'alive_link');
                        } else if (res.contains('<a href="/download.php" class="btn btn-large btn-success"')) { //request has redirected to homepage => link dead
                            DisplayTheCheckedLinks([id], 'adead_link');
                        } else {
                            DisplayTheCheckedLinks([id], 'unknown_link');
                        }

                    }
                });
            }
        }

        function gettBulkCheck() {
            var arr = this.links[0].split("\r\n");
            var i = arr.length;
            var params, sharename, fileid;
            while (i--) {
                params = arr[i].match(/(\w+)(?:\/v\/(\d+))?/);
                sharename = params[1], fileid = params[2] ? params[2] : 0;
                GM_xmlhttpRequest({
                    method:"GET",
                    url: this.apiUrl + sharename + "/" + fileid,
                    headers: {
                        'User-agent': rUA(),
                        'Content-type': 'application/x-www-form-urlencoded',
                        'Referer': this.apiUrl,
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    onload: function(result) {
                        var res = JSON.parse(result.responseText);
                        if (res.readystate == "uploaded") {
                            DisplayTheCheckedLinks([res.sharename], 'alive_link');
                        } else if (res.readystate == "removed") {
                            DisplayTheCheckedLinks([res.sharename], 'adead_link');
                        } else {
                            DisplayTheCheckedLinks([res.sharename], 'unknown_link');
                        }
                    }
                });
            }
        }

        function pixeldrainBC() {
            // debugger;
            var arr = this.links[0].split("\r\n");
            var i = arr.length;
            while (i--) {
                var id = arr[i].match(/\/u\/(.+)/)[1];
                //params = arr[i].match(/(\w+)(?:\/u\/(\d+))?/);
                //sharename = params[1], fileid = params[2] ? params[2] : 0;
                GM_xmlhttpRequest({
                    method:"GET",
                    url: 'https://pixeldrain.com/api/file/'+id + '/info',
                    // headers: {
                    //     'User-agent': rUA(),
                    //     'Content-type': 'application/x-www-form-urlencoded',
                    //     'Referer': this.apiUrl,
                    //     'X-Requested-With': 'XMLHttpRequest'
                    // },
                    onload: function(result) {
                        // debugger;
                        // var res = result.responseText;
                        // var viewerDataScript = $(res).filter('script:contains("window.viewer_data")');
                        // var viewerData = viewerDataScript.html().match(/window\.viewer_data\s*=\s*({.*?});/)[1];
                        // var jsonData = JSON.parse(viewerData);
                        // // Do something with the extracted JSON data
                        // console.log(jsonData);

                        if (result.status == 200) {
                            DisplayTheCheckedLinks([arr[i+1]], 'alive_link');
                        } else if (result.status == 404) {
                            DisplayTheCheckedLinks([arr[i+1]], 'adead_link');
                        } else {
                            DisplayTheCheckedLinks([arr[i+1]], 'unknown_link');
                        }
                    }
                });
            }
        }

        function uploadingBulkCheck()
        {
            var blockIdx = this.links.length;

            while (blockIdx--)
            {
                postRequest(this.apiUrl, this.postData, this.links[blockIdx],
                            this.resLinkRegex, this.resLiveRegex, this.resDeadRegex, this.resUnavaRegex);

            }

            function postRequest(api, postData, links, linkRegex, liveRegex, deadRegex, unavaRegex)
            {
                GM_xmlhttpRequest(
                    {
                        method: 'POST',
                        url: api,
                        headers: {
                            'User-agent': rUA(),
                            'Content-type': 'application/x-www-form-urlencoded',
                            'Referer': api,
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        data: postData + encodeURIComponent(links),
                        onload: function (result)
                        {
                            var res = result.responseText;

                            var i;

                            var livelinks = res.match(liveRegex);
                            var deadlinks = res.match(deadRegex);
                            var allLinks = links.split("\r\n");
                            for(i=0;i<allLinks.length;i++) {
                                allLinks[i] = allLinks[i].match(/uploading\.com\/(?:files\/|\w+\/\?get=)?(\w+)/)[1];
                            }

                            if (livelinks != null)
                            {
                                i = livelinks.length - 1;
                                do
                                {
                                    livelinks[i] = livelinks[i].match(linkRegex)[1].toLowerCase();
                                    livelinks.push(livelinks[i].toUpperCase());
                                    allLinks.splice($.inArray(livelinks[i], allLinks), 1);
                                }
                                while (i--);
                                DisplayTheCheckedLinks(livelinks, 'alive_link');
                            }

                            if (deadlinks != null)
                            {
                                i = deadlinks.length - 1;
                                do
                                {
                                    deadlinks[i] = deadlinks[i].match(linkRegex)[1].toLowerCase();
                                    deadlinks.push(deadlinks[i].toUpperCase());
                                    allLinks.splice($.inArray(deadlinks[i], allLinks), 1);
                                }
                                while (i--);
                                DisplayTheCheckedLinks(deadlinks, 'adead_link');
                            }

                            if (allLinks.length > 0)
                            {
                                i = allLinks.length - 1;
                                do
                                {
                                    websiteCheck(allLinks[i]);
                                }
                                while (i--);
                            }
                        }
                    });

            }

            function websiteCheck(link) {
                var realLink = "http://uploading.com/files/" + link;
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: realLink,
                    headers: {
                        'User-agent': rUA(),
                        'Content-type': 'application/x-www-form-urlencoded',
                        'Referer': realLink,
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    onload: function (result) {
                        if (result.status == 503) websiteCheck(link);
                        res = result.responseText;
                        if (res.contains('file_error">|error_404">')) {
                            DisplayTheCheckedLinks([link], 'adead_link');
                        }
                        else if (res.contains('free_method">')) {
                            DisplayTheCheckedLinks([link], 'alive_link');
                        }
                    }
                });
            }
        }

        function uploadedBulkCheck()
        {
            var t = this.links.length;
            while (t--) {
                var arr = this.links[t].split("\r\n");
                var data = "apikey=lhF2IeeprweDfu9ccWlxXVVypA5nA3EL";

                $.each(arr, function (key, value) {
                    data += '&id_' + key + '=' + value;
                });

                GM_xmlhttpRequest(
                    {
                        method: "POST",
                        url: "https://uploaded.net/api/filemultiple",
                        data: data,
                        headers: {
                            'User-agent': rUA(),
                            'Content-type': 'application/x-www-form-urlencoded',
                            'Referer': ""
                        },
                        onload: function (result)
                        {
                            //debugger;
                            var res = result.responseText;

                            var i;

                            var livelinks = res.match(/online,\w+,/g);
                            var deadlinks = res.match(/offline,\w+,/g);

                            if (livelinks)
                            {
                                var i = livelinks.length - 1;
                                do
                                {
                                    livelinks[i] = livelinks[i].match(/,(\w+),/)[1];
                                }
                                while (i--);
                                DisplayTheCheckedLinks(livelinks, 'alive_link');
                            }

                            if (deadlinks)
                            {
                                var k = deadlinks.length - 1;
                                do
                                {
                                    deadlinks[k] = deadlinks[k].match(/,(\w+),/)[1];
                                }
                                while (k--);
                                DisplayTheCheckedLinks(deadlinks, 'adead_link');
                            }
                        }
                    });
            }
        }

        function megaBulkCheck()
        {
            var arr = this.links[0].split("\r\n");
            var i = arr.length;
            var seqno = Math.floor(Math.random()*1000000000);

            while(i--)
            {
                postRequest(arr[i]);
            }

            function postRequest(megaLink)
            {

                //megaLink=megaLink.replace('mega.nz/','mega.co.nz/');
                var id = arr[i].match(/mega(?:\.co)?\.nz\/(#!|file\/)(\w+)(?:(!|#)\w+)?/)[2];

                GM_xmlhttpRequest(
                    {
                        method: "POST",
                        url: 'https://g.api.mega.co.nz/cs?id=' + seqno++,
                        data: '[{"a":"g","p":"' + id + '","ssl": "1"}]',
                        headers: {
                            'User-agent': rUA(),
                            'Content-Type': 'application/xml',
                            'Referer': "https://mega.nz/"
                        },
                        onload: function (result)
                        {
                            var res = $.parseJSON(result.responseText.match(/\[(.+?)\]/)[1]);

                            if ((typeof res == "number" && (res == -9 || res == -16 || res == -6)) || res.d) {
                                DisplayTheCheckedLinks([id], 'adead_link');
                            } else if (res.e == "ETEMPUNAVAIL") {
                                DisplayTheCheckedLinks([id], 'unava_link');
                            } else if (res.at) {
                                DisplayTheCheckedLinks([id], 'alive_link');
                            } else {
                                console.warn("Error in checking Mega.co.nz! Please notify devs.\r\nError code: " + result.responseText);
                            }
                        }
                    });
            }
        }

        function k2sBulkCheck()
        {
            var arr = this.links[0].split("\r\n");
            var i = arr.length;

            c=0;
            arrIDs=[];
            while(i--)
            {
                id = arr[i].match(/(?:\/file|)\/(\w+)/)[1];
                if (id=='info')
                {
                    DisplayTheCheckedLinks([arr[i]], 'adead_link');
                    continue;
                }
                k2salreadyexist=false;
                for (j=0;j<arrIDs.length;j++)
                {
                    if (arrIDs[j]==id)
                    {
                        k2salreadyexist=true;
                        break;
                    }
                }
                if (k2salreadyexist) continue;
                arrIDs.push(id);
                c++;
                setTimeout(k2sRequest,c*750,arr[i]);
            }
        }
        function k2sRequest(K2SLink)
        {
            var mpDomain;
            mpDomain=K2SLink.toLowerCase();;
            if (mpDomain.indexOf('k2s.cc/')>-1||mpDomain.indexOf('keep2s.cc/')>-1||mpDomain.indexOf('keep2share.cc/')>-1)
            {
                mpDomain='k2s.cc';
            }

            else if (mpDomain.indexOf('fileboom.me/')>-1||mpDomain.indexOf('fboom.me/')>-1)
            {
                mpDomain='fboom.me';
            }

            else if (mpDomain.indexOf('tezfiles.com/')>-1)
            {
                mpDomain='tezfiles.com';
            }

            else if (mpDomain.indexOf('anonfile.com/')>-1||mpDomain.indexOf('anonfiles.com/')>-1)
            {
                mpDomain='anonfiles.com';
            }

            var id = K2SLink.match(/\/file\/(\w+)/)[1];

            var MPAPILink='https://'+mpDomain+'/api/v2/GetFileStatus';
            GM_xmlhttpRequest(
                {
                    method: 'POST',
                    url: MPAPILink,
                    headers: {
                        'User-agent': rUA(),
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Referer': ''
                    },
                    data: '{"id":"'+id+'"}',
                    onload: function (result)
                    {
                        var res = result.responseText;

                        if (res.match('"is_available":false|"message":"File deleted"|"errorCode":"deleted"|"errorCode":"not_found"|"errorCode":"abused"|"errorCode":"blocked"'))
                        {
                            DisplayTheCheckedLinks([K2SLink], 'adead_link');
                            return;
                        }

                        if (res.match('"access":"premium"'))
                        {
                            DisplayTheCheckedLinks([K2SLink], 'prem_link');
                            return;
                        }
                        if (res.match('"is_folder":true'))
                        {
                            DisplayTheCheckedLinks([K2SLink], 'unava_link');
                            return;
                        }
                        if (res.match('"is_available":true'))
                        {
                            DisplayTheCheckedLinks([K2SLink], 'alive_link');
                            return;
                        }

                        DisplayTheCheckedLinks([K2SLink], 'unava_link');
                        return;
                    },
                    onerror: function ()
                    {
                        DisplayTheCheckedLinks([K2SLink], 'unava_link');
                        return;
                    }
                });
        }

        function RapidgatorBulkCheck() {
            var a = [], b = [], c = [];
            var array = this.links[0].split("\r\n");
            var newArray = chunk(array, 25);

            var arrlen = newArray.length;

            function chunk (items, size) {
                const chunks = []
                items = [].concat(...items)
                while (items.length) {
                    chunks.push(
                        items.splice(0, size)
                    )
                }
                return chunks
            }
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: 'https://rapidgator.net/api/v2/user/login?login=login&password=pass',
                    headers: {
                        'User-agent': rUA(),
                        'Content-type': 'application/x-www-form-urlencoded',
                        'Referer': 'https://rapidgator.net'
                    },
                    onload: function(result) {
                        var resp = JSON.parse(result.responseText);
                        var token = resp.response.token;
                        var blockIdx;

                        while(arrlen--)
                        {
                            //blockIdx = newArray.length;

                            //while (blockIdx--){
                                startCheck(newArray[arrlen].join(","), token);
                            //}
                        }
                    }
                });


            // RGBulk

            function startCheck(links, token) {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: "https://rapidgator.net/api/v2/file/check_link?token="+ token + "&url=" + links,
                    headers: {
                        'User-agent': rUA(),
                        'Content-type': 'application/x-www-form-urlencoded',
                        'Referer': 'https://rapidgator.net/',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    // data: {"token" : token, "url": links},
                    onload: function(result) {
                        // var res = JSON.parse(result.responseText)[1];
                        // var i = res.length, s;

                        var res = JSON.parse(result.responseText).response;
                        var i = res.length, s;

                        while (i--) {

                            s = res[i].status;
                            if (s == 'ACCESS') a.push(res[i].url);
                            else if (s == 'NO ACCESS' || s == 'abused' || s == 'lost' || s == 'not_found' || s =='expired') b.push(res[i].url);
                            else c.push(res[i].url);
                        }

                        if (a.length > 0) DisplayTheCheckedLinks(a, 'alive_link');
                        if (b.length > 0) DisplayTheCheckedLinks(b, 'adead_link');
                        if (c.length > 0) DisplayTheCheckedLinks(c, 'unknown_link');

//                             if (res[i].status == 'NO ACCESS')
//                             {
//                                 DisplayTheCheckedLinks(links, 'adead_link');
//                                 return;
//                             }

//                             if (res[i].status =='Broken'||res[i].status=='Unknown') {
//                                 DisplayTheCheckedLinks(links, 'unknown_link');
//                                 return;
//                             }

//                             if (res[i].status == 'ACCESS')
//                             {
//                                 //var linkToolTips = res.title + '\n Host:' + res.host;
//                                 DisplayTheCheckedLinks(links, 'alive_link');
//                                 return;
//                             }

//                             if (res[i].status == 'Not yet checked')
//                             {
//                                 DisplayTheCheckedLinks(links, 'unava_link');
//                                 return;
//                             }
                    }
                });
            }
        }

        function gofileBulkCheck()
            {
                var arr = this.links[0].split("\r\n");
                var arrlen = arr.length;
                var token;
                    GM_xmlhttpRequest
                    (
                        {
                    method: 'GET',
                    url: 'https://api.gofile.io/createAccount',
                    headers: {
                        'User-agent': rUA(),
                        'Content-type': 'application/x-www-form-urlencoded',
                        'Referer': ''
                    },
                    onload: function(result)
                            {
                                var resp = JSON.parse(result.responseText);
                                token = resp.data.token;
                                while(arrlen--)
                                {
                                    postRequest(arr[arrlen], token);
                                }
                            }
                        }
                    );
                function postRequest(gofileLink,token)
                {
                    var linkId = gofileLink.match(/gofile\.io\/d\/(\w+)/)[1];

                    GM_xmlhttpRequest
                    (
                        {
                            method: "GET",
                            url: 'https://api.gofile.io/getContent?contentId=' + linkId + '&token=' + token + '&websiteToken=12345',
                            headers: {
                                'User-agent': rUA(),
                                'Referer': ""
                            },

                            onload: function (result)
                            {

                                var res = $.parseJSON(result.responseText);
                                if (res.status=="ok")
                                {
                                    DisplayTheCheckedLinks([gofileLink], 'alive_link');
                                    return;
                                }

                                if (res.status=='error-notFound')
                                {
                                    DisplayTheCheckedLinks([gofileLink], 'adead_link');
                                    return;
                                }
                            }
                        }
                    );
                }
         }


        function safeLinkingBulkCheck()
        {
            var arr = this.links[0].split("\r\n");
            var i = arr.length;

            while(i--)
            {
                postRequest(arr[i]);
            }

            function postRequest(safeLinkingLink)
            {
                //debugger;
                safeLinkingLink=safeLinkingLink.replace('safelinking.com/','safelinking.net/');
                var id = safeLinkingLink.match(/safelinking\.(?:net|com)\/(?:p\/|)(\w+)/)[1];

                GM_xmlhttpRequest(
                    {
                        method: "POST",
                        url: 'https://safelinking.net/check?link=' + safeLinkingLink + "&output=json",
                        headers: {
                            'User-agent': rUA(),
                            'Content-type': 'application/x-www-form-urlencoded',
                            'Referer': ""
                        },
                        onload: function (result)
                        {
                            var res = $.parseJSON(result.responseText);

//                             if(res.api_error =="not found")
//                             {
//                                 DisplayTheCheckedLinks([safeLinkingLink], 'unknown_link');
//                                 return;
//                             }

                            if (res.link_status == "") {
                                postRequest(safeLinkingLink);
                            }

                            if (res.link_status.match('Offline'))
                            {
                                DisplayTheCheckedLinks([id], 'adead_link');
                                return;
                            }

                            if (res.link_status.match('Broken')||res.link_status.match('Unknown')) {
                                DisplayTheCheckedLinks([id], 'unknown_link');
                                return;
                            }

                            if (res.link_status.match('Online'))
                            {
                                //var linkToolTips = res.title + '\n Host:' + res.host;
                                DisplayTheCheckedLinks([id], 'alive_link');
                            }

                            if (res.link_status.match('Not yet checked'))
                            {
                                DisplayTheCheckedLinks([id], 'unava_link');
                            }
                        }
                    });
            }
        }

        function turbobitBulkCheck()
        {
            var arr = this.links[0].split("\r\n");
            var i = arr.length;

            while(i--)
            {
                postRequest(arr[i]);
            }

            function postRequest(turbobitLink)
            {
                //debugger;

                //var link = turbobitLink.match(/(?:turbobit\.net|turb\.(?:pw|(?:cc|to)))\/(?:p\/|)(\w+)/)[1];

                GM_xmlhttpRequest(
                    {
                        method: "POST",
                        url: 'https://turbobit.net/linkchecker/check/csv',
                        headers: {
                            'User-agent': rUA(),
                            'Content-type': 'application/x-www-form-urlencoded',
                            'Referer': ""
                        },
                        data: "links_to_check=" + turbobitLink,
                        onload: function (result)
                        {
                            var res = result.responseText;

                            var status = res.split(",");

                            if ((status[0].match(turbobitLink))&& (status[1].match("1")))
                            {
                                DisplayTheCheckedLinks([turbobitLink], 'alive_link');
                            }

                            // if (status[0]== "") {
                            //     postRequest(turbobitLink);
                            // }

                            if ((status[0].match(turbobitLink))&& (status[1].match("0")))
                            {
                                DisplayTheCheckedLinks([turbobitLink], 'adead_link');
                                return;
                            }

                            // if (res.link_status.match('Broken')||res.link_status.match('Unknown')) {
                            //     DisplayTheCheckedLinks([id], 'unknown_link');
                            //     return;
                            // }
                        }
                    });
            }
        }

        //specialized bulkchecking handlers follow
		function webshareBulkCheck()
		{
			var arr = this.links[0].split("\r\n");
			var i = arr.length;

			while(i--)
			{
				postRequest(arr[i]);
			}

			//function postRequest(api, postData, links, linkRegex, liveRegex, deadRegex, unavaRegex)
			function postRequest(wsLink)
			{
				var id = wsLink.match(/(en\.)?webshare\.cz\/(?:(?:#\/)?(file|group)\/)?(\w+)/)[3];

				GM_xmlhttpRequest(
				{
					method: 'POST',
					url: "https://webshare.cz/api/tied_files/",
					headers: {
						'User-agent': rUA(),
						'Content-type': 'application/x-www-form-urlencoded',
						'Referer': "",
					},
					data: "wst=&offset=0&limit=25&ident=" + id,
					onload: function (result)
					{
						var res = result.responseText;

						if (res.match(/<name>.+?<\/name>/))
						{
							DisplayTheCheckedLinks([id], 'alive_link');
						}
						else
						{
							DisplayTheCheckedLinks([id], 'adead_link');
						}
					}
				});

			}
		}

         function fikperBulkCheck()
        {
            var arr = this.links[0].split("\r\n");
            var i = arr.length;

            while(i--)
            {
                postRequest(arr[i]);
            }

            function postRequest(fikperLink)
            {
                //debugger;
                var linkId = fikperLink.match(/fikper\.com\/(\w+)/)[1];

                GM_xmlhttpRequest(
                    {
                        method: "POST",
                        url: 'https://sapi.fikper.com',
                        headers: {
                            'User-agent': rUA(),
                            'Content-type': 'application/json',
                            'Referer': ""
                        },
                        data: JSON.stringify({'fileHashName': linkId}),
                        onload: function (result)
                        {
                             var res = $.parseJSON(result.responseText);

                           // var status = res.hasOwnProperty('name');

                            if (res.hasOwnProperty('name'))
                            {
                                DisplayTheCheckedLinks([fikperLink], 'alive_link');
                            }

                            // if (status[0]== "") {
                            //     postRequest(turbobitLink);
                            // }

                            if (res.message=='Not Found')
                            {
                                DisplayTheCheckedLinks([fikperLink], 'adead_link');
                                return;
                            }
                        }
                    });
            }
        }



        function depositfilesBulkCheck()
        {
            var arr = this.links[0].split("\r\n");
            var i = arr.length;

            while(i--)
            {
                postRequest(arr[i]);
            }

            function postRequest(dfLink)
            {
                var id = dfLink.match(/(?:depositfiles\.(?:com|lt|org)|dfiles\.(?:eu|ru))\/(?:en\/|ru\/|de\/|es\/|pt\/|)files\/(\w+)/)[1];

                GM_xmlhttpRequest(
                    {
                        method: "POST",
                        url: 'http://depositfiles.com/api/get_download_info.php?id=' + id + "&format=json",
                        headers: {
                            'User-agent': rUA(),
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Referer': ""
                        },
                        onload: function (result)
                        {
                            var res = result.responseText;

                            if (res == "") {
                                postRequest(dfLink);
                            }

                            if (res.contains('no_file'))
                            {
                                DisplayTheCheckedLinks(["files/" + id], 'adead_link');
                                return;
                            }

                            if (res.contains('file_ban')) {
                                DisplayTheCheckedLinks(["files/" + id], 'unknown_link');
                                return;
                            }

                            if (res.contains(/download_li(?:nk|mit)|password_check|file_storage/))
                            {
                                DisplayTheCheckedLinks(["files/" + id], 'alive_link');
                            }
                        }
                    });
            }
        }

        function uploadstBulkCheck()
        {
            var arr = this.links[0].split("\r\n");
            var i = arr.length;

            while(i--)
            {
                postRequest(arr[i]);
            }

            function postRequest(uploadstLink)
            {

                var id = uploadstLink.match(/upload\.st\/(?:p\/|)(\w+)/)[1];

                GM_xmlhttpRequest(
                    {
                        method: "GET",
                        url: 'https://api.upload.st/v2/file/' + id + "/info",
                        headers: {
                            'User-agent': rUA(),
                            'Content-type': 'application/json',
                            'Referer': ""
                        },
                        onload: function (result)
                        {
                            var res = $.parseJSON(result.responseText);

                            if (res.status == false)
                            {
                                DisplayTheCheckedLinks([id], 'adead_link');
                                return;
                            }
                            if (res.status == true)
                            {
                                //var linkToolTips = res.title + '\n Host:' + res.host;
                                DisplayTheCheckedLinks([id], 'alive_link');
                            }

                        }
                    });
            }
        }

        function internxtBulkCheck()
        {
            var arr = this.links[0].split("\r\n");
            var i = arr.length;

            while(i--)
            {
                postRequest(arr[i]);
            }

            function postRequest(internxtLink)
            {

                var id = internxtLink.match(/internxt\.com\/d\/sh\/file\/(\w+)\//)[1];

                GM_xmlhttpRequest(
                    {
                        method: "GET",
                        url: 'https://api.internxt.com/drive/storage/share/' + id,
                        headers: {
                            'User-agent': rUA(),
                            'Content-type': 'application/json',
                            'Referer': ""
                        },
                        onload: function (result)
                        {
                            var res = $.parseJSON(result.responseText);

                            if (result.status == 404)
                            {
                                DisplayTheCheckedLinks([id], 'adead_link');
                                return;
                            }
                            if (res.active == true)
                            {
                                //var linkToolTips = res.title + '\n Host:' + res.host;
                                DisplayTheCheckedLinks([id], 'alive_link');
                            }

                        }
                    });
            }
        }

        function anonfileBulkCheck()
        {
            var arr = this.links[0].split("\r\n");
            var i = arr.length;

            while(i--)
            {
                postRequest(arr[i]);
            }

            function postRequest(anonfileLink)
            {

                var id = anonfileLink.match(/anonfile(?:s|)\.com\/(?:p\/|)(\w+)/)[1];

                GM_xmlhttpRequest(
                    {
                        method: "GET",
                        url: 'https://api.anonfiles.com/v2/file/' + id + "/info",
                        headers: {
                            'User-agent': rUA(),
                            'Content-type': 'application/json',
                            'Referer': ""
                        },
                        onload: function (result)
                        {
                            var res = $.parseJSON(result.responseText);

                            if (res.status == false)
                            {
                                DisplayTheCheckedLinks([id], 'adead_link');
                                return;
                            }
                            if (res.status == true)
                            {
                                //var linkToolTips = res.title + '\n Host:' + res.host;
                                DisplayTheCheckedLinks([id], 'alive_link');
                            }

                        }
                    });
            }
        }

        function myfileisBulkCheck()
        {
            var arr = this.links[0].split("\r\n");
            var i = arr.length;

            while(i--)
            {
                postRequest(arr[i]);
            }

            function postRequest(myfileisLink)
            {

                var id = myfileisLink.match(/myfile\.(?:is|org)\/(?:p\/|)(\w+)/)[1];

                GM_xmlhttpRequest(
                    {
                        method: "GET",
                        url: 'https://api.myfile.is/v2/file/' + id + "/info",
                        headers: {
                            'User-agent': rUA(),
                            'Content-type': 'application/json',
                            'Referer': ""
                        },
                        onload: function (result)
                        {
                            var res = $.parseJSON(result.responseText);
                            if (res.status == false)
                            {
                                DisplayTheCheckedLinks([id], 'adead_link');
                                return;
                            }

                            if (res.status == true)
                            {
                                //var linkToolTips = res.title + '\n Host:' + res.host;
                                DisplayTheCheckedLinks([id], 'alive_link');
                            }
                        }
                    });
            }
        }

        function megauploadisBulkCheck()
        {
            var arr = this.links[0].split("\r\n");
            var i = arr.length;

            while(i--)
            {
                postRequest(arr[i]);
            }

            function postRequest(megauploadisLink)
            {

                var id = megauploadisLink.match(/megaupload\.is\/(\w+)/)[1];

                GM_xmlhttpRequest(
                    {
                        method: "GET",
                        url: 'https://api.megaupload.is/v2/file/' + id + "/info",
                        headers: {
                            'User-agent': rUA(),
                            'Content-type': 'application/json',
                            'Referer': ""
                        },
                        onload: function (result)
                        {
                            var res = $.parseJSON(result.responseText);
                            if (res.status == false)
                            {
                                DisplayTheCheckedLinks([id], 'adead_link');
                                return;
                            }

                            if (res.status == true)
                            {
                                //var linkToolTips = res.title + '\n Host:' + res.host;
                                DisplayTheCheckedLinks([id], 'alive_link');
                            }
                        }
                    });
            }
        }

        function vshareisBulkCheck()
        {
            var arr = this.links[0].split("\r\n");
            var i = arr.length;

            while(i--)
            {
                postRequest(arr[i]);
            }

            function postRequest(vshareisLink)
            {

                var id = vshareisLink.match(/vshare\.is\/(\w+)/)[1];

                GM_xmlhttpRequest(
                    {
                        method: "GET",
                        url: 'https://api.vshare.is/v2/file/' + id + "/info",
                        headers: {
                            'User-agent': rUA(),
                            'Content-type': 'application/json',
                            'Referer': ""
                        },
                        onload: function (result)
                        {
                            var res = $.parseJSON(result.responseText);
                            if (res.status == false)
                            {
                                DisplayTheCheckedLinks([id], 'adead_link');
                                return;
                            }

                            if (res.status == true)
                            {
                                //var linkToolTips = res.title + '\n Host:' + res.host;
                                DisplayTheCheckedLinks([id], 'alive_link');
                            }
                        }
                    });
            }
        }

        function bayfilesBulkCheck()
        {
            var arr = this.links[0].split("\r\n");
            var i = arr.length;

            while(i--)
            {
                postRequest(arr[i]);
            }

            function postRequest(bayfilesLink)
            {

                var id = bayfilesLink.match(/bayfiles\.(?:com|net)\/(?:p\/|)(\w+)/)[1];

                GM_xmlhttpRequest(
                    {
                        method: "GET",
                        url: 'https://api.bayfiles.com/v2/file/' + id + "/info",
                        headers: {
                            'User-agent': rUA(),
                            'Content-type': 'application/json',
                            'Referer': ""
                        },
                        onload: function (result)
                        {
                            var res = $.parseJSON(result.responseText);
                            if (res.status == false)
                            {
                                DisplayTheCheckedLinks([id], 'adead_link');
                                return;
                            }

                            if (res.status == true)
                            {
                                DisplayTheCheckedLinks([id], 'alive_link');
                            }
                        }
                    });
            }
        }

        function NitroFlareBulkCheck()
        {
            var arr = this.links[0].split("\r\n");
            var i = arr.length;

            while(i--)
            {
                postRequest(arr[i]);
            }

            function postRequest(nfLink)
            {
                var id = nfLink.match(/(?:nitroflare\.(?:com|net)|nitro\.download)\/view\/(\w+)(?:|\/)/)[1];
                GM_xmlhttpRequest(
                    {
                        method: "GET",
                        url: 'https://nitroflare.net/api/v2/getFileInfo?files=' + id,
                        headers: {
                            'User-agent': rUA(),
                            'Content-type': 'application/json',
                            'Referer': ""
                        },
                        onload: function (result)
                        {
                            var res = $.parseJSON(result.responseText);
                            if (res.result.files[id].status == "offline")
                            {
                                DisplayTheCheckedLinks([id], 'adead_link');
                                return;
                            }

                            if(res.result.files[id].premiumOnly ==true)
                            {
                                //var linkToolTips = res.result.files[id].name + '\n Premium Only:' + res.result.files[id].premiumOnly;
                                DisplayTheCheckedLinks([id], 'unava_link');
                                return;
                            }

                            if (res.result.files[id].status == "online")
                            {

                                DisplayTheCheckedLinks([id], 'alive_link');
                                return;
                            }
                        }
                    });
            }
        }

        function gofileccBulkCheck()
        {
            var arr = this.links[0].split("\r\n");
            var i = arr.length;

            while(i--)
            {
                postRequest(arr[i]);
            }

            function postRequest(gofileccLink)
            {
                var id = gofileccLink.match(/gofile\.cc\/(\w+)/)[1];

                GM_xmlhttpRequest(
                    {
                        method: "GET",
                        url: 'https://gofile.cc/api/v1/file/' + id + "/info",
                        headers: {
                            'User-agent': rUA(),
                            'Content-type': 'application/json',
                            'Referer': ""
                        },
                        onload: function (result)
                        {
                            var res = $.parseJSON(result.responseText);
                            if (res.status == false)
                            {
                                DisplayTheCheckedLinks([id], 'adead_link');
                                return;
                            }

                            if (res.status == true)
                            {
                                //var linkToolTips = res.title + '\n Host:' + res.host;
                                DisplayTheCheckedLinks([id], 'alive_link');
                            }
                        }
                    });
            }
        }

        function googleDriveBulkCheck()
        {
            var arr = this.links[0].split("\r\n");
            var i = arr.length;

            while(i--)
            {
                postRequest(arr[i]);
            }

            function postRequest(googleDriveLink)
            {
                debugger;
                var id = googleDriveLink.match(/drive\.google\.com\/file\/d\/([^\/]+)\/?/)[1];

                GM_xmlhttpRequest(
                    {
                        method: "GET",
                        url: 'https://drive.google.com/u/0/uc?id=' + id,
                        headers: {
                            'User-agent': rUA(),
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Referer': ""
                        },
                        onload: function (result)
                        {
                            var res = result.responseText;

                            if (res.contains('id="uc-download-link"'))
                            {
                                DisplayTheCheckedLinks([id], 'alive_link');
                                return;
                            }

                            if (res.contains ('<b>404.</b>'))
                            {
                                //var linkToolTips = res.title + '\n Host:' + res.host;
                                DisplayTheCheckedLinks([id], 'adead_link');
                                return;
                            }
                        }
                    });
            }
        }
    }

    function initFileHosts()
    {
        var aOHCount = "1";
        function addObsoleteHost(hostName, linkRegex)
        {
            hostName = hostName.split("|");
            var i = hostName.length;

            var hostID = "OH" + aOHCount;

            while(i--) {
                var filehost = gimmeHostName(hostName[i]).replace(/\./g, "_dot_").replace(/\-/g, "_dash_");
                if (!hostsIDs[filehost]) {
                    hostsIDs[filehost] = [];
                }
                hostsIDs[filehost].push({
                    hostID: hostID,
                    linkRegex: linkRegex,
                });
            }

            var OHObj = {
                links: []
            }

            hostsCheck[hostID] = OHObj;
            aOHCount++;
        }

        //obsolete file hosts init start
        if (hostSet("Obsolete_file_hosts", false))
        {
            addObsoleteHost("superfastfile.com", "superfastfile\\.com\/\\w+");
            addObsoleteHost("uploadlab.com", "files\\.uploadlab\\.com\/\\w+");
            addObsoleteHost("zupload.com", "z\\d+\\.zupload\\.com\/\\w+");
            addObsoleteHost("filesdump.com", "(?:s\\d+\\.|)filesdump\\.com\/file\/\\w+");
            addObsoleteHost("speedie-host.com", "uploads\\.speedie\\-host\\.com\/\\w+");
            addObsoleteHost("turboupload.com", "(?:d\\.|)turboupload\\.com\/\\w+");
            addObsoleteHost("share2u.net", "dl\\.share2u\\.net\/\\w+");
            addObsoleteHost("filestock.net|filestock.ru", "(?:download\\.)?filestock\\.(?:net|ru)\/\\w+");
            addObsoleteHost("ex.ua", "(?:fs\\d{1,2}\\.)?(?:www\\.|)ex\\.ua\/\\w+");
            addObsoleteHost("omxira.com", "(?:get\\.|)omxira\\.com\/\\w+");
            addObsoleteHost("uploadtornado.com", "(?:\\w{2}\\.)uploadtornado\\.com\/\\w+");
            addObsoleteHost("bgdox.com", "(?:turbo\\.)?bgdox\\.com\/\\w+");
            addObsoleteHost("fshare.eu", "www\\d?\\.fshare\\.eu\/\\w+");
            var i = allObsoleteNames.length;
            while(i--)
            {
                addObsoleteHost(
                    allObsoleteNames[i],
                    "https?:\/\/(?:[a-zA-Z0-9-]+\\.)?(?:" + allObsoleteNames[i].replace(/\./g, "\\.").replace(/\-/g, "\\-") + ")\/"
                );
            }

            if (WBB_MODE) {
                var x = wbbCensoredHosts.length;
                while (x--) {
                    addObsoleteHost(
                        wbbCensoredHosts[x],
                        "https?:\/\/(?:[a-zA-Z0-9-]+\\.)?(?:" + wbbCensoredHosts[x].replace(/\./g, "\\.").replace(/\-/g, "\\-") + ")\/"
                    );
                }
                addObsoleteHost("hellshare.com|hellshare.sk|hellshare.pl|hellshare.cz|hellshare.hu","(?:|download\\.(?:\\w{2}\\.|)|www\\.)hellshare\\.(?:\\w{2,3})\/[\\w-\\.]+");
            }
        }
        //obsolete file hosts init end
        var aFHCount = 1;
        function addFileHost(hostName, linkRegex, isAliveRegex, isDeadRegex, isUnavaRegex, tryLoop)
        {
            hostName = hostName.split("|");
            var i = hostName.length;

            var hostID = "WC" + aFHCount;

            while(i--) {
                var filehost = hostName[i].replace(/\./g, "_dot_").replace(/\-/g, "_dash_");

                if (!hostsIDs[filehost]) {
                    hostsIDs[filehost] = [];
                }
                hostsIDs[filehost].push({
                    hostID: hostID,
                    linkRegex: linkRegex,
                });
            }

            var WCObj = {
                liveRegex: isAliveRegex,
                deadRegex: isDeadRegex,
                unavaRegex: isUnavaRegex,
                tryLoop: false,
                links: []
            }

            if (tryLoop) WCObj.tryLoop = true;

            hostsCheck[hostID] = WCObj;
            aFHCount++;
        }

        var genericWC = [   'rabidfiles.com', 'box4up.com', 'upfile.vn', 'weshare.me',
                         'sv-esload.com'];

        var XFSPWC =     [     "xvidstage.com", "downloadani.me", "uppit.com|up.ht", 'toofile.com',
                          "tusfiles.net|tusfiles.com", "lafiles.com", "redbunker.net", 'happystreams.net'];

        var genThird =    [    "4bigbox.com", "skyfilebox.com"]

        var gWC = genericWC.length;
        while(gWC--) {
            if (hostSet("Check_" + genericWC[gWC].replace(/\./g, "_dot_").replace(/\-/g, "_dash_") + "_links", false))
            {
                addFileHost(
                    genericWC[gWC],
                    genericWC[gWC].replace(/\./g, "\\.").replace(/\-/g, "\\-") + "\/\\w+",
                    '$(\'.download-timer\').html("<a class=\'btn btn-|<a class="link btn-free"',
                    /<ul class='pageErrors'><li>(?:Datei wurde entfernt|File has been removed)/,
                    'optional--'
                );
            }
        }

        var xWC = XFSPWC.length;
        while (xWC--) {
            if (hostSet("Check_" + XFSPWC[xWC].match(/[\w\.\-]+/)[0].replace(/\./g, "_dot_").replace(/\-/g, "_dash_") + "_links", false))
            {
                addFileHost(
                    XFSPWC[xWC],
                    "(?:" + XFSPWC[xWC].replace(/\./g, "\\.").replace(/\-/g, "\\-") + ")\/\\w+",
                    'name="method_free"|id="btn_download"|value="Free Download"',
                    />(?:File not found|We're sorry, the file you are looking for could not be found.|The file was removed by administrator|Datei nicht gefunden|No such file|\s*The file you are trying to download is no longer available!\s*)\s*<|<div id="div_file" class="upload_block">/i,
                    '>This server is in maintenance mode|<img src="/images/under.gif"',
                    true);
            }
        }

        var tWC = genThird.length;
        while (tWC--) {
            if (hostSet("Check_" + genThird[tWC].match(/[\w\.\-]+/)[0].replace(/\./g, "_dot_").replace(/\-/g, "_dash_") + "_links", false))
            {
                addFileHost(
                    genThird[tWC],
                    "(?:" + genThird[tWC].replace(/\./g, "\\.").replace(/\-/g, "\\-") + ")\/newfile\\?n=\\w+",
                    '<div class="downloadfree">',
                    'div_file"',
                    'optional--'
                );
            }
        }


        // if (hostSet("Check_fastshare_dot_cz_links", false))
        // {
        //     addFileHost(
        //         "fastshare.cz",
        //         "fastshare\\.cz\/\\d+\/\\w*",
        //         'dwntable">|<div class="speed speed-low">',
        //         'Plik został usunięty na życzenie właściciela praw autorskich.|Tento súbor už nie je dostupný.|This file is no longer available.|Tento soubor již není dostupný.</p>|nebyla nalezena|nebola nájdená|nie została odnaleziona|color:red;font-weight:bold;border-style:dashed|<b>Requested page not found.',
        //         'optional--');
        // }

        /*if (hostSet("Check_1fichier_dot_com_links", false))
        {
            addFileHost(
            "1fichier.com",
            "\\w+\\.(?:1fichier)\\.com\/?",
            'value="Download"',
            'errorDiv"|File not found|Fichier introuvable',
            'optional--');
        }*/

        // if (hostSet("Check_rapidgator_dot_net_links", false) && chromeBrowser)
        // {
        //     addFileHost(
        //         "rapidgator.net|rg.to",
        //         "(?:rapidgator\\.net|rg.to)\/file\/\\w+",
        //         /btm" style="height: \d+px;">\s*<p/,
        //         '<h3>File not found</h3>|<span>Get the advantages of premium-account',
        //         'optional--',
        //         true
        //     );
        // }

        if (hostSet("Check_alfafile_dot_net_links", false) && chromeBrowser)
        {
            addFileHost(
                "alfafile.net",
                "alfafile\\.net\/file\/\\w+",
                'class="big_button big_button02"',
                'File not found!|Файл не найден|strong>404</strong>|Sorry, this page does not exist.',
                'optional--'
            );
        }

        if (hostSet("Check_drive_dot_google_dot_com_links", false) && chromeBrowser)
        {
            addFileHost(
                "google.com",
                "(?:drive\\.|)google.com\/drive\/\\w+",
                'content="!">|color:#2d2d2d|id="uc-download-link|class="drive-viewer-',
                '12pt; font-weight:|class="errorMessage"|F0F6FF|Error 404',
                'optional--'
            );
        }

//         if (hostSet("Check_relink_dot_us_links", false))
//         {
//             addFileHost(
//                 "relink.us",
//                 "relink\\.us\/(?:f\/\\w+|go\\.php\\?id=\\d+|view\\.php\\?id=\\d+)",
//                 'online_detail.png" alt="Status',
//                 /(?:offline|partially)_detail\.png" alt="Status|File deleted/,
//                 'unknown_detail.png" alt="Status'
//             );
//         }

        if (hostSet("Check_flyfiles_dot_net_links", false))
        {
            addFileHost(
                "flyfiles.net",
                "flyfiles\\.net\/\\w+",
                'download_button"|"Download file"',
                'File not found!|Файл не найден',
                'optional--'
            );
        }

        if (hostSet("Check_wikiupload_dot_com_links", false))
        {
            addFileHost(
                "wikiupload.com",
                "wikiupload\\.com\/\\w+",
                'download-button">',
                'Sorry, File not found|theme-container">',
                'optional--'
            );
        }

        if (hostSet("Check_hostuje_dot_net_links", false))
        {
            addFileHost(
                "hostuje.net",
                "hostuje\\.net\/file\\.php\\?id=\\w+",
                'file.php">|Pobierz Plik',
                'Podany plik zosta. skasowany z powodu naruszania praw autorskich...|Podany plik nie zosta. odnaleziony...',
                'optional--'
            );
        }

        if (hostSet("Check_krakenfiles_dot_com_links", false))
		{
			addFileHost(
                "krakenfiles.com",
                "krakenfiles\\.com\/\\w+",
			'download-now-text',
			'nk-error|File not found',
			'optional--'
			);

		}


        if (hostSet("Check_data_dot_hu_links", false))
        {
            addFileHost(
                "data.hu",
                "data\\.hu\/get\/\\d+\/",
                'download_box_button|<div class="slow_dl_cim">Lassú <span>letöltés</span></div>',
                'missing.php|<h1>Az adott fájl nem létezik</h1>',
                'optional--',
                true
            );
        }


        if (hostSet("Check_extmatrix_dot_com_links", false))
        {
            addFileHost(
                "extmatrix.com",
                "extmatrix\\.com\/files\/\\w+",
                'div class="success"',
                'div class="error"',
                'optional--'
            );
        }


        if (hostSet("Check_yourfilestore_dot_com_links", false))
        {
            addFileHost(
                "yourfilestore.com",
                "yourfilestore\\.com\/download\/\\d+\/",
                'download_data">',
                'may have been deleted|<h1>Sorry!</h1>',
                'optional--'
            );
        }

        if (hostSet("Check_filebig_dot_net_links", false))
        {
            addFileHost(
                "filebig.net",
                "filebig\\.net\/files\/\\w+",
                'downloadFile">',
                '<p>File not found</p>',
                'optional--'
            );
        }

        if (hostSet("Check_filefront_dot_com_links", false))
        {
            addFileHost(
                "filefront.com|gamefront.com",
                "(?:files\\.|\\w+\\.|)(?:file|game)front\\.com\/\\w+",
                'downloadLink">|class="downloadNow"|<strong>Download',
                /File not found, you|(?:File|Page) Not Found/,
                'unavailable at the moment'
            );
        }

//         if (hostSet("Check_filesin_dot_com_links", false))
//         {
//             addFileHost(
//                 "filesin.com",
//                 "filesin\\.com\/\\w+",
//                 'download_area">',
//                 'error_note">',
//                 'optional--',
//                 true
//             );
//         }

//         if (hostSet("Check_nowdownload_dot_eu_links", false))
//         {
//             addFileHost(
//                 "nowdownload.eu|nowdownload.ch|nowdownload.co",
//                 "nowdownload\\.(?:eu|ch|co)\/dl\/\\w+",
//                 'alert-success"',
//                 'This file does not exist!',
//                 'The file is being transfered'
//             );
//         }

//         if (hostSet("Check_axifile_dot_com_links", false))
//         {
//             addFileHost(
//                 "axfile.com",
//                 "axifile\\.com(?:\/\w(2))?\/\\??\\w+",
//                 'Dbutton_big"',
//                 'download-error.php',
//                 'optional--'
//             );
//         }

//         if (hostSet("Check_asfile_dot_com_links", false))
//         {
//             addFileHost(
//                 "asfile.com",
//                 "asfile\\.com\/file\/\\w+",
//                 'link_line">',
//                 /Page not found|(?:deleted|is not exist|gelöscht)<\/strong>/,
//                 'optional--'
//             );
//         }

//         if (hostSet("Check_movshare_dot_net_links", false))
//         {
//             addFileHost(
//                 "movshare.net",
//                 "movshare\\.net\/\\w+",
//                 'videoPlayer"',
//                 'no longer exists',
//                 'optional--'
//             );
//         }

//         if (hostSet("Check_uploadspace_dot_pl_links", false))
//         {
//             addFileHost(
//                 "uploadspace.pl",
//                 "uploadspace\.pl\/plik\\w+",
//                 /Downloading .+? \|/,
//                 'Downloading a file',
//                 'optional--'
//             );
//         }

        if (hostSet("Check_rghost_dot_net_links", false))
        {
            addFileHost(
                "rghost.net|rghost.ru",
                "rghost\.(?:net|ru)\/(?:|private\/)\\d+",
                'download_link|btn large download"',
                'file is restricted|File is deleted|503 Service Unavailable',
                'File was deleted'
            );
        }

        if (hostSet("Check_wbook_dot_ufile_dot_io_links", false))
        {
            addFileHost(
            "ufile.io",
            "wbook\\.ufile\\.io\/\\w+",
            'Download File|class="btn btn--lg slow-download-button free-download"',
            'File Removed',
            'optional--'
            );
        }

        if (hostSet("Check_xdisk_dot_cz_links", false))
        {
            addFileHost(
                "xdisk.cz",
                "xdisk\\.cz\/(?:..\/)?download\\.php\\?id=\\w+",
                /">Staženo:\\s*<\/span>/,
                'Soubor, který hledáte nenalezen',
                'optional--'
            );
        }


        if (hostSet("Check_daten_dash_hoster_dot_de_links", false))
        {
            addFileHost(
                "daten-hoster.de|filehosting.org|filehosting.at",
                "(?:daten-hoster\\.de|filehosting\\.(?:org|at))\/file\/\\w+",
                '<table class="table table-bordered',
                '<div class="alert alert-error',
                'optional--'
            );
        }

        if (hostSet("Check_filestore_dot_to_links", false))
        {
            addFileHost(
                "filestore.to",
                "filestore\.to\/\\?d=\\w+",
                '"downloading"',
                'Datei wurde nicht gefunden',
                'optional--'
            );
        }

//         if (hostSet("Check_yunfile_dot_com_links", false))
//         {
//             addFileHost(
//                 "yunfile.com|filemarkets.com|yfdisk.com",
//                 "(?:\\w+\\.)?(?:yunfile|filemarkets|yfdisk)\\.com\/f(?:ile|s)\/\\w+",
//                 /<h2 class="title">.+?&nbsp;(?:<a><\/a>)?&nbsp;.+?<\/h2>/,
//                 /<h2 class="title">.+?&nbsp;&nbsp;<\/h2>|Been deleted|> Access denied/,
//                 'optional--'
//             );
//         }

//         if (hostSet("Check_nitroflare_dot_com_links", false))
//         {
//             addFileHost(
//                 "nitroflare.com|nitroflare.net",
//                 "nitroflare\\.(?:com|net)\/view\/\\w+",
//                 '<button id="slow-download',
//                 'This file has been removed|File doesn\'t exist',
//                 'optional--'
//             );
//         }

//         if (hostSet("Check_filefreak_dot_com_links", false))
//         {
//             addFileHost(
//                 "filefreak.com",
//                 "filefreak\\.com\/(?:uploaded\/file\/id\/)?\\d+",
//                 '<div id="dl-high-first"',
//                 />[Nn]o such file/,
//                 'optional--',
//                 true);
//         }

        if (hostSet("Check_load_dot_to_links", false))
        {
            addFileHost(
                "load.to",
                '(?:www\\.|\/)load\\.to\/(?:|\\?d\\=)\\w+',
                'type="submit" value="Download"',
                'Can\'t find file|class="error-title">Error</span>',
                'optional--'
            );
        }

        /*if (hostSet("Check_files_dot_to_links", false))
        {
            addFileHost(
            "files.to",
            "files\.to\/get\/\\d+\/",
            'You requested the following',
            'requested file couldn|This download link is invalide.',
            'optional--'
            );
        }*/

        if (hostSet("Check_divshare_dot_com_links", false))
        {
            addFileHost(
                "divshare.com",
                "divshare\\.com\/download\/",
                'download_new.png',
                'have been removed',
                'optional--'
            );
        }

        if (hostSet("Check_files_dot_mail_dot_ru_links", false))
        {
            addFileHost(
                "mail.ru",
                'files\\.mail\\.ru/(?:\\w*)',
                'fileList',
                'errorMessage|error">',
                'optional--'
            );
        }

        if (hostSet("Check_narod_dot_ru_links", false))
        {
            addFileHost(
                "narod.ru|yandex.ru",
                'narod\\.(?:yandex\\.|)ru\/disk\/',
                '<a id="b-submit"',
                '<p class="b-download-virus-note"|headCode">404<',
                'Внутренняя ошибка сервиса'
            );
        }

        if (hostSet("Check_filesmonster_dot_com_links", false))
        {
            addFileHost(
                "filesmonster.com",
                "filesmonster\\.com\/download\\.php\\?id=\\w+",
                'button_green_body"',
                'error">',
                'optional--'
            );
        }

        if (hostSet("Check_sendspace_dot_com_links", false))
        {
            addFileHost(
                "sendspace.com",
                'sendspace\\.com\/file\/\\w+',
                'file_description',
                'msg error"',
                'optional--'
            );
        }



        if (hostSet("Check_gigasize_dot_com_links", false))
        {
            addFileHost(
                "gigasize.com",
                'gigasize\\.com\/get(?:\\.php(?:\/[\\d-]+|\\?d=\\w+)|\/\\w+)',
                'fileId"',
                'error">',
                'optional--'
            );
        }

        if (hostSet("Check_2shared_dot_com_links", false))
        {
            addFileHost(
                "2shared.com",
                '2shared\\.com\/(?:file|video|document)\/\\w*',
                'File size',
                'var msg = \'VGhlIGZpbGUgbGluayB0aGF0IHlvdSByZ',
                'optional--'
            );
        }

        if (hostSet("Check_gigapeta_dot_com_links", false))
        {
            addFileHost(
                "gigapeta.com",
                'gigapeta\\.com\/dl\/\\w+',
                'Download file|Скачать файл| Herunterzuladen|Scarica il file|Cargar el fichero|Charger le fichier|<table id="download">',
                '404|page_error',
                'optional--'
            );
        }

        if (hostSet("Check_veehd_dot_com_links", false))
        {
            addFileHost(
                "veehd.com",
                'veehd\.com\/video\/.*?',
                'No sound|Download video',
                'Featured Videos',
                'optional--'
            );
        }

        if (hostSet("Check_ifolder_dot_ru_links", false))
        {
            addFileHost(
                "ifolder.ru|rusfolder.com|rusfolder.net",
                '(?:ifolder\.ru|rusfolder\\.(?:com|net))\/\\d+',
                'file-info',
                'ui-state-error',
                'optional--'
            );
        }

        if (hostSet("Check_bittload_dot_com_links", false))
        {
            addFileHost(
                "bittload.com",
                'bittload\\.com\/\\w+',
                'Choose free or premium download',
                'File has been removed.',
                'optional--'
            );
        }

        if (hostSet("Check_fileswap_dot_com_links", false))
        {
            addFileHost(
                "fileswap.com",
                'fileswap\\.com\/dl\/\\w+',
                'dlslowbutton"',
                '<div class="rounded_block_error',
                'is temporary unavailable|disponible en estos momentos|vorläufig unerreichbar|Файл временно недоступен'
            );
        }

        if (hostSet("Check_solidfiles_dot_com_links", false))
        {
            addFileHost(
                "solidfiles.com",
                'solidfiles\\.com\/(?:d|v)\/\\w+',
                '<i class="fa fa-download"></i>|button type="submit" class="btn btn-primary btn-sm"',
                '<title>File not available - Solidfiles</title>|This file/folder could not be found.',
                'optional--'
            );
        }

        if (hostSet("Check_uloz_dot_to_links", false))
        {
            addFileHost(
                "uloz.to|ulozto.net|ulozto.cz|bagruj.cz|zachowajto.pl",
                "(?:uloz|ulozto|bagruj|zachowajto)\\.(to|net|cz|sk|net|pl)\/\\w",
                'fileDownload">|fileSize">|passwordProtectedFile">|Stáhnout pomalu zdarma</strong>|Slow download for free</strong>',
                'grayButton deletedFile">|Stránka nenalezena|upload-button"|jako soukromý.',
                'frmaskAgeForm-disagree',
                true
            );
        }

        if (hostSet("Check_leteckaposta_dot_cz_links", false))
        {
            addFileHost(
                "leteckaposta.cz|sharegadget.com",
                "(?:leteckaposta\\.cz|sharegadget\\.com)\/\\d+",
                '<body onload="">',
                'neexistuje|not exist',
                'optional--'
            );
        }


        if (hostSet("Check_mediafire_dot_com_links", false))
        {
            addFileHost(
                "mediafire.com",
                "mediafire\\.com\/(?:\\?|download(?:\\.php\\?|\/)|(?:file|view)\/)\\w+",
                'download_file_title"|<a class="btn alt download|<div class="filepreview|<div class="fileName">|<div class="dl-btn-cont">',
                'class="error_msg_title">|class="errorFileMissing-title"|>Sign Up! It\'s free|<label for="create-file-name">|<div id="privateTitle">This file is currently set to private.</div>',
                'optional--'
            );
        }

        if (hostSet("Check_ulozisko_dot_sk_links", false))
        {
            addFileHost(
                "ulozisko.sk",
                "ulozisko\\.sk\/\\w+",
                'Detaily',
                'neexistuje',
                'optional--'
            );
        }

        if (hostSet("files.fm", false))
        {
            addFileHost(
                "files.fm",
                "files.fm\/u\/\\w+",
                '<span>Download</span>',
                'The files in this link are deleted</h1>',
                'optional--'
            );
        }

        if (hostSet("Check_upnito_dot_sk_links", false))
        {
            addFileHost(
                "upnito.sk",
                "(?:dl.\\.|)upnito\\.sk\/(download|subor|file)",
                'download.php',
                'notfound|upload-suborov.php"',
                'optional--'
            );
        }

        //         if (hostSet("Check_myupload_dot_dk_links", false))
        //         {
        //             addFileHost(
        //             "myupload.dk",
        //             "myupload\\.dk\/showfile\/\\w+",
        //             '<td class="downloadTblRight"><a class="downloadLink"',
        //             '<div id="flash_upload_progress"|<td class="downloadTblRight">File has been removed',
        //             'optional--'
        //             );
        //         }

        if (hostSet("Check_filebeam_dot_com_links", false))
        {
            addFileHost(
                "filebeam.com|fbe.am",
                "(?:filebeam\\.com|fbe\\.am)\/\\w+",
                '<center>File Download Area</center>',
                '<center>Error:</center>',
                'optional--'
            );
        }

        if (hostSet("Check_upstore_dot_net_links", false))
        {
            addFileHost(
                "upstore.net|upsto.re",
                "(?:upsto\\.re|upstore.net)\/\\w+",
                '<ul class="features minus">|Download files from folder',
                '<span class="error">',
                'optional--'
            );
        }

        if (hostSet("Check_adrive_dot_com_links", false))
        {
            addFileHost(
                "adrive.com",
                "adrive\\.com\/public\/\\w+",
                'download should start',
                'no longer available publicly',
                'optional--'
            );
        }

        if (hostSet("Check_box_dot_com_links", false))
        {
            addFileHost(
                "box.com|box.net",
                "https?:\/\/(?:www\\.|)box\\.(?:com|net)\/(?:s|shared|public)\/\\w+",
                'id=\"download_button',
                '>Box \| 404|error_message_not_found',
                'optional--'
            );
        }

        if (hostSet("Check_zalil_dot_ru_links", false))
        {
            addFileHost(
                "zalil.ru",
                "zalil\\.ru\/\\d+",
                'optional--',
                'Файл не найден',
                'optional--'
            );
        }

        if (hostSet("Check_uploads_dot_bizhat_dot_com_links", false))
        {
            addFileHost(
                "bizhat.com",
                "uploads\\.bizhat\\.com\/file\/\\d+",
                'div id="dl">',
                'File not found',
                'optional--'
            );
        }

        if (hostSet("Check_mega_dash_myfile_dot_com_links", false))
        {
            addFileHost(
                "mega-myfile.com",
                "mega\\-myfile\\.com\/file\/\\d+\/\\w+",
                '<b>File name:</b>',
                'Your requested file is not found',
                'optional--'
            );
        }

        if (hostSet("Check_yourupload_dot_com_links", false))
        {
            addFileHost(
                "yourupload.com",
                "yourupload\\.com\/\\w+",
                'class="btn btn-success"',
                '404',
                'optional--'
            );
        }

        if (hostSet("Check_file_dash_upload_dot_net_links", false))
        {
            addFileHost(
                "file-upload.net",
                "(?:en\\.|)file\\-upload\\.net(?:\/en|)\/download\\-\\d+\/\\w+",
                'downbutton2.gif',
                'Datei existiert nicht!|File does not exist!',
                'optional--'
            );
        }

        if (hostSet("Check_upload_dot_ee_links", false))
        {
            addFileHost(
                'upload.ee',
                "upload\\.ee\/files\/\\d+\/\\w+",
                'id="d_l"|img src="images/dl_.png" width="154" height="32" border="0" name="dllink" alt="Lae fail alla!"',
                'There is no such file|File was deleted by user',
                'optional--'
            );
        }

        if (hostSet("Check_share4web_dot_com_links", false))
        {
            addFileHost(
                'share4web.com',
                "share4web\\.com\/get\/\\w+",
                'btn_red">',
                'Page Not Found|File not found',
                'optional--'
            );
        }

        if (hostSet("Check_limelinx_dot_com_links", false))
        {
            addFileHost(
                'limelinx.com',
                "limelinx\\.com\/\\w+",
                'icon-download-alt',
                '>Error - File Not Found<',
                'optional--'
            );
        }

        if (hostSet("Check_skydrive_dot_live_dot_com_links", false))
        {
            addFileHost(
                'live.com|sdrv.ms',
                "(?:skydrive\\.live\\.com|sdrv\\.ms)\/\\w+",
                'Download file',
                'no longer available</h1>',
                'optional--'
            );
        }

        if (hostSet("Check_yourfiles_dot_to_links", false))
        {
            addFileHost(
                'yourfiles.to',
                "yourfiles\\.to\/\\?d=\\w+",
                'Download-Link: </strong>',
                'Die angefragte Datei wurde nicht gefunden',
                'optional--'
            );
        }

        if (hostSet("Check_filedropper_dot_com_links", false))
        {
            addFileHost(
                'filedropper.com|filesavr.com',
                "(?:filedropper|filesavr)\\.com\/\\w+",
                'download"',
                'steps.png',
                'optional--',
                true);
        }

        if (hostSet("Check_filehost_dot_ro_links", false))
        {
            addFileHost(
                'filehost.ro',
                "filehost\\.ro\/\\w+",
                'Apasati aici pentru a porni download-ul"',
                'Acest fisier nu exista in baza de date',
                'optional--'
            );
        }

        if (hostSet("Check_userscloud_dot_com_links", false))
        {
            addFileHost(
                'userscloud.com',
                "userscloud\\.com\/\\w+",
                '<b>Download<\/b>',
                'The file you are trying to download is no longer available',
                'optional--'
            );
        }

        if (hostSet("Check_dosya_dot_tc_links", false))
        {
            addFileHost(
                'dosya.tc',
                "dosya\\.tc\/server\\d*\/\\w+",
                'id="dl"',
                'Dosya bulunamad',
                'optional--'
            );
        }

        if (hostSet("Check_exfile_dot_ru_links", false))
        {
            addFileHost(
                'exfile.ru',
                "exfile\\.ru\/\\d+",
                'id="link"><a href="/download/',
                'class="align_left"><p class="red"',
                'optional--'
            );
        }

        if (hostSet("Check_fileshare_dot_ro_links", false))
        {
            addFileHost(
                'fileshare.ro',
                "fileshare\\.ro\/\\w+",
                'DOWNLOAD NOW',
                'Acest fisier nu exista.',
                'optional--'
            );
        }

        if (hostSet("Check_fshare_dot_vn_links", false))
        {
            addFileHost(
                'fshare.vn',
                "fshare\\.vn\/file\/\\w+",
                'optional--',
                'Liên kết bạn chọn không tồn tại trên hệ thống Fshare',
                'optional--'
            );
        }

        if (hostSet("Check_wikifortio_dot_com_links", false))
        {
            addFileHost(
                'wikifortio.com',
                "wikifortio\\.com\/\\w+",
                'screenbutton">',
                "not found on node|doesn't exist or has expired and is no longer available",
                'optional--'
            );
        }

        if (hostSet("Check_wyslijto_dot_pl_links", false))
        {
            addFileHost(
                'wyslijto.pl',
                "wyslijto\\.pl\/(?:files\/download|plik)\/\\w+",
                'optional--',
                /zosta. usuni.ty/,
                'optional--'
            );
        }

        if (hostSet("Check_kiwi6_dot_com_links", false))
        {
            addFileHost(
                'kiwi6.com',
                "kiwi6\\.com\/file\/\\w+",
                'download-link"',
                'Upload not found',
                'optional--'
            );
        }

        if (hostSet("Check_localhostr_dot_com_links", false))
        {
            addFileHost(
                'localhostr.com|lh.rs|hostr.co',
                "(?:localhostr\\.com\/file|lh\\.rs|hostr\\.co\/download)\/\\w+",
                'download-button',
                'fourohfour">',
                'optional--'
            );
        }

        if (hostSet("Check_remixshare_dot_com_links", false))
        {
            addFileHost(
                'remixshare.com',
                "remixshare\\.com\/(?:dl|download)\/\\w+",
                'linkContainerDiv"',
                'Sorry, die Datei konnte nicht gefunden werden.|Die angeforderte Datei steht nicht mehr zur Verfügung.',
                'optional--'
            );
        }

        if (hostSet("Check_hidemyass_dot_com_links", false))
        {
            addFileHost(
                'hidemyass.com',
                "hidemyass\\.com\/files\/\\w+",
                'dlbutton"',
                'genericerrorbox">',
                'optional--'
            );
        }

        if (hostSet("Check_tinyupload_dot_com_links", false))
        {
            addFileHost(
                'tinyupload.com',
                "s\\d+\\.tinyupload\\.com\/(?:index\\.php)?\\?file_id=\\d+",
                'Download file</h3>',
                'File was deleted from server.',
                'optional--'
            );
        }

        if (hostSet("Check_gigabase_dot_com_links", false))
        {
            addFileHost(
                'gigabase.com',
                "gigabase\\.com\/getfile\/\\w+",
                '/img/but_dnld_regular.jpg|gigaBtn std">',
                /<div class="all" id="Page404"|(?:File|Page) Not Found/,
                'optional--'
            );
        }

        if (hostSet("Check_trainbit_dot_com_links", false))
        {
            addFileHost(
                'trainbit.com',
                "trainbit\\.com\/files\/\\w+",
                'download"',
                'file not found',
                'optional--'
            );
        }

        if (hostSet("Check_hyperfileshare_dot_com_links", false))
        {
            addFileHost(
                'hyperfileshare.com',
                "hyperfileshare\\.com\/d\/\\w+",
                '/img/download_btm_site.gif',
                'Download URL is incorrect or your file has already been deleted!',
                'optional--'
            );
        }

        if (hostSet("Check_cloud_dash_up_dot_be_links", false))
        {
            addFileHost(
                'cloud-up.be',
                "(?:download\\.)?cloud\\-up\\.be\/download\\.php\\?file=\\w+",
                'download file',
                'This file does not exist!',
                'optional--'
            );
        }

        if (hostSet("Check_uploadc_dot_com_links", false)) //Do not use bulkcheck, false reports
        {
            addFileHost(
                'uploadc.com|zalaa.com',
                "(?:uploadc|zalaa)\\.com\/\\w+",
                'Slow access"',
                'File Not Found|file has been removed',
                'optional--'
            );
        }

        if (hostSet("Check_fastupload_dot_ro_links", false))
        {
            addFileHost(
                'fastupload.ro|rol.ro',
                "fastupload\\.(?:rol\\.)?ro\/\\w+",
                'isAliveRegex',
                'Fişierele nu mai sunt active!',
                'optional--'
            );
        }

        if (hostSet("Check_howfile_dot_com_links", false))
        {
            addFileHost(
                'howfile.com',
                "howfile\\.com\/file\/\\w+",
                'btn1"',
                'File not found',
                'optional--'
            );
        }

        if (hostSet("Check_free_dot_fr_links", false))
        {
            addFileHost(
                'free.fr',
                "dl\\.free\\.fr\/(?:getfile\\.pl\\?file=\/?|)\\w+",
                'Valider et t&eacute;l&eacute;charger le fichier',
                'Fichier inexistant',
                'optional--'
            );
        }

        if (hostSet("Check_file4go_dot_com_links", false))
        {
            addFileHost(
                'file4go.com',
                "file4go\\.com\/d\/\\w+",
                'gerarlinkdownload"',
                'REMOVIDO POR <b>DMCA|FILE REMOVED DMCA<|>FILE4GO 404 ARQUIVO',
                'optional--'
            );
        }

        if (hostSet("Check_sendfile_dot_su_links", false))
        {
            addFileHost(
                'sendfile.su',
                "sendfile\\.su\/\\w+",
                'download_click"',
                'Файл не найден',
                'optional--'
            );
        }

        if (hostSet("Check_anonfiles_dot_com_links", false))
        {
            addFileHost(
                'anonfiles.com',
                "anonfiles\\.com\/file\/\\w+",
                'download_button"',
                'File not found',
                'optional--'
            );
        }

        if (hostSet("Check_divxstage_dot_eu_links", false))
        {
            addFileHost(
                'divxstage.eu|divxstage.net',
                "divxstage\\.(?:eu|net)\/video\/\\w+",
                '>Download the video<',
                '>This file no longer exists on our servers.<',
                'optional--'
            );
        }

        if (hostSet("Check_herosh_dot_com_links", false))
        {
            addFileHost(
                'herosh.com',
                "herosh\\.com\/download\/\\d+\/\\w+",
                'green">Download',
                'file not found',
                'optional--'
            );
        }

        if (hostSet("Check_m5zn_dot_com_links", false))
        {
            addFileHost(
                'm5zn.com',
                "m5zn\\.com\/d\/\\?\\d+",
                'free_account">',
                'عذرا انتهت صلاحية الملف المطلوب ولايمكنك تحميله حاليا',
                'optional--'
            );
        }

        if (hostSet("Check_bin_dot_ge_links", false))
        {
            addFileHost(
                'bin.ge',
                "bin\\.ge\/dl\/\\w+",
                'captchacode">',
                'No file found',
                'optional--'
            );
        }

        if (hostSet("Check_nowvideo_dot_eu_links", false))
        {
            addFileHost(
                'nowvideo.eu|nowvideo.sx',
                "nowvideo\\.(?:sx|eu)\/video\/\\w+",
                '>Download this video!<',
                '>This file no longer exists on our servers',
                'optional--'
            );
        }

        if (hostSet("Check_shareplace_dot_com_links", false))
        {
            addFileHost(
                'shareplace.com',
                "shareplace\\.com\/(?:index1\\.php\\?a=|\\?)",
                'wait">',
                'Your requested file is not found',
                'optional--'
            );
        }

        if (hostSet("Check_terafiles_dot_net_links", false))
        {
            addFileHost(
                'terafiles.net',
                "terafiles\\.net\/v\\-\\d+",
                'download file',
                'Le fichier que vous souhaitez télécharger n\'est plus disponible sur nos serveurs.',
                'optional--'
            );
        }

        if (hostSet("Check_uploadmb_dot_com_links", false))
        {
            addFileHost(
                'uploadmb.com',
                "uploadmb\\.com\/dw\\.php\\?id=\\w+",
                'wait">',
                'The file you are requesting to download is not available',
                'optional--'
            );
        }

        if (hostSet("Check_yourfilelink_dot_com_links", false))
        {
            addFileHost(
                'yourfilelink.com',
                "yourfilelink\\.com\/get\\.php\\?fid=\\d+",
                'optional--',
                'File not found.</div>',
                'optional--'
            );
        }

        if (hostSet("Check_dropbox_dot_com_links", false)) //shared links
        {
            addFileHost(
                'dropbox.com',
                "dropbox\\.com\/sh?\/\\w+",
                'default_content_download_button" class="freshbutton-blue">',
                '>Nothing Here<|>Error (404)<|>Restricted Content|>Access to this link has been disabled.|The file you\'re looking for has been moved or deleted.',
                />Error \(509\)</
            );
        }

        if (hostSet("Check_wikisend_dot_com_links", false))
        {
            addFileHost(
                'wikisend.com',
                "wikisend\\.com\/download\/\\d+",
                'button_download.gif" alt="Download file',
                'File not found',
                'optional--'
            );
        }

        if (hostSet("Check_demo_dot_ovh_dot_eu_links", false))
        {
            addFileHost(
                'ovh.eu',
                "demo\\.ovh\\.eu\/(?:en|de)\/\\w+",
                'download.gif"',
                'p_point">',
                'optional--'
            );
        }

        if (hostSet("Check_maherfile_dot_com_links", false))
        {
            addFileHost(
                'maherfire.com',
                "maherfire\\.com\/\\?d=\\w+",
                '<input type="button" onclick="startDownload();"',
                '>Your requested file is not found',
                'optional--'
            );
        }

        if (hostSet("Check_droidbin_dot_com_links", false))
        {
            addFileHost(
                'droidbin.com|apkhosting.com',
                "(?:droidbin\\.com|apkhosting.com)\/\\w+",
                'optional--',
                '>That\'s a 404<|<li>File has been removed by the site administrator.</li>',
                'optional--'
            );
        }

        if (hostSet("Check_filefactory_dot_com_links", false) && !genset("Filefactory_API_Check", false))
        {
            addFileHost(
                'filefactory.com',
                "filefactory\\.com\/\\w+",
                'folderFileList">|src="/wp/img/icon-cloud.svg"|icon-cloud|<tr id=|div id="file_holder"|id="download-free"|danger countdown|id="file_name"|id="file-download-free-icon-title"',
                'src="/wp/img/icon-error.svg" alt="Invalid Download Link"|src="/wp/img/icon-error.svg" alt="File Removed"',
                'alt="Server Load Too High"'
            );
        }

        if (hostSet("Check_Rapidgator_dot_net_links", false) && !genset("Rapidgator_API_Check", false))
        {
            addFileHost(
                "rapidgator.net|rg.to",
                "(?:rapidgator\\.net|rg.to)\/file\/\\w+",
                '/download/AjaxStartTimer|Delay between downloads|reached your daily downloads limit|not more than 1 file at a time|download more than 1 file at a time|your hourly downloads limit|почасовой лимит скачиваний|limite horaire de téléchargements|límite de descargas en una hora|Im kostenlosen Modus können Sie immer nur 1 Datei herunterladen.|In de gratis modus kunt u maar 1 bestand tegelijk downloaden.',
                'Error 404|Fil ikke fundet|Ficheiro não encontrado|Arquivo não encontrado|找不到檔案|ファイルが見つかりませんでした|未发现文件|Soubor nenalezen|Bestand niet gevonden|Nie znaleziono pliku|File non trovato|Datei nicht gefunden|File not found|Error 500|Файл не найден|ファイルが探せませんでした|Fichier non trouvé|Archivo no encontrado|Select your plan|Fichier introuvable|File not found',
                'optional--',
                true
            );
        }

        if (hostSet("Check_moevideo_dot_net_links", false))
        {
            addFileHost(
                'moevideo.net',
                "moevideo\\.net\/video\/\\d+\\.\\w+",
                />Download\s*video</,
                '>Video not found<',
                'optional--'
            );
        }

        if (hostSet("Check_shared_dot_com_links", false))
        {
            addFileHost(
                'shared.com',
                "shared\\.com\/\\w+",
                /<div class="attachment\-icon">\n\s*<a href="https?:\/\/(?:dl|\d+\.ss)\.shared\.com\/\w+/,
                'optional--',
                'optional--'
            );
        }

        if (hostSet("Check_filepi_dot_com_links", false))
        {
            addFileHost(
                'filepi.com',
                "filepi\\.com\/\\w+",
                '<button class="submit" id="button_start"',
                '<div id="big_title">File not found or deleted :(',
                'optional--'
            );
        }

        if (hostSet("Check_2downloadz_dot_com_links", false))
        {
            addFileHost(
                '2downloadz.com',
                "2downloadz\\.com\/\\w+",
                '<div title="Slow Download"',
                '>File not found<',
                'optional--'
            );
        }

        if (hostSet("Check_tropicshare_dot_com_links", false))
        {
            addFileHost(
                'tropicshare.com',
                "tropicshare\\.com\/files\/\\d+",
                '"free-download">FREE<br/>',
                '>FNF<',
                'optional--'
            );
        }

        if (hostSet("Check_mystore_dot_to_links", false))
        {
            addFileHost(
                'mystore.to',
                "mystore\\.to\/dl\/\\w+",
                /<button wert="\w+">Download File</,
                '>file not found<', //?
                'optional--'
            );
        }

        if (hostSet("Check_putcker_dot_com_links", false))
        {
            addFileHost(
                'putcker.com',
                "putcker\\.com\/.+",
                '<div class="downloadfree">',
                'div_file"',
                'optional--'
            );
        }

        if (hostSet("Check_turtleshare_dot_com_links", false))
        {
            addFileHost(
                'turtleshare.com',
                "turtleshare\\.com\/download\/\\w+",
                /<div style=".+" id="download_link">Preparing Download/,
                'We do not know this file.',
                'optional--'
            );
        }

        if (hostSet("Check_flashx_dot_tv_links", false))
        {
            addFileHost(
                'flashx.tv',
                "flashx\\.tv\/video\/\\w+",
                /<iframe width="\d+" height="\d+" src="http:\/\/play\.flashx\.tv\/player\/embed\.php/,
                '>File not found<', //?
                'optional--'
            );
        }

        if (hostSet("Check_fileim_dot_com_links", false))
        {
            addFileHost(
                'fileim.com',
                "fileim\\.com\/file\/\\w+",
                '<a id="freedown"',
                '>Not Found<',
                'optional--'
            );
        }

        if (hostSet("Check_socifiles_dot_com_links", false))
        {
            addFileHost(
                'socifiles.com',
                "socifiles\\.com\/d\/\\w+",
                '<h1 class="file-link"',
                'something something darkside', //?
                'optional--'
            );
        }

        if (hostSet("Check_file4u_dot_pl_links", false))
        {
            addFileHost(
                'file4u.pl',
                'file4u\\.pl\/download\/\\d+',
                />Zwyk.y U.ytkownik<\/button>/,
                />\s*Plik kt.ry pr.bujesz pobra./,
                'optional--'
            );
        }

        if (hostSet("Check_kie_dot_nu_links", false))
        {
            addFileHost(
                'kie.nu',
                'kie\\.nu\/\\w+',
                '<input type="submit" value="download" id="submit-dl" />',
                '404 NOT FOUND',
                'optional--'
            );
        }

        if (hostSet("Check_file-space_dot_org_links", false))
        {
            addFileHost(
                'file-space.org',
                'file\\-space\\.org\/files\/get\/[a-z0-9-]+',
                '<a href="#" onclick="javascript:gotofree();"',
                'nothingyet',
                'optional--'
            );
        }

        if (hostSet("Check_uploadizer_dot_net_links", false))
        {
            addFileHost(
                'uploadizer.net',
                'uploadizer\\.net\/\\?d=\\d+',
                '<input type="button" onclick="startDownload();"',
                '<div class="error">Your requested file is not found',
                'optional--'
            );
        }

        if (hostSet("Check_video_dot_tt_links", false))
        {
            addFileHost(
                'video.tt',
                'video\\.tt\/video\/\\w+',
                '<div class="video_player" id="videoPlayer">',
                '<font size="5">This video is no longer available</font>',
                'optional--'
            );
        }

        if (hostSet("Check_hightail_dot_com_links", false))
        {
            addFileHost(
                'hightail.com|yousendit.com',
                '(?:hightail|yousendit)\\.com\/download\/\\w+',
                '<a id="saveToDesktop" class="btn-save hightailWhite"',
                'deadregex',
                'optional--'
            );
        }

        if (hostSet("Check_edisk_dot_cz_links", false))
        {
            addFileHost(
                'edisk.cz|edisk.sk|edisk.eu',
                '(?:(?:muj|data)\\d*\\.|)edisk\\.(?:cz|sk|eu)\/(?:|(?:cz|sk|en|pl))',
                'stáhnout pomalu|fa-download',
                'Tento soubor již neexistuje z následujích důvodů',
                'optional--',
            );
        }

        if (hostSet("Check_seacloud_dot_cc_links", false))
        {
            addFileHost(
                'seacloud.cc',
                'seacloud\\.cc\/d\/\\w+\/files\/\\?p=.+',
                '<a href="/repo/',
                '>>ToBeAdded--',
                'optional--'
            );
        }

        if (hostSet("Check_dropjiffy_dot_com_links", false))
        {
            addFileHost(
                'dropjiffy.com',
                'dropjiffy\\.com\/f\/\\w+',
                '>Start Download</a>',
                '<div class="expiredtext">',
                'optional--'
            );
        }

        if (hostSet("Check_quickshare_dot_cz_links", false))
        {
            addFileHost(
                'quickshare.cz',
                'quickshare\\.cz\/stahnout-soubor\/\\d+',
                ':void(0)" onclick="stahnoutSoubor()">',
                '<small>error 404</small>|<h1>Chyba! Vámi zadaný soubor neexistuje.</h1>',
                'optional--'
            );
        }

        if (hostSet("Check_tempfiles_dot_net_links", false))
        {
            addFileHost(
                'tempfiles.net',
                'tempfiles\\.net\/download\/\\d+',
                '>>ToBeAdded',
                '>File not found!<',
                'optional--'
            );
        }

        if (hostSet("Check_lilfile_dot_com_links", false))
        {
            addFileHost(
                "lilfile.com",
                "lilfile\.com\/\\w+",
                'content="Download',
                'File Not Available|nofile_thumb',
                'optional--',
            );
        }

        if (hostSet("Check_thaicyberupload_dot_com_links", false))
        {
            addFileHost(
                'thaicyberupload.com',
                'thaicyberupload\\.com\/get\/\\w+',
                '>>TOBEADDED!',
                '<form method="post" enctype="multipart/form-data" id="frmupload"',
                'optional--'
            );
        }

        if (hostSet("Check_linkz_dot_ge_links", false))
        {
            addFileHost(
                'linkz.ge',
                'linkz\\.ge\/file\/\\d+',
                '>>ToBeAdded',
                'No file found',
                'optional--'
            );
        }

        if (hostSet("Check_sdilej_dot_cz_links", false))
        {
            addFileHost(
                'sdilej.cz',
                'sdilej\\.cz\/\\w+',
                'Stáhnout FREE|Stáhnout pomalu zdarma',
                'czshare.com|sponsored listings|This domain is for sale|not found|Tento soubor byl smazán|Taková složka neexistuje',
                'optional--',
            );
        }


        if (hostSet("Check_upload2box_dot_com_links", false))
        {
            addFileHost(
                'upload2box.com',
                'upload2box\\.com\/files\/\\w+',
                '<input type="button" value="Free Download" id="dlbutton"',
                '>>ToBeAdded',
                'optional--'
            );
        }

        //if (hostSet("Check_safelinking_dot_net_links", false))
        //{
        //	addFileHost(
        //	'safelinking.net',
        //	"safelinking\\.net\/(?:p\/|)\\w+",
        //	'color:green;|ONLINE',
        //	'class="label ng-binding label-danger"|color:red;|This link does not exist.',
        //	'class="label ng-binding label-inverse"|NOT YET CHECKED|optional--',
        //	true);
        //}


        // if (hostSet("Check_kprotector_dot_com_links", false))
        // {
        //     addFileHost(
        //         'kprotector.com',
        //         "kprotector.\\.com\\/p\\d{1,3}/\\w{10}",
        //         'color:green;"',
        //         'color:red;"|<p>This link does not exist.',
        //         'optional--',
        //         true);
        // }

        //         if (hostSet("Check_fileboom_dot_me_links", false)) {
        //             addFileHost(
        //             'fboom.me|fileboom.me',
        //             'f(?:ile|)boom\\.me\/file\/[a-zA-Z0-9]{13}',
        //             '<a id="download-free" href="#"|>Premium download</button>', //last part is for premium users only
        //             'This file is no longer available',
        //             'optional--');
        //         }

        //         if (hostSet("Check_filesupload_dot_org_links", false))
        //         {
        //             addFileHost(
        //             'filesupload.org',
        //             'filesupload\\.org\/\\w+',
        //             '>unlock download</a>|<a href="/download-or-watch/',
        //             '<title>File not found|<div class="heading-1">Error<\/div>',
        //             'optional--');
        //         }

        if (hostSet("Check_uplooad_dot_net_links", false)) //has API but doesn't work properly
        {
            addFileHost(
                'uplooad.net',
                'uplooad\\.net\/file\/[A-Z0-9]{8}\/#!.+',
                '<i class="fa fa-download fa-lg">',
                '<div class="alert alert-danger"><strong>Error ! </strong>This file has been deleted',
                'optional--');
        }


        if (hostSet("Check_streamwire_dot_net_links", false)) //has API but doesn't work properly
        {
            addFileHost(
                'streamwire.net',
                'streamwire\\.net\/\\w+',
                'id="play_limit_box"',
                'File not found',
                'optional--');
        }

        if (hostSet("Check_uploadbuzz_dot_cc_links", false)) //has API but doesn't work properly
        {
            addFileHost(
                'uploadbuzz.cc',
                'uploadbuzz\\.cc\/[a-zA-Z0-9]+',
                'name="method_free',
                'File Not Found',
                'optional--');
        }

        if (hostSet("Check_dbupload_dot_co_links", false)) //has API but doesn't work properly
        {
            addFileHost(
                'dbupload.co',
                'dbupload\\.co\/[a-zA-Z0-9]+',
                'name="method_free',
                'File Not Found',
                'optional--');
        }



        // if (hostSet("Check_snowfiles_dot_com_links", false)) //has API but doesn't work properly
        // {
        //     addFileHost(
        //         'snowfiles.com',
        //         'snowfiles\\.com\/[a-zA-Z0-9]+',
        //         'name="method_free',
        //         'File Not Found',
        //         'optional--');
        // }

        if (hostSet("Check_clicknupload_dot_org_links", false)) //has linkchecker API but doesn't work properly
        {
            addFileHost(
                'clicknupload.org|clicknupload.co|clicknupload.to|clicknupload.club|clicknupload.cc|clicknupload.red||clicknupload.click|clicknupload.site|clicknupload.xyz|clicknupload.vip|clickndownload.org|clicknupload.online|clicknupload.download',
                '(?:clicknupload\.(?:org|club|(?:co|cc)|(?:to|red)|(?:click|site)|(?:xyz|online)|(?:download|vip))|clickndownload\.org)\/[a-zA-Z0-9]+',
                'name="method_free',
                'File Not Found',
                'optional--');
        }

        if (hostSet("Check_dbree_dot_co_links", false)) //has API but doesn't work properly
        {
            addFileHost(
                'dbree.co',
                'dbree\\.co\/\\w+',
                'class="download-timer"',
                'File Not Found',
                'optional--');
        }


        if (hostSet("Check_fileup_dot_cc_links", false))
        {
            addFileHost(
                'fileup.cc',
                'fileup\\.cc\/\\w+',
                'id="method_free"',
                'File Not Found',
                'optional--');
        }

        if (hostSet("Check_hotlink_dot_cc_links", false))
        {
            addFileHost(
                'hotlink.cc',
                'hotlink\\.cc\/\\w+',
                'id="pricing"',
                'File Not Found',
                'optional--');
        }

        if (hostSet("Check_mixloads_dot_com_links", false)) //has API but doesn't work properly
        {
            addFileHost(
                'mixloads.com',
                'mixloads\\.com\/\\w+',
                'class="download_method"',
                'class="title mb-2">File Not Found',
                'optional--');
        }

//         if (hostSet("Check_letsupload_dot_co_links", false)) //has API but doesn't work properly
//         {
//             addFileHost(
//                 'letsupload.co',
//                 'letsupload\\.co\/\\w+',
//                 'class="mngez_download1"',
//                 'File Not Found',
//                 'optional--');
//         }

        // if (hostSet("Check_anonfile_dot_com_links", false))
        // {
        //     addFileHost(
        //         'anonfile.com',
        //         'anonfile\\.com\/\\w+',
        //         'type="button" id="download-url"',
        //         'id="error-container"',
        //         'optional--');
        // }

        // if (hostSet("Check_katfile_dot_com_links", false))
        // {
        //     addFileHost(
        //         'katfile.com',
        //         'katfile\\.com\/\\w+',
        //         'id="method_free|id="fsize" style="color:#555;"|SLOW SPEED DOWNLOAD',
        //         'images/file_not_found.png"|images/404.png|images/404-remove.png"|File Not Found|alt="File has been removed"',
        //         'optional--');
        // }

        if (hostSet("Check_ddl_dot_to_links", false))
        {
            addFileHost(
                'ddl.to|ddownload.com',
                '(?:ddl\\.to|ddownload\\.com)\/\\w+',
                'name="method_free"',
                'File Not Found| This file was banned by copyright owner\'s report',
                'optional--');
        }

        if (hostSet("Check_uploadev_dot_org_links", false)) //has API but doesn't work properly
        {
            addFileHost(
                'uploadev.org',
                'uploadev\\.org\/\\w+',
                'value="download1"',
                'File Not Found',
                'optional--');
        }

        if (hostSet("Check_uploadgig_dot_com_links", false)) //has API but doesn't work properly
        {
            addFileHost(
                'uploadgig.com',
                'uploadgig\\.com\/\\w+',
                '<small>Download File:',
                'File Not Found',
                'optional--');
        }

        if (hostSet("Check_mexa_dot_sh_links", false))
        {

            addFileHost(
                'mexa.sh|mx-sh.net',
                '(?:mexa\\.sh|mx-sh.net)\/\\w+',
                'method_free',
                '404 Error|15px;border-radius:15px">|<div style="text-align:left;width:550px">|/images/error.png"|>File Not Found<',
                'optional--');
        }

        if (hostSet("Check_filerio_dot_in_links", false))
        {
            addFileHost(
                'filerio.in',
                'filerio\\.in\/\\w+',
                'method_free',
                'File Not Found',
                'optional--');
        }

        if (hostSet("Check_uploadever_dot_com_links", false))
        {
            addFileHost(
                'uploadever.com',
                'uploadever\\.com\/\\w+',
                'id="downloadbtn',
                'File Not Found',
                'optional--');
        }

        if (hostSet("Check_uploadrive_dot_com_links", false))
        {
            addFileHost(
                'uploadrive.com',
                'uploadrive\\.com\/\\w+',
                'id="downloadbtn',
                'File Not Found',
                'optional--');
        }

        if (hostSet("Check_uploadbaz_dot_me_links", false))
        {
            addFileHost(
                'uploadbaz.me|uploadbaz.net',
                'uploadbaz\\.me\/\\w+',
                'id="downloadbtn',
                'File Not Found',
                'optional--');
        }

        //         if (hostSet("Check_sendit_dot_cloud_links", false)) //has API but doesn't work properly
        //         {
        //             addFileHost(
        //             'sendit.cloud',
        //             'sendit\\.cloud\/[a-zA-Z0-9]+',
        // 			'name="method_free"',
        // 			'File Not Found',
        //             'optional--');
        //         }

        if (hostSet("Check_1fichier_dot_com_links", false)) //has API but doesn't work properly
        {
            addFileHost(
                '1fichier.com',
                '1fichier\\.com\/\\?\\w+',
                'Download tag"|countdown">|class="form-button"|<input type="submit" value="Download"|Download without SSL encryption',
                'errorDiv"|File not found|Fichier introuvable|The requested ressource does not exist !',
                'optional--');
        }

        if (hostSet("Check_dbree_dot_org_links", false)) //has API but doesn't work properly
        {
            addFileHost(
                'dbree.org',
                'dbree\\.org\/[a-zA-Z]\/\\w+',
                'Download</a>',
                'errorDiv"|File not found|Fichier introuvable',
                'optional--');
        }

        if (hostSet("Check_megaup_dot_net_files", false))
        {
            addFileHost(
                'megaup.net',
                'megaup\\.net\/[a-zA-Z0-9]+',
                'class="download-timer" style=',
                'class="heading-1">Error|HTTP ERROR 404|File has been removed due to inactivity.',
                'optional--');
        }

        if (hostSet("Check_uptobox_dot_com_links", false))
        {
            addFileHost(
                'uptobox.com',
                'uptobox\\.com\/\\w+',
                'data-remaining-time=|Cliquez-ici pour lancer votre téléchargement|Click here to start your download|Create Download Link">|Lien de téléchargement|1px solid #AEAEAE|class="grey_link|id="btn_download|name="method_free"|value="Free Download"|cell countdown-block light-green-cell',
                'The file expired|<b>404 -|The file was deleted|Fichier introuvable|not available in your country|No files uploaded yet|aucun fichier présent|Belum ada berkas yang diunggah|لا يوجد أي ملف',
                'Maintenance|You need a PREMIUM account to download new files immediatly|not allowed in the US</title>',
                'You must be premium to download this file|Vous devez être premium pour télécharger ce fichier',
                "//a[contains(@href,'uptobox.com')]",
                true);
        }
        if (hostSet("Check_ninjashare_dot_pl_links", false))
        {
            addFileHost(
                'ninjashare.pl',
                'ninjashare\\.pl\/f\/\\w+',
                '<input type="submit" class="button" value="Download"',
                '<div class="main">\nFile does not exists',
                'optional--');
        }

        if (hostSet("Check_mixdrop_dot_co_links", false))
        {
            addFileHost(
                "mixdrop.co",
                "mixdrop\\.co\/f\/\\w+",
                '<a class="btn download-btn">DOWNLOAD<\/a>|<a class="btn download-btn player" href="?download">DOWNLOAD<\/a>',
                '<p>We can\'t find the file you are looking for.</p>',
                'optional--'
            );
        }

        if (hostSet("Check_wdupload_com_links", false))
        {
            addFileHost(
                "wdupload.com",
                'wdupload\\.com\/file\/\\w+',
                'class="file-header text-center"|Click here to download</p>',
                'class="size15 fontl color333 file-remove-ul"',
                'optional--'
            );
        }

        if (hostSet("Check_easybytez_com_links", false))
        {
            addFileHost(
                "easybytez.com",
                'easybytez\\.com\/\\w+',
                '<input type="submit" name="method_free" value="Free Download" class="btn">',
                'No such file exist</font>|File not available</h1>',
                'optional--'
            );
        }

        //         if (hostSet("Check_filebonus_dot_net_links", false))
        //         {
        //             addFileHost(
        //             'filebonus.net|filebonus.com',
        //             'filebonus(?:\\.net|\\.com)\/\\w+',
        //             'name="method_free" value="Free Download"',
        // 			'File Not Found</span>',
        //             'optional--');
        //         }

        if (hostSet("Check_nippyshare_com_links", false))
        {
            addFileHost(
                "nippyshare.com",
                'nippyshare\\.com\/v\/\\w+',
                '>Download</a>',
                'File not found',
                'optional--'
            );
        }

        if (hostSet("Check_filecrypt_cc_links", false))
        {
            addFileHost(
                "filecrypt.cc",
                'filecrypt\\.cc\/Container\/\\w+',
                ' Online<\/em>',
                '<strong>Not Found',
                'optional--'
            );
        }

//         if (hostSet("Check_uploadboy_dot_com_links", false))
//         {
//             addFileHost(
//                 'uploadboy.com|uploadboy.me',
//                 'uploadboy(?:\\.com|\\.me)\/\\w+',
//                 'value="Free Slow Download',
//                 'The file you were looking for could not be found, sorry for any inconvenience,Possible causes of this error could be: The file expired, Or The file was deleted by site because it didn\'t comply with Terms of Use',
//                 'optional--');
//         }

        if (hostSet("Check_workupload_dot_com_links", false))
        {
            addFileHost(
                "workupload.com",
                'workupload\\.com\/file\/\\w+',
                '>Download</span>',
                'class="text-center">File not found<',
                'optional--'
            );
        }

        /*         if (hostSet("Check_filejoker_dot_net_links", false))
		{
			addFileHost(
		   "filejoker.net",
           'filejoker\.net\/\\w+',
		   'button id="regular-download">Slow|method_free" value="1|<div id="download" class="download0">|>Get Download Link<',
		   'File Not Found|class="not_found|"err">DMCA Complaint<',
		   'optional--',
            );
		} */

        if (hostSet("Check_filefox_dot_cc_links", false))
        {
            addFileHost(
                "filefox.cc",
                'filefox\.cc\/\\w+',
                'class="dl-time dl-time-anon"',
                'expiration or removal by the file owner|class="not_found|"err">DMCA Complaint<',
                'optional--',
            );
        }

        // if (hostSet("Check_usersdrive_dot_com_links", false))
        // {
        //     addFileHost(
        //         "usersdrive.com",
        //         'usersdrive\.com\/\\w+',
        //         'class="btn btn-download downloadbtn">',
        //         'File Not Found</b>',
        //         'optional--',
        //     );
        // }

        if (hostSet("Check_uploadpages_dot_com_links", false))
        {
            addFileHost(
                "uploadpages.com",
                'uploadpages\.com\/\\w+',
                'type="submit" value="Download File Now"',
                'Invalid download link.',
                'optional--',
            );
        }

        if (hostSet("Check_easyload_io_com_links", false))
        {
            addFileHost(
                "easyload.io",
                'easyload\.io\/\\w+',
                'Mime Type|class="fa fa-download"',
                'class="notfound-404">',
                'optional--',
            );
        }

        if (hostSet("Check_ex_dash_load_dot_com_links", false))
        {
            addFileHost(
                "ex-load.com",
                'ex-load\.com\/\\w+',
                'name="method_free|<p>Download File:</p>',
                'Folder Not Found|File Not Found|Error 404',
                'optional--',
            );
        }

        if (hostSet("Check_hitfile_dot_net_links", false))
        {
            addFileHost(
                'hitfile.net|hil.to|hitf.to|hitf.cc',
                '(?:hitfile\\.net|(?:hil|hitf)\\.to)|(?:hitf\\.cc)\/\\w+',
                'class="title-cell">Choose a download type</th>',
                '<h1>Searching for the file...Please wait… <\/h1>',
                'optional--');
        }

        if (hostSet("Check_fileze_dot_net_links", false))
        {
            addFileHost(
                'fileze.net',
                'fileze\\.net\/\\w+',
                'class="link btn-free"',
                '<li>File has been removed due to inactivity.</li>',
                'optional--');
        }

        if (hostSet("Check_mshare_dot_xyz_links", false))
        {
            addFileHost(
                'mshare.xyz|mshare.io|mshares.net|mshares.co',
                'mshare(?:s|)\\.(?:xyz|net|io|co)\/(?:file|download)\/\\w+',
                'class="demo download-file download_2 check-file"',
                'File không tồn tại ...</h3>|<h3>File does not exist ...</h3>',
                'optional--'
            );
        }

    }

    //hosts with direct download, so they must be requested for headers only
    function initFileHostsHeadersOnly()
    {
        var aFHHCOCount = 1;
        function addFileHostHeadersOnly(hostName, linkRegex, isAliveRegex, isDeadRegex)
        {
            //debugger;
            hostName = hostName.split("|");
            var i = hostName.length;


            var hostID = "HC" + aFHHCOCount;

            while(i--) {
                var filehost = hostName[i].replace(/\./g, "_dot_").replace(/\-/g, "_dash_");

                if (!hostsIDs[filehost]) {
                    hostsIDs[filehost] = [];
                }
                hostsIDs[filehost].push({
                    hostID: hostID,
                    linkRegex: linkRegex,
                });
            }

            var HCObj = {
                liveRegex: isAliveRegex,
                deadRegex: isDeadRegex,
                links: []
            }

            hostsCheck[hostID] = HCObj;
            aFHHCOCount++;

        }

        if (hostSet("Check_uloziste_dot_com_links", false))
        {
            addFileHostHeadersOnly(
                'uloziste.com',
                "(?:|files\\.)uloziste\\.com\/\\w+\/\\w+",
                'Connection: Keep-Alive',
                'Content-Length: 3857'
            )
        }

//         if (hostSet("Check_megaup_direct_dot_net_files", false))
//         {
//             addFileHostHeadersOnly(
//                 'megaup.net',
//                 'megaup\\.net\/[a-zA-Z0-9]+',
//                 'status: 200',
//                 'status: 404');
//         }

//                 if (hostSet("Check_filefactory_dot_com_direct_Check", false))
//                 {
//                     addFileHostHeadersOnly(
//                     'filefactory.com',
//                     'filefactory\\.com\/[a-zA-Z0-9]+',
//                     '<div class="download-timer" style="display:none;">',
//                     'finalUrl: "http://www.filefactory.com/error.php?code=251"');
//                 }


        if (hostSet("Check_filemonster_dot_net_links", false))
        {
            addFileHostHeadersOnly(
                'folemonster.net',
                "filemonster\\.net\/(?:..\/|)file\/\\w+",
                'filename="',
                'Content-Type: text/html'
            )
        }

        if (hostSet("Check_videozer_dot_com_links", false))
        {
            addFileHostHeadersOnly(
                'videozer.com',
                "videozer\\.com\/embed\/\\w+",
                "Connection: keep-alive|Content-Type: application/x-shockwave-flash",
                "optional--"
            )
        }

        if (hostSet("Check_dropbox_dot_com_links", false))
        {
            addFileHostHeadersOnly(
                'dropbox.com|dropboxusercontent.com',
                "dl\\.dropbox(?:usercontent)?\\.com\/u\/\\d+\/.+?",
                /x-dropbox-request-id: \w+/,
                "optional--"
            )
        }

        if (hostSet("Check_demo_dot_ovh_dot_eu_links", false))
        {
            addFileHostHeadersOnly(
                'ovh.eu',
                "demo\\.ovh\\.eu\/download\/\\w+",
                "optional--",
                "optional--"
            )
        }

        if (hostSet("Check_archive_dot_org_links", false))
        {
            addFileHostHeadersOnly(
                'archive.org',
                "\\w+\\.us\\.archive\\.org\/.+",
                /Content-Length: \d{6,}/,
                'Content-Type: text/html'
            );
        }

        // if (hostSet("Check_rapidgator_dot_net_links", false) && !chromeBrowser)
        // {
        //     addFileHostHeadersOnly(
        //         'rapidgator.net|rg.to',
        //         "(?:rapidgator\\.net|rg.to)\/file\/\\w+",
        //         'download_url=http%3A%2F%2Frapidgator.net%2Ffile%2F',
        //         'You can download files up to 1 GB in free mode<br><a style="color: red" href="/article/premium">Upgrade to premium</a> to have opportunity to download files up to 5 GB!',
        //         'fnf=deleted;'
        //     );
        // }
        	if (hostSet("Check_alfafile_dot_net_links", false) && !chromeBrowser)
        {
            addFileHostHeadersOnly(
            'alfafile.net',
            "alfafile\\.net\/file\/\\w+",
            '<div class="download-info">',
            'fnf=deleted;'
            );
        }


    }


    function setSessionStorage(){

    if(deadLinkValues.length > 0)
    {
        sessionStorage.clear();
        sessionStorage.setItem("deadlinks", deadLinkValues);
        console.log(deadLinkValues);}
    }
}


// update.init();


/* ********************UPDATES********************
version 1.0.17 - 23 Dec 2023
ddownload file check messages updated

version 1.0.16 - 23 Dec 2023
removing unnecessary console.log

version 1.0.15 - 06 Dec 2023
cnu fileinfo & link check code updated

version 1.0.14 - 15 Nov 2023
1dl.net added to obsolete
cnu fileinfo check updated

version 1.0.13 - 03 Nov 2023
drive.google.com added via direct check

version 1.0.12 - 30 Oct 2023
cnu fileinfo check added
gofile.cc added via API
trbbt.net added to turbobit link check added as additional domain
drive.google.com added via direct check - Needs more coding

version 1.0.11 - 13 Sep 2023
.vip domain for cnu added
krakenfiles.com, workupload.com fileinfo code added

version 1.0.10 - 08 Sep 2023
clickndownload.org added  for CNU link checking, filename and size added,
Code by HD3D for internal link checking added.

version 1.0.9 - 30 Jun 2023
add new domain

version 1.0.8 - 30 Jun 2023
userupload.net added via LC
clicknupload.click & .download code for link checking, filename and size added
mdiaload.com added via LC


version 1.0.7 - 27 Jun 2023
clicknupload.xyz, .site, .online code for link checking, filename and size added
Added filename detection code for takefile.link
1dl.net code for filename and size added


version 1.0.6 - 14 Jun 2023
Zippyshare added to obsolete hosts list
filename detection code added for filesharez.cz
filesharez.cz link checked updated to link checker
nitroflare code for filename and size added
uploady.io added via LC
fastclick.to check via drop.download checklink

version 1.0.5 - 31 March 2023
clicknupload code for filename and size added

version 1.0.4.2 - 30 March 2023
clicknupload.click regex fixed and refactored

version 1.0.4.1 - 30 March 2023
clicknupload.click added to domains and regex fixed


version 1.0.4 - 30 March 2023
Added pixeldrain via API
Drop.Download Filename and size added on tooltip modifying existing fastclick.to function


version 1.0.3 - 23 March 2023
Added filerice via LC
Updated code filename and filesize detection
fastclick.to Filename and size checked via Separate function
fikper.com Filename and size checked via Separate function


version 1.0.2 - 07 March 2023
Removed expired domain
removed maintenance code
Improved code for various hosts
webshare.cz added
gofile.io added via api correctly
uploadbank.com added via LC
rapidcloud.cc added via LC

version 1.0.1 - 24 Feb 2023
Added hot4share.com for via linkchecker
Added send.cm via linkchecker
Added katfile via linkchecker & direct checking removed
fikper.com added via API
xubster.com added via LC
takefile.link added via LC


WAREZLC - Warez Links Checker
version	1.0.0 - 23 Jan 2023
Added 1dl.net for via linkchecker
Added gulf-up.com via linkchecker
Added filecrypt for direct checking
WarBB3 - Warez-BB Links Checker Version Version 1.0.15 from now one Updated as new
Removed Unncessary Obsolete hosts

*/