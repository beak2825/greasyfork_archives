// ==UserScript==
// @name         饅頭橙人種子過濾
// @description  快速篩選做種人數超過200的種子。
// @author       YK Yau
// @version      0.2
// @match        https://*.m-team.cc/adult.php*
// @require     https://code.jquery.com/jquery-1.12.4.min.js
// @grant unsafeWindow
// @namespace https://greasyfork.org/users/707892
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447793/%E9%A5%85%E9%A0%AD%E6%A9%99%E4%BA%BA%E7%A8%AE%E5%AD%90%E9%81%8E%E6%BF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/447793/%E9%A5%85%E9%A0%AD%E6%A9%99%E4%BA%BA%E7%A8%AE%E5%AD%90%E9%81%8E%E6%BF%BE.meta.js
// ==/UserScript==

(function() {
	const min_seeder = 200;
	
	// Define filter panel
    const panel = $(`<div id="filter_panel"><ul><li class='btn btn-filter' data-action="filter">做種多於`+min_seeder+`</li><li class=btn><a  id="next_page">下一頁</a></li></ul></div>`);
	// Insert filter panel on top of torrents table
    $("table.torrents").before(panel);

	// Define extra css style
	let style = document.createElement("style")
	    style.type = "text/css"
	    style.appendChild(document.createTextNode(`
	    #filter_panel {

		    right: 0;
		    top: 15%;
		    background: rgba( 218, 165, 32, 0.8);
	    }
	    #filter_panel ul {
	    	display: flex;
	    	float: right;
	    	list-style: none;
	    	padding: 0 20px 0 0 ;
	    }
	    #filter_panel ul li.active {
	    	background: palegreen;
	    }
	`))
	document.getElementsByTagName('head')[0].appendChild(style);

	// Bind btn click event
	$(".btn-filter").on('click', function() {
		let results_count = 0;

		// Set current filter btn and hide another
		$(this).addClass('active');
		$(this).siblings('.btn-filter').hide();

		// Filter all torrents
		$('table.torrents > tbody > tr').each(function () {
		    if(parseInt($(this).children('td:eq(5)').text()) >= min_seeder){
		        $(this).css("background","NavajoWhite");
		        console.log($(this).children('td:eq(1)').text());
		        results_count++;
		    } else {
		        $(this).remove();
		    }
		});
		console.log('共找到 '+results_count+' 個符合的種子');
	});
	// Find next page url
	$next_page_url = $("font.gray").next().attr('href');
	// Set next page url
	$('#next_page').attr('href', $next_page_url);
})();