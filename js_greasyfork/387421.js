// ==UserScript==
// @name        FR:ES - BaseTao extension
// @namespace   https://www.reddit.com/user/RobotOilInc
// @author      RobotOilInc
// @version     0.10.1
// @description Quickly upload QC from BaseTao to Imgur, with help from AColdFloor
// @homepageURL https://greasyfork.org/scripts/387421-fr-es-basetao-extension
// @supportURL  https://greasyfork.org/scripts/387421-fr-es-basetao-extension
// @match       https://www.basetao.net/index/myhome/myorder/*
// @match       https://basetao.net/index/myhome/myorder/*
// @match       https://www.basetao.com/index/myhome/myorder/*
// @match       https://basetao.com/index/myhome/myorder/*
// @include     https://www.basetao.net/index/orderphoto/itemimg/*
// @include     https://basetao.net/index/orderphoto/itemimg/*
// @include     https://www.basetao.com/index/orderphoto/itemimg/*
// @include     https://basetao.com/index/orderphoto/itemimg/*
// @connect     self
// @connect     imgur.com
// @connect     fashionreps.tools
// @require     https://code.jquery.com/jquery-3.4.1.min.js
// @require     https://greasyfork.org/scripts/401399-gm-xhr/code/GM%20XHR.js
// @require     https://greasyfork.org/scripts/426288-webptojpg/code/WebpToJpg.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/spark-md5/3.0.0/spark-md5.min.js
// @grant       GM_openInTab
// @grant       GM_notification
// @grant       GM_xmlhttpRequest
// @run-at      document-end
// @icon        https://i.imgur.com/1aQAxbC.png
// @downloadURL https://update.greasyfork.org/scripts/387421/FR%3AES%20-%20BaseTao%20extension.user.js
// @updateURL https://update.greasyfork.org/scripts/387421/FR%3AES%20-%20BaseTao%20extension.meta.js
// ==/UserScript==

'use strict';

/* jshint esversion: 8 */
/* globals $:false, SparkMD5:false, GM_XHR: false, WebpToJpg: false */

const _version = "0.10.1";
const _url = "https://fashionreps.tools/";

const ClientIds = ["97a5f748b20b0ad", "1fb6eded0178bb6", "4d01890bba4949c", "fe9f4d770f42e53", "0999af252aaaba1", "6870f32f716ff3b", "bf02cd90c8a4f1a", "5ed540f56122e1c"];
const ActiveClientId = ClientIds[Math.floor(Math.random() * ClientIds.length)];

const username = $("#dropdownMenu1").text();
const userHash = SparkMD5.hash(username);

const toDataURL = url => fetch(url)
.then(response => response.blob())
.then(blob => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob)
}));

// Setup GM_XHR
$.ajaxSetup({ xhr: function() {return new GM_XHR; } });

const CreateOptions = async ($this) => {
    const options = await CreateBasicOptions($this);

    let sizingInfo = $.trim("Color: " + options.color + ((options.size != 'NO') ? " - Size: " + options.size : ''));
    let originalSizing = $.trim("Color: " + options.color + ((options.size != 'NO') ? " - Size: " + options.size : ''));
    let existingAlbum = await ExistingAlbum(options.w2c, sizingInfo, originalSizing);

    options.sizing = sizingInfo;
    options.originalSizing = originalSizing;
    options.existingAlbum = existingAlbum;

    return options;
}

const CreateBasicOptions = async ($this) => {
    const $baseElement = $this.parents("tr").find("td[colspan='2']").first();

    const w2cLink = $baseElement.find(".goodsname_color").first().attr('href').replace("http://", "https://");
    const title = $baseElement.find(".goodsname_color").first().text();

    const color = $baseElement.find(".size_color_color:nth-child(1) > u").text();
    const size = $baseElement.find(".size_color_color:nth-child(2) > u").text();

    const id = parseInt($this.parents("tr").prev().find("td.tdpd > span:nth-child(2)").text());

    return {id: id, title: title, object: $this, w2c: w2cLink, color: color, size: size};
}

