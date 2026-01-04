// ==UserScript==
// @name         Improved Speed Slider For YouTube (fix)
// @namespace    improved_youtube_player_speed_slider_fix
// @version      1.0
// @description  Add Speed Slider to Youtube Player Settings
// @author       Łukasz, pabli, goldnick7
// @match        https://*.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433222/Improved%20Speed%20Slider%20For%20YouTube%20%28fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/433222/Improved%20Speed%20Slider%20For%20YouTube%20%28fix%29.meta.js
// ==/UserScript==
var yts_build_timeout = 500;
var yts_remove_timeout = 1000;

var yts_el_menu = null;
var yts_el_slider_label = null;
var yts_el_slider_icon = null;
var yts_el_slider_check = null;
var yts_el_slider = null;
var yts_el_player = null;

var yts_event_em_speed = false;
var yts_event_player = false;

var yts_r = 'yts_r';
var yts_s = 'yts_s';


/*************************************
 *          INIT                     *
 ************************************/
function ytsInit() {
    $yts.event(document, "spfdone", function () {
        ytsInitPlayer();
    });
    ytsReopenMenu();
    ytsBuildApp();
}

function ytsBuildApp() {

    yts_el_menu = $yts.get('.ytp-panel-menu');
    if (yts_el_menu !== null) {
        setTimeout(ytsRemoveDefaultSpeed, yts_remove_timeout);
        ytsInitSlider();
        ytsInitMenu();
        ytsInitPlayer();
    }
    else {
        setTimeout(ytsBuildApp, yts_build_timeout);
    }
}


/*************************************
 *          MENU                    *
 ************************************/

function ytsInitMenu() {

    var speedMenu = $yts.new('div', {'className': 'ytp-menuitem', id: 'yts-menu'});
    var right = $yts.new('div', {'className': 'ytp-menuitem-content'});
	var cssMenu = $yts.new('style', {'type': 'text/css'});
	var css =`
.ytp-menuitem-toggle-checkbox[type="checkbox"]{
	-webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;
	outline: none;
	cursor: pointer;
}
.ytp-menuitem-toggle-checkbox:checked[type="checkbox"]
{
	background: #f00;
}
.ytp-menuitem-toggle-checkbox:checked[type="checkbox"]:after
{
	left: 20px;
	background-color: #fff;
}
.ytp-menuitem-slider {
	-webkit-appearance: none;
	vertical-align: middle;
	outline: none;
	border: none;
	padding: 0;
	background: none;
}
.ytp-menuitem-slider::-webkit-slider-runnable-track {
	background-color: rgba(255, 255, 255, .5);
	height: 6px;
	border-radius: 3px;
	border: 1px solid transparent;
}
.ytp-menuitem-slider[disabled]::-webkit-slider-runnable-track {
	border: 1px solid rgba(255, 255, 255, .5);
	background-color: transparent;
	opacity: 0.4;
}
.ytp-menuitem-slider::-moz-range-track {
	background-color: rgba(255, 255, 255, .5);
	height: 6px;
	border-radius: 3px;
	border: none;
}
.ytp-menuitem-slider::-ms-track {
	color: transparent;
	border: none;
	background: none;
	height: 6px;
}
.ytp-menuitem-slider::-ms-fill-lower {
	background-color: rgba(255, 255, 255, .5);
	border-radius: 3px;
}
.ytp-menuitem-slider::-ms-fill-upper {
	background-color: rgba(255, 255, 255, .5);
	border-radius: 3px;
}
.ytp-menuitem-slider::-ms-tooltip {
	display: none;
}
.ytp-menuitem-slider::-moz-range-thumb {
	border-radius: 20px;
	height: 14px;
	width: 14px;
	border: none;
	background: none;
	background-color: #fff;
	box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.6);
	-moz-transition: all .08s cubic-bezier(0.4, 0.0, 1, 1);
}
.ytp-menuitem-slider:active::-moz-range-thumb {
	outline: none;
}
.ytp-menuitem-slider::-webkit-slider-thumb {
	-webkit-appearance: none !important;
	border-radius: 100%;
	background-color: #fff;
	height: 14px;
	width: 14px;
	margin-top: -5px;
	box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.6);
	-moz-transition: all .08s cubic-bezier(0.4, 0.0, 1, 1);
	-webkit-transition: all .08s cubic-bezier(0.4, 0.0, 1, 1);
}
.ytp-menuitem-slider:active::-webkit-slider-thumb {
	outline: none;
}
.ytp-menuitem-slider::-ms-thumb {
	border-radius: 100%;
	background-color: #fff;
	height: 14px;
	width: 14px;
	border: none;
}
.ytp-menuitem-slider:active::-ms-thumb {
	border: none;
}
`;
	cssMenu.innerHTML = css;
    right.appendChild(yts_el_slider_check);
    right.appendChild(yts_el_slider);
    right.appendChild(cssMenu);
    speedMenu.appendChild(yts_el_slider_icon);
    speedMenu.appendChild(yts_el_slider_label);
    speedMenu.appendChild(right);
    yts_el_menu.appendChild(speedMenu);
}

