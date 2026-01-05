// ==UserScript==
// @name         Map Updator
// @namespace    api.micetigri.fr
// @version      1.9
// @description  Update Map
// @author       Billysmille
// @match        http://api.micetigri.fr/maps
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27696/Map%20Updator.user.js
// @updateURL https://update.greasyfork.org/scripts/27696/Map%20Updator.meta.js
// ==/UserScript==

(function () {
    function updateAll(list) {
        var lsmap = list.match(/@\d+/g);
        if (lsmap) {
            var i = 0;
            var loop = function () {
                if (i < lsmap.length) {
                    var xmlhttp = new XMLHttpRequest();
                    xmlhttp.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                            var parser = new DOMParser();
                            var xmlDoc = parser.parseFromString(this.responseText, 'text/html');
                            io.connect('http://node.micetigri.fr:443/').emit('map', {
                                map: xmlDoc.getElementById('mapUpdator').getAttribute('map'),
                                id: xmlDoc.getElementById('mapUpdator').getAttribute('session')
                            });
                            window.setTimeout(loop, 10000);
                        }
                    };
                    xmlhttp.open('GET', 'http://api.micetigri.fr/maps/' + lsmap[i], true);
                    xmlhttp.send();
                }
                else {
                    $('.panel-title').html('<strong>Updates</strong>');
                    $('.panel-heading').next('.panel-body').html(lsmap.length + ' maps updated');
                    $('#update-button').button('reset');
                    return;
                }
                i++;
                $('.panel-heading').next('.panel-body').html(i + ' of ' + lsmap.length + ' maps');
            };
            $('.panel-title').html('<strong>Updating...</strong>');
            $('#update-button').button('loading');
            loop();
        }
    }
    $('title').html('Map Updator');
    $('.panel-title').html('<strong>Updates</strong>');
    $('.panel-heading').next('.panel-body').html('-');
    $('#flashMovie').parents('.panel-body').html('<textarea class="form-control" id="map-list" rows="5"></textarea>');
    $('#MapViewer').parents('.panel-body').html('<textarea class="form-control" id="map-list" rows="5"></textarea>');
    $('#mapUpdator').parents('.panel-body').html('<button type="submit" class="btn btn-default" id="update-button" data-loading-text="Update All...">Update All</button>');
    $('#copy_this_text').parents('.row').remove();
    $('#update-button').click(function (event) {
        event.preventDefault();
        updateAll($('#map-list').val());
    });
})();