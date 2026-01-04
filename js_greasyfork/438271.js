// ==UserScript==
// @name         SurfHeaven ranks
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  SH ranks
// @author       You
// @match        https://surfheaven.eu/servers/
// @icon         https://www.google.com/s2/favicons?domain=surfheaven.eu
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM.getValue
// @grant        GM.setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438271/SurfHeaven%20ranks.user.js
// @updateURL https://update.greasyfork.org/scripts/438271/SurfHeaven%20ranks.meta.js
// ==/UserScript==


(async function() {
    'use strict';

    var use_custom = await GM.getValue('sh_ranks_use_custom_id', false);
    var custom_id = await GM.getValue('sh_ranks_custom_id', "");

    function make_request(url, func) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: (response) => {
                if (response.status != 502) {
                    const data = JSON.parse(response.responseText)
                    if (data.length > 0) {
                        func(data);
                    }
                }
                else {
                    func(false);
                }
            }
        });
    }

    function reset_ranks() {
        const table = document.querySelector('.table');
        if (table.rows[0].childElementCount >= 6) {
            for (let row of table.rows) {
                row.deleteCell(4);
                row.deleteCell(3);
                if (row.cells[2].childElementCount >= 2) {
                    row.cells[2].removeChild(row.cells[2].children[2]);
                }
            }
        }
    }

    async function set_id() {
        var id_input = document.querySelector('.custom-id-input');

        if (id_input.value) {
            make_request("https://surfheaven.eu/api/playerinfo/" + id_input.value, async (data) => {
                if (data) {
                    custom_id = id_input.value;
                    await GM.setValue('sh_ranks_custom_id', custom_id);

                    id_input.placeholder = custom_id;
                    id_input.value = "";
                    document.querySelector('.custom-id-button').disabled = true;

                    reset_ranks();
                    fetch_ranks(custom_id);
                }
            });

        }
    }

    async function handle_input_change() {
        document.querySelector('.custom-id-button').disabled = false;
    }

    async function handle_checkbox(cb) {
        var my_div = document.querySelector('.custom-id-div');
        cb.target.disabled = true;
        if (cb.target.checked) {
            await GM.setValue('sh_ranks_use_custom_id', true);

            var id_input = document.createElement('input');
            id_input.className = 'form-control custom-id-input';
            id_input.style = "display: inline-block; margin-left: 10px; border: 1px solid rgb(247, 175, 62); width: 250px;"
            id_input.type = "text";
            id_input.oninput = handle_input_change;

            var button = document.createElement('button');
            button.className = 'btn btn-success btn-xs custom-id-button';
            button.innerHTML = "Set";
            button.style = 'margin-left: 10px;'
            button.onclick = set_id;

            if (custom_id) {
                id_input.placeholder = custom_id;
                button.disabled = true;
            }

            my_div.appendChild(id_input);
            my_div.appendChild(button);
            if (custom_id) {
                reset_ranks();
                fetch_ranks(custom_id);
            }
        }
        else {
            await GM.setValue('sh_ranks_use_custom_id', false);

            my_div.removeChild(my_div.lastElementChild)
            my_div.removeChild(my_div.lastElementChild)
            reset_ranks();
            auto_fetch_ranks();
        }
    }

    var my_div = document.createElement('div');
    my_div.className = 'navbar-form custom-id-div';

    var my_list = document.createElement('ul');
    my_list.className = "nav luna-nav";

    var idLabel1 = document.createElement('li');
    idLabel1.innerHTML = '<a>ID</a>';

    var switchButton = document.createElement('li');
    switchButton.innerHTML = '<label class="switch"><input class="my-checkbox" type="checkbox"><span class="slider"></span><span class="labels" data-on="MANUAL" data-off="AUTO"></span></label>';

    my_list.appendChild(idLabel1);
    my_list.appendChild(switchButton);

    my_div.appendChild(my_list);

    var navbar = document.getElementById('navbar')
    navbar.appendChild(my_div);

    var checkbox = document.querySelector('.my-checkbox')
    checkbox.onchange = handle_checkbox;

    function fetch_ranks(id) {
        make_request("https://surfheaven.eu/api/records/" + id + "/", (records) => {
            make_request("https://surfheaven.eu/api/servers", (servers) => {
                const table = document.querySelector('.table');
                table.rows[0].insertCell(3).outerHTML = "<th>Rank</th>";
                table.rows[0].insertCell(4).outerHTML = "<th>Bonus</th>";
                const rank_cells = Array(servers.length).fill().map((_, i) => table.rows[i + 1].insertCell(3));
                const bonus_cells = Array(servers.length).fill().map((_, i) => table.rows[i + 1].insertCell(4));

                const server_records = {};
                records.forEach((record) => {
                    const record_found = servers.findIndex(server => server.map === record.map) >= 0;
                    if (record_found) {
                        if (server_records[record.map] === undefined) {
                            server_records[record.map] = new Array(13);
                        }
                        server_records[record.map][record.track] = record;
                    }
                });

                servers.forEach((server, i) => {
                    var rec = server_records[server.map];
                    if (rec) {
                        const map_record = rec[0];
                        if (map_record) {
                            const txt = document.createTextNode(map_record.rank + " / " + server.mapinfo.completions);
                            rank_cells[i].appendChild(txt);
                        }
                        else {
                            const txt = document.createTextNode("0 / " + server.mapinfo.completions);
                            rank_cells[i].appendChild(txt);
                        }
                        const bonus_completes = rec.reduce((value, record) => record && record.track > 0 ? value + 1 : value, 0);

                        const txt = document.createTextNode(bonus_completes + " / " + server.mapinfo.bonus);
                        bonus_cells[i].appendChild(txt);
                    }
                    else {
                        const txt = document.createTextNode("0 / " + server.mapinfo.completions);
                        rank_cells[i].appendChild(txt);

                        const txt_2 = document.createTextNode("0 / " + server.mapinfo.bonus);
                        bonus_cells[i].appendChild(txt_2);
                    }
                });

                document.querySelector('.my-checkbox').disabled = false;

                fetch_bonus_ranks(id, servers, server_records);
            });
        });
    }

    function fetch_bonus_ranks(id, servers, server_records) {
        const table = document.querySelector('.table');

        make_request("https://surfheaven.eu/api/completions", (completions) => {
            servers.forEach((server, server_index) => {
                const server_completions = completions.filter(completion => completion.map === server.map && completion.track > 0);
                const server_completions_2 = Array(15).fill(null);
                completions.forEach(completion => {
                    if (completion.map === server.map && completion.track > 0) {
                        server_completions_2[completion.track] = completion;

                    }
                });

                const records = server_records[server.map];

                const row = table.rows[server_index + 1];
                const div = document.createElement('div');
                div.className = "hidden-row";
                div.style.display = row.cells[0].children[0].style.display;
                const div_2 = document.createElement('div');
                div_2.className = "hidden-row";
                div_2.style.display = row.cells[0].children[0].style.display;

                row.cells[2].appendChild(div_2);
                row.cells[3].appendChild(div);

                server_completions_2.forEach((completion, i) => {
                    if (completion === null) {
                        return;
                    }

                    var rank_text;
                    const h5_elem = document.createElement('p');
                    h5_elem.style = "margin-top: 10px;margin-bottom: 10px;font-size: 14px;font-family: inherit;display: block;   margin-inline-start: 0px;margin-inline-end: 0px;line-height: 1.1; text-align: end;";
                    h5_elem.textContent = `Bonus ${completion.track}`;

                    if (!records || !records[completion.track]) {
                        rank_text = `0 / ${completion.completions}`
                    }
                    else {
                        rank_text = `${records[completion.track].rank} / ${completion.completions}`
                        h5_elem.textContent = `Bonus ${completion.track}`;
                    }

                    const rank_elem = document.createElement('p');
                    rank_elem.style = "margin-top: 10px;margin-bottom: 10px;font-size: 14px;font-family: inherit;display: block;   margin-inline-start: 0px;margin-inline-end: 0px;line-height: 1.1;";
                    rank_elem.textContent = rank_text;
                    div_2.appendChild(h5_elem);
                    div.appendChild(rank_elem);
                });
            });

        });
    }

    function auto_fetch_ranks() {
        make_request("https://surfheaven.eu/api/id", (data) => {
            const id = data[0].steamid;
            fetch_ranks(id);
        });
    }

    if (use_custom) {
        checkbox.click()
    }
    else {
        auto_fetch_ranks();
    }
})();

