// ==UserScript==
// @name        HIT Scraper WITH EXPORT
// @author      Kerek and TJ
// @description Snag HITs.
//              Based in part on code from mmmturkeybacon Export Mturk History and mmmturkeybacon Color Coded Search with Checkpoints
// @namespace   http://userscripts.org/users/536998
// @match       https://www.mturk.com/mturk/findhits?match=true#hit_scraper*
// @match       https://www.mturk.com/mturk/findhits?match=true?hit_scraper*
// @version     1.3.3.13
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant	GM_deleteValue
// @require     http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/4717/HIT%20Scraper%20WITH%20EXPORT.user.js
// @updateURL https://update.greasyfork.org/scripts/4717/HIT%20Scraper%20WITH%20EXPORT.meta.js
// ==/UserScript==

// use this link to use scraper logged out
https://www.mturk.com/mturk/findhits?match=true?hit_scraper

//alter the requester ignore last as you desire, case insensitive
var default_list = ["oscar smith", "Diamond Tip Research LLC", "jonathon weber", "jerry torres", "Crowdsource", "we-pay-you-fast", "turk experiment", "jon brelig"];
var ignore_list = default_list;
if (GM_getValue("scraper_ignore_list"))
    ignore_list = GM_getValue("scraper_ignore_list");

//This is to update the hit export symbol
var symbol = "☭";

//this searches extra pages if you skip too much, helps fill out results if you hit a chunk of ignored HITs.  Change to true for this behavior.
var correct_for_skips = true;

//weight the four TO ratings for the coloring. Default has pay twice as important as fairness and nothing for communication and fast.
var COMM_WEIGHT = 0;
var PAY_WEIGHT  = 10;
var FAIR_WEIGHT = 5;
var FAST_WEIGHT = 0;

//display your hitdb records if applicable
var check_hitDB = true;

//default text size
var default_text_size=11;



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
             console.log(title + ' not found');
        history[button].titledb=false;
      }
      else
      {
          console.log(title + ' found');
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
        console.log(id + ' not found');
      }
      else
      {
            history[button].reqdb=true;
        console.log(id + ' found');
      }
      db.close();
    };
	};
	request.onerror = HITStorage.indexedDB.onerror;
};

var PAGES_TO_SCRAPE = 3;
var MINIMUM_HITS = 100;
var SEARCH_REFRESH=0;
var URL_BASE = "/mturk/searchbar?searchWords=&selectedSearchType=hitgroups";
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
time_input.value = 0;
var page_input = document.createElement("INPUT");
page_input.value = 3;
var min_input = document.createElement("INPUT");
var new_time_display_input = document.createElement("INPUT");
new_time_display_input.value = 300;
var reward_input = document.createElement("INPUT");
var qual_input = document.createElement("INPUT");
qual_input.type = "checkbox";
qual_input.checked = true;
var masters_input = document.createElement("INPUT");
masters_input.type = "checkbox";
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
var BACKGROUND_COLOR = "rgb(19, 19, 19)";
var STATUSDETAIL_DELAY = 250;
var MPRE_DELAY = 3000;

var next_page = 1;

var GREEN   = '#66CC66'; //  > 4
var LIGHTGREEN = '#ADFF2F'; // > 3  GREEN YELLOW
var YELLOW = '#FFD700';
var ORANGE  = '#FF9900'; //  > 2
var RED     = '#FF3030'; // <= 2
var BLUE    = '#C0D9D9'; // no TO
var GREY = 'lightGrey';
var BROWN = '#94704D';
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
var reset_blocks = document.createElement("BUTTON");
var progress_report = document.createTextNode("Stopped");
var text_area = document.createElement("TABLE");
big_red_button.textContent = "Show Interface";
big_red_button.onclick =  function(){show_interface();};
reset_blocks.textContent = "Reset blocklist";
reset_blocks.onclick = function(){
        console.log("in");
        if (confirm("Are you sure you want to delete your blocklist?")){
        	GM_deleteValue("scraper_ignore_list");
        	ignore_list = default_list;
        	alert("Ignore list reset to default, please re-scrape");
        }
    };
