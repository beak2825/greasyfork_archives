// ==UserScript==
// @name         Danbooru-Image-Adder
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Add images to posts
// @author       ECHibiki /qa/
// @match *://boards.4chan.org/*
// @grant         GM_xmlhttpRequest
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/31215/Danbooru-Image-Adder.user.js
// @updateURL https://update.greasyfork.org/scripts/31215/Danbooru-Image-Adder.meta.js
// ==/UserScript==

function alert4ChanX(message, type, time){
	if(time == undefined) time = 10;
    var detail = {type: type, content: message, lifetime: time};
    if (typeof cloneInto === 'function') {
        detail = cloneInto(detail, document.defaultView);
    }
    var event = new CustomEvent('CreateNotification', {bubbles: true, detail: detail});
    document.dispatchEvent(event);
}

var number_of_posts = 0;
var page_number;
var json_page;
var json_tag;
var smallest_tag_size;

var top_page_max =  10000000;
var top_page = top_page_max;
var maximum_attempts = 20;
var number_of_attempts = maximum_attempts ;

var img_URL = "";
var send_URL = "";
var old_tags_before_change = "";

var timeout = false;
var failed_to_find_required_tags_state = false;
var tag_incorrect_state = false;
var tool_top_visible = false;

var time_max = 10;
var time = time_max;
var intervalFunction;
var timeout_functions = [];
var json_page_numbers_used = Array();
var previous_images = [];
var taggingFunction;

window_displayed = false;

var help_icon_source = " data:image/jpeg;base64,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"


//set listeners to build interface in 4chanX
var loaded = false;
document.addEventListener("QRDialogCreation", function(e){
		//create custom interface
		enhance4ChanX();
		//ENHANCE DUMP TABS (COVER, 482PX - 482PX)
		//DUMP LIST MAX-HEIGHT TO 490
		
		var width = parseInt(localStorage.getItem("width_DIA"));		
		var qr_width = parseInt(localStorage.getItem("qr_width_DIA"));		
		var height = parseInt(localStorage.getItem("height_DIA"));	
	
		if(width === null) width = 400;
		if(qr_width === null) width = 480;
		if(height === null) height = 400;

		document.getElementById("fourchanx-css").textContent += ".qr-preview { height:" +  height + "px; width: " + width +  "px; left:8%;background-size: cover;}";
		document.getElementById("fourchanx-css").textContent += "#dump-list { min-height: " + (width - 20) +  "px; width: " + (qr_width) + "px;}";

}, false);

document.addEventListener("4chanXInitFinished", imageAdderButton);

