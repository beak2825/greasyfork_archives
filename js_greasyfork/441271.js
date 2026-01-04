// ==UserScript==
// @name         Tag Join and Tag All Planets
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add join and tag all button to controlled planets page
// @author       You
// @match        *://*hyperiums.com/servlet/Home
// @icon         https://www.google.com/s2/favicons?domain=hyperiums.com
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441271/Tag%20Join%20and%20Tag%20All%20Planets.user.js
// @updateURL https://update.greasyfork.org/scripts/441271/Tag%20Join%20and%20Tag%20All%20Planets.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const setBtn = async function () {
        var inputselecttag = document.createElement('select');
        inputselecttag.id = "tagselect1";
        inputselecttag.name = "tagselect1";
        inputselecttag.size = "1";
        inputselecttag.text = "";
        inputselecttag.value = 0;
        inputselecttag.classList.add("thin");

        var tagvalues = [
            {
                "tag": "",
                "tagid": 0
            },
            {
                "tag": "PANDA",
                "tagid": 89
            }
        ];
        for (var j = 0; j < tagvalues.length; j++) {
            let selecttagoption = document.createElement("option");
            selecttagoption.value = tagvalues[j].tagid;
            selecttagoption.text = tagvalues[j].tag;
            inputselecttag.appendChild(selecttagoption);
        };

        var btnjoinall = document.createElement('input');
        btnjoinall.value = 'Join All';
        btnjoinall.id = 'joinall1';
        btnjoinall.type = 'button';
        btnjoinall.classList.add('button');

        btnjoinall.addEventListener('click', async function (e) {
            e.preventDefault()

            var updatingStatusBar = document.querySelector("#tmpLoadingStatus");
            updatingStatusBar.style.display = null;

            var selectedtag = document.getElementById("tagselect1");
            if (selectedtag.value != 0) {
                var planetcount = 0,
                    tmpTimerArray = new Array(),
                    tmpStartTime = Date.now(),
                    url = 'https://hyperiums.com/servlet/Planet',
                    visibleplanets = document.querySelectorAll('a.large.planet'),
                    planetarray = new Array();

                var selectedtagname = selectedtag.options[selectedtag.selectedIndex].text,
                    visibleplanetcount = visibleplanets.length;

                updatingStatusBar.innerText = 'Joining tag... ' + planetcount.toString() + '/' + visibleplanetcount.toString();

                for (var i = 0; i < visibleplanets.length; i++) {
                    let planetname = visibleplanets[i].innerText,
                        planetid = visibleplanets[i].href.toString().replace('https://hyperiums.com/servlet/Planet?planetid=', ''),
                        tagstatus = visibleplanets[i].nextElementSibling;

                    if (!(tagstatus) && !(planetarray.includes(planetid))) {
                        planetarray.push(planetid);

                        console.log('Joining tag [', selectedtagname, '] on planet: ', planetname, '(', planetid, ')');

                        let joinqueryparam = 'tag=' + selectedtagname + '&joinalliance=Join&planetid=' + planetid;

                        let tmpRunTime = Date.now(),
                            tmpRunCount3 = (planetcount > 0) ? tmpTimerArray[planetcount - 1] : tmpRunTime,
                            tmpRunCount30 = (planetcount > 9) ? tmpTimerArray[planetcount - 10] : tmpRunTime;

                        tmpTimerArray[planetcount] = tmpRunTime;
                        updatingStatusBar.innerText = 'Joining tag... ' + planetcount.toString() + '/' + visibleplanetcount.toString() + ' (planet:' + planetname + ')';

                        if((tmpRunTime - tmpRunCount3) > 0 && (tmpRunTime - tmpRunCount3) < 1000) {
                            updatingStatusBar.innerText = 'Joining tag... ' + planetcount.toString() + '/' + visibleplanetcount.toString() + ' (planet:' + planetname + ') - Waiting: ' + ((1000 - (tmpRunTime - tmpRunCount3)) / 1000).toString() + ' seconds...';
                            console.log('Waiting ', ((1000 - (tmpRunTime - tmpRunCount3)) / 1000).toString(), ' seconds.');
                            await new Promise(resolve => setTimeout(resolve, 1000 - (tmpRunTime - tmpRunCount3)));
                            updatingStatusBar.innerText = 'Joining tag... ' + planetcount.toString() + '/' + visibleplanetcount.toString() + ' (planet:' + planetname + ')';
                        }else if ((tmpRunTime - tmpRunCount30) > 0 && (tmpRunTime - tmpRunCount30) < 60000) {
                            updatingStatusBar.innerText = 'Joining tag... ' + planetcount.toString() + '/' + visibleplanetcount.toString() + ' (planet:' + planetname + ') - Waiting: ' + ((60000 - (tmpRunTime - tmpRunCount30)) / 1000).toString() + ' seconds...';
                            console.log('Waiting ', ((60000 - (tmpRunTime - tmpRunCount30)) / 1000).toString(), ' seconds.');
                            await new Promise(resolve => setTimeout(resolve, 60000 - (tmpRunTime - tmpRunCount30)));
                            updatingStatusBar.innerText = 'Joining tag... ' + planetcount.toString() + '/' + visibleplanetcount.toString() + ' (planet:' + planetname + ')';
                        };

                        console.log('Tag Join Request Starting: ', url + '?' + joinqueryparam);
                        const joinresult = await fetch(url, {
                            method: 'post',
                            body: new URLSearchParams(joinqueryparam),
                        })
                        .then(function (response) {
                            return response.text();
                        })
                        .then(function (html) {
                            return 'TAG JOIN SUCCESS';
                        })
                        .catch(function (err) {
                            console.warn('Something went wrong with joining tag.', err);
                        });
                        console.log('Tag Join Request Complete');

                        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec

                        console.log('Completed planet #', planetcount.toString(), ': ', planetname, '(', planetid, ')');

                        planetcount++;
                    } else {
                        visibleplanetcount--;
                        updatingStatusBar.innerText = 'Joining tag... ' + planetcount.toString() + '/' + visibleplanetcount.toString();
                    };
                };

                console.log('Tag joined for ', planetcount.toString(), ' planets');
                updatingStatusBar.innerText = 'Completed... ' + planetcount.toString() + '/' + visibleplanetcount.toString();
                await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec
                updatingStatusBar.innerText = '';
                updatingStatusBar.style.display = 'none';

                /*
                console.log('Clicks since start: ', ((planetcount + 1) * 2).toString(), ' clicks');
                console.log('Seconds since start: ', ((Date.now() - tmpStartTime) / 1000).toString(), ' seconds');
                console.log('Clicks per second: ',(((planetcount + 1) * 2)/((Date.Now() - tmpStartTime) / 1000)).toString(), ' clicks');
                */
            } else {
                updatingStatusBar.style.color = '#FF4444';
                updatingStatusBar.innerText = 'Failed: Please select a valid tag.';
                await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec
                updatingStatusBar.innerText = '';
                updatingStatusBar.style.color = '#999983';
                updatingStatusBar.style.display = 'none';
            };
        }, false);

        var btntagall = document.createElement('input');
        btntagall.value = 'Tag All';
        btntagall.id = 'tagall1';
        btntagall.type = 'button';
        btntagall.classList.add('button');

        btntagall.addEventListener('click', async function (e) {
            e.preventDefault()

            var planetcount = 0,
                tmpTimerArray = new Array(),
                tmpStartTime = Date.now(),
                url = 'https://hyperiums.com/servlet/Alliance',
                visibleplanets = document.querySelectorAll('span.privateTag');

            var visibleplanetcount = visibleplanets.length;

            var updatingStatusBar = document.querySelector("#tmpLoadingStatus");
            updatingStatusBar.style.display = null;
            updatingStatusBar.innerText = 'Public tagging... ' + planetcount.toString() + '/' + visibleplanetcount.toString();

            for (var i = 0; i < visibleplanets.length; i++) {
                let planetname = visibleplanets[i].previousElementSibling.innerText,
                    planetid = visibleplanets[i].previousElementSibling.href.toString().replace('https://hyperiums.com/servlet/Planet?planetid=', ''),
                    planettagname = visibleplanets[i].firstChild.innerText,
                    planettagid = visibleplanets[i].firstChild.href.toString().replace('https://hyperiums.com/servlet/Alliance?planetid=13100&tagid=', '');

                console.log('Public tagging [', planettagname, '] on planet: ', planetname, '(', planetid, ')');

                let tagqueryparam = 'tagstate=1&updatetag=Update&planetid=' + planetid + '&tagid=' + planettagid;

                let tmpRunTime = Date.now(),
                    tmpRunCount3 = (planetcount > 0) ? tmpTimerArray[planetcount - 1] : tmpRunTime,
                    tmpRunCount30 = (planetcount > 9) ? tmpTimerArray[planetcount - 10] : tmpRunTime;

                tmpTimerArray[planetcount] = tmpRunTime;
                updatingStatusBar.innerText = 'Public tagging... ' + planetcount.toString() + '/' + visibleplanetcount.toString() + ' (planet:' + planetname + ')';

                if((tmpRunTime - tmpRunCount3) > 0 && (tmpRunTime - tmpRunCount3) < 1000) {
                    updatingStatusBar.innerText = 'Public tagging... ' + planetcount.toString() + '/' + visibleplanetcount.toString() + ' (planet:' + planetname + ') - Waiting: ' + ((1000 - (tmpRunTime - tmpRunCount3)) / 1000).toString() + ' seconds...';
                    console.log('Waiting ', ((1000 - (tmpRunTime - tmpRunCount3)) / 1000).toString(), ' seconds.');
                    await new Promise(resolve => setTimeout(resolve, 1000 - (tmpRunTime - tmpRunCount3)));
                    updatingStatusBar.innerText = 'Public tagging... ' + planetcount.toString() + '/' + visibleplanetcount.toString() + ' (planet:' + planetname + ')';
                }else if ((tmpRunTime - tmpRunCount30) > 0 && (tmpRunTime - tmpRunCount30) < 60000) {
                    updatingStatusBar.innerText = 'Public tagging... ' + planetcount.toString() + '/' + visibleplanetcount.toString() + ' (planet:' + planetname + ') - Waiting: ' + ((60000 - (tmpRunTime - tmpRunCount30)) / 1000).toString() + ' seconds...';
                    console.log('Waiting ', ((60000 - (tmpRunTime - tmpRunCount30)) / 1000).toString(), ' seconds.');
                    await new Promise(resolve => setTimeout(resolve, 60000 - (tmpRunTime - tmpRunCount30)));
                    updatingStatusBar.innerText = 'Public tagging... ' + planetcount.toString() + '/' + visibleplanetcount.toString() + ' (planet:' + planetname + ')';
                };

                console.log('Public Tag Request Starting: ', url + '?' + tagqueryparam);
                const tagresult = await fetch(url, {
                    method: 'post',
                    body: new URLSearchParams(tagqueryparam),
                })
                .then(function (response) {
                    return response.text();
                })
                .then(function (html) {
                    return 'TAG JOIN SUCCESS';
                })
                .catch(function (err) {
                    console.warn('Something went wrong with joining tag.', err);
                });
                console.log('Public Tag Request Complete');

                await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec

                console.log('Completed planet #', planetcount.toString(), ': ', planetname, '(', planetid, ')');

                planetcount++;
            };

            console.log('Public tagged for ', planetcount.toString(), ' planets');
            updatingStatusBar.innerText = 'Completed... ' + planetcount.toString() + '/' + visibleplanetcount.toString();
            await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec
            updatingStatusBar.innerText = '';
            updatingStatusBar.style.display = 'none';

            /*
            console.log('Clicks since start: ', ((planetcount + 1) * 2).toString(), ' clicks');
            console.log('Seconds since start: ', ((Date.now() - tmpStartTime) / 1000).toString(), ' seconds');
            console.log('Clicks per second: ',(((planetcount + 1) * 2)/((Date.Now() - tmpStartTime) / 1000)).toString(), ' clicks');
            */
        }, false);

        var divinput = document.createElement('div');
        divinput.classList.add('banner');

        var loadingbarspan = document.createElement('span');
        loadingbarspan.id = 'tmpLoadingStatus';
        loadingbarspan.style.color = '#999983';
        loadingbarspan.style.fontWeight = 'bold';
        loadingbarspan.style.display = 'none';
        loadingbarspan.classList.add('tmpLoadingStatus');

        var tableinput = document.createElement('table');
        tableinput.width = '600';
        var tbodyinput = document.createElement('tbody');
        var trinput = document.createElement('tr');
        var tdinput = document.createElement('td');
        tdinput.classList.add('hc', 'vc');
        tdinput.width = '100%';

        divinput.appendChild(tableinput);
        tableinput.appendChild(tbodyinput);
        tbodyinput.appendChild(trinput);
        trinput.appendChild(tdinput);
        tdinput.append('Select tag:', inputselecttag);
        tdinput.append('   ', btnjoinall);
        tdinput.append('\u00A0\u00A0\u00A0'); //&nbsp;
        tdinput.append(btntagall);
        tdinput.append('\u00A0\u00A0\u00A0'); //&nbsp;

        divinput.appendChild(loadingbarspan);

        document.querySelector('body > center').insertBefore(divinput, document.querySelector('body > center > table:nth-child(1)').nextSibling);
    };
    setBtn();
})();