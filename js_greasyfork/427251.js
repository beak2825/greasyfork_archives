// ==UserScript==
// @name         Steam addon parser
// @namespace    http://tampermonkey.net/
// @version      0.53
// @description  And THIS is my weapon...
// @author       Heavy Weapons Guy
// @match        https://steamcommunity.com/*
// @icon         https://www.google.com/s2/favicons?domain=steamcommunity.com
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427251/Steam%20addon%20parser.user.js
// @updateURL https://update.greasyfork.org/scripts/427251/Steam%20addon%20parser.meta.js
// ==/UserScript==

//version bug
// add css
// Css base64
window.super_css = "LyoNCi5ub2NsaWNrDQp7DQogIGFsbDogdW5zZXQ7DQp9DQoqLw0KLnN1cGVyX2Z1Y2tfeW91DQp7DQogIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDsNCn0NCg0KLnRlc3QNCnsNCiAgY29sb3I6IHJlZCAhaW1wb3J0YW50Ow0KfQ0KDQouc3VwZXJfZnVja195b3UgKg0Kew0KICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7DQp9DQoNCi5pbmZvX3RhYmxlDQp7DQogIGRpc3BsYXk6IGZsZXggIWltcG9ydGFudDsNCiAgLyoNCiAgcG9zaXRpb246IGFic29sdXRlOw0KICBsZWZ0OiAyNXB4Ow0KICB0b3A6IDUwMHB4Ow0KICB3aWR0aDogNDAwcHg7DQogIHotaW5kZXg6IDk5OTk5OTk5Ow0KICAqLw0KICBjb2xvcjogd2hpdGU7DQogIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC41KTsNCiAgcGFkZGluZzogNXB4Ow0KICBmbGV4LWRpcmVjdGlvbjogY29sdW1uOw0KfQ0KDQoucGFnZV9saXN0X2xvYWRlcg0Kew0KICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7DQp9DQoNCi5ub2NsaWNrDQp7DQogIGRpc3BsYXk6IGZsZXg7DQogIHdpZHRoOiAxMDAlOw0KICBjb2xvcjogd2hpdGU7DQogIHVzZXItc2VsZWN0OiBub25lICFpbXBvcnRhbnQ7DQogIHBvaW50ZXItZXZlbnRzOiBub25lICFpbXBvcnRhbnQ7DQogIGNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNSk7DQoNCiAgDQp9DQoNCg0KLmluZm9fdGFibGVfc3RhdHMNCnsNCiAgdXNlci1zZWxlY3Q6IG5vbmUgIWltcG9ydGFudDsNCiAgcG9pbnRlci1ldmVudHM6IG5vbmUgIWltcG9ydGFudDsNCn0NCg0KQC1tb3otZG9jdW1lbnQgdXJsLXByZWZpeCgpIA0Kew0KICAubm9jbGljayANCiAgew0KICAgIG1hcmdpbi10b3A6IDI4cHg7DQogIH0NCn0NCg0KDQovKg0KPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQ0KDQpTZXggdG95cyBtZW51IHN0YXJ0DQoNCj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0NCiovDQoNCi8qDQoucG1rN2pucWcgaW1nOmhvdmVyDQp7DQogIGZpbHRlcjogZ3JheXNjYWxlKDEwMCUpOw0KDQp9DQoqLw0KQGltcG9ydCB1cmwoImh0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzMj9mYW1pbHk9Um9ib3RvOndnaHRAMTAwJmRpc3BsYXk9c3dhcCIpOw0KDQovKg0KQGltcG9ydCB1cmwoImh0dHBzOi8vZGwuZHJvcGJveC5jb20vcy9yM2tobXlwNGtqcG95bWkvZHJvaWRzYW5zLnR0Zj9kbD0wIik7DQoqLw0KDQpAZm9udC1mYWNlIA0Kew0KICAgIGZvbnQtZmFtaWx5OiAiYmxlbmRlciI7DQogICAgc3JjOiB1cmwoImh0dHBzOi8vZGwuZHJvcGJveC5jb20vcy9yM2tobXlwNGtqcG95bWkvZHJvaWRzYW5zLnR0Zj9kbD0wIik7DQp9DQoNCi5jbGFzc19oaWRkZW4NCnsNCiAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50Ow0KfQ0KDQoubm9zZWxlY3QNCnsNCiAgLXdlYmtpdC10b3VjaC1jYWxsb3V0OiBub25lOw0KICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lOw0KICAta2h0bWwtdXNlci1zZWxlY3Q6IG5vbmU7DQogIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7DQogIC1tcy11c2VyLXNlbGVjdDogbm9uZTsNCiAgdXNlci1zZWxlY3Q6IG5vbmU7DQp9DQoNCi5mbGlwX3gNCnsNCiAgLXdlYmtpdC10cmFuc2Zvcm06IHNjYWxlWCgtMSk7DQogIHRyYW5zZm9ybTogc2NhbGVYKC0xKTsNCn0NCg0KLmVsZW1faG92ZXI6aG92ZXINCnsNCiAgZmlsdGVyOiBncmF5c2NhbGUoMTAwJSk7DQp9DQovKg0KaW1nDQp7DQogIG1hcmdpbi10b3A6IDkwcHg7DQogIHdpZHRoOiAzMDBweDsNCn0NCiovDQouYm1lbnVfcm9vdA0Kew0KICB6LWluZGV4OiA5OTk5OTk7DQogIHBvc2l0aW9uOiBmaXhlZDsNCiAgd2lkdGg6IDIwMHB4Ow0KICBkaXNwbGF5OiBmbGV4Ow0KICBjb2xvcjogI0U2RTZFNjsNCiAgZm9udC1mYW1pbHk6ICdibGVuZGVyJywgc2Fucy1zZXJpZjsNCiAgZm9udC1zaXplOiAxMnB4Ow0KfQ0KDQouYm1lbnVfbWVudQ0Kew0KICBkaXNwbGF5OiBmbGV4Ow0KICBmbGV4LWRpcmVjdGlvbjogY29sdW1uOw0KICB3aWR0aDogMTAwJTsNCiAgaGVpZ2h0OiAxMDAlOw0KICBiYWNrZ3JvdW5kOiByZ2JhKDMxLCAzMSwgMzEsIDAuOTM3KTsNCiAgYm9yZGVyOiAxcHggc29saWQgIzE5MTkxQTsNCiAgYm9yZGVyLXJhZGl1czogNnB4Ow0KICBwYWRkaW5nOiA1cHggMXB4IDVweCAxcHg7DQogIA0KICANCiAgLXdlYmtpdC1ib3gtc2hhZG93OiAwcHggMXB4IDNweCAwcHggcmdiYSgwLDAsMCwwLjkpOyANCiAgYm94LXNoYWRvdzogMHB4IDFweCAzcHggMHB4IHJnYmEoMCwwLDAsMC45KTsNCn0NCg0KLmJtZW51X2VudHJ5DQp7DQogIHBhZGRpbmc6IDJweCAwcHggMnB4IDMwcHg7DQogIGRpc3BsYXk6IGZsZXg7DQogIG1hcmdpbi10b3A6IDJweDsNCn0NCg0KLmJtZW51X2VudHJ5OmhvdmVyDQp7DQogIGJhY2tncm91bmQ6ICM1NjgwQzI7DQp9DQoNCi5ibWVudV9oZWFkZXINCnsNCiAgcGFkZGluZzogMHB4IDBweCAycHggMTBweDsNCiAgZGlzcGxheTogZmxleDsNCiAgbWFyZ2luLXRvcDogMnB4Ow0KICBjb2xvcjogI2E1YTVhNTsNCn0NCg0KLmJtZW51X3NlcGFyYXRvcg0Kew0KICBoZWlnaHQ6IDFweDsNCiAgZGlzcGxheTogZmxleDsNCiAgbWFyZ2luOiAzcHggMHB4IDNweCAwcHg7DQogIGJhY2tncm91bmQ6ICMzOTM5Mzk7DQp9DQoNCi8qDQo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09DQoNClNleCB0b3lzIG1lbnUgRU5EDQoNCj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0NCiovDQo";

