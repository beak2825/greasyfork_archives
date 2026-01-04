// ==UserScript==
// @name         Historico de Passagens de Veiculo - GPSwox
// @namespace    ---
// @version      0.3
// @description  Em plataforma de pastreamento da gpswox, permite desenhar uma linha e saber todas as vezes que o veículo cruzou com ela. Depois de carregar o histórico, clique em dois pontos do mapa enquanto segura a tecla Ctrl.
// @author       Jamison Freitas
// @match        http://144.76.116.234/objects
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/393916/Historico%20de%20Passagens%20de%20Veiculo%20-%20GPSwox.user.js
// @updateURL https://update.greasyfork.org/scripts/393916/Historico%20de%20Passagens%20de%20Veiculo%20-%20GPSwox.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var win = unsafeWindow;
    var orgjms = {};
    win.orgjms = orgjms;
    orgjms.linha = null;
    orgjms.last_click = null;
    orgjms.circles = [];
    orgjms.circ1 = null;
    orgjms.circ2 = null;



    function sleep (time) {
        return new Promise(function (resolve) {setTimeout(resolve, time)});
    }

    unsafeWindow.intersect = function(l1p1, l1p2, l2p1, l2p2){
        // Given three colinear points p, q, r, the function checks if
        // point q lies on line segment 'pr'
        function onSegment(p, q, r)
        {
            if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
                q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y)){
                return true;
            }

            return false;
        }

        // To find orientation of ordered triplet (p, q, r).
        // The function returns following values
        // 0 --> p, q and r are colinear
        // 1 --> Clockwise
        // 2 --> Counterclockwise
        function orientation(p, q, r)
        {
            // See https://www.geeksforgeeks.org/orientation-3-ordered-points/
            // for details of below formula.
            var val = (q.y - p.y) * (r.x - q.x) -
                (q.x - p.x) * (r.y - q.y);

            if (val === 0) return 0; // colinear

            return (val > 0) ? 1: 2; // clock or counterclock wise
        }

        var p1 = {x: l1p1.lng, y: l1p1.lat};
        var q1 = {x: l1p2.lng, y: l1p2.lat};
        var p2 = {x: l2p1.lng, y: l2p1.lat};
        var q2 = {x: l2p2.lng, y: l2p2.lat};


        // Find the four orientations needed for general and
        // special cases
        var o1 = orientation(p1, q1, p2);
        var o2 = orientation(p1, q1, q2);
        var o3 = orientation(p2, q2, p1);
        var o4 = orientation(p2, q2, q1);

        // General case
        if (o1 != o2 && o3 != o4){
            return true;
        }

        // Special Cases
        // p1, q1 and p2 are colinear and p2 lies on segment p1q1
        if (o1 === 0 && onSegment(p1, p2, q1)) {return true;}

        // p1, q1 and q2 are colinear and q2 lies on segment p1q1
        if (o2 === 0 && onSegment(p1, q2, q1)) {return true;}

        // p2, q2 and p1 are colinear and p1 lies on segment p2q2
        if (o3 === 0 && onSegment(p2, p1, q2)) {return true;}

        // p2, q2 and q1 are colinear and q1 lies on segment p2q2
        if (o4 === 0 && onSegment(p2, q1, q2)) {return true;}

        return false; // Doesn't fall in any of the above cases
    }

    unsafeWindow.point_of_intersect = function(l1p1, l1p2, l2p1, l2p2) {
        var k = {x: l1p1.lng, y: l1p1.lat};
        var l = {x: l1p2.lng, y: l1p2.lat};
        var m = {x: l2p1.lng, y: l2p1.lat};
        var n = {x: l2p2.lng, y: l2p2.lat};

        var det = (n.x - m.x) * (l.y - k.y) - (n.y - m.y) * (l.x - k.x);

        if (det === 0){
            return null ;
        }// não há intersecção

        var s = ((n.x - m.x) * (m.y - k.y) - (n.y - m.y) * (m.x - k.x))/ det ;

        var Pi = {x: k.x + (l.x-k.x)*s,
              y: k.y + (l.y-k.y)*s};

        return {lat: Pi.y,
                lng: Pi.x}; // há intersecção

    }



    unsafeWindow.find_intersections = function(inicio, fim) {
	if (typeof unsafeWindow === "undefined") {unsafeWindow = window}
        orgjms.circles = [];
		var last_point = null;

        unsafeWindow.history_cords = unsafeWindow.history_items.filter(it => it.positions != null).map(it => it.positions).flat();
        unsafeWindow.history_cords.forEach(function(this_cord, this_idx) {

            var next_cord = unsafeWindow.history_cords[this_idx+1];

            if (typeof next_cord !== "undefined"){
                var hist_inicio = {lat: this_cord.lat, lng: this_cord.lng};
                var hist_fim = {lat: next_cord.lat, lng: next_cord.lng};
                var inter = unsafeWindow.intersect(inicio, fim, hist_inicio, hist_fim);
                if (inter) {
                    var intersect_point = unsafeWindow.point_of_intersect(inicio, fim, hist_inicio, hist_fim);
                    if (null !== intersect_point) {
                        orgjms.circles.push({history: this_cord,
                                             rotation: 180 - unsafeWindow.L.LineUtil.PolylineDecorator.computeAngle({x: hist_inicio.lng, y: hist_inicio.lat}, {x: hist_fim.lng, y: hist_fim.lat})});
						last_point = intersect_point;
                    }
                }
            }
        });
		if (null !== last_point) {
			var horarios = "";
            for (var i = 0; i < orgjms.circles.length; i++) {
                var svg = '<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><g>'
                +'<rect fill="none" id="canvas_background" height="26" width="26" y="-1" x="-1"/></g>'
                +'<g><title>Layer 1</title>'
                +'<path id="svg_5" d="m1.71225,8.89974" opacity="0.5" fill-opacity="null" stroke-opacity="null" stroke-width="0.0" stroke="#000" fill="none"/>'
                +'<path transform="rotate(' + orgjms.circles[i].rotation + ' 12,12) " id="svg_6" d="m6.29098,20.78136l5.70902,-17.56271l5.70902,17.56271l-11.41804,0z" stroke-width="1.5" fill="#ff5656"/>'
                +'</g></svg>';
                horarios = horarios + '<div style="display: inline-flex; width: max-content;">' +
                    svg + '<div style="display: inline-block; vertical-align: top;">' + (i+1) + ':  ' + orgjms.circles[i].history.t + '</div></div><br/>';
            }
            var popup = unsafeWindow.L.popup()
                .setLatLng(last_point)
                .setContent('<div style="padding: 10px">'+horarios+'</div>');
                //.openOn(unsafeWindow.app.map);
            orgjms.linha.bindPopup(popup).openPopup();
        }
    }

    unsafeWindow.draw_line = function(actual_point) {
        if (null !== orgjms.last_click) {
            orgjms.circ2.setLatLng([actual_point.lat, actual_point.lng]).addTo(unsafeWindow.app.map);

            orgjms.linha.setLatLngs([[orgjms.last_click.lat, orgjms.last_click.lng],
                                    [actual_point.lat, actual_point.lng]]);

            unsafeWindow.find_intersections(orgjms.last_click, actual_point);

            orgjms.last_click = null;
            return;
        } else {
            orgjms.linha.setLatLngs([]);
            orgjms.circ1.remove();
            orgjms.circ2.remove();

            orgjms.circ1.setLatLng([actual_point.lat, actual_point.lng]).addTo(unsafeWindow.app.map);
            orgjms.last_click = {lat: actual_point.lat, lng: actual_point.lng};
        }

    }

    var onMapClick = function (e) {
            if (!e.originalEvent.ctrlKey) {return;}
            unsafeWindow.draw_line(e.latlng);
        }

    function configure(){
        orgjms.linha = unsafeWindow.L.polyline([], {color: 'red'}).addTo(unsafeWindow.app.map);
        orgjms.circ1 = unsafeWindow.L.circle([0,0], {radius: 2});
        orgjms.circ2 = unsafeWindow.L.circle([0,0], {radius: 2});
        unsafeWindow.app.map.on('click', onMapClick);
    }


    function mapOk() {
        if (null !== unsafeWindow.app.map) {
            configure();
        } else {
            sleep(1000).then(function () {
                mapOk()
            });
        }
    }

    mapOk();
})();