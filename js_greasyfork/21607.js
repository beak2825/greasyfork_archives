// ==UserScript==
// @name         SteamGifts comment formatting
// @description  Adds buttons to help you with formatting your comments and managing pictures and emoticons.
// @author       Bladito
// @version      0.7.1
// @homepageURL  https://greasyfork.org/en/users/55159-bladito
// @match        https://www.steamgifts.com/*
// @namespace    Bladito/sg-comment-formatting
// @require      http://code.jquery.com/jquery-latest.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/21607/SteamGifts%20comment%20formatting.user.js
// @updateURL https://update.greasyfork.org/scripts/21607/SteamGifts%20comment%20formatting.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    var storageImage = 'Bladito_sg_comments_images';
    var storageEmojis = 'Bladito_sg_comments_emojis';
    var commentTextareas = $('textarea[name="description"]');
    var targetTextarea; //textarea used for inserting images/emojis
    var lastRemovedImage, lastRemovedEmoji;

    if (commentTextareas.length) {
        enrichJquery();
        addStyles();
        addControls();
    }

    //--------------------------------------------------------------------------------------------------

    function addControls() {
        addWrappingFormatter('<i class="fa fa-italic"></i>', 'Italics', '*');
        addWrappingFormatter('<i class="fa fa-bold"></i>', 'Bold', '**');
        addWrappingFormatter('<i class="fa fa-italic"></i><i class="fa fa-bold"></i>', 'Italics and bold', '***');
        addWrappingFormatter('<i class="fa fa-low-vision"></i>', 'Spoiler', '~');
        addWrappingFormatter('<i class="fa fa-strikethrough"></i>', 'Strike through', '~~');

        addEmojis();
        addImages();

        commentTextareas.on('paste', handlePastedURL);
    }

    function addWrappingFormatter(buttonText, title, wrappingCharacters) {
        var bold = $('<button type="button" class="bsg-formatting-btn" title="' + title + '">' + buttonText + '</button>');
        bold.on('click', function() {
            insertToTextarea($(this).siblings('textarea'), wrappingCharacters, undefined, wrappingCharacters, function(textarea, textSelection) {
                textarea.bsgSelectRange(textSelection.start + wrappingCharacters.length, textSelection.end + wrappingCharacters.length);
            });
        });
        commentTextareas.before(bold);
    }

    function addEmojis() {
        var emojiPopup = $('<div class="bsg-emojis-popup">'+
                           '<div class="bsg-emojis-undo-area">Emoji removed. <a class="bsg-undo-emoji-btn">Undo</a><i class="bsg-emojis-undo-area-close fa fa-times"></i></div>' +
                           '<div class="bsg-emojis-add-area">' +
                           '<input class="bsg-add-emoji-input" placeholder="Add new Emoji here..."/>' +
                           '<button class="bsg-add-emoji-btn" type="button"><i class="fa fa-plus"></i></button>' +
                           '</div>' +
                           '<div class="bsg-emojis-container"></div></div>'),
            emojiButton = $('<button type="button" class="bsg-formatting-btn bsg-emojis-dropdown"><i class="fa fa-smile-o"></i></button>'),
            storedEmojis = getStoredEmojis();

        $('body').append(emojiPopup);
        commentTextareas.before(emojiButton);

        for (var i=0; i<storedEmojis.length; i+=1) {
            addEmoji(storedEmojis[i]);
        }

        $(document).mouseup(function(e) {
            if (!emojiPopup.is(e.target) && emojiPopup.has(e.target).length === 0) {
                emojiPopup.removeClass('m-shown');
            }
        });
        $('.bsg-emojis-dropdown').click(function() {
            var $this = $(this);
            targetTextarea = $this.siblings('textarea').eq(0);
            positionAndShowPopup(emojiPopup, $this);
        });
        $('.bsg-add-emoji-input').on('keypress', function(e) {
            if(e.which === 13){
                addNewUserEmoji();
            }
        });
        $('.bsg-add-emoji-btn').click(addNewUserEmoji);
        $('.bsg-undo-emoji-btn').click(undoRemovedEmoji);
        $('.bsg-emojis-undo-area-close').click(abandonRemovedEmoji);
    }

    function addNewUserEmoji() {
        var addEmojiInput = $('.bsg-add-emoji-input');
        var newEmoji = addEmojiInput.val();

        if (newEmoji && newEmoji.length > 0) {
            storeEmoji(newEmoji);
            addEmoji(newEmoji);
            addEmojiInput.val('');
            $('.bsg-emojis-container').scrollTop($('.bsg-emojis-container')[0].scrollHeight);
        }
    }

    function addEmoji(emojiString) {
        var emojiPopup = $('.bsg-emojis-popup'),
            emojiContainer = $('.bsg-emojis-container'),
            emojiElement = $('<div class="bsg-emoji-wrapper"><span class="bsg-emoji">' + emojiString + '</span></div>'),
            emojiRemoveButton = $('<span class="bsg-emoji-remove-button"><i class="fa fa-times"></i></span>');
        emojiElement.click(function() {
            insertToTextarea(targetTextarea, '', normalizeEmoji(emojiString), '', function(textarea, textSelection) {
                textarea.bsgSelectRange(textSelection.start + emojiString.length);
            });
            emojiPopup.toggleClass('m-shown');
        });
        emojiRemoveButton.click(function(event) {
            event.stopPropagation();
            removeEmoji(emojiRemoveButton.prev().text());
            emojiRemoveButton.parent().remove();
            $('.bsg-emojis-undo-area').addClass('m-shown');
        });
        emojiElement.append(emojiRemoveButton);
        emojiContainer.append(emojiElement);
    }

    function addImages() {
        var imgPopup = $('<div class="bsg-images-popup">' +
                         '<div class="bsg-images-undo-area">Image removed. <a class="bsg-undo-image-btn">Undo</a><i class="bsg-images-undo-area-close fa fa-times"></i></div>' +
                         '<div class="bsg-images-add-area">' +
                         '<input class="bsg-add-image-input" placeholder="Add new Image url here..."/>' +
                         '<button class="bsg-add-image-btn" type="button"><i class="fa fa-plus"></i></button>' +
                         '</div>' +
                         '<div class="bsg-images-container"></div></div>'),
            imgButton = $('<button type="button" class="bsg-formatting-btn bsg-images-dropdown"><i class="fa fa-picture-o"></i></button>'),
            storedImages = getStoredImages();

        $('body').append(imgPopup);
        commentTextareas.before(imgButton);

        for (var i=0; i<storedImages.length; i+=1) {
            addImage(storedImages[i]);
        }

        $(document).mouseup(function(e) {
            if (!imgPopup.is(e.target) && imgPopup.has(e.target).length === 0) {
                imgPopup.removeClass('m-shown');
            }
        });
        $('.bsg-images-dropdown').click(function() {
            var $this = $(this);
            targetTextarea = $this.siblings('textarea').eq(0);
            positionAndShowPopup(imgPopup, $this);
        });
        $('.bsg-add-image-input').on('keypress', function(e) {
            if(e.which === 13){
                addNewUserImage();
            }
        });
        $('.bsg-add-image-btn').click(addNewUserImage);
        $('.bsg-undo-image-btn').click(undoRemovedImage);
        $('.bsg-images-undo-area-close').click(abandonRemovedImage);
    }

    function addNewUserImage() {
        var addImageInput = $('.bsg-add-image-input');
        var newImage = addImageInput.val();

        if (newImage && newImage.length > 0) {
            storeImage(newImage);
            addImage(newImage);
            addImageInput.val('');
            $('.bsg-images-container').scrollTop($('.bsg-images-container')[0].scrollHeight);
        }
    }

    function addImage(imageUrl) {
        var imgPopup = $('.bsg-images-popup'),
            imgContainer = $('.bsg-images-container'),
            imgElement = $('<div class="bsg-image-wrapper"><img class="bsg-image" src="' + imageUrl + '"/></div>'),
            imgRemoveButton = $('<span class="bsg-image-remove-button"><i class="fa fa-times"></i></span>');
        imgElement.click(function() {
            insertToTextarea(targetTextarea, '![](', imageUrl, ')', function(textarea, textSelection) {
                textarea.bsgSelectRange(textarea.val().length - imageUrl.length - 3);
            }, true);
            imgPopup.toggleClass('m-shown');
        });
        imgRemoveButton.click(function(event) {
            event.stopPropagation();
            removeImage(imgRemoveButton.prev().attr('src'));
            imgRemoveButton.parent().remove();
            $('.bsg-images-undo-area').addClass('m-shown');

        });
        imgElement.append(imgRemoveButton);
        imgContainer.append(imgElement);
    }

    function undoRemovedImage() {
        if (lastRemovedImage) {
            //TODO insert it in correct position (lastRemovedImage.index)
            storeImage(lastRemovedImage.url);
            addImage(lastRemovedImage.url);
            abandonRemovedImage();
        }
    }
    function abandonRemovedImage() {
        $('.bsg-images-undo-area').removeClass('m-shown');
        lastRemovedImage = undefined;
    }

    function undoRemovedEmoji() {
        if (lastRemovedEmoji) {
            //TODO insert it in correct position (lastRemovedEmoji.index)
            storeEmoji(lastRemovedEmoji.text);
            addEmoji(lastRemovedEmoji.text);
            abandonRemovedEmoji();
        }
    }
    function abandonRemovedEmoji() {
        $('.bsg-emojis-undo-area').removeClass('m-shown');
        lastRemovedEmoji = undefined;
    }

    function positionAndShowPopup(popupElement, triggerElement) {
        var buttonWidth = 22,
            left = triggerElement.offset().left + buttonWidth;

        if (left + popupElement.width() > document.documentElement.clientWidth) {
            left = left - buttonWidth - popupElement.width();
        }
        popupElement.toggleClass('m-shown');
        popupElement.css({
            'top': triggerElement.offset().top - 306,
            'left': left
        });
    }

    function handlePastedURL(e) {
        var preChars = '[](',
            textArea = $(e.target),
            pastedData = (e.originalEvent || e).clipboardData.getData('text/plain');

        if (pastedData && /^https?:\/\/(?:[a-z0-9\-]+\.)+[a-z]{2,6}(?:\/[^/#?]+)+/i.test(pastedData)) {
            isValidImageUrl(pastedData, function(isImage) {
                if (isImage) {
                    preChars = '!' + preChars;
                    storeImage(pastedData);
                    addImage(pastedData);
                }
                insertToTextarea(textArea, preChars, pastedData, ')', function(textarea, textSelection) {
                    textarea.bsgSelectRange(textSelection.start + (preChars.length === 3 ? 1 : 2));
                });
            });
            e.stopPropagation();
            e.preventDefault();
        }

        function isValidImageUrl(url, callback) {
            var img = new Image();
            img.onerror = function() { callback(false); };
            img.onload =  function() { callback(true); };
            img.src = url;
        }
    }

    function insertToTextarea(commentTextarea, preChars, textBetween, postChars, callback, pasteAtEnd) {
        var newText, text = commentTextarea.val(),
            textSelection = commentTextarea.bsgGetSelection(),
            insertion = preChars + (textBetween || textSelection.text) + postChars;

        if (pasteAtEnd) {
            newText = (text.length ? (text + '\n') : '') + insertion;
        } else {
            newText = text.slice(0,textSelection.start) + insertion + text.slice(textSelection.end);
        }
        commentTextarea.val(newText);
        if (callback) {
            callback(commentTextarea, textSelection);
        }
    }

    function normalizeEmoji(emojiString) {
        return emojiString.replace(/\\/g, '\\\\').replace(/_/g, '\\_');
    }

    function enrichJquery() {
        $.fn.bsgSelectRange = function(start, end) {
            if(end === undefined) {
                end = start;
            }
            return this.each(function() {
                this.focus();
                if('selectionStart' in this) {
                    this.selectionStart = start;
                    this.selectionEnd = end;
                } else if(this.setSelectionRange) {
                    this.setSelectionRange(start, end);
                } else if(this.createTextRange) {
                    var range = this.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', end);
                    range.moveStart('character', start);
                    range.select();
                }
            });
        };
        //copied from https://github.com/localhost/jquery-fieldselection/blob/master/jquery-fieldselection.js
        $.fn.bsgGetSelection = function() {
            var e = (this.jquery) ? this[0] : this;
            return (
                /* mozilla / dom 3.0 */
                ('selectionStart' in e && function() {
                    var l = e.selectionEnd - e.selectionStart;
                    return { start: e.selectionStart, end: e.selectionEnd, length: l, text: e.value.substr(e.selectionStart, l) };
                }) ||

                /* exploder */
                (document.selection && function() {
                    e.focus();
                    var r = document.selection.createRange();
                    if (r === null) {
                        return { start: 0, end: e.value.length, length: 0 };
                    }

                    var re = e.createTextRange();
                    var rc = re.duplicate();
                    re.moveToBookmark(r.getBookmark());
                    rc.setEndPoint('EndToStart', re);

                    return { start: rc.text.length, end: rc.text.length + r.text.length, length: r.text.length, text: r.text };
                }) ||

                /* browser not supported */
                function() { return null; }
            )();
        };
    }

    function storeImage(url) {
        var images = getStoredImages();
        images.push(url);
        localStorage.setItem(storageImage, JSON.stringify(images));
    }
    function removeImage(url) {
        var images = getStoredImages(),
            index = images.indexOf(url);
        images.splice(index, 1);
        lastRemovedImage = {index: index, url: url};
        localStorage.setItem(storageImage, JSON.stringify(images));
    }
    function getStoredImages() {
        return JSON.parse(localStorage.getItem(storageImage)) || defaultImages();
    }

    function storeEmoji(emojiString) {
        var emojis = getStoredEmojis();
        emojis.push(emojiString);
        localStorage.setItem(storageEmojis, JSON.stringify(emojis));
    }
    function removeEmoji(emojiString) {
        var emojis = getStoredEmojis(),
            index = emojis.indexOf(emojiString);
        emojis.splice(index, 1);
        lastRemovedEmoji = {index: index, text: emojiString};
        localStorage.setItem(storageEmojis, JSON.stringify(emojis));
    }
    function getStoredEmojis() {
        return JSON.parse(localStorage.getItem(storageEmojis)) || defaultEmojis();
    }

    function defaultImages() {
        return [
            'https://i.imgflip.com/cnudu.jpg',
            'https://s-media-cache-ak0.pinimg.com/564x/9c/76/1f/9c761ffd187eef6e11e28188a6ff7075.jpg',
            'http://webtrax.hu/myfacewhen/faces/animals/kitty-facepalm.jpg',
            'http://www.getcatnipdaily.com/wp-content/uploads/sites/713/2015/05/4Kitty-barlow-250x200.jpg',
            'http://i24.photobucket.com/albums/c12/InkBlotPsycho/Cats/KITTY_crazy.jpg',
            'https://femmolitical.files.wordpress.com/2013/03/shocked-cat.jpg',
            'http://sadcatdiary.com/wp-content/uploads/2015/07/sadcatsmall.jpg'
        ];
    }
    function defaultEmojis() {
        return [
            '¯\\_(ツ)_/¯',
            '( ͡° ͜ʖ ͡°)',
            '( ͡⊙ ͜ʖ ͡⊙)',
            '(ノಠ益ಠ)ノ',
            '(╯°□°）╯︵ ┻━┻',
            '┬─┬ノ( º _ ºノ)',
            'ლ(ಠ益ಠლ)',
            '(◕‿-)✌',
            '(｡◕‿◕｡)',
            '(◑‿◐)',
            '◔_◔',
            '(•‿•)',
            '(ಠ_ಠ)',
            '(¬､¬)',
            '(─‿‿─)',
            '(ಥ﹏ಥ)',
            '(ಥ‸ಥ)',
            '(⌐■_■)',
            '(▰˘◡˘▰)',
            '乁( ◔ ౪◔)ㄏ',
            '(ง ͠° ͟ʖ ͡°)ง',
            'ζ༼Ɵ͆ل͜Ɵ͆༽ᶘ',
            'ʕ•ᴥ•ʔ',
            '( ͝° ͜ʖ͡°)',
            '(/ﾟДﾟ)/',
            '୧༼ಠ益ಠ༽୨',
            '(ง •̀_•́)ง'
        ];
    }

    function addStyles() {
        GM_addStyle('.bsg-formatting-btn { ' +
                    'display: inline-block;' +
                    'margin: 1px;' +
                    'border: 1px solid #d6d6d6;' +
                    'cursor: pointer;' +
                    'text-align: center;' +
                    'border-radius: 4px;' +
                    'background-color: #f3f3f3;' +
                    'background-image: none;' +
                    'color: #757575;' +
                    'min-width: 22px;' +
                    'height: 22px;' +
                    '}');
        GM_addStyle('.bsg-formatting-btn:hover {' +
                    'border-color: #B9D393 #96BC69 #73A442 #A0C870;' +
                    'background-image: linear-gradient(#cef2aa 0%, #b4e08a 50%, #9AC96A 100%);' +
                    'background-image: -moz-linear-gradient(#cef2aa 0%, #b4e08a 50%, #9AC96A 100%);' +
                    'background-image: -webkit-linear-gradient(#cef2aa 0%, #b4e08a 50%, #9AC96A 100%);' +
                    '}');
        GM_addStyle('.bsg-formatting-btn.bsg-emojis-dropdown, .bsg-formatting-btn.bsg-images-dropdown {' +
                    'float: right;' +
                    '}');
        GM_addStyle('.bsg-images-popup {' +
                    'display: none;' +
                    'position: absolute;' +
                    'width: 317px;' +
                    'height: 500px;' +
                    '}');
        GM_addStyle('.bsg-images-container {' +
                    'font-size: 0;' +
                    'overflow-y: auto;' +
                    'height: 450px;' +
                    'background: repeating-linear-gradient(-55deg,#222,#222 10px,#333 10px,#333 20px);' +
                    '}');
        GM_addStyle('.bsg-emojis-popup {' +
                    'display: none;' +
                    'position: absolute;' +
                    'height: 470px;' +
                    'min-width: 160px;' +
                    'max-width: 320px;' +
                    'color: black;' +
                    '}');
        GM_addStyle('.bsg-emojis-container {' +
                    'overflow-y: auto;' +
                    'height: 420px;' +
                    'background: repeating-linear-gradient(-55deg,#222,#222 10px,#333 10px,#333 20px);' +
                    '}');
        GM_addStyle('.bsg-emoji-wrapper {' +
                    'position: relative;' +
                    'display: block;' +
                    'margin: 0;' +
                    'padding: 5px;' +
                    'background: #fff;' +
                    'cursor: pointer;' +
                    'overflow: hidden;' +
                    'min-height: 17px;' +
                    'text-align: center;' +
                    '}');
        GM_addStyle('.bsg-emoji-wrapper:hover {' +
                    'background: #e8eeff;' +
                    '}');
        GM_addStyle('.bsg-emoji-wrapper:hover .bsg-emoji-remove-button {' +
                    'display: block;' +
                    '}');
        GM_addStyle('.bsg-emojis-add-area, .bsg-images-add-area {' +
                    'display: flex;' +
                    '}');
        GM_addStyle('input.bsg-add-emoji-input, input.bsg-add-image-input {' +
                    'border-left-width: 0;' +
                    'border-right-width: 0;' +
                    'border-radius: 0;' +
                    'flex: 1' +
                    '}');
        GM_addStyle('.bsg-add-emoji-btn, .bsg-add-image-btn {' +
                    'cursor: pointer;' +
                    'width: 17px;' +
                    'color: #545454;' +
                    'background-color: #dddddd;' +
                    '}');
        GM_addStyle('.bsg-add-emoji-btn:hover, .bsg-add-image-btn:hover {' +
                    'border-color: #B9D393 #96BC69 #73A442 #A0C870;' +
                    'background-image: linear-gradient(#cef2aa 0%, #b4e08a 50%, #9AC96A 100%);' +
                    'background-image: -moz-linear-gradient(#cef2aa 0%, #b4e08a 50%, #9AC96A 100%);' +
                    'background-image: -webkit-linear-gradient(#cef2aa 0%, #b4e08a 50%, #9AC96A 100%);' +
                    '}');
        GM_addStyle('.bsg-images-popup.m-shown, .bsg-emojis-popup.m-shown {' +
                    'display: block;' +
                    '}');
        GM_addStyle('.bsg-image-wrapper {' +
                    'cursor: pointer;' +
                    'position: relative;' +
                    'display: inline-block;' +
                    'width: 150px;' +
                    'height: 150px;' +
                    'margin: 0;' +
                    'padding: 0;' +
                    'background: #fff;' +
                    'overflow: hidden;' +
                    '}');
        GM_addStyle('.bsg-image-wrapper:hover .bsg-image-remove-button {' +
                    'display: block;' +
                    '}');
        GM_addStyle('.bsg-image {' +
                    'width: 150px;' +
                    'height: 150px;' +
                    '-webkit-transform: scale(1);' +
                    'transform: scale(1);' +
                    '-webkit-transition: .3s ease-in-out;' +
                    'transition: .3s ease-in-out;' +
                    '}');
        GM_addStyle('.bsg-images-undo-area, .bsg-emojis-undo-area {' +
                    'opacity: 0;' +
                    'background-color: #ffd5d5;' +
                    'height: 20px;' +
                    'line-height: 20px;' +
                    'padding-left: 5px;' +
                    'padding-right: 5px;' +
                    '}');
        GM_addStyle('.bsg-images-undo-area.m-shown, .bsg-emojis-undo-area.m-shown {' +
                    'opacity: 1;' +
                    '}');
        GM_addStyle('.bsg-undo-image-btn, .bsg-undo-emoji-btn {' +
                    'cursor: pointer;' +
                    'text-decoration: underline;' +
                    '}');
        GM_addStyle('.bsg-images-undo-area-close, .bsg-emojis-undo-area-close {' +
                    'cursor: pointer;' +
                    'float: right;' +
                    'top: 2px;' +
                    'position: relative;' +
                    '}');
        GM_addStyle('.bsg-image-remove-button, .bsg-emoji-remove-button {' +
                    'display: none;' +
                    'position: absolute;' +
                    'right: 5px;' +
                    'top: 5px;' +
                    'color: black' +
                    '}');
        GM_addStyle('.bsg-image-remove-button > .fa {' +
                    'font-size: 20px;' +
                    '}');
        GM_addStyle('.bsg-emoji-remove-button > .fa {' +
                    'font-size: 15px;' +
                    'color: #b7b7b7;' +
                    '}');
        GM_addStyle('.bsg-image-remove-button:hover > .fa, .bsg-emoji-remove-button:hover > .fa {' +
                    'color: red' +
                    '}');
        GM_addStyle('.bsg-image-wrapper:hover .bsg-image {' +
                    'height: 150px;' +
                    '-webkit-transform: scale(1.3);' +
                    'transform: scale(1.3);' +
                    '}');
    }

})(jQuery);