//Alter 4chanX interface
var enhance4ChanX = function(){
    var qr_window = document.getElementById("qr");

    //check if elements already exist
	/*Probably Depreciated*/
    // if(document.getElementById("qrImages") !== null){
        // qr_window.removeChild(document.getElementById("qrImages"));
        // clearInterval(taggingFunction);
        // //4chanx autodeletes images
        // clearImage();
    // }
	
    var imagedump_opener = document.getElementById("dump-button");
    if(imagedump_opener !== null){imagedump_opener.click();}
    else{return;}

    var imagedump_file_list = document.getElementById("dump-list");
    var filename_container = document.getElementById("qr-filename-container");

    //used for setting and unsetting high resolution thumbs for dump list.
    var dumplist_image = "";
    var previous_dumplist_image = "";
    var observer = new MutationObserver(function(mutate){
        dumplist_image = imagedump_file_list.firstChild.style.backgroundImage;
        if(dumplist_image !== previous_dumplist_image && img_URL !== ""){
            imagedump_file_list.firstChild.style.backgroundImage = "url(" + img_URL + ")";
            previous_dumplist_image = imagedump_file_list.firstChild.style.backgroundImage;
        }
        else if (img_URL == ""){
        }
    });
    observer.observe(imagedump_file_list , {attributes: true,subtree:true, chilimagedump_file_list: true, characterData: true });
    //make the image clear button clear images;
    document.getElementById("qr-filerm").addEventListener("click", clearImage);

    //image setting html elements.
    var qr_image_adder_table = document.createElement("TABLE");
    qr_image_adder_table.setAttribute("id", "qrImages");
    qr_image_adder_table.setAttribute("style", "text-align:center");
    qr_window.appendChild(qr_image_adder_table);

    var options_row = document.createElement("TR");
    options_row.setAttribute("ID", "or");
    options_row.setAttribute("style", "margin:5px;");
    qr_image_adder_table.appendChild(options_row);
    var checkbox_safe = document.createElement("INPUT");
    checkbox_safe.setAttribute("id", "safe");
    checkbox_safe.setAttribute("type", "checkbox");
    var checkbox_safe_text  = document.createTextNode("Safe");
    var checkbox_questionable= document.createElement("INPUT");
    checkbox_questionable.setAttribute("id", "questionable");
    checkbox_questionable.setAttribute("type", "checkbox");
    var checkbox_questionable_text= document.createTextNode("Questionable");
    var checkbox_explicit = document.createElement("INPUT");
    checkbox_explicit.setAttribute("id", "explicit");
    checkbox_explicit.setAttribute("type", "checkbox");
    var checkbox_explicit_text = document.createTextNode("Explicit");

    options_row.appendChild(checkbox_safe_text);
    options_row.appendChild(checkbox_safe);
    options_row.appendChild(checkbox_questionable_text);
    options_row.appendChild(checkbox_questionable);
    options_row.appendChild(checkbox_explicit_text);
    options_row.appendChild(checkbox_explicit);

	option_text_size = "18";

    var image_tagging_row = document.createElement("TR");
	
	var help_icon_container = document.createElement("A");
	help_icon_container.href = "javascript:void(0)";
	help_icon_container.title = "Click to View Help!";
	var help_icon = document.createElement("IMG");
	help_icon.setAttribute("style", "height:" + option_text_size * 1.25 + "px;margin:-4px 10px");
	help_icon.src = help_icon_source;

	help_icon_container.appendChild(help_icon);
	image_tagging_row.appendChild(help_icon_container);

	var tooltip_div = document.createElement("DIV");
	tooltip_div.innerHTML = "Insert Tags to search from danbooru in the text box to the side.<br/>The URL for the image will be bellow. Some browsers such as chrome allow you to select this text<br/>Do Not Use \"order:\" tags<br/>Do Not Use \"rating:\" tags<br/>For more speed uncheck all boxes!<hr/>Submit bugs to <a href='https://github.com/ECHibiki/4chan-UserScripts'>my Github</a>";
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
        document.createTextNode("Tags: "),
        document.createElement("INPUT"),
        document.createElement("INPUT"),
        document.createElement("A"),
        document.createElement("INPUT"),
    ];
    second_row_nodes.forEach(
        function(node){
            image_tagging_row.appendChild(node);
        });
    qr_image_adder_table.appendChild(image_tagging_row);

    var auto_complete_row = document.createElement("TR");
    auto_complete_row.setAttribute("ID", "acr");
    auto_complete_row.setAttribute("style", "margin:5px;");
    qr_image_adder_table.appendChild(auto_complete_row);

    second_row_nodes[1].setAttribute("ID", "tags");
    second_row_nodes[1].setAttribute("style", "width:44.9%;"+"font-size:" + option_text_size + "px");
    second_row_nodes[3].setAttribute("ID", "timer");
    second_row_nodes[3].setAttribute("style", "width:20%;margin:0 5px");
    second_row_nodes[4].setAttribute("ID", "urlContainer");
    second_row_nodes[4].setAttribute("style", "width:75%;margin:5px -25px");
    second_row_nodes[4].setAttribute("disabled", "");

    var tag_input_node = second_row_nodes[1];

    second_row_nodes[2].setAttribute("ID", "imageButton");
    second_row_nodes[2].setAttribute("type", "button");
    second_row_nodes[2].setAttribute("value", "Set Image");

    //event listener logic
    second_row_nodes[2].addEventListener("click", buttonClickFunction);

	//textarea expansion;
	qr_window.getElementsByTagName("TEXTAREA")[0].style.width = "110%";
    //ping every 0.5s for changes
    taggingFunction = setInterval(
        function(){setTagInterface(tag_input_node, auto_complete_row, second_row_nodes);},
        500);
	qr_window.appendChild(document.createElement("hr"));
};

