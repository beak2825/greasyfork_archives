// ==UserScript==
// @name         Elastic translation preview tool
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Preview translations from Memsource on Elastic website
// @author       KS
// @match        https://editor.memsource.com/twe/translation/job/*
// @match        https://www.elastic.co/*
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/370357/Elastic%20translation%20preview%20tool.user.js
// @updateURL https://update.greasyfork.org/scripts/370357/Elastic%20translation%20preview%20tool.meta.js
// ==/UserScript==

var jobId = window.location.pathname.match(/[\d]+$/);
var storageId = "Memsource-review-"+jobId;

if(window.location.href.match(/elastic\.co/)) {
    console.log("Site detected");
    replaceSiteContent();
}
if(window.location.href.match(/editor\.memsource\.com/)) {
    console.log("Memsource detected");
    initializeMemsourceReviewTool();
}

function replaceSiteContent() {
 if(!window.location.search.match(/previewID/)) {
    console.log("No preview ID provided. Skipping content replacement.");
    return false;
    }

    var id = window.location.search.match(/previewID=(\d+)/)[1];
    var storage = "Memsource-review-"+id;
    console.log("Storage is " + storage);
    var content = JSON.parse(GM_getValue(storage));

    switchContent(content);

}

function escapeRegExp(stringToGoIntoTheRegex) {
    return stringToGoIntoTheRegex.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}



function switchContent(content) {

    console.log("Replacing content");
    console.log(content.length);
    var bod = document.body.innerHTML;

    for (var i = 0; i < content.length; i++) {
        //console.log("MASTER: " + content[i].source + " ++++ " + content[i].target);
        if (content[i].target) {
            var news = content[i].source.split(/\{[^\}]+\}/);
            var newt = content[i].target.split(/\{[^\}]+\}/);
            for (var x = 0; x < news.length; x++) {
                if(!news[x]) continue;
                //console.log(news[x] + " - " + newt[x]);

                if (news[x].length < 4) continue;
                var stringToGoIntoTheRegex = escapeRegExp(news[x]);
                var regex = new RegExp(stringToGoIntoTheRegex, "g");
                bod = bod.replace(regex, newt[x]);
            }
        }
    }

    document.body.innerHTML = bod;
}

function initializeMemsourceReviewTool(){
    addPreviewButton();
    CheckForFirstRun();
    checkNewlyLoadedSegments();
}

function getURL() {
    var active = $('.twe_segment.twe_active').find('.twe_source').find('.te_text_container').text();
    if(!active) return false;
    return active;
    //return JSON.parse(GM_getValue(storageId))[1].source; // Original behaviour - second segment
}



