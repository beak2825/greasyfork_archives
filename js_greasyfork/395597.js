// ==UserScript==
// @name         Vintage Seiko Savvy Search
// @namespace    http://tampermonkey.net/
// @version      0.41
// @description  finds vintage seiko (series 2,3,4,5,6,7,8) model numbers on webpages, and inserts links to relevant reference sites.
// @author       Jake Lewis
// @license      GPL 2.0

//Todo movement links to https://www.kingseiko.info/index.html and seikoguy

//// INPUT WEBSITES:

////     auctions

//// include      https://vi.vipr.ebaydesc.com/*
// @include      https://www.ebay.*
// @include      https://auctions.yahoo.co.jp/*
// @include      https://*.auctions.yahoo.co.jp/jp/auction/*
// @include      https://www.dejapan.com/*
// @include      https://zenmarket.jp/*
// @include      https://www.fromjapan.co.jp/*
// @include      https://neokyo.com/*
// @include      https://www.tenso.com/*
// @include      https://www.sendico.com/*

// @include      https://www.chrono24.com/seiko/*
// @include      https://buyee.jp/item/yahoo/auction/*
// @include      https://buyee.jp/myorders/*
// @include      https://buyee.jp/item/search/query/*
// @include      https://buyee.jp/snipe/*
// @include      https://buyee.jp/mercari/*
// @include      https://www.shopgoodwill.com/*

// @match        https://watchcharts.com/*
// @match        https://picclick.com/*
//// match        https://www.mercari.com/*

////reference
// @match        http://www.watchsleuth.com/*
// @match        http://www.ranfft.de/*
// @match        https://calibercorner.com/*
// @match        https://www.theseikoguy.com/*
// @match        https://www.kingseiko.info/*
// @match        https://www.watchandvintage.fr/*

// forums
// @match        https://www.reddit.com/*
// @match        https://www.thewatchsite.com/*
// @match        https://*.proboards.com/*
// @match        http://*.proboards.com/*
// @match        https://forums.watchuseek.com/*
// @match        https://www.watchuseek.com/threads/*
// @match        https://forums.timezone.com/*
// @match        https://www.thewatchforum.co.uk/*
// @match        https://www.tapatalk.com/groups/seikocitizenforum/*
// @match        https://www.watchpatrol.net/*
// @match        https://www.watchrecon.com/*
// @match        https://www.tapatalk.com/groups/seikoholics/*

////retail
// @match        https://www.esslinger.com/gs-watch-crystal*
// @match        https://www.esslinger.com/genuine-seiko-replacement-watch-stems*
// @match        http://cgi.julesborel.com/cgi-bin/*
// @match        https://boley.de/en/case-parts*
// @match        https://gssupplies.com/*
// @match        https://www.ofrei.com/page721.html*
// @match        https://www.ofrei.com/page_169.html*
// @match        https://www.cousinsuk.com/*
// @match        https://gleave.london/*
// @match        https://www.aliexpress.us/*

//search engines
// @match        https://www.bing.com/*
// @match        https://www.google.com/*
// @match        https://duckduckgo.com/*
// @match        https://www.ecosia.org/*

//blogs / magazines
// @match https://adventuresinamateurwatchfettling.com/*
// @match https://thewatchspotblog.com/*
// @match https://myretrowatches.com/*
// @match https://vintageseikoblog.blogspot.com/*
// @match https://vintageseiko.nl/*
// @match https://monochrome-watches.com/*
// @match https://*.hodinkee.com/*
// @match https://horologyobsession.com/*
// @match https://thegrandseikoguy.com/*
// @match https://thegrandseikoguy.substack.com/*
// @match https://www.beyondthedial.com/*

//online watch store
// @match https://nonkun.com/*

///social



// @run-at   document-idle
// @grant    GM.getValue
// @grant    GM.setValue

//known failures
////match        https://docs.google.com/spreadsheets/*    doesn't work :(

//// match https://wornandwound.com/*   bad layout
// @match https://www.fratellowatches.com/*