//settings for time expiration on image hiding
function imageAdderWindow(){
    var style = document.createElement('style');
    style.innerHTML = ".inputs{background-color:rgb(200,200,200);margin:5px 7px;width:100px;}";
    document.body.appendChild(style);

    var background_div = document.createElement("div");
    background_div.setAttribute("style", "border:solid 1px black;position:fixed;width:100%;height:100%;background-color:rgba(200,200,200,0.3);top:0;left:0;display:none; z-index:9");
    background_div.setAttribute("id", "image_adder_Background");
    document.body.appendChild(background_div);
    background_div.addEventListener("click", imageAdderToggle);

    var window_div = document.createElement("div");
    window_div.setAttribute("style", "border:solid 1px black;position:fixed;width:400px;background-color:rgb(200,200,200);left:40%;top:20%;margin-bottom:0;  display:none; z-index:10");
    window_div.setAttribute("id", "image_adder_Window");

    var close_div = document.createElement("div");
    close_div.setAttribute("style", "border:solid 1px black;position:absolute;width:25px;height:25px;background-color:rgba(255,100,90,0.9); right:3px;top:3px; z-index:10");
    close_div.addEventListener("click", imageAdderToggle);
    window_div.appendChild(close_div);

    var title_para = document.createElement("p");
    title_para.setAttribute("style", "margin-left:5px;margin-top:5px");
    var title_text = document.createTextNode("Image Adder Settings");
    title_para.appendChild(title_text);
    window_div.appendChild(title_para);

    var container_div = document.createElement("div");
    container_div.setAttribute("style","background-color:white;margin:auto;padding:5px;");
    window_div.appendChild(container_div);
	
	var radio_table = document.createElement("TABLE")
	radio_table.setAttribute("style", "text-align:center;margin-left:5px");

	var v_large_row = document.createElement("TR");
	var v_large_label_col = document.createElement("TD");
    var v_large_label = document.createElement("label");
    var v_large_text = document.createTextNode("Very Large: ");//489
    v_large_label.appendChild(v_large_text);
	v_large_label_col.appendChild(v_large_label);
    v_large_row.appendChild(v_large_label_col);
	var v_large_radio_col = document.createElement("TD");
    var v_large_input = document.createElement("input");
    v_large_input.setAttribute("id", "v_large");
	v_large_input.setAttribute("type", "radio");
	v_large_input.setAttribute("name", "preivew-size");
	v_large_input.setAttribute("style", "display:inline");	
	v_large_radio_col.appendChild(v_large_input);
	v_large_row.appendChild(v_large_radio_col);
	v_large_input.addEventListener("click", function(){
		document.getElementById("width_DIA").value = 489;
		document.getElementById("height_DIA").value = 489;
	});

	radio_table.appendChild(v_large_row);
	
	var large_row = document.createElement("TR");
	var large_label_col = document.createElement("TD");
    var large_label = document.createElement("label");
    var large_text = document.createTextNode("Large: ");//400
    large_label.appendChild(large_text);
	large_label_col.appendChild(large_label);
    large_row.appendChild(large_label_col);
	var large_radio_col = document.createElement("TD");
    var large_input = document.createElement("input");
    large_input.setAttribute("id", "large");
	large_input.setAttribute("type", "radio");
	large_input.setAttribute("name", "preivew-size");
	large_input.setAttribute("style", "display:inline");	
	large_radio_col.appendChild(large_input);
	large_row.appendChild(large_radio_col);
	large_input.addEventListener("click", function(){
		document.getElementById("width_DIA").value = 400;
		document.getElementById("height_DIA").value = 400;
	});
	
	radio_table.appendChild(large_row);
	
	var medium_row = document.createElement("TR");
	var medium_label_col = document.createElement("TD");
    var medium_label = document.createElement("label");
    var medium_text = document.createTextNode("Medium: ");//300
    medium_label.appendChild(medium_text);
	medium_label_col.appendChild(medium_label);
    medium_row.appendChild(medium_label_col);
	var medium_radio_col = document.createElement("TD");
    var medium_input = document.createElement("input");
    medium_input.setAttribute("id", "medium");
	medium_input.setAttribute("type", "radio");
	medium_input.setAttribute("name", "preivew-size");
	medium_input.setAttribute("style", "display:inline");	
	medium_radio_col.appendChild(medium_input);
	medium_row.appendChild(medium_radio_col);
	medium_input.addEventListener("click", function(){
		document.getElementById("width_DIA").value = 300;
		document.getElementById("height_DIA").value = 300;
	});

	radio_table.appendChild(medium_row);
	
	var small_row = document.createElement("TR");
	var small_label_col = document.createElement("TD");
    var small_label = document.createElement("label");
    var small_text = document.createTextNode("Very Large: ");//200
    small_label.appendChild(small_text);
	small_label_col.appendChild(small_label);
    small_row.appendChild(small_label_col);
	var small_radio_col = document.createElement("TD");
    var small_input = document.createElement("input");
    small_input.setAttribute("id", "small");
	small_input.setAttribute("type", "radio");
	small_input.setAttribute("name", "preivew-size");
	small_input.setAttribute("style", "display:inline");	
	small_radio_col.appendChild(small_input);
	small_row.appendChild(small_radio_col);
	small_input.addEventListener("click", function(){
		document.getElementById("width_DIA").value = 200;
		document.getElementById("height_DIA").value = 200;
	});
	
	radio_table.appendChild(small_row);
	
	var width_row = document.createElement("TR");
	var width_label_col = document.createElement("TD");
    var width_label = document.createElement("label");
    var width_text = document.createTextNode("Width: ");//W
    width_label.appendChild(width_text);
	width_label_col.appendChild(width_label);
    width_row.appendChild(width_label_col);
	var width_radio_col = document.createElement("TD");
    var width_input = document.createElement("input");
    width_input.setAttribute("id", "width_DIA");
	width_input.setAttribute("type", "text");
	width_input.setAttribute("name", "preivew-size");
	width_input.setAttribute("style", "width:20%");		
	width_radio_col.appendChild(width_input);
	width_row.appendChild(width_radio_col);
	var width = localStorage.getItem("width_DIA");
	if(width === null) width = 400;
	width_input.setAttribute("value", width);
		
	radio_table.appendChild(width_row);
	
	var height_row = document.createElement("TR");
	var height_label_col = document.createElement("TD");
    var height_label = document.createElement("label");
    var height_text = document.createTextNode("Height: ");//H
    height_label.appendChild(height_text);
	height_label_col.appendChild(height_label);
    height_row.appendChild(height_label_col);
	var height_radio_col = document.createElement("TD");
    var height_input = document.createElement("input");
    height_input.setAttribute("id", "height_DIA");
	height_input.setAttribute("type", "text");
	height_input.setAttribute("name", "preivew-size");
	height_input.setAttribute("style", "width:20%");	
	height_radio_col.appendChild(height_input);
	height_row.appendChild(height_radio_col);
	var height = localStorage.getItem("height_DIA");
	if(height === null) height = 400;
	height_input.setAttribute("value", height);
	
	radio_table.appendChild(height_row);
	
	container_div.appendChild(radio_table);	
	container_div.appendChild(document.createElement("hr"));
	
    var qr_width_label = document.createElement("label");
    var qr_width_text = document.createTextNode("Quick Reply Min Width: ");//H
    qr_width_label.appendChild(qr_width_text);
    var qr_width_input = document.createElement("input");
    qr_width_input.setAttribute("id", "qr_width_DIA");
	qr_width_input.setAttribute("type", "text");
	qr_width_input.setAttribute("name", "preivew-size");
	qr_width_input.setAttribute("style", "width:20%");
	var qr_width = localStorage.getItem("qr_width_DIA");
	if(qr_width === null) qr_width = 480;
	qr_width_input.setAttribute("value", qr_width);

	
	container_div.appendChild(qr_width_label);
	container_div.appendChild(qr_width_input);
	container_div.appendChild(document.createElement("hr"));
	
    var set_button = document.createElement("input");
    set_button.setAttribute("type", "button");
    set_button.setAttribute("id", "setTime");
    set_button.setAttribute("value", "Set Preview Size");
	
    set_button.addEventListener("click", function(){
        if (storageAvailable('localStorage')) {
			var width = parseInt(document.getElementById("width_DIA").value);	
            localStorage.setItem("width_DIA", width);
			
			var qr_width = parseInt(document.getElementById("qr_width_DIA").value);	
            localStorage.setItem("qr_width_DIA", qr_width);
			
			var height = parseInt(document.getElementById("height_DIA").value);	
            localStorage.setItem("height_DIA", height);
	
			if(width === null) width = 400;
			if(qr_width === null) qr_width = 480;
			if(height === null) height = 400;

			document.getElementById("fourchanx-css").textContent += ".qr-preview { height:" +  height + "px; width: " + width +  "px; left:8%;background-size: cover;}";
			document.getElementById("fourchanx-css").textContent += "#dump-list { min-height: " + (width - 20) +  "px; width: " + (qr_width) + "px;}";

			imageAdderToggle();
        }
    });
    container_div.appendChild(set_button);

    document.body.appendChild(window_div);

	if(document.getElementById("width_DIA").value == "489") v_large_input.checked = true;	
	if(document.getElementById("width_DIA").value == "400") large_input.checked = true;
	if(document.getElementById("width_DIA").value == "300") medium_input.checked = true;
	if(document.getElementById("width_DIA").value == "200") small_input.checked = true;
	
}


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

