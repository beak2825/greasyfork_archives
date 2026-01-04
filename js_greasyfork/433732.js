// ==UserScript==
// @name         MSJ - Moderation Helper
// @namespace    https://www.macserialjunkie.com
// @version      1.2.2
// @description  Set of tools to ease moderation
// @author       anonymacuser
// @match        https://*.macserialjunkie.com/forum/viewtopic.php*
// @match        https://*.macserialjunkie.com/forum/posting.php*
// @match        https://*.macserialjunkie.com/forum/mcp.php*
// @grant        GM.xmlHttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM_xmlHttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @icon         https://i.ibb.co/SKM44zJ/modhelper.png
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/433732/MSJ%20-%20Moderation%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/433732/MSJ%20-%20Moderation%20Helper.meta.js
// ==/UserScript==

//Global vars
var edit_reason_tick, edit_reason_remove_dead_link, edit_reason_remove_banned_filehost, edit_reason_remove_stw_quote, edit_reason_stw_to_req, edit_reason_req_to_stw, edit_reason_add_req, edit_reason_version_number_updated, edit_reason_separator, link_snip_text, link_snip_bbcode, approved_filehosts, request_pending, is_first_page;

var is_posting_page = window.location.href.includes("posting.php") ? true : false,
	is_viewtopic_page = window.location.href.includes("viewtopic.php") ? true : false,
	is_mcp_page = window.location.href.includes("mcp.php") ? true : false,
  msj_current_domain = window.location.hostname;


//Global functions
function viewtopic_helper_setup() {

	request_pending = false;

	var active_page = document.querySelector("div.pagination li.active");
	is_first_page = active_page ? active_page.innerText == "1" ? true : false : true;

	//Adding script CSS rules
	var viewtopic_helper_styles = document.createElement("style");
	viewtopic_helper_styles.innerHTML =

	//Button
	"a.valid_post_button {width:35px; height:35px; line-height:40px; border:none; cursor:not-allowed; opacity:0.3; transition: opacity 0.2s; position:relative;} " +
	"a.valid_post_button:hover {background-color:#415150;}" +
	"a.valid_post_button i {font-size:20px !important;}" +
	"a.valid_post_button i::after {content:' '; display:block; border-radius:50%; width:0; height:0; margin:5px 0 2px 0; box-sizing:border-box; border:12px solid #fff; border-color:#fff transparent #fff transparent; transform:rotate(0deg); transition:transform 0.2s;}" +

	//Ticking button
	"a.valid_post_button.enabled i::before {content:'✓'; font-weight:bold;}" +
	"a.valid_post_button.enabled i::after {border:none; transform:rotate(180deg);}" +
	"a.valid_post_button.enabled {background-color:#00b235; cursor:pointer; opacity:1;}" +
	"a.valid_post_button.enabled:hover {background-color:#d80942;}" +
	"a.valid_post_button.enabled:hover .tooltip {display: inline-block;}" +

	//Loading button
	"a.valid_post_button.loading {line-height:35px;}" +
	"a.valid_post_button.loading i::before {content:'';}" +
	"a.valid_post_button.loading i::after {animation:hourglass 1.6s infinite;}" +

  //First Post of First Page insertion
  "div.first_post_first_page {display:none; margin:0 20px 4px 20px; opacity:0.7; height:300px; overflow:scroll;}" +
  "div.first_post_first_page:hover {opacity:0.9;}" +

	//Tooltip
	"a.valid_post_button .tooltip {display:none; position:absolute; z-index:100; top:42px; background-color:#415150; color:white; right:0; font-size:0.9em; font-weight:normal; padding:7px 12px; line-height:normal;}" +
	"a.valid_post_button .tooltip.human_check {box-shadow:inset 0px 0px 0px 2px #415150; background-color:#e5e5e5; color:black;}" +
	"a.valid_post_button .tooltip.human_check::before {color:white; content:'✎'; background-color:#415150; font-size:1.4em; line-height:0.9em; position:absolute; top:0px; bottom:0px; left:-32px; display:block; padding:7px 10px;}" +

	//Fancy animation (credits goes to loading.io, slightly adapted)
	"@keyframes hourglass {0% {transform: rotate(0); animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);} 50% {transform: rotate(300deg); animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);} 100% {transform: rotate(720deg);}}" +

	//Report
	"p.post-notice.reported {background-color:#F4E742; border:1px solid #d1c421; margin:20px 0;}" +
	"p.post-notice.reported > a {color:black;}" +
	"p.post-notice.reported > a i.fa-exclamation::before {color:black;}" +
	"p.post-notice.reported > a.disabled {text-decoration:none; cursor:default !important;}" +
	"p.reported div#report {border:1px solid #d1c421; margin-top:10px;}" +
	"p.reported div#report div.content {font-size:1.1em;}" +

	//Editable Title
	"h3.first.editable::before {content:'✎'; margin-right:5px;}" +
	"h3.first.editable a {display:inline;}" +
	"h3.first.editable a:hover, h3.first.editable a:active, h3.first.editable a:focus {text-decoration:none;}" +
	"h3.first.editable a:focus-visible {outline:none;}" +

	//Snipe
	"a.snipping_button {margin-left:5px; text-decoration:none; display:none;}" +
	"pre.snipable_code {position:relative; overflow:auto;}" +
	"pre.snipable_code code {overflow:visible;}" +
	"a.striked, a.striked:visited, s.striked {color:white; background-color:red; text-decoration:line-through; border-color:transparent;}" +
	"pre a.snipping_button, pre a.openlink_button {position:absolute; right:15px; top:5px; font: 0.9em Monaco;}" +
	"pre a.openlink_button {right:35px;}" +
	"pre a.openlink_button::after {content:'' !important;}" +
	"pre a.openlink_button:hover, pre a.openlink_button:active, pre a.openlink_button:visited {text-decoration:none;}" +
	"div.moderated_post a.snipping_button {display:inline-block;}" +

	//Selected Posts view
	"div#qr_posts.selected_posts div.post-container {display:none;}" +
	"div#qr_posts > a.display_all_posts {width:100%; background-color:#C30932; color:white; padding:12px 0; text-align:center; display:inline-block; margin-bottom:3px; font-size:1.2em; font-weight:bold;}" +

	//CSS Fixes for actual theme
	"#qr_posts div.post-container div.postbody > div > h3 {display:none;}" + //fix for title displaying
	"#qr_posts div.post-container:first-child div.postbody > div > h3 {display:inline-block;}" +
	".button.qr-quickquote .icon {color:white;}"; //fix a CSS selector fail on Quick Quote icon

	//Insert CSS rules in HTML before #top (reference)
	var ref = document.getElementById("top");
	ref.parentNode.insertBefore(viewtopic_helper_styles, ref);

	//Iterate over every posts of the page
	var posts = document.querySelectorAll("div[id^=post_content]");
	posts.forEach(function(post, index) {
		post.is_first_post = index === 0 ? true : false;
		setup_helper_tools(post);
	});

	//Handle ajax loading pages
	var pagination = document.querySelectorAll("div.pagination a");
	if (pagination) {
		pagination.forEach(function(link) {
			link.onclick = function() {
				var max_loop_safety = 80; //80 * 250 ms = 20 seconds max
				function wait_for_loading() {
					max_loop_safety--;
					if (document.querySelector("#qr_loading_text").getAttribute("style") === "display: none;") {
						viewtopic_helper_setup();
					} else if (max_loop_safety >= 0) {setTimeout(wait_for_loading, 250);}
				}
				wait_for_loading();
			}
		});
	}

	//Edit title from any page
	if (!is_first_page) {

			(async function() {
				var first_page_url = document.querySelector("div.pagination a.button:not(.button-icon-only)").href;
				const response = await make_http_request(undefined, first_page_url);
				if(response.status == 200){
					//console.log(response.responseText);
					var content = new DOMParser().parseFromString(response.responseText, "text/html");
          var first_post_html = content.querySelector("div.post");
          first_post_html.classList.add("first_post_first_page");
					var first_post = content.querySelector("div[id^=post_content]");
					first_post.is_first_post = true;
          first_post.is_first_page = true;
					//setup_helper_tools()
					//console.log(first_post)
					var ref = document.querySelector("div.action-bar").nextElementSibling;
					ref.parentNode.insertBefore(first_post_html, ref);
					//ref.appendChild(first_post)
          setup_helper_tools(first_post);
          var load_first_post = Object.assign(document.createElement("a"), {href:"#", innerText:"Show first post", className:"button"});
		      load_first_post.onclick = function() {
            first_post_html.style.display = "block";
            return false;
		      }
          document.querySelector("div.action-bar").appendChild(load_first_post);
				} else {
					console.log("error");
					console.log(response.responseText);
					//post.check_for_changes();
				}
			})();


   // load_first_post.click();
	}



	//Run exit page handler
	confirm_exit_handler();

}

