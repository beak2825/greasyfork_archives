// ==UserScript==
// @name        APL/PTH Artist Aliases Filter
// @namespace   APL/PTH Artist Aliases Filter
// @description Add a box on artist page to filter based on aliases
// @include     https://passtheheadphones.me/artist.php?id=*
// @include     https://apollo.rip/artist.php?id=*
// @include     https://xanax.rip/artist.php?id=*
// @version     1.2.5
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/26010/APLPTH%20Artist%20Aliases%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/26010/APLPTH%20Artist%20Aliases%20Filter.meta.js
// ==/UserScript==

/* Avoid using jQuery in this userscript, prioritize vanilla javascript as a matter of performance on big pages */

"use strict";

function Storage(alias_id) {
    this.key = "pth.artists_aliases_filter." + alias_id;

    this.save = function(data) {
        if (typeof data !== 'string') {
            data = JSON.stringify(data);
        }
        sessionStorage.setItem(this.key, data);
    };

    this.load = function() {
        let storage = sessionStorage.getItem(this.key) || "{}";
        return JSON.parse(storage);
    };
};

function Builder() {
    this.make_box_aliases = function() {
        let box_aliases =
            "<div class='box box_aliases'>" +
                "<div class='head'><strong>Aliases (Click to filter)</strong></div>" +
                "<ul class='stats nobullet'></ul>" +
            "</div>";
        return box_aliases;
    };

    this.make_alias_release = function(alias_id, alias_name) {
        let alias_release = 
            "<text class='alias_id'>" +
                " <i>as</i> " +
                "<a href='#content' alias_id='" + alias_id + "'>" +
                    alias_name +
                "</a>" +
            "</text>";
        return alias_release;
    }

    this.make_alias_li = function(alias_id, alias_name) {
        let alias_li = "<li><a href='#' alias_id='" + alias_id + "'>" + alias_name + "</a></li>";
        return alias_li;
    };

    this.make_alias_title = function(artist_name) {
        let main = "<a id='main_title' href='#' alias_id='-1'>" + artist_name + "</a>";
        let alias = "<span id='alias_title'></span>";
        let title = "<h2 id='title_filtering'>" + main + " " + alias + "</h2>";
        return title;
    };
};

