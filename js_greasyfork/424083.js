// ==UserScript==
// @name        Image onMouseHover arch.b4k
// @namespace   Zero_G@4d7d460c-0424-11eb-adc1-0242ac120002
// @description Mouse over images to view full size
// @include     *://arch.b4k.co/*/thread/*
// @version     1.4.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/424083/Image%20onMouseHover%20archb4k.user.js
// @updateURL https://update.greasyfork.org/scripts/424083/Image%20onMouseHover%20archb4k.meta.js
// ==/UserScript==

(function(){
  /** CONFIGURE SCRIPT **/
  // Set this const to false if you don't want to change the place of the image file name.
  const changePlaceOfImageFilename = true;
  
  // Set max width for image-video container (in screen percentage)
  const maxWidth = '80%';
  
  /** END CONFIGURE SCRIPT **/
  
  
  // Variable to see if mouse is over image-video container
  // prevents triggering mouseout event when an image-video is over the thumbnail
  var onContainer = false;
  var savedId; // To store last triggered event id
  
  // Create image-video containers and append them
  var imageContainer = document.createElement('div');
  var videoContainer = document.createElement('div');
  var videoTag = document.createElement('video');
  document.body.appendChild(imageContainer);
  document.body.appendChild(videoContainer);
  videoContainer.appendChild(videoTag);
  
  // Possition them a top right of current scroll
  imageContainer.style.position = 'fixed';
  imageContainer.style.top = '0em';
  imageContainer.style.right = '0em';
  videoContainer.style.position = 'fixed';
  videoContainer.style.top = '0em';
  videoContainer.style.right = '0em';
  
  // Hide containters
  imageContainer.style.visibility = 'hidden';
  videoContainer.style.visibility = 'hidden';
  
  // Prevent image-video from being bigger than screen
  imageContainer.style.height = '100%';
  imageContainer.style.width = maxWidth;
  videoContainer.style.height = '100%';
  videoContainer.style.width = maxWidth;
  videoTag.style.maxHeight = '100%';
  videoTag.style.maxWidth = '100%';
  videoTag.style.position = 'absolute';
  videoTag.style.top = '0em';
  videoTag.style.right = '0em';
  // Add event listener in case video is on top of thumb
  videoTag.addEventListener('mouseover', function() {onContainer = true;});
  videoTag.addEventListener('mouseout', function() {onContainer = false; clear(null);});
  
  // Wait for document to load
  $( document ).ready(function() {
   // Create event listeners
    const imageLinks = document.getElementsByClassName('thread_image_link');
    Array.from(imageLinks).forEach(function(element) {
      element.addEventListener('mouseover', enlargeImage, false);
      // Hide image container
      element.addEventListener('mouseout', clear, false);
    });
    
    // Change position of image name to atop of image thumb
    if(changePlaceOfImageFilename){
      const imageNameList = document.getElementsByClassName('post_file');
      Array.from(imageNameList).forEach(function(element) {
        let metadata = element.getElementsByClassName('post_file_metadata')[0];
        if(metadata){
          let filename = element.getElementsByClassName('post_file_filename')[0];
          let div = document.createElement('div');
          let span = document.createElement('span');
          let wrapper = element.parentNode;
          div.className = 'post_file';
          span.textContent = 'File: ';
          span.style.paddingLeft = '0.5em';
          metadata.textContent = ' (' + metadata.textContent + ')';
          metadata.style.fontSize = '85%';
          div.appendChild(span);
          div.appendChild(filename);
          div.appendChild(metadata);
          wrapper.insertBefore(div, wrapper.getElementsByClassName('thread_image_box')[0])
          element.innerHTML = element.innerHTML.replace(',', '');
        }
      });
    }
    
    // Attach mutation observers
    Array.from(postToObserve).forEach(function(element) {
      observer.observe(element, {childList: true, attributes: false, subtree: true});
    });
  });
  
  function enlargeImage(event){
    savedId = event.currentTarget.parentNode.parentNode.parentNode.id;
    
    if(/\.webm$/.test(event.currentTarget.href)){
      // If it's a video
      if (videoTag.src !== event.currentTarget.href){
        videoTag.src = '';
        videoTag.src = event.currentTarget.href;
      }
      videoContainer.style.visibility = 'visible';
      videoTag.play();
      videoTag.loop = true;
    }else{
      // If it's an image
      // Get post Id
      let id = event.currentTarget.parentNode.parentNode.parentNode.id;
      // Get image tag if exists
      let imgTag = imageContainer.querySelector('#i'+id);
      
      if(imgTag){
        imgTag.style.display = 'block';
      } else {
        imgTag = createImgTag(id, event.currentTarget.href);
        imageContainer.appendChild(imgTag);
      }

      imageContainer.style.visibility = 'visible';
    }
  }
  
  function clear(event){
    // Get id of event, in case it was trigger by a container mouseout, use savedId
    let id = savedId;
    if(event) id = event.currentTarget.parentNode.parentNode.parentNode.id;
    
    // Wait for image-videoContainer event mouseover (just a few ms so it executes after containers events)
    // Bind (freeze) the id in the case that it changes before execution
    setTimeout(function(id){ 
      if(!onContainer){      
        imageContainer.style.visibility = 'hidden';
        videoContainer.style.visibility = 'hidden';
        
        // Hide imgTag
        let imgTag = imageContainer.querySelector('#i'+id);
        if(imgTag) imgTag.style.display = 'none';

        // Stop video
        videoTag.pause();
        videoTag.currentTime = 0;
      }
    }.bind(this, id), 1);
  }
  
  function createImgTag(id, src){
    var imgTag = document.createElement('img');
    imgTag.style.maxHeight = '100%';
    imgTag.style.maxWidth = '100%';
    imgTag.style.display = 'block';
    imgTag.style.position = 'absolute';
    imgTag.style.top = '0em';
    imgTag.style.right = '0em';
    imgTag.id = 'i' + id;
    imgTag.src = src;
    
    // Add event listener in case image is on top of thumb
    imgTag.addEventListener('mouseover', function() {onContainer = true;});  
    imgTag.addEventListener('mouseout', function() {onContainer = false; clear(null);});
    
    return imgTag;
  }
  
  // Support for inline quotes (https://greasyfork.org/en/scripts/424112-inline-quote-links-arch-b4k-co)
  // Add mutation observers to all posts, then when an inline is detected add event listeners to image link
  var postToObserve = document.getElementsByClassName('text');
  const observer = new MutationObserver(function(mutationsList, observer){
    for(const mutation of mutationsList) {
      if(typeof(mutation.addedNodes[0]) != "undefined" && typeof(mutation.addedNodes[0].id) != "undefined"){
        if(mutation.addedNodes[0].id.includes('inline')){
          let imageLink = mutation.addedNodes[0].querySelector('.thread_image_link');

          if (imageLink){
            imageLink.addEventListener('mouseover', enlargeImage, false);
            imageLink.addEventListener('mouseout', clear, false);
          }
        }
      }
    }
  });
})()