// ==UserScript==
// @name         timedStudyBooru
// @namespace    http://tampermonkey.net/
// @version      2024-08-01
// @description  lazy random image timer tampermonkey edition
// @author       Izuthree
// @match        https://danbooru.donmai.us/posts/*
// @match        https://safebooru.donmai.us/posts/*
// @match        http://behoimi.org/post/show/*
// @match        https://e621.net/posts/*
// @match        https://gelbooru.com/index.php?page=post&s=view*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=donmai.us
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/485413/timedStudyBooru.user.js
// @updateURL https://update.greasyfork.org/scripts/485413/timedStudyBooru.meta.js
// ==/UserScript==

/*
24-08-01
fixed blur delay logic oopsie

24-07-15
fixed blur delay default
added force blur and blur slider

24-05-30
added preliminary 3dbooru support

24-03-30
added gm.getset for greasemonkey instead of tampermonkey

24-03-29
added simple vertical mode

24-03-10
fixed toggle states, forced non-toggled save state to be disabled
use domain as localstorage value for site-specific lists
fixed history fetching invalid smaller images (this makes the feature more expensive)
unblur improv mode is now tied to rest period, 0 rest means it won't unblur
cleaned up the mess of defaults because lol ?? exists

todo:
- make a date-driven timer instead of a shitty setinterval
- day awareness/schedule
*/


let domain = window.location.hostname;
let studyTopics = GM_getValue(domain) ?? [['order:rank',true]];
let fullTimer = GM_getValue('studyTimer') ?? 150;
let timeout = GM_getValue('studyTimer') ?? 150;
let enabled = GM_getValue('enabled') ?? false;
let toggled = GM_getValue('exerciseVisible') ?? false;
let multiPart = GM_getValue('multiPart') ?? false;
let improvPractice = GM_getValue('improvPractice') ?? false;
let improvDelay = GM_getValue('improvDelay') ?? 0;
let improvIntensity = GM_getValue('improvIntensity') ?? 50;
let restDelay = GM_getValue('restDelay') ?? 0;
let randomFlip = GM_getValue('randomFlip') ?? false;
let forceBlur = GM_getValue('forceBlur') ?? false;
let setLength = GM_getValue('setLength') ?? -1;
let countupMode = GM_getValue('countupMode') ?? false;
let splitTimer = GM_getValue('splitTimer') ?? false;
let minimalUI = GM_getValue('minimalUI') ?? false;
let history = GM_getValue('history') ?? [];
let historyToggle = GM_getValue('historyToggle') ?? false;
let historyLimit = GM_getValue('historyLimit') ?? 0;
let extraBlacklist = GM_getValue('extraBlacklist'); //currently unused
let countdownTimer;
let countupTimer;
let countupTime = 0;
let imgContainer;
let skipMe = false;

const $ = window.jQuery; //im lazy
embeds();

