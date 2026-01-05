// ==UserScript==
// @author      Zachary Seeley
// @name        Requester Scraper
// @description Monitors MTurk looking for new requesters.
// @match       https://www.mturk.com/mturk/findhits?match=true#requester_scraper*
// @match       https://www.mturk.com/mturk/findhits?match=true?requester_scraper*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @version     0.1
// @namespace https://greasyfork.org/users/3045
// @downloadURL https://update.greasyfork.org/scripts/3073/Requester%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/3073/Requester%20Scraper.meta.js
// ==/UserScript==

// TODO         Allow monitored requesters to have their HIT put up even if already on page. if (savedHistoryCheck == -1 || monitoredListCheck != -1)
//
// UPDATE v0.4  Only lists a HIT if it isn't already on the page. This can be strict(only 1 RequesterName) or loose(only 1 RequesterNameHitTitle).
//
// UPDATE v0.3  Only looks for matches on each search. Will no longer hit on matches from previous searches. This way I can
//              simply hit Start again after finding a match and have it keep monitoring, while still keeping my history.
//
// UPDATE v0.2  Keeps previous searches and pushes them down the page. Separates each iteration with a row of dashes.

//----------------------------------------IGNORE SETTINGS----------------------------------------//
//var ignore_list = ["SpeechInk, SirRejects-a-Lot"];
var ignore_list = [];

//----------------------------------------MONITOR SETTINGS----------------------------------------//

//define a custom element and append it to the document

         

var tempTopValue;
var tempRightValue;
function injectStyles(rule) {
  var div = $("<div />", {
    html: '&shy;<style>' + rule + '</style>'
  }).appendTo("head");    
}

var my_pattern = "";
var my_matches = "";
var found = "";
var lastFoundMsg = "";
var foundPrev = false;
var foundBoxColor = '#CC6666';
var haystack = "";
var requesterWageFormatted = "";
var foundThisSearch = false;
var mCoinSound = new Audio("http://static1.grsites.com/archive/sounds/musical/musical002.wav"); //==[This is the path to the mp3 used for the alert]==\\//==[Just change the url to use whatever sound you want]==\\
document.title = "Requester Scraper";

//display your hitdb records if applicable
var check_hitDB = true;

//default text size
//var default_text_size=11;

function injectStyles(rule) {
  var div = $("<div />", {
    html: '&shy;<style>' + rule + '</style>'
  }).appendTo("body");    
}
injectStyles('* { font-family:"Verdana"; font-size: 11px; !important}');
injectStyles('a { font-family:"Verdana"; font-size: 11px; !important}');
injectStyles('body { font-family:"Verdana"; font-size: 11px; !important}');
injectStyles('p { font-family:"Verdana"; font-size: 11px; !important}');
injectStyles('td { font-family:"Verdana"; font-size: 11px; !important}');

var HITStorage = {};
var indexedDB = window.indexedDB || window.webkitIndexedDB ||
                window.mozIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.mozIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.mozIDBKeyRange;
HITStorage.IDBTransactionModes = { "READ_ONLY": "readonly", "READ_WRITE": "readwrite", "VERSION_CHANGE": "versionchange" };
var IDBKeyRange = window.IDBKeyRange;

HITStorage.indexedDB = {};
HITStorage.indexedDB = {};
HITStorage.indexedDB.db = null;

HITStorage.indexedDB.onerror = function(e) {
  console.log(e);
};

var v=4;

HITStorage.indexedDB.checkTitle = function(title,button) {
  var request = indexedDB.open("HITDB", v);
    request.onsuccess = function(e) {
        HITStorage.indexedDB.db = e.target.result;
        var db = HITStorage.indexedDB.db;
    if (!db.objectStoreNames.contains("HIT"))
    {
      db.close();
      return;
    }
        var trans = db.transaction(["HIT"], HITStorage.IDBTransactionModes.READ_ONLY);
        var store = trans.objectStore("HIT");

        var index = store.index("title");
    index.get(title).onsuccess = function(event)
    {
      if (event.target.result === undefined)
      {
        history[button].titledb=false;
      }
      else
      {
        history[button].titledb=true;
      }
      
      db.close();
    };
    };
    request.onerror = HITStorage.indexedDB.onerror;
};

