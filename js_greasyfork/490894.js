// ==UserScript==
// @name         4chan Gallery
// @namespace    http://tampermonkey.net/
// @version      2025-09-23 (3.85)
// @description  4chan grid-based image gallery with zoom mode support for threads that allows you to browse images, and soundposts (images with sounds, webms with sounds) along with other utility features.
// @author       TheDarkEnjoyer
// @match        https://boards.4chan.org/*/thread/*
// @match        https://boards.4chan.org/*/archive
// @match        https://boards.4channel.org/*/thread/*
// @match        https://boards.4channel.org/*/archive
// @match        https://warosu.org/*/*
// @match        https://archived.moe/*/*
// @match        https://archive.palanq.win/*/*
// @match        https://archive.4plebs.org/*/*
// @match        https://desuarchive.org/*/*
// @match        https://thebarchive.com/*/*
// @match        https://archiveofsins.com/*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/490894/4chan%20Gallery.user.js
// @updateURL https://update.greasyfork.org/scripts/490894/4chan%20Gallery.meta.js
// ==/UserScript==

(function () {
    "use strict";
    // injectVideoJS();
    const defaultSettings = {
        Load_High_Res_Images_By_Default: {
            value: false,
            info: "When opening the gallery, load high quality images by default (no thumbnails)",
        },
        Add_Placeholder_Image_For_Zoom_Mode: {
            value: true,
            info: "Add a placeholder image for zoom mode so even if the thread has no images, you can still open the zoom mode",
        },
        Play_Webms_On_Hover: {
            value: true,
            info: "Autoplay webms on hover, pause on mouse leave",
        },
        Switch_Catbox_To_Pixstash_For_Soundposts: {
            value: false,
            info: "Switch all catbox.moe links to pixstash.moe links for soundposts",
        },
        Show_Arrow_Buttons_In_Zoom_Mode: {
            value: true,
            info: "Show clickable arrow buttons on screen edges in zoom mode",
        },
        Grid_Columns: {
            value: 3,
            info: "Number of columns in the grid view",
        },
        Grid_Cell_Max_Height: {
            value: 200,
            info: "Maximum height of each cell in pixels",
        },
        Embed_External_Links: {
            value: false,
            info: "Embed catbox/pixstash links found in post comments",
        },
        Strictly_Load_GIFs_As_Thumbnails_On_Hover: {
            value: false,
            info: "Only load GIF thumbnails until hovered"
        },
        Open_Close_Gallery_Key: {
            value: "i",
            info: "Key to open/close the gallery"
        },
        Hide_Gallery_Button: {
            value: false,
            info: "Hide the gallery button (You can still open the gallery with the keybind, default is 'i')"
        },
        Force_Load_Catbox_Images_As_Webp: {
            value: false,
            info: "Load Catbox images as WebP format for faster loading (using images.weserv.nl)",
        },
    };

    let threadURL = window.location.href;
    let lastScrollPosition = 0;
    let gallerySize = { width: 0, height: 0 };
    let gridContainer; // Add this line

    // store settings in local storage
    if (!localStorage.getItem("gallerySettings")) {
        localStorage.setItem("gallerySettings", JSON.stringify(defaultSettings));
    }
    let settings = JSON.parse(localStorage.getItem("gallerySettings"));

    // check if settings has all the keys from defaultSettings, if not, add the missing keys
    let missingSetting = false;
    for (const setting in defaultSettings) {
        if (!settings.hasOwnProperty(setting)) {
            settings[setting] = defaultSettings[setting];
            missingSetting = true;
        }
    }

    // update the settings in local storage if there are missing settings
    if (missingSetting) {
        localStorage.setItem("gallerySettings", JSON.stringify(settings));
    }

    function setStyles(element, styles) {
        for (const property in styles) {
            element.style[property] = styles[property];
        }
    }

    function getPosts(websiteUrl, doc) {
        switch (websiteUrl) {
            case "warosu.org":
                return doc.querySelectorAll(".comment, .highlight");
            case "archived.moe":
            case "archive.palanq.win":
            case "archive.4plebs.org":
            case "desuarchive.org":
            case "thebarchive.com":
            case "archiveofsins.com":
                return doc.querySelectorAll(".post, .thread");
            case "boards.4chan.org":
            case "boards.4channel.org":
            default:
                return doc.querySelectorAll(".postContainer");
        }
    }

    function getDocument(thread, threadURL) {
        return new Promise((resolve, reject) => {
            if (thread === threadURL) {
                resolve(document);
            } else {
                fetch(thread)
                    .then((response) => response.text())
                    .then((html) => {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, "text/html");
                        resolve(doc);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            }
        });
    }

    function injectVideoJS() {
        const link = document.createElement("link");
        link.href = "https://vjs.zencdn.net/8.10.0/video-js.css";
        link.rel = "stylesheet";
        document.head.appendChild(link);

        // theme
        const theme = document.createElement("link");
        theme.href = "https://unpkg.com/@videojs/themes@1/dist/city/index.css";
        theme.rel = "stylesheet";
        document.head.appendChild(theme);

        const script = document.createElement("script");
        script.src = "https://vjs.zencdn.net/8.10.0/video.min.js";
        document.body.appendChild(script);
        ("VideoJS injected successfully!");
    }

    function createArrowButton(direction) {
        const button = document.createElement('button');
        setStyles(button, {
            position: 'fixed',
            top: '50%',
            [direction]: '20px',
            transform: 'translateY(-50%)',
            zIndex: '10001',
            backgroundColor: 'rgba(28, 28, 28, 0.7)',
            color: '#d9d9d9',
            padding: '15px',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            display: settings.Show_Arrow_Buttons_In_Zoom_Mode.value ? 'block' : 'none'
        });
        button.innerHTML = direction === 'left' ? '◀' : '▶';
        button.onclick = () => {
            const event = new KeyboardEvent('keydown', { key: direction === 'left' ? 'ArrowLeft' : 'ArrowRight' });
            document.dispatchEvent(event);
        };
        return button;
    }

    function convertToCatboxWebp(url) {
        if (settings.Force_Load_Catbox_Images_As_Webp.value && url.includes('catbox.moe')) {
            return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&output=webp`;
        }
        return url;
    }

    // Modify createMediaCell to accept mode and postURL parameters
    function createMediaCell(url, commentText, mode, postURL, board, threadID, postID) {
        if (!gridContainer) {
            gridContainer = document.createElement("div");
            setStyles(gridContainer, {
                display: "grid",
                gridTemplateColumns: `repeat(${settings.Grid_Columns.value}, 1fr)`,
                gap: "10px",
                padding: "20px",
                backgroundColor: "#1c1c1c",
                color: "#d9d9d9",
                maxWidth: "80%",
                maxHeight: "80%",
                overflowY: "auto",
                resize: "both",
                overflow: "auto",
                border: "1px solid #d9d9d9",
            });
        }
        const cell = document.createElement("div");
        setStyles(cell, {
            // red border for Embedded Media
            border: "1px solid #ff0000",
            position: "relative",
        });

        // Make the cell draggable
        cell.draggable = true;
        cell.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", [...gridContainer.children].indexOf(cell));
            e.dataTransfer.dropEffect = "move";
        });

        // Allow drops on this cell
        cell.addEventListener("dragover", (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
        });

        cell.addEventListener("drop", (e) => {
            e.preventDefault();
            const draggedIndex = e.dataTransfer.getData("text/plain");
            const containerChildren = [...gridContainer.children];
            const draggedCell = containerChildren[draggedIndex];
            if (draggedCell !== cell) {
                const dropIndex = containerChildren.indexOf(cell);
                if (draggedIndex < dropIndex) {
                    gridContainer.insertBefore(draggedCell, containerChildren[dropIndex].nextSibling);
                } else {
                    gridContainer.insertBefore(draggedCell, containerChildren[dropIndex]);
                }
            }
        });

        const mediaContainer = document.createElement("div");
        setStyles(mediaContainer, {
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        });

        const buttonDiv = document.createElement("div");
        setStyles(buttonDiv, {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "5px",
        });

        // Add view post button for external media
        const viewPostButton = document.createElement("button");
        viewPostButton.textContent = "View Original";
        setStyles(viewPostButton, {
            backgroundColor: "#1c1c1c",
            color: "#d9d9d9",
            padding: "5px 10px",
            borderRadius: "3px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
        });
        viewPostButton.addEventListener("click", () => {
            window.location.href = postURL;
            gallerySize = {
                width: gridContainer.offsetWidth,
                height: gridContainer.offsetHeight,
            };
        });
        buttonDiv.appendChild(viewPostButton);

        if (url.match(/\.(webm|mp4)$/i)) {
            const video = document.createElement("video");
            video.src = url;
            video.controls = true;
            video.title = commentText;
            video.setAttribute("fileName", url.split('/').pop());
            video.setAttribute("board", board);
            video.setAttribute("threadID", threadID);
            video.setAttribute("postID", postID);
            setStyles(video, {
                maxWidth: "100%",
                maxHeight: `${settings.Grid_Cell_Max_Height.value}px`,
                objectFit: "contain",
                cursor: "pointer",
                minWidth: "25%",
            });
            mediaContainer.appendChild(video);

            const openInNewTabButton = document.createElement("button");
            openInNewTabButton.textContent = "Open";
            setStyles(openInNewTabButton, {
                backgroundColor: "#1c1c1c",
                color: "#d9d9d9",
                padding: "5px 10px",
                borderRadius: "3px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
            });
            openInNewTabButton.onclick = () => {
                window.open(url, "_blank");
            };
            buttonDiv.appendChild(openInNewTabButton);
        } else if (url.match(/\.(jpg|jpeg|png|gif)$/i)) {
            // Only create image cell if mode is "all"
            if (mode === "all") {
                const image = document.createElement("img");
                // Convert to WebP if it's a Catbox image and setting is enabled
                image.src = convertToCatboxWebp(url);
                image.title = commentText;
                image.setAttribute("fileName", url.split('/').pop());
                image.setAttribute("actualSrc", url);
                image.setAttribute("thumbnailUrl", url);
                image.setAttribute("board", board);
                image.setAttribute("threadID", threadID);
                image.setAttribute("postID", postID);
                setStyles(image, {
                    maxWidth: "100%",
                    maxHeight: `${settings.Grid_Cell_Max_Height.value}px`,
                    objectFit: "contain",
                    cursor: "pointer",
                });
                image.loading = "lazy";

                if (
                    settings.Strictly_Load_GIFs_As_Thumbnails_On_Hover.value &&
                    url.match(/\.gif$/i)
                ) {
                    image.src = url;
                    image.addEventListener("mouseover", () => {
                        image.src = url;
                    });
                    image.addEventListener("mouseout", () => {
                        image.src = url;
                    });
                }

                mediaContainer.appendChild(image);
            } else {
                return; // Skip non-webm/soundpost media in webm mode
            }
        }

        cell.appendChild(mediaContainer);
        cell.appendChild(buttonDiv);
        gridContainer.appendChild(cell);
    }

    const loadButton = () => {
        const isArchivePage = window.location.pathname.includes("/archive");
        let addFakeImage = settings.Add_Placeholder_Image_For_Zoom_Mode.value;

        const button = document.createElement("button");
        button.textContent = "Open Image Gallery";
        button.id = "openImageGallery";
        setStyles(button, {
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: "1000",
            backgroundColor: "#1c1c1c",
            color: "#d9d9d9",
            padding: "10px 20px",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
            visibility: settings.Hide_Gallery_Button.value ? "hidden" : "visible",
        });

        const openImageGallery = () => {
            // new check to see if gallery is already in the DOM
            const existingGallery = document.getElementById("imageGallery");
            if (existingGallery) {
                existingGallery.style.display = "flex";
                return;
            }
            addFakeImage = settings.Add_Placeholder_Image_For_Zoom_Mode.value;

            const gallery = document.createElement("div");
            gallery.id = "imageGallery";
            setStyles(gallery, {
                position: "fixed",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: "9999",
            });

            gridContainer = document.createElement("div");
            setStyles(gridContainer, {
                display: "grid",
                gridTemplateColumns: `repeat(${settings.Grid_Columns.value}, 1fr)`,
                gap: "10px",
                padding: "20px",
                backgroundColor: "#1c1c1c",
                color: "#d9d9d9",
                maxWidth: "80%",
                maxHeight: "80%",
                overflowY: "auto",
                resize: "both",
                overflow: "auto",
                border: "1px solid #d9d9d9",
            });

            // Add dragover & drop listeners to the grid container
            gridContainer.addEventListener("dragover", (e) => {
                e.preventDefault();
            });
            gridContainer.addEventListener("drop", (e) => {
                e.preventDefault();
                const draggedIndex = e.dataTransfer.getData("text/plain");
                const targetCell = e.target.closest("div[draggable='true']");
                if (!targetCell) return;
                const containerChildren = [...gridContainer.children];
                const dropIndex = containerChildren.indexOf(targetCell);
                if (draggedIndex >= 0 && dropIndex >= 0) {
                    const draggedCell = containerChildren[draggedIndex];
                    if (draggedIndex < dropIndex) {
                        gridContainer.insertBefore(draggedCell, containerChildren[dropIndex].nextSibling);
                    } else {
                        gridContainer.insertBefore(draggedCell, containerChildren[dropIndex]);
                    }
                }
            });

            // Restore the previous grid container size
            if (gallerySize.width > 0 && gallerySize.height > 0) {
                gridContainer.style.width = `${gallerySize.width}px`;
                gridContainer.style.height = `${gallerySize.height}px`;
            }

            let mode = "all"; // Default mode is "all"
            let autoPlayWebms = false; // Default auto play webms without sound is false

            const mediaTypeButtonContainer = document.createElement("div");
            setStyles(mediaTypeButtonContainer, {
                position: "absolute",
                top: "10px",
                left: "10px",
                display: "flex",
                gap: "10px",
            });

            // Toggle mode button
            const toggleModeButton = document.createElement("button");
            toggleModeButton.textContent = "Toggle Mode (All)";
            setStyles(toggleModeButton, {
                backgroundColor: "#1c1c1c",
                color: "#d9d9d9",
                padding: "10px 20px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
            });
            toggleModeButton.addEventListener("click", () => {
                mode = mode === "all" ? "webm" : "all";
                toggleModeButton.textContent = `Toggle Mode (${mode === "all" ? "All" : "Webm & Images with Sound"})`;
                gridContainer.innerHTML = ""; // Clear the grid
                loadPosts(mode, addFakeImage); // Reload posts based on the new mode
            });

            // Toggle auto play webms button
            const toggleAutoPlayButton = document.createElement("button");
            toggleAutoPlayButton.textContent = "Auto Play Webms without Sound";
            setStyles(toggleAutoPlayButton, {
                backgroundColor: "#1c1c1c",
                color: "#d9d9d9",
                padding: "10px 20px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
            });
            toggleAutoPlayButton.addEventListener("click", () => {
                autoPlayWebms = !autoPlayWebms;
                toggleAutoPlayButton.textContent = autoPlayWebms
                    ? "Stop Auto Play Webms"
                    : "Auto Play Webms without Sound";
                gridContainer.innerHTML = ""; // Clear the grid
                loadPosts(mode, addFakeImage); // Reload posts based on the new mode and auto play setting
            });
            mediaTypeButtonContainer.appendChild(toggleModeButton);
            mediaTypeButtonContainer.appendChild(toggleAutoPlayButton);
            gallery.appendChild(mediaTypeButtonContainer);

            // settings button on the top right corner of the screen
            const settingsButton = document.createElement("button");
            settingsButton.id = "settingsButton";
            settingsButton.textContent = "Settings";
            setStyles(settingsButton, {
                position: "absolute",
                top: "20px",
                right: "20px",
                backgroundColor: "#007bff", // Primary color
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                transition: "background-color 0.3s ease",
            });
            settingsButton.addEventListener("click", () => {
                const settingsContainer = document.createElement("div");
                settingsContainer.id = "settingsContainer";
                setStyles(settingsContainer, {
                    position: "fixed",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: "9999",
                    animation: "fadeIn 0.3s ease",
                });

                const settingsBox = document.createElement("div");
                setStyles(settingsBox, {
                    backgroundColor: "#000000", // Background color
                    color: "#ffffff", // Text color
                    padding: "30px",
                    borderRadius: "10px",
                    border: "1px solid #6c757d", // Secondary color
                    maxWidth: "80%",
                    maxHeight: "80%",
                    overflowY: "auto",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                });

                const settingsTitle = document.createElement("h2");
                settingsTitle.id = "settingsTitle";
                settingsTitle.textContent = "Settings";
                setStyles(settingsTitle, {
                    textAlign: "center",
                    marginBottom: "20px",
                });

                const settingsList = document.createElement("ul");
                settingsList.id = "settingsList";
                setStyles(settingsList, {
                    listStyleType: "none",
                    padding: "0",
                    margin: "0",
                });

                // include default settings as existing settings inside the input fields
                // have an icon next to the setting that explains what the setting does
                for (const setting in settings) {
                    // remove settings that are not in the default settings
                    if (!(setting in defaultSettings)) {
                        delete settings[setting];
                        continue;
                    }

                    const settingItem = document.createElement("li");
                    setStyles(settingItem, {
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "15px",
                    });

                    const settingLabel = document.createElement("label");
                    settingLabel.textContent = setting.replace(/_/g, " ");
                    settingLabel.title = settings[setting].info;
                    setStyles(settingLabel, {
                        flex: "1",
                        display: "flex",
                        alignItems: "center",
                    });

                    const settingIcon = document.createElement("span");
                    settingIcon.className = "material-icons-outlined";
                    settingIcon.textContent = settings[setting].icon;
                    settingIcon.style.marginRight = "10px";
                    settingLabel.prepend(settingIcon);

                    settingItem.appendChild(settingLabel);

                    const settingInput = document.createElement("input");
                    const settingValueType = typeof defaultSettings[setting].value;
                    if (settingValueType === "boolean") {
                        settingInput.type = "checkbox";
                        settingInput.checked = settings[setting].value;
                    } else if (settingValueType === "number") {
                        settingInput.type = "number";
                        settingInput.value = settings[setting].value;
                    } else {
                        settingInput.type = "text";
                        settingInput.value = settings[setting].value;
                    }
                    setStyles(settingInput, {
                        padding: "8px 12px",
                        borderRadius: "5px",
                        border: "1px solid #6c757d", // Secondary color
                        flex: "2",
                    });
                    settingInput.addEventListener("focus", () => {
                        setStyles(settingInput, {
                            borderColor: "#007bff", // Primary color
                            boxShadow: "0 0 0 2px rgba(0, 123, 255, 0.25)",
                            outline: "none",
                        });
                    });
                    settingInput.addEventListener("blur", () => {
                        setStyles(settingInput, {
                            borderColor: "#6c757d", // Secondary color
                            boxShadow: "none",
                        });
                    });

                    if (settingValueType === "boolean") {
                        settingInput.style.marginRight = "10px";
                    }

                    settingItem.appendChild(settingInput);
                    settingsList.appendChild(settingItem);
                }

                const saveButton = document.createElement("button");
                saveButton.id = "saveButton";
                saveButton.textContent = "Save";
                setStyles(saveButton, {
                    backgroundColor: "#007bff", // Primary color
                    color: "#fff",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                    transition: "background-color 0.3s ease",
                    marginRight: "10px",
                });
                saveButton.addEventListener("click", () => {
                    const newSettings = {};
                    // First copy default settings structure
                    for (const key in defaultSettings) {
                        newSettings[key] = { ...defaultSettings[key] };
                    }

                    const inputs = document.querySelectorAll("#settingsList input");
                    inputs.forEach((input) => {
                        const settingName = input.previousSibling.textContent.replace(
                            / /g,
                            "_"
                        );
                        if (settingName in defaultSettings) {
                            newSettings[settingName].value = input.type === "checkbox" ? input.checked : input.value;
                        }
                    });
                    localStorage.setItem("gallerySettings", JSON.stringify(newSettings));
                    settings = newSettings;
                    settingsContainer.remove();

                    const gallery = document.querySelector('#imageGallery');
                    if (gallery) {
                        document.body.removeChild(gallery);
                        setTimeout(() => {
                            document.querySelector('#openImageGallery').click();
                        }, 20);
                    }
                });

                // Close button
                const closeButton = document.createElement("button");
                closeButton.id = "closeButton";
                closeButton.textContent = "Close";
                setStyles(closeButton, {
                    backgroundColor: "#007bff", // Primary color
                    color: "#fff",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                    transition: "background-color 0.3s ease",
                });
                closeButton.addEventListener("click", () => {
                    settingsContainer.remove();
                });

                settingsBox.appendChild(settingsTitle);
                settingsBox.appendChild(settingsList);
                settingsBox.appendChild(saveButton);
                settingsBox.appendChild(closeButton);
                settingsContainer.appendChild(settingsBox);
                gallery.appendChild(settingsContainer);
            });

            // Hover effect for settings button
            settingsButton.addEventListener("mouseenter", () => {
                settingsButton.style.backgroundColor = "#0056b3";
            });
            settingsButton.addEventListener("mouseleave", () => {
                settingsButton.style.backgroundColor = "#007bff";
            });

            gallery.appendChild(settingsButton);

            const loadPosts = (mode, addFakeImage) => {
                const checkedThreads = isArchivePage
                    ? // Get all checked threads in the archive page or the current link if it's not an archive page
                    Array.from(
                        document.querySelectorAll(
                            ".flashListing input[type='checkbox']:checked"
                        )
                    ).map((checkbox) => {
                        let archiveSite =
                            checkbox.parentNode.parentNode.querySelector("a").href;
                        return archiveSite;
                    })
                    : [threadURL];

                const loadPostsFromThread = (thread, addFakeImage) => {
                    // get the website url without the protocol and next slash
                    let websiteUrl = thread.replace(/(^\w+:|^)\/\//, "").split("/")[0];

                    // const board = thread.split("/thread/")[0].split("/").pop();
                    // const threadNo = `${parseInt(thread.split("thread/").pop())}`
                    getDocument(thread, threadURL).then((doc) => {
                        let posts;

                        // use a case statement to deal with different websites
                        posts = getPosts(websiteUrl, doc);

                        // add thread and website url as attributes to every post
                        posts.forEach((post) => {
                            post.setAttribute("thread", thread);
                            post.setAttribute("websiteUrl", websiteUrl);
                        });

                        if (addFakeImage) {
                            // Add a fake image to the grid container to allow zoom mode to open even if the thread has no images
                            let placeholder_imageURL = "https://files.catbox.moe/ecl8vh.png";
                            let examplePost = document.createElement("div");
                            examplePost.innerHTML = `
                                <div class="postContainer", id="1231232">
                                    <div class="fileText">
                                        <a href="${placeholder_imageURL}" download="${placeholder_imageURL}">OpenZoomMode[sound=https://files.catbox.moe/brugtt.mp3].jpg</a>
                                    </div>
                                    <div class="fileThumb">
                                        <img src="${placeholder_imageURL}" alt="Thumbnail">
                                    </div>
                                    <div class="postMessage">
                                        Just a placeholder image for zoom mode
                                    </div>
                                </div>
                            `;
                            examplePost.setAttribute("thread", "https://boards.4chan.org/b/thread/123456789");
                            examplePost.setAttribute("websiteUrl", "boards.4chan.org");
                            posts = [examplePost, ...posts];
                        }

                        posts.forEach((post) => {
                            let mediaLinkFlag = false;
                            let board;
                            let threadID;
                            let postID;
                            let postURL;
                            let thumbnailUrl;
                            let mediaLink;
                            let fileName;
                            let comment;

                            let isVideo;
                            let isImage;
                            let soundLink;
                            let encodedSoundPostLink;
                            let temp;
                            let hasEmbeddedMediaLink = false;
                            let matches;

                            websiteUrl = post.getAttribute("websiteUrl");
                            thread = post.getAttribute("thread");

                            // case statement for different websites
                            switch (websiteUrl) {
                                case "warosu.org":
                                    let thumbnailElement = post.querySelector(".thumb");

                                    fileName = post
                                        .querySelector(".fileinfo")
                                        ?.innerText.split(", ")[2];
                                    thumbnailUrl = thumbnailElement?.src;
                                    mediaLink = thumbnailElement?.parentNode.href;
                                    comment = post.querySelector("blockquote");

                                    threadID = post.getAttribute("thread").match(/thread\/(\d+)/)
                                    if (threadID) {
                                        threadID = threadID[1];
                                    } else {
                                        threadID = post.querySelector(".js").href.match(/thread\/(\d+)/)[1];
                                    }

                                    postID = post.id.replace("pc", "").replace("p", "");
                                    break;
                                case "archived.moe":
                                case "archive.palanq.win":
                                case "archive.4plebs.org":
                                case "desuarchive.org":
                                case "thebarchive.com":
                                case "archiveofsins.com":
                                    thumbnailUrl = post.querySelector(".post_image")?.src;
                                    mediaLink = post.querySelector(".thread_image_link")?.href;
                                    fileName = post.querySelector(
                                        ".post_file_filename"
                                    )?.title;
                                    comment = post.querySelector(".text");
                                    threadID = post.querySelector(".post_data > a")?.href.match(
                                        /thread\/(\d+)/
                                    )[1];
                                    postID = post.id
                                    break;
                                case "boards.4chan.org":
                                case "boards.4channel.org":
                                default:
                                    if (post.querySelector(".fileText")) {
                                        // if they have 4chanX installed, there will be a fileText-orignal class
                                        if (post.querySelector(".download-button")) {
                                            temp = post.querySelector(".download-button");
                                            mediaLink = temp.href;
                                            fileName = temp.download;
                                        } else {
                                            if (post.classList.contains("opContainer")) {
                                                mediaLink = post.querySelector(".fileText a");
                                                temp = mediaLink;
                                            } else {
                                                mediaLink = post.querySelector(".fileText");
                                                temp = mediaLink.querySelector("a");
                                            }
                                            if (mediaLink.title === "") {
                                                if (temp.title === "") {
                                                    fileName = temp.innerText;
                                                } else {
                                                    fileName = temp.title;
                                                }
                                            } else {
                                                fileName = mediaLink.title;
                                            }
                                            mediaLink = temp.href;
                                        }
                                        thumbnailUrl = post.querySelector(".fileThumb img")?.src;
                                    }

                                    comment = post.querySelector(".postMessage");

                                    threadID = thread.match(/thread\/(\d+)/)[1];
                                    postID = post.id.replace("pc", "").replace("p", "");
                            }

                            const fileExtRegex = /\.(webm|mp4|jpg|png|gif)$/i;
                            const linkRegex = /https:\/\/(files|litter)\.(catbox|pixstash)\.moe\/[a-z0-9]+\.(jpg|png|gif|webm|mp4)/g;

                            if (mediaLink) {
                                const ext = mediaLink.match(fileExtRegex)?.[1]?.toLowerCase();
                                isVideo = ext === 'webm' || ext === 'mp4';
                                isImage = ext === 'jpg' || ext === 'png' || ext === 'gif';
                                soundLink = fileName.match(/\[sound=(.+?)\]/);
                                mediaLinkFlag = true;
                            }
                            if (settings.Embed_External_Links.value && comment) {
                                matches = Array.from(comment.innerText.matchAll(linkRegex)).map(match => match[0]);
                                if (matches.length > 0) {
                                    if (!mediaLinkFlag) {
                                        mediaLink = matches[0];
                                        fileName = mediaLink.split("/").pop();
                                        thumbnailUrl = mediaLink;

                                        if (hasEmbeddedMediaLink) {
                                            matches.shift();
                                        }

                                        const ext = mediaLink.match(fileExtRegex)?.[1]?.toLowerCase();
                                        isVideo = ext === 'webm' || ext === 'mp4';
                                        isImage = ext === 'jpg' || ext === 'png' || ext === 'gif';
                                        soundLink = fileName.match(/\[sound=(.+?)\]/);
                                        mediaLinkFlag = true;
                                    }
                                    hasEmbeddedMediaLink = matches.length > 0;
                                }
                            }

                            // replace the "#pcXXXXXXX" or "#pXXXXXXX" with an empty string to get the actual thread url
                            if (thread.includes("#")) {
                                postURL = thread.replace(/#p\d+/, "");
                                postURL = postURL.replace(/#pc\d+/, "");
                            } else {
                                postURL = thread;
                            }

                            // post info (constant)
                            board = thread.match(/\/\/[^\/]+\/([^\/]+)/)[1];
                            if (soundLink) {
                                encodedSoundPostLink = `https://4chan.mahdeensky.top/${board}/thread/${threadID}/${postID}`;
                            }

                            if (mediaLinkFlag) {
                                // Check if the post should be loaded based on the mode
                                if (
                                    mode === "all" ||
                                    (mode === "webm" && (isVideo || (isImage && soundLink)))
                                ) {
                                    // Insert a button/link to open media in new tab for videos
                                    const cell = document.createElement("div");
                                    setStyles(cell, {
                                        border: "1px solid #d9d9d9",
                                        position: "relative",
                                    });

                                    // Make the cell draggable
                                    cell.draggable = true;
                                    cell.addEventListener("dragstart", (e) => {
                                        e.dataTransfer.setData("text/plain", [...gridContainer.children].indexOf(cell));
                                        e.dataTransfer.dropEffect = "move";
                                    });

                                    // Allow drops on this cell
                                    cell.addEventListener("dragover", (e) => {
                                        e.preventDefault();
                                        e.dataTransfer.dropEffect = "move";
                                    });

                                    cell.addEventListener("drop", (e) => {
                                        e.preventDefault();
                                        const draggedIndex = e.dataTransfer.getData("text/plain");
                                        const containerChildren = [...gridContainer.children];
                                        const draggedCell = containerChildren[draggedIndex];
                                        if (draggedCell !== cell) {
                                            const dropIndex = containerChildren.indexOf(cell);
                                            if (draggedIndex < dropIndex) {
                                                gridContainer.insertBefore(draggedCell, containerChildren[dropIndex].nextSibling);
                                            } else {
                                                gridContainer.insertBefore(draggedCell, containerChildren[dropIndex]);
                                            }
                                        }
                                    });

                                    const buttonDiv = document.createElement("div");
                                    setStyles(buttonDiv, {
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "5px",
                                    });

                                    if (isVideo) {
                                        const videoContainer = document.createElement("div");
                                        setStyles(videoContainer, {
                                            position: "relative",
                                            display: "flex",
                                            justifyContent: "center",
                                        });

                                        // if medialink is catbox.moe or pixstash.moe, then video thumbnail is a video element with no controls
                                        let videoThumbnail;
                                        if (mediaLink.match(/catbox.moe|pixstash.moe/)) {
                                            videoThumbnail = document.createElement("video");
                                        } else {
                                            videoThumbnail = document.createElement("img");
                                        }
                                        videoThumbnail.src = thumbnailUrl;
                                        videoThumbnail.alt = "Video Thumbnail";
                                        setStyles(videoThumbnail, {
                                            width: "100%",
                                            maxHeight: `${settings.Grid_Cell_Max_Height.value}px`,
                                            objectFit: "contain",
                                            cursor: "pointer",
                                        });
                                        videoThumbnail.loading = "lazy";

                                        const video = document.createElement("video");
                                        video.setAttribute("data-src", mediaLink);
                                        video.controls = true;
                                        video.title = comment.innerText;
                                        video.videothumbnailDisplayed = "true";
                                        video.setAttribute("fileName", fileName);
                                        video.setAttribute("board", board);
                                        video.setAttribute("threadID", threadID);
                                        video.setAttribute("postID", postID);
                                        setStyles(video, {
                                            maxWidth: "100%",
                                            maxHeight: `${settings.Grid_Cell_Max_Height.value}px`,
                                            objectFit: "contain",
                                            cursor: "pointer",
                                            display: "none",
                                        });

                                        // videoJS stuff (not working for some reason)
                                        // video.className = "video-js";
                                        // video.setAttribute("data-setup", "{}");
                                        // const source = document.createElement("source");
                                        // source.src = mediaLink;
                                        // source.type = "video/webm";
                                        // video.appendChild(source);

                                        // hide the video thumbnail and show the video when hovered
                                        videoThumbnail.addEventListener("mouseenter", () => {
                                            if (!video.src) {
                                                video.src = video.getAttribute("data-src");
                                            }

                                            videoThumbnail.style.display = "none";
                                            video.style.display = "block";
                                            video.videothumbnailDisplayed = "false";
                                            // video.load();
                                        });

                                        // Play webms without sound automatically on hover or if autoPlayWebms is true
                                        if (!soundLink) {
                                            if (autoPlayWebms) {
                                                video.addEventListener("canplaythrough", () => {
                                                    video.play();
                                                    video.loop = true; // Loop webms when autoPlayWebms is true
                                                });
                                            } else {
                                                if (settings.Play_Webms_On_Hover.value) {
                                                    video.addEventListener("mouseenter", () => {
                                                        if (!video.src) {
                                                            video.src = video.getAttribute("data-src");
                                                        }

                                                        video.play();
                                                    });
                                                    video.addEventListener("mouseleave", () => {
                                                        video.pause();
                                                    });
                                                }
                                            }
                                        }

                                        videoContainer.appendChild(videoThumbnail);
                                        videoContainer.appendChild(video);

                                        if (soundLink) {
                                            // video.preload = "none"; // Disable video preload for better performance

                                            const audio = document.createElement("audio");
                                            const audioSrc = decodeURIComponent(
                                                soundLink[1].startsWith("http")
                                                    ? soundLink[1]
                                                    : `https://${soundLink[1]}`
                                            );
                                            audio.setAttribute("data-src", audioSrc);

                                            // if switch catbox to pixstash is enabled, replace catbox.moe with pixstash.moe
                                            if (settings.Switch_Catbox_To_Pixstash_For_Soundposts.value) {
                                                audio.setAttribute("data-src", audioSrc.replace("catbox.moe", "pixstash.moe"));
                                            }

                                            videoThumbnail.addEventListener("mouseenter", () => {
                                                if (!audio.src) {
                                                    audio.src = audio.getAttribute("data-src");
                                                }
                                            });

                                            // add attribute to the audio element with the encoded soundpost link
                                            audio.setAttribute(
                                                "encodedSoundPostLink",
                                                encodedSoundPostLink
                                            );
                                            videoContainer.appendChild(audio);

                                            const resetButton = document.createElement("button");
                                            resetButton.textContent = "Reset";
                                            setStyles(resetButton, {
                                                backgroundColor: "#1c1c1c",
                                                color: "#d9d9d9",
                                                padding: "5px 10px",
                                                borderRadius: "3px",
                                                border: "none",
                                                cursor: "pointer",
                                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                                            });
                                            resetButton.addEventListener("click", () => {
                                                video.currentTime = 0;
                                                audio.currentTime = 0;
                                            });
                                            buttonDiv.appendChild(resetButton);

                                            // html5 video play
                                            video.onplay = (event) => {
                                                audio.play();
                                            };

                                            video.onpause = (event) => {
                                                audio.pause();
                                            };

                                            let lastVideoTime = 0;
                                            // Sync audio with video on timeupdate event only if the difference is 2 seconds or more
                                            video.addEventListener("timeupdate", () => {
                                                if (Math.abs(video.currentTime - lastVideoTime) >= 2) {
                                                    audio.currentTime = video.currentTime;
                                                    lastVideoTime = video.currentTime;
                                                }
                                                lastVideoTime = video.currentTime;
                                            });
                                        }

                                        cell.appendChild(videoContainer);
                                    } else if (isImage) {
                                        const imageContainer = document.createElement("div");
                                        setStyles(imageContainer, {
                                            position: "relative",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        });

                                        const image = document.createElement("img");
                                        image.src = thumbnailUrl;
                                        if (settings.Load_High_Res_Images_By_Default.value) {
                                            image.src = mediaLink;
                                        }
                                        if (mediaLink.includes(".gif")) {
                                            image.src = mediaLink;

                                            if (
                                                settings.Strictly_Load_GIFs_As_Thumbnails_On_Hover.value
                                            ) {
                                                mediaLink = thumbnailUrl;
                                                image.src = thumbnailUrl;
                                            }

                                        }
                                        image.setAttribute("fileName", fileName);
                                        image.setAttribute("actualSrc", mediaLink);
                                        image.setAttribute("thumbnailUrl", thumbnailUrl);
                                        image.setAttribute("board", board);
                                        image.setAttribute("threadID", threadID);
                                        image.setAttribute("postID", postID);
                                        setStyles(image, {
                                            maxWidth: "100%",
                                            maxHeight: `${settings.Grid_Cell_Max_Height.value}px`,
                                            objectFit: "contain",
                                            cursor: "pointer",
                                        });

                                        let createDarkenBackground = () => {
                                            const background = document.createElement("div");
                                            background.id = "darkenBackground";
                                            setStyles(background, {
                                                position: "fixed",
                                                top: "0",
                                                left: "0",
                                                width: "100%",
                                                height: "100%",
                                                backgroundColor: "rgba(0, 0, 0, 0.3)",
                                                backdropFilter: "blur(5px)",
                                                zIndex: "9999",
                                            });
                                            return background;
                                        };

                                        let zoomImage = () => {
                                            // have the image pop up centered in front of the screen so that it fills about 80% of the screen
                                            image.style = "";
                                            image.src = mediaLink;
                                            setStyles(image, {
                                                position: "fixed",
                                                top: "50%",
                                                left: "50%",
                                                transform: "translate(-50%, -50%)",
                                                zIndex: "10000",
                                                height: "80%",
                                                width: "80%",
                                                objectFit: "contain",
                                                cursor: "pointer",
                                            });

                                            // darken and blur the background behind the image without affecting the image
                                            const background = createDarkenBackground();
                                            background.appendChild(createArrowButton('left'));
                                            background.appendChild(createArrowButton('right'));
                                            gallery.appendChild(background);

                                            // create a container for the buttons, number, and download buttons (even space between them)
                                            // position: fixed; bottom: 10px; display: flex; flex-direction: row; justify-content: space-around; z-index: 10000; width: 100%; margin:auto;
                                            const bottomContainer = document.createElement("div");
                                            setStyles(bottomContainer, {
                                                position: "fixed",
                                                bottom: "10px",
                                                display: "flex",
                                                flexDirection: "row",
                                                justifyContent: "space-around",
                                                zIndex: "10000",
                                                width: "100%",
                                                margin: "auto",
                                            });
                                            background.appendChild(bottomContainer);

                                            // buttons on the bottom left of the screen for reverse image search (SauceNAO, Google Lens, Yandex)
                                            const buttonContainer = document.createElement("div");
                                            setStyles(buttonContainer, {
                                                display: "flex",
                                                gap: "10px",
                                            });
                                            buttonContainer.setAttribute("mediaLink", mediaLink);

                                            const sauceNAOButton = document.createElement("button");
                                            sauceNAOButton.textContent = "SauceNAO";
                                            setStyles(sauceNAOButton, {
                                                backgroundColor: "#1c1c1c",
                                                color: "#d9d9d9",
                                                padding: "5px 10px",
                                                borderRadius: "3px",
                                                border: "none",
                                                cursor: "pointer",
                                            });
                                            sauceNAOButton.addEventListener("click", () => {
                                                window.open(
                                                    `https://saucenao.com/search.php?url=${encodeURIComponent(
                                                        buttonContainer.getAttribute("mediaLink")
                                                    )}`
                                                );
                                            });
                                            buttonContainer.appendChild(sauceNAOButton);

                                            const googleLensButton = document.createElement("button");
                                            googleLensButton.textContent = "Google Lens";
                                            setStyles(googleLensButton, {
                                                backgroundColor: "#1c1c1c",
                                                color: "#d9d9d9",
                                                padding: "5px 10px",
                                                borderRadius: "3px",
                                                border: "none",
                                                cursor: "pointer",
                                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                                            });
                                            googleLensButton.addEventListener("click", () => {
                                                window.open(
                                                    `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(
                                                        buttonContainer.getAttribute("mediaLink")
                                                    )}`
                                                );
                                            });
                                            buttonContainer.appendChild(googleLensButton);

                                            const yandexButton = document.createElement("button");
                                            yandexButton.textContent = "Yandex";
                                            setStyles(yandexButton, {
                                                backgroundColor: "#1c1c1c",
                                                color: "#d9d9d9",
                                                padding: "5px 10px",
                                                borderRadius: "3px",
                                                border: "none",
                                                cursor: "pointer",
                                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                                            });
                                            yandexButton.addEventListener("click", () => {
                                                window.open(
                                                    `https://yandex.com/images/search?rpt=imageview&url=${encodeURIComponent(
                                                        buttonContainer.getAttribute("mediaLink")
                                                    )}`
                                                );
                                            });
                                            buttonContainer.appendChild(yandexButton);

                                            bottomContainer.appendChild(buttonContainer);

                                            // download container for video/img and audio
                                            const downloadButtonContainer =
                                                document.createElement("div");
                                            setStyles(downloadButtonContainer, {
                                                display: "flex",
                                                gap: "10px",
                                            });
                                            bottomContainer.appendChild(downloadButtonContainer);

                                            const viewPostButton = document.createElement("a");
                                            viewPostButton.textContent = "View Post";
                                            viewPostButton.href = `https://boards.4chan.org/${board}/thread/${threadID}#p${postID}`;
                                            setStyles(viewPostButton, {
                                                backgroundColor: "#1c1c1c",
                                                color: "#d9d9d9",
                                                padding: "5px 10px",
                                                borderRadius: "3px",
                                                border: "none",
                                                cursor: "pointer",
                                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                                            });
                                            downloadButtonContainer.appendChild(viewPostButton);

                                            const downloadButton = document.createElement("a");
                                            downloadButton.textContent = "Download Video/Image";
                                            downloadButton.download = fileName;
                                            setStyles(downloadButton, {
                                                backgroundColor: "#1c1c1c",
                                                color: "#d9d9d9",
                                                padding: "5px 10px",
                                                borderRadius: "3px",
                                                border: "none",
                                                cursor: "pointer",
                                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                                            });
                                            downloadButton.addEventListener("click", () => {
                                                var download = GM_download({
                                                    url: mediaLink,
                                                    name: fileName,
                                                    onerror: (e) => { console.log(e); },
                                                    ontimeout: (e) => { console.log(e); },
                                                    saveAs: true
                                                    });

                                                    // timeout if download fails
                                                    window.setTimeout(() => {
                                                    dl.abort();
                                                    }, 240000);
                                            });

                                            downloadButtonContainer.appendChild(downloadButton);

                                            const audioDownloadButton = document.createElement("a");
                                            audioDownloadButton.textContent = "Download Audio";
                                            setStyles(audioDownloadButton, {
                                                backgroundColor: "#1c1c1c",
                                                color: "#d9d9d9",
                                                padding: "5px 10px",
                                                borderRadius: "3px",
                                                border: "none",
                                                cursor: "pointer",
                                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                                            });
                                            if (soundLink) {
                                                audioDownloadButton.href = decodeURIComponent(
                                                    soundLink[1].startsWith("http")
                                                        ? soundLink[1]
                                                        : `https://${soundLink[1]}`
                                                );

                                                // if switch catbox to pixstash is enabled, replace catbox.moe with pixstash.moe
                                                if (settings.Switch_Catbox_To_Pixstash_For_Soundposts.value) {
                                                    audioDownloadButton.href = audioDownloadButton.href.replace(
                                                        "catbox.moe",
                                                        "pixstash.moe"
                                                    );
                                                }

                                                audioDownloadButton.download = soundLink[1]
                                                    .split("/")
                                                    .pop();

                                                audioDownloadButton.addEventListener("click", () => {
                                                    var download = GM_download({
                                                        url: audioDownloadButton.href,
                                                        name: audioDownloadButton.download,
                                                        onerror: (e) => { console.log(e); },
                                                        ontimeout: (e) => { console.log(e); },
                                                        saveAs: true
                                                        });

                                                        // timeout if download fails
                                                        window.setTimeout(() => {
                                                        dl.abort();
                                                        }, 240000);
                                                    });
                                            } else {
                                                audioDownloadButton.style.display = "none";
                                            }
                                            downloadButtonContainer.appendChild(audioDownloadButton);

                                            // a button beside the download video and download audio button that says download encoded soundpost which links to the following url in a new tab "https://4chan.mahdeensky.top/<board>/thread/<thread>/<post>" where things between the <>, are variables to be replaced
                                            const encodedSoundPostButton =
                                                document.createElement("a");
                                            encodedSoundPostButton.textContent =
                                                "Download Encoded Soundpost";
                                            encodedSoundPostButton.target = "_blank";
                                            setStyles(encodedSoundPostButton, {
                                                backgroundColor: "#1c1c1c",
                                                color: "#d9d9d9",
                                                padding: "5px 10px",
                                                borderRadius: "3px",
                                                border: "none",
                                                cursor: "pointer",
                                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                                            });
                                            if (soundLink) {
                                                encodedSoundPostButton.href = `https://4chan.mahdeensky.top/${board}/thread/${threadID}/${postID}`;
                                            } else {
                                                encodedSoundPostButton.style.display = "none";
                                            }
                                            downloadButtonContainer.appendChild(
                                                encodedSoundPostButton
                                            );

                                            // number on the bottom right of the screen to show which image is currently being viewed
                                            const imageNumber = document.createElement("div");
                                            let currentImageNumber =
                                                Array.from(cell.parentNode.children).indexOf(cell) + 1;
                                            let imageTotal = cell.parentNode.children.length;
                                            imageNumber.textContent = `${currentImageNumber}/${imageTotal}`;
                                            setStyles(imageNumber, {
                                                backgroundColor: "#1c1c1c",
                                                color: "#d9d9d9",
                                                padding: "5px 10px",
                                                borderRadius: "3px",
                                                border: "none",
                                                cursor: "pointer",
                                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                                                position: "fixed",
                                                top: "10px",
                                                left: "10px",
                                            });
                                            background.appendChild(imageNumber);

                                            // title of the image/video on the top left of the screen
                                            const imageTitle = document.createElement("div");
                                            imageTitle.textContent = fileName;
                                            setStyles(imageTitle, {
                                                position: "fixed",
                                                top: "10px",
                                                right: "10px",
                                                backgroundColor: "#1c1c1c",
                                                color: "#d9d9d9",
                                                padding: "5px 10px",
                                                borderRadius: "3px",
                                                border: "none",
                                                cursor: "pointer",
                                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                                                zIndex: "10000",
                                            });
                                            background.appendChild(imageTitle);

                                            let currentCell = cell;

                                            function navigateImage(direction) {
                                                const targetCell = direction === 'left' ? currentCell.previousElementSibling : currentCell.nextElementSibling;
                                                if (!targetCell) return;

                                                // ...existing navigation code using targetCell instead of previousCell/nextCell...
                                                if (gallery.querySelector("#zoomedVideo")) {
                                                    if (
                                                        gallery
                                                            .querySelector("#zoomedVideo")
                                                            .querySelector("audio")
                                                    ) {
                                                        gallery
                                                            .querySelector("#zoomedVideo")
                                                            .querySelector("audio")
                                                            .pause();
                                                    }
                                                    gallery.removeChild(
                                                        gallery.querySelector("#zoomedVideo")
                                                    );
                                                } else if (gallery.querySelector("#zoomedImage")) {
                                                    gallery.removeChild(
                                                        gallery.querySelector("#zoomedImage")
                                                    );
                                                } else {
                                                    image.style = "";
                                                    // image.src = thumbnailUrl;
                                                    setStyles(image, {
                                                        maxWidth: "100%",
                                                        maxHeight: `${settings.Grid_Cell_Max_Height.value}px`,
                                                        objectFit: "contain",
                                                    });
                                                }

                                                // check if it has a video
                                                const video = targetCell?.querySelector("video");
                                                if (video) {
                                                    const video = targetCell
                                                        .querySelector("video")
                                                        .cloneNode(true);
                                                    video.id = "zoomedVideo";
                                                    video.style = "";
                                                    setStyles(video, {
                                                        position: "fixed",
                                                        top: "50%",
                                                        left: "50%",
                                                        transform: "translate(-50%, -50%)",
                                                        zIndex: "10000",
                                                        height: "80%",
                                                        width: "80%",
                                                        objectFit: "contain",
                                                        cursor: "pointer",
                                                        preload: "auto",
                                                    });
                                                    video.src = video.getAttribute("data-src");
                                                    gallery.appendChild(video);

                                                    // check if there is an audio element
                                                    let audio = targetCell.querySelector("audio");
                                                    if (audio) {
                                                        audio = audio.cloneNode(true);

                                                        // same event listeners as the video
                                                        video.onplay = (event) => {
                                                            if (!audio.src) {
                                                                audio.src = audio.getAttribute("data-src");
                                                            }
                                                            audio.play();
                                                        };

                                                        video.onpause = (event) => {
                                                            audio.pause();
                                                        };

                                                        let lastVideoTime = 0;
                                                        video.addEventListener("timeupdate", () => {
                                                            if (
                                                                Math.abs(
                                                                    video.currentTime - lastVideoTime
                                                                ) >= 2
                                                            ) {
                                                                audio.currentTime = video.currentTime;
                                                                lastVideoTime = video.currentTime;
                                                            }
                                                            lastVideoTime = video.currentTime;
                                                        });
                                                        video.appendChild(audio);
                                                    }
                                                } else {
                                                    // if it doesn't have a video, it must have an image
                                                    const originalImage =
                                                        targetCell.querySelector("img");
                                                    const currentImage =
                                                        originalImage.cloneNode(true);
                                                    currentImage.id = "zoomedImage";
                                                    currentImage.style = "";
                                                    currentImage.src =
                                                        currentImage.getAttribute("actualSrc");
                                                    originalImage.src =
                                                        originalImage.getAttribute("actualSrc");
                                                    setStyles(currentImage, {
                                                        position: "fixed",
                                                        top: "50%",
                                                        left: "50%",
                                                        transform: "translate(-50%, -50%)",
                                                        zIndex: "10000",
                                                        height: "80%",
                                                        width: "80%",
                                                        objectFit: "contain",
                                                        cursor: "pointer",
                                                    });
                                                    gallery.appendChild(currentImage);
                                                    currentImage.addEventListener("click", () => {
                                                        gallery.removeChild(currentImage);
                                                        gallery.removeChild(background);
                                                        document.removeEventListener(
                                                            "keydown",
                                                            keybindHandler
                                                        );
                                                    });

                                                    let audio = targetCell.querySelector("audio");
                                                    if (audio) {
                                                        audio = audio.cloneNode(true);
                                                        currentImage.appendChild(audio);

                                                        // event listeners when hovering over the image
                                                        currentImage.addEventListener(
                                                            "mouseenter",
                                                            () => {
                                                                if (!audio.src) {
                                                                    audio.src = audio.getAttribute("data-src");
                                                                }
                                                                audio.play();
                                                            }
                                                        );
                                                        currentImage.addEventListener(
                                                            "mouseleave",
                                                            () => {
                                                                audio.pause();
                                                            }
                                                        );
                                                    }
                                                }

                                                if (targetCell) {
                                                    currentCell = targetCell;
                                                    buttonContainer.setAttribute(
                                                        "mediaLink",
                                                        targetCell.querySelector("img").src
                                                    );

                                                    currentImageNumber += direction === 'left' ? -1 : 1;
                                                    imageNumber.textContent = `${currentImageNumber}/${imageTotal}`;

                                                    // filename of the video if it has one, otherwise the filename of the image
                                                    imageTitle.textContent = video
                                                        ? video.getAttribute("fileName")
                                                        : targetCell
                                                            .querySelector("img")
                                                            .getAttribute("fileName");

                                                    // update view post button link
                                                    let targetMedia = video || targetCell.querySelector("img");
                                                    let targetBoard = targetMedia.getAttribute("board");
                                                    let targetThreadID = targetMedia.getAttribute("threadID");
                                                    let targetPostID = targetMedia.getAttribute("postID");
                                                    viewPostButton.href = `https://boards.4chan.org/${targetBoard}/thread/${targetThreadID}#p${targetPostID}`;

                                                    // update the download button links
                                                    downloadButton.href = targetMedia.src;
                                                    if (targetCell.querySelector("audio")) {
                                                        // updating audio button download link
                                                        audioDownloadButton.href =
                                                            targetCell.querySelector("audio").src;
                                                        audioDownloadButton.download = targetCell
                                                            .querySelector("audio")
                                                            .src.split("/")
                                                            .pop();
                                                        audioDownloadButton.style.display = "block";

                                                        // updating encoded soundpost button link
                                                        encodedSoundPostButton.href = targetCell.querySelector("audio")
                                                            .getAttribute("encodedSoundPostLink");
                                                        encodedSoundPostButton.style.display = "block";

                                                    } else {
                                                        audioDownloadButton.style.display = "none";
                                                        encodedSoundPostButton.style.display = "none";
                                                    }
                                                }
                                            }

                                            const keybindHandler = (event) => {
                                                if (event.key === "ArrowLeft") {
                                                    navigateImage('left');
                                                } else if (event.key === "ArrowRight") {
                                                    navigateImage('right');
                                                }
                                            };

                                            document.addEventListener("keydown", keybindHandler);

                                            image.addEventListener(
                                                "click",
                                                () => {
                                                    image.style = "";
                                                    // image.src = thumbnailUrl;
                                                    setStyles(image, {
                                                        maxWidth: "99%",
                                                        maxHeight: `${settings.Grid_Cell_Max_Height.value}px`,
                                                        objectFit: "contain",
                                                    });

                                                    if (gallery.querySelector("#darkenBackground")) {
                                                        gallery.removeChild(background);
                                                    }
                                                    document.removeEventListener(
                                                        "keydown",
                                                        keybindHandler
                                                    );

                                                    image.addEventListener("click", zoomImage, {
                                                        once: true,
                                                    });
                                                },
                                                { once: true }
                                            );
                                        };

                                        image.addEventListener("click", zoomImage, { once: true });
                                        image.title = comment.innerText;
                                        image.loading = "lazy";

                                        if (soundLink) {
                                            const audio = document.createElement("audio");
                                            const audioSrc = decodeURIComponent(
                                                soundLink[1].startsWith("http")
                                                    ? soundLink[1]
                                                    : `https://${soundLink[1]}`
                                            );
                                            audio.setAttribute("data-src", audioSrc);

                                            // if switch catbox to pixstash is enabled, replace catbox.moe with pixstash.moe
                                            if (settings.Switch_Catbox_To_Pixstash_For_Soundposts.value) {
                                                audio.setAttribute("data-src", audioSrc.replace("catbox.moe", "pixstash.moe"));
                                            }

                                            audio.loop = true;
                                            // set the attribute to the audio element with the encoded soundpost link
                                            audio.setAttribute(
                                                "encodedSoundPostLink",
                                                encodedSoundPostLink
                                            );
                                            imageContainer.appendChild(audio);

                                            image.addEventListener("mouseenter", () => {
                                                if (!audio.src) {
                                                    audio.src = audio.getAttribute("data-src");
                                                }
                                                audio.play();
                                            });
                                            image.addEventListener("mouseleave", () => {
                                                audio.pause();
                                            });

                                            const playPauseButton = document.createElement("button");
                                            playPauseButton.textContent = "Play/Pause";
                                            setStyles(playPauseButton, {
                                                backgroundColor: "#1c1c1c",
                                                color: "#d9d9d9",
                                                padding: "5px 10px",
                                                borderRadius: "3px",
                                                border: "none",
                                                cursor: "pointer",
                                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                                            });
                                            playPauseButton.addEventListener("click", () => {
                                                if (audio.paused) {
                                                    audio.play();
                                                } else {
                                                    audio.pause();
                                                }
                                            });
                                            buttonDiv.appendChild(playPauseButton);
                                        }
                                        imageContainer.appendChild(image);
                                        cell.appendChild(imageContainer);
                                    } else {
                                        return; // Skip non-video and non-image posts
                                    }

                                    // Add button that scrolls to the post in the thread
                                    const viewPostButton = document.createElement("button");
                                    viewPostButton.textContent = "View Post";
                                    setStyles(viewPostButton, {
                                        backgroundColor: "#1c1c1c",
                                        color: "#d9d9d9",
                                        padding: "5px 10px",
                                        borderRadius: "3px",
                                        border: "none",
                                        cursor: "pointer",
                                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                                    });

                                    viewPostButton.addEventListener("click", () => {
                                        gallerySize = {
                                            width: gridContainer.offsetWidth,
                                            height: gridContainer.offsetHeight,
                                        };
                                        lastScrollPosition = gridContainer.scrollTop;
                                        window.location.href = postURL + "#" + post.id;
                                        // post id example: "pc77515440"
                                        gallery.style.display = "none"; // hide instead of removing
                                    });
                                    buttonDiv.appendChild(viewPostButton);

                                    // Add button that opens the media in a new tab if the media
                                    const openInNewTabButton = document.createElement("button");
                                    openInNewTabButton.textContent = "Open";
                                    setStyles(openInNewTabButton, {
                                        backgroundColor: "#1c1c1c",
                                        color: "#d9d9d9",
                                        padding: "5px 10px",
                                        borderRadius: "3px",
                                        border: "none",
                                        cursor: "pointer",
                                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                                    });

                                    openInNewTabButton.addEventListener("click", () => {
                                        window.open(mediaLink, "_blank");
                                    });
                                    buttonDiv.appendChild(openInNewTabButton);

                                    cell.appendChild(buttonDiv);
                                    gridContainer.appendChild(cell);
                                }
                            }

                            // In the loadPosts function, update the embedded links section:
                            if (hasEmbeddedMediaLink) {
                                // Create a proper post link that includes the thread ID and post ID
                                const fullPostLink = postURL + "#" + post.id;
                                matches.forEach(url => {
                                    createMediaCell(url, comment.innerText, mode, fullPostLink, board, threadID, postID); // Pass the current post's URL
                                });
                            }
                        });
                    });
                };

                // only load the fake image in the first thread
                loadPostsFromThread(checkedThreads[0], addFakeImage);

                // load the rest of the threads with no fake image
                checkedThreads.slice(1).forEach((thread) => {
                    loadPostsFromThread(thread, false);
                });
            };

            loadPosts(mode, addFakeImage);

            gallery.appendChild(gridContainer);

            const closeButton = document.createElement("button");
            closeButton.textContent = "Close";
            closeButton.id = "closeGallery";
            setStyles(closeButton, {
                position: "absolute",
                bottom: "10px",
                right: "10px",
                zIndex: "10000",
                backgroundColor: "#1c1c1c",
                color: "#d9d9d9",
                padding: "10px 20px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
            });
            closeButton.addEventListener("click", () => {
                gallerySize = {
                    width: gridContainer.offsetWidth,
                    height: gridContainer.offsetHeight,
                };
                gallery.style.display = "none"; // hide instead of removing
            });

            gallery.appendChild(closeButton);

            // Add scroll to bottom button
            const scrollBottomButton = document.createElement("button");
            scrollBottomButton.textContent = "Scroll to Last";
            setStyles(scrollBottomButton, {
                position: "fixed",
                bottom: "20px",
                left: "20px",
                backgroundColor: "#1c1c1c",
                color: "#d9d9d9",
                padding: "10px 20px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
                zIndex: "10000",
            });
            scrollBottomButton.addEventListener("click", () => {
                const lastCell = gridContainer.lastElementChild;
                if (lastCell) {
                    lastCell.scrollIntoView({ behavior: "smooth" });
                }
            });
            gallery.appendChild(scrollBottomButton);

            // Add zoom mode arrow buttons
            const background = document.createElement('div');
            background.appendChild(createArrowButton('left'));
            background.appendChild(createArrowButton('right'));

            document.body.appendChild(gallery);

            // Store the current scroll position and grid container size when closing the gallery
            // (`Last scroll position: ${lastScrollPosition} px`);
            gridContainer.addEventListener("scroll", () => {
                lastScrollPosition = gridContainer.scrollTop;
                // (`Current scroll position: ${lastScrollPosition} px`);
            });

            // Restore the last scroll position and grid container size when opening the gallery after a timeout if the url is the same
            if (window.location.href.includes(threadURL.replace(/#.*$/, ""))) {
                setTimeout(() => {
                    if (gallerySize.width > 0 && gallerySize.height > 0) {
                        gridContainer.style.width = `${gallerySize.width}px`;
                        gridContainer.style.height = `${gallerySize.height}px`;
                    }
                    // (`Restored scroll position: ${lastScrollPosition} px`);
                    gridContainer.scrollTop = lastScrollPosition;
                }, 100);
            } else {
                // Reset the last scroll position and grid container size if the url is different
                threadURL = window.location.href;
                lastScrollPosition = 0;
                gallerySize = { width: 0, height: 0 };
            }

            gallery.addEventListener("click", (event) => {
                if (event.target === gallery) {
                    closeButton.click();
                }
            });
        };

        button.addEventListener("click", openImageGallery);

        // Append the button to the body
        document.body.appendChild(button);

        if (isArchivePage) {
            // adds the category to thead
            const thead = document.querySelector(".flashListing thead tr");
            const checkboxCell = document.createElement("td");
            checkboxCell.className = "postblock";
            checkboxCell.textContent = "Selected";
            thead.insertBefore(checkboxCell, thead.firstChild);

            // Add checkboxes to each thread row
            const threadRows = document.querySelectorAll(".flashListing tbody tr");
            threadRows.forEach((row) => {
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                const checkboxCell = document.createElement("td");
                checkboxCell.appendChild(checkbox);
                row.insertBefore(checkboxCell, row.firstChild);
            });
        }
    };

    // Use the "i" key to open and close the gallery/grid
    document.addEventListener("keydown", (event) => {
        if (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA") {
            return;
        }
        if (event.key === settings.Open_Close_Gallery_Key.value) {
            if (!document.querySelector("#imageGallery")) {
                document.querySelector("#openImageGallery").click();
                return;
            }

            if (document.querySelector("#imageGallery").style.display === "none") {
                document.querySelector("#openImageGallery").click();
            } else {
                document.querySelector("#closeGallery").click();
            }
        }
    });

    loadButton();
    console.log("4chan Gallery loaded successfully!");
})();
