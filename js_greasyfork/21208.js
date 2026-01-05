// ==UserScript==
// @name         C2B-UT
// @namespace    http://your.homepage/
// @version      0.1
// @description  my youtube panel and hotkeys script (beta version) Work in progress!!
// @author       Connect2Begin@gmail.com
// @match        https://www.youtube.com/watch
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21208/C2B-UT.user.js
// @updateURL https://update.greasyfork.org/scripts/21208/C2B-UT.meta.js
// ==/UserScript==

// match        https://www.youtube.com/user/kvn/videos

debugger;
//window.asdfasdf = 12341234;
//window.onfocus = function(){
//    console.log(111122);
//}
//var parent = document.body || document.head || document.documentElement;
//var q = document.createElement('div');
//q.className = "aaaa";
//q.innerHTML = `
//<div style="position:fixed;cursor: pointer;right:0;top: 50px;background: #929292;color: black;min-height:10px;min-width:10px;z-index: 99;padding: 2px;list-style-type: disc;list-style-position: outside;">
//asdfasdfasdf
//</div>
//`
//parent.appendChild(q);

function closest(self, selector) {
    if (!self) return null;
    for(var p=self.parentNode; p!=null; p=p.parentNode)
        if (p.className && ~p.className.split(' ').indexOf(selector))
            return p;
   	return null;
}
function closestType(self, selector) {
    if (!self) return null;
    for(var p=self.parentNode; p!=null; p=p.parentNode)
        if (p.type == selector || p.nodeName == selector.toUpperCase())
            return p;
   	return null;
}
function closestId(self, selector) {
    if (!self) return null;
    for(var p=self.parentNode; p!=null; p=p.parentNode)
        if (p.getAttribute && p.getAttribute('id') == selector)
            return p;
   	return null;
}
function getOffset( el, abs=false ) {
    var _x = 0;
    var _y = 0;
    var _el = el;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    if (!abs) {
        _y += document.body.scrollTop;
        _x += document.body.scrollLeft;
    }
    return { top: _y, left: _x, height: _el.offsetHeight, width: _el.offsetWidth, bottom: _y+_el.offsetHeight, right: _x+_el.offsetWidth };
}
var OFFS = 50;
var OFFSbot = 120;
function onScreen(i, abs=false){
    //var p = getOffset(i, false);
    var p = getOffset(i, true);
    //p.top -= document.body.scrollTop;
    //return p.top >= OFFS && p.top+i.clientHeight <= document.body.clientHeight-OFFS+2; // +2 for precision errors
    var h = i.clientHeight;
    var H = document.body.clientHeight;
    //if (abs) return p.top >= 0 && p.top + i.offsetHeight <= H;
    return !(p.top > H || p.bottom < 0);
    
    if (abs) return !(p.top > H || p.bottom < 0);
    
    var d = Math.min(p.top+h, H-OFFS+2) - Math.max(p.top,OFFS);
    //return d >= h*0.6 || d >= H*0.7;
    return !(d >= h*0.6 || d >= H*0.7);
}
function toScreen(i){
    //var p = getOffset(i, false);
    debugger;
    var p = getOffset(i, true);
    //p.top -= document.body.scrollTop;
    //if (p.top >= OFFS && p.top+i.clientHeight <= document.body.clientHeight-OFFS) return; // alr!
    var h = i.clientHeight;
    var H = document.body.clientHeight;
    if (p.top+h > H-OFFS) // lower
        document.body.scrollTop += p.top+h - (H-OFFS);
    else if (p.top < OFFS*2)
        document.body.scrollTop += p.top - OFFS*2;
    return;
    
    var a = getOffset(i);
    if (p.top+i.clientHeight > document.body.clientHeight-OFFS) // lower
        document.body.scrollTop = a.top+i.clientHeight - document.body.clientHeight + OFFS + OFFSbot;
    else
        document.body.scrollTop = a.top - OFFS*2;
}
function beep() {
    var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");  
    snd.play();
}
function findAncestor (el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
}
function getDescendantWithClass(element, clName) {
    var children = element.childNodes;
    for (var i = 0; i < children.length; i++)
        if (children[i].className &&
            children[i].className.split(' ').indexOf(clName) >= 0)
            return children[i];
    for (var i = 0; i < children.length; i++) {
        var match = getDescendantWithClass(children[i], clName);
        if (match !== null)
            return match;
    }
    return null;
}
function getCookie(name) {
  var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
function setCookie(name, value, options) {
  options = options || {};
  var expires = options.expires;
  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires * 1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString)
    options.expires = expires.toUTCString();
  value = encodeURIComponent(value);
  var updatedCookie = name + "=" + value;
  for (var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];
    if (propValue !== true)
      updatedCookie += "=" + propValue;
  }
  document.cookie = updatedCookie;
}
function cleanArray(arr) {
    for (var i=0; i < arr.length; i++)
        if (!arr[i]) {
            arr.splice(i, 1);
            i--;
        }
    return arr;
}
function isInput() {
    if (!document.activeElement) return false;
    return ~['TEXTAREA','INPUT'].indexOf(document.activeElement.tagName) || (document.activeElement.className && ~['comment-simplebox-text'].indexOf(document.activeElement.className));
}
//yt-uix-button yt-uix-button-size-default yt-uix-button-default load-more-button yt-uix-load-more comment-section-renderer-paginator yt-uix-sessionlink yt-uix-load-more-loading
//yt-uix-button-content
//load-more-loading
//yt-spinner
//yt-uix-button yt-uix-button-size-default yt-uix-button-default load-more-button yt-uix-load-more comment-section-renderer-paginator yt-uix-sessionlink
loader = {
	prev_count: -1,
	count: -1,
	changed: Number.MAX_VALUE,
	delay: 500, // ms
	wait: 19000, // ms
	over: 20000, // ms
	_timeout: null,
	_update: null,
	_check: null,
    _stop: false,
    scroll: 0,
    find: function(query, _filter){
        var q = document.getElementsByClassName(query); 
        q = Array.prototype.filter.call(q, function(i){ return i.offsetParent });
        if (_filter) q = Array.prototype.filter.call(q, _filter);
        return q; },
    texts: function(over){
        //var a = loader.find('load-more-text', function(i){ return i.offsetParent });
        //console.log('init loading of all texts...', a.length);
        //for(var i=0; i<a.length; i++) a[i].click();
        var a = loader.find('yt-uix-button-content', function(i){ return /^(Читать дальше)|(Read more)$/.test(i.textContent) });
        console.log('init loading of all texts...', a.length);
        for(var i=0; i<a.length; i++) a[i].click();
        //for(var i=0; i<a.length; i++)
        //    if (a[i].offsetParent != null && /^(Читать дальше)|(Read more)$/.test(a[i].textContent)) a[i].click();
        loader.scroll = Math.max(loader.scroll, getOffset(loader.find('comment-section-renderer-items')[0]).top - 200);
        window.scrollTo(0,loader.scroll);
        video.stopped(); // ui handler =)
        if (loader._stop) alert('stopped!');
        else alert(over?'timeout!':'done!'); },
    btn: function(_main = false){
        if (_main) return loader.find('comment-section-renderer-paginator')[0];
        var q = loader.find('yt-uix-load-more');
        if (q.length) q = q.filter(function(i){ return !~i.className.indexOf('comment-section-renderer-paginator') });
        if (q.length) return q[0];
        return loader.find('comment-section-renderer-paginator')[0]; },
        //return loader.find('yt-uix-load-more')[0]; },
        //return loader.find('yt-uix-load-more', function(i){return i.className.indexOf('yt-uix-button-link') == -1})[0]; },
	loaded: function(){
        return !loader.btn(true); },
	timeout: function(silent){
		clearTimeout(loader._timeout); loader._timeout = null;
		clearInterval(loader._update); loader._update = null;
		loader.changed = Number.MAX_VALUE;
		loader.prev_count = -1;
		loader.count = -1;
		if (!silent) console.log('loader timeout!');
		loader.texts(true); 
        loader._stop = false; 
        video.stopped(); // (double) call ui handler =)
    },
	reset_timeout: function(){
		clearTimeout(loader._timeout);
		loader._timeout = setTimeout(loader.timeout, loader.over); },
	update: function(){
		var c = loader.find('comment-thread-renderer').length;
        window.scrollTo(0,document.body.scrollHeight);
		console.log(c);
		if (c != loader.count) {
			console.log('changed ' + loader.count + ' to ' + c);
			loader.count = c;
			loader.changed = +new Date;
			loader.reset_timeout(); }
		else if (loader._stop || (+new Date - loader.changed >= loader.wait) && loader.loaded()) {
			loader.reset_timeout();
			window.scrollTo(0,document.body.scrollHeight);
			if (loader.loaded() || loader._stop || c == loader.prev_count) {
				console.log('all pages are loaded!', c);
				loader.timeout(true); }
			else {
				console.log('load next page...');
				loader.btn().click();
				loader.prev_count = c;
				loader.changed = +new Date; }}
		else if (!loader.loaded())
            loader.btn().click(); },
	start: function(){
        if (loader._update) {
            console.log('alr inp!');
            return; }
        console.log('start loading pages!');
		loader._update = setInterval(loader.update, loader.delay);
		loader._timeout = setTimeout(loader.timeout, loader.over);
        loader.scroll = document.body.scrollTop;
		window.scrollTo(0,document.body.scrollHeight);
        video.started(); // ui handler =)
        if (loader.btn())
            loader.btn().click();
    },
	stop: function(){
        if (loader._stop)
            console.log('alr stopping...');
        else
            console.log('stopping...');
        loader._stop = true; },
    start_stop: function(){
        if (loader._update)
            loader.stop();
        else
            loader.start();
    }
}

