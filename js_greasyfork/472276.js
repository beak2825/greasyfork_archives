// ==UserScript==
// @name         avatar_builder
// @namespace    AvatarBuilder+
// @version      2.4.Final
// @description  Adds a upload image input to the avatar builder.
// @author       Vholran (https://greasyfork.org/en/users/841616)
// @match        https://*.drawaria.online/avatar/builder/
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @icon         https://www.google.com/s2/favicons?domain=drawaria.online
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472276/avatar_builder.user.js
// @updateURL https://update.greasyfork.org/scripts/472276/avatar_builder.meta.js
// ==/UserScript==

(($, undefined) => {
    $(() => {

        const avatar = () => {
            $('header').append('<label class="Button" for="imageInput">Upload Image</label><input style="display:none" id="imageInput" type="file" accept="image/jpeg, image/png, image/webp, image/gif">');
            $('body').on('change', '#imageInput', (event) => {
                const $imageInput = $(event.target);
                const $labelButton = $('label.Button');
                const reader = new FileReader();
                reader.addEventListener('load', () => {
                    const uploadedImage = reader.result.replace(/^data:[^;]+;/, 'data:image/jpeg;');
                    $labelButton.text('Uploading...').css('pointer-events', 'none');
                    $.ajax({
                        url: window.LOGGEDIN ? '/saveavatar' : '/uploadavatarimage',
                        type: 'POST',
                        data: { 'avatarsave_builder': JSON.stringify(window.ACCOUNT_AVATARSAVE), 'imagedata': uploadedImage, 'fromeditor': true },
                        xhr: () => {
                            const xhr = new window.XMLHttpRequest();
                            xhr.upload.addEventListener('progress', evt => {
                                if (evt.lengthComputable) {
                                    const percentComplete = (evt.loaded / evt.total) * 100;
                                    $labelButton.css('background', `linear-gradient(180deg, #f6f9fc 85%, transparent 15%), linear-gradient(90deg, #3ad73d ${percentComplete.toFixed(0)}%, #808386 0%`);
                                }
                            }, false);
                            return xhr;
                        }
                    }).done(data => {
                        $labelButton.text('Saving...').removeAttr('style').css('pointer-events', 'none');
                        fetch(location.origin + `/avatar/cache/${data}.jpg`, { method: 'GET', mode: 'cors', cache: 'reload' }).then(() => {
                            $labelButton.text('Save OK!');
                            location.href = new URL(location.href).origin;
                        });
                    }).fail((_jqXHR, _textStatus, errorThrown) => {
                        $labelButton.text('Upload Image').removeAttr('style');
                        $imageInput.val('');
                        alert(errorThrown);
                    });
                });
                reader.readAsDataURL($imageInput[0].files[0]);
            });
        };

       const mainObserver = new MutationObserver(() => {
            if ($('main').length) {
                avatar();
                mainObserver.disconnect();
            }
        });

        mainObserver.observe(document, { childList: true, subtree: true });
    });
})(window.jQuery.noConflict(true));