control_panel.appendChild(big_red_button);
control_panel.appendChild(reset_blocks);

show_interface();

var global_run = false;
var statusdetail_loop_finished = false;
var date_header = "";
var history = {};
var wait_loop;

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
    console.log(disp);
}

function scrape($src)
{
    var $requester = $src.find('a[href^="/mturk/searchbar?selectedSearchType=hitgroups&requester"]');
    var $title = $src.find('a[class="capsulelink"]');
    var $reward = $src.find('span[class="reward"]');
    var $preview = $src.find('a[href^="/mturk/preview?"]');
    var $qualified = $src.find('a[href^="/mturk/notqualified?"]');
    var $completed = $src.find('a[id^="number_of_hits"]');
    var $times = $src.find('a[id^="duration_to_complete"]');
    var $descriptions = $src.find('a[id^="description"]');
    var not_qualified_group_IDs=[];
    var $quals = $src.find('a[id^="qualificationsRequired"]');
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
        var reward = $reward.eq(j).text().trim();
        var hits = $hits.eq(4).text().trim();
        var time = $times.eq(j).parent()[0].nextSibling.nextSibling.innerHTML;
        var description = $descriptions.eq(j).parent()[0].nextSibling.nextSibling.innerHTML;
        //console.log(description);
        var requester_id = requester_link.replace('/mturk/searchbar?selectedSearchType=hitgroups&requesterId=','');
        var accept_link;
        accept_link = preview_link.replace('preview','previewandaccept');
        
        /*HIT SCRAPER ADDITION*/
        var qElements = $quals.eq(j).parent().parent().parent().find('tr');
        //console.log(qElements);

        var qualifications = [];
        for (var i = 1; i < qElements.length; i++) {
            qualifications.push((qElements[i].childNodes[1].textContent.trim().replace(/\s+/g, ' ').indexOf("Masters") != -1 ? "[color=red][b]"+qElements[i].childNodes[1].textContent.trim().replace(/\s+/g, ' ')+"[/b][/color]" : qElements[i].childNodes[1].textContent.trim().replace(/\s+/g, ' ')));
        }
        var qualList = (qualifications.join(', ') ? qualifications.join(', ') : "None");

        key = requester_name+title+reward+group_ID;
        found_key_list.push(key);
        if (history[key] == undefined)
        {
            history[key] = {requester:"", title:"", description:"", reward:"", hits:"", req_link:"", quals:"", prev_link:"", rid:"", acc_link:"", new_result:"", qualified:"", found_this_time:"", initial_time:"", reqdb:"",titledb:"",time:""};
            history[key].req_link = requester_link;
            history[key].prev_link = preview_link;
            history[key].requester = requester_name;
            history[key].title = title;
            history[key].reward = reward;
            history[key].hits = hits;
            history[key].rid = requester_id;
            history[key].acc_link = accept_link;
            history[key].time = time;
            history[key].quals = qualList;
            history[key].description = description;
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
        if (next_URL.length != 0)
        {
            $.get(next_URL, function(data)
            {
                var $src = $(data);
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
        
                    else if (next_page > PAGES_TO_SCRAPE && correct_for_skips)
                    {
                        var skipped_hits = 0;
                        var added_pages = 0;
                        for (j = 0; j < found_key_list.length; j++)
                        {
                            var obj = history[found_key_list[j]];
                            if (! ignore_check(obj.requester,obj.title))
                                skipped_hits++;
                        }
                        added_pages = Math.floor(skipped_hits/10);
                        if (skipped_hits%10 >6)
                            added_pages++;
                        if (next_page > PAGES_TO_SCRAPE + added_pages)
                        {
                            next_URL = "";
                            next_page = -1;
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
                    console.log("MPRE");
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
            for (i = lastRow; i>0; i--)
                text_area.deleteRow(i);
            for (j = 0; j < found_key_list.length; j++)
            {
                //(function(url,rids,j) {
                    var obj = history[found_key_list[j]];
                    if (ignore_check(obj.requester,obj.title) && obj.found_this_time){
                        ++shown_hits;
                        //console.log(obj);
                        //hit export will update col_heads[1]
                        var col_heads = ["<a href='"+ LINK_BASE+obj.req_link +"' target='_blank'>" + obj.requester + "</a>","<a href='"+ LINK_BASE+obj.prev_link +"' target='_blank' title='"+ obj.description +"'>" + obj.title + "</a>",obj.reward,obj.hits,"TO down","<a href='"+ LINK_BASE+obj.acc_link +"' target='_blank'>Accept</a>"];
                        var row = text_area.insertRow(text_area.rows.length);
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
                            row.cells[i].style.fontSize = default_text_size;
                            this_cell.innerHTML = col_heads[i];
                            if(i>1)
                                this_cell.style.textAlign = 'center';
                            if (check_hitDB)
                            {
                                if (i==6)
                                {
                                    if (obj.reqdb)
                                        this_cell.style.backgroundColor = GREEN;
                                    else
                                        this_cell.style.backgroundColor = RED;
                                }
                                else if (i==7)
                                {
                                    if (obj.titledb)
                                        this_cell.style.backgroundColor = GREEN;
                                    else
                                        this_cell.style.backgroundColor = RED;
                                }
                                else if (i==8)
                                    this_cell.style.backgroundColor = DARKGREY;
                            }
                            else if (i==6)
                                this_cell.style.backgroundColor = DARKGREY;
                        }
                        if (Object.keys(history).length>0)
                        {
                            if (obj.new_result < 1000*save_new_results_time)
                            {
                                new_hits++;
                                for (i in col_heads)
                                {
                                    row.cells[i].style.fontSize = default_text_size + 1;
                                    row.cells[i].style.fontWeight = "bold";
                                }
                            }
                        }
                        button = document.createElement('button'); //HIT SCRAPER ADDITION
                        button.textContent = 'vB';
                        button.title = 'Export this HIT description as vBulletin formatted text';
                        
                        button.style.height = '14px';
                        button.style.width = '30px';
                        button.style.fontSize = '8px';
                        button.style.border = '1px solid';
                        button.style.padding = '0px';
                        button.style.backgroundColor = 'transparent';
                        
                        button2 = document.createElement('button'); //BUTTON TO BLOCK REQUESTER
                        button2.textContent = '☢';
                        button2.title = 'Add requester to block list';
                        
                        button2.style.height = '14px';
                        button2.style.width = '30px';
                        button2.style.fontSize = '10px';
                        button2.style.border = '1px solid';
                        button2.style.padding = '0px';
                        button2.style.backgroundColor = 'transparent';
                        
                        //button.addEventListener("click", function() {export_func_deleg(j);}.bind(null,j), false);
                        button.addEventListener("click", (function (obj,j) { return function() {export_func_deleg(obj,j);}})(obj,j));
                        row.cells[1].appendChild(button);
                        button2.addEventListener("click", (function (obj,j) { return function() {block_deleg(obj,j);}})(obj,j));
                        row.cells[0].appendChild(button2);
                    }
                //});
                
            }
            set_progress_report("Scrape complete. " + shown_hits + " HITs found (" + new_hits + " new results). " + (found_hits - shown_hits) + " HITs ignored.", false);
            url = url.substring(0,url.length - 1);
            //console.log(url);
            var success_flag = false;
            GM_xmlhttpRequest(
            {
                method: "GET",
                url: url,
                onload: function (results)
                {
                    //console.log(results.responseText);
                    rdata = $.parseJSON(results.responseText);
                    for (i = 0; i < rids.length; i++)
                    {
                        text_area.rows[i+1].style.backgroundColor = GREY;
                        if (rdata[rids[i]])
                        {
                            var pay = rdata[rids[i]].attrs.pay
                            var reviews = rdata[rids[i]].reviews
                            var average = 0;
                            var sum = 0;
                            var divisor = 0;
                            var comm = rdata[rids[i]].attrs.comm;
                            var fair = rdata[rids[i]].attrs.fair;
                            var fast = rdata[rids[i]].attrs.fast;
                            if (comm > 0)
                            {
                                sum += COMM_WEIGHT*comm;
                                divisor += COMM_WEIGHT;
                            }
                            if (pay > 0)
                            {
                                sum += PAY_WEIGHT*pay;
                                divisor += PAY_WEIGHT;
                            }
                            if (fair > 0)
                            {
                                sum += FAIR_WEIGHT*fair;
                                divisor += FAIR_WEIGHT;
                            }
                            if (fast > 0)
                            {
                                sum += FAST_WEIGHT*fast;
                                divisor += FAST_WEIGHT;
                            }
                            if (divisor > 0)
                            {
                                average = sum/divisor;
                            }
                            text_area.rows[i+1].cells[4].innerHTML = "<a href='"+ TO_REQ_URL+rids[i] +"' target='_blank'>" + pay + "</a>";
                            if (reviews > 4)
                            {
                                if (average > 4.49)
                                    text_area.rows[i+1].style.backgroundColor = GREEN;
                                else if (average > 3.49)
                                    text_area.rows[i+1].style.backgroundColor = LIGHTGREEN;
                                //else if (average > 2.99)
                                 //   text_area.rows[i+1].style.backgroundColor = YELLOW;
                                else if (average > 1.99)
                                    text_area.rows[i+1].style.backgroundColor = ORANGE;
                                else if (average > 0)
                                    text_area.rows[i+1].style.backgroundColor = RED;
                             }
                        }
                        else
                        {
                            text_area.rows[i+1].cells[4].innerHTML = "No data";
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
    return -1 == ignore_list.map(function(item) { return item.toLowerCase(); }).indexOf(r.toLowerCase());
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
    control_panel.style.color = BROWN;
    control_panel.style.fontSize = 14;
    control_panel.removeChild(big_red_button);
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
    reset_blocks.textContent = "Reset blocklist";
    reset_blocks.onclick = function(){
        console.log("in");
        if (confirm("Are you sure you want to delete your blocklist?")){
        	GM_deleteValue("scraper_ignore_list");
        	ignore_list = default_list;
        	alert("Ignore list reset to default, please re-scrape");
        }
    };
    
    control_panel.appendChild(big_red_button);
    control_panel.appendChild(reset_blocks);
   
    control_panel.appendChild(document.createTextNode("   "));
    control_panel.appendChild(progress_report);
     
    control_panel.appendChild(document.createElement("P"));
    
    text_area.style.fontWeight = 400;
    text_area.createCaption().innerHTML = "HITs";
    var col_heads = ['Requester','Title','Reward','HITs Available','TO pay',"Accept HIT"];
    var row = text_area.createTHead().insertRow(0);
    text_area.caption.style.fontWeight = 800;
    text_area.caption.style.color = BROWN;
	if (default_text_size > 10)
		text_area.cellPadding=Math.min(Math.max(1,Math.floor((default_text_size-10)/2)),5);
    //console.log(text_area.cellPadding);
    //text_area.cellPadding=2;
    text_area.caption.style.fontSize = 28;
    text_area.rows[0].style.fontWeight = 800;
    text_area.rows[0].style.color = BROWN;
    for (i=0; i<col_heads.length; i++)
    {
        var this_cell = row.insertCell(i);
        this_cell.innerHTML = col_heads[i];
        this_cell.style.fontSize = 14;
        if (i > 1)
            this_cell.style.textAlign = 'center';
    }
    
    control_panel.appendChild(text_area);
}

/********HIT EXPORT ADDITIONS*****/

	var EDIT = false;
    var HIT;

    var TO_BASE = "http://turkopticon.ucsd.edu/";
    var API_BASE = "https://api.turkopticon.istrack.in/";
    var API_URL = API_BASE + "multi-attrs.php?ids=";
    
    DEFAULT_TEMPLATE = '[table][tr][td][b]Title:[/b] [url={prev_link}][COLOR=blue]{title}[/COLOR][/url]\n';
    DEFAULT_TEMPLATE += '[b]Requester:[/b] [url=https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&requesterId={rid}][COLOR=blue]{requester}[/COLOR][/url]';
    DEFAULT_TEMPLATE += ' [{rid}] ([url='+TO_BASE+'{rid}][COLOR=blue]TO[/COLOR][/url])';
    DEFAULT_TEMPLATE += '\n[b]TO Ratings:[/b]{to_stuff}';
    DEFAULT_TEMPLATE += '\n[b]Description:[/b] {description}';
    DEFAULT_TEMPLATE += '\n[b]Time:[/b] {time}';
    DEFAULT_TEMPLATE += '\n[b]Reward:[/b] [COLOR=green][b]{reward}[/b][/COLOR]';
    DEFAULT_TEMPLATE += '\n[b]Hits Available:[/b] {hits_available}';
    DEFAULT_TEMPLATE += '\n[b]Qualifications:[/b] {quals}[/td][/tr][/table]';

    var TEMPLATE;
    var EASYLINK;

    if (typeof GM_getValue === 'undefined')
        TEMPLATE = null;
    else {
        TEMPLATE = GM_getValue('HITScraper Template');
        EASYLINK = GM_getValue('HITScraper Easylink');
    }
    if (TEMPLATE == null) {
        TEMPLATE = DEFAULT_TEMPLATE;
    }

    function buildXhrUrl(rai) {
        var url = API_URL;
        var ri = rai;
        url += rai;
        return url;
    }

    function makeXhrQuery(url) {
        var xhr = new XMLHttpRequest();
        try{
        	xhr.open('GET', url, false);
            xhr.send(null);
            return $.parseJSON(xhr.response);
        }
        catch(err){
            return "TO DOWN";
        }
    }

    function getNamesForEmptyResponses(rai, resp) {
        for (var rid in rai) {
            if (rai.hasOwnProperty(rid) && resp[rid] == "") {
                resp[rid] = $.parseJSON('{"name": "' + rai[rid][0].innerHTML.split("<")[1].split(">")[1] + '"}');
            }
        }
        return resp;
    }

    function getKeys(obj) {
        var keys = [];
        for (var key in obj) {
            keys.push(key);
        }
        return keys;
    }

function export_func_deleg(item,index) {
	//console.log(item);
    export_func(item);
    }

function block_deleg(item,index) {
	//console.log(item);
    block(item);
    }

function block(hit){
    var requester = hit["requester"];
    ignore_list.push(requester);
    GM_setValue("scraper_ignore_list",ignore_list);
    console.log(GM_getValue("scraper_ignore_list"));
    alert(requester+" ignored. Re-scrape");
}

function export_func(item) {
    HIT = item;
    edit_button.textContent = 'Edit Template';
    apply_template(item);
    div.style.display = 'block';
    textarea.select();
}

function apply_template(hit_data) {
        var txt = TEMPLATE;

        var vars = ['title', 'requester', 'rid', 'description', 'reward', 'quals', 'prev_link', 'time', 'hits_available', 'hits', 'to_stuff', 'to_text'];

        var resp = null;
        if (txt.indexOf('{to_text}') >= 0 || txt.indexOf('{to_stuff}') >= 0){
            var url = buildXhrUrl(hit_data["rid"]);
            resp = makeXhrQuery(url);
            //console.log(resp);
        }
        var toText = "";
        var toStuff = "";
        var toData = "";
        var numResp = (resp == null || resp == "TO DOWN" ? "n/a" : resp[hit_data["rid"]].reviews);
        if (resp == "TO DOWN"){
            toStuff = " [URL=\""+TO_BASE+hit_data['rid']+"\"]TO down.[/URL]";
            toText = toStuff;
        }
        else if (resp == null || resp[hit_data["rid"]].attrs == null && resp != "TO DOWN") {
            toStuff = " No TO ";
            toText = " No TO ";
            toStuff += "[URL=\""+TO_BASE+"report?requester[amzn_id]=" + hit_data['rid'] + "&requester[amzn_name]=" + hit_data['requester'] + "\"]";
            toStuff += "(Submit a new TO rating for this requester)[/URL]";
        }
        else {
            for (var key in resp[hit_data["rid"]].attrs) {
                //toText += "\n[*]"+key+": "+resp[hit_data["requesterId"]].attrs[key]+"\n";
                var i = 0;
                var color = "green";
                var name = key;
                var num = Math.floor(resp[hit_data["rid"]].attrs[key]);
                switch (key){
                    case "comm":
                        name = "Communicativity";
                        break;
                    case "pay":
                        name = "Generosity";
                        break;
                    case "fast":
                        name = "Promptness";
                        break;
                    case "fair":
                        name = "Fairness";
                        break;
                    default:
                        name = key;
                        break;
                }
                switch (num){
                    case 0:
                        color = "red";
                        break;
                    case 1:
                        color = "red";
                        break;
                    case 2:
                        color = "orange";
                        break;
                    case 3:
                        color = "yellow";
                        break;
                    default:
                        break;
                }
                toText += (num > 0 ? "\n[color="+color+"]" : "\n");
                for (i; i < num; i++){
                    toText += "[b]"+symbol+"[/b]"
                }
                toText += (num > 0 ? "[/color]" : "")
                if (i < 5){
                    toText += "[color=white]";
                    for (i; i < 5; i++)
                        toText += "[b]"+symbol+"[/b]";
                    toText += "[/color]";
                }
                toText += " "+Number(resp[hit_data["rid"]].attrs[key]).toFixed(2)+" "+name;
                toData += Number(resp[hit_data["rid"]].attrs[key]).toFixed(2) + ",";
            }
            //toText += "[/list]";
            toText += (txt.indexOf('{to_stuff}') >= 0 ? "" : "\nNumber of Reviews: "+numResp+"\n[URL=\""+TO_BASE+"report?requester[amzn_id]=" + hit_data['rid'] + "&requester[amzn_name]=" + hit_data['requester'] + "\"](Submit a new TO rating for this requester)[/URL]");
            toStuff = '\n[img]http://data.istrack.in/to/' + toData.slice(0,-1) + '.png[/img]';
            toStuff += (txt.indexOf('{to_stuff}') >= 0 ? (txt.indexOf('{to_text}') >= 0 ? "" : toText) : "");
            toStuff += "\nNumber of Reviews: "+numResp;
            toStuff += "[URL=\""+TO_BASE+"report?requester[amzn_id]=" + hit_data['rid'] + "&requester[amzn_name]=" + hit_data['requester'] + "\"]";
            toStuff += "\n(Submit a new TO rating for this requester)[/URL]";
        }
        
        for (var i = 0; i < vars.length; i++) {
            t = new RegExp('\{' + vars[i] + '\}', 'g');
            if (vars[i] == "to_stuff") {
                txt = txt.replace(t, toStuff);
            }
            else if (vars[i] == "to_text"){
                txt = txt.replace(t, toText);
            }
            else if (vars[i] == "prev_link"){
                txt = txt.replace(t,"https://www.mturk.com"+hit_data[vars[i]]);
            }
            else if (vars[i] == "acc_link"){
                txt = txt.replace(t,"https://www.mturk.com"+hit_data[vars[i]]);
            }
            else
                txt = txt.replace(t, hit_data[vars[i]]);
        }
        textarea.value = txt;
    }

function hide_func(div) {
    if (EDIT == false)
        div.style.display = 'none';
    }

function edit_func() {
    if (EDIT == true) {
        EDIT = false;
        TEMPLATE = textarea.value;
        edit_button.textContent = 'Edit Template';
        apply_template(HIT);
    }
    else {
        console.log("Editing");
        EDIT = true;
        edit_button.textContent = 'Show Changes';
        save_button.disabled = false;
        textarea.value = TEMPLATE;
    }
    }

function default_func() {
    GM_deleteValue('HITScraper Template');
    TEMPLATE = DEFAULT_TEMPLATE;
    EDIT = false;
    edit_button.textContent = 'Edit Template';
    apply_template(HIT);
    }

    function save_func() {
        if (EDIT)
            TEMPLATE = textarea.value;
        GM_setValue('HITScraper Template', TEMPLATE);
    }

	var div = document.createElement('div');
    var textarea = document.createElement('textarea');
    var div2 = document.createElement('label');

    div.style.position = 'fixed';
    div.style.width = '500px';
    div.style.height = '235px';
    div.style.left = '50%';
    div.style.right = '50%';
    div.style.margin = '-250px 0px 0px -250px';
    div.style.top = '300px';
    div.style.padding = '5px';
    div.style.border = '2px';
    div.style.backgroundColor = 'black';
    div.style.color = 'white';
    div.style.zIndex = '100';

    textarea.style.padding = '2px';
    textarea.style.width = '500px';
    textarea.style.height = '200px';
    textarea.title = '{title}\n{requester}\n{rid}\n{description}\n{reward}\n{quals}\n{prev_link}\n{time}\n{hit}\n{to_stuff}\n{to_text}';

    div.textContent = 'Press Ctrl+C to copy to clipboard. Click textarea to close';
    div.style.fontSize = '12px';
    div.appendChild(textarea);

    var edit_button = document.createElement('button');
    var save_button = document.createElement('button');
    var default_button = document.createElement('button');
    var easy_button = document.createElement('button');

    edit_button.textContent = 'Edit Template';
    edit_button.setAttribute('id', 'edit_button');
    edit_button.style.height = '18px';
    edit_button.style.width = '100px';
    edit_button.style.fontSize = '10px';
    edit_button.style.paddingLeft = '3px';
    edit_button.style.paddingRight = '3px';
    edit_button.style.backgroundColor = 'white';

    save_button.textContent = 'Save Template';
    save_button.setAttribute('id', 'save_button');
    save_button.style.height = '18px';
    save_button.style.width = '100px';
    save_button.style.fontSize = '10px';
    save_button.style.paddingLeft = '3px';
    save_button.style.paddingRight = '3px';
    save_button.style.backgroundColor = 'white';
    save_button.style.marginLeft = '5px';

    easy_button.textContent = 'Change Adfly Url';
    easy_button.setAttribute('id', 'easy_button');
    easy_button.style.height = '18px';
    easy_button.style.width = '100px';
    easy_button.style.fontSize = '10px';
    easy_button.style.paddingLeft = '3px';
    
    default_button.textContent = ' D ';
    default_button.setAttribute('id', 'default_button');
    default_button.style.height = '18px';
    default_button.style.width = '20px';
    default_button.style.fontSize = '10px';
    default_button.style.paddingLeft = '3px';
    default_button.style.paddingRight = '3px';
    default_button.style.backgroundColor = 'white';
    default_button.style.marginLeft = '5px';
    default_button.title = 'Return default template';
 
    div.appendChild(edit_button);
    div.appendChild(save_button);
    div.appendChild(default_button);
    div.appendChild(easy_button);
    save_button.disabled = true;

    div.style.display = 'none';
    textarea.addEventListener("click", function() {hide_func(div);}, false);
    edit_button.addEventListener("click", function() {edit_func();}, false);
    save_button.addEventListener("click", function() {save_func();}, false);
    default_button.addEventListener("click", function() {default_func();}, false);
    document.body.insertBefore(div, document.body.firstChild);