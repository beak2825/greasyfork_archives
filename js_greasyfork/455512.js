// ==UserScript==
// @name      Dreamwidth: Copy links of uploaded images
// @description adds two buttons to the dw gallery image upload page to copy links of all images at once
// @namespace fangirlishness
// @author    fangirlishness
// @include   https://www.dreamwidth.org/file/new
// @version   1.1
// @grant     none
// @icon      data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACqklEQVR42mNgQAOvsrJ43iXm59zxjVx9wc7n6Bkr96NXHP3nPgpOCGAgBD6llqRecw3+tF1O5/9ybqn/S9jF4HiNoPz/AzoWp3cq6Gpg1fwuMW/2ET2b/wuYhf4v45D4v0ZA/t1qPrlDqwUVdmwQUT4O5P9bxikJFFf4u05YJQZVc0Juzw4Fvf8LmARBCt4u4RBPnclgzIqsZq2IvOQ6YaV1QPwfjAWVbMASn7PLtS/Z+/5fxCL8fxmX1JGZDJJc+Ly5VlhpD8iAtSJK98ACL6MzNmySVAc5fQdM0c+CmpDbPpFbL9r5bLnqGoDi3PUCCgJAAz5AXKIcz3DVJfAf0Mn/9zMwsIAU/K/qiDmgZf5/PqMA2EsgDFTcgWzIEjbRirVCiv/XiygfYjhr6f5/HgP/XbDm+nq2y45+QE0Cs1cxaLHNV1DgOKhtMXWtsOL/NULySTADjhvZaQI1A2NG4SvDWSt3oPMFToEkzti6S24QV+1H9/dRA9v/i9lEb8P4//Pq5bbKaP9fAYxqhmuuQZ+Xckm8AknUMzAwreKXcwX5E9mAO96Rr0HpAsb/ml1qtF1OF5RW/gEDMTN+i7QmXHIJgxDfHAY+IWQDbnuF/1jKKfEckWbyO9aLKv9fySd7AiwA9PfFmQwc+7FF29eM0qSDWhb/pzOwLQA7P6ue54Kt15/FrCL/1wkphoIVvY3O5dskofZ/p7L+wq85ZVLAwGR6nVTG+zExv+68jef/GQycr1bxSIiC1L6Jz14CtPn/Cl65Yyg2nTFOYwWGxfTNUhqvj+rb/j9qYPd/vZgKUDP7epiaDymFq0ExsoRD4jQovLCmtOWcUrJLOcSi5zPwpy5mF1UBif0urnMF5sanoIBcxiHexkAK+JJVanDawqVvGbd4/1J2MSV0eQD44Q/O5FK6CQAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/455512/Dreamwidth%3A%20Copy%20links%20of%20uploaded%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/455512/Dreamwidth%3A%20Copy%20links%20of%20uploaded%20images.meta.js
// ==/UserScript==

// helper function to flash the clicked button (visual user feedback)
function flash(elem) {
    elem.animate(
      [ { opacity: 1 },
        { opacity: 0.4 },
        { opacity: 1 } 
      ], 400);
} 

(function() {
  // find the upload button (it's invisible at first, but present) and get its parent div
  var parentElement = document.getElementsByName('upload')[0].parentElement;
  
  // define two buttons
  var copyButton = document.createElement('a');
  copyButton.textContent = 'Get All Image Codes';
  copyButton.style.cursor = 'pointer';
  copyButton.style.margin = '0px 10px 0px 10px';
  copyButton.id = 'copycodes';
  copyButton.classList.add('submit'); // doesnt submit the form, only does button styling

  var copyImageLinkOnlyButton = document.createElement('a');
  copyImageLinkOnlyButton.textContent = 'Get 800x800 Image Tags';
  copyImageLinkOnlyButton.style.cursor = 'pointer';
  copyImageLinkOnlyButton.style.margin = '0px 10px 0px 10px';
  copyImageLinkOnlyButton.id = 'copycodes';
  copyImageLinkOnlyButton.classList.add('submit'); // button styling

  //add both buttons to the right of the upload button
  parentElement.nextElementSibling.appendChild(copyButton)
  parentElement.nextElementSibling.appendChild(copyImageLinkOnlyButton);
 
  //add functionality to first button - copy the whole content of Image Code fields 
  copyButton.addEventListener('click', function () {
    flash(this);
    
    var linkElements = document.getElementsByName('generated-code'); // get all codes
    var linkText = '';

    for (const elem of linkElements) {
      linkText += elem.value + '\n\n';
    }
    // console.log(linkText);
    navigator.clipboard.writeText(linkText);
  });
  
  //add functionality to second button - copy only the image link of Image Code fields and change size to 800x800
  copyImageLinkOnlyButton.addEventListener('click', function () {
    flash(this);

    var linkElements = document.getElementsByName('generated-code'); 
    var linkText = '';
    var parser = new DOMParser();

    for (const elem of linkElements) {
      if(elem.value.length > 0) {
        var currentElement = parser.parseFromString(elem.value, 'text/xml'); // parse out img tag and change size
        var imgTag = currentElement.getElementsByTagName('img')[0];
        linkText += imgTag.outerHTML.replace('100x100', '800x800') + '\n\n';
      }
    }
    // console.log(linkText);
    navigator.clipboard.writeText(linkText);
  });

})();