$(window).ready(function(){
    //some sites have image-container as an id, some have it as a class
    //easiest way to fix this is just have the element as a jquery variable, has to be fetched on .ready
    if($('#image-container').length>0){imgContainer=$('#image-container');}else{imgContainer=$('.image-container');}

    //skip immediately if blacklisted, upgrade needed or removed and the script is active
    let params = [$(imgContainer).find("[href*='/upgrade']").length,$('#blacklist-list>li').length];
    for(let i=0;i<params.length;i++){//check if specified parameters are true
        if(params[i]>0){skipMe[1]=true;}//notify of skip if they are
            //if(enabled){changeImage(true)}
    }//but only actually skip if enabled is true
    //handle listeners regardless of state
    $('.showHideStudy').click(function(){$('body').toggleClass('studyModeActive');$('.studyContainer').removeClass('timerRunning');enabled=false;toggled=!toggled;$('.studymode').prop('disabled',!$('.studymode').prop('disabled')); setValues();});

    $('.studyButton').click(function(){startStudying()});
    $('.skipButton').click(function(){changeImage(true)});
    $(".multiPartMode").click(function(){multiPart = !multiPart; $('.multiPartMode').toggleClass('dialogInactive');setValues()});
    $(".minimalUI").click(function(){minimalUI = !minimalUI; $('.studyContainer').toggleClass('lessUI'); $('.minimalUI').toggleClass('dialogInactive');setValues()});
    $(".improvMode").click(function(){improvPractice = !improvPractice; $('.improvMode').toggleClass('dialogInactive');setValues()});
    $(".randomHorizontal").click(function(){$('.randomHorizontal').toggleClass('dialogInactive');randomFlip=!randomFlip;setValues()});
    $(".horizontalFlip").click(function(){$('.horizontalFlip').toggleClass('dialogInactive');$(imgContainer).toggleClass('horFlipped');});
    $(".forceBlur").click(function(){$('.forceBlur').toggleClass('dialogInactive');forceBlur=!forceBlur;$(imgContainer).toggleClass('forcedBlur');});
    $(".grayscaleToggle").click(function(){$('.grayscaleToggle').toggleClass('dialogInactive');$(imgContainer).toggleClass('multiPartToggle');});
    $(".countupToggle").click(function(){if(!enabled){countupLazy()}});
    $(".timer").click(function() {splitTimer=!splitTimer;if(countupTimer){updateTimer(countupTime)};if(!countupTimer){updateTimer(timeout)}});
    $('.searchTermSave').click(function(){setValues();})
    $('.showSearchTerms').click(function(){$('.searchTermMenus').toggleClass('searchTermsInvisible');$('.showSearchTerms').toggleClass('dialogInactive');});
    $('.searchTermAddOption').click(function(){addStudyOption('Study Option','true');})
    $('.showHistory').click(function(){$('.historyContainer').toggleClass('historyVisible');
                                       if($('.historyVisible').length>0){parseHistory();}
                                       else{$('.historyItems').empty();}})
    $('.addSkips').click(function(){historyToggle=!historyToggle; $('.addSkips').toggleClass('dialogInactive');setValues();})
    $('.historyClear').click(function(){history = []; $('.historyItems').empty();setValues()});
    $('.removeInput').click(function(){$(this).parent().remove()});
    $('.disableInput').click(function(){let setting = $(this).parent().children('.studyTopicOption').attr('enabled') == 'true';;$(this).parent().children('.studyTopicOption').attr('enabled',!setting)});

    $(".improvBlurSlider").on("input", function() {improvIntensity = $('.improvBlurSlider')[0].value;
                                                  $('.lolhack').text('.forcedBlur>picture,.studyModeActive #image-container.improvToggle>img, .image-container.improvToggle>picture{filter:blur('+improvIntensity/100*2+'cqmin);}\
.forcedBlur.multiPartToggle>picture,.studyModeActive #image-container.multiPartToggle.improvToggle>img, .image-container.multiPartToggle.improvToggle>picture{filter: grayscale(100%) blur('+improvIntensity/100*2+'cqmin)!important;}')
                                                  })
    $(".studyTimer").on("input", function() {fullTimer = parseInt($('.studyTimer')[0].value); if(!enabled){updateTimer(fullTimer);} setValues();});
    $(".restTimer").on("input", function() {restDelay = parseInt($('.restTimer')[0].value); let aa = $('.restTimer')[0]; $(aa).attr('value',restDelay); setValues();});
    $(".improvDelay").on("input", function() {improvDelay = parseInt($('.improvDelay')[0].value); let aa = $('.improvDelay')[0]; $(aa).attr('value',improvDelay); setValues();});
    $(".setLength").on("input", function() {setLength = parseInt($('.setLength')[0].value); let aa = $('.setLength')[0];$(aa).attr('value',setLength); setValues();});
    $('.historySize').on('input',function(){historyLimit = parseInt($('.historySize')[0].value); let aa = $('.historySize')[0];$(aa).attr('value',historyLimit); setValues();})



    if(!toggled){$('.studymode').prop('disabled',true); enabled=false;} //script hidden if toggled off
    else{
    $('body').addClass('studyModeActive')
    //if any properties are true, apply them immediately
    if(multiPart){$('.multiPartMode').toggleClass('dialogInactive');}
    if(improvDelay=='0'&&improvPractice&&enabled){$(imgContainer).addClass('improvToggle');}
    if(minimalUI){$('.minimalUI').toggleClass('dialogInactive');$('.studyContainer').toggleClass('lessUI');}
    if(improvPractice){$('.improvMode').toggleClass('dialogInactive');}
    if(forceBlur){$('.forceBlur').toggleClass('dialogInactive');$(imgContainer).toggleClass('forcedBlur');}
    if(countupMode){$('.countupToggle').toggleClass('dialogInactive');updateTimer(countupTime);}
    if(historyToggle){$('.addSkips').toggleClass('dialogInactive');}
    if (randomFlip==true){
        $('.randomHorizontal').toggleClass('dialogInactive');
        if(Math.floor(Math.random()*100)>50){
            $('.horizontalFlip').toggleClass('dialogInactive');
            $(imgContainer).toggleClass('horFlipped');
        }
    }
    }});

//Run when all images/contents are loaded so you don't lose time while it's still loading
$(window).on("load", function() {
    if (enabled&&toggled) {
       $('.studyContainer').addClass('timerRunning');
       enabled=!enabled; //hack to account for startStudying flipping it
       startStudying();
    }
});

