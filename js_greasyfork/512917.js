// ==UserScript==
// @name         Privacy HLS Stream Downloader
// @namespace    http://tampermonkey.net/
// @license      GPL-3.0
// @version      2025.03.24
// @description  Automatically download HLS streams from Privacy
// @author       Rvnsxmwvrx
// @match        https://privacy.com.br/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=privacy.com.br
// @grant        GM_cookie
// @grant        GM_xmlhttpRequest
// @run-at documentEnd
// @downloadURL https://update.greasyfork.org/scripts/512917/Privacy%20HLS%20Stream%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/512917/Privacy%20HLS%20Stream%20Downloader.meta.js
// ==/UserScript==

(function () {
    "use strict";
    async function decryptSegment(encryptedData, key) {
  const iv = new Uint8Array(16); // Use a fixed IV or derive it as needed
  const algorithm = { name: 'AES-CBC', iv };

  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    key,
    algorithm,
    false,
    ['decrypt']
  );

  const decryptedData = await window.crypto.subtle.decrypt(
    algorithm,
    cryptoKey,
    encryptedData
  );

  return new Uint8Array(decryptedData); // Return decrypted data
}


    async function filterHLS(urlBegin, text, content) {
        const is_encrypted = text.includes("keyaes")
        let key = undefined
        if(is_encrypted) {
        const key_uri_begin = text.indexOf(`URI="`) + 5
        const key_uri_end = text.substring(key_uri_begin).indexOf('"')
        const key_uri = text.substring(key_uri_begin, key_uri_begin + key_uri_end)
        console.log(key_uri)
        const key_request = await fetch(key_uri, {
        headers: {
        "Host": "keyaes.privacy.com.br",
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:134.0) Gecko/20100101 Firefox/134.0",
    "Accept": "*/*",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Content-Type": "application/json",
            "content": content,
    "x-content-uri": "keyaes.key",
    "Origin": "https://privacy.com.br",
    "Connection": "keep-alive",
    "Referer": "https://privacy.com.br/",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-site"
        }
        })
        if(!key_request.ok) {
            console.warn(key_request.status)
            return []
        }
        key = await key_request.arrayBuffer()
        }
        let rtn = [];
        for (let line of text.split("\n")) {
            if (line.startsWith("#")) continue;
            rtn.push({ key: key, url: urlBegin + line } );
        }
        let fhd = rtn.filter((e) => e.url.includes("1080p"));
        if (fhd.length > 0) return fhd;
        let hd = rtn.filter((e) => e.url.includes("720p"));
        if (hd.length > 0) return hd;
        return rtn[0];
    }

    async function downloadFiles(div, button, urls) {
        let count = 1;
        for (let url of urls) {
            let start = url.lastIndexOf("/");
            let filename = url.substring(start);
            let split = url.indexOf("hls/") + 4;
            let urlBegin = url.substring(0, split);
            const content = button.getAttribute("content")
            await fetch(url, {
                headers: {
                    "Host": "video.privacy.com.br",
                    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:134.0) Gecko/20100101 Firefox/134.0",
                    "Accept": "*/*",
                    "Accept-Language": "en-US,en;q=0.5",
                    "Accept-Encoding": "gzip, deflate, br, zstd",
                    "Content-Type": "application/json",
                    "content": content,
                    "x-content-uri": filename.substring(1),
                    "Origin": "https://privacy.com.br",
                    "Connection": "keep-alive",
                    "Referer": "https://privacy.com.br/",
                    "Sec-Fetch-Dest": "empty",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Site": "same-site"
                },
            })
                .then((response) => response.text())
                .then(async (text) => {
                    const fileContent = text;
                    let video = await filterHLS(urlBegin, text, button.getAttribute(content));
                    await helper(div, button, urlBegin, video[0], url);
                })
                .catch((err) => console.error("Error downloading file:", err));
        }
    }

    const maxRetries = 10;
    async function helper(div, button, beginUrl, url, eUrl) {
        const x_content_uri_begin = url.url.indexOf("hls/") + 4
            const x_content_uri = url.url.substring(x_content_uri_begin)

        fetch(url.url, {
        headers: {
    "Host": "video.privacy.com.br",
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:134.0) Gecko/20100101 Firefox/134.0",
    "Accept": "*/*",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Content-Type": "application/json",
            "content": button.getAttribute("content"),
    "x-content-uri": x_content_uri,
    "Origin": "https://privacy.com.br",
    "Connection": "keep-alive",
    "Referer": "https://privacy.com.br/",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-site"
  }
        })
            .then((response) => response.text())
            .then(async (text) => {
                let element = div.getElementsByClassName(eUrl)[0];
                let tsFiles = await filterHLS(beginUrl, text, button.getAttribute("content"));
                await downloadVideos(element, button, tsFiles);
            })
            .catch((err) => console.error("Error downloading file:", err));
    }

    async function downloadVideos(element, button, tsFiles) {
    const combinedBuffers = [];
    const end = tsFiles[0].url.indexOf("--");
    const name = tsFiles[0].url.substring(0, end);
    const oldName = button.innerText;

    // Fetch all the ts files and push the buffers into the combinedBuffers array
    for (const ts of tsFiles) {
        const tsFile = ts.url;
        let retries = 0;
        const content = button.getAttribute("content");
        const x_content_uri_begin = tsFile.indexOf("hls/") + 4;
        const x_content_uri = tsFile.substring(x_content_uri_begin);
        const headers = {
            "Host": "video.privacy.com.br",
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:134.0) Gecko/20100101 Firefox/134.0",
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            "Content-Type": "application/json",
            "content": content,
            "x-content-uri": x_content_uri,
            "Origin": "https://privacy.com.br",
            "Connection": "keep-alive",
            "Referer": "https://privacy.com.br/",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site"
        };

        let response = await fetch(tsFile, { headers });
        if (!response.ok) return;

        while (!response.ok && retries < maxRetries) {
            setTimeout(() => { }, 500);
            response = await fetch(tsFile, { headers });
            retries += 1;
        }

        let arrayBuffer = await response.arrayBuffer();
        if(ts.key) {
          arrayBuffer = await decryptSegment(arrayBuffer, ts.key)
        }
        combinedBuffers.push(arrayBuffer);

        let percent = (combinedBuffers.length / tsFiles.length) * 100;
        element.innerText = `(${percent.toPrecision(2)}%) `;
        button.innerText = "Downloading...";
    }

    // Combine all ArrayBuffers into one single ArrayBuffer
    let totalLength = combinedBuffers.reduce((sum, buffer) => sum + buffer.byteLength, 0);
    let combinedArrayBuffer = new ArrayBuffer(totalLength);
    let view = new Uint8Array(combinedArrayBuffer);
    let offset = 0;

    for (let buffer of combinedBuffers) {
        view.set(new Uint8Array(buffer), offset);
        offset += buffer.byteLength;
    }

    // Update UI and prepare the video file for download
    element.innerText = "(0%)";
    button.innerText = oldName;

    const videoBlob = new Blob([combinedArrayBuffer], { type: "video/mp2t" });
    const url = URL.createObjectURL(videoBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = name + ".ts";
    downloadLink.textContent = "Download Combined Video";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    URL.revokeObjectURL(url);
}


    async function waitForShadowRoot(element) {
        while (!element.shadowRoot) {
            console.log("waiting for shadow root");
            console.log(element.shadowRoot);
            await new Promise((resolve) => setTimeout(resolve, 500)); // Wait 50ms before checking again
        }
        console.log("out of loop");
    }

    let allVideos = new Set();
    let elementIds = new Set();

    async function find_docs() {
        let elements = document.querySelectorAll("privacy-web-mediahub-carousel");
        for (let i = 0; i < elements.length; i++) {
            let element = elements[i];
            if (elementIds.has(element.getAttribute("id"))) continue;
            elementIds.add(element.getAttribute("id"));
            let mediasStr = element.getAttribute("medias");
            let medias = collectObjects(mediasStr);
            let videos = medias
                .filter(
                    (e) => e.url && e.url.endsWith(".m3u8") && !allVideos.has(e.url)
                )
                .map((e) => e.url);
            videos.forEach((e) => allVideos.add(e));
            if (videos.length < 1) continue;
            let start = videos[0].indexOf("hls/") + 4;
            const fstart = videos[0].indexOf(".br/") + 4
            const file_id = videos[0].substring(fstart, start - 5)
            const token = element.getAttribute("token")
            const content_request = await fetch("https://service.privacy.com.br/media/video/token", {
              method: "POST",
                headers: {
                    "Host": "service.privacy.com.br",
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:134.0) Gecko/20100101 Firefox/134.0",
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
    "Content-Length": token.length,
    "Origin": "https://privacy.com.br",
    "Connection": "keep-alive",
    "Referer": "https://privacy.com.br/",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-site",
    "TE": "trailers"
                },
                body: JSON.stringify({
                    exp: 3600,
                    file_id: file_id
                })
            })
            if(!content_request.ok) {
                console.warn(content_request.status)
                continue
            }
            const content = (await content_request.json()).content
            console.log("FILE_ID: " + file_id)
            let end = videos[0].indexOf("--");
            let buttonId = videos[0].substring(start, end);
            await waitForShadowRoot(element);
            console.log("Got shadow root for " + element.getAttribute("id"));
            let shadow = element.shadowRoot;
            let div = document.createElement("div");
            div.setAttribute("style", "display:flex;");
            console.log(videos[0]);
            let button = document.createElement("button");
            if (videos.length == 1) {
                button.innerText = "Download Video";
            } else {
                button.innerText = "Download " + videos.length + " Videos";
            }
            button.setAttribute("content", content)
            button.setAttribute("id", buttonId);
            button.addEventListener("click", function () {
                downloadFiles(div, button, videos);
            });
            div.appendChild(button);
            for (let video of videos) {
                let element = document.createElement("p");
                element.setAttribute("class", video);
                element.innerText = "(0%)";
                div.appendChild(element);
            }
            shadow.appendChild(div);
            elementIds.add(element.getAttribute("id"));
        }
    }
    let count = 0;
    let cookie = {};
    GM_cookie.list(
        { name: "__cf_bm", httpOnly: true },
        function (cookies, error) {
            if (!error) {
                cookie = cookies[0].value;
            } else {
                console.error(error);
            }
        }
    );
    async function find_mp4() {
        let elements = document.querySelectorAll("privacy-web-mediahub-carousel");
        for (let i = 0; i < elements.length; i++) {
            let element = elements[i];
            elementIds.add(element.getAttribute("id"));
            let mediasStr = element.getAttribute("medias");
            let medias = collectObjects(mediasStr);
            let videos = medias
                .filter((e) => e.url && e.url.endsWith(".mp4") && !allVideos.has(e.url))
                .map((e) => e.url);
            videos.forEach((e) => allVideos.add(e));
            if (videos.length < 1) continue;
            let start = videos[0].indexOf("mp4/") + 4;
            let end = videos[0].indexOf("--");
            let buttonId = videos[0].substring(start, end);
            await waitForShadowRoot(element);
            console.log("Got shadow root for " + element.getAttribute("id"));
            let shadow = element.shadowRoot;
            let div = document.createElement("div");
            div.setAttribute("style", "display:flex;");
            console.log(videos[0]);
            let button = document.createElement("button");
            if (videos.length == 1) {
                button.innerText = "Download Video";
            } else {
                button.innerText = "Download " + videos.length + " Videos";
            }
            button.setAttribute("id", buttonId);
            button.addEventListener("click", async function () {
                await downloadMp4(videos);
            });
            div.appendChild(button);
            for (let video of videos) {
                let element = document.createElement("p");
                element.setAttribute("class", video);
                element.innerText = "(0%)";
                div.appendChild(element);
            }
            shadow.appendChild(div);
            elementIds.add(element.getAttribute("id"));
        }
    }
    let allPhotos = new Set()

    async function find_images() {
        let elements = document.querySelectorAll("privacy-web-mediahub-carousel");
        for (let i = 0; i < elements.length; i++) {
            let element = elements[i];
            elementIds.add(element.getAttribute("id"));
            let mediasStr = element.getAttribute("medias");
            let medias = collectObjects(mediasStr);
            let photos = medias
                .filter((e) => e.type && e.type == "image" && !allPhotos.has(e.url))
                .map((e) => e.url);
            photos.forEach((e) => allPhotos.add(e));
            if (photos.length < 1) continue;
            let start = photos[0].indexOf(".br/") + 4;
            let end = photos[0].indexOf("--");
            let buttonId = photos[0].substring(start, end);
            await waitForShadowRoot(element);
            console.log("Got shadow root for " + element.getAttribute("id"));
            let shadow = element.shadowRoot;
            let div = document.createElement("div");
            div.setAttribute("style", "display:flex;");
            console.log("PHOTO " + photos[0]);
            let button = document.createElement("button");
            if (photos.length == 1) {
                button.innerText = "Download Video";
            } else {
                button.innerText = "Download " + photos.length + " Images";
            }
            button.setAttribute("id", buttonId);
            button.addEventListener("click", async function () {
                await downloadImages(photos);
            });
            div.appendChild(button);
            shadow.appendChild(div);
            elementIds.add(element.getAttribute("id"));
        }
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
    }

    async function downloadMp4(videos) {
        for (let url of videos) {
            try {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    headers: {
                        Host: "video.privacy.com.br",
                        Accept: "video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,audio/*;q=0.6,*/*;q=0.5",
                        "Accept-Language": "en-US,en;q=0.5",
                        Range: "bytes=0-",
                        Connection: "keep-alive",
                        Referer: "https://privacy.com.br/",
                        Cookie: cookie,
                        "Sec-Fetch-Dest": "video",
                        "Sec-Fetch-Mode": "no-cors",
                        "Sec-Fetch-Site": "same-site",
                        "Accept-Encoding": "identity",
                        Priority: "u=4",
                        TE: "trailers",
                    },
                    responseType: "arraybuffer", // Set responseType to arraybuffer
                    onload: function (response) {
                        // Convert the ArrayBuffer to a Blob
                        const blob = new Blob([response.response], { type: "video/mp4" }); // adjust MIME type as needed

                        // Create a downloadable link
                        const link = document.createElement("a");
                        link.href = URL.createObjectURL(blob);
                        link.download = url; // Set a default filename, or use `url` if needed

                        // Append, click, and remove the link to start the download
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);

                        // Clean up the object URL
                        URL.revokeObjectURL(link.href);
                        console.log(`Download started: ${url}`);
                    },
                    onerror: function (error) {
                        console.error("Download failed:", error);
                    },
                });

            } catch (e) {
                console.error(e)
            }
        }
    }


    async function downloadImages(images) {
        for (let url of images) {
            try {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    headers: {
                        Host: "image.privacy.com.br",
                        Accept: "image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5",
                        "Accept-Language": "en-US,en;q=0.5",
                        Connection: "keep-alive",
                        Referer: "https://privacy.com.br/",
                        Cookie: cookie,
                        "Sec-Fetch-Dest": "image",
                        "Sec-Fetch-Mode": "no-cors",
                        "Sec-Fetch-Site": "same-site",
                        "Accept-Encoding": "gzip, deflate, br, zstd",
                        Priority: "u=5",
                        TE: "trailers",
                    },
                    responseType: "arraybuffer", // Set responseType to arraybuffer
                    onload: function (response) {
                        // Convert the ArrayBuffer to a Blob
                        const blob = new Blob([response.response], { type: "image/jpeg" }); // adjust MIME type as needed

                        // Create a downloadable link
                        const link = document.createElement("a");
                        link.href = URL.createObjectURL(blob);
                        console.log(url)
                        link.download = url.split("/").pop();

                        // Append, click, and remove the link to start the download
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);

                        // Clean up the object URL
                        URL.revokeObjectURL(link.href);
                    },
                    onerror: function (error) {
                        console.error("Download failed:", error);
                    },
                });

            } catch (e) {
                console.error(e)
            }
        }
    }

    function collectObjects(mediasStr) {
        let start = 0;
        let offset = 0;
        let objects = [];
        for (let i = 0; i < mediasStr.length; i++) {
            let char = mediasStr[i];
            if (char == "{") {
                start = i;
            } else if (char == "}") {
                let objStr = mediasStr.substring(start, start + offset + 1);
                objects.push(JSON.parse(objStr));
                offset = 0;
            } else {
                offset += 1;
            }
        }
        return objects;
    }

    setInterval(async () => {
        await find_docs()
        await find_mp4()
        await find_images()
    }, 1000);
})();