function mcp_helper_setup() {

	//Adding script CSS rules
	var mcp_helper_styles = document.createElement("style");
	mcp_helper_styles.innerHTML =

	//Auto update button
	"fieldset.auto_update::after {content:none; display:inline-block; border-radius:50%; width:0; height:0; margin:0 0 2px 5px; box-sizing:border-box; border:8px solid #fff; border-color:#415150 transparent #415150 transparent; transform:rotate(0deg); transition:transform 0.2s; position:relative; top:7px;}" +
	"fieldset.auto_update.loading::after {content:' '; animation:hourglass 1.6s infinite;}" +
	"fieldset.auto_update.auto_update input:focus {border:none;}" +

	//Fancy animation (credits goes to loading.io, slightly adapted)
	"@keyframes hourglass {0% {transform: rotate(0); animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);} 50% {transform: rotate(300deg); animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);} 100% {transform: rotate(720deg);}}";

	//Insert CSS rules in HTML before #top (reference)
	var ref = document.getElementById("top");
	ref.parentNode.insertBefore(mcp_helper_styles, ref);

	//Control Panel Menu
	function create_control_panel_menu() {

		var control_panel_menu = Object.assign(document.createElement("div"), {id:"cp-menu", className:"cp-menu"}),
			navigation = Object.assign(document.createElement("div"), {id:"navigation", className:"navigation responsive-hide"}),
			ul = document.createElement("ul"),
			li_active = Object.assign(document.createElement("li"), {id:"active-subsection", className:"active-subsection"}),
			li = document.createElement("li"),
			a = Object.assign(document.createElement("a"), {href:"#"}),
			a2 = Object.assign(document.createElement("a"), {href:"#"}),
			span = Object.assign(document.createElement("span"), {innerText:"Edit reasons"}),
			span2 = Object.assign(document.createElement("span"), {innerText:"Filehosts"});

			a2.onclick = function() {
				this.disabled = true;
				(async function() {
					await load_values();
					a2.parentNode.parentNode.querySelector("li.active-subsection").classList.remove("active-subsection");
					a2.parentNode.classList.add("active-subsection");
					document.querySelector("div.panel.bg3 div.inner div#cp-main").remove();
					document.querySelector("div.panel.bg3 div.inner").appendChild(create_control_panel("filehosts"));
				})();
				return false;
			}
			a.onclick = function() {
				this.disabled = true;
				(async function() {
					await load_values();
					a.parentNode.parentNode.querySelector("li.active-subsection").classList.remove("active-subsection");
					a.parentNode.classList.add("active-subsection");
					document.querySelector("div.panel.bg3 div.inner div#cp-main").remove();
					document.querySelector("div.panel.bg3 div.inner").appendChild(create_control_panel(""));
				})();
				return false;
			}

		navigation.setAttribute("role", "navigation");
		ul.appendChild(li_active).appendChild(a2).appendChild(span2);
		ul.appendChild(li).appendChild(a).appendChild(span);
		control_panel_menu.appendChild(navigation).appendChild(ul);
		return control_panel_menu;
	}

	function create_control_panel(panel_id) {

		let control_panel = Object.assign(document.createElement("div"), {id:"cp-main", className:"cp-main ucp-main panel-container"}),
			form = Object.assign(document.createElement("form"), {id:"mcp", method:"post", action:"#"}),
			h2 = Object.assign(document.createElement("h2"), {innerText:"Change edit reasons"}),
			p = Object.assign(document.createElement("p"), {innerText:"Here you can change the edit reasons values that will be used by the script"}),
			panel = Object.assign(document.createElement("div"), {className:"panel"}),
			inner = Object.assign(document.createElement("div"), {className:"inner"}),
			fieldset = document.createElement("fieldset");

		if (panel_id === "filehosts") {
			h2.innerText = "Change filehosts";
			p.innerText = "Here you can update the filehosts automatically from MSJ official lists, or edit them manually (Note that auto updating DOES NOT remove filehosts already present in lists, it only adds the missing ones)"
		}

		panel.appendChild(inner).append(p, fieldset);

		function create_input(input_label, input_value, textarea) {

			let dl = document.createElement("dl"),
				dt = document.createElement("dt"),
				dd = document.createElement("dd"),
				label = Object.assign(document.createElement("label"), {innerText:input_label});
				input = typeof textarea === "undefined" ?
						Object.assign(document.createElement("input"), {id:input_value, name:input_value, className:"inputbox autowidth", size:"40"}):
						Object.assign(document.createElement("textarea"), {id:input_value, name:input_value, className:"inputbox", rows:"8", cols:"30"});



			label.setAttribute("for", input_value);
			if (typeof textarea === "undefined") {
				input.setAttribute("value", eval(input_value));
			} else {
				input.innerText = eval(input_value);
			}
			dl.appendChild(dt).appendChild(label);

			if (typeof textarea != "undefined") {
				let br = document.createElement("br");
				let span = Object.assign(document.createElement("span"), {innerText:"Domains must be separated by a comma \",\" (without subdomain \"www\", without protocol \"http\"/\"https\")"});
				dt.append(br, span);
			}

			dd.appendChild(input);
			dl.append(dt, dd);
			return dl;

		}

		if (panel_id === "filehosts") {
			let auto_update = Object.assign(document.createElement("input"), {type:"submit", name:"submit", value:"Update & Save", className:"button1"}),
          title_subdiv = Object.assign(document.createElement("h3"), {innerText: "Edit reasons manually"}),
				  fieldset_auto = Object.assign(document.createElement("fieldset"), {className:"submit-buttons auto_update"});

			auto_update.onclick = function() {
				this.disabled = true;
				if (document.querySelector("p#auto_update_response")) { document.querySelector("p#auto_update_response").remove(); }
				this.parentNode.classList.add("loading");
				(async function() {
					const response = await update_filehost_list();

					auto_update.parentNode.appendChild(Object.assign(document.createElement("p"), {id:"auto_update_response", innerText: response, style: "font-size:0.9em;"}))
					document.querySelector("textarea[name='approved_filehosts']").innerText = approved_filehosts;
					document.querySelector("textarea[name='banned_filehosts']").innerText = banned_filehosts;
					auto_update.disabled = false;
					auto_update.parentNode.classList.remove("loading");

				})()
				return false;
			}
			fieldset_auto.append(auto_update);

			fieldset.append(fieldset_auto, title_subdiv, create_input("Approved filehosts:", "approved_filehosts", "textarea"),
							create_input("Banned filehosts:", "banned_filehosts", "textarea"),
							create_input("Dead filehosts:", "dead_filehosts", "textarea"));

		} else {
			fieldset.append(create_input("Tick", "edit_reason_tick"),
							create_input("[STW] to [REQ]", "edit_reason_stw_to_req"),
							create_input("[REQ] to [STW]", "edit_reason_req_to_stw"),
							create_input("Adding [REQ]", "edit_reason_add_req"),
              create_input("Dead link removed", "edit_reason_remove_dead_link"),
              create_input("Banned filehost removed", "edit_reason_remove_banned_filehost"),
              create_input("STW link in quote removed", "edit_reason_remove_stw_quote"),
							create_input("Version update", "edit_reason_version_number_updated"),
							create_input("Snip replace for links in [code]", "link_snip_text"),
					 		create_input("Snip replace BBCode", "link_snip_bbcode"),
					 		create_input("Reason separator", "edit_reason_separator"));
		}

		function create_button(label) {
			let input_submit = Object.assign(document.createElement("input"), {type:"submit", name:"submit", value:label, className:"button1"});
			if (label != "Save") {
				input_submit.className = "button2";
				input_submit.style = "margin-left:7px;"
			}
			input_submit.onclick = function() {
				let form_data = new FormData(document.querySelector("form#mcp"));
				for (var entry of form_data.entries()) {
					if (label === "Save") {
						if (eval(entry[0]) != entry[1]) {
							(async function() {
								if (/filehosts$/i.test(entry[0])) {
									var reformated = entry[1].replace(/\s/g, "").replace(/,+/g, ",").replace(/(^,|,$)/g, "").replace(/,/g, ", ");
									await GM.setValue(entry[0], reformated);
								} else {
									await GM.setValue(entry[0], entry[1]);
								}
							})();
						}
					} else {
						(async function() {
							await GM.deleteValue(entry[0]);
						})();
					}
				}
				document.querySelector("div.panel.bg3 div.inner div#cp-menu li.active-subsection a").click();
				return false;
			}
			return input_submit;
		}

		var fieldset_submit = Object.assign(document.createElement("fieldset"), {className:"submit-buttons"});
		fieldset_submit.append(create_button("Save"), create_button("Reset"));

		form.append(h2, panel, fieldset_submit);
		control_panel.appendChild(form);

		return control_panel;

	}

	//Helper settings Tab in Moderation Control Panel
	var new_item = Object.assign(document.createElement("li"), {className:"tab", id:"helper_settings"}),
		new_link = Object.assign(document.createElement("a"), {innerText:"Helper settings"});

	new_item.onclick = function() {
		(async function() {
			await load_values();
			document.querySelector("li#helper_settings").parentNode.querySelector("li.activetab").classList.remove("activetab");
			document.querySelector("li#helper_settings").classList.add("activetab");
			document.querySelector("div.panel.bg3 div.inner div#cp-menu").remove();
			document.querySelector("div.panel.bg3 div.inner div#cp-main").remove();
			document.querySelector("div.panel.bg3 div.inner").append(create_control_panel_menu(), create_control_panel("filehosts"));
			return false;
		})();

	}

	document.querySelector("div#tabs ul").appendChild(new_item).appendChild(new_link);

}

