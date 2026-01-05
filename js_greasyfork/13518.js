// ==UserScript==
// @author       Mobius Evalon
// @name         CrowdSurf productivity tools
// @description  The core script for modifying the CrowdSurf transcription interface that all other related scripts build upon.
// @version      1.0
// @namespace    mobiusevalon.tibbius.com
// @license      Creative Commons Attribution-ShareAlike 4.0; http://creativecommons.org/licenses/by-sa/4.0/
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @include      /^https{0,1}:\/\/ops.cielo24.com\/mediatool\/.*$/
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/13518/CrowdSurf%20productivity%20tools.user.js
// @updateURL https://update.greasyfork.org/scripts/13518/CrowdSurf%20productivity%20tools.meta.js
// ==/UserScript==
// prevents problems when the destination pages are running their own jquery libraries.  isn't necessary when the destination page
// is not running jquery or if the script is sandboxed because of GM_ functions being granted, but it's always good to think ahead
this.$ = this.jQuery = jQuery.noConflict(true);

function cspt_hotkeys(event)
{
    if(event.ctrlKey === true)
    {
        if(event.which === 13)
        {
            // ctrl+enter was pushed.  this user wants to submit the transcript
            $("#approve_button").click();
            return false; // jquery automatically prevents the default action and stops propagation if false is returned from an event handler
        }
    }
    else if(event.altKey === true)
    {
        if(event.which === 13)
        {
            // alt+enter was pushed.  user wants to accept the job they're previwing
            window.top.postMessage("cspt-hotkey-accept","https://work.crowdsurfwork.com");
            return false;
        }
        else if(event.which === 8)
        {
            // alt+backspace was pushed.  user wants to skip in preview mode or return in transcription mode
            window.top.postMessage("cspt-hotkey-return","https://work.crowdsurfwork.com");
            return false;
        }
    }
    else // neither Ctrl nor Alt
    {
        if(event.which === 13)
        {
            // enter was pushed with no meta keys.  user wants to dismiss a modal dialog
            var $modal = $("#generic-modal"),
                $scoring = $("#confirm_first_review_submit");
            if($modal.length && $modal.css("display") === "block")
            {
                $modal.find(".accept").first().get(0).click();
                return false;
            }
            else if($scoring.length && $scoring.css("display") === "block")
            {
                $scoring.find(".accept").first().get(0).click();
                return false;
            }
        }
    }
}

function cjft_dictionary()
{
    var stored = GM_getValue("cjft-ignore-list",""),
        cjft_words = [];
    if(stored.trim().length) cjft_words = stored.split(",");
    return cjft_words;
}

function cspt_message(event)
{
    // hooks for the cielo job frame tinkerer.  i have to use dom messaging to work around
    // security protocols and sandboxing limitations
    if(event.originalEvent.origin === "https://ops.cielo24.com")
    {
        var data = event.originalEvent.data.split("-");
        if(data[0] === "cspt")
        {
            if(data[1] === "request")
            {
                switch(data[2])
                {
                    case "ignored_words_list":
                        window.postMessage(("cjft-response-ignored_words-"+GM_getValue("cjft-ignore-list","")),"https://ops.cielo24.com");
                        break;
                    case "purge_ignored_list":
                        GM_deleteValue("cjft-ignore-list");
                        break;
                    case "add_ignored_word":
                        var cjft_words = cjft_dictionary();
                        cjft_words.push(data[3]);
                        GM_setValue("cjft-ignore-list",cjft_words.join(","));
                        break;
                    case "delete_ignored_word":
                        var cjft_words = cjft_dictionary(),
                            word_index = cjft_words.indexOf(data[3]);
                        if(cjft_words.length && word_index > -1)
                        {
                            cjft_words.splice(word_index,1);
                            GM_setValue("cjft-ignore-list",cjft_words.join(","));
                        }
                        break;
                }
            }
            return false;
        }
    }
}

function ckey(s)
{
    return s.replace(/[^a-z]/ig,"-").toLowerCase();
}

function gm_db_obj(key)
{
    var obj = json_obj(GM_getValue(key));
    if(typeof obj !== "object") GM_deleteValue(key);
    return obj;
}

function json_obj(json)
{
    var obj = {volume:0,earnings:0,time:0};
    if(typeof json === "string")
    {
        try {obj = JSON.parse(json);}
        catch(e) {console.log("Malformed JSON object.  Error message from JSON library: ["+e.message+"]");}
    }
    return obj;
}

function mmss(t)
{
    // minutes:seconds display from a total number of seconds
    var m = (Math.floor(t/60) || 0);
    t %= 60;
    var s = (Math.ceil(t) || 0);
    return (m+":"+(s < 10 ? "0" : "")+s);
}

function cspt_job_display(domain,type,level)
{
    var $display = $("#cspt-display");
    if(!$display.length)
    {
        $("#right-column ul.nav-tabs").after(
            $("<div/>")
            .attr("id","cspt-display")
            .css("margin-bottom","15px")
            .append(
                $("<div/>")
                .append(
                    $("<b/>")
                    .css("font-size","125%")
                    .css("cursor","help")
                    .attr("title",level_info(level))
                    .text("L"+level+": "+type.ucfirst()),
                    $("<span/>")
                    .css("color","#775555")
                    .css("margin-left","10px")
                    .css("cursor","pointer")
                    .text("[Reset]")
                    .click(function() {
                        GM_deleteValue("cspt_"+domain+"_l"+level+"_stats");
                        cspt_job_display(domain,type,level);
                    })
                ),
                $("<div/>")
                .attr("id","cspt-row-volume")
                .append(
                    $("<span/>")
                    .css("display","inline-block")
                    .css("width","70px")
                    .text("Volume:"),
                    $("<span/>")
                    .attr("id","cspt-volume")
                ),
                $("<div/>")
                .attr("id","cspt-row-earnings")
                .append(
                    $("<span/>")
                    .css("display","inline-block")
                    .css("width","70px")
                    .text("Earnings:"),
                    $("<span/>")
                    .attr("id","cspt-earnings")
                ),
                $("<div/>")
                .attr("id","cspt-row-etc")
                .append(
                    $("<span/>")
                    .css("color","#555555")
                    .css("font-size","90%")
                    .attr("id","cspt-etc")
                    .hide()
                )
            )
        );
        $display = $("#cspt-display");
    }

    if((level*1) < 3)
    {
        var prefix = ("cspt_"+domain+"_"),
            data = gm_db_obj(prefix+"l"+level+"_stats"),
            avg_pay = (data.earnings/Math.max(1,data.volume)),
            avg_time = (data.time/Math.max(1,data.volume)),
            jpd = ((avg_pay > 0) ? (1/avg_pay) : 0),
            tpd = (jpd*avg_time),
            jph = ((avg_time > 0) ? (3600/avg_time) : 0),
            pph = (jph*avg_pay);

        $("#cspt-display #cspt-volume").text(data.volume+(level === "1" ? (" ("+(data.hasOwnProperty("transcription_volume") ? data.transcription_volume : 0)+" transcription, "+(data.hasOwnProperty("robo-review_volume") ? data["robo-review_volume"] : 0)+" robo-review)") : ""));
        $("#cspt-display #cspt-earnings").text("$"+data.earnings.toFixed(2));
        $("#cspt-display #cspt-etc")
            .html("<span style='display: inline-block; width: 70px;'>Per job avg:</span><span>$"+avg_pay.toFixed(2)+", "+mmss(avg_time)+"</span><br>"+
                  "<span style='display: inline-block; width: 70px;'>Per hour:</span><span>"+jph.toFixed(2)+" jobs, $"+pph.toFixed(2)+"</span><br>"+
                  "<span style='display: inline-block; width: 70px;'>Per dollar:</span><span>"+jpd.toFixed(2)+" jobs, "+mmss(tpd)+"</span>")
            .show();
    }
}

function level_info(l)
{
    l *= 1;
    if(l === 1) return "Level 1 jobs include transcription in the general and media queues, as well as the Review & Edit queue.  All of these job types contribute to the same volume bonus.";
    else if(l === 2) return "Level 2 jobs are the Review, Edit, & Score queues for general content and media.";
}

String.prototype.slice_substring = function(s,e)
{
    var start = this.indexOf(s);
    var end = this.indexOf(e);
    var len = (start+s.length);
    if(start > -1 && end > -1 && end > len) return this.substring(len,end);
};

String.prototype.ucfirst = function()
{
    return (this.charAt(0).toUpperCase()+this.slice(1));
};

$(document).ready(function() {
    var regex = /.*\/mediatool\/(\w+)\/.*&(?:amp;)?crowd=([\w ]+).*&(?:amp;)?crowd_assignment_id=(\w+)/ig,
        matches = regex.exec(unescape(window.location.href)),
        job_domain,
        job_id,
        job_type,
        job_level,
        job_reward;

    if(matches !== null)
    {
        var l = matches.length;
        job_id = matches[l-1];
        job_domain = ckey(matches[l-2]);
        job_type = ckey(matches[l-3]);
    }

    // doing a bit of manual reassignment here
    switch(job_type)
    {
        case "transcription":
            // general content and media transcription queues
            job_level = "1";
            break;
        case "transcription-asr":
            // "review and edit" queue, rolls together with transcription
            job_type = "robo-review";
            job_level = "1";
            break;
        case "transcription-review":
            // this is mainly so i can use the word in display later
            job_type = "review";
            job_level = "2";
            break;
    }

    switch(job_type)
    {
        case "transcription": case "robo-review": case "review":
            if((job_domain === "mechanical-turk" && job_id.length === 30) || (job_domain === "crowdsurf" && job_id.length === 32))
            {
                var $submit_button = $("#approve_button"),
                    $price_header = $("#price_header"),
                    $textarea = $("#plaintext_edit"),
                    secs = (new Date().getTime()/1000);

                // find the reward amount for this job
                job_reward = /Total reward: \$(\d{1}\.\d{2})/gi.exec($price_header.text())[1];

                // update help area
                $("#hotkeys tbody").append(
                    $("<tr/>")
                    .append(
                        $("<td/>")
                        .text("CTRL+ENTER"),
                        $("<td/>")
                        .text("Submit job.")
                    )
                );

                $submit_button
                    .attr("title","Submit this Transcript (Ctrl + Enter)")
                    .click(function() {
                    var prefix = ("cspt_"+job_domain+"_l"+job_level+"_");
                    if(job_id != GM_getValue(prefix+"last"))
                    {
                        var data = gm_db_obj(prefix+"stats"),
                            t = Math.ceil(((new Date().getTime()/1000)-secs));

                        data.volume++;
                        data.earnings += (job_reward*1);
                        data.time += t;
                        if(job_level === "1")
                        {
                            if(!data.hasOwnProperty(job_type+"_volume")) data[job_type+"_volume"] = 0;
                            data[job_type+"_volume"]++;
                        }

                        GM_setValue(prefix+"stats",JSON.stringify(data));
                        GM_setValue(prefix+"last",job_id);
                    }
                });

                $textarea.focus();
            }
            cspt_job_display(job_domain,job_type,job_level);
            break;
    }
    $(window)
        .on("keydown onkeydown",cspt_hotkeys)
        .on("message onmessage",cspt_message);

    // send initialization command to CJFT to avoid out-of-order initialization problems.  this simply does nothing if the tinkerer is not installed
    window.postMessage(("cjft-initialize-"+GM_getValue("cjft-ignore-list","")),"https://ops.cielo24.com");
});