HITStorage.indexedDB.checkRequester = function(id,button) {
  var request = indexedDB.open("HITDB", v);
    request.onsuccess = function(e) {
        HITStorage.indexedDB.db = e.target.result;
        var db = HITStorage.indexedDB.db;
    if (!db.objectStoreNames.contains("HIT"))
    {
      db.close();
      return;
    }
        var trans = db.transaction(["HIT"], HITStorage.IDBTransactionModes.READ_ONLY);
        var store = trans.objectStore("HIT");

        var index = store.index("requesterId");
    index.get(id).onsuccess = function(event)
    {
      if (event.target.result === undefined)
      {history[button].reqdb=false;
      }
      else
      {
            history[button].reqdb=true;
      }
      db.close();
    };
    };
    request.onerror = HITStorage.indexedDB.onerror;
};

var PAGES_TO_SCRAPE = 5;
var MINIMUM_HITS = 1;
var SEARCH_REFRESH=1;
var URL_BASE = "https://www.mturk.com/mturk/searchbar?searchWords=&selectedSearchType=hitgroups";
var initial_url = URL_BASE;
var TO_REQ_URL = "http://turkopticon.ucsd.edu/reports?id=";
var found_key_list=[];
var last_clear_time = new Date().getTime();
var searched_once = false;
var save_new_results_time = 120;
var save_results_time = 3600;
var default_type = 0;
var cur_loc = window.location.href;
var time_input = document.createElement("INPUT");
time_input.value = 1;
var page_input = document.createElement("INPUT");
page_input.value = 5;
var min_input = document.createElement("INPUT");
var new_time_display_input = document.createElement("INPUT");
new_time_display_input.value = 0;
var reward_input = document.createElement("INPUT");
var qual_input = document.createElement("INPUT");
qual_input.type = "checkbox";
qual_input.checked = false;
var masters_input = document.createElement("INPUT");
masters_input.type = "checkbox";
var autoAccept_input = document.createElement("INPUT");
autoAccept_input.type = "checkbox";
var sort_input1 = document.createElement("INPUT");
sort_input1.type = "radio";
sort_input1.name = "sort_type";
sort_input1.value = "latest";
sort_input1.checked = true;
var sort_input2 = document.createElement("INPUT");
sort_input2.type = "radio";
sort_input2.name = "sort_type";
sort_input2.value = "most";
var sort_input3 = document.createElement("INPUT");
sort_input3.type = "radio";
sort_input3.name = "sort_type";
sort_input3.value = "amount";

var search_input = document.createElement("INPUT");

var LINK_BASE = "https://www.mturk.com";
var BACKGROUND_COLOR = "#FAFAFA";
var STATUSDETAIL_DELAY = 250;
var MPRE_DELAY = 3000;

var next_page = 1;

var GREEN   = '#BAE6B8'; //  > 4
var YELLOW = '#FFFFCC';
var ORANGE  = '#E6CFB8'; //  > 2
var RED     = '#E6B8B8'; // <= 2
var BLUE    = '#B8CAE6'; // no TO
var GREY = 'lightGrey';
var BROWN = '#333333';
var DARKGREY = '#9F9F9F';
$('body').css('background', BACKGROUND_COLOR);

var API_PROXY_BASE = 'https://api.turkopticon.istrack.in/';
var API_MULTI_ATTRS_URL = API_PROXY_BASE + 'multi-attrs.php?ids=';
var REVIEWS_BASE = 'http://turkopticon.ucsd.edu/';

var control_panel_HTML = '<div id="control_panel" style="margin: 0 auto 0 auto;' +
                         'border-bottom: 1px solid #000000; margin-bottom: 5px; ' +
                         'background-color: ' + BACKGROUND_COLOR + ';"></div>';
$('body > :not(#control_panel)').hide(); //hide all nodes directly under the body
$('body').prepend(control_panel_HTML);

var control_panel = document.getElementById("control_panel");
var big_red_button = document.createElement("BUTTON");
var progress_report = document.createTextNode("Stopped");
var text_area = document.createElement("TABLE");
big_red_button.textContent = "Show Interface";
big_red_button.onclick =  function(){show_interface();};
control_panel.appendChild(big_red_button);

var no_link_underline = '<style> a {color:#333333;} </style>';
    $("head").append(no_link_underline);

var visited_link_styling = '<style> a {text-decoration:none;} </style>';
    //$("head").append(visited_link_styling);

var global_run = false;
var statusdetail_loop_finished = false;
var date_header = "";
var history = {};
var wait_loop;

