// ==UserScript==
// @name         fimfiction Add Comment Links
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Make Comment counts in items into clickable links, or add a link if no count exists
// @author       yrfoxtaur
// @match        https://www.fimfiction.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415854/fimfiction%20Add%20Comment%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/415854/fimfiction%20Add%20Comment%20Links.meta.js
// ==/UserScript==

(function (){
	//is this is a user's blog page?
	var elemsToEdit = document.querySelectorAll("div.content_box.blog-post-content-box");
		if (elemsToEdit.length > 1){
			//Yup, this is a user's blog page.
			elemsToEdit.forEach(el=>{
				//for each blog post, get the href that points to the blog post's page,
				//append the appropriate fragment, and insert the link just after the first classless b element
				var selectedhref = el.querySelector("h1 span.resize_text a").getAttribute("href");
				selectedhref += "#comment_list";
				var cmlink = document.createElement('a');
				var cmlinktarget = el.querySelector("div.information_box > b:not(.dot)");
				var cmlinkinnertext = document.createTextNode("Comments");
                var cmlinkpad = document.createTextNode(" ");
				cmlink.setAttribute('href', selectedhref);
				cmlink.appendChild(cmlinkinnertext);
				cmlinktarget.parentElement.insertBefore(cmlinktarget.cloneNode(true), cmlinktarget);
                cmlinktarget.parentElement.insertBefore(cmlinkpad, cmlinktarget);
                cmlinktarget.parentElement.insertBefore(cmlink, cmlinktarget);
                cmlinktarget.parentElement.insertBefore(cmlinkpad.cloneNode(), cmlinktarget);
			});
        } else {
            //maybe it's a stor[y/ies] page?
            elemsToEdit = document.querySelectorAll("article.story_container");
            if (elemsToEdit.length >= 1){
                elemsToEdit.forEach(el=>{
				  //for each story post, get the href that points to the blog post's page,
				  //append the appropriate fragment, and insert the link just after the first classless b element
				  var selectedhref = el.querySelector("a.story_name").getAttribute("href");
				  selectedhref += "#comment_list";
				  var cmlink = document.createElement('a');
				  var cmlinkcontent = el.querySelector("i.fa-comments").parentElement;
                  var cmlinktarget = cmlinkcontent.parentElement;
				  cmlink.setAttribute('href', selectedhref);
				  cmlink.appendChild(cmlinkcontent);
                  cmlinktarget.insertBefore(cmlink, cmlinktarget.querySelector("div.divider + div.divider"));
                });
            } else {
                //last chance! a chapter page.
                elemsToEdit = document.querySelectorAll("div.story-top-toolbar div.rating_container");
                if (elemsToEdit.length == 1){
                    elemsToEdit.forEach(el=>{
				       //for each story post, get the href that points to the blog post's page,
				       //append the appropriate fragment, and insert the link just after the first classless b element
				       var selectedhref = "#comment_list";
				       var cmlink = document.createElement('a');
				       var cmlinkcontent = el.querySelector("i.fa-comments").parentElement;
                       var cmlinktarget = cmlinkcontent.parentElement;
				       cmlink.setAttribute('href', selectedhref);
				       cmlink.appendChild(cmlinkcontent);
                       cmlinktarget.insertBefore(cmlink, cmlinktarget.querySelector("div.divider + div.divider"));
                    });
                } else {
                    //None of the above.
			        return;
                }
            }
		}
})();

function AddCMLinks2Feed(e2e) {
    'use strict';
	if (e2e.length < 1){
		//oops, called without e2e, or e2e contains no node[lists/s]
		return(0);
	} else {
		//this is the feed. do the same as in anonymous function, but with different elements
		e2e.forEach(el=>{
            var els;
            if (NodeList.prototype.isPrototypeOf(el)){
               els = el[0];
            } else {
               els = el;
            }
			var selectedhref = els.querySelector("a.title").getAttribute("href");
			selectedhref += "#comment_list";
			var cmlink = document.createElement('a');
			var cmlinktarget = els.querySelector("div.comment_count");
            if (cmlinktarget === null){
               return;
            }
			cmlink.setAttribute('href', selectedhref);
            if (els.getAttribute("class").includes("feed_new_story")){
               cmlink.appendChild(cmlinktarget.querySelector("b").nextElementSibling.nextSibling);
			   cmlinktarget.insertBefore(cmlink, cmlinktarget.querySelector("b").nextElementSibling.nextSibling);
            } else if (els.getAttribute("class").includes("feed_blog_post")) {
			   cmlink.appendChild(cmlinktarget.firstChild);
			   cmlinktarget.insertBefore(cmlink, cmlinktarget.firstChild);
            }
		});
	}
};

AddCMLinks2Feed(document.querySelectorAll("li.feed_item"));

let observer = new MutationObserver(mutations =>{
  var mutts = [];
  for(let mutation of mutations){
  	mutts.push(mutation.addedNodes);
	}
  AddCMLinks2Feed(mutts);
});
try{
  observer.observe(document.querySelector("ul.feed"),{childList: true, subtree:false});
}
catch(err){
    return;
}