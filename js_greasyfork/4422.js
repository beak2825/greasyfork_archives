// ==UserScript==
// @name         WME Permalink to maps czech
// @description Skript umoznujici kontrolu WME v dalsich mapach.
// @namespace	https://greasyfork.org/users/4640-petr-nedv%C4%9Bd
// @version     1.0.1
// @include     https://www.waze.com/editor/*
// @include     https://www.waze.com/*/editor/*
// @include     https://editor-beta.waze.com/*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/4422/WME%20Permalink%20to%20maps%20czech.user.js
// @updateURL https://update.greasyfork.org/scripts/4422/WME%20Permalink%20to%20maps%20czech.meta.js
// ==/UserScript==

// Na vývoji skriptu se podíleli: bebebrumik, mylan, pvo11, Janek250, d2-mac - ten do toho hlavne kecal
if ('undefined' == typeof __RTLM_PAGE_SCOPE_RUN__) {
  (function page_scope_runner() {
    // If we're _not_ already running in the page, grab the full source
    // of this script.
    var my_src = "(" + page_scope_runner.caller.toString() + ")();";

    // Create a script node holding this script, plus a marker that lets us
    // know we are running in the page scope (not the Greasemonkey sandbox).
    // Note that we are intentionally *not* scope-wrapping here.
    var script = document.createElement('script');
    script.setAttribute("type", "text/javascript");
    script.textContent = "var __RTLM_PAGE_SCOPE_RUN__ = true;\n" + my_src;

    // Insert the script node into the page, so it will run, and immediately
    // remove it to clean up.  Use setTimeout to force execution "outside" of
    // the user script scope completely.
    setTimeout(function() {
          document.body.appendChild(script);
          document.body.removeChild(script);
        }, 0);
  })();

  // Stop running, because we know Greasemonkey actually runs us in
  // an anonymous wrapper.
  return;
}


// Funkce na výpočet LAT + LON
function getQueryString(link, name) {var pos = link.indexOf( name + '=' ) + name.length + 1; var len = link.substr(pos).indexOf('&'); if (-1 == len) len = link.substr(pos).length; return link.substr(pos,len);}
function sqr(x) {return x*x;}
function convert(t,a){var h=Math.PI/180,M=6378137,s=298.257223563,r=-570.69,n=-85.69,q=-462.84,o=4.99821/3600*Math.PI/180,i=1.58676/3600*Math.PI/180,c=5.2611/3600*Math.PI/180,e=-3543e-9,v=a*h,x=t*h,I=200,P=1-sqr(1-1/s),g=M/Math.sqrt(1-P*sqr(Math.sin(v))),l=(g+I)*Math.cos(v)*Math.cos(x),p=(g+I)*Math.cos(v)*Math.sin(x),d=((1-P)*g+I)*Math.sin(v),u=r+(1+e)*(l+c*p-i*d),F=n+(1+e)*(-c*l+p+o*d),f=q+(1+e)*(i*l-o*p+d);M=6377397.15508,s=299.152812853;var y=s/(s-1),b=Math.sqrt(sqr(u)+sqr(F));P=1-sqr(1-1/s);var j=Math.atan(f*y/b),k=Math.sin(j),m=Math.cos(j),w=(f+P*y*M*k*k*k)/(b-P*M*m*m*m);v=Math.atan(w),I=Math.sqrt(1+w*w)*(b-M/Math.sqrt(1+(1-P)*w*w)),x=2*Math.atan(F/(b+u)),M=6377397.15508;var z=.081696831215303,A=.97992470462083,B=12310230.12797036,C=.863499969506341,D=.504348889819882,E=.420215144586493,G=.907424504992097,H=1.000597498371542,J=1.00685001861538,K=Math.sin(v);w=(1-z*K)/(1+z*K),w=sqr(1+K)/(1-sqr(K))*Math.exp(z*Math.log(w)),w=J*Math.exp(H*Math.log(w));var L=(w-1)/(w+1),N=Math.sqrt(1-L*L),O=H*x,Q=Math.sin(O),R=Math.cos(O),S=G*R+E*Q,T=E*R-G*Q,U=C*L+D*N*S,V=Math.sqrt(1-U*U),W=T*N/V,X=Math.sqrt(1-W*W),Y=A*Math.atan(W/X);g=B*Math.exp(-A*Math.log((1+U)/V));var Z=g*Math.sin(Y),$=g*Math.cos(Y);return{x:Z.toFixed(),y:$.toFixed()}}
// jQuery Drag&Drop extention - .drags()
$.fn.dragss=function(e){if(e=$.extend({handle:"",cursor:"move"},e),""===e.handle)var a=this;else var a=this.find(e.handle);return a.css("cursor",e.cursor).on("mousedown",function(a){if(""===e.handle)var s=$(this).addClass("draggablee");else var s=$(this).addClass("active-handle").parent().addClass("draggablee");var t=s.css("z-index"),o=s.outerHeight(),n=s.outerWidth(),l=s.offset().top+o-a.pageY,r=s.offset().left+n-a.pageX;s.css("z-index",1e3).parents().on("mousemove",function(e){$(".draggablee").offset({top:e.pageY+l-o,left:e.pageX+r-n}).on("mouseup",function(){$(this).removeClass("draggablee").css("z-index",t)})}),a.preventDefault()}).on("mouseup",function(){localStorage.setItem("fpanelX",$(this).offset().left),localStorage.setItem("fpanelY",$(this).offset().top),""===e.handle?$(this).removeClass("draggablee"):$(this).removeClass("active-handle").parent().removeClass("draggablee")})};


