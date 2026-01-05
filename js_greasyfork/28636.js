// ==UserScript==
// @name            Open WME in Mi Drive
// @description     Adds a button to open the current WME view in Mi Drive
// @namespace       vaindil
// @version         1.1
// @grant           none
// @include         https://www.waze.com/editor
// @include         https://www.waze.com/editor/*
// @include         https://www.waze.com/*/editor/*
// @include         https://beta.waze.com/editor/*
// @include         https://beta.waze.com/*/editor/*
// @exclude         https://www.waze.com/user/*
// @exclude         https://www.waze.com/*/user/*
// @author          vaindil
// @downloadURL https://update.greasyfork.org/scripts/28636/Open%20WME%20in%20Mi%20Drive.user.js
// @updateURL https://update.greasyfork.org/scripts/28636/Open%20WME%20in%20Mi%20Drive.meta.js
// ==/UserScript==

var icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAASCAYAAABfJS4tAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QsdDy4g/1qyDQAAA1JJREFUOMt1lH9oVnUUxj/n+saS/lhSkBNKKJL+yCAiaQNtP2KBLgyMChuIe0P/qEgsMymzbNnmyKgIjLUpLDShpKJgQriEBhKD0IxCAyMhoyhyi7Xe+z3n6Y/37nU/6gvn3vu9nOe55/uc5x5rebSvif9fGRFnRwa3/9rS1QOIkcEdtJR7F4HdCgTw18jAM6daynu7gIcAAT+UQKM1Gs2gNEAC0zctXT0dI4PP/gTQ0rVnMdJRjMYi8xywDMVyzNqrGJaWiJhTpKoXYRKYsVziQHP51TUCJ9gv1Giq4f4AkGIS4QXFeEkKTEIGJhA2CjoPdGJGFa9WkvYaXJTZWiRUPVJxNGBqaidmL05XVyKcwGTimGBY8qNm1g38I1FXqOKCTUAdClBBahQywxeHd0dtA5QkATEmRfnE0Es/N2/sziLysikbBjYCh2T2iaS7gcdBqwQlapzVxqzs3PUAqKPgPV8KOcCdwIWVnS8Me6WyW8bpL9/bdRg43LT++frM7Fqhr0x0mWWHMOY5SYpGYEOx/baky83LgNXAakKDTet3bDGyVzDaJd0IXBFwAPl1VJs6y0QKpemuA3nJw+e7V2wA+13oEUwDkrYZ9hRm/ZZpYbheAzpnQrzKWzNWofE85gUSW0BNiOOGvS40cPL9nglgYsWD23+zOYiI2TyZh+PuuCfcE8kTyQMPfy653+wRYyeP9Gz92338jnVPFyR+IoUzHQApEikKjkiU3H2OCgIY//rDfX23r9vab7I9AKc+6KuVlIe/a9gvwOKaFB7UrA1kKYL/iI8AkseVleRjMz+8/P4tL0eod3Li0vXJ/VxeNN8lkl/mKKWiYrPqaCjW6SqxfwdWD/x5U8dmFl11NWNHendOJ91y3xNnkJYUuczs1yxXzHg/VeyHUuRDQHNlEqYWTM2SLfdkVmDy5DN/PLLcndydSnEvnpcAfP/pWxc8dHDpvZu7Lxx/hzMfv0HDPWUAbmjf9HCefG2lsEMlEhWPWmR5cvIU5MnJowhPrQDL1jzG+eH9Bz38UkNbeVtDW7nu4ucDXLNqo6WIJ1OEJU8G4Mnrqu5ykvvCUpo3NgFY0dBWbj372dvHq6DYR2a3Af0NbeU3gXpJd80ZtqNAfTHufvwXtm8nDnLoEBMAAAAASUVORK5CYII=';

function gen_url() {
    var topleft= (new OpenLayers.LonLat(Waze.map.getExtent().left,Waze.map.getExtent().top));
    var bottomright= (new OpenLayers.LonLat(Waze.map.getExtent().right,Waze.map.getExtent().bottom));
    var xmin = topleft.lon;
    var xmax = bottomright.lon;
    var ymin = bottomright.lat;
    var ymax = topleft.lat;

    return 'http://mdotnetpublic.state.mi.us/drive/Default.aspx?xmin=' + xmin + '&xmax=' + xmax + '&ymin=' + ymin + '&ymax=' + ymax + '&lc=true&cam=true&tb=false&bc=false&bh1=false&bh2=false&sensor=false&inc=true&mp=false&sign=false&mb=false&cps=false&aps=false&bing=false&source=social&rsp=false&rest=false&park=false&plow=false';
}

function init() {
    try {
        var element = $('.WazeControlPermalink');
        if ($(element).length) {
            $('.WazeControlPermalink > a.livemap-link').after('<a href="' + gen_url() + '" target="_blank" style="padding:5px;cursor:pointer;display:inline-block;margin-left:5px">' +
                                                              '<div class="icon" style="height:18px;width:22px;background-image:url(' + icon + ');"></div>' +
                                                              '</a>');
        } else {
            setTimeout(init, 1000);
        }
    } catch (err) {
        console.log("WMEMiDrive - " + err);
        setTimeout(init, 1000);
    }
}

init();