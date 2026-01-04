// ==UserScript==
// @exclude     *
// @supportURL	https://github.com/Cryo99/GCStatsBannerLib
// @version     1.0.2
// @include     /^https?://www\.geocaching\.com/(account/dashboard|my|default|geocache|profile|seek/cache_details|p)/
// @exclude     /^https?://www\.geocaching\.com/(login|about|articles|myfriends)/
// @require     https://openuserjs.org/src/libs/sizzle/GM_config.js

// ==UserLibrary==
// @name        GC Stats Banner Library
// @description This library provides the core functionality for adding a stats banner onto profile and cache pages on geocaching.com.
// @copyright   2019-2020, Cryo99 (https://github.com/Cryo99)
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html

// ==/UserScript==

// ==/UserLibrary==


/*jshint esversion: 6 */
var GCStatsBanner = function(cfg){

    // ========================= Private members =========================
	var _cfg = {},
		_cfgDefault = {
			cacheTitles: false,
			callerVersion: 'Unknown',
			elPrefix: '',
			imgScript: 'find-badge.php',
			logLevel: 'normal',
			seriesLevels: ['None'],
			seriesLevelDefault: 'None',
			seriesName: false,
			seriesURL: false
		};
		
		// Internal vars.
		_cacheName = document.getElementById("ctl00_ContentBody_CacheName"),
		// Images can be wider when level names are long. overflow: hidden; on <series>-container prevents images from overlaying the div border.
		_css = '',
		_profileNameOld = document.getElementById("ctl00_ContentBody_ProfilePanel1_lblMemberName"),
		_profileName = document.getElementById("ctl00_ProfileHead_ProfileHeader_lblMemberName"),
		_userField = document.getElementsByClassName("user-name");
	
		
	// ========================= Private methods =========================
	// Constructor.
	function _const(){
		for(cfgItem in _cfgDefault){
			if(typeof cfg[cfgItem] === 'undefined' || cfg[cfgItem] === null){
				// Required variable is undefined or null
				if(_cfgDefault[cfgItem] === false){
					throw new Error('GCStatsBannerLib: ' + cfgItem + ' is a required configuration element.');
				}
				// Use the default value.
				_cfg[cfgItem] = _cfgDefault[cfgItem];
				// console.warn('GCStatsBannerLib: ' + cfgItem + ' undefined. Using value: ' + _cfgDefault[cfgItem] + '.')
			}else{
				// Use the configured value. 
				_cfg[cfgItem] = cfg[cfgItem];
			}
		}
		// If elPrefix is still empty, generate it.
		if(!_cfg.elPrefix){
			_cfg.elPrefix = _getPrefix(cfg.seriesName);
		}
		_log(cfg, 'Passed config');
		_log(_cfg, 'Generated config');

		_generateCSS();
	}
	// Run the constructor on creation.
	_const();

	function _getPrefix(name){
		var matches = name.match(/\b(\w)/g);
		return matches.join('').toLowerCase().padStart(3, '_');
	}

	function _generateCSS(){
		_css = 'div.' + _cfg.elPrefix + '-container { border: 1px solid #b0b0b0; margin-top: 1.5em; padding: 0; text-align: center; overflow: hidden;} ' + 
			'.WidgetBody div.' + _cfg.elPrefix + '-container { border: none; } ' +
			'#ctl00_ContentBody_ProfilePanel1_pnlProfile div.' + _cfg.elPrefix + '-container { border: none; text-align: inherit;} ' +
			'a.' + _cfg.elPrefix + '-badge { background-color: white;} ' +
			'#ctl00_ContentBody_ProfilePanel1_pnlProfile div.' + _cfg.elPrefix + '-container {float: left}' +
			'#StatsComponents {background: white;}';
	}

	function _log(msg, desc){
		if(_cfg.logLevel === 'debug'){
			var msgStart = '%c' + _cfg.seriesName + ' Stats Debug (%s):';
			console.log(msgStart,  "color: yellow; font-style: italic; background-color: red;padding: 2px", desc, msg);
		}
	}

	function _getHiderName(){
		var i,
			links = document.getElementsByTagName("a"),
            pos;
            
		if(links){
			for(i = 0; i < links.length; i++){
				pos = links[i].href.indexOf("/seek/nearest.aspx?u=");
				if(pos !== -1){
					return decodeURIComponent(links[i].href.substr(pos + 21).replace(/\+/g, '%20'));
				}
			}
		}
	};

	function _parseNames(names){
		// Filter out null or undefined entries, convert commas to semicolons, then convert to a comma-separated string.
		return encodeURIComponent(names
				.filter(function (n){
					return n !== undefined;
				})
				.map(function (n){
					return (n + "").replace(/,/g, ";");
				})
				.join());
    };
    
    function _getHtml(uname, brand){
		return "<a class='" + _cfg.elPrefix + "-badge' href='https://www." + _cfg.seriesURL + "' title='" + _cfg.seriesName +
			" stats.'><img src='https://img." + _cfg.seriesURL + "/awards/" + _cfg.imgScript + "?name=" + uname + "&brand=" + brand + "' /></a>";
    };

	function _displayStats(stats, page, brand){
		var widget = document.createElement("div"),
			html = "",
			i,
			target;

		for(i = 0; i < stats.length; i++){
			var name = (stats[i].name + "")
				.replace(/;/g, ",")
				.replace(/'/g, "&apos;")
				.replace(/"/g, "&quot;");
			if(i === 0 || stats[i].name !== stats[0].name){
				html += _getHtml(name, brand);
			}
		}
		_log(html, 'Banner HTML');

		switch(page){
			case "my":
				target = document.getElementById("ctl00_ContentBody_lnkProfile");
				break;
			case "account":
				// New account dashboard.
				// The WidgetPanel is too slow to load and causes scripts to block so follow GClhII and just append the widget to the sidebar.
				target = document.querySelector(".sidebar-right");
				break;
			case "cache":
                target = document.getElementsByClassName('sidebar')[0];
                break;
			case "profile":
				if(_profileName){
					target = document.getElementById("ctl00_ContentBody_ProfilePanel1_lblProfile");
					if (target) {
						target = target.parentNode;
					}
				}else if(_profileNameOld){
					target = document.getElementById("HiddenProfileContent");
				}
				break;
		}

		if(!target){
			console.warn(_cfg.seriesName + " Stats: Aborted - couldn't find where to insert widget. You might not be logged in.");
			return;
		}

		if(html){
			widget.className = _cfg.elPrefix + "-container";
			widget.innerHTML = html;
            switch(page){
                case "my":
                case "profile":
                    target.parentNode.insertBefore(widget, target.nextSibling);
                    break;
				case "account":
					// If the StatsWidget isn't present, create it.
					var el = document.getElementById("StatsWidget");
					if(!el){
						_log('Creating widget.', 'StatsWidget');
						var divStats = document.createElement('div');
						divStats.id = "StatsWidget";
						divStats.classList.add("panel", "collapsible");
						divStats.innerHTML = '<div class="panel-header isActive" aria-expanded="true">\
	<h1 id="stats-widget-label" class="h5 no-margin">Statistics</h1>\
	<button aria-controls="StatsWidget" aria-labelledby="stats-widget-label">\
		<svg height="22" width="22" class="opener" role="img">\
			<use xlink:href="/account/app/ui-icons/sprites/global.svg#icon-expand-svg-fill"></use>\
		</svg>\
	</button>\
</div>\
<div id="StatsComponents" class="panel-body">\
	<div id="StatsPanel" class="widget-panel"></div>\
</div>';
				
						target.append(divStats);
						// Hide the panel if it was previously hidden. 
						if (!GM_getValue('statsWidget_visible', false)) {
							document.querySelector('#StatsWidget .panel-body').style.display = "none";
							document.querySelector('#StatsWidget .panel-header').classList.remove('isActive');
							_fadeOut(document.querySelector('#StatsWidget .panel-body'));
						}
		
						// Add the click handler.
						document.querySelector('#StatsWidget .panel-header').addEventListener('click', function() {
							if (GM_getValue('statsWidget_visible', true)) {
								document.querySelector('#StatsWidget .panel-header').classList.remove('isActive');
								_fadeOut(document.querySelector('#StatsWidget .panel-body'));
								GM_setValue('statsWidget_visible', false);
							}else{
								document.querySelector('#StatsWidget .panel-header').classList.add('isActive');
								_fadeIn(document.querySelector('#StatsWidget .panel-body'));
								GM_setValue('statsWidget_visible', true);
							}
						});
					}
					// Finally, append the banner.
					document.querySelector('#StatsPanel').appendChild(widget);				
					break;
				default:
					target.insertBefore(widget, target.firstChild.nextSibling.nextSibling);
					break;
            }
        }else{
			console.warn(_cfg.seriesName + " Stats: didn't generate an award badge.");
		}
	};

	function _fadeOut(element) {
		var op = 1;  // initial opacity
		var timer = setInterval(function () {
			if (op <= 0.1){
				clearInterval(timer);
				element.style.display = "none";
			}
			element.style.opacity = op;
			op -= 0.1;
		}, 30);
	};

	function _fadeIn(element) {
		var op = 0.1;  // initial opacity
		element.style.display = "block";
		var timer = setInterval(function () {
			if (op >= 1){
				clearInterval(timer);
			}
			element.style.opacity = op;
			op += 0.1;
		}, 30);
	};

	function _createConfigDlg(){
		// Register the menu item.
		GM_registerMenuCommand("Options", function(){
			GM_config.open();
		});

		GM_config.init({
			'id': _cfg.elPrefix + '_config', 				// The id used for this instance of GM_config
			'title': _cfg.seriesName + ' Stats',			// Panel Title
			'fields': { 									// Fields object
				'branding': {								// This is the id of the field
					'label': 'Branding', 					// Appears next to field
					'type': 'select', 						// Makes this setting a dropdown
					'options': _cfg.seriesLevels,			// Possible choices
					'default': _cfg.seriesLevelDefault		// Default value if user doesn't change it
				}
			},
			// Dialogue internal styles.
			'css': '#' + _cfg.elPrefix + '_config {position: static !important; width: 75% !important; margin: 1.5em auto !important; border: 10 !important;}' +
				'#' + _cfg.elPrefix + '_config_' + _cfg.elPrefix + '_branding_var {padding-top: 30px;} #' + _cfg.elPrefix + '_config button {color: black;}',
			'events': {
				'open': function(document, window, frame){
					// iframe styles.
					frame.style.width = '300px';
					frame.style.height = '250px';
					frame.style.left = parent.document.body.clientWidth / 2 - 150 + 'px';
					frame.style.borderWidth = '5px';
					frame.style.borderStyle = 'ridge';
					frame.style.borderColor = '#999999';
				},
				'save': function(){
					GM_setValue(_cfg.elPrefix + '_branding', GM_config.get('branding'));
					location.reload();                      // reload the page when configuration was changed
				}
			}
		});
	};

	function _init(){
		var currentPage,
			elCSS = document.createElement("style"),
			userName = "",
			userNames = [],
			stats = [];

		// Don't run on frames or iframes
		if(window.top !== window.self){
			return false;
		}

		if(/\/my\//.test(location.pathname)){
			// On a My Profile page
			currentPage = "my";
		}else if(/\/account\//.test(location.pathname)){
			// On a Profile page
			currentPage = "account";
		}else{
			if(_cacheName){
				// On a Geocache page...
				// var matcher = new RegExp(_cfg.seriesName, "i");
				// if(!matcher.test(_cacheName.innerHTML)){
					// ...but not the right cache series.
				// 	return;
				// }

				var titleFound = false;
				for(title in _cfg.cacheTitles){
					var matcher = new RegExp(_cfg.cacheTitles[title], "i");
					if(matcher.test(_cacheName.innerHTML)){
						titleFound = true;
					}
				}
				if(!titleFound){
					// ...but not the right cache series.
					return;
				}

				currentPage = "cache";
			}else{
				currentPage = "profile";
			}
		}
		_log(currentPage, 'Detected page');

		// We're going to display so we can announce ourselves and prepare the configuration dialogue.
		console.info(_cfg.seriesName + " Stats V" + _cfg.callerVersion);

		//CONFIG
		_createConfigDlg();
		var brand = GM_getValue(_cfg.elPrefix + '_branding', _cfg.seriesLevelDefault);
		_log(brand, 'Stats branding');
		brand = brand.toLowerCase()

		// Get hider details.
		var hider;
		switch(currentPage){
			case "profile":
				if(_profileName){
					userNames = [_profileName.textContent.trim()];
				}else if(_profileNameOld){
					userNames = [_profileNameOld.textContent.trim()];
				}
				break;
			default:
				if(_userField.length > 0){
					userNames.push(_userField[0].innerHTML.trim());
				}
				hider = _getHiderName();
				if(typeof hider !== 'undefined'){
					userNames.push(hider);
				}
				break;
		}
		_log(userNames[0], "Finder's name");
		_log(userNames[1], "Hider's name");
	
		for(var i = 0; i < userNames.length; i++){
			stats[i] = {name: userNames[i]};
		}
		_log(stats, 'Statistics');
	
		userName = _parseNames(userNames);
		if(!userName){
			console.error(_cfg.seriesName + " Stats: Aborted - couldn't work out user name");
			return;
		}

		
		// Inject widget styling
		elCSS.setAttribute('type', 'text/css');
		if(elCSS.styleSheet){
			elCSS.styleSheet.cssText = _css;
		}else{
			elCSS.appendChild(document.createTextNode(_css));
		}
		document.head.appendChild(elCSS);
		_displayStats(stats, currentPage, brand);
	
	}

    return {
      // ========================= Public members =========================

	  // ========================= Public methods =========================
	  init: _init
    };
  
};
