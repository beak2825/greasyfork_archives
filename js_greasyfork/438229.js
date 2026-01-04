/* eslint-env jquery */

// ==UserScript==
// @name         Tirexo Enhanced
// @license GNU GPLv3
// @namespace    Altansar
// @version      1.01
// @description  Enhanced your Tirexo experience
// @author       Altansar
// @match        *://*.tirexo.work/*
// @match        *://*.tirexo.al/*
// @match        *://*.tirexo.art/*
// @grant        none
// @homepageURL  https://github.com/Altansar69/Tirexo-Enhanced
// @downloadURL https://update.greasyfork.org/scripts/438229/Tirexo%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/438229/Tirexo%20Enhanced.meta.js
// ==/UserScript==


/*
-----------
  Credits
-----------
Thanks to Royalgamer06 and SubZeroPL for their script for the rin in which i based myself.
*/


/*
-----------
  Contact
-----------
https://cs.rin.ru/forum/memberlist.php?mode=viewprofile&u=1280185
*/


/*
-----------
  Version
-----------
0.1 -> Colors for Tag
0.2 -> Size for Tag
0.3 -> Title W.I.P
0.4 -> Add Season to Tag + share this script on discord of Tirexo
0.5 -> Title Improve
0.6 -> Hide Bad Quality
0.7 -> You can easily change options of this script (change true by false)
0.8 -> Hide Info Box
0.9 -> Title Improve + redirection fake website to the real
1.0 -> Title improve (almost finished) + Desactivate Hide Bad Quality in home page + remove re-up message + remove 90days message + hide related article + hide message article + hide warning search + share this script on forum
1.01 -> Change Address of Tirexo, tirexo.art
*/


/*
----------
  To add
----------
-> add search for vfq
-> dynamic who is online and dynamic time (forum)
-> options configurable from a button on the site
-> infinite scrolling
-> article preview

-> if you have any ideas/improvements for the scipt don't hesitate to contact me. <-
*/


/*
-----------------------------------------------------
  You can change options by replacing true by false
-----------------------------------------------------
*/


let options = {
    "custom_tags": true, //Change colors and size of quality, season and language (you can change the colors and size just below)+
    "custom_titles": true, //Change titles of windows
    "hide_bad_quality": true, //removes the articles being in a bad quality (you can change what you consider to be poor quality just below the colors and size)
    "hide_info_box": true, //removes the infobox that encourages you to change your DNS
    "hide_days_message": true, //removes the infobox that encourages you to change your DNS
    "redirect_fake_site" : true, //redirect fake site to the right
    "redirect_old_site" : true, //redirect old address to the right (if you remember the old addresses of tirexo, please contact me)
    "hide_re_up" : true, //remove the message appearing in "my links" encouraging you to fill in your accounts in your profile
    "hide_related_article" : true, //remove related articles
    "hide_message_add_article" : true, //suppress the warning message when you want to create an article
    "test_function" : true, //useless actually
    "hide_warning_search" : true, //supress the warning message when you search article
};

//if you want change color, hexcodes: https://htmlcolorcodes.com/
let color ={
    //Quality
    "other_quality": "#582900", //brun
    "very_low_quality": "#BF0000", //red
    "low_quality": "#BF4600", //orange
    "medium_quality" : "#BF9F00", //yellow
    "high_quality" : "#00BF00", //green
    "very_high_quality" : "#5A4BBC", //blue
    //Language
    "french_language" : "#bc39e6",
    "vo_language" : "#e83e8c",
    "multi_language" : "#D66E49",
    "other_language" : "#6c757d",
};

let size ={
    "quality" : "1.2",
    "language" : "1.1",
    "season" : "1.0",
};

let hide = {
    //Quality
    "other_quality": false,
    "very_low_quality":true,
    "low_quality": true,
    "medium_quality": false,
    "high_quality": false,
    "very_high_quality": false,
    //Language
    "vo_language":false, //Vo is VO + VOSTFR
    "french_language":false, //French is French + Truefrench + VFSTFR + vfq
    "multi_language":false, //multi
    "other_language":false, //other
};


redirectFakeSite();
redirectOldSite();
testFunction();
hideRelatedArticle();
hideInfoBox();
hideMessageAddArticle();
hideReUp();
hideDaysMessage();
hideWarningSearch()
hideBadQuality();
tagify();
setupPageTitle();

