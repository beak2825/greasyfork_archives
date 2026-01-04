// ==UserScript==
// @name         Process Builder Batch Remover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Delete all versions of a process in a batch
// @author       bzheng
// @match        *.lightning.force.com/lightning/setup/ProcessAutomation/home
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/408658/Process%20Builder%20Batch%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/408658/Process%20Builder%20Batch%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function confirmError(doc, count) {
        if (count > -1) {
            count--;
            let toClick = [];
            let spans = doc.getElementsByTagName('SPAN');
            for (let i = 0; i < spans.length; i++) {
                if (spans[i].innerText == "OK") {
                    toClick.push(spans[i]);
                }
            }
            if (toClick.length < 1) {
                setTimeout(function() {
                    confirmError(doc,count);
                }, 2000);
            }
            else {
                toClick.forEach(function(item) {
                    item.click();
                });
            }
        }
    }

    function delVersions(doc) {
        let processLabel = prompt('Please enter the label of the process you want to delete');
        console.log(processLabel);
        var process = doc.getElementsByClassName('bodyRow processuimgntConsoleListRow versionOpen');
        if (process.length == 0) {
            alert('Please expand the process you want to delete');
            return;
        }
        else if (process.length > 1) {
            alert('Please expand only 1 process');
            return;
        }
        else {
            var versions = [];
            var versionTrs = doc.getElementsByClassName('bodyRow summary processuimgntVersionListRow processuimgntConsoleListRow');
            var hasActive = false;
            if (processLabel == versionTrs[0].children[0].getAttribute('title')) {
                for (let i = 0; i < versionTrs.length; i++) {
                    //console.log(versionTrs[i]);
                    versions.push(versionTrs[i].children[6].firstChild);
                    if (versionTrs[i].children[5].getAttribute('title') == 'Active') {
                        hasActive = true;
                        break;
                    }
                }
                if (hasActive) {
                    alert('cannot delete the process with an active version');
                    return;
                }
                else {
                    console.log(versions.length);
                    versions.forEach(function(v) {
                        v.click();
                    });
                    setTimeout(function() {//'Confirm' dialogues may not pop up instantly, so delay a bit
                        let confirms = [];
                        let d = doc;
                        let spans = d.getElementsByTagName('SPAN');
                        for (let i = 0; i < spans.length; i++) {
                            if (spans[i].innerText == "Confirm") {
                                confirms.push(spans[i]);
                            }
                        }
                        confirms.forEach(function(c) {
                            c.click();
                        });
                        setTimeout(function() {//confirm the 'error' prompt
                            confirmError(d, 10);
                        }, 3000);

                    }, 5000);

                }
            }
        }
    }

    function addButton(count) {
        if (count > -1) {
            count--;
            let topmost = document.getElementsByClassName("viewport");
            console.log(topmost.length);
            if (topmost != null && topmost.length > 0) {
                //console.log(topmost[0]);
                let ifrm = topmost[0].getElementsByTagName('IFRAME');
                console.log(ifrm.length);
                if (ifrm.length > 0) {
                    //console.log(ifrm[0]);
                    var doc = ifrm[0].contentDocument ? ifrm[0].contentDocument: ifrm[0].contentWindow.document;
                    console.log(doc);
                    let titleDiv = doc.getElementsByClassName('myprocesses');

                    if (titleDiv == null || titleDiv.length < 1) {
                        setTimeout(function() {
                            addButton(10);
                        },1000);
                    }
                    else {
                        console.log(titleDiv[0]);
                        var btnDiv = document.createElement('div');
                        btnDiv.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;<button type="button" id="btnDelVersions" value="true" ><em>Mass Delete Versions</em></button>';
                        titleDiv[0].appendChild(btnDiv);
                        let btnDelVersions = doc.getElementById('btnDelVersions');
                        btnDelVersions.addEventListener('click', function() {
                            delVersions(doc);
                        }, false);
                    }
                    return;
                }
                else {
                   setTimeout(function() {
                      addButton(10);
                   }, 2000);
                }

            }
            else {
                setTimeout(function() {
                    addButton(count);
                }, 2000);
            }
        }
        else {
            alert('Please refresh your page');
        }
    }

    addButton(10);//try 10 times
})();