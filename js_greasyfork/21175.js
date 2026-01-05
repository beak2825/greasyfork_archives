// ==UserScript==
// @name         Hermes HIT exporter
// @namespace    mobiusevalon.tibbius.com
// @version      4.0-7
// @author       Mobius Evalon <mobiusevalon@tibbius.com>
// @description  Adds an Export button to MTurk HIT capsules to share HITs on forums, reddit, etc.
// @license      Creative Commons Attribution-ShareAlike 4.0; http://creativecommons.org/licenses/by-sa/4.0/
// @include      /^https{0,1}:\/\/\w{0,}\.?mturk\.com.+/
// @exclude      /&hit_scraper$/
// @exclude      /\/HM$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21175/Hermes%20HIT%20exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/21175/Hermes%20HIT%20exporter.meta.js
// ==/UserScript==

if(window.olympus === undefined) window.olympus = {};

olympus.hermes = {
	__name:"hermes",
	__version:"4.0-7",
	__href:"https://greasyfork.org/en/scripts/21175-hermes-hit-exporter",
	default_settings:{
		show_export_athena:false,
		show_export_mturk:true
	},
	// properties
	_format:"",
	_template:"",
	tokens:{},
	// methods
	__configurable:function() {
		return [
			olympus.settings.generate({
				option:"show_export_mturk",
				type:"checkbox",
				value:olympus.settings.get(olympus.hermes,"show_export_mturk"),
				name:"Export button (Turk)",
				desc:"Whether or not to enable Hermes to place its Export button on each HIT when browsing on Mechanical Turk."
			}),
			olympus.settings.generate({
				option:"show_export_athena",
				type:"checkbox",
				value:olympus.settings.get(olympus.hermes,"show_export_athena"),
				name:"Export button (Athena)",
				desc:
					"Toggles integration with the Athena scraper.  When enabled, Hermes will place export buttons on each result row "+
					"to allow exporting from the scraper."
			})
		];
	},
	__parse_settings:function(settings) {
		olympus.settings.update(olympus.hermes,settings);

		if(!settings.show_export_athena && $("body").hasClass("athena_interface")) $(".hermes_export_button").remove();
		else if(!settings.show_export_mturk && !$("body").hasClass("athena_interface")) $(".hermes_export_button").remove();
		else olympus.hermes.add_buttons();
	},
	__init:function() {
		console.log("hermes init");
		olympus.style.add(
			".hermes_export_button {height: 16px; font-size: 10px; font-weight: bold; border: 1px solid; margin-left: 5px; padding: 1px 5px; background-color: transparent; cursor: pointer;} "+
			"#hermes_export_window {position: fixed; left: 15vw; top: 10vh; background-color: #a5ccdd; border: 2px solid #5c9ebf; border-radius: 10px; z-index: 150;} "+
			"#hermes_export_window textarea {width: 400px; height: 250px; margin: 0px auto; display: block;} "+
			"#hermes_export_window h1 {margin: 10px 0px; padding: 0px; font-size: 150%; font-weight: bold; text-align: center;} "+
			"#hhe_completion_time {width: 40px; text-align: center; margin: 0px 5px;} "+
			"#hhe_update_time {margin-right: 5px;} "+
			"#hhe_close {display: block; margin: 10px auto; clear: both;} "+
			"#hhe_export_format {margin: 0px 5px;} "+
			"#hermes_export_window .hhe_options .left {display: inline-block; float: left; text-align: left;} "+
			"#hermes_export_window .hhe_options .right {display: inline-block; float: right; text-align: right;} "+
			"#hermes_export_window button {font: inherit;} "+
			".noscroll {overflow: hidden;} "
		);

		if($("a.capsulelink").length) {
			$("body").append(
				$("<div/>")
					.attr({
						"data-pantheon":"hermes",
						"id":"hermes_export_window"
					})
					.append(
						$("<h1/>")
							.text("Hermes HIT exporter"),
						$("<textarea/>")
							.attr("id","hhe_export_output")
							.hide(),
						$("<textarea/>")
							.attr("id","hhe_edit_template")
							.hide(),
						$("<div/>")
							.attr("class","hhe_options")
							.append(
								$("<div/>")
									.attr("class","left")
									.append(
										$("<select/>")
											.attr("id","hhe_export_format")
											.append(
												$("<option/>")
													.attr("value","vbulletin")
													.text("vBulletin"),
												$("<option/>")
													.attr("value","markdown")
													.text("Markdown"),
												$("<option/>")
													.attr("value","plaintext")
													.text("Plain text"),
												$("<option/>")
													.attr("value","irc")
													.text("IRC")
											)
											.change(function() {
												localStorage.hermes_export_format = $(this).val();
												olympus.hermes.switch_format($(this).val());
											}),
										$("<button/>")
											.attr("id","hhe_mode_swap")
											.text("Edit")
											.click(function() {
												if($(this).text() === "Edit") {
													$("#hhe_edit_template").show().text(olympus.hermes.get_raw_template($("#hhe_export_format").val()));
													$("#hhe_export_output").hide();
													$("#hhe_reset_template").show();
													$("#hhe_export_format, #hhe_update_time").prop("disabled",true);
													$(this).text("Done");
												}
												else {
													localStorage.setItem(("hermes_"+$("#hhe_export_format").val()+"_template"),$("#hhe_edit_template").val());
													$("#hhe_export_format, #hhe_update_time").prop("disabled",false);
													$("#hhe_edit_template, #hhe_reset_template").hide();
													$(this).text("Edit");
													olympus.hermes.template_edited();
												}
											}),
										$("<button/>")
											.attr("id","hhe_reset_template")
											.text("Reset")
											.click(function() {
												if($("#hhe_mode_swap").text() === "Done" && confirm("Are you sure you want to reset the "+$("#hhe_export_format option:selected").text()+" template to default?\n\nThis can't be undone.")) {
													localStorage.removeItem("hermes_"+$("#hhe_export_format").val()+"_template");
													$("#hhe_edit_template").val(olympus.hermes.default_template($("#hhe_export_format").val()));
												}
											})
											.hide()
									),
								$("<div/>")
									.attr("class","right")
									.append(
										$("<label/>")
											.append(
												document.createTextNode("Time:"),
												$("<input/>")
													.attr({
														"type":"text",
														"id":"hhe_completion_time"
													})
											),
										$("<button/>")
											.text("Update")
											.attr("id","hhe_update_time")
											.click(function() {
												olympus.hermes.compute_pph($("#hhe_completion_time").val());
											})
									)
							),
						$("<button/>")
							.attr("id","hhe_close")
							.text("Close")
							.click(function() {
								olympus.hermes.hide();
							})
					)
					.hide()
			);

			this.add_buttons();
		}
	},
	__reset_tokens:function(hit) {
		this.tokens = {
			hermes_version:olympus.hermes.__version,
			author_url:"https://greasyfork.org/en/users/9665-mobius-evalon",
			hermes_url:olympus.hermes.__href,
			shortened_author_url:"http://goo.gl/jqpg0h",
			shortened_hermes_url:"http://goo.gl/bNdTBj",
			// by default the user has provided no completion time estimate, so this wrapper needs to not be displayed until the user provides that info
			pph_wrapper:""
		};
		var info = olympus.utilities.capsule_info(hit);
		$.each(info,function(key,val) {
			olympus.hermes.tokens[key] = val;
		});
	},
	__reset_interface:function() {
		$("#hhe_edit_template").hide();
		$("#hhe_export_output").hide();
		$("#hhe_mode_swap").text("Edit");
		$("#hhe_update_time").prop("disabled",true);
		$("#hhe_completion_time").val("");
		$("#hhe_export_format").prop("disabled",true).val(localStorage.hermes_export_format || "vbulletin");
	},
	_async_turkopticon:function(result) {
		// used as a callback in the olympian library's turkopticon function
		function color_prop(n) {
			switch(Math.round(n*1)) {
				case 0: return "black";
				case 1: return "red";
				case 2: return "red";
				case 3: return "orange";
				default: return "green";
			}
		}

		function symbol_prop(n) {
			n = Math.round(n*1);
			var filled = "⚫⚫⚫⚫⚫",
				empty = "⚪⚪⚪⚪⚪";
			return (filled.slice(0,n)+empty.slice(n));
		}

		if(result.hasOwnProperty(this.tokens.requester_id)) {
			if($.type(result[this.tokens.requester_id]) === "object") {
				$.each(result[this.tokens.requester_id].attrs,function(k,v) {
					olympus.hermes.tokens["to_"+k] = v;
					olympus.hermes.tokens["to_"+k+"_color"] = color_prop(v);
					olympus.hermes.tokens["to_"+k+"_symbols"] = symbol_prop(v);
				});
				this.tokens.to_avg = olympus.utilities.to_average(result[this.tokens.requester_id]).toFixed(2);
			}
			else this.tokens.to_wrapper = "[None]";
		}
		else this.tokens.to_wrapper = "[Error]";

		this._process();
	},
	_async_url_shorten:function(result) {
		// used as a callback for url_shortener()
		if(Object.keys(result).length) {
			$.each(result,function(key,val) {
				olympus.hermes.tokens[key] = val;
			});
			if(this.tokens.hasOwnProperty("shortened_url_wrapper")) delete this.tokens.shortened_url_wrapper;
		}
		else this.tokens.shortened_url_wrapper = "[Error]";

		this._process();
	},
	_contains_short_url_tokens:function() {
		return /\{shortened_[^}]+\}/i.test(this._template);
	},
	_contains_to_tokens:function () {
		return /{to_(?:pay|fair|fast|comm|graphic)(?:_symbols|_color)?}/i.test(this._template);
	},
	_expand_tokens:function() {
		var tmp = this._template;
		$.each(this.tokens,function(key,val) {
			if(key.slice(-8) === "_wrapper") tmp = tmp.replace(new RegExp(("<"+key+":[^>]+>"),"gi"),val);
			else tmp = tmp.replace(new RegExp(("\\{"+key+"\\}"),"gi"),val);
		});
		tmp = tmp.replace(/{date_time}/ig,olympus.utilities.datetime.output(Date.now(),"e U Z, C:w.x")+" UTC").replace(/<[^>]+_wrapper:([^>]+)>/gi,"$1");
		tmp = tmp.replace(/\\n/g,"\n");
		return tmp;
	},
	_process:function() {
		// this function is called repeatedly to determine the status of the template display
		if(!this.tokens.hasOwnProperty("to_pay") && !this.tokens.hasOwnProperty("to_wrapper") && this._contains_to_tokens()) {
			this.output("Gathering Turkopticon data for "+this.tokens.requester_name+"...");
			olympus.utilities.turkopticon([this.tokens.requester_id],this._async_turkopticon,this);
		}
		else if(!this.tokens.hasOwnProperty("shortened_url_wrapper") && this._contains_short_url_tokens() && this.tokens_to_shorten().length) {
			this.output("Shortening URLs...");
			this._url_shortener(this._async_url_shorten,this);
		}
		else this.display();
	},
	_url_shortener:function(callback,scope) {
		var mirrors = [
				"https://ns4t.net/yourls-api.php?action=bulkshortener&title=MTurk&signature=39f6cf4959"
			],
			params = "",
			tokens = [],
			result = {};

		function exit() {
			if($.type(callback) === "function") callback.call(scope,result);
		}

		tokens = olympus.hermes.tokens_to_shorten();
		if(tokens.length) {
			params = (
				"&urls[]="+
				tokens
					.map(function(val,idx,arr) {
						return olympus.hermes.tokens[val];
					})
					.join("&urls[]=")
			);
			olympus.utilities.ajax_get(mirrors,params,function(response) {
				if(response.length) {
					response = response.split(";");
					$.each(tokens,function(key,val) {
						result["shortened_"+val] = response[key];
					});
				}
				else console.log("Hermes HIT exporter: url shortening service appeared to be queried successfully but returned no data");
				exit();
			});
		}
		else exit();
	},
	add_buttons:function() {
		var $anchors;
		if($("body").hasClass("athena_interface") && olympus.settings.get(olympus.hermes,"show_export_athena")) $anchors = $("#athena_results .title");
		else if(olympus.settings.get(olympus.hermes,"show_export_mturk")) $anchors = $("a.capsulelink");
		$.each($anchors,function() {
			if(!$(this).siblings(".hermes_export_button").length) $(this).after(
				$("<a/>")
					.attr({
						"class":"hermes_export_button",
						"title":"Use Hermes to generate an export of this HIT to share on forums, IRC, reddit, etc."
					})
					.text("Export")
					.click(function() {
						olympus.hermes.__reset_interface();

						$("div#hermes_export_window").show();
						$("body").addClass("noscroll");

						olympus.hermes.begin({
							hit:$(this).closest("table").parent().closest("table"),
							format:$("#hhe_export_format").val()
						});
					})
				);
		});
	},
	begin:function(obj) {
		if($.type(obj) === "object" && obj.hasOwnProperty("hit") && obj.hasOwnProperty("format")) {
			this.__reset_tokens(obj.hit);
			this.switch_format(obj.format);
		}
		else throw new Error("Hermes HIT exporter: template was initialized with improper arguments");
	},
	compute_pph:function(time) {
		var mins = 0,
			secs = 0;

		if(time.indexOf(":") > -1) {
			mins = Math.floor(time.split(":")[0]*1);
			secs = Math.floor(time.split(":")[1]*1);

			// in case some smart aleck enters something like 1:75
			while(secs > 59) {
				mins++;
				secs -= 60;
			}
		}
		else {
			mins = Math.floor(time*1);
			secs = (((time*1)-mins)*60);
		}

		if((mins+secs) <= 0) {
			if(this.tokens.hasOwnProperty("my_time")) delete this.tokens.my_time;
			if(this.tokens.hasOwnProperty("hourly_rate")) delete this.tokens.hourly_rate;
			this.tokens.pph_wrapper = "";
		}
		else {
			this.tokens.my_time = (""+mins+":"+olympus.utilities.pad_string(secs,2));
			this.tokens.hourly_rate = "$"+(((this.tokens.hit_reward.slice(1)*1)/((mins*60)+secs))*3600).toFixed(2);
			if(this.tokens.hasOwnProperty("pph_wrapper")) delete this.tokens.pph_wrapper;
		}

		this._process();
	},
	default_template:function(format) {
		if(format === "vbulletin") return "[url={preview_link}][color=blue]{hit_name}[/color][/url] [[url={panda_link}][color=blue]PANDA[/color][/url]]\n"+
			"[b]Reward[/b]: {hit_reward}<pph_wrapper:/{my_time} ({hourly_rate}/hour)>\n"+
			"[b]Time allowed[/b]: {hit_time}\n"+
			"[b]Available[/b]: {hits_available}\n"+
			"[b]Description[/b]: {hit_desc}\n"+
			"[b]Qualifications[/b]: {quals}\n\n"+
			"[b]Requester[/b]: [url={requester_hits}][color=blue]{requester_name}[/color][/url] [[url={contact_requester}][color=blue]Contact[/color][/url]]\n"+
			"[url={to_reviews}][color=blue][b]Turkopticon[/b][/color][/url]: <to_wrapper:[Pay: [color={to_pay_color}]{to_pay}[/color]] [Fair: [color={to_fair_color}]{to_fair}[/color]] [Fast: [color={to_fast_color}]{to_fast}[/color]] [Comm: [color={to_comm_color}]{to_comm}[/color]]>\n"+
			"[size=8px]Generated {date_time} with [url={hermes_url}][color=blue]Hermes HIT Exporter[/color][/url] {hermes_version} by [url={author_url}][color=blue]Mobius Evalon[/color][/url][/size]";
		else if(format === "markdown") return "[{hit_name}]({preview_link}) \\[[PANDA]({panda_link})\\]  \n"+
			"**Reward**: {hit_reward}<pph_wrapper:/{my_time} ({hourly_rate}/hour)>  \n"+
			"**Time allowed**: {hit_time}  \n"+
			"**Available**: {hits_available}  \n"+
			"**Description**: {hit_desc}  \n"+
			"**Qualifications**: {quals}\n\n"+
			"**Requester**: [{requester_name}]({requester_hits}) \\[[Contact]({contact_requester})\\]  \n"+
			"[**Turkopticon**]({to_reviews}): <to_wrapper:\\[Pay: {to_pay}\\] \\[Fair: {to_fair}\\] \\[Fast: {to_fast}\\] \\[Comm: {to_comm}\\]>  \n"+
			"^Generated {date_time} with [Hermes HIT Exporter]({hermes_url}) {hermes_version} by [Mobius Evalon]({author_url})";
		else if(format === "plaintext") return "{hit_name} [{preview_link}]  \n"+
			"Reward: {hit_reward}<pph_wrapper:/{my_time} ({hourly_rate}/hour)>  \n"+
			"Time allowed: {hit_time}  \n"+
			"Available: {hits_available}  \n"+
			"Description: {hit_desc}  \n"+
			"Qualifications: {quals}\n\n"+
			"Requester: {requester_name} [{requester_hits}]  \n"+
			"Turkopticon: <to_wrapper:[Pay: {to_pay}] [Fair: {to_fair}] [Fast: {to_fast}] [Comm: {to_comm}]> [{to_reviews}]  \n"+
			"Generated {date_time} with Hermes HIT Exporter {hermes_version} by Mobius Evalon [{hermes_url}]";
		else if(format === "irc") return "{hit_name} [ View: {shortened_preview_link} PANDA: {shortened_panda_link} ] "+
			"Reward: {hit_reward}<pph_wrapper:/{my_time} ({hourly_rate}/hour)> Time: {hit_time} | "+
			"Requester: {requester_name} [ HITs: {shortened_requester_hits} TO: {shortened_to_reviews} ] Pay={to_pay} Fair={to_fair} Fast={to_fast} Comm={to_comm}";
	},
	display:function() {
		$("#hhe_update_time, #hhe_export_format").prop("disabled",false);
		this.output(this._expand_tokens(this._template));
	},
	get_raw_template:function(string) {
		return (localStorage.getItem("hermes_"+string+"_template") || this.default_template(string));
	},
	hide:function() {
		$("#hermes_export_window").hide();
		$("body").removeClass("noscroll");
	},
	output:function(string) {
		$("div#hermes_export_window textarea#hhe_export_output").show().text(string);
	},
	switch_format:function(string) {
		string = (string || $("#hhe_export_format").val());
		this._format = string;
		this._template = this.get_raw_template(string);
		this._process();
	},
	template_edited:function() {
		this._template = this.get_raw_template(this._format);
		this._process();
	},
	tokens_to_shorten:function() {
		var arr = [];
		$.each(this._template.match(/(\{shortened_[^}]+\})/gi),function(key,val) {
			if(olympus.hermes.tokens.hasOwnProperty(val.slice(11,-1)) && !olympus.hermes.tokens.hasOwnProperty(val.slice(1,-1)) && arr.indexOf(val.slice(11,-1)) === -1)
				arr.push(val.slice(11,-1));
		});
		return arr;
	}
};