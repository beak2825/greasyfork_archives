// ==UserScript==
// @name        Quick LQP Report
// @namespace   HF
// @description http://hackforums.net/showthread.php?tid=5193528
// @author      Hash G.
// @include     *hackforums.net/showthread.php?tid=*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @version     0.1
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/17799/Quick%20LQP%20Report.user.js
// @updateURL https://update.greasyfork.org/scripts/17799/Quick%20LQP%20Report.meta.js
// ==/UserScript==


post_key = $("a.one_star").attr("href").substr(50);

$("a[href*='javascript:Thread.reportPost']").each(function() {
	pid = $(this).attr("href").substr(29);
	pid = pid.slice(0, -2);
	$(this).after(' <a class="bitButton" style="cursor: pointer;" data-btn="lqpreport" data-pid="'+pid+'">LQP</a>');
});


$("a[data-btn='lqpreport']").on("click", function() {
	$(this).attr("data-clicked", "true");
	$.post("report.php", {
		my_post_key: post_key, 
        reason: "low quality",
		action: "do_report",
		pid: $(this).attr("data-pid")
	},
	function (data, status) {
		if (status == "success") {
			$("a[data-clicked='true']").html("Done");
		}
	})
});

