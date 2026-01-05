// ==UserScript==
// @name         iichan catalog
// @namespace    http://your.homepage/
// @version      0.4
// @description  Add catalog to http://iichan.hk/; Добавляет на ычан каталог с подрузкой. 
// @author       You
// @match        http://iichan.hk/*
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/11163/iichan%20catalog.user.js
// @updateURL https://update.greasyfork.org/scripts/11163/iichan%20catalog.meta.js
// ==/UserScript==
/*jshint multistr: true */
"use strict";
var catalog = null;
var scrollBuffer = 300;
var timeToFailure = 15000;
var backgroundColor = '#F0E0D6';

var noNextPage = false;
var activeDoc;
var pending;
var threadMap= {};
var bookmarkMap;
var styleCSS = '<style>\
.thread_wrap{text-align:center; display:inline-block; overflow: hidden; height: 400px; position:relative; vertical-align: top; margin:5px; }\
.thread_wrap:hover{overflow: visible; z-index: 900;}\
.thread_wrap_1:after {\
content: "";\
position: absolute;\
width: 100%;\
height: 30px;\
background: #111111;\
bottom: 0;\
left: 0;\
background: linear-gradient(to bottom, rgba(240,224,214,0.02) 0%,rgba(240,224,214,0.13)\
30%,rgba(240,224,214,0.62) 52%,rgba(240,224,214,0.94) 74%,rgba(240,224,214,1) 100%);} \
.thread_wrap:hover:after {\
content: "";\
width: 0;\
height: 0;}\
.thread_face{width:220px; min-height:400px; border:1px solid #800000; overflow:hidden;\
-webkit-box-sizing: border-box;  -moz-box-sizing: border-box;  box-sizing: border-box;\
padding:5px; text-align:center; display:inline-block;word-wrap: break-word; }\
.bookmark{margin:3px; opacity:0.3; }\
.bookmark:hover{opacity:0.7;}\
.bookmark.activeBtn{opacity:1;}\
</style>';

var sheet = (function() {
	// Create the <style> tag
	var style = document.createElement("style");
	// WebKit hack :(
	style.appendChild(document.createTextNode(""));
	// Add the <style> element to the page
	document.head.appendChild(style);
    
	return style.sheet;
})();

init();

function init(){
    scrollBuffer += window.innerHeight;
    pending = false; 
    activeDoc = document;    
    if(!isMainFrame()){
        return;
    }
    var adminbar = qs('.adminbar')[0];
    if(!adminbar){
        return;
    }

    makeCatalogButton(adminbar);
    loadBookmarkMap();


    catalog = makeCatalog();
    loadFontAwesome();
    window.addEventListener("scroll", testScrollPosition, false);
    //testScrollPosition();
}

function getBoardName(){
    var path = window.location.href;
    var parser = document.createElement('a');
    parser.href = path;
    path = parser.pathname;
    var reg = /^(?:\/)(\w*)(?:\/)/;    
    var res = path.match(reg);
    var boardName = (res.length)?res[0]:'';
    return boardName;
}

function nextDoc(doc){
    activeDoc = doc;
}

function appendPage(href){
    if(!href){
        return;
    }
    function addNextPage(doc){
        catalog.buildCatalog(getFormFromDoc(doc));
        nextDoc(doc);
        pending = false;
    }

    handleXHRDoc(href, addNextPage);    
}

function testScrollPosition(){
    if( noNextPage ){
        return;
    }

    if(isCatalogMode()){
        //Take the max of the two heights for browser compatibility
        if( !pending && window.pageYOffset + scrollBuffer > Math.max( document.documentElement.scrollHeight, document.documentElement.offsetHeight ) )
        {   
            pending = true;
          var  timeout = setTimeout( function(){pending=false;testScrollPosition();}, timeToFailure );
            var nextPage = getNextPage();
            //console.log('Next page', nextPage);
            //debugger;
            if(!!nextPage){
                appendPage(nextPage);
            }
            else{
                noNextPage = true;
            }
        }
    }  
}

function showCatalog(){
    catalog.show();
}

function makeCatalogButton(adminbar){
    var catalogLink = document.createElement('span');
    catalogLink.innerHTML =  '[<a href="#" id="id_catalog">Каталог</a>]';
    //console.log(catalogLink);
    adminbar.appendChild(catalogLink);
    catalogLink.onclick = function(e){
        //console.log(document.querySelector('form#delform'));
        if (catalog.shown) {
            resetCatalog();
        }
        showCatalog();
        e.preventDefault();
    };
}

function getThreadsListFromForm(form){
    //    var form = document.querySelector('form#delform');
    var tempList = form.querySelectorAll('div');
    var threadList = [];
    var thread = null;
    for(var i =0; i<tempList.length;++i){
        if(tempList[i].querySelector('.reflink')){
            thread = makeThread(tempList[i]);
            //threadList.push(tempList[i]);
            threadList.push(thread);
        }
    }
    return threadList;
}

