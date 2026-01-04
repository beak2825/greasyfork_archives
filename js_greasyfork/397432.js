// ==UserScript==
// @name 有道划词翻译
// @version 0.1
// @originalAuthor Liu Yuyang(sa@linuxer.me)
// @match https://*/*
// @description 极简
// @grant GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/455026
// @downloadURL https://update.greasyfork.org/scripts/397432/%E6%9C%89%E9%81%93%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/397432/%E6%9C%89%E9%81%93%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

window.document.body.addEventListener('mouseup', translate, false);
var context = new AudioContext();

function translate(e) {
    var previous = document.querySelector('.youdaoPopup');
    if (previous) {
        document.body.removeChild(previous);
    }

    if (!e.ctrlKey) {
        return;
    }

    var selectObj = document.getSelection();

    if (selectObj.anchorNode.nodeType == 3) {
        var word = selectObj.toString();
        if (word == '' || /.*[\u4e00-\u9fa5]+.*/.test(word)) {
            return;
        }

        word = word.replace('-\n', '');
        word = word.replace('-', ' ');
        word = word.replace('\n', ' ');
        word = word.replace('_', ' ');
        word = word.replace(/([A-Z])/g, " $1");

        var ts = new Date().getTime();
        var x = e.clientX;
        var y = e.clientY;
        translate(word, ts);
    }

    function popup(x, y, result) {
        var youdaoWindow = document.createElement('div');
        youdaoWindow.classList.toggle('youdaoPopup');

        var dict = JSON.parse(result);
        var query = dict.query;
        var errorCode = dict.errorCode;
        if (dict.basic) {
            word();
        } else {
            sentence();
        }

        youdaoWindow.style.zIndex = '1024';
        youdaoWindow.style.display = 'block';
        youdaoWindow.style.position = 'fixed';

        youdaoWindow.style.color = 'black';
        youdaoWindow.style.textAlign = 'left';
        youdaoWindow.style.wordWrap = 'break-word';

        youdaoWindow.style.background = 'lightBlue';
        youdaoWindow.style.borderRadius = '5px';
        youdaoWindow.style.boxShadow = '0 0 5px 0';
        youdaoWindow.style.opacity = '1';

        youdaoWindow.style.width = '200px';
        youdaoWindow.style.left = x + 10 + 'px';
        youdaoWindow.style.padding = '5px';

        if (x + 200 + 10 >= window.innerWidth) {
            youdaoWindow.style.left = parseInt(youdaoWindow.style.left) - 200 + 'px';
        }
        if (y + youdaoWindow.offsetHeight + 10 >= window.innerHeight) {
            youdaoWindow.style.bottom = '20px';
        } else {
            youdaoWindow.style.top = y + 10 + 'px';
        }
        document.body.appendChild(youdaoWindow);

        function word() {
            var basic = dict.basic;
            var header = document.createElement('p');
            var span = document.createElement('span');
            span.innerHTML = query;
            header.appendChild(span);

            var phonetic = basic.phonetic;
            if (phonetic) {
                var phoneticNode = document.createElement('span');
                phoneticNode.innerHTML = '[' + phonetic + ']';
                phoneticNode.style.cursor = 'pointer';
                header.appendChild(phoneticNode);

                phoneticNode.addEventListener('mouseup', function (e) {
                    e.stopPropagation()
                }, false);


                var soundUrl = 'https://dict.youdao.com/dictvoice?type=2&audio={}'.replace('{}', query);
                var promise = new Promise(function () {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: soundUrl,
                        responseType: 'arraybuffer',
                        onload: function (res) {
                            try {
                                context.decodeAudioData(res.response, function (buffer) {
                                    phoneticNode.addEventListener('mouseup', function () {
                                        var source = context.createBufferSource();
                                        source.buffer = buffer;
                                        source.connect(context.destination);
                                        source.start(0);
                                    }, false);
                                    header.appendChild(document.createTextNode('✓'));
                                })
                            } catch (e) {
                            }
                        }
                    });
                });
                promise.then();
            }

            header.style.color = 'darkBlue';
            header.style.margin = '0';
            header.style.padding = '0';

            span.style.color = 'black';
            youdaoWindow.appendChild(header);

            var hr = document.createElement('hr');
            hr.style.margin = '0';
            hr.style.padding = '0';
            youdaoWindow.appendChild(hr);

            var ul = document.createElement('ul');
            ul.style.margin = '0';
            ul.style.padding = '0';

            basic['explains'].map(function (trans) {
                var li = document.createElement('li');
                li.style.listStyle = 'none';
                li.style.margin = '0';
                li.style.padding = '0';
                li.appendChild(document.createTextNode(trans));
                ul.appendChild(li);
            });
            youdaoWindow.appendChild(ul);
        }

        function sentence() {
            var ul = document.createElement('ul');
            ul.style.margin = '0';
            ul.style.padding = '0';
            dict['translation'].map(function (trans) {
                var li = document.createElement('li');
                li.style.listStyle = 'none';
                li.style.margin = '0';
                li.style.padding = '0';
                li.appendChild(document.createTextNode(trans));
                ul.appendChild(li);
            });
            youdaoWindow.appendChild(ul);
        }
    }


    function translate(word, ts) {
        var reqUrl = 'http://fanyi.youdao.com/openapi.do?type=data&doctype=json&version=1.1&relatedUrl=' +
            escape('http://fanyi.youdao.com/#') +
            '&keyfrom=fanyiweb&key=null&translate=on' +
            '&q={}'.replace('{}', word) +
            '&ts={}'.replace('{}', ts);

        GM_xmlhttpRequest({
            method: 'GET',
            url: reqUrl,
            onload: function (res) {
                popup(x, y, res.response);
            }
        });
    }
}