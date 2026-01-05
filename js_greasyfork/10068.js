// ==UserScript==
// @name:hu             WME Closure Sheet Segéd
// @name:en             WME Closure Sheet Helper
// @description:hu      Lezárási táblázatok kitöltését egyszerűsítő segéd
// @description:en      Helps filling those pesky closure sheets
// @copyright           2016, ragacs
// @name                WME Closure Sheet Helper
// @description         Helps filling those pesky closure sheets
// @version             1.04
// @include             https://www.waze.com/editor*
// @include             https://www.waze.com/*/editor*
// @include             https://beta.waze.com/editor*
// @include             https://beta.waze.com/*/editor*
// @namespace https://greasyfork.org/users/6330
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/10068/WME%20Closure%20Sheet%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/10068/WME%20Closure%20Sheet%20Helper.meta.js
// ==/UserScript==

var wmecsh_version = "1.04";

/* bootstrap, will call initialiseClosureSheetHelper() */
function bootstrapClosureSheetHelper()
{
  /* begin running the code! */
  setTimeout(initialiseClosureSheetHelper, 999);
}

/* helper function */
function getElementsByClassName(classname, node) {
  if(!node) node = document.getElementsByTagName("body")[0];
  var a = [];
  var re = new RegExp('\\b' + classname + '\\b');
  var els = node.getElementsByTagName("*");
  for (var i=0,j=els.length; i<j; i++)
    if (re.test(els[i].className)) a.push(els[i]);
  return a;
}

function getId(node) {
  return document.getElementById(node);
}

function sortByAB(arr)
{
    //var revsegs=Waze.selectionManager.getReversedSegments();
    var nodes = {};
    var earr = arr.splice(0, arr.length);
    var rnodes = [];
    // collect segments under their node elements
    for(var a=0; a < earr.length; a++)
    {
        if(nodes[earr[a].model.attributes.fromNodeID] === undefined)
            nodes[earr[a].model.attributes.fromNodeID] = [];
        nodes[earr[a].model.attributes.fromNodeID].push(earr[a]);
        
        if(nodes[earr[a].model.attributes.toNodeID] === undefined)
            nodes[earr[a].model.attributes.toNodeID] = [];
        nodes[earr[a].model.attributes.toNodeID].push(earr[a]);
    }

    while(earr.length != arr.length)
    {
        var node = 0;
        // search for nodes with odd connections - these will be start/end points
        for(var n in nodes)
        {
            if(node == 0 && nodes[n].length > 0)
                node = Number(n); // safety starting point if no odd connections found (circle selected)
            if(nodes[n].length % 2 == 1)
            {
                node = Number(n);
                break;
            }
        }
        // walk on the chain to the end
        while(node != 0)
        {
            var seg = nodes[node].pop();
            arr.push(seg);
            rnodes.push(node);
            if(seg.model.attributes.fromNodeID == node)
                node = seg.model.attributes.toNodeID;
            else
                node = seg.model.attributes.fromNodeID;
            nodes[node].splice(nodes[node].indexOf(seg), 1);
            if(nodes[node].length == 0)
            {
                rnodes.push(node);                
                node = 0;
            }
        }
    }
    // rnodes will contain the node list for the segment chains
    return rnodes;
}