function startStudying(){
    enabled = !enabled;
    if(enabled){
        if(countupMode==false){countdownTimer = setInterval(countdown, 1000); }
        if(countupMode==true){countupTime=0; updateTimer(countupTime); countupTimer = setInterval(countup, 1000);}
        if (improvDelay == 0 && $('.improvToggle').length<=0 && improvPractice){$('.image-container').addClass('improvToggle')}
        $('.studyContainer').addClass('timerRunning');
    }
    else{
         if(countupMode==false){updateTimer(fullTimer);clearInterval(countdownTimer); timeout = parseInt($('.studyTimer')[0].value);}
         if(countupMode==true){updateTimer(countupTime);clearInterval(countupTimer); countupTime=0;}
        $('.studyContainer').removeClass('timerRunning');
        $(imgContainer).removeClass('improvToggle');$(imgContainer).removeClass('multiPartToggle'); }
}

function parseHistory(){
for(let i=history.length-1;i>=0;i--){
    $('.historyItems').append('<a href="'+history[i][0]+'" style="background-image:url('+history[i][1]+')" /a>');
}
}

//set localstorage variables
//super lazy to set them all at once in a big function but I can't be arsed to make this more elegant
function setValues(){
    //recreate studytopics from the UI to save into an array
    studyTopics = [];
    let searchTerms = $('.searchTermOption');
    let delList = [];
    for(let i=0;i<searchTerms.length;i++){
    if($(searchTerms[i]).children('.studyTopicOption').val()!=''){studyTopics.push(new Array($(searchTerms[i]).children('.studyTopicOption').val(),$(searchTerms[i]).children('.studyTopicOption').attr('enabled')));}}
    GM_setValue(domain,studyTopics); //study topics uses the domain name as a variable name

    timeout = parseInt($('.studyTimer')[0].value); //reset timeout means you can't pause and resume, fixme when changing from shit timer
    fullTimer = parseInt($('.studyTimer')[0].value); //parse this now so the saved value is correct
    GM_setValue('studyTimer',fullTimer);

    //regular vars
    GM_setValue('exerciseVisible',toggled);
    GM_setValue('multiPart',multiPart);
    GM_setValue('improvDelay',$('.improvDelay')[0].value);
    GM_setValue('improvIntensity',$('.improvBlurSlider')[0].value);
    GM_setValue('restDelay',$('.restTimer')[0].value);
    GM_setValue('setLength',$('.setLength')[0].value);
    GM_setValue('randomFlip',randomFlip);
    GM_setValue('forceBlur',forceBlur);
    GM_setValue('countupMode',countupMode);
    GM_setValue('improvPractice',improvPractice);
    GM_setValue('splitTimer',splitTimer);
    GM_setValue('enabled',enabled);
    GM_setValue('minimalUI',minimalUI);
    GM_setValue('history',history);
    GM_setValue('historyLimit',historyLimit);
    GM_setValue('historyToggle',historyToggle);
}

function changeImage(skipped){
    if(skipped==undefined){skipped=false};
    if(skipped && historyToggle && !skipMe[1]){addHistory();}
    else if(!skipped){addHistory();}
    if(!skipMe[0]){setValues();}
    let possibleTopics = [];
    for(let i=0;i<studyTopics.length;i++){if(studyTopics[i][1]=='true'){possibleTopics.push(studyTopics[i][0]);}}

    if(domain=="gelbooru.com"){
        let searchTerm ="index.php?page=post&s=list&tags=sort%3arandom+"+possibleTopics[Math.floor(Math.random()*possibleTopics.length)];
        $('.dummy').load(searchTerm, function(data) {
            window.location.href = $($(data).find('.thumbnail-container a')[0]).attr('href');
        })}
    if(domain=="behoimi.org"){
        let searchParm = possibleTopics[Math.floor(Math.random()*possibleTopics.length)]
        $.ajax({url: "http://behoimi.org/post?tags="+searchParm+"&commit=Search", success: function(data){
          let pageCount = ($($(data).find('#paginator .pagination>a:nth-last-child(2)')[0]).html());
          pageCount = parseInt(pageCount);
          $.ajax({url: "http://behoimi.org/post/index?commit=Search&tags="+searchParm+"&page="+Math.floor(Math.random()*pageCount), success: function(data2){
              let elementNumber = $($(data2).find('.thumb>a'))
              window.location.href = $($(data2).find('.thumb>a')[Math.floor(Math.random()*elementNumber.length)]).attr('href');
          }})
        }})
    }
    if (domain=="danbooru.donmai.us" || domain=="e621.net"){
        window.location.href = "https://"+domain+"/posts/random?tags="+possibleTopics[Math.floor(Math.random()*possibleTopics.length)];
    }
}

function addHistory(){
    if(historyLimit!=0){
        if(history.length==(historyLimit) && historyLimit!=-1){history.shift()};
        let sampleLink;
        if($('.image-view-large-link').length>0){sampleLink=$('.image-view-large-link').attr('href');}
        else{sampleLink=$('#post-info-size a').attr('href');}
        history.push([window.location.href,sampleLink]);
    }
}

