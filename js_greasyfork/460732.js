// ==UserScript==
// @name         subscene preview Image
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Show image preview next to the titles by hovering the mouse.
// @author       dr.bobo0
// @match        https://subscene.com/u/*/subtitles*
// @icon         data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwEHAQkIAQgKCgkLDRYPDQEMDRsUFQQWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Kzc3Kzc3Nzc3Nzc3Nys3Nzc3Nzc3Kzc3NzcrNys3Nzc3Nzc3Nzc3Nzc3Nzc3Nys3N//AABEIABAAEAMBIgACEQEDEQH/xAAWAAEBAQAAAAAAAAAAAAAAAAAFBAL/xAAqEAAABAQEBAcAAAAAAAAAAAABAgMRBAUGBwATITEIQVFxEhQXGCIjMv/EABQBAQAAAAAAAAAAAAAAAAAAAAX/xAAXEQADAQAAAAAAAAAAAAAAAAABAhIA/9oADAMBAAIRAxEAPwA6ioCxs04oPLXuAD/ScyFsTKCmE7VD8kEwag+u3TB1Sp0lD8QyyNKS9aX5bAeyiqnjGEM2rDzDpvjMjX4WE7hH92JIrJMQQTrOFMAHlZ+RmHdu+KK2n1BTy7cMe3OedOGhiIeqkQ2bOhB/kZu+ECTWMVRG/9k=
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460732/subscene%20preview%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/460732/subscene%20preview%20Image.meta.js
// ==/UserScript==
document.querySelectorAll('a').forEach(link => {
  link.addEventListener("mouseover", function(event) {
    let previewContainer = document.createElement("div");
    previewContainer.style.position = "fixed";
    previewContainer.style.display = "none";
    previewContainer.style.transition = "opacity 0.1s ease-in-out";
    previewContainer.style.opacity = 0;
    previewContainer.style.width = "154px";
    previewContainer.style.height = "231px";
    previewContainer.style.overflow = "hidden";
    document.body.appendChild(previewContainer);

    var url = this.href;
    var cachedImage = localStorage.getItem(url);

    if (cachedImage) {
      previewContainer.innerHTML = `<img style="width: 100%; height: 100%; border-radius: 8px;" src="${cachedImage}"/>`;
      document.addEventListener("mousemove", function (event) {
        previewContainer.style.top = event.clientY + 20 + "px";
        previewContainer.style.left = event.clientX + 20 + "px";

        // check if preview div is too close to the edge of the screen
        if (event.clientX + previewContainer.offsetWidth + 20 > window.innerWidth) {
          previewContainer.style.left = window.innerWidth - previewContainer.offsetWidth - 20 + "px";
        }
        if (event.clientY + previewContainer.offsetHeight + 20 > window.innerHeight) {
          previewContainer.style.top = window.innerHeight - previewContainer.offsetHeight - 20 + "px";
        }
      });
      previewContainer.style.display = "block";
      setTimeout(function () {
        previewContainer.style.opacity = 1;
      }, 0);
    } else {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.responseType = "document";

      xhr.onload = function() {
        let preview = xhr.response.querySelector(".poster a img");
        previewContainer.innerHTML = `<img style="width: 100%; height: 100%; border-radius: 8px;" src="${preview.getAttribute("src")}"/>`;
        localStorage.setItem(url, preview.getAttribute("src"));
      };

      document.addEventListener("mousemove", function (event) {
        previewContainer.style.top = event.clientY + 20 + "px";
        previewContainer.style.left = event.clientX + 20 + "px";

        // check if preview div is too close to the edge of the screen
        if (event.clientX + previewContainer.offsetWidth + 20 > window.innerWidth) {
          previewContainer.style.left = window.innerWidth - previewContainer.offsetWidth - 20 + "px";
        }
        if (event.clientY + previewContainer.offsetHeight + 20 > window.innerHeight) {
          previewContainer.style.top = window.innerHeight - previewContainer.offsetHeight - 20 + "px";
        }
      });

      xhr.send();
      previewContainer.style.display = "block";
      setTimeout(function () {
        previewContainer.style.opacity = 1;
      }, 0);
    }

    link.addEventListener("mouseout", function() {
      previewContainer.style.opacity = 0;
      document.removeEventListener("mousemove", function (event) {});
      setTimeout(function () {
        previewContainer.style.display = "none";
        previewContainer.remove();
      }, 300);
    });
  });
});