function ytsRemoveDefaultSpeed() {
    var switchers = $yts.getOpt(".ytp-menuitem", {role: 'menuitemcheckbox'});
    var toRemove = null;

    if (!ytsPlayerHasClass('ad-interrupting') && switchers && switchers.length && !yts_event_em_speed) {
        toRemove = switchers[switchers.length - 1].nextElementSibling;
        if (toRemove && toRemove.id !== 'yts-menu') {
            $yts.style(toRemove, 'display', 'none');
            yts_event_em_speed = true;
        }
    }
}

function ytsReopenMenu() {
    var settings_button = $yts.get(".ytp-settings-button");
    settings_button && settings_button.click();
    settings_button && settings_button.click();
}


/*************************************
 *          SLIDER                   *
 ************************************/

function ytsInitSlider() {
    var rem = ytsParam(yts_r);
    var speed = ytsParam(yts_s) || 1;
    speed = rem ? speed : 1;

	yts_el_slider_icon = $yts.new('div', {'className': 'ytp-menuitem-icon'});//pabli
    yts_el_slider_label = $yts.new('div', {'className': 'ytp-menuitem-label'});
    yts_el_slider_check = $yts.new('input', {
        'type': 'checkbox',
        'title': 'Remember speed',
		'className': 'ytp-menuitem-toggle-checkbox'
    });

    yts_el_slider = $yts.new('input', {
		'className': 'ytp-menuitem-slider',
        'type': 'range',
        'min': 0.5,
        'max': 4.0,
        'step': 0.1,
        'value': speed,
        style: {
            'width': 'calc(100% - 60px)',
            'margin': '0 5px',
            'padding': '0',
			'vertical-align': 'text-bottom'
        }
    });
    if(rem){
        yts_el_slider_check.checked = true;
    }
    $yts.event(yts_el_slider, 'change', ytsChangeSlider);
    $yts.event(yts_el_slider_check, 'change', ytsChangeRemember);
    $yts.event(yts_el_slider, 'input', ytsChangeSlider);
    $yts.event(yts_el_slider, 'wheel', ytsWheelSlider);

    ytsUpdateSliderLabel(speed);
}


function ytsWheelSlider(event) {
    var val = parseFloat(event.target.value) + (event.deltaY > 0 ? -0.1 : 0.1);
    val = val < 0.5 ? 0.5 : (val > 4 ? 4 : val);
    if (event.target.value !== val) {
        event.target.value = val;
        ytsUpdateSliderLabel(val);
    }
    event.preventDefault();
}

function ytsChangeSlider(event) {
    ytsUpdateSliderLabel(event.target.value);
}

function ytsChangeRemember() {
    ytsParam(yts_r, ytsParam(yts_r) ? 0 : 1);
}


