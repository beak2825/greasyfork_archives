// ==UserScript==
// @name       TradeMe Show All The Photos (Tampermonkey only)
// @namespace  http://drsr/
// @version    0.9.6
// @run-at      document-idle
// @description  Show all the large photos on a listing
// @include    /https:\/\/www\.trademe\.co\.nz\/.*\/[Ll]isting.*/
// @include    /https:\/\/www\.trademe\.co\.nz\/.*\/auction-.*/
// @include    /https:\/\/www\.trademe\.co\.nz\/a\.aspx.*/
// @include    /https:\/\/www\.trademe\.co\.nz\/[0-9]*/
// @grant      GM_addStyle
// @grant      GM_getResourceURL
// @copyright  public domain
// @require    https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js
// @require    http://cdnjs.cloudflare.com/ajax/libs/jquery.lazyload/1.9.1/jquery.lazyload.min.js
// @require    https://greasyfork.org/scripts/2723-bpopup/code/bPopup.js?version=7539
// @downloadURL https://update.greasyfork.org/scripts/1917/TradeMe%20Show%20All%20The%20Photos%20%28Tampermonkey%20only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/1917/TradeMe%20Show%20All%20The%20Photos%20%28Tampermonkey%20only%29.meta.js
// ==/UserScript==
// v0.9.3: support for new tg and gallery formats
// v0.9.2: rough support for a new lightbox format found in realestate
// v0.9: https
// v0.8: update for new listing format
// v0.7: external bPopup to comply with greasyfork rules
// v0.6: fix for new large image URLs, don't show link when there's only one photo
// v0.5: when browser window is resized or maximized, recentre and adjust number of columns
// v0.4: tweak layout, Greasemonkey 1.0
// v0.3: minor tidyup
// v0.2: compact and recenter image grid when images are smaller than max size

// TODO:
// lazy load order is strange, image#1 gets loaded last?

