// ==UserScript==
// @name                WME Highlight Disconnected Non Driveable Segments
// @description         Rózsaszínre színezi a be nem kötött nem navigálható utakat
// @include             https://www.waze.com/*/editor*
// @include             https://www.waze.com/editor*
// @include             https://beta.waze.com/*
// @exclude             https://www.waze.com/*user/*editor/*
// @version             1.06
// @grant               none
// @namespace https://greasyfork.org/users/177381
// @downloadURL https://update.greasyfork.org/scripts/40103/WME%20Highlight%20Disconnected%20Non%20Driveable%20Segments.user.js
// @updateURL https://update.greasyfork.org/scripts/40103/WME%20Highlight%20Disconnected%20Non%20Driveable%20Segments.meta.js
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

function driveableSegmentOnNode(nodeid)
{
    var node = W.model._roadGraph._nodeRepository.objects[nodeid];
    if ( typeof node === "undefined" )
        return false;
    var segIDs = node.attributes.segIDs;
    for ( var i = 0; i < segIDs.length; ++i )
    {
        var segment = W.model.segments.objects[segIDs[i]];
        if ( typeof segment === "undefined" )
            continue;
        if ( segmentIsDriveable(segment.attributes) )
            return true;
    }
    return false;
}

function segmentConnectedToDriveable(attributes)
{
    return ( driveableSegmentOnNode(attributes.fromNodeID) ||
             driveableSegmentOnNode(attributes.toNodeID) );
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
    function moveSegmentsToConnectedFromPartition(segID)
    {
        var nodes = W.model._roadGraph._nodeRepository.objects;
        var tobemovedlist = [segID];
        while ( tobemovedlist.length > 0 )
        {
            var movedid = tobemovedlist.pop();
            removeSegID(movedid, notconnected);
            connected.push(movedid);

            var attributes = W.model.segments.objects[movedid].attributes;
            var fromNode = nodes[attributes.fromNodeID], toNode = nodes[attributes.toNodeID];
            var connectingSegIDs = [];
            if ( typeof fromNode !== "undefined" )
                connectingSegIDs = connectingSegIDs.concat(fromNode.attributes.segIDs);
            if ( typeof toNode !== "undefined" )
                connectingSegIDs = connectingSegIDs.concat(toNode.attributes.segIDs);
            for ( var i = 0; i < connectingSegIDs.length; ++i )
            {
                var id = connectingSegIDs[i];
                if ( !segmentInList(id, tobemovedlist) && segmentInList(id, notconnected) )
                    tobemovedlist.push(id);
            }
        }
    }

    if ( Waze.map.zoom <= 3 )
        return;

    var connected = [], notconnected = [];

    var segments = W.model.segments.objects;
    for ( var id in segments )
        if ( segments.hasOwnProperty(id) && !segmentIsDriveable(segments[id].attributes) )
            notconnected.push(id);
    for ( var i = 0; i < notconnected.length; ++i )
    {
        var id = notconnected[i];
        var attributes = W.model.segments.objects[id].attributes;
        if ( segmentConnectedToDriveable(attributes) )
        {
            moveSegmentsToConnectedFromPartition(id);
            i = -1;
        }
    }

    colorSegments(connected, "#00ff00", 0.0);
    colorSegments(notconnected, "#ff3cdd", 0.7);
}

var myRank;
setTimeout(initialize, 2000);

})();