// Array to hold keys for listed tasks.
var savedHistory = [];
var lastHistory = [];
var nextLastHistory = [];

// Boolean used to change pages from 25 to 2 after first run.
var pagesToSearchBoolean = true;

show_interface();


function set_progress_report(text, force)
{
    if (global_run == true || force == true)
    {
        progress_report.textContent = text;
    }
}

function get_progress_report()
{
    return progress_report.textContent;
}

function wait_until_stopped()
{
    if (global_run == true)
    {
        if (statusdetail_loop_finished == true)
        {
            big_red_button.textContent = "Start";
            set_progress_report("Finished", false);
        }
        else
        {
            setTimeout(function(){wait_until_stopped();}, 500);
        }
    }
}

function display_wait_time(wait_time)
{
    if (global_run == true)
    {
        var current_progress = get_progress_report();
        if (current_progress.indexOf("Searching again in")!==-1)
        {
            set_progress_report(current_progress.replace(/Searching again in \d+ seconds/ , "Searching again in " + wait_time + " seconds"),false);
        }
        else
            set_progress_report(current_progress + " Searching again in " + wait_time + " seconds.", false);
        if (wait_time>1)
            setTimeout(function(){display_wait_time(wait_time-1);}, 1000);
    }
}

function dispArr(ar)
{
    var disp = "";
    for (var z = 0; z < ar.length; z++)
    {
        disp += "id " + z + " is " + ar[z] + " ";
    }
}

function scrape($src)
{
    var $requester = $src.find('a[href^="/mturk/searchbar?selectedSearchType=hitgroups&requester"]');
    var $title = $src.find('a[class="capsulelink"]');
    var $reward = $src.find('span[class="reward"]');
    var $preview = $src.find('a[href^="/mturk/preview?"]');
    var $qualified = $src.find('a[href^="/mturk/notqualified?"]');
    var not_qualified_group_IDs=[];
    $qualified.each(function(){
        var groupy = $(this).attr('href');
        groupy = groupy.replace("/mturk/notqualified?hitId=","");
        not_qualified_group_IDs.push(groupy);
    });
    var $mixed =  $src.find('a[href^="/mturk/preview?"],a[href^="/mturk/notqualified?"]');
    var listy =[];
    $mixed.each(function(){
        var groupy = $(this).attr('href');
        groupy = groupy.replace("/mturk/notqualified?hitId=","");
        groupy = groupy.replace("/mturk/preview?groupId=","");
        listy.push(groupy);
    });
    listy = listy.filter(function(elem, pos) {
        return listy.indexOf(elem) == pos;
    });

    for (var j = 0; j < $requester.length; j++)
    {
        var $hits = $requester.eq(j).parent().parent().parent().parent().parent().parent().find('td[class="capsule_field_text"]');
        var requester_name = $requester.eq(j).text().trim();
        var requester_link = $requester.eq(j).attr('href');
        var group_ID=listy[j];
        var preview_link = "/mturk/preview?groupId=" + group_ID;
        var title = $title.eq(j).text().trim();
        title = title.substring(0, 50);
        var reward = $reward.eq(j).text().trim();
        var hits = $hits.eq(4).text().trim();
        var requester_id = requester_link.replace('/mturk/searchbar?selectedSearchType=hitgroups&requesterId=','');
        var accept_link;
        accept_link = preview_link.replace('preview','previewandaccept');

        key = requester_name+title+reward+group_ID;
        found_key_list.push(key);
        if (history[key] == undefined)
        {
            history[key] = {requesterWage:"", requester:"", title:"", reward:"", hits:"", req_link:"", prev_link:"", rid:"", acc_link:"", new_result:"", qualified:"", found_this_time:"", initial_time:"", reqdb:"",titledb:""};
            history[key].req_link = requester_link;
            history[key].prev_link = preview_link;
            history[key].requester = requester_name;
            history[key].title = title;
            history[key].reward = reward;
            history[key].hits = hits;
            history[key].rid = requester_id;
            history[key].acc_link = accept_link;
            history[key].requesterWage = localStorage.getItem('Requester:' + requester_id + ':' + requester_name + '.hitDollarsPerHour');
            HITStorage.indexedDB.checkRequester(requester_id,key);
            HITStorage.indexedDB.checkTitle(title,key);
            if (searched_once)
            {
                history[key].initial_time = new Date().getTime();//-1000*(save_new_results_time - SEARCH_REFRESH);
                history[key].new_result = 0;
            }
            else
            {
                history[key].initial_time = new Date().getTime()-1000*save_new_results_time;
                history[key].new_result = 1000*save_new_results_time;
            }
            if (not_qualified_group_IDs.indexOf(group_ID)!==-1)
                history[key].qualified = false;
            else
                history[key].qualified = true;

            history[key].found_this_time = true;
        }
        else
        {
            history[key].new_result = new Date().getTime() - history[key].initial_time;
            history[key].found_this_time = true;
            history[key].hits = hits;
        }
    }
}

