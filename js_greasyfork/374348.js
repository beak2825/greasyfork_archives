// ==UserScript==
// @name         Save Tactics_CO's  CN 
// @namespace    http://www.trophymanager.cn/
// @author       MLFC、猜火车/太原龙城
// @version      1.0.2024050302
// @description  战术保存  Save Tactics 
// @match        *trophymanager.com/tactics/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/374348/Save%20Tactics_CO%27s%20%20CN.user.js
// @updateURL https://update.greasyfork.org/scripts/374348/Save%20Tactics_CO%27s%20%20CN.meta.js
// ==/UserScript==

(function() {

    const APP_CONST = {
        IDS: {
            BUTTON_TACTICS_SAVE: "tm_script_button_tactics_save",
            BUTTON_TACTICS_RENAME: "tm_script_button_tactics_rename",
            BUTTON_TACTICS_UPDATE: "tm_script_button_tactics_update",
            BUTTON_TACTICS_LOAD: "tm_script_button_tactics_load",
            BUTTON_TACTICS_DELETE: "tm_script_button_tactics_delete",
            SELECT_TACTICS: "tm_script_select_tactics",
            INPUT_TACTICS: "tm_script_input_tactics",
            TACTICS_NOTICE_BOX: "tm_script_tactics_notice_box"
        }
    };

    class Ajax {
        static post(url, data) {
            return new Promise((resolve, reject) => {
                $.post(url, data)
                .done((response) => {
                    resolve(response);
                })
                .fail((error) => {
                    reject(error);
                })
            });
        }
    }

    class TMStorage {
        static get(id) {
            return {
                name: TMStorage.getName(id),
                data: TMStorage.getData(id)
            };
        }

        static getData(id) {
            function parseUndefinedPlayers(obj) {
                for(let key in obj.players) {
                    if(obj.players[key] === "undefined") {
                        obj.players[key] = undefined;
                    }
                }
                return obj;
            }
            return parseUndefinedPlayers(JSON.parse(GM_getValue(`TM_TACTICS_${id}`)));
        }

        static getName(id) {
            return GM_getValue(`TM_TACTICS_${id}_NAME`);
        }

        static setName(id, name) {
            GM_setValue(`TM_TACTICS_${id}_NAME`, name);
        }

        static setData(id, data) {
            GM_setValue(`TM_TACTICS_${id}`, JSON.stringify(data));
        }

        static delete(id) {
            GM_deleteValue(`TM_TACTICS_${id}`);
            GM_deleteValue(`TM_TACTICS_${id}_NAME`);
            let list = TMStorage.getIDsList();
            list.freeIDs.push(Number(id));
            TMStorage.updateIDsList(list);
        }

        static getIDsList() {
            return JSON.parse(GM_getValue("TM_TACTICS_IDS_LIST") || '{ "freeIDs": [], "highestUnusedID": 0 }');
        }

        static updateIDsList(list) {
            GM_setValue("TM_TACTICS_IDS_LIST", JSON.stringify(list));
        }
    }

    function getTeamID() {
        return Ajax.post("/ajax/tactics_co_get.ajax.php", {"get":"cond_orders","reserves":reserves,"national":national,miniGameId: miniGameId})
        .then((data) => {
            return data[0]['TEAM_ID'];
        });
    }

    function sendTacticsUpdate(oldData, data) {
        /**
         * Compare conditional orders
         * @param {{}} co1 
         * @param {{}} co2 
         * @returns {boolean} true if equal, false otherwise
         */
        function compareCO(co1, co2) {
            let keys = Object.keys(co1);
            for(let key of keys) {
                if(key !== "ID" && String(co1[key]) !== String(co2[key])) {
                    return false;
                }
            }
            return true;
        }

        function isSpecialPosition(position) {
            return position === "penalty" || position === "captain" || position === "freekick" || position === "corner";
        }

        // data.players { position: playerID }
        // players { playerID: position }

        // Player removal
        // For special position { undefined: function }
        // For field and subs { playerID: "out" }

        // List players that are removed
        function listPlayersOut(oldPlayers, newPlayers) {
            let outPlayers = {};
            for(let position in oldPlayers) {
                let playerID = oldPlayers[position];
                if(!isSpecialPosition(position)) {
                    let found = false;
                    for(let newPlayersPosition in newPlayers) {
                        if(!isSpecialPosition(newPlayersPosition) && newPlayers[newPlayersPosition] === oldPlayers[position]) {
                            found = true;
                        }
                    }

                    if(!found) {
                        outPlayers[oldPlayers[position]] = "out";
                    }
                }
            }
            return outPlayers;
        }

        // Handle special positions 
        // Request update sequentially
        let specialPositions = ["captain", "penalty", "freekick", "corner"];
        let promise = Promise.resolve();
        for(let position of specialPositions) {
            promise.then(() => {
                let playersObj = {};
                playersObj[data.players[position]] = position;
                oldData.players[position] = data.players[position];
                return Ajax.post("/ajax/tactics_post.ajax.php", { on_field: oldData.players, players: playersObj, reserves: 0, national: undefined, miniGameId: 0 });
            });
        }

        // List players for moving and removing
        let players = listPlayersOut(oldData.players, data.players);
        for(let position in data.players) {
            if(!isSpecialPosition(position) && data.players[position] && data.players[position] !== "0") {
                players[data.players[position]] = position;
            }
        }
        
        // Wait for single requests to complete
        return promise.then(() => {
            // Request mass players update
            let promises = [
                Ajax.post("/ajax/tactics_post.ajax.php", { on_field: data.players, players: players, reserves: 0, national: undefined, miniGameId: 0 }).then(response => JSON.parse(response))
            ];

            // Update conditional orders
            for(let i = 0; i < data.conditionalOrders.length; ++i) {
                let cond_order = cond_orders[i];
                let co = data.conditionalOrders[i];
                if(compareCO(data.conditionalOrders[i], cond_orders[i])) { continue; }

                let coCopy = Object.assign({}, data.conditionalOrders[i]);
                coCopy.national = undefined;
                coCopy.reserves = 0;
                coCopy.miniGameId = 0;
                promises.push(Ajax.post("/ajax/tactics_co_post.ajax.php", coCopy).then(response => JSON.parse(response)));
            }

            // Save mentality, attacking and focus
            promises.push(Ajax.post("/ajax/tactics_post.ajax.php", { save: "attacking", value: data.attacking, "reserves": 0,"national": undefined,"club_id": SESSION["id"], miniGameId: 0}));
            promises.push(Ajax.post("/ajax/tactics_post.ajax.php", { save: "mentality", value: data.mentality, "reserves": 0,"national": undefined,"club_id": SESSION["id"], miniGameId: 0}));
            promises.push(Ajax.post("/ajax/tactics_post.ajax.php", { save: "focus", value: data.focus, "reserves": 0,"national": undefined,"club_id": SESSION["id"], miniGameId: 0}));

            return Promise.all(promises);
        });
    }

    function extractData() {
        function isSpecialPosition(position) {
            return position === "penalty" || position === "captain" || position === "freekick" || position === "corner";
        }

        let elems = document.querySelectorAll('.field_player, .bench_player');
        let positions = {};
        for(let elem of elems) {
            if(isSpecialPosition(elem.getAttribute("position"))) {
                // Special positions require special handling
                positions[elem.getAttribute("position")] = elem.getAttribute("player_id") || undefined;
            } else {
                positions[elem.getAttribute("position")] = elem.getAttribute("player_id") || "0";
            }
        }

        let attacking = document.getElementById("attacking_select").value;
        let mentality = document.getElementById("mentality_select").value;
        let focus = document.getElementById("focus_side_select").value;

        return {
            players: positions,
            conditionalOrders: cond_orders,
            attacking: attacking,
            mentality: mentality,
            focus: focus
        };
    }



    function repositionPlayers(data, stars) {
        // Clear players
        $(".field_player, .bench_player").each(function() {
            tactics_unset_player($(this));
        });

        // Assign players
        for(let position in data) {
            if(data[position] && data[position] !== "0") {
                let player = players_by_id[data[position]];
                let $elem = $("#player_" + position);
                tactics_set_player(player, $elem);
                // Make draggable again
                $elem.draggable("enable");
            }
        }

        // Update game-specific variables
        on_field_assoc = data;
        on_field = {};
        on_subs = {};
        for(let key in data) {
            if(key.indexOf("sub") !== -1) {
                if(data[key] && data[key] !== "0") {
                    on_subs[data[key]] = key;
                }
            } else if(key !== "captain" && key !== "corner" && key !== "penalty" && key !== "freekick") {
                on_field[data[key]] = key;
            }
        }

        // Make all visible shirts non-trapsnarent
        $("[player_set=true]").find(".tactics_shirt").removeClass("transp opacity");
        // Update list of players
        tactics_list_players();
    }

    /**
     * Clears conditional orders list and repopulates them with up-to-date ones
     */
    function changeConditionalOrders(conditionalOrders) {
        $('#cond_orders_list').html('');
        for(let i = 0; i < conditionalOrders.length; ++i) {
            cond_orders[i] = conditionalOrders[i];
            // Create DOM element, but do not save it
            let $co = co_create_cond_order(conditionalOrders[i], true);
            $('#cond_orders_list').append($co);
        }
    }

    function setTeamTraits(traits) {
        let mentalitySelect = document.getElementById("mentality_select");
        let attackingSelect = document.getElementById("attacking_select");
        let focusSelect = document.getElementById("focus_side_select");
        mentalitySelect.selectedIndex = Array.from(document.querySelectorAll("#mentality_select option")).findIndex((elem) => {
            return elem.value === traits.mentality;
        });
        attackingSelect.selectedIndex = Array.from(document.querySelectorAll("#attacking_select option")).findIndex((elem) => {
            return elem.value === traits.attacking;
        });
        focusSelect.selectedIndex = Array.from(document.querySelectorAll("#focus_side_select option")).findIndex((elem) => {
            return elem.value === traits.focus;
        });
        document.querySelector("#mentality_select + span .ui-selectmenu-status").innerHTML = mentalitySelect.options[mentalitySelect.selectedIndex].innerHTML;
        document.querySelector("#attacking_select + span .ui-selectmenu-status").innerHTML = attackingSelect.options[attackingSelect.selectedIndex].innerHTML;
        document.querySelector("#focus_side_select + span .ui-selectmenu-status").innerHTML = focusSelect.options[focusSelect.selectedIndex].innerHTML;
    }

    function generateID() {
        let list = TMStorage.getIDsList();
        let id;
        if(list.freeIDs.length === 0) {
            id = list.highestUnusedID;
            ++list.highestUnusedID;
        } else {
            id = list.freeIDs.shift();
        }
        TMStorage.updateIDsList(list);
        return id;
    }

    function sortSelect(select) {
        let options = Array.from(select.getElementsByTagName("option"));
        options.sort((a, b) => {
            if(a.innerHTML < b.innerHTML) {
                return -1;
            } else if(a.innerHTML === b.innerHTML) {
                return 0;
            } else {
                return 1;
            }
        });
        select.innerHTML = '';
        for(let elem of options) {
            select.appendChild(elem);
        }
    }

    /**
     * @param {string} time Time in format HH:MM:SS
     */
    function changeLastUpdateTime(time) {
        let elem = document.getElementById('tactics_last_save');
        elem.innerHTML = time + "<img src='/pics/mini_green_check.png'/>";
    }

    function displayErrorNotice() {
        document.getElementById(APP_CONST.IDS.TACTICS_NOTICE_BOX).innerHTML = "Could not load tactics. See console for details.";
    }

    function saveTactics(name) {
        let id = generateID();
        let data = extractData();
        TMStorage.setName(id, name);
        TMStorage.setData(id, data);
        let select = document.getElementById(APP_CONST.IDS.SELECT_TACTICS);
        select.innerHTML += "<option value='" + id + "'>" + name + "</option>";
        sortSelect(select);
        select.selectedIndex = Array.from(select.getElementsByTagName("option")).findIndex((element) => {
            return Number(element.value) === id;
        });
    }

    function renameTactics(id, name) {
        TMStorage.setName(id, name);
        let select = document.getElementById(APP_CONST.IDS.SELECT_TACTICS);
        select.options[select.selectedIndex].innerHTML = name;
    }
    
    function updateTactics(id) {
        let data = extractData();
        TMStorage.setData(id, data);
    }
    
    function loadTactics(id) {
        let oldData = extractData();
        let data = TMStorage.getData(id);
        sendTacticsUpdate(oldData, data)
        .then((response) => {
            repositionPlayers(data.players, response[0].rec_stars);
            changeConditionalOrders(data.conditionalOrders);
            setTeamTraits({ 
                mentality: data.mentality,
                attacking: data.attacking,
                focus: data.focus
            });
            changeLastUpdateTime(response[0].time);
        })
        .catch((error) => {
            displayErrorNotice();
            console.log(error);
        });
    }
    
    function deleteTactics(id) {
        TMStorage.delete(id);
        let select = document.getElementById(APP_CONST.IDS.SELECT_TACTICS);
        select.removeChild(select.options[select.selectedIndex]);
    }

    function appendControls() {
        function clearNoticeBox() {
            document.getElementById(APP_CONST.IDS.TACTICS_NOTICE_BOX).innerHTML = '';
        }

        function createButton(id, text) {
            return "<span id='" + id + "' class='button' style='margin-left: 3px;'><span class='button_border'>" + text + "</span></span>";
        }

        function createSelect(id) {
            return "<select id='" + id + "' class='ui-selectmenu ui-state-default ui-selectmenu-popup' style='min-width: 200px; margin: 0 3px; line-height: 100%;'></select>"
        }

        function createInput(id) {
            return "<span style='display: inline-block;'><input id='" + id + "' type='text' class='embossed' style='min-width: 200px; line-height: 100%; padding: 3px 3px 4px 3px;' placeholder='Name or rename'></span>";
        }

        let elem = document.querySelector('.main_center .box .box_body');
        let controlsDiv = document.createElement('div');
        controlsDiv.innerHTML = createSelect(APP_CONST.IDS.SELECT_TACTICS) + createInput(APP_CONST.IDS.INPUT_TACTICS)
            + `<span id=${APP_CONST.IDS.TACTICS_NOTICE_BOX} style='padding-left: 3px;'></span>` + "<div style='padding-top: 3px;'></div>"
            + createButton(APP_CONST.IDS.BUTTON_TACTICS_SAVE, "保存") + createButton(APP_CONST.IDS.BUTTON_TACTICS_LOAD, "载入")
			+ createButton(APP_CONST.IDS.BUTTON_TACTICS_RENAME, "重命名")
            + createButton(APP_CONST.IDS.BUTTON_TACTICS_UPDATE, "更新")
            + createButton(APP_CONST.IDS.BUTTON_TACTICS_DELETE, "删除");
        controlsDiv.style.margin = '4px 3px 0 3px';
        elem.insertBefore(controlsDiv, elem.querySelector('.std'));

        let select = document.getElementById(APP_CONST.IDS.SELECT_TACTICS);
        let input = document.getElementById(APP_CONST.IDS.INPUT_TACTICS);

        document.getElementById(APP_CONST.IDS.BUTTON_TACTICS_SAVE).addEventListener('click', (e) => {
            clearNoticeBox();
            if(!input.value) {
                document.getElementById(APP_CONST.IDS.TACTICS_NOTICE_BOX).innerHTML = "战术名称不能为空！";
                return;
            }
            saveTactics(input.value);
        });

        document.getElementById(APP_CONST.IDS.BUTTON_TACTICS_RENAME).addEventListener('click', (e) => {
            clearNoticeBox();
            if(!input.value) {
                document.getElementById(APP_CONST.IDS.TACTICS_NOTICE_BOX).innerHTML = "战术名称不能为空！";
                return;
            }
            renameTactics(select.value, input.value);
        });

        document.getElementById(APP_CONST.IDS.BUTTON_TACTICS_UPDATE).addEventListener('click', (e) => {
            clearNoticeBox();
            updateTactics(select.value);
        });

        document.getElementById(APP_CONST.IDS.BUTTON_TACTICS_LOAD).addEventListener('click', (e) => {
            clearNoticeBox();
            loadTactics(select.value);
        });

        document.getElementById(APP_CONST.IDS.BUTTON_TACTICS_DELETE).addEventListener('click', (e) => {
            clearNoticeBox();
            deleteTactics(select.value);
        });
    }

    function initLoadTactics() {
        let savedTacticsIDs = GM_listValues().filter((value) => {
            return value.indexOf("TM_TACTICS_") === 0 && value.indexOf("_NAME") === -1 && value.indexOf("_LIST") === -1;
        }).map((value) => { return value.slice(11); });

        let select = document.getElementById(APP_CONST.IDS.SELECT_TACTICS);
        select.innerHTML = '';
        for(let id of savedTacticsIDs) {
            select.innerHTML += `<option value='${id}'>${TMStorage.getName(id)}</option>`;
        }
        sortSelect(select);
        select.selectedIndex = 0;
    }

    getTeamID()
    .then((teamID) => {
        appendControls();
        initLoadTactics();
    });

})();