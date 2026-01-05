// ==UserScript==
// @name         4chKey
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  for efficient arrow-key based nagivation of 4chan board indexes. requires 4chanX. only tested on chrome.
// @author       anon
// @include      /boards\.4chan\.org\/(.|..|...)\/$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28058/4chKey.user.js
// @updateURL https://update.greasyfork.org/scripts/28058/4chKey.meta.js
// ==/UserScript==

var currthread=0;
var currthreadEl; //this is .threadContainer
var currthreadid;
var backcolour;
var darkercolour;
var threadcolour;
var selectedThread;
var selectedPost = null; // this is .post.reply -- not .postContainer
var selectedPostID;
var selectedpostEl; 
var highlightedLink = null;
var loaded = false;


containers = [];

function addthreadcontainer(container){
    container.thread = container.children[0];
    container.thread.op = container.thread.children[0];
    container.thread.op.postop = container.thread.op.querySelector('.post.op');
    container.thread.op.postop.highlightedlink = null;
    container.thread.op.OPcontainer = container.thread.op.postop.querySelector('.OPcontainer');
    container.thread.donereplyids = []
    container.thread.replies = []
    addpoststothread(container.thread);
    containers.push(container);
 }

function addpoststothread(thread){
   thread.posts = thread.querySelectorAll(".postContainer");
    
   if (thread.posts.length>1){
        for(i=1;i<thread.posts.length;i++){
            if (thread.donereplyids.indexOf(thread.posts[i].id) < 0){
                thread.replies.push(thread.posts[i]);
                thread.donereplyids.push(thread.posts[i].id);
                reply = thread.replies[i-1];
                reply.post = reply.querySelector(".post.reply");
                reply.post.highlightedlink = null;
                reply.post.message = reply.post.querySelector(".postMessage");
                reply.post.message.quotes = reply.post.message.querySelectorAll(".quotelink");
                quotes = reply.post.message.quotes;
                var n = 0;
                quotes.forEach(
                    function(item){
                         if (item.done !== true){
                            item.index = n;
                            //alert(n);
                            n = n+1;
                            linkcontainer = document.createElement('div');
                            item.parentElement.replaceChild(linkcontainer, item);
                            item.done = true;
                            item.highlighted = false;
                            item.expanded = false;
                            linkcontainer.appendChild(item);
                        }
                    });
            }
            
       }
   }
}

function getthreadbyid(id){
   threads = containers;
   for(i=0; i< threads.length;i++){
    if(threads[i].id === id){
        return threads[i];
    }
   }
}

function getpostbyid(id, thread){
    thread.posts.forEach(function(item){
        if (item.id === id){
            return item;
        }
    });
}

function getthreadindex(id){
    for(i=0; i<containers.length; i++){
        if (containers[i].id === id){
            return i;
        }
    }
}

function getcontainers(){
     return containers;
}

function getpostlinks(post){
    return post.message.quotes;
}


function setborder(thread){
     thread = getthreadbyid(thread.id);
    thread.style.backgroundColor=threadcolour;
    window.scrollTo(0, thread.offsetTop-40);
    thread.style.border = "thick solid #0000FF";
    thread.highlighted = true;
    currthreadid=thread.id;
    currthreadEl = thread;
    var qr = document.getElementById("qr");
    if (qr != null && window.getComputedStyle(qr).display != 'none'){
        qr.querySelector('.close').click();
        currthreadEl.click();
    }
}

function killborder(thread){
     thread.style.backgroundColor = "";
    thread.style.border = "";
    thread.highlighted = false;
}