function Manager() {
    this.builder = new Builder();
    this.aliases_list = undefined;
    this.current_alias_id = "-1";

    this.hash = undefined;
    this.aliases = undefined;
    this.groups = undefined;
    this.main_alias_id = undefined;
    this.main_name = undefined;
    this.tags = undefined;
    this.stats = undefined;
    this.tags_url = undefined;

    this.base_style = "#title_filtering { display: none; }";

    let self = this;

    this.proceed = function() {
        try {
            this.start();
        } catch (err) {
            this.set_error_message(err.message);
        }
    };

    this.start = function() {
        this.set_box_aliases();
        this.set_loading_message();

        let artist_id = this.get_artist_id();

        let storage = new Storage(artist_id);
        let storage_data = storage.load();

        this.set_style_node();

        this.compute_hash();

        let self = this;

        // If cache is not yet set or if it is no longer valid, query the API
        if (storage_data.hash !== this.hash) {
            this.query_api(artist_id, function(json_data) {
                self.parse_json_data(json_data);

                let data_to_save = {
                    "hash": self.hash,
                    "main_alias_id": self.main_alias_id,
                    "main_name": self.main_name,
                    "aliases": self.aliases,
                    "groups": self.groups
                }
                storage.save(data_to_save);
                self.set_aliases();
            });
        } else {
            self.hash = storage_data.hash;
            self.main_alias_id = storage_data.main_alias_id;
            self.main_name = storage_data.main_name;
            self.aliases = storage_data.aliases;
            self.groups = storage_data.groups;
            self.set_aliases();
        }
    };

    this.set_alias_title = function() {
        let content = document.getElementById("content");
        let header = content.getElementsByClassName("header")[0];
        let h2 = header.getElementsByTagName("h2")[0];
        h2.id = "default_title";
        
        let title = this.builder.make_alias_title(this.main_name);

        h2.insertAdjacentHTML("afterend", title);
    };

    this.set_style_node = function() {
        let head = document.getElementsByTagName('head')[0];
        let style = document.createElement('style');
        style.type = 'text/css';
        style.id = "artist_alias_filter_css";
        style.innerHTML = this.base_style;
        head.appendChild(style);
    };

    this.set_style = function(css) {
        let style = document.getElementById("artist_alias_filter_css");
        style.innerHTML = css;
    }

    // Set an array `groups_ids` of all groupid on the current artist page
    // to ensure that cache is still valid (no new group since last visit)
    this.compute_hash = function() {
        let elements = document.querySelectorAll("[id^='showimg_']");
        let groups_ids = [];
        for (let i = 0, len = elements.length; i < len; i++) {
            let group_id = elements[i].id.split("_")[1];
            groups_ids.push(group_id);
        }
        groups_ids.sort();

        let version = GM_info.script.version;
        groups_ids.unshift("version:" + version);

        let hash = groups_ids.toString();
        this.hash = hash;
    };

    // Parse JSON response after having queried the API and extract
    // main_alias_id, main_name, aliases and groups
    this.parse_json_data = function(data) {
        data = data.response;
        let main_name = data.name;
        let main_alias_id = undefined;
        let aliases = {};
        let groups = {};

        let main_id = data.id;

        // Iterate through each artists of each group to find those correct (`id` === `main_id`)
        let torrentgroup = data.torrentgroup;
        for (let i = 0, len = torrentgroup.length; i < len; i++) {
            let group = torrentgroup[i];
            let extendedArtists = group.extendedArtists;
            let found = false;

            let alias_id = -1;
            let group_id = group.groupId.toString();

            for (let id in extendedArtists) {
                let artists = extendedArtists[id];
                if (artists) {
                    for (let j = 0, len_ = artists.length; j < len_; j++) {
                        let artist = artists[j];
                        if (artist.id === main_id) {
                            // This is not perfect:
                            // If a release contains references to multiple aliases of the same artist, it keeps only the first one
                            // For example, see group 72607761 of Snoop Dogg
                            // However, it is better for performance not to have to iterate through an array
                            // So let's say 1 group release => 1 artist alias
                            alias_id = artist.aliasid.toString();
                            aliases[alias_id] = artist.name;

                            if ((main_alias_id === undefined) && (artist.name === main_name)) {
                                // Sometimes, the alias_id associated with the artist main id differs, see artist 24926
                                // But we need it to not display "as Alias" besides releases of main artist name
                                main_alias_id = alias_id;
                            }
                            found = true;
                            break;
                        }
                    }
                }
                if (found) break;
            }
            // Sometimes, release does not contain any artist because of an issue with the API
            // See: https://what.cd/forums.php?action=viewthread&threadid=192517&postid=5290204
            // In such a case (aliasid == -1), the release is not linked to any alias, just the default "[Show All]"
            groups[group_id] = alias_id;
        }
        this.main_name = main_name;
        this.main_alias_id = main_alias_id;
        this.aliases = aliases;
        this.groups = groups;
    };

    this.query_api = function(artist_id, callback) {
        let self = this;
        let url = "/ajax.php?action=artist&id=" + artist_id;

        let xhr  = new XMLHttpRequest();
        xhr.timeout = 20000;
        xhr.ontimeout = function() {
            this.set_error_message("The API query timed out.");
        };
        xhr.onerror = function() {
            this.set_error_message("The API query failed.\n" + xhr.statusText);
        };
        xhr.onload = function() {
            if (xhr.status === 200) {
                let data = JSON.parse(xhr.responseText);
                callback(data);
            } else {
                self.set_error_message("The API query returned an error.\n" + xhr.statusText);
            }
        };
        xhr.open("GET", url, true);
        xhr.send(null);
    };

    this.filter_releases = function(event) {
        try {
            if (this.getAttribute("href") === "#") {
                event.preventDefault();
            }

            let current_alias_id = self.current_alias_id;
            let new_alias_id = this.getAttribute("alias_id");

            if (new_alias_id === current_alias_id) return;

            let current_link = self.aliases_list.querySelector("[alias_id='" + current_alias_id + "']");
            let new_link = self.aliases_list.querySelector("[alias_id='" + new_alias_id + "']");

            current_link.style.fontWeight = "";
            new_link.style.fontWeight = "bold";

            let groups = self.groups;
            let viewer = self.viewer;

            if (new_alias_id === "-1") {
                self.set_style(self.base_style);
            } else {
                document.getElementById("alias_title").innerHTML = "[" + self.aliases[new_alias_id] + "]";
                self.set_style(
                    "#default_title { display: none; } " +
                    ".alias_id:not(.alias_id_" + new_alias_id + ") { display: none; }"
                );
            }

            self.current_alias_id = new_alias_id;
        } catch (err) {
            self.set_error_message(err.message);
        }
    };

    this.get_artist_id = function() {
        let artist_id = window.location.href.match(/id=(\d+)/)[1];
        return artist_id;    
    };

    this.set_error_message = function(msg) {
        this.aliases_list.innerHTML = "<li><strong>An error occured.</strong></br>" + msg + "</li>";
    };

    this.set_loading_message = function() {
        this.aliases_list.innerHTML = "<li>Loading...</li>";
    };

    this.set_box_aliases = function() {
        let box_search = document.getElementsByClassName("box_search")[0];
        let box_aliases = this.builder.make_box_aliases();
        box_search.insertAdjacentHTML('beforebegin', box_aliases);
        box_aliases = box_search.parentNode.getElementsByClassName("box_aliases")[0];
        this.aliases_list = box_aliases.getElementsByClassName("stats")[0];
    };

    this.append_alias_filter = function(alias_id, alias_name) {
        let li = this.builder.make_alias_li(alias_id, alias_name);
        this.aliases_list.insertAdjacentHTML('beforeend', li);
    };

    this.set_aliases_list = function() {
        this.aliases_list.innerHTML = "";
        this.append_alias_filter(-1, "[Show All]");
        let first = this.aliases_list.getElementsByTagName("a")[0];
        first.style.fontSize = "80%";
        first.style.fontWeight = "bold";
        for (let alias_id in this.aliases) {
            let name = this.aliases[alias_id];
            this.append_alias_filter(alias_id, name);
        }
    };

    this.bind_filter = function() {
        let filters = document.querySelectorAll("[alias_id]");
        for (let i = 0, len = filters.length; i < len; i++) {
            let filter = filters[i];
            filter.addEventListener("click", this.filter_releases);
        }
    };

    this.set_aliases = function() {
        if (Object.keys(this.aliases).length < 2) {
            let box_aliases = document.getElementsByClassName("box_aliases")[0];
            box_aliases.style.display = "none";
            return;
        }
        this.set_alias_title();
        this.set_aliases_list();
        this.set_releases_classes();
        this.bind_filter();
    };

    this.set_releases_classes = function() {
        let aliases = this.aliases;
        let groups = this.groups;
        let main_alias_id = this.main_alias_id;

        let builder = this.builder;

        let torrent_tables = document.getElementsByClassName("torrent_table");
        let categories = document.getElementById("discog_table").getElementsByClassName("box")[0];

        for (let i = 0, len = torrent_tables.length; i < len; i++) {
            let table = torrent_tables[i];
            let id = table.getAttribute("id");
            let aliases_in_this_category = {};

            let discogs = table.getElementsByClassName("discog");
            let alias_id = undefined;

            for (let j = 0, len_ = discogs.length; j < len_; j++) {
                let discog = discogs[j];
                // The groupid of each torrent row is the same that the previous encountered main release row
                // This avoid having to extract groupid value at each iteration
                if (discog.classList.contains("group")) {
                    let group_id = discog.querySelector("[id^='showimg_']").id.split("_")[1];
                    alias_id = groups[group_id];
                    aliases_in_this_category[alias_id] = 1;

                    if ((alias_id !== main_alias_id) && (alias_id != -1)) {
                        let group_info = discog.getElementsByClassName("group_info")[0];
                        let strong = group_info.getElementsByTagName("strong")[0];
                        let name = aliases[alias_id];

                        let alias_text = builder.make_alias_release(alias_id, name);

                        strong.insertAdjacentHTML("beforeend", alias_text);
                    }
                }

                discog.className += " alias_id alias_id_" + alias_id;
            }

            let category_aliases = " alias_id";
            for (let alias in aliases_in_this_category) {
                category_aliases += " alias_id_" + alias;
            }
            table.className += category_aliases;
            categories.querySelector("[href='#" + id + "']").className += category_aliases;
        }
    };
};

let manager = new Manager();
manager.proceed();
