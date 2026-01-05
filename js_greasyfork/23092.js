// ==UserScript==
// @name         Mount Olympus
// @namespace    mobiusevalon.tibbius.com
// @version      2.0-7
// @author       Mobius Evalon
// @description  Common features shared amongst all Olympian scripts.
// @license      Creative Commons Attribution-ShareAlike 4.0; http://creativecommons.org/licenses/by-sa/4.0/
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @require      https://code.jquery.com/ui/1.11.4/jquery-ui.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.26.0/js/jquery.tablesorter.min.js
// @include      /^https{0,1}:\/\/\w{0,}\.?mturk\.com.+/
// @include      /^https{0,1}:\/\/\w*\.amazon\.com\/ap\/signin.*(?:openid\.assoc_handle|pf_rd_i)=amzn_mturk/
// @exclude      /&hit_scraper$/
// @exclude      /\/HM$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23092/Mount%20Olympus.user.js
// @updateURL https://update.greasyfork.org/scripts/23092/Mount%20Olympus.meta.js
// ==/UserScript==

if(window.olympus === undefined) window.olympus = {};

// there is a reason they are initialized in this order
window.olympus.__name = "olympus";
window.olympus.__version = "2.0-7";
window.olympus.__href = "https://greasyfork.org/en/scripts/23092-mount-olympus";
window.olympus.known_olympians = ["harpocrates","hermes","artemis","athena"];
window.olympus.default_settings = {
	query_turkopticon:true,
	use_to_cache:true,
	to_cache_timeout:10800000,
	to_pay_weight:6.5,
	to_fair_weight:4,
	to_fast_weight:1,
	to_comm_weight:0.5,
	bayesian_to:true,
	bayesian_reviews:75,
	bayesian_average:2.75
};

window.olympus.__init = function() {
	console.log("olympus init");

	Array.prototype.contains = function(item) {
		return (this.indexOf(item) > -1);
	};

	String.prototype.collapseWhitespace = function() {
		return this.replace(/\s{2,}/g," ").trim();
	};

	String.prototype.contains = function(substring) {
		return (this.indexOf(substring) > -1);
	};

	String.prototype.ucFirst = function() {
		return (this.charAt(0).toUpperCase()+this.slice(1));
	};

	olympus.style.add(
		"#javascriptDependentFunctionality {display: block !important;}"+
		".dialog.floats {border-radius: 8px; border: 2px solid #000000; max-height: 550px; position: absolute !important; z-index: 500; background-color: #7fb4cf; top: 25px; left: 200px; font-size: 12px;} "+
		".dialog.narrow {width: 300px; min-width: 300px;} "+
		".dialog.wide {width: 550px; min-width: 550px;} "+
		".dialog .scrolling-content {max-height: 350px; overflow-y: auto;} "+
		".dialog .actions {margin: 10px auto; padding: 0px; text-align: center; display: block;} "+
		".dialog .actions input:not(:last-of-type) {margin-right: 15px;} "+
		".dialog .head {padding: 0px; margin: 10px auto; font-size: 175%; font-weight: bold; width: 100%; text-align: center; cursor: move;} "+
		"#olympian_help p.inset {margin-left: 25px;}"+
		"#olympian_help p.inset b {margin-left: -25px; display: block;}"+
		"#olympian_settings .sidebar {float: left; min-width: 100px; padding-left: 5px;}"+
		"#olympian_settings .sidebar .tab {border-radius: 8px 0 0 8px; height: 30px; line-height: 30px; text-align: center; font-weight: bold; cursor: pointer;}"+
		"#olympian_settings .sidebar .tab.active {background-color: #88c1de;}"+
		"#olympian_settings .container {background-color: #88c1de; padding: 5px; margin-right: 5px; min-height: 150px;}"+
		"#olympian_settings .subheader {font-size: 125%; font-weight: bold; margin-bottom: 10px; background-color: #96d5f5; padding: 5px 0px 5px 5px;}"+
		"#olympian_settings .container .option_container {display: block;}"+
		"#olympian_settings .container .option_container b.name {width: 150px; display: inline-block; margin-right: 10px;}"+
		"#olympian_settings .container .description {margin-top: 5px; margin-bottom: 10px; font-size: 90%; padding-left: 10px;}"+
		"#olympian_settings .container .description .toggle {margin-right: 5px;}"+
		"#olympian_settings .container .description .collapsed {display: inline-block; width: 350px; height: 16px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;}"+
		"#olympian_settings .container .sublabel {width: 50px; display: inline-block; margin-right: 5px; text-align: right;}"+
		"#olympian_settings .container .fa-toggle-off, #olympian_settings .container .fa-toggle-on {width: 47px; text-align: center;}"+
		"#olympian_settings .container .fa-toggle-off {color: #000;}"+
		"#olympian_settings .container .fa-toggle-on {color: #fff;}"+
		"#olympian_settings .container .fa-toggle-off, #olympian_settings .container .fa-toggle-on, #olympian_settings .container .fa-plus-square-o, #olympian_settings .container .fa-minus-square-o {cursor: pointer;}"+
		"#olympian_settings .container input[type='number'] {width: 45px;}"+
		"#olympian_settings .container .plain {margin-bottom: 20px;}"+
		"#open_olympus_settings {cursor: pointer;}"+
		".olympian_identifier {display: block; margin: 5px auto 10px auto; text-align: center; font-size: 150%; font-weight: bold;}"+
		".anim_pulse {animation-name: anim_pulse; animation-duration: 350ms; animation-iteration-count: infinite; animation-timing-function: linear; animation-direction: alternate;}"+
		"@keyframes anim_pulse {from {opacity: 1;} to {opacity: 0.25;}} "
	);

	// append the fontawesome stylesheet to the page if it does not exist
	if(!$("link[rel='stylesheet'][href$='font-awesome.min.css']").length) $("head").append(
		$("<link/>")
			.attr({
				"data-pantheon":"olympus",
				"rel":"stylesheet",
				"href":"https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css"
			})
	);

	// append the help window to the document
	$("body").append(
		$("<div/>")
			.attr({
				"data-pantheon":"olympus",
				"id":"olympian_help",
				"class":"dialog wide floats"
			})
			.append(
				$("<h1/>")
					.attr("class","head")
					.text("Olympian help"),
				$("<div/>")
					.attr("class","scrolling-content")
					.append(
						$("<div/>").attr("class","explain")
					),
				$("<div/>")
					.attr("class","actions")
					.append(
						$("<button/>")
							.text("Close")
							.click(function() {
								olympus.help.hide();
							})
					)
			)
			.hide(),
		$("<div/>")
			.attr({
				"data-pantheon":"olympus",
				"id":"olympian_settings",
				"class":"dialog wide floats"
			})
			.append(
				$("<h1/>")
					.attr("class","head")
					.text("Olympian settings"),
				$("<div/>").attr("class","sidebar"),
				$("<div/>")
					.attr("class","scrolling-content")
					.append(
						$("<div/>").attr("class","container")
					),
				$("<div/>")
					.attr("class","actions")
					.append(
						$("<button/>")
							.text("Close")
							.click(function() {
								olympus.settings.hide();
							})
					)
			)
			.hide()
	);

	this.settings.init(this);

	// use jqueryui.draggable() to make the help window movable
	$(".floats").draggable({handle:"h1.head"});

	// put the settings icon on the page
	$("span.header_links").first().before(
		olympus.settings.button("olympus")
			.addClass("fa-3x")
			.css({
				"float":"right",
				"margin-left":"5px"
			})
	);

	$.each(this.known_olympians,function(index,olympian) {
		if($.type(olympus[olympian]) === "object") { // olympian is installed
			olympus.settings.init(olympus[olympian]); //if(olympus[olympian].hasOwnProperty("__configurable")) olympus.settings.init(olympus[olympian]);
			olympus[olympian].__init();
		}
	});
};