function update_filehost_list() {

	return new Promise(async function(resolve, reject) {

		var new_banned_filehosts_array = [], new_approved_filehosts_array = [];

		const approved_response = await make_http_request(undefined, "https://"+ msj_current_domain + "/forum/viewtopic.php?p=778353");

		if (approved_response.status == 200 && approved_response.finalUrl.includes("viewtopic.php")){
			var content = new DOMParser().parseFromString(approved_response.responseText, "text/html");
			var links = content.querySelectorAll("div#post_content778353 div.content a");

			links.forEach(function(link) {
				var link_url = link.href;

				if (link_url.includes("macserialjunkie.com") || !/^http/.test(link_url)) { return; };

				//Remove anti referer
				var link_url_clean = link_url.split(/\?(.+)/)[1];

				if (!is_approved_filehost(link_url_clean)) {
					let domain = (new URL (link_url_clean)).hostname.replace(/^www[0-9]*\./,"");
					new_approved_filehosts_array.push(domain);
				}
			});


		} else {
			console.log("error")
			console.log(response.responseText);
		}

		const banned_response = await make_http_request(undefined, "https://"+ msj_current_domain + "/forum/viewtopic.php?p=776407");

		if (banned_response.status == 200 && banned_response.finalUrl.includes("viewtopic.php")){
			var content = new DOMParser().parseFromString(banned_response.responseText, "text/html");
			var links = content.querySelectorAll("div#post_content776407 div.content a");

			links.forEach(function(link) {
				var link_url = link.href;

				if (link_url.includes("macserialjunkie.com") || !/^http/.test(link_url)) { return; };

				//Remove anti referer
				var link_url_clean = link_url.split(/\?(.+)/)[1];

				if (!is_banned_filehost(link_url_clean)) {
					let domain = (new URL (link_url_clean)).hostname.replace(/^www[0-9]*\./,"");
					new_banned_filehosts_array.push(domain);

				}
			});


		} else {
			console.log("error")
			console.log(response.responseText);

		}

		var response_text = "";
		if (new_banned_filehosts_array.length === 0 && new_approved_filehosts_array.length === 0) {
			response_text += "No new domains found"
		}
		if (new_approved_filehosts_array.length != 0) {
			let new_domains = new_approved_filehosts_array.join(", ");
			response_text += "New domain approved: " + new_domains;
			let tmp_approved_filehosts = approved_filehosts + ", " + new_domains;
			await GM.setValue("approved_filehosts", tmp_approved_filehosts);
			approved_filehosts = tmp_approved_filehosts;
			approved_filehosts_array = approved_filehosts.split(", ");

		}
		if (new_banned_filehosts_array.length != 0) {
			let new_domains = new_banned_filehosts_array.join(", ");
			response_text = response_text === "" ? response_text : response_text + " / ";
			response_text += "New domain banned: " + new_domains;
			let tmp_banned_filehosts = banned_filehosts + ", " + new_domains;
			await GM.setValue("banned_filehosts", tmp_banned_filehosts);
			banned_filehosts = tmp_banned_filehosts;
			banned_filehosts_array = banned_filehosts.split(", ");
		}

		resolve(response_text);

	});
}