$(document).ready(function(){
    $("body").append('<style>' + atob(super_css) + '</style>');
});
// modes

// img flip mode
window.img_flip_mode = 0;

// hax init
window.hax_innit = 1;

//lock menu
window.menu_lock = 0;

//====================================
//  pootis. Log mouse position
//====================================
		document.addEventListener('mousemove'
			, function(e){
				var x = e.clientX;
				var y = e.clientY
				window.cs_x = x + "px";
				window.cs_y = y + "px";
			});
//====================================
//  pootis
//====================================


function img_flip(selector_fuck)
{
  $(selector_fuck).toggleClass("flip_x");
}




// innit hax

document.addEventListener ("keydown", function (zEvent) {

    if ( zEvent.keyCode == 27)
    {
        window.img_flip_mode = 0;
        window.menu_lock = 0;
        $("img").removeClass("elem_hover");
        $(".bmenu_root").addClass("class_hidden");
    }

    // Open menu on shortcut. Todo: customizable shorcut
    if ( zEvent.altKey  &&  zEvent.keyCode == 87  ) {  // case sensitive
        if (hax_innit == 1)
        {
            $("body").append('<div class="bmenu_root class_hidden"> <div class="bmenu_menu"> <div class="bmenu_header noselect">Sex Toys</div> <div class="bmenu_separator"></div> <div bmenu_opt="img_flip" class="bmenu_entry noselect">Flip image</div> <div bmenu_opt="pizza" class="bmenu_entry noselect">Order pizza</div> </div> </div>');
            window.hax_innit = 0;
            console.log("hax_created");

            $(".bmenu_root")
                .css({
                left: cs_x,
                top: cs_y,
            });

            $(".bmenu_root").removeClass("class_hidden");
        }else{

            if (menu_lock == 1)
            {
                console.log("menu_locked");
            }else{
                $(".bmenu_root")
                    .css({
                    left: cs_x,
                    top: cs_y,
                });

                $(".bmenu_root").removeClass("class_hidden");
            }

        }

    }

});



