// ==UserScript==
// @name         Drawaria Avatar Builder ++
// @namespace    YoutubeDrawariaAvatarBuilder++
// @version      2.0
// @description  Adds a modernized, light-themed UI with upload image input to the avatar builder.
// @author       YouTubeDrawaria
// @match        https://*.drawaria.online/avatar/builder/
// @match        https://drawaria.online/
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @icon         https://img.itch.zone/aW1nLzE3Mjk3OTY0LnBuZw==/original/nVVAE%2F.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520171/Drawaria%20Avatar%20Builder%20%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/520171/Drawaria%20Avatar%20Builder%20%2B%2B.meta.js
// ==/UserScript==

(($, undefined) => {
    $(() => {
        const CHUNK_SIZE = 500 * 1024; // 500 KB

        const avatar = () => {
            const $header = $('header');

                       // Add the image in the left corner of the header
            const $imageLeft = $('<div class="imageLeft"></div>').css({
                position: 'absolute',
                top: '-64px', // Adjust top spacing
                left: '0px', // Adjust left spacing
                zIndex: '10',
            });
            const $image = $('<img>')
                .attr('src', 'https://i.ibb.co/BT59zrr/builder.png')
                .css({
                    width: '180px', // Adjust the size as necessary
                    height: '180px',
                    objectFit: 'contain',
                });
            $imageLeft.append($image);
            $header.css('position', 'relative').append($imageLeft);

            const $labelButton = $('<label class="Button" for="imageInput">Upload Image++</label>');
            const $imageInput = $('<input style="display:none" id="imageInput" type="file" accept="image/*">');

            $header.append($labelButton, $imageInput);

            $imageInput.on('change', (event) => {
                const file = event.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = () => {
                    const uploadedImage = reader.result;
                    updateButtonState('Uploading...', true);
                    uploadInChunks(file, 0);
                };
                reader.readAsDataURL(file);
            });

            const updateButtonState = (text, disable) => {
                $labelButton.text(text).css('pointer-events', disable ? 'none' : 'auto');
            };

            const updateProgressBar = (percentComplete) => {
                $labelButton.css(
                    'background',
                    `linear-gradient(90deg, #00f2ff ${percentComplete.toFixed(0)}%, #ccc 0%)`
                );
            };

            const fetchAvatarImage = (data) => {
                fetch(`${location.origin}/avatar/cache/${data}.jpg`, { method: 'GET', mode: 'cors', cache: 'reload' })
                    .then(() => {
                        updateButtonState('Save OK!', true);
                        window.location.href = new URL(window.location.href).origin;
                    })
                    .catch((error) => {
                        handleError(error);
                    });
            };

            const handleError = (error) => {
                updateButtonState('Upload Image', false);
                $imageInput.val('');
                alert(`Error: ${error}`);
            };

            const uploadInChunks = (file, start) => {
                const end = Math.min(start + CHUNK_SIZE, file.size);
                const chunk = file.slice(start, end);

                const reader = new FileReader();
                reader.onload = (event) => {
                    const chunkData = event.target.result.split(',')[1];
                    $.ajax({
                        url: window.LOGGEDIN ? '/saveavatar' : '/uploadavatarimage',
                        type: 'POST',
                        data: {
                            'avatarsave_builder': JSON.stringify(window.ACCOUNT_AVATARSAVE),
                            'imagedata': chunkData,
                            'fromeditor': true,
                            'chunk': start / CHUNK_SIZE,
                            'totalChunks': Math.ceil(file.size / CHUNK_SIZE),
                        },
                        xhr: () => {
                            const xhr = new window.XMLHttpRequest();
                            xhr.upload.addEventListener(
                                'progress',
                                (evt) => {
                                    if (evt.lengthComputable) {
                                        const percentComplete = ((start + evt.loaded) / file.size) * 100;
                                        updateProgressBar(percentComplete);
                                    }
                                },
                                false
                            );
                            return xhr;
                        },
                    })
                        .done((data) => {
                            if (end < file.size) {
                                uploadInChunks(file, end);
                            } else {
                                updateButtonState('Saving...', true);
                                fetchAvatarImage(data);
                            }
                        })
                        .fail((_jqXHR, _textStatus, errorThrown) => {
                            handleError(errorThrown);
                        });
                };
                reader.readAsDataURL(chunk);
            };
        };

        const mainObserver = new MutationObserver(() => {
            if ($('main').length) {
                avatar();
                mainObserver.disconnect();
            }
        });

        mainObserver.observe(document, { childList: true, subtree: true });



        // Styles for the button and animation
        const style = `
            /* General Styles */
            body, html {
                font-family: 'Figtree', sans-serif;
                margin: 0;
                padding: 0;
                background: linear-gradient(to right, #f0f9ff, #cbebff);
                color: #333;
                overflow-x: hidden;
            }

            header {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                padding: 10px 20px;
                background: linear-gradient(90deg, #00d4ff, #007cff);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                position: relative;
            }


.App>header .Button {
    background: #517aa3;
}

            .imageLeft {
                top: 5px;
                left: 15px;
            }

            .Button {
                padding: 10px 15px;
                font-size: 14px;
                font-weight: bold;
                color: white;
                background: linear-gradient(90deg, #6fffe9, #00b8ff);
                border: none;
                border-radius: 5px;
                cursor: pointer;
                transition: all 0.3s ease;
                margin: 0 5px;
                text-shadow: 0px 0px 5px rgba(255, 255, 255, 0.7);
            }

            .Button:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 10px rgba(0, 200, 255, 0.5);
                background: linear-gradient(90deg, #00b8ff, #6fffe9);
            }

            .Button:active {
                transform: translateY(0);
                box-shadow: 0 2px 5px rgba(0, 200, 255, 0.3);
            }

            .Panel {
                background: white;
                border-radius: 10px;
                padding: 15px;
                margin: 10px;
                box-shadow: 0 6px 10px rgba(0, 0, 0, 0.1);
            }

            .List ul {
                list-style: none;
                padding: 0;
            }

            .List li {
                margin: 5px 0;
                padding: 10px;
                background: #f5faff;
                border-radius: 5px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                transition: transform 0.2s, background 0.3s;
            }

            .List li:hover {
                transform: scale(1.02);
                background: #e3f7ff;
            }

            canvas.main {
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }

            /* Animations */
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .Panel, .List li {
                animation: fadeIn 0.5s ease-in-out;
            }
        `;

        // Add styles to the document
        const styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.innerText = style;
        document.head.appendChild(styleSheet);
    });
})(window.jQuery.noConflict(true));
