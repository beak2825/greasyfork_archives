// ==UserScript==
// @name          Planets.nu - Ship List Plugin
// @namespace     vgap.plugins.shipList
// @version       1.3.12
// @date          2020-07-15
// @author        Space Pirate Harlock
// @description   Planets.NU add-on to automatically keep track of other players' fleets.
// @homepage      https://planets.nu/
// @license       GPL
// @include       https://planets.nu/*
// @include       https://play.planets.nu/*
// @include       http://play.planets.nu/*
// @include       https://test.planets.nu/*
// @include       https://mobile.planets.nu/*
// @resource      userscript https://greasyfork.org/en/scripts/405728-planets-nu-ship-list-plugin
// @require       https://cdn.jsdelivr.net/npm/ractive
// @downloadURL https://update.greasyfork.org/scripts/405728/Planetsnu%20-%20Ship%20List%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/405728/Planetsnu%20-%20Ship%20List%20Plugin.meta.js
// ==/UserScript==

/*
     Changelog:
     1.3.12     Feature: track robbed ships
     1.3.11     Bug fix: auto-sending messages
     1.3.10     Bug fix: ship notes
     1.3.9      Bug fix: save loop
     1.3.8      Feature: improved history lines
     1.3.7      Bug fix: player colors
                Bug fix: ship messages show in individual feed
     1.3.6      Bug fix: map tool
                Experimental: better history lines
     1.3.5      Bug fix: sending messages
     1.3.4      Bug fix: auto-sending messages
     1.3.3      Feature: added heading calculation for own ships
                Bug fix: yet another intercept bug
     1.3.2      Feature: added toggle to remove notes from own and allied ships
                Bug fix: minor cosmetic issues
     1.3.1      Bug Fix: sending ship info
     1.3.0      Feature: planetary info exchange
     1.2.6      Bug fix: hover info broken
     1.2.5      Feature: auto-send ship updates to players
     1.2.4      Feature: improved hover info, merge with ship list data
     1.2.3      Bug fix: ships of players without ambassador weren't shown
                Bug fix: removed padding from normal starship screen
                Bug fix: removed one line of ship history from notes
     1.2.2      Bug fix: improved regex for ship data - Nu whitespace
     1.2.1      Bug fix: fixed broken stuff
     1.2.0      Feature: Fleet Comparator
     1.1.6      Bug fix: send ship data dialog
     1.1.5      Bug fix: player toggles
                Bug fix: process activities not loaded
     1.1.4      Feature: rebuild current turn keeping prior turns
                Bug fix: location history not shown after using time machine
                Bug fix: intercepts
     1.1.3      Bug fix: freeze when checking processed activities
                Bug fix: own messages don't show a dialog anymore
     1.1.2      Feature: tracking of processed activities
                Bug fix: own ships were not shown
     1.1.1      Bug fix: rebuild loop wasn't async
                Bug fix: send ship data dialog
                Bug fix: ship data parsing
                Bug fix: delete game
     1.1.0      Feature: send ship data to other players
     1.0.10     Feature: map highlight when selecting a ship
                Bug fix: ship intercepts
                Bug fix: updateShipsFromVcr (heading)
                Bug fix: ship edit form (dropdowns)
     1.0.9      Bug fix: ship intercepts
                Bug fix: ship history notes formatting
     1.0.8      Bug fix: showScan again
     1.0.7      Bug fix: showScan in mobile client
     1.0.6      Feature: Support for non-mobile client
     1.0.5      Feature: Ships destroyed by mine hits get deleted
                Bug fix: Ghost ships made updateShips crash
     1.0.4      Feature: Notes saved from ship list
                Feature: Ship history saved to ship notes
                Bug fix: Ghost ships made showShips crash
                Bug fix: Not visible ships from allies weren't deleted
     1.0.3      Feature: Added toggle for compact tables
                Feature: Added hull name to ship scan
                Feature: Added turns ago to ship scan
                Feature: Added min-max mass to ship scan
     1.0.2      Bug fix: Loading stale notes after finishing time machine loop
     1.0.1      Feature: UI improvements for Firefox and mobile
                Bug fix: Notes weren't read in correctly (vgap.nowTurn)
     1.0.0      Initial release
     */

/*
     Known Issues:

     Roadmap:

     - Show dotted lines instead of dashed lines when history isn't consecutive
     - Track intercepts when rebuilding
     - Add info about towing ships and ships being towed
     - Make it possible to add ships without knowing their exact ID
     - Tooltip over ship showing notes
     */

// no globals (vgap)
/**
 *
 * @param {vgaPlanets}  vgap
 * @constructor
 */
