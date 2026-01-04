// ==UserScript==
// @name        Tumblr - Mass Posting Photos, Audio, Videos (bot, batch, bulk)
// @namespace   http://script.b9mx.com/tumblr-mass-posting-photos.user.js
// @description On your drafts page, mass upload photos/audio and batch post + external audio/video.
// @include     https://www.tumblr.com/dashboard
// @include     https://www.tumblr.com/blog/*
// @include     https://www.tumblr.com/blog/*/drafts
// @version     2.3.4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/369936/Tumblr%20-%20Mass%20Posting%20Photos%2C%20Audio%2C%20Videos%20%28bot%2C%20batch%2C%20bulk%29.user.js
// @updateURL https://update.greasyfork.org/scripts/369936/Tumblr%20-%20Mass%20Posting%20Photos%2C%20Audio%2C%20Videos%20%28bot%2C%20batch%2C%20bulk%29.meta.js
// ==/UserScript==

// edit this line to change the upload fail time in seconds
window.upload_timeout_seconds = 60;
// if you have a slow internet connection and it takes over a minute to upload an image
// it should be increased, or decreased if your internet is really fast.

window.files_to_upload = [];
window.output = [];
window.first_item = 0;
window.fail_different_types = function(){
	window.files_to_upload = [];
	window.output = [];
	jQuery("#list ul").remove();
}
window.temp_album_art = window.temp_album_art = "//api.tumblr.com/v2/blog/"
		+ jQuery('#search_form input[name=t]').val() + ".tumblr.com/avatar/512";
