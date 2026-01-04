// ==UserScript==
// @name          Planets.nu - Undo Commands Plugin
// @namespace     vgap.plugins.undoCommands
// @version       0.0.1
// @date          2020-07-13
// @author        Space Pirate Harlock
// @description   Planets.NU add-on to add undo / redo functionality to your turn.
// @homepage      https://planets.nu/
// @license       GPL
// @include       https://planets.nu/*
// @include       https://play.planets.nu/*
// @include       http://play.planets.nu/*
// @include       https://test.planets.nu/*
// @include       https://mobile.planets.nu/*
// @downloadURL https://update.greasyfork.org/scripts/406957/Planetsnu%20-%20Undo%20Commands%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/406957/Planetsnu%20-%20Undo%20Commands%20Plugin.meta.js
// ==/UserScript==

const UndoCommands = function (vgap)
{
    /** PROPERTIES */

    this.version = '0.0.1';

    this.appName = 'Undo Commands';
    this.buffer = {};
    this.undoing = false;
    this.redoing = false;

    console.log('Undo Commands v' + this.version);

    this.loadmap = function ()
    {
        const css = [
            '<style id="undoCommandsCss">',
            '#undoredo {height:14px !important;font-size:14px;padding:13px 0;color:rgb(153,204,204)}',
            '.fa-undo-alt,.fa-redo-alt{padding:0 8px}',
            '.fa-undo-alt.disabled, .fa-redo-alt.disabled {color:rgb(102,102,102)}',
            '.fa-undo-alt:before {content:"\\f2ea"}',
            '.fa-redo-alt:before {content:"\\f2f9"}',
            '</style>'
        ].join('');

        if ($('#undoCommandsCss').length)
            $('#undoCommandsCss').remove();

        $('head').append(css);
    };

    this.redo = function (ship)
    {
        if (this.undoing)
        {
            this.buffer[ship.id].pointer++;
            this.undoing = false;
        }

        this.redoing = true;

        if (this.buffer[ship.id].pointer < this.buffer[ship.id].waypoints.length)
        {
            $.extend(ship, this.buffer[ship.id].waypoints[this.buffer[ship.id].pointer++]);
            vgap.loadWaypoints();
            vgap.shipScreen.screen.refresh();
            vgap.map.draw();
        }
    };

    this.undo = function (ship)
    {
        if (this.buffer[ship.id].pointer == this.buffer[ship.id].waypoints.length &&
            (ship.targetx != this.buffer[ship.id].waypoints[this.buffer[ship.id].pointer - 1].targetx ||
                ship.targety != this.buffer[ship.id].waypoints[this.buffer[ship.id].pointer - 1].targety ||
                ship.waypoints.join('') != this.buffer[ship.id].waypoints[this.buffer[ship.id].pointer - 1].waypoints.join('')
            )
        )
            this.buffer[ship.id].waypoints.push({
                target: ship.target,
                targetx: ship.targetx,
                targety: ship.targety,
                waypoints: ship.waypoints
            });

        if (this.redoing)
        {
            this.buffer[ship.id].pointer--;
            this.redoing = false;
        }

        this.undoing = true;

        if (this.buffer[ship.id].pointer > 0)
        {
            $.extend(ship, this.buffer[ship.id].waypoints[--this.buffer[ship.id].pointer]);
            vgap.loadWaypoints();
            vgap.shipScreen.screen.refresh();
            vgap.map.draw();
        }
    };

    this.toggle = function (ship)
    {
        if (this.buffer[ship.id])
        {
            if (this.buffer[ship.id].pointer < 1)
                $('#commandUndo').addClass('disabled');
            else
                $('#commandUndo').removeClass('disabled');

            if (this.buffer[ship.id].pointer < this.buffer[ship.id].waypoints.length)
                $('#commandRedo').removeClass('disabled');
            else
                $('#commandRedo').addClass('disabled');
        }
    }
};

/** make instance */
const undoCommands = new UndoCommands(vgap);

/** register the app */
vgap.registerPlugin(undoCommands, "undoCommands");

/** override ship screen */

UndoCommands.prototype.loadShip = vgapShipScreen.prototype.load;

vgapShipScreen.prototype.load = function (ship)
{
    const app = vgap.plugins.undoCommands;

    app.loadShip.apply(this, arguments);

    app.redoing = app.undoing = false;

    if (vgap.game.turn == vgap.nowTurn)
    {
        $('#rNavTop').append([
            '<div id="undoredo">',
            '<i id="commandUndo" class="fas fa-undo-alt disabled"/>',
            '<i id="commandRedo" class="fas fa-redo-alt disabled"/>',
            '</div>'
        ].join(''));

        app.toggle(ship);

        $('#commandUndo').click((e) => ((app, ship) =>
        {
            app.undo(ship);
            app.toggle(ship);
            e.stopPropagation();
        })(app, ship));

        $('#commandRedo').click((e) => ((app, ship) =>
        {
            app.redo(ship);
            app.toggle(ship);
            e.stopPropagation();
        })(app, ship));
    }
};

/** override ship clicks */

UndoCommands.prototype.shipSelectorClick = vgapMap.prototype.shipSelectorClick;

vgapMap.prototype.shipSelectorClick = function (shift)
{
    const app = vgap.plugins.undoCommands;

    app.redoing = app.undoing = false;

    if (vgap.game.turn == vgap.nowTurn)
    {
        const ship = this.activeShip;

        if (!app.buffer[ship.id])
            app.buffer[ship.id] = {
                pointer: 0,
                waypoints: []
            };
        else if (app.buffer[ship.id].pointer <= app.buffer[ship.id].waypoints.length)
            app.buffer[ship.id].waypoints.splice(app.buffer[ship.id].pointer);

        if (!app.buffer[ship.id].waypoints[app.buffer[ship.id].pointer - 1] || (
            ship.targetx != app.buffer[ship.id].waypoints[app.buffer[ship.id].pointer - 1].targetx ||
            ship.targety != app.buffer[ship.id].waypoints[app.buffer[ship.id].pointer - 1].targety ||
            ship.waypoints.join('') != app.buffer[ship.id].waypoints[app.buffer[ship.id].pointer - 1].waypoints.join('')
        ))
        {
            let length = app.buffer[ship.id].waypoints.push({
                target: ship.target,
                targetx: ship.targetx,
                targety: ship.targety,
                waypoints: ship.waypoints
            });

            app.buffer[ship.id].pointer = length;
        }

        app.toggle(ship);
    }

    app.shipSelectorClick.apply(this, arguments);
}