window.olympus.__configurable = function() {
	function _gen_to_weight_element(type) {
		return $("<span/>")
			.attr("class","sublabel")
			.text(type.ucFirst()+":")
			.add(
				olympus.settings._gen_option({
					option:("to_"+type+"_weight"),
					type:"number",
					value:olympus.settings.get(olympus,("to_"+type+"_weight"))
				})
			);
	}

	return [
		olympus.settings.explain({
			type:"plain",
			desc:
				"Olympus settings affect all Olympian scripts in all tabs.  For instance, if you disable Turkopticon queries "+
				"then every Olympian script will stop querying Turkopticon immediately."
		}),
		olympus.settings.generate({
			option:"query_turkopticon",
			type:"checkbox",
			value:olympus.settings.get(olympus,"query_turkopticon"),
			name:"Query Turkopticon",
			desc:
				"Sometimes, the Turkopticon server goes AWOL and any scripts that request data from it (such as this one) "+
				"will hang for several minutes in the absence of a response.  When this happens, it's best to turn off "+
				"Turkopticon queries for a while.  When Turkopticon queries are disabled, Olympus will continue to use "+
				"cached information as allowed by the following options."
		}),
		olympus.settings.generate({
			option:"use_to_cache",
			type:"checkbox",
			value:olympus.settings.get(olympus,"use_to_cache"),
			name:"Cache TO data",
			desc:
				"After completing a Turkopticon query, Olympus can save that data to your computer to allow for rapid retrieval "+
				"later to speed up the Olympian scripts and prevent a lot of unnecessary queries.  Be aware that this option does "+
				"not control whether or not Olympus uses existing cached data, but instead whether or not Olympus stores new data. "+
				"Disabling this option will not delete the Turkopticon data that Olympus has already cached."
		}),
		olympus.settings.generate({
			option:"to_cache_timeout",
			type:"number",
			value:(olympus.settings.get(olympus,"to_cache_timeout")/3600000),
			name:"TO cache life",
			desc:
				"The number of hours that Olympus will consider cached data recent enough to use that instead of querying "+
				"Turkopticon for it.  Decimals are valid (e.g. 1.5 for 90 minutes) and has a minimum value of 0.5 "+
				"(30 minutes).  If you want to disable caching, use the option above."
		}),
		olympus.settings
			._gen_option_wrapper({
				name:"Turkopticon weights",
				elements:4
			})
			.append(
				_gen_to_weight_element("pay"),
				_gen_to_weight_element("fast"),
				$("<br/>"),
				_gen_to_weight_element("fair").first().css("margin-left","160px").end(),
				_gen_to_weight_element("comm")
			)
			.add(
				olympus.settings._gen_desc({
					desc:
						"The weight of a Turkopticon attribute has a big effect on the final average by making values more important "+
						"(with values greater than 1) or less important (with values between 0 and 1.)  Most turkers choose to stress "+
						"pay and fairness over speed and communication with values like 6, 4, 1, 1 respectively, which makes the "+
						"computed average lean very heavily on the former two attributes and very little on the latter two.  If you do "+
						"not want to weight the Turkopticon attributes, then each of these should be set to 1."
				})
			),
		olympus.settings
			._gen_option_wrapper({
				name:"Bayesian settings",
				elements:3
			})
			.append(
				$("<span/>")
					.attr("class","sublabel")
					.text("Enable:"),
				olympus.settings._gen_option({
					option:"bayesian_to",
					type:"checkbox",
					value:olympus.settings.get(olympus,"bayesian_to")
				}),
				$("<span/>")
					.attr("class","sublabel")
					.text("Average:"),
				olympus.settings._gen_option({
					option:"bayesian_average",
					"type":"number",
					value:olympus.settings.get(olympus,"bayesian_average")
				}),
				$("<br/>"),
				$("<span/>")
					.attr("class","sublabel")
					.text("Reviews:")
					.css("margin-left","262px"),
				olympus.settings._gen_option({
					option:"bayesian_reviews",
					"type":"number",
					value:olympus.settings.get(olympus,"bayesian_reviews")
				})
			)
			.add(
				olympus.settings._gen_desc({
					desc:
						"The simple explanation of what a Bayesian function does is lowering the given average based on a lack of faith "+
						"in the accuracy of the result, which occurs when the average is higher than a specified amount and/or when "+
						"there are very few reviews that factor into that average.  Bayesian functions are mostly guesswork/personal "+
						"preference by design which is the reason you are allowed to tinker with these if you so choose.<br><br>"+
						"The Bayesian average is the point where you doubt the accuracy above that amount.  In a perfect system, "+
						"this would be the average of every input available (in this case, averaging every requester's averages), so in the "+
						"absence of that information we will simply have to guess.  In the case of Turk specifically, we all know that there "+
						"are very few requesters that are not crap, so we doubt glowing reviews simply by knowing this fact.<br><br>"+
						"The Bayesian reviews is the point where we think we have enough data to make reasonable assumptions.  This prevents any "+
						"requester with a low number of reviews from getting a high score.  A requester with a single all fives review will "+
						"get a Bayesian average around 2.50 instead of the 5.00 that Turkopticon assigns them."
				})
			),
		olympus.settings.generate({
			option:"clear_to_cache",
			type:"button",
			action:olympus.utilities.clear_to_cache,
			name:"Clear TO cache",
			desc:
				"The Turkopticon cache is using about <span data-function='to_cache_size'></span>, or approximately "+
				"<span data-function='to_cache_usage'></span> of the available storage for the mturk.com domain."
		})
	];
};

