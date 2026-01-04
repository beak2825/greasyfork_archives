// ==UserScript==
// @name         NyQueue
// @namespace    https://greasyfork.org/users/144229
// @version      2.0
// @description  Makes Money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *mturk.com/NyQueue*
// @include      *mturk/sortmyhits*
// @include      *.mturk.com/mturk/viewmyhits?*
// @include      *.mturk.com/mturk/continue*
// @include      *.mturk.com/mturk/submit
// @include      *.mturk.com/mturk/return?requesterId=*
// @include      *worker.mturk.com/tasks*
// @require      http://code.jquery.com/jquery-latest.min.js
// @require      https://greasyfork.org/scripts/33763-nyquery/code/NyQuery.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/35451/NyQueue.user.js
// @updateURL https://update.greasyfork.org/scripts/35451/NyQueue.meta.js
// ==/UserScript==

//Global Functions
function gmGet(name, def = false) { var theValue = GM_getValue(name, def); return theValue; }
function gmSet(name, valuee) { GM_setValue(name, valuee); }
//End Global Functions

//Global Variables
var quelist = [];
var reqlist = [];
var titlelist = [];
//`curQueue${g}`
//`curReq${g}`
//`curTit${g}`
//`curQueueW${g}`
//`curReqW${g}`
//`curTitW${g}`
gmSet(`newHIT`, "");
gmSet(`killFrames`, false);
gmSet(`newHITW`, "");
gmSet(`killFramesW`, false);
gmGet(`autoOpen`, false);
gmGet(`openLimit`, 0);
var tFrameTime = gmGet(`frameTime`, 20);
gmSet(`cleanFrames`, false);
gmGet(`colorShow`, true);
gmGet(`colorFlash`, false);
gmGet(`red`, true);
gmGet(`blue`, true);
gmGet(`green`, true);
gmGet(`restart`, false);
var introColor = true;
var dLink = window.location.href;
var queue = "https://www.mturk.com/mturk/sortmyhits?searchSpec=HITSearch%23T%231%2310%23-1%23T%23%21Status"+
    "%210%21rO0ABXQACEFzc2lnbmVk%21%23%21Deadline%210%21%23%21&selectedSearchType=hitgroups&searchWords=&sortType=Deadline%3A0&pageSize=50&NewQueue=true";
var queueW = "https://worker.mturk.com/tasks";
var wHeight = $(window).height();
var wWidth = $(window).width();
var eHeight;
var eWidth;
//End Global Variables

//Main Program Flow
if (dLink.indexOf("NyQueue") > 0){//This is the starting page for NyQueue
    startScreen();
    drawFrames();
    frameEmpty();
    autoClose();
}else if(dLink.indexOf("tasks") > 0){
    checkQueue();
    $('body').prepend(`<button id=qButter>Check Queue</button><button id=killFramesW>Erase iframes</button><br /><br />`);
    refreshQueue();
    setTimeout(function(){autoJank(0,gmGet(`openLimit`));},2000);
}else if (dLink.indexOf("NewQueue=true") > 0){//This is your queue list with the extra NyQueue features embedded into the page
    checkQueue();
    $('body').empty();
    $('body').append(`<button id=qButter>Check Queue</button><button id=killFrames>Erase iframes</button><br /><br />`);
    refreshQueue();
    setTimeout(function(){autoJank(0);},2000);
}else if (dLink.indexOf("NewQueue=false") > 0){//This is your queue list without any extra html (for queue updating purposes)
    checkQueue();
}else if (dLink.indexOf("NyHit=true") > 0){//This is for any HIT that is being opened in NyQueue
    if(dLink.indexOf("www") > 0){
        changeRedirect();
    }
}
//End Main Program

//Button functions
$(document).on('click','#startNyq',function(){//Begins NyQueue when 'GO!' button is pressed
    introColor=false;
    var numHor = $('#inpHor').val();
    var numVer = $('#inpVer').val();
    gmSet('autoOpen', $('#aOpen').is(":checked"));
    gmSet('cleanFrames', $('#clean').is(":checked"));
    if($('#oLimit').val() >25 || $('#oLimit').val() <0){
        gmSet(`openLimit`, 25);
    }else{
        gmSet(`openLimit`, $('#oLimit').val());
    }
    gmSet(`frameTime`, $('#recheck').val());
    gmSet(`colorShow`, $('#cShow').is(":checked"));
    $('body').empty();
    if(numHor*numVer > 25){
        numHor = 5;
        numVer = 5;
    }
    gmSet('lastHor', numHor);//set global variables to remember settings on refresh
    gmSet('lastVer', numVer);
    //Stupid Javascript math
    eHeight = wHeight/numVer-5;
    var t = numHor;
    t++;
    eWidth = wWidth/t;
    eWidth-=20;
    //Done with stupid math
    var source;
    if(dLink.indexOf("www") > 0){
        source = queue;
    }else if(dLink.indexOf("worker") > 0){
        source = queueW;
    }
    $('body').append(`<iframe src=${source} height=${wHeight} width=${eWidth-5} align ="right" name="queframe"></frame>`);
    if(gmGet(`colorShow`)){
        colorize(randNum(0,255),randNum(0,255),randNum(0,255));
    }else{
        $('body').css("background-color", "rgb("+255+","+255+","+255+")");
    }
    connectionCheck();
});

