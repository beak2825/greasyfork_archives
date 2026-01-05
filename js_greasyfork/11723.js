// ==UserScript==
// @name         HF Your Offline Images
// @namespace    http://www.hackforums.net
// @description  Checks all your posts for offline images
// @version      0.2
// @author       UID 2825755
// @run-at       document-end
// @icon         data:image/png;base64,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
// @match        *://*.hackforums.net/usercp.php
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js  
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11723/HF%20Your%20Offline%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/11723/HF%20Your%20Offline%20Images.meta.js
// ==/UserScript==

var 
	oic_img_index,
	oic_resultset = [],
	oic_thread_index = 0,
	oic_url_list = [],
	oic_page_index,
	oic_uurl = 'search.php?action=finduser&uid='+$('#panel strong a').attr('href').split("=")[2]+'&order=desc';

function oic_check_images (urls) {
	oic_log("Checking images..");
	if(urls.length > 0) {
		oic_img_index = 0;
		$('body').append("<img id='oic_temp_img' />");
		$("#oic_temp_img")
			.error(function(){
				oic_log("Broken Image found.. ["+(oic_resultset.length+1)+"]");
				oic_resultset.push({ image: urls[oic_img_index], thread: oic_url_list[oic_thread_index] });
				oic_img_index++;
				if(oic_img_index < urls.length)
					oic_load_image(oic_img_index, urls);
				else {
					$('#oic_temp_img').remove();
					oic_next_thread();
				}
			})
			.load(function(){
				oic_log("Image checked ["+(oic_img_index+1)+"/"+urls.length+"]");
				oic_img_index++;
				if(oic_img_index < urls.length)
					oic_load_image(oic_img_index, urls);
				else {
					oic_next_thread();
					$('#oic_temp_img').remove();
				}
			})
			.attr("src", urls[0]);
	} 
	else oic_next_thread();
}

function oic_load_image (index, urls) {
	$("#oic_temp_img").attr("src", urls[index]);
}

function oic_collect_thread_images ( ) {
	var get_post, post_img_urls = [];
	oic_log("");
	oic_log("<strong>Collect images on post "+oic_url_list[oic_thread_index].split("=")[1].split("&")[0]+"</strong>");
	$.get( oic_url_list[oic_thread_index], function( data ) {
		get_post = data;
		var temp_post_id = oic_url_list[oic_thread_index].split("#")[1].substr(3)
		$(get_post).find('#post_'+temp_post_id+'>tbody>tr:eq(2)>.post_content>.post_body').find('img').each(function() {
			post_img_urls.push($(this).attr('src'));
		});
		oic_check_images(post_img_urls);
	});
}

function oic_next_thread ( ) {
	oic_log("Done Thread ["+(oic_thread_index+1)+"/"+oic_url_list.length+"]");
	oic_thread_index++;
	if(oic_thread_index < oic_url_list.length) oic_collect_thread_images();
	else {
		oic_collect_end();
	}
}

function oic_collect_threads ( link ) {
	typeof link === 'undefined' ? link = false : 0;
	if(!link) oic_url_list = [];
	var cur_page;
	oic_thread_index = 0;
	if(!link)oic_url_list = [];
	oic_resultset = [];

	var use_page = oic_uurl;
	if(link) use_page = link;
	if(link)oic_log("Collect threads on page "+link)
	else oic_log("Collect threads on first page")
	$.get( use_page, function( data ) {
		cur_page = data;
		$(cur_page).find(".quick_keys>table:eq(1)>tbody>tr+tr+tr").each(function() {
			oic_url_list.push($(this).find('td:eq(2)>.smalltext>a:last').attr('href'));
		});
		oic_log("Collected "+oic_url_list.length+" threads on this page");
		if(typeof($(cur_page).find('.pagination_next:first')) != "undefined") {
			oic_page_index = $(cur_page).find('.pagination_next:first').attr('href');
			if(typeof(oic_page_index) != "undefined" && oic_page_index != "undefined") {
				oic_log('Done. Next page..');
				oic_collect_threads( oic_page_index );
			} else {
				oic_log("Total collected threads: "+oic_url_list.length);
				oic_log("")
				oic_collect_thread_images();
			}
		}
	});
}

function oic_results ( ) {
	$('#oic_collect_thread_images_content').slideUp(function() {
		$(this).html('').append('<br />');
		for(var i = 0; i < oic_resultset.length; i++) {
			$(this).append('[THREAD] <a target="_blank" href="'+oic_resultset[i].thread+'">'+oic_resultset[i].thread+'</a><br />');
			$(this).append('[IMAGE] <a target="_blank" href="'+oic_resultset[i].image+'">'+oic_resultset[i].image+'</a><br /><br />');
		}
		$(this).slideDown();
	});
}

function oic_collect_end ( ) {
	oic_log("");
	oic_resultset.length ? oic_log("Finished. <a href='#' id='oic_results'>[RESULTS]</a>") : oic_log("Finished. [NO BROKEN IMAGES FOUND]");
	$('#oic_results').click(oic_results);
}

function oic_log(txt, clear) {
	typeof clear === 'undefined' ? clear = true : 0;
	txt.length ? txt = '- '+txt : 0;
	$('#oic_collect_thread_images_content').append("<big class='grab_log_item'>"+ txt +"<br /></big>");
	if(clear)if($('.grab_log_item').length > 10) $('.grab_log_item:first').remove();
}

function oic_start ( ) {
	if($('#oic_collect_thread_images_alert').length) $('#oic_collect_thread_images_alert').remove();
	$('#content').before('<div class="pm_alert" style="text-align: left !important;" id="oic_collect_thread_images_alert"><div><small id="oic_collect_thread_images_content"></small></div> </div>');
	oic_log("Begin to collect your threads..")
	oic_collect_threads();
}

$('#usercpmisc_e').append('<tr><td class="trow1 smalltext"><a href="#" id="oic_start">Offline Image Collector</a></td></tr>');
$('#oic_start').click(oic_start);