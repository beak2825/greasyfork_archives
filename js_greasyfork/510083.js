<!-- Could conflict with some pages or be blocked by them. Transparent colors may render no effect. Refresh may be needed to take effect. Effect saves and can also be changed via Browser Local Storage darkModeValue. -->
// ==UserScript==
// @name        DarkMode_with_Slider_that_Saves
// @icon        http://www.ramonpc.com/art/r.ico
// @author      https://www.facebook.com/RamonInOrlando
// @version     1.16
// @description DarkMode with adjustable slider, that saves preferences by domain
// @match       *://*/*
// @run-at       document-end
// @supportURL  https://ramonpc.com
// @license MIT
// @namespace https://greasyfork.org/users/1372684
// @downloadURL https://update.greasyfork.org/scripts/510083/DarkMode_with_Slider_that_Saves.user.js
// @updateURL https://update.greasyfork.org/scripts/510083/DarkMode_with_Slider_that_Saves.meta.js
// ==/UserScript==







(function () {
// Thanks to ChatGTP for the assistance in this(and ChatGT Creators for making that masterpiece). Thanks to all the Sites with knowledge that helps in programming like developer.mozilla.org, stackoverflow.com, w3schools.com, etc... We can not make it without you all. I hope this script helps, RamonPC.com

  // Check if we are in the top window (not inside an iframe)
  if (window.top !== window.self) {
    return; // Exit if inside an iframe
  }

  const hostname = window.location.hostname; // Use hostname to save preferences per site

  // Create a style element for dark mode
  const style = document.createElement('style');
  style.id = 'dark-mode-style';
  document.head.appendChild(style);

  // Load the saved value from localStorage for this site or use 85% as the default
  const savedValue = localStorage.getItem(`darkModeValue_${hostname}`) || '85';

  // Function to update the dark mode filter
  function applyFilter(value) {
//alert(0);
style.textContent = `
    html {
        filter: invert(${value / 100}) !important;
      }

     /** reverse filter for media elements */
    img, video, picture, canvas, iframe, object, embed {
        filter: invert(1) !important;
      }
    `;
  }

  // Apply the saved dark mode value initially
  applyFilter(savedValue);

// Below 3lines don't work on Google and some other sites High in Scripts
// let span = document.createElement("span");
// span.innerHTML = '<b style="position:fixed;left:84px;top:-4px;">HI</b>';
// document.body.append(span);




  // Create the slider element
  const slider = document.createElement('input');
  slider.title = 'Slide to Change Page Colors';
  slider.type = 'range';
  slider.min = '1';
  slider.max = '100';
  slider.value = savedValue; // Set the slider to the saved value
  slider.style.position = 'fixed';
  slider.style.cursor = 'pointer';
  slider.style.top = '-6px';
  slider.style.left = '4px';
  slider.style.zIndex = '9999';
  slider.style.width = '80px'; // Small width
  slider.style.height = '8px'; // Small height
//  slider.id = 'sldrRPC'; ID added, should work, but not needed
  //  lines below Not don't work
//  slider.onblur = alert(0); // anything with alert will be push at the start
//    slider.onblur = (alert(0));
//  slider.onchange = ('Slider Value: '+ this.value);

// Append the slider directly to the body //  document.body.appendChild(slider); document.write
document.body.appendChild(slider);



const span = document.createElement("span");
span.type = 'span';
span.title = 'Press to Refresh if needed for Full Page Color Change';
span.style.position = 'fixed';
span.style.top = '-4px';
span.style.left = '84px';
span.style.zIndex = '9999';
span.style.width = '28px'; // Small width
span.style.height = '18px'; // Small height
span.style.fontSize = '10px';
span.borderRadius = '2px !important' ;
//span.onclick = location.reload();

span.style.cursor = 'pointer';
//span.innerText = '🔁';

document.body.appendChild(span);

//span.addEventListener('span', function () {location.reload(true)});
span.addEventListener('click', function () {
location.reload();
})

span.addEventListener('wheel', function () {
//alert(0);
slider.value = '50';
})

slider.addEventListener('wheel', function () {
//alert(0);
slider.value = '85';
})

// Update the dark mode filter based on slider value and save it to localStorage
slider.addEventListener('input', function () {
  applyFilter(slider.value);
    localStorage.setItem(`darkModeValue_${hostname}`, slider.value); // Save the value for this page
  });

  // Update the dark mode filter based on slider value
  slider.addEventListener('input', setInterval(function () {
//alert(0);
    const value = slider.value;
    style.textContent = `
      html {
        filter: invert(${value}%);
      }
  /** reverse filer for media elements */
 img, video, picture, canvas, iframe, embed {
 filter: invert(${value}%) !important;
    }
    `;
 // alert(0); Fires all the time on  setInterval( ???, 250) setTimeout() also not good

span.innerHTML = '&nbsp;<sub>' + slider.value + '🔄</sub>';

  }, 250));




//    function myRefresh() {
//alert(0);
//location.href = location.href;
//  }

})();