document.onkeydown = function(e) {
    e = e || window.event;
    if (!loaded){
        e.preventDefault();
        return;
    }
    var replybox = document.getElementById("qr");
    if (replybox != null){
        var style = window.getComputedStyle(replybox);
        if (style.display != 'none'){
            switch(e.which || e.keyCode){
                case 191:
                    if (e.ctrlKey){
                        e.preventDefault();
                        replybox.querySelector('.close').click();
                        currthreadEl.click();
                        //alert(replybox.querySelector("textarea.field"));
                        return;   
                    }
            }
            //alert(replybox.style.visibility);
            if (replybox == document.querySelector(".focus")){
                // alert('replybox has focus');
                switch(e.which || e.keyCode){
                    case 17:
                        //alert('ayyyyyyyyyy');
                        e.preventDefault();
                        //selectedPost.focus();
                        resetFocus();

                        return;
                        break;

                    default:
                        //alert('cccccccccc');
                        return;
                    }
            }else{ //replybox unfocused but visible
                switch(e.which || e.keyCode){
                    case 17:
                        //alert('ayy');
                        e.preventDefault();
                        var textarea = replybox.querySelector(".textarea");
                        textarea.children[0].select();
                        var text = textarea.children[0].value;
                        textarea.children[0].value = '';
                        textarea.children[0].value = text;
                }
            }
        }else{
        }
    }
    switch(e.which || e.keyCode) {

        case 191:
            if (selectedPost != null){
                try{
                    var link = selectedPost.querySelector(".postNum").children[1];
                    link.click();
                }catch(err){}
            }else{
                currthreadEl.querySelector(".postNum").children[1].click();
            }
        break;

        case 13: // Enter
            if (e.ctrlKey){
                thread = currthreadEl;
                if (thread.expanded != true){
                    try{
                        thread.thread.querySelector(".summary").click();
                        var height = thread.offsetHeight;
                        var a = setInterval(function(){
                            if (thread.thread.posts.length != thread.querySelectorAll(".postContainer")){
                                clearInterval(a);
                                thread.expanded = true;
 
                                 var b = setInterval(function(){
                                    if (thread.offsetHeight != height){
                                        clearInterval(b);
                                        addpoststothread(currthreadEl.thread);
                                         try{scrollintoview(selectedPost);}catch(err){}
                                    }
                                },50)
                            }
                        },150)
                    
                    }
                    catch(err){}
                }
                else{ //thread is expanded
                    if(thread.selected == true){
                        if (selectedPost.parentElement.parentElement.className == "inline"){
                            var a = selectedPost;
                            while(a.parentElement.parentElement.className == "inline"){
                                a = a.parentElement.parentElement.parentElement.parentElement;
                            };
                            var selpoindex = thread.thread.donereplyids.indexOf(a.parentElement.id);
                            var replieslen = thread.thread.donereplyids.length;
                            if (replieslen - selpoindex < replieslen - 4){
                                unstylepost(selectedPost);
                                collapsereplytree(selectedPost);
                            }
                        }else{
                            var selpoindex = thread.thread.donereplyids.indexOf(selectedPost.parentElement.id);
                            var replieslen = thread.thread.donereplyids.length;
                            if (replieslen - selpoindex < replieslen - 4){
                                unstylepost(selectedPost);
                            }
                        }
                    }
                    thread.thread.querySelector(".summary").click();
                     if (thread.selected == true){
                        var a = setInterval(function(){
                             if (thread.querySelectorAll(".postContainer").length-thread.querySelectorAll(".inline").length == 6){
                                clearInterval(a);
                                if (document.getElementById(selectedPost.id)!=null){
                                    scrollintoview(selectedPost);
 
                                }else{
                                    scrollintoview(thread);
                                    op = thread.thread.op;
                                    OP = thread.thread.op.OPcontainer;
                                    OP.style.backgroundColor  = darkercolour;
                                    OP.style.border = "solid #A600FF 3px";
                                    selectedPostID = op.postop.id;
                                    selectedPost = op.postop;
                                 }
                                thread.expanded = false;

                            }
                            
                        },50)
                     }
                    
                }
                        
            }

            else if (e.shiftKey){ // shift pressed //
                
            }

            else if (!e.ctrlKey){ // ctrl pressed //
                threads = document.getElementsByClassName('threadContainer');
                thread = currthreadEl;
                if (thread.selected != true){
                    im = thread.children[0].children[0].children[1].children[0].children[1];
                    //this is OP's pic
                    im.click();
                }
                try{
                    im = selectedPost.querySelector(".fileThumb");
                    im.click();
                }catch(err){}
            }
          
        break;


        case 37: // left
            if (e.shiftKey){
                if (selectedPost.parentElement.parentElement.className == "inline"){
                    unstylepost(selectedPost);
                    var parentpost = selectedPost.parentElement.parentElement.parentElement.parentElement;
                    selectedPost = parentpost;
                    selectedPostID = parentpost.id;
                    stylepost(selectedPost)
                }
                e.preventDefault();
                return;
            }
            if (!e.ctrlKey){       //       control key not pressed        //
                thread = currthreadEl;
                if (selectedPost.highlightedlink !== null){
                    if (selectedPost.highlightedlink.expanded !== true){
                        dehighlightlink(selectedPost.highlightedlink);
                     } else{
                         selectedPost.highlightedlink.click();
                        selectedPost.highlightedlink.expanded = false;
                    }
                    
                }
                else if (selectedPost.parentElement.parentElement.className == "inline"){
                    var parentpost = selectedPost.parentElement.parentElement.parentElement.parentElement;
                    unstylepost(selectedPost);
                    selectedPost.link.click();
                    selectedPost.link.expanded = false;
                    selectedPost = parentpost;
                    selectedPostID = parentpost.id;
                    stylepost(selectedPost);

 

                }
                else if (thread.selected == true){
                    unstylepost(document.getElementById(selectedPostID));
                    deselectThread(thread);
                }
            }else{ //         Control key pressed            //
                try{
                    if (selectedPost.parentElement.parentElement.className == "inline"){
                        collapsereplytree(selectedPost);
                        stylepost(selectedPost);
                        setTimeout(function(){scrollintoview(selectedPost);},50);
                    }
                }catch(err){}
            }
            
        break;


        case 38: // up
            threads = document.getElementsByClassName('threadContainer');
            thread = currthreadEl;
            if (thread.selected == false || e.ctrlKey){
                if (currthread > 0){
                    killborder(threads[currthread]);
                    currthread -= 1;
                    setborder(threads[currthread]);
                }
                window.scrollTo(0, threads[currthread].offsetTop-40);
                 putthreadsincontainer();
            }
            else if (e.shiftKey){
                while(selectedPost.parentElement.parentElement.className == "inline"){
                    unstylepost(selectedPost);
                    var parentpost = selectedPost.parentElement.parentElement.parentElement.parentElement;
                    selectedPost = parentpost;
                    selectedPostID = parentpost.id
                }
                selectPreviousPost(selectedPost);
            }
            else if(thread.selected === true){
                if ((selectedPost.highlightedlink == null)){
                    if (document.getElementById(selectedPostID).className !== "post op"){
                        selectPreviousPost(document.getElementById(selectedPostID));
                    }
                }else{
                     var postquoteslen = selectedPost.message.quotes.length;

                    if (selectedPost.highlightedlink == selectedPost.message.quotes[0]){
                        selectPreviousPost(selectedPost);
                    }else{
                        var nextlink = getpreviousquote(selectedPost.highlightedlink);
                        dehighlightlink(selectedPost.highlightedlink);
                        highlightlink(nextlink);
                    }
                  
                }
            }
        break;


        case 39: // right
            thread = currthreadEl;
             if (!thread.selected){
                selectThread(thread);
            }
            else if(!!selectedPost.highlightedlink){ //!== null
                if(selectedPost.highlightedlink.expanded == false){
                    unstylepost(selectedPost);
                    postchildren = selectedPost.querySelector(".postMessage").children.length;
                    selectedPost.highlightedlink.click();
                    selectedPost.highlightedlink.expanded = true;
                    checkinlinetimer = setInterval(function(){checkinlineloaded(selectedPost.highlightedlink);},150);
                }
                else{
                    unstylepost(selectedPost);
                    inlinedpost = selectedPost.highlightedlink.parentElement.nextSibling.children[0].querySelector(".post.reply");
                    if (inlinedpost == null){
                        inlinedpost = link.parentElement.nextSibling.children[0].querySelector(".post.op");
                    }
                     stylepost(inlinedpost);
                    selectedPost=inlinedpost;
                    selectedPostID=inlinedpost.id;
                 }
            }
            else if (!!selectedPost){// !== null
                try{
                    highlightlink(getpostlinks(selectedPost)[0]);
                }
                catch(err){}
            }

        break;


        case 40: // down
            threads = document.getElementsByClassName('threadContainer');
            thread = currthreadEl;
            if (thread.selected == false || e.ctrlKey){
                if (currthread < (threads.length -1)){
                    killborder(threads[currthread]);
                    currthread += 1;
                    setborder(threads[currthread]);
                }
                window.scrollTo(0, threads[currthread].offsetTop-40);
                 putthreadsincontainer();
            } 
            else if (e.shiftKey){
                while(selectedPost.parentElement.parentElement.className == "inline"){
                    unstylepost(selectedPost);
                    var parentpost = selectedPost.parentElement.parentElement.parentElement.parentElement;
                    selectedPost = parentpost;
                    selectedPostID = parentpost.id
                }
                selectNextPost(selectedPost);
            }
            else if(thread.selected === true){
                if ((selectedPost.highlightedlink == null)){
                    try{
                    selectNextPost(document.getElementById(selectedPostID));
                     }
                    catch(err){
                    }
                }else{
                    var postquoteslen = selectedPost.message.quotes.length;
                    if (selectedPost.highlightedlink == selectedPost.message.quotes[postquoteslen-1]){
                        selectNextPost(selectedPost);
                    }else{
                        var nextlink = getnextquote(selectedPost.highlightedlink);
                        dehighlightlink(selectedPost.highlightedlink);
                        highlightlink(nextlink);
                    }

                    
                }
            }
        break;


        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
};

var postchildren = 0;
var checkinlinetimer;
function checkinlineloaded(link){
    parentpost = link.parentElement.parentElement;
    postchildren = parseInt(postchildren);
    parentpostchildren = parseInt(parentpost.children.length);

    if ((parentpostchildren > postchildren) && (link.parentElement.nextSibling.children.length)){
        clearInterval(checkinlinetimer);
        inlinedpost = link.parentElement.nextSibling.children[0].querySelector(".post.reply");
        if (inlinedpost == null){
            inlinedpost = link.parentElement.nextSibling.children[0].querySelector(".post.op");
        }
        stylepost(inlinedpost);
        selectedPost=inlinedpost;
        selectedPostID=inlinedpost.id;
        inlinedpost.link = link;
    }
}

function collapsereplytree(post){
    while(selectedPost.parentElement.parentElement.className == "inline"){
        var parentpost = selectedPost.parentElement.parentElement.parentElement.parentElement;
        selectedPost.link.click();
        selectedPost.link.expanded = false;
        selectedPost = parentpost;
        selectedPostID = parentpost.id
    };
}


function highlightlink(link){
    highlightedLink = link;
    link.parentElement.parentElement.parentElement.highlightedlink = link; //.post.reply.highlightedlink = link
    link.highlighted = true;
    highlightedLink.parentElement.style.borderColor = "#6c22d4";
    highlightedLink.parentElement.style.borderStyle = "dotted";
    highlightedLink.parentElement.style.borderWidth = '3px';
    highlightedLink.parentElement.style.padding = '1px';
    highlightedLink.parentElement.style.display = "inline-block";
}

function dehighlightlink(link){
    link.highlighted = false;
    highlightedLink = null;
    link.parentElement.parentElement.parentElement.highlightedlink = null;
    link.parentElement.style.borderColor = "";
    link.parentElement.style.borderStyle = "none";
    link.parentElement.style.borderWidth = '0px';
    link.parentElement.style.padding = '0px';
}

function getnextquote(link){ //link of currently highlighted quote
    var parentmessage = link.parentElement.parentElement;
    var linkindex = parseInt(link.index);
    var next = linkindex+1;
    if (linkindex < (parentmessage.quotes.length - 1)){
        return parentmessage.quotes[next];
    }
    else{
        return link;
    }
}
function getpreviousquote(link){ //link of currently highlighted quote
    var parentmessage = link.parentElement.parentElement;
    var linkindex = link.index;
    if (linkindex > 0){
        return parentmessage.quotes[linkindex -1];
    }
    else{
        return link;
    }
}

function stylepost(post){ //'post' = "post reply" or ".post.reply"
    post.style.backgroundColor = darkercolour;
    post.style.setProperty("border", "solid #A600FF 3px", "important");// = "solid #A600FF 3px !important";
    if(!post.message){
        post.highlightedlink = null;
        post.message = post.querySelector(".postMessage");
        post.message.quotes = post.message.querySelectorAll(".quotelink");
        quotes = post.message.quotes;
        var n = 0;
        quotes.forEach(
            function(item){
                 if (item.done !== true && item.parentElement.className == "postMessage"){
                    item.index = n;
                    n = n + 1;
                    linkcontainer = document.createElement('div');
                    item.parentElement.replaceChild(linkcontainer, item);
                    item.done = true;
                    item.highlighted = false;
                    item.expanded = false;
                    linkcontainer.appendChild(item);
                }
            });
    }
    try{
        if (post.highlightedlink == null){
            highlightlink(post.message.quotes[0]);
            //var quoteslen = post.message.quotes.length;

        }
    }catch(err){}
    scrollintoview(post);
}

function unstylepost(post){ //'post' = "post reply" or ".post.reply"
    post.style.backgroundColor = "";
    post.style.border = '';
}


function selectNextPost(post){ //'post' = "post reply" or ".post.reply"

    if (post.className === "post op"){
        thread = post.parentElement.parentElement;
        
        postcontainer = post.parentElement;
        if (thread.children.length === 1){
            return;
        }
        post.children[1].style.backgroundColor = '';
        post.children[1].style.border = '';
        if (postcontainer.nextSibling.className === "summary"){
            nextPost = thread.children[2].children[1];
        }else{nextPost = postcontainer.nextSibling.children[1];}
        stylepost(nextPost);
        selectedPost = nextPost;
        selectedPostID = nextPost.id;
        
    }else{
        
        thread = post.parentElement.parentElement;
        posts = thread.children;
        try{
            nextPost = post.parentElement.nextSibling.children[1];
            unstylepost(post);
            stylepost(nextPost);
            selectedPost = nextPost;
            selectedPostID = nextPost.id;

        }
        catch(err){
        }
    }
}

function selectPreviousPost(post){ //'post' = "post reply" or ".post.reply"
    if (post.className === ("post op" || "OPcontainer")){
        return;
    }
    else{
        if (post.parentElement.previousSibling != null){
            if (post.parentElement.previousSibling.className === "summary"){
                previousPost = post.parentElement.previousSibling.previousSibling.children[1].children[1];
                selectedPostID = previousPost.parentElement.id;
                selectedPost = previousPost.parentElement;
            }else{
                previousPost = post.parentElement.previousSibling.children[1];
                if (previousPost.className === "post op"){
                    previousPost = previousPost.children[1];
                }
                selectedPostID = previousPost.id;
                selectedPost = previousPost;
                if (previousPost.className ==="OPcontainer"){
                    selectedPostID=previousPost.parentElement.id;
                }
            }
        }
        else{
            return 0;
        }
        unstylepost(post);
        stylepost(previousPost);
    }
}

function selectThread(thread){
    thread1 = getthreadbyid(thread.id);
    op = thread1.thread.op;
    OP = thread1.thread.op.OPcontainer;
    OP.style.backgroundColor  = darkercolour;
    OP.style.border = "solid #A600FF 3px";
    thread.selected = true;
    selectedPostID = op.postop.id;
    selectedPost = op.postop;

}

function deselectThread(thread){
    thread1 = getthreadbyid(thread.id);
    
    OP = thread1.thread.op.OPcontainer;
    OP.style.backgroundColor = '';
    OP.style.border = '';
    thread.selected = false;
    selectedPostID = null;
    selectedPost = null;
}


threadsincontainer = [];
function putthreadsincontainer(){
    const threadEls = document.querySelectorAll('.thread');
    for (let threadEl of threadEls) {
        if (threadsincontainer.indexOf(threadEl.id) < 0){
            threadsincontainer.push(threadEl.id);
            const containerEl = document.createElement('div');
            const clearfixEl = document.createElement('div');
            clearfixEl.style.clear = 'both';
            threadEl.parentNode.replaceChild(containerEl, threadEl);
            containerEl.appendChild(threadEl);
            containerEl.appendChild(clearfixEl);
            containerEl.className = "threadContainer";
            containerEl.id = threadEl.id + 'c';
            containerEl.selected = false;
            const OPcontainerEl = document.createElement('div');
            const clearfixEl2 = document.createElement('div');
            clearfixEl2.style.clear = 'both';
            opMessageEl = containerEl.children[0].children[0].children[1].children[2];
            opPostInfoEl = containerEl.children[0].children[0].children[1].children[1];
            opPostInfoEl.parentNode.replaceChild(OPcontainerEl,opPostInfoEl);
            OPcontainerEl.appendChild(opPostInfoEl);
            OPcontainerEl.appendChild(opMessageEl);
            //OPcontainerEl.appendChild(clearfixEl2);
            OPcontainerEl.style.display = "table";
            OPcontainerEl.className = "OPcontainer";
            //OPcontainerEl.style.border = "solid #A600FF 3px";
            //push(containerEl);
            addthreadcontainer(containerEl);

        }
    }
}

function shadeColor2(color, percent) {   
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

function shadeBlend(p,c0,c1) {
    var n=p<0?p*-1:p,u=Math.round,w=parseInt;
    if(c0.length>7){
        var f=c0.split(","),t=(c1?c1:p<0?"rgb(0,0,0)":"rgb(255,255,255)").split(","),R=w(f[0].slice(4)),G=w(f[1]),B=w(f[2]);
        return "rgb("+(u((w(t[0].slice(4))-R)*n)+R)+","+(u((w(t[1])-G)*n)+G)+","+(u((w(t[2])-B)*n)+B)+")";
    }else{
        var f=w(c0.slice(1),16),t=w((c1?c1:p<0?"#000000":"#FFFFFF").slice(1),16),R1=f>>16,G1=f>>8&0x00FF,B1=f&0x0000FF;
        return "#"+(0x1000000+(u(((t>>16)-R1)*n)+R1)*0x10000+(u(((t>>8&0x00FF)-G1)*n)+G1)*0x100+(u(((t&0x0000FF)-B1)*n)+B1)).toString(16).slice(1);
    }
}

function blendColors(c0, c1, p) {
    var f=parseInt(c0.slice(1),16),t=parseInt(c1.slice(1),16),R1=f>>16,G1=f>>8&0x00FF,B1=f&0x0000FF,R2=t>>16,G2=t>>8&0x00FF,B2=t&0x0000FF;
    return "#"+(0x1000000+(Math.round((R2-R1)*p)+R1)*0x10000+(Math.round((G2-G1)*p)+G1)*0x100+(Math.round((B2-B1)*p)+B1)).toString(16).slice(1);
}

function simulateClick(targetNode){
    if (targetNode) {
        //--- Simulate a natural mouse-click sequence.
        triggerMouseEvent (targetNode, "mouseover");
        triggerMouseEvent (targetNode, "mousedown");
        triggerMouseEvent (targetNode, "mouseup");
        triggerMouseEvent (targetNode, "click");
    }
    else
        console.log ("*** Target node not found!");
}

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}

function resetFocus () {
    let scrollTop = document.body.scrollTop;
    let body = document.body;

    let tmp = document.createElement('input');
    tmp.style.opacity = 0;
    body.appendChild(tmp);
    tmp.focus();
    body.removeChild(tmp);
    body.scrollTop = scrollTop;
}

function isinviewport(element) {
  var rect = element.getBoundingClientRect();
  var html = document.documentElement;
  alert("top: " + rect.top + ' left: ' + rect.left + ' bottom: ' + rect.bottom + ' right: ' + rect.right + '\ninnerheight: '+ window.innerHeight + ' innerwidth: ' + window.innerWidth);
  alert('scrollTop: ' + document.body.scrollTop);
  return (

    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || html.clientHeight) &&
    rect.right <= (window.innerWidth || html.clientWidth)
  );
}