$(document).on('click','#qButter',function(){//reloads queue screen
    location.reload();
});

$(document).on('click', '#killFrames', function(){
    gmSet('killFrames', true);
});

$(document).on('click', '#killFramesW', function(){
    gmSet('killFramesW', true);
});

$(document).on('click', '.qbox', function(){//opens new HIT iframe
    if(dLink.indexOf("www") > 0){
        var href =$(this).attr('href')+"&NyHit=true";
        $(this).css('background-color', 'green');
        $(this).css('color', 'white');
        gmSet('newHIT', href);
    }else if(dLink.indexOf("worker") > 0){
        var hrefW =$(this).attr('href')+"?ref=NyHit";
        $(this).css('background-color', 'green');
        $(this).css('color', 'white');
        gmSet('newHITW', hrefW);
    }
});

$(document).on('click', '#aOpen', function(){
    $('.hidey').toggle();
});
//End Button functions

//Script Functions
function connectionCheck(){
    if(navigator.onLine){
        console.log("You are connected to the internet");
    } else {
        if (dLink.indexOf("NyQueue") > 0){
            gmSet(`restart`, true);
            location.reload();
        }
    }
    setTimeout(function(){connectionCheck();}, 100);
}

function colorize(r, g, b){
    if(gmGet(`colorShow`)){
        if(gmGet(`colorFlash`)){
            gmSet('colorFlash', false);
            r = randNum(0,255);
            g = randNum(0,255);
            b = randNum(0,255);
        }
        $('body').css("background-color", "rgb("+r+","+g+","+b+")");
        var change = 2+randNum(-1,1);
        if(gmGet('red')){
            r+=change;
        }else{
            r-=change;
        }
        if(gmGet('green')){
            g+=change;
        }else{
            g-=change;
        }
        if(gmGet('blue')){
            b+=change;
        }else{
            b-=change;
        }
        if(r>255 || r<5 ){
            gmSet(`red`, !gmGet('red'));
        }
        if(g>255 || g<5 ){
            gmSet(`green`, !gmGet('green'));
        }
        if(b>255 || b<5 ){
            gmSet(`blue`, !gmGet('blue'));
        }
        setTimeout(function(){colorize(r,g,b);}, 40);
    }
}

function autoClose(){
    tFrameTime = gmGet(`frameTime`)*1000;
    if(gmGet('cleanFrames')){
        setTimeout(function(){
            $('iframe').eq(1).remove();
            tFrameTime=0;
            autoClose();
        }, tFrameTime+2500);

    }
}

function renderFrame(href){//draws the iframes to the NyQueue window
    $('body').append(`<iframe src="${href}" height=${eHeight} width=${eWidth} name="${href}"></frame>`);
    window.open(href, href);
    gmSet('colorFlash', true);
}

function startScreen(){//NyQueue initialization on scipt boot
    $('body').empty();
    var w = Math.round($(document).width() / 255);
    var h = Math.round($(document).height() / 255);
    var body = $("body");
    var up= true;
    var green = 150;
    $(document).mousemove(function(e){
        if(introColor){
            if (dLink.indexOf("NyQueue") > 0){//
                if(up){
                    green+=2;
                }else{
                    green-=2;
                }
                if(green>250) { up=false;}
                if(green<5) { up=true;}
                var pageX = Math.round(e.pageX / w);
                var pageY = Math.round(e.pageY / h);
                body.css("background-color", "rgb("+pageY+","+green+","+pageX+")");
                $('#theBox').css("background-color", "white");
            }
        }
    });
    var lastHor = gmGet('lastHor', 0);
    var lastVer = gmGet('lastVer', 0);
    $('body').append(`<div id=theBox style="border-style:outset; border-color:#008CBA; width:40%; margin-left:30%; margin-top:5%;">
<div style="width:90%; margin-left:5%; margin-right:5%;>
<b style="text-align:center; font-weight:900;">Welcome To NyQueue!</b><br />
<b>How many windows horizontally? </b><input id=inpHor value=${lastHor} style="width:10%;"></input><br />
<b>How many windows vertically? </b>
<input id=inpVer value=${lastVer} style="width:10%;"></input><br />
<b >Check queue after how many seconds? </b>
<input id=recheck value=${gmGet(`frameTime`)} style="width:10%;"></input><br />
<b >Automate opening HITs? </b>
<input id=aOpen type="checkbox" checked></input><br class=hidey />
<b class=hidey>How many to open? </b>
<input id=oLimit class=hidey value=${gmGet(`openLimit`) } style="width:10%;"></input><br />
<b style="display:none;">Remove submitted iframes?[experimental]</b>
<input id=clean type="checkbox" checked style="display:none;"></input>
<b >Background visualizer? </b>
<input id=cShow type="checkbox" checked></input><br />
<button id=startNyq style="background-color:#008CBA; color:white; border:none; margin-left:45%; margin-bottom:2%; margin-top:2%;">GO!</button>
</div>
</div>`);
    if(!gmGet(`autoOpen`)){
        $('#aOpen').removeAttr('checked');
        $('.hidey').toggle();
    }
    if(!gmGet('cleanFrames')){
        $('#clean').removeAttr('checked');
    }
    if(!gmGet(`colorShow`)){
        $('#cShow').removeAttr('checked');
    }
    if(gmGet('restart', true)){
        gmSet('restart', false);
        $('#startNyq').click();
    }
}

