	// ==UserScript==
	// @name         Thread Rebuilder
	// @namespace    http://tampermonkey.net/
	// @version      3.6
	// @description  try to take over the world!
	// @author       ECHibiki /qa/
	// @match https://boards.4chan.org/*/thread/*
	// @match http://boards.4chan.org/*/thread/*
	// @grant         GM_xmlhttpRequest
	// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/33407/Thread%20Rebuilder.user.js
// @updateURL https://update.greasyfork.org/scripts/33407/Thread%20Rebuilder.meta.js
	// ==/UserScript==

	var board = "qa";
	var thread_data = [['Comment'], ['Image URLs'], ['Image Names'] ,['Post No.']];
	var semaphore = 1;
	var semaphore_posts = 1;
	var timeListen;

	var use_offsite_archive = false;
	var window_displayed = false;
	var in_sequence = false;
	var tool_top_visible = false;

	var help_icon_source = " data:image/jpeg;base64,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";

	//1) CREATE INTERFACE
	//set listener to build interface in 4chanX
	//set listeners to build interface in 4chanX
document.addEventListener("4chanXInitFinished", function(e){
	document.addEventListener("QRDialogCreation", enhance4ChanX);

	rebuildWindow();
	rebuildButton();

	use_offsite_archive =  localStorage.getItem("ArchiveType") == 0  ? true : false;
	//console.log(localStorage.getItem("ArchiveType"));
	if(use_offsite_archive) document.getElementById("OffsiteArchive").checked = "true";
	else document.getElementById("OnsiteArchive").checked = "true";
//console.log(document.getElementById("OnsiteArchive"));
//console.log(document.getElementById("OffsiteArchive"));
	loaded = true;
}, false);

//is storage possible
function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
		//From https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
}

//settings for time expiration on image hiding
function rebuildWindow(){
    var style = document.createElement('style');
    style.innerHTML = ".inputs{background-color:rgb(200,200,200);margin:5px 7px;width:100px;}";
    document.body.appendChild(style);

    var background_div = document.createElement("div");
    background_div.setAttribute("style", "border:solid 1px black;position:fixed;width:100%;height:100%;background-color:rgba(200,200,200,0.3);top:0;left:0;display:none; z-index:9");
    background_div.setAttribute("id", "rebuildBackground");
    document.body.appendChild(background_div);
    background_div.addEventListener("click", rebuildToggle);

    var window_div = document.createElement("div");
    window_div.setAttribute("style", "border:solid 1px black;position:fixed;width:400px;background-color:rgb(200,200,200);left:40%;top:20%;margin-bottom:0;  display:none; z-index:10");
    window_div.setAttribute("id", "rebuildWindow");

    var close_div = document.createElement("div");
    close_div.setAttribute("style", "border:solid 1px black;position:absolute;width:25px;height:25px;background-color:rgba(255,100,90,0.9); right:3px;top:3px; z-index:10");
    close_div.addEventListener("click", rebuildToggle);
    window_div.appendChild(close_div);

    var title_para = document.createElement("p");
    title_para.setAttribute("style", "margin-left:5px;margin-top:5px");
    var title_text = document.createTextNode("Rebuild Settings");
    title_para.appendChild(title_text);
    window_div.appendChild(title_para);

    var container_div = document.createElement("div");
    container_div.setAttribute("style","background-color:white;margin:0 0;padding:5px;");
    window_div.appendChild(container_div);

    var rebuild_label_local = document.createElement("label");
    var rebuild_text_local = document.createTextNode("Use 4chan Archives: ");
    rebuild_label_local.appendChild(rebuild_text_local);
    container_div.appendChild(rebuild_label_local);
    var rebuild_input_local = document.createElement("input");
	rebuild_input_local.setAttribute("type", "radio");
	rebuild_input_local.setAttribute("name", "ArchiveSettings");
    rebuild_input_local.setAttribute("id", "OnsiteArchive");
    container_div.appendChild(rebuild_input_local);
    container_div.appendChild(rebuild_input_local);
    container_div.appendChild(document.createElement("br"));

	var rebuild_label_offsite = document.createElement("label");
    var rebuild_text_offsite = document.createTextNode("Use Offsite Archives: ");
    rebuild_label_offsite.appendChild(rebuild_text_offsite);
    container_div.appendChild(rebuild_label_offsite);
    var rebuild_input_offsite = document.createElement("input");
	rebuild_input_offsite.setAttribute("type", "radio");
	rebuild_input_offsite.setAttribute("name", "ArchiveSettings");
    rebuild_input_offsite.setAttribute("id", "OffsiteArchive");
    container_div.appendChild(rebuild_input_offsite);
    container_div.appendChild(rebuild_input_offsite);
    container_div.appendChild(document.createElement("br"));

    var set_button = document.createElement("input");
    set_button.setAttribute("type", "button");
    set_button.setAttribute("id", "setArchive");
    set_button.setAttribute("value", "Set Archive");
    set_button.addEventListener("click", function(){
        if (storageAvailable('localStorage')) {
			var radio_options = document.getElementsByName("ArchiveSettings");
			for (var radio_input = 0 ; radio_input < radio_options.length; radio_input++)
				if(radio_options[radio_input].checked){
					//console.log(1 - radio_input);
					localStorage.setItem("ArchiveType", 1 - radio_input);
					if(radio_input == 0) use_offsite_archive = true;
				}
            rebuildToggle();
        }
    });
    container_div.appendChild(set_button);

    document.body.appendChild(window_div);

}

