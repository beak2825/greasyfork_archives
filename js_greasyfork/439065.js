// ==UserScript==
// @name         Louisclub's backpack.tf 24h filter
// @namespace    https://greasyfork.org/en/scripts/439065-louisclub-s-backpack-tf-24h-filter
// @version      1.9
// @description  Filters backpack.tf classified for the last 24h
// @include  *backpack.tf/*
// @include  *backpacktf.trade/*
// @author       louisclub
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439065/Louisclub%27s%20backpacktf%2024h%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/439065/Louisclub%27s%20backpacktf%2024h%20filter.meta.js
// ==/UserScript==

// setup vars
// max number of page scans (default 499)
var maxPagesScan = 150;
// Scan delay(ms), range: 10 to 250. I like 100, 10 is faster but more requests per seconds are sent to backpack, use with caution.
var scanDelay = 100;

// init vars
var out = "outpost_spells";
var scm = "scm_spells";
var itemUsed = "itemUsed";
var defaultSteamURL = "https://steamcommunity.com/profiles/";

// buttons
var bp = "show_24h";
var bp_spells = "show_spells";
var bp_postlifes = "show_postlifes";
var bp_onePage = "show_onePage";
var bp_sortTime = "show_sortTime";
var bp_toggleBots = "toggleBots";
var bp_togglePages = "togglePages";
var bp_status = "show_status";
var button_bp = "#" + bp;
var button_bp_spells = "#" + bp_spells;
var button_bp_postlifes = "#" + bp_postlifes;
var button_bp_onePage = "#" + bp_onePage;
var button_bp_sortTime = "#" + bp_sortTime;
var button_bp_toggleBots = "#" + bp_toggleBots;
var button_bp_togglePages = "#" + bp_togglePages;
var button_bp_status = "#" + bp_status;
var button = '<a class="btn btn-success" id='+ bp +' style="">Last 24h</a>';
var button_spells = '<a class="btn btn-success" id='+ bp_spells +' style="">Spells </a>';
var button_postlifes = '<a class="btn btn-success" id='+ bp_postlifes +' style="">Post Lifes </a>';
var button_onePage = '<a class="btn btn-success" id='+ bp_onePage +' style="">Relist on one page </a>';
var button_sortTime = '<a class="btn btn-success" id='+ bp_sortTime +' style="">Sort by time </a>';
var button_toggleBots = '<a class="btn btn-primary" id='+ bp_toggleBots +' style="">Bots off </a>';
var button_togglePages = '<a class="btn btn-primary" id='+ bp_togglePages +' style="">Pages: ' + maxPagesScan + '</a>';
var button_status = '<a class="btn btn" id='+ bp_status +' style="">Status </a>';

// backpack vars
var page_bp = "ul.pagination li a[href]";
var columns_bp = "ul.media-list";
var placement_bp ="div.pull-right.listing-buttons";
var bp_profile_finder = "a.user-link";
var seller_bp = "steamcommunity.com/tradeoffer/new/?partner=";
var lookForSpells = false;
var lookFor24h = false;
var lookForPostLifes = false;
var lookOnePage = false;
var lookSortTime = false;

var deferreds = [],results = [];
var failedPages = [];
var allListings = [];
var pageListSize;
var currentPage = 0;

// Add seller names or name part to blacklist (ex. "24/7" or "Thomas")
var useBlacklist = true;
var blacklist = [
    "PAYAH",
    "24/7",
    "Oliver",
    "BOT",
    "Thomas",
    "Anthuan",
    "Froggy 🐸24/7",
    "Harry",
    "Erick",
    "Bot",
    "Johan",
    "Christian",
    "Meee🐐SoHorny",
    "Lightning McQueen",
    "Johan"
    ];

