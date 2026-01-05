// ==UserScript==
// @name         Athena HIT search productivity enhancement
// @namespace    mobiusevalon.tibbius.com
// @version      2.0-7
// @author       Mobius Evalon
// @description  Provides a number of improvements when searching for and working on HITs, including AA time, six-level TO filtering, use of HitScraper blocklist, qualification feasibility tiers, etc.
// @license      Creative Commons Attribution-ShareAlike 4.0; http://creativecommons.org/licenses/by-sa/4.0/
// @include      /^https{0,1}:\/\/\w{0,}\.?mturk\.com.+/
// @exclude      /&hit_scraper$/
// @exclude      /\/HM$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22586/Athena%20HIT%20search%20productivity%20enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/22586/Athena%20HIT%20search%20productivity%20enhancement.meta.js
// ==/UserScript==

if(window.olympus === undefined) window.olympus = {};

olympus.athena = {
	__name:"athena",
	__version:"2.0-7",
	__href:"https://greasyfork.org/en/scripts/22586-athena-hit-search-productivity-enhancement",
	default_settings:{
		// filter bar when using the scraper
		interface_blocked_filter:true,
		interface_highlighted_filter:true,
		interface_qualified_filter:true,
		interface_testable_filter:true,
		interface_requestable_filter:true,
		interface_unqualified_filter:false,
		interface_impossible_filter:false,
		interface_great_to_filter:true,
		interface_good_to_filter:true,
		interface_fair_to_filter:true,
		interface_poor_to_filter:true,
		interface_awful_to_filter:false,
		interface_no_to_filter:true,
		// filter bar when browsing Turk
		assist_blocked_filter:true,
		assist_highlighted_filter:true,
		assist_qualified_filter:true,
		assist_testable_filter:true,
		assist_requestable_filter:true,
		assist_unqualified_filter:false,
		assist_impossible_filter:false,
		assist_great_to_filter:true,
		assist_good_to_filter:true,
		assist_fair_to_filter:true,
		assist_poor_to_filter:true,
		assist_awful_to_filter:false,
		assist_no_to_filter:true,
		// scraper settings
		scraper_min_reward:0,
		scraper_feasibility:"requestable",
		scraper_min_to_pay:2.5,
		scraper_min_to_avg:3.5,
		scraper_min_batch_size:0,
		scraper_min_results:0,
		scraper_failure_threshold:10,
		scraper_results_per_page:10,
		scraper_pages:1,
		scraper_search_interval:10,
		scraper_interval_type:"soft",
		scraper_search_order:"LastUpdatedTime",
		scraper_order_toggle:"down",
		scraper_keyword:"",
		scraper_list_behavior:"normal",
		scraper_masters:false,
		// misc user settings
		batch_mode:false,
		bubble_hits:true,
		frame_height:635,
		not_accepted_clickthrough:true,
		detail_expand:"unqualified",
		display_counter:true
	},
	scraper:{
		__options:null,
		__results:null,
		__hud_counter:function(icon,name,title) {
			return $("<span/>")
				.attr("title",title)
				.append(
					$("<span/>").attr("class","fa fa-fw fa-lg "+icon),
					$("<span/>").attr("class",name).text("0")
				);
		},
		__interface_option:function(id,type,desc) {
			var $label = $("<label/>").append(
				document.createTextNode(desc+":")
			);
			switch(type) {
				case "text": case "number": {
					$label.append(
						$("<input/>")
							.attr({
								"id":id,
								"type":type
							})
							.val(olympus.settings.get(olympus.athena,id))
					);
					break;
				}
				case "checkbox": {
					$label.append(
						$("<span/>")
							.attr({
								"id":id,
								"class":("fa fa-lg fa-toggle-"+(olympus.settings.get(olympus.athena,id) === true ? "on" : "off"))
							})
							.click(function() {
								$(this).toggleClass("fa-toggle-off fa-toggle-on");
							})
					);
					break;
				}
			}
			return $label;
		},
		_async_scraped_page:function(response) {
			var rids = [];

			$("a.capsulelink",response).each(function() {
				var hit = $(this).closest("table").parent().closest("table"),
					deets = olympus.utilities.capsule_info(hit);
				deets.feasibility = olympus.athena.__parse_quals(hit);
				olympus.athena.scraper.counts.total++;

				// exclusionary preprocessing; we can eliminate hits here to reduce the pending turkopticon query and avoid
				// querying for information we don't even need
				if($("#"+deets.hit_id).length) olympus.athena.scraper.counts.duplicate++;
				else if(olympus.athena.scraper.__options.scraper_list_behavior === "blocked" && olympus.athena.__blocked.match(deets.hit_name.compactAndLowerCase(),deets.requester_name.compactAndLowerCase())) olympus.athena.scraper.counts.blocked++;
				else if(olympus.athena.scraper.__options.scraper_list_behavior === "highlighted" && !olympus.athena.__highlighted.match(deets.hit_name.compactAndLowerCase(),deets.requester_name.compactAndLowerCase())) olympus.athena.scraper.counts.blocked++;
				else if(olympus.athena.__qual2int(deets.feasibility) > olympus.athena.__qual2int(olympus.athena.scraper.__options.scraper_feasibility)) olympus.athena.scraper.counts.feasibility++;
				else if(deets.hit_reward*1 < olympus.athena.scraper.__options.scraper_min_reward*1) olympus.athena.scraper.counts.pay++;
				else if(deets.hits_available*1 < olympus.athena.scraper.__options.scraper_min_batch_size*1) olympus.athena.scraper.counts.batch++;
				else {
					olympus.athena.scraper.__results.push(deets);
					rids.push(deets.requester_id);
				}
			});
/*
			$.each(this.__results,function(idx,hit) {
				if(!rids.contains(hit.requester_id)) rids.push(hit.requester_id);
			});
*/
			if(rids.length) olympus.utilities.turkopticon(rids,this._async_turkopticon,this);
			//else this._display();
		},
		_async_turkopticon:function(response) {
			function avg_info(rid) {
				var has_to = ($.type(response[rid]) === "object" && response[rid].hasOwnProperty("attrs")),
					avg = (has_to ? olympus.utilities.to_average(response[rid]) : 0);
				return {
					avg:avg,
					rating:(has_to ? olympus.athena.to_avg_to_text(Math.round(avg)) : "no")
				};
			}

			this.__results = this.__results.filter(function(val) {
				var has_to = (response.hasOwnProperty(val.requester_id) && $.type(response[val.requester_id]) === "object" && response[val.requester_id].hasOwnProperty("attrs")),
					rinfo = avg_info(val.requester_id);

				if(!has_to && (olympus.athena.scraper.__options.scraper_min_to_avg*1 > 0 || olympus.athena.scraper.__options.scraper_min_to_pay*1 > 0)) {olympus.athena.scraper.counts.turkopticon++; return false;}
				else if(has_to && (rinfo.avg*1 < olympus.athena.scraper.__options.scraper_min_to_avg*1 || response[val.requester_id].attrs.pay*1 < olympus.athena.scraper.__options.scraper_min_to_pay*1)) {olympus.athena.scraper.counts.turkopticon++; return false;}
				else {
					val.to_average = rinfo.avg.toFixed(2);
					val.to_rating = rinfo.rating;
					if(has_to) {
						val.to_pay = response[val.requester_id].attrs.pay;
						val.to_fair = response[val.requester_id].attrs.fair;
						val.to_fast = response[val.requester_id].attrs.fast;
						val.to_comm = response[val.requester_id].attrs.comm;
						val.to_tos = response[val.requester_id].tos_flags;
						val.to_review_count = response[val.requester_id].reviews;
					}
					return true;
				}
			});
/*
			$.each(response,function(rid,data) {
				var has_to = ($.type(data) === "object" && data.hasOwnProperty("attrs"));

				if(!has_to && (olympus.athena.scraper.__options.scraper_min_to_avg*1 > 0 || olympus.athena.scraper.__options.scraper_min_to_pay*1 > 0)) return true;
				else if(has_to && (data.average*1 < olympus.athena.scraper.__options.scraper_min_to_avg*1 || data.attrs.pay*1 < olympus.athena.scraper.__options.scraper_min_to_pay*1)) return true;
				else {
					var rinfo = avg_info(rid);
					olympus.athena.scraper.__req_info[rid] = data;
					olympus.athena.scraper.__req_info[rid].average = rinfo.avg.toFixed(2);
					olympus.athena.scraper.__req_info[rid].rating = rinfo.rating;
				}
			});

			this.__results = this.__results.filter(function(val) {
				if(olympus.athena.scraper.__req_info.hasOwnProperty(val.requester_id)) return true;
				else {olympus.athena.scraper.counts.turkopticon++; return false;}
			});
*/
			this._display();
		},
		_display:function() {
			function feasibility_icon(f,p) {
				var icon = $(f === "qualified" ? "<a/>" : "<span/>").attr({
					"class":("fa fa-lg fa-fw "+olympus.athena.desc2fa(f)+" feasibility-icon"),
					"title":(f.ucFirst()+"\n"+olympus.athena.feasibility2desc(f))
				});
				if(f === "qualified") icon.attr("href",p);
				return icon;
			}

			if(this.__results.length) {
				if(!$("#athena_results").length) $("body").append(
					$("<table/>")
						.attr("id","athena_results")
						.append(
							$("<thead/>").append(
								$("<tr/>").append(
									$("<th/>").text("Feas."),
									$("<th/>").text("HIT"),
									$("<th/>").text("Avail."),
									$("<th/>").text("Requester"),
									$("<th/>").text("Pay"),
									$("<th/>").text("TO")
								)
							),
							$("<tbody/>").attr("class","generic")
						)
						.tablesorter({
							textExtraction: {
								0:function(n,t,c) {var title = $(".fa",n).attr("title"); return olympus.athena.__qual2int(title.slice(0,title.indexOf("\n")));},
								1:function(n,t,c) {return $(".title",n).text();},
								3:function(n,t,c) {return $(".requester",n).text();},
								4:function(n,t,c) {return $(n).text().slice(1);},
								5:function(n,t,c) {return $("a",n).first().text();}
							},
							sortAppend: {
								0:[[1,"a"]],
								3:[[1,"a"]],
								4:[[1,"a"]],
								5:[[1,"a"]],
							}
						})
				);

				$.each(this.__results,function(index,deets) {
					var to_tt = ("Average: "+deets.to_average+"\nPay: "+deets.to_pay+" | Fair: "+deets.to_fair+"\nFast: "+deets.to_fast+" | Comm: "+deets.to_comm+"\nReviews: "+deets.to_review_count+" | TOS: "+deets.to_tos);
					$("#athena_results tbody.generic").append(
						$("<tr/>")
							.attr({
								"id":deets.hit_id,
								"data-feasibility":deets.feasibility,
								"data-to":deets.to_rating,
								"class":"athena_contains_hit"
							})
							.append(
								$("<td/>").append(
									feasibility_icon(deets.feasibility,deets.panda_link)
								),
								$("<td/>").append(
									olympus.athena.list_management_element("highlighted","hit")
										.on("anchor",function() {
											return $(this).siblings(".title").first();
										}),
									olympus.athena.list_management_element("blocked","hit")
										.on("anchor",function() {
											return $(this).siblings(".title").first();
										}),
									$("<a/>")
										.attr({
											"class":"title",
											"target":"_blank",
											"href":deets.preview_link,
											"title":deets.hit_desc
										})
										.text(deets.hit_name)
								),
								$("<td/>").text(deets.hits_available),
								$("<td/>")
									.attr({
										"class":deets.to_rating+"_to_rating",
										"title":to_tt
									})
									.append(
										olympus.athena.list_management_element("highlighted","requester")
											.on("anchor",function() {
												return $(this).siblings(".requester").first();
											}),
										olympus.athena.list_management_element("blocked","requester")
											.on("anchor",function() {
												return $(this).siblings(".requester").first();
											}),
										$("<a/>")
											.attr({
												"class":"requester",
												"target":"_blank",
												"href":deets.requester_hits
											})
											.text(deets.requester_name)
								),
								$("<td/>")
									.attr({
										"class":(olympus.athena.to_avg_to_text(deets.to_pay)+"_to_rating"),
										"title":to_tt
									})
									.text(deets.hit_reward),
								$("<td/>")
									.append(
										$("<a/>")
											.attr({
												"target":"_blank",
												"href":deets.to_reviews,
											})
											.text(deets.to_average)
									.attr("title",to_tt)
								)
							)
					);
					olympus.athena.__blocked.eval_hit("#"+deets.hit_id);
					olympus.athena.__highlighted.eval_hit("#"+deets.hit_id);
				});

				this.counts.displayed += this.__results.length;

				$("#athena_results").trigger("updateRows",true);
				olympus.hermes.add_buttons();
				this.__results = [];
			}
			$.each(this.counts,function(key,val) {
				$("#info_panel ."+key).text(val);
			});
			$(".control_box span.fa").first().removeClass("fa-stop").addClass("fa-play");
		},
		counts:{
			total:0,
			duplicate:0,
			blocked:0,
			feasibility:0,
			pay:0,
			turkopticon:0,
			batch:0,
			displayed:0
		},
		commit_settings:function() {
			olympus.settings.update(olympus.athena,olympus.athena.scraper.retrieve_options());
		},
		form_url:function() {
			function sort_int() {
				if(olympus.athena.scraper.__options.scraper_order_toggle === "down") {
					if(olympus.athena.scraper.__options.scraper_search_order === "Title") return "0";
					else return "1";
				}
				else {
					if(olympus.athena.scraper.__options.scraper_search_order === "Title") return "1";
					else return "0";
				}
			}
			var parameters = (
				"selectedSearchType=hitgroups"+
				"&minReward="+olympus.athena.scraper.__options.scraper_min_reward+
				"&sortType="+olympus.athena.scraper.__options.scraper_search_order+":"+sort_int()+
				"&pageSize="+olympus.athena.scraper.__options.scraper_results_per_page
			);
			if(olympus.athena.scraper.__options.scraper_keyword.length) parameters += ("&searchWords="+olympus.athena.scraper.__options.scraper_keyword);
			if(olympus.athena.scraper.__options.scraper_masters === true) parameters += "&requiresMasterQual=on";

			return ("/mturk/searchbar?"+parameters);
		},
		init:function() {
			// the athena scraper interface proper
			olympus.utilities.clear_page("Athena HIT scraper");
			olympus.style.add(
				".athena_interface {background-color: #eee; margin: 0px auto; padding: 5px; min-width: 750px;} "+
				"#athena_search label {display: inline-block; padding: 2px 0px;}"+
				"#athena_search label:hover, #athena_results tbody tr:hover {background-color: #d9d9d9;}"+
				"#athena_search label:not(:last-of-type) {margin-right: 15px;}"+
				"#athena_search label > input, #athena label > select, #athena label > .fa-toggle-off, #athena label > .fa-toggle-on {margin-left: 6px;} "+
				"#athena_search label input[type='number'] {width: 50px;}"+
				"#athena_search legend .fa-plus-square-o, #athena fieldset legend .fa-minus-square-o, #athena legend .fa-question-circle-o, "+
					"#athena_search label .fa-chevron-up, #athena_search label .fa-chevron-down, #athena_search label .fa-chain, "+
					"#athena_search label .fa-chain-broken {cursor: pointer;}"+
				".athena_interface .control_box, .athena_interface .filter_box {display: inline-block;}"+
				".athena_interface .control_box {width: 25%}"+
				".athena_interface #athena_filter {display: inline-block;}"+
				"#athena_results {margin: 0px auto;}"+
				"#info_panel {font-weight: bold;}"+
				"#info_panel > span {margin: 0px 8px;}"+
				"a.feasibility-icon {text-decoration: none;}"
			);
			olympus.help.add({
				athena_search_options:
					"<p>All of the options inside the Search Configuration box are exclusionary; that is, HITs that do not satisfy these conditions will be discarded and will not appear in the result table below.  All discarded HITs are tabulated just above the result table to let you know why HITs are not appearing.</p>"+
					"<p>All Search Configuration options are parsed just before each scrape, so you can change the settings during a scrape and they will be applied as soon as possible afterward.  This will not affect existing results, though.  If you were to change the minimum reward from $0.02 to $0.10, none of the currently displayed HITs that pay less than a dime are removed from the result table.</p>"+
					"<p>Once results are found that do satisfy the exclusionary settings, they are displayed below and you can filter and sort the returned HITs.  All table headers are clickable to allow sorting in both directions, and the Athena filter bar will let you filter the results that appear.</p>"+
					"<p class='inset'><b>Search term</b>Pretty obvious.  When used, you will get HITs that contain the term in requester names, HIT titles, HIT descriptions, and keywords.</p>"+
					"<p class='inset'><b>Search order</b>This option will retrieve HITs from Turk in the specified order.  It is not a sort order for the results.  The <span class='fa fa-chevron-down'></span> / <span class='fa fa-chevron-up'></span> icon will alter the order as listed in the dropdown next to it.  This button does not toggle a classic ascending or descending order, it toggles the more desirable options and the less desirable ones.</p>"+
					"<p class='inset'><b>Search interval</b>The behavior of this option depends on the icon to next to the textbox.<br><br>When using a <span class='fa fa-chain'></span> soft interval, Athena will not start the timer until after the result is done.  For example, if this option is set to 5 seconds and it takes Athena 7 seconds to process the results, it will take 12 seconds between scrapes because the 5 second timer does not begin until after the 7 second scrape is completed.<br><br>When using a <span class='fa fa-chain-broken'></span> hard interval, Athena will forcibly stop what it is doing, display any results it has already processed, and begin a new scrape at the specified interval each time.  Using the same 5 second timer and potential 7 second scrape defined earlier, Athena will quit what it is doing every 5 seconds to keep the given interval.</p>"+
					"<p class='inset'><b>Scrape behavior</b>How to use your blocklist and includelist in the search, if at all.  \"Normal\" means that HITs are not checked against the block or include lists when scraped and will always be eligible for display in the result table.  \"Skip blocked\" will compare all scrape results to your blocklist and will not display the HIT in the results if it is blocked, as if it never existed.  \"Only included\" means that only items in your include list will be returned and nothing else will reach the result table.  Consider using the failure threshold if you decide to use this option.</p>"+
					"<p class='inset'><b>Minimum feasibility</b>Each HIT that is scraped is compared against this value and left out of the result if it is below the current setting.  For example, using a setting of \"requestable\" means that qualified, testable, and requestable HITs will appear, but unqualified and impossible ones will not.  Setting this to \"impossible\" means that no HITs will be filtered out of the search by feasibility.</p>"+
					"<p class='inset'><b>Only Masters HITs</b>When enabled, the scraper will only return Masters tasks.  These tasks are still subject to all other exclusionary filters, like being blocked or paying too little.</p>"+
					"<p class='inset'><b>Pages</b>The number of pages that the scraper will traverse in the pursuit of results.  In general, you shouldn't scrape any more than a single page.</p>"+
					"<p class='inset'><b>Results per page</b>The number of HITs per page in the Turk search.  This and the number of pages are mostly for interoperability with other scripts.  For example, every time this script scrapes a page, the number of results per page is \"saved\" on Turk's end and affects all other scripts.  If you decide to do 1 page of 100 results here, then every panda that TurkMaster or Artemis checks will load 100 HITs per page if there is no work to be found.  This has a tendency to crash the tab.</p>"+
					"<p class='inset'><b>Minimum results</b>The minimum number of result HITs where Athena can consider the scrape a success.  For example, if you use 2 pages, 10 HITs per page, 15 minimum results, then Athena will scrape at least two pages and then continue to scrape pages if it has to until it gets 15 usable HITs.  All HITs excluded by the search configuration do not count toward this number, e.g. if the first page contains all blocked HITs then these have contributed zero toward the minimum result threshhold.  A value of zero here means that Athena will scrape the number of pages you have defined and no more, regardless of the number or type of results it gets back.</p>"+
					"<p class='inset'><b>Failure threshold</b>When Athena has discarded this many HITs one after another, it considers the scrape failed (or completed).  This is mostly a built-in safety to make sure you don't accidentally continue a fruitless scrape forever, such as searching for Masters only HITs and filtering out impossible qualifications (which will return zero results forever if you don't have Masters.)  This can also help in other situations, such as when certain requesters you have blocked post a ton of work and clog up the results.</p>",
			});
			$("body").addClass("athena_interface").append(
				$("<div/>")
					.attr({
						"data-pantheon":"athena",
						"id":"athena"
					})
					.append(
						$("<div/>").text(
							"Congratulations, you know regular expressions well enough to find a beta feature that has not been "+
							"announced.  You can tinker here all you want, but don't expect anything to work."
						),
						$("<fieldset/>").attr("id","athena_search").append(
							$("<legend/>").append(
								$("<span/>")
									.attr("class","fa fa-fw fa-lg fa-minus-square-o")
									.click(function() {
										$(this).toggleClass("fa-minus-square-o fa-plus-square-o");
										if($(this).hasClass("fa-plus-square-o")) $("#athena_search").children().not("legend").hide();
										else $("#athena_search").children().not("legend").show();
									}),
								document.createTextNode("Search configuration"),
								$("<span/>")
									.attr("class","fa fa-fw fa-lg fa-question-circle-o")
									.click(function() {
										olympus.help.display("athena_search_options");
									})
							),
							this.__interface_option("scraper_keyword","text","Search term"),
							$("<label/>").append(
								document.createTextNode("Search order:"),
								$("<select/>")
									.attr("id","scraper_search_order")
									.append(
										$("<option/>")
											.attr("value","LastUpdatedTime")
											.text("Age (newest)"),
										$("<option/>")
											.attr("value","Reward")
											.text("Reward (most)"),
										$("<option/>")
											.attr("value","NumHITs")
											.text("Batch size (most)"),
										$("<option/>")
											.attr("value","Title")
											.text("Title (A-Z)")
									)
									.on("update_options",function() {
										function desc(dir,type) {
											switch(type) {
												case "Age": return (dir === "asc" ? "oldest" : "newest");
												case "Reward": case "Batch size": return (dir === "asc" ? "least" : "most");
												case "Title": return (dir === "asc" ? "Z-A" : "A-Z");
											}
										}

										var dir = ($("#scraper_order_toggle").hasClass("fa-chevron-up") ? "asc" : "desc");
										$(this).children().each(function() {
											var type = $(this).text().slice(0,$(this).text().indexOf("(")-1);
											$(this).text(type+" ("+desc(dir,type)+")");
										});
									})
									.val(olympus.settings.get(olympus.athena,"scraper_search_order")),
								$("<span/>")
									.attr({
										"class":"fa fa-lg fa-chevron-"+olympus.settings.get(olympus.athena,"scraper_order_toggle"),
										"id":"scraper_order_toggle"
									})
									.click(function() {
										$(this).toggleClass("fa-chevron-down fa-chevron-up");
										$("#scraper_search_order").triggerHandler("update_options");
									})
							),
							this.__interface_option("scraper_search_interval","number","Search interval").append(
								$("<span/>")
									.attr({
										"id":"scraper_interval_type",
										"class":("fa fa-lg fa-chain"+(olympus.settings.get(olympus.athena,"scraper_interval_type") === "hard" ? "-broken" : "")),
										"title":("Using "+olympus.settings.get(olympus.athena,"scraper_interval_type")+" interval")
									})
									.click(function() {
										$(this)
											.toggleClass("fa-chain fa-chain-broken")
											.attr("title",($(this).hasClass("fa-chain") ? "Using soft interval" : "Using hard interval"));
									})
							),
							$("<br/>"),
							$("<label/>").append(
								document.createTextNode("Scrape behavior:"),
								$("<select/>")
									.attr("id","scraper_list_behavior")
									.append(
										$("<option/>")
											.attr("value","normal")
											.text("Normal"),
										$("<option/>")
											.attr("value","blocked")
											.text("Skip blocked"),
										$("<option/>")
											.attr("value","highlighted")
											.text("Only included")
									)
									.val(olympus.settings.get(olympus.athena,"scraper_list_behavior"))
							),
							$("<label/>").append(
								document.createTextNode("Minimum feasibility:"),
								$("<select/>")
									.attr("id","scraper_feasibility")
									.append(
										$("<option/>")
											.attr("value","qualified")
											.text("Qualified"),
										$("<option/>")
											.attr("value","testable")
											.text("Testable"),
										$("<option/>")
											.attr("value","requestable")
											.text("Requestable"),
										$("<option/>")
											.attr("value","unqualified")
											.text("Unqualified"),
										$("<option/>")
											.attr("value","impossible")
											.text("None")
									)
									.val(olympus.settings.get(olympus.athena,"scraper_feasibility"))
							),
							this.__interface_option("scraper_masters","checkbox","Only Masters HITs"),
							this.__interface_option("scraper_min_reward","number","Minimum reward"),
							this.__interface_option("scraper_min_to_avg","number","Minimum TO average")
								.children("input").first()
									.on("blur onblur",function() {
										$(this).triggerHandler("to_bg");
									})
									.on("to_bg",function() {
										$(this).removeClass().addClass(olympus.athena.to_avg_to_text($(this).val())+"_to_rating");
									})
									.end().end(),
							this.__interface_option("scraper_min_to_pay","number","Minimum TO pay")
								.children("input").first()
									.on("blur onblur",function() {
										$(this).triggerHandler("to_bg");
									})
									.on("to_bg",function() {
										$(this).removeClass().addClass(olympus.athena.to_avg_to_text($(this).val())+"_to_rating");
									})
									.end().end(),
							this.__interface_option("scraper_min_batch_size","number","Minimum batch size"),
							$("<br/>"),
							this.__interface_option("scraper_pages","number","Pages"),
							this.__interface_option("scraper_results_per_page","number","Results per page"),
							this.__interface_option("scraper_min_results","number","Minimum results"),
							this.__interface_option("scraper_failure_threshold","number","Failure threshold")
						),
						$("<div/>").append(
							$("<div/>")
								.attr("class","control_box")
								.append(
								$("<span/>")
									.attr("class","fa fa-fw fa-2x fa-play")
									.click(function() {
										$(this).toggleClass("fa-play fa-stop");
										//localStorage.test = "testing";
										olympus.athena.scraper.start();
									}),
								$("<span/>")
									.attr("class","fa fa-fw fa-2x fa-eraser")
									.click(function() {
										if(confirm("Are you sure you want to clear the result table?")) olympus.athena.scraper.reset();
									}),
								olympus.settings.button("athena")
									.addClass("fa-2x")
								),
							olympus.athena.create_filter_bar()
						),
						$("<div/>")
							.attr("id","info_panel")
							.append(
								this.__hud_counter("fa-balance-scale","total","The total number of HITs returned from Turk before Athena processed any of the results."),
								document.createTextNode(" - "),
								this.__hud_counter("fa-copy","duplicate","The number of HITs that are already displayed in the result table, but were encountered again in subsequent scrapes."),
								document.createTextNode(" - "),
								this.__hud_counter("fa-ban","blocked","This is the number of HITs that were in your blocklist if \"Skip blocked\" scrape mode is being used and/or the number of HITs that were not in your include list if \"Only included\" scrape mode is being used."),
								document.createTextNode(" - "),
								this.__hud_counter("fa-pie-chart","feasibility","The number of HITs that did not meet the minimum feasibility setting."),
								document.createTextNode(" - "),
								this.__hud_counter("fa-usd","pay","The number of HITs that did not meet the minimum pay setting."),
								document.createTextNode(" - "),
								this.__hud_counter("fa-eye","turkopticon","The number of HITs that did not meet the minimum Turkopticon settings."),
								document.createTextNode(" - "),
								this.__hud_counter("fa-stack-overflow","batch","The number of HITs that did not have a large enough batch size to meet the current setting."),
								document.createTextNode(" = "),
								this.__hud_counter("fa-filter","displayed","The total number of HITs that were not discarded from all filters to the left.")
							)
					)
			);
			this.__results = [];
			this.__options = {};

			$("#scraper_search_order").triggerHandler("update_options");
			$("#scraper_min_to_avg, #scraper_min_to_pay").trigger("to_bg");
			if(!olympus.settings.get(olympus.athena,"display_counter")) $("#info_panel").hide();
			$(window).on("beforeunload",olympus.athena.scraper.commit_settings);
		},
		reset:function() {
			$("#athena_results tbody").empty();
			$.each(this.counts,function(key,val) {
				olympus.athena.scraper.counts[key] = 0;
				$("#info_panel ."+key).text("0");
			});
		},
		retrieve_options:function() {
			$.each($("#athena_search *[id]"),function() {
				var $e = $(this),
					v;
				if($e.attr("id") === "scraper_order_toggle") v = ($e.hasClass("fa-chevron-down") ? "down" : "up");
				else if($e.attr("id") === "scraper_interval_type") v = ($e.hasClass("fa-chain-broken") ? "hard" : "soft");
				else if($e.attr("id") === "scraper_masters") v = $e.hasClass("fa-toggle-on");
				else if($e.attr("id") === "scraper_min_reward") v = ($e.val()*1).toFixed(2);
				olympus.athena.scraper.__options[$e.attr("id")] = (v || $e.val().collapseWhitespace());
			});
			return this.__options;
		},
		start:function() {
			this.retrieve_options();
			olympus.utilities.ajax_get(["https://www.mturk.com"],this.form_url(),this._async_scraped_page,this);
		}
	},
	__configurable:function() {
		return [
			olympus.settings.explain({
				type:"subheader",
				desc:"Turk browsing settings"
			}),
			olympus.settings.generate({
				option:"not_accepted_clickthrough",
				type:"checkbox",
				value:olympus.settings.get(olympus.athena,"not_accepted_clickthrough"),
				name:"Clickthrough warning",
				desc:
					"Athena places a red box around the work frame of a HIT when you have not accepted it.  This is convenient "+
					"because you won't accidentally complete HITs or surveys without first having accepted them, which happens more "+
					"often than you may think.  This option will require you to click the warning box to interact with the HIT beneath "+
					"it, while disabling this option will simply overlay a red screen on the HIT without needing to be clicked."
			}),
			olympus.settings.generate({
				option:"detail_expand",
				type:"dropdown",
				selections:["none","qualified","testable","requestable","unqualified","all"],
				value:olympus.settings.get(olympus.athena,"detail_expand"),
				name:"Expand HIT details",
				desc:
					"The lowest feasibility level under which to expand the details of a HIT in the search list automatically.  \"All\" "+
					"and \"none\" should be obvious, and the rest of the options will expand details for any HIT with a feasibility "+
					"at that level and above.  For instance, selecting \"requestable\" means that all HITs that are requestable, "+
					"testable, and qualified will have their details expanded, while unqualified and impossible HITs will not."
			}),
			olympus.settings.explain({
				type:"subheader",
				desc:"Scraper settings"
			}),
			olympus.settings.generate({
				option:"bubble_hits",
				type:"checkbox",
				value:olympus.settings.get(olympus.athena,"bubble_hits"),
				name:"Bubble new HITs",
				desc:
					"If enabled, new HITs will be displayed in a group at the top of the results table instead of being placed "+
					"throughout by the sorting order."
			}),
			olympus.settings.generate({
				option:"display_counter",
				type:"checkbox",
				value:olympus.settings.get(olympus.athena,"display_counter"),
				name:"Display filter counts",
				desc:
					"Athena counts the number of HITs it discards while scraping based on your settings, and this option turns the "+
					"counter bar on and off."
			})
		];
	},
	__parse_settings:function(settings) {
		olympus.settings.update(olympus.athena,settings);
		if(settings.display_counter) $("#info_panel").show();
		else $("#info_panel").hide();
		olympus.athena.expand_hit_details();
	},
	__init:function() {
		console.log("athena init");
		olympus.help.add({
			athena_filter_options:
				"<p>Each item in the filtering box allows you to refine the display of HITs in the result table.  The icons will grey out when the option is not enabled and will be colorized when in use.</p>"+
				"<p>Hovering over each of the items will tell you how many of that type of HIT are present on the page.</p>"+
				"<table>"+
				"<tr><td><span data-function='desc2fa' data-args='blocked'></span></td><td>Blocked HITs.  Athena supports both its own internal blocking and the HitScraper blocklist, if the script is installed.</td></tr>"+
				"<tr><td><span data-function='desc2fa' data-args='highlighted'></span></td><td>Whitelisted HITs.  This includes both Athena's in-house whitelist and HitScraper's includelist, if the latter is installed.</td></tr>"+
				"<tr><td><span data-function='desc2fa' data-args='qualified'></span></td><td><span data-function='feasibility2desc' data-args='qualified'></td></tr>"+
				"<tr><td><span data-function='desc2fa' data-args='testable'></span></td><td><span data-function='feasibility2desc' data-args='testable'></td></tr>"+
				"<tr><td><span data-function='desc2fa' data-args='requestable'></span></td><td><span data-function='feasibility2desc' data-args='requestable'></td></tr>"+
				"<tr><td><span data-function='desc2fa' data-args='unqualified'></span></td><td><span data-function='feasibility2desc' data-args='unqualified'></td></tr>"+
				"<tr><td><span data-function='desc2fa' data-args='impossible'></span></td><td><span data-function='feasibility2desc' data-args='impossible'></td></tr>"+
				"<tr><td><span class='toggle_element great_to_rating'></span></td><td>Great overall TO, which is a value of 5 on the TO scale.  These averages depend on your selections inside the Olympian Settings window, and are rounded to the nearest integer to determine its color.  This means a 3.51 is color coded as 4 (good) while a 3.49 is color coded as 3 (fair).</td></tr>"+
				"<tr><td><span class='toggle_element good_to_rating'></td><td>Good overall TO, a value of 4 on the scale.</td></tr>"+
				"<tr><td><span class='toggle_element fair_to_rating'></td><td>Fair overall TO, a value of 3 on the scale.</td></tr>"+
				"<tr><td><span class='toggle_element poor_to_rating'></td><td>Poor overall TO, a value of 2 on the scale.</td></tr>"+
				"<tr><td><span class='toggle_element awful_to_rating'></td><td>Awful overall TO, a value of 1 on the scale.</td></tr>"+
				"<tr><td><span class='toggle_element no_to_rating'></td><td>No TO ratings for this requester exist.</td></tr>"+
				"</table>"
		});
		olympus.style.add(
			".qual_icon.[qualified], #athena_filter .qualifications .[qualified].enabled, #olympian_help .[qualified], .capsule_icon.[qualified], #athena_results .feasibility-icon.[qualified] {color: #050;}"+
			".qual_icon.[unqualified], .qual_icon.[impossible], #athena_filter .watchlists .[blocked].enabled, #athena_filter .qualifications .[unqualified].enabled, #athena_filter .qualifications .[impossible].enabled, #olympian_help .[blocked], #olympian_help .[unqualified], #olympian_help .[impossible], .capsule_icon.[unqualified], .capsule_icon.[impossible], #athena_results .feasibility-icon.[unqualified], #athena_results .feasibility-icon.[impossible] {color: #a45555;}"+
			"#athena_filter .watchlists .[highlighted].enabled, #olympian_help .[highlighted] {color: #ffd37b;}"+
			".qual_icon.[requestable], #athena_filter .qualifications .[requestable].enabled, #olympian_help .[requestable], .capsule_icon.[requestable], #athena_results .feasibility-icon.[requestable] {color: #eebb56; text-decoration: none;}"+
			".qual_icon.[testable], #athena_filter .qualifications .[testable].enabled, #olympian_help .[testable], .capsule_icon.[testable], #athena_results .feasibility-icon.[testable] {color: #005; text-decoration: none;}"+
			".capsule_icon {background-color: #fff; position: relative; left: -3px; border-radius: 6px;}"+
			".qual_icon {width: 16px; height: 16px; font-size: 150%; text-align: center;}"+
			".impossible {opacity: 0.5;}"+
			".great_to_rating {background-color: #b8f188;}"+
			".good_to_rating {background-color: #ebf188;}"+
			".fair_to_rating {background-color: #ffd37b;}"+
			".poor_to_rating {background-color: #f5b3b3;}"+
			".awful_to_rating {background-color: #de9aff;}"+
			".no_to_rating {background: linear-gradient(to right,#ccdde9,#ccc)}"+
			"#athena_filter {text-align: center; margin: 0px auto;}"+
			"#athena_filter > div {display: inline-block;}"+
			"#athena_filter .watchlists, #athena_filter .qualifications {margin-right: 24px;}"+
			"#athena_filter .to_ratings label, #olympian_help .toggle_element {display: inline-block; width: 24px; height: 24px; text-align: center;}"+
			"#athena_filter .to_ratings input[type='checkbox'] {width: 16px; height: 16px;}"+
			"#athena_filter .watchlists .fa.disabled, #athena_filter .qualifications .fa.disabled {opacity: 0.75; color: #ccc;}"+
			"#athena_filter .fa-question-circle-o {margin-left: 15px;}"+
			".block_item, .athena_blocked_button, .athena_highlighted_button {cursor: pointer;}"+
			".athena_blocked_button.disabled, .athena_highlighted_button.disabled {opacity: 0.25;}"+
			"tr.filtered_out {display: none !important;}"+
			"#frame_height {width: 55px;}"+
			"#olympian_help table tr td:nth-child(1) {vertical-align: top; text-align: center;}"+
			"#olympian_help table tr td:nth-child(2) {padding-bottom: 15px;}"+
			"#hit_not_accepted {background-color: #ffa6a6; opacity: 1; z-index: 100; width: 100%; height: 100%; position: absolute; top: 0px; left: 0px;}"+
			"#hit_not_accepted div {width: 450px; text-align: center; margin: 10px auto;}"+
			"#hit_not_accepted h1 {font-size: 150%; margin: 10px 0px;} "+
			"span.capsulelink {padding-right: 3px;}"+
			".athena_contains_hit.highlighted.enabled .athena_hit_table {border: 3px dashed #0f0;}"+
			".athena_contains_hit.blocked .athena_hit_table {border: 3px solid #f00;}",
			{
				qualified:olympus.athena.desc2fa("qualified"),
				testable:olympus.athena.desc2fa("testable"),
				requestable:olympus.athena.desc2fa("requestable"),
				unqualified:olympus.athena.desc2fa("unqualified"),
				impossible:olympus.athena.desc2fa("impossible"),
				blocked:olympus.athena.desc2fa("blocked"),
				highlighted:olympus.athena.desc2fa("highlighted")
			}
		);

		Array.prototype.regex_match = function(string) {
			return (this.filter(function(regexp) {
				if($.type(regexp) === "regexp" && regexp.test(string)) return true;
			}).length > 0);
		};

		String.prototype.compactAndLowerCase = function() {
			return this.toLowerCase().collapseWhitespace().trim();
		};

		// separate "first assigned hit" and "list my assigned hits" links.  i find the
		// latter useful when lots of pandas go off
		$("#subtabs")
			.find("a:contains(HITs Assigned To You)").first().replaceWith(
				$("<span/>").append(
					document.createTextNode("Assigned [ "),
					$("<a/>")
						.attr({
							"class":"subnavclass",
							"href":"/mturk/myhits?first"
						})
						.text("First"),
						document.createTextNode(" | "),
					$("<a/>")
						.attr({
							"class":"subnavclass",
							"href":"/mturk/myhits"
						})
						.text("List"),
						document.createTextNode(" ]")
				)
			)
			.end().end().find("a:contains(HITs Available To You)").first().text("Qualified");

		this.__blocked = new control_list("blocked");
		this.__highlighted = new control_list("highlighted");

		$(window).on("storage",function(e) {
			//console.log(e);
			if(e.originalEvent.key === "scraper_ignore_list") {
				olympus.athena.__blocked.refresh(e.originalEvent.newValue);
				olympus.athena.__blocked.update();
			}
			else if(e.originalEvent.key === "scraper_include_list") {
				olympus.athena.__highlighted.refresh(e.originalEvent.newValue);
				olympus.athena.__highlighted.update();
			}
		});

		if(/(?:&|\?)athena$/i.test(window.location.href)) this.scraper.init();
		else {
			// assistive functions on mturk pages

			if($("#sortresults_form").length) $("#sortresults_form").after(
				olympus.athena.create_filter_bar()
			);

			// remove the stupid profile tasks box (since the x in the corner doesn't
			// make it go away)
			$("div.info-message-container").first().remove();

			// check for the auto approval time.  if this form element exists, then we are looking
			// at/have accepted a HIT.  we can display the aa time on the capsule and must also
			// standardize the table layout for other code to work on it
			var $aa = $("input[name='hitAutoAppDelayInSeconds']").first();

			if($aa.length) {
				var $title_container = $("td.capsulelink_bold"),
					$requester_container = $("a[id^='requester.tooltip']").parent().next(),
					hit_name = $title_container.text().collapseWhitespace(),
					requester_name = $requester_container.text().collapseWhitespace(),
					requester_id = ($("input[name='requesterId']").first().val() || olympus.utilities.href_requester_id($("a[href*='requesterId=']").first().text())),
					reward = +$("span.reward",$("a[id^='reward.tooltip']").parent().next()).text().slice(1),
					hits = +$("a[id^='number_of_hits.tooltip']").parent().next().text().collapseWhitespace(),
					group_val = (reward*hits).toFixed(2),
					$work_frame = $("iframe, #hit-wrapper").first(),
					batch_mode = (olympus.settings.get(olympus.athena,"batch_mode") === true);

				// standardize the display of this capsule with those that appear when viewing HITs
				$title_container.empty().append(
					$("<a/>")
						.attr("class","capsulelink")
						.text(hit_name)
				);
				$requester_container.empty().append(
					$("<span/>")
						.attr("class","requesterIdentity")
						.text(requester_name)
				);
				if($.type(requester_id) === "string") $requester_container.children("span.requesterIdentity").wrap(
					$("<a/>")
						.attr("href",("https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&requesterId="+requester_id))
				);

				// add the AA time and group value to the capsule
				$("a[id*='qualifications.tooltip'], a[id*='qualificationsRequired.tooltip']").first().closest("table").parent()
					.attr("colspan","6")
					.after(
						$("<td/>")
							.attr({
								"align":"right",
								"valign":"top",
								"class":"capsule_field_title",
								"nowrap":""
							})
							.text("Group value:\xa0\xa0"),
						$("<td/>")
							.attr({
								"align":"left",
								"valign":"top",
								"class":"capsule_field_text",
								"nowrap":""
							})
							.text("$"+group_val),
						$("<td/>").append(
							$("<img/>")
								.attr("src","/media/spacer.gif")
								.css({
									"width":"25px",
									"height":"1px",
									"border":"0px"
							})
						),
						$("<td/>")
							.attr({
								"align":"right",
								"valign":"top",
								"class":"capsule_field_title",
								"nowrap":""
							})
							.text("AA:\xa0\xa0"),
						$("<td/>")
							.attr({
								"align":"left",
								"valign":"top",
								"class":"capsule_field_text",
								"nowrap":""
							})
							.text(olympus.utilities.dhms($aa.val()))
				);

				if(olympus.hermes) olympus.hermes.add_buttons();

				$work_frame
					.css("height",olympus.settings.get(olympus.athena,"frame_height"))
					.before(
						$("<span/>")
							.attr("title","Batch mode keeps auto-accept checked and jumps to the top of the work area when the page loads, but only when you're working on a HIT and not simply previewing it.")
							.append(
								$("<input/>")
									.attr({
										"id":"skip_to_frame",
										"type":"checkbox"
									})
									.prop("checked",batch_mode)
									.click(function() {
										olympus.settings.update(olympus.athena,"batch_mode",$(this).prop("checked"));
									}),
								document.createTextNode(" Batch mode")
						),
						$("<span/>")
							.css("margin-left","20px")
							.append(
								document.createTextNode("Work area height: "),
								$("<input/>")
									.attr({
										"id":"frame_height",
										"type":"number"
									})
									.val(olympus.settings.get(olympus.athena,"frame_height"))
									.on("blur onblur",function() {
										olympus.settings.update(olympus.athena,"frame_height",$(this).val());
										$("iframe, #hit-wrapper").first().css("height",$(this).val());
									})
							)
					);
				if($("form[name='hitForm']").first().attr("action") === "/mturk/accept") {
					$work_frame
						.wrap(
							$("<div/>").css("position","relative")
						)
						.css("margin","0px")
						.before(
							$("<div/>")
								.attr("id","hit_not_accepted")
								.append(
									$("<div/>").html(
										"<h1>You have not accepted this HIT.</h1>"+
										"This box is here to make sure that you don't accidentally complete a HIT without having accepted it first. "+
										"This happens more often than you may think when you're in the middle of a batch or if you're booking through "+
										"surveys and don't notice.<br><br>"+
										"If the appearance of this box seems unexpected, then you may have been logged out of Turk or run afoul "+
										"of a CAPTCHA.<br><br>"+
										"Click this red box to interact with the HIT beneath."
									)
								)
								.click(function() {
									$(this).triggerHandler("disappear");
								})
								.on("disappear",function() {
									$(this)
										.css({
											"background-color":"#f00",
											"pointer-events":"none",
											"opacity":"0.3"
										})
										.html("");
								})
						);
					if(!olympus.settings.get(olympus.athena,"not_accepted_clickthrough")) $("#hit_not_accepted").triggerHandler("disappear");

					var $captcha_input = $("input[name='userCaptchaResponse']");
					if($captcha_input.length) $captcha_input.focus();
				}
				else if(batch_mode) {
					// i have to register a window.load event to do these because amazon's scripts are doing so much junk beforehand
					$(window).load(function() {
						var $frame = $("iframe, #hit-wrapper").first();
						$("input[type='checkbox'][name='autoAcceptEnabled']").prop("checked",true);
						$(window).scrollTop($frame.offset().top);
						$frame.focus();
					});
				}
			}

			// tag critical elements with class names for later, and insert interface elements while we're at it
			if($("a.capsulelink").length) {
				$("a.capsulelink")
					.before(
						olympus.athena.list_management_element("highlighted","hit")
							.addClass("fa-lg")
							.on("anchor",function() {
								return $(this).siblings(".capsulelink").first();
							}),
						olympus.athena.list_management_element("blocked","hit")
							.addClass("fa-lg")
							.on("anchor",function() {
								return $(this).siblings(".capsulelink").first();
							})
					)
					.closest("table").parent().addClass("athena_hit_title")
					.closest("table")
						.addClass("athena_hit_table")
						.find("span.requesterIdentity").closest("td").prepend(
							olympus.athena.list_management_element("highlighted","requester")
								.addClass("fa-lg")
								.on("anchor",function() {
									return $(this).siblings("a[href*='requesterId=']").first();
								}),
							olympus.athena.list_management_element("blocked","requester")
								.addClass("fa-lg")
								.on("anchor",function() {
									return $(this).siblings("a[href*='requesterId=']").first();
								})
						)
					.end().end().closest("tr").addClass("athena_contains_hit")
					.closest("table").addClass("athena_hit_list");
			}

			$("span.requesterIdentity").not("a > span.requesterIdentity").each(function() {
				var requester_id = olympus.utilities.href_requester_id($("a[href*='requesterId=']",$(this).closest(".athena_hit_table")).first().attr("href"));
				if($.type(requester_id) === "string") $(this).wrap(
					$("<a/>")
						.attr("href",("https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&requesterId="+requester_id))
				);
			});

			olympus.athena.__blocked.update();
			olympus.athena.__highlighted.update();
			olympus.athena.qualification_feasibility();

			// amazon's internal script collapses all of the details at some point between document.ready
			// and window.load, so i have to wait until after the latter to expand capsule details
			// so that they don't get immediately collapsed again
			$(window).load(function() {
				olympus.athena.expand_hit_details();
			});

			var unique_rids = [];
			$(".athena_hit_table").each(function() {
				var rid = olympus.utilities.href_requester_id($("a[href*='requesterId=']",this).first().attr("href"));
				if($.type(rid) === "string" && !unique_rids.contains(rid)) unique_rids.push(rid);
				if(!window.location.href.contains("/mturk/myhits")) {
					var $actions = $("span.capsulelink",this),
						group_id = olympus.utilities.href_group_id($("a[href*='roupId=']",$actions).first().attr("href")), // not a typo
						can_preview = !($actions.text().contains("Not Qualified to work on this HIT")),
						$contact_space = $("td",$("div.capsuletarget",this)).last();

					$actions.empty().append(
						$('<a/>')
							.text("View a HIT in this group")
							.attr({
								"target":"_blank",
								"href":("/mturk/preview?groupId="+group_id),
								"title":(can_preview ? "Preview this HIT without accepting it" : "The requester does not allow unqualified workers to preview this HIT")
							})
							.css("text-decoration",(can_preview ? "underline" : "line-through")),
							document.createTextNode(" | "),
						$('<a/>')
							.text("Accept")
							.attr({
								"target":"_blank",
								"href":("/mturk/previewandaccept?groupId="+group_id),
								"title":(can_preview ? "Accept this HIT and begin working on it" : "You are not qualified to work on this HIT")
							})
							.css("text-decoration",(can_preview ? "underline" : "line-through"))
//						document.createTextNode(" | "),
//						$('<a/>')
//							.text("Hoard")
//							.click(function() {console.log("Hoard link doesn't do anything yet");})
//							.css("text-decoration",(can_preview ? "underline" : "line-through"))
					);

					if(!$contact_space.children().length) $contact_space.empty().append(
						$("<a/>")
							.attr("href",(
								"/mturk/contact?requesterId="+rid+
								"&hitDescription="+encodeURIComponent($("a[id^='description.tooltip']",this).parent().next().text().collapseWhitespace())+
								"&requesterName="+encodeURIComponent($("span.requesterIdentity",this).text().collapseWhitespace())+
								"&subject=Regarding+Amazon+Mechanical+Turk+HIT+Type+"+group_id+
								"&hitTitle="+$("a.capsulelink",this).text().collapseWhitespace()
							))
							.text("Contact the Requester of this HIT")
					);
				}
			});
			if(unique_rids.length) olympus.utilities.turkopticon(unique_rids,this._async_color_code,this);
		}
	},
	_async_color_code:function(info) {
		var counts = {
			great:0,
			good:0,
			fair:0,
			poor:0,
			awful:0,
			no:0
		};

		if($.type(info) === "object") {
			$(".athena_hit_table").each(function() {
				var rid = olympus.utilities.href_requester_id($("a[href*='requesterId=']",this).first().attr("href")),
					has_to = ($.type(info[rid]) === "object" && info[rid].hasOwnProperty("attrs")),
					average = (has_to ? olympus.utilities.to_average(info[rid]) : 0),
					rating = (has_to ? olympus.athena.to_avg_to_text(Math.round(average)) : "no");
				counts[rating]++;
				$(".athena_hit_title",this)
					.addClass(rating+"_to_rating")
					.find("tr").first().after(
						$("<tr/>").append(
							$("<td/>")
								.attr("colspan","3")
								.append(
									$("<a/>")
										.attr({
											"href":("https://turkopticon.ucsd.edu/"+rid),
											"target":"_blank"
										})
										.append(
											document.createTextNode(has_to ? (info[rid].reviews+" review"+olympus.utilities.plural(info[rid].reviews)+", "+average.toFixed(2)+" avg ["+info[rid].attrs.pay+" pay | "+info[rid].attrs.fair+" fair | "+info[rid].attrs.fast+" fast | "+info[rid].attrs.comm+" comm] ") : "No Turkopticon data"),
											$("<b/>")
												.css("font-weight","bold")
												.text((has_to && info[rid].tos_flags*1) > 0 ? (info[rid].tos_flags+" TOS") : "")
										)
								)
						)
					)
					.closest(".athena_contains_hit").attr("data-to",rating);
				$("span.reward",this).addClass((has_to ? olympus.athena.to_avg_to_text(Math.round(info[rid].attrs.pay*1)) : "no")+"_to_rating");
			});
		}
		else console.log("Athena: retrieved TO info is malformed");

		$.each(counts,function(key,val) {
			$("#athena_filter label.toggle_element[data-type='"+key+"_to']").triggerHandler("setCount",val);
		});

		this.filter_hits();
	},
	__qual2int:function(q) {
		q = q.toLowerCase();
		if(q === "impossible") return 5;
		else if(q === "unqualified") return 4;
		else if(q === "requestable") return 3;
		else if(q === "testable") return 2;
		else if(q === "qualified") return 1;
		else return 0;
	},
	create_filter_bar:function() {
		function toggle_element(desc) {
			var $label = $("<label/>")
				.attr({
					"class":"toggle_element",
					"data-type":desc,
					"data-name":(desc.slice(-3) === "_to" ? (desc.slice(0,desc.indexOf("_"))+" TO") : desc),
					"data-count":"0"
				})
				.on("setCount",function(evt,count) {
					$(this).attr({
						"data-count":count,
						"title":(count+" "+$(this).attr("data-name"))
					});
				})
				.on("updateCount",function(event,c) {
					var count = (($(this).attr("data-count")*1)+c);
					$(this).attr({
						"data-count":count,
						"title":(count+" "+$(this).attr("data-name"))
					});
				});
			switch(desc) {
				case "blocked": case "highlighted": case "qualified": case "testable": case "requestable": case "unqualified": case "impossible": {
					$label
						.attr("title",desc.ucFirst())
						.append(
							$("<span/>")
								.attr({
									"class":("fa fa-2x fa-fw "+olympus.athena.desc2fa(desc)+" "+(olympus.athena.setting_state(desc) ? "enabled" : "disabled")),
									"data-filter":desc
								})
								.click(function() {
									$(this).toggleClass("enabled disabled");
									olympus.settings.update(olympus.athena,olympus.athena.setting_name($(this).attr("data-filter")),$(this).hasClass("enabled"));
									olympus.athena.filter_hits();
								})
						);
					break;
				}
				case "great_to": case "good_to": case "fair_to": case "poor_to": case "awful_to": case "no_to": {
					$label
						.addClass(desc+"_rating")
						.attr("title",(desc.slice(0,desc.indexOf("_")).ucFirst()+" TO rating"))
						.append(
							$("<input/>")
								.attr({
									"type":"checkbox",
									"data-filter":desc
								})
								.prop("checked",olympus.athena.setting_state(desc))
								.click(function() {
									olympus.settings.update(olympus.athena,olympus.athena.setting_name(desc),$(this).prop("checked"));
									olympus.athena.filter_hits();
								})
						);
					break;
				}
			}
			$label.triggerHandler("setCount",0);
			return $label;
		}

		return $("<div/>")
			.attr("id","athena_filter")
			.append(
				$("<div/>")
					.attr("class","watchlists")
					.append(
						toggle_element("blocked"),
						toggle_element("highlighted")
					),
				$("<div/>")
					.attr("class","qualifications")
					.append(
						toggle_element("qualified"),
						toggle_element("testable"),
						toggle_element("requestable"),
						toggle_element("unqualified"),
						toggle_element("impossible")
					),
				$("<div/>")
					.attr("class","to_ratings")
					.append(
						toggle_element("great_to"),
						toggle_element("good_to"),
						toggle_element("fair_to"),
						toggle_element("poor_to"),
						toggle_element("awful_to"),
						toggle_element("no_to")
					),
				$("<span/>")
					.attr({
						"class":"fa fa-2x fa-fw fa-question-circle-o",
						"title":"Filtering help"
					})
					.click(function() {
						olympus.help.display("athena_filter_options");
					})
			);
	},
	desc2fa:function(d) {
		// this simply became more convenient as i developed the script because
		// it is loads easier to change the fa- class once here than try to
		// search out every instance or find/replace
		switch(d) {
			case "blocked": return "fa-ban";
			case "highlighted": return "fa-star";
			case "qualified": return "fa-check";
			case "testable": return "fa-pencil";
			case "requestable": return "fa-lock";
			case "unqualified": return "fa-times";
			case "impossible": return "fa-warning";
		}
	},
	expand_hit_details:function() {
		var minimum = olympus.settings.get(olympus.athena,"detail_expand"),
			$all_hits = $(".athena_hit_table"),
			$expand;
		if(minimum !== "none") {
			var feasibilities = ["qualified","testable","requestable","unqualified"],
				idx = feasibilities.indexOf(minimum),
				classes = [];
			for(var i=0;i<=idx;i++) classes.push("."+feasibilities[i]);
			$expand = $(".athena_hit_table"+classes.join(", .athena_hit_table"));
		}
		$(".capsuletarget",$expand).show();
		$(".capsuletarget",$all_hits.not($expand)).hide();
	},
	feasibility2desc:function(desc) {
		switch(desc) {
			case "qualified": return "HITs you can accept and work on right now.  You either meet/have all of the qualifications or the HIT has none.";
			case "testable": return "HITs that you are not qualified for, but the missing qualifications can all be gained from "+
				"qualification tests.  Qualifications that are granted from tests are almost always automatically "+
				"and immediately scored so that you have the opportunity to quickly and autonomously discover "+
				"whether or not you can become qualified.";
			case "requestable": return "HITs that you are not qualified for, and at least one qualification must be requested. While a "+
				"requestable qualification sounds like a non-issue on the surface, the reality is that 99% of "+
				"qualification requests are completely ignored and you are wasting your time.  They are rarely "+
				"granted upon request, which is the only reason these are not rolled into the impossible qualification tier.";
			case "unqualified": return "You possess the requisite qualifications, but their values are not sufficient to work on this HIT. "+
				"These are most commonly \"quality control\" quals where it is assigned some value based on your "+
				"overall performance. These are separated because you cannot work on the HIT you're looking at without "+
				"completing some other HIT to change/raise your qualification score.";
			case "impossible": return "HITs that you can never be qualified for. This includes Masters status (if you don't have it), location "+
				"quals that you do not meet, TurkPrime exclusionary quals that you have, TurkPrime inclusionary quals that "+
				"you do not have, and many other circumstances that you can never change.";
		}
	},
	__filter_eval:function($hit) {
		if(!($hit instanceof jQuery)) $hit = $($hit);
		// filtering
		if($hit.hasClass("blocked") && $("#athena_filter .watchlists ."+olympus.athena.desc2fa("blocked")).hasClass("enabled")) $hit.addClass("filtered_out");
		else if(!$("#athena_filter .qualifications span.fa[data-filter='"+$hit.attr("data-feasibility")+"']").hasClass("enabled")) $hit.addClass("filtered_out");
		else if(!$("#athena_filter .to_ratings input[type='checkbox'][data-filter='"+$hit.attr("data-to")+"_to']").prop("checked")) $hit.addClass("filtered_out");
		else $hit.removeClass("filtered_out");
		// highlight
		if($hit.hasClass("highlighted") && $("#athena_filter .watchlists ."+olympus.athena.desc2fa("highlighted")).hasClass("enabled")) $hit.addClass("enabled");
	},
	filter_hits:function() {
		$(".athena_contains_hit").each(function() {
			olympus.athena.__filter_eval(this);
		});
	},
	list_management_element:function(type,role) {
		return $("<span/>")
			.attr({
				"class":("fa fa-fw athena_"+type+"_button fa-"+(type === "blocked" ? "times" : "asterisk")+" disabled"),
				"data-type":type,
				"data-role":role,
				"title":(type.slice(0,-2).ucFirst()+" "+role)
			})
			.click(function() {
				$(this).triggerHandler("manage_list",$(this).triggerHandler("context"));
				olympus.athena.__filter_eval($(this).closest(".athena_contains_hit"));
			})
			.on("context",function() {
				var $anchor = $(this).triggerHandler("anchor"),
					data = {desc:$anchor.text().collapseWhitespace().toLowerCase()};
				data[$(this).attr("data-role")+"_id"] = olympus.utilities.href_id($anchor.attr("href"));
				return data;
			})
			.on("manage_list",function(evt,data) {
				if($(this).hasClass("enabled")) {
					olympus.athena["__"+$(this).attr("data-type")].remove(data.desc);
					$(this).triggerHandler("toggle","disable");
				}
				else {
					olympus.athena["__"+$(this).attr("data-type")].add(data.desc);
					$(this).triggerHandler("toggle","enable");
				}
			})
			.on("toggle",function(event,status) {
				var cnd_b = ($(this).attr("data-type") === "blocked"),
					cnd_e = (status === "enable"),
					$cnt = $(this).closest(".athena_contains_hit");
				$(this)
					.removeClass(cnd_e ? "disabled" : "enabled")
					.addClass(status+"d")
					.attr("title",((cnd_e ? "un" : "")+(cnd_b ? "block" : "highlight")).ucFirst()+" "+$(this).attr("data-role"));
				if($(".athena_"+$(this).attr("data-type")+"_button.enabled",$cnt).length) $cnt.addClass($(this).attr("data-type"));
				else $cnt.removeClass($(this).attr("data-type"));
				$("#athena_filter .watchlists .toggle_element[data-type='"+$(this).attr("data-type")+"']").triggerHandler("updateCount",(cnd_e ? 1 : -1));
			});
	},
	__parse_quals:function(hit) {
		var feasibility = "",
			qual_table = $("a[id^='qualificationsRequired.tooltip']",hit).closest("table");

		function impossible(qual) {
			var LT = "lt",
				GT = "gt",
				EQ = "eq";

			function comparator() {
				var d = qual.contains("not"),
					e = +qual.match(/(\d{1,3})$/i)[1];

				if(qual.contains("greater than")) {
					if(d) return [LT,e+1];
					else return [GT,e];
				}
				else if(qual.contains("less than")) {
					if(d) return [GT,e-1];
					else return [LT,e];
				}
				else if(qual.contains("is")) return[EQ,e];
			}

			if(/exc: \[[\d-]+\]/i.test(qual)) return true;
			if(/inc: \[[\d-]+\]/i.test(qual)) return true;
			if(/masters has been granted$/i.test(qual)) return true;
			if(/^ibotta/i.test(qual)) return true;
			if(/^location is/i.test(qual)) return true;
			if(/^hit approval rate/i.test(qual)) {
				var o = comparator();
				if(o[0] === GT && o[1] === 100) return true;
				if(o[0] === LT || o[0] === EQ) return true;
			}
			if(/^total approved hits/i.test(qual)) {
				var p = comparator();
				if(p[0] === LT || p[0] === EQ) return true;
			}
			return false;
		}

		function precedence(tier) {
			if(olympus.athena.__qual2int(tier) > olympus.athena.__qual2int(feasibility)) feasibility = tier;
		}

		if($("td:nth-child(2)",qual_table).text().collapseWhitespace() === "None") feasibility = "qualified";
		else $("tr:not(:first-of-type) td:nth-child(3)",qual_table).each(function() {
			var qual_tier = "",
				qual_desc = $(this).prev().prev().text().collapseWhitespace(),
				qual_tooltip = $(this).text().collapseWhitespace(),
				meet_qual = $(this).text().contains("You meet this qualification");

			if(!meet_qual) {
				if(impossible(qual_desc)) qual_tier = "impossible";
				else if(qual_tooltip.contains("Request Qualification")) qual_tier = "requestable";
				else if(qual_tooltip.contains("Qualification test")) qual_tier = "testable";
				else qual_tier = "unqualified";
			}
			else qual_tier = "qualified";

			precedence(qual_tier);

			$(this).attr({
				"data-feasibility":qual_tier,
				"data-title":qual_tooltip
			});
		});

		return feasibility;
	},
	qualification_feasibility:function() {
		function lnk(s) {
			return (s === "requestable" || s === "testable");
		}

		var counts = {
			qualified:0,
			testable:0,
			requestable:0,
			unqualified:0,
			impossible:0
		};

		$(".athena_hit_table").each(function() {
			var feasibility = olympus.athena.__parse_quals(this);
			counts[feasibility]++;

			$(this)
				.closest(".athena_contains_hit")
					.addClass(feasibility)
					.attr("data-feasibility",feasibility)
			.end().find("a.capsulelink").first().closest("tr").prepend(
				$("<td/>")
					.attr("rowspan","2")
					.append(
						$("<span/>")
							.attr({
								"class":("fa fa-fw fa-2x "+olympus.athena.desc2fa(feasibility)+" capsule_icon"),
								"title":(feasibility.ucFirst()+"\n"+olympus.athena.feasibility2desc(feasibility))
							})
					)
			);
		});

		$(".athena_hit_table td[data-feasibility]").each(function() {
			var qual_tier = $(this).attr("data-feasibility"),
				$elem = $(lnk(qual_tier) ? "<a/>" : "<span/>").attr("class",olympus.athena.desc2fa(qual_tier));
			if(lnk(qual_tier)) $elem.attr({"href":$(this).children("a").first().attr("href"),"target":"_blank"});
			$(this).empty().append(
				$elem
					.addClass("qual_icon fa fa-fw fa-lg")
					.attr("title",(qual_tier === "impossible" ? "This qualification is impossible" : $(this).attr("data-title")))
			);
		});

		$.each(counts,function(key,val) {
			$("#athena_filter label.toggle_element[data-type='"+key+"']").triggerHandler("setCount",val);
		});
	},
	setting_name:function(desc) {
		return (($("body").hasClass("athena_interface") ? "interface" : "assist")+"_"+desc+"_filter");
	},
	setting_state:function(desc) {
		return olympus.settings.get(this,this.setting_name(desc));
	},
	to_avg_to_text:function(s) {
		s = Math.round(s*1);
		switch(s) {
			case 5: return "great";
			case 4: return "good";
			case 3: return "fair";
			case 2: return "poor";
			case 1: return "awful";
			case 0: return "no";
		}
	}
};

