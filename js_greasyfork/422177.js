// ==UserScript==
// @name Pinboard - Specific Tag Emboldener
// @description Makes tags which match specific criteria stand out better in Pinboard.
// @include http://pinboard.in/*
// @include http://www.pinboard.in/*
// @include https://pinboard.in/*
// @include https://www.pinboard.in/*
// @grant GM_addStyle
// @author original script by murklins, updated by mkp
// @version 0.0.1.20210223015129
// @namespace https://greasyfork.org/users/396532
// @downloadURL https://update.greasyfork.org/scripts/422177/Pinboard%20-%20Specific%20Tag%20Emboldener.user.js
// @updateURL https://update.greasyfork.org/scripts/422177/Pinboard%20-%20Specific%20Tag%20Emboldener.meta.js
// ==/UserScript==

var main_node = document.getElementById("pinboard");
if (main_node) {
  // get all the bookmarks
  var tagAnchors = document.evaluate("//div[contains(@class, 'bookmark')]/div[@class = 'display']/a[@class = 'tag']", 
                                  main_node, 
                                  null,
                                  XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                                  null);

  for (var i = 0; i < tagAnchors.snapshotLength; i++) {     
// assign tags to specific tag classes based on the tag's composition 
// note: script as written parses the tags looking for the keyword(s) anywhere within the text of the tag
    var tagA = tagAnchors.snapshotItem(i);   
    if (tagA.innerHTML.indexOf("relationship") != -1) {
      tagA.className = tagA.className + " gm_relationship_tag";
    }else if (tagA.innerHTML.indexOf("fandom") != -1) {
      tagA.className = tagA.className + " gm_fandom_tag";
    }else if (tagA.innerHTML.indexOf("warning") != -1) {
      tagA.className = tagA.className + " gm_warning_tag";
    }
  }
}
// format tags based on their assigned tag class
// you can change font color, font style, and/or even highlight the tag with a specific color
GM_addStyle(
  "a.gm_relationship_tag { font-weight: bold}" +
  "a.gm_fandom_tag { color: #1d085f; font-weight: bold; }" +
  "a.gm_warning_tag { color: #a3031e;}"
);


/* /////////////////////////////////////

// the following is the same code for parsing tags in a more template-like format

    var tagA = tagAnchors.snapshotItem(i);   
    if (tagA.innerHTML.indexOf("KEYWORD") != -1) {
      tagA.className = tagA.className + " gm_KEYWORD_tag";
    }
  }
}



// to create more than one tag class / use more than one keyword, use 'else if'

    var tagA = tagAnchors.snapshotItem(i);   
    if (tagA.innerHTML.indexOf("KEYWORD1") != -1) {
      tagA.className = tagA.className + " gm_KEYWORD1_tag";
	}else if (tagA.innerHTML.indexOf("KEYWORD2") != -1) {
      tagA.className = tagA.className + " gm_KEYWORD2_tag";  
    }
  }
}


// the following is the same code for formatting tags in a more template-like format

//// bold text for a given tag class

GM_addStyle(
  "a.gm_KEYWORD_tag { font-weight: bold;}" 


//// change text color for a given tag class  

GM_addStyle(
  "a.gm_KEYWORD_tag { color:#800;}"   
  
//// highlight text of a given tag class with a specific color
/////// you can use hex codes or css-supported color names

GM_addStyle(
  "a.gm_KEYWORD_tag { background-color: blue;}"   
  
*/  
  
  
  
  
  
  