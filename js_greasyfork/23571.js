// ==UserScript==
// @name          CacheTour
// @namespace     de.rocka84.cachetour
// @version       0.1.7
// @author        Rocka84 <f.dillmeier@gmail.com>
// @description   Collect Geocaches from geocaching.com and download them as single GPX file.
// @run-at        document-end
// @icon          https://github.com/Rocka84/CacheTour/raw/master/dist/icon.png
// @include       http*://www.geocaching.com/*
// @exclude       https://www.geocaching.com/articles
// @exclude       https://www.geocaching.com/about
// @exclude       https://www.geocaching.com/login
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_deleteValue
// @grant         GM_addStyle
// @require       https://greasyfork.org/scripts/23570-filesaver-js/code/FileSaverjs.js?version=149663
// @require       https://code.jquery.com/jquery-1.8.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/23571/CacheTour.user.js
// @updateURL https://update.greasyfork.org/scripts/23571/CacheTour.meta.js
// ==/UserScript==

var console = unsafeWindow.console; //for greasemonkey

(function(){
	"use strict";
	
	var modules = [],
		settings,
		styles = [],
		tours = [],
		current_tour = 0,
		locales = [],
		locale;

	function initDependencies() {
		$('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css">').appendTo(document.body);
		$('<script src="https://cdn.rawgit.com/eligrey/FileSaver.js/master/FileSaver.min.js">').appendTo(document.body);
	}

	function createStyles() {
		GM_addStyle(styles.join("\n"));
	}
	
	function loadSettings() {
		settings = JSON.parse(GM_getValue("settings") || "{}");
		current_tour = Math.min(settings.current_tour || 0, tours.length - 1);
		locale = settings.locale || 'en';
		return CacheTour;
	}

	function saveTours() {
		var tour_data = [];
		for (var i = 0, c = tours.length; i < c; i++) {
			tour_data.push(tours[i].toJSON());
		}
		GM_setValue("tours", JSON.stringify(tour_data));
		return CacheTour;
	}

	function loadTours() {
		var tour_data = JSON.parse(GM_getValue("tours") || "[]");
		for (var i = 0, c = tour_data.length; i < c; i++) {
			CacheTour.addTour(CacheTour.Tour.fromJSON(tour_data[i]));
		}
		if (tours.length === 0) {
			CacheTour.addTour(new CacheTour.Tour());
		}
		console.log('tours', tours);
		return CacheTour;
	}

	function initModules() {
		for (var i = 0, c = modules.length; i < c; i++) {
			if (modules[i].shouldRun()) {
				console.info("init Module " + modules[i].getName());
				try {
					modules[i].init();
				} catch (exception) {
					console.error('Exception while initializing module', modules[i].getName());
					console.error(exception);
				}
			}
		}
	}

	function runModules() {
		for (var i = 0, c = modules.length; i < c; i++) {
			if (modules[i].shouldRun()) {
				console.info("run Module " + modules[i].getName());
				try {
					modules[i].run();
				} catch (exception) {
					console.error('Exception in module', modules[i].getName());
					console.error(exception);
				}
			}
		}
	}

	function tourChanged() {
		saveTours();
		CacheTour.Gui.updateCacheList();
	}

	var CacheTour = unsafeWindow.CacheTour = window.CacheTour = {
		initialize: function() {
			initDependencies();
			loadTours();
			loadSettings();

			initModules();
			createStyles();
			runModules();
		},
		registerModule: function(module) {
			modules.push(module);
			return CacheTour;
		},
		addStyle: function(style) {
			styles.push(style);
			return CacheTour;
		},
		addTour: function(Tour) {
			Tour.onChange(tourChanged);
			current_tour = tours.length;
			tours.push(Tour);
			// tourChanged();
			return CacheTour;
		},
		setTourIndex: function(index) {
			current_tour = index;
			CacheTour.Gui.setTour(CacheTour.getCurrentTour());
			CacheTour.saveSettings();
			return CacheTour;
		},
		getCurrentTour: function() {
			return tours[current_tour];
		},
		getTours: function() {
			return tours;
		},
		getTour: function(id) {
			return this.tours[id];
		},
		useTemplate: function(template, data) {
			var out = template;
			for (var key in data) {
				if (data.hasOwnProperty(key)) {
					out = out.replace(new RegExp('<% ' + key + ' %>','g'), data[key]);
				}
			}
			return out.replace(/<%.+?%>/g,'');
        },		
		getSetting: function(setting) {
			return settings[setting];
		},
		setSetting: function(setting, value, dont_save) {
			if (typeof setting === 'string') {
				settings[setting] = value;
			}
			if (typeof setting === 'object') {
				for(var _setting in setting) {
					if (setting.hasOwnProperty(_setting)) {
						CacheTour.setSetting(_setting, setting[_setting], true);
					}
				}
			}
			return dont_save ? CacheTour : CacheTour.saveSettings();
		},
		saveSettings: function() {
			settings.current_tour = current_tour;
			GM_setValue("settings", JSON.stringify(settings));
			return CacheTour;
		},
		saveFile: function(filepath, content, type) {
			saveAs(new Blob([content], {type: type || 'text/plain;charset=utf-8'}), filepath);
			return CacheTour;
		},
		escapeHTML: function(html) {
			return $('<div>').text(html).html();
		},
		registerLocale: function(language, strings) {
			locales[language] = strings;
		},
		setLocale: function(_locale) {
			locale = _locale;
		},
		l10n: function(key) {
			if (locale !== 'en' && !locales[locale][key]) {
				return locales.en[key];
			}
			return locales[locale][key];
		},
		resetSettings: function(){
			if (confirm('This deletes all tours and settings for CacheTour and cannot be undone! Are you sure about that?')) {
				GM_deleteValue("settings");
				GM_deleteValue("tours");
				document.location.reload();
			}
		}
	};
	
})();


