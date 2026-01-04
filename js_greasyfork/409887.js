// ==UserScript==
// @name         osuMapFilter
// @namespace    https://greasyfork.org/users/110545
// @version      0.5
// @description  filter osu maps
// @author       x94fujo6
// @match        https://osu.ppy.sh/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409887/osuMapFilter.user.js
// @updateURL https://update.greasyfork.org/scripts/409887/osuMapFilter.meta.js
// ==/UserScript==
/* jshint esversion: 9 */
/* 
you need map list to make this work!!!
https://github.com/x94fujo6rpg/osuMapFilter
*/

(function () {
    'use strict';
    const LS = window.localStorage;
    let map_list = [],
        stop = false,
        debug_msg = false,
        mode = 3, // don't touch this
        // 1:array 2:hash 3:set, https://jsbench.me/zfknghmteu/2
        tester;

    function getTester() {
        switch (mode) {
            case 1:
                tester = (id) => { return map_list.includes(id); };
                break;
            case 2:
                tester = (id) => { return map_list[id]; };
                break;
            case 3:
                tester = (id) => { return map_list.has(id); };
                break;
            default:
                tester = false;
                break;
        }
    }

    getTester();
    if (!tester) return console.log("tester not set");
    window.onload = main();

    async function main() {
        let link = window.location.href;
        await wait_tab();
        if (link.includes("/beatmapsets")) {
            if (link.match(/beatmapsets\/\d+/)) {
                waitHTML(".beatmapset-header__buttons [href$='download']", mapPage);
            } else {
                mapListPage();
            }
        } else {
            console.log("no match, abort");
        }
    }

    function mapPage() {
        let dlb = document.querySelector(".beatmapset-header__buttons [href$='download']");
        let map_id = dlb.href.match(/beatmapsets\/(\d+)\/download/)[1];
        mapListPage(false);

        dlb.onclick = () => {
            console.log(`download ${map_id}, add to list`);
            addItem(map_id);
            saveData({
                mode,
                map_list,
            });
        };
    }

    function mapListPage(run = true) {
        if (run) {
            creatbox();
            document.getElementById("read_osu_map_list")
                .addEventListener("change", readfile, false);
        }

        if (LS.getItem("mode")) {
            console.log("found old data, load it");
            mode = Number(LS.getItem("mode"));
            if (mode == 3) {
                map_list = new Set(JSON.parse(LS.getItem("map_list")));
            } else {
                map_list = JSON.parse(LS.getItem("map_list"));
            }
            getTester();
            console.log({
                mode,
                tester,
            });
            stop = false;
            if (run) {
                setTimeout(runfilter, 1000);
            }
        }
    }

    function wait_tab() {
        return new Promise(resolve => {
            if (document.visibilityState === "visible") return resolve();
            console.log("tab in background, script paused");
            document.addEventListener("visibilitychange", () => {
                if (document.visibilityState === "visible") {
                    console.log("script unpaused");
                    return resolve();
                }
            });
        });
    }

    function waitHTML(css_selector, run) {
        let id = setInterval(() => {
            if (document.querySelectorAll(css_selector).length) {
                clearInterval(id);
                run();
                console.log(`found [${css_selector}]`);
            } else {
                console.log(`[${css_selector}] not found`);
            }
        }, 1000);
    }

    function updatestatus(text = "") {
        document.getElementById("current_filter_status").textContent = text;
    }

    function runfilter() {
        let length = mode == 3 ? map_list.size : map_list.length;
        if (stop || length == 0) return updatestatus("Filter stopped");
        let all_map = document.querySelectorAll(".beatmapsets__item");
        let count = all_map.length;
        updatestatus(`Filter is running\n${length} maps in list`);
        all_map.forEach(item => {
            setTimeout(() => {
                if (stop || length === 0) return updatestatus("Filter stopped");
                let map_id = item.querySelector(`[data-audio-url]`).getAttribute("data-audio-url").match(/\/(\d+)\.mp3/);
                let link = item.querySelectorAll("a");
                let dlb = item.querySelector("[href$='/download']");
                if (!map_id) return;
                map_id = map_id[1];
                if (tester(map_id)) {
                    item.style.opacity = "10%";
                    if (debug_msg) console.log(`${count} hide ${map_id}`);
                } else {
                    item.style.opacity = "100%";
                }
                link.forEach(a => {
                    if (!a.href.includes("/download")) {
                        a.setAttribute("target", "_blank");
                    }
                });
                dlb.onclick = () => {
                    console.log(`download ${map_id}, add to list`);
                    addItem(map_id);
                    saveData({
                        mode,
                        map_list,
                    });
                };
                count--;
                if (count == 0) {
                    setTimeout(runfilter, 200);
                }
            }, 0);
        });
    }

    function addItem(id = "") {
        switch (mode) {
            case 1:
                map_list.push(id);
                break;
            case 2:
                map_list[id] = true;
                break;
            case 3:
                map_list.add(id);
                break;
            default:
                throw Error("unknown mode");
        }
    }

    function creatbox() {
        let newbox = document.createElement("div");
        Object.assign(newbox.style, {
            position: "fixed",
            top: "20%",
            right: "5%",
            width: "200px",
            "z-index": "100",
            border: "2px",
            "border-color": "rgba(255, 255, 255, 0.7)",
            "border-style": "ridge",
            "background-color": "rgba(255, 255, 255, 0.3)",
        });
        let readfile = document.createElement("input");
        Object.assign(readfile, {
            type: "file",
            id: "read_osu_map_list"
        });
        let status = document.createElement("span");
        Object.assign(status, {
            id: "current_filter_status",
            style: "word-wrap:break-word;white-space:pre-line;",
            textContent: "Load map_list.txt to start"
        });
        let button = document.createElement("button");
        Object.assign(button, {
            textContent: "Stop Script",
            style: "color: black",
            onclick: function () {
                if (!stop) {
                    stop = true;
                    updatestatus("Filter stopped");
                    button.textContent = "Resume Script";
                } else {
                    stop = false;
                    button.textContent = "Stop Script";
                    runfilter();
                }
            }
        });
        newbox.appendChild(readfile);
        newbox.appendChild(status);
        newbox.appendChild(button);
        document.body.appendChild(newbox);
    }

    function readfile(myfile) {
        let file = myfile.target.files[0];
        if (!file) {
            stop = true;
            updatestatus("Filter stopped");
            return;
        }
        let reader = new FileReader();
        reader.onload = function (myfile) {
            let contents = myfile.target.result;
            map_list = JSON.parse(contents);
            stop = 0;
            if (map_list.length > 0) {
                switch (mode) {
                    case 1:
                        console.log("mode: array");
                        break;
                    case 2:
                        console.log("mode: hash");
                        let new_obj = {};
                        map_list.forEach(id => new_obj[id] = true);
                        new_obj.length = map_list.length;
                        map_list = new_obj;
                        break;
                    case 3:
                        console.log("mode: set");
                        map_list = new Set(map_list);
                        break;
                }
                runfilter();
                saveData({
                    mode,
                    map_list,
                });
            }
        };
        reader.readAsText(file);
    }

    function removeData(data = {}) {
        return new Promise((resolve, reject) => {
            try {
                for (let key in data) {
                    LS.removeItem(key);
                }
            } catch (e) {
                console.log(e);
                reject();
            }
            resolve();
        });
    }

    async function saveData(data = {}) {
        //await removeData(data);
        for (let key in data) {
            if (key == "map_list") {
                let json;
                if (data[key] instanceof Set) {
                    json = JSON.stringify([...data[key]]);
                } else {
                    json = JSON.stringify(data[key]);
                }
                LS.setItem(key, json);
                continue;
            }

            LS.setItem(key, data[key]);
        }
        return true;
    }
})();

