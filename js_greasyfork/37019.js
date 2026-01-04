// ==UserScript==
// @name        StatusDetailLastLink
// @namespace   https://greasyfork.org/en/users/6503-turk05022014
// @version     1.0.20180104
// @description Adds a link for the Last Page on Status Detail pages.
// @match       https://worker.mturk.com/status_details/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/37019/StatusDetailLastLink.user.js
// @updateURL https://update.greasyfork.org/scripts/37019/StatusDetailLastLink.meta.js
// ==/UserScript==
$(function () {
	pages = $(".mturk-pagination").parent().data().reactProps;
	addPages();
});
function addPages() {
	if (pages.lastPage > pages.currentPage) {
		var link = $(".mturk-pagination a:contains('Next')").attr("href").replace(/page_number=\d+/, "page_number="+pages.lastPage);
		$(".mturk-pagination li:contains('Next')").after('<li class="page-item text-only"><a class="page-link" href="'+link+'">Last ››</a></li>');
	}
}