function imageAdderToggle(){
    if(window_displayed){
        document.getElementById("image_adder_Window").style.display = "none";
        document.getElementById("image_adder_Background").style.display = "none";
        window_displayed = false;
    }
    else{
        document.getElementById("image_adder_Window").style.display = "inline-block";
        document.getElementById("image_adder_Background").style.display = "inline-block";
        window_displayed = true;
    }
}

function imageAdderButton(){
    var image_adder__button = document.createElement("input");
    image_adder__button.setAttribute("Value", "Image Adder Settings");
    image_adder__button.setAttribute("type", "button");
    image_adder__button.setAttribute("style", "position:absolute;top:135px");
    imageAdderWindow();
    if(document.body === null){
        setTimeout(imageAdderButton, 30);
    }
    else{
        document.body.appendChild(image_adder__button);
        image_adder__button.addEventListener("click", imageAdderToggle);
    }
}

//on setimage click clear flags, timers and start another search
function buttonClickFunction(){
	json_page_numbers_used = Array();
	//reset a failed_to_find_required_tags boolean
	primed_for_fail = false;
	for(var i = 0 ; i < timeout_functions.length; i++){
		clearInterval(timeout_functions[i]);
	}
	tag_incorrect_state = false;
	timeout = false;
	//freeze interface to prevent mid opperation changes
	document.getElementById("tags").setAttribute("disabled", 1);
	document.getElementById("imageButton").setAttribute("disabled", 1);
	time = time_max;
	timeout_functions.push(setInterval(counterFunction, 1000));
	//start the search
	setImage();
};

