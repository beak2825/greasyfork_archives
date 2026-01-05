// ==UserScript==
// @name        CH Export MTurk Quals
// @author      clickhappier
// @namespace   clickhappier
// @description Exports your Mturk qualifications as tab-separated values - adapted from mmmturkeybacon Export Mturk History.
// @include     https://www.mturk.com/mturk/findquals?*
// @include     https://www.mturk.com/mturk/viewquals?*
// @include     https://www.mturk.com/mturk/sortquals?*
// @require     http://code.jquery.com/jquery-latest.min.js
// @version     2.1c
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/3790/CH%20Export%20MTurk%20Quals.user.js
// @updateURL https://update.greasyfork.org/scripts/3790/CH%20Export%20MTurk%20Quals.meta.js
// ==/UserScript==

// I made this script (adapted from mmmturkeybacon's Export Mturk History), because on mturk.com, your qual list is only 
// sortable by qual name. To use this script, go to the "Qualifications Assigned To You" page. Click the Start button.
// It generates a list of all your currently assigned quals. When it finishes running, select all the output in the
// text box, and copy it into a spreadsheet. Then you can sort and filter as desired, using your spreadsheet program's
// functionality - for example, to see which quals you most recently received, or all quals from a certain requester.
// And if you save copies of past versions of the output list, you can compare them in the future to see changes if desired.



