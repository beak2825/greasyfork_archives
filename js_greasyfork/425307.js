// ==UserScript==
// @name        Dashboard Bookmarker
// @description Temporary replacement for XKit Bookmarker
// @namespace   jerryterry.tumblr.com
// @license MIT
// @include     *
// @version     1.40
// @grant    GM.getValue
// @grant    GM.setValue
// @run-at      document-idle
// @match      https://*/*
// @downloadURL https://update.greasyfork.org/scripts/425307/Dashboard%20Bookmarker.user.js
// @updateURL https://update.greasyfork.org/scripts/425307/Dashboard%20Bookmarker.meta.js
// ==/UserScript==

//version 1.40:
//Tumblr changed reccommended blogs, had to account for them in the "next page" function


//Node class ID variables:
if (document.URL.includes("tumblr.com/dashboard")){
  //The "Check out these blogs" node:
  var explorePaneNode = "FZkjV";
  //The node that contains the 4 footer buttons:
  var footerButtonsNode = "MCavR";
  //The parent that contains each post as a node:
  var postContainerNode = "j8ha0";
  //The first child node of any post-node (XKit renames the base node):
  var postChildNode = "ge_yK";
  //The node of the Radar post (contains an article node)
  var radarNode = "oNZY7";
}

//This section adds a "next page" button in bookmarked view
if (document.URL.includes("tumblr.com/dashboard?max_post_id=")){

    function showNext()
    {
        let attempts = 1
        let entries = document.getElementsByClassName(postChildNode);
      	let ent = null;
      	let entry = null;
        while (ent == null) {
          entry = entries[entries.length - attempts]
          if (entry.childElementCount == 1) {
          	ent = entry.parentElement.getAttribute("data-id");
          }
          attempts += 1;
        } 
        var linkStr = "https://www.tumblr.com/dashboard?max_post_id=" + ent;
        GM.setValue("markedPost",ent);
        window.location.href = linkStr;
    }

    var nextPage=document.createElement("input");
    nextPage.type="button";
    nextPage.value="Next Page";
    nextPage.onclick = showNext;
    //i STILL don't know how to center the button :(
    //nextPage.style.alignContent = "center";
    document.body.appendChild(nextPage);
}

//This section adds a "bookmark" button to all posts EXCEPT the post directly after loading new posts??
//(which is more than ever due to an increase in ads)
if (document.URL.includes("tumblr.com/dashboard")){
	
    var footerCount = 0;

        function bookMarker()
    {
        //don't laugh at this line, I've never worked with this stuff before :(
        let entries = this.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
        //I told you not to laugh!
        let ent = entries.getAttribute("data-id");
        GM.setValue("markedPost",ent);
        var linkStr = "https://www.tumblr.com/dashboard?max_post_id=" + ent;
        window.location.href = linkStr;
    }

    function bookGoto()
    {
        var markedPost = GM.getValue("markedPost");
        markedPost.then(function(result) {
            let ent = result;
            var linkStr = "https://www.tumblr.com/dashboard?max_post_id=" + ent;
            window.location.href = linkStr;
        });
    }

    function callback(mutationList, observer)
    {
        mutationList.forEach( (mutation) => {
            switch(mutation.type) {
                case 'childList':

                    var footers = document.getElementsByClassName(footerButtonsNode);
                    for(footerCount;footerCount<footers.length;footerCount++){
                        var bookmark = document.createElement("input");
                        bookmark.type="button";
                        bookmark.class = "bookmarker";
                        bookmark.value="Bookmark";
                        bookmark.onclick = bookMarker;

                        //This fixes the great new glitch where the radar post would get an extra button for every loading zone
                        if (footers[footerCount].parentElement.parentElement.parentElement.parentElement.getAttribute("class") != radarNode) {
                            footers[footerCount].insertBefore(bookmark, footers[footerCount].firstChild);
                        }
                    }
                    break;
                }
      });
    }

 
		const targetNode = document.getElementsByClassName(postContainerNode)[0];
    const observerOptions = {
        childList: true,
        //Had to set attributes to true now. Don't know why. Don't know anything.
        attributes: true,
        subtree: true
    }

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, observerOptions);

    //Add a "go to bookmark" button on the side
    setTimeout(() => {
        var entries = document.getElementsByClassName(explorePaneNode);
        for (var i = 0; i < 2; i++) {
            var br = document.createElement("br");
            entries[0].appendChild(br);
        }
        var bookLst = document.createElement("input");
        bookLst.type = "button";
        bookLst.value = "Go to Bookmark";
        bookLst.onclick = bookGoto;
        entries[0].appendChild(bookLst);
    }, 1000);
}

