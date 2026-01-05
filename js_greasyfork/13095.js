// ==UserScript==
// @name        Tumblr - Mass Post Features
// @namespace   http://script.b9mx.com/tumblr-mass-post-features.user.js
// @description Multi-select box, Queue or Drafts Edit, Mass Reblog Archive/Dash/Tagged/Likes, Select or Show by Tag or Type, Backdate, Schedule, Caption, Link, and more
// @include     https://www.tumblr.com/mega-editor
// @include     https://www.tumblr.com/mega-editor/*
// @include     https://www.tumblr.com/mega-editor/*/*/*
// @version     3.10.8
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13095/Tumblr%20-%20Mass%20Post%20Features.user.js
// @updateURL https://update.greasyfork.org/scripts/13095/Tumblr%20-%20Mass%20Post%20Features.meta.js
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
// Modified default Tumblr functions
window.fetch_next_page = function(){
	// added for my brick class doubling
	if(window.loading_page || window.laying_bricks){
        return;
    }
    // added for occasion that blog has no posts
    if(jQuery(".brick,.null_brick").last().length === 0){
    	return;
    }
    window.last_post_time = jQuery(".brick,.null_brick").last().attr("class").replace(/[^0-9]*/g, "");
    jQuery("#loading").show();
    var a = window.last_post_time;
    if (a === window.last_post_time_fetched) {
        return;
    }
    window.loading_page = true;
    // the variable is sort of transport control; it worked in the old prototype version
    window.ajax_going = jQuery.ajax(window.current_url + "?before_time=" + a, {
        type: "get",
        success: function(d, g, c){
            var b;
            window.last_post_time_fetched = a;
            try{
                b = c.responseText.split("<!-- START CONTENT -->")[1].
                	split("<!-- END CONTENT -->")[0].
                	replace(/style=" display:block/g, 'style=" display:none');
            }catch(f){}
            if(b){
                jQuery("#content").append(b);
            }
            if(c.responseText.indexOf('id="next_page_link"') === -1){
                window.next_page = false;
                //added to show done on pause button
                window.all_done_for_pause_button();
                jQuery("#loading").hide();
            }
        },
        complete: function(){
        	// added to get tags and reblog keys for newly added posts
        	window.get_data_for_tagsel();
            window.loading_page = false;
            // added to load new blog links
            if(window.visible_blog_links){
				window.view_post_links(true);
            }
            // added to show captions if on
            if(window.visible_photo_captions){
				window.view_post_captions(true);
            }
            build_columns(true);
        }
    });
}
window.b_c = window.build_columns;
window.build_columns = function(){
	window.b_c.apply(this, arguments);
	// added because things are dragging
    jQuery(".brick, .brick div, .brick img").not('[draggable="false"]')
    .attr({"draggable":"false","ondragstart":"return false;"}).mousedown(function(event) {
    	jQuery(window).trigger(event);
		event.preventDefault();
		return false;
	});
	// added because the loader graphic does not go down on the drafts/queue
	jQuery("#loading").css("top",
		(jQuery("#content").height()+jQuery("#content").offset().top)+"px");
}
window.to_fin = 0;
window.loader_ma_jig = jQuery("<img/>").attr({"id":"loader_ma_jig",
"style":"width:15px;height:15px;opacity:0.7;cursor:pointer;",
"src":"https://31.media.tumblr.com/416088f6794c8fb5783e6469d2bfb035/tumblr_inline_n8ltgxjCix1rcl671.gif",
"title":"In case of error, click to cancel!"}).click(function(e){
	e.preventDefault();
	e.stopPropagation();
	jQuery("img#loader_ma_jig").remove();
	return false;
});
window.delete_selected_posts = function(){
    if(ajax_request_pending){
        alert(window.l10n_str.wait_for_last_operation);
        return
    }
    var a = window.get_selected_post_ids();
    if(a.length > 100){
        alert(window.l10n_str.only_100_posts);
        return
    }
    if(a.length < 1){
        alert(window.l10n_str.select_posts_to_delete);
        return
    }
    if(!confirm(window.l10n_str.confirm_delete_selected_posts)) {
        return
    }
    window.controls_loading();
    // added for slow delete waits
    jQuery("#delete_posts .chrome_button_right").before(window.loader_ma_jig);
    jQuery.ajax("/delete_posts", {
        type: "post",
        data: {
            post_ids: a.join(","),
            form_key: user_form_key
        },
        success: function(){
            $.each(a, function (c, b) {
                $("#post_" + b).remove();
            });
            window.ajax_request_pending = false;
            window.get_selected_post_ids();
            // added to update selected count
			if(Array.isArray(window.get_selected_post_ids()))
				window.select_count(0);
            // added to reset the 100 post limit, because deleted aren no longer selected
            jQuery('#select_all').html(window.chrome_big_dark('Select All'));
			window.select_all_limit = 0;
            // added to remove remaining space gaps (my pause bug fix)
            window.build_columns(true);
            // added from the wait thing
            jQuery("img#loader_ma_jig").remove();
        },
        error: function(){
            window.controls_ready();
            alert(l10n_str.ajax_error);
        }
    })
}
jQuery("#add_tag_button,#remove_tag_button").parent().css({
	"box-shadow": "5px 0px 2px 0px rgba(218,219,220,1)",
	"z-index":"100"
});
jQuery("#add_tag_button").mousedown(function(){
	insert_tag(jQuery('#tag_editor_input').val());
	tag_editor_update_form();
	jQuery('#tag_editor_input').val('');
});
// end Modified default Tumblr functions
window.add_tags_widget_selected = function(e){
	var all_tags = new Array();
	jQuery('.brick.with_tags.highlighted').each(function(i, post){
		if(jQuery(post).find('input.itags').length > 0){
			var e = unescape(jQuery(post).find('input.itags').eq(0).val()).split(',')
			for(ik = 0; ik < e.length; ik++){
				if(e[ik] !== '' && typeof e[ik] !== 'undefined'){
					all_tags.push(e[ik]);
				}
			}
		}
	});
	all_tags = window.uniq(all_tags);
	for(var i=0; i<all_tags.length; i++){
		window.insert_tag(all_tags[i]);
	}
}
var from_sel = jQuery('<div style="position:absolute;bottom:38px;left:105px;">');
from_sel.append(
	jQuery('<button type="button" class="chrome" title="Clone tags from selected posts. Warning, may be a lot!">').append(
		jQuery('<div class="chrome_button">').append(
			jQuery('<div class="chrome_button_left">'),
			jQuery('<span>').text('From Select^'),
			jQuery('<div class="chrome_button_right">')
		)
	).click(window.add_tags_widget_selected)
);
var rem_all = jQuery('<div style="position:absolute;bottom:38px;left:125px;">');
rem_all.append(
	jQuery('<button type="button" class="chrome" title=Check All">').append(
		jQuery('<div class="chrome_button">').append(
			jQuery('<div class="chrome_button_left">'),
			jQuery('<span>').text('Check All'),
			jQuery('<div class="chrome_button_right">')
		)
	).click(function(){
		jQuery('#remove_tags_widget #tags input[type="checkbox"]').prop("checked",true);
	})
);
var rem_no = jQuery('<div style="position:absolute;bottom:38px;left:208px;">');
rem_no.append(
	jQuery('<button type="button" class="chrome" title="Uncheck All">').append(
		jQuery('<div class="chrome_button">').append(
			jQuery('<div class="chrome_button_left">'),
			jQuery('<span>').text('None'),
			jQuery('<div class="chrome_button_right">')
		)
	).click(function(){
		jQuery('#remove_tags_widget #tags input[type="checkbox"]').prop("checked",false);
	})
);
jQuery('#remove_tags_widget').append(rem_all,rem_no);
var xall = jQuery('<div style="position:absolute;bottom:38px;right:86px;">');
xall.append(
	jQuery('<button type="button" class="chrome" title="Remove all tags rather than one by one.">').append(
		jQuery('<div class="chrome_button">').append(
			jQuery('<div class="chrome_button_left">'),
			jQuery('<span>').text('X-all'),
			jQuery('<div class="chrome_button_right">')
		)
	).click(function(){
		jQuery('#tag_editor .token').remove();
	})
);
jQuery('#add_tag_button').parents('div').eq(0).after(from_sel,xall);
window.fetch_edit_queue = [];
window.fetch_change_queue = [];
window.fetch_ids_queue = [];
window.reset_edit_queue = function(){
	window.err_option = "";
	window.fetch_edit_queue = [];
	window.fetch_change_queue = [];
	window.fetch_ids_queue = [];
}
window.clear_all_intervals = function(){
	clearInterval(window.timerid_lay_bricks);
	clearInterval(window.timerid_auto_paginator);
	clearInterval(window.timerid_hide_new_posts);
	clearInterval(window.timerid_key_tag_fetch);
	clearInterval(window.timerid_too_big_to_animate_5);
	clearInterval(window.timerid_too_big_too_animate_10);
	clearInterval(window.timerid_get_queue_drafts);
}
window.fetch_edits_id = [];
window.fetch_edits = [];
window.get_data_for_tagsel = function(){
	jQuery('.brick').not('.orly').each(function(){
		jQuery(this).attr('onclick',
			'if(window.orly()){if(jQuery(this).hasClass(\'highlighted\')){jQuery(this).removeClass(\'highlighted\');'+
			'if(Array.isArray(window.get_selected_post_ids())){window.select_count(-1);}'+
			'}else{jQuery(this).addClass(\'highlighted\');'+
			'if(Array.isArray(window.get_selected_post_ids())){window.select_count(1);}}}return false;');
		jQuery(this).addClass('orly');
		jQuery(this).append('<input class="itags" type="hidden" value=""/>');	
	});
	var id = 0;
	if(jQuery('.brick').length !== jQuery('.with_reblog_key').length && Object.keys(window.reblog_keys).length > 0){
		jQuery('.brick').not('.with_reblog_key').each(function(){
			id = jQuery(this).attr('id').substring(5);
			if(typeof window.reblog_keys[id] === 'undefined')
				return true;
			var re_key = window.reblog_keys[id];
			jQuery(this).attr({'data-reblog-key': re_key});
			jQuery(this).addClass('with_reblog_key');
			jQuery(this).attr('title', new Date(parseInt(jQuery(this).attr('class').replace(/\D/g, '')) * 1000 + (1000 * 60)));
			if(typeof window.is_reblog_info[id] !== 'undefined'){
				if(window.is_reblog_info[id]===true){
					jQuery(this).addClass('is_reblog');
				}else{
					jQuery(this).addClass('is_original');
				}
			}
		});
	}
	if(jQuery('.brick,.null_brick').length !== jQuery('.with_tags').length && Object.keys(window.reblog_keys).length >0){
		jQuery('.brick').not('.with_tags').each(function(){
			id = jQuery(this).attr('id').substring(5);
			if(window.new_show_these_selected){
				jQuery(this).removeClass("brick").removeClass("highlighted").addClass("null_brick");
			}
			if(typeof window.posted_tags[id] === 'undefined')
				return true
			if(typeof window.note_count_info[id] !== 'undefined'){
				var count = (isNaN(window.note_count_info[id]))? 0 : window.note_count_info[id];
				jQuery(this).find(".highlight").append(
					jQuery("<div/>").attr("class","tag_count right").text(count+" notes")
				);
			}
			jQuery(this).addClass('with_tags');
			var inner_tags = escape(window.posted_tags[id].join(','));
			jQuery(this).find("input.itags").val(inner_tags);
		});
		jQuery(".brick:not(.with_tags) .private_overlay").each(function(){
			var id = jQuery(this).parents(".brick").attr('id').substring(5);
			if(window.fetch_edits_id.indexOf(id)===-1){
				window.fetch_edits_id.push(id);
				window.fetch_edits.push(function(){
					var id = window.fetch_edits_id[0];
					jQuery.ajax({
						url: 'https://www.tumblr.com/svc/post/fetch',
						type: 'post',
						data: '{"post_id":"'+ id +'","post_type":false,"form_key":"'+ window.user_form_key +'"}',
						success: function(x){
							if(x.hasOwnProperty("post") && x["post"].hasOwnProperty("is_reblog") && jQuery.type(x["post"]["is_reblog"])==="boolean"){
								jQuery("#post_"+id).addClass(x["post"]["is_reblog"]?"is_reblog":"is_original");
							}
							if(x.hasOwnProperty("post") && x["post"].hasOwnProperty("tags") && Array.isArray(x["post"]["tags"].split(','))
							|| x.hasOwnProperty("post") && x["post"].hasOwnProperty("tags") && Array.isArray(x["post"]["tags"])){
								var inner_tags = escape(Array.isArray(x["post"]["tags"])?x["post"]["tags"].join(','):x["post"]["tags"]);
								jQuery("#post_"+id).find("input.itags").val(inner_tags);
							}
							jQuery("#post_"+id).addClass('with_tags');
							jQuery("#post_"+id).addClass('private');
							window.fetch_edits.shift();
							window.fetch_edits_id.shift();
							if(jQuery.type(window.fetch_edits[0])==="function")
								window.fetch_edits[0]();
						}
					});
				});
			}
		});
		if(jQuery.type(window.fetch_edits[0])==="function")
			window.fetch_edits[0]();
	}
	window.maybe_done++;
	if(window.maybe_done >= 10 || jQuery('.brick,.null_brick').length === jQuery('.with_tags').length){
		window.make_inline_tags(window._sel);
		window.maybe_done = 0;
	}
}
if(jQuery(".l-content").length === 0){
	jQuery("#nav_archive").after(
		'<div id="content" class="l-content" unselectable="on"></div>'
	);
}
if(jQuery("#content").length === 0){
	jQuery(".l-content").eq(0).attr("id","content");
}
var new_widget_bg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAJYCAMAAACjPuSwAAA'+
					'B6VBMVEXb29sAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
					'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
					'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACvr6/Pz8/Y2Njb29vOzs6xsbHV1NXQz9'+
					'DPzs/Pz8/Q0NDPz8/Q0NHR0dHS0dLS0tLS0tPY2NjR0dLT09PT09TU1NTU1NXT1NTV1db'+
					'V1tbV1tfW1tfW19jX19jX2NnY2NkAAADY2drZ2drZ2trZ2tsAAADa29wAAAAAAAAAAAAA'+
					'AAAAAAAAAAAAAAAAAADNzc2mpqbU1NSnp6fJycmnp6fLy8vY2NgAAAAAAAAAAAAAAAAAA'+
					'AAAAAAAAAAAAAAAAACtqaGalo+koJh9enS1saino5uem5OyrqWjoJiRjYavq6KGg3ywrK'+
					'RVU06jn5eqpp2MiYKno5usqKCwrKSXk4yzr6ayrqWOi4OxraSkoZhqZ2KnpJuuq6KHhH2'+
					'qpp6xraWzr6atqaGdmpK1saiUkYmfm5OLh4B3dG6cmJGtqaCjn5eRjYazr6azr6a0sKeq'+
					'pp6rp5+vrKOzr6aopZywrKSxraW0sKetqaGyrqVd82YDAAAAo3RSTlMAAQIDBAUGBwgJC'+
					'gsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiMkJSYnKSpasuj/pl3//////7jb29vb2+7b29'+
					'vb29vb29vb29vb2yjb29vbLNstLi8wMjQ1Mbpj/2aqarnsKzc5Ojw+O0AzyIOeWf+afeK'+
					'LYMVR1DR4lkuHpcNa4dJKwnYmc6I1g8HQklTvRVMzIECAUDC/z99wb32+THx7vUl6cUMU'+
					'aQAACL9JREFUeAHs0zXWZjcQBuGqbn2wAXM8s/+9GDIzOzPTVfcPZmYYHT0XFdd55VuyL'+
					'a6/X9ofHxa0Yzf3GgEEBIWvbuRHbLbfZP8/g/dX91cfWkAQRUXc0deL3jTd/dUPAwQJDL'+
					'+C8mPS/KYtiv+hbvorhWUzELwTRhgGKj+mxSNrR2+qq6usjqYHIBpGRkQaquCO/ifk5P+'+
					'moW9Vz6qadNEOgDDMyDsRobrK0nd0vmpeNW/hjIoaoGjeelxl+ysG/1vd/Z6TaSt+NfMx'+
					'nmq2pfn2ccyarRgZI8czRSpYybaUGQ3dk3jzmEfNAWpEns6fZUCfVNkW0qP7S5V5PnVHO'+
					'/Cr6Hn+TPRaqbItpLvn+bNuOWdWlANQI/MDxKuXDmRbSFPjuH7W8kHmVAeAkTmAvprupa'+
					'+mOyrn9WNhzJwywDsRwKkupoEsZGtK/Px0QITfLT3iwetodhqJIEvYGhoqjpzCgxciZAC'+
					'K8fKgNIw0WMYmUElHWfByiA5U1IcvkYoQBAvZKiaiefDwOcUAUA3AewQr2QLvAfFdYO+w'+
					'vu2Hq1bWtylA/Lg3sppNvs/gnjfs1sENWkEMhkH7QSME+q8IQiOA49UqUQ655sDufJIrm'+
					'MNv1ls0nY/YLkGHLuiCLuiCLuiCLuiCLuiCLuiCLuiCLuiCDl3QBV3QBV3QBV3QBV3QBV'+
					'3QBV3QBV3QBR26oAu6oAu6oAu6oAu6oAu6oAu6oAu6oAs6dEEXdEEXdEEXdEEXdEEXdEE'+
					'XdEEXdEEXdOiCLuiCLuhfG/TMvGVo/do5c6JX1b1C69fOVY0umy6bvmY2PTPyeO6Arnwe'+
					'Qzu6nKflm9JHyCOnTdArqiq0fsO5BnpzV/3YAV3tXNHok/9xCq3f6TG0j5jVK7R+r/rrk'+
					'avQHtVE125Bhy7ogi7ogi7ogi7ogi7ogi7ogi7ogi7ogg5d0AVd0AVd0AVd0AVd0AVd0A'+
					'Vd0AVd0AUduqALuqALuqALuqALuqALuqALuqALuqALOnRBF3RBF3RBF3RBF3RBF3RBF3R'+
					'BF3RBF3Togi7ogi7ogi7ogi7ogi7ogi7ogi7ogi7ogg5d0AVd0AVd0AVd0AVd0AVd0AVd'+
					'0AVd0AUduqALuqALuqALuqALuqALuqALuqALuqALOnRBF3RBF3RBF3RBF3RBF3RBF3RBF'+
					'3RBF3Togi7ogi7ogi7ogi7ogi7ogi7ogi7ogi7o0AVd0AVd0AVd0AVd0AVd0AVd0AVd0A'+
					'Vd0AUduqALuqALuqALuqALuqALuqALuqALuqALOnRBF3RBF3RBF3RBF3RBF3RBF3RBF3R'+
					'BF3Togi7ogi7ogi7ogi7ogi7ogi7ogi7ogi7o0AVd0AVd0AVd0AVd0AVd0AVd0AVd0AVd'+
					'0KELuqALuqALuqALuqALuqALuqALuqALuqALOnRBF3RBF3RBF3RBF3RBF3RBF3RBF3RBF'+
					'3Togi7ogi7ogi7ogi7ogi7ogi7ogi7ogi7o0AVd0AVd0AVd0AVd0AVd0AVd0AVd0AVd0K'+
					'ELuqALuqALuqALuqALuqALuqALuqALuqBDF3RBF3RBF3RBF3RBF3RBF3RBF3RBF3RBF3T'+
					'ogi7ogi7ogi7ogi7ogi7ogi7ogi7ogi7o0AVd0AVd0AVd0AVd0AVd0AVd0AVd0AVd0KEL'+
					'uqALuqAL+pcEPc+xfjrnH/TMvL5j/fS+tvVAz4zMnxnrp3Zu7SO6oQ59h3KYe+R873sFv'+
					'WL9VL/RK6o+F+g7VJdP1UCP6u7Qd6iduyPkkdsk6Jl5y1g/tXPmRN9q0216o8umC7qgC7'+
					'qgC7qgC7qgC7qgC7qgC7qgC7qgQxd0QRd0QRd0QRd0QRd0QRd0QRd0QRd0QYcu6IIu6II'+
					'u6IIu6IIu6IIu6IIu6IIu6IIOXdAFXdAFXdAFXdAFXdAFXdD/V9ArVkv1T/RivYn+r/bp'+
					'IW6WKwjD+FOnz8ydL7Ztcxcuw12yiW3bts1N7H2yDXexbdvp291Vb6a/iW3M7X/jYPv8S'+
					'qPo6npPW5QYkUY/SQTjpBOTVb8uDGQAtcDz5BIp6IyTAA05qPVt9IAkRQoKNzA6Y0EgPB'+
					'RSghhFRxKSns5InsOiKz5mRCjMJXhaEspAu8air0DdbwqSzOiMEUkRnmqDRR8XUgZQRDw'+
					'zACsHbk0yOmNFYa7SgGciQmRQK2Kmj2UqB1OLMKMzRiR5KoWY6fOQvpl0d1/oUZn0Wc9t'+
					'vKJ3NFQbiIVecw+RR5fhjeHLP27WWBSMlY4nGVruYYrGQ5IZKRVFzv3eug8y1jqr3FFXT'+
					'eNuhqUi5SL3+uua3ceY6qwu3VHVjQ8ZZsmKVOScezmv+VE/bHozfsAs+DWdwhr+e6TPlK'+
					'qZ72maumkaD1cGRGDeLnFnWvKFpSozDL7L5nifzq/Jcv5Sc70NzM1bcwH2FvMEkN4E5nW'+
					'A4g2+a+70Bj8ipHh60WfCG6/dI0LKIExyJBVepMfTo9ZN+h9UOH+p9ee/jQ3NHl6/B1rg'+
					'1kXCID0MLFw4kB/muza2h/kJGno8wlvhEsoAkSK5UHhhyYbA/gPRu+hMbGJmKrkFtqKcs'+
					'CsZmV5XMWkbmutgizxcNp9im167zVVsGddvYQVXsXkPv1Y7Nj27RCGPCA+FggzIRBhKyd'+
					'wSZkY36X9ICv5aM9gQJXuAVM5ge5DOAJjJ9oDeqRxQMHWX8w6qpuDlzEq5/KhktqacxRL'+
					'lPkWmKg8tpy9sKqHJJyShjAyhJCWFtfip6Ih/Xhf9zOPs6BOomB7sCGZ0IyqAQeHgFa8t'+
					'w/RNNf3EkZxcnXaCHQkVA1Uz+lEwUy+wqpjd84FoJEQgMsiQheFmxig5xg+Y+FUdE3+t+'+
					'nAYUHMIrb7tzciEDmTSQaP7mn7NINVQMxF1e8GAA4DDxYXn7iGEJCQEGZAhEGZg8N+J3k'+
					'VvgExDQyvfvwOstguQNbq5bJf2vMdlO5Abcmrai4dWbbI1sOelO7D6zpffR95RINBoQUb'+
					'L+M5ijJmOvvNHGK1pKXYXny8BhqIAjH3z8FUAAAAASUVORK5CYII=';
var small_widget_bg = 'https://secure.assets.tumblr.com/images/archive_browse_months_widget.png?alpha';
var wg = {
	position: 'fixed',
	zIndex: '15000',
	top: '90px',
	width: '490px',
	height: '603px',
	padding: '8px 9px',
	background: "url('"+ new_widget_bg + "') no-repeat scroll left top transparent",
	font: 'bold 15px Arial,Helvetica,sans-serif',
	cursor: 'default'
};
var wg_s = {
	position: 'fixed',
	zIndex: '15000',
	top: '90px',
	left: '90px',
	width: '366px',
	height: '229px',
	padding: '8px 9px',
	background: "url('"+ small_widget_bg + "') no-repeat scroll left top transparent",
	font: 'bold 15px Arial,Helvetica,sans-serif',
	cursor: 'default'
};
window.way_too_big_to_animate = true;
if(typeof window.timerid_too_big_too_animate_5 === "number")
	clearInterval(window.timerid_too_big_too_animate_5);
if(typeof window.timerid_too_big_too_animate_10 === "number")
	clearInterval(window.timerid_too_big_too_animate_10);
window.is_mobile = false;
window.privy = true;
// three layer name getter
window.a_name = jQuery(".months a:eq(0)").attr("href").split(/\/+/)[2];
// in case month jumper is missing, usually in new blogs with 1 month
window.b_name = (document.location +'').split(/\/+/)[3];
if(jQuery.type(window.b_name)==="undefined" || window.b_name.length===0){
	window.b_name = window.a_name;
}
// if fail again, pause page and nab name from dash
if(jQuery.type(window.b_name)==="undefined"){
	jQuery.ajax({url:"https://www.tumblr.com/dashboard",async:false,type:"get",
		beforeSend: function(xhr) {
			xhr.setRequestHeader('X-Requested-With',{toString:function(){return '';}});
		},success:function(dash){
			window.b_name = jQuery(dash).find("#search_form input[name='t']").val();
			return;
		}
	});
}
window.nav = '#nav_archive';
window.startX = 0;
window.startY = 0;
window.boxs = jQuery('<div id="s_box"></div>');
window.shiftpress = 0;
window.endX = 0;
window.endY = 0;
window.is_mobile = false;
window.total_selected = 0;
window.select_count = function(x){
	window.total_selected += x;
	if(jQuery('.highlighted').length > 0){
		jQuery('#unselect').find('div.chrome_button').eq(0).html('<div class="chrome_button_left"></div>Unselect:'+
			jQuery('.highlighted').length +'<div class="chrome_button_right"></div>');
	}else{
		jQuery('#unselect').find('div.chrome_button').eq(0).html('<div class="chrome_button_left"></div>Unselect'+
			'<div class="chrome_button_right"></div>');
	}
	var private_count = 0;
	jQuery('.highlighted').each(function(i, hl){
		private_count += (jQuery(hl).find('.private_overlay').length > 0)? 1 : -1;
	});
	if(private_count > jQuery('.highlighted').length / 2){
		jQuery('#prvt .prvt').eq(0).html('make un-PRIVATE');
		window.privy = false;
	}else{
		jQuery('#prvt .prvt').eq(0).html('make PRIVATE');
		window.privy = true;
	}
}
window.tagsel_mode = "";
window.just_clicked_select_tags = false;
window.just_clicked_browse_blogs = false;
jQuery(window).bind("click", function(event){
	if(window.just_clicked_select_tags === false && event.pageY > jQuery(window.nav).height()){
		jQuery('#select_by_tag_widget').hide();
		jQuery('#backdate_widget').hide();
		jQuery('#photo_widget').hide();
		jQuery('#source_widget').hide();
		jQuery('.photo_on').unbind("click.bug").bind("click.bug", function(){
			jQuery(this).removeClass('photo_on');
		});
	}
	window.just_clicked_select_tags = false;
});
window.q_times = new Array();
window.pause_to_find_q_times = function(){
	jQuery.ajax({
		url: 'https://www.tumblr.com/blog/'+ window.b_name +'/queue',
		async: false,
		type: 'get',
		success: function(x){
			window.q_times = eval((x +'').match(/publishOnTimes:\s([^\n]+)\,\n/)[1]);
		}
	});
}
window.primary_blog = document.location.href.split(/\/+/)[3]!==undefined?document.location.href.split(/\/+/)[3]:""; // this guess will be wrong on secondary blogs
window.get_secondary_blogs = function(){
	jQuery.ajax({
		url:'https://www.tumblr.com/dashboard',
		// dataType:'html', // removed...
		type:'get',
		beforeSend: function(xhr) {
			xhr.setRequestHeader('X-Requested-With',{toString:function(){return '';}});
		},
		success:function(x){
			jQuery("#browse_months").before(
				'<div id="browse_blogs" onclick="window.just_clicked_browse_b' + 
				'logs = true;"><div id="jump_to_blog" ><span class="blog">Blo' + 
				'gs </span><span class="arrow"></span><div id="browse_blogs_w' + 
				'idget" class="popover popover_gradient" style="display:none"' + 
				' onclick="window.just_clicked_browse_blogs = true;" ><div cl' + 
				'ass="popover_inner" ><div class="blogs"><ul></ul></div></div' + 
				'></div></div></div>'
			);
			var tumblogs = window.setTumblelogs(x);
			if((x+'').match(/"userinfo"\s?:\s?\{"primary"\s?:\s?"([^"]+)",/)!==null)
			window.primary_blog = (x+'').match(/"userinfo"\s?:\s?\{"primary"\s?:\s?"([^"]+)",/)[1];
			jQuery.each(tumblogs, function(i, bl){
				var blog = bl.name;
				var b = (blog !== window.b_name);
				jQuery("#browse_blogs .blogs ul").append(
					'<li><a style="color:#0099ff;" target="_blank" href="/blog/' +
					blog + '">' + blog + '</a><a target="_blank" href="http://' +
					blog + '.tumblr.com/">visit</a>' +((!b)?' (selected)' : '') + 
					' <br/>'+ (b ? '<a title="Jump to the Mass Post Editor for' + 
					' this blog." href="/mega-editor/' + blog + '">':'<span>') + 
					'Mass Post Editor'+(b?'</a>':'</span>')+
					'•<a class="cantlikes" title="Copy selected posts here." o' + 
					'nclick="window.move_posts_to_another_blog(\'' + blog +
					'\',false, this);">Copy Here</a>•<a title="Reblog selected' + 
					' posts here." onclick="window.move_posts_to_another_blog(' + 
					'\'' + blog + '\', true, this);" class="cantqueue">Reblog ' + 
					'Here</a></li>'
				);
			});
			if(jQuery("#browse_blogs .blogs ul li").length>0){ // one blog bug
				jQuery("#browse_blogs .blogs ul").prepend(
					'<li><label for="NewAsDraft" style="font-weight:normal;lin' + 
					'e-height:18px;margin-bottom:7px;"><input id="NewAsDraft" ' + 
					'type="checkbox"/>New posts as draft for copy/reblog.</lab' + 
					'le></li><li><label for="NewAsTaggless" style="font-weight' + 
					':normal;line-height:18px;margin-bottom:7px;"><input id="N' + 
					'ewAsTaggless" type="checkbox"/>New posts have no tags.</l' + 
					'able></li>'
				);
			}
			jQuery('body').click(function(){
				if(jQuery("#browse_blogs_widget").length){
					if(window.just_clicked_browse_blogs){
						if (!jQuery("#browse_blogs_widget").is(":visible")){
							jQuery("#browse_blogs_widget").show()
						}
						window.just_clicked_browse_blogs = false
					}else{
						if(jQuery("#browse_blogs_widget").is(":visible")){
							jQuery("#browse_blogs_widget").hide()
						}
					}
				}
			});
			if(!window.main_page && !window.likes_editing){
				// added because you can't reblog from the drafts or queue
				jQuery('a.cantqueue').hide();
			}else if(window.likes_editing){
				jQuery('a.cantlikes').hide();
			}
		}
	});
}
window.originalChill = this.originalChill = window.jQuery.fn.children;
window.$.fn.children = function() {
// added because the masonry calls to display:none elements. this line prevents bad crash
	return window.originalChill.call(this).not(".null_brick");
};
window.jQuery.fn.children = function() {
	return window.originalChill.call(this).not(".null_brick");
};
jQuery("#browse_months").after('<div class="clear"></div>');
window.get_secondary_blogs();
window.month_array = ['nihil', 'January', 'February', 'March', 'April', 'May',
	'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var addCSS = jQuery('<style></style>');
jQuery(addCSS).attr({
	type: "text/css"
});
window.chrome_big_dark = function(title, big_dark){
	if(typeof(big_dark)==='undefined') big_dark = true;
	if(big_dark){
		return '<button type="button" class="chrome big_dark"><div class="chrom' + 
		'e_button"><div class="chrome_button_left"></div>' + title + '<div clas' + 
		's="chrome_button_right"></div></div></button>';
	}else{
		return '<div class="chrome_button"><div class="chrome_button_left"></div' +
		'>' + title +'<div class="chrome_button_right"></div></button>';
	}
}
jQuery(addCSS).html(
	'.header_button button.chrome{padding:0 4px!important}.null_brick{display:none!imp' + 
	'ortant;height:0!important;width:0!important}#tagsel div{position:relative;border-' + 
	'bottom:1px dotted #999;margin-bottom:3px;white-space:nowrap;overflow:hidden}#BD_b' + 
	'ody div{position:relative;margin-bottom:3px;white-space:nowrap;overflow:hidden}.b' + 
	'd_input{float:none;width:35px}.blue_bar{max-height:90px!important;}.bd_input:disa' + 
	'bled{color:#CCC}.blue_bar .editor_navigation{float:left!important}input,label{flo' + 
	'at:left}.chrome{margin-left:5px}.brick:not(.with_reblog_key),.brick:not(.with_tag' + 
	's){border:1px solid #bababa;margin:-1px;}.brick.with_tags{box-shadow: 1px 1px 3px' + 
	' 1px rgba(100, 100, 100, .3);}input.NOT_select_me,label.NOT_select_me{float:right' + 
	'}.header_button{margin-right:-5px!important;float:right}#delete_posts{border:1px ' + 
	'solid #ff0000!important;color:#FFF!important;background-color:#990000!important;}' + 
	'#toRepublish button{border:1px solid #ffcc00!important;color:#FFF!important;backg' + 
	'round-color:#ff9900!important;}.backdated.brick{-webkit-box-shadow:-1px 1px 4px 1' + 
	'px rgba(255,0,0,.9)!important;box-shadow:-1px 1px 4px 1px rgba(255,0,0,.9)!import' + 
	'ant}.backdated .highlight{border:3px solid rgba(255,0,0,.8)!important;background:' + 
	'none rgba(255,0,0,.4)!important}.highlighted.photo_on .highlight{background-color' + 
	':rgba(255,255,0,.7)!important;border-color:#ff0!important}.blog_link{background-c' + 
	'olor:#FFF;border-color:#999;border-style:solid;border-width:1px;bottom:1px;color:' + 
	'#666;font-weight:700;padding:5px;position:absolute;text-decoration:underline;z-in' + 
	'dex:99999}.blog_link.edit{left:1px;}.blog_link.view{right:1px;}.blue_bar .title{m' + 
	'in-width:500px!important;margin-bottom:5px!important}#browse_blogs_widget{positio' + 
	'n:fixed;width:375px;margin-left:-60px;}.old_archive #browse_blogs_widget{font-siz' + 
	'e:14px;left:-90px;position:absolute;top:38px}#browse_blogs_widget .popover_inner{' + 
	'overflow:hidden;padding:0}#browse_blogs_widget .blogs{box-shadow:1px 1px 0 #fff i' + 
	'nset;font-weight:700;width:100%}#browse_blogs_widget .blogs ul{border-top:1px sol' + 
	'id #d6d6d6;list-style:none;margin:0;padding:0;display:block;}#browse_blogs_widget' + 
	' .blogs ul li{display:block;border-bottom:1px solid #d6d6d6;border-top:1px solid ' + 
	'#fff;padding: 5px 0 5px 20px;list-style:none;line-height:27px;position:relative;d' + 
	'isplay:inline-block;width:355px;}#browse_blogs_widget .blogs ul li:last-child{bor' + 
	'der-bottom:0 none}#browse_blogs_widget .blogs ul li a,#browse_blogs_widget .blogs' + 
	' ul li span{display:inline;padding:10px;position:relative;z-index:2;}.blue_bar #b' + 
	'rowse_blogs{border-left:1px solid #465d75;float:left;margin:2px 0;padding: 0 15px' + 
	';}.blue_bar #browse_blogs #jump_to_blog{color:#abb6c1;cursor:pointer;font-weight:' + 
	'700;line-height:22px;margin-top:2px;position:relative;text-transform:capitalize}.' + 
	'blue_bar #browse_blogs #jump_to_blog .arrow{border-left:6px solid transparent;bor' + 
	'der-right:6px solid transparent;border-top:6px solid #abb6c1;display:inline-block' + 
	';height:0;margin-left:4px;position:relative;top:-1px;width:0}.header_button.activ' + 
	'e button{border:1px #33ccff solid !important;background-color:#0099cc!important;c' + 
	'olor:#fff!important;}#browse_blogs_widget a{cursor:pointer;}.blue_bar .editor_nav' + 
	'igation .header_button button.chrome{font-size:13px!important;}#photo_widget text' + 
	'area,#photo_widget input,#backdate_widget input,#source_widget input{background-c' + 
	'olor: rgba(255, 255, 255, 0.75);}#photo_widget label{margin:0 8px;}.tag_count{dis' + 
	'play:block!important;}#add_tags_widget ul.ui-autocomplete.ui-menu.ui-widget.ui-wi' + 
	'dget-content.ui-corner-all{top:198px!important;}#tags div{display:inline-block!im' + 
	'portant;}#tag_count_input{height:10px;position:relative;top:-1px;width:35px;}.tag' + 
	'_count.right{border-radius: 5px 0 0 !important;left:auto!important;right:0!import' + 
	'ant;max-width:72px;overflow:hidden;}#more_notes,#less_notes{display:inline-block;' + 
	'float:none;height:13px;margin-right:6px;margin-top:0;padding:0;position:relative;' + 
	'vertical-align:bottom;width:45px;}#note_count i{color: #999;}#note_count label[fo' + 
	'r="less_notes"],#note_count label[for="more_notes"]{color:#333;}.brick,.brick div' + 
	',.brick img{-moz-user-select:none;-webkit-user-select:none;-webkit-user-drag:none' + 
	';}#tagsel input {min-height:20px;padding:0!important;}.over_caption{background-co' + 
	'lor:rgba(90,80,80,0.6);bottom:0;color:#fff;font-weight:bold;left:0;overflow:hidde' + 
	'n;padding:4px;position:absolute;right:0;text-shadow:1px 2px 3px #666;top:0;z-inde' + 
	'x:10;}#tagsel .selcount{color:#009bff;right:0;}#tagsel .tagcount,#tagsel .selcoun' + 
	't{padding-right:4px;max-height:80px;max-height:50p;x;overflow:auto;max-width:80px' + 
	';font-weight:bold;position:absolute;}#tagsel .tagcount{color:#660066;right:90px;}' + 
	'#tag_away{position:absolute;left:300px;bottom:38px;font-size:12px;font-weight:nor' + 
	'mal;width:100px;}#tagsel label{max-width:270px;white-space:normal;}.duplicate_mai' + 
	'n.brick{-webkit-box-shadow:-1px 1px 4px 1px rgba(155,155,255,.9)!important;box-sh' + 
	'adow:-1px 1px 4px 1px rgba(155,155,255,0.9)!important}.duplicate_main .highlight{' + 
	'border:3px solid rgba(155,155,255,.8)!important;background:none rgba(155,155,255,' + 
	'.4)!important}'
);
window.processing_message = "There is currently a task processing. "+
							"Please wait to start another.";
window.uniq = function(array){
	var u = {},
		a = [];
	for(var i = 0, l = array.length; i < l; ++i){
		if(u.hasOwnProperty(array[i])){
			continue;
		}
		a.push(array[i]);
		u[array[i]] = 1;
	}
	return a;
}
jQuery('head').eq(0).append(addCSS);
jQuery(window.nav +' a').eq(0).css({
	fontSize: '17px'
});
jQuery(window.nav +' a').eq(0).removeAttr('href');
jQuery(window.boxs).css({
	position: 'absolute',
	opacity: '0.4',
	border: '#00F 1px solid',
	display: 'none',
	zIndex: '999999',
	backgroundColor: '#FFF'
});
jQuery('#body').append(window.boxs);
window.lite_mode_ = function(){
	window.build_columns = function(){
		rebuilding_columns = false;
	};
	jQuery('#custom_gutter').hide();
	jQuery('#lite_mode').attr('title', 'Lite mode engaged. Reload to reactivate heavy mode.');
	jQuery('#lite_mode').attr('disabled', 'disabled');
	jQuery('#lite_mode').html(window.chrome_big_dark('Lite Engaged',0));
	var addCSS = jQuery('<style></style>');
	jQuery(addCSS).attr({
		type: "text/css"
	});
	jQuery(addCSS).html(
		'#content .brick{display: inline-block !important;float: none !important;lef' + 
		't: 0 !important;position: relative !important;top: 0 !important;vertical-al' + 
		'ign: middle !important; max-height:125px;}#content .heading{display: block ' + 
		'!important;float: none !important;left: 0 !important;position: relative !im' + 
		'portant;top: 0 !important;}#content {width: 100% !important;}'
	);
	jQuery('head').eq(0).append(addCSS);
}
window.orly = function(){
	if(jQuery('#remove_tags_widget').is(':visible') || jQuery('#select_by_tag_widget').is(':visible') || jQuery(
			'#add_tags_widget').is(':visible') || jQuery('#backdate_widget').is(':visible') || window.just_clicked_select_tags ||
		window.just_clicked_remove_tags || window.just_clicked_add_tags)
		return false;
	else
		return true;
}
window.momove = function(event){
	window.endX = event.pageX;
	window.endY = event.pageY;
	if(Math.abs(event.pageY - window.startY) < 25 && Math.abs(event.pageX - window.startX) < 25){
		return false;
	}
	if(event.pageY < jQuery(window.nav).height() + jQuery(window.nav).scrollTop() || !window.orly())
		return true;
	if(window.startX <= window.endX){ //to right
		window.jQuery("#s_box").css({
			left: window.startX +'px',
			width: (window.endX - window.startX) +'px'
		});
	}else{ //to left
		window.jQuery("#s_box").css({
			left: window.endX +'px',
			width: (window.startX - window.endX) +'px'
		});
	}
	if(window.startY <= window.endY){ //to down
		window.jQuery("#s_box").css({
			top: window.startY +'px',
			height: (window.endY - window.startY) +'px'
		});
	}else{ //to up
		window.jQuery("#s_box").css({
			top: window.endY +'px',
			height: (window.startY - window.endY) +'px'
		});
	}
	jQuery('.brick').each(function(i, brick){
		var boxs_left = jQuery("#s_box").offset().left;
		var boxs_top = jQuery("#s_box").offset().top;
		var boxs_right = jQuery("#s_box").offset().left + jQuery("#s_box").width();
		var boxs_bottom = jQuery("#s_box").offset().top + jQuery("#s_box").height();
		var brick_left = jQuery(brick).offset().left;
		var brick_top = jQuery(brick).offset().top;
		var brick_right = jQuery(brick).offset().left + 125;
		var brick_bottom = jQuery(brick).offset().top + jQuery(brick).height();
		if(boxs_left <= brick_right && boxs_right >= brick_left && boxs_top <= brick_bottom && boxs_bottom >= brick_top){
			if(!jQuery(brick).hasClass('highlighted') && jQuery('.highlighted').length < 100){
				jQuery(brick).addClass('highlighted');
				if(Array.isArray(window.get_selected_post_ids()))
					window.select_count(1);
				if(window.shiftpress === 1)
					jQuery(brick).addClass('shifttemp');
			}
		}else if(window.shiftpress === 0 || jQuery(brick).hasClass('shifttemp')){
			if(jQuery(brick).hasClass('highlighted')){
				jQuery(brick).removeClass('highlighted');
				window.select_count(-1);
			}
		}
	});
	event.stopPropagation();
}
jQuery(window).bind("mousedown", function(event){
	window.startX = event.pageX;
	window.startY = event.pageY;
	if(event.pageY < jQuery(window.nav).height() + jQuery(window.nav).scrollLeft() || window.just_clicked_select_tags ||
		window.just_clicked_remove_tags || window.just_clicked_add_tags
		|| event.pageY < jQuery("#nav_archive").offset().top + jQuery("#nav_archive").height())
		return true;
	jQuery("#s_box").css({
		width: '1px',
		height: '1px',
		display: 'block'
	});
	jQuery('body').bind('mousemove', window.momove);
	event.stopPropagation();
});
jQuery(window).bind("mouseup", function(event){
	if(window.just_clicked_select_tags || window.just_clicked_remove_tags || window.just_clicked_add_tags
	|| event.pageY < jQuery("#nav_archive").offset().top + jQuery("#nav_archive").height())
		return true;
	jQuery("#s_box").css({
		width: '1px',
		height: '1px',
		top: '0',
		left: '0',
		display: 'none'
	});
	jQuery('body').unbind('mousemove', window.momove);
	jQuery('.brick').each(function(i, brick){
		jQuery(brick).removeClass('shifttemp');
	});
	event.stopPropagation();
});
jQuery(window).bind("keydown", function(event){
	if(event.shiftKey === true || event.which === 16 || event.keyCode === 16)
		window.shiftpress = 1;
});
jQuery(window).bind("keyup", function(event){
	if(event.keyCode === 27 || event.which === 27){
		if(jQuery('#select_by_tag_widget').is(":visible") || jQuery('#backdate_widget').is(":visible")
		|| jQuery('#photo_widget').is(":visible") || jQuery('#add_tags_widget').is(":visible")
		|| jQuery('#remove_tags_widget').is(":visible") || jQuery('#source_widget').is(":visible")){
			jQuery('#select_by_tag_widget').hide();
			jQuery('#backdate_widget').hide();
			jQuery('#photo_widget').hide();
			jQuery('#source_widget').hide();
			jQuery('#add_tags_widget').hide();
			jQuery('#remove_tags_widget').hide();
		}else{
			jQuery("#unselect").click();
		}
	}
	if(event.shiftKey === true || event.which === 16 || event.keyCode === 16){
		window.shiftpress = 0;
	}
});
window.abort_to_switch_page = function(){
	if(window.ajax_going.abort === 'function'){
		window.ajax_going.abort();
	}
}
window.err_option = "";
window.fetch_edit_submit = function(success){
	var r = window.fetch_ids_queue.length - 1;
	var id = window.fetch_ids_queue[r];
	jQuery('#post_'+id).addClass('photo_on');
	var change = window.fetch_change_queue[r];
	if(Array.isArray(change) && change[0] === 'channel_id' && change[2] === "reblog" && typeof window.reblog_keys[id] === 'undefined'){
		return false;
	}
	jQuery.ajax({
		url: 'https://www.tumblr.com/svc/post/fetch',
		type: 'post',
		data: '{'+
			  ((Array.isArray(change) && change[2] === 'reblog')?
			  	'"reblog_id":"' + id + '",' +
			  	'"reblog_key": "' + window.reblog_keys[id] + '",'
			  :
			  	'"post_id":"'+ id + '",'
			  ) +
			  '"channel_id":"' + window.b_name + '",' +
			  '"post_type":false,' +
			  '"form_key":"'+ window.user_form_key +'"}',
		success: function(x){
			var post_object = x;
			var reblog_name = ((post_object["post"]["reblog_name"] !== null)? post_object["post"]["reblog_name"] : window.b_name)
			var reblog_post_id = ((post_object["post"]["parent_id"] !== null)? post_object["post"]["parent_id"] :
				((post_object["post"]["root_id"] !== null)? post_object["post"]["root_id"] : id));
			jQuery.ajax({
				url: 'https://www.tumblr.com/svc/secure_form_key',
				type: 'post',
				data: '',
				headers: {
					'X-tumblr-form-key': window.user_form_key
				},
				success: function(x2, b, r){
					var sform_key = r.getResponseHeader('X-tumblr-secure-form-key');
					var edit = (Array.isArray(change) && change[0] !== 'channel_id');
					var new_post = (Array.isArray(change) && change[0] === 'channel_id' && change[2] !== "reblog");
					var new_audio = (new_post && jQuery("#post_"+id).hasClass("audio") && post_object["post"].hasOwnProperty("audio_url"));
					var new_video = (new_post && jQuery("#post_"+id).hasClass("video") && post_object["post"].hasOwnProperty("video")
									&& post_object["post"]["video"].hasOwnProperty("embed_code"));
					var ch = (function(key,val){
						if(jQuery.type(val) === "undefined"){
							return Array.isArray(change) && change[0] === key;
						}else{
							return ch(key) && jQuery.type(change[2]) === "string" && change[2] === val;
						}
					});
					var isset = function(val, type){
						if(jQuery.type(type) === "undefined") type = jQuery.type(val);
						return jQuery.type(val) !== "undefined"
								&& val !== null
								&& val !== false
								&& jQuery.type(val) === type
								
					}
					var name_or_id = isset(post_object["post_tumblelog"]) && isset(post_object["post_tumblelog"]["name_or_id"])?
										post_object["post_tumblelog"]["name_or_id"]: window.b_name;
					var changes_to_post = {
    					"channel_id": name_or_id,
						"form_key": window.user_form_key,
						"errors": false,
						"context_page": "dashboard",
						// context page queue/drafts? maybe not needed
    					// "post": post_object.post, // maybe these are vestigial ? ??
    					// "post_tumblelog", post_object["post_tumblelog"],
						"silent": true,
						"context_id": name_or_id,
						"editor_type": "html",
						"is_rich_text[one]": "0",
						"is_rich_text[two]": "0",
						"is_rich_text[three]": "0",
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
						// this post[state] bugger is tricky... 0_o
						"post[state]": (new_post?
								(jQuery("#NewAsDraft").prop('checked')?
									"1"
								:
									"0 3"
								)
							:
								jQuery("#NewAsDraft").prop('checked') && change[2] !== undefined && change[2] === "reblog"?
									"1"
								:
								(ch("post[state]")?
									change[1] // make private or draft
									:
									ch("post[publish_on]") ?
										"on.2"
									:
									(isset(post_object.post.state)?
										(post_object.post.state.toString() === "0" ?
											"0 3" // tricky +3, because 0 sometimes makes private!
											:
											post_object.post.state
										)
										:
										"0 3"
									)
								)
							)
    				};
					var d = (ch("post[date]")?
								change[1] // backdated
								:
								(new_post?
									""
									:
									(isset(post_object.post.date)?
										post_object.post.date
										:
										""
									)
								)
							);
					changes_to_post["post[date]"] = d;
					if(ch("post[publish_on]")){
						changes_to_post["post[publish_on]"] = change[1];
					}
					if(new_post){
						jQuery.extend(changes_to_post,{
							"post[publish_on]": "",
							"context_id":change[1], // new posted to other blog
							"channel_id":change[1]
						});
						changes_to_post.post = {};
					}else{
						if(ch("channel_id","reblog")){ // this is a reblog
							jQuery.extend(changes_to_post,{
								"channel_id": change[1],
								"detached": true,
								"reblog": true,
								"reblog_id": id.toString(),
								"reblog_key": window.reblog_keys[id],
								"is_recommended": false,
								"placement_id": false,
								"rbpt": "",
								"post[publish_on]": "",
								"safe_edit": true,
								"post_context_page": "dashboard",
								"created_post": (isset(post_object["created_post"])?post_object["created_post"]:true),
								"post[tags]":jQuery("#NewAsTaggless").prop("checked")&&change[0]==='channel_id'?"":unescape(jQuery('#post_'+id+' .itags').val())
							});
						}else{						
							// NOT a new post, edited
							jQuery.extend(changes_to_post,{
								"channel_id": name_or_id,
								"context_id": name_or_id,
								"post_id": id.toString(),
								"edit": true,
								"safe_edit": true,
								"post_context_page": "dashboard",
								"created_post": (isset(post_object["created_post"])?post_object["created_post"]:true),
								"user": (isset(post_object.user)?post_object.user:{}),
								"message": (isset(post_object.message)?post_object.message:"")
							});
						}
						if(reblog_post_id.toString().length > 0){ // these two
							jQuery.extend(changes_to_post,{
								"reblog_post_id": reblog_post_id
							});
						}
						if(reblog_name.toString().length > 0){ // should only set in reblog
							jQuery.extend(changes_to_post,{
								"context_id": reblog_name
							});
						}
					}
					if(ch("post[three]") && jQuery("#post_"+id).hasClass("is_reblog")){
						changes_to_post["post[source_url]"] = change[1];
					}else if(isset(post_object.post["source_url"])){
						changes_to_post["post[source_url]"] = post_object.post["source_url"];
					}else if(ch("post[three]") && !new_audio){
						changes_to_post["post[three]"] = change[1];
					}else if(new_audio){
						changes_to_post["post[three]"] = isset(post_object.post["audio_url"])?
							post_object.post["audio_url"] : "";
					}
					if(ch("post[two]")){
						var t_two = isset(post_object.post.two)? post_object.post.two: "";
						var exists = t_two.match(change[1]) !== null;
						if(jQuery("#cap_over").prop("checked")){
							changes_to_post["post[two]"] = change[1];
						}else if(jQuery("#cap_above").prop("checked")){
							changes_to_post["post[two]"] = exists? t_two :
								change[1] + ' ' + t_two;
						}else if(jQuery("#cap_under").prop("checked")){
							changes_to_post["post[two]"] = exists? t_two :
								t_two + ' ' + change[1];
						}
						window.captions_info[id] = jQuery('<div/>').html(changes_to_post["post[two]"]).text().replace(/\n+/g," ");
						if(window.visible_blog_captions){
							window.view_post_captions(false);window.view_post_captions(true);
						}
					}
					if(ch("post[one]")){
						changes_to_post["post[one]"] = change[1];
					}
					if(ch("post[source_url]")){
						changes_to_post["post[source_url]"] = change[1];
					}
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
							changes_to_post["images["+photo.id+"]"] = edit ? "" : src;	
							changes_to_post["caption["+photo.id+"]"] = isset(photo.caption)? photo.caption: "";
						});
						changes_to_post["post[photoset_layout]"] = isset(post_object.post["photoset_layout"]) ? post_object.post["photoset_layout"]: oneone;
						changes_to_post["post[photoset_order]"] = order.replace(/,$/,'');
						changes_to_post["MAX_FILE_SIZE"] = "10485760";
					}
					if(new_audio){
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
					if(new_video){
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
						// finally submit the new post object
						url: 'https://www.tumblr.com/svc/post/update',
						type: 'post',
						headers: {
							'X-tumblr-form-key': window.user_form_key,
							'X-tumblr-puppies': sform_key
						},
						// now in stringify instead of a string, special thanks to gracefulally from greasyfork for the revelation!
						data: JSON.stringify(changes_to_post),
						error:function(x){
							window.err_option = " Certain posts had 404 errors on svc/post/update.";
							window.fetch_edit_queue.pop();
							window.fetch_change_queue.pop();
							window.fetch_ids_queue.pop();
							r = window.fetch_ids_queue.length - 1;
							if(jQuery.type(window.fetch_edit_queue[r]) === "function"){
								window.fetch_edit_queue[r]();
							}
							success(0);
						},
						success: function(){
							success(id);
							window.fetch_edit_queue.pop();
							window.fetch_change_queue.pop();
							window.fetch_ids_queue.pop();
							r = window.fetch_ids_queue.length - 1;
							if(jQuery.type(window.fetch_edit_queue[r]) === "function"){
								window.fetch_edit_queue[r]();
							}
						}
					});
				}
			});
		}
	});
}
window._100 = function(x){
	return(x +'').replace(/(tumblr.com\/.*?)_(500|250|1280)\.(png|jpe?g|gif|bmp)/i, "$1_100.$3");
}
window.ajax_going = 1;
window.queue_page = 1;
window.month_array = ['nihil', 'January', 'February', 'March', 'April', 'May',
	'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var d = new Date();
window.moi = d.getMonth() + 1;
window.month_header = window.month_array[window.moi] +' '+ new Date().getFullYear();
window.position_timestamp = Date.parse(new Date());
window.day = d.getDay();
window.bb = d.getDate();
window.by = d.getFullYear();
window.last_oi = d.getMonth() + 1;
window.last_b = d.getDate();
window.last_y = d.getFullYear();
window.first_date_ketchup = true;
window.parse_weekday_context = function(pa){
	var d = new Date();
	var day_array = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
	var th = d.getHours();
	var tm = d.getMinutes();
	var time = (th > 12)? (th - 12) +':'+ tm +'pm' : th +':'+ tm +'am';
	var r = new Array();
	if(typeof pa === 'undefined'){
		r[0] = window.position_timestamp + 1; //timestamp
		r[1] = "Private Post"; // date string
		return r;
	}else if(Object.prototype.toString.call(pa) === '[object Array]'){
		var ds = pa[0] +'';
		di = (ds === "Sun")? 0 :
			(ds === "Mon")? 1 :
			(ds === "Tue")? 2 :
			(ds === "Wed")? 3 :
			(ds === "Thu")? 4 :
			(ds === "Fri")? 5 :
			(ds === "Sat")? 6 :
			d.getDay();
		if(di !== window.day){
			window.bb++
			window.day = di;
		}
		if(window.bb > new Date(window.by, window.moi, 0).getDate()){
			window.moi++;
			window.bb = 1;
			if(window.moi > 12){
				window.by++;
			}
		}
		y = window.by;
		b = window.bb;
		oi = window.moi;
		window.last_oi = oi;
		time = pa[1] +'';
	}else if(jQuery(pa).hasClass('permalink')||jQuery(pa).hasClass('post_permalink')){
		var oi = 1; //mo
		var di = d.getDay();
		var y = window.last_y;
		var b = window.last_b; //day of mo
		var rday = jQuery(pa).attr('title') +'';
		if(rday.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/) !== null){
			while(oi < window.month_array.length){
				if(rday.match(window.month_array[oi] +'') === null){ //month
					oi++;
				}else{
					break;
				}
			}
		}else{
			oi = window.last_oi;
		}
		if(rday.match(/\d{4},/) !== null){ //not this year
			y = parseInt((rday +'').match(/(\d{4}),/)[1]);
		}
		var diy = new Date(window.last_y, window.last_oi - 1, window.last_b).getDay();
		if(rday.match(/(Sun|Mon|Tue|Wed|Thu|Fri|Sat)/) !== null){ //day of week
			var ds = rday.match(/(Sun|Mon|Tue|Wed|Thu|Fri|Sat)/)[0];
			di = (ds === "Sun")? 0 : (ds === "Mon")? 1 : (ds === "Tue")? 2 : (ds === "Wed")? 3 : (ds === "Thu")? 4 : (ds === "Fri")? 5 : (ds === "Sat")? 6 : diy;
			if(di - diy < 0){
				b += di - diy;
				if(b < 1){
					oi--;
					if(oi < 1){
						oi = 12;
						y--;
					}
					b = new Date(y, oi, 0).getDate() + 1 + di - diy;
				}
			}
		}
		if(rday.match(/\d{1,2}[thndrs]{2},?/i) !== null)
			b = parseInt(rday.match(/(\d{1,2})[thndrs]{2},?/i)[1]);
		if(rday.match(/\d{1,2}:\d{2}[ap]m/)!==null)
			time = rday.match(/\d{1,2}:\d{2}[ap]m/)[0];
		window.last_b = b;
		window.last_y = y;
		window.last_oi = oi;
		di = new Date(y, oi - 1, b, 0, 0, 0, 0).getDay();
	}else if(jQuery(pa).hasClass('publish_on')){
		var pod = jQuery(pa).find('.publish_on_day').text();
		time = jQuery(pa).find('.publish_on_time').text().replace(/\s+/g,'');
		var ms = pod.replace(/[^A-Za-z]+/g,'');
		b = parseInt(pod.replace(/\D+/g,''));
		oi = (ms === "Jan")? 1 :
			(ms === "Feb")? 2 :
			(ms === "Mar")? 3 :
			(ms === "Apr")? 4 :
			(ms === "May")? 5 :
			(ms === "Jun")? 6 :
			(ms === "Jul")? 7 :
			(ms === "Aug")? 8 :
			(ms === "Sep")? 9 :
			(ms === "Oct")? 10 :
			(ms === "Nov")? 11 :
			(ms === "Dec")? 12 : 0;
		if(window.first_date_ketchup){
			window.first_date_ketchup=false;
			window.last_oi = oi;
		}
		if(oi < window.last_oi){
			window.last_y++;
		}
		window.last_oi = oi;
		y = window.last_y;
	}
	if(jQuery.type(di) === 'undefined'){
		di = new Date(y, oi - 1, b, th, tm, 0, 0).getDay();
	}
	th = (time.match(/pm$/) === null)? parseInt(time.match(/^\d{1,2}/)) : parseInt(time.match(/^\d{1,2}/)) + 12;
	tm = time !== null && time.match(/:(\d{2})/) !== null ? parseInt(time.match(/:(\d{2})/)[1]) : 0;
	r[0] = new Date(y, oi - 1, b, th, tm, 0, 0).getTime(); //timestamp
	r[1] = window.month_array[oi] + " "+ b + ", "+ y + " ("+ day_array[di] + " "+ time + ")"; // date string
	return r;
}
window.cumfound = 0;
window.paused = false;
window.last_page = false;
window.first_draft = true;
window.no_q_grab_overlap = false;
window.all_done_for_pause_button = function(){
	jQuery('#halt').text('DONE').css({
		'color':'#fff',
		'font-weight': 'bold',
		'font-size': '10px',
		'padding': '5px 0px 0px 6px'
	}).attr({
		'title':'no need to pause now, all done loading'
	}).unbind("click").addClass('done');
	jQuery('#loading').hide();
}
window.q_grab = function(){
	if(window.paused || window.rebuilding_columns || window.no_q_grab_overlap)
		return false;
	if(window.queue_page <= 1 && jQuery("#halt").hasClass('done')){
		jQuery("#halt").replaceWith(window.pause_button());
	}
	window.no_q_grab_overlap = true;
	jQuery('#loading').show();
	jQuery('#content').css({
		height: '100px',
		zIndex: '1'
	});
	var carry_over = function(){
		// added to load new blog links
		if(window.visible_blog_links){
			window.view_post_links(true);
		}
		// added to show captions if on
		if(window.visible_photo_captions){
			window.view_post_captions(true);
		}
	}
	if(window.likesmode === 1 && window.queue_rl.split(":")[0] === "api"){ // we can use api instead html.
		var api = 'fuiKNFp9vQFvjLNvx4sUwti4Yb5yGutBN4Xh10LXZhhRKjWlV4';
		var url = 'https://api.tumblr.com/v2/blog/' + window.lname + '.tumblr.com/posts?api_key=' + api +
				  '&limit=15&offset=' + window.queue_page + "&reblog_info=true";
		jQuery.ajax({ // this function is an api parallel universe to q_grab
			url:url,
			dataType:'jsonp',
			success:function(re){
				if(typeof re === "undefined" || typeof re !== "undefined"
				&& re.hasOwnProperty("meta") && re["meta"].hasOwnProperty("status")
				&& re["meta"]["status"] === 404){
					alert("This doesn't seem like a legitimate archive.");
					return;
				}
				if(typeof re !== "undefined" && re.hasOwnProperty("response") && re["response"].hasOwnProperty("posts")){
					if(re["response"]["posts"].length===0){
						// the done functions again for the archive
						clearInterval(window.timerid_get_queue_drafts);
						window.all_done_for_pause_button();
						window.make_inline_tags(window._sel);
						window.build_columns(true);
						window.not_after_complete = true;
						carry_over();
						return false;
					}
					window.queue_page+=15;
					var v_links = {};
					var post = re["response"]["posts"];
					var add_post = '';
					var head_extra = '';
					jQuery.each(post, function(k, v){
						var postid = v["id"];
						var postbody = "error";
						var postwidth = 125;
						var postheight = 125;
						var class_ts = v["timestamp"];
						var type = v["type"];
						var body = v.hasOwnProperty("body")?
							v["body"] : v.hasOwnProperty("caption") ?
								v["caption"] : 
								v.hasOwnProperty("question") || v.hasOwnProperty("answer") ?
									"<p>"+v["question"]+"</p><p>"+v["answer"]+"</p>":
										v.hasOwnProperty("text") || v.hasOwnProperty("source")?
											"<p>"+v["text"]+"</p><p>"+v["source"]+"</p>":
											"";
						var title_xtra = body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').
							replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
						var tags = jQuery.type(v["tags"]) === "array" ? v["tags"].length : 0;
						var inner_tags = tags>0? v["tags"].join(",") : "";
						var estags = escape(inner_tags);
						var doite = "in archive";
						var notes_count = (v.hasOwnProperty("note_count")? v["note_count"] : 0) + " notes";
						var with_re = "";
						if(v.hasOwnProperty("caption"))
							window.captions_info[postid] = jQuery('<div/>').html(v["caption"]).text().replace(/\n+/g," ");
						var pw = jQuery("<div></div>").html('<div class="post_content">'+body+'</div>');
						if(type === 'photoset' //photoset
						|| type === 'photo' //photo
						|| type === 'pano'){ //panoramo
							type = "photo";
							var imo = v["photos"][0]["alt_sizes"][0];
							jQuery.each(v["photos"][0]["alt_sizes"], function(i,img){
								if(img.width === 100){
									imo = img;
									return false;	
								}
							});
							var thumb = imo.url;
							var ph = imo.height;
							var twidth = imo.width;
							postheight = Math.floor(ph * (125 / twidth));
							if(postheight < 50)
								postheight = 50;
							postbody = '<img src="'+ thumb +'" style="width:125px;height:'+ph+';"/>';
						}else if(type === 'text' //regular post
						|| type === 'link' //url
						|| type === 'quote' //quote
						|| type === 'answer' //question/answer (note)
						|| type === 'chat'){ //chat (conversation)
							type = {
								"text":"regular",
								"answer":"note",
								"chat":"conversation",
								"quote":"quote",
								"link":"link"
							}[type];
							if(pw.find('img').length === 0 && pw.find('div.post_content').length >
								0){
								var string = ((pw.find('div.post_content').eq(0).html() +'').replace(/<[^>]+>/g,
									' ').replace(
									/\s+/g, ' ')).substring(0, 179);
								postbody = '<div class="overprint " style="overflow:hidden !important;">'+ string +'...</div>';
							}else if(pw.find('img').length > 0){
								var ph = parseInt(pw.find('img').eq(0).css('height'));
								var twidth = parseInt(pw.find('img').eq(0).css('width'));
								postheight = Math.floor(ph * (125 / twidth));
								if(postheight < 110) postheight = 110;
								postbody = '<img src="'+ pw.find('img').eq(0).attr('src') +
									'" style="width:125px;height:auto"/>';
							}
						}else if(type === 'video'){ //video
							type = "video";
							var thumb = v["thumbnail_url"];
							postheight = v["thumbnail_height"] * (125 / v["thumbnail_width"]);
							var img = '<img src="'+ thumb + '" style="width:125px;height:'+postheight+'px;" />';
							postbody = '<div class="play_overlay"></div>'+ img;
						}else if(type === 'audio'){ //audio
							type = "audio";
							var img = '';
							if(v.hasOwnProperty("album_art")){
								img = '<img src="'+ v["album_art"] +
								'" style="width:125px;height:125px;"/>';
							}
							postbody = '<div class="listen_overlay"></div>'+ img;
						}else{ //try for anything
							type = (jQuery.type(type) === "string")?
								type : 'unknown';
							if(pw.find('img').length > 0){
								postbody = '<img src="'+ pw.find('img').eq(0).attr('src') +
								'" style="width:125px;height:auto" />';
							}else if((pw.find('p').length > 0))
								postbody = '<div class="overprint " style="overflow:hidden !important;">'+
								((pw.find('p').eq(0).html()).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')).substring(
									0, 179); +'...</div>';
						}
						if(v.hasOwnProperty("reblog_key")){
							window.reblog_keys[postid] = v["reblog_key"];
							with_re = " with_reblog_key";
						}
						var ts = class_ts * 1000;
						var d = new Date(ts);
						var date_thing = [
							ts,
							["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()] + " "  +
							window.month_array[d.getMonth() + 1] + " " + d.getDate() + ", " +
							d.getFullYear()
						];
						var perma_link = "http://"+window.lname+".tumblr.com/post/" + postid;
						var head_extra = "";
						if(window.month_header !== (window.month_array[new Date(ts).getMonth() + 1] +' '+ new Date(ts).getFullYear() +
							'') || window.queue_page === 1 && i === 0){
							window.month_header = (window.month_array[new Date(ts).getMonth() + 1] +' '+ new Date(ts).getFullYear() +
								'')
							head_extra = '<div id="heading_'+ parseInt(ts) / 1000 +
								'" style="position: absolute; left: 0px; right: 0px; ' +
								'top: 0px;" class="heading alt_heading">'+ window.month_header +
								'</div>'+ "\n<br/>";
						}
						
						add_post += head_extra +
						'<a width="125" height="'+ postheight +'" id="post_' + postid +
						'" alt="0" target="_blank" class="brick with_tags alt_bri' +
						'ck ' + type + ' timestamp_' + class_ts + ' with_link' + with_re +
						'" style="position:absolute; -webkit-box-shadow: 1px 1px 3px ' +
						'1px rgba(100, 100, 100, .3);box-shadow: 1px 1px 3px 1px ' +
						'rgba(100, 100, 100, .5);vertical-align:center; width:125' +
						'px; height:'+ postheight +'px;border-radius: 5px;" href=' +
						'"'+ perma_link +'" title="'+ date_thing[1] + '&#13;&#10;' +
						inner_tags +'&#13;&#10;'+ title_xtra +'" onclick="if(wind' +
						'ow.orly()){if(jQuery(this).hasClass(\'highlighted\')){jQ' +
						'uery(this).removeClass(\'highlighted\');if(Array.isArray' +
						'(window.get_selected_post_ids())){window.select_count(-1' +
						');}}else{jQuery(this).addClass(\'highlighted\');if(Array' +
						'.isArray(window.get_selected_post_ids())){window.select_' +
						'count(1);}}}return false;"><div class="highlight" style=' +
						'"border-radius: 5px;"><img src="https://assets.tumblr.co' +
						'm/images/small_white_checkmark.png" class="checkmark"/><' +
						'div class="tag_count" id="tag_count_' + postid + '">' + tags +
						' tags</div><div class="tag_count right">' + notes_count + 
						'</div></div><div>'+ postbody +'</div><div class="overlay' +
						'"><div class="inner"><div class="date">' + doite + '</di' +
						'v></div></div><input class="itags" type="hidden" value="'
						+ estags +'"/></a>' + "\n";
					var s = (!window.visible_blog_links)?' style="display:none;"':'';
					v_links[postid] = '<a href="' + perma_link + '"' + s + ' clas' +
						's="blog_link view ls_' + postid + '" target="_blank" tit' +
						'le="View Post ' + postid + '">View</a> <a href="https://' +
						'www.tumblr.com/edit/' + postid + '?redirect_to=%2Fblog%2' +
						'F' + window.b_name + '" target="_blank" class="blog_link' +
						' ls_'+postid+' edit"' + s + '>Edit</a>';
					});
					jQuery('#content').append(add_post);
					jQuery('.alt_brick:not(:has(.blog_link))').each(function(){
						var id = jQuery(this).attr('id').substring(5);
						jQuery(this).append(v_links[id]);
						delete v_links[id];
					});
					jQuery('.alt_brick').each(function(){
						var id = jQuery(this).attr('id');
						if(jQuery("a#"+id).length > 1){
							jQuery(this).remove();
						}
					});
					jQuery('.brick').not('.alt_brick').remove();
					jQuery('.heading').not('.alt_heading').remove();
					jQuery('#heading_NaN').remove();
					jQuery("a#post_undefined").remove();
					build_columns(true);
					add_post = '';
					window.queue_page++;
					window.make_inline_tags(window._sel);
					window.ajax_going = false;
					carry_over();
					window.no_q_grab_overlap = false;
				}
			}
		});
		return;
	}
	if(window.queue_page === 1 && window.queue_rl.match(/\/queue$/) !== null)
		window.pause_to_find_q_times();
	if(window.last_page){
		// the done functions again(for drafts)
		clearInterval(window.timerid_get_queue_drafts);
		window.all_done_for_pause_button();
		window.make_inline_tags(window._sel);
		window.build_columns(true);
		window.not_after_complete = true;
		carry_over();
		return;
	}
	window.ajax_going = jQuery.ajax({
		url: ((!window.drafts_editing)?
			window.queue_rl +'?page='+ window.queue_page :
			window.queue_rl + window.drafts_after),
		type: 'get',
		error: function(){
			window.last_page = true;
			if(window.likes_editing&&window.first_draft){
				alert("This person is not sharing their likes or else doesn't have any.");
				jQuery("#loading").hide();
				return false;
			}
		},
		success: function(x){
			if(window.queue_page > 1 && window.likesmode === 3){
				var temp = x.response.DashboardPosts.body;
				x = temp;
			}
			var xBody = jQuery("<div></div>");
			jQuery(xBody).html(x.replace(/<script([\d\D]*?)>([\d\D]*?)<\/script>/g, '<div$1>$2</div>'));
			if(jQuery(xBody).find("div.no_posts_found").length === 0){
				var q_posts = jQuery(xBody).find('div.post');
				if(window.drafts_editing){
					if(window.likesmode === 2){
						var time = Math.round(window.parse_weekday_context(
							jQuery(xBody).find(".permalink,.post_permalink").last()
						)[0] / 1000) - 3589; // just 3 seconds off and the pagination is broke
						window.drafts_after = "?before=" + time;
					}else if(window.likesmode === 3){
						if(window.queue_page === 1)
							window.queue_rl = "https://www.tumblr.com/svc/dashboard/";
						window.drafts_after = window.queue_page + 1 + "/" + jQuery(xBody).find("div.post").last().attr("data-id");
					}else if(jQuery(xBody).find("#next_page_link").length > 0 && !window.likes_editing){
						window.drafts_after = jQuery(xBody).find("#next_page_link").attr("href").match(/\/after\/.*$/);
						window.last_page = false;
					}else if(jQuery(xBody).find("#next_page_link").length > 0 && window.likes_editing){
						window.drafts_after = jQuery(xBody).find("#next_page_link").attr("href").match(/\/page\/.*?$/);
						window.last_page = false;
					}else{
						window.last_page = true;
					}
				}
				var add_post = '';
				var v_links = {};
				if(window.likes_editing && q_posts.length===0){
					window.last_page = true;
					if(window.first_draft){
						alert("This person is not sharing their likes or else doesn't have any.");
						jQuery("#loading").hide();
						return false;
					}
				}
				for(var i = 0; i < q_posts.length; i++){
					if(jQuery(q_posts).eq(i).attr('data-post-id') === undefined) i++;
					var pw = jQuery(q_posts).eq(i).find('.post_wrapper');
					var inline_embed = pw.find('div.inline_embed');
					var perma_link = pw.find('a.post_permalink').attr("href");
					var postid = jQuery(q_posts).eq(i).attr('data-post-id');
					var with_re = "";
					if(jQuery(q_posts).eq(i).attr('data-reblog_key')!==undefined){
						window.reblog_keys[postid] = jQuery(q_posts).eq(i).attr('data-reblog_key');
						with_re = " with_reblog_key";
					}
					var postbody = "error";
					var postwidth = 125;
					var postheight = 125;
					var tags = 0;
					var type = 'regular';
					var doite = "in queue";
					var ts = Date.parse(new Date());
					var inner_tags = "";
					var title_xtra = "";
					var add_to_captions_object = (function(){
						if(pw.find('div.post_body').length > 0){
							window.captions_info[postid] = pw.find('div.post_body').text().replace(/\n+/g," ");
						}
					});
					var notes_count = pw.find(".note_link_current").length === 0 ? "0 notes" :
									  pw.find(".note_link_current").attr("title").replace(/,/g,"");
					var is_reblogged = (pw.find(".post_source").length>0)
					if(window.queue_rl.match(/\/queue$/) === null && !window.drafts_editing){ //timestamp - mass edit only
						var date_thing = window.parse_weekday_context(pw.find('a.permalink,a.post_permalink').eq(0));
						ts = date_thing[0];
					}else if(!window.drafts_editing){
						var date_thing = jQuery.type(window.q_times[i]) !== 'undefined' ?
											window.parse_weekday_context(window.q_times[i]):
											window.parse_weekday_context(pw.find('.publish_on').eq(0));
						ts = date_thing[0];
					}else{
						var date_thing = window.parse_weekday_context(["Sun", "13:37am"]);
					}
					if(pw.find('.post_tags').length > 0){ //tags
						var outer_tags = pw.find('.post_tags').eq(0).find('a.post_tag');
						tags = outer_tags.length;
						for(var it = 0; it < tags; it++){
							inner_tags += (jQuery(outer_tags).eq(it).html() +'').substring(1);
							if(it + 1 < tags) inner_tags += ',';
						}
					}
					if(window.drafts_editing){
						pw.find('img.post_avatar_image').eq(0).remove();
					}
					if(jQuery(q_posts).eq(i).attr('data-type') === 'photoset' //photoset
						|| jQuery(q_posts).eq(i).attr('data-type') === 'photo' //photo
						|| jQuery(q_posts).eq(i).attr('data-type') === 'pano'){ //panoramo
						type = "photo";
						add_to_captions_object();
						var ph = (pw.find('.photoset_row').length > 0)?
							parseInt(
								pw.find('.photoset_row').eq(0).css('height')
							) : (jQuery.type(pw.find('img').eq(0).attr('height')) !== 'undefined')?
							parseInt(
								pw.find('img').eq(0).attr('height')
							) : (jQuery.type(pw.find('img').eq(0).css('height')) !== 'undefined')?
							parseInt(
								pw.find('img').eq(0).css('height')
							) : pw.find('img').eq(0).css('width');
						var twidth = (jQuery.type(pw.find('img').eq(0).attr('height')) !== 'undefined')?
									parseInt(pw.find('img').eq(0).attr('width'))
									: parseInt(pw.find('img').eq(0).css('width'));
						postheight = Math.floor(ph * (125 / twidth));
						if(postheight < 50)
							postheight = 50;
						postbody = '<img src="'+ pw.find('img').eq(0).attr('src') +
							'" style="width:125px;height:auto;"/>';
					}else if(jQuery(q_posts).eq(i).attr('data-type') === 'regular' //text post
						|| jQuery(q_posts).eq(i).attr('data-type') === 'link' //url
						|| jQuery(q_posts).eq(i).attr('data-type') === 'quote' //quot
						|| jQuery(q_posts).eq(i).attr('data-type') === 'note' //question/answer
						|| jQuery(q_posts).eq(i).attr('data-type') === 'conversation'){ //chat
						type = jQuery(q_posts).eq(i).attr('data-type');
						if(pw.find('img').length === 0 && pw.find('div.post_content').length >
							0){
							var string = ((pw.find('div.post_content').eq(0).html() +'').replace(/<[^>]+>/g,
								' ').replace(
								/\s+/g, ' ')).substring(0, 179);
							postbody = '<div class="overprint " style="overflow:hidden !important;">'+ string +'...</div>';
						}else if(pw.find('img').length > 0){
							var ph = parseInt(pw.find('img').eq(0).css('height'));
							var twidth = parseInt(pw.find('img').eq(0).css('width'));
							postheight = Math.floor(ph * (125 / twidth));
							if(postheight < 110) postheight = 110;
							postbody = '<img src="'+ pw.find('img').eq(0).attr('src') +
								'" style="width:125px;height:auto"/>';
						}
					}else if(jQuery(q_posts).eq(i).attr('data-type') === 'video' || pw.find('video[poster]').length > 0){ //video
						type = "video";
						add_to_captions_object();
						var img = "";
						var thumb = (function(j){
							var th = /https?:\/\/((?!https?:\/\/).)*?\.(jpe?g|png|gif|bmp|tiff?)/i
							var json = jQuery(q_posts).eq(i).data("json");
							if(jQuery.type(json)==="object" && json.hasOwnProperty("share_popover_data") && json["share_popover_data"].hasOwnProperty("pinterest_share_window")
							&& json["share_popover_data"]["pinterest_share_window"].hasOwnProperty("url")
							&& unescape(json["share_popover_data"]["pinterest_share_window"]["url"]).match(th) !== null){
								return (unescape(json["share_popover_data"]["pinterest_share_window"]["url"]).match(th)[0]);
							}
							return false;
						});
						if(pw.find('video[poster]').length > 0){
							img = '<img src="'+ pw.find('video[poster]').eq(0).attr("poster") +'"  style="width:225px;auto;"/>';
						}else if(pw.find('img').length > 0){
							img = '<img src="'+ window._100(pw.find('img').eq(0).attr('src')) +
							'" style="width:125px;height:auto;" />';
						}else if(thumb()!==false){
							img = '<img src="'+ thumb() + '" style="width:225px;height:auto;" />';
						}else if(inline_embed.length > 0 && pw.find('img').length === 0 && jQuery(
								inline_embed).eq(0).html()
							.match(/(https?:[\S]+?\.(jpe?g|png|bmp|gif))/)[1] !== null){
							img = '<img src="'+
							jQuery(inline_embed).eq(0).html().match(/(https?:[\S]+?\.(jpe?g|png|bmp|gif))/)[1].replace(/\\\\/g, "") +
							'" style="width:125px;height:auto;" />';
						}
						postbody = '<div class="play_overlay"></div>'+ img;
					}else if(jQuery(q_posts).eq(i).attr('data-type') === 'audio'){ //audio
						type = "audio";
						add_to_captions_object();
						var img = '';
						if(pw.find('img').length > 0){
							img = '<img src="'+ window._100(pw.find('img').eq(0).attr('src')) +
							'" style="width:125px;height:125px;"/>';
						}
						postbody = '<div class="listen_overlay"></div>'+ img;
					}else{ //try for anything
						type = (jQuery.type(jQuery(q_posts).eq(i).attr('data-type')) === "string")?
							jQuery(q_posts).eq(i).attr('data-type') :
							'unknown';
						if(pw.find('img').length > 0){
							postbody = '<img src="'+ window._100(pw.find('img').eq(0).attr('src')) +
							'" style="width:125px;height:auto" />';
						}else if((pw.find('p').length > 0))
							postbody = '<div class="overprint " style="overflow:hidden !important;">'+
							((pw.find('p').eq(0).html()).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')).substring(
								0, 179); +'...</div>';
					}
					jQuery(inline_embed).each(function(i, d){
						jQuery(d).remove();
					});
					if(pw.find('div.post_content').eq(0).find('p').eq(0))
						title_xtra = (pw.find('div.post_content').eq(0).find('p').eq(0).html() +'').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').
					replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
					if(typeof title_xtra === "undefined" || title_xtra === "undefined"){
						title_xtra = "No Text";
					}
					var head_extra = "";
					if(window.month_header !== (window.month_array[new Date(ts).getMonth() + 1] +' '+ new Date(ts).getFullYear() +
						'') || window.queue_page === 1 && i === 0){
						window.month_header = (window.month_array[new Date(ts).getMonth() + 1] +' '+ new Date(ts).getFullYear() +
							'')
						head_extra = '<div id="heading_'+ parseInt(ts) / 1000 +
							'" style="position: absolute; left: 0px; right: 0px; ' +
							'top: 0px;" class="heading alt_heading">'+ window.month_header +
							'</div>'+ "\n<br/>";
					}
					if(window.first_draft && window.drafts_editing){
						window.first_draft = false;
						head_extra = '<div id="heading_drafts" style="position: absolute; ' +
							'left: 0px; right: 0px; top: 0px;" class="heading alt' +
							'_heading">' + window.draftsTitle + '</div>'+ "\n<br/>";
					}
					if(window.first_draft && window.likes_editing){
						window.first_draft = false;
						head_extra = '<div id="heading_drafts" style="position: absolute; ' +
							'left: 0px; right: 0px; top: 0px;" class="heading alt' +
							'_heading">Likes For '+window.lname+'</div>'+ "\n<br/>";
					}
					window.position_timestamp = ts;
					var class_ts = parseInt(ts) / 1000;
					class_ts += (is_reblogged)? " is_reblog" : " is_original";
					var estags = escape(inner_tags);
					add_post += head_extra +
						'<a width="125" height="'+ postheight +'" id="post_' + postid +
						'" alt="0" target="_blank" class="brick with_tags alt_bri' +
						'ck ' + type + ' timestamp_' + class_ts + ' with_link' + with_re +
						'" style="position:absolute; -webkit-box-shadow: 1px 1px 3px ' +
						'1px rgba(100, 100, 100, .3);box-shadow: 1px 1px 3px 1px ' +
						'rgba(100, 100, 100, .5);vertical-align:center; width:125' +
						'px; height:'+ postheight +'px;border-radius: 5px;" href=' +
						'"'+ perma_link +'" title="'+ date_thing[1] + '&#13;&#10;' +
						inner_tags +'&#13;&#10;'+ title_xtra +'" onclick="if(wind' +
						'ow.orly()){if(jQuery(this).hasClass(\'highlighted\')){jQ' +
						'uery(this).removeClass(\'highlighted\');if(Array.isArray' +
						'(window.get_selected_post_ids())){window.select_count(-1' +
						');}}else{jQuery(this).addClass(\'highlighted\');if(Array' +
						'.isArray(window.get_selected_post_ids())){window.select_' +
						'count(1);}}}return false;"><div class="highlight" style=' +
						'"border-radius: 5px;"><img src="https://assets.tumblr.co' +
						'm/images/small_white_checkmark.png" class="checkmark"/><' +
						'div class="tag_count" id="tag_count_' + postid + '">'+ tags +
						' tags</div><div class="tag_count right">' + notes_count + 
						'</div></div><div>'+ postbody +'</div><div class="overlay' +
						'"><div class="inner"><div class="date">' + doite + '</di' +
						'v></div></div><input class="itags" type="hidden" value="'
						+ estags +'"/></a>' + "\n";
					var s = (!window.visible_blog_links)?' style="display:none;"':'';
					v_links[postid] = '<a href="' + perma_link + '"' + s + ' clas' +
						's="blog_link view ls_' + postid + '" target="_blank" tit' +
						'le="View Post ' + postid + '">View</a> <a href="https://' +
						'www.tumblr.com/edit/' + postid + '?redirect_to=%2Fblog%2' +
						'F' + window.b_name + '" target="_blank" class="blog_link' +
						' ls_'+postid+' edit"' + s + '>Edit</a>';
				}
				jQuery('#content').append(add_post);
				jQuery('.alt_brick:not(:has(.blog_link))').each(function(){
					var id = jQuery(this).attr('id').substring(5);
					jQuery(this).append(v_links[id]);
					delete v_links[id];
				});
				jQuery('.alt_brick').each(function(){
					var id = jQuery(this).attr('id');
					if(jQuery("a#"+id).length > 1){
						jQuery(this).remove();
					}
				});
				jQuery('.brick').not('.alt_brick').remove();
				jQuery('.heading').not('.alt_heading').remove();
				jQuery('#heading_NaN').remove();
				jQuery("a#post_undefined").remove();
				build_columns(true);
				add_post = '';
				window.queue_page++;
				window.make_inline_tags(window._sel);
				window.ajax_going = false;
				carry_over();
			}else{
				// the done functions (for the queue)
				window.all_done_for_pause_button();
				clearInterval(window.timerid_get_queue_drafts);
				jQuery('#loading').hide();
				window.make_inline_tags(window._sel);
				jQuery("a#post_undefined").remove();
				window.build_columns(true);
				window.not_after_complete = true;
				carry_over();
				return;
			}
			window.no_q_grab_overlap = false;
		}
	});
}
window.queues_editing = false;
window.backdate_to_future = function(){
	var bc = jQuery('#bdb .chrome_button');
	bc.html(
		'<div class="chrome_button_left"></div>'+
		'Schedule'+
		'<div class="chrome_button_right"></div>'
	);
	window.bd_past_into_past = false;
	var bd = jQuery('#BD_body');
	var x = bd.find('div');
	var d = new Date();
	d.setDate(d.getDate()-365-1-30.4368);
	var yr = d.getFullYear();
	var dw = d.getDate();
	var mo = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan'][d.getMonth()];
	var da = (" "+dw+", ");
	x.eq(0).text('Mass Schedule Options');
	x.eq(2).text('(no past dates or false dates, ie: ' + mo + da + yr + ')');
	x.eq(3).after(
		jQuery('<div>').css('color','#501950').text(
			"Changes show on reload. Drafts move to the Queue."
		)
	)
	jQuery('#backdate_widget button.chrome').eq(0).text('Schedule Selected');
}
window.hide_for_likes_edit = "#sce,#toRepublish,#toPublish,#toQueue,#pob,#bdb,#add_tags:parent,#remove_tags:parent,#delete_posts:parent";
window.queuedit = function(){
	window.likesmode = 0;
	window.clear_all_intervals();
	//jQuery(jQuery('#remove_tags').parent()). // weird ?
	//unbind("click.q").bind("click.q", function(event){
	//	window.get_tags_for_selected_queue_posts();
	//});
	jQuery(window.hide_for_likes_edit).show();
	//jQuery('#remove_tags').parent().attr('onclick', 'return true;');
	window.get_data_for_tagsel = function(){return false;}
	window.main_page = false;
	window.drafts_editing = false;
	window.likes_editing = false;
	window.fetch_next_page = function(){return false;}
	window.next_page = false;
	window.queues_editing = true;
	jQuery(".highlighted").removeClass("highlighted");
	jQuery('#tagsel input[type="checkbox"]').each(function(i, check){
		if(jQuery(check).is(':checked')){
			jQuery(check).removeAttr('checked');
		}
	});
	jQuery('#browse_months').hide();
	window.queue_rl = 'https://www.tumblr.com/blog/'+ window.b_name +'/queue';
	window.queue_page = 1;
	jQuery('#content').html('');
	jQuery('#prvt').hide();
	window.backdate_to_future();
	window.last_page = false;
	window.abort_to_switch_page();
	window.last_page = false;
	window.no_q_grab_overlap = false;
	jQuery('#mqe').unbind('click.edit').bind("click.edit", function(){
		window.paused = true;
		document.location = document.location +''
	}).html(
		window.chrome_big_dark('< Back To Main Edit', 0)
	);
	jQuery('#mde').unbind("click.edit").bind("click.edit", window.draftsedit).html(
		window.chrome_big_dark('Mass Draft Edit', 0)
	);
	jQuery('#likes_mode').unbind("click.edit").bind("click.edit",
	function(){window.likesedit(0);}).html(
		window.chrome_big_dark('Likes', 0)
	);
	jQuery('#archive_mode').unbind("click.edit").bind("click.edit",  
	function(){window.likesedit(1);}).html(
		window.chrome_big_dark('Archive', 0)
	);
	jQuery('#tagged_mode').unbind("click.edit").bind("click.edit",  
	function(){window.likesedit(2);}).html(
		window.chrome_big_dark('Tagged', 0)
	);
	jQuery('#dash_mode').unbind("click.edit").bind("click.edit", 
	function(){window.likesedit(3);}).html(
		window.chrome_big_dark('Dash', 0)
	);
	jQuery('#toQueue').hide();
	jQuery('#toRepublish').show();
	jQuery('#toPublish').show();
	jQuery('.shifttemp').removeClass('shifttemp');
	jQuery('a.cantqueue').hide();
	jQuery('a.cantlikes').show();
	window.timerid_get_queue_drafts = setInterval(window.q_grab, 300);
}
window.drafts_editing = false;
window.likes_editing = false;
window.drafts_after = "";
// this is a temporary fix to the weird escapes
jQuery(jQuery('#remove_tags').parent()).attr(
	"onclick", 
	"window.get_tags_for_selected_queue_posts();"
);
window.draftsedit = function(){
	window.likesmode = 0;
	window.clear_all_intervals();
	window.draftsTitle = "Drafts Page";
	//jQuery(jQuery('#remove_tags').parent()). // weird ?
	//unbind("click.q").bind("click.q", function(event){
	//	window.get_tags_for_selected_queue_posts();
	//});
	jQuery(window.hide_for_likes_edit).show();
	//jQuery('#remove_tags').parent().attr('onclick', 'return true;');
	window.get_data_for_tagsel = function(){return false;}
	window.first_draft = true;
	window.drafts_after = "";
	window.drafts_editing = true;
	window.main_page = false;
	window.last_page = false;
	window.likes_editing = false;
	window.fetch_next_page = function(){return false;}
	window.next_page = false;
	jQuery(".highlighted").removeClass("highlighted");
	jQuery('#tagsel input[type="checkbox"]').each(function(i, check){
		if(jQuery(check).is(':checked')){
			jQuery(check).removeAttr('checked');
		}
	});
	jQuery('#browse_months').hide();
	window.queue_rl = 'https://www.tumblr.com/blog/'+ window.b_name +'/drafts';
	window.queue_page = 1;
	jQuery('#content').html('');
	jQuery('#prvt').hide();
	window.backdate_to_future();
	window.abort_to_switch_page();
	window.last_page = false;
	window.no_q_grab_overlap = false;
	jQuery('#mde').unbind('click.edit').bind("click.edit", function(){
		window.paused = true;
		document.location = document.location +''
	}).html(
		window.chrome_big_dark('< Back To Main Edit', 0)
	);
	jQuery('#mqe').unbind("click.edit").bind("click.edit", window.queuedit).html(
		window.chrome_big_dark('Mass Queue Edit', 0)
	);
	jQuery('#likes_mode').unbind("click.edit").bind("click.edit",
	function(){window.likesedit(0);}).html(
		window.chrome_big_dark('Likes', 0)
	);
	jQuery('#archive_mode').unbind("click.edit").bind("click.edit",  
	function(){window.likesedit(1);}).html(
		window.chrome_big_dark('Archive', 0)
	);
	jQuery('#tagged_mode').unbind("click.edit").bind("click.edit",  
	function(){window.likesedit(2);}).html(
		window.chrome_big_dark('Tagged', 0)
	);
	jQuery('#dash_mode').unbind("click.edit").bind("click.edit", 
	function(){window.likesedit(3);}).html(
		window.chrome_big_dark('Dash', 0)
	);
	jQuery('#toQueue').show();
	jQuery('#toPublish').show();
	jQuery('#toRepublish').hide();
	jQuery('.shifttemp').removeClass('shifttemp');
	jQuery('a.cantqueue').hide();
	jQuery('a.cantlikes').show();
	window.timerid_get_queue_drafts = setInterval(window.q_grab, 300);
}
window.lname = "";
window.draftsTitle = "Drafts Page";
window.likesmode = 0;
window.likesedit = function(m){
	window.likesmode = m;
	var sure = true;
	if(m >= 0 && m < 3){
		window.lname = window.prompt(
		["Whose shared likes do you want to reblog? Likes must be shared by this blog.\n"+
		"If the default choice shown is not your primary, you will need to switch it to your primary to get your own likes.",
		"Whose archive do you want to reblog from?",
		"Warning: Utilize the pause button! Some tagged pages go on forever!\n\nWhat tagged series do you want to reblog?"][m],
		[window.primary_blog,"",""][m]);
	}else{
		sure = confirm("Warning: The dashboard goes on eternal! Utilize the pause button!"+
			"\n\nAre you sure you want to mass reblog from the dash?");
		window.lname = "dashboard";
	}
	if(window.lname === null || window.lname.length === 0 || !sure) return;
	window.clear_all_intervals();
	jQuery(window.hide_for_likes_edit).hide();
	window.get_data_for_tagsel = function(){return false;}
	window.first_draft = true;
	window.drafts_after = "";
	window.drafts_editing = m === 2 || m === 3;
	window.likes_editing = true;
	window.main_page = false;
	window.last_page = false;
	window.fetch_next_page = function(){return false;}
	window.next_page = false;
	jQuery(".highlighted").removeClass("highlighted");
	jQuery('#tagsel input[type="checkbox"]').each(function(i, check){
		if(jQuery(check).is(':checked')){
			jQuery(check).removeAttr('checked');
		}
	});
	jQuery('#browse_months').hide();
	window.queue_rl = ['https://www.tumblr.com/liked/by/',
					   'api:',
					   'https://www.tumblr.com/tagged/',
					   'https://www.tumblr.com/'][m]+ window.lname;
	window.draftsTitle = ["Likes Page","api","Tagged: "+window.lname+" (Utilize Pause Button!)","Dashboard (Utilize Pause Button!)"][m];
	window.queue_page = m === 1 ? 0 : 1;
	jQuery('#content').html('');
	jQuery('#prvt').hide();
	window.backdate_to_future();
	window.abort_to_switch_page();
	window.last_page = false;
	window.no_q_grab_overlap = false;
	jQuery('#mde').unbind("click.edit").bind("click.edit", window.draftsedit).html(
		window.chrome_big_dark('Mass Draft Edit', 0)
	);
	jQuery('#mqe').unbind("click.edit").bind("click.edit", window.queuedit).html(
		window.chrome_big_dark('Mass Queue Edit', 0)
	);
	jQuery('#likes_mode').unbind("click.edit").bind("click.edit",
	function(){window.likesedit(0);}).html(
		window.chrome_big_dark('Likes', 0)
	);
	jQuery('#archive_mode').unbind("click.edit").bind("click.edit",  
	function(){window.likesedit(1);}).html(
		window.chrome_big_dark('Archive', 0)
	);
	jQuery('#tagged_mode').unbind("click.edit").bind("click.edit",  
	function(){window.likesedit(2);}).html(
		window.chrome_big_dark('Tagged', 0)
	);
	jQuery('#dash_mode').unbind("click.edit").bind("click.edit", 
	function(){window.likesedit(3);}).html(
		window.chrome_big_dark('Dash', 0)
	);
	jQuery(
		['#likes_mode',"#archive_mode","#tagged_mode","#dash_mode"][m]
	).unbind('click.edit').bind("click.edit", function(){
		window.paused = true;
		document.location = document.location +''
	}).html(
		window.chrome_big_dark('< Back To Main Edit', 0)
	);
	jQuery('.shifttemp').removeClass('shifttemp');
	jQuery('a.cantqueue').show();
	jQuery('a.cantlikes').hide();
	window.timerid_get_queue_drafts = setInterval(window.q_grab, 300);
}
window.massedit = function(){
	window.drafts_editing = false;
	window.queues_editing = false;
	window.likes_editing = false;
}
window.reblog_keys = new Object();
window.posted_tags = new Object();
window.is_reblog_info = new Object();
window.note_count_info = new Object();
window.captions_info = new Object();
window.all_possible_posts = false;
window.api_ids = new Array();
window.get_reblog_keys_and_tags = function(offset, specific, finished){
	if(typeof(specific)==='undefined') specific = false;
	if(typeof(finished)==='undefined') finished=function(x){return x;}
	window.tag_fetch_not_running = false;
	var api = 'fuiKNFp9vQFvjLNvx4sUwti4Yb5yGutBN4Xh10LXZhhRKjWlV4';
	var url = 'https://api.tumblr.com/v2/blog/' + window.b_name + '.tumblr.com/posts?api_key=' + api +
				((!specific)? '&limit=50&offset=' + (offset + window.api_offset) : '&id=' + specific) + "&reblog_info=true";
	jQuery.ajax({
		url:url,
		dataType:'jsonp',
		success:function(re){
			window.tag_fetch_not_running = true;
			if(typeof re !== "undefined" && re.hasOwnProperty("response") && re["response"].hasOwnProperty("posts")){
				if(re["response"]["posts"].length===0){
					window.all_possible_posts = true;
					window.get_data_for_tagsel();
					clearInterval(window.timerid_key_tag_fetch);
					return false;
				}
				var post = re["response"]["posts"];
				jQuery.each(post, function(k, v){
					window.api_ids.push(v["id"]);
					if(v.hasOwnProperty("caption"))
						window.captions_info[v["id"]] = jQuery('<div/>').html(v["caption"]).text().replace(/\n+/g," ");
					if(v.hasOwnProperty("reblog_key"))
						window.reblog_keys[v["id"]] = v["reblog_key"];
					if(v.hasOwnProperty("tags"))
						window.posted_tags[v["id"]] = v["tags"];
					if(v.hasOwnProperty("note_count"))
						window.note_count_info[v["id"]] = parseInt(v["note_count"]);
					if(v.hasOwnProperty("reblogged_root_url"))
						window.is_reblog_info[v["id"]] = true;
					else
						window.is_reblog_info[v["id"]] = false;
				});
				if(window.api_recurse_for_first){
					var id = parseInt(jQuery(".brick").eq(0).attr("id").replace(/\D+/g,''));
					if(jQuery.inArray(id, window.api_ids) === -1){
						window.get_reblog_keys_and_tags(window.api_ids.length);
					}else{
						window.api_recurse_for_first = false;
					}
				}
			}
			finished(specific);
		}
	});
}
window.maybe_done = 0; window.tag_fetch_not_running = true; window.api_offset = 0;
window.api_recurse_for_first = false;
window.start_api_features = function(){
	window.timerid_key_tag_fetch = setInterval(function(){
		if(window.tag_fetch_not_running){
			window.get_reblog_keys_and_tags(window.api_ids.length);
		}
	}, 100);
}
if(document.location.href.split(/\/+/)[4] === undefined && document.location.href.split(/\/+/)[5] === undefined){
	window.start_api_features();
}else{
	window.api_recurse_for_first = true;
	window.start_api_features();
	// end api lag fix
}
window.new_show_these_selected = false;
var queue_button = jQuery('<button></button>');
jQuery(queue_button).attr('id', 'mqe');
jQuery(queue_button).attr('title', 'Edit posts from your queue.');
jQuery(queue_button).addClass('chrome');
jQuery(queue_button).html(window.chrome_big_dark('Mass Queue Edit',0));
jQuery(queue_button).bind("click.edit", window.queuedit);
var draft_button = jQuery('<button></button>');
jQuery(draft_button).attr('id', 'mde');
jQuery(draft_button).attr('title', 'Edit posts from your drafts page.');
jQuery(draft_button).addClass('chrome');
jQuery(draft_button).html(window.chrome_big_dark('Mass Draft Edit',0));
jQuery(draft_button).bind("click.edit", window.draftsedit);
var likes_mode = jQuery('<button></button>');
jQuery(likes_mode).attr('id', 'likes_mode');
jQuery(likes_mode).attr('title', 'Likes for Reblogging');
jQuery(likes_mode).addClass('chrome');
jQuery(likes_mode).html(window.chrome_big_dark('Likes',0));
jQuery(likes_mode).bind("click.edit", function(){window.likesedit(0);});
var archive_mode = jQuery('<button></button>');
jQuery(archive_mode).attr('id', 'archive_mode');
jQuery(archive_mode).attr('title', 'Archive for Reblogging');
jQuery(archive_mode).addClass('chrome');
jQuery(archive_mode).html(window.chrome_big_dark('Archive',0));
jQuery(archive_mode).bind("click.edit", function(){window.likesedit(1);});
var tagged_mode = jQuery('<button></button>');
jQuery(tagged_mode).attr('id', 'tagged_mode');
jQuery(tagged_mode).attr('title', 'Tagged for Reblogging');
jQuery(tagged_mode).addClass('chrome');
jQuery(tagged_mode).html(window.chrome_big_dark('Tagged',0));
jQuery(tagged_mode).bind("click.edit", function(){window.likesedit(2);});
var dash_mode = jQuery('<button></button>');
jQuery(dash_mode).attr('id', 'dash_mode');
jQuery(dash_mode).attr('title', 'Dash for Reblogging');
jQuery(dash_mode).addClass('chrome');
jQuery(dash_mode).html(window.chrome_big_dark('Dash',0));
jQuery(dash_mode).bind("click.edit", function(){window.likesedit(3);});
var lite_mode = jQuery('<button></button>');
jQuery(lite_mode).attr('id', 'lite_mode');
jQuery(lite_mode).attr('title', 'Lite mode: Faster loading post brick masonry. (Not recommended) May be buggy.');
jQuery(lite_mode).addClass('chrome');
jQuery(lite_mode).html(window.chrome_big_dark('Lite Mode',0));
jQuery(lite_mode).bind("click", window.lite_mode_);
var select_all = jQuery('<div></div>');
jQuery(select_all).addClass('header_button');
jQuery(select_all).attr({
	title: 'Select All (limit:100)',
	id: 'select_all'
});
jQuery(select_all).html(window.chrome_big_dark('Select All'));
window.select_all_limit = 0;
jQuery(select_all).bind("click", function(){
	jQuery('.highlighted').each(function(i, hl){
		if(jQuery(hl).hasClass('highlighted')){
			jQuery(hl).removeClass('highlighted');
			if(Array.isArray(window.get_selected_post_ids()))
				window.select_count(-1);
		}
	});
	var brick = jQuery('.brick');
	for(var i = window.select_all_limit; i < brick.length; i++){
		if(jQuery(brick[i]).hasClass('highlighted') === false && jQuery('.highlighted').length < 100){
			jQuery(brick[i]).addClass('highlighted');
			if(Array.isArray(window.get_selected_post_ids()))
				window.select_count(1);
		}
	}
	if(jQuery('.highlighted').length === 100){
		jQuery('#select_all').html(window.chrome_big_dark('Opt 100 More'));
		window.select_all_limit += 100;
	}else{
		jQuery('#select_all').html(window.chrome_big_dark('Select All'));
		window.select_all_limit = 0;
	}
});
jQuery('#unselect').parent().after(select_all);
jQuery(window.nav +' img.avatar').eq(0).before(queue_button);
jQuery(window.nav +' img.avatar').eq(0).before(draft_button);
jQuery(window.nav +' img.avatar').eq(0).before(lite_mode);
jQuery(window.nav +' img.avatar').eq(0).before(" For Mass Reblog:",likes_mode,dash_mode,archive_mode,tagged_mode);
jQuery('#unselect').bind("click", function(){
	jQuery('#select_all').html(window.chrome_big_dark('Select All'));
	jQuery('#tagsel input[type="checkbox"]').each(function(i, check){
		if(jQuery(check).is(':checked')){
			jQuery(check).removeAttr('checked');
		}
	});
	window.select_all_limit = 0;
	window.max_tag_selected = 0;
	window.make_inline_tags(window._sel);
	jQuery('#unselect').find('div.chrome_button').eq(0).html('<div class="chrome_button_left"></div>Unselect'+
			'<div class="chrome_button_right"></div>');
	window.total_selected = 0;
	jQuery("#sbt_confirm").html("Select By");
});
window.case_i = function(a, b){
	var lca = a.toLowerCase(),
		lcb = b.toLowerCase();
	return lca > lcb ? 1 : lca < lcb ? -1 : 0;
}
window.get_tags_for_selected_queue_posts = function(event){
	window.just_clicked_remove_tags = true;
	window.just_clicked_select_tags = true;
	jQuery('#remove_tag_button').hide();
	jQuery('#tags_loading').show();
	jQuery('#tags').html('');
	jQuery('#remove_tags_widget').show();
	var highlighted_tags = new Array();
	jQuery('.highlighted').each(function(i, post){
		var e = unescape(jQuery(post).find('input.itags').eq(0).val()).split(',')
		for(ik = 0; ik < e.length; ik++){
			if(typeof e[ik] !== undefined && e[ik].length > 0)
				highlighted_tags.push(e[ik]);
		}
	});
	window.uniq(highlighted_tags.sort(window.case_i)).forEach(function(tag){
		if(tag !== null){
			tag_checkbox_id++;
			jQuery('#tags').append('<div id="'+ tag +'">'+
				'<input type="checkbox" alt="'+ tag.replace(/"/g, '') +'" id="tag_checkbox_'+ tag_checkbox_id +'"/>'+
				'<label for="tag_checkbox_'+ tag_checkbox_id +'">'+ tag +'</label></div>');
		}
	});
	jQuery('#remove_tag_button').show();
	jQuery('#tags_loading').hide();
	jQuery('#no_tags_message').hide();
}
window.add_tags_for_queue = function(){
	var a_me = jQuery('#tokens .tag');
	jQuery('.highlighted').each(function(i, post){
		var a_in = jQuery(post).find('input.itags').eq(0);
		for(ig = 0; ig < a_me.length; ig++){
			if((unescape(jQuery(a_in).val())).match(jQuery(a_me).eq(ig).html()) === null){
				if(jQuery(a_in).val().length > 0)
					jQuery(a_in).val(jQuery(a_in).val()+escape(','));
				jQuery(a_in).val(jQuery(a_in).val()+ escape(jQuery(a_me).eq(ig).html()) )
			}
		}
		jQuery(post).find('.tag_count:not(.right)').eq(0).html((unescape(jQuery(a_in).val())).split(',').length + " tags");
	});
	window.make_inline_tags(window._sel);
}
window.remove_tags_for_queue = function(){
	jQuery('#tags input').each(function(i, tag){
		if(jQuery(tag).is(':checked')){
			var remove = escape(jQuery(tag).attr('alt'));
			var r_me = jQuery('.highlighted');
			for(ig = 0; ig < r_me.length; ig++){
				var r_in = jQuery(r_me[ig]).find('input.itags').eq(0);
				if((jQuery(r_in).val() +'').match(remove + escape(',')) !== null){
					jQuery(r_in).attr('value', (jQuery(r_in).val() +'').replace(remove + escape(','), ''));
				}else if((jQuery(r_in).val() +'').match(escape(',') + remove) !== null){
					jQuery(r_in).attr('value', (jQuery(r_in).val() +'').replace(escape(',') + remove, ''));
				}else if((jQuery(r_in).val() +'').match(remove) !== null){
					jQuery(r_in).attr('value', (jQuery(r_in).val() +'').replace(remove, ''));
				}
				jQuery(r_me[ig]).find('.tag_count:not(.right)').eq(0).html((unescape(jQuery(r_in).val())).split(',').length + " tags");
			}
		}
	});
	jQuery('#tagsel input[type="checkbox"]').each(function(i, check){
		if(jQuery(check).is(':checked')){
			jQuery(check).removeAttr('checked');
		}
	});
	window.make_inline_tags(window._sel);
}
window.no_less_than_tag = 0;
window.return_check_box_for_ = function(label){
	if(jQuery('#typu_'+ label).length === 0){
		var label2 = (label === 'note')? 'answer' : (label === 'regular')? 'text' : (label === 'is_reblog')? "is reblogged" : label;
		return '<div style="color:#cc3333;" id="typu_'+ label +'">'+
			'<input type="checkbox" alt="" data-type="'+ label +'" class="select_me" id="post_t_checkbox_'+ label +
			'"/>'+
			'<label for="post_t_checkbox_'+ label +'"> POST-type: '+ label2 +'</label>'+
			'<input type="checkbox" alt="" class="NOT_select_me" data-type="'+ label +'" id="tag_checkbox_NOT_'+
			label +
			'"/>'+
			'<label for="tag_checkbox_NOT_'+ label +'" class="NOT_select_me">'+
			((label!=='is_reblog')?'not this':'is original')+'</label>'+
			'</div>';
	}else{
		return '';
	}
}
window.counts_for_widget = function(ob){
	jQuery('#tagsel').html('');
	var type = ['link','audio','video','note','conversation','regular','photo','is_reblog','is_original','private'];
	
	var row = function(color, label, count1, count2){
		count1 = count1.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		count2 = count2.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		jQuery('#tagsel').append(
			jQuery('<div'+color+'>').append(
				jQuery('<label>').text(label),
				jQuery('<span class="tagcount" title="'+count1+'">').text(count1),
				jQuery('<span class="selcount" title="'+count1+'">').text(count2)
			)
		);
	}
	row(' style="color:#186ba4;"', "Total Posts Showing", jQuery('.brick').length, jQuery('.brick.highlighed').length);
	jQuery.each(type, function(i,type){
		var label = (type === 'note')? 'answer' : (type === 'regular')? 'text' : (type === 'is_reblog')? "is reblogged" : type;
		row(' style="color:#cc3333;"','POST-type:' + label,jQuery('.brick.'+type).length,jQuery('.brick.highlighted.'+type).length);
	});
	row(' style="color:#cc3333;"','POST-type: public',jQuery('.brick:not(.private)').length,jQuery('.brick.highlighted:not(.private)').length);
	row(' style="color:#186ba4;"','No Tag',ob["counts"]["no-tag"],ob["selected"]["no-tag"]);
	row(' style="color:#186ba4;"','Total Notes All Posts',ob["counts"]['no-tag-notes'],ob["selected"]['no-tag-notes']);
	delete ob["counts"]["no-tag"]; delete ob["selected"]["no-tag"];
	delete ob["counts"]['no-tag-notes']; delete ob["selected"]['no-tag-notes'];
	jQuery.each(ob["selected"], function(i){
		if(isNaN(ob["selected"][i])||i===undefined)
			return true;
		var count1 = ob["counts"][i];
		var count2 = ob["selected"][i];
		delete ob["selected"][i];
		if(count1 < window.no_less_than_tag && !jQuery("#less_more_check").prop("checked")
		|| count1 > window.no_less_than_tag && jQuery("#less_more_check").prop("checked"))
			return true;
		row('',i,count1,count2)
	});
	jQuery.each(ob["counts"], function(i){
		if(isNaN(ob["counts"][i])||i===undefined)
			return true;
		var count1 = ob["counts"][i];
		var count2 = 0;
		delete ob["counts"][i];
		if(count1 < window.no_less_than_tag && !jQuery("#less_more_check").prop("checked")
		|| count1 > window.no_less_than_tag && jQuery("#less_more_check").prop("checked"))
			return true;
		row('',i,count1,count2)
	});
	jQuery('#tagsel div').each(function(){
		
	})
}
window.make_inline_tags = function(selected){
	if(typeof selected === "undefined"){
		selected = false;
	}
	var quick_id = 1;
	var all_tags = new Array();
	var count = selected === 2;
	var count_sel = {};
	var counts = {};
	counts['no-tag-notes'] = 0;
	count_sel['no-tag-notes'] = 0;
	jQuery((selected===1)?'.brick.with_tags.highlighted':'.brick.with_tags').each(function(i, post){
		var notag = false;
		if(jQuery(post).find('.tag_count.right').length > 0){
			var noted = parseInt(jQuery(post).find('.tag_count.right').text());
			if(isNaN(noted)) noted = 0;
			if(jQuery(post).hasClass('highlighted'))
				count_sel['no-tag-notes'] += noted;
			counts['no-tag-notes'] += noted;
		}
		if(jQuery(post).find('input.itags').length > 0){
			var e = unescape(jQuery(post).find('input.itags').eq(0).val()).split(',')
			for(ik = 0; ik < e.length; ik++){
				if(e[ik] !== '' && typeof e[ik] !== 'undefined'){
					all_tags.push(e[ik]);
					if(jQuery(post).hasClass('highlighted')){
						if(counts[e[ik]]===undefined)
							count_sel[e[ik]] = 1;
						else
							count_sel[e[ik]]++;	
					}
					if(counts[e[ik]]===undefined)
						counts[e[ik]] = 1;
					else
						counts[e[ik]]++;
				}
			}
			if(e.length<=1) notag = true;
		}else notag = true;
		if(notag){
			counts["no-tag"] = counts["no-tag"]===undefined ? 1 : counts["no-tag"]+1;
			if(jQuery(post).hasClass('highlighted'))
				count_sel["no-tag"] = count_sel["no-tag"]===undefined ? 1 : count_sel["no-tag"]+1;
		}
	});
	if(count){
		if(counts["no-tag"] === undefined)
			counts["no-tag"] = 0;
		if(count_sel["no-tag"] === undefined)
			count_sel["no-tag"] = 0;
		window.counts_for_widget({"counts":counts,"selected":count_sel});
		return false;
	}
	jQuery('#tagsel div').each(function(i, check){
		if(!jQuery(check).find('input.select_me').eq(0).is(':checked')
		&& !jQuery(check).find('input.NOT_select_me').eq(0).is(':checked')){
			jQuery(check).remove();
		}
	});
	if(jQuery('#no_tag').length === 0 || jQuery('#typu_quote').length === 0){
		var go = window.return_check_box_for_('quote') +
			window.return_check_box_for_('link') +
			window.return_check_box_for_('audio') +
			window.return_check_box_for_('video') +
			window.return_check_box_for_('note') +
			window.return_check_box_for_('conversation') +
			window.return_check_box_for_('regular') +
			window.return_check_box_for_('photo') +
			window.return_check_box_for_('is_reblog') +
			window.return_check_box_for_('duplicate') +
			window.return_check_box_for_('private');
		if(jQuery('#no_tag').length === 0 )
			go += '<div style="color:#186ba4;" id="no_tag" tag="no_tag">'+
			'<input type="checkbox" class="select_me" alt="select_me" id="tag_checkbox_null"/>'+
			'<label for="tag_checkbox_null">Tag Count</label>'+
			'<label for="tag_count_less"><input type="radio" name="tag_amount" value="<"/>Less</label> '+
			'<label for="tag_count_more"><input type="radio" name="tag_amount" value=">"/>More</label> '+
			'<label for="tag_count_equal"><input type="radio" name="tag_amount" value="===" checked="true"/>Equal</label>'+
			'<input id="tag_count_input" value="0"/>'+
			'<input type="checkbox" alt="" class="NOT_select_me" id="tag_checkbox_NOT_no_tag"/>'+
			'<label for="tag_checkbox_NOT_no_tag" class="NOT_select_me">not this</label>'+
			'</div>';
		if(jQuery('#note_count').length === 0 )
			go += '<div style="color:#186ba4;" id="note_count" tag="no_tag_2">'+
			'<input type="checkbox" class="select_me" alt="select_me" id="tag_checkbox_null_2"/>'+
			'<label for="tag_checkbox_null_2">Note Count</label>'+
			'<label for="more_notes">More Than<input type="text" id="more_notes"/></label>'+
			'<label for="less_notes">Less Than<input type="text" id="less_notes"/></label><i>Blank=Wild</i>'+
			'<input type="checkbox" alt="" class="NOT_select_me" id="tag_checkbox_NOT_no_tag_2"/>'+
			'<label for="tag_checkbox_NOT_no_tag_2" class="NOT_select_me">opposite</label>'+
			'</div>';
			
		jQuery('#tagsel').append(go);
		jQuery("#more_notes,#less_notes").keyup(function(){
			if(!jQuery("#tag_checkbox_null_2").prop("checked")&&!jQuery("#tag_checkbox_NOT_no_tag_2").prop("checked")){
				jQuery("#tag_checkbox_null_2").prop("checked",true);
			}
		});
		jQuery("#tag_count_input").change(function(){
			if(isNaN(parseInt(jQuery(this).val()))){
				jQuery(this).val(0);
			}else{
				jQuery(this).val(
					parseInt(jQuery(this).val())
				);
			}
		});
		jQuery("#more_notes,#less_notes").change(function(){
			if(isNaN(parseInt(jQuery(this).val()))){
				jQuery(this).val("");
			}else{
				jQuery(this).val(
					parseInt(jQuery(this).val())
				);
			}
		});
	}
	window.uniq(all_tags.sort(window.case_i)).forEach(function(tag, level){
		var x_times = 0;
		all_tags.forEach(function(already){
			if(tag === already)
				x_times++;
		});
		if(tag !== null){
			quick_id++;
			if(jQuery('#'+ tag.replace(/\W/g, '_')).length === 0 && x_times > window.no_less_than_tag && !jQuery("#less_more_check").prop("checked")
			|| jQuery('#'+ tag.replace(/\W/g, '_')).length === 0 && x_times < window.no_less_than_tag && jQuery("#less_more_check").prop("checked")){
				var go = '<div id="'+ tag.replace(/\W/g, '_') +'" tag="'+ tag +'">'+
					'<input type="checkbox" class="select_me" alt="'+ tag.replace(/"/g, '') +'" id="tag_checkbox_'+
					quick_id +
					'"/>'+
					'<label for="tag_checkbox_'+ quick_id +'">'+ tag +'</label>'+
					'<input type="checkbox" alt="'+ tag.replace(/"/g, '') +
					'" class="NOT_select_me" id="tag_checkbox_NOT_'+
					quick_id +'"/>'+
					'<label for="tag_checkbox_NOT_'+ quick_id +'" class="NOT_select_me">not this</label>'+
					'</div>';
				if(jQuery('#select_by_tag_widget').is(':visible'))
					jQuery('#tagsel').append(go);
			}
		}
	});
	jQuery('#tagsel div').each(function(i, check){
		jQuery(check).bind("click", function(){
			window.just_clicked_select_tags = true;
			if(jQuery(this).find("input").length > 0
			&&!jQuery(this).find("input").prop("checked") && window.tagsel_mode === "select"){
				jQuery("#sbt_confirm").html("Select By");
				window.max_tag_selected = 0;
			}
		});
	});
}
window._sel = false;
window.no_less_than_x = function(){
	x = parseInt(jQuery('#less_than_x').val());
	if(!isNaN(x) && window.no_less_than_tag !== x){
		window.no_less_than_tag = x;
		window.make_inline_tags(window._sel);
		jQuery('#less_than_x').attr('value', x);
	}else{
		window.no_less_than_tag = 0;
		window.make_inline_tags(window._sel);
		jQuery('#less_than_x').attr('value', '0');
	}
}
window.tag_widget_show = function(select){
	window.just_clicked_select_tags = true;
	if(select !== 0 && window.tagsel_mode === "show"
	|| select !== 1 && window.tagsel_mode === "select"
	|| select !== 2 && window.tagsel_mode === "unselect"){
		jQuery('#tagsel input[type="checkbox"]').each(function(i, check){
			if(jQuery(check).is(':checked')){
				jQuery(check).removeAttr('checked');
			}
		});
		jQuery("#less_more_check").prop("checked",false);
	}
	var nokey = jQuery('#tag_away .key').length === 0;
	if(select===1){
		window.tagsel_mode = "select";
		jQuery(".show_button").hide();
		jQuery(".select_button").show();
		jQuery(".unselect_button").hide();
		var l = (jQuery('#sbt').position().left - 240) + 'px';
		window._sel = 0;
		jQuery('#select_by_tag_widget').css({left: l, top: '90px'});
		if(!nokey) jQuery('#tag_away .key').remove();
	}else if(select===2){
		window.tagsel_mode = "unselect";
		jQuery(".show_button").hide();
		jQuery(".select_button").hide();
		jQuery(".unselect_button").show();
		var l = (jQuery('#usbt').position().left - 240) + 'px';
		window._sel = 1;
		jQuery('#select_by_tag_widget').css({left: l, top: '90px'});
		if(!nokey) jQuery('#tag_away .key').remove();
	}else if(select===0){
		window.tagsel_mode = "show";
		jQuery(".show_button").show();
		jQuery(".select_button").hide();
		jQuery(".unselect_button").hide();
		var l = (jQuery('#sho').position().left - 240) + 'px';
		window._sel = 0;
		jQuery('#select_by_tag_widget').css({left: l, top: '60px'});
		if(!nokey) jQuery('#tag_away .key').remove();
	}else if(select===3){
		window.tagsel_mode = "count";
		jQuery(".show_button").hide();
		jQuery(".select_button").hide();
		jQuery(".unselect_button").hide();
		var l = (jQuery('#cnts').position().left - 240) + 'px';
		jQuery('#select_by_tag_widget').css({left: l, top: '60px'});
		window._sel = 2;
		if(nokey){
			jQuery('#tag_away').prepend(
				jQuery('<span class="key">').css({
						color: '#660066',
						position: 'absolute',
						top: '-16px',
						left: '-250px',
						'font-weight':'bold'
					}).text('total count'),
				jQuery('<span class="key">').css({
					color: '#009bff',
					position: 'absolute',
					top: '-2px',
					left: '-250px',
					'font-weight':'bold'
				}).text('selected count')
			)
		}
	}
	window.no_less_than_tag = 0;
	window.just_clicked_select_tags = true;
	jQuery('#select_by_tag_widget').show();
	jQuery('#tagsel').scrollTop(0).focus();
	window.make_inline_tags(window._sel);
	window.no_less_than_x();
}
window.me_bg = function(el){
	var o = jQuery(el).parent().parent();
	if(jQuery(o).attr('disabled') === 'true')
		return;
	var group = jQuery(o).attr('id').match(/(date|time)/)[1];
	jQuery('#bd_same_'+ group).css({
		'backgroundColor': ''
	});
	jQuery('#bd_two_'+ group).css({
		'backgroundColor': ''
	});
	jQuery('#bd_one_'+ group).css({
		'backgroundColor': ''
	});
	jQuery(o).css({
		'backgroundColor': '#c0c0dc'
	});
}
window.s_d = function(re, i, size){
	if(re === 'month' || re === 'date' || re === 'year'){
		var month1 = parseInt(jQuery('#two_month_1').val()) - 1;
		var year1 = parseInt(jQuery('#two_year_1').val());
		var date1 = parseInt(jQuery('#two_date_1').val());
		var month2 = parseInt(jQuery('#two_month_2').val()) - 1;
		var year2 = parseInt(jQuery('#two_year_2').val());
		var date2 = parseInt(jQuery('#two_date_2').val());
		var milliseconds1 = Date.parse(new Date(year1, month1, date1));
		var milliseconds2 = Date.parse(new Date(year2, month2, date2));
		var bw = (milliseconds1 > milliseconds2);
		var milliseconds_between = (bw)? milliseconds1 - milliseconds2 : milliseconds2 - milliseconds1;
		var portion = Math.round(milliseconds_between / (size - 1));
		var ts = (bw)? milliseconds2 + portion * i : milliseconds1 + portion * i;
		return(re === 'month')? new Date(ts).getMonth() + 1 : (re === 'date')? new Date(ts).getDate() : (re === 'year')? new Date(ts).getFullYear() : '';
	}else if(re === 'time'){
		var hour1 = parseInt(jQuery('#two_hour_1').val()) + ((jQuery('#pm_option_2').is(':checked'))? 12 : 0);
		var hour2 = parseInt(jQuery('#two_hour_2').val()) + ((jQuery('#pm_option_3').is(':checked'))? 12 : 0);
		if(hour1 === 12 || hour1 === 24)
			hour1 -= 12;
		if(hour2 === 12 || hour2 === 24)
			hour2 -= 12;
		var min1 = parseInt(jQuery('#two_minute_1').val());
		var min2 = parseInt(jQuery('#two_minute_2').val());
		var minutes1 = (hour1 * 60) + min1;
		var minutes2 = (hour2 * 60) + min2;
		var bw = (minutes1 > minutes2);
		var minutes_between = (bw)? minutes1 - minutes2 : minutes2 - minutes1;
		var portion = Math.round(minutes_between / (size - 1));
		var nt = new Date(0, 0, 0, 0, ((bw)? minutes2 + portion * i : minutes1 + portion * i));
		var pm = (nt.getHours() > 12)
		return((pm)? nt.getHours() - 12 : ((nt.getHours() === 0)? 12 : nt.getHours())) + ":"+ ((nt.getMinutes() <
				10)? '0'+
			nt.getMinutes() : nt.getMinutes()) + ((pm)? 'pm' : 'am');
	}
}
window.backdate_selected = function(){
	if(jQuery("img#loader_ma_jig").length>0){
		alert(window.processing_message);
		return false;
	}
	jQuery("#backdate_widget .chrome_button_right").before(window.loader_ma_jig);
	var d = (jQuery('#no_date_option').is(':checked'))? 0 : (jQuery('#one_date_option').is(':checked'))? 1 : (
		jQuery(
			'#two_date_option').is(':checked'))? 2 : 0;
	var t = (jQuery('#no_time_option').is(':checked'))? 0 : (jQuery('#one_time_option').is(':checked'))? 1 : (
		jQuery(
			'#two_time_option').is(':checked'))? 2 : 0;
	var hl = jQuery('.highlighted');
	window.to_fin = hl.length;
	window.reset_edit_queue();
	for(var i = 0; i < hl.length; i++){
		var dt = parseInt(jQuery(hl).eq(i).attr('class').replace(/\D/g, '')) * 1000 + (1000 * 60); //tumblr timestamp is 1 min off
		var time_sub = "";
		if(d === 0)
			time_sub += window.month_array[new Date(dt).getMonth() + 1] + " "+ (new Date(dt).getDate()) + ", "+ (new Date(
				dt).getFullYear());
		else if(d === 1)
			time_sub += window.month_array[parseInt(jQuery('#one_month').val())] + " "+ jQuery('#one_date').val() +
			", "+
			jQuery('#one_year').val();
		else if(d === 2)
			time_sub += window.month_array[window.s_d('month', i, hl.length)] + " "+ window.s_d('date', i, hl.length) +
			", "+
			window.s_d('year', i, hl.length);
		time_sub += " ";
		if(t === 0)
			time_sub += ((new Date(dt).getHours() > 12)? new Date(dt).getHours() - 12 : new Date(dt).getHours() + ((
				new Date(dt).getHours() === 0)? 12 : 0)) +
			":"+ ((new Date(dt).getMinutes() < 10)? '0'+ new Date(dt).getMinutes() : new Date(dt).getMinutes()) +
			((new Date(dt).getHours() > 12)? 'pm' : 'am');
		else if(t === 1)
			time_sub += jQuery('#one_hour').val() +':'+ jQuery('#one_minute').val() + ((jQuery('#am_option').is(
					':checked'))?
				'am' : 'pm');
		else if(t === 2)
			time_sub += window.s_d('time', i, hl.length);
		var postID = jQuery(hl[i]).attr('id').replace(/[^\d]+/g, '');
		window.fetch_change_queue.push([
		(window.bd_past_into_past?
			'post[date]':'post[publish_on]'), time_sub]);
		window.fetch_ids_queue.push(postID);
		window.fetch_edit_queue.push((function(){
				window.fetch_edit_submit(function(id){
				if(id===undefined)id=0;
				window.to_fin--;
				var r = window.fetch_change_queue.length - 1;
				var time_o = window.fetch_change_queue[r][1];
				jQuery('#post_'+ id).attr('title', (window.bd_past_into_past?
					'Backdated. '+ time_o +' Reload to place in proper order.':
					'Scheduled. '+ time_o +' Reload and view to queue to see scheduled posts.'));
				jQuery('#post_'+ id).removeClass('photo_on');
				jQuery('#post_'+ id).addClass('backdated');
				if(jQuery("#backdate_reload").attr("disabled") === "disabled"){
					jQuery("#backdate_reload").removeAttr("disabled");
					jQuery("#backdate_reload").bind("click", function(){
						window.paused = true;
						document.location = document.location +''
					});
				}
				if(window.to_fin===0){
					alert(window.bd_past_into_past?
						"Finished backdate. Reload page to view the new post order."+window.err_option:
						"Finished scheduling. Reload the page and view the new posts on the Queue page."+window.err_option);
					jQuery("img#loader_ma_jig").remove();
				}
			});
		}));
	}
	var r = window.fetch_ids_queue.length - 1;
	window.fetch_edit_queue[r]();
}
window.caption_selected = function(x, who){
	if(x !== 'two' && x !== 'three') return false;
	if(jQuery("img#loader_ma_jig").length>0){
		alert(window.processing_message);
		return false;
	}
	jQuery(who).find(".chrome_button_right").before(window.loader_ma_jig);
	var hl = jQuery('.highlighted.photo,.highlighted.audio,.highlighted.video');
	window.to_fin = hl.length;
	window.reset_edit_queue();
	for(var i = 0; i < hl.length; i++){
		var postID = jQuery(hl[i]).attr('id').replace(/[^\d]+/g, '');
		var change = ['post['+ x +']',
						((x === 'three')?
							jQuery("#clickthru_option").val() :
							jQuery("#caption_option").val())];
		window.fetch_change_queue.push(change);
		window.fetch_ids_queue.push(postID);
		window.fetch_edit_queue.push((function(){
			window.fetch_edit_submit(function(id){
				if(id===undefined)id=0;
				jQuery('#post_'+ id).removeClass('photo_on');
				window.to_fin--;
				if(window.to_fin===0){
					alert("Selected photos have been " + ((x==='two')?"captioned":"clickthru linked") +
						". Non photo posts" + ((x === 'three')? " and re-blogged posts " : " ") +
						"were skipped.");
					jQuery("img#loader_ma_jig").remove();
				}
			});
		}));
	}
	var r = window.fetch_ids_queue.length - 1;
	window.fetch_edit_queue[r]();
}
window.source_selected = function(){
	if(jQuery("img#loader_ma_jig").length>0){
		alert(window.processing_message);
		return false;
	}
	jQuery('#source_option').find(".chrome_button_right").before(window.loader_ma_jig);
	var hl = jQuery('.highlighted');
	window.to_fin = hl.length;
	window.reset_edit_queue();
	hl.addClass('photo_on');
	for(var i = 0; i < hl.length; i++){
		var postID = jQuery(hl[i]).attr('id').replace(/[^\d]+/g, '');
		var change = ['post[source_url]',jQuery("#source_option").val()];
		window.fetch_change_queue.push(change);
		window.fetch_ids_queue.push(postID);
		window.fetch_edit_queue.push((function(){
			window.fetch_edit_submit(function(id){
				if(id===undefined)id=0;
				jQuery('#post_'+ id).removeClass('photo_on');
				window.to_fin--;
				if(window.to_fin===0){
					alert("Selected photos have been source linked."+window.err_option);
					jQuery("img#loader_ma_jig").remove();
				}
			});
		}));
	}
	var r = window.fetch_ids_queue.length - 1;
	window.fetch_edit_queue[r]();
}
window.make_selected_private = function(){
	if(jQuery("img#loader_ma_jig").length>0){
		alert(window.processing_message);
		return false;
	}
	var prive = window.privy;
	var hl = jQuery('.highlighted');
	jQuery("#prvt .chrome_button_right").before(window.loader_ma_jig);
	window.to_fin = hl.length;
	window.reset_edit_queue();
	for(var i = 0; i < hl.length; i++){
		var postID = jQuery(hl[i]).attr('id').replace(/[^\d]+/g, '');
		window.fetch_change_queue.push(['post[state]', ((prive)? 'private' : '0 3')]);
		window.fetch_ids_queue.push(postID);
		window.fetch_edit_queue.push((function(){
			window.fetch_edit_submit(function(id){
				if(id===undefined)id=0;
				var ol = (jQuery('#post_'+ id).find('.private_overlay').length > 0);
				if(!ol && prive){
					jQuery('#post_'+ id).find('.overlay').eq(0).before('<div class="private_overlay"></div>');
					jQuery('#post_'+ id).addClass("private");
				}else if(ol && !prive){
					jQuery('#post_'+ id).find('.private_overlay').eq(0).remove();
					jQuery('#post_'+ id).removeClass("private");
					window.get_reblog_keys_and_tags(1, id, window.get_data_for_tagsel);
				}
				jQuery('#post_'+ id).removeClass('photo_on');
				window.select_count(0);
				window.to_fin--;
				if(window.to_fin===0){
					alert("Selected posts were successfully made "+((prive)?"":"un")+"private."+window.err_option);
					jQuery("img#loader_ma_jig").remove();
				}
			});
		}));
	}
	var r = window.fetch_ids_queue.length - 1;
	window.fetch_edit_queue[r]();
}
window.make_republishable_draft = function(){
	if(jQuery("img#loader_ma_jig").length>0){
		alert(window.processing_message);
		return false;
	}
	var hl = jQuery('.highlighted');
	jQuery("#toRepublish .chrome_button_right").before(window.loader_ma_jig);
	window.to_fin = hl.length;
	window.reset_edit_queue();
	for(var i = 0; i < hl.length; i++){
		var postID = jQuery(hl[i]).attr('id').replace(/[^\d]+/g, '');
		window.fetch_change_queue.push(['post[state]', '1']);
		window.fetch_ids_queue.push(postID);
		window.fetch_edit_queue.push((function(){
			window.fetch_edit_submit(function(id){
				if(id===undefined)id=0;
				jQuery('#post_'+ id).remove();
				window.to_fin--;
				if(window.to_fin===0){
					window.build_columns(true);
					alert("The selected posts are now in this blog's drafts."+window.err_option);
					jQuery("img#loader_ma_jig").remove();
				}
			});
		}));
	}
	var r = window.fetch_ids_queue.length - 1;
	window.fetch_edit_queue[r]();
}
window.move_posts_to_another_blog = function(to_blog, reblog, who){
	if(jQuery("img#loader_ma_jig").length>0){
		alert(window.processing_message);
		return false;
	}
	var continu = confirm("Are you sure you want to " + ((reblog)?"reblog":"copy") +
		' the selected posts to the "' + to_blog + '" blog?' +
		((reblog)?" Any private posts and answer posts cannot be reblogged, and will be skipped.":
		" This will be a fresh post with NO NOTES."));
	if(!continu)
		return false;
	jQuery(who).append(window.loader_ma_jig);
	jQuery("#jump_to_blog").append(window.loader_ma_jig.clone());
	if(reblog) jQuery('.highlighted.private').removeClass("highlighted");
	var hl = jQuery('.highlighted');
	window.to_fin = hl.length;
	window.reset_edit_queue();
	if(hl.length===0) jQuery("img#loader_ma_jig").remove();
	for(var i = 0; i < hl.length; i++){
		jQuery(hl[i]).addClass("photo_on");
		var postID = jQuery(hl[i]).attr('id').replace(/[^\d]+/g, '');
		var change = ['channel_id', to_blog];
		if(reblog)
			change.push("reblog");
		else
			change.push("not-reblog");
		window.fetch_change_queue.push(change);
		window.fetch_ids_queue.push(postID);
		window.fetch_edit_queue.push((function(){
			window.fetch_edit_submit(function(id){
				if(id===undefined)id=0;
				$("#post_" + id).removeClass("photo_on");
				window.to_fin--;
				if(window.to_fin===0){
					alert("The selected posts have been successfully "+((reblog)?"reblogged.":"copied.")+window.err_option);
					jQuery("img#loader_ma_jig").remove();
				}
			});
		}));
	}
	var r = window.fetch_ids_queue.length - 1;
	window.fetch_edit_queue[r]();
}
window.draft_queue_publish = function(queue){ 
	if(jQuery("img#loader_ma_jig").length>0){
		alert(window.processing_message);
		return false;
	}
	jQuery("#"+((queue)?"toQueue":"toPublish")+" .chrome_button_right").before(window.loader_ma_jig);
	window.to_fin = jQuery('.highlighted').length;
	jQuery('.highlighted').each(function(i, hl){
		var id = (jQuery(hl).attr('id') +'').replace(/[^\d]+/g, '');
		window.fetch_change_queue.push(['post[state]', ((queue)? '2' : '0 3')]);
		window.fetch_ids_queue.push(id);
		jQuery("#post_"+id).addClass("photo_on");
		window.fetch_edit_queue.push((function(){
			window.fetch_edit_submit(function(id){
				if(id===undefined)id=0;
				var r = window.fetch_ids_queue.length - 1;
				var post_id = window.fetch_ids_queue[r];
				var queue = window.fetch_change_queue[r][1]==='2';
				jQuery("#post_"+post_id).remove();
				window.max_tag_selected--;
				if(Array.isArray(window.get_selected_post_ids()))
					window.select_count(-1);
				window.to_fin--;
				if(window.to_fin===0){
					alert("The selected posts have been successfully "+((queue)?"Queued":"Published")+"."+window.err_option);
					jQuery("img#loader_ma_jig").remove();
					window.build_columns(true);
				}
			});
		}));
	});
	var r = window.fetch_ids_queue.length - 1;
	window.fetch_edit_queue[r]();
	/* This way is the old publish. I think it breaks stuff. // maybe no longer used
	jQuery("#"+((queue)?"toQueue":"toPublish")+" .chrome_button_right").before(window.loader_ma_jig);
	window.to_fin = jQuery('.highlighted').length;
	jQuery('.highlighted').each(function(i, hl){
		var id = (jQuery(hl).attr('id') +'').replace(/[^\d]+/g, '');
		window.fetch_ids_queue.push(id);
		window.fetch_change_queue.push('form_key='+ window.user_form_key +'&id='+ id + ((queue)? '&queue=queue' : ''));
		window.fetch_edit_queue.push((function(){
			var r = window.fetch_ids_queue.length - 1;
			var post_id = window.fetch_ids_queue[r];
			var queue = window.fetch_change_queue[r].match("&queue=queue")!==null;
			jQuery("#post_"+post_id).addClass("photo_on");
			jQuery.ajax({
				url: 'https://www.tumblr.com/publish',
				type: 'post',
				data: window.fetch_change_queue[r],
				success: function(x){
					jQuery("#post_"+post_id).remove();
					window.max_tag_selected--;
					if(Array.isArray(window.get_selected_post_ids()))
						window.select_count(-1);
					window.to_fin--;
					if(window.to_fin===0){
						alert("The selected posts have been successfully "+((queue)?"Queued":"Published")+".");
						jQuery("img#loader_ma_jig").remove();
						window.build_columns(true);
					}
					window.fetch_edit_queue.pop();
					window.fetch_ids_queue.pop();
					window.fetch_change_queue.pop();
					var r = window.fetch_ids_queue.length - 1;
					if(jQuery.type(window.fetch_edit_queue[r]) === "function"){
						window.fetch_edit_queue[r]();
					}
				}
			});
		}));
	});
	var r = window.fetch_ids_queue.length - 1;
	window.fetch_edit_queue[r]();
	*/
}
window.photo_widget_show = function(){
	window.just_clicked_select_tags = true;
	jQuery('#photo_widget').show();
	jQuery('.highlighted.photo,.highlighted.audio,.highlighted.video').addClass('photo_on');
}
window.source_widget_show = function(){
	window.just_clicked_select_tags = true;
	jQuery('#source_widget').show();
}
window.bd_past_into_past = true;
window.backdate_widget_show = function(){
	window.just_clicked_select_tags = true;
	var d2 = (jQuery('.highlighted').length > 0)?
		parseInt(jQuery('.highlighted').eq(jQuery('.highlighted').length - 1).attr('class').replace(/\D/g, '')) *
		1000 + (
			1000 * 60) :
		new Date().getTime();
	var d1 = (jQuery('.highlighted').length > 0)?
		parseInt(jQuery('.highlighted').eq(0).attr('class').replace(/[^\d]+/g, '')) * 1000 + (1000 * 60) :
		new Date().getTime();
	var pm1 = (new Date(d1).getHours() > 12);
	var pm2 = (new Date(d2).getHours() > 12);
	jQuery('#one_month').attr('value', new Date(d1).getMonth() + 1);
	jQuery('#one_year').attr('value', new Date(d1).getFullYear());
	jQuery('#one_date').attr('value', new Date(d1).getDate());
	jQuery('#two_month_1').attr('value', new Date(d1).getMonth() + 1);
	jQuery('#two_year_1').attr('value', new Date(d1).getFullYear());
	jQuery('#two_date_1').attr('value', new Date(d1).getDate());
	jQuery('#two_month_2').attr('value', new Date(d2).getMonth() + 1);
	jQuery('#two_year_2').attr('value', new Date(d2).getFullYear());
	jQuery('#two_date_2').attr('value', new Date(d2).getDate());
	jQuery('#year_count_1').html(new Date().getFullYear());
	jQuery('#year_count_2').html(new Date().getFullYear());
	jQuery('#year_count_3').html(new Date().getFullYear());
	jQuery('#one_hour').attr('value', (pm1)? new Date(d1).getHours() - 12 : new Date(d1).getHours() +
		((new Date(d1).getHours() === 0)? 12 : 0));
	jQuery('#one_minute').attr('value', ((new Date(d1).getMinutes() < 10)? '0'+ new Date(d1).getMinutes() :
		new Date(d1).getMinutes()));
	jQuery('#two_hour_1').attr('value', (pm1)? new Date(d1).getHours() - 12 : new Date(d1).getHours() +
		((new Date(d1).getHours() === 0)? 12 : 0));
	jQuery('#two_minute_1').attr('value', ((new Date(d1).getMinutes() < 10)? '0'+ new Date(d1).getMinutes() :
		new Date(d1).getMinutes()));
	jQuery('#two_hour_2').attr('value', (pm2)? new Date(d2).getHours() - 12 : new Date(d2).getHours() +
		((new Date(d2).getHours() === 0)? 12 : 0));
	jQuery('#two_minute_2').attr('value', ((new Date(d2).getMinutes() < 10)? '0'+ new Date(d2).getMinutes() :
		new Date(d2).getMinutes()));
	if(pm1){
		jQuery('#am_option').removeAttr('checked');
		jQuery('#am_option_2').removeAttr('checked');
		jQuery('#pm_option').attr('checked', 'checked');
		jQuery('#pm_option_2').attr('checked', 'checked');
	}else{
		jQuery('#pm_option').removeAttr('checked');
		jQuery('#pm_option_2').removeAttr('checked');
		jQuery('#am_option').attr('checked', 'checked');
		jQuery('#am_option_2').attr('checked', 'checked');
	}
	if(pm2){
		jQuery('#am_option_3').removeAttr('checked');
		jQuery('#pm_option_3').attr('checked', 'checked');
	}else{
		jQuery('#pm_option_3').removeAttr('checked');
		jQuery('#am_option_3').attr('checked', 'checked');
	}
	if(jQuery('.highlighted').length === 0){
		jQuery('#bd_one_date').css({
			'color': '#999'
		});
		jQuery('#bd_one_time').css({
			'color': '#999'
		});
		jQuery('#bd_one_date').attr({
			'disabled': 'true'
		});
		jQuery('#bd_one_time').attr({
			'disabled': 'true'
		});
		jQuery('#bd_one_date').find('input').each(function(i, input){
			jQuery(input).attr('disabled', 'disabled');
		});
		jQuery('#bd_one_time').find('input').each(function(i, input){
			jQuery(input).attr('disabled', 'disabled');
		});
	}else{
		jQuery('#bd_one_date').css({
			'color': '#555'
		});
		jQuery('#bd_one_time').css({
			'color': '#555'
		});
		jQuery('#bd_one_date').removeAttr('disabled');
		jQuery('#bd_one_time').removeAttr('disabled');
		jQuery('#bd_one_date').find('input').each(function(i, input){
			jQuery(input).removeAttr('disabled');
		});
		jQuery('#bd_one_time').find('input').each(function(i, input){
			jQuery(input).removeAttr('disabled');
		});
	}
	if(jQuery('.highlighted').length <= 1){
		jQuery('#bd_two_date').css({
			'color': '#999'
		});
		jQuery('#bd_two_date').find('input').each(function(i, input){
			jQuery(input).attr('disabled', 'disabled');
		});
		jQuery('#bd_two_time').css({
			'color': '#999'
		});
		jQuery('#bd_two_time').find('input').each(function(i, input){
			jQuery(input).attr('disabled', 'disabled');
		});
		jQuery('#bd_two_date').attr({
			'disabled': 'true'
		});
		jQuery('#bd_two_time').attr({
			'disabled': 'true'
		});
	}else{
		jQuery('#bd_two_date').css({
			'color': '#555'
		});
		jQuery('#bd_two_date').find('input').each(function(i, input){
			jQuery(input).removeAttr('disabled');
		});
		jQuery('#bd_two_time').css({
			'color': '#555'
		});
		jQuery('#bd_two_time').find('input').each(function(i, input){
			jQuery(input).removeAttr('disabled');
		});
		jQuery('#bd_two_date').removeAttr('disabled');
		jQuery('#bd_two_time').removeAttr('disabled');
	}
	window.show_days_in_month();
	window.just_clicked_select_tags = true;
	jQuery('#backdate_widget').show();
}
window.show_days_in_month = function(){
	jQuery('#date_count_1').html(
		new Date(parseInt(jQuery('#one_year').val()), parseInt(jQuery('#one_month').val()), 0).getDate()
	);
	jQuery('#date_count_2').html(
		new Date(parseInt(jQuery('#two_year_1').val()), parseInt(jQuery('#two_month_1').val()), 0).getDate()
	);
	jQuery('#date_count_3').html(
		new Date(parseInt(jQuery('#two_year_2').val()), parseInt(jQuery('#two_month_2').val()), 0).getDate()
	);
}
window.stop_blasting_top = function(b4, div){
	if(jQuery('#tagsel div').eq(b4).length === 0) return false;
	if(!jQuery('#tagsel div').eq(b4).find('input.select_me[type="checkbox"]').eq(0).is(':checked')
	&& !jQuery('#tagsel div').eq(b4).find('input.NOT_select_me[type="checkbox"]').eq(0).is(':checked')){
		jQuery('#tagsel div').eq(b4).before(div);
	}else{
		window.stop_blasting_top(b4 + 1, div);
	}
}
window.make_has_tagged = function(te){
	var t = escape(te).toLowerCase().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	var cma = escape(',');
	var ht = new RegExp('(^'+ t +'$|^'+ t + cma +'|'+ cma + t + cma +'|'+ cma + t +'$)', 'i');
	return ht;
}
window.max_tag_selected = 0;
window.hide_new_posts = jQuery("<style/>").
	attr({"type":"text/css","id":"hide_new_posts_thusly"}).
	html(".brick:not(.with_tags){display:none!important;}");
window.continue_to_hide_new_posts = function(){
	window.show_only_these(0, false);
	jQuery("#content").height(
		jQuery("#content").children(':visible').last().height +
		jQuery("#content").children(':visible').last().position().top + 42
	);
}
window.last_hidden_count=0;
window.show_only_these = function(all, select){
	if(typeof(select)==="undefined")select=false;
	jQuery(".post,.heading").each(function(){
		var el = jQuery(this).prop("tagName").toLowerCase();
		var id = jQuery(this).attr("id");
		if(jQuery(el+"#"+id).length>1){
			jQuery(this).remove();
		}
	});
	var de = (select && all==="unselect")? true:false;
	if(all === 1 && !select || !window.new_show_these_selected
	&& jQuery('#tagsel input[type="checkbox"]:checked').length === 0){
		clearInterval(window.timerid_hide_new_posts);
		jQuery("#hide_new_posts_thusly").remove();
		jQuery("#sho").removeClass("active");
		jQuery("#sho").attr("title","Show Only Certain Posts");
		jQuery('#tagsel input.select_me').each(function(i, check){
			jQuery(check).parent().remove();
		});
		window.new_show_these_selected = false;
		window.last_hidden_count = 0;
		if(jQuery('.null_brick').length===0){
			return;
		}
		jQuery('.brick').each(function(i, brick){
			jQuery(brick).removeClass('brick').addClass('null_brick');
		});
		var bi = 0; var brick = jQuery('.null_brick');
		for(var i=0; i<brick.length; i+=10){
			if(jQuery(brick[i]).length>0){
				jQuery(brick[i]).addClass('brick');
				jQuery(brick[i]).removeClass('null_brick');
				jQuery(brick[i]).css({left:"0px",top:"0px"});
			}
			window.build_columns(true);
			clearInterval(window.timerid_hide_new_posts);
			window.timerid_hide_new_posts = setInterval(function(){
				if(rebuilding_columns === false){
					clearInterval(window.timerid_hide_new_posts);
					window.show_only_these(all, select);
				}
			}, 1000);
		}
		window.make_inline_tags(window._sel);
	}
	if(!jQuery("#sho").hasClass("active") && !select){
		jQuery("#sho").addClass("active");
		jQuery("#sho").attr("title","Show only is active!");
	}
	var check_to_select = new Array(); var not_to_select = new Array();
	var type_to_select = new Array(); var not_type_select = new Array();
	jQuery('#tagsel input[type="checkbox"]').each(function(i,check){
		if(jQuery(check).is(':checked') && jQuery(check).hasClass('select_me')){
			if(jQuery(check).parent().attr('tag')!=null)
				check_to_select.push(jQuery(check).parent().attr('tag'));
			else
				type_to_select.push(jQuery(check).attr('data-type'));
			window.stop_blasting_top(0, jQuery(check).parent());
			jQuery('#shonly').scrollTop(0);
		}
		if(jQuery(check).is(':checked') && jQuery(check).hasClass('NOT_select_me')){
			if(jQuery(check).parent().attr('tag')!=null)
				not_to_select.push(jQuery(check).parent().attr('tag'));
			else
				not_type_select.push(jQuery(check).attr('data-type'));
			window.stop_blasting_top(0, jQuery(check).parent());
			jQuery('#shonly').scrollTop(0);
		}
	});
	if(select || !window.new_show_these_selected)
		jQuery("#tagsel").scrollTop(0);
	if(select && !de){
		jQuery('.highlighted').removeClass('highlighted');
		window.total_selected=0;
		window.select_count(0);
	}
	var brick = jQuery('.with_tags');
	var array_dupes = [];
	var after_sel = false;
	var array_duplicate_main = [];
	for(var i = select&&!de? window.max_tag_selected : 0; i < brick.length; i++){
		var id = jQuery(brick[i]).attr("id").substr(5);
		var dupe = jQuery("<div></div>").html(jQuery(brick[i]).html());
		dupe.find(".overlay,.private_overlay,.highlight").remove();
		var duplicate_bool = false;
		if(array_dupes.indexOf(dupe.html()) === -1){
			array_dupes.push(id);
			array_dupes.push(dupe.html());
			dupe.remove();
		}else{
			array_duplicate_main.push(array_dupes[array_dupes.indexOf(dupe.html()) - 1]);
			duplicate_bool = true;
		}
		var no_tag = (not_to_select.length === 0)? 1 : 0;
		var tag_count = parseInt(jQuery(brick[i]).find('.tag_count:not(.right)').text());
		var tag_amount_bool = eval(
				tag_count +
				jQuery("#no_tag input[name='tag_amount']:checked").val() + 
				jQuery("#tag_count_input").val()
			);
		var mt_note = jQuery("#more_notes").val(); var lt_note = jQuery("#less_notes").val();
		var note_count = parseInt(jQuery(brick[i]).find('.tag_count.right').text());
		var note_count_bool = (
			mt_note.length !== 0 && note_count >= parseInt(mt_note) && lt_note.length === 0
			|| lt_note.length !== 0 && note_count < parseInt(lt_note) && mt_note.length === 0
			|| mt_note.length !== 0 && note_count > parseInt(mt_note) && lt_note.length !== 0 && note_count < parseInt(lt_note)
		);
		for(var c = 0; c < not_to_select.length; c++){
			var has_tagged = window.make_has_tagged(not_to_select[c] +'');
			if((jQuery(brick[i]).find('input.itags').eq(0).val() +'').length > 0
			&& (jQuery(brick[i]).find('input.itags').eq(0).val() +'').toLowerCase().match(has_tagged) === null
			|| tag_amount_bool && not_to_select[c] !== 'no_tag'
			|| note_count_bool && not_to_select[c] !== 'no_tag_2'){
				no_tag++;
			}
		}
		var yes_tag = (check_to_select.length === 0)? 1 : 0;
		for(var c = 0; c < check_to_select.length; c++){
			var has_tagged = window.make_has_tagged(check_to_select[c] +'');
			if((jQuery(brick[i]).find('input.itags').eq(0).val() +'').toLowerCase().match(has_tagged) !== null
			|| tag_amount_bool && check_to_select[c] === 'no_tag'
			|| note_count_bool && check_to_select[c] === 'no_tag_2'){
				yes_tag++;
			}
		}
		var no_type = (not_type_select.length === 0)? 1 : 0;
		var retro_sel = 0;
		for(var c = 0; c < not_type_select.length; c++){
			if(!jQuery(brick[i]).hasClass(not_type_select[c] +'')
			|| not_to_select[c] === "duplicate" && !duplicate_bool){
				no_type++;
			}
		}
		var yes_type = (type_to_select.length === 0)? 1 : 0;
		for(var c = 0; c < type_to_select.length; c++){
			if(jQuery(brick[i]).hasClass(type_to_select[c] +'')
			|| type_to_select[c] === "duplicate" && duplicate_bool){
				yes_type++;
				if(type_to_select[c] === "duplicate" && duplicate_bool)
					after_sel = true;
			}
		}
		if(yes_tag !== 0 && no_tag !== 0 && no_type !== 0 && yes_type !== 0){
			if(jQuery(brick[i]).hasClass('null_brick') && !select){
				jQuery(brick[i]).removeClass('null_brick');
			}
			if(!jQuery(brick[i]).hasClass('brick') && !select){
				jQuery(brick[i]).addClass('brick');
				window.last_hidden_count++;
			}
			if(!jQuery(brick[i]).hasClass('highlighted') && jQuery('.highlighted').length < 100 && select && !de){
				window.max_tag_selected++;
				jQuery(brick[i]).addClass('highlighted');
				if(Array.isArray(window.get_selected_post_ids()))
					window.select_count(1);
			}
			if(de && select && jQuery(brick[i]).hasClass('highlighted')){
				window.max_tag_selected--;
				jQuery(brick[i]).removeClass('highlighted');
				if(Array.isArray(window.get_selected_post_ids()))
					window.select_count(-1);
			}
		}else{
			if(jQuery(brick[i]).hasClass('brick') && !select){
				jQuery(brick[i]).removeClass('brick').removeClass('highlighted');
			}
			if(!jQuery(brick[i]).hasClass('null_brick') && !select){
				jQuery(brick[i]).addClass('null_brick');
				window.last_hidden_count++;
			}
			if(jQuery(brick[i]).hasClass('highlighted') && select && !de){
				jQuery(brick[i]).removeClass('highlighted');
				if(Array.isArray(window.get_selected_post_ids()))
					window.select_count(-1);
			}
		}
	}
	if(after_sel)
		jQuery.each(array_duplicate_main, function(i,id){
			var o_brick = jQuery("#post_"+id);
			if(o_brick.hasClass('null_brick') && !select){
				o_brick.removeClass('null_brick').addClass("brick");
			}
			if(select && !de){
				if(jQuery('.highlighted').length === 100)
					jQuery('.highlighted').last().removeClass("highlighted");
				window.max_tag_selected++;
				o_brick.addClass('highlighted');
				if(Array.isArray(window.get_selected_post_ids()))
					window.select_count(1);
			}
			if(de && select && !o_brick.hasClass('highlighted')){
				window.max_tag_selected--;
				o_brick.removeClass('highlighted');
				if(Array.isArray(window.get_selected_post_ids()))
					window.select_count(-1);
			}
			o_brick.addClass("duplicate_main");
		});
	else
		jQuery(".duplicate_main").removeClass("duplicate_main");
	if(jQuery('.highlighted').length === 100 && select
	|| select && jQuery(".highlighted").last().index(".brick.with_tags") + 100 > jQuery('.brick').length){
		jQuery("#sbt_confirm").html("Opt For 100 More");
		window.max_tag_selected = jQuery(".highlighted").last().index(".brick.with_tags") + 1;
	}else if(select){
		jQuery("#sbt_confirm").html("Select By");
		window.max_tag_selected = 0;
	}
	if(!select){
		if(jQuery("#hide_new_posts_thusly").length === 0){
			jQuery("head").append(window.hide_new_posts);
		}
		if(window.new_show_these_selected === false){
			clearInterval(window.timerid_hide_new_posts);
			window.timerid_hide_new_posts = setInterval(window.continue_to_hide_new_posts, 300);
			window.new_show_these_selected = true;
		}
		if(window.last_hidden_count > 0){
			window.build_columns(true)
			window.make_inline_tags(window._sel);
		}
		window.last_hidden_count = 0;
		if(!window.next_page){
			clearInterval(window.timerid_hide_new_posts);
			jQuery("#hide_new_posts_thusly").remove();
		}
	}
}
window.visible_blog_links = false;
window.visible_photo_captions = false;
window.view_post_links = function(show){
	if(show){
		window.visible_blog_links = true;
		jQuery(".brick").not('.with_link').each(function(i, brick){
			var id = jQuery(brick).attr('id').substring(5);
			var ahref = jQuery(brick).attr('href');
			jQuery(brick).append(
				'<a href="' + ahref + '" class="blog_link view" target="_blan' + 
				'k" title="View Post '+ id +'">View</a> <a href="https://www.t' + 
				'umblr.com/edit/' + id + '?redirect_to=%2Fblog%2F' +
				window.b_name +'" target="_blank" class="blog_link edit">Edit' +
				'</a>'
			);
			jQuery(brick).addClass("with_link");
		});
		jQuery(".blog_link").each(function(){
			jQuery(this).bind('click', function(e){
				e.stopPropagation();
			});
			jQuery(this).show();
		});
	}else{
		window.visible_blog_links = false;
		jQuery(".blog_link").each(function(i, link){
			jQuery(link).hide();
		});
	}
}
window.view_post_captions = function(show){
	if(show){
		window.visible_blog_captions = true;
		jQuery(".brick.photo,.brick.audio,.brick.video").not('.with_cap').each(function(i, brick){
			var id = jQuery(brick).attr('id').substring(5);
			if(window.captions_info.hasOwnProperty(id)){
				jQuery(brick).append(
					'<div class="over_caption">' +
						window.captions_info[id] +
					'</div>'
				);
				jQuery(brick).addClass("with_cap");
			}
		});
	}else{
		window.visible_blog_captions = false;
		jQuery('.with_cap').removeClass('with_cap');
		jQuery(".over_caption").remove();
	}
}
var select_by_tag_widget = jQuery('<div></div>');
jQuery(select_by_tag_widget).attr({
	id: 'select_by_tag_widget'
});
var seltags = jQuery('<div></div>');
jQuery(seltags).css({
	font: "normal 11px 'Lucida Grande',Verdana,sans-serif",
	width: '460px',
	position: 'absolute',
	left: '20px',
	top: '19px',
	height: '523px',
	overflow: 'auto',
	color: '#555'
});
jQuery(seltags).attr({
	id: 'tagsel'
});
jQuery(select_by_tag_widget).bind("mousedown", function(event){
	window.just_clicked_select_tags = true;
});
jQuery(select_by_tag_widget).append(seltags);
jQuery(select_by_tag_widget).hide();
jQuery(select_by_tag_widget).append(
	'<div style="position:absolute; left:21px; bottom:38px;" class="select_butto' + 
	'n"><button type="button" class="chrome select_button" onclick="window.show_' + 
	'only_these(null,1)"><div class="chrome_button"><div class="chrome_button_le' + 
	'ft"></div><span id="sbt_confirm">Select By</span><div class="chrome_button_' + 
	'right"></div></div></button></div>'
);
jQuery(select_by_tag_widget).append(
	'<div style="position:absolute; left:21px; bottom:38px;" class="unselect_but' + 
	'ton"><button type="button" class="chrome unselect_button" onclick="window.s' + 
	'how_only_these(\'unselect\',1)"><div class="chrome_button"><div class="chro' + 
	'me_button_left"></div><span id="usbt_confirm">Un-Select By</span><div class' + 
	'="chrome_button_right"></div></div></button></div>'
);
jQuery(select_by_tag_widget).append(
	'<div style="position:absolute; right:21px; bottom:38px;" class="select_butt' + 
	'on"><button type="button" class="chrome select_button" onclick="jQuery(\'#s' + 
	'elect_by_tag_widget\').hide();"><div class="chrome_button"><div class="chro' + 
	'me_button_left"></div><span>Cancel</span><div class="chrome_button_right"><' + 
	'/div></div></button></div>'
);
jQuery(select_by_tag_widget).append(
	'<div style="position:absolute; right:21px; bottom:38px;" class="unselect_bu' + 
	'tton"><button type="button" class="chrome unselect_button" onclick="jQuery(' + 
	'\'#select_by_tag_widget\').hide();"><div class="chrome_button"><div class="' + 
	'chrome_button_left"></div><span>Cancel</span><div class="chrome_button_righ' + 
	't"></div></div></button></div>'
);
jQuery(select_by_tag_widget).bind("mousedown", function(event){
	window.just_clicked_select_tags = true;
});
jQuery(select_by_tag_widget).hide();
jQuery(select_by_tag_widget).append(
	'<div style="position:absolute; left:21px; bottom:38px;" class="show_button"' + 
	'><button type="button" class="chrome show_button" onclick="window.show_only' + 
	'_these(0, false);jQuery(\'#tagsel input[type=checkbox]:checked\').each(func' +
	'tion(){window.stop_blasting_top(0, jQuery(this).parent());});"><div class="' +
	'chrome_button"><div class="chrome_button_left"></div><span>Show Only</span>' +
	'<div class="chrome_button_right"></div></div></button></div>'
);
jQuery(select_by_tag_widget).append(
	'<div style="position:absolute; left:115px; bottom:38px;" class="show_button' + 
	'"><button title="Show all" type="button" class="chrome show_button" onclick' + 
	'="window.show_only_these(1,false);"><div class="chrome_button"><div class="' + 
	'chrome_button_left"></div><span id="sho_all">All</span><div class="chrome_b' + 
	'utton_right"></div></div></button></div>'
);
jQuery(select_by_tag_widget).append(
	'<div style="position:absolute; right:21px; bottom:38px;" class="show_button' + 
	'"><button type="button" class="chrome show_button" onclick="jQuery(\'#selec' + 
	't_by_tag_widget\').hide();"><div class="chrome_button"><div class="chrome_b' + 
	'utton_left"></div><span>Cancel</span><div class="chrome_button_right"></div' + 
	'></div></button></div>'
);
jQuery(select_by_tag_widget).append(
	'<div id="tag_away" title="Hide tags that only occur less than a certain num' + 
	'ber of times."><div style="position:absolute;line-height:12px;left:-60px;wi' + 
	'dth:64px;top:-11px;">Hide tags that occur <input type="checkbox" title="Mor' + 
	'e" style="margin-left:-16px;margin-top:-1px;poistion:relative;" id="less_mo' + 
	're_check" /><span id="less_more"> less than</span> </div><input type="text"' + 
	' class="chrome" style="width:40px;height:20px;float:none;" id="less_than_x"' + 
	' value="0"></div>'
);
var backdate_widget = jQuery('<div></div>');
jQuery(backdate_widget).attr({
	id: 'backdate_widget'
});
var BD_body = jQuery('<div></div>');
jQuery(BD_body).css({
	font: "normal 11px 'Lucida Grande',Verdana,sans-serif",
	width: '460px',
	position: 'absolute',
	left: '20px',
	top: '19px',
	height: '523px',
	overflow: 'auto',
	color: '#555'
});
jQuery(BD_body).attr({
	id: 'BD_body'
});
var yr = (new Date().getFullYear() + 1);
var dw = ((new Date().getDate()+1)<=(new Date(new Date().getFullYear(), new Date().getMonth()+1, 0).getDate()))?(new Date().getDate()+1):1;
var mo = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan'][new Date().getMonth() + (dw===1?1:0)];
var da = (" "+dw+", ");
jQuery(BD_body).append(
	'<div>Mass Backdate Options</div><div>dates and times must be logical</div><' + 
	'div>(no future dates or false dates, ie: ' + mo + da + yr + ')</div><div>or' + 
	' else it will cause errors</div><div>&nbsp;</div><div>&nbsp;</div><div id="' + 
	'bd_same_date" style="background-color:#c0c0dc;"><div><label for="no_date_op' + 
	'tion" onclick="window.me_bg(this);"><input type="radio" id="no_date_option"' + 
	' name="date_option" checked="checked" />Leave Date Alone</label></div></div' + 
	'><div id="bd_one_date"><div><label for="one_date_option" onclick="window.me' + 
	'_bg(this);"><input type="radio" id="one_date_option" name="date_option" />O' + 
	'ne Date Only</label></div><div>Month (1-12)<input class="bd_input" type="te' + 
	'xt" id="one_month" />Day (1-<span id="date_count_1">31</span>)<input type="' + 
	'text" class="bd_input" id="one_date" />Year (0-<span id="year_count_1">31</' + 
	'span>)<input class="bd_input" type="text" id="one_year" /></div></div><div ' + 
	'id="bd_two_date"><div><label for="two_date_option" onclick="window.me_bg(th' + 
	'is);"><input type="radio" id="two_date_option" name="date_option" />Between' + 
	' Days</label></div><div>Month (1-12)<input class="bd_input" type="text" id=' + 
	'"two_month_1" />Day (1-<span id="date_count_2">31</span>)<input type="text"' + 
	' class="bd_input" id="two_date_1" />Year (0-<span id="year_count_2">31</spa' + 
	'n>)<input class="bd_input" type="text" id="two_year_1" /></div><div>Month (' + 
	'1-12)<input class="bd_input" type="text" id="two_month_2" />Day (1-<span id' + 
	'="date_count_3">31</span>)<input type="text" class="bd_input" id="two_date_' + 
	'2" />Year (0-<span id="year_count_3">31</span>)<input class="bd_input" type' + 
	'="text" id="two_year_2" /></div></div><div id="bd_same_time" style="backgro' + 
	'und-color:#c0c0dc;"><div><label for="no_time_option" onclick="window.me_bg(' + 
	'this);"><input type="radio" id="no_time_option" name="time_option" checked=' + 
	'"checked" />Leave Time Alone</label></div></div><div id="bd_one_time"><div>' + 
	'<label for="one_time_option" onclick="window.me_bg(this);"><input type="rad' + 
	'io" id="one_time_option" name="time_option" />One Time Only</label></div><d' + 
	'iv style="float:right;margin-right: 130px;"><input type="radio" id="am_opti' + 
	'on" name="ampm_option" checked="checked"/><label for="am_option">AM</label>' + 
	'<input type="radio" id="pm_option" name="ampm_option" /><label for="pm_opti' + 
	'on">PM</label></div><div>Hour (1-12)<input class="bd_input" type="text" id=' + 
	'"one_hour" />:<input type="text" class="bd_input" id="one_minute" />Minute ' + 
	'(1-59)</div></div><div id="bd_two_time"><div><label for="two_time_option" o' + 
	'nclick="window.me_bg(this);"><input type="radio" id="two_time_option" name=' + 
	'"time_option" />Between Time</label></div><div style="float:right;margin-ri' + 
	'ght: 130px;"><input type="radio" id="am_option_2" name="ampm_option_2" chec' + 
	'ked="checked"/><label for="am_option_2">AM</label><input type="radio" id="p' + 
	'm_option_2" name="ampm_option_2" /><label for="pm_option_2">PM</label></div' + 
	'><div>Hour (1-12)<input class="bd_input" type="text" id="two_hour_1" />:<in' + 
	'put type="text" class="bd_input" id="two_minute_1" />Minute (1-59)</div><di' + 
	'v style="float:right;margin-right: 130px;"><input type="radio" id="am_optio' + 
	'n_3" name="ampm_option_3" checked="checked"/><label for="am_option_3">AM</l' + 
	'abel><input type="radio" id="pm_option_3" name="ampm_option_3" /><label for' + 
	'="pm_option_3">PM</label></div><div>Hour (1-12)<input class="bd_input" type' + 
	'="text" id="two_hour_2" />:<input type="text" class="bd_input" id="two_minu' + 
	'te_2" />Minute (1-59)</div></div>'
);
var photo_widget = jQuery('<div></div>');
jQuery(photo_widget).attr({
	id: 'photo_widget'
});
jQuery(photo_widget).css(wg);
var source_widget = jQuery('<div></div>');
jQuery(source_widget).attr({
	id: 'source_widget'
});
jQuery(source_widget).css(wg_s);
jQuery(source_widget).append(
	'<div style="position:absolute;left:21px;top:20px;width:320px;height:225px">' + 
	'Source-Link for selected posts<input style="display:block;width:310px;" val' + 
	'ue="http://" type="text" id="source_option"/><br/><br/><br/>According to Tu' + 
	'mblr rules, you can only source link original posts. No reblogs.<button typ' + 
	'e="button" class="chrome" onclick="window.source_selected();" style="positi' + 
	'on:absolute;left:0;bottom:38px;"><div class="chrome_button"><div class="chr' + 
	'ome_button_left"></div><span>Source Selected</span><div class="chrome_butto' + 
	'n_right"></div></div></button></div><div style="position:absolute; right:41' + 
	'px; bottom:38px;"><button type="button" class="chrome" onclick="jQuery(\'#s' + 
	'ource_widget\').hide();"><div class="chrome_button"><div class="chrome_butt' + 
	'on_left"></div><span>Cancel</span><div class="chrome_button_right"></div></' + 
	'div></button></div>'
);
jQuery(photo_widget).append(
	'<div style="position:absolute;left:21px;bottom:38px;width:460px;top:198px;"' + 
	' onclick="window.just_clicked_select_tags=true;"><hr/><label for="cap_above' + 
	'"><input type="radio" id="cap_above" name="cap_opt"/>Prepend</label><label ' + 
	'for="cap_over"><input type="radio" name="cap_opt" id="cap_over" checked/>Ov' + 
	'erwrite</label><label for="cap_under"><input type="radio" name="cap_opt" id' + 
	'="cap_under"/>Append</label><br/>Caption for selected photos, audio, video ' + 
	'(HTML enabled)<textarea style="display:block;width:440px;height:300px;" id=' + 
	'"caption_option"></textarea><button type="button" class="chrome" onclick="w' + 
	'indow.caption_selected(\'two\', this);"><div class="chrome_button"><div cla' + 
	'ss="chrome_button_left"></div><span>Caption Selected</span><div class="chro' + 
	'me_button_right"></div></div></button></div>'
);
jQuery(photo_widget).append(
	'<div style="position:absolute; left:21px; top:20px; width:460px;">These opt' + 
	'ions are only effective on photo posts (highlighted in yellow). Click-thru ' + 
	'links do not work on re-blogged posts.<br/><hr/><br/>Clickthrough-Link for ' + 
	'selected photos<input style="display:block;width:440px;" type="text" id="cl' + 
	'ickthru_option"/><button type="button" class="chrome" onclick="window.capti' + 
	'on_selected(\'three\', this);" style="display:block;"><div class="chrome_bu' + 
	'tton"><div class="chrome_button_left"></div><span>Clickthrough-Link Selecte' + 
	'd</span><div class="chrome_button_right"></div></div></button></div>'
);
jQuery(photo_widget).append(
	'<div style="position:absolute; right:21px; bottom:38px;"><button type="butt' + 
	'on" class="chrome" onclick="jQuery(\'#photo_widget\').hide();jQuery(\'.phot' + 
	'o_on\').removeClass(\'photo_on\');"><div class="chrome_button"><div class="' + 
	'chrome_button_left"></div><span>Cancel</span><div class="chrome_button_righ' + 
	't"></div></div></button></div>'
);
jQuery(backdate_widget).bind("mousedown", function(event){
	window.just_clicked_select_tags = true;
});
jQuery(photo_widget).bind("mousedown", function(event){
	window.just_clicked_select_tags = true;
});
jQuery(source_widget).bind("mousedown", function(event){
	window.just_clicked_select_tags = true;
});
jQuery(backdate_widget).append(BD_body);
jQuery(backdate_widget).hide();
jQuery(source_widget).hide();
jQuery(photo_widget).hide();
jQuery(backdate_widget).append(
	'<div style="position:absolute; left:21px; bottom:38px;"><button type="butto' + 
	'n" class="chrome" onclick="window.backdate_selected();"><div class="chrome_' + 
	'button"><div class="chrome_button_left"></div><span>Backdate Selected</span' + 
	'><div class="chrome_button_right"></div></div></button></div>'
);
jQuery(backdate_widget).append(
	'<div style="position:absolute; left:230px; bottom:38px;"><button type="butt' + 
	'on" class="chrome" disabled="disabled" id="backdate_reload"><div class="chr' + 
	'ome_button"><div class="chrome_button_left"></div><span>Sort (Reload)</span' + 
	'><div class="chrome_button_right"></div></div></button></div>'
);
jQuery(backdate_widget).append(
	'<div style="position:absolute; right:21px; bottom:38px;"><button type="butt' + 
	'on" class="chrome" onclick="jQuery(\'#backdate_widget\').hide();"><div clas' + 
	's="chrome_button"><div class="chrome_button_left"></div><span>Cancel</span>' + 
	'<div class="chrome_button_right"></div></div></button></div>'
);
var select_by_tag_button = jQuery('<div></div>');
jQuery(select_by_tag_button).addClass('header_button');
jQuery(select_by_tag_button).attr({
	title: 'Select By Tag or Type (limit:100)',
	id: 'sbt'
});
jQuery(select_by_tag_button).html(window.chrome_big_dark("Select By"));
var show_only_button = jQuery('<div></div>');
jQuery(show_only_button).addClass('header_button');
jQuery(show_only_button).attr({
	title: 'Show Only Certain Posts',
	id: 'sho'
});
jQuery(show_only_button).html(window.chrome_big_dark("Show Only"));
var counts_button = jQuery('<div></div>');
jQuery(counts_button).addClass('header_button');
jQuery(counts_button).attr({
	title: 'Count Statistics for All Post',
	id: 'cnts'
});
jQuery(counts_button).html(window.chrome_big_dark("Counts"));
var unselect_by_tag_button = jQuery('<div></div>');
jQuery(unselect_by_tag_button).addClass('header_button');
jQuery(unselect_by_tag_button).attr({
	title: 'Un-Select By Tag or Type',
	id: 'usbt'
});
jQuery(unselect_by_tag_button).html(window.chrome_big_dark("Un-Select By"));
window.main_page = true;
window.pause_button = function(){
	var pause_play = jQuery('<div></div>').click(window.halts);
	jQuery(pause_play).addClass('header_button');
	jQuery(pause_play).attr({
		title: 'Pause Loading, if taking to long...',
		id: 'halt'
	});
	jQuery(pause_play).html(
		window.chrome_big_dark(
			'<span style="color:#FFF;">▌▌</span>'+
			'<span style="color:#999;">►</span>'
		)
	);
	return pause_play;
};
var backdate_button = jQuery('<div></div>');
jQuery(backdate_button).addClass('header_button');
jQuery(backdate_button).attr({
	title: 'Mass Backdate Options',
	id: 'bdb'
});
jQuery(backdate_button).html(window.chrome_big_dark('BackDate'));
var photo_button = jQuery('<div></div>');
jQuery(photo_button).addClass('header_button');
jQuery(photo_button).attr({
	title: 'Mass Caption and Clickthrough-link of selected photo posts.',
	id: 'pob'
});
jQuery(photo_button).html(window.chrome_big_dark('Caption/Clickthru'));
var source_button = jQuery('<div></div>');
jQuery(source_button).addClass('header_button');
jQuery(source_button).attr({
	title: 'Change the source for selected posts.',
	id: 'sce'
});
jQuery(source_button).html(window.chrome_big_dark('Source Link'));
var private_button = jQuery('<div></div>');
jQuery(private_button).addClass('header_button');
jQuery(private_button).attr({
	title: 'Make Selected Private',
	id: 'prvt'
});
jQuery(private_button).html(
	window.chrome_big_dark('<span class="prvt">make PRIVATE</span>')
);
jQuery(private_button).click(window.make_selected_private);
jQuery(window.nav).after(select_by_tag_widget);
jQuery("#less_more_check").change(function(){
	if(jQuery(this).prop("checked")){
		jQuery(this).parent().parent().attr("title",
		"Hide tags that only occur more than a certain number of times.");
		jQuery(this).attr("title","Less");
		jQuery("#less_more").html(" more than");
	}else{
		jQuery(this).parent().parent().attr("title",
		"Hide tags that only occur less than a certain number of times.");
		jQuery(this).attr("title","More");
		jQuery("#less_more").html(" less than");
	}
	window.make_inline_tags(window._sel);
});
jQuery(window.nav).after(photo_widget);
jQuery(window.nav).after(source_widget);
jQuery(window.nav).after(backdate_widget);
select_all.after(select_by_tag_button);
jQuery(".header_button:has(#unselect)").before(unselect_by_tag_button);
jQuery('div.editor_navigation:eq(0)').append(private_button);
jQuery('div.editor_navigation:eq(0)').append(source_button);
jQuery('div.editor_navigation:eq(0)').append(photo_button);
jQuery('div.editor_navigation:eq(0)').append(backdate_button);
jQuery('#one_month').bind('keyup', window.show_days_in_month);
jQuery('#two_month_1').bind('keyup', window.show_days_in_month);
jQuery('#two_month_2').bind('keyup', window.show_days_in_month);
jQuery('#less_than_x').bind('keyup', window.no_less_than_x).css({padding:0});
window.halts = function(){
	if(!window.paused){
		window.paused = true;
		jQuery('#loading').find('span').eq(0).html('Paused...');
		window.next_page = false;
		window.get_data_for_tagsel();
		clearInterval(window.timerid_get_queue_drafts);
		jQuery('#halt').attr({title: "Unpause loading, to continue."});
		jQuery('#halt').find('span').eq(1).css({
			'color': '#FFF'
		});
		jQuery('#halt').find('span').eq(0).css({
			'color': '#999'
		});
	}else{
		window.paused = false;
		jQuery('#halt').attr({title: "Pause Loading, if taking to long..."});
		jQuery('#loading').find('span').eq(0).html('Loading...');
		jQuery('#halt').find('span').eq(0).css({
			'color': '#FFF'
		});
		jQuery('#halt').find('span').eq(1).css({
			'color': '#999'
		});
		if(window.main_page){
			window.next_page = true;
			clearInterval(window.timerid_auto_paginator);
			window.timerid_auto_paginator = setInterval(window.auto_paginator, 200);
		}else{
			clearInterval(window.timerid_get_queue_drafts);
			window.timerid_get_queue_drafts = setInterval(window.q_grab, 300);
		}
	}
}
jQuery('#backdate_widget').children().each(function(i, el){
	jQuery(el).bind("click", function(){
		window.just_clicked_select_tags = true;
	});
});
var to_publish = jQuery('<div></div>');
jQuery(to_publish).addClass('header_button');
jQuery(to_publish).attr({
	title: 'Publish Selected',
	id: 'toPublish'
});
jQuery(to_publish).html(window.chrome_big_dark('Publish'));
jQuery('div.editor_navigation:eq(0)').append(to_publish);
jQuery('#toPublish').hide();
var to_queue = jQuery('<div></div>');
jQuery(to_queue).addClass('header_button');
jQuery(to_queue).attr({
	title: 'Move selected drafts to your queue.',
	id: 'toQueue'
});
jQuery(to_queue).html(window.chrome_big_dark('Queue Drafts'));
var to_republish = jQuery('<div></div>');
jQuery(to_republish).addClass('header_button');
jQuery(to_republish).attr({
	title: 'Make selected posts RePublish-able as Drafts.',
	id: 'toRepublish'
});
jQuery(to_republish).html(window.chrome_big_dark('Re-As Draft'));
var link_btns = jQuery('<div></div>');
jQuery(link_btns).addClass('header_button');
jQuery(link_btns).attr({
	'title': 'Show or hide links',
	'id': 'links_btn'
});
jQuery(link_btns).html(window.chrome_big_dark("Edit/View Links"));
jQuery(to_queue).bind("click", function(){
	window.draft_queue_publish(true);
});
jQuery(to_publish).bind("click", function(){
	window.draft_queue_publish(false);
});
jQuery(to_republish).bind("click", function(){
	window.make_republishable_draft();
});
jQuery(link_btns).bind("click", function(e){
	if(!window.visible_blog_links){
		jQuery("#links_btn").html(jQuery("#links_btn").html().replace("Edit/View Links", "Hide Links"));
		window.visible_blog_links = true;
		window.view_post_links(true);
	}else{
		jQuery("#links_btn").html(jQuery("#links_btn").html().replace("Hide Links", "Edit/View Links"));
		window.visible_blog_links = false;
		window.view_post_links(false);
	}
});
var cap_btn = jQuery('<div></div>');
jQuery(cap_btn).addClass('header_button');
jQuery(cap_btn).attr({
	'title': 'Show or hide captions of photo posts.',
	'id': 'cap_btn'
});
jQuery(cap_btn).html(window.chrome_big_dark("Show Captions"));
jQuery(cap_btn).bind("click", function(e){
	if(!window.visible_photo_captions){
		jQuery("#cap_btn").html(jQuery("#cap_btn").html().replace("Show", "Hide"));
		window.visible_photo_captions = true;
		window.view_post_captions(true);
	}else{
		jQuery("#cap_btn").html(jQuery("#cap_btn").html().replace("Hide", "Show"));
		window.visible_photo_captions = false;
		window.view_post_captions(false);
	}
});
jQuery('div.editor_navigation:eq(0)').append(to_queue);
jQuery('div.editor_navigation:eq(0)').append(to_republish);
jQuery('#toQueue').hide();
jQuery(select_by_tag_widget).css(wg);
jQuery(backdate_widget).css(wg);
window.massedit();
jQuery('#add_tag_button').bind("click", window.add_tags_for_queue);
jQuery('#remove_tag_button').bind("click", window.remove_tags_for_queue);
jQuery('#sbt').bind("click", function(){window.tag_widget_show(1)});
jQuery('#usbt').bind("click", function(){window.tag_widget_show(2)});
jQuery('#bdb').bind("click", window.backdate_widget_show);
jQuery('#pob').bind("click", window.photo_widget_show);
jQuery('#sce').bind("click", window.source_widget_show);
//cosmetic after thoughts
window.first_few_letters = "";
window.next_key_fired = 0;
jQuery(window).keyup(function(e){ // added to scroll to tag by typing it's letters
	if(!jQuery("#less_than_x").is(":focus")
	&& !jQuery("#more_notes").is(":focus")
	&& !jQuery("#less_notes").is(":focus")
	&& !jQuery("#tag_count_input").is(":focus")
	&& jQuery("#tagsel").is(":visible")){
		clearTimeout(window.next_key_fired);
		window.next_key_fired = setTimeout(function(){
			window.first_few_letters = "";
		},1300);
		var letter = String.fromCharCode(e.keyCode);
		if(letter.match(/^[0-9a-zA-Z ]+$/)!==null){
			window.first_few_letters += letter.toLowerCase();
			if(window.first_few_letters!=="")
				jQuery("#tagsel div[tag]").each(function(){
					var tag = jQuery(this);
					var s_reg = new RegExp("^"+window.first_few_letters,"i");
					if(tag.attr("tag").match(s_reg)!==null){
						jQuery("#tagsel").scrollTop(
							jQuery("#tagsel").scrollTop() + tag.position().top
						);
						return false;
					}
				});
		}
	}
});
jQuery('#content').attr('unselectable', 'on').css('user-select', 'none').on('selectstart', false);
var custom_gutter = jQuery('<div></div>');
jQuery(custom_gutter).addClass('header_button');
jQuery(custom_gutter).attr({
	title: 'Custom Gutter (type # or press up/down)',
	onclick: "jQuery('#custom_gutter').focus();"
});
jQuery(custom_gutter).html(
	window.chrome_big_dark(
		'<input type="text" value="gutter" title="custom gutter size" id="custo' + 
		'm_gutter" class="chrome" style="width:50px;height:-1px;font-weight:bol' + 
		'd;font-family:monospace;border:0px none ! important;margin-top:-1px;pa' + 
		'dding:5px 0px;height:20px;" />'
	)
);
window.row1 = jQuery('<div>').addClass('editor_navigation');
jQuery(window.row1).append(show_only_button);
jQuery(window.row1).append(custom_gutter);
jQuery(window.row1).append(link_btns);
jQuery(window.row1).append(cap_btn);
jQuery(window.row1).prepend(counts_button);
jQuery(window.row1).append(window.pause_button());
jQuery(window.row1).prepend(
	jQuery("<span>").attr({
		'title': 'scripts.b9mx.com Please send me feedback and bug reports and I promise to never disappoint thee! Send me ask too!',
	}).css({
		'color': 'rgba(255, 255, 255, 0.7)',
		'float': 'right',
		'font-size': '11px',
		'padding-top': '5px',
		'text-align': 'right',
		'width': '200px'
	}).text("Mass Post Features - v3.10.7")
);
jQuery('div.editor_navigation:eq(0)').before(window.row1);
jQuery("#custom_gutter").parents("button").click(function(){
	jQuery("#custom_gutter").get(0).focus();
	if(jQuery("#custom_gutter").val() === 'gutter'){
		jQuery("#custom_gutter").val("6")
	}
});
jQuery("#custom_gutter").bind('keyup', function(e){
	x = parseInt(jQuery('#custom_gutter').val());
	if(!isNaN(x) && e.keyCode !== 38 && e.keyCode !== 40){
		window.column_gutter = x;
		window.column_full_width = 125 + x;
		window.build_columns(true);
		jQuery('#custom_gutter').val(x);
	}else if(!isNaN(x) && e.keyCode === 40){
		x -= 10;
		jQuery('#custom_gutter').val(x);
		window.column_gutter = x;
		window.column_full_width = 125 + x;
		window.build_columns(true);
	}else if(!isNaN(x) && e.keyCode === 38){
		x += 10;
		jQuery('#custom_gutter').val(x);
		window.column_gutter = x;
		window.column_full_width = 125 + x;
		window.build_columns(true);
	}else{
		x = 6;
		window.column_gutter = x;
		window.column_full_width = 125 + x;
		window.build_columns(true);
		jQuery('#custom_gutter').val(x);
	}
});
jQuery('#sho').bind("click", function(){window.tag_widget_show(0)});
jQuery('#cnts').bind("click", function(){window.tag_widget_show(3)});