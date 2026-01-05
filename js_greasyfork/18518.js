// ==UserScript==
// @name                WME Aerial Shifter (beta fixed)
// @version             1.6.7
// @description         This script helps you adjust the position and opacity of underlying satellite imagery
// @match               https://beta.waze.com/*editor*
// @match               https://www.waze.com/*editor*
// @grant               none
// @icon                http://s3.amazonaws.com/uso_ss/icon/176646/large.png?1391605696
// @namespace           https://www.waze.com/forum/viewtopic.php?t=53022
// @author              byo
// @contributor         berestovskyy
// @contributor         iainhouse
// @contributor         ragacs
// @downloadURL https://update.greasyfork.org/scripts/18518/WME%20Aerial%20Shifter%20%28beta%20fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/18518/WME%20Aerial%20Shifter%20%28beta%20fixed%29.meta.js
// ==/UserScript==
/*

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function()
{
    var version = "1.6";
    var WM;

    var prefix = 'WAS_';
    var settings = prefix + 'settings';

    var sx, sy, so;

    function init()
    {
        // init shortcuts
        if(!(WM = window.Waze.map) || !$('#search').length)
        {
            window.console.log("WME Aerial Shifter v" + version
                + ": waiting for WME...");
            setTimeout(init, 500);
            return;
        }

        var suffix = ' of satellite imagery';
        var psx = prefix + 'sx', psy = prefix + 'sy', pso = prefix + 'so',
            psr = prefix + 'reset';

        var nav = $(
            '<div style="direction:ltr;text-align:right;color:white;width:420px;'
               + 'line-height:20px;position:absolute;right:10px;top:52px">'
            + '<label title="Horizontal shift' + suffix + ' (meters)"'
                + 'style="font-weight:normal" for="' + psx + '">'
                + '<i class="fa fa-arrow-right"></i> '
                + '<input type="number" max="100" min="-100" step="10"'
                    + 'style="text-align:right;width:60px;height:25px;padding:0 5px"'
                        + 'id="' + psx + '" value="0"/>'
                + ' m'
            + '</label>'
            + ' &nbsp; '
            + '<label title="Vertical shift' + suffix + ' (meters)"'
                + 'style="font-weight:normal" for="' + psy + '">'
                + '<i class="fa fa-arrow-down"></i> '
                + '<input type="number" max="100" min="-100" step="10"'
                    + 'style="text-align:right;width:60px;height:25px;padding:0 5px"'
                        + 'id="' + psy + '" value="0"/>'
                + ' m'
            + '</label>'
            + ' &nbsp; '
            + '<label title="Opacity' + suffix + ' (pecent)"'
                + 'style="font-weight:normal" for="' + pso + '">'
                + '<i class="fa fa-adjust"></i> '
                + '<input type="number" max="100" min="0" step="25"'
                    + 'style="text-align:right;width:55px;height:25px;padding:0 5px"'
                        + 'id="' + pso + '" value="100"/>'
                + ' %'
            + '</label>'
            + ' &nbsp; '
            + '<a id="' + psr + '" style="color:white;text-decoration:none"'
                + 'href="#" title="Reset defaults">'
                + '<i class="fa fa-undo"></i>'
            + '</a>'
            + ' | '
            + '<a target="_blank" style="color:white;text-decoration:none"'
                + 'href="https://www.waze.com/forum/viewtopic.php?t=53022"'
                + 'title="WME Aerial Shifter v' + version + '">'
                + '<i class="fa fa-question"></i>'
            + '</a>'
            + '</div>'
        );
        sx = nav.find('#' + psx);
        sy = nav.find('#' + psy);
        so = nav.find('#' + pso);
        if($('#header-actions').length)
            $('#header-actions').append(nav);
        else
        {
            nav.css('right', '');
            nav.css('top', '');
            nav.css('left', 0);
            nav.css('padding-top', 6);
            nav.css('position', 'relative');
            $('#search').after(nav);
        }

        loadFromStorage();
        update();

        WM.events.on({
            zoomend : update,
            moveend : update
        });
        WM.baseLayer.events.on({
            loadend : update,
        });
        sx.change(update);
        sy.change(update);
        so.change(update);
        nav.find('#' + psr).click(resetDefaults);
    }

    function resetDefaults()
    {
        sx.val(0);
        sy.val(0);
        so.val(100);

        update();
    }

    function loadFromStorage()
    {
        var obj = JSON.parse(localStorage.getItem(settings));
        if(obj)
        {
            sx.val(obj.sx);
            sy.val(obj.sy);
            so.val(obj.so);
        }
    }

    function saveToStorage()
    {
        localStorage.setItem(settings, JSON.stringify({
            sx: sx.val(),
            sy: sy.val(),
            so: so.val(),
        }));
    }

    function update()
    {
        // calculate meters per pixel factor of current map
        var ipu = OpenLayers.INCHES_PER_UNIT;
        var metersPerPixel = WM.getResolution() * ipu['m']
            / ipu[WM.getUnits()];
        var shiftX = parseInt(sx.val(), 10);
        var shiftY = parseInt(sy.val(), 10);
        var opacity = parseInt(so.val(), 10);

        // Apply the shift and opacity
        WM.baseLayer.div.style.left =
            Math.round(shiftX / metersPerPixel) + 'px';
        WM.baseLayer.div.style.top =
            Math.round(shiftY / metersPerPixel) + 'px';
        WM.baseLayer.div.style.opacity = opacity/100;

        saveToStorage();
    }

    init();
})();
