// ==UserScript==
// @name         Rehost image to PTPIMG
// @version      0.08
// @namespace    https://orbitalzero.ovh/scripts/
// @description  Rehost images to a PTPIMG by ctrl+shift+clicking them
// @author       NeutronNoir, Chameleon@PTH
// @include      *
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/25784/Rehost%20image%20to%20PTPIMG.user.js
// @updateURL https://update.greasyfork.org/scripts/25784/Rehost%20image%20to%20PTPIMG.meta.js
// ==/UserScript==

(function() {
    var images = document.getElementsByTagName('img');
    Array.from(images).forEach(function (image) {
        image.addEventListener('click', rehost.bind(undefined, image), false);
    });
})();

function get_api_key() {
    var settings = JSON.parse(GM_getValue("rehost_image") || "{}");
    if (typeof settings.api_key !== "undefined") return new Promise(function (resolve, reject) {
        resolve(settings.api_key);
        return;
    });
    return new Promise( function (resolve, reject) {
        var request = new GM_xmlhttpRequest({method: "GET",
                                             url: "https://ptpimg.me/",
                                             responseType: "document",
                                             onload: function(response) {
                                                 if (response.status != 200) reject("Response error " + response.status);
                                                 if (response.finalUrl != "https://ptpimg.me/") reject("Couldn't retrieve api key");
                                                 settings.api_key = response.responseXML.getElementById("api_key").value;
                                                 GM_setValue("rehost_image", JSON.stringify(settings));
                                                 resolve(settings.api_key);
                                             }
                                            });
    });
}

function send_images(urls, api_key) {
    return new Promise(function(resolve, reject) {
        urls = urls.map(function (url) {
            if (url.indexOf("reho.st") == -1 && url.indexOf("discogs.com") != -1) return "http://reho.st/" + url;
            return url;
        });
        var boundary = "--NN-GGn-PTPIMG";
        var data = "";
        data += boundary + "\n";
        data += "Content-Disposition: form-data; name=\"link-upload\"\n\n";
        data += urls.join("\n") + "\n";
        data += boundary + "\n";
        data += "Content-Disposition: form-data; name=\"api_key\"\n\n";
        data += api_key + "\n";
        data += boundary + "--";
        var request = new GM_xmlhttpRequest({"method": "POST",
                                             "url": "https://ptpimg.me/upload.php",
                                             "responseType": "json",
                                             "timeou'": 10000,
                                             "headers": {
                                                 "Content-type": "multipart/form-data; boundary=NN-GGn-PTPIMG"
                                             },
                                             "data": data,
                                             "onload": function(response) {
                                                 if (response.status != 200) reject("Response error " + response.status);
                                                 else {
                                                     resolve(response.response.map(function (item) {
                                                         return "https://ptpimg.me/" + item.code + "." + item.ext;
                                                     }));
                                                 }
                                             },
                                             "ontimeout": function() {
                                                 reject("Request to ptpimg timed out");   
                                             }
                                            });
    });
}

function rehost(image, event)
{
    var alreadySent = image.getAttribute('sent');
    if(event.shiftKey && (event.ctrlKey || event.altKey) && alreadySent != "true")
    {
        event.preventDefault();
        var a=document.createElement('a');
        var imagePlace = image.getBoundingClientRect();
        a.setAttribute('style', 'position: absolute; top: '+(imagePlace.top+window.scrollY)+'px; left: '+(imagePlace.left+window.scrollX)+'px; width: '+image.width+'px; text-align: center; color: blue; background: rgba(255,255,255,0.6); border-radius: 0px 0px 10px 10px;');
        a.innerHTML = "Getting API key";
        document.body.appendChild(a);
        try {
            get_api_key().then(function (api_key) {
                a.innerHTML = 'Rehosting';
                return send_images([image.src], api_key);
            }).then(function (newUrls) {
                image.setAttribute('sent', 'true');
                a.href = newUrls[0];
                a.style.color = 'green';
                a.innerHTML = 'Rehosted';
                GM_setClipboard(newUrls[0]);
            }).catch(function (err) {
                a.style.color = 'red';
                a.innerHTML = err;
            });
        } catch (err) {
            a.style.color = 'red';
            a.innerHTML = err;
            console.log(err);
        }
        
    }
}