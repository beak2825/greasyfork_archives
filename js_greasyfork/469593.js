// ==UserScript==
// @name            iftv plugin, button to remove sections(streaming, ads, photo sharing...)
// @namespace       bluebug
// @version         0.0.10
// @match           https://www.iyf.tv/
// @icon            https://www.iyf.tv/favicon.ico
// @run-at          document-end
// @description     remove ads in iyf webpage
// @require         https://code.jquery.com/jquery-3.6.0.min.js
// @license         MIT License
// @downloadURL https://update.greasyfork.org/scripts/469593/iftv%20plugin%2C%20button%20to%20remove%20sections%28streaming%2C%20ads%2C%20photo%20sharing%29.user.js
// @updateURL https://update.greasyfork.org/scripts/469593/iftv%20plugin%2C%20button%20to%20remove%20sections%28streaming%2C%20ads%2C%20photo%20sharing%29.meta.js
// ==/UserScript==
(function () {
  'use strict';

  setTimeout(() => {
    function remove() {
      const ads = document.querySelectorAll('body > div > div.share-top > app-index > div > :not(app-classified-top-videos)');
      ads.forEach(child => child.remove());

      const res = setInterval(() => {
        if (ads.length) {
          console.log("inside setInterval");
          remove();
          clearInterval(res);
        }
      }, 1000);
    }

    remove();

    const userBlock = document.querySelector('div.box.justify-content-end');

    if (userBlock) {
      const newButton = document.createElement('button');
      newButton.innerText = 'remove ads';
      newButton.style.padding = '10px 20px';
      newButton.style.borderRadius = '5px';
      newButton.style.backgroundColor = '#007bff';
      newButton.style.color = '#fff';
      newButton.style.border = 'none';
      newButton.style.cursor = 'pointer';
      newButton.style.fontSize = '14px';

      newButton.addEventListener('click', function () {
        console.log("clicked");
        remove();
      });

      userBlock.insertAdjacentElement('afterend', newButton);
    } else {
      console.warn('未找到 userBlock 元素');
    }
  }, 2000);
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5kZXYudXNlci5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL21haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiXG5cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgLy8gYXV0by1yZWNvbW1lbmQtbmV3cyByZW1vdmVkXG4gIGNvbnN0IHRhZyA9IGRvY3VtZW50XG4gICAgICAucXVlcnlTZWxlY3RvckFsbChcImJvZHkgPiBkaXYgPiBhcHAtc2hhcmVkLXRvcG5hdiA+IGFwcC1pbmRleCA+IGRpdiA+IGFwcC1yZWNvbW1lbmRlZC1uZXdzXCIpO1xuICAvLyByZW1vdmUgdGhlIHRhZ1xuICB0YWc/LmZvckVhY2goKGUpID0+IGUucmVtb3ZlKCkpO1xuXG4gIC8vIHJlbXZvZSBieSBpZCBvZiB0b3BWaWRlb05ld3NcbiAgY29uc3QgdG9wVmlkZW9OZXdzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI3RvcFZpZGVvTmV3cycpO1xuICB0b3BWaWRlb05ld3M/LmZvckVhY2goKGUpID0+IGUucmVtb3ZlKCkpO1xuXG4gIGNvbnN0IGFub3RoZXJPbmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5ID4gZGl2ID4gYXBwLXNoYXJlZC10b3BuYXYgPiBhcHAtaW5kZXggPiBkaXYgPiBkaXYnKTtcbiAgYW5vdGhlck9uZT8ucmVtb3ZlKCk7XG59KSgpOyJdLCJuYW1lcyI6WyJ0YWciLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJmb3JFYWNoIiwiZSIsInJlbW92ZSIsInRvcFZpZGVvTmV3cyIsImFub3RoZXJPbmUiLCJxdWVyeVNlbGVjdG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7RUFFQSxDQUFDLFlBQVk7O0VBRVg7RUFDQSxFQUFBLE1BQU1BLEdBQUcsR0FBR0MsUUFBUSxDQUNmQyxnQkFBZ0IsQ0FBQyx5RUFBeUUsQ0FBQyxDQUFBO0VBQ2hHO0VBQ0FGLEVBQUFBLEdBQUcsS0FBSEEsSUFBQUEsSUFBQUEsR0FBRyxLQUFIQSxLQUFBQSxDQUFBQSxHQUFBQSxLQUFBQSxDQUFBQSxHQUFBQSxHQUFHLENBQUVHLE9BQU8sQ0FBRUMsQ0FBQyxJQUFLQSxDQUFDLENBQUNDLE1BQU0sRUFBRSxDQUFDLENBQUE7O0VBRS9CO0VBQ0EsRUFBQSxNQUFNQyxZQUFZLEdBQUdMLFFBQVEsQ0FBQ0MsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLENBQUE7RUFDL0RJLEVBQUFBLFlBQVksS0FBWkEsSUFBQUEsSUFBQUEsWUFBWSxLQUFaQSxLQUFBQSxDQUFBQSxHQUFBQSxLQUFBQSxDQUFBQSxHQUFBQSxZQUFZLENBQUVILE9BQU8sQ0FBRUMsQ0FBQyxJQUFLQSxDQUFDLENBQUNDLE1BQU0sRUFBRSxDQUFDLENBQUE7RUFFeEMsRUFBQSxNQUFNRSxVQUFVLEdBQUdOLFFBQVEsQ0FBQ08sYUFBYSxDQUFDLHdEQUF3RCxDQUFDLENBQUE7RUFDbkdELEVBQUFBLFVBQVUsYUFBVkEsVUFBVSxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFWQSxVQUFVLENBQUVGLE1BQU0sRUFBRSxDQUFBO0VBQ3RCLENBQUMsR0FBRzs7Ozs7OyJ9
