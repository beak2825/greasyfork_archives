// ==UserScript==
// @name         NCC City Mapper
// @namespace    https://www.waze.com/user/editor/B4ckTrace
// @version      1.1
// @description  Displays city names in the WME map
// @author       B4ckTrace
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391731/NCC%20City%20Mapper.user.js
// @updateURL https://update.greasyfork.org/scripts/391731/NCC%20City%20Mapper.meta.js
// ==/UserScript==

/* global W */
/* global OL */
/* global $ */
/* global WazeWrap */

var nccmapperIcon = 'data:image/png;base64,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';

(function() {
    'use strict';

    var settings = {};
    var wmeNccLayer;
	var blDraw = false;

    function bootstrap(tries) {
        tries = tries || 1;

        if (W &&
			W.map &&
            W.model &&
			W.loginManager.user && $ 
			) {
            init();
        } else if (tries < 1000)
            setTimeout(function () {bootstrap(tries++);}, 200);
    }

    function init()
    {
        console.log("WME NCC City Mapper Init");
        loadSettings();
		debugger;
		var oldTogglers = document.querySelector('.togglers');
/* 		if (oldTogglers.querySelector('.layer-switcher-group_scripts') === null)
		{
            var newScriptsToggler = document.createElement('li');
            newScriptsToggler.className = 'group';
            newScriptsToggler.innerHTML = '<div class="controls-container main toggler">\
																		          <input class="layer-switcher-group_scripts toggle" id="layer-switcher-group_scripts" type="checkbox">\
																		          <label for="layer-switcher-group_scripts">\
																		          <span class="label-text">Scripts</span>\
																		          </label>\
																			      </div>\
																			      <ul class="children">\
										                        </ul>';
            oldTogglers.appendChild(newScriptsToggler);
        } */
		
		// Create toggler
        var newToggler = document.createElement('li');
        newToggler.innerHTML = '<div class="wz-checkbox">\
                                        <input class="layer-switcher-item_ncc_mapper toggle" id="layer-switcher-item_ncc_mapper" type="checkbox">\
                                        <label for="layer-switcher-item_ncc_mapper">\
                                          '+ 'مکانهای پایگاه ملی' +'\
                                        </label>\
                                      </div>';


        var groupDisplay = document.querySelector('.collapsible-GROUP_DISPLAY');
        groupDisplay.appendChild(newToggler);
		  
		var toggler = getId('layer-switcher-item_ncc_mapper');
		toggler.checked = settings.Enabled;
		
		// Add new tab item
		var userTabs = getId('user-info');
		var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
		var tabContent = getElementsByClassName('tab-content', userTabs)[0];
		var newtab = document.createElement('li');
		newtab.innerHTML = '<a href="#sidepanel-ncccitymapper" data-toggle="tab"><img style="padding-bottom: 6px;width: 18px;padding-right: 1px;" id="nccmapperIcon" class="nccmapperIconClass" src="' + nccmapperIcon + '">NCC Mapper</a>';
		var addon = document.createElement('section');
		addon.id = "sidepanel-ncccitymapper";
		addon.className = "tab-pane";
		var section = document.createElement('p');
		section.style.paddingTop = "0px";
		section.id = "ncccitymapper-box";
		section.className = 'input';
		section.innerHTML  = '<div><fieldset style="border: 1px solid silver; padding: 8px; border-radius: 4px;">'
							 + '<legend style="margin-bottom: 0px; border-bottom-style:none; width: auto;"><h4>Paste csv content here:</h4></legend>'
							 + '<textarea id="ncccitymapper-textarea" style="width:265px; height:120px;" placeholder="Paste here..."></textarea></br>'
							 + '<button id="ncccitymapper-NCCLOADBTN">Find cities</button>'
							 + '</fieldset></div>'
							 + '</div>'
		
		addon.appendChild(section);
		navTabs.appendChild(newtab);
		tabContent.appendChild(addon);
		
		
		onLayerCheckboxChanged(settings.Enabled);
		
		// Button handler
		getId('ncccitymapper-NCCLOADBTN').onclick = LOADBTN_Click;
		toggler.addEventListener('click', function(e) {
              onLayerCheckboxChanged(e.target.checked);
			  drawLines();
        });
    }
	
    function onLayerCheckboxChanged(checked) {
        settings.Enabled = checked;
        if (wmeNccLayer) {
            wmeNccLayer.setVisibility(settings.Enabled);
        }
        if (settings.Enabled)
        {
            if (!wmeNccLayer) {
                wmeNccLayer = new OL.Layer.Vector("wmeNccLayer", {uniqueName: "__wmeNccLayer"});
                W.map.addLayer(wmeNccLayer);
				blDraw = false;
            }
            W.map.events.register("moveend", W.map, drawLines);
            //drawLines();
        } else {
            W.map.events.unregister("moveend", W.map, drawLines);
            if (wmeNccLayer) {
                wmeNccLayer.removeAllFeatures();
                W.map.removeLayer(wmeNccLayer);
                wmeNccLayer = null;
            }
        }
        saveSettings();
    }
	
	function LOADBTN_Click()
	{
		if (wmeNccLayer) {
			blDraw = false;
			drawLines();
		}
	}

    function drawLines()
    {
		if (blDraw)
			return;
		
        wmeNccLayer.removeAllFeatures();

        var lineWidth = 2;
        var lineColor = 'gray';
        if (W.map.getZoom() <= 1)
        {
            lineWidth = 1;
        }
        else if (W.map.getZoom() >= 3)
        {
            lineColor = '#EDEDED';
        }
		
		var myVillages = getId('ncccitymapper-textarea');
		if (myVillages == null)
			return;
		
		myVillages = myVillages.value;
		if (myVillages.length<10)
			return;
		
		myVillages = myVillages.trim();
		var lines = myVillages.split('\n');
		for(var line = 0; line < lines.length; line++){
			var elements = lines[line].split(',');
			var type = elements[elements.length-3];
			if (type == 'شهر' || type == 'محله' || type == 'روستا، آبادی' || type == 'بخش' || type == 'دهستان' || type == 'شهرك' || type == 'شهرستان')
			{
				var dashStyle = 'solid';
				switch(type) {
				  case 'شهرستان':
					dashStyle = 'solid'
					break;
				  case 'بخش':
				    lineWidth = 3;
					dashStyle = 'dot'
					break;
				  case 'شهر':				    
					dashStyle = 'longdashdot'
					break;
				  case 'شهرك':
					dashStyle = 'dot'
					break;
				  case 'محله':
					dashStyle = 'dashdot'
					break;
				  case 'روستا، آبادی':
					dashStyle = 'dash'
					break;
				  case 'دهستان':
					dashStyle = 'longdash'
					break;
				  default:
				    lineWidth = 2;
					dashStyle = 'solid';
				}

				var lon = elements[elements.length-1];
				var lat = elements[elements.length-2];
				
				var ColorCode = '#' + (0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
				lineColor =  invertColor(ColorCode, true);
				
				var pointEnd = convertCoordToPoint([lon, lat]);
				var pointFeature = new OL.Feature.Vector(pointEnd); // End point
				pointFeature.style = {
						pointRadius: 6,
						fillColor: 'white',
						fillOpacity: 1,
						strokeColor: ColorCode,
						strokeWidth: lineWidth+1,
						strokeLinecap: 'round',
						strokeDashstyle: 'dash',
						fontFamily: "arial, monospace",
						fontSize: '12pt',
						fontWeight: "bold",
						fontColor: ColorCode,
						labelOutlineColor: lineColor,
						labelOutlineWidth: lineWidth,
						label : elements[1] + '(' + (line) + ')\n' + type,
						labelAlign: "rt"//set to top right
					};
				wmeNccLayer.addFeatures([pointFeature]);
			} // End of if
		} // End of for
		
		blDraw = true;
    }
	
	function getElementsByClassName(classname, node) {
	  if(!node) node = document.getElementsByTagName("body")[0];
	  var a = [];
	  var re = new RegExp('\\b' + classname + '\\b');
	  var els = node.getElementsByTagName("*");
	  for (var i=0,j=els.length; i<j; i++)
		if (re.test(els[i].className)) a.push(els[i]);
	  return a;
	};
	function getId(node) {
	  return document.getElementById(node);
	};

    function saveSettings() {
        if (localStorage) {
            var localsettings = {
                Enabled: settings.Enabled
            };

            localStorage.setItem("wmeNcc_Settings", JSON.stringify(localsettings));
        }
    }

    function loadSettings() {
        var loadedSettings = $.parseJSON(localStorage.getItem("wmeNcc_Settings"));
        var defaultSettings = {
            Enabled: true
        };
        settings = loadedSettings ? loadedSettings : defaultSettings;
        for (var prop in defaultSettings) {
            if (!settings.hasOwnProperty(prop))
                settings[prop] = defaultSettings[prop];
        }
    }
	
	function invertColor(hex, bw) {
		if (hex.indexOf('#') === 0) {
			hex = hex.slice(1);
		}
		// convert 3-digit hex to 6-digits.
		if (hex.length === 3) {
			hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
		}
		if (hex.length !== 6) {
			throw new Error('Invalid HEX color.');
		}
		var r = parseInt(hex.slice(0, 2), 16),
			g = parseInt(hex.slice(2, 4), 16),
			b = parseInt(hex.slice(4, 6), 16);
		if (bw) {
			return (r * 0.299 + g * 0.587 + b * 0.114) > 186
				? '#000000'
				: '#FFFFFF';
		}
		// invert color components
		r = (255 - r).toString(16);
		g = (255 - g).toString(16);
		b = (255 - b).toString(16);
		// pad each with zeros and return
		return "#" + padZero(r) + padZero(g) + padZero(b);
	}
	function padZero(str, len) {
		len = len || 2;
		var zeros = new Array(len).join('0');
		return (zeros + str).slice(-len);
	}
	
	function convertCoordToPoint(coordinates) {
		return window.OL.Projection.transform(
			new window.OL.Geometry.Point(
				coordinates[0],
				coordinates[1]
			),
			"EPSG:4326",
			wmeNccLayer.projection.projCode
		);
	}


    bootstrap();
})();