function posting_helper_setup() {

	//Get post id and check if there's a record for it in DB, in which case, restore value and delete it from DB.
	var postid = new URLSearchParams(window.location.search).get("p");
	(async () => {
		edit_reason = await GM.getValue(postid, false);
		if (edit_reason) {
			document.querySelector("form#postform input#edit_reason").value = edit_reason;
			await GM.deleteValue(postid);
		}
	})();

}

function setup_helper_tools(post) {

	//Check if post is editable
	//Later, we should also check if we have moderation rights
	if (post.querySelector("ul.post-buttons a[title='Edit post']")) {

		//Store previous edit reason on click
		post.querySelector("ul.post-buttons a[title='Edit post']").onclick = function() {
			if(post.querySelector("div.notice em")) {
				(async () => {
				  await GM.setValue(post.id.replace(/^post_content/g, ""), post.querySelector("div.notice em").innerText);
				})();
			}
		}

		//If it's first post and first page, run title tool
		if (post.is_first_post && (is_first_page || post.is_first_page)) {
			title_helper_tool(post);
		}

		//If post is reported, run report tool
		if (post.querySelector("p.reported") !== null) {
			report_helper_tool(post);

		}

		//If has previous post and is quoting it (same page only)
		/*post.contains_direct_quote = false;
    post.post_id = post.id.replace(/^post_content/g, "");
    if (!post.is_first_post) {
      //console.log(post)
      //console.log(post.parentNode.parentNode.parentNode.previousElementSibling.firstElementChild.querySelector('.postbody').firstElementChild.id)
      //console.log(post.id)
      if (post.parentNode.parentNode.parentNode.previousElementSibling.firstElementChild) {
        var previous_post_id = post.parentNode.parentNode.parentNode.previousElementSibling.firstElementChild.querySelector('.postbody').firstElementChild.id;
        //if (previous_post_id != null) {
          previous_post_id = previous_post_id.replace(/^post_content/g, "");
        //}


        if (post.querySelector("blockquote cite a[href*=\"#p" + previous_post_id + "\"]")) {
          console.log("Post " + post.post_id + " is quoting previous post " + previous_post_id);
          post.contains_direct_quote = true;
          quote_helper_tool(post, previous_post_id);
        } else {
          console.log("Post " + post.post_id + " doesn't include quote of previous post (" + previous_post_id + ")");
        }
      };
    };*/

		//Run link tool
		link_helper_tool(post);

		//Display valid post button if necessary
		if ((post.is_first_post && (is_first_page || post.is_first_page)) ||
			(post.total_link_count > 0) ||
			(post.querySelector("p.reported") !== null) ||
			(post.contains_direct_quote))
    { setup_valid_post_button(post); }

    //Autoload report
    if (post.querySelector("p.reported") !== null) {
      post.querySelector("p.reported a").click();
    }
	}

}

function quote_helper_tool(post, quoted_post) {

	var link = post.querySelector("blockquote cite a[href*=\"#p" + quoted_post + "\"]");
	var snipping_button = create_snipping_button(link, quoted_post, post);
	link.parentNode.insertBefore(snipping_button, link.nextSibling);
  snipping_button.click();
}

function title_helper_tool(post) {

	post.thread_title = post.querySelector("h3.first a");

	//Replace default click behavior
	post.thread_title.href = "#";
	post.thread_title.onclick = function() {
		return false;
	}

	//Backup original title and make it editable
	post.thread_title.original_title = post.thread_title.innerText;
	post.thread_title.parentNode.classList.add("editable");
	post.thread_title.setAttribute("contenteditable", "true");

	//Handle title edition live
	post.thread_title.addEventListener("input", function() {
		post.check_for_changes();
	}, false);

	//Handle pencil click to insert "▸"
	post.thread_title.parentNode.addEventListener("pointerdown", function (e) {
		if (document.activeElement.isContentEditable) {
			if (post.thread_title !== e.target && !post.thread_title.contains(e.target)) {
				e.preventDefault();
				var sel = window.getSelection(),
					range = document.createRange(),
					caret_offset = sel.getRangeAt(0).startOffset;
				//caret_offset = caret_offset > (post.thread_title.innerText.length + 1) ? post.thread_title.innerText.length : caret_offset;
				post.thread_title.innerText = [post.thread_title.innerText.slice(0, caret_offset), "▸", post.thread_title.innerText.slice(caret_offset)].join("");
				range.setStart(post.thread_title.childNodes[0], (caret_offset + 1));
				range.collapse(true);
				sel.removeAllRanges();
				sel.addRange(range);
				post.check_for_changes();
			}
		}
	});

	//Handle pasting to prevent undesired new lines and/or undesired rich text
	post.thread_title.addEventListener("paste", function (e) {
		e.preventDefault();
		var text = e.clipboardData.getData("text/plain").replace(/\n/g, " ");
		document.execCommand("insertText", false, text) //Deprecated
	})

}

