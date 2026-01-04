// ==UserScript==
// @name         Polytoria Image Embed Userscript
// @description  Adds image markdown support to Polytoria forums
// @version      1.1.4
// @author       Hawli The Hawli
// @license      LGPLv2.1
// @match        https://polytoria.com/forum/post/*
// @namespace https://greasyfork.org/users/1142699
// @downloadURL https://update.greasyfork.org/scripts/472328/Polytoria%20Image%20Embed%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/472328/Polytoria%20Image%20Embed%20Userscript.meta.js
// ==/UserScript==

const classes = document.getElementsByClassName("mb-0 w-100");
for (let i = 0; i < classes.length; i++) {

    const paragraphs = classes[i].querySelectorAll('p:not([class]):is(p)');

    for (let i = 0; i < paragraphs.length; i++) {

        let paragraph = paragraphs[i];

        const a = paragraph.querySelectorAll('a')

        for (let i = 0; i < a.length; i++) {
            var linkElement = a[i];

            var url = linkElement.href;

            // tenor

            if (url.startsWith("https://tenor.com/view/")) {
                const img = document.createElement('img');
                img.src = url;

                linkElement.removeChild(linkElement.querySelector('i'));

                const id = url.replace("https://tenor.com/view/", "");
                fetch(`https://tenor-gif-scrape-api.vercel.app/${id}`)
                    .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    return response.json();
                })
                    .then(data => {

                    img.src = data.contentValue;
                    img.classList.add('img-fluid')
                    img.classList.add('w-50')
                    img.style.borderRadius = "15px";
                    img.style.padding = "5px";
                });

                    linkElement.parentNode.replaceChild(img, linkElement);

            } else if (url.startsWith("https://i.imgur.com/a/")) {
                const img = document.createElement('img');
                const id = url.replace("https://i.imgur.com/a/", "");
                fetch(`https://imgur-api-xi.vercel.app/${id}`)
                    .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    return response.json();
                })
                    .then(data => {
                    img.src = data.image_link;
                    img.classList.add('img-fluid')
                    img.classList.add('w-50')
                    img.style.borderRadius = "15px";
                    img.style.padding = "5px";
                });

                linkElement.removeChild(linkElement.querySelector('i'));
                linkElement.parentNode.replaceChild(img, linkElement);
            } else if (url.startsWith("https://imgur.com/a/")) {
                const img = document.createElement('img');
                const id = url.replace("https://imgur.com/a/", "");
                fetch(`https://imgur-api-xi.vercel.app/${id}`)
                    .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    return response.json();
                })
                    .then(data => {
                    img.src = data.image_link;
                    img.classList.add('img-fluid')
                    img.classList.add('w-50')
                    img.style.borderRadius = "15px";
                    img.style.padding = "5px";
                });

                linkElement.removeChild(linkElement.querySelector('i'));
                linkElement.parentNode.replaceChild(img, linkElement);
            } else if (url.startsWith("https://i.imgur.com/")) {
                const img = document.createElement('img');
                img.src = url;

                linkElement.parentNode.replaceChild(img, linkElement);
                img.classList.add('img-fluid')
                img.classList.add('w-50')
                img.style.borderRadius = "15px";
                img.style.padding = "5px";
            } else if (url.startsWith("https://imgur.com/")) {
                const img = document.createElement('img');
                img.src = url + ".png";

                linkElement.parentNode.replaceChild(img, linkElement);
                img.classList.add('img-fluid')
                img.classList.add('w-50')
                img.style.borderRadius = "15px";
                img.style.padding = "5px";
            } else if (url.startsWith("https://www.youtube.com/embed/")) {
                linkElement.removeChild(linkElement.querySelector('i'));
                let youtubeUrl = linkElement.href;

                const iframe = document.createElement('iframe');
                const div = document.createElement('div');
                iframe.src = youtubeUrl;

                linkElement.parentElement.replaceChild(div, linkElement);
                div.style.cssText = "width: 640px; height: 360px;"
                iframe.style.cssText = 'height: 100%; width: 100%'
                iframe.style.borderRadius = "15px";
                div.appendChild(iframe);
            } else if (url.startsWith("https://www.youtube.com/watch?v=")) {
                let youtubeUrl = linkElement.href;
                youtubeUrl = youtubeUrl.replace("/watch?v=", "/embed/");


                const iframe = document.createElement('iframe');
                const div = document.createElement('div');
                iframe.src = youtubeUrl;

                linkElement.parentElement.replaceChild(div, linkElement);
                div.style.cssText = "width: 640px; height: 360px;"
                iframe.style.cssText = 'height: 100%; width: 100%'
                iframe.style.borderRadius = "15px";
                div.appendChild(iframe);
            } else if (url.startsWith("https://www.youtube.com/shorts/")) {
                var youtubeUrl = linkElement.href;
                youtubeUrl = youtubeUrl.replace("/shorts/", "/embed/");

                const iframe = document.createElement('iframe');
                const div = document.createElement('div');
                iframe.src = youtubeUrl;

                linkElement.parentElement.replaceChild(div, linkElement);
                div.style.cssText = "width: 640px; height: 360px;"
                iframe.style.cssText = 'height: 100%; width: 100%'
                iframe.style.borderRadius = "15px";
                div.appendChild(iframe);
            } else if (url.startsWith("https://youtu.be/")) {
                let youtubeUrl = linkElement.href;
                youtubeUrl = youtubeUrl.replace("youtu.be", "youtube.com/embed/");

                const iframe = document.createElement('iframe');
                const div = document.createElement('div');
                iframe.src = youtubeUrl;

                linkElement.parentElement.replaceChild(div, linkElement);
                div.style.cssText = "width: 640px; height: 360px;"
                iframe.style.cssText = 'height: 100%; width: 100%'
                iframe.style.borderRadius = "15px";
                div.appendChild(iframe);
            }
        }
    }
}
