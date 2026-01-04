// ==UserScript==
// @name         LinkedIn Learning videos download directly from listing out (basic version for videos only)
// @namespace    http://lyndasub.mybanzou.net/
// @version      0.1.2
// @description  LinkedIn Learning videos download directly from listing out (basic version for videos only).
// @author       ▷Please ask me for scripts that can download subtitles, translate subtitles directly, and batch download videos from LinkedIn Learning.▷ banzou01@gmail.com
// @match        https://www.linkedin.com/learning/*/*u=*
// @include      about:blank
// @icon         data:image/png;base64,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
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/428184/LinkedIn%20Learning%20videos%20download%20directly%20from%20listing%20out%20%28basic%20version%20for%20videos%20only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/428184/LinkedIn%20Learning%20videos%20download%20directly%20from%20listing%20out%20%28basic%20version%20for%20videos%20only%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function leftPad(number, targetLength) {
        var output = number + '';
        while (output.length < targetLength) {
            output = '0' + output;
        }
        return output;
    }

    function validateTitle(title) {
        var newTitle = title.replace(/[\\\/:*?"<>|\r\n]/g, '_');
        return newTitle.trim();
    }
    if (document.body.innerHTML.match('My Learning')) {
        let newWindow = unsafeWindow.open('', '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,top=10,left=10,width=640,height=800');
        newWindow.document.body.innerHTML = '<div id="myPanel" style="background-color:rgba(88,201,98,0.7); color: #1F792C; "><div style="width:30%; text-align: center; height:800px; background-color:rgba(88,201,98,0.4); float:right;"><div style="padding-top: 100px;"><a href="mailto:banzou01@gmail.com"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAI8AAAA7CAMAAAB15inCAAABoVBMVEUAAAC/IBvFIx3EIh7FIh2/IBj8uQP7vAT7vAT8vAP7vQT/vwDFIh7FIh7HIx77vATEIx3LJiDvgBj7uwT8vAPOKiPqQzXnSDDsQzbtUy78vAXqQzXfQDDrQjXsUi9gcHBgYGheY2deYmhgYGhgaGjrQjbqRDVfY2hfY2hfY2hgYGBfY2hfY2hgYHBkZG1fYmhfY2jrQzRfY2deYmhgYGhfY2hdYmi0Lji/txtfYmdgZGhgZGhgZWVeY2hfY2ddYmZfYmdgYGhChfSMTXzuugl/rzU1qFNfZGlfYmlgY2ZzYKO9KCvWuBNNqkk0qFNgY2hgYGBSednpQzWksydBqU5hY2lgampeY2lgaGhfZGdjY3FeY2hfY2lgaGheZGdgZ2hfY2heY2e+Nz5gYmhgYmhDhPTqQzPqQjS9XDxeYmhgYGVgY2ZgZGheYWhgYGjqQjXqQjXpQjXnQDgwp1BfYmjpQjXoQzXfQEBfYmdgY2leYmhfY2leZGhfY2lcY2ZgY2ddYmhmZnPqQzVgY2hgY2hBhfQzqVNAh+9BhPQzqFM0qFQibcUZAAAAi3RSTlMAML/vnyBQv//fjxD/31/Pv38gz1//3yBf75//EI//EGBvgEAgf8+//58R394QAd++769/Qf5g/5/vgEAwoO9w7iD/////n8/PUP//////oBD/oP//XwFfIY4BkK4BjyGecP9hYL+Q74CwMFFBjyFg788gIN7fkBDPUK/PgK9Qb2EBv4+Qv18gv+9w8OziVgAAAuNJREFUeAHszoMVxAAQBcAf83yx3X+FZxvJPu1UMGBUGGOMMSaIkiQreEbVdMO0QEaR7I3RGA9Zpr41AZmpvTfDA/OFvrcEFfvAcT3c8gP9IKT/RK6PK3ESpa8+WV6URZXhO1lVf/iJogYXvDZ69am6dXt1ods2AEVh+LzFeJEC8gl4waIbLjMzM9Ow3DE89XTnWA46MN7yF8OffALUcztRRR4vfSqe+BmowPMga7O7wQcWHluIZmFUXoRsaLTyNGV7jM1kqwfZnmbk5PSSLa0agLZojIyj4jx+JpJWnlTa9EguY6ssT3tHJ3LqIhUVekl/t4rKS/aosPSkevuyPLKZbJXt6R8YzPWEySHAaFhFtVl6UiNNpkdAo/Lb9IyND+Z6nKS/pCGZhARb5h/jhK1Sj5Q2PWbika0GB/M8jeQECppUlClbOEZ6w8C0EiNjM9kvRWUKAGbnlPmyHtmsuEe2KvAoJApbIKNeUlpcipHSMgCsUK8hDFHTZ+3RG1kt6pGtCjx+KsU9pFvT1uTIUOnR1v1s0IAleSm2Gacq8kgbm4WcrW2xFHjIHehNKZkCuxBPKwDsGQdmnzwAktGGJAAcxsRQuQdHx3mck9OnRT0xuqFnZ6YGTTzPIHlIEZiPqhpXblCr8eD0eQ7nxUsU9/j5Cnpn7m8pGc85shjGsQAccxd+/4X7UpjVeIDNrK2OgBKeK8ZUZHfNBtmLy0U9dhpV7TE2k61Q0hPP/4SIsgElPXZ5Pvdo2o2/eo+xmWxV2jMco1fNfX88L+l54hWGdFuLB9jUt7LwwE66YRZig1bS4xGs9DpamwdHb05h7YFCKk7j6CjkW1h59FMR1uIxsvYM+0m6HTbYHHMxslst6ZFfDWEbbHb+RA+GozR7p6K0B/skKf7oT/QAmkI9RQOsPNgTDBPa7U/1AKq2bl/vUVE+7eZGU2Fd7Z6f2/uKPB/wq/r4qbzn8xfUq1evXr169er99X0FhDMo++YgniwAAAAASUVORK5CYII=" width="150px">banzou01@gmail.com</a></div><div style="padding: 10px;">Please Donate Me!</div><a href="http://paypal.me/pendave" target="_blank"><img src="https://www.paypalobjects.com/webstatic/paypalme/images/social/pplogo384.png" width="100px">Paypal.me/pendave</a><hr>▲ Please ask me for scripts that can download subtitles, translate subtitles directly, and batch download videos from LinkedIn Learning.<br />Not FREE!<br />Accept Paypal.▲<hr></div><div id="myfloat" style="width:70%; height:779px; background-color:rgba(88,201,98,0.7); float:left; overflow-y: auto;"></div></div>';
        var newDiv = newWindow.document.body.querySelector('#myfloat');
        var chaptersNodes = document.querySelectorAll('section.classroom-toc-section');
        for (var n = 0; n < chaptersNodes.length; n++) {
            if (chaptersNodes[n].querySelector('button').getAttribute('aria-expanded') == "false") {
                chaptersNodes[n].querySelector('button').click();
            }
        }
        setTimeout(function() {
            if (!chaptersNodes[1].querySelector('span.classroom-toc-section__toggle-title').textContent.match(/1\.\s.+/)) {
                for (var h = 0; h < chaptersNodes.length; h++) {
                    chaptersNodes[h].querySelector('span.classroom-toc-section__toggle-title').textContent = h + '. ' + chaptersNodes[1].querySelector('span.classroom-toc-section__toggle-title').textContent.trim().replace(/\d+\.\s/, '');
                }
            } else {
                chaptersNodes[0].querySelector('span.classroom-toc-section__toggle-title').textContent = '0. ' + chaptersNodes[0].querySelector('span.classroom-toc-section__toggle-title').textContent.trim();
                if (!chaptersNodes[chaptersNodes.length - 1].querySelector('span.classroom-toc-section__toggle-title').textContent.match(/\d+\.\s.+/)) {
                    chaptersNodes[chaptersNodes.length - 1].querySelector('span.classroom-toc-section__toggle-title').textContent = chaptersNodes.length - 1 + '. ' + chaptersNodes[chaptersNodes.length - 1].querySelector('span.classroom-toc-section__toggle-title').textContent.trim();
                }
            }
            var videoNodes = document.querySelectorAll('a.classroom-toc-item__link');
            var videoTitleNodes = document.querySelectorAll('div.classroom-toc-item__title');
            for (var j = 0; j < videoNodes.length; j++) {
                var videoUrl = videoNodes[j].href;
                var videoTitle = validateTitle(videoTitleNodes[j].firstChild.wholeText.trim());
                console.log(videoTitle);
                console.log(j + ' / ' + videoTitleNodes.length + ' : ' + videoUrl);
                var idSrtPart = 'srtLoad' + j;
                var idVideoPart = 'videoLoad' + j;
                var idCopyName = 'copyName' + j;
                newDiv.innerHTML += '<div style="border-radius:10px; border: 1px solid white; padding: 3px; margin: 3px 2px;"><div id=' + idSrtPart + '></div><div id=' + idVideoPart + '>🎞️<button style="float: right;" id=' + idCopyName + '>✂ Video name</button></div></div>';
                let indexTimeArray = [];
                let textLineTransArray = [];
                var ret = GM_xmlhttpRequest({
                    method: "GET",
                    url: videoUrl,
                    onload: callback_function.bind({}, j, newDiv, videoTitle, indexTimeArray, textLineTransArray)
                });
            }
        }, 6000);

        function callback_function(num, newBuiltDiv, video_title, indexTimeArray, textLineTransArray, responseDetails) {
            let container = document.implementation.createHTMLDocument().documentElement;
            container.innerHTML = responseDetails.responseText;
            var codeNodes = container.querySelectorAll('code');
            for (var k = 0; k < codeNodes.length; k++) {
                if (codeNodes[k].textContent.match('learningApiTranscript')) {
                    var result = JSON.parse(codeNodes[k].textContent),
                        downloadVideoLinks = result['included'][2]['presentation']['videoPlay']['videoPlayMetadata']['progressiveStreams'],
                        downloadVideoLink;
                    for (var l = 0; l < downloadVideoLinks.length; l++) {
                        if (downloadVideoLinks[l]["height"] == 720) {
                            downloadVideoLink = downloadVideoLinks[l]["streamingLocations"][0]["url"];
                        }
                    }
                    var span = document.createElement('span');
                    span.download = leftPad(num, 2) + '. ' + video_title;
                    var linkText = document.createTextNode(leftPad(num, 2) + '. ' + video_title);
                    span.appendChild(linkText);
                    console.log('Callback with parameters (' + num + ').');
                    newBuiltDiv.querySelector('#srtLoad' + num).appendChild(span);
                    newBuiltDiv.querySelector('#videoLoad' + num).innerHTML += '<a href="' + downloadVideoLink + '" title="' + video_title + '" download="' + video_title + '.mp4" style="background-color: #46ED52;">' + leftPad(num, 2) + ' ⇩ video</a>';
                    newBuiltDiv.querySelector('#videoLoad' + num).innerHTML += '<span style="float: right; color: white;">' + downloadVideoLink.match(/\d{13}/g)[0] + ' </span>';
                }
            }
            var srtNodes = newBuiltDiv.querySelectorAll('div[id*="srtLoad"]');
            for (var q = 0; q < srtNodes.length; q++) {
                (function(q) {
                    newBuiltDiv.querySelector('#copyName' + q).onclick = function() {
                        GM_setClipboard(newBuiltDiv.querySelector('#srtLoad' + q + ' > span').innerText + '.mp4');
                        this.style.backgroundColor = '#46ED52';
                    };
                })(q);
            }
        }
    }
})();