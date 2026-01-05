// ==UserScript==
// @name			DSA Interface
// @namespace		COMDSPDSA
// @version			20.7
// @description		Interface enhancements for DSA
// @author			Dan Overlander
// @include         http://sales.dell.com/*
// @include	        *preol.dell.com*
// @include	        *http://localhost:36865*
// @include			*http://localhost:36158*
// @include			*localhost.dell.com:5000*
// @include			*dell.com/salesapp*
// @include			*online-sales-ux-*
// @exclude         */swagger/*
// @require			https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require         https://greasyfork.org/scripts/23115-tampermonkey-support-library/code/Tampermonkey%20Support%20Library.js?version=730858
// @require         https://greasyfork.org/scripts/383641-aria-favlets/code/ARIA%20Favlets.js?version=702363
// @require		    https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js
// @grant           GM_setValue
// @grant           GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/24474/DSA%20Interface.user.js
// @updateURL https://update.greasyfork.org/scripts/24474/DSA%20Interface.meta.js
// ==/UserScript==

// Since v20.6: Extracting DOM Assistant as a separate script
// Since v20.5: Minor tweaks to Partners link generator
// Since v20.4: Bugfix: Updated config link
// Since v20.3: Tweaking UI compression. Removes Tamper Global script dependency
// Since v20.2: Fixed VERIFY link for partnerUX.  Added United States to country data - missing orgId, of course?  Another new version of TM library. Revamped accessibility scanning, adding img altTag scan.
// Since v20.1: Updated PartnerUX homepage shortcuts for quotes to use updated route.  Merged partner offer- and quote- data. moved some style generation to a one-time area. Allowing .versions to be pasted into quickLink number field.
// Since v20.0: Updated required support library version
// Since v19.5: Tweaks for Partner app.  Added global scan to log multiple (identical) IDs and missing ARIA properties on some elements. Favorites for PartnerUX saved as string-objects. Updated accessibility icon.
// Since v19.4: Added ARIA check button. May move it out to a separate script.
// Since v19.3: Merged the functionality of the DSA-Menu "DSA Plugin" choice with that of the now-global battery icon.
// Since v19.2: Removing errant console.log. Moving setTamperIcon to tamperLibrary
// Since v19.1: Enhanced homepage link algorhythm
// Since v19: Bug Fixes. Colored favorites in partner favorites.
// Since v18: Renamed Import "Emailed Cart" to Import "eQuote" in main navigation. Added Partner UI homepage tweaks.
// Sinve v17: Tweaked app-controls to make them appear more centered.
// Since v16: Included the customer bar resizing css within the preferences-regulated gate. Tweaked it.
// Since v15: added hiding the walkme stuff to the options panel (apparently I did not know it was controlled via profile, first). Reduced timeout; feels more pleasant, but must test in case it kills performance. Adjusted config page title compressed Y value
// Since v14: bugfix: Adjusted customer-ribbon button y-position on orderReview and orderDetails. Created localStorage prefs
// Since v13: Fixed a smry-ctnr CSS bug
// Since v12: Modernized trigger elements. fixed the customer ribbon compression
// Since v11: Hid the walkme stuff
// Since v10: Re-added group alternating background colors
// Since v09: activates compression on scroll
// Since v08: Renamed
// Since v07: Includes G1, Prod
// Since v06: Tweaks to homepage
// Since v05: Fixes (again) the create-quote icon
//            Adds customer-dashboard icon
// Since v04: Added more of my own customers to the highlight-in-red list
// Since v03: Tweaking homepage column title area
// Since v02: updating tm support library. Changing the elements the script waits for on initialization
// Since v01: homepage search fields right-aligned in title rows
//          : doesn't swap col-4 for col-6 except on homepage
//          : COMMENTED OUT : customer ribbon compressed

/*
 * tm is an object included via @require from DorkForce's Tampermonkey Assist script
 */
