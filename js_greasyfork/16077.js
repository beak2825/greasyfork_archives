// ==UserScript==
// @version       1.0
// @name           Portkey story export script
// @namespace      portkey
// @description    Display the whole story on one screen
// @include        *fanfiction.portkey.org/story/*
// @downloadURL https://update.greasyfork.org/scripts/16077/Portkey%20story%20export%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/16077/Portkey%20story%20export%20script.meta.js
// ==/UserScript==

function find(expr)
{
	var posts = document.evaluate(expr, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var postsArray = new Array();
	for (var i = 0; i < posts.snapshotLength; ++i) {
	     postsArray.push(posts.snapshotItem(i));
	}
	return postsArray;
}

function addButtons(){
// Adding buttons
	res = find("//div[@align=\"center\"]");
	insertNode = document.createElement("p");
	res[1].appendChild(insertNode);
	//creating links
	var addHeadersButton=document.createElement('a');
	addHeadersButton.href='javascript:';
	addHeadersButton.innerHTML='Headers';
	addHeadersButton.setAttribute('title','Add header to each chapter');
	var addIndexButton=document.createElement('a');
	addIndexButton.href='javascript:';
	addIndexButton.innerHTML='Index';
	addIndexButton.setAttribute('title','Create table of contents');
	var expAllButton=document.createElement('a');
	expAllButton.id='exportAllButton';
	expAllButton.href='javascript:';
	expAllButton.setAttribute('title','Show the whole story on one page');
	expAllButton.innerHTML='Story';
	var expButton=document.createElement('a');
	expButton.setAttribute('title','Show only text');
	expButton.href='javascript:';
	expButton.innerHTML='Text';
	var e = document.createElement('span');
	e.setAttribute('style','color:#cc0000');
	e.setAttribute('title','Export');
	e.innerHTML = "fE: ";
	var a = document.createElement('span');
	a.setAttribute('title','Add');
	a.setAttribute('style','color:#cc0000');
	a.innerHTML = "fA: ";
	
	// Adding listeners - that's the only way to do something after main code finsihed working;
	expAllButton.addEventListener('click',exportAll,false);
	expButton.addEventListener('click',exportCh,false);
	addHeadersButton.addEventListener('click',addHeaders,false);

	insertNode.appendChild(e);
	insertNode.appendChild(expAllButton);
	insertNode.appendChild(document.createTextNode(' '));
	insertNode.appendChild(expButton);
	insertNode.appendChild(document.createTextNode(' '));
	insertNode.appendChild(a);
	insertNode.appendChild(addHeadersButton);
	insertNode.appendChild(document.createTextNode(' '));
	insertNode.appendChild(addIndexButton);
	insertNode.appendChild(document.createTextNode(' '));

}

//Adding buttons to page;
addButtons();

//Adding table of contents
function addIndex(){
	var storytext = document.getElementById('storytextp').firstChild; //Point of insert
	var chapters = document.getElementsByName('ffnee_chapter');
	//Creating base structure
	var index = document.createElement('div');
	index.innerHTML = '<h2>Table of contents</h2>';
	index.setAttribute('id','ffnee_index');
	var toC = document.createElement('ol');
	index.appendChild(toC);
	//Processing chapters
	for (var i=0;i<chapters.length;i++){
		var item = chapters.item(i); //chapter we are currently processing
		var id = item.getAttribute('id');
		var entry = document.createElement('li'); //Entry corresponding to the chapter in ToC
		entry.innerHTML = '<a href="#'+id+'">'+item.getAttribute('title')+'</a>';
		toC.appendChild(entry);
	}	
	storytext.insertBefore(index,storytext.firstChild);
}
//adding headers, as entered by author
function addHeaders(){
	var chapters = document.getElementsByName('ffnee_chapter');
	for (var i=0;i<chapters.length;i++){
	var item = chapters.item(i); //chapter to which we are adding a header
	var header = document.createElement('p');
	header.innerHTML = '<h2>Chapter '+(i+1)+': '+item.getAttribute('title')+'</h2>';
	item.insertBefore(header,item.firstChild);
	}
}

function exportCh(){
document.body.innerHTML='<div style=\'padding-left:2em;padding-right:2em;padding-top:1em;\'>'+document.getElementById('storytextp').innerHTML+'</div>';
//Sadly, it is not possible to automatically copy text to clipboard in firefox without changing browser settings;
}
function exportAll(){
// Main actions   
	var expDiv = document.getElementById('exportAllButton');
	// Progress indicator
	var expText = expDiv.childNodes[0];
	var chapters = new Array();
	var chapterNumIndex=document.title.search(/Chapter:/)+8;
	//Getting number of chapters
	var hr=location.href.split(/\//);
	sturl="";
	getURL();
	var storyLength=getLength(); 
	if (storyLength == 1){
		expText.nodeValue = 'Oneshot';
		return;
	}
	var totalStoryLength = storyLength;//reference
	//launching retrieving of all chapters simultaneously
	for (var i=1;i<=storyLength;i++){
	loadChapter(i);
	}
//Functions

	function getURL(){
	for (var i=0;i<hr.length;i++){
		sturl+=hr[i];
		sturl+="/";
		if (hr[i]=="story"){
		   sturl+=hr[i+1];
		   return
		}
	}
	}
    // Converting chapters' array into a whole;	
	function parseStory(){
		var numCh= chapters.length;
		//document.body.innerHTML=chapters[0];
		var appendNode=find("//td[@class=\"story\"]")[0];
		appendNode.parentNode.setAttribute("id","storytextp");
		appendNode.innerHTML= '';
    	for (var i=0;i<numCh;i++){
			//findHeader(chapters[i]);  //smart header search
			var st=chapters[i];
			st.setAttribute('name','ffnee_chapter');
			st.setAttribute('id','ffnee_ch'+i);
			if (i!=0){
				st.style.marginTop='10em';
			}
    		appendNode.appendChild(st);
    	}
    	expText.nodeValue='story(re)';
	}
	//  Getting number of chapters;
	function getLength(){
		var chNum=document.evaluate('//SELECT[@name=\"select5\"]',document,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		if (chNum.snapshotLength>0){
			var numChapters = chNum.snapshotItem(0).length;
		}else{
			numChapters = 1;
		}
		return (numChapters);
	}
	// This function loads chapters and extracts chapter's number and title 
	function loadChapter(num){
		var currentURL=sturl+"/"+num;
		var xhr = new window.XMLHttpRequest();
		xhr.open("GET",currentURL);
		xhr.overrideMimeType("text/html; charset=ISO-8859-1");
		xhr.onreadystatechange = function(){
			if (xhr.readyState == 4){
				parseChapter(xhr.responseText, currentURL);
				storyLength--;
				if (storyLength==0){
					parseStory();
				}
			}
		}
		xhr.send("")
	}
	function parseChapter(chapterHtml, chapterURL){
		//getting chapter number
		var iChaptr = chapterURL.split(/\//);
		var chapterNumber=iChaptr[iChaptr.length-1];
		var t=document.createElement('div');
		t.innerHTML=chapterHtml;
		//extracting text only
  		var ev='//td[@class=\"story\"]';
		var xpathResult = document.evaluate(ev,t,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
     	chapterContent=document.createElement('div');

		chapterContent.setAttribute('title',getChapterName(t));
		chapterContent.innerHTML = xpathResult.snapshotItem(0).innerHTML;
		chapterContent.removeChild(chapterContent.firstChild);
		chapterContent.removeChild(chapterContent.lastChild);
		chapterContent.removeChild(chapterContent.lastChild);
		chapters[chapterNumber-1]=chapterContent;
		expText.nodeValue = 'Export: Chapter '+String(totalStoryLength-storyLength+1)+' out of '+totalStoryLength;
		function getChapterName(obj){
			var select = obj.getElementsByTagName('select')[0].getElementsByTagName('option');
			 for (var i=0;i<select.length;i++){
				 if (select[i].getAttribute('selected')!=null){
					 return(select[i].innerHTML);
				 }
			}
		}
	}
}