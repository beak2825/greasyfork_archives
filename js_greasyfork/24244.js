// ==UserScript==
// @name        Enstyler Develop
// @namespace   dealz.rrr.de/develop
// @description MyDealz Enstyler enhanced features
// @author      gnadelwartz
// @license     LGPL-3.0; http://www.gnu.org/licenses/lgpl-3.0.txt
// @include     https://www.dealabs.com/*
// @include     https://nl.pepper.com/*
// @include     https://www.preisjaeger.at/*
// @include     https://www.mydealz.de/*
// @include     https://www.hotukdeals.com/*
// @include     https://userstyles.org/styles/128262/*
// @include     https://www.amazon.*
// @version     20.07.292
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @require     https://unpkg.com/umbrellajs
// @require     https://cdn.jsdelivr.net/gh/gnadelwartz/Enstyler@808bbfb40f089845f4d96e07eca419b14c73d86c/translations.js
// @require     https://cdn.jsdelivr.net/gh/gnadelwartz/GM_config@3bfccb1cb4238694566ec491ee83d8df94da18d5/GM_config-min.js
// @require     https://cdn.jsdelivr.net/gh/gnadelwartz/lz-string@a96e60cb8df3892ef8e4c4c700af9110122fbe61/lz-string.min.js
// @require     https://cdn.jsdelivr.net/gh/gnadelwartz/sjcl@20de886688dcabda2da1a42cd89790aacc987b09/sjcl.js
// @require     https://cdn.jsdelivr.net/gh/delight-im/ShortURL@5ddbfe89528637ff73212200773db876bbd0bebd/JavaScript/ShortURL.min.js
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/24244/Enstyler%20Develop.user.js
// @updateURL https://update.greasyfork.org/scripts/24244/Enstyler%20Develop.meta.js
// ==/UserScript==
// @ the original development source with comments can be found here: https://greasyfork.org/de/scripts/24244-enstylerjs-develop
// @ if you don't trust this minimized script use the development source.
// ========== INIT EnstylerJS =====================================
// init Enstyler environment
var DEBUG=true;
var DEBUGXX=true;
var DEBUGXXX=false;
var DEBUGINT=false;

// google such URL fur mydealz ...
// https://www.google.de/search?hl=de&output=search&q=test%20site:mydealz.de

// Parse location info
var enLocParser=location;

// get name of international site without www and domain
var enInterSite=enLocParser.hostname.replace('www\.','');
var enInterName=capitalizeFirstLetter(enInterSite.replace(/^\.|\..*/g,''));
var enInter=(enInterName != 'Mydealz');

// 1 day between update checks (in minutes)
var enUpdInt=1440;
var enMs2Min=60000; // will be shortend if Debug is on, use it for dealy
var enTime2Min=enMs2Min; // will stay with Debug, use it for real time conversion

