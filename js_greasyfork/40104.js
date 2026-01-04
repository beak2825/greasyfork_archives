// ==UserScript==
// @name                WME Highlight Disconnected Non Driveable Segments 2
// @description         Átszínezi az egyik vagy mindkét oldalán be nem kötött nem navigálható utakat.
// @include             https://www.waze.com/*/editor*
// @include             https://www.waze.com/editor*
// @include             https://beta.waze.com/*
// @exclude             https://www.waze.com/*user/*editor/*
// @version             1.05
// @grant               none
// @namespace https://greasyfork.org/users/177381
// @downloadURL https://update.greasyfork.org/scripts/40104/WME%20Highlight%20Disconnected%20Non%20Driveable%20Segments%202.user.js
// @updateURL https://update.greasyfork.org/scripts/40104/WME%20Highlight%20Disconnected%20Non%20Driveable%20Segments%202.meta.js
// ==/UserScript==

(function (){

function initialize()
{
    if ( !window.Waze.map )
    {
        setTimeout(initialize, 900);
        return;
    }
    myRank = W.loginManager.user.rank;
    window.setInterval(highlight, 1000);
}

function removeSegID(ID, list)
{
    for ( var i = 0; i < list.length; ++i )
        if ( list[i] == ID )
        {
            list.splice(i, 1);
            break;
        }
}

function segmentIsDriveable(attributes)
{
    return ( attributes.roadType != 5 && attributes.roadType != 10 && attributes.roadType != 16 );
}

function segmentEditable(attributes, rank)
{
    if ( attributes.lockRank !== null )
        return ( attributes.lockRank <= rank );
    else
        return ( attributes.rank <= rank);
}

function otherSegmentOnNode(nodeid, segid)
{
    var node = W.model._roadGraph._nodeRepository.objects[nodeid];
    if ( typeof node === "undefined" )
        return false;
    var segIDs = node.attributes.segIDs;
    for ( var i = 0; i < segIDs.length; ++i )
        if ( segIDs[i] != segid )
            return true;
    return false;
}

function countConnectionsToOtherSegments(attributes)
{
    var result = 0;
    if ( otherSegmentOnNode(attributes.fromNodeID, attributes.id) )
        ++result;
    if ( otherSegmentOnNode(attributes.toNodeID, attributes.id) )
        ++result;
    return result;
}

function segmentInList(segID, segIDList)
{
    for ( var i = 0; i < segIDList.length; ++i )
        if ( segIDList[i] == segID )
            return true;
    return false;
}

function colorSegments(segIDs, color, opacity)
{
    for ( var i = 0; i < segIDs.length; ++i )
    {
        var segment = W.model.segments.objects[segIDs[i]];
        if ( segment.selected || segment.state === "Update" || segment.state === "Insert" )
            continue;
        var line = document.getElementById(segment.geometry.id);
        if ( line === null )
            continue;
        line.setAttribute("stroke", color);
        line.setAttribute("stroke-opacity", opacity);
        line.setAttribute("stroke-dasharray", "none");
    }
}

function highlight(event)
{
    if ( Waze.map.zoom <= 3 )
        return;

    var connected = [], halfconnected = [], notconnected = [];

    var segments = W.model.segments.objects;
    for ( var id in segments )
        if ( segments.hasOwnProperty(id) && !segmentIsDriveable(segments[id].attributes) )
        {
            var conncnt = countConnectionsToOtherSegments(segments[id].attributes);
            if ( conncnt === 2 )
                connected.push(id);
            else if ( conncnt === 1 )
                halfconnected.push(id);
            else
                notconnected.push(id);
        }
    colorSegments(connected, "#00ff00", 0.0);
    colorSegments(halfconnected, "#48e0e8", 0.7);
    colorSegments(notconnected, "#ff3cdd", 0.7);
}

var myRank;
setTimeout(initialize, 2000);

})();

