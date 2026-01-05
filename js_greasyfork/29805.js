// ==UserScript==
// @name         Waze Map Editor - Blame
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  show on WME what this users did in the last X days
// @author       Delfim Machado - dbcm@profundos.org
// @match        https://beta.waze.com/*editor/*
// @match        https://www.waze.com/*editor/*
// @exclude      https://www.waze.com/*user/*editor/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29805/Waze%20Map%20Editor%20-%20Blame.user.js
// @updateURL https://update.greasyfork.org/scripts/29805/Waze%20Map%20Editor%20-%20Blame.meta.js
// ==/UserScript==

'use strict';

// process operations
var procO = function(os, bl, ob) {
    var l = os.length;

    for (var i = 0; i < l; i++) {
        var o = os[i];

        if (o.objectCentroid === null)
            continue;

        var coords = OpenLayers.Layer.SphericalMercator.forwardMercator(o.objectCentroid.coordinates[0], o.objectCentroid.coordinates[1]);

        var point = new OpenLayers.Geometry.Point(coords.lon, coords.lat);
        var alertPx = Waze.map.getPixelFromLonLat(new OpenLayers.LonLat(coords.lon, coords.lat));

        var aType = o.actionType;
        switch (o.actionType) {
            case "DELETE":
                aType = "D";
                break;
            case "UPDATE":
                aType = "U";
                break;
            case "ADD":
                aType = "A";
                break;
        }

        var style = {
            strokeColor: ob.color,
            strokeOpacity: 0.5,
            strokeWidth: 3,
            fillColor: ob.color,
            fillOpacity: 0.02,
            pointRadius: 6,
            fontColor: 'white',
            labelOutlineColor: ob.color,
            labelOutlineWidth: 4,
            labelAlign: 'left',
            label: ob.daysSince + "]" + aType + ":" + o.objectType
        };

        var imageFeature = new OpenLayers.Feature.Vector(point, null, style);

        bl.addFeatures([imageFeature]);
    }
}

// process transactions
var procT = function(ts, bl, o) {
    var l = ts.length;

    var daysSince;
    for (var i = 0; i < l; i++) {
        var t = ts[i];
        o.daysSince = t.daysSince;
        procO(t.operations, bl, o);
        daysSince = t.daysSince;
    }

    return daysSince;
}

var getCache = function(k) {
    var s = localStorage;
    if (k) {
        var v = JSON.parse(s.getItem("BLAME_" + k))
        if (v)
            return v.value;
    }
};
var setCache = function(k, v) {
    var s = localStorage;

    return s.setItem("BLAME_" + k, JSON.stringify({
        value: v,
        tstamp: Date.now()
    }));
};

var procBlame = function(o, jsonData) {

    var blameLayer;
    if (o.bl === undefined) {

        var blID = "__blame_" + o.uname;
        var bl = Waze.map.getLayerByUniqueName(blID);
        if (bl === undefined) {
            blameLayer = new OpenLayers.Layer.Vector("Blame " + o.uname, {
                rendererOptions: {
                    zIndexing: true
                },
                uniqueName: blID
            });
        } else {
            blameLayer = bl
        }

        blameLayer.setZIndex(9999);
        Waze.map.addLayer(blameLayer);
        Waze.map.addControl(new OpenLayers.Control.DrawFeature(blameLayer, OpenLayers.Handler.Path));
        blameLayer.setVisibility(true);
        blameLayer.destroyFeatures();
    } else {
        blameLayer = o.bl
    }

    var days = procT(jsonData.transactions, blameLayer, o);
    console.log("ROUND " + o.deep + " _ " + o.uname + " : Days retrieved " + days);

    if (o.deep > 0 && days < o.days) {
        o.deep = o.deep - 1;
        o.next = jsonData.nextTransactionDate;
        o.bl = blameLayer;
        getTransactions(o);
    }
}

var getTransactions = function(o) {

    if (o.uname === undefined)
        o.uname = Waze.model.users.get(o.user).userName;

    var opts = o.next ? '&till=' + o.next : '';

    var jsonData = getCache(o.next + o.user);
    if (o.next && jsonData) {
        console.log("FROM CACHE");
        procBlame(o, jsonData);
    } else {
        var client = new XMLHttpRequest();
        client.open('GET', 'https://' + www + '.waze.com/row-Descartes/app/UserProfile/Transactions?userID=' + o.user + opts, true);
        client.onreadystatechange = function() {
            if (client.readyState === 4 && client.status >= 200 && client.status < 300) {
                var jsonData = JSON.parse(client.responseText);
                if (o.next)
                    setCache(o.next + o.user, jsonData);

                procBlame(o, jsonData)

            }
        }
        client.send(null);
    }
}

