// ==UserScript==
// @name         YouTube - ALL in One
// @namespace    YouTube Player Controls
// @description  Fit video to window, set definition, repeat button, hide annotations, auto skip ads, pause at start/end. Remove Autoplay Space Button Pause Remove Recommended videos
// @version      1.1.2
// @author       Absolute
// @require      https://greasyfork.org/scripts/5679-wait-for-elements/code/Wait%20For%20Elements.js?4
// @require      https://code.jquery.com/jquery-3.1.0.slim.js
// @icon         https://youtube.com/favicon.ico
// @include      https*://www.youtube.com/*
///@run-at       document-end
// @grant 		 GM_getValue
// @grant 		 GM_setValue
// @grant        GM_addStyle

// @downloadURL https://update.greasyfork.org/scripts/24007/YouTube%20-%20ALL%20in%20One.user.js
// @updateURL https://update.greasyfork.org/scripts/24007/YouTube%20-%20ALL%20in%20One.meta.js
// ==/UserScript==


// @grant        GM_addStyle

GM_addStyle(`
.ytp-volume-panel {
  width: 52px;
  margin-right: 3px;
}
.ytp-big-mode .ytp-volume-panel {
  width: 78px;
  margin-right: 5px;
}
`);



   GM_addStyle('* .ytp-big-mode .ytp-volume-panel { width: 78px; margin-right: 5px; }');
   GM_addStyle('* .ytp-volume-panel { width: 52px; margin-right: 3px; }');

/*
  (function () { function Sound_Slider () {
   var css_1 = document.querySelector(".ytp-volume-panel");
   css_1.style.width = "52px";
   css_1.style.marginRight = "3px";
   var ccs_2 = document.querySelector(".ytp-big-mode .ytp-volume-panel");
   ccs_2.style.width = "78px";
   ccs_2.style.marginRight = "5px";   
   } window.addEventListener('readystatechange', Sound_Slider, true);
   }());
*/

  (function () { function DisableAutoplay() {
   setTimeout(function () { Click(); },1000);
   setTimeout(function () { Click(); },3000);
   setTimeout(function () { Click(); },5000);			
   } window.addEventListener('readystatechange', DisableAutoplay, true);
   function Click () {
   if (document.querySelector('#autoplay-checkbox').checked === true)   
   document.querySelector('#autoplay-checkbox').click();
   }}());


//==================================================================

// @name        Youtube Card Annotations Disable

   var checkExist = setInterval(function() {
   if ( $('.playing-mode').length ) {
   $('.ytp-settings-button').click();
   $('.ytp-settings-button').click();
   $('<style> .ytp-ce-element { display: none; } </style>').appendTo(document.head);
   $('.ytp-menuitem').click(function() {
   if ($(this).text().trim() === "Annotations") {
   if ($(this).attr('aria-checked') == 'true') {
   $('.ytp-ce-element').css('display', 'block');
   } else {
   $('.ytp-ce-element').css('display', 'none');
   }}});
   clearInterval(checkExist);
   }}, 1000);

//==================================================================

// @name    Space Button Pause

  (function (window, document, undefined) {
   var isToggled = false;
   var shouldToggle = false;
   var urlBuffer = '';
   var playBtn;
   window.setInterval(function () {
   if (isToggled && !/^http[sS]*\:\/\/www\.youtube\.com\/watch[?]*/.test(window.location.href) && shouldToggle) {
       shouldToggle = false;
       window.removeEventListener('keydown', bindSpaceKey, true);
   }
   if (!shouldToggle && /^http[sS]*\:\/\/www\.youtube\.com\/watch[?]*/.test(window.location.href)) {
   if (window.location.href !== urlBuffer) {
       isToggled = false;
       urlBuffer = urlBuffer;
       playBtn = document.querySelector('.ytp-play-button');
   if (playBtn) {
       window.addEventListener('keydown', bindSpaceKey, true);
   }}
	   shouldToggle = true;
   }}, 500);
   function bindSpaceKey(evt) {
   var inputs = document.querySelectorAll('input[type=text], textarea, div.yt-simplebox-text');
   inputs = Array.prototype.slice.apply(inputs);
   if (inputs.indexOf(document.activeElement) === - 1 && evt.keyCode === 32) {
       evt.preventDefault();
       playBtn.click();}
   }})(window, document);
   
