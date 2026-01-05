// ==UserScript==
// @name        Tumblr - Archive Reblog
// @namespace   http://script.b9mx.com/tumblr-archive-reblog.user.js
// @description Reblog posts from any archive.
// @include     http*://*/archive
// @include     https://www.tumblr.com/dashboard?blogme*
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13094/Tumblr%20-%20Archive%20Reblog.user.js
// @updateURL https://update.greasyfork.org/scripts/13094/Tumblr%20-%20Archive%20Reblog.meta.js
// ==/UserScript==
window.setTumblelogs = function(html){ // setTumblelogs - v2 - for trickier blog objects
	var tumblelogs = false;
	var spare = [];
	if(typeof html !== "undefined"){
		var div = jQuery("<div></div>").html(html);
        try{
		tumblelogs = JSON.parse(
            jQuery("<div></div>").html(
                div.find("noscript#bootloader").attr("data-bootstrap")
            ).text()
        )["Components"]["AbuseForm"]["tumblelogs"];
        }catch(e){
            return spare;
        }
        return tumblelogs;
	}
};
var dlh = document.location.href;
var deh = document.documentElement.innerHTML;
window.reblog_key_fetch_queue = [];
window.reblog_key_fetch_queue_id = [];
window.after_work = false;
window.fetch_reblog_key = function(id){
	jQuery("#arc_reblog_"+id).html('<img src="https://31.media.tumblr.com/2706639e7c88a85aaca555acb3fd8c57/tumblr_inline_n7vxmyg06N1rcl671.gif">');
	var api = 'fuiKNFp9vQFvjLNvx4sUwti4Yb5yGutBN4Xh10LXZhhRKjWlV4';
	var url = '//api.tumblr.com/v2/blog/' + window.tumblog + 
			  '.tumblr.com/posts?api_key=' + api + '&id=' + id + "&reblog_info=true";
	jQuery.ajax({
		url:url,
		dataType:'jsonp',
		success:function(re){
			if(typeof re !== "undefined" && re.hasOwnProperty("response")
			&& re["response"].hasOwnProperty("posts") && jQuery.type(re["response"]["posts"][0]) === "object"
			&& re["response"]["posts"][0].hasOwnProperty("reblog_key")){
				var reblog_key = re["response"]["posts"][0]["reblog_key"];
				jQuery("#arc_reblog_" + id).attr("onclick",
					"window.open('https://www.tumblr.com/dashboard?blogme=" +
					window.tumblog + "&id=" + id + "&key=" + reblog_key + "'" +
					",'win2'," +
					"'width=200,height=90," +
					"location=0,menubar=0,scrollbars=1,status=0,toolbar=0,resizable=1');"+
					"return false;"
				).val("Reblog").css("color","#000");
			}else{
				jQuery("#arc_reblog_"+id).text("API error").attr("title","Click to try again.").css("color","#f00");
			}
		},
		error: function(e){
			jQuery("#arc_reblog_"+id).text("API error").attr("title","Click to try again.").css("color","#f00")
		}
	});
}
window.reblog_win2 = function(id){
	return jQuery('<input>').val("Load Key").attr({
		"type":"button",
		"id":"arc_reblog_"+id,
		"onClick": "window.fetch_reblog_key('"+id+"');return false;"
	});
}
if(dlh.match("www.tumblr.com/dashboard\\?blogme")!==null){
	// run this as the blog list window
	if(dlh.match(/\?blogme=[^&]+&/) === null && dlh.match(/&id=[^&]+&/) === null
	&& dlh.match(/&key=[^$]+$/) === null){
		var css = jQuery('<style type="text/css">').append(
			'*{margin:0;padding:0;}' +
			'body{' +
				'font-family:arial,sans-serif;' +
				'font-size:16px;' +
				'color:#000;' +
				'background-color:#fff;' +
			'}' +
			'label{margin:5px 0}' +
			'input[type=radio]:checked,' +
			'input[type=radio]:checked + label{' +
				'background-color:#afcfdf;' +
			'}'
		);
		var title = jQuery("<title>").text("Archive Reblog Options");
		jQuery("head").html("");
		jQuery("body").html("loading...");
		jQuery.ajax({
			url:"https://www.tumblr.com/dashboard",
			type:'get',
			beforeSend: function(xhr) {
				xhr.setRequestHeader('X-Requested-With',{toString:function(){return '';}});
			},
			success: function(x){
				var tumblogs = window.setTumblelogs(x);
				jQuery("head").append(css,title);
				var form = jQuery('<div/>').append(
					jQuery('<label for="as_draft">').append(
						jQuery('<input id="as_draft" type="checkbox">').change(function(){
							if(jQuery(this).prop("checked")){
								set_cookie("gm_ar_draft", "yes", 999);
							}else{
								unset_cookie("gm_ar_draft");
							}
						}).prop("checked", function(){
							return get_cookie("gm_ar_draft") !== false && 
								   get_cookie("gm_ar_draft").value === "yes";
						}),
						"Reblog posts as draft"
					), "<br><br>Select a blog to reblog to."
				);
				var first = "";
				jQuery.each(tumblogs, function(i, bl){
					var name = bl.name;
					if(first.length === 0) first = name;
					form.append(
						jQuery("<div>").append(
							jQuery('<input>').attr({
								"type": "radio",
								"name": "gm_ar_poster",
								"id": name
							}).prop("checked", function(){
								return get_cookie("gm_ar_poster") !== false && 
									   get_cookie("gm_ar_poster").value === name;
							}).change(function(){
								if(jQuery(this).prop("checked")){
									set_cookie(
										"gm_ar_poster",
										jQuery(this).attr("id"),
										999
									);
								}
							}),
							jQuery('<label>').attr({
								"for":name
							}).append(name)
						)
					)
				});
				if(form.find("input:checked").length === 0){
					form.find("#" + first).prop("checked", true);
					set_cookie("gm_ar_poster", first, 999);
				}
				form.append(
					jQuery('<input>').val("Close Window").attr({
						"type":"button",
						"onClick":"window.close();"
					}),"<br><br>"
				);
				jQuery("body").html(form);
			}
		});
	}else{
		// reblogging window
		var name = dlh.match(/\?blogme=([^&]+)&/)[1];
		var id = dlh.match(/&id=([^&]+)&/)[1];
		var reblog_key = dlh.match(/&key=([^$]+$)/)[1];
		var form_key = jQuery("#tumblr_form_key").attr("content");
		var css = jQuery('<style type="text/css">').append(
			'*{margin:0;padding:0;}' +
			'body{' +
				'font-family:arial,sans-serif;' +
				'font-size:16px;' +
				'color:#000;' +
				'background-color:#fff;' +
			'}'
		);
		var title = jQuery("<title>").text("Archive Reblog " + id);
		jQuery("head").html("");
		jQuery("head").append(css,title);
		jQuery("body").html("");
		if(get_cookie("gm_ar_poster") === false){
			jQuery("body").html("Error: Must set blog options first.");
		}else{
			jQuery("body").css("color","").html(
				'<img src="https://31.media.tumblr.com/2706639e7c88a85aaca555acb3fd8c57/tumblr_inline_n7vxmyg06N1rcl671.gif"> Reblogging '+id
			);
			window.tag_fetch_not_running = true;
			jQuery.ajax({
				url: 'https://www.tumblr.com/svc/post/fetch',
				type: 'post',
				data:'{"reblog_id":"' + id + '",' +
					'"reblog_key": "' + reblog_key + '",'+
					'"channel_id":"' + name + '",' +
					'"post_type":false,' +
					'"form_key":"'+ form_key +'"}',
				success: function(x){
					var post_object = x;
					var reblog_name = ((post_object["post"]["reblog_name"] !== null)? post_object["post"]["reblog_name"] : blog_name)
					var reblog_post_id = ((post_object["post"]["root_id"] !== null)? post_object["post"]["root_id"] : id);
					var blog_name = get_cookie("gm_ar_poster").value;
					var draft = get_cookie("gm_ar_draft") !== false && get_cookie("gm_ar_draft").value === "yes";
					jQuery.ajax({
						url: 'https://www.tumblr.com/svc/secure_form_key',
						type: 'post',
						data: '',
						headers: {
							'X-tumblr-form-key': form_key
						},
						success: function(x2, b, r){
							var sform_key = r.getResponseHeader('X-tumblr-secure-form-key');	
							var isset = function(val, type){
								if(jQuery.type(type) === "undefined") type = jQuery.type(val);
								return jQuery.type(val) !== "undefined"
										&& val !== null
										&& val !== false
										&& jQuery.type(val) === type
								
							}
							var changes_to_post = {
								"channel_id": blog_name,
								"detached": true,
								"reblog": true,
								"post[date]": "",
								"reblog_id": id.toString(),
								"reblog_post_id": id.toString(),
								"reblog_key": reblog_key,
								"is_recommended": false,
								"placement_id": false,
								"rbpt": "",
								"post[publish_on]": "",
								"safe_edit": true,
								"post_context_page": "dashboard",
								"created_post": (isset(post_object["created_post"])?post_object["created_post"]:true),
								"post[tags]":(isset(post_object.post.tags)?post_object.post.tags:null),
								"form_key": form_key,
								"errors": false,
								"context_page": "dashboard",
								// context page queue/drafts? maybe not needed
								// "post": post_object.post, // maybe these are vestigial ? ??
								// "post_tumblelog", post_object["post_tumblelog"],
								"silent": true,
								"context_id": reblog_name,
								"editor_type": "rich",
								"is_rich_text[one]": "0",
								"is_rich_text[two]": "1",
								"is_rich_text[three]": "1",
								"post[slug]": "",
								"post[source_url]": (isset(post_object.post["source_url"])?
														post_object.post["source_url"]
														:
														"http://"
													),
								"post[three]": (isset(post_object.post.three)? post_object.post.three: ""),
								"post[type]": post_object.post.type,
								"post[one]": (isset(post_object.post.two)? post_object.post.one: ""),
								"post[two]": (isset(post_object.post.two)? post_object.post.two: ""),
								"post[three]": (isset(post_object.post.three)? post_object.post.three: ""),
								"post[tags]": (isset(post_object.post.tags)? post_object.post.tags: ""),
								"post[state]": (draft ? "1":"0 3"),
							};
							if(isset(post_object.post.photos,"array")){
								var order = "";
								var oneone = "";
								jQuery.each(post_object.post.photos, function(i,photo){
									order += photo.id+",";
									oneone += "1";
									var srt = photo.url;
									var src = srt.replace(/500\.(\w{3,4}$)/,"1280.$1");
									var test_1280 = jQuery("<img>").attr({
										"src":src
									}).bind("error",function(){
										src = srt;
									}).ready(function(){
										jQuery(this).remove();
									});
									changes_to_post["images["+photo.id+"]"] = src;	
									changes_to_post["caption["+photo.id+"]"] = isset(photo.caption)? photo.caption: "";
								});
								changes_to_post["post[photoset_layout]"] = isset(post_object.post["photoset_layout"]) ? post_object.post["photoset_layout"]: oneone;
								changes_to_post["post[photoset_order]"] = order.replace(/,$/,'');
								changes_to_post["MAX_FILE_SIZE"] = "10485760";
							}
							if(isset(post_object.post.type) && post_object.post.type === "audio"){
								jQuery.extend(changes_to_post,{
									"pre_upload": "",
									"preuploaded_url": "",
									"remove_album_art": "",
									"artwork_pre_upload": "1",
									"MAX_FILE_SIZE": "10485760",
									"album_art": isset(post_object.post["audio_artwork"])? post_object.post["audio_artwork"] : ""
								});
								if(isset(post_object.post["id3_tags"],"array")){
									jQuery.each(post_object.post["id3_tags"], function(i, id3){
										changes_to_post['id3_tags['+i+']'] = id3;
									});
								}
							}
							if(isset(post_object.post.type) && post_object.post.type === "video"){
								jQuery.extend(changes_to_post,{
									"post[one]": post_object["post"]["video"]["embed_code"],
									"pre_upload": "",
									"MAX_FILE_SIZE": "10485760",
									"preuploaded_url": "",
									"preuploaded_ch": "",
									"valid_embed_code": "1"
								});
							}
							jQuery.ajax({
								url: 'https://www.tumblr.com/svc/post/update',
								type: 'post',
								headers: {
									'X-tumblr-form-key': form_key,
									'X-tumblr-puppies': sform_key
								},
								data: JSON.stringify(changes_to_post),
								success: function(){
									jQuery("body").css("color","green").html(
										"Post " + id + " reblogged to " + blog_name + (draft ? " as a draft":"") + "!"
									);
									setTimeout(function(){
										window.close();
									}, 2500);
								}
							});
						}
					});
				}
			});
		}
	}
}else if(dlh.match(/\/archive(\/\d{4}\/\d{1,2})?$/)!==null
	&& jQuery("header#nav_archive").length > 0){
	// run this on any archive page
	window.tumblog = deh.match(/&amp;name=([^"]+)"/)[1];
	window.append_timer = setInterval(function(){
		if(!window.after_work
		&& jQuery('.post_glass').length !== jQuery('.post_glass.with_re').length){
			window.after_work = true;
			jQuery('.post_glass:not(.with_re)').each(function(){
				jQuery(this).addClass("with_re");
				if(jQuery(this).find('input').length === 0){
					var id = jQuery(this).parents('.post_micro').attr("id").substr(11);
					jQuery(this).prepend(window.reblog_win2(id));
				}
			});
		}else{
			window.after_work = false;
		}
	}, 1000);
	jQuery("head").append(
		jQuery('<style type="text/css">').text(
			'.post_micro input{bottom:2px;cursor:pointer;height:20px;' +
			'position:absolute;right:2px;width:90px;z-index:9999;}'
		)
	);
	jQuery("#nav_archive").append(
		jQuery('<input>').val("Open Reblog Options").attr({
			"type":"button",
			"onClick":
				"window.open('https://www.tumblr.com/dashboard?blogme','win1'," +
				"'width=300,height=200," +
				"location=0,menubar=0,scrollbars=1,status=0,toolbar=0,resizable=1')"
		})
	);
}