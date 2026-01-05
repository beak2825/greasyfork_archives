// ==UserScript==
// @name         imgur.direct
// @namespace    imgurdir
// @version      1.0.0
// @description  Adds image direct links for imgur uploads.
// @author       Jakub Rychecký <jakub@rychecky.cz>
// @license      WTFPL 2
// @include      *imgur.com*
// @downloadURL https://update.greasyfork.org/scripts/22023/imgurdirect.user.js
// @updateURL https://update.greasyfork.org/scripts/22023/imgurdirect.meta.js
// ==/UserScript==






/*
 * Worker timeout in miliseconds, 500 ms is recommended
 * @type {Number}
 */
var timeout = 500;


/**
 * Prefix for direct link (choose http or https - https is recommended)
 * @type {String}
 */
var prefix = 'https';









/**
 * DOM initialization runs script worker which
 * @returns {undefined}
 */

$(function(){
  imgur_direct_worker(); // The first run of script worker
});





/**
 * Main script worker. Checks new images and put direct links to them. Repeats a few miliseconds again.
 * @returns {undefined}
 */

function imgur_direct_worker(){
  $('.post-image-container').each(function(){ // Every image container on imgur upload page...
    var img = $(this); // Image container itself

    if(!has_direct_link(img) && (is_image_ready(img) || is_video(img))){ // Doesn't have direct link yet and image is fully uploaded (or it's video)... 
      write_direct_link(img); // Create textarea with direct link  
    }
  });

  setTimeout(imgur_direct_worker, timeout); // Let's repeat
}





/**
 * Creates single direct link for image/video inside of its container.
 * @param {JQuery} img Image container jQuery element
 * @returns {String} Direct link to the image
 */

function get_direct_link(img){
  if(is_video(img)){ // Video direct link for videos...
    return get_direct_link_video(img); 
  }else{ // Everything else is image, let's give it image direct link... ^^
   return get_direct_link_image(img);
  }
}





/**
 * Generates direct MP4 link to video of container.
 * @param {type} img Image container jQuery element (contents video in this case)
 * @returns {unresolved}
 */

function get_direct_link_video(img){
  return img.find('meta[itemprop="contentURL"]').attr('content'); // Returns content of video meta tag   
}





/**
 * 
 * @param {type} img
 * @returns {String}
 */

function get_direct_link_image(img){
var zoom = img.find('.image .zoom, .post-image .zoom'); // Zoom element for larger images (difference way to get direct link)
  
   if(zoom.length > 0){ // If it is larger image having zoom...
      var link = zoom.attr('href'); // Link from zoom iself
   }else{ // ...smaller image with no zoom...
      var link = img.find('.image img, .post-image img').attr('src'); // Link from image iself
   }
   
   link = 'https:'+link; // Link with https:
    
   return link; // Returns link
}





/**
 * Is image ready? Is it fully uploaded yet?
 * @param {JQuery} img Image container jQuery element
 * @returns {Boolean} Is image ready?
 */

function is_image_ready(img){
  var link = get_direct_link(img); // Direct link from image

  return link.indexOf('undefined') == -1 && link.indexOf('blob') == -1; // If it DOES NOT contain 'undefined' or 'blob' strings, it's ready
}





/**
 * Checks if image container has direct link already. No need to write another one then.
 * @param {JQuery} img Image container jQuery element
 * @returns {Boolean} Has direct link already?
 */

function has_direct_link(img){
  return img.find('.direct').length > 0; // Is direct link inside image container?
}





/**
 * Writes single textarea with image direct link inside imgur page.
 * @param {JQuery} img Image container jQuery element
 * @returns {undefined}
 */

function write_direct_link(img){
   var css = { // CSS for direct link textarea
     'width': '100%',
     'background': '#2C2F34',
     'text-align': 'center',
     'font-weight': 'bold',
     'font-size': '0.8em',
     'height': '28px',
     'margin-bottom': '0px'
   };
    
   var html = $('<textarea onclick="$(this).select()">'+get_direct_link(img)+'</textarea>'); // Direct link textarea as JQuery element
    
   html.addClass('direct').css(css); // Putting class and CSS for textarea
    
   img.prepend(html); // Writes textarea
}





/**
 * Checks if content of container is video (gifv, mp4..).
 * @param {JQuery} img Image container jQuery element
 * @returns {Boolean} Is this container of video?
 */

function is_video(img){
   return img.find('.video-container').length > 0; // Video has .video-container
}