/// @brief Change colors and size of quality (call sizeTag and Colorize for that)
function tagify() {
    if (options.custom_tags) {
        $(".qualite, .langue, .saison").each(function () {
            const titleElem = this;
            const tags = $(titleElem).text().match(/(.)+/g);
            if (tags) {
                tags.forEach(function (tag) {
                    const color = colorize(tag);
                    const size = sizeTag(tag);
                    titleElem.innerHTML = titleElem.innerHTML.replace(tag, "<span style='color:" + color + ";'></span><span style='color:" + color + ";font-size: " + size + "em;'>" + tag.replace(/\[|\]/g, "") + "</span><span style='color:" + color + ";'></span>");
                });
            }
        });
    }
}

/// @brief Change colors of quality
/// @param str String of quality
/// @return The corresponding colors
function colorize(str) {
    //
    // Quality
    //
    //Very High Quality 4k UHD (purple)
    if (str=="ULTRA HD (x265)"||str=="Ultra HDLight (x265)"){
        return color.very_high_quality;
    }
    //High Quality (green)
    if (str=="Blu-Ray 720p"||str=="Blu-Ray 1080p"||str=="Blu-Ray 3D"||str=="HD 720p"||str=="HDLight 720p"||str=="HDLight 1080p"||str=="HD 1080p"||str=="WEB-DL 720p"||str=="WEB-DL 1080p"||str=="REMUX"||str=="HDTV 720p"||str=="HDTV 1080p") {
        return color.high_quality;
    }
    // Medium Quality (yellow)
    if (str== "DVDRIP"||str=="BDRIP"||str=="BRRIP"||str=="Webrip"||str=="HDTV"||str=="HDRip"||str=="TVrip"||str=="Web-DL"||str=="DVDRIP MKV"||str=="DVD-R"||str=="Full-DVD") {
        return color.medium_quality;
    }
    // Low Quality (orange)
    if (str == "DVDSCR"||str=="BRRIP LD"||str=="BDRIP LD"||str=="DVDRIP LD"){
        return color.low_quality;
    }
    //Very Low Quality (red)
    else if (str == "TS"||str == "CAM"||str == "R5"||str == "R6"||str == "DVDSCR MD"||str == "DVDSCR LD"||str == "R5 MD"||str == "TS MD"||str == "TS LD"||str=="CAM MD"||str=="HDCAM"||str=="TC"||str=="DVDRIP MD"||str=="BDRIP MD"||str=="BRRIP MD"||str=="HDRiP MD") {
        return color.very_low_quality;
    }
    //Other
    else if (str== "ARCHIVE"||str=="EXE"||str=="MP3"||str=="FLAC"||str=="M4A"||str=="PDF"||str=="Autre"||str=="CBR"||str=="CBZ"||str=="IPA"||str=="IMG"||str=="ISO"||str=="epub"||str=="PKG") {
        return color.other_quality;
    }
    //
    //Language
    //
    //French
    else if (str== " (French)"||str==" (TrueFrench)"||str==" (VFSTFR)"||str==" (VFQ)") {
        return color.french_language;
    }
    //Vo
    else if (str==" (VOSTFR)"||str ==" (VO)") {
        return color.vo_language;
    }
    //Multi
    else if (str ==" (MULTI)") {
        return color.multi_language;
    }
    //Other
    else if (str ==" (inconnue)"){
        return color.other_language;
    }
}