const ShipList = function (vgap)
{

    if (vgap.version < 3.0) {
        console.log("Ship List: [3000] NU version < 3.0. Plugin Disabled.");
        return;
    }

    /** PROPERTIES */

    this.version = '1.3.12';

    // views
    this.view = 1;
    this.playerId = 1;
    this.hideWarningPane = false;

    // internal
    this.doImport = false;
    this.doLoop = false;
    this.doReset = false;
    this.editMode = false;
    this.enabled = false;
    this.maxShipId = 0;
    this.nowTurn = 0;
    this.appName = "Ship List";

    // serialized
    this.firstTurn = 0;
    this.intercepts = [];
    this.lastTurn = 0;
    this.ships = [];

    console.log('Ship List v' + this.version);

    /**
     * Initialize the app and its helpers
     * @returns {ShipList}
     */
    this.init = function ()
    {
        this.processedActivities = {};

        // quick hack to hide features in development
        if (vgap.player.username == 'space pirate harlock') this.devMode = true;

        this.activityIndex = null;
        this.gameName = vgap.game.name;
        this.importPrefix = 'EnemyShipListPlugin.';
        // https://greasyfork.org/en/scripts/6685-planets-nu-plugin-toolkit/code
        this.noteType = -parseInt(this.appName.replace(/[_\W]/g, ''), 36) % 2147483648;
        this.playerName = vgap.player.username;
        this.raceName = (vgap.getRace(vgap.player.raceid)).shortname;
        this.storagePrefix = 'ShipList.';
        this.storagePath = this.storagePrefix + vgap.gameId + '.' + vgap.player.id + '.';

        // view preferences
        this.settings = {
            addShipHistory: true,
            addShipHistoryForOwn: false,
            debugMode: true,
            deleteAfterImport: false,
            showFullAllies: true,
            showSafePassage: true,
            showShareIntel: true,
            showOwnShips: false,
            showUnknown: false,
            showColoredText: false,
            showCompactTable: false,
            showLocationHistory: true,
            showVerticalButtons: true,
            acceptShipData: {},
            updates: {},
            updates2: {}
        };

        // reuse the same instance or it's binding hell with dom elements
        if (!this.drawer)
            this.drawer = new DrawHelper(vgap, this.settings);
        else
            this.drawer.settings = this.settings;

        this.templater = new Templater();

        return this;
    }

    /** VGAP Hooks */

    /**
     * Called when redrawing the map
     * @namespace vgap.plugins.shipList
     */
    this.draw = function ()
    {
        const app = vgap.plugins.shipList;

        try {
            app.drawer.drawShips(app.ships);
            app.drawer.shipsDrawn = [];
        } catch (e) {
            console.log('[' + vgap.game.turn + '] (draw)');
            console.error(e);
            if (app.settings.debugMode)
                console.trace();
        }
    };

    /** Called when building the dashboard */
    this.loaddashboard = function ()
    {
        const app = vgap.plugins.shipList;

        try {
            let menu = document.getElementById("DashboardMenu").childNodes[2];
            $("<li>Ship List »</li>").tclick(_ => { app.showShips(1); }).appendTo(menu);
        } catch (e) {
            console.log('[' + vgap.game.turn + '] (loaddashboard)');
            console.error(e);
            if (app.settings.debugMode)
                console.trace();
        }
    };

    /** Called after loading the first turn to create the map */
    this.loadmap = function ()
    {
        const app = vgap.plugins.shipList;

        try {
            app.drawer.init();
            app.drawer.addMapTool();

            new ShipListCss({
                data: {
                    numPlayers: vgap.players.length,
                    colors: app.drawer.playerColors,
                    addHistory: app.settings.addShipHistory
                }
            });

            console.log('Ship List: [' + vgap.game.turn + '] (loadmap)');
        } catch (e) {
            console.log('Ship List: [' + vgap.game.turn + '] (loadmap)');
            console.error(e);
            if (app.settings.debugMode)
                console.trace();
        }
    };

    /** Called when loading a turn (current turn or time machine) */
    this.processload = function ()
    {
        const app = vgap.plugins.shipList;

        try {
            console.log('Ship List: [' + vgap.game.turn + '] (processload)');

            app.init();

            if (app.doReset) {
                app.doReset = false;
                app.ships = [];
                app.firstTurn = vgap.game.turn;
                app.lastTurn = vgap.game.turn - 1;
            } else {
                // load ships from storage
                // no need if we're looping
                if (!app.doLoop) app.load();

                // disable looping here instead of in processLoadHistory - doesn't get called on current turn
                // don't use vgap.nowTurn - hasn't been set at this point on first load
                // keep track of it ourselves on first load
                if (app.doLoop && !vgap.inHistory && vgap.game.turn == vgap.settings.turn) {
                    app.doLoop = false;
                }
                if (!vgap.inHistory) app.nowTurn = vgap.settings.turn;
            }

            if (!app.enabled) return;

            app.loopThroughActivities()
                .catch(e => {}) // e has been logged already, just continue
                .then(_ =>
                {

                    if (vgap.game.turn <= app.lastTurn) {
                        console.log('Ship List: [' + vgap.game.turn + '] (processload) Turn ' + vgap.game.turn + ' already processed, skipping.');
                    } else if (vgap.game.turn != (app.lastTurn + 1)) {
                        console.log('Ship List: [' + vgap.game.turn + '] (processload) Turn ' + vgap.game.turn + '. Turn for update required: ' + (app.lastTurn + 1) + ', skipping.');
                    } else {
                        app.updateShips();

                        if (vgap.game.turn == app.nowTurn)
                            app
                                .sendMessages()
                                .catch(e => {console.error(e);});
                    }

                    if (app.doLoop) {
                        console.log('Ship List: [' + vgap.game.turn + '] (processload) ' + vgap.game.turn + ' Next Turn: ' + (vgap.settings.turn + 1) + '/' + app.nowTurn + '.');

                        if (vgap.settings.turn + 1 == app.nowTurn) {
                            vgap.loadNow();
                        } else {
                            vgap.loadHistory(vgap.settings.turn + 1);
                        }
                    }

                })
                .catch(e => console.error(e))
            ;

        } catch (e) {
            console.log('Ship List: [' + vgap.game.turn + '] (processload)');
            console.error(e);
            if (app.settings.debugMode)
                console.trace();
        }
    };

    /** Called when viewing the home screen of the dashboard */
    this.showsummary = function ()
    {
        const app = vgap.plugins.shipList;

        try {
            let ships = app.ships;
            let shipCount = 0;
            app.maxShipId = vgap.settings.shiplimit;

            for (let i = app.ships.length - 1; i >= 0; i--) {
                if (ships[i].id > app.maxShipId) app.maxShipId = ships[i].id;
                if (ships[i].ownerid == vgap.player.id) continue;
                shipCount++;
            }

            let icon = $([
                '<span><div class="iconholder">',
                '<img src="https://planets.nu/_library/2013/7/enemy_ships.png"/>',
                '</div>', shipCount, ' Enemy Ships</span>',
            ]
                .join(''))
                .click(_ => { app.showShips(1); });

            if (vgap.isMobileVersion()) {
                $('<span></span>').append(icon).insertBefore($('#TurnSummary').find(':nth-child(5)'));
            } else {
                $('<li></li>').append(icon).insertBefore($('#TurnSummary').find(':first :nth-child(5)'));
            }
        } catch (e) {
            console.log('Ship List: [' + vgap.game.turn + '] (showsummary)');
            console.error(e);
            if (app.settings.debugMode)
                console.trace();
        }
    };

    /** loadplanet: Called when selecting a planet */

    /** loadstarbase: Called when selecting a planet */

    /** loadship: Called when selecting a ship */

    /** showdashboard: Called when switching to dashboard */

    /** showmap: Called when switching to starmap */

    /** MEAT AND BONES: SHIP LIST UPDATE FUNCTIONS */

    /**
     * Update the ship list with data from current turn
     * @returns {ShipList}
     */
    this.updateShips = function ()
    {
        console.log('Ship List: [' + vgap.game.turn + '] (updateShips) Updating Ships.');

        try {
            this.updateShipsFromIntercepts();
        }
        catch (e) { console.error(e); }

        try {
            this.updateShipsFromTowCaptureReports();
        }
        catch (e) { console.error(e); }

        const vcr = new vcrPlayer();

        try {
            for (let i = 0; i < vgap.vcrs.length; i++) {

                let ship;
                let shipIdx;
                let shipIds = this.ships.map((ship) => { return ship.id; });

                vcr.runReport(vgap.vcrs[i]);

                shipIdx = shipIds.indexOf(vgap.vcrs[i].left.objectid);

                if (vcr.results[0] == 'Left Destroyed') {
                    // delete ship
                    if (shipIdx != -1) this.ships.splice(shipIdx, 1);
                } else {
                    // build ship
                    ship = this.updateShipsFromVcr(vcr, vgap.vcrs[i], 0, shipIdx);
                }

                // ignore planets
                if (vgap.vcrs[i].battletype == 1) continue;

                // refresh ship ids
                shipIds = this.ships.map((ship) => { return ship.id; });

                shipIdx = shipIds.indexOf(vgap.vcrs[i].right.objectid);

                for (let j = 0; j < vcr.results.length; j++) {
                    if (vcr.results[j] == 'Right Destroyed') {
                        if (shipIdx != -1) this.ships.splice(shipIdx, 1);
                        break;
                    } else {
                        ship = this.updateShipsFromVcr(vcr, vgap.vcrs[i], 1, shipIdx);
                    }
                }
            }
        } catch (e) { console.error(e); }

        // before adding vgap ships
        try {
            this.updateShipsFromMinehitReports();
        } catch (e) { console.error(e); }

        // visible ships
        try {
            this.updateShipsFromVgap();
        } catch (e) { console.error(e); }

        this.ships.sort((a, b) => { return (a.id - b.id); });
        this.lastTurn = vgap.game.turn;
        this.save();
        return this;
    };

    this.updateShipsFromIntercepts = function ()
    {
        // if in history, abort - only end-of-turn data available
        if (vgap.inHistory) return this;

        const shipIds = this.ships.map((ship) => { return ship.id; });

        const vgapShipIds = vgap.ships.map((ship) => { return ship.id; });

        for (let i = this.intercepts.length - 1; i >= 0; i--) {
            const intercept = this.intercepts[i];

            // find source ship in vgap ship list
            const srcShipIdx = vgapShipIds.indexOf(intercept.srcId);

            // ship could have been destroyed - so check
            if (srcShipIdx != -1) {
                const srcShip = vgap.ships[srcShipIdx];

                // find target ship in app ship list
                const tgtShipIdx = shipIds.indexOf(intercept.tgtId)

                if (tgtShipIdx != -1) {
                    const tgtShip = this.ships[tgtShipIdx];

                    tgtShip.heading = Math.round((
                                                 90 - Math.atan2(srcShip.targety - tgtShip.y, srcShip.targetx - tgtShip.x)
                                                      * 180 / Math.PI + 360) % 360);
                    tgtShip.x = srcShip.targetx;
                    tgtShip.y = srcShip.targety;
                    tgtShip.infoturn = vgap.game.turn;
                    console.log('Ship List: [' + vgap.game.turn + '] (updateShipsFromIntercepts) Updating Ship.');
                }
            }
        }

        return this;
    };

    /**
     * Checks for ships destroyed by mine hits
     * @returns {ShipList}
     */
    this.updateShipsFromMinehitReports = function ()
    {
        let ships = [];
        let shipIds = this.ships.map((ship) => { return ship.id; });

        for (let i = vgap.messages.length - 1; i >= 0; i--) {
            const message = vgap.messages[i];

            // critical messages
            if (message.messagetype != 16) continue;

            const match = message.body.match(/#(\d+) has struck a mine!.*Damage is at: (\d+)/)

            if (match && match[2] >= 100) {
                ships.push([parseInt(match[1]), parseInt(match[2])]);
            }
        }

        for (let i = ships.length - 1; i >= 0; i--) {
            let shipIdx = shipIds.indexOf(ships[i][0]);

            if (shipIdx != -1 &&
                // Lizards
                ( vgap.players[this.ships[shipIdx].ownerid].raceid != 2 ||
                  ships[i][1] >= 150 )
            ) this.ships.splice(shipIdx, 1);
        }

        return this;
    };

    /**
     * Checks for ships destroyed by mine hits
     * @returns {ShipList}
     */

    this.updateShipsFromTowCaptureReports = function ()
    {
        let ships = [];
        let shipIds = this.ships.map((ship) => { return ship.id; });

        for (let i = vgap.messages.length - 1; i >= 0; i--) {
            const message = vgap.messages[i];

            // ship messages
            if (message.messagetype != 8) continue;

            const by = message.body.match(/Our ship has been captured by the starship: #(\d+)/)

            if (by) {
                const victim = message.headline.match(/#(\d+)$/);
                ships.push([parseInt(victim[1]), parseInt(by[1])]);
            }
        }

        for (let i = ships.length - 1; i >= 0; i--) {
            let victimIdx = shipIds.indexOf(ships[i][0]);
            let robberIdx = shipIds.indexOf(ships[i][1]);

            if (robberIdx != -1)
                this.ships[victimIdx].ownerid = this.ships[robberIdx].ownerid;
        }

        return this;
    };

    /**
     * Builds a ship object from VCR player and VCR report
     * @param {vcrPlayer}      vcr
     * @param {Object}         report   vcr Report object
     * @param {number}         ix       [0-1]
     * @param {number}         shipIdx
     * @returns {*}
     */
    this.updateShipsFromVcr = function (vcr, report, ix, shipIdx)
    {

        const combatInfo = vcr.Objects[ix];
        const side = ix == 0 ? 'left' : 'right';
        const shipInfo = report[side];

        let ownerId = report[side + 'ownerid'];

        for (let j = 0; j < vcr.results.length; j++) {
            if (vcr.results[j].toLowerCase() == side + ' captured') {
                ownerId = ix == 0 ? /** @type int */ report.rightownerid : /** @type int */ report.leftownerid;
            }
        }

        let ship = {
            id: shipInfo.objectid,
            name: shipInfo.name,
            ammo: combatInfo.BayCount ? combatInfo.Fighters : combatInfo.Torpedos,
            beams: combatInfo.BeamCount,
            beamid: combatInfo.BeamId,
            crew: combatInfo.Crew,
            damage: combatInfo.Damage,
            hullid: shipInfo.hullid,
            infoturn: vgap.game.turn,
            mass: combatInfo.Mass,
            ownerid: ownerId,
            torpedoid: combatInfo.TorpedoId,
            torps: combatInfo.LauncherCount,
            x: report.x,
            y: report.y,
        };

        if (shipIdx == -1) {
            // add missing properties
            $.extend(ship, {
                engineid: 0,
                heading: -1,
                history: [],
                warp: -1
            });
            this.updateShipHistory(ship, ship);
            this.ships.push(ship);
        } else {
            let oldShip = this.ships[shipIdx];
            this.updateShipHistory(oldShip, ship);
            $.extend(true, oldShip, ship);
        }

        if (this.settings.addShipHistory) this.updateShipNote(ship);

        if (this.settings.debugMode) {
            console.log('Ship List: [' + vgap.game.turn + '] (updateShipsFromVcr) Adding Ship.');
            console.log(ship);
        }

        return ship;
    };

    /**
     * Update ship list from VGAP ship list
     * @returns {ShipList}
     */
    this.updateShipsFromVgap = function ()
    {
        // mark all ships in list invisible
        for (let i = this.ships.length - 1; i >= 0; i--) {
            this.ships[i].visible = false;
        }

        let shipIds = this.ships.map((ship) => { return ship.id; });

        // loop through vgap ship list
        for (let i = vgap.ships.length - 1; i >= 0; i--) {
            const vgapShip = vgap.ships[i];
            //support for sphere add-on
            if (vgapShip.id < 0) continue;

            let ship = {
                id: vgapShip.id,
                name: vgapShip.name,
                heading: vgapShip.heading,
                hullid: vgapShip.hullid,
                infoturn: vgapShip.infoturn,
                mass: vgapShip.mass,
                ownerid: vgapShip.ownerid,
                targetx: vgapShip.targetx,
                targety: vgapShip.targety,
                visible: true,
                warp: vgapShip.warp,
                x: vgapShip.x,
                y: vgapShip.y
            };

            let shipIdx = shipIds.indexOf(vgapShip.id);

            if (shipIdx == -1) {
                // add missing properties
                $.extend(ship, {
                    ammo: vgapShip.ammo,
                    beamid: vgapShip.beamid,
                    beams: vgapShip.beams,
                    crew: vgapShip.crew,
                    damage: vgapShip.damage,
                    engineid: vgapShip.engineid,
                    heading: -1,
                    history: [],
                    torpedoid: vgapShip.torpedoid,
                    torps: vgapShip.torps
                });

                this.updateShipHistory(ship, ship);
                this.ships.push(ship);
                if (this.settings.addShipHistory) this.updateShipNote(ship);
            } else {
                if (vgapShip.ammo) ship.ammo = vgapShip.ammo;
                if (vgapShip.beamid) ship.beamid = vgapShip.beamid;
                if (vgapShip.beams) ship.beams = vgapShip.beams;
                if (vgapShip.crew != -1) ship.crew = vgapShip.crew;
                if (vgapShip.damage != -1) ship.damage = vgapShip.damage;
                if (vgapShip.engineid) ship.engineid = vgapShip.engineid;
                if (vgapShip.torpedoid) ship.torpedoid = vgapShip.torpedoid;
                if (vgapShip.torps) ship.torps = vgapShip.torps;

                let oldShip = this.ships[shipIdx];
                this.updateShipHistory(oldShip, ship);
                $.extend(true, oldShip, ship);
                if (this.settings.addShipHistory) this.updateShipNote(oldShip);
            }
        }

        // get ids of vgap ships
        const vgapShipIds = vgap.ships.map((ship) => { return ship.id; });

        // delete own ships / from share intel / full allies that aren't visible
        for (let i = this.ships.length - 1; i >= 0; i--) {
            if (vgapShipIds.indexOf(this.ships[i].id) == -1 &&
                ( vgap.getRelationFromForShip(this.ships[i].ownerid) >= 3 ||
                  this.ships[i].ownerid == vgap.player.id )
            ) this.ships.splice(i, 1);
        }

        return this;
    };

    /**
     * Update ship history
     * @param {Object}      oldShip     ship info to be updated
     * @param {Object}      newShip     ship info to update with
     * @returns {Object} oldShip
     */
    this.updateShipHistory = function (oldShip, newShip)
    {
        if (oldShip.history.length == 0 || oldShip.history[0].turn < newShip.infoturn) {
            oldShip.history.unshift({
                turn: newShip.infoturn,
                x: newShip.x,
                y: newShip.y,
                mass: newShip.mass
            });
        }
        while (oldShip.history.length > 5) oldShip.history.pop();
        oldShip.history.sort(function (a, b)
        {
            return (b.turn - a.turn);
        });

        return oldShip;
    };

    /**
     * Add ship history to ship note
     * @param {Object}      ship
     * @returns {ShipList}
     */
    this.updateShipNote = function (ship)
    {
        const start = '\n---SHIP HISTORY---';
        const note = vgap.getNote(ship.id, 2);
        const body = note.body.split(start);
        const rows = [];

        rows.push(body[0]);

        if ((this.settings.addShipHistoryForOwn && (ship.ownerid == vgap.player.id || vgap.fullallied(ship.ownerid))) ||
            (this.settings.addShipHistory && ship.ownerid != vgap.player.id && !vgap.fullallied(ship.ownerid))
        ) {
            rows.push(start);
            rows.push('\nT', ship.infoturn.toString().padEnd(3, ' '), '', ship.x, ',', ship.y, ' W', (ship.warp == -1 ? '?' : ship.warp),
                ' H', ship.heading ? ship.heading.toString().padStart(3, ' ') : '   ', ship.mass.toString().padStart(5, ' '), 'kt');

            if (body.length > 1) {
                const turns = body[1].split('\n');
                // remove empty strings
                for (let i = turns.length - 1; i >= 0; i--) {
                    if (turns[i] == "") turns.splice(i, 1);
                }
                // remove gibberish
                for (let i = turns.length - 1; i >= 0; i--) {
                    if (turns[i].search(/^T\d+ /) == -1) turns.splice(i, 1);
                }
                // remove first row if same as current turn
                const match = turns[0].match(/^T(\d+)/);
                if (match && match[1] == vgap.game.turn) turns.shift();
                // remove rows if more than 4
                while (turns.length > 4) turns.pop();
                // add newline before first row
                if (turns.length > 0) turns[0] = '\n' + turns[0];
                rows.push(rows, turns.join('\n'));
            }

            note.body = rows.join('');
        } else {
            note.body = body[0];
        }
        note.changed = 1;
        return this;
    };

    /** HTML */

    /**
     * HTML for Ship List tabs
     * @param {number}  view
     * @param {number}  playerId [1]
     * @returns {ShipList}
     */
    this.showShips = function (view, playerId)
    {

        if (view)
            this.view = view;

        if (playerId)
            this.playerId = playerId;

        vgap.playSound("button");
        vgap.closeSecond();
        vgap.dash.content.empty();

        this.ractive = new Ractive({
            el: vgap.dash.content,
            components: {
                menu: ShipListMenu,
                warningPane: ShipListWarningPane
            },
            data: {
                app: this,
                vgap: vgap
            },
            template: [
                '<menu app="{{app}}"/>',
                '<div id="dashPane">',
                '<warningPane/>',
                '<#main/>',
                '<#main/>',
                '</div>'
            ].join('')
        });

        // disable hotkeys in edit mode
        // if (this.editMode) vgap.hotkeysOn = false;

        switch (this.view) {
            case 1:
                this.ractive.attachChild(new ShipListOverviewPane(), {target: 'main'});
                return this;
            case 2:
            //this.ractive.attachChild(new ShipListSelectionPaneComplete(), {target: 'main'});
            case 3:
            case 4:
            //this.ractive.attachChild(new ShipListSelectionPaneAllied(), {target: 'main'});
            case 5:
            case 6:
                //this.ractive.attachChild(new ShipListSelectionPaneSingle(), {target: 'main'});
                //this.ractive.attachChild(new ShipListShipsPane(), {target: 'main'});
                //return this;
                break;
            case 7:
                this.ractive.attachChild(new ShipListSettingsPane(), {target: 'main'});
                return this;
            case 8:
                this.ractive.attachChild(new ShipListStoragePane(), {target: 'main'});
                return this;
            case 9:
                this.ractive.attachChild(new ShipListFleetsPane(), {target: 'main'});
                return this;
        }

        let pane = $('#dashPane');

        console.time('showShips');
        if (this.view == 2) this.ractive.attachChild(new ShipListSelectionPaneComplete(), {target: 'main'});
        //if (view == 2) this.showSelectionPaneComplete(pane, view, playerId);
        if (this.view == 4) this.ractive.attachChild(new ShipListSelectionPaneAllied(), {target: 'main'});

        //if (view == 4) this.showSelectionPaneAllied(pane, view, playerId);
        if (this.view == 6) {
            //this.showSelectionPaneSingle(pane, view, playerId);
            this.ractive.attachChild(new ShipListSelectionPaneSingle(), {target: 'main'});
            this.showShipForm($('#newShipForm'), this.view, this.playerId);
        }
        if (this.ships.length) this.showShipTableHeader(pane, this.view, this.playerId);

        const shipIds = this.ships.map(function (ship)
        {
            return ship.id;
        });

        const shipRows = $('#ShipRows');
        const freighterRows = $('#FreighterRows');
        const shortEngineNames = ['?', 'SD1', 'SD2', 'SD3', 'SSD4', 'ND5', 'HND6', 'QD7', 'HD8', 'TW'];
        const shortBeamNames = ['?', 'Las', 'X-Ray', 'Pla', 'Bla', 'Posi', 'Dis', 'HB', 'PH', 'HD', 'HP'];
        const shortTorpNames = ['?', 'Mk1', 'Prot', 'Mk2', 'GaB', 'Mk3', 'Mk4', 'Mk5', 'Mk6', 'Mk7', 'Mk8', 'QT'];

        // loop through all ship ids
        for (let id = 1; id <= this.maxShipId; id++) {
            const shipIdx = shipIds.indexOf(id);

            if (shipIdx == -1) {
                // no unknown ships or not complete view - continue
                if (!this.settings.showUnknown || this.view != 2) continue;
                shipRows.append('<tr>' + (!this.editMode ? '' : '<td></td>') + '<td>' + id + '</td><td>-</td><td>-</td><td>-</td><td>-</td><td></td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>');
                continue;
            }

            let ship = this.ships[shipIdx];

            const relation = vgap.getRelationFromForShip(ship.ownerid);

            // thanks to Jellyfishspam for this one
            // ghost ship - continue loop
            if (!ship.ownerid) continue;

            if (
                //ships of other players
            (this.view == 3 && ship.ownerid == vgap.player.id) ||
            //allies (>= safe passage)
            (this.view == 4 && (
                relation == 1 ||
                (relation == 2 && !this.settings.showSafePassage) ||
                (relation == 3 && !this.settings.showShareIntel) ||
                (relation == 4 && !this.settings.showFullAllies) ||
                (ship.ownerid == vgap.player.id && !this.settings.showOwnShips)
            )) ||
            //non-allies
            (this.view == 5 &&
             (ship.ownerid == vgap.player.id || vgap.alliedTo(ship.ownerid))
            ) ||
            //single player
            (this.view == 6 && ship.ownerid != this.playerId)
            ) continue;

            const hull = vgap.getHull(ship.hullid);
            const player = vgap.getPlayer(ship.ownerid);

            let beam_weapons = '?';

            if (hull.beams == 0) {
                beam_weapons = "---";
            } else if (ship.beams != 0 && ship.beamid != 0) {
                beam_weapons = (ship.beams ? ship.beams + ' ' : '') + shortBeamNames[ship.beamid];
            }

            let secondary_weapons = '?';

            if (hull.fighterbays > 0) {
                secondary_weapons = hull.fighterbays + (hull.fighterbays == 1 ? ' Bay' : ' Bays');
            } else if (hull.launchers > 0) {
                if (ship.torps == -1 || ship.torpedoid == -1) secondary_weapons = "?";
                else if (ship.torps == 0 || ship.torpedoid == 0) secondary_weapons = "---";
                else secondary_weapons = ( ship.torps ? ship.torps + ' ' : '') + shortTorpNames[ship.torpedoid];
            } else secondary_weapons = "---";

            let row = [
                '<tr class="shipRow' + player.id + (this.settings.showColoredText ? ' alt' : '') + '">',
                !this.editMode ? '' : '<td><div class="BasicFlatButton" onclick="vgap.plugins.shipList.deleteShip(' + ship.id + ').showShips(' + this.view + ',' + this.playerId + ');">Delete</div></td>',
                '<td>' + ship.id + '</td>',
                '<td>' + player.username + '</td>',
                '<td>' + vgap.getRace(player.raceid).shortname.substr(3) + '</td>',
                '<td title="' + hull.name + '"><img class="TinyIcon" src="' + vgap.hullImg(ship.hullid) + '"/><div style="display: none;">' + hull.id + '</div></td>',
                '<td>' + ship.name + '</td>',
                '<td class="noteIcon"></td>',
                '<td>(' + ship.x + "," + ship.y + ')</td>',
                '<td>' + ship.infoturn + '</td>',
                '<td>' + (ship.heading > -1 ? ship.heading : '?') + '</td>',
                '<td>' + ship.warp + '</td>',
                '<td>' + (ship.engineid > 0 ? shortEngineNames[ship.engineid] : '?') + '</td>',
                '<td>' + beam_weapons + '</td>',
                '<td>' + secondary_weapons + '</td>',
                '<td>' + ((ship.ammo == -1) ? '?' : ship.ammo) + '</td>',
                '<td>' + ship.mass + '</td>',
                '<td>' + ((ship.crew == -1) ? '?' : ship.crew) + '</td>',
                '<td>' + ((ship.damage == -1) ? '?' : ship.damage) + '</td>',
                '</tr>'
            ].join('');

            const note = vgap.getNote(ship.id, 2).body;

            const noteRow = [
                '<tr class="shipRow' + player.id + (this.settings.showColoredText ? ' alt' : '') + ' noteRow tablesorter-childRow">',
                '<td colspan="' + (this.editMode ? '18' : '17') + '">',
                '<form>',
                '<label for="note' + ship.id + '">Ship Notes</label>',
                '<textarea class="note" id="note' + ship.id + '" name="body">' + note + '</textarea>',
                '</form>',
                '</td>',
                '</tr>'
            ].join('');

            if (this.view == 6 && hull.beams == 0 && hull.launchers == 0 && hull.fighterbays == 0) {
                row = $(row).appendTo(freighterRows);
                freighterRows.append(noteRow);
            } else {
                row = $(row).appendTo(shipRows);
                shipRows.append(noteRow);
            }

            if (this.view == 6 && this.editMode) {
                row.on('fill-form', this.fillShipForm.bind(this));
                row.click(function ()
                {
                    $(this).trigger('fill-form', [ship.id, this.playerId]);
                    pane.data('jsp').scrollToElement($('#ShipEditTable'));
                });
            } else {
                row.children().eq(6).hover((function (ship)
                {
                    this.showScan(ship);
                }).bind(this.drawer, ship), this.drawer.hideScan.bind(this.drawer));

                row.click((function (x, y, id, ships)
                {
                    vgap.showMap();
                    vgap.map.centerMap(x, y, true);
                    this.selectPlayer(id)
                        .drawShips(ships);
                }).bind(this.drawer, ship.x, ship.y, ship.ownerid, this.ships));
            }

            // add slide toggle for notes row
            row.children('.noteIcon').click(function (e)
            {
                $(this)
                    .toggleClass('down')
                    .parent().next().slideToggle();
                e.stopPropagation();
            });

            // save note on blur
            row.next().find('textarea').blur(function ()
            {
                const note = vgap.getNote(ship.id, 2);
                note.body = $(this).val();
                note.changed = 1;
            });

        }

        //add freighters and warships to end of list
        this.showUnknownShipsSingle(this.view, this.playerId, shipRows, freighterRows);

        $('#ShipTable').tablesorter({cssChildRow: 'tablesorter-childRow'});
        shipRows.find('td:nth-child(2)').addClass('capitalize');

        if (this.view == 6) {
            $("#FreighterTable").tablesorter();
            freighterRows.find('td:nth-child(2)').addClass('capitalize');
        }

        pane.jScrollPane({animateScroll: true, hideFocus: true});
        // fix annoying scroll up behavior
        $('#newShipForm *').off('focus');
        // remove focus handler on textareas
        shipRows.find('textarea').off('focus');
        freighterRows.find('textarea').off('focus');

        // vgap.action added for the assistant
        vgap.showShipsViewed = 1;
        vgap.action();

        console.timeEnd('showShips');

        return this;
    };

    /** Unknown Ships for "Single Player" view */
    this.showUnknownShipsSingle = function (view, playerId, shipRows, freighterRows)
    {
        if (view == 6 && this.settings.showUnknown) {

            const player = vgap.getPlayer(playerId);
            const race = vgap.getRace(player.raceid).shortname.substr(3);
            const warshipTotal = vgap.getPlayerScore(player.id, "capitalships");
            const freighterTotal = vgap.getPlayerScore(player.id, "freighters");
            let warshipCount = 0;
            let freighterCount = 0;
            let row = '<tr class="shipRow"' + playerId + '>' + (this.editMode ? '<td></td>' : '') + '<td>-</td><td>' + player.username + '</td><td>' + race + '</td><td>-</td><td>-</td><td></td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>';
            let rows = [];

            for (let i = this.ships.length - 1; i >= 0; i--) {
                let ship = this.ships[i];

                if (ship.ownerid != player.id) continue;

                let hull = vgap.getHull(ship.hullid);
                if (hull.beams == 0 && hull.launchers == 0 && hull.fighterbays == 0) {
                    freighterCount++;
                } else {
                    warshipCount++;
                }
            }

            for (let i = warshipCount; i < warshipTotal; i++) {
                rows.push(row);
            }
            shipRows.append(rows.join(''));

            for (let i = freighterCount; i < freighterTotal; i++) {
                rows.push(row);
            }
            freighterRows.append(rows.join(''));
        }
        return this;
    };

    /**
     * Update ships from received data
     * @param data
     * @returns {ShipList}
     */
    this.processActivity = function (data)
    {
        /** @todo add version check and abort if incompatible */

        const ships = data.ships;
        const planets = data.planets;

        if (ships) {
            for (let i = ships.length - 1; i >= 0; i--) {
                const shipIds = this.ships.map((ship) => { return ship.id; });

                let ship = ships[i];
                let shipIdx = shipIds.indexOf(ship.id);

                // nasty stuff - what to merge?
                if (shipIdx != -1) {
                    let listShip = this.ships[shipIdx];

                    if (ship.infoturn >= listShip.infoturn) {
                        // ammo could be 0 after vcr, so keep new value
                        //ship.ammo
                        ship.beamid = ship.beamid ? ship.beamid : listShip.beamId;
                        ship.beams = ship.beams ? ship.beams : listShip.beams;
                        ship.crew = ship.crew ? ship.crew : listShip.crew;
                        ship.damage = ship.damage != -1 ? ship.damage : listShip.damage;
                        ship.engineid = ship.engineid ? ship.engineid : listShip.engineid;
                        ship.torpedoid = ship.torpedoid ? ship.torpedoid : listShip.torpedoid;
                        ship.torps = ship.torps ? ship.torps : listShip.torps;
                        // imported ship more recent: false, same turn: keep visibility
                        ship.visible = ship.infoturn > listShip.infoturn ? false : listShip.visible;
                    } else {
                        ship.ammo = listShip.ammo ? listShip.ammo : ship.ammo;
                        ship.beamid = listShip.beamId ? listShip.beamId : ship.beamid;
                        ship.beams = listShip.beams ? listShip.beams : ship.beams;
                        ship.crew = listShip.crew ? listShip.crew : ship.crew;
                        ship.damage = listShip.damage != -1 ? listShip.damage : ship.damage;
                        ship.engineid = listShip.engineid ? listShip.engineid : ship.engineid;
                        ship.heading = listShip.heading;
                        ship.mass = listShip.mass;
                        ship.name = listShip.name;
                        ship.ownerid = listShip.ownerid;
                        ship.targetx = listShip.targetx;
                        ship.targety = listShip.targety
                        ship.torpedoid = listShip.torpedoid ? listShip.torpedoid : ship.torpedoid;
                        ship.torps = listShip.torps ? listShip.torps : ship.torps;
                        ship.visible = listShip.visible;
                        ship.warp = listShip.warp;
                        ship.x = listShip.x;
                        ship.y = listShip.y;
                    }

                    // merge history

                    ship.history = ship.history.concat(listShip.history);

                    ship.history.sort((a, b) => { return (b.turn - a.turn); });

                    let prev = 0;

                    for (let j = ship.history.length - 1; j >= 0; j--) {
                        let turn = ship.history[j].turn;

                        if (ship.history[j].turn == prev)
                            ship.history.splice(j, 1);

                        prev = turn;
                    }

                    /** @todo update ship notes from history if addShipHistory is true */
                }

                this.saveShip(ship, true);
            }
        }

        if (planets) {
            for (let i = planets.length - 1; i >= 0; i--) {
                if (planets[i].infoturn > vgap.planets[i].infoturn)
                    vgap.planets[i] = planets[i];
            }
        }

        return this;
    };

    /**
     * So checkActivity doesn't have to recursively call itself
     * Beware call stack exceeded-man
     * @returns {Promise.<ShipList>}
     */
    this.loopThroughActivities = async function ()
    {
        if (this.activityIndex == null)
            this.activityIndex = vgap.activity.length - 1;

        while (this.activityIndex > -1)
            await this
                .checkActivity()
                .catch(e =>
                {
                    console.error(e);
                    // rethrow to exit loop
                    throw e;
                    //this.activityIndex = -1;
                })
            ;

        // save processed activities
        this.save();

        return this;
    }

    /**
     * Check activities for ship list data
     * @returns {Promise.<ShipList>}
     */
    this.checkActivity = async function ()
    {
        const activity = vgap.activity[this.activityIndex];

        // processed or from yourself

        if ((!this.devMode && vgap.activity[this.activityIndex].isfromme) ||
            this.processedActivities[activity.id]
        ) {
            this.activityIndex--;
            return this;
        }

        const match = activity
                .message
                .match(/Ship Data on (.+) from (.+)<br\/><br\/>JSON_START(.+)J\s?S\s?O\s?N\s?_\s?E\s?N\s?D\s?$/)
            ;

        if (!match) {
            this.activityIndex--;
            return this;
        }

        // strip annoying whitespace NU adds
        let data = match[3].replace(/\s/g, '');

        try {
            data = JSON.parse(decodeURIComponent(data));
        }
        catch (e) {
            console.log('Ship List: [' + vgap.game.turn + '] (checkActivity) Invalid JSON.');
            this.activityIndex--;
            return this;
        }

        // security check - no spoofing
        if (activity.sourceid != vgap.players[data.from - 1].accountid) {
            let spoofer;

            for (let i = vgap.players.length - 1; i >= 0; i--) {
                if (activity.sourceid == vgap.players[j].accountid) {
                    spoofer = vgap.players[i];

                    this.settings.acceptShipData[spoofer.id] = false;

                    new ShipListInfoDialog({
                        data: {
                            title: 'Ship List: Cheating Alert!',
                            from: match[2],
                            name: spoofer.username,
                            width: 400
                        },
                        partials: {
                            main: Ractive.partials['checkDataAlert']
                        }
                    });
                    /*
                    nu.info(this.templater.get('alertSpoofer', {
                        from: match[2],
                        name: spoofer.username
                    }), 'Ship List: [4003] Cheating Alert!', 400);
                    */

                    break;
                }
            }
        }

        // auto ignore
        if (this.settings.acceptShipData[data.from] == false) {
            this.activityIndex--;
            return this;
        }

        // auto accept
        if (this.settings.acceptShipData[data.from] == true) {
            this.processActivity(data);
            this.activityIndex--;
            return this;
        }

        const promise = (...args) =>
        {
            return new Promise((resolve, reject) =>
            {
                new ShipListModalDialog({
                    data: {
                        title: 'Accept Ship List Data?',
                        on: match[1],
                        from: vgap.players[data.from - 1],
                        app: this,
                        width: 500
                    },
                    on: {
                        accept (ctx) {
                            this.get('app').settings.acceptShipData[data.from] = ctx.getBinding();
                            resolve(true);
                            this.teardown();
                        },
                        ignore (ctx) {
                            this.get('app').settings.acceptShipData[data.from] = ctx.getBinding();
                            resolve(false);
                            this.teardown();
                        },
                        no () {
                            resolve(false);
                            this.teardown();
                        },
                        yes () {
                            this.get('app').processActivity(data);
                            resolve(true);
                            this.teardown();
                        }
                    },
                    partials: {
                        main: Ractive.partials['dataAccept']
                    }
                });
            });
        };

        await promise();

        // only track activities for players not auto-accepted or auto-ignored

        if (this.settings.acceptShipData[data.from] == undefined)

            this.processedActivities[activity.id] = true;

        this.activityIndex--;

        return this;
    };

    this.sendMessages = async function ()
    {
        const messages = {};

        for (let to in this.settings.updates) {
            messages[to] = {};
            for (let on in this.settings.updates[to]) {
                if (parseInt(on))
                    messages[to][on] = 'ships';
            }
        }

        for (let to in this.settings.updates2) {
            for (let on in this.settings.updates2[to]) {
                if (parseInt(on))
                    if (messages[to][on])
                        messages[to][on] = 'all';
                    else
                        messages[to][on] = 'planets';
            }
        }

        for (let to in messages)
            for (let on in messages[to])
                this.sendMessage(on, to, messages[to][on]);

        return this;
    }

    this.sendMessage = function (on, to, type)
    {
        const planets = [];
        const ships = [];

        let json = {
            from: vgap.player.id,
            version: this.version
        };

        if (type == 'all' || type == 'planets') {
            for (let i = vgap.planets.length - 1; i >= 0; i--) {
                if (vgap.planets[i].ownerid == on) planets.push(this.ships[i]);
            }

            json.planets = planets;
        }

        if (type == 'all' || type == 'ships') {
            for (let i = this.ships.length - 1; i >= 0; i--) {
                if (this.ships[i].ownerid == on) ships.push(this.ships[i]);
            }

            json.ships = ships;
        }

        vgap.postGameMessage([
            'Ship Data on ', vgap.players[on - 1].username.ucWords(), ' from ', vgap.players[vgap.player.id - 1].username.ucWords(), '\n\n',
            'JSON_START',
            // encodeURIComponent - NU corrupts JSON
            encodeURIComponent(JSON.stringify(json)),
            'JSON_END'
        ].join(''), null, to);
    }

    this.hideMessages = function ()
    {
        const messages = $('#egameactivity').find('.egamefeedline');

        messages.each(function ()
        {
            const message = $(this).find('.eexcerpt').text();

            if (message && message.match(/\s+Ship Data on .+ from .+\s/)) {
                $(this).css('display', 'none');
            }
        });
    }

    this.showShipForm = function (target, view, playerId)
    {
        if (!(view == 6) || !this.editMode) return this;

        let engineTypes = [...vgap.engines];
        engineTypes.unshift({id: 0, name: 'Unknown'});
        let beamTypes = [...vgap.beams];
        beamTypes.unshift({id: 0, name: 'Unknown'});
        let torpTypes = [...vgap.torpedos];
        torpTypes.unshift({id: 0, name: 'Unknown'});

        target.append([
            '<div id="ShipEditPane">',
            '<table id="ShipEditTable">',
            '<tr><th>Id</th><th>Hull</th><th>Name</th></tr>',
            '<tr><td><select id="id"><optgroup id="optGroupOwn" label="Owned Ships"/><optgroup id="optGroupNew" label="Unknown Ships"/></select></td><td><select id="hullid"/></td><td><input id="name" size="30"></td></tr>',
            '<tr><th></th><th>Engine(s)</th></tr>',
            '<tr><td rowspan="3"><input id="visible" type="hidden" value="false"><input id="history" type="hidden" value="[]"><input id="ownerid" type="hidden" value="' + playerId + '"><img id="hullImg"/></td><td>',
            this.templater.get('selectBox', {id: 'engineid', options: engineTypes}),
            '</td></tr>',
            '<tr><th>Beam Type</th><th>Beam #</th></tr>',
            '<tr><td>',
            this.templater.get('selectBox', {id: 'beamid', options: beamTypes}),
            '</td><td><input id="beams" size="4"></td></tr>',
            '<tr><th></th><th>Torp Type</th><th>Tube #</th></tr>',
            '<tr><td></td><td>',
            this.templater.get('selectBox', {id: 'torpedoid', options: torpTypes}),
            '</td><td><input id="torps" size="4"></td></tr>',
            '<tr><th rowspan="2"></th><td colspan="2"><table id="ShipMiscTable">',
            '<tr><th>Turn</th><th>X</th><th>Y</th><th>Heading</th><th>Warp</th><th>Ammo</th><th>Mass</th><th>Crew</th><th>Dmg</th></tr>',
            '<tr><td><input id="infoturn" size="4" value="' + vgap.game.turn + '"></td><td><input id="x" size="4" value="2000"></td><td><input id="y" size="4" value="2000"></td>',
            '<td><input id="heading" size="4" value="0"></td><td><input id="warp" size="4" value="0"></td><td><input id="ammo" size="4" value="0"></td>',
            '<td><input id="mass" size="4" value="0"></td><td><input id="crew" size="4" value="0"></td><td><input id="damage" size="4" value="0"></td></tr>',
            '</table></td></tr>',
            '<tr><td colspan="3"><div id="shipSaveButton" class="BasicFlatButton">Save</div>',
            '<div id="shipResetButton" class="BasicFlatButton">Reset</div></td></tr>',
            '</table></div>'
        ].join(''));

        /** Select Box Fillers */

        let player = vgap.getPlayer(playerId);
        let race = vgap.getRace(player.raceid);
        let shipForm = $('#newShipForm');
        let idSelect = $('#id');
        let shipHullSelect = $('#hullid');
        let shipEngineSelect = $('#engineid');
        let shipBeamSelect = $('#beamid');
        let shipTorpSelect = $('#torpedoid');
        let optGroupNew = $('#optGroupNew');
        let optGroupOwn = $('#optGroupOwn');
        let options;

        let id = 1;
        for (let i = 0; i < this.ships.length; i++) {
            while (id < this.ships[i].id) {
                optGroupNew.append('<option value="' + id + '">' + id + '</option>');
                id++;
            }
            if (this.ships[i].ownerid == playerId) {
                optGroupOwn.append('<option value="' + id + '">' + id + '</option>');
            }
            id++;
        }

        while (id <= this.maxShipId) {
            optGroupNew.append('<option value="' + id + '">' + id + '</option>');
            id++;
        }
        idSelect.val((optGroupNew).find(':first').val());

        options = [];
        let hulls = race.hulls.split(',');
        for (let i = 0; i < hulls.length; i++) {
            options.push('<option value="' + hulls[i] + '">' + vgap.getHull(hulls[i]).name + '</option>');
        }

        options.push('<option value="0">-------</option>');
        hulls = vgap.hulls;
        for (let i = 0; i < hulls.length; i++) {
            options.push('<option value="' + hulls[i].id + '">' + hulls[i].name + '</option>');
        }
        shipHullSelect.append(options.join(''));

        /** Event Handlers */

        shipForm.change(this.changeShipForm);

        idSelect.on('fill-form', this.fillShipForm.bind(this));
        idSelect.change(function ()
        {
            $(this).trigger('fill-form', [$(this).val(), playerId]);
        });

        shipHullSelect.change(function ()
        {
            const val = $(this).val();
            // new ships - add name of hull
            if (val != 0 && !newShip.overwrite) {
                const hull = vgap.getHull(val);
                $('#name').val(hull.name);
                $('#beams').val(hull.beams);
                $('#torps').val(hull.launchers);
                $('#crew').val(hull.crew);
                $('#hullImg')[0].src = hullImg(hull.id);
            }
        });

        // fill form when loading the page
        shipHullSelect.trigger('change');

        /** @this ShipList */
        $('#shipSaveButton').click((function (view, playerId)
        {
            shipForm.trigger('change');
            console.log('Ship List: [2017] (newShipForm) Saving Ship ' + newShip.ship.id + '.');
            console.log(newShip);
            this.saveShip(newShip.ship, newShip.overwrite).showShips(view, playerId);
        }).bind(this, view, playerId));

        $('#shipResetButton').click(function ()
        {
            shipForm.trigger('reset');
            // DUPLICATE CODE - REFACTOR
            $('#shipListPlayer').val(playerId);
            idSelect.val(optGroupNew.find(':first').val());
            // hidden fields don't reset
            $('#history').val('[]');
            newShip = {overwrite: false, ship: {}};
            // update hull and name
            shipHullSelect.trigger('change');
        });

        return this;
    };

    this.fillShipForm = function (e, shipId, playerId)
    {

        const shipIds = this.ships.map((ship) => { return ship.id; });

        shipId = parseInt(shipId);

        let shipIdx = shipIds.indexOf(shipId);

        if (shipIdx != -1) {
            let ship = this.ships[shipIdx];
            newShip.overwrite = true;
            $('#id').val(ship.id);
            $('#hullid').val(ship.hullid);
            $('#hullImg')[0].src = hullImg(ship.hullid);
            $('#name').val(ship.name);
            $('#history').val(JSON.stringify(ship.history));
            $('#engineid').val(ship.engineid);
            $('#beamid').val(ship.beamid == -1 ? 0 : ship.beamid);
            $('#beams').val(ship.beams);
            $('#torpedoid').val(ship.torpedoid);
            $('#torps').val(ship.torps);
            $('#infoturn').val(ship.infoturn);
            $('#x').val(ship.x);
            $('#y').val(ship.y);
            $('#heading').val(ship.heading > -1 ? ship.heading : '');
            $('#warp').val(ship.warp > -1 ? ship.warp : '');
            $('#ammo').val(ship.ammo);
            $('#mass').val(ship.mass);
            $('#crew').val(ship.crew > -1 ? ship.crew : '');
            $('#damage').val(ship.damage > -1 ? ship.damage : '');
            $('#visible').val(ship.visible);
            newShip.ship = ship;
        } else {
            newShip.overwrite = false;
            $('#newShipForm').trigger('reset');
            $('#shipListPlayer').val(playerId);
            $('#id').val(shipId);
            // hidden fields don't reset
            $('#history').val('[]');
            $('#visible').val('false');
            $('#hullid').trigger('change');
            newShip.ship = {};
        }
        return this;
    };

    /**
     * Event handler for ship form change
     * @returns {ShipList}
     */
    this.changeShipForm = function ()
    {
        let ship = newShip.ship;

        ship.id = parseInt($('#id').val());
        ship.ownerid = parseInt($('#ownerid').val());
        ship.hullid = parseInt($('#hullid').val());
        ship.engineid = parseInt($('#engineid').val());
        ship.beamid = parseInt($('#beamid').val());
        ship.beams = parseInt($('#beams').val());
        ship.torpedoid = parseInt($('#torpedoid').val());
        ship.torps = parseInt($('#torps').val());
        ship.infoturn = parseInt($('#infoturn').val());
        ship.x = parseInt($('#x').val());
        ship.y = parseInt($('#y').val());
        ship.heading = parseInt($('#heading').val());
        ship.warp = parseInt($('#warp').val());
        ship.ammo = parseInt($('#ammo').val());
        ship.mass = parseInt($('#mass').val());
        ship.crew = parseInt($('#crew').val());
        ship.damage = parseInt($('#damage').val());
        ship.visible = ($('#visible').val() == 'true');

        for (let key in ship) {
            if (isNaN(ship[key])) ship[key] = -1;
        }

        ship.name = $('#name').val();
        ship.history = JSON.parse($('#history').val());
        console.log(newShip);

        return this;
    };

    /** Ship table header */
    this.showShipTableHeader = function (target, view, playerId)
    {

        let warshipsTotal = vgap.getPlayerScore(playerId, "capitalships");
        let freightersTotal = vgap.getPlayerScore(playerId, "freighters");
        let warshipsKnown = 0;
        let freightersKnown = 0;

        if (view == 6) {
            for (let i = this.ships.length - 1; i >= 0; i--) {
                let ship = this.ships[i];

                if (ship.ownerid != playerId) continue;

                let hull = vgap.getHull(ship.hullid);

                if (hull.beams == 0 && hull.launchers == 0 && hull.fighterbays == 0) {
                    freightersKnown++;
                } else {
                    warshipsKnown++;
                }
            }
        }

        target.append(
            this.templater.get('headerShipTable', {
                compact: this.settings.showCompactTable,
                edit: this.editMode,
                extra: view == 6,
                warshipsKnown: warshipsKnown,
                warshipsTotal: warshipsTotal,
                freightersKnown: freightersKnown,
                freightersTotal: freightersTotal
            }));

        return this;
    };

    /** PERSISTENCE */

    /**
     * Load app data from storage or initialize empty list
     * @returns {ShipList}
     */
    this.load = function ()
    {
        /**
         * get from VGAP note
         * will not work when looping - notes in time machine don't get written
         * so disabled in earlier turns
         */
        if (vgap.game.turn == vgap.settings.turn && !this.doLoop) {
            let data = this.fromNote('data');

            if (data) {
                this.ships = data.ships;
                $.extend(this.settings, data.settings);
                this.firstTurn = data.firstTurn;
                this.lastTurn = data.lastTurn;
                $.extend(this.processedActivities, data.activities);
                this.enabled = true;
                return this;
            }
        }

        // get from Local Storage
        let str = this.fromStorage('data');

        if (str) {
            try {
                if (this.settings.debugMode) console.log(str);
                let data = JSON.parse(str);
                this.ships = data.ships;
                $.extend(this.settings, data.settings);
                this.firstTurn = data.firstTurn;
                this.lastTurn = data.lastTurn;
                this.enabled = true;
                console.log('Ship List: [' + vgap.game.turn + '] (load) Loaded Game Data from Local Storage.')
                this.save(); // toNote
            } catch (e) {
                console.log('Ship List: [' + vgap.game.turn + '] (load) Corrupt Local Storage Game Data.');
                console.log(str);
            }
            if (this.settings.debugMode) console.log(this);
            return this;
        }

        // compatibility mode
        console.log('Ship List: [' + vgap.game.turn + '] (load) Compatibility Mode.')
        this.storagePath = this.importPrefix + vgap.gameId + '.' + vgap.player.id + '.';

        const stored_version = this.fromStorage('version');
        const stored_list = this.fromStorage('shiplist');
        const stored_turn = this.fromStorage('turn');
        const first_turn = this.fromStorage('firstturn');

        if (stored_version) {
            this.enabled = true;
            this.ships = JSON.parse(stored_list);
            this.lastTurn = parseInt(stored_turn);
            this.firstTurn = parseInt(first_turn);

            if (stored_version < 1.40) {
                for (let i = this.ships.length - 1; i >= 0; i--) {
                    this.ships[i].history = [];
                }
            }
            this.doImport = true;
            console.log('Ship List: [' + vgap.game.turn + '] (load) Converting Game Data.');
            if (this.settings.deleteAfterImport) this.deleteGame(vgap.gameId, vgap.player.id);
            this.storagePath = this.storagePrefix + vgap.gameId + '.' + vgap.player.id + '.';
            this.save();
            this.doImport = false;
        } else {
            this.storagePath = this.storagePrefix + vgap.gameId + '.' + vgap.player.id + '.';
            console.log('Ship List: [' + vgap.game.turn + '] (load) No Game Data Found.');
            this.reInitialize();
        }

        if (this.settings.debugMode) console.log(this);
        return this;
    };

    /**
     * Save app data to local storage
     * @returns {ShipList}
     */
    this.save = function ()
    {
        if (!this.enabled) return this;

        console.log('Ship List: [' + vgap.game.turn + '] (save) Saving Game Data.')

        const data = {
            version: this.version,
            ships: this.ships,
            firstTurn: this.firstTurn,
            lastTurn: this.lastTurn,
            gameName: this.gameName,
            intercepts: this.intercepts,
            playerName: this.playerName,
            raceName: this.raceName,
            settings: this.settings,
            activities: this.processedActivities
        };

        if (this.settings.debugMode) console.log(data);

        // saving notes in time machine does f*all
        if (vgap.game.turn == this.nowTurn) {
            this.toNote('data', data);
        }

        const old = this.fromStorage('data');

        try {
            this.toStorage('data', JSON.stringify(data));
        } catch (e) {
            this.toStorage(old);

            // abort loop
            this.doLoop = false;

            nu.info([
                'Your browser has run out of Local Storage space. ',
                'Please go to the "Storage" tab to delete data, ',
                'then try re-enabling the plugin.'
            ].join(''), this.appName + ' Error 4002: No Storage Available.', 400);
        }

        return this;
    };

    /**
     * Get from local storage
     * @param key
     * @returns {*}
     */
    this.fromStorage = function (key)
    {
        if ($.isPlainObject(key)) {
            const self = this;
            $.each(key, (k, v) => { v = localStorage.getItem(self.storagePath + k); });
            return key;
        }
        return localStorage.getItem(this.storagePath + key);
    };

    /**
     * Save to local storage
     * @param key
     * @param data
     * @returns {*}
     */
    this.toStorage = function (key, data)
    {
        // hash
        if ($.isPlainObject(key)) {
            const self = this;
            $.each(key, function (k, v)
            {
                localStorage.setItem(self.storagePath + k, v);
            });
            return key;
        }
        // 2 arguments
        localStorage.setItem(this.storagePath + key, data);

        return data;
    };

    /** Thanks to McNimble for the pointers to using notes. */

    /** Get data from VGAP notes
     * returns {*}
     */
    this.fromNote = function (key)
    {
        try {
            let noteId = 0;
            let arr = [];

            let chunks = JSON.parse(vgap.getNote(noteId--, this.noteType).body).chunks;

            for (let i = 0; i < chunks; i++) {
                arr.push(vgap.getNote(noteId--, this.noteType).body);
            }

            let obj = JSON.parse(arr.join(''));

            console.log('Ship List: [' + vgap.game.turn + '] (fromNote) VGAP Note Read Success.');

            return obj[key];
        } catch (e) {
            console.log('Ship List: [' + vgap.game.turn + '] (fromNote) VGAP Note Read Error.');
            console.error(e);
            console.trace();
        }
    };

    /** Save data to VGAP notes
     * @param key
     * @param value
     * @returns {ShipList}
     */
    this.toNote = function (key, value)
    {
        try {
            let noteId = 0;
            let obj = {};
            obj[key] = value;

            let match = JSON.stringify(obj).match(/.{1,16384}/g);
            let chunks = match.length;

            let note = vgap.getNote(noteId--, this.noteType);
            note.body = JSON.stringify({chunks: chunks});
            note.changed = 1;

            for (let i = 0; i < chunks; i++) {
                note = vgap.getNote(noteId--, this.noteType);
                note.body = match[i];
                note.changed = 1;
            }

            //vgap.save();
            console.log('Ship List: [' + vgap.game.turn + '] (toNote) VGAP Note Save Success.');
        } catch (e) {
            console.log('Ship List: [' + vgap.game.turn + '] (toNote) VGAP Note Save Error.');
            console.error(e);
            console.trace();
        }
        return this;
    };

    /** UTILITIES */

    /**
     * Delete data for a given game and player
     * @param   gameId         int
     * @param   playerId       int
     * @returns {ShipList}
     */
    this.deleteGame = function (gameId, playerId)
    {
        console.log('Ship List: [' + vgap.game.turn + '] (deleteGame) Deleting Game Data.');

        const path = this.storagePrefix + gameId + '.' + playerId + '.';

        if (this.doImport) {
            let keys = ['version', 'shiplist', 'turn', 'firstturn', 'player', 'race', 'game_name'];
            for (let i = keys.length - 1; i >= 0; i--) {
                localStorage.removeItem(path + keys[i]);
            }
        } else {
            localStorage.removeItem(path + 'data');
        }

        if (gameId == vgap.gameId && playerId == vgap.player.id) {
            this.reInitialize();
            this.enabled = false;
        }

        return this;
    };

    /**
     * Delete all game data from local storage
     * @returns {ShipList}
     */
    this.deleteAllGames = function ()
    {

        console.log('Ship List: [' + vgap.game.turn + '] (deleteAllGames) Deleting Game Data.');

        let prefix = this.storagePrefix;
        let re = new RegExp(prefix + '\\d+\\.\\d+\\.data');

        for (let key in localStorage) {
            if (re.test(key)) localStorage.removeItem(key);
        }
        return this;
    };

    /**
     * Delete a ship (ship form)
     * @param id    id of ship to remove
     * @returns {ShipList}
     */
    this.deleteShip = function (id)
    {
        for (let i = this.ships.length - 1; i >= 0; i--) {
            if (this.ships[i].id == id) {
                this.ships.splice(i, 1);
                break;
            }
        }
        this.save();
        return this;
    };

    /**
     * Enable app
     * @returns {ShipList}
     */
    this.enable = function ()
    {
        /** @todo Remove Local Storage check once we switch entirely to notes */
        try {
            localStorage.setItem(this.storagePrefix, this.version);
        } catch (err) {
            nu.info([
                'Your browser has run out of Local Storage space. ',
                'Please go to the "Storage" tab to delete data, ',
                'then try re-enabling the plugin.'
            ].join(''), this.appName + ' Error 4001: No Storage Available.', 400);
        } finally {
            localStorage.removeItem(this.storagePrefix);
        }
        this.enabled = true;
        return this;
    };

    /** Exports all game data to JSON */
    this.exportGameData = function ()
    {
        const appData = {};

        for (let key in localStorage) {
            if (key.indexOf(this.storagePrefix) != -1) {
                appData[key] = localStorage.getItem(key);
            }
        }

        let blob = new Blob([JSON.stringify(appData)], {type: 'text/json;charset=utf-8'});
        /** @namespace window.URL.createObjectURL */
        let url = window.URL.createObjectURL(blob);
        let a = $('<a style="display:none" href="' + url + '" download="ShipList.json"></a>')
                .appendTo($('#MessageInbox'))
            ;
        // jQuery click doesn't work for default event
        a[0].click();
        a.remove();
        /** @namespace window.URL.revokeObjectURL */
        window.URL.revokeObjectURL(url);
    };

    /** Import JSON game data */
    this.importGameData = function ()
    {
        console.log('Ship List: [' + vgap.game.turn + '] (importGameData) Starting Import.');

        let fileInput = $('#fileInput');

        if (fileInput[0].files.length == 0) return;

        const file = fileInput[0].files[0];
        const read = new FileReader();
        const self = this;

        // reset fileInput
        fileInput.val('');

        read.onload = function ()
        {
            let obj;

            try {
                obj = JSON.parse(read.result.toString())
            }
            catch (e) {
                new ShipListInfoDialog({
                    data: {
                        title: 'Ship List: Invalid JSON',
                        name: file.name,
                        width: 400
                    },
                    partials: {main: Ractive.partials['gameInvalidJson']}
                });
                /*
                nu.info([
                    file.name + ' does not contain valid JSON data. ',
                    'Please try again with a correct game export file.'
                ].join(''), 'Ship List: [4002] Invalid JSON.', 400);
                */
                return;
            }
            console.log(obj);

            // load saved app data
            const appData = {};
            for (let key in localStorage) {
                if (key.indexOf(self.storagePrefix) != -1) {
                    appData[key] = localStorage.getItem(key);
                }
            }

            // remove all app data
            self.deleteAllGames();

            // save uploaded data
            let err;
            $.each(obj, (key, val) =>
            {
                if (key.indexOf(self.storagePrefix) != 0) {
                    err = true;
                    return false;
                }
                localStorage.setItem(key, val);
                return true;
            });

            // revert if an error occurred

            if (err) {
                self.deleteAllGames();
                self.enabled = true;
                $.each(appData, (key, val) => { localStorage.setItem(key, val); });

                new ShipListInfoDialog({
                    data: {
                        title: 'Ship List: Invalid Game Data',
                        name: file.name,
                        width: 400
                    },
                    partials: {main: Ractive.partials['gameInvalidData']}
                });
                /*
                nu.info([
                    file.name + ' does not contain valid Ship List data. ',
                    'Please try again with a correct game export file.'
                ].join(''), 'Ship List: [4003] Invalid Game Data.', 400);
                */
                return;
            }

            self.enabled = true;
            self.showShips();
        };
        read.readAsText(file);
    };

    /**
     * Start looping through turns
     * @param turn
     * @returns {ShipList}
     */
    this.initLoop = function (turn)
    {
        if (!turn) turn = this.lastTurn + 1;
        if (turn < 1 || turn > vgap.nowTurn) return this;

        if (turn == vgap.nowTurn) {
            vgap.loadNow();
        } else {
            this.doLoop = true;
            console.log('Ship List: [' + vgap.game.turn + '] (initLoop) Looping from turn ' + turn + ' to ' + vgap.nowTurn + '.');
            vgap.loadHistory(turn);
        }

        return this;
    };

    /**
     * Empty ship list and update from given turn
     * @param turn  int
     * @returns     {ShipList}
     */
    this.rebuildShips = function (turn)
    {
        console.log('Ship List: [' + vgap.game.turn + '] (rebuildShips) Updating from turn ' + turn + '.');

        if (!turn) turn = vgap.game.turn;

        if (turn > vgap.nowTurn || turn < 1) return this;

        this.doReset = true;
        this.initLoop(turn);

        return this;
    };

    /**
     * Reset game defaults
     * @returns {ShipList}
     */
    this.reInitialize = function ()
    {
        console.log('Ship List: [' + vgap.game.turn + '] (reInitialize) Reinitializing.');
        this.ships = [];
        this.firstTurn = vgap.game.turn;
        this.lastTurn = vgap.game.turn - 1;
        this.maxShipId = vgap.settings.shiplimit;
        if (this.settings.debugMode) console.log(this);
        return this;
    };

    /**
     * Empty ship list and update from current turn
     * @returns {ShipList}
     */
    this.resetShips = function ()
    {
        console.log('Ship List: [' + vgap.game.turn + '] (resetShips) Updating from current turn.');

        this.ships = [];
        this.firstTurn = vgap.game.turn;
        this.lastTurn = vgap.game.turn - 1;

        this.updateShips();

        vgap.showDashboard();
        return this;
    };

    /**
     * Save a ship (ship form)
     * @param ship        {*} ship
     * @param update        boolean
     * @returns {ShipList}
     */
    this.saveShip = function (ship, update)
    {
        const shipIds = this.ships.map((ship) => { return ship.id; });

        const shipIdx = shipIds.indexOf(ship.id);

        if (shipIdx != -1 && update)
            this.ships.splice(shipIdx, 1);

        this.ships.push(ship);

        this.ships.sort((a, b) => { return (a.id - b.id); });

        this.save();

        return this;
    };
}; // end ShipList

/** VIEW COMPONENTS */

/**
 * Ship List CSS
 * @constructor
 */
const ShipListCss = Ractive.extend({
    append: true,
    colorToRGBA (color, alpha) {
        const red = hexToR(color);
        const green = hexToG(color);
        const blue = hexToB(color);

        return "rgba(" + red + ", " + green + ", " + blue + ", " + alpha + ")";
    },
    cutHex (h) { return (h.charAt(0) == "#") ? h.substring(1, 7) : h },
    el: 'head',
    hexToR (h) { return parseInt((cutHex(h)).substring(0, 2), 16) },
    hexToG (h) { return parseInt((cutHex(h)).substring(2, 4), 16) },
    hexToB (h) { return parseInt((cutHex(h)).substring(4, 6), 16) },
    on: {
        init () {
            if ($('#shipListCss').length)
                $('#shipListCss').remove();
        }
    },
    template: [
        '<style id="shipListCss" type="text/css">',
        '#MessageInbox, #ShipPane {margin:0px 0px 50px 0px}',
        '#dashPane {height:calc(100% - 75px);clear:left;}',
        '#playerToggles {position:absolute;right:40px;top:0px;}',
        '#playerToggles.hori {display:flex;}',
        '#playerToggles .mapbutton {relative;margin:0px 0px 10px 10px;}',
        '#playerToggles .mapbutton::before {font-family:"Arial" !important;font-weight:600}',
        '#playerToggles .hideToggles::before {font-family:"Font Awesome 5 Free" !important;font-weight:900;content:"\\f105"}',
        '#playerToggles .player0::before{content:"All";color:#fff}#playerToggles .player0.active::before{content:"All";color:#ff0}',
        '.shipListTool::before {content:"\\f135"}',
        '#ShipTable, #FreighterTable, #PlayerSelectionTable, #ConfigTable {width:100%;border-spacing:0;margin-bottom:20px}',
        '#ShipTable th, #FreighterTable th {white-space:nowrap;padding:10px 5px}',
        '#MessageInbox #ShipTable td, #MessageInbox #FreighterTable td {white-space:nowrap;padding:10px 5px}',
        '#MessageInbox #ShipTable.compact td, #MessageInbox #FreighterTable.compact td {padding:3px 3px}',
        '#ShipTable th, #FreighterTable th, .BasicFlatButton:hover {background-color:#666}',
        '#ShipTable tr:hover, #FreighterTable tr:hover, #ConfigTable tr:hover {background-color:#333;cursor:pointer}',
        '#FreighterTable td {border-bottom: solid 1px #666}',
        '#SettingsTable{border-spacing:0}#SettingsTable tr:hover{background-color:#111}',
        '#WarningPane .BasicFlatButton, #ConfigTable .BasicFlatButton, #newShipForm .BasicFlatButton {float:left;margin:0px 20px 0px 0px;display:inline-block;width:80px;text-align:center}',
        '#newShipForm{padding:0px}#newShipForm td,#newShipForm th{text-align:center}',
        '#newShipForm label, .ConfigForm label {display:inline-block; cursor:pointer}',
        '#newShipForm input, #newShipForm select, .ConfigForm input, .ConfigForm select {-webkit-appearance:auto;font-size:13px;height:16px;border-radius:8px;padding:8px 15px;width:-webkit-fill-available;text-align:center;border:none;background-color:#111 !important;color:#fff !important;box-sizing:content-box}',
        '#newShipForm input[type=checkbox], .ConfigForm input[type=checkbox] {height:16px;width:16px;cursor:pointer}',
        '#newShipForm select[multiple] {height:{{numPlayers * 30}}px;margin:0 30px;width:fit-content;border-radius:0;padding:0;overflow:hidden}',
        '#newShipForm select[multiple] option {box-sizing:border-box;padding:7px;height:30px}',
        '#hullImg {width:90px;height:90px;margin:0px 5px;background-color:#000}',
        '#ShipEditPane, #PlayerSelectionPane, #WarningPane {display:table;background-image:url(https://mobile.planets.nu/img/game/dashboardbg.png);border-radius:10px;width:calc(100% - 32px);margin-bottom:10px;padding:10px}',
        '#WarningTable {display:inline-block;width:calc(100% - 20px)}',
        '#ShipRows .BasicFlatButton {border-radius:6px;padding:2px 15px;margin:3px}',
        '#ShipRows form, #FreighterRows form {padding:0px 20px}',
        '.EnemyItem .lval, .AllyItem .lval, .MyItem .lval {font-size:11px !important;color:#ccc !important;line-height:15px !important}',
        '.ItemSelection.ShipSeen img {top:60px}',
        '.warning{color:#f90}.center{text-align:center}.capitalize {text-transform:capitalize}',
        '.noteIcon::before {content:"\\f15c";font-family:"Font Awesome 5 Free";display:inline-block;width:20px;font-weight:900;color:#00ffff;-webkit-font-smoothing:antialiased;text-align:center;}',
        '.noteIcon.down::before{content:"\\f0d8"}.noteRow{display:none}',
        '.heading::before {color: #339999;content: "\\f14e";}',
        '.mass::before {color: #333399;content: "\\f5cd";}',
        'textarea.note {margin:0 0 0 5px;width:75%;height:120px;background-color:#333;border:solid 2px #000;color:#fff}',
        '.closeIcon {float:right;}',
        '.closeIcon::before {content:"\\f00d";font-family:"Font Awesome 5 Free";display:inline-block;width:16px;font-weight:900;color:#00ffff;-webkit-font-smoothing:antialiased;text-align:center;}',
        'section.popup: {max-width:max-content !important}',
        'form.modalForm {padding:0px}',
        'form.modalForm .table {margin:0px}',
        'form.modalForm .td {border:0;padding:10px 15px 10px 0px}',
        'form.modalForm label {white-space:nowrap;margin:0}',
        '{{#colors}}',
        '.player{{@index}}::before {content:"{{@index}}";color:#fff}',
        '.player{{@index}}.active::before {content:"{{@index}}";color:{{this}}}',
        '.shipRow{{@index}} {background-color:{{@this.colorToRGBA(this, 0.5)}}}',
        '.shipRow{{@index}}.alt {color:{{this}};background-color:transparent}',
        '{{/colors}}',
        '{{#if addHistory}}.GoodTextNote {font: .9em "Roboto Mono", "Lucida Console", monospace;white-space:pre-wrap}{{/if}}',
        // SimpTip CSS - (c) Arash Manteghi under MIT license
        "[data-tooltip]{position:relative;display:inline-block;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box}[data-tooltip]:before,[data-tooltip]:after{position:absolute;visibility:hidden;opacity:0;z-index:999999;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;-webkit-transform:translate3d(0, 0, 0);-moz-transform:translate3d(0, 0, 0);transform:translate3d(0, 0, 0)}[data-tooltip]:before{content:'';border:6px solid transparent}[data-tooltip]:after{height:22px;padding:11px 11px 0 11px;font-size:13px;line-height:11px;content:attr(data-tooltip);white-space:nowrap}[data-tooltip].simptip-position-top:before{border-top-color:#323232}[data-tooltip].simptip-position-top:after{background-color:#323232;color:#ecf0f1}[data-tooltip].simptip-position-top.half-arrow:before{border-right:7px solid #323232}[data-tooltip]:hover,[data-tooltip]:focus{background-color:transparent}[data-tooltip]:hover:before,[data-tooltip]:hover:after,[data-tooltip]:focus:before,[data-tooltip]:focus:after{opacity:1;visibility:visible}.simptip-multiline.simptip-position-top:before,.simptip-position-top:after{left:50%;-webkit-transform:translateX(-50%);-moz-transform:translateX(-50%);-ms-transform:translateX(-50%);-o-transform:translateX(-50%);transform:translateX(-50%)}.simptip-position-top:after{width:auto}.half-arrow.simptip-position-top:before{border-style:none;border-right:7px solid #323232}.simptip-position-top:before,.simptip-position-top:after{bottom:100%}.simptip-position-top:before{margin-bottom:-5px}.simptip-position-top:after{margin-bottom:7px}.simptip-position-top:hover:before,.simptip-position-top:hover:after{-webkit-transform:translate(-50%, 0px);-moz-transform:translate(-50%, 0px);-ms-transform:translate(-50%, 0px);-o-transform:translate(-50%, 0px);transform:translate(-50%, 0px)}.simptip-smooth:after{-webkit-border-radius:4px;border-radius:4px}.simptip-fade:before,.simptip-fade:after{-webkit-transition:opacity 0.2s linear,visibility 0.2s linear;-moz-transition:opacity 0.2s linear,visibility 0.2s linear;-o-transition:opacity 0.2s linear,visibility 0.2s linear;-ms-transition:opacity 0.2s linear,visibility 0.2s linear;transition:opacity 0.2s linear,visibility 0.2s linear}.simptip-multiline:after{height:auto;width:150px;padding:11px;line-height:19px;white-space:normal;text-align:left}.simptip-success.simptip-position-top:before{border-top-color:#62c462}.simptip-success.simptip-position-top:after{background-color:#62c462;color:#ecf0f1}.simptip-success.simptip-position-top.half-arrow:before{border-right:7px solid #62c462}.simptip-info.simptip-position-top:before{border-top-color:#5bc0de}.simptip-info.simptip-position-top:after{background-color:#5bc0de;color:#ecf0f1}.simptip-info.simptip-position-top.half-arrow:before{border-right:7px solid #5bc0de}.simptip-danger.simptip-position-top:before{border-top-color:#e74c3c}.simptip-danger.simptip-position-top:after{background-color:#e74c3c;color:#ecf0f1}.simptip-danger.simptip-position-top.half-arrow:before{border-right:7px solid #e74c3c}.simptip-warning.simptip-position-top:before{border-top-color:#e67e22}.simptip-warning.simptip-position-top:after{background-color:#e67e22;color:#ecf0f1}.simptip-warning.simptip-position-top.half-arrow:before{border-right:7px solid #e67e22}",
        '</style>'
    ].join('')
});

/**
 * Info Dialog
 * @constructor
 */
const ShipListInfoDialog = Ractive.extend({
    append: true,
    el: 'body',
    on: {
        render () {
            $(this.find('.popup')).width(this.get('width')).center().drags({handle: "header"});
        },
        ok () {
            this.teardown();
        }
    },
    template: [
        '<section class="popup">', '' +
                                   '<data on-click="ok"><i class="fas fa-times"></i></data>',
        '<header>{{title}}</header>',
        '<article class="esimplewincontent">' +
        '<form class="modalForm"><table>',
        '{{>main}}',
        '</table></form>' +
        '<div class="center">',
        '<span id="ok" on-click="ok" class="button eadd">Ok</span>',
        '</div>',
        '</article>',
        '</section>'
    ].join('')
});

//noinspection JSUnusedLocalSymbols
/**
 * Menu
 * @constructor
 */
const ShipListMenu = Ractive.extend({
    data: _ =>
    {
        return {
            items: [
                {view: 1, title: 'Summary'},
                {view: 9, title: 'Fleets'},
                {view: 2, title: 'All Ships'},
                {view: 3, title: 'Other Players'},
                {view: 4, title: 'Allies'},
                {view: 5, title: 'Enemies'},
                {view: 6, title: 'Single Player'},
                {view: 7, title: 'Settings'},
                {view: 8, title: 'Storage'}
            ]
        };
    },
    on: {
        view (ctx, view) {
            this.set('view', view);
            this.get('app').showShips(view);
        }
    },
    template: [
        '<ul class="FilterMenu">',
        '{{#items}}',
        '<li on-click="[\'view\', view]"{{#if view == ~/app.view}} class="SelectedFilter"{{/if}}>{{title}}</li>',
        '{{/items}}',
        '</ul>'
    ].join('')
});

/**
 * Modal Dialog
 * @constructor
 */
const ShipListModalDialog = Ractive.extend({
    append: true,
    el: 'body',
    on: {
        render () {
            $(this.find('.popup')).width(this.get('width')).center().drags({handle: "header"});
        },
        no () {
            this.teardown();
        }
    },
    template: [
        '<section class="popup">', '' +
                                   '<data on-click="no"><i class="fas fa-times"></i></data>',
        '<header>{{title}}</header>',
        '<article class="esimplewincontent">' +
        '<form class="modalForm"><table>',
        '{{>main}}',
        '</table></form>' +
        '<div class="center">',
        '<span id="yes" on-click="yes" class="button eadd">Yes</span>',
        '<span id="cancel" on-click="no" class="button enav">Cancel</span>',
        '</div>',
        '</article>',
        '</section>'
    ].join('')
});

/** Fleets Pane
 * @constructor
 */
const ShipListFleetsPane = Ractive.extend({
    isolated: false,
    on: {
        complete () {
            $('#FreighterTable').tablesorter();
            $('#ShipTable').tablesorter();
            $('#dashPane').jScrollPane({hideFocus: true});
            $('#newShipForm *').off('focus');

        },
        render () {
            if (!this.get('showFleet1')) this.set('showFleet1', [1]);
            if (!this.get('showFleet2')) this.set('showFleet2', [2]);
            this.parseFleets();
        },
        show () {
            this.parseFleets();
            $('#FreighterTable').tablesorter();
            $('#ShipTable').tablesorter();
            $('#dashPane').jScrollPane({hideFocus: true});
            $('#newShipForm *').off('focus');
        }
    },
    parseFleets () {
        let fleets = [[], []];
        let ships = this.get('app').ships;

        for (let i = ships.length - 1; i >= 0; i--) {
            let fleetIdxs = [];
            if (this.get('showFleet1').indexOf(ships[i].ownerid) != -1) fleetIdxs.push(0);
            if (this.get('showFleet2').indexOf(ships[i].ownerid) != -1) fleetIdxs.push(1);

            for (let j = fleetIdxs.length - 1; j >= 0; j--) {
                fleets[fleetIdxs[j]][ships[i].hullid] = {
                    name: this.get('vgap').getHull(ships[i].hullid).name,
                    img: this.get('vgap').hullImg(ships[i].hullid),
                    tech: this.get('vgap').getHull(ships[i].hullid).techlevel,
                    count: fleets[fleetIdxs[j]][ships[i].hullid] ? ++fleets[fleetIdxs[j]][ships[i].hullid].count : 1
                };
            }
        }

        fleets[0].sort(this.sortFleet);
        fleets[1].sort(this.sortFleet);

        this.set('fleets', fleets);
    },
    sortFleet (a, b) {
        return !(b.tech - a.tech) ?
            (a.name < b.name ? -1 : (a.name > b.name ? 1 : 0)) :
            b.tech - a.tech
    },
    template: [
        '<form id="newShipForm">',
        '<div id="PlayerSelectionPane">',
        '<table id="PlayerSelectionTable">',
        '<tr><th><label for="shipListPlayer">Select Fleets To Compare</label></th></tr>',
        '<tr><td>',
        '<select multiple id="showFleet1" value="{{showFleet1}}" class="capitalize" on-change="show">',
        '{{#vgap.players}}',
        '<option value="{{id}}">{{fullname}}</option>',
        '{{/vgap.players}}',
        '</select>',
        '<select multiple id="showFleet2" value="{{showFleet2}}" class="capitalize" on-change="show">',
        '{{#vgap.players}}',
        '<option value="{{id}}">{{fullname}}</option>',
        '{{/vgap.players}}',
        '</select>',
        '</td>',
        '</table>',
        '</div>',
        '</form>',
        '<div id="ShipPane">',
        '<table style="width:100%"><tr><td style="width:50%;vertical-align:top">',
        '<table id="ShipTable"{{#if app.settings.showCompactTable}} class="compact"{{/if}}>',
        '<thead><tr><th>Count</th><th></th><th>Name</th><th>Tech</th>',
        '</tr></thead>',
        '<tbody id="ShipRows">',
        '{{#fleets.0}}',
        '{{#this}}', // catch null values in fleets
        '<tr><td>{{count}}</td><td><img class="TinyIcon" src="{{img}}"/></td><td>{{name}}</td><td>{{tech}}</td></tr>',
        '{{/.}}',
        '{{/fleets.0}}',
        '</tbody>',
        '</table>',
        '</td><td style="width:50%;vertical-align:top">',
        '<table id="FreighterTable"{{#if app.settings.showCompactTable}} class="compact"{{/if}}>',
        '<thead><tr><th>Count</th><th></th><th>Name</th><th>Tech</th>',
        '</tr></thead>',
        '<tbody id="FreighterRows">',
        '{{#fleets.1}}',
        '{{#this}}', // catch null values in fleets
        '<tr><td>{{count}}</td><td><img class="TinyIcon" src="{{img}}"/></td><td>{{name}}</td><td>{{tech}}</td></tr>',
        '{{/.}}',
        '{{/fleets.1}}',
        '</tbody>',
        '</table>',
        '</td></tr>',
        '</div>'
    ].join('')
});

/** Overview Screen
 * @constructor
 */
const ShipListOverviewPane = Ractive.extend({
    isolated: false,
    on: {
        complete () {
            $('#ShipTable').tablesorter();
            $('#dashPane').jScrollPane({hideFocus: true});
        },
        render ()
        {
            const players = this.get('vgap').players;

            for (let i = players.length - 1; i >= 0; i--) {
                let freightersKnown = 0;
                let warshipsKnown = 0;

                for (let j = this.get('app').ships.length - 1; j >= 0; j--) {
                    let ship = this.get('app').ships[j];

                    if (ship.ownerid != players[i].id) continue;

                    //support for sphere add-on
                    if (ship.id < 0) continue;

                    let hull = this.get('vgap').getHull(ship.hullid);

                    if ((hull.beams == 0 || (ship.beamid == 0 && ship.ownerid == vgap.player.id)) && (hull.launchers == 0 || (ship.torpedoid == 0 && ship.ownerid == vgap.player.id)) && hull.fighterbays == 0) {
                        freightersKnown++;
                    } else {
                        warshipsKnown++;
                    }
                }

                this.set('vgap.players[' + i + '].freightersKnown', freightersKnown);
                this.set('vgap.players[' + i + '].warshipsKnown', warshipsKnown);
            }
        },
        click (ctx, id) {
            this.get('app').showShips(6, id);
        }
    },
    template: [
        '<div id="MessageInbox">',
        '<table>',
        '<tr><td><strong>Overview</strong></td></tr>',
        '</table>',
        '<table id="ShipTable"><thead><tr>',
        '<th>ID</th><th>Player</th><th>Race</th>',
        '<th>Warships</th>',
        '<th>Freighters</th>',
        '<th>Total</th>',
        '</tr></thead>',
        '<tbody id="ShipRows">',
        '{{#vgap.players}}',
        '<tr on-click="[\'click\', id]" class="shipRow{{id}}">',
        '<td>{{id}}</td>',
        '<td class="capitalize">{{username}}</td>',
        '<td>{{vgap.getRace(raceid).shortname}}</td>',
        '<td>{{warshipsKnown}} / {{vgap.getPlayerScore(id, "capitalships")}}</td>',
        '<td>{{freightersKnown}} / {{vgap.getPlayerScore(id, "freighters")}}</td>',
        '<td>{{vgap.getPlayerScore(id, "capitalships") + vgap.getPlayerScore(id, "freighters")}}</td>',
        '</tr>',
        '{{/vgap.players}}',
        '</tbody></table>',
        '</div>'
    ].join('')
});

/** @constructor */
const ShipListSelectionPaneAllied = Ractive.extend({
    isolated: false,
    on: {
        render () {
            this.set({
                checkBoxes: [
                    {
                        name: 'settings.showFullAllies',
                        checked: this.get('app').settings.showFullAllies
                    },
                    {
                        name: 'settings.showShareIntel',
                        checked: this.get('app').settings.showShareIntel
                    },
                    {
                        name: 'settings.showSafePassage',
                        checked: this.get('app').settings.showSafePassage
                    },
                    {
                        name: 'settings.showOwnShips',
                        checked: this.get('app').settings.showOwnShips
                    },
                ]
            });
        },
        toggle(ctx) {
            this.set('app.' + ctx.get('name'), !this.get('app.' + ctx.get('name')));
            this.get('app').save();
            //this.show(); // defined in ShipListShipPane
            this.get('app').showShips();
        }
    },
    template: [
        '<form id="newShipForm"><div id="PlayerSelectionPane">',
        '<table id="PlayerSelectionTable">',
        '<tr><th><label for="showFullAllies">Show Full Allies</label></th>',
        '<th><label for="showShareIntel">Show Share Intel</label></th>',
        '<th><label for="showSafePassage">Show Safe Passage</label></th>',
        '<th><label for="showOwnShips">Show Own Ships</label></th></tr>',
        '<tr>',
        '{{#checkBoxes}}',
        '<td>{{> checkBox}}</td>',
        '{{/checkBoxes}}',
        '</tr></table>',
        '</div></form>'
    ].join('')
});

/**
 * @constructor
 */
const ShipListSelectionPaneComplete = Ractive.extend({
    isolated: false,
    on: {
        render () {
            this.set({
                checkBox: {
                    name: 'settings.showUnknown',
                    checked: this.get('app.settings.showUnknown')
                }
            });
        },
        toggle(ctx) {
            this.set('app.' + ctx.get('name'), !this.get('app.' + ctx.get('name')));
            this.get('app').save();
            //this.show(); // defined in ShipListShipPane
            this.get('app').showShips();
        }
    },
    template: [
        '<form id="newShipForm">',
        '<div id="PlayerSelectionPane">',
        '<table id="PlayerSelectionTable">',
        '<tr><th><label for="showUnknown">Show Unknown</label></th></tr>',
        '<tr><td>',
        '{{#checkBox}}',
        '{{>checkBox}}',
        '{{/checkBox}}',
        '</td></tr>',
        '</table>',
        '</div>',
        '</form>'
    ].join('')
});

/** @constructor */
const ShipListSelectionPaneSingle = Ractive.extend({
    isolated: false,
    on: {
        render () {
            this.set({
                checkBoxes: [
                    {
                        name: 'settings.showUnknown',
                        checked: this.get('app').settings.showUnknown
                    },
                    {
                        name: 'editMode',
                        checked: this.get('app').editMode
                    }
                ],
                selectBox: {
                    name: 'playerId',
                    value: this.get('app.playerId'),
                    options: this.get('vgap').players
                }
            });
        },
        select (ctx) {
            this.set('app.' + ctx.get('name'), ctx.getBinding());
            this.get('app').showShips();
        },
        toggle(ctx) {
            this.set('app.' + ctx.get('name'), !this.get('app.' + ctx.get('name')));
            this.get('app').save();
            //this.show(); // defined in ShipListShipPane
            this.get('app').showShips();
        }
    },
    template: [
        '<script>var newShip = { overwrite: false, ship: {} };</script>',
        '<form id="newShipForm">',
        '<div id="PlayerSelectionPane">',
        '<table id="PlayerSelectionTable">',
        '<tr><th><label for="shipListPlayer">Select Player</label></th>',
        '<th><label for="showUnknown">Show Unknown</label></th>',
        '<th><label for="enableEdit">Enable Edit</label></th></tr>',
        '<tr><td>{{#selectBox}}{{>selectBox}}{{/selectBox}}</td>',
        '{{#checkBoxes}}',
        '<td>{{>checkBox}}</td>',
        '{{/checkBoxes}}',
        '</table>',
        '</div>',
        '</form>'
    ].join('')
});

//noinspection JSUnusedGlobalSymbols
/** @constructor */
const ShipListSettingsPane = Ractive.extend({
    isolated: false,
    on: {
        complete () {
            $('#ShipTable').tablesorter();
            $('#dashPane').jScrollPane({hideFocus: true});
            if (this.get('app').lastTurn == this.get('vgap').nowTurn) {
                $('#updateMissingTurns').prop('disabled', true);
            }
            // $('#rebuildStartTurn').off('focus');
            $('.ConfigForm *').off('focus');
        },
        toggle(ctx, setting) {
            this.set('app.settings.' + setting, !this.get('app.settings.' + setting));
            this.get('app').save();
        },
        updateMissingTurns () {
            this.get('app').initLoop();
        },
        rebuildFromCurrent () {
            this.get('app').enable().resetShips().showShips();
        },
        rebuildFromScratch () {
            const accel = this.get('vgap').settings.acceleratedturns;
            this.get('app').enable().rebuildShips(accel > 0 ? accel : 1);
        },
        updateFromCurrent () {
            this.set('app.lastTurn', this.get('vgap.nowTurn') - 1);
            // loop from turn N - 1 so we get clean data, including intercepts
            this.get('app').initLoop(this.get('app.lastTurn'));
            //this.updateShips().showShips(7);
        },
        sendPlanetsMessage ()
        {
            $('#sendPlanetsMessage').prop('checked', false);

            new ShipListModalDialog({
                data: {
                    checked: this.get('app').settings.updates2[1] ? this.get('app').settings.updates2[1][1] : false,
                    title: 'Send Planetary Data?',
                    list: this.get('vgap').players,
                    on: 1,
                    to: 1,
                    app: this.get('app'),
                    vgap: this.get('vgap'),
                    width: 450
                },
                on: {
                    onto () {
                        if (this.get('app').settings.updates2[this.get('to')])
                            this.set('checked', this.get('app').settings.updates2[this.get('to')][this.get('on')]);
                    },
                    toggle (ctx) {
                        if (ctx.getBinding()) {
                            if (!this.get('app').settings.updates2[this.get('to')])
                                this.get('app').settings.updates2[this.get('to')] = {};
                            this.get('app').settings.updates2[this.get('to')][this.get('on')] = 1;
                        } else
                            delete this.get('app').settings.updates2[this.get('to')][this.get('on')];
                        this.get('app').save();
                    },
                    yes () {
                        this.get('app').sendMessage(this.get('on'), this.get('to'), 'planets');
                        this.teardown();
                    }
                },
                partials: {
                    main: Ractive.partials['dataSend']
                }
            });
        },
        sendShipsMessage ()
        {
            $('#sendShipsMessage').prop('checked', false);

            new ShipListModalDialog({
                data: {
                    checked: this.get('app').settings.updates[1] ? this.get('app').settings.updates[1][1] : false,
                    title: 'Send Ship Data?',
                    list: this.get('vgap').players,
                    on: 1,
                    to: 1,
                    app: this.get('app'),
                    vgap: this.get('vgap'),
                    width: 450
                },
                on: {
                    onto () {
                        if (this.get('app').settings.updates[this.get('to')])
                            this.set('checked', this.get('app').settings.updates[this.get('to')][this.get('on')]);
                    },
                    toggle (ctx) {
                        if (ctx.getBinding()) {
                            if (!this.get('app').settings.updates[this.get('to')])
                                this.get('app').settings.updates[this.get('to')] = {};
                            this.get('app').settings.updates[this.get('to')][this.get('on')] = 1;
                        } else
                            delete this.get('app').settings.updates[this.get('to')][this.get('on')];
                        this.get('app').save();
                    },
                    yes () {
                        this.get('app').sendMessage(this.get('on'), this.get('to'), 'ships');
                        this.teardown();
                    }
                },
                partials: {
                    main: Ractive.partials['dataSend']
                }
            });
        }
    },
    template: [
        '<div id="MessageInbox"><table id="ConfigTable">',
        '<tr><td><p><strong>Plugin Preferences</strong></p></td></tr>',
        '<tr><td><form class="ConfigForm"><table id="SettingsTable">',
        '<tr><td><input type="checkbox" on-click="[\'toggle\', \'showLocationHistory\']" {{#if app.settings.showLocationHistory}}checked="yes" {{/if}} id="showLocationHistory"/></td><td><label for="showLocationHistory"><span>Show ship location history.</span></label></td></tr>',
        '<tr><td><input type="checkbox" on-click="[\'toggle\', \'showVerticalButtons\']" {{#if app.settings.showVerticalButtons}}checked="yes" {{/if}} id="showVerticalButtons"/></td><td><label for="showVerticalButtons"><span>Vertical player buttons.</span></label></td></tr>',
        '<tr><td><input type="checkbox" on-click="[\'toggle\', \'showColoredText\']" {{#if app.settings.showColoredText}}checked="yes" {{/if}} id="showColoredText"/></td><td><label for="showColoredText"><span>Colored text instead of colored rows.</span></label></td></tr>',
        '<tr><td><input type="checkbox" on-click="[\'toggle\', \'showCompactTable\']" {{#if app.settings.showCompactTable}}checked="yes" {{/if}} id="showCompactTable"/></td><td><label for="showCompactTable"><span>Compact ship tables.</span></label></td></tr>',
        '<tr><td><input type="checkbox" on-click="[\'toggle\', \'addShipHistory\']" {{#if app.settings.addShipHistory}}checked="yes" {{/if}} id="addShipHistory"/></td><td><label for="addShipHistory"><span>Add ship history to notes.</span></label></td></tr>',
        '<tr><td><input type="checkbox" on-click="[\'toggle\', \'addShipHistoryForOwn\']" {{#if app.settings.addShipHistoryForOwn}}checked="yes" {{/if}} id="addShipHistoryForOwn"/></td><td><label for="addShipHistoryForOwn"><span>Show ship history for own and allied ships.</span></label></td></tr>',
        '<tr><td><input type="checkbox" on-click="[\'toggle\', \'deleteAfterImport\']" {{#if app.settings.deleteAfterImport}}checked="yes" {{/if}} id="deleteAfterImport"/></td><td><label for="deleteAfterImport"><span>Delete EnemyShipList plugin data after import.</span></label></td></tr>',
        '<tr><td><input type="checkbox" on-click="[\'toggle\', \'debugMode\']" {{#if app.settings.debugMode}}checked="yes" {{/if}} id="debugMode"/></td><td><label for="debugMode"><span>Debug Mode (verbose logging).</span></label></td></tr>',
        '</table></form></td></tr>',
        '<tr><td><p><strong>Tools</strong></p></td></tr>',
        '<tr><td><form class="ConfigForm"><table id="SettingsTable">',
        '<tr><td><input type="checkbox" on-click="sendShipsMessage" id="sendShipsMessage"/></td><td><label for="sendShipsMessage"><span class="simptip-position-top simptip-smooth simptip-multiline simptip-info" data-tooltip="Send your ship data you have on a specific player to another player. Data will be integrated in their Ship List if they accept.">Send Ship Data to another player.</span></label></td></tr>',
        '<tr><td><input type="checkbox" on-click="sendPlanetsMessage" id="sendPlanetsMessage"/></td><td><label for="sendPlanetsMessage"><span class="simptip-position-top simptip-smooth simptip-multiline simptip-info" data-tooltip="Send the planetary data you have on a specific player to another player. Data will be integrated in their planets view if they accept.">Send Planetary Data to another player.</span></label></td></tr>',
        '</table></form></td></tr>',
        '<tr><td><p><strong>Update Options</strong></p></td></tr>',
        '<tr><td><form class="ConfigForm"><table id="SettingsTable">',
        '<tr><td><input type="checkbox" on-click="updateMissingTurns" type="checkbox" id="updateMissingTurns"/></td><td><label for="updateMissingTurns"><span class="simptip-position-top simptip-smooth simptip-multiline simptip-info" data-tooltip="Add all data from missing turns to the ship list. ' +
        '(Your list contains data up to turn{{app.lastTurn}}.) ',
        'More recent turns will be automatically processed.">Update all missing turns.</span></label></td></tr>',
        '<tr><td><input type="checkbox" on-click="rebuildFromCurrent" id="rebuildFromCurrent"/></td><td><label id="ttReset" for="rebuildFromCurrent"><span class="simptip-position-top simptip-smooth simptip-multiline simptip-warning" data-tooltip="Empty the ship list and rebuild it with information from this turn. ' +
        'More recent turns will not be processed. All custom entries will be deleted.">Rebuild ship list from the current turn only.</span></label></td></tr>',
        '<tr><td><input type="checkbox" on-click="rebuildFromScratch" id="rebuildFromScratch"/></td><td><label id="ttRebuild" for="rebuildFromScratch"><span class="simptip-position-top simptip-smooth simptip-multiline simptip-warning" data-tooltip="Empty the ship list and rebuild it starting from the ' +
        'first turn. More recent turns will be automatically processed. All custom entries will be deleted.">Rebuild ship list from the first turn.</span></label></td></tr>',
        '<tr><td><input type="checkbox" on-click="updateFromCurrent" id="updateFromCurrent"/></td><td><label id="ttUpdate" for="updateFromCurrent"><span class="simptip-position-top simptip-smooth simptip-multiline simptip-warning" data-tooltip="Reprocess the ship list for this turn. ' +
        'Older turns will not be modified. Custom entries you made this turn will be deleted.">Update ship list for the current turn.</span></label></td></tr>',
        '</table></form></td></tr>',
        '<tr><td><p><strong>Usage Notes</strong></p></td></tr>',
        '<tr><td><p>The plugin records all ships seen throughout the game. A starmap tool allows you to draw circles on the map where ships were last seen. The plugin needs to be activated for each game/player combination, and on each computer on which you use it.</p>',
        '<p>Plugin data is saved both to local storage and to the server, meaning it is shared between computers.</p></td></tr>',
        '<tr><td><p><strong>Limitations</strong></p></td></tr><tr><td><p>Ships destroyed by mine hits or just listed in "Explosion" reports are not removed since ship id cannot be determined.</p>' +
        '<p>Warships without beam weapons, technically freighters, will be shown as warships, since NU internally stores unknown beams as 0. </p>' +
        '<p>To make a backup of your data, use the "Export" function found under "Storage".</p></td></tr>',
        '<tr><td><p><strong>Credits</strong></p></td></tr>',
        '<tr><td>',
        '<p><a href="http://planets.nu/#/account/kedalion" target="_blank" style="color:#00F7FF">Kedalion</a> - the writer of the original Enemy Ship List plugin.</p>' +
        '<p><a href="http://planets.nu/#/account/mcnimble" target="_blank" style="color:#00F7FF">McNimble</a> - for the help in saving ship info to the server.</p>' +
        '</td></tr>',
        '<tr><td><p><strong>Bugs / Feature Requests:</strong></p></td></tr>',
        '<tr><td><p>Drop me a line anytime on NU: <a href="http://planets.nu/#/account/space+pirate+harlock" target="_blank" style="color:#00F7FF">http://planets.nu/#/account/space+pirate+harlock</a>.</p></td></tr>',
        '</table></div>'
    ].join('')
});

/** Storage Pane
 * @constructor
 */
const ShipListStoragePane = Ractive.extend({
    isolated: false,
    on: {
        complete () {
            $('#ShipTable').tablesorter();
            $('#dashPane').jScrollPane({hideFocus: true});
            $('.ConfigTable *').off('focus');
        },
        delete (ctx, gameId, playerId) {
            this.get('app').deleteGame(gameId, playerId).showShips();
        },
        deleteAll () {
            this.get('app').deleteAllGames().showShips();
        },
        render () {
            let games = [];
            let totalSize = 0;

            for (let key in localStorage) {
                let prefix = this.get('app.storagePrefix');
                let re = new RegExp(prefix + '(\\d+)\\.(\\d+)\\.data');
                let match = re.exec(key);
                if (match) {
                    let gameId = match[1];
                    let playerId = match[2];
                    let gameData = localStorage.getItem(prefix + match[1] + '.' + match[2] + '.data');
                    let gameSize = gameData.length * 2;
                    gameData = JSON.parse(gameData);
                    totalSize += gameSize;

                    games.push(
                        Object.assign(gameData, {
                            gameId: gameId,
                            gameSize: (gameSize / 1024).toFixed(2),
                            playerId: playerId
                        })
                    );
                }
            }

            games.push({
                gameName: 'All Games', playerName: 'All Players', gameSize: (totalSize / 1024).toFixed(2)
            })

            this.set('games', games);
        },
        export () {
            this.get('app').exportGameData();
        },
        import () {
            this.get('app').importGameData();
        }
    },
    template: [
        '<div id="MessageInbox">',
        '<table id="ConfigTable"><tr><td><p><strong>Storage</strong></p></td></tr>',
        '<tr><td><p>The {{app.appName}} plugin stores ship data locally on your machine. ',
        'Since the amount of available storage varies, you may need to delete some stale game data to free up space.</p></td></tr>',
        '<tr><td><p><strong>Games</strong></p></td></tr><tr><td><table id="ShipTable"><tr>',
        '<th>Game Id</th><th>Name</th><th>Slot</th><th>Player</th><th>Race</th><th>#1 Turn</th><th>Last Turn</th><th>Memory</th><th>Version</th><th></th>' +
        '</tr><tbody id="ShipRows">',
        '{{#games}}',
        '<tr>',
        '<td>{{gameId}}</td>',
        '<td>{{gameName}}</td>',
        '<td>{{playerId}}</td>',
        '<td class="capitalize">{{playerName}}</td>',
        '<td>{{raceName}}</td>',
        '<td>{{firstTurn}}</td>',
        '<td>{{lastTurn}}</td>',
        '<td>{{gameSize}} kB</td>',
        '<td>{{version}}</td>',
        '<td>',
        '{{#if gameId}}',
        '<div class="BasicFlatButton" on-click="[\'delete\', gameId, playerId]">Delete</div>',
        '{{else}}',
        '<div class="BasicFlatButton" on-click="[deleteAll]">Delete All</div>',
        '{{/if}}',
        '</td>',
        '</tr>',
        '{{/games}}',
        '</tbody></table></td></tr><tr><td><p><strong>Import / Export</strong></p></td></tr>',
        '<tr><td><p>This allows you to export all game data on this computer, and to import it to another. Note that importing will delete all prior game data on the target machine. It is highly recommended to make regular backups, especially if using the bleeding edge versions of the plugin, which I highly encourage.</p></td></tr>',
        '<tr><td><div class="center"><div class="BasicFlatButton" on-click="export">Export</div>',
        '<label for="fileInput"><div class="BasicFlatButton">Import</div></label><input id="fileInput" type="file" on-change="',
        'import" style="display:none"/></div></td></tr>',
        '</table>',
        '</div>'
    ].join('')

});

/** Warning pane */
const ShipListWarningPane = Ractive.extend({
    isolated: false,
    on: {
        init () {
            this.set('acceleratedTurns', this.get('vgap').settings.acceleratedturns);
            this.set('buildTurn', this.get('vgap').settings.acceleratedturns > 0 ? this.get('vgap').settings.acceleratedturns : 1);
            this.set('inAcceleratedTurns', this.get('vgap').nowTurn < this.get('vgap').settings.acceleratedturns);
            this.set('lastTurnMoreRecent', this.get('app').lastTurn > this.get('vgap').game.turn);
            this.set('lastTurnNotNow', !this.get('vgap').inHistory && this.get('app').lastTurn < this.get('vgap').nowTurn);
            this.set('rebuildTurn', this.get('app').lastTurn + 1);
            this.set('settingsView', this.get('app').view == 7);
            this.set('thisTurn', this.get('vgap').game.turn);
        },
        close () {
            this.set('app.hideWarningPane', true);
            this.teardown();
        },
        rebuild (ctx, app, view, buildTurn) {
            app.enable().rebuildShips(buildTurn).showShips(view);
        },
        reset (ctx, app, view) {
            app.enable().resetShips().showShips(view);
        }
    },
    template: [
        '{{^app.hideWarningPane}}',
        '<div id="WarningPane"><table id="WarningTable">',
        '{{#app.enabled}}',
        '<tr><th><p>The ship list contains data from turn {{app.firstTurn}} to turn {{app.lastTurn}}.</p></th></tr>',
        '{{#lastTurnMoreRecent}}',
        '<tr><th><p class="warning">Total ships from turn {{thisTurn}}, known ships from turn {{app.lastTurn}}! More ships can be shown than the player had this turn.</p></th></tr>',
        '{{/lastTurnMoreRecent}}',
        '{{#lastTurnNotNow}}',
        '<tr><th><p class="warning">This list does not include the most recent turns yet. ',
        'You will need to either manually go through all turns starting at turn {{app.lastTurn + 1}} or use "Auto Update". ',
        'More options are available under "Settings".</p><div class="center"><div class="BasicFlatButton" onclick="vgap.plugins.shipList.initLoop();"> Auto Update</div></div></th></tr>',
        '{{/lastTurnNotNow}}',
        '{{/app.enabled}}',
        '{{^app.enabled}}',
        '<tr><th><p class="warning">Plugin is not enabled for this game/player combination on this machine.</p></th></tr>',
        '{{^settingsView}}',
        '{{#inAcceleratedTurns}}',
        '<tr><th>This game has "Accelerated Start" enabled. The plugin can only be enabled once you reach turn {{acceleratedTurns}}.</th></tr>',
        '{{/inAcceleratedTurns}}',
        '{{^inAcceleratedTurns}}',
        '<tr><td><p>To enable the plugin, select one of the options below.</p></td></tr>',
        '<tr><th><div class="BasicFlatButton" on-click="[\'reset\', app, view]">',
        'Initialize</div><span>Initialize list from the current turn only.</span></th></tr>',
        '<tr><th><div class="BasicFlatButton" on-click="[\'rebuild\', app, view, buildTurn]"> ',
        'Build</div><span>Build list starting from turn {{buildTurn}}',
        '</span></th></tr>',
        '{{/inAcceleratedTurns}}',
        '{{/settingsView}}',
        '{{/app.enabled}}',
        '</table>',
        '<div on-click="close" class="closeIcon"></div>',
        '</div>',
        '{{/app.hideWarningPane}}'
    ].join('')
});

const Templater = function ()
{
    this.get = function (template, data)
    {
        return Mustache.render(this.templates[template], data, this.partials);
    }

    this.templates = {
        checkBox: '<input id="{{id}}" type="checkbox"{{#checked}} checked{{/checked}} {{#click}} onclick="{{click}}"{{/click}}/>'
        ,
        selectBox: [
            '<select class="capitalize" id="{{id}}" value="{{value}}"{{#change}} onchange="{{change}}"{{/change}}>',
            '{{#options}}<option value="{{id}}">{{name}}</option>{{/options}}',
            '</select>'
        ].join(''),
        headerShipTable: [
            '<div id="MessageInbox">',
            '<div id="ShipPane">',
            '{{#extra}}',
            '<table><tr><td><p><strong>Warships ({{warshipsKnown}} / {{warshipsTotal}})</strong></p></td></tr></table>',
            '{{/extra}}',
            '<table id="ShipTable"{{#compact}} class="compact"{{/compact}}>',
            '<thead><tr>{{#edit}}<th></th>{{/edit}}<th>Id</th><th>Player</th><th>Race</th><th>Hull</th><th>Name</th><th></th>',
            '<th>Location</th><th>Turn</th><th>Heading</th><th>Warp</th><th>Engine</th><th>Beams</th><th>Torps/Bays</th><th>Ammo</th><th>Mass</th>',
            '<th>Crew</th><th>Dmg</th></tr></thead>',
            '<tbody id="ShipRows"></tbody>',
            '</table>',
            '{{#extra}}',
            '<table><tr><td><p><strong>Freighters ({{freightersKnown}} / {{freightersTotal}})</strong></p></td></tr></table>',
            '<table id="FreighterTable"{{#compact}} class="compact"{{/compact}}>',
            '<thead><tr>{{#edit}}<th></th>{{/edit}}<th>Id</th><th>Player</th><th>Race</th><th>Hull</th><th>Name</th><th></th>',
            '<th>Location</th><th>Turn</th><th>Heading</th><th>Warp</th><th>Engine</th><th>Beams</th><th>Torps/Bays</th><th>Ammo</th><th>Mass</th>',
            '<th>Crew</th><th>Dmg</th></tr></thead>',
            '<tbody id="FreighterRows"></tbody>',
            '</table>',
            '{{/extra}}',
            '</div>',
            '</div>'
        ].join('')
    };

    this.partials = {
        checkBox: this.templates.checkBox,
        selectBox: this.templates.selectBox
    };
};

/**
 * @param {vgaPlanets}      vgap
 * @param {*}                settings
 * @type {DrawHelper}
 * @constructor
 */
const DrawHelper = function (vgap, settings)
{
    this.drawRadius = 10;
    this.shipsDrawn = [];
    this.togglesShown = false;

    this.settings = settings;

    this.init = function ()
    {
        this.playerToggles = [];
        this.playerColors = ["#ffff00", "#0000ff", "#00ff00", "#ff0000", "#ffff00", "#ff00ff", "#0000ff", "#ff9900", "#00ff99", "#9900ff", "#cccc00", "#00cccc", "#cc00cc", "#ff9999", "#99ff99", "#9999ff", "#cc0044", "#44cc00", "#0044cc", "#999900", "#009999", "#990099", "#ee3300", "#00ee33", "#3300ee", "#ee0033", "#33ee00", "#0033ee", "#bb4444", "#44bb44", "#4444bb"];

        for (let i = 0; i <= vgap.players.length; i++) {
            this.playerToggles[i] = false;
        }

        // load colors from diplomacy and configuration settings

        for (let i = vgap.players.length - 1; i >= 0; i--) {
            let color = this.playerColors[i + 1];
            let id = vgap.players[i].id;
            if (id == vgap.player.id) {
                if (vgap.accountsettings.myshipto) color = vgap.accountsettings.myshipto;
            } else {
                let relation = vgap.getRelation(id);
                if (relation != null && relation.color && relation.color != "") color = '#' + relation.color;
            }
            this.playerColors[i + 1] = color;
        }

        this.playerColors.splice(vgap.players.length + 1);

        return this;
    }

    this.addMapTool = function ()
    {
        if (vgap.isMobileVersion()) {
            vgap.map.addMapTool('Ship List', 'shipListTool', this.toggleMapTool.bind(this));
        } else {
            vgap.map.addMapTool('Ship List', 'ShowMinerals', this.showSelectionPane.bind(this));
        }

        return this;
    }

    /**
     * Draw last location of ships
     * @param {[]}  ships
     * @returns {DrawHelper}
     */
    this.drawShips = function (ships)
    {

        let doDraw = false;

        for (let i = 0; i <= vgap.players.length; i++) {
            if (this.playerToggles[i]) {
                doDraw = true;
                break;
            }
        }

        if (!doDraw) return this;

        for (let i = ships.length - 1; i >= 0; i--) {
            const ship = ships[i];

            if (vgap.game.turn < ship.infoturn) continue;

            if (this.playerToggles[0] || this.playerToggles[ship.ownerid]) {
                this.drawShipCircle(ship.x, ship.y, this.drawRadius, {stroke: this.playerColors[ship.ownerid]}, null);
            }
        }

        // mark visible ships in time machine
        if (vgap.game.turn < vgap.nowTurn) {
            for (let i = vgap.ships.length - 1; i >= 0; i--) {
                const ship = vgap.ships[i];

                if (this.playerToggles[0] || this.playerToggles[ship.ownerid]) {
                    this.drawShipCircle(ship.x, ship.y, this.drawRadius, {stroke: this.playerColors[ship.ownerid]}, null);
                }
            }
        }

        return this;
    };

    /**
     * Draw ship circle on map
     * @param x            int
     * @param y            int
     * @param radius       int
     * @param attr         {*}
     * @param ctx          context
     * @returns {DrawHelper}
     */
    this.drawShipCircle = function (x, y, radius, attr, ctx)
    {
        if (!vgap.map.isVisible(x, y, radius)) return this;
        radius *= vgap.map.zoom;
        if (radius <= 1) radius = 1;
        if (ctx == null) ctx = vgap.map.ctx;
        ctx.strokeStyle = attr.stroke;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(vgap.map.screenX(x), vgap.map.screenY(y), radius, 0, Math.PI * 2, false);
        ctx.stroke();
        return this;
    };

    /** hide ship scan pane */
    this.hideScan = function ()
    {
        vgap.list.hide();
    };

    /**
     * Select player ships on map
     * @param {number} id
     * @returns {DrawHelper}
     */
    this.selectPlayer = function (id)
    {
        for (let i = this.playerToggles.length - 1; i >= 0; i--) {
            if (!this.playerToggles[i]) {
                this.playerToggles[0] = false;
            }
        }
        this.playerToggles[id] = true;
        return this;
    };

    /**
     * Get ships in radius
     * @param {[]}              ships
     * @param {number}          x
     * @param {number}          y
     * @param {boolean}         includeVisible  include visible ships from the list
     * @returns {[]}
     */
    this.shipsAt = function (ships, x, y, includeVisible)
    {
        let at = [];

        for (let i = 0; i < ships.length; i++) {
            let ship = ships[i];

            if ((this.playerToggles[0] || this.playerToggles[ship.ownerid]) && (!ship.visible || includeVisible) && (Math.dist(x, y, ship.x, ship.y) <= this.drawRadius)) {
                at.push(ship);
            }
        }
        return at;
    };

    /** Show ships from previous turns in pane (hover) */
    this.shipScan = function (ship)
    {
        const ago = vgap.game.turn - ship.infoturn;
        const note = vgap.getNote(ship.id, 2);
        const shortBeamNames = ['?', 'Las', 'X-Ray', 'Pla', 'Bla', 'Posi', 'Dis', 'HB', 'PH', 'HD', 'HP'];
        const shortTorpNames = ['?', 'Mk1', 'Prot', 'Mk2', 'GaB', 'Mk3', 'Mk4', 'Mk5', 'Mk6', 'Mk7', 'Mk8', 'QT'];

        if (vgap.isMobileVersion()) {
            const hull = vgap.getHull(ship.hullid);
            const player = vgap.getPlayer(ship.ownerid);
            const race = vgap.getRace(player.raceid);

            let cls = "";
            if (ship.ownerid == vgap.player.id) cls = "MyItem";
            else if (vgap.allied(ship.ownerid)) cls = "AllyItem";
            else if (ship.ownerid != vgap.player.id) cls = "EnemyItem";

            let html = "<div class='ItemSelection ShipSeen " + cls + "' data-id='" + ship.id + "'>";
            html += "<img src='" + hullImg(ship.hullid) + "'/>";

            html += "<div class='ItemTitle'><div class='sval warp'>" + ( ship.warp == -1 ? '?' : ship.warp ) + "</div>" + Math.abs(ship.id) + ": " + ship.name + "</div>";
            html += "<div class='ItemTitle'>" + hull.name + "</div>";

            html += "<div><strong>Seen: Turn " + ship.infoturn + " (" + ago + " turn" + (ago > 1 ? "s" : "") + " ago)</strong></div>";
            html += "<hr/><div>" + race.shortname + "<br/>(" + player.username + ")</div>";
            if (ship.heading > 0)
                html += "<div class='lval heading'>" + ship.heading + "</div>";
            if (ship.crew > -1)
                html += "<div class='lval crew'>" + ship.crew + "/" + hull.crew + "</div>";
            if (ship.damage > 0)
                html += "<div class='lval damage'>" + ship.damage + "%</div>";
            if (ship.beamid > 0)
                html += "<div class='lval beamweapon'>" + ship.beams + ' ' + shortBeamNames[ship.beamid] + "</div>";
            if (ship.torpedoid > 0)
                html += "<div class='lval torpedo'>" + ship.ammo + ' ' + shortTorpNames[ship.torpedoid] + "</div>";
            if (hull.fighterbays > 0)
                html += "<div class='lval fighters'>" + ship.ammo + "</div>";
            let minMass = ship.mass;
            let maxMass = minMass;
            for (let i = ship.history.length - 1; i >= 0; i--) {
                if (ship.history[i].mass < minMass) minMass = ship.history[i].mass;
                if (ship.history[i].mass > maxMass) maxMass = ship.history[i].mass;
            }
            html += "<div class='lval mass'>" + ship.mass + " kt" +
                    (minMass != ship.mass || maxMass != ship.mass ? ' (' + minMass + '-' + maxMass + ')' : '') + "</div>";

            if (note != null) html += "<hr/><div class='GoodTextNote'>" + note.body.replace(/\n/g, "<br/>") + "</div>";

            html += "</div>";

            return html;
        } else {
            const hullName = vgap.getHull(ship.hullid).name;
            const name = vgap.players[ship.ownerid].fullname;

            return [
                '<div class="ItemSelectionBox">',
                '<span>', ship.id, ': ', ship.name, '</span>',
                '<div>', hullName, '</div>',
                '<table class="CleanTable">',
                '<tr><td colspan="2"><strong>Seen: Turn ', ship.infoturn,
                ' (', ago, ' turn' + (ago > 1 ? 's' : '') + ' ago)</strong></td></tr>',
                '<tr><td>Heading:</td><td>', (ship.heading >= 0 ? ship.heading : '?' ),
                ' at Warp: ', (ship.warp >= 0 ? ship.warp : '?' ), '</td></tr>',
                '<tr><td>Mass:</td><td>', ship.mass, '</td></tr>',
                '<tr><td colspan="2">', name, '</td></tr>',
                (note != null ? '<tr><td colspan="4" class="GoodTextNote">' +
                                note.body.replace(/\n/g, '<br/>') + '</td></tr>' : ''),
                '</table>',
                '</div>'
            ].join('');
        }
    };

    /** Show player toggles */
    this.showMapTool = function ()
    {
        const map = vgap.map;

        $("#playerToggles").remove();
        let playerToggles = $([
            '<div id="playerToggles"',
            (this.settings.showVerticalButtons ? '' : ' class="hori"'),
            '></div>'].join(''))
            .appendTo('#MapControls');

        map.addMapTool("Close Ship Tool", "hideToggles", this.toggleMapTool.bind(this), "#playerToggles");

        map.addMapTool('All Ships', 'player0 capitalize' + (this.playerToggles[0] ? ' active' : ''), (function ()
        {
            this.togglePlayer(0)
        }).bind(this), "#playerToggles");

        for (let i = 1; i < this.playerToggles.length; i++) {
            let name = '';
            for (let j = 0; j < vgap.players.length; j++) {
                if (vgap.players[j].id == i) {
                    name = vgap.players[j].fullname;
                    break;
                }
            }
            map.addMapTool(name, 'player' + i + (this.playerToggles[i] ? ' active' : ''), (function ()
            {
                this.togglePlayer(i);
            }).bind(this), "#playerToggles");
        }

    };

    /**
     * Show planet pane when hovering over ship location
     * @param ship
     * @returns {DrawHelper}
     */
    this.showScan = function (ship)
    {
        if (vgap.isMobileVersion()) {
            vgap.list.empty();
            vgap.list.show();

            const pane = $('<div class="childpane"></div>').appendTo(vgap.list);
            let planet = vgap.planetAt(ship.x, ship.y);
            const titleBar = $("<div id='ScanTitle'></div>").appendTo(pane);

            if (planet) {
                titleBar.html('<div>' + Math.abs(planet.id) + ': ' + planet.name + '</div>');
            } else {
                let dist = 1000;
                let planetB;
                let distB = 1000;

                for (let i = 0; i < vgap.planets.length; i++) {
                    planetB = vgap.planets[i];
                    distB = Math.dist(planetB.x, planetB.y, ship.x, ship.y);
                    if (distB <= dist) {
                        dist = distB;
                        planet = planetB;
                    }
                }

                if (dist <= 3) {
                    titleBar.html('<div>' + Math.abs(planet.id) + ': ' + planet.name + '<span>(Warp Well)</span></div>');
                } else {
                    titleBar.html('<div>' + Math.abs(planet.id) + ': ' + planet.name + '<span>(' + dist.toFixed(1) + ' ly away)</span></div>');
                }
            }

            pane.append(shtml.planetScan(planet, true));

            const starBase = vgap.getStarbase(planet.id);
            if (starBase != null) pane.append(shtml.starbaseScan(starBase));
        } else {
            /** @todo Add non-mobile code */
        }
        return this;
    };

    /** show player selection pane for old client */
    this.showSelectionPane = function ()
    {
        // empty left content
        vgap.lc.empty();

        let pane = $([
            '<div id="#shipListContainer">',
            '<div class="TitleBar">',
            '<div class="TopTitle">Show ships for:</div>',
            '<div class="CloseLeftScreen" onclick="vgap.closeLeft();vgap.lc.empty();"></div>',
            '</div></div>',
        ].join('')).appendTo(vgap.lc);

        for (let i = 1; i < this.playerToggles.length; i++) {
            let name = '';
            let race = '';
            for (let j = 0; j < vgap.players.length; j++) {
                if (vgap.players[j].id == i) {
                    name = vgap.players[j].username;
                    race = vgap.getRace(vgap.players[j].raceid).shortname;
                    break;
                }
            }

            let row = $([
                '<div>',
                '<label class="capitalize" style="cursor:pointer">',
                '<input type="checkbox" style="cursor:pointer"', (this.playerToggles[i] ? ' checked' : ''), '/>',
                ' ', name, ' (', race, ')</label>',
                '</div>'
            ].join('')).appendTo(pane);

            row.click(_ =>
            {
                this.togglePlayer(i);
            });
        }

        vgap.openLeft();
    };

    /** toggles player buttons */
    this.toggleMapTool = function ()
    {
        if (this.togglesShown) $("#playerToggles").remove();
        else this.showMapTool();
        this.togglesShown = !this.togglesShown;
    };

    /**
     * Toggle player ships on starmap
     * @param id        int player id
     */
    this.togglePlayer = function (id)
    {

        if (id < 0 || id > vgap.players.length) return;

        this.playerToggles[id] = !this.playerToggles[id];

        if (id == 0) { // all
            for (let i = this.playerToggles.length - 1; i >= 1; i--) {
                this.playerToggles[i] = this.playerToggles[id];
            }
        } else { // set state of "all" toggle
            this.playerToggles[0] = true;
            for (let i = this.playerToggles.length - 1; i >= 1; i--) {
                if (!this.playerToggles[i]) {
                    this.playerToggles[0] = false;
                }
            }
        }

        if (vgap.isMobileVersion()) this.showMapTool();
        vgap.map.draw();
    };

};

/** make instance */
const shipList = new ShipList(vgap);

/** register the app */
vgap.registerPlugin(shipList, "shipList");

/** OVERLOADED nu.js FUNCTIONS */

/** Check for mobile version */
vgaPlanets.prototype.isMobileVersion = function ()
{
    return (this.version >= 4.0);
};

/** Overload to clear player toggles */
let fn1 = vgapMap.prototype.clearTools;

vgapMap.prototype.clearTools = function (result)
{

    /** @type {ShipList} */
    const app = vgap.plugins.shipList;

    for (let i = 0; i < app.drawer.playerToggles.length; i++) {
        app.drawer.playerToggles[i] = false;
    }
    app.drawer.togglesShown = false;
    $("#playerToggles").remove();

    // call nu.js clearTools
    /** @type Function */
    fn1.apply(this, arguments);

};

/** Overload shipScan to show ship list info on hover */

if (vgap.isMobileVersion) {
    sharedContent.prototype.shipScan = function (ship, showdamage)
    {
        const hull = vgap.getHull(ship.hullid);
        const player = vgap.getPlayer(ship.ownerid);
        const race = vgap.getRace(player.raceid);
        const note = vgap.getNote(ship.id, 2);

        /** @add */
        const shortBeamNames = ['?', 'Las', 'X-Ray', 'Pla', 'Bla', 'Posi', 'Dis', 'HB', 'PH', 'HD', 'HP'];
        const shortTorpNames = ['?', 'Mk1', 'Prot', 'Mk2', 'GaB', 'Mk3', 'Mk4', 'Mk5', 'Mk6', 'Mk7', 'Mk8', 'QT'];

        let listShip = {};
        const listShips = vgap.plugins.shipList.ships;

        const shipIds = listShips.map(function (ship)
        {
            return ship.id;
        });

        const shipIdx = shipIds.indexOf(ship.id);
        /** end */

        let cls = "";
        if (ship.ownerid == vgap.player.id)
            cls = "MyItem";
        else if (vgap.allied(ship.ownerid))
            cls = "AllyItem";
        else if (ship.ownerid != vgap.player.id)
            cls = "EnemyItem";

        let html = "<div class='ItemSelection " + cls + "' data-id='" + ship.id + "'>";
        html += "<img " + (ship.iscloaked ? "class='imgcloaked'" : "") + " src='" + ship.img + "'/>";

        let cloaked = "";
        if (ship.iscloaked)
            cloaked = "<div class='sval cloak' style='margin-right:3px;'></div>"

        html += "<div class='ItemTitle'><div class='sval warp'>" + ship.warp + "</div>" + cloaked + Math.abs(ship.id) + ": " + ship.name + "</div>";

        //if (ship.iscloaked)
        //    html += "<div class='sval cloak' style='margin-right: 50px;'></div>"

        //html += "<span class='" + cls + "'>" + hull.name + "</span>";
        let heading = ship.heading;
        if (heading == -1)
            heading = nu.t.unknown;
        const tower = vgap.isTowTarget(ship.id);
        //html += "<div class='" + cls + "'>" + nu.t.mass + ": " + ship.mass + "</div>";
        if (ship.ownerid != vgap.player.id && !vgap.fullallied(ship.ownerid) && !vgap.editmode) {
            /** @add */
            html += "<hr/><div>" + race.shortname + "<br/>(" + player.username + ")</div>";
            if (shipIdx != -1) {
                listShip = listShips[shipIdx];
                if (ship.heading > 0)
                    html += "<div class='lval heading'>" + ship.heading + "</div>";
                if (listShip.crew > 0)
                    html += "<div class='lval crew'>" + listShip.crew + "/" + hull.crew + "</div>";
                if (listShip.damage > 0)
                    html += "<div class='lval damage'>" + listShip.damage + "%</div>";
                if (listShip.beamid > 0)
                    html += "<div class='lval beamweapon'>" + listShip.beams + ' ' + shortBeamNames[listShip.beamid] + "</div>";
                if (listShip.torpedoid > 0)
                    html += "<div class='lval torpedo'>" + listShip.ammo + ' ' + shortTorpNames[listShip.torpedoid] + "</div>";
                if (hull.fighterbays > 0)
                    html += "<div class='lval fighters'>" + ship.ammo + "</div>";
                let minMass = ship.mass;
                let maxMass = minMass;
                for (let i = listShip.history.length - 1; i >= 0; i--) {
                    if (listShip.history[i].mass < minMass) minMass = listShip.history[i].mass;
                    if (listShip.history[i].mass > maxMass) maxMass = listShip.history[i].mass;
                }
                html += "<div class='lval mass'>" + ship.mass + " kt" +
                        (minMass != ship.mass || maxMass != ship.mass ? ' (' + minMass + '-' + maxMass + ')' : '') + "</div>";
            } else {
                if (ship.heading > 0)
                    html += "<div class='lval heading'>" + ship.heading + "</div>";
                html += "<div class='lval mass'>" + ship.mass + " kt" + "</div>";
                html += "<hr/><div>Threat: " + vgap.getThreatLevel(hull) + "</div>";
            }
            /** end */
        }
        else if (race.id == 12) {
            const cargoType = vgap.podCargoType(ship.hullid);
            let cargoName = cargoType;
            if (cargoType == "nativeclans")
                cargoName = "native clans";
            html += "<div class='lval " + cargoType + "'><b>" + cargoName + "</b>" + ship.clans + "</div>";

            if (hull.fighterbays > 0) {
                const fighters = Math.floor((ship.clans / hull.cargo) * 10 * hull.fighterbays) + 10;
                html += "<div class='lval fighters'>" + fighters + "</div>";
            }
        }
        else if (showdamage) {
            html += "<div class='lval crew'>" + ship.crew + "/" + hull.crew + "</div>";
            if (ship.damage > 0)
                html += "<div class='lval damage'>" + ship.damage + "%</div>";
        }
        else {
            if (vgap.gameUsesFuel())
                html += "<div class='lval neu'>" + ship.neutronium + "</div>";
            if (vgap.gameUsesSupplies())
                html += "<div class='lval supplies' " + (ship.supplies == 0 ? "style='display:none;'" : "") + ">" + ship.supplies + "</div>";

            html += "<div class='lval mc' " + (ship.megacredits == 0 ? "style='display:none;'" : "") + ">" + ship.megacredits + "</div>";
            html += "<div class='lval dur' " + (ship.duranium == 0 ? "style='display:none;'" : "") + ">" + ship.duranium + "</div>";
            html += "<div class='lval tri' " + (ship.tritanium == 0 ? "style='display:none;'" : "") + ">" + ship.tritanium + "</div>";
            html += "<div class='lval mol' " + (ship.molybdenum == 0 ? "style='display:none;'" : "") + ">" + ship.molybdenum + "</div>";
            html += "<div class='lval clans' " + (ship.clans == 0 ? "style='display:none;'" : "") + ">" + ship.clans + "</div>";
            if (ship.ownerid != vgap.player.id)
                html += "<hr/><div>" + race.shortname + "<br/>(" + player.username + ")</div>";
            if (ship.heading > 0)
                html += "<div class='lval heading'>" + ship.heading + "</div>";
            if (ship.damage > 0)
                html += "<div class='lval damage'>" + ship.damage + "%</div>";
            if (ship.beamid > 0)
                html += "<div class='lval beamweapon'>" + ship.beams + ' ' + shortBeamNames[ship.beamid] + "</div>";
            if (ship.torpedoid > 0)
                html += "<div class='lval torpedo'>" + ship.ammo + ' ' + shortTorpNames[ship.torpedoid] + "</div>";
            if (hull.fighterbays > 0)
                html += "<div class='lval fighters'>" + ship.ammo + "</div>";

        }

        if (vgap.editmode)
            html += "<hr/><div>" + race.shortname + "<br/>(" + player.username + ")</div>";
        if (tower != null)
            html += "<div style='color:#990099;margin-top:10px;'>" + nu.t.towedbyship + " s" + tower.id + "</div>";
        if (note != null)
            html += "<hr/><div class='GoodTextNote'>" + note.body.replace(/\n/g, "<br/>") + "</div>";

        html += "</div>";

        return html;
    };
} else {
    /** @todo add non-mobile functionality */

    vgaPlanets.prototype.shipScan = function (ship)
    {

        const hull = vgap.getHull(ship.hullid);

        let html = "<div class='ItemSelection' data-id='" + ship.id + "'>";
        html += "<img src='" + ship.img + "'/>";
        let cls = "";
        if (vgap.allied(ship.ownerid) && ship.ownerid != vgap.player.id)
            cls = "AllyText";
        else if (ship.ownerid != vgap.player.id)
            cls = "BadText";

        html += "<span class='" + cls + "'>" + Math.abs(ship.id) + ": " + ship.name + "</span>";
        html += "<span class='" + cls + "'>" + hull.name + "</span>";
        let heading = ship.heading;
        if (heading == -1)
            heading = nu.t.unknown;
        const tower = vgap.isTowTarget(ship.id);
        if (tower != null)
            html += "<span style='color:#990099;'>" + nu.t.towedbyship + " #" + tower.id + ": " + tower.name + "</span>";
        else {
            html += "<span class='" + cls + "'>" + nu.t.heading + ": " + heading;
            if (!vgap.settings.isacademy)
                html += " " + nu.t.atwarp + ": " + ship.warp;
            html += "</span>";
        }
        html += "<span class='" + cls + "'>" + nu.t.mass + ": " + ship.mass + "</span>";
        if (ship.ownerid != vgap.player.id)
            html += "<span class='" + cls + "'>" + vgap.raceName(ship.ownerid) + "</span>";
        html += "</div>";

        return html;
    };
}

/**
 * Overload to change ship heading when waypoint changes
 */

let fn2 = vgapMap.prototype.shipSelectorClick;

vgapMap.prototype.shipSelectorClick = function (shift)
{
    /** @type {Function} */
    fn2.apply(this, arguments);

    const ship = this.activeShip;

    if (!shift || (ship.x == ship.targetx && ship.y == ship.targety) || vgap.isHyping(ship)) {
        ship.heading = Math.round((
                                  90 - Math.atan2(ship.targety - ship.y, ship.targetx - ship.x)
                                       * 180 / Math.PI + 360) % 360
        );
    }
};

/**
 * Overload functions to show ships seen in previous turns
 * showScan for mobile, showInfo for non-mobile
 */
let fn3 = sharedContent.prototype.showScan;

sharedContent.prototype.showScan = function (x, y, target, lock)
{
    /** @type {ShipList} */
    const app = vgap.plugins.shipList;
    let ships;

    /** @type {Function} */
    fn3.apply(this, arguments);

    const pane = vgap.list.first();
    ships = app.drawer.shipsAt(app.ships, x, y, false);

    for (let i = ships.length - 1; i >= 0; i--) {
        $(app.drawer.shipScan(ships[i])).appendTo(pane);
    }

    ships = app.drawer.shipsAt(app.ships, x, y, true);

    for (let i = ships.length - 1; i >= 0; i--) {
        const ship = ships[i];

        if (!ship.history || !app.settings.showLocationHistory ||
            app.drawer.shipsDrawn.indexOf(ship.id) != -1
        ) continue;

        let x1 = ship.x;
        let y1 = ship.y;
        let opacity = 1;
        const ctx = vgap.map.ctx;

        for (let i = 0; i < ship.history.length; i++) {
            let loc = ship.history[i];
            let x2 = loc.x;
            let y2 = loc.y;

            // skip if first history turn or same coords
            if (i == 0 || (x1 == x2 && y1 == y2))
                continue;

            opacity *= 0.75;
            if (opacity < 0.25) opacity = 0.25;

            ctx.segmentedLine(vgap.map.screenX(x1), vgap.map.screenY(y1),
                vgap.map.screenX(x2), vgap.map.screenY(y2), {
                    rgba: [200, 220, 240, opacity]
                });
            /*
                        opacity *= 0.75;
                        if (opacity < 0.25) opacity = 0.25;

                        ctx.strokeStyle = colorToRGBA("#ADD8E6", opacity);
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.dashedLine(vgap.map.screenX(x1), vgap.map.screenY(y1),
                            vgap.map.screenX(x2), vgap.map.screenY(y2), [5, 3]);
                        ctx.closePath();
                        ctx.stroke();
            */

            let x3 = x2, y3 = y2;

            let j = i + 1;
            while (x3 == x2 && y3 == y2 && j < ship.history.length) {
                x3 = ship.history[j].x;
                y3 = ship.history[j].y;
                j++;
            }
            if (x3 == x2 && y3 == y2) {
                //x3 = x2 - (x1 - x2);
                //y3 = y2 - (y1 - y2);
                x3 = -x1;
                y3 = y1;
            }

            const srcAngle = ( Math.atan2(y1 - y2, x1 - x2) + 2 * Math.PI ) % (2 * Math.PI);
            const dstAngle = ( Math.atan2(y3 - y2, x3 - x2) + 2 * Math.PI ) % (2 * Math.PI);
            const angle = (srcAngle + dstAngle + 2 * Math.PI ) % (2 * Math.PI)

            vgap.map.drawOffsetText(x2 + Math.round(Math.cos(angle) * 10), Math.round(y2 + Math.sin(angle) * 10), 'T' + loc.turn, 0, 0);

            // last different waypoint reached - stop looping
            if (x3 == x2 && y3 == y2 && j == ship.history.length - 1)
                break;

            x1 = x2;
            y1 = y2;
        }

        app.drawer.shipsDrawn.push(ship.id);
    }
};

if (!vgap.isMobileVersion()) {
    let fn4 = vgapMap.prototype.showInfo;

    vgapMap.prototype.showInfo = function (x, y)
    {
        /** @type {ShipList} */
        const app = vgap.plugins.shipList;
        let ships;

        /** @type {Function} */
        fn4.apply(this, arguments);

        const pane = $('#PlanetsLoc').find(':first :last');
        ships = app.drawer.shipsAt(app.ships, vgap.map.x, vgap.map.y, false);

        for (let i = ships.length - 1; i >= 0; i--) {
            $(app.drawer.shipScan(ships[i])).insertBefore(pane);
        }

        ships = app.drawer.shipsAt(app.ships, vgap.map.x, vgap.map.y, true);

        for (let i = ships.length - 1; i >= 0; i--) {
            const ship = ships[i];

            if (!ship.history || !app.settings.showLocationHistory ||
                app.drawer.shipsDrawn.indexOf(ship.id) != -1
            ) continue;

            let x1 = ship.x;
            let y1 = ship.y;
            let opacity = 1;
            const ctx = vgap.map.ctx;

            for (let i = 0; i < ship.history.length; i++) {
                let loc = ship.history[i];
                let x2 = loc.x;
                let y2 = loc.y;
                opacity *= 0.75;
                if (opacity < 0.25) opacity = 0.25;

                ctx.strokeStyle = colorToRGBA("#ADD8E6", opacity);
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.dashedLine(vgap.map.screenX(x1), vgap.map.screenY(y1),
                    vgap.map.screenX(x2), vgap.map.screenY(y2), [5, 3]);
                ctx.closePath();
                ctx.stroke();
                if (loc.turn != vgap.game.turn && loc.turn != ship.infoturn)
                    vgap.map.drawOffsetText(x2, y2, 'T' + loc.turn, 0, -10);
                x1 = x2;
                y1 = y2;
            }

            app.drawer.shipsDrawn.push(ship.id);
        }
    };
}

/** Get intercept missions before successful save */
let fn5 = vgaPlanets.prototype.save;

vgaPlanets.prototype.save = function ()
{
    const app = vgap.plugins.shipList;

    // clear list
    app.intercepts = [];

    // loop through own ships with mission intercept / cloak & intercept
    for (let i = vgap.ships.length - 1; i >= 0; i--) {
        let ship = vgap.ships[i];

        if (ship.id > 0 && //support for sphere add-on - thanks to Maberi for pointing this out
            ship.ownerid == vgap.player.id &&
            (ship.mission == 7 || ship.mission == 20) &&
            ship.mission1target != 0 // intercept without valid target
        ) {
            app.intercepts.push(
                {
                    srcId: ship.id,
                    tgtId: ship.mission1target
                }
            );
        }
    }

    if (app.intercepts.length)
        app.save();

    /** @type {Function} */
    fn5.apply(this, arguments);
}

let fn6 = vgapDashboard.prototype.showActivity;

vgapDashboard.prototype.showActivity = function ()
{
    /** @type {Function} */
    fn6.apply(this, arguments);

    // hide Ship List messages from game feed

    const messages = $('#egameactivity').find('.egamefeedline');

    messages.each(function ()
    {
        const message = $(this).find('.eexcerpt').text();

        if (message && message.match(/\s+Ship Data on .+ from .+\s/)) {
            $(this).css('display', 'none');
        }
    });
}

/** Prime the VCR player with combat data */
vcrPlayer.prototype.runReport = function (report)
{

    let left = new combatObject();
    let right = new combatObject();

    left.setObject(report.left);
    right.setObject(report.right);

    this.init(left, right, report.battletype, report.seed);
    this.finished = function ()
    {
    };
    this.run(-1);

};

/** Get relationFrom for ship */
vgaPlanets.prototype.getRelationFromForShip = function (ownerId)
{
    const relation = this.getRelation(ownerId);

    if (relation) {
        return relation.relationfrom;
    } else {
        return -1;
    }
};

/** Missing function in non-mobile */
if (!vgap.isMobileVersion()) {
    //noinspection OverlyComplexFunctionJS
    vgapMap.prototype.drawOffsetText = function (x, y, text, dx, dy, attr, ctx)
    {
        if (!ctx)
            ctx = this.ctx;
        if (!vgap.map.isVisible(x, y, Math.max(10, ctx.measureText(text).width) / 2 / this.zoom)) return;
        var color = "#ffffff";
        if (attr) {
            if (attr.color)
                color = attr.color;
            else if (attr.fill)
                color = attr.fill;
        }
        ctx.fillStyle = color;
        ctx.lineWidth = 1;
        ctx.font = "10px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, this.screenX(x) + dx, this.screenY(y) + dy);
    };
}

/**
 * uppercase first letter of every word
 * @returns {string}
 */
String.prototype.ucWords = function ()
{
    return this.toLowerCase().replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,
        function (s)
        {
            return s.toUpperCase();
        });
};

/**
 * get scoreboard info for player
 * @param id
 * @param type
 * @returns {number}
 */
vgaPlanets.prototype.getPlayerScore = function (id, type)
{
    for (let i = vgap.scores.length - 1; i >= 0; i--) {
        if (vgap.scores[i].ownerid == id) {
            return vgap.scores[i][type];
        }
    }
    return 0;
};

/**
 *
 * @param x
 * @param y
 * @param x2
 * @param y2
 * @param {*} settings
 */
CanvasRenderingContext2D.prototype.segmentedLine = function (x, y, x2, y2, settings)
{
    const intervals = settings.int ? settings.int : [1, 1, 15, 30];
    const rgba = settings.rgba ? settings.rgba : [255, 0, 0, .75];
    this.strokeStyle = 'rgba(' + rgba[0] + ',' + rgba[1] + ',' + rgba[2] + ',' + rgba[3] + ')';
    this.lineWidth = settings.lw ? settings.lw : 1;
    const dx = (x2 - x), dy = (y2 - y);
    const len = Math.sqrt(dx * dx + dy * dy);
    const rot = Math.atan2(dy, dx);

    this.save();
    this.translate(x + .5, y + .5);
    this.moveTo(0, 0);
    this.rotate(rot);

    let i = 0;
    let seglength = intervals[0];
    const segments = [];
    while (len > i) {
        if (intervals[0] > intervals[2]) intervals[0] = intervals[2];
        segments.push(intervals[0]);
        if (intervals[1] > intervals[3]) intervals[1] = intervals[3];
        segments.push(intervals[1]);
        i += intervals[0]++ + intervals[1]++;
    }

    const dc = segments.length;
    let di = 0, draw = true;
    x = 0;

    while (len > x) {
        x += segments[di++ % dc];
        if (x > len) x = len;
        draw ? this.lineTo(x, 0) : this.moveTo(x, 0);

        draw = !draw;
    }
    this.stroke();
    this.restore();
}

Ractive.partials = {
    checkBox: '<input name="{{name}}" type="checkbox" checked="{{checked}}" on-change="toggle"/>',
    checkDataAlert: [
        'Player {{name}} tried to send you ship data posing as {{from}}. ',
        'They have been blacklisted from sending you ship data again. ',
        'Draw your own conclusions...'
    ].join(''),
    dataAccept: [
        '<tr>',
        '<td></td>',
        '<td><label>Accept data on {{on}}<br/>',
        'Sent by {{from.username}}?</label></td>',
        '</tr><tr>',
        '<td><input type="checkbox" name="accept" value="{{from.id}}" on-change="accept"></td>',
        '<td><label for="accept">Always accept data from this player</label></td>',
        '</tr><tr>',
        '<td><input type="checkbox" name="ignore" value="{{from.id}}" on-change="ignore"></td>',
        '<td><label for="ignore">Always ignore data from this player</label></td>',
        '</tr>'
    ].join(''),
    dataSend: [
        '<tr>',
        '<td><label>Send Data on:</label></td>',
        '<td><div class="select"><select name="on" value="{{on}}" on-change="onto">' +
        '{{#list}}<option value="{{id}}">{{fullname}}</option>{{/list}}</select></div></td>',
        '</tr><tr>',
        '<td><label>To Recipient:</label></td>',
        '<td><div class="select"><select name="to" value="{{to}}" on-change="onto">',
        '{{#list}}<option value="{{id}}">{{fullname}}</option>{{/list}}',
        '</select></div></td>',
        '</tr><tr>',
        '<td><input type="checkbox" name="toggle" type="checkbox" checked="{{checked}}" on-change="toggle"></td>',
        '<td><label for="toggle">Send Updates Every Turn</label></td>',
        '</tr>'
    ].join(''),
    gameInvalidData: [
        '{{name}} does not contain valid Ship List data. ',
        'Please try again with a correct game export file.'
    ].join(''),
    gameInvalidJson: [
        '{{name}} does not contain valid JSON data. ',
        'Please try again with a correct game export file.'
    ].join(''),
    selectBox: [
        '<select class="capitalize" name="{{name}}" value="{{value}}" on-change="select">',
        '{{#options}}<option value="{{id}}">{{fullname}}</option>{{/options}}',
        '</select>'
    ].join('')
};