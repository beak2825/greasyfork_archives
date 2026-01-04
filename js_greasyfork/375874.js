// ==UserScript==
// @name         RED Quick Confirm
// @author       tobber13
// @version      1.3
// @description  Moves Unconfirmed Releases to their own Edition
// @include      *redacted.sh/torrents.php?id=*
// @namespace    https://greasyfork.org/users/234468
// @downloadURL https://update.greasyfork.org/scripts/375874/RED%20Quick%20Confirm.user.js
// @updateURL https://update.greasyfork.org/scripts/375874/RED%20Quick%20Confirm.meta.js
// ==/UserScript==

(function() {
    const search = document.getElementById("torrent_details");
    if (!search.querySelector(".edition_info").textContent.includes("− Unconfirmed Release")) {
        // Return early if no unconfirmed releases found
        return;
    }
    let year, label, cat, confLink;
    let link = [];
    raiseTheAnchors();

    // Identify the unconfirmed torrents
    const t = search.querySelectorAll(".edition_1.group_torrent");
    for (let i = 0; i < t.length; i++) {
        link[i] = t[i].querySelector("a[href*='action=edit&id']").getAttribute("href");
    }

    // Get year, label and cat
    const editgroup = document.querySelector("a[href*='action=editgroup']").getAttribute("href");
    let xhr = new XMLHttpRequest();
    xhr.open('GET', editgroup);
    xhr.onload = function() {
        let div = document.createElement("div");
        div.innerHTML = this.responseText;
        year = div.querySelector("input[name='year']").value;
        label = div.querySelector("input[name='record_label']").value;
        cat = div.querySelector("input[name='catalogue_number']").value;
    };
    xhr.send();

    function addEvents() {
        document.getElementById("confLink").addEventListener("click", handleClick);
        document.getElementById("yl_confLink").addEventListener("click", handleClick);
        document.getElementById("y_confLink").addEventListener("click", handleClick);
        document.getElementById("sr_confLink").addEventListener("click", handleClick);
    }

    function handleClick(e) {
        if (e.target.getAttribute('id') != "confLink") {cat = "";}
        if (e.target.getAttribute('id') == "y_confLink") {label = "";}
        if (e.target.getAttribute('id') == "sr_confLink") {label = "Self-Released";}

        document.getElementById("confLink").removeEventListener("click", handleClick);
        document.getElementById("yl_confLink").removeEventListener("click", handleClick);
        document.getElementById("y_confLink").removeEventListener("click", handleClick);
        document.getElementById("sr_confLink").removeEventListener("click", handleClick);

        confirm();
    }

    function confirm() {
        let closed = 0;
        const message = " left to Confirm";
        dropTheAnchors();
        confLink.textContent = link.length - closed + message;

        for (let n = 0; n < link.length; n++) {
            let get = new XMLHttpRequest();
            get.open('GET', link[n]);
            get.onload = function() {
                let div = document.createElement("div");
                div.innerHTML = this.responseText;
                let form = div.querySelector("#upload_table");
                form.querySelector("input[name='remaster_year']").value = year;
                form.querySelector("input[name='remaster_record_label']").value = label;
                form.querySelector("input[name='remaster_catalogue_number']").value = cat;

                let fd = new FormData(form);
                fd.delete('unknown_edition_year');

                let post = new XMLHttpRequest();
                post.open('POST', link[n]);
                post.onload = function() {
                    closed++;
                    confLink.textContent = link.length - closed + message;
                    checkComplete(closed);
                };
                post.send(fd);
            };
            get.send();
        }
    }

    function raiseTheAnchors() {
        let a = [];
        a.push('<a href="javascript:void(0)" style="opacity:1.0" id="confLink">Confirm</a>');
        a.push('<a href="javascript:void(0)" style="opacity:0.6" id="yl_confLink">Year+Label Only</a>');
        a.push('<a href="javascript:void(0)" style="opacity:0.6" id="y_confLink">Year Only</a>');
        a.push('<a href="javascript:void(0)" style="opacity:0.6" id="sr_confLink">Self-Released</a>');
        search.querySelector("tbody tr td strong").insertAdjacentHTML('beforebegin', a.join('<span id="confPipe"> | </span>'));
        search.querySelector("tbody tr td strong").style.display = 'none';
        confLink = document.getElementById("confLink");
        addEvents();
    }

    function dropTheAnchors(){
        const anchors = search.querySelectorAll("a[id*='_confLink']");
        const pipes = search.querySelectorAll("span[id=confPipe]");

        for (let a = 0; a < anchors.length; a++) {
            anchors[a].style.display = 'none';
        }

        for (let p = 0; p < pipes.length; p++) {
            pipes[p].style.display = 'none';
        }
    }

    function checkComplete(closed) {
        if (closed == link.length) {
            setTimeout(function() {
                location.reload();
                confLink.textContent = "Reloading...";
            }, 300);
        }
    }
})();
