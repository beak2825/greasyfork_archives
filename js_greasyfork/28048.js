// ==UserScript==
// @name         Utils
// @namespace    http://tampermonkey.net/
// @version      1.0.4.2
// @description  set of utils to speed development
// @author       Delfim Machado - dbcm@profundos.org
// @match        https://beta.waze.com/*editor/*
// @match        https://www.waze.com/*editor/*
// @exclude      https://www.waze.com/*user/*editor/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28048/Utils.user.js
// @updateURL https://update.greasyfork.org/scripts/28048/Utils.meta.js
// ==/UserScript==

/*
reusable code for all WME tools i'm building
*/

(function(root) {
    "use strict";

    var face = {
        'meh': '¯\_(ツ)_/¯',
        'angry': '(⋟﹏⋞)',
        'happy': '⎦˚◡˚⎣'
    };

    var WMEutils = function(options) {
        this.init(options);
    };

    WMEutils.prototype.init = function(opt) {
        this._VERSION = 0.1;

        opt = opt || {};

        this.debug = opt.debug;

        this.app = opt.app || 'DUH';
        this.uid = opt.uid || '___';
        this.version = opt.version || '0.0.666';
    };

    /*
    	o
    	{
    		id: "blame",
    		name: "bl",
    		title: 'blame plugin : ¯\\_(ツ)_/¯  [last 10 days]',
    		desc: 'i blame you all',
    		content: menu
    	}
    */
    WMEutils.prototype.addTab = function(o) {
        var self = this;

        // while testing and developing...
        var mdk = function(id) {
            try {
                document.getElementById(id).remove();
            } catch (e) {
                console.log("X");
            };
        }

        if (document.getElementById("t" + o.id)) {
            return;
        };

        var addon = document.createElement('div');
        addon.innerHTML += '<div><div class="side-panel-section"><h1>' + o.title + '</h1><br>';
        addon.innerHTML += o.content;
        addon.innerHTML += '</div></div>';

        var navTabs = document.getElementsByClassName("nav nav-tabs")[0];
        var tabContent = document.getElementsByClassName("tab-content")[0];

        var newtab = document.createElement('li');
        newtab.id = "t" + o.id;
        newtab.innerHTML = '<a title="' + o.desc + '" href="#sidepanel-' + o.id + '" data-toggle="tab">' + o.name + '</a>';
        //mdk("t" + o.id);
        navTabs.appendChild(newtab);

        addon.id = "sidepanel-" + o.id;
        addon.className = "tab-pane";
        //mdk("sidepanel-" + o.id);
        tabContent.appendChild(addon);

    };

    /*
    	f = ARRAY of functions
    */
    WMEutils.prototype.loopSegments = function(f) {
        for (var segId in Waze.model.segments.objects) {
            var seg = Waze.model.segments.get(segId);

            if (!this.isOnScreen(seg)) {
                continue;
            }

        /*    if (!this.canEdit(seg)) {
                continue;
            } */

            for (var i = 0; i < f.length; i++) {
                if (f[i])
                    f[i](seg);
            }
        }
    }

    /*
    	f = ARRAY of functions
    */
    WMEutils.prototype.loopVenues = function(f) {
        for (var venId in Waze.model.venues.objects) {
            var ven = Waze.model.venues.get(venId);

            if (!this.isOnScreen(ven)) {
                continue;
            }

        /*    if (!this.canEdit(ven)) {
                continue;
            } */

            for (var i = 0; i < f.length; i++) {
                if (f[i])
                    f[i](ven);
            }
        }
    };

    /*
    	f = ARRAY of functions
    */
    WMEutils.prototype.loopNodes = function(f) {
        for (var nodId in Waze.model.nodes.objects) {
            var nod = Waze.model.nodes.get(nodId);

            if (!this.isOnScreen(nod)) {
                continue;
            }

        /*    if (!this.canEdit(nod)) {
                continue;
            } */

            for (var i = 0; i < f.length; i++) {
                if (f[i])
                    f[i](nod);
            }
        }
    };

    /*
    	if the object visible
    */
    WMEutils.prototype.isOnScreen = function(obj) {
        if (obj.geometry) {
            return (Waze.map.getExtent().intersectsBounds(obj.geometry.getBounds()));
        }
        return false;
    }

    /*
    	can i edit this object
    */
    WMEutils.prototype.canEdit = function(obj) {
        if (obj.type === 'segment')
            return obj.isAllowed(obj.PERMISSIONS.EDIT_GEOMETRY) || obj.hasClosures() || obj.isUpdated();
        if (obj.type === 'venue')
            return obj.isAllowed(obj.PERMISSIONS.EDIT_GEOMETRY) || obj.isUpdated();
        if (obj.type === 'node')
            return obj.areConnectionsEditable() || obj.isUpdated();
    };

    /*
    	is this object in Portugal
    */
    WMEutils.prototype.isFrance = function(obj) {
        var att = obj.attributes;
        var street = Waze.model.streets.get(att.primaryStreetID);
        var city = segment.model.cities.get(street.cityID);
        var countryId = city.countryID;

        return countryId === 73;
    }

    /*
    	return a random color
    */
    WMEutils.prototype.rColor = function() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    /*
        obj = must be a segment OBJ
    */
    WMEutils.prototype.isDrivable = function(obj) {
        if (obj.type === 'segment') {
            var drivable = [1, 2, 3, 4, 6, 7, 8, 17, 15, 20];

            if (drivable.includes(obj.attributes.roadType)) {
                return true;
            }
        };
        return false;
    };

    /*
        obj = object to highlight, can be and segment or a place (landmark/venue)
        color = highlight color
        bgColor = background color, if null, defaults to color
    */
    WMEutils.prototype.highlightObject = function(obj, color, bgColor, label) {
        return new OpenLayers.Feature.Vector(obj.geometry.clone(), {}, {
            strokeColor: color,
            strokeDashstyle: "none",
            strokeLinecap: "round",
            strokeWidth: 15,
            strokeOpacity: 0.5,
            fill: true,
            fillColor: bgColor || color,
            fillOpacity: 0.2,
            pointRadius: 6,
            fontColor: 'white',
            labelOutlineColor: color,
            labelOutlineWidth: 4,
            labelAlign: 'cm',
            label: label || null,
            rotation: 0.785398164,
            textAlign: 'center',
            textBaseline: 'middle'
        });
    };

    /*
    	options stuff
    */
    WMEutils.prototype.loadOptions = function() {
        var self = this;

        return JSON.parse(localStorage.getItem(self.uid + "_options"));
    }
    WMEutils.prototype.saveOptions = function(options) {
        var self = this;

        return localStorage.setItem(self.uid + "_options", JSON.stringify(options));
    }

    /*
    	log stuff
    */
    WMEutils.prototype.log = function(msg) {
        var self = this;

        var now = Date.now();
        console.log("[" + this.app + "] " + now + " : " + msg);
    }

    /*
    	returns true if you are using beta editor
    */
    WMEutils.prototype.onBeta = function() {
        return -1 !== window.location.href.indexOf("beta");
    }

    /*
    	add menu layer
    
        section = [issues, places, road, display]
        name = layer name
        uid = internal id
        callback = function() {...}
        layer = OL Layer
    */
    WMEutils.prototype.addMenuLayer = function(o) {
        // from WME Street View Availability
        var roadGroupSelector = document.getElementById('layer-switcher-group_' + o.section);
        if (roadGroupSelector !== null) {
            var roadGroup = roadGroupSelector.parentNode.parentNode.querySelector('.children');
            var toggler = document.createElement('li');
            var togglerContainer = document.createElement('div');
            togglerContainer.className = 'controls-container toggler';
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = 'layer-switcher-item_' + o.uid;
            checkbox.className = 'toggle';
            checkbox.checked = true;
            checkbox.addEventListener('click', function(e) {
                o.layer.setVisibility(e.target.checked);
            });
            togglerContainer.appendChild(checkbox);
            var label = document.createElement('label');
            label.htmlFor = checkbox.id;
            var labelText = document.createElement('span');
            labelText.className = 'label-text';
            labelText.appendChild(document.createTextNode(o.name));
            label.appendChild(labelText);
            togglerContainer.appendChild(label);
            toggler.appendChild(togglerContainer);
            roadGroup.appendChild(toggler);
        }
    };

    root.WMEutils = WMEutils;
})(window);