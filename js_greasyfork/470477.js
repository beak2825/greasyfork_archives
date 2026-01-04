// ==UserScript==
// @name           Enhanced Scrolling
// @namespace      https://twitter.com/simeonleni
// @description    Enhance your browsing experience with a customized scrollbar style on any website.
// @run-at         document-end
// @match          *://*/*
// @grant          GM_addStyle
// @version        1.0
// @downloadURL https://update.greasyfork.org/scripts/470477/Enhanced%20Scrolling.user.js
// @updateURL https://update.greasyfork.org/scripts/470477/Enhanced%20Scrolling.meta.js
// ==/UserScript==

(function() {

  var scrollTop = 0;
  var backgroundColor = window.getComputedStyle(document.body).getPropertyValue('background-color');

  var scrollbar = `
    ::-webkit-scrollbar {
      width: 10px;
      border-radius: 0px;
    }

    ::-webkit-scrollbar-track {
      background-color: transparent;

    }

    ::-webkit-scrollbar-thumb {
      border-radius: 6px;
      background-color: #72727278;
      border: 4px solid ${backgroundColor};
    }

     ::-webkit-scrollbar-thumb:hover {
      border: 3px solid ${backgroundColor};
      background-color: #727272d1:
    }

    ::-webkit-scrollbar-corner {
      background-color: #f5f5f5;
    }
  `;


  function handleMouseDown(event) {
    if (event.clientX > window.innerWidth - 200) { // Adjust the drag area width as needed
      event.preventDefault(); // Prevent text selection
      event.stopPropagation(); // Prevent event bubbling
      scrollTop = event.clientY;
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.documentElement.style.setProperty('--scrollbar-opacity', '1'); // Set the scrollbar opacity to 1 (fully opaque)
    }
  }

  // Event listener for mouse move event while dragging
  function handleMouseMove(event) {
    var deltaY = event.clientY - scrollTop;
    window.scrollBy(0, deltaY);
    scrollTop = event.clientY;
  }

  // Event listener for mouse up event
  function handleMouseUp() {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.documentElement.style.setProperty('--scrollbar-opacity', '0'); // Set the scrollbar opacity to 0 (fully transparent)
  }

  // Event listener for wheel event to enable mouse scroll
  function handleWheel(event) {
    window.scrollBy(0, event.deltaY);
    event.preventDefault(); // Prevent default scroll behavior
  }

  // Add event listeners
  document.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('wheel', handleWheel);

  GM_addStyle(scrollbar);
})();
