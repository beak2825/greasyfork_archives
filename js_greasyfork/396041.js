// ==UserScript==
// @name        Wikipedia preview
// @description Shows previews for Wikipedia links inline
// @version     1.1
// @grant       GM.xmlHttpRequest
// @namespace   https://greasyfork.org/users/223733
// @match       *://*/*
// @run-at      document-start
// @connect     wikipedia.org
// @downloadURL https://update.greasyfork.org/scripts/396041/Wikipedia%20preview.user.js
// @updateURL https://update.greasyfork.org/scripts/396041/Wikipedia%20preview.meta.js
// ==/UserScript==

const regex = /^https?:\/\/(?:[a-z]+\.)wikipedia.org\/wiki\/(.+)/;
const apiReqBase = "https://en.wikipedia.org/api/rest_v1/page/summary/";

function fetchJson(url) {
	return new Promise(yay => {
  	GM.xmlHttpRequest({
    	method: "GET",
      url,
      onload(response) {
      	yay(JSON.parse(response.responseText));
      }
    });
  });
}

function attachToLink(link) {
    let timeout, mouseX, mouseY;
    link.addEventListener("mousemove", e => {
        mouseX = e.pageX;
        mouseY = e.pageY;
    });
    link.addEventListener("mouseover", () => {
        timeout = setTimeout(function() {
            const fn = async () => {
                const urlName = regex.exec(link.href)[1];
                const data = await fetchJson(apiReqBase + urlName);

                const container = document.createElement("a");
                container.href = data.content_urls.desktop.page;
                container.style.display = "block";
                container.style.position = "absolute";
                container.style.top = (mouseY - 10) + "px";
                container.style.left = (mouseX - 10) + "px";
                container.style.background = "white";
                container.style.borderRadius = "10px";
                container.style.boxShadow = "0 0 3px 0 #0007";
                container.style.overflowX = "hidden";
                container.style.overflowY = "auto";
                container.style.textDecoration = "none";
                container.style.width = "30vw";

                const title = document.createElement("h3");
                title.textContent = data.title;
                title.style.fontFamily = "sans-serif";
                title.style.fontWeight = "bold";
                title.style.fontSize = "1.3em";
                title.style.color = "black";
                title.style.padding = "1em 1.3em";
                title.style.borderBottom = "1px solid black";

                const image = document.createElement("img");
                image.style.width = "30vw";
                image.style.borderBottom = "1px solid grey";
              	image.onerror = () => {
                  console.log("error");
                	const cspError = document.createElement("p");
                  cspError.textContent = "Your browser won't let us load this image";
                  cspError.style.textAlign = "center";
                  cspError.style.fontFamily = "sans-serif";
                  cspError.style.color = "grey";
                  cspError.style.fontSize = ".8em";
                  cspError.style.padding = "1em 1.3em";
                  image.replaceWith(cspError);
                };
                image.src = data.originalimage && data.originalimage.source;

                const text = document.createElement("div");
                text.innerHTML = data.extract_html;
                text.style.color = "black";
                text.style.fontFamily = "sans-serif";
                text.style.padding = "1em 1.3em";

                container.appendChild(title);
                if (data.originalimage) container.appendChild(image);
                container.appendChild(text);
                document.body.appendChild(container);

                container.addEventListener("mouseout", () => {
                    container.remove();
                });
            };

            fn().catch(console.error);
        }, 200);
    });
    link.addEventListener("mouseout", () => clearInterval(timeout));
}

const mutationObserver = new MutationObserver(list => {
    Array.from(list)
        .map(el => el.target)
        .filter(el => regex.test(el.href))
        .forEach(attachToLink);
});

window.addEventListener("DOMContentLoaded", () => {
    const meta = document.createElement("meta");
    meta.setAttribute("http-equiv", "Content-Security-Policy");
    meta.setAttribute("content", "connect-src *");
    document.head.appendChild(meta);

    Array.from(document.querySelectorAll("a"))
        .filter(el => regex.test(el.href))
        .forEach(attachToLink);

    mutationObserver.observe(document.body, {
        attributes: true,
        childList: true,
        subtree: true
    });
});