// ==UserScript==
// @name        Pixiv Infinite Scroll/Download Links
// @description Adds infinite scroll and inline expansion on the search page and artists' works pages. For manga mode a two-step expansion is used.
// @namespace   https://github.com/an-electric-sheep/userscripts
// @match       *://www.pixiv.net/search*
// @match       *://www.pixiv.net/member_illust*
// @match       *://www.pixiv.net/bookmark.php*
// @match       *://www.pixiv.net/new_illust*
// @match       *://www.pixiv.net/bookmark_new_illust*
// @require     https://cdnjs.cloudflare.com/ajax/libs/jszip/2.4.0/jszip.js
// @version     0.7.5
// @grant       GM_xmlhttpRequest
// @run-at      document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/3091/Pixiv%20Infinite%20ScrollDownload%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/3091/Pixiv%20Infinite%20ScrollDownload%20Links.meta.js
// ==/UserScript==

/*

various test-cases; may be NSFW

http://www.pixiv.net/member_illust.php?mode=medium&illust_id=48159751
http://www.pixiv.net/member_illust.php?mode=medium&illust_id=46288162
http://www.pixiv.net/member_illust.php?mode=medium&illust_id=43499240
http://www.pixiv.net/member_illust.php?mode=medium&illust_id=47204793


*/

"use strict";

function lift(f) {
  return function(...args) {
    f(this, ...args)
  }
}

function Maybe(wrapped) {
  if (typeof this !== "object" || Object.getPrototypeOf(this) !== Maybe.prototype) {
    var o = Object.create(Maybe.prototype);
    o.constructor.apply(o, arguments);
    return o;
  }
  
  this.wrapped = wrapped;
}

Maybe.prototype.isEmpty = function(){return null == this.wrapped}
Maybe.prototype.orElse = function(other){return this.isEmpty() ? Maybe(other) : this}
Maybe.prototype.apply = function(f){if(!this.isEmpty()){f.apply(null, [this.wrapped].concat(Array.prototype.slice.call(arguments, 1)))};return this;}
Maybe.prototype.map = function(f){return this.isEmpty() ? this :  Maybe(f.apply(null, [this.wrapped].concat(Array.prototype.slice.call(arguments,1))));}
Maybe.prototype.get = function(){return this.wrapped;}

// incomplete shim for older FF versions
if(!Array.hasOwnProperty("from")) {
  Object.defineProperty(Array, "from",  {
    enumerable: false,
    configurable: true,
    value: function(e) {
        return Array.prototype.slice.call(e)
    }
  });
}

if(!Array.prototype.hasOwnProperty("last")) {
  Object.defineProperty(Array.prototype, 'last', {
    enumerable: false,
    configurable: true,
    get: function() {
        return this.length > 0 ? this[this.length - 1] : undefined;
    },
    set: undefined
  });
}

Object.defineProperty(Function.prototype, "passThis", {value: function(){let f= this; return function(){f.apply(null, [this].concat(arguments))}}})

var styleAdded = false