GM_addStyle( `
    .luna-nav.nav li>label{
        padding: 8px 15px 8px 25px;
        margin: 0;
        margin-left: 10px;
    }

    .switch {
        position: relative;
        display: inline-block;
        width: 90px;
        height: 34px;
    }

    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }
    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        -webkit-transition: .4s;
        transition: .4s;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        -webkit-transition: .4s;
        transition: .4s;
    }

    input:checked + .slider {
        background-color: #f6a821;
    }

    input:focus + .slider {
        box-shadow: 0 0 1px #2196F3;
    }

    input:checked + .slider:before {
        -webkit-transform: translateX(56px);
        -ms-transform: translateX(56px);
        transform: translateX(56px);
    }

    .switch .labels {
        position: absolute;
        top: 8px;
        left: 0;
        width: 100%;
        height: 100%;
        font-size: 12px;
        font-family: sans-serif;
        transition: all 0.4s ease-in-out;
    }

    .switch .labels::after {
        content: attr(data-off);
        position: absolute;
        right: 5px;
        color: #4d4d4d;
        opacity: 1;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
        transition: all 0.4s ease-in-out;
    }

    .switch .labels::before {
        content: attr(data-on);
        position: absolute;
        left: 5px;
        color: #ffffff;
        opacity: 0;
        text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.4);
        transition: all 0.4s ease-in-out;
    }

    .switch input:checked~.labels::after {
        opacity: 0;
    }

    .switch input:checked~.labels::before {
        opacity: 1;
    }
`);