const ExistingAlbum = async (w2c, originalSizing) => {
    let existingAlbum;

    try {
        existingAlbum = await $.get(_url + "qcdb/hasUploadedBefore.php?userhash=" + userHash + "&w2c=" + encodeURI(w2c) + "&sizing=" + encodeURI(originalSizing));

        // Connection failed, means an error on FR:ES. Return -1 to indicate issue.
        if (existingAlbum.indexOf("Connection failed") !== -1) {
            return -1;
        }

        if (existingAlbum != 0) {
            return existingAlbum;
        }

        return 0;
    } catch (error) {
        console.error("An error happened: " + error.statusText, error);
    }
};

const HasExistingQc = async (w2c) => {
    try {
        const data = await $.get(_url + "qcdb/qcExists.php", {'w2c': w2c})

        // No return equals no QC
        if (typeof data === 'undefined' || data === '') {
            return '0';
        }

        // Connection failed, means an error on FR:ES. Return -1 to indicate issue.
        if (data.indexOf("Connection failed") !== -1) {
            return '-1';
        }

        // Try to parse JSON, if it fails, issue with FR:ES. Return -1 to indicate issue.
        try {
            return JSON.parse(data).exists
        } catch (error) {
            console.error("An error happened when parsing JSON", error);

            return '-1';
        }
    } catch (error) {
        // No actual error, means no QC
        if (error.responseText === '') {
            return '0';
        }

        // Log error and return -1 to indicate issue.
        console.error("An error happened: " + error.statusText, error);

        return '-1';
    }
};

const CreateAlbum = async (options) => {
    let result;

    try {
        result = await $.ajax({
            url: 'https://api.imgur.com/3/album',
            headers: {'Authorization': 'Client-ID ' + ActiveClientId},
            type: 'POST',
            data: {
                'title': options.title,
                'privacy': 'hidden',
                'description': 'Auto uploaded using BaseTao to Imgur (v' + _version + '): https://greasyfork.org/scripts/387421-fr-es-basetao-extension'
            }
        });

        return result;
    } catch (error) {
        // Log the error somewhere
        console.error("Could not make an ablbum: " + error.statusText, error);

        // If we uploaded too fast, tell the user
        if (error.responseJSON.data.error.code === 429) {
            GM_notification("Imgur is telling us to slow down: " + error.responseJSON.data.error.message, "FR:ES - BaseTao");
            return;
        }

        // Tell the user that "something" is wrong
        GM_notification("Could not make an ablbum, please try again later...", "FR:ES - BaseTao");
    }
};

const AddImageToAlbum = async (base64Image, deleteHash, w2c) => {
    try {
        await $.ajax({
            url: 'https://api.imgur.com/3/image',
            headers: {'Authorization': 'Client-ID ' + ActiveClientId},
            type: 'POST',
            data: {'image': base64Image, 'type': 'base64', 'album': deleteHash, 'description': "W2C: " + w2c}
        });

        return true;
    } catch (error) {
        // If we uploaded too many files, tell the user
        if (error.responseJSON.data.error.code === 429) {
            GM_notification("Imgur is telling us to slow down: " + error.responseJSON.data.error.message, "FR:ES - BaseTao");
        }

        // Log errors somewhere
        console.error("An error happened when uploading the image: " + error.responseJSON.data.error.message, error);
        return false;
    }
};

