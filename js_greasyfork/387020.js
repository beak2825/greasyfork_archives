// ==UserScript==
// @name         Pinterest - Open Original Image and Save
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  Open the original (largest) image in a new tab by pressing 'z' while hovering over a pin，save the image.
// @author       haofong
// @include      https://*.pinterest.tld/*
// @grant        GM_openInTab
// @grant        GM_download

// @noframes
// @license      MIT
// @compatible   firefox Firefox
// @compatible   chrome Chrome
// @downloadURL https://update.greasyfork.org/scripts/387020/Pinterest%20-%20Open%20Original%20Image%20and%20Save.user.js
// @updateURL https://update.greasyfork.org/scripts/387020/Pinterest%20-%20Open%20Original%20Image%20and%20Save.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Custom key. Only single letters.
    const KEY_TO_OPEN = "z";

    // Immediately switch to new tab?
    // Note: Hold SHIFT key to do the opposite of this (e.g. shift-z)
    const ACTIVATE_NEW_TAB = true;

    function showImage(shouldActivateTab)
    {
        const imageUrl = getOriginalImage();
        if (imageUrl && /\.(?:jpe?g|png|gif|webp)$/.test(imageUrl)) {
            GM_openInTab(imageUrl, {active: shouldActivateTab});
            var fileName = CurentTime() + "—" + imageUrl.substr(imageUrl.lastIndexOf("/"));
            //download(imageUrl ,fileName, "image/gif" );
            //downloadURI(imageUrl, fileName);
            download3(imageUrl, fileName);
            //GM_download({
            //    url:imageUrl,
            //    saveAs:true,
            //    name:imageUrl.substr(imageUrl.lastIndexOf("/"))
            //});
        }
    }

    function downloadURI(uri, name) {
        // Create an invisible A element
        const a = document.createElement("a");
        a.style.display = "none";
        document.body.appendChild(a);

        // Set the HREF to a Blob representation of the data to be downloaded
        a.href = window.URL.createObjectURL(
            new Blob([uri], "image/gif")
        );

        // Use download attribute to set set desired file name
        a.setAttribute("download", name);

        // Trigger the download by simulating click
        a.click();

        // Cleanup
        window.URL.revokeObjectURL(a.href);
        document.body.removeChild(a);
    }

    function download3(data, strFileName){
        var x=new XMLHttpRequest();
        x.open("GET", data, true);
        x.responseType = 'blob';
        x.onload=function(e){download(x.response, strFileName, "image/gif" ); }
        x.send();
    }

    function download(data, strFileName, strMimeType) {

        var self = window, // this script is only for browsers anyway...
            u = "application/octet-stream", // this default mime also triggers iframe downloads
            m = strMimeType || u,
            x = data,
            D = document,
            a = D.createElement("a"),
            z = function(a){return String(a);},


            B = self.Blob || self.MozBlob || self.WebKitBlob || z,
            BB = self.MSBlobBuilder || self.WebKitBlobBuilder || self.BlobBuilder,
            fn = strFileName || "download",
            blob,
            b,
            ua,
            fr;

        //if(typeof B.bind === 'function' ){ B=B.bind(self); }

        if(String(this)==="true"){ //reverse arguments, allowing download.bind(true, "text/xml", "export.xml") to act as a callback
            x=[x, m];
            m=x[0];
            x=x[1];
        }
        //go ahead and download dataURLs right away
        if(String(x).match(/^data\:[\w+\-]+\/[\w+\-]+[,;]/)){
            return navigator.msSaveBlob ?  // IE10 can't do a[download], only Blobs:
                navigator.msSaveBlob(d2b(x), fn) :
            saver(x) ; // everyone else can save dataURLs un-processed
        }//end if dataURL passed?

        try{

            blob = x instanceof B ?
                x :
            new B([x], {type: m}) ;
        }catch(y){
            if(BB){
                b = new BB();
                b.append([x]);
                blob = b.getBlob(m); // the blob
            }

        }
        function d2b(u) {
            var p= u.split(/[:;,]/),
                t= p[1],
                dec= p[2] == "base64" ? atob : decodeURIComponent,
                bin= dec(p.pop()),
                mx= bin.length,
                i= 0,
                uia= new Uint8Array(mx);

            for(i;i<mx;++i) uia[i]= bin.charCodeAt(i);

            return new B([uia], {type: t});
        }
        function saver(url, winMode){
            if ('download' in a) { //html5 A[download]
                a.href = url;
                a.setAttribute("download", fn);
                a.innerHTML = "downloading...";
                D.body.appendChild(a);
                setTimeout(function() {
                    a.click();
                    D.body.removeChild(a);
                    if(winMode===true){setTimeout(function(){ self.URL.revokeObjectURL(a.href);}, 250 );}
                }, 66);
                return true;
            }

            //do iframe dataURL download (old ch+FF):
            var f = D.createElement("iframe");
            D.body.appendChild(f);
            if(!winMode){ // force a mime that will download:
                url="data:"+url.replace(/^data:([\w\/\-\+]+)/, u);
            }


            f.src = url;
            setTimeout(function(){ D.body.removeChild(f); }, 333);

        }//end saver


        if (navigator.msSaveBlob) { // IE10+ : (has Blob, but not a[download] or URL)
            return navigator.msSaveBlob(blob, fn);
        }

        if(self.URL){ // simple fast and modern way using Blob and URL:
            saver(self.URL.createObjectURL(blob), true);
        }else{
            // handle non-Blob()+non-URL browsers:
            if(typeof blob === "string" || blob.constructor===z ){
                try{
                    return saver( "data:" +  m   + ";base64,"  +  self.btoa(blob)  );
                }catch(y){
                    return saver( "data:" +  m   + "," + encodeURIComponent(blob)  );
                }
            }

            // Blob but not URL:
            fr=new FileReader();
            fr.onload=function(e){
                saver(this.result);
            };
            fr.readAsDataURL(blob);
        }
        return true;

    } /* end download() */

    function CurentTime(){
        var now = new Date();

        var year = now.getFullYear();       //年
        var month = now.getMonth() + 1;     //月
        var day = now.getDate();            //日

        var hh = now.getHours();            //时
        var mm = now.getMinutes();          //分
        var ss = now.getSeconds();           //秒

        var clock = year + "";

        if(month < 10)
            clock += "0";

        clock += month + "";

        if(day < 10)
            clock += "0";

        clock += day + "-";

        if(hh < 10)
            clock += "0";

        clock += hh + ":";
        if (mm < 10) clock += '0';
        clock += mm + ":";

        if (ss < 10) clock += '0';
        clock += ss;
        return(clock);
    }


    function getEventHandler(pin)
    {
        return Object.keys(pin).find(
            prop => prop.startsWith("__reactEventHandlers")
        );
    }

    function getPathToImagesFromChild(obj)
    {
        if (obj && obj.props) {
            if (obj.props.data && obj.props.data.images) {
                return obj.props.data.images;
            }
            if (obj.props.pin && obj.props.pin.images) {
                return obj.props.pin.images;
            }
        }
    }

    function getOriginalImage()
    {
        // TODO: split into two functions, or combine them somehow
        let path, handler;
        const hoveredElements = document.querySelectorAll(':hover');
        let len = hoveredElements.length;
        while (len--) {
            const el = hoveredElements[len];
            if (handler === undefined) handler = getEventHandler(el);
            if (!handler) continue;
            const target = el[handler];
            if (target && target.children) {
                if (Array.isArray(target.children)) {
                    for (let child of target.children) {
                        path = getPathToImagesFromChild(child);
                    }
                } else {
                    path = getPathToImagesFromChild(target.children);
                }
                if (path && path.orig && path.orig) {
                    return path.orig.url;
                }
            }
        }
        // Try again using img srcset
        len = hoveredElements.length;
        while (len--) {
            const el = hoveredElements[len];
            let img = el.querySelector('img[srcset]');
            if (el && img) {
                let srcset = img.srcset.split(/,\s*/);
                for (let src of srcset) {
                    if (src.includes('originals')) {
                        let imageOrig = src.split(/\s+/)[0];
                        return imageOrig;
                    }
                }
                return null;
            }
        }
    }

    window.addEventListener("keydown",
                            function(event) {
        // console.debug("active element:", document.activeElement);
        if (event.defaultPrevented ||
            /(input|textarea)/i.test(document.activeElement.nodeName) ||
            document.activeElement.matches('[role="textarea"]') ||
            document.activeElement.matches('[role="textbox"]'))
        {
            return;
        }
        switch (event.key) {
            case KEY_TO_OPEN.toLowerCase():
                showImage(ACTIVATE_NEW_TAB);
                break;
            case KEY_TO_OPEN.toUpperCase():
                showImage(!ACTIVATE_NEW_TAB);
                break;
            default:
                return;
        }
        event.preventDefault();
    },
                            true
                           );

})();