// ==UserScript==
// @name         Wegstatus Polyline Selector
// @namespace    https://wegstatus.nl
// @version      2020.06.08.02
// @description  Adds a link in the segment-panel to grab the polyline.
// @author       Xander "Xanland" Hoogland & Sjors "GigaaG" Luyckx
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor([^\/]?.*)?$/
// @require     https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js

// @downloadURL https://update.greasyfork.org/scripts/404251/Wegstatus%20Polyline%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/404251/Wegstatus%20Polyline%20Selector.meta.js
// ==/UserScript==

(function () {
    const copyText = 'Click to copy';
    $('head').append('<style type="text/css">#grab-polyline { background-image: url(https://www.wegstatus.nl/favicon-16x16.png); background-repeat: no-repeat; background-size: 20px 20px; background-position-x: 32%; background-position-y: 40%;}</style>');
    //$('head').append('<style type="text/css">#reverse-segment { background-image: url(https://www.wegstatus.nl/favicon-16x16.png); background-repeat: no-repeat; background-size: 20px 20px; background-position-x: 32%; background-position-y: 40%;}</style>');

    function bootstrap(tries = 1) {
        if (W && W.map &&
            W.model && W.loginManager.user &&
            $ ) {
            init();
        } else if (tries < 1000)
            setTimeout(function () {bootstrap(tries++);}, 200);
    }

    function init(){
        var targetNode = document.querySelector("#edit-panel");
        // Options for the observer (which mutations to observe)
        var config = {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true
        };
        // Callback function to execute when mutations are observed
        var callback = function(mutationsList, observer) {
            const selectedItemsCount = W.selectionManager.getSelectedFeatures().length
            const streetName = document.getElementsByClassName('full-address')[0].innerText
            if (selectedItemsCount >= 1) {
                if ($("#grab-polyline").length == 0){
                    // Easy hack to show the button in F(ix)U(I)
                    const $fuButtons = $('#edit-panel .more-actions');
                    if ($fuButtons.css('display') == 'inline-flex') {
                        $fuButtons.css('display', 'initial');
                        $('head').append('<style type="text/css">#grab-polyline { background-position-x: 10%; }</style>');
                        $('head').append('<style type="text/css">#reverse-segment { background-position-x 10%; </style>');
                    }
                    $('#segment-edit-general > div.form-group.more-actions').append('<div class="edit-house-numbers-btn-wrapper"><button class="action-button waze-btn waze-btn-white" id="grab-polyline" title="' + copyText + '"><span style="margin-left: 15px">Grab polyline</span></button><textarea id="grab-polyline-textarea" style="display:none"></textarea></div>');
                    $('#segment-edit-general > div.form-group.more-actions').append('<div class="edit-house-numbers-btn-wrapper"><button class="action-button waze-btn waze-btn-white" id="reverse-segment" title="🔄 Reverse segment"><span style="margin-left: 15px">🔄 Reverse segment</span></button><textarea id="reverse-segment-textarea" style="display:none"></textarea></div>');

                    $('#grab-polyline').tooltip({ trigger: 'hover' });
                    $('#reverse-segment').tooltip({ trigger: 'hover' });
                    addClickHanderForGrabPolylineButton();

                }
            } else {
                $('#grab-polyline').parent().remove();
            }

            if (selectedItemsCount > 1){
                $('#reverse-segment').parent().remove();
            }

            //if (streetName.includes("No common street")){
            //    $('#grab-polyline').parent().remove();
            //}
        };

        // Create an observer instance linked to the callback function
        var observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);
    }

    function reverseArr(input) {
        var ret = new Array;
        for(var i = input.length-1; i >= 0; i--) {
            ret.push(input[i]);
        }
        return ret;
    }

    function addClickHanderForGrabPolylineButton() {
        $('#grab-polyline').click(function () {
            var features = W.selectionManager.getSegmentSelection().segments
            var countSegments = features.length
            var polyline = '';
            var fromNode = '';
            var toNode = '';

            for (var i = 0; i < countSegments; i++){
                var component = features[i].geometry.components

                if (i === 0){
                    if (features[i].attributes.fwdDirection == false && features[i].attributes.revDirection == true){
                        component = reverseArr(component);
                        fromNode = features[i].attributes.toNodeID;
                    } else {
                        fromNode = features[i].attributes.fromNodeID;
                    }
                } else {
                    fromNode = features[i].attributes.fromNodeID;
                }

                if (toNode != '' && fromNode != toNode){
                    component = reverseArr(component);
                    toNode = features[i].attributes.fromNodeID;
                } else {
                    toNode = features[i].attributes.toNodeID;
                }

                var points = component.length;
                for (var p = 0 ; p < points ; p++){
                    var coordinates = component[p].clone().transform(W.map.getProjectionObject(), 'EPSG:4326');
                    var x = coordinates.x
                    var y = coordinates.y
                    var latlon = ''+ y +' '+ x +' ';
                    polyline += latlon
                }

            }

            $('#grab-polyline-textarea').val(polyline.trim());
            const copyText = document.querySelector("#grab-polyline-textarea");
            $('#grab-polyline-textarea').show();
            copyText.select();
            document.execCommand("copy");
            $('#grab-polyline-textarea').hide();
            $('#grab-polyline').next(".tooltip").find(".tooltip-inner").text('Polyline copied!');
            setTimeout(function () {
                $('#grab-polyline').next(".tooltip").find(".tooltip-inner").text('Click to copy');
            }, 3000);
        });

        $('#reverse-segment').click(function () {
            W.selectionManager.getSegmentSelection().segments[0].geometry.components.reverse()
            $('#reverse-segment').next(".tooltip").find(".tooltip-inner").text('Segment reversed!');
            setTimeout(function () {
                $('#reverse-segment').next(".tooltip").find(".tooltip-inner").text('Click to reverse.');
            }, 3000);
        });
    }

    bootstrap();
})();