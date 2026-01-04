// ==UserScript==
// @name         EMP Dark
// @namespace    EMP Theme
// @version      0.7.11
// @description  Stylesheet for EMP
// @author       Conkuist
// @match        https://www.empornium.sx/*
// @match        https://www.empornium.is/*
// @icon         https://www.empornium.sx/favicon.ico
// @resource     IMPORTED_CSS https://fonts.googleapis.com/css2?family=Lexend&family=Noto+Sans&family=Roboto&family=Source+Sans+Pro&family=Ubuntu&family=PT+Sans&family=Material+Icons&display=swap
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/464428/EMP%20Dark.user.js
// @updateURL https://update.greasyfork.org/scripts/464428/EMP%20Dark.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(GM_getResourceText("IMPORTED_CSS"));

    const removeEmpStyleSheet = () => {

        const stylesheetNames = ['afterdark', 'deviloid', 'empornium', 'hempornium', 'light', 'minimal', 'modern', 'modern_red', 'rochelle', 'sarandafl', 'watch_dogs'];

        for (let name of stylesheetNames)
        {
            const styleEl = document.querySelector(`link[href*=${name}`);

            if (styleEl)
            {
                styleEl.remove();
                console.log(`Removed ${styleEl.href}`);
                break;
            }
        }
    };

    var presets = [

        {
            title: "original",
            background: "#2f3136",
            header: "#36393f",
            table: "#202225",
            table_header: "#36393f",
            box: "#36393f",
            block: "#42454a",
            block_text: "#ffffff",
            button: "#42454a",
            button_text: "#ffffff",
            input: "#202225",
            input_text: "#8e9297",
            torrent_icon: "#36393f",
            box_text: "#8e9297",
            header_text: "#8e9297",
            background_text: "#8e9297",
            table_text: "#8e9297",
            link: "#dddddd",
            hover: "#ffffff",
            visited: "#00ccff",
            highlight: "#00ccff",
            alerts: "#ee3333",
            shadow: "none",
        },
        {
            title: "dark matter",
            background: "#323232",
            header: "#3c3c3c",
            table: "#282828",
            table_header: "#3c3c3c",
            box: "#3c3c3c",
            block: "#464646",
            block_text: "#ffffff",
            button: "#464646",
            button_text: "#ffffff",
            input: "#282828",
            input_text: "#969696",
            torrent_icon: "#3c3c3c",
            box_text: "#969696",
            header_text: "#969696",
            background_text: "#969696",
            table_text: "#969696",
            link: "#dddddd",
            hover: "#ffffff",
            visited: "#00ccff",
            highlight: "#00ccff",
            alerts: "#ee3333",
            shadow: "none",
        },
        {
            title: "favorite",
            background: "#3a4045",
            header: "#444b51",
            table: "#313539",
            table_header: "#444b51",
            box: "#444b51",
            block: "#4e555c",
            block_text: "#ffffff",
            button: "#4e555c",
            button_text: "#ffffff",
            input: "#313539",
            input_text: "#8c959d",
            torrent_icon: "#444b51",
            box_text: "#8c959d",
            header_text: "#8c959d",
            background_text: "#8c959d",
            table_text: "#8c959d",
            link: "#dddddd",
            hover: "#ffffff",
            visited: "#00ccff",
            highlight: "#00ccff",
            alerts: "#ee3333",
            shadow: "none",
        },
        {
            title: "dark theme",
            "background": "#141414",
            "background_text": "#aaaaaa",
            "header": "#1e1e1e",
            "header_text": "#aaaaaa",
            "block": "#282828",
            "block_text": "#ffffff",
            "box": "#1e1e1e",
            "box_text": "#aaaaaa",
            "table_header": "#232323",
            "table": "#1e1e1e",
            "table_text": "#aaaaaa",
            "button": "#282828",
            "button_text": "#aaaaaa",
            "input": "#141414",
            "input_text": "#aaaaaa",
            "torrent_icon": "#3c3c3c",
            "link": "#ffffff",
            "hover": "#ffffff",
            "visited": "#03dac6",
            "highlight": "#03dac6",
            "alerts": "#ee3333",
            shadow: "none",
        },
        {
            "background": "#202124",
            "background_text": "#aaaaaa",
            "header": "#303134",
            "header_text": "#aaaaaa",
            "block": "#303134",
            "block_text": "#aaaaaa",
            "box": "#303134",
            "box_text": "#aaaaaa",
            "table_header": "#5f6368",
            "table": "#303134",
            "table_text": "#aaaaaa",
            "button": "#5f6368",
            "button_text": "#ffffff",
            "input": "#202124",
            "input_text": "#aaaaaa",
            "torrent_icon": "#5f6368",
            "link": "#ffffff",
            "hover": "#ffffff",
            "visited": "#03dac6",
            "highlight": "#03dac6",
            "alerts": "#ee3333",
            "shadow": "0 0 0.5rem #00000040"
        }

    ];

    var user_presets;

    var color_names = [

        "background",
        "background_text",
        "header",
        "header_text",
        "block",
        "block_text",
        "box",
        "box_text",
        "table_header",
        "table",
        "table_text",
        "torrent_icon",
        "button",
        "button_text",
        "input",
        "input_text",
        "link",
        "hover",
        "visited",
        "highlight",
        "alerts",

    ];

    var colors;

    var font;

    var gridview;

    var scale;
    var step = 10;

    var limitwidth;

    const root = document.querySelector(":root");

    /*

    const emp_dark_default =
    {
        colors: presets[0],
        presets: [],
        font: "sans-serif",
        gridview: true,
        scale: 100,
    }

    GM_getValue("emp_dark", emp_dark_default);
    GM_setValue("emp_dark", JSON.stringify(emp_dark_default));

    */

    LoadStorage();
    SetRoot();
    SetScale();

    const logo_color = encodeURIComponent(colors.header_text);

    GM_addStyle(`

    #logo
    {
        background: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg"  width="200" height="38" viewBox="0 0 200 38" fill="${logo_color}" ><path d="M27.9,19.6H13.8l2,7.7c0.4,1.6,0.8,2.7,1.2,3.1c0.4,0.5,0.9,0.7,1.5,0.7c0.8,0,1.3-0.3,1.4-0.9	c0.1-0.6-0.1-1.8-0.5-3.6l-1.2-4.7h10.3l0.7,2.6c0.6,2.2,0.9,3.9,0.9,5.1c0,1.2-0.3,2.4-1,3.8c-0.7,1.3-1.7,2.4-3.1,3s-3.3,1-5.7,1	c-2.3,0-4.4-0.3-6.3-1c-1.9-0.7-3.5-1.6-4.8-2.7c-1.3-1.2-2.3-2.4-3-3.8c-0.7-1.4-1.5-3.4-2.1-6.1L1.3,13.5c-0.8-3.1-1-5.6-0.7-7.4	C1,4.3,2.1,2.9,3.7,1.9C5.4,1,7.5,0.5,10,0.5c3.1,0,5.7,0.6,8,1.7s4.1,2.7,5.4,4.6c1.3,1.9,2.4,4.6,3.3,8.1L27.9,19.6z M15.5,13.8	l-0.7-2.6c-0.5-1.8-0.9-3-1.2-3.6c-0.3-0.5-0.8-0.8-1.4-0.8c-0.8,0-1.2,0.2-1.2,0.7c-0.1,0.5,0.2,1.7,0.7,3.7l0.7,2.6L15.5,13.8z"/><path d="M35.7,8.4l0.5,2.4c0.4-1,0.9-1.7,1.6-2.2c0.7-0.5,1.6-0.7,2.7-0.7c2.1,0,4,1,5.7,2.9c0.4-1,1-1.7,1.6-2.2	c0.7-0.5,1.5-0.7,2.5-0.7c1.3,0,2.5,0.3,3.5,1c1,0.6,1.8,1.4,2.3,2.4c0.5,0.9,1,2.4,1.5,4.5l4.7,18.1h-7.5l-4.3-16.6	c-0.6-2.2-1-3.5-1.3-4c-0.3-0.5-0.7-0.8-1.2-0.8c-0.6,0-0.8,0.3-0.9,0.8c0,0.5,0.2,1.9,0.8,4.1l4.3,16.6h-7.5l-4.2-16.2	c-0.7-2.5-1.1-4-1.4-4.5c-0.3-0.5-0.7-0.7-1.2-0.7c-0.3,0-0.6,0.1-0.8,0.4c-0.2,0.3-0.2,0.6-0.2,1c0.1,0.4,0.3,1.2,0.6,2.4l4.6,17.7	h-7.5L28,8.4L35.7,8.4z"/><path d="M66.3,8.4l0.5,2.2c0.5-0.9,1-1.6,1.8-2c0.7-0.4,1.6-0.7,2.6-0.7c1.2,0,2.3,0.3,3.4,1c1,0.6,1.8,1.4,2.2,2.2	c0.4,0.8,0.9,2.3,1.4,4.3l2.8,10.7c0.6,2.3,0.9,4,0.9,5c0,1-0.4,1.8-1.1,2.3c-0.7,0.6-1.7,0.9-2.9,0.9c-1,0-1.9-0.2-2.8-0.7	c-0.9-0.4-1.9-1.1-2.8-2l1.5,5.8H66L58.4,8.4L66.3,8.4z"/><path d="M98.8,17.3l1.6,6.2c0.6,2.3,0.9,4,1,5c0,1.1-0.2,2.1-0.7,3c-0.5,0.9-1.3,1.6-2.4,2.1c-1.1,0.4-2.4,0.7-3.9,0.7	c-1.7,0-3.2-0.2-4.5-0.6c-1.3-0.4-2.4-0.9-3.2-1.7c-0.9-0.8-1.6-1.7-2.1-2.8c-0.6-1.1-1.1-2.7-1.7-4.9l-1.7-6.5	c-0.6-2.4-0.8-4.2-0.7-5.6c0.2-1.3,0.8-2.4,1.9-3.2c1.1-0.8,2.7-1.2,4.8-1.2c1.7,0,3.3,0.3,4.7,0.8c1.4,0.5,2.5,1.2,3.4,2	c0.9,0.8,1.6,1.7,2.1,2.6C97.8,14.2,98.3,15.5,98.8,17.3L98.8,17.3z"/><path d="M106.8,8.4l0.6,3.3c0.5-2.4,1.8-3.7,3.9-3.8l2.3,9c-1.4,0-2.4,0.2-3,0.6c-0.6,0.4-0.8,0.9-0.8,1.6	c0,0.7,0.4,2.3,1,4.7l2.6,10.1h-7.8L99,8.4L106.8,8.4z"/><path d="M121,8.4l0.5,2.3c0.3-0.9,0.8-1.6,1.5-2.1c0.7-0.5,1.6-0.7,2.6-0.7c1.3,0,2.5,0.3,3.5,0.9	c1,0.6,1.8,1.4,2.3,2.4c0.5,1,1,2.5,1.6,4.8l4.7,17.9h-7.8l-4.6-17.7c-0.5-1.8-0.8-2.8-1-3.2c-0.2-0.4-0.6-0.6-1.1-0.6	c-0.6,0-0.8,0.2-0.9,0.7c0,0.4,0.2,1.6,0.7,3.5l4.5,17.2h-7.8l-6.6-25.5L121,8.4z"/><path d="M140.3,2.7l1.1,4.1h-8l-1.1-4.1H140.3z M141.8,8.4l6.6,25.5h-8l-6.6-25.5H141.8z"/><path d="M162.3,8.4l6.6,25.5h-7.9l-0.4-2.1c-0.3,0.9-0.8,1.5-1.5,1.9c-0.7,0.4-1.5,0.6-2.6,0.6c-1.2,0-2.2-0.2-3.1-0.6	c-0.9-0.4-1.6-1-2.1-1.6c-0.5-0.7-1-1.4-1.2-2.1c-0.3-0.7-0.7-2.2-1.3-4.4l-4.5-17.2h7.8l4.5,17.4c0.5,2,0.9,3.2,1.1,3.5	c0.2,0.4,0.6,0.6,1.1,0.6c0.6,0,0.9-0.2,0.9-0.6c0-0.4-0.3-1.6-0.8-3.7l-4.5-17.2L162.3,8.4z"/><path d="M172.8,8.4l0.5,2.4c0.4-1,0.9-1.7,1.6-2.2c0.7-0.5,1.6-0.7,2.7-0.7c2.1,0,4,1,5.7,2.9c0.4-1,1-1.7,1.6-2.2	c0.7-0.5,1.5-0.7,2.5-0.7c1.3,0,2.5,0.3,3.5,1c1,0.6,1.8,1.4,2.3,2.4c0.5,0.9,1,2.4,1.5,4.5l4.7,18.1H192l-4.3-16.6	c-0.6-2.2-1-3.5-1.3-4c-0.3-0.5-0.7-0.8-1.2-0.8c-0.6,0-0.8,0.3-0.9,0.8c0,0.5,0.2,1.9,0.8,4.1l4.3,16.6h-7.5l-4.2-16.2	c-0.7-2.5-1.1-4-1.4-4.5c-0.3-0.5-0.7-0.7-1.2-0.7c-0.3,0-0.6,0.1-0.8,0.4c-0.2,0.3-0.2,0.6-0.2,1c0.1,0.4,0.3,1.2,0.6,2.4l4.6,17.7	h-7.5l-6.6-25.5L172.8,8.4z"/></svg>') no-repeat center/contain;
    }

    `);

    function LoadStorage()
    {
        colors = JSON.parse(localStorage.getItem("colors"));
        font = JSON.parse(localStorage.getItem("font"));
        user_presets = JSON.parse(localStorage.getItem("presets"));
        gridview = JSON.parse(localStorage.getItem("gridview"));
        scale = JSON.parse(localStorage.getItem("scale"));

        if (colors == null)
        {
            LoadPreset(presets[0]);
            localStorage.setItem("colors",JSON.stringify(colors));
        }
        if(font == null)
        {
            font = "sans-serif";
            localStorage.setItem("font",JSON.stringify(font));
        }

        if (user_presets == null)
        {
            user_presets = [];
            localStorage.setItem("presets",JSON.stringify(user_presets));
        }
        else
        {
            presets = presets.concat(user_presets);
        }

        if(gridview == null)
        {
            gridview = true;
            localStorage.setItem("gridview",JSON.stringify(gridview));
        }

        if(scale == null)
        {
            scale = 100;
            localStorage.setItem("scale",JSON.stringify(scale));
        }

        limitwidth = GM_getValue("limitwidth", false);

        GM_setValue("limitwidth", limitwidth);
    }

    function LoadPreset(preset)
    {
        colors = {};

        for(let color_name of color_names)
        {
            colors[color_name] = preset[color_name];
        }

        if(typeof preset.shadow == "string")
        {
            colors.shadow = preset.shadow;
        }
        else
        {
            colors.shadow = "none";
        }

    }

    function SetRoot() {
        root.style.setProperty("--medium", colors.background);
        root.style.setProperty("--text2", colors.background_text);
        root.style.setProperty("--header", colors.header);
        root.style.setProperty("--header_text", colors.header_text);
        root.style.setProperty("--dark", colors.table);
        root.style.setProperty("--colhead", colors.table_header);
        root.style.setProperty("--bright", colors.box);
        root.style.setProperty("--text", colors.box_text);
        root.style.setProperty("--brighter", colors.block);
        root.style.setProperty("--block_text", colors.block_text);
        root.style.setProperty("--button", colors.button);
        root.style.setProperty("--button_text", colors.button_text);
        root.style.setProperty("--input", colors.input);
        root.style.setProperty("--input-text", colors.input_text);
        root.style.setProperty("--label", colors.torrent_icon);
        root.style.setProperty("--text3", colors.table_text);
        root.style.setProperty("--link", colors.link);
        root.style.setProperty("--hover", colors.hover);
        root.style.setProperty("--visited", colors.visited);
        root.style.setProperty("--blue", colors.highlight);
        root.style.setProperty("--red", colors.alerts);
        root.style.setProperty("--shadow", colors.shadow);
    }


    var scale_label

    function SetScale()
    {
        root.style.setProperty("font-size", `${scale / step}px`);
        if(scale_label)
        {
            scale_label.innerHTML = `${scale}%`
        }
    }

    /*--------------------------------------------------GRID--------------------------------------------------*/

    window.addEventListener('DOMContentLoaded', load);

    function load()
    {
        removeEmpStyleSheet();

        var body = document.body;

        var rows = document.querySelectorAll("table.torrent_table tr:not(.colhead), table#request_table tr:not(.colhead), #collage table tr:is(.rowa, .rowb, .colhead)");

        /* Creates Torrent Grid */
        var torrents_content = document.querySelector("#torrents #content .thin");

        if(torrents_content)
        {
            var torrents_table = torrents_content.querySelector(":scope > .torrent_table");

            if(torrents_table)
            {
                var torrents_grid = document.createElement("div");
                torrents_grid.classList.add("torrents_grid");
                torrents_content.insertBefore(torrents_grid,torrents_table);
            }
        }

        function CreateGridCell(img,link,title,icons,data,newtorrent,label)
        {
            if(!torrents_content || !torrents_grid)
            {
                console.log("laoding grid failed")
                return;
            }

            const torrents_grid_cell = document.createElement("div");
            torrents_grid_cell.classList.add("torrents_grid_cell");
            torrents_grid.appendChild(torrents_grid_cell);

            const torrents_grid_cell_link = document.createElement("a");
            torrents_grid_cell_link.classList.add("torrents_grid_cell_link");
            torrents_grid_cell_link.style.background = `no-repeat center/cover url("${img}")`;
            torrents_grid_cell.appendChild(torrents_grid_cell_link);

            if(link)
            {
                torrents_grid_cell_link.href = link;
            }

            if(label)
            {
                torrents_grid_cell.appendChild(label.cloneNode(true));
            }

            const torrents_grid_cell_description = document.createElement("div");
            torrents_grid_cell_description.classList.add("torrents_grid_cell_description");
            torrents_grid_cell.appendChild(torrents_grid_cell_description);

            const torrents_grid_cell_title = document.createElement("a");
            torrents_grid_cell_title.classList.add("torrents_grid_cell_title");
            torrents_grid_cell_title.innerHTML = title;
            torrents_grid_cell_title.title = title;
            torrents_grid_cell_description.appendChild(torrents_grid_cell_title);

            if(link)
            {
                torrents_grid_cell_title.href = link;
            }

            if(newtorrent)
            {
                var torrents_grid_cell_newtorrent = document.createElement("div");
                torrents_grid_cell_newtorrent.classList.add("torrents_grid_cell_newtorrent");
                torrents_grid_cell_description.appendChild(torrents_grid_cell_newtorrent)
            }

            if(data && typeof data.grabbed == "string")
            {
                var torrents_grid_cell_grabbed = document.createElement("div");
                torrents_grid_cell_grabbed.classList.add("torrents_grid_cell_grabbed");
                torrents_grid_cell_grabbed.innerHTML = data.grabbed;
                torrents_grid_cell_description.appendChild(torrents_grid_cell_grabbed);
            }

            if(data && typeof data.seeders == "string")
            {
                var torrents_grid_cell_seeders = document.createElement("div");
                torrents_grid_cell_seeders.classList.add("torrents_grid_cell_seeders");
                torrents_grid_cell_seeders.innerHTML = data.seeders;
                torrents_grid_cell_description.appendChild(torrents_grid_cell_seeders);
            }

            if(data && typeof data.leechers == "string")
            {
                var torrents_grid_cell_leechers = document.createElement("div");
                torrents_grid_cell_leechers.classList.add("torrents_grid_cell_leechers");
                torrents_grid_cell_leechers.innerHTML = data.leechers;
                torrents_grid_cell_description.appendChild(torrents_grid_cell_leechers);
            }

            if(data && typeof data.files == "string")
            {
                var torrents_grid_cell_files = document.createElement("div");
                torrents_grid_cell_files.classList.add("torrents_grid_cell_files");
                torrents_grid_cell_files.innerHTML = data.files;
                torrents_grid_cell_description.appendChild(torrents_grid_cell_files);
            }

            if(data && typeof data.comments == "string")
            {
                var torrents_grid_cell_comments = document.createElement("div");
                torrents_grid_cell_comments.classList.add("torrents_grid_cell_comments");
                torrents_grid_cell_comments.innerHTML = data.comments;
                torrents_grid_cell_description.appendChild(torrents_grid_cell_comments);
            }

            if(data && typeof data.size == "string")
            {
                var torrents_grid_cell_size = document.createElement("div");
                torrents_grid_cell_size.classList.add("torrents_grid_cell_size");
                torrents_grid_cell_size.innerHTML = data.size;
                torrents_grid_cell_description.appendChild(torrents_grid_cell_size);
            }

            if(data && typeof data.uploader == "string")
            {
                var torrents_grid_cell_uploader = document.createElement("div");
                torrents_grid_cell_uploader.classList.add("torrents_grid_cell_uploader");
                torrents_grid_cell_uploader.innerHTML = data.uploader;
                torrents_grid_cell_description.appendChild(torrents_grid_cell_uploader);
            }

            if(icons)
            {
                torrents_grid_cell_description.appendChild(icons.cloneNode(true));
            }

            if(data && typeof data.time == "string")
            {
                var torrents_grid_cell_time = document.createElement("div");
                torrents_grid_cell_time.classList.add("torrents_grid_cell_time");
                torrents_grid_cell_time.innerHTML = data.time;
                torrents_grid_cell_description.appendChild(torrents_grid_cell_time);
            }
        }

        for(var row of rows)
        {
            const torrent_data = new Object();

            for(let i = 0; i < row.children.length; i++)
            {
                if(i == 2)
                {
                    torrent_data.files = row.children[i].innerHTML;
                }
                if(i == 3)
                {
                    torrent_data.comments = row.children[i].innerHTML;
                }
                if(i == 4)
                {
                    torrent_data.time = row.children[i].innerHTML;
                }
                if(i == 5)
                {
                    torrent_data.size = row.children[i].innerHTML;
                }
                if(i == 6)
                {
                    torrent_data.grabbed = row.children[i].innerHTML;
                }
                if(i == 7)
                {
                    torrent_data.seeders = row.children[i].innerHTML;
                }
                if(i == 8)
                {
                    torrent_data.leechers = row.children[i].innerHTML;
                }
                if(i == 9)
                {
                    torrent_data.uploader = row.children[i].innerHTML;
                }
            }

            var cell;
            if(body.id == "top10" || body.id == "notifications")
            {
                cell = row.querySelector("td:nth-child(2)");
            }
            else if(body.id == "torrents")
            {
                cell = row.querySelector("td.cats_col");
            }
            else
            {
                cell = row.querySelector("td:first-child");
            }

            var torrent_url = row.querySelector("table.torrent_table tr:not(.colhead) td:nth-child(2) > a");

            var script = row.querySelector("td script");
            var url;

            var category;
            var href;

            if(cell)
            {
                var cat;

                if(body.id == "collage" || body.id == "bookmarks")
                {
                    cat = cell.querySelector("img");
                }
                else
                {
                    cat = cell.querySelector("div")
                }

                var link = cell.querySelector("a");

                if(link && link.hasAttribute("href"))
                {
                    href = link.href;
                }

                if(cat && cat.hasAttribute("title"))
                {
                    category = cat.getAttribute("title");
                }

            }

            if(category)
            {
                category = category.replace("."," ").toUpperCase();
            }

            if(script)
            {
                url = script.innerHTML.split('src=')[1].split('"')[1].split('"')[0].replace(/\\/g, "");

                if(true)
                {
                    url = url.replace('/resize/200','');
                }
            }

            var label;

            /* add category */
            var cell2;
            if(body.id == "top10" || body.id == "notifications")
            {
                cell2 = row.querySelector("td:nth-child(3)");
            }
            else
            {
                cell2 = row.querySelector("td:nth-child(2)");
            }

            if(cell)
            {
                cell.innerHTML = "";

                if(body.id == "collage")
                {
                    let found = false;
                    const h_title = document.querySelector("#content .thin h2");
                    if(h_title)
                    {
                        if(h_title.innerHTML.startsWith("Collages") || h_title.innerHTML.startsWith("Subscribed"))
                        {
                            found = true;
                        }
                    }

                    if(found)
                    {
                        cell.remove();
                    }
                }

            }

            if(cell && category)
            {
                label = document.createElement("a");
                label.innerHTML = category;

                if(href)
                {
                    label.href = href;
                }

                if((cell && url) || (cell && body.id == "requests"))
                {
                    cell.insertBefore(label,cell.firstChild);
                    label.classList.add("category_label");
                }
                else if(cell2)
                {
                    cell2.insertBefore(label,cell2.firstChild);
                    label.classList.add("category_tag");
                }
            }

            /* add cover */
            var cover;
            if(cell)
            {
                if(url)
                {
                    cover = document.createElement("a");
                    cover.classList.add("cover");
                    cover.style = 'background: no-repeat center/cover url("' + url + '")';

                    if(torrent_url && torrent_url.hasAttribute("href"))
                    {
                        cover.href = torrent_url.getAttribute("href");
                    }

                    cell.appendChild(cover);

                    /* adds grid cell to torrent grid */
                    CreateGridCell(url,(torrent_url && torrent_url.hasAttribute("href")) ? torrent_url.getAttribute("href") : null,torrent_url ? torrent_url.innerHTML : "",row.querySelector(".torrent_icon_container"), torrent_data, row.querySelector("td > span.newtorrent") ? true : false,label);
                }
            }

            /*  move new icon in notifications dom */
            if(body.id == "notifications")
            {
                var cell3 = row.querySelector("td:nth-child(3)");

                if(cell3)
                {
                    var tag = cell3.querySelector("strong");
                    var title = cell3.querySelector(":scope > a");

                    if(tag && title)
                    {
                        cell3.insertBefore(tag,title);
                    }
                }
            }

            /* move icon container in collage and bookmarks dom */
            if(body.id == "collage" || body.id == "bookmarks")
            {
                var cell4 = row.querySelector("td:nth-child(3)");
                if(cell4)
                {
                    var icon_container = cell4.querySelector("span.torrent_icon_container");
                }
                if(cell2)
                {
                    var title2 = cell2.querySelector(":scope > strong");
                }

                if(icon_container && title2)
                {
                    cell2.insertBefore(icon_container,title2);
                }
            }

        }

        /*----------------------------------------EMP-DARK-PANEL----------------------------------------*/

        const menu = document.querySelector("#major_stats");

        const panel = document.createElement("div");
        panel.classList.add("emp_dark_panel");
        document.body.appendChild(panel);

        const panel_open = document.createElement("div");
        panel_open.innerHTML = "EMP Dark";
        panel_open.classList.add("panel_open");
        menu.insertBefore(panel_open,menu.firstChild);
        panel_open.addEventListener("click", function() {

            if(dialog.style.display == "none")
            {
                panel.style.display = "block";
            }
        })

        const navbar = document.createElement("div");
        navbar.classList.add("navbar");
        navbar.innerHTML = "EMP Dark"
        panel.appendChild(navbar);

        const close = document.createElement("div");
        close.classList.add("close_panel");
        close.innerHTML = "X";
        navbar.appendChild(close);
        close.addEventListener("click", function() {

            panel.style.display = "none";

            if(localStorage.getItem("colors") == JSON.stringify(colors) && localStorage.getItem("font") == JSON.stringify(font) && localStorage.getItem("gridview") == JSON.stringify(gridview) && localStorage.getItem("scale") == JSON.stringify(scale) && GM_getValue("limitwidth") == limitwidth)
            {
                Reset();
            }
            else
            {
                dialog.style.display = "block";
            }

        })

        const color_panel_title = document.createElement("div");
        color_panel_title.classList.add("panel_title");
        color_panel_title.innerHTML = "Colors";
        panel.appendChild(color_panel_title);

        const colorpanel = document.createElement("div");
        colorpanel.classList.add("colorpanel");
        panel.appendChild(colorpanel);

        const color_inputs = {};

        for(let color_name of color_names)
        {
            color_inputs[color_name] = Color(color_name, colors[color_name]);
        }

        SetColorInputs();

        /*------------------------------PRESET-BUTTONS------------------------------*/

        const preset_panel_title = document.createElement("div");
        preset_panel_title.classList.add("panel_title");
        preset_panel_title.innerHTML = "Presets";
        panel.appendChild(preset_panel_title);

        const preset_panel = document.createElement("div");
        preset_panel.classList.add("preset_panel");
        panel.appendChild(preset_panel);

        const add_preset_button = document.createElement("div");
        add_preset_button.classList.add("preset","add_preset");
        add_preset_button.innerHTML = "+";
        preset_panel.appendChild(add_preset_button);
        add_preset_button.addEventListener("click",function()
                                           {
            let new_preset = JSON.parse(JSON.stringify(colors));
            user_presets.push(new_preset);
            localStorage.setItem("presets",JSON.stringify(user_presets));
            PresetButton(new_preset,"custom",preset_panel.children.length - 1);
        }
                                          );

        for(let i = 0; i < presets.length; i++)
        {
            PresetButton(presets[i],presets[i].title,i)
        }

        function PresetButton(preset,title,text)
        {
            let preset_button = document.createElement("div");
            preset_button.classList.add("preset");
            if(text == 0)
            {
                preset_button.classList.add("default");
                preset_button.innerHTML = "Default";
            }
            else
            {
                preset_button.innerHTML = text;
            }

            if(typeof title == "string")
            {
                preset_button.title = title;
            }

            preset_panel.appendChild(preset_button);

            preset_button.addEventListener("click",function() {
                LoadPreset(preset);
                SetColorInputs();
            });

            if(user_presets.includes(preset))
            {
                preset_button.classList.add("custom_preset");
                preset_button.addEventListener("dblclick", function()
                                               {
                    for(let i = 0; i < user_presets.length; i++)
                    {
                        if(user_presets[i] === preset)
                        {
                            user_presets.splice(i, 1);
                            preset_button.remove();
                            localStorage.setItem("presets",JSON.stringify(user_presets));
                            this.remove();
                        }
                    }
                }
                );
            }

        }

        /*------------------------------FONT-BUTTONS------------------------------*/

        const fonts_panel_title = document.createElement("div");
        fonts_panel_title.classList.add("panel_title");
        fonts_panel_title.innerHTML = "Fonts";
        panel.appendChild(fonts_panel_title);

        const font_panel = document.createElement("div");
        font_panel.classList.add("preset_panel");
        panel.appendChild(font_panel);

        const font_names = ["sans-serif","Source Sans Pro","Lexend","Noto Sans","Ubuntu","Roboto","PT Sans"];

        for(let i = 0; i < font_names.length; i++)
        {
            const font_button = document.createElement("div");
            font_button.classList.add("preset");
            if(i == 0)
            {
                font_button.classList.add("default");
                font_button.innerHTML = "Default";
            }
            else
            {
                font_button.innerHTML = i;
            }

            font_button.title = font_names[i];
            font_button.font = font_names[i];
            font_panel.appendChild(font_button);
            font_button.addEventListener("click", function() {

                SetFont(this.font);
                this.classList.add("button_active")
            })
        }

        SetFont(this.font);

        /*------------------------------GRID-VIEW-OPTIONS------------------------------*/

        const gridview_panel_title = document.createElement("div");
        gridview_panel_title.classList.add("panel_title");
        gridview_panel_title.innerHTML = "Grid View";
        panel.appendChild(gridview_panel_title);

        const gridview_panel = document.createElement("div");
        gridview_panel.classList.add("preset_panel");
        panel.appendChild(gridview_panel);

        var gridview_option = document.createElement("div");
        gridview_option.classList.add("colortab");
        gridview_panel.appendChild(gridview_option);

        var gridview_checkbox = document.createElement("div");
        gridview_checkbox.classList.add("colorbox");
        gridview_checkbox.id = "gridview_checkbox";
        gridview_option.appendChild(gridview_checkbox);
        SetGridView();
        gridview_checkbox.addEventListener("click",function()
                                           {
            if(gridview)
            {
                gridview = false;
                SetGridView();
            }
            else
            {
                gridview = true;
                SetGridView();
            }
        })

        var option_label = document.createElement("div");
        option_label.classList.add("color_label");
        option_label.innerHTML = "show grid"
        gridview_option.appendChild(option_label);

        /*------------------------------SCALING-OPTIONS------------------------------*/

        const scaling_panel_title = document.createElement("div");
        scaling_panel_title.classList.add("panel_title");
        scaling_panel_title.innerHTML = "Scaling";
        panel.appendChild(scaling_panel_title);

        const scaling_panel = document.createElement("div");
        scaling_panel.classList.add("preset_panel");
        panel.appendChild(scaling_panel);

        var scaling_option = document.createElement("div");
        scaling_option.classList.add("colortab");
        scaling_panel.appendChild(scaling_option);

        const decrease_scale_preset_button = document.createElement("div");
        decrease_scale_preset_button.classList.add("preset");
        decrease_scale_preset_button.innerHTML = "-";
        scaling_option.appendChild(decrease_scale_preset_button);
        decrease_scale_preset_button.addEventListener("click",function()
        {
            if(scale - step >= 20)
            {
                scale -= step;
            }
            root.style.setProperty("font-size", `${scale / step}px`);
            scale_label.innerHTML = `${scale}%`;
        });

        const increase_scale_preset_button = document.createElement("div");
        increase_scale_preset_button.classList.add("preset");
        increase_scale_preset_button.innerHTML = "+";
        scaling_option.appendChild(increase_scale_preset_button);
        increase_scale_preset_button.addEventListener("click",function()
        {
            if(scale + step <= 400)
            {
                scale += step;
            }
            root.style.setProperty("font-size", `${scale / step}px`);
            scale_label.innerHTML = `${scale}%`;
        });

        scale_label = document.createElement("div");
        scale_label.classList.add("color_label");
        scale_label.innerHTML = `${scale}%`
        scaling_option.appendChild(scale_label);

        var limit_width_option = document.createElement("div");
        limit_width_option.classList.add("colortab");
        scaling_panel.appendChild(limit_width_option);

        var limit_width_checkbox = document.createElement("div");
        limit_width_checkbox.classList.add("colorbox");
        limit_width_checkbox.id = "limitwidth_checkbox";
        limit_width_option.appendChild(limit_width_checkbox);
        SetLimitWidth();
        limit_width_checkbox.addEventListener("click",function(){

            if(limitwidth)
            {
                limitwidth = false;
                SetLimitWidth();
            }
            else
            {
                limitwidth = true;
                SetLimitWidth();
            }
        });

        var limit_width_label = document.createElement("div");
        limit_width_label.classList.add("color_label");
        limit_width_label.innerHTML = "limit width"
        limit_width_option.appendChild(limit_width_label);

        /*------------------------------CANCEL-SAVE-BUTTONS------------------------------*/

        const buttons = document.createElement("div");
        buttons.classList.add("buttons");
        panel.appendChild(buttons);

        const reset = document.createElement("input");
        reset.type = "button";
        reset.value = "Cancel";
        buttons.appendChild(reset);
        reset.addEventListener("click", Reset)

        const apply = document.createElement("input");
        apply.type = "button";
        apply.value = "Save";
        buttons.appendChild(apply);
        apply.addEventListener("click", Update)

        /*--------------------DIALOG--------------------*/

        const dialog = document.createElement("div");
        dialog.classList.add("emp_dark_panel");
        dialog.style.display = "none";
        document.body.appendChild(dialog);

        const dialog_title = document.createElement("div");
        dialog_title.classList.add("navbar");
        dialog_title.innerHTML = "EMP Dark"
        dialog.appendChild(dialog_title);

        const dialog_text = document.createElement("div");
        dialog_text.classList.add("panel_title");
        dialog_text.innerHTML = "Save Changes?";
        dialog.appendChild(dialog_text);

        const dialog_buttons = document.createElement("div");
        dialog_buttons.classList.add("buttons");
        dialog.appendChild(dialog_buttons);

        const dialog_yes = document.createElement("input");
        dialog_yes.type = "button";
        dialog_yes.value = "Yes";
        dialog_buttons.appendChild(dialog_yes);
        dialog_yes.addEventListener("click", function() {
            dialog.style.display = "none";
            Update();
        })

        const dialog_no = document.createElement("input");
        dialog_no.type = "button";
        dialog_no.value = "No";
        dialog_buttons.appendChild(dialog_no);
        dialog_no.addEventListener("click", function() {
            dialog.style.display = "none";
            Reset();
        })

        function GetInputValue()
        {
            for(let color_name of color_names)
            {
                colors[color_name] = color_inputs[color_name].value;
            }
        }

        function Update() {
            GetInputValue();
            localStorage.removeItem("colors");
            localStorage.setItem("colors", JSON.stringify(colors));
            localStorage.setItem("font", JSON.stringify(font));
            localStorage.setItem("gridview", JSON.stringify(gridview));
            localStorage.setItem("scale", JSON.stringify(scale));
            GM_setValue("limitwidth", limitwidth);
            SetRoot();
            SetFont();
            SetGridView()
            SetScale();
            SetLimitWidth();
            console.log(colors);
        }

        function SetGridView()
        {
            const tg = document.querySelector(".torrents_grid");
            const cb = document.querySelector("#gridview_checkbox");
            if(tg)
            {
                if(gridview)
                {
                    tg.style.display = "grid";
                }
                else
                {
                    tg.style.display = "none";
                }
            }
            if(cb)
            {
                if(gridview)
                {
                    cb.classList.add("checked");
                }
                else
                {
                    cb.classList.remove("checked");
                }
            }
        }

        function SetLimitWidth()
        {
            const lwcb = document.querySelector("#limitwidth_checkbox");
            if(lwcb)
            {
                if(limitwidth)
                {
                    lwcb.classList.add("checked");
                    body.style.setProperty("max-width", "140rem");
                }
                else
                {
                    lwcb.classList.remove("checked");
                    body.style.setProperty("max-width", "none");
                }
            }
        }

        function SetFont(font_name)
        {
            if(typeof font_name == "string")
            {

                if(font_name == "sans-serif")
                {
                    font = font_name;
                }
                else
                {
                    font = `${font_name},sans-serif`;
                }
            }



            let presets = document.querySelectorAll(".emp_dark_panel .preset_panel .preset");

            for(let preset of presets)
            {
                if(preset.font == font.split(",")[0])
                {
                    let button_active = document.querySelector(".emp_dark_panel .preset_panel .preset.button_active")
                    if(button_active)
                    {
                        button_active.classList.remove("button_active");
                    }
                    preset.classList.add("button_active");
                    break;
                }
            }

            body.style.setProperty("font-family",font);

        }

        function SetLogo()
        {
            const logo_color = encodeURIComponent(colors.header_text);

            const logo = document.querySelector("#logo")

            if(logo)
            {
                logo.style.setProperty("background",`url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg"  width="200" height="38" viewBox="0 0 200 38" fill="${logo_color}" ><path d="M27.9,19.6H13.8l2,7.7c0.4,1.6,0.8,2.7,1.2,3.1c0.4,0.5,0.9,0.7,1.5,0.7c0.8,0,1.3-0.3,1.4-0.9	c0.1-0.6-0.1-1.8-0.5-3.6l-1.2-4.7h10.3l0.7,2.6c0.6,2.2,0.9,3.9,0.9,5.1c0,1.2-0.3,2.4-1,3.8c-0.7,1.3-1.7,2.4-3.1,3s-3.3,1-5.7,1	c-2.3,0-4.4-0.3-6.3-1c-1.9-0.7-3.5-1.6-4.8-2.7c-1.3-1.2-2.3-2.4-3-3.8c-0.7-1.4-1.5-3.4-2.1-6.1L1.3,13.5c-0.8-3.1-1-5.6-0.7-7.4	C1,4.3,2.1,2.9,3.7,1.9C5.4,1,7.5,0.5,10,0.5c3.1,0,5.7,0.6,8,1.7s4.1,2.7,5.4,4.6c1.3,1.9,2.4,4.6,3.3,8.1L27.9,19.6z M15.5,13.8	l-0.7-2.6c-0.5-1.8-0.9-3-1.2-3.6c-0.3-0.5-0.8-0.8-1.4-0.8c-0.8,0-1.2,0.2-1.2,0.7c-0.1,0.5,0.2,1.7,0.7,3.7l0.7,2.6L15.5,13.8z"/><path d="M35.7,8.4l0.5,2.4c0.4-1,0.9-1.7,1.6-2.2c0.7-0.5,1.6-0.7,2.7-0.7c2.1,0,4,1,5.7,2.9c0.4-1,1-1.7,1.6-2.2	c0.7-0.5,1.5-0.7,2.5-0.7c1.3,0,2.5,0.3,3.5,1c1,0.6,1.8,1.4,2.3,2.4c0.5,0.9,1,2.4,1.5,4.5l4.7,18.1h-7.5l-4.3-16.6	c-0.6-2.2-1-3.5-1.3-4c-0.3-0.5-0.7-0.8-1.2-0.8c-0.6,0-0.8,0.3-0.9,0.8c0,0.5,0.2,1.9,0.8,4.1l4.3,16.6h-7.5l-4.2-16.2	c-0.7-2.5-1.1-4-1.4-4.5c-0.3-0.5-0.7-0.7-1.2-0.7c-0.3,0-0.6,0.1-0.8,0.4c-0.2,0.3-0.2,0.6-0.2,1c0.1,0.4,0.3,1.2,0.6,2.4l4.6,17.7	h-7.5L28,8.4L35.7,8.4z"/><path d="M66.3,8.4l0.5,2.2c0.5-0.9,1-1.6,1.8-2c0.7-0.4,1.6-0.7,2.6-0.7c1.2,0,2.3,0.3,3.4,1c1,0.6,1.8,1.4,2.2,2.2	c0.4,0.8,0.9,2.3,1.4,4.3l2.8,10.7c0.6,2.3,0.9,4,0.9,5c0,1-0.4,1.8-1.1,2.3c-0.7,0.6-1.7,0.9-2.9,0.9c-1,0-1.9-0.2-2.8-0.7	c-0.9-0.4-1.9-1.1-2.8-2l1.5,5.8H66L58.4,8.4L66.3,8.4z"/><path d="M98.8,17.3l1.6,6.2c0.6,2.3,0.9,4,1,5c0,1.1-0.2,2.1-0.7,3c-0.5,0.9-1.3,1.6-2.4,2.1c-1.1,0.4-2.4,0.7-3.9,0.7	c-1.7,0-3.2-0.2-4.5-0.6c-1.3-0.4-2.4-0.9-3.2-1.7c-0.9-0.8-1.6-1.7-2.1-2.8c-0.6-1.1-1.1-2.7-1.7-4.9l-1.7-6.5	c-0.6-2.4-0.8-4.2-0.7-5.6c0.2-1.3,0.8-2.4,1.9-3.2c1.1-0.8,2.7-1.2,4.8-1.2c1.7,0,3.3,0.3,4.7,0.8c1.4,0.5,2.5,1.2,3.4,2	c0.9,0.8,1.6,1.7,2.1,2.6C97.8,14.2,98.3,15.5,98.8,17.3L98.8,17.3z"/><path d="M106.8,8.4l0.6,3.3c0.5-2.4,1.8-3.7,3.9-3.8l2.3,9c-1.4,0-2.4,0.2-3,0.6c-0.6,0.4-0.8,0.9-0.8,1.6	c0,0.7,0.4,2.3,1,4.7l2.6,10.1h-7.8L99,8.4L106.8,8.4z"/><path d="M121,8.4l0.5,2.3c0.3-0.9,0.8-1.6,1.5-2.1c0.7-0.5,1.6-0.7,2.6-0.7c1.3,0,2.5,0.3,3.5,0.9	c1,0.6,1.8,1.4,2.3,2.4c0.5,1,1,2.5,1.6,4.8l4.7,17.9h-7.8l-4.6-17.7c-0.5-1.8-0.8-2.8-1-3.2c-0.2-0.4-0.6-0.6-1.1-0.6	c-0.6,0-0.8,0.2-0.9,0.7c0,0.4,0.2,1.6,0.7,3.5l4.5,17.2h-7.8l-6.6-25.5L121,8.4z"/><path d="M140.3,2.7l1.1,4.1h-8l-1.1-4.1H140.3z M141.8,8.4l6.6,25.5h-8l-6.6-25.5H141.8z"/><path d="M162.3,8.4l6.6,25.5h-7.9l-0.4-2.1c-0.3,0.9-0.8,1.5-1.5,1.9c-0.7,0.4-1.5,0.6-2.6,0.6c-1.2,0-2.2-0.2-3.1-0.6	c-0.9-0.4-1.6-1-2.1-1.6c-0.5-0.7-1-1.4-1.2-2.1c-0.3-0.7-0.7-2.2-1.3-4.4l-4.5-17.2h7.8l4.5,17.4c0.5,2,0.9,3.2,1.1,3.5	c0.2,0.4,0.6,0.6,1.1,0.6c0.6,0,0.9-0.2,0.9-0.6c0-0.4-0.3-1.6-0.8-3.7l-4.5-17.2L162.3,8.4z"/><path d="M172.8,8.4l0.5,2.4c0.4-1,0.9-1.7,1.6-2.2c0.7-0.5,1.6-0.7,2.7-0.7c2.1,0,4,1,5.7,2.9c0.4-1,1-1.7,1.6-2.2	c0.7-0.5,1.5-0.7,2.5-0.7c1.3,0,2.5,0.3,3.5,1c1,0.6,1.8,1.4,2.3,2.4c0.5,0.9,1,2.4,1.5,4.5l4.7,18.1H192l-4.3-16.6	c-0.6-2.2-1-3.5-1.3-4c-0.3-0.5-0.7-0.8-1.2-0.8c-0.6,0-0.8,0.3-0.9,0.8c0,0.5,0.2,1.9,0.8,4.1l4.3,16.6h-7.5l-4.2-16.2	c-0.7-2.5-1.1-4-1.4-4.5c-0.3-0.5-0.7-0.7-1.2-0.7c-0.3,0-0.6,0.1-0.8,0.4c-0.2,0.3-0.2,0.6-0.2,1c0.1,0.4,0.3,1.2,0.6,2.4l4.6,17.7	h-7.5l-6.6-25.5L172.8,8.4z"/></svg>') no-repeat center/contain`);
            }
        }

        function Reset() {
            colors = JSON.parse(localStorage.getItem("colors"));
            font = JSON.parse(localStorage.getItem("font"));
            gridview = JSON.parse(localStorage.getItem("gridview"));
            scale = JSON.parse(localStorage.getItem("scale"));
            limitwidth = GM_getValue("limitwidth", false);
            SetColorInputs();
            SetRoot();
            SetFont();
            SetGridView();
            SetScale();
            SetLimitWidth();
        }

        function SetColorInputs() {

            SetRoot();

            for(let color_name of color_names)
            {
                color_inputs[color_name].value = colors[color_name];
            }

            var e = document.createEvent('HTMLEvents');
            e.initEvent('input', false, false);

            for(let color_name of color_names)
            {
                color_inputs[color_name].dispatchEvent(e);
            }

        }

        function Color(name, color) {

            var colortab = document.createElement("div");
            colortab.classList.add("colortab");
            colorpanel.appendChild(colortab);

            var colorbox = document.createElement("div");
            colorbox.classList.add("colorbox");
            colortab.appendChild(colorbox);

            var input = document.createElement("input");
            input.type = "color";
            input.value = color;
            colorbox.appendChild(input);

            input.addEventListener("input",function(){this.parentElement.style.background = this.value; GetInputValue(); SetRoot(); SetLogo()})
            colorbox.style.background = input.value;

            var color_label = document.createElement("div");
            color_label.classList.add("color_label");
            color_label.innerHTML = name.replace('_',' ');
            colortab.appendChild(color_label);

            return input;
        }

    }

    const grid_view = `
.torrents_grid
{
    background: var(--bright);
    padding: 0.3rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    display: grid;
    gap: 0.3rem;
    /*grid-template-columns: repeat(auto-fit, minmax(30rem, 1fr));*/
    grid-template-columns: repeat(5,1fr);
    box-shadow: var(--sahdow);
}
.torrents_grid_cell
{
    aspect-ratio: 1;
    /* background: var(--medium); */
    border-radius: 0.2rem;
    overflow: hidden;
    position: relative;
    z-index: 1;

    display:flex;
    flex-direction:column;
    flex:1;
}
.torrents_grid_cell_link
{
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: -1;
}
.torrents_grid_cell_description
{
    background: #000000bf;
    margin-top: auto;
    padding: 0.5rem;
}
.torrents_grid_cell_title
{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: bold;
    display: block;
}

/*
.torrents_grid_cell_description .icon_stack .font_icon.torrent_icons.icon_torrent_bonus,
.torrents_grid_cell_description .icon_stack .font_icon.torrent_icons.icon_torrent_bonus.bonus,
.torrents_grid_cell_description .icon_stack .font_icon.torrent_icons.bookmark,
.torrents_grid_cell_description .icon_stack .font_icon.torrent_icons.download,
.torrents_grid_cell_description .icon_stack .font_icon.torrent_icons.icon_torrent_okay,
.torrents_grid_cell_description .icon_stack .font_icon.icon_torrent_ducky,
.torrents_grid_cell_description .icon_stack .font_icon.torrent_icons.icon_torrent_disk.grabbed,
.torrents_grid_cell_description .icon_stack .font_icon.torrent_icons.icon_torrent_disk.snatched,
.torrents_grid_cell_description .icon_stack .font_icon.torrent_icons.seeding,
.torrents_grid_cell_description .icon_stack .font_icon.torrent_icons.leeching
{
    background: #ffffff80;
    background-clip: border-box;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke-width: 0;
}
*/

.torrents_grid_cell .category_label
{
    position: absolute;
    right: 0;
    background: #000000BF;
    width: 10rem;
}

.torrents_grid_cell .torrent_icon_container
{
    float: left;
    clear: left;
    margin-top: 0.5rem;
}

.torrents_grid_cell_size
{
    border: 1px solid;
    padding: 0 0.5rem;
    box-sizing: border-box;
}

.torrents_grid_cell_grabbed,
.torrents_grid_cell_seeders,
.torrents_grid_cell_leechers,
.torrents_grid_cell_uploader,
.torrents_grid_cell_time,
.torrents_grid_cell_size,
.torrents_grid_cell_comments,
.torrents_grid_cell_files
{
    float: left;
    display: block;
    height: 2rem;
    line-height: 2rem;
    margin-right: 0.5rem;
    margin-top: 0.5rem;
}

.torrents_grid_cell_size
{
    line-height: 1.8rem;
}

.torrents_grid_cell_grabbed::before,
.torrents_grid_cell_seeders::before,
.torrents_grid_cell_leechers::before,
.torrents_grid_cell_comments::before,
.torrents_grid_cell_files::before
{
    font-family: "icons";
    font-weight: normal;
    display: block;
    float: left;
    width: 2rem;
    height: 2rem;
    line-height: 2rem;
    font-size: 1.8rem;
    text-align: center;
}

.torrents_grid_cell_grabbed::before
{

    content: "\\f14f";
}

.torrents_grid_cell_seeders::before
{
    content: "\\f135";
}

.torrents_grid_cell_leechers::before
{
    content: "\\f129";
}

.torrents_grid_cell_comments::before
{
    content: "\\f11e";
}

.torrents_grid_cell_files::before
{
    content: "\\f106";
    font-size: 1.4rem;
}

.torrents_grid_cell_newtorrent
{
    height: 2rem;
    width: 2rem;
    display: block;
    float: left;
    margin-top: 0.5rem;
    background: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23e33"><path d="M19.48,12.35c-1.57-4.08-7.16-4.3-5.81-10.23c0.1-0.44-0.37-0.78-0.75-0.55C9.29,3.71,6.68,8,8.87,13.62 c0.18,0.46-0.36,0.89-0.75,0.59c-1.81-1.37-2-3.34-1.84-4.75c0.06-0.52-0.62-0.77-0.91-0.34C4.69,10.16,4,11.84,4,14.37 c0.38,5.6,5.11,7.32,6.81,7.54c2.43,0.31,5.06-0.14,6.95-1.87C19.84,18.11,20.6,15.03,19.48,12.35z" /></svg>');
}

.torrents_grid_cell_time,
.torrents_grid_cell_uploader
{
    float: right;
}
`;
    const panel_css = `
.emp_dark_panel {
    background: var(--medium);
    color: var(--text2);
    float: left;
    box-sizing: border-box;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    margin: auto;
    border: 0.1rem solid var(--brighter);
    border-radius: 0.5rem;
    overflow: hidden;
    display: none;
    z-index: 20;
    box-shadow: var(--shadow);
}

.emp_dark_panel .navbar {
    height: 3rem;
    width: 100%;
    background: var(--brighter);
    float: left;
    line-height: 3rem;
    padding-left: 1rem;
    box-sizing: border-box;
}

.emp_dark_panel .colorbox {
    width: 3rem;
    height: 3rem;
    padding: 0;
    float: left;
    border: 0.1rem solid var(--bright);
    border-radius: 0.3rem;
    overflow: hidden;
    user-select: none;
}

.emp_dark_panel .colorbox:hover
{
    border: 0.1rem solid var(--brighter);
}

.emp_dark_panel .checked
{
    background: var(--blue);
    text-align: center;
    line-height: 3rem;
}

.emp_dark_panel .checked::before
{
    content: "X";
}

.emp_dark_panel input[type="color"] {
    width: 3rem;
    height: 3rem;
    padding: 0;
    margin: 0;
    border: none;
    opacity: 0;
    cursor: pointer;
}

.emp_dark_panel input[type="button"] {
    height: 3rem;
    width: 15rem;
    background: var(--bright);
    border: none;
    padding: 0;
    margin: auto;
    color: var(--link);
    font-size: 1em;
    cursor: pointer;
    float: left;
    clear: left;
    border-radius: 0.3rem;
}

.emp_dark_panel input[type="button"]:hover {
    background: var(--brighter);
    color: var(--hover);
}

.emp_dark_panel input[type="button"]:active {
    background: var(--hover);
    color: var(--medium);
}

.emp_dark_panel .buttons {
    float: right;
    clear: left;
    padding: 0 1rem 1rem 1rem;
    column-count: 2;
    column-gap: 1rem;
}

.emp_dark_panel .color_label {
    height: 3rem;
    line-height: 3rem;
    float: left;
    padding: 0 1rem;
}

.emp_dark_panel .close_panel {
    width: 4.5rem;
    height: 3rem;
    line-height: 3rem;
    position: absolute;
    top: 0;
    right: 0;
    text-align: center;
    cursor: pointer;
    color: var(--link);
}

.emp_dark_panel .close_panel:hover {
    background: var(--hover);
    color: var(--text);
}

.emp_dark_panel .colorpanel {
    padding: 0 1rem 0.5rem 1rem;
    float: left;
    clear: left;
    column-count: 4;
    column-gap: 1rem;
}

.emp_dark_panel .colortab
{
    float: left;
    clear: left;
    width: 15rem;
    margin-bottom: 0.5rem;
}
.emp_dark_panel .colortab:last-child
{
    margin: 0;
}

.emp_dark_panel .preset_panel
{
    padding: 0 1rem 1rem 1rem;
    float: left;
    clear: left;
}

.emp_dark_panel .preset_panel .preset
{
    width: 3rem;
    height: 3rem;
    line-height: 3rem;
    text-align: center;
    float: left;
    background: var(--bright);
    color: var(--text);
    border-radius: 0.3rem;
    cursor: pointer;
    margin-right: 0.5rem;
}

.emp_dark_panel .preset_panel .preset:nth-child(10n+13)
{
    clear: left;
    margin-left: 7rem;
}

.emp_dark_panel .preset_panel .preset:nth-child(n+13)
{
    margin-top: 0.5rem;
}

.emp_dark_panel .preset_panel .preset:hover
{
    background: var(--brighter);
    color: var(--hover);
}

.emp_dark_panel .preset_panel .preset.default
{
    width: unset;
    width: 6.5rem;
    padding: 0 1rem;
    box-sizing: border-box;
}

.emp_dark_panel .preset_panel .preset.add_preset
{
    float: right;
}

.emp_dark_panel .preset_panel .preset.custom_preset
{
    color: var(--blue);
}

.panel_open
{
    display: block;
    float: left;
    line-height: 2rem;
    padding: 0.2rem 0.3rem;
    margin-left: 0.3rem;
    cursor: pointer;
}

.panel_open:hover
{
    color: var(--hover);
}

.panel_title
{
    padding: 0 1rem;
    box-sizing: border-box;
    float:left;
    clear: left;
    width: 100%;
    line-height: 3rem;
    height: 3rem;
}

.emp_dark_panel  .preset_panel .preset.button_active
{
    color: var(--blue);
}
`;
    const css = `
/*--------------------------------------------------EMP-DARK--------------------------------------------------*/
:root
{
    --brighter: #42454a;
    --bright: #36393f;
    --medium: #2f3136;
    --dark: #202225;
    --header: #36393f;
    --colhead: #36393f;
    --input: #202225;
    --input-text: #ddd;
    --link: #ddd;
    --hover: #fff;
    --visited: #00ccff;
    --text: #8e9297;
    --text2: #8e9297;
    --text3: #8e9297;
    --blue: #00ccff;
    --yellow: #fced0a;
    --red: #e33;
    --green: #18d860;
    --orange: #ff7f26;
    --grey: #72767d;
    --blue_icon: #00ccff;
    --label: #36393f;

    --shadow: 0 0 0.5rem #171717;

    scrollbar-color: #36393f #2f3136;
    scrollbar-color: var(--bright) var(--medium);
    scrollbar-color: var(--brighter) var(--medium);

    font-size: 10px;

    --liked: #7dcea0;
    --liked-border: #1e8449;
    --performer: #85c1e9;
    --performer-border: #2874a6;
    --new-performer: #f1c40f;
    --new-performer-border: #b7950b;
    --amateur: #76d7c4;
    --amateur-border: #148f77;
    --male-performer: #f0b27a;
    --male-performer-border: #af601a;
    --liked-site: #bb8fce;
    --liked-site-border: #6c3483;
    --disliked: #f1948a;
    --disliked-border: #b03a2e;
    --hated: #e74c3c;
    --loved: #27ae60;
    --loved-performer: #3498db;
    --loved-amateur: #1abc9c;
    --loved-male-performer: #e67e22;
    --loved-site: #8e44ad;
    --black-listed: #2c3e50;
    --black-listed-border: #212f3d;
    --useless: #7f8c8d;
    --useless-border: #616a6b;
    --tag-border: 0 solid;

}

::selection
{
    background: var(--blue);
    color: #fff;
}

body {
    background: var(--dark);
    color: var(--text);
    font: unset;
    font-family: ${font};
    font-size: 1.2rem;
    margin: auto;
    max-width: ${limitwidth ? "140rem" : "none"};
}

#header
{
    font-size: 1.5rem;
}

input,
select,
textarea
{
    font-size: 1.2rem;
}

button
{
    font-size: 1.2rem;
    padding: 0.2rem 0.3rem;
    border-radius: 0.3rem;
}

input[type="submit"],
input[type="button"],
button:not(.searchbutton,[id^="edit"],[id^="quote"])
{
    box-shadow: var(--shadow) !important;
}

select
{
    height: 2rem;
}

select,
select.bb_button,
.button.toggle {
    background: var(--input);
    color: var(--input-text);
    border: none;
}

input[type="submit"],
input[type="button"]
{
    margin: 0.3rem 0.3rem 0 0;
    height: 2rem;
    font-size: 1.2rem;
}

.button.toggle
{
    background: var(--bright);
}

hr
{
    border: none;
    background: var(--medium);
    margin: 1rem 0;
    height:0.2rem;
}

h2 {
    background: var(--bright);
    color: var(--text);
    border-radius: 0;
    padding: 0.5rem 0.5rem;
}
h2 a
{
    color: var(--text);
}

h2 a:hover
{
    color: var(--hover);
}

.curtain {
    background: var(--dark);
}

.thin > h2:first-child {
    border-radius: 0;
}

a {
    color: var(--link);
    font-weight: normal;
}

a:visited {
    color: var(--visited);
}

a:hover,
a:visited:hover {
    color: var(--hover);
    text-decoration: none;
}

.tags a,
.tags a:visited {
    color: var(--text3);
}

.tags a:hover,
.tags a:visited:hover {
    color: var(--link);
    text-decoration: none;
}

table.border {
    border: none;
    /*border-color: var(--bright);*/
}

img[alt="RSS feed"] {
    display: none;
}


#logo {
    /*
    background: none;
    background: url("data:image/svg+xml;base64,PHN2ZyB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6Y2M9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL25zIyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB2ZXJzaW9uPSIxLjEiIHdpZHRoPSIyMDAiIGhlaWdodD0iMzgiIHZpZXdCb3g9IjAgMCAyMDAgMzgiIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWluIG1lZXQiIGNsYXNzPSJsb2dvLXN2ZyI+PGcgZmlsbD0iIzcyNzY3ZCI+PGcgdHJhbnNmb3JtPSJtYXRyaXgoMC45ODUxNzYxOCwwLDAuMjU2NDA1ODUsMC45ODQ0MjUwNiwtMTYxLjc4MzQyLC0zNTguMDA0MzcpIj48cGF0aCBkPSJtOTIuNzAzLDM4My42MS0xNC4zMDEsMCwwLDcuODQ3NmMtMC4wMDAwMTMsMS42NDA2LDAuMTE4NDgsMi42OTc5LDAuMzU1NDcsMy4xNzE5LDAuMjM2OTYsMC40NzM5NiwwLjY5MjY5LDAuNzEwOTQsMS4zNjcyLDAuNzEwOTQsMC44Mzg1MywwLDEuMzk5MS0wLjMxNDQ1LDEuNjgxNi0wLjk0MzM2LDAuMjgyNTQtMC42Mjg5LDAuNDIzODEtMS44NDU3LDAuNDIzODMtMy42NTA0di00Ljc4NTJoMTAuNDczdjIuNjc5N2MtMC4wMDAwMjcsMi4yNDIyLTAuMTQxMywzLjk2NDgtMC40MjM4Myw1LjE2OC0wLjI4MjU4LDEuMjAzMS0wLjk0MzM4LDIuNDg4My0xLjk4MjQsMy44NTU1LTEuMDM5MSwxLjM2NzItMi4zNTYxLDIuMzkyNi0zLjk1MTIsMy4wNzYyLTEuNTk1MSwwLjY4MzU5LTMuNTk1NywxLjAyNTQtNi4wMDIsMS4wMjU0LTIuMzMzMywwLTQuMzkzMi0wLjMzNzI0LTYuMTc5Ny0xLjAxMTctMS43ODY1LTAuNjc0NDgtMy4xNzY0LTEuNTk5Ni00LjE2OTktMi43NzU0LTAuOTkzNDktMS4xNzU4LTEuNjgxNi0yLjQ3LTIuMDY0NS0zLjg4MjgtMC4zODI4Mi0xLjQxMjgtMC41NzQyMi0zLjQ2ODEtMC41NzQyMi02LjE2NnYtMTAuNTgyYy0wLjAwMDAwMi0zLjE3MTgsMC40MjgzOC01LjY3MzgsMS4yODUyLTcuNTA1OSwwLjg1Njc3LTEuODMyLDIuMjYwNC0zLjIzNTYsNC4yMTA5LTQuMjEwOSwxLjk1MDUtMC45NzUyMiw0LjE5MjctMS40NjI4LDYuNzI2Ni0xLjQ2MjksMy4wOTg5LDAuMDAwMDQsNS42NTU2LDAuNTg3OTMsNy42Njk5LDEuNzYzN3MzLjQyNzEsMi43MzQ0LDQuMjM4Myw0LjY3NThjMC44MTExNywxLjk0MTQsMS4yMTY4LDQuNjcxMiwxLjIxNjgsOC4xODk1em0tMTEuMDc0LTUuOTA2MiwwLTIuNjUyNGMtMC4wMDAwMTYtMS44Nzc2LTAuMTAwMjgtMy4wODk4LTAuMzAwNzgtMy42MzY3LTAuMjAwNTQtMC41NDY4NC0wLjYxMDY5LTAuODIwMjgtMS4yMzA1LTAuODIwMzEtMC43NjU2NCwwLjAwMDAzLTEuMjM5NiwwLjIzMjQ1LTEuNDIxOSwwLjY5NzI3LTAuMTgyMywwLjQ2NDg3LTAuMjczNDUsMS43MTgxLTAuMjczNDQsMy43NTk4djIuNjUyNHoiLz48cGF0aCBkPSJtMTAzLjU3LDM3Mi4xNi0wLjEzNjcyLDIuNDYwOWMwLjYxMTk3LTAuOTc2NTQsMS4zNDExLTEuNzA5LDIuMTg3NS0yLjE5NzMsMC44NDYzNC0wLjQ4ODI1LDEuODA5OS0wLjczMjQsMi44OTA2LTAuNzMyNDIsMi4xMDk0LDAuMDAwMDIsMy43Njk1LDAuOTc2NTksNC45ODA1LDIuOTI5NywwLjY2NDA0LTAuOTc2NTQsMS40MTI3LTEuNzA5LDIuMjQ2MS0yLjE5NzMsMC44MzMzMi0wLjQ4ODI1LDEuNzU3OC0wLjczMjQsMi43NzM0LTAuNzMyNDIsMS4zNDExLDAuMDAwMDIsMi40NTEyLDAuMzI1NTUsMy4zMzAxLDAuOTc2NTYsMC44Nzg4OCwwLjY1MTA3LDEuNDQyLDEuNDQ4NiwxLjY4OTQsMi4zOTI2LDAuMjQ3MzcsMC45NDQwMywwLjM3MTA3LDIuNDc3MiwwLjM3MTEsNC41OTk2djE4LjQxOGgtNy42NTYydi0xNi44OTVjLTAuMDAwMDMtMi4yMTM1LTAuMDc0OS0zLjU4NC0wLjIyNDYxLTQuMTExMy0wLjE0OTc2LTAuNTI3MzItMC40OTgwNy0wLjc5MS0xLjA0NDktMC43OTEwMi0wLjU1OTkyLDAuMDAwMDItMC45MjEyNSwwLjI2MDQ0LTEuMDg0LDAuNzgxMjUtMC4xNjI3OCwwLjUyMDg2LTAuMjQ0MTYsMS44OTQ2LTAuMjQ0MTQsNC4xMjExdjE2Ljg5NWgtNy42NTYydi0xNi40NjVjLTAuMDAwMDEtMi41MzktMC4wNjE5LTQuMDYyNS0wLjE4NTU1LTQuNTcwMy0wLjEyMzcxLTAuNTA3NzktMC40NjU1LTAuNzYxNy0xLjAyNTQtMC43NjE3Mi0wLjM1MTU3LDAuMDAwMDItMC42NTEwNSwwLjEzMzQ5LTAuODk4NDMsMC40MDAzOS0wLjI0NzQxLDAuMjY2OTUtMC4zODQxMywwLjU5MjQ3LTAuNDEwMTYsMC45NzY1Ny0wLjAyNiwwLjM4NDEzLTAuMDM5MSwxLjIwMTItMC4wMzkxLDIuNDUxMnYxNy45NjloLTcuNjU2M3YtMjUuOTE4eiIvPjxwYXRoIGQ9Im0xMzQuNjYsMzcyLjE2LTAuMTM2NzIsMi4yODUyYzAuNzAzMTEtMC45MjQ0NSwxLjQ3NzgtMS42MTQ2LDIuMzI0Mi0yLjA3MDMsMC44NDYzNC0wLjQ1NTcsMS43NzA4LTAuNjgzNTcsMi43NzM0LTAuNjgzNTksMS4yMjQsMC4wMDAwMiwyLjI4MTksMC4zMjg4LDMuMTczOCwwLjk4NjMzLDAuODkxOTEsMC42NTc1NywxLjQ0ODYsMS40MTYsMS42Njk5LDIuMjc1NCwwLjIyMTM0LDAuODU5MzksMC4zMzIwMSwyLjMxNzcsMC4zMzIwMyw0LjM3NXYxMC45MThjLTAuMDAwMDIsMi4zNTY4LTAuMTM5OTksNC4wMzMyLTAuNDE5OTIsNS4wMjkzLTAuMjc5OTYsMC45OTYxLTAuODUyODgsMS43OTA0LTEuNzE4OCwyLjM4MjgtMC44NjU5LDAuNTkyNDQtMS45MTA4LDAuODg4NjctMy4xMzQ4LDAuODg4NjctMC45NzY1OCwwLTEuODgxNS0wLjIyNzg3LTIuNzE0OC0wLjY4MzYtMC44MzMzNC0wLjQ1NTczLTEuNTk1MS0xLjEzMjgtMi4yODUyLTIuMDMxMnY1LjkzNzVoLTcuODkwNnYtMjkuNjA5eiIvPjxwYXRoIGQ9Im0xNjUuMjcsMzgxLjI2LDAsNi4zNDc3Yy0wLjAwMDAxLDIuMzMwNy0wLjExNzIsNC4wMzk3LTAuMzUxNTYsNS4xMjctMC4yMzQzOSwxLjA4NzItMC43MzU2OSwyLjEwMjktMS41MDM5LDMuMDQ2OS0wLjc2ODI1LDAuOTQ0MDEtMS43NTQ2LDEuNjQwNi0yLjk1OSwyLjA4OTgtMS4yMDQ0LDAuNDQ5MjItMi41ODc5LDAuNjczODMtNC4xNTA0LDAuNjczODMtMS43NDQ4LDAtMy4yMjI3LTAuMTkyMDYtNC40MzM2LTAuNTc2MTctMS4yMTEtMC4zODQxMi0yLjE1MTctMC45NjM1NS0yLjgyMjMtMS43MzgzLTAuNjcwNTctMC43NzQ3My0xLjE0OTEtMS43MTIyLTEuNDM1Ni0yLjgxMjUtMC4yODY0Ni0xLjEwMDItMC40Mjk2OC0yLjc1MDYtMC40Mjk2OC00Ljk1MTJ2LTYuNjQwNmMwLTIuNDA4OCwwLjI2MDQxLTQuMjkwNCwwLjc4MTI1LTUuNjQ0NSwwLjUyMDgzLTEuMzU0MiwxLjQ1ODMtMi40NDE0LDIuODEyNS0zLjI2MTcsMS4zNTQyLTAuODIwMjksMy4wODU5LTEuMjMwNCw1LjE5NTMtMS4yMzA1LDEuNzcwOCwwLjAwMDAyLDMuMjkxLDAuMjYzNyw0LjU2MDYsMC43OTEwMSwxLjI2OTUsMC41MjczNywyLjI0OTMsMS4yMTQyLDIuOTM5NCwyLjA2MDYsMC42OTAwOSwwLjg0NjM4LDEuMTYyMSwxLjcxODgsMS40MTYsMi42MTcyLDAuMjUzODksMC44OTg0NiwwLjM4MDg1LDIuMjY1NiwwLjM4MDg2LDQuMTAxNnoiLz48cGF0aCBkPSJtMTc1Ljc4LDM3Mi4xNi0wLjMxMjUsMy4zOTg0YzEuMTQ1OC0yLjQzNDksMi44MDYtMy43MjM5LDQuOTgwNS0zLjg2NzJ2OS4xMjExYy0xLjQ0NTMsMC4wMDAwMi0yLjUwNjUsMC4xOTUzMy0zLjE4MzYsMC41ODU5NC0wLjY3NzA5LDAuMzkwNjQtMS4wOTM4LDAuOTM0MjYtMS4yNSwxLjYzMDktMC4xNTYyNiwwLjY5NjYzLTAuMjM0MzgsMi4zMDE0LTAuMjM0MzcsNC44MTQ0djEwLjIzNGgtNy44OTA2di0yNS45MTh6Ii8+PHBhdGggZD0ibTE5MC4yMSwzNzIuMTYtMC4xMzY3MiwyLjM4MjhjMC41NzI5MS0wLjk1MDUsMS4yNzI4LTEuNjYzNCwyLjA5OTYtMi4xMzg3LDAuODI2ODEtMC40NzUyNCwxLjc4MDYtMC43MTI4NywyLjg2MTMtMC43MTI4OSwxLjM1NDIsMC4wMDAwMiwyLjQ2MDksMC4zMTkwMywzLjMyMDMsMC45NTcwMywwLjg1OTM2LDAuNjM4MDUsMS40MTI3LDEuNDQyMSwxLjY2MDIsMi40MTIxLDAuMjQ3MzcsMC45NzAwNywwLjM3MTA3LDIuNTg3OSwwLjM3MTA5LDQuODUzNXYxOC4xNjRoLTcuODkwNnYtMTcuOTQ5Yy0wLjAwMDAxLTEuNzgzOC0wLjA1ODYtMi44NzExLTAuMTc1NzgtMy4yNjE3LTAuMTE3Mi0wLjM5MDYtMC40NDI3Mi0wLjU4NTkyLTAuOTc2NTctMC41ODU5NC0wLjU1OTksMC4wMDAwMi0wLjkxMTQ2LDAuMjI0NjMtMS4wNTQ3LDAuNjczODMtMC4xNDMyNCwwLjQ0OTI0LTAuMjE0ODYsMS42NTA0LTAuMjE0ODUsMy42MDM1djE3LjUyaC03Ljg5MDZ2LTI1LjkxOHoiLz48cGF0aCBkPSJtMjExLjI1LDM2Ni40NiwwLDQuMTIxMS04LjEyNSwwLDAtNC4xMjExem0wLDUuNzAzMSwwLDI1LjkxOC04LjEyNSwwLDAtMjUuOTE4eiIvPjxwYXRoIGQ9Im0yMzIuMTIsMzcyLjE2LDAsMjUuOTE4LTguMDI3MywwLDAuMTM2NzItMi4xNDg0Yy0wLjU0Njg5LDAuODcyNC0xLjIyMDcsMS41MjY3LTIuMDIxNSwxLjk2MjktMC44MDA3OSwwLjQzNjItMS43MjIsMC42NTQzLTIuNzYzNywwLjY1NDMtMS4xODQ5LDAtMi4xNjgtMC4yMDgzNC0yLjk0OTItMC42MjUtMC43ODEyNS0wLjQxNjY3LTEuMzU3NC0wLjk3MDA1LTEuNzI4NS0xLjY2MDItMC4zNzExLTAuNjkwMS0wLjYwMjIyLTEuNDA5NS0wLjY5MzM2LTIuMTU4Mi0wLjA5MTEtMC43NDg3LTAuMTM2NzItMi4yMzYzLTAuMTM2NzItNC40NjI5di0xNy40OGg3Ljg5MDZ2MTcuNjM3YzAsMi4wMTgyLDAuMDYxOCwzLjIxNjIsMC4xODU1NSwzLjU5MzgsMC4xMjM2OSwwLjM3NzYxLDAuNDU4OTgsMC41NjY0MSwxLjAwNTksMC41NjY0LDAuNTg1OTMsMC4wMDAwMSwwLjkzNDIzLTAuMTk1MywxLjA0NDktMC41ODU5MywwLjExMDY3LTAuMzkwNjIsMC4xNjYwMS0xLjY0NzEsMC4xNjYwMi0zLjc2OTV2LTE3LjQ0MXoiLz48cGF0aCBkPSJtMjQyLjc5LDM3Mi4xNi0wLjEzNjcyLDIuNDYwOWMwLjYxMTk3LTAuOTc2NTQsMS4zNDExLTEuNzA5LDIuMTg3NS0yLjE5NzMsMC44NDYzNC0wLjQ4ODI1LDEuODA5OS0wLjczMjQsMi44OTA2LTAuNzMyNDIsMi4xMDk0LDAuMDAwMDIsMy43Njk1LDAuOTc2NTksNC45ODA1LDIuOTI5NywwLjY2NDA0LTAuOTc2NTQsMS40MTI3LTEuNzA5LDIuMjQ2MS0yLjE5NzMsMC44MzMzMi0wLjQ4ODI1LDEuNzU3OC0wLjczMjQsMi43NzM0LTAuNzMyNDIsMS4zNDExLDAuMDAwMDIsMi40NTEyLDAuMzI1NTUsMy4zMzAxLDAuOTc2NTYsMC44Nzg4OCwwLjY1MTA3LDEuNDQyLDEuNDQ4NiwxLjY4OTQsMi4zOTI2LDAuMjQ3MzcsMC45NDQwMywwLjM3MTA3LDIuNDc3MiwwLjM3MTEsNC41OTk2djE4LjQxOGgtNy42NTYydi0xNi44OTVjLTAuMDAwMDMtMi4yMTM1LTAuMDc0OS0zLjU4NC0wLjIyNDYxLTQuMTExMy0wLjE0OTc2LTAuNTI3MzItMC40OTgwNy0wLjc5MS0xLjA0NDktMC43OTEwMi0wLjU1OTkyLDAuMDAwMDItMC45MjEyNSwwLjI2MDQ0LTEuMDg0LDAuNzgxMjUtMC4xNjI3OCwwLjUyMDg2LTAuMjQ0MTYsMS44OTQ2LTAuMjQ0MTQsNC4xMjExdjE2Ljg5NWgtNy42NTYydi0xNi40NjVjLTAuMDAwMDEtMi41MzktMC4wNjE5LTQuMDYyNS0wLjE4NTU1LTQuNTcwMy0wLjEyMzcxLTAuNTA3NzktMC40NjU1LTAuNzYxNy0xLjAyNTQtMC43NjE3Mi0wLjM1MTU3LDAuMDAwMDItMC42NTEwNSwwLjEzMzQ5LTAuODk4NDMsMC40MDAzOS0wLjI0NzQxLDAuMjY2OTUtMC4zODQxMywwLjU5MjQ3LTAuNDEwMTYsMC45NzY1Ny0wLjAyNiwwLjM4NDEzLTAuMDM5MSwxLjIwMTItMC4wMzkxLDIuNDUxMnYxNy45NjloLTcuNjU2MnYtMjUuOTE4eiIvPjwvZz48L2c+PC9zdmc+") no-repeat center center;
    background-size: 175px;
    */
    filter: none;
}


#header_top,
#header_bottom {
    border: none;
    height: unset;
    padding-bottom: 0;
}

.freeleech_bar
{
    background: var(--blue);
    border-radius: 0.5rem !important;
    font-weight: bold;
    margin: 0 !important;
    padding: 0 0.5rem !important;
    line-height: 1.9rem;
    animation: none !important;
}

#searchbars .searchcontainer {
    background: var(--input);
    border: none;
    padding: 0.2rem;
    box-sizing: border-box;
    position:relative;
}

#searchbars .searchcontainer .font_icon.icon_nav_search
{
    width:2rem;
    height:2rem;
    line-height:2rem;
    text-align: center;
    display: block;
    box-sizing: border-box;


}
#searchbars .searchcontainer .icon_container
{
    position: relative;
    width: 2rem;
}

#searchbars input.searchbox
{
    position: relative;
    float: left;
    padding-left: 0.5rem;
    box-sizing: border-box;
    width: calc(100% - 2rem);
}

#searchbars .searchcontainer button.searchbutton .icon_stack
{
    width:2rem;
    color: var(--input-text);
}

#content {
    background: var(--medium);
    border: none;
    border-radius: 1rem;
    box-shadow: none;
    margin: 4rem auto 0 auto;
}

body #header,
body #content
{
    width: unset;
    max-width: calc(100% - 8rem);
    margin-left: auto;
    margin-right: auto;
}

.head a
{
    color: var(--link);
}

.head a:hover
{
    color: var(--hover);
}


.head,
.sidebar .head,
.colhead_dark
{
    background: none;
    border: none;
    color: var(--text2);
    font-size: 1.4rem;
    text-shadow: var(--shadow);
}
/*
.colhead_dark
{
    background: none;
    padding-left: 0.5rem;
    box-sizing: border-box;
    color: var(--text);
}
*/

table.bb_holder,
table.bb_holder td.colhead
{
    background: none;
}

/*#header,*/
#header_bottom,
thin > h2,
.box
{
    box-shadow: var(--shadow) !important;
}

.box {
    background: var(--dark);
    border-radius: 0.5rem;
    overflow: hidden;
}

.box .box
{
    border: none;
    background: var(--medium);
}

.box h3
{
    color: var(--text);
}

.box h2,
    /*.box h3,*/
.box h4 {
    background: var(--medium);
    color: var(--text);
    padding: 0.5rem 0.5rem;
    border-radius: 0.5rem;
}

table.cat_list
{
    border-spacing: 0;
    padding: 0.5rem;
    border-radius: 0.5rem;
    background: var(--input);
    margin: 0;
    box-shadow: var(--shadow) inset;
}

table.cat_list tr.rowa,
table.cat_list tr.rowb
{
    background: none;
}

table.cat_list a,
table.cat_list a:visited
{
    color: var(--input-text);
}

table.cat_list a:hover
{
    color: var(--hover);
}

.cat_list tr td
{
    background: none;
}

tr,
.label {
    background: var(--bright);
    background: none;
}

.on_cat_change
{
    background: var(--dark);
}

#taglist,
#taglist tr {
    background: var(--dark);
}

#taglist a:visited {
    color: #fff;
}
#taglist a:visited:hover {
    color: var(--link);
}

.searchcontainer,
input:not(.searchbox),
textarea
{
    background: var(--input);
    color: var(--input-text);
    border: none;
    box-shadow: var(--shadow) inset;
}

.box
{
    font-size: 1.2rem;
}

#search_form textarea
{
    border-radius: 0.3rem;
    resize: none;
    box-sizing: border-box;
    height: 6.4rem;
}

#search_form input[type="text"],
#search_form input[type="inputtext"],
#search_form select
{
    height: 2rem;
    box-sizing: border-box;
    line-height: 2rem;
    border-radius: 0.3rem;
    font-size: 1.2rem;
}

#filter_slidetoggle {
    background: none;
    box-shadow: none;
    border: none;
    border-radius: 0;
}

#filter_slidetoggle a
{
    color: var(--text2);
    text-shadow: var(--shadow);
}

#search_box span > a[href="#"] {
    color: var(--text);
}

#filter_slidetoggle a:hover,
#search_box span > a[href="#"]:hover {
    color: var(--link);
}

input[type="submit"],
input[type="button"],
button {
    background: var(--button);
    box-shadow: none;
    border: none;
    color: var(--button_text);
}

input[type="submit"]:hover,
input[type="button"]:hover,
button:hover {
    background: var(--button_text);
    box-shadow: none;
    border: none;
    color: var(--button);
    /*
    color: var(--hover);
    background: var(--button);
    */
}

.cat_list a {
    color: #fff;
}

.cat_list a:visited {
    color: #aaa;
}

.cat_list a:hover,
.cat_list a:visited:hover {
    color: var(--link);
}

#menu a {
    color: #fff;
}

#menu a:hover,
#major_stats a:hover,
#major_stats_left a:hover {
    background: var(--bright);
    color: #fff;
}

.colhead,
.colhead a:visited
{
    background: none;
    color: var(--link);
    line-height: 2rem;
    vertical-align: middle;
}

.colhead a:hover {
    text-decoration: none;
    color: var(--link);
}

.torrent_table > tbody > tr.head > td,
.colhead td
{
    background: var(--colhead);
}

/*replace with border spacing*/
/*
tr.unreadpm,
tr.rowa,
tr.rowb {
    border: 0.2rem solid var(--medium);
}
*/

.cat_list tr.rowa,
.cat_list tr.rowb,
.taglist tr.rowa,
.taglist tr.rowb {
    border: none;
}


tr.rowb.sticky,
tr.rowa.sticky {
    background: var(--bright);
}

tr.rowb,
.rowb {
    background: var(--dark);
}
tr.rowa,
.rowa {
    background: var(--dark);
}

tr.smallhead {
    background: var(--bright);
    line-height: 2rem;
}


table.forum_post td {
    border: none;
}

table.forum_post.box {
    border-radius: 0;
    border: 1px solid var(--bright);
    overflow: hidden;
}

table.forum_post td.sig {
    border-top: var(--bright) 1px solid;
}

tr.smallhead a:link,
tr.smallhead button
{
    color: var(--link);
}

tr.smallhead a:hover,
tr.smallhead button:hover
{
    color: var(--hover);
}

.post_footer {
    border: none;
    padding: 0 0 0 1rem;
}

td.avatar {
    background: var(--bright);
}

blockquote.bbcode,
blockquote.bbcode > blockquote.bbcode,
blockquote.bbcode > blockquote.bbcode > blockquote.bbcode {
    background: var(--brighter);
    color: var(--block_text);
    border: 1px solid var(--block_text);
}
blockquote > blockquote > span.quote_label,
blockquote span.quote_label,
span.quote_label {
    color: var(--block_text);
}

div.post_content span.quote_label
{
    color: var(--text2);
}

.box span.quote_label
{
    color: var(--text);
}

blockquote.bbcode > span.quote_label
{
    color: var(--block_text);
}
span.postlink
{
    background: none;
}

.colhead a.bb_button,
a.bb_button,
.bb_icon {
    background: var(--button);
    color: var(--button_text);
    border: none;
}

table.bb_holder  td.colhead
{
    padding: 0 !important;
}

.bb_holder .bb_buttons_left,
.bb_holder .bb_buttons_right
{
    margin: 0;
}

form #quickreplytext
{
    border-radius: 0;
}

#quickreplytext textarea
{
    width: 100%;
}

.bb_buttons_left a.bb_button
{
    border: none;
    height: 2rem;
    display: block;
    float: left;
    margin: 0 0.3rem 0 0;
    box-sizing: border-box;
    padding: 0 0.6rem;
    min-width: 2rem;
    text-align: center;
    line-height: 2rem;
}


.bb_buttons_right img.bb_icon
{
    width: 1.6rem;
    height: 1.6rem;
}

select.bb_button
{
    height: 2rem;
    display: block;
    float: left;
    margin: 0 0.3rem 0 0;
}

a.bb_button:hover,
.bb_icon:hover {
    background: var(--button_text);
    color: var(--button);
}

#quickreplytext {
    background: none;
    padding-bottom: 1rem;
    margin-bottom: 1rem;
    border-radius: 0.3rem;
    overflow: hidden;
}

#userinfo_username li ul {
    background: var(--medium);
    border: none;
}

#userinfo_username li ul a,
#userinfo_tools li ul a {
    border: none;
    border-width: 0;
}

#userinfo_username li ul li a:hover,
#userinfo_tools li ul li a:hover {
    background: var(--bright);
}

tr.torrent.rowa:hover,
tr.torrent.rowb:hover {
    background-color: unset;
}

.overflow_button {
    background: var(--bright);
    color: #fff;
    border: none;
}

.colhead a
{
    color: var(--link);
}

.overlay {
    border-radius: 0.5rem;
    overflow: hidden;
}

table.overlay
{
    box-shadow: #00000040 0 0 0.5rem;
}

.overlay,
table.overlay,
.overlay .leftOverlay,
.overlay .rightOverlay {
    background: var(--medium);
    border: none;
    color: var(--text);
}

.pager_on {
    color: var(--link);
}

#user_dropdown ul {
    background: var(--bright);
    color: #fff;
    border: none;
    box-shadow: 0 0 0.5rem 0 #00000040;
}

#user_dropdown ul li a:hover {
    background: var(--brighter);
}

#searchbars input.searchbox {
    color: #fff;
    height: 2rem;
}
#searchbars input.searchbox::placeholder {
    color: var(--input-text);
    opacity: 1;
}

.group_torrent {
    background: var(--dark);
}

.details .filetypes {
    background: var(--dark);
}

.file_icons {
    color: #fff;
}

#modal_content {
    background: var(--medium);
    border: none;
}

.top_info {
    background: var(--dark);
    border: none;
    padding: 0 0.5rem;
    border-radius: 0.5rem;
}

table.boxstat td {
    background: none;
    border-right: 1px solid var(--medium);
    border: none;
}

table.boxstat td:last-child {
    border: none;
}

table.boxstat {
    color: var(--text);
}

table.boxstat a
{
    color: var(--link);
}

table.boxstat a:visited
{
    color: var(--blue);
}

table.boxstat .font_icon
{
    color: var(--text);
    width:2rem;
    height:2rem;
    font-size: 1.8rem;
    box-sizing: border-box;
}

table.boxstat td
{
    padding: 0.3rem 0.8rem;
    line-height:2rem;
}

.linkbox a
{
    color: var(--link);
}

.linkbox a:hover {
    text-decoration: none;
    color: var(--hover);
}

.linkbox .torrent_buttons a:hover {
    color: var(--hover);
}

#stats_block a,
#stats_block a:visited {
    color: var(--header_text);
}
#stats_block a:hover,
#stats_block a:visited:hover {
    color: var(--hover);
}

div.modcomment::before {
    color: var(--red);
}

div.modcomment div.after {
    color: var(--red);
}

div.modcomment {
    background: var(--brighter);
    color: #fff;
    border: var(--red) 1px solid;
    box-shadow: none;
}

code.bbcodeblock,
code.bbcode {
    background: var(--brighter);
    color: #fff;
    border: 1px solid var(--block_text);
}

a[onclick^="BBCode.spoiler"] {
    text-shadow: none;
}

blockquote {
    border: 1px solid var(--bright);
}

.forum_list tr.rowa:hover td,
.forum_list tr.rowb:hover td {
    background: var(--dark);
}

.taglabel {
    font-family: ${font};
    font-weight: bold;
    border-radius: 0.2rem;
    background: var(--button);
    padding: 0 0.5rem;
    margin: 0.5rem 0.5rem 0 0;
    color: var(--button_text);
    line-height: 2rem;
    height: 2rem;
    display: inline-block;
}

#tag_container #taginput {
    background: var(--medium);
}

.details .tag_add {
    border: none;
}

.button_sort,
.button_sort a {
    border: none;
    background: var(--medium);
    color: #fff;
}

.button_sort:hover,
.button_sort:hover a {
    background: var(--brighter);
}

.button_sort.sort_select,
.button_sort.sort_select a {
    background: #fff;
    color: var(--medium);
}

.torrentdetails table {
    border: none;
}

.torrentdetails table tr:nth-child(2n),
.torrentdetails table tr {
    background: var(--dark);
    color: #fff;
}

.torrentdetails table tr:hover td {
    background: var(--dark);
    color: #fff;
}

.torrent_table .linkbox a
{
    color: var(--link);
}

.torrent_table .linkbox a:visited {
    color: var(--visited);
}
.torrent_table .linkbox a:hover,
.torrent_table .linkbox a:visited:hover {
    color: var(--hover);
    text-decoration: none;
}

span.user_name a,
span.user_name a:visited {
    color: var(--link);
}

.box.pad.latest_threads {
    column-count: 2;
}

.box.pad.latest_threads .time
{
    white-space: nowrap;
}

.latest_threads > span
{
    display: block;
    line-height: 2rem;
    /*height: 20;*/
}


.latest_threads > span > span,
.latest_threads > span > a,
.latest_threads > span > a > strong
{
    line-height: 2rem;
    height: 2rem;
    display: inline-block;
}

.latest_threads > span[hidden=""] {
    display: none;
}

.sticky_post {
    color: var(--yellow);
}

.r00 {
    color: var(--red);
}

.icon_stack .font_icon.forum_icons {
    width: 2rem;
    height: 2rem;
    background: transparent;
    background-clip: border-box;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke-width: 1px;
    -webkit-text-stroke-color: var(--link);
}

.icon_stack .font_icon.forum_icons.icon_forum_latest {
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke-width: 1px;
    -webkit-text-stroke-color: var(--blue);
    margin-left: 0.4em;
}

.forum_icon_container:hover .font_icon.forum_icons,
.icon_stack .font_icon.forum_icons.icon_forum_latest:hover {
    font-size: 1em;
    background: transparent;
    background-clip: border-box;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke-width: 1px;
    -webkit-text-stroke-color: #fff;
}

.icon_stack .font_icon.forum_icons.forum_hint_unread {
    background: transparent;
    background-clip: border-box;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke-width: 1px;
    -webkit-text-stroke-color: var(--blue);
}

.icon_stack .font_icon.torrent_icons
{
    font-size: 1.8rem;
}

.icon_stack .font_icon.torrent_icons.icon_torrent_bonus,
.icon_stack .font_icon.torrent_icons.icon_torrent_bonus.bonus,
.icon_stack .font_icon.torrent_icons.bookmark,
.icon_stack .font_icon.torrent_icons.download,
.icon_stack .font_icon.torrent_icons.icon_torrent_okay,
.icon_stack .font_icon.icon_torrent_ducky,
.icon_stack .font_icon.torrent_icons.icon_torrent_disk.grabbed,
.icon_stack .font_icon.torrent_icons.icon_torrent_disk.snatched,
.icon_stack .font_icon.torrent_icons.seeding,
.icon_stack .font_icon.torrent_icons.leeching
{
    background: var(--label);
    background-clip: border-box;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke-width: 0;
}


.torrent_grid .font_icon.torrent_icons.download,
.torrent_grid .font_icon.torrent_icons.icon_torrent_okay,
.torrent_grid .font_icon.icon_torrent_ducky,
.torrent_grid .font_icon.torrent_icons.icon_torrent_disk.grabbed,
.torrent_grid .font_icon.torrent_icons.icon_torrent_disk.snatched,
.torrent_grid .font_icon.torrent_icons.seeding,
.torrent_grid .font_icon.torrent_icons.leeching,
.torrent_grid .font_icon.torrent_icons.bookmark:not(.bookmarked)
{
    background: #fff;
    background-clip: border-box;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke-width: 0;
}

.icon_stack .font_icon.torrent_icons.icon_torrent_bonus.bonus {
    background: var(--yellow);
    background-clip: border-box;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke-width: 0;
}

.icon_stack .font_icon.torrent_icons.icon_torrent_bonus.bonus.personal_leech,
.icon_stack .font_icon.bookmark.bookmarked,
.icon_stack .font_icon.torrent_icons.icon_torrent_disk.snatched,
.torrent_grid .font_icon.torrent_icons.icon_torrent_disk.snatched
{
    background: var(--blue_icon);
    background-clip: border-box;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke-width: 0;
}

.icon_stack .font_icon.torrent_icons.icon_torrent_bonus.bonus.sitewide_leech
{
    background: var(--green);
    background-clip: border-box;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke-width: 0;
}

.icon_stack .font_icon.bookmark.bookmarked.action_confirm,
.icon_stack .font_icon.torrent_icons.icon_torrent_warned,
.icon_stack .font_icon.torrent_icons.download.warned {
    background: var(--red);
    background-clip: border-box;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke-width: 0;
}

.icon_stack .font_icon.torrent_icons.seeding,
.icon_stack .font_icon.torrent_icons.leeching,
.torrent_grid .font_icon.torrent_icons.seeding,
.torrent_grid .font_icon.torrent_icons.leeching
{
    background: var(--green);
    background-clip: border-box;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke-width: 0;
}

.icon_stack .font_icon.torrent_icons.personal_leech.icon_torrent_leeching,
.icon_stack .font_icon.torrent_icons.unlimited_leech.icon_torrent_leeching,
.icon_stack .font_icon.torrent_icons.sitewide_leech.icon_torrent_leeching,
.icon_stack .font_icon.torrent_icons.personal_seed.icon_torrent_seeding,
.icon_stack .font_icon.torrent_icons.unlimited_seed.icon_torrent_seeding,
.icon_stack .font_icon.torrent_icons.sitewide_seed.icon_torrent_seeding,
.icon_stack .font_icon.torrent_icons.icon_torrent_warned_inner,
.icon_stack .font_icon.torrent_icons.icon_torrent_disk_inner
{
    display: none;
}

.redbar {
    background: none;
}
.redbar td
{
    background: var(--dark);
}

.redbar a, .redbar a:hover
{
    text-decoration: none;
}

.redbar .user a
{
    color: var(--link);
}

.redbar .user a:hover
{
    color: var(--hover);
}

.redbar > td:not(.user) > a:not(.category_label),
.redbar > td:not(.user) > a:not(.category_label):hover
{
    color: var(--red);
}

.redbar .tags a
{
    color: var(--text);
}

.redbar .tags a:hover
{
    color: var(--link);
    text-decoration: none;
}

.post_footer {
    color: #fff;
}

input.shopbutton.itembuy {
    color: var(--link);
    border-radius: 0.3rem;
}

input.shopbutton.itembuy:hover {
    color: var(--bright);
}

.itemnotbuy input.shopbutton,
input.itemnotbuy {
    border: none;
    color: var(--red);
}

.itemnotbuy input.shopbutton:hover {
    background: var(--hover);
    color: var(--bright);
}

.anchor,
a.anchor:hover {
    color: #fff;
}

.shadow {
    box-shadow: none;
}

.user_name {
    background: var(--medium);
    border: none;
}

.rank[alt="4"] /*Good Perv*/
{
    color: var(--green) !important;
}

.rank[alt="1"], /*Admin*/
.rank[alt="15"], /*Sysop*/
.groupperm[alt="16"] /*First Line Support*/
{
    color: #ff33cc !important;
}

.groupperm[alt="20"], /*Tagging Team*/
.rank[alt="22"], /*Principal Moderator*/
.rank[alt="11"] /*???*/
{
    color: var(--red) !important;
}

.rank[alt="18"], /*Senior Technologist*/
.rank[alt="23"] /*Technologist*/
{
    color: var(--grey) !important;
}

.rank[alt="6"] /*Smut Peddler*/
{
    color: #ffcc00 !important;
    color: var(--yellow) !important;
}

.icon[title="This torrent has no active bonus"],
.icon[title="You cannot download a marked Torrent"] {
    display: none;
}

.icon_stack .font_icon.bookmark.action_confirm:hover::after {
    all: initial;
    white-space: nowrap;
    content: "Click again to remove!";
    font-family: roboto, sans-serif;
    padding: 0.3rem 0.5rem;
    position: absolute;
    margin-top: -0.5rem;
    color: white;
    background: var(--red);
    border: none;
    border-radius: 0.5rem;
}

.thin > table {
    box-shadow: none;
}

table.forum_post.box {
    border-spacing: 0;
    border-collapse: separate;
    box-shadow: none;
    background: transparent;
    border: none;
}
table.forum_post.box tr {
    background: none;
}

table.forum_post.box > tbody > tr.smallhead > td {
    background: var(--bright);
}

table.forum_post.box > tbody tr:first-child > td:first-child {
    border-top-left-radius: 0.5rem;
}

table.forum_post.box > tbody tr:first-child > td:last-child {
    border-top-right-radius: 0.5rem;
}

table.forum_post.box > tbody > tr > td.avatar
{
    border-bottom-left-radius: 0.5rem;
}

table.forum_post.box > tbody > tr:last-child > td:last-child {
    border-bottom-right-radius: 0.5rem;
}

table.forum_post.box > tbody > tr:last-child > td {
    border-bottom: 1px solid var(--bright);
}

table.forum_post.box > tbody > tr > td:last-child {
    border-right: 1px solid var(--bright);
}

table.forum_post.box > tbody > tr:first-child > td {
    border-top: 1px solid var(--bright);
}

table.forum_post.box > tbody > tr > td:last-child {
    border-left: 1px solid var(--bright);
}


table.forum_post.box table.bbcode:not(.noborder),
table.forum_post.box table.bbcode:not(.noborder) td
{
    border: 1px solid var(--bright);
}

table.forum_post.box tr.smallhead,
table.forum_post.box.user_name,
.user_name
{
    color: var(--text);
}

table.forum_index,
table.forum_list
{
    border-collapse: separate;
    border-spacing: 0 0.2rem;
}

table.forum_index tr.rowa,
table.forum_index tr.rowb,
table.forum_list tr.rowa,
table.forum_list tr.rowb
{
    background: none;
}
table.forum_index tr.rowa td,
table.forum_index tr.rowb td
{
    background: var(--bright);
}

table.forum_list tr.rowa td,
table.forum_list tr.rowb td
{
    background: var(--dark);
}


table.forum_list tr.rowa.sticky td,
table.forum_list tr.rowb.sticky td
{
    background: var(--bright);
}

table.forum_index tr.rowa td:first-child,
table.forum_index tr.rowb td:first-child,
table.forum_list tr.rowa td:first-child,
table.forum_list tr.rowb td:first-child,
table.forum_index tr.colhead td:first-child,
table.forum_list tr.colhead td:first-child
{
    border-radius: 0.5rem 0 0 0.5rem;
}

table.forum_index tr.rowa td:last-child,
table.forum_index tr.rowb td:last-child,
table.forum_list tr.rowa td:last-child,
table.forum_list tr.rowb td:last-child,
table.forum_index tr.colhead td:last-child,
table.forum_list tr.colhead td:last-child
{
    border-radius: 0 0.5rem 0.5rem 0;
}

table.forum_list span,
table.forum_index span
{
    line-height: 2rem;
}


table.forum_index .forum_icon_container,
table.forum_index .icon_stack,
table.forum_index .font_icon.forum_icons,
table.forum_list .forum_icon_container,
table.forum_list .icon_stack,
table.forum_list .font_icon.forum_icons
{
    height: 2rem;
    width: 2rem;
    line-height: 2rem;
    text-align: center;
    box-sizing: border-box;
    padding:0;
}

.box.pad.latest_threads {
    background: var(--bright);
}

#open_overflowquickpost,
#open_overflow_morequickpost {
    color: var(--text);
}
#open_overflowquickpost:hover,
#open_overflow_morequickpost:hover {
    color: var(--hover);
}

#search_form .box.pad {
    background: var(--bright);
}


#search_form .cat_list tr.rowa td,
#search_form .cat_list tr.rowb td,
#search_form tr.on_cat_change,
#search_form td.label,
#search_form tr {
    background: var(--bright);
    background: none;
}


#content,
#modal_content
{
    max-width: calc(100% - 8rem);
    min-width: 94rem;
}

#torrents #content .thin > form:not(#search_form)
{
    background: var(--bright);
    border-radius: 0.5rem;
    padding: 0.5rem;
}

form .box {
    background: var(--bright);
    border-radius: 0.5rem;
}

#collage #content form
{
    background: var(--bright);
    border-radius: 0.5rem;
    box-shadow: var(--shadow);
}

#collage form table,
#tags table.box.pad {
    box-shadow: none;
}

#collage tr.rowa td,
#collage tr.rowb td
{
    padding: 0.3rem 0.3rem;
}

#collage tr.rowa td:nth-child(2) a:not(.category_label),
#collage tr.rowb td:nth-child(2) a:not(.category_label)
{
    line-height: 2rem;
}

#tags table.box.pad tr.rowa,
#tags table.box.pad tr.rowb
{
    background: none;
    border: none;
}

form input[type="submit"],
#tags input[type="submit"],
form input[type="button"] {
    background: var(--button);
    border-radius: 0.3rem;
}

#tags input[type="submit"]:hover {
    background: #fff;
    color: var(--bright);
}

#index .box {
    background: var(--bright);
}

#cat_list,
#taglist {
    border-radius: 0.5rem;
    background: var(--input);
}

#taglist
{
    padding-bottom: 1.5rem;
}

#taglist a,
#taglist a:visited
{
    color: var(--input-text);
}

.newtorrent
{
    margin-right: 0.4rem;
}

#notifications tr td:nth-child(3) strong
{
    float:right;
}

#notifications tr td:nth-child(3) strong,
.newtorrent
{
    width: 2rem;
    height: 2rem;
    overflow: hidden;
    visibility: hidden;
}

#notifications tr td:nth-child(3) strong::before,
.newtorrent:before
{
    visibility: visible;
    content: "";
    background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2UzMyI+PHBhdGggZD0iTTE5LjQ4LDEyLjM1Yy0xLjU3LTQuMDgtNy4xNi00LjMtNS44MS0xMC4yM2MwLjEtMC40NC0wLjM3LTAuNzgtMC43NS0wLjU1QzkuMjksMy43MSw2LjY4LDgsOC44NywxMy42MiBjMC4xOCwwLjQ2LTAuMzYsMC44OS0wLjc1LDAuNTljLTEuODEtMS4zNy0yLTMuMzQtMS44NC00Ljc1YzAuMDYtMC41Mi0wLjYyLTAuNzctMC45MS0wLjM0QzQuNjksMTAuMTYsNCwxMS44NCw0LDE0LjM3IGMwLjM4LDUuNiw1LjExLDcuMzIsNi44MSw3LjU0YzIuNDMsMC4zMSw1LjA2LTAuMTQsNi45NS0xLjg3QzE5Ljg0LDE4LjExLDIwLjYsMTUuMDMsMTkuNDgsMTIuMzV6IiAvPjwvc3ZnPg==");
    width: 2rem;
    height: 2rem;
    display: block;
}

#notifications tr td:nth-child(3) strong
{
    margin-right: 0.4rem;
}

/*
.reported
{
    background: var(--red);
    color: #fff !important;
    border-radius: 3px;
    padding: 0 3px;
    font-style: normal;
    line-height: 20;
    margin-left: 5px;
    text-align: center !important;
    height: 20;
    display: block;
    float: right !important;
}
*/

span.reported
{
    width: 2rem;
    height: 2rem;
    overflow: hidden;
    visibility: hidden;
    display: block;
    float: left;
}

span.reported::before
{
    visibility: visible;
    content: "";
    display: block;
    width: 2rem;
    height:2rem;
    background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2UzMyI+PHBhdGggZD0iTTE0IDRINXYxN2gydi03aDUuNmwuNCAyaDdWNmgtNS42TDE0IDR6Ii8+PC9zdmc+");
}

tr.colhead a[href*="order_by=Seeders"] img,
tr.colhead a[href*="order_by=seeders"] img,
tr.colhead a[href*="order_by=leechers&"] img,
tr.colhead a[href*="order_by=Leechers&"] img,
tr.colhead a[href*="order_by=snatched&"] img,
tr.colhead a[href*="order_by=Snatched&"] img,
tr.colhead a[href*="order_by=Snatches&"] img,
tr.colhead a[href*="order_by=Snatches&"] img
{
    display: none;
}
tr.colhead a[href*="order_by=Seeders"]:before,
tr.colhead a[href*="order_by=seeders"]:before
{
    font-family:"icons";
    content: "\\f135";
    font-weight: normal;
}

tr.colhead a[href*="order_by=leechers&"]:before,
tr.colhead a[href*="order_by=Leechers&"]:before
{
    font-family:"icons";
    content: "\\f129";
    font-weight: normal;
}

tr.colhead a[href*="order_by=snatched&"]:before,
tr.colhead a[href*="order_by=Snatched&"]:before,
tr.colhead a[href*="order_by=Snatches&"]:before,
tr.colhead a[href*="order_by=Snatches&"]:before
{
    font-family: "icons";
    content: "\\f14f";
    font-weight: normal;
}

#request_table .tags
{
    clear: left;
}

#request_table tr td:nth-child(2) > a
{
    font-weight: bold;
    line-height: 2rem;
    font-size: 1.2rem;
}

#notifications table.torrent_table .tags
{
    text-align: left;
}

table.torrent_table .tags,
#request_table .tags
{
    padding: 1rem 1rem 1rem 1rem;
    overflow: auto;
    font-size: 0;
}

table.torrent_table .tags a,
#request_table .tags a
{
    display: block;
    float:left;
    line-height: 2rem;
    width: 12.5rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin: 0.3rem;
    padding: 0 0.5rem;
    box-sizing: border-box;
}
table.torrent_table
{
    border-collapse: separate;
    border-spacing: 0 0.2rem;
    border: none;
}

table.torrent_table tr.rowa,
table.torrent_table tr.rowb,
table#request_table tr.rowa,
table#request_table tr.rowb,
#collage table tr
{
    background: none;
}

table.torrent_table tr.rowa td,
table.torrent_table tr.rowb td,
table#request_table tr.rowa td,
table#request_table tr.rowb td,
#collage table tr.rowa td:nth-child(n+2),
#collage table tr.rowb td:nth-child(n+2)
{
    background: var(--dark);
}

#top10 table.torrent_table tr td:first-child,
/*#collage table:not(.torrent_table,.forum_post) tr td:nth-child(2),*/
table#request_table tr td:nth-child(1),
#notifications table.torrent_table tr td:first-child,
table.torrent_table tr td:first-child:not(.cats_cols)
{
    border-top-left-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
}

table.torrent_table tr td:nth-child(-n+2):not(.cats_cols),
#requests #request_table tr:not(.colhead) td:nth-child(2),
#requests #request_table tr:not(.colhead) td:first-child,
#top10 table.torrent_table tr:not(.colhead) td:nth-child(3),
#notifications table.torrent_table tr:not(.colhead) td:nth-child(2),
#notifications table.torrent_table tr:not(.colhead) td:nth-child(3)
{
    vertical-align: top;
}

#notifications table.torrent_table tr td:first-child:not(.cats_cols),
#top10 table.torrent_table tr:not(.colhead) td:nth-child(1)
{
    vertical-align: middle;
}

#top10 table.torrent_table tr td:last-child,
table.torrent_table tr td:last-child,
table#request_table tr td:last-child,
#collage table:not(.forum_post) tr td:last-child
{
    border-radius: 0 0.5rem 0.5rem 0;
}

#request_table tr.rowa td > a,
#request_table tr.rowb td > a
{
    padding: 0 0 0 1rem;
}

table.torrent_table, .thin > form > table
{
    box-shadow: none;
}

#top10 table.torrent_table tr td:first-child
{
    display: table-cell;
}

#top10 table.torrent_table tr:not(.colhead):nth-child(2) td:first-child
{
    background: #E4A400;
    color: #fff;
}
#top10 table.torrent_table tr:not(.colhead):nth-child(3) td:first-child
{
    background: #A0AFB8;
    color: #fff;
}

#top10 table.torrent_table tr:not(.colhead):nth-child(4) td:first-child
{
    background: #BE6F26;
    color: #fff;
}

#top10 table.torrent_table tr:not(.colhead) td:first-child
{
    /*
    background: var(--button);
    color: var(--button_text);
    */
    background: var(--bright);
}

#request_table td,
.torrent td
{
    max-width: 45rem;
}

#request_table tr.rowa td > a,
#request_table tr.rowb td > a
{
    padding: 0;
}

td.cats_col,
td.cats_cols
{
    padding:0;
    position: relative;
    width: 0;
}

#notifications .torrent_table tr:not(.colhead) td > a,
#notifications .torrent_table tr.colhead td:nth-child(3)
{
    text-align: left;
}

#notifications .torrent_table tr.colhead a
{
    font-weight: bold;
}

#collage .tags
{
    padding: 1rem 10rem 1rem 1rem;
}
/*
#collage #content table:not(.forum_post) tr td:first-child
{
    position: relative;
    padding: 0;
}
*/
#collage #content table tr:not(.colhead) td:nth-child(2) > a
{
    font-weight: bold;
}

#collage #content table:not(.forum_post) tr td:first-child img
{
    display: none;

}

#details_top table
{
    border-spacing: 0;
}

#details_top table.torrent_table tr td:last-child
{
    border-radius: 0;
}

#details_top td > strong
{
    line-height: 2rem;
    font-size: 1.2rem;
}

tr.group_torrent td
{
    padding: 0 0 0 1rem;
}

#torrents table.torrent_table tr.colhead:not(:first-child) td
{
    border-radius: 0.5rem;
    background: var(--bright);
    line-height: 2rem;
    height: 2rem;
}


#collage table.torrent_table > tbody > tr > td:first-child,
#torrents table.torrent_table > tbody > tr > td:first-child,
#requests #request_table tr td:first-child,
#bookmarks table.torrent_table > tbody > tr > td:first-child
{
    padding: 0 !important;
    width: 0 !important;
}

.box
{
    background: var(--bright);
}

#top10 table.torrent_table tr td:nth-child(2)
{
    padding: 0;
    border-radius: 0;
    width: 0 !important;
}


#top10 table.torrent_table tr td img
{
    display: none;
}

#requests table.request_table tr td:nth-child(n+3),
table.torrent_table tr td:nth-child(n+3)
{
    text-align: center;
}
#top10 table.torrent_table tr td:nth-child(-n+3),
#notifications table.torrent_table tr td:nth-child(-n+3)
{
    text-align: left;
}

#top10 .torrent
{
    font-weight: normal;
}

#top10 #content form
{
    background: var(--bright);
    border-radius:0.5rem;
}

#top10 form table.border
{
    border: none;
}

table.topic_list
{
    border-collapse: separate;
    border-spacing: 0 0.2rem;
}

table.topic_list tr
{
    background: none;
}

table.topic_list tr.rowa td,
table.topic_list tr.rowb td
{
    background: var(--bright);
}

table.topic_list tr td:first-child
{
    border-radius: 0.5rem 0 0 0.5rem;
}


table.topic_list tr td:last-child
{
    border-radius: 0 0.5rem 0.5rem 0;
}

.alertbar a
{
    color: #fff;
}

#collage .sidebar img
{
    display:none;
}

#details_top tr.group_torrent td
{
    vertical-align: top;
    padding: 0.3rem;
    width: 0;
}

span[style="color:red"],
span[style="color:red;"],
span[style="color:#FF0000"]
{
    color: var(--red) !important;
}

.bbcode[style="background-color:grey;"]
{
    background-color: var(--medium) !important;
}

.torrent_table .linkbox a
{
    color: var(--link)
}
.torrent_table .linkbox a:hover
{
    color: var(--hover)
}

.stat
{
    color: var(--header_text);
}

.contact_link
{
    border: none;
}

strong.important_text
{
    color: var(--red);
}

img[src="static/common/symbols/freedownload.gif"],
img[src="static/styles/modern/images/star16.png"]
{
    display: none;
}

#user_dropdown a[href="/donate.php"] img
{
    display: none;
}

#user_dropdown a[href="/donate.php"]::before
{
    font-family: icons;
    content: "\\f112";
    color: var(--red);
    display: inline-block;
    position: relative;
    top: -0.3rem;
    font-size: 0.8em;
    margin: 0 0 0 0.2rem;
}

.r00,
.r01,
.r02,
.r03,
#nav_leeching_r
{
    color: var(--red);
}

.r04,
.r05,
.r06,
.r07
{
    color: var(--orange);
}

.r08,
.r09
{
    color: var(--yellow);
}

.r10,
.r20,
.r50,
.r99,
#nav_seeding_r
{
    color: var(--green);
}

div#hoverbabe-container
{
    background: var(--medium) !important;
    border: none !important;
    border-radius:0.5rem;
    box-shadow: 0 0 0.5rem #00000080;
    color: var(--text) !important;
    padding: 0.3rem !important;
    overflow:hidden;
}

div#hoverbabe-container span.label,
div#hoverbabe-container h1
{
    color: var(--link) !important;
}

div#hoverbabe-container h1
{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    line-height: 3rem;
    font-size: 1.8rem;
    text-align: center;
    background: var(--bright);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 1rem;

}

div#hoverbabe-container div#biodata,
div#hoverbabe-container div#bioimage
{
    margin-top: 3rem;
}

div#hoverbabe-container div#bioimage img
{
    display: block;
    border-radius: 0.2rem !important;
}

.head + div.box,
.colhead + div.box,
tr.head, tr#recentuploads,
tr#recentsnatches,
.head + table,
#site_debug,
.main_column > table, .thin > table,
.thin > form > table,
#searchforum table,
#searchthread table,
#messageform .box,
.shadow, .report,
tr.head + tr
{
    box-shadow: none;
}

/*
tr.head,
tr.head + tr
{
    box-shadow: none;
}
*/

.tags a
{
    font-weight: normal;
    font-style: italic;
    font-size: 1.2rem;
}

.invalid, .warning, .error
{
    color: var(--red);
    font-weight: normal;
}

.flash.error
{
    color: #fff;
}

tr.unreadpm
{
    background: none;
    color: #fff;
}

tr.unreadpm td
{
    background: var(--red);
}

tr.unreadpm .rank
{
    color: #fff !important;
}

tr.unreadpm a
{
    color: #fff;
}

#autoresults
{
    background: var(--medium);
    color: var(--text);
    border: var(--text) 1px solid;
    border: none;
    border-radius: 0.2rem;
    overflow:hidden;
    box-shadow: 0 0 0.5rem #00000080;
}

#autoresults li.highlight,
#autoresults li.highlight span.num
{
    background: var(--text);
    color: var(--bright);
}


.icon_stack .font_icon.torrent_icons.icon_torrent_bonus.bonus
{
    display:none;
}

.torrent_icon_container .icon_stack
{
    width: unset;
    height: 2rem;
}

.torrent_icon_container .icon_stack i:last-child
{
    margin: 0 !important;
}

.icon_stack,
.icon_container
{
    height: 2rem;
}

.icon_stack > .font_icon.torrent_icons:first-child
{
    position: unset;
}
.icon_stack > .font_icon.torrent_icons:first-child:not(.icon_torrent_bonus)
{
    display: block;
}


.icon_stack .font_icon.torrent_icons.personal_seed.icon_torrent_seeding,
.icon_stack .font_icon.torrent_icons.personal_leech.icon_torrent_leeching,
.icon_stack .font_icon.torrent_icons.sitewide_seed.icon_torrent_seeding,
.icon_stack .font_icon.torrent_icons.sitewide_leech.icon_torrent_leeching,
.icon_stack .font_icon.torrent_icons.unlimited_seed.icon_torrent_seeding,
.icon_stack .font_icon.torrent_icons.unlimited_leech.icon_torrent_leeching
{
    display: block;
    width: 2rem;
    height: 2rem;
    font-size: 1.8rem;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    position: unset;
    float: left;
    text-align: center;
    margin-right: 0.4rem;
}

.icon_stack .font_icon.torrent_icons.personal_seed.icon_torrent_seeding,
.icon_stack .font_icon.torrent_icons.personal_leech.icon_torrent_leeching {
    background: var(--blue_icon);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke-width: 0;
    -webkit-text-stroke-color: #96969640;
}


.icon_stack .font_icon.torrent_icons.sitewide_seed.icon_torrent_seeding,
.icon_stack .font_icon.torrent_icons.sitewide_leech.icon_torrent_leeching {
    background: var(--green);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke-width: 0;
    -webkit-text-stroke-color: #96969640;
}


.icon_stack .font_icon.torrent_icons.unlimited_seed.icon_torrent_seeding,
.icon_stack .font_icon.torrent_icons.unlimited_leech.icon_torrent_leeching {
    background: var(--yellow);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke-width: 0;
    -webkit-text-stroke-color: #96969640;
}

.icon_stack .font_icon.torrent_icons.personal_leech.icon_torrent_leeching::before,
.icon_stack .font_icon.torrent_icons.sitewide_leech.icon_torrent_leeching::before,
.icon_stack .font_icon.torrent_icons.unlimited_leech.icon_torrent_leeching::before {
    content: "\\f147";
}

.icon_stack .font_icon.torrent_icons.personal_seed.icon_torrent_seeding::before,
.icon_stack .font_icon.torrent_icons.sitewide_seed.icon_torrent_seeding::before,
.icon_stack .font_icon.torrent_icons.unlimited_seed.icon_torrent_seeding::before {
    content: "";
    width: 2rem;
    height: 2rem;
    display: block;
}

.icon_stack .font_icon.torrent_icons.personal_seed.icon_torrent_seeding::before {
    background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIGZpbGw9IiMwMGNjZmYiPjxnPjxyZWN0IGZpbGw9Im5vbmUiIGhlaWdodD0iMjQiIHdpZHRoPSIyNCIvPjwvZz48Zz48Zz48cG9seWdvbiBwb2ludHM9IjYuNDEsNiA1LDcuNDEgOS41OCwxMiA1LDE2LjU5IDYuNDEsMTggMTIuNDEsMTIiLz48cG9seWdvbiBwb2ludHM9IjEzLDYgMTEuNTksNy40MSAxNi4xNywxMiAxMS41OSwxNi41OSAxMywxOCAxOSwxMiIvPjwvZz48L2c+PC9zdmc+");
    background-position: -0.5rem -0.5rem;
    background-size: 3rem 3rem;
}

.icon_stack .font_icon.torrent_icons.sitewide_seed.icon_torrent_seeding::before {
    background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIGZpbGw9IiMxOGQ4NjAiPjxnPjxyZWN0IGZpbGw9Im5vbmUiIGhlaWdodD0iMjQiIHdpZHRoPSIyNCIvPjwvZz48Zz48Zz48cG9seWdvbiBwb2ludHM9IjYuNDEsNiA1LDcuNDEgOS41OCwxMiA1LDE2LjU5IDYuNDEsMTggMTIuNDEsMTIiLz48cG9seWdvbiBwb2ludHM9IjEzLDYgMTEuNTksNy40MSAxNi4xNywxMiAxMS41OSwxNi41OSAxMywxOCAxOSwxMiIvPjwvZz48L2c+PC9zdmc+");
    background-position: -0.5rem -0.5rem;
    background-size: 3rem 3rem;
}

.icon_stack .font_icon.torrent_icons.unlimited_seed.icon_torrent_seeding::before {
    background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIGZpbGw9IiNmY2VkMGEiPjxnPjxyZWN0IGZpbGw9Im5vbmUiIGhlaWdodD0iMjQiIHdpZHRoPSIyNCIvPjwvZz48Zz48Zz48cG9seWdvbiBwb2ludHM9IjYuNDEsNiA1LDcuNDEgOS41OCwxMiA1LDE2LjU5IDYuNDEsMTggMTIuNDEsMTIiLz48cG9seWdvbiBwb2ludHM9IjEzLDYgMTEuNTksNy40MSAxNi4xNywxMiAxMS41OSwxNi41OSAxMywxOCAxOSwxMiIvPjwvZz48L2c+PC9zdmc+");
    background-position: -0.5rem -0.5rem;
    background-size: 3rem 3rem;
}

.donate_details,
.donate_details table td
{
    background: var(--yellow);
    border: none;
}

.pager_on
{
    color: var(--blue);
}

#collage #editor
{
    font-size: 1.2rem;
}

#user #content form
{
    background: var(--bright);
    border-radius: 0.5rem;
    padding: 0.5rem;
    box-sizing: border-box;
}

#content form > table
{
    border: none;
}

form .colhead strong
{
    font-size: 1.8rem;
    font-weight: normal;
    color: var(--link);
}

.label
{
    font-weight: normal;
}

span[title="Number of Comments"]
{
    width: 2rem;
    height: 2rem;
    display: block;
    overflow: hidden;
    margin: auto;
}

span[title="Number of Comments"]::before
{
    font-family: icons;
    content: "\\f11e";
    width:2rem;
    height: 2rem;
    display: block;
    font-size: 1.8rem;
    text-align:center;
    line-height: 2rem;
}


span[title="Number of Files"]
{
    width: 2rem;
    height: 2rem;
    display: block;
    overflow: hidden;
    margin: auto;
}

span[title="Number of Files"]::before
{
    font-family: icons;
    content: "\\f106";
    width:2rem;
    height: 2rem;
    display: block;
    font-size: 1.2rem;
    text-align:center;
    line-height: 2rem;
}

.nicebar_container
{
    height:2rem;
    font-size: 1.2rem;
    margin: 0;
    padding: 0.2rem;
    position: absolute;
}
.freeleech_bar
{
    line-height: 2rem;
}

#alerts
{
    max-width: 50rem;
}

.alertbar
{
    background: var(--red);
    font-size: 1.2rem;
    line-height: 2rem;
    font-weight: bold;
    height: 2rem;
    animation: none;
    padding: 0 2rem;
    box-sizing: border-box;
    border-radius: 0.5rem;
}

.alertbar a
{
    width: 100%;
    display: block;
    font-weight: bold;
}

.torrent .version
{
    clear:left;
}

.icon_stack,
.icon_stack .font_icon
{
    width: 2rem;
    height: 2rem;
    padding: 0;
    line-height: 2rem;
}

tr.smallhead a[href="#"]:link
{
    width: 2rem;
    height: 2rem;
    padding: 0;
    line-height: 2rem;
    text-align: center;
    display: inline-block;
}

ul.poll li.graph
{
    margin-top: 1rem;
    margin-bottom: 2rem;
    height: 0.5rem;
}

.center_poll,
.left_poll,
.right_poll
{
    background: var(--text);
    height: 100%;
}
.left_poll
{
    border-radius: 0.2rem 0 0 0.2rem;
}

.right_poll
{
    border-radius: 0 0.2rem 0.2rem 0;
}

.linkbox .torrent_buttons a
{
    color: #fff;
    font-weight: bold;
    font-family: sans-serif;
}

.linkbox .torrent_buttons a:hover
{
    color: #fff;
}

table#collages tr:not(.colhead) td
{
    background: var(--dark);
}


/*--------------------DROPDOWN-MENU--------------------*/

#nav_userinfo > a::after
{
    width: 2rem;
    height: 2rem;
    line-height: 2rem;
    display: block;
    text-align: center;
    float: right;
}

#header_bottom li > a .font_icon.nav_icons
{
    color: var(--header_text);
}

#header_bottom li > a:hover,
#header_bottom li > a:hover .font_icon.nav_icons
{
    color: var(--hover);
}

#header_bottom li.highlight > a .font_icon.nav_icons,
#header_bottom li.highlight > a,
#header_bottom li.highlight > a:hover
{
    color: var(--red);
    font-weight: bold;
}

#major_stats > ul
{
    float: left;
    display: block;
    height: 2rem;
    line-height: 2rem;
    margin-left: 0.3rem;
}

#userinfo_username > li > a.username
{
    display: block;
    background: var(--medium);
    position: relative;
    z-index: 20;
    transition: none;
}
#userinfo_username > li > a.username:hover
{
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}

#userinfo_username > li
{
    padding: 0 !important;
    margin: 0 !important;
    height: 2.4rem;
}

#userinfo_username li ul
{
    left: 0;
    top: 0;
    border-radius: 0 0 0.3rem 0.3rem;
    overflow: hidden;
    position: relative;
    box-shadow: #00000040 0 0 0.5rem;
}

#userinfo_username li ul li
{
    margin: 0 !important;
    min-width: unset;
}

.icon_stack .font_icon.nav_icons
{
    margin: 0;
    padding: 0;
}

#userinfo_username li ul li a
{
    line-height: 2rem;
    transition: none;
}

/*--------------------BOOKMARKS--------------------*/

#bookmarks .torrent_grid,
#collage .torrent_grid
{
    background: var(--dark);
    border-radius: 0.5rem;
    padding: 0.5rem 0 0 0.5rem;
}

#bookmarks .torrent_grid > .torrent_grid__torrent,
#collage .torrent_grid > .torrent_grid__torrent
{
    border: 0;
    margin: 0 0.5rem 0.5rem 0;
    background: none;
    border-radius: 0.2rem;
    overflow: hidden;
}

#bookmarks table tr td
{
    position: relative;
}
/*
#bookmarks table .torrent_icon_container
{
    position: absolute;
    top: 3px;
    left: 3px;
}
*/
/*
#bookmarks table tr td span,
#bookmarks table tr td a
{
    float: unset !important;
}
*/

/*--------------------HEADER--------------------*/

/*
#header a,
#header a:visited,
.stat,
#stats_block,
#major_stats .font_icon.nav_icons
{
   color: var(--text);
}

.searchcontainer button
{
    color: var(--link) !important;
}
*/

#userinfo_username li ul li:not(.highlight) a,
#userinfo_username li ul li:not(.highlight) a .font_icon.nav_icons
{
    color: var(--text2);
}

#userinfo_username li ul li:not(.highlight) a:hover,
#userinfo_username li ul li:not(.highlight) a:hover .font_icon.nav_icons
{
    color: var(--hover);
}

#menu a
{
    color: var(--header_text);
}

#menu a:hover
{
    background: none;
    color: var(--hover);
}

/*--------------------HEADER-BOTTOM--------------------*/

#header_bottom a, #header_bottom a:visited
{
    color: var(--header_text);
}

#header_bottom
{
    height: 2.4rem;
    padding-top: 0;
}

#header_bottom div > ul > li > a
{
    margin: 0;
    display: block;
    line-height: 2rem;
    height: 2rem;
    padding: 0.2rem 0.5rem;
    border-radius: 0.2rem;
}

#header_bottom a:hover
{
    background: none;
}

#header_bottom div > ul > li > a span
{
    padding: 0 0.4rem;
    height: 2rem;
    display: block;
    float: right;
}

#header_bottom div > ul > li
{
    margin: 0 0 0 0.3rem;
    padding: 0;
    display: block;

}

#major_stats > ul > li
{
    float: right;
}

#major_stats_left
{
    position: relative;
    float: left;
}

#major_stats_left,
#major_stats_left ul,
#major_stats_left li
{
    display: block;
    float: left;
}

#header_bottom #major_stats_left a,
#header_bottom #major_stats_lefta:visited,
#header_bottom #major_stats_left .font_icon.nav_icons
{
    color: var(--header_text);
    font-weight: normal;
    font-size: 1.4rem;
}

#header_bottom #major_stats_left a span
{
    font-weight: bold;
}

#header_bottom #major_stats_left a:hover,
#header_bottom #major_stats_left a:hover .font_icon.nav_icons
{
    color: var(--hover);
}

/*--------------------TORRENT-PAGE--------------------*/

#torrents #details_top #personal_collages,
#torrents #details_top .torrent_table
{
    border-radius: 0.5rem;
    overflow:hidden;
    box-shadow: var(--shadow);
    background: var(--bright);
}
#torrents #details_top .torrent_table > tbody > tr:first-child td:nth-child(2)
{
    /*border-top-left-radius: 5px;*/
    padding-left: 1rem !important;
}

#torrents  #details_top .torrent_table > tbody > tr > td.right
{
    padding-right: 1rem !important;
}

#torrents  #details_top .torrent_table > tbody > tr > td.filetypes span
{
    line-height: 2rem;
}

#torrents  #details_top .torrent_table
{
    line-height: 2rem;
}
/*
#torrents #details_top .torrent_table > tbody > tr:first-child td:last-child
{
    border-top-right-radius: 5px;
}

#torrents #details_top .torrent_table > tbody > tr:last-child td:first-child
{
    border-bottom-left-radius: 5px;
}

#torrents #details_top .torrent_table > tbody > tr:last-child td:last-child
{
    border-bottom-right-radius: 5px;
}
*/
#torrents #details_top .torrent_table > tbody > tr:nth-child(-n+2) td:first-child
{
    display: none;
}

#torrents #details_top .torrent_table > tbody > tr td.filetypes
{
    height: 2rem;
}

#torrents #details_top .torrent_table > tbody > tr:nth-child(-n+2) td:nth-child
{
    colspan: 2;
}

#torrents #details_top .torrent_table > tbody > tr > td
{
    background: var(--dark);
    padding: 0.3rem !important;
    border-radius: 0;
}

#torrents #details_top .torrent_table > tbody > tr:first-child > td
{
    background: var(--colhead);
}

#torrents #details_top .torrent_table > tbody > tr > td[title="Snatches"]::before,
#torrents #details_top .torrent_table > tbody > tr > td[title="Seeders"]::before,
#torrents #details_top .torrent_table > tbody > tr > td[title="Leechers"]::before
{
    font-family: "icons";
    width: 2rem;
    height: 2rem;
    display: block;
    margin: auto;
}

#torrents #details_top .torrent_table > tbody > tr > td[title="Snatches"]::before
{

    content: "\\f14f";
}

#torrents #details_top .torrent_table > tbody > tr > td[title="Seeders"]::before
{
    content: "\\f14e";
}

#torrents #details_top .torrent_table > tbody > tr > td[title="Leechers"]::before
{
    content: "\\f14c";
}

#torrents #details_top .torrent_table table
{
    margin: 0;
    width: 100%;
}

#torrents #details_top .torrent_table table tr
{
    border: none;
}

#torrents #details_top .torrent_table table blockquote
{
    border: none;
}

/*--------------------TORRENTS--------------------*/

table.torrent_table tr.rowa,
table.torrent_table tr.rowb
{
    color: var(--text3);
}

.torrent td:not(:first-child,:last-child):not(.user) > a,
#collage table.torrent_table td:nth-child(2) > strong > a,
#bookmarks table.torrent_table td:nth-child(2) > strong > a
{
    font-weight: bold;
    line-height: 2rem;
    font-size: 1.2rem;
}

.torrent > td
{
    font-weight: normal;
}

.torrent
{
    font-size: inherit;
}

tr.head > td > a,
tr.colhead > td > a
{
    font-weight: bold;
}

.torrent.rowb br,
.torrent.rowa br
{
    display: none;
}

.category_label
{
    background: var(--button);
    color: var(--button_text);
    padding: 0 0.5rem;
    box-sizing: border-box;
    border-radius: 0.2rem;
    line-height: 2rem;
    height: 2rem;
    font-weight: bold;
    font-size: 1.2rem;
    text-align: center !important;
    display:block;
    margin: 0.3rem;
    width: 15rem;
}

.category_tag
{
    width: 10rem !important;
    background: var(--button);
    color: var(--button_text);
    padding: 0 0.5rem;
    box-sizing: border-box;
    border-radius: 0.2rem;
    line-height: 2rem;
    height: 2rem;
    font-weight: bold;
    font-size: 1.2rem;
    text-align: center !important;
    margin-right: 0.5rem !important;
    display: block;
    float: left;
}

.category_label:visited,
.category_tag:visited
{
    color: var(--button_text);
}

.cover
{
    display: block;
    width: 15rem;
    height: 15rem;
    margin: 0.3rem;
    border-radius: 0.2rem;
}

/*--------------------TABLES--------------------*/

#collage .thin > table:not(.forum_post),
table#request_table
{
    border-collapse: separate;
    border-spacing: 0 0.2rem;
}

table
{
    border-collapse: separate;
    border-spacing: 0 0.2rem;
}

/*--------------------PAGE--------------------*/

#header,
#content
{
    min-width: 94rem;

}

/*NOTIFICATIONS*/
/*
div.version
{
    display: table;
}
*/

/*Slot Machine*/

span.payout,
span#winnings
{
    color: var(--text) !important;
}

.fm input[type="button"],
.fm input[type="text"]
{
    color: var(--text);
    border-color: var(--text);
}

.fmresults td.fmheader
{
    background: var(--text);
}

input[type="text"]:read-only
{
    background: var(--input);
    color: var(--input-text);
}

/*--------------------TAG-HIGHLIGHTER--------------------*/

input[type="button"]
{
    border-radius: 0.3rem;
}

div#s-conf-wrapper
{
    display: grid;
    border: 0.1rem solid var(--bright);
    box-shadow: var(--shadow);
    width: 60rem;
    background: var(--medium);
    border-radius: 0.5rem;
    gap: 0.2rem;
}

a.s-conf-tab,
div#s-conf-wrapper
{
    font-size: 1.2rem;
    line-height: 2rem;
}

div#s-conf-wrapper input[type="checkbox"]
{
    height: 2rem;
    display: table-cell;
    vertical-align: middle;
}

div#s-conf-wrapper > h1,
div#s-conf-status,
div#s-conf-wrapper > div.s-conf-buttons
{
    grid-column: 1 / 3;
    width: unset;
    border: none;
    border-radius: 0.5rem;
}

div#s-conf-wrapper > h1
{
    margin-bottom: 1rem;
}

ul#s-conf-tabs
{
    grid-column: 1;
    height: unset;
    width: 12rem;
    margin: 0;
    display: flex;
    gap: 0.2rem;
    flex-direction: column;
}

div#s-conf-content
{
    grid-column: 2;
    margin: 0;
}

#s-conf-tabs a.s-conf-tab
{
    /*width: 11rem;*/
    height: auto;
    border-radius: 0.3rem;
}

div.s-browse-tag-holder span.s-tag
{
    display: block;
    float: left;
    padding: 0;
    border: none;
    margin: 0.3rem;
    border-radius: 0.5rem;
}

div.tag_inner .s-tag
{
    border: none !important;
    border-radius: 0.5rem !important;
    background: var(--medium);
    padding: 0.2rem 0.5rem !important;
    margin: 0 !important;
}

div.tag_inner span.s-tag
{

    line-height: 1.8rem;
}

span.s-tag div.s-button
{
    width: 1.4rem;
    height: 1.4rem;
    line-height: 1.4rem;
    margin: 0.2rem 0.3rem 0.2rem 0;
}

.s-conf-add-btn, .s-conf-remove-btn
{
    width: 11rem !important;
}

.s-tag a
{
    max-width: 12.5rem !important;
}

div.tag_inner .s-tag > a
{
    color: var(--text);
}

div.tags a
{
    font-style: normal;
}

table#request_table div.tags span.s-tag a,
table.torrent_table div.tags span.s-tag a
{
    padding: 0 0.5rem;
    box-sizing:border-box;
    margin: 0;
    max-width: unset;
}

#s-conf-background
{
    background: #202020BF !important;
}

#s-conf-tabs .s-conf-tab,
#s-conf-content
{
    background: var(--bright);
    color: var(--text);
    border: none;
    border-radius: 0;
    vertical-align: middle;
    margin: 0;
}

#s-conf-content #s-conf-form
{
    background: none;
    color: var(--text);
}

#s-conf-content
{
    border-radius: 0.5rem !important;
    margin-top: 1rem;
}
/*
#s-conf-wrapper #s-conf-tabs li
{
    margin: 0 0.2rem 0.2rem 0;
}
*/

#s-conf-tabs li,
#s-conf-tabs li h2,
#s-conf-tabs li h2 a
{
    display: block;
    width: 100%;
    box-sizing: border-box;
}

#s-conf-tabs .s-conf-tab.s-selected
{
    background: var(--button);
    /*color: var(--bright);*/
    color: var(--button_text) !important;
}

#s-conf-tabs .s-conf-tab:not(.s-selected):hover
{
    background: var(--brighter);
}

#s-conf-wrapper h1,
#s-conf-wrapper h2

{
    color: var(--text) !important;
}

#s-conf-wrapper textarea
{
    background: var(--medium);
    resize: none;
}

#s-conf-wrapper #s-conf-content
{
    border: none;
    box-shadow: none;
}

ul#torrent_tags > li
{
    border: none;
}

/*----------TAG-HIGHLIGTHER-TAG-COLORS----------*/


    span.s-tag > a
    {
        color: white !important;
    }

    span.s-tag.s-good,
    .s-add-good,
    .s-remove-good
    {
        background: var(--liked) !important;
        border-color: var(--liked-border) !important;
    }

    span.s-tag.s-loved,
    .s-add-loved,
    .s-remove-loved
    {
        background: var(--loved) !important;
        border-color: var(--liked-border) !important;
    }

    span.s-tag.s-performer,
    .s-add-performer,
    .s-remove-performer
    {
        background: var(--performer) !important;
        border-color: var(--performer-border) !important;
    }

    span.s-tag.s-loveperf,
    .s-add-loveperf,
    .s-remove-loveperf
    {
        background: var(--loved-performer) !important;
        border-color: var(--performer-border) !important;
    }

    span.s-tag.s-likesite,
    .s-add-likesite,
    .s-remove-likesite
    {
        background: var(--liked-site) !important;
        border-color: var(--liked-site-border) !important;
    }

    span.s-tag.s-lovesite,
    .s-add-lovesite,
    .s-remove-lovesite
    {
        background: var(--loved-site) !important;
        border-color: var(--liked-site-border) !important;
    }

    span.s-tag.s-newperf,
    .s-add-newperf,
    .s-remove-newperf
    {
        background: var(--new-performer) !important;
        border-color: var(--new-performer-border) !important;
    }

    span.s-tag.s-amateur,
    .s-add-amateur,
    .s-remove-amateur
    {
        background: var(--amateur) !important;
        border-color: var(--amateur-border) !important;
    }

    span.s-tag.s-loveamat,
    .s-add-loveamat,
    .s-remove-loveamat
    {
        background: var(--loved-amateur) !important;
        border-color: var(--amateur-border) !important;
    }

    span.s-tag.s-maleperf,
    .s-add-maleperf,
    .s-remove-maleperf
    {
        background: var(--male-performer) !important;
        border-color: var(--male-performer-border) !important;
    }

    span.s-tag.s-lovemale,
    .s-add-lovemale,
    .s-remove-lovemale
    {
        background: var(--loved-male-performer) !important;
        border-color: var(--male-performer-border) !important;
    }

    span.s-tag.s-likesite,
    .s-add-likesite,
    .s-remove-likesite
    {
        background: var(--liked-site) !important;
        border-color: var(--liked-site-border) !important;
    }

    span.s-tag.s-lovesite,
    .s-add-lovesite,
    .s-remove-lovesite
    {
        background: var(--loved-site) !important;
        border-color: var(--liked-site-border) !important;
    }

    span.s-tag.s-disliked,
    .s-add-disliked,
    .s-remove-disliked
    {
        background: var(--disliked) !important;
        border-color: var(--disliked-border) !important;
    }

    span.s-tag.s-hated,
    .s-add-hated,
    .s-remove-hated
    {
        background: var(--hated) !important;
        border-color: var(--disliked-border) !important;
    }

    span.s-tag.s-terrible,
    .s-add-terrible,
    .s-remove-terrible
    {
        background: var(--black-listed) !important;
        border-color: var(--black-listed-border) !important;
    }

    span.s-tag.s-useless,
    .s-add-useless,
    .s-remove-useless
    {
        background: var(--useless) !important;
        border-color: var(--useless-border) !important;
    }

/*--------------------COLLAGE--------------------*/

#collage div.tags
{
    float: left;
    clear: left;
    font-size: 0;
}

#collage div.tags a
{
    display:block;
    float:left;
    width: 10rem;
    padding-left: 1rem;
    text-overflow: ellipsis;
    overflow: hidden;
}

/*--------------------UPLOAD--------------------*/

strong span[style="color:green"],
span[style="color:green"] strong
{
    color: var(--green) !important;
}

/* TAGS */

#tags input[type="text"]
{
    border-radius: 0.3rem;
}

#tags div.tag_results table.box
{
    background: none;
}

#tags div.tag_results table.box tr.rowa,
#tags div.tag_results table.box tr.rowb
{
    background: none;
}

#tags div.tag_results table.box tr.rowa td,
#tags div.tag_results table.box tr.rowb td
{
    background: var(--dark);
}

#tags div.tag_results table.box tr td:first-child
{
    border-radius: 0.5rem 0 0 0.5rem;
}

#tags div.tag_results table.box tr td:last-child
{
    border-radius: 0 0.5rem 0.5rem 0;
}

#tags .votes
{
    color: var(--text);
}

/* OTHER */

a.contact_link,
a.contact_link:visited
{
    background: var(--red);
    text-decoration: none;
    color: var(--hover);
    margin: 0 0.5rem;
}

#staff table
{
    border: none;
}

.uploadbody textarea
{
    margin: 0.5rem 0;
}

#donatediv tr
{
    background: none;
}

#donatediv tr td
{
    background: var(--medium);
}

#donatediv tr td:first-child
{
    border-radius: 0.5rem 0 0 0.5rem;
}

#donatediv tr td:last-child
{
    border-radius: 0 0.5rem 0.5rem 0;
    padding-right: 0.3rem;
}

#donatediv input
{
    margin: 0;
}

label
{
    line-height: 2rem;
}

div.linkbox
{
    line-height: 2rem;
    color: var(--text2);
}

div.linkbox > a,
div.linkbox > a:visited
{
    color: var(--text2);
    line-height: 2rem;
    text-shadow: var(--shadow);
}

div.linkbox a:hover
{
    color: var(--hover);
}

tr.smallhead a.post_id,
tr.smallhead a.post_id:visited
{
    color: var(--text);
}

/* SITE LOG */

#log span[style="color: green;"]
{
    color: var(--green) !important;
}

#log span[style="color: #1E90FF;"]
{
    color: var(--blue) !important;
}

#log span[style="color: #a07100;"]
{
    color: var(--orange) !important;
}


#log span[style="color: red;"]
{
    color: var(--red) !important;
}

.anchor, a.anchor:hover
{
    color: var(--text);
}

tr.smallhead
{
    color: var(--link);
}

table.bonusshop tr.rowa,
table.bonusshop tr.rowb,
table.bonusshop tr.smallhead
{
    background: none;
}

table.bonusshop tr.rowa td,
table.bonusshop tr.rowb td
{
    background: var(--dark);
}

table.bonusshop tr.smallhead td
{
    background: var(--bright);
}

table.bonusshop tr td:first-child
{
    border-radius: 0.5rem 0 0 0.5rem;
}

table.bonusshop tr td:last-child
{
    border-radius: 0 0.5rem 0.5rem 0;
}

#stats_block
{
    color: var(--header_text);
}

.post_footer
{
    color: var(--text2);
}

.shopbutton.itembuy,
.shopbutton.itemnotbuy
{
    margin: 0;
}

div#sig
{
    max-height: none !important;
}

#header
{
    color: var(--header_text);
}

/*--------------------COMBINE-BACKGROUND-AND-CONTENT--------------------*/

#content
{
    background: none;
    border-radius: 0;
    width: 100%;
}

.thin
{
    width: 100%;
}

.thin > h2:first-child
{
    margin: 0 0 var(--text-height) 0;
    border-radius: 0.5rem;
}

body
{
    background: var(--medium);
}

#header
{
    background: none;
}

#header_top #searchbars,
#header_bottom,
#userinfo_username > li > a.username
{
    background: var(--header);
}

#modal_content h2
{
    border-radius: 0;
    margin: 0 -4rem 2rem -4rem;
}

#modal_content .details.thin
{
    max-width: calc(100% - 8rem);
    margin: auto;
}

#modal_content
{
    max-width: none;
    width: 100%;
    border-radius: 0;
    box-sizing: border-box;
}

td.badgesrow,
.badgesrow
{
    border-top: 1px solid var(--medium);
}

#inbox div.box > div.body,
#preview
{
    padding: 1rem;
}

#inbox .colhead td
{
    background: var(--brighter);
}

#inbox #searchbox input[type="text"]
{
    width: 50% !important;
    border-radius: 0.3rem;
}

tr.box,
#inbox .rowa,
#inbox .rowb
{
    background: none;
}

#inbox .rowa td,
#inbox .rowb td
{
    background: var(--medium);
}

tr.box td input
{
    margin: 0;
}

tr.box td .long
{
    border-radius: 0.3rem;
    width: 100%;
}

input[name="search"],
#taginput
{
    border-radius: 0.3rem;
}

tr.box td
{
    background: var(--bright);
}

tr.box td:last-child,
#inbox td:last-child
{
    border-radius: 0 0.5rem 0.5rem 0;
}

tr.box td:first-child,
#inbox td:first-child
{
    border-radius: 0.5rem 0 0 0.5rem;
}

table#donatediv
{
    padding: 0 0.2rem;
}

.tag_add form input[type="button"]
{
    margin: 0;
    width: 2rem;
}

#tag_container
{
    padding-bottom: 0.5rem;
}

#details_top #collages
{
    border-radius: 0.5rem;
    overflow: hidden;
}

#searchbars
{
    padding: 0;
    height: unset;
    margin: 1rem 0;
}


#inbox div.box
{
    background: var(--bright);
}

#footer,
#footer p a,
#footer p a:visited
{
    color: var(--text2);
    text-shadow: var(--shadow);
}

.torrentdetails table.reported tr:nth-child(2n)
{
    background: unset;
}

#upload #content #upload_table > table
{
    background: var(--bright);
    border-radius: 0.5rem;
}

.postbody
{
    color: var(--text2);
}

#iplinkeddiv tr:hover,
#reportsdiv tr:hover,
#staffpmsdiv tr:hover,
.torrent_table table tr:hover td,
body#tools tr.rowa:hover,
body#tools tr.rowb:hover,
body#staffpm tr.rowa:hover,
body#staffpm tr.rowb:hover
{
    background: none;
    transition: none;
}
/*
code.bbcode
{
    padding: 10;
}
*/

div[id^="editcont"] table.bb_holder
{
    margin: 0.5rem;
}
div[id^="preview"]
{
    padding: 1rem;
}

/*
table.forum_list .sticky + :not(.sticky)
{

}
*/

table.forum_list tr.rowa.sticky td,
table.forum_list tr.rowb.sticky td
{
    background: var(--colhead);
}

/*
table.forum_list .sticky td
{
    border-bottom: 1px solid #80808020;
    border-top: 1px solid #80808020;
    box-sizing: border-box;
}

table.forum_list .sticky td:first-child
{
    border-left: 1px solid #80808020;
}

table.forum_list .sticky td:last-child
{
    border-right: 1px solid #80808020;
}
*/

table.forum_list tr.rowa.sticky td:first-child,
table.forum_list tr.rowb.sticky td:first-child
{
    /*background: var(--blue);*/
    /*box-shadow: var(--blue) 3px 0 0 inset;*/
    /*background: linear-gradient(90deg, var(--blue) 5px, var(--bright) 5px);*/
}
/*
table.forum_list tr.sticky .font_icon.forum_icons
{
    -webkit-text-stroke-color: var(--bright);
}
*/

.uploadbody #taginput
{
    width: 97%;
    resize: vertical;
    min-height: 10rem;
}
table.bbcode
{
    border-collapse: collapse;
}

.breadcrumbs
{
    color: var(--text2);
}

/* forum post jump to top arrow */
/* not working */
/* broken ??? */
tr.smallhead a:visited
{
    color: unset;
}

form:not(#search_form) .box,
.box .box,
#collage #content .box form
{
    box-shadow: none !important;
}

select
{
    box-shadow: var(--shadow) inset;
}

#search_form .box.pad,
table.forum_post.box,
form#userform,
#torrent_table,
#request_table,
#bookmarks .torrent_grid, #collage .torrent_grid
{
    box-shadow: var(--shadow);
    border-radius: 0.5rem;
}

#inbox .user_name
{
    background:none;
}

/*----------------------------------------HEADER-GRID----------------------------------------*/

#header #header_top
{
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-rows: auto auto auto;

    grid-template-areas: 'logo . stats' 'menu menu menu' 'search search search' 'alerts alerts alerts';
    row-gap: 0.2rem;
    margin-top: 1rem;
}


@media screen and (min-width: 1400px) {
    #header #header_top
    {
        grid-template-areas: 'logo menu stats' 'search search search' 'alerts alerts alerts';
    }
}


#header #header_top #logo,
#header #header_top #stats_block,
#header #header_top #searchbars,
#header #header_top #menu,
#header #alerts
{
    margin: 0;
    padding: 0;
    position: static;
    box-sizing:border-box;
}

#header #header_top #logo
{
    /*
    grid-column: 3;
    grid-row: 3;
    */
    grid-area: logo;
    /*margin-left: 1rem;*/
    filter: drop-shadow(var(--shadow));
    height: 5rem;
    width: 20rem;
}

#header #header_top #stats_block
{
    /*
    grid-column: 1;
    grid-row: 3;
    */
    grid-area: stats;
    /*
    background: var(--header);
    padding: 0.5rem;
    border-radius: 0.5rem;
    box-shadow: var(--shadow);
    */
    height: 5rem;
}

#header #header_top #searchbars
{
    /*
    grid-column: 1 / span 3;
    grid-row: 2;
    */
    grid-area: search;
    padding: 0.3rem 0.3rem;
    box-shadow: var(--shadow);
}

#header #header_top #searchbars ul
{
    display: flex;
    justify-content: center;
    gap: 0.3rem;
}

#header #header_top #searchbars ul li,
#header #header_top #searchbars ul li form
{
    display: block;
    margin: 0;
    padding: 0;
}

#header #header_top #searchbars .searchcontainer
{
    width: 100%;
    display: block;
    border-radius: 0.2rem;
}

#header #header_top #menu
{
    /*
    grid-column: 1 / span 3;
    grid-row: 1;
    */
    grid-area: menu;
    margin: 0.5rem 0;
    /* background: var(--medium); */
    display: flex;
    align-items: flex-end;
    /*align-items: center;*/
    justify-content: center;
}

#header #header_top #alerts
{
    /*
    grid-column: 2;
    grid-row: 3;
    */
    grid-area: alerts;
    /*padding-bottom: 1rem;*/
    max-width: unset;
    width: unset;
    display: grid;
}

#header #header_top #alerts .alertbar
{
    width: 50%;
    max-width: 50rem;
    /*margin: 0.5rem auto;*/
    margin: 0 auto 0.2rem auto;
}

#header #header_bottom,
#header #header_top #searchbars
{
    border-radius: 0.5rem;
}

#header #header_bottom
{
    padding-left: 0;
    padding-right: 0;
}

#header #header_bottom
{
    height: 3rem;
}


#header #header_bottom #major_stats
{
    padding: 0 0.5rem 0 0;
}

#header #header_bottom #major_stats > ul > li:not(#nav_userinfo) a,
#header #header_bottom #major_stats > div,
#header #header_bottom #major_stats_left ul li
{
    margin-top: 0.3rem;
    margin-bottom: 0.3rem;
}

#header > #header_bottom > #major_stats > #userinfo_username > #nav_userinfo > a
{
    padding: 0.5rem 0 !important;
}

/*----------------------------------------STUFF----------------------------------------*/

#tags .tag_results .colhead td
{
    background: var(--colhead);
}

#content > .thin > h2
{
    margin: 0 0 2rem 0;
    box-shadow: var(--shadow);
}

.box .colhead td,
#userform .colhead td
{
    background: none;
}

body:not(#torrents,#user) #content .thin > form > table,
#searchforum
{
    background: var(--bright);
    box-shadow: var(--shadow);
    border-radius: 0.5rem;
}

#content .thin > table > tbody > tr.rowa,
#content .thin > table > tbody > tr.rowb
{
    background: none;
}

#content .thin > table > tbody > tr.rowa > td,
#content .thin > table > tbody > tr.rowb > td
{
    background: var(--dark);
}

#content .thin > table > tbody > tr.rowa.sticky > td,
#content .thin > table > tbody > tr.rowb.sticky > td
{
    background: var(--colhead);
}

#content .thin > table:not([id^="post"]) > tbody > tr > td:first-child
{
    border-top-left-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
}

#content .thin > table:not([id^="post"]) > tbody > tr > td:last-child
{
    border-top-right-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
}

div#donatediv table
{
    width: 60rem !important;
}

.torrent_grid
{
    grid-template-columns: repeat(auto-fit, minmax(20rem, 0.333fr));
}

.torrent__info_extra .icon
{
    width: 2rem;
}

.torrent__size,
.torrent_grid__torrent__info
{
    font-size: 1.2rem;
    line-height: 2rem;
}

.torrent_grid__torrent__cat
{
    font-size: 1.4rem;
}

#coverimage > img
{
    display: block;
    margin: auto;
}

#collage #content .thin > table > tbody > tr:not(.colhead) > td
{
    background: var(--dark);
}

#collage #content .thin > table > tbody > tr:not(.colhead) > td:first-of-type
{
    border-radius: 0.5rem 0 0 0.5rem;
}


#collage #content .thin > table > tbody > tr:not(.colhead) > td:last-child
{
    border-radius: 0 0.5rem 0.5rem 0;
}

#details_top div.sidebar
{
    width: 100%;
    grid-row: 2;
}

#content .details.thin #details_top
{
    display: grid;
}

#content .details.thin #details_top .middle_column
{
    grid-row: 1;
    margin: 0;
}

#details_top div.sidebar
{
    display: grid;
    grid-template-columns: 30rem 1fr;
    column-gap: 2rem;
}

#details_top div.sidebar .head
{
    grid-row: 1;
}

#details_top div.sidebar #coverimage
{
    grid-column: 1;
    grid-row: 2;
    height: auto;
}

#details_top div.sidebar #tag_container
{
    grid-column: 2;
    grid-row: 2;
    padding: 1rem;
    box-sizing: border-box;
}

#details_top div.sidebar #tag_container .tag_header
{
    text-align: left;
    padding: 0 0 1rem 0;
}

#details_top div.sidebar #tag_container .tag_add,
#details_top div.sidebar #tag_container #torrent_tags,
#details_top div.sidebar #tag_container ul#torrent_tags_list
{
    /* float: left; */
    padding: 0;
}

#details_top div.sidebar #tag_container ul#torrent_tags_list
{
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(30rem, 0.25fr));
}

#details_top div.sidebar #tag_container #taginput
{
    height: 20px;
    padding-top: 0;
    padding-bottom: 0;
}

ul#torrent_tags_list > li
{
    /*width: 30rem;*/
    float: left;
    margin-left: 0;
}

/*
ul#torrent_tags_list > li > div
{
    float: left !important;
    line-height: 2.2rem;
}
*/

/*----------STATS-BLOCK----------*/

#header #header_top #stats_block table tbody
{
    display: grid;
    grid-template-columns: repeat(3,auto);
    column-gap: 1rem;
}

#header #header_top #stats_block table tbody tr
{
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: 2rem 2rem;
    line-height: 2rem;
}

#header #header_top #stats_block table tbody > tr > td[colspan="2"]
{
    grid-column: span 2;
}

`;
    const modern = `
/*----------------------------------------------------------------------------------------------------MODERN----------------------------------------------------------------------------------------------------*/

/* Layout (Torrents page) */

.cats_col { padding: 0; }
.category { width: 2.8rem; height: 2.8rem; margin: 0; padding: 0; }

/* Global */
* {
    padding: 0;
    margin: 0;
    outline: 0pt none;
}

:focus {
    outline: 0pt none;
}
html {
    width: 100%;
    height: 100%;
}


body {
    position: relative;
    width: 100%;
    height: 100%;
    background: #1A2844;
    background-size: cover;
    font: normal 11pt "Lucida Grande", Helvetica, Arial, Verdana, sans-serif;
    font-weight: normal;
    color: #000000;
}

#logo {
    width: 18rem;
    height: 4rem;
    /*background: url('https://www.empornium.sx/static/styles/modern/images/logo.svg') no-repeat center center;
    background-size: 175px;*/
    position: absolute;
    margin-top:-3rem;
    top:50%;
    margin-left:-9rem;
    left: 10%;
    -webkit-filter: drop-shadow( -0.5rem 0.5rem 0.5rem #000 );
    filter: drop-shadow( -0.5rem 0.5rem 0.5rem #000 );
}
#logo a {
    border: none;
    width: 100%;
    height: 100%;
    display: block;
}
#logo::after {
    width: 94%;
    margin: -1.4rem 0 0 1rem;
    text-align:center;
    font-size:0.7em;
    color:#CAEBF9;
    display: none;
}


/* Common elements */

a , .torrent_table .linkbox a {
    color:#004DC0;
    text-decoration: none;
    border: none;
}
a:visited, .torrent_table .linkbox a:visited {
    color:#250855;
}
a:hover, .torrent_table .linkbox a:hover {
    color: #FF4400;
    text-decoration: underline;
}

tr.smallhead a, .cat_list a, tr.smallhead a:visited, .cat_list a:visited {
    color:#023174;
}

.linkbox {
    color: #ddd;
}
.linkbox a, .breadcrumbs a {
    color: #fff;
    text-decoration: none;
}

.linkbox a:hover, .breadcrumbs a:hover, .colhead a:hover {
    text-decoration: underline;
}
.linkbox a:visited, .breadcrumbs a:visited, .colhead a:visited {
    color: #ddd;
}

.linkbox table strong {
    color: #000;
}
.breadcrumbs {
    color: #ddd;
}
h1,h2,h3,h4 {
    margin: 0.5rem 0;
    color: #666;
}
div div div div h3, div div div h4 {
    color: #222;
}
.box h3, .box h4 {
    color: #000;
}

h2 {
    text-align: center;
}

h2 a,
h2 a:visited
{
    color: var(--text) !important;
    font-weight: bold;
}

h4 {
    font-size: 1.2rem;
}

p {
    margin: 1rem 0.5rem;
}

li {
    margin: 1px 1.5rem 0.3rem 1.5rem;
}

input {
    padding: 0.2rem 0.3rem;
    background-color: #FCFCFC;
    background: #f5f8fc;
    background: -webkit-linear-gradient(#fcfcfc,#f5f8fc);
    background: linear-gradient(#fcfcfc,#f5f8fc);
    color: black;
}

textarea {
    padding: 0.2rem 0.3rem;
    background-color: #FCFCFC;
    background: #f5f8fc;
    background: -webkit-linear-gradient(#fcfcfc,#f5f8fc);
    background: linear-gradient(#fcfcfc,#f5f8fc);
    color: black;
}
input[type=text]:read-only {
    background-color: #eee;
    color: #777;
}
input[type=text]:-moz-read-only {
    background-color: #eee;
    color: #777;
}
img {
    border: none;
}

select {
    padding:0 0 0 1px;
    background:white;
    color: #000000;
}

ul.thin { margin:0 0 0 2.5rem; padding:0; }
ul.thin li { margin:0 0; padding:0; }

/* Layout (Every page) */

#adbar {
    text-align: center;
    margin:2rem auto -1rem;
}

#header {
    /* width: 100%; */
    margin: 0 4rem;
    min-width:96rem;
    padding: 0;
    background-color: rgb(22, 29, 41); /* ie fallback */
    background-color: rgba(22, 29, 41, 0.50);
    font-weight: normal;

}

#content {
    background: #334B7B;  /* ie fallback */
    background: rgba(90, 120, 190, 0.3);
    box-shadow: 0 0.3rem 3rem -0.5rem black;
    border: 1px solid rgba(30,60,120,.5);
    border-radius: 1.4rem 1.4rem 0 0;
    overflow: unset;
}

#modal_content {
    width: 90%;
    min-width: 35rem;
    max-width: 130rem;
    background: #334B7B;  /* ie fallback */
    box-shadow: 0 0.3rem 3rem -0.5rem black;
    margin: 0 auto 0 auto;
    border: 1px solid rgba(30,60,120,.5);
    padding: 0 0 1.5rem;
    border-radius: 1.4rem 1.4rem 0 0;
}

#schedule #content {
    color:#eee;
}
#schedule #content {
    color:#eee;
}

#footer {
    margin-top: 5rem;
    width: 100%;
    text-align: center;
    color: #eee;
    font-size: 0.8em;
}
#footer p a, #footer p a:visited {
    color: #eee;
}

#header_top {
    position: relative;
    border-bottom: 1px solid rgba(0,0,0,.3);
}

#menu {
    margin: 0 24.5rem;
    text-align: center;
    padding-top: 1.2rem;
    font-size: 1.2em;
}

#menu ul {
    position: relative;
    z-index: 1;
    white-space:nowrap;
    display: inline-block;
}

#menu ul li {
    margin: 0;
    display: inline;
    margin-top: 0.3em;
}

#menu ul li a {
    padding: 0.2rem 0.6rem;
}

#menu a, #modbar a {
    color: #edfaff;
    font-weight: bold;
    border-radius: 0.4rem;
    transition: background-color 600ms;
    -webkit-transition: background-color 600ms;
}

#menu a:hover {
    background-color: #5C7CBC;
    color: #fff;
    text-decoration: none;
    transition: background-color 300ms;
    -webkit-transition: background-color 300ms;
}

span.infinity {
    font-weight: bold;
}
#stats_block {
    text-align: right;
    color: #ddd;
    height: 4rem;
    position:absolute;
    right: 2rem;
    margin-top:-3rem;
    top:60%;
    font-size: 0.9em;
}

table.userinfo_stats, table.userinfo_stats tr, #staff table.userinfo_stats {
    background:none;
    background-color:transparent;
    border:none;
}
table.userinfo_stats td {
    padding:0 0.3rem;
}

span.inside_stat {
    display: block;
}
#stats_block ul li {
    margin: 0 0.1em;
    line-height: 1.8rem;
    padding: 0;
    display: inline-block;
    width:12rem;
    text-align:left;
}
#stats_block a, #stats_block a:visited {
    text-decoration: none;
    color: #86baf0;
}
#stats_block a:hover, #header_bottom a:hover {
    text-decoration: none;
    color: #FF6600;
}

#header_bottom ul li {
    margin: 0 0.1em;
    padding: 0;
    display:inline;
    line-height:1.8rem;
}

#header_bottom ul li ul li {
    white-space: nowrap;
    line-height: 0;
    display: block;
}

#header_bottom a, #header_bottom a:visited {
    text-decoration: none;
    color: #d2d2d2;
}

#header_bottom {
    padding: 0.2rem 2rem 0.6rem;
    position: relative;
    height: 1.5rem;
    border-top: 1px solid rgb(32, 39, 51);  /* ie fallback */
    border-top: 1px solid rgba(180,190,200,.09);
}

#nav_userinfo > ul > .nav_icons {
    padding-right: 0.4rem;
}
#major_stats_left {
    position: absolute;
}
#major_stats {
    float:right;
}

#major_stats_left > ul > li > a, #major_stats > ul > li > a {
    display: inline-block;
    padding: 1px 0.2rem 1px 0.6rem;
    margin-top:-1px;
    background-position: 0.3rem center;
    background-size: 1.6rem;
    background-repeat: no-repeat;
    border-radius: 0.4rem;       /* FF9+ IE9+ */
    transition: background-color 600ms;
    -webkit-transition: background-color 600ms;
}

#major_stats a:hover, #major_stats_left a:hover {
    background-color:#5C7CBC;
    color:#F3F3F3;
}

#userinfo_username, #userinfo_tools, #userinfo_invites {
    display:inline;
    position: relative;
}

li#nav_userinfo, #userinfo_tools{
    padding-bottom:0.6rem !important;
}
#userinfo_username li ul, #userinfo_tools li ul {
    list-style: none;
    visibility: hidden;
    position: absolute;
    left: 1px;
    top: 2rem;
    background-color: rgb(33,48,79);
    opacity: 0;
    z-index: 10;
    border: 0.5px solid rgb(30, 40, 70);
    box-shadow: 1px 1px 1.2rem -0.2rem rgba(0,0,0,.5);
    transform-origin: 0% 0%;
    transform: scaleY(0.2);
    transition: opacity ease-in 150ms, visibility 150ms, transform ease-in 150ms;
    -webkit-transform-origin: 0% 0%;
    -webkit-transform: scaleY(0.2);
    -webkit-transition: opacity ease-in 150ms, visibility 150ms, -webkit-transform ease-in 150ms;
}
#userinfo_username li ul {
    left: -5.4rem;
    min-width: 14rem;
}
li#nav_userinfo:hover ul, #userinfo_tools:hover li ul {
    visibility: visible;
    opacity: 1;
    transform: scaleY(1.0);
    transition: opacity ease-out 250ms 100ms, transform ease-out 250ms 100ms;
    -webkit-transform: scaleY(1.0);
    -webkit-transition: opacity ease-out 250ms 100ms, -webkit-transform ease-out 250ms 100ms;
}
#userinfo_username li ul a, #userinfo_tools li ul a {
    display: block;
    border-top: 1px solid rgb(42, 57, 88);
    border-bottom: 1px solid rgb(25, 35, 65);
}
#userinfo_username li ul li a {
    padding: 0.4rem 0.6rem 0.4rem 0.6rem;
    line-height:1.9rem;
    background-position: 0.5rem center;
    background-repeat: no-repeat;
    transition: background-color 300ms;
    -webkit-transition: background-color 300ms;
}
#userinfo_tools li ul li a {
    padding: 0.2rem 0.6rem 0.2rem 0.6rem;
    line-height:1.7rem;
}
#userinfo_username li ul li:first-child a, #userinfo_tools li ul li:first-child a  {
    border-top:none;
}
#userinfo_username li ul li:last-child a, #userinfo_tools li ul li:last-child a {
    border-bottom:none;
}
#userinfo_username li ul li a:hover, #userinfo_tools li ul li a:hover {
    background-color:#5C7CBC;
    background-size: 1.6rem;
    color:#F3F3F3;
    transition: background-color 0s;
    -webkit-transition: background-color 0s;
}
#userinfo_username li ul li a:hover > .nav_icons, #userinfo_tools li ul li a:hover > .nav_icons {
    color: #F3F3F3;
}

#nav_tools > a:after, #nav_userinfo > a:after {
    content:" \\25BC";
    line-height:0;
    font-size:1.1rem;
    font-weight: bold;
    vertical-align:-0.2rem;
}
#nav_usertools,#nav_upload,#nav_donate,#nav_userinfo,#nav_useredit,#nav_conncheck {
    margin-left:0.3rem !important;
}

#userinfo_major {
    display:inline;
    margin-right: 0;
}

#userinfo_minor {
    display:inline;
}
span.stat {
    font-weight: bold;
}
.highlight {
    font-weight: bold;
}
.normal {
    font-weight:normal;
}

#searchbars {
    padding: 0.6rem 0 0 0;
    background-position: bottom;
    text-align: center;
    height: 3rem;
}

#searchbars form {
    display: inline;
}

#searchbars .searchcontainer {
    display:inline-block;
    background-color: rgba(110,140,180,.2);
    border: 1px solid rgb(110,140,180); /* ie fallback */
    border: 1px solid rgba(110,140,180,.3);
    position: relative;
    width:10%;
    min-width: 11rem;
    border-radius: 0.6rem;
    font-size: 0.8em;
    color: #999;
    white-space: nowrap;
}

#searchbars input.searchbox {
    background: transparent;
    border: 0;
    margin: 0 auto 0 0 ;
    padding:0;
    color: #bcd;
    position: relative;
    width:84%;
    border-radius: 0.5rem 0 0 0.5rem;       /* FF9+ IE9+ */
}

#searchbars .searchbutton {
    background: rgba(110,140,180,0) no-repeat right center;
    font-size: 0.8em;
    vertical-align: middle;
    border: none;
    box-shadow: none;
    margin: 0 0 0 auto;
    padding:0;
    width:1.3rem;
    height:1.3rem;
    cursor: pointer;
    border-radius: 0.5rem;
}

#searchbars ul {
    display: block;
}

#searchbars ul li {
    margin: 0;
    display: inline;
    list-style: none;
    position: relative;
}

#searchbars ul li ul {
    display: block;
    position: absolute;
    top: 1em;
    left: 0;
    border: 1px solid #98AAB1;
    background: #F4F6FB;
    width: 12em;
}

#searchbars ul li ul li {
    margin: 0 0 0 0;
    padding: 0;
    display: block;
    width: 100%;
    text-align: left;
}

#searchbars ul li ul li.highlight {
    background: #C6D3E4;
}

li.searchbars {
    font-size: 1.1rem;
    float: left;
    margin: 1.6rem 0 1.2rem 2.5rem;
}


#alerts {
    margin: 0 auto;
    text-align: center;
    max-width: 70rem;
    width:50%;
}

.alertbar {
    min-height: 1.6rem;
    padding: 0.2rem 2rem 0.2rem;
    background-color: #e00;
    text-align: center;
    font-weight: bold;
    color: white;
    margin: 0.4rem auto;
    border-radius: 1rem;       /* FF9+ IE9+ */
    animation: alertani 500ms linear 0s 10 alternate;
    -webkit-animation: alertani 500ms linear 0s 10 alternate;
    background-image: linear-gradient(rgba(0,0,0,0) 0%, rgba(10,0,0,0.4) 100%);
    background-image: -webkit-linear-gradient(rgba(0,0,0,0) 0%, rgba(10,0,0,0.4) 100%);
    background-color: #f22;
}

@keyframes alertani {
    100% {
        background-image: linear-gradient(rgba(0,0,0,0) 0%, rgba(10,0,0,0.2) 100%);
        background-image: -webkit-linear-gradient(rgba(0,0,0,0) 0%, rgba(10,0,0,0.2) 100%);
        background-color: #e93;
    }
}
@-webkit-keyframes alertani {
    100% {
        background-image: linear-gradient(rgba(250,0,0,0) 0%, rgba(210,220,0,0.8) 100%);
        background-image: -webkit-linear-gradient(rgba(250,0,0,0) 0%, rgba(210,220,0,0.8) 100%);
        background-color: #e93;
    }
}

#modbar.alertbar {
    animation: none;
    background: none;
}

.alertbar a {
    text-decoration: none;
    color: white;
}
.alertbar a:hover {
    text-decoration: none;
}

.blend {
    padding: 0.2rem 1rem 0.2rem;
    background-color: transparent;
    color: white;
}
.blend a {
    color: white;
    padding: 0.2rem 0.2rem;
}
.blend a:hover {
    color: white;
    text-decoration: none;
    background-color: #5C7CBC;
    border-radius: 0.3rem;
}

.bluebar {
    padding: 0.2rem 2rem 0.2rem;
    background-color: #003875;
    color: white;
}
.bluebar a {
    color: white;
    padding: 0.2rem 0.2rem;
}
.bluebar a:hover {
    color: white;
    text-decoration: none;
}

.nicebar {
    font-weight:normal;
    color: white;
    position: relative;
    border-radius: 1rem;       /* FF9+ IE9+ */
    -webkit-border-radius: 1rem; /* for opera */
    padding: 0.3rem 1rem 1px;
    text-align: center;
    height: 1.9rem;
    margin-top:-0.2rem;
    left: 50%;
    transform: translate(-50%);
    -webkit-transform: translate(-50%);
    animation: nicebar 300ms linear 1s 10 alternate;
    -webkit-animation: nicebar 300ms linear 1s 10 alternate;
    background-image: linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,50,0.6) 100%);
    background-image: -webkit-linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,50,0.6) 100%);
    background-color: #64ACDA;
}
@keyframes nicebar { 100% { background-color: cyan; }}
@-webkit-keyframes nicebar { 100% { background-color: cyan; }}

/* Compose Staff Message form */
#compose {
    margin: 2rem auto;
}

/* user classes */
.user_name {
    font-weight: normal;
    background-color:#545C66; /*#e3eefd;*/
    border: 1px solid #6A747E;
    border-radius: 0.8rem;
    padding: 1px 0.8rem;
    margin: 0;
    color: #bbb;
    display: inline-block;
    vertical-align: middle;
}

span.user_name a {
    color: #000;
}
span.user_name a:visited {
    color: #000;
}
.rank {  /* rank applies to all the following styles */
    font-weight: bold;
}
.Apprentice { color:#92a5c2; }
.Perv { color:#4Ec89B; }
.GoodPerv { color:#3c3; }
.SextremePerv { color:orange; }
.SmutPeddler { color:#00f; }
.EmpLegend { color:#CFB53B; }
.ModPerv { color:#000; }
.Admin { color:#606; }
.Sysop { color:#00ff00; }
.Donor { color:#DAA520; }

span.user_title {
    font-style: italic;
}

/* IE doesn't appear to like a simple display:none in our header. Random things start fucking up pretty badly. */
.hidden {
    position: absolute;
    left: -1000rem;
}

input.hidden {
    position: absolute;
    display: none;
}

/* Layout (Any page) */

.thin {
    width: 96%;
    margin-left:auto;
    margin-right:auto;
}

.thin > h2 {
    margin: 1rem -2.1% 2rem;
}
.thin > h2:first-child {
    margin: 0 -2.07% 2rem;
    border-radius: 1.3rem 1.3rem 0 0;
}

.thin > .linkbox:first-child {
    margin-top: 1rem;
}

.thin > .head:first-child {
    margin: 2rem 0 0;
}

.thin > p {
    color: #fff;
}

h2 {
    margin: 1rem 0 2rem;
    text-align: center;
    color: #def;
    border-radius: 0.5rem;
    background: #2D426D; /* ie fallback */
    background: linear-gradient(rgba(255, 255, 255, 0.1) 0%, rgba(71, 71, 71, 0.1) 40%, rgba(0, 0, 0, 0.13) 90%, rgba(0, 0, 0, 0.1) 100%);
    background: -webkit-linear-gradient(rgba(255, 255, 255, 0.1) 0%, rgba(71, 71, 71, 0.1) 40%, rgba(0, 0, 0, 0.13) 90%, rgba(0, 0, 0, 0.1) 100%);
    font-size: 1.8rem;
    padding: 0.3rem 4rem 0.7rem 4rem;
}

h2 a {
    color: #ddd;
}
h2 a:visited {
    color: #ccc;
}

.box h2 {
    padding: 0.3rem 4rem;
    font-size: 1.4rem;
    border-radius: 0.8rem;
    background-image: none;
    background-color: #9CB7D2;
    font-weight: bold;
    color: #555;
    box-shadow:none;
}


.contact_link {
    display: inline;
    padding: 0.5rem;
    margin: 0 2rem 0 1rem;
    font-weight: bold;
    background-color: #d00;
    border: 1px solid #005488;
    border-radius: 0.6rem;
}

a.contact_link {
    color: white;
    text-decoration: underline;
}
a.contact_link:hover {
    text-decoration: none;
}


div.linkbox {
    text-align:center;
    padding: 0.5rem;
}

.center {
    text-align: center;
}

.right {
    text-align: right;
}

.medium {
    text-align: left;
    width: 86%;
}

.long {
    text-align: left;
    width: 97%;
}

.wid35 {
    width: 35%;
}
.min_padding {
    padding: 0;
    margin: 0 0;
}

p.min_padding {
    margin: 0.2rem 0;
}

.pad {
    padding: 1rem;
}

.vertical_space {
    margin-bottom: 1rem;
}

.vertical_space_small {
    height: 0.5rem;
}

.box {
    margin: 0;
    font-size: 1.2rem;
    background-color: #FCFCFC;
    /*border-radius: 0 0 2px 2px;*/
}
.box .box {
    border: 1px solid #ccc;
    /*width: auto;*/
}

.pad h3, .pad h4, .padbox h3, .padbox h4 {
    margin-top: 0;
    padding-top: 0;
}


#details_top {
    margin-bottom: 1rem;
}
.top_info {
    display:inline-table;
    margin:1.6rem auto 1.6rem;
    border: 1px solid #7BA3C1;
    padding:0 0.8rem 0 0.8rem;
    background: white;
    border-radius: 0.9rem;
    white-space: nowrap;
    z-index: 1;
}
.sticky_top_info {
    top: -1.6rem;
    position: fixed;
    left: 50%;
    transform: translate(-50%);
}
table.boxstat {
    border:none;
    color: #000;
}
table.boxstat td {
    padding: 0.3rem 0.6rem;
    border-top:none;
    border-right: none;
    border-left:1px solid #7BA3C1;
    border-bottom:none;
    background: white;
    text-align:center;
    vertical-align:middle;
}
table.boxstat td:first-child {
    border-left:none;
}
table.boxstat a, table.boxstat a:visited {
    color: #445;
}
.button.toggle {
    width: 8rem;
    margin: 0.6rem 0 0 0.8rem;
    padding: 0.4rem 1.2rem;
    border: 1px solid #7BA3C1;
    color: #fff;
    cursor: pointer;
    vertical-align: top;
}

#user_message .button {
    margin: 0 0 0.8rem 0.8rem;
    padding: 0.4rem 1.2rem;
    vertical-align: middle;
}

#staff_tools, #warning_status {
    margin-bottom: 1.5rem;
}


.warning {
    font-size: 1.8rem;
    font-weight: bold;
    text-align: center;
    padding: 0.4rem 0;
}

.greybar {
    background: #aaa;
    color: white;
    font-weight: bolder;
}

.redbar {
    background: #A4913C;
    color: white;
}
.orangebar {
    background: #FF9900;
    color: white;
    font-weight: bolder;
}
.redbar a, .orangebar a {
    color: white;
    text-decoration: line-through;
}
.redbar a:hover, .orangebar a:hover {
    text-decoration: underline;
}

.sicon {
    display:inline-block;
    width:1rem;
    height:1.2rem;
    margin-right: 0.3rem;
}

.icon_ducky {
    margin-right: 0.3rem;
    background: url('https://www.empornium.sx/static/styles/modern/images/duck16.png') no-repeat center center;
}


.icon_warning {    background: url('https://www.empornium.sx/static/styles/modern/images/warned.png') no-repeat center center;}
.icon_watched {    background: url('https://www.empornium.sx/static/styles/modern/images/watched.png') no-repeat center center;}

.top_info .icon_warning {    background: url('https://www.empornium.sx/static/styles/modern/images/warning.gif') no-repeat center center;}

#staff_tools .icon {
    width:1.6rem;
    height:1.6rem;
    /*margin-top: -2px;*/
    background-size: 1.6rem 1.6rem;
}

#staff_tools td {
    /* padding: 2px 5px;
     border-bottom: 1px solid #ddd;*/
}

.details {
    width: 96%;
    min-width: 92rem;
    margin-left:auto;
    margin-right:auto;
}
.details div.linkbox {
    text-align: center;
    padding: 0;
    margin: 0;
}

.details .sidebar, #requests .sidebar {
    width: 26rem;
}

.details .middle_column, #requests .middle_column {
    margin: 0 27rem 1rem 0;
}

.middle_column table {
    margin-bottom: 2rem;
}

.middle_column .torrent_table {
    margin-top: 0;
}

.details .main_column, #requests .main_column {
    margin: 0 0 1rem 0;
}

.details .filetypes {
    background-color: #eff3f6;
}

.details .tag_add {
    border-top: 1px solid #98AAB1;
    padding: 0.2rem 1rem 0.2rem 1rem;
}

.tag_warning {
    font-size: 1.4rem;
}

.box_albumart{
    padding: 0.5rem;
    margin: 0;
}

.sidebar .box {
    margin: 0 0.5rem 2rem 0.5rem;
}

.thin .box {
    margin: 0 auto 2rem;
}

.details .box, #requests .box {
    margin: 0;
}


.sticky_post {
    color: #050;
}

.small {
    font-weight: normal;
    font-size: 0.7em;
}

.body {
    padding: 0.3rem 1rem 1rem 1rem;
}

.sidebar {
    float: right;
    width: 28rem;
    height: 100%;
}

.main_column {
    margin: 0 29rem 1rem 0;
}

.main_column .box, .main_column table {
    margin-bottom: 2rem;
}

.tags {
    padding: 0 0 0 2rem;
    font-style: italic;
}
.tags a {
    color: #2859A2;
}
.tags a:hover, .redbar .tags a:hover {
    text-decoration: underline;
}
.tags a:visited {
    color: #250855;
}
.redbar .tags a {
    color: white;
    text-decoration: none;
}
.noborder {
    border: none;
}

ul.nobullet {
    list-style-type: none;
}


span.red {
    font-weight: bold;
    color: red;
}
span.green {
    font-weight: bold;
    color: green;
}
span.grey {
    font-weight: bold;
    color: darkgrey;
}


table {
    width: 100%;
    border-collapse: collapse;
}

tr {
    background-color: #FCFCFC;
}

tr.rowa, .rowa {
    background-color: #eff3f6;
}
tr.rowb, .rowb {
    background-color: white;
}
tr.rowa.sticky {
    background-color: #C8D6E0;
}
tr.rowb.sticky {
    background-color: #D3DEE7;
}
#dnulist tr:nth-child(odd), #whitelist tr:nth-child(odd) {
    background-color:#eff3f6;
}

#iplinkeddiv tr,
#reportsdiv tr,
#staffpmsdiv tr,
.torrent_table table tr td,
body#tools tr.rowa,
body#tools tr.rowb,
body#staffpm tr.rowa,
body#staffpm tr.rowb { /*instant change*/
    transition: none;
    -webkit-transition: none;
}
#iplinkeddiv tr:hover,
#reportsdiv tr:hover,
#staffpmsdiv tr:hover,
.torrent_table table tr:hover td,
body#tools tr.rowa:hover,
body#tools tr.rowb:hover,
body#staffpm tr.rowa:hover,
body#staffpm tr.rowb:hover {
    background-color: #DADADA;
    transition: none;
    -webkit-transition: none;
}

table.forum_list tr td { /*faster change*/
    transition: background-color .5s;
    -webkit-transition: background-color .5s;
}
.forum_list tr.rowa:hover td,
.forum_list tr.rowb:hover td {
    background-color: #DADADA;
    transition: background-color .7s .2s;
    -webkit-transition: background-color .7s .2s;
}

/*tr.rowa, .rowa, tr.rowb, .rowb,*/
tr.torrent.rowa, tr.torrent.rowb { /*slower change*/
    transition: background-color 1s;
    -webkit-transition: background-color 1s;
}
/*tr.rowa:hover, .rowa:hover, tr.rowb:hover, .rowb:hover,*/
tr.torrent.rowa:hover, tr.torrent.rowb:hover {
    background-color: #DADADA;
    transition: background-color 1s 1s;
    -webkit-transition: background-color 1s 1s;
}

td {
    padding: 0.3rem 0.5rem;
    text-align: left;
}

table.wid740 {
    margin: auto;
    width: 74rem;
    border-collapse: collapse;
    border: 1px solid #0d245a;
}

.label {
    background-color: #eff3f6;
    border:none;
    font-weight: bold;
    text-align: right;
    width: 20rem;
}
tr#recentuploads td{
    background-color:white;
}

table.staff {
    border: 1px solid #dde;
}

#staff table {
    border: 1px solid #dde;
}
/* Bonus Shop */

tr.itembuy { background: #CBE1CB; background: linear-gradient(white 0%,#BAD7B8 0.4rem, #D2E6D1 100%); }
tr.itemnotbuy { background: #DCC7C9; background: linear-gradient(white 0%,#D3B9BA 0.4rem, #E4D3D3 100%); }
tr.itemduplicate { background: #D4D4D4; background: linear-gradient(white 0%,#C5C5C5 0.4rem, #DBDBDB 100%); }

.shopbutton {
    width: 6rem;
    background-color: white;
    padding: 0.2rem 1rem 0.2rem;
    border: 0.2rem solid;
    border-color: #1a1;
    color: #292;
}
input.shopbutton.itembuy {
    border-color: #1a1;
    color: #cfc;
    font-weight:bold;
}
input.shopbutton.itembuy:hover {
    border-color: #6f6;
}
.bonusshop td {
    padding: 0.4rem;
}
.itemnotbuy input.shopbutton, input.itemnotbuy {
    border: 1px solid #944;
    color: #fcc;
}
.itemnotbuy input.shopbutton:hover {
    background: linear-gradient(#8993AF, #606C90) repeat scroll 0% 0% transparent; /* don't change bg on hover */
}

tr.colhead_dark td {
    background-color: #7393b3;
    color: #fff;
}

tr.smallhead {
    background-color: #67737E;
    /*background: -webkit-linear-gradient(10deg,rgba(90,100,110,.8) 50%,rgba(70,120,130,0.8) 70%,rgba(65,75,85,.7) 80%);
    background: linear-gradient(170deg,rgba(90,100,110,.8) 50%,rgba(70,120,130,0.8) 65%,rgba(65,75,85,.7) 80%);*/
    color: #def;
}

tr.smallhead a:link, tr.smallhead button {
    all: unset;
    cursor: pointer;
    color: #ddd;
}

tr.smallhead a:visited {
    color: #bbb;
}

tr.smallhead a:hover {
    color: #eee;
}

tr.smallhead a:active {
    color: #334b7b;
}

.colhead {
    background-color: #9CB7D2;
    /* background: linear-gradient(170deg,rgba(170,200,230,.8) 60%,rgba(200,220,250,0.8) 70%,rgba(160,190,230,.8) 80%); doesnt work in chrome */
    font-weight: bold;
    color: #333;
}

.colhead a, .colhead a:visited {
    color: #333;
}

td.colhead, .colhead td {
    padding-left: 1rem;
    padding-right: 1rem;
}

.colhead .sign, .colhead_dark .colhead_red .sign {
    padding: 0 0.8rem 0 0.8rem;
    vertical-align:middle;
    text-align:center;
    font-size: 1.6rem;
    font-weight: bold;
}

.colhead_dark a {
    font-weight: normal;
}

.colhead_red {
    background-color: red;
    color: #eee;
}

.colhead_red a {
    color: white;
}


.head {
    padding: 0.3rem 1rem 0.3rem 0.3rem;
    height: 2rem;
    background: rgb(50,60,70); /* ie fallback */
    background: rgba(50,60,70,0.5);
    background: -webkit-linear-gradient(10deg,rgba(70,80,90,0.5) 40%,rgba(50,100,100,0.4) 60%,rgba(80,55,100,0.4) 99%);
    background: linear-gradient(170deg,rgba(70,80,90,0.5) 40%,rgba(50,100,100,0.4) 60%,rgba(80,55,100,0.4) 99%);
    border: 1px solid rgba(130,140,150,0.2);
    border-bottom: none;
    border-radius: 0.3rem 1.5rem 0 0;
    color: #def;
    line-height: 2rem;
    font-weight: normal;
}
.sidebar .head {
    background: -webkit-linear-gradient(10deg,rgba(70,80,90,0.5) 40%,rgba(50,100,100,0.4) 80%);
    background: linear-gradient(170deg,rgba(70,80,90,0.5) 40%,rgba(50,100,100,0.4) 80%);
}

.head a {
    color: white;
}

.head+div.box, .colhead+div.box, tr.head, tr#recentuploads, tr#recentsnatches, .head+table, #site_debug ,
.main_column>table, .thin>table, .thin>form>table, #searchforum table, #searchthread table, #messageform .box,
.shadow, .report  {
    box-shadow:inset -1px 1px 0.3rem #293B55;
}

tr.head+tr {
    box-shadow:inset 0 1px 0.3rem #293B55;
}

#upload .cover_image {
    width:26rem;
    margin: 0 auto;
}

#forums .head {
    margin-top: 2rem;
}
div.box.pad.latest_topics {
    text-align:justify;
}

.reports {
    max-width: 110rem;
    margin: 0 auto ;
}
.spacespans span {
    margin-right:2rem;
}

table.slice {
    margin-top: -1px;
}

.error_message {
    border-top: 1px solid #C1965C;
    padding: 0.3rem 0 0.3rem 0;
    background-color: #AF2525;
    text-align: center;
    color: white;
    font-weight: bold;
}

.save_message {
    border: 1px solid #C1965C;
    padding: 0.3rem 0 0.3rem 0;
    background-color: #F4E649;
    text-align: center;
    color: #492802;
    font-weight: bold;
}

.elem_error {
    border: 0.3rem solid #B00D0D;
}

.hide {
    display:none;
}

/* Layout (home page) */
ul.stats {
    padding: 0.5rem 0;
}

ul.stats li {
    padding: 0 0 1px 0;
}

ul.poll li {
    padding: 0 0 0 1rem;
    margin: 0;
    clear: left;
}

ul.poll li.graph {
    margin-bottom: 1.5rem;
    padding-left: 2rem;
}

/* Layout (Torrents page) */
.filter_torrents {
    margin-left:auto;
    margin-right:auto;
    margin-bottom:0;
}
#filter_slidetoggle {
    margin: -1px auto 1.5rem;
    height:2rem;
    text-align: center;
    border: 1px solid #98AAB1;
    padding: 0.6rem;
    font-weight: bold;
    font-size: 1.8rem;
    background-color: #9CB7D2;
    box-shadow:inset 0.2rem 0 1px #6a9bb7;
    border-radius: 0 0 1.2rem 1.2rem;
}

#search_box .box.pad {
    margin-bottom:0;
}

.filter_torrents .submit {
    text-align:right;
    padding-top:0.5rem;
}

.filter_torrents .inputtext {
    width:50rem;
}

.filter_torrents .smaller {
    width:30rem;
}

.filter_torrents .smallish {
    width:30rem;
}

.filter_torrents .smallest {
    width:5rem;
}

.filter_torrents input[type=button], .filter_torrents input[type=submit] {
    width:10rem;
}

.filter_torrents .search_buttons {
    vertical-align:bottom;
}

.filter_torrents .search_buttons span {
    float:right;
    padding:0 1.5rem 1rem 0;
}

.filter_torrents option {
    padding-right:0.8rem;
}

.cat_list {
    margin-top: -1px;
}

.cat_list tr td {
    border:none;
    background-color: #eff3f6;
}
#taglist {
    background-color: #eff3f6;
    font-size:1.1em;
    font-weight: bold;
}
#taglist tr {
    background-color: #eff3f6;
}
#taglist tr:first-child td {
    padding-top:1.5rem;
}
#taglist tr:last-child td {
    padding-bottom:1.5rem;
}
table.cat_list {
    font-size: 1.2rem;
    font-weight: bold;
}
.taglist {
    margin-bottom: 1.5rem;
}
.taglist tr td {
    border:none;
    text-align: center;
}

.select_container {
    margin:0.5rem;
}

.group {
    font-weight:bold;
    background-color:#D7E2EF;
}
.group_torrent {
    background-color: white;
}
.group_torrent span {
    float:right;
}

.torrent {
    font-weight:bold;
    font-size: 1.2rem;
}
.torrent span {
    font-weight:normal;
    float:right;
}
.torrent span.time {
    float:none;
}

.torrentdetails table {
    border: 1px solid #dde;
}
.torrentdetails table tr:nth-child(even) {
    background-color: #eff3f6;
}
.torrentdetails table.reported tr:nth-child(even) {
    background-color: white;
}
.torrent_table table {
    width:98%;
    margin: 1rem;
    font-size: 1.2rem;
    color:#444;
}
.torrent_table tr {
    vertical-align:top;
}
.torrent_table td {
    padding: 0.3rem;
    vertical-align: middle;
}
.torrent_table div.tags {
    font-weight:normal;
}

.torrent_table tr .center {
    vertical-align:middle;
    text-align:center;
}

.torrent_table td .small {
    width:2rem;
}

.torrent_table a img {
    border:none;
}


.torrent_table table .colhead_dark {
    background-image: none;
    background-color: #0261A3;
}

.torrent .user {
    font-weight: normal;
    vertical-align: middle;
    text-align: center;
}

.nobr {
    white-space:nowrap;
}

.advanced_search {
    text-align:right;
    padding-bottom:0.5rem;
}

.unreadnotification {
    border: 0.2rem solid #E2D244;
}

/* Top10 */
.top10 {
    text-align: right;
}
.top10.stat {
    width:1.6rem
}
.top10.statname {
    width:4rem
}
.top10.statlong {
    width:6rem
}

.top10_tags {
    max-width:80rem;
    margin:auto;
}
.head.top10_tags {
    max-width:78.8rem;
}


.tags_rank {
    text-align:center;
    width:20rem;
}
.tags_tag {
    text-align:center;
    width:20rem;
}
.tags_uses {
    text-align:center;
}
.tags_votes {
    text-align:center;
}
.tags_votes_detail {
    width: 4rem;
    text-align:center;
}
.tags_votes_detail2 {
    width: 4rem;
    text-align:left;
}

.total_votes {
    color: #03b;
    text-align:center;
}
.neg_votes {
    color: #911;
    text-align:center;
}
.pos_votes {
    color: #382;
    text-align:center;
}


.friends_table {
    margin-bottom: 1rem;
}


div.tagtable {
    width: 90rem;
    display:block;
    margin: 0 auto;
}
.tagtable {
    border:none;
    margin: 0 auto;
}
.syntable {
    border:none;
    width: 22rem;
    margin-bottom: 0.5rem;
    text-align: center;
}

.tagtable td {
    width: 8rem;
    border: none;
    text-align: center;
}

/* Layout (Forums) */

.last_post {width: 1.5rem; height: 1.5rem; background: url(https://www.empornium.sx/static/styles/modern/images/go_last_read.png) no-repeat center center; margin-left: 0.5rem;}
.last_read {width: 1.5rem; height: 1.5rem; background: url(https://www.empornium.sx/static/styles/modern/images/go_last_read.png) no-repeat center center; margin-left: 0.5rem;}
.last_read a, .last_post a { border: none; width: 100%; height: 100%; display: block; }
.colhead_dark .last_read { background-image:url(https://www.empornium.sx/static/styles/modern/images/go_last_read.png); }

.unread_locked_sticky{background: url(https://www.empornium.sx/static/styles/modern/images/forum_unread_locked_sticky.png) no-repeat center center;}
.read_locked_sticky{background: url(https://www.empornium.sx/static/styles/modern/images/forum_read_locked_sticky.png) no-repeat center center;}
.read_sticky{background: url(https://www.empornium.sx/static/styles/modern/images/forum_read_sticky.png) no-repeat center center;}
.unread_sticky{background: url(https://www.empornium.sx/static/styles/modern/images/forum_unread_sticky.png) no-repeat center center;}
.unread_locked{background: url(https://www.empornium.sx/static/styles/modern/images/forum_unread_locked.png) no-repeat center center;}
.read_locked{background: url(https://www.empornium.sx/static/styles/modern/images/forum_read_locked.png) no-repeat center center;}
.unread{background: url(https://www.empornium.sx/static/styles/modern/images/forum_unread.png) no-repeat center center;}
.read{background: url(https://www.empornium.sx/static/styles/modern/images/forum_read.png) no-repeat center center;}
.sicon{background: url(https://www.empornium.sx/static/styles/modern/images/go_latest_topics.png) no-repeat center center;}

.permission_container tr:nth-child(even) {
    background-color: #eff3f6;
}

table.forum_post {
    margin: 1rem 0;
    font-size: 1.2rem;
}

#requests table.forum_post {
    margin: 0 0 2rem;
}

td.bbcode {
    border: 1px solid #aaa;
}
table.forum_post td {
    border: 1px solid #ccc;
    border-top:none;
    border-left:none;
}

table.forum_unread {
    /*border: 0 solid #98AAB1;*/
}

table.forum_list, table.forum_index {
    border:none;
    margin-bottom: 1rem;
    font-size: 1.2rem;
}
table.forum_list td, table.forum_index td {
    border:none;
}

td.avatar {
    width: 15rem;
    min-height: 15rem;
    padding: 0;
    text-align: center;
    background-color: #FCFCFC;
}
img.avatar {
    margin: 0;
}
#user img.avatar {
    margin-top: 0.3rem;
}

.newstatus{
    color: #3f3;
    padding: 0 0.3rem;
    font-style: italic;
}

video { max-width: 96rem; }
.bb_video {
    border: none;
    width: 64rem;
    height: 32rem;
}

a[onclick^="BBCode.spoiler"] {
    text-shadow: 1px 1px 1px rgba(255,255,255,.7), -1px -1px 1px rgba(255,255,255,.7), 1px -1px 1px rgba(255,255,255,.7), -1px 1px 1px rgba(255,255,255,.7);
}

table .scale_image {
    max-width: 80rem;
}
#collage table .scale_image {
    max-width: 60rem;
}
ul.collage_images li {
    padding: 0.5rem;
    margin: auto;
    float: left;
    list-style: outside none none;
    text-align: center;
    min-width: 12rem;
    max-width: 22.5rem;
}
ul.collage_images img {
    min-height: 15rem;
    max-height: 20rem;
    min-width: 12rem;
    max-width: 25rem;
}

td.postbody {
    padding:0;
}
.post_footer {
    border-top:1px dashed #ccc;
    width:40rem;
    color:#777;
    font-style: italic;
    font-size: 90%;
}

td.badgesrow, .badgesrow {
    border-top: 1px solid #dcdde4;
    padding:0;
}
.badges {
    padding: 0.4rem;
    text-align: center;
}
.badges img {
    max-width: 15rem;
    max-height: 6rem;
    margin: 1px;
}
#badgesadmin img {
    margin-bottom: 0.6rem;
}
#badgesadmin .badge {
    margin: 0.8rem;
}
.badge {
    display:inline-block;
    text-align: center;
}

.addbadges {
    text-align: left;
}
.addbadges .badge {
    display:block;
}



/* Layout (Inbox) */

tr.unreadpm {
    background-color: #ECC;
}

/* Layout (Permission Page) */

.permission_head {
    width: 35rem;
    margin-left:auto;
    margin-right:auto;
}

.permission_head input {
    width: 20rem;
}
.permission_head input.wid35 {
    width: 8.3rem;
}
.permission_head td.label {
    font-weight: bold;
    text-align: right;
    width: 13rem;
}

.permission_container {
    margin-top: 2rem;
    float:left;
    width:30rem;
    padding:0.5rem;
}
.permission_container input {
    margin:0 0.3rem 0.5rem 0;
    vertical-align:top;
}


.submit_container {
    clear:both;
    text-align:right;
}

/* Layout (Invite tree) */

ul .invitetree {
    margin: 0 0 0 2.5rem;
}

.invitetree li {
    list-style: none;
    margin: 1rem 0.2rem;
}

/* Layout (MISC) */

#snatchesdiv > td {
    width: 20%;
    text-align: center;

}
#snatchesdiv > td > a {
    border: 1px solid lightgray;
    display: block;
    padding: 0.3rem;

}

.left_poll {
    width: 0.2rem;
    height: 0.9rem;
    background: url('https://www.empornium.sx/static/styles/modern/images/bar_left.gif') no-repeat center center;
    float: left;
    margin: 0;
    padding: 0;
}

.center_poll {
    height: 0.9rem;
    background: url('https://www.empornium.sx/static/styles/modern/images/bar.gif') repeat;
    float: left;
    margin: 0;
    padding: 0;
}

.right_poll {
    width: 0.2rem;
    height: 0.9rem;
    background: url('https://www.empornium.sx/static/styles/modern/images/bar_right.gif') no-repeat center center;
    float: left;
    margin: 0;
    padding: 0;
}

.curtain {
    position: fixed;
    top: 0%;
    left: 0%;
    width: 100%;
    height: 100%;
    background: #ECF0F6;
    z-index:1001;
}

.lightbox {
    position: fixed;
    text-align: center;
    top: 5%;
    left: 5%;
    width: 90%;
    height: 90%;
    padding: 0;
    z-index:1002;
    overflow: auto;
}

.center {
    text-align: center;
}

.spellcheck {
    margin: 2.5rem 0;
    font-size: 1.25em;
    font-weight: bold;
}

/* bbcode */

.anchor, a.anchor:visited, a.anchor:hover {
    font-family:"Arial Black", "Arial Bold", Gadget, sans-serif;
    font-weight: normal;
    font-size: 1.5em;
    color: #0261a3;
    text-decoration: none;
}

div.modcomment {
    background-color: #ecf0f6;
    text-align: left;
    margin: 1.2rem auto;
    padding-top: 1rem;
    padding-bottom: 0.8rem;
    padding-right: 1rem;
    padding-left: 1rem;
    border: 0.3rem solid #600;
    border-radius: 0.5rem;
    box-shadow: 0 0 0.5rem #300;
    color: black;
    font-size: 1.2rem;
    font-weight: normal;
}
div.modcomment div.after {
    float:right;
    color: #900;
    font-size: 1.2rem;
    font-weight: normal;
    padding: 0.2rem 0 0 0.4rem;
    margin: 0 -0.5rem -0.5rem 0;
}

div.modcomment:before {
    color: #900;
    content: "Staff Comment: ";
    font-weight: bold;
}

div.bbcode { /* bg tag */
    background-color: inherit;
    text-align: inherit;
    margin: 0 auto;
}

table.bbcode {
    background-color: transparent;
    text-align: inherit;
    margin: 0 auto;
}
tr.bbcode {
    background-color: inherit;
    text-align: inherit;
}
th.bbcode {
    background-color: inherit;
    text-align: inherit;
    font-size: larger;
    padding: 0.7rem;
    font-weight: bolder;
}
td.bbcode {
    background-color: inherit;
    text-align: inherit;
}

span.postlink {
    display:block;
    width: 1rem;
    height: 1rem;
    background: url('https://www.empornium.sx/static/styles/modern/images/go_quote.png') no-repeat center center;
    vertical-align: bottom;
}
a.postlink {
    border: none;
    display:inline-block;
}

span.error_label {
    font-size: 1.4rem;
    border:none;
}

blockquote.bbcode.error {
    border: 0.2rem solid #c00;
    padding: 0.5rem 1rem;
}
blockquote.bbcode.error code.error {
    font-size: 1.2em;
}

span.quote_label {
    font-size: 1.2rem;
    margin: 0.5rem 1.5rem -0.5rem 1.5rem;
    display:block;
    padding: 0.3rem 0 0;
    color: #555;
}
blockquote span.quote_label {
    color: #666;
    font-size: 1.2rem;
}
blockquote > blockquote > span.quote_label {
    color: #777;

}
blockquote.bbcode {
    padding: 1rem;
    border: 1px dotted #999;
    border-left: 0.5rem solid #999;
    margin: 0.5rem 1.5rem;
    background-color: #f4f4f4;
    color: #555;
}
blockquote.bbcode > blockquote.bbcode {
    border-color:#bbb;
    background-color: #fafafa;
    color: #666;
    font-size: 95%;
}
blockquote.bbcode > blockquote.bbcode > blockquote.bbcode {
    border-color:#cfcfcf;
    background-color: #fff;
    color: #777;
}
blockquote {
    margin: 0.5rem 0.5rem;
    padding: 1rem;
    border: 1px solid #98AAB1;
}

code.error {
    display:inline-block;
    color: #c00;
    font-size: 2em;
    font-weight: bolder;
    padding:1px 0;
}
code.bbcode {
    background-color: #fffff3;
    color: #333;
    border-width:1px;
    border-color: #D3CFB7;
    border-style: dotted;
}

code.bbcodeblock {
    font-family: "PT Mono", monospace;
    background-color: #f4f4f4;
    color: black;
    border: 1px dashed #98AAB1;
}
/*  Stuff for the bbcode assistant  */

table.bb_holder {
    border-collapse:collapse;
    background:    #808080;
    width: 100%;
    margin: 0;
}


table.bb_holder td {
    padding:0;
}

table.bb_holder td.colhead {
    background:none;
    background-color: #f8f8f8;
    color:black;
    font-weight: normal;
}

.bb_smiley_holder {
    text-align: center;
    padding: 0;
    max-width:100%;
}

select.bb_button {
    padding:0;
    background:white;
    cursor: pointer;
    color: #000000;
    height: 2.4rem;
}

.bb_buttons_left {
    float: left;
    text-align: left;
    margin: 0.6rem 0.4rem 0 0;
    min-height: 2rem;
    font-variant: small-caps;
}

.bb_buttons_right {
    float: right;
    margin-top: 0.3rem;
}
.bb_buttons_right div {
    float: left;
    text-align: left;
    margin: 0.3rem 2rem 0 0;
}


a.bb_button {
    padding:0.3rem 0.6rem;
    background:white;
    cursor: pointer;
    color: #000000;
    border: 1px solid #7BA3C1;
}

a.bb_button:hover {
    text-decoration:none;
    background-color: #5C7CBC;
    color: #ffffff;
}

.bb_icon {
    padding:0.2rem;
    margin:0 1px 0 0;
    background:white;
    cursor: pointer;
    border: 1px solid #7BA3C1;
}

.bb_smiley img {
    padding: 0.2rem;
}
.bb_smiley img:hover {
    background: #ddd;
    border-radius: 0.3rem;
}
.bb_icon:hover {
    background-color: #8CaCeC;
}

.overflow_button {
    padding: 1px;
    margin:0.3rem 1px 0.2rem;
    font-weight: bold;
    text-align: center;
    border: 1px solid #7BA3C1;
    background-image: none;
    background-color: #9CB7D2;
}
.overflow_button a {
    padding:0 0.8rem;
}
.overflow_button .number {
    font-weight: normal;
    color: #BACBD8;
}

.color_pick td {
    padding:0.2rem;
    width:1rem;
    height:1rem;
    cursor: pointer;
}

.picker_holder {
    display: block;
}

.color_pick {
    display: block;
    border-collapse:collapse;
}

.color_pick, .color_pick td {
    border:1px solid #333333;
}

.color_pick td:hover {
    border:1px solid #333333;
}

.button {
    display: inline-block;
    border-radius: 0.3rem;
    margin: 0 0.8rem 0.4rem 0;
    text-decoration: none;
    color: #fff;
    border: none;
    cursor: pointer;  /* hand; */
    text-align: center;
    font-size: 1.2rem;
    line-height: 1.2rem;
    font-family: Verdana, Geneva, sans-serif;
    padding: 0.7rem 1.5rem;
}
a.button:visited {
    color: #fff;
}

table.overlay {
    border: 1px solid #0d245a;
    box-shadow: 0.2rem 0.2rem 0.8rem 0 rgba(0,0,0,.9);
}
.overlay, .overlay .leftOverlay, .overlay .rightOverlay {
    border: 1px dashed #0d245a;
    background-color: #3d547a;
    color: #eee;
}
.leftOverlay img {
    max-height: 20rem;
    max-width: 20rem !important;
    display: block;
    margin: auto;
}
.overlay .rightOverlay {
    vertical-align: top;
}

.reels, .reelsi {
    white-space:nowrap;
}
.reels.play {
}

.reels img {
    background-color: #ddd;
    border: 0.3rem solid #ccc;
}
.reels.play img {
    background-color: #fff;
    border: 0.3rem solid #bbb;
}
.reelsi img {
    background-color: #e2e2e2;
    border: 1px solid #ccc;
}
.reels img.win {
    border: 0.3rem solid blue;
}
img.win.flash {
    border: 0.2rem solid gold;
}
.payout {
    width:7.4rem;
    vertical-align: top;
    display:inline-block;
    text-align: center;
    font-weight: bold;
    font-size: 1.4rem;
    color:black;
    padding-top:0.7rem;
}

.fmresults td {
    text-align: center;
    border: none;
}
.fmresults td.fmheader {
    text-align: center;
    border: none;
    background-color: #aaa;
    color: white;
    font-weight: bold;
}

.fm input[type=button] {
    background-color: white;
    padding: 0.2rem 1rem 0.2rem;
    border: 0.2rem solid darkblue;
    width:8rem;
    color: darkblue;
    cursor: pointer;
}

.fm input[type=text] {
    text-align: center;
    color: darkblue;
    cursor:default;
    width:7rem;
}

.chip {
    text-align: center;
    width:6rem;
    height:6rem;
    position:absolute;
    left:-5rem;
    background: url('https://www.empornium.sx/static/styles/modern/images/betchip.png') no-repeat center center;
}
.chip span {
    position:relative;
    text-align: center;
    top:1.8rem;
    font-size: 1.8rem;
    font-weight: bold;
    color:black;
}

.statusown a {
    cursor: pointer;
}
.thin > h2:first-child + .status_box {
    margin: -1.5rem auto 1rem;
    width: 100%;
}
.status_box {
    margin: 1rem auto 0;
    width: 96%;
    min-width: 92rem;
    max-width: 120rem;
    border: none;
    padding:0.4rem;
}
.staffstatus {
    display: inline-block;
    border-radius: 0.6rem;
    margin: 0.4rem 0.4rem;
    text-decoration: none;
    color: #fff;
    font-size: 1.1rem;
    vertical-align: top;
    cursor: default;
    line-height: 1.1rem;
    text-align: center;
    font-size: 1.2rem;
    line-height: 1.2rem;
    font-family: Verdana, Geneva, sans-serif;
    padding: 0.3rem 1.5rem;
}
.staffstatus a {
    color: #222;
}
.staffstatus a:visited {
    color: #222;
}
.status_checking {
    float:right;
    background: #5da53a;
    border: 1px solid #9Be361;
}
.status_notchecking {
    float:left;
    background: #eaa;
    border: 1px solid #822;
}
.nostaff_checking {
    margin-top:0.6rem;
    float:right;
    color: #ddd;
    margin-right:1rem;
}
.status_loading {
    margin-top:0.6rem;
    float:left;
    color:#ccc;
}

.pager {
    font-weight:bold;
}
.pager_on {
    color: #abf;
}

#site_debug {
    color: black;
    font-size: 1.2em;
}

div#site_debug {
    opacity: .2;
    transition: opacity .5s;
    -webkit-transition: opacity .5s;
}
div#site_debug:hover {
    opacity: 1;
}
#site_debug table tr {
    background-color: transparent;
}
#debug_cache tr td:first-child {
    width:20%;
    border-right: 0.3rem solid white;
}

#debug_database > tbody > tr > td:nth-child(2) {
    text-align: right;
    padding-right: 1rem;
}
.debug_table_head {
    border-top: 0.15rem solid #6a9bb7;
    font-weight: bold;
    color: #444;
}
.debug_table_head td {
    background-color: #9CB7D2;
}
.debug_table tbody tr:nth-child(even) td {
    background-color: #eff3f6;
    vertical-align: top;
}
.debug_table tbody tr:nth-child(odd) td {
    background-color: white;
    vertical-align: top;
}
.debug_table tbody tr td,.debug_table tbody tr td.rowa, .debug_table tbody tr td.rowb  {
    transition: none;
    -webkit-transition: none;
}
.debug_table tbody tr:hover td,.debug_table tbody tr:hover td.rowa, .debug_table tbody tr:hover td.rowb  {
    background-color: #DADADA;
}
.debug_query_data {
    font-family: monospace;
    font-size: 1.3rem;
}
.debug_cache_data pre {
    font-size: 1.2rem;
}

.seedhistory {
    font-family: "Courier New", Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace;
    font-weight: bold;
}

.donate_details {
    color: black;
    margin-bottom:1rem;
    border: 0.2rem solid #0054b0; /* #004b9d; */
    background-color:#E2D244;
    padding: 0.5rem 2rem;
    border-radius: 1rem 1rem 1rem 1rem;
}

.donate_details table td {
    background-color:#E2D244;
}
.donate_details table tr.rowb td {
    background-color:#E8D874;
}

.donate_details.green {
    background-color:#6e6;
}
.donate_details.green table td {
    background-color:#6e6;
}
.donate_details.green table tr.rowb td {
    background-color:#8e8;
}


.donate_details .address {
    font-family: "Courier New", Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace;
    font-weight: bold;
    color: #4a4a4a;
}



.donate_drives .label {
    width: 10rem;
}


.donate_drives .button {
    display: inline-block;
    border-radius: 0.2rem;
    margin: 0 0.3rem 0.3rem 0;
    text-decoration: none;
    color: #fff;
    font-weight: bold;
    border: none;
    vertical-align: top;
    padding: 0.4rem 0.4rem;
}

.greyButton {
    background: #bbb;
}



.scrollbox {
    max-height:40rem;
    overflow: auto;
}


#active_drive {
    position: relative;
    border-radius: 1.2rem;
    width: 90%;
    min-width: 94rem;
    max-width: 120rem;
    margin: 2rem auto 0 auto;
    border: 1px solid #0054b0;
    background-color: #003875;
    padding: 0;
    text-align: left;
    text-decoration: none;
    color: white;
    font-weight: bold;
    font-size: 1.4rem;
    vertical-align: top;
}

#donorbar {
    width: 96%;
    min-width: 92rem;
    margin: 0 auto;
    padding: 0.5rem;
}

#active_drive a{
    text-decoration: none;
    color: white;
    font-weight: bold;
    font-size: 1.4rem;
}
#active_drive a:hover {
    text-decoration: underline;
    color: white;
}
#active_drive a.link{
    float:right;
    text-decoration: none;
    color: white;
    font-weight: normal;
    font-size: 1.2rem;
}
#active_drive a.link:hover {
    text-decoration: underline;
    color: white;
}

#donorbargreen {
    display:inline-block;
    font-size: 1.2rem;
    height: 1.4rem;
    background-color:#4d4;
    color:white;
    font-weight: bold;
    text-align: right;
    box-shadow:inset 0.2rem 1px 0.3rem #6a9bb7;

}
#donorbarred {
    display:inline-block;
    font-size: 1.2rem;
    height: 1.4rem;
    background-color:#0d245a;
    color:white;
    font-weight: bold;
    text-align: left;
    box-shadow:inset 0 1px 0.3rem #081a4a;
}



#sig {
    overflow: hidden;
}
#torrentsigbox {
    padding-top: 0.5rem;
    overflow: hidden;
    border-top: #ccc solid 1px;
}



#user_dropdown {
    display:inline;
    position: relative;
    white-space:nowrap;
    padding-bottom:0.2rem;
}
#user_dropdown ul {
    list-style: none;
    visibility:hidden;
    position: absolute;
    left: -0.8rem;
    top: 1.2em;
    background-color:#545C66;
    color: #000;
    border: 1px solid #005488;
    border-radius: 0.8rem;
    z-index: 10;
    opacity: 0;
    transform-origin: 0% 0%;
    transform: scaleY(0);
    transition: opacity .2s .5s, visibility .2s .5s, transform .2s .5s;
    -webkit-transform-origin: 0% 0%;
    -webkit-transform: scaleY(0);
    -webkit-transition: opacity .2s .5s, visibility .2s .5s, transform .2s .5s;
}
#user_dropdown:hover ul {
    visibility: visible;
    opacity: 1;
    transform: scaleY(1);
    -webkit-transform: scaleY(1);
}
#user_dropdown ul li {
    margin: 0;
    padding: 0;
}
#user_dropdown ul a {
    display: block;
}
#user_dropdown ul li a {
    margin: 0;
    text-align: left;
    padding: 1px 0.8rem 1px 0.8rem;
    white-space:nowrap;
}
#user_dropdown ul li:first-child a {
    border-radius: 0.7rem 0.7rem 0 0;
}
#user_dropdown ul li:last-child a {
    border-radius: 0 0 0.7rem 0.7rem;
}
#user_dropdown ul li a:hover {
    background-color: #4d64aa;
    color: white;
    text-decoration: none;
}

.groupperm {
    display:inline-block;
    position: relative;
    top:-0.3rem;
    font-size:0.8em;
    font-weight: bold;
    margin: 0 0 0 0.2rem;
}

.user_peers {
    font-size: 1.2rem;
    font-weight: bold;
}
a#nav_seeding {
    margin-left:2rem;
}
a#nav_leeching {
    margin-left:0.5rem;
}
#nav_seeding_r {
    color:#41eB00;
}
#nav_leeching_r {
    color:#FF6600;
}

#autoresults {
    list-style: none;
    position: absolute;
    background-color:white;
    color: #333;
    border: 1px solid #777;
    font-size: 1.4rem;
    border-radius: 0.4rem;
}
#autoresults li {
    margin: 0;
    text-align: left;
    padding: 0 0.8rem 0 0.8rem;
    white-space:nowrap;
}
#autoresults li.highlight {
    font-weight: normal;
    background-color: #888;
    color: white;
    text-decoration: none;
}

#autoresults li span.num {
    color:#aaa;
}

#autoresults li.highlight span.num {
    color: white;
}

table.border {
    border: 1px solid #dde;
}

table.noborder td, .torrent td, .torrent_table td {
    border:none;
}

.tag_results {
    display:inline-block;
    width:49%;
    vertical-align: top;
}

.tag_results:first-child {
    display:inline-block;
    width:50%;
    vertical-align: top;
}

.tag_results td:first-child {
    padding-left:2rem;
}

.tagtype {
    font-size: 0.7em;
    vertical-align: top;
}

.synonyms {
    background-color: #f8fbfd;
    padding: 1px 0.5rem;
    color: #777;
}

.plusmn {
    font-family: "Courier New", Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace;
    font-weight: bold;
    float:right;
    cursor: pointer;
}

.plusmn a:hover{
    text-decoration: none;
}

.votes {
    color:#999;
}
.search_highlight {
    color:#FF0066;
}

.nopad {
    margin:0;
    padding:0;
}
.nopad .scale_image {
    margin:0;
    padding:0;
}
.nopad td {
    margin:0;
    padding:0;
}

table.vat td {
    vertical-align: top;
}

table.vam td  {
    vertical-align: middle;
}

table.vab td  {
    vertical-align: bottom;
}

td.bbcode.vat {
    vertical-align: top;
}
td.bbcode.vam  {
    vertical-align: middle;
}
td.bbcode.vab  {
    vertical-align: bottom;
}


.tag_header {
    padding: 0.7rem 0.5rem 0 0.5rem;
    text-align: center;
}

.button_sort {
    display: inline-block;
    border: 1px solid #7BA3C1;
    border-radius: 0.3rem;
    background-color: #eff3f6;
    text-align: center;
    font-style: normal;
    width: 4rem;
    margin:auto;
    cursor: pointer;
}

.button_sort.sort_select {
    background-color: #5A8Bb8;
    color: white;
}
.button_sort.sort_select a {
    color: white;
}

.button_sort a, .button_sort a:visited {
    color: #0261A3;
}
.button_sort:hover {
    background-color: #5A8Bb8;
    color: white;

}
.button_sort:hover a {
    background-color: #5A8Bb8;
    color: white;

}

.button_sort a:hover {
    text-decoration: none;
    color: white;
}

.tag_header div {
    margin-bottom:0.4rem;
}

.tag_header div:before {
    font-size: 0.8em;
    content: "sort by";
    margin-right: 0.3rem;
}

.indent {
    margin-left: 2rem;
}

span.anon_name {
    float: none;
    font-weight: normal;
    text-align: center;
}
input[type=submit]:hover,input[type=button]:hover,button:hover {
    background: -webkit-linear-gradient(#8993AF,#293760);
    background: linear-gradient(#8993AF,#293760);
    color: #eef;
}
input[type=submit]:active,input[type=button]:active,button:active {
    border-style:inset;
}
input[type=submit],input[type=button],button {
    margin: 0.2rem;
    color: #fff;
    font-size: 1.4rem;
    background: #8993AF;
    background: -webkit-linear-gradient(#8993AF,#606C90);
    background: linear-gradient(#8993AF,#606C90);
    border-width: 1px;
    border-style: solid;
    border-color: #678 #234 #234 #678;
    box-shadow: 0 1px 0.3rem rgba(046,053,062,0.5), inset 0 0 1px rgba(255,255,255,0.6);

}
input[value^="Stealth"] { background: gray; }
.head input[type="button"], .smallhead input[type="button"] {
    margin: 0 0.3rem;
    font-size: 1.2rem;
    padding: 1px 0.3rem;
}

.quarter_width_checkbox_container { /* used for latest forum topics selection on settings page */
    width: 25%;
    float: left;
    padding: 0.2rem 0 0.2rem 0;
}

.quarter_width_checkbox label {
    margin-left: 0.3rem;
}

.newtorrent {
    float: right;
    font-weight: bold;
    font-style: italic;
    color: #e33;
    margin-right: 1.2rem;
}

.file_icons {
    color: black;
}

.messagebar
{
    background: var(--green);
    border: none;
    line-height:2rem;
    height: 2rem;
    box-sizing: border-box;
    padding: 0;
    border-radius: 0.5rem;
    margin-bottom: 0.5rem;
}
`;
    GM_addStyle(modern);
    GM_addStyle(css);
    GM_addStyle(panel_css);
    GM_addStyle(grid_view);
})();