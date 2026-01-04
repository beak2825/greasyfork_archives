// ==UserScript==
// @name           Extract Greeting Video
// @description    Extract Greeting Video by Keyakizaka46
// @match http://*/*
// @match https://*/*
// @version 0.0.1.20231031111255
// @namespace https://greasyfork.org/users/3920
// @downloadURL https://update.greasyfork.org/scripts/37421/Extract%20Greeting%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/37421/Extract%20Greeting%20Video.meta.js
// ==/UserScript==

(function () {
// static
    copyToClipboard = function(val) {
        var t = document.createElement("textarea");
        document.body.appendChild(t);
        t.value = val;
        t.select();
        document.execCommand('copy');
        document.body.removeChild(t);
    }

    function ExtractGreeting(url) {
        var accountId = "";
        var videoId = "";

        var player = document.getElementById("moviePlayer");
        if (player === undefined || player === null)
        {
            var find = document.getElementsByClassName("vjs-tech");
            for(var i = 0; i < find.length; ++i)
            {
                if(find[i].getAttribute("id") != "moviePlayerTop_html5_api")
                {
                    player = find[i];
                    break;
                }
            }
        }
        if (player !== undefined && player !== null) {
            accountId = player.getAttribute("data-account");
            videoId = player.getAttribute("data-video-id");
        }

        if (accountId === null || videoId === null) {
            player = document.getElementsByTagName('video-js');
            if (player.length > 0) {
              accountId = player[0].getAttribute("data-account");
              videoId = player[0].getAttribute("data-video-id");
            }
        }

        if (accountId === "" || videoId === "") {
            var find = document.getElementsByTagName("iframe");
            for(var i = 0; i < find.length; ++i) {
                var getdata = /players\.brightcove\.net\/(\d+)\/.+\?videoId=(\d+)/.exec(find[i].src);
                if(getdata !== null) {
                    accountId = getdata[1];
                    videoId = getdata[2];
                    break;
                }
            }
        }

        if (accountId === "" || videoId === "") return;

        var playerXml;
        var retn = Array();

        $.ajax({
            type: "GET",
            url: "https://edge.api.brightcove.com/playback/v1/accounts/" + accountId + "/videos/" + videoId,
            async: false,
            beforeSend: function (req) {
                req.setRequestHeader("Accept", "application/json;pk=BCpkADawqM0Fs9UkaTmCr7HkZ6ZiBKsiH6o9LumPwPktD1Ek2hX07e4sekrU-cJI1Xit2Iguh0tJhafMgbqQ7gWg4p41zeIJTXqzBrQ6tjd52cxNXbX8Zqo7K3_a8BkSzZTJqf9c44oOj_Bw");
            },
            success: function (xml) {
                playerXml = xml;
                retn[0] = playerXml.name;
                retn[3] = xml.poster;
                for (var i = 0; i < xml.sources.length; ++i) {
                    if (xml.sources[i].type == "application/vnd.apple.mpegurl" || xml.sources[i].type == "application/x-mpegURL") {
                        if (/^https/g.test(xml.sources[i].src)) {
                            retn[1] = xml.sources[i].src;
                        }
                    }
                }
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
                    var domain = retn[1].replace(/^(https?:\/\/[^:\/\s]+)(.+?)$/, "$1");
                    var pattern = /^.+?,BANDWIDTH=(\d+?),.+?$\n^([^#].+?)$/gm;
                    var matchArray;
                    var maxBandwidth = 0;

                    while ((matchArray = pattern.exec(xml)) !== null) {
                        var bandwidth = Number(matchArray[1]);
                        if (maxBandwidth < bandwidth) {
                            maxBandwidth = bandwidth;
                            if (/^https?:\/\//.test(matchArray[2]))
                                retn[2] = matchArray[2];
                            else
                                retn[2] = domain + "/" + matchArray[2];
                        }
                    }
                    //console.log(retn);
                },
                error: function (xhr, status, error) {
                    retn[1] = "error";
                }
            });
        }

        ShowResult(retn, "");
    }

    function start() {
        if (typeof (jQuery) == 'undefined') {
            var jquery = document.createElement('script');
            jquery.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js';
            document.body.appendChild(jquery);
            setTimeout(start, 100);
            return;
        }

        var url = document.location.href;
        var extractFunc = null;
/*
        if (/keyakizaka46.com/gi.test(url) || /players.brightcove.net/gi.test(url) || /hinatazaka46.com/gi.test(url))
            extractFunc = ExtractGreeting;
        else
            return;

        extractFunc(url);
*/
        ExtractGreeting(url);
    }

    function ShowResult(results, color) {
        var today = new Date();
        //var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        //if(dd < 10) dd = '0' + dd;
        if(mm < 10) mm = '0' + mm;
        today = yyyy + '' + mm + ' ';

        var title = "";
        var masterLink = "";
        var realLink = "";
        let poster = '';
        if (color === "")
            color = "white";
        if (results.length === 0) {
            title = "Parse error...";
            masterLink = "Not found...";
        } else {
            title = results[0];
            masterLink = results[1] + "\n" + today + title + "\n";
            realLink = results[2] + "\n" + today + title + "\n";
            poster = `${results[3].replace(/\/\d+x\d+\//, '/9999x9999/')}?title=${today}${title}`;
        }

        var trends_dom = document.getElementById('extractresult');
        if (trends_dom !== null)
            trends_dom.outerHTML = "";
        trends_dom = document.createElement('div');
        trends_dom.setAttribute('id', 'extractresult');
        var title_dom = document.createElement('strong');
        title_dom.innerHTML = [
			'<div style="display: block; text-align:center; width: 100%; padding: 0px; margin: auto; vertical-align: middle; border-spacing: 0px"><div style="display: inline-table;">',
			'<div id="popup-close" style="display: table-cell;position: relative;"></div>',
			'<div style="display: table-cell; padding: 0px 10px 0px 10px; vertical-align: middle; color: white; font: 12px Meiryo;"><div onclick="copyToClipboard(this.getAttribute(\'value\'));" value="' + today + title + '");">' + title + '</div></div>',
			'<div style="display: table-cell; padding: inherit; vertical-align: middle; color: ' + color + '; font: 12px Meiryo;"><div onclick="copyToClipboard(this.getAttribute(\'value\'));" value="' + masterLink + '");">master link</div><div onclick="copyToClipboard(this.getAttribute(\'value\'));" value="' + realLink + '");">best link</div><a download="' + `${today}${title}` + '" href="' + poster + '">poster</a></div>',
			'</div>'
        ].join(' ');

        trends_dom.appendChild(title_dom);
        trends_dom.style.cssText = [
			'background: rgba(160, 212, 104, 1);',
			'color: #000;',
			'padding: 0px;',
			'position: fixed;',
			'z-index:102400;',
			'width:100%;',
			'font: 12px Meiryo;',
			'vertical-align: middle;',
        ].join(' ');
        document.body.style.cssText = 'position: relative; margin-top: 45px';
        document.body.parentElement.insertBefore(trends_dom, document.body);

        $('#popup-close').on('click',function(){
                $("#popup").removeClass("popup-active");
                $(".box_video").empty();
                $('#extractresult').empty();
        });
    }

    start();
})();