(function(){
	"use strict";

	var attribute_names = [
		'unknown', // thankfully index 0 is unused
		'dogs',
		'fee',
		'rappelling',
		'boat',
		'scuba',
		'kids',
		'onehour',
		'scenic',
		'hiking',
		'climbing',
		'wading',
		'swimming',
		'available',
		'night',
		'winter',
		'16', // to make indexes match attribute-ids
		'poisonoak',
		'snakes',
		'ticks',
		'mine',
		'cliff',
		'hunting',
		'danger',
		'wheelchair',
		'parking',
		'public',
		'water',
		'restrooms',
		'phone',
		'picnic',
		'camping',
		'bicycles',
		'motorcycles',
		'quads',
		'jeeps',
		'snowmobiles',
		'horses',
		'campfires',
		'thorn',
		'stealth',
		'stroller',
		'firstaid',
		'cow',
		'flashlight',
		'landf',
		'46', // to make indexes match attribute-ids
		'field_puzzle',
		'UV',
		'snowshoes',
		'skiis',
		's-tools',
		'nightcache',
		'parkngrab',
		'abandonedbuilding',
		'hike_short',
		'hike_med',
		'hike_long',
		'fuel',
		'food',
		'wirelessbeacon',
		'partnership',
		'seasonal',
		'touristOK',
		'treeclimbing',
		'frontyard',
		'teamwork',
		'geotour'
	];

	//temporary!
	function ucFirst(str) {
		var letters = str.split(''),
			first = letters.shift();
		return first.toUpperCase() + letters.join('');
	}

	var Attribute = CacheTour.Attribute = function(type, invert) {
		this.type = type;
		this.invert = !!invert;
	};

	Attribute.createByName = function(name, invert) {
		return new Attribute(Math.max(attribute_names.indexOf(name), 0), invert);
	};

	Attribute.prototype.getName = function() {
		return attribute_names[this.type];
	};

	Attribute.prototype.getDescription = function(no_prefix) {
		//@todo use internationalized descriptions instead of the attributes name
		return (!no_prefix && this.invert ? 'Not ' : '') + ucFirst(this.getName());
	};

	Attribute.prototype.toGPX = function() {
		return Promise.resolve('<groundspeak:attribute id="' + this.type + '" inc="' + (this.invert ? '0' : '1') + '">' + this.getDescription(true) + '</groundspeak:attribute>');
	};

})();


(function(){
	"use strict";

	var template_gpx = 
		'<wpt lat="<% lat %>" lon="<% lon %>">\n'+
				'<time><% date %></time>\n'+
				'<name><% gc_code %></name>\n'+
				'<desc><% name %> by <% owner %>, <% type %> (<% difficulty %>/<% terrain %>)</desc>\n'+
				'<url><% link %></url>\n'+
				'<urlname><% name %></urlname>\n'+
				'<sym><% symbol %></sym>\n'+
				'<type>geocache|<% type %></type>\n'+
				'<groundspeak:cache id="<% id %>" available="<% available %>" archived="<% archived %>" xmlns:groundspeak="http://www.groundspeak.com/cache/1/0/1">\n'+
						'<groundspeak:name><% name %></groundspeak:name>\n'+
						'<groundspeak:placed_by><% owner %></groundspeak:placed_by>\n'+
						'<groundspeak:owner><% owner %></groundspeak:owner>\n'+
						'<groundspeak:type><% type %></groundspeak:type>\n'+
						'<groundspeak:container><% size %></groundspeak:container>\n'+
						'<groundspeak:difficulty><% difficulty %></groundspeak:difficulty>\n'+
						'<groundspeak:terrain><% terrain %></groundspeak:terrain>\n'+
						'<groundspeak:country><% country %></groundspeak:country>\n'+
						'<groundspeak:state><% state %></groundspeak:state>\n'+
						'<groundspeak:attributes>\n<% attributes %>\n</groundspeak:attributes>\n'+
						'<groundspeak:short_description html="true"><% short_description %></groundspeak:short_description>\n'+
						'<groundspeak:long_description html="true"><% long_description %></groundspeak:long_description>\n'+
						'<groundspeak:encoded_hints><% hint %></groundspeak:encoded_hints>\n'+
						'<groundspeak:logs>\n<% logs %>\n</groundspeak:logs>\n'+
				'</groundspeak:cache>\n'+
		'</wpt>';

	var types = {
		2: {
			name: 'traditional',
			icon: "/images/WptTypes/2.gif"
		},
		3: {
			name: 'multi',
			icon: "/images/WptTypes/3.gif"
		},
		4: {
			name: 'virtual',
			icon: "/images/WptTypes/4.gif"
		},
		5: {
			name: 'letterbox',
			icon: "/images/WptTypes/5.gif"
		},
		6: {
			name: 'event',
			icon: "/images/WptTypes/6.gif"
		},
		8: {
			name: 'mystery',
			icon: "/images/WptTypes/8.gif"
		},
		11: {
			name: 'webcam',
			icon: "/images/WptTypes/11.gif"
		},
		13: {
			name: 'cito',
			icon: "/images/WptTypes/13.gif"
		},
		137: {
			name: 'earthcache',
			icon: "/images/WptTypes/137.gif"
		},
		1858: {
			name: 'wherigo',
			icon: "/images/WptTypes/1858.gif"
		}
	};

	var Cache = window.CacheTour.Cache = function(gc_code) {
		this.gc_code = gc_code ? gc_code.toUpperCase() : null;
		this.logs = [];
		this.attributes = [];
		this.type = 'traditional';
	};

	Cache.fromJSON = function(data) {
		var NewCache = new Cache(data.gc_code);
		if (data.name) NewCache.setName(data.name);
		if (data.type) NewCache.setType(data.type);
		if (data.difficulty) NewCache.setDifficulty(data.difficulty);
		if (data.terrain) NewCache.setTerrain(data.terrain);
		if (data.size) NewCache.setSize(data.size);
		return NewCache;
	};

	Cache.prototype.getGcCode = function() {
		return this.gc_code;
	};
	Cache.prototype.setGcCode = function(gc_code) {
		this.gc_code = gc_code.toUpperCase();
		return this;
	};

	Cache.prototype.getId = function() {
		return this.id;
	};
	Cache.prototype.setId = function(id) {
		this.id = id;
		return this;
	};

	Cache.prototype.setName = function(name) {
		this.name = name;
		return this;
	};
	Cache.prototype.getName = function() {
		return this.name;
	};
	
	Cache.prototype.setType = function(type) {
		this.type = type;
		return this;
	};
	Cache.prototype.getType = function() {
		return this.type;
	};
	
	Cache.prototype.setDifficulty = function(difficulty) {
		this.difficulty = difficulty;
		return this;
	};
	Cache.prototype.getDifficulty = function() {
		return this.difficulty;
	};

	Cache.prototype.setTerrain = function(terrain) {
		this.terrain = terrain;
		return this;
	};
	Cache.prototype.getTerrain = function() {
		return this.terrain;
	};

	Cache.prototype.setDate = function(date) {
		this.date = date;
		return this;
	};
	Cache.prototype.getDate = function() {
		return this.date;
	};

	Cache.prototype.setOwner = function(owner) {
		this.owner = owner;
		return this;
	};
	Cache.prototype.getOwner = function() {
		return this.owner;
	};

	Cache.prototype.setSize = function(size) {
		this.size = size;
		return this;
	};
	Cache.prototype.getSize = function() {
		return this.size;
	};

	Cache.prototype.setTour = function(Tour) {
		this.Tour = Tour;
		return this;
	};
	Cache.prototype.matches = function(Cache) {
		return this.gc_code === Cache.getGcCode();
	};

	Cache.prototype.getLink = function() {
		// return "https://coord.info/" + this.gc_code;
		return "https://www.geocaching.com/seek/cache_details.aspx?wp=" + this.gc_code;
	};

	Cache.prototype.addAttribute = function(attribute) {
		this.attributes.push(attribute);
		return this;
	};

	Cache.prototype.clearAttributes = function() {
		this.attributes = [];
		return this;
	};

	Cache.prototype.addLog = function(Log) {
		this.logs.push(Log);
		return this;
	};

	Cache.prototype.clearLogs = function() {
		this.logs = [];
		return this;
	};

	Cache.prototype.setLongDescription = function(description) {
		this.long_description = description;
	};

	Cache.prototype.setShortDescription = function(description) {
		this.short_description = description;
	};

	Cache.prototype.getCoordinates = function() {
		if (!this.coordinates) {
			this.coordinates = new CacheTour.Coordinates();
		}
		return this.coordinates;
	};

	Cache.prototype.setCoordinates = function(coordinates) {
		this.coordinates = coordinates;
	};

	Cache.prototype.retrieveDetails = function(){
		return new Promise(function(resolve, reject) {
			$.get(this.getLink(), function(result) {
				(new CacheTour.CacheParser(result, this)).parseAllExtras();
				resolve();
			}.bind(this)).fail(reject);
		}.bind(this));
	};

	Cache.getTypeName = function(type) {
		return types[type].name;
	};

	Cache.getTypeText = function(type) {
		return CacheTour.l10n("cachetype_" + type);
	};

	Cache.getTypeIcon = function(type) {
		return types[type] ? types[type].icon : null;
	};

	Cache.getTypeIdByName = function(name) {
		for(var id in types) {
			if (types[id].name === name) {
				return id;
			}
		}
		return null;
	};

	Cache.prototype.toGPX = function() {
		var logs;
		return this.retrieveDetails().then(function() {
			var log_promises = [];
			for (var i = 0, c = this.logs.length; i < c; i++) {
				log_promises.push(this.logs[i].toGPX());
			}
			return Promise.all(log_promises);
		}.bind(this)).then(function(_logs) {
			logs = _logs;
			var attrib_promises = [];
			for (var i = 0, c = this.attributes.length; i < c; i++) {
				attrib_promises.push(this.attributes[i].toGPX());
			}
			return Promise.all(attrib_promises);
		}.bind(this)).then(function(attributes) {
			var data = this.toJSON();
			data.logs = logs.join('\n');
			data.attributes = attributes.join('\n');
			data.short_description = CacheTour.escapeHTML(this.short_description);
			data.long_description = CacheTour.escapeHTML(this.long_description);
			data.lat = this.getCoordinates().getLatitude();
			data.lon = this.getCoordinates().getLongitude();
			data.available = this.available !== false ? 'TRUE' : 'FALSE';
			data.archived = this.archived ? 'TRUE' : 'FALSE';
			data.link = this.getLink();

			return CacheTour.useTemplate(template_gpx, data);
		}.bind(this));
	};
	Cache.prototype.toElement = function() {
		var element = $('<div class="cachetour_cache">');
		element.append($('<img class="cachetour_cache_icon" src="' + Cache.getTypeIcon(this.type) + '">'));
		element.append($('<div class="cachetour_cache_name"><a href="' + this.getLink() + '">' + this.name + '</a></div>'));
		element.append($('<div class="cachetour_cache_code">' + this.gc_code + '</div>'));
		element.append($('<div class="cachetour_cache_difficulty">' + this.difficulty + '</div>'));
		element.append($('<div class="cachetour_cache_terrain">' + this.terrain + '</div>'));
		element.append($('<div class="cachetour_cache_size">' + this.size + '</div>'));

		element.append($('<div class="fa fa-trash-o cachetour_cache_delete">').click(function() {
			this.Tour.removeCache(this);
		}.bind(this)));

		var updown = $('<div class="cachetour_cache_order">');
		updown.append($('<div class="cachetour_cache_up fa fa-chevron-up"></div>').click(function(){
			this.Tour.moveCacheUp(this);
		}.bind(this)));

		updown.append($('<div class="cachetour_cache_down fa fa-chevron-down"></div>').click(function(){
			this.Tour.moveCacheDown(this);
		}.bind(this)));

		element.append(updown);

		return element;
	};
	Cache.prototype.toJSON = function() {
		return {
			gc_code: this.gc_code,
			id: this.id,
			type: this.type,
			name: this.name,
			owner: this.owner,
			difficulty: this.difficulty,
			terrain: this.terrain,
			available: this.available,
			archived: this.archived,
			size: this.size,
			date: this.date
		};
	};
	Cache.prototype.toString = function() {
		return this.gc_code + " " + this.name;
	};
})();