function clickedClosureSheetHelper(event)
{
    var segs = Waze.selectionManager.selectedItems;
    event = event || window.event;
    var ctrlalt = (event.ctrlKey || event.metaKey);
    var zoom = Waze.map.getZoom();
    
    if(segs.length == 0)
    {
        alert("Select some segments first!");
        return;
    }
    
    if(zoom < 4)
    {
        alert("Too low zoom level!");
        return;
    }
    
    var endobj = {};
    var cityname = "";
    for(var s=0; s < segs.length; s++)
    {
        if(segs[s].model.type === "segment")
        {
            var pristrid = segs[s].model.attributes.primaryStreetID;  // segment's street ID
            var streetname = Waze.model.streets.get(pristrid).name; // street name
            if(streetname === null)
                streetname = "No street";
            if(cityname.length == 0)
                cityname = Waze.model.cities.get(Waze.model.streets.get(pristrid).cityID).name;
            var segid = segs[s].model.attributes.id;               // segment ID
            if(endobj[streetname] === undefined)
                endobj[streetname] = [];
            endobj[streetname].push(segs[s]);
        }
    }
    
    if(cityname.length == 0)
        cityname = "No city";
    var tmplatlon=Waze.map.getCenter();
    tmplatlon.transform(Waze.map.getProjectionObject(), Waze.map.displayProjection); // This will be the center of the map in normal projection EPSG:900913
    // Creating sheet rows
    // date	time	date	time	streetname	segmentids	permalink nodeids
    // permalink = https://www.waze.com/editor/?lon=19.154683728784565&lat=47.46686402709748&zoom=6&segments=102441276
    // 2015-05-08	17:30:00	2015-05-11	00:01:00	Adverse street	199532916,199532917	https://www.waze.com/editor/?env=row&lon=21.61066&lat=47.54755&layers=1476&zoom=6&segments=199532916,199532917 18442418,18442419,21655326
    
    var alls = "";
    for(var k in endobj)
    {
        var line1 = "d\tt\td\tt\t"; 
        var ends = "";
        if (!ctrlalt)
            line1 += cityname + "\t";
        line1 += k + "\t'";
        var plink = "https://www.waze.com/editor/?lon=" + tmplatlon.lon + "&lat=" + tmplatlon.lat + "&zoom=" + zoom + "&segments=";
        var idss = "";
        var nodess = "";
        var lastid = 0;
        var rnodes = sortByAB(endobj[k]);
        for(var si=0; si < endobj[k].length; si++)
        {
            if(endobj[k][si].model.attributes.fromNodeID != lastid && endobj[k][si].model.attributes.toNodeID != lastid)
            {
                if(k == "No street" && lastid != 0)
                {
                    ends += line1 + idss + "\t" + plink + idss + "\t'" + nodess + "\n";
                    idss = "";
                    nodess = "";
                }
                if(nodess.length > 0) nodess += ",";
                nodess += rnodes.shift();
            }
            if(idss.length > 0) idss += ",";
            idss += endobj[k][si].model.attributes.id;
            
            lastid = rnodes.shift();
            if(lastid !== undefined && lastid != 0)
            {
                if(nodess.length > 0) nodess += ",";
                nodess += lastid;
            }
        }
        ends += line1 + idss + "\t" + plink + idss + "\t'" + nodess + "\n";
// There is a problem in Google Chrome and Opera to limit the text in window.prompt to 2000 characters (or less with accented characters)
// These lines below tries to "fix" it but it has some drawbacks. Chrome sticks focus to prompted tabs. So you should paste every block to another app (eg. Notepad)
// which is a pain in the ass. So it is now removed and replaced with a warning.
//        if(alls.length + ends.length > 1900)
//        {
//            window.prompt("CSH v" + wmecsh_version + ". Copy to clipboard: Ctrl+C, Enter", alls);
//            alls = "";
//        }
        alls += ends;
    }
    var msgtitle = "CSH v" + wmecsh_version + ". Copy to clipboard: Ctrl+C, Enter";
    if(alls.length > 1900) msgtitle += "\nWARNING: Chrome browsers truncate string - select fewer segments!";
    window.prompt(msgtitle, alls);
}

/* =========================================================================== */