function statusdetail_loop(next_URL)
{
    if (global_run == true)
    {
        //SEARCH_REFRESH = 5;
        if (next_URL.length != 0)
        {
            $.get(next_URL, function(data)
            {
                var $src = $(data);
                // -----------------------------------------------HAYSTACK-------------------------------------------------- //
                haystack += data;
                var maxpagerate = $src.find('td[class="error_title"]:contains("You have exceeded the maximum allowed page request rate for this website.")');
                if (maxpagerate.length == 0)
                {
                    set_progress_report("Processing page " + next_page, false);
                    scrape($src);
        
                    $next_URL = $src.find('a[href^="/mturk/viewsearchbar"]:contains("Next")');
                    next_URL = ($next_URL.length != 0) ? $next_URL.attr("href") : "";
                    next_page++;
                    if (default_type == 1)
                    {
                        var hmin = MINIMUM_HITS+1;
                        for (j = 0; j < found_key_list.length; j++)
                        {
                            if (history[found_key_list[j]].hits < hmin)
                            {
                                next_URL = "";
                                next_page = -1;
                                break;
                            }
                        }
                    }
                    else if (next_page > PAGES_TO_SCRAPE)
                    {
                        next_URL = "";
                        next_page = -1;
                    }
                    
                    setTimeout(function(){statusdetail_loop(next_URL);}, STATUSDETAIL_DELAY);
                }
                else
                {
                    setTimeout(function(){statusdetail_loop(next_URL);}, MPRE_DELAY);
                }
            });
        }
        else
        {
            searched_once = true;
            var found_hits = found_key_list.length;
            var shown_hits = 0;
            var new_hits = 0;
            var url = API_MULTI_ATTRS_URL;
            var rids = [];
            var lastRow = text_area.rows.length - 1;
            /*for (i = lastRow; i>0; i--)
                text_area.deleteRow(i);*/
            for (j = 0; j < found_key_list.length; j++)
            {
                var obj = history[found_key_list[j]];
                // Create a key for the result and compare it to existing keys. Only new keys are added. Take off obj.title to only allow one key per requester.
                // Check this history key against the last set of results. If this result was found last time, don't list it again. The only way for something
                // to be listed again is for it to not have been found in the previous search. This can be if it fell off the second page, but was sucked back
                // into the second page, or if a requester re-lists a new batch with the same name later in the day, which is what I'm trying to catch. It's bad
                // to miss a good batch because it was found an hour ago.
                var checkHistoryKey = obj.requester+obj.title;
                var savedHistoryCheck = lastHistory.indexOf(checkHistoryKey);
                nextLastHistory.push(checkHistoryKey);
                if (savedHistoryCheck == -1)
                {
                    savedHistory.push(checkHistoryKey);
                    if (ignore_check(obj.requester,obj.title) && obj.found_this_time){

                        var newTempURL = 'https://api.turkopticon.istrack.in/multi-attrs.php?ids=' + obj.rid;

                        var tempreviews;
                        var tempfair;
                        var temppay;
                        var tempcomm;
                        var tempfast;
                        var tempData;
                        var toData;
                        var tempReqId = obj.rid;

                        var xhr = new XMLHttpRequest();
                        try{
                            xhr.open('GET', newTempURL, false);
                            xhr.send(null);
                            toData = $.parseJSON(xhr.response);
                            tempreviews = toData[tempReqId].reviews;
                        tempfair = toData[tempReqId].attrs.fair;
                        temppay = toData[tempReqId].attrs.pay;
                        tempcomm = toData[tempReqId].attrs.comm;
                        tempfast = toData[tempReqId].attrs.fast;
                        }
                        catch(err){
                        }

                        if ( tempreviews < 5 ) {
                            
                            var dt = new Date();
                        var timeStamp = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
                            //var timeStamp = moment().format("h:mm:ss a");
                            //Use this, but check against needles, to automatically accept links that are in your list.
                            //window.open(LINK_BASE+obj.acc_link, '_blank');
                            
                            foundThisSearch = true;
                            ++shown_hits;
                            if (obj.requesterWage === null)
                            {
                                requesterWageFormatted = '-----';
                            } else {
                                requesterWageFormatted = '$' + obj.requesterWage;
                            }
                            var col_heads = [timeStamp,"<a href='"+ LINK_BASE+obj.req_link +"' target='_blank'>" + obj.requester + "</a>", requesterWageFormatted, "<a href='"+ LINK_BASE+obj.prev_link +"' target='_blank'>" + obj.title + "</a>",obj.reward,obj.hits,"TO down","<a href='"+ LINK_BASE+obj.acc_link +"' target='_blank'>Accept</a>"];
                            var row = text_area.insertRow(text_area.rows.length - lastRow);//Remove - lastRow with uncomment above.);
                            url += obj.rid + ',';
                            rids.push(obj.rid);
                            if (check_hitDB)
                            {
                                col_heads.push("R");
                                col_heads.push("T");
                            }
                            if (!obj.qualified)
                            {
                                col_heads.push("Not Qualified");
                            }
                            for (i=0; i<col_heads.length; i++)
                            {
                                var this_cell = row.insertCell(i);
                                //row.cells[i].style.fontSize = default_text_size;
                                this_cell.innerHTML = col_heads[i];
                                if(i>3)
                                    this_cell.style.textAlign = 'center';
                                if (check_hitDB)
                                {
                                    if (i==8)
                                    {
                                        if (obj.reqdb)
                                            this_cell.style.backgroundColor = GREEN;
                                        else
                                            this_cell.style.backgroundColor = RED;
                                    }
                                    else if (i==9)
                                    {
                                        if (obj.titledb)
                                            this_cell.style.backgroundColor = GREEN;
                                        else
                                            this_cell.style.backgroundColor = RED;
                                    }
                                    else if (i==10)
                                        this_cell.style.backgroundColor = DARKGREY;
                                }
                                else if (i==8)
                                    this_cell.style.backgroundColor = DARKGREY;
                            }
                            if (Object.keys(history).length>0)
                            {
                                if (obj.new_result < 1000*save_new_results_time)
                                {
                                    new_hits++;
                                    for (i in col_heads)
                                    {
                                        //row.cells[i].style.fontSize = default_text_size + 1;
                                        //row.cells[i].style.fontWeight = "bold";
                                    }
                                }
                            }
                        }
                    }
                }
            }
            lastHistory = nextLastHistory;
            savedHistory = [];
            nextLastHistory = [];
            set_progress_report("Scrape complete. " + shown_hits + " HITs found (" + new_hits + " new results). " + (found_hits - shown_hits) + " HITs ignored.", false);
            
           
            // -------------------- MONITOR CHECK -------------------- //
            
            
            
            
            
            // Reset found variable
            found = "";
            foundThisSearch = false;
            haystack = "";
            pagesToSearchBoolean = false;
            page_input.value = 1;
            PAGES_TO_SCRAPE = 1;
            
            // -------------------- END MONITOR CHECK -------------------- //
            
            url = url.substring(0,url.length - 1);
            var success_flag = false;
            GM_xmlhttpRequest(
            {
                method: "GET",
                url: url,
                onload: function (results)
                {
                    rdata = $.parseJSON(results.responseText);
                    for (i = 0; i < rids.length; i++)
                    {
                        text_area.rows[i+1].style.backgroundColor = BLUE;
                        if (rdata[rids[i]])
                        {
                            var reviews = rdata[rids[i]].reviews
                            var fair = rdata[rids[i]].attrs.fair;
                            var pay = rdata[rids[i]].attrs.pay;
                            text_area.rows[i+1].cells[6].innerHTML = "<a href='"+ TO_REQ_URL+rids[i] +"' target='_blank'>" + pay + "</a>";
                            if (reviews > 4)
                            {
                                if (fair > 3.99)
                                    text_area.rows[i+1].style.backgroundColor = GREEN;
                                else if (fair > 2.99)
                                    text_area.rows[i+1].style.backgroundColor = YELLOW;
                                else if (fair > 1.99)
                                    text_area.rows[i+1].style.backgroundColor = ORANGE;
                                else if (fair > 0.99)
                                    text_area.rows[i+1].style.backgroundColor = RED;
                             }
                        }
                        else
                        {
                            text_area.rows[i+1].cells[6].innerHTML = "No data";
                        }
                    }
                    success_flag = true;
                 }
            });
            if (!success_flag)
                for (i = 0; i < rids.length; i++) text_area.rows[i+1].style.backgroundColor = GREY;
            
            statusdetail_loop_finished = true;
            if (SEARCH_REFRESH>0)
            {
                wait_loop = setTimeout(function(){if (global_run) start_it();}, 1000*SEARCH_REFRESH);
                display_wait_time(SEARCH_REFRESH);
            }
            else
            {
                global_run = false;
                big_red_button.textContent = "Start";
            }
        }
    }
}