(function(){
	"use strict";

	var Geo = unsafeWindow.Geo;

	var CacheParser = CacheTour.CacheParser = function(source, Cache) {
		this.source_raw = source;
		this.source = $(source);
		this.Cache = Cache ? Cache : new CacheTour.Cache();
		this.parseBaseData();
	};

	CacheParser.prototype.getCache = function() {
		return this.Cache;
	};
	
	CacheParser.prototype.parseBaseData = function() {
		var gc_code = this.source.find('#ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode').first().html();

		this.Cache.setId(this.source.find('.LogVisit').attr('href').match(/ID=(\d+)/)[1]);
		this.Cache.setGcCode(gc_code);
		this.Cache.setType(this.source.find('.cacheImage img').attr('src').replace(/^.*\/(\d+)\.gif.*$/,'$1'));
		this.Cache.setName(this.source.find('#ctl00_ContentBody_CacheName').first().text());
		this.Cache.setOwner(this.source.find('#ctl00_ContentBody_mcd1 a').first().text());
		this.Cache.setDate(this.source.find('#ctl00_ContentBody_mcd2').text().split('\n')[3].replace(/^ */,''));

		if (this.source.find('span.minorCacheDetails').first().text().match(/\((.+)\)/)) {
			this.Cache.setSize(RegExp.$1);
		}

		if (this.source.find('#ctl00_ContentBody_Localize12').first().html().match(/stars([\d_]+)\./)) {
			this.Cache.setTerrain(parseFloat(RegExp.$1.replace('_','.')));
		}

		if (this.source.find('#ctl00_ContentBody_uxLegendScale').first().html().match(/stars([\d_]+)\./)) {
			this.Cache.setDifficulty(parseFloat(RegExp.$1.replace('_','.')));
		}
		return this;
	};

	CacheParser.prototype.parseAllExtras = function() {
		return this
			.parseCoordinates()
			.parseAttributes()
			.parseDescription()
			.parseLogs();
	};

	CacheParser.prototype.parseAttributes = function() {
		this.Cache.clearAttributes();
		this.source.find('#ctl00_ContentBody_detailWidget img').each(function(key,el) {
			if ($(el).attr('src').match(/([^\/]*)-(yes|no)\./)) {
				this.Cache.addAttribute(CacheTour.Attribute.createByName(RegExp.$1, RegExp.$2 === 'no'));
			}
		}.bind(this));
		return this;
	};

	CacheParser.prototype.parseDescription = function() {
		this.Cache.setShortDescription(this.source.find('#ctl00_ContentBody_ShortDescription').first().html());
		this.Cache.setLongDescription(this.source.find('#ctl00_ContentBody_LongDescription').first().html());
		return this;
	};

	CacheParser.prototype.parseCoordinates = function() {
		var parts = this.source.find('#uxLatLon').text().match(/[NS] (.+) [EW] (.+)/);
		this.Cache.setCoordinates(new CacheTour.Coordinates(Geo.parseDMS(parts[1]), Geo.parseDMS(parts[2])));
		return this;
	};

	CacheParser.prototype.parseLogs = function(limit) {
		this.Cache.clearLogs();
		limit = limit || 20;
		if (this.source_raw.match(/initalLogs\s*=\s*(\{.*\});/)) {
			var initialLogs = JSON.parse(RegExp.$1).data;
			for (var i = 0, c = Math.min(limit, initialLogs.length); i < c; i++) {
				var Log = new CacheTour.Log();
				Log.setId(initialLogs[i].LogID)
					.setFinder(initialLogs[i].UserName)
					.setType(initialLogs[i].LogType)
					.setDate(initialLogs[i].Visited)
					.setText(CacheTour.escapeHTML(initialLogs[i].LogText));
				this.Cache.addLog(Log);
			}
		}
		return this;
	};
})();

