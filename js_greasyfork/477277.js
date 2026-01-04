// ==UserScript==
// @name         Multi-Image Upload
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Upload multiple tech images directly via API.
// @author       Anton Grouchtchak
// @match        https://office.roofingsource.com/admin/ProjectView.php*
// @icon         https://office.roofingsource.com/images/roofing-source-logo.png
// @license      GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477277/Multi-Image%20Upload.user.js
// @updateURL https://update.greasyfork.org/scripts/477277/Multi-Image%20Upload.meta.js
// ==/UserScript==

(function() {
    'use strict';


    const uploadImage = async (file) => {
        const parentId = $("#pi_image_parent").val(); // eslint-disable-line no-undef
        const groupId = $("#pi_image_type_sid").val(); // eslint-disable-line no-undef

        const formData = new FormData();
        formData.append("add_after_image", "1"); // Always 1.
        formData.append("pi_image_type_sid", groupId); // Group id.
        formData.append("pi_image_parent", parentId); // Parent image id. Always 0 if it's a "Before" image.
        formData.append("pi_image_comment", "");
        formData.append("img", file);

        const response = await fetch(window.location.href, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Failed to upload ${file.name}`);
        }

        return response;
    };

    const fileInput = document.getElementById("name");
    const commentInput = document.getElementById("pi_image_comment");

    fileInput.setAttribute('multiple', '');
    commentInput.setAttribute('disabled', true);

    $("#dialog-form").dialog({ // eslint-disable-line no-undef
        buttons: [
            {
                text: "Add Images",
                id: "addImages",
                click: async function () {
                    const totalImages = fileInput.files.length;

                    if (totalImages === 0) {
                        return;
                    }

                    const $addImagesButton = $("#addImages"); // eslint-disable-line no-undef
                    const $closeAddImagesButton = $("#closeAddImages"); // eslint-disable-line no-undef

                    $addImagesButton.prop("disabled", true);
                    $addImagesButton.button("option", "label", `Uploading... (0/${totalImages})`);
                    $closeAddImagesButton.prop("disabled", true);

                    try {
                        for (const [index, file] of [...fileInput.files].entries()) {
                            await uploadImage(file);
                            $addImagesButton.button("option", "label", `Uploading... (${index + 1}/${totalImages})`);
                        }

                        $addImagesButton.button("option", "label", "Add Images");
                    } catch (error) {
                        console.error(error);
                    } finally {
                        fileInput.value = '';
                        $addImagesButton.prop("disabled", false);
                        $closeAddImagesButton.prop("disabled", false);
                    }
                }
            },
            {
                text: "Cancel",
                id: "closeAddImages",
                click: function () {
                    fileInput.value = '';
                    $(this).dialog("close"); // eslint-disable-line no-undef
                }
            }
        ]
    });

})();