//remove the high quallity image from the dump list
function clearImage(){
    var imagedump_file_list = document.getElementById("dump-list");
    imagedump_file_list.firstChild.style.backgroundImage = "url()";//trigger mutation event
    img_URL = ""; //get mutation to set to dead
}

var setTagInterface =  function(tag_input_node, auto_complete_row, second_row_nodes){
    tags = tag_input_node.value;
    if(old_tags_before_change !== tags){
		previous_images = [];

        var tag_carat_position = tag_input_node.selectionStart - 1;
        var closest_tag =  (function(){
            var current_chararcter = tags.charAt(tag_carat_position);
            var i = 0;
            right_most = tag_carat_position;
            while(current_chararcter != " " && current_chararcter != "" && current_chararcter !== undefined){
                i++;
                current_chararcter = tags.charAt(tag_carat_position + i);
                if(current_chararcter != " " && current_chararcter != "") right_most = tag_carat_position + i;
            }
            right_most += 1;
            current_chararcter = tags.charAt(tag_carat_position);
            i = 0;
            leftMost = tag_carat_position;
            while(current_chararcter != " " && current_chararcter != ""  && current_chararcter !== undefined){
                i++;
                current_chararcter = tags.charAt(tag_carat_position - i);
                if(current_chararcter != " " && current_chararcter != "") leftMost = tag_carat_position - i;
            }
            return tags.substring(leftMost, right_most);
        })();
        var xhr = new GM_xmlhttpRequest(({
            method: "GET",
            url: "https://danbooru.donmai.us/tags.json?search[name_matches]=" + closest_tag + "*&search[order]=count",
            responseType : "json",
            onload: function(data){
                data = data.response;
                var tagArray = tags.split(" ");
                while (auto_complete_row.hasChildNodes()) {
                    auto_complete_row.removeChild(auto_complete_row.lastChild);
                }
                var qr_width = document.getElementById("qr").offsetWidth;

				var tag_table = document.createElement("TABLE");
				tag_table.setAttribute("style", "border:1px solid black;margin-top:5px");
				var tag_row = document.createElement("TR");
                for (var i = 0 ; i < 5 ; i++){
                    var a  = document.createElement("A");
                    var tagText = data["" + i];
                    if(tagText == "" || tagText === undefined) break;
                    tagText = tagText["name"];

                    var a_txt  = document.createTextNode(data[i]["name"]);
					var tag_data = document.createElement("TD");
					tag_data.setAttribute("style", "padding:5px;font-size:15px;font-weight:bold;border:1px solid black;");
					a.appendChild(a_txt);
					tag_data.appendChild(a);
					tag_row.appendChild(tag_data);
					tag_table.appendChild(tag_row);
					auto_complete_row.appendChild(tag_table);

                    if(tag_table.offsetWidth > qr_width - 10){
						tag_row.removeChild(tag_data);
						tag_table = document.createElement("TABLE");
						tag_row = document.createElement("TR");

						tag_row.appendChild(tag_data);
						tag_table.appendChild(tag_row);
						tag_table.setAttribute("style", "border:1px solid black;");
						auto_complete_row.appendChild(tag_table);

					}
                    a.addEventListener("click", function(evt){
                        tagArray[tagArray.indexOf(closest_tag)] = this.textContent;
                        second_row_nodes[1].value = tagArray.join(" ");
                    });
                }
            }}));
    }
    old_tags_before_change =  tag_input_node.value;
};