(function() {
	"use strict";

	var Coordinates = CacheTour.Coordinates = function(latitude, longitude) {
		this.latitude = latitude || 0;
		this.longitude = longitude || 0;
	};

	Coordinates.prototype.setLatitude = function(latitude) {
		this.latitude = latitude;
		return this;
	};

	Coordinates.prototype.getLatitude = function() {
		return this.latitude;
	};

	Coordinates.prototype.setLongitude = function(longitude) {
		this.longitude = longitude;
		return this;
	};

	Coordinates.prototype.getLongitude = function() {
		return this.longitude;
	};

	Coordinates.prototype.getDistance = function(OtherCoordinates) {
		//@todo this method isn't entirely correct for geo-coordinates
		return Math.sqrt(Math.pow(this.latitude - OtherCoordinates.getLatitude(), 2) + Math.pow(this.longitude - OtherCoordinates.getLongitude(), 2));
	};

	Coordinates.prototype.toString = function() {
		return (this.latitude > 0 ? "N " : "S ") + this.latitude + (this.longitude > 0 ? " E " : " W ") + this.longitude;
	};
})();

(function(){
	"use strict";

	var template_gpx = 
		'<groundspeak:log id="<% id %>">\n' +
			'<groundspeak:date><% date %></groundspeak:date>\n' +
			'<groundspeak:type><% type %></groundspeak:type>\n' +
			'<groundspeak:finder><% finder %></groundspeak:finder>\n' +
			'<groundspeak:text encoded="false"><% text %></groundspeak:text>\n' +
		'</groundspeak:log>';

	var Log = window.CacheTour.Log = function() {
	};

	Log.prototype.getId = function() {
		return this.id;
	};
	Log.prototype.setId = function(id) {
		this.id = id;
		return this;
	};

	Log.prototype.getDate = function() {
		return this.date;
	};
	Log.prototype.setDate = function(date) {
		this.date = date;
		return this;
	};

	Log.prototype.getType = function() {
		return this.type;
	};
	Log.prototype.setType = function(type) {
		this.type = type;
		return this;
	};

	Log.prototype.getFinder = function() {
		return this.finder;
	};
	Log.prototype.setFinder = function(finder) {
		this.finder = finder;
		return this;
	};

	Log.prototype.getText = function() {
		return this.finder;
	};
	Log.prototype.setText = function(text) {
		this.text = text;
		return this;
	};

	Log.prototype.toGPX = function() {
		return new Promise(function(resolve, reject) {
			resolve(CacheTour.useTemplate(template_gpx, {
				id: this.id,
				date: this.date,
				type: this.type,
				finder: CacheTour.escapeHTML(this.finder),
				text: this.text
			}));
		}.bind(this));
	};
})();


(function(){
	"use strict";

	var Module = CacheTour.Module = function(options) {
		options = options || {};
		this.name = options.name || 'UNKNOWN';
		this.requirements = options.requirements || {};
		if (typeof options.run === 'function') {
			this.run_function = options.run;
		}
		if (typeof options.init === 'function') {
			this.init_function = options.init;
		}
	};

	Module.prototype.shouldRun = function() {
		return (
				!this.requirements.setting || CacheTour.getSetting(this.requirements.setting)
			) && (
				!this.requirements.url || this.requirements.url.test(document.location.href)
			) && (
				!this.requirements.element || (
					!!(this.element = $(this.requirements.element).first()) &&
					this.element.length > 0
				)
			);
	};

	Module.prototype.getName = function() {
		return this.name;
	};

	Module.prototype.init = function() {
		if (this.init_function) {
			this.init_function();
		}
		return this;
	};
	Module.prototype.run = function() {
		if (this.run_function) {
			this.run_function(this.element);
		}
		return this;
	};

})();


