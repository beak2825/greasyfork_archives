// ==UserScript==
// @name           Google old favicon
// @name:fr        Google ancien favicon
// @description    Restores oldest google favicon. Motty Katan(c) 05-09-2015 last updated 15-09-2015
// @description:fr    Restorer l'ancien (l'originel) logo de Google car celui de septembre 2015 est vachement moche. Motty Katan(c) 05-09-2015 dernière mise à jour 15-09-2015
// @version 1.0.2
// @include       /^https?://.*\.google\..*/(\?|search|maps|#q\=).*$/
// @include       /^https?://.*\.google\..*/(webhp|imgres)\?.*$/
// @include       /^https?://.*\.google\..*?/$/
// @namespace https://greasyfork.org/users/14985
// @downloadURL https://update.greasyfork.org/scripts/12223/Google%20old%20favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/12223/Google%20old%20favicon.meta.js
// ==/UserScript==
//20150915 adding imgres url, support for no shorticon special case
(function(){
	var oChildren = document.head.children;
	var i = -1;
	while (++i < oChildren.length && oChildren[i].tagName != 'LINK' && oChildren[i].getAttribute('rel') != "shortcut icon"){}	
	if (typeof(oChildren[i])=="undefined"){
		//google's HTML was and still is problematic to say the very least
		//dealing with /imgres
		var oLink = document.createElement("LINK");
		oLink.setAttribute("rel", "shortcut icon");
		document.head.appendChild(oLink);
	}
	oChildren[i].href = 'data:image/x-icon;base64,AAABAAEAEBAAAAAAAABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAACAAAAAgIAAgAAAAIAAgACAgAAAwMDAAICAgAAAAP8AAP8AAAD//wD/AAAA/wD/AP//AAD///8A//3/AP39/wD6/f8A+P3/AP/8/wD9/P8A+vz/AP/7/wD/+v8A/vr/APz6/wD4+v8A+/n/APP5/wD/+P8A+vj/AO/4/wDm+P8A2fj/AP/3/wD/9v8A9vb/AP/1/wD69f8A9PT/AO30/wD/8/8A//L/APnx/wD28P8A///+APj//gD2//4A9P/+AOP//gD//f4A6f/9AP///AD2//wA8//8APf9/AD///sA/v/7AOD/+wD/+vsA9/X7APr/+gDv/voA///5AP/9+QD/+/kA+e35AP//+ADm//gA4f/4AP/9+AD0+/gA///3APv/9wDz//cA8f/3AO3/9wD/8fcA//32AP369gDr+vYA8f/1AOv/9QD/+/UA///0APP/9ADq//QA///zAP/18wD///IA/fzyAP//8QD///AA9//wAPjw8AD//+8A8//vAP//7gD9/+4A9v/uAP/u7gD//+0A9v/tAP7/6wD/+eoA///pAP//6AD2/+gA//nnAP/45wD38eYA/fblAP/25AD29uQA7N/hAPzm4AD/690AEhjdAAAa3AAaJdsA//LXAC8g1gANH9YA+dnTAP/n0gDh5dIADyjSABkk0gAdH9EABxDRAP/l0AAAJs4AGRTOAPPczQAAKs0AIi7MAA4UywD56soA8tPKANTSygD/18kA6NLHAAAjxwDj28QA/s7CAP/1wQDw3r8A/9e8APrSrwDCtqoAzamjANmPiQDQj4YA35mBAOmefgDHj3wA1qR6AO+sbwDpmm8A2IVlAKmEYgCvaFoAvHNXAEq2VgA5s1UAPbhQAFWtTwBStU0ARbNNAEGxTQA7tEwAObZIAEq5RwDKdEYAULhDANtuQgBEtTwA1ls3ALhgMQCxNzEA2FsvAEC3LQB0MCkAiyYoANZTJwDLWyYAtjMlALE6JACZNSMAuW4iANlgIgDoWCEAylwgAMUuIAD3Vh8A52gdALRCHQCxWhwAsEkcALU4HACMOBwA0V4bAMYyGgCPJRoA218ZAJM7FwC/PxYA0msVAM9jFQD2XBUAqioVAIAfFQDhYRQAujMTAMUxEwCgLBMAnxIPAMsqDgCkFgsA6GMHALE2BAC9JQAAliIAAFYTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8AsbGxsbGxsbGxsbGxsbGxd7IrMg8PDw8PDw8PUBQeJXjQYE9PcKPM2NfP2sWhcg+BzTE7dLjbmG03YWaV4JYye8MPbsLZlEouKRRCg9SXMoW/U53enGRAFzCRtNO7mTiAyliw30gRTg9VbJCKfYs0j9VmuscfLTFbIy8SOhA0Inq5Y77GNBMYIxQUJzM2Vxx2wEmfyCYWMRldXCg5MU0aicRUms58SUVeRkwjPBRSNIfBMkSgvWkyPxVHFIaMSx1/0S9nkq7WdWo1a43Jt2UqgtJERGJ5m6K8y92znpNWIYS1UQ89Mmg5cXNaX0EkGyyI3KSsp6mvpaqosaatq7axsQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';
})();