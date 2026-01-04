// ==UserScript==
// @name         Tag Hiding
// @version      1.08
// @description  Hides Tags/Namespaces via regex
// @author       Hauffen
// @include      /https?:\/\/(e-|ex)hentai\.org\/.*/
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @namespace https://greasyfork.org/users/285675
// @downloadURL https://update.greasyfork.org/scripts/426674/Tag%20Hiding.user.js
// @updateURL https://update.greasyfork.org/scripts/426674/Tag%20Hiding.meta.js
// ==/UserScript==

(function() {
    let $ = window.jQuery, index = 0;
    let elements, data;
    if ($('.gl1e').length) {
        elements = $('.itg > tbody > tr');
        data = $('td[class^="gl1"] > div > a');
    } else if ($('.gl1c').length) {
        elements = $('.gltc tr').first().nextAll();
        data = $('.glname > a');
    } else if ($('.gl1t').length) {
        elements = $('.gl1t');
        data = $('.gl1t > a');
    } else {
        elements = $('.gltm tr').first().nextAll();
        data = $('.glname > a');
    }
    hide();

    function hide() {
        var reqList = [];
        for (var i = 0; i + index < data.length; i++) {
            if (data[i + index] == undefined) continue;
            var str = data[i + index].href.split('/');
            reqList[i] = [str[4], str[5]];
        }
        while (reqList.length > 25) reqList.pop();
        var request = {"method": "gdata", "gidlist": reqList, "namespace": 1};

        var req = new XMLHttpRequest();
        req.onreadystatechange = e => {
            if (req.readyState == 4) {
                if (req.status == 200) {
                    var apirsp = JSON.parse(req.responseText);
                    for (var i = 0; i < apirsp.gmetadata.length; i++) {
                        if (apirsp.gmetadata[i].tags.some(tag => /^parody:/.test(tag))) { // Edit the /^parody:/ to whatever you want
                            $(elements[i + index]).css({display: 'none'});
                        }
                    }
                    index += 25;
                    if (data.length > 25 && index < data.length) hide();
                } else {
                    console.error();
                }
            }
        }
        req.open("POST", document.location.origin + "/api.php", true);
        req.send(JSON.stringify(request));
    }
})();