video = {
    panel: function(){
        var q = document.getElementsByClassName('mUTP')[0];
        if (!q) q = video.createPanel();
        return q;
    },
    createPanel: function(){
        var q = document.createElement('div');
        var p = document.getElementById('page-container');
        q.className = "mUTP";
        q.innerHTML = `
<div style="position:fixed;cursor: pointer;right:0;top: 50px;background: #929292;color: black;min-height:10px;min-width:10px;z-index: 99;padding: 2px;list-style-type: disc;list-style-position: outside;">
<form id="myUTE" style="
    position: absolute;
    left: 0;
    top: 0;
    transform: translateX(-100%);
    width: 200px;
    height: calc(100% - 20px);
    background: #6D6D6D;
    padding: 10px;
    visibility: hidden;
">
 <textarea type="text" name="firstname" style="
    /* margin: 7px; */
    width: calc(100% - 4px);
    height: calc(100% - 38px);
    margin-bottom: 5px;
    color: black !important;
"></textarea>
	<button onclick="video.favsClose()" style="font-size: 22px; line-height: 19px;"
			class="yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-button-empty yt-uix-tooltip"
			type="button" aria-pressed="false" aria-haspopup="true" data-tooltip-text="Закрыть без сохранения"
			aria-labelledby="yt-uix-tooltip222-arialabel">✘
	</button>
	<button onclick="video.favsSave()"
			style="font-size: 22px;line-height: 19px;width: 155px;margin-left: 6px;margin-right: -10px;"
			class="yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-button-empty yt-uix-tooltip"
			type="button" aria-pressed="false" aria-haspopup="true" data-tooltip-text="Сохранить"
			aria-labelledby="yt-uix-tooltip222-arialabel">✔
	</button>
</form>
<div id="myUTad"
	 style="position: absolute;left: 0px;top: 0px;transform: translateX(-100%);padding: 8px 10px;visibility: hidden;background: rgb(51, 255, 0);">
	Добавлено!
</div>
<div id="myUTre"
	 style="position: absolute;left: 0px;top: 0px;transform: translateX(-100%);padding: 8px 10px;visibility: hidden;background: rgb(255, 118, 118);">
	Удалено!
</div>
	<div style="
    padding: 0px 5px;
    background: rgba(122, 0, 255, 0.25);
">
		<div style="
    border-bottom: 1px rgba(0, 0, 0, 0.25) solid;
    color: white;
" onclick="video.onHeader(0)" oncontextmenu="video.onPrev(0)">✎ я
		</div>
		<div id="mUTC" style="
    position: absolute;
    right: 0;
    top: 0;
    margin: 3px 7px;
    color: rgba(255, 255, 255, 0.22);
    pointer-events: none;
">-
		</div>
		<div onclick="video.onLine(0,0)" oncontextmenu="video.onPrev(0,0)">
			<div>ветка:<span id="mUT00" style="
    font-weight: bold;
    margin-left: 3px;
    float: right;
">-</span>
			</div>
		</div>
		<div onclick="video.onLine(0,1)" oncontextmenu="video.onPrev(0,1)">
			<div>ответ:<span id="mUT01" style="
    font-weight: bold;
    margin-left: 3px;
    float: right;
">-</span>
			</div>
		</div>
	</div>
	<div style="
    padding: 0px 5px;
    background: rgba(0, 255, 0, 0.25);
">
		<div style="
    border-bottom: 1px rgba(0, 0, 0, 0.25) solid;
    color: white; position: relative;
            " onclick="video.onHeader(1)" oncontextmenu="video.onPrev(1)"><span>★ избр.</span>

			<div id="mUTF" style="
    position: absolute;
    right: 0;
    top: 0;
    margin: 1px -4px 1px 0px;
    padding: 0 5px;
    color: rgba(255, 255, 255, 0.22);
" onclick="video.editFavs()" class="yt-uix-button-size-default yt-uix-button-default yt-uix-button-empty yt-uix-tooltip"
				 type="button" aria-pressed="false" aria-haspopup="true" data-tooltip-text="Избранное"
				 aria-labelledby="yt-uix-tooltip45-arialabel" title="Избранное">-
			</div>
		</div>
		<div onclick="video.onLine(1,0)" oncontextmenu="video.onPrev(1,0)">
			<div>ветка:<span id="mUT10" style="
    font-weight: bold;
    margin-left: 3px;
    float: right;
">-</span>
			</div>
		</div>
		<div onclick="video.onLine(1,1)" oncontextmenu="video.onPrev(1,1)">
			<div>ответ:<span id="mUT11" style="
    font-weight: bold;
    margin-left: 3px;
    float: right;
">-</span>
			</div>
		</div>
	</div>
	<div style="
    padding: 0px 5px;
    background: rgba(255, 224, 0, 0.25);
">
		<div style="
    border-bottom: 1px rgba(0, 0, 0, 0.25) solid;
    color: white;
" onclick="video.onHeader(2)" oncontextmenu="video.onPrev(3)">♡ лайк
		</div>
		<div onclick="video.onLine(2,0)" oncontextmenu="video.onPrev(2,0)">
			<div>ветка:<span id="mUT20" style="
    font-weight: bold;
    margin-left: 3px;
    float: right;
">-</span>
			</div>
		</div>
		<div onclick="video.onLine(2,1)" oncontextmenu="video.onPrev(2,1)">
			<div>ответ:<span id="mUT21" style="
    font-weight: bold;
    margin-left: 3px;
    float: right;
">-</span>
			</div>
		</div>
	</div>
	<div style="
    padding: 0px 5px;
">
		<div style="
    border-bottom: 1px rgba(0, 0, 0, 0.25) solid;
    color: white;
" onclick="video.onHeader(3)" oncontextmenu="video.onPrev(2)">☺ прочие
		</div>
		<div onclick="video.onLine(3,0)" oncontextmenu="video.onPrev(3,0)">
			<div>ветка:<span id="mUT30" style="
    font-weight: bold;
    margin-left: 3px;
    float: right;
">-</span>
			</div>
		</div>
		<div onclick="video.onLine(3,1)" oncontextmenu="video.onPrev(3,1)">
			<div>ответ:<span id="mUT31" style="
    font-weight: bold;
    margin-left: 3px;
    float: right;
">-</span>
			</div>
		</div>
	</div>

	<div style="
    padding: 7px 5px 5px 5px;
            ">
		<button onclick="video.start()" style="font-size: 22px; line-height: 19px;"
				class="yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-button-empty yt-uix-tooltip"
				type="button" aria-pressed="false" aria-haspopup="true" data-tooltip-text="Загрузить (f9)"
				aria-labelledby="yt-uix-tooltip174-arialabel">⟳
		</button>
		<button onclick="video.parse()" style="font-size: 22px; line-height: 19px;"
				class="yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-button-empty yt-uix-tooltip"
				type="button" aria-pressed="false" aria-haspopup="true" data-tooltip-text="Повторный анализ И сортировка (f10)"
				aria-labelledby="yt-uix-tooltip25-arialabel">⚑
		</button>
		<!--♻⚑♺⚐✔ ✇☢∎⛔ http://xahlee.info/comp/unicode_transport_and_map_symbols.html -->
<br>
<button onclick="video.leaveLong()"
		style="font-size: 12px;line-height: 13px;max-height: 14px;padding: 0 16.6px;margin-top: 3px;"
		class="yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-button-empty yt-uix-tooltip"
		type="button" aria-pressed="false" aria-haspopup="true" data-tooltip-text="Оставить только длинные 20 мин (F2)"
		aria-labelledby="yt-uix-tooltip48-arialabel">⌛
</button>
<button onclick="video.removeWatched()"
		style="font-size: 12px;line-height: 13px;max-height: 14px;padding: 0 12.2px;margin-left: 0.2px;margin-top: 3px;"
		class="yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-button-empty yt-uix-tooltip"
		type="button" aria-pressed="false" aria-haspopup="true" data-tooltip-text="Убрать просмотренные (Shift+F2)"
		aria-labelledby="yt-uix-tooltip48-arialabel">✂
</button>
	</div>
	<div id="mUTS" style="
    font-size: 22px;
    line-height: 19px;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.73);
    visibility: hidden;
">
		<button onclick="video.stop()"
				style="font-size: 42px;/* line-height: 19px; */position: absolute;left: 0;top: 0;width: calc(100% - 40px);height: calc(100% - 40px);margin: 20px;"
				class="yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-button-empty yt-uix-tooltip"
				type="button" aria-pressed="false" aria-haspopup="true" data-tooltip-text="Остановить загрузку"
				aria-labelledby="yt-uix-tooltip174-arialabel">
			<div style="
    transform: rotate(-90deg) translate3d(-150%,0,0);
    transform-origin: center center;
">
				<div id="mUTA" style="transform: rotate(0deg) translateY(-6px); display: inline-block; transform-origin: 52% 32%; font-size: 28px;">⌛</div>
<div style="
    transform: translate(10px,-5px);
    display: inline-block;
">стоп</div>
			</div>
		</button>
	</div>
</div>
`;
        q.children[0].style.top = p.offsetTop+"px";
        p.appendChild(q);
        video.initStart();
        video.registerClickHandler();
        //video.favs = JSON.parse(getCookie('myUTfavs') || '[]');
        var fv = document.getElementById('mUTF');
        fv.innerText = video.favs.length;
        return q;
    },
    initTimer: null,
    initCount: -1,
    initHandler: function(){
        var q = document.getElementsByClassName('comment-section-renderer-items')[0];
        if (!q) return; // still not loaded
        var c = q.children.length;
        if (c != video.initCount) {
            video.initCount = c;
            return; } // some loaded, wait 4 more
        // done loading
        //debugger;
        clearInterval(video.initTimer);
        video.initTimer = null;
        if (!loader._update) // not loading now?
            video.parse(null,true,true); // silent 1st time parse
    },
    initStart: function(){
        video.initTimer = setInterval(video.initHandler, 1000);
    },
    dom: null,
    current: null,
    animTimer: null,
    animValue: null,
    animStart: function(){
        video.animValue = 0;
        video.animTimer = setInterval(video.animHandler,10);
    },
    animStop: function(){
        clearInterval(video.animTimer);
        video.animTimer = null;
    },
    animHandler: function(){
        video.animValue += 3;
        var a = document.getElementById('mUTA');
        a.style.transform = 'rotate('+video.animValue+'deg) translateY(-6px)';
    },
    adornment: function(i, n,j){
        if (n == null) {
            i.style['background'] = '';
            if (!j) { // branch:
                i.nextElementSibling.style['border-left'] = '';
                i.nextElementSibling.style['padding-left'] = ''; }
            return;
        }
        //var clr = ['rgba(122, 0, 255, 0.25)', 'rgba(0, 255, 0, 0.25)', 'rgba(255, 224, 0, 0.25)'];
        var clr = ['rgba(122, 0, 255, 0.16)', 'rgba(0, 255, 0, 0.16)', 'rgba(255, 197, 0, 0.16)'];
        i.style['background'] = clr[n];
        if (!j) { // branch:
            i.nextElementSibling.style['border-left'] = '4px '+clr[n]+' solid';
            i.nextElementSibling.style['padding-left'] = '6px'; }
    },
    likesAdornment: function(q) {
        // likes progressbars:
        //debugger;
        for(var i in q){
            var j = q[i];
            var c = j.querySelector('.comment-renderer-like-count.on');
            if (!c || !c.offsetParent)
                c = j.querySelector('.comment-renderer-like-count.off');
            if (c && c.offsetParent) {
                var n = +c.innerText;
                var b = j.querySelector('.mutpb');
                if (!b) {
                    b = document.createElement('div');
                    /* b.innerHtml = `<div class="mutpb" style="
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    width: 0%;
    pointer-events: none;
    background: rgba(255, 0, 0, 0.68);
"></div>`; */
                    b.className = 'mutpb';
                    b.style.position = 'absolute';
                    b.style.bottom = '0';
                    b.style.left = '0';
                    b.style.height = '2px';
                    b.style.width = '0%';
                    b.style['pointer-events'] = 'none';
                    b.style.background = 'rgba(255, 0, 0, 0.68)';
                    j.insertBefore(b, j.firstChild);
                    //b = b.firstChild;
                }
                var l = '255,0,0';
                var x = 1000;
                if (n <= 50){ x = 50; l = '255,255,0'; }
                else if (n <= 100){ x = 100; l = '0,255,0'; }
                b.style.background = 'rgba(' + l + ', 0.68)';
                b.style.width = n * 100.0 / x + '%';
                j.style.position = 'relative';
            }
        }
    },
    delayParseTimer: null,
    delayParseThrottle: 0,
    delayParseCount: -1,
    delayParseCount0: -1,
    delayParseCounter: -1,
    delayParseCounterINIT: 100, // 100 ms * 100 = 10 sec
    delayParseCounterMAX: 10, // 100 ms * 10 = 1 sec
    delayParseFunction: null,
    delayParseHandler: function(){
        var c = video.delayParseCount;
        video.delayParseCount = video.delayParseFunction();
        if (c == video.delayParseCount) {
            var max = video.delayParseCounterMAX;
            if (c == video.delayParseCount0) max = video.delayParseCounterINIT;
            if (++video.delayParseCounter > max) {
                console.log('delayParseHandler --- timeout!', max);
                clearInterval(video.delayParseTimer);
                video.delayParseTimer = null;
                // operate:
                video.parse(true, true, true);
            }
        } else { 
            console.log('delayParseHandler --- reset counter', c, video.delayParseCounter);
            video.delayParseCounter = 0; } // reset counter
        // continue waiting
    },
    delayParse: function(counter){
        if (video.delayParseTimer) clearInterval(video.delayParseTimer);
        video.delayParseFunction = counter;
        video.delayParseThrottle = 0;
        video.delayParseCounter = 0;
        video.delayParseCount0 = video.delayParseCount = video.delayParseFunction();
        video.delayParseTimer = setInterval(video.delayParseHandler, 100);
        console.log('delayParseHandler --- start');
    },
    parse: function(force, silent, noReorder){
        //debugger;
        var pause = document.getElementById('mUTS');
        var was = pause.style.visibility == 'visible';
        console.log('video.parse', was);
        if (!was) {
            //pause.style.visibility = 'visible';
            //pause.children[0].style.visibility = 'hidden'; 
        }
        
        var bd = document.getElementById('watch-discussion');
        if (bd.children[0].children[0].className == 'action-panel-loading') {
            window.scrollTo(0, getOffset(bd).top - 200);
            setTimeout(video.parse, 200);
            return; // wait 4 loading
        }
        
        if (!was && force) {
            setTimeout(function(){video.parse(false, silent, noReorder)}, 100);
            return; // allow ui redraw
        }
        
        video.dom = {0:{0:[],1:[]}, 1:{0:[],1:[]}, 2:{0:[],1:[]}, 3:{0:[],1:[]}};
        var me = document.getElementsByClassName('yt-masthead-picker-name')[0].textContent;
        var favs = video.favs;
        var root = function(i){ return ~i.parentNode.className.indexOf("comment-thread-renderer") };
        var my = function(i){ return i.getAttribute('data-author-name') == me };
        var fv = function(i){ return favs.indexOf(i.getAttribute('data-author-name')) != -1 };
        var n0 = function(i){ return video.dom[0][0].indexOf(i) == -1 && video.dom[1][0].indexOf(i) == -1 };
        var n1 = function(i){ return video.dom[0][1].indexOf(i) == -1 && video.dom[1][1].indexOf(i) == -1 };
        var lk = function(i){ return i.getAttribute('data-action-on') == 1 };
        var lroot = function(i){ return i.parentNode.parentNode.parentNode.parentNode.className == "comment-thread-renderer" };
        video.dom[0][0] = loader.find('comment-renderer', function(i){return my(i) && root(i)});
        video.dom[0][1] = loader.find('comment-renderer', function(i){return my(i) && !root(i)});
        video.dom[1][0] = loader.find('comment-renderer', function(i){return fv(i) && root(i)});
        video.dom[1][1] = loader.find('comment-renderer', function(i){return fv(i) && !root(i)});
        video.dom[2][0] = loader.find('comment-renderer liked', function(i){return root(i)});
        video.dom[2][1] = loader.find('comment-renderer liked', function(i){return !root(i)});
        video.dom[3][0] = loader.find('comment-renderer', function(i){return n0(i) && root(i)});
        video.dom[3][1] = loader.find('comment-renderer', function(i){return n1(i) && !root(i)});
        //video.dom[3][0] = loader.find('sprite-like', function(i){return lk(i) && lroot(i)});
        //video.dom[3][1] = loader.find('sprite-like', function(i){return lk(i) && !lroot(i)});
        document.getElementById('mUT00').innerText = video.dom[0][0].length;
        document.getElementById('mUT01').innerText = video.dom[0][1].length;
        document.getElementById('mUT10').innerText = video.dom[1][0].length;
        document.getElementById('mUT11').innerText = video.dom[1][1].length;
        document.getElementById('mUT20').innerText = video.dom[2][0].length;
        document.getElementById('mUT21').innerText = video.dom[2][1].length;
        document.getElementById('mUT30').innerText = video.dom[3][0].length;
        document.getElementById('mUT31').innerText = video.dom[3][1].length;
        
        // resort
        var p = document.getElementsByClassName('comment-section-renderer-items')[0];
        var q = null;
        var f = function(n,j){
            var c = video.dom[n][j];
            for(var i=0; i<c.length; i++) {
                //var v = c[i].parentNode;
                //if (j) v = v.parentNode.parentNode.parentNode;
                var v = closest(c[i],'comment-thread-renderer');
                
                // order
                if (!noReorder) {
                    if (!q) {
                        if (p.children[1] != v) p.insertBefore(v, p.children[1]); }
                    else if (q.nextElementSibling != v) p.insertBefore(v, q.nextElementSibling); 
                }
                q = v;
                
                // adornment
                video.adornment(c[i],n,j);
                //var clr = ['rgba(122, 0, 255, 0.25)', 'rgba(0, 255, 0, 0.25)', 'rgba(255, 224, 0, 0.25)'];
//                var clr = ['rgba(122, 0, 255, 0.16)', 'rgba(0, 255, 0, 0.16)', 'rgba(255, 197, 0, 0.16)'];
//                c[i].style['background'] = clr[n];
//                if (!j) { // branch:
//                    c[i].nextElementSibling.style['border-left'] = '4px '+clr[n]+' solid';
//                    c[i].nextElementSibling.style['padding-left'] = '6px'; }
            }
        }
        f(0,0);
        f(0,1);
        f(1,0);
        f(1,1);
        f(2,0);
        f(2,1);
        
        // likes progressbars:
        //debugger;
        q = loader.find('comment-renderer-footer');
        video.likesAdornment(q);
/* b.innerHtml = `<div class="mutpb" style="
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    width: 0%;
    pointer-events: none;
    background: rgba(255, 0, 0, 0.68);
"></div>`; */
/*        for(var i in q){
            var j = q[i];
            var c = j.querySelector('.comment-renderer-like-count.on');
            if (!c || !c.offsetParent)
                c = j.querySelector('.comment-renderer-like-count.off');
            if (c && c.offsetParent) {
                var n = +c.innerText;
                var b = j.querySelector('.mutpb');
                if (!b) {
                    b = document.createElement('div');
                    b.className = 'mutpb';
                    b.style.position = 'absolute';
                    b.style.bottom = '0';
                    b.style.left = '0';
                    b.style.height = '2px';
                    b.style.width = '0%';
                    b.style['pointer-events'] = 'none';
                    b.style.background = 'rgba(255, 0, 0, 0.68)';
                    j.insertBefore(b, j.firstChild);
                    //b = b.firstChild;
                }
                var l = '255,0,0';
                var x = 1000;
                if (n <= 50){ x = 50; l = '255,255,0'; }
                else if (n <= 100){ x = 100; l = '0,255,0'; }
                b.style.background = 'rgba(' + l + ', 0.68)';
                b.style.width = n * 100.0 / x + '%';
                j.style.position = 'relative';
            }
        }*/
        
        if (!was){
            console.log('video.parse - restore visibility');
            debugger;
            //pause.children[0].style.visibility = 'hidden';
            //pause.style.visibility = 'hidden'; // done!
        }
        console.log('parsed.');
        
        //document.getElementById('movie_player').focus(); // focus bug fix        
        
//        video.dom[0][0] = loader.find('comment-renderer', function(i){return i.getAttribute('data-author-name') == me && i.parentNode.className == "comment-thread-renderer"});
//        video.dom[0][1] = loader.find('comment-renderer', function(i){return i.getAttribute('data-author-name') == me && i.parentNode.className != "comment-thread-renderer"});
//        video.dom[1][0] = loader.find('comment-renderer', function(i){return favs.indexOf(i.getAttribute('data-author-name')) != -1 && i.parentNode.className == "comment-thread-renderer"});
//        video.dom[1][1] = loader.find('comment-renderer', function(i){return favs.indexOf(i.getAttribute('data-author-name')) != -1 && i.parentNode.className != "comment-thread-renderer"});
//        video.dom[2][0] = loader.find('comment-renderer', function(i){return video.dom[0][0].indexOf(i) == -1 && video.dom[1][0].indexOf(i) == -1 && i.parentNode.className == "comment-thread-renderer"});
//        video.dom[2][1] = loader.find('comment-renderer', function(i){return video.dom[0][1].indexOf(i) == -1 && video.dom[1][1].indexOf(i) == -1 && i.parentNode.className != "comment-thread-renderer"});
        
//        loader.find('comment-renderer')[0].getAttribute('data-author-name')
        //...
    },
    get: function(g,l) {
        if (!video.dom) parse();
        var q = video.dom[g];
        if (!q) return null;
        return l != null ? q[l] : q;
    },
    onHeader: function(g) {
        var i = video.dom[g][0][0];
        var j = video.dom[g][1][0];
        if (!i && j)  i = j;
        else if (i && j && getOffset(i).top > getOffset(j).top) i = j;
        if (i) toScreen(i);
        video.setCurrent(i);
        document.getElementById('mUTC').innerText = i ? '0' : "-";
    },
    setCurrent: function(cur) {
        if (!cur) {
            beep(); // none!
            if (video.current) {
                video.current.style['border-left'] = '';
                video.current.style['padding-left'] = '';
            }
            video.current = null;
        } else {
            toScreen(cur);
            if (video.current) {
                video.current.style['border-left'] = '';
                video.current.style['padding-left'] = '';
            }
            video.current = cur;
            video.current.style['border-left'] = '6px orange solid';
            video.current.style['padding-left'] = '6px';
        }
    },
    setCur: function(cur,col) {
        if (!~cur || cur==null)
            video.setCurrent();
        else
            video.setCurrent(col[cur]);
        document.getElementById('mUTC').innerText = !~cur ? "-" : (cur+1)+'/'+col.length;
    },
    onPrev: function(g,l) {
        video.onPrev.caller.arguments[0].preventDefault();
        var col = video.dom[g][l];
        var cur = col.indexOf(video.current);
        if (~cur && !onScreen(video.current)) cur = -1; // cur is off screen!
        if (~cur) {
            if (--cur < 0) {
                cur = col.length-1;
                beep(); // over!
            }
        } else if (col.length) {
            for (var i=col.length-1; i >= 0; i--)
                if (onScreen(col[i])){
                    cur = i;
                    break; }
            if (!~cur) {
                cur = col.length-1;
                beep(); // over!
            }
        }
        video.setCur(cur,col);
    },
    onLine: function(g,l) {
        var col = video.dom[g][l];
        var cur = col.indexOf(video.current);
        if (~cur && !onScreen(l ? video.current : closest(video.current, 'comment-thread-renderer'))) cur = -1; // cur is off screen!
        if (~cur) {
            if (++cur >= col.length) {
                cur = 0;
                beep(); // over!
            }
        } else if (col.length) {
            for (var i=0; i < col.length; i++)
                if ((!l && onScreen(col[i])) || onScreen(l ? col[i] : closest(col[i], 'comment-thread-renderer'))){
                    cur = i+1;
                    if (cur >= col.length) cur = -1;
                    break; }
            if (!~cur) {
                cur = 0;
                beep(); // over!
            }
        }
        video.setCur(cur,col);
/*        if (!~cur) {
            beep(); // none!
            if (video.current)
                video.current.style['border-left'] = '';
        } else {
            toScreen(col[cur]);
            if (video.current)
                video.current.style['border-left'] = '';
            video.current = col[cur];
            video.current.style['border-left'] = '4px orange solid';
        }
        document.getElementById('mUTC').innerText = !~cur ? "-" : cur+'/'+col.length;*/
    },
    start: function(orStop){
        var pause = document.getElementById('mUTS');
        if (pause.style.visibility == 'visible') {
            if (orStop) video.stop();
            else beep();
            return; // alr!
        }
        console.log('video.start');
        pause.style.visibility = 'visible';
        loader.start();
    },
    stop: function(){
        if (loader._stop) {
            beep();
            return; // alr!
        }
        console.log('video.stop');
        loader.stop();
    },
    stopped: function(){
        var pause = document.getElementById('mUTS');
        console.log('video.stopped');
        pause.style.visibility = 'hidden';
        video.animStop();
        video.parse(); // parse loaded data
    },
    started: function(){
        video.animStart();
    },
    leaveLong: function() {
        if(document.querySelectorAll("#channels-browse-content-grid").length)
        {
            console.log(1);
            Array.prototype.forEach.call(
                document.querySelectorAll(".channels-content-item"), 
                function(x){ 
                    if(Date.parse("1/1/1 " + x.querySelector(".video-time")
                                  .textContent.replace(/(\d+:\d+)(:\d)?/,function(s,p1,p2){return p2 == null ? "0:"+s : s; })
                                 ) <= Date.parse("1/1/1 00:20:00"))
                        document.querySelector("#channels-browse-content-grid").removeChild(x); });
        }
        else
        {
            console.log(2);
            Array.prototype.forEach.call(
                document.querySelectorAll(".browse-list-item-container"), 
                function(x){ 
                    if(Date.parse("1/1/1 " + x.querySelector(".video-time")
                                  .textContent.replace(/(\d+:\d+)(:\d)?/,function(s,p1,p2){return p2 == null ? "0:"+s : s; })
                                 ) <= Date.parse("1/1/1 00:20:00"))
                        document.querySelector("#browse-items-primary").removeChild(x); });
        }
    },
    removeWatched: function() {
        Array.prototype.forEach.call(
            document.querySelectorAll(".watched-badge"), 
            function(x){ (closest(x,'channels-content-item') || closest(x,'feed-item-container')).remove(); });
    },
    seek: function(e, right){
        var q = document.querySelector("video");
        if (!q) return;
        var v = right ? 1 : 2;
        if (e.shiftKey && e.ctrlKey) v = 90;
        else if (e.shiftKey) v = 30;
        else if (e.ctrlKey) v = 10;
        else if (e.altKey) v = 1 / 29.97;
        else if (document.activeElement == q.parentElement.parentElement) return; // yt player will handle...
        var k = (right == false) ? -1 : 1;
        q.currentTime += k * v * q.playbackRate; // .getCurrentTime()
        return true;
    },
    playPause: function (shiftKey){
        var q = document.querySelector("video");
        if (!q) return;
        var r = q.getBoundingClientRect();
        console.log(r.top + ' < ' + (30-r.height));
        if ((!shiftKey && r.top < 30-r.height) || document.activeElement == q.parentElement.parentElement) return;
        if (q.paused) q.play();
        else q.pause();
        return true;
    },
    fullScreen: function(){
        //if (document.activeElement && ~['textarea','input'].indexOf(document.activeElement.type))
        if (isInput()) 
            return; // text input in process =)
        document.getElementsByClassName('ytp-fullscreen-button')[0].click();
        return true;
        var ev = document.createEvent('KeyboardEvent');
        var key = 70; // f
        //ev.initKeyboardEvent('keypress', true, true, window, null, key);
        //ev.initKeyboardEvent("keypress", true, true, window,
        //          0, 0, 0, 0,
        //        key, key);
        //ev.initKeyboardEvent('keydown', true, true, window, false, false, false, false, 13, 0);
        ev.initKeyboardEvent("keydown", true, true, document.defaultView, key, key, "", "", false, "");
        document.dispatchEvent(ev);
        return true;
    },
    toggleSpeed: function(mul){
        var q = document.querySelector("video");
        if (!q) return;
        if (mul)
            q.playbackRate = q.playbackRate == 2.7 ? 1 : 2.7;
        else
            q.playbackRate = q.playbackRate == 1 ? 2 : 1;
        /*q = document.querySelector(".appbar-guide-notification");
        q.getElementsByClassName('appbar-guide-notification-text-content')[0].textContent = 'Скорость: ' + q.playbackRate;
        q.style.height = 'initial';
        setTimeout(function(){
            q.style.height = '';
        }, 500);*/
        return true;
    },
    myCommentsBefore: [],
    myCommentsCounter: 0,
    myCommentsCounterMAX: 100,
    myCommentsTimer: null,
    myCommentsThread: null,
    click_e: null,
    clickHandler: function(e){
        if (loader._update) return; // inp!
        console.log('clickHandler', e);
        if (!e.target || !e.target.className) return;
        if (~e.target.className.indexOf('comment-simplebox-submit')) {
            debugger;
            if (video.myCommentsTimer) clearInterval(video.myCommentsTimer);
            video.myCommentsThread = findAncestor(e.target, 'comment-thread-renderer');
            //document.getElementsByClassName('comment-thread-renderer')[0];
            //video.myCommentsCounter = document.querySelector(".comment-thread-renderer").getElementsByClassName('comment-renderer');
            var me = document.getElementsByClassName('yt-masthead-picker-name')[0].textContent;
            var q = function(){ return video.myCommentsThread.querySelectorAll('.comment-renderer[data-author-name="'+me+'"]') };
            video.myCommentsBefore = q();
            video.myCommentsCounter = 0;
            video.myCommentsTimer = setInterval(function(){
                var e = q();
                if (++video.myCommentsCounter <= video.myCommentsCounterMAX
                    && e.length <= video.myCommentsBefore.length) {
                    console.log('wait my post submit - continue waiting...');
                    return; } // continue waiting...
                // stop waiting
                clearInterval(video.myCommentsTimer);
                video.myCommentsTimer = null;
                video.myCommentsBefore = [];
                video.myCommentsThread = null;
                if (video.myCommentsCounter >= video.myCommentsCounterMAX)
                    console.log('wait my post submit - TIMEOUT!');
                video.myCommentsCounter = 0;
                // posted! - parse:
                q = Array.prototype.filter.call(e, function(i){ return !~video.myCommentsBefore.indexOf(i) });
                console.log('post submitted!', q);
                var root = function(i){ return ~i.parentNode.className.indexOf("comment-thread-renderer") };
                var my = function(i){ return i.getAttribute('data-author-name') == me };
                video.dom[0][1] = loader.find('comment-renderer', function(i){return my(i) && !root(i)});
                document.getElementById('mUT01').innerText = video.dom[0][1].length;
                video.adornment(q[0],0,1);
            }, 300);
            return;
        }
        
        var t = closest(e.target, 'comment-thread-renderer');
        var t2 = closest(e.target, 'comment-replies-renderer-expander-down');
        if (t && (t2 || ~e.target.className.indexOf('comment-replies-renderer-expander-down'))) {
            var q = findAncestor(e.target, 'comment-thread-renderer');
            video.delayParse(function(){ return q.querySelectorAll('.comment-renderer').length });
            return;
        } else
            console.log('nope', e.target, t);
        
        if (e.target.className == 'yt-uix-expander-collapsed-body')
            e.target.querySelector('.load-more-button').click();
        
        if (!~e.target.className.indexOf('sprite-like')) return;
        var v = !e.target.getAttribute('data-action-on');
        var q = findAncestor(e.target, 'comment-renderer');
//        console.log('!!!!!!', v, e.target, e);
        if (e.shiftKey || (video.click_e && video.click_e.shiftKey))
            video.setFav(q.getAttribute('data-author-name'), v);
        var root = function(i){ return ~i.parentNode.className.indexOf("comment-thread-renderer") };
        var n = root(q) ? 0 : 1;
        setTimeout(function(){
            if (!v) {
                var x = video.dom[2][n].indexOf(q);
                if (~x) video.dom[2][n].splice(x,1);
            } else
                video.dom[2][n] = loader.find('comment-renderer liked', function(i){return !n == !!root(i)});
            document.getElementById('mUT20').innerText = video.dom[2][0].length;
            document.getElementById('mUT21').innerText = video.dom[2][1].length;
            if (v) video.adornment(q,2,n);
            else {
                var x = null;
                if (~video.dom[0][0].indexOf(q) || ~video.dom[0][1].indexOf(q)) x = 0;
                if (~video.dom[1][0].indexOf(q) || ~video.dom[1][1].indexOf(q)) x = 1;
                video.adornment(q, x,n);
            }
        }, 100);
    },
    mousedownHandler: function(e){
        if (!e.target || e.which != 2 || e.target.nodeName == 'A' || closestType(e.target, 'a')) return;
        if (e.target.getAttribute('id') == 'channels-browse-content-grid' || // grid view
            e.target.parentNode.parentNode.getAttribute('id') == 'browse-items-primary' || // grid view outer
            (!closestType(e.target, 'a') && e.target.nodeName != 'A' && closestId(e.target, 'browse-items-primary'))) // list view
        { // load more
            document.querySelector(".load-more-button").click();
            e.preventDefault();
            return; 
        }
        var q = findAncestor(e.target, 'comment-renderer');
        if (!q) return;
        var l = getDescendantWithClass(q, 'sprite-like');
        if (!l) return;
        // middle button!
//        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!', e, q, l);
        //var q = e.target
        video.click_e = e;
        l.click();
        video.click_e = null;
        e.preventDefault();
    },
    registerClickHandler: function(e){
        var q = document.getElementById('watch-discussion') || document.getElementById('content');
        q.addEventListener('click',video.clickHandler,true);
        q.addEventListener('mousedown',video.mousedownHandler,true);
    },
    //favs: ['Ирина Ляшенко', 'Марго Павлова'],
    favs: JSON.parse(getCookie('myUTfavs') || '[]'),
    applyFavs: function(arr, old){
        setCookie('myUTfavs', JSON.stringify(video.favs), {expires: 154000000000, domain:'www.youtube.com'}); // 100 years
        var q = document.getElementById('mUTF');
        q.innerText = video.favs.length;
        // ui
        video.parse(null, true, true);
        if(!old) return;
        // reset adornment
        var p = document.getElementsByClassName('comment-section-renderer-items')[0];
        q = null;
        var f = function(n,j){
            var c = video.dom[n][j];
            for(var i=0; i<c.length; i++) {
                var v = c[i].parentNode;
                if (j) v = v.parentNode.parentNode.parentNode;
                // adornment
                var s = v.getAttribute('data-author-name');
                if (~arr.indexOf(s) == ~old.indexOf(s)) continue;
                c[i].style['background'] = '';
                if (!j) { // branch:
                    c[i].nextElementSibling.style['border-left'] = '';
                    c[i].nextElementSibling.style['padding-left'] = ''; }
            }
        }
        f(1,0);
        f(1,1);
    },
    setFav: function(name,add){
        var x = video.favs.indexOf(name);
        var s = false;
        if (add && !~x) { video.favs.push(name); s=true;}
        else if (~x){ video.favs.splice(x,1); s=true;}
        if (!s) return;
        video.applyFavs();
        var q = document.getElementById(add ? 'myUTad' : 'myUTre');
        q.style.visibility = 'visible';
        setTimeout(function(){q.style.visibility = 'hidden'}, 3000);
    },
    editFavs: function(){
        var q = document.getElementById('myUTE');
        var t = q.children[0];
        t.value = video.favs.join('\n');
        q.style.visibility = 'visible';
        t.focus();
    },
    favsClose: function(){
        var q = document.getElementById('myUTE');
        q.style.visibility = 'hidden';
    },
    favsSave: function(){
        var q = document.getElementById('myUTE');
        var t = q.children[0];
        video.favs = cleanArray(t.value.split('\n'));
        video.favsClose();
        video.applyFavs();
    },
    pageScroll: function(up){
        if (!document.activeElement) return;
        if (!~['movie_player','player-api'].indexOf(document.activeElement.getAttribute('id'))) return;
        var v = document.body.scrollTop + (up?-1:1) * document.body.clientHeight * 0.8;
        document.body.scrollTop = v;
        return true;
    }
}

