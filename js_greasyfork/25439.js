// ==UserScript==
// @name                WME Livemap Speed
// @author              Vinkoy
// @description         Wazers speed on livemap
// @include             https://www.waze.com/livemap*
// @include             https://www.waze.com/*/livemap*
// @version             0.1
// @grant               none
// @namespace           https://greasyfork.org/en/scripts/25439-wme-livemap-speed
// @downloadURL https://update.greasyfork.org/scripts/25439/WME%20Livemap%20Speed.user.js
// @updateURL https://update.greasyfork.org/scripts/25439/WME%20Livemap%20Speed.meta.js
// ==/UserScript==

(function ()
{
    var info = null;
    var usernames = null;
    var timer = null;
    var pendingData = false;

    function bootstrapWspeed()
    {
        var bGreasemonkeyServiceDefined = false;

        try
        {
            bGreasemonkeyServiceDefined = (typeof Components.interfaces.gmIGreasemonkeyService === "object");
        }
        catch (err)
        { /* Ignore */
        }

        if (typeof unsafeWindow === "undefined" || !bGreasemonkeyServiceDefined)
        {
            unsafeWindow = (function ()
            {
                var dummyElem = document.createElement('p');
                dummyElem.setAttribute('onclick', 'return window;');
                return dummyElem.onclick();
            } )();
        }
        setTimeout(initializeWspeed, 999);
    }

    function initializeWspeed()
    {
        $('.search-forms').append('<div class="checkbox"> <label> <input type="checkbox" style="opacity:1;position:relative;" checked id="showSpeed"> Показать скорость вейзеров</label> </div>');

        if (document.getElementById("showSpeed")) localDataManager();
        
        document.getElementById('showSpeed').addEventListener("click", toggle, true);
        document.getElementById('map').addEventListener("mousewheel", refresh_data, true);
        document.getElementById('map').addEventListener("mousedown", clear, true);
        document.getElementById('map').addEventListener("mouseup", refresh_data, true);

        toggle();
    }

    function localDataManager()
    {
        // restore saved settings
        if (localStorage.WMElivemapSpeed)
        {
            options = JSON.parse(localStorage.WMElivemapSpeed);
            if(options[1] !== undefined)
                document.getElementById('showSpeed').checked = options[1];
            else
                document.getElementById('showSpeed').checked = true;
        }
        else
        {
            document.getElementById('showSpeed').checked = true;
        }
        // overload the WME exit function
        wme_saveLivemapSpeedOptions = function()
        {
            if (localStorage)
            {
                var options = [];

                // preserve previous options which may get lost after logout
                if (localStorage.WMElivemapSpeed)
                    options = JSON.parse(localStorage.WMElivemapSpeed);

                options[1] = document.getElementById('showSpeed').checked;

                localStorage.WMElivemapSpeed = JSON.stringify(options);
            }
        };
        document.getElementById('showSpeed').onchange = wme_saveLivemapSpeedOptions;
        window.addEventListener("beforeunload", wme_saveLivemapSpeedOptions, false);
    }
    
    function toggle()
    {
        if (document.getElementById('showSpeed').checked)
        {
            auto_update();
            
        }
        else
        {
            clearTimeout(timer);
            clear();
        }
    }

    function auto_update()
    {
        clear(); 
        getWazers();
        timer = setTimeout(function() { auto_update(); }, 30000);
    }
    
    function refresh_data()
    {
        clear();
        if (!pendingData)
        {
            pendingData = true;
            setTimeout(function() {getWazers();pendingData = false;}, 500);
        }
    }

    function clear()
    {
        var mapObj = document.getElementById('map');

        var children = mapObj.childNodes;

        for (var i = 0; i < children.length; i++)
        {
            if (children[i].id === "Wspeed")
            {
                mapObj.removeChild(children[i]);
                i--;
            }
        }
    }

    function getWazers()
    {
        //console.log("Wazers speed updated");
        if (!document.getElementById('showSpeed').checked)
            return;

        var top = W.controller._mapView.map.getBounds().getNorth();
        var bottom = W.controller._mapView.map.getBounds().getSouth();
        var left = W.controller._mapView.map.getBounds().getWest();
        var right = W.controller._mapView.map.getBounds().getEast();

        if (info !== null)
        {
            info.style.visibility = 'hidden';
            info.innerHTML = '';
        }

        var url = "https://www.waze.com/row-rtserver/web/GeoRSS";
        var data =
        {
            types: "users",
            left: left,
            right: right,
            bottom: top,
            top: bottom
        };

        $.ajax(
        {
            dataType: "json",
            url: url,
            data: data,
            success: function (json)
            {
                var Wdata = json.users;
                try
                {
                    for (var i = 0; i < Wdata.length; i++)
                    {
                        var lat = Wdata[i].location.y;
                        var lon = Wdata[i].location.x;
                        var id = Wdata[i].id.replace(/.*\-(\d+)\/.*/, '$1');
                        var speed = Math.round(Wdata[i].speed * 3.6);
                        // console.log(id, speed, lat, lon);
                        addInfo(lat, lon, id, speed);
                    }
                }
                catch (e){}
            }
        }
        );
    }

    function addInfo(lat, lon, id, speed)
    {
        var point =
        {
            lat: lat,
            lon: lon
        };
        var pix = W.controller._mapView.map.latLngToContainerPoint(point);

        info = document.createElement('div');
        info.id = 'Wspeed';
        info.style.position = 'absolute';
        info.style.zIndex = 6;
        info.style.pointerEvents = 'none';
        info.style.backgroundColor = '#FFFFEE';
        info.style.borderWidth = '1px';
        info.style.borderStyle = 'solid';
        info.style.borderRadius = '5px';
        info.style.boxShadow = '5px 5px 5px rgba(50, 50, 50, 0.3)';
        info.style.padding = '0px 5px 0px 5px';
        info.style.left = pix.x + 'px';
        info.style.top = pix.y + 'px';
        info.style.visibility = 'visible';

        info.innerHTML = speed + ' км/ч';

        document.getElementById('map').appendChild(info);
    }

    bootstrapWspeed();
}
)();