window.clear_textarea = 1;
window.uploader_switch = function(mode){
	if(mode === 1){
		window.clear_textarea = 1;
		jQuery("#drop_zone").hide();
		jQuery("#list").css("max-height","99999999px");
		jQuery('#list').prepend(
			jQuery("<textarea/>").attr("id","url_list").html(
				"Paste video or externally hosted mp3 file urls list here. " +
				"Separated by commas (,) or new lines." +
				"\nexamples...\n" +
				"http://b9mx.com/audio_external_example/sample_audio_01.mp3\n" +
				"http://b9mx.com/audio_external_example/sample_audio_02.mp3\n" +
				"http://b9mx.com/audio_external_example/sample_audio_03.mp3...\n\n" +
				"\nexamples...\n" +
				"https://www.youtube.com/watch?v=N6SEkcR2-7c\n" +
				"https://www.youtube.com/watch?v=Z4abdhTN6XM\n" +
				"https://www.youtube.com/watch?v=yD20le1nGPs..."
			).focus(function(){
				if(window.clear_textarea===1){
					window.clear_textarea=0;
					jQuery("#url_list").html("");
					jQuery("#url_list").focus();
				}
			}),
			jQuery("<button/>").
				text("Post Video/Audio List").
				addClass("submitbatch").
				click(function(){
					var list = jQuery("#url_list").val().split(/[,\n\r]/);
					for(var i=0; i < list.length; i++){
						var video = list[i];
						window.files_to_upload.push(video);
						window.output.push('<li><strong>',
							video, '</strong>',
							((video.match(/\/[^\/:]+\//)!==null)?
								" (" + video.match(/\/([^\/:]+)\//)[1] + ")":
								" (unknown video host; might error)"
							),
							'</li>'
						);
					}
					jQuery('#list').html('<ul>' + window.output.join('') + '</ul>');
					jQuery("#url_list").remove();
					window.upload_single_video();
				})
		)
		jQuery('#uploader_switcher').text('Click here to switch to: ' + 
			'drag & drop mode...'
		).unbind("click.mode").bind("click.mode", function(){
			window.uploader_switch(2);
		});	
	}
	if(mode === 2){
		jQuery("#drop_zone").show();
		jQuery("#url_list").remove();
		jQuery("#list").css("max-height","200px");
		jQuery('#uploader_switcher').text("Click here to switch to: " + 
			"textarea mode (for external video/audio lists)..."
		).unbind("click.mode").bind("click.mode", function(){
			window.uploader_switch(1);
		});	
	}
}
window.handleFileSelect = function(evt, browse) {
	if(typeof browse === "undefined"){
		evt.stopPropagation();
		evt.preventDefault();
		var files = evt.dataTransfer.files; // FileList object.
	}else{
		var files = evt.files;
	}
	// files is a FileList of File objects. List some properties.
	window.output = [];
	if(files.length===1 && files[0].type.replace(/[\(\)]/g,"").split("/")[0]==="text"){
		if(jQuery.type(window.files_to_upload[0])==="object"){
			window.fail_different_types();
		}
		var text = ""; //placeholder for text output
		var reader = new FileReader();        
		jQuery(reader).load(function (e) {
			text = e.target.result;
			var list = text.split(/[,\n\r]/);
			for(var i=0; i < list.length; i++){
				var video = list[i];
				window.files_to_upload.push(video);
				window.output.push('<li><strong>',
					video, '</strong>',
					((video.match(/\/[^\/:]+\//)!==null)?
						" (" + video.match(/\/([^\/:]+)\//)[1] + ")":
						" (unknown video host; might error)"
					),
					'</li>'
				);
			}
			if(jQuery("#list ul").length === 0)
				jQuery('#list').html('<ul>' + window.output.join('') + '</ul>');
			else
				jQuery("#list ul").append(window.output.join(''));
			if(jQuery("button.submitbatch").length === 0){
				jQuery('#list').prepend(
					jQuery("<button/>").
						text("Post Video/Audio List").
						addClass("submitbatch").
						click(window.upload_single_video),
					jQuery("<button/>").
						html("Reverse Order &#9650;").
						addClass("flipbatch").addClass("down").click(
							window.reverse_file_list
						),
					jQuery("<button/>").
						html("Clear List").
						addClass("clearbatch").click(window.clear_file_list)
				);
			}
		});
		reader.readAsText(files[0]); return false;
	}else{
		if(jQuery.type(window.files_to_upload[0])==="string"){
			window.fail_different_types();
		}
		for(var i = 0, f; f = files[i]; i++){
			var type = f.type.replace(/[\(\)]/g,'').split('/')[0].toLowerCase();
			audio = (type === "audio")
			if(type === "image" || type === "audio"){
				window.files_to_upload.push(f);
				window.output.push('<li><strong>',
					escape(f.name), '</strong> (',
					f.type || 'n/a',
					') - ',
					f.size, ' bytes,',
					'</li>'
				);
			}
		}
	}
	if(jQuery("#list ul").length === 0)
		jQuery('#list').html('<ul>' + window.output.join('') + '</ul>');
	else
		jQuery("#list ul").append(window.output.join(''));
	if(jQuery("button.submitbatch").length === 0){
		jQuery('#list').prepend(
			jQuery("<button/>").
				text('Submit Files as Posts').
				addClass("submitbatch").
				click(window.upload_single_photo),
			jQuery("<button/>").
				html("Reverse Order &#9650;").
				addClass("flipbatch").addClass("down").click(window.reverse_file_list),
			jQuery("<button/>").
				html("Clear List").
				addClass("clearbatch").click(window.clear_file_list)
		);
	}
}
window.clear_file_list = function(){
	window.files_to_upload = [];
	jQuery('#list').html("");
}
window.reverse_file_list = function(){
	if(jQuery("button.flipbatch").hasClass("down")){
		jQuery("button.flipbatch").html("Reverse Order &#9660;")
		jQuery("button.flipbatch").removeClass("down").addClass("up");
		window.files_to_upload = window.files_to_upload.reverse();
		var ul = jQuery('#list');
		ul.find("li").each(function(i,li){ul.prepend(li)});
		ul.prepend(jQuery("button.submitbatch, button.flipbatch, button.clearbatch"));
	}else{
		jQuery("button.flipbatch").html("Reverse Order &#9650;");
		jQuery("button.flipbatch").removeClass("up").addClass("down");
		window.files_to_upload = window.files_to_upload.reverse();
		var ul = jQuery('#list');
		ul.find("li").each(function(i,li){ul.prepend(li)});
		ul.prepend(jQuery("button.submitbatch, button.flipbatch, button.clearbatch"));
	}
}
window.handleDragOver = function(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}
window.retry_timer = 20; window.timerid_to_retry=0;
window.retry_in_20 = function(){
	window.retry_timer--;
	jQuery("button.submitbatch").text('Continue Upload in: (' + window.retry_timer + ')');
	if(window.retry_timer === 0){
		clearInterval(window.timerid_to_retry);
		if(window.first_item === 0)
			window.upload_single_photo();
		else if(window.first_item === 1)
			window.upload_single_video();
	}
}
window.timerid_fail_in_60 = 0;
window.err_message = function(){
	clearTimeout(window.timerid_fail_in_60);
	jQuery('#list li:eq(0)').css("color", "#ff0000");
	jQuery("#loadingPleaseWait").replaceWith(
		jQuery("<button/>").
		text("Continue Upload in: (20)").
		addClass("submitbatch").
		click(function(){
			if(window.first_item === 0)
				window.upload_single_photo();
			else if(window.first_item === 1)
				window.upload_single_video();
		})
	)
	window.retry_timer = 20;
	clearInterval(window.timerid_to_retry);
	window.timerid_to_retry = setInterval(window.retry_in_20, 1000);
	var messsage = jQuery("<span/>").text(
		"There was an error. Perhaps it's  Tumblr flood control, or Tumblr had a server" +
		" side error. Wait about 15 seconds then click to continue the upload. The " +
		"process will continue automatically in 20 seconds."
	).attr("id","temporary_error_message");
	jQuery("ol#posts").before(messsage);
}
window.blog_id = jQuery("a.currently_selected_blog").text();
window.user_form_key = jQuery("#tumblr_form_key").attr("content");
window.temp_url = 'http://31.media.tumblr.com/50ee4dd79c328b3f98f45bc76e43b769/' +
						'tumblr_nb3icoY3kT1s2195yo5_r1_500.png';
window.first_photo_posted = function(){
	if(window.files_to_upload.length > 1){
		window.files_to_upload.shift();
		jQuery('#list li:eq(0)').remove();
		// launch the next photo on a random interval, min. 1 second maybe flood control?
		setTimeout(window.upload_single_photo, Math.ceil(Math.random()*30)*100 + 1000);
	}else{
		clearTimeout(window.timerid_fail_in_60);
		var phts = (window.is_music)? "audio posts" : "photo";
		if(confirm(
			"The selected " + phts + " have been published. " +
			"You will need to reload the page to view any successfully posted " + phts +
			". Would you like to reload now?"
		)){
			window.onbeforeunload = false;
			document.location = document.location.href + "?done";	
		}
	}
}
window.first_video_posted = function(){
	if(window.files_to_upload.length > 1){
		window.files_to_upload.shift();
		jQuery('#list li:eq(0)').remove();
		// launch the next photo on a random interval, min. 1 second maybe flood control?
		setTimeout(window.upload_single_video, Math.ceil(Math.random()*30)*100 + 1000);
	}else{
		if(confirm(
			"The selected video/audio files have been published. " +
			"You will need to reload the page to view any successfully posted photos. " +
			"Would you like to reload now?"
		)){
			window.onbeforeunload = false;
			document.location = document.location.href + "?done";	
		}
	}
}
window.is_music = false;
window.id3 = 0; window.good_bye = true;
window.prevent_leave = function(){
	if(window.good_bye){
		window.onbeforeunload = function(){
			return "Do you want to leave?"
		}
		window.good_bye = false;
	}
}
window.upload_single_photo = function(){
	window.prevent_leave();
	window.first_item = 0;
	window.id3 = 0;
	jQuery("#drop_zone").remove();
	jQuery("#uploader_switcher").remove();
	jQuery("#temporary_error_message").remove();
	clearTimeout(window.timerid_fail_in_60);
	window.timerid_fail_in_60 = setTimeout(
		window.err_message,
		window.upload_timeout_seconds * 1000
	);
	if(jQuery("button.submitbatch").length > 0){
		jQuery("button.submitbatch").replaceWith(
			jQuery("<img/>").attr({
				"id":"loadingPleaseWait",
				"title":"Please wait while the files are being uploaded.",
				"style":"width:35px;height:35px;opacity:0.7;margin:15px 90px;",
				"src":"https://31.media.tumblr.com/416088f6794c8fb5783e6469d2bfb035/" +
							"tumblr_inline_n8ltgxjCix1rcl671.gif"
			})
		);
	}
	jQuery("button.flipbatch").remove();
	jQuery("button.clearbatch").remove();
	window.blog_id = jQuery("a.currently_selected_blog").text();
	window.user_form_key = jQuery("#tumblr_form_key").attr("content");
	var photo_file = window.files_to_upload[0];
	var mp3=window.files_to_upload[0].type.replace(/[\(\)]/g,'').split("/")[0]==="audio";
	window.is_music = mp3;
	window.temp_album_art = "//api.tumblr.com/v2/blog/"
		+ jQuery('#search_form input[name=t]').val() + ".tumblr.com/avatar/512";
	var upload = new FormData();
	upload.append("context_id",blog_id);
	upload.append("context_page","drafts");
	upload.append("editor_type","html");
	upload.append("is_rich_text[one]","0");
	upload.append("is_rich_text[two]","0");
	upload.append("is_rich_text[three]","0");
	upload.append("channel_id",blog_id);
	upload.append("post[slug]","");
	upload.append("post[source_url]","http://");
	upload.append("post[date]","");
	upload.append("MAX_FILE_SIZE","10485760");
	upload.append("post[type]",((mp3)? "audio": "photo"));
	upload.append("post[two]","");
	upload.append("post[tags]","");
	upload.append("post[publish_on]","");
	upload.append("post[state]","1");
	upload.append("custom_tweet","[URL]");
	upload.append("form_key",window.user_form_key);
	//upload.append("upload_id","23454"); // <- don't know what is, but maybe not needed
	upload.append(((mp3)? "audio": "photo[]"), photo_file);
	jQuery.ajax({
		url: ((window.is_music)?
			'https://www.tumblr.com/svc/post/upload_audio':
			'https://www.tumblr.com/svc/post/upload_photo'),
		data: upload,
		cache: false,
		contentType: false,
		processData: false,
		type: 'POST',
		success: function(data){
			if(typeof data.response === "undefined"){
				window.onbeforeunload = false;
				document.location = document.location.href + "?limit";
				return false;
			}
			if(window.is_music){
				var id = data.response[0].id3;
				var tag_post = "";
				for(i in id){
				   tag_post += '"id3_tags[' + i + ']":"' + id[i] + '",';
				}
				window.id3 = tag_post;
			}
			window.temp_url = data.response[0].url;
			jQuery.ajax({
				url: 'https://www.tumblr.com/svc/secure_form_key',
				type: 'post',
				data: '',
				headers: {
					'X-tumblr-form-key': window.user_form_key
				},
				success: function(x2, b, r){
					var sform_key = r.getResponseHeader('X-tumblr-secure-form-key');
					//if(sformkey.match(/[|]/)!==null){ // for a random odd behavior
					//	sform_key = sform_key.split("|")[1];
					//}
					var new_post_data = '{' +
						'"form_key": "' + sform_key + '",' +
						'"post": {"state": 1},' +
						'"context_id": "' + window.blog_id + '",' +
						'"context_page": "drafts",' +
						'"editor_type": "html",' +
						'"is_rich_text[one]": "0",' +
						'"is_rich_text[two]": "0",' +
						'"is_rich_text[three]": "0",' +
						'"channel_id": "' + window.blog_id + '",' +
						'"post[slug]": "",' +
						'"post[source_url]": "http://",' +
						'"post[date]": "",' +
						'"post[three]": "",' +
						'"MAX_FILE_SIZE": "10485760",' +
						((window.is_music)?
							'"post[type]": "audio",' +
							'"remove_album_art": "",' +
							'"artwork_pre_upload": "1",' +
							'"album_art": "' + window.temp_album_art + '",' +
							'"preuploaded_url": "' + window.temp_url + '",' +
        					'"album_art_url": "",' +
							'"confirm_tos": "on",' +
        					((jQuery.type(window.id3)==="string")?
        						window.id3 : ""
        					)
						:
							'"post[type]": "photo",' +
							'"post[photoset_layout]": "1",' +
							'"post[photoset_order]": "o1",' +
							'"images[o1]": "' + window.temp_url + '",'
						) +
						'"post[two]": "",' +
						'"post[tags]": "",' +
						'"post[publish_on]": "",' +
						'"post[state]": "1"' +
					'}';
					jQuery('#list li:eq(0)').css("color","#33cc33");
					jQuery.ajax({
						url: 'https://www.tumblr.com/svc/post/update',
						type: 'post',
						headers: {
							'X-tumblr-form-key': window.user_form_key,
							'X-tumblr-puppies': sform_key
						},
						data: new_post_data,
						success: function(){
							window.first_photo_posted();
						},
						error: function(){
							window.err_message();
						}
					});
				},
				error: function(){
					window.err_message();
				}
			});
		},
		error: function(){
			window.err_message();
		}
	});
}
window.info_set = function(object){
	var preset = ["type","title","artist","album","year","genre","tags","description"];
	for(i in preset){
		var a = preset[i];
		if(!object.hasOwnProperty(a)){
			object[a] = '';
		}
	}
	jQuery.ajax({
		url: 'https://www.tumblr.com/svc/secure_form_key',
		type: 'post',
		data: '',
		headers: {
			'X-tumblr-form-key': window.user_form_key
		},
		success: function(x2, b, r){
			var sform_key = r.getResponseHeader('X-tumblr-secure-form-key');
			var mp3 = (window.files_to_upload[0].match(/\.mp3$/i) !== null || object["type"] === "audio")
			var new_post_data = '{' +
				'"form_key": "' + sform_key + '",' +
				'"post": {"state": 1},' +
				'"context_id": "' + window.blog_id + '",' +
				'"context_page": "drafts",' +
				'"editor_type": "html",' +
				'"is_rich_text[one]": "0",' +
				'"is_rich_text[two]": "0",' +
				'"is_rich_text[three]": "0",' +
				'"channel_id": "' + window.blog_id + '",' +
				'"post[slug]": "",' +
				'"post[source_url]": "http://",' +
				'"post[date]": "",' +
				((mp3)?	
					'"post[type]": "audio",' +
					'"post[one]": "",' +
					'"post[two]": "",' +
					'"post[three]": "' + window.files_to_upload[0] + '",' +
					'"pre_upload": "",' +
					'"preuploaded_url": "",' +
					'"remove_album_art": "",' +
					'"artwork_pre_upload": "1",' +
					'"album_art": "' + window.temp_album_art + '",' +
					'"id3_tags[title]":"' + object["title"] + '",' +
					'"id3_tags[artist]":"' + object["artist"] + '",' +
					'"id3_tags[album]":"' + object["album"] + '",' +
					'"id3_tags[year]":"' + object["year"] + '",' +
					'"id3_tags[genre]":"' + object["genre"] + '",' +
					'"post[tags]": "' + object["genre"] + '",'
				:
					'"post[type]":"video",' +
					'"post[one]": "' + window.files_to_upload[0] + '",' +
					'"post[two]": "' + object["description"] + '",' +
					'"post[three]": "",' + 
					'"post[tags]": "' + object["tags"] + '",'
				) +
				'"MAX_FILE_SIZE": "104857600",' +
				'"pre_upload": "",' +
				'"preuploaded_url": "",' +
				'"preuploaded_ch": "",' +
				'"valid_embed_code": "1",' +
				'"post[publish_on]": "",' +
				'"post[state]": "1"' +
				'}';
			jQuery('#list li:eq(0)').css("color","#33cc33");
			jQuery.ajax({
				url: 'https://www.tumblr.com/svc/post/update',
				type: 'post',
				headers: {
					'X-tumblr-form-key': window.user_form_key,
					'X-tumblr-puppies': sform_key
				},
				data: new_post_data,
				success: function(){
					window.first_video_posted();
				},
				error: function(){
					window.err_message();
				}
			});
		},
		error: function(){
			window.err_message();
		}
	});
}
window.upload_single_video = function(){
	window.prevent_leave();
	window.first_item = 1;
	window.files_to_upload[0] = window.files_to_upload[0].replace(/\s+/g,"");
	if(window.files_to_upload[0].length === 0){
		window.first_video_posted();
		return false;
	}
	window.temp_album_art = "//api.tumblr.com/v2/blog/"
		+ jQuery('#search_form input[name=t]').val() + ".tumblr.com/avatar/512";
	jQuery("#drop_zone").remove();
	jQuery("#temporary_error_message").remove();
	clearTimeout(window.timerid_fail_in_60);
	window.timerid_fail_in_60 = setTimeout(
		window.err_message,
		window.upload_timeout_seconds * 1000
	);
	var loadergif = jQuery("<img/>").attr({
			"id":"loadingPleaseWait",
			"title":"Please wait while the videos are being posted.",
			"style":"width:35px;height:35px;opacity:0.7;margin:15px 90px;",
			"src":"https://31.media.tumblr.com/416088f6794c8fb5783e6469d2bfb035/" +
						"tumblr_inline_n8ltgxjCix1rcl671.gif"
		});
	if(jQuery("button.submitbatch").length > 0){
		jQuery("button.submitbatch").replaceWith(loadergif);
	}else if(jQuery("#loadingPleaseWait").length === 0){
		jQuery('#list').prepend(loadergif);
	}
	jQuery("button.flipbatch").remove();
	jQuery("button.clearbatch").remove();
	window.blog_id = jQuery("a.currently_selected_blog").text();
	window.user_form_key = jQuery("#tumblr_form_key").attr("content");
	
	
	
	// leave this part out until Tumblr allows external APIs again :(
	//var ssl_jsonp = "//b9mx.com/json/id3/" + btoa(window.files_to_upload[0]) + "/";
	//jQuery.ajax({
	//	url: ssl_jsonp,
	//	contentType: "application/json",
	//	dataType: 'jsonp'
	//});
	// spoof callback
	if(window.files_to_upload[0].match(/\.mp3$/i)!==null){
		info_set({"type":"audio","artist":"","title":window.files_to_upload[0].replace(/\.mp3$/i,""),"album":"","year":"","genre":""});
	}else{
		info_set({"type":"video","description":window.files_to_upload[0],"tags":""});
	}
}
window.extra_css = 'button.submitbatch, ' +
	'button.clearbatch, ' +
	'button.flipbatch {' +
	'border-radius: 10px;' +
	'background:linear-gradient(to top,' +
	' rgba(0,0,0,0.30) 0%,rgba(0,0,0,0) 100%);' +
	'border:2px solid rgba(0,0,0,0.2);' +
	'padding:7px;' +
	'display: inline:block;' +
	'margin:15px 10px;' +
	'text-shadow:3px 1px 2px #fff, -3px -1px 2px #fff;' +
	'} ' +
	'button.submitbatch:active, ' +
	'button.clearbatch:active, ' +
	'button.flipbatch:active {' +
	'background:linear-gradient(to bottom,' +
	' rgba(0,0,0,0.30) 0%,rgba(0,0,0,0) 100%);' +
	'} ' +
	'#drop_zone_container {' +
	'background-color:#fff;' +
	'border-radius:10px;' +
	'margin:20px 85px;' +
	'width:510px;' +
	'padding:15px;' +
	'} ' +
	'#drop_zone {' +
	'border:2px dashed #bbb;' +
	'border-radius:5px;' +
	'color:#a7a7a7;' +
	'padding:25px;' +
	'text-align:center;' +
	'position: relative;' +
	'top:0;' +
	'left:0;' +
	'background-color: #f7f7f7;' +
	'} ' +
	'#drop_zone_container a {' +
	'text-decoration:underline;' +
	'cursor:pointer;' +
	'} ' +
	'#drop_zone_container textarea {' +
	'border:2px inset #bbb;' +
	'border-radius:5px;' +
	'color:#666666;' +
	'padding:2px;' +
	'height:315px;' +
	'width:100%;' +
	'} ' +
	'#drop_zone i {' +
	'font-style: italic;' +
	'}' +
	'#list {' +
	'max-height:200px;' +
	'overflow:auto;' +
	'}'+
	'#list strong {' +
	'font-weight: bold;' +
	'}' +
	'#hidden_input_container {' +
	'height:0px;' +
	'width:0px;' +
	'padding:0px;' +
	'overflow:hidden;' +
	'border: 0 none;' +
	'}' +
	'#temporary_error_message {' +
	'background-color: #f9e5e5;' +
    'border: 1px solid #ebb0b0;' +
    'border-radius: 4px;' +
    'color: #c64949;' +
    'display: block;' +
    'font-size: 12px;' +
    'font-weight: bold;' +
    'margin: 15px 0 20px 85px;' +
    'padding: 10px;' +
    'text-shadow: 0 1px rgba(255, 255, 255, 0.5);' +
    'text-align: center;' +
	'}' +
	'#browse {' +
	'position: absolute;' +
    'border: 1px solid #bbb;' +
    'padding: 4px;' +
    'top: 5px;' +
    'left: 5px;' +
    'cursor: pointer;'
    'background: #fff;' +
    'border-radius:4px;' +
    '}';
window.show_uploader = function(){
	jQuery("head").append(
		jQuery("<style/>").attr("type","text/css").text(window.extra_css)
	);
	jQuery("ol#posts").before(
		jQuery('<div id="drop_zone_container"/>').append(
			jQuery('<div id="drop_zone"/>').append(
				jQuery('<input id="hidden_input_container"/>').append(
						jQuery("<input/>").attr({
						"type": "file",
						"multiple":"true",
						"id":"hidden_input",
					}).on("change", function(){
						window.handleFileSelect(jQuery(this).get(0), true);
					})
				),
				"<p>Drag multiple photo files, audio files here,</p>" + 
				"<p>or a single txt file list of external audio/video urls,</p>"+
				"<p> and drop here to MASS POST...</p>" +
				"<p>(bot, batch, bulk)</p>" +
				"<p><i>only handles ONE file type per batch...</i></p>",
				jQuery('<div id="browse"/>').text("browse").click(function(){
					jQuery("#hidden_input").trigger("click");
				})
			),
			jQuery('<div id="list"/>'),
			jQuery('<a id="uploader_switcher"/>').text("Click here to switch to: " + 
				"textarea mode (for external video/audio lists)..."
			).bind("click.mode", function(){
				window.uploader_switch(1);
			})
		)
	);
	// Setup the dnd listeners.
	var dropZone = document.getElementById('drop_zone');
	dropZone.addEventListener('dragover', window.handleDragOver, false);
	dropZone.addEventListener('drop', window.handleFileSelect, false);
}
jQuery(document).ready(function(){
	if(!jQuery("li.controls_section_item a.drafts").is(":visible")){
		jQuery("li.controls_section_item a.drafts").parent().show();
	}
	jQuery("li.controls_section_item a.drafts div.hide_overflow").
		append(" + Batch Post").
		removeClass("hide_overflow");
		
	
	
	if(document.location.href.match(/\?limit$/) !== null){
		jQuery("head").append(
			jQuery("<style/>").attr("type","text/css").text(window.extra_css)
		);
		jQuery("ol#posts").before(
			jQuery("<span/>").html(
				"Oh no! You've reached your photo or audio upload limit,<br>" +
				"250 photos per day<br>or<br>10 megabytes of audio per day.<br>" +
				"Rats! Please come again tomorrow and can upload more!"
			).attr("id","temporary_error_message")
		);
	}
	if(document.location.href.match(/\?done$/) !== null){
		alert("Thank you for using Tumblr - Mass Posting Photos, Audio, Videos.");
		document.location = document.location.href.split("?")[0];
	}
	if(document.location.href.match(/\/drafts$/i) !== null){
		jQuery(document).ready(window.show_uploader);
	}
});