function doc_keyUp(e) {
    console.log('----------------- monkey press: ' + e.keyCode);
    if (window.event && e.keyCode == 113 && !e.shiftKey && !e.ctrlKey && !e.altKey) { // f2
        video.leaveLong();
		e.keyCode = 0;
		e.returnValue = false;
        e.preventDefault();
        //return false;
    }
    if (window.event && e.keyCode == 113 && e.shiftKey && !e.ctrlKey && !e.altKey) { // +f2
		video.removeWatched();
        e.preventDefault();
    }
    if (window.event && e.keyCode == 115 && !e.shiftKey && !e.ctrlKey && !e.altKey) { // f4
		document.querySelector(".load-more-button").click();
        e.preventDefault();
    }
//    if (window.event && e.keyCode == 120 && !e.shiftKey && !e.ctrlKey && !e.altKey) // f9
//        loader.start_stop();
    if (window.event && e.keyCode == 120 && !e.shiftKey && !e.ctrlKey && !e.altKey) { // f9
        video.start(true);
        e.preventDefault();
    }
    if (window.event && e.keyCode == 121 && !e.shiftKey && !e.ctrlKey && !e.altKey) { // f10
        video.parse();
        e.preventDefault();
    }
    //if (!document.activeElement || (!~['textarea','input'].indexOf(document.activeElement.type) && (!document.activeElement.className || !~['comment-simplebox-text'].indexOf(document.activeElement.className)))) {
    if (!isInput()) {
        // NO text input in process =)
        if (window.event && e.keyCode == 37) // left
            if(video.seek(e, false))
                e.preventDefault();
        if (window.event && e.keyCode == 39) // right
            if(video.seek(e, true))
                e.preventDefault();
        if (window.event && e.keyCode == 38) { // up
            var q = document.querySelector("video");
            if (q && !q.paused && !e.shiftKey) {
                q.volume += 0.04;
                e.preventDefault(); }
            else if (e.shiftKey) {
                document.body.scrollTop -= 150;
                e.preventDefault(); }}
        if (window.event && e.keyCode == 40) { // down
            var q = document.querySelector("video");
            if (q && !q.paused && !e.shiftKey) {
                q.volume -= 0.04;
                e.preventDefault(); }
            else if (e.shiftKey) {
                document.body.scrollTop += 150;
                e.preventDefault(); }}
        if (window.event && e.keyCode == 32) // space
            if(video.playPause(e.shiftKey))
                e.preventDefault();
        if (window.event && e.keyCode == 13) // enter
            return video.fullScreen();
        if (window.event && e.keyCode == 33) // pgup
            if (video.pageScroll(true))
                e.preventDefault();
        if (window.event && e.keyCode == 34) // pgdn
            if (video.pageScroll(false))
                e.preventDefault();
        if (window.event && e.keyCode == 119) // NumUp
            if (video.toggleSpeed(false))
                e.preventDefault();
        if (window.event && e.keyCode == 38 && e.ctrlKey) // ^NumUp
            if (video.toggleSpeed(true))
                e.preventDefault();
    }

//    if (window.event && e.keyCode == 121 && !e.shiftKey && !e.ctrlKey && !e.altKey) // f10
//        video.panel();
}

