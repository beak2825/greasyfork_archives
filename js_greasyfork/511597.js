// ==UserScript==
// @name         Stash Explorer
// @namespace    com.stash.apps.greasemonkey
// @version      2024-09-13
// @description  Open galleries/images in Windows Explorer. Requires included stashExplorer.py to be running locally.
// @author       stashtastic
// @match        http://localhost:9999/*
// @icon         https://docs.stashapp.cc/favicon.ico
// @grant        GM.xmlHttpRequest
// @connect      localhost
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511597/Stash%20Explorer.user.js
// @updateURL https://update.greasyfork.org/scripts/511597/Stash%20Explorer.meta.js
// ==/UserScript==

/*
In order for this script to work, you need to run a Python script which opens port 9998 on your computer, allowing this Userscript to invoke the script.
The script will open Windows Explorer for the given path name.

Save the below Python code a file (stashExplorer.py) and then run the script using Python:

from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse
from urllib.parse import parse_qs
import subprocess

class StashExplorerHandler(BaseHTTPRequestHandler):
    def o(self, text):
        text = str(text)
        print(f"[StashExplorer.py] {text}")
        output = text + "\n\n"
        self.wfile.write(output.encode("utf-8"))

    def do_GET(self):
        """handle GET requests."""
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()

        # Parse path
        parsed_url = urlparse(self.path)
        params = parse_qs(parsed_url.query)

        if "path" not in params:
            self.o(f"Could not find 'path' in params: {params}")
            return

        path = params["path"][0]
        path = path.replace('/', '\\')

        # Sanitize
        if '"' in path:
            path = path.replace('"', '\\"')

        command = f'explorer /select,"{path}"'
        self.o(f"Opening: {command}")
        subprocess.Popen(command)


def run(server_class=HTTPServer, handler_class=StashExplorerHandler):
    server_address = ('', 9998)
    httpd = server_class(server_address, handler_class)
    httpd.serve_forever()

run()
*/

