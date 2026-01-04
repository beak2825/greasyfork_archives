// ==UserScript==
// @name         ABN Interface Helper
// @author       MENTAL
// @description  Ease things on ABN
// @version      1.6.2
// @require      https://code.jquery.com/jquery-3.6.0.slim.min.js
// @match        https://abn.lol/*
// @exclude      https://abn.lol/Forum*
// @exclude      https://abn.lol/Inbox*
// @exclude      https://abn.lol/Group*
// @exclude      https://abn.lol/Staff*
// @exclude      https://abn.lol/Request/Details?RequestId=*
// @grant        none
// @namespace    abn
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://abn.lol
// @downloadURL https://update.greasyfork.org/scripts/445760/ABN%20Interface%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/445760/ABN%20Interface%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $.noConflict();
    var url = window.location.href;
    var searchProvider = "";
    const approvedUploaders = ["MENTAL", "BigBoss", "magicgg91", "Echobeats", "rouggy", "LeVieux"];
    var scene = new RegExp(/-(EUBDS|10000HOURS|1080|24FPS|25FPS|30FPS|4KHDR|60FPS|60PFS|OLDHAM|HiggsBoson|7SinS|AAA|AiRDOCS|AiRLiNE|BAWLS|AiRTV|ALDOUS|AMB3R|AMIABLE|AMZN|APoLLo|AUREVOIRLAHAUT|AUTOMATEDSHITHEADS|AVON|AZR|B2B|BABYSITTERS|BAE|BAGUETTEHD|BALKAN|BARGAiN|BEDLAM|BestHD|BIGDOC|BiPOLAR|BiPOLAR|BLOW|BODIE|BooKWoRM|BOOLZ|BORDURE|BOYS2MEN|BRAHMA|BRAVERY|BRiNK|BROADCAST|BRPLAYER|BUISSONNIERE|C4N4B1S|CADAVER|CAFFEiNE|CAKES|CARAPiLS|Caribou|CARVED|CAViTY|CBFM|CEBRAY|CESiUM|CiELOS|CiNEFiLE|ClassicFrog|CLHD|CMBHD|COCAIN|CONSTANT|CONVOY|CREEP|CRiMSON|CROOKS|CYGiSO|D4KiD|DARKFLiX|DARKONE|DARKROW|DARKSiDERS|DEAL|DECiBEL|DELAYED|DEMAND|DEV0|DEVOPS|DEXTEROUS|DIEBEX|DiRK|DiRT|DiSAPPOiNTMENT|DISNEYSHIT|DiSTURBANCE|DOCiLE|dotTV|DuSS|DUSS|DVTiSO|DXS|EFFY|ENGiNE|ENjOi|ERMM|EX0DUS|EXPLOIT|FaiLED|FHD|FiDELiO|FiDO|FLAME|FLAME|ForceBleue|FQM|FREAMON|FREEMAN|FRENCHDEADPOOL2|Friday13th|Friday21st|Friday28th|Fuqua|FUTiL|FUTURiSTiC|FWDHD|GECKOS|GERUDO|GETiT|GGEZ|GGWP|GHOULS|GLHF|Goatlove|GOSSIP|GUACAMOLE|HAGGiS|HANDJOB|HAWAII|HD1080P|HDMI|HERC|HESiTATiON|HiDeF|HiGHKiCK|HiRoSHiMa|HOLiDAYS|HONOR|HOUSESABROAD|HYBRiS|HYMN|iCEBERG|iDHD|iMMORTEL|iMPRiNT|iNDiSO|iNGOT|iNKiSO|iRLS|ISO|ITSALLGOODMAN|IWL|JEBAITED|JMT|JOSH|JUMANJI|JUSTICELEAGUE|JustWatch|KAZETV|KENNYPOWERS|KINGS|KNiVES|KOGi|KOMPOST|LaoZi|LATENCY|LCHD|LEDOUDOU|LiBRO|LoKET|LOST|LOUVRE|Ltu|MAGiCAL|MAGNiTUDE|MAKIMAKI|MANGACiTY|MAYHEM|McNULTY|MELBA|MEMETiC|METALLIKA |MiMiC|MINUSCULE2|MOMS|MONK|Mrflac|MUNSTER|MUXED|MUxHD|NAViGON|NERDHD|NERO|NOBiLiTY|NOCTURNALFEMALE|NOELLE|NOMA|NOWiNHD|NTK|NTSH|OBSTACLE|OLDBR|OMiCRON|OohLaLa|OPUS|ORBS|ORBS|ORGANiC|OUIJA|OXBRiDG|PADDINGTON2|PANZeR|PECULATE|PEGASUS|PFa|PHASE|PiGNUS|PiNKPANTERS|PKPTRS|PLANET3|PLZPROPER|PRESSECiTRON|PRiDEHD|PRiNTER|PRODiGE|PROPJOE|PRXHD|PSYCHD|PtS|PURE|PUREWASTEOFBW|PussyFoot|QUiD|RAGEQUIT|RCDiVX|Redwave|REGRET|REWARD|rG|ROUGH|RUDE|RUSTED|Ryotox|S0CKET|SADPANDA|SaSHiMi|SCARE|SCENE|SD480P|SECRETOS|SEiGHT|SESKAPiLE|SH0W|SHEEEIT|SHiNiGAMi|SHiNiGAMiUHD|SHMALTZ|SiGeRiS|SILVIODANTE|SKYFiRE|SLEEPINGFOREST|SLOT|SMiTE|SNOW|SODAPOP|SOFTiMAGE|SOLO|SONiTUS|SoSISO|SP0UTN1K|SPINE|SPOiLER|SPOOKY|SRiZ|STOUT|STRINGERBELL|STRONTiUM|SUiCiDAL|SUNRiSE|SURCODE|SWiSH|SYNCOPY|TABULARiA|TARDiS|TAXES|TBE|TENEIGHTY|THEGREENBOOK|THENiGHTMAREiNHD|THEPOST|THiNK|THREESOME|Thursday13th|TiMELiNE|TiMELORDS|ToF|TREBLE|TREBLE|TRUMP|TSuNaMi|TURBO|UKDHD|UKDTV|UKTV|ULSHD|Ulysse|UNVEiL|USURY|USURY|VALUES|VAMPSHIT|VENUE|VETO|W4F|WAKANDA|WALDO|WaLMaRT|WALT|WASTE|WATCHABLE|WEBiSO|WEBTUBE|Wednesday5th|WHODUNNIT|WHOSNEXT|WiLFREDMOTT|WiREHD|WoAT|WURUHI|WUTANG|XiSO|XMASCOOKiES|YAMG|YANKEES|YesTV|ZEST)/);
    addGlobalStyle('body .table-rows tr[style*="background-color: rgb(250, 240, 168)"] {  background-image: var(--line-active) !important;  background-size: 350% 100%;  background-position: 0 50%;  -webkit-animation: AnimationName 6s ease infinite;  -moz-animation: AnimationName 6s ease infinite;  animation: AnimationName 6s ease infinite;');
    console.log("URL:" + url);
    var regexEpisode = /[eE]{1}[0-9]{2}\./g;
    if (url.indexOf("https://abn.lol/") != -1) {
        // Increase the header size to not move when Freeleech or Open invites are displayed
        jQuery(".header-navbar").css("height","120px");
    }

    if (url.indexOf('https://abn.lol/Torrent/Details') != -1) {

        // Open the file list automatically
        jQuery("#FilesList").css("display","block");

        // Create custom reasons list for Torrent Delete and Pending actions
        jQuery("#DeletePopupContent").append("<ul id='TorrentDeleteReasonsList'></ul>");
        jQuery("#PendingPopupContent").append("<ul id='TorrentPendingReasonList'></ul>");

        // List of values
        jQuery("#TorrentDeleteReasonsList,#TorrentPendingReasonList").append("<li><a href='#'>Un ou plusieurs des fichiers sont corrompus (CRC incorrect). Le torrent sera reposté.</a></li>");
        jQuery("#TorrentDeleteReasonsList,#TorrentPendingReasonList").append("<li><a href='#'>Le torrent contient proofs, samples ou fichiers mal nommés. Le torrent sera reposté.</a></li>");
        jQuery("#TorrentDeleteReasonsList,#TorrentPendingReasonList").append("<li><a href='#'>Le torrent SCENE ne contient pas de NFO. Merci de reposter.</a></li>");
        jQuery("#TorrentDeleteReasonsList").append("<li><a href='#'>Le torrent est sans seed. Le torrent sera reposté.</a></li>");
        jQuery("#TorrentDeleteReasonsList").append("<li><a href='#'>Les intégrales sont interdites. Merci de reposter par saison en suivant les règles.</a></li>");
        jQuery("#TorrentDeleteReasonsList").append("<li><a href='#'>Les torrents SCENE doivent être décompréssés. Le torrent sera reposté.</a></li>");
        jQuery("#TorrentDeleteReasonsList").append("<li><a href='#'>Un DiRFiX existe et il sera posté.</a></li>");

        // Trigger auto complete on click
        jQuery("#TorrentDeleteReasonsList a").click(function(){
            var value = jQuery(this).html();
            var input = jQuery('#DeleteReason');
            input.val(value);
        });

        jQuery("#TorrentPendingReasonList a").click(function(){
            var value = jQuery(this).html();
            var input = jQuery('#PendingReason');
            input.val(value);
        });

        const extensions = /\.(mkv|nfo|iso|pkg|pdf|xci|epub) /i; //<-- Keep the space to avoid matching inside release name
        setTimeout(function(){
            // Check if files are correctly named
            var title=jQuery("main h1").text().trim();
            if (jQuery("#FilesList div").length == 2){
                var firstFile=jQuery("#FilesList div:first").text().split("|")[0].replace(extensions,"").trim(); //<-- Keep the trim in the end to avoid matching inside release name
                var secondFile=jQuery("#FilesList div:nth-child(2)").text().split("|")[0].replace(extensions,"").trim(); //<-- Keep the trim in the end to avoid matching inside release name
                console.log(firstFile + "  " + secondFile);
                if ((title == firstFile && title == secondFile) || (title.toLowerCase() == firstFile.toLowerCase() && title.toLowerCase() == secondFile.toLowerCase())) {
                    jQuery("main h1").css('color', '#4cda43');
                    jQuery("main h1").append("<img id='cleanFiles' src='https://abn.lol/images/common/status-green.png'>");
                    /*window.close('','_parent','');*/
                }
            } else if (jQuery("#FilesList div").length > 2) {
                var status="true"
                jQuery("#FilesList div").each(function () {
                    var fileItem = jQuery(this);
                    var folder = fileItem.text().split("/")[0].trim().toLowerCase();

                    var file = fileItem.text();
                    if (fileItem.text().indexOf('/') != -1)
                    {
                         file = file.split("/")[1].split("|")[0].replace(extensions,"").trim().toLowerCase();
                    }
                    var folderWithoutEp = folder.replace(regexEpisode,".").replace(".final.",".");
                    var fileWithoutEp = file.replace(regexEpisode,".").replace(".final.",".");
                    if ((title.toLowerCase() != folderWithoutEp) || (title.toLowerCase() != fileWithoutEp) || (folderWithoutEp != fileWithoutEp)) {
                        console.log(title.toLowerCase() +"=="+ folderWithoutEp +"=="+ fileWithoutEp);
                        status="false";
                        console.log(status);
                    }
                });
                if (status=="true") {
                    jQuery("main h1").css('color', '#4cda43');
                    jQuery("main h1").append("<img id='cleanFiles' alt='Clean files' src='https://abn.lol/images/common/status-green.png'>");
                }
            }
            //Check if NFO exists
            if (jQuery("#FilesList div").text().indexOf(".nfo") == -1 ){
               jQuery("main h1").css('color', 'red');
               jQuery("main h1").append("<img id='nfoPresent' alt='NFO present' src='https://abn.lol/images/common/status-red.png'>");
            } else {
               jQuery("main h1").append("<img id='nfoPresent' alt='NFO present' src='https://abn.lol/images/common/status-green.png'>");
            }
        }, 3000);
    }
    else if (url.indexOf('https://abn.lol/Request/Details') != -1) {
        // Create custom reasons list for Request Delete action
        jQuery("#DeletePopupContent").append("<ul id='RequestDeleteReasonsList'></ul>");

        // List of values
        jQuery("#RequestDeleteReasonsList").append("<li><a href='#'>Merci de créer une requête par saison.</a></li>");
        jQuery("#RequestDeleteReasonsList").append("<li><a href='#'>Merci de réaliser des requêtes demandant un contenu précis.</a></li>");
        jQuery("#RequestDeleteReasonsList").append("<li><a href='#'>L'utilisateur ne pourra plus jouir de sa requête.</a></li>");

        // Trigger auto complete on click
        jQuery("#RequestDeleteReasonsList a").click(function(){
           var value = jQuery(this).html();
           var input = jQuery('#DeleteReason');
           input.val(value);
        });
    }
    else if (url.indexOf('https://abn.lol/Request') != -1) {
        var linkOutside = "";
        var linkOutsidePack = "";
        var linkABN = "";
        var name = ""

        // Adding a Tools column in Requests
        jQuery('table.table-rows thead').find('tr').each(function () {
            var tr = jQuery(this);
            tr.children("th").eq(1).after('<th class=" "><span class="mvc-grid-title">Tools</span></th>');
        });

        // Adding "ABN" link to search on ABN
        // Adding "E" for exact search on External source (if configured)
        // Adding "P" for pack search on External source (if configured)
        jQuery('table.table-rows tbody').find('tr').each(function () {
            var tr = jQuery(this);
            name = tr.children("td").eq(1).text();
            var nameRework = name.replace(regexEpisode," ").replace(/\./g, " ").replace(/\)/g, "").replace(/\(/g, "");
            linkABN = "https://abn.lol/Torrent?SortOn=ReleaseName&SortOrder=asc&Search=" + name;
            tr.children("td").eq(1).after('<td class="extratools"><a href="' + linkABN + '" target="_blank"><span> ABN</span></a></td>');
            if (searchProvider != "") {
                linkOutside = searchProvider + name;
                linkOutsidePack = searchProvider + nameRework;
                tr.children("td").eq(2).append(' <a href="' + linkOutside + '" target="_blank"><span>E</span></a> <a href="' + linkOutsidePack + '" target="_blank"><span>P</span></a>');
            }
        });
    }
    else if (url.indexOf('https://abn.lol/Log') != -1) {
        // Remove "Le torrent" wording in logs
        jQuery("table tr td").each(function () {
            jQuery(this).html(jQuery(this).html().replace("Le torrent", ""));
        });

        jQuery("table tr").each(function(index, tr) {
            // Remove columns not needed in logs
            jQuery(tr).find("td").slice(1, 3).remove();
            jQuery(tr).find("th").slice(1, 3).remove();

            var release=jQuery(tr).find("td:nth-child(2) a:first").text();
            var uploader=jQuery(tr).find("td:nth-child(2) a:nth-child(2)");
            var uploaderName=uploader.text();

            // Highlight SCENE release uploaded by non approved uploaders
            if (scene.test(release) && !approvedUploaders.includes(uploaderName)) {
                jQuery(this).css("background-color","#faf0a8");
                uploader.css("font-size","15px");
                uploader.css("font-weight","bold");
            }
        });
    }
})();


function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

