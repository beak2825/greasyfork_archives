// ==UserScript==
// @name        Empornium Slideshow
// @description Slideshow for all images in title page.
//              Click SLIDESHOW button at top of title page.
//              Navigation: Left/Right arrows, Esc or click outside of modal to close slideshow.
//              Features:
//                - Lazy loads current and next thumbnailed full images on next/prev navigation.
//                - Clickable to view full image
//                - Navigation hotkeys for quick and easy perusing
//                - Caches images for faster subsequent loads
//                - Excludes:
//                  - .gifs for faster performance
//                  - Title images
//                  - Very small images (if thumbnail, it will display the larger version)
//
// @namespace   Empornium Scripts
// @version     1.1.0
// @author      vandenium
// @grant       none
// ---
// @match https://*.empornium.me/torrents.php?id=*
// ---
// @match https://*.empornium.is/torrents.php?id=*
// ---
// @match https://*.empornium.sx/torrents.php?id=*

// @downloadURL https://update.greasyfork.org/scripts/428517/Empornium%20Slideshow.user.js
// @updateURL https://update.greasyfork.org/scripts/428517/Empornium%20Slideshow.meta.js
// ==/UserScript==

// Changelog:
// Version 1.1.0
//  - Enable gifs in slideshow.
// Version 1.0.6
//  - Remove global box-sizing css entry that was affecting display of items outside of this userscript.
// Version 1.0.5
//  - Fix issue of changing the shown/hidden status of sections in the torrent page
// Version 1.0.4
//  - Smarter filtering of title images
//  - Refactoring
// Version 1.0.3
//  - Don't filter out images with 'screens' and/or 'details'
// Version 1.0.2
//  - Fix keypress eventing issue.
// Version 1.0.1
//  - Fix display issue
// Version 1.0.0
//  - The initial version.
// Todo:
//  - Lazily load gifs?
//
// ==/UserScript==
let descriptionShowHideClicked = false;

const template = `
<style>
#slideshow {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  display: none;
  z-index: 100;
  top: 50%;
  
}

/* Slideshow container */
.slideshow-container {
  max-width: 1000px;
  width: 100%;
  position: relative;
  margin: auto;
}

.slideshow-image {
  /*     min-width: 800px; */
  max-height: 800px;
}

.slides {
  display: inline-block;
}

  
  .slide {
    display: block;
    width: 1024px;
    height: 768px;
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 5px;
  }

/* Next & previous buttons */
.prev,
.next {
  cursor: pointer;
  position: absolute;
  top: 50%;
  width: auto;
  margin-top: -22px;
  padding: 16px;
  color: white;
  font-weight: bold;
  font-size: 18px;
  transition: 0.6s ease;
  border-radius: 0 3px 3px 0;
  user-select: none;
}

.close {
  position: absolute;
  top: 3px;
  right: 3px;
  background-color: rgba(0, 0, 0, 0.4);
  color: white;
  border-radius: 18px;
  font-size: 19px;
  cursor: pointer;
  width: 30px;
  height: 30px;
  text-align: center;
  padding: 1px 1px;
}

.close:hover {
  background-color: rgba(0, 0, 0, 0.6);
  text-decoration: none;
  color: white;
}

.next {
  right: 0;
  border-radius: 3px 0 0 3px;
}

.prev:hover,
.next:hover {
  background-color: rgba(0, 0, 0, 0.8);
  text-decoration: none;
}

.text {
  color: #f2f2f2;
  font-size: 15px;
  padding: 8px 12px;
  position: absolute;
  bottom: 8px;
  width: 100%;
  text-align: center;
}

.numbertext {
  color: #f2f2f2;
  font-size: 15px;
  padding: 8px 12px;
  position: absolute;
  top: 0;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 3px;
}
</style>

<div class="slideshow-container" id="slideshow-container"></div>
`;

document.querySelector('body').addEventListener('click', (e) => {
  if (e.target.localName !== 'img' && e.target.innerText !== 'SLIDESHOW' && e.target.className !== 'next' && e.target.className !== 'prev') {
    document.querySelector('#slideshow').style.display = 'none';
  }
});

let slideIndex = 0;