// @downloadURL https://update.greasyfork.org/scripts/395597/Vintage%20Seiko%20Savvy%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/395597/Vintage%20Seiko%20Savvy%20Search.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    var POPUP_TIMEOUT = 250
    var hoverspan = null;// singleton -  just one popup at a time.
    var ebayDomainExtension = await GM.getValue("ebayDomainExtension", ".com"); //ebay.com by default
    var toggleSectionsFlags = parseInt(await GM.getValue("toggleSectionsFlags", "-1"),10); //everything is on by default;
    var hostName = window.location.hostname;
    var ebayStr = hostName.indexOf(".ebay.");
    if (ebayStr > 0) {
        ebayDomainExtension = hostName.substring(ebayStr + 5);
        await GM.setValue("ebayDomainExtension", ebayDomainExtension);
    }


    const TOGGLE_SECTION_CRYSTAL     = 0;
    const TOGGLE_SECTION_MOVEMENT    = 1;
    const TOGGLE_SECTION_MAINSPRING  = 2;
    const TOGGLE_SECTION_AUCTION     = 3;
    const TOGGLE_SECTION_FORUM       = 4;
    const TOGGLE_SECTION_CROWN       = 5;


    //https://regexr.com/
    //https://medium.com/factory-mind/regex-tutorial-a-simple-cheatsheet-by-examples-649dc1c3f285

    var SeikoVintageRegex = '[023456789A-HLM]\\d\\d\\d[\\s-\\u30FC\\uFF70]{1,3}[0-9]{3}[A-G0-9]'; //<----  THIS IS THE ONE TO ALTER TO ALLOW MORE CASE CODES ----
    var SeikoVintageRegexOuter = new RegExp("(\\W|^)" + SeikoVintageRegex + "(\\W|$)", 'g') // must have none alpha numeric characters before and after, or be at beginning or end of text - this prevents phone numbers etc such as 66139-8000
    var SeikoVintageRegexInner = new RegExp(SeikoVintageRegex, 'g'); // this is the straight seiko case code, to be matched against the results of the Outer search

    var SeikoRoundCrystalRegex = /[ATSREBKW23][LDQESAO\d][05][WTVGXNDRYAP]\d\d[AEGHJKLSZ][NCKBDEAMHUGPZFVJRWTLY][MLPVYOSGE0]?\w?/g;
    var SeikoGasketOldRegex = /[ADBFOE0][ABCDEFGHIJ]\d{4}[BLNOWYE]\d?\d?/g;
   // var SeikoGasketNewRegex = /[ADBFOE0][ABCDEFGHJKLMNPRSZ]\d{3}[BLNOWYE]\d?\d?/g;
    var SeikoCrownRegex = /\d\d[REDMW]\d\d[N][ASG]?\d?/g;
    var SeikoPartRegex = /Seiko\s+\d{6}/i;

    var SKRegex = /[XM][ASFHLDMY]?[GCHDRBFO]?[\s]?\d{3}.?\d{0,3}/g;


    var root = document.body;
    var url = window.location.href;
    console.log("Vintage Seiko Savvy Search " + url);
    var queryObject = {};
    var split;
    var queries = window.location.search.replace(/^\?/, '').split('&');
    for (var i = 0; i < queries.length; i++) {
        split = queries[i].split('=');
        queryObject[split[0]] = decodeURI(split[1]);
    }
    //  console.log("Vintage Seiko Savvy Search "+queryObject);


    var series44__ = "4400,4402,4420";
    var series51__ = "5106,5126,5139,5146,";
    var series52__ = "5206,5216,5245,5256,";
    var series560_ = "5606,5601,5605,5619,";
    var series562_ = "5621,5625,5626,5641,5645,5646,";
    var series610_hand = "6100A,6102A,6110A,";
    var series610_ = "6105A,6105B,6106A,6106B,6106C,6109,";
    var series611_ = "6118A,6119A,6119B,6119C,";
    var series61_GS = "6145A,6146A,6155A,6156A,6185A,6185B,6186A,";
    var series70__ = "7001A,7002A,7005A,7006A,7025A,7009A,7019A,7029A,";


    //https://calibercorner.com/seiko-caliber-
    var caliberCorner = [ ["2906a"], ["5740c"], ["6117b"], ["6139b"], ["6309"], ["7002a"] ];


    var FratelloReview = [
        ["tbt-seiko-5126-8090-kamen-rider-ultraman/", "5126-8090"],
        ["tbt-seiko-6105-8110/", "6105-8110"],
        ["tbt-seiko-6106-8100-a-closer-look-at-the-first-sports-diver/", "6106-8100"],
        ["tbt-seiko-6106-8229-rally-diver/", "6106-8229"],
        ["tbt-seiko-6139-pogue-chronograph/", "6139-600"],
        ["tbt-seiko-6159-7010-tuna/", "6159-7010,6159-7000"],
        ["tbt-seiko-6309-diver/", "6309-704"],
        ["tbt-seiko-6619-8060-macv-sog-a-sterile-watch/", "6619-8060"],
        ["tbt-seiko-7002-diver-review-vintage/", "7002-700"],
        ["tbt-seiko-7549-7010-tuna-can-40-years-bold/", "7549-7010"],
        ["tbt-seiko-7549-golden-tuna/", "7549-7000"],
        ["tbt-seiko-7a28-7090-yacht-timer-chronograph/", "7a28-7090"],
        ["tbt-seiko-bullhead-6138-0040/", "6138-0040"],
        ["tbt-seiko-h558-arnie-diver-review/", "H558-500"],
        ["tbt-seiko-navigator-timer/", "6117-8000"],
        ["tbt-seiko-sportsmatic-6619-8230/", "6619-8230"],
        ["seiko-62mas-the-first-professional-diver-watch-by-seiko/", "6217-800"],
        ["tbt-a-look-at-the-underappreciated-seiko-6105-8000/", "6105-8000"],
        ["seiko-seahorse-6601-8830-watch-review-62mas/","6601-8830"],
        ["tbt-the-vintage-seiko-sport-divers/","6106-8100,6106-7107,6119-8460,6119-7163"],
        ["tbt-king-seiko-45-7001/","45-7001"],
        ["king-seiko-5626-7000/", "5626-7000"],
        ["seiko-silverwave-697990-explained/","69799"],
        ["seiko-silverwave-j13082-seikos-first-diver/","j13082"],
        ["seiko-7016-8000/","7016-8000"],
        ["top-vintage-seiko-divers/","6217-8000,6215-7000,6159-7000,6105-8000,6106-8100,6105-8110,6159-7010,6306-7000,6309-7040,7549-7000,7549-7010,7548-7000"],
        ["tbt-extra-seiko-6159-tuna-original-owner//","6159-7010,6159-7000"],

    ];

    var WatchUseekManuals = [
        ["0124A",""],//5 872k
        ["0138A",""],//6 1.0M
        ["0139A",""],//6 1013k
        ["0159A",""],//6 79k
        ["0439A",""],//6 1011k
        ["0532A",""],//6 1.0M
        ["0624A",""],//7 1.6M
        ["0634A",""],//7 614k
        ["0634B",""],//7 77k
        ["0644A_0664A",""],//7 612k
        ["0662A",""],//7 82k
        ["0674A",""],//7 899k
        ["0680A",""],//7 875k
        ["0843A",""],//8 1019k
        ["0903A",""],//8 1.3M
        ["1100A",""],//8 74k
        ["1104A",""],//8 730k
        ["11A",""],//8 180k
        ["1230A",""],//8 364k
        ["1231A",""],//8 150k
        ["1320A-1",""],//9 629k
        ["1320A-2",""],//9 624k
        ["1421A",""],//9 89k
        ["1421A_1428A",""],//9 234k
        ["1428A",""],//9 77k
        ["14A-1",""],//9 474k
        ["14A-2",""],//9 520k
        ["14B",""],//9 89k
        ["14C",""],//9 90k
        ["1520A",""],//9 83k
        ["1520B",""],//9 163k
        ["15A",""],//9 66k
        ["16A",""],//0 798k
        ["17A",""],//9 296k
        ["1A20A_1E50A-2",""],//0 214k
        ["1E20A",""],//0 116k
        ["1E20A_1E50A-1",""],//0 201k
        ["1E50A",""],//0 75k
        ["1F20A",""],//0 111k
        ["1N00A_1N01A",""],//0 221k
        ["2104A",""],//0 109k
        ["2104B",""],//0 105k
        ["2118A",""],//0 134k
        ["21A",""],//0 53k
        ["21C",""],//0 102k
        ["21D",""],//0 104k
        ["2202A",""],//0 508k
        ["2205A",""],//0 721k
        ["2206A",""],//0 340k
        ["2220A",""],//1 271k
        ["2320A-1",""],//1 696k
        ["2320A-2",""],//1 630k
        ["2406A",""],//1 392k
        ["2409A",""],//1 113k
        ["2415A",""],//1 129k
        ["2418A",""],//1 105k
        ["2419A",""],//1 115k
        ["2501A",""],//1 64k
        ["2505A",""],//1 104k
        ["2505B",""],//1 197k
        ["2517A",""],//1 112k
        ["2517B",""],//2 1010k
        ["2620A",""],//1 96k
        ["2620B",""],//1 107k
        ["2622A",""],//1 131k
        ["2623A",""],//1 127k
        ["2625A",""],//2 440k
        ["2625B",""],//2 123k
        ["2626A",""],//2 139k
        ["2626B",""],//2 139k
        ["2628A",""],//2 239k
        ["2633A",""],//2 575k
        ["2639A",""],//2 108k
        ["2661A",""],//2 138k
        ["2706A",""],//2 635k
        ["2906A",""],//2 340k
        ["2919A",""],//2 140k
        ["2949A",""],//2 110k
        ["2A22,2A23,2A27,2A29",""],//3 190k
        ["2A22A_23A_29A_32A",""],//3 424k
        ["2A24A",""],//3 92k
        ["2A24A_2A54A",""],//3 110k
        ["2A27A",""],//3 112k
        ["2A32A",""],//3 106k
        ["2A52A",""],//3 95k
        ["2A54A",""],//3 97k
        //["2A_series",""],//3 190k
        ["2B20A",""],//3 98k
        ["2B21A-1",""],//3 74k
        ["2B21A-2",""],//3 261k
        ["2B31A",""],//3 132k
        ["2C20A_2C21A",""],//3 414k
        ["2D22A-1",""],//3 85k
        ["2D22A-2",""],//3 289k
        ["2E20A",""],//3 309k
        ["2E20B",""],//4 115k
        ["2E50A",""],//4 120k
        ["2F50A",""],//4 373k
        ["2G28A_2G38A",""],//4 226k
        ["2K00A",""],//4 99k
        ["2K01A",""],//4 121k
        ["2K02A_2K03A",""],//4 182k
        ["2N20A",""],//4 161k
        ["2P20A",""],//4 172k
        ["2P21A",""],//4 154k
        ["2Y00A",""],//4 137k
        ["2Y01A",""],//4 173k
        ["2_7t84_g",""],//5 1.7M
        ["3421A",""],//4 90k
        ["3421A_3423A",""],//4 209k
        ["3423A",""],//4 103k
        ["3803A",""],//5 157k
        ["3803A_3823A",""],//5 1.8M
        ["3819A_3863A",""],//5 897k
        ["3823A",""],//5 117k
        //["3E22A,3E23A,3E29A,3E..&gt; 5 173k
        //["3E22A_23A_29A_32A_39..&gt; 5 174k
        ["3L12A,3L14A,3L19A",""],//5 131k
        ["3L12A_14A_19A",""],//5 132k
        ["3M21_22ASupplement",""],//5 58k
        ["3M22A",""],//6 267k
        ["3M62A",""],//6 2.2M
        ["3Y02A_03A_09A",""],//6 177k
        ["4006A",""],//6 1.5M
        ["4100A_4110A",""],//6 701k
        ["4110A",""],//6 96k
        ["4110B",""],//6 123k
        ["41A",""],//6 65k
        ["4205A",""],//7 271k
        ["4205B_4206B_4207B",""],//7 222k
        ["4206A",""],//7 367k
        ["4216A",""],//7 113k
        ["4219A",""],//7 105k
        ["4302A",""],//7 117k
        ["4303A",""],//7 129k
        ["4312A",""],//7 96k
        ["4325A",""],//7 139k
        ["4326A",""],//7 138k
        ["4336A",""],//7 920k
        ["43A",""],//7 80k
        ["43A_4303A",""],//7 660k
        ["4633A",""],//8 719k
        ["47A",""],//8 705k
        ["4823A",""],//8 523k
        ["4826A",""],//8 1.1M
        ["4F32A_8F32A_33A_35A",""],//9 3.7M
        ["4F56A_8F56A",""],//9 578k
        ["4F8Fbatteryreplace",""],//9 156k
        ["4K22A",""],//9 187k
        ["4K24A",""],//9 172k
        ["4K25A_4K26A",""],//9 267k
        ["4M21A",""],//0 409k
        ["4M21ASupplement",""],//9 65k
        ["4N00B_20B_01B",""],//0 256k
        ["4N01B,4N20B,4N01B",""],//0 256k
        ["4S15A",""],//0 383k
        ["4S77A",""],//0 1.6M
        ["5206A",""],//0 608k
        ["5245A",""],//0 123k
        ["5246A",""],//0 128k
        ["5420A",""],//1 266k
        ["5421A",""],//1 248k
        ["5606A",""],//1 355k
        ["5606A_2",""],//1 499k
        ["5619A",""],//1 192k
        ["5626A",""],//1 139k
        ["5626B",""],//1 134k
        ["5930A-1",""],//1 90k
        ["5930A-2",""],//1 95k
        ["5931A-1",""],//1 659k
        ["5931A-2",""],//1 661k
        ["5932A-1",""],//1 116k
        ["5932A-2",""],//1 120k
        ["5933A",""],//1 110k
        ["5939A",""],//1 158k
        ["5A50A",""],//2 458k
        ["5C20A_5C23A",""],//2 422k
        ["5D22",""],//2 1.5M
        ["5E20A",""],//2 111k
        ["5E29A",""],//2 96k
        ["5G23A",""],//2 144k
        ["5H22A_5H23A",""],//2 135k
        ["5J22A",""],//3 1.7M
        ["5J32A",""],//3 1.7M
        ["5K25A",""],//3 350k
        ["5L14A_5L15A",""],//3 127k
        ["5M2223A_Supplement",""],//3 67k
        ["5M22A_5M23A",""],//3 355k
        ["5M42A_5M43A",""],//3 315k
        ["5M45A",""],//3 468k
        ["5M6263A",""],//4 2.0M
        ["5P22A_23A_29A",""],//3 223k
        ["5P30A_31A_32A_39A",""],//4 182k
        ["5S21A",""],//4 180k
        ["5T32B_5T52B",""],//4 611k
        ["5T52A",""],//4 354k
        ["5Y01A_02A_13A",""],//4 159k
        ["5Y01A_5Y02A",""],//4 97k
        ["5Y13A",""],//4 101k
        //["5Y22A_23A_30A_31A_32..&gt; 4 276k
        ["5Y86A",""],//4 146k
        ["5Y88A",""],//4 148k
        ["5Y91A",""],//4 158k
        ["6020A-1",""],//5 695k
        ["6020A-2",""],//5 678k
        ["6030A",""],//5 135k
        ["6105A",""],//5 87k
        ["6105B",""],//5 92k
        //["6106A",""],//5 533k
        ["6106A_2",""],//5 644k
        ["6106B",""],//5 222k
        ["6106C",""],//5 234k
        ["6109A",""],//5 103k
        ["6117A",""],//5 117k
        ["6117B",""],//5 119k
        ["6118A",""],//5 138k
        ["6119A",""],//5 112k
        ["6119B",""],//5 135k
        ["6119C",""],//5 124k
        ["6138 & 6139 Calibers Repair Manual",""],//
        ["6138A",""],//6 716k
        ["6138B",""],//6 322k
        ["6139A",""],//7 2.0M
        ["6139B",""],//7 256k
        ["6159B",""],//7 97k
        ["6306A",""],//01-Mar-2012 14:05 4.42mb
        ["6308A",""],//7 99k
        ["6309A",""],//7 664k
        ["6309B",""],//7 199k
        ["6319A",""],//7 107k
        ["6347A",""],//8 245k
        ["6349A",""],//8 107k
        ["63A",""],//8 199k
        ["6423A",""],//8 123k
        ["6423A_6429A",""],//8 240k
        ["6423_6429A",""],//8 245k
        ["6429",""],//8 113k
        ["6429A",""],//8 102k
        ["643",""],//8 118k
        ["6430A",""],//8 119k
        ["6430_6431_6432_6433_6439",""],
        ["6431A",""],//8 112k
        ["6432A",""],//8 143k
        ["6433A",""],//8 130k
        ["6439A",""],//8 149k
        ["65series",""],//8 327k
        ["6602B",""],//8 67k
        ["6618A",""],//8 62k
        ["66A",""],//8 50k
        ["66B",""],//8 59k
        ["6730A",""],//9 487k
        ["6922A",""],//9 120k
        ["6922A_6923A",""],//9 222k
        ["6923A",""],//9 125k
        ["6F22A_6F29A",""],//9 160k
        ["6F24A",""],//9 131k
        ["6F25A_6F26A",""],//9 265k
        ["6M13A",""],//9 430k
        ["6M15A_6M91A",""],//9 278k
        ["6M23A",""],//9 139k
        ["6M25A",""],//9 432k
        ["6M26A",""],//9 404k
        ["7002A",""],//0 290k
        ["7005 & 7006 Calibers Repair Manual",""],
        ["7005A",""],//0 174k
        ["7005A_2",""],//0 316k
        ["7006A",""],//0 243k
        ["7009A",""],//0 183k
        ["7016A",""],//0 651k
        ["7018A",""],//0 130k
        ["7019A",""],//0 238k
        ["7025A",""],//0 85k
        ["7122A",""],//0 160k
        ["7123A",""],//1 746k
        ["7126A",""],//1 503k
        ["7223A",""],//1 669k
        ["7320A",""],//1 68k
        ["7320A_7321A",""],//1 205k
        ["7430A",""],//1 109k
        ["7430A_7431A_7439A",""],//1 247k
        ["7431A",""],//1 106k
        ["7432A",""],//1 123k
        ["7433A",""],//1 142k
        ["7434A",""],//1 139k
        ["7439A",""],//1 111k
        ["7518A",""],//1 113k
        ["7518A_7918A",""],//1 297k
        ["7545A",""],//2 115k
        ["7546A",""],//2 997k
        ["7548A",""],//2 98k
        ["7548A_7549A",""],//2 1.1M
        ["7549A",""],//2 94k
        ["7559A",""],//2 340k
        ["7750A",""],//2 134k
        ["7750A_51A_52A_59A",""],//2 287k
        ["7752A",""],//2 158k
        ["7759A",""],//2 146k
        ["7810A",""],//2 74k
        ["7812A",""],//2 112k
        ["7813A",""],//3 1.1M
        ["78A",""],//3 85k
        ["7903A",""],//3 570k
        ["7918A",""],//3 113k
        ["7A07A",""],//3 405k
        ["7A28A",""],//3 524k
        ["7A38A",""],//3 380k
        ["7A48A",""],//3 270k
        ["7C17A",""],//3 176k
        ["7C43A_7C46A",""],//4 226k
        ["7F18A",""],//4 124k
        ["7F32A",""],//4 123k
        ["7F38A_39A_68A_69A",""],//4 281k
        ["7G21A",""],//4 97k
        ["7K52A",""],//4 568k
        ["7M22A",""],//4 249k
        ["7M_Series",""],//4 55k
        ["7N00A_7N01A",""],//4 215k
        ["7N00C_01C_21C",""],//4 233k
        ["7N07A",""],//4 200k
        ["7N07C_7N08C",""],//4 206k
        //["7N22A_29A_33A_42A_43..&gt; 4 257k
        ["7N22C_7N29C",""],//4 208k
        ["7N32C_33C_39C",""],//4 225k
        ["7N35C_7N36C",""],//4 211k
        ["7N42C_7N43C",""],//5 203k
        ["7N82A_83A_89A",""],//5 259k
        ["7N82C_83C_85C_89C",""],//5 256k
        ["7S26A_7S36A",""],//5 181k
        ["7T24A_34A_36A_44A",""],//5 647k
        ["7T32A",""],//5 462k
        ["7T32B_7T42B",""],//5 504k
        ["7T39B",""],//6 436k
        ["7T42A",""],//5 211k
        ["7T52B_7T59B",""],//6 573k
        ["7T62A_7T92A",""],//7 3.2M
        //["7s2x Complete Break ..&gt; 5 812k
        ["8122A",""],//6 128k
        ["8122A_8123A",""],//6 215k
        ["8123A",""],//6 141k
        ["8222A",""],//6 114k
        ["8222A_8223A_8229A",""],//6 264k
        ["8223A",""],//6 117k
        ["8229A",""],//7 108k
        ["8420A",""],//7 288k
        ["8420B",""],//7 129k
        ["8522A",""],//7 124k
        ["8522A_8523A",""],//7 276k
        ["8523A",""],//7 131k
        ["8620A",""],//7 93k
        ["8620A_8621A",""],//7 235k
        ["8621A",""],//7 95k
        ["8800C",""],//7 134k
        ["8800D",""],//7 125k
        ["8800F",""],//7 124k
    ];


    var Bidfun = [
        ["1100A", ""],
        ["11A", ""],
        ["2202A", ""],
        ["2205A", ""],
        ["2206A", ""],
        ["2220A", ""],
        ["2501A", ""],
        ["2501B", ""],
        ["2505A", ""],
        ["2505B", ""],
        ["2517A", ""],
        ["2517B", ""],
        ["3702B", ""],
        ["3703B", ""],
        ["4005A", ""],
        ["4006A", ""],
        ["4205A", ""],
        ["4205B", ""],
        ["4206A", ""],
        ["4206B", ""],
        ["4207B", ""],
        ["436", ""],
        ["4361", ""],
        ["4M21A", ""],
        ["5601A", ""],
        ["5605A", ""],
        ["5606A", ""],
        ["5619A", ""],
        ["5621A", ""],
        ["5621", ""],
        ["5625A", ""],
        ["5625B", ""],
        ["5626A", ""],
        ["5626B", ""],
        ["5641A", ""],
        ["5645A", ""],
        ["5646A", ""],
        ["5M42A", ""],
        ["5M43A", ""],
        ["6105A", ""],
        ["6105B", ""],
        ["6106A", ""],
        ["6106B", ""],
        ["6106C", ""],
        ["6117A", ""],
        ["6117B", ""],
        ["6118A", ""],
        ["6119A", ""],
        ["6119B", ""],
        ["6119C", ""],
        ["6138A", ""],
        ["6138B", ""],
        ["6139A", ""],
        ["6139B", ""],
        ["6206B", ""],
        ["6308A", ""],
        ["6309A", ""],
        ["6310A", ""],
        ["6319A", ""],
        ["6347A", ""],
        ["6349A", ""],
        ["63A", ""],
        ["6601A", ""],
        ["6601B", ""],
        ["6602B", ""],
        ["6606B", ""],
        ["6619A", ""],
        ["66A", ""],
        ["66B", ""],
        ["7001A", ""],
        ["7002A", ""],
        ["7005A", ""],
        ["7006A", ""],
        ["7009A", ""],
        ["7015A", ""],
        ["7016A", ""],
        ["7017A", ""],
        ["7018A", ""],
        ["7018B", ""],
        ["7019A", ""],
        ["7039A", ""],
        ["7625", ""],
        ["7S26A", ""],
        ["7S26B", ""],
        ["7S36A", ""]
    ];

    //Seikomatic Archive
    var SeikoMovement2SeikomaticArchive = [
        ["51series\\5106\\51mw.html", "5106"],
        ["51series\\5146\\51pmw.html", "5146"],
        ["56series\\56lm.html", "5601,5605,5606"],
        ["62series\\3946205\\3946205.html", "394,6205"],
        ["62series\\3956219\\3956219.html", "395,6219"],
        ["62series\\4006206\\4006206.html", "400,6206"],
        ["62series\\4006206\\6206ab.html", "6206"],
        ["62series\\6036201\\6036201.html", "603,6201"],
        ["62series\\6036201wr\\6036201wr.html", "603,6201"],
        ["62series\\6216\\6216.html", "6216"],
        ["62series\\6218\\6218.html", "6218"],
        ["62series\\62cm\\62cm.html", "6245,6246"],
        ["62series\\62gs\\62gs.html", "6245,6246"],
        ["83series\\830\\83mam.html", "830"],
        ["83series\\83mc\\83mc.html", "8305C"],
        ["83series\\83mc\\83mc39j.html", "8325A"],
        ["83series\\83mw\\83mw.html", "8306,8346"],
        ["83series\\840\\83mamd.html", "840,8305B"],
    ];


    //Adventures in Amateur Watch Fettling
    var SeikoMovement2AAWF = [
        ["0703", "0703"],
        ["2205", "2205"],
        ["2625", "2625"],
        ["3702a", "3702a"],
        ["37a", "37a"],
        ["3823", "3823"],
        ["395", "395"],
        ["4006", "4006"],
        ["4420", "4420"],
        ["4502", "4502"],
        ["4822", "4822"],
        ["4r36", "4r36"],
        ["5106", series51__],
        ["5245", series52__],
        ["5606", series560_],
        ["5626", series562_],
        ["5719", "5719"],
        ["5722", "5722"],
        ["5740", "5740"],
        ["603", "603"],
        ["6105", "6105"],
        ["6106", "6106"],
        ["6117", "6117"],
        ["6119", "6119"],
        ["6138", "6138"],
        ["6139", "6139"],
        ["6145", "6145"],
        ["6146", "6146"],
        ["6205", "6205"],
        ["6206", "6206"],
        ["6216", "6216"],
        ["6217", "6217"],
        ["6218", "6218"],
        ["6245", "6245"],
        ["6306", "6306"],
        ["6309", "6309"],
        ["6319", "6319"],
        ["6601", "6601"],
        ["6619", "6619"],
        ["7018", "7018"],
        ["7548", "7548"],
        ["7549", "7549"],
        ["7606", "7606"],
        ["7s26", "7s26"],
        ["7s36", "7s36"],
        ["8305", "8305"],
        ["8346", "8346"],
        ["9f82", "9f82"],
    ];


    var SeikoMovement2WatchWiki = [
        ["Seiko_5700", "3180/5720A 57A 57B 5760 430/5722A 5722B 5740A 5740B 5740C 5717A 5718A 5719A "],
        ["Seiko_4400", "4420A 4420B"],
        ["Seiko_4500", "4500 4502 4520A 4522A  4580 4520A "],
        ["Seiko_6800", "6800 6810 6830	6870, 6890	6899 6898"],
        ["Seiko_6600", "436/4361/66A 66B 957/6602B 6618A 6640A 6642A 6659A 6660A 6601A 6601B 410?/6606B 6619A 245/2451 790 6605  660"],
        //["Seiko_6300", "6308A,6309A,6319"], //contains minimal data which is inaccurate. https://www.watch-wiki.net/index.php?title=Seiko_6300
        ["Seiko_6100", "61A 6102A 6110A 6105A	6105B	6106A, 6106B, 6106C	6109A 6117A	6117B 6118A	6119A, 6119B, 6119C	6145A 6146A	6155A	6156A	6159A	6159B	6185A	6185B	6186A"],
        ["Seiko_6139", "6138A, 6138B 6139A, 6139B"],
        ["Seiko_7000", "7005A	7006A	7025A	7015A, 7017A	7016A	7018A, 7018B	7009A	7019A, 7039A	7001A	7002A"],
        ["Seiko_5200", "5206A, 5216A	5245A	5246A	5256A"],
        ["Seiko_5600", "5601A 5605A 5606A	5619A	5621A, 5621B 5625A, 5625B	5626A, 5626B 5641A 5645A 5646A"],
        ["Seiko_5100", "5106A 5126A	 5139A	 5146A"],
    ];


    var SeikoMovement2SeikoMainspring = [
        ["401001", "7605 7606 7619 7625 7625 7625 7625E 820 Sportmatic 5 Deluxe"],
        ["401013", "5126 5139"],
        ["401014", "5106"],
        ["401022", "2559"],
        ["401030", "2501 2501 2501 2505 2505 2516 2517 2517 2565"],
        ["401040", "1004 1004 1004 1004 1004M"],
        ["401100", "10 10 10 10M 1020 1020 1020 1040 Seiko Solar"],
        ["401110", "1104 17j"],
        ["401111", "1104 21j 1144"],
        ["401113", "11 1140"],
        ["401115", "1120"],
        //["401120 :"],
        ["401150", "15 1520 1520 , Fine Seiko , Lady Seiko"],
        ["401172", "17"],
        ["401180", "18 18 18M Seiko Universe"],
        ["401190", "19 1920 Seiko Venus"],
        ["401191", "1904"],
        ["401192", "1944 1944 1944 1964 Grand Seiko Lady"],
        ["401200", "Seiko Fashion"],
        ["401210", "21 21 21 2102 2102 2140 2160 Seiko Sportslady , Queen Seiko"],
        ["401230", "2104 2104 2107 2107 2117 2118 2119 2119 Seiko Chorus"],
        ["401250", "2502 2515 2518 2518 2519 2519"],
        ["401253", "2539"],
        ["401270", "Seikomatic Lady"],
        ["401280", "Seiko Birdie , Birdie Special"],
        ["401431", "5740 Lord Marvel"],
        ["401441", "4402 44KS King Seiko"],
        ["401460", "460"],
        ["401470", "6215 6216 6245 6246 62GS"],
        ["401525", "61 6102"],
        ["401540", "54 Seiko Champion , Seiko Cronos"],
        ["401560", "5601 5605 5606 Lord Matic"],
        ["401565", "5621 5625 5626 5641 5645 5646 GS KS"],
        ["401581", "2706"],
        ["401600", "60M Seiko Goldfeather"],
        ["401610", "394 395 400 603 6201 6205 6206 6217 6218 6218 6218 62MS"],
        ["401620", "3140 402 6220 6220 6220 6220M 6222 6222 6222 6222M 956"],
        ["401640", "First Grand Seiko 3180"],
        ["401660", "205 375 436 4361 66 66 6602 6640 6642 6659 6660 957"],
        ["401680", "44 4420 4420 810 44GS KING SEIKO"],
        ["401690", "245 2451 410 6601 6601 6606 6619 790"],
        ["401760", "760 761 7622 7622 7622 850 851 860"],
        ["401805", "Seiko Bell-matic 4005 4006"],
        ["401830", "830 8305 8305 8306 8325 8346 840"],
        ["401901", "9011 9011 9011 9011"],
        ["401905", "8800F 9011E 9011F"],
        ["401913", "9119"]
    ];

    var SeikoMovement2GR_Mainspring = [
        ["2378-X", " 4005 4006 8305 8306 "],
        ["3298-1", " 4402 "],
        ["3312-1", " 4420 "],
        ["2379-X", " 5106 5126"],
        ["2457-1 X", " 5606 "],
        ["2534-X", " 6105 6106 6306 6309 6117 6119 6138 6139 "],
        ["2537-X", " 6146A"],
        ["2533-X", " 6201 6205 6206 6215 6216 6217 6245 6246 "],
        ["2377-X", " 7002 7005 7006 7009 7015 7016 7017 7019"]
    ];





    var SeikoModelDB = {};

    SeikoModelDB.m7619= [
        ["7619-7010", {cry:"340W06AN"}],
        ["7619-7030", {cry:"340W06AN"}],
        ["7619-7020", {cry:"340W06AN"}],
        ["7619-7070", {cry:"340W06AN"}],
        ["7619-9030", {cry:"325W06AN"}],
        ["7619-7060", {cry:"340W06AN"}],
        ["7619-7050", {cry:"340W06AN"}],
        ["7619-7040", {cry:"340W06AN"}],
        ["7619-7000", {cry:"340W06AN"}],
        ["7619-9070", {cry:"320T03AN"}],
    ];

	SeikoModelDB.m0822= [
		["0822-7000", {cry:"280G11GN"}],
		["0822-8000", {cry:"290N07GN"}],
		["0822-8020", {cry:"310T37AN"}],
		["0822-0010", {cry:"325N03AN"}],
		["0822-5020", {cry:"ES1N03GN"}],
	];
	SeikoModelDB.m0823= [
		["0823-7000", {cry:"280G11GN"}],
		["0823-8000", {cry:"290N07GN"}],
		["0823-8010", {cry:"290N07GN"}],
		["0823-6000", {cry:"290T05AN"}],
		["0823-5000", {cry:"ES1N03GN"}],
		["0823-5020", {cry:"SA2N61GN"}],
	];
	SeikoModelDB.m0841= [
		["0841-8050", {cry:"300W76GN"}],
	];
	SeikoModelDB.m0842= [
		["0842-5010", {cry:"290N13GN,ES1N03GN"}],
		["0842-8000", {cry:"300W76GN"}],
		["0842-8050", {cry:"300W76GN"}],
		["0842-8070", {cry:"300W76GN"}],
	];
	SeikoModelDB.m0843= [
		["0843-8020", {cry:"290G11GN"}],
		["0843-8040", {cry:"300W76GN"}],
		["0843-8050", {cry:"300W76GN"}],
		["0843-8060", {cry:"300W76GN"}],
		["0843-8070", {cry:"300W76GN"}],
		["0843-8080", {cry:"300W76GN"}],
		["0843-8030", {cry:"300W80GC"}],
		["0843-5020", {cry:"BA0W27AN"}],
		["0843-5030", {cry:"ES0G01GN"}],
		["0843-5010", {cry:"ES1N03GN"}],
		["0843-5050", {cry:"ES1N03GN"}],
		["0843-5000", {cry:"SA0W25AN"}],
		["0843-5040", {cry:"SA2N61GN"}],
	];
	SeikoModelDB.m0852= [
		["0852-8000", {cry:"300W59GA"}],
		["0852-8020", {cry:"300W59GA"}],
	];
	SeikoModelDB.m0853= [
		["0853-8000", {cry:"300W59GA"}],
		["0853-8020", {cry:"300W59GA"}],
		["0853-8030", {cry:"300W59GA"}],
		["0853-8040", {cry:"300W59GA"}],
	];
	SeikoModelDB.m0903= [
		["0903-8000", {cry:"290W08GN"}],
		["0903-7000", {cry:"300T20AN"}],
		["0903-7030", {cry:"300T20AN"}],
		["0903-8030", {cry:"300W72GC"}],
		["0903-6000", {cry:"300W76GN"}],
		["0903-8010", {cry:"300W76GN"}],
		["0903-8040", {cry:"300W76GN"}],
		["0903-8060", {cry:"300W76GN"}],
		["0903-8080", {cry:"300W76GN"}],
		["0903-8090", {cry:"300W76GN"}],
		["0903-8100", {cry:"300W76GN"}],
		["0903-8130", {cry:"300W76GN"}],
		["0903-8150", {cry:"300W76GN"}],
		["0903-8750", {cry:"300W76GN"}],
		["0903-8140", {cry:"300W80GC"}],
		["0903-8020", {cry:"300W82GN"}],
		["0903-8110", {cry:"300W98GN"}],
		["0903-8120", {cry:"300W98GN"}],
		["0903-8050", {cry:"310T18AN"}],
		["0903-8160", {cry:"310T36GN"}],
		["0903-8070", {cry:"310T42AC"}],
		["0903-7029", {cry:"310W28GN"}],
		["0903-7019", {cry:"310W28GN"}],
		["0903-7010", {cry:"310W28GN"}],
		["0903-7020", {cry:"310W28GN"}],
		["0903-5020", {cry:"340W18GN"}],
		["0903-5000", {cry:"ES0W14AN"}],
		["0903-5040", {cry:"ES0W24GN"}],
		["0903-5050", {cry:"K00W48AN"}],
		["0903-5010", {cry:"SA0W40AN"}],
		["0903-5030", {cry:"SA0W54AN"}],
	];
	SeikoModelDB.m0920= [
		["0920-8000", {cry:"300W76GN"}],
		["0920-8010", {cry:"300W76GN"}],
	];
	SeikoModelDB.m0922= [
		["0922-8060", {cry:"300W75GN"}],
		["0922-8000", {cry:"300W76GN"}],
		["0922-8010", {cry:"300W76GN"}],
		["0922-8050", {cry:"310W34GN"}],
		["0922-5010", {cry:"SA0W44AN"}],
	];
	SeikoModelDB.m0923= [
		["0923-8000", {cry:"300W76GN"}],
		["0923-8010", {cry:"300W76GN"}],
		["0923-8060", {cry:"300W76GN"}],
		["0923-8020", {cry:"300W80GC"}],
		["0923-8030", {cry:"300W82GN"}],
		["0923-8040", {cry:"300W86GC"}],
		["0923-8050", {cry:"310W34GN"}],
		["0923-7000", {cry:"310W40GA"}],
		["0923-7010", {cry:"310W40GA"}],
		["0923-5010", {cry:"SA0W44AN"}],
		["0923-5000", {cry:"SA1N14GN"}],
	];
	SeikoModelDB.m1320= [
		["1320-5101", {cry:"BA1N59KN"}],
		["1320-5109", {cry:"BA1N59KN"}],
		["1320-5280", {cry:"BA1N59KN"}],
		["1320-5100", {cry:"BA1N59KN"}],
		["1320-5250", {cry:"BA1N65KN"}],
	];
	SeikoModelDB.m1N00= [
		["1N00-5K00", {cry:"ESJN00JM01"}],
		["1N00-5K10", {cry:"ESJN00JM01"}],
	];
	SeikoModelDB.m2633= [
		["2633-5020", {cry:"BA1N47KN"}],
	];
	SeikoModelDB.m2A32= [
		["2A32-5050", {cry:"SADN81JE10"}],
	];
	SeikoModelDB.m2C20= [
		["2C20-0280", {cry:"190P05HN03"}],
	];
	SeikoModelDB.m2E20= [
		["2E20-7023", {cry:"BA1A31JN02"}],
		["2E20-7021", {cry:"BA1A31JN02"}],
	];
	SeikoModelDB.m2K01= [
		["2K01-0010", {cry:"280A03JN02"}],
		["2K01-0090", {cry:"280A03JN02"}],
	];
	SeikoModelDB.m2P20= [
		["2P20-0090", {cry:"190P05HN03"}],
		["2P20-0210", {cry:"190P05HN03"}],
		["2P20-0220", {cry:"190P05HN03"}],
		["2P20-0230", {cry:"190P05HN03"}],
		["2P20-5J90", {cry:"ESJN00JM01"}],
		["2P20-5K00", {cry:"ESJN00JM01"}],
	];
	SeikoModelDB.m2P21= [
		["2P21-0160", {cry:"190P05HN03"}],
		["2P21-0170", {cry:"190P05HN03"}],
	];
	SeikoModelDB.m2Y00= [
		["2Y00-5G10", {cry:"ESJN00JM01"}],
		["2Y00-5G20", {cry:"ESJN00JM01"}],
	];
	SeikoModelDB.m3303= [
		["3303-8080", {cry:"300V09GN"}],
		["3303-8110", {cry:"300V09GN"}],
		["3303-8120", {cry:"300V09GN"}],
		["3303-8070", {cry:"310T29AN"}],
	];
	SeikoModelDB.m3421= [
		["3421-0070", {cry:"180N10GN"}],
		["3421-0050", {cry:"190N20GN"}],
		["3421-0010", {cry:"190W04GN"}],
		["3421-0040", {cry:"190W04GN"}],
		["3421-0020", {cry:"190W08GC"}],
		["3421-0090", {cry:"200N08GN"}],
		["3421-0030", {cry:"200W16GA"}],
		["3421-0080", {cry:"280N10GN"}],
		["3421-0060", {cry:"290N06GN"}],
		["3421-5170", {cry:"BA0N88GN"}],
		["3421-5140", {cry:"ES1N98GN"}],
		["3421-5130", {cry:"ES1W22GA"}],
		["3421-5300", {cry:"ES3N94GN"}],
		["3421-5010", {cry:"K00N92GN"}],
		["3421-5070", {cry:"K00W54GN"}],
		["3421-5080", {cry:"K00W54GN"}],
		["3421-5150", {cry:"K01N12GN"}],
		["3421-5180", {cry:"K01N20GN"}],
		["3421-5190", {cry:"K01N24GN"}],
		["3421-5290", {cry:"K01N24GN"}],
		["3421-5210", {cry:"RE2N02GN"}],
		["3421-5220", {cry:"SA1N94GN"}],
		["3421-5000", {cry:"SA1W46GN,SA3N10GN"}],
		["3421-5260", {cry:"SA2N20GN"}],
		["3421-5030", {cry:"SA2W52GN,SA3N78GN"}],
		["3421-5020", {cry:"SA3N08GN"}],
		["3421-5050", {cry:"SA3N08GN"}],
		["3421-5040", {cry:"SA3N34GN"}],
		["3421-5090", {cry:"SA3N80GN"}],
		["3421-5100", {cry:"SA3N88GN"}],
		["3421-5110", {cry:"SA3N96GN"}],
		["3421-5120", {cry:"SA3N88GN"}],
		["3421-5160", {cry:"SA4N60GN"}],
	];
	SeikoModelDB.m3422= [
		["3422-0010", {cry:"190W04GN"}],
		["3422-0020", {cry:"190W04GN"}],
		["3422-0030", {cry:"190W04GN"}],
		["3422-0040", {cry:"190W04GN"}],
		["3422-5000", {cry:"SA3N34GN"}],
		["3422-5020", {cry:"SA3N36GN"}],
	];
	SeikoModelDB.m3423= [
		["3423-0010", {cry:"190W04GN"}],
		["3423-0020", {cry:"190W04GN"}],
		["3423-0050", {cry:"190W04GN"}],
		["3423-0060", {cry:"190W04GN,190W06GN"}],
		["3423-0100", {cry:"190W04GN"}],
		["3423-0030", {cry:"200N08GN"}],
		["3423-0070", {cry:"200W16GA"}],
		["3423-0080", {cry:"200W16GA"}],
		["3423-0120", {cry:"200W16GA"}],
		["3423-0040", {cry:"210T04AN"}],
		["3423-5060", {cry:"ES1N54GN"}],
		["3423-5070", {cry:"ES1N70GN"}],
		["3423-5110", {cry:"ES1W86GN"}],
		["3423-5040", {cry:"K01N02GN"}],
		["3423-5020", {cry:"SA1W82GN"}],
		["3423-5030", {cry:"SA1W82GN"}],
		["3423-5050", {cry:"SA1W86GA"}],
		["3423-5090", {cry:"SA2W38GN"}],
		["3423-5120", {cry:"SA2W98GN"}],
		["3423-5080", {cry:"SA4N18GN"}],
	];
	SeikoModelDB.m3700= [
		["3700-7000", {cry:"300T12AN"}],
		["3700-8000", {cry:"310T16AN"}],
	];
	SeikoModelDB.m3702= [
		["3702-7000", {cry:"300T12AN"}],
		["3702-7010", {cry:"300T12AN"}],
		["3702-8000", {cry:"310T16AN"}],
		["3702-0010", {cry:"317N02AN"}],
	];
	SeikoModelDB.m3703= [
		["3703-7000", {cry:"300T30AN"}],
		["3703-7020", {cry:"300T30AN"}],
		["3703-7030", {cry:"300T30AN"}],
		["3703-7040", {cry:"300T30AN"}],
		["3703-8000", {cry:"310T24AN"}],
		["3703-8010", {cry:"310V10AN"}],
		["3703-8020", {cry:"310V14GN"}],
		["3703-8040", {cry:"310V14GN"}],
		["3703-8030", {cry:"310V18GC"}],
	];
	SeikoModelDB.m3800= [
		["3800-7030", {cry:"300V16GN"}],
		["3800-3000", {cry:"353N06AN"}],
	];
	SeikoModelDB.m3802= [
		["3802-7000", {cry:"295V08GN"}],
		["3802-7010", {cry:"300T12AN"}],
		["3802-7020", {cry:"300V16GN"}],
		["3802-7030", {cry:"300V16GN"}],
		["3802-7070", {cry:"300V16GN"}],
		["3802-7060", {cry:"300V66GC"}],
		["3802-7110", {cry:"300W60GN"}],
	];
	SeikoModelDB.m3803= [
		["3803-7000", {cry:"295V08GN"}],
		["3803-7010", {cry:"300T12AN"}],
		["3803-7040", {cry:"300T12AN"}],
		["3803-7050", {cry:"300T12AN,300V16GN"}],
		["3803-7070", {cry:"300T12AN"}],
		["3803-7020", {cry:"300V16GN"}],
		["3803-7030", {cry:"300V16GN"}],
		["3803-7090", {cry:"300V16GN"}],
		["3803-7060", {cry:"300V66GC"}],
		["3803-7100", {cry:"300V66GC"}],
		["3803-7080", {cry:"300V88GC"}],
		["3803-7110", {cry:"300W60GN"}],
		["3803-8000", {cry:"300W76GN"}],
		["3803-5000", {cry:"ES0W10AN"}],
		["3803-5010", {cry:"SA0W32AN"}],
	];
	SeikoModelDB.m3819= [
		["3819-7000", {cry:"300V90GN"}],
	];
	SeikoModelDB.m3823= [
		["3823-7000", {cry:"300V42GA"}],
		["3823-7040", {cry:"300V42GA"}],
		["3823-7010", {cry:"300V44GA"}],
	];
	SeikoModelDB.m3862= [
		["3862-7020", {cry:"300T12AN"}],
		["3862-7000", {cry:"300V16GN,300V82GN"}],
		["3862-7010", {cry:"300V16GN"}],
		["3862-8000", {cry:"300W64GC"}],
		["3862-8010", {cry:"300W74GC"}],
		["3862-8020", {cry:"300W76GN"}],
		["3862-5010", {cry:"K00W38AN"}],
	];
	SeikoModelDB.m3863= [
		["3863-7030", {cry:"300T20AN"}],
		["3863-7040", {cry:"300T20AN"}],
		["3863-7000", {cry:"300V16GN,300V42GA"}],
		["3863-7010", {cry:"300V16GN"}],
		["3863-7050", {cry:"300V62GC"}],
		["3863-7020", {cry:"300V98GC"}],
		["3863-8000", {cry:"300W64GC"}],
		["3863-8010", {cry:"300W74GC"}],
		["3863-8020", {cry:"300W76GN"}],
		["3863-5010", {cry:"K00W38AN"}],
		["3863-5000", {cry:"SA0W28AN"}],
	];
	SeikoModelDB.m3883= [
		["3883-7010", {cry:"300T20AN"}],
	];
	SeikoModelDB.m3922= [
		["3922-5040", {cry:"ES0V15GM"}],
		["3922-5010", {cry:"RE0V11GN"}],
	];
	SeikoModelDB.m3923= [
		["3923-502A", {cry:"ES0V15GM0"}],
		["3923-5020", {cry:"ES0V15GM02"}],
		["3923-5000", {cry:"RE0V11GE"}],
		["3923-5010", {cry:"RE0V13GN"}],
	];
	SeikoModelDB.m4006= [
		["4006-7010", {cry:"325T02ANS"}],
		["4006-6000", {cry:"325T02ANS"}],
		["4006-6010", {cry:"325T02ANS"}],
		["4006-6020", {cry:"325T02ANS"}],
		["4006-6030", {cry:"325T02ANS"}],
		["4006-6040", {cry:"325T02ANS"}],
		["4006-6050", {cry:"325T02ANS"}],
		["4006-6060", {cry:"325T02ANS"}],
		["4006-6070", {cry:"325T02ANS"}],
		["4006-6080", {cry:"325T02ANS"}],
		["4006-7000", {cry:"325T02ANS"}],
		["4006-7020", {cry:"325T02ANS"}],
	];
	SeikoModelDB.m4206= [
		["4206-0511", {cry:"190P05HN03"}],
		["4206-0519", {cry:"190P05HN03"}],
	];
	SeikoModelDB.m4207= [
		["4207-0041", {cry:"190P05HN03"}],
	];
	SeikoModelDB.m4622= [
		["4622-8000", {cry:"295W11GN"}],
	];
	SeikoModelDB.m4623= [
		["4623-8010", {cry:"295W11GN"}],
		["4623-8020", {cry:"295W11GN"}],
		["4623-8030", {cry:"295W11GN"}],
		["4623-8040", {cry:"295W11GN"}],
		["4623-8000", {cry:"295W15GC"}],
		["4623-6000", {cry:"313W01AA"}],
		["4623-9000", {cry:"320T25AA"}],
		["4623-5000", {cry:"SA1W15AA"}],
	];
	SeikoModelDB.m4633= [
		["4633-8000", {cry:"295W11GN"}],
		["4633-8010", {cry:"295W11GN"}],
		["4633-8020", {cry:"295W11GN"}],
		["4633-8070", {cry:"295W11GN"}],
		["4633-8030", {cry:"310W17GN"}],
		["4633-8050", {cry:"310W17GN"}],
		["4633-8060", {cry:"310W17GN"}],
		["4633-8040", {cry:"310W19GN"}],
		["4633-6010", {cry:"313W01AA"}],
		["4633-8080", {cry:"313W01AA"}],
		["4633-9000", {cry:"330W25GN"}],
		["4633-6000", {cry:"330W33GN"}],
		["4633-5010", {cry:"SA0G07GN"}],
		["4633-5000", {cry:"SA0W85AA"}],
		["4633-5020", {cry:"SA1W27GN"}],
	];
	SeikoModelDB.m4803= [
		["4803-8010", {cry:"300W76GN"}],
		["4803-8000", {cry:"300W98GN"}],
		["4803-5000", {cry:"SA0W60GC"}],
	];
	SeikoModelDB.m4821= [
		["4821-8000", {cry:"300W88GA,300WA4GA"}],
	];
	SeikoModelDB.m4822= [
		["4822-8000", {cry:"300W88GA"}],
		["4822-8010", {cry:"300W88GA,300WB0GN"}],
		["4822-8110", {cry:"300W88GA"}],
		["4822-8120", {cry:"300W88GA"}],
	];
	SeikoModelDB.m4823= [
		["4823-8020", {cry:"300W76GN"}],
		["4823-8040", {cry:"300W76GN"}],
		["4823-8030", {cry:"300W80GC"}],
		["4823-8000", {cry:"300WA4GA"}],
		["4823-8010", {cry:"300WA4GA"}],
		["4823-8050", {cry:"300WA4GA"}],
		["4823-8100", {cry:"300WA4GA"}],
		["4823-8110", {cry:"300WA4GA"}],
		["4823-8120", {cry:"300WA4GA"}],
		["4823-8130", {cry:"300WA4GA"}],
		["4823-5000", {cry:"310W36GA"}],
	];
	SeikoModelDB.m4826= [
		["4826-9000", {cry:"310W44GN"}],
	];
	SeikoModelDB.m4840= [
		["4840-8110", {cry:"300W88GA"}],
		["4840-8040", {cry:"310W36GA"}],
	];
	SeikoModelDB.m4842= [
		["4842-8110", {cry:"300WA4GA"}],
		["4842-8040", {cry:"310W36GA"}],
		["4842-5010", {cry:"SA0W46GN"}],
		["4842-5100", {cry:"SA0W46GN"}],
	];
	SeikoModelDB.m4843= [
		["4843-7000", {cry:"300W88GA"}],
		["4843-8050", {cry:"300WA0SA"}],
		["4843-8100", {cry:"300WA0SA"}],
		["4843-8110", {cry:"300WA4GA"}],
		["4843-8040", {cry:"310W36GA"}],
		["4843-5010", {cry:"SA0W46GN"}],
		["4843-5100", {cry:"SA0W46GN"}],
	];
	SeikoModelDB.m4S15= [
		["4S15-8030", {cry:"300P01LN03"}],
	];
	SeikoModelDB.m5106= [
		["5106-7020", {cry:"300T03AN"}],
		["5106-7050", {cry:"300V05GNG"}],
		["5106-7030", {cry:"300V07GN"}],
		["5106-7000", {cry:"310W07AN"}],
		["5106-8010", {cry:"320W08AN"}],
		["5106-8030", {cry:"320W08AN"}],
		["5106-8020", {cry:"320W15GN"}],
	];
	SeikoModelDB.m5126= [
		["5126-7000", {cry:"300T01AN"}],
		["5126-7010", {cry:"310W07AN"}],
		["5126-7020", {cry:"310W11GN"}],
		["5126-7030", {cry:"310W11GN"}],
		["5126-8010", {cry:"315T07AN"}],
		["5126-8030", {cry:"315T11AN"}],
		["5126-8040", {cry:"315T11AN"}],
		["5126-8050", {cry:"315T11AN"}],
		["5126-8060", {cry:"315T11AN"}],
		["5126-8070", {cry:"315T11AN"}],
		["5126-8110", {cry:"315T11AN"}],
		["5126-6000", {cry:"320W08AN"}],
		["5126-8000", {cry:"320W08AN"}],
		["5126-8020", {cry:"320W08AN"}],
		["5126-6030", {cry:"320W10GN"}],
		["5126-8080", {cry:"320W10GN"}],
		["5126-8090", {cry:"320W10GN"}],
		["5126-8100", {cry:"320W10GN"}],
		["5126-8120", {cry:"320W10GN"}],
		["5126-8130", {cry:"320W10GN"}],
		["5126-6010", {cry:"330W16GN"}],
	];
	SeikoModelDB.m5139= [
		["5139-7000", {cry:"300T01AN"}],
		["5139-7040", {cry:"300T01AN"}],
		["5139-7010", {cry:"300T03AN"}],
		["5139-7020", {cry:"300T03AN"}],
		["5139-7030", {cry:"300T03AN"}],
		["5139-7050", {cry:"300T09AN"}],
		["5139-7060", {cry:"300T11AN"}],
		["5139-8000", {cry:"315T11AN"}],
		["5139-6000", {cry:"315T15AN"}],
	];
	SeikoModelDB.m5146= [
		["5146-7050", {cry:"290W03GN"}],
		["5146-7000", {cry:"300T01AN"}],
		["5146-7010", {cry:"300T01AN"}],
		["5146-7090", {cry:"300T03AN"}],
		["5146-7060", {cry:"300T21AN"}],
		["5146-7040", {cry:"300V07GN"}],
		["5146-7080", {cry:"300V07GN"}],
		["5146-7020", {cry:"310W11GN"}],
		["5146-7030", {cry:"310W11GN"}],
		["5146-5000", {cry:"SA0W01AN,SA0W03AN"}],
		["5146-5010", {cry:"SA0W01AN,SA0W03AN"}],
		["5146-5020", {cry:"SA0W01AN,SA0W03AN"}],
	];
	SeikoModelDB.m5206= [
		["5206-6020", {cry:"285V03GN"}],
		["5206-6030", {cry:"285V03GN"}],
		["5206-6040", {cry:"285V03GN"}],
		["5206-6060", {cry:"285V03GN"}],
		["5206-6110", {cry:"285V03GN"}],
		["5206-6120", {cry:"285V03GN"}],
		["5206-6130", {cry:"285V03GN"}],
		["5206-6070", {cry:"285V07GN"}],
		["5206-6080", {cry:"285V08GN"}],
		["5206-6090", {cry:"285V09GC"}],
		["5206-6100", {cry:"285V15GC"}],
		["5206-6140", {cry:"285V27GN"}],
		["5206-6150", {cry:"285V35GN"}],
		["5206-6000", {cry:"290T01AN"}],
		["5206-6010", {cry:"290T01AN"}],
		["5206-6050", {cry:"290T01AN"}],
		["5206-5000", {cry:"BA0W05AL"}],
		["5206-5050", {cry:"BA0W13AN"}],
		["5206-5030", {cry:"ES0V01GN"}],
		["5206-5060", {cry:"ES0V05GN"}],
		["5206-5080", {cry:"ES0V09GC"}],
		["5206-5010", {cry:"K00V05GN"}],
		["5206-5040", {cry:"K00V05GN"}],
		["5206-5020", {cry:"SA0W03AN"}],
		["5206-5070", {cry:"SA0W57AN"}],
	];
	SeikoModelDB.m5216= [
		["5216-7030", {cry:"280G03GC"}],
		["5216-7020", {cry:"280G07GC"}],
		["5216-8010", {cry:"280G09GA"}],
		["5216-7100", {cry:"280G11GN"}],
		["5216-7040", {cry:"280G15GC"}],
		["5216-7060", {cry:"280G17GN"}],
		["5216-7050", {cry:"280G19GC"}],
		["5216-7090", {cry:"280G21GC"}],
		["5216-7070", {cry:"280G23GC"}],
		["5216-7110", {cry:"280G25GC"}],
		["5216-7080", {cry:"280G31GN"}],
		["5216-6060", {cry:"280W03GN"}],
		["5216-6040", {cry:"285V21GN"}],
		["5216-6050", {cry:"285V21GN"}],
		["5216-6000", {cry:"285V33GC"}],
		["5216-6020", {cry:"285V41GC"}],
		["5216-6010", {cry:"285V45GC"}],
		["5216-6030", {cry:"285V47GC"}],
		["5216-7000", {cry:"295V03GC"}],
		["5216-7010", {cry:"295V07GC"}],
        ["5216-8020", {cry:"300W76GN"}],
		["5216-8030", {cry:"300G01GA"}],
		["5216-8040", {cry:"300G03GA"}],
		["5216-5000", {cry:"SA0W65GC"}],
	];
	SeikoModelDB.m5245= [
		["5245-6000", {cry:"285V03GN"}],
		["5245-6010", {cry:"290T01AN"}],
		["5245-7000", {cry:"290V01GC"}],
	];
	SeikoModelDB.m5246= [
		["5246-6000", {cry:"285V03GN"}],
		["5246-6030", {cry:"285V11GC"}],
		["5246-6050", {cry:"285V19GC"}],
		["5246-6040", {cry:"285V23GC"}],
		["5246-6060", {cry:"285V25GC"}],
		["5246-6070", {cry:"285V29GC"}],
		["5246-6010", {cry:"290T01AN"}],
		["5246-6020", {cry:"290T01AN"}],
		["5246-7000", {cry:"290V01GC"}],
		["5246-5020", {cry:"ES0V07GC"}],
		["5246-5040", {cry:"ES0V11GC"}],
		["5246-5000", {cry:"K00V05GN"}],
		["5246-5030", {cry:"SA0W57AN"}],
	];
	SeikoModelDB.m5256= [
		["5256-6000", {cry:"285V49GC"}],
		["5256-6010", {cry:"285V51GC"}],
		["5256-8000", {cry:"290G05GAGO"}],
		["5256-8010", {cry:"290G05GAGO"}],
		["5256-5000", {cry:"ES0V13GC"}],
		["5256-5010", {cry:"ES0W23GC"}],
	];
	SeikoModelDB.m5601= [
		["5601-7000", {cry:"300T12AN"}],
		["5601-7010", {cry:"300T12AN"}],
		["5601-9000", {cry:"320T08AN"}],
	];
	SeikoModelDB.m5605= [
		["5605-5000", {cry:"BA0W02AN"}],
		["5605-5010", {cry:"K00W02A0"}],
		["5605-7020", {cry:"300T12AN"}],
		["5605-7030", {cry:"300T12AN"}],
		["5605-7050", {cry:"300V16GN"}],
	];
	SeikoModelDB.m5606= [
		["5606-5000", {cry:"BA0W02AN"}],
		["5606-5010", {cry:"SA0W02AN"}],
		["5606-5020", {cry:"SA0W02AN"}],
		["5606-5030", {cry:"RE0W04AN"}],
		["5606-5040", {cry:"SA0W16AN"}],
		["5606-5050", {cry:"K00V18GN"}],
		["5606-5060", {cry:"SA0W16AN"}],
		["5606-5070", {cry:"SA0W18AN"}],
		["5606-5080", {cry:"RE0V18GCS"}],
		["5606-5100", {cry:"K00W28AN"}],
		["5606-5110", {cry:"SQ0W02AN"}],
		["5606-5120", {cry:"SA0W26ACDZ"}],
		["5606-5130", {cry:"RE0W26AC0Z"}],
		["5606-5140", {cry:"SA0W24AN00"}],
		["5606-5150", {cry:"RE0W28AN"}],
		["5606-5160", {cry:"RE0W32AN"}],
		["5606-5170", {cry:"K00W42AC0G"}],
		["5606-5180", {cry:"BA0N28GN00"}],
		["5606-5190", {cry:"SA1N12GN"}],
		["5606-5200", {cry:"SA1N16AN"}],
		["5606-5210", {cry:"SQ0W06GN"}],
		["5606-5220", {cry:"BA0W34AN"}],
		["5606-5230", {cry:"SA0W46GN00"}],
		["5606-6000", {cry:"270V04GNS0"}],
		["5606-6010", {cry:"270V04GNS0"}],
		["5606-6020", {cry:"290T02ANS"}],
		["5606-6030", {cry:"290T02ANS"}],
		["5606-6040", {cry:"290V04GNS"}],
		["5606-6050", {cry:"290V04GNS"}],
		["5606-6060", {cry:"270V04GNS0"}],
		["5606-6070", {cry:"290T04ANS"}],
		["5606-7000", {cry:"300T12AN"}],
		["5606-7010", {cry:"300T12AN,300T20ANG"}],
		["5606-7020", {cry:"300T12AN,300T20ANS"}],
		["5606-7030", {cry:"300T12AN"}],
		["5606-7040", {cry:"300T12AN"}],
		["5606-7050", {cry:"300T12AN"}],
		["5606-7060", {cry:"300T12AN"}],
		["5606-7070", {cry:"300V04GNG0"}],
		["5606-7080", {cry:"300V04GNG0"}],
		["5606-7090", {cry:"320T08AN"}],
		["5606-7100", {cry:"300T12AN,300T20ANG"}],
		["5606-7110", {cry:"300T12AN"}],
		["5606-7120", {cry:"300T12AN"}],
		["5606-7130", {cry:"300T12AN,300T20ANS"}],
		["5606-7140", {cry:"300V04GNG0"}],
		["5606-7150", {cry:"300V16GN"}],
		["5606-7160", {cry:"300V16GN"}],
		["5606-7170", {cry:"300T12AN"}],
		["5606-7180", {cry:"300T12AN"}],
		["5606-7190", {cry:"300V16GN"}],
		["5606-7200", {cry:"300V26SES0"}],
		["5606-7210", {cry:"300T12ANS"}],
		["5606-7220", {cry:"300T12ANS"}],
		["5606-7230", {cry:"300V62GCSF"}],
		["5606-7240", {cry:"300V16GNS0"}],
		["5606-7250", {cry:"300V16GNS0"}],
		["5606-7260", {cry:"300V16GNS0"}],
		["5606-7270", {cry:"300V62GCSF"}],
		["5606-7280", {cry:"300V98GCSF"}],
		["5606-7290", {cry:"300V98GCSF"}],
		["5606-7300", {cry:"300VA2GCSF"}],
		["5606-7310", {cry:"300V62GCSF"}],
		["5606-7320", {cry:"300VB0GCSF"}],
		["5606-7330", {cry:"300W52GCS0F"}],
		["5606-7340", {cry:"300W52GC0F"}],
		["5606-7350", {cry:"300W70GC0F"}],
		["5606-7360", {cry:"290W10GC0F"}],
		["5606-7370", {cry:"290W12GN"}],
		["5606-8000", {cry:"300T16AN"}],
		["5606-8010", {cry:"310T16AN,310T48ANG"}],
		["5606-8010", {cry:"310T16ANS0"}],
		["5606-8020", {cry:"310T16AN"}],
		["5606-8030", {cry:"300W76GN00"}],
		["5606-8040", {cry:"300W74GC0F"}],
		["5606-8050", {cry:"300W76GN00"}],
		["5606-8060", {cry:"300W72GC0F"}],
		["5606-8070", {cry:"300W76GN00"}],
		["5606-8080", {cry:"300R14NS"}],
		["5606-8090", {cry:"300W76GN00"}],
		["5606-8100", {cry:"300W84GC0F"}],
		["5606-8110", {cry:"300W80GC00"}],
		["5606-8120", {cry:"300W76GN00"}],
		["5606-8130", {cry:"300W72GC0F"}],
		["5606-9000", {cry:"320T08AN"}],
		["5606-9020", {cry:"320T08AN"}],
		["5606-9030", {cry:"315V06GNS0"}],
		["5606-9040", {cry:"315V06GNS0"}],
	];
	SeikoModelDB.m5619= [
		["5619-7000", {cry:"300V16GNS0"}],
		["5619-7010", {cry:"300T24AN,300T20ANG"}],
	];
	SeikoModelDB.m5621= [
		["5621-6000", {cry:"270V04GNS0"}],
		["5621-7000", {cry:"300T12ANS"}],
		["5621-7020", {cry:"300V16GNS0"}],
	];
	SeikoModelDB.m5625= [
		["5625-5010", {cry:"RE0V08GN"}],
		["5625-5040", {cry:"SA0W16AN00"}],
		["5625-5060", {cry:"RE0V16GNS0"}],
		["5625-6000", {cry:"270V04GN"}],
		["5625-6020", {cry:"270V04GNS0"}],
		["5625-7000", {cry:"300V04GNS0"}],
		["5625-7010", {cry:"300V04GNS0"}],
		["5625-7030", {cry:"300V04GNS0"}],
		["5625-7040", {cry:"300V16GNS0,300V04GNS0"}],
		["5625-7060", {cry:"300V04GNS0"}],
		["5625-7070", {cry:"300T12ANS"}],
		["5625-7080", {cry:"300V16GNS0"}],
		["5625-7110", {cry:"300V16GNS0"}],
		["5625-7120", {cry:"300V16GNS0"}],
		["5625-8000", {cry:"300W76GN00"}],
	];
	SeikoModelDB.m5626= [
		["5626-5040", {cry:"SA0W16AN00"}],
		["5626-6000", {cry:"270V04GNS0"}],
		["5626-7000", {cry:"300V04GNS0"}],
		["5626-7010", {cry:"300V04GNS0"}],
		["5626-7030", {cry:"300V04GNS0"}],
		["5626-7040", {cry:"300V04GNS0"}],
		["5626-7060", {cry:"300V04GNS0"}],
		["5626-7070", {cry:"300T12ANS"}],
		["5626-7080", {cry:"300V16GNS0"}],
		["5626-7090", {cry:"300T12ANS"}],
		["5626-7100", {cry:"300V16GNS0"}],
		["5626-7110", {cry:"300V16GNS0"}],
		["5626-7140", {cry:"300V62GCSF"}],
		["5626-7150", {cry:"300V66GCSF"}],
		["5626-7160", {cry:"300V66GC"}],
		["5626-7170", {cry:"300V98ECSF"}],
		["5626-7180", {cry:"300V84ECSF"}],
		["5626-7190", {cry:"330V66GCSF"}],
		["5626-7200", {cry:"300V98GCSF"}],
		["5626-7210", {cry:"300V62GHSA"}],
		["5626-7220", {cry:"300V62GHSA"}],
		["5626-7230", {cry:"300W54GH02"}],
		["5626-7240", {cry:"280W04GC0F"}],
		["5626-7250", {cry:"300W72GC"}],
		["5626-8000", {cry:"300W76GN00"}],
		["5626-8010", {cry:"300W76GN00"}],
		["5626-8140", {cry:"300W76GN00"}],
		["5626-8150", {cry:"300W76GN00"}],
		["5626-8160", {cry:"300W76GN00"}],
	];
	SeikoModelDB.m5641= [
		["5641-5000", {cry:"SA1N02AN"}],
		["5641-7000", {cry:"300T24AN"}],
	];
	SeikoModelDB.m5645= [
		["5645-5000", {cry:"SA1N02AN"}],
		["5645-5010", {cry:"BA0V02GN"}],
		["5645-7000", {cry:"300T234AN,300T24AN"}],
		["5645-7010", {cry:"300V16GNG0"}],
		["5645-8000", {cry:"305V12GNS0,300V05GNG"}],
	];
	SeikoModelDB.m5646= [
		["5646-5010", {cry:"BA0V02GNS"}],
		["5646-7000", {cry:"300T24AN"}],
		["5646-7010", {cry:"300V16GN"}],
		["5646-7020", {cry:"300V66GCS"}],
		["5646-7030", {cry:"300V82GNS"}],
		["5646-7040", {cry:"300T40ANS0,300T20ANS,300T28ANS"}],
		["5646-8000", {cry:"305V12GN,300V05GNS"}],
	];
	SeikoModelDB.m5740= [
		["5740-8000", {cry:"310W04AN"}],
	];
	SeikoModelDB.m5830= [
		["5830-6010", {cry:"270N21SN"}],
		["5830-5190", {cry:"SA9N01SN"}],
	];
	SeikoModelDB.m5854= [
		["5854-5000", {cry:"SA6N03SN"}],
	];
	SeikoModelDB.m5855= [
		["5855-8010", {cry:"295W19GN"}],
		["5855-8000", {cry:"300W63GA"}],
		["5855-5000", {cry:"ES0W41GA"}],
		["5855-5010", {cry:"SA6N07SN"}],
	];
	SeikoModelDB.m5856= [
		["5856-7020", {cry:"285W39GA"}],
		["5856-7030", {cry:"285W39GA"}],
		["5856-7040", {cry:"285W39GA"}],
		["5856-8030", {cry:"295W19GA"}],
		["5856-8060", {cry:"295W19GA"}],
		["5856-8090", {cry:"295W19GA"}],
		["5856-8040", {cry:"295W19GN"}],
		["5856-8070", {cry:"295W19GN"}],
		["5856-8050", {cry:"295W21GN"}],
		["5856-8000", {cry:"300W63GA"}],
		["5856-8020", {cry:"300W63GA"}],
		["5856-8010", {cry:"300W67GA"}],
		["5856-7010", {cry:"300W69GA"}],
		["5856-8080", {cry:"300W69GA"}],
		["5856-5000", {cry:"ES0W41GA"}],
		["5856-5010", {cry:"SA1W49GA"}],
		["5856-5020", {cry:"SA1W73HA"}],
	];
	SeikoModelDB.m5C23= [
		["5C23-8000", {cry:"295W28GN"}],
		["5C23-8019", {cry:"295W28GN"}],
		["5C23-8020", {cry:"295W28GN"}],
		["5C23-8030", {cry:"295W28GN"}],
		["5C23-8040", {cry:"295W28GN"}],
	];
	SeikoModelDB.m5G23= [
		["5G23-8050", {cry:"295W28GN,295W30LN01"}],
		["5G23-8060", {cry:"295W28GN,295W30LN01"}],
	];
	SeikoModelDB.m5H22= [
		["5H22-8A00", {cry:"295W28GN"}],
	];
	SeikoModelDB.m5H23= [
		["5H23-8000", {cry:"295P05HN03"}],
		["5H23-8A09", {cry:"295P05HN03"}],
		["5H23-8020", {cry:"295P05HN03"}],
		["5H23-8A00", {cry:"295P05HN03"}],
		["5H23-8A10", {cry:"295P05HN03,295W28GN"}],
		["5H23-8A50", {cry:"295W28GN"}],
		["5H23-8A69", {cry:"295W28GN"}],
		["5H23-8A6A", {cry:"295W28GN"}],
		["5H23-8A6H", {cry:"295W28GN"}],
	];
	SeikoModelDB.m5J22= [
		["5J22-0A10", {cry:"290PX7TNC3"}],
		["5J22-0A20", {cry:"290PX7TNC3"}],
		["5J22-0C80", {cry:"290PX7TNC3"}],
	];
	SeikoModelDB.m5J32= [
		["5J32-0AF0", {cry:"300P04LN03"}],
		["5J32-0AG0", {cry:"300P04LN03"}],
	];
	SeikoModelDB.m5M22= [
		["5M22-7B40", {cry:"280A03JN02"}],
	];
	SeikoModelDB.m5M42= [
		["5M42-0B40", {cry:"280A03JN02"}],
		["5M42-0E30", {cry:"285P8HR02"}],
		["5M42-0H40", {cry:"285P8HR02"}],
		["5M42-0K80", {cry:"290P03LN03"}],
		["5M42-0K70", {cry:"290P03LN03"}],
		["5M42-0K40", {cry:"290P03LN03"}],
		["5M42-0K50", {cry:"290P03LN03"}],
		["5M42-0M70", {cry:"290P03LN03"}],
		["5M42-0K90", {cry:"290P03LN03"}],
		["5M42-0L00", {cry:"290P03LN03"}],
		["5M42-0K00", {cry:"290P04HN"}],
		["5M42-0L60", {cry:"300P03HN03"}],
	];
	SeikoModelDB.m5M43= [
		["5M43-0A39", {cry:"290PX7TNC3"}],
		["5M43-0A40", {cry:"290PX7TNC3"}],
		["5M43-0B30", {cry:"290PX7TNC3"}],
		["5M43-0C90", {cry:"290PX7TNC3"}],
		["5M43-0D20", {cry:"290PX7TNC3"}],
		["5M43-0D10", {cry:"300P03HN03,300P03LN03"}],
		["5M43-0E40", {cry:"300P03HN03"}],
	];
	SeikoModelDB.m5M62= [
		["5M62-0C40", {cry:"280A03JN02"}],
		["5M62-0B40", {cry:"280A03JN02"}],
		["5M62-0C10", {cry:"300P03HN03"}],
		["5M62-0BA0", {cry:"300P03LN03"}],
	];
	SeikoModelDB.m5M63= [
		["5M63-0A10", {cry:"290PX7TNC3"}],
		["5M63-0A50", {cry:"300P03HN03"}],
		["5M63-0A80", {cry:"300P03HN03"}],
		["5M63-0B80", {cry:"300P03HN03"}],
	];
	SeikoModelDB.m5P31= [
		["5P31-7019", {cry:"280A03JN02"}],
	];
	SeikoModelDB.m5Y13= [
		["5Y13-8000", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
	];
	SeikoModelDB.m5Y22= [
		["5Y22-6040", {cry:"275W36JN01"}],
		["5Y22-8039", {cry:"280A03JN02"}],
		["5Y22-8A00", {cry:"295W69LN"}],
		["5Y22-8020", {cry:"310T48ANG"}],
	];
	SeikoModelDB.m5Y23= [
		["5Y23-8A69", {cry:"295P05HN03"}],
		["5Y23-8140", {cry:"295W28GN"}],
		["5Y23-8229", {cry:"295W28GN"}],
		["5Y23-8A61", {cry:"295W30LN01"}],
		["5Y23-8A68", {cry:"295W30LN01"}],
		["5Y23-8A10", {cry:"295W69LN"}],
		["5Y23-8040", {cry:"310T48ANG"}],
	];
	SeikoModelDB.m5Y29= [
		["5Y29-6030", {cry:"275W36JN01"}],
	];
	SeikoModelDB.m5Y30= [
		["5Y30-5K09", {cry:"BA6N03JN01"}],
		["5Y30-5369", {cry:"REAN18JN"}],
	];
	SeikoModelDB.m5Y32= [
		["5Y32-5060", {cry:"BA1N48GM01"}],
		["5Y32-5140", {cry:"RE8N08GN"}],
		["5Y32-5809", {cry:"SAJN37JN01"}],
		["5Y32-5B00", {cry:"SAJN37JN01"}],
	];
	SeikoModelDB.m5Y39= [
		["5Y39-5B21", {cry:"BA0A05JN02"}],
		["5Y39-5B29", {cry:"BA0A05JN02"}],
		["5Y39-5B30", {cry:"BA0A05JN02"}],
	];
	SeikoModelDB.m5Y81= [
		["5Y81-5000", {cry:"RE8N08GN"}],
		["5Y81-5010", {cry:"RE8N08GN"}],
	];
	SeikoModelDB.m6020= [
		["6020-5390", {cry:"SA3N84GN"}],
	];
	SeikoModelDB.m6100= [
		["6100-8000", {cry:"310T08AN,310T16AN"}],
		["6100-8010", {cry:"329W04AN"}],
		["6100-8740", {cry:"310T18AN"}],
	];
	SeikoModelDB.m6102= [
		["6102-0010", {cry:"317N02AN"}],
		["6102-8000", {cry:"310T08AN,310T16AN"}],
		["6102-8010", {cry:"329W04AN"}],
	];
	SeikoModelDB.m6105= [
		["6105-6000", {cry:"300T04AN"}],
		["6105-8000", {cry:"320W10GN"}],
		["6105-8060", {cry:"310T08AN,310T48ANG,310T18AN"}],
		["6105-8080", {cry:"310T10AN,310T18AN"}],
		["6105-8090", {cry:"340T06AN"}],
		["6105-8100", {cry:"310T10AN,310T16AN"}],
		["6105-8110", {cry:"320W10GN"}],
		["6105-6110", {cry:"320W10GN"}],
	];
	SeikoModelDB.m6106= [
		["6106-5000", {cry:"REDW022AN,RE0W02AN"}],
		["6106-5400", {cry:"RE0W06AN"}],
		["6106-5410", {cry:"RE0W06AN"}],
		["6106-5420", {cry:"SA0W06AN"}],
		["6106-5430", {cry:"K00W16AN"}],
		["6106-5440", {cry:"RE0W02AN"}],
		["6106-5450", {cry:"K00W08AN"}],
		["6106-5460", {cry:"SA0W06AN"}],
		["6106-5470", {cry:"RE0W12AC"}],
		["6106-5480", {cry:"ES0W02AC"}],
		["6106-5490", {cry:"BA0W04AN"}],
		["6106-5520", {cry:"BA0W16AN"}],
		["6106-5530", {cry:"RE0W34AN"}],
		["6106-5540", {cry:"SA0W30AN"}],
		["6106-5550", {cry:"SA0W34AN"}],
		["6106-5560", {cry:"BA0W32AN"}],
		["6106-6000", {cry:"300TT04AN,300T04AN"}],
		["6106-6030", {cry:"320T02AN"}],
		["6106-6040", {cry:"330W16GN"}],
		["6106-6050", {cry:"320W10GN"}],
		["6106-6400", {cry:"320T02AN"}],
		["6106-6410", {cry:"330W16GN"}],
		["6106-6430", {cry:"330W16GN"}],
		["6106-6440", {cry:"330W16GN"}],
		["6106-7000", {cry:"300T20ANS0,300T12AN"}],
		["6106-7010", {cry:"300T12AN"}],
		["6106-7020", {cry:"300T12AN"}],
		["6106-7030", {cry:"300T12AN"}],
		["6106-7040", {cry:"300T12AN,300T20ANG"}],
		["6106-7040", {cry:"300T12AN"}],
		["6106-7050", {cry:"300T12AN,300T18AN"}],
		["6106-7080", {cry:"300T12AN,300T18AN,300T20ANS"}],
		["6106-7090", {cry:"320T02AN"}],
		["6106-7100", {cry:"340W12GN"}],
		["6106-7110", {cry:"320W10GN"}],
		["6106-7180", {cry:"300V16GNS0"}],
		["6106-7410", {cry:"300T12AN"}],
		["6106-7420", {cry:"320W10GN,320W12GN"}],
		["6106-7430", {cry:"300T12AN,300T21AN"}],
		["6106-7440", {cry:"320W10GN"}],
		["6106-7460", {cry:"300V20GN"}],
		["6106-7470", {cry:"300V20GN"}],
		["6106-7480", {cry:"300V20GN"}],
		["6106-7490", {cry:"300V20GN"}],
		["6106-7500", {cry:"300T12AN,300T20ANG"}],
		["6106-7510", {cry:"300V20GN"}],
		["6106-7520", {cry:"300V20GN"}],
		["6106-7530", {cry:"300T24AN,300T20ANS"}],
		["6106-7540", {cry:"300T24AN,300V16GN"}],
		["6106-7550", {cry:"300V98GCSF,300V60GC,300V64GC"}],
		["6106-7560", {cry:"300V16GNS0"}],
		["6106-7570", {cry:"300V64GC"}],
		["6106-7580", {cry:"300V16GNS0"}],
		["6106-7590", {cry:"300V62GCGF"}],
		["6106-7600", {cry:"300V64GCSF,300V60GC"}],
		["6106-7610", {cry:"300V16GNS0"}],
		["6106-7620", {cry:"300V16GN"}],
		["6106-7630", {cry:"300T24AN,300T20ANG"}],
		["6106-7640", {cry:"300V16GNS0"}],
		["6106-7650", {cry:"300V16GNS0"}],
		["6106-7660", {cry:"310W22GC0F"}],
		["6106-7670", {cry:"300V64GC,310W20GC"}],
		["6106-7680", {cry:"310W18GC0F"}],
		["6106-7690", {cry:"300V98GCSF"}],
		["6106-7700", {cry:"300V64GCSF"}],
		["6106-7710", {cry:"300W52GC0F"}],
		["6106-7720", {cry:"300W62GC00,300WA2GC"}],
		["6106-7730", {cry:"300W58GN00,300W58GC,300WB0GN"}],
		["6106-7740", {cry:"300V02GNS,300V20GN"}],
		["6106-7810", {cry:"310T18ANS,310T48ANG"}],
		["6106-8000", {cry:"310T08AN,310T18AN"}],
		["6106-8010", {cry:"310T08AN,310T18AN"}],
		["6106-8020", {cry:"310T1GANG,310T18AN"}],
		["6106-8030", {cry:"310T10AN,310T16AN"}],
		["6106-8040", {cry:"340T06AN"}],
		["6106-8060", {cry:"310T08AN"}],
		["6106-8070", {cry:"310T10AN,310T16AN"}],
		["6106-8080", {cry:"310T10AN"}],
		["6106-8100", {cry:"310T14AN"}],
		["6106-8110", {cry:"310T14ANS"}],
		["6106-8120", {cry:"320W10GN"}],
		["6106-8130", {cry:"310T12AN"}],
		["6106-8140", {cry:"310T12AN"}],
		["6106-8170", {cry:"310T16AN"}],
		["6106-8180", {cry:"330W16GN"}],
		["6106-8200", {cry:"330W16GN"}],
		["6106-8210", {cry:"310T10AN"}],
		["6106-8220", {cry:"320W10GN"}],
		["6106-8230", {cry:"320W10GN"}],
		["6106-8240", {cry:"310T08AN"}],
		["6106-8250", {cry:"310W10GN"}],
		["6106-8400", {cry:"310T18AN,310T16AN"}],
		["6106-8410", {cry:"320W10GN"}],
		["6106-8420", {cry:"310T18AN,310T16AN"}],
		["6106-8430", {cry:"310T18AN,310T16AN"}],
		["6106-8440", {cry:"320W10GN"}],
		["6106-8450", {cry:"320W10GN"}],
		["6106-8460", {cry:"310T18AN,310T16AN"}],
		["6106-8470", {cry:"310T16AN"}],
		["6106-8480", {cry:"310T16AN"}],
		["6106-8490", {cry:"310T16AN"}],
		["6106-8500", {cry:"310T16AN"}],
		["6106-8510", {cry:"320W10GN"}],
		["6106-8530", {cry:"310T16AN"}],
		["6106-8560", {cry:"320W28GN"}],
		["6106-8570", {cry:"310T16AN"}],
		["6106-8580", {cry:"310T14AN"}],
		["6106-8630", {cry:"305V06GNS0"}],
		["6106-8640", {cry:"305V06GNS0"}],
		["6106-8650", {cry:"305W12GN00,305W12GM01"}],
		["6106-8660", {cry:"310W28GN0"}],
		["6106-8670", {cry:"310W28GN"}],
		["6106-8680", {cry:"310W28GN"}],
		["6106-8690", {cry:"310W30GC0F"}],
		["6106-8700", {cry:"310W28GN"}],
		["6106-8710", {cry:"310T32ACS,310T32AN"}],
		["6106-8720", {cry:"310T18AN"}],
		["6106-8730", {cry:"310T18AN"}],
		["6106-8740", {cry:"310W32GC0F"}],
		["6106-8750", {cry:"310W28GN"}],
		["6106-8760", {cry:"310W32GC0F"}],
		["6106-9000", {cry:"320T04AN"}],
		["6106-9010", {cry:"320T08AN"}],
		["6106-9030", {cry:"320T04AN"}],
		["6106-9040", {cry:"320T04AN,320T08AN"}],
		["6106-9050", {cry:"320T08AN"}],
		["6106-7769", {cry:"300T20ANG"}],
		["6106-7750", {cry:"300T20ANS"}],
		["6106-7760", {cry:"300T20ANS"}],
		["6106-8599", {cry:"310T48ANG"}],
		["6106-8599", {cry:"310T48ANS"}],
		["6106-6060", {cry:"320W10GN"}],
	];
	SeikoModelDB.m6109= [
		["6109-8000", {cry:"310T18ANS,310T48ANG"}],
		["6109-8010", {cry:"310T18AN"}],
		["6109-8020", {cry:"310T18ANS,310T48ANG"}],
	];
	SeikoModelDB.m6110= [
		["6110-6000", {cry:"275P06SV0C"}],
	];
	SeikoModelDB.m6117= [
		["6117-6010", {cry:"340T06AN"}],
		["6117-6400", {cry:"350T02ANS"}],
		["6117-6410", {cry:"350T02ANS"}],
		["6117-6420", {cry:"350T02ANS"}],
		["6117-8000", {cry:"310T14ANS"}],
	];
	SeikoModelDB.m6118= [
		["6118-7000", {cry:"300T20ANSS"}],
		["6118-7010", {cry:"300T20ANS"}],
		["6118-8000", {cry:"310Y18ANS"}],
		["6118-8010", {cry:"310T18AN"}],
		["6118-8020", {cry:"310W28GN"}],
		["6118-8040", {cry:"310T18ANS,310T48ANG"}],
	];
	SeikoModelDB.m6119= [
		["6119-5000", {cry:"RE0W02AN"}],
		["6119-5400", {cry:"SA0W06AN"}],
		["6119-5410", {cry:"K00W08AN"}],
		["6119-5420", {cry:"K00W08AN"}],
		["6119-5430", {cry:"SA0W06AN"}],
		["6119-5440", {cry:"BA0W04AN"}],
		["6119-5450", {cry:"K00W26AC"}],
		["6119-5460", {cry:"BA0W16AN"}],
		["6119-5470", {cry:"ES0W08AN"}],
		["6119-5480", {cry:"RE0W34AN"}],
		["6119-5490", {cry:"SA0W30AN"}],
		["6119-5500", {cry:"SA0W34AN"}],
		["6119-5510", {cry:"SA0W30AN"}],
		["6119-5520", {cry:"BA0W32AN"}],
		["6119-5530", {cry:"BA0W32AN"}],
		["6119-6000", {cry:"320T02AN"}],
		["6119-6010", {cry:"320T12AN"}],
		["6119-6020", {cry:"320W10GN"}],
		["6119-6030", {cry:"320T02AN"}],
		["6119-6040", {cry:"320T02AN"}],
		["6119-6050", {cry:"330W16GN"}],
		["6119-6400", {cry:"330W16GN"}],
		["6119-6410", {cry:"320T12AN"}],
		["6119-7000", {cry:"300T10ANG,300T20ANS"}],
		["6119-7010", {cry:"300T12AN"}],
		["6119-7030", {cry:"300T12AN"}],
		["6119-7040", {cry:"300T12AN"}],
		["6119-7080", {cry:"300T10ANG,300T20ANG"}],
		["6119-7090", {cry:"300T12AN,300T20ANS"}],
		["6119-7100", {cry:"300T12AN,300T20ANG"}],
		["6119-7120", {cry:"320T02AN"}],
		["6119-7130", {cry:"320T02AN"}],
		["6119-7140", {cry:"320T02AN"}],
		["6119-7150", {cry:"320T02AN"}],
		["6119-7160", {cry:"340W12GN"}],
		["6119-7170", {cry:"320W10GN"}],
		["6119-7180", {cry:"320W10GN"}],
		["6119-7400", {cry:"300T12AN,300T20ANS"}],
		["6119-7410", {cry:"300T21AN"}],
		["6119-7420", {cry:"300T24ANS"}],
		["6119-7430", {cry:"300V16GN"}],
		["6119-7450", {cry:"300T20ANG"}],
		["6119-7460", {cry:"300V16GN"}],
		["6119-7470", {cry:"300V16GN"}],
		["6119-7480", {cry:"300T24AN,300T20ANG"}],
		["6119-7500", {cry:"300T20AN"}],
		["6119-7510", {cry:"300T20AN"}],
		["6119-7520", {cry:"300T20AN"}],
		["6119-7530", {cry:"310W18GC"}],
		["6119-7540", {cry:"300W70GC0F"}],
		["6119-8020", {cry:"310T12AN"}],
		["6119-8030", {cry:"310T12AN"}],
		["6119-8040", {cry:"310T08AN"}],
		["6119-8070", {cry:"310T10AN"}],
		["6119-8080", {cry:"310T10AN"}],
		["6119-8090", {cry:"310T10AN,310T48ANG"}],
		["6119-8100", {cry:"310T10AN"}],
		["6119-8120", {cry:"320W10GN"}],
		["6119-8130", {cry:"320W10GN"}],
		["6119-8140", {cry:"320W10GN"}],
		["6119-8160", {cry:"340T08AN"}],
		["6119-8190", {cry:"310T1GAN"}],
		["6119-8200", {cry:"340T08AN"}],
		["6119-8220", {cry:"320W10GN"}],
		["6119-8230", {cry:"330T12AN"}],
		["6119-8240", {cry:"330W16GN"}],
		["6119-8250", {cry:"330T12AN"}],
		["6119-8270", {cry:"330W16SN,330W16GN"}],
		["6119-8280", {cry:"310T12AN"}],
		["6119-8300", {cry:"320W10GN"}],
		["6119-8310", {cry:"320W10GN"}],
		["6119-8400", {cry:"320W10GN"}],
		["6119-8410", {cry:"310T18ANS,310T48ANG"}],
		["6119-8430", {cry:"310T18ANS,310T48ANG"}],
		["6119-8440", {cry:"310T18ANS,310T48ANG"}],
		["6119-8450", {cry:"320W28GN"}],
		["6119-8460", {cry:"310T14AN"}],
		["6119-8470", {cry:"310T16AN"}],
		["6119-8480", {cry:"310T18ANS,310T48ANG"}],
		["6119-8490", {cry:"310T18ANS,310T48ANG"}],
		["6119-8500", {cry:"310T18ANG,310T48ANG"}],
		["6119-8510", {cry:"340T06AN"}],
		["6119-8520", {cry:"310T16AN"}],
		["6119-8530", {cry:"310T18AN"}],
		["6119-8540", {cry:"320W10GN"}],
		["6119-8550", {cry:"305W12GN"}],
		["6119-8560", {cry:"310W28GN"}],
		["6119-8570", {cry:"310T32ACS"}],
		["6119-8580", {cry:"310W28GN"}],
		["6119-8590", {cry:"310T18AN"}],
		["6119-8600", {cry:"310T18AN"}],
		["6119-8610", {cry:"310T18AN,310T48ANG"}],
		["6119-8620", {cry:"310W32GC"}],
		["6119-8630", {cry:"340W18GN"}],
		["6119-9410", {cry:"320T04ANS0"}],
		["6119-9420", {cry:"320T08ANA0"}],
		["6119-8340", {cry:"330W16GN"}],
	];
	SeikoModelDB.m6130= [
		["6130-8040", {cry:"340W18GN"}],
	];
	SeikoModelDB.m6138= [
		["6138-0010", {cry:"340W14GN00"}],
		["6138-0020", {cry:"340W14GN00"}],
		["6138-0030", {cry:"340W14GN00"}],
		["6138-0040", {cry:"340W14GN"}],
		["6138-3000", {cry:"365V02GNS0"}],
		["6138-7000", {cry:"300T28ANS0"}],
		["6138-8000", {cry:"335V05GN,340W18GN"}],
		["6138-8010", {cry:"340W16GN00"}],
		["6138-8020", {cry:"350T02AN"}],
		["6138-8030", {cry:"340W18GN"}],
		["6138-8080", {cry:"330W18GN"}],
	];
	SeikoModelDB.m6139= [
		["6139-6000", {cry:"330W18GN"}],
		["6139-6010", {cry:"330W18GN00"}],
		["6139-6020", {cry:"350T02ANS"}],
		["6139-6030", {cry:"330W18GN"}],
		["6139-6040", {cry:"330W18GN"}],
		["6139-6070", {cry:"335V10GNS"}],
		["6139-6080", {cry:"330W18GN"}],
		["6139-7000", {cry:"340W14GN"}],
		["6139-7010", {cry:"340W14GN"}],
		["6139-7020", {cry:"340W14GN"}],
		["6139-7030", {cry:"335V08GN"}],
		["6139-7050", {cry:"335V10GNS"}],
		["6139-7060", {cry:"340W14GN"}],
		["6139-7070", {cry:"335V10GNS"}],
		["6139-7080", {cry:"340T06ANS"}],
		["6139-7100", {cry:"340W18GN"}],
		["6139-8000", {cry:"320W28GN"}],
		["6139-8010", {cry:"305W12GN00"}],
		["6139-8020", {cry:"310T28AN"}],
		["6139-8030", {cry:"310T28AN"}],
		["6139-8040", {cry:"310W24GH"}],
		["6139-8050", {cry:"310W24GN"}],
		["6139-8060", {cry:"310T28AN"}],
		["6139-7149", {cry:"340W14GN"}],
	];
	SeikoModelDB.m6145= [
		["6145-8000", {cry:"310T18ANS,310T48ANG"}],
		["6145-8020", {cry:"300V14GNS0"}],
		["6145-8030", {cry:"310T18ANS,310T48ANG"}],
		["6145-8050", {cry:"310V16GCSF"}],
	];
	SeikoModelDB.m6146= [
		["6146-8000", {cry:"310T18ANS,310T48ANG"}],
		["6146-8010", {cry:"300V14GNS0"}],
		["6146-8020", {cry:"300V14GNS0"}],
		["6146-8030", {cry:"310T16AN"}],
		["6146-8040", {cry:"310T16AN"}],
		["6146-8050", {cry:"310V16GCSF"}],
	];
	SeikoModelDB.m6155= [
		["6155-8000", {cry:"305V06GN"}],
	];
	SeikoModelDB.m6156= [
		["6156-8000", {cry:"305V06GN"}],
		["6156-8010", {cry:"300V18SES0"}],
		["6156-8020", {cry:"310T18ANS,310T48ANG"}],
		["6156-8030", {cry:"310W24GN00"}],
		["6156-8040", {cry:"300W76GN00"}],
	];
	SeikoModelDB.m6159= [
		["6159-7000", {cry:"325W14GN"}],
		["6159-7010", {cry:"335W08GA"}],
	];
	SeikoModelDB.m6201= [
		["6201-8980", {cry:"329W04AN"}],
		["6201-2082", {cry:"341W02AN"}],
	];
	SeikoModelDB.m6205= [
		["6205-8910", {cry:"329W04AN"}],
		["6205-8920", {cry:"329W04AN"}],
		["6205-8930", {cry:"329W04AN"}],
		["6205-8940", {cry:"329W04AN"}],
		["6205-8960", {cry:"329W04AN"}],
		["6205-8970", {cry:"329W04AN"}],
	];
	SeikoModelDB.m6206= [
		["6206-8150", {cry:"310W04AN"}],
	];
	SeikoModelDB.m6217= [
		["6217-7000", {cry:"341W02AN"}],
	];
	SeikoModelDB.m6218= [
		["6218-8000", {cry:"320W10GN"}],
	];
	SeikoModelDB.m6220= [
		["6220-7140", {cry:"300T20ANG"}],
		["6220-8981", {cry:"329W04AN"}],
		["6220-8990", {cry:"329W04AN"}],
	];
	SeikoModelDB.m6222= [
		["6222-7060", {cry:"300T20ANG"}],
		["6222-8990", {cry:"329W04AN"}],
	];
	SeikoModelDB.m6300= [
		["6300-7000", {cry:"300T20ANS"}],
		["6300-8009", {cry:"310T18ANS"}],
		["6300-8009", {cry:"310T40ANS"}],
		["6300-8000", {cry:"310T48ANG"}],
		["6300-8010", {cry:"310T48ANG"}],
	];
	SeikoModelDB.m6302= [
		["6302-8020", {cry:"310T48ANG"}],
	];
	SeikoModelDB.m6306= [
		["6306-7010", {cry:"300T20ANS"}],
		["6306-8020", {cry:"310W34GN"}],
		["6306-8050", {cry:"310W34GN"}],
		["6306-8070", {cry:"310W34GN"}],
		["6306-7000", {cry:"320W34GA"}],
        ["6306-6001", {cry:"310W40GN"}],
        ["6306-8000", {cry:"310W40GN"}],
        ["6306-806a", {cry:"310W40GN"}],
        ["6306-8060", {cry:"310W40GN"}],
        ["6306-8070", {cry:"310W40GN"}],
        ["6306-8010", {cry:"310W40GN"}],
	];
	SeikoModelDB.m6308= [
		["6308-7000", {cry:"300T20ANS"}],
		["6308-8000", {cry:"310T18AN,310T48ANG"}],
		["6308-8010", {cry:"310T18AN00,310T48ANG"}],
		["6308-8030", {cry:"310W34GN00"}],
		["6308-8020", {cry:"310T48ANG"}],
		["6308-8040", {cry:"310T48ANG"}],
		["6308-8060", {cry:"310T48ANG"}],
		["6308-8070", {cry:"310W34GN"}],
	];
	SeikoModelDB.m6309= [
		["6309-4010", {cry:"ES8W46LM01"}],
		["6309-4020", {cry:"ES8W48LM01"}],
		["6309-4030", {cry:"ES2W84GN00"}],
		["6309-4040", {cry:"ES2W84GN00"}],
		["6309-4050", {cry:"BA1W18GN00"}],
		["6309-4060", {cry:"BA2W22LM01"}],
		["6309-4070", {cry:"SA9W42LM01"}],
		["6309-4080", {cry:"SA3W92GN00"}],
		["6309-4090", {cry:"SA3W92GN00"}],
		["6309-4100", {cry:"ES8W46LN01"}],
		["6309-5000", {cry:"BA0W40AC0F"}],
		["6309-5010", {cry:"SA0W30AN00"}],
		["6309-5020", {cry:"SA0W30AN00"}],
		["6309-5030", {cry:"RE0W34AN00"}],
		["6309-5050", {cry:"SA0W06AN00"}],
		["6309-5060", {cry:"SA0W62AN00"}],
		["6309-5070", {cry:"SA0W64GN00"}],
		["6309-5080", {cry:"SA0W82GN00"}],
		["6309-5090", {cry:"BA0W96AN00"}],
		["6309-5100", {cry:"SA1W08GN00"}],
		["6309-5110", {cry:"SA0W30AN00"}],
		["6309-5120", {cry:"SA1W16GN"}],
		["6309-5130", {cry:"ES0W30GN00"}],
		["6309-5140", {cry:"SA1W36GN"}],
		["6309-5150", {cry:"SA1W40GM03"}],
		["6309-5160", {cry:"SA0W98GN"}],
		["6309-5170", {cry:"310W48GN"}],
		["6309-5190", {cry:"SA1W36GN"}],
		["6309-5200", {cry:"SA1W04GN"}],
		["6309-5210", {cry:"SA1W00GN00"}],
		["6309-5220", {cry:"SA1W06GN00"}],
		["6309-5230", {cry:"SA1W06GN00"}],
		["6309-5240", {cry:"ES0W32GN"}],
		["6309-5250", {cry:"ES1W14GN00"}],
		["6309-5260", {cry:"ES1W12GN"}],
		["6309-5270", {cry:"ES1W12GM02"}],
		["6309-5300", {cry:"BA0W48AN00"}],
		["6309-5320", {cry:"SA0W30AN00"}],
		["6309-5330", {cry:"SA0W06AN00"}],
		["6309-5450", {cry:"SA2W06GM02"}],
		["6309-5460", {cry:"SA2W14GN00"}],
		["6309-5470", {cry:"SA2W14GN00"}],
		["6309-5480", {cry:"ES1W80GN00"}],
		["6309-5490", {cry:"BA1W50GN00"}],
		["6309-5500", {cry:"ES1W82GN00"}],
		["6309-5510", {cry:"SA2W62GN00"}],
		["6309-5520", {cry:"ES1W84GN00"}],
		["6309-5530", {cry:"K00W64GN00"}],
		["6309-5590", {cry:"ES2W42GM01"}],
		["6309-5600", {cry:"ES2W44GM01"}],
		["6309-5610", {cry:"ES2W50GM01"}],
		["6309-5620", {cry:"BA1W50GN00"}],
		["6309-5630", {cry:"ES2W88GM02"}],
		["6309-5640", {cry:"ES2W84GN"}],
		["6309-5650", {cry:"300WD0GM02"}],
		["6309-5660", {cry:"SA3W46GN00"}],
		["6309-5670", {cry:"ES2W86GM02"}],
		["6309-5680", {cry:"ES8W24LM01"}],
		["6309-5720", {cry:"ES4W26GN00"}],
		["6309-5730", {cry:"ES4W44GM01"}],
		["6309-5740", {cry:"SA5W18GN00"}],
		["6309-5760", {cry:"ES4W46GM01"}],
		["6309-5770", {cry:"ES4W46GN00"}],
		["6309-5780", {cry:"ES4W34GN00"}],
		["6309-5790", {cry:"ES4W34GM01"}],
		["6309-5800", {cry:"SA2W46GN00"}],
		["6309-5810", {cry:"SA2W46GN00"}],
		["6309-5820", {cry:"SA5W18GN00"}],
		["6309-5830", {cry:"ES4W32GN00"}],
		["6309-5840", {cry:"ES4W32GN00"}],
		["6309-5850", {cry:"RE0W74GN00"}],
		["6309-5860", {cry:"ES5W08GN00"}],
		["6309-5870", {cry:"SA5W72GM01"}],
		["6309-5880", {cry:"ES5W86GN00"}],
		["6309-5890", {cry:"ES5W86GN00"}],
		["6309-5900", {cry:"ES5W26GM01"}],
		["6309-5910", {cry:"SA5W18GN00"}],
		["6309-5920", {cry:"SA5W18GM01"}],
		["6309-5930", {cry:"ES2W86GM01"}],
		["6309-5940", {cry:"SA6W20GM01"}],
		["6309-5950", {cry:"SA6W02GN00"}],
		["6309-5960", {cry:"SA6W02GN00"}],
		["6309-5970", {cry:"SA7W16GM01"}],
		["6309-5980", {cry:"SA7W16GM01"}],
		["6309-5990", {cry:"SA3W92GN00"}],
		["6309-6000", {cry:"320W10GN"}],
		["6309-6010", {cry:"SA0W82GN00"}],
		["6309-6020", {cry:"315W12GN,320W10GN"}],
		["6309-6030", {cry:"SA1W16GN00"}],
		["6309-6040", {cry:"300WC2GN"}],
		["6309-6050", {cry:"300WC2GN"}],
		["6309-6060", {cry:"305W20GN"}],
		["6309-6070", {cry:"ES0W30GM01"}],
		["6309-6080", {cry:"280W10GN"}],
		["6309-6090", {cry:"ES0W32GN"}],
		["6309-6100", {cry:"ES0W30GN00"}],
		["6309-6110", {cry:"320W32GN"}],
		["6309-6150", {cry:"ES1W90GN00"}],
		["6309-6160", {cry:"300WE2GM01"}],
		["6309-6170", {cry:"ES3W82GN00"}],
		["6309-6180", {cry:"ES3W82GM01"}],
		["6309-6190", {cry:"290T02ANS0"}],
		["6309-6200", {cry:"RE0W74GM01"}],
		["6309-6210", {cry:"ES5W08GN00"}],
		["6309-6220", {cry:"ES2W86GN00"}],
		["6309-6230", {cry:"280W22GN00"}],
		["6309-6240", {cry:"275W18LN01"}],
		["6309-6250", {cry:"275W18LM01"}],
		["6309-6260", {cry:"260W24LN01"}],
		["6309-6270", {cry:"275W04GN00"}],
		["6309-6280", {cry:"BA2W30LM02"}],
		["6309-7000", {cry:"300W62GC00,300WA2GC0F"}],
		["6309-7030", {cry:"310W18GC"}],
		["6309-7040", {cry:"320W34GA"}],
		["6309-7050", {cry:"300T20ANS"}],
		["6309-7060", {cry:"310W50GN"}],
		["6309-7070", {cry:"300T20ANS"}],
		["6309-7080", {cry:"310W52GN"}],
		["6309-7090", {cry:"310W52GN00"}],
		["6309-7100", {cry:"295W12GN00"}],
		["6309-7110", {cry:"295W14GN00"}],
		["6309-7120", {cry:"300W62GC00,300WA2GC0F"}],
		["6309-7130", {cry:"300T40ANB"}],
		["6309-7140", {cry:"300T20ANS0"}],
		["6309-7150", {cry:"300T20ANS0"}],
		["6309-7160", {cry:"300WD0GN00"}],
		["6309-7160", {cry:"300WD0GN"}],
		["6309-7180", {cry:"300T40ANS0,300T20ANS,300T28ANS"}],
		["6309-7200", {cry:"300WD0GN"}],
		["6309-7230", {cry:"310W50GN00"}],
		["6309-7270", {cry:"290W28GN00"}],
		["6309-7280", {cry:"300WD0GN00"}],
		["6309-7290", {cry:"320W35GA00,320W34GA"}],
		["6309-7300", {cry:"285W14GN00"}],
		["6309-7310", {cry:"300T20ANS0"}],
		["6309-7320", {cry:"280W10GN00"}],
		["6309-7330", {cry:"290W28GN00"}],
		["6309-7340", {cry:"300WC2LM01"}],
		["6309-8000", {cry:"310T18ANS,310T48ANG"}],
		["6309-8010", {cry:"310T18ANS,310T48ANG"}],
		["6309-8020", {cry:"310T18ANS,310T48ANG"}],
		["6309-8030", {cry:"310T18ANS,310T48ANG"}],
		["6309-8040", {cry:"310T32ACS"}],
		["6309-8050", {cry:"310T18ANS,310T48ANG"}],
		["6309-8060", {cry:"310W34GNS"}],
		["6309-8070", {cry:"300W96GN00"}],
		["6309-8080", {cry:"310T18ANG,310T48ANG"}],
		["6309-8090", {cry:"310W32GC"}],
		["6309-8110", {cry:"310T32ACS"}],
		["6309-8120", {cry:"310W34GN"}],
		["6309-8130", {cry:"310T18ANS,310T48ANG"}],
		["6309-8140", {cry:"310T18ANS,310T48ANG"}],
		["6309-8150", {cry:"310T18ANS0,310T48ANG"}],
		["6309-8160", {cry:"310T18ANS,310T48ANG"}],
		["6309-8170", {cry:"300W64GC"}],
		["6309-8180", {cry:"300W96GN00"}],
		["6309-8190", {cry:"310W34EN,310W34GN"}],
		["6309-8200", {cry:"310W34GN"}],
		["6309-8210", {cry:"310W34GN"}],
		["6309-8220", {cry:"310T18ANS,310T48ANG"}],
		["6309-8230", {cry:"310T18ANS0,310T48ANG"}],
		["6309-8240", {cry:"300WC2GN00"}],
		["6309-8250", {cry:"310T18ANS,310T48ANG"}],
		["6309-8260", {cry:"310T18ANSA,310T48ANG"}],
		["6309-8270", {cry:"310T18ANS,310T48ANG"}],
		["6309-8280", {cry:"310W32GC"}],
		["6309-8290", {cry:"310W34GN"}],
		["6309-8300", {cry:"310T18ANS,310T48ANG"}],
		["6309-8310", {cry:"310T18ANS,310T48ANG"}],
		["6309-8320", {cry:"310T32ACS"}],
		["6309-8330", {cry:"310T18ANS,310T48ANG"}],
		["6309-8340", {cry:"310W44GN"}],
		["6309-8350", {cry:"305W20GN00"}],
		["6309-8360", {cry:"315W12GN00"}],
		["6309-8370", {cry:"300W86GN"}],
		["6309-8380", {cry:"305W14GN"}],
		["6309-8390", {cry:"300W98GN00"}],
		["6309-8400", {cry:"310T18ANBS,310T48ANG"}],
		["6309-8410", {cry:"300W96GN00"}],
		["6309-8420", {cry:"310W44GN"}],
		["6309-8430", {cry:"300WA8GC"}],
		["6309-8480", {cry:"310T18ANS0,310T48ANG"}],
		["6309-8500", {cry:"310T18ANS0,310T48ANG"}],
		["6309-8580", {cry:"310T18ANS0,310T48ANG"}],
		["6309-8590", {cry:"310T18ANS0,310T48ANG"}],
		["6309-8600", {cry:"310T18ANS0,310T48ANG"}],
		["6309-8610", {cry:"310T18ANS0,310T48ANG"}],
		["6309-8620", {cry:"310T18ANS0,310T48ANG"}],
		["6309-8660", {cry:"310W46GN00"}],
		["6309-8670", {cry:"310T48ANG0"}],
		["6309-8670", {cry:"310T48ANS0"}],
		["6309-8680", {cry:"310T18ANS0,310T48ANG"}],
		["6309-8690", {cry:"300WD0GN00"}],
		["6309-8740", {cry:"300WC2GN00"}],
		["6309-8770", {cry:"300W96GN00"}],
		["6309-8790", {cry:"310T18ANS0,310T48ANG"}],
		["6309-8800", {cry:"300WD0GN00"}],
		["6309-8810", {cry:"300WDGN00"}],
		["6309-8820", {cry:"300WD0GN00"}],
		["6309-8830", {cry:"300WD0GN00"}],
		["6309-8840", {cry:"300WC8GN00"}],
		["6309-8850", {cry:"310T40ANG0,310T18ANS,310T48ANG"}],
		["6309-8860", {cry:"290W28GN00"}],
		["6309-8870", {cry:"290W28GN00"}],
		["6309-8880", {cry:"310T40ANG0,310T48ANG"}],
		["6309-8890", {cry:"310T18ANS0,310T40ANS,310T48ANG"}],
		["6309-8900", {cry:"305W20GN00"}],
		["6309-8910", {cry:"290W28GN00"}],
		["6309-8920", {cry:"290W28GN00"}],
		["6309-8930", {cry:"310T18ANS0,310T48ANG"}],
		["6309-8940", {cry:"310T18ANS0"}],
		["6309-8950", {cry:"295W26GN00"}],
		["6309-8960", {cry:"310T40ANB0"}],
		["6309-8970", {cry:"310T40ANB0"}],
		["6309-8980", {cry:"300WD0GN00"}],
		["6309-9000", {cry:"320W32GN00"}],
		["6309-9010", {cry:"320W32GN"}],
		["6309-9020", {cry:"300W96GN00"}],
		["6309-9030", {cry:"300W96GN00"}],
		["6309-9040", {cry:"310W52GN"}],
		["6309-9060", {cry:"305W20GN"}],
		["6309-9070", {cry:"320W32GN"}],
		["6309-8460", {cry:"310T48ANG"}],
		["6309-8530", {cry:"310T48ANG"}],
		["6309-8750", {cry:"310T48ANG"}],
		["6309-8760", {cry:"310T48ANG"}],
		["6309-8780", {cry:"310T48ANG"}],
		["6309-8470", {cry:"310W34GN"}],
	];
	SeikoModelDB.m6319= [
		["6319-5000", {cry:"SA0W06AN00"}],
		["6319-5010", {cry:"SA0W30AN"}],
		["6319-5020", {cry:"BA0W48AN"}],
		["6319-5030", {cry:"K00W26AC"}],
		["6319-5040", {cry:"BA0W58AN"}],
		["6319-5050", {cry:"BA0W84AN00"}],
		["6319-5060", {cry:"310W48GN"}],
		["6319-5070", {cry:"310W48GN"}],
		["6319-5080", {cry:"SA0W90GN"}],
		["6319-5090", {cry:"ES0W32GN00"}],
		["6319-5170", {cry:"SA7W08GN00"}],
		["6319-5180", {cry:"SA7W12GN00"}],
		["6319-5190", {cry:"SA1W06GN00"}],
		["6319-5200", {cry:"SA1W06GN00"}],
		["6319-5210", {cry:"SA1W08GN00"}],
		["6319-5220", {cry:"RE0W35AN00"}],
		["6319-5230", {cry:"SA7W30GN00"}],
		["6319-5240", {cry:"ES9W04LM01"}],
		["6319-5250", {cry:"ES9W06LM01"}],
		["6319-5260", {cry:"ES9W36LN01"}],
		["6319-5270", {cry:"ES9W69LM01"}],
		["6319-5280", {cry:"BA2W32LM01"}],
		["6319-6000", {cry:"320W10GN"}],
		["6319-6010", {cry:"320W32GN"}],
		["6319-6020", {cry:"ES0W30GN"}],
		["6319-6030", {cry:"ES0W32GN"}],
		["6319-6060", {cry:"285W22GN00"}],
		["6319-6080", {cry:"SA7W08GM02"}],
		["6319-6090", {cry:"315W12GN00"}],
		["6319-6100", {cry:"SA7W30GN00"}],
		["6319-6110", {cry:"BA1W82LM01"}],
		["6319-7000", {cry:"300W62GC00,300WA2GC0F"}],
		["6319-7010", {cry:"310W18GC"}],
		["6319-7030", {cry:"285W22GM02"}],
		["6319-7040", {cry:"280W10GN00"}],
		["6319-7050", {cry:"310W46GM01"}],
		["6319-7060", {cry:"280W10GN00"}],
		["6319-7080", {cry:"285W22GN00"}],
		["6319-7090", {cry:"285W28LM01"}],
		["6319-7100", {cry:"330W16GN"}],
		["6319-7110", {cry:"290W28GN00"}],
		["6319-8010", {cry:"310T18AN,310T48ANG"}],
		["6319-8020", {cry:"310T18ANS0,310T48ANG"}],
		["6319-8040", {cry:"310T40ANG0,310T18ANS,310T48ANG"}],
		["6319-8050", {cry:"310W32GC0F"}],
		["6319-8070", {cry:"320W28GN"}],
		["6319-8090", {cry:"310W34GN"}],
		["6319-8100", {cry:"310W34GN00"}],
		["6319-8120", {cry:"310T32ACS0"}],
		["6319-8130", {cry:"310W34GN00"}],
		["6319-8140", {cry:"300WA8GC0F"}],
		["6319-8150", {cry:"300W98GN00"}],
		["6319-8160", {cry:"300W76GN00"}],
		["6319-8170", {cry:"310W46GN00"}],
		["6319-8180", {cry:"290W28GN00"}],
		["6319-8190", {cry:"300WC2GN00"}],
		["6319-9000", {cry:"310W46NG"}],
		["6319-9010", {cry:"320W32GN00"}],
		["6319-9020", {cry:"310W46GN"}],
		["6319-8000", {cry:"310T48ANG"}],
		["6319-8060", {cry:"310T48ANG"}],
		["6319-8030", {cry:"330W16GN"}],
	];
	SeikoModelDB.m6347= [
		["6347-5000", {cry:"ES8W24LM01"}],
		["6347-5010", {cry:"ES8W26LM01"}],
		["6347-6000", {cry:"ES7W42GM03"}],
		["6347-6010", {cry:"ES7W44GM03"}],
	];
	SeikoModelDB.m6349= [
		["6349-5040", {cry:"ES3W16GN00"}],
		["6349-5050", {cry:"ES3W24GN00"}],
		["6349-5080", {cry:"BA1W82GN00"}],
		["6349-5090", {cry:"BA1W82GN00"}],
		["6349-5100", {cry:"SA4W68GM01"}],
		["6349-5130", {cry:"SA5W02GM01"}],
		["6349-5140", {cry:"SA5W16GM01"}],
		["6349-5150", {cry:"SA5W02GN00"}],
		["6349-5160", {cry:"BA1W50GN00"}],
		["6349-5170", {cry:"ES4W38GM01"}],
		["6349-5180", {cry:"SA5W32GM01"}],
		["6349-5190", {cry:"SA5W30GM01"}],
		["6349-5200", {cry:"ES4W60GM01"}],
		["6349-5210", {cry:"SA5W44GM01"}],
		["6349-5220", {cry:"BA1W88GM02"}],
		["6349-5230", {cry:"ES4W76GH02"}],
		["6349-5240", {cry:"ES4W98GM02"}],
		["6349-5250", {cry:"SA5W58GM02"}],
		["6349-5260", {cry:"ES5W04GM02"}],
		["6349-5270", {cry:"ES5W28GM01"}],
		["6349-5280", {cry:"ES5W28GM01"}],
		["6349-5290", {cry:"ES5W32GM01"}],
		["6349-5290", {cry:"ES5W32GM02"}],
		["6349-5300", {cry:"ES5W34GM01"}],
		["6349-5310", {cry:"ES3W24GM02"}],
		["6349-5320", {cry:"ES3W24GN00"}],
		["6349-5330", {cry:"SA6W16GM01"}],
		["6349-5340", {cry:"ES5W28GM05"}],
		["6349-5350", {cry:"SA6W40GM02"}],
		["6349-5360", {cry:"SA6W42GM02"}],
		["6349-5370", {cry:"ES6W24GM01"}],
		["6349-5380", {cry:"SA4W52GM01"}],
		["6349-5390", {cry:"ES6W26GN01"}],
		["6349-5400", {cry:"ES6W28GM01"}],
		["6349-5410", {cry:"BA1W92GM02"}],
		["6349-5420", {cry:"ES6W44GM01"}],
		["6349-5430", {cry:"ES6W48GM02"}],
		["6349-5440", {cry:"ES7W00GM01"}],
		["6349-5450", {cry:"ES6W30GH02"}],
		["6349-5460", {cry:"ES6W34GM02"}],
		["6349-5470", {cry:"ES6W36GM02"}],
		["6349-5480", {cry:"ES7W02GH01"}],
		["6349-5490", {cry:"ES7W18GM02"}],
		["6349-5500", {cry:"ES7W16GM02"}],
		["6349-5510", {cry:"ES8W22LM01"}],
		["6349-5520", {cry:"BA2W14LM01"}],
		["6349-5530", {cry:"BA2W16LM02"}],
		["6349-6000", {cry:"RE0W54GM02"}],
		["6349-6010", {cry:"290W28GN00"}],
		["6349-6020", {cry:"ES4W20GM02"}],
		["6349-6030", {cry:"ES0W30GM02"}],
		["6349-6040", {cry:"BA1W50GN00"}],
		["6349-6050", {cry:"250W08GN00"}],
		["6349-6060", {cry:"ES6W42GM01"}],
		["6349-6070", {cry:"ES6W32GH01"}],
		["6349-6080", {cry:"ES7W42GN00"}],
		["6349-6090", {cry:"ES7W24GN00"}],
		["6349-7000", {cry:"280W10GN00"}],
		["6349-8000", {cry:"310T18ANS,310T48ANG"}],
		["6349-8010", {cry:"290W28GN00"}],
		["6349-8020", {cry:"300WD0GN00"}],
	];
	SeikoModelDB.m6439= [
		["6439-5230", {cry:"ES4N48GN"}],
	];
	SeikoModelDB.m6509= [
		["6509-7000", {cry:"300WA2GC0F"}],
	];
	SeikoModelDB.m6530= [
		["6530-5030", {cry:"BA1N14GN"}],
		["6530-5200", {cry:"BA1N24GN"}],
		["6530-5389", {cry:"BA1N32GN"}],
		["6530-5380", {cry:"BA1N32GN"}],
		["6530-5400", {cry:"BA1N32GN"}],
		["6530-5560", {cry:"BA1N48GM01"}],
		["6530-5100", {cry:"ES7N90GN"}],
	];
	SeikoModelDB.m6532= [
		["6532-5230", {cry:"BA1N32GN"}],
		["6532-5110", {cry:"SA3N84GN"}],
	];
	SeikoModelDB.m6600= [
		["6600-8050", {cry:"310T48ANG"}],
		["6600-7020", {cry:"310W04AN"}],
	];
	SeikoModelDB.m6601= [
		["6601-8010", {cry:"310W04AN"}],
		["6601-7990", {cry:"341W02AN"}],
	];
	SeikoModelDB.m6602= [
		["6602-8040", {cry:"310T48ANG"}],
		["6602-8050", {cry:"310T48ANG"}],
		["6602-8070", {cry:"310T48ANG"}],
	];
	SeikoModelDB.m6619= [
		["6619-7080", {cry:"300T20ANS"}],
		["6619-8320", {cry:"320W10GN"}],
		["6619-8010", {cry:"335W01AN"}],
		["6619-8230", {cry:"335W02AN"}],
		["6619-7000", {cry:"335W10AN"}],
		["6619-7010", {cry:"335W10AN"}],
		["6619-7020", {cry:"335W10AN"}],
		["6619-7030", {cry:"335W10AN"}],
		["6619-3040", {cry:"335W10AN"}],
		["6619-7050", {cry:"335W10AN"}],
	];
	SeikoModelDB.m6922= [
		["6922-5010", {cry:"ES4W85LN"}],
	];
	SeikoModelDB.m6923= [
		["6923-8009", {cry:"295P05HN03"}],
		["6923-8080", {cry:"295P05HN03"}],
		["6923-8110", {cry:"295P05HN03"}],
	];
	SeikoModelDB.m6A32= [
		["6A32-00B0", {cry:"310P03LN03"}],
	];
	SeikoModelDB.m6F24= [
		["6F24-7010", {cry:"310W39HN"}],
	];
	SeikoModelDB.m6M91= [
		["6M91-9001", {cry:"300P01LN03"}],
		["6M91-9008", {cry:"300P01LN03"}],
	];
	SeikoModelDB.m7000= [
		["7000-8000", {cry:"310T18ANS,310T40ANG,310T49ANS"}],
		["7000-8010", {cry:"310T18ANS,310T40ANG,310T49ANS"}],
	];
	SeikoModelDB.m7001= [
		["7001-7000", {cry:"300T07ANS0"}],
		["7001-8000", {cry:"310T11AN"}],
	];
	SeikoModelDB.m7002= [
		["7002-7000", {cry:"320W23HN01"}],
		["7002-7010", {cry:"290P0ALN03,290P04HN"}],
		["7002-7020", {cry:"315P15HN02"}],
		["7002-7030", {cry:"315P15HN02"}],
		["7002-8000", {cry:"290P21LN02"}],
		["7002-8010", {cry:"305T05ANG4"}],
		["7002-8030", {cry:"290P02LN03"}],
		["7002-8040", {cry:"290P02LN03"}],
		["7002-8050", {cry:"290P02LN03"}],
	];
	SeikoModelDB.m7005= [
		["7005-2000", {cry:"340N05AN"}],
		["7005-5000", {cry:"RE0W01AN00"}],
		["7005-5010", {cry:"SA0N21AN,SA0W21AN"}],
		["7005-6000", {cry:"320T07ANS0"}],
		["7005-6010", {cry:"320T07ANS0"}],
		["7005-6020", {cry:"320T23S0"}],
		["7005-7000", {cry:"300T15ANS0"}],
		["7005-7010", {cry:"300T07ANS0"}],
		["7005-7020", {cry:"300T07ANS"}],
		["7005-7030", {cry:"310W11GN00"}],
		["7005-7040", {cry:"300T07ANS"}],
		["7005-7050", {cry:"300T15S0"}],
		["7005-7060", {cry:"300T0G0"}],
		["7005-7070", {cry:"300T07S0"}],
		["7005-7080", {cry:"300T07S0"}],
		["7005-7090", {cry:"300T07S0"}],
		["7005-7100", {cry:"310W13GN00"}],
		["7005-7110", {cry:"300T07S0"}],
		["7005-7130", {cry:"300T07S0"}],
		["7005-8000", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7005-8010", {cry:"310T19ANS0"}],
		["7005-8020", {cry:"310T11ANS0"}],
		["7005-8030", {cry:"310T11ANS0"}],
		["7005-8040", {cry:"310T11ANS"}],
		["7005-8050", {cry:"310T19S0,310T18ANS,310T40ANG,310T49ANS"}],
		["7005-8060", {cry:"340T08S0"}],
		["7005-8070", {cry:"340T08S0"}],
		["7005-8080", {cry:"340T08ANS"}],
		["7005-8090", {cry:"340T08ANS0"}],
		["7005-8150", {cry:"320T15S0"}],
		["7005-8160", {cry:"310T11S0"}],
		["7005-8190", {cry:"310T43ANS0"}],
		["7005-8200", {cry:"310T49S0,310T18ANS,310T40ANG,310T49ANS"}],
		["7005-8210", {cry:"310T49S0,310T18ANS,310T40ANG,310T49ANS"}],
	];
	SeikoModelDB.m7006= [
		["7006-5000", {cry:"SA0W21AN"}],
		["7006-5010", {cry:"SA0W31AN00"}],
		["7006-5020", {cry:"RE0M21AN00"}],
		["7006-5040", {cry:"ES0W09AN00"}],
		["7006-5050", {cry:"SA0W21AN00"}],
		["7006-5060", {cry:"SA0M67AN00"}],
		["7006-5070", {cry:"SA0W77AN00"}],
		["7006-5090", {cry:"SA0W67AN"}],
		["7006-6000", {cry:"320T17AN"}],
		["7006-6010", {cry:"320T19AC"}],
		["7006-6020", {cry:"320T21ANS0"}],
		["7006-6030", {cry:"335T01ANS0"}],
		["7006-6040", {cry:"320T17ANS0"}],
		["7006-7000", {cry:"300T10SO,300T20ANG"}],
		["7006-7010", {cry:"300T10ANG,300T20ANG"}],
		["7006-7020", {cry:"300T10S0,300T20ANG"}],
		["7006-7030", {cry:"300T10ANG,300T20ANS,310W11GN"}],
		["7006-7070", {cry:"300T10ANS0,300T20ANG,300T28ANS"}],
		["7006-7080", {cry:"300T23ANS0"}],
		["7006-7090", {cry:"300T23ANS0"}],
		["7006-7100", {cry:"EJOO6OBO1"}],
		["7006-7110", {cry:"300T15ANS0"}],
		["7006-7130", {cry:"290V063GNGO"}],
		["7006-7150", {cry:"310W13GN00"}],
		["7006-7160", {cry:"310W11GN00"}],
		["7006-7180", {cry:"300T23ANS0"}],
		["7006-7190", {cry:"300T15ANS0"}],
		["7006-7200", {cry:"300V29GCSF"}],
		["7006-7210", {cry:"300W43GN00"}],
		["7006-7220", {cry:"310W13GN00"}],
		["7006-8000", {cry:"310T16ANS0"}],
		["7006-8020", {cry:"320T13S0"}],
		["7006-8030", {cry:"310T19ANS0"}],
		["7006-8040", {cry:"310T37S0"}],
		["7006-8050", {cry:"310T37ANS0,310T18ANS,310T40ANG,310T49ANS"}],
		["7006-8060", {cry:"310T37AN"}],
		["7006-8070", {cry:"310T37ANS0"}],
		["7006-8080", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7006-8090", {cry:"310T37ANS0"}],
		["7006-8100", {cry:"310T37ANS0,310T18ANS,310T40ANG,310T49ANS"}],
		["7006-8110", {cry:"310T37S0"}],
		["7006-8130", {cry:"310T37S0"}],
		["7006-5080", {cry:"SA0W21AN"}],
	];
	SeikoModelDB.m7009= [
		["7009-2000", {cry:"SA4W91LV01"}],
		["7009-2010", {cry:"SA4W91LV03"}],
		["7009-2020", {cry:"ES2W84GN00"}],
		["7009-2030", {cry:"SA3W92GN00"}],
		["7009-2040", {cry:"SA3W92GN00"}],
		["7009-2050", {cry:"SA1W06GN00"}],
		["7009-2060", {cry:"ES8W46LM01"}],
		["7009-2070", {cry:"ES8W48LM01"}],
		["7009-2080", {cry:"BA3W19LM01"}],
		["7009-2090", {cry:"SA3W92GN00"}],
		["7009-2100", {cry:"SA3W92GN00"}],
		["7009-3000", {cry:"290W49LN00"}],
		["7009-3010", {cry:"290W49LN00"}],
		["7009-3020", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7009-3020", {cry:"310T49ANS0"}],
		["7009-3030", {cry:"310T49ANZ0,310T18ANS,310T40ANG"}],
		["7009-3040", {cry:"310W17LN00"}],
		["7009-3050", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7009-3060", {cry:"295W43LN00"}],
		["7009-3070", {cry:"310W17LN00"}],
		["7009-3080", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7009-3090", {cry:"310W31LN00"}],
		["7009-3100", {cry:"290W49LN00"}],
		["7009-3110", {cry:"295W43LN00"}],
		["7009-3120", {cry:"300WC2GN00"}],
		["7009-3130", {cry:"305W20GN00"}],
		["7009-3140", {cry:"310T40ANB0,310T48ANG"}],
		["7009-3150", {cry:"310T40ANB0,310T48ANG"}],
		["7009-3160", {cry:"305W17LN01"}],
		["7009-3170", {cry:"290W87LN01"}],
		["7009-3180", {cry:"310W17LN00"}],
		["7009-3200", {cry:"290P02LN03"}],
		["7009-3210", {cry:"310W17L20B"}],
		["7009-3230", {cry:"305P01LN02"}],
		["7009-3240", {cry:"295P07LN03"}],
		["7009-3250", {cry:"280P03LN03"}],
		["7009-3260", {cry:"290P03LN03"}],
		["7009-4000", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7009-4010", {cry:"310T49ANS,310T18ANS,310T40ANG"}],
		["7009-4020", {cry:"310T49ANS,310T18ANS,310T40ANG"}],
		["7009-4030", {cry:"310T49ANS,310T18ANS,310T40ANG"}],
		["7009-4040", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7009-5000", {cry:"SA0W95AN00"}],
		["7009-5010", {cry:"SA1W17AN00"}],
		["7009-5020", {cry:"SA0W67AN00"}],
		["7009-5030", {cry:"SA1W17AN00"}],
		["7009-5040", {cry:"ES0W37AN00"}],
		["7009-5050", {cry:"SA1W41AN00"}],
		["7009-5060", {cry:"SA0W97AN00"}],
		["7009-5070", {cry:"SA1W03AN00"}],
		["7009-5080", {cry:"SA0W93AN00"}],
		["7009-5100", {cry:"SA1W17AN00"}],
		["7009-5110", {cry:"SA1W77HN00"}],
		["7009-5120", {cry:"SA2W03AN00"}],
		["7009-5130", {cry:"290W27LN00"}],
		["7009-5140", {cry:"SA2W15LE40"}],
		["7009-5150", {cry:"SA2W17LE10"}],
		["7009-5160", {cry:"SA2W19LE40"}],
		["7009-5170", {cry:"290W27LN00"}],
		["7009-5180", {cry:"SA2W41LN00"}],
		["7009-5190", {cry:"SA2W43LN00"}],
		["7009-5200", {cry:"SA2W43LZ40"}],
		["7009-5210", {cry:"ES0W99LN00"}],
		["7009-5220", {cry:"SA0W93AN00"}],
		["7009-5230", {cry:"ES0W37AN00"}],
		["7009-5240", {cry:"300W53LN00"}],
		["7009-5250", {cry:"300W53LN00"}],
		["7009-5260", {cry:"ES0W65AN00"}],
		["7009-5270", {cry:"BA0W33AN00"}],
		["7009-5280", {cry:"SA9NX5LN00"}],
		["7009-5290", {cry:"SA2W55LN00"}],
		["7009-5300", {cry:"ES1W33LN00"}],
		["7009-5310", {cry:"ES1W93LN00"}],
		["7009-5320", {cry:"SA2W67LM40"}],
		["7009-5330", {cry:"SA2W69LM40"}],
		["7009-5340", {cry:"EW1W95LZ40"}],
		["7009-5350", {cry:"ES1W97LN00"}],
		["7009-5360", {cry:"ES2W89LN00"}],
		["7009-5370", {cry:"EW2W89LM10"}],
		["7009-5380", {cry:"EW3W57LM10"}],
		["7009-5390", {cry:"ES3W61LN00"}],
		["7009-5400", {cry:"ES3W57LN00"}],
		["7009-5410", {cry:"REOW41LN00"}],
		["7009-5420", {cry:"ES3W65LM10"}],
		["7009-5430", {cry:"K00W37LN00"}],
		["7009-5440", {cry:"ES3W71LZ40"}],
		["7009-5450", {cry:"EW3W69LZ10"}],
		["7009-5460", {cry:"EW4W75LN00"}],
		["7009-5470", {cry:"ES4W73LM40"}],
		["7009-5480", {cry:"ES5W95LN00"}],
		["7009-5490", {cry:"ES5W57LN00"}],
		["7009-5500", {cry:"ES5W87LM40"}],
		["7009-5510", {cry:"ES5W99LM00"}],
		["7009-5520", {cry:"EW5W93LZ10"}],
		["7009-5530", {cry:"ES5W65LN00"}],
		["7009-5530", {cry:"EW5W65LN00"}],
		["7009-5540", {cry:"ES5W89LM50"}],
		["7009-5550", {cry:"ES5W85LM50"}],
		["7009-5560", {cry:"ES6W01LM40"}],
		["7009-5570", {cry:"ES6W05LM10"}],
		["7009-5580", {cry:"SQ0W05LM50"}],
		["7009-5590", {cry:"ES6W55LN00"}],
		["7009-5600", {cry:"ES6W35LN00"}],
		["7009-5610", {cry:"ES6W49LE40"}],
		["7009-5620", {cry:"ES6W69LM40"}],
		["7009-5630", {cry:"RE0W67LN00"}],
		["7009-5640", {cry:"RE0W67LN00"}],
		["7009-5650", {cry:"BA1W85LE10"}],
		["7009-5660", {cry:"RE0E57LN00"}],
		["7009-5670", {cry:"RE0W59LE10"}],
		["7009-5680", {cry:"ES6W79LN00"}],
		["7009-5690", {cry:"ES6W79LM50"}],
		["7009-5700", {cry:"ES6W81LN00"}],
		["7009-5710", {cry:"ES6W81LN00"}],
		["7009-5720", {cry:"BA1W97LN00"}],
		["7009-5750", {cry:"ES6W01LM10"}],
		["7009-5760", {cry:"BA2W25LN00,310W17LN"}],
		["7009-5770", {cry:"BA2W25LE10"}],
		["7009-5780", {cry:"SA3W93LE40"}],
		["7009-5790", {cry:"SA3W95LE40"}],
		["7009-5800", {cry:"ES8W97LM20"}],
		["7009-5810", {cry:"ES8W97LZ10"}],
		["7009-5820", {cry:"ESAW39LN01"}],
		["7009-5830", {cry:"ESBW05LN01"}],
		["7009-5840", {cry:"ES8W97LN00"}],
		["7009-5860", {cry:"SA4W91LN01"}],
		["7009-5870", {cry:"SA5W01LM01"}],
		["7009-5880", {cry:"SA5W03LM02"}],
		["7009-5890", {cry:"RE1W25LV02"}],
		["7009-5900", {cry:"ESCW13LN01"}],
		["7009-5910", {cry:"ESCW13LN01"}],
		["7009-5920", {cry:"SA4W85LM01"}],
		["7009-5930", {cry:"SA4W87LM01"}],
		["7009-5940", {cry:"ESDW09LV01"}],
		["7009-5950", {cry:"ESDW11LV02"}],
		["7009-5960", {cry:"SA5W21LN01"}],
		["7009-5970", {cry:"SA5W21LM01"}],
		["7009-5980", {cry:"ESDW33LM01"}],
		["7009-5990", {cry:"ESDW35LM01"}],
		["7009-6000", {cry:"275W27LN01"}],
		["7009-6010", {cry:"275W27LM01"}],
		["7009-6020", {cry:"295T03ANS0"}],
		["7009-6030", {cry:"270P01LN03"}],
		["7009-6040", {cry:"275W27LN01"}],
		["7009-7000", {cry:"300T19ANG0,300T20ANG"}],
		["7009-7010", {cry:"300W43GN00"}],
		["7009-7020", {cry:"285W61LN00"}],
		["7009-7030", {cry:"290W28GN00"}],
		["7009-7040", {cry:"280P01LN03"}],
		["7009-7050", {cry:"280P01LN03"}],
		["7009-7060", {cry:"280P03LN03"}],
		["7009-7070", {cry:"280P01LN03"}],
		["7009-8000", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7009-8010", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7009-8020", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7009-8020", {cry:"310T49ANS0"}],
		["7009-8030", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7009-8040", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7009-8050", {cry:"310T49AN,310T18ANS,310T40ANG"}],
		["7009-8060", {cry:"310T49AN,310T18ANS,310T40ANG"}],
		["7009-8070", {cry:"310T49AN,310T18ANS,310T40ANG"}],
		["7009-8080", {cry:"320W19GN00"}],
		["7009-8090", {cry:"310T49AN,310T18ANS,310T40ANG"}],
		["7009-8100", {cry:"310T51ACSG"}],
		["7009-8110", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7009-8120", {cry:"310T40ANG0,310T48ANG"}],
		["7009-8130", {cry:"310T49AN,310T18ANS,310T40ANG"}],
		["7009-8140", {cry:"320W19GN00"}],
		["7009-8150", {cry:"310T49AN,310T18ANS,310T40ANG"}],
		["7009-8170", {cry:"310T51ACSG"}],
		["7009-8180", {cry:"310T49AN,310T18ANS,310T40ANG"}],
		["7009-8190", {cry:"310T51ACSG"}],
		["7009-8200", {cry:"310T49AN,310T18ANS,310T40ANG"}],
		["7009-8210", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7009-8220", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7009-8230", {cry:"310T51ACSG"}],
		["7009-8240", {cry:"310T49AN,310T18ANS,310T40ANG"}],
		["7009-8250", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7009-8260", {cry:"310T51ACSG"}],
		["7009-8270", {cry:"310T49ANG0,310T18ANS,310T40ANG"}],
		["7009-8280", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7009-8290", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7009-8300", {cry:"310T51ACSG"}],
		["7009-8310", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7009-8310", {cry:"310T49ANS0"}],
		["7009-8320", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7009-8330", {cry:"310W17LN00"}],
		["7009-8340", {cry:"310W17LN00"}],
		["7009-8350", {cry:"310W19LN00"}],
		["7009-8370", {cry:"310W17LN00"}],
		["7009-8380", {cry:"320W19LN00"}],
		["7009-8390", {cry:"310W25LN00"}],
		["7009-8400", {cry:"310T49AN,310T18ANS,310T40ANG"}],
		["7009-8410", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7009-8420", {cry:"310T49AN,310T18ANS,310T40ANG"}],
		["7009-8430", {cry:"320W19LN00"}],
		["7009-8440", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7009-8450", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7009-8460", {cry:"310T49ANG0,310T18ANS,310T40ANG"}],
		["7009-8470", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7009-8480", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7009-8490", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7009-8500", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7009-8510", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7009-8520", {cry:"310T51ACSG"}],
		["7009-8530", {cry:"310W17LN00"}],
		["7009-8540", {cry:"310W17LN00"}],
		["7009-8550", {cry:"320W19LN00"}],
		["7009-8560", {cry:"290W29LN00"}],
		["7009-8570", {cry:"310W23LN00"}],
		["7009-8580", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7009-8590", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7009-8600", {cry:"300W79LN00,300P03LN03"}],
		["7009-8610", {cry:"290W29LN00"}],
		["7009-8630", {cry:"300W81LN00,300P03LN03"}],
		["7009-8640", {cry:"300W81LZ10"}],
		["7009-8650", {cry:"310W17LN00A"}],
		["7009-8660", {cry:"310W17LN00"}],
		["7009-8670", {cry:"310T49ANG0,310T18ANS,310T40ANG"}],
		["7009-8670", {cry:"310T49ANG0"}],
		["7009-8680", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7009-8690", {cry:"295W43LN00"}],
		["7009-8700", {cry:"300W83LM10"}],
		["7009-8710", {cry:"295W43LN00"}],
		["7009-8720", {cry:"295W43LN00"}],
		["7009-8730", {cry:"295W43LZ40"}],
		["7009-8740", {cry:"310W17LN00"}],
		["7009-8750", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7009-8760", {cry:"310W17LN00"}],
		["7009-8770", {cry:"295W43LN00"}],
		["7009-8790", {cry:"295W43LN00"}],
		["7009-8810", {cry:"310T57ANZ0"}],
		["7009-8820", {cry:"310T57ANS0"}],
		["7009-8830", {cry:"295W43LN00"}],
		["7009-8850", {cry:"295W43LN00"}],
		["7009-8860", {cry:"315W09LN00"}],
		["7009-8870", {cry:"295W43LN00"}],
		["7009-8880", {cry:"290W41LN00"}],
		["7009-8890", {cry:"310T51ACSG"}],
		["7009-8900", {cry:"290W43LN00"}],
		["7009-8920", {cry:"295W43LN00"}],
		["7009-8930", {cry:"295W43LN00"}],
		["7009-8940", {cry:"295W43LN00"}],
		["7009-8950", {cry:"310W17LN00"}],
		["7009-8960", {cry:"295W43LN00"}],
		["7009-8970", {cry:"295W43LN00"}],
		["7009-8980", {cry:"310T48ANS0,310T18ANS,310T40ANG,310T49ANS"}],
		["7009-8980", {cry:"310T49ANS0"}],
		["7009-8990", {cry:"310W31LN00"}],
		["7009-9000", {cry:"310W21GN00"}],
	];
	SeikoModelDB.m7015= [
		["7015-6010", {cry:"320W17GN00"}],
		["7015-8000", {cry:"310V01GAS0"}],
		["7015-7010", {cry:"330W16GN"}],
		["7015-7020", {cry:"330W16GN"}],
	];
	SeikoModelDB.m7016= [
		["7016-5000", {cry:"SA0W55AN00"}],
		["7016-5010", {cry:"SA0V11GNS0"}],
		["7016-5020", {cry:"SA0W75AN00"}],
		["7016-8000", {cry:"310T41ANSO"}],
	];
	SeikoModelDB.m7017= [
		["7017-6000", {cry:"330W16GN0"}],
		["7017-6010", {cry:"330W16GN0"}],
		["7017-6030", {cry:"330W16GN0"}],
		["7017-6040", {cry:"330W16GN0"}],
		["7017-6050", {cry:"330W16GN0"}],
		["7017-8000", {cry:"320W10GN00"}],
		["7017-6020", {cry:"330W16GN"}],
	];
	SeikoModelDB.m7018= [
		["7018-5000", {cry:"SA0V05GN"}],
		["7018-6000", {cry:"299W01ANH0"}],
		["7018-7000", {cry:"300V11GN50"}],
		["7018-8000", {cry:"310T35ANS0"}],
	];
	SeikoModelDB.m7019= [
		["7019-5000", {cry:"SA0W31AN"}],
		["7019-5040", {cry:"SA0W21AN00"}],
		["7019-5050", {cry:"300W53GN00"}],
		["7019-5080", {cry:"300W53GN00"}],
		["7019-5090", {cry:"SA0W93AN"}],
		["7019-5100", {cry:"ESOW37AN00,ES0W37AN"}],
		["7019-5110", {cry:"SA1W35AN00,SA1W35GN"}],
		["7019-5120", {cry:"SA1W35AN00,ES0W37AN"}],
		["7019-5130", {cry:"SA1W57AN00"}],
		["7019-5140", {cry:"310W23GN00,BA0W33AN"}],
		["7019-5160", {cry:"ES0W65AN00"}],
		["7019-5170", {cry:"RE0W89LE40"}],
		["7019-5180", {cry:"RE0W89LE10"}],
		["7019-5190", {cry:"ES8W59LZ10"}],
		["7019-5200", {cry:"ES8W59LZ10"}],
		["7019-5210", {cry:"SQ0W07LZ40"}],
		["7019-5220", {cry:"SQ0W09LZ40"}],
		["7019-5230", {cry:"ES8W51LE10"}],
		["7019-5240", {cry:"ES8W53LE10"}],
		["7019-5250", {cry:"ES8W55LN00"}],
		["7019-5260", {cry:"ES8W55LE40"}],
		["7019-5270", {cry:"ES8W55LN00"}],
		["7019-5280", {cry:"ES9W13LE10"}],
		["7019-5290", {cry:"ES9W05LN00"}],
		["7019-5300", {cry:"ES9W05LE10"}],
		["7019-5310", {cry:"ES9W07LE10"}],
		["7019-5310", {cry:"ES9W07LE40"}],
		["7019-5320", {cry:"BA2W49LV02"}],
		["7019-5330", {cry:"BA2W51LV01"}],
		["7019-5340", {cry:"ES9W95LN01"}],
		["7019-5350", {cry:"ES9W95LV02"}],
		["7019-5370", {cry:"ESAW35LN01"}],
		["7019-5380", {cry:"ESAW35LV01"}],
		["7019-5390", {cry:"ESAW37LN01"}],
		["7019-5400", {cry:"ESBW03LN01"}],
		["7019-5410", {cry:"ESBW03LN01"}],
		["7019-5420", {cry:"ESBW13LN01"}],
		["7019-5430", {cry:"ESBW13LM01"}],
		["7019-5440", {cry:"ESBW15LM01"}],
		["7019-5450", {cry:"SA4W89LM02"}],
		["7019-6000", {cry:"330W16GN0"}],
		["7019-6010", {cry:"330W16GN0"}],
		["7019-6020", {cry:"330W16GN0"}],
		["7019-6030", {cry:"330W16GN0"}],
		["7019-6040", {cry:"330W16GN0"}],
		["7019-6050", {cry:"335W03GN00"}],
		["7019-6060", {cry:"320T21ANS0"}],
		["7019-6070", {cry:"335T01ANS0"}],
		["7019-6080", {cry:"313SB17NG"}],
		["7019-6090", {cry:"270P01LN03"}],
		["7019-6100", {cry:"275W27LN01"}],
		["7019-7000", {cry:"300T15ANS0,300T25AN"}],
		["7019-7010", {cry:"310W11GN00"}],
		["7019-7020", {cry:"310W11GN00"}],
		["7019-7030", {cry:"310W11GN00"}],
		["7019-7040", {cry:"310W11GN00"}],
		["7019-7050", {cry:"310W11GN00"}],
		["7019-7060", {cry:"310W13GN00"}],
		["7019-7070", {cry:"310W13GN00"}],
		["7019-7080", {cry:"300T15ANS0"}],
		["7019-7100", {cry:"300T15ANS0"}],
		["7019-7110", {cry:"300T15AN"}],
		["7019-7120", {cry:"300T15AN"}],
		["7019-7130", {cry:"300T15AN"}],
		["7019-7150", {cry:"300V17GH2F"}],
		["7019-7160", {cry:"300V19GH2F"}],
		["7019-7170", {cry:"290V03GM20"}],
		["7019-7180", {cry:"290V03GN,290V03GM"}],
		["7019-7190", {cry:"300T15AN"}],
		["7019-7200", {cry:"300T15AN"}],
		["7019-7210", {cry:"300V21GCSF"}],
		["7019-7220", {cry:"300V19GH4F"}],
		["7019-7230", {cry:"300V23GCGF"}],
		["7019-7240", {cry:"300V27GCSF"}],
		["7019-7250", {cry:"300V25GCSF"}],
		["7019-7260", {cry:"300V29GCSF"}],
		["7019-7270", {cry:"300V31GCSF"}],
		["7019-7280", {cry:"300V29GH2F"}],
		["7019-7290", {cry:"300V33GCSF"}],
		["7019-7300", {cry:"300V35GCGF"}],
		["7019-7310", {cry:"300W33GC0F"}],
		["7019-7320", {cry:"300W37GC0F"}],
		["7019-7330", {cry:"300W35GC0F"}],
		["7019-7340", {cry:"300W41GC0F"}],
		["7019-7350", {cry:"300W41GC0F"}],
		["7019-7360", {cry:"300W51GC0F"}],
		["7019-7370", {cry:"300W43GN00,300W43GC"}],
		["7019-7380", {cry:"300T15ANS0"}],
		["7019-7390", {cry:"300T15ANS0"}],
		["7019-7400", {cry:"300W41GC0F"}],
		["7019-7410", {cry:"300W53GN00"}],
		["7019-7420", {cry:"300W53GN00"}],
		["7019-7430", {cry:"310W13GN00"}],
		["7019-7440", {cry:"280P07LN03"}],
		["7019-8000", {cry:"310T49ANS0,310T18ANS,310T23AN,310T40ANG"}],
		["7019-8010", {cry:"310T49ANS0,310T18ANS,310T23AN,310T40ANG"}],
		["7019-8020", {cry:"320W10GN00"}],
		["7019-8030", {cry:"320W10GN00"}],
		["7019-8050", {cry:"320T13ANG0"}],
		["7019-8060", {cry:"310T43S0,310T43AN"}],
		["7019-8070", {cry:"310T49AN,310T18ANS,310T40ANG"}],
		["7019-8080", {cry:"310T07SO,310T07AN"}],
		["7019-8090", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7019-8100", {cry:"310T49S0,310T18ANS,310T40ANG,310T49ANS"}],
		["7019-8120", {cry:"290G19GNS0"}],
		["7019-8130", {cry:"310W17GN00"}],
		["7019-8140", {cry:"310W25LN00"}],
		["7019-8150", {cry:"295W55LN00"}],
		["7019-8160", {cry:"310T37ANS0"}],
		["7019-8170", {cry:"290W45LN00"}],
		["7019-8180", {cry:"290W49LN00"}],
		["7019-8190", {cry:"295W43LN00"}],
		["7019-8200", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7019-8210", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7019-8220", {cry:"290W45LN00"}],
		["7019-8230", {cry:"290W45LN00"}],
		["7019-8250", {cry:"310T40ANB0"}],
		["7019-8260", {cry:"290P01LN03"}],
		["7019-8270", {cry:"270P02LN03"}],
		["7019-8280", {cry:"305W17LM02"}],
		["7019-8290", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7019-8300", {cry:"290W49LN00"}],
		["7019-5010", {cry:"SA0W21AN"}],
	];
	SeikoModelDB.m7025= [
		["7025-5000", {cry:"SA1W05AN00"}],
		["7025-5010", {cry:"SA1W03AN00"}],
		["7025-8000", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7025-8010", {cry:"310T49ANSO,310T18ANS,310T40ANG"}],
		["7025-8020", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7025-8030", {cry:"310T51ACSG"}],
		["7025-8040", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7025-8050", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7025-8060", {cry:"310T11ANS0"}],
		["7025-8070", {cry:"310T49S0,310T18ANS,310T40ANG,310T49ANS"}],
		["7025-8080", {cry:"310T49S0,310T18ANS,310T40ANG,310T49ANS"}],
		["7025-8090", {cry:"310T19ANS0,310T18ANS,310T40ANG,310T49ANS"}],
		["7025-8100", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7025-8110", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7025-8120", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7025-8130", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7025-8140", {cry:"320W19LN00"}],
		["7025-8150", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7025-8160", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
		["7025-8170", {cry:"310T49ANS0,310T18ANS,310T40ANG"}],
	];
	SeikoModelDB.m7039= [
		["7039-7000", {cry:"295W09GHIF"}],
		["7039-7010", {cry:"300W43GN00"}],
		["7039-7020", {cry:"300W43GN00"}],
	];
	SeikoModelDB.m7119= [
		["7119-5150", {cry:"310W23GN"}],
		["7119-8140", {cry:"310W25LN"}],
		["7119-5160", {cry:"ES0W65AN"}],
		["7119-5070", {cry:"RE0W25AN"}],
	];
	SeikoModelDB.m7121= [
		["7121-7000", {cry:"285W49KA"}],
		["7121-7010", {cry:"285W57HA"}],
		["7121-7020", {cry:"285W57HA"}],
		["7121-7030", {cry:"285W57HA"}],
		["7121-8000", {cry:"290W31HN"}],
		["7121-8010", {cry:"295W39KA"}],
		["7121-8020", {cry:"295W39KA"}],
	];
	SeikoModelDB.m7122= [
		["7122-7000", {cry:"280N25KN"}],
		["7122-7040", {cry:"280N25KN"}],
		["7122-7010", {cry:"285N05KN"}],
		["7122-7030", {cry:"285N05KN"}],
		["7122-7020", {cry:"285W41HN"}],
		["7122-8040", {cry:"290N31AN"}],
		["7122-8000", {cry:"295W25HN"}],
		["7122-8050", {cry:"295W41LN"}],
		["7122-8010", {cry:"310T57AA"}],
		["7122-8030", {cry:"310T57AA"}],
		["7122-8020", {cry:"310W27LN"}],
		["7122-5010", {cry:"ES7N11KN"}],
		["7122-5020", {cry:"ES8N93HN"}],
		["7122-5030", {cry:"ES9N43LN"}],
		["7122-5000", {cry:"SA9N83KN"}],
		["7122-5100", {cry:"SA9N85KN"}],
	];
	SeikoModelDB.m7123= [
		["7123-7130", {cry:"280N25KN"}],
		["7123-7100", {cry:"285N05KN"}],
		["7123-7120", {cry:"285N05KN"}],
		["7123-7000", {cry:"285W41HN"}],
		["7123-7070", {cry:"285W41HN"}],
		["7123-7110", {cry:"285W41HN"}],
		["7123-7010", {cry:"285W43HN"}],
		["7123-7020", {cry:"285W45HN"}],
		["7123-7040", {cry:"285W45HN"}],
		["7123-7030", {cry:"285W45LN"}],
		["7123-7050", {cry:"285W47HN"}],
		["7123-7060", {cry:"285W47HN"}],
		["7123-7080", {cry:"285W47HN,285W55LN"}],
		["7123-7180", {cry:"285W57HA"}],
		["7123-7190", {cry:"285W57HA"}],
		["7123-7160", {cry:"285W61LN"}],
		["7123-7170", {cry:"285W65LN"}],
		["7123-8410", {cry:"290N31AN"}],
		["7123-8320", {cry:"295P05HN03,295W41LN"}],
		["7123-8339", {cry:"295P05HN03"}],
		["7123-8460", {cry:"295P05HN03,295W41LN"}],
		["7123-8540", {cry:"295P05HN03,295W41LN"}],
		["7123-8550", {cry:"295P05HN03,295W41LN"}],
		["7123-8470", {cry:"295W21LN"}],
		["7123-8480", {cry:"295W21LN"}],
		["7123-8090", {cry:"295W25HN"}],
		["7123-8110", {cry:"295W25HN"}],
		["7123-8020", {cry:"295W27HC"}],
		["7123-8000", {cry:"295W28HN"}],
		["7123-8010", {cry:"295W29HN"}],
		["7123-8030", {cry:"295W29HN"}],
		["7123-8100", {cry:"295W29HN"}],
		["7123-8120", {cry:"295W29HN"}],
		["7123-8040", {cry:"295W29LN"}],
		["7123-8050", {cry:"295W29LN"}],
		["7123-8060", {cry:"295W31HA"}],
		["7123-8200", {cry:"295W31HA"}],
		["7123-8210", {cry:"295W31HA"}],
		["7123-8220", {cry:"295W31HA"}],
		["7123-8230", {cry:"295W31HA"}],
		["7123-8240", {cry:"295W31HA"}],
		["7123-8370", {cry:"295W31HA"}],
		["7123-8380", {cry:"295W31HA"}],
		["7123-8490", {cry:"295W31HA"}],
		["7123-8070", {cry:"295W33HC"}],
		["7123-8140", {cry:"295W35HN"}],
		["7123-8150", {cry:"295W35HN"}],
		["7123-8160", {cry:"295W35HN"}],
		["7123-8170", {cry:"295W35HN"}],
		["7123-8180", {cry:"295W35HN"}],
		["7123-8260", {cry:"295W35HN"}],
		["7123-8270", {cry:"295W35HN"}],
		["7123-8280", {cry:"295W35HN"}],
		["7123-8330", {cry:"295W41LN"}],
		["7123-8350", {cry:"295W41LN"}],
		["7123-8560", {cry:"295W41LN"}],
		["7123-8520", {cry:"295W43LN"}],
		["7123-8340", {cry:"300W75LN"}],
		["7123-8360", {cry:"300W75LN"}],
		["7123-8390", {cry:"300W77HC"}],
		["7123-9000", {cry:"305W09HN"}],
		["7123-9010", {cry:"305W09HN"}],
		["7123-9020", {cry:"305W09HN"}],
		["7123-8290", {cry:"310T57AA"}],
		["7123-8300", {cry:"310T57AA"}],
		["7123-8310", {cry:"310T57AA"}],
		["7123-8420", {cry:"310T57AA"}],
		["7123-8430", {cry:"310T57AA"}],
		["7123-8440", {cry:"310T57AA"}],
		["7123-8500", {cry:"310T57AA"}],
		["7123-8510", {cry:"310T57AA"}],
		["7123-8530", {cry:"310T57AA"}],
		["7123-8570", {cry:"310T57AA"}],
		["7123-8400", {cry:"310W27LN"}],
		["7123-5000", {cry:"ES0W53HN"}],
		["7123-5140", {cry:"ES0W89LN"}],
		["7123-5160", {cry:"ES1W03LN"}],
		["7123-5190", {cry:"ES1W25LN"}],
		["7123-5210", {cry:"ES1W35AN"}],
		["7123-5250", {cry:"ES2W17LN"}],
		["7123-5260", {cry:"ES2W55LZ"}],
		["7123-5290", {cry:"ES3W41LN"}],
		["7123-5280", {cry:"ES3W45LM"}],
		["7123-5300", {cry:"ES3W53LN"}],
		["7123-5310", {cry:"ES3W53LN"}],
		["7123-5532", {cry:"ES3W59LN"}],
		["7123-5340", {cry:"ES3W83LN"}],
		["7123-5350", {cry:"ES3W85LN"}],
		["7123-5150", {cry:"ES4N95LN"}],
		["7123-5200", {cry:"ES5N69HN"}],
		["7123-5230", {cry:"ES7N41KN"}],
		["7123-5240", {cry:"ES8N93HN"}],
		["7123-5010", {cry:"SA1W83HN"}],
		["7123-5030", {cry:"SA1W87HN"}],
		["7123-5040", {cry:"SA1W95HN"}],
		["7123-5060", {cry:"SA2W09HN"}],
		["7123-5050", {cry:"SA2W11HN"}],
		["7123-5270", {cry:"SA2W11HZ"}],
		["7123-5070", {cry:"SA2W27HN"}],
		["7123-5080", {cry:"SA2W29LE"}],
		["7123-5110", {cry:"SA2W33LN"}],
		["7123-5120", {cry:"SA2W37LM"}],
		["7123-5130", {cry:"SA2W37LN"}],
		["7123-5170", {cry:"SA2W45LN"}],
		["7123-5180", {cry:"SA2W53LN"}],
		["7123-5090", {cry:"SA9N83KN"}],
	];
	SeikoModelDB.m7126= [
		["7126-7000", {cry:"285W61LN"}],
		["7126-8000", {cry:"295W43LN"}],
		["7126-5020", {cry:"ES2W47HN"}],
	];
	SeikoModelDB.m7143= [
		["7143-7000", {cry:"285W41HN"}],
		["7143-7020", {cry:"285W41HN"}],
		["7143-7030", {cry:"285W41HN"}],
		["7143-7010", {cry:"285W51HA"}],
		["7143-5000", {cry:"SA1W97HA"}],
		["7143-5010", {cry:"SA2W01HA"}],
	];
	SeikoModelDB.m7515= [
		["7515-7030", {cry:"300T20ANS"}],
	];
	SeikoModelDB.m7518= [
		["7518-8000", {cry:"301N02AN"}],
	];
	SeikoModelDB.m7545= [
		["7545-7020", {cry:"295W12GN"}],
		["7545-7030", {cry:"300T20AN,300T28ANS"}],
		["7545-7040", {cry:"300T20AN"}],
		["7545-7130", {cry:"300T20AN"}],
		["7545-7000", {cry:"300T20ANS,300T28ANS,300T40ANB"}],
		["7545-8010", {cry:"300T20ANS,300T28ANS"}],
		["7545-8000", {cry:"305W14GN,305W18GN"}],
	];
	SeikoModelDB.m7546= [
		["7546-7020", {cry:"290W14GN"}],
		["7546-7050", {cry:"290W14GN"}],
		["7546-7060", {cry:"290W14GN"}],
		["7546-7100", {cry:"290W18GN"}],
		["7546-7090", {cry:"295W12GN"}],
		["7546-7110", {cry:"295W12GN"}],
		["7546-7120", {cry:"295W12GN"}],
		["7546-7010", {cry:"300T20AN,300T28ANS"}],
		["7546-7130", {cry:"300T20AN,300T28ANS"}],
		["7546-7070", {cry:"300T20ANS,300T28ANS,300T40ANB"}],
		["7546-8450", {cry:"300W02GC"}],
		["7546-8190", {cry:"300W74GC"}],
		["7546-7000", {cry:"300W76GN"}],
		["7546-7080", {cry:"300W76GN"}],
		["7546-8000", {cry:"300W76GN"}],
		["7546-8030", {cry:"300W76GN"}],
		["7546-8050", {cry:"300W76GN"}],
		["7546-8060", {cry:"300W76GN"}],
		["7546-8070", {cry:"300W76GN"}],
		["7546-8080", {cry:"300W76GN"}],
		["7546-8140", {cry:"300W76GN"}],
		["7546-8230", {cry:"300W76GN"}],
		["7546-8310", {cry:"300W76GN"}],
		["7546-8320", {cry:"300W76GN"}],
		["7546-8330", {cry:"300W76GN"}],
		["7546-5060", {cry:"300W80GA,SA0W64GC"}],
		["7546-6020", {cry:"300W80GA,300WB0GN"}],
		["7546-6030", {cry:"300W80GA,300WB0GN"}],
		["7546-6040", {cry:"300W80GA,300WB0GN"}],
		["7546-6070", {cry:"300W80GA,300WB0GN"}],
		["7546-7030", {cry:"300W80GA,300WB0GN"}],
		["7546-8340", {cry:"300W80GA,300WB0GN"}],
		["7546-8150", {cry:"300W80GC"}],
		["7546-8160", {cry:"300W80GC"}],
		["7546-8350", {cry:"300W80GC"}],
		["7546-8270", {cry:"300W96GN"}],
		["7546-8280", {cry:"300W96GN"}],
		["7546-8300", {cry:"300W98GN"}],
		["7546-5050", {cry:"300WB0GN"}],
		["7546-6050", {cry:"300WB0GN"}],
		["7546-6060", {cry:"300WB0GN"}],
		["7546-6080", {cry:"300WB0GN"}],
		["7546-6090", {cry:"300WB0GN"}],
		["7546-7040", {cry:"300WB0GN"}],
		["7546-8390", {cry:"305W14GN,305W18GN"}],
		["7546-8040", {cry:"310T18AN,310T40ANS,310T48ANG"}],
		["7546-8170", {cry:"310T18AN,310T48ANG"}],
		["7546-8200", {cry:"310T18AN,310T48ANG"}],
		["7546-8360", {cry:"310T18AN,310T40ANS,310T48ANG"}],
		["7546-8370", {cry:"310T18AN,310T40ANS,310T48ANG"}],
		["7546-8380", {cry:"310T18AN,310T40ANS,310T48ANG"}],
		["7546-8440", {cry:"310T18AN,310T40ANS,310T48ANG"}],
		["7546-8130", {cry:"310T48ANG,310T18AN"}],
		["7546-9000", {cry:"310W08AN"}],
		["7546-8010", {cry:"310W40GA"}],
		["7546-8020", {cry:"310W40GA"}],
		["7546-8180", {cry:"310W40GA"}],
		["7546-8240", {cry:"310W44GN"}],
		["7546-8260", {cry:"310W44GN"}],
		["7546-8090", {cry:"310W46GN"}],
		["7546-8100", {cry:"310W46GN"}],
		["7546-8110", {cry:"310W46GN"}],
		["7546-8120", {cry:"310W46GN"}],
		["7546-6100", {cry:"315W08GN"}],
		["7546-8400", {cry:"315W08GN"}],
		["7546-8410", {cry:"315W08GN"}],
		["7546-8420", {cry:"315W08GN"}],
		["7546-8430", {cry:"315W10GC"}],
		["7546-5020", {cry:"RE0W42AN"}],
		["7546-6000", {cry:"SA0W64GN"}],
		["7546-6010", {cry:"SA0W64GN"}],
		["7546-5010", {cry:"SA0W68AN"}],
		["7546-5070", {cry:"SA0W98GN"}],
		["7546-5100", {cry:"SA1W06GN"}],
		["7546-5110", {cry:"SA1W06GN"}],
		["7546-5080", {cry:"SA1W12GN"}],
		["7546-5090", {cry:"SA1W12GN"}],
	];
	SeikoModelDB.m7548= [
		["7548-7000", {cry:"320W34GA"}],
	];
	SeikoModelDB.m7549= [
		["7549-7010", {cry:"325W16GA"}],
	];
	SeikoModelDB.m7550= [
		["7550-0010", {cry:"429N01AN"}],
	];
	SeikoModelDB.m7559= [
		["7559-6000", {cry:"310W52GN"}],
		["7559-6010", {cry:"310W52GN"}],
		["7559-6070", {cry:"310W52GN"}],
		["7559-5010", {cry:"ES1W04GN"}],
		["7559-5000", {cry:"SA1W08GN"}],
	];
	SeikoModelDB.m7625= [
        ["7625-8961", {cry:"327W16AN"}],
        ["7625-8260", {cry:"325W05AN"}],
        ["7625-8070", {cry:"335W05AN"}],
        ["7625-9011", {cry:"340W02AN"}],
        ["7625-8230", {cry:"335W02AN"}],
        ["7625-8050", {cry:"325W05AN"}],
        ["7625-8293", {cry:"310W09AL"}],
        ["7625-8030", {cry:"310W01AN"}],
        ["7625-9020", {cry:"330T02AN"}],
        ["7625-8000", {cry:"330W02AN"}],
        ["7625-8010", {cry:"330W02AN"}],
        ["7625-8090", {cry:"325W05AN"}],
        ["7625-1994", {cry:"338N01AN"}],
        ["7625-8283", {cry:"335W02AN"}],
        ["7625-7013", {cry:"325W04AN"}],
        ["7625-7030", {cry:"325W04AN"}],
        ["7625-8120", {cry:"310W01AN"}],
        ["7625-7043", {cry:"300T07AN"}],
        ["7625-8110", {cry:"320W05AN"}],
        ["7625-8280", {cry:"335W02AN"}],
        ["7625-8960", {cry:"327W16AN"}],
        ["7625-8270", {cry:"340W06AN"}],
        ["7625-8303", {cry:"335W02AN"}],
        ["7625-8100", {cry:"320W05AN"}],
        ["7625-1991", {cry:"338N01AN"}],
        ["7625-8931", {cry:"327W02AL"}],
        ["7625-7010", {cry:"325W04AN"}],
        ["7625-8080", {cry:"330W02AN"}],
        ["7625-9012", {cry:"340W02AN"}],
        ["7625-8250", {cry:"320T05AN"}],
        ["7625-1990", {cry:"338N01AN"}],
        ["7625-8013", {cry:"330W02AN"}],
        ["7625-8233", {cry:"335W02AN"}],
        ["7625-8930", { cry:"327W16AN"}],
    ];

	SeikoModelDB.m7800= [
		["7800-8009", {cry:"290N06GN"}],
		["7800-5069", {cry:"RE1N08GN"}],
		["7800-5079", {cry:"RE1N08GN"}],
		["7800-5084", {cry:"RE1N08GN"}],
		["7800-5089", {cry:"RE1N08GN"}],
	];
	SeikoModelDB.m7810= [
		["7810-5039", {cry:"RE1N08GN"}],
	];
	SeikoModelDB.m7820= [
		["7820-5130", {cry:"RE1N08GN"}],
	];
	SeikoModelDB.m7853= [
		["7853-7000", {cry:"290W16GN"}],
		["7853-7010", {cry:"290W16GN"}],
		["7853-7020", {cry:"290W16GN"}],
		["7853-8000", {cry:"300W84GA"}],
		["7853-5020", {cry:"ES0N54GA"}],
		["7853-5010", {cry:"RE0W48GA"}],
		["7853-5000", {cry:"SA0W74GN"}],
		["7853-5030", {cry:"SA0W94GN"}],
		["7853-5040", {cry:"SA0W94GN"}],
	];
	SeikoModelDB.m7A28= [
		["7A28-6000", {cry:"320W42GN"}],
		["7A28-7000", {cry:"320W42GN"}],
		["7A28-7029", {cry:"320W42GN"}],
		["7A28-7080", {cry:"320W42GN"}],
		["7A28-7029", {cry:"320W42GN"}],
	];
	SeikoModelDB.m7A38= [
		["7A38-7060", {cry:"320W42GN"}],
	];
	SeikoModelDB.m7A48= [
		["7A48-7000", {cry:"320W42GN"}],
	];
	SeikoModelDB.m7M22= [
		["7M22-6B20", {cry:"275W36JN01"}],
		["7M22-6A00", {cry:"295W28GN,295W30LN01"}],
		["7M22-8A10", {cry:"295W28GN,295W30LN01"}],
	];
	SeikoModelDB.m7N00= [
		["7N00-7B40", {cry:"280A03JN02"}],
		["7N00-7A89", {cry:"280A03JN02"}],
		["7N00-8A00", {cry:"295N08JN01"}],
	];
	SeikoModelDB.m7N01= [
		["7N01-0AK0", {cry:"280A03JN02"}],
		["7N01-0DS0", {cry:"280A03JN02"}],
		["7N01-7A70", {cry:"280A03JN02"}],
		["7N01-0AZ0", {cry:"280A03JN02"}],
		["7N01-7140", {cry:"280A03JN02"}],
		["7N01-0BN0", {cry:"280A03JN02"}],
		["7N01-0CR0", {cry:"280A03JN02"}],
		["7N01-0AV0", {cry:"280P01LN03"}],
		["7N01-0AS0", {cry:"300P03HN03"}],
		["7N01-5B40", {cry:"RE8N08GN"}],
		["7N01-5A00", {cry:"REDN40JN"}],
	];
	SeikoModelDB.m7N21= [
		["7N21-HAA0", {cry:"300P03HN03"}],
	];
	SeikoModelDB.m7N22= [
		["7N22-7021", {cry:"280A03JN02"}],
		["7N22-8A00", {cry:"295N08JN01"}],
		["7N22-5A49", {cry:"RE8N08GN"}],
	];
	SeikoModelDB.m7N29= [
		["7N29-F070", {cry:"275W36JN01"}],
		["7N29-6D40", {cry:"275W36JN01"}],
		["7N29-6D60", {cry:"275W36JN01"}],
		["7N29-7A20", {cry:"280A03JN02"}],
		["7N29-6E30", {cry:"280A03JN02"}],
		["7N29-8A00", {cry:"295N08JN01"}],
		["7N29-5121", {cry:"BA0A05JN02"}],
		["7N29-5B30", {cry:"BA0A08JB0A"}],
		["7N29-5B59", {cry:"BA0A08JB0A"}],
		["7N29-5A50", {cry:"REDN40JN"}],
	];
	SeikoModelDB.m7N32= [
		["7N32-0AA0", {cry:"280A03JN02"}],
		["7N32-0049", {cry:"280A29JN02"}],
		["7N32-0069", {cry:"280A29JN02"}],
		["7N32-0110", {cry:"280A29JN02"}],
		["7N32-0120", {cry:"280A29JN02"}],
		["7N32-0149", {cry:"280A29JN02"}],
		["7N32-0150", {cry:"280P01LN03"}],
		["7N32-0B00", {cry:"295N08JN01"}],
		["7N32-0C10", {cry:"295N08JN01"}],
		["7N32-0BC0", {cry:"300P01LN03"}],
		["7N32-5A09", {cry:"RE8N08GN"}],
	];
	SeikoModelDB.m7N33= [
		["7N33-5A00", {cry:"BA3W18JN"}],
		["7N33-5A10", {cry:"BA3W18JN"}],
		["7N33-5A20", {cry:"BA3W18JN"}],
	];
	SeikoModelDB.m7N39= [
		["7N39-8010", {cry:"280A03JN02"}],
		["7N39-0A40", {cry:"280A03JN02"}],
		["7N39-0A19", {cry:"295N08JN01"}],
		["7N39-5A29", {cry:"BA0A08JB0A"}],
	];
	SeikoModelDB.m7N42= [
		["7N42-7000", {cry:"280A03JN02"}],
		["7N42-6C10", {cry:"280A03JN02"}],
		["7N42-0AY0", {cry:"280A03JN02"}],
		["7N42-0CV0", {cry:"280A03JN02"}],
		["7N42-0BD0", {cry:"280A03JN02"}],
		["7N42-6C00", {cry:"280A03JN02"}],
		["7N42-0AM0", {cry:"280A22HN02"}],
		["7N42-7010", {cry:"280P01LN03"}],
		["7N42-7040", {cry:"280P01LN03"}],
		["7N42-7081", {cry:"280P01LN03"}],
		["7N42-7091", {cry:"280P01LN03"}],
		["7N42-7098", {cry:"280P01LN03"}],
		["7N42-8089", {cry:"290P03LN03"}],
		["7N42-8080", {cry:"290P03LN03"}],
		["7N42-9021", {cry:"300P01LN03"}],
		["7N42-9020", {cry:"300P01LN03"}],
		["7N42-9030", {cry:"300P01LN03"}],
		["7N42-9049", {cry:"300P01LN03"}],
		["7N42-9049", {cry:"300P02LN03"}],
		["7N42-9040", {cry:"300P02LN03"}],
		["7N42-8070", {cry:"300P02LN03"}],
		["7N42-0AF0", {cry:"300P03HN03"}],
		["7N42-8260", {cry:"300P03HN03"}],
		["7N42-9089", {cry:"300P03LN03"}],
		["7N42-0BT0", {cry:"300P20HN02"}],
		["7N42-0BB0", {cry:"300P30HN02"}],
		["7N42-8A20", {cry:"310T48ANG"}],
	];
	SeikoModelDB.m7N43= [
		["7N43-0AY0", {cry:"280A03JN02"}],
		["7N43-7068", {cry:"280P01LN03"}],
		["7N43-7071", {cry:"280P01LN03"}],
		["7N43-7078", {cry:"280P01LN03"}],
		["7N43-7088", {cry:"280P01LN03"}],
		["7N43-8001", {cry:"290P03LN03"}],
		["7N43-8320", {cry:"290P03LN03"}],
		["7N43-8199", {cry:"290P03LN03"}],
		["7N43-8200", {cry:"290P04HN"}],
		["7N43-8110", {cry:"295P05HN03"}],
		["7N43-7A50", {cry:"295W28GN"}],
		["7N43-9048", {cry:"300P01LN03"}],
		["7N43-9011", {cry:"300P01LN03"}],
		["7N43-9041", {cry:"300P01LN03"}],
		["7N43-8360", {cry:"300P01LN03"}],
		["7N43-8061", {cry:"300P01LN03"}],
		["7N43-9011", {cry:"300P01LN03"}],
		["7N43-9018", {cry:"300P01LN03"}],
		["7N43-9040", {cry:"300P01LN03"}],
		["7N43-9050", {cry:"300P01LN03,300P02LN03"}],
		["7N43-9090", {cry:"300P02LN03"}],
		["7N43-0AM0", {cry:"300P02LN03"}],
		["7N43-9A00", {cry:"300P03HN03,300P03LN03"}],
		["7N43-9070", {cry:"300P03LN03"}],
		["7N43-0AZ0", {cry:"310P03LN03"}],
		["7N43-8A30", {cry:"310T48ANG"}],
	];
	SeikoModelDB.m7N49= [
		["7N49-0030", {cry:"280A03JN02"}],
	];
	SeikoModelDB.m7N83= [
		["7N83-0011", {cry:"190P05HN03"}],
	];
	SeikoModelDB.m7S26= [
		["7S26-00M0", {cry:"280P01LN03"}],
		["7S26-01B0", {cry:"280P01LN03"}],
		["7S26-01K0", {cry:"280P01LN03"}],
		["7S26-01T0", {cry:"280P01LN03"}],
		["7S26-01Y0", {cry:"280P01LN03"}],
		["7S26-01Z0", {cry:"280P01LN03"}],
		["7S26-02E0", {cry:"280P01LN03"}],
		["7S26-02H0", {cry:"280P01LN03"}],
		["7S26-02L0", {cry:"280P01LN03"}],
		["7S26-0460", {cry:"280P01LN03"}],
		["7S26-0560", {cry:"280P01LN03"}],
		["7S26-0580", {cry:"280P01LN03"}],
		["7S26-6009", {cry:"280P01LN03"}],
		["7S26-02T0", {cry:"290P03LN03"}],
		["7S26-01W0", {cry:"290P03LN03"}],
		["7S26-01L0", {cry:"290P03LN03"}],
		["7S26-01M0", {cry:"290P03LN03"}],
		["7S26-0420", {cry:"300P01LN03"}],
		["7S26-0430", {cry:"300P01LN03"}],
		["7S26-00Y0", {cry:"300P01LN03"}],
		["7S26-02M0", {cry:"300P01LN03"}],
		["7S26-02J0", {cry:"300P01LN03"}],
		["7S26-0510", {cry:"300P01LN03"}],
		["7S26-00X0", {cry:"300P01LN03"}],
		["7S26-02C0", {cry:"300P01LN03"}],
		["7S26-02W0", {cry:"300P01LN03"}],
	];
	SeikoModelDB.m7S36= [
		["7S36-0010", {cry:"280P01LN03"}],
		["7S36-00K0", {cry:"290P03LN03"}],
		["7S36-00W0", {cry:"290P03LN03"}],
		["7S36-00R0", {cry:"290P03LN03"}],
	];
	SeikoModelDB.m7T11= [
		["7T11-0AL0", {cry:"290P03LN03"}],
	];
	SeikoModelDB.m7T24= [
		["7T24-7A00", {cry:"320W42GN"}],
	];
	SeikoModelDB.m7T27= [
		["7T27-7A20", {cry:"320W42GN"}],
	];
	SeikoModelDB.m7T32= [
		["7T32-6G10", {cry:"280A03JN02"}],
		["7T32-6F90", {cry:"280A03JN02"}],
		["7T32-7J10", {cry:"290P03LN03"}],
		["7T32-6G70", {cry:"290PX7TNC3"}],
		["7T32-6L40", {cry:"300P03HN03"}],
		["7T32-6M00", {cry:"300P03HN03"}],
		["7T32-6M10", {cry:"300P03HN03"}],
		["7T32-6M30", {cry:"300P03HN03"}],
		["7T32-6M59", {cry:"300P03HN03"}],
		["7T32-7G80", {cry:"300P03HN03"}],
		["7T32-7G90", {cry:"300P03HN03,300P03LN03"}],
		["7T32-7H29", {cry:"300P03HN03"}],
		["7T32-7A49", {cry:"320W42GN"}],
		["7T32-7A99", {cry:"320W42GN"}],
		["7T32-7B30", {cry:"320W42GN"}],
		["7T32-7A49", {cry:"320W42GN"}],
		["7T32-7A99", {cry:"320W42GN"}],
	];
	SeikoModelDB.m7T62= [
		["7T62-0A90", {cry:"290P03LN03"}],
		["7T62-0A80", {cry:"290P03LN03"}],
		["7T62-0AB0", {cry:"300P03HN03"}],
		["7T62-0AE0", {cry:"300P03HN03"}],
		["7T62-0DL0", {cry:"300P03HN03"}],
		["7T62-0CD0", {cry:"300P04LN03"}],
		["7T62-0AH0", {cry:"300P30HN02"}],
		["7T62-0BZ0", {cry:"300P30HN02"}],
		["7T62-X041", {cry:"300P30HN02"}],
		["7T62-X138", {cry:"300P30HN02"}],
	];
	SeikoModelDB.m7T92= [
		["7T92-0DZ0", {cry:"290P03LN03"}],
		["7T92-0DF0", {cry:"290P03LN03"}],
	];
	SeikoModelDB.m8043= [
		["8043-8010", {cry:"290G05GN"}],
		["8043-5050", {cry:"SA1W21GN"}],
	];
	SeikoModelDB.m8222= [
		["8222-8000", {cry:"310T48ANG"}],
		["8222-8020", {cry:"310T48ANG"}],
	];
	SeikoModelDB.m8223= [
		["8223-8010", {cry:"310T48ANG"}],
		["8223-8020", {cry:"310T48ANG"}],
		["8223-8080", {cry:"310T48ANG"}],
		["8223-5100", {cry:"SA1W72GN"}],
		["8223-5350", {cry:"SA1W72GN"}],
		["8223-5395", {cry:"SA1W72GN"}],
	];
	SeikoModelDB.m8229= [
		["8229-6000", {cry:"295W16GN"}],
		["8229-601A", {cry:"295W16GN"}],
		["8229-601B", {cry:"295W16GN"}],
		["8229-602A", {cry:"295W16GN"}],
		["8229-602B", {cry:"295W16GN"}],
		["8229-7000", {cry:"300WB0GN"}],
		["8229-7010", {cry:"300WB0GN"}],
		["8229-7020", {cry:"300WB0GN"}],
		["8229-8000", {cry:"300WB0GN"}],
		["8229-8010", {cry:"300WB0GN"}],
		["8229-8020", {cry:"300WB0GN"}],
	];
	SeikoModelDB.m8249= [
		["8249-7000", {cry:"300WB0GN"}],
	];
	SeikoModelDB.m8305= [
		["8305-8040", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
	];
	SeikoModelDB.m8306= [
		["8306-8041", {cry:"310T18ANS"}],
		["8306-8041", {cry:"310T40ANS"}],
		["8306-8041", {cry:"310T48ANG"}],
		["8306-8041", {cry:"310T48ANS"}],
		["8306-8090", {cry:"320W10GN"}],
		["8306-9030", {cry:"320W10GN"}],
		["8306-9050", {cry:"320W10GN"}],
	];
	SeikoModelDB.m8346= [
		["8346-8040", {cry:"320W10GN"}],
		["8346-9000", {cry:"320W10GN"}],
		["8346-9010", {cry:"320W10GN"}],
	];
	SeikoModelDB.m8523= [
		["8523-0079", {cry:"190P05HN03"}],
		["8523-5140", {cry:"ESGN69JN"}],
	];
	SeikoModelDB.m8601= [
		["8601-5430", {cry:"SAJN29JN01"}],
	];
	SeikoModelDB.m8620= [
		["8620-5010", {cry:"2RE5N75LN"}],
	];
	SeikoModelDB.m8M32= [
		["8M32-8030", {cry:"295W69LN"}],
	];
	SeikoModelDB.m9020= [
		["9020-5610", {cry:"295W28GN"}],
		["9020-5110", {cry:"RE3N64GN"}],
		["9020-5120", {cry:"RE3N64GN"}],
		["9020-5070", {cry:"SA3N84GN"}],
	];
	SeikoModelDB.m9021= [
		["9021-5290", {cry:"RE8N08GN"}],
	];
	SeikoModelDB.m9029= [
		["9029-5110", {cry:"RE8N08GN"}],
	];
	SeikoModelDB.mA547= [
		["A547-5050", {cry:"BA1W44GN"}],
	];
	SeikoModelDB.mH022= [
		["H022-6000", {cry:"310P03LN03"}],
	];
	SeikoModelDB.mH23= [
		["H23-8A60", {cry:"295W28GN"}],
	];
	SeikoModelDB.mH239= [
		["H239-5020", {cry:"ES0X01HNTO"}],
	];
	SeikoModelDB.mH357= [
		["H357-5040", {cry:"BA1W36GN"}],
	];
	SeikoModelDB.mH601= [
		["H601-0010", {cry:"310W39HN"}],
		["H601-0020", {cry:"310W39HN"}],
		["H601-8080", {cry:"310W39HN"}],
		["H601-5420", {cry:"SAJN29JN01"}],
		["H601-5430", {cry:"SAJN29JN01"}],
		["H601-5509", {cry:"SAJN29JN01"}],
	];
	SeikoModelDB.mH801= [
		["H801-6071", {cry:"280P01LN03"}],
	];
	SeikoModelDB.mN944= [
		["N944-6A20", {cry:"290P03LN03"}],
	];
	SeikoModelDB.mN945= [
		["N945-6A40", {cry:"300P03LN03"}],
	];
	SeikoModelDB.mNX02= [
		["NX02-0A70", {cry:"290P03LN03"}],
	];
	SeikoModelDB.mS234= [
		["S234-5010", {cry:"BA1W91LN"}],
	];
	SeikoModelDB.mV011= [
		["V011-0020", {cry:"310P03LN03"}],
	];
	SeikoModelDB.mV041= [
		["V041-7040", {cry:"300P02LN03"}],
		["V041-0010", {cry:"300P03LN03"}],
		["V041-7021", {cry:"300P03LN03"}],
		["V041-9020", {cry:"300P03LN03"}],
		["V041-9050", {cry:"300P03LN03"}],
		["V041-9090", {cry:"300P03LN03"}],
		["V041-9120", {cry:"300P03LN03"}],
		["V041-9140", {cry:"300P03LN03"}],
		["V041-9150", {cry:"300P03LN03"}],
		["V041-9160", {cry:"300P03LN03"}],
		["V041-9170", {cry:"300P03LN03"}],
		["V041-9240", {cry:"300P03LN03"}],
	];
	SeikoModelDB.mV145= [
		["V145-0AP0", {cry:"290P03LN03"}],
		["V145-0A30", {cry:"290P03LN03"}],
	];
	SeikoModelDB.mV158= [
		["V158-0AA0", {cry:"300P02LN03"}],
		["V158-0AB0", {cry:"300P02LN03"}],
	];
	SeikoModelDB.mV172= [
		["V172-0AG0", {cry:"360PC0HN02"}],
	];
	SeikoModelDB.mV220= [
		["V220-0AB0", {cry:"BA1A31JN02"}],
	];
	SeikoModelDB.mV251= [
		["V251-0120", {cry:"280P01LN03"}],
	];
	SeikoModelDB.mV33F= [
		["V33F-8A30", {cry:"300P01LN03"}],
	];
	SeikoModelDB.mV33G= [
		["V33G-8A30", {cry:"300P01LN03"}],
	];
	SeikoModelDB.mV33J= [
		["V33J-6A40", {cry:"280A03JN02"}],
	];
	SeikoModelDB.mV348= [
		["V348-8020", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
	];
	SeikoModelDB.mV500= [
		["V500-7A30", {cry:"280P01LN03"}],
		["V500-7A40", {cry:"280P01LN03"}],
	];
	SeikoModelDB.mV501= [
		["V501-0DK0", {cry:"290P03LN03"}],
		["V501-0BM0", {cry:"290P03LN03"}],
		["V501-0AP0", {cry:"290P03LN03"}],
		["V501-8B50", {cry:"300P01LN03"}],
		["V501-9A80", {cry:"300P01LN03"}],
		["V501-9B00", {cry:"300P01LN03"}],
	];
	SeikoModelDB.mV513= [
		["V513-8009", {cry:"310T48ANG"}],
		["V513-8009", {cry:"310T48ANS"}],
	];
	SeikoModelDB.mV532= [
		["V532-7A50", {cry:"280P01LN03"}],
		["V532-7B50", {cry:"280P01LN03"}],
		["V532-7E10", {cry:"280P01LN03"}],
		["V532-7G20", {cry:"280P01LN03"}],
		["V532-7G40", {cry:"280WS4LN01"}],
		["V532-7F40", {cry:"280WS4LN01"}],
		["V532-7G60", {cry:"280WS4LN01"}],
		["V532-7G70", {cry:"280WS4LN01"}],
		["V532-7G50", {cry:"280WS4LN01"}],
		["V532-7F50", {cry:"280WS4LN01"}],
		["V532-7G80", {cry:"280WS4LN01"}],
		["V532-7F90", {cry:"290P03LN03"}],
		["V532-8C80", {cry:"290P03LN03"}],
		["V532-6G80", {cry:"300P01LN03"}],
		["V532-8A70", {cry:"300P03LN03"}],
		["V532-8A80", {cry:"300P03LN03"}],
		["V532-9A50", {cry:"300P03LN03"}],
	];
	SeikoModelDB.mV533= [
		["V533-7B00", {cry:"280P01LN03"}],
		["V533-7B20", {cry:"280WS4LN01"}],
		["V533-9A00", {cry:"300P01LN03"}],
		["V533-8A50", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["V533-8A60", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["V533-8A70", {cry:"310T48ANG"}],
		["V533-8A80", {cry:"310T48ANG"}],
		["V533-8B80", {cry:"310T48ANG"}],
		["V533-8C30", {cry:"310T48ANG"}],
		["V533-5A40", {cry:"ES0A78LN03"}],
	];
	SeikoModelDB.mV537= [
		["V537-9A00", {cry:"300P01LN03"}],
		["V537-9A10", {cry:"300P01LN03"}],
		["V537-8A40", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
	];
	SeikoModelDB.mV544= [
		["V544-7A30", {cry:"280P01LN03"}],
		["V544-7A40", {cry:"280P01LN03"}],
		["V544-6A00", {cry:"300P03LN03"}],
		["V544-6A10", {cry:"300P03LN03"}],
	];
	SeikoModelDB.mV553= [
		["V553-5A40", {cry:"ES0A78LN03"}],
	];
	SeikoModelDB.mV563= [
		["V563-8449", {cry:"310T48ANG"}],
		["V563-8449", {cry:"310T48ANS"}],
	];
	SeikoModelDB.mV654= [
		["V654-0010", {cry:"300P01LN03"}],
	];
	SeikoModelDB.mV655= [
		["V655-6100", {cry:"290P03LN03"}],
	];
	SeikoModelDB.mV656= [
		["V656-8000", {cry:"290P03LN03"}],
	];
	SeikoModelDB.mV657= [
		["V657-7090", {cry:"280A03JN02"}],
		["V657-7080", {cry:"280A29JN02"}],
		["V657-9110", {cry:"290P03LN03"}],
		["V657-8030", {cry:"290P03LN03"}],
		["V657-9000", {cry:"290P03LN03"}],
		["V657-0B20", {cry:"290P03LN03"}],
		["V657-8000", {cry:"290P03LN03"}],
		["V657-8040", {cry:"290P03LN03"}],
		["V657-0C60", {cry:"300P03HN03"}],
		["V657-9099", {cry:"300P03LN03"}],
	];
	SeikoModelDB.mV658= [
		["V658-0AA0", {cry:"290P03LN03"}],
		["V658-0A50", {cry:"310P03LN03"}],
	];
	SeikoModelDB.mV691= [
		["V691-0010", {cry:"300P03LN03"}],
		["V691-0020", {cry:"300P03LN03"}],
	];
	SeikoModelDB.mV694= [
		["V694-8010", {cry:"300P03LN03"}],
		["V694-8020", {cry:"300P03LN03"}],
	];
	SeikoModelDB.mV700= [
		["V700-8A29", {cry:"295N08JN01"}],
	];
	SeikoModelDB.mV701= [
		["V701-1T50", {cry:"275W36JN01"}],
		["V701-6J60", {cry:"275W36JN01"}],
		["V701-6K00", {cry:"275W36JN01"}],
		["V701-6K69", {cry:"275W36JN01"}],
		["V701-7120", {cry:"280A03JN02"}],
		["V701-2A40", {cry:"280A03JN02"}],
		["V701-7A29", {cry:"280A03JN02"}],
		["V701-7A90", {cry:"280A03JN02"}],
		["V701-7020", {cry:"280A03JN02"}],
		["V701-1Y70", {cry:"280A03JN02"}],
		["V701-1920", {cry:"280A03JN02"}],
		["V701-7A20", {cry:"280A03JN02"}],
		["V701-2C90", {cry:"280A03JN02"}],
		["V701-2D20", {cry:"280A03JN02"}],
		["V701-7A50", {cry:"280A03JN02"}],
		["V701-7A70", {cry:"280A03JN02"}],
		["V701-2E00", {cry:"280A03JN02"}],
		["V701-2E10", {cry:"280A03JN02"}],
		["V701-0010", {cry:"280P01LN03"}],
		["V701-5A00", {cry:"SA0A50LN03"}],
	];
	SeikoModelDB.mV721= [
		["V721-7A00", {cry:"290P03LN03"}],
	];
	SeikoModelDB.mV722= [
		["V722-7050", {cry:"280A03JN02"}],
		["V722-7030", {cry:"280P01LN03"}],
		["V722-7070", {cry:"280P01LN03"}],
		["V722-7A10", {cry:"280P01LN03"}],
		["V722-7A20", {cry:"280P01LN03"}],
		["V722-7060", {cry:"300P01LN03"}],
		["V722-6A80", {cry:"300P03HN03"}],
	];
	SeikoModelDB.mV732= [
		["V732-0220", {cry:"280A03JN02"}],
		["V732-0C49", {cry:"280A03JN02"}],
		["V732-0K29", {cry:"280A03JN02"}],
		["V732-0T90", {cry:"280A03JN02"}],
		["V732-0C40", {cry:"280A03JN02"}],
		["V732-0K30", {cry:"280A03JN02"}],
		["V732-0400", {cry:"280A29JN02"}],
		["V732-0B90", {cry:"280P01LN03"}],
		["V732-0C00", {cry:"280P01LN03"}],
		["V732-0S60", {cry:"280P01LN03"}],
		["V732-0D60", {cry:"290P03LN03"}],
		["V732-0V30", {cry:"290P03LN03"}],
		["V732-0C90", {cry:"290P03LN03"}],
		["V732-0G40", {cry:"290P03LN03"}],
		["V732-0S50", {cry:"290P03LN03"}],
		["V732-0C60", {cry:"290P03LN03"}],
		["V732-0H80", {cry:"290P03LN03"}],
		["V732-0J10", {cry:"290P03LN03"}],
		["V732-0R30", {cry:"290P03LN03"}],
		["V732-0E70", {cry:"290P03LN03"}],
		["V732-0310", {cry:"290P04HN"}],
		["V732-0L70", {cry:"300P01LN03"}],
		["V732-0A40", {cry:"300P02LN03"}],
		["V732-0F00", {cry:"300P03LN03"}],
		["V732-0F30", {cry:"300P03LN03"}],
		["V732-0F70", {cry:"300P03LN03"}],
	];
	SeikoModelDB.mV733= [
		["V733-6C80", {cry:"280A03JN02"}],
		["V733-8A30", {cry:"290P03LN03"}],
		["V733-9A40", {cry:"300P01LN03"}],
		["V733-9A00", {cry:"300P03LN03"}],
		["V733-9A10", {cry:"300P03LN03"}],
		["V733-9A20", {cry:"300P03LN03"}],
		["V733-9A30", {cry:"300P03LN03"}],
		["V733-0A00", {cry:"310P03LN03"}],
		["V733-8A40", {cry:"310T48ANG"}],
		["V733-8A70", {cry:"310T48ANG"}],
		["V733-5A60", {cry:"ES0A78LN03"}],
	];
	SeikoModelDB.mV739= [
		["V739-0A89", {cry:"280A03JN02"}],
		["V739-0B09", {cry:"280A03JN02"}],
		["V739-0A80", {cry:"280A03JN02"}],
	];
	SeikoModelDB.mV742= [
		["V742-8A40", {cry:"290P03LN03"}],
		["V742-9A00", {cry:"300P01LN03"}],
	];
	SeikoModelDB.mV743= [
		["V743-8020", {cry:"290P03LN03"}],
		["V743-8B60", {cry:"290P03LN03"}],
		["V743-9009", {cry:"300P01LN03"}],
		["V743-9029", {cry:"300P02LN03"}],
		["V743-9020", {cry:"300P02LN03"}],
		["V743-9A19", {cry:"300P03HN03"}],
		["V743-9A20", {cry:"300P04LN03"}],
		["V743-0A20", {cry:"310P03LN03"}],
	];
	SeikoModelDB.mV744= [
		["V744-0A30", {cry:"310T48ANG"}],
	];
	SeikoModelDB.mV783= [
		["V783-0030", {cry:"190P05HN03"}],
	];
	SeikoModelDB.mV893= [
		["V893-0013", {cry:"190P05HN03"}],
	];
	SeikoModelDB.mVX33= [
		["VX33-0AA0", {cry:"300P01LN03"}],
		["VX33-A0D0", {cry:"310T48ANG"}],
	];
	SeikoModelDB.mVX42= [
		["VX42-0AE0", {cry:"290P03LN03"}],
	];
	SeikoModelDB.mY101= [
		["Y101-8000", {cry:"290N18GN"}],
	];
	SeikoModelDB.mY112= [
		["Y112-8000", {cry:"290N18GN"}],
		["Y112-8010", {cry:"290N18GN"}],
		["Y112-8030", {cry:"290N18GN"}],
		["Y112-8040", {cry:"290N18GN"}],
		["Y112-8050", {cry:"290N18GN"}],
	];
	SeikoModelDB.mY113= [
		["Y113-8080", {cry:"290N18GN"}],
		["Y113-8090", {cry:"290N18GN"}],
		["Y113-8179", {cry:"310T18ANS"}],
		["Y113-8169", {cry:"310T18ANS"}],
		["Y113-8119", {cry:"310T18ANS"}],
		["Y113-6039", {cry:"310T18ANS"}],
		["Y113-8179", {cry:"310T40ANS"}],
		["Y113-8169", {cry:"310T40ANS"}],
		["Y113-8119", {cry:"310T40ANS"}],
		["Y113-6039", {cry:"310T40ANS"}],
		["Y113-6039", {cry:"310T48ANG"}],
		["Y113-8030", {cry:"310T48ANG"}],
		["Y113-8119", {cry:"310T48ANG"}],
		["Y113-8169", {cry:"310T48ANG"}],
		["Y113-8179", {cry:"310T48ANG"}],
		["Y113-6039", {cry:"310T48ANS"}],
		["Y113-8119", {cry:"310T48ANS"}],
		["Y113-8169", {cry:"310T48ANS"}],
		["Y113-8179", {cry:"310T48ANS"}],
		["Y113-5119", {cry:"BA1W86GN"}],
	];
	SeikoModelDB.mY142= [
		["Y142-7A00", {cry:"280WS4LN01"}],
		["Y142-8060", {cry:"290N18GN"}],
		["Y142-8000", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["Y142-8020", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
	];
	SeikoModelDB.mY143= [
		["Y143-8020", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["Y143-8030", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["Y143-8050", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["Y143-8230", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["Y143-8150", {cry:"310T48ANG"}],
	];
	SeikoModelDB.mY147= [
		["Y147-7070", {cry:"280WS4LN01"}],
		["Y147-7100", {cry:"280WS4LN01"}],
		["Y147-7A10", {cry:"280WS4LN01"}],
		["Y147-8049", {cry:"310T18ANS"}],
		["Y147-8019", {cry:"310T18ANS"}],
		["Y147-8049", {cry:"310T40ANS"}],
		["Y147-8019", {cry:"310T40ANS"}],
		["Y147-8019", {cry:"310T48ANG"}],
		["Y147-8029", {cry:"310T48ANG"}],
		["Y147-8049", {cry:"310T48ANG"}],
		["Y147-8060", {cry:"310T48ANG"}],
		["Y147-8070", {cry:"310T48ANG"}],
		["Y147-8019", {cry:"310T48ANS"}],
		["Y147-8029", {cry:"310T48ANS"}],
		["Y147-8049", {cry:"310T48ANS"}],
	];
	SeikoModelDB.mY148= [
		["Y148-8080", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["Y148-8049", {cry:"310T18ANS"}],
		["Y148-8009", {cry:"310T18ANS"}],
		["Y148-8049", {cry:"310T40ANS"}],
		["Y148-8009", {cry:"310T40ANS"}],
		["Y148-8009", {cry:"310T48ANG"}],
		["Y148-8019", {cry:"310T48ANG"}],
		["Y148-8049", {cry:"310T48ANG"}],
		["Y148-8060", {cry:"310T48ANG"}],
		["Y148-8009", {cry:"310T48ANS"}],
		["Y148-8019", {cry:"310T48ANS"}],
		["Y148-8049", {cry:"310T48ANS"}],
	];
	SeikoModelDB.mY182= [
		["Y182-7C60", {cry:"290P03LN03"}],
		["Y182-7B00", {cry:"290P03LN03"}],
		["Y182-7D00", {cry:"290P03LN03"}],
		["Y182-6E60", {cry:"290P04HN"}],
		["Y182-6D10", {cry:"300P03LN03"}],
		["Y182-6F50", {cry:"310P03LN03"}],
	];
	SeikoModelDB.mY23= [
		["Y23-8A60", {cry:"295P05HN03"}],
	];
	SeikoModelDB.mY331= [
		["Y331-8030", {cry:"310T48ANG"}],
	];
	SeikoModelDB.mY451= [
		["Y451-8009", {cry:"290N18GN"}],
		["Y451-8010", {cry:"290N18GN"}],
	];
	SeikoModelDB.mY512= [
		["Y512-8010", {cry:"310T48ANG"}],
		["Y512-8020", {cry:"310T48ANG"}],
		["Y512-8030", {cry:"310T48ANG"}],
		["Y512-8050", {cry:"310T48ANG"}],
	];
	SeikoModelDB.mY513= [
		["Y513-6019", {cry:"305W14GN"}],
		["Y513-6019", {cry:"305W18GN"}],
		["Y513-8180", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["Y513-8210", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["Y513-8230", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["Y513-8350", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["Y513-8370", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["Y513-8000", {cry:"310T48ANG"}],
		["Y513-8019", {cry:"310T48ANG"}],
		["Y513-8020", {cry:"310T48ANG"}],
		["Y513-8040", {cry:"310T48ANG"}],
		["Y513-8140", {cry:"310T48ANG"}],
		["Y513-8159", {cry:"310T48ANG"}],
		["Y513-8190", {cry:"310T48ANG"}],
		["Y513-8220", {cry:"310T48ANG"}],
		["Y513-8250", {cry:"310T48ANG"}],
		["Y513-8260", {cry:"310T48ANG"}],
		["Y513-8270", {cry:"310T48ANG"}],
		["Y513-8310", {cry:"310T48ANG"}],
		["Y513-8340", {cry:"310T48ANG"}],
		["Y513-8019", {cry:"310T48ANS"}],
		["Y513-8159", {cry:"310T48ANS"}],
	];
	SeikoModelDB.mY532= [
		["Y532-9A50", {cry:"300P03LN03"}],
	];
	SeikoModelDB.mY541= [
		["Y541-8000", {cry:"290N18GN"}],
	];
	SeikoModelDB.mY553= [
		["Y553-8010", {cry:"290N18GN"}],
	];
	SeikoModelDB.mY558= [
		["Y558-8010", {cry:"290N18GN"}],
	];
	SeikoModelDB.mY561= [
		["Y561-8010", {cry:"290N18GN"}],
	];
	SeikoModelDB.mY562= [
		["Y562-8030", {cry:"290N18GN"}],
		["Y562-8040", {cry:"290N18GN"}],
		["Y562-8119", {cry:"310T18ANS"}],
		["Y562-8129", {cry:"310T18ANS"}],
		["Y562-8119", {cry:"310T40ANS"}],
		["Y562-8129", {cry:"310T40ANS"}],
		["Y562-8109", {cry:"310T48ANG"}],
		["Y562-810H", {cry:"310T48ANG"}],
		["Y562-8119", {cry:"310T48ANG"}],
		["Y562-8129", {cry:"310T48ANG"}],
		["Y562-8139", {cry:"310T48ANG"}],
		["Y562-8159", {cry:"310T48ANG"}],
		["Y562-8109", {cry:"310T48ANS"}],
		["Y562-810H", {cry:"310T48ANS"}],
		["Y562-8119", {cry:"310T48ANS"}],
		["Y562-8129", {cry:"310T48ANS"}],
		["Y562-8139", {cry:"310T48ANS"}],
		["Y562-8159", {cry:"310T48ANS"}],
	];
	SeikoModelDB.mY563= [
		["Y563-8090", {cry:"290N18GN"}],
		["Y563-8360", {cry:"290N18GN"}],
		["Y563-8410", {cry:"290N18GN"}],
		["Y563-8430", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["Y563-8059", {cry:"310T18ANS"}],
		["Y563-8109", {cry:"310T18ANS"}],
		["Y563-8129", {cry:"310T18ANS"}],
		["Y563-8329", {cry:"310T18ANS"}],
		["Y563-8390", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["Y563-8449", {cry:"310T18ANS"}],
		["Y563-8529", {cry:"310T18ANS"}],
		["Y563-8539", {cry:"310T18ANS"}],
		["Y563-8579", {cry:"310T18ANS"}],
		["Y563-858H", {cry:"310T18ANS"}],
		["Y563-8019", {cry:"310T18ANS"}],
		["Y563-805F", {cry:"310T18ANS"}],
		["Y563-8010", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["Y563-8020", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["Y563-8080", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["Y563-8100", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["Y563-8110", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["Y563-8120", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["Y563-8200", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["Y563-8210", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["Y563-8220", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["Y563-8270", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["Y563-8290", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["Y563-8300", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["Y563-8380", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["Y563-8440", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["Y563-8460", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["Y563-8470", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["Y563-8480", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["Y563-8510", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["Y563-8059", {cry:"310T40ANS"}],
		["Y563-8329", {cry:"310T40ANS"}],
		["Y563-8529", {cry:"310T40ANS"}],
		["Y563-8539", {cry:"310T40ANS"}],
		["Y563-8579", {cry:"310T40ANS"}],
		["Y563-858H", {cry:"310T40ANS"}],
		["Y563-805F", {cry:"310T40ANS"}],
		["Y563-8000", {cry:"310T48ANG"}],
		["Y563-8059", {cry:"310T48ANG"}],
		["Y563-805F", {cry:"310T48ANG"}],
		["Y563-8329", {cry:"310T48ANG"}],
		["Y563-8370", {cry:"310T48ANG"}],
		["Y563-8400", {cry:"310T48ANG"}],
		["Y563-8490", {cry:"310T48ANG"}],
		["Y563-8529", {cry:"310T48ANG"}],
		["Y563-8539", {cry:"310T48ANG"}],
		["Y563-8579", {cry:"310T48ANG"}],
		["Y563-8589", {cry:"310T48ANG"}],
		["Y563-858H", {cry:"310T48ANG"}],
		["Y563-8059", {cry:"310T48ANS"}],
		["Y563-805F", {cry:"310T48ANS"}],
		["Y563-8329", {cry:"310T48ANS"}],
		["Y563-8529", {cry:"310T48ANS"}],
		["Y563-8539", {cry:"310T48ANS"}],
		["Y563-8579", {cry:"310T48ANS"}],
		["Y563-8589", {cry:"310T48ANS"}],
		["Y563-858H", {cry:"310T48ANS"}],
		["Y563-5040", {cry:"BA1N42GN"}],
		["Y563-5019", {cry:"BA1N42GN"}],
	];
	SeikoModelDB.mY572= [
		["Y572-8000", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["Y572-8010", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["Y572-8020", {cry:"310T48ANG"}],
	];
	SeikoModelDB.mY573= [
		["Y573-8060", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["Y573-8040", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["Y573-8050", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["Y573-8080", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["Y573-8090", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["Y573-8100", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["Y573-8110", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["Y573-8150", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["Y573-8160", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["Y573-8170", {cry:"310T18ANS,310T40ANS,310T48ANG"}],
		["Y573-8000", {cry:"310T48ANG"}],
	];
	SeikoModelDB.mY580= [
		["Y580-5570", {cry:"BA1N92LN"}],
		["Y580-5149", {cry:"RE4N98GN"}],
	];
	SeikoModelDB.mY960= [
		["Y960-8000", {cry:"290N18GN"}],
		["Y960-8010", {cry:"290N18GN"}],
	];
	SeikoModelDB.mYT57= [
		["YT57-0A30", {cry:"290P03LN03"}],
		["YT57-0C00", {cry:"290P03LN03"}],
		["YT57-0B60", {cry:"290P03LN03"}],
		["YT57-0B20", {cry:"290P03LN03"}],
	];
	SeikoModelDB.mYT58= [
		["YT58-0A20", {cry:"290P03LN03"}],
		["YT58-0AA0", {cry:"290P03LN03"}],
	];


    var Crystal_Seiko2GS = [
        ["CC 301-1", "SA0N90AN00"], //
        ["CC 305-24", "SA0N92AN"], //
        ["CC 352", "SA0W08AN"], //
        ["CF 346-51", "5N71"], //
        ["CF 384-65", "AL0N08AC"], //
        ["CF 386A", "ES2N07AN00"], //
        ["CF 412-55", "WA0N01AC"], //
        ["CF 435-20", "TD0N11AN00"], //
        ["CF 471-71", "AL0N01AC"], //
        ["CF 909", "ES0W09AN00"], //
        ["CH 305-63", "ES2N47AN00"], //
        ["CH 600", "BA0W04AN"], //6106-5449
        ["CH 469-60", "BA0T02ANT"], //0439-4010
        ["CO 305-75", "K00N13AN"], //
        ["CO 306-18L", "K00N23AN"], //
        //[ "CO 307-22T", "5N52"], //ELGIN 1303
        ["CO 308-76", "K00N32GN"], //
        ["CO 308-91", "K00N45AN00"], //
        ["CO 308-95E", "K00N09AC"], //
        ["CO 310-20", "K00N63AN0G"], //
        ["CO 314-80", "K00N46GN"], //
        ["CO 319-26", "K02N29AN"], //
        ["CO 361-75", "K00N60AN"], //2202A-7009
        ["CO 332-50", "K02N43GN"], //
        ["CO 575-50", "K00W16AN"], //
        ["CO 585-25", "K00W08AN"], //
        ["CT 507-22", "SA4N25AN00"], //
        ["CT 519-25", "BA0N89AN00"], //
        ["CT 1240-71", "RE3N43GN00"], //
        ["CX 310-22", "RE2N11AN"], //
        ["CX 389-20", "RE0N47AN"], //
        ["CX 390-50", "RE0N27AN"], //
        ["CX 413", "RE1N45AN"], //
        ["CX 504-56", "RE3N41AN"], //
        ["CX 910-9", "RE4N91AN"], //
        ["CX 1111", "RE1N17AL"], //
        ["CX 1155-50", "RE1N06GN"], //
        ["CX 1167", "RE0W02AN"], //6119-5000
        ["CY 296-1", "SA9NF1AN00"], //
        ["CY 349", "SA0N54AN"], //
        ["CY 350-6", "SABN05AN00"], //
        ["CY 350-56", "SA0N54AN00"], //
        ["CY 394-19", "SA1N65AN00"], //
        ["CY 409-38", "SA5N33AN"], //
        ["CY 410-41", "SA9NF3AN00"], //
        ["CY 577", "SA0W04AN"], //
        ["CY 508-80", "SA2N87AN00"], //
        ["CY 510-39", "ESAN97AN"], //
        //[ "CY 854-20", "0439-4009
        ["CY 875-54", "SA0W39AA"], //
        ["CY 883-90", "K00W42AC"], //
        ["CY 889", "SA0W28AN00"], //
        ["CY 913", "SA0W02AN"], //
        ["CY 915", "SA0N91AN"], //
        ["CY 915-75", "SA1N38GN"], //
        ["CY 911-26", "ESFN69AN00"], //
        ["CY 928-41", "SA7N94AN"], //
        //[ "CY 931-80", "SEIKO 530-466
        ["CY 932-55", "SA0W21AN"], //
        ["CY 934-75", "SA0W68AN"], //
        ["CY 940", "RE0W06AN"], //
        ["CY 927", "RE0W04AN"], //
        ["CY 930-60", "BA0N60GN"], //
        ["CMT 369-75", "SA0N56AN"], //
        ["CMX 331-75", "RE0N05AN"], //
        ["CMX 331-85", "RE0N06AN"], //
        ["CMX 392-4", "RE0N54AL"], //MAGNIFIER
        ["CMX 392-5K", "RE1N11AN"], //
        ["CMY 348-10", "ES1N61AN00"], //
        ["FF 362-75", "ES7N30GN"], //
        ["FF 419-6", "ES1N43GN"], //
        ["FF 560", "ES8N33HN"], //
        ["FF 560-30", "ES7N48GN00"], //
        ["FF 566", "ES4N48GN"], //
        ["FC 451-30", "SA2N44GN"], //
        ["FC 485-6", "SA1N22GN"], //
        ["FC 600", "SA0W64GN"], //
        ["FF 677", "ES1W32GN00"], //
        ["FF 695", "ES1W18GN00"], //
        ["FF 696", "ES1N48GN"], //
        ["FF 698-50", "ES4W97LN00"], //
        ["FF 742-42", "ES0W81HN"], //
        ["FF 938", "ES0N20GN"], //
        ["FF 938-50", "ESGN19LN"], //
        ["FH 49", "ES1W04GN00"], //
        ["FO 314-79", "K00N46N"], //
        ["FR 420-32", "ES1N18GN"], //
        ["FR 1020-26", "ES7N41KN"], //
        ["FR 1020-29", "SA4W64GM02"], //
        ["FR 1042", "ES2W36GN"], //
        ["FR 1061-61", "ES1W13LN"], //
        ["FX 324-3", "RE4N49KN00"], //
        ["FX 387-63", "RE4N29KN"], //
        ["FX 571-50", "RE0N96GN"], //
        ["FX 599-4", "RE4N73KN"], //
        ["FX 953-35", "RE4N21KN"], //
        ["FX 967", "RE2N72GN00"], //
        ["FX 987", "RE0W38GN"], //
        ["FX 745-50", "RE1N60GN"], //
        ["FX 764-5", "RE0W36GN"], //
        ["FX 1015-15", "RE4N60GN00"], //
        ["FX 1027-10", "RE1N08GN"], //
        ["FY 876-41", "RE2N66GN"], //
        ["FY 910-10", "SA7N12GN"], //
        ["FY 911-16", "SA1N66GN"], //
        ["FY 911-60", "BA2W07LN00"], //
        ["FY 548-25", "SAAN35KN"], //
        ["FY 550-50", "SA3N98GN"], //
        ["FY 829-12", "SA4N40GN"], //
        ["FY 871", "SA4W11LN00"], //
        ["FY 875-90", "BA0W95LN"], //
        ["FY 303-3", "SA2N42GN"], //
        ["FY 915-76", "SA1N38GN"], //
        ["FY 928-87", "BA0W80GN"], //
        ["FY 928-96", "SABN79LN"], //
        ["FY 931-16", "BA0W86GN"], //
        ["FY 931-98", "BA0W74GN"], //
        ["FY 932-62", "SA2W11HN"], //
        ["FY 934-38", "SA4N60GN"], //
        ["FY 936-96", "SA1W24GN"], //

        ["PA 462-16H", "300T01AN"],
        ["PA 462-17D", "300T20ANS"],
        ["PA 462-17EA", "300T44ANS"],
        ["PA 462-17F", "300T04AN"],
        ["PA 462-18E", "300T12AN"],
        ["PA 462-19C", "300W01AN00"],
        ["PA 463-3C", "305W03AN00"],
        ["PA 463-5H", "305T02AN"],
        ["PA 463-5H", "305T04AN"],
        ["PA 463-11A", "305W04AN"],
        ["PA 464-55B", "310W11GN"],
        //[ "PA 464-55C", "SEIKO ????"],//For Reflector Ring
        ["PA 464-58", "310T14AN"],//For Reflector Ring
        ["PA 464-59", "308W03AN"],
        ["PA 464-64AW", "310T18ANS"],//With White Step Ring
        ["PA 464-64AY", "310T18ANG"],//With Yellow Step Ring
        ["PA 467-K", "310T49ANS0"],
        ["PA 467-1", "310WS3"],
        ["PA 467-11", "310T12AN"],//For Reflector Ring
        ["PA 467-12", "310T19AN"],
        ["PA 467-12", "310T21AN"],
        ["PA 467-12", "310T15AL"],//For Reflector Ring
        ["PA 467-21E", "310T08AN"],//For Reflector Ring
        ["PA 467-21H", "310T05AN"],//For Reflector Ring
        ["PA 467-21K", "310T10ANS"],
        ["PA 467-22", "310W01AN0"],
        ["PA 467-22A", "310T10AN"],//For Reflector Ring
        ["PA 467-22B", "310T10AN"], //For Reflector Ring
        ["PA 467-22E", "310WS3T"],//8031 7625
        ["PA 467-23E", "310WS5"],
        ["PA 467-23E", "310W05AN"],
        ["PA 467-23H", "310W04AN"],//5740-8009
        ["PA 467-23T", "310W07AN"],
        ["PA 467-28", "313T01AN"],//For Reflector Ring
        ["PA 467-33", "313WS1T"],
        ["PA 467-53", "315T07AN"],//For Reflector Ring
        ["PA 467-58", "315T04AN"],//For Reflector Ring
        ["PA 467-71", "315T03ANS"],
        ["PA 467-71A", "315T08ANS"],//For Reflector Ring
        ["PA 467-76", "315T11AN"],//For Reflector Ring
        ["PA 467-89", "315T01ANS"],
        ["PA 467-89", "315WHIT2N71"],//6217-8001 //For Reflector Ring
        ["PA 467-89A", "315W02AN"],
        //[ "PA 467-97", "//31.7mm//SEIKO
        ["PA 468-85", "320T01AN"],//For Reflector Ring
        ["PA 468-87", "320W10GN"],
        ["PA 469-8K", "320W03AN0"],
        ["PA 469-8P", "320T04AN"],//For Reflector Ring
        ["PA 469-5A", "320T02AN"],//For Reflector Ring
        ["PA 469-6E", "320T07AN"],//For Reflector Ring
        ["PA 469-12", "320W05AN00"],
        ["PA 469-24", "320T08AN"],
        ["PA 469-26", "320W04AN"],
        ["PA 469-29", "320W02AN"],
        ["PA 471-71", "325WS1"],
        ["PA 471-71", "325W04AN"],
        ["PA 472-11", "320T02ANS"],
        ["PA 472-11", "325T02ANS"],//For Reflector Ring
        ["PA 472-12E", "325WS3"],
        ["PA 472-12H", "325W05AN"],
        ["PA 472-13F", "327W04AN00"],
        //[ "PA 472-13H", "32.83mm SEIKO
        //[ "PA 472-13K", "32.87mm SEIKO CHAMPION
        //[ "PA 472-13P", "32.87mm SEIKO
        ["PA 472-13T", "327W01AN"],
        ["PA 472-13X", "327W07AN"],
        ["PA 472-14H", "329W01AN00"],
        ["PA 472-14K", "330T03AN"],//For Reflector Ring
        ["PA 472-14P", "330W18GN"],
        ["PA 472-15H", "330T06ANS"],//For Reflector Ring
        //[ "PA 472-16", "33.05mm SEIKO Sea Lion M55
        ["PA 472-16A", "330T05AN"],//For Reflector Ring
        ["PA 472-16B", "330T10AN"],
        ["PA 472-18", "330T07AN"],//For Reflector Ring
        ["PA 472-19", "330WH4T"],
        ["PA 472-19A", "330T08AN"],//For Reflector Ring
        ["PA 472-21", "330T04AN"],//For Reflector Ring
        ["PA 472-22", "330WS2"],
        ["PA 472-22", "329W04AN"],//6220-8990
        ["PA 472-22K", "330W06AN"],
        ["PA 472-22P", "330T02AN"],
        ["PA 472-23", "300W01AN"],//SEIKO KSCM-33
        ["PA 472-23E", "330W02AN"],
        ["PA 472-46", "335W01A00"],
        ["PA 472-46", "335W02A00"],
        //[ "PA 472-55", "33.92mm SEIKO
        ["PA 472-60", "338W01AN"],
        ["PA 472-63", "340W12GN"],
        ["PA 472-65", "340T08AN"],
        ["PA 472-71", "340W14GN"],
        ["PA 472-72", "340WS1T"],
        ["PA 472-77", "340MS5"],
        ["PA 472-78", "340T06AN"],//For Reflector Ring
        //[ "PA 472-85", "34.15mm SEIKO
        ["PA 472-95", "340W06AN00"],
        ["PA 473-40", "340W02AN00"],//6206-9000
        ["PA 473-50", "4MT34W"],
        ["PA 473-50", "340W03AN"],
        ["PA 473-73", "340W10AN"],
        ["PA 474-5", "343W02AN"],
        ["PA 474-74", "MA34W"],
        ["PA 474-74", "343WS2"],
        ["PA 475-20", "343WH2"],
        ["PA 475-20", "341W02AN"],
        ["PA 476", "350W02AN0"]

    ];

    //These are unofficial matches that have beeen tried and proven, albeit with noted difference.
    //Just because it fits this case doesn't mean it will fit other cases that take the same seiko crystal code
    var CaseCode2SKnear = [
        ["7019-7040,7019-706", "XMF 310.848? flat"], //310W11GN  verified Jake Lewis
        ["6309-8070", "MF 315? fits"], //300W96GN00 verified Jake Lewis
        ["6106-8750,6106-8680", "XMF 310.848? 0.4mm too thick"], //310W28GN  verified Jake Lewis


    ];


    var Crystal_Seiko2SK = [
        ["170N02GN", "XMF 170.856"],
        ["18ON10GN", "XMF 180.852"],
        ["180W26JKO1", "XMF 180.703"],
        ["185TO5", "XAC 186.682"],
        ["190N20GN", "XMF 190.854"],
        ["19OW01AL", "XS 191.186"],
        ["190W35HNOO", "XMF 190.845"],
        ["195TO3ANS0", "XAC 196.665"],
        ["195TO3AASO", "XAC 196.665"],
        ["195W01ALO", "XS 196.136"],
        ["195W07ALOO", "XS 196.444"],
        ["195W07SL", "XS 196.444"],
        ["200N37KNOO", "XMF 200.851"],
        ["200TO4ANSO", "XAC 201.677"],
        ["200W01AN", "XS 201.406"],
        ["200W49 LNOO", "XMF 200.864"],
        ["205T25ANSO", "XAC 206.683"],
        ["205T25ANG", "XAG 206.696"],
        ["21OTO4ANS", "XAC 211.663"],
        ["215T13AEGO", "XAG 216.599"],
        ["225T01AASO", "XAC 226.662"],
        ["265N06GNOO", "XMF 265.874"],
        ["266W01AN", "XS 268.410"],
        ["280N25KNOO", "XMF 280.872"],
        ["285N05KNOO", "XMF 285.875"],
        ["285W12GNOO", "XMF 285.877"],
        ["285W61LNOO", "XPVIF 285.876"],
        ["290N06GGNOO", "XMF 290.873"],
        ["290W08GN", "XMF 290.861"],
        ["293W01ANOO", "XS 295.445"],
        ["295N15KNOO", "XMF 295.871"],
        ["295W16GA", "XMF 295.849"],
        ["295W29HNOO", "XMF 295.859"],
        ["295W29LNOO", "XMF 295.858"],
        ["295W35HNOO", "XMF 295.846"],
        ["295W41LNOO", "XMF 295.850"],
        ["295W43LNOO", "XMF 295.839"],
        ["300T03ANG", "XAG 301.532"],
        ["300TO3ANS", "XAC 301.641"],
        ["300T04ANG", "XAG 301.616"],
        ["300T04ANS", "XAG 301.617"],
        ["300TO7ANG", "XAG 301.639"],
        ["300T07ANS", "XAC 301.640"],
        ["300T1OANG", "XAG 301.618"],
        ["300T1OANS", "XAC 301.619"],
        ["300T12ANG", "XAG 301.540"],
        ["300T12ANS", "XAC 301.541"],
        ["300T15ANG", "XAG 301.620"],
        ["300T15ANS", "XAC 301.621"],
        ["300T20ANG", "XAG 301.642"],
        ["300T20ANS", "XAC 301.598"],
        ["300T31ALSO", "XAC 301.684"],
        ["300T33AASO", "XAC 301.685"],
        ["300T40ANA0", "XAG 301.661"],
        ["300T44ANG", "XAG 301.645"],
        ["300T44ANS", "XAC 301.646"],
        ["300W76GN", "XMF 300.862"],
        ["300W96GN", "XMF 300.863"],
        ["300W08GN", "XMF 300.860"],
        ["305W20GNOO", "MFO 305"],
        ["308W03AN", "XS 310.435"],
        ["10T04ANG", "XAG 311.582"],
        ["310T04ANS", "XAC 311.608"],
        ["310T08ANG", "XAG 311.643"],
        ["310T08ANS", "XAC 311.558"],
        ["310T10ANG", "XAG 311.531"],
        ["310T10ANS", "XAC 311.523"],
        ["310T11ANG", "XAG 311.623"],
        ["310T11ANS", "XAC 311.624"],
        ["310T12ANS", "XAC 311.569"],
        ["310T14ANG", "XAG 311.625"],
        ["310T14ANS", "XAC 311.626"],
        ["310T16ANG", "XAG 311.530"],
        ["310T16ANS", "XAC 311.569"],
        ["310T18ANG", "XAG 311.649"],
        ["310T18ANS", "XAC 311.650"],
        ["310T19ANG", "XAG 310.627"],
        ["310T19ANS", "XAC 310.583"],
        ["310T23ANS", "XAC 311.652"],
        ["310T25ANG", "XAG 311.628"],
        ["310T25ANS", "XAC 311.629"],
        ["310T48ANG", "XAG 311.647"],
        ["310T48ANS", "XAC 311.648"],
        ["310T49ANG", "XAG 311.651"],
        ["310T49ANSO", "XAC 311.652"],
        ["310T51ACS", "XAC-FAC 311.686"],
        ["310T57ANG", "XAG 311.676"],
        ["310T57ANS0", "XAC 311.664"],
        ["310T57AASO", "XAC 311.664"],
        ["310W01AN", "XS 312.436"],
        ["310W04AN", "XS 312.408"],
        ["310W17GNOO", "XMF 310.848"],
        ["310W17LNOO", "XMF 310.848"],
        ["310W19GNOO", "XMF 310.847"],
        ["310W21GNOO", "XMF 310.857"],
        ["310W50GN", "XMF 310.853"],
        ["310W52GNOO", "XMF 310.857"],
        ["313T01ANG", "XAG 314.542"],
        ["313T01ANS", "XAC 314.543"],
        ["315T04ANG", "XAG 316.630"],
        ["315T04ANS", "XAC 316.631"],
        ["315T08ANS", "XAC 316.524"],
        ["315W02AN", "XS 317.407"],
        ["318N02AN", "X 319.058"],
        ["320T01ANG", "XAG 321.644"],
        ["320T01ANS", "XAC 321.528"],
        ["320T02ANG", "XAG 321.632"],
        ["320T02ANS", "XAC 321.525"],
        ["320T04ANG", "XAG 321.637"],
        ["320T04ANS", "XAC 321.638"],
        ["32OT15ANG", "XAG 321.633"],
        ["32OT15ANS", "XAC 321.634"],
        ["320T21ANG", "XAG 321.635"],
        ["320T21ANS", "XAC 321.636"],
        ["320W03AN", "XS 322.409"],
        ["320W05AN", "XS 322.422"],
        ["320W19GNOO", "XMF 320.855"],
        ["325T02ANG", "XAG 326.533"],
        ["325T02ANS", "XAC 326.534"],
        ["325W04AN", "XS 327.125"],
        ["325WO5AN", "XS 327.161"],
        ["325WO6AN", "XS 327.160"],
        ["327W01ANOO", "XS 329.437"],
        ["327W08AN", "XS 329.126"],
        ["329W01ANOO", "XS 331.438"],
        ["330W16GN", "XMD 330.844"],
        ["330W18GN", "XMD 330.821"],
        ["335W01AN", "XS 337.127"],
        ["338N01AN", "X 338.052"],
        ["340N05AN", "X 344.059"],
        ["340T06ANG", "XAG 341.544"],
        ["340T06ANS", "XAC 341.545"],
        ["340W02AN", "XS 342.128"],
        ["340W06AN00", "XS 342.162"],
        ["340W14GN", "XMD 340.811"],
        ["340W18GN", "XY 340.354"],
        ["341W02AN", "XS 343.439"],
        ["35OTO2ANG", "XAG 351.536"],
        ["350T02ANS", "XAC 351.537"],
        ["365V06GNSO", "XMF 365.900"],
        ["45120555", "XS 322.114"],
        ["BAOW16AN", "UT 239x294x309x329"],
        ["BAOW49LNOO", "MTR 219x284.1"],
        ["BAOW58AN", "UT 253x293x309x319"],
        ["BAOW91LNOO", "MTR 189x269.1"],
        ["BAOW95LNOO", "MTR 188x273.1"],
        ["ESOW09ANOO", "FB 314.371"],
        ["ES1W14GNOO", "MBS 253x288.1"],
        ["ES1W32GNOO", "MTS 256x255.1"],
        ["ES3N25ANOO", "RZR 229x159-7.5"],
        ["ESGN69JNOO", "MRS 195x180.1"],
        ["ESJN07HNOO", "MBR 285x245.1"],
        ["ESHN59HNOO", "MRR 235x220.1"],
        ["KOOW10AN", "FE 245.364"],
        ["KOOW16AN", "UEB 308x259x348x307"],
        ["K00W26AC", "FE 314.366"],
        ["REOWO2AN", "UR 297x231x308x299"],
        ["REOWO6AN", "UBT 230x295x310x328"],
        ["REOW12AC", "URT 278x218x308x328"],
        ["REOW21ANOO", "UR 290x270x331x311"],
        ["REOW24AC", "URB 192x147x225x209"],
        ["RE1W81LNO1", "MRS 260x245.1"],
        ["RE4N22GNOO", "MR 245x200.1"],
        ["RE6N73LNO0", "MR 240x200.1"],
        ["RE6N97LNO0", "MBR 270x220.1"],
        ["SAOW02AN", "FB 296.387"],
        ["SAOWO4AN", "FB 214.302"],
        ["SAOW06AN", "FB 294.350"],
        ["SAOW08AN", "UB 192x192x216x216"],
        ["SAOW16AN", "UB 275x255x300x300"],
        ["SAOW21AN00", "FB 321.365"],
        ["SAOW30AN", "FB 314.454"],
        ["SAOW31AN", "UB 289x269x332x312"],
        ["SAOW33AN", "UB 283x248x307x295"],
        ["SAOW48AN", "UB 217x192x242x217"],
        ["SAOW64GN00", "MBR 314x314.2"],
        ["SAOW82GN", "MBR 334x269.1"],
        ["SA1N38GN00", "MBR 274x254.1"],
        ["SA1WOOGN00", "MBR 313x274.1"],
        ["SA1W06GN00", "MBR 329x264.1"],
        ["SA1W23AN00", "UB 204x194x230x220"],
        ["SA1W50GN00", "MBR 308x263.1"],
        ["SA1W77HN00", "MBR 314x314.1"],
        ["SA2W14GN00", "MBR 288x268.1"],
        ["SA2W27HN00", "MBR 290x275.1"],
        ["SA3N00GN00", "MBR 200x175.1"],
        ["SA3N34GN00", "MBR 187x187.1"],
        ["SA3N4OGN00", "MBR 244x244.1"],
        ["SA3N42GN00", "MBR 257x246.1"],
        ["SA3N50GN", "MBR 291x256.1"],
        ["SA3W44GN00", "MBR 275x255.1"],
        ["SQOWO2AN", "UR 275x275x300x300"],
        //["unknown", "XS 355.124"],
        ["190PO1HN03", "XMF 190.926"],
        ["270WA0HK01", "XMF 270.700"],
        ["275W30HKO1 HL", "XMF 275.701"],
        ["310W62GNOO 1209", "XMF 310.925"],
        ["315W26HK01", "XMF 315.702"],
        ["320W42GNOO 1148", "XMF 320.927"],
        ["330W26GN00 HL", "XMF 330.928"],
        ["BAOP83LNO3", "MTR 255x235.1"],
        ["ESAW47LNO1", "MTR 265x255.1"],
        ["SA3W22GN", "MBR 220x200.1"]
    ];


    //My Retro Watches
    var SeikoMovement2MyRetroWatches = [
        ["3KoZ-VXDcSI", "0634"],
        ["Dj3pbJTkBR8", "6309"],
        ["ccXQAl-uHHg", series610_],
        ["7jOx3UVcpGU", series611_],
        ["XuPi0w5kPKU", "6139"],
        ["3JndhUFMZ0I", series70__],
        ["eLosFOLYoGs", "7S26"]
    ];


    //Richard Perrett Watchmaker
    var SeikoMovement2RichardParrett = [
        ["CA-pdrMNRd4", series560_],
        ["LoV3FQxBPfQ", series562_],
        ["cUUnvjqndoI", "6601"],
        ["gxFwcPNd9aA", series611_],
    ];


    //Spencer Klein
    var SeikoMovement2SpencerKlein = [
        ["GhA5DeNZaT0", "3703"],
        ["_bGkQN5IBzc", series52__],
        ["HQNA8E9XorI", series610_],
        ["s6pi8boNSHU", series611_],
        ["qeWqC7f3VdU", "6138"],
        ["cm_kH7xRWm4", "6139"],
        ["5c8LTGFzRfE", "6159"],
        ["i9klBSmzXUk", "6217"],
        ["3iNsD47TdoQ", "6306"],
        ["aU06vxPjXM0", "6309"],
        ["R8_NOJ-kD1k", "7548"],
        ["YwUR_75zZwU", "H556"],
        ["GgIrBLvRhDw", "H558"]
    ];


    //Spidiq8
    var SeikoMovement2Spidiq8 = [
        ["Vez4KKZp5Fk", "6602"],
        ["2uMe6hcu0c0", series70__]
    ];


    //Watch Repair Channel
    var SeikoMovement2WatchRepairChannel = [
        ["mgNuOiW4pmE", "4006"],
        ["6dAMBZfuLgo", "6117"],
        ["D6R-uNqjfjc", "6216"],
        ["cfVNqRgpY5A", "7S26"]
    ];


    //Doctor Watches N Clocks
    var SeikoMovement2DoctorWatches = [
        ["XdgM9wtygI0", "4006"],
        ["QBfG7S8Egng", "6218"],
        ["OpZNLXQcfGk", "6309"],
        ["a5ZpsCXYCCw", "7005"],
        ["kCbdwQf33qo", "7009"]
    ]

    //VTA
    var SeikoMovement2VTA = [
        ["G7PAkXPNAek", "A134"],
        ["AF9T5ato8_g", "3883"],
        ["BLcOXTRTSQU", series44__],
        ["dvgf8WU-2b8", "5717"],
        ["Aw-ts5gIr5A", "5740"],
        ["h4zpZsWSdfk", "6117"],
        ["J6uqgGlP4UY", series610_],
        ["J6uqgGlP4UY", series61_GS],
        ["X17sqFmaTf4", "6139"],
        ["kDqk0qDHpR0", "6159"],
        ["_fz5wogS7eE", "6218"]
    ];

    //if we linked to an output page that needs to choose an item from a selection box, then we pick up the new page here:
    var searchStr = queryObject.VintageSeikoSavvySearch_Search;
    if (searchStr != null) {
        if (url.startsWith("https://www.ebay" + ebayDomainExtension + "/")) {//+"/c/"
            //<select class="vi-msku__select-box listbox__control listbox__control--fluid" id="vi-msku__select-box-1000" selectboxid="1000" aria-label="Select A Part number &amp; Caliber" aria-describedby=""><option id="vi-msku__option-box--1" value="-1">Part number &amp; Caliber </option><option id="vi-msku__option-box-0" value="0">401001 / 7605A 7606A 7619A 762... </option><option id="vi-msku__option-box-1" value="1">401013 / 5126A 5139A </option><option id="vi-msku__option-box-2" value="2">401014 /  5106A </option><option id="vi-msku__option-box-3" value="3">401022 / 2559A </option><option id="vi-msku__option-box-4" value="4" disabled="disabled">401030 / 2501A B 2501C 2505A B... (Out Of Stock)</option><option id="vi-msku__option-box-5" value="5">401040 / 1004A B C D M </option><option id="vi-msku__option-box-6" value="6">401110 / 1104A 17j </option><option id="vi-msku__option-box-7" value="7">401111 / 1104A 21j 1144A </option><option id="vi-msku__option-box-8" value="8">401113 / 11A 1140A </option><option id="vi-msku__option-box-9" value="9">401100 / 10A B C M 1020A B C 1... </option><option id="vi-msku__option-box-10" value="10">401115 / 1120A </option><option id="vi-msku__option-box-11" value="11">401120 / </option><option id="vi-msku__option-box-12" value="12">401150 / 15A 1520A B Fine Seik... </option><option id="vi-msku__option-box-13" value="13">401172 / 17A </option><option id="vi-msku__option-box-14" value="14">401180 / 18A 18B 18M Seiko Uni... </option><option id="vi-msku__option-box-15" value="15">401190 / 19A 1920A Seiko Venus... </option><option id="vi-msku__option-box-16" value="16">401191 / 1904A </option><option id="vi-msku__option-box-17" value="17">401192 / 1944A 1944AB 1944B 1964A </option><option id="vi-msku__option-box-18" value="18">401200 / Seiko Fashion </option><option id="vi-msku__option-box-19" value="19">401210 / 21A C D 2102A C 2140A... </option><option id="vi-msku__option-box-20" value="20">401230 / 2104A B 2107A B 2117A... </option><option id="vi-msku__option-box-21" value="21">401250 / 2502A 2515A 2518A B 2... </option><option id="vi-msku__option-box-22" value="22">401253 / 2539A </option><option id="vi-msku__option-box-23" value="23">401270 / Seikomatic Lady </option><option id="vi-msku__option-box-24" value="24">401280 / Seiko Birdie / Special </option><option id="vi-msku__option-box-25" value="25">401431 / 5740C </option><option id="vi-msku__option-box-26" value="26">401441 / 4402A </option><option id="vi-msku__option-box-27" value="27" disabled="disabled">401450 / 4500A 4502A 4520A 4522A (Out Of Stock)</option><option id="vi-msku__option-box-28" value="28">401460 / 460 </option><option id="vi-msku__option-box-29" value="29">401470 / 6215A 6216A 6245A 6246A </option><option id="vi-msku__option-box-30" value="30">401525 / 61A 6102A </option><option id="vi-msku__option-box-31" value="31">401540 / 54A Seiko Champion , ... </option><option id="vi-msku__option-box-32" value="32">401560 / 5601A 5605A 5606A LM </option><option id="vi-msku__option-box-33" value="33">401565 / 5621A 5625A 5626A 564... </option><option id="vi-msku__option-box-34" value="34">401581 / 2706A </option><option id="vi-msku__option-box-35" value="35">401600 / 60M </option><option id="vi-msku__option-box-36" value="36">401610 / 6217A 6218ABC 394 603... </option><option id="vi-msku__option-box-37" value="37">401620 / 6220B C D M 6222A B C... </option><option id="vi-msku__option-box-38" value="38">401640 / 3180 </option><option id="vi-msku__option-box-39" value="39">401660 / 66A B 6602B 6660A 957... </option><option id="vi-msku__option-box-40" value="40">401680 / 44GS KING SEIKO 44A 4... </option><option id="vi-msku__option-box-41" value="41">401690 / 6601A B 6619A 6606B 2... </option><option id="vi-msku__option-box-42" value="42">401760 / 760 761 7622A C D 850... </option><option id="vi-msku__option-box-43" value="43">401805 / 4005A 4006A BELLMATIC </option><option id="vi-msku__option-box-44" value="44">401830 / 8305B C 8306A 8346A 8... </option><option id="vi-msku__option-box-45" value="45">401894 / </option><option id="vi-msku__option-box-46" value="46">401901 / 9011A 9011B 9011C 9011D </option><option id="vi-msku__option-box-47" value="47">401905 / 8800F 9011E 9011F </option><option id="vi-msku__option-box-48" value="48">401913 / 9119A </option></select>

            insertSelectionMulti(['select.vi-msku__select-box',
                'select.msku-sel'
            ], searchStr);
        }

        if (url.startsWith("https://www.esslinger.com/gs-watch-crystal-")) {
            var inputEl = document.querySelector('input.form-input.form-input--small');//input#customization_11_');
            if (inputEl != null) {
                inputEl.value = searchStr;
            }
        }

        if (url.startsWith("https://www.esslinger.com/genuine-seiko-replacement-watch-stems/")) {
            insertSelection('select.form-select.form-select--small', searchStr)
        }

        if (url.startsWith("https://www.ofrei.com/page721.html")) {
            //<input type="text" name="search_field" size="40">
            var ofreiinputEl = document.querySelector('input');
            if (ofreiinputEl != null) {
                ofreiinputEl.value = searchStr
            }
        }
    }

    function insertSelectionMulti(querySels, searchStr) {
        for (var a = 0; a < querySels.length; a++) {
            if (insertSelection(querySels[a], searchStr)) {
                return;
            }
        }
    }

    function insertSelection(querySel, searchStr) {
        var selectEl = document.querySelector(querySel);
        if (selectEl != null) {
            var options = selectEl.options;
            for (var iOpt = 0; iOpt < options.length; iOpt++) {
                var option = options[iOpt];
                if (option.label.startsWith(searchStr)) {
                    //options.selected = iOpt;
                    selectEl.selectedIndex = iOpt;
                    return true;
                }
            }
        }
        return false;
    }

    var popupBackgroundBlue = "rgba(176,224,230,0.95)";
    var seikoCrystalBlue = "rgb(32,122,187)";
    var sternKreuzYellow = "rgb(236, 218, 6)";
    var gsGreen = "rgb(141,217,172)";
    var gasketColor = "LIGHTCORAL";
    var crownColor = "rgb(229, 152, 102)";
    var stemColor = "pink";
    var fontsize = "95%";

    /* ----- Styling ---- */

    // Add css styles here that will be added to the header of the website
    // If you want to override an already existing style, use !important
    addGlobalStyle(
        '.vsss_popup{' +
        'z-index: 1000;' +
        'position: absolute;' +
        'left: 0;' +
        'font-size: ' + fontsize + ';' +
        'border-radius: 5px;' +
        'padding: 5px;' +
        'width: 155px;' +
        'box-shadow: 10px 10px 5px rgba(0.5, 0.5, 0.5, 0.2);' +
        '}' +

        '.vsss_icon{' +
        'margin: 3px;' +
        '}'

        +

        '.vsss_inner{' +
        'border-radius: 5px;' +
        'padding: 5px;' +
       // 'width: 144px;' +
        '}'
    );

    /* ----- Start parsing ----- */

    //if(url.startsWith("https://boley.de/en/case-parts")){        Boley();        return;    }

    //if(url.includes("tbm=isch")){ // google images - doesn't allow click thru
    //   return;
    //}

    if (url.includes("www.ebay.") && url.includes("/itm/")) {
       // root = root.querySelector("h1#itemTitle");
    }
    parse(root, 100);

    if (url.startsWith("http://cgi.julesborel.com/cgi-bin/")) {
        textTree(root, 10, function (textNode, element, maxTimes) {


            parseText(textNode, /035\d{4}/g, stemColor, "black", BorelProcessSeikoPart); //borel has many stem codes
            // if(--maxTimes <=0){
            //      return maxTimes;}
            //console.log("Vintage Seiko Savvy Search maxTimes "+maxTimes);
            return maxTimes;
        });
        Borel();
    }


    function parse(root, maxTimes) {

        textTree(root, maxTimes, function (textNode, element, maxTimes) {

            maxTimes -= parseText(textNode, SeikoVintageRegexOuter, popupBackgroundBlue, "black", processModel);
            maxTimes -= parseText(textNode, SeikoRoundCrystalRegex, seikoCrystalBlue, "white", preProcessCrystal);
            maxTimes -= parseText(textNode, SeikoGasketOldRegex, gasketColor, "black", processGasketOld);
           // maxTimes -= parseText(textNode, SeikoGasketNewRegex, gasketColor, "black", processGasketNew);
            maxTimes -= parseText(textNode, SeikoCrownRegex, crownColor, "black", processCrown);
            parseText(textNode, SeikoPartRegex, stemColor, "black", preProcessSeikoPart);
            parseText(textNode, SKRegex, seikoCrystalBlue, "white", processSKcrystals);
            // if(--maxTimes <=0){
            //      return maxTimes;}
            //console.log("Vintage Seiko Savvy Search maxTimes "+maxTimes);
            return maxTimes;
        });
    }

    function insertAfter(el, referenceNode) {
        referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
    }


    function createHoverspan(hoverColor, textColor, insertedSpan, findMatch, processFunc) {
        if (hoverspan != null) {
            destroyHoverspan();
        }
        hoverspan = document.createElement('span');
        hoverspan.style.backgroundColor = hoverColor;
        hoverspan.style.color = textColor;
        hoverspan.classList.add('vsss_popup');
        //hoverspan.style.top = insertedSpan.offsetHeight + "px";
        hoverspan.style.display = "inline";//"none";
        hoverspan.id = "hoverspan_" + findMatch;
        // hoverspan.style="white-space: nowrap";


        var bodyRect = document.body.getBoundingClientRect();
        var elemRect = insertedSpan.getBoundingClientRect();
        document.body.appendChild(hoverspan);
        hoverspan.style.left = elemRect.left - bodyRect.left + "px";
        hoverspan.style.top = insertedSpan.offsetHeight + elemRect.top - bodyRect.top + "px";
        hoverspan.insertedSpan = insertedSpan;

        hoverspan.onmouseover = function (e) {
            hoverspan.turningOff = false;
        };

        hoverspan.onmouseout = function (e) {
            hoverspan.turningOff = true;
            setTimeout(function () {
                if (hoverspan && hoverspan.turningOff) {
                    destroyHoverspan();
                }
            }, POPUP_TIMEOUT);
        };

        processFunc(hoverspan, findMatch);
        return hoverspan;
    }

    function destroyHoverspan() {
        document.body.removeChild(hoverspan);
        hoverspan.insertedSpan = null;
        hoverspan = null;
    }


    function parseText(textNode, regex, hoverColor, textColor, processFunc) {
        var text = textNode.nodeValue;
        var found = 0;
        var matches = text.match(regex);

        if (matches != null) {
            // console.log("Vintage Seiko Savvy Search: "+matches+"  text:"+text);

            var textPos = 0;
            //https://www.google.com/search?q=test&tbm=isch
            for (var key = 0; key < matches.length; key++) {
                found++;
                //console.log("Vintage Seiko Savvy Search found:" + found + "  " + text);
                var findMatch = matches[key].trim();
                var beforeI = text.indexOf(findMatch, textPos);
                var afterI = beforeI + findMatch.length;
                textNode.nodeValue = text.substring(textPos, beforeI);

                //textPos+=afterI
                var insertedSpan = document.createElement('span');
                insertedSpan.id = "inserted span_" + findMatch;
                insertedSpan.style.fontWeight = "inherit";
                insertedSpan.style.position = "relative";
                insertedSpan.style.textDecoration = "underline";
                insertedSpan.style.textDecorationColor = "powderblue";
                insertedSpan.style.textDecorationStyle = "wavy";
                insertedSpan.style.cursor = "pointer";
                // textNode.parentNode.appendChild(insertedSpan);
                insertAfter(insertedSpan, textNode);


                //Store these parameters so hoverspan can be created on mouseover.
                insertedSpan.hoverColor = hoverColor;
                insertedSpan.textColor = textColor;
                insertedSpan.findMatch = findMatch;
                insertedSpan.processFunc = processFunc;
                insertedSpan.turningOn = false;
                //
                insertedSpan.onmouseover = function (e) {
                    var _insertedSpan = e.currentTarget;
                    if (!hoverspan || hoverspan.insertedSpan != _insertedSpan) {
                        _insertedSpan.turningOn = true;
                        setTimeout(function () {
                            if (_insertedSpan.turningOn == true) {
                                createHoverspan(_insertedSpan.hoverColor, _insertedSpan.textColor, _insertedSpan, _insertedSpan.findMatch, _insertedSpan.processFunc);
                            }
                        }, POPUP_TIMEOUT);

                    } else {
                        if (hoverspan.insertedSpan == _insertedSpan) {
                            hoverspan.turningOff = false;
                        }
                    }
                };

                insertedSpan.onmouseout = function (e) {
                    var _insertedSpan = e.currentTarget;
                    _insertedSpan.turningOn = false;
                    if (hoverspan != null && hoverspan.insertedSpan == _insertedSpan) {
                        hoverspan.turningOff = true;
                        setTimeout(function () {
                            if (hoverspan != null && hoverspan.turningOff) {
                                destroyHoverspan();
                            }
                        },POPUP_TIMEOUT);
                    }
                };

                var matchText = document.createTextNode(findMatch);
                insertedSpan.appendChild(matchText);
                // console.log("Vintage Seiko Savvy Search "+textNode.parentNode);
                text = text.substring(afterI);
                var postText = document.createTextNode(text);
                insertAfter(postText, insertedSpan);
                textNode = postText;





            }
        }
        return found;
    }

    function BorelProcessSeikoPart(hoverspan, borelMatch) {
        processSeikoPart(hoverspan, borelMatch.substr(1));
    }

    function preProcessSeikoPart(hoverspan, seikoMatch) {
        processSeikoPart(hoverspan, seikoMatch.match(/\d{6}/g)[0]);
    }

    function processSeikoPart(hoverspan, match) {
        if (match.startsWith("35")) {
            hoverspan.innerText = "Seiko Stem:"
        }
        hoverspan.appendChild(addLink(' Google,', "https://www.google.com/search?q=seiko+" + match, match));
        hoverspan.appendChild(addLink(' Images,', "https://www.google.com/search?tbm=isch&q=seiko+" + match, match));
        //ebay
        hoverspan.appendChild(addLink(' Ebay,', "https://www.ebay" + ebayDomainExtension + "/sch/i.html?_from=R40&_trksid=m570.l1313&_nkw=seiko+" + match + "&_sacat=14324&LH_TitleDesc=0&_osacat=14324&_odkw=seiko+" + match + "0&LH_TitleDesc=0", match));
        hoverspan.appendChild(addLink(' Cousins', "https://www.cousinsuk.com/search?SearchTerm=SEI" + match));


        if (match.startsWith("35")) {
            //
            var vs4eStems = "354001,354009,354015,354020,354031,354417,354447,354510,354540,354581,35610,354611,354613,354692,354693,354710,354720,354721,354722,354723,354760,354844,354849,354822,354421,354560,354560,354720";
            if (vs4eStems.indexOf(match) >= 0) {
                hoverspan.appendChild(addLink('ebay-vs4e,', "https://www.ebay" + ebayDomainExtension + "/itm/GENUINE-SEIKO354xxx-STEMS-CHOOSE-FROM-LIST/182291653920?VintageSeikoSavvySearch_Search=" + match, match, "https://i.ebayimg.com/00/$(KGrHqYOKpcE19KT(zNzBNo),Db8CQ~~_7.JPG", 1.5));
            }

            var essStems = "351001,351071,351155,351164,351173,351177,351178,351200,351205,351207,351208,351260,351261,351291,351292,351332,351333,351546,351550,351580,351581,351584,351586,351651,351653,351702,351784,351788,351796,351807,351819,351880,351892,351931,354118,354126,354130,354222,354222A354300,354365,354530,354531,354788,354786,354902,354930,";
            if (essStems.indexOf(match) >= 0) {
                hoverspan.appendChild(addLink('esslinger', "https://www.esslinger.com/genuine-seiko-replacement-watch-stems/?VintageSeikoSavvySearch_Search=" + match, match, "https://cdn11.bigcommerce.com/s-iic0hc/product_images/faviconess.ico"));
            }

            var twjStems = "351061,351110,351130,351152,354009,354015,354016,354022,354025,354230,354417,354421,354423,354424,354495,354581,354601,354615,354616,354617,354692,354710,354720,354721,354805,354822,354844,354849,354900,354920,354941,357500,357611,357612,372601,401986,411040,4011078,351486,354455,351221,354261,351663,351142,354650,354765,354780,354786,354950,351036,351111,351121,351160,351211,351480,351482,351501,351822,354042,354073,354611,354680,354705,354810,354825,351081,351105,351112,351134,351144,351155,351164,351178,351208,351225,351291,351546,351580,351651,351670,351671,351702,351784,351807,351861,351890,351892,351931,354076,354128,354235,354351,354365,354370,354371,354530,354531,354532,354576,354770,354866,354902";
            if (twjStems.indexOf(match) >= 0) {
                hoverspan.appendChild(addLink('ebay-vs4e,', "https://www.ebay" + ebayDomainExtension + "/itm/Seiko-Wristwatch-Stems/173699520408?VintageSeikoSavvySearch_Search=" + match, match, "https://pics.ebaystatic.com/aw/pics/community/myWorld/imgBuddyBig12.gif"));
            }
        }

    }



    function processCrown(hoverspan, match) {

        //decode
        //\d\d[REDMW]\d\d[N][ASG]?\d?
        var desc = "Crown:";
        desc += " " + match[0] + "." + match[1] + "mm";
        switch (match[2]) {
            case "R":
        }
        if (match.length > 6) {
            switch (match[6]) {
                case "A":
                case "G": desc += ", gold"; break;
                case "S": desc += ", silver"; break;
            }
        }
        hoverspan.innerText = desc;

        hoverspan.appendChild(addLink(' Google,', "https://www.google.com/search?q=seiko+" + match, match));
        hoverspan.appendChild(addLink(' Images,', "https://www.google.com/search?tbm=isch&q=seiko+" + match, match));
        //ebay
        hoverspan.appendChild(addLink(' Ebay,', "https://www.ebay" + ebayDomainExtension + "/sch/i.html?_from=R40&_trksid=m570.l1313&_nkw=seiko+" + match + "&_sacat=14324&LH_TitleDesc=0&_osacat=14324&_odkw=seiko+" + match + "0&LH_TitleDesc=0", match));
        //already sold
        hoverspan.appendChild(addLink(' Ebay closed,', "https://www.ebay" + ebayDomainExtension + "/sch/i.html?_from=R40&_trksid=m570.l1313&_nkw=seiko+" + match + "&_sacat=14324&LH_TitleDesc=0&_osacat=14324&_odkw=seiko+" + match + "0&LH_TitleDesc=0&LH_Sold=1&_sop=15", match));
        //picclick
        hoverspan.appendChild(addLink(' Picclick,', "https://picclick.com/?q=seiko+" + match + "&descriptionSearch=true", match));
        // console.log("Vintage Seiko Savvy Search"+googEl);
        hoverspan.appendChild(addLink(' Yahoo Japan ,', "https://auctions.yahoo.co.jp/search/search?auccat=&tab_ex=commerce&ei=utf-8&aq=-1&oq=&sc_i=&exflg=1&p=seiko+" + match + "&x=0&y=0&fixed=0", match));
        hoverspan.appendChild(addLink(' Yahoo Japan closed ,', "https://auctions.yahoo.co.jp/closedsearch/closedsearch?n=100&va=seiko+" + match + "&vo=&ve=&auccat=23140&slider=0&ei=UTF-8&f_adv=1&fr=auc_adv&select=1", match));
        hoverspan.appendChild(addLink(' buyee,', "https://buyee.jp/item/search/query/" + match + "/category/23140?translationType=1", match));
        hoverspan.appendChild(addLink(' Zenmarket,', "https://zenmarket.jp/en/yahoo.aspx?c=23140&q="+match, match));//seiko%2b

        hoverspan.appendChild(addLink("Wrist Sushi", "https://wristsushi.proboards.com/search/results?what_at_least_one=" + match + "&display_as=1&search=Search", match, "https://storage.proboards.com/5353543/images/cPiwcK4xrq572teCE1j_.png"));
        hoverspan.appendChild(addLink("Seiko & Citizen", "https://www.thewatchsite.com/gtsearch.php?q=" + match, match));


    }

    function processGasketOld(hoverspan, findMatch) {
        var match = findMatch;

        //decode
        //var SeikoGasketOldRegex = /[ADBFOE][ABCDEFGHI]\d{4}[BLNOWYE]\d\d/g;
        var desc = "Gasket:";
        switch (match[0]) {
            case "A": desc += " A-profile"; break;
            case "B": desc += " B-profile"; break;
            case "D": desc += " D-profile"; break;
            case "F": desc += " Square profile"; break;
            case "0":
            case "O": desc += " Round profile"; break;
            case "E": desc += " Other profile"; break;
        }
        switch (match[1]) {
            case "A": desc += " W:0.60mm"; break;
            case "B": desc += " W:0.75mm"; break;
            case "C": desc += " W:0.90mm"; break;
            case "D": desc += " W:1.05mm"; break;
            case "E": desc += " W:0.85mm"; break;
            case "F": desc += " W:1.30mm"; break;
            case "G": desc += " W:0.40mm"; break;
            case "H": desc += " W:0.50mm"; break;
            case "I": desc += " W:0.55mm"; break;
            case "J": desc += " W:0.80mm"; break;
        }

        desc += " ID:" + match[2] + match[3] + "." + match[4] + match[5] + "mm";
        if (match.length > 6) {
            switch (match[6]) {
                case "B": desc += " Black"; break;
                case "L": desc += " Blue"; break;
                case "N": desc += " Grey"; break;
                case "O": desc += " Trans"; break;
                case "W": desc += " White"; break;
                case "Y": desc += " Yellow"; break;
                case "E": desc += " Other color"; break;
            }
            if (match.length > 7) {
                switch (match[7]) {
                    case "0": desc += " Circle"; break;
                    case "1": desc += " Square"; break;
                    case "2": desc += " Rect"; break;
                    case "3": desc += " Other shape"; break;
                }
            }
        }

        console.log("Vintage Seiko Savvy Search " + desc);
        hoverspan.innerText = desc;
        //hoverspan.style.fontSize = "80%";

        hoverspan.appendChild(addLink(' Google,', "https://www.google.com/search?q=" + match, match)); //google it
        //hoverspan.appendChild(addLink( ' Images,', "https://www.google.com/search?tbm=isch&q="+match, match)); //google image it.
        //   hoverspan.appendChild(addLink( ' Jules,', "http://cgi.julesborel.com/cgi-bin/matcgi2?ref=SEK+CS%23"+match+"&submit=Search", match)); //http://cgi.julesborel.com/cgi-bin/matcgi2?ref=SEK+CS%231100-0010&submit=Search
        //   hoverspan.appendChild(addLink( ' Boley,', "https://boley.de/en/case-parts?s=50&q="+match+"&l=18", match)); //https://boley.de/en/case-parts?s=50&q=6106-7510&l=18

        //ebay
        hoverspan.appendChild(addLink(' Ebay,', "https://www.ebay" + ebayDomainExtension + "/sch/i.html?_from=R40&_trksid=m570.l1313&_nkw=" + match + "&_sacat=14324&LH_TitleDesc=0&_osacat=14324&_odkw=seiko+" + match + "0&LH_TitleDesc=0", match));
        //already sold
        //hoverspan.appendChild(addLink(' Ebay,', "https://www.ebay"+ebayDomainExtension+"/sch/i.html?_from=R40&_trksid=m570.l1313&_nkw="+match+"&_sacat=14324&LH_TitleDesc=0&_osacat=14324&_odkw=seiko+"+match+"0&LH_TitleDesc=0&LH_Sold=1&_sop=15", match));
        //picclick
        //hoverspan.appendChild(addLink(' picclick,', "https://picclick.com/?q=seiko+"+match+"&descriptionSearch=true", match));
        // console.log("Vintage Seiko Savvy Search"+googEl);

        hoverspan.appendChild(addLink(' Yahoo Japan ', "https://auctions.yahoo.co.jp/search/search?auccat=&tab_ex=commerce&ei=utf-8&aq=-1&oq=&sc_i=&exflg=1&p=seiko+" + match + "&x=0&y=0&fixed=0", match));

        //buyee
        //hoverspan.appendChild(addLink(' buyee,', "https://buyee.jp/item/search/query/"+match+"/category/23140?translationType=1", match));
        //hoverspan.appendChild(document.createElement("br"));



        hoverspan.appendChild(addLink(' CousinsUK,', "https://www.cousinsuk.com/search?SearchTerm=Seiko " + match));
        hoverspan.appendChild(addLink("Wrist Sushi", "https://wristsushi.proboards.com/search/results?what_at_least_one=" + match + "&display_as=1&search=Search", match, "https://storage.proboards.com/5353543/images/cPiwcK4xrq572teCE1j_.png"));
        hoverspan.appendChild(addLink("Seiko & Citizen", "https://www.thewatchsite.com/gtsearch.php?q=" + match, match));
    }

    function decodeCrystalNumber(match) {
        //decode
        //SeikoRoundCrystalRegex = /[23]\d[05][WTVGXNDRYAP]\d\d[AEGHJKLSZ][NCKBDEAMHUGPZFVJRWTLY][MLPVYOSGE]?/g;
        //var SeikoGasketOldRegex = /[ADBFOE][ABCDEFGHI]\d{4}[BLNOWYE]\d\d/g;
        var desc = match + " Crystal:";

        var notRoundRegEx = /[ATSREBKW][LDQESAO]/g; //starts with 2 letters
        var foundNotRound = match.match(notRoundRegEx);
        if (foundNotRound != null) {
            var shapeCode = foundNotRound[0];
            switch (shapeCode) {

                case "AL": desc += " Almond"; break;
                case "TD": desc += " Teardrop"; break;
                case "SQ": desc += " Square"; break;
                case "RE": desc += " Rectangle"; break;
                case "ES": desc += " Other Shape"; break;
                case "BA": desc += " Barrel"; break;
                case "KO": desc += " Oval"; break;
                case "SA": desc += " Rounded Rectangle"; break;
                case "WA": desc += " Lozenge"; break;

            }
        } else {//round
            desc += " " + match[0] + match[1] + "." + match[2] + "mm";
        }
        switch (match[3]) {
            case "T": desc += ", tension ring";
            case "W": desc += ", water resist"; break;

            case "V":
            case "G": desc += ", ring or bezel, water resist"; break;
            case "X": desc += ", other accessory, water resist"; break;
            case "N": break;
            case "D": desc += ", tension ring"; break;
            case "R": desc += ", ring or bezel"; break;
            case "Y": desc += ", other accessory"; break;
            case "A": desc += ", bonded"; break;
            case "P": desc += ", Pressed in using platic gasket"; break;
        }
        switch (match[6]) {
            case "A": desc += ", Acrylic glass"; break;
            case "B": desc += ", Acrylic glass/others"; break;
            case "G":
            case "H":
            case "J":
            case "K":
            case "L": desc += ", Hardlex"; break;
            case "S": desc += ", Sapphire"; break;
            case "Z": desc += ", Other Material"; break;

        }


        if (match.length > 7) {
            switch (match[7]) {
                // case "N": desc+=", Ordinary Finish";break; //we don't need this
                case "C": desc += ", Cut Glass"; break;
                case "K": desc += ", Curved Glass"; break;
                case "B": desc += ", No-Reflect"; break;
                case "D": desc += ", Antistatic"; break;
                case "A": desc += ", Anti-fogging"; break;
                case "E": desc += ", Ion plating"; break;
            }
            if (match.length > 8) {
                switch (match[8]) {
                    case "M": desc += ", Green"; break;
                    case "L": desc += ", Blue"; break;
                    case "P": desc += ", Pink"; break;
                    case "V": desc += ", Violet"; break;
                    case "Y": desc += ", Yellow"; break;
                    //case "0": case "O": desc+=", Trans";break;  //we dont need this
                    case "S": desc += ", Silver Ring"; break;
                    case "G": desc += ", Gold Ring"; break;
                    case "E": desc += ", Other Color Tone"; break;
                }
            }
        }

        //   console.log("Vintage Seiko Savvy Search "+desc);
        return desc;
    }

    function preProcessCrystal(hoverspan, match) {
        hoverspan.style.backgroundColor = seikoCrystalBlue;
        hoverspan.innerText = decodeCrystalNumber(match);
        processCrystal(hoverspan, match, null);
    }


    function processCrystal(hoverspan, wholematch, casecode) {

        //hoverspan.style.fontSize = "80%";



        var match = wholematch.substring(0, 8);// best discard any further digits


        hoverspan.appendChild(addLink(' Google,', "https://www.google.com/search?q=" + match, match)); //google it
        hoverspan.appendChild(addLink(' Images,', "https://www.google.com/search?tbm=isch&q=" + match, match)); //google image it.
        hoverspan.appendChild(addLink( ' Jules,', "http://cgi.julesborel.com/cgi-bin/matcgi2?ref=SEK+CS%23"+match+"&submit=Search", match)); //http://cgi.julesborel.com/cgi-bin/matcgi2?ref=SEK+CS%231100-0010&submit=Search
        hoverspan.appendChild(addLink( ' Boley,', "https://boley.de/en/case-parts?s=50&q="+match+"&l=18", match)); //https://boley.de/en/case-parts?s=50&q=6106-7510&l=18

        //ebay
        hoverspan.appendChild(addLink(' Ebay,', "https://www.ebay" + ebayDomainExtension + "/sch/i.html?_from=R40&_trksid=m570.l1313&_nkw=" + match + "&_sacat=14324&LH_TitleDesc=0&_osacat=14324&_odkw=seiko+" + match + "0&LH_TitleDesc=0", match));
        //already sold
        hoverspan.appendChild(addLink(' Ebay closed,', "https://www.ebay" + ebayDomainExtension + "/sch/i.html?_from=R40&_trksid=m570.l1313&_nkw=" + match + "&_sacat=14324&LH_TitleDesc=0&_osacat=14324&_odkw=seiko+" + match + "0&LH_TitleDesc=0&LH_Sold=1&_sop=15", match));
        //picclick
        hoverspan.appendChild(addLink(' Picclick,', "https://picclick.com/?q=seiko+" + match + "&descriptionSearch=true", match));
        // console.log("Vintage Seiko Savvy Search"+googEl);
        //watchcharts
        hoverspan.appendChild(addLink(' Watchcharts,',"https://watchcharts.com/watches/search?q=Seiko%20"+match, match));

        hoverspan.appendChild(addLink(' Yahoo Japan ', "https://auctions.yahoo.co.jp/search/search?auccat=&tab_ex=commerce&ei=utf-8&aq=-1&oq=&sc_i=&exflg=1&p=seiko+" + match + "&x=0&y=0&fixed=0", match));
        hoverspan.appendChild(addLink(' Yahoo Japan closed ,', "https://auctions.yahoo.co.jp/closedsearch/closedsearch?n=100&va=seiko+" + match + "&vo=&ve=&auccat=23140&slider=0&ei=UTF-8&f_adv=1&fr=auc_adv&select=1", match));

        //buyee
        hoverspan.appendChild(addLink(' Buyee,', "https://buyee.jp/item/search/query/" + match + "/category/23140?translationType=1", match));
        hoverspan.appendChild(addLink(' Zenmarket,', "https://zenmarket.jp/en/yahoo.aspx?c=23140&q="+match, match));//seiko%2b
        //hoverspan.appendChild(document.createElement("br"));

        hoverspan.appendChild(addLink('AliExpress', "https://www.aliexpress.us/w/wholesale-"+match+".html?spm=a2g0o.productlist.search.0", match));

        // hoverspan.appendChild(document.createElement("br"));

        hoverspan.appendChild(addLink('Ofrei', "https://www.ofrei.com/page721.html?VintageSeikoSavvySearch_Search=" + match, match, "https://www.ofrei.com/NavLogo.gif", 3.86));//https://imgur.com/xObW8LH.jpg"));//
        hoverspan.appendChild(addLink('CousinsUK', "https://www.cousinsuk.com/search?SearchTerm=Seiko " + match));
        hoverspan.appendChild(addLink('TipTop', "https://www.tiptopcrystals.com/index.php?main_page=advanced_search_result&search_in_description=1&keyword=" + match, match, "https://www.tiptopcrystals.com/favicon.ico"));
        hoverspan.appendChild(addLink('Gleave', "https://gleave.london/search.php?search_query=Glass%2C%20Seiko%20"+match+"00&section=product", match, "https://cdn11.bigcommerce.com/s-668rx7rtml/images/stencil/original/logo_1599211940__78323.original.jpg", 4.0));
        hoverspan.appendChild(addLink("Wrist Sushi", "https://wristsushi.proboards.com/search/results?what_at_least_one=" + match + "&display_as=1&search=Search", match, "https://storage.proboards.com/5353543/images/cPiwcK4xrq572teCE1j_.png"));
        hoverspan.appendChild(addLink("Seiko & Citizen", "https://www.thewatchsite.com/gtsearch.php?q=" + match, match));

        var skmatches = findInList(match, Crystal_Seiko2SK, 0, 1);
        // console.log("Vintage Seiko Savvy Search SK:"+skmatches);
        let catalogue = hoverspan;
        if (skmatches.length == 0 && casecode != null) {
            skmatches = findInList(casecode, CaseCode2SKnear, 0, 1);
        }
        for (var i = 0; i < skmatches.length; i++) {
            let skmatchwhole = skmatches[i];
            catalogue = processSKcrystals(hoverspan, skmatchwhole, wholematch);
        }
      //  catalogue.appendChild(addLink(' G-S ,', "https://gssupplies.com/wp-content/uploads/2017/06/G-S-Crystal-Catalog.pdf", match, "https://gssupplies.com/wp-content/uploads/2017/03/favicon-45x45.png")); //?VintageSeikoUserscipt_Copy="+match

        //G-S Crystals
        catalogue = hoverspan;
        var gsmatches = findInList(match, Crystal_Seiko2GS, 1, 0);
        //  console.log("Vintage Seiko Savvy Search GS:"+gsmatches);
        for (i = 0; i < gsmatches.length; i++) {
            var gsmatch = gsmatches[i];
            // hoverspan.appendChild(document.createElement("br"));
            var gsEl = document.createElement("div");
            gsEl.id = "gsspan";
            gsEl.style.backgroundColor = gsGreen;
            gsEl.classList.add('vsss_inner');
            gsEl.style.color = "black";
        //    gsEl.style.width = "134px";
            gsEl.innerText = "GS:" + gsmatch;
            gsEl.appendChild(addLink(' Google,', "https://www.google.com/search?q=" + gsmatch, gsmatch)); //google it
            gsEl.appendChild(addLink(' Ebay,', "https://www.ebay" + ebayDomainExtension + "/sch/i.html?_from=R40&_trksid=m570.l1313&_nkw=" + gsmatch + "&_sacat=14324&LH_TitleDesc=0&_osacat=14324&_odkw=" + gsmatch + "0&LH_TitleDesc=0", gsmatch));
            gsEl.appendChild(addLink('TipTop', "https://www.tiptopcrystals.com/index.php?main_page=advanced_search_result&search_in_description=1&keyword=" + gsmatch, gsmatch,"https://www.tiptopcrystals.com/favicon.ico"));
            var stmatch = gsmatch.replace(" ", "").replace("-", "/");
            gsEl.appendChild(addLink('ST', "https://stsupplyonline.com/catalog/advanced_search_result.php?keywords=GS-" + stmatch + "&x=0&y=0", gsmatch, "https://stsupplyonline.com/favicon.ico"));
            if (gsmatch.startsWith("PA")) {
                gsEl.appendChild(addLink('Esslinger', "https://www.esslinger.com/gs-watch-crystal-pa-water-resistant/?VintageSeikoSavvySearch_Search=" + gsmatch, gsmatch, "https://cdn11.bigcommerce.com/s-iic0hc/product_images/faviconess.ico"));
            } else if (gsmatch.startsWith("F")) {
                gsEl.appendChild(addLink('Esslinger', "https://www.esslinger.com/gs-watch-crystal-f-flat-fancy/?VintageSeikoSavvySearch_Search=" + gsmatch, gsmatch, "https://cdn11.bigcommerce.com/s-iic0hc/product_images/faviconess.ico"));
            } else if (gsmatch.startsWith("C")) {
                gsEl.appendChild(addLink('Esslinger', "https://www.esslinger.com/gs-watch-crystal-c-cylinder/?VintageSeikoSavvySearch_Search=" + gsmatch, gsmatch, "https://cdn11.bigcommerce.com/s-iic0hc/product_images/faviconess.ico"));
            } else { }
            hoverspan.appendChild(gsEl);
            catalogue = gsEl;
        }

    }


    //STERNKREUZ CRYSTALS

    function processSKcrystals(hoverspan, skmatchwhole, wholematch) {

        let skmatch = skmatchwhole.split("?")[0];
        // hoverspan.appendChild(document.createElement("br"));
        var skEl = document.createElement("div");
        skEl.id = "skspan";
        skEl.style.backgroundColor = sternKreuzYellow;
        skEl.classList.add('vsss_inner');
        //skEl.style.width = "100%";
        var colorStr = "";
        if (skmatch.startsWith("XAG")) {
            if (wholematch!=null && wholematch.length > 8 && wholematch[8] == "S"){
                return; }
            colorStr = " Gold";
        }
        if (skmatch.startsWith("XAC")) {

           if (wholematch!=null && wholematch.length > 8 && wholematch[8] == "G"){
               return; }
           colorStr = " Silver";
        }

        skEl.style.color = "red";

        skEl.innerText = "SK:" + skmatchwhole + colorStr;
        skEl.appendChild(addLink(' Google,', "https://www.google.com/search?q=" + skmatch, skmatch)); //google it
        skEl.appendChild(addLink(' Ebay,', "https://www.ebay" + ebayDomainExtension + "/sch/i.html?_from=R40&_trksid=m570.l1313&_nkw=" + skmatch + "&_sacat=14324&LH_TitleDesc=0&_osacat=14324&_odkw=Sternkreuz+" + skmatch + "0&LH_TitleDesc=0", skmatch));
        skEl.appendChild(addLink(' CousinsUK,', "https://www.cousinsuk.com/search?SearchTerm=" + skmatch, skmatch));


        hoverspan.appendChild(skEl);

        return skEl;
    }




    function findInList(seikoCode, list, searchIndex, returnIndex) {
        let matches = [];
        var matchlength = seikoCode.length;
        // console.log("Vintage Seiko Savvy Search "+seikoCode+": "+matchlength);
        list.forEach(function (item, index, array) {
            var shortStr = item[searchIndex]; var longStr = seikoCode;
            if (shortStr.length > matchlength) {
                longStr = shortStr;
                shortStr = seikoCode;
            }
            if (longStr.indexOf(shortStr) >= 0) {
                matches.push(item[returnIndex]);
            }
        });
        return matches;
    }




    function processModel(hoverspan, findMatch) {
        var innerMatch = findMatch.match(SeikoVintageRegexInner);
        var match = innerMatch[0].replace(" ", "-").replace("\u30FC", "-").replace("\uFF70", "-").replace("--", "-").replace("---", "-");;
       // hoverspan.innerText = match + ":";

        //   text = textNode.nodeValue;



        //hoverspan.appendChild(document.createTextNode(" "+match+":"));
        var movement = match.substring(0, 4);
        var shortmatch = match.substring(0,8); //drops the last code digit

        // OUTPUT WEBSITES

        //RESEARCH
        //google it
        hoverspan.appendChild(addLink(' Google,', "https://www.google.com/search?q=seiko+" + match, match));

        //google image it.
        hoverspan.appendChild(addLink(' Images,', "https://www.google.com/search?tbm=isch&q=seiko+" + match, match));


        //http://cgi.julesborel.com/cgi-bin/matcgi2?ref=SEK+CS%231100-0010&submit=Search
        hoverspan.appendChild(addLink(' Jules Borel,', "http://cgi.julesborel.com/cgi-bin/matcgi2?ref=SEK+CS%23" + match + "&submit=Search", match));

        //Boley
        //https://boley.de/en/case-parts?s=50&q=6106-7510&l=18
        hoverspan.appendChild(addLink(' Boley,', "https://boley.de/en/case-parts?s=50&q=" + match + "&l=18", match));
        //Ofrei
        hoverspan.appendChild(addLink('Ofrei', "https://www.ofrei.com/page721.html?VintageSeikoSavvySearch_Search=" + match, match, "https://www.ofrei.com/NavLogo.gif", 3.86));//https://imgur.com/xObW8LH.jpg"));//

        //hoverspan.appendChild(document.createElement("br"));
        //youtube /https://www.youtube.com/results?search_query=seiko+6119-8023
        hoverspan.appendChild(addLink(' YouTube,', "https://www.youtube.com/results?search_query=seiko+" + match, match));


        let FratelloReviewMatches = findInList(shortmatch, FratelloReview, 1, 0);
        for (let i = 0; i < FratelloReviewMatches.length; i++) {
            let s = FratelloReviewMatches[i];
            hoverspan.appendChild(addLink(' Fratellow,', "https://www.fratellowatches.com/" + s , match));
        }



        hoverspan.appendChild(addLink(' Speedtimer,', "https://speedtimerkollektion.com/shop/advanced_search_result.php?keywords=seiko " + movement + "&search_in_description=1", match, "https://speedtimerkollektion.com/shop/images/InfoPagesLogo.jpg"));


        hoverspan.appendChild(addLink(' Facebook,', "https://www.facebook.com/search/top/?q=seiko " + match));
        hoverspan.appendChild(addLink(' Pinterest,', "https://www.pinterest.com/search/pins/?q=seiko " + match));
        hoverspan.appendChild(addLink(' Twitter,', "https://twitter.com/search?q=seiko " + match));
        hoverspan.appendChild(addLink(' Instagram,', "https://www.instagram.com/explore/tags/seiko"+match.replace("-","")+"/"));



        //RETAIL
        let auctionToggle = insertToggleDiv(hoverspan, "auction", TOGGLE_SECTION_AUCTION);
        //ebay
        auctionToggle.appendChild(addLink(' Ebay,', "https://www.ebay" + ebayDomainExtension + "/sch/i.html?_from=R40&_trksid=m570.l1313&_nkw=seiko+" + match + "&_sacat=14324&LH_TitleDesc=0&_osacat=14324&_odkw=seiko+" + match + "0&LH_TitleDesc=0", match));
        //already sold
        auctionToggle.appendChild(addLink(' Ebay closed,', "https://www.ebay" + ebayDomainExtension + "/sch/i.html?_from=R40&_trksid=m570.l1313&_nkw=seiko+" + match + "&_sacat=14324&LH_TitleDesc=0&_osacat=14324&_odkw=seiko+" + match + "0&LH_TitleDesc=0&LH_Sold=1&_sop=15", match));
        //picclick
        auctionToggle.appendChild(addLink(' Picclick,', "https://picclick.com/?q=seiko+" + match + "&descriptionSearch=true", match));
        // console.log("Vintage Seiko Savvy Search"+googEl);

        auctionToggle.appendChild(addLink(' Yahoo Japan ,', "https://auctions.yahoo.co.jp/search/search?auccat=&tab_ex=commerce&ei=utf-8&aq=-1&oq=&sc_i=&exflg=1&p=seiko+" + match + "&x=0&y=0&fixed=0", match));

        //https://auctions.yahoo.co.jp/closedsearch/closedsearch?va=seiko&vo=&ve=&auccat=23140&aucminprice=&aucmaxprice=50000&slider=0&ei=UTF-8&f_adv=1&fr=auc_adv
        //https://auctions.yahoo.co.jp/closedsearch/closedsearch?select=6&p=seiko+7019-5050&auccat=23140&va=seiko+7019-5050&b=1&n=100
        auctionToggle.appendChild(addLink(' Yahoo Japan closed ,', "https://auctions.yahoo.co.jp/closedsearch/closedsearch?n=100&va=seiko+" + match + "&vo=&ve=&auccat=23140&slider=0&ei=UTF-8&f_adv=1&fr=auc_adv&select=1", match));

        //proxy bidders
        auctionToggle.appendChild(addLink(' Buyee,', "https://buyee.jp/item/search/query/" + match + "/category/23140?translationType=1", match));
        auctionToggle.appendChild(addLink(' Zenmarket,', "https://zenmarket.jp/en/yahoo.aspx?c=23140&q="+match, match));//seiko%2b
        //hoverspan.appendChild(document.createElement("br"));




        let forumToggle = insertToggleDiv(hoverspan, "forum", TOGGLE_SECTION_FORUM);
        // forumToggle.appendChild(addLink(' sleuth,', "http://www.watchsleuth.com/seiko5finder/search/?MOD="+match, match));
        //forumToggle.appendChild(addLink(' sleuthDiver,', "http://www.watchsleuth.com/seikodiverfinder/search/?MOD="+match, match));
        forumToggle.appendChild(addLink(' Watchpatrol', "https://www.watchpatrol.net/?query=" + match, match, "https://static.watchpatrol.net/static/explorer/img/logo_single_color.png?fcbf508e89aa"));
        forumToggle.appendChild(addLink(' WatchRecon', "https://www.watchrecon.com/?query=seiko " + match));
        forumToggle.appendChild(addLink("Wrist Sushi", "https://wristsushi.proboards.com/search/results?what_at_least_one=" + match + "&display_as=1&search=Search", match, "https://storage.proboards.com/5353543/images/cPiwcK4xrq572teCE1j_.png"));
        forumToggle.appendChild(addLink("Seiko & Citizen ", "https://www.thewatchsite.com/gtsearch.php?q=" + match, match));
        forumToggle.appendChild(addLink("WatchUseek", "https://forums.watchuseek.com/gtsearch.php?q=seiko " + match));
        forumToggle.appendChild(addLink("Seikoholics", "https://www.tapatalk.com/groups/seikoholics/search.php?keywords=%22" + match + "%22&terms=all&author=&sc=1&sf=all&sr=posts&sk=t&sd=d&st=0&ch=300&t=0&submit=Search", match, "https://groups.tapatalk-cdn.com/avatar/18545/6514361_1510401270.jpg"));
        //     hoverspan.appendChild(addLink(' 17,', "https://17jewels.info/movements/s/seiko/seiko-"+movement+"a", match,"https://17jewels.info/img/logo-small.png"));



        // hoverspan.appendChild(document.createElement("br"));

        //hoverspan.appendChild(addLink(' phDB ,', "http://uhrerbe.com/search.php?querry="+match, match));//6119-6023


        // hoverspan.appendChild(addLink(' trove ,', "https://www.trovestar.com/general/Search/callback.php?SearchString="+match+"&user_id=0&Collection=12&AdvancedFlag=1", match, "https://www.trovestar.com/images/logo/logo/Medium/TroveStar-logo_color_MD.png", 3.05));
        // console.log("maxTimes: "+maxTimes+" "+match);



        //movement based links
        let movementToggle = insertToggleDiv(hoverspan, "movement", TOGGLE_SECTION_MOVEMENT);
        let BidfunMatches = findInList(movement,Bidfun, 0,0);
        if(BidfunMatches.length>0){
            movementToggle.appendChild(addLink(' Bidfun,', "https://web.archive.org/web/20240519021734/http://ranfft.de/cgi-bin/bidfun-db.cgi?10&ranfft&0&2uswk&Seiko_" + BidfunMatches[BidfunMatches.length-1], match, "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://www.ranfft.de/cgi-bin/bidfun-db.cgi?10&size=32"));
        }
        let SeikomaticArchivesMatches = findInList(movement, SeikoMovement2SeikomaticArchive, 1, 0);
        for (let i = 0; i < SeikomaticArchivesMatches.length; i++) {
            let s = SeikomaticArchivesMatches[i];
            movementToggle.appendChild(addLink(' Seikomatic Archives,', "http://matic6246.web.fc2.com/" + s , match, "http://matic6246.web.fc2.com/62series/6036201/komalogo2.jpg", 2.40)); //https://imgur.com/SeFqW6T.jpg"));//
        }

        movementToggle.appendChild(addLink(' EmmyWatch,', "https://www.emmywatch.com/db/search/?search=Seiko+"+movement+"&type=movement", match, "https://www.emmywatch.com/wp-content/uploads/2021/12/cropped-emmywatch_site_favicon-1-32x32.png", 1.0));


        let WatchUseekManualsMatches = findInList(movement, WatchUseekManuals, 0, 0);
        for (let i = 0; i < WatchUseekManualsMatches.length; i++) {
            let s = WatchUseekManualsMatches[i];
            movementToggle.appendChild(addLink(' Tech Manual,', "https://www.thewatchsite.com/files/Seiko Technical Manuals/" + s+".pdf" , match));
        }

        var AAWFmatches = findInList(movement, SeikoMovement2AAWF, 1, 0);
        if (AAWFmatches.length > 0) {
            movementToggle.appendChild(addLink(' AAWF,', "https://adventuresinamateurwatchfettling.com/category/seiko/" + AAWFmatches[0] + "/", match, "https://0.gravatar.com/avatar/6b3dba56b1a4224fc65b2f8be3f74d5cd9d4d0b92d4b2db3077ffb04435f32cb?s=48&d=identicon&r=G",1.0));//"https://adventuresinamateurwatchfettling.files.wordpress.com/2012/04/header.jpg", 4.0));//https://i.imgur.com/v2BMifF.jpg"));//
        }

        var WWMatches = findInList(movement, SeikoMovement2WatchWiki, 1, 0);
        if (WWMatches.length > 0) {
            movementToggle.appendChild(addLink(' Watch Wiki,', "https://www.watch-wiki.net/index.php?title=" + WWMatches[0], match, "https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://www.watch-wiki.net/doku.php&size=32"));
        }

		movementToggle.appendChild(addLink(' Seiko Guy,', "https://www.theseikoguy.com/movements/" + movement +"/", match));

        addYouTubeLink('My Retro Watches', movement, SeikoMovement2MyRetroWatches, movementToggle, "https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myretrowatches.co.uk&size=16")
        addYouTubeLink('Richard Perrett Watchmaker', movement, SeikoMovement2RichardParrett, movementToggle, "https://www.richardperrett.com/wp-content/uploads/2018/11/RedShield-230x230.png")
        addYouTubeLink('Spencer Klein', movement, SeikoMovement2SpencerKlein, movementToggle, "https://images.squarespace-cdn.com/content/v1/59235d7059cc686f49e4b5a9/2d358ec0-e4db-4b54-82c9-6b7009f18f4e/logoedit.png?format=32w")
        addYouTubeLink('spidiq8', movement, SeikoMovement2Spidiq8, movementToggle, "https://yt3.ggpht.com/a/AGF-l7_55mCINBksJomZK9a2-r5J74rcLFw6g1qjgg=s288-c-k-c0xffffffff-no-rj-mo")
        addYouTubeLink('Watch Repair Channel', movement, SeikoMovement2WatchRepairChannel, movementToggle, "https://www.watchrepairlessons.com/favicon.ico")
        addYouTubeLink('Doctor Watches N Clocks', movement, SeikoMovement2DoctorWatches, movementToggle, "https://yt3.ggpht.com/a/AGF-l7-b8e9ubEyeIUrCf-cecdqBKVu2zzw18Z-htw=s200-c-k-c0xffffffff-no-rj-mo")
        addYouTubeLink('VTA', movement, SeikoMovement2VTA, movementToggle, "https://i1.wp.com/www.vintagetimeaustralia.com/VTA/wp-content/uploads/2018/10/cropped-vta512.jpg?fit=32%2C32&ssl=1")



        //hoverspan.appendChild(addLink(' zeppy ,', "http://www.zeppy.io/discover/us/seiko-"+match, match));

        if(match == "6309-8099"){
            let junk =1;
        }

        let caseCodeForCrystalMatch = getCaseCodeForCrystalMatch(match);


        let modelMatches = searchModel(SeikoModelDB, caseCodeForCrystalMatch);
        if(modelMatches.length>1){
            let exactModelMatches = searchModel(modelMatches, match);
            if(exactModelMatches.length>0){
                modelMatches = exactModelMatches;
            }
        }
        //console.log("modelMatches:"+modelMatches);

        modelMatches.forEach(function (item, index, array) {
            console.log("modelMatches:"+item[0]);
            let partsMatch = item[1];
            //console.log("   partsMatch:"+partsMatch);
            //console.log("   crownMatches:"+item[2]);
            let crystalMatch = partsMatch.cry;
            if(crystalMatch){
                let crystalToggleDiv = insertToggleDiv(hoverspan, "crystal", TOGGLE_SECTION_CRYSTAL);
                let crystalOptions = crystalMatch.split(",");
                crystalOptions.forEach(function(crystalOption){
                    let crystalMatchSpan = document.createElement("div");
                    crystalMatchSpan.id = "crystalMatchSpan_"+crystalOption;

                    crystalMatchSpan.style.backgroundColor = seikoCrystalBlue;
                    crystalMatchSpan.style.color = "white";
                    crystalMatchSpan.classList.add('vsss_inner');
                    //crystalMatchSpan.style.display = "inline";
                    crystalToggleDiv.appendChild(crystalMatchSpan);
                    crystalMatchSpan.innerText = decodeCrystalNumber(crystalOption);

                    processCrystal(crystalMatchSpan, crystalOption, match);
                });
            }

            let crownMatch = partsMatch.cro;
            if(crownMatch && crownMatch.length>1){
                let crownToggleDiv = insertToggleDiv(hoverspan, "crown", TOGGLE_SECTION_CROWN);
                let crownMatchSpan = document.createElement("div");
                crownMatchSpan.id = "crownMatchSpan";

                crownMatchSpan.style.backgroundColor = crownColor;
                //crownMatchSpan.style.color = "white";

                crownMatchSpan.classList.add('vsss_inner');
                //crownMatchSpan.style.display = "inline";
                crownToggleDiv.appendChild(crownMatchSpan);

                processCrown(crownMatchSpan, crownMatch);
            }

            //todo gaskets
        });

        return;
        if(modelMatches.length>0){
            return;}



        /*/old
        var crystalMatches = findInList(caseCodeForCrystalMatch, SeikoCaseCode2CrystalCode, 1, 0);

        if(crystalMatches.length > 0){
            let crystalToggleDiv = insertToggleDiv(hoverspan, "crystal", TOGGLE_SECTION_CRYSTAL);
            for (var cm = 0; cm < crystalMatches.length; cm++) {

                var crystalMatch = crystalMatches[cm];
                var crystalMatchSpan = document.createElement("div");
                crystalMatchSpan.id = "crystalMatchSpan";

                crystalMatchSpan.style.backgroundColor = seikoCrystalBlue;
                crystalMatchSpan.style.color = "white";
                crystalMatchSpan.classList.add('vsss_inner');
                //crystalMatchSpan.style.display = "inline";
                crystalToggleDiv.appendChild(crystalMatchSpan);
                crystalMatchSpan.innerText = decodeCrystalNumber(crystalMatch);
                crystalMatchSpan.appendChild(addLink(' ofrei ,', "http://www.ofrei.com/page721.html?VintageSeikoSavvySearch_Search=" + crystalMatch, crystalMatch, "https://www.ofrei.com/NavLogo.gif", 3.86));//https://imgur.com/xObW8LH.jpg"));//

                processCrystal(crystalMatchSpan, crystalMatch, match);



            }
        }*/

        //mainsprings

        var SeikoSpringMatches = findInList(movement, SeikoMovement2SeikoMainspring, 1, 0);
        var GRMatches = findInList(movement, SeikoMovement2GR_Mainspring, 1, 0);
        if(SeikoSpringMatches.length > 0 || GRMatches.length >0){
            let mainSpringToggle = insertToggleDiv(hoverspan, "mainspring", TOGGLE_SECTION_MAINSPRING);

            for (var skm = 0; skm < SeikoSpringMatches.length; skm++) {
                var SKMatch = SeikoSpringMatches[skm];
                var skDiv = document.createElement("div");
                skDiv.id = "skDiv+SeikoMatch";
                skDiv.style.backgroundColor = "lightgrey";
                skDiv.style.color = "black";
                skDiv.classList.add('vsss_inner');
                mainSpringToggle.appendChild(skDiv);
                skDiv.innerText = " Seiko " + SKMatch;
                skDiv.appendChild(addLink(' Google,', "https://www.google.com/search?q=seiko+" + SKMatch, SKMatch));
                skDiv.appendChild(addLink(' Ebay,', "https://www.ebay" + ebayDomainExtension + "/sch/i.html?_from=R40&_trksid=m570.l1313&_nkw=seiko+" + SKMatch + "&_sacat=14324&LH_TitleDesc=0&_osacat=14324&_odkw=seiko+" + SKMatch + "0&LH_TitleDesc=0", SKMatch));
                skDiv.appendChild(addLink('ST', "https://stsupplyonline.com/catalog/advanced_search_result.php?keywords=08-" + SKMatch + "&x=0&y=0", SKMatch, "https://stsupplyonline.com/favicon.ico"));
                skDiv.appendChild(addLink(' cousinsUK,', "https://www.cousinsuk.com/search?SearchTerm=Seiko " + SKMatch.substr(0, 3) + "." + SKMatch.substr(3, 3)));
                skDiv.appendChild(addLink(' ebay-vs4e,', "https://www.ebay" + ebayDomainExtension + "/c/1380008585?VintageSeikoSavvySearch_Search=" + SKMatch, SKMatch, "https://i.ebayimg.com/00/$(KGrHqYOKpcE19KT(zNzBNo),Db8CQ~~_7.JPG", 1.5));
                skDiv.appendChild(addLink(' Jules Borel,', "http://www.julesborel.com/s.nl?sc=1&category=&search=" + SKMatch));
                // https://www.ebay.com/c/1380008585
            }


            for (var grm = 0; grm < GRMatches.length; grm++) {
                var GRMatch = GRMatches[grm];
                var grDiv = document.createElement("div");
                grDiv.id = "grDiv+GRMatch";
                grDiv.style.backgroundColor = "grey";
                grDiv.classList.add('vsss_inner');
                grDiv.style.color = "black";
                mainSpringToggle.appendChild(grDiv);
                grDiv.innerText = " GR" + GRMatch;
                grDiv.appendChild(addLink(' Google,', "https://www.google.com/search?q=GR+" + GRMatch, GRMatch));
                grDiv.appendChild(addLink(' ebay,', "https://www.ebay" + ebayDomainExtension + "/sch/i.html?_from=R40&_trksid=m570.l1313&_nkw=GR+" + GRMatch + "&_sacat=14324&LH_TitleDesc=0&_osacat=14324&_odkw=GR+" + GRMatch + "0&LH_TitleDesc=0&_sop=15", GRMatch));

                grDiv.appendChild(addLink(' cousinsUK,', "https://www.cousinsuk.com/search?SearchTerm=GR" + GRMatch.replace("-", "").replace(" ", "")));//"GR2537X"

            }
        }


    }

     /**
     * Searches the modelDB and returns all lines that match
     *
     * @param modelDB
     * @param caseCode4_3
     * @returns array of models that match
     */
    function searchModel(modelDB, modelCode){
        let split = modelCode.split("-");
        let movStr = split[0];
        let mov = Reflect.get(modelDB, "m"+movStr);

        let matches = [];
        if(mov){
            let caseCode = modelCode;//split[1];
            var matchlength = caseCode.length;

            mov.forEach(function (item, index, array) {
                let shortStr = item[0];
                let longStr = caseCode;
                if (shortStr.length > matchlength) {
                    longStr = shortStr;
                    shortStr = caseCode;
                }
                if (longStr.indexOf(shortStr) >= 0) {
                    matches.push(item);
                }
            });
        }
        return matches;
    }

    function setToggle(toggleTitle){
         let tstatus = (toggleTitle.toggleSectionFlag & toggleSectionsFlags) == toggleTitle.toggleSectionFlag;
         toggleTitle.togglecontent.style.display = tstatus?"":"none";
         toggleTitle.innerText = (tstatus?"-":"+")+toggleTitle.toggleName+(tstatus?":":"");
    }


    function insertToggleDiv(parent, name, sectionFlag){
        //return parent;
         let toggleDiv = document.createElement("div");
         toggleDiv.id = "toggleDiv_"+name;
         parent.appendChild(toggleDiv);

        let toggleTitle = document.createElement("span");
        //toggleTitle.style.display = "inline";
        toggleTitle.id = "ToggleTitle_"+name;
        toggleTitle.toggleName = name;
        toggleTitle.toggleSectionFlag = 1 << sectionFlag;
        toggleTitle.style.cursor = "pointer";


       toggleDiv.appendChild(toggleTitle);
        toggleTitle.onclick = function (e) {
           let _toggleTitle = e.currentTarget;
           toggleSectionsFlags ^= _toggleTitle.toggleSectionFlag; //flip the sections bit
           setToggle(_toggleTitle);// display
           GM.setValue("toggleSectionsFlags", toggleSectionsFlags);// store it for later, no need to await though.
        };


        let toggleContent = document.createElement("div");
        toggleTitle.togglecontent = toggleContent; //so it can be switched on and off
        toggleContent.id = "ToggleContent_"+name;
        toggleDiv.appendChild(toggleContent);

        setToggle(toggleTitle);
        return toggleContent;
    }


    function addLink(label, url, match, image, aspect) {

        var el = document.createElement("a");
        el.href = url;
        el.target = "_blank";
        el.classList.add('vsss_icon');
        //el.innerText = label;

        var img = document.createElement("img");
        var dot = url.indexOf(".");
        var domainIndex = url.indexOf("/", url.indexOf("."));
        img.src = //(image == null) ? url.substring(0, domainIndex) + "/favicon.ico" : image; //.replace("https:","http:")
            (image == null)?"https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url="+url.substring(0, domainIndex)+"?10&size=32" : image;
        img.height = 16; //img.setAttribute( 'height', '16px !important' );
        el.style.height = img.height.toString() + 'px';
        img.width = (aspect == null) ? img.height : img.height * aspect;
        el.style.width = img.width.toString() + 'px';
        //console.log(img.src);
        img.alt = label;
        el.style.margin = "2px 2px";

        //img.setAttribute('onerror', "this.src='https://i.imgur.com/ZqeYbfk.gif'"); was causing flikering if imgur down
        img.onerror = function (e) {
           img.src='https://i.imgur.com/ZqeYbfk.gif'; //doesn't work on ebay - imgur respond with 403
           img.width = 16;
           el.style.width = img.width.toString() + 'px';
           img.onerror = null; //stops flikering if imgur is down
        };



        img.title = cleanLabel(label);





        el.appendChild(img);
        /* addButtonOnClickCallback(img, match,  function(match){
            console.log("Vintage Seiko Savvy Search match:"+match);
            navigator.clipboard.writeText(match).then(function() {
                   console.log('Vintage Seiko Savvy Search Async: Copying '+match+' to clipboard was successful!');
            }, function(err) {
                   console.error('Vintage Seiko Savvy Search Async: Could not copy text: ', err);
            });

         });*/


        return el;
    }

    function cleanLabel(label) {
        return label.replace(/^\s+/, "").replace(/,\s*$/, "");
    }

    //-------------------------- Helpers -------------------------------------
    function addButtonOnClickCallback(button, callbackData, onClickCallback) {
        if (button.onclick != null) throw "button already has onclick";
        button.callbackData = callbackData;
        if (onClickCallback != null) {
            button.onclick = function (e) {
                onClickCallback(e.target.callbackData);
            }
        }
    }

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }


    /**
     * This cuts off the last digit of a well-formed case code, so we can find other market/colorway models, e.g. -8110 vs. -8119.
     * If the case code is not well-formed, it simply returns the string given (so it won't break deliberately shortened search strings)
     *
     * @param match
     * @returns case code shortened by the last digit
     */
    function getCaseCodeForCrystalMatch(match) {
        const seikoCaseCodeRegex = /^[a-z0-9]{4}-[a-z0-9]{4}$/; // matches only XXXX-YYYY codes
        let code = match;
        if (match.match(seikoCaseCodeRegex)) {
            // if there is a well-formed code, remove the last digit
            code = match.substring(0, 8);
        } else {
            code = match;
        }
        return code;
    }

    function textTree(parentEl, maxTimes, callbackFunction) {
        if (maxTimes <= 20) {
            var junk = 1;
        }
        if (parentEl.id.startsWith("hoverspan")) {
            return maxTimes;
        }
        if (parentEl.tagName == "NOSCRIPT") {
            return maxTimes;
        }
        if (parentEl.tagName == "STYLE") {
            return maxTimes;
        }
        if (parentEl.style.display == "none") {
            return maxTimes;
        }
        if (parentEl.style.visibility == "hidden") {
            return maxTimes;
        }



        for (var c = 0; c < parentEl.childElementCount; c++) {
            var el = parentEl.children[c];
            maxTimes = textTree(el, maxTimes, callbackFunction);
            if (maxTimes <= 0) {
                return maxTimes;
            }
        }


        for (var i = 0; i < parentEl.childNodes.length; i++) {
            var node = parentEl.childNodes[i];
            if (node.nodeName == "#text") {
                // console.log("Vintage Seiko Savvy Search "+i+" "+node.nodeName+" value:"+node.nodeValue );
                maxTimes = callbackFunction(node, parentEl, maxTimes);
            }
            if (maxTimes <= 0) {
                return maxTimes;
            }
        }

        return maxTimes;

    }

    // Jules Borel helper site
    function Borel() {
        console.log("Vintage Seiko Savvy Search Jules Borel: parse()");
        var tableBodies = document.querySelectorAll('tbody');
        if (tableBodies != null) {
            var tableBody = tableBodies[1];
            if (tableBody != null) {
                var trs = tableBody.querySelectorAll('tr');
                if (trs != null) {
                    for (var i = 1; i < trs.length; i++) {
                        var tr = trs[i];
                        var td = tr.children[1];//second element
                        var textNode = td.childNodes[0].nodeValue;
                        td.removeChild(td.childNodes[0]);
                        var link = document.createElement("a");
                        link.href = "http://www.julesborel.com/s.nl?sc=1&category=&search=" + textNode.trim();
                        link.target = "_blank";
                        link.innerText = textNode;
                        td.appendChild(link);
                        console.log("Vintage Seiko Savvy Search " + textNode);

                        var td2 = tr.children[2];//third element
                        var textNode2 = td2.childNodes[0].nodeValue;
                        var discontinued = "Discontinued - Use ";
                        if (textNode2.startsWith(discontinued)) {
                            td2.removeChild(td2.childNodes[0]);
                            var link2 = document.createElement("a");

                            link2.href = "http://www.julesborel.com/s.nl?sc=1&category=&search=" + textNode2.substr(discontinued.length).trim();
                            link2.target = "_blank";
                            link2.innerText = textNode2;
                            td2.appendChild(link2);
                            console.log("Vintage Seiko Savvy Search " + textNode2);
                        }
                    }
                }
            }
        }

    }

    function addYouTubeLink(label, movement, matchList, span, iconURL) {
        var matches = findInList(movement, matchList, 1, 0);
        if (matches.length > 0) {
            span.appendChild(
                addLink(
                    ' ' + label + ',',
                    "https://www.youtube.com/watch?v=" + matches[0],
                    '',
                    iconURL
                )
            );
        }
    }

    /*function Boley(){
     var tableBodies = document.querySelectorAll('tbody');
     if(tableBodies !=null){
         var tableBody = tableBodies[1];
         if(tableBody != null){
            var trs = tableBody.querySelectorAll('tr');
            if(trs !=null){
                for( var i=0; i< trs.length; i++){
                    var tr = trs[i];
                    for(var j = 1; j< tr.children.length; j++){
                        var td = tr.children[j];
                        var textNode = td.childNodes[0];
                        if(textNode!=null){
                            var text = textNode.nodeValue.trim();
                            console.log(text);
                            td.removeChild(td.childNodes[0]);
                            td.appendChild(addBoleyLink(text, "https://www.boley.de/en/search?q="+text));
                            td.appendChild(addBoleyLink("g", "https://www.google.com/search?q=seiko+"+text));
                            td.appendChild(addBoleyLink("e", "https://www.ebay"+ebayDomainExtension+"/sch/i.html?_from=R40&_trksid=m570.l1313&_nkw="+text+"&_sacat=281&LH_TitleDesc=1&_osacat=281&_odkw="+text+"&LH_TitleDesc=1"));
                            td.appendChild(addBoleyLink("ws", "https://wristsushi.proboards.com/search/results?what_at_least_one="+text+"&display_as=1&search=Search"));

                            td.appendChild(addBoleyLink("o","https://www.ofrei.com/page_169.html"));
                            td.appendChild(addBoleyLink("c","https://www.cousinsuk.com/search?SearchTerm="+text));
                            td.appendChild(addBoleyLink("wm","https://www.watchmaterial.com/search.php?search_query="+text+"&section=product"));
                        }
                    }
                }
            }
         }
     }
   }

   function addBoleyLink(label, url){
        var el = document.createElement("a");
        el.href=url;
        el.target="_blank";
        el.innerText = label;
        return el;
   }
   */



})();