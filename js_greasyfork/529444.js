// ==UserScript==
// @name         Better client search archive theme (for the static temp dir)
// @namespace    http://tampermonkey.net/
// @version      2025-03-11
// @description  Better temp directory listing theme
// @author       Pooiod7
// @match        https://robloxopolis.com/archive/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=robloxopolis.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529444/Better%20client%20search%20archive%20theme%20%28for%20the%20static%20temp%20dir%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529444/Better%20client%20search%20archive%20theme%20%28for%20the%20static%20temp%20dir%29.meta.js
// ==/UserScript==

(function () {
    let meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1';
    document.head.appendChild(meta);

    let fa = document.createElement('link');
    fa.rel = 'stylesheet';
    fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
    document.head.appendChild(fa);

    let style = document.createElement('style');
    style.textContent = `
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }
        body {
            background: #f7f7f7;
            color: #333;
            padding: 20px;
            font-size: 16px;
            text-align: center;
        }
        h1 {
            font-size: 22px;
            margin-bottom: 15px;
        }
        .file-list {
            width: 100%;
            max-width: 600px;
            margin: auto;
            text-align: left;
        }
        .file-item {
            display: flex;
            align-items: center;
            padding: 8px;
            border-bottom: 1px solid #ccc;
        }
        .file-item i {
            font-size: 18px;
            color: #555;
            margin-right: 8px;
            width: 24px;
            text-align: center;
        }
        .file-item a {
            text-decoration: none;
            color: #007bff;
            font-weight: 600;
            flex-grow: 1;
        }
        .file-item span {
            font-size: 14px;
            color: #888;
        }
        @media (max-width: 500px) {
            body {
                padding: 10px;
            }
            h1 {
                font-size: 18px;
            }
            .file-item {
                padding: 6px;
            }
            .file-item i {
                font-size: 16px;
            }
            .file-item a {
                font-size: 14px;
            }
            .file-item span {
                font-size: 12px;
            }
        }
    `;
    document.head.appendChild(style);

    let currentPath = window.location.pathname.replace(/\/$/, "");
    let pageTitle = currentPath === "/archive" ? "Client Search Archives" : "Index of " + currentPath;
    
    let titleElement = document.createElement("h1");
    titleElement.textContent = pageTitle;
    
    let rows = [...document.querySelectorAll("tr")].slice(2);
    let container = document.createElement("div");
    container.classList.add("file-list");

    rows.forEach(row => {
        let img = row.querySelector("td img");
        let link = row.querySelector("td a");
        let date = row.cells[2] ? row.cells[2].textContent.trim() : "";

        if (img && link) {
            let item = document.createElement("div");
            item.classList.add("file-item");

            let icon = document.createElement("i");
            let isParentDir = img.alt.includes("PARENTDIR");

            if (isParentDir) {
                if (window.location.pathname === "/archive/") {
                    icon.classList.add("fas", "fa-home");
                    link.textContent = "Home";
                    link.href = "/";
                } else {
                    icon.classList.add("fas", "fa-arrow-up");
                }
            } else if (img.alt.includes("DIR")) {
                icon.classList.add("fas", "fa-folder");
            } else {
                icon.classList.add("fas", "fa-file");
            }

            let dateSpan = document.createElement("span");
            dateSpan.textContent = date;

            item.appendChild(icon);
            item.appendChild(link);
            item.appendChild(dateSpan);
            container.appendChild(item);
        }
    });

    document.body.innerHTML = "";
    document.body.appendChild(titleElement);
    document.body.appendChild(container);
})();