function showSlides(n) {
  let i;
  const slides = document.querySelectorAll('.slide');
  if (n >= slides.length) {
    slideIndex = 0;
  }
  if (n < 0) {
    slideIndex = slides.length - 1;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = 'none';
  }

  // Lazy load full image of current and next slides
  const currentSlideImage = slides[slideIndex].lastChild;
  const nextSlideImage = slides[slideIndex + 1] && slides[slideIndex + 1].lastChild;

  if (currentSlideImage && currentSlideImage.srcFull) {
    currentSlideImage.onload = () => {
      currentSlideImage.style.display = 'block';

      currentSlideImage.parentNode.style.width = 'auto';
      currentSlideImage.parentNode.style.height = 'auto';
    };
    currentSlideImage.src = currentSlideImage.srcFull;

    if (nextSlideImage && nextSlideImage.srcFull) {
      nextSlideImage.onload = () => {
        nextSlideImage.style.display = 'block';
        nextSlideImage.parentNode.style.width = 'auto';
        nextSlideImage.parentNode.style.height = 'auto';
      };
      nextSlideImage.src = nextSlideImage.srcFull;
    }
  } else {
    currentSlideImage.parentNode.style.width = 'auto';
    currentSlideImage.parentNode.style.height = 'auto';
  }

  slides[slideIndex].style.display = 'block';
}

const createSlideShowButton = () => {
  const showSliderButton = document.createElement('a');
  showSliderButton.className = 'button blueButton';
  showSliderButton.innerText = 'SLIDESHOW';

  // Remove loading message.
  const loadingMessage = document.querySelector('#slideshow-loading-message');
  loadingMessage.remove();

  document
    .querySelector('.torrent_buttons .torrent_buttons')
    .appendChild(showSliderButton);
  showSliderButton.addEventListener('click', () => {
    document.querySelector('#slideshow').style.display = 'inherit';
  });
};

const createSlideShowMessage = () => {
  const showSliderButton = document.createElement('span');
  showSliderButton.id = 'slideshow-loading-message';
  showSliderButton.innerText = 'Creating Slideshow';
  const handle = window.setInterval(() => {
    showSliderButton.innerText += '.';
  }, 500);

  document
    .querySelector('.torrent_buttons .torrent_buttons')
    .appendChild(showSliderButton);
  return handle;
};

const createTemplateDOM = (str) => {
  const template = document.createElement('div');
  template.id = 'slideshow';
  template.innerHTML = str;
  return template;
};

const render = (target, renderPromise) => {
  const templateDOM = createTemplateDOM(template);
  const handle = createSlideShowMessage();

  renderPromise(templateDOM).then((updatedTemplateDOM) => {
    clearInterval(handle);
    createSlideShowButton();

    target.parentNode.insertBefore(updatedTemplateDOM, target.nextSibling);

    // Set up eventing
    const container = updatedTemplateDOM.children[1].parentNode;
    const nextButton = container.querySelector('.next');
    const previousButton = container.querySelector('.prev');
    const closeButton = container.querySelector('.close');

    nextButton.addEventListener('click', (e) => {
      showSlides((slideIndex += 1));
    });

    previousButton.addEventListener('click', (e) => {
      showSlides((slideIndex -= 1));
    });

    closeButton.addEventListener('click', (e) => {
      container.style.display = 'none';
    });

    document.onkeydown = (e) => {
      if (container.style.display !== 'none') {
        if (e.keyCode === 37) {
          e.preventDefault();
          previousButton.dispatchEvent(new Event('click'));
        }

        if (e.keyCode === 39) {
          e.preventDefault();
          nextButton.dispatchEvent(new Event('click'));
        }

        if (e.keyCode === 27) {
          e.preventDefault();
          container.style.display = 'none';
        }
      }
    };

    showSlides(slideIndex);
  });
};

const createSlide = (imgNode, n, total) => {
  const innerTemplate = `
    <div class="numbertext">${n + 1}/${total}</div>
  `;

  const templateParent = document.createElement('div');
  templateParent.className = 'slide';
  templateParent.innerHTML = innerTemplate;
  templateParent.appendChild(imgNode);
  return templateParent;
};

