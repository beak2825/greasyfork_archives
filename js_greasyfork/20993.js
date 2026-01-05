// ==UserScript==
// @name         Khan Academy timestamps
// @namespace    https://www.khanacademy.org/
// @version      1.3
// @description  Adds time duration labels near each lesson title
// @author       nazikus
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @match        https://www.khanacademy.org/*/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/20993/Khan%20Academy%20timestamps.user.js
// @updateURL https://update.greasyfork.org/scripts/20993/Khan%20Academy%20timestamps.meta.js
// ==/UserScript==
/* jshint -W097 */

// TODO speed parameter button to adjust time labels accordingly
// https://developers.google.com/youtube/iframe_api_reference#Queueing_Functions

// TODO progress time on time label (text clipping background)
// http://nimbupani.com/using-background-clip-for-text-with-css-fallback.html

(function() {
'use strict';

console.log = function() {};  // disable debugging logs

// Vocabulary used here to correspond to KhanAcademy website structure:
// - Subject     major section (math, science, computing)
// - Supertopic  topic containing subtopics (Intergral Calculus)
// - Topic       contains video lessons (Vector and Spaces, Integrals)
// - Module      groups lessons of a single topic
// - Lesson      actual video lesson (contains links to other lesons in a module)

var startProcessing = function(){

  var currUrl = window.location.href;

  // CASE Lesson - video lesson page
  // Check if url contains a directory with a single character (e.g., '/v/', '/e/', etc)
  if ( /\/\w\/[\w\-]+$/.test(currUrl) )  {
    processLessonPage();
  }

  // CASE Topic - Topic page with Table of Contents (ToC)
  // valid url examples:
  // https://www.khanacademy.org/math/linear-algebra/vectors-and-spaces
  // https://www.khanacademy.org/math/calculus-home/integral-calculus/indefinite-definite-integrals
  // Check if current path has a sufficient depth for topic page and contains a ToC <div>
  else if ([6,7].indexOf(currUrl.split('/').length) >= 0 && $('div[class^="contents"]').length ){
    processTopicPage();
  }

  // Case Subject - page containing all the topics in the subject or supertopic
  // valid url examples:
  // https://www.khanacademy.org/math/linear-algebra
  // https://www.khanacademy.org/math/calculus-home/integral-calculus
  // Check if current path has a sufficient depth for subject/supertopic page and contains Topics <span>
  else if ([5,6].indexOf(currUrl.split('/').length) >= 0 && $('span:contains("Topics")').length ){
    processSubjectPage();
  }

  // Skip the rest
  else {
    console.log('No topics to label here, skipping...');
  }
};

////////////////////////////////////////////////////////////////////////////////
var processLessonPage = function() {
  console.log('Lesson page processing started...');
  var hrefs = $('div[class^="tutorialNavOnSide"] a');

  // create placeholder for Time Duration label of each lesson (master for cloning)
  var labelClass  = hrefs.find('div[class^="title"]').attr('class');
  var labelMaster = $('<span>', {class: labelClass}).css({'float':'left'});

  // select module header (where module time label to be appended)
  var moduleLabelTarget = $('div[class^="navHeaderOnSide"]').eq(0);
  // create placholder for Module Time Duration label with cumulated time (master for cloning)
  var moduleLabelMaster = $('<span>').css({'float':'left'});

  var moduleTimer = moduleTimerFactory(hrefs.length, {
    targetEl: moduleLabelTarget,
    labelEl: moduleLabelMaster.clone(),
    title: moduleLabelTarget.find('a').text(),
  });

  hrefs.each( (function(labelToClone, modTimer) {
    return function(idx, lessonHref){
      var href = $(lessonHref);
      var labelTarget = href.find('div[class^="info"]');
      var lessonUrl = href.attr('href');

      // get rgb colors of play button (as num array)
      var bg = href.find('div[class^="circle"]:first').css('background');
      var c = (bg ? bg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/).slice(1).map(function(v){return ~~v;}) : [0,0,0]);
      // naive rgb channels deviation
      var rgbDev = c.map(function(v){return Math.abs(v-this);},
           c.reduce(function(s,v){return s+v;},0)/c.length )
                .reduce(function(s,v){return s+v;})/c.length;
      var isLessonPassed = rgbDev > 20;  // if not white/grey button

      // time duration label object
      var labelObject = {
        targetEl: labelTarget,
        labelEl: labelToClone.clone(),
        title: href.text(),
        isPassed: isLessonPassed
      };

      // FETCH URL
      fetchAndAppendVideoDurationLabel(lessonUrl, labelObject, modTimer);
    };
  })(labelMaster, moduleTimer) );
};

////////////////////////////////////////////////////////////////////////////////
var processTopicPage = function() {
  console.log('Topic page processing starged...');

  // cleanup (while debugging)
  // $('span[class^="nodeTitle"]').remove();
  // $('span[style^="float: right"]').remove();

  // select topic modules, skip (slice) first div which is ToC
  var topicModules = $('div[class^="moduleList"] > div[class^="module"]').slice(1);

  // create placeholder for time duration label of each lesson (master for cloning)
  var labelClass = topicModules.find('> div > a div[class^="nodeTitle"]').attr('class'),
      labelColor = $('div[class^="header"][style^="background"').css('background-color'),
      labelMaster = $('<span>', {class: labelClass}).css({'float':'right', 'color': labelColor});

  // create placholder for Module Time Duration label with cumulated time (master for cloning)
  var moduleLabelMaster = $('<span>').css({'float':'right'}),
      topicLabel = $('<span>');
  $('h1[class^="title"]').after( topicLabel );

  var topicTimerInstance = topicTimerFactory(topicModules.length, topicLabel);
  console.log('Modules in topic: %s', topicModules.length);

  // iterate over each topic module in a separate worker
  topicModules.each(function(){
    window.setTimeout(function(that, lMaster, mlMaster, topicTimerInst){
      var hrefs = $(that).find('> div > a');
      // get all hrefs links in current module
      // get urls as string array (for debugging)
      // var urls = hrefs.map(function(){return this.href;}).get();

      // change dipslay alignment of divs containing time label
      hrefs.find('div[class^="nodeTitle"]').css('display', 'inline-block');

      // select module header (where module time label to be appended)
      var moduleLabelTarget = $(that).find('> h2 > div[style^="color:"]');
      var moduleObject = {
        targetEl: moduleLabelTarget,
        labelEl: mlMaster.clone(),
        title: moduleLabelTarget.find('a').text(),
      };

      // module time tracker, lesson counter & label creation
      var moduleTimer = moduleTimerFactory(hrefs.length, moduleObject, topicTimerInst);

      var moduleHasVideos = hrefs.map(function(){ return Boolean( $(this).attr('href').match(/\/v\/[\w\-]+$/) );})
                                 .toArray().reduce(function(s,v){return s+v;},0) > 0;
      
      if (hrefs.length === 0) { topicTimerInst.decSize(); }
      if (!moduleHasVideos)   { topicTimerInst.decSize(); }

      console.log('Module "%s", lessons %d', moduleObject.title, hrefs.length);

      // Info: extra closure here is to pass params into $.each()'s lambda
      hrefs.each( (function(labelToClone, modTimer){
        return function(idx, lessonHref){
          var href = $(lessonHref),
              labelTarget = href.find('> div[class^="nodeInfo"]'),
              lessonUrl = href.attr('href');

          // get rgb colors of play button (as num array)
          var bg = href.find('div[class^="circle"]:first').css('background');
          var c = (bg ? bg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/).slice(1).map(function(v){return ~~v;}) : [0,0,0]);
          // naive rgb channels deviation
          var rgbDev = c.map(function(v){return Math.abs(v-this);},
               c.reduce(function(s,v){return s+v;},0)/c.length )
                    .reduce(function(s,v){return s+v;})/c.length;
          var isLessonPassed = rgbDev > 20;  // if not white/grey button

          // time duration label object
          var labelObject = {
            targetEl: labelTarget,
            labelEl: labelToClone.clone(),
            title: href.text(),
            isPassed: isLessonPassed
          };

          // FETCH URL
          fetchAndAppendVideoDurationLabel(lessonUrl, labelObject, modTimer);

        };})(lMaster, moduleTimer, topicTimerInst) ); // return hrefs.each()

    }, 0, this, labelMaster, moduleLabelMaster, topicTimerInstance); // return window.setTimeout()

  }); // return topicModules.each();
};