//
// --- Funkce open_map() ---
//
window.open_map = function(event, server) {

    var href = $('.WazeControlPermalink a').attr('href');
    var lon = getQueryString(href, 'lon');
    var lat = getQueryString(href, 'lat');
    var zoom = parseInt(getQueryString(href, 'zoom'));


    // Google maps
	if (server == 'google') {
		zoom = zoom > 6 ? 19 : zoom + 12;
        var mapsUrl = 'https://maps.google.com/?ll=' + lat + ',' + lon + '&z=' + zoom;
	}
    // Mapy.cz
    else if (server == 'seznam') {
        if(event.ctrlKey) {
		zoom = zoom > 6 ? 19 : zoom + 12;
		var mapsUrl = 'http://www.mapy.cz/zakladni?x='+lon+'&y='+lat+'&z='+zoom+'&l=0&pano=1&base=ophoto';
        }
        else {
		zoom = zoom > 6 ? 19 : zoom + 12;
        var mapsUrl = 'http://mapy.cz/zakladni?x=' + lon + '&y=' + lat + '&z=' + zoom + '&l=0';
	}
    }
    // Open Street Map
    else if (server == 'osm') {
		zoom = zoom > 6 ? 19 : zoom + 12;
        var mapsUrl = 'http://www.openstreetmap.org/#map=' + zoom + '/' + lat + '/' + lon;
	}
    // JSDI
    else if (server == 'jsdi') {
		var mapsUrl = "http://geoportal.jsdi.cz/flexviewers/Silnicni_a_dalnicni_sit_CR/";
	}
    // CUZK
    else if (server == 'cuzk') {

        var p3 = convert(lon, lat);
        var z = 1;
        
        if(zoom == 8) { z = 1;}
        if(zoom == 7) { z = 2;}
        if(zoom == 6) { z = 3;}
        if(zoom == 5) { z = 6;}
        if(zoom == 4) { z = 12;}
        if(zoom == 3) { z = 24;}
        if(zoom == 2) { z = 48;}
        if(zoom == 1) { z = 96;}
        if(zoom == 0) { z = 192;}
        
        var p3a = 95 * z;
        var p3b = -58 * z;
        var p4a = -85 * z;
        var p4b = 50 * z;
        var p4x = (p3.x - p3a);
        var p4y = (p3.y - p3b);
        var p5x = (p3.x - p4a);
        var p5y = (p3.y - p4b);
        
        if(event.ctrlKey) {
            var mapsUrl = "http://geoportal.cuzk.cz/geoprohlizec/default.aspx?wmcid=490&srs=EPSG:5514&bbox="; //změna 702 na 490
        }
        else {
            var mapsUrl = "http://geoportal.cuzk.cz/geoprohlizec/default.aspx?wmcid=692&srs=EPSG:5514&bbox=";
	      }
        mapsUrl += "-" + p4x + ",-" + p4y + ",-" + p5x + ",-" + p5y + "&lng=CZ";
  }

    // Dopravni Info
		else if (server == 'dopravniinfo') {
			var epsg900913 = new OpenLayers.Projection('EPSG:900913');
			var epsg4326   = new OpenLayers.Projection('EPSG:4326');
			var e = Waze.map.getExtent();
			var p1 = new OpenLayers.Geometry.Point(e.left, e.bottom).transform(epsg900913, epsg4326);
			var p2 = new OpenLayers.Geometry.Point(e.right, e.top).transform(epsg900913, epsg4326);
			var p3 = convert(p1.x, p1.y);
			var p4 = convert(p2.x, p2.y);
			var mapsUrl = 'http://www.dopravniinfo.cz/default.aspx?l=TI,TIU,TL,Kamery&r=%3B%3B&rp=F%2CO%2CN&lang=cz';
            mapsUrl += '&e=-' + p3.x +  ',-' + p4.x + ',-' + p4.y + ',-' + p3.y;
		}
    
    // Uzavirky
    else if (server == 'closures') {
		if(event.ctrlKey) {
            var mapsUrl = "http://goo.gl/FjLFPr";
        }
        else {
            var mapsUrl = "http://goo.gl/J34DwA";
        }
	}
    // Waze uzivatele
    else if (server == 'waze_users') {
		if(event.ctrlKey) {
            var mapsUrl = "https://goo.gl/NHc2Ah";
        }
        else {
            var mapsUrl = "https://goo.gl/rQcDMS";
        }
	}
    // CZ test nazvu obci
    else if (server == 'obce') {
		var mapsUrl = "https://goo.gl/bWKSvN";
	}
    // Waze editor
    else if (server == 'waze_editor') {
		if(event.ctrlKey) {
            var mapsUrl = 'https://www.waze.com/cs/editor/?env=row&lon=' + lon + '&lat=' + lat + '&zoom=' + zoom;
            window.open(mapsUrl,'_blank');
        }
    
        else {
            var mapsUrl = 'https://www.waze.com/cs/editor/?env=row&lon=' + lon + '&lat=' + lat + '&zoom=' + zoom;
            window.open(mapsUrl,'_self');
        }
        return false;
	}
    else {
        return false;
    }
    
    window.open(mapsUrl,'_blank');

};
    

