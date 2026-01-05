// ==UserScript==
// @name:en             Colombia WME Closure Sheet Helper
// @name:sp             Asistente para hoja de Cierres en WME 
// @description:en      Helps filling closure sheets with the structure for Colombia
// @description:sp      Ayuda a diligencias más facilmente la estructura de hoja de cierres de Colombia
// @copyright           2015, ragacs
// @name                Colombian WME Closure Sheet Helper
// @description         Helps filling closure sheets with the structure for Colombia
// @version             0.0.5
// @author         		Mauricio Otálvaro '2015  mincho77
// @include             https://www.waze.com/editor/*
// @include             https://www.waze.com/*/editor/*
// @include             https://editor-beta.waze.com/editor/*
// @include             https://editor-beta.waze.com/*/editor/*
// @namespace https://greasyfork.org/users/6330
// @downloadURL https://update.greasyfork.org/scripts/13867/Colombian%20WME%20Closure%20Sheet%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/13867/Colombian%20WME%20Closure%20Sheet%20Helper.meta.js
// ==/UserScript==

var wmecsh_version = "0.0.5";

/* bootstrap, will call initialiseClosureSheetHelper() */
function bootstrapClosureSheetHelper()
{
  var bGreasemonkeyServiceDefined = false;

  try {
    bGreasemonkeyServiceDefined = (typeof Components.interfaces.gmIGreasemonkeyService === "object");
  }
  catch (err) { /* Ignore */ }

  if (typeof unsafeWindow === "undefined" || ! bGreasemonkeyServiceDefined) {
    unsafeWindow    = ( function () {
      var dummyElem = document.createElement('p');
      dummyElem.setAttribute('onclick', 'return window;');
      return dummyElem.onclick();
    }) ();
  }

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

function clickedClosureSheetHelper(event)
{
    var segs = Waze.selectionManager.selectedItems;
    if(segs.length === 0)
    {
        alert("Select some segments first!");
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
            if(cityname.length === 0)
                cityname = Waze.model.cities.get(Waze.model.streets.get(pristrid).cityID).name;
            var segid = segs[s].model.attributes.id;               // segment ID
            if(endobj[streetname] === undefined)
                endobj[streetname] = [];
            endobj[streetname].push(segid);
        }
    }
    
    if(cityname.length === 0)
        cityname = "No city";
    var tmplatlon=Waze.map.getCenter();
    tmplatlon.transform(Waze.map.getProjectionObject(), Waze.map.displayProjection); // This will be the center of the map in normal projection EPSG:900913
    var zoom = Waze.map.getZoom();
    // Creating sheet rows
    // date	time	date	time	streetname	segmentids	permalink
    // permalink = https://www.waze.com/editor/?lon=19.154683728784565&lat=47.46686402709748&zoom=6&segments=102441276
    // 2015-05-08	17:30:00	2015-05-11	00:01:00	Bólyai utca	199532916,199532917	https://www.waze.com/editor/?env=row&lon=21.61066&lat=47.54755&layers=1476&zoom=6&segments=199532916,199532917
    event = event || window.event;
    
    var alls = "";
    for(var k in endobj)
    {
        //var ends = "date\ttime\tdate\ttime\t";
		var thisUser = Waze.loginManager.user;
		var ends ="\t\t\t\t";
        if (!event.ctrlKey && !event.metaKey)
            ends += cityname + "\t";
        ends += k + "\t'";
        var plink = "https://www.waze.com/editor/?lon=" + tmplatlon.lon + "&lat=" + tmplatlon.lat + "&zoom=" + zoom + "&segments=";
        var idss = "";
        for(var si=0; si < endobj[k].length; si++)
        {
            if(idss.length > 0) idss += ",";
            idss += endobj[k][si];
        }
        ends += idss + "\t" + plink + idss + "\t\t" + thisUser.userName + "\n";
        alls += ends;
    }
    window.prompt("CSH v" + wmecsh_version + ". Copy to clipboard: Ctrl+C, Enter", alls);    
}

/* =========================================================================== */

function initialiseClosureSheetHelper()
{
  // global variables
  var betaMode = location.hostname.match(/editor-beta.waze.com/);

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
  addon.style.backgroundSize = window.getComputedStyle(firstButton, ':after').backgroundSize.split(" ")[0]; //"25px"
  firstButton.parentNode.insertBefore(addon, firstButton);
 
  getId('closuresheethelper-addon').onclick = clickedClosureSheetHelper;    
}

/* engage! =================================================================== */
bootstrapClosureSheetHelper();

/* end ======================================================================= */