function updateTimer(time){
    if(splitTimer){
    let splitTime = Math.floor(time / 60);
    let seconds = time - Math.floor(time / 60) * 60;
    if(seconds<10){seconds = "0"+seconds;}
    splitTime = splitTime+":"+seconds;
    $('.timer').html(splitTime);}
    else{$('.timer').html(time);}
}

//shitty countdown but it does its job enough:tm:
function countdown(){
    if(enabled){
        if(timeout>-1){
            timeout--;
            //apply multiPart when timer is at 1/2, apply improvDelay when timeout is <= the variable
            if(timeout<=(fullTimer/2) && multiPart==true && $(imgContainer).hasClass('multiPartToggle')==false){$(imgContainer).addClass('multiPartToggle'); updateTimer(timeout);}
            if(timeout<=(fullTimer-improvDelay) && improvPractice==true && $(imgContainer).hasClass('improvToggle')==false){$(imgContainer).addClass('improvToggle'); updateTimer(timeout);}
            updateTimer(timeout);}
        else if (timeout<=0){
            clearInterval(countdownTimer);
            if(setLength>0){setLength--; ($('.setLength')[0].value) = setLength} //if setlength is >0, reduce it
            if(setLength!=0){ //then if setlength is not 0, load normally
                $('.timer').html("Resting...");
                if(restDelay!=0){$(imgContainer).removeClass('improvToggle');} //remove blur to review the improv image unblurred if delay is greater than 0
                $('.timer').addClass('timerRest');setTimeout(changeImage, (restDelay*1000));}
            }if(setLength==0){startStudying();} //else end study mode
    }
}

//lol lmao
function countupLazy(){
        $('.countupToggle').toggleClass('dialogInactive');
        countupMode = !countupMode;
        if(countupMode==false){updateTimer(fullTimer);}
        if(countupMode==true){updateTimer(countupTime);}
}
function countup(){countupTime++;updateTimer(countupTime);} //super lazy stopwatch that needs making not lazy