function makeCatalog(){
   var catalogElt = document.createElement('div');
    var formElt = getFormFromDoc(document);
    var formParent = formElt.parentElement; 
    var newForm = formElt.cloneNode(true);
    newForm.setAttribute('id', '');    
    formParent.insertBefore(newForm, formElt.nextSibling);
    newForm.innerHTML ='';
    newForm.setAttribute('id', 'catalog-form');    
    
    //var catalog = new Catalog(catalogElt, formElt);
    catalog = new Catalog(catalogElt, newForm, formElt);
    catalog.reset();
    return catalog;
}

function makeThread(threadElt){
    return new Thread(threadElt);
}

function getFormFromDoc(doc){
    var form =  doc.querySelectorAll('form#delform')[0];
    if(!form){
        throw new Error('Form element not found');
    }
    return form;
}

function getPathFromURL(url){
    var parser = document.createElement('a');
    parser.href = url;
   var path = parser.pathname;
    return path;
}

function getByRegex(text, regex){
    var match = text.match(regex);
    if(match)
    {
        if(match.length){
            return match;
        }
    }
}

//Get number of post/img from text by regexp.
function parseCount(text, regex){
    var result = getByRegex(text, regex);
    var count = 0;
    if(result){
        count = result[1];
    }
    if(!count){
        return 0;
    }
    return count;
}

function Thread (thread){
    if (!thread) {
        return;
    }
    this.element = undefined;
    this.threadLink = thread.querySelector('.reflink a');   
    this.threadLink = this.threadLink.getAttribute('href');
    this.threadLink = getPathFromURL(this.threadLink);
    this.imgSrc = thread.querySelector('a img');
    this.imgSrc = this.imgSrc.getAttribute('src');
    this.threadName = thread.querySelector('.filetitle');
    this.threadName = this.threadName.textContent;
    this.threadText = thread.querySelector('blockquote');
    this.threadText = this.threadText.innerHTML;
    this.postNum = 0;
    this.imgNum = 0;
    this.lastPost ='';

    var omitted = thread.querySelector('.omittedposts');
    if(omitted){
        omitted= omitted.textContent;     
        if(!!omitted){
            this.postNum = parseInt(parseCount(omitted, /([0-9]*)(?:\s)*(?:сообщений)/),10);
            this.imgNum = parseInt(parseCount(omitted, /([0-9]*)(?:\s)*(?:изображений)/),10);
        }
    }

    var posts = thread.querySelectorAll('.reply');
    var date = '';
    var post = null;
    if (!!posts) {
        this.postNum+=posts.length;
        for (var i = 0; i < posts.length; i++) {
            post = posts[i];
            if (!!post.querySelector('img')) {
                this.imgNum+=1;
            }
            if (i === posts.length-1) {
                date = post.querySelector('label').textContent;
                date = date.replace(/(\D*)/,'');
                this.lastPost = date;
            }
        }
    }   
}

Thread.threadFromThread = function(threadElt, href) {
    var thread = new Thread();
    thread.threadLink = href;
    thread.imgSrc = threadElt.querySelector('a img').getAttribute('src');
    thread.threadName = threadElt.querySelector('label .filetitle').textContent;
    thread.threadText = threadElt.querySelector('blockquote').innerHTML;
    thread.postNum = 0;
    thread.imgNum = 0; 
    var post = null;
    var posts = threadElt.querySelectorAll('.reply');
    var date;
    if (!!posts) {
        thread.postNum+=posts.length;
        for (var i = 0; i < posts.length; i++) {
            post = posts[i];
            if (!!post.querySelector('img')) {
                thread.imgNum+=1;
            }
            if (i === posts.length-1) {
                date = post.querySelector('label').textContent;
                date = date.replace(/(\D*)/,'');
                thread.lastPost = date;
            }
        }
    }
    thread.element = buildCatalogPost(thread).element;
    return thread; 
};

function buildCatalogPost(thread){
    var template = '<div class = "thread_wrap"><div class = "thread_face reply">\
<a href="'+ thread.threadLink+ '"><img src="' + thread.imgSrc+'" class="thumb"  style=" display: block; margin: 0 auto; float:none;"></a>\
<span class="filetitle thread-title" style=" display:inline-block">'+thread.threadName+'</span>\
<p style= "margin-top:0.6em;">О:'+thread.postNum+'  И:'+thread.imgNum+ '<div style="margin-top:-10px;"></div>\
<span>L: ' + thread.lastPost +'</p></span>\
<span>' + thread.threadText + '</span></div></div>';

    //console.log(template);

    var post = document.createElement('div');
    post.innerHTML = template; 
    post = post.firstChild;
    thread.element = post; 
       
    addBookmarkBtn(thread);
    return thread; 
}
//<p>О: ' + thread.lastPost + '</p>\
function isBookmark(name){
    if (bookmarkMap[name]!==undefined) {
        return true;
    }
    else{
        return false;
    }
}