function addPreviewButton() {

    $('#mainMenuContainer.container-fluid > .main-menu').append('<li id="add-content-preview" class="comment"><div id="previewButton">Site preview</div></li>');
    $('#previewButton').css('color', '#777').css('display', 'block').css('font-size', 'smaller').css('float', 'none').css('padding-top', '4px').css('padding-right', '15px').css('padding-bottom', '4px').css('padding-left', '15px').css('position', 'relative').css('cursor', 'pointer');
    $('#previewButton').hover(function() {
        $(this).css('color', '#333');
    }, function() {
        $(this).css('color', '#777');
    });
    $('#previewButton').click(function() {
        var page = $('.twe_segment[data-position=1] > .twe_source').text().trim();
        var url = getURL();
        if(!url || !url.match(/\//)) alert("Please select a segment with page URL (such as /products/x-pack/alerting)");
        else  window.open('https://www.elastic.co' + getURL() + "?previewID=" + jobId);
    });
}


function CheckForFirstRun() {
    var storage = GM_getValue(storageId);
    if(storage) {
        var content = JSON.parse(storage);
        if(content.length) return true;
    }
    var segmentsArray = getMemsourceContent();
    console.log("[Memsource] First run for document " + jobId +", saving content");
    GM_setValue(storageId,JSON.stringify(segmentsArray));
    //window.localStorage.setItem(jobId,JSON.stringify([storageId,segmentsArray[1].source,new Date()]));
}



function getMemsourceContent() {
    //console.log("[Memsource] Grabbing segment info from Memsource");
    var aligned = [];
    var segs = $('.twe_segment');
    for(var i = 0; i < segs.length; i++) {
        var seg = segs[i];
        var id = seg.getAttribute('display-position');
        var source = getSegmentsText(seg, "source");
        var target = getSegmentsText(seg, "target");
        var segment = {"id": id, "source": source, "target": target, "created": new Date(), "modified": null, "comment": null};
        aligned.push(segment);
    }
    return aligned;
}

function getSegmentsText(segment, sourceOrTarget){
    var placeholder;
    var placeholderNumber;
    var sourceOrTargetSegment = segment.getElementsByClassName('twe_'+sourceOrTarget)[0];
    var nodes = sourceOrTargetSegment.getElementsByClassName("te_text_container")[0].childNodes;
    var text = [];
    for(var i = 0; i < nodes.length; i++){
        var node = nodes[i];
        if(node.className == "te_tag te_tag_open"){
            placeholder = node.getElementsByClassName("tag_content")[0];
            placeholderNumber = placeholder.firstChild.nodeValue;
            text.push('{'+placeholderNumber+'}');
        }
        else if(node.className == "te_tag te_tag_close"){
            placeholder = node.getElementsByClassName("tag_content")[0];
            placeholderNumber = placeholder.firstChild.nodeValue;
            text.push('{/'+placeholderNumber+'}');
        }

        else if(node.className == "te_tag"){
            placeholder = node.getElementsByClassName("tag_content")[0];
            placeholderNumber = placeholder.firstChild.nodeValue;
            text.push('{'+placeholderNumber+'}');
        }


        if(node.className == "te_txt"){
            var children = node.childNodes;
            for(var j = 0; j < children.length; j++){
                var child = children[j];
                if(child.className == "non-printable-char non-printable-space"){text.push(' ');}
                if(child.className == "non-printable-char non-printable-nbsp"){text.push('&nbsp;');}
                text.push(child.nodeValue);
            }
        }
    }
    return text.join('');
}

function checkNewlyLoadedSegments(){
    var win = $('#translation-table-container')[0];
    win.addEventListener("scroll", function() {
        var content = JSON.parse(GM_getValue(storageId));
        if(content.length == 0){
            var firstContent = getMemsourceContent();
            GM_setValue(storageId,JSON.stringify(firstContent));
            console.log('Initial content length was 0');
            return true;
        }
        var segmentsCount = $('#status-bar-segments-all')[0].firstChild.nodeValue;
        //getSegmentsWithComments();
        var newContent = getMemsourceContent();
        //if(content.length > newContent.length){return false;}
        content.forEach(function(segment,index) {
            if(!newContent[index]) return false;
            if(newContent[index].source != segment.source || newContent[index].target != segment.target) {
                segment.source = newContent[index].source;
                segment.target = newContent[index].target;
            }
        });
        var newSegmentsCount = newContent.length - content.length;
        if(newSegmentsCount == 0){
            GM_setValue(storageId,JSON.stringify(content));
            return false;}
        for(var nsIndex = content.length; nsIndex < newContent.length; nsIndex++){
            var newSegment = newContent[nsIndex];
            content.push(newSegment);
        }

        GM_setValue(storageId,JSON.stringify(content));

    });
}

function getSegmentsWithComments(){
    var content = JSON.parse(GM_getValue(storageId));
    for(var cIndex = 0; cIndex < content.length; cIndex++){
        var segment = content[cIndex];
        if(segment.comment){
            var id = segment.id;
            var segmentWithComment = $("[display-position='"+id+"']")[0];
            if(segmentWithComment){
                var segmentText = segmentWithComment.getElementsByClassName('twe_target')[0];
                segmentText.setAttribute("style", "background-color:#e0f998;");
/*                if(!segmentText.getElementsByClassName('dropdown-menu')[0]){continue;}
                var bubbleComment = segmentText.getElementsByClassName('dropdown-menu')[0];
                var bubble = segmentText.getElementsByClassName('dropdown-menu')[0].firstChild;
                if(bubble.firstChild){continue;}
                bubble.append(segment.comment);
                segmentText.setAttribute('class', 'twe_target '+ id);
                $('.twe_target.'+id).click(
                    function() {
                        $( '.twe_target.'+id+' > .dropdown-menu' ).toggle();
                    }
                );*/
            }
        }
    }
}