//UI button handler
function addStudyOption(studyName,isEnabled){
     $('.searchTermOptionContainer').append("<div class='searchTermOption'><input type='text' class='studyTopicOption' value='"+studyName+"' enabled='"+isEnabled+"'></input><div class='removeInput' title='Click to remove entry.'><p>-</p></div><div class='disableInput' title='Click to enable/disable entry.'><p>=</p></div></div>")
}
//solely so I can collapse this mess lol
//includes hotkey watchers
function embeds(){
    if (domain == "behoimi.org"){
        $('body').append('<style class="3dbooruOverrides">body.studyModeActive .content img{position:fixed;top:0;left:0;right:0;bottom:0;margin:auto!important;background:#000;z-index:2;max-height:100vh!important;max-width:100vw!important;object-fit:contain}body.studyModeActive .content:after{content:"";background:#000;position:fixed;width:100%;height:100%;top:0;left:0;z-index:1}</style>');
    }
    let splitTime;
    if(splitTimer){
    splitTime = Math.floor(fullTimer / 60);
    let seconds = fullTimer - Math.floor(fullTimer / 60) * 60;
    if(seconds<10){seconds = "0"+seconds;}
    splitTime = splitTime+":"+seconds;
    }else{splitTime=fullTimer};
    let screaming;if(enabled){screaming='timerRunning'};
$('body').append("<div class='timedBooruStudy'>\
<div class='dummy'></div>\
<div class='studyContainer "+screaming+"'>\
<div class='timerContainer'>\
<div class='timer'>"+splitTime+"</div>\
<div class='timerButtons'>\
<div class='studyButton' title='Start/stop studying! (Hotkey 1)'></div>\
<div class='skipButton' title='Skip to next image (Hotkey 2)'></div>\
</div>\
<div class='timersContainer'>\
<div class='stTim'><input type='number' class='studyTimer' title='The duration of the timer.' min='0' value='"+fullTimer+"'></input></div>\
<div class='rstTim'><input type='number' class='restTimer' min='0' title='The rest delay before switching to the next picture.' value='"+restDelay+"'></input></div></div>\
<div class='setNo'><input type='number' class='setLength' min='-1' title='Number of images to automatically advance to before disabling. -1 disables the feature, 0 stops the timer advancing to next image.' value='"+setLength+"'></input></div>\
</div>\
<div class='preferencesContainer'>\
<div class='showHideStudy'>Disable Study Mode</div>\
<div class='showSearchTerms dialogInactive'>Show/Hide Search Terms</div>\
<div class='searchTermMenus searchTermsInvisible'>\
<div class='searchTermAddContainer'><div class='searchTermAddOption' title='Add new search option'><p>Add New</p></div><div class='searchTermSave' title='Save changes (this shouldnt be necessary but just in case!)'><p>Save List</p></div></div>\
<div class='searchTermOptionContainer'></div></div>\
<div class='improvContainer' style='flex-wrap:wrap'>\
<div class='modeDialog dialogInactive improvMode' title='After 15 seconds, image is blurred significantly (Hotkey 4)' style='width:calc(100% - 50px); flex-grow:1'><p>Improv mode</p></div>\
<div class='improvInput' style='width:45px;flex-grow:1;'><input type='number' class='improvDelay' min='0' title='The delay before blurring the picture.' value='"+improvDelay+"'></input></div>\
<div class='improvBlur' style='width:100%'><input type='range' min='0' max='100' value='"+improvIntensity+"' class='improvBlurSlider'></div>\
</div>\
<div class='modeToggles'>\
<div class='modeDialog dialogInactive multiPartMode' title='After half duration is elapsed, image turns greyscale (Hotkey 3)'><p>Multi-Part Mode</p></div>\
<div class='modeDialog dialogInactive countupToggle' title='Increase timer instead of decreasing it, to see how long it takes to finish things (Hotkey 8)'><p>Count Up</p></div>\
<div class='modeDialog dialogInactive randomHorizontal' title='Randomly flip image horizontally on load (Hotkey 5)'><p>Random Flip</p></div>\
<div class='modeDialog dialogInactive minimalUI' title='Hide more UI while studying'><p>Hide Running UI</p></div>\
</div>\
<div class='displayToggles'>\
<div class='modeDialog dialogInactive horizontalFlip' title='Flip horizontally (Hotkey 6)'>H</div>\
<div class='modeDialog dialogInactive grayscaleToggle' title='Grayscale filter (Hotkey 7)'>G</div>\
<div class='modeDialog dialogInactive forceBlur' title='Force Blur'>FB</div>\
<div class='modeDialog dialogInactive showHistory' title='Show History'>Show History</div>\
</div></div>\
</div></div>");
for(let i=0;i<studyTopics.length;i++){addStudyOption(studyTopics[i][0],studyTopics[i][1]);}

$('.timedBooruStudy').append("<div class='historyContainer'><div class='historyHeader'>\
<div class='modeDialog dialogInactive addSkips'>Add Skips to History</div><div class='hisSize'><input type='number' class='historySize' min='-1' value='"+historyLimit+"'></input></div><div class='historyClear dialogInactive'>Clear History</div></div>\
<div class='historyItems'></div></div>");

    $('head').append('<link rel="preconnect" href="https://fonts.googleapis.com">\
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\
<link href="https://fonts.googleapis.com/css2?family=Righteous&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">\
                     ');
$('body').append("<div class='showHideStudy'><p>Enable Study Mode</p></div>");
$('body').append("<style>.panicbutton{opacity:0;!important}</style>");
$('body').append("<style class='studyCSS'>\
@import url('https://fonts.googleapis.com/css2?family=Righteous&display=swap');\
.dummy{position:fixed;right:-100%;opacity:0;}\
.studyModeActive .image-container, .studyModeActive #image-container{position:fixed;top:0!important;left:0;width:100vw;height:100vh!important;background:black;margin:0!important;z-index:100;}\
.studyModeActive .image-container>picture{display:flex!important;width:100vw!important;height:100vh!important;}\
.studyModeActive .image-container>picture>img{height:100%!important;width:100%!important;object-fit:contain!important;max-width:100%!important;max-height:100%!important;}\
.studyModeActive #image-container.multiPartToggle>img, .image-container.multiPartToggle>picture{filter: grayscale(100%);}\
.studyModeActive #image-container.improvToggle>img, .image-container.improvToggle>picture{filter:blur("+improvIntensity/100*2+"cqmin);}\
.studyModeActive #image-container.multiPartToggle.improvToggle>img, .image-container.multiPartToggle.improvToggle>picture{filter: grayscale(100%) blur("+improvIntensity/100*2+"cqmin)!important;}\
.studyModeActive .horFlipped{transform:scaleX(-1);}\
.timedBooruStudy{color:white;}\
.studyModeActive #image-container{max-height:100vh!important;position:fixed;top:0;left:0;display:flex;width:100vw;height:100vh;background:black;justify-content:center;z-index:2;}\
.studyModeActive #image-container>img{max-height:100%;max-width:100%;}\
.image-container>img{max-height:100%;object-fit:contain;position:absolute;padding-left:300px!important;}\
.studyModeActive .timedBooruStudy{font-family:Righteous!important;}\
.timedBooruStudy *{box-sizing:border-box;}.timerRest{font-size:30pt!important;}\
.showSearchTerms,.studyContainer .showHideStudy{width:calc(100% - 20px);height:40px;cursor:pointer;padding:10px;border-radius:10px;margin:10px 10px;font-size:15pt;text-align:center;border:1px solid #ffffff55;user-select: none;transition:opacity 0.2s ease-in-out;}.studyModeActive picture img{padding-right:0px;padding-left:0px;}.studyModeActive:not(:has(.timerRunning)) section:not(.horFlipped)>picture>img{padding-left:clamp(300px,20%,20%);}.studyModeActive:has(.historyVisible) section:not(.horFlipped)>picture>img{padding-right:clamp(300px,20%,20%);}.studyModeActive:not(:has(.timerRunning)) .horFlipped>picture>img{padding-right:clamp(300px,20%,20%);}.studyModeActive:has(.historyVisible) .horFlipped>picture>img{padding-left:clamp(300px,20%,20%);}.studyContainer .showHideStudy{opacity:0.5;font-size:10pt;height:20px;line-height:0px;}.studyContainer .showHideStudy:hover{opacity:0.8}.timedBooruStudy{position:fixed;z-index:100;opacity:0;pointer-events:none;transition:opacity 0.2s ease-in-out}.studyModeActive .timedBooruStudy{opacity:1;pointer-events:auto;transition:opacity 0.2s ease-in-out;}.searchTermMenus{top:0;left:0;width:100%;height:auto;padding:0px 10px 0px 10px;margin:0 0 10px 0 ;text-align:center;position:relative;overflow-y:auto;transition:opacity 0.2s ease-in-out, height 0.2s ease-in-out, padding 0.2s ease-in-out;max-height:calc(44vh);border-bottom:1px solid #ffffff40;}input{background:#1a1a24;}.searchTermOptionContainer{min-height:100px;max-height:calc(100cqh - 40px);overflow-y:auto;}.searchTermOptionContainer>div{display:flex;width:100%;flex-wrap:wrap;}.searchTermOptionContainer>div>input{background:#1a1a24;flex-grow:1;padding-left:10px;border-top-left-radius:10px;border-bottom-left-radius:10px;}.searchTermOptionContainer>div>div{width:40px;height:40px;cursor:pointer;}.searchTermOption{width:100%;height:40px;margin-bottom:5px;}.studyTopicOption[enabled='false']{opacity:0.5;}.historyClear,.searchTermAddContainer{display:flex;}.searchTermAddOption,.searchTermSave{user-select: none;border-radius:10px;width:40%;flex-grow:1;height:40px;left:10px;border:1px solid #ffffff55;box-sizing:border-box;padding:10px;background:#ffffff11;cursor:pointer;text-align:center;}.searchTermSave{left:unset!important;right:10px;}.searchTermsInvisible{transform:scaleY(0);transform-origin:top;pointer-events:none;padding:0px 10px 0px 10px;overflow:hidden;opacity:0;height:0;transition:opacity 0.2s ease-in-out, transform 0.2s ease-in-out, padding 0.2s ease-in-out;}.studyModeActive .image-container.blacklisted-active{display:flex!important;justify-content:center;position:fixed;top:0;left:0;right:0;bottom:0;background:black;height:calc(100vh + 20px);width:100vw;z-index:3;margin:0!important;}.studyModeActive .image-container.blacklisted-active picture{width:100%;height:100%;display:flex;justify-content:center;}.studyModeActive .image-container.blacklisted-active img{filter:blur(40px) brightness(30%);margin:auto;display:block;}.studyModeActive .image-container.blacklisted-active:after{content:'Blacklisted Image';position:fixed;top:0;left:0;right:0;bottom:0;width:400px;height:max-content;color:white;background:#9C1D1Dcf;margin:auto;font-size:40pt;line-height:40pt;text-align:center;padding:20px;border-radius:20px;}.removeInput,.disableInput,.modeDialog{user-select: none;border:1px solid #ffffff55;display:flex;justify-content:center;align-items:center;background:#ffffff11}.disableInput{border-top-right-radius:10px;border-bottom-right-radius:10px;border-left:none;}.historyClear:hover,.removeInput:hover,.disableInput:hover,.searchTermAddOption:hover,.searchTermSave:hover,.modeDialog:hover{background:#ffffff33;transition:background 0.2s ease-in-out;}.studyContainer,.historyContainer{position:fixed;background:#3f4058dc;backdrop-filter: blur(10px);display:flex;flex-direction:column-reverse;z-index:101;left:0;top:0;width:clamp(300px,20%,20%);height:100vh;font-family: 'Righteous', sans-serif;justify-content:space-between;max-height:100vh;flex-wrap:nowrap;transition:background 0.2s ease-in-out, backdrop-filter 0.2s ease-in-out;}.timersContainer,.setNo,.improvContainer{display:flex;width:100%;padding:10px;}.timersContainer>div{position:relative;}.stTim{flex-grow:2;flex-shrink:1;}.stTim>input{border-top-left-radius:10px;border-bottom-left-radius:10px;text-align:right;}.rstTim{flex-grow:1;flex-shrink:2}.rstTim>input{border-top-right-radius:10px;border-bottom-right-radius:10px;}.rstTim:has([value='0']){opacity:0.5}.timersContainer input,.setNo input{width:100%;}.studyTimer,.restTimer,.setLength{height:50px;font-size:24pt;position:relative;}.hisSize:after,.stTim:after,.rstTim:after,.setNo:after,.improvContainer:after{content:'Timer';position:absolute;top:-8px;left:7px;font-size:18pt;pointer-events:none;transform:rotate(-2deg);text-shadow:0 0 4px black;}.rstTim:after{content:'Rest';right:7px;left:unset;transform:rotate(2deg)}.setNo:after{content:'Set Count';top:-2px;left:16px;}.setNo:has([value='-1']){opacity:0.5;}.setNo{position:relative;}.setLength{border-radius:10px;font-size:18pt;height:40px;}.modeToggles,.displayToggles{user-select: none;width:100%;display:flex;flex-wrap:wrap;padding:10px;gap:10px;}.modeToggles>div{width:30%;flex-grow:1;text-align:center;height:50px;display:flex;justify-content:center;}.modeDialog{display:flex;padding:5px;border-radius:10px;box-sizing:border-box;justify-content:center;align-items:center;opacity:1;transition:opacity 0.2s ease-in-out;gap:10px;cursor:pointer;}.showSearchTerms:not(.dialogInactive), .modeDialog:not(.dialogInactive){background:#ffffffcc;color:#3f4058}.modeDialog p,.searchTermOption p{margin:0;}.showSearchTerms.dialogInactive, .modeDialog.dialogInactive{opacity:0.5;}.showSearchTerms.dialogInactive:hover, .modeDialog.dialogInactive:hover{opacity:0.8;}.improvContainer{display:flex;width:100%;gap:0;position:relative;}.improvContainer>*{margin:0;}.improvContainer:has(.dialogInactive):after,.improvContainer:has(.dialogInactive) input{opacity:0.5;}.improvContainer:after{content:'Blur Delay';font-size:10pt;right:15px;left:unset;top:0;}.improvMode{width:70%;border-top-right-radius:0;border-bottom-right-radius:0;}.improvInput{width:30%;}.improvContainer input{width:100%;height:40px;border-top-right-radius:10px;border-bottom-right-radius:10px;}.displayToggles>*{flex-grow:1;}.preferencesContainer{position:relative;flex-grow:1;flex-shrink:1;overflow-y:auto;}.timerContainer{display:flex;flex-wrap:wrap;align-self:flex-end;width:100%;flex-shrink:0;}.timer{font-size:98pt;text-align:center;height:130px;width:100%;padding:10px;cursor:pointer;line-height:110px;text-shadow:0 0 4px #00000066;}.timerButtons{display:flex;width:100%;padding:10px;gap:10px;}.studyButton,.skipButton{cursor:pointer;border:1px solid #ffffff55;height:90px;padding:10px;border-radius:20px;position:relative;}.studyButton{background:#4A964455;flex-grow:1;transition:background 0.2s ease-in-out;}.skipButton{background:#49449655;aspect-ratio:1;min-width:90px;}.studyContainer.timerRunning .studyButton{background:#9C1D1D55;}.studyButton:hover{background:#4A9644cf;}.skipButton:hover{background:#494496cf;}.studyContainer.timerRunning .studyButton{background:#9C1D1Dcf;}.studyButton:after,.skipButton:after{content:'Start';display:block;font-size:24pt;margin:auto;position:absolute;top:0;left:0;right:0;bottom:0;width:max-content;height:max-content;}.studyContainer.timerRunning .studyButton:after{content:'Stop';width:max-content;}.skipButton:after{content:'Skip'}.preferencesContainer,.timerContainer{}.preferencesContainer{padding-bottom:0px;opacity:1;transition:padding-bottom 0.2s ease-in-out,opacity 0.2s ease-in-out;}.studyContainer.timerRunning .preferencesContainer{opacity:0;transition:opacity 0.2s ease-in-out;}.lessUI.timerRunning .preferencesContainer{padding-bottom:130px;transition:padding-bottom 0.2s ease-in-out,opacity 0.2s ease-in-out;}.studyContainer.timerRunning{background:#3f405800;backdrop-filter: blur(0px);transition:background 0.2s ease-in-out, backdrop-filter 0.2s ease-in-out;}.timerRunning .timerContainer{background:#3f40589c;transition:background 0.2s ease-in-out;}.timerContainer{position:relative;bottom:0px;transition:bottom 0.2s ease-in-out;}.lessUI.timerRunning .timerContainer{bottom:-130px;background:#3f40585c;backdrop-filter: blur(10px);transition:bottom 0.2s ease-in-out, opacity 0.2s ease-in-out;}.timersContainer{opacity:1;transition:opacity 0.2s ease-in-out}.lessUI.timerRunning .timersContainer{opacity:0;transition:opacity 0.2s ease-in-out}.historyContainer{left:unset;right:0;top:0;background:#3f4058dc;backdrop-filter: blur(10px);flex-direction:column;justify-content:flex-start;opacity:0;transition:opacity 0.2s ease-in-out;}.historyContainer.historyVisible{opacity:1;transition:opacity 0.2s ease-in-out;}.historyHeader{padding:10px;display:flex;gap:10px;width:100%;text-align:center;box-sizing:border-box;flex-wrap:wrap;}.historyHeader>*{flex-shrink:1;flex-grow:1;}.hisSize{position:relative;width:45%;flex-grow:1;flex-shrink:1;opacity:1;transition:opacity 0.2s ease-in-out;}.addSkips{width:45%;flex-shrink:1;}.hisSize:after{content:'History Length';font-size:12pt;left:unset;right:5px;transform:rotate(2deg)}.historySize{height:100%;width:100%;border-radius:10px;text-align:right;}.hisSize:has([value='-1']){opacity:0.5;transition:opacity 0.2s ease-in-out;}.historyClear{position:static;width:100%;}.historyContainer.historyHidden{}.historyItems{display:flex;background:#1a1a24;overflow-y:auto;flex-wrap:wrap;padding:10px;flex-shrink:1;gap:10px;width:calc(100% - 20px);box-sizing:border-box;margin:0 auto;border-radius:10px;transition:height 0.2s ease-in-out;}.historyItems>a{display:block;width:40%;aspect-ratio:1;flex-grow:1;max-width:calc(50% - 10px);background-size:cover;background-position:50% 50%;border-radius:5px;background-repeat:no-repeat;}.studyModeActive>.showHideStudy{opacity:0;pointer-events:none;}body>.showHideStudy{position:fixed;height:75px;color:white;width:80px;bottom:0px;right:0px;padding:5px;z-index:120;padding:10px;pointer-events:auto;opacity:1;background:#3f40585c;border-left:1px solid #ffffff55;border-top:1px solid #ffffff55;border-top-left-radius:10px;backdrop-filter: blur(10px);text-align:center;cursor:pointer;}body>.showHideStudy:hover{background:#3f4058fc}\
input,textarea,select{color:#fff!important;}.timerContainer:has(.timerRest){bottom:-250px!important;}\
@media (max-aspect-ratio: 1/1.1) {\
#image-container, .image-container{display:flex;align-items:center;width:100%!important;max-width:100%!important;left:0px!important;height:calc(100% - 350px)!important;max-height:calc(100% - 350px)!important;}\
.studyContainer{height:350px;width:100%;flex-direction:row;bottom:0px!important;top:unset!important;}\
.timerContainer{width:300px;margin-right:30px;}\
.timer{font-size:92pt;line-height:130px;}\
.historyContainer:not(.historyVisible){pointer-events:none;}\
body:has(.timerRunning) .image-container,body:has(.timerRunning) #image-container{max-height:100%!important;}\
#image-container img, .image-container picture img{padding:0!important;object-fit:contain}}\
</style>");
$('body').append('<style class="lolhack">\
.forcedBlur>picture,.studyModeActive #image-container.improvToggle>img, .image-container.improvToggle>picture{filter:blur('+improvIntensity/100*2+'cqmin);}\
.forcedBlur.multiPartToggle>picture, .studyModeActive #image-container.multiPartToggle.improvToggle>img, .image-container.multiPartToggle.improvToggle>picture{filter: grayscale(100%) blur('+improvIntensity/100*2+'cqmin)!important;}\
</style>');

//hotkeys
$(document).bind('keydown', function(e) {
    if(e.keyCode==27){$('img').toggleClass('panicbutton');}
    if(!$('input').is(':focus') && toggled){ //prevent hotkeys is an input is focused
       if(e.keyCode=="49"){startStudying();}
       if(e.keyCode=="50"){changeImage(true);}
       if(!enabled){ //doing these while enabled/running breaks stuff, so prevent it
       if(e.keyCode=="51"){multiPart=!multiPart; $('.multiPartMode').toggleClass('dialogInactive');}
       if(e.keyCode=="52"){improvPractice=!improvPractice; $('.improvMode').toggleClass('dialogInactive');}
       if(e.keyCode=="53"){randomFlip=!improvPractice; $('.randomHorizontal').toggleClass('dialogInactive');}
       if(e.keyCode=="54"){$('.horizontalFlip').toggleClass('dialogInactive');$(imgContainer).toggleClass('horFlipped');}
       if(e.keyCode=="55"){$('.grayscaleToggle').toggleClass('dialogInactive');$(imgContainer).toggleClass('multiPartToggle');}
       if(e.keyCode=="56"){countupLazy();}
    }
    }
});
}