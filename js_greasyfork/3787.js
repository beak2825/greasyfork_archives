// ==UserScript==
// @name           thread win
// @namespace      bperkins
// @description    sort comments by favorites
// @include        https://www.metafilter.com/*
// @include https://ask.metafilter.com/*
// @include https://metatalk.metafilter.com/*
// @include        http://www.metafilter.com/*
// @include http://ask.metafilter.com/*
// @include http://metatalk.metafilter.com/*
// @version        1.6
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/3787/thread%20win.user.js
// @updateURL https://update.greasyfork.org/scripts/3787/thread%20win.meta.js
// ==/UserScript==


var savedstuff;

var winNode;
var unwinNode;
var copy;



function sortFav(a,b) {



    return (-(getFav(a)-getFav(b)));

}
function getFav(a) 
{
    var toplevel = a.getElementsByTagName("SPAN");
    var notloggedin = 0;

    if (toplevel.length ==0 ) {
	return 1;
    }   

    var bylinespan = toplevel[0].getElementsByTagName("SPAN");

    if (bylinespan.length ==0) {
        notloggedin =1
	bylinespan = a.getElementsByTagName("SPAN");
    }
    if (bylinespan.length ==0 ) {
	return 1;
    }
    
	
    var favspan;

    if (bylinespan[0].getAttribute("class") == "staffp" 	   ) { 
	 favspan = bylinespan[2].getElementsByTagName("SPAN");
    } else {
    favspan = bylinespan[0].getElementsByTagName("SPAN");
    }

     if   (favspan.length ==0) {
	 //No extra span layer in MeTalk
	 favspan=bylinespan
     }

     var fava = favspan[0].getElementsByTagName("A");

     



    var fav =0;
    re = new RegExp("\\d+")


	if (fava.length > 0 &&fava[0] != undefined ) { 
	    
	    var m;
	    if (notloggedin) {
		if (fava.length >2) {
		    m=re.exec(fava[2].innerHTML);
		} else {
		    return 1
		}
		
	    } else {
		m=re.exec(fava[0].innerHTML);
	    }
	    fav=m[0];

	}


    return (1*fav)+1;

}




function  unwin () {

    copy.replaceChild(winNode,unwinNode);

 
    var parent=getCommentParent ();
	
    var newstuff = parent.childNodes;
		
    while ( newstuff.length >0 ) {
	    
	parent.removeChild(newstuff[0]);
    }
	

    for (var j = 0; j < savedstuff.length; j++) {
	parent.appendChild(savedstuff[j]);
    }   
	
    
}

function getCommentParent () {
	
    var snaps = ["//div[@id='posts']","//div[@id='page']","//body[@id='body']"];

    for ( var snap in snaps ) {

    page = document.evaluate(
			     snaps[snap],
			     document,
			     null,
			     XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
			     null);


    for (var i = 0; i < page.snapshotLength; i++) {
	stuff = page.snapshotItem(i).childNodes;
	for (var j = 0; j < stuff.length; j++) {

	    if (stuff[j].nodeName.toUpperCase()=="DIV" &&
		(stuff[j].getAttribute("class") == "comments" ||
		 stuff[j].getAttribute("class") == "comments bestleft"||
		 stuff[j].getAttribute("class") == "comments best")) {
		return  page.snapshotItem(i);
	    }
	}
    }	
    }

    alert ("threadwin: failed to get comment parent");

}




function  threadwin () {

    copy.replaceChild(unwinNode,winNode);


    
    var parent= getCommentParent();
	    
			
    var stuff = parent.childNodes;
    var commentidxs = new Array;
    var comments = new Array;
    var objects = new Array ;
    savedstuff=new Array;

    var k=0;     
    var favs =""

	for (var j = 0; j < stuff.length; j++) {
			
				 
	    if (stuff[j].nodeName.toUpperCase()=="DIV" &&
		(stuff[j].getAttribute("class") == "comments" ||
		 stuff[j].getAttribute("class") == "comments bestleft"||
		 stuff[j].getAttribute("class") == "comments best")) {
		
     
		commentidxs.push(j);
		comments.push(stuff[j]);
	    } 
   
	    objects.push(stuff[j]);
	    savedstuff.push(stuff[j]);

	}

    comments.sort(sortFav);

	for (var j = 0; j < comments.length; j++) {

	    objects[commentidxs[j]]=comments[j];

	}


    while ( stuff.length >0 ) {

	parent.removeChild(stuff[0]);
    }


    for (var j = 0; j < objects.length; j++) {
	parent.appendChild(objects[j]);
    }   

    
}


res = document.evaluate(
			"//div[@class='copy']",
			document,
			null,
			XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
			null);

copy=res.snapshotItem(0)

if (copy.parentNode.id == "page"
    //newcode
    ||copy.parentNode.id == "posts" ) {


	winNode = document.createElement('a');
	winNode.innerHTML = "<small>[threadwin]</small> ";
	winNode.href ="#";
	winNode.addEventListener("click", threadwin, true);
	
	copy.appendChild( winNode );
	
	unwinNode = document.createElement('a');
	unwinNode.innerHTML = "<small>[unwin]</small>";
	unwinNode.href ="#";
	unwinNode.addEventListener("click", unwin, true);
	

	
    }