//a series of calls on other functions that leads to the image being searched for
var setImage = function(){
    //Set image tags.
    var tags = document.getElementById("tags").value.trim();

    if(tags.indexOf(":") > -1) {
        alert4ChanX("Character ':' not used for file characteristic searches", "warning");
    }
    tags = tags.split(" ");

    var xhr_image_load = new GM_xmlhttpRequest(({
        method: "GET",
        //returns a list of all tags and their properties
        url: "https://danbooru.donmai.us/tags.json?search[name]=" + tags.join() + "&search[order]=count",
        responseType : "json",
        onload: function(data)
        {
            verifyTags(data, tags);
			if(failed_to_find_required_tags_state) return;

            //set the end
            var end_URL = ratingURL(tags, json_tag);

            var URL = setPostAndPage(end_URL, tags);
            send_URL = URL;
            //final check, sends final request after function or calls this function again
            getJSON(URL, checkPageFromDanbooru, tags);
        }}));
};
//make 4chanX alerts on issues, and account for error cases.
function verifyTags(data, tags){
    data = data.response;
	//if data is blank, use a no-tag approach
    if(tags.length == 1 && tags[0] == "") json_tag = [{"name":""}];
    else json_tag = data;
	failed_to_find_required_tags_state = false;
	//if data has a null or undefined case, return an error
    if(data.length == 0){
        alert4ChanX("All tags incorrect", "error");
		failed_to_find_required_tags_state = true;
		document.getElementById("timer").textContent = "";
		document.getElementById("tags").removeAttribute("disabled");
		document.getElementById("imageButton").removeAttribute("disabled");
        return;
    }
	else if(data.length != tags.length && !tag_incorrect_state){
		tag_incorrect_state = true;
		if(document.getElementById("tags").value.trim() == "") alert4ChanX("No Tags", "info", 2);
		else alert4ChanX("One Tag Incorrect", "warning");
	}
    //tag size. Smallest tag is placed at bottom of JSON
    smallest_tag_size = parseInt(data[data.length-1]["post_count"]);
}

//evaluate the rating restrictions to account for danbooru's tagging limitations
var ratingURL = function(tags, data){
    var URL = "";
	//evaluate the 3! possible permutations
    if(document.getElementById("safe").checked){
        if(document.getElementById("questionable").checked){
            if(document.getElementById("explicit").checked){
                if(data.length > 1)  URL =  "&utf8=%E2%9C%93&tags=" + data[data.length-2]["name"] + "+" + data[data.length-1]["name"];
                else  URL =  "&utf8=%E2%9C%93&tags=" + data[data.length-1]["name"];
            }
            else{
                URL =  "&utf8=%E2%9C%93&tags=" + "-rating%3Aexplicit" + "+" + data[data.length-1]["name"];
            }
        }
        else if(document.getElementById("explicit").checked){
            URL = "&utf8=%E2%9C%93&tags=" + "-rating%3Aquestionable" + "+" + data[data.length-1]["name"];
        }
        else{
            URL = "&utf8=%E2%9C%93&tags=" + "rating%3Asafe" + "+" + data[data.length-1]["name"];
        }
    }
    else if(document.getElementById("questionable").checked){
        if(document.getElementById("explicit").checked){
            URL =  "&utf8=%E2%9C%93&tags=" + "-rating%3Asafe" + "+" + data[data.length-1]["name"];
        }
        else{
            URL =  "&utf8=%E2%9C%93&tags=" + "rating%3Aquestionable" + "+" + data[data.length-1]["name"];
        }
    }
    else if(document.getElementById("explicit").checked){
        URL =  "&utf8=%E2%9C%93&tags=" + "rating%3Aexplicit" + "+" + data[data.length-1]["name"];
    }
    else{
        if(data.length > 1)  URL =  "&utf8=%E2%9C%93&tags=" + data[data.length-2]["name"] + "+" + data[data.length-1]["name"];
        else  URL = "&utf8=%E2%9C%93&tags=" + data[data.length-1]["name"];
    }
    return URL;
};

//set where to search
var setPostAndPage = function(end_URL, tags){
	//posts
	if(number_of_posts > 0)
    number_of_posts = 0;
   //page
	if(top_page != top_page_max) smallest_tag_size = top_page * 20;
    if(smallest_tag_size == 0) smallest_tag_size = 100;
	do{
		escape_cond = true;
		page_number = ((Math.floor(Math.random() * 10000)) % Math.ceil(smallest_tag_size / 20)) % 1000;    //1000 is max page search limit
		json_page_numbers_used.forEach(function(page){
			if(page == 0){
				primed_for_fail = true; // no more pages to search and looped once
				escape_cond = true;
				return;
			}
			else if(page == page_number){
				escape_cond = false;
				return;
			}
		});
	} while(!escape_cond);
	json_page_numbers_used.push(page_number);

    var URL = "https://danbooru.donmai.us/posts.json?page=" + page_number + end_URL;
    return URL;
};

