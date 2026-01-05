// ==UserScript==
// @name        NGU SBPM Fix (beta)
// @namespace   http://www.nextgenupdate.com
// @description Allows click to SBPM one letter and other usernames
// @include     /^https?:\/\/www\.nextgenupdate\.com\/forums\/infernoshout\.php\?do=detach$/
// @include     /^https?:\/\/www\.nextgenupdate\.com\/forums\/(forumhome|index)\.php$/
// @include     /^https?:\/\/www\.nextgenupdate\.com\/forums.?.?$/
// @version     1.00
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11878/NGU%20SBPM%20Fix%20%28beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/11878/NGU%20SBPM%20Fix%20%28beta%29.meta.js
// ==/UserScript==


iboxoshouts.new_open_pm_tab = function(pmid, username)
{
	if (!iboxoshouts.pm_tabs)
	{
		iboxoshouts.pm_tabs = {};
	}

	if (iboxoshouts.pm_tabs[pmid])
	{
		iboxoshouts.goto_pm_window(pmid);
		return false;
	}

	// Create the tab
	iboxoshouts.append_tab('<a href="#" onclick="return InfernoShoutboxControl.goto_pm_window(\'' + pmid + '\');">' + username + '</a>', 1);

	// Create the window
	//iboxoshouts.append_shout_window(pmid, '/pm ' + username + '; ', '', 'pmonly&pmid=' + pmid.split('_')[1]);
    // workaround
    var uid = pmid.split('_')[1];
	iboxoshouts.append_shout_window(pmid, '/pm ' + uid + '; ', '', 'pmonly&pmid=' + uid);

	// Switch to the window
	iboxoshouts.goto_pm_window(pmid);

	return false;
}
    
iboxoshouts.open_pm_tab = iboxoshouts.new_open_pm_tab;