function ignore_check(r,t){
    if (ignore_list.indexOf(r)==-1)
    {
        return true;
    }
    return false;
}

function start_running()
{
    if (big_red_button.textContent == "Start")
    {
        global_run = true;
        initial_url = URL_BASE;
        if (search_input.value.length>0)
        {
            initial_url = initial_url.replace("searchWords=", "searchWords=" + search_input.value);
        }
        if (time_input.value.replace(/[^0-9]+/g,"") != "")
        {
            SEARCH_REFRESH = Number(time_input.value);
        }
        if (page_input.value.replace(/[^0-9]+/g,"") != "")
        {
            PAGES_TO_SCRAPE = Number(page_input.value);
        }
        if (min_input.value.replace(/[^0-9]+/g,"") != "")
        {
            MINIMUM_HITS = Number(min_input.value);
        }
        if (new_time_display_input.value.replace(/[^0-9]+/g,"") != "")
        {
            save_new_results_time = Number(new_time_display_input.value);
        }
        if (reward_input.value.replace(/[^0-9]+/g,"") != "")
        {
            initial_url += "&minReward=" + reward_input.value;
        }
        else
        {
            initial_url += "&minReward=0.00";
        }
        if (qual_input.checked)
        {
            initial_url += "&qualifiedFor=on"
        }
        else
        {
            initial_url += "&qualifiedFor=off"
        }
        if (masters_input.checked)
        {
            initial_url += "&requiresMasterQual=on"
        }
        if (sort_input1.checked)
        {
            initial_url+= "&sortType=LastUpdatedTime%3A1";
            default_type = 0;
        }
        else if (sort_input2.checked)
        {
            initial_url+= "&sortType=NumHITs%3A1";
            default_type = 1;
        }
        else if (sort_input3.checked)
        {
            initial_url+= "&sortType=Reward%3A1";
            default_type = 0;
        }
        
            if (pagesToSearchBoolean == true){ PAGES_TO_SCRAPE = 5;}else{ PAGES_TO_SCRAPE = 1;}
        initial_url+="&pageNumber=1&searchSpec=HITGroupSearch"
        start_it();
    }
    else
    {
        global_run = false;
        clearTimeout(wait_loop);
        big_red_button.textContent = "Start";
        set_progress_report("Stopped", true);
    }
}

