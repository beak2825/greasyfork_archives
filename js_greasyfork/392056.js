// ==UserScript==
// @name          SOLR Admin - Auto-expand shards and replicas
// @description   Automatically shards in the SOLR Admin collections display
// @include       https://*/solr/*
// @include       http://*/solr/*
// @version       0.3
// @namespace https://greasyfork.org/users/77886
// @require  https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require  https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @downloadURL https://update.greasyfork.org/scripts/392056/SOLR%20Admin%20-%20Auto-expand%20shards%20and%20replicas.user.js
// @updateURL https://update.greasyfork.org/scripts/392056/SOLR%20Admin%20-%20Auto-expand%20shards%20and%20replicas.meta.js
// ==/UserScript==

function clickWhenItAppears (jNode) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent ('click', true, true);
    jNode[0].dispatchEvent (clickEvent);
}

bWaitOnce = true;

// <b class="ng-binding">Shard: shard2</b>
// <span ng-class="{open:shard.show}" class="open"><b class="ng-binding">Shard: shard2</b></span>
waitForKeyElements (
    //"b[class='ng-binding']",
    "span[ng-class='{open:shard.show}']",
    clickWhenItAppears
);

// <span class="openReplica ng-binding" ng-class="{open:replica.show}">Replica: core_node6</span>
waitForKeyElements (
    "span[class='openReplica ng-binding']",
    clickWhenItAppears
);