//check if valid url location
var primed_for_fail = false;
var checkPageFromDanbooru = function(err, data, tags){
	if (err != null) {
		console.log('Something went wrong: ' + err);
		alert4ChanX("Danbooru Server Did Not Perform request -- Error: "  + err, "error");
		reset_search_timer_fields();
		page_number = 0;
	}
	else {
		do{
			var duplicate = false;
			//check for repeating images found
			previous_images.forEach(function(item){
				if(item[0] == page_number && item[1] == number_of_posts){
					duplicate = true;
				}
				number_of_posts++;
			});
		}while(duplicate == false && previous_images < number_of_posts);

		if(primed_for_fail){
			alert4ChanX("No Results: All found for tags \"" + document.getElementById("tags").value + "\"", "error");
			reset_search_timer_fields();
			return;
		}
		//redo
		else if((data.length < number_of_posts+1) && number_of_attempts > 0) {
			if(top_page > page_number){
				top_page = page_number + number_of_posts / 20;
			}
			number_of_attempts--;
			document.getElementById("timer").textContent = number_of_attempts + "|" + time;
			setImage();
		}
		//process page
		else if (number_of_attempts > 0){
			//ALL PARAMETERS WILL BE RESET INSIDE JSON
			document.getElementById("timer").textContent =  number_of_attempts + "|" + time;
			getJSON(send_URL, setImageFromDanbooru, tags);
		}
		else{
			alert4ChanX("Not found", "error");
			reset_search_timer_fields();
			return;
		}
	}
};

function reset_search_timer_fields(){
	top_page = top_page_max;
	number_of_attempts = maximum_attempts;
	document.getElementById("timer").textContent = "";
	document.getElementById("tags").removeAttribute("disabled");
	document.getElementById("imageButton").removeAttribute("disabled");
}