/// @brief Change size of quality
/// @param str String of quality
/// @return The corresponding size
function sizeTag(str) {
    //Quality
    if (str=="ULTRA HD (x265)"||str=="Ultra HDLight (x265)"||str=="Blu-Ray 720p"||str=="Blu-Ray 1080p"||str=="Blu-Ray 3D"||str=="HD 720p"||str=="HDLight 720p"||str=="HDLight 1080p"||str=="HD 1080p"||str=="WEB-DL 720p"||str=="WEB-DL 1080p"||str=="REMUX"||str=="HDTV 720p"||str=="HDTV 1080p"||str== "DVDRIP"||str=="BDRIP"||str=="BRRIP"||str=="Webrip"||str=="HDTV"||str=="HDRip"||str=="TVrip"||str=="Web-DL"||str=="DVDRIP MKV"||str=="DVD-R"||str=="Full-DVD"||str == "DVDSCR"||str=="BRRIP LD"||str=="BDRIP LD"||str=="DVDRIP LD"||str == "TS"||str == "CAM"||str == "R5"||str == "R6"||str == "DVDSCR MD"||str == "DVDSCR LD"||str == "R5 MD"||str == "TS MD"||str == "TS LD"||str=="CAM MD"||str=="HDCAM"||str=="TC"||str=="DVDRIP MD"||str=="BDRIP MD"||str=="BRRIP MD"||str=="HDRIP MD"||str== "ARCHIVE"||str=="EXE"||str=="MP3"||str=="FLAC"||str=="M4A"||str=="PDF"||str=="Autre"||str=="CBR"||str=="CBZ"||str=="IPA"||str=="IMG"||str=="ISO"||str=="epub"||str=="PKG") {
        return size.quality;
    }
    //Language
    else if (str== " (French)"||str==" (TrueFrench)"||str==" (VFSTFR)"||str==" (VFQ)"||str==" (VOSTFR)"||str ==" (VO)"||str ==" (MULTI)"||str ==" (inconnue)"){
        return size.language;
    }
    //Season
    else if (str.match(/Saison (.)+/g)){
        return size.eason;
    }
}

/// @brief Change title of window
function setupPageTitle() {
    if (options.custom_titles){
        let title=document.title;
        let url=window.location.pathname;
        if(url.match(/\/(.)+\/(\d)+/g)&&url.search("/coll")!=0&&document.location.pathname.search(/(acteur)?(realisateur)?\/(\d)+/g)!=1) { //if you are in article
            document.title = $("h3.p-2").text();
        }
        else if(document.location.pathname.search(/(acteur)?(realisateur)?\/(\d)+/g)==1) { //actor or director
            document.title = $("h3:first").text();
        }
        else if (window.location.href==window.location.protocol+"//"+ window.location.hostname+"/") { //if you are in home
            document.title = "Tirexo";
        }
        else if(url=="/calendrier"||window.location.search.search(/\?do=req_listes/g)==0||window.location.search.search(/\?do=index_alpha/g)==0||url.search("exclus")==1||url.search(/\/user\/(.)+\/news/g)==0||url.search("addnews.html")==1||url.search("addmusic")==1||url.search("addebook")==1||url.search("mes_liens")==1||url.search("jeuxvideo.html")==1||url.search("auto_prez")==1||url.search("statistics.html")==1||url.search("favorites")==1) {
            document.title = document.getElementsByClassName("widget-heading")[0].innerText;
        }
        else if(window.location.search=="?do=alpha_collections"||url.search("/coll")==0) { //if you are in collection
            document.title = document.getElementsByClassName("pt-3")[0].innerText;
        }
        else if(window.location.search.search(/\?do=pm/g)==0) { //if you are in pm
            document.title = title.substring(0, 19);
        }
        else if(url.search("/user")==0) { //if you are in user
            document.title = document.getElementsByClassName('text-center user-info')[0].innerText;
        }
        else if(window.location.search.search(/\?do=lastcomments/g)==0||window.location.search.search(/\?do=mylastlinkscomments/g)==0) { //if you are in last comments or mylastlinkcomments
            document.title = "Commentaires";
        }
        else if(url.search("newposts")==1) { //if you are in newposts
            document.title = "Nouveaux posts";
        }
        else if(url.search("index.php")==1||window.location.search.search(/\?do=search/g)==0) { //if you are in search //document.getElementsByClassName("alert alert-light-info d-flex align-items-center")[0].remove()
            document.title = "Recherche: " + document.getElementsByClassName('form-control')[1].value;
        }
        else if(document.location.pathname.search(/\/xfsearch\/(.)+/g)==0) { //xfsearch
            document.title = document.title.substr(0,document.title.length-57);
        }
        else if(window.location.search.search(/\?year=(\d)+&month=(\d)+&day=(\d)+/g)==0) { //article today
            document.title = document.title.substr(0,document.title.length-57);
        }
        else {
            document.title = document.getElementsByClassName("widget-heading")[1].innerText;
        }
    }
}