function loadBookmarkMap (){
    var ls = getBoardName() + '-'+'bookmarks';
    //console.log(ls);
    var entry = localStorage.getItem(ls);
    if (!!entry) {
        bookmarkMap = JSON.parse(entry);        
    }
    else{
        bookmarkMap = {};
    }
}

function updateBookmarkStorage(){
 var ls = getBoardName() + '-'+'bookmarks';
     //console.log(bookmarkMap);
     var value = JSON.stringify(bookmarkMap);
        localStorage.setItem(ls, value);
}

function setBookmarkThread(btn, val){
    var threadLink = btn.bindedElt.getAttribute('date-thread'); 
    if (val){
        bookmarkMap[threadLink]=true;       
    }
    else{        
        delete bookmarkMap[threadLink];        
    }
    updateBookmarkStorage();    
}

function removeBookmarkFromThread(threadLink){
    delete bookmarkMap[threadLink];
    updateBookmarkStorage(); 
}

function bookmarkThread(btn){  
    setBookmarkThread(btn, true);
}

function unbookmarkThread(btn){
    setBookmarkThread(btn, false);   
}

function addBookmarkBtn(thread){
    var post =thread.element;
    var nameElt = post.querySelector('.thread-title');
    if (!!nameElt) {
        var bookmark = elementFromText('<span class="bookmark"></span>');
        nameElt.insertBefore(bookmark, nameElt.firstChild);
        bookmark.setAttribute('date-thread',thread.threadLink);
        var boolBookmark = isBookmark(thread.threadLink);
        var settings = {            
        name:'bookmark',
        active:boolBookmark,
        glyphOn:'fa-bookmark-o',
        glyphOff:'fa-bookmark-o',
        callbackOn:bookmarkThread,
        callbackOff:unbookmarkThread};
        makeToggleButton(bookmark,settings);
    }
}

function resetCatalog(){

    function reset (doc){
        //console.log(' reset ');
        activeDoc = doc;
        //var catalog = makeCatalog();
        catalog.reset();
    }
    //console.log(' reset Catalog');
    handleXHRDoc(getBoardName(), reset);
}

function isMainFrame(){
    if(qs('form#delform').length){
        //console.log('iichan main frame');
        return true;
    }
    return false;
}

function getNextPage(pagePane){
    pagePane = getPagePane();
    var pageList = pagePane.querySelectorAll('td')[2];
    var next = pageList.querySelectorAll('td form')[0];

    if(!next){
        return false;
    }
   var href = next.getAttribute('action');   
    //console.log(href);
    return href;
}


function getFirstPage(pagePane){
    pagePane = getPagePane();
    if(!pagePane){
        return false;
    }
    var pageList = pagePane.querySelectorAll('td')[1];

    var first = pageList.querySelectorAll('a')[0];

    var href = first.getAttribute('href');   
    //console.log(href);

    return href;
}

function getPagePane(doc){
    doc = activeDoc;
    var paginator = doc.querySelector('body>table>tbody>tr');
    //console.log(pagePane);
    return paginator;
}

function isCatalogMode(){
    return catalog.isShown();
}




