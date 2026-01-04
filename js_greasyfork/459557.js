// ==UserScript==
// @name         erai-raws preview Image
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Show image preview next to the anime titles by hovering the mouse.
// @author       dr.bobo0
// @match        https://www.erai-raws.info/
// @match        https://www.erai-raws.info/anime-list/
// @match        https://www.erai-raws.info/latest-releases/*
// @match        https://www.erai-raws.info/subtitles/*
// @match        https://www.erai-raws.info/batches/*
// @match        https://www.erai-raws.info/specials/*
// @match        https://www.erai-raws.info/encodes/*
// @match        https://www.erai-raws.info/release-schedule/
// @match        https://www.erai-raws.info/release-schedule-v2/
// @match        https://www.erai-raws.info/my-anime-list/
// @match        https://www.erai-raws.info/episodes/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAMFBMVEVHcEy3ISG3ISG3ISG3ISG3ISG3ISG3ISG3ISG3ISG3ISG3ISG3ISG3ISG3ISG3ISFbcynrAAAAD3RSTlMA1OaywnKHOhgNXPQmnEsN6GgJAAACVUlEQVRYhe1WSYKEIAyUfZf//3YgLAbEbpzrTJ1EKbJVIsfxj78Ck/BLqj4lI9TF6Ci3r8mW0YjBX7EliTeIbfo5sAkPQQaWHjbp6qKTYH07NEa6x5eNzawuB6YzfHIghi1+qBmztXI21UBleqRbtVRAD7qtxRXOnhZ49h1tbXS6K4NUejmtc0DnJv04UgU8XvvAgtVPuxcQ2dvfKh/AS/2F8otjjLJCJlh//9bRdZBbiBLCawBKcoc+fdI1OiJD5sbit854ELa2gbpx57lgx7UwtRh70FHCGcdNTa3y2mh/ZsHOiTiRIcrkCVkUzZ3i1xW5mgRz2G7IsavwtTNc8JAYhghkWPUWdkHhY8EssTWxw0wiOI0t72RWfIqKqWPF97gONfiF4o2ATIkbP2u+vyh8oo4nnPe6B5TR4v8HZak7HzhV6xqK9KHhPGwYXjFsUqxl6V0NUedKOGxA0aGkKQPu3nhnc9HAbiQ6mK9YEmQV/xUjCOTKb5mvQyPMMyhb5d0GPLXyatHkivXCsAFAmcQQF9gjUsB/toudmWk7zqGpVqAu02So9Mlhk3cLaD3je+uz7kpgmM3FveD13+HQIKEQta0CpuUzYUKtx+3saJ13IMD8P8sldUtmw/A7b1cRUGgEh8dKLuFF4GkApznUX9GLlrMgn6hP4Kjcdq32j4BZ1qxCNO/4YpQ7/Z6EEaUA1/ptElABLofeJIHMdVPvkgAJHFrc4J78CjUmsPvE1tvvoPF+I5OlHbauKmol3JLWuHWAnxNQ3jJKw+ZdybLXN/t//HX8ACejMFAROu21AAAAAElFTkSuQmCC
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459557/erai-raws%20preview%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/459557/erai-raws%20preview%20Image.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Method 1: Block images with the .preview-image class using CSS
    const style = document.createElement('style');
    style.textContent = `
        .preview-image {
            display: none !important;
        }
    `;
    document.head.appendChild(style);

    // Part 1: Notification Popup

    function showPopup() {
        // Create the dark overlay
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
        overlay.style.zIndex = '9998';
        overlay.style.backdropFilter = 'blur(5px)';

        // Create the pop-up container
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.width = '600px';
        popup.style.padding = '30px';
        popup.style.backgroundColor = '#1a1a1a';
        popup.style.color = '#ffffff';
        popup.style.border = '1px solid #333';
        popup.style.borderRadius = '15px';
        popup.style.boxShadow = '0 0 30px rgba(0,0,0,0.7)';
        popup.style.zIndex = '9999';
        popup.style.textAlign = 'center';

        // Add an image to the pop-up
        const img = document.createElement('img');
        img.src = 'https://i.imgur.com/ItdkLgt.png';
        img.style.width = '100%';
        img.style.height = 'auto';
        img.style.marginBottom = '30px';
        img.style.borderRadius = '10px';
        popup.appendChild(img);

        // Add the anime title and message
        const title = document.createElement('p');
        title.textContent = 'Enhance Erai-raws with Image Previews!';
        title.style.marginBottom = '15px';
        title.style.fontSize = '28px';
        title.style.fontWeight = 'bold';
        title.style.color = '#ff9900';
        popup.appendChild(title);

        const message = document.createElement('p');
        message.textContent = "Hey! I've created a new script. Take a look ☝️, and if you like it, feel free to install it. Thank you so much for all your support!  ⚠️ Also, preview image has now been officially added to the site. You can use the official one, but if you prefer this one , you can still use the current one. However, doing so will disable the native preview image on the site.";
        message.style.marginBottom = '25px';
        message.style.fontSize = '18px';
        message.style.lineHeight = '1.6';
        message.style.color = '#cccccc';
        popup.appendChild(message);

        // Add a link to the new script
        const link = document.createElement('a');
        link.href = 'https://greasyfork.org/en/scripts/506193-erai-raws-image-previews-next-to-anime-titles';
        link.textContent = 'Install New Script';
        link.style.display = 'inline-block';
        link.style.color = '#4CAF50';
        link.style.textDecoration = 'none';
        link.style.marginBottom = '25px';
        link.style.fontSize = '20px';
        link.style.fontWeight = 'bold';
        link.style.padding = '10px 20px';
        link.style.border = '2px solid #4CAF50';
        link.style.borderRadius = '5px';
        link.style.transition = 'all 0.3s ease';
        link.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#4CAF50';
            this.style.color = '#ffffff';
        });
        link.addEventListener('mouseout', function() {
            this.style.backgroundColor = 'transparent';
            this.style.color = '#4CAF50';
        });
        popup.appendChild(link);

        // Add a checkbox to never show the popup again
        const checkboxLabel = document.createElement('label');
        checkboxLabel.style.display = 'block';
        checkboxLabel.style.marginBottom = '20px';
        checkboxLabel.style.fontSize = '16px';
        checkboxLabel.style.cursor = 'pointer';
        checkboxLabel.style.color = '#999999';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.style.marginRight = '10px';
        checkbox.style.transform = 'scale(1.5)';
        checkboxLabel.appendChild(checkbox);
        checkboxLabel.appendChild(document.createTextNode('Never show this again'));
        popup.appendChild(checkboxLabel);

        // Add a dismiss button
        const dismissButton = document.createElement('button');
        dismissButton.textContent = 'Dismiss';
        dismissButton.style.padding = '12px 24px';
        dismissButton.style.backgroundColor = '#333333';
        dismissButton.style.color = '#ffffff';
        dismissButton.style.border = 'none';
        dismissButton.style.borderRadius = '5px';
        dismissButton.style.cursor = 'pointer';
        dismissButton.style.fontSize = '18px';
        dismissButton.style.transition = 'all 0.3s ease';
        dismissButton.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#555555';
        });
        dismissButton.addEventListener('mouseout', function() {
            this.style.backgroundColor = '#333333';
        });
        dismissButton.addEventListener('click', function() {
            if (checkbox.checked) {
                localStorage.setItem('popupNeverShow', 'true');
                notificationButton.remove();
            } else {
                // Change the notification button background color to gray
                notificationButton.style.backgroundColor = '#333333';
                localStorage.setItem('popupButtonColor', '#333333');
            }
            overlay.remove();
            popup.remove();
        });
        popup.appendChild(dismissButton);

        // Append the overlay and pop-up to the body
        document.body.appendChild(overlay);
        document.body.appendChild(popup);
    }

    // Create the notification button
    const notificationButton = document.createElement('button');
    notificationButton.textContent = '🔔 New!';
    notificationButton.style.position = 'fixed';
    notificationButton.style.bottom = '20px';
    notificationButton.style.right = '20px';
    notificationButton.style.padding = '10px 20px';
    notificationButton.style.backgroundColor = localStorage.getItem('popupButtonColor') || '#ff9900';
    notificationButton.style.color = '#ffffff';
    notificationButton.style.border = 'none';
    notificationButton.style.borderRadius = '5px';
    notificationButton.style.cursor = 'pointer';
    notificationButton.style.fontSize = '16px';
    notificationButton.style.fontWeight = 'bold';
    notificationButton.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    notificationButton.style.zIndex = '9997';

    // Add click event to the notification button
    notificationButton.addEventListener('click', showPopup);

    // Function to initialize the script
    function init() {
        if (!localStorage.getItem('popupNeverShow')) {
            document.body.appendChild(notificationButton);
        }

        // Part 2: Image Preview

        const storagePrefix = "erai_raws_image_cache_0";

        // Function to clear old localStorage keys
        function clearOldCache() {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && !key.startsWith(storagePrefix)) {
                    localStorage.removeItem(key);
                }
            }
        }

        // Clear old cache on script initialization
        clearOldCache();

        document.querySelectorAll("th > a.aa_ss_ops_new").forEach(link => {
            link.addEventListener("mouseover", function(event) {
                let previewContainer = document.createElement("div");
                previewContainer.style.position = "fixed";
                previewContainer.style.display = "none";
                previewContainer.style.transition = "opacity 0.1s ease-in-out";
                previewContainer.style.opacity = 0;
                previewContainer.style.width = "216px";
                previewContainer.style.height = "307px";
                previewContainer.style.overflow = "hidden";
                document.body.appendChild(previewContainer);

               const url = this.href;
               const localStorageKey = storagePrefix + url;
               const tableRow = this.closest('tr');
               const previewImageUrl = tableRow ? tableRow.getAttribute('data-preview-image') : null;

               if (previewImageUrl) {
                    const cachedImage = localStorage.getItem(storagePrefix + previewImageUrl);
                   if (cachedImage) {
                       displayCachedImage(cachedImage,previewImageUrl);
                    } else {
                        showLoadingIndicator();
                        fetchAndDisplayImage(previewImageUrl, localStorageKey, true);
                   }

               } else {
                   const cachedImage = localStorage.getItem(localStorageKey);

                   if (cachedImage) {
                       displayCachedImage(cachedImage, url);
                   } else {
                       showLoadingIndicator();
                       fetchAndDisplayImage(url, localStorageKey, false);
                   }
               }

               function displayCachedImage(imageSrc,url) {
                   let cachedImageElement = new Image();
                   cachedImageElement.onload = function() {
                       previewContainer.innerHTML = `<img style="width: 100%; height: 100%;" src="${imageSrc}"/>`;
                       showPreviewContainer();
                   };
                   cachedImageElement.onerror = function() {
                       localStorage.removeItem(storagePrefix+url);
                       showLoadingIndicator();
                       fetchAndDisplayImage(url, localStorageKey, previewImageUrl);
                   };
                   cachedImageElement.src = imageSrc;
               }

                function showLoadingIndicator() {
                    previewContainer.innerHTML = `
                        <div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; background-color: #f0f0f0;">
                            <div style="width: 40px; height: 40px; border: 4px solid #333; border-top: 4px solid #999; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                        </div>
                        <style>
                            @keyframes spin {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(360deg); }
                            }
                        </style>
                    `;
                    showPreviewContainer();
                }

                function showPreviewContainer() {
                    previewContainer.style.display = "block";
                    setTimeout(function() {
                        previewContainer.style.opacity = 1;
                    }, 0);
                }

                function fetchAndDisplayImage(url, localStorageKey, useTableRowImage) {
                    if(useTableRowImage){
                        let image = new Image();
                        image.onload = function() {
                            try {
                                localStorage.setItem(storagePrefix+url, url);
                            } catch (e) {
                                console.warn("LocalStorage is full or unavailable. Image caching failed.", e);
                            }
                            previewContainer.innerHTML = `<img style="width: 100%; height: 100%;" src="${url}"/>`;
                             showPreviewContainer();
                         };
                        image.onerror = function() {
                             previewContainer.textContent = "Failed to load image.";
                        };
                       image.src = url;
                    } else {
                        var xhr = new XMLHttpRequest();
                        xhr.open("GET", url);
                        xhr.responseType = "document";

                        xhr.onload = function() {
                            if (xhr.response) {
                                let preview = xhr.response.querySelector(".entry-content-poster img");
                                if (preview) {
                                    // Use data-src if present, fallback to src
                                    const imageUrl = preview.getAttribute('data-src') || preview.src;

                                    let image = new Image();
                                    image.onload = function() {
                                        try {
                                            localStorage.setItem(localStorageKey, imageUrl);
                                        } catch (e) {
                                            console.warn("LocalStorage is full or unavailable. Image caching failed.", e);
                                        }
                                        previewContainer.innerHTML = `<img style="width: 100%; height: 100%;" src="${imageUrl}"/>`;
                                        showPreviewContainer();
                                    };
                                    image.onerror = function() {
                                        previewContainer.textContent = "Failed to load image.";
                                    };
                                    image.src = imageUrl;
                                } else {
                                    previewContainer.textContent = "Image not found.";
                                }
                            } else {
                                previewContainer.textContent = "Failed to load image.";
                            }
                        };

                        xhr.onerror = function() {
                            previewContainer.textContent = "Failed to load image.";
                        };

                        xhr.send();
                    }
                }

                document.addEventListener("mousemove", function(event) {
                    previewContainer.style.top = event.clientY + 20 + "px";
                    previewContainer.style.left = event.clientX + 20 + "px";

                     if (previewContainer.getBoundingClientRect().right > window.innerWidth) {
                         previewContainer.style.left = (window.innerWidth - previewContainer.offsetWidth - 20) + "px";
                     }
                     if (previewContainer.getBoundingClientRect().bottom > window.innerHeight) {
                         previewContainer.style.top = (window.innerHeight - previewContainer.offsetHeight - 20) + "px";
                     }
                });

                link.addEventListener("mouseout", function() {
                    previewContainer.style.opacity = 0;
                    document.removeEventListener("mousemove", function(event) {});
                     setTimeout(function() {
                        previewContainer.style.display = "none";
                        previewContainer.remove();
                    }, 300);
                });
            });
        });
    }

    // Run the initialization function when the page loads
    window.addEventListener('load', init);
})();