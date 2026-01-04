// ==UserScript==
// @name         Merge All Foreign Fleets
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add merge all button to foreign fleets page
// @author       You
// @match        *://*hyperiums.com/servlet/Fleets?pagetype=foreign_fleets
// @icon         https://www.google.com/s2/favicons?domain=hyperiums.com
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441213/Merge%20All%20Foreign%20Fleets.user.js
// @updateURL https://update.greasyfork.org/scripts/441213/Merge%20All%20Foreign%20Fleets.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const setBtn = async function () {
        /*
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.text = "";
        document.getElementsByTagName('head')[0].appendChild(script);
        */

        /*
        var iframehidden = document.createElement('iframe');
        iframehidden.name = 'iframeformsubmit1';
        iframehidden.id = 'iframeformsubmit1';
        iframehidden.style = 'display: none;';

        iframehidden.addEventListener('load', async function (e) {
            e.preventDefault()
            console.log('iframe loaded');
        }, false);
        */

        var inputselectplanet = document.createElement('select');
        inputselectplanet.id = "planetselect1";
        inputselectplanet.name = "planetselect1";
        inputselectplanet.size = "1";
        inputselectplanet.classList.add("thin");

        var planetnamearray = document.querySelectorAll('a.large.planet');
        for (var j = 0; j < planetnamearray.length; j++) {
            let planetname = planetnamearray[j].innerText,
                planetid = planetnamearray[j].href.toString().replace('https://hyperiums.com/servlet/Planetfloats?planetid=', '');
            let selectplanetoption = document.createElement("option");
            selectplanetoption.value = planetid;
            selectplanetoption.text = planetname;
            inputselectplanet.appendChild(selectplanetoption);
        };

        var btnmergeselected = document.createElement('input');
        btnmergeselected.value = 'Merge Selected';
        btnmergeselected.id = 'mergeselected1';
        btnmergeselected.type = 'button';
        btnmergeselected.classList.add('button');

        btnmergeselected.addEventListener('click', async function (e) {
            e.preventDefault()

            var tmpStartTime = Date.now(),
                url = 'https://hyperiums.com/servlet/Floatorders',
                selectedplanet = document.getElementById("planetselect1");

            let planetid = selectedplanet.value,
                planetname = selectedplanet.options[selectedplanet.selectedIndex].text;

            var updatingStatusBar = document.querySelector("#tmpLoadingStatus");
            updatingStatusBar.innerText = 'Merging... (planet:' + planetname + ')';

            //console.log('Merging fleets & armies on planet: ', planetname, '(', planetid, ')');

            let fleetqueryparam = 'merge=OK&planetid=' + planetid + '&confirm=&nbarmies=100&mgt_order_done=',
                armyqueryparam = 'merge=OK&planetid=' + planetid + '&confirm=&nbarmies=0&mgt_order_done=';

            //console.log('Fleet Merge Request Starting: ', url + fleetqueryparam);
            const fleetresult = await fetch(url, {
                method: 'post',
                body: new URLSearchParams(fleetqueryparam),
            })
            .then(function (response) {
                return response.text();
            })
            .then(function (html) {
                return 'FLEET MERGE SUCCESS';
            })
            .catch(function (err) {
                console.warn('Something went wrong with fleet merge.', err);
            });
            //console.log('Fleet Merge Request Complete');

            await new Promise(resolve => setTimeout(resolve, 1000)); // 1 sec

            //console.log('Army Merge Request Starting: ', url + armyqueryparam);
            const armyresult = await fetch(url, {
                method: 'post',
                body: new URLSearchParams(armyqueryparam),
            })
            .then(function (response) {
                return response.text();
            })
            .then(function (html) {
                return 'ARMY MERGE SUCCESS';
            })
            .catch(function (err) {
                console.warn('Something went wrong with army merge.', err);
            });
            //console.log('Army Merge Request Complete');
            //console.log('Merged fleet & armies for ', planetname);
            updatingStatusBar.innerText = 'Complete... (planet:' + planetname + ')';
        }, false);

        var btnmergeallvisible = document.createElement('input');
        btnmergeallvisible.value = 'Merge All Visible';
        btnmergeallvisible.id = 'mergeallvisible1';
        btnmergeallvisible.type = 'button';
        btnmergeallvisible.classList.add('button');

        btnmergeallvisible.addEventListener('click', async function (e) {
            e.preventDefault()

            var planetcount = 0,
                tmpTimerArray = new Array(),
                tmpStartTime = Date.now(),
                url = 'https://hyperiums.com/servlet/Floatorders',
                visibleplanets = document.querySelectorAll("div:not(.tabbertabhide) > div.planetCard3 > div.visib_content > table > tbody > tr > td.vt > table > tbody > tr > td.vc > a.large.planet");

            var updatingStatusBar = document.querySelector("#tmpLoadingStatus");
            updatingStatusBar.innerText = 'Merging... ' + planetcount.toString() + '/' + visibleplanets.length.toString();

            for (var i = 0; i < visibleplanets.length; i++) {
                let planetname = visibleplanets[i].innerText,
                    planetid = visibleplanets[i].href.toString().replace('https://hyperiums.com/servlet/Planetfloats?planetid=', '');

                //console.log('Merging fleets & armies on planet: ', planetname, '(', planetid, ')');

                let fleetqueryparam = 'merge=OK&planetid=' + planetid + '&confirm=&nbarmies=100&mgt_order_done=',
                    armyqueryparam = 'merge=OK&planetid=' + planetid + '&confirm=&nbarmies=0&mgt_order_done=';

                let tmpRunTime = Date.now(),
                    tmpRunCount3 = (planetcount > 1) ? tmpTimerArray[planetcount - 2] : tmpRunTime,
                    tmpRunCount30 = (planetcount > 14) ? tmpTimerArray[planetcount - 15] : tmpRunTime;

                tmpTimerArray[planetcount] = tmpRunTime;
                updatingStatusBar.innerText = 'Merging... ' + planetcount.toString() + '/' + visibleplanets.length.toString() + ' (planet:' + planetname + ')';

                if((tmpRunTime - tmpRunCount3) > 0 && (tmpRunTime - tmpRunCount3) < 1000) {
                    updatingStatusBar.innerText = 'Merging... ' + planetcount.toString() + '/' + visibleplanets.length.toString() + ' (planet:' + planetname + ') - Waiting: ' + ((1000 - (tmpRunTime - tmpRunCount3)) / 1000).toString() + ' seconds...';
                    console.log('Waiting ', ((1000 - (tmpRunTime - tmpRunCount3)) / 1000).toString(), ' seconds.');
                    await new Promise(resolve => setTimeout(resolve, 1000 - (tmpRunTime - tmpRunCount3)));
                    updatingStatusBar.innerText = 'Merging... ' + planetcount.toString() + '/' + visibleplanets.length.toString() + ' (planet:' + planetname + ')';
                }else if ((tmpRunTime - tmpRunCount30) > 0 && (tmpRunTime - tmpRunCount30) < 60000) {
                    updatingStatusBar.innerText = 'Merging... ' + planetcount.toString() + '/' + visibleplanets.length.toString() + ' (planet:' + planetname + ') - Waiting: ' + ((60000 - (tmpRunTime - tmpRunCount30)) / 1000).toString() + ' seconds...';
                    console.log('Waiting ', ((60000 - (tmpRunTime - tmpRunCount30)) / 1000).toString(), ' seconds.');
                    await new Promise(resolve => setTimeout(resolve, 60000 - (tmpRunTime - tmpRunCount30)));
                    updatingStatusBar.innerText = 'Merging... ' + planetcount.toString() + '/' + visibleplanets.length.toString() + ' (planet:' + planetname + ')';
                };

                //console.log('Fleet Merge Request Starting: ', url + fleetqueryparam);
                const fleetresult = await fetch(url, {
                    method: 'post',
                    body: new URLSearchParams(fleetqueryparam),
                })
                .then(function (response) {
                    return response.text();
                })
                .then(function (html) {
                    return 'FLEET MERGE SUCCESS';
                })
                .catch(function (err) {
                    console.warn('Something went wrong with fleet merge.', err);
                });
                //console.log('Fleet Merge Request Complete');

                await new Promise(resolve => setTimeout(resolve, 1000)); // 1 sec

                //console.log('Army Merge Request Starting: ', url + armyqueryparam);
                const armyresult = await fetch(url, {
                    method: 'post',
                    body: new URLSearchParams(armyqueryparam),
                })
                .then(function (response) {
                    return response.text();
                })
                .then(function (html) {
                    return 'ARMY MERGE SUCCESS';
                })
                .catch(function (err) {
                    console.warn('Something went wrong with army merge.', err);
                });
                //console.log('Army Merge Request Complete');

                /*
                console.log('Completed planet #', planetcount.toString(), ': ', planetname, '(', planetid, ')');
                console.log('Seconds per 6 clicks: ', ((tmpRunTime - tmpRunCount3) / 1000).toString(), ' seconds');
                console.log('Seconds per 30 clicks: ', ((tmpRunTime - tmpRunCount30) / 1000).toString(), ' seconds');
                console.log('Clicks since start: ', ((planetcount + 1) * 2).toString(), ' clicks');
                console.log('Seconds since start: ', ((tmpRunTime - tmpStartTime) / 1000).toString(), ' seconds');
                */
                planetcount++;
            };
            /*
            console.log('Merged fleet & armies for ', planetcount.toString(), ' planets');
            console.log('Clicks since start: ', ((planetcount + 1) * 2).toString(), ' clicks');
            console.log('Seconds since start: ', ((Date.now() - tmpStartTime) / 1000).toString(), ' seconds');
            console.log('Clicks per second: ',(((planetcount + 1) * 2)/((Date.Now() - tmpStartTime) / 1000)).toString(), ' clicks');
            */
            updatingStatusBar.innerText = 'Complete... ' + visibleplanets.length.toString() + '/' + visibleplanets.length.toString();
        }, false);

        var btnmergeall = document.createElement('input');
        btnmergeall.value = 'Merge All';
        btnmergeall.id = 'mergeall1';
        btnmergeall.type = 'button';
        btnmergeall.classList.add('button');

        btnmergeall.addEventListener('click', async function (e) {
            e.preventDefault()

            var planetcount = 0,
                tmpTimerArray = new Array(),
                tmpStartTime = Date.now(),
                url = 'https://hyperiums.com/servlet/Floatorders',
                visibleplanets = document.querySelectorAll('a.large.planet');

            var updatingStatusBar = document.querySelector("#tmpLoadingStatus");
            updatingStatusBar.innerText = 'Merging... ' + planetcount.toString() + '/' + visibleplanets.length.toString();

            for (var i = 0; i < visibleplanets.length; i++) {
                let planetname = visibleplanets[i].innerText,
                    planetid = visibleplanets[i].href.toString().replace('https://hyperiums.com/servlet/Planetfloats?planetid=', '');

                //console.log('Merging fleets & armies on planet: ', planetname, '(', planetid, ')');

                let fleetqueryparam = 'merge=OK&planetid=' + planetid + '&confirm=&nbarmies=100&mgt_order_done=',
                    armyqueryparam = 'merge=OK&planetid=' + planetid + '&confirm=&nbarmies=0&mgt_order_done=';

                let tmpRunTime = Date.now(),
                    tmpRunCount3 = (planetcount > 1) ? tmpTimerArray[planetcount - 2] : tmpRunTime,
                    tmpRunCount30 = (planetcount > 14) ? tmpTimerArray[planetcount - 15] : tmpRunTime;

                tmpTimerArray[planetcount] = tmpRunTime;
                updatingStatusBar.innerText = 'Merging... ' + planetcount.toString() + '/' + visibleplanets.length.toString() + ' (planet:' + planetname + ')';

                if((tmpRunTime - tmpRunCount3) > 0 && (tmpRunTime - tmpRunCount3) < 1000) {
                    updatingStatusBar.innerText = 'Merging... ' + planetcount.toString() + '/' + visibleplanets.length.toString() + ' (planet:' + planetname + ') - Waiting: ' + ((1000 - (tmpRunTime - tmpRunCount3)) / 1000).toString() + ' seconds...';
                    console.log('Waiting ', ((1000 - (tmpRunTime - tmpRunCount3)) / 1000).toString(), ' seconds.');
                    await new Promise(resolve => setTimeout(resolve, 1000 - (tmpRunTime - tmpRunCount3)));
                    updatingStatusBar.innerText = 'Merging... ' + planetcount.toString() + '/' + visibleplanets.length.toString() + ' (planet:' + planetname + ')';
                }else if ((tmpRunTime - tmpRunCount30) > 0 && (tmpRunTime - tmpRunCount30) < 60000) {
                    updatingStatusBar.innerText = 'Merging... ' + planetcount.toString() + '/' + visibleplanets.length.toString() + ' (planet:' + planetname + ') - Waiting: ' + ((60000 - (tmpRunTime - tmpRunCount30)) / 1000).toString() + ' seconds...';
                    console.log('Waiting ', ((60000 - (tmpRunTime - tmpRunCount30)) / 1000).toString(), ' seconds.');
                    await new Promise(resolve => setTimeout(resolve, 60000 - (tmpRunTime - tmpRunCount30)));
                    updatingStatusBar.innerText = 'Merging... ' + planetcount.toString() + '/' + visibleplanets.length.toString() + ' (planet:' + planetname + ')';
                };

                //console.log('Fleet Merge Request Starting: ', url + fleetqueryparam);
                const fleetresult = await fetch(url, {
                    method: 'post',
                    body: new URLSearchParams(fleetqueryparam),
                })
                .then(function (response) {
                    return response.text();
                })
                .then(function (html) {
                    return 'FLEET MERGE SUCCESS';
                })
                .catch(function (err) {
                    console.warn('Something went wrong with fleet merge.', err);
                });
                //console.log('Fleet Merge Request Complete');

                await new Promise(resolve => setTimeout(resolve, 1000)); // 1 sec

                //console.log('Army Merge Request Starting: ', url + armyqueryparam);
                const armyresult = await fetch(url, {
                    method: 'post',
                    body: new URLSearchParams(armyqueryparam),
                })
                .then(function (response) {
                    return response.text();
                })
                .then(function (html) {
                    return 'ARMY MERGE SUCCESS';
                })
                .catch(function (err) {
                    console.warn('Something went wrong with army merge.', err);
                });
                //console.log('Army Merge Request Complete');

                /*
                console.log('Completed planet #', planetcount.toString(), ': ', planetname, '(', planetid, ')');
                console.log('Seconds per 6 clicks: ', ((tmpRunTime - tmpRunCount3) / 1000).toString(), ' seconds');
                console.log('Seconds per 30 clicks: ', ((tmpRunTime - tmpRunCount30) / 1000).toString(), ' seconds');
                console.log('Clicks since start: ', ((planetcount + 1) * 2).toString(), ' clicks');
                console.log('Seconds since start: ', ((tmpRunTime - tmpStartTime) / 1000).toString(), ' seconds');
                */
                planetcount++;

                /*
                var form = document.createElement('form');
                form.name = 'mergeallform1';
                form.method = 'post';
                form.action = url;
                form.target = 'iframeformsubmit1';

                var forminput0 = document.createElement('input');
                forminput0.type = 'hidden';
                forminput0.name = 'merge';
                forminput0.value = 'OK';
                form.appendChild(forminput0);

                var forminput1 = document.createElement('input');
                forminput1.type = 'hidden';
                forminput1.name = 'planetid';
                forminput1.value = planetid;
                form.appendChild(forminput1);

                var forminput2 = document.createElement('input');
                forminput2.type = 'hidden';
                forminput2.name = 'confirm';
                forminput2.value = null;
                form.appendChild(forminput2);

                var forminput3 = document.createElement('input');
                forminput3.type = 'hidden';
                forminput3.name = 'nbarmies';
                forminput3.value = '10';
                form.appendChild(forminput3);

                var forminput4 = document.createElement('input');
                forminput4.type = 'hidden';
                forminput4.name = 'mgt_order_done';
                forminput4.value = null;
                form.appendChild(forminput4);

                document.querySelector('body > center > center > div.banner').append(form);
                form.submit();
                form.parentNode.removeChild(form);
                */

                /*
                let xhr = new XMLHttpRequest();
                xhr.open('POST', url);

                //xhr.setRequestHeader('Accept', 'application/json');
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        console.log('Response:', xhr.responseText);
                    }
                };
                xhr.send();
                */

                /*
                let reqdata = {
                    "merge": "OK",
                    "planetid": planetid,
                    "confirm": "",
                    "nbarmies": 0,
                    "mgt_order_done": ""
                };
                xhr.send(reqdata);
                */
            };
            /*
            console.log('Merged fleet & armies for ', planetcount.toString(), ' planets');
            console.log('Clicks since start: ', ((planetcount + 1) * 2).toString(), ' clicks');
            console.log('Seconds since start: ', ((Date.now() - tmpStartTime) / 1000).toString(), ' seconds');
            console.log('Clicks per second: ',(((planetcount + 1) * 2)/((Date.Now() - tmpStartTime) / 1000)).toString(), ' clicks');
            */
            updatingStatusBar.innerText = 'Complete... ' + visibleplanets.length.toString() + '/' + visibleplanets.length.toString();
        }, false);

        var divinput = document.createElement('div');
        divinput.classList.add('banner');

        var loadingbarspan = document.createElement('span');
        loadingbarspan.id = "tmpLoadingStatus";
        loadingbarspan.classList.add("tmpLoadingStatus");

        var tableinput = document.createElement('table');
        tableinput.width = '600';
        var tbodyinput = document.createElement('tbody');
        var trinput = document.createElement('tr');
        var tdinput = document.createElement('td');
        tdinput.classList.add('hc', 'vc');
        tdinput.width = '100%';

        //divinput.appendChild(iframehidden);
        divinput.appendChild(tableinput);
        tableinput.appendChild(tbodyinput);
        tbodyinput.appendChild(trinput);
        trinput.appendChild(tdinput);
        tdinput.append('Select planet:', inputselectplanet);
        tdinput.append('   ', btnmergeselected);
        tdinput.append(btnmergeselected);
        tdinput.append('\u00A0\u00A0\u00A0'); //&nbsp;
        tdinput.append(btnmergeallvisible);
        tdinput.append('\u00A0\u00A0\u00A0'); //&nbsp;
        tdinput.append(btnmergeall);
        tdinput.append('\u00A0\u00A0\u00A0'); //&nbsp;

        divinput.appendChild(loadingbarspan);

        document.querySelector('body > center > center').append(divinput);
    };
    setBtn();
})();