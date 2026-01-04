// ==UserScript==
// @name            WME center to begin-end of street (fork by z000ppy)
// @description     Tool for easily centering map on node A or B of selected street
// @namespace       http://pyrczak.pl
// @grant           none
// @grant           GM_info
// @version         0.0.8
// @include         https://www.waze.com/editor*
// @include         https://www.waze.com/*/editor*
// @include         https://beta.waze.com/*
// @exclude         https://www.waze.com/*user/editor*
// @exclude         https://beta.waze.com/forum*
// @author          Pawel Pyrczak '2014
// @license         MIT/BSD/X11
// @downloadURL https://update.greasyfork.org/scripts/439269/WME%20center%20to%20begin-end%20of%20street%20%28fork%20by%20z000ppy%29.user.js
// @updateURL https://update.greasyfork.org/scripts/439269/WME%20center%20to%20begin-end%20of%20street%20%28fork%20by%20z000ppy%29.meta.js
// ==/UserScript==

/*
 * v0.0.5 - some changes made by FZ69617
 * v0.0.6 - prepending to the segment panel to get the button click events to work again.  Updating header to work for production & beta WME.  Some stylistic code changes/simplification - JustinS83
 * v0.0.8 - fix setCenter – z000ppy
 */

function WMEbes_bootstrap() {
    let bGreasemonkeyServiceDefined = false;
    let ver;
    let newmethod;
    let isChrome;
    try {
        ver = window.navigator.appVersion.match(/Chrome\/(.*?) /)[1];
    } catch (err) {
        ver = null;
    }
    if (null !== ver) {
        isChrome = true;
        ///ver = "27.0.1438.7"; // last old working version
        // example: 32.0.1700.107
        // [0] - major versin
        // [2] - minor version
        ver = ver.split(".");
        ver[0] = parseInt(ver[0]);
        ver[2] = parseInt(ver[2]);
        if (ver[0] > 27) {
            newmethod = true;
        } else if (ver[0] === 27) {
            newmethod = ver[2] > 1438;
        } else {
            newmethod = false;
        }
    } else {
        isChrome = false;
        newmethod = false;
    }

    try {
        if ("object" === typeof Components.interfaces.gmIGreasemonkeyService)  // Firefox tells that "Components" is deprecated
            bGreasemonkeyServiceDefined = true;
    } catch (err) {
    }

    try {
        if ("object" === typeof GM_info)
            bGreasemonkeyServiceDefined = true;
    } catch (err) {
    }

    if ("undefined" === typeof unsafeWindow || !bGreasemonkeyServiceDefined) {
        try {
            unsafeWindow = (function () {
                var dummyElem = document.createElement('p');
                dummyElem.setAttribute('onclick', 'return window;');
                return dummyElem.onclick();
            })();
        } catch (err) {
            //Ignore.
        }
    }

    //And check again for new chrome, and no tamper(grease)monkey
    if (isChrome && newmethod && !bGreasemonkeyServiceDefined) {
        //use "dirty" but effective method with injection to document
        var DLscript = document.createElement("script");
        DLscript.textContent = 'unsafeWindow=window; \n' + // need this for compatibility
            WMEbes_init.toString() + ' \n' +
            'WMEbes_init();';
        DLscript.setAttribute("type", "application/javascript");
        document.body.appendChild(DLscript);
        //document.body.removeChild(DLscript);
    } else {
        /* begin running the code! */
        setTimeout(WMEbes_init, 500);
    }
}

