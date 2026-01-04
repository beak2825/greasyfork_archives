// ==UserScript==
// @name         WME PA GIS Map
// @namespace    https://greasyfork.org/users/45389
// @version      0.1
// @description  Open a PA GIS map in another window, at the same location as the WME map.  Keeps the location of the GIS map synced to WME.
// @author       MapOMatic
// @include     /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @include     /^https?:\/\/www\.arcgis\.com\/home\/webmap\/viewer\.html\?webmap=8f0eff71cd5d487694ded927009c6d6d.*/
// @license      GNU GPLv3
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAARuklEQVR42u3d/28b933H8dcdTwxLUQLtyLLs2XHmNHJTebaAFY2RZBiQBFvdtRuGeRsWbMWGrcWwYb/vv9iP+20YsB+6/TAMGBCkRdoZyewgDgTHsWOn3mQvTdJUSmxHcRSRpqnjfrjPR/rooyP1jUfxqOcDOEgipSMp3vv1+cL7IgEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADLuRfAGxfkNOiD70AiM0i5yuAAQoAW/iRWdzWP5bU9L4C2ECUw8IvSio5IWCLvi6pYf6GEAA2oZCD4o8kDUn6iqRhSaOSHpX0VUkT5ncKpjcTS2pJWiYAgPz2ANxWv2iWilkek/THkk6aVv9lSW86r8UdBhACQI4CwO/ulySVzTI+NDR0dmRk5Hu1Wm2iVqvZYi9L+sR83zChUOetBfITAH6Lb4u/Imm0UCic2rdv3/dPnDhxampqqnzz5k29/vrrarVaoaTHJT0paU7Solnc+QFs/z3Z7ccIM15/7H2/53qNUR9sYGmFb1v9x4eHh//k6NGj33r66aer09PTqlarunv3roIgUKvVkgmJcfN3drgQ9mDj6fciDHe5CHf6+GHGzztOKfzmXhs+Rru0Uad19e3sfiUMw6+NjIycPXLkyLnp6enyqVOnND4+roWFBb366qt67bXXFMex+xqq5m/d9TRTUr7bxZHHjT/cwW1ZPH6nn8MeBUDTDB/dZU8EQbSLhV90lrKk6tDQ0PGRkZHfO3r06HOTk5OHT58+HU5MTKjRaGhmZkZvvfWWrl+/rqWlJX/dZafwy2YOIN7E6wt7VGDdKr5wG0ETdvHncBuv1f/7yLvP3y7S1ht1WF+n29vtNBY680X3zbLkLTYINMghEPWw8COv8G2LXQmC4BtjY2O/c+jQoedOnz5dnZqa0uHDh/Xw4UPNzs7qjTfe0JUrV/T555+3ewy3+EdNehfNGxhvojDCbRRlN4qvXaFs5jmEHX6n3WL/5+57Yd+bildoBSdcS20KLu1nv9Dd7yOzPndnrigIgjAMwygIgnIYhmEQBDK3KQxDBUFQDoIgCoJkv7UgCFYex/6uvd387N6mVqsVtlotLS8v68GDB1paWopbrVZsCv19Se9K+qmkWRMGRTOXFGp1QnkgQyDoQeGHXtHb8f3E8PDws/v27fv2E0888fWpqany5OSkDhw4oFqtptu3b+vixYu6fv267t69a8f77bwh6RXzhi5KWnBSPHZCIvRalNCZe0jbiIttWpGww+2RKZ60Hk/ZK7qi2YgrQRCU7IbrFEBkAtJvGUNTDKG78bsF4S62qMxX93dUKBQUhmFov5rfU6FQWFmcorQFmDyJMFz52RSqCoXCSvG664iiaM1Xe7/7e3Yddn12MeuUU9BrfnYX/3lZy8vLajabqtVqunPnjm7duqWbN2/qiy++sMV9T9I/myD4xGxDi852NJA7l0U9WH/RaUVGJT1WKpVeOHjw4IuTk5OTTz31VPHEiROqVquq1Wq6evWqLl++rGvXrunTTz/V8vLyZh7npKQjpgDiQqHQCMOwGQTByhguCIKiUzwrxVIoFIpBEER24wsT9mtki8jdoLyWZuVns47Q2XhDv5Dshu4XgFtA7YrC3aDd25znvmYdfhH6j+e0sOuKxl2fva1dCPvBkFacfkG2Wq2V9dnvW62W4jje8D47/+P+jv81bYnjWFEUaf/+/SoUCioWi3r77bdVq9VCSWOSfiBpv6R/9wJ8yfQEBi4Eogxbf79b/rik71ar1XPT09NjZ86cCZ988kkNDw/rs88+06VLlzQzM6P33ntPCwsLG7X4vtFyuTw6NjamRx99VAcPHtTIyIiKxeLKxt6u5XGLwC62xbG3d9rg2y1+a5ZWCO0KwtVuY077Pf97vyDiOF5ZbItov7eLLbLl5eU1f2PvSyvCtEJLezz7mM1mc933/uOnBYJ/32aKPy247Hvhvg67HUl6yWy3/+YNVUIvBGICoH3xuy3/qKRnJP1dpVI5efbs2ejMmTPat2+f5ufndeHCBV2+fFmzs7Oq1Wr+G7Jp5XJZx44d07Fjx3TgwAENDw9raGhoXfH5BeFuqPZ7u/GnFUKn1kvSmvX4BeQu/obvFlhaAbm3d3oO7Qow7Tn4j51WLGnB0u7+Trd3Ktg+U5J0znyy9EMzR+CHwMBMDgYZBYDddbeqZNfdfwiC4OT09HR47tw5FQoF3bhxQ5cuXdJHH32kL7/8cucvJAhULpdVLpdVqVRUKpUURdGa7qtb4P7SqaDSiq5Tq7tR1zatZUPfaUq6IukfzeTggjMvUHfml2ICYH2vwo73xyX9oaS/HxoaCp999lmNj4/rnXfe0a1bt9RsNtnM0O/mJP2TpPOS7rSZHMytQkYB8IikESVH7f2BpBOStLS0pBs3bmhubo5WD3lRkTQl6aGkD51W/6HzfSuvLy6rOQD3s+VxOzaen59nc0Ie7Zf0R5Kua+2egzYAGgTA2gCws6dlEwJA3o1JOqtkf4GGMw/QUI4PPAszWp+/AxCQd6GkSRMEFa0edxLl/UVlue4o7/8gwDFhAsAt/lA5Pjt1mNE60w7wAPKurGRyu0gAbC0MgEEQKf1IQ4YAwB5gTxjS7jBkAgAYYHUnAKKUoUAuuzRZd/8JGQwKe4Cbez6LktZej6LTmaj2VAAAg6Yk6TklewTed3oEtpbqWn9ewb4Ogm7vChwouYjHI0o+K52Q9ILYGQiD46CkU2abHpJUU7Ir8FCbXq893qa1FwPgsKTnCQAMkFDJgW4nJX1TyYlo5rR6rkH/o8GWU/ytvRYAhwgADLBHJD0h6bclHTf1VDN1UHBa/2VT/DEBAAyeIUnHTI/gqJJDhr8w9bBs5gSWvd5A33RnAHRvaPC8pO8rORHOqFaPG+jLjwoJAKC7IjM/8OtKzohlT4jblwfFEQBANnVlW3639e+7/WIIAKD76pJ+oRzsIUgAAN0VKzmZ6D2lX2w0JgCAwbUg6bLpBdizBvXttQQIAKC73pX0c61eZNQGQV+ePZgAALo79p9xir/vry1IAADdMytp3iv+vr6cGAEAdEdT0s+UHCWYi9afAAC6Z8kEQN1p+RsEALA3zEm664z/c3HpMAIA6E73/y2v+Ov93voTAEB3fCLpA61+5OefGYgeADDAbmh19t9v/UUAAINrQdKbbbr/fX9OQAIA2NnYf0bJ5N9i3oqfAAB25o6Syb/7JgD8z/5FAACDqS7pvyT90gSADYFczP4TAMDOuv4XJF1zit8NgFwUv8SFQYCtapjiP69kArBd658L9ACArQfAbVPsi97YP1etPwEAbF1ZyRl/G1q/33+uip8AALZXM5Om2BveQgAAe4h/AdA4by+AAAC2bq5DCBAAwABrSvo4j919AgDYuUUTALbV79vTfREAQPd9rOSiH7md+CMAgO2pK9n33z/wxx77TwAAA8pe8eem1h/4k5uj/wgAYHtmJb2s9N1/czsMIACAjS0oOfLvvvnehsASAQAMvo8lfajV8/2nnfxDBAAwmO6bQl/S+tN+xwQAMNjGTK3Yz/2bWrsPgAgAYHAdlvSrg1gzBACwsbKkF83XoqSS+RrlvYYIAGBzjkt6QdKoCYKyFwS5xCnBgM03lt9WsiOQ+/GfeyxATAAAg6sq6S+V7AeQFgCcEAQYcEck/YWSicGqMyQo5XFOoNDl9QWShiQ9Iqki6ZCk5833wCAIJE2Yor8t6YGkZdPyL0tqOQtDAGBAvWiGAf+i9FOC5WI4QAAA26+d35J0T9J/qP35AWMCABhMZUl/quTYgB+nBECz33sCBACwM0VJ31My+feyd1+933sCBACwc1VJL5mewPmU++v9GgIEANAd+yX9jekJnHeKPezn4QABAHTPqKQ/N3X1Y+f22OkF9FUIEABAd42bEFiS9N9e17/vriLEjkBA931F0rSSE4nMm2K3OwYtm699sbMQPQAgu+GA/XTglX4dDhAAQHbGJP2VGQ681o/DAYYAQLaKkk6bEPilNxxoaZePHaAHAPRmOPCS6fL7nw5oN3sCBADQu+HAD5ScSdjfWSg2t/c8BAgAoHcqkv5ayTEEr6Tc3/MQIACA3qoqOYCoLumnux0CBADQe/tNT6Cp9Z8O2BAgAIABZncbbkq6qPSPB5sEADC4DpsQuKv1VxuqqwdnGuakoMDuekzS30qaNEODqlYvQJL5SUYJAGD3fVXSn5kwcM80XDQ1GhIAwOAKJX1D0u+bAKgq+ciw6IQAAQAMsKKkb0n6TWcoUMm6F8AkINA/SpJ+V9ItJZOAS0o+EnSvPpSrHkAur5cG7KLjkp428wCVrOcCGAIA/SWSdEbJmYXcAIjyGAC0/sDWjWn18mNFZXgJ8rAHxU8IAFtTlnTQzAm4Fx3ter1mPQnIHAD6VUPSDVNgR9RfJ62JTAhEzpLLOQC7ayPQb4pKJtxel/Sfkq5q9Ui8LNVN8DQ3EQJu4efuY0B7koM62xr6VMlso7OSbkr6FUnflPR1ExBZFP+PJH1gAuDUJobQmTbSUUaF7x7NRACgn8SSFkzRX5H0oVY/a78n6X8lHVNyLsvjJiS64Z6kn5jHjSXNKNn/v9TmOfbkcmJRBv9c/0UssM2hD9gC/5mkd03hLyrZ2aZuQiA0NbEg6f8k/ZqSS4BP7LAl/sS0/De1ulNPzTzORJv5iSWtveR4nIcAcMf9NgCuSnouoy4V8tf6dvp5s/e596ddjruu1T3p7pvCf1/JRTrc+xadELABUDSt8qgp0GuSfkPSM0o+m9/q6/1A0r9K+tQ8VsOZg/iJpO8o2e3Xdd/8vn89wTgvAWDH/w1Jb0t6U8mVUipbSNK4y7+3nb/bavI2N/k4cZt0jzts4FspongL97vzNc0N/jexN55tblCQsVOY9TYbc6fXuZX3KPZC4KGzDdrbGk4ALDqL+1rsDPyS2V7rSs7k+64ZFpzS5j4xaCqZ7PuRpF+YoraPFZqQsScCsSEQmr/7H/P77nNv5ikAmk435o6kH5qewGMmWd0ZTnlvXiOlKLa7kcSbLIp2RdLQ1lqp+gaP7y8Ptljs2wm1eAdhGHchUOMdrncrQ8524eP2DOx2ueR0//0A8O+338+b7fh5JYfwhh2Kf8a08POmB7LgFLVMyNhTgi04PYz3JV1IGZ5kMgQIMhpWFE1K7jfLmDZ3jHOcQRhtp1vZrSKIu/jcsgqBuMtFv1EQxBm9v3Gbpen1SBtOT8DvIcgZBhTN9lpxFnus/qiS/fWfUbIPQeQ8h3umx3vRFPaCaQTvOUMA2wOwR/3ZxX4qsWj+bs78rRsecbeLNcshwKJT6HXzAjdzYEOWG8l2AyHuclHEXSy6brXsccbrjDN8z9v1APxeQNoSpzzPtGGD23s4L+k9SSckfc1s13Om+/5zp/gXnB7Aolln6PQE7OMsmXXEzvzEfWd+IpOJwCx6AG4vwO7KWNbmd2vsVZdxuz2CnU5ixV0sxm7OdXRzvVkEz2afT7xBjyD2ij7usA27vYGS0yOwvQB7sE7Z2Z4bzuSjGwLuXIP9tKHirLPkBIC7jkUngHITAKHzIt2DGfyxf9jjYuhG0XerGLJu/Xfr7+KMnst2gr3THMFWt+PIa9AqTgGXnN50w2vBF53uu23J/XXagAmdXkHaMCU3AeD+80Kl79IY7vJGkoe/zfL/sdu9jjw8j3YNWimld+sWbz1lItEfaoReg+ie+sufEM/sMuJBDzaqtIIPc1IQu/V4u4mDtzpvy25Ptqj15+2Lvda7qc5X+wlTGsdYPbp8eMB7Cmy7Z+sGgr3PP7//VlrvsNchTAAA3QmDtPkHelPAHgsEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2gP8HT7fJq7UJgi0AAAAASUVORK5CYII=
// @downloadURL https://update.greasyfork.org/scripts/33158/WME%20PA%20GIS%20Map.user.js
// @updateURL https://update.greasyfork.org/scripts/33158/WME%20PA%20GIS%20Map.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var debugLevel = 0;
    var mapWindow;
    var Extent;
    var SpatialReference;
    var receiverAdded = false;

    function log(message, level) {
        if (message && level <= debugLevel) {
            console.log('PA GIS:', message);
        }
    }

    function onButtonClick() {
        var wazeExt = W.map.getExtent();
        var url = 'http://www.arcgis.com/home/webmap/viewer.html?webmap=8f0eff71cd5d487694ded927009c6d6d&extent=';
        url += wazeExt.left + '%2C' + wazeExt.bottom + '%2C' + wazeExt.right + '%2C' + wazeExt.top + '%2C102113';
        if (!mapWindow || mapWindow.closed) {
            mapWindow = window.open(null, 'wv_gis_map');
            try {
                if (mapWindow.location && mapWindow.location.href) {
                    mapWindow.location.assign(url);
                }
            } catch (ex) {
                if (ex.code === 18) {
                    // Ignore if accessing location.href is blocked by cross-domain.
                } else {
                    throw ex;
                }
            }
        }
        mapWindow.focus();
        syncGISMapExtent(mapWindow);
    }

    function syncGISMapExtent(myMapWindow) {
      if (myMapWindow && !myMapWindow.closed) {
            var wazeExt = W.map.getExtent();
            try {
                myMapWindow.postMessage({type:'setExtent', xmin:wazeExt.left, xmax:wazeExt.right, ymin:wazeExt.bottom, ymax:wazeExt.top, spatialReference: 102113}, 'http://www.arcgis.com');
            } catch (ex) {
                log(ex, 0);
            }
            try {
                myMapWindow.postMessage({type:'setExtent', xmin:wazeExt.left, xmax:wazeExt.right, ymin:wazeExt.bottom, ymax:wazeExt.top, spatialReference: 102113}, 'https://www.arcgis.com');
            } catch (ex) {
                log(ex, 0);
            }
        }
    }

    function init() {
        $('.WazeControlPermalink').prepend(
            $('<div>').css({float:'left',display:'inline-block', padding:'0px 5px 0px 3px'}).append(
                $('<a>',{id:'wv-gis-button',title:'Open the PA GIS map in a new window', href:'javascript:void(0)'})
                .text('PA-GIS')
                .css({float:'left',textDecoration:'none', color:'#000000', fontWeight:'bold'})
                .click(onButtonClick)
            )
        );

        setInterval(function() {
            var $btn = $('#wv-gis-button');
            if ($btn.length > 0) {
                $btn.css('color', (mapWindow && !mapWindow.closed) ? '#1e9d12' : '#000000');
            }
        }, 500);

        /* Event listeners */
        W.map.events.register('moveend',null, function(){syncGISMapExtent(mapWindow);});

        log('Initialized.', 1);
    }

    function receiveMessageGIS(event) {
        log(event, 1);
        var data = event.data;
        if (!Extent) {
            Extent = unsafeWindow.require('esri/geometry/Extent');
            SpatialReference = unsafeWindow.require('esri/SpatialReference');
        }
        switch (data.type) {
            case 'setExtent':
        }
        var map = unsafeWindow.arcgisonline.map.main.map;
        var ext = new Extent({xmin:data.xmin, xmax:data.xmax, ymin:data.ymin, ymax:data.ymax, spatialReference:new SpatialReference({wkid:data.spatialReference})});
        unsafeWindow.arcgisonline.map.main.map.setExtent(ext);
    }

    function receiveMessageWME(event) {
        // TBD
    }

    function bootstrap() {
        if (window.location.host.toLowerCase() === "www.arcgis.com") {
            window.addEventListener("message", receiveMessageGIS, false);
        } else {
            if (!receiverAdded) {
                window.addEventListener("message", receiveMessageWME, false);
                receiverAdded = true;
            }
            if (W && W.loginManager &&
                W.loginManager.events.register &&
                W.map) {
                log('Initializing...', 1);
                init();
            } else {
                log('Bootstrap failed. Trying again...', 1);
                window.setTimeout(function () {
                    bootstrap();
                }, 200);
            }
        }
    }

    log('Bootstrap...', 1);
    bootstrap();
})();