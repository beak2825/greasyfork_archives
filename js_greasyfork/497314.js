// ==UserScript==
// @name         MusicButlerPlus
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  Adds more functionality to MusicButler
// @author       Bababoiiiii
// @match        https://www.musicbutler.io/
// @match        https://www.musicbutler.io/users/profile/
// @match        https://www.musicbutler.io/artist-page/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=musicbutler.io
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/497314/MusicButlerPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/497314/MusicButlerPlus.meta.js
// ==/UserScript==

class deezer {
    static add_song_links() {
        function process_elem(elem, in_app) {
            console.log(elem)
            let artist = elem.querySelector("div > div.grow.mt-2 > div.flex.flex-col.w-full.justify-between.grow > div.justify-self-end.grow > div.flex.flex-row.text-xs.px-4.group-data-\\[xs-cols\\=\\'2\\'\\]\\:px-2.mt-2.items-end.text-skin-card-info > div > div > span > a > span").textContent;
            let song = elem.querySelector("div > div.grow.mt-2 > div.flex.flex-col.w-full.justify-between.grow > div.text-sm.font-bold.mt-4.group-data-\\[xs-cols\\=\\'2\\'\\]\\:mt-2.px-4.h-10.group-data-\\[xs-cols\\=\\'2\\'\\]\\:px-2.flex.justify-center.flex-col.my-2 > p").textContent;

            let type = elem.querySelector("div > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div");
            type = type.querySelector(`div:nth-child(${type.childElementCount})`).textContent.trim();

            let query = `{${type === "Single" ? "track" : "album"}:'${song.replace(/\(feat.*\)/i, "")}' artist:'${artist}'}`;

            let link = `${in_app ? "deezer" : "https"}://www.deezer.com/search/${query}/${type === "Single" ? "track" : "album"}`;

            let a = document.createElement("div");
            a.innerHTML = `<a class="block" href="${link}" target="_blank"> <div class="py-2 text-center text"> <i class="fab fa-fw fa-deezer" aria-label="Deezer Link for the release ${song}" style="color: rgb(162, 56, 255);"></i> </div> </a>`
            elem.querySelector("div > div.grow.mt-2 > div.flex.flex-col.w-full.justify-between.grow > div.justify-self-end.grow > div.flex.flex-row.justify-between.items-center.w-full.mt-2.px-\\[0\\.85rem\\].group-data-\\[xs-cols\\=\\'2\\'\\]\\:px-2").prepend(a);
        }

        let in_app = GM_getValue("open_deezer_in_app");

        // the first 20 songs are in the start html
        let all_songs = document.querySelector("#feed-releases-group").children;
        for (let i = 0; i < all_songs.length-1; i++) {
            process_elem(all_songs[i], in_app);
        }
        document.querySelector("#feed-releases-group").addEventListener("htmx:load", event => {
            if (!event.srcElement.getAttribute("hx-trigger")) { // loading icon is its own element, so we just check for any attribute unique to it
                process_elem(event.srcElement, in_app);
            }
        });
    }

    static add_artist_link() {
        let in_app = GM_getValue("open_deezer_in_app");
        let artist = document.querySelector("#content > div > div > div.bg-skin-base-300.py-6.mt-14.-mx-4 > div > div > div.flex.flex-row.items-center.space-x-6 > div.font-bold.text-2xl.text-skin-base-300-content").textContent;
        let link = `${in_app ? "deezer" : "https"}://www.deezer.com/search/${artist}/artist`

        let a = document.createElement("div");
        a.innerHTML = `<a class="block" href=${link} target="_blank"> <i class="fab fa-fw fa-deezer" aria-label="Deezer Link for the artist ${artist}" style="color: rgb(162, 56, 255);"></i> </a>`;
        document.querySelector("#content > div > div > div.bg-skin-base-300.py-6.mt-14.-mx-4 > div > div > div.flex.flex-row.items-center.space-x-6 > div.font-bold.text-2xl.text-skin-base-300-content").appendChild(a);
    }


