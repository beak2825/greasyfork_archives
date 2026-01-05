// ==UserScript==
// @name        mangaupdates list of covers
// @description	Replace text lists and search results as covers
// @namespace   periselene@yandex.com
// @include     https://www.mangaupdates.com/mylist.html*
// @include     http://www.mangaupdates.com/mylist.html*
// @include     https://www.mangaupdates.com/series.html*
// @include     http://www.mangaupdates.com/series.html*
// @include     https://www.mangaupdates.com/groups.html*
// @include     http://www.mangaupdates.com/groups.html*
// @include	http://www.mangaupdates.com/authors.html?id=*
// @include	https://www.mangaupdates.com/authors.html?id=*
// @exclude	http://www.mangaupdates.com/series.html?id=*
// @exclude	https://www.mangaupdates.com/series.html?id=*
// @version     1.16
// @resource 	loading https://d.maxfile.ro/wqcsgpfwbg.gif
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_log
// @grant       GM_addStyle
// @grant       GM_getResourceURL 
// @grant       GM_xmlhttpRequest 
// @downloadURL https://update.greasyfork.org/scripts/10419/mangaupdates%20list%20of%20covers.user.js
// @updateURL https://update.greasyfork.org/scripts/10419/mangaupdates%20list%20of%20covers.meta.js
// ==/UserScript==
var button = document.createElement("a");
var show = false;
var first = true;
var protocl = (("https:" == document.location.protocol) ?
    "https://" : "http://");
button.innerHTML = "switch view";
button.id = "coverButton";
button.className = "button";
document.body.appendChild(button);
button.addEventListener("click", replaceWithCovers);
GM_addStyle("	.coverTop{\
			position: 	relative;\
			float: 		left;\
		}\
		.coverListTop{\
	position: absolute;\
			width: 		100%;\
	top: 50px;\
			padding: 	1em;\
			box-sizing: border-box;\
		}\
		.coverList{\
	background-color: lightgray;\
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);\
	overflow: 	hidden;\
		}\
		.paginator{\
			float: 		left;\
		}\
		.cover{\
			border-radius: 	5px;\
			border: 	2px outset;\
			position: 	relative;\
			height:		350px;\
			min-width:	200px;\
			text-align: 	center;\
			line-height: 	350px;\
			background: 	#52667C;\
			\
			display:	table-cell;\
			vertical-align:	middle;\
		}\
		.hideThis{\
			display:	none;\
			}\
		.hideRow{\
			display:	none;\
			}\
		.info{\
			width: 		100%;\
			text-align: 	center;\
			background: 	rgba(240, 243, 247);\
			background: 	rgba(240, 243, 247, 0.8);\
			position: 	absolute;\
			bottom: 	25px;\
			z-index: 	1;\
			padding: 	0.5em 0;\
			text-shadow: 	2px 2px 5px #F0F3F7;\
			display:	none;\
			color:		#52667C;\
			font-weight:	bold;\
			line-height: 	1em;\
		}\
		.cover:hover .info{\
			display:	block;\
		}\
		#coverButton{\
			position: 	fixed;\
			top: 		0px;\
			right: 		0px;\
			z-index: 	5;\
		}\
		.series_rows_table{\
			float: 		left;\
			}\
		.lazy{\
			max-height: 350px;\
		}\
		");

