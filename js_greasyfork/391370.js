// ==UserScript==
// @name         Replay2Map
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  generate a unpublished jstris map from given replay, only works on classic 4-block tetromino
// @author       Eddy
// @match        https://*.jstris.jezevec10.com/replay/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391370/Replay2Map.user.js
// @updateURL https://update.greasyfork.org/scripts/391370/Replay2Map.meta.js
// ==/UserScript==

(function() {
    // copy from /js/maps.js
    function exportMap(matrix) { var buf = new ArrayBuffer(100); var arr = new Uint8Array(buf); var brick=0; for(var y=0;y<20;y++){for(var x=0;x<10;x++){var even = ((brick % 2) === 0);var i=Math.floor(brick/2);if(even)arr[i]=0;arr[i] |= (matrix[y][x] & 15) << ((even) ? 4 : 0);brick++;}}return _simpleArrayBufferToBase64(buf);}
    function _simpleArrayBufferToBase64( buffer ) {var binary = '';var bytes = new Uint8Array( buffer );var len = bytes.byteLength;for (var i = 0; i < len; i++) {binary += String.fromCharCode( bytes[ i ] );}return window.btoa( binary );}

    // raw id to block mapping, not sure if it is stable
    var mapping = {1:'Z',2:'L',3:'O',4:'S',5:'I',6:'J',7:'T'};
    var holdpiece = null;
    var lasthold = null;
    var pieces = [];

    // Hook View to get needed information
    // get matrix from redraw
    var matrix = null;
    View.prototype._redraw = View.prototype.redraw;
    View.prototype.redraw = function() {
        this._redraw();
        matrix = this.g.matrix;
    };

    // drawBlockOnCanvas called on individual blocks
    var Q = true; // true if queue is fresh
    var H = 4; // set to 3 when hold is updated, ignore first hold(4 blocks)
    var lastOp = 0;
    $('#blocks').on('DOMSubtreeModified', function(){Q=true;});
    View.prototype.drawBlockOnCanvas_ = View.prototype.drawBlockOnCanvas;
    View.prototype.drawBlockOnCanvas = function(t,e,i,s){
        if (s == 1) { // HOLD
            if (H-- === 0) {
                lastOp = 2;
                lasthold = holdpiece;
                holdpiece = mapping[i];
                H = 3;
            }
        } else {
            if (Q){
                if(lastOp)lastOp--;
                pieces.push(mapping[i]);
                Q = false;
            }
        }
        this.drawBlockOnCanvas_(t,e,i,s);
    }

    var favLink = $('#favLink');
    var genMap = $('<button id="genMap" class="btn btn-xs btn-primary" style="color:white;margin-left:4px;">');
    genMap.text('Generate map')
    genMap.click(async function(){
        if (matrix === null) {
            alert('start the replay first!');
            return;
        }
        // matrix should be captured from the hook
        var mapData= exportMap(matrix);
        console.log('mapData:', mapData);

        // push the last few block already seen but not placed yet (include hold)
        var queue = [];
        if (holdpiece) queue.push(holdpiece);
        if (pieces.length >= 2) {
            if (lastOp) {
                if(lasthold) queue.push(lasthold);
            } else {
                queue.push(pieces[pieces.length-2]);
            }
        }
        if (pieces.length >= 1) {
            queue.push(pieces[pieces.length-1]);
        }

        // clear existing queue and fast forward til the end
        pieces.length=0;
        var nextbtn = $('#next');
        var clock = $('#clock');
        var clockval = -1;
        while(clockval != clock.text()) {
            clockval = clock.text();
            await nextbtn.trigger('click').promise();
        }
        queue = queue.concat(pieces);
        console.log(queue.join(''));

        // create a invisible iframe to POST the result
        var createMapPage = $('<iframe src="/maps/create" style="display:none">');
        var trigger_once = true;
        createMapPage.on('load',function(){
            if(!trigger_once) return;
            trigger_once = false;
            var page = createMapPage.contents().find('body');
            page.find('#inputTitle').val('testmap');
            page.find('#desc').val('testmap desc');
            page.find('#mapData').val(mapData);
            page.find('#queueEdit').val(queue.join(''));
            page.find('input[name=sequence][value="1"]').attr('checked',true);
            page.find('input[name=finish][value="1"]').attr('checked',true); // change value to 0 if you don't want perfect clear finish by default
            page.find('.form-horizontal').submit();
        });
        createMapPage.insertAfter($('#app'));
    });
    genMap.insertAfter(favLink);
})();