function Catalog (catalogElt, formElt, oldForm){
    this.threadList = [];
    this.catalogElt = catalogElt;
    this.shown = false;
    this.formElt = formElt;
    this.oldForm = oldForm;
    this.threadMap = {};
    this.isShown = function(){
        return this.shown;
    };
    this.bookmarkShown = false;
    this.makeBookmarks = function(){
        var self = this;
        this.bookmarkShown = true;
        var keys = [];
        var index;
        for(index in bookmarkMap) { 
           if (bookmarkMap.hasOwnProperty(index)) {
               var attr = bookmarkMap[index];
               keys.push(index);
           }
        }
        index = 0; 
        if (keys.length) {
            handleXHRDoc(keys[index], testSuccess, testFail);
            index++;
        }
        function testSuccess(doc, reqString){
           var threadElt = doc.querySelector('#delform>div');
           var thread = Thread.threadFromThread(threadElt,reqString);
           //console.log(thread);
           self.appendBookmarkPost(thread.element);
            //console.log(thread.element);          
           if (index<keys.length) {
                handleXHRDoc(keys[index], testSuccess, testFail);
                index++;
           }
        }

       function testFail(doc, reqString){
        console.log('fail xhr');
        removeBookmarkFromThread(reqString);
        if (index<keys.length) {
            handleXHRDoc(keys[index], testSuccess, testFail);
            index++;
            }
        }
    };
    this.show = function (){
        formElt.innerHTML ='';
        formElt.appendChild(catalog.catalogElt);
        
        //Hide dollchan forms when catalog is shown
        //oldForm.style.display='none';
        sheet.insertRule("body>form:not(#catalog-form) { display:none; }",0);
        sheet.insertRule("#de-main + .de-parea{ display:none; }",0);       
        var postArea = document.querySelector('.postarea');
        if(!!postArea){
            console.log(postArea);
            postArea.parentElement.removeChild(postArea);
        }
//        var newTreadForms = document.querySelectorAll('.de-parea');
//        if(newTreadForms.lenght==2){
 //       var first = newTreadForms[0];
 //           first.parentElement.removeChild(first);
//        }
        
        this.shown = true;
    };

    this.reset = function(){
        var style = styleCSS;
        //console.log(style);
        threadMap ={};        
        this.bookmarkShown = false;
        this.catalogElt.innerHTML = style;
        appendPage(getBoardName());
    };

    this.appendBookmarkPost = function(post){
        this.catalogElt.insertBefore(post,this.catalogElt.firstChild); 
    };

    this.buildCatalog = function (form){
        var catalogElement = this.catalogElt;
        var threadList = getThreadsListFromForm(form);
        var threadLink = ''; 
        var post = null;
        var thread =null;
        for(var i =0; i< threadList.length;++i){
            thread = buildCatalogPost(threadList[i]);
            threadLink = thread.threadLink;
            if ((threadMap[threadLink])===undefined) {
                threadMap[threadLink] = thread;
                post = thread.element;
                if (isBookmark(threadLink)) {
                    //this.appendBookmarkPost(post); 
                }
                else{
                    catalogElement.appendChild(post);  
                }
                              
            }
            else{
                console.log('duble thread '+ threadLink);
            }

        }

        if (!this.bookmarkShown) {
            this.makeBookmarks();
        }
        //console.log(catalogElement);
        return catalogElement;
    };

}

function loadFontAwesome(){
   var fontAwesomeLoader = elementFromText('<link rel="stylesheet" type="text/css" media="screen" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.0.3/css/font-awesome.css" />');    
   document.head.appendChild(fontAwesomeLoader);
}


function handleXHRDoc(reqString, callback, errorCallback){
    var doc = document.implementation.createHTMLDocument("example");

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', reqString, true);
    xmlhttp.send(null);
    xmlhttp.onreadystatechange = handle;

    function handle(){              
        if (xmlhttp.readyState == 4) {
            if(xmlhttp.status == 200) {
                doc.documentElement.innerHTML = xmlhttp.responseText;
                //console.log(doc);
                callback(doc, reqString);
            }           
            else{ 
                if (!!errorCallback) {
                    errorCallback(xmlhttp.status, reqString);                    
                }
                else{
                 console.log('Error xhr of ' + reqString);                    
                }
            }
        }
    }    
}

function elementFromText(text){
    var div = document.createElement('div');
    div.innerHTML = text;
    var element = div.firstChild;
    return element; 
}

function qs(selector){
    return document.querySelectorAll(selector);
}



function makeToggleButton(elem, settings){
    var btn = new ButtonToggle(settings);
    btn.bindElement(elem);
    btn.load();
    elem.addEventListener('click', btn.handlerClick, false);
    //console.log(btn);
    return btn;
}

 function ButtonToggle(settings) {
        var self = this;

        var modGliph = '';
        this.name = settings.name;

        this.active = !!settings.active;
        this.bindedElt = null;
        this.glyphElt = document.createElement('i');
        this.bindElement = function (elem) {
            self.bindedElt = elem;
            if (self.bindedElt.length > 0) {
                elem.insertChildBefore(self.glyphElt, elem.FirstChild);
            }
            else {
                elem.appendChild(self.glyphElt);
            }
        };

        this.glyphOn = 'fa ' + settings.glyphOn + ' ' + modGliph;
        this.glyphOff = 'fa ' + settings.glyphOff + ' ' + modGliph;
        this.callbackOn = settings.callbackOn;
        this.callbackOff = settings.callbackOff;
        this.save = function () {
            
        };
        this.load = function () {
            self.setActive(self.active);
        };
        this.handlerClick = function (e) {
            if (self.active) {
                self.setActive(false);
            }

            else {
                self.setActive(true);
            }
        };

        this.setActive = function (val) {
            val = !!val;
            self.active = val;
            self.save(val);

            if (val) {
                if (!!self.bindedElt) {
                    self.bindedElt.classList.add('activeBtn');
                    self.glyphElt.className = self.glyphOn;
                }

                if (!!self.callbackOn) {
                    self.callbackOn(self);
                }
            }

            else {
                if (!!self.bindedElt) {
                    self.bindedElt.classList.remove('activeBtn');
                    self.glyphElt.className = self.glyphOff;
                }

                if (!!self.callbackOff) {
                    self.callbackOff(self);
                }
            }
        };
    }
