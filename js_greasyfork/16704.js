// ==UserScript==
// @name        RED Artist Aliases Filter
// @namespace   PTH Artist Aliases Filter
// @description Add a box on artist page to filter based on aliases
// @include     https://redacted.sh/artist.php?id=*
// @version     1.3.8
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/16704/RED%20Artist%20Aliases%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/16704/RED%20Artist%20Aliases%20Filter.meta.js
// ==/UserScript==

/* Avoid using jQuery in this userscript, prioritize vanilla javascript as a matter of performance on big pages */

"use strict";

function Storage(alias_id) {
    this.key = "red.artists_aliases_filter." + alias_id;

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

function ConfigManager() {
    this.key = "red.artists_aliases_filter.CONFIG";

    this.default = {
        "display_nb_groups": 0
    };

    this.save = function(config) {
        if (typeof config !== 'string') {
            config = JSON.stringify(config);
        }
        localStorage.setItem(this.key, config);
    };

    this.load = function() {
        let config = {};
        for (let key in this.default) {
            config[key] = this.default[key];
        }
        let parsed = JSON.parse(localStorage.getItem(this.key) || "{}");
        for (let key in parsed) {
            if (this.default.hasOwnProperty(key)) {
                config[key] = parsed[key];
            }
        }
        return config;
    };
};

function Builder() {
    this.make_box_aliases = function() {
        let box_aliases =
            "<div class='box box_aliases'>" +
                "<div class='head'><strong>Aliases</strong></div>" +
                "<ul class='stats nobullet'></ul>" +
            "</div>";
        return box_aliases;
    };

    this.make_alias_release = function(alias_id, alias_name) {
        let alias_release =
            "<text class='filtering_off'>" +
                " <i>as</i> " +
                "<a href='#content' class='alias_filter' alias_id='" + alias_id + "'>" +
                    alias_name +
                "</a>" +
            "</text>";
        return alias_release;
    };

    this.mousehover_nb_groups = "Number of releases with this alias";

    this.make_alias_li = function(alias_id, alias_name, nb_groups) {
        let nb_groups_str = "";
        if (nb_groups !== undefined) {
            nb_groups_str = "(" + nb_groups.toString() + ")";
        }
        let span_nb_groups =
            "<span title='" + this.mousehover_nb_groups + "' class='alias_list_nb_groups'>" +
                nb_groups_str +
            "</span>";
        let alias_li =
            "<li>" +
                "<a href='#' class='alias_filter' alias_id='" + alias_id.toString() + "'>" + alias_name + "</a>" +
                " " + span_nb_groups +
            "</li>";
        return alias_li;
    };

    this.make_tag_ul = function(alias_id, innerHTML) {
        let tag_ul =
            "<ul class='stats nobullet filtering_on alias_id alias_id_" + alias_id + "'>" +
                innerHTML +
            "</ul>";
        return tag_ul;
    };

    this.make_tag_li = function(alias_name, tag_name, tag_count) {
        let href = "torrents.php?taglist=" + tag_name +
                   "&amp;artistname=" + encodeURIComponent(alias_name) +
                   "&amp;action=advanced&amp;searchsubmit=1";

        // Count do not need formatting (see Bach) on the contrary of stats
        let tag_li =
            "<li>" +
                "<a href='" + href + "'>" + tag_name + "</a> (" + tag_count.toString() + ")" +
            "</li>";
        return tag_li;
    };

    this.make_stats_ul = function(alias_id, innerHTML) {
        let stats_ul =
            "<ul class='stats nobullet filtering_on alias_id alias_id_" + alias_id + "'>" +
                innerHTML +
            "</ul>";
        return stats_ul;
    }

    this.make_stats_li = function(type, number) {
        let stats_li =
            "<li>" +
                "Number of " + type + ": " + number.toLocaleString("en") +
            "</li>";
        return stats_li;
    }

    this.make_alias_title = function(artist_name) {
        let main = "<a href='#' class='alias_filter' alias_id='-1'>" + artist_name + "</a>";
        let alias = "<span id='alias_title'></span>";
        let span_nb_groups =
            "<span id='alias_title_nb_groups' title='" + this.mousehover_nb_groups + "'>" +
            "</span>";
        let title =
            "<h2 class='filtering_on'>" +
                main + " " + alias + " " + span_nb_groups +
            "</h2>";
        return title;
    };

    this.make_css_style = function(id) {
        let style =
            "<style type='text/css' " + (id === undefined ? "" : "id='" + id + "'") + ">" +
            "</style>";
        return style;
    }
};

function Manager() {
    this.builder = new Builder();
    this.config_manager = new ConfigManager();

    this.config = undefined;

    this.current_alias_id = "-1";

    this.try_catch = function(func) {
        let self = this;
        func = func.bind(this);

        function wrapped() {
            try {
                func();
            } catch(err) {
                let err_msg = err.message + " (line " + err.lineNumber + ")";
                console.log("Error in RED AAF: '" + err_msg + "'.");
                self.set_error_message(err_msg);
            }
        }

        return wrapped;
    };

    this.get_aliases_list = function() {
        let aliases_list = document.getElementById("aliases_list");
        return aliases_list;
    };

    this.set_error_message = function(msg) {
        let error_msg =
            "<li>" +
                "<strong>An error occured.</strong></br>" +
                msg +
            "</li>";
        let aliases_list = this.get_aliases_list();
        aliases_list.innerHTML = error_msg;
    };

    this.proceed = function() {
        let start = this.try_catch(this.start);
        start();
    };

    this.start = function() {
        let artist_id = this.get_artist_id();

        this.set_box_aliases();
        this.set_loading_message();

        this.set_style_node();
        this.reset_style();

        let config = this.config_manager.load();
        this.config = config;
        this.apply_config(config);
        this.register_config();

        let hash = this.compute_hash();

        let storage = new Storage(artist_id);
        let storage_data = storage.load();

        let self = this;

        // If cache is not yet set or if it is no longer valid, query the API
        if (storage_data["hash"] !== hash) {
            this.query_api(artist_id, function(json_data) {
                let data = self.parse_json_data(json_data);
                data["hash"] = hash;
                storage.save(data);
                self.set_aliases(data);
            });
        } else {
            this.set_aliases(storage_data);
        }
    };

    this.set_box_aliases = function() {
        let box_search = document.getElementsByClassName("box_search")[0];
        let box_aliases = this.builder.make_box_aliases();
        box_search.insertAdjacentHTML('beforebegin', box_aliases);
        box_aliases = box_search.parentNode.getElementsByClassName("box_aliases")[0];
        box_aliases.getElementsByClassName("stats")[0].id = "aliases_list";
    };

    this.set_loading_message = function() {
        let aliases_list = this.get_aliases_list();
        aliases_list.innerHTML = "<li>Loading...</li>";
    };

    this.get_artist_id = function() {
        let artist_id = window.location.href.match(/id=(\d+)/)[1];
        return artist_id;
    };

    this.set_style_node = function() {
        let head = document.getElementsByTagName('head')[0];
        let style_filter = this.builder.make_css_style("artist_alias_filter_css");
        let style_nb_groups = this.builder.make_css_style("artist_alias_filter_nb_groups_css");
        head.insertAdjacentHTML('beforeend', style_filter);
        head.insertAdjacentHTML('beforeend', style_nb_groups);
    };

    this.set_style_filter = function(css) {
        let style = document.getElementById("artist_alias_filter_css");
        style.innerHTML = css;
    };

    this.set_style_nb_groups = function(css) {
        let style = document.getElementById("artist_alias_filter_nb_groups_css");
        style.innerHTML = css;
    };

    this.reset_style = function() {
        let style =
            ".filtering_on { display: none; }";
        this.set_style_filter(style);
    };

    this.filter_style = function(alias_id) {
        let style =
            ".filtering_off { display: none; } " +
            ".alias_id:not(.alias_id_" + alias_id.toString() + ") { display: none; }";
        this.set_style_filter(style);
    };

    this.register_config = function() {
        let self = this;

        let caption = "RED Artist Alias Filter - Configuration";

        function callback() {
            let new_config = self.configure(self.config);
            self.config = new_config;
            self.config_manager.save(new_config);
            self.apply_config(new_config);
        };

        // Undefined using GreaseMonkey
        if (typeof GM_registerMenuCommand != "undefined") {
            GM_registerMenuCommand(caption, callback);
        }
    };

    this.configure = function(current_config) {
        let new_config = {};
        for (var key in current_config) {
            new_config[key] = current_config[key];
        }

        let display_nb_groups = current_config["display_nb_groups"];
        let text =
            "Display of the number of releases per alias:\n" +
            "0. Don't display\n" +
            "1. Display it in the Aliases box\n" +
            "2. Display it in the title while on a filtered page\n" +
            "3. Both";

        let value = prompt(text, display_nb_groups);

        if (value === null) {
            return current_config;
        }

        let val = parseInt(value);

        if ([0, 1, 2, 3].indexOf(val) === -1) {
            alert("Invalid value!");
            return current_config;
        }

        new_config["display_nb_groups"] = val;
        return new_config
    };

    this.apply_config = function(config) {
        let display_nb_groups = config["display_nb_groups"];
        let style = "";

        if (display_nb_groups === 0 || display_nb_groups === 1) {
            style += "#alias_title_nb_groups { display: none; } ";
        }

        if (display_nb_groups === 0 || display_nb_groups === 2) {
            style += ".alias_list_nb_groups { display: none; } ";
        }

        this.set_style_nb_groups(style);
    };

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
        return hash;
    };

    // Parse JSON response after having queried the API and extract
    // main_alias_id, main_name, aliases, groups, and tags
    this.parse_json_data = function(json_data) {
        json_data = json_data.response;
        let main_name = json_data.name;
        let main_alias_id = undefined;
        let aliases = {};      // alias_id => alias_name
        let groups = {};       // group_id => alias_id
        let aliases_tags = {}; // alias_id => tag_name => count
        let tags = {};         // alias_id => [tag_name, count]

        let main_id = json_data["id"]

        // Iterate through each artists of each group to find those correct (`id` === `main_id`)
        let torrentgroup = json_data.torrentgroup;
        for (let i = 0, len = torrentgroup.length; i < len; i++) {
            let group = torrentgroup[i];

            // Same release can appear twice in different categories
            if (groups.hasOwnProperty(group) && groups[group] !== "-1") {
                continue;
            }

            let extendedArtists = group["extendedArtists"];
            let release_type = group["releaseType"];
            let found = false;

            let alias_id = "-1";
            let group_id = group["groupId"].toString();

            // Search alias_id through the list of artists lists
            for (let id in extendedArtists) {
                let artists = extendedArtists[id];
                if (artists) {
                    for (let j = 0, len_ = artists.length; j < len_; j++) {
                        let artist = artists[j];
                        if (artist["id"] === main_id) {
                            // This is not perfect:
                            // If a release contains references to multiple aliases of the same artist, it keeps only the first one
                            // For example, see group 72607761 of Snoop Dogg
                            // However, it is better for performance not to have to iterate through an array
                            // So let's say 1 group release => 1 artist alias
                            alias_id = artist["aliasid"].toString();
                            aliases[alias_id] = artist["name"];

                            if ((main_alias_id === undefined) && (artist["name"] === main_name)) {
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

            // Create the dictionary to update tags box
            // Skip compilations and soundtracks
            // See Gazelle code source: https://github.com/WhatCD/Gazelle/blob/2aa4553f7a508e0051cae2249229bfe0f3f99c89/sections/artist/artist.php#L258
            if (release_type !== 7 && release_type !== 3 && alias_id !== "-1") {
                if (!aliases_tags.hasOwnProperty(alias_id)) {
                    aliases_tags[alias_id] = {};
                }
                let artist_tags = aliases_tags[alias_id];
                let group_tags = group["tags"];
                for (let j = 0, len_ = group_tags.length; j < len_; j++) {
                    let tag = group_tags[j];
                    if (!artist_tags.hasOwnProperty(tag)) {
                        artist_tags[tag] = 1;
                    } else {
                        artist_tags[tag] += 1
                    }
                }
            }
        }

        // Sort tags list by count and keep only top 50 (see Gazelle code source)
        for (let artist_id in aliases_tags) {
            let tags_dict = aliases_tags[artist_id];
            let tags_pairs = Object.keys(tags_dict).map(function(tag) {
                return [tag, tags_dict[tag]];
            });
            tags_pairs.sort(function(pair_1, pair_2) {
                return pair_2[1] - pair_1[1];
            });
            tags_pairs = tags_pairs.slice(0, 50);
            tags[artist_id] = tags_pairs;
        }

        let data = {
            "tags": tags,
            "main_name": main_name,
            "main_alias_id": main_alias_id,
            "aliases": aliases,
            "groups": groups
        };

        return data;
    };

    this.query_api = function(artist_id, callback) {
        let self = this;
        let url = "/ajax.php?action=artist&id=" + artist_id;

        let xhr = new XMLHttpRequest();
        xhr.timeout = 20000;

        xhr.ontimeout = this.try_catch(
            function() {
                self.set_error_message("The API query timed out.");
            }
        );

        xhr.onerror = this.try_catch(
            function() {
                self.set_error_message("The API query failed.\n" + xhr.statusText);
            }
        );

        xhr.onload = this.try_catch(
            function() {
                if (xhr.status === 200) {
                    let data = JSON.parse(xhr.responseText);
                    callback(data);
                } else {
                    self.set_error_message("The API query returned an error.\n" + xhr.statusText);
                }
            }
        );

        xhr.open("GET", url, true);
        xhr.send(null);
    };

    this.set_alias_title = function(alias_name, nb_groups) {
        document.getElementById("alias_title").innerHTML = "[" + alias_name + "]";
        document.getElementById("alias_title_nb_groups").innerHTML = "(" + nb_groups.toString() + ")";
    };

    this.append_alias_filter = function(alias_id, alias_name, nb_groups) {
        let li = this.builder.make_alias_li(alias_id, alias_name, nb_groups);
        let aliases_list = this.get_aliases_list();
        aliases_list.insertAdjacentHTML('beforeend', li);
    };

    this.set_aliases = function(data) {
        if (Object.keys(data["aliases"]).length < 2) {
            this.cancel_process();
            return;
        }
        this.init_alias_title(data["main_name"]);
        let stats = this.classify_releases(data["aliases"], data["groups"], data["main_alias_id"]);
        this.populate_tags(data["aliases"], data["tags"]);
        this.compute_stats(stats);
        this.fill_aliases_list(data["aliases"], stats);
        this.bind_filter(data["aliases"], stats);
    };

    this.cancel_process = function() {
        let box_aliases = document.getElementsByClassName("box_aliases")[0];
        box_aliases.style.display = "none";
    };

    this.init_alias_title = function(main_name) {
        let content = document.getElementById("content");
        let header = content.getElementsByClassName("header")[0];
        let h2 = header.getElementsByTagName("h2")[0];
        h2.className += " filtering_off";

        let title = this.builder.make_alias_title(main_name);

        h2.insertAdjacentHTML("afterend", title);
    };

    this.fill_aliases_list = function(aliases, stats) {
        let aliases_list = this.get_aliases_list();
        aliases_list.innerHTML = "";
        this.append_alias_filter("-1", "[Show All]");
        let first = aliases_list.getElementsByTagName("a")[0];
        first.style.fontSize = "80%";
        first.style.fontWeight = "bold";
        for (let alias_id in aliases) {
            let name = aliases[alias_id];
            this.append_alias_filter(alias_id, name, stats[alias_id]["groups"]);
        }
    };

    this.classify_releases = function(aliases, groups, main_alias_id) {
        let stats = {}; // Compute stats while classifying trough torrents
        let torrent_tables = document.getElementsByClassName("torrent_table");
        let categories = document.getElementById("discog_table").getElementsByClassName("box")[0];

        for (let alias_id in aliases) {
            stats[alias_id] = {
                "groups_ids": {},
                "groups": 0,
                "torrents": 0,
                "seeders": 0,
                "leechers": 0,
                "snatches": 0
            }
        }

        for (let i = 0, len = torrent_tables.length; i < len; i++) {
            let table = torrent_tables[i];
            let category_id = table.getAttribute("id");
            let aliases_in_this_category = {};

            let discogs = table.getElementsByClassName("discog");
            let count_stats = false;
            let alias_id = undefined;
            let group_id = undefined;

            for (let j = 0, len_ = discogs.length; j < len_; j++) {
                let discog = discogs[j];
                // The groupid of each torrent row is the same that the previous encountered main release row
                // This avoid having to extract groupid value at each iteration

                if (discog.classList.contains("group")) {
                    // Retrieve group_id and alias_id for this release
                    group_id = discog.querySelector("[id^='showimg_']").id.split("_")[1];
                    alias_id = groups[group_id];
                    aliases_in_this_category[alias_id] = 1;

                    // Append "as Alias" to release artist name if needed
                    if (alias_id !== main_alias_id && alias_id !== "-1") {
                        let group_info = discog.getElementsByClassName("group_info")[0];
                        let strong = group_info.getElementsByTagName("strong")[0];
                        let name = aliases[alias_id];

                        let alias_text = this.builder.make_alias_release(alias_id, name);

                        strong.insertAdjacentHTML("beforeend", alias_text);
                    }

                    // Avoid same torrents in two different categories to be counted twice for stats
                    if (alias_id === "-1" || stats[alias_id]["groups_ids"].hasOwnProperty(group_id)) {
                        count_stats = false;
                    } else {
                        stats[alias_id]["groups_ids"][group_id] = 1;
                        stats[alias_id]["groups"] += 1;
                        count_stats = true;
                    }
                } else if (count_stats && discog.classList.contains("torrent_row") && alias_id !== "-1") {
                    // Update stats with the current torrent
                    let alias_stats = stats[alias_id];
                    let cols = discog.getElementsByClassName("number_column");

                    let seeders = parseInt(cols[2].innerText);
                    let leechers = parseInt(cols[3].innerText);
                    let snatches = parseInt(cols[1].innerText);

                    alias_stats["torrents"] += 1;
                    alias_stats["seeders"] += seeders;
                    alias_stats["leechers"] += leechers;
                    alias_stats["snatches"] += snatches;
                }

                discog.className += " alias_id alias_id_" + alias_id;
            }

            let category_aliases = " alias_id";
            for (let alias_id in aliases_in_this_category) {
                category_aliases += " alias_id_" + alias_id;
            }
            table.className += category_aliases;
            categories.querySelector("[href='#" + category_id + "']").className += category_aliases;
        }

        return stats;
    };

    this.bind_filter = function(aliases, stats) {
        let self = this;
        let filters = document.getElementsByClassName("alias_filter");

        function callback(event) {
            let call = self.try_catch(
                function() {
                    let clicked = event.target;
                    if (clicked.getAttribute("href") === "#") {
                        event.preventDefault();
                    }
                    let alias_id = clicked.getAttribute("alias_id");
                    self.filter_releases(alias_id, aliases, stats);
                }
            );
            call();
        }

        for (let i = 0, len = filters.length; i < len; i++) {
            let filter = filters[i];
            filter.addEventListener("click", callback);
        }
    };

    this.populate_tags = function(aliases, tags) {
        let box_tags = document.getElementsByClassName("box_tags")[0];
        if (!box_tags) {
            return;
        }

        let tag_list = box_tags.getElementsByClassName("stats")[0];
        tag_list.className += " filtering_off";

        for (let alias_id in tags) {
            let alias_tags = tags[alias_id];
            let alias_name = aliases[alias_id];
            let li_list = "";

            for (let i = 0, len = alias_tags.length; i < len; i++) {
                let tag_and_count = alias_tags[i];
                let tag = tag_and_count[0];
                let count = tag_and_count[1];
                let li = this.builder.make_tag_li(alias_name, tag, count);
                li_list += li;
            }

            if (li_list === "") {
                li_list = "<li>No torrent tags</li>";
            }

            let ul = this.builder.make_tag_ul(alias_id, li_list);
            tag_list.insertAdjacentHTML("beforebegin", ul);
        }
    };

    this.compute_stats = function(stats) {
        let box_stats = document.getElementsByClassName("box_statistics_artist")[0];
        if (!box_stats) {
            return;
        }

        let stats_list = box_stats.getElementsByClassName("stats")[0];
        stats_list.className += " filtering_off";

        let builder = this.builder;
        let labels = ["groups", "torrents", "seeders", "leechers", "snatches"];

        for (let alias_id in stats) {
            let alias_stats = stats[alias_id];
            let li_list = "";

            for (let i = 0, len = labels.length; i < len; i++) {
                let label = labels[i];
                li_list += builder.make_stats_li(label, alias_stats[label]);
            }

            let ul = builder.make_stats_ul(alias_id, li_list);
            stats_list.insertAdjacentHTML("beforebegin", ul);
        }
    };

    this.filter_releases = function(alias_id, aliases, stats) {
        let current_alias_id = this.current_alias_id;
        if (alias_id === current_alias_id) return;

        let aliases_list = this.get_aliases_list();
        let current_link = aliases_list.querySelector("[alias_id='" + current_alias_id + "']");
        let new_link = aliases_list.querySelector("[alias_id='" + alias_id + "']");

        current_link.style.fontWeight = "";
        new_link.style.fontWeight = "bold";

        if (alias_id === "-1") {
            this.reset_style();
        } else {
            this.set_alias_title(aliases[alias_id], stats[alias_id]["groups"]);
            this.filter_style(alias_id);
        }

        this.current_alias_id = alias_id;
    };
};

let manager = new Manager();
manager.proceed();