const UploadToImgur = async (options) => {
    const $processing = $('<ul><li><span style="cursor: progress;margin-left:-29px;"><img src="https://i.imgur.com/lnFQTQz.gif" title="Processing..."></span></li></ul>');
    const $base = options.object;

    $base.after($processing);
    $base.hide();

    GM_notification("Pictures are being uploaded....", "FR:ES - BaseTao");

    // Create the album
    const response = await CreateAlbum(options);
    const deleteHash = response.data.deletehash;
    const albumId = response.data.id;

    const AlbumLink = "https://imgur.com/a/" + albumId;

    // Upload all QC images
    let uploadedImages = 0;
    const promises = [];
    $.each(options.imageUrls, (key, imageUrl) => {
        // Convert to base64, since Imgur cannot access our images
        promises.push(toDataURL(imageUrl).then(async (data) => {
            // Store our base64 and if the file is WEBP, convert it to JPG
            let base64Image = data;
            if (base64Image.indexOf("image/webp") !== -1) {
                base64Image = await WebpToJpg(base64Image)
            }

            // Remove the unnecassary `data:` part
            const cleanedData = base64Image.replace(/(data:image\/.*;base64,)/, "");

            // Upload the image to the album
            return AddImageToAlbum(cleanedData, deleteHash, options.w2c);
        }).then((uploaded) => {
            if (false === uploaded) {
                return;
            }

            uploadedImages++;
        }));
    });

    // Wait until everything has been tried to be uploaded
    await Promise.all(promises);

    // If not all images have been uploaded, abort everything
    if (uploadedImages !== options.imageUrls.length) {
        GM_notification("Error: Image upload failed. Try again later.", "FR:ES - BaseTao");
        $.ajax({headers: {'Authorization': 'Client-ID ' + ActiveClientId}, url: 'https://api.imgur.com/3/album/' + deleteHash, type: 'DELETE'});

        $processing.remove();
        $base.show();

        return;
    }

    // Tell the user it was uploaded and open the album in the background
    GM_notification("Pictures have been uploaded!", "FR:ES - BaseTao");
    GM_openInTab(AlbumLink, true);

    // Tell QC Suite about our uploaded QC's (if it's from TaoBao)
    if (options.w2c.indexOf('item.taobao.com') !== -1) {
        $.post(_url + "qcdb/qcdb.php", {
            'userhash': userHash,
            'imgur': albumId,
            'w2c': options.w2c,
            'sizing': options.sizing,
            'source': 'baseTaoToImgur'
        });
    }

    // Wrap the logo in a href to the new album
    const $image = $base.find('img');
    $image.wrap("<a href='" + AlbumLink + "' target='_blank' title='Go to album'></a>");
    $image.removeAttr('title');

    // Remove processing
    $processing.remove();

    // Update the marker
    const $qcMarker = $base.find('.qc-marker').first();
    $qcMarker.attr('title', 'You have uploaded your QC');
    $qcMarker.css('cursor', 'help');
    $qcMarker.css('color', 'green');
    $qcMarker.text('✓');

    // Remove the click handler
    $base.off();

    //Show it again
    $base.show();
};

const basicUploadHandler = async function () {
    const $this = $(this);
    const itemUrl = $this.data("item-url");
    const options = await CreateBasicOptions($this);

    // Go to the QC pictures URL and grab all image src's
    $.get(itemUrl, function (data) {
        let imageUrls = [];
        $('<div/>').html(data).find("div.container.container-top60 > img").each(function () {
            imageUrls.push($(this).attr('src'));
        });

        options.imageUrls = imageUrls;

        UploadToImgur(options);
    });
};

const uploadHandler = async function () {
    const $this = $(this);
    const itemUrl = $this.data("item-url");
    const options = await CreateOptions($this);

    // This is a safe-guard. The uploadHandler should not be assigned to anything that already has an album
    if (options.existingAlbum != 0 && options.existingAlbum != -1) {
        const $base = options.object;
        $base.off()

        const $image = $base.find('img');
        $image.wrap("<a href='https://imgur.com/a/" + options.existingAlbum + "' target='_blank' title='Go to album'></a>");
        $image.removeAttr('title');

        const $qcMarker = $base.find('.qc-marker:nth-child(2)');
        $qcMarker.css('cursor', 'help');
        $qcMarker.css('color', 'green');
        $qcMarker.text('✓');

        GM_openInTab("https://imgur.com/a/" + options.existingAlbum, true);

        return;
    }

    // Go to the QC pictures URL and grab all image src's
    $.get(itemUrl, function (data) {
        let imageUrls = [];
        $('<div/>').html(data).find("div.container.container-top60 > img").each(function () {
            imageUrls.push($(this).attr('src'));
        });

        options.imageUrls = imageUrls;

        UploadToImgur(options);
    });
};