function start_it()
{
    statusdetail_loop_finished = false;
    big_red_button.textContent = "Stop";
    found_key_list=[];
    var ctime = new Date().getTime()
    if (ctime - last_clear_time > save_results_time*666)
    {
        var last_history=history;
        history = {};
        for (var key in last_history)
        {
            if (last_history[key].new_result<save_results_time*1000)
            {
                history[key]=last_history[key];
                if (last_history[key].found_this_time)
                {
                    last_history[key].found_this_time = false;
                    if (last_history[key].new_result>save_new_results_time*1000)
                        last_history[key].initial_time = ctime-1000*save_new_results_time;
                }
            }

        }
        last_clear_time = ctime;
    }
    next_page = 1;
    statusdetail_loop(initial_url);
}


function show_interface()
{
    //control_panel.style.color = BROWN;
    //control_panel.style.fontSize = 14;
    control_panel.removeChild(big_red_button);
    control_panel.appendChild(document.createElement("P"));
    control_panel.appendChild(document.createTextNode("Auto-refresh delay: "));
    time_input.onkeydown = function(event){if (event.keyCode == 13){start_running();}};
    time_input.title = "Enter search refresh delay in seconds\n" + "Enter 0 for no auto-refresh\n" + "Default is 0 (no auto-refresh)";
    time_input.size = 3;
    control_panel.appendChild(time_input);
    
    control_panel.appendChild(document.createTextNode("   "));
    
    control_panel.appendChild(document.createTextNode("Pages to scrape: "));
    page_input.onkeydown = function(event){if (event.keyCode == 13){start_running();}};
    page_input.title = "Enter number of pages to scrape\n" + "Default is 4";
    page_input.size = 3;
    control_panel.appendChild(page_input);
    
    control_panel.appendChild(document.createTextNode("   "));
    
    control_panel.appendChild(document.createTextNode("Minimum batch size: "));
    min_input.onkeydown = function(event){if (event.keyCode == 13){start_running();}};
    min_input.title = "Enter minimum HITs for batch search\n" + "Default is 100";
    min_input.size = 3;
    control_panel.appendChild(min_input);
    control_panel.appendChild(document.createTextNode("   "));
    
    control_panel.appendChild(document.createTextNode("New HIT highlighting: "));
    new_time_display_input.onkeydown = function(event){if (event.keyCode == 13){start_running();}};
    new_time_display_input.title = "Enter time (in seconds) to keep new HITs highlighted\n" + "Default is 300 (5 minutes)";
    new_time_display_input.size = 6;
    control_panel.appendChild(new_time_display_input);
    
    control_panel.appendChild(document.createElement("P"));
    control_panel.appendChild(document.createTextNode("Minimum reward: "));
    reward_input.size = 6;
    control_panel.appendChild(reward_input);
    control_panel.appendChild(document.createTextNode("   "));

    control_panel.appendChild(document.createTextNode("Qualified"));
    control_panel.appendChild(qual_input);
    control_panel.appendChild(document.createTextNode("     "));
    control_panel.appendChild(document.createTextNode("Masters"));
    control_panel.appendChild(masters_input);
    autoAccept_input.setAttribute('style', 'position:fixed; right:5px; top:10px;');
    control_panel.appendChild(document.createTextNode("     "));
    control_panel.appendChild(document.createTextNode("AutoAccept"));
    control_panel.appendChild(autoAccept_input);
    control_panel.appendChild(document.createTextNode("     "));
    control_panel.appendChild(document.createTextNode("Sort types:   "));
    control_panel.appendChild(sort_input1);
    control_panel.appendChild(document.createTextNode("Latest"));
    control_panel.appendChild(sort_input2);
    control_panel.appendChild(document.createTextNode("Most Available"));
    control_panel.appendChild(sort_input3);
    control_panel.appendChild(document.createTextNode("Amount"));
       
    control_panel.appendChild(document.createElement("P"));
    
    control_panel.appendChild(search_input);
    search_input.size = 20;
    search_input.title = "Enter a search term to include\n" + "Default is blank (no included terms)";
    search_input.placeholder="Enter search terms here";
    
    control_panel.appendChild(document.createTextNode("   "));
    
    big_red_button.textContent = "Start";
    big_red_button.onclick = function(){start_running();};
    
    control_panel.appendChild(big_red_button);
   
    control_panel.appendChild(document.createTextNode("   "));
    control_panel.appendChild(progress_report);
     
    control_panel.appendChild(document.createElement("P"));
    
    //text_area.style.fontWeight = 400;
    text_area.style.marginTop = "50px";
    text_area.createCaption().innerHTML = " ";
    //var col_heads = ['Requester','Title','Reward','HITs Available','TO pay',"Accept HIT"];
    var col_heads = ['Timestamp','Requester Name','N/A','HIT Title','Reward','HITs','TO Pay',"Accept Link"];
    var row = text_area.createTHead().insertRow(0);
    //text_area.caption.style.fontWeight = 800;
    text_area.caption.style.color = BROWN;
    //if (default_text_size > 10)
    //  text_area.cellPadding=Math.min(Math.max(1,Math.floor((default_text_size-10)/2)),5);
    text_area.cellPadding=3;
    //text_area.caption.style.fontSize = 28;
    //ftext_area.style.backgroundColor = "#EEEEEE";
    //text_area.rows[0].style.fontWeight = 800;
    text_area.rows[0].style.color = BROWN;
    for (i=0; i<col_heads.length; i++)
    {
        var this_cell = row.insertCell(i);
        this_cell.innerHTML = col_heads[i];
        //this_cell.style.fontSize = 14;
        if (i > 1)
            this_cell.style.textAlign = 'center';
    }
    
    control_panel.appendChild(text_area);
    start_running();
}