(function(){
	"use strict";

	var template_gpx =
	'<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>\n' +
	'<gpx xmlns:xsi="http://www.w3.org/2001/xmlschema-instance" xmlns:xsd="http://www.w3.org/2001/xmlschema" version="1.0" creator="cachetour" xsi:schemalocation="http://www.topografix.com/gpx/1/0 http://www.topografix.com/gpx/1/0/gpx.xsd http://www.groundspeak.com/cache/1/0/1 http://www.groundspeak.com/cache/1/0/1/cache.xsd" xmlns="http://www.topografix.com/gpx/1/0">\n' +
		'<name><% name %></name>\n' +
		'<desc><% description %></desc>\n' +
		'<author>CacheTour</author>\n' +
		'<url>http://www.geocaching.com</url>\n' +
		'<urlname>geocaching - high tech treasure hunting</urlname>\n' +
		// '<time>' + xsddatetime(new date()) + '</time>\n' +
		'<keywords>cache, geocache</keywords>\n' +
		'<bounds minlat="<% minlat %>" minlon="<% minlon %>" maxlat="<% maxlat %>" maxlon="<% maxlon %>" />\n' +
		'<% caches %>\n' +
		'<% waypoints %>\n' +
	'</gpx>';

	var Tour = window.CacheTour.Tour = function(name){
		this.name = name || 'Tour ' + (new Date()).toISOString().substr(0, 10);
		this.caches = [];
		return this;
	};

	Tour.fromJSON = function(data) {
		var tour = new Tour(data.name);
		if (data.caches) {
			for (var i = 0, c = data.caches.length; i < c; i++) {
				tour.addCache(CacheTour.Cache.fromJSON(data.caches[i]).setTour(this));
			}
		}
		return tour;
	};

	Tour.prototype.addCache = function(Cache) {
		if (!this.hasCache(Cache)) {
			this.caches.push(Cache.setTour(this));
			this.fireChange();
		}
		return this;
	};
	Tour.prototype.hasCache = function(Cache) {
		for (var i = 0, c = this.caches.length; i < c; i++) {
			if (this.caches[i].matches(Cache)) return true;
		}
		return false;
	};
	Tour.prototype.moveCacheDown = function(Cache) {
		for (var i = 0, c = this.caches.length - 1; i < c; i++) {
			if (this.caches[i].matches(Cache)) {
				this.caches[i] = this.caches[i + 1];
				this.caches[i + 1] = Cache;
				this.fireChange();
				return true;
			}
		}
		return false;
	};
	Tour.prototype.moveCacheUp = function(Cache) {
		for (var i = 1, c = this.caches.length; i < c; i++) {
			if (this.caches[i].matches(Cache)) {
				this.caches[i] = this.caches[i - 1];
				this.caches[i - 1] = Cache;
				this.fireChange();
				return true;
			}
		}
		return false;
	};
	Tour.prototype.removeCache = function(Cache) {
		for (var i = 0, c = this.caches.length; i < c; i++) {
			if (this.caches[i].matches(Cache)) {
				this.caches.splice(i,1);
				this.fireChange();
				return true;
			}
		}
		return false;
	};
	
	Tour.prototype.getName = function() {
		return this.name;
	};
	Tour.prototype.setName = function(name) {
		this.name = name;
		this.fireChange();
	};

	Tour.prototype.getDescription = function() {
		return this.description;
	};
	Tour.prototype.setDescription = function(description) {
		this.description = description;
		this.fireChange();
	};

	Tour.prototype.onChange = function(callback) {
		this.change_callback = callback;
	};
	Tour.prototype.fireChange = function() {
		if (this.change_callback) {
			this.change_callback();
		}
		return CacheTour;
	};

	Tour.prototype.getCaches = function() {
		return this.caches;
	};

	Tour.prototype.getBounds = function() {
		var min = new CacheTour.Coordinates(999,999),
			max = new CacheTour.Coordinates();
		for (var i = 0, c = this.caches.length; i < c; i++) {
			if (this.caches[i].getCoordinates().getLatitude() < min.getLatitude()) {
				min.setLatitude(this.caches[i].getCoordinates().getLatitude()); 
			}
			if (this.caches[i].getCoordinates().getLatitude() > max.getLatitude()) {
				max.setLatitude(this.caches[i].getCoordinates().getLatitude()); 
			}

			if (this.caches[i].getCoordinates().getLongitude() < min.getLongitude()) {
				min.setLongitude(this.caches[i].getCoordinates().getLongitude()); 
			}
			if (this.caches[i].getCoordinates().getLongitude() > max.getLongitude()) {
				max.setLongitude(this.caches[i].getCoordinates().getLongitude()); 
			}
		}
		return {
			min: min,
			max: max
		};
	};

	Tour.prototype.toGPX = function(on_progress) {
		var cache_promises = [],
		cache_done = function(gpx){
			on_progress('cache', 'done', i);
			return gpx;
		};
		on_progress = on_progress || function(){};
		on_progress('tour', 'start');
		for (var i = 0, c = this.caches.length; i < c; i++) {
			on_progress('cache', 'start', i);
			cache_promises.push(this.caches[i].toGPX().then(cache_done));
		}
		return Promise.all(cache_promises).then(function(caches) {
			on_progress('tour', 'caches_done');
			var bounds = this.getBounds();

			on_progress('tour', 'done');
			return CacheTour.useTemplate(template_gpx, {
				name: this.name,
				caches: caches.join(''),
				minlat: bounds.min.getLatitude(),
				minlon: bounds.min.getLongitude(),
				maxlat: bounds.max.getLatitude(),
				maxlon: bounds.max.getLongitude()
			});
		}.bind(this));
	};
	Tour.prototype.toElement = function() {
		var element = $('<div class="cachetour_tour">'),
			header = $('<div class="cachetour_tour_header">' + this.name + '</div>');
		header.append($('<div class="cachetour_tour_rename fa fa-pencil" title="' + CacheTour.l10n('rename_tour') + '">').click(function() {
			var new_name = prompt(CacheTour.l10n('choose_name'), this.name);
			if (new_name) {
				this.setName(new_name);
				CacheTour.saveSettings();
			}
		}.bind(this)));
		element.append(header);
		for (var i = 0, c = this.caches.length; i < c; i++) {
			element.append(this.caches[i].toElement());
		}
		return element;
	};
	Tour.prototype.toJSON = function() {
		var data = {
			name: this.name,
			description: this.description,
			caches: []
		};
		for (var i = 0, c = this.caches.length; i < c; i++) {
			data.caches.push(this.caches[i].toJSON());
		}
		return data;
	};
	Tour.prototype.toString = function() {
		var out = "";
		for (var i = 0, c = this.caches.length; i < c; i++) {
			out = out + this.caches[i].toString() + "\n";
		}
		return out;
	};

})();