    static settings() {
        let state = GM_getValue("open_deezer_in_app");

        const inactiveHTML = `<div tabindex="0" class="p-4 rounded-lg flex-col cursor-pointer ring-1 ring-gray-300 bg-gray-200 text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 hover:outline-none hover:ring-1 hover:ring-green-400"> <div class="flex flex-row items-center justify-between"> <label for="convert_deezer_links"> <span class="font-semibold"> Open Deezer links in app </span> </label> <span class="w-2 h-2 rounded-full inline-block bg-gray-400 "></span> <input type="checkbox" name="convert_deezer_links" class="hidden" id="id_convert_deezer_links"> </div> <div class="mt-4 text-sm font-medium text-gray-400 "> <em>Deezer links will not work if you enable this but don't have Deezer's app</em>. Only check this option if you have the Deezer app installed and want links to open there instead of the web-browser. </div> </div>`;
        const activeHTML = `<div _="on click toggle @checked on the first <input/> in me then send doSubmit to closest <form/>" tabindex="0" class="p-4 rounded-lg flex-col cursor-pointer bg-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400 hover:outline-none hover:ring-1 hover:ring-green-400"> <div class="flex flex-row items-center justify-between"> <label for="convert_deezer_links"> <span class="font-semibold"> Open Deezer links in app </span> </label> <span class="w-2 h-2 rounded-full inline-block bg-green-400 "></span> <input type="checkbox" name="convert_deezer_links" class="hidden" id="id_convert_deezer_links" checked=""> </div> <div class="mt-4 text-sm font-medium text-gray-200 "> <em>Deezer links will not work if you enable this but don't have Deezer's app</em>. Only check this option if you have the Deezer app installed and want links to open there instead of the web-browser. </div> </div>`;

        let e = document.createElement("div");
        e.innerHTML = state ? activeHTML : inactiveHTML;

        e.onclick = () => {
            state = !state
            GM_setValue("open_deezer_in_app", state);
            e.innerHTML = state ? activeHTML : inactiveHTML;
        }
        let parent = document.querySelector("#content > div > div");
        parent.insertBefore(e, parent.querySelector("div > form[hx-post='/users/update-profile-preferences-integrations-convert-spotify_links']").parentNode);

    }
}

class artists {
    static async retrieve() {
        const r = await fetch("https://www.musicbutler.io/artists/?sort=latestFollow&search=&org.htmx.cache-buster=artists-grid&sort=latestFollow");
        if (r.redirected || !r.ok) return;

        const resp = await r.text();
        const page = (new DOMParser).parseFromString(resp, "text/html");

        let artists = Array.from(page.querySelector("#artists-grid").children).map(artist => [(artist = artist.querySelector("div")).getAttribute("data-artist-name"), artist.getAttribute("data-artist-id")]);
        if (artists.length > 0) {
            GM_setValue("followed_artists", artists);
        }
        console.log(`Saved ${artists.length} artists`)
    }

    static edit(data) {
        GM_setValue("followed_artists", data);
    }

    static set(name_or_id_key, name_or_id_value) {
        if (!name_or_id_key) {
            throw("Key required");
        }
        if (!name_or_id_value) {
            throw("Value required");
        }
        const key = Number(name_or_id_key) ? 1 : 0;
        const value = key === 0 ? 1 : 0;

        name_or_id_key = name_or_id_key.toString();
        name_or_id_value = name_or_id_value.toString();

        const artists = this.get();
        for (let artist of artists) {
            if (artist[key] === name_or_id_key) {
                artist[value] = name_or_id_value;
                GM_setValue("followed_artists", artists);
                return;
            }
        }

        // key is name, name is first element
        if (key === 0) {
            artists.push([name_or_id_key, name_or_id_value]);
        } else {
            // key is id, id is second element
            artists.push([name_or_id_value, name_or_id_key]);
        }
        GM_setValue("followed_artists", artists);
    }

    static get(name_or_id_key) {
        const artists = GM_getValue("followed_artists") || [];
        if (!name_or_id_key) {
            return artists;
        }
        // identify if the id nor name was used as a key, since the list is ordered like [name, id], the key is set to the index of the corresponding key
        const key = Number(name_or_id_key) ? 1 : 0;
        const value = key === 0 ? 1 : 0;

        name_or_id_key = name_or_id_key.toString();


        for (let artist of artists) {
            if (artist[key] === name_or_id_key) {
                return artist[value];
            }
        }
    }

    static delete(name_or_id_key) {
        if (!name_or_id_key) {
            return false;
        }
        name_or_id_key = name_or_id_key.toString();

        const key = Number(name_or_id_key) ? 1 : 0;
        const value = key === 0 ? 1 : 0;

        const artists = this.get();
        for (let i = 0; i < artists.length; i++) {
            if (artists[i][key] === name_or_id_key) {
                artists.splice(i, 1);
                GM_setValue("followed_artists", artists);
                return true;
            }
        }
        return false;
    }

    static read(id_first=false) {
        if (id_first) {
            console.log(this.get()?.map(artist => artist.reverse().join(": ")).join("\n"));
        } else {
            console.log(this.get()?.map(artist => artist.join(": ")).join("\n"));
        }
    }

    static export_names(as_list=false) {
        const names = this.get().map(e => e[0]);
        return as_list ? names : names.join("\n");
    }

    static export_file() {
        const a = document.createElement("a");
        const file = new Blob([JSON.stringify(this.get(), null, 4)], {type: "text/plain"});
        a.href = URL.createObjectURL(file);
        a.download = "artists_export.json";
        a.click();
        URL.revokeObjectURL(a.href);
        a.remove();
    }
}




(function() {
    unsafeWindow.artists = artists;
    if (location.href === "https://www.musicbutler.io/") {
        deezer.add_song_links();
    }
    else if (location.href === "https://www.musicbutler.io/users/profile/") {
        // window.addEventListener('DOMContentLoaded', settings);
        deezer.settings();
    } else if (location.pathname.startsWith("/artist-page/")) {
        deezer.add_artist_link();
    }
})();