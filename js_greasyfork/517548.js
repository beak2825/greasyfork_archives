// ==UserScript==
// @name        Copy clean URL with ctrl + meta + c
// @run-at      document-start
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.2
// @author      naught0
// @license     MIT
// @description 11/15/2024, 11:17:18 AM
// @downloadURL https://update.greasyfork.org/scripts/517548/Copy%20clean%20URL%20with%20ctrl%20%2B%20meta%20%2B%20c.user.js
// @updateURL https://update.greasyfork.org/scripts/517548/Copy%20clean%20URL%20with%20ctrl%20%2B%20meta%20%2B%20c.meta.js
// ==/UserScript==
function cleanLink(a, e = !1, s = !0, t = !1) {
    try {
        var n = new URL(a);
    } catch (e) {
        if (e instanceof TypeError) n = new URL(a.split(/"(?:[^\\"]|\\.)*"/)[1].trim());
    }
    if ("l.facebook.com" === n.host && n.searchParams.has("u")) {
        const a = decodeURI(n.searchParams.get("u"));
        n = new URL(a);
    } else if ("href.li" === n.host) {
        const a = n.href.split("?")[1];
        n = new URL(a);
    } else
        "www.google.com" === n.host &&
            "/url" === n.pathname &&
            n.searchParams.has("url") &&
            (n = new URL(n.searchParams.get("url")));
    const r = new URL(n.origin + n.pathname);
    if (
        (n.searchParams.has("q") && r.searchParams.append("q", n.searchParams.get("q")),
        n.host.includes("play.google.com") &&
            n.searchParams.has("id") &&
            r.searchParams.append("id", n.searchParams.get("id")),
        n.host.includes("macys.com") &&
            n.searchParams.has("ID") &&
            r.searchParams.append("ID", n.searchParams.get("ID")),
        n.host.includes("youtube.com") && n.searchParams.has("v"))
    ) {
        if (n.searchParams.has("v") && e) {
            const a = /^.*(youtu\.be\/|embed\/|shorts\/|\?v=|\&v=)(?<videoID>[^#\&\?]*).*/.exec(n.href).groups.videoID;
            r = new URL("https://youtu.be/" + a);
        } else n.searchParams.has("v") && r.searchParams.append("v", n.searchParams.get("v"));
        n.searchParams.has("t") && r.searchParams.append("t", n.searchParams.get("t"));
    } else
        n.host.includes("youtube.com") &&
            n.pathname.includes("playlist") &&
            n.searchParams.has("list") &&
            r.searchParams.append("list", n.searchParams.get("list"));
    if (
        (n.host.includes("facebook.com") &&
            n.pathname.includes("story.php") &&
            (r.searchParams.append("story_fbid", n.searchParams.get("story_fbid")),
            r.searchParams.append("id", n.searchParams.get("id"))),
        n.host.includes("amazon") && (n.pathname.includes("/dp/") || n.pathname.includes("/product/")))
    ) {
        r.hostname = r.hostname.replace("www.", "");
        const a = /(?:\/dp\/|\/product\/)(\w*|\d*)/g.exec(n.pathname)[1];
        a && (r.pathname = "/dp/" + a);
    }
    return (
        (n.host.includes("twitter.com") || n.host.includes("x.com")) && s && (r.host = "fxtwitter.com"),
        n.host.includes("amazon") && t && r.searchParams.append("tag", t),
        n.host.includes("lenovo.com") &&
            n.searchParams.has("bundleId") &&
            r.searchParams.append("bundleId", n.searchParams.get("bundleId")),
        r.toString()
    );
}
function showToast(a = "Copied link to clipboard") {
    const e = document.createElement("div");
    (e.style =
        '\n    animation: 0.3s ease slide;\n    position: fixed;\n    top: 15px;\n    right: 15px;\n    background-color: #333;\n    border: 1px solid #777;\n    font-size: 16px;\n    font-family: apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;\n    font-weight: bold;\n    color: #fff;\n    padding: 15px 20px;\n    border-radius: 8px;\n    z-index: 999999;\n    max-width: fit-content;\n  '),
        e.animate([{ transform: "translateX(100%)" }, { transform: "translateX(0)" }], {
            duration: 30,
            easing: "ease-in-out",
        }),
        (e.innerText = a),
        document.body.appendChild(e),
        setTimeout(async () => {
            e.animate([{ transform: "translateX(0)" }, { transform: "translateX(100%)" }], {
                duration: 50,
                easing: "ease-in-out",
            }).onfinish = () => e.remove();
        }, 3e3);
}
document.onkeydown = (a) => {
    if (a.metaKey && a.ctrlKey && "c" === a.key.toLowerCase()) {
        console.log("CAPTURED KEYDOWN EVENT");
        const a = cleanLink(window.location.href);
        navigator.clipboard.writeText(a), showToast();
    }
};