////////////////////////////////////////////////////////////////////////////////
var processSubjectPage = function(){
  console.log('Subject page processing started...');
  var subjTiming = {sec: 0, secFin: 0};
  var topicHrefs = $('div[class^="linkArea"] > div[class^="link"] > a');

  var c = 0;
  var uMap = ['/calculus-home/precalculus', '/algebra-home/precalculus'];

  console.log('urls in subject: %s', topicHrefs.length);

  // iterate over links, get their timings from cache
  topicHrefs.each(function(){
    var href = $(this),
        url = href.attr('href'),
        urlKey = url.indexOf(uMap[0])>-1 ? url.replace(uMap[0],uMap[1]): url;
    var cachedT = localStorage.getItem(urlKey);

    console.log('url %s: %s', href.attr('href'), cachedT);
    if (cachedT){
      var cachedTs = cachedT.split('|');
      href.parent().css({'line-height':'1em', 'padding-bottom':'5px'});
      href.append('<br>'+cachedTs[2]);
      subjTiming.sec += ~~cachedTs[0];
      subjTiming.secFin += ~~cachedTs[1];
      c++;
    }
  });

  if (c === topicHrefs.length){
    var s = subjTiming.sec, f = subjTiming.secFin;
    $('div[class^="header"]').css('flex-flow', 'row wrap');
    $('h1[class^="title"]').after( $('<span>').css({'width':'100%','margin-top':'-50px','font-size':'1.4em'})
      .text( formatSeconds(s, f) ) );

    localStorage.setItem(location.pathname, s+'|'+f+'|'+formatSeconds(s,f));
  }
};


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
///////////////////  UTILITY FACTORIES & ASYNC FUNCTIONS  //////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// starts requests (one for video page, and one for YouTube API),
// parses them out, caches, and appends corresponding time labels to DOM in async
var fetchAndAppendVideoDurationLabel = function(lessonUrl, labelObject, moduleTimer){

  // if url is not a video lesson (eg, exercise or read material)
  if ( !(/\/v\//.test(lessonUrl)) ) {
    // just append empty time duration and continue to the next link
    labelObject.labelEl.text('[--:--]');
    labelObject.targetEl.append( labelObject.labelEl );
    moduleTimer.decSize(); // non-video lessons do not contribute to module time
    return ; // true - continue, false - break from $.each()
  }

  // check if lesson time duration is cached yet
  var cachedTd = localStorage.getItem(lessonUrl);
  if (cachedTd) {
      labelObject.labelEl.text( cachedTd.split('|')[1] );
      labelObject.targetEl.append( labelObject.labelEl );
      moduleTimer.addTime( ~~cachedTd.split('|')[0], labelObject.isPassed ? ~~cachedTd.split('|')[0] : 0 );
      console.log('Cached: (%s) %s', labelObject.title, cachedTd.split('|')[1]);
      return ;
  }

  var api = 'https://www.googleapis.com/youtube/v3/videos?id={id}&part=contentDetails&key={yek}';
  var h = 'cmQyAhWMshjc2Go8HAnmOWhzauSnIkBfBySazIA';

  // get lesson page html in async request (inside a worker)
  var lessonHtml = $.ajax({
    url: lessonUrl,
    datatype: 'html',
    labObj: labelObject,
    modTimer: moduleTimer
  })
  .done(function(htmlData){
    // get youtube video id
    var videoId = $($.parseHTML(htmlData))
      .filter('meta[property="og:video"]').attr('content').split('/').pop();

    // perform async YouTube API call to get video duration
    $.ajax({
      url: api.replace('\x7b\x69\x64\x7d', videoId)
          .replace('\x7b\x79\x65\x6b\x7d', h.split('').reverse().join('')),
      datatype: 'json',
      lObj: this.labObj,
      mTimer: this.modTimer,
      vLessonUrl: this.url,

      success: function(jsonResponse){

        var duration = jsonResponse.items[0]
          .contentDetails.duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
        var hours = (parseInt(duration[1]) || 0),
            minutes = (parseInt(duration[2]) || 0),
            seconds = (parseInt(duration[3]) || 0),
            totalSec = hours * 3600 + minutes * 60 + seconds,
            stamp = formatSeconds(totalSec);

        // attach cloned label to the DOM
        this.lObj.labelEl.text( stamp );
        this.lObj.targetEl.append( this.lObj.labelEl );

        // cache lesson time duration
        localStorage.setItem(this.vLessonUrl, totalSec+'|'+this.lObj.labelEl.text());
        console.log('(%s) %s. %s %s', this.mTimer.getLabel().title,
            this.mTimer.getCount(), this.lObj.title, stamp);

        // MODULE TIMING
        this.mTimer.addTime( totalSec, this.lObj.isPassed ? totalSec : 0);
      },
      error: function(data) { console.error('YouTube API error:\n%s', data); }
    }); // YouTube $.ajax():success
  }) // lesson $.ajax().done()
  .fail(function(){ console.error('Could not retrieve URL: %s', this.url); });
};  // fetchAndAppendVideoDurationLabel()


// factory (closure) for counting processed lessons (hrefs), cummulating module
// total time and attaching corresponding time label to DOM.
// Invoked for each topic module separately
var moduleTimerFactory = function(numberOfLessons, moduleLabelObj, topicTimer){
  var totalSeconds = 0,
      totalSecondsFinished = 0,
      lessonsCount = 0,
      moduleSize = numberOfLessons,
      mlObj = moduleLabelObj;

  // if its the last lesson link to process in the module, then
  // insert module (total) time label near module title (target)
  var checkAndAttachToDom = function(){
    if (lessonsCount >= moduleSize){
      mlObj.labelEl.text( formatSeconds(totalSeconds,totalSecondsFinished) );
      mlObj.targetEl.append( mlObj.labelEl );
      if (topicTimer) topicTimer.addTime(totalSeconds, totalSecondsFinished)
    }
  };

  return {
    // some lessons are not video lessons, so skip those and decrease size
    getCount: function(){ return lessonsCount; },
    getLabel: function(){ return moduleLabelObj; },
    decSize: function(){ moduleSize--; checkAndAttachToDom(); },
    addTime: function(seconds, secondsFinished) {
      totalSeconds += seconds;
      totalSecondsFinished += secondsFinished;
      lessonsCount++;
      checkAndAttachToDom();
    },
  };
};


// factory (closure) for counting modules, cummulating module
// total time and attaching corresponding time label to DOM.
// Invoked once during topic page processing
var topicTimerFactory = function(numberOfModules, targetEl){
  var topicSeconds = 0,
      topicSecondsFinished = 0,
      topicSize = numberOfModules,
      moduleCount = 0;

  // if its the last module to process in the topic, then
  // insert topic (total) time label in topic header title (targetEl)
  var checkAndAttachToDom = function(){
    if (moduleCount >= topicSize){
      console.log("Topic timing: %s", formatSeconds(topicSeconds, topicSecondsFinished));
      var timerStr = formatSeconds(topicSeconds,topicSecondsFinished);
      targetEl.text( timerStr );
      // update topic timer value in cache, to be used in processSubjectPage();
      localStorage.setItem(window.location.pathname, topicSeconds+'|'+topicSecondsFinished+'|'+timerStr);
    }
  };

  return{
    decSize: function(){ topicSize--; checkAndAttachToDom(); },
    addTime: function(seconds, secondsFinished) {
      topicSeconds += seconds;
      topicSecondsFinished += secondsFinished;
      moduleCount++;
      console.log("Module #%s %s", moduleCount, formatSeconds(seconds, secondsFinished));
      checkAndAttachToDom();
    }
  };
};

////////////////////////////////////////////////////////////////////////////////
// helper function to format number of seconds to label string to be displayed
var formatSeconds = function(seconds, secondsFinished){
  var hours = Math.floor(seconds/60/60),
      minutes = Math.floor(seconds/60) - hours*60;
  var totalStr = (hours ? ( String(hours).length>2 ? String(hours) : ('0'+hours).slice(-2)+':') : '') +
                 ('0'+minutes).slice(-2) +':'+ ('0'+seconds%60).slice(-2);

  var finishedStr = '';
  if (secondsFinished) {
    var fHours = Math.floor(secondsFinished/60/60),
        fMinutes = Math.floor(secondsFinished/60) - fHours*60,
        fSeconds = secondsFinished;
    // hourse, not fHourse, to force HH-zeros if no finished hours
    finishedStr = (hours?('0'+fHours).slice(-2)+':':'') + ('0'+fMinutes).slice(-2) +':'+ ('0'+fSeconds%60).slice(-2) + ' / ';
  }

  return '[' + finishedStr + totalStr + ']';
};


///////////////////////////////
///////////////////////////////
//// START THE WHOLE THING ////
///////////////////////////////
///////////////////////////////
startProcessing();

})();



// alternative to YouTube API:
// http://stackoverflow.com/questions/30084140/youtube-video-title-with-api-v3-without-api-key