var clearCache = function() {
    var s = localStorage;
    var l = s.length;
    for (var i = 0; i < l; i++) {
        var key = s.key(i);

        if (/^BLAME_/.test(key)) {
            var o = JSON.parse(s.getItem(key));
            var d = Math.round((Date.now() - o.tstamp) / 1000);
            //console.log("DIFF: "+d);
            // 10 days
            if (d > 864000) {
                s.removeItem(key);
            }
        }
    }
}

var doBlame = function(e) {
    if (e.target) {
        if (e.target.nodeName === 'BUTTON') {
            if (e.target.innerText === 'blame') {
                console.log("HIT HERE " + e.target.nodeName + " : " + e.target.value + " : " + e.target.alt + " : " + e.target.id);
                var color = utils.rColor();
                e.target.style.color = color;
                getTransactions({
                    deep: deep,
                    days: days,
                    user: e.target.value,
                    color: color,
                    uname: e.target.alt
                });
            }
            if (e.target.innerText === 'X') {
                var user = Waze.model.users.get(e.target.value);
                var bl = Waze.map.getLayerByUniqueName("__blame_" + user.userName);
                if (bl) {
                    Waze.map.removeLayer(bl);
                    var btn = document.getElementById("blame_" + e.target.value);
                    btn.style.color = null;
                }

            }
        }

    }
};

var resetBlame = function() {
    for (var uid in Waze.model.users.objects) {
        var user = Waze.model.users.get(uid);
        var bl = Waze.map.getLayerByUniqueName("__blame_" + user.userName);
        if (bl)
            Waze.map.removeLayer(bl)
    }
};

var refreshBlame = function() {
    var blUT = document.getElementById("blame_users");
    var t = document.createElement("TABLE");
    t.style.width = '100%';

    blUT.innerHTML = "<table>";
    for (var uid in Waze.model.users.objects) {
        var user = Waze.model.users.get(uid);
        var tr = t.insertRow();
        var tdu = tr.insertCell();
        tdu.innerHTML = "<a target='_new' href='https://" + www + ".waze.com/user/editor/" + user.userName + "'>" + user.userName + "</a> (" + user.normalizedLevel + ")";

        var tdb = tr.insertCell();
        var b = document.createElement("button");
        b.id = "blame_" + uid;
        b.alt = user.userName;
        b.value = uid;
        b.innerText = "blame";
        tdb.appendChild(b);

        var tdx = tr.insertCell();
        var bx = document.createElement("button");
        bx.id = "blameX_" + uid;
        bx.alt = user.userName;
        bx.value = uid;
        bx.innerText = "X";
        tdx.appendChild(bx);

    };

    blUT.appendChild(t);

    blUT.addEventListener('click', function(e) {
        doBlame(e)
    });

};

var addMenu = function() {
    var menu = `<button id="blame_load">refresh users</button> : <button id="blame_reset">reset blame</button><hr><div id="blame_users"></did><hr><div id="blame_history"></div>`;

    utils.addTab({
        id: "blame",
        name: "bl",
        title: 'blame plugin : ¯\\_(ツ)_/¯  [last ' + days + ' days]',
        desc: 'i blame you all',
        content: menu
    });

    var blRefresh = document.getElementById('blame_load');
    blRefresh.addEventListener("click", refreshBlame);

    var blReset = document.getElementById('blame_reset');
    blReset.addEventListener("click", resetBlame);

};

var init = function() {
    // TODO: add this to utils
    var wme_sidebar = document.getElementById('sidepanel-prefs');

    if (wme_sidebar === null) {
        setTimeout(init, 1000);
        console.log("NO SIDEBAR??? W8ing a sec...");
        return;
    }

    clearCache();

    addMenu();
};


// how many requests do for each user?
var deep = 30;

// how many days to show?
var days = 10;

var utils = new WMEutils({
    app: 'blame'
});
var www = utils.onBeta() ? 'beta' : 'www';

init();