function link_helper_tool(post) {

	//Create array to store all snipped links
	post.snipped_links_array = [];

	//Store links count to set edit_reason behavior accurately (rm dl & tick)
	post.total_link_count = 0;

	//Iterate over links in post
	var links = post.querySelectorAll("div.postbody div.content a, div.postbody div.codebox > pre > code");
	links.forEach(function(link) {

		var is_link_in_code_tag = link.href ? false : true;
//console.log(link);
    //Handles links in [code] tag only
		if (is_link_in_code_tag) {


			//Make sure the first 5 lines contains "http" or "snip" to prevent useless loops
			if(/(http|snip)/.test(link.innerText.split("\n").slice(0,5).join(""))) {

				//CSS trick: class added to parent <pre> tag
				link.parentNode.classList.add("snipable_code");

				//Split each line and iterate
				var wrapped_links = link.innerText.split("\n");
				wrapped_links.forEach(function(wrapped_link, index) {

					//If it's not a link, switch to next line
					if (!/^(http)/.test(wrapped_link)) { return; };

					//If it's a known filehost link
					if (is_known_filehost(wrapped_link)) {

						post.total_link_count++;

						//Insert snipping button right next to link
						var snipping_button = create_snipping_button(link, wrapped_link, post);
						snipping_button.style = "top:calc(" + index * 1.3 + "em + 7px);"; //CSS trick
						link.parentNode.insertBefore(snipping_button, link.nextSibling);

						//Insert oepnlink button right next to link
						var openlink_button = create_openlink_button(wrapped_link);
						openlink_button.style = "top:calc(" + index * 1.3 + "em + 7px);"; //CSS trick
						link.parentNode.insertBefore(openlink_button, link.nextSibling);

						if (is_banned_filehost(wrapped_link) || is_dead_filehost(wrapped_link)) {
							snipping_button.click();
						}

					}

				});
			}

		//Handles links in A tag links only
		} else {

			var link_url = link.href;
      link.isSTWquote = false;

     // console.log(link_url)

			//If phoning home or not http/https link, switch to next link
			if (link_url.includes("macserialjunkie.com") || !/^http/.test(link_url)) { return; };

			//Remove anti referer
			var link_url_clean = link_url.split(/\?(.+)/)[1];
//console.log(link_url_clean)
      //Detect if there's no anti referer
      if (typeof link_url_clean == 'undefined' || !/^http/.test(link_url_clean)) {
        link_url_clean = link_url;
      }

			//if link is in known filehost list
			if (link_url_clean && is_known_filehost(link_url_clean)) {

				post.total_link_count++;

         if (post.querySelector("blockquote")) {
          if(post.querySelector("blockquote").contains(link)) {
             post.hasSTWquote = true;
             link.isSTWquote = true;
          }
        }


				//Insert snipping button next to link
				var snipping_button = create_snipping_button(link, link_url_clean, post);
				link.parentNode.insertBefore(snipping_button, link.nextSibling);

				if (is_banned_filehost(link_url_clean) || is_dead_filehost(link_url_clean) || link.isSTWquote) {
					snipping_button.click();
				}

			}
		}
	});
}

function is_subdomain_included(domain, domain_array) {
	return domain_array.some(function(test_domain) {
		if ((new RegExp("\\." + test_domain.replace(/\./g, "\\.") + "$", "g")).test(domain)) { return true; };
	  });
}

function is_known_filehost(link) {
	return is_approved_filehost(link) || is_banned_filehost(link) || is_dead_filehost(link);
}

function is_approved_filehost(link) {
	let domain = (new URL (link)).hostname;
	return (approved_filehosts_array.includes(domain) || is_subdomain_included(domain, approved_filehosts_array));
}

function is_banned_filehost(link) {
	let domain = (new URL (link)).hostname;
	return (banned_filehosts_array.includes(domain) || is_subdomain_included(domain, banned_filehosts_array));
}

function is_dead_filehost(link) {
	let domain = (new URL (link)).hostname;
	return (dead_filehosts_array.includes(domain) || is_subdomain_included(domain, dead_filehosts_array));
}

function create_snipping_button(link, link_url, post) {

	var snipping_button = Object.assign(document.createElement("a"), {innerText:"❌", href:"#", className:"snipping_button"});
	var is_link_in_code_tag = link.href ? false : true;

	//Handling button clicking behavior
	snipping_button.onclick = function () {

		//Toggle button style (not used in CSS yet, only in code to know if enabled or not)
		this.classList.toggle("enabled");

		//Toggle link's style (if wrapped in CODE tag)
		if (is_link_in_code_tag) {

			var regex_url = link_url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
			var regex = this.classList.contains("enabled") ?
						new RegExp("\^" + regex_url + "\$", "m") :
						new RegExp("<s class=\"striked\">" + regex_url + "</s>", "i");
			link.innerHTML = this.classList.contains("enabled") ?
						link.innerHTML.replace(regex, "<s class=\"striked\">" + link_url + "</s>") :
						link.innerHTML.replace(regex, link_url);

		//Toggle link's style (if NOT wrapped in CODE tag)
		} else {
			link.classList.toggle("striked");
		}

		//Push/remove link in/from snipped_links_array
		var stored_url = is_link_in_code_tag ? "wrapped_" + link_url : link_url;
		//console.log(stored_url)
		if(this.classList.contains("enabled")) {
			post.snipped_links_array.push(stored_url);
		} else {
			post.snipped_links_array.splice(post.snipped_links_array.indexOf(stored_url), 1);
		}

		//Check if changes can be validated and cancel click behavior
		if (post.check_for_changes) {
			post.check_for_changes();
		}
		return false;

	}

	return snipping_button;

}

function create_openlink_button(link_url) {

	var openlink_button = Object.assign(document.createElement("a"), {innerText: "🔗", href: "http://href.li/?" + link_url, className:"openlink_button"});
	return openlink_button;

}

function report_helper_tool(post) {
	var report_link = post.querySelector("p.reported a"),
	report_link_url = report_link.href;

	post.report_link_label = report_link.querySelector("strong");

	report_link.onclick = function () {

		if (!this.classList.contains("disabled")) {
			this.classList.add("disabled");

			(async function() {
				const response = await make_http_request(post, report_link_url);

				if(response.status == 200 && response.finalUrl.includes("mcp.php")){
					post.report_link_label.innerText = "Report details"
					viewreport_handler(response, post);
				} else {
					console.log("error")
					console.log(response.responseText);
					this.classList.remove("disabled");
					post.report_link_label.innerText = "Error loading report! (click to try again)"
				}
				post.check_for_changes();

			})();

			return false;

		} else { return false; }

	}

}

function confirmreport_handler(response, post) {

	var confirm_html = document.createElement("html");
	confirm_html.innerHTML = response.responseText;
	var confirm_form = confirm_html.querySelector("form#confirm");

	//Store FORM data
	var confirm_data = new FormData(confirm_form),
	confirm_data_array = [];

	//Iterate over FORM data
	for (var entry of confirm_data.entries()) {
		confirm_data_array.push(encodeURIComponent(entry[0]) + "=" + encodeURIComponent(entry[1]));
	}

	//Add confirmation and build request
	confirm_data_array.push("confirm=Yes");
	var confirm_request = confirm_data_array.join("&");


	(async function() {
		var request_url = confirm_form.getAttribute("action").replace(/^\./, "https://"+ msj_current_domain + "/forum");
		const confirm_response = await make_http_request(post, request_url, confirm_request, 1000);

		if (confirm_response.status == 200 &&
			confirm_response.finalUrl.includes("mcp.php") &&
			confirm_response.responseText.includes("div class=\"panel\" id=\"message\"")
		) {
			var returned_message = confirm_response.responseText.split("The selected report has")[1].split(".")[0];
			post.report_link_label.innerText = "The report has" + returned_message + "!";
			post.querySelector("div#report_viewer").remove();

		} else {
			console.log("error");
			console.log(confirm_response.responseText);
		}

		post.check_for_changes();

	})();

}