///////////////////////////////////////////////////////////
function replaceWithCovers()
{
	console.log("first" + first);
if(first){
	var isSeries =  document.URL.indexOf('series.html') != -1 ;
	var isAuthor =  document.URL.indexOf('authors.html') != -1 ;
	var isGroup =  document.URL.indexOf('groups.html') != -1 ;
	
//  	console.log("start isSeries "  + isSeries);
	var coverList = document.createElement("div");
	coverList.className = "coverList";
	var coverListTop = document.createElement("div");
	coverListTop.className = "coverListTop";
	coverListTop.appendChild(coverList);
    document.body.appendChild(coverListTop);
	if(isSeries)
	{
		rows = document.getElementsByClassName('col1');
		for (i = 0; i < rows.length; i++) 
		{
			populateCovers(rows[i], coverList, isSeries, isAuthor);
			// rows[i].parentNode.className = "hideRow";
		}
		// var list_table = document.getElementsByClassName("series_rows_table")[0];
		// list_table.parentNode.insertBefore(coverList, list_table);
		// GM_addStyle(".coverTop{margin: 5px;}");
			
	}
	else if(isAuthor)
	{
		var list_table = document.querySelectorAll('#main_content > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > table:nth-child(1)')[0];
		
		rows = list_table.getElementsByTagName('a');
		for (i = 2; i < rows.length; i++) 
		{
			populateCovers(rows[i], coverList, isSeries, isAuthor);
		}
		
		// list_table.className = "hideThis";
		// list_table.parentNode.insertBefore(coverList, list_table);
		// GM_addStyle(".coverTop{margin: 5px;}");
	}
	else if(isGroup)
	{
		var list_table = document.querySelectorAll('#main_content > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > table:nth-child(1)')[0];
		
		rows = list_table.getElementsByTagName('a');
		for (i = 0; i < rows.length; i++) 
		{
			populateCovers(rows[i], coverList, isSeries, true);
		}
		
		// list_table.className = "hideThis";
		// list_table.parentNode.insertBefore(coverList, list_table);
		// GM_addStyle(".coverTop{margin: 5px;}");
	}
	else
	{
		rows = document.getElementsByClassName('lrow');
		for (i = 0; i < rows.length; i++) 
		{
			populateCovers(rows[i], coverList, isSeries, isAuthor);
		}
		// var list_table = document.getElementById("list_table");
		// var paginator = list_table.nextSibling.nextSibling;
		// list_table.parentNode.insertBefore(coverList, list_table);
		// console.log(paginator);
		// paginator.className = "paginator";
	}

// 	document.body.removeChild(this);
// 	this.className = "hideThis";
	ll();
	// GM_addStyle("\
	// 	#login {\
	// 		width: 919px;\
	// 		text-align: center;\
	// 		vertical-align: middle;\
	// 		margin-left: auto;\
	// 		margin-right: auto;\
	// 	}\
	// 	#centered {\
	// 		width: 100%;\
	// 	}\
	// 	.center_content {\
	// 		width: 100%;\
	// 	}\
	// 	");
// 	window.trigger( "scroll" );
	first = false;
}
	if(show){
		// setClassdisplay("hideThis", 'block');
		// setClassdisplay("hideRow", 'table-row');
		setClassdisplay("coverListTop", 'none');
	}else{
		// setClassdisplay("hideThis", 'none');
		// setClassdisplay("hideRow", 'none');
		setClassdisplay("coverListTop", 'block');
		
		
	}
	show = !show;
	
}
function setClassdisplay(klass, display)
{
	rows = document.getElementsByClassName(klass);
		for (i = 0; i < rows.length; i++) 
		{
			rows[i].style.display = display;
		}
}
function populateCovers(element, coverList, isSeries, isAuthor)
{
	var id;
	if(isSeries)
	{
		id = element.lastChild.href.split("=")[1];
	}
	else if(isAuthor)
	{
		id = element.href.split("=")[1];
// 		console.log("href: " + element.href);
// 		console.log("text: " + element.textContent);
		if(element.href != '' && element.textContent != '' )
			console.log("href: " + element.href);
		else
			return;
	}
	else{
		id = element.id.slice(1);
	}
 	console.log("id: " + id);
	var coverTop = document.createElement("div");
	coverTop.className = "coverTop";
	var cover = document.createElement("div");
	var img = document.createElement("img");
	var link = document.createElement("a");
	var span = document.createElement("span");
	link.appendChild(img);
	cover.appendChild(link);
	coverTop.appendChild(cover);
	coverList.appendChild(coverTop);
	link.appendChild(span);
	link.href =  protocl + "www.mangaupdates.com/series.html?id=" + id;
	var text;
	if(isSeries)
	{
		text = element.lastChild.textContent;
		var clones = element.getElementsByTagName("img");
		if(clones.length >0){
			var clone = clones[0].cloneNode();
			span.appendChild(clone);
// 			console.log(clone);
			
		}
	}
	else if(isAuthor)
	{
		text = element.textContent;
	}
	else{
		var info = element.getElementsByClassName('text');
		text = info[0].firstChild.firstChild.textContent;
	}
	img.alt = text;
// 	console.log("text: " + text);
	cover.className = "cover";
	cover.id = "c" + id;
	img.id =  id;//"i" +
	img.className = "lazy";
	img.src = GM_getResourceURL("loading");
	var textnode = document.createTextNode(text);   
	span.appendChild(textnode);
	span.className = "info";
}

