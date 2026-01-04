// ==UserScript==
// @namespace ohadcn-omnifm-next
// @name     omni.fm playlist auto next
// @description    This script let you auto play next audio on <a href="https://omny.fm/">omni.fm</a> when listening from a playlist.
// @version  1
// @include  https://omny.fm/shows/*?in_playlist=*
// @grant    none
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/391880/omnifm%20playlist%20auto%20next.user.js
// @updateURL https://update.greasyfork.org/scripts/391880/omnifm%20playlist%20auto%20next.meta.js
// ==/UserScript==
window.addEventListener("message", function (event) {
	if((!event.data) || ('string' !== typeof event.data)) {
    //console.log(event);
		return;
	}
  try {
		var data = JSON.parse(event.data);
  } catch(e) {
    console.error(e);
    console.log(event);
    return;
  }
  if(data.context !== "player.js") {
    console.log(data);
    console.log(event);
    return;
  }
  if(data.event === "ready") {
    if(window.location.search.endsWith("ap=1"))
    	event.source.document.getElementsByClassName("player-teaser")[0].getElementsByTagName("button")[0].click();
    return;
  }

	if((data.event === "timeupdate")) {
    if((data.value.seconds == (data.value.duration)))
      window.location.href = document.getElementsByClassName("current")[0].previousElementSibling.getElementsByTagName("a")[0].href + "&ap=1";
			//document.getElementsByClassName("current")[0].previousElementSibling.getElementsByTagName("a")[0].click();
    return;
	}
  console.log(data);
  console.log(event);
});