window.olympus.__parse_settings = function(settings) {
	settings.to_cache_timeout = Math.max(settings.to_cache_timeout*3600000,1800000);
	$.each(["pay","fair","fast","comm"],function(index,value) {
		if(settings["to_"+value+"_weight"] < 0) settings["to_"+value+"_weight"] = 0;
	});
	olympus.settings.update(olympus,settings);
};

window.olympus.help = {
	__topics:{},
	add:function(obj) {
		if($.type(obj) === "object" && Object.keys(obj).length) {
			$.each(obj,function(key,val) {
				olympus.help.__topics[key] = val;
			});
		}
	},
	display:function(topic) {
		if(this.has_topic(topic)) {
			$("#olympian_help .explain").html(this.__topics[topic]);
			// parse elements with special functions
			olympus.utilities.parse_deferred_functions($("#olympian_help .explain"));
			// show help window
			$("#olympian_help").show();
		}
	},
	has_topic:function(topic) {
		return this.__topics.hasOwnProperty(topic);
	},
	hide:function() {
		$("#olympian_help").hide();
	}
};

window.olympus.settings = {
	_gen_desc:function(config) {
		return $("<div/>")
			.attr("class","description")
			.append(
				$("<span/>")
					.attr("class","collapsed")
					.html(config.desc)
					.prepend(
						$("<span/>")
							.attr("class","toggle fa fa-lg fa-plus-square-o")
							.click(function() {
								$(this).toggleClass("fa-plus-square-o fa-minus-square-o");
								if($(this).hasClass("fa-plus-square-o")) $(this).parent().addClass("collapsed");
								else $(this).parent().removeClass("collapsed");
							})
					)
			);
	},
	_gen_option:function(config) {
		switch(config.type) {
			case "checkbox": return $("<span/>")
				.attr({
					"class":("fa fa-lg fa-toggle-"+((config.value === true) ? "on" : "off")),
					"id":config.option
				})
				.click(function() {
					$(this).toggleClass("fa-toggle-off fa-toggle-on");
				});
			case "number": return $("<input/>")
				.attr({
					"type":"number",
					"id":config.option
				})
				.val(config.value ? config.value : "");
			case "button": return $("<button/>")
				.attr("id",config.option)
				.text(config.name)
				.click(function() {
					config.action();
				});
			case "dropdown": {
				var options = [];
				$.each(config.selections,function(index,value) {
					options.push(
						$("<option/>")
							.attr("value",olympus.utilities.html_friendly(value))
							.text(value.ucFirst())
					);
				});
				return $("<select/>")
					.attr("id",config.option)
					.append(options)
					.val(config.value);
			}
		}
	},
	_gen_option_wrapper:function(config) {
		return $((config.hasOwnProperty("elements") && config.elements > 1) ? "<div/>" : "<label/>")
			.attr("class","option_container")
			.append(
				$("<b/>")
					.attr("class","name")
					.text(config.name)
			);
	},
	button:function(source) {
		return $("<span/>")
			.attr({
				"class":"fa fa-cogs",
				"id":"open_olympus_settings",
				"title":"Open Olympus settings"
			})
			.click(function() {
				olympus.settings.open(source);
			});
	},
	change_tab:function(tab) {
		var olympian = (tab === "olympus" ? window.olympus : olympus[tab]);

		if($("#olympian_settings .sidebar .tab.active").length) this.commit_page();
		$("#olympian_settings .sidebar .tab").removeClass("active");
		$("#"+tab+"_tab").addClass("active");
		$("#olympian_settings .container").empty().append(
			$("<a/>")
				.attr({
					"class":"olympian_identifier",
					"href":olympian.__href,
					"target":"_blank"
				})
				.text(olympian.__name.ucFirst()+" "+olympian.__version),
			(olympian.hasOwnProperty("__configurable") ? olympian.__configurable() : olympus.settings.explain({
				type:"plain",
				desc:
					"This Olympian is installed, but has no configurable options to appear here."
			}))
		);
		olympus.utilities.parse_deferred_functions($("#olympian_settings .container"));
	},
	commit_page:function() {
		var tab = $("#olympian_settings .sidebar .tab.active").attr("id").slice(0,-4),
			olympian = (tab === "olympus" ? window.olympus : olympus[tab]);
		if($.type(olympian) === "object" && olympian.hasOwnProperty("__parse_settings")) {
			var settings = {};
			$.each($("#olympian_settings .container *[id]"),function(index,$element) {
				$element = $($element);
				switch($element.prop("tagName")) {
					case "INPUT": case "SELECT": {
						settings[$element.attr("id")] = $element.val();
						break;
					}
					case "SPAN": {
						if($element.hasClass("fa-toggle-on") || $element.hasClass("fa-toggle-off")) settings[$element.attr("id")] = $element.hasClass("fa-toggle-on");
						break;
					}
				}
			});
			olympian.__parse_settings(settings);
		}
	},
	explain:function(config) {
		return $("<div/>")
			.attr("class",config.type)
			.html(config.desc);
	},
	generate:function(config) {
		return this._gen_option_wrapper(config)
			.append(this._gen_option(config))
			.add(this._gen_desc(config));
	},
	get:function() {
		if($.type(arguments[0]) === "object" && arguments[0].hasOwnProperty("__name")) {
			var olympian = arguments[0],
				settings = (olympus.utilities.localstorage_obj(olympian.__name+"_settings") || olympian.default_settings);
			if(arguments.length < 2) return settings;
			else if($.type(arguments[1]) === "string") return settings[arguments[1]];
		}
	},
	hide:function() {
		this.commit_page();
		$("#olympian_settings")
			.find(".sidebar .tab").removeClass("active")
			.end().hide();
	},
	init:function(olympian) {
		if($.type(olympian) === "object" && olympian.hasOwnProperty("__name")) {
			// this makes sure that any new options that are added from later updates are automatically
			// loaded into the existing saved settings as their default values
			if(olympian.hasOwnProperty("default_settings")) {
				var settings = olympus.utilities.localstorage_obj(olympian.__name+"_settings"),
					defaults = olympian.default_settings;
				if($.type(settings) === "object") {
					var original_len = Object.keys(settings).length;
					$.each(defaults,function(k,v) {
						if(!settings.hasOwnProperty(k)) settings[k] = v;
					});
					if(Object.keys(settings).length !== original_len) localStorage[olympian.__name+"_settings"] = JSON.stringify(settings); // new options exist
				}
			}
			// add a tab to the settings window for this olympian
			$("#olympian_settings .sidebar").append(
				$("<div/>")
					.attr({
						"class":"tab",
						"id":(olympian.__name+"_tab")
					})
					.text(olympian.__name.ucFirst())
					.click(function() {
						olympus.settings.change_tab($(this).attr("id").slice(0,-4));
					})
			);
		}
	},
	open:function(source) {
		this.change_tab(source);
		$("#olympian_settings").show();
	},
	update:function() {
		if(arguments.length > 1 && $.type(arguments[0]) === "object" && arguments[0].hasOwnProperty("__name")) {
			var olympian = arguments[0],
				settings = (olympus.utilities.localstorage_obj(olympian.__name+"_settings") || olympian.default_settings);
			if($.type(arguments[1]) === "object") {
				$.each(arguments[1],function(key,val) {
					if(settings.hasOwnProperty(key)) settings[key] = val;
				});
			}
			else if($.type(arguments[1]) === "string" && arguments.length > 2) if(settings.hasOwnProperty(arguments[1])) settings[arguments[1]] = arguments[2];

			localStorage[olympian.__name+"_settings"] = JSON.stringify(settings);
		}
	}
};