// replace trademe's JS error handler
window.onerror=function(msg, url, linenumber){
    console.log('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
    return true;
};

// make sure the JQuery is the one loaded by the @require
var myJQ = jQuery.noConflict();
var initialised = false;
var initialHeight = 0;
var saveTop = 0;
var resizeTimer = null;
var fullImageUrls = []
var TG_THUMB_SELECTOR = ".tm-marketplace-listing-photos__thumbnail-slider-item,.tm-listing-photos__thumbnail-slider-item";

function init() {
    if (initialised) {
        return;
    }
    initialHeight = myJQ(document).height();
    
    GM_addStyle("\
.tmsatp_hide {\
   position: absolute;\
   top: -9999px;\
   left: -9999px;\
   background-color: #000000;\
}\
.tmsatp_closebutton {\
border-radius: 12px 12px 12px 12px;\
box-shadow: none;\
font: 20px sans-serif;\
padding: 0 20px 4px;\
position: absolute;\
right: -10px;\
top: -6px;\
color: white;\
background-color: #7A0000;\
cursor: pointer;\
display: inline-block;\
text-align: center;\
text-decoration: none;\
}\
.tmsatp_closebutton:hover {\
  background-color: #9A0000;\
}\
.tmsatp_imgcell {\
	text-align:center;\
	vertical-align:middle;\
	padding: 0;\
    border: 4px solid black;\
}\
.tmsatp_largerCell {\
width:800px;\
min-width:800px;\
height:600px;\
min-height:600px;\
}\
.tmsatp_smallerCell {\
width:669px;\
min-width:669px;\
height:502px;\
min-height:502px;\
}\
.tmsatp_table {\
	border-width: 0;\
	border-spacing: 0;\
    border-collapse: collapse;\
}\
.tmsatp_lazy {\
	margin:0;\
	padding:0;\
}\
#tmsatp_spacer {\
    height: 20px;\
    clear: both;\
    background: #494949\
");
    
    myJQ("#showallthephotos").after(
        '<div id="allthephotosctr" class="tmsatp_hide">\
	<span class="tmsatp_closebutton" title="Close">x</span>\
	<div id="allthephotos"/>\
    </div>');
    myJQ("#allthephotosctr")
        .append('<div id="tmsatp_spacer"/>');
    initialised = true;
}            

var IMAGE_WIDTH_PADDING = 4;
var IMAGE_HEIGHT_PADDING = 4;
var SCROLLER_TOP_MARGIN = 20;
var SCROLLER_LEFT_MARGIN = 20;


// max image dimensions for the current category, images may be (much) smaller
function imageDimensions() {
    // TODO doesn't work with new #thumbs container because it doesn't have the data-photo-max-size attribute on the li
    if (myJQ(".tm-marketplace-listing-photos__thumbnail-slider-item")) {
        // todo scrape o-aspect-ratio?
        return {width:640, height:480, cellClass:"tmsatp_imgcell"};
    } else if (myJQ("#Photobox_OtherPhotos")) {
        // new format, calculate max of data-photo-max-size width and height
        var maxWidth = 1;
        var maxHeight = 1;
        myJQ("#Photobox_thumbs li").each(function(index, value) {
            var photoMaxSize = myJQ(value).attr("data-photo-max-size");
            if (photoMaxSize) {
                var photoWidth = 0+photoMaxSize.split(",")[0];
                var photoHeight = 0+photoMaxSize.split(",")[1];
                maxWidth = Math.max(maxWidth, photoWidth);
                maxHeight = Math.max(maxHeight, photoHeight);
            }
        });
        return {width:maxWidth, height:maxHeight, cellClass:"tmsatp_largerCell"};
    } else {
        // old format, always assume 800x600 max
        return {width:800, height:600, cellClass:"tmsatp_largerCell"};
    }
}

// calculate URL for large image from thumbnail <img>
function imageLargeUrl(img) {
    var retUrl;
    // try new photobox format first, parent LI has a data-photo-id attribute
    var imageId = myJQ(img).parent().attr("data-photo-id");
    if (imageId) {
        // TODO the "plus" image still appears to exist even if there is no zoom box, any exceptions?
        retUrl = myJQ("#Photobox_PhotoserverPlusUrlString,#PhotoserverPlusUrlString").attr("value") + imageId + ".jpg";
    } else {
        // old format
        // thumbnail link has class "lbt_nnnnn"
        imageId = myJQ(img).parent().attr("class").substring(4);

        // TODO is "photoStartIdNewDir" still used in the old-format listings? 
        // This is what TM does in their own script, comparing the current image ID to the ID where they started storing the images in a new path.
        var isNewImage = (unsafeWindow.photoStartIdNewDir ? unsafeWindow.photoStartIdNewDir > imageId : false);
        if (isNewImage) {
            retUrl = img.src.replace("/thumb", "").replace(".jpg", "_full.jpg");
        } else {
            retUrl = img.src.replace("/thumb", "/full");
        }
    }
    console.log(retUrl);
    return retUrl;
}

// Scrape images from Tangram Carousel https://tangram.nz/product/carousel into fullImageUrls
function genImagesFromTgThumb() {
    fullImageUrls = []
    // TODO this doesn't always work as one select for some reason
    var allThumbs = myJQ("tg-aspect-ratio",myJQ(TG_THUMB_SELECTOR))
    if (allThumbs) {
        allThumbs.each(function(index, value) {
            var imageUrl = myJQ(value).css("background-image").replace("/thumb/", "/full/").replace("url(\"","").replace("\")","");
            console.log("imageUrl=" + imageUrl);
            fullImageUrls.push(imageUrl);
        });
    }
    console.log(fullImageUrls);
}

// scrape images from lightbox/photobox on old-style listings into fullImageUrls
function genImagesFromLightbox() {
    fullImageUrls = []
    // Get all the lightbox thumbs
    var allImages = myJQ(".lbThumb img,#Photobox_thumbs img,#thumbs img");
    if (allImages) {
        allImages.each(function(index,value) {
            var imageUrl = imageLargeUrl(value);
            console.log("img imageUrl=" + imageUrl);
            fullImageUrls.push(imageUrl);
        });
    }
}

// scrape images from realestate gallery into fullImageUrls
function genImagesFromGallery() {
    fullImageUrls = []
    var allImages = myJQ(".tm-gallery-view__thumbnail");
    if (allImages) {
        allImages.each(function(index,value) {
            var imageUrl = value.src.replace("64x64m","plus");
            console.log("img imageUrl=" + imageUrl);
            fullImageUrls.push(imageUrl);
        });
    }
}


function renderImages() {

	var imageCount = fullImageUrls.length;
    
    var dimensions = imageDimensions();
    var padded = {width: dimensions.width + IMAGE_WIDTH_PADDING, height: dimensions.height + IMAGE_HEIGHT_PADDING};
    
	var jqWindow = myJQ(window);
    
    // TODO if the images are > 800 wide as can happen with the new format, get horizontal scrolling, is this necessarily a bad thing?
	var columns = ((jqWindow.width() > (padded.width*2 + SCROLLER_LEFT_MARGIN)) && imageCount > 2) ? 2 : 1;

    var grey_pixel = "data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
	// use a table for easy centering
	var imgTable = myJQ('<table class="tmsatp_table"/>');
	var i = 0;
	while (i<imageCount) {
		var row = myJQ("<tr/>");
		for (var col=0; col < columns; col++) {
			if (i >= imageCount) break;
            var td;
            // if last image is odd-numbered, span both columns in the last row
            if (columns === 2 && i===(imageCount-1) && (i%2===0)) {
                td = myJQ('<td/>', {class: "tmsatp_imgcell", colspan:"2"});
            } else {
                td = myJQ('<td/>', {class: "tmsatp_imgcell " + dimensions.cellClass});
            }
			td.append(myJQ("<img />", 
				  {class: "tmsatp_lazy",
				   src: grey_pixel,
				   // fixed size because we don't know image dimensions yet, see lazyLoadDone
				   width: dimensions.width,
				   height: dimensions.height,
				   "data-original": fullImageUrls[i],
				   title: "Photo " + (i+1) + " of " + imageCount
				}));
			row.append(td);
			i++;
		}
		row.appendTo(imgTable);
	}
	myJQ("#allthephotos").empty().append(imgTable);
}

function lazyLoadDone(elements_left, settings) {
	// use real image size once the real image is loaded
	myJQ(this).removeAttr("width").removeAttr("height").removeAttr("style");
    
    // remove the min-width and height from the cell so the cell will fit the image
    myJQ(this).parent().removeClass(imageDimensions().cellClass);
    
    // changing image sizes may have de-centered the table, recentre it after re-layout
    if (elements_left ===0) {
        window.setTimeout(recentre, 200);
    }
}

function addSpacer() {
    // Show the spacer at the bottom if the scroller height is greater than the document height,
    // so the last photo isn't stuck on the bottom of the window.
    var scrollerHeight = myJQ("#allthephotosctr").height();
    if (scrollerHeight > initialHeight) {
        myJQ("#tmsatp_spacer").show();
    } else {
        myJQ("#tmsatp_spacer").hide();
    }
}

function centeredPosition() {
	var $window = myJQ(window);
    return {
        // center vertically in viewport
        top: Math.max(SCROLLER_TOP_MARGIN,($window.height() - myJQ("#allthephotosctr").height()) / 2) + saveTop,
        left: Math.max(SCROLLER_LEFT_MARGIN, ($window.width() - myJQ("#allthephotosctr").width()) / 2)
    };
}    

function recentre() {
    var pos = centeredPosition();
    myJQ("#allthephotosctr").animate({top: "" + pos.top +"px", left: "" + pos.left + "px"});    
}

function startLoading() {
    myJQ("img.tmsatp_lazy").lazyload({effect : "fadeIn", container: myJQ("#allthephotos"), load: lazyLoadDone});    
}

function genImages() {
    if (myJQ(TG_THUMB_SELECTOR).length > 0) {
        genImagesFromTgThumb();
    } else if (myJQ(".tm-gallery-thumbnail-slider__item").length > 0) {
        genImagesFromGallery();
    } else {
        genImagesFromLightbox();
    }
}

function relayout() {
    genImages();
    renderImages();
    addSpacer();
    recentre();
    startLoading();
}

function showAllThePhotos() {
    init();
    saveTop = myJQ(window).scrollTop();
    genImages();
    renderImages();
    addSpacer();
    var pos = centeredPosition();
	myJQ("#allthephotosctr").bPopup({
         follow: [false, false], 
         position: [pos.left,pos.top], 
         closeClass: "tmsatp_closebutton",
        onClose: function() { 
            if (resizeTimer) clearTimeout(resizeTimer);
            myJQ(window).scrollTop(saveTop); 
        }
    });
	startLoading();
    
    // handle resize, with timer to limit repeated calls while resizing
    myJQ(window).resize(function() {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(relayout, 100);
    });
}

function addMainLink() {
    if(myJQ("#showallthephotos").length == 0) {
        // Only show "all photos" link if there's more than 1 photo
        if (myJQ(".lbThumb img,#Photobox_thumbs li,#thumbs li,.tm-gallery-thumbnail-slider__item," + TG_THUMB_SELECTOR).length > 1) {
            myJQ("#viewFullSize,#pager,#OtherPhotosContainer,.tm-marketplace-buyer-options__commerce-box,.tm-motors-buyer-options__commerce-box,.tm-gallery-view__carousel--premium,.tm-propert-gallery-view__carousel-container").after(myJQ("<a />",
        {id: "showallthephotos",
         href: "javascript:void(0)",
         title: "View all the full size photos (Tampermonkey script)",
         text: "View all photos",
         click: showAllThePhotos}))
                .after("<br />");
        }
    }
    // keep timer running even if link already added because TM repaint clears it sometimes
}


window.setInterval(addMainLink, 500);