// hax
document.addEventListener('click', event => {
    // console.log("click_registered");


    // Close hax if clicked outside
    const bmenu_close = event.target.closest('.bmenu_menu');
    if (bmenu_close)
    {
        console.log("clicked_a_menu");
    }else{
        // console.log("clicked_not_menu");
        $(".bmenu_root").addClass("class_hidden");
    }


    const bmenu_entry = event.target.closest('.bmenu_entry');
    if (bmenu_entry)
    {
        console.log("clicked_on_an_entry");
        // console.log($(bmenu_entry).attr("bmenu_opt"));


        // Built-in img flipper
        if ($(bmenu_entry).attr("bmenu_opt") == "img_flip")
        {
            console.log("imgflipped");
            //  img_flip(bmenu_entry);
            window.img_flip_mode = 1;
            window.menu_lock = 1;
            $("img").addClass("elem_hover");
            $(".bmenu_root").addClass("class_hidden");
        }

        if ($(bmenu_entry).attr("bmenu_opt") == "pizza")
        {
            counter_initializer()
            console.log("counting");
            $(".bmenu_root").addClass("class_hidden");
        }
    }




    const questionable_img = event.target.closest('img');
    if (img_flip_mode == 1)
    {

        if (questionable_img)
        {
            img_flip(questionable_img);
            window.img_flip_mode = 0;
            window.menu_lock = 0;
            $("img").removeClass("elem_hover");
        }

    }


});
// hax










function counter_initializer()
{
    $("#leftContents *").remove();
    window.current_profile = $("#global_actions a.user_avatar").attr("href").split('/');
    window.current_profile_id = current_profile[4];
    window.total_addon_amount = $(".workshopBrowsePagingWithBG .workshopBrowsePagingInfo").text().split(' ');
    $("#leftContents").attr("id", "leftContents_lizard");
    $("body").append('<div class="page_list_loader"></div>');
    $("#leftContents_lizard").append('<div class="info_table"><div class="info_table_stats"><div class="stats_page">Page: </div><div class="stats_list_item">Item: </div><br><br><div class="stats_list_ded_addons">Ded addons: 0</div></div></div>');
    window.first_page_link = "https://steamcommunity.com/id/" + current_profile_id + "/myworkshopfiles/?appid=4000&browsefilter=mysubscriptions&p=1&numperpage=30 #leftContents";
    window.super_counter = 0;
    window.page_counter = 1;
    window.total_page_amount = 2;
    window.total_ded_addons_counter = 0;
    window.total_subscriptions_amount = "null";

    // perform very initial load of the first page
    $( ".page_list_loader" ).load( first_page_link, function() {
        console.log("initial load of page 1");
        window.total_page_amount = parseInt( $("#leftContents .workshopBrowsePagingControls .pagelink:eq(-1)").text() );
        $(".stats_page").text("Page: " + 1 + " / " + total_page_amount);
        total_addon_amount_counter()
        // addon_list_checker()
    });
}

