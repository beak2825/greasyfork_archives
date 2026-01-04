// ==UserScript==
// @name         Helios review tool
// @version      0.2
// @description  Creation of review report for GTT internal review
// @require http://code.jquery.com/jquery-latest.js
// @require https://cdnjs.cloudflare.com/ajax/libs/diff_match_patch/20121119/diff_match_patch.js
// @author       You
// @match        https://translate.google.com/toolkit/workbench?did*
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/38952/Helios%20review%20tool.user.js
// @updateURL https://update.greasyfork.org/scripts/38952/Helios%20review%20tool.meta.js
// ==/UserScript==

var source;
var target;
var idbSupported = false;
var db;
var attempts = 0;
var is_loaded = false;


var jobname = $('.gtc-docname').text();
var docID = getURLParameter("did");
const storageID = "Helios-" + docID;

function getSegmentID(unit,onlyID) {

    var id = $(unit).attr("id");
    if(!onlyID) {
        var headerid= $(unit).parents().filter('div.message').find('div.message-id').text();
        if(headerid) id = headerid;
    }
    return id;
}

function getActiveSegmentID(onlyID) {
    var srcdoc = $('.gtc-source > iframe[src*="toolkit"]').contents()[0];
    var element = $(srcdoc).find('.goog-gtc-unit-highlight').parent().first();
    return getSegmentID(element,onlyID);
}

function addCommentBox() {
    var id = getActiveSegmentID();

    $('body').append('<div id="helios-dialog"><span id="helios-commentid">Add review comment for '+id+'</span><br><textarea id="helios-comment-input" rows=5 /><br><button type="submit" id="helios-comment-save">Save</button></div>');
    $('#helios-dialog').css('position','absolute').css('top','70px').css('left',$('#helios-comment').offset().left).css('max-width','300px').css('word-wrap','break-word').css('background-color','lightgray').css('padding','10px').hide();
    $('#helios-comment-input').css("width","100%");

    $('#helios-comment-save').click(function() {
        var comment = $('#helios-comment-input').val();

        saveCommentToDB(id,comment);
        ToggleCommentBox();
        $('#helios-comment-input').val("");
    });
}

function saveCommentToDB(id,comment) {
    console.log("Saving the following comment for segment " + id +": " + comment);
    var content = JSON.parse(window.localStorage.getItem(storageID));
    var node = content.filter(x => (x.id == id))[0];
    console.log(node);
    if(!node) {
     console.log('[Helios] !! Problem finding segment ' + id + ' in the database for comment addition. Aborting');
        return false;
    }
    node.comment = comment;
    window.localStorage.setItem(storageID,JSON.stringify(content));
}
function ToggleCommentBox() {
    var dialog = $('#helios-dialog');
    var id = getActiveSegmentID();
    if($(dialog).is( ":hidden" )) {
        var content = JSON.parse(window.localStorage.getItem(storageID));
        $('#helios-commentid').html('Add review comment for '+ getActiveSegmentID());
        var comment = content.filter(x => (x.id == id))[0].comment;
        $('#helios-comment-input').val(comment);
    }
    $(dialog).toggle();
}

function downloadFile(filename, content) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}


function getURLParameter(sParam){
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}

var checkExist = setInterval(function () {
    source = $('.gtc-source > iframe[src*="toolkit"]').contents()[0];
    target = $('.gtc-translation > iframe[src*="toolkit"]').contents()[0];
    var frame_loaded;
    $('.gtc-translation > iframe[src*="toolkit"]').ready(function (){ frame_loaded = true; });

    var sourcesegments = "";
    var segments = "";
    try {
        sourcesegments = source.getElementsByClassName("goog-gtc-unit");
        segments = target.getElementsByClassName("goog-gtc-unit");
    }
    catch (e) {
        console.log("Could not load segments, retrying");
    }

    attempts++;
    if (frame_loaded && sourcesegments.length == segments.length) is_loaded = true;
    else if (attempts > 20) {
        console.log("Unsuccessful after 20 attemps. Aborting.");
        clearInterval(checkExist);
        return false;
    }

    if (is_loaded) {
        clearInterval(checkExist);
        console.log("Segments: " + sourcesegments.length);
        initializeHelios(sourcesegments,segments);

    }
    else {
        console.log("retrying: " + attempts);
    }
}, 500); // check every 500ms

function getGTTContent() {
    console.log("[Helios] Grabbing segment info from GTT");
    var sourcecont = $('.gtc-source > iframe[src*="toolkit"]').contents()[0];
    var targetcont = $('.gtc-translation > iframe[src*="toolkit"]').contents()[0];

    var aligned = [];

    var sourcesegs = $(sourcecont).find(".goog-gtc-unit");
    var segs = $(targetcont).find(".goog-gtc-unit");
    console.log("[Helios] Number of segments: " + segs.length);
    if(sourcesegs.length != segs.length) {
        console.log("[Helios] !! Error getting GTT content: different count of segments: " + sourcesegs.length + "(source) vs " + segs.length);
        return false;
    }
    for(var i=0; i<sourcesegs.length; i++) {
        var sid = $(sourcesegs[i]).attr("id");
        var id = $(segs[i]).attr("id");
        if(id!=sid) {
            console.log("[Helios] !! Error aligning segments: different ids for segment no. " + i + ": " + sid + "(source) vs " + id);
            return false;
        }
        id = getSegmentID(segs[i]);

        var source = $(sourcesegs[i]).find('> span').first().text();
        var target = $(segs[i]).find('> span').first().text();
        var segment = {"id": id, "source": source, "target": target, "created": new Date(), "modified": null, "comment": null};
        aligned.push(segment);
    }
    return aligned;
}