(function() {
	"use strict";

	var gui,
		tour_wrapper,
		tour_select_wrapper,
		tour_select,
		tour,
		mask,
		mask_message;

	var Gui = CacheTour.Gui = new CacheTour.Module({name: 'Gui'});

	Gui.shouldRun = function(){
		return true;
	};

	Gui.init = function() {
		tour = CacheTour.getCurrentTour();
	};

	Gui.run = function() {
 		gui = $('<div id="cachetour_gui">').appendTo(document.body);
		
		var header = $('<div id="cachetour_header">').appendTo(gui);
		$('<i class="fa fa-archive main-icon">').appendTo(header);
		$('<span id="cachetour_header">CacheTour</span>').appendTo(header);

		var pin = $('<div id="cachetour_pin" class="fa-stack" title="' + CacheTour.l10n('keep_expanded') + '">');
		gui.append(pin);
		pin.append($('<div class="fa fa-thumb-tack fa-stack-1x">'));
		pin.append($('<div class="fa fa-ban fa-stack-2x">'));
		pin.on("click",function(){
			gui.toggleClass("cachetour_pinned");
			CacheTour.setSetting("pinned", gui.hasClass("cachetour_pinned"));
		});
		if (CacheTour.getSetting("pinned")) {
			gui.addClass("cachetour_pinned");
		}

		var buttonbar = $('<div id="cachetour_buttonbar">').appendTo(gui);
		$('<div class="fa fa-download" title="' + CacheTour.l10n('download_gpx_file') + '">').appendTo(buttonbar).click(downloadGPX);

		$('<div class="fa fa-plus" title="' + CacheTour.l10n('add_new_tour') + '">').appendTo(buttonbar).click(function(){
			var tour = new CacheTour.Tour(),
				new_name = prompt(CacheTour.l10n('choose_name'), tour.getName());
			if (new_name) {
				tour.setName();
				CacheTour.addTour(tour);
			}
		});
		$('<div class="fa fa-cog" title="' + CacheTour.l10n('settings') + '">').appendTo(buttonbar).click(showSettingsDialog);

		initTourSelect();
		Gui.updateCacheList();

		return Gui;
 	};

 	function initTourSelect() {
		tour_wrapper = $('<div id="cachetour_tour_wrapper">').appendTo(gui);
		tour_select_wrapper = $('<div id="cachetour_select_wrapper">');
		$('<div class="fa fa-caret-square-o-down" id="cachetour_tour_select_btn" title="' + CacheTour.l10n('select_tour') + '">').appendTo(tour_select_wrapper);
		gui.delegate('#cachetour_tour_select_btn', 'click', toggleTourSelect);
		tour_select = $('<div id="cachetour_select">').appendTo(tour_select_wrapper);
	}
 	
 	function downloadGPX() {
		var count = CacheTour.getCurrentTour().getCaches().length,
			caches_done = 0;

		gui.addClass('cachetour_working');
		Gui.showWaitMessage(CacheTour.l10n('download_gpx_progress').replace('%done%', '0').replace('%count%', count));

		CacheTour.getCurrentTour().toGPX(function(phase, state, index){
			if (phase === 'cache' && state === 'done') {
				caches_done++;
				$('.cachetour_cache').eq(index).addClass('cachetour_done');
				Gui.showWaitMessage(CacheTour.l10n('download_gpx_progress').replace('%done%', caches_done).replace('%count%', count));
			}
		}).then(function(content) {
			CacheTour.saveFile(CacheTour.getCurrentTour().getName() + ".gpx", content);
		}).then(function(){
			Gui.hideWaitMessage();
			gui.removeClass('cachetour_working');
		});
	}

	Gui.showWaitMessage = function(message) {
		Gui.showMask();
		if (!mask_message) {
			mask_message = $('<div id="cachetour_mask_message">').appendTo(mask);
		}
		mask.empty()
			.append($('<i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw">'))
			.append(mask_message);
		mask_message.html(message || CacheTour.l10n('please_wait'));
	};

	Gui.showMask = function(message) {
		if (!mask) {
			mask = $('<div id="cachetour_mask">').appendTo(document.body);
		}
		mask.removeClass('hidden');
		return Gui;
	};

	Gui.hideMask = Gui.hideWaitMessage = function () {
		if (mask) {
			mask.addClass('hidden');
		}
		return Gui;
	};

	Gui.setTour = function(_tour) {
		tour = _tour;
		Gui.updateCacheList();
	};

	Gui.updateCacheList = function() {
		tour_wrapper.empty()
			.append(tour.toElement())
			.append(tour_select_wrapper);
		return Gui;
	};
	
	function showTourSelect() {
		tour_select.empty();
		var tours = CacheTour.getTours();
		for (var i = 0, c = tours.length; i < c; i++) {
			$('<div class="cachetour_select_item" data-index="' + i + '">' + tours[i].getName() + '</div>').appendTo(tour_select);
		}
		tour_select.delegate('.cachetour_select_item', 'click', function(target) {
			CacheTour.setTourIndex($(this).attr('data-index'));
			hideTourSelect();
		});
		tour_select_wrapper.addClass('cachetour_show');
		return Gui;
	}

	function hideTourSelect() {
		tour_select_wrapper.removeClass('cachetour_show');
		return Gui;
	}

	function toggleTourSelect() {
		if (tour_select_wrapper.hasClass('cachetour_show')) {
			hideTourSelect();
		} else {
			showTourSelect();
		}
	}

	var settings_dialog;

	function createSettingRow(label, element) {
		return $('<tr><td>' + label + '</td></tr>').append($('<td>').append(element));
	}

	function initSettingsDialog() {
		if (settings_dialog) return settings_dialog;

		settings_dialog = $('<div id="cachetour_settings_dialog"><div>CacheTour - ' + CacheTour.l10n('settings') + '</div></div>');
		$('<div class="fa fa-times" id="cachetour_settings_close">').appendTo(settings_dialog);
		var table = $('<table>').appendTo(settings_dialog);

		var language_select = $('<select id="cachetour_settings_language">');
		// @todo: automate creation of language <option>s
		$('<option value="en">English</option>').appendTo(language_select);
		$('<option value="de">Deutsch</option>').appendTo(language_select);

		createSettingRow(CacheTour.l10n('language') + ':', language_select).appendTo(table);
		createSettingRow('', $('<input type="button" id="cachetour_settings_save" value="' + CacheTour.l10n('save') + '">')).appendTo(table);

		return settings_dialog;
	}

	function showSettingsDialog() {
		initSettingsDialog();

		Gui.showMask();
		mask.empty().append(settings_dialog);
		//(re)add event after the element is in the DOM
		$('#cachetour_settings_save').click(saveSettings);
		$('#cachetour_settings_close').click(hideSetttingsDialog);

		$('#cachetour_settings_language').attr('value', CacheTour.getSetting('locale'));
	}

	function hideSetttingsDialog() {
		Gui.hideMask();
	}

	function saveSettings() {
		hideSetttingsDialog();
		CacheTour.setSetting('locale', $('#cachetour_settings_language').attr('value'));
		// document.location.reload();
	}

	CacheTour.registerModule(Gui);
})();


(function(){
	"use strict";

	CacheTour.registerModule(
		new CacheTour.Module({
			name: 'Add latlng.js',
			run: function() {
				if ($('script[src*="latlng.js"]').length===0) {
					$('<script src="https://www.geocaching.com/js/latlng.js">').appendTo(document.body);
				}
			},
			shouldRun: function() {
				return true;
			}
		})
	);

})();

