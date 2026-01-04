// ==UserScript==
// @name           Replace Movie link in Oksusu
// @namespace      
// @description    replace Movie link in Oksusu
// @include        
// @copyright      2017 by Mio
// @license        (CC) Attribution Non-Commercial Share Alike; http://creativecommons.org/licenses/by-nc-sa/2.0/kr/
// @version        0.524
// @injectframes   1
// @downloadURL https://update.greasyfork.org/scripts/36843/Replace%20Movie%20link%20in%20Oksusu.user.js
// @updateURL https://update.greasyfork.org/scripts/36843/Replace%20Movie%20link%20in%20Oksusu.meta.js
// ==/UserScript==

(function () {

    function ChangeTag(url) {
        // Change Image Link To Image
        for (var i = 0; i < document.links.length; ++i) {
            var link = document.links[i].getAttribute("onclick");
            if (link !== null) {
                link = link.replace(/^move\([^\/]+(\/[\/vA-Z0-9{}-]+).+?$/, "$1");
                document.links[i].href = link;
            }
        }
    }

    function ExtractOksusu(url) {
        if (typeof (jQuery) == 'undefined') {
            var jquery = document.createElement('script');
            jquery.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js';
            document.body.appendChild(jquery);
            setTimeout(start, 100);
            return;
        }

        var guid = /www.oksusu.com\/v\/(%7B.+?%7D)/.exec(url);
        var retn = Array();

        if (guid !== null) {
            $.ajax({
                type: "GET",
                url: "https://www.oksusu.com/api/media/playerInfo/" + guid[1],
                async: false,
                beforeSend: function (req) {
                    req.setRequestHeader("Accept", "application/json;pk=BCpkADawqM0Qgi1Lyhu6LfeJBPvmTwFcaGzYmyWwFQbhFdMO6LjapqX5wzTdeh-OycyStCwGRKhFuU1DJUbbhfxuvsvhhYApT3qWD63Rkk0bNSsObnqNA7PAO_9u464CcTh5Cz-EfnzFuhqfi4CPherGBzPT5jJHUAneOVTnI2zMXd3cmwa1OPXfHHlfK6Oknj08lnol_8DrysSH");
                },
                success: function (xml) {
                    var playerXml = xml;
                    retn[0] = playerXml.playerInfo.content.title;
                    var urls = playerXml.playerInfo.streamUrl;
                    retn[1] = urls.urlFHD;
                    if (retn[1] === null)
                        retn[1] = urls.urlHD;
                    if (retn[1] === null)
                        retn[1] = urls.urlSD;
                    if (retn[1] === null)
                        retn[1] = urls.urlLD;
/*
                    if (retn[1] === null)
                        retn[1] = urls.hlsUrlPhoneFixSD;
                    if (retn[1] === null)
                        retn[1] = urls.hlsUrlPhoneLD;
*/
                    //		console.log(retn);
                },
                error: function (xhr, status, error) {
                    retn[1] = "error";
                }
            });

            if (retn[1] !== null && retn[1] !== undefined) {
                $.ajax({
                    type: "GET",
                    url: retn[1],
                    async: false,
                    success: function (xml) {
                        var domain = retn[1].replace(/^(https?:\/\/.+\/)([^\/]+?)$/, "$1");
                        var pattern = /^.+?,BANDWIDTH=(\d+?)(,.+?)*$\n^([^#].+?)$/gm;
                        var matchArray;
                        var maxBandwidth = 0;

                        while ((matchArray = pattern.exec(xml)) !== null) {
                            var bandwidth = Number(matchArray[1]);
                            if (maxBandwidth < bandwidth) {
                                maxBandwidth = bandwidth;
                                retn[2] = domain + matchArray[3];
                            }
                        }
                        //                    console.log(retn);
                    },
                    error: function (xhr, status, error) {
                        retn[1] = "error";
                    }
                });
            }

        }
        ShowResult(retn, "");
    }

    function ShowResult(results, color) {
        var title = "";
        var masterLink = "";
        var realLink = "";
        if (color === "")
            color = "white";
        if (results.length === 0) {
            title = "Parse error...";
            masterLink = "Not found...";
        } else {
            title = results[0];
            masterLink = results[1];
            realLink = results[2];
        }

        var trends_dom = document.getElementById('extractresult');
        if (trends_dom !== null)
            trends_dom.outerHTML = "";
        trends_dom = document.createElement('div');
        trends_dom.setAttribute('id', 'extractresult');
        var title_dom = document.createElement('strong');
        title_dom.innerHTML = [
            '<div style="display: block; text-align:center; width: 100%; padding: 0px; margin: auto; vertical-align: middle; border-spacing: 0px"><div style="display: inline-table;">',
            '<div style="display: table-cell; padding: 0px 10px 0px 10px; vertical-align: middle; color: white; font: 12px Meiryo;">' + title + '</div>',
            '<div style="display: table-cell; padding: inherit; vertical-align: middle; color: ' + color + '; font: 12px Meiryo;"><a href="' + masterLink + '">master link</a><br><a href="' + realLink + '">best link</div>',
            '</div>'
        ].join(' ');

        trends_dom.appendChild(title_dom);
        trends_dom.style.cssText = [
            'background: rgba(0, 0, 0, 1);',
            'color: #000;',
            'padding: 0px;',
            'position: fixed;',
            'z-index:10240;',
            'width:100%;',
            'font: 12px Meiryo;',
            'vertical-align: middle;',
        ].join(' ');
        document.body.style.cssText = 'position: relative; margin-top: 45px';
        document.body.parentElement.insertBefore(trends_dom, document.body);
    }
    start();

    function start() {
        var url = document.location.href;
        var extractFunc = null;
        if (/oksusu.com\/v\//gi.test(url))
            extractFunc = ExtractOksusu;
        else if (/oksusu.com/gi.test(url))
            extractFunc = ChangeTag;

        extractFunc(url);
    }

})();