window.olympus.style = {
	__css:"",
	__commit:function() {
		// retrieve the olympian style node, or create it if it does not yet exist
		var $style_node = $("#olympian_css");
		if(!$style_node.length) {
			$style_node = $("<style/>")
				.attr({
					"data-pantheon":"olympus",
					"id":"olympian_css",
					"type":"text/css"
				});
			$("head").append($style_node);
		}

		// update the olympian style node with the new css
		$style_node.text(this.__css);
	},
	add:function(new_css,tokens) {
		if($.type(tokens) === "object" && Object.keys(tokens).length) new_css = this.expand(new_css,tokens);
		this.__css += new_css;
		this.__commit();
	},
	expand:function(css,tokens) {
		// olympians sometimes use bracketed tokens in their css to allow for centralized
		// style definitions from functions or for swapping values easily
		$.each(tokens,function(key,val) {css = css.replace(new RegExp(("\\["+key+"\\]"),"gi"),val);});
		return css;
	}
};

window.olympus.utilities = {
	datetime:{
		__day_string:function(int) {
			switch(int) {
				case 0: return "Sunday";
				case 1: return "Monday";
				case 2: return "Tuesday";
				case 3: return "Wednesday";
				case 4: return "Thursday";
				case 5: return "Friday";
				case 6: return "Saturday";
			}
		},
		__meridiem:function(int) {
			if(int > 12) return "pm";
			else return "am";
		},
		__meridiem_hour:function(int) {
			if(int > 12) int -= 12;
			return int;
		},
		__month_string:function(int) {
			switch(int) {
				case 0: return "January";
				case 1: return "February";
				case 2: return "March";
				case 3: return "April";
				case 4: return "May";
				case 5: return "June";
				case 6: return "July";
				case 7: return "August";
				case 8: return "September";
				case 9: return "October";
				case 10: return "November";
				case 11: return "December";
			}
		},
		__ordinal:function(int) {
			switch(int) {
				case 1: case 21: case 31: return "st";
				case 2: case 22: return "nd";
				case 3: case 23: return "rd";
			}
			return "th";
		},
		__short_year:function(int) {
			return (""+int).slice(-2);
		},
		getDayString:function() {
			return this.__day_string(this.__date.getDay());
		},
		getMeridiem:function() {
			return this.__meridiem(this.__date.getHours());
		},
		getMeridiemHours:function() {
			return this.__meridiem_hour(this.__date.getHours());
		},
		getMonthString:function() {
			return this.__month_string(this.__date.getMonth());
		},
		getOrdinal:function() {
			return this.__ordinal(this.__date.getDate());
		},
		getShortYear:function() {
			return this.__short_year(this.__date.getFullYear());
		},
		getUTCDayString:function() {
			return this.__day_string(this.__date.getUTCDay());
		},
		getUTCMeridiem:function() {
			return this.__meridiem(this.__date.getUTCHours());
		},
		getUTCMeridiemHours:function() {
			return this.__meridiem_hour(this.__date.getUTCHours());
		},
		getUTCMonthString:function() {
			return this.__month_string(this.__date.getUTCMonth());
		},
		getUTCOrdinal:function() {
			return this.__ordinal(this.__date.getUTCDate());
		},
		getUTCShortYear:function() {
			return this.__short_year(this.__date.getUTCFullYear());
		},
		getTokenizedOutput:function(t) {
			var r = "",
				i = -1;
			while(i++ < t.length) {
				switch(t.charAt(i)) {
					// escape sequence, ignore following character by advancing index beyond it
					case '\\': {r += t.charAt(++i); break;}

					// local year
					case 'y': {r += this.getShortYear(); break;}
					case 'Y': {r += this.__date.getFullYear(); break;}
					// local month
					case 'n': {r += (this.__date.getMonth()+1); break;}
					case 'm': {r += olympus.utilities.pad_string(this.__date.getMonth()+1,2); break;}
					case 'F': {r += this.getMonthString(); break;}
					case 'M': {r += this.getMonthString().slice(0,3); break;}
					// local day
					case 'j': {r += this.__date.getDate(); break;}
					case 'd': {r += olympus.utilities.pad_string(this.__date.getDate(),2); break;}
					case 'l': {r += this.getDayString(); break;}
					case 'D': {r += this.getDayString().slice(0,3); break;}
					case 'S': {r += this.getOrdinal(); break;}
					// local hour
					case 'g': {r += this.getMeridiemHours(); break;}
					case 'h': {r += olympus.utilities.pad_string(this.getMeridiemHours(),2); break;}
					case 'G': {r += this.__date.getHours(); break;}
					case 'H': {r += olympus.utilities.pad_string(this.__date.getHours(),2); break;}
					case 'a': {r += this.getMeridiem(); break;}
					case 'A': {r += this.getMeridiem().toUpperCase(); break;}
					// local minute, second
					case 'i': {r += olympus.utilities.pad_string(this.__date.getMinutes(),2); break;}
					case 's': {r += olympus.utilities.pad_string(this.__date.getSeconds(),2); break;}

					// utc year
					case 'z': {r += this.getUTCShortYear(); break;}
					case 'Z': {r += this.__date.getUTCFullYear(); break;}
					// utc month
					case 'p': {r += (this.__date.getUTCMonth()+1); break;}
					case 'q': {r += olympus.utilities.pad_string(this.__date.getUTCMonth()+1,2); break;}
					case 'T': {r += this.getUTCMonthString(); break;}
					case 'U': {r += this.getUTCMonthString().slice(0,3); break;}
					// utc day
					case 'f': {r += this.__date.getUTCDate(); break;}
					case 'e': {r += olympus.utilities.pad_string(this.__date.getUTCDate(),2); break;}
					case 'k': {r += this.getUTCDayString(); break;}
					case 'E': {r += this.getUTCDayString().slice(0,3); break;}
					case 'R': {r += this.getUTCOrdinal(); break;}
					// utc hour
					case 'b': {r += this.getUTCMeridiemHours(); break;}
					case 'c': {r += olympus.utilities.pad_string(this.getUTCMeridiemHours(),2); break;}
					case 'B': {r += this.__date.getUTCHours(); break;}
					case 'C': {r += olympus.utilities.pad_string(this.__date.getUTCHours()); break;}
					case 'o': {r += this.getUTCMeridiem(); break;}
					case 'O': {r += this.getUTCMeridiem().toUpperCase() ;break;}
					// utc minute, second
					case 'w': {r += olympus.utilities.pad_string(this.__date.getUTCMinutes(),2); break;}
					case 'x': {r += olympus.utilities.pad_string(this.__date.getUTCSeconds(),2); break;}

					default: {r += t.charAt(i); break;}
				}
			}
			return r;
		},
		output:function() {
			if(arguments.length) {
				if(arguments.length > 1) this.__date = new Date(arguments[0]);
				if($.type(this.__date) !== "undefined") return this.getTokenizedOutput(arguments[arguments.length-1]);
			}
		}
	},
	ajax_get:function(mirrors,params,callback,scope) {
		var result = "";

		function exit() {
			if($.type(callback) === "function") callback.call(scope,result);
		}

		function domain_name(s) {
			return s.match(/^https?:\/\/([^/$]+)/i)[1];
		}

		function request(url) {
			$.ajax({
				async:true,
				method:"GET",
				url:(url+params)
			})
			.fail(function() {
				console.log("Mount Olympus get request: attempt to gather data from '"+domain_name(url)+"' mirror failed");
				var idx = (mirrors.indexOf(url)+1);
				if(idx < mirrors.length) {
					console.log("Mount Olympus get request: attempting data request from mirror '"+domain_name(mirrors[idx])+"'...");
					request(mirrors[idx]);
				}
				else {
					console.log("Mount Olympus get request: attempts to gather data from all available mirrors has failed");
					exit();
				}
			})
			.done(function(response) {
				if(response.length) {
					console.log("Mount Olympus get request: query to '"+domain_name(url)+"' was successful");
					result = response;
				}
				exit();
			});
		}

		request(mirrors[0]);
	},
	bkmg:function(bytes) {
		var multiple = 0;
		while(bytes > 1024) {
			multiple++;
			bytes /= 1024;
		}
		return (""+bytes.toFixed(2)+" "+["","kilo","mega","giga"][multiple]+"byte"+olympus.utilities.plural(bytes));
	},
	capsule_info:function($element) {
		function scrape_from_tooltip() {
			var value = "";
			$.each(arguments,function(index,text) {
				var $anchor = $("a[id^='"+text+".tooltip']",$element);
				if($anchor.length) {
					value = $anchor.parent().next().text().collapseWhitespace();
					return false; // the only way to break $.each
				}
			});
			return value;
		}

		var tokens = {
			// basic HIT info that can be scraped off the page
			hit_name:$("a.capsulelink[href='#']",$element).first().text().collapseWhitespace(),
			hit_id:olympus.utilities.href_group_id($("a[href*='roupId=']",$element).first().attr("href") || window.location.href), // groupid does not appear in preview
			hit_desc:(scrape_from_tooltip("description") || "None"), // description does not appear in preview
			hit_time:scrape_from_tooltip("duration_to_complete","time_left"),
			hits_available:scrape_from_tooltip("number_of_hits"),
			hit_reward:$("span.reward",$element).text().collapseWhitespace(),
			requester_name:$("a[href*='selectedSearchType=hitgroups']",$element).first().text().collapseWhitespace(),
			requester_id:olympus.utilities.href_requester_id($("a[href*='requesterId']",$element).first().attr("href"))
		};

		// link properties for convenience, since these are long URLs that only use one bit of previously collected info
		tokens.preview_link = ("https://www.mturk.com/mturk/preview?groupId="+tokens.hit_id);
		tokens.panda_link = ("https://www.mturk.com/mturk/previewandaccept?groupId="+tokens.hit_id);
		tokens.requester_hits = ("https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&requesterId="+tokens.requester_id);
		tokens.contact_requester = ("https://www.mturk.com/mturk/contact?requesterId="+tokens.requester_id+"&requesterName="+tokens.requester_name);
		tokens.to_reviews = ("https://turkopticon.ucsd.edu/"+tokens.requester_id);

		// parse qualifications
		var $qual_anchor = $("a[id^='qualificationsRequired.tooltip'], a[id^='qualifications.tooltip']",$element).first();
		if($qual_anchor.parent().next().text().collapseWhitespace() === "None") tokens.quals = "None";
		else {
			if($qual_anchor.attr("id").contains("Required")) { // viewing list of HITs
				var quals = [];
				$("tr:not(:first-of-type) td:first-of-type",$qual_anchor.closest("table")).each(function() {quals.push($(this).text().collapseWhitespace());});
				tokens.quals = quals.join("; ");
			}
			else tokens.quals = $qual_anchor.parent().next().text().collapseWhitespace(); // previewing HIT where quals are already semicolon-delimited
		}

		return tokens;
	},
	clear_page:function(title) {
		// when an olympian wants an independent full-page display.  every element added to
		// the top level of the document has a data-pantheon attribute for exactly this purpose:
		// if an element does not have that attribute, it is removed
		$("head")
			.children().not("[data-pantheon]").remove()
			.end().end().append(
				$("<title/>").text(title)
			);
		$("body")
			.removeAttr("onload onLoad")
			.children().not("[data-pantheon]").remove();
	},
	clear_to_cache:function() {
		if(confirm("Are you sure you want to delete the Turkopticon cache?")) localStorage.removeItem("olympian_to_cache");
	},
	dhms:function(secs) {
		// takes a number of seconds (chiefly, hitAutoAppDelayInSeconds) and returns a
		// "friendly" value in seconds, minutes, hours, or days.  has a precision of
		// tenths, e.g. "1.5 days" or "6.7 hours"
		function output(multiple,name) {
			function zeroes(num) {
				// removes ugly trailing zeroes (e.g. "1.0 days" or "2.40 hours")
				return +num.toFixed(1);
			}
			var units = zeroes((secs/multiple));
			return (""+units+" "+name+olympus.utilities.plural(units));
		}

		if($.type(secs) !== "number") secs = Math.round(secs*1);

		if(secs < 60) return output(1,"second");
		else if(secs < 3600) return output(60,"minute");
		else if(secs < 86400) return output(3600,"hour");
		else return output(86400,"day");
	},
	href_group_id:function(href) {
		if($.type(href) === "string") {
			href = href.match(/groupId=([^&\s]+)/i);
			if($.type(href) === "array") return href[1];
		}
	},
	href_id:function(href) {
		// when i don't know which one i have
		return (this.href_requester_id(href) || this.href_group_id(href));
	},
	href_requester_id:function(href) {
		if($.type(href) === "string") {
			href = href.match(/requesterId=([^&\s]+)/i);
			if($.type(href) === "array") return href[1];
		}
	},
	html_friendly:function(string) {
		return string.collapseWhitespace().replace(/\s/g,"_");
	},
	json_obj:function(json) {
		var obj;
		if(typeof json === "string" && json.trim().length) {
			try {obj = JSON.parse(json);}
			catch(e) {console.log("Malformed JSON object.  Error message from JSON library: ["+e.message+"]");}
		}
		return obj;
	},
	localstorage_obj:function(key) {
		var obj = this.json_obj(localStorage.getItem(key));
		if(typeof obj !== "object") localStorage.removeItem(key);
		return obj;
	},
	pad_string:function(string,width,padding,side) {
		string = (""+string);
		var pad_item = (padding || "0"),
			half = ((width-string.length)/2);
		padding = "";
		while((string.length+padding.length) < width) padding = (padding+pad_item);
		if(side === "both") return (padding.slice(0,Math.floor(half))+string+padding.slice(Math.ceil(half)*-1));
		else if(side === "right") return (string+padding).slice(0,width);
		else return (padding+string).slice(width*-1);
	},
	parse_deferred_functions:function($context) {
		$context.find("*[data-function]").each(function() {
			switch($(this).attr("data-function")) {
				case "desc2fa": {
					$(this)
						.addClass("fa fa-fw fa-2x "+olympus.athena.desc2fa($(this).attr("data-args")))
						.removeAttr("data-function data-args");
					break;
				}
				case "feasibility2desc": {
					$(this).replaceWith(olympus.athena.feasibility2desc($(this).attr("data-args")));
					break;
				}
				case "to_cache_size": {
					$(this).replaceWith(
						document.createTextNode(""+olympus.utilities.bkmg(localStorage.olympian_to_cache.length))
					);
					break;
				}
				case "to_cache_usage": {
					$(this).replaceWith(
						document.createTextNode(""+(localStorage.olympian_to_cache.length/10485760).toFixed(2)+"%")
					);
					break;
				}
			}
		});
	},
	plural:function(num) {
		// returns the letter s if the number is not 1.  just for pretty display
		// to say something like "2 widgets" instead of "2 widget"
		if($.type(num) !== "number") num = +num;
		if(num != 1) return "s";
		return "";
	},
	to_average:function(info) {
		function confidence(avg,ttl) {
			var rr = (olympus.settings.get(olympus,"bayesian_reviews")*1);
			return ((ttl/(ttl+rr))*avg+(rr/(ttl+rr))*olympus.settings.get(olympus,"bayesian_average"));
		}

		var sum = 0,
			divisor = 0,
			average = 0;
		$.each(info.attrs,function(key,val) {
			var weight = (olympus.settings.get(olympus,"to_"+key+"_weight")*1),
				total = (val*weight);
			if(total > 0) {
				sum += total;
				divisor += weight;
			}
		});

		average = (sum/divisor);
		return (olympus.settings.get(olympus,"bayesian_to") ? confidence(average,info.reviews) : average);
	},
	turkopticon:function(rids,callback,scope) {
		var to_mirrors = [
				"https://mturk-api.istrack.in/multi-attrs.php?ids=",
				"https://turkopticon.ucsd.edu/api/multi-attrs.php?ids="
			],
			query_rids = [],
			query_result = {},
			deferred_cache = {};

		function exit() {
			cache_commit();
			if($.type(callback) === "function") callback.call(scope,query_result);
		}

		// turkopticon caching functions of this script reduce overhead ajax calls to the api
		// and instead stash data on the local system, if the user has allowed it.  i personally
		// think a couple hundred kilobytes on your computer is well worth the performance boost
		function cache_commit() {
			// commit the deferred information from cache_set
			if(Object.keys(deferred_cache).length) {
				var to_cache = (olympus.utilities.localstorage_obj("olympian_to_cache") || {});
				$.each(deferred_cache,function(rid,attrs) {
					if($.type(attrs) !== "object") attrs = {};
					attrs.cache_time = new Date().getTime();
					to_cache[rid] = attrs;
				});
				localStorage.olympian_to_cache = JSON.stringify(to_cache);
			}
		}

		function cache_get(rid) {
			var to_cache = olympus.utilities.localstorage_obj("olympian_to_cache");
			if($.type(to_cache) === "object" && to_cache.hasOwnProperty(rid)) {
				var attrs = to_cache[rid];
				// when turkopticon is disabled, any data is better than no data so cached information is used
				// regardless of age.  otherwise, if turkopticon is enabled, there is a maximum age imposed
				// on the cached results as defined in the options that the user has set
				if(!olympus.settings.get(olympus,"query_turkopticon") || new Date().getTime() - (attrs.cache_time*1) < olympus.settings.get(olympus,"to_cache_timeout")) return attrs;
			}
		}

		function cache_set(rid,attrs) {
			// so that all new cached data is stored once instead of firing a storage event infinity times
			if(olympus.settings.get(olympus,"use_to_cache")) deferred_cache[rid] = attrs;
		}

		// check the cache for relevant data we can use and query for the rest
		$.each(rids,function(k,v) {
			var cached = cache_get(v);
			if($.type(cached) === "object") query_result[v] = cached;
			else query_rids.push(v);
		});
		var num_cached = Object.keys(query_result).length,
			num_queried = query_rids.length;
		console.log("Mount Olympus Turkopticon: "+(num_cached > 0 ? ("using cached data for "+num_cached+" requesters") : "no available or timely cached data")+"; "+(num_queried > 0 ? ("query required for "+num_queried+" requesters") : "no queries necessary"));
		if(olympus.settings.get(olympus,"query_turkopticon") && query_rids.length) {
			this.ajax_get(to_mirrors,query_rids.join(","),function(response) {
				var jsobj = olympus.utilities.json_obj(response);
				if($.type(jsobj) === "object") {
					$.each(jsobj,function(rid,attrs) {
						cache_set(rid,attrs);
						query_result[rid] = attrs;
					});
				}
				else console.log("Mount Olympus Turkopticon: query was successful but the response was malformed");
				exit();
			});
		}
		else exit();
	}
};

$(document).ready(function() {
	olympus.__init();
});