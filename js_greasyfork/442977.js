// ==UserScript==
// @name         Linkvertise Bypass
// @namespace    http://tampermonkey.net/
// @version      6.9
// @description  [Working 🟢] Bypasses Linkvertise links
// @author       shaadow02
// @license      GNU GPL v3.0. http://www.gnu.org/copyleft/gpl.html
// @noframes
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @compatible   opera
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @require      https://cdn.jsdelivr.net/gh/jpillora/notifyjs@d27d96fc2454c2e7ec21dc9fd7609944831fdedd/dist/notify.js
// @match        *://*.linkvertise.com/*
// @match        *://*.linkvertise.net/*
// @match        *://*.linkvertise.download/*
// @match        *://*.link-to.net/*
// @exclude      *://publisher.linkvertise.com/*
// @exclude      *://cdn.linkvertise.com/*
// @exclude      *://link-mutation.linkvertise.com/*
// @exclude      *://linkvertise.com
// @exclude      *://linkvertise.com/search*
// @exclude      *://linkvertise.com/assets*
// @exclude      *://linkvertise.com/profile*
// @exclude      *://blog.linkvertise.com
// @exclude      *://blog.linkvertise.com/*
// @exclude      https://linkvertise.com/
// @connect      publisher.linkvertise.com
// @connect      code.jquery.com
// @connect      cdn.jsdelivr.net
// @connect      balatin.de
// @connect      bypass.bot.nu
// @connect      d17kz3i6hbr7d3.cloudfront.net
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?domain=https://linkvertise.com
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/442977/Linkvertise%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/442977/Linkvertise%20Bypass.meta.js
// ==/UserScript==

const cooldownAfterLoad = 15000; //In milliseconds
const openInNewTab = false; //If set to true, make sure to allow popups for the page
const local = true; //Whether to use local bypassing or external fetching of linkvertise links

(async () => {
    if(document.contentType == "text/html") {
        bypass(window.location);
    }
})();

async function bypass(loc) {
    if(local) {
        $.notify("Bypassuje link... Prosze czekac...", {className: "info", autoHideDelay: 10000});
        if(loc.hostname == "linkvertise.com" && loc.pathname.startsWith("/") && loc.pathname.split("/").length >= 3) {
            let pathId = loc.pathname.split("/")[1];
            let pathName = loc.pathname.split("/")[2];
            let dynamic = loc.pathname.includes("/dynamic");
            let rId = dynamic && location.search.includes("&r=") ? location.search.split("&r=")[1].split("&")[0] : dynamic && location.search.includes("?r=") ? location.search.split("?r=")[1].split("&")[0] : "";
            // Stage 1 - Fetch link id
            GM_xmlhttpRequest({
                method: 'GET',
                url: "https://publisher.linkvertise.com/api/v1/redirect/link/" + (dynamic ? "dynamic/" + pathId + "/" + rId : "static/" + pathId + "/" + pathName),
                onload: function(resp) {
                    let response = JSON.parse(resp.responseText);
                    pathName = response["data"]["link"]["url"];
                    let target_type = response["data"]["link"]["target_type"];
                    // Stage 2 - Generate serial
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: "https://balatin.de/api/serial?p=" + pathName + "&pid=" + pathId + "&id=" + response["data"]["link"]["id"],
                        onload: function(resp) {
                            // Stage 3 - Get download target
                            GM_xmlhttpRequest({
                                method: 'POST',
                                url: "https://publisher.linkvertise.com/api/v1/redirect/link/" + pathId + "/" + pathName + ((target_type == "PASTE") ? "/paste" : "/target"),
                                data: resp.responseText,
                                headers: {
                                    "Content-Type": 'application/json',
                                },
                                onload: function(resp) {
                                    response = JSON.parse(resp.responseText);
                                    if(target_type != "PASTE") {
                                        let dest = new URL(response["data"]["target"]);
                                        if(dest.hostname == "linkvertise.download") {
                                            bypassDownload(dest);
                                        } else {
                                            handleResult(dest.href);
                                        }
                                    } else {
                                        handleResult("https://balatin.de/api/txt/" + btoa(unescape(encodeURIComponent(response["data"]["paste"]))));
                                    }
                                }
                            });
                        }
                    });
                }
            });
        } else if (loc.hostname == "linkvertise.download") {
            bypassDownload(loc);
        } else {
            $.notify("Wyskoczyl blad (domena albo sciezka)", {className: "error", autoHideDelay: 10000});
        }
    } else {
        $.notify("Probuje obejsc link innym api", {className: "info", autoHideDelay: 8000});
        GM_xmlhttpRequest({
            method: 'GET',
            url: "https://bypass.bot.nu/bypass2?url=" + loc.href,
            onload: function(resp) {
                let jsonResponse = JSON.parse(resp);
                if(jsonResponse != null && jsonResponse.destination != null) {
                    handleResult(jsonResponse.destination);
                } else if(jsonResponse != null && jsonResponse.msg != null) {
                    // Text proxy used to redirect
                    handleResult("https://balatin.de/api/txt/" + btoa(unescape(encodeURIComponent(jsonResponse.msg))));
                } else {
                    $.notify("Nie moge obejsc linku", {className: "error", autoHideDelay: 10000});
                }
            }
        });
    }
}