(function() {
    'use strict';

    function content(){
        var URL = document.location.href; //get current URL

        if(URL.includes("backpack.tf/classifieds") || (URL.includes("backpacktf.trade/classifieds")) ){
            //add_inv_param();
            $("div#search-crumbs").append(button_toggleBots);
            sleep(10);
            $("div#search-crumbs").append(button_togglePages);
            sleep(10);
            $("div#search-crumbs").append(button);
            sleep(10);
            $("div#search-crumbs").append(button_spells);
            sleep(10);
            $("div#search-crumbs").append(button_postlifes);
            sleep(10);
            $("div#search-crumbs").append(button_onePage);
            sleep(10);
            $("div#search-crumbs").append(button_sortTime);
            sleep(10);
            $("div#search-crumbs").append(button_status);
            $(button_status).addClass("disabled");
            BackPack_start();
        }
    }
    //backpack
    function BackPack_start(){
        console.log ("log Backpack start");

        $(document).on('click', button_bp_toggleBots, function(){
            console.log("im in togglebot button");
            if (useBlacklist){
                useBlacklist = false;
                $(button_bp_toggleBots).text("Bots on");
            }
            else{
                useBlacklist = true;
                $(button_bp_toggleBots).text("Bots off");
            }
        });

        $(document).on('click', button_bp_togglePages, function(){
            console.log("im in togglePages button");

            if (maxPagesScan == 150){
                maxPagesScan = 400;
            }
            else if(maxPagesScan == 400){
                maxPagesScan = 667;
            }
            else if(maxPagesScan == 667){
                maxPagesScan = 15;
            }
            else{
                maxPagesScan = 150;
            }
            // update button text
            $(button_bp_togglePages).text("Pages: "+ maxPagesScan);
        });

        $(document).on('click', button_bp_postlifes, function(){
            Disable_Buttons();
            lookForPostLifes = true;

            $(columns_bp).empty();
            var url = getBpURL();
            var l_page_num = getBpPageNum(url);

            $(button_bp_status).text("Loading " + l_page_num + " page(s)....");
            $(button).addClass("disabled");
            $(button_bp_postlifes).addClass("disabled");

            var pageList = [];

            for(var i = 0; i< l_page_num;i++){
                //populate page list from 1, 2, 3, etc
                pageList[i] = i+1;
            }
            pageListSize = l_page_num;

            readNAppendPages(pageList);
            //remove page links
            $("nav").empty();

            console.log("i finished BackPack_start");
        });

        $(document).on('click', button_bp_onePage, function(){
            Disable_Buttons();
            lookOnePage = true;

            $(columns_bp).empty();
            var url = getBpURL();
            var l_page_num = getBpPageNum(url);

            $(button_bp_status).text("Loading " + l_page_num + " page(s)....");
            $(button).addClass("disabled");

            var pageList = [];

            for(var i = 0; i< l_page_num;i++){
                //populate page list from 1, 2, 3, etc
                pageList[i] = i+1;
            }
            pageListSize = l_page_num;

            readNAppendPages(pageList);
            //remove page links
            $("nav").empty();

            console.log("i finished BackPack_start");
        });

        $(document).on('click', button_bp_sortTime, function(){
            Disable_Buttons();
            lookSortTime = true;

            $(columns_bp).empty();
            var url = getBpURL();
            var l_page_num = getBpPageNum(url);

            $(button_bp_status).text("Loading " + l_page_num + " page(s)....");
            $(button).addClass("disabled");

            var pageList = [];

            for(var i = 0; i< l_page_num;i++){
                //populate page list from 1, 2, 3, etc
                pageList[i] = i+1;
            }
            pageListSize = l_page_num;
            readNAppendPages(pageList);
            //remove page links
            $("nav").empty();

            console.log("i finished BackPack_start");
        });

        $(document).on('click', button_bp_spells, function(){
            Disable_Buttons();
            lookForSpells = true;

            $(columns_bp).empty();
            var url = getBpURL();
            var l_page_num = getBpPageNum(url);

            $(button_bp_status).text("Loading " + l_page_num + " page(s)....");

            var pageList = [];

            for(var i = 0; i< l_page_num;i++){
                //populate page list from 1, 2, 3, etc
                pageList[i] = i+1;
            }
            pageListSize = l_page_num;
            readNAppendPages(pageList);
            //remove page links
            $("nav").empty();

            console.log("i finished BackPack_start");
        });

        $(document).on('click', button_bp, function(){
            Disable_Buttons();
            lookFor24h = true;
            //empty items on the page
            $(columns_bp).empty();

            //find last page number
            var url = getBpURL();
            var l_page_num = getBpPageNum(url);

            $(button_bp_status).text("Loading " + l_page_num + " page(s)....");

            var pageList = [];

            for(var i = 0; i< l_page_num;i++){
                //populate page list from 1, 2, 3, etc
                pageList[i] = i+1;

            }
            pageListSize = l_page_num;
            readNAppendPages(pageList);
            //remove page links
            $("nav").empty();

        console.log("i finished BackPack_start");
        });

    }

    // Reads the pages sent in parameter. plist is an array containing page numbers
    function readNAppendPages(plist){

        //deferreds = [],results = [];

        $(button_bp_status).text("Processing");
        sleep(10);

        for(var i = 0; i< plist.length;i++){
            var new_url = setURLParameter(document.location.href,'page',plist[i]);

            $(button_status).text("Calling page " + plist[i]);
            console.log("reading page "+ plist[i]);
            deferreds.push(GrabDOM2fail(0,new_url,[results, plist[i]+1], plist[i]));
            //deferreds.push(GrabDOM2fail(0,new_url,[results, i+1], plist[i]));
            sleep(scanDelay);
        }

        Promise.allSettled(deferreds).then(values => {
            console.log("all defered finished!");
            //console.log(results);

            if (failedPages.length > 0){
                console.log ("out of " + plist.length + " pages, " + failedPages.length + " failed");
                readNAppendPages(failedPages);
                failedPages = [];
            }
            else{

                for(var i = 0; i< results.length;i++){
                    Backpack_LoopAdd(results[i]);
                }

                if (lookSortTime){
                    allListings = SortListingsTime(allListings);
                }
                else{

                    allListings = SortListingsPrice(allListings);
                }
                Backpack_LoopWholeList(allListings);
                Backpack_complete();
            }
        });
    }

    //*****************************************************************************

    // could probably work better with promise/deferred
    function sleep(milliseconds) {
        const date = Date.now();
        let currentDate = null;
        do {
            currentDate = Date.now();
        } while (currentDate - date < milliseconds);
    }

    //goes through a single page and collect all the sell listings in it
    function Backpack_LoopAdd(DOM){
        var item_list = $(DOM).find(columns_bp).first();
        item_list.children('li').each(function(){
            allListings.push(this);
        });
    }

    //goes over the listing list and append it to the html page
    function Backpack_LoopWholeList(itemList){

        itemList.forEach(function(individual){
            var node = $(individual).find("div.item"); //used to get spell name
            var node2 = $(individual).find("span.data2"); //used to get listing time
            var node3 = $(individual).find("span.user-handle"); //used to get data-name

            var takeSpell = (individual.innerHTML.includes("data-spell_1") && lookForSpells);
            var takeNew = (isNew(node2[0]) && lookFor24h);
            var takeBlacklist = !isBlacklisted(individual) || !useBlacklist;
            var takePostLife = (IsPostLife(node[0]) && lookForPostLifes);
            var takeOnePage = (true && lookOnePage);
            var takeSortTime = lookSortTime;

            if ( (takeSpell || takeNew || takePostLife || takeOnePage || takeSortTime) && (takeBlacklist) ){
                node.attr('data-toggle',"popover");
                $(columns_bp).first().append(individual.outerHTML);
                //show custom popover
                show_popover(node[0]);
            }

        });
    }

    //goes over the list and checks for spells/other. If the item has spells we list it.
    function Backpack_Loop(DOM){
        //console.log(DOM);
        var item_list = $(DOM).find(columns_bp).first();
        //console.log(item_list.children('li'));

        item_list.children('li').each(function(){
            var testDeleteMe = 0;
            if (true){

                //add items with spells
                var node = $(this).find("div.item"); //used to get spell name
                var node2 = $(this).find("span.data2"); //used to get listing time
                var node3 = $(this).find("span.user-handle"); //used to get data-name

                var takeSpell = (this.innerHTML.includes("data-spell_1") && lookForSpells);
                var takeNew = (isNew(node2[0]) && lookFor24h);
                var takeBlacklist = !isBlacklisted(this) || !useBlacklist;
                var takePostLife = (IsPostLife(node[0]) && lookForPostLifes);
                var takeOnePage = (true && lookOnePage);

                if ( (takeSpell || takeNew || takePostLife || takeOnePage) && (takeBlacklist) ){
                    node.attr('data-toggle',"popover");
                    $(columns_bp).first().append(this.outerHTML);
                    //show custom popover
                    show_popover(node[0]);
                }
            }
        });
    }

    function SortListingsTime(list){

        // sort the page
        list.sort(function(a, b) {
            var node1 = $(a).find("span.data2"); //used to get listing time
            var test1 = node1[0].children[0].getAttribute("datetime");
            var listingDatetime1 = new Date(test1);
            var node2 = $(b).find("span.data2"); //used to get listing time
            var test2 = node2[0].children[0].getAttribute("datetime");
            var listingDatetime2 = new Date(test2);

            return listingDatetime2 - listingDatetime1;
        });
        return list;
    }
    function SortListingsPrice(list){

        // sort the page
        list.sort(function(a, b) {
            var node1 = $(a).find("div.item"); //used to get spell name
            var priceUnparsed1 = node1[0].getAttribute("data-listing_price");
            var priceArray1 = priceUnparsed1.split(",");
            var priceKeys1 = 0;
            if (priceArray1[0].includes("key"))
            {
                priceKeys1 = priceArray1[0].split(" ")[0];
            }
            var node2 = $(b).find("div.item"); //used to get spell name
            var priceUnparsed2 = node2[0].getAttribute("data-listing_price");
            var priceArray2 = priceUnparsed2.split(",");
            var priceKeys2 = 0;
            if (priceArray2[0].includes("key"))
            {
                priceKeys2 = priceArray2[0].split(" ")[0];
            }
            return priceKeys1 - priceKeys2;
        });

        return list;
    }


    // Returns true if that listing is recent (default 24h)
    function isNew(info){

        var timeSearchLimit = 86400000; //86400000 = one day;
        //var timeSearchLimit = 3600000;
        var test1 = info.children[0].getAttribute("datetime");

        var testd1 = new Date("2022-01-23T19:48:23+00:00");
        var testd2 = new Date("2022-01-22T19:48:23+00:00");
        let difference2 = Math.abs(testd1.valueOf()-testd2.valueOf());

        var nowDatetime = new Date();
        var listingDatetime = new Date(test1);
        let difference = Math.abs(nowDatetime.valueOf()-listingDatetime.valueOf());
        //console.log("listing is " + difference/6000 + " minutes old"); // safe to use

        if (difference < timeSearchLimit)
            return true;
        else
            return false;
    }


    // Returns true if seller name is part of blacklist. or if desc contains !buy
    function isBlacklisted(info){
        let isblacklist = false;

                var node = $(info).find("div.item"); //used to get spell name
                var node2 = $(info).find("span.data2"); //used to get listing time
                var node3 = $(info).find("span.user-handle"); //used to get data-name


        var listing_name = node3[0].children[0].getAttribute("data-name");
        var listing_desc = node[0].getAttribute("data-listing_comment");

        if (listing_name){
            blacklist.forEach(function (forbidden) {
                if (listing_name.includes(forbidden)){
                    console.log("Blacklisted this name : " + listing_name + ", because : " + forbidden);
                    isblacklist = true;
                    return;
                }

            });
        }

        if (listing_desc){
            if (listing_desc.includes("!buy"))
                isblacklist = true;
        }

        return isblacklist;
    }

    function IsPostLife(info){
        let isPostLife = false;
        var originalId = info.getAttribute("data-original_id");
        var hasSpell = (info.getAttribute("data-spell_1")? true : false);
        var firstPostLifeId = 3251762665;

        if ((originalId > firstPostLifeId) && hasSpell){
            return true;
        }
        else{
            return false;
        }
    }

    //Helper
    function getBpURL(){
        var l_page_url = $(page_bp).last()[0].href;
        //console.log(l_page_url);
        return l_page_url;
    }

    function getBpPageNum(url){
        var page_parem = "page";
        var l_page_num = getUrlParam(url, page_parem);
        //console.log(l_page_num);
        if(l_page_num == null){
            l_page_num = 1;
        }

        var page_limit = maxPagesScan;
        if(l_page_num >= page_limit){
            l_page_num = page_limit;
            bpMsg("<br><font color='red'>\
Reached maximum number of pages: "
                  + page_limit + " pages.</font>");
        }
        return l_page_num;
    }

    //Post any error or notable message
    function bpMsg(msg){
        $("div#search-crumbs").append(msg);
    }

    function Backpack_complete(){
        $(button_bp_status).text("Finished!!!");
    }

    function Disable_Buttons(){
        $(button_bp).addClass("disabled");
        $(button_bp_spells).addClass("disabled");
        $(button_bp_postlifes).addClass("disabled");
        $(button_bp_onePage).addClass("disabled");
        $(button_bp_toggleBots).addClass("disabled");
        $(button_bp_togglePages).addClass("disabled");
        $(button_bp_sortTime).addClass("disabled");

    }

    //shows the popover when you hover over the item. Outpost and other buttons are not implmented yet
    function show_popover(info){
        var p_title = info.title;
        var p_spell = info.getAttribute("data-spell_1");
        var p_spell2 = info.getAttribute("data-spell_2");
        var name = info.getAttribute("data-listing_name");
        var price = info.getAttribute("data-listing_price");
        var comment = info.getAttribute("data-listing_comment");
        var link = info.getAttribute("data-listing_offers_url");
        var backpack_id = info.getAttribute("data-original_id");
        var wiki_id = info.getAttribute("data-defindex");
        var backpack_value = info.getAttribute("data-p_bptf");

        var body = '<dl class="item-popover-listing"">'
        +'<dt>Classified Listing</dt><dd>This item is being sold by ' + name
        + "<dd>Selling for: "+ price +"</dd>" + "<dd><em>"+ comment +"</em></dd>"
        + '<dd><a class="btn btn-xs btn-primary btn-listing" href=' + link
        +' target="_blank"><i class="fa fa-exchange"></i> '+ name +'</a></dd></dd></dl>'
        +'<dt>Spells</dt><dd>'+ p_spell+ "</dd>";


        if(p_spell2 != null){
            body +='<dd>'+ p_spell2 +'</dd>';
        }

        body+=  '<dt>Suggested Values</dt><dd> backpack.tf: '+ backpack_value + "</dd>"
            + '<dd class="popover-btns">' + '<a class="btn btn-default btn-xs"'
            +'href="https://backpack.tf/item/' + backpack_id
            + '"><i class="fa fa-calendar-o"></i> History</a>'
            + '<a class="btn btn-default btn-xs" href="http://wiki.teamfortress.com/scripts/itemredirect.php?id='
            + wiki_id  + '" target="_blank"><i class="stm stm-tf2"></i> Wiki</a>'
            + '</dd>';

        $(".listing-item").popover({
            title: '<h3 class="popover-title">' + p_title + '</h3>',
            content: body,
            trigger: "hover click focus",
            placement: 'top',
            html: true
        });
    }

    //Add inventory button and add additional parameters
    function add_inv_param(){
        var item_list = $(columns_bp).first();
        //console.log(item_list);
        item_list.children('li').each(function(){
            //console.log(this.id);
            var item_id = "440_2_"+this.id.split("_")[1];
            //console.log(item_id);
            //find the inventory url
            //In order to do that, we use item id and the user profile link to find the item
            var bp_profile = $(this).find(bp_profile_finder)[0].href;
            //console.log(bp_profile);
            var steam_user_link = defaultSteamURL + bp_profile.replace(/[^0-9]+/, '');
            //console.log(steam_user_link);
            var steam_link_id = steam_user_link + "/inventory/#" + item_id;

            //Add button under the correct placement
            var b_placement = $(this).find(placement_bp);
            //console.log(b_placement);
            var b_inspect = '<a href="'+steam_link_id+'" \
class="btn btn-xs btn-bottom btn-primary" target="_blank"\
data-original-title="Check in-game"><span>See Inventory</span></a>';
            b_placement.prepend(b_inspect);

            //Also add key/value to use for steam trade
            getKeyRefBP(this);
        });

        //also have for buy orders
        item_list = $(columns_bp)[1];
        //console.log(item_list);
        $(item_list).children('li').each(function(){
            //Also add key/value to use for steam trade
            getKeyRefBP(this);
        });
    }

    //find key and ref from item on backpack.tf classified
    function getKeyRefBP(node){
        //console.log(node);
        //console.log($(node).find("div.item"));
        var value = $(node).find("div.item").attr("data-listing_price");
        //console.log(value);
        var arr = value.split(',');
        var key = '', ref = '';
        for(var i=0; i < arr.length;i++){
            if(arr[i].indexOf("key") > -1){
                key = arr[i].match(/[\d\.]+/)[0];
            }else if(arr[i].indexOf("ref") > -1){
                ref = arr[i].match(/[\d\.]+/)[0];
            }
        }

        addParamURL(node,key,ref);
    }

    //add key/ref value
    function addParamURL(node,key,ref){
        $(node).find("a[href*='"+seller_bp+"']").each(function(){
            //console.log(this);
            var new_url = $(this).attr('href');
            if(key != ''){
                new_url = setURLParameter(new_url,"key",key);
            }

            if(ref != ''){
                new_url = setURLParameter(new_url,"ref",ref);
            }
            $(this).attr('href',new_url);
        });
    }

    //*****************************************************************************

    // START INIT CODE *******************************************

    function GrabDOM2fail(content_id,URL,arg, pagenum){
        return $.ajax({
            url: URL,
            dataType: 'text',
            success: function(data) {
                currentPage = currentPage+1;
                $(button_bp_status).text("Pages loaded " + currentPage + " / " + pageListSize);
                console.log("page success" + pagenum +" index num" + arg[1]);
                //console.log(data);
                (arg[0])[arg[1]-1] = data;
            },error: function(){
                failedPages.push(pagenum);
                console.log("page FAIL" + arg[1]);
            }
        });
    }

    //get query of the specific parameter in the url
    function getUrlParam(url, paramName) {
        var params = url.split(/\?|\&/);
        for(var i = 0; i < params.length; i++) {
            var currentParam = params[i].split("=");
            if(currentParam[0] === paramName) {
                return currentParam[1];
            }
        }
    }

    //get query of a specific parameter
    function setURLParameter(url,key,value) {
        var l_url = url.split('&'), query = {}, new_url="";
        //console.log(url_list);
        for (var i=0; i < l_url.length; i++){
            if(l_url[i].indexOf('=') !== -1){
                var param = l_url[i].split('=');
                query[param[0]] = param[1];
                //console.log(param);
            }else if(i !== l_url.length-1){
                new_url +=str+"&";
            }
        }
        query[key] = value; //sets new query
        new_url += $.param(query);
        new_url = decodeURIComponent(new_url);
        //console.log(new_url);
        return new_url;
    }

    //Injecting code to the page in order to access the pages' javascript.
    function injectJS(code){
        var script = document.createElement('script');
        script.textContent = code;
        (document.head||document.documentElement).appendChild(script);
        script.remove();
    }

    //convert js code to string so that I can inject it
    function code_to_string(code){
        return '(' + code + ')();';
    }
    // END INIT CODE *******************************************

    $(document).ready(content());

})();