function viewreport_handler(response, post) {

	var content = new DOMParser().parseFromString(response.responseText, "text/html");

	//Add report to HTML
	var report = Object.assign(document.createElement("div"), {id: "report_viewer", innerHTML: content.querySelector("div#report").outerHTML + content.querySelector("form#mcp_report").outerHTML });
	post.querySelector("p.reported").appendChild(report);

	//Store FORM data
	var report_form = report.querySelector("form#mcp_report"),
	report_form_buttons = report_form.querySelectorAll("input[type='submit']"),
	form_data = new FormData(report_form);

	//Iterate over FORM buttons
	report_form_buttons.forEach(function(report_button) {

		//Handle click event
		report_button.onclick = function() {

			//Ask for confirmation
			var human_confirmation = window.confirm(this.value + " ?")
			if (human_confirmation !== true) {
				return false;
			}

			//Iterate over FORM data
			var form_data_array = [];
			for (var entry of form_data.entries()) {
				form_data_array.push(encodeURIComponent(entry[0]) + "=" + encodeURIComponent(entry[1]));
			}

			//Add button data and build POST request
			form_data_array.push(encodeURIComponent(this.name) + "=" + encodeURIComponent(this.value));
			var request_built = form_data_array.join("&");

			//Submit POST request
			(async function() {
				var request_url = report_form.getAttribute("action").replace(/^\./, "https://"+ msj_current_domain + "/forum");
				const response = await make_http_request(post, request_url, request_built);

				if (response.status == 200 &&
					response.finalUrl.includes("mcp.php") &&
					response.responseText.includes("form id=\"confirm\"")
				) {

					confirmreport_handler(response, post);

				} else {
					console.log("error");
					console.log(response.responseText);
					post.check_for_changes();
				}

			})();

			return false;

		}
	});

}