async function bypassDownload(dest) {
    if(dest.pathname.startsWith("/download/")) {
        let pathId = dest.pathname.split("/")[2];
        let pathName = dest.pathname.split("/")[3];
        $.notify("Bypassing executable..", {className: "base", autoHideDelay: 3000});
        let key = JSON.stringify({key: dest.pathname.split("/")[4]});
        // Stage 4 - (if link is download) get installer
        GM_xmlhttpRequest({
            method: 'POST',
            url: "https://publisher.linkvertise.com/api/v1/redirect/link/" + pathId + "/" + pathName + "/download-info",
            data: key,
            headers: {
                "Content-Type": 'application/json',
            },
            onload: function(resp) {
                let response = JSON.parse(resp.responseText);
                let downloadUrl = new URL(response["data"]["downloadUrl"]);
                if(downloadUrl.hostname.endsWith("cloudfront.net") && downloadUrl.pathname.startsWith("/installer/")) {
                    // Stage 5 - Extract filename of executable
                    let downloadReq = GM_xmlhttpRequest({
                        method: 'GET',
                        url: "https://balatin.de/api/installer?url=" + downloadUrl.href,
                        onload: function(resp) {
                            response = resp.responseText;
                            let filename = JSON.stringify({"a":"Linkvertise","s":"Linkvertise","u":response});
                            // Stage 6 - Retrieve final download based on filename key
                            GM_xmlhttpRequest({
                                method: 'POST',
                                url: "https://d17kz3i6hbr7d3.cloudfront.net/o",
                                data: filename,
                                headers: {
                                    "Content-Type": 'application/json',
                                },
                                onload: function(resp) {
                                    handleResult(JSON.parse(resp.responseText)["i"]["cu"]);
                                }
                            });
                        }
                    });
                } else {
                    handleResult(downloadUrl.href);
                }
            }
        });
    }
}

async function handleResult(dest) {
    let krnlId = "/48193/"; //Path ID for krnl links
    if(location.pathname.startsWith(krnlId)) {
        $.notify("Wykryto krnl! Przenosze w ciagu 15 sekund", {className: "warn", autoHideDelay: 15000});
        setTimeout(() => {
            $.notify("Redirecting...", {className: "success", autoHideDelay: 8000});
            location.href = dest;
        }, 15200);
    } else {
        if(cooldownAfterLoad > 0) {
            let seconds = (cooldownAfterLoad / 1000);
            $.notify((openInNewTab ? "Otwieram link" : "Przenoszenie") + " w ciagu " + seconds + " sekund" + (seconds === 1 ? "" : ""), {className: "base", autoHideDelay: cooldownAfterLoad + 200});
        }
        setTimeout(() => {
            if(openInNewTab) {
                GM_openInTab(dest, false);
                $.notify("Otworzono w nowej karcie", {className: "success", autoHideDelay: 8000});
            } else {
                $.notify("Przenoszenie...", {className: "success", autoHideDelay: 8000});
                location.href = dest;
            }
        }, cooldownAfterLoad);
    }
}

