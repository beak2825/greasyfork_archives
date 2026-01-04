// ==UserScript==
// @name         clearml fixes
// @namespace    leki
// @version      0.1
// @description  Clear ml fixes to make it more usable
// @author       leki
// @match        https://app-clearml.mle.microblink.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447870/clearml%20fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/447870/clearml%20fixes.meta.js
// ==/UserScript==
//https://app-clearml.mle.microblink.com/*
const sep = "+$+";

function addTag(tags, tag) {
   const parts = tags.split(sep);
   var exists = false;
    for (var i = 0; i < parts.length; i++) {
      if (parts[i] == tag) {
          //alert(tags + "---------" + tag);
          exists = true;
          break;
      }
   }
   if (exists) {
       //alert("exists");
       return "";
   }
   //alert(tags + sep + tag);
   return tags + sep + tag;
}


var fn = function() {
    //alert("aaa");
    // Your code here...
    var collection = document.getElementsByClassName("tag-item");
// class name is tag-item
for (var i = 0; i < collection.length; i++) {
   var item = collection.item(i);
   //item.style.backgroundColor = "red";
   item.onclick = function(e) {
    const queryString = window.location.search;
    //alert(queryString);
    const urlParams = new URLSearchParams(queryString);
    const filter = urlParams.get('filter');
    const parts = filter.split(",");
    var target = 0;
    for (var i = 0; i < parts.length; i++) {
        //alert(parts[i]);
        if (parts[i].startsWith("tags:")) {
            target = i;
            break;
        }
    }
    const tagVal = e.target.textContent.trim();
    //alert(tagVal);
    if (filter.length == 0) {
        //alert("set new tag");
        urlParams.set('filter', "tags:" + tagVal);
        //alert(urlParams.toString());
        window.location.search = urlParams.toString();

    } else {
        //alert("add new tag " + target);
        const tags = parts[target];
        const newTags = addTag(tags.substring(5), tagVal);
        if (newTags != "") {
            urlParams.set('filter', "tags:" + newTags);
            window.location.search = urlParams.toString();
        }
    }
   }
}
}

document.body.addEventListener('click', fn, true);

//window.addEventListener('popstate', setTimeout(fn, 1000) )