//==================================================================

// @name    youtube spam videos - Remove Recommended Spam videos

   function removeHomeVideos () {
   var element = document.getElementById("feed");
   element.parentNode.removeChild(element);}

   function removeRecommendedVideos(){
   for(var nodeToRemove of document.getElementsByClassName("view-count")){
   if(isNaN(nodeToRemove.innerHTML.charAt(0))){
      nodeToRemove.parentNode.parentNode.parentNode.parentNode.removeChild(
      nodeToRemove.parentNode.parentNode.parentNode);
   }}}
   setInterval(function(){
   if(window.location.href == "https://www.youtube.com/") {
   if(document.getElementById("feed")){
      removeHomeVideos();
   }} else
   removeRecommendedVideos();
   }, 500);

//==================================================================

// @name    Get YouTube Thumbnail - Button

    document.addEventListener('spfdone', function(e) {
    addThumbnailButton();
    });
    addThumbnailButton();

    function addThumbnailButton() {
    var button = document.getElementById('viewThumbnailBtn');
    if (button)
        return;

    var container = document.getElementById('watch7-subscription-container');
    if (container) {
        button = document.createElement('button');
        button.id = 'viewThumbnailBtn';
        button.className = 'yt-uix-button yt-uix-button-default';
        button.style.cssText = 'height:24px; color:#666; font-weight:initial; margin-left:10px';
        button.textContent = 'View Thumbnail';
        button.onclick = function() {
        window.open(document.querySelector('link[itemprop="thumbnailUrl"]').href);
        };
        container.appendChild(button);
        }
        else if (window.location.href.indexOf('v=') > -1)
        setTimeout(addThumbnailButton, 500);
        }

//==================================================================

// @name        YouTube Obnoxious Bar Fix

   var div1 = document.getElementById('masthead-positioner');
   div1.style.position = 'static';
   var div2 = document.getElementById('masthead-positioner-height-offset');
   div2.style.height = '0px';

//==================================================================

// @name    Youtube Cleaner - Removes the recommendations from the main page of YouTube.