/// @brief Hide bad quality
function hideBadQuality() {
    if (options.hide_bad_quality) {
        if(window.location.href!=window.location.protocol+"//"+ window.location.hostname+"/") //Not in home page
        {
            $(".qualite, .langue").each(function () {
                //Quality
                if(colorize($(this).text().match(/(.)+/g))==color.other_quality&&sizeTag($(this).text().match(/(.)+/g))==size.quality&&hide.other_quality) { //other quality
                    this.parentElement.style.display = "none";
                }
                else if (colorize($(this).text().match(/(.)+/g))==color.very_low_quality&&sizeTag($(this).text().match(/(.)+/g))==size.quality&&hide.very_low_quality) { //very low quality
                    this.parentElement.style.display = "none";
                }
                else if(colorize($(this).text().match(/(.)+/g))==color.low_quality&&sizeTag($(this).text().match(/(.)+/g))==size.quality&&hide.low_quality) { //low quality
                    this.parentElement.style.display = "none";
                }
                else if(colorize($(this).text().match(/(.)+/g))==color.medium_quality&&sizeTag($(this).text().match(/(.)+/g))==size.quality&&hide.medium_quality) { //medium quality
                    this.parentElement.style.display = "none";
                }
                else if(colorize($(this).text().match(/(.)+/g))==color.high_quality&&sizeTag($(this).text().match(/(.)+/g))==size.quality&&hide.high_quality) { //high quality
                    this.parentElement.style.display = "none";
                }
                else if(colorize($(this).text().match(/(.)+/g))==color.very_high_quality&&sizeTag($(this).text().match(/(.)+/g))==size.quality&&hide.very_high_quality) { //very high quality
                    this.parentElement.style.display = "none";
                }

                // Language
                else if(colorize($(this).text().match(/(.)+/g))==color.french_language&&sizeTag($(this).text().match(/(.)+/g))==size.language&&hide.french_language) { //french
                    this.parentElement.style.display = "none";
                }
                else if(colorize($(this).text().match(/(.)+/g))==color.vo_language&&sizeTag($(this).text().match(/(.)+/g))==size.language&&hide.vo_language) { //vo
                    this.parentElement.style.display = "none";
                }
                else if(colorize($(this).text().match(/(.)+/g))==color.multi_language&&sizeTag($(this).text().match(/(.)+/g))==size.language&&hide.multi_language) { //multi
                    this.parentElement.style.display = "none";
                }
                else if(colorize($(this).text().match(/(.)+/g))==color.other_language&&sizeTag($(this).text().match(/(.)+/g))==size.language&&hide.other_language) { //other
                    this.parentElement.style.display = "none";
                }
            }
                                       );
        }
    }
}

/// @brief Supress re-up message
function hideReUp() {
    if (options.hide_re_up) {
        if(window.location.pathname.search("mes_liens")==1||window.location.search.search(/\?do=mes_liens/g)==0||window.location.search.search(/\?do=mylastlogs/g)==0) { //if you are in "my links"
            document.getElementsByClassName('alert-info')[0].remove(); //remove infobox
        }
    }
}

/// @brief Supress DNS infobox
function hideInfoBox() {
    if (options.hide_info_box) {
        document.getElementsByClassName('infobox-2 mt-2 text-center')[0].remove(); //remove infobox
    }
}

/// @brief Supress days message
function hideDaysMessage() {
    if(options.hide_days_message) {
        if(window.location.search.search(/\?do=pm/g)==0) { //when you are in pm
            document.getElementsByClassName('alert alert-light-info')[0].remove(); //remove infobox
        }
    }
}

/// @brief Redirect fake address to the real
function redirectFakeSite() {
    if (options.redirect_fake_site) {
        if(document.location.hostname=="www.tirexo.al") { //when you are in fake site
            document.location.hostname="www2.tirexo.work"; //redirect to the real site
        }
    }
}

/// @brief Redirect old address of Tirexo to the latest
function redirectOldSite() {
    if (options.redirect_old_site) {
        if(document.location.hostname.search("tirexo.work")==0) { //when you are in old address
            document.location.hostname="www.tirexo.art"; //redirect to the latest
        }
    }
}

