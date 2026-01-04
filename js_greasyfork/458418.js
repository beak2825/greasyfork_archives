// ==UserScript==
// @name         'Sharty Filename Randomizer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Randomizes filenames on soyjak.party!
// @author       Unknown
// @match        https://soyjak.party/*
// @match        https://www.soyjak.party/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=soyjak.party
// @grant        none
// @license      wtfpl
// @downloadURL https://update.greasyfork.org/scripts/458418/%27Sharty%20Filename%20Randomizer.user.js
// @updateURL https://update.greasyfork.org/scripts/458418/%27Sharty%20Filename%20Randomizer.meta.js
// ==/UserScript==

$(document).off("drop click keypress paste");
const max_images = 4;

var files = [];
function addFile(file) {
    if (files.length == max_images)
        return;

    var fileName = `${Date.now() - Math.floor(Math.random() * 365 * 24*60*60*1000)}` + "." + file.name.split('.').pop();
    //var fileName = "."+file.name.split('.').pop();
    var newFile = new File([file.slice(0, file.size, file.type)], fileName, {type: file.type});
    files.push(newFile);
    addThumb(newFile);
}

function removeFile(file) {
    files.splice(files.indexOf(file), 1);
}

function getThumbElement(file) {
    return $('.tmb-container').filter(function(){return($(this).data('file-ref')==file);});
}

function addThumb(file) {

    var fileName = (file.name.length < 24) ? file.name : file.name.substr(0, 22) + '…';
    var fileType = file.type.split('/')[0];
    var fileExt = file.type.split('/')[1];
    var $container = $('<div>')
    .addClass('tmb-container')
    .data('file-ref', file)
    .append(
        $('<div>').addClass('remove-btn').html('✖'),
        $('<div>').addClass('file-tmb'),
        $('<div>').addClass('tmb-filename').html(fileName)
    )
    .appendTo('.file-thumbs');

    var $fileThumb = $container.find('.file-tmb');
    if (fileType == 'image') {
        // if image file, generate thumbnail
        var objURL = window.URL.createObjectURL(file);
        $fileThumb.css('background-image', 'url('+ objURL +')');
    } else {
        $fileThumb.html('<span>' + fileExt.toUpperCase() + '</span>');
    }
}

$(document).on('ajax_before_post', function (e, formData) {
    for (var i=0; i<max_images; i++) {
        var key = 'file';
        if (i > 0) key += i + 1;
        if (typeof files[i] === 'undefined') break;
        formData.append(key, files[i]);
    }
});

// clear file queue and UI on success
$(document).on('ajax_after_post', function () {
    files = [];
    $('.file-thumbs').empty();
});

var dragCounter = 0;
var dropHandler = {
    drop: function (e) {
        e.stopPropagation();
        e.preventDefault();

        $('.dropzone').removeClass('dragover');
        dragCounter = 0;

        var fileList = e.originalEvent.dataTransfer.files;
        for (var i=0; i<fileList.length; i++) {
            addFile(fileList[i]);
        }
    }
};


// attach handlers
$(document).on(dropHandler);

$(document).on('click', '.dropzone .remove-btn', function (e) {
    e.stopPropagation();

    var file = $(e.target).parent().data('file-ref');

    getThumbElement(file).remove();
    removeFile(file);
});

$(document).on('keypress click', '.dropzone', function (e) {
    e.stopPropagation();

    // accept mouse click or Enter
    if ((e.which != 1 || e.target.className != 'file-hint') &&
        e.which != 13)
        return;

    var $fileSelector = $('<input type="file" multiple>');

    $fileSelector.on('change', function (e) {
        if (this.files.length > 0) {
            for (var i=0; i<this.files.length; i++) {
                addFile(this.files[i]);
            }
        }
        $(this).remove();
    });

    $fileSelector.click();
});

$(document).on('paste', function (e) {
    var clipboard = e.originalEvent.clipboardData;
    if (typeof clipboard.items != 'undefined' && clipboard.items.length != 0) {

        //Webkit
        for (var i=0; i<clipboard.items.length; i++) {
            if (clipboard.items[i].kind != 'file')
                continue;

            //convert blob to file
            var file = new File([clipboard.items[i].getAsFile()], 'ClipboardImage.png', {type: 'image/png'});
            addFile(file);
        }
    }
});

