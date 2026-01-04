// ==UserScript==
// @name         Instagram Downloader
// @namespace    https://lawrenzo.com/p/direct-picture-link
// @version      1.3.2
// @description  Quick 'n dirty little userscript for accessing pictures and videos off of Instagram. Everything is accessed via right-clicking image or video. Note: for videos requires viewing the actual post (not just in the feed).
// @author       Lawrence Sim
// @license      WTFPL (http://www.wtfpl.net)
// @match        https://*.instagram.com/*
// @downloadURL https://update.greasyfork.org/scripts/410052/Instagram%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/410052/Instagram%20Downloader.meta.js
// ==/UserScript==
(function() {

    var contextMenu,
        styles = {
            'position': 'absolute',
            'background': '#efefef',
            'border-radius': '0.2em',
            'box-shadow': '1px 1px 3px 1px rgba(0,0,0,0.4)',
            'padding': '0.2em 0.5em',
            'font-size': '0.85em',
            'z-index': '999999'
        };
    var openContextMenu = (evt, src, isVideo) => {
        let a;
        if(!contextMenu) {
            contextMenu = document.createElement("div");
            for(let key in styles) contextMenu.style[key] = styles[key];
            a = document.createElement("a");
            a.setAttribute("target", "_blank");
            contextMenu.append(a);
            document.body.append(contextMenu);
        }
        a = a || contextMenu.querySelector("a");
        a.setAttribute("href", src);
        if(isVideo) {
            a.setAttribute("download", "video");
            a.innerHTML = "> view video";
        } else {
            a.setAttribute("download", "");
            a.innerHTML = "> view image";
        }
        contextMenu.style.left = `${evt.pageX}px`;
        contextMenu.style.top = `${evt.pageY}px`;
    };
    document.body.addEventListener("click", () => {
        if(!contextMenu) return;
        contextMenu.remove();
        contextMenu = null;
    });

    var postRegExp = /https?:\/\/(?:www\.)?instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9\-\_]+)\//,
        getPostId = () => (window.location.href.match(postRegExp) || [null])[1],
        fixMediaUrl = url => "https://scontent"+url.slice(url.indexOf(".cdninstagram.com"));

    var mediaUrlMap = {};
    var getMediaUrls = async (postID, onComplete) => {
        if(mediaUrlMap[postID]) {
            return Promise.resolve(mediaUrlMap[postID]);
        }
        mediaUrlMap[postID] = fetch("https://www.instagram.com/p/"+postID+"/?__a=1&__d=dis")
            .then(res => {
                if(!res || !res.ok) throw Error((res && res.statusText) || "Fetch error");
                return res.json();
            })
            .then(json => {
                if(!json) throw Error("Could not fetch JSON");
                if(!json.items || !json.items.length) throw Error("No items found in JSON ("+(json.items && json.items.length)+")");
                let medias;
                if(json.items[0].carousel_media) {
                    medias = json.items[0].carousel_media;
                } else {
                    medias = [json.items[0]];
                }
                let mediaUrls = medias.map(media => {
                    let bestMatch = null,
                        versions = media.video_versions && media.video_versions.length ? media.video_versions : media.image_versions2.candidates;
                    versions.find(version => {
                        if(version.width == media.original_width) {
                            bestMatch = version;
                            return true;
                        } else if(!bestMatch || version.width > bestMatch.width) {
                            bestMatch = version;
                        }
                    });
                    return fixMediaUrl(bestMatch.url);
                });
                return mediaUrlMap[postID] = mediaUrls;
            })
            .catch(err => console.log(err) && null);
        return mediaUrlMap[postID];
    };

    var getMediaFrame = media => {
        if(media.tagName === "VIDEO") {
            return media.closest("[role='button']") || media.parentNode;
        }
        let galleryFrame = media.closest("li > div");
        if(galleryFrame) return galleryFrame;
        return getComputedStyle(media)['user-select'] && media.closest("[role='button']");
    };
    var linkPicture = (img, src, frame) => {
        frame = frame || getMediaFrame(img);
        if(!frame) return;
        frame.addEventListener("contextmenu", evt => {
            evt.preventDefault();
            openContextMenu(evt, src || img.getAttribute("src"));
        });
        img.setAttribute("ilnkd", 1);
    };
    var linkVideo = (vid, src, frame) => {
        frame = frame || getMediaFrame(vid);
        if(!frame) return;
        frame.addEventListener("contextmenu", evt => {
            evt.preventDefault();
            openContextMenu(evt, src, true);
        });
        vid.setAttribute("ilnkd", 1);
    };
    var linkPost = async (mutated, postID, onComplete) => {
        var mediaUrls = await getMediaUrls(postID);
        if(!mediaUrls) return;
        mutated.forEach(mutant => {
            mutant.target.querySelectorAll("li").forEach(li => {
                let media = li.querySelector("img, video");
                if(!media || media.getAttribute("ilnkd") !== null) return;
                let thisIndex = 0;
                [li.previousSibling, li.nextSibling].find((sibling, i) => {
                    if(!sibling) return;
                    let siblingMedia = sibling && sibling.querySelector("img, video"),
                        nearIndex = parseInt(siblingMedia && siblingMedia.getAttribute("ilnkd") || -1);
                    if(~nearIndex) {
                        thisIndex = nearIndex + (i ? -1 : 1);
                        return true;
                    }
                });
                if(media.tagName === "IMG") {
                    if(media.closest("[role=\"menuitem\"]")) return media.setAttribute("ilnkd", 0);
                    let alt = media.getAttribute("alt");
                    if(alt && alt.endsWith("profile picture")) return media.setAttribute("ilnkd", 0);
                    linkPicture(media, mediaUrls[thisIndex], media.closest("li > div"));
                } else {
                    linkVideo(media, mediaUrls[thisIndex], media.closest("li > div"));
                }
                media.setAttribute("ilnkd", thisIndex);
            });
            let media = mutant.target.querySelector("article img, [role=\"button\"] img, article video, [role=\"button\"] video");
            if(!media || media.getAttribute("ilnkd")) return;
            if(media.tagName === "IMG") {
                linkPicture(media, mediaUrls[0]);
            } else {
                linkVideo(media, mediaUrls[0]);
            }
        });
    };
    var link = (mutated, observer) => {
        mutated = mutated || [{target: document.body}];
        let postId = getPostId();
        if(!postId) {
            // feed, images only
            mutated.forEach(mutant => {
                Array.from(mutant.target.querySelectorAll("article img") || [])
                    .filter(img => !img.getAttribute("ilinkd") && img.src)
                    .forEach(img => linkPicture(img, fixMediaUrl(img.src)));
            });
        } else {
            // post, special logic
            linkPost(mutated, postId);
        }
    };

    link();
    var obs = new MutationObserver(link);
    obs.observe(document.body, {childList:true, subtree:true});

})();