// ==UserScript==
// @name         Formal Photos Enlarger
// @namespace    http://www.joeys.org/
// @version      0.01
// @description  Adds a toggle enlarging function to the formal photos page
// @author       D. Slee
// @match        http://www.silvercity.com.au/mp_client/pictures.asp?********************************************************************************************
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12586/Formal%20Photos%20Enlarger.user.js
// @updateURL https://update.greasyfork.org/scripts/12586/Formal%20Photos%20Enlarger.meta.js
// ==/UserScript==

/* Notes
f.jpg refers to the suffix for the fullsize image (f for full)
t.jpg refers to the suffix for the thumbnail image (t for thumbnail)
*/

//Image caching, not requried but makes the images load much faster
$("img[src*='photos']").each(function(){
    var link = $(this).attr("src").replace("t.jpg", "f.jpg");
    var hideImg = $("<img>", {
        src: link,
        style: "display:none"
    });
    $("body").append(hideImg);
});

//Click handling
$("img[src*='photos']").click(function(e){
    e.preventDefault();
    var link = $(this).attr("src");
    var newLink = (link.indexOf("t.jpg") > -1) ? link.replace("t.jpg", "f.jpg") : link.replace("f.jpg", "t.jpg");
    $(this).attr("src", newLink);
});