const openAllHiddenImages = () => new Promise((resolve, reject) => {
  window.setTimeout(() => {
    // open the Description area if it isn't already.
    const descriptionToggle = document.querySelector('#desctoggle');

    // Get visibility of description area (need to restore this)
    const descriptionIsHiddenInitially = document.querySelector('div#descbox').style.display === 'none';

    if (descriptionIsHiddenInitially) {
      descriptionToggle.dispatchEvent(new Event('click'));
      descriptionShowHideClicked = true;
    }

    // Show all hidden images within the Description area
    const showLinks = Array.from(document.querySelectorAll('div#descbox a')).filter(
      (node) => node.innerText.includes('Show')
          && node.id !== 'open_overflowquickpost',
    );
    if (showLinks.length > 0) {
      showLinks.forEach((el) => el.dispatchEvent(new Event('click')));
    }
    return resolve(true);
  }, 0);
});

const isImageTitle = (img) => img.width / img.height > 4.1 || img.src.includes('s7s-') || img.src.includes('s7s_');
const isHostedImage = (img) => img.src.includes('fapping') || img.src.includes('jerking') || img.src.includes('freeimage');
const isImageSmall = (img) => img.width * img.height < 30000;
const isThumbnail = (img) => img.src.includes('.md.') || img.src.includes('.th.');

const renderContent = (templateDOM) => new Promise((resolve, reject) => {
  openAllHiddenImages().then((links) => {
    const body = document.querySelector('.body');

    // Wait for all non-gif images to load.
    const allImages = Array.from(body.querySelectorAll('img'));
    const len = allImages.length;
    let counter = 0;

    allImages.forEach((img) => {
      if (img.complete) incrementCounter();
      else img.addEventListener('load', incrementCounter, false);
    });

    function incrementCounter() {
      counter++;
      if (counter === len) {
        // Non-thumbnailed images
        const images = Array.from(allImages).filter(
          (img) => isHostedImage(img)
              && !isThumbnail(img)
              && !isImageSmall(img)
              && !isImageTitle(img),
        );

        // Thumbnailed images.
        const thumbNailedImages = Array.from(allImages).filter(isThumbnail);

        const clonedImages = [];

        images.forEach((img) => {
          const clonedNode = img.cloneNode(true);
          clonedNode.className += ' slideshow-image';
          clonedNode.style.width = 'auto';
          clonedNode.style.height = '300';
          clonedNode.style.margin = 0;
          clonedImages.push(clonedNode);
        });

        const clonedThumbNailedImages = [];
        thumbNailedImages.forEach((img) => {
          const clonedNode = img.cloneNode(true);
          clonedNode.className += ' slideshow-image';
          clonedNode.style.width = 'auto';
          clonedNode.style.height = '300';
          clonedNode.style.margin = 0;
          clonedNode.srcFull = clonedNode.src.replace(/\.th|\.md/g, '');
          clonedNode.style.display = 'none';
          clonedThumbNailedImages.push(clonedNode);
        });

        const slides = [];
        const totalImages = clonedImages.length + clonedThumbNailedImages.length;

        clonedThumbNailedImages.forEach((clonedImage, i) => {
          slides.push(createSlide(clonedImage, i, totalImages));
        });

        clonedImages.forEach((clonedImage, i) => {
          slides.push(createSlide(clonedImage, i, totalImages));
        });

        const prevLinkButton = document.createElement('a');
        prevLinkButton.className = 'prev';
        prevLinkButton.innerText = '❮';

        const nextLinkButton = document.createElement('a');
        nextLinkButton.className = 'next';
        nextLinkButton.innerText = '❯';

        const closeButton = document.createElement('a');
        closeButton.className = 'close';
        closeButton.innerText = '✖';

        const container = templateDOM.children[1];

        container.appendChild(prevLinkButton);

        // append images
        slides.forEach((slide) => {
          container.appendChild(slide);
        });

        container.appendChild(nextLinkButton);

        container.appendChild(closeButton);

        // restore state of Description area (click it again it was clicked)
        if (descriptionShowHideClicked) {
          document.querySelector('#desctoggle').dispatchEvent(new Event('click'));
        }

        return resolve(templateDOM);
      }
    }
  });
});

const target = document.querySelectorAll('.linkbox')[2];
render(target, renderContent);