(function() {
    'use strict';

    var TIMEOUT = 250,
        global = {
            scriptName: 'DSA Interface',
            prefsName: 'uiPrefs',
            prefs: {},
            mems: global != null ? global.mems : {}, // memsName: 'uiMems', // currently no need to actually save these ??
            triggerElements: ['.icon-ui-dell', '.dds__container'],
            isMouseMoved: false,
            areClassesAdded: false,
            partnerClassesAdded: false,
            areAlertsAdded: false,
            isResetting: undefined,
            hpCompressed: false
        },
        page = {
            initialize: function () {
                setTimeout(function () {
                    page.setPrefs();
                    //page.setMems(); // currently no need to actually save these ??
                    page.addClasses();
                    tm.addClasses();
                    tm.setTamperIcon(global);
                    tm.checkNotes(global);
                    page.addHighlights();
                    page.compression();
                    page.alternatingColors();
                    page.adjustPartnerUI();
                }, TIMEOUT);
            },
            setPrefs: function () {
                var currentPrefs = GM_getValue(global.prefsName);
                if (currentPrefs == null || _.isEmpty(JSON.parse(currentPrefs))) {
                    global.prefs = {
                        debugMode: 'false',
                        partnerOffers: [
                            {
                                "user": "testchina@chinaOEMOEM.com",
                                "invoices": [
                                    {
                                        "gEnv": "g2",
                                        "offerNum": "50125456.0",
                                        "orgId": "374"
                                    }
                                ]
                            },
                            {
                                "user": "svch@svfranceDIST.com.com",
                                "invoices": [
                                    {
                                        "gEnv": "g2",
                                        "offerNum": "13045689.0",
                                        "orgId": "328"
                                    }
                                ]
                            },
                            {
                                "user": "russ@alrosaooo.com",
                                "invoices": [
                                    {
                                        "gEnv": "g2",
                                        "solutionNum": "104804",
                                        "offerNum": "12009268.0",
                                        "orgId": "370",
                                        "quoteNum": "3000000739319.1"
                                    }
                                ]
                            },
                            {
                                "user": "uk@technocoin.com",
                                "invoices": [
                                    {
                                        "gEnv": "g2",
                                        "orgId": "302"
                                    }
                                ]
                            },
                            {
                                "user": "us@techtalk.com",
                                "invoices": [
                                    {
                                        "gEnv": "g2",
                                        "orgId": "8",
                                        "quoteNum": "3000000812572.1"
                                    }
                                ]
                            }
                        ],
                        hiliteInYourCustomers: '[04], [08], RETAIL',
                        hiliteColor: 'red',
                        compressUi: 'false',
                        hideWalkme: 'false'
                    };
                    global.prefs.partnerOffers = JSON.stringify(global.prefs.partnerOffers);//.replace(/(\r\n\t|\n|\r\t)/gm,'');//.replace(/"/gm, '\'');
                    tm.savePreferences(global.prefsName, global.prefs);
                } else {
                    global.prefs = JSON.parse(currentPrefs);
                }
            },
            //             setMems: function () { // currently no need to actually save these ??
            //                 var currentMems = GM_getValue(global.memsName);
            //                 if (currentMems == null || _.isEmpty(JSON.parse(currentMems))) {
            //                     global.mems = {
            //                         dupedIds: []
            //                     };
            //                     tm.savePreferences(global.memsName, global.mems);
            //                 } else {
            //                     global.prefs = JSON.parse(currentMems);
            //                 }
            //             },
            addClasses: function () {
                if (!global.areClassesAdded) {
                    global.areClassesAdded = true;

                    tm.addGlobalStyle('.cust-list-blk:hover {background-color: cornsilk}');
                    tm.addGlobalStyle('.home-sections .dotted {margin-top:3px; margin-bottom:3px;');
                    tm.addGlobalStyle('.home-sections .actv-block {padding-bottom:0;');
                    tm.addGlobalStyle('.singleActivity:hover {background-color: cornsilk;}');

                    tm.addGlobalStyle('.usertag {background-color: greenyellow;}');

                    // homepage column headers
                    tm.addGlobalStyle('.home-col-hdr h3 { font-size:1.3em; font-weight:bold; padding-top:3px; }');

                    // homepage search section
                    tm.addGlobalStyle('#home_search_container { margin-bottom: 0px; }');
                    tm.addGlobalStyle('#home_search_value { height: 30px; }');
                    tm.addGlobalStyle('#duplicate-po h3 { float: left; width: 200px; }');
                    tm.addGlobalStyle('#search_type_label { float: left; width: 110px; position: relative; top: 5px !important; }');
                    tm.addGlobalStyle('#search { float: left; width: 480px; padding: 0px !important; margin: 0px !important; }');
                    tm.addGlobalStyle('#search .input-search { position: initial !important; width: 100% !important; }');

                    // customer ribbon
                    if (global.prefs.compressUi === 'true') {
                        tm.addGlobalStyle('.app-nav {margin-top: 0;}');
                        tm.addGlobalStyle('.app-nav .app-title { padding-top:0; font-size:16px; line-height:1.1; }');
                        tm.addGlobalStyle('.current-business-unit { position:relative; top:-7px; }');
                    }

                    // hide Walk Me Through crap
                    if (global.prefs.hideWalkme === 'true') {
                        tm.addGlobalStyle('#walkme-player, .walkme-custom-icon-outer-div { display: none !important; }');
                    }

                    // ARIA button
                    tm.addGlobalStyle('.ariaButton {position:fixed; z-index:999999999; bottom:0px; right:40px; left:unset; content: url("https://www.dorkforce.com/dsa/preferences-desktop-accessibility-icon.png"); width:16px; height:16px;}');

                    // PartnerUX homepage links
                    tm.addGlobalStyle('#DSAHomePage h4 { margin:0; font-weight:bold !important; } ');
                    tm.addGlobalStyle('.inline {float:left; padding:5px 3px;} ');
                    tm.addGlobalStyle('.aFavoriteQuote       { clear:both; min-height:27px; cursor:default; }' +
                                      '.aFavoriteQuote:hover { background-color:cornsilk; font-weight:bold; }' +
                                      '.favoritesEnd         { clear:both; }');
                    tm.addGlobalStyle('.fixedWidth {width:200px; overflow:hidden; margin-right:10px; }');
                    tm.addGlobalStyle('#quickLink input, #quickLink select, #quickLink button, #quickLink radio {height:25px; margin-left:20px;}');
                    tm.addGlobalStyle('#quickLink { margin: 0 0 20px 0;}');
                    tm.addGlobalStyle('.gEnv { background:LightCyan; }');
                    tm.addGlobalStyle('.dEnv { background:powderBlue; }');
                    tm.addGlobalStyle('.lEnv { background:lightSteelBlue; }');
                    tm.addGlobalStyle('.unlinked { opacity:0.3; }');

                }
            },
            adjustPartnerUI: function () {
                if (global.prefs.debugMode === 'true') {
                    if($('.tamperlabel').length > 0 && $('.ariaButton').length === 0) {
                        $('.tamperlabel').before('<span class="ariaButton"></span>');
                    }
                    tm.getContainer({
                        'el': '.ariaButton'
                    }).then(function($container){
                        $('.ariaButton').css('cursor', 'pointer').unbind('click').on('click', function () {
                            ariaCheck.start(document); // TODO: finish as it doesn't seem to walk the entire dom
                        });
                    });
                }
                var verboseEnv = function(env) {
                    switch(env) {
                        case('g4'):
                            return 'ge4-sit';
                        case('g3'):
                            return 'ge3-sit';
                        case('g2'):
                            return 'ge2-sit';
                        default:
                            return 'ge1-sit';
                    }
                }
                if ($('.channel-header').length > 0 && !global.partnerClassesAdded) {
                    global.partnerClassesAdded = true;
                    tm.addGlobalStyle('.popupDetailWindow { position:fixed !important; }');
                }

                // hide the default popup Close because for some weird reason it's not working
                $('.popupDetailContent.fingery').hide();

                // localize vars
                var partners = global.prefs.partnerOffers != null ? JSON.parse(global.prefs.partnerOffers.replace(/'/gm, '"')) : [];
                partners = partners.sort(function(a, b){
                    if(a.name < b.name) { return -1; }
                    if(a.name > b.name) { return 1; }
                    return 0;
                })

                // modify logo
                var getUrl = window.location;
                var baseUrl = getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
                if (baseUrl.indexOf('online-sales') < 0) {
                    baseUrl = 'https://localhost.dell.com:5000/';
                }
                $('.dds__msthd-dell-icon').prop('href', baseUrl).css('color', 'yellow').attr('aria-label', 'Tampermonkey Homepage Link');


                if ($('#myQuotes').length === 0 && $('#DSAHomePage').length > 0) {
                    var countries = countryData();

                    // add quickLink form
                    $('#DSAHomePage').append('<H4 aria-label="Generate the URL for an offer or quote">QuickLink Generator</H4>');
                    var formString = '<div id="quickLink">[NUMBER][REGION][TYPE][SUBMIT]</div>';
                    var regionString = '<select id="regionInfo">[OPTIONS]</select>';
                    var regionOptions = '';
                    var numberString = '<input id="numberInfo" aria-label="Quick Link Generator Input Field"></input>';
                    var typeString =
                        '<input type="radio" name="typeInfo" value="offer" id="typeInfo1"                   /> <label for="typeInfo1">Offer</label>' +
                        '<input type="radio" name="typeInfo" value="quote" id="typeInfo2" checked="checked" /> <label for="typeInfo2">Quote</label>';
                    var submitString = '<button aria-label="Generate a Partner UX offer or quote URL and navigate to it" id="submitQuickLink">Go</button>';
                    regionOptions += '<option value="us/en/" orgId="8">UNITED STATES</option>'; // hack to force US at top
                    _.each(countries, (country) => {
                        regionOptions += '<option value="' + country.url.toLowerCase() + '" orgId="' + country.orgId + '">' + country.name + '</option>';
                    });
                    regionString = regionString.replace('[OPTIONS]', regionOptions);
                    formString = formString.replace('[REGION]', regionString);
                    formString = formString.replace('[NUMBER]', numberString);
                    formString = formString.replace('[TYPE]', typeString);
                    formString = formString.replace('[SUBMIT]', submitString);
                    $('#DSAHomePage').append(formString);

                    $('#submitQuickLink').on('click', () => {
                        var targetUrl = '/salesapp/';
                        var typeInfo = $('input[name=typeInfo]:checked').val();
                        var leNum = $('#numberInfo').val();
                        var leVer = leNum.split('.')[1] != null ? leNum.split('.')[1] : '1';
                        targetUrl += typeInfo === 'offer' ? $('#regionInfo').val() : 'us/en/';
                        targetUrl += typeInfo === 'offer' ? 'offer/' : 'quote/';
                        targetUrl += Math.trunc(Number(leNum)) + '/' + leVer + '/';
                        targetUrl += typeInfo === 'offer' ? $('#regionInfo option:selected').attr('orgId') : '';
                        window.location = (targetUrl);
                        return false;
                    });

                    // add favorites

                    $('#DSAHomePage').append('<H4 id="myQuotes" aria-label="My Favorite Quotes">My Favorite Quotes</H4>');
                    _.each(partners, function(partner) {
                        _.each(partner.invoices, function(invoice) {
                            var country = _.find(countries, function (country) { return country.orgId === Number(invoice.orgId); });
                            var region = country.region.toLowerCase() === 'emea' ? 'EURO' : country.region.toLowerCase() === 'amer' ? 'AMER' : 'ASIA';
                            var cPart = country.url.substr(0, 2);
                            var lPart = country.url.substr(3, 2);
                            var offerNum = invoice.offerNum != null && invoice.offerNum.split('.')[0] != null ? invoice.offerNum.split('.')[0] : invoice.offerNum;
                            var offerVer = invoice.offerNum != null && invoice.offerNum.split('.')[1] != null ? invoice.offerNum.split('.')[1] : '1';
                            var quoteNum = invoice.quoteNum != null && invoice.quoteNum.split('.')[0] != null ? invoice.quoteNum.split('.')[0] : invoice.quoteNum;
                            var quoteVer = invoice.quoteNum != null && invoice.quoteNum.split('.')[1] != null ? invoice.quoteNum.split('.')[1] : '1';
                            var appendString = '<div class="aFavoriteQuote">[COUNTRY][USER][VERIFY][BREAK][CONFIG][BREAK][G-ENV-PARTNER-OFFER][G-ENV-PARTNER-QUOTE][BREAK][DEV-ENV-OFFER][DEV-ENV-QUOTE][BREAK][LOCALOFFER][LOCALQUOTE][BREAK][G-ENV-DSA][BREAK][PCFDSALINK]</div>';
                            var countryLabel = '<div class="fixedWidth">' + country.name + '</div>';
                            var userLabel = '<div class="fixedWidth">' + partner.user + '</div>';
                            var verifyLink = offerNum == null ? '<span class="unlinked">Verify</span>' : '<a href="http://' + invoice.gEnv + 'vmoscux01.olqa.preol.dell.com/solutions/Configurator/api/QuoteCheckout/v1/' + region + '/CheckUserHasQuoteCheckoutAccess/' + offerNum + '/' + offerVer + '/' + partner.user + '">Verify</a>';
                            var configLink =
                                '<a href="https://www.dell.com/Identity/global/Login/a1e7fd82-03de-4731-8899-878cb868b8fa?c=' + cPart + '&l=' + lPart + '&redirecturl=' +
                                'http://www.dell.com/solutions/configurator/' + country.url + 'q_' + country.catalog + '/' + region + '/osc/your-solutions">Config</a>'
                            var gEnvPOffer = offerNum == null ? '<span class="unlinked">' + invoice.gEnv + 'Offer</span>' : '<a href="https://online-sales-ux-' + verboseEnv(invoice.gEnv) + '.ausvdc02.pcf.dell.com/salesapp/' + country.url + 'offer/' + offerNum + '/' + offerVer + '/' + invoice.orgId + '">' + invoice.gEnv + 'Offer</a>';
                            var gEnvPQuote = quoteNum == null ? '<span class="unlinked">' + invoice.gEnv + 'Quote</span>' : '<a href="https://online-sales-ux-' + verboseEnv(invoice.gEnv) + '.ausvdc02.pcf.dell.com/salesapp/' + country.url + 'quote/' + quoteNum + '/' + quoteVer + '">' + invoice.gEnv + 'Quote</a>';
                            var devOffer = offerNum == null ? '<span class="unlinked">devOffer</span>' : '<a href="https://online-sales-ux-dev.ausvdc02.pcf.dell.com/salesapp/' + country.url + 'offer/' + offerNum + '/' + offerVer + '/' + invoice.orgId + '">devOffer</a>';
                            var devQuote = quoteNum == null ? '<span class="unlinked">devQuote</span>' : '<a href="https://online-sales-ux-dev.ausvdc02.pcf.dell.com/salesapp/' + country.url + 'quote/' + quoteNum + '/' + quoteVer + '">devQuote</a>';
                            var gEnvDsa = quoteNum == null ? '<span class="unlinked">SalesApp ' + invoice.gEnv + '</span>' : '<a href="http://' + invoice.gEnv + 'vmcomux01.olqa.preol.dell.com/#/quote/details/QuoteNumber/' + quoteNum + '">SalesApp ' + invoice.gEnv + '</a>';
                            var localOffer = offerNum == null ? '<span class="unlinked">localOffer</span>' : '<a href="https://localhost.dell.com:5000/salesapp/' + country.url + 'offer/' + offerNum + '/' + offerVer + '/' + invoice.orgId + '">localOffer</a>';
                            var localQuote = quoteNum == null ? '<span class="unlinked">localQuote</span>' : '<a href="https://localhost.dell.com:5000/us/en/quote/' + quoteNum + '/' + quoteVer + '">localQuote</a>';
                            var pcfDsaLink = quoteNum == null ? '<span class="unlinked">PCFDSA</span>' : '<a href="https://dsa-sales-ux-ge4-sit.ausvdc02.pcf.dell.com/#/us/en/quote/' + quoteNum + '/' + quoteVer + '">PCFDSA</a>';
                            appendString = appendString.replace('[COUNTRY]', '<span class="inline">' + countryLabel + '</span>');
                            appendString = appendString.replace('[USER]', '<span class="inline">' + userLabel + '</span>');
                            appendString = appendString.replace('[VERIFY]', '<span class="inline">' + verifyLink + '</span>');
                            appendString = appendString.replace('[CONFIG]', '<span class="inline">' + configLink + '</span>');
                            appendString = appendString.replace('[G-ENV-PARTNER-OFFER]', '<span class="inline gEnv">(' + gEnvPOffer + '</span>');
                            appendString = appendString.replace('[G-ENV-PARTNER-QUOTE]', '<span class="inline gEnv">' + gEnvPQuote + ')</span>');
                            appendString = appendString.replace('[DEV-ENV-OFFER]', '<span class="inline dEnv">(' + devOffer + '</span>');
                            appendString = appendString.replace('[DEV-ENV-QUOTE]', '<span class="inline dEnv">' + devQuote + ')</span>');
                            appendString = appendString.replace('[G-ENV-DSA]', '<span class="inline gEnv">' + gEnvDsa + '</span>');
                            appendString = appendString.replace('[LOCALOFFER]', '<span class="inline lEnv">(' + localOffer + '</span>');
                            appendString = appendString.replace('[LOCALQUOTE]', '<span class="inline lEnv">' + localQuote + ')</span>');
                            appendString = appendString.replace('[PCFDSALINK]', '<span class="inline lEnv">' + pcfDsaLink + ')</span>');
                            appendString = appendString.replace(/\[BREAK\]/g, '<div class="inline" style="width:5px;"></div>');
                            $('#DSAHomePage').append(appendString);
                        });
                    });
                    $('#DSAHomePage').append('<div class="favoritesEnd"></div>');

                }
            },
            addHighlights: function () {
                var hiArray = global.prefs.hiliteInYourCustomers != null ? global.prefs.hiliteInYourCustomers.replace(/ */g, '').split(','): [];
                _.each(hiArray, function(hilite) {
                    $('.cust-list-blk a:contains("' + hilite + '")').css('color', global.prefs.hiliteColor);
                    $('.aFavoriteQuote a:contains("' + hilite + '")').css('color', global.prefs.hiliteColor);
                });
            },
            compression: function () {
                if (!global.hpCompressed && global.prefs.compressUi === 'true') {
                    //global.hpCompressed = true;

                    // config page floating title
                    $('.fixed-position-container').css({'top': '106px'});

                    // Column: Your Customers
                    $('.cust-list-blk').css({'height': '22px', 'font-size': '.8em', 'overflow': 'hidden'});
                    $('.icon-small-favorite-100').css({'height': '9px', 'width': '9px', 'background-position': '-287px -46px'});
                    $('.icon-small-favorite-0').css({'height': '9px', 'width': '9px', 'background-position': '-286px -137px'});
                    $('.remove-record').css({'top': '-3px', 'position': 'relative', 'height': '20px'});
                    $('.cust-list-blk a:contains(Create Quote)').css({'position': 'relative', 'float': 'right', 'top': '-13px'}).html('<span class="remove-record leQuote" style="background-position:-46px -144px;">&nbsp;</span>');
                    $('.cust-list-blk a:contains(View Dashboard)').css({'position': 'relative', 'float': 'right', 'top': '-13px'}).html('<span class="remove-record leDashboard" style="background-position:-47px -288px;">&nbsp;</span>');
                    $('.input-search').prev().hide();
                    $('.input-search').css({'position': 'absolute', 'top': '0', 'left': '56%', 'width': '40%'});
                    $('#yourCustomersSection a').eq(0).prop('innerText', 'All');

                    // recent activity
                    $('#homepageController_recentActivity_h').prop('innerText', 'Recent Activity');
                    $('#homepageController_recentActivity_h').parent().find('a').eq(0).prop('innerText', 'All');
                    $('.actv-type span:first-child').css('display', 'none');
                    $('.actv-type span:nth-child(2)').css('float', 'right');
                    $('#recentActivity_sortBy').parent().css({'position': 'absolute', 'top': '0', 'left': '57%', 'width': '40%'});

                    // hide last col
                    if($('.remove-record').length > 0) {
                        if ($('#main .col-md-4:nth-child(5)').length > 0) {
                            $('#main .col-md-4:nth-child(5)').remove();
                            $('#main .col-md-4').toggleClass("col-md-4").toggleClass("col-md-6");
                        }
                    }

                    // hide title
                    $('#home_recentActivity').parent().parent().hide();

                    // compress title bar
                    $('.top-nav').css({'padding': '3px 0 0 0'});
                    $('#dellBrandLogo_goHomePage').css({'font-size': '35px', 'height': '35px'});
                    $('.main-nav').css({'min-height': '40px', 'margin-bottom': '10px', 'height': '40px'});
                    if ($('#welcomeMessage').length === 0) {
                        $('.view-nav-withoutribbon').css({'margin-top': '30px'});
                    } else {
                        $('.app-nav-withoutribbon').css({'margin-top': '0'});
                    }
                    $('.brand-title').css({'line-height': '35px'});
                    $('.content-shell .view-nav').css({'top': '40px'});
                    $('.brand').next().next().css({'position': 'relative', 'top': '-8px'});
                    if($('.remove-record').length === 0) {
                        if($('.view-nav-withoutribbon').length > 0) {
                            $('.content-area').css({'margin-top': '10px'});
                        } else {
                            $('.content-area').css({'margin-top': '80px'}); // customer ribbon = 60px
                        }
                    }

                    // customer ribbon
                    $('.top-nav .container').css({'height': '37px'});
                    $('.content-shell .view-nav').css({'height': '40px', 'min-height': '40px'});
                    if ($('#orderReview_createOrder').length === 0 && $('#orderDetails_moreActions').length === 0) {
                        $('.app-controls').parent().css({'top': '-5px'});
                    } else {
                        $('.app-controls').parent().css({'top': '5px'});
                    }
                    if ($('h2:contains("Service Tag")').length > 0) {
                        $('.app-controls').css({'padding-top': '5px'});
                        if ($('h2:contains("Service Tag Groups")').length > 0) { //whyyyyy
                            $('.app-controls').css({'padding-top': '10px'});
                        }
                    }

                }
            },
            alternatingColors: function () {
                $('.line-group:odd').css('background-color', 'rgba(0, 0, 0, 0.1)');
            }
        };

    /*
     * Global functions
     */

    function initScript () {
        _.each(global.triggerElements, function (trigger) {
            tm.getContainer({
                'el': trigger,
                'max': 100,
                'spd': 1000
            }).then(function($container){
                page.initialize();
            });
        });
    }

    initScript();

    $(document).mousemove(function(e) {
        if (!global.isMouseMoved) {
            global.isMouseMoved = true;
            setTimeout(function() {
                global.isMouseMoved = false;
            }, TIMEOUT * 2);
            initScript();
        }
    });

    window.onresize = function(event) {
        initScript();
    };

    // TODO: verify that this isn't doubling efforts
    $(document).scroll(function() {
        page.compression();
        page.alternatingColors();
    });

    function countryData() {
        var countryArray = [
            {
                "name": "AUSTRIA",
                "region": "EMEA",
                "countryCode": "AT",
                "catalog": 383839,
                "buId": 3838,
                "orgId": 334,
                "url": "at/de/"
            },
            {
                "name": "BELGIUM",
                "region": "EMEA",
                "countryCode": "BE",
                "catalog": 282823,
                "buId": 2828,
                "orgId": 322,
                "url": "be/nl/"
            },
            //             {
            //                 "name": "BELGIUM",
            //                 "region": "EMEA",
            //                 "countryCode": "BE",
            //                 "catalog": 282823,
            //                 "buId": 2828,
            //                 "orgId": 322,
            //                 "url": "be/fr/"
            //             },
            {
                "name": "CZECH REPUBLIC",
                "region": "EMEA",
                "countryCode": "CZ",
                "catalog": 343419,
                "buId": 3434,
                "orgId": 363,
                "url": "cz/en/"
            },
            {
                "name": "DENMARK",
                "region": "EMEA",
                "countryCode": "DK",
                "catalog": 122455,
                "buId": 1224,
                "orgId": 330,
                "url": "dk/en/"
            },
            {
                "name": "EGYPT",
                "region": "EMEA",
                "countryCode": "EG",
                "catalog": 545523,
                "buId": 5455,
                "orgId": 324,
                "url": "eg/en/"
            },
            {
                "name": "FINLAND",
                "region": "EMEA",
                "countryCode": "FI",
                "catalog": 122271,
                "buId": 1222,
                "orgId": 331,
                "url": "fi/en/"
            },
            {
                "name": "FRANCE",
                "region": "EMEA",
                "countryCode": "FR",
                "catalog": 90917,
                "buId": 909,
                "orgId": 328,
                "url": "fr/fr/"
            },
            {
                "name": "GERMANY",
                "region": "EMEA",
                "countryCode": "DE",
                "catalog": 80852,
                "buId": 808,
                "orgId": 323,
                "url": "de/de/"
            },
            {
                "name": "GREECE",
                "region": "EMEA",
                "countryCode": "GR",
                "catalog": 500092,
                "buId": 5000,
                "orgId": 342,
                "url": "gr/en/"
            },
            {
                "name": "HUNGARY",
                "region": "EMEA",
                "countryCode": "HU",
                "catalog": 545523,
                "buId": 552,
                "orgId": 324,
                "url": "hu/en/"
            },
            {
                "name": "IRELAND",
                "region": "EMEA",
                "countryCode": "IE",
                "catalog": 510293,
                "buId": 5102,
                "orgId": 301,
                "url": "ie/en/"
            },
            {
                "name": "ISRAEL",
                "region": "EMEA",
                "countryCode": "IL",
                "catalog": 545523,
                "buId": 572,
                "orgId": 369,
                "url": "il/en/"
            },
            {
                "name": "ITALY",
                "region": "EMEA",
                "countryCode": "IT",
                "catalog": 616177,
                "buId": 6161,
                "orgId": 329,
                "url": "it/en/"
            },
            {
                "name": "KAZAKHSTAN",
                "region": "EMEA",
                "countryCode": "KZ",
                "catalog": 545523,
                "buId": 5455,
                "orgId": 324,
                "url": "kz/en/"
            },
            {
                "name": "KENYA",
                "region": "EMEA",
                "countryCode": "KE",
                "catalog": 545523,
                "buId": 5455,
                "orgId": 324,
                "url": "ke/en/"
            },
            {
                "name": "LITHUANIA",
                "region": "EMEA",
                "countryCode": "LT",
                "catalog": 545523,
                "buId": 5455,
                "orgId": 324,
                "url": "lt/en/"
            },
            {
                "name": "LUXEMBOURG",
                "region": "EMEA",
                "countryCode": "LU",
                "catalog": 53102,
                "buId": 531,
                "orgId": 366,
                "url": "lu/fr/"
            },
            {
                "name": "MOROCCO",
                "region": "EMEA",
                "countryCode": "MA",
                "catalog": 545523,
                "buId": 5455,
                "orgId": 324,
                "url": "ma/en/"
            },
            {
                "name": "NETHERLANDS",
                "region": "EMEA",
                "countryCode": "NL",
                "catalog": 212129,
                "buId": 2121,
                "orgId": 325,
                "url": "nl/en/"
            },
            {
                "name": "NIGERIA",
                "region": "EMEA",
                "countryCode": "NG",
                "catalog": 545523,
                "buId": 5455,
                "orgId": 324,
                "url": "ng/en/"
            },
            {
                "name": "NORWAY",
                "region": "EMEA",
                "countryCode": "NO",
                "catalog": 232380,
                "buId": 2323,
                "orgId": 326,
                "url": "no/en/"
            },
            {
                "name": "POLAND",
                "region": "EMEA",
                "countryCode": "PL",
                "catalog": 313118,
                "buId": 3131,
                "orgId": 362,
                "url": "pl/pl/"
            },
            {
                "name": "PORTUGAL",
                "region": "EMEA",
                "countryCode": "PT",
                "catalog": 292924,
                "buId": 2929,
                "orgId": 364,
                "url": "pt/en/"
            },
            {
                "name": "QATAR",
                "region": "EMEA",
                "countryCode": "QA",
                "catalog": 545523,
                "buId": 5455,
                "orgId": 324,
                "url": "qa/en/"
            },
            {
                "name": "ROMANIA",
                "region": "EMEA",
                "countryCode": "RO",
                "catalog": 545523,
                "buId": 5455,
                "orgId": 324,
                "url": "ro/en/"
            },
            {
                "name": "RUSSIA",
                "region": "EMEA",
                "countryCode": "RU",
                "catalog": 54652,
                "buId": 546,
                "orgId": 370,
                "url": "ru/ru/"
            },
            {
                "name": "SAUDI ARABIA",
                "region": "EMEA",
                "countryCode": "SA",
                "catalog": 545523,
                "buId": 584,
                "orgId": 324,
                "url": "sa/en/"
            },
            {
                "name": "SLOVAKIA",
                "region": "EMEA",
                "countryCode": "SK",
                "catalog": 59202,
                "buId": 592,
                "orgId": 365,
                "url": "sk/en/"
            },
            {
                "name": "SLOVENIA",
                "region": "EMEA",
                "countryCode": "SI",
                "catalog": 545523,
                "buId": 5455,
                "orgId": 324,
                "url": "si/en/"
            },
            {
                "name": "SOUTH AFRICA",
                "region": "EMEA",
                "countryCode": "ZA",
                "catalog": 696926,
                "buId": 6969,
                "orgId": 337,
                "url": "za/en/"
            },
            {
                "name": "SPAIN",
                "region": "EMEA",
                "countryCode": "ES",
                "catalog": 191965,
                "buId": 1919,
                "orgId": 327,
                "url": "es/es/"
            },
            {
                "name": "SWEDEN",
                "region": "EMEA",
                "countryCode": "SE",
                "catalog": 121285,
                "buId": 1212,
                "orgId": 332,
                "url": "se/en/"
            },
            {
                "name": "SWITZERLAND",
                "region": "EMEA",
                "countryCode": "CH",
                "catalog": 272742,
                "buId": 2727,
                "orgId": 335,
                "url": "ch/de/"
            },
            //             {
            //                 "name": "SWITZERLAND",
            //                 "region": "EMEA",
            //                 "countryCode": "CH",
            //                 "catalog": 272742,
            //                 "buId": 2727,
            //                 "orgId": 335,
            //                 "url": "ch/fr/"
            //             },
            {
                "name": "TURKEY",
                "region": "EMEA",
                "countryCode": "TR",
                "catalog": 55152,
                "buId": 551,
                "orgId": 371,
                "url": "tr/tr/"
            },
            {
                "name": "UKRAINE",
                "region": "EMEA",
                "countryCode": "UA",
                "catalog": 545523,
                "buId": 547,
                "orgId": 324,
                "url": "ua/en/"
            },
            {
                "name": "UNITED ARAB EMIRATES",
                "region": "EMEA",
                "countryCode": "AE",
                "catalog": 545523,
                "buId": 5959,
                "orgId": 324,
                "url": "ae/en/"
            },
            {
                "name": "United Kingdom",
                "region": "EMEA",
                "countryCode": "UK",
                "catalog": 20204,
                "buId": 202,
                "orgId": 302,
                "url": "uk/en/"
            },
            {
                "name": "United States",
                "region": "AMER",
                "countryCode": "US",
                "catalog": 8,
                "buId": 11,
                "orgId": 8,
                "url": "us/en/"
            },
            {
                "name": "AFGHANISTAN",
                "region": "APJ",
                "countryCode": "AF",
                "catalog": 34003,
                "buId": 4075,
                "orgId": 380,
                "url": "af/en/"
            },
            {
                "name": "AUSTRALIA",
                "region": "APJ",
                "countryCode": "AU",
                "catalog": 39101,
                "buId": 1401,
                "orgId": 376,
                "url": "au/en/"
            },
            {
                "name": "CAMBODIA",
                "region": "APJ",
                "countryCode": "KH",
                "catalog": 34003,
                "buId": 4075,
                "orgId": 380,
                "url": "kh/en/"
            },
            {
                "name": "CHINA",
                "region": "APJ",
                "countryCode": "CN",
                "catalog": 46003,
                "buId": 8270,
                "orgId": 374,
                "url": "cn/zh/"
            },
            {
                "name": "FIJI",
                "region": "APJ",
                "countryCode": "FJ",
                "catalog": 34003,
                "buId": 4075,
                "orgId": 380,
                "url": "fj/en/"
            },
            {
                "name": "HONG KONG",
                "region": "APJ",
                "countryCode": "HK",
                "catalog": 76003,
                "buId": 4042,
                "orgId": 377,
                "url": "hk/en/"
            },
            {
                "name": "INDIA",
                "region": "APJ",
                "countryCode": "IN",
                "catalog": 79003,
                "buId": 1717,
                "orgId": 384,
                "url": "in/en/"
            },
            {
                "name": "INDONESIA",
                "region": "APJ",
                "countryCode": "ID",
                "catalog": 43903,
                "buId": 439,
                "orgId": 390,
                "url": "id/en/"
            },
            {
                "name": "JAPAN",
                "region": "APJ",
                "countryCode": "JP",
                "catalog": 353504,
                "buId": 3535,
                "orgId": 389,
                "url": "jp/ja/"
            },
            {
                "name": "LAOS",
                "region": "APJ",
                "countryCode": "LA",
                "catalog": 34003,
                "buId": 4075,
                "orgId": 380,
                "url": "la/en/"
            },
            {
                "name": "MALAYSIA",
                "region": "APJ",
                "countryCode": "MY",
                "catalog": 30003,
                "buId": 4046,
                "orgId": 375,
                "url": "my/en/"
            },
            {
                "name": "MONGOLIA",
                "region": "APJ",
                "countryCode": "MN",
                "catalog": 34003,
                "buId": 4075,
                "orgId": 380,
                "url": "mn/en/"
            },
            {
                "name": "MYANMAR",
                "region": "APJ",
                "countryCode": "MM",
                "catalog": 34003,
                "buId": 4075,
                "orgId": 380,
                "url": "mm/en/"
            },
            {
                "name": "NEPAL",
                "region": "APJ",
                "countryCode": "NP",
                "catalog": 34003,
                "buId": 4075,
                "orgId": 380,
                "url": "np/en/"
            },
            {
                "name": "NEW ZEALAND",
                "region": "APJ",
                "countryCode": "NZ",
                "catalog": 36103,
                "buId": 4065,
                "orgId": 378,
                "url": "nz/en/"
            },
            {
                "name": "PAKISTAN",
                "region": "APJ",
                "countryCode": "PK",
                "catalog": 34003,
                "buId": 4075,
                "orgId": 380,
                "url": "pk/en/"
            },
            {
                "name": "PAPUA NEW GUINEA",
                "region": "APJ",
                "countryCode": "PG",
                "catalog": 34003,
                "buId": 4075,
                "orgId": 380,
                "url": "pg/en/"
            },
            {
                "name": "PHILIPPINES",
                "region": "APJ",
                "countryCode": "PH",
                "catalog": 34003,
                "buId": 4075,
                "orgId": 380,
                "url": "ph/en/"
            },
            {
                "name": "SAMOA",
                "region": "APJ",
                "countryCode": "WS",
                "catalog": 34003,
                "buId": 4075,
                "orgId": 380,
                "url": "ws/en/"
            },
            {
                "name": "SINGAPORE",
                "region": "APJ",
                "countryCode": "SG",
                "catalog": 32003,
                "buId": 1313,
                "orgId": 385,
                "url": "sg/en/"
            },
            //             {
            //                 "name": "SOUTH KOREA",
            //                 "region": "APJ",
            //                 "countryCode": "KR",
            //                 "catalog": 35003,
            //                 "buId": 4545,
            //                 "orgId": 386,
            //                 "url": "kr/fr/"
            //             },
            {
                "name": "SOUTH KOREA",
                "region": "APJ",
                "countryCode": "KR",
                "catalog": 35003,
                "buId": 4545,
                "orgId": 386,
                "url": "kr/ko/"
            },
            {
                "name": "SRI LANKA",
                "region": "APJ",
                "countryCode": "LK",
                "catalog": 34003,
                "buId": 4075,
                "orgId": 380,
                "url": "lk/en/"
            },
            {
                "name": "TAIWAN",
                "region": "APJ",
                "countryCode": "TW",
                "catalog": 37003,
                "buId": 1841,
                "orgId": 387,
                "url": "tw/zh/"
            },
            {
                "name": "THAILAND",
                "region": "APJ",
                "countryCode": "TH",
                "catalog": 38003,
                "buId": 4444,
                "orgId": 388,
                "url": "th/en/"
            },
            {
                "name": "VIET NAM",
                "region": "APJ",
                "countryCode": "VN",
                "catalog": 34003,
                "buId": 4075,
                "orgId": 380,
                "url": "vn/en/"
            }
        ];
        return countryArray.sort(function(a, b){
            if(a.name < b.name) { return -1; }
            if(a.name > b.name) { return 1; }
            return 0;
        })
    }

})();