function edit_request_handler(response, post) {

  console.log(response.responseText);
	var content = new DOMParser().parseFromString(response.responseText, "text/html");
	var form_dom = content.querySelector("form#postform");

	//Get FORM action URL
	var form_action_url = form_dom.getAttribute("action").replace(/^\./, "https://"+ msj_current_domain + "/forum");

	//Iterate over FORM entries, store values in ARRAY
	var form_data = new FormData(form_dom);
	var form_data_array = [];
	for (var entry of form_data.entries()) {

		//Title
		if (entry[0] == "subject" && post.thread_title) {

			function reformat_title(title) {
				return title.replace(/\s*\]\s*/g,"] ").replace(/\s*\[\s*/g," [").replace(/\s+/g," ").replace(/\[K\]\s\'*(ed|d)/ig, "[K]'d").replace(/^\s*|\s*$/gm,"");
			}

			form_data_array.push("subject=" + encodeURIComponent(reformat_title(post.thread_title.innerText)));

		//Post content
		} else if (entry[0] == "message" && post.snipped_links_array.length !== 0) {

			var original_message = entry[1],
				new_message = entry[1];

			//Remove old green check marks
			new_message = new_message.replace(/\[img\]\s*http(s|):\/\/i\.imgur\.com\/g63bDvm\.png\s*\[\/img\]/gi, "")

			//Snip links
			post.snipped_links_array.forEach(function(link) {

				var is_wrapped = /^wrapped_/.test(link);

				link = link.replace(/^wrapped_/, "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
				link_alt = link.replace("%5B", "\\[").replace("%5D","\\]")

				var regex = new RegExp("(\\[url *=? *\\]?)?" + link + "(\\].*? *\\[\\/url\\])?(\\[\\/url\\])?", "mi")
				var regex2 = new RegExp("(\\[url *=? *\\]?)?" + link_alt + "(\\].*? *\\[\\/url\\])?(\\[\\/url\\])?", "mi")

				if (is_wrapped) {
					new_message = new_message.replace(regex, link_snip_text)
				} else {
					new_message = new_message.replace(regex, link_snip_bbcode);
					new_message = new_message.replace(regex2, link_snip_bbcode);
				}

			});

			form_data_array.push("message=" + encodeURIComponent(new_message));

		//All the rest except edit reason
		} else if (entry[0] !== "edit_reason") {
			form_data_array.push(encodeURIComponent(entry[0]) + "=" + encodeURIComponent(entry[1]));
		}
	}

	//Edit reason
	if (post.human_check) {
		var known_reasons = post.edit_reasons.join(edit_reason_separator);
		var human_reasons = window.prompt("Edit reason:", known_reasons)
		if (human_reasons === null) {
			post.check_for_changes();
			return;

		} else {
			form_data_array.push("edit_reason=" + encodeURIComponent(human_reasons));
		}
	} else {
		form_data_array.push("edit_reason=" + encodeURIComponent(post.edit_reasons.join(edit_reason_separator)));
	}

	//Add INPUT "post" (mandatory for PhpBB)
	form_data_array.push("post=Submit");

	//Build POST request
	var request_built = form_data_array.join("&");

	//Submit POST request
	(async function() {
		const response = await make_http_request(post, form_action_url, request_built, 1000);
		if (response.status == 200 && response.finalUrl.includes("viewtopic.php")){

			//Retrieve post content and reinsert relevants parts
			var content = new DOMParser().parseFromString(response.responseText, "text/html");
			var new_post = content.querySelector("div#" + post.id);

			//Title
			if (post.is_first_post && (is_first_page || post.is_first_page)) {
				post.querySelector(":scope > h3").innerHTML = new_post.querySelector("div > h3").innerHTML;
				document.querySelector("h2.topic-title a").innerText = new_post.querySelector("div > h3 a").innerText;
			}

			//Content
			post.querySelector(":scope > div.content").innerHTML = new_post.querySelector("div > div.content").innerHTML;

			//Last edited by
			if (post.querySelector(":scope > div.notice")) {
				post.querySelector(":scope > div.notice").innerHTML = new_post.querySelector("div > div.notice").innerHTML;
			} else if (new_post.querySelector("div > div.notice")) {
				var new_notice = Object.assign(document.createElement("div"), {className:"notice"});
				new_notice.innerHTML = new_post.querySelector("div > div.notice").innerHTML;
				post.insertBefore(new_notice, post.querySelector(":scope > div.content").nextElementSibling);
			}

			setup_helper_tools(post);

		} else {

			console.log("error");
			console.log(response.responseText);
			post.check_for_changes();

		}
	})();
}

function make_http_request(post, page_url, post_data, request_delay) {

	return new Promise(function(resolve, reject) {

		//If first request is delayed
		request_delay = typeof request_delay === "undefined" ? 0 : request_delay;
		request_delay = typeof post_data === "number" ? post_data : request_delay;

		//Handle button state
		if(post) {
			post.valid_post_button.classList.remove("enabled");
			post.valid_post_button.classList.add("loading");
		}

		//Make request
		function make_request () {

			//In case button state was refreshed by another request
			if(post) {
				post.valid_post_button.classList.remove("enabled");
				post.valid_post_button.classList.add("loading");
			}

			if(!request_pending) {
				request_pending = true;
				let gm_req = {"method": "GET", "responseType": "document", "url": page_url};
				if (typeof post_data != "undefined") {
					gm_req.method = "POST";
					gm_req.headers = {"Content-Type": "application/x-www-form-urlencoded"};
					gm_req.data = post_data;
				} else {
					post_data = "";
				}
				gm_req.onload = function(response) {
					if(post) {
						post.valid_post_button.classList.remove("loading");
					}
					request_pending = false;
					resolve(response);
				}

				console.log("Request [" + gm_req.method  + "] " + page_url + " " + post_data);
				GM.xmlHttpRequest(gm_req);

			} else {
				if(post) {
					console.log("Post " + post.id + " is waiting for a request slot to open");
				} else {
					console.log("A request is waiting for a slot to open");
				}

				setTimeout(make_request, 300);
			}
		}
		setTimeout(make_request, request_delay);

	});
}

function setup_valid_post_button(post) {

	//Mark the post
	post.parentNode.parentNode.parentNode.parentNode.classList.add("moderated_post");

	//Check if post is ticked
	post.is_ticked = post.innerHTML.includes("https://i.imgur.com/g63bDvm.png");
	var post_edit_reason = document.querySelector("div#" + post.id + " > div.notice");
	if (post_edit_reason) {
		if (post_edit_reason.innerHTML.includes("✅")) {
			post.is_ticked = true;
		}
	}

	//Create a new menu item, with its button and icon
	if (!post.valid_post_button) {

		var new_menu_item = document.createElement("li"),
			valid_post_button_icon = Object.assign(document.createElement("i"), {className: "icon fa-fw"}),
			valid_post_button_label = Object.assign(document.createElement("span"), {className: "sr-only", innerText: "Valid post"}),
			valid_post_button_tooltip = Object.assign(document.createElement("span"), {className: "tooltip"});

		post.valid_post_button = Object.assign(document.createElement("a"), {className: "button button-icon-only valid_post_button"});

		post.valid_post_button.append(valid_post_button_icon, valid_post_button_label, valid_post_button_tooltip);

		post.valid_post_button.onclick = function () {

			if (this.classList.contains("enabled")) {

				(async function() {
					var edit_page_url = post.querySelector("a[title='Edit post']").href;
					const response = await make_http_request(post, edit_page_url);
					if(response.status == 200){
						edit_request_handler(response, post);
					} else {
						console.log("error");
						console.log(response.responseText);
						post.check_for_changes();
					}
				})();

			} else { return false; };

		}

		//Add new item to DOM
		new_menu_item.appendChild(post.valid_post_button);
		post.querySelector("ul[class=post-buttons]").appendChild(new_menu_item);

		post.check_for_changes = function() {

			if ((post.snipped_links_array.length > 0) ||
				(post.total_link_count > 0 && !post.is_ticked) ||
				(post.thread_title && post.thread_title.original_title !== post.thread_title.innerText)
			) {

				post.valid_post_button.classList.add("enabled");

			} else {
				post.valid_post_button.classList.remove("enabled");
			}

			//Preview edit reasons handler
			post.edit_reasons = [];
			post.human_check = false;

			//Ticks
			if (post.total_link_count > post.snipped_links_array.length) {
				post.edit_reasons.push(edit_reason_tick);
			}

			//Title changes
			function process_title(title) {
				return title.replace(/▸|:|-|\/|\(|\)|\[|\]/g," ").replace(/\s+/g," ").replace(/^\s*|\s*$/gm,"");
			}

			if (post.thread_title && process_title(post.thread_title.original_title) !== process_title(post.thread_title.innerText)) {

				var original_title_array = process_title(post.thread_title.original_title).split(" "),
				new_title_array = process_title(post.thread_title.innerText).split(" "),
				original_index = 0, new_index = 0, checking = true,
				max_array_length = new_title_array.length > original_title_array.length ? new_title_array.length : original_title_array.length;

				post.human_check = new_title_array.length !== original_title_array.length ? true : false;

				while (checking) {

					//If they don't match
					if (new_title_array[new_index] !== original_title_array[original_index]) {

						//If it's a STW/REQ switch
						if (/^STW/.test(new_title_array[new_index]) && /^REQ/.test(original_title_array[original_index])) {
							post.edit_reasons.push(edit_reason_req_to_stw);

						} else if (/^REQ/.test(new_title_array[new_index]) && /^STW/.test(original_title_array[original_index])) {
							post.edit_reasons.push(edit_reason_stw_to_req);

						} else if (/^REQ$/.test(new_title_array[new_index])) {
							post.edit_reasons.push(edit_reason_add_req);

						} else {

							function process_version(version) {
								return version.replace(/(^v|\.)/g,"");
							}

							//If it's a version number change vX.X.X.Xaa
							if (/^\d+[a-z]{0,2}$/.test(process_version(new_title_array[new_index])) &&
								/^\d+[a-z]{0,2}$/.test(process_version(original_title_array[original_index])) &&
								process_version(original_title_array[original_index]) != process_version(new_title_array[new_index]) &&
								!post.edit_reasons.includes(edit_reason_add_req) &&
								!post.edit_reasons.includes(edit_reason_version_number_updated)
							) {

								post.edit_reasons.push(edit_reason_version_number_updated);

							} else { post.human_check = true; }
						}

					}

					//Exit loop conditions
					checking = (new_index >= (max_array_length - 1) || original_index >= (max_array_length -1)) ? false : true;

					//Loop increments
					if (new_index < (new_title_array.length-1)) { new_index++; }
					if (original_index < (original_title_array.length-1)) { original_index++; }
				}

				//If title is different but no reason was identified
				if ((post.edit_reasons.includes(edit_reason_tick) && post.edit_reasons.length === 1) ||
					(!post.edit_reasons.includes(edit_reason_tick) && post.edit_reasons.length === 0)) {
					post.human_check = true;
				}

			}

			//Snipped links (banned or approved)
			if (post.snipped_links_array.length !== 0) {

        if (post.hasSTWquote) {
					post.edit_reasons.push(edit_reason_remove_stw_quote);
				} else {

				//Iterate over snipped links to count banned links
				var banned_links = 0;
				post.snipped_links_array.forEach(function(link) {
					var clean_link = link.replace(/^wrapped_/, "");
					banned_links = is_banned_filehost(clean_link) ? banned_links + 1 : banned_links;
				});

				if (banned_links > 0) {
					post.edit_reasons.push(edit_reason_remove_banned_filehost);
				}

				if (post.snipped_links_array.length > banned_links) {
					post.edit_reasons.push(edit_reason_remove_dead_link);
				}
        }
			}

			if (post.human_check || post.edit_reasons.length === 0) {
				post.human_check = true;
				valid_post_button_tooltip.classList.add("human_check");
			} else {
				valid_post_button_tooltip.classList.remove("human_check");
			}

			//Add edit reasons to tooltip
			valid_post_button_tooltip.innerText = post.edit_reasons.length === 0 ? "?" : post.edit_reasons.join(edit_reason_separator);

		}
	}

	post.check_for_changes();

}

function confirm_exit_handler() {

	window.addEventListener("beforeunload", function(e) {
		var pending_actions = document.querySelectorAll("a.valid_post_button.loading");
		if(pending_actions && pending_actions.length > 0) {
			pending_actions.forEach(function(post) {
				post.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style = "display:block !important";
			});
			var ref = document.querySelector("div#qr_posts");
			ref.classList.add("selected_posts");
			ref.scrollIntoView({ behavior: "smooth", block: "start" })
			if(!document.querySelector("div#qr_posts > a.display_all_posts")) {
				var display_all_button = Object.assign(document.createElement("a"), {className: "display_all_posts", innerText: "Only " + pending_actions.length + " post(s) displayed (Click here to display all posts)", href: "#"});
				display_all_button.onclick = function() {
					ref.classList.remove("selected_posts");
					this.remove();
					pending_actions.forEach(function(post) {
						post.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style = "";
					});
					return false;
				}
				ref.insertBefore(display_all_button, ref.firstChild);
			}
			e.preventDefault();
			e.returnValue = "";
		}
	});

}

function load_values() {
	return new Promise(async function(resolve, reject) {
		edit_reason_tick = await GM.getValue("edit_reason_tick", "✅");
		edit_reason_stw_to_req = await GM.getValue("edit_reason_stw_to_req", "STW>REQ");
		edit_reason_req_to_stw = await GM.getValue("edit_reason_req_to_stw", "REQ>STW");
		edit_reason_add_req = await GM.getValue("edit_reason_add_req", "add REQ");
		edit_reason_remove_dead_link = await GM.getValue("edit_reason_remove_dead_link", "rm dl");
		edit_reason_remove_banned_filehost = await GM.getValue("edit_reason_remove_banned_filehost", "rm banned filehost");
    edit_reason_remove_stw_quote = await GM.getValue("edit_reason_remove_stw_quote", "rm STW quote");
		edit_reason_version_number_updated = await GM.getValue("edit_reason_version_number_updated", "up v#");
		link_snip_text = await GM.getValue("link_snip_text", "snip");
		link_snip_bbcode = await GM.getValue("link_snip_bbcode", "[b][color=#BF0040]snip[/color][/b]");
		edit_reason_separator = await GM.getValue("edit_reason_separator", "; ");
		approved_filehosts = await GM.getValue("approved_filehosts", "1fichier.com, 2shared.com, 4shared.com, alfafile.net, anonfile.com, anonfiles.com, bayfiles.com, bytesbox.com, cjoint.net, cloud.mail.ru, ddl.to, delafil.se, desufiles.com, disk.yandex.com, dl.free.fr, downace.com, dropbox.com, drive.google.com, easypaste.org, fex.net, filedropper.com, filehosting.org, file.bz, file.io, filemail.com, filepup.net, files.fm, files.com, filetransfer.io, fileserve.com, filesupload.org, forumfiles.com, global-files.net, gofile.io, ki.tc, letsupload.cc, mediafire.com, mega.co.nz, mega.nz, megaupload.is, megaupload.nz, mirrorcreator.com, mirrored.to, multiup.org, myfile.is, my.syncplicity.com, multiup.eu, onedrive.live.com, oshi.at, pcloud.com, u.pcloud.link, my.pcloud.com, pixeldrain.com, pixeldra.in, racaty.net, rapidshare.nu, rghost.net, send.cm, sendit.cloud, sendspace.com, share-online.is, solidfiles.com, transfer.sh, tropicshare.com, uptobox.com, wetransfer.com, wikiupload.com, workupload.com, yadi.sk, upl.io, upload.st, uplovd.com, zippyshare.com");
		banned_filehosts = await GM.getValue("banned_filehosts", "ausfile.com, asmfile.com, chayfile.com, clicknupload.com, clicknupload.cc, cloudghost.net, cutedrive.com, dailyuploads.net, depositfiles.com, dfiles.eu, douploads.com, down.mdiaload.com, dropapk.to, drop.download, easybytez.com, edisk.eu, extabit.com, fileboom.me, filecad.com, filedais.com, filedwon.info, filefactory.com, filenext.com, filer.net, filerio.in, filescdn.com, filesflash.com, filespace.com, filetut.com, file-up.org, file-upload.com, en.file-upload.net, file-upload.cc, gigapeta.com, hulkload.com, icerbox.com, inclouddrive.com, katfile.com, keep2share.cc, keeplinks.eu, lumfile.com, up.media1fire.com, mexashare.com, nitroflare.com, novafile.com, oboom.com, rapidgator.net, rg.to, relink.us, restfilee.com, salefiles.com, sharemods.com, sendmyway.com, ska4ay.com, sundryfiles.com, sundryupload.com, terafile.co, turbobit.net, tusfiles.net, ufile.io, ul.to, uloz.to, ulozto.net, uploadboy.com, uploadboy.me, uploadbuzz.cc, uploaded.net, uploadfiles.io, uploadgig.com, uploading.vn, uploadrocket.net, upload.run, upstore.net, userscloud.com, usersdrive.com, vidzbeez.com, vip-file.com, youwatch.org, worldbytez.com, zofile.com");
		dead_filehosts = await GM.getValue("dead_filehosts", "321webs.com, anonymousfiles.io, bigfile.to, datafilehost.com, drop.me, edfile.pro, fast-files.com, filesonic.com, ge.tt, hotfile.to, jheberg.com, jheberg.net, load.to, megaupload.com, multiupload.com, nekaka.com, netload.in, nofile.io, openload.cc, rapidshare.com, sharemole.com, uploadmb.com, uploved.com");
		approved_filehosts_array = approved_filehosts.split(", ");
		banned_filehosts_array = banned_filehosts.split(", ");
		dead_filehosts_array = dead_filehosts.split(", ");
		resolve();
	})
}

//Init
"use strict";
(async function() {
	if (is_posting_page) {
		posting_helper_setup();
	} else if (is_viewtopic_page) {
		await load_values();
		viewtopic_helper_setup();
	} else if (is_mcp_page) {
		mcp_helper_setup();
	}
})()