function rebuildToggle(){
    if(window_displayed){
        document.getElementById("rebuildWindow").style.display = "none";
        document.getElementById("rebuildBackground").style.display = "none";
        window_displayed = false;
    }
    else{
        document.getElementById("rebuildWindow").style.display = "inline-block";
        document.getElementById("rebuildBackground").style.display = "inline-block";
        window_displayed = true;
    }
}

function rebuildButton(){
    var rebuild_button = document.createElement("input");
    rebuild_button.setAttribute("Value", "Thread Rebuilder Settings");
    rebuild_button.setAttribute("type", "button");
    rebuild_button.setAttribute("style", "position:absolute;top:105px");
    rebuild_button.addEventListener("click", rebuildWindow);
    if(document.body === null){
        setTimeout(rebuildButton, 30);
    }
    else{
        document.body.appendChild(rebuild_button);
        rebuild_button.addEventListener("click", rebuildToggle);
    }
}

var enhance4ChanX = function(){
	var qr_window = document.getElementById("qr");

	if(document.getElementById("qrRebuilder") !== null) qr_window.removeChild(document.getElementById("qrRebuilder"));

	var thread_rebuilder_table = document.createElement("TABLE");
	thread_rebuilder_table.setAttribute("id", "qrRebuilder");
	thread_rebuilder_table.setAttribute("style", "text-align:center");
	qr_window.appendChild(thread_rebuilder_table);

	var thread_row = document.createElement("TR");
	var option_text_size = 18;
	var help_icon_container = document.createElement("A");
	help_icon_container.href = "javascript:void(0)";
	help_icon_container.title = "Click to View Help!";
	var help_icon = document.createElement("IMG");
	help_icon.setAttribute("style", "height:" + option_text_size * 1.25 + "px;margin:-4px 10px");
	help_icon.src = help_icon_source;

	help_icon_container.appendChild(help_icon);
	thread_row.appendChild(help_icon_container);

	var tooltip_div = document.createElement("DIV");
	tooltip_div.innerHTML = "Insert the thread number of the post to rebuild<br/>Must be in either the 4chan archives or archived.moe<hr/>Submit bugs to <a href='https://github.com/ECHibiki/4chan-UserScripts'>my Github</a>";
	tooltip_div.setAttribute("style", "z-index:9;padding:5px;border:1px solid black;background-color:white;word-wrap:break-word;display:none;position:absolute;");
	help_icon_container.addEventListener("click", function(ev){
		if(tool_top_visible)
			tooltip_div.setAttribute("style", "z-index:9;padding:5px;border:1px solid black;background-color:white;word-wrap:break-word;display:none;position:absolute;");
		else
			tooltip_div.setAttribute("style", "z-index:9;padding:5px;border:1px solid black;background-color:white;word-wrap:break-word;display:block;position:absolute;"
				+ "left:" +  (ev.clientX - qr_window.getBoundingClientRect().x) +
				"px;top:" +  (ev.clientY - qr_window.getBoundingClientRect().y ) + "px;");
		tool_top_visible = !tool_top_visible;
	});
	qr_window.appendChild(tooltip_div);

	var second_row_nodes = [
		document.createTextNode("Thread: "),
		document.createElement("INPUT"),
		document.createElement("INPUT"),
	];
	second_row_nodes.forEach(
		function(node){
			thread_row.appendChild(node);
		});
	thread_rebuilder_table.appendChild(thread_row);

	second_row_nodes[1].setAttribute("ID", "threadInput");
	second_row_nodes[1].setAttribute("style", "width:35.0%");

	second_row_nodes[2].setAttribute("ID", "threadButton");
	second_row_nodes[2].setAttribute("type", "button");
	second_row_nodes[2].setAttribute("value", "Set Rebuild Queue");

	second_row_nodes[2].addEventListener("click", function(){
			//console.log(use_offsite_archive);
		in_sequence = true;
		killAll();
		getThread(second_row_nodes[1].value);
		postID = setInterval(postRoutine, 1000);
		if(timeListen === undefined) timeListen = setInterval(timeListenerFunction, 1000);
	});
	qr_window.appendChild(document.createElement("hr"));
};