function control_list(arg) {
	this._init(arg);
}

// control_list is the object that handles the blocked and highlighted lists
control_list.prototype = {
	list:null,
	plaintext:null,
	regex:null,
	get len() {
		return (($.type(this.plaintext) === "array" && this.plaintext.length) || ($.type(this.regex) === "array" && this.regex.length));
	},
	get ls_key() {
		return ("scraper_"+(this.list === "blocked" ? "ignore" : "include")+"_list");
	},
	__add:function(v) { // need a way to circumvent firing a storage event when simply populating the list
		v = v.compactAndLowerCase();
		this.__add2pt(v);
		if(v.contains("*")) this.__add2rg(v);
	},
	__add2pt:function(e) {
		if($.type(this.plaintext) !== "array") this.plaintext = [];
		if(!this.plaintext.contains(e)) this.plaintext.push(e);
	},
	__add2rg:function(e) {
		if($.type(this.regex) !== "array") this.regex = [];
		this.regex.push(new RegExp(e.replace(/[-[\]{}()+?.,\\^$|#\s]/g,"\\$&").replace(/\*+/g,".+"),"gi"));
	},
	__remove:function(v) {
		v = v.compactAndLowerCase();
		var idx = this.plaintext.indexOf(v);
		if(idx > -1) {
			this.plaintext.splice(idx,1);
			return true;
		}
	},
	_init:function(n) {
		this.list = n;
		this.refresh();
	},
	add:function(v) {
		this.__add(v);
		this.store();
		//this.update();
	},
	empty:function() {
		this.plaintext = null;
		this.regex = null;
	},
	eval_hit:function($hit) {
		// because of fringe situations like deleting the whole blocklist, these have to be checked
		// whether or not there's anything to check them against because of the interface elements
		// that denote when something is highlighted or blocked
		var $hit_elem = $(("span[data-type='"+this.list+"'][data-role='hit']"),$hit),
			$req_elem = $(("span[data-type='"+this.list+"'][data-role='requester']"),$hit),
			listed_title = this.match($hit_elem.triggerHandler("context").desc),
			listed_requester = this.match($req_elem.triggerHandler("context").desc),
			listed_hit = (listed_requester || listed_title);
		if(listed_hit) {
			$($hit).addClass(this.list);
			if(listed_title) $hit_elem.triggerHandler("toggle","enable");
			if(listed_requester) $req_elem.triggerHandler("toggle","enable");
		}
		return listed_hit;
	},
	match:function() {
		if(this.len) {
			var parr = ($.type(this.plaintext) === "array"),
				rarr = ($.type(this.regex) === "array");
			for(var i=0;i<arguments.length;i++) if((parr && this.plaintext.contains(arguments[i])) || (rarr && this.regex.regex_match(arguments[i]))) return true;
		}
		return false;
	},
	refresh:function(val) {
		var array = (val || localStorage[this.ls_key]),
			ref = this;
		this.empty();
		if($.type(array) === "string" && array.length) {
			array.split("^").filter(function(val) {
				ref.__add(val);
				return false;
			});
		}
		ref = null;
	},
	remove:function(v) {
		if(this.__remove(v) === true) {
			this.store();
			//this.update();
		}
	},
	store:function() {
		if($.type(this.plaintext) === "array" && this.plaintext.length) localStorage[this.ls_key] = this.plaintext.join("^");
		else localStorage.deleteItem(this.ls_key);
	},
	update:function() {
		var count = 0,
			ref = this;
		$(".athena_contains_hit").each(function() {
			if(ref.eval_hit(this)) count++;
		});
		$("#athena_filter label.toggle_element[data-type='"+this.list+"']").triggerHandler("setCount",count);
		ref = null;
	}
//	update:function() {
//		var count = 0,
//			ref = this;
//		$($("body").hasClass("athena_interface") ? "#athena_results tbody tr" : ".athena_hit_table").each(function() {
//			count += (ref.eval_hit(this) ? 1 : 0);
//		});
//		ref = null;
//		$("#athena_filter label.toggle_element[data-type='"+this.list+"']").triggerHandler("updateCount",count);
//	}
};