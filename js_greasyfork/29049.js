// ==UserScript==
// @name          Planets.nu - Meteor's Stellar Cartography Plugin
// @description   Plugin for Planets.nu which redraws the edges of Stellar Cartography objects
// @namespace     Planets.nu
// @version       2.0
// @grant         none
// @date          2021-12-29
// @author        meteor
// @include       http://planets.nu/*
// @include       http://*.planets.nu/*
// @include       https://planets.nu/*
// @include       https://*.planets.nu/*
// @exclude       http://help.planets.nu/*
// @exclude       https://help.planets.nu/*
// @exclude       http://profile*.planets.nu/*
// @exclude       https://profile*.planets.nu/*
// @exclude       http://planets.nu/_library/*
// @exclude       http://api.planets.nu/*
// @downloadURL https://update.greasyfork.org/scripts/29049/Planetsnu%20-%20Meteor%27s%20Stellar%20Cartography%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/29049/Planetsnu%20-%20Meteor%27s%20Stellar%20Cartography%20Plugin.meta.js
// ==/UserScript==

/* -----------------------------------------------------------------------
 Change log:
 2.0:
 - new: switched to Meteor's Library
 - bug fix: high zoom 1-ly-grid was not shown within stellar cartography objects
 ----------------------------------------------------------------------- */

"use strict";

function wrapper(plugin_version)
{
    let fullName = "Meteor's Stellar Cartography Plugin";

    if (typeof xLibrary == 'undefined')
    {
        window.alert("Cannot start " + fullName + "!\n\nThe plugin requires Meteor's Library.\nIf the library is installed already make sure it runs before the plugin.");
        throw "Cannot start " + fullName + ". Meteor's Library not found. Plugin disabled.";
    }

    let plugin = new XPlugin(fullName, "xStellarCartography", plugin_version, -20160921, 1.2);

    plugin.setLogEnabled(false);

    plugin.processload = function()
    {
        plugin.enabled = plugin.getObjectFromNote(0);
        if (plugin.enabled == null)
        {
            plugin.enabled = false;
        }
    };

    plugin.loadmap = function()
    {
        $("<li class='ShowMinerals' id='stellarCartography'>Stellar Cart.</li>").toggleClass("selectedmaptool", plugin.enabled).tclick(function()
        {
            plugin.enabled = !plugin.enabled;
            plugin.saveObjectAsNote(0, plugin.enabled);

            $("#stellarCartography").toggleClass("selectedmaptool", plugin.enabled);

            vgap.map.draw();
        }).appendTo("#MapTools");
    };

    plugin.draw = function()
    {
        let map = vgap.map;

        map.ctx.save();

        if (plugin.enabled)
        {
            let tmpCanvas = document.createElement("canvas");
            tmpCanvas.width = map.ctx.canvas.width;
            tmpCanvas.height = map.ctx.canvas.height;

            let ctx = tmpCanvas.getContext("2d");

            // nebulas
            ctx.strokeStyle = "#669999";
            ctx.lineWidth = 1;

            for (let i = 0; i < vgap.nebulas.length; i++)
            {
                let nebula = vgap.nebulas[i];

                if (map.isVisible(nebula.x, nebula.y, nebula.radius))
                {
                    ctx.beginPath();
                    ctx.arc(map.screenX(nebula.x), map.screenY(nebula.y), nebula.radius * vgap.map.zoom, 0, Math.PI * 2, false);
                    ctx.closePath();
                    ctx.stroke();
                }
            }

            ctx.fillStyle = "#000000";
            ctx.globalCompositeOperation = "destination-out";

            for (let i = 0; i < vgap.nebulas.length; i++)
            {
                let nebula = vgap.nebulas[i];

                if (map.isVisible(nebula.x, nebula.y, nebula.radius))
                {
                    ctx.beginPath();
                    ctx.arc(map.screenX(nebula.x), map.screenY(nebula.y), nebula.radius * vgap.map.zoom, 0, Math.PI * 2, false);
                    ctx.closePath();
                    ctx.fill();
                }
            }

            ctx.globalCompositeOperation = "source-over";

            map.ctx.drawImage(tmpCanvas, 0, 0);

            // ion storms
            ctx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);

            ctx.strokeStyle = vgap.accountsettings.ionstorms;
            ctx.lineWidth = 1;

            for (let i = 0; i < vgap.ionstorms.length; i++)
            {
                let storm = vgap.ionstorms[i];

                if (map.isVisible(storm.x, storm.y, storm.radius))
                {
                    ctx.beginPath();
                    ctx.arc(map.screenX(storm.x), map.screenY(storm.y), storm.radius * vgap.map.zoom, 0, Math.PI * 2, false);
                    ctx.closePath();
                    ctx.stroke();
                }
            }

            ctx.fillStyle = "#000000";
            ctx.globalCompositeOperation = "destination-out";
            for (let i = 0; i < vgap.ionstorms.length; i++)
            {
                let storm = vgap.ionstorms[i];

                if (map.isVisible(storm.x, storm.y, storm.radius))
                {
                    ctx.beginPath();
                    ctx.arc(map.screenX(storm.x), map.screenY(storm.y), storm.radius * vgap.map.zoom, 0, Math.PI * 2, false);
                    ctx.closePath();
                    ctx.fill();
                }
            }

            ctx.globalCompositeOperation = "source-over";

            // debris disks
            for (let i = 0; i < vgap.debrisdisks.length; i++)
            {
                let planet = vgap.debrisdisks[i];

                if (map.isVisible(planet.x, planet.y, planet.debrisdisk))
                {
                    ctx.strokeStyle = "white";
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.arc(map.screenX(planet.x), map.screenY(planet.y), planet.debrisdisk * vgap.map.zoom, 0, Math.PI * 2, false);
                    ctx.closePath();
                    ctx.stroke();
                }
            }

            // star clusters
            for (let i = 0; i < vgap.stars.length; i++)
            {
                let star = vgap.stars[i];

                if (map.isVisible(star.x, star.y, Math.sqrt(star.mass)))
                {
                    ctx.strokeStyle = "white";
                    ctx.lineWidth = 1;

                    ctx.beginPath();
                    ctx.arc(map.screenX(star.x), map.screenY(star.y), star.radius * vgap.map.zoom, 0, Math.PI * 2, false);
                    ctx.closePath();
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.arc(map.screenX(star.x), map.screenY(star.y), (star.radius + 10) * vgap.map.zoom, 0, Math.PI * 2, false);
                    ctx.closePath();
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.arc(map.screenX(star.x), map.screenY(star.y), Math.sqrt(star.mass) * vgap.map.zoom, 0, Math.PI * 2, false);
                    ctx.closePath();
                    ctx.stroke();
                }
            }

            map.ctx.drawImage(tmpCanvas, 0, 0);

            map.ctx.restore();

        } // if (plugin.enabled)
    };
}

var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")(\"" + GM_info.script.version + "\");";
document.body.appendChild(script);
document.body.removeChild(script);