function autoJank(x, limit){
    if(gmGet(`autoOpen`)){
        if($('.qbox').eq(x).length){
            if(x < limit){
                $('.qbox').eq(x).click();
                setTimeout(function(){autoJank(x+1, limit);},2000);
            }else{
                setTimeout(function(){
                    $('#killFramesW').click();
                    $('#killFrames').click();
                    $('#qButter').click();
                },gmGet(`frameTime`)*1000);
            }
        }else{
            setTimeout(function(){
                $('#killFramesW').click();
                $('#killFrames').click();
                $('#qButter').click();
            },gmGet(`frameTime`)*1000);
        }
    }
}

function frameEmpty(){
    if(dLink.indexOf("www") > 0){
        if (dLink.indexOf("NyQueue") > 0){
            if(gmGet('killFrames')){
                var frames = $('iframe').length;
                while(frames > 1){
                    $('iframe').eq(1).remove();
                    frames--;
                }
                gmSet('killFrames', false);
            }
        }
    }else if(dLink.indexOf("worker") > 0){
        if(gmGet('killFramesW')){
            var framesW = $('iframe').length;
            while(framesW > 1){
                $('iframe').eq(1).remove();
                framesW--;
            }
            gmSet('killFramesW', false);
        }
    }
    setTimeout(function(){frameEmpty();}, 100);
}

function checkQueue(){//updates queue data for global use
    if(dLink.indexOf("www") > 0){
        quelist = [];
        reqlist = [];
        titlelist = [];
        for(i=0;i<25;i++){
            if($('a:contains(Continue work)').eq(i).length){
                quelist.push($('a:contains(Continue work)').eq(i).attr('href')+"&NyHit=true");
                reqlist.push($('a.capsulelink').eq(i).text().trim());
                titlelist.push($('.requesterIdentity').eq(i).text().trim());
            }
        }
        $('body').empty();
        for(g=0;g<25;g++){
            if(quelist[g]){
                gmSet(`curQueue${g}`,quelist[g]);
                gmSet(`curReq${g}`,reqlist[g]);
                gmSet(`curTit${g}`,titlelist[g]);
            }else{
                gmSet(`curQueue${g}`, "");
                gmSet(`curReq${g}`, "");
                gmSet(`curTit${g}`, "");
            }
        }
    }else if(dLink.indexOf("worker") > 0){
        quelist = [];
        reqlist = [];
        titlelist = [];
        for(i=0;i<25;i++){
            if($('a:contains(Work)').eq(i).length){
                quelist.push($('a.btn:contains(Work)').eq(i).attr('href'));
                //var weird = `.2.1:$`+i+`.0.$title1.0.1`;
                reqlist.push($(`span.project-name-column`).eq(i).text().trim());
                titlelist.push($('a.show-visited').eq(i).text().trim());
            }
        }
        //$('body').empty();
        for(g=0;g<25;g++){
            if(quelist[g]){
                gmSet(`curQueueW${g}`,quelist[g]);
                gmSet(`curReqW${g}`,reqlist[g]);
                gmSet(`curTitW${g}`,titlelist[g]);
            }else{
                gmSet(`curQueueW${g}`, "");
                gmSet(`curReqW${g}`, "");
                gmSet(`curTitW${g}`, "");
            }
        }
    }
}

