// ==UserScript==
// @name         Download Damn Files
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  đóe có gì đâu
// @author       Hieudm
// @match        https://metrics.sharecarforads.com/evidence
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jszip/3.2.2/jszip.min.js
// @resource https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.css
// @grant         GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/396436/Download%20Damn%20Files.user.js
// @updateURL https://update.greasyfork.org/scripts/396436/Download%20Damn%20Files.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var alarm =
        `
<div href="#" id="cloner-floating-window">
<h3 class="x-row">Tải hết ảnh hộ bố</h3>
<div class="flex x-row"><div class="xspin spin">XXX</div><button id="xdownload" class="btn xbutton">Tải mạnh</button><div class="xspin spin">XXX</div></div>
<div class="x-row" id="xinfo">Bấm nút trên để tải</div>
</div>
<style>
#cloner-floating-window {
position: fixed;
bottom: 40px;
right: 40px;
background-color: #00a65a;
color: #FFF;
text-align: center;
box-shadow: 2px 2px 3px #999;
padding: 20px;
z-index: 1000;
}
#clone-job-input {
color: #00a65a;
}
.x-row {
padding-bottom: 10px;
}
.xbutton {
color: #00a65a;
height: 40px;
margin: -5px 0;
}
.flex {
display:flex;
justify-content: center;
}
.xspin {
margin: 0 10px;
display: none;
}
.spin {
-webkit-animation: spin .2s infinite linear;
-moz-animation: spin .2s infinite linear;
-o-animation: spin .2s infinite linear;
animation: spin .2s infinite linear;
-webkit-transform-origin: 50% 58%;
transform-origin:50% 58%;
-ms-transform-origin:50% 58%; /* IE 9 */
}

@-moz-keyframes spin {
from {
-moz-transform: rotate(0deg);
}
to {
-moz-transform: rotate(360deg);
}
}

@-webkit-keyframes spin {
from {
-webkit-transform: rotate(0deg);
}
to {
-webkit-transform: rotate(360deg);
}
}

@keyframes spin {
from {
transform: rotate(0deg);
}
to {
transform: rotate(360deg);
}
}
</style>`;
    function log(message) {
        $('#xinfo').html(message);
    }
    function isEmptyOrSpaces(str){
        return str === null || str.match(/^ *$/) !== null;
    };

    $('body').append(alarm);
    $('#xdownload').click(function() {
        $('.xspin').show();
        $('#xdownload').attr("disabled", true);
        downloadAll();
    });

    function downloadAll() {
        var zip = new JSZip();
        var dobj = [];
        var ppromises = [];
        var count = 0, length = 0;

        $('#table tbody tr').each(function(i, x) {
            x = $(x);
            ppromises.push(preq(x.find('a').last()[0].href, x.find('a').first()[0].innerText));
            length++;
        });

        function preq(url, fname) {
            return new Promise(function(resolve) {
                $.get(url).done(function(response) {
                    var page = $($.parseHTML(response));
                    count++;
                    page.find('a.fancybox').each(function(i, z) {
                        var x = {
                            fname: fname,
                            url: z.href
                        };
                        dobj.push(x);
                        log('Đang load trang: ' + count + '/' + length);
                        resolve();
                    });

                });
            });
        };
        Promise.all(ppromises).then(function() {
            var fpromises = [];
            for (var i=0; i < dobj.length; i++) {
                fpromises.push(request(dobj[i].url, dobj[i].fname));
            }
            length = fpromises.length;
            count = 0;
            Promise.all(fpromises).then(function() {
                log('Giờ thì zip sml');
                zip.generateAsync({
                    type: "blob"
                }).then(function(content) {
                    $('.xspin').hide();
                    $('#xdownload').attr("disabled", false);
                    saveFile('evidence-page' + $('#table_paginate .paginate_button.active a').data('dt-idx') + '.zip', 'application/zip', content);
                    log('Xong');
                });
            });
        });

        function request(url, uname) {
            return new Promise(function(resolve) {
                var fname = url.split('/');
                fname = fname[fname.length - 1];
                GM.xmlHttpRequest({
                    method: "GET",
                    responseType: 'blob',
                    url: url,
                    onload: function(response) {
                        count += 1;
                        log('Đang tải ảnh: ' + count + '/' + length);
                        console.log(count + '/' + length);
                        zip.file(uname + '/' + fname, response.response);
                        resolve();
                    }
                });
            })
        }

        function saveFile (name, type, data) {
            if (data !== null && navigator.msSaveBlob)
                return navigator.msSaveBlob(new Blob([data], { type: type }), name);
            var a = $("<a style='display: none;'/>");
            var xurl = window.URL.createObjectURL(new Blob([data], {type: type}));
            a.attr("href", xurl);
            a.attr("download", name);
            $("body").append(a);
            a[0].click();
            window.URL.revokeObjectURL(xurl);
            a.remove();
        }
    };
})();