/// @brief Redirect you yo X site when you entered Y in search bar
function testFunction() {
    if(options.test_function) {
        if(window.location.pathname.search("/index.php")==0||window.location.search.search(/\?do=search/g)==0) { //if you are in search
            if(document.getElementsByClassName('form-control')[1].value=="rin") { //when you entered Y
                document.location.href="https://cs.rin.ru"; //redirect to X
            }
        }
    }
}

/// @brief Supress related article
function hideRelatedArticle() {
    if(options.hide_related_article) {
        if(window.location.pathname.match(/\/(.)+\/(\d)+/g)&&window.location.pathname.search("/coll")!=0&&document.location.pathname.search(/(acteur)?(realisateur)?\/(\d)+/g)!=1) {
            if(document.getElementsByClassName("bio layout-spacing").length>2) {
                if(document.getElementsByClassName("bio layout-spacing")[3].innerText.search("Articles en relation :")==0) { //If the article has a "related articles" section
                    document.getElementsByClassName('widget-content widget-content-area')[4].remove() //remove infobox
                }
            }
        }
    }
}

/// @brief Suppress the warning message when you want to create an article
function hideMessageAddArticle() {
    if(options.hide_message_add_article) {
        if(document.getElementsByClassName("alert alert-icon-left alert-light-info mb-4").length>0) { //if you are in add article
            if(document.getElementsByClassName("widget-heading")[0].innerText=='Ajouter un Article') {
                document.getElementsByClassName("alert alert-icon-left alert-light-info mb-4")[0].remove() //remove infobx
            }
        }
    }
}

/// @brief Supress the warning message when you search article
function hideWarningSearch() {
    if(options.hide_warning_search) {
        if((window.location.pathname.search("index.php")==1||window.location.search.search(/\?do=search/g)==0)&&window.location.search.search(/\?do=pm/g)==-1) { //if you are in search
            document.getElementsByClassName("alert alert-light-info d-flex align-items-center")[0].remove(); //remove infobox
        }
    }
}