function ytsUpdateSliderLabel(val) {
    ytsSetPlayerDuration(val);
    yts_el_slider_label.innerHTML = 'Speed (' + parseFloat(val).toFixed(1) + ')';
}


/*************************************
 *          PLAYER                   *
 ************************************/

function ytsInitPlayer() {
    yts_el_player = $yts.get('.html5-main-video');
    ytsObservePlayer();
    if (ytsParam(yts_s) && ytsParam(yts_r)) {
        ytsSetPlayerDuration(ytsParam(yts_s));
        ytsUpdateSliderLabel(ytsParam(yts_s));
    }

}

function ytsPlayerHasClass (cls) {
    ytsInitPlayer();
    return yts_el_player && yts_el_player.classList.contains(cls);
}

function ytsSetPlayerDuration(value) {
    ytsParam(yts_s, value);
    if (yts_el_player) {
        yts_el_player.playbackRate = value;
    }
}

function ytsObservePlayer() {
    if (!yts_event_player) {
        ytsObserver(yts_el_player.parentNode.parentNode, function (mutation) {
            if (/html5-video-player/.test(mutation.target.className) && !yts_event_em_speed) {
                ytsRemoveDefaultSpeed();
            }
        });
        yts_event_player = true;
    }
}


/************************************
 *                DOM                *
 ************************************/
$yts = {
    'event': function (obj, event, callback) {
        obj.addEventListener(event, callback);
    },
    'new': function (tag, option) {
        var element = document.createElement(tag);
        for (var param in option) {
            if (param === 'data' || param === 'style' || param === 'attr') {
                for (var data in option[param]) {
                    $yts[param](element, data, option[param][data]);
                }
            }
            else {
                element[param] = option[param];
            }
        }
        return element;
    },
    'get': function (tselector, all) {
        all = all || false;
        var type = tselector.substring(0, 1);
        var selector = tselector.substring(1);
        var elements;
        if (type === "#") {
            return document.getElementById(selector);
        }
        else if (type === ".") {
            elements = document.getElementsByClassName(selector);
        }
        else {
            elements = document.querySelectorAll(tselector);
        }

        if (all) {
            return elements;
        }
        else {
            return elements.length ? elements[0] : null;
        }
    },
    'data': function (elem, key, val) {
        key = key.replace(/-(\w)/gi, function (x) {
            return x.charAt(1).toUpperCase();
        });
        if (typeof val !== 'undefined') {
            elem.dataset[key] = val;
        }
        return elem.dataset[key];

    },
    'style': function (elem, key, val, priority) {
        priority = priority || '';
        if (typeof val !== 'undefined') {
            elem.style.setProperty(key, val, priority);
        }
        return elem.style.getPropertyValue(key);

    },
    'attr': function (elem, key, val) {
        if (typeof val !== 'undefined') {
            elem.setAttribute(key, val);
        }
        return elem.getAttribute(key);

    },
    'getOpt': function (selector, option) {
        var el = $yts.get(selector, true);
        var pass = [];
        var correct;
        for (var i = 0; i < el.length; i++) {
            correct = true;
            for (var prop in option) {
                if (!$yts.has(el[i], prop, option[prop])) {
                    correct = false;
                    break;
                }
            }
            if (correct) {
                pass.push(el[i]);
            }
        }
        return pass;
    },
    'has': function (elem, key, val) {
        if (elem.hasAttribute(key)) {
            var attr = elem.getAttribute(key);
            if (val !== null) {
                return attr == val;
            }
            return true;
        }
        return false;
    }
};

/*************************************
 *          OBSERVER                 *
 ************************************/
function ytsObserver(element, callback) {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    if (MutationObserver) {
        var obs = new MutationObserver(function (mutations) {
            callback(mutations[0]);
        });

        obs.observe(element, {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true,
            attributeOldValue: true,
            characterDataOldValue: true
        });
    }
}

function ytsParam(key, val) {
    if (typeof val !== 'undefined') {
        localStorage.setItem(key, val);
    }
    return parseFloat(localStorage.getItem(key));
}

ytsInit();