function getImgSrc(id, img)
{
	var url = protocl + "www.mangaupdates.com/series.html?id=" + id;
	if (GM_getValue(url)) {
		var retrievedLink = GM_getValue(url);
// 		console.log(id + " from  cache."); 
		img.src = retrievedLink;
	}
	else {
			GM_xmlhttpRequest({
				method: "GET",
				url: url,
				context: {img: img}, 
				onload: getHTML
			});
	}
}
function getHTML(response) 
{
	
	var img = response.context.img;
	var responseXML = null;
	    // Inject responseXML into existing Object (only appropriate for XML content).
	    if (!response.responseXML) {
	      responseXML = new DOMParser()
	        .parseFromString(response.responseText, "text/html");
	    }
	var image = responseXML.querySelectorAll(	'div.sContainer:nth-child(4) > div:nth-child(1) > div:nth-child(2) > center:nth-child(1) > img:nth-child(1)');
// 									'div.sContainer:nth-child(4) > div:nth-child(1) > div:nth-child(2) > center:nth-child(1) > img:nth-child(1)'
	if(image[0]){

		var imagelink = image[0].src;
// 			var imagelink = $('<div>').html(data)[0].getElementsByClassName('sContainer')[1].getElementsByTagName('img') [0].src;
 	
		GM_setValue(response.finalUrl, imagelink);
 	
		img.src = imagelink;
		console.log( ' from ajax'); // for testing purposes
	}
	else{
		console.log('no image from ajax'); // for testing purposes
	}
}
/* ============================================================================
 * 
 * ============================================================================
 * 
 * ============================================================================
 * 
 * ============================================================================
 */

/* lazyload.js (c) Lorenzo Giuliani
 * MIT License (http://www.opensource.org/licenses/mit-license.html)
 *
 * expects a list of:  
 * `<img src="blank.gif" data-src="my_image.png" width="600" height="400" class="lazy">`
 */

function ll() {
	  var $q = function(q, res){
	        if (document.querySelectorAll) {
	          res = document.querySelectorAll(q);
	        } else {
	          var d=document
	            , a=d.styleSheets[0] || d.createStyleSheet();
	          a.addRule(q,'f:b');
	          for(var l=d.all,b=0,c=[],f=l.length;b<f;b++)
	            l[b].currentStyle.f && c.push(l[b]);

	          a.removeRule(0);
	          res = c;
	        }
	        return res;
	      }
	    , addEventListener = function(evt, fn){
	        window.addEventListener
	          ? this.addEventListener(evt, fn, false)
	          : (window.attachEvent)
	            ? this.attachEvent('on' + evt, fn)
	            : this['on' + evt] = fn;
	      }
	    , _has = function(obj, key) {
	        return Object.prototype.hasOwnProperty.call(obj, key);
	      }
	    ;

// 	  function loadImage (el, fn) {//--
	function loadImage (el, i, images) {//++
	    var img = new Image();
//	      , src = el.getAttribute('data-src');//--
	    var id = el.id;//++
	    img.onload = function() {
	      if (!! el.parent){
	        el.parent.replaceChild(img, el);
	}
	      else{
// 	        el.src = src;//--
	        el.src = this.src;//++
	      }

// 	      fn? fn() : null;//--
	      this.onload = null;
	    };
	    getImgSrc(id, img);//++
// 	    img.src = src; //--
	  }

	  function elementInViewport(el) {
		var rect = el.getBoundingClientRect();
		var test = (
			rect.top    >= 0
			&& rect.left   >= 0
			&& rect.top <= (window.innerHeight || document.documentElement.clientHeight)
			);
	    return test;
	  }

	    var images = new Array()
	      , query = $q('img.lazy')
	      , processScroll = function(){
// 		console.log("lx" + images.length);
	          for (var i = 0; i < images.length; ) {
	            if (elementInViewport(images[i])) {
			loadImage(images[i], i, images);//-+
// 			images.splice(i, 1);//+-
			images.splice(i, 1);
	              }
	              else{ i++; }
	            }
	          };
	      ;
	    // Array.prototype.slice.call is not callable under our lovely IE8
	    for (var i = 0; i < query.length; i++) {
	      images.push(query[i]);
	    };
	    processScroll();
		addEventListener('scroll',processScroll);
		addEventListener("resize", processScroll);
		
	  }