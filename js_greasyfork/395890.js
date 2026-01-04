// ==UserScript==
// @name         firstProject
// @namespace    https://up.mewf.ru/
// @version      1.01
// @description  createButtonForDownloadYoutubeVideo
// @author       Klastor
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395890/firstProject.user.js
// @updateURL https://update.greasyfork.org/scripts/395890/firstProject.meta.js
// ==/UserScript==
(function() {
        document.onreadystatechange = function(){
            if(document.readyState === 'complete'){
                let buttonLinks1 = window.document.location.href.replace("w.y", "w.ssy");
                let pictureIcon = document.createElement("img");
                let buttonText = document.createElement("p");
                let downloadButton = document.createElement("a");
                pictureIcon.src ="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGlkPSJGbGF0IiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHdpZHRoPSI1MTIiIGNsYXNzPSIiPjxnPjxyZWN0IGZpbGw9IiNmN2NjMzgiIGhlaWdodD0iMzM2IiByeD0iMzIiIHdpZHRoPSI0MTYiIHg9IjcyIiB5PSIxNTIiIGRhdGEtb3JpZ2luYWw9IiNGN0NDMzgiIGNsYXNzPSIiIGRhdGEtb2xkX2NvbG9yPSIjZjdjYzM4IiBzdHlsZT0iZmlsbDojNDI0MjQwIj48L3JlY3Q+PHBhdGggZD0ibTQ0MCAxMDR2MzA0YTMyIDMyIDAgMCAxIC0zMiAzMmgtMjU2YTMyIDMyIDAgMCAxIC0zMi0zMnYtMzUyYTMyIDMyIDAgMCAxIDMyLTMyaDIwOHoiIGZpbGw9IiNlOWVlZjIiIGRhdGEtb3JpZ2luYWw9IiNFOUVFRjIiIGNsYXNzPSIiPjwvcGF0aD48cGF0aCBkPSJtNDI0IDQ4OGgtMzY4YTMyIDMyIDAgMCAxIC0zMi0zMnYtMzIwYTMyIDMyIDAgMCAxIDMyLTMyaDk2YTMyIDMyIDAgMCAxIDMyIDMydjY0aDE3NmEzMiAzMiAwIDAgMSAzMiAzMnYyMjRhMzIgMzIgMCAwIDAgMzIgMzIiIGZpbGw9IiNmYmUzNmEiIGRhdGEtb3JpZ2luYWw9IiNGQkUzNkEiIGNsYXNzPSIiIGRhdGEtb2xkX2NvbG9yPSIjZmJlMzZhIiBzdHlsZT0iZmlsbDojNTg1ODU1Ij48L3BhdGg+PGcgZmlsbD0iI2MzYzZjNyI+PHBhdGggZD0ibTM5MiAxNjBoLTExMmE4IDggMCAwIDEgMC0xNmgxMTJhOCA4IDAgMCAxIDAgMTZ6IiBkYXRhLW9yaWdpbmFsPSIjQzNDNkM3Ij48L3BhdGg+PHBhdGggZD0ibTI4MCAxMTJoLTU2YTggOCAwIDAgMSAwLTE2aDU2YTggOCAwIDAgMSAwIDE2eiIgZGF0YS1vcmlnaW5hbD0iI0MzQzZDNyI+PC9wYXRoPjxwYXRoIGQ9Im00NDAgMTA0aC00OGEzMiAzMiAwIDAgMSAtMzItMzJ2LTQ4eiIgZGF0YS1vcmlnaW5hbD0iI0MzQzZDNyI+PC9wYXRoPjxwYXRoIGQ9Im0yNDggMTYwaC0xNmE4IDggMCAwIDEgMC0xNmgxNmE4IDggMCAwIDEgMCAxNnoiIGRhdGEtb3JpZ2luYWw9IiNDM0M2QzciPjwvcGF0aD48L2c+PHBhdGggZD0ibTE4NC44NzkgNDIzLjk5NSA1NS4yOTMtNjQuNjExLTMxLjk5OC4zNTEtMS4wNTUtOTUuOTk0LTQ3Ljk5Ny41MjggMS4wNTUgOTUuOTk0LTMxLjk5OC4zNTF6IiBmaWxsPSIjZjc5NTM5IiBkYXRhLW9yaWdpbmFsPSIjRjc5NTM5IiBjbGFzcz0iYWN0aXZlLXBhdGgiIGRhdGEtb2xkX2NvbG9yPSIjZjc5NTM5IiBzdHlsZT0iZmlsbDojRTJEN0NEIj48L3BhdGg+PC9nPiA8L3N2Zz4=";
                pictureIcon.name = "icon";
                pictureIcon.alt = "download-icon";
                pictureIcon.style.objectFit = "contain";
                pictureIcon.style.height = "24px";
                pictureIcon.style.width = "24px";
                pictureIcon.style.borderRadius = "10px";
                buttonText.innerHTML = "скачать";
                buttonText.setAttribute("style","width: 65px;float:right;text-decoration: none;font-size: 1.3rem;font-weight: 500;display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap; margin-left: 5px; padding-top: 7%; text-transform: uppercase;letter-spacing: -1px;color: #606060");
                downloadButton.href = buttonLinks1;
                downloadButton.target = "_blank";
                downloadButton.setAttribute('style', 'display: flex; flex-flow: wrap no wrap; text-decoration: none;');
                downloadButton.title = "Скачать видео";
                downloadButton.append(pictureIcon);
                downloadButton.append(buttonText);
                let parent = document.querySelector('#menu-container').insertAdjacentElement("beforeBegin", downloadButton);
                downloadButton.addEventListener('mouseover',()=>{
                    let buttonLinks2 = window.document.location.href.replace("w.y", "w.ssy");
                    downloadButton.href = buttonLinks2;
                })
    }
  }

        document.addEventListener("DOMContentLoaded", ()=>{
            setTimeout(location.reload, 5000);
});
})();