function scrollintoview(element){
	var rect = element.getBoundingClientRect();
	var html = document.documentElement;
	if (rect.top < 0){
		var scrollto = element.offsetTop - 50;
		window.scrollTo(0, scrollto);
	}
	else if (rect.bottom > window.innerHeight){
		var origin = element;
		while(element.parentElement.parentElement.className == "inline"){
            var element = element.parentElement.parentElement.parentElement.parentElement;
 	    };
		var scrollto = element.offsetTop + element.offsetHeight + 30 - window.innerHeight;
		window.scrollTo(0, scrollto);
		if (checktop(origin)){
			scrollintoview(origin);
		}
	}
}

function checktop(element){
	var rect = element.getBoundingClientRect();
	if (rect.top < 0){
		return true;
	}else{
		return false;
	}

}

//window.scrollTo(0, thread.offsetTop-40);

window.onload = function() {

    winloaded = setInterval(function(){
        threads = document.querySelectorAll(".thread");
        if (threads.length>0){
            clearinterval();
            putthreadsincontainer();
            backcolour = (window.getComputedStyle( document.body ,null).getPropertyValue('background-color'));
            darkercolour = shadeBlend(-.15, backcolour);
            threadcolour = shadeBlend(-.05, backcolour);
            threads = document.getElementsByClassName('threadContainer');
            setborder(threads[0]);
            loaded = true;
        }
    }, 50);
    function clearinterval(){
        clearInterval(winloaded);
    }
};