function WMEbes_init() {

    WMEbes = {
        last: [],
        isLast: false,
        refreshB: false
    };

    WMEbes.insertButtons = function () {

        if (this.refreshB)
            if (document.getElementById('WMEbes') !== null)
                document.getElementById('WMEbes').parentNode.removeChild(document.getElementById('WMEbes'));

        if (unsafeWindow.W.selectionManager.getSelectedFeatures().length === 0) return;

        try {
            if (document.getElementById('WMEbes') !== null) return;
        } catch (e) {
        }

        var b1 = $('<button class="btn btn-sm" id="ANode" style="margin-left: 0;padding-left:15px;padding-right:15px; font-size:10px;" title="Go to segment A">A</button>');
        var b2 = $('<button class="btn btn-sm" id="BNode" style="margin-left: 5px;padding-left:15px;padding-right:15px; font-size:10px;" title="Go to segment B">B</button>');

        if (WMEbes.isLast) {
            var b3 = $('<button class="btn btn-sm" id="LastPos" style="margin-left: 5px; font-size:10px;padding-left:10px;padding-right:10px;background-color:#ccffcc;" title="Go to remebered position">return</button>');
            var b4 = $('<button class="btn btn-sm" id="RemoveLast" style="margin-left: 5px; font-size:10px;padding-left:5px;padding-right:5px;background-color:#ffcccc;" title="Delete remebered position">X</button>');
        }

        var c = $('<section id="WMEbes" class="attributes-form side-panel-section" style="margin-bottom:0; height:32px;"/>');

        var dGroup = $('<div class="control-group"/>');
        var dControls = $('<div class="controls"/>');
        dControls.append($('<label class="control-label" style="width:60px">Go to</label>'));
        dControls.append(b1);
        dControls.append(b2);
        if (WMEbes.isLast) {
            dControls.append(b3);
            dControls.append(b4);
        }
        dGroup.append(dControls);
        c.append(dGroup);

        $("#segment-edit-general").prepend(c);
        $('#ANode').click(WMEbes.goBegin);
        $('#BNode').click(WMEbes.goEnd);
        $('#LastPos').click(WMEbes.goLast);
        $('#RemoveLast').click(WMEbes.removeLast);
    };


    WMEbes.goBegin = function (ev) {
        WMEbes.go(ev, 1);
    };

    WMEbes.goEnd = function (ev) {
        WMEbes.go(ev, 2);
    };

    WMEbes.goLast = function (ev) {
        console.log("Go Last");
        WMEbes.go(ev, 3);
    };

    WMEbes.removeLast = function () {
        WMEbes.isLast = false;
        WMEbes.refreshB = true;
        WMEbes.insertButtons();
        WMEbes.refreshB = false;
        WMEbes.saveLS();
    };

    WMEbes.loadLS = function () {
        if (this.isLSsupported) {
            try {
                if ("string" == typeof localStorage.WMEbes) {
                    var s = JSON.parse(localStorage.WMEbes);
                    this.isLast = s.isLast;
                    this.last = s.last;
                    if ("undefined" != typeof s.zoom) {
                        this.zoom = s.zoom;
                    }
                }
            } catch (err) {
            }
        }
    };

    WMEbes.saveLS = function () {
        if (this.isLSsupported) {
            var s = {};
            s.isLast = this.isLast;
            s.last = this.last;
            s.zoom = this.zoom;
            localStorage.WMEbes = JSON.stringify(s);
        }
    };

    WMEbes.timer = function () {
        if ((unsafeWindow.W.selectionManager.getSelectedFeatures().length > 0) && !(document.getElementById('WMEbes') !== null)) {
            WMEbes.insertButtons();
        }
    };

    WMEbes.go = function (ev, where) {
        let foundSelectedSegment = false;
        let pa;

        for (var s = unsafeWindow.W.selectionManager.getSelectedFeatures().length - 1; s >= 0; s--) {
            let sel = W.selectionManager.getSelectedFeatures()[s];
            if ((sel.type === "segment") || (sel.model.type === "segment")) {

                foundSelectedSegment = true;
                let pb = unsafeWindow.W.map.getCenter();
                let zoom = unsafeWindow.W.map.getZoom(); // Gets zoom level

                var vert = sel.geometry.getVertices();
                if (where === 3) {
                    if (this.isLast) {
                        pa = {x: this.last[0], y: this.last[1]};
                        this.isLast = false;
                        zoom = this.zoom;
                    } else {
                        return;
                    }
                } else if (where === 1) {
                    pa = vert[0].clone();
                } else {
                    pa = vert[vert.length - 1].clone();
                }
                unsafeWindow.W.map.setCenter({lon: pa.x, lat: pa.y});

                if ((!this.isLast) && (where !== 3)) {
                    this.last = [pb.lon, pb.lat];
                    this.zoom = zoom;
                    this.isLast = true;
                    this.saveLS();
                    this.refreshB = true;
                    this.insertButtons();
                    this.refreshB = false;
                } else if (where === 3) {
                    this.refreshB = true;
                    this.insertButtons();
                    this.refreshB = false;
                    this.saveLS();
                }
            }
        }
        if (!foundSelectedSegment) {
            alert("Fatal Error, no selected road! how this is even possible that you see this message ?");
        }
    };

    WMEbes.console_log = function (msg) {
        if (typeof console != "undefined")
            console.log(msg);
    };

    WMEbes.startcode = function () {
        // Check if WME is loaded, if not, waiting a moment and checks again. if yes addiding event to selectionManager
        try {
            if ("undefined" != typeof unsafeWindow.W.selectionManager) {
                unsafeWindow.W.selectionManager.events.register("selectionchanged", null, WMEbes.insertButtons);
                try { // check if localStorage is supported in this browser
                    if ('localStorage' in window && window['localStorage'] !== null)
                        WMEbes.isLSsupported = true;
                } catch (e) {
                    WMEbes.isLSsupported = false;
                }
                WMEbes.loadLS();
                WMEbes.interval = setInterval(WMEbes.timer, 200);
                WMEbes.console_log("WME begin-end-street initialized");
            } else {
                setTimeout(WMEbes.startcode, 400);
            }
        } catch (err) {
            setTimeout(WMEbes.startcode, 400);
        }
    };

    WMEbes.startcode();
}


WMEbes_bootstrap();