// count all addons
function total_addon_amount_counter()
{
	$(".page_list_loader *").remove();
	var last_page_link = first_page_link.replace("mysubscriptions&p=1", "mysubscriptions&p=" + total_page_amount);
	console.log("parsing addon amount");

	$( ".page_list_loader" ).load( last_page_link, function() {
		var count_addons_based_on_page_amount = 30 * (total_page_amount - 1);
		var last_page_subscription_amount = $('#leftContents .workshopItemSubscription[id*="Subscription"]').length
		window.total_subscriptions_amount = 0;
		window.constant_total_subscriptions_amount = count_addons_based_on_page_amount + last_page_subscription_amount;
		// addon_list_checker()
		midstep_because_im_stupid()
	});
}

function midstep_because_im_stupid()
{
	$( ".page_list_loader" ).load( first_page_link, function() {
	  console.log("initial load of page 1");
	  window.total_page_amount = parseInt( $("#leftContents .workshopBrowsePagingControls .pagelink:eq(-1)").text() );
	  $(".stats_page").text("Page: " + 1 + " / " + total_page_amount);
	  // total_addon_amount_counter()
	  addon_list_checker()
	});
}

function addon_list_checker()
{
    $('#leftContents .workshopItemSubscription[id*="Subscription"]').each(function(){
        console.log(super_counter);

        $(this).append('<div class="super_fuck_you temp_loader_' + $(this).attr("id") + '"></div>');
        var current_link = $(this).find(".workshopItemPreviewHolderFloatLeft a").attr("href") + " #message";
        var current_id = $(this).attr("id").replace("Subscription", "");
        var current_name = $(this).find(".workshopItemSubscriptionDetails a .workshopItemTitle").text();
        $(this).find(".super_fuck_you").load( current_link, function() {

			if ($(this).find("#message h3").length > 0)
			{
				console.log("HA, RED ERROR");
				$(".info_table").append('<br> <br> <a href="#" class="noclick">This awesome addon is gone! Reduced to atoms!</a>' + '<div class="info_pootis">' + current_name + '</div>' + '<div class="info_pootis">' + current_id + '</div>');
				window.total_ded_addons_counter = total_ded_addons_counter + 1;
				$(".stats_list_ded_addons").text("Ded addons: " + total_ded_addons_counter);
			}else{
				console.log("no error 4 u");
			}
			$(".super_fuck_you").remove();
			window.super_counter = super_counter + 1;
			window.total_subscriptions_amount = total_subscriptions_amount + 1;
			$(".stats_list_item").text("Item: " + super_counter + "/30" + "  a total of " + total_subscriptions_amount + "/" + constant_total_subscriptions_amount );
			super_addon_page_loader()

        });

    });
}

function super_addon_page_loader()
{
    if ( page_counter > total_page_amount )
    {
        console.log("enough sex for now. give your dick a rest");
    }else{
        if ( super_counter == 30 )
        {
            console.log("ejacuated");
            $(".page_list_loader *").remove();
            window.super_counter = 0;
            window.page_counter = page_counter + 1;
            $(".stats_page").text("Page: " + page_counter + " / " + total_page_amount);
            var super_next_page = 'https://steamcommunity.com/id/' + current_profile_id + '/myworkshopfiles/?appid=4000&browsefilter=mysubscriptions&p=' + page_counter + '&numperpage=30 #leftContents';
            $( ".page_list_loader" ).load( super_next_page, function() {
              console.log("trying to load next page");
              addon_list_checker()
            });
        }else{
            console.log("Havent reached the last item on a page. Pls wait");
        }
    }
}