/* jshint multistr: true */
(function(){
	"use strict";
	
	var StylesJS = new CacheTour.Module({name: "main styles"});
	StylesJS.shouldRun = function() {
		return true;
	};
	StylesJS.run = function() {};
	window.CacheTour.registerModule(StylesJS);


	StylesJS.init = function(){
		CacheTour.addStyle(
'#cachetour_gui {\
	position: fixed;\
	right: 0;\
	top: 80px;\
	width:24px;\
	height:24px;\
	border-style: solid;\
	border-width: 2px 0 2px 2px;\
	border-color: #f4f3ed;\
	border-radius: 5px 0 0 5px;\
	background: white;\
	padding: 6px 10px;\
	z-index:1100;\
	overflow: hidden;\
}\
#cachetour_gui, #cachetour_gui * {\
	box-sizing: content-box;\
}\
#cachetour_gui:hover, #cachetour_gui.cachetour_pinned {\
	width: 280px;\
	height: 85%;\
}\
\
#cachetour_header {\
	font-weight:bold;\
	font-size:x-large;\
	line-height: 24px;\
}\
#cachetour_header span {\
	visibility:hidden;\
	display:inline-block;\
	margin-left:4px;\
}\
#cachetour_header i {\
	color: #2d4f15;\
	font-size: x-large;\
}\
#cachetour_gui.cachetour_pinned #cachetour_header span, #cachetour_gui:hover #cachetour_header span {\
	visibility:visible;\
}\
\
#cachetour_tour_wrapper {\
	border-radius:2px;\
	position:relative;\
}\
#cachetour_tour_wrapper:empty {\
	text-align: center;\
	font-style: italic;\
}\
#cachetour_tour_wrapper:empty:before {\
	content: "- No entries -";\
}\
\
#cachetour_pin {\
	position: absolute;\
	right: 5px;\
	top: 4px;\
	cursor: pointer;\
	visibility:hidden;\
}\
\
#cachetour_gui #cachetour_pin .fa-ban {\
	display: none;\
	color: gray;\
}\
\
#cachetour_gui.cachetour_pinned #cachetour_pin, #cachetour_gui:hover #cachetour_pin {\
	visibility:visible;\
}\
\
#cachetour_gui.cachetour_pinned #cachetour_pin .fa-ban {\
	display:block;\
}\
\
.cachetour_clear {\
	clear:both;\
}\
\
.cachetour_tour {\
	counter-reset: tour;\
}\
\
#cachetour_select_wrapper {\
	position:absolute;\
	top:0;\
	left:0;\
	width: 100%;\
}\
#cachetour_tour_select_btn {\
	font-size: large;\
	line-height: inherit;\
	cursor:pointer;\
}\
.cachetour_tour_header {\
	font-size: larger;\
	border-bottom: 1px solid black;\
	text-overflow: ellipsis;\
	white-space: nowrap;\
	overflow: hidden;\
	position:relative;\
	padding: 0 1.5em;\
}\
.cachetour_tour_rename {\
	position: absolute;\
	right: 0.3em;\
	top: 0.3em;\
	cursor: pointer;\
	z-index:1100;\
}\
\
.cachetour_cache {\
	border: 1px dashed #DCDCDC;\
	border-radius: 6px;\
	margin-top: 6px;\
	padding: 3px 6px 3px 36px;\
	position:relative;\
}\
.cachetour_cache_icon {\
	width: 16px;\
	height: 16px;\
	position: absolute;\
	top: 4px;\
}\
.cachetour_working .cachetour_cache {\
	background-color: #DCDCDC;\
}\
.cachetour_working .cachetour_cache.cachetour_done {\
	background-color: #D7FFD7;\
}\
.cachetour_cache_name {\
	overflow: hidden;\
	margin-left: 20px;\
}\
.cachetour_cache_code {\
	font-family: monospace;\
	display: inline-block;\
	width:25%;\
}\
.cachetour_cache .cachetour_cache_delete {\
	position: absolute;\
	top: 1px;\
	right: 1px;\
	color: gray;\
	background-color: white;\
	padding: 3px;\
	cursor: pointer;\
	display: none;\
}\
.cachetour_cache:hover .cachetour_cache_delete {\
	display: block;\
}\
.cachetour_cache::before {\
	counter-increment: tour;\
	content: counters(tour, ".") ".";\
	position: absolute;\
	left: 6px;\
	font-size: x-large;\
	color: gray;\
	overflow: hidden;\
	top: -4px;\
}\
.cachetour_cache_difficulty, .cachetour_cache_terrain, .cachetour_cache_size {\
	display: inline-block;\
	position: relative;\
	width: calc(25% - .7em);\
	padding-left:.2em;\
	margin-left:.5em;\
}\
\
.cachetour_cache_difficulty::before, .cachetour_cache_terrain::before, .cachetour_cache_size::before {\
	font-style: italic;\
	font-size: smaller;\
	position: absolute;\
	left: -1.2em;\
	top: 0.2em;\
}\
.cachetour_cache:hover .cachetour_cache_difficulty::before {\
	content: "D: ";\
}\
.cachetour_cache:hover .cachetour_cache_terrain::before {\
	content: "T: ";\
}\
.cachetour_cache:hover .cachetour_cache_size::before {\
	content: "S: ";\
}\
\
.cachetour_cache_order {\
	position: absolute;\
	left: 4px;\
	bottom: 2px;\
	display: none;\
	color: gray;\
}\
.cachetour_cache_order > * {\
	cursor: pointer;\
}\
.cachetour_cache:hover .cachetour_cache_order {\
	display: block;\
}\
.cachetour_tour_header + .cachetour_cache .cachetour_cache_up {\
	visibility: hidden;\
}\
.cachetour_cache:last-of-type .cachetour_cache_down {\
	visibility: hidden;\
}\
#cachetour_buttonbar {\
	border-bottom: 1px dashed lightgray;\
	margin: 4px 0 8px 0;\
}\
#cachetour_buttonbar > div {\
	margin: 0 3px;\
	font-size:larger;\
	cursor: pointer;\
}\
\
#cachetour_mask {\
	position: fixed;\
	top:0;\
	bottom:0;\
	left:0;\
	right:0;\
	background-color: rgba(68, 68, 68, .8);\
	z-index: 1101;\
}\
\
.hidden {\
	display:none !important;\
}\
#cachetour_mask > .fa {\
	position: absolute;\
	top: 50%;\
	width:100%;\
	color: white;\
}\
#cachetour_mask > .fa::before {\
	position: absolute;\
	transform: translate(-50%, -50%);\
}\
#cachetour_mask_message {\
	position: absolute;\
	left:50%;\
	top:50%;\
	transform: translate(-50%, 32px);\
	color:white;\
	font-size: x-large;\
	background: rgba(68, 68, 68, 1);\
	padding: 12px 14px;\
	border-radius: 12px;\
	text-align: center;\
}\
#cachetour_select {\
	background: white;\
	font-size: larger;\
	padding: 6px;\
	border: 1px solid black;\
	border-radius: 6px;\
	display:none;\
}\
#cachetour_select_wrapper.cachetour_show #cachetour_select {\
	display:block;\
}\
.cachetour_select_item {\
	border: 1px dashed #DCDCDC;\
	border-radius: 4px;\
	padding: 2px 4px;\
	cursor: pointer;\
}\
.cachetour_select_item + .cachetour_select_item {\
	margin-top:4px;\
}\
.cachetour_select_item:hover {\
	border-color: black;\
}\
#cachetour_settings_dialog {\
	position:relative;\
	background: white;\
	border: 1px solid black;\
	width: 600px;\
	margin: 65px auto 0;\
	padding: 12px;\
	border-radius: 6px;\
}\
#cachetour_settings_dialog table {\
	width:100%;\
	margin-bottom: 0;\
}\
\
#cachetour_settings_dialog tr td:first-of-type {\
	width: 100px;\
}\
#cachetour_settings_dialog div:first-of-type {\
	font-size: large;\
	font-weight: bold;\
	margin-bottom: 12px;\
}\
#cachetour_settings_dialog select, #cachetour_settings_dialog input {\
	min-width: 120px;\
	padding: 3px;\
}\
#cachetour_settings_save {\
	font-weight: bold;\
	float: right;\
}\
#cachetour_settings_close {\
	position:absolute;\
	top:6px;\
	right:6px;\
	cursor:pointer;\
}\
#cachetour_settings_close:hover {\
	color: red;\
}\
\
'
		);
	};
})();


