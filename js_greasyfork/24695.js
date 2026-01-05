// ==UserScript==
// @name        mirkoczat wrzucanie obrazków
// @namespace   https://mirkoczat.pl/t
// @description przeciągnij zdjęcie na okno mirkoczata, żeby je automatycznie wrzucić.
// @include     http://mirkoczat.pl/t/*
// @include     https://mirkoczat.pl/t/*
// @include     https://api.imgur.com/*
// @version     1.0
// @icon        https://mirkoczat.pl/images/icon.png
// @locale      pl
// @downloadURL https://update.greasyfork.org/scripts/24695/mirkoczat%20wrzucanie%20obrazk%C3%B3w.user.js
// @updateURL https://update.greasyfork.org/scripts/24695/mirkoczat%20wrzucanie%20obrazk%C3%B3w.meta.js
// ==/UserScript==

function append (text) {
    var c = $('#message-input').val();
    if (c.length > 0 && c.substring(c.length - 1) !== ' ') c += ' ';
    c += text;

    $('#message-input').val(c);
}

function info (text) {
    $('#message-input').attr('placeholder', text);
}

var uploading = 0;
function upload (file) {
    uploading++;
    $("body").css("cursor", "progress");

    var fd = new FormData();
    fd.append('image', file);

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4)
            return;

        uploading--;
        if (uploading === 0) {
            info('');
            $("body").css("cursor", "default");
        }

        if (xhr.status !== 200)
            return append('[nie można wrzucić obrazka]');

        var res = JSON.parse(xhr.responseText);
        if (!res.success)
            return append('[nie można wrzucić obrazka]');

        append(res.data.link);
        info('');
    };

    xhr.upload.onprogress = function (e) {
        var progress = e.loaded / e.total;

        info('[' + (progress * 100).toFixed(0) + '%]');
    };

    xhr.open('POST', 'https://api.imgur.com/3/image');
    xhr.setRequestHeader('Authorization', 'Client-ID ac0c5524d5f66a4');
    xhr.send(fd);
}

document.body.addEventListener('dragover', function (e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';

    info('[upuść, aby wrzucić obrazek]');
});

document.body.addEventListener('dragleave', function (e) {
    info('');
});

document.body.addEventListener('drop', function (e) {
    info('');

    e.stopPropagation();
    e.preventDefault();

    var files = e.dataTransfer.files;
    for (var i = 0; i < files.length; i++) {
        upload(files[i]);
    }
});