$(function() {


    if (localStorage.fpanelX && localStorage.fpanelY) {
        var fpanel_x = localStorage.fpanelX;
        var fpanel_y = localStorage.fpanelY;
    }
    
    // Pouziti odkazu v liste
    var btns = '<style>#fpanel {position:absolute;top:' + fpanel_y + 'px;left:' + fpanel_x + 'px;z-index:100;background:transparent;border:0px solid #111;border-radius:5px;height:25px;width:300px;} #fpanel .btn {background-color:transparent;border:1;border-color:#5B8BA0;border-radius:5px;height:25px;width:25px;font-size:10px;text-align:center;padding:0px 0px;}</style>'; // styly pro tlačítka
    btns += '<button class="btn" onclick="open_map(event, \'google\')"title="Google mapy"><img src="http://i59.tinypic.com/30rldgm.png" width="25"></button>'; // Google maps
    btns += '<button class="btn" onclick="open_map(event, \'seznam\')"title="Ctrl+klik pro ortofoto"><img src="http://i62.tinypic.com/9kx8hu.png" width="25"></button>'; // Mapy.cz
    btns += '<button class="btn" onclick="open_map(event, \'osm\')"title="OSM"><img src="http://i57.tinypic.com/b805s7.png" width="25"></button>'; // Open Street Map
    btns += '<button class="btn" onclick="open_map(event, \'jsdi\')" title="JSDI"><img src="http://i59.tinypic.com/ftemw0.png" width="25"></button>'; // JSDI
    btns += '<button class="btn" onclick="open_map(event, \'cuzk\')" title="ČÚZK"><img src="http://i62.tinypic.com/169s1fq.png" width="25"></button>'; // CUZK
    btns += '<button class="btn" onclick="open_map(event, \'dopravniinfo\')" title="Dopravní info"><img src="http://i62.tinypic.com/262o9qf.png" width="25"></button>'; // Dopravni Info
    btns += '<button class="btn" onclick="open_map(event, \'closures\')" title="Ctrl+klik pro výsledky"><img src="http://i57.tinypic.com/59vg3a.png" width="25"></button>'; // Uzavirky
    btns += '<button class="btn" onclick="open_map(event, \'waze_users\')" title="Ctrl+klik pro výsledky"><img src="http://i59.tinypic.com/3462whw.jpg" width="25"></button>'; // Waze uzivatele
    btns += '<button class="btn" onclick="open_map(event, \'obce\')" title="Kontrola názvů obcí"><img src="http://i62.tinypic.com/nmgp79.png" width="25"></button>'; // CZ test nazvu obci
    btns += '<button class="btn" onclick="open_map(event, \'waze_editor\')" title="Ctrl+klik pro nový panel"><img src="http://i58.tinypic.com/e01q2h.png" width="25"></button>'; // Waze Editor
    btns += '<button class="btn" style="background-color:transparent;border:0;height:25px;width:17px;font-size:10px;text-align:center;padding: 0 0 0 0px;cursor:move;" title="Přesun lišty"><img src="http://i57.tinypic.com/id7z89.png" width="17" height="25"></button>'; // Drag handle

    $('body').append('<div id="fpanel">' + btns + '</div>');
    $('#fpanel').dragss();

});