//finally draw from the JSON page to generate and place the post into the 4chanX dumplist
var setImageFromDanbooru = function(err, data, tags){
    if (err != null) {
        console.log('Something went wrong: ' + err);
        alert4ChanX("Danbooru Server Did Not Perform request -- Error: "  + err, "error");
		reset_search_timer_fields();
    }
    else {
		json_page = data;
		var image_found = false;
		for (number_of_posts = number_of_posts; number_of_posts < 20 ; number_of_posts++){
			if(timeout){
				//Case1: Took too long to scan the page.
				//Result: Kills search
				alert4ChanX("timeout after " + time +" seconds", "error");
				clearInterval(counterFunction);
				reset_search_timer_fields();
				return;
			}
			else if(json_page["" + number_of_posts] == undefined){
				//Case2: reaches an undefined page.
				//Result: Switches to a new page
				top_page = page_number;
				number_of_attempts--;
				setImage();
				return;
			}

			//set the page to search
			var end_URL = json_page["" + number_of_posts].file_url;
			var URL = "https://danbooru.donmai.us" + end_URL;
			if(RegExp("(raikou|hijiribe)\d*\.").test(end_URL))
				URL = end_URL;

			//place url in visible box
			urlContainterFunction(URL);

			/*


:{id: 3038118, created_at: "2018-03-02T15:27:56.469-05:00", uploader_id: 49091, score: 6,…}
approver_id:null
bit_flags:0
children_ids:null
created_at:"2018-03-02T15:27:56.469-05:00"
down_score:0
fav_count:10
fav_string:"fav:553974 fav:467363 fav:455311 fav:490034 fav:505064 fav:482030 fav:351935 fav:66907 fav:467355 fav:519151"
file_ext:"jpg"
file_size:30492
file_url:"/data/__miyuki_kantai_collection_drawn_by_kumadano__7a12a196cc1aa9f794bca81a2a14bb81.jpg"
has_active_children:false
has_children:false
has_large:false
has_visible_children:false
id:3038118
image_height:800
image_width:450
is_banned:false
is_deleted:false
is_flagged:false
is_note_locked:false
is_pending:false
is_rating_locked:false
is_status_locked:false
large_file_url:"/data/__miyuki_kantai_collection_drawn_by_kumadano__7a12a196cc1aa9f794bca81a2a14bb81.jpg"
last_comment_bumped_at:null
last_commented_at:null
last_noted_at:null
md5:"7a12a196cc1aa9f794bca81a2a14bb81"
parent_id:null
pixiv_id:null
pool_string:""
preview_file_url:"/data/preview/7a12a196cc1aa9f794bca81a2a14bb81.jpg"
rating:"s"
score:6
source:"https://twitter.com/kumadano/status/969629578137251840"
tag_count:28
tag_count_artist:1
tag_count_character:1
tag_count_copyright:1
tag_count_general:24
tag_count_meta:1
tag_string:"1girl black_legwear blue_sailor_collar blue_skirt brown_eyes brown_hair commentary_request full_body grin kantai_collection kumadano miyuki_(kantai_collection) pleated_skirt ribbon sailor_collar school_uniform serafuku short_hair short_sleeves simple_background skirt smile socks solo standing wavy_hair white_background wrists_extended"
tag_string_artist:"kumadano"
tag_string_character:"miyuki_(kantai_collection)"
tag_string_copyright:"kantai_collection"
tag_string_general:"1girl black_legwear blue_sailor_collar blue_skirt brown_eyes brown_hair full_body grin pleated_skirt ribbon sailor_collar school_uniform serafuku short_hair short_sleeves simple_background skirt smile socks solo standing wavy_hair white_background wrists_extended"
tag_string_meta:"commentary_request"
up_score:6
updated_at:"2018-03-03T09:09:32.357-05:00"
uploader_id:49091
uploader_name:"---"

			*/

			var failed_to_find_required_tags = false;
			if(end_URL === undefined ||
			   end_URL.indexOf(".mp4") > -1 || end_URL.indexOf(".webm") > -1 || end_URL.indexOf(".swf") > -1 || end_URL.indexOf(".zip") > -1){
				continue;
			}
			else{
				tags.forEach(function(tag){
					//if tag contains an order then whatever
					if(tag.indexOf("order:") > -1);
					//if it contains a raiting, check the rating character at the seventh index
					else if(tag.indexOf("rating:") > -1){
						if(tag.charAt(7) !== json_page["" + number_of_posts]["rating"]){
							failed_to_find_required_tags = true;
						}
					}
					//otherwise check if the tagstring contains the tags
					else if(json_page["" + number_of_posts]["tag_string"].indexOf(tag) == -1){
						failed_to_find_required_tags = true;
					}
				});
			}
			if(failed_to_find_required_tags){
				continue;
			}
			else{
				if(json_page["" + number_of_posts].file_size >= 4000000){
					var end_URL = json_page["" + number_of_posts].large_file_url;
					var URL = "https://danbooru.donmai.us" + end_URL;
					if(RegExp("(raikou|hijiribe)\d*\.").test(end_URL))
						URL = end_URL;

				}
				document.getElementById("timer").textContent = "...";
				img_URL = URL;
				var xhr = new GM_xmlhttpRequest(({
					method: "GET",
					url: URL,
					responseType : "arraybuffer",
					onload: function(response)
					{
                        //is it a non existent image?
                        if(response.response.byteLength <= 387){
                            alert4ChanX("Image Does Not Exist on Danbooru(404 error)", "error");
                        }
						reset_search_timer_fields();
						clearInterval(intervalFunction);
						time = time_max;
						var counter = document.getElementById("timer");
						while(counter.hasChildNodes())
							document.getElementById("timer").removeChild(document.getElementById("timer").lastChild);

						var blob;
						if(end_URL.indexOf(".jpg") > -1)
							blob = new Blob([response.response], {type:"image/jpeg"});
						else if(end_URL.indexOf(".png") > -1)
							blob = new Blob([response.response], {type:"image/png"});
						else if(end_URL.indexOf(".gif") > -1)
							blob = new Blob([response.response], {type:"image/gif"});


						var name = end_URL.replace(/(data|cached)/g, "");
						name = name.replace(/\//g, "");

						//SEND RESULTING RESPONSE TO 4CHANX FILES === QRSetFile
						var detail = {file:blob, name:name};
						if (typeof cloneInto === 'function') {
							detail  = cloneInto(detail , document.defaultView);
						}
						document.dispatchEvent(new CustomEvent('QRSetFile', {bubbles:true, detail}));

					}
				}));
												//end function;
				image_found = true;
								//SET PAGE&POST AS FOUND
				previous_images.push([page_number, number_of_posts]);
				number_of_posts = 9001;
			}
		}
		if(!image_found){
			top_page = page_number;
			number_of_attempts--;
			setImage();
		}
    }
};

var urlContainterFunction = function(url){
    var url_box = document.getElementById("urlContainer");
    url_box.value = url;
};

var counterFunction  = function(){
    if(!timeout){
        time--;
        if(time < 0){
            timeout = true;
            time = time_max;
        }
    }
};

var getJSON = function(url, callback, extra) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        var status = xhr.status;
        if (status == 200) {
            callback(null, xhr.response, extra);
        } else {
            callback(status);
        }
    };
    xhr.send();
};