function getCorrections() {
    var content = JSON.parse(window.localStorage.getItem(storageID));
    var newcontent = getGTTContent();
     content.forEach(function(segment,index) {
         if(newcontent[index].target != segment.target) {
          segment.corrected = newcontent[index].target;
             console.log("Found a correction in " + index);
         }
     });
    window.localStorage.setItem(storageID,JSON.stringify(content));
}

function downloadReport() {
    var dmp = new diff_match_patch();
    var content = JSON.parse(window.localStorage.getItem(storageID));
    var reporter = $('a[href="https://profiles.google.com/?hl=en"] *:not(:has(*)):visible').text();
    var timestamp = new Date();
    var segments = content.length;
    var corrections = segments - content.filter(x => !x.corrected).length;
    var header = '<!doctype html><html><head></head><body>'+
        '<style>.gentable{display: grid; grid-template-columns: 150px 1fr; grid-gap: 3px;}.segid{max-width:150px;word-wrap:break-word}'+
        '.segrow{display: grid; grid-template-columns: 150px 1fr 1fr 1fr 1fr; grid-gap: 3px; margin-bottom: 10px;}'+
        '.heading{font-weight: 700;}.conblock{margin: 20px;}th{width: 25%; text-align: justify;}table{width: 100%;}'+
        '</style>' + '<script>'+
        'function toggleDiff(){if(document.getElementById("showdiff").checked){var diffval="block"; var nodiffval="none";}else{var diffval="none"; var nodiffval="block";}'+
        'var diffcells=document.getElementsByClassName("diff"); var nodiffcells=document.getElementsByClassName("nodiff"); for (var i=0; i<diffcells.length; i++){diffcells[i].style.display=diffval; nodiffcells[i].style.display=nodiffval;}}'+
        '</script>';

    var template = '<div id="wrapper"><div id="general" class="conblock"><h2></h2> <div id="generaltable" class="gentable">'+
        '<span class="heading">Job: </span> <span id="jobname"></span> <span class="heading">Reviewer: </span> <span id="reviewer"></span>'+
        '<span class="heading">Date: </span> <span id="date"></span> <span class="heading">Corrected segments: </span> <span id="corrections"></span>' +
        '<span class="heading">URL: </span> <span><a href="" id="url"></a></span>'+
        '</div></div><input type="checkbox" id="showdiff" onclick="toggleDiff()"><label for="showdiff">Show diff</label><div id="segments" class="conblock"> <div id="segmentstable" class="segtable"> <div class="segrow"> <span class="heading">ID</span> <span class="heading">Source</span>'+
        '<span class="heading">Original target</span> <span class="heading nodiff">Corrected target</span>  <span class="heading diff" style="display:none">Corrected target (HTML)</span> <span class="heading">Comment</span></div></div></div></div>';

    var html = $.parseHTML(template);
    var segtable = $(html).find('#segments');
    $(html).find('h2').html("Review report for job " + jobname);

    content.forEach(function(segment) {
        var corr = "";
        if(segment.corrected) {
            var d = dmp.diff_main(segment.target, segment.corrected);
            corr = dmp.diff_prettyHtml(d).replace(/&para;<br>/g,"<br>").replace(/background:#e6ffe6;/g,"background:lightgreen;");
        }

        var segmentHTML = "<div class='segrow'><span class='segid'>" + segment.id + "</span>";
        segmentHTML += "<span>" + segment.source.replace(/\n/g,"<br>") + "</span>";
        segmentHTML += "<span>" + segment.target.replace(/\n/g,"<br>") + "</span>";
        segmentHTML += "<span class='nodiff'>" + (segment.corrected || "").replace(/\n/g,"<br>") + "</span>";
        segmentHTML += "<span class='diff' style='display:none'>" + corr + "</span>";
        segmentHTML += "<span>" + (segment.comment || "").replace(/\n/g,"<br>") + "</span>";
        segmentHTML += "</div>";
        $(segtable).append(segmentHTML);
    });

    $(html).find('#jobname').text(jobname);
    $(html).find('#reviewer').text(reporter);
    $(html).find('#date').text(new Date().toISOString());
    $(html).find('#corrections').text(corrections +" / " + segments);
    $(html).find('#url').text(window.location.href);

    var finalfile = header + $(html).prop('outerHTML') + "</body></html>";
    downloadFile(storageID + ".html",finalfile);

}



function CheckForFirstRun() {

    var content = window.localStorage.getItem(storageID);
    if(content) return true;
    else {
        var segmentsArray = getGTTContent();
        console.log("[Helios] First run for document " + docID +", saving content");
        window.localStorage.setItem(storageID,JSON.stringify(segmentsArray));
    }
}
function addReviewButtons() {
    $('.gtc-quickbar').prepend('<div role="button" class="goog-inline-block jfk-button jfk-button-standard" tabindex="0" aria-pressed="false" aria-disabled="false" aria-hidden="false" id="helios-export">Review report</div>');
    $('#helios-export').click(function() {
        getCorrections();
        downloadReport();
    });

    $('.gtc-quickbar').prepend('<div role="button" class="goog-inline-block jfk-button jfk-button-standard" tabindex="0" aria-pressed="false" aria-disabled="false" aria-hidden="false" id="helios-comment">Add review comment</div>');
    $('#helios-comment').click(function() {
ToggleCommentBox();
    });
}

function initializeHelios(sourcesegments,segments) {
    CheckForFirstRun();
    addReviewButtons();
    addCommentBox();
}