function initialiseClosureSheetHelper()
{
  // global variables
  var betaMode = location.hostname.match(/beta.waze.com/);

  // add new box to left of the map
  var addon = document.createElement('div');
  addon.id = "closuresheethelper-addon";
  addon.className = "toolbar-button";
  addon.title = "Click to Closures Sheet, Ctrl+Click to Event Sheet";
  addon.innerHTML  = '<span>To Closures Sheet</span>';
  addon.style.backgroundRepeat = "no-repeat";
  addon.style.backgroundPosition = "center center";
  addon.style.backgroundImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAE"
                              + "rUlEQVRYw+2XW2xURRjH/9/MOWdZbGtv1FIumxguwQpdQYqobKBiYuKjL0JC48YnE160T/pk4gM+"
                              + "4IMaog9qQ8OTGnxSowlWWgtNgdo22JIUIhKCcimX9LZ7zsx8PvRsPT09e6PGxKRfstmzszNzfvNd"
                              + "/jMDLNuyLduy/b+Ngj86e4bIGCMYEGDYINh+H44YR+HxIWP/YwBo/5nAYKL5/8EAE8hYllBNq2ql"
                              + "lKKibcOae1YQylPaUUonzo+Ov09EdQCqI6AYABEgGRAFVqx5DsgDMDP3zQSQ8acxzFAA+OnmjYc1"
                              + "y9vaGEgpHgdwYR7MGAOtdeLsyNgpT+m1/2XY+n4d3b+rZUsy66m7jm1NAMA8GDPk+dHLxwpBObb1"
                              + "ly1lX7BNG1OtjdnoKb2+HBjHtq47tn0tk822KG0eGb505ctVNZVtlStXPFgABoIkYFOBifq7Otp3"
                              + "h9sPHe36vhwo25L321pbdqZTycudPUMNZ4bGvpqcmU0BcCanZt0DrU9MAsEcYYABJw/U6Sio9qNd"
                              + "P3pKvVSylyzrVltry9Z0Knk5l0F+YeQKKve8IHnDSQ5Likx8hdPZ1dG+dxHUB13drlIvlhG6a/ta"
                              + "tz2ZTiWv51GGjF8oWBhKAJmsW/sPlJxa11j/6pFDL38bkhSr+9xIt+up50uFitn2+N6dW3ekU8nJ"
                              + "0F91s667w3+eDjonmGOkjXECKzwZARXvPjfS63pqR+lQ1kUfyg3N1fTTwPCAUrrSD1g2GEErKpCO"
                              + "bY3v2d785hcLJ6rqPjfS73pqSxnhGzre0f7U8cUFs/2HM4MnAVQFVMGNBiMYy5L3ldLVYMR7B3/7"
                              + "+PCnXw9MZzJJAlWdGhjer5SuKnlLIVKC6N47J757BYD35527mwD8obVZ53rqNQBrQkNUcCcJ5phJ"
                              + "NK56+/cbNz90lVrrKnVwJpM9+LCiycxWxvX2Xb1x87k5AWcnX19LysnqyopPgnGbd50UwiSaGrrj"
                              + "sVjfv6nqxrBTCMq25MSahrrXNyZW90shVL5NPKaNaTw7PPYREVUBiGWy3ialdV2wn5RiKu44F0Hk"
                              + "LpAbZpUTa2a+pw3ftqRIZFxvdzgNbMuacGx5+rHamhMb1q/+hRlTQlA2nUoaFDkd4POfB2vPjlz6"
                              + "Zmomkwq2V6yM9z6zbfMBKcSNdCrJ+cZ39gwRgEfPDI/1T07Pbg6EbvqFXS1JAFdyDDmgSB2LSGEX"
                              + "QDbcqrUeE0R3CkEFzA07IL7CGQFwyx8fOYcomMBzY2S4fc/25vf8KipogRfzwsLAtA+c1wp6TBBJ"
                              + "AsUjToCylMT3Q0l5HMAPDUZEArS4DxsupzAp4j1FJxBFJ+XFBWK4LDCxGIzNksCYOfJcTwATUel0"
                              + "ixeni3mtIJhhFigxn4r6PTT1ksDAEFF9iMgQlXUL43LXUkwuZDQYPCqR7GFNFJYLYXy3B0+1/lWs"
                              + "JC/k7pUqpGNqSWBE0GEhjMdiV/37Yqku8wA8CBXVTHjB5erYTGN9zTHcwRv+1iQa62s+E3Obd1GP"
                              + "pVNJ7uwZMg211UcAvAvABnD/2ZYtbxUDo2LKzcwxfwHazysFQJW4T+bUXwKI+RFSALLhTXvZlmp/"
                              + "A6Qq+7ZpKd6qAAAAAElFTkSuQmCC)";

  var buttonsBar = getId('edit-buttons');
  var firstButton = getElementsByClassName('toolbar-button', buttonsBar)[0];
  buttonsBar.style.cssText = 'width:' + (3*firstButton.offsetWidth + buttonsBar.offsetWidth) + 'px !important';
  //buttonsBar.style.cssText = 'width:auto !important';    
  addon.style.backgroundSize = window.getComputedStyle(firstButton, ':after').width.split(" ")[0]; //"25px"
  addon.style.width = window.getComputedStyle(firstButton).width;
  addon.style.height = window.getComputedStyle(firstButton).height;
  firstButton.parentNode.insertBefore(addon, firstButton);    
 
  getId('closuresheethelper-addon').onclick = clickedClosureSheetHelper;    
}

/* engage! =================================================================== */
bootstrapClosureSheetHelper();

/* end ======================================================================= */