(function() {
    'use strict';

    const CSS = `
.stash-explorer-button {
	display: inline-block;
    opacity: 0.7;
    transition: opacity linear 0.3s;
	float: left;
	background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADq0lEQVR4nO3YyVITURiG4V7JRXBDLnQJJM08IxAgQBJloQtGURFEEAwiguKAOJCBIWRiCoMQhECVXoaw/6w+nXTSdCfndAcJZeWvOvs8dfp/kw7HZSc72fm/ZqKjEFqOvYM/n7jH++0dxtvcdZhRGw+9Z8TKd2f683OD7TzSOhb+VkYB/WYj0jotBl9GAV1NBqRzOk2GPxkF3G8wIN2TUcDdugKkezIK2JlrwM6nBmx/rEfoQz1C7+9g610dtt7WYXOmFhvTtdh4U4P1qWqsv67G2mQVgq+qEJyoRMBeicDLCvjHy+EbK4fvRRm8I2XwPi/F6nAJPM9K4BkqxspgMVaeFmF5oAhLTwqx9JjH4iMei/1GuB8a4eozwNmTf+7oyt92duab3EM3c5gBu58bISGigNCsFkSFiCCAcvhGRcSqCmKZIAplCLeA6DPC1WuAq6cAzu4CLHTmhx1deblsgPlGEAS5BSViU0LUSIi1iwhyCxcRpWyIfp7cgrvPoEAw3cTevIkAdudiiHp2RBQQtCsRXhXECkEUiQgCKIw+SnKEM4pwdOU10gFfTIghdlQQWxKiVkKsCwhyC3FEQIEoU0EUi4joPsgRRgXC0Z0XogJ+fG2CHNGQGiHtQwxRpYIoV0V4NCx1FHFGB3xrQiqEVKbZNMo0qq9Mrl6GRO9/b0YiQlrqRITeMo3Ly+TVUiYB0cvwJbm/0Iw4wiRHXIMycbQ5cLQgEbEXQ+gt02TyMvloZRpQlokOcLYgjlDuw+4/L1NJyjJRAWGXGRLiwj4wl2mGpUwpEENqSy0i6AC3GWGnmQAOZPvAglBb6ppLLRNHm0N3K4RbiCHkS52iTAJCb5nG2MtEByy2Io5oYUPoLZNde5mogJ9LbRARZoKQL3VmyuRJKBMdsNyG1IgmEUEpUyhZmabSKNMgA+BopR0iopUgyFJfozJxVICnHUkResskIGbUf/gFaWUSEMPxH35UwPGqBSKijSAOBcSVlamSWiY6wGuBDCHtg8YyMb6SrqmVSfFKGn+UqICIzwqCiD5KR8tKRMoyzScutda8VlLLxASIeK3kFmIIepmadZdpQ2OZqIATn/VMRFhUEK1JEbrLNK2tTHSA37Zz4rciEXGdysRRHyG/zXQSsEEd0SZH6C1TGn+WcbT57TblnAZt4UTEVZdpPUWZOJb5tdWRq45IXqYwrUyX9ErKsU4k8uDGadDaGAnYQsc+y5nuMgmIS/yzjMtOdrKTnexwlzh/AeCDoXGTPr15AAAAAElFTkSuQmCC");
	background-color: transparent;
	background-repeat: no-repeat;
	background-size: 100% 100%;
	background-position: left center;
	margin-top: 0.5rem;
	min-height: 1.5rem;
	min-width: 1.5rem;
}
.stash-explorer-button:hover {
    opacity: 1;
}
    `;

    const cssStyle = document.createElement("style");
    cssStyle.textContent = CSS;
    document.head.appendChild(cssStyle);

    function setupObserver() {
        const rootObserver = new MutationObserver((mutationList, observer) => {
            for (const mutation of mutationList) {
                mutation.addedNodes.forEach(node => {
                    if (!node || !node.classList) return;
                    if (node.classList.contains("row") && !node.classList.contains("toast-container")) addExplorerLink(node);
                });
            }
        });
        const root = document.querySelector("#root");
        rootObserver.observe(root, { attributes: true, childList: true, subtree: true });
    }

    function getPath(node) {
        let imageFileInfo = node.querySelector(".image-file-info a[target='_blank'][href^='file:']");
        if (!imageFileInfo) {
            imageFileInfo = node.querySelector(".gallery-file-info a[target='_blank'][href^='file:']");
        }
        if (!imageFileInfo) {
            imageFileInfo = node.querySelector(".scene-file-info a[target='_blank'][href^='file:']");
        }
        if (!imageFileInfo) {
            console.log("[StashExplorer] Did not find image/gallery file info inside of", node);
            return null;
        }
        return imageFileInfo.href.replace("file:///", "");
    }

    function findContainer() {
        let container = document.querySelector(".image-tabs .image-header");
        if (!container) {
            container = document.querySelector(".gallery-tabs .gallery-header");
        }
        if (!container) {
            container = document.querySelector(".scene-tabs .scene-header");
        }
        if (!container) {
            console.log("[StashExplorer] Failed to find container in which the explorer button would go");
            return null;
        }
        return container;
    }

    function addExplorerLink(node) {
        let path = getPath(node);
        if (!path) return;

        let container = findContainer();
        if (!container) return;

        const input = document.createElement("div");
        input.text = "&nbsp;"
        input.classList.add("stash-explorer-button");
        input.dataset.stashExplorerPath = path;

        input.addEventListener("click", (event) => {
            const url = "http://localhost:9998/?path=" + encodeURIComponent(path);
            console.log("hitting URL", url);
            GM.xmlHttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    console.log("[StashExplorer] stashExplorer.py response:\n", response);
                },
                onabort: function(response) {
                    console.log("[StashExplorer] stashExplorer.py response:\n", response);
                },
                onerror: function(response) {
                    console.log("[StashExplorer] stashExplorer.py response:\n", response);
                },
            });
        });

        container.appendChild(input);
    }

    setupObserver();
})();