function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

/*
 * DESIGN
*/

$.notify.addStyle("bootstrap", {
    html: "<div>\n<span data-notify-text></span>\n</div>",
    classes: {
        base: {"z-index":"99999","font-size":"20px","font-family":"Segoe UI, Frutiger, Dejavu Sans, Helvetica Neue, Arial, sans-serif","padding":"10px 17px 10px 16px","text-shadow":"0 1px 0 rgba(18, 18, 18, 0.5)","color":"#EAEAEA","background-color":"#101010","border":"2px solid #161616","border-radius":"10px","white-space":"nowrap","padding-left":"46px","background-repeat":"no-repeat","background-position":"8px 8px"},
        error: {"color":"#E84A48","background-color":"#260D0D","border-color":"#331111","background-image":"url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAS1SURBVFhH7Vffb1RFFP5m7u7tD9mubTFp2oiGGkLEJtXgCw8WSH8FG2JiDPTBHwnqky22QnzyxfigoVIp6j/APyCRByhNEDUmWgKNJj4gRVtD0xAtrQu1e3f3jt+Ze3fdu7vQ8mBsSL9kdu49M3PON+ecOXMXG9jAgwYV9mvGYme3dEkNbNdKtcgzldSy9wyQMsbczAG/PDwx/rtMvF+smdBfAZHHtcILcaU7HKW3+8a0UEMirhT4jKwxaUepm1R6bcX3J3PGnK6bGP/OKlgjViW0uLdTOoc4VKXUGwqqLaZVlQhJADRqySiScmSi0iBpK9dQ03/7uS8yxozQY/OyZjXck1DolcaY1h9WaX1AGZOgcktkNTCccNmIHOd/7xkzkDh/7rIdvAfuSuhWQGZzjdafu1q/mPV9LWTuF0KMnpVNTKeNOUhSl8KhiqhIaG73XuncRtcdYU4M5ENTgO9zJZcGHihHhfFqrUXHj8yt/cyrmVBcBh6WKP7o7IEbi+t6130prvUrQiNCJsczJIbEaCWPybhAxmROiDSfGfo2hv79VHevzcFKKCNUQ1tsLTFJYKWSoqiAbBa6uRnxV1+G3vEksLISJeV5UMk6xPv74ezaRUIkF47LL8Ou6PH9MaDXCitADkYBpmcfeKQV1ezjbgYyvu8UzJGYemQz3OEhxHp7oVtb4f/6G8zcHBCjiUwGqo5kXj+E+MEDcJ7aAXPjBswsy1EYPtHFjVZzi/q91ie+/GD6WujOfxHx0DJ3xLaJizq11m5ZEmsHqlZqIB+3bYP7zhB0eztM6jY9k0R84C3E+vrsOKoYFWlFyGuj/naSoovLEQ1ZsJN6LtxpikMlYFKa+Xl4x0bgX74SiOgld+gwYj3diB9m32VrFsyfC8iMnUTu4td2ndUbIszHJv62WUEJooRksjG1XPQY411+BB0H/vXrSI9+gtxkcHr11q1wjwwjtqfDvpuFBXhjY8ien7DvllARZJsspAnaaQ4kUURmCwE2l1dBsmLxk50yDGZ2Ft7HxwukVCJhx8zSEryPjiF34Stqce0GSiFVnadXTDUEkiii9NcBIoTEJ2wek3mJiRcIiyFeS6ehtmxhQg/DeXZnIE6l7JgktvvuUTh7dtsSUKhJRZDKzdMrphYCSRRRDwkJpZZZK2Z47AunogAakJypGnq7QEZyyhs5juyFi/ZdNTTAHRwsJHhxcRSIQZJK0Q7rRTmihIKkvkVal1RJMto61NQE9+gR6GeeDkTT0/BGTyB7bhyZE+zDRFaNDYgPDsDpeC4gVJSP3Kx08/z9yQpKELFayzrDdpsJPeH7viffORGwTpnl5eDx6lUm9ij8qSkm9Sab0JmTnyJ75owdl9DaVoS8NuqfouGfw9cISiwCd7p6pHuUN/wphq3jDq+LwiS5Olpa4PR0IffDJPwrU7w1qyXMwbhcHQ31iD3fB39mBrlvv6FLWMXDcdkgw7XIHH2tZvzsaSssQRkhuVwJ/ZBW/bwIP2NNSnrFeSCJKuEUWUnRs8hfvnmEoRdJteMYJvQppvubifGzUfeFKCMk+D8/P+6icZ19oOWxrj5h81hXH/nFWDd/g0rxX/9R3MAGHjAA/wAR5Ut0pCrRawAAAABJRU5ErkJggg==)"},
        success: {"color":"#1EC77D","background-color":"#08331F","border-color":"#062818","background-image":"url(data:image/png;base64,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)"},
        info: {"color":"#3AA7AD","background-color":"#0C1C23","border-color":"#112833","background-image":"url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxMAAAsTAQCanBgAAASWSURBVFhH7VdNiBxFFH7VVT0/OzPrhqxu2NG4g6e4G9BcDGoOLuhJ9Ka3IJ5cjeySg8khQdGjqyBmE0EQL4ogeBPcCCookajgQYmnuLNI/tZE9n9npqu6/F5tr3ZP9+wfC4GwH1R3Tf28+ep7r6pe0y52cadBRO8tYeD9f/jFc7tQ+oQQJW6w1i6heQbVxfqre7hpy9gSodqZWTytwrTHSHhPCKkGSfp9aCy7ASBCJrhhjb5ENvwubC1/L6Sv66N3R90bY1OEamfmyJL1oMQh8tSo8AtHrAnu91Te9aOPH7AmYBC/TBBi3F9WN39AmUDrj1PHetzYjbAhodrEHPsiB0VeEMo/TULey7OgAlFoolFt8CSGQ0jPA7tw2gaN8VxPZaLx9wxNj7KgndGRUPX0T5TrHyQyrTzcMiZU4XUYL1rTYoLRqFVhdMRLyTaDrJj0QUzN22DlHdlVejO4dY2mj/dHA9LwoncCXSMfUh5krG7kQOYoyJyCJEXInyAToviwcLgq6fH7JCnUw/+73VirWyjNbqHyr5mlxWOq3Ev737sRDUgjk1Df0PNsxBMy/xCkPwHLZTYcB/MyUOa5Az599myRPn66SEeHfFqBJ1OAaxFXJSFzJ0PdPCx9tykzkSI0MLFAsoBNo/IV7KIXIfcD7WQYLIQH/wz2eiRhRaF+aB985noyYKGn5/XBhce1bsraOZwQGUgREvgX3Vj04P+DMPAUx0FW8LpmvL+8rOnCFUM/XzP0+R8BSbfTMsCShlrB5qPKLwx3it4Ml8GgENgi9AhKzcUN/3sbuIXj59tpQyOTDXr5fIPOTxkqYGYHjSASL0HsRe3JToMShAbOLZKvipjjlYTwhuCyTHXWwDb3FAQVMSwHb+0timRQt8NtCOELIR8Mhe0a+CDttqRCiNLG3FWcbbYHZ0nVtcV2VRzc2gLXI9hdnzxTpE9RhgckLQer6mXD2RIkVa/Qul84xZJIEBLCIobZW5bvqG7XuA6YazknaH+3R9WKRxXUTTb/GHiAKCIKYD89OCOGtgZepOGFwjbXO6uzOSQIWYsY0HyQiGU85l3jjoMp2xWoC/tp+kmFpKTCXf0WvptFMF9xbRk7bPtwtiwZfdMqddV6aQclWuojZQr0CqaES9aGv7sLFBfljsEtzgbWmkueFcv1l9IndkYM4f6xlv12EWUKdxCaNozUTUE4Rewt1L7uFGwpQhYHiSqUQ5D4DVE66cisp9KaYX53+BMHVsdTGjYv6KDxTcYGc0gRqr9SIdNYRE7RXIDLPkKUXxYqF/WmwfcZ32Vr9Y5aCgwKDbLJ4F2l8mZqJPuCzVx6WDtApX0H4erWTaxsATf+MOTOxU9tJwge87h3f71uaPJPTb9cD2kpwFnGnXFwwib9JVzSbyDL/EI352nuq/GoM4n2qf+h/9RFyleHNkzQ+KrQ0YHLN35i44BxLEEbF/nSW2Z2/QStI6E11M7GUljpbyOFtUhhV972eypnWzMzVB/bZgobRyzJfxirHRN+Hkm+vj1Jfhyrn0HEl93t/QxqR9uH4j1QzhHaiQ/FXeziDgPRvzoC8nK9ik5zAAAAAElFTkSuQmCC)"},
        warn: {"color":"#D99853","background-color":"#332B0B","border-color":"#262008","background-image":"url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxMAAAsTAQCanBgAAAOBSURBVFhH7VZLjwxRFP7Orep5ePQMQ7ySiRiPTCxkDIPEIyEkYjbSGcJMEBERjxDExs4PkHgMGzuJxB9AwgoLMdiRSBBLm1kg6JnuquM7VYXRUz2qe6u/zsntuo9zv/rOuecWGmiggf8NkrR1Q6+tsWY1bTrdPZNTIyXrqBcuaeuCDpOMwz60ercw3b8FDxeSobpRt0IRGaALOXcHTa4PIZ/K4SjK2C3Hnz+xwXpQv0KOS50bgkgPimRTDPh60kGP5/Ryb1Myq2bURUhv9lnTC1/2UOMcQo36o9aTLQxhIe6oHTUT0qu9QCloIZFBOOlGieooiSjbICLWzrGjDOncaEGNqImQnmkHPrwHct5aktlHRSRSpZkHrCVvM2JSnvTBc3v1Sk/NOVqbQkuXmuW56giTeT6K40BrHsGOiwgKV4BZnVSPp15kGm0IvrcsWZkZtRHyOd13m7jZAMaYxGEJml8A7VgBbVvGdglFKttpIyldx7kDOrzWT1ZnQmZCdGzhmM38OMuQtP5OZOaOqNVCqqUkaZXExhxbJwf4uCqalxHZFfK4gScFbrIV47ZxGiakzDhV8mQ5bUiH+zKXgUyE9AbVCXUR/56PT1TcPxkVAxY6EoJj+DIim0Kx/CdYd5ajXLGpmAtThiYe2wnjNtfJHObcab26piXpnRL/JJSo00PHh5I68wdGplSEOiPSzDB9Z1vhcowq+dKPJtmZ9EyJCUGfDD3YZY1gQ8dtEhqMQjARFj7Ph3ZthrbMhHv7iAS+cUWF2xxJBjpCxbbLyZHPSW8qplZofYdZP/NgR7R5JWzjoAR5cx/u1V3eZ18nkzFYNffErprDSU9VVCWk13mbB2Ge+hzj49xJ4TLYdeF8hOsPIdx2jtW6Le5LQ6i21ymmwOK4Ix2phFjySSYQlv8C32zj75pTiYC1p30RtLuAcOV+6LzuSLFUxBdvJ0N/Wq/3VhUifaCZxbXZX8hRHlnwbqhCyOWAL58gHx9CPtyDjL6LFEuFuQjVo+IDrOD2hZmKdEKWByKLGfMlfKP4OT76f5vPzcNxuCc34D24BPwYjfvS5kZG3zmZxe+oqtU7nZDdU2PBR/57xjcr8q14PyBINecCnrTYnJc+x4zBpJXp7zU/X17aNmkg7XQkH+8rOGMX324GHVXJVuKXlyqRjSD8KUmpPpaTL54mvQ000MD/DuAn3R4Ueh+VYR4AAAAASUVORK5CYII=)"}
    }
});