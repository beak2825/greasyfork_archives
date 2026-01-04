// ==UserScript==
// @name        redditHide
// @namespace   Violentmonkey Scripts
// @match       https://old.reddit.com/*
// @grant       none
// @version     1.0
// @author      minnie
// @description quickly hide your reddit page
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/476519/redditHide.user.js
// @updateURL https://update.greasyfork.org/scripts/476519/redditHide.meta.js
// ==/UserScript==



// icon
const header = document.querySelector('ul.tabmenu');
const icon = document.createElement('div');
icon.classList.add('eyeIcon');
icon.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20" x="0" y="0" viewBox="0 0 128 128" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path d="m79.891 65.078 7.27-7.27C87.69 59.787 88 61.856 88 64c0 13.234-10.766 24-24 24-2.144 0-4.213-.31-6.192-.839l7.27-7.27a15.929 15.929 0 0 0 14.813-14.813zm47.605-3.021c-.492-.885-7.47-13.112-21.11-23.474l-5.821 5.821c9.946 7.313 16.248 15.842 18.729 19.602C114.553 71.225 95.955 96 64 96c-4.792 0-9.248-.613-13.441-1.591l-6.573 6.573C50.029 102.835 56.671 104 64 104c41.873 0 62.633-36.504 63.496-38.057a3.997 3.997 0 0 0 0-3.886zm-16.668-39.229-88 88C22.047 111.609 21.023 112 20 112s-2.047-.391-2.828-1.172a3.997 3.997 0 0 1 0-5.656l11.196-11.196C10.268 83.049 1.071 66.964.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24c10.827 0 20.205 2.47 28.222 6.122l12.95-12.95c1.563-1.563 4.094-1.563 5.656 0s1.563 4.094 0 5.656zM34.333 88.011 44.46 77.884C41.663 73.96 40 69.175 40 64c0-13.234 10.766-24 24-24 5.175 0 9.96 1.663 13.884 4.459l8.189-8.189C79.603 33.679 72.251 32 64 32 32.045 32 13.447 56.775 8.707 63.994c3.01 4.562 11.662 16.11 25.626 24.017zm15.934-15.935 21.809-21.809C69.697 48.862 66.958 48 64 48c-8.822 0-16 7.178-16 16 0 2.958.862 5.697 2.267 8.076z" fill="#000000" opacity="1" data-original="#000000" class=""></path></g></svg>
`;
icon.style.cssText = `
`;
document.body.appendChild(icon);



// click icon
let link;
let display = 'none';

icon.addEventListener('click', function () {
    const backdrop = document.querySelector('.hidePageBlur');
    genLink();
    console.log(link);
    if(display === 'none') {
      backdrop.style.display = 'block';
      icon.classList.toggle('glow');
      display = 'block';
      console.log('hide');
      opacity();
      // check.classList.remove('hidden');
    } else if(display === 'block') {
        backdrop.style.display = 'none';
        icon.classList.toggle('glow');
        display = 'none';
        console.log('unhide');
        opacity();
        // check.classList.add('hidden');
    }


});

// cover screen
const blur = document.createElement('div');
blur.classList.add('hidePageBlur');
document.body.appendChild(blur);


// add opacity class
function opacity() {

  if (icon.classList.contains('opacity')) {
    icon.classList.remove('opacity');
  } else {
    icon.classList.add('opacity');
  }

}

// animal pics
const catPics = {
  p1: 'https://i.pinimg.com/564x/b6/b6/37/b6b637b564da5a2a4943bd8eb3ea8c25.jpg',
  p2: 'https://i.pinimg.com/736x/cd/d1/3e/cdd13e6c2a2373eba4920edac7153afb.jpg',
  p3: 'https://i.pinimg.com/736x/31/7d/32/317d32b6794b2b82a2e52176bd531eb3.jpg',
  p4: 'https://i.pinimg.com/736x/f2/d9/f9/f2d9f96a1587df7405d168813cada07d.jpg',
  p5: 'https://i.pinimg.com/564x/5a/f8/bd/5af8bd5e6cacbbf58071f65d79ec72c6.jpg',
  p6: 'https://i.pinimg.com/originals/98/29/c9/9829c9876645beb61cef8ac0ed15d36d.jpg',
  p7: 'https://i.pinimg.com/474x/6c/67/69/6c676950c8a3b53e568614ac24cc8e82.jpg',
  p8: 'https://i.pinimg.com/736x/5e/54/fa/5e54facb9b42cbc15b817a6046d8b1a5.jpg',
  p9: 'https://i.pinimg.com/736x/b5/8a/7b/b58a7b25da4c905d216c20f3995c3e12.jpg',
  p10: 'https://i.pinimg.com/736x/e3/88/32/e388320aff0c2a3a7a454ff8f667d712.jpg',
  p11: 'https://i.pinimg.com/736x/cb/31/7d/cb317dab0083d2e693e8e491f95baac7.jpg',
  p12: 'https://i.pinimg.com/736x/1f/4e/b5/1f4eb549d2946b72ff8ab4a81135abcc.jpg',
  p13: 'https://pbs.twimg.com/media/Ff6bOKJXkAIWxZl.png',
  p14: 'https://i.pinimg.com/736x/71/ee/0a/71ee0aa7ef5fdbf20250c7db2ce27eed.jpg',
  p15: 'https://i.pinimg.com/736x/05/cc/c3/05ccc3f1053723914313fe237da2b23d.jpg',
  p16: 'https://i.pinimg.com/736x/fd/9e/cf/fd9ecfba1210f7cc8101e4e2b353ea21.jpg',
  p17: 'https://i.pinimg.com/736x/91/b9/44/91b944d0ad2156a0d02c60eb86200785.jpg',
  p18: 'https://i.pinimg.com/564x/65/da/88/65da881793ac970ff1a1188157414dff.jpg',
  p19: 'https://i.pinimg.com/736x/7c/8b/b5/7c8bb56bed2301c7de4fcf9e75a44f23.jpg',
  p20: 'https://i.pinimg.com/736x/b7/cd/a6/b7cda6da9ba83025479f6bd5675888e1.jpg'
}

function genLink() {
// convert object values to an array
const urlsArray = Object.values(catPics);

// gen a random index
const randomIndex = Math.floor(Math.random() * urlsArray.length);

// Get a random URL and store it in the 'link' variable
link = urlsArray[randomIndex];

blur.innerHTML = `
<div class="catCont">
 <img src="${link}">
</div>
`
}



// styles
const style = document.createElement('style');
style.textContent = `

  .glow {
    filter: invert(100%);
  }

  .eyeIcon {
    position: fixed;
    display: inline-block;
    margin-left: 3px;
    top: 10px;
    right: 10px;
    z-index: 9999;
    cursor: pointer;
    transition: transform 0.3s ease;
  }

  .eyeIcon:hover {
    transform: scale(1.3);
  }

  .eyeIcon:active {
    transform: scale(1);
  }

  .hidePageBlur {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8); /* Semi-transparent background */
    backdrop-filter: blur(50px);
    z-index: 9998;
    display: none;

  }

  .catCont {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }


  .catCont img {
    max-width: 600px;
    height: auto;
  }

  .checkboxDiv {
    display: flex;
    flex-direction: column;
    align-items: end;
    margin-top: 5px;
  }

  .checkBoxCat {
     color: white;
     display: none;
     z-index: 9999;
     position: fixed;
    display: inline-block;
    margin-left: 3px;
    top: 30px;
    right: 10px;
  }

  .opacity {
    opacity: .5;
  }

  .hidden {
    opacity: 0;
  }

`;
document.head.appendChild(style);