function xpathAt(path, element){
  var result = document.evaluate(path, element || document.documentElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
  return result.singleNodeValue
}

const imgContainerSelector = "._image-items, .image-items, .display_works > ul";

document.addEventListener("DOMContentLoaded", function() {
  for(var e of document.querySelectorAll("iframe, .ad-printservice, .popular-introduction")){e.remove()}
  
  // scroll events fire at high rate, throttle them
  let requested = false;
  
  function viewportChanged() {
  	if(requested)
  		return;
  	requested = true;

  	window.requestAnimationFrame(() => {
  		requested = false;
  		NextPageHandler.checkAll();
  	})
  	
  } 
  
  window.addEventListener("scroll", viewportChanged)
  window.addEventListener("resize", viewportChanged)
  window.addEventListener("visibilitychange", viewportChanged)
  window.requestAnimationFrame(AnimatedCanvas.updateAll)
  
  for(var e of document.querySelectorAll(".image-item")){customizeImageItem(e)}
  
  Maybe(Array.from(document.querySelectorAll(".pager-container")).last).apply(paginator => {
    Maybe(document.querySelector(".image-item:last-child")).apply(lastItem => {
      var trigger = new NextPageHandler(lastItem)
      trigger.paginator = paginator
      trigger.navElements = Array.from(paginator.childNodes)
      trigger.currentURL = window.location.href
      trigger.nextURL = paginator.querySelector("a[rel=next]").href
    })
  })
  
  NextPageHandler.checkAll();
  
  mediumPageHandler();
})

const style = document.createElement("style");



style.textContent = `
   /* global */

   #wrapper {width: unset;}
   .userscript-error {background-color: rgb(200,0,0); color: black;position: sticky;z-index: 2;width: 100%;text-align:center; padding: 2px; color: white; font-weight: bold; top: 0px;}
   
   /* search page */
   
   .layout-body {width: 85vw;}
   
   /* member page */
   
   .layout-a {width: unset;}
   .layout-a .layout-column-2 {width: calc(100vw - 190px);}
   
   /* member works list
   
   .display_works {width: unset;}
   .display_works .image-item {float: none; }
   
   /* member illust page */
   
   .works_display {width: unset;}
   .works_display img, .works_display ._layout-thumbnail {max-width: -moz-available; max-width: available;}
   section#illust-recommend {margin-right: 0px;}
   
   /* search and member works list */

   ._image-items, .image-items, .display_works > ul {display: flex;flex-wrap: wrap;}
   .image-item img {padding: 0px; border: none;}
   .inline-expandable {cursor: pointer;}
   .image-item.expanded {width: 100%; height: unset;}
   .image-item.expanded .image-item-main {max-width: 80%; }
   .inline-expandable img {max-width: 100%; }
   .image-item.expanded img.manga, .image-item.expanded canvas {max-width: -moz-available; max-width: available;}
   .manga-item {background-color: #f3f3f3 !important;}
   .image-item img.manga-medium {max-width: 156px; max-height: 230px; cursor: pointer;}
   
   /* animated content inlined in the search page */

   .exploded-animation-scroller {overflow-x: auto; width: 100%; margin: 5px 0px; box-shadow: 0px 0px 4px 1px #444;}
   .exploded-animation {display: flex; width: -moz-fit-content; width: fit-content; }
   .exploded-animation img {margin-left: 5px;}
   .has-extended-info {display: flex; flex-wrap: wrap; justify-content: center; min-width: 342px; width: unset; height: unset;}
   .extended-info {margin-left: 0.8em;}
   .extended-info > * {margin-bottom: 1em; text-align: left; }
   .extended-info .tags .tag {float: unset; text-align: left; height: unset; width: unset; border: unset; padding: unset; background: unset; display: list-item; margin: 0px;} 
   ._layout-thumbnail:after {pointer-events: none;}

	 /* paginator */
	 .column-order-menu {position: sticky; bottom:0px;background-color: white; min-height: 30px;border-top: 1px solid grey;z-index:2;}
`;


if(document.head)
  document.head.appendChild(style);

let obs = new MutationObserver(function(records) {
  for(let r of records) {
    for(let e of r.addedNodes) {
      if(e.localName == "head") {
        e.appendChild(style);
      }
      if(e.localName == "body") {
        document.head.appendChild(style);
        obs.disconnect();
      }
    }
  }
});
  
obs.observe(document.documentElement, {childList: true});



function apiGet(workId) {
  return new Promise((resolve, reject) => {
    let session = document.cookie.match(/PHPSESSID=([^;]+);/)[1]
    //let token = unsafeWindow.pixiv.context.token
    let token = document.cookie.match(/PHPSESSID=\d+_([^;]+);/)[1]
    let url = "https://public-api.secure.pixiv.net/v1/works/"+workId+".json" + '?profile_image_sizes=px_170x170,px_50x50&image_sizes=px_128x128,small,medium,large,px_480mw&include_stats=true&show_r18=1' // ?PHPSESSID=" + session

    GM_xmlhttpRequest({
      method: "GET",
      url: url,
      headers: {
        "Referer": document.location.href,
        //"Authorization": "Bearer "+token
        "Authorization": "Bearer 8mMXXWT9iuwdJvsVIvQsFYDwuZpRCMePeyagSh30ZdU"
      },
      onerror: function() {
        reject("api request " + url + " failed. are you logged in?")
      },
      onload: function(response) {
        if(response.status != 200) {
          reject("api request " + url + " returned code "+ response.status+". are you logged in?")
          return;
        }
        
        if(response.responseText.trim() == "") {
          reject("api request returned empty response")
          return;
        }
        

        let data = JSON.parse(response.responseText)


        resolve(data)
      }
    })
  })
}


function mediumPageHandler() {
  var modeLink = document.querySelector('.works_display a[href*="mode"]')
  if(!modeLink)
   return;

  var modeLinkUrl = modeLink.href
  var mode = modeLinkUrl.match(/mode=(.+?)&/)[1]

  var mediumSrc = modeLink.querySelector("img").src
  var container = modeLink.parentNode;
  
  modeLink.addEventListener("click",(e) => {
    e.preventDefault();

    if(greasedImageItems.has(modeLink))
      return;
    
    greasedImageItems.set(modeLink, true)
    
    if(mode == "big") {
      insertBigItem(container, mediumSrc, modeLink, window.location.href)
    }
    
    if(mode == "manga"){
      insertMangaItems(container, modeLinkUrl)
    }
    
    
  })

}


function NextPageHandler(e) {
  if(!e)
    throw "element required";

  this.element = e;
  NextPageHandler.paginationTriggers.add(this)
}

NextPageHandler.paginationTriggers = new Set()

NextPageHandler.checkAll = function() {
  NextPageHandler.paginationTriggers.forEach(e => e.tryLoad())
  
  let first = [...NextPageHandler.paginationTriggers].find(t => inViewport(t.element));
  if(first) {
  	first.updatePageHistory()
  }
}

NextPageHandler.prototype.updatePageHistory = function() {
	history.replaceState({}, "", this.currentURL)
	if(this.paginator && this.navElements) {
	  while(this.paginator.hasChildNodes())
	    this.paginator.firstChild.remove();
	  this.navElements.forEach(e => this.paginator.appendChild(e))
		
	}
}


NextPageHandler.prototype.tryLoad = function(){
  if(this.loading || this.loaded || !this.nextURL || !inViewport(this.element))
    return;
  this.loading = true
  
  var req = new XMLHttpRequest();
  req.open("get", this.nextURL)
  req.onabort = () => this.loading = false
  req.onerror = () => this.loading = false
  req.onload = () => {
    var rsp = req.responseXML;
    var nextItem = this.element.nextSibling;
    var container = this.element.parentNode;
    
    var newPaginator = rsp.querySelector(".pager-container")
    var newItems = Array.from(rsp.querySelectorAll(".image-item"))
    
    var lastItem = newItems.map(e => {
      var imageItem = document.importNode(e, true)
      let result = customizeImageItem(imageItem)
      if(result) {
        container.insertBefore(imageItem, nextItem)
        return imageItem;
      }
      return null;
    }).filter(e => e != null).last
    
    if(lastItem) {
      var nextHandler = new NextPageHandler(lastItem)
      nextHandler.paginator = this.paginator
      nextHandler.navElements = Array.from(newPaginator.childNodes).map(e => document.importNode(e, true));
      nextHandler.currentURL = this.nextURL

      Maybe(newPaginator.querySelector("a[rel=next]")).apply(e => nextHandler.nextURL = e.href)
    }

    this.loading = false
    this.loaded = true
    NextPageHandler.checkAll();
  }
  req.responseType = "document"
  req.send()
}


NextPageHandler.prototype.destroy = function(){NextPageHandler.paginationTriggers.delete(this)}



function inViewport (el) {
    if(("hidden" in document) && document.hidden)
      return false;

    var rect = el.getBoundingClientRect();

    return (
        rect.bottom >= 0 &&
        rect.right >= 0 &&
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) && 
        rect.left <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function MangaItem(container, insertBefore, mediumUrl) {
  
  this.thumbSrc = mediumUrl
  // unless the API resolves the file type for us we have to try all possible extensions
  this.extensions = ["jpg", "png", "gif"]

  let item = this.item = document.createElement("li")
  item.className = "image-item manga-item"
  let img = this.img = document.createElement("img")
  img.src = mediumUrl
  img.className = "manga-medium"
  img.addEventListener("click", () => this.expand())
  item.appendChild(img)
  
  container.insertBefore(item, insertBefore)
}

MangaItem.prototype = {
  fastExpand: function() {
    let newImg = document.createElement("img")
    newImg.className = "manga";
    newImg.addEventListener("load", () => this.insertExpanded(newImg))
    newImg.src = this.bigSrc;
  },
  expand: function() {
    if(this.bigSrc) {
      this.fastExpand()
      return;
    }
      
    let mediumSrc = this.img.src

    let newImg = document.createElement("img")
    newImg.className = "manga"

    if(/\/img-master\//.test(mediumSrc)) {
      // new image format
      // test with http://www.pixiv.net/member_illust.php?mode=medium&illust_id=46288162
      mediumSrc = mediumSrc.replace(/\/c\/\d+x\d+\/img-master\//, "/img-original/");
      // yet another new format
      // http://www.pixiv.net/member_illust.php?mode=medium&illust_id=61985638
      mediumSrc = mediumSrc.replace(/img-master\/img\//,"img-original/img/")
      
      // common replacement
      mediumSrc = mediumSrc.replace(/_master1200\./, ".");

    } else {
      // old image format
      // test with http://www.pixiv.net/member_illust.php?mode=medium&illust_id=43499240
      mediumSrc = mediumSrc.replace(/_p(\d+)\./, "_big_p$1.")
    }

    // mobile API image format
    // test with http://www.pixiv.net/member_illust.php?mode=medium&illust_id=47204793
    mediumSrc = mediumSrc.replace(/mobile\//, "")
    mediumSrc = mediumSrc.replace(/_480mw/, "")

    let exts = this.extensions.slice()

    // first extension
    let ext = "." + exts.shift()
    // match either end of path or start of query query param
    let withExtension = mediumSrc.replace(/\.jpg(?=$|\?)/, ext)

    newImg.addEventListener("load", () => this.insertExpanded(newImg))
    newImg.addEventListener("error", () => {

      if(exts.length == 0 && (/_big_p/.test(mediumSrc))) {
        // sometimes there is no _big_p image for old style urls, usually on small pages
        mediumSrc = mediumSrc.replace(/_big_p/, "_p")
        exts = this.extensions.slice()
      }

      if(exts.length > 0) {
        let fallbackExt = "." + exts.shift()
        // match either end of path or start of query query param
        newImg.src = mediumSrc.replace(/\.jpg(?=$|\?)/, fallbackExt)
      } else {
        // todo: load big page as fallback
        reportError("couldn't find big image based on manga thumbnail "+ this.thumbSrc + " tried " + withExtension)
      }
    })
    newImg.src = withExtension;

  },
  insertExpanded: function(expandedImg) {
    this.img.parentNode.replaceChild(expandedImg,this.img)
    this.item.classList.add("expanded")
  }
}


function insertMangaItems(parentItem,url) {

  let id = url.match(/illust_id=(\d+)/)[1]
  let nextItem = parentItem.nextSibling
  let container = parentItem.parentNode


  apiGet(id)
    .then(apiData => {
      let pages = apiData.response[0].metadata.pages;


      for(let page of pages) {

        let item = new MangaItem(container, nextItem, page["image_urls"].medium )
        item.bigSrc = page["image_urls"].large
        
      }
    }).catch(ex => new Promise((resolve, reject) => {
      let req = new XMLHttpRequest()
      req.open("get", url)
      req.onload = function() {
        let rsp = this.responseXML

        let items = [];
        
        let mediumImages = rsp.querySelectorAll(".item-container");
        
        if(mediumImages.length > 0) {
        	for(let e of mediumImages) {
            let item = new MangaItem(container, nextItem, e.querySelector(".image").dataset.src)

            item.bigUrl = e.querySelector(".full-size-container").href        		
        	}
        	resolve(null)

        } else {
        	// TODO: right-to-left manga browsing browsing format
        	rsp.querySelectorAll("head script:not([src])")
        	//resolve()
        }
        
        reject("no manga items found for " + url)

      }
      req.onerror = () => {
        reject("failed to load " + url)
      }
      req.responseType = "document"
      req.send()

    })).catch(ex => {
      reportError(ex)
    })


 
  
}

function AnimatedCanvas(frames) {
  this.frames = frames
  this.currentFrame = 0
  
  this.canvas = document.createElement("canvas")
  this.canvas.setAttribute("width", frames[0].img.naturalWidth)
  this.canvas.setAttribute("height", frames[0].img.naturalHeight)
  
  this.ctx = this.canvas.getContext("2d")
  
  this.ctx.drawImage(frames[0].img, 0, 0)
  this.timestamp = null
  
  AnimatedCanvas.instances.add(this)
}

AnimatedCanvas.prototype.update = function(timestamp) {
  if(!inViewport(this.canvas))
    return;

  if(!this.timestamp){
    this.timestamp = timestamp
    return;
  }
  
  if(timestamp - this.timestamp > this.frames[this.currentFrame].delay)
  {
    this.timestamp = timestamp
    this.currentFrame = (this.currentFrame + 1) % this.frames.length;
    this.ctx.drawImage(this.frames[this.currentFrame].img, 0, 0)
  }
}

AnimatedCanvas.instances = new Set();
AnimatedCanvas.updateAll = function(timestamp) {
  AnimatedCanvas.instances.forEach(i => i.update(timestamp))
  window.requestAnimationFrame(AnimatedCanvas.updateAll)
}


function insertAnimationItems(imageItem, mediumDoc) {
  let container = imageItem.container


  var script = mediumDoc.querySelector("#wrapper script")

  console.log(script.firstChild.data)


  // it's not a strong sandbox. it just avoids the loaded script writing to the main window
  var sandbox = document.createElement("iframe")
  //sandbox.src = window.location.href
  sandbox.seamless = true
  sandbox.setAttribute("srcdoc", "<!DOCTYPE html><html><head><script>window.pixiv = {context: {}}</script><script>"+ script.firstChild.data +"</script></head></html>")
  sandbox.onload = () => {
    let sandboxWindow = sandbox.contentWindow

    // access unsafe window to read data structure created by the script
    if(sandboxWindow.wrappedJSObject)
      sandboxWindow = sandboxWindow.wrappedJSObject

    // sanitize via json encode/decode
    var pixivContext = JSON.parse(JSON.stringify(sandboxWindow.pixiv.context))

    let illustData = pixivContext.ugokuIllustFullscreenData
     
    var req = new XMLHttpRequest
    req.open("get", illustData.src)
    req.responseType = "arraybuffer"
    req.onload = function () {
    
      var buffer = this.response
      var zip = new JSZip(buffer)

      var downloadLink = document.createElement("a")
      downloadLink.innerHTML = downloadLink.download = pixivContext.illustId + ".zip"
      downloadLink.className = "animation-download";

      var downloadInfo = document.createElement("div");
      downloadInfo.className = "animated-item-download";
      
      Array(
        document.createTextNode("Download: "),
        downloadLink,
        document.createElement("br"),
        document.createTextNode("pixiv2webm and pixiv2gif available "),
        Maybe(document.createElement("a")).apply(e => {e.href = "https://github.com/an-electric-sheep/userscripts"; e.innerHTML = "on github"}).get()
      ).forEach(e => downloadInfo.appendChild(e))
      
      container.querySelector(".extended-info").appendChild(downloadInfo)
      
      var scrollContainer = document.createElement("div")
      var explodedAnimation = document.createElement("div")
      scrollContainer.className = "exploded-animation-scroller"
      explodedAnimation.className = "exploded-animation"
      
      scrollContainer.appendChild(explodedAnimation)
      container.appendChild(scrollContainer)
      
      var timingInformation = []
      
      var frames = []

      for(var name in zip.files){
        let file = zip.file(name)
        let imgBuf = file.asArrayBuffer()
        let imgBlob = new Blob([imgBuf])
        
        let img = document.createElement("img")
        let delay = illustData.frames.find((e) => e.file == name).delay
        
        img.src = URL.createObjectURL(imgBlob)
        
        frames.push({"img": img, "delay": delay})
        timingInformation.push(file.name  + "\t" + delay)
        explodedAnimation.appendChild(img)
      }
      container.classList.add("expanded")
      
      frames[0].img.onload = () => {
        let animation = new AnimatedCanvas(frames)
        imageItem.mainPanel.insertBefore(animation.canvas, imageItem.mainPanel.firstChild)
        imageItem.image.remove()
      }
      
      zip.file("frame_delays.txt", timingInformation.join("\n"))
      
      downloadLink.href = URL.createObjectURL(zip.generate({type: "blob"}))
      
      sandbox.remove();
    }
    req.send()
  }
  document.body.appendChild(sandbox)

}

function insertItemTags(container, responseDoc) {
  var tags = document.importNode(responseDoc.querySelector(".tags"), true)
  container.querySelector(".extended-info").appendChild(tags)
  container.classList.add("has-extended-info")
}

function insertBigItem(container, mediumSrc, bigLinkUrl, mediumLinkUrl) {
  let newImg = document.createElement("img")
  let curImg = container.querySelector("img")
  newImg.setAttribute("class", curImg.getAttribute("class"))
  
  if(mediumSrc.match(/_m\./)) {
    // old format, just derive big url from medium url
    newImg.src = mediumSrc.replace("_m.", ".");
    
  
  } else {
    // new/complex format, e.g.  http://www.pixiv.net/member_illust.php?mode=medium&illust_id=46204420
    // requires a full "mode=big" request to determine the correct img uri

    GM_xmlhttpRequest({
      method: "GET",
      url: bigLinkUrl,
      headers: {
        // we are only allowed to load the mode=big page when referer is mode=medium
        "Referer": mediumLinkUrl
      },
      onerror: function() {
        console.log("big mode load error")
      },
      onload: function(response) {
        console.log("complex load")
        let rsp = response.responseXML;
        // Inject responseXML into existing Object (only appropriate for XML content).
        if (!response.responseXML) {
          rsp = new DOMParser().parseFromString(response.responseText, "text/html");
        }
        newImg.src = rsp.querySelector("img").src
      }
    });

  }
  
  newImg.addEventListener("load", () => {curImg.parentNode.replaceChild(newImg, curImg);container.classList.add("expanded")})
  newImg.addEventListener("error", () => {
    reportError("failed to load big image for " + mediumSrc)
  })


  
}


const greasedImageItems = new WeakMap();
const greasedIds = new Set();

function customizeImageItem(itemElement) {
  if(greasedImageItems.has(itemElement))
   return false;

  let wrapper;
  
  try {
  	wrapper = new ImageItem(itemElement);  	
  } catch(e) {
  	return false;  	
  }
  
  let id = wrapper.id;
  if(id && greasedIds.has(id)) {
    return false;
  }
    

  greasedImageItems.set(itemElement, wrapper);
  greasedIds.add(id);
  return true;
}

function ImageItem(item) {
  let workLink = this.workLink = item.querySelector("a.work")
  if(!workLink)
  	throw new Error("no work link found")

  this.container = item

  let mainInfoContainer = document.createElement("div")
  this.mainPanel = mainInfoContainer
  let expandedInfo = document.createElement("aside") 

  // transplant everything as-is from the image item into the new wrapper
  while(item.hasChildNodes())
    mainInfoContainer.appendChild(item.firstChild)

  item.appendChild(mainInfoContainer)
  item.appendChild(expandedInfo)

  mainInfoContainer.className = "image-item-main"

  mainInfoContainer.classList.add("inline-expandable")
  
  let img = this.image;

  img.addEventListener("click", (e) => {
    this.listItemExpand()
    // img is wrapped in a link, don't follow the link when the user clicks on it
    if(e.button === 0) {
      e.preventDefault()
      e.stopPropagation()
    }
  })
  
  if(img.dataset.src) {
  	img.src = img.dataset.src
  }

  expandedInfo.className = "extended-info"
}

ImageItem.prototype = {
  get id() {
    let match = this.workLink.href.match(/illust_id=(\d+)/);
    return match && (match[1] | 0) || 0
  },
  get image() {
    return this.workLink.querySelector("img")
  },
  listItemExpand: function() {
    if(this.expanded)
      return;
    this.expanded = true

    let container = this.container;
    while(!container.classList.contains("image-item"))
      container = container.parentNode;
    let mediumLink = this.workLink.href
    let req = new XMLHttpRequest()
    req.open("get", mediumLink)
    req.onerror = () => {
      this.expanded = false
      reportError("could not fetch medium page for item "+ this.workLink)
    }
    req.onload = lift((response) => {
      let rsp = response.responseXML;
      let success = false
      
      insertItemTags(container, rsp)
      
      if(rsp.querySelector("._ugoku-illust-player-container")) {
        insertAnimationItems(this, rsp)
        success = true
      }
      
      Maybe(rsp.querySelector('.works_display a[href*="mode"]')).apply((modeLink) => {
        let modeLinkUrl = modeLink.href
        let mediumSrc = modeLink.querySelector("img").src
        
        let mode = modeLinkUrl.match(/mode=(.+?)&/)[1]
        if(mode === "big") {
          insertBigItem(container, mediumSrc, modeLinkUrl, mediumLink)
          success = true
        }
        
        if(mode === "manga"){
          insertMangaItems(container, modeLinkUrl)
          success = true
        }
      })

      Maybe(rsp.querySelector(".works_display .big, .original-image")).apply(big => {
        let newImg = document.createElement("img")
        newImg.addEventListener("load", () => {
          let oldImg = container.querySelector("img")
          oldImg.remove()

          this.mainPanel.insertBefore(newImg, this.mainPanel.firstChild)
          container.classList.add("expanded")
        })
        newImg.addEventListener("error", () => {
          reportError("could not load image: " + newImg.src)
        })
        newImg.src = big.dataset.src
        // assume success, report other errors async
        success = true
        
      })

      if(!success) {
        reportError("failed to find data to expand "+ this.workLink)
      }
     
    })
    req.responseType = "document"
    req.send()
    
  }
}

function reportError(msg){
  let body = document.body
  let div = document.createElement("div")

  div.textContent = msg
  div.className = "userscript-error"
  div.addEventListener("click", (e) => {
    if(e.target === div)
      div.remove()
  })

  body.insertBefore(div, body.firstChild)
}