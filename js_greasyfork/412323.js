// ==UserScript==
// @name         ITS Classroom Presentations Downloader
// @description  Add download button on top presentation player
// @version      0.2
// @include      https://classroom.its.ac.id/course/view.php?id=*
// @include      https://image-private.slidesharecdn.com/*
// @grant        GM.xmlHttpRequest
// @namespace https://greasyfork.org/users/691782
// @downloadURL https://update.greasyfork.org/scripts/412323/ITS%20Classroom%20Presentations%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/412323/ITS%20Classroom%20Presentations%20Downloader.meta.js
// ==/UserScript==

(function(){
    if(window.location.hostname === 'classroom.its.ac.id')
    {
        var iframes = document.querySelectorAll('iframe[src*="slideshare"]');
        var iframe=null;
        for(var x = 0; x < iframes.length; ++x) {
            iframe = iframes[x]
            var url = iframe.src
            GM.xmlHttpRequest({
                method: "GET",
                url: url,
                headers: {
                    "User-Agent": "Mozilla/5.0", // If not specified, navigator.userAgent will be used.
                    "Accept": "text/xml" // If not specified, browser defaults will be used.
                },
                onload: (function(i, document){return function(response) {
                    var d = null;
                    d = new DOMParser().parseFromString(response.responseText, "text/html");
                    var images = d.querySelectorAll('img.slide_image');
                    var downloadBtn = document.createElement('button');
                    downloadBtn.innerHTML = 'Download Images'
                    downloadBtn.style.display = 'block';
                    downloadBtn.style.margin = '0 0 5px 0';
                    downloadBtn.onclick = (function(images) {return function(){
                        var img = null;
                        var link = null;
                        var a = null
                        for (i = 0; i < images.length; ++i) {
                            img = images[i];
                            link = img.attributes['data-full'].value;
                            a = document.createElement('a');
                            a.target = "_blank";
                            a.href = link;
                            a.click();
                        }
                    }})(images)
                    i.parentNode.insertBefore(downloadBtn, i);
                }})(iframe, document)
            });

        }
    } else if(window.location.hostname === 'image-private.slidesharecdn.com') {
        var pathnamea = window.location.pathname.split('/');
        var filenamea = pathnamea[1] + '---'+pathnamea[pathnamea.length-1];
        var imga = document.querySelector('img');
        var aa = document.createElement('a');
        aa.download= filenamea;
        aa.href = imga.src
        aa.click();
        window.close();
    }
})()