function refreshQueue(){//Grabs the most recent queue data and updates the buttons on the queue list
    if(dLink.indexOf("www") > 0){
        //var lastQueue = quelist;
        quelist = [];
        reqlist = [];
        titlelist = [];
        for(l=0;l<25;l++){
            if(gmGet(`curQueue${l}`).length){
                quelist[l]=gmGet(`curQueue${l}`);
                reqlist[l]=gmGet(`curReq${l}`);
                titlelist[l]=gmGet(`curTit${l}`);

            }
        }
        if(!$('button.qbox').length){
            for(i=0;i<quelist.length;i++){
                $('body').append(`<button class=qbox href="https://www.mturk.com${quelist[i]}&NyHit=true" >${titlelist[i]+`<br />`+reqlist[i]}</button><br /><br />`);
            }
        }else{
            for(i=0; i<25; i++){
                if($('button.qbox').eq(i).length){
                    if(quelist[i].length){
                        $('button.qbox').eq(i).attr('href', quelist[i]);
                        $('button.qbox').eq(i).html(titlelist[i]+`<br />`+reqlist[i]);
                    }else{
                        $('button.qbox').eq(i).hide();
                    }
                }else{
                    if(quelist[i]){
                        $('body').append(`<button class=qbox href="https://www.mturk.com${quelist[i]}&NyHit=true" >${titlelist[i]+`<br />`+reqlist[i]}</button><br /><br />`);
                    }
                }
            }
        }
    }else if(dLink.indexOf("worker") > 0){
        //var lastQueue = quelist;
        quelist = [];
        reqlist = [];
        titlelist = [];
        for(l=0;l<25;l++){
            if(gmGet(`curQueueW${l}`).length){
                quelist[l]=gmGet(`curQueueW${l}`);
                reqlist[l]=gmGet(`curReqW${l}`);
                titlelist[l]=gmGet(`curTitW${l}`);
                console.log("bug#"+l+" "+quelist[l]);
                console.log($($('a.btn.btn-primary:contains(Work)').length));
            }
        }
        for(i=0;i<25;i++){
            if($('a.btn:contains(Work)').eq(i).length){
                $('li.table-row.expandable').eq(i).prepend(`<button style="display:inline; width:50px;" class=qbox href="https://worker.mturk.com${$('a.btn:contains(Work)').eq(i*2).attr('href')}" >NyQ</button><br /><br />`);
            }
        }
    }
    //setTimeout(function(){
    //    refreshQueue();
    //},200);
}

function drawFrames(){
    if(dLink.indexOf("NyQueue") > 0){
        if(dLink.indexOf("www") > 0){
            if(gmGet('newHIT').length){
                var href = gmGet('newHIT');
                $('body').append(`<iframe src="${href}" height=${eHeight} width=${eWidth} name="${href}"></frame>`);
                gmSet('newHIT', "");
            }
        }else if(dLink.indexOf("worker") > 0){
            if(gmGet('newHITW').length){
                var hrefW = gmGet('newHITW');
                $('body').append(`<iframe src="${hrefW}" height=${eHeight} width=${eWidth} name="${hrefW}"></frame>`);
                gmSet('newHITW', "");
            }
        }
    }
    setTimeout(function(){drawFrames();}, 50);
}

function changeRedirect(){//Changes the submit redirect url to a NyQueue specific url to help retrieve information
    $(document).ready(function(){
        setTimeout(function(){
            var sortURL = '/mturk/sortmyhits?searchSpec=HITSearch%23T%231%23100%23-1%23T%23!Status!0!rO0ABXQACEFzc2lnbmVk!%23!Deadline!0!%23!&selectedSearchType=hitgroups&searchWords=&sortType=Deadline%3A0&pageSize=100&NewQueue=false';
            var link_type = dLink.split(/mturk\/|\?/)[1];
            var hitExternalNextLink = $('a[id="hitExternalNextLink"]:not([href*="groupId="])');
            var is_external_HIT = $('iframe').length > 0;
            var sortmyhits_URL = sortURL;
            if (hitExternalNextLink.length > 0 && window.name.indexOf('mtbqswin') == -1){
                var this_hitId = hitExternalNextLink.attr('href').split(/&|hitId=/)[2];
                if (link_type == 'continue' || link_type == 'submit' || link_type == 'return'){
                    if (link_type == 'submit' || link_type == 'return'){
                        window.location.replace(sortURL);
                    }else if (is_external_HIT){
                        hitExternalNextLink.attr('href', sortURL);
                    }
                }else{
                    hitExternalNextLink.attr('href', sortURL);
                }
            }else if (dLink.endsWith('?first') || (link_type == 'continue' && $('span[id="alertboxHeader"]:contains("You have already")').length > 0)){
                window.location.replace("https://www.mturk.com/mturk/myhits");
            }else if (dLink.endsWith('myhits?last') || dLink.endsWith('?last')){
                window.location.replace("https://www.mturk.com"+sortURL);
            }
        },850);
    });
}
//End Script functions