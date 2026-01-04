// ==UserScript==
// @name        Infowars : Date & Author
// @author		Scott Michaels
// @namespace   http://se7en-soft.com
// @description Adds the date and author of an article to its associated snippet.
// @include     https://www.infowars.com/*
// @version     1.0.1
// @grant		metadata
// @grant		GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/31677/Infowars%20%3A%20Date%20%20Author.user.js
// @updateURL https://update.greasyfork.org/scripts/31677/Infowars%20%3A%20Date%20%20Author.meta.js
// ==/UserScript==

(function(){
	const nav = navigator;
	const codeName = nav.appCodeName;
	const product = nav.product;
	const vendor = nav.vendor;
	
	const articles = [];
	
	const observeDOM = (function(){
		const MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
			eventListenerSupported = window.addEventListener;

		return function(obj, callback){
			if( MutationObserver ){
				// define a new observer
				const obs = new MutationObserver(function(mutations, observer){
					if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
						callback();
				});
				// have the observer observe foo for changes in children
				obs.observe( obj, { childList:true, subtree:true });
			}
			else if( eventListenerSupported ){
				obj.addEventListener('DOMNodeInserted', callback, false);
				obj.addEventListener('DOMNodeRemoved', callback, false);
			}
		};
	})();
	
	const fixer = {
		
		
		fetchRemotePage: (href, callback) => {
			try{
				GM_xmlhttpRequest({
					method: "GET",
					url: href,
					onload: function(r){
						const page = r.responseText;
						
						if(callback)
							callback.call(this, page);
					}
				});
			}catch(e){
				//alert(e);
			}
			
		},
		
		addExtraInfo: () => {
			
			if(articles.length){
				
				let i = 0;
				for(i; i < articles.length; i++){
					const x = articles[i];
					let anchor = x.querySelector("article > div.article-content > h3 > a");

					if(!anchor){
						anchor = x.querySelector("div.article-content > h3 > a");
					}
					
					//remove the article from the 'articles' array
					articles.splice(i, 1);
					
					if(anchor){
						
						const processed = anchor.getAttribute("data-processed");
						if(processed) continue;

						try{
							
							anchor.setAttribute("data-processed", "true");
							
							fixer.fetchRemotePage(anchor.href, (page) => {
								
								const elHtml = document.createElement("html");
								elHtml.innerHTML = page;
								
								let author = "";
								let authorLink = "";
								
								let authorM = elHtml.getElementsByClassName("author")[0];
								if(authorM.querySelector("a[rel='author']")){
									author = authorM.querySelector("a[rel='author']").textContent;
									authorLink = authorM.querySelector("a").href;
								} else {
									let text = authorM.textContent;
									if(text.indexOf("|") !== -1){
										author = text.split("|")[0].trim();
									} else if (authorM.querySelector("a")) {
										author = authorM.querySelector("a").textContent.trim();
									} else {
										author = authorM.textContent.trim();
										if(author.endsWith("-")){
											author = author.substring(0, author.length - 1).trim();
										}
									}
								}
								
								const articleDate = elHtml.getElementsByClassName("date")[0].textContent;
								
								const authorElm = document.createElement("span");
								if(!authorLink){
									authorElm.textContent = author + " | " + articleDate;
								} else {
									const link = document.createElement("a");
									link.href = authorLink;
									link.textContent = author;
									link.setAttribute("target", "_blank");
									link.setAttribute("rel", "author");
									link.style = "color:#194e8e !important;";
									authorElm.appendChild(link);
									
									const span = document.createElement("span");
									span.textContent = ` | ${articleDate}`;
									
									authorElm.appendChild(span);
								}
								
								authorElm.style = "font-size: 11pt;font-family:'proxima-nova', sans-serif;color:#898989;font-weight:500;";
								
								const entrySubtitle = x.querySelector("div.article-content>h4.entry-subtitle");
								if(entrySubtitle){
									//console.log(entrySubtitle);
									entrySubtitle.parentNode.insertBefore(authorElm, entrySubtitle);	
								} else {
									anchor.parentNode.insertBefore(authorElm, anchor.nextSibling);
									anchor.parentNode.insertBefore(document.createElement("br"), anchor.nextSibling);
								}
								
								
								
							});
						} catch(ex){
							alert(ex);
						}
					}
				}
			}
			
		},
		
		init: () => {
			let arties = document.getElementsByTagName("article");
			for(let x of arties){
				const anchor = x.querySelector("article > div.article-content > h3 > a");
				if(anchor && anchor.getAttribute("data-processed")) continue;
				
				articles.push(x);
			}
			
			arties = document.getElementsByClassName("related-article");
			for(let x of arties){
				const anchor = x.querySelector("div.article-content > h3 > a");
				if(anchor && anchor.getAttribute("data-processed")) continue;
				
				articles.push(x);
			}
		}
		
	}
	
	document.onreadystatechange = () => {
		if(document.readyState === "complete"){
			fixer.init();
			fixer.addExtraInfo();
			observeDOM(document.getElementsByClassName('articles-wrap')[0], function(){ 
				const arties = document.getElementsByTagName("article");  //document.getElementsByClassName("article");
				for(let x of arties){
					if(articles.indexOf(x) === -1)
						articles.push(x);
				}
				fixer.addExtraInfo();
			});
		}
	}
	
	
})();