var thread_data_length = 0;
var posts_created = 0;
var postID = "";
var postRoutine = function(){
	if(semaphore == 0){
		semaphore++;
		thread_data_length = thread_data[0].length;
		fillID = setInterval(fillRoutine, 10);
		stopRoutine();
	}
};

var stopRoutine = function(){
	clearInterval(postID);
};

var fillID  = "";
var fillRoutine = function(){
	if(posts_created >= thread_data_length) {semaphore_posts  = 0 ; stopFillRoutine();}
	else if(semaphore_posts == 1){
		semaphore_posts--;
		createPost(thread_data[0][posts_created], thread_data[1][posts_created], thread_data[2][posts_created]);
		posts_created++;
	}
};

var stopFillRoutine = function(){
	clearInterval(fillID);
};

var setPropperLinking = function(text){
	var search_regex = RegExp(">>\\d+", "g");
	var result;
	var index_old = -1;
	var link_arr = Array();
	while((result = search_regex.exec(text)) != null){
		var end_index = search_regex.lastIndex;
		var post_no = result.toString().replace(/>/g, "");
		link_arr.push([post_no, end_index]);
	}
//hunt down the text of what it linked to
//Get the links inside of the origonal message to show text contents

	var responding_text = Array();
	if(use_offsite_archive)
		URL  = "https://www.archived.moe/_/api/chan/thread/?board=" + board + "&num=" + document.getElementById("threadInput").value;
	else
		URL  = "https://a.4cdn.org/" + board + "/thread/" + document.getElementById("threadInput").value + ".json";
		var xhr = new GM_xmlhttpRequest(({
			method: "GET",
			url: URL,
			responseType : "json",
			onload: function(data){
				if(use_offsite_archive)
					data = data.response["" + document.getElementById("threadInput").value]["posts"];
				else
					data = data.response["posts"];
				if(data == undefined){
					alert("Invalid Thread ID: " + document.getElementById("threadInput").value + ". ");
				}
				else{
					link_arr.forEach(function(link_item){
						for(var data_entry = 0 ; data_entry < data.length ; data_entry++){
							if(parseInt(link_item[0]) == parseInt(data[data_entry]["no"])){
								if(use_offsite_archive && data[data_entry]["comment_processed"] !== undefined)
									responding_text.push([ [post_no, end_index], data[data_entry]["comment_processed"].replace(/(&gt;&gt;|https:\/\/www\.archived\.moe\/.*\/thread\/.*\/#)\d+/g, ""), link_item["media"]["safe_media_hash"] ]);
								else if(data[data_entry]["com"] !== undefined)
									responding_text.push([ [post_no, end_index], data[data_entry]["com"].replace(/(&gt;&gt;|#p)\d+/g, ""), data[data_entry]["md5"] ]);
								else responding_text.push([ [post_no, end_index], undefined, data[data_entry]["md5"] ]);
								break;
							}
						}
					});

					var current_url = window.location.href;
					var hash_index = current_url.lastIndexOf("#") != -1 ? current_url.lastIndexOf("#"):  window.location.href.length;
					var current_thread = window.location.href.substring(current_url.lastIndexOf("/")+1, hash_index);
					var current_url =  "https://a.4cdn.org/" + board + "/thread/" + current_thread + ".json";
					//open current thread to hunt down the text found in links
					var xhr = new GM_xmlhttpRequest(({
						method: "GET",
						url: current_url,
						responseType : "json",
						onload: function(data){
							data = data.response["posts"];
							if(data == undefined){
								alert("Invalid Thread ID: " + document.getElementById("threadInput").value + ". ");
							}
							else{
								responding_text.forEach(function(response_item){
									for(var data_entry = 0 ; data_entry < data.length ; data_entry++){
										if(data[data_entry]["com"] !== undefined && (response_item[1] == data[data_entry]["com"].replace(/(&gt;&gt;|#p)\d+/g, "") || response_item[1] == null)
											&& (response_item[2] == data[data_entry]["md5"] || response_item[2] == null)){
											var start_index = response_item[0][0].legth - response_item[0][1];
											text = text.substring(0, start_index) + ">>" + data[data_entry]["no"] + text.substring(response_item[0][1]);
												break;
										}
										else if(response_item[2] !== undefined && response_item[2] == data[data_entry]["md5"]){
																						var start_index = response_item[0][0].legth - response_item[0][1];
											text = text.substring(0, start_index) + ">>" + data[data_entry]["no"] + text.substring(response_item[0][1]);
												break;
										}
									}
								});
											document.getElementById("qr").getElementsByTagName("TEXTAREA")[0].value = text;
											document.getElementById("add-post").click();
											semaphore_posts++;
							}
						}
					}));
				}
			}
		}));

};


//2) GET ARCHIVED THREAD
var getThread = function(threadNo){
	thread_data = [[], [], [], []];

	if(use_offsite_archive)
		URL  = "https://www.archived.moe/_/api/chan/thread/?board=" + board + "&num=" + document.getElementById("threadInput").value;
	else
		URL  = "https://a.4cdn.org/" + board + "/thread/" + document.getElementById("threadInput").value + ".json";
	var xhr = new GM_xmlhttpRequest(({
		method: "GET",
		url: URL,
		responseType : "json",
		onload: function(data){
			var starting_post = -1;
			if(use_offsite_archive){
				starting_post = 0;
				data = data.response["" + document.getElementById("threadInput").value];
			}
			else{
				starting_post = 1;
				data = data.response;
			}
			if(data == undefined){
				alert("Invalid Thread ID: " + threadNo + ".\n4chan Archive ");
			}
			else{
				if(use_offsite_archive) data["posts"] = Object.values(data["posts"]);
				var len = data["posts"].length;

				for(var post_number = starting_post ; post_number < len ; post_number++){
					var comment = undefined;
					////console.log(data["posts"][post_number]);
					if(use_offsite_archive)
						comment = data["posts"][post_number]["comment"];
					else
						comment = data["posts"][post_number]["com"];
					if(comment !== undefined && comment !== null)
						thread_data[0].push(comment);
					else
						thread_data[0].push("");

					var filename = undefined;
					if(use_offsite_archive){
						if(data["posts"][post_number]["media"] !== null)
							filename = "" + data["posts"][post_number]["media"]["media_filename"];
					}
					else
						filename = "" + data["posts"][post_number]["tim"] + data["posts"][post_number]["ext"];

					if(filename !== undefined && filename !== null && filename.indexOf("undefined") == -1)
						if(use_offsite_archive)
							if(data["posts"][post_number]["media"] !== null)
								thread_data[1].push(data["posts"][post_number]["media"]["remote_media_link"]);
							else  thread_data[1].push("");
						else
							thread_data[1].push("https://i.4cdn.org/" + board + "/" + filename);
					else  thread_data[1].push("");
//console.log(data["posts"][post_number]["tim"]); //console.log(data["posts"][post_number]["ext"]); //console.log(data["posts"][post_number]);
//console.log(filename); //console.log("0000");
					if(use_offsite_archive){
						if(data["posts"][post_number]["media"] !== null)
							thread_data[2].push(data["posts"][post_number]["media"]["media_id"]);
					}
					else
						thread_data[2].push(data["posts"][post_number]["filename"]);

					if(use_offsite_archive)
						thread_data[3].push(data["posts"][post_number]["num"]);
					else
						thread_data[3].push(data["posts"][post_number]["no"]);
				}
			}
			semaphore--;
		}
	}));
};
//3) RIP POSTS AND IMAGES
var createPost = function(text, imageURL, imageName){
	////console.log(text + "," + imageURL + "," + imageName)
	if(imageURL != ""){
		var response_type = "arraybuffer";
		if(use_offsite_archive) response_type = "text"
		var xhr = new GM_xmlhttpRequest(({
			method: "GET",
			url: imageURL,
			responseType : response_type,
			onload: function(response)
			{
				if(use_offsite_archive){
					var parser = new DOMParser();
					var content_attribute = parser.parseFromString(response.response, "text/html").getElementsByTagName("META")[0].getAttribute("content");
					var redirect_url = content_attribute.substring(content_attribute.indexOf("http"));
					var xhr = new GM_xmlhttpRequest(({method:"GET", url: redirect_url, responseType:"arraybuffer",
						onload:function(response){
							//console.log(text + " " + imageURL);
							inputImage(response, text,  imageURL, imageName);
						}
					}));
				}
				else{
					//console.log(text + " " + imageURL);
					inputImage(response, text, imageURL, imageName);
				}
			}
		}));
	}
	else{
		text = createPostComment(text);
		setPropperLinking(text);
	}
};

function inputImage(response, text, imageURL, imageName){
				var blob;
				var ext = ".jpg";
				if(imageURL.indexOf(".jpg") > -1){
					blob = new Blob([response.response], {type:"image/jpeg"});
					ext = ".jpg";
				}
				else if(imageURL.indexOf(".png") > -1){
					blob = new Blob([response.response], {type:"image/png"});
					ext = ".png";
				}
				else if(imageURL.indexOf(".gif") > -1){
					blob = new Blob([response.response], {type:"image/gif"});
					ext = ".gif";
				}
				else if(imageURL.indexOf(".webm") > -1){
					blob = new Blob([response.response], {type:"video/webm"});
					ext = ".webm";
				}

				var name = imageName + ext;

				//SEND RESULTING RESPONSE TO 4CHANX FILES === QRSetFile
				var detail = {file:blob, name:name};
				if (typeof cloneInto === 'function') {
					detail  = cloneInto(detail , document.defaultView);
				}

				document.dispatchEvent(new CustomEvent('QRSetFile', {bubbles:true, detail}));

				if(text !== "" && text !== undefined) {
					text = createPostComment(text);
					setPropperLinking(text);
				}
				else{
					document.getElementById("add-post").click();
					semaphore_posts++;
				}
}

//4) CREATE POST QUEUE
var createPostComment = function(text){
	var dummy = document.createElement("DIV");
	dummy.innerHTML = text;
	var inside_node = dummy.firstChild;
	var return_text = "";
	do{
		if(inside_node.tagName == "BR")
			return_text += "\n";
		else
			return_text += inside_node.textContent;
	}while((inside_node = inside_node.nextSibling));


	return return_text;
};

var checked = false;
var timeListenerFunction = function(){
	var time = document.getElementById("qr-filename-container").nextSibling.value.replace(/[a-zA-Z]+/g, "");
	if(time  <= 5){
		checked = false;
	}
	else if(time > 5){
		checked = true;
	}
};

document.addEventListener('QRPostSuccessful', function(e) {
	if(in_sequence){
		document.getElementById("dump-list").childNodes[1].click();
		setPropperLinking(document.getElementById("qr").getElementsByTagName("TEXTAREA")[0].value);
	}
}, false);


function killAll(){
	thread_data_length = 0;
	posts_created = 0;
	stopRoutine();
	postID = "";
	semaphore = 1;
	semaphore_posts = 1;
	stopFillRoutine();
	fillID  = "";
	thread_data = [['Comment'], ['Image URLs'], ['Image Names'] ,['Post No.']];
	//CLEAR DUMP LIST
	var qr_dumplist = document.getElementById("dump-list").childNodes;
	var qr_dumplist_len = qr_dumplist.length;
	var current_preview = 0;
	while(qr_dumplist_len - current_preview > 1){
		qr_dumplist[0].firstChild.click();
		current_preview++;
	}
}

