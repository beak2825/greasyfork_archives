// ==UserScript==
// @name           Youtube Storyboard
// @namespace      hbb_works
// @description    mouse-over video thumbnail to preview video by cycling through the storyboard
// @version        1.3.1r1605101704
// @include        http://*youtube.com*
// @include        https://*youtube.com*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/3119/Youtube%20Storyboard.user.js
// @updateURL https://update.greasyfork.org/scripts/3119/Youtube%20Storyboard.meta.js
// ==/UserScript==


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