// All annotations
   annotations = document.getElementsByClassName("shelf-annotation shelf-title-annotation");
   for (i = 0; i < annotations.length; i++) {
    annotations[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display = "None";
   }
// Featured badge
   featured = document.getElementsByClassName("shelf-featured-badge");
   for (i = 0; i < featured.length; i++) {
   featured[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display = "None";
   }
// Try to disable auto-loading of the page
   document.getElementsByClassName("yt-uix-load-more")[0].setAttribute("data-uix-load-more-href", "");
   document.getElementsByClassName("yt-uix-load-more")[0].setAttribute("data-scrolldetect-callback", "");
   document.getElementsByClassName("yt-uix-load-more")[0].style.display="None";

//==================================================================

// @name    YouTube: Hide Channel Logo Annotation

   GM_addStyle(".branding-img-container {display: none;}");

//==================================================================

// @name    YouTube Playlist Time

   var SCRIPT_NAME = 'YouTube Playlist Time';
   var HOLDER_SELECTOR = '.pl-header-details';
   var TIMESTAMP_SELECTOR = '.timestamp';
   var TIME_CLASS = 'us-total-time';

   var util = {
   log: function () {
   var args = [].slice.call(arguments);
   args.unshift('%c' + SCRIPT_NAME + ':', 'font-weight: bold;color: #233c7b;');
   console.log.apply(console, args);
   },
   q: function(query, context) {
   return (context || document).querySelector(query);
   },
   qq: function(query, context) {
   return [].slice.call((context || document).querySelectorAll(query));
   },
   bindEvt: function(target, events) {
   events.forEach(function(evt) {
   target.addEventListener(evt[0], evt[1]);
   });},
   unbindEvt: function(target, events) {
   events.forEach(function(evt) {
      target.removeEventListener(evt[0], evt[1]);
   });},
   throttle: function(callback, limit) {
   var wait = false;
   return function() {
   if (!wait) {
       callback.apply(this, arguments);
       wait = true;
   setTimeout(function() {
       wait = false;
   }, limit);}};}};

   var calcTimeString = function(str) {
   return str.split(':').reverse().reduce(function(last, cur, idx) {
   cur = parseInt(cur, 10);
   switch(idx) {
   case 0:
        return last + cur;
   case 1:
        return last + cur * 60;
   case 2:
        return last + cur * 60 * 60;
   default:
        return 0;
   }},0);};

   var padTime = function(time) {
   return ("0" + time).slice(-2);
   };

   var setTime = function(seconds) {
   var loc = getTimeLoc();
   var hours = Math.floor(seconds / 60 / 60);
   seconds = seconds % (60 * 60);
   var minutes = Math.floor(seconds / 60);
   seconds = seconds % 60;
   loc.innerHTML = (((hours || '') && hours + ' hours ') + ((minutes || '') && minutes + ' minutes ') + ((seconds || '') && seconds + ' seconds')).trim();
   };

   var getTimeLoc = function() {
   var loc = util.q('.' + TIME_CLASS);
   if(!loc) {
   loc = util.q(HOLDER_SELECTOR).appendChild(document.createElement('li'));
   loc.className = TIME_CLASS;
   }
   return loc;
   };

   var timeLocExists = function() {
   return !!util.q('.' + TIME_CLASS);
   };

   var lastLength = 0;
   var calcTotalTime = function(force) {
   var timestamps = util.qq(TIMESTAMP_SELECTOR);
   if(!force && timestamps.length === lastLength && timeLocExists()) return;
   lastLength = timestamps.length;
   var totalSeconds = timestamps.reduce(function(total, ts) {
    return total + calcTimeString(ts.textContent.trim());
   }, 0);
   setTime(totalSeconds);
   };

   var events = [['mousemove', util.throttle(calcTotalTime.bind(null, false), 500)]];

   util.log('Started, waiting for playlist');

   waitForUrl(/^https:\/\/www\.youtube\.com\/playlist\?list=.+/, function() {
   var playlistUrl = location.href;
   var urlWaitId;
   var seconds = 0;
   util.log('Reached playlist, waiting for display area to load');
   waitForElems({
   sel: HOLDER_SELECTOR,
   stop: true,
   onmatch: function(holder) {
   util.log('display area loaded, calculating time.');
   util.bindEvt(window, events);
   calcTotalTime(true);
   urlWaitId = waitForUrl(function(url) {
   return url !== playlistUrl;
   }, function() {
   util.log('Leaving playlist, removing listeners');
   util.unbindEvt(window, events);
   }, true );}});});

//==================================================================















































































//==================================================================

// @name    Youtube Storyboard - mouse-over video thumbnail to preview video by cycling through the storyboard

const INTERVAL = 200; // default interval in milliseconds
var div;
var loader;
var animator;
var mousePos = { x: 0, y: 0 };

function dbg() {
    //console.log.apply(console, arguments);
}

function getPos(element) {
    var ref = document.body.getBoundingClientRect();
    var rel = element.getBoundingClientRect();
    return {
        left: rel.left - ref.left,
        top: rel.top - ref.top
    };
}

function setMousePos(event) {
    mousePos = { x: event.pageX, y: event.pageY };
}

(function init() {
    dbg("init youtube storyboard");
    document.addEventListener('mouseover', onMouseOver, false);
    loader = document.createElement('img');
    div = document.createElement('div');
    div.id = 'storyboardPlayer';
    div.style.display = 'none';
    div.style.position = 'absolute';
    div.style.zIndex = 99;
    var a = document.createElement('a');
    var innerDiv = document.createElement('div');
    innerDiv.style.height = '100%';
    innerDiv.style.width = '100%';
    a.appendChild(innerDiv);
    div.appendChild(a);
    document.getElementById('page') .appendChild(div);
    div.addEventListener('mouseout', function () {
        animator.stop();
    });
    
    document.addEventListener('mousemove', function (event) {
        setMousePos(event);
    });
})();

function onMouseOver(event) {
    setMousePos(event);
    var target = event.target;
    var src = target.src;
    if (target.nodeName == 'IMG' && src && (/default\.jpg/.exec(src) || /0\.jpg/.exec(src)))
    {
        if (animator) {
            animator.stop();
        }
        animator = new Animator(target);
        animator.getStoryboardSpecs(function () {
            animator.start();
        });
    }
}

var Animator = function (target) {
    this.id = Math.floor(Math.random() * 10000);
    dbg("new " + this.id);
    this.target = target;
    this.frame = 0;
    this.sheet = 0;
    this.interval = INTERVAL;
    this.src = target.src
    // get video id
    this.v = (/vi\/(.*?)\//.exec(this.src) || []) [1];
    if (this.v) {
        this.width = target.width;
        this.height = target.height;
    }
    var p = getPos(target);
    div.style.top = p.top + 'px';
    div.style.left = p.left + 'px';
    div.style.width = this.width + 'px';
    div.style.height = this.height + 'px';
    this.x = p.left;
    this.y = p.top;
    
    // adjustments for small thumbnails in list of related videos
    if (target.parentElement.classList.contains('yt-uix-simple-thumb-wrap')) {
        var spanHeight = target.parentElement.getBoundingClientRect().height;
        div.style.top = p.top + ((target.height - spanHeight) / 2) + 'px';
        div.style.height = spanHeight + 'px';
        this.height = spanHeight;
    }
    
    var parent = target.parentElement;
    while (parent.tagName != 'A') {
        parent = parent.parentElement;
    }
    div.children[0].href = parent.href;
    
    div.style.backgroundRepeat = 'no-repeat';
    div.style.backgroundPosition = 'center';
    div.style.backgroundSize = null;
    // loading indicator
    div.style.backgroundImage ='url(\'data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==\')';
    div.style.display = null;
};
Animator.prototype.parseSpec = function (storyboard_spec) {
    dbg("parseSpec " + this.id);
    var lines = storyboard_spec.split('|');
    var q;
    if (!this.quality) {
        this.quality = - 1;
        do {
            this.quality++;
            q = lines[this.quality + 1].split('#');
        } while (parseInt(q[0], 10) < this.width && this.quality + 2 < lines.length);
    }
    var q = lines[this.quality + 1].split('#');
    var s = {
        url: lines[0].replace('$L', this.quality) .replace('$N', q[6]),
        width: parseInt(q[0], 10),
        height: parseInt(q[1], 10),
        count: parseInt(q[2], 10),
        cols: parseInt(q[3], 10),
        rows: parseInt(q[4], 10),
        sigh: q[7]
    };
    s.sheetSize = s.cols * s.rows;
    s.sheetCount = ((s.count / s.sheetSize) | 0) + 1; // bitwise OR to loose decimals
    s.countOnLastSheet = ((s.count - 1) % s.sheetSize) + 1;
    return this.spec = s;
};
Animator.prototype.loadImage = function (callback) {
    dbg("loadImage " + this.id);
    var onLoad = (function () {
        div.style.backgroundImage = 'url(' + loader.src + ')';
        loader.removeEventListener('load', onLoad);
        callback.apply(this);
    }).bind(this);
    loader.addEventListener('load', onLoad);
    loader.src = this.spec.url.replace('$M', this.sheet) + '?sigh=' + this.spec.sigh;
};
Animator.prototype.getStoryboardSpecs = function (callback, fromWatch) {
    dbg("getStoryboardSpecs (fromWatch: " + fromWatch + ") " + this.id);
    this.xhr = new XMLHttpRequest();
    this.xhr.onload = (function () {
        if (this.isMouseOver()) {
            if (fromWatch) {
                var spec = (/"storyboard_spec":\s*(".*?")/.exec(this.xhr.responseText) || []) [1];
            }
            else {
                var spec = (/&storyboard_spec=(.*?)&/.exec(this.xhr.responseText) || []) [1];
            }
            if (spec) {
                if (fromWatch) {
                    spec = eval(spec); // remove backslashes
                }
                this.parseSpec(decodeURIComponent(spec));
                callback.apply(this);
            } 
            else if (!fromWatch) {
                this.getStoryboardSpecs(callback, true);
            }
            else {
                div.style.background = null;
            }
        }
        else {
            this.stop();
        }
    }).bind(this);
    if (fromWatch) {
        this.xhr.open('GET', '/watch?v=' + this.v, true);
    }
    else {
        this.xhr.open('GET', '/get_video_info?video_id=' + this.v, true);
    }
    this.xhr.send();
};
Animator.prototype.start = function () {
    dbg("start " + this.id);
    this.frame = 0;
    this.sheet = 0;
    var lastTick;
    var next = function () {
        dbg("next " + this.id + " token " + this.token);
        if (this.isMouseOver()) {
            if (this.spec.fit == 'height') {
                var w = this.spec.width * this.height / this.spec.height;
                var offset = (this.width - w) / 2;
                div.style.backgroundPosition = -((this.frame % this.spec.cols) * w - offset) + 'px ' +
                                               -(((this.frame / this.spec.cols) | 0) * this.height) + 'px'; // bitwise OR with 0 to loose decimals
            } 
            else {
                var h = this.spec.height * this.width / this.spec.width;
                var offset = (this.height - h) / 2;
                div.style.backgroundPosition = -((this.frame % this.spec.cols) * this.width) + 'px ' +
                                               -(((this.frame / this.spec.cols) | 0) * h - offset) + 'px';
            }
            this.frame++;
            if ((this.frame == this.spec.sheetSize) || (this.sheet == this.spec.sheetCount - 1 && this.frame == this.spec.countOnLastSheet))
            {
                clearInterval(this.token);
                dbg("clear " + this.id + " token " + this.token);
                this.loadImage(function () {
                    this.frame = 0;
                    this.sheet = (this.sheet + 1) % this.spec.sheetCount;
                    this.token = setInterval(next, this.interval);
                    dbg("set " + this.id + " token " + this.token);
                });
            }
        } 
        else {
            this.stop();
        }
    }.bind(this);
    
    this.loadImage(function () {
        if (this.isMouseOver()) {
            if ((this.width / this.height) <= (this.spec.width / this.spec.height)) {
                this.spec.fit = 'height';
                div.style.backgroundSize = ((this.spec.width * this.height / this.spec.height) * this.spec.cols) + 'px ' + 
                                           (this.height * this.spec.rows) + 'px';
            } 
            else {
                this.spec.fit = 'width';
                div.style.backgroundSize = (this.width * this.spec.cols) + 'px ' + 
                                           ((this.spec.height * this.width / this.spec.width) * this.spec.rows) + 'px';
            }
            this.token = setInterval(next, this.interval);
            dbg("set " + id + " token " + this.token);
        }
        else {
            this.stop();
        }
    });
};
Animator.prototype.stop = function () {
    dbg("stop " + this.id);
    if (!this.stopped) {
        clearInterval(this.token);
        dbg("clear " + this.id + " token " + this.token);
        div.style.display = 'none';
    }
    this.stopped = true;
};
Animator.prototype.isMouseOver = function () {
    return mousePos.x >= this.x && mousePos.x <= this.x + this.width && 
           mousePos.y >= this.y && mousePos.y <= this.y + this.height;
};

//==================================================================






/*
  (function () {
   function disableAutoplay() {
   setTimeout(function () {
   var checkbox = document.getElementById('autoplay-checkbox');
   if (checkbox && checkbox.checked === true) {
	   checkbox.click();
   }},3000);}
   window.addEventListener('readystatechange', disableAutoplay, true);
   }());
*/



//==================================================================

// @name    Autoplay Off
/*
  (function () { function DisableAutoplay() {
   setTimeout(function () { New_Function(); },1000);
   setTimeout(function () { New_Function(); },3000);
   setTimeout(function () { New_Function(); },5000);			
   } window.addEventListener('readystatechange', DisableAutoplay, true);
   function New_Function () {
   var checkbox = document.getElementById('autoplay-checkbox');
   if (checkbox.checked === true) { checkbox.click(); }  
   }}());

*/

///@run-at       document-start
///@include      https://www.youtube.com/watch*
///@include      https://www.youtube.com/playlist*
///@match        *://www.youtube.com/*/
///@exclude      *://www.youtube.com/user/*
///@exclude      *://www.youtube.com/channel/*
///@exclude      *://www.youtube.com/tv*
///@exclude      *://www.youtube.com/embed/*
