// https://github.com/baivong/Userscript

(function () {
    'use strict';

    function generateZip(index, name) {

        var zip = new JSZip();

        box[('item' + index)].forEach(function (imgBlob) {
            zip.file(imgBlob.name, imgBlob.content);
        });

        zip.generateAsync({
            type: 'blob'
        }).then(function (blob) {
            self.postMessage({
                index: index,
                name: name,
                content: blob
            });
        }, function (reason) {
            self.postMessage(reason);
        });

    }

    var box = {};

    self.addEventListener('message', function (e) {

        var i = 'item' + e.data.index;
        if (!box[i]) box[i] = [];

        if (e.data.run) {
            generateZip(e.data.index, e.data.name);
        } else {
            box[i].push({
                name: e.data.name,
                content: e.data.content
            });
        }

    }, false);

})();