var enUserLogin = false;
var enUserName = '';
var enSection = enLocParser.pathname.replace(/\/([^\/]+\/*).*/,'/$1');
var enValOff='off';
var enSyncKey=enValOff, enAutoSync=false;

// simple FF detection, for more browsers see section support function
// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';


// simple mobile detection
var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
// FF on Android lie about OS if you select desktop view
if (/Linux/i.test(navigator.userAgent) && typeof GM_info.scriptHandler !== 'undefined' && GM_info.scriptHandler.startsWith('USI')) { isMobile=true;}

// simple debug output function for mobile
// alert(navigator.userAgent);
var saveLog = 'enMobileLog';
var enDebugLog = console.error;


if (DEBUGINT) {
    enDebugLog = mobileLog;
} else {
    mobileClearLog();
}

if (DEBUG) {
    var  enInitTime = performance.now();
    enDebugLog('DEBUG activated');
    enDebugLog('International Site: '+enInterSite);
    enDebugLog('International Name: '+enInterName);
}

// set update/sync intervals 10 times faster
if (DEBUGXX) { enMs2Min=10000; }
if (DEBUGXXX) { enMs2Min=1000; }

// disable script if regex matches to path
var enDisableScript=/settings$/;


// Get default lang from site config
var enLangPat=/<EN-LANG:(.*?)>/g;
var enSiteLANG=typeof enSiteConfig[enInterName] === 'undefined' ? 'en' : enSiteConfig[enInterName]['lang'];
var enLANG=enSiteLANG;

var enHostpath=enLocParser.protocol+'//'+enLocParser.host+enLocParser.pathname;


// Basic Initialisation ==========================
function EnstylerInit () {
    // get LoginStatus and Username
    if ((enUserLogin = u('.avatar--type-nav').length)) {
        enUserName = u('.navDropDown a').attr(enHREF);
        enUserName = enUserName.replace(/.*\/profile\/([^\/]+).*/,'$1');
        GM_setValue('enCSyncUser', enUserName);

    } else {
        // get last user
        enUserName = GM_getValue('enCSyncUser','');
        //restore old last seen if user logs in
        // use this variant for dynamic loaded content click ...
        // $ (document).on("click",'.test-loginButton', EnstylerLastSeenLast);
    }
    if(DEBUG) {
        enDebugLog('User: ' +enUserName);
        enDebugLog('SyncKey: ' +enSyncKey);
        enDebugLog('AutoSync: ' +enAutoSync);
    }
    // get Section (first element in path)
    enSection= enLocParser.pathname.replace(/\/([^\/]+\/*).*/,'/$1');
    if(DEBUG) enDebugLog('Section: ' +enSection);


}

// add actions ==================================


// additional Deal Actions =======================
// code used for MyDealz Dealz actions, thanks to mydealz :-)
var enDealAction = [ '<a title="<EN-LANG:post>" class="space--h-1" style="font-size: xx-large"'+ // comment 0
                    'href="<ENSTYLER-HREF-HERE>#comment-form" data-handler="track" data-track="{&quot;action&quot;:&quot;scroll_to_comment_add_form&quot;,&quot;label&quot;:&quot;engagement&quot;}">+</a>',
                    '<a title="<EN-LANG:remove>"class="space--h-1" style="font-size: x-large"' + //un-bookmark 1
                    'data-handler="track replace" data-replace="{&quot;endpoint&quot;:&quot;https:\/\/www.mydealz.de\/threads\/<ENSTYLER-ID-HERE>/remove&quot;,&quot;method&quot;:&quot;post&quot;}" data-track="{&quot;action&quot;:&quot;save_thread&quot;,&quot;label&quot;:&quot;engagement&quot;}">-</a>',
                    '<a title="<EN-LANG:edit>" class="space--h-1" style="font-size: x-large"'+ // edit 2
                    'href="<ENSTYLER-HREF-HERE>/edit" data-handler="track" data-track="{&quot;action&quot;:&quot;goto_Update startededit_form&quot;,&quot;beacon&quot;:true}"><span>E</a>',
                    '<a title="<EN-LANG:mail>" class="space--h-1" style="font-size: x-large"'+ // mail 3
                    'href="mailto:?subject=<ENSTYLER-TEXT-HERE>" <span class="hide--toW3"><span>M</a>',
                    '<a title="<EN-LANG:mail>" class="btn btn--messenger btn--mail space--ml-2" style="background-color: #69BE28;"'+ //Mail social
                    'href="mailto:?subject=<ENSTYLER-TEXT-HERE>"><span class="ico ico--type-mail-white ico--reduce size--all-xxl"></span><svg width="22px" height="22px" class="icon icon--mail icon-u--1"><use xlink:href="/assets/img/ico_39d8b.svg#mail"></use></svg><span class="space--ml-2"><EN-LANG:mail></span></a>',
                    '<a title="<EN-LANG:telegram>" class="space--h-1" style="font-size: x-large" target="blank"'+ // Telegram 5
                    'href="https://telegram.me/share/url?url=<ENSTYLER-HREF-HERE>&text=<ENSTYLER-TITLE-HERE>" <span class="hide--toW3"><span>T</a>',
                    '<a title="<EN-LANG:telegram>" class="btn btn--messenger btn--mail space--ml-2" style="background-color: #10a0d0;" target="blank"'+ //Telegram social 6
                    'href="https://telegram.me/share/url?url=<ENSTYLER-HREF-HERE>&text=<ENSTYLER-TITLE-HERE>"><span class="ico ico--type-mail-white ico--reduce size--all-xxl"></span><svg width="17px" height="17px" class="icon icon--external icon-u--1"><use xlink:href="/assets/img/ico_39d8b.svg#external"></use></svg><span class="space--ml-2"><EN-LANG:telegram></span></a>',
                   ];
//var enDealSearch='<div class="tGrid-cell vAlign--all-m hAlign--all-r  space--r-3 width--all-4"><div class="aGrid box--all-i vAlign--all-m width--all-12 hAlign--all-l zIndex--popover" action="">'+
//                      '<div><div><button type="submit" aria-label="Finde">'+
//                         '<span class="search-button search-button--inactive text--color-grey"><svg width="20px" height="20px" class="icon icon--search"><use xlink:href="/assets/img/ico_0d108.svg#search"></use></svg></span></button>'+
//                         '<input id="enCommentSearch" name="enCom" value="" class="search-input input input--search width--all-12" type="search" placeholder="<EN-LANG:commentsearch>"> </div></div></div></div>';
var enDealFlame='<span class="vote-tempIco ico ico--type-flame2-red threadTempBadge-icon" style="position: absolute; display: block; margin-left: .3em; font-size: 2em;"></span>';
var enDealIce='<span class="vote-tempIco ico ico--type-snowflake-blueTint threadTempBadge-icon" style="position: absolute; display: block; margin-left: .3em; font-size: 2em;"></span>';
var enDealMarker='#thread_';
//var enDealNoAction='.ico--type-clock-grey, .vote-temp--colder';
var enDealAdd='', enSocialAdd, enCommentAdd; //enDealUnbook=false;
var enDealFooter='', enCCMail, enMyCSSID;
var myDealAction, myTouch, myFixHtml, myVotebar, myVotescale, myCompact, myPrice, myDealTime;

function EnstylerDealActions(){
    enTransTags=5;
    // if enabled ...
    if (myDealAction) {
        // compose Footer
        if (u('footer logo--brandmark').length) enDealFooter = ('%0D%0A%0D%0A-- %0D%0A'+ u('#footer > div:nth-child(1)  p.size--all-l.text--b').first().text());

        // use parsed location
        var pathname = enLocParser.pathname;
        var myText=0;
        // no username ??
        if (enUserName != "") {
            pathname = pathname.replace(enUserName + '/',''); // remove username if path is longer
        }
        // display short/no text?
        //if (u('.ico--type-grid-subNavActive, .thread-list--type-card ').length) { myText=1; }

        // default for all Dealz: first comment
        enDealAdd = enDealAction[0];

        // Action for special locations only ===========
        switch(true) {
                /*case (pathname.endsWith('profile/saved-deals')):
                // add for user saved-dealz: un-bookmark
                enDealAdd += enDealAction[1];
                //enDealUnbook=true;
                break;
                */

            case (pathname.endsWith('profile/diskussion')):
            case (enUserLogin && pathname.endsWith(enUserName)):
                // add user dealz and discussions: comment edit
                enDealAdd +=  enDealAction[2];
                break;
        }
        // default last: add mail and mail social
        // Compose final Deal Actions
        enDealAdd= enLangLocalize(enDealAdd + enDealAction[3] +  enDealAction[5],
                                  enDealLang, enLANG);

        enSocialAdd= enLangLocalize(enDealAction[6] + enDealAction[4] , enDealLang, enLANG);
        enCommentAdd= enLangLocalize(enDealAction[3] +  enDealAction[5], enDealLang, enLANG);

        // add search box to Comment header section
        //if (DEBUGXX) { enDebugLog('DealActionDo: add Search Box for Comments'); }
        //u('#thread-comments').find('div.cept-sort-order').before(enLangLocalize(enDealSearch, enDealLang, enLANG));
        //u('#enCommentSearch').handle('change', EnstylerCommentSearch);
    }
    EnstylerDealActionsDo();
}


// simple "search" callback for commenst search form
//function EnstylerCommentSearch(e) {
    // e is the triggered event
    // e.currentTarget dom element that triggers the event
//    alert("event triggered, element value: "+ u('#enCommentSearch').first().value);
//}

// hide comments on actual page not containing text
//function EnstylerHideComments(text) {
    //
    //
//}


function EnstylerDealActionsDo() {
    // if enabled ...
    // every thread on thread page ...
    var myID, myDesc, myDeal, myHref, newHtml, dealTemp, voteTemp, myTemp, overview, noComment, myBlack, myVotepos;
    enMyCSSID=enUserKey('');
    if (!(myDealAction || myTouch || myFixHtml || myVotebar || myPrice || enBlackTemp == enValOff)) { if(DEBUGXX) {enDebugLog('No DealAction active ... ');} return; }
    // process all articles not already seen
    if (DEBUGXXX) { enDebugLog('DealActionDo: Start'); }
    overview=u('.thread--type-list, .cept-listing--card').length;
    u('article').not('.enClassActionDone, .'+enClassHidden).each(function (that) {
        if (DEBUGXXX) { enDebugLog('DealActionDo: Article'); }
        u(that).addClass('enClassActionDone');
        // abort if not an "real" article
        if (u(that).hasClass('threadWidget--type-card--item')) { return; }
        myID=u(that).attr(enID);
        if(myID === null) { u(that).remove(); return; }
        if (DEBUGXXX) { enDebugLog('DealActionDo: get init values'); }
        // get userhtml
        myDeal =u(that).find('.thread-title a'); //title
        // overview=myDeal.length;
        // check if this is (not) a comment
        noComment=myID[0]!='c';

        // blacklist is now here
        if(enBlackTemp != enValOff) {
            if (DEBUGXXX) { enDebugLog('BlacklistDo id: '+ myID);}
            // this is NOT a comment
            if(noComment) {
                if (overview) {
                    if (DEBUGXXX) { enDebugLog('BlacklistDo Deal ...'); }
                    // get title, categorie, user, comment and remove unwanted chars
                    myBlack = (u(that).find('.thread-title a').text() + ' @' +u(that).find('a.user').text()).replace(unwantedRegex[1] ,' ');
                    myTemp=u(that).find('.vote-temp');
                    if(myTemp.text() !== null) { myTemp=parseInt(myTemp.text());} else { myTemp=9999; }
                } else {
                    myTemp=9999;
                    myBlack="";
                }
            } else {
                if (DEBUGXXX) { enDebugLog('BlacklistDo Comment ...');}
                // comment: get text and quoted user from comments
                myBlack = (u(that).find('.userHtml').text() + ' @' +u(that).find('a.user').text()).replace(unwantedRegex[1] ,' ');
                myTemp=0;
            }
            if (DEBUGXXX) { enDebugLog('BlacklistDo '+ (noComment? 'deal: ': 'comment: ') + myBlack); }

            // skip blacklist if whitelisted
            if ( !(enWhiteTrue && myBlack.match(enWhite))) {
                // vote temp & blacklist
                if (DEBUGXXX) { enDebugLog('BlacklistDo Dealtemp: '+ myTemp); }
                if (myTemp <= enBlackTemp || enBlackTrue  &&  myBlack.match(enBlack)) {
                    if (DEBUGXXX) { enDebugLog('BlacklistDo BLACK'); }
                    var parent=u(that).parent();
                    if (parent.hasClass("threadCardLayout--card")) {
                        parent.addClass(enClassHidden);
                    } else {
                        u(that).addClass(enClassHidden);
                    }
                    enBlacklisted++;
                    //EnstylerLastSeenSkip('#'+myID));
                }
            }
        }
        // remove unwanted HTML from deal text and comment
        if(myFixHtml) {
            u(that).find('.userHtml').each(function (that) {
                if (DEBUGXXX) { enDebugLog('DealActionDo: FixHmtl'); }
                // get inner html
                // remove unwanted Stuff: combined <div><br><br> stuff, created by cut'npaste html
                // not elegant, but works ...
                u(that).html(u(that).html().replace(/[^ -~¡-ÿ✘►○●✰€≠]+|(&nbsp;)+|(\n\r)+|<\/p>|<div>/g,' ')
                             .replace(/<\/div>/g, '<br>')
                             .replace(/<p>|<br>( *<br>)+/g,'<br><br>')
                             .replace(/(<li>)(<br>)+|<br>*(<br><\/li>)/g, '$1')
                            );
            });
        }
        // place price in Button
        if (myPrice && noComment) {
            if (DEBUGXXX) { enDebugLog('DealActionDo: PriceButton'); }
            myBlack=u(that).find('.thread-price.text--b');
            if (myBlack.length) {
                newHtml=u(that).find('.cept-dealBtn');
                if (newHtml.hasClass('ico--type-redirect-white')) {
                    newHtml.html(myBlack.html());
                } else {
                    newHtml.html(myBlack.html()+'<span class="ico ico--type-redirect-white size--all-xl space--l-1"></span>');
                }
                u(that).find('.cept-tb').html(myBlack.html());
            }
        }

        // add deal actions to deal only, not comment
        if(myDealAction && noComment) {
            if (!overview) {
                // in deal detail we have no deal link
                myDeal =u(that).find('.thread-title');
                enTransTags=20; // translate more in deal
            }
            if (DEBUGXXX) { enDebugLog('DealActionDo: myDeal: ' + myDeal.text()); }
            // translate deal titles
            enTranslateGoogle(myDeal);

            // check Deal temp and do action based on it
            dealTemp=u(that).find('.vote-temp');
            if (dealTemp.length) {
                dealTemp = parseInt(dealTemp.text());
                // deal meter
                if (myVotebar) {
                    // get temp color
                    myTemp=u(that).find('.vote-temp').attr('class').replace(/.*charcoal|.*vote-temp--/i, '');
                    if (DEBUGXXX) { enDebugLog('DealActionDo: Temp ' + dealTemp + ' color: ' + myTemp); }
                    voteTemp=dealTemp/(myVotescale/70)+5;
                    if (voteTemp <0) voteTemp *=-3;
                    // votebar position
                    myVotepos=that;
                    if (!overview) { myVotepos=u(u(that).find('div').first());}

                    u(myVotepos).prepend('<div class="votebar vote-progress voteBar--'+myTemp+'" style="width: '+voteTemp+'%;"></div>');
                    // place flame/ice if not type card
                    if (u(that).hasClass('thread--type-card')) { dealTemp=0; }
                    if (dealTemp > myVotescale/2.51) {
                        if (DEBUGXXX) { enDebugLog('DealActionDo: HOT ' + myDeal); }
                        u(myVotepos).prepend(enDealFlame);
                    } else if (dealTemp < -myVotescale/10.1) {
                        if (DEBUGXXX) { enDebugLog('DealActionDo: COLD ' + myDeal); }
                        u(myVotepos).prepend(enDealIce);
                    }
                }
            }

            // we are in Deal overview
            if(overview) {
                if (DEBUGXXX) { enDebugLog('DealActionDo: add Action Overview'); }
                u(that).find('span.meta-ribbon.hide--toW3').removeClass('hide--toW3');
                // let price flow
                u(that).find('.threadGrid-title .thread-title.lineClamp--2').removeClass('lineClamp--2');
                // get link and compose final HTML for deal actions/1
                myHref=enMinimzeHref(myDeal.first().outerHTML.replace(/\n|\r|\t/g,'').replace(/^.*href="/, '').replace(/".*/,''));
                newHtml = enDealComposeAction(u(that), myDeal.text(),  myHref, enDealAdd.replace(enPATTERN[enTITLE],myDeal.text()));

                // append aextra actions to Deal
                u(that).find('.cept-comment-link').append(newHtml);

            } else  { // we are in deal detail
                if (DEBUGXXX) { enDebugLog('DealActionDo: add Action Deal'); }
                // compose final HTML for social buttons
                newHtml=enDealComposeAction(u(that), myDeal.text(), enMinimzeHref(enLocParser.toString()), enSocialAdd.replace(enPATTERN[enTITLE],myDeal.text()));
                // append HTML to Deal
                u(that).find('a.btn--twitter').parent().append(newHtml);

            }
        }

        // translate description
        myDesc=u(that).find('.userHtml');
        if (myDesc.length) { enTranslateGoogle(myDesc); }
    });
    // set label for unBlacklist button
    EnstylerBlacklistShow();
}

// helper function for composing mail deal action
function enDealComposeAction(deal, subject, href, action) {
    if (DEBUGXX && typeof href === 'undefined') { href=''; enDebugLog('enDealComposeMail href missing!');}
    // compose mail subject
    subject=encodeURIComponent((enUserName == 'Gnadelwartz' ? 'KayDealz' : enInterName )+': '+subject.replace(/\r|\n|\t/g, ' ').replace(/  */g, ' '));
    if (subject.length < 100 && deal.find('span.thread-price').length) {
        // add ' ->\xa0price'
        subject += encodeURIComponent(' ->\xa0' + deal.find('span.thread-price').text().replace(/ |\t/g, ''));
    }
    // replace href minimized href
    href=enMinimzeHref(href);
    // compose final HTML
    return (action.replace(enPATTERN[enHREF], '\n\r'+href)
            .replace(enPATTERN[enTEXT], truncStringWord(subject, 160, '%20') +'&body=' +subject +'%0D%0A%0D%0A' + href +enDealFooter));
}

// helper function to create a short MD Deal link
function enMinimzeHref(href) {
    href=href.replace(/(.*)\/.*-/, '$1/md-');
    if (enCCMail && !href.startsWith('https://dealz.rrr.de/')) { href=href.replace(/^https:\/\/.*?\//, 'https://dealz.rrr.de/'+ enInterName +'/') +'?ID=' + enMyCSSID; }
    return href;
}


// blacklist do not show dealz containing blacklistet words ==========================
// search in kategorie, dealtitle, and username
var enClassHidden = 'enClassHidden';
var enClassBlackDone = 'enClassBlackDone';
var enBlacklisted=0;

var unwantedRegex = [ /[\[\]\(\)\{\}\?\:\;\!\"\*\+\ ]/g, // in White/Backlist
                     /[\[\]\(\)\{\}\?\.\:\;\!\"\*\+\,\n\r\t]+/g  // in Dealtext
                    ];
var enBlack, enBlackTrue;
var enWhite, enWhiteTrue;
var enBlackTemp;
function EnstylerBlacklist() {
    // if logged in and user is not in whitelist
    if (enUserLogin && ! GM_config.get('enConfWhitelist').includes(enUserName)) {
        // add actual user to whitelist
        GM_config.set('enConfWhitelist', '@'+enUserName +',' + GM_config.get('enConfWhitelist'));
        //GM_config.setValue('enConfWhitelist', GM_config.get('enConfWhitelist'));
    }
    if (DEBUGXXX) { enDebugLog('Blacklist: init ...'); }
    // convert Black/Whitelist to RegEx, escape regex characters but keep '.' (any char)
    var myBlack=GM_config.get('enConfBlacklist').replace(unwantedRegex[0], '');
    enBlack=RegExp(myBlack.replace(/^,|,$/g,'').replace(/(.),(.)/g,'$1|$2'),'i');
    enBlackTrue=!' '.match(enBlack);
    // warn user about regex error
    if (!enBlackTrue && myBlack != '') alert(confLang('regexfailed'));

    enWhite=RegExp(GM_config.get('enConfWhitelist').replace(/^,|,$/g,'').replace(/(.),(.)/g,'$1|$2'),'i');
    enWhiteTrue=!' '.match(enWhite);

    enBlackTemp= GM_config.get('enCBlackC');

    // only if blacktemp is not off
    enBlackTrue=(enBlackTrue && enBlackTemp != enValOff);
    if (DEBUGXXX) { enDebugLog('Blacklist: ' + (enBlackTrue ? 'on': 'off') +' Temp: ' + enBlackTemp); }

    //moved to EnstylerDealActions
    //EnstylerBlacklistDo();
}

// blacklist support functions ....

function EnstylerBlacklistShow() {
    enConfDefs.default.enCUnblackL.label=enUnblackText.replace(enPATTERN[enTEXT],enBlacklisted);
}


function EnstylerBlacklistUnhide() {
    enBlacklisted=0;
    EnstylerBlacklistShow();
    u('.'+enClassHidden).removeClass(enClassHidden);
}


// create select page or scrollwheel for page navigation =============

/*
var enPEnum='enPageEnum';

var selectList = document.createElement("select");
selectList.id = enPEnum;
selectList.setAttribute('class', enPEnum);
selectList.onchange = EnstylerPageAction;

function EnstylerPagePickerCreate() {
    // revome existing picker
    //EnstylerPagePickerRemove();

    // if enabled
    if (GM_config.get('enCPageP')) {
        // init values and clear select list
        var page=1, max=1, i, diff, last, option;
        u(selectList).empty();

        // get page and max from pagenav
        var lastpage = u('nav .cept-last-page');
        if ( lastpage.length ) {
            // get from page menu
            var actpage  = u('nav .pagination-page .hide--fromW2');
            //locate actual page and last page
            if( isNaN(page = parseInt(actpage.html()) ))  { page=1;}
            if( isNaN(max  = parseInt(lastpage.html()) )) { max=page;}
        } else {
            // get from URL
            if (enLocParser.search.length) {
                page = parseInt(enLocParser.search.replace(/.*=/,''));
            } else {
                page=1;
            }
            max=page;
        }
        if (DEBUGXXX) { enDebugLog('PickerCreate: page: '+ page + ' max: ' +max); }
        // create page select element
        for (var x = 1; x <= max; ) {
            option = document.createElement("option");
            option.text = x;
            selectList.add(option);
            last = x;

            // non linear increment
            diff = Math.abs(page-x);
            if ( x < 10 || diff < 5) { x++; }
            else if ( x < 1000 && diff > 600) { x += diff/3.5; }
            else { x += Math.floor(diff/2); }
            if (diff>9 && x>9) { if (diff<50 || x<50) { x=Math.floor(x/2)*2; } else { x=Math.floor(x/5)*5; } }
            if (DEBUGXXX) { enDebugLog('PickerCreate: next picker: '+  x); }
        }

        // add last page
        if (page > max) { max=page;}
        if (last < max ) {
            option = document.createElement("option");
            option.text = max;
            selectList.add(option);
        }
        // set default value
        selectList.value = page;

        // placement of MAIN Picker
        var MainPicker= ['.js-navDropDown-messages', //Element
                         enPEnum+' js-navDropDown-messages vAlign--all-m' //class
                        ];
        // login button present in Mainnav
        if (u('.test-loginButton').length) {
            MainPicker[0]='.test-loginButton'; //Element
        }
        // in deal always in sticky votebar (was in subnav)
        if (u('.voteBar').length) {
            MainPicker= [ '.voteBar--sticky-off--hide.hAlign--all-r', // Element
                         enPEnum +' subNavMenu-link subNavMenu-btn voteBar--sticky-off--hide' //class
                        ];
        }

        // Main  Picker add class and palce before element
        selectList.setAttribute('class',MainPicker[1]);
        u(MainPicker[0]).before(selectList);
    }
}

function EnstylerPagePickerDo() {
    // get page from URL
    if (enLocParser.search.length ) {
        if(DEBUG) enDebugLog('Picker from URL: '+ location.search);
        selectList.value = parseInt(location.search.replace(/.*=/,''));
    } else {
        selectList.value = 1;
    }
}
*/


// goto selected Page
//function EnstylerPageAction() {
//    var e = document.getElementById(enPEnum);
//    var enPage = 'page=' + e.options[e.selectedIndex].value;

    // remove page= and everthing behind
//    var enUrl = enLocParser.toString().replace( /page=.*|#.*/ ,'');

    // add new page parameter
//    if ( enUrl.endsWith('?') ||  enUrl.endsWith('&')) {
//        enUrl += enPage;
//    } else {
//        enUrl += '?'+enPage;
//    }

    // add #thread-comments for deal
//    if (enSection == '/deals/') { enUrl += '#thread-comments';}
//    window.location = enUrl;
//}


// Main Nav will stay on TOP of the screen =========================
var myFixedCSS = { every:  '.enFixedNav { display: block; position: fixed; width: 100%; z-index: 120;} .listingProfile {margin-bottom: -55px}'+
                           '.listingProfile, .subNav, .profileHeader, .tabbedInterface, .splitPage-wrapper {margin-top: 55px}',
                  subnav: '.subNav {margin-top: 0 !important;} .nav-subheadline {margin-top: 55px}',
                  discus: '.tGrid.page2-center.height--all-full {margin-top: calc(55px + 10px);} #footer .page-content { padding-top: calc(55px + 10px);}'
                 };

function EnstylerFixedNav() {
    // place emergency button in case menu dores not work, addd zahnrad
    var myButton=u('.subNavMenu .subNavMenu-layer').first();

    if (GM_config.get('enCNavF')) {
        // everywhere but in Deal detail, I like it like it is ...
        if (enSection != '/deals/' && enSection != '/gutscheine/' ){
            // delete header element with active stuff, but keep inside HTML
            var mySavedHtml = u('header.js-sticky').html();
            u('header.forceLayer').replace('<header class="enFixedNav">'+mySavedHtml+'</header>');

            // fixed NAV for everywhere
            var myFixedStyle=myFixedCSS['every'];

            // additionla CSS for different sections
            if (enSection == EnstylerSiteConfig('discussion')) {
                if (DEBUGXX) { enDebugLog('FixedNav DICUSSION detected'); }
                myFixedStyle+=myFixedCSS['discus'];
            }
            if (u('.nav-subheadline').length || enSection=='/profile/') {
                // additional CSS for categories
                myFixedStyle+=myFixedCSS['subnav'];
            }
            //myFixedStyle= myFixedStyle.replace(enPATTERN[enTEXT], enMainHeigth);
            addStyleString(myFixedStyle);
        } else {
            // not in deal or gutscheine, place in sticky nav
            myButton=u('.vote-box').first();
        }
    }
    if (myButton) { myButton.after(enMenuButton); }
}

// the return of "gestern xx:xx Uhr" ==============
var DealDate=new Date();
var TodayStart=new Date();
var EnstylerTimeSeen='enTimeSeen';
var today='', oclock='', yesterday='';

function EnstylerDealTime() {
    TodayStart.setHours(0,0,0,0);
    // get localized values onyl once, set today and clock only if not in card
    //if (!u('section.thread-list--type-card').length) {
    today=enLangLocalize('<span class="hide--toW2"><EN-LANG:today>&nbsp;</span>', enTimeLang, enLANG);
    oclock=enLangLocalize('<span class="hide--toW2">&nbsp;<EN-LANG:oclock></span>', enTimeLang, enLANG);
    //}
    yesterday=enLangLocalize('<EN-LANG:yesterday> ', enTimeLang, enLANG);
    EnstylerDealTimeDo();
}

function EnstylerDealTimeDo() {
    if (myDealTime) {
        var myNow=Date.now();
        var myTimeText, myDealDiff, myOclock;
        // process every article, optimization: not if class TiemSeen
        u('.meta-ribbon, time, .metaRibbon').not('.'+EnstylerTimeSeen).each(function (that) {
            u(that).addClass(EnstylerTimeSeen);

            // we have no datetime, lets parse text
            myTimeText= u(that).html();
            // german long tome ago fix
            if (myTimeText.includes(" am ")) { return; }
            // parse time string directly
            DealDate.setTime(myNow - ((parseInt(myTimeText.replace(/.* ([0-9].*) [hu].*|.*/, '$1'))*60+parseInt(myTimeText.replace(/.* ([0-9].*) m.*|.*/, '$1')))*enTime2Min));

            // calculate Diff
            myDealDiff=((myNow-DealDate)/enTime2Min); //diff in minutes
            myOclock=DealDate.toString().slice(16, 21);
            if (DEBUGXXX) { enDebugLog('DealTimeDo: myTimeText: ' + myTimeText); }
            switch (true) {
                case (myOclock.length <5 || myDealDiff < 60 ): // < 1h > 5 days
                    return;
                case (myDealDiff > 1440): // > 24h
                    myTimeText += '&nbsp;(' + myOclock + oclock +')';
                    break;
                case (DealDate < TodayStart): // < last midnigth
                    myTimeText= yesterday + myOclock + oclock;
                    break;
                default:
                    myTimeText += '&nbsp;(' + today + myOclock + oclock +')';
            }
            u(that).html(myTimeText);
        });
    }
}

// mark last seen Deal in Highligth, Hot and New ============================
// GM variables used here
// store newest loaded deal
// 'enNewestDeal...new'
// 'enNewestDeal...hot'
// 'enNewestDeal...'
// international support added
var enNewestBase='enNewest'+enInterSite;
var enSec= enNewestBase +'-'+ enSection.replace(/\//, '');
var LastSeenOnce=true;
var enSeArt='', enLaArt='';

function EnstylerLastSeen(){
    // only once and in main categories
    if(LastSeenOnce) {
        LastSeenOnce=false;
        if (DEBUGXX) { enDebugLog('Enter LastSeen : '+ enSec ); }
        // store last seen for Main catergories
        if(enSection.match(enMainSectionMatch)) {
            // get section and save
            // GM_setValue(enNewestBase+'LastSec', enSec)
            // get last seen article
            enSeArt=GM_getValue(enSec, '');
            if (DEBUGXXX) { enDebugLog('LastSeen old: '+ enSec +' '+ enSeArt); }
            SyncLastSeen();
            EnstylerLastSeenDo();
            // save actual last seen
            if(enLocParser.search == '') {
                var mySkip=false;
                u('article').not('.threadWidget-item').each(function (that) {
                    // already found or pinned ?
                    if (mySkip || u(that).find('.cept-pinned-flag').length!=0) {return;}
                    if (DEBUGXXX) { enDebugLog('LastSeen found actual last: '+ enSec + ': '+u(that).attr(enID)); }

                    //store actual seen
                    GM_setValue(enSec, u(that).attr(enID));
                    //store last seen last
                    GM_setValue(enSec+'Last', enSeArt);
                    if (DEBUGXXX) { enDebugLog('LastSeen stored: '+ enSec + ': ' +GM_getValue(enSec,'') +' last: ' +GM_getValue(enSec+'Last','')); }
                    SaveLastSeen();

                    // found, break loop
                    mySkip=true;
                    return;
                });
            }
        } else {
            // if we are not in main categorie => restore last value
            EnstylerLastSeenLast();
        }
    }
}

function EnstylerLastSeenDo(){
    // only in main categories
    if (DEBUGXX) { enDebugLog('Enter LastSeenDo: ' + enSec); }
    if(enSec != '') {
        // mark last seen article
        if (DEBUGXX) { enDebugLog('LastSeenDo Execution: '+ enSec +' '+ enSeArt); }
        GM_setValue('enLastCheck' + enSec, Date.now()/enMs2Min);
        if (enSeArt) {
            //store last marked
            GM_setValue(enSec+'Last', enSeArt);
            // mark NEXT availible article
            var myMark=u('#'+enSeArt);
            if (DEBUGXX) { enDebugLog('LastSeenDo Marking: #'+ enSeArt + ' #'+enLaArt); }
            while(!typeof myMark === "undefined" && ( myMark.hasClass(enClassHidden) || myMark.nodes[0].tagName == "DIV") ) {
                myMark=u(myMark.nodes[0].nextElementSibling);
                //alert(myMark.html())
            }
            myMark.addClass('enClassMarkArticle');
            // mark next LAST availible article
            if(enLaArt.startsWith('thread_')) {
                myMark=u('#'+enLaArt);
                while(!typeof myMark === "undefined" && ( myMark.hasClass(enClassHidden) || myMark.nodes[0].tagName == "DIV" )) {
                    myMark=u(myMark.nodes[0].nextElementSibling);
                }
                myMark.addClass('enClassMarkArticleLoad');
            }
        } else {
            // first time
            GM_setValue(enSec, 'thread_1');
        }
    }
}

// restore last seen from last_last seen
function EnstylerLastSeenLast(){
    // restore last value
    var lastSec=GM_getValue(enNewestBase+'LastSec','');
    GM_setValue(lastSec, GM_getValue(lastSec +'Last',''));
}


// check and get Updates of Enstyler2 CSS ================================

var enUpdateUrl = 'https://userstyles.org/styles/128262/enstyler2-style-your-mydealz.css'; // production version

function enCheckUpdates() {
    // get time and convert to minutes
    var myDiff= (Date.now()/enMs2Min) - GM_getValue('enLastUpdateCheck','0');
    // css is empty
    if (GM_getValue('MyCSS','').length < 10) {
        if(DEBUGXX) enDebugLog('No chached CSS found');
        myDiff=-1;
    }
    // if option set and time expired
    if(DEBUGXX) enDebugLog('Update requested, intervall '+enUpdInt+' minutes , actual diff '+parseInt(myDiff));
    if (myDiff > enUpdInt || myDiff < 0 || DEBUGXXX) {
        // store actual time
        if(DEBUGXX) enDebugLog('CSS Update started');
        enUpdateCSS();
    }
}

var MyCSS='Enstyler2_CSS';

function enUpdateCSS() {
    var myTime=parseInt(Date.now()/enMs2Min);
    var myOptions=enComposeUpdateOpt();
    enCacheExternalResource( enUpdateUrl + myOptions, MyCSS);
    GM_setValue('enLastUpdateCheck', myTime);
    enSaveMyCSS();
}

var enCssOpt='EnstylerCssOpt';

function enComposeUpdateOpt() {
    // get saved options, remove newlines and split to settings array
    var myOptions=GM_getValue(enCssOpt, '');

    // abort if no options found
    if (myOptions=='' || !myOptions.startsWith('#')) {return "";}

    myOptions=myOptions.replace(/\n/g,'');
    var mySettings = myOptions.split(';');

    // start composing options
    myOptions='';
    for (var i=0; i< mySettings.length; i++) {
        //if(DEBUG) enDebugLog('process:' + mySettings[i]);
        if(mySettings[i]=='') continue;

        // each Setting has 3 fields seperated by :
        var myField=mySettings[i].split(':');
        if(myField.length < 2) continue;
        // add &setting=value

        myOptions += '&' +myField[1].slice(0, -1) + '=' + myField[1];
    }

    // replace first & by ? and returns string
    myOptions = '?'+myOptions.slice(1);

    if(DEBUG) enDebugLog(myOptions);
    return myOptions;
}


// compose Nav Menu items  =======================================
// i.e. create button for display Config ======================
// define pattern actions here, incl. international support
// Main sections, no deal or details
var enMainSectionMatch=/^\/$|^\/hot$|^\/new$|^\/settings$|^\/discussed$|^\/hei%C3%9F$|^\/diskutiert$/;

var enHREF='href', enID='id', enTEXT='text', enTITLE='title';
var enPATTERN =  { href: /<ENSTYLER-HREF-HERE>/g,     // pattern to insert link ...
                  id:   /<ENSTYLER-ID-HERE>/g, // pattern to insert ID
                  text: /<ENSTYLER-TEXT-HERE>/g,     // pattern to insert Text
                  title: /<ENSTYLER-TITLE-HERE>/g,     // pattern to insert Title
                 };

var enNavEntry='enNavEntry';
var enMenuItemCode = { Main: '<a class="space--h-2 lbox--v-4 enNavEntry navMenu-link" id="<ENSTYLER-ID-HERE>" href="<ENSTYLER-HREF-HERE>" data-handler="track" data-track="{&quot;action&quot;:&quot;goto_main_target&quot;,&quot;beacon&quot;:true}"><span class="lbox--h-4"><svg width="24px" height="20px" class="icon icon--comments"></span><ENSTYLER-TEXT-HERE></a>',
                      Sub:  '<li class="enNavEntry subNavMenu-item--separator test-tablink-discussed"><a  href="<ENSTYLER-HREF-HERE>" class="subNavMenu-item subNavMenu-link space--h-4 vAlign--all-m" id="<ENSTYLER-ID-HERE>" data-handler="track" data-track="{&quot;action&quot;:&quot;goto_menu_target sort&quot;,&quot;label&quot;:&quot;diskutiert&quot;,&quot;beacon&quot;:true}"><span class="box--all-i size--all-xl vAlign--all-m"><ENSTYLER-TEXT-HERE></span><span class="js-vue-container--threadcount" data-handler="vue" data-vue="{&quot;count&quot;:null}"></span></a></li>',
                      MainButton: '<a class="space--h-2 lbox--v-4 enNavEntry navMenu-link" id="<ENSTYLER-ID-HERE>"><span class="lbox--h-4"><svg width="24px" height="20px" class="icon icon--comments"></span><ENSTYLER-TEXT-HERE></a>',
                      //SubButton:  '<li class="enNavEntry subNavMenu-item--separator test-tablink-discussed"><a  class="subNavMenu-item subNavMenu-link space--h-4 vAlign--all-m" id="<ENSTYLER-ID-HERE>"><span class="box--all-i size--all-xl vAlign--all-m"><ENSTYLER-TEXT-HERE></span></a></li>'
                     };
var enNavGrid ='<div id="enButt"><a title="Grid Layout" id="enGrid" href="'+enHostpath+'?layout=grid"><img src="https://dealz.rrr.de/enstyler/grid.png"></a>'+
    '<a title="List Layout" id="enList" href="'+enHostpath+'?layout=horizontal"><img src="https://dealz.rrr.de/enstyler/list.png"></a>'+
    '<a title="Text Layout" id="enText" href="'+enHostpath+'?layout=text"><img src="https://dealz.rrr.de/enstyler/text.png"></a></div>';

var enNavCSS='#enGrid, #enList, #enText { padding: 0.5em; } #enButt {left: 3em; top: 1em; padding-left: 4em; display: inline-block;}';

//var var enMenuSub=1; var enMenuSubButton=3;
var enMenuItemLength= enMenuItemCode.length;

var EnstylerButton = 'EnstylerButton';
// emergency config button
var enMenuButton = document.createElement('input');
enMenuButton.type = 'button';
enMenuButton.setAttribute(enID, 'emergency');
enMenuButton.onclick = showEnstylerConfig;
enMenuButton.value = 'Enstyler';
enMenuButton.setAttribute('style', 'cursor: pointer; padding-left: 1em; padding-bottom: 0.5em; font-weight: 600; font-size: 10px !important; color: #FFCC00 !important;');
enMenuButton.setAttribute('title', 'Enstyler Einstellungen');
// compose default Enstyler Menu
function EnstylerMenuActions(){
    // add Enstyler Homepage
    EnstylerAddNav('Main', '<EN-LANG:enstyler>', '<EN-LANG:enhref>" target="_blank','enMainHomepage', 'home');
    EnstylerAddNav('Main', 'Enstyler Discussion', 'https://t.me/joinchat/IvvRthRhMcX6rDQU-pZrWw','enMainHomepage', 'page');
    EnstylerAddNav('MainButton', '<EN-LANG:settings>', showEnstylerConfig, EnstylerButton, 'gear-grey');
    EnstylerAddNav('Main', 'Deal-O-Mat / Telegram Groups', 'https://dealz.rrr.de/deal-O-mat/','enMainHomepage', 'home');

    // add to Sub Nav
    //EnstylerAddNav(enMenuSubButton, '<EN-LANG:settings>' , showEnstylerConfig, EnstylerButton)
}


// add to Nav ======================
// nav = menu action
// text = menu text
// target = URL to show, in case of Button function to call
// Icon can be home-navMenuLayerText, tag-navMenuLayerText, scissors-navMenuLayerText, free-navMenuLayerText,
//             discussion-navMenuLayerText (default), building-navMenuLayerText, star-navMenuLayerText, snowflake-navMenuLayerText,
//             page-navMenuLayerText (button), star-navMenuLayerText (button) or any regular icon
var enNavIconPat='#discussion';

///assets/img/ico_4c8c5.svg#

function EnstylerAddNav(nav,text,target,ID, Icon) {
    if (typeof Icon === 'undefined' || Icon == '') Icon=enNavIconPat;
    var isFunc=false;
    if(DEBUGXXX) enDebugLog('MenuAdd meue entry: '+text);

    // compose menu entry
    var myEntry = enMenuItemCode[nav].replace(enPATTERN[enID],ID).replace(enPATTERN[enTEXT],text);
    if(Icon !=enNavIconPat) { myEntry = myEntry.split(enNavIconPat).join('#'+Icon);}

    // target can be a function
    if (typeof target === "function") { isFunc=true;
                                      } else {
                                          myEntry = myEntry.replace(enPATTERN[enHREF],target);
                                      }

    if (nav[0]== 'M') { // Main Menu
        // first Main menu entry, start listen to klick
        if(enAddMain == '')  {
            if(DEBUGXXX) enDebugLog('MenuAdd assign on(\'click\') to .nav-link.navMenu-trigger');
            u('.nav-link.navMenu-trigger').on('click', function() {setTimeout(EnstylerMainDo, 200);});
        }
        enAddMain += myEntry;
        if (isFunc) { enAddMainFunc[enAddMainCount++]= { ID: ID , target: target}; }
    }
    /*  else {
            // ad to Subnav, click if visible
            u('.subNavMenu-list').append(myEntry);
            if(isFunc) { u('#'+ID).on('click', target); }

            // handler if dropdown, start listen to klick
            if(enAddSub == '')  { u('.subNavMenu-trigger').on('click', function() {setTimeout(EnstylerSubDo,300); enAddSub='done';} }
            if(isFunc) { enAddSubFunc[enAddSubCount++]= { ID: ID , target: target}; }
    }
/**/

}

// Show items in Sub / Main Menu =====
// store ID and function to call on click
var enAddMain='';
var enAddMainFunc= [ ];
var enAddMainCount=0;
var enAddMainDone=false;
function EnstylerMainDo() {
    //add items
    if(DEBUGXXX) enDebugLog('MenuMain started ...');
    if(enAddMainDone) { if(DEBUGXXX) enDebugLog('... Main menu already done'); return; }
    enAddMainDone=true;
    u('.popover-content nav .navMenu-div').first().insertAdjacentHTML('beforebegin',enLangLocalize(enAddMain, enMenuLang, enLANG));

    // create space for new entrys
    var myMenu=u('.popover--mainNav');
    // +35px per new items
    var myHeigth= 35*(enAddMain.split(enNavEntry).length -1) + parseInt(myMenu.attr('style').split('height: ')[1]);
    myMenu.attr('style',myMenu.attr('style').replace(/height: [0-9.]*px/,'height: '+myHeigth+'px'));

    // add button callbacks
    for (var i=0; i<enAddMainCount; i++ ) {
        u('section #' + enAddMainFunc[i].ID).on('click', enAddMainFunc[i].target);
    }
}

/*
var enAddSub='';
var enAddSubFunc= [ ];
var enAddSubCount=0;

function EnstylerSubDo() {
      // klick event handler, call with debounce( 300) to wait until menu is created and avoid double klicks
      //add items
      if(DEBUG) enDebugLog('Add Menu Items to Sub ...')
      for (var i=0; i<enAddSubCount; i++ ) {
          $ ('section #' + enAddSubFunc[i].ID).click(enAddSubFunc[i].target);
      }
}
/**/

/*
function EnstylerNavRemove() {
    // Clear Menu Items stored
    enAddMain='';
    enAddMainFunc= [ ];
    enAddMainCount=0;
    u('.navMenu-page').off('click');

    // remove visible items
    u('.'+enNavEntry).remove();

} */


// ============= GM_config functions =======================================
//var enJSAutoUpdate=GM_info.scriptWillUpdate;
var enUpdateWindow;

var enUnblackText =  enLangLocalize('<EN-LANG:unblack> <ENSTYLER-TEXT-HERE> Dealz', enConfigLang, enLANG);
function confLang(key) { return enLangLocalize('<EN-LANG:' + key + '>', enConfigLang, enLANG); }
function confMess(key) { return enLangLocalize('<EN-LANG:' + key + '>', enMessageLang, enLANG); }

// define EnstylerJS GM_config elements
var enConfDefs= [];

enConfDefs['default'] = {
    // Part one: load external content --------
    'enCSS': {
        'label': confLang('configcss'),
        'title': confMess('configcss'),
        'type': 'button', // a button input
        'click': function() { // Function to call when button is clicked
            enUpdateWindow=window.open('https://userstyles.org/styles/128262','UserCSS', 'left=0,top=0');
            GM_setValue('enLastUpdateCheck', 0);
        }
    },
    'enJS': {
        'label': confLang('userscript'),
        'title': confMess('userscript'),
        'type': 'button',
        'click': function() { // Function to call when button is clicked
            enUpdateWindow=window.open(!DEBUG ? 'https://greasyfork.org/scripts/24243-enstylerjs/code/EnstylerJS.user.js' :
                                       ' https://greasyfork.org/scripts/24244-enstylerjs-develop/code/EnstylerJS Develop.user.js',
                                       'UserScript', 'width=210,height=210,left=0,top=0');
            // give 5s to start update, then close
            setTimeout(enUpdateWindow.close,5000);
        }
    },

    // part two: EnstylerJS internal configuration options ------
    // fixed main nav
    'enCNavF': {
        'label': confLang('navfixed'),
        'title': confMess('navfixed'),
        'type': 'checkbox', // a checkbox input
        'default': true,
        'section': [confLang('config'), '']
    },
    // width of deal panel
    'enCMax': {
        'label': confLang('max'),
        'title': confMess('max'),
        'type': 'select', // a checkbox input
        'options': enSiteConfig['width'], // Possible choices
        'default': '1450'
    },
    // more Deal actions
    'enCDealA': {
        'label': confLang('dealaction'),
        'title': confMess('dealaction'),
        'type': 'checkbox', // a checkbox input
        'default': true
    },

    // votebar
    'enCDealVbar': {
        'label': confLang('dealvotebar'),
        'title': confMess('dealvotebar'),
        'type': 'select', // a dropdown
        'options': enSiteConfig['votescale'], // Possible choices
        'default': '500'
    },
    // enable Touch support (bigger Avatar, touch on Deal Image)
    'enCTouch': {
        'label': confLang('touch'),
        'title': confMess('touch'),
        'type': 'checkbox', // a checkbox input
        'default': true
    },
    // canvas on mobile
    'enCWidth': {
        'label': confLang('width'),
        'title': confMess('width'),
        'type': 'select', // a checkbox input
        'options': enSiteConfig['width'], // Possible choices
        'default': enValOff
    },
    // show price in button, min compacter
    'enCPrice': {
        'label': confLang('price'),
        'title': confMess('price'),
        'type': 'checkbox', // a checkbox input
        'default': false
    },
    // minimize deal boxes to show maximum deals
    'enCCompact': {
        'label': confLang('compact'),
        'title': confMess('compact'),
        'type': 'checkbox', // a checkbox input
        'default': false
    },
    // use dealz.rrr.de and inject user selected CSS
    'enCCMail': {
        'label': confLang('cssdealz'),
        'title': confMess('cssdealz'),
        'type': 'checkbox', // a checkbox input
        'default': false
    },


    // enable filtering of external links
    'enCRedirect': {
        'label': confLang('redir'),
        'title': confMess('redir'),
        'type': 'checkbox', // a checkbox input
        'default': true
    },

    // Page picker
    'enCPageP': {
        'label': confLang('picker'),
        'title': confMess('picker'),
        'type': 'checkbox', // a checkbox input
        'default': true
    },

    // show real Dealtime
    'enCDealT': {
        'label': confLang('dealtime'),
        'title': confMess('dealtime'),
        'type': 'checkbox', // a checkbox input
        'default': true
    },
    // fix bad userhmtl (cut'n paste crap)
    'enCFixHtml': {
        'label': confLang('fixhtml'),
        'title': confMess('fixhtml'),
        'type': 'checkbox', // a checkbox input
        'default': true
    },

    // blacklist if colder
    'enCBlackC': {
        'label': confLang('blacklist'),
        'title': confMess('blacklist'),
        'type': 'select', // a dropdown
        'options': enSiteConfig['blackcold'], // Possible choices
        'default': '-20'
    },
    // blacklist, whitelist string
    'enConfBlacklist': {
        'label': confLang('black'),
        'title': confMess('black'),
        'type': 'text', // a text input
        'size': 70, // Limit length of input (default is 25)
        'default': ''
    },
    'enConfWhitelist': {
        'label': confLang('white'),
        'title': confMess('white'),
        'type': 'text', // a text input
        'size': 70, // Limit length of input (default is 25)
        'default': ''
    },
    'enCUnblackL': {
        'label': confLang('unblack'),
        'title': confMess('unblack'),
        'type': 'button', // a button input
        'click': EnstylerBlacklistUnhide // Function to call when button is clicked
    },
    // language for enstyler messages and translation to
    'enCLang':
    {
        'label': confLang('lang'),
        'title': confMess('lang'),
        'type': 'select', // a dropdown
        'options': enSiteConfig['languages'], // Possible choices
        'default': 'auto'
    },
};

enConfDefs['sync'] = {
    // part three: EnstylerJS configuration sync options ------
    'enCAutoS': {
        'label': confLang('autosync'),
        'title': confMess('autosync'),
        'type': 'checkbox', // a checkbox input
        'section': [confLang('syncconf'), ''],
        'default': true
    },
    'enCSyncKey':
    {
        'label': confLang('synckey'),
        'title': confMess('synckey'),
        'type': 'text',
        'size': 10, // Limit length of input (default is 25)
        'default': enValOff
    },
    'enCSync': {
        'label': confLang('sync'),
        'title': confMess('sync'),
        'type': 'button', // a button input
        'click': function() { // Function to call when button is clicked
            SyncSettings(); }
    }
};



if (DEBUGINT) {
    enConfDefs['debug'] = {
        // DEBUG buttons on mobile
        'mDebugC': {
            'label': 'Clear Debuglog',
            'type': 'button', // a button input
            'section': ['DEBUG', ''],
            'click': function () { // Function to call when button is clicked
                mobileClearLog(); }
        },
        'mDebugS': {
            'label': 'Show Debuglog',
            'type': 'button', // a button input
            'click': function () { // Function to call when button is clicked
                mobileShowLog(); }
        }
    };
}

// setings to save / sync
var enSaveSettings=[ 'enCNavF','enCDealA','enCDealVbar','enCTouch','enCRedirect','enCPageP',
                    'enCFixHtml','enCDealT', 'enCBlackC',
                    'enConfBlacklist', 'enConfWhitelist','enCAutoS' ];

// prepare GM_config div, apply class GM_config so we can apply CSS easy!! ========
var enGMFrame = document.createElement('div');
enGMFrame.setAttribute('class','GM_config');


// EnstylerJS Config Panel anzeigen =====================


var enGMConfigOpen=false;

function showEnstylerConfig() {
    //if(!enGMConfigOpen) {
    // add dim div and open menu
    u('body').prepend('<div id="enOverDim"></div>');
    GM_config.open();
    document.getElementById('main').click();
    enGMConfigOpen=true;
    //}
}

function closeEnstylerConfig() {
    //if(enGMConfigOpen) {
    // add dim div and open menu
    u('#enOverDim').remove();
    //GM_config.close();
    enGMConfigOpen=false;
    //}
}


var enRemConf = [
    { val: enValOff, field: 'enCBlackC', rem: 'enConfWhitelist'},
    { val: enValOff, field: 'enCBlackC', rem: 'enConfBlacklist'},
    { val: enValOff, field: 'enCBlackC', rem: 'enCUnblackL'},
    { val: enValOff, field: 'enCSyncKey', rem: 'enCSync'},
    { val: enValOff, field: 'enCSyncKey', rem: 'enCAutoS'},
    //{ val: enValOff, field: 'enCSyncKey', rem: 'enCSyncT'},
];

function confLangOpen() {
    //GM_config.set('enCLang', GM_getValue('enLang',''));
    // set save and close strings
    u('.GM_config button[id$="_saveBtn"]').html(confLang('save'));
    //u('.GM_config button[id$="_saveBtn"]').prop('title', confMess('save'));
    u('.GM_config button[id$="_closeBtn"]').html(confLang('close'));
    //u('.GM_config button[id$="_closeBtn"]').prop('title', confMess('close'));
    u('#GM_config_resetLink').html(confMess('reset'));
}


//========================================
// SYNC functions

function EnstylerSyncIDShow() {
    if (enSyncKey != enValOff) {
        u('.GM_config input[id$="_field_enCSync"]').first().value=confLang('sync')+" "+enUserKey('');
    }
}

// Save/Sync CSS and Enstyler Settings to server
var enSettings='enSettings';

function SyncSettings() {
    // sync CSS and Config Settings via Callback
    EnGetValue('', enSetValue);
    EnGetValue(enSettings, enSetSettings);
}

function SaveSettings() {
    EnSaveValue(enCssOpt, GM_getValue(enCssOpt,''));
    enSaveMyCSS();
    // iterate over Settings and save string
    var settings='';
    for (var val=0; val< enSaveSettings.length; val++) {
        if (DEBUGXXX) enDebugLog('SaveSettings: '+val+ ' of '+ enSaveSettings.length+ ' ' + enSaveSettings[val]);
        settings += enSaveSettings[val] + '=' + GM_config.get(enSaveSettings[val]) + '&';
    }
    if (DEBUGXX) enDebugLog('SaveSettings: ' + settings);
    EnSaveValue(enSettings, settings);
}

// Save/Sync LasteSeen to server
function SaveLastSeen() {
    if (enAutoSync) {
        // delay save x/2 minutes after script start
        var dealy=1*enMs2Min/2;
        var myTime=Date.now()/enMs2Min;
        var myDiff= myTime - GM_getValue('enLastCheck' + enSec,'0');
        // if time more than 5 Minutes delay = 500ms
        if (myDiff > 5 ) { delay=500; }
        if (DEBUGXX) { enDebugLog('SaveLastSeen '+ 'enLastCheck' + enSec +' dealy: ' + dealy + 'ms'); }
        // wait until synxc time expires
        setTimeout(function() {
            // do save
            if(DEBUG) enDebugLog('LastSeen SAVE started');
            EnSaveValue(enSec, GM_getValue(enSec,''));
        }, 1*enMs2Min/2); //.then(
    }
}


function SyncLastSeen() {
    // if enabled
    if (enAutoSync) {
        // get time and convert to minutes
        var myTime=Date.now()/enMs2Min;
        var myDiff= myTime - GM_getValue('enLastCheck' + enSec,'0');
        // if option set and time expired
        if(DEBUG) { enDebugLog('LastSeen '+enSec+' requested, intervall '+1+' minutes , actual diff '+parseInt(myDiff));}
        if (myDiff > 1 || myDiff < 0) {
            if(DEBUG) enDebugLog('LastSeeen Update started');
            // store actual time
            GM_setValue('enLastCheck' + enSec, myTime);
            // request last seen
            EnGetValue(enSec, enSetLastSeen);
        }
    }
}

// Last Seen callback, set settings loaded from server
function enSetLastSeen(key, value) {
    enLaArt=value;
    EnstylerLastSeenDo();
    if(enLaArt.replace(/thread_/i, '') > enSeArt.replace(/thread_/i, '')) {
        enSetValue(key+'Last', value);
    }
}

function enSaveMyCSS() {
    //enEarlyInit();
    EnSaveValue('', extraCSS +GM_getValue(MyCSS,'').replace(/^.*?{/, '').replace(/} *@-moz-document.*/,''),false);
}


// callback for enGetValue to set settings loaded from server
function enSetSettings(key, value) {
    // Save value to greasemonky variable
    if (DEBUGXX) { enDebugLog('enSetSettings: '+value); }
    var array = value.split('&');
    for (var pair=0; pair< array.length; pair++) {
        var val = array[pair].split('=');
        if (val.length<2 || !enSaveSettings.includes(val[0])) { continue; }
        if (val[1] == 'false') {
            GM_config.fields[val[0]].value = false;
            if (DEBUGXX) enDebugLog(val[0] + '=' + '>FALSE<');
        } else {
            GM_config.fields[val[0]].value = val[1];
            if (DEBUGXX) enDebugLog(val[0] + '=' + '>'+val[1]+'<');
        }
        GM_config.fields[val[0]].reload();
    }
}


// AMAZON mobile redirect ===========================================
// workaround to not intercept myDealz redirects with GM_xmlhttp
// stolen from amazon redirect mobile: https://greasyfork.org/de/scripts/19700
function enAmazonMobileRedirect() {
    var enMyLocation=enLocParser.href;
    // do we run on amazon?
    if (enMyLocation.startsWith("https://www.amazon")) {
//        if( enMyLocation.includes(".amazon.de")  && enMyLocation.length > 100 && ! enMyLocation.includes("tag=offtopic-21"))
//              {
//                  if (/[?&]tag=/i.test(enMyLocation)) {
//                      window.location.href=enMyLocation.replace(/([?&])tag=.*(-21)*/i, "$1tag=offtopic-21");
//                  } else {
//                    if(enMyLocation.includes("?")) {
//                        window.location.href=enMyLocation+"&tag=offtopic";
//                    } else {
//                        window.location.href=enMyLocation+"?tag=offtopic";
//                    }
//                  }
//              }
        // redirect enabled?
        if (DEBUGXX) { enDebugLog('On AMAZON ...'); }
        if (GM_config.get('enCRedirect')) {
            if (DEBUGXX) { enDebugLog('AMAZON redirect enabled ...'); }
            // do it
            if (enMyLocation.includes("/gp/aw/d/")) { window.location.replace(enMyLocation.replace("/gp/aw/d/", "/dp/")); }
            else if (enMyLocation.includes("/gp/aw/ol/")) { window.location.replace(enMyLocation.replace("/gp/aw/ol/", "/gp/offer-listing/")); }
        }
        return true;
    }
    return false;
}

// get colors of page to integrate better in international pages
// and save hight of navigation ...
//var enMainHeigth;


//=============== startup helper functions ==========================================
// Start Enstyler Magic
function EnstylerStart() {
    var t0,t1;
    EnstylerShowPage();
    EnstylerFixedNav();
    if(DEBUG) { t0 = Date.now(); }
    EnstylerLastSeen();
    if(DEBUG) {t1 =Date.now();
               enDebugLog("Call lastseen took ms  : " + (t1 - t0) );
               t0 = Date.now();}
    EnstylerDealTime();
    if(DEBUG) {t1 = Date.now();
               enDebugLog("Call dealtime took ms  : " + (t1 - t0) );
               t0 = Date.now(); }

    EnstylerBlacklist();
    if(DEBUG) {t1 =Date.now();
               enDebugLog("Call blacklist took ms : " + (t1 - t0) );
               t0 = Date.now();}
    EnstylerDealActions();
    if(DEBUG) {t1 = Date.now();
               enDebugLog("Call dealaction took ms: " + (t1 - t0) );
              }
}

function EnstylerRedo(){
    var ts, t0,t1;
    EnstylerShowPage();
    if(DEBUG) {ts=Date.now(); t0 = Date.now();}
    EnstylerLastSeenDo();
    //EnstylerPagePickerDo();
    if(DEBUG) {t1 = Date.now();
               enDebugLog("Call lastseen took ms  : " + (t1 - t0) );
               t0 =Date.now();}
    EnstylerDealTimeDo();
    if(DEBUG) {t1 = Date.now();
               enDebugLog("Call dealtime took ms  : " + (t1 - t0) );
               t0 = Date.now(); }
    EnstylerDealActionsDo();
    if(DEBUG) {t1 = Date.now();
               enDebugLog("Call dealaction took ms: " + (t1 - t0) );
              }
    if(DEBUG) enDebugLog('DOMSubtreeModified took ms: '+ (t1 - ts));
}

var enShowDate=new Date().toLocaleString('de-DE', { hour: 'numeric', minute: 'numeric' });

function EnstylerShowPage() {
    // show section and load time in search box
    if (myDealTime) {
        var search= u('.search-input');
        if (! search.lenth) {
            search.nodes[0].setAttribute("placeholder",enShowDate  + enLangLocalize(' <EN-LANG:oclock>', enTimeLang, enLANG) +
                                         (enLocParser.pathname == '/'? ' (home': ' ('+enLocParser.pathname.replace(/(^.*)[\/]|-.*/g,''))+
                                         (enLocParser.search.length ? ' |' +enLocParser.search.replace(/.*=/,'')+'|' :'') + ')');
        }
    }
}

// delayed actions after finishing everything else
function EnstylerDelayedInit() {
    // calc colors and topx
    var myBgColor=shadeRGBColor(getStyle(u('.nav').first(),'background-color'),0.1);
    var myButtonColor=shadeRGBColor(getStyle(u('.btn--mode-special').first(), 'background-color'), 0.1);
    var myColor=shadeRGBColor(myBgColor, 0.7);

    // if background is dark, then use ligther text and borders
    var myDarkStyle=medainRGBColor(getStyle(u('#main').first(), 'background-color'))>100 ? '': '.notification-item {color: #111;}'+
        ' body, .user, .thread-title, .subNavMenu-link, .mute--text2 {color: #aaa !important}'+
        ' .notification-item--read, .card-title, .mute--text, .userHtml-quote, .userHtml .userHtml-quote-source, .widget-title, .linkGrey,'+
        ' .thread-userOptionLink, .btn--mode-white--dark, .btn--mode-boxSec, .thread--expired.thread--type-card, .thread--expired.thread--type-list {color: #888;}' +
        ' article, section {border: 1px #666 solid} img, .votebar, .vote-tempIco, .vote-temp, .vote-temp--hot, .text--color-red,'+
        ' .vote-btn, .emoji, .ico, .dot {filter: grayscale(.25);}';

    addStyleString(
        // set Panel background color to nav background, text color to 70% brigther
        ' .GM_config {background-color: '+ myBgColor + ' !important; color: '+ myColor + ';}'+
        ' .GM_config select {background-color: '+ myBgColor + ' !important;}'+
        // set section header background color to nav -30%, text color to 70% brigther
        ' .GM_config .section_header, .GM_config .config_header {background-color: '+ shadeRGBColor(myBgColor, -0.25) +' !important; color: '+ myColor +' !important;}'+
        // set main nav background hover effekt to nac background +10%
        ' .nav-link-text:hover, .js-navDropDown-messages:hover, .js-navDropDown-activities:hover  { background-color: '+ shadeRGBColor(myBgColor, 0.1)+ ' !important;}' +
        // adjust panel button colors to add deal button color
        ' .GM_config input[type=button] { background-color: ' + myButtonColor + ' !important; border-color: '+ myButtonColor + ' !important; min-width: 10em;}'+
        ' .GM_config input[type=button]:hover, .btn--mode-special:hover { background-color: ' + shadeRGBColor(myButtonColor, 0.2)+
        ' !important; border-color: ' + shadeRGBColor(myButtonColor, 0.2) + ' !important;}' +
        ' .bg--inverted { background-color: ' + myButtonColor + ' }' +
        // change text color if background is to dark
        myDarkStyle
    );

    // don't know why, but works only if called with delay ...
    EnstylerMenuActions();
    //EnstylerPagePickerCreate();

    // track DOM change Events, debounce: wait 100ms after mutiple events
    // mobile browsers display less stuff than e.g. desktop browsers, so we listen to #main on mobile browsers
    // this work also for desktop browsers, but ceates to much calls to redo
    if (isMobile) {
        u('#main').on("DOMSubtreeModified", debounce( 300, function() {window.requestAnimationFrame(EnstylerRedo);}));
        //$ ('#main').bind("DOMSubtreeModified", debounce( 300, function() {EnstylerRedo();}));
        //document.addEventListener("DOMSubtreeModified", debounce( 300, function() {EnstylerRedo();}),false);
    } else {
        u('.js-pagi-bottom').on("DOMSubtreeModified", debounce( 200, function() {window.requestAnimationFrame(EnstylerRedo);}));
        //$ ('.js-pagi-bottom').bind("DOMSubtreeModified", debounce( 100, function() {EnstylerRedo();}));
    }
}

//=============== MAIN function START at DOM READY =============================================
// normally script is started at DOM ready, we try early as possible inject css after document start
// HACK: wait for *MINIMAL* needed DOM is availible

function WaitForBody () {
    // check if special handling for external site is needed, e.g. amazon
    if(enAmazonMobileRedirect()) return;

    // element 'messages-list' is needed, 'footer' as fallback
    if (u('#messages-list').length || u('#footer').length) {
        enEarlyInit();
        // disable enstyler if regex matches pepper pathname, e.g. breaks pepper functionality
        if (enLocParser.pathname.match(enDisableScript)) {
            if (DEBUGXX) {
                enDebugLog("disable Enstyler for path: " + enLocParser.pathname);
                enDebugLog("regex: " + enDisableScript.toString());
            }
            return;
        }

        // wait until DOM Ready to start MAIN
        WaitForDOM ();
    } else {
        // wait for nextframe (1/60s)and check again
        // sleep on modern browsersf window/tab is hidden:
        // https://swizec.com/blog/how-to-properly-wait-for-dom-elements-to-show-up-in-modern-browsers/swizec/6663
        window.requestAnimationFrame(WaitForBody);
    }
}

//HACK2: wait for footer aka close to DOM READY
function WaitForDOM () {
    // footer is last (visible) element on page
    var myColor=getStyle(u('.nav, #navigation').first(), 'background-color').replace(/[^\(]*/, "");
    if (DEBUGXXX) {enDebugLog(myColor);}
    if (u('.vwo-deal-button, #footer').length && !(myColor=="")) {
        // start MAIN on DOM Ready
        MAIN();
    } else {
        // wait for next frame (1/60s) plus 80ms and check again
        // sleep on modern browsersf window/tab is hidden:
        // https://swizec.com/blog/how-to-properly-wait-for-dom-elements-to-show-up-in-modern-browsers/swizec/6663
        window.requestAnimationFrame(function(){setTimeout(WaitForDOM, 80);});
    }
}

// basic config panel formatting, everything else is formatted by enstyler
var enCSS = ['.card-inner::after {display: none !important}', // remove Enstyler2 (c) message
             '.GM_config {color: white !important; opacity: 0.92 !important; left: 5% !important; height: auto !important; padding-bottom: 10px !important; top: 1.4em !important;',
             'box-shadow: 10px 10px 20px black; min-width: 21em; max-width: 40em !important; border-radius: 10px}',
             '#enOverDim {background-color: black; z-index: 999; position: fixed; top: 0; right: 0; bottom: 0; left: 0; opacity: 0.5}',
             '.GM_config input, .GM_config button, .GM_config textarea { border: 1px solid; margin: 0.5em 0em 0.2em 1em; padding: 0.1em;}',
             '.GM_config .reset { font-size: 9pt; padding-right: 1em; }',
             /* Header and section header */
             '.GM_config .config_header {font-size: 14pt !important; border: none !important; padding: 0.2em; font-weight: bold; text-align: center;}',
             '.GM_config .section_header { border: none !important; background-color:#005293 !important; !important; text-align: center; margin-top: 1em;}',
             '.GM_config .field_label:hover {color: gray;} .GM_config a:hover {text-decoration: underline; color: darkgray;}',
             /* config items can float */
             '.GM_config .config_var {display: inline-block;} .GM_config .field_label {display: inline-block; min-width: 14em;  margin-left: 2em; }',
             '.GM_config button, .GM_config input[type=button] { font-weight: bold; text-align: center; color: #fff; background-color:  #58a618 !important; }',
             '.GM_config button:hover {background-color: #a5d867 !important; border-color: #a5d867 !important;}',
             '.enClassHidden, #EnPopup_closeBtn, .voteBar-- { display: none !important; }',
             // minimum votebar values
             '.votebar {display: inline-block; position: relative; top: .3em; height: .5em; margin-left: 2.5em; max-width: 80% }',
             '.voteBar--warm { background-color:  #ffb612 } .voteBar--hot  { background-color:  #e00034 } .voteBar--burn { background-color:  #e00034 }',
             '.voteBar--cold, .voteBar--colder { background-color:: #00a9e0 } .voteBar--cold, .voteBar--colder { background-color: #5bc6e8 }',
             // hide original temp
             '.threadTempBadge { display: none; } .flex--justify-space-between { justify-content: unset !important; }',
             // max window width
             '.gridLayout { width: unset; max-width: '+ GM_getValue('enMax','')+'px !important;}',
             '.page2-center, .thread-list--type-list--sideAds, .thread-list--type-list, .listLayout { max-width: '+ GM_getValue('enMax','')+'px !important;}',
            ].join(" ");

// extra CSS addded by script
var extraCSS="";

// inject CSS as early as possible
function enEarlyInit() {
    // inject cached userstyle
    addStyleString(GM_getValue('Enstyler2_CSS',''), 'domain("' + enLocParser.hostname);
    // get config vars
    enCCMail=GM_config.get('enCCMail');
    myDealAction=GM_config.get('enCDealA');
    myTouch=GM_config.get('enCTouch');
    myCompact=GM_config.get('enCCompact');
    myPrice=GM_config.get('enCPrice');
    myFixHtml=GM_config.get('enCFixHtml');
    myVotescale=GM_config.get('enCDealVbar');
    myVotebar=(myVotescale!=enValOff);
    myDealTime=GM_config.get('enCDealT');
    if(myPrice) {
        extraCSS += '.threadGrid-title .flex, .threadGrid-title .overflow--fade {display: none;}';
    }
    if(myCompact) {
        extraCSS += '.threadGrid {padding: .3em !important;} .threadGrid-headerMeta, .threadGrid-title {height: 2.8em;}'+
            '.thread-title {white-space: nowrap;} .threadGrid-headerMeta {height: 2.3em;} .thread--compact .threadGrid-image {display: none}' +
            '.space--mt-2, .space--mv-2 {margin-top: .25em;} .vote-box {height: 2.1em} .votebar {top: 0;} .threadTempBadge-icon {font-size: 1.3em !important;}';
        if(myPrice) {enCSS += '.threadGrid-headerMeta, .threadGrid-title {height: 2em !important;}';}
    }
    if(myTouch) {
        // bigger dealaction icons etc on touch
        extraCSS += 'article .footerMeta-actionSlot .ico::before, article .threadItem-footerMeta .ico::before, article .threadCardLayout--row--small .ico::before' +
            ', .thread-userOptionLink.ico:before {-webkit-transform: scale(1.7); transform: scale(1.7); width: 1.5em; left: .4em;}' +
            '.ico--reduce3 {left: .5em;} #emergency {transform: scale(1.5); margin-left: .7em;}' +
            'article a.btn--ctrl--fixed {-webkit-transform: scale(1.2); transform: scale(1.2); left: 0; margin-left: 3em; min-width: 4em;}' +
            '.vote-down, .vote-up {padding-top: 0.25em; padding-bottom: 0.25em} .thread-avatar { width: 2.3em; height: 2.3em;}';
    }
    if(!myVotebar) {
        // display original flame/ice
        extraCSS += '.threadTempBadge { display: unset; }';
    }
    if(myDealAction) {
        // remove ... and show full text in dealaction
        extraCSS +='button.meta-ribbon-btn.hide--fromW3 {display: none}';
    }

    // add composed CSS
    addStyleString(enCSS+extraCSS+enNavCSS);
}

// script time mesurement starts here
var EnstylerStartTime=Date.now();

function MAIN() {
    if(DEBUG) enInitTime = performance.now() - enInitTime;
    if(DEBUG) enDebugLog('Inittime: ' + enInitTime + ' ms');
    if (DEBUG) enDebugLog('Start Init');
    EnstylerInit();
    if (DEBUG) enDebugLog('Start CheckUpdate');
    enCheckUpdates();

    // add frame for GM_config to body
    document.body.appendChild(enGMFrame);

    // EnstylerJS START ============================================
    // get main color and set main BG color
    var myBGColor=shadeRGBColor(getStyle(u('.bg--main').first(), 'background-color'), -0.08);
    addStyleString('.bg--off {background-color: ' +myBGColor + '!important;}');
    // workaround for zepto (no .outerHeigth())
    //enMainHeigth = getOuterHeight('header');

     // give time to start render page
    setTimeout(EnstylerDelayedInit, 400);

    EnstylerStart();
    //var EnstylerStartupDelay=Date.now()-EnstylerStartTime;
    if(DEBUG) enDebugLog('Startup in ms: ' +Date.now()-EnstylerStartTime);

} // END MAIN



// =================== EnStyler UserScript Homepage functions =============


function enUserstyleDo() {
    // ==============  we are on USERSTYLE ===================
    // add frame for GM_config to body
    if (DEBUGXX) { enDebugLog('USerstyleDo ...');}
   if (u('#EnstylerButton').length) {
        if (DEBUGXX) { enDebugLog('USerstyleDo already done ...');}
        return;
    }

    document.body.appendChild(enGMFrame);
    // inject userstyle directly
    addStyleString(enCSS+'.advancedsettings_hidden {max-width: 640px; border-radius: 8px; background-color: #ffffff; margin-bottom: 30px;'
                   + ' padding: 30px; display: flex; flex-direction: row; flex-wrap: wrap; margin-top: 14px;}'
                   + ' #ownedButtons {visibility: visible; border: 1px solid red;}'
                   + ' #top_android_button, .android_button_banner, .walking, .overlay_background { display: none !important; }');
    addStyleString(GM_getValue('Enstyler2_CSS','') , 'url(https://userstyles.org');

    // START Enstyler 2 Homepage
    //setTimeout(createEnstylerButton, 2000);
    var checkExist = setInterval(function() {
        if (u('#style-settings').length) {
            if (! u('#EnstylerButton').length) {
                createEnstylerButton();
            }
            clearInterval(checkExist);
        }
    }, 1000); // check every 500ms
}


// button for saving options
var input = document.createElement('input');
input.type = 'button';
input.setAttribute(enID, EnstylerButton);
input.onclick = saveEnstylerCSS;
input.value = confLang('options');

function createEnstylerButton() {
    if (DEBUG) enDebugLog('createEnstylerButton');
    // open advanced settings and remove advanced button
    u('#advancedsettings_area').attr('class' ,'advancedsettings_shown');
    u('.advanced_button').remove();
    //u('select, input').off();

    // style, add and scroll to button
    input.setAttribute('style', 'font-size: 1.3em; padding: 0.7em; background-color: #69be28; color: white; border-radius: 8px; border: 1px solid grey; margin-top: 1em; font-weight: bold;');
    u('#style-settings').before(input);
    window.scrollTo(100, 400);
    // set saved options
    enSetOptions();
}

function saveEnstylerCSS () {
    //enSaveOptions();
    //showEnstylerConfig();
    enSaveOptions();
    setTimeout(window.close, 1000);
}


// read values from options
function enSaveOptions() {
    if (DEBUG) enDebugLog('enSaveOptions');
    var myOptions='', myID, myValue, myText;
    u('#style-settings select').each(function(that) {
        myID = u(that).attr(enID);
        myValue = that.value;
        myText  = u('option[value='+ myValue +']').text();
        myOptions +='#' + myID + ':' + myValue +':' + myText +';\n';
    });
    u('#style-settings input[type=text]').each(function(that) {
        myID = u(that).attr(enID);
        myValue = that.value;
        myText  = "RGB-Clolor";
        myOptions +='#' + myID + ':' + myValue +':' + myText +';\n';
    });
    u('#style-settings input:checked').each(function(that) {
        myID = u(that).attr(enID);
        myValue = that.value;
        myText  = u('label[for='+ myID +']').text();
        myOptions +='#' + myID + ':' + myValue +':' + myText +';\n';
    });
    GM_config.set('saveOpt', myOptions);
    GM_setValue(enCssOpt, myOptions);
}

//set values from stored options
function enSetOptions() {
    if (DEBUG) enDebugLog('enSetOptions');
    input.value = confLang('options');
    // get saved options,remove newlines and split to settings array
    var myOptions=GM_getValue(enCssOpt, '');

    // if(DEBUG) enDebugLog('Saved Options: ' + myOptions);
    myOptions=myOptions.replace(/\n/g,'');
    var mySettings = myOptions.split(';');

    // abort if no options found
    if (myOptions=='' || !myOptions.startsWith('#')) {return;}

    for (var i=0; i< mySettings.length; i++) {
        if(DEBUGXXX) enDebugLog('process:' + mySettings[i]);
        // each Setting has 3 fields seperated by :, but only 2 used
        var myField=mySettings[i].split(':');

        if (myField[0].startsWith('#setting')) {
            // text input, select
            u(myField[0]).first().selectedIndex = "-1";
            u(myField[0]).first().value =myField[1];
        } else if (myField[0].startsWith('#option')) {
            // option
            u(myField[0]).first().checked =true;
        } else {
            if (myField[0] != '') {enDebugLog('ignoring unkown option: "' + myField +'"');}
        }
    }
    // hide install button if enstyler is active
    addStyleString('#button { display: none; }');
    // update shown otions
}



function enComposeCSS() {
    // get saved options, remove newlines and split to settings array
    var myOptions=GM_getValue(enCssOpt, '');

    // abort if no options found
    if (myOptions=='' || !myOptions.startsWith('#')) {return "";}

    myOptions=myOptions.replace(/\n/g,'');
    var mySettings = myOptions.split(';');

    // start composing options
    myOptions='';
    for (var i=0; i< mySettings.length; i++) {
        //if(DEBUG) enDebugLog('process:' + mySettings[i]);
        if(mySettings[i]=='') continue;

        // each Setting has 3 fields seperated by :
        var myField=mySettings[i].split(':');
        if(myField.length < 2) continue;
        // add &setting=value

        myOptions += '&' +myField[0] + '=' + myField[1];
    }

    // replace first & by ? and returns string
    myOptions = '?'+myOptions.slice(1).replace(/#/g, '');

    //if(DEBUG)
    enDebugLog(myOptions);
    return myOptions;
}

// END USI HACK ======================================================================

//=========== Support functions for actual use ======

// Browser detection from https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
// move the needed detecion to beginning of script!
// Opera 8.0+
//var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
// Firefox 1.0+
//var isFirefox = typeof InstallTrigger !== 'undefined';
// Safari 3.0+ "[object HTMLElementConstructor]"
//var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
// Internet Explorer 6-11
//var isIE = /*@cc_on!@*/false || !!document.documentMode;
// Edge 20+
//var isEdge = !isIE && !!window.StyleMedia;
// Chrome 1+
//var isChrome = !!window.chrome && !!window.chrome.webstore;
// Blink engine detection
//var isBlink = (isChrome || isOpera) && !!window.CSS;


// set width on mobile if enabled ============
var enWidth=GM_getValue('enWidth',enValOff);
if (isMobile && enWidth != enValOff) {
    u('meta[name=viewport]').attr('content','width='+enWidth+'px, initial-scale=1');
}

// simple log function, will be used for mobile devices
function mobileLog(string) {
    GM_setValue(saveLog, GM_getValue(saveLog,'') + string + '\n');
}

function mobileShowLog() {
    (GM_getValue(saveLog,''));
}

function mobileClearLog() {
    GM_setValue(saveLog, 'Enstyler Log\n');
}

// get global site defaults
function EnstylerSiteConfig(key) { return enGetSiteConfig(enInterName, key); }

function enGetSiteConfig(site, key) {
    return (enSiteConfig.hasOwnProperty(site) && enSiteConfig[site].hasOwnProperty(key)) ? enSiteConfig[site][key] : '';
}

// translate/replace text by strings given in object trans[lang]
// assoc object: trans{ lang: { field: 'string', ... }, lang2: { field: 'string2', ... } }
function enLangLocalize(text, trans, lang) {
    // check if lang exist. if not set to english
    if (!enDealLang.hasOwnProperty(lang)|| typeof trans[lang] === 'undefined') { lang='en'; }
    // iterate over trans replace by idea from
    // http://stackoverflow.com/questions/7192436/
    text=text.replace(enLangPat,
                      function(match,key){
        if (DEBUGXXX) {
            enDebugLog('enLangLocalize: ' +text+' '+[key]+' '+lang);
            enDebugLog('enLangLocalize: '+ (trans.hasOwnProperty(lang)) ? trans[lang] : "Does not exist!");
        }
        // if key exist return translation, else key
        return (trans.hasOwnProperty(lang) && trans[lang].hasOwnProperty(key)) ? trans[lang][key] : key;
    });
    // repeat until no more match for enLangPat
    return text.match(enLangPat) ? enLangLocalize(text, trans, lang) : text;
}



// add CSS in to document
// new: remove moz-document rules
var enUserScript = { detect: /.*?@-moz-document .*?\{\s*/,
                    split:  /^.*?\{/,
                    next:   /}\s*@-moz-document.*/,
                    //repeat: /}\s*@-moz-document.*?{/g,
                    //end:    /}\s*$/
                   };
var enCSSmax=16100; // split CSS if longer then

function addStyleString(str, host) {
    if (typeof host === 'undefined') host='';
    // check if style contains @-moz-document rules
    if (str.match(enUserScript['detect'])) {
        // if no host is given use actual hostname
        if (host=='') { host= enLocParser.hostname; }

        //split userstyle in parts
        var myPart = str.split(host);

        // recreate style string for host from parts
        str='';
        for (var i=1; i< myPart.length; i++) {
            // skip parts with no CSS
            if (myPart[i].indexOf('{') == -1) continue;
            str += myPart[i].replace(enUserScript['split'],'').replace(enUserScript['next'],'');
        }
    }

    // split long style to avoid caching problems on andoid
    // while remaining string is longer than exCSSmax and we can split
    var myPos, myStart=0, mySplit=enCSSmax;
    while (str.length > mySplit &&
           (myPos=str.substring(mySplit).indexOf('}.')) > 0) {
        // add substring of style
        addStyleString(str.slice(myStart, mySplit+= myPos+1));
        // adjust for next Start
        myStart=mySplit;  mySplit+=enCSSmax;
    }

    // add style string to document
    if(DEBUG) {
        enDebugLog('applyed style length: ' + (str.length - myStart));
        //enDebugLog(str.slice(myStart));
    }

    var node = document.createElement('style');
    node.innerHTML = str.slice(myStart);
    document.body.appendChild(node);
}


function capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
}

// truncate String add word boundary
function truncStringWord(string, n, worddelim ){
    if (typeof worddelim === 'undefined') worddelim=' ';
    if (string.length > n) {
        string = string.substr(0,n-1);
        return string.substr(0,string.lastIndexOf(worddelim)) + '...';
    }
    return string;

}


// make colors ligther or darker
// http://stackoverflow.com/questions/5560248
//color = "rbg(63,131,163)";
//lighterColor = shadeRGBColor(color, 0.5);  //  rgb(159,193,209)
//darkerColor = shadeRGBColor(color, -0.25); //  rgb(47,98,122)

function shadeRGBColor(color, percent) {
    if (typeof percent === "undefined") { percent=0.1; }
    if (typeof color === "undefined") { return("rgba(0,0,0,0)"); }
    var f=color.split(","),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=parseInt(f[0].slice(4)),G=parseInt(f[1]),B=parseInt(f[2]);
    return "rgb("+(Math.round((t-R)*p)+R)+","+(Math.round((t-G)*p)+G)+","+(Math.round((t-B)*p)+B)+")";
}


// calculates the medain of RGB color, ignores alpha
// returns value 0-255
function medainRGBColor(color) {
    var f=color.split(","),R=parseInt(f[0].slice(4)),G=parseInt(f[1]),B=parseInt(f[2]);
    return Math.round((R+G+B)/3);
}


// Ensytler debounce Funtionen, modified: parameter swapped, no args passed
// can also be used as simple sleep async
// example debounce: $ ('input.username').click(debounce(250, function));
// example sleep async: debounce(500, function)
// https://remysharp.com/2010/07/21/throttling-function-calls
function debounce(delay, fn) {
    var timer = null;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.call(this);
        }, delay);
    };
}

/* get external file and store to GM_variable */
/* curreently we assume its a CSS or JS File, so we strip comments and @namespace @moz-document... */

function enCacheExternalResource(stylesheet_uri, GM_variable) {
    if (DEBUGXX) enDebugLog('CacheExternalResource ...');
    GM_xmlhttpRequest({
        method: "GET",
        url: stylesheet_uri,
        onload: function(response) {
            //we got the file!, remove linebreaks and strip simple /*comments */ unneded blanks
            var myResponse=response.responseText.replace(/\r\n/g, ' ')
            .replace(/\/\*.*?\*\/|   *|\t/g, '')
            .replace(/([:;]) /g, '$1')
            .replace(/1111.11%/g, "100%");
            if (DEBUGXX) enDebugLog([
                response.status,
                response.statusText,
                response.readyState,
                response.finalUrl,
                stylesheet_uri,
                GM_getValue(enCssOpt, ''),
                response.responseHeaders
            ].join("\n")+'\n'+ myResponse.replace(/.*?(btn--mode-special[^}]*).*/, '$1}'));

            if (myResponse.length > 60) {
                GM_setValue(GM_variable, myResponse);
                addStyleString(myResponse);
            } else {
                if (DEBUGXX) { enDebugLog('CacheExternalResource ... response to short!'); }
            }
        },
        onerror: function(response) {
           alert(confMess('cssfailed'));
 //           GM_setValue('enLastUpdateCheck', 0);
       }
    });
}

// workaround for no .outerHeigth()
//function getOuterHeight(el) {
//    return u("menu").first().offsetHeight;
//}


// translate query string with google chrome translation service
// client=gt    google translation for chrome
// sl= source lang, tl= target lang,    dt=t do tranlation ;-)
// q=   URI encoded query string to translate from sl to tl

var enGoogleTransURL='https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=<ENSTYLER-LANG-HERE>&dt=t&q=<ENSTYLER-HTML-HERE>';

// parameter jquery/javascript obj
// translates text up to first <a> or <img> tag, max translation length is 300 chars
var enMaxTrans=300;
var enTransTags=5;

function enTranslateGoogle(thisObj) {
    // no translation needed
    if (enLANG==enSiteLANG || !thisObj.length) { return; }
    // get HTML, remove unwanted chars
    var text=thisObj.html().replace(/[#\(\)]|\n|\r|\t/g, '');

    // remove all html tags and store in array
    var html="", transTags = [];
    var count, match, buff="", last=0, regex = /<.*?>/gi;    //<(?:[^>=]|='[^']*'|="[^"]*"|=[^'"][^\s>]*)*>/ig;
    for (count=0; (match = regex.exec(text)); count++) {
        // break if longer max translation length
        if(enTransTags<count || buff.length+(match.index-last) > enMaxTrans) {
            var space=text.lastIndexOf(' ', last+(enMaxTrans-buff.length));
            buff += text.slice(last, last+space);
            html=text.slice(last+space);
            break;
        }
        // cut out text and store match
        transTags[count] = match[0];
        buff +=text.slice(last, match.index)+'<a href="'+count+'">';

        last=regex.lastIndex;
    }
    if (!buff.length) { buff=text; if (buff.length > enMaxTrans) return;}
    if (DEBUGXXX)  {
        //enDebugLog(text);
        enDebugLog(count+': '+transTags);
        enDebugLog(buff);
        //enDebugLog(html);
    }
    // create query string
    var query=enGoogleTransURL //.replace(/<ENSTYLER-SITELANG-HERE>/, enSiteLANG)
    .replace(/<ENSTYLER-LANG-HERE>/, enLANG).replace(/<ENSTYLER-HTML-HERE>/, encodeURI(buff));
    // request translation from google
    var ret = GM_xmlhttpRequest({
        method: "GET",
        url: query,
        onload: function(res) {
            // read JSON rsponse ---
            text=eval("(" + res.responseText + ")")[0][0][0];
            try {
                // sometimes translation is diveded in many parts
                for (x = 1; x < 5; x++) {
                    text += eval("(" + res.responseText + ")")[0][x][0];
                }
            } catch(e){}
            // reassemble translation
            for (count--; count>=0; count--){
                // replace ID with stored match
                text=text.replace(RegExp('< *a href *= *"'+count+'" *>'),transTags[count]);
                //console.error(count+': '+text);
            }
            thisObj.html(text +' '+ html);
            if (DEBUGXXX)  {
                enDebugLog('Translate from: ' + buff);
                enDebugLog('===> '+ text );  //alert(eval("(" + res.responseText + ")")[0][0][0]);
            }
        }
    });

}

// save given value string on RRR webserver
var enSaveURL='https://dealz.rrr.de/enstyler/save.php?';
var enSaveUrlLast='';

function EnSaveValue(key,value,crypt) {
    if (enUserName != '' && enSyncKey != enValOff ) {
        if (typeof crypt === "undefined") { crypt=true; }
        if (DEBUGXX) { enDebugLog('EnSaveValue crypt: ' + crypt + ' key: ' + key + ' value: '+value); }
        // compose URL and return if duplicate to avoid traffic
        if (key+value == enSaveUrlLast) { return; }
        enSaveUrlLast=key+value;
        var cval = crypt ? enEncrypt(value) : LZString.compressToEncodedURIComponent(value);
        var save=enSaveURL + 'ID=' + enUserKey(key) + '&value=' + cval  ;
        // save value to webserver
        if(DEBUGXX) {
            enDebugLog('EnSaveValue URL: ' + save);
            enDebugLog('EnSaveValue Key: ' + key + ' Value: ' +  value );
        }
        // simplest possible request log param only
        GM_xmlhttpRequest({
            method: "GET",
            url: save
        }
                         );
    }
}

// load given value string FROM RRR webserver and execute given funktion as callback
// var enGetURL='https://dealz.rrr.de/enstyler/load.php?';

function EnGetValue(key,callback,crypt) {
    if (enUserName == '') { enUserName = GM_getValue('enCSyncUser',''); }
    if (DEBUGXX) { enDebugLog('enGetValue user: '+enUserName+ ' SyncID: ' + enSyncKey+ ' key: '+ key); }
    if (enUserName != '' && enSyncKey != enValOff ) {
        if (typeof crypt === "undefined") { crypt=true; }
        var get='https://dealz.rrr.de/enstyler/load.php?' + 'ID=' + enUserKey(key);
        if(DEBUGXX) { enDebugLog('EnGetValue: ' + get); }
        // fallback if not function provided
        // if (typeof callback !== "function") { callback=enSetValue; }
        // request key value from server
        GM_xmlhttpRequest({
            method: "GET",
            url: get,
            onload: function(response) {
                if (DEBUGXX)  { enDebugLog('EnCallback Key: ' + key + ' status=' + response.status); }
                // call callback function if status is 200
                if (response.status === 200 && response.responseText.length > 30) {
                    if (DEBUGXX) { enDebugLog('EnCallback Value: '+ crypt ? enDecrypt(response.responseText) : LZString.decompressFromEncodedURIComponent(response.responseText)); }
                    callback( key, crypt ? enDecrypt(response.responseText) : LZString.decompressFromEncodedURIComponent(response.responseText));
                }  else if (DEBUGXX) {
                    enDebugLog('EnCallback Value: No stored value for ' + key + ': ' + response.responseText);
                }
            }
        });
    }
}

// default callback for enGetValue to set key to value from server
function enSetValue(key, value) {
    // Save value to greasemonky variable
    if (DEBUGXX) { enDebugLog('enSetValue '+key+' old: '+GM_getValue(key,'')+ ' new: '+value);    }
    GM_setValue(String(key), String(value));
}

// function for encrypt / devcrypt sha226
function enEncrypt(string){
    return btoa(sjcl.encrypt(enUserKey(''), string));
}

function enDecrypt(string){
    return sjcl.decrypt(enUserKey(''), atob(string));
}


function enUserKey(key) {
    return enShortKey(enUserName + enSyncKey + key);
}

function enShortKey(string) {
    if (DEBUGXX) {
        enDebugLog('enShortKey IN: '+ string);
    }
    // ShortURL Bijective conversion between natural numbers (IDs) and short strings
    // the map function converts characters (and numbers) from strings to unique IDs (not bijective)
    // letter sequence is taken from: https://en.oxforddictionaries.com/explore/which-letters-are-used-most
    // example: earshot idiot =>  12381556412456 <=> hQGZ69Ly
    string= ShortURL.encode(parseInt(string.toLowerCase().split('').map(function(c){
        return 'eariotnslcudpmhgbfywkvxzjq'.indexOf(c)+1 || '9876543210'.indexOf(c)+1 || '';
        //      12345678901234567890123456
    }).join('')));

    if (DEBUGXX) {
        enDebugLog('enShortKey OUT: '+ string);
    }
    return string;
}


// alternative for jquery .css() get method
// https://www.htmlgoodies.com/html5/css/referencing-css3-properties-using-javascript.html#fbid=b2-TgWC-yGY
function getStyle(oElm, css3Prop){
    // FF, Chrome etc.
    if(window.getComputedStyle){
        try { return getComputedStyle(oElm).getPropertyValue(css3Prop); }
        catch (e) {}
    } else {
        // IE
        if (oElm.currentStyle){
            try { return oElm.currentStyle[css3Prop]; }
            catch (e) {}
        }
    }
    return "";
}



// ============= DEBUG INIT =======================================================================

if (DEBUG) {
    enDebugLog('Site Lang:     '+enSiteLANG);
    enDebugLog('Selected Lang: '+enLANG);
    // output location, remove * to activate
    enDebugLog('URL : '+enLocParser.href);     // http://example.com:300/pathname?search=test#hash
    //enDebugLog('protocol : '+enLocParser.protocol); // => "http:"
    enDebugLog('hostname : '+enLocParser.hostname);   // => "example.com"
    //enDebugLog('    port : '+enLocParser.port);     // => "3000"
    //enDebugLog('host+port: '+enLocParser.host);     // => "example.com:3000"
    enDebugLog('pathname : '+enLocParser.pathname); // => "/pathname/"
    enDebugLog('  search : '+enLocParser.search);   // => "?search=test"
    enDebugLog('    hash : '+enLocParser.hash);     // => "#hash"
    //enDebugLog(GM_getValue('Enstyler2_CSS',''));
    /**/
}

var enGMSave=false;

// ================ GM_config INIT Starts here ============================================
// GM_Config Init for MyDealz and Enstyler Home
if (!window.location.hostname.endsWith('userstyles.org')) {
    var enFixedNavLast=false;
    GM_config.init(
        {
            //  international sites support
            id: enInter ? 'GM_config' + enInterSite : 'GM_config',
            title: !DEBUG ? confLang('headline') : confLang('headline') + ' >> Debug <<',
            fields: Object.assign(enConfDefs['default'], enConfDefs['sync'],enConfDefs['debug']),
            'events': // Callback functions object
            {
                // init
                'init': function() {

                },
                // remove elements ich switch is checked or not
                'open': function(doc) {
                    // see if fixed nav
                    enFixedNavLast=GM_config.get('enCNavF');
                    // init lang on open
                    confLangOpen();
                    // show SyncID if sync is activated
                    EnstylerSyncIDShow();

                    // add grid, list switch to config dialog
                    u('.GM_config [id$="_enJS_var"]').after(enNavGrid);

                    // remove unneeded controls
                    for (var i = 0; i < enRemConf.length; i++) {
                        if (GM_config.get(enRemConf[i].field) == enRemConf[i].val) {
                            GM_config.fields[enRemConf[i].rem].remove();
                        }
                    }

                    // remove in some cases e.g. auto update
                    //if (enJSAutoUpdate) {GM_config.fields['enJS'].remove();}
                    if (!isMobile)       {GM_config.fields['enCWidth'].remove();}
                },
                // relaod page on close after save
                'save':  function() {
                    // save lang selection or '' if auto
                    //if (GM_config.get('enCLang') == 'auto') { GM_setValue('enLang', ''); } else { GM_setValue('enLang', GM_config.get('enCLang')); }
                    SaveSettings(); // sync
                    GM_setValue('enWidth', GM_config.get('enCWidth'));
                    GM_setValue('enMax', GM_config.get('enCMax'));
                    // allow sync after save
                    enSyncKey  = GM_config.get('enCSyncKey');
                    enAutoSync = GM_config.get('enCAutoS');
                    // call close:, show again
                    GM_config.close();
                    showEnstylerConfig();;
                    //enSyncIn=GM_config.get('enCSyncT', enSyncIn);
                    if (enGMSave) { window.location.reload();} else { enGMSave=true; }
                },
                'close': function() { closeEnstylerConfig();  enCheckUpdates();},
            },
            'frame': enGMFrame // Element used for the panel
        }
    );
    // init values read from GM_config vars
    enSyncKey  = GM_config.get('enCSyncKey');
    enAutoSync = GM_config.get('enCAutoS');
    //enSyncIn=GM_config.get('enCSyncT', enSyncIn);
    // read user selected LANG
    if(GM_config.get('enCLang') != 'auto' ) {
        //GM_setValue('enLANG', '');
        enLANG=GM_config.get('enCLang');
    }

} else {
    // activate config for Enstyler Homepage
    GM_config.init(
        {
            id: 'GM_config',
            //title: confLang('headline') + ' CSS',
            fields: {
                // Part one: load external content --------
                'saveOpt': {
                    //    'section': [ confLang('savecss'), ''],
                    //    'label': confLang('howtocss'), // Appears near textarea
                    'type': 'textarea',
                    //    'size': 70,
                },
            },
            /*
            'events': // Callback functions object
            {
                'open':  function() { confLangOpen(); },
                'save':  function() {
                    //enSendCSS();
                    enSetOptions();
                    setTimeout(window.close, 1000);
                    //closeEnstylerConfig();
                },
                'close': function() {  closeEnstylerConfig();},
            },*/
            'frame': enGMFrame // Element used for the panel
        }
    );
    if (DEBUGXX) enDebugLog('On Userstyle ...');
    // fallback in case next test is failing
    setTimeout(enUserstyleDo, 5000);
    // test if already loaded
    if (document.readyState === "complete" || document.readyState !== "loading"){
        enUserstyleDo();
    } else {
        document.addEventListener('DOMContentLoaded', enUserstyleDo);
    }
    return;

}


// RUN Enstyler MAIN
window.eval("window['ga-disable-UA-2467049-1'] = true;");
WaitForBody();

// =========== Support functions for LATER use not needed for production !!!

/* Perfomance test code
var t0 = performance.now();
  //Code to test here ...
var t1 = performance.now();
enDebugLog("Call XXXX took " + (t1 - t0) + " milliseconds.")
*/

/*
// from https://gist.github.com/TheDistantSea/8021359
// returns 0 on equal, 1 on v1 newer, -1 on v2 newer
function versionCompare(v1, v2) {
    var lexicographical = false,
        zeroExtend = true,
        v1parts = v1.split('.'),
        v2parts = v2.split('.');

    function isValidPart(x) { return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x); }
    if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {return NaN; }

    if (zeroExtend) {
        while (v1parts.length < v2parts.length) v1parts.push("0");
        while (v2parts.length < v1parts.length) v2parts.push("0");
    }

    if (!lexicographical) {
        v1parts = v1parts.map(Number);
        v2parts = v2parts.map(Number);
    }

    for (var i = 0; i < v1parts.length; ++i) {
        if (v2parts.length == i) { return 1; }
        if (v1parts[i] == v2parts[i]) { continue; }
        else if (v1parts[i] > v2parts[i]) { return 1; }
        else { return -1; }
    }

    if (v1parts.length != v2parts.length) { return -1; }
    return 0;
}

function toHex(string) {
    var hex, i;

    var result = "";
    for (i=0; i<string.length; i++) {
        hex = string.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }

    return result
}

function fromHex(hex) {
    var j;
    var hexes = hex.match(/.{1,4}/g) || [];
    var back = "";
    for(j = 0; j<hexes.length; j++) {
        back += String.fromCharCode(parseInt(hexes[j], 16));
    }

    return back;
}

*/

/* Options for uglifyJS3 https://skalman.github.io/UglifyJS-online/

// Documentation of the options is available at https://github.com/mishoo/UglifyJS2
{
  parse: {
    bare_returns     : true,
    ecma             : 8,
    expression       : false,
    filename         : null,
    html5_comments   : true,
    shebang          : true,
    strict           : false,
    toplevel         : null
  },
  compress: {
    arrows           : true,
    booleans         : true,
    collapse_vars    : true,
    comparisons      : true,
    computed_props   : true,
    conditionals     : true,
    dead_code        : true,
    drop_console     : false,
    drop_debugger    : true,
    ecma             : 5,
    evaluate         : true,
    expression       : false,
    global_defs      : {DEBUG:false, DEBUGX:false, DEBUGXX:false, DEBUGXXX:false, DEBUGINT:false},
    hoist_funs       : true,
    hoist_props      : true,
    hoist_vars       : false,
    ie8              : false,
    if_return        : true,
    inline           : true,
    join_vars        : true,
    keep_classnames  : false,
    keep_fargs       : false,
    keep_fnames      : false,
    keep_infinity    : false,
    loops            : true,
    negate_iife      : true,
    passes           : 2,
    properties       : true,
    pure_getters     : "strict",
    pure_funcs       : null,
    reduce_funcs     : true,
    reduce_vars      : true,
    sequences        : true,
    side_effects     : true,
    switches         : true,
    top_retain       : null,
    toplevel         : false,
    typeofs          : true,
    unsafe           : true,
    unsafe_arrows    : false,
    unsafe_comps     : true,
    unsafe_Function  : true,
    unsafe_math      : true,
    unsafe_methods   : false,
    unsafe_proto     : false,
    unsafe_regexp    : true,
    unsafe_undefined : false,
    unused           : true,
    warnings         : false
  },
  mangle: {
    eval             : false,
    ie8              : false,
    keep_classnames  : false,
    keep_fnames      : false,
    properties       : false,
    reserved         : [],
    safari10         : false,
    toplevel         : false
  },
  output: {
    ascii_only       : false,
    beautify         : true,
    bracketize       : false,
    comments         : /@license|@preserve|^!|@|UserScript==/,
    ecma             : 5,
    ie8              : false,
    indent_level     : 2,
    indent_start     : 0,
    inline_script    : true,
    keep_quoted_props: false,
    max_line_len     : 1600,
    preamble         : null,
    preserve_line    : false,
    quote_keys       : false,
    quote_style      : 0,
    safari10         : false,
    semicolons       : true,
    shebang          : true,
    source_map       : null,
    webkit           : false,
    width            : 200,
    wrap_iife        : false
  },
  wrap: false
}


*/