var sidebarBottom = 0;
function _onscroll(e) {
    console.log('scroll');
    clearTimeout(onscrollTimer);
    onscrollTimer = null;
    var s = document.getElementById('watch7-sidebar');
    if (!s) return;
    var c = document.getElementById('watch7-content');
    if (!sidebarBottom) sidebarBottom = getOffset(s).top + s.offsetHeight;
    var h = sidebarBottom - document.body.scrollTop - 35 < 0;
    if (h != (s.style.display == 'none')){
        if (h) {
            s.style.display = 'none';
            c.style.width = 'calc(100% - 100px)'; }
        else {
            s.style.display = '';
            c.style.width = ''; }
        console.log('hide sidebar', h); 
    }
    var l = loader.btn(true);
    if (l && onScreen(l, true) && !loader._update) {
        console.log('---------- auto-click load more');
        l.click();
        video.delayParse(function(){ return document.getElementById("comment-section-renderer-items").children.length}); }
}
var onscrollTimer = null;
function onscroll(e) {
    if (onscrollTimer) clearTimeout(onscrollTimer);
    onscrollTimer = setTimeout(_onscroll, 300);
}

/*function _onclick(e) {
    console.log('click');
    clearTimeout(onclickTimer);
    onclickTimer = null;
}
var onclickTimer = null;
function onclick(e) {
    if (e.which != 1) return;
    if (onclickTimer) clearTimeout(onclickTimer);
    onclickTimer = setTimeout(_onclick, 300);
}*/

console.log('----------------- monkey start! ' + window.location.href);
//setInterval(function(){console.log('aaaa')}, 100);
//setTimeout(function(){console.log('bbbb')}, 10000);
document.addEventListener('keydown', doc_keyUp, false);
document.addEventListener('scroll', onscroll, false);
//document.addEventListener('mousedown', onclick, false);
video.panel(); // init
//document.getElementById('movie_player').focus(); // focus bug fix