// check if you're on the "Qualifications Assigned To You" page, so you don't think you can run this on the huge list of all quals
var assignedCheck = $('a.nonboldsubnavclass').text().trim();
if ( assignedCheck === 'Qualifications Assigned To You' ) {
// console.log("Qual Export Enabled");


// get current # of qual results per page selected - added 2015-12-10
var perPageSetting = 10;
if ( $('select.items-per-page').length > 0 )
{ 
    perPageSetting = $('select.items-per-page').val(); 
}


// create variables

var BACKGROUND_COLOR = "#FFFFFF";
var QUALDETAIL_DELAY = 500;
var MPRE_DELAY = 2000;

var control_panel_HTML = '<div id="control_panel" style="margin: 0 auto 0 auto;' +
                         'border-bottom: 1px solid #000000; margin-bottom: 5px; ' +
                         'background-color: ' + BACKGROUND_COLOR + ';"></div>';

$('body').prepend(control_panel_HTML);
var control_panel = document.getElementById("control_panel");
var big_red_button = document.createElement("BUTTON");
var progress_report = document.createTextNode("Stopped");
var p = document.createElement("P");
var text_area = document.createElement("TEXTAREA");

big_red_button.textContent = "Show Interface";
big_red_button.onclick =  function(){show_interface();};
control_panel.appendChild(big_red_button);

var global_run = false;
var qualdetail_loop_finished = false;
var page_num = 0;
var qualhistory = {};


// update the status text displayed next to the start/stop button

function set_progress_report(text, force)
{
    // console.log("Qual Export set_progress_report");
    if (global_run === true || force === true)
    {
        progress_report.textContent = text;
    }
}


// check if the scraping is done

function wait_until_stopped()
{
    // console.log("Qual Export wait_until_stopped");
    if (global_run === true)
    {
        if (qualdetail_loop_finished === true)
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


// collect the qual data from each page

function scrape($src)
{
    // console.log("Qual Export scrape");
    var $qualid = $src.find('a[id*="requestQualLink"]');
    var $qualtitle = $src.find('a[class="capsulelink"]');
    var $author = $src.find('td[class="capsule_field_title"]:contains("Author:")').next();
    var $value = $src.find('td[class="capsule_field_title"]:contains("Qualification Value:")').next();
    var $users = $src.find('td[class="capsule_field_title"]:contains("Qualified Users:")').next();
    var $description = $src.find('td[class="capsule_field_title"]:contains("Description:")').next();
    var $dateassigned = $src.find('td[class="capsule_field_title"]:contains("Date Assigned:")').next();
    var $dateretake = $src.find('td[class="capsule_field_title"]:contains("Retake date:")').next();

    var j = 0;
    for (j = 0; j < $qualtitle.length; j++)
    {
    // console.log("Qual Export j=" + j);
        var qualid = $qualid.eq(j).attr("href").split('=')[1];
        var qualtitle = $qualtitle.eq(j).text().trim();
        var author = $author.eq(j).text().trim();
        var value = $value.eq(j).text().trim();
        var users;
        if ( $users.length > 0 ) 
            { users = $users.eq(j).text().trim(); }
        else
            { users = "N/A"; }
        var description = $description.eq(j).text().trim().replace(/\r\n|\n|\r|\t/g, ' ');
        var dateassigned = $dateassigned.eq(j).text().trim();
        var dateretake = $dateretake.eq(j).text().trim().replace(/\(.*?\)|\r\n|\n|\r|\t| ( )*/g, ' ').trim();  // removes parenthetical note about how far in the future a retake date is, and the excessive whitespace in between that and the actual date

        var key = qualid;
        if (qualhistory[key] === undefined)
        {
            qualhistory[key] = {qualtitle:"", author:"", value:0, users:0, description:"", dateassigned:"", dateretake:"", qualid:""};
            qualhistory[key].qualtitle = qualtitle;
            qualhistory[key].author = author;
            qualhistory[key].value = value;
            qualhistory[key].users = users;
            qualhistory[key].description = description;
            qualhistory[key].dateassigned = dateassigned;
            qualhistory[key].dateretake = dateretake;
            qualhistory[key].qualid = qualid;
        }
    }
}

// advance to the next page of quals, and display the finished output when there is no next page anymore
function qualdetail_loop(next_URL)
{
    // console.log("Qual Export qualdetail_loop");
    if (global_run === true)
    {
        if (next_URL.length !== 0)
        {
            $.get(next_URL, function(data)
            {
                var $src = $(data);
                var maxpagerate = $src.find('td[class="error_title"]:contains("You have exceeded the maximum allowed page request rate for this website.")');
                if (maxpagerate.length === 0)
                {
                    page_num++;
                    // console.log("Qual Export qualdetail_loop page_num=" + page_num);
                    set_progress_report("Processing" + " page " + page_num + " (" + perPageSetting + " results per page)" , false);
                    console.log(progress_report.textContent);
                    scrape($src);
     
                    $next_URL = $src.find('a[href^="/mturk/viewquals"]:contains("Next")');
                    next_URL = ($next_URL.length !== 0) ? $next_URL.attr("href") : "";
                    setTimeout(function(){qualdetail_loop(next_URL);}, QUALDETAIL_DELAY);
                }
                else
                {
                    setTimeout(function(){qualdetail_loop(next_URL);}, MPRE_DELAY);
                    // console.log("Qual Export qualdetail_loop MPRE");
                }
            });
        }
        else
        {
            // console.log("Qual Export writing output");
            for (var key in qualhistory)
            {
                var obj = qualhistory[key];
                for (var prop in obj)
                {
                    if(obj.hasOwnProperty(prop))
                    {
                        text_area.value += obj[prop]+"\t";
                    }
                }
                text_area.value += "\n";
            }
            qualdetail_loop_finished = true;
        // console.log("Qual Export start_running false");
        global_run = false;
        big_red_button.textContent = "Start";
        set_progress_report("Stopped", true);
        }
    }
}


// when you click the Start button, write the header row to the output, and start scraping the first qual page
function start_running()
{
    if (big_red_button.textContent == "Start")
    {
        // console.log("Qual Export start_running");
        global_run = true;
        qualdetail_loop_finished = true;
        big_red_button.textContent = "Stop";
        set_progress_report("Running", false);
        text_area.value = "";
        // qualtitle, author, value, users, description, dateassigned, dateretake
        text_area.value +=  "Qualification Title\tAuthor (Requester)\tValue\tQualified Users\tDescription\tDate Assigned\tRetake Date\tQualification ID\n";

        qualdetail_loop('findquals?earned=true');
    }
    
    else
    {
        // console.log("Qual Export start_running false");
        global_run = false;
        big_red_button.textContent = "Start";
        set_progress_report("Stopped", true);
    }
}


// create the button and the output text area
function show_interface()
{
    // console.log("Qual Export show_interface");
    control_panel.removeChild(big_red_button);

    control_panel.appendChild(document.createTextNode("Export Quals: "));

    big_red_button.textContent = "Start";
    big_red_button.onclick = function(){start_running();};
    control_panel.appendChild(big_red_button);
    
    control_panel.appendChild(document.createTextNode(" "));
    control_panel.appendChild(progress_report);  // 'Running' or 'Stopped' or 'Finished'
    
    control_panel.appendChild(p);
    
    text_area.style.height = 200;
    text_area.style.width = "100%";
    control_panel.appendChild(text_area);   // display area for the export output
}


}