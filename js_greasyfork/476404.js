// ==UserScript==
// @name     vrporn.com download url extractor to clipboard
// @description vrporn.com extractor of download links to clipboard. Click on new input to copy link to clipboard and use it in your download manager. Url should be valid for 2 days, keep in mind that too many parallel downloads can get you blocked for few days. New button to view miniatures.
// @version  10
// @grant    none
// @include  https://vrporn.com/*
// @include  https://www.vrporn.com/*
// @namespace https://greasyfork.org/users/1079192
// @downloadURL https://update.greasyfork.org/scripts/476404/vrporncom%20download%20url%20extractor%20to%20clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/476404/vrporncom%20download%20url%20extractor%20to%20clipboard.meta.js
// ==/UserScript==

window.addEventListener(
    "load",
    function () {
        var pname = document.getElementsByClassName("footer-titles")[0];
        pname.style.userSelect = "text";

        var content_title = document.getElementsByClassName("content-title")[0];
        if (content_title !== undefined) {
            var title = content_title.innerHTML;

            var pstar = document.getElementsByClassName(
                "lav_pornstar_list premium-version"
            )[0];
            var pstar_names = "";
            var thumb = document.getElementById("dl8videoplayer").getAttribute("poster")
            const video_title = document.createElement("input");
            const pstar_title = document.createElement("input");
            const thumb_url = document.createElement("input");

            if (pstar !== undefined) {
                for (var star of pstar.children) {
                    var name = star.children[0].title;
                    pstar_names += name + " ";
                }
                video_title.value = pstar_names + "- " + title + ".mp4";
                pstar_title.value = pstar_names;
            } else {
                video_title.value = title + ".mp4";
            }
            if (thumb !== undefined){
                thumb_url.value = thumb;
            }

            try {
                const miniature = document
                    .getElementsByTagName("dl8-video-preview-sprite-sheet")[0]
                    .getAttribute("src");
                const popover_image = document.createElement("img");
                popover_image.src = miniature;
                popover_image.style.margin = "auto";
                popover_image.style.position = "relative";
                popover_image.style.top = "75px";
                popover_image.style.overflow = "hidden";
              	popover_image.style.width = "50%";
                const popover_close = document.createElement("button");
                popover_close.innerText = "X";
                popover_close.style.position = "fixed";
                popover_close.style.top = "75px";
                popover_close.style.right = "30px";
                popover_close.style.width = "45px";
                popover_close.style.height = "45px";
                popover_close.onclick = closePopover;
                const popover = document.createElement("div");
                popover.id = "popover_image";
                popover.style.position = "absolute";
                popover.style.top = "0";
                popover.style.bottom = "0";
                popover.style.overflow = "scroll";
                popover.style.left = "2.5vw;";
                popover.style.width = "100vw";
                popover.style.height = "100vh";
                popover.style.textAlign = "center";
                popover.style.backgroundColor = "rgba(168, 168, 168, 0.95)";
                popover.appendChild(popover_close);
                popover.appendChild(popover_image);
                const miniature_open_btn = document.createElement("button");
                miniature_open_btn.style.backgroundColor = "#0ea1d5";
                miniature_open_btn.addEventListener(
                    "mouseleave",
                    function (event) {
                        event.target.style.backgroundColor = "#0ea1d5";
                    }
                );
                miniature_open_btn.addEventListener(
                    "mouseenter",
                    function (event) {
                        event.target.style.backgroundColor = "#85c8e1";
                    }
                );
                miniature_open_btn.innerText = "Miniature";
                miniature_open_btn.onclick = function () {
                    window.scrollTo(0, 0);
                    document.body.appendChild(popover);
                  	document.addEventListener('keyup', closePopoverKey);
                };
                content_title.parentNode.insertBefore(
                    miniature_open_btn,
                    content_title.nextSibling
                );
            } catch (error) {}

            thumb_url.onclick = function () {
                this.select();
                navigator.clipboard.writeText(this.value);
            };
            content_title.parentNode.insertBefore(
                thumb_url,
                content_title.nextSibling
            );

            pstar_title.onclick = function () {
                this.select();
                navigator.clipboard.writeText(this.value);
            };
            content_title.parentNode.insertBefore(
                pstar_title,
                content_title.nextSibling
            );

            video_title.onclick = function () {
                this.select();
                navigator.clipboard.writeText(this.value);
            };
            content_title.parentNode.insertBefore(
                video_title,
                content_title.nextSibling
            );

            var downloads = document
                .getElementsByClassName("download-links-popup-zone")[0]
                .getElementsByClassName("download-links-popup-inner")[0]
                .getElementsByClassName("list_version_download")[0]
                .getElementsByClassName("list_row")[0]
                .getElementsByClassName("download-btn");

            for (var element of downloads) {
                var url = element.getAttribute("data");
                const copy = document.createElement("input");
                copy.value = url;
                copy.onclick = function () {
                    this.select();
                    navigator.clipboard.writeText(this.value);
                };
                element.parentNode.insertBefore(copy, element.nextSibling);
            }
        }
    },
    false
);

function closePopoverKey(e) {
  if (e.code === "Escape"){
    closePopover();
    document.removeEventListener('keyup', closePopoverKey);
  }
}


function closePopover() {
	document.getElementById("popover_image").remove();
}