/*


                                                              .:HHHHHHHH:           HH:HHH:HHHHH
                                                             .HHHHHHHHHHHHHHHHHHHHHHHHHHHHHH:H:
                                                            HHHHHHHHHH.        :HHHHHHHHHHHHH.
                                                           :HHHHHHHHHH.           ..HHHHHH.

                                                             .HH:HHHHHHHHHH      :HHH:HHHHHHHH:
                                                              .:HHHHHHHHHH:      .HHHHHHHH:HHH.
                                                               .H::HHHHHHH.      .HHHHHHHHHHH
                                                                .HHHH.                 HHHHH
                                                                 .HH:H.   ALTANSAR    HHMHH
                                                                   HH.HH    ..::.    HHHHH
                                                                    :H:H:   HHHH.   HHMHH
                                                                     :H:..  :HHH. .HHHHM
                                                                      :HH:H .HHH::HHMH:
                                                                       :HHH :.:H::HHHH
                                                                        .HH.:HHHHHHHH
                                                                         .H :HHHH:H:
                                                                          . :HHHH::
                                                                            .HHMH.
                                                                            .MHH:
                                                                            .HHH:
                                                             .HHH::.:.::::::.HHHH .:::::::::::::
                                                               HHHHHHH:HHHHH:HHHH HHHHHHHHHHHHH
                                                               :HHHHHH:HHHHH HHHH HHHHHMHHHHHH.
                                                                 HHHHH       HHHH       HHHHH
                                                                 .HHHHH      HHHH      HHHH:
                                                                   :HHHH     MHHH     HHHHH
                                                                    .HHHH            HHHHH
                                                                      HHHH.         :HHH:
                                                                      .HHHH        :HHHH
                                                                        HH:H      :HHH:.
                                                                         HHHH.   :HHHH
                                                                          H:HH: ::HHH
                                                                           HHHHMHHHH
                                                                            :HHHHHH
                                                                             :HHHH
                                                                              .H:
                                                                               ..


                                                      Slovjanska unija
                                                   HMMMMMMMMMMMMMMMMMMMMMH
                                              MMMMMMMMMMMMMMMMM .M:  MMMMMMMMMM
                                           MMMM  MMMM.     MMMMMMMMMMM  MMMMMMMMMM
                                        MMMMMMMMMMMMMMM MMM        MMMMM   MM.  :MMMM
                                     MMMMMMMMMMMH.    MMMMMMMMMMMMMMMMMMMMM  MMMMM  MMMM
                                   MMM   .:HHH:.:HMMMMM.             :MMMMMMM   MMMM MMMMM
                                MMMM MMMM MMMMMMM.                         .MMMMMMMMM  MMMMMH
                               MMMMMMMMM MMMMM       :MMMMMMMMMMMM  MMMH       MMMMMMM  MMMMMM
                             MMMMMHMM   MMM     :MMMMMMMMMMMMMMMMM   MMMMMMM:     MMMMM  MMM:MMM
                            MMMMM.   HMM     MMMMMMMMMMMMMMMMMMMMM     MMMMMMMMM    .MMM: MMMM MM
                          MMMH  .MMMMM    MMMMMMMMMMMMMMMMMMMMMMMM      MMMMMMMMMMM    MMM  MMM:MMM
                         MM   MMMMMM    MMMMMMMMMMMMMMMMMMMMMMMMMM        MMMMMMMMMMM    MMM  MM MMM
                        MM MM MMMMM   MMMMMMMMMMMMMMMMMMMMMMMMMMMM         MMMMMMMMMMMM   MMMMMMH MMM
                       MMHMM MMMM   H                      MMMMMMM          :MMMMMMMMMMMM   MMMMM MMMM
                     HMM MM  MMM   MMM                     MMMMMMM            MMMMMMMMMMMM   MMMMM MMMM:
                    MMMMMM  MM   MMMMMMM                   MMMMMMM             :MMMMMMMMMMMM   MMM MM MMM
                    MMMM  MMM   MMMMMMMMM                  MMMMMMM               MMMMMMMMMMMM   MM: MM MM
                   MMMM :MMM   MMMMMMMMMMMM                MMMMMMM                MMMMMMMMMM     MM  MM MM
                  MMM .MMMM   MMMMMMMMMMMMMM               MMMMMMM               MMMMMMMMM    M   MM .MM MM
                 MMH.:MMMM   MMMMMMMMMMMMMMMMM             MMMMMMM             MMMMMMMMMM     MM   MM :M MMM
                 M MM MMM   MMMMMMMMMMMMMMMMMMM            MMMMMMM            MMMMMMMMM       MMM   MMMM.MMM
                MHMMM MMM  MMMMMMMMMM  MMMMMMMMM           MMMMMMM           MMMMMMMMM        MMMM  MMMM:MMMM
               :M MM  MM  MMMMMMMMM:     MMMMMMMMM         MMMMMMM         MMMMMMMMM          MMMMM  MMM:HMMM:
               MMMMM MM   MMMMMMMM        MMMMMMMMM        MMMMMMM        MMMMMMMMM           MMMMM   MM..MMMM
              MMMMM HMM  MMMMMMM:           MMMMMMMMM      MMMMMMM      MMMMMMMMM             MMMMMM  MM. HMMMM
              MMMM  MM.  MMMMMM:             MMMMMMMMM     MMMMMMM     MMMMMMMMM              MMMMMM  .M. M MMM
              MMM  MMM  MMMMMM                MMMMMMMMMM   MMMMMMM   MMMMMMMMMM               MMMMMMM  MM MM MM
             .MM: MMM:  MMMM:                   MMMMMMMMM  MMMMMMM  MMMMMMMMM                 MMMMMMM  :M MM.MM.
             MMM MMMM  MMMM                      MMMMMMMMMMMMMMMMMMMMMMMMMMM                  MMMMMMMM  MH MMMMM
             MM M MMM  MM:                         MMMMMMMMMMMMMMMMMMMMMMM                    MMMMMMMM  MMM .MMM
             M.MM MMM  M                            MMMMMMMMMMMMMMMMMMMMM                     MMMMMMMM  MMMM MMM
             M MM .M                                 MMMMMMMMMMMMMMMMMMM                      MMMMMMMM   MMM MMM
            :M MM  M   MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM   MMM MMM:
            HMMMM HM   MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM   MM MMMMH
            HMM M MM   MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM   MM MMMMH
            HMMMH MM   MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM   M. MHMMH
            :MMM MMM   MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM   M  MMMM:
             MMM MMM   MMMMMMMM                      MMMMMMMMMMMMMMMMMMM                                 M  MM.M
             MMM MMMM  MMMMMMMM                     MMMMMMMMMMMMMMMMMMMMM                            M  MMM M:MM
             MM:H::MM  MMMMMMMM                    MMMMMMMMMMMMMMMMMMMMMMM                         :MM  MMM M MM
             MM.MM .M  MMMMMMMM                  MMMMMMMMMMMMMMMMMMMMMMMMMMM                      MMMM  MMMM MMM
             .MMMMM M:  MMMMMMM                 MMMMMMMMM  MMMMMMM  MMMMMMMMM                   :MMMM  :MMM MMM.
              MM MM MM  MMMMMMM               MMMMMMMMMM   MMMMMMM   MMMMMMMMMM                MMMMMM  MMM  MMM
              MMMMM MM.  MMMMMM              MMMMMMMMM     MMMMMMM     MMMMMMMMM             :MMMMMM  .MM  MMMM
              MMMM: MMM  MMMMMM             MMMMMMMMM      MMMMMMM      MMMMMMMMM           :MMMMMMM  MM: MMMMM
               MMMM MMM   MMMMM           MMMMMMMMM        MMMMMMM        MMMMMMMMM        MMMMMMMM   MM MMMMM
               :MMM MMMM  MMMMM          MMMMMMMMM         MMMMMMM         MMMMMMMMM     :MMMMMMMMM  MM .MMHM:
                MMM:MMMMM  MMMM        MMMMMMMMM           MMMMMMM           MMMMMMMMM  MMMMMMMMMM  MMM MMM M
                 MMMM MMM   MMM       MMMMMMMMM            MMMMMMM            MMMMMMMMMMMMMMMMMMM   MMM MM M
                 MMM.MM MM   MM     MMMMMMMMMM             MMMMMMM             MMMMMMMMMMMMMMMMM   MMMMHM MM
                  MM MMM MM   M    MMMMMMMMM               MMMMMMM               MMMMMMMMMMMMMM   MMMMM .MM
                   MM MM. MM     MMMMMMMMMM                MMMMMMM                MMMMMMMMMMMM   MMMM  MMM
                    MM:MM .MM   MMMMMMMMMMMM               MMMMMMM                  MMMMMMMMM   MMM  MMMM
                    MMMM:M MMM   MMMMMMMMMMMM:             MMMMMMM                   MMMMMMM   MMM  MMMMM
                     :MMMM HMMMM   MMMMMMMMMMMM            MMMMMMM                     MMM   MMM  MM MM:
                       MMMM MMMMM   MMMMMMMMMMMM:          MMMMMMM                      H   MMMM MMMMM
                        MMM .MMMMMM   MMMMMMMMMMMM         MMMMMMMMMMMMMMMMMMMMMMMMMMMM   MMMMM.MM:MM
                         MMM M  MMMM    MMMMMMMMMMM        MMMMMMMMMMMMMMMMMMMMMMMMMM    MMMMMM H MM
                          MMM MM:  MMM    MMMMMMMMMMM      MMMMMMMMMMMMMMMMMMMMMMMM    MMMMMM   MMM
                            MM MMM  MMMM.    MMMMMMMMM     MMMMMMMMMMMMMMMMMMMMM    .MMM    MMMMM
                             MMM:.M: :MMMMM     :MMMMMMM   MMMMMMMMMMMMMMMMM:     MMM   HMMMMMMM
                               MMMMMM MMMMMMMM       HMMM  MMMMMMMMMMMM:       MMMMM HMMM MMMM
                                HMMMMM MMMHHMMMMM.                         .MMMMMMM MMMM MMMH
                                   MMMM  MMM:   MMMMMMM:             :MMMMMMMMMMMMMM:  MMM
                                     MMMM MMMMM.  MMMMMMMMMMMMMMMMMMMMM       :HMMMMMMMM
                                        MMMM :MHMM  MMMM        MMMMM MMMMMMM.MMMMMMM
                                           MMMMMMMMMM  MMMMMMMMM:    MMMMMM MMMMMM
                                              MMMMMMMMM:  :. MMMMMMMMM:.:MMMMMM
                                                   HMMMMMMMMMMMMMMMMMMMMMH
*/