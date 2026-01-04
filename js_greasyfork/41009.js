// ==UserScript==
// @name         WME Switch Uturns (wows-india2018)
// @version      2018.05.01.002JDraaijer
// @description  Switches Uturns for selected node. Forked and improved "WME Add Uturn from node" script, updated for Wow 2 India 2018. Added Ctrl+u (allow all U-turns) and Ctrl+i (disallow all U-turns).
// @author       ixxvivxxi, uranik, turbopirate, JDraaijer
// @include      /^https:\/\/(www|beta)\.waze\.com(\/\w{2,3}|\/\w{2,3}-\w{2,3}|\/\w{2,3}-\w{2,3}-\w{2,3})?\/editor\b/
// @grant        none
// @namespace    https://github.com/waze-ua/wme-switch-uturns
// @downloadURL https://update.greasyfork.org/scripts/41009/WME%20Switch%20Uturns%20%28wows-india2018%29.user.js
// @updateURL https://update.greasyfork.org/scripts/41009/WME%20Switch%20Uturns%20%28wows-india2018%29.meta.js
// ==/UserScript==

function Uturns_bootstrap()
{
    var bGreasemonkeyServiceDefined = false;
    try
    {
        if ("object" === typeof Components.interfaces.gmIGreasemonkeyService)
        {
            bGreasemonkeyServiceDefined = true;
        }
    }
    catch (err)
    {
        //Ignore.
    }
    if ( "undefined" === typeof unsafeWindow  ||  ! bGreasemonkeyServiceDefined)
    {
        unsafeWindow    = ( function ()
                           {
            var dummyElem   = document.createElement('p');
            dummyElem.setAttribute ('onclick', 'return window;');
            return dummyElem.onclick ();
        } ) ();
    }
    /* begin running the code! */
    setTimeout(startUturns,999);
}

function getUturnsCount(node) {
    var numUTurns=0;
    for(var currentNode in W.model.nodes.objects)
    {
        var node2=W.model.nodes.get(currentNode);
        if(node2.attributes.id==node.attributes.id)
        {
            if(node2===undefined)continue;
            numUTurns=0;
            for(var j=0;j<node2.attributes.segIDs.length;j++)
            {
                var segID=node2.attributes.segIDs[j];
                var segment2=W.model.segments.get(segID);
                if(segment2===undefined)continue;
                var attributes=segment2.attributes;
                if(attributes.fwdDirection===true&&attributes.revDirection===true)
                {
                    if(node2.attributes.segIDs.length>1)
                    {
                        if(segment2.isTurnAllowed(segment2,node2))
                            numUTurns++;
                    }
                }
            }
        }
    }
    console.log('u-turns count in selected node', numUTurns);
    return numUTurns;
}

function getSegmentsCount(node) {
    return node.attributes.segIDs.length;
}

function switchUturn(s) {
    var wazeActionSetTurn= require("Waze/Model/Graph/Actions/SetTurn");
    var node = W.selectionManager.getSelectedFeatures()[0].model;
    var segIDs = node.attributes.segIDs;

    for (var i = 0; i < segIDs.length; i++) {
        var segment = W.model.segments.objects[segIDs[i]];
        var turn = W.model.getTurnGraph().getTurnThroughNode(node, segment, segment);
        W.model.actionManager.add(new wazeActionSetTurn(W.model.getTurnGraph(), turn.withTurnData(turn.getTurnData().withState(s))));
    }
}

function getI18N(id, loc) {
    var i18n = {
        "allow_uturns": {
            "en" : "Allow all U-turns",
            "ru" : "Разрешить все развороты",
            "uk" : "Дозволити усі розвороти",
            "nl" : "Alle U-turns toestaan"
        },
        "disallow_uturns": {
            "en": "Disallow all U-turns",
            "ru": "Запретить все развороты",
            "uk": "Заборонити усі розвороти",
            "nl": "Alle U-turns weigeren"
        }
    };

    if (id in i18n) {
        if (loc in i18n[id]) {
            return i18n[id][loc];
        } else {
            return i18n[id].en;
        }
    }
}

function updateButtons() {
    var uturnCount = getUturnsCount(W.selectionManager.getSelectedFeatures()[0].model);
    var segsCount = getSegmentsCount(W.selectionManager.getSelectedFeatures()[0].model);

    var disallowBtn = $('#edit-panel .side-panel-section #disallowUturns');
    var allowBtn = $('#edit-panel .side-panel-section #allowUturns');

    if (segsCount == 1) {
        allowBtn.hide();
        disallowBtn.hide();
        return;
    }

    if (uturnCount === 0) {
        allowBtn.show();
        disallowBtn.hide();
        return;
    }

    if (uturnCount != segsCount) {
        allowBtn.show();
        disallowBtn.show();
    } else {
        allowBtn.hide();
        disallowBtn.show();
    }
}

function allowUturns() {
    switchUturn(1);
    updateButtons();
}

function disallowUturns() {
    switchUturn(0);
    updateButtons();
}

function registerKeyShortcut(action_name, annotation, callback, key_map) {
    W.accelerators.addAction(action_name, {group: 'default'});
    W.accelerators.events.register(action_name, null, callback);
    W.accelerators._registerShortcuts(key_map);
}

function startUturns() {
    W.selectionManager.events.register("selectionchanged", null, showButton);
    function showButton() {
        var loc = I18n.locale;
        if(W.selectionManager.getSelectedFeatures().length === 0 || W.selectionManager.getSelectedFeatures().length > 1) return;
        if(W.selectionManager.getSelectedFeatures()[0].model.type == "node") {
            $('#edit-panel .side-panel-section:first-child').append('<button id="disallowUturns" class="btn btn-default" style="margin-top: 5px;">' + getI18N("disallow_uturns", loc) + '</button>');
            $('#edit-panel .side-panel-section:first-child').append('<button id="allowUturns" class="btn btn-default" style="margin-top: 5px;">' + getI18N("allow_uturns", loc) + '</button>');
            updateButtons();
        }
    }
    $('#sidebar').on('click', '#allowUturns', function(event) {
        allowUturns();
    });

    $('#sidebar').on('click', '#disallowUturns', function(event) {
        disallowUturns();
    });

    // Hotkeys
    registerKeyShortcut("WMESwitchUTurns_allowUturns", "Allow all U-turns", allowUturns, {"C+u": "WMESwitchUTurns_allowUturns"});
    registerKeyShortcut("WMESwitchUTurns_disallowUturns", "Disallow all U-turns", disallowUturns, {"C+i": "WMESwitchUTurns_disallowUturns"});
}

Uturns_bootstrap();