// ==UserScript==
// @name          4chan post sort
// @namespace     4chanpostsort
// @description   Sorts 4chan posts in a thread by number of replies to a post
// @include       http://boards.4chan.org/*/*
// @include       https://boards.4chan.org/*/*
// @version 0.0.1.20150629054247
// @downloadURL https://update.greasyfork.org/scripts/10702/4chan%20post%20sort.user.js
// @updateURL https://update.greasyfork.org/scripts/10702/4chan%20post%20sort.meta.js
// ==/UserScript==


if (!GM_registerMenuCommand)
	alert('Please upgrade to the latest version of Greasemonkey.');
else
{
	function toArray(obj) {
		var array = [];
		// iterate backwards ensuring that length is an UInt32
		for (var i = obj.length >>> 0; i--;) { 
			array[i] = obj[i];
		}
		return array;
	};

	function compareChildrenCount (a,b) {
		if (a.children.length < b.children.length) { return -1; }
		if (a.children.length > b.children.length) { return 1; }
		return 0;
	};

	function PS_sort()
	{
		var reps = document.getElementsByClassName("backlink");
		reps = toArray(reps);
		reps.sort(compareChildrenCount);
		t=reps[0].parentNode.parentNode.parentNode.parentNode;
		for(i=0,x=reps.length;i<x;i++) {
			var e = reps[i].parentNode.parentNode.parentNode;
			e = t.removeChild(e);
			t.insertBefore(e, t.childNodes[0]);
		};
	};

	GM_registerMenuCommand('4chan Sort Posts by Reply Count', PS_sort);
};


