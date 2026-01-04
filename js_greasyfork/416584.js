// ==UserScript==
// @name         CHD小文件種子篩選
// @description  快速篩選 CHD 的官方/非官方小種，充滿魔力，具體請閱讀詳細介紹。
// @author       YK Yau
// @version      0.2
// @match        https://chdbits.co/torrents.php?cat=401
// @match		 https://chdbits.co/torrents.php?*sort=5*
// @grant        none
// @namespace https://greasyfork.org/users/707892
// @downloadURL https://update.greasyfork.org/scripts/416584/CHD%E5%B0%8F%E6%96%87%E4%BB%B6%E7%A8%AE%E5%AD%90%E7%AF%A9%E9%81%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/416584/CHD%E5%B0%8F%E6%96%87%E4%BB%B6%E7%A8%AE%E5%AD%90%E7%AF%A9%E9%81%B8.meta.js
// ==/UserScript==

(function() {
	const max_seeder = 3;
	// Define the entry page
	const entry_url = 'https://chdbits.co/torrents.php?cat=401';

	// Define filter panel
    const panel = $(`<div id="filter_panel"><ul><li class=btn><a href="?cat401=1&inclbookmarked=0&incldead=1&spstate=0&&sort=5&type=asc&page=25">快速篩選小種</a></li><li class='btn btn-filter' data-action="gf">官方</li><li class='btn btn-filter'  data-action="fgf">非官方</li><li class=btn><a  id="next_page">下一頁</a></li></ul>`);
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

	if (window.location.href == entry_url) {
		$("#filter_panel > ul >li:eq(0)").siblings().hide();
	} else {
		$("#filter_panel > ul >li:eq(0)").html("種子篩選");
	}

	// Bind btn click event
	$(".btn-filter").on('click', function() {
		let results_count = 0;

		// Set current filter btn and hide another
		$(this).addClass('active');
		$(this).siblings('.btn-filter').hide();

		// Check btn action
		let gf_condition = ($(this).data('action') == 'gf') ? '官方' : undefined;

		// Filter all torrents
		$('table.torrents > tbody > tr').each(function () {
		    if($(this).find('.tag-gf').html() == gf_condition && parseInt($(this).children('td:eq(5)').text())+parseInt($(this).children('td:eq(6)').text()) <= max_seeder && $(this).children('td:eq(9)').html() == '--'){
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