(function(){
	"use strict";

	CacheTour.registerModule(
		new CacheTour.Module({
			name: "Cache details page",
			requirements: {url: /\/geocache\/|\/cache_details.aspx/},
			run: function() {
				var gpx_button = $('#ctl00_ContentBody_btnSendToGPS').first(),
					add_to_tour_button = gpx_button.clone();

				add_to_tour_button
					.attr("id","cachetour_add_to_tour")
					.attr("onclick","return false")
					.attr("value","Add to Tour");

				add_to_tour_button.click(function(event) {
					event.preventDefault();

					var Parser = new CacheTour.CacheParser(document.body);
					CacheTour.getCurrentTour().addCache(Parser.getCache());
					return false;
				});

				gpx_button.parent().append(add_to_tour_button);
			}
		})
	);
})();

(function(){
	"use strict";

	CacheTour.registerModule(
		new CacheTour.Module({
			name: 'Map',
			requirements: {
				url: /\/map\//
			},
			init: function() {
				CacheTour.addStyle('#cachetour_gui { top:20%; }');
				CacheTour.addStyle('#cachetour_gui:hover, #cachetour_gui.cachetour_pinned { height:75%; }');

				var template = $("#cacheDetailsTemplate");
				template.html(template.html().replace(
					/<span>Log Visit<\/span>/,
					"<span>Log Visit</span></a>\n" +
					"<a class=\"lnk cachetour_add_to_tour\" href=\"#\" " +
						"onclick=\"$('#cachetour_add_to_tour').click(); return false;\" " +
						"data-gc-code=\"{{=gc}}\" " +
						"data-type=\"{{=type.value}}\" " +
						"data-name=\"{{=name}}\" " +
						"data-size=\"{{=container.text}}\" " +
						"data-difficulty=\"{{=difficulty.text}}\" " +
						"data-terrain=\"{{=terrain.text}}\"" +
					">\n" +
					"<img src=\"/images/icons/16/write_log.png\"><span>Add to Tour</span>"
				));
				
				$(unsafeWindow.document.body).delegate('.cachetour_add_to_tour', 'click', function() {
					console.log($(this));
				});

				/*
				 * In Firefox, the sandbox is quite restrictive, so you can't add event handlers
				 * to elements you didn't create yourself. But you may trigger events on elements
				 * you created from outside of the sandbox.
				 * So here I create one static element, whose click event is triggered by the
				 * links that are created from the template above.
				 * Maybe someday I'll find a better solution for this, but this works for now.
				 */
				CacheTour.addStyle('#cachetour_add_to_tour { display:none; }');
				var add_btn = $('<button id="cachetour_add_to_tour">Add Cache</button>').appendTo(document.body).click(function(){
					var cache_link = $('.cachetour_add_to_tour');
					console.log(cache_link);
					if (cache_link && cache_link.attr('data-gc-code')) {
						CacheTour.getCurrentTour().addCache(
								(new CacheTour.Cache(cache_link.attr('data-gc-code')))
								.setName(cache_link.attr('data-name'))
								.setType(cache_link.attr('data-type'))
								.setSize(cache_link.attr('data-size').toLowerCase())
								.setDifficulty(cache_link.attr('data-difficulty'))
								.setTerrain(cache_link.attr('data-terrain'))
						);
					}
				});
			}
		})
	);
})();

(function() {
	"use strict";

	CacheTour.registerLocale('de', {
		download_gpx_file: "GPX-Datei herunterladen",
		download_gpx_progress: "Erstelle GPX<br />%done% von %count% Caches erledigt",
		add_new_tour: "Tour hinzufügen",
		choose_name: "Name wählen",
		please_wait: "Bitte warten...",
		select_tour: "Tour auswählen",
		rename_tour: "Tour umbenennen",
		keep_expanded: "Immer ausgeklappt",
		settings: "Einstellungen",
		save: "Speichern",
		language: "Sprache"
	});
})();


(function() {
	"use strict";

	CacheTour.registerLocale('en', {
		download_gpx_file: "Download GPX file",
		download_gpx_progress: "Creating GPX<br />%done% of %count% Caches done",
		add_new_tour: "Add new tour",
		choose_name: "Choose a name",
		please_wait: "Please wait...",
		select_tour: "Select tour",
		rename_tour: "Rename tour",
		keep_expanded: "Keep expanded",
		cachetype_2: "Traditional Cache",
		cachetype_3: "Multi-Cache",
		cachetype_4: "Virtual Cache",
		cachetype_5: "Letterbox Hybrid",
		cachetype_6: "Event Cache",
		cachetype_8: "Mystery Cache",
		cachetype_11: "Webcam Cache",
		cachetype_13: "Cache In Trash Out Event",
		cachetype_earthcache: "EarthCache",
		settings: "Settings",
		save: "Save",
		language: "Language"
	});
})();


CacheTour.initialize();