(async function () {
    try {
        await $.ajax(_url + "qcdb/qcExists.php")
    } catch (error) {
        GM_notification("We are unable to connect to FR:ES. Please try again later.", "FR:ES - BaseTao");
        console.error("An error happened: " + error.statusText, error);

        return;
    }

    $(".myparcels-ul").find("span.glyphicon.glyphicon-picture").each(async function () {
        const $this = $(this);
        const basicOption = await CreateBasicOptions($this);

        // This plugin only works for TaoBao, anything else will be ignored, so only allow a basic upload
        if (basicOption.w2c.indexOf('item.taobao.com') === -1) {
            const $upload = $('<ul><li><span style="cursor: pointer;margin-left:-29px;"><img src="https://s.imgur.com/images/favicon-16x16.png" title="Create a basic album"></span></li></ul>');
            $upload.find('span').first().after($('<span class="qc-marker" style="cursor:help;margin-left:5px;color:red;font-weight: bold;" title="Not a supported URL, but you can still create an album. The QC\'s are not stored and you\'ll have to create a new album if you lose the link.">✖</span>'));
            $upload.data('item-url', $(this).parent().attr('href'));
            $upload.click(basicUploadHandler);

            $this.parents("td").first().append($upload);

            return;
        }

        // Get all information for this item (including existing albums, translations, etc)
        const option = await CreateOptions($(this));

        // Get exisiting data from FR:ES
        const existsData = await HasExistingQc(option.w2c);

        // Define basic upload object
        const $upload = $('<ul><li><span class="qc-marker" style="cursor: pointer;margin-left:-29px;"><img src="https://s.imgur.com/images/favicon-16x16.png" title="Upload your QC"></span></li></ul>');
        $upload.data('item-url', $(this).parent().attr('href'));

        // If we couldn't talk to FR:ES, assume everything is dead and use the basic uploader.
        if (existsData === '-1') {
            $upload.find('span').first().after($('<span class="qc-marker" style="cursor:help;margin-left:5px;color:red;font-weight: bold;" title="FR:ES returned an error, but you can still create an album. The QC\'s are not stored and you\'ll have to create a new album if you lose the link.">⚠️</span>'));
            $upload.data('item-url', $(this).parent().attr('href'));
            $upload.click(basicUploadHandler);

            $this.parents("td").first().append($upload);

            return;
        }

        // Has anyone ever uploaded a QC, if not, show a red marker
        if (existsData === '0') {
            $upload.find('span').first().after($('<span class="qc-marker" style="cursor:help;margin-left:5px;color:red;font-weight: bold;" title="No QC in database, please upload.">(!)</span>'));
            $upload.click(uploadHandler);

            $this.parents("td").first().append($upload);

            return;
        }

        // Have you ever uploaded a QC? If so, link to that album
        const $image = $upload.find('img');
        if (option.existingAlbum != 0 && option.existingAlbum != -1) {
            $upload.find('span').first().after($('<span class="qc-marker" style="cursor:help;margin-left:5px;color:green;font-weight: bold;" title="You have uploaded a QC">✓</span>'));
            $image.wrap("<a href='https://imgur.com/a/" + option.existingAlbum + "' target='_blank' title='Go to album'></a>");
            $image.removeAttr('title');

            $this.parents("td").first().append($upload);

            return;
        }

        // A previous QC exists, but you haven't uploaded yours yet, show orange marker
        $upload.find('span').first().after($('<span class="qc-marker" style="cursor:help;margin-left:5px;color:orange;font-weight: bold;" title="Your QC is not yet in the database, please upload.">(!)</span>'));
        $upload.click(uploadHandler);

        $this.parents("td").first().append($upload);
    });
})();