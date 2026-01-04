// ==UserScript==
// @name         SerienStream / AniWorld - Watched Notitifications
// @description  Marks the read notifications in color
// @namespace    https://github.com/M4RC-XX
// @version      2.0
// @author       M-XRC-XX
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABhlBMVEU9mtgpaJI3jcY+nd0oZpA7l9Q4jcY+nd1Ao+VApOZDq/BErvRErfRErfNErPJDrPFDq/FErPFDqu9Dqu5Cqe1CqOxApuo/pelBpulCp+pCqOtCp+lltuxvuuxHpuU+ouVApOdot+vp9Pz3+/6/3/VqteY/oOE+oeNDqe49o+eEw+3+///////v9/yn0u9Yq+I9nuA/ouRBpedBp+o9oeWEwuvh8PmPxupLpOA8n+FBpehCp+tDq+88oOOEwer8/f7P5vZ4uuZDoeA9oONBpOc8oOKEwen2+v252/JkseU/oeI/pOc8n+KDwOns9fuh0PBVredApejS6flWr+pBp+v1+v5rue0/puvx+P2k0/JJqelBqOv5/P7C4PRtt+hCpOb9/v/X6veBwOlGo+I9ouQ9oeTn8/qZy+1Qp+E9n+JAo+Y9ouaEw+zz+f2x1/FeruM+n+A+pOiAwu76/f7I4/ZyuOdBoeFBpupAp+rB4ffT6vmJxe5JpuQ9oeNIqepKqelErPNAo+TKoRPCAAAACHRSTlMAJJ/uJL6f7T8zcWUAAAABYktHRCy63XGrAAAACXBIWXMAAAsSAAALEgHS3X78AAAAB3RJTUUH4gcKACUid1a9XgAAAZtJREFUOMuF0+VbwzAQBvCyIV06KmkCXXFdgaDDN3y4juHu7u7yn5NutGsHlPt6v6dy9x7DpLjcrOfXYt2uFIZJTQMc5/21OA6kpTLpINOhQDqTwTkBLoNhDcDHKwmwjMdr9AUAgCjYiddjAF4CUEZIhsBGTED7Ms7KVnwqkq0kAUQZ5+Tm5RcUKiqCQDKICSSAsouKS0rLyv2UaFD8FgbgBahWVFYRUl1TW1ffEMD6e+xA9jU2UUBIc0trG9seRKGYMIGoKR2dMUC6unt6+8K+uDABQEr/QBwQMjg0PDIa1EASGBs3ACETk1MRDCX+T0DIdHQGCk5gdm5epoD7CywsLi07PGFldW1dQcD6DSIyf5NsbG5t7yiYTtM6BzmwGx8U2ds/ODxS6Cx53jbJ4PGJDk7Pzi/q2310YbxtkhLEl1cb5Prm9s4fvsfmyhPrBtpD9PHp+eXV873v5DwIEAXe3kcjsXYiMSb4oELDyypG9sxZMkkzG4IwZI+kDozY08RLtJJyT2NvOZwfVxE7nH9Oz/X/8Tqc/6d+/l/0fV9tB8ubWAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOC0wNy0xMFQwMDozNzozNCswMjowMKVVr8QAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTgtMDctMTBUMDA6Mzc6MzQrMDI6MDDUCBd4AAAAV3pUWHRSYXcgcHJvZmlsZSB0eXBlIGlwdGMAAHic4/IMCHFWKCjKT8vMSeVSAAMjCy5jCxMjE0uTFAMTIESANMNkAyOzVCDL2NTIxMzEHMQHy4BIoEouAOoXEXTyQjWVAAAAAElFTSuQmCC
// @match        https://*.to/account/notifications
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/524868/SerienStream%20%20AniWorld%20-%20Watched%20Notitifications.user.js
// @updateURL https://update.greasyfork.org/scripts/524868/SerienStream%20%20AniWorld%20-%20Watched%20Notitifications.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- EINSTELLUNGEN ---
    const p_color_visited = "LightCoral";
    const p_except = "mail.live.com,";
    // --- Ende der Einstellungen ---

    function isExceptSite(except, site) {
        const exceptList = except.split(",");
        for (let i = 0; i < exceptList.length; i++) {
            const str = exceptList[i].trim();
            if (str === "") continue;

            let str1 = str;
            if (!str1.startsWith(".") && !str1.startsWith("/")) {
                str1 = "." + str1;
            }

            let str2 = str;
            if (!str2.startsWith("://")) {
                str2 = "://" + str2;
            }

            if (site.includes(str1) || site.includes(str2)) {
                return true;
            }
        }
        return false;
    }

    function main() {
        const url = window.location.href;

        if (!isExceptSite(p_except, url)) {
            // CSS-Regel, um besuchte Links einzufärben.
            const css_a_visited = `a:visited, a:visited * { color: ${p_color_visited} !important; }`;
            GM_addStyle(css_a_visited);

            // Hintergrundfarbe der Seite ändern.
            document.body.style.background = "#292929";
        }
    }

    main();

})();
