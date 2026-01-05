// ==UserScript==
// @name         Image moderation speeder-upper
// @namespace    mobiusevalon.tibbius.com
// @version      0.5
// @description  Lots of optimizations to speed up image moderation HITs
// @author       Mobius Evalon
// @match        https://www.mturkcontent.com/dynamic/hit*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14113/Image%20moderation%20speeder-upper.user.js
// @updateURL https://update.greasyfork.org/scripts/14113/Image%20moderation%20speeder-upper.meta.js
// ==/UserScript==

var genome_image = null;
var genome_answers = null;

function genome_duplicate()
{
    var $canvas = $("canvas:first")[0].toDataURL();
    var $object = $("#object_name").text();
    var $property = $("#sentence_list .col-md-4").first().text();
    
    if($canvas === genome_image) // image remains the same
    {
        if(genome_answers.indexOf($object) > -1) // duplicate question
        {
            console.log("VGDD: you previously answered "+$object+"->"+$property+" with "+(genome_answers[$object][$property] ? "yes" : "no"));
            if(genome_answers[$object][$property]) console.log("auto-answer yes here"); //genome_yes();
            else console.log("auto-answer no here"); //genome_no();
        }
    }
    else // image has changed
    {
        console.log("image has changed, discarding response set");
        genome_answers = new Array();
        genome_image = $canvas;
    }
}

function genome_response(r)
{
    var $object = $("#object_name").text();
    var $property = $("#sentence_list .col-md-4").first().text();
    
    if(genome_image === null) genome_image = $("canvas:first")[0].toDataURL();
    if(genome_answers === null) genome_answers = new Array();
    genome_answers[$object] = new Array($property);
    genome_answers[$object][$property] = r;
}
    
function genome_yes()
{
    genome_response(1);
    $("button[id*='true-button-']:visible").click();
    $("#next-button").click();
    //genome_duplicate();
}
    
function genome_no()
{
    genome_response(0);
    $("button[id*='false-button-']:visible").click();
    $("#next-button").click();
    //genome_duplicate();
}

function hide_instructions()
{
    $('.panel-heading').first().append(
        $('<span/>')
        .text(" [Show/Hide]")
        .css("cursor","pointer")
        .click(function() {
            var $p = $(".panel-body").first();
            if($p.css("display") === "none") $p.show();
            else $p.hide();
        })
    );
    $(".panel-body").first().hide();
}

$(document).ready(function() {
    if($("img").first().attr("src").indexOf("vessel-static.com") > -1) // vessel turk images (still working out the new video interface)
    {
        hide_instructions();
        var math = $("label").last().text();
        var matches = /What is (\d*)\+(\d*)\?/i.exec(math);
        $("input:radio[value=no]").prop('checked',true);
        $("input:text[name=captcha]").val((matches[matches.length-1]*1)+(matches[matches.length-2]*1));
        $("#submitButton").focus();
        $(document).keydown(function(event) {if(event.which === 13) $("#submitButton").click();})
    }
    
    else if($("input:radio[name=shouldBan]").length) // mixerbox
    {
        hide_instructions();
        $("input:radio[name=shouldBan][value=0]").prop('checked',true);
        $("#submitButton").focus();
        $(document).keydown(function(event) {
            switch(event.which)
            {
                case 13:
                    $("#submitButton").click();
                    break;
                case 97: case 49: // numpad numlock on, horizontal num keys respectively
                    $("input:radio[name=shouldBan][value=1]").prop('checked',true);
                    break;
                case 98: case 50:
                    $("input:radio[name=shouldBan][value=-2]").prop('checked',true);
                    break;
                case 99: case 51:
                    $("input:radio[name=shouldBan][value=0]").prop('checked',true);
                    break;
            }
        });
    }

    else if($("img").first().attr("src").indexOf("cuteornot.buzzfed.com") > -1) // buzzfeed
    {
        hide_instructions();
        $("#submitButton").focus();
        $(document).keydown(function(event) {
            switch(event.which)
            {
                case 13:
                    $("#submitButton").click();
                    break;
                case 100: case 49:
                    $("#checkbox1").click();
                    break;
                case 101: case 50:
                    $("#checkbox2").click();
                    break;
                case 102: case 51:
                    $("#checkbox3").click();
                    break;
                case 97: case 52:
                    $("#checkbox4").click();
                    break;
                case 98: case 53:
                    $("#checkbox5").click();
                    break;
                case 99: case 54:
                    $("#checkbox6").click();
                    break;
                case 96: case 48:
                    $("#checkbox8").click();
                    break;
            }
        });
    }
    
    else if($("#nsfw_form").length) // mylikes
    {
        $("img").first().focus();
        $(document).keydown(function(event) {
            switch(event.which)
            {
                case 97:
                    $("#submit_mature").click();
                    break;
                case 99:
                    $("#submit_safe").click();
                    break;
            }
        });
    }
    
    else if($("input:radio[name=validcheck1]").length) // lozo
    {
        $("input:radio[value=valid]").prop('checked',true);
        $("#submitButton").focus();
        $(document).keydown(function(event) {if(event.which === 13) $("#submitButton").click();})
    }
    
    else if($("img").first().attr("src").indexOf("visualgenome.org") > -1) // visual genome
    {
        // at some point, the visual genome section of the script will automatically
        // answer the duplicate questions based on your response to it the first time.
        // unfortunately i'm still at a loss as to how to determine when the canvas changes
        // due to problems with cross origin policies "tainting" the element and not allowing
        // me to pull any data from it
        $("div.instructions, div.guidelines").hide();
        $("#submit-btn").focus();
        $(document).keydown(function(event) {
            switch(event.which)
            {
                case 13:
                    $("#submit-btn").click();
                    break;
                case 90: case 188: case 97: // z, <, numpad 1
                    genome_yes();
                    break;
                case 88: case 190: case 99: // x, >, numpad 3
                    genome_no();
                    break;
                case 39:
                    $("#next-button").click();
                    break;
                case 37:
                    $("#prev-button").click();
                    break;
            }        
        });
        console.log("visual genome de-duplicator ready");
    }
    
    else if($("#roadwayDescrImg").length) // yeti
    {
        hide_instructions();
        //$("div#refImageDiv").hide();
        $("#submitButton").focus();
        $(document).keydown(function(event) {
            switch(event.which)
            {
                case 13:
                    $("#submitButton").click();
                    break;
                case 96: case 49: // numpad numlock on, horizontal num keys respectively
                    $("input:radio[name=WET_ROAD][value=-1]").prop('checked',true);
                    break;
                case 110: case 50:
                    $("input:radio[name=WET_ROAD][value=-2]").prop('checked',true);
                    break;
                case 97: case 51:
                    $("input:radio[name=WET_ROAD][value=0]").prop('checked',true);
                    break;
                case 98: case 52:
                    $("input:radio[name=WET_ROAD][value=1]").prop('checked',true);
                    break;
                case 99: case 53:
                    $("input:radio[name=WET_ROAD][value=2]").prop('checked',true);
                    break;
            }
        });
    }
});