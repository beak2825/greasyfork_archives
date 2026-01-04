// ==UserScript==
// @name         Google Searchlight
// @description  Uncovers and displays hidden search results that Google has obscured in response to complaints.
// @version      1.0
// @license      GNU General Public License
// @icon         https://github.com/Gamby-1791/GoogleSearchlight/raw/main/lighthouse.png
// @include      *://www.google.*/*
// @grant        GM_xmlhttpRequest
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @noframes
// @namespace https://greasyfork.org/users/1231264
// @downloadURL https://update.greasyfork.org/scripts/482225/Google%20Searchlight.user.js
// @updateURL https://update.greasyfork.org/scripts/482225/Google%20Searchlight.meta.js
// ==/UserScript==

// Copyright (C) 2023
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.

$(function () {
    if (window.location.href.indexOf('//www.google') === -1) return;

    $('#search div.g').last().after(`
    <div id="cc">
       <div id="cc_loading" style="display: inline-flex;align-items: center;"></div>
       <h2 id="cc_timeouts" style="color:orange"></h2>
       <h2 id="cc_errors" style="color:red"></h2>
    </div>
    `)
    const s = $('#cc')
    const loadingElement = $('#cc_loading')
    const timeoutsElement = $('#cc_timeouts')
    const errorsElement = $('#cc_errors')

    let firstRun = true
    let totalFetchs = 0
    $('div i > a').each((i, a) => {
        if (a.href === 'https://www.google.com/support/answer/1386831') return;

        totalFetchs++

        // Give a loading feedback to user
        firstRun && loadingElement.prepend(`
           <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
           width="40px" height="40px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
              <path fill="#4285f4" d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z">
                 <animateTransform attributeType="xml"
                    attributeName="transform"
                    type="rotate"
                    from="0 25 25"
                    to="360 25 25"
                    dur="0.6s"
                    repeatCount="indefinite"
                 />
              </path>
           </svg>
           <h2>Loading uncensored links...</h2>
        `)

        firstRun = false

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: a.href,
                timeout: 30000, // Time is in milliseconds. For slower connections, consider increasing this value or simply disable this line by commenting it out.
                onload: (response) => {
                    if (response.status === 429) {
                        console.error('ERROR 429 Too Many Requests')
                        errorsElement.html('ERROR 429 Too Many Requests')
                        reject()
                        return;
                    }
                    let hm = {}
                    const links = response.responseText.matchAll(/class="infringing_url">([^\s-<]+)\s*-\s*([0-9]+)/g)

                    for (const i of links) {
                        if (i[1] in hm) continue;

                        hm[i[1]] = 1
                        let l = $('#l' + i[2])
                        if (l.length < 1) {
                            s.prepend(`<div id="l${i[2]}" data-num="${i[2]}"></div>`)
                            l = $('#l' + i[2])
                        }
                        l.append(`
                        <div class="g">
                           <a href="http://${i[1]}" target="_blank">${i[1]} (${i[2]} URLs)</a>
                        </div>
                        `)
                    }
                    const divs = $('div[data-num]', s)
                    divs.sort((a, b) => b.dataset.num - a.dataset.num)
                    s.append(divs)
                    resolve()
                },
                onerror: (err) => {
                    console.error('Request Error!\n', err.error)
                    if(!$.trim(errorsElement.html())) errorsElement.append('Error on some requests');
                    reject()
                },
                ontimeout: () => {
                    console.warn(`[${i}] Request timeout`)
                    if(!$.trim(timeoutsElement.html())) timeoutsElement.append('Request timeouts:');
                    timeoutsElement.append(' ' + i)
                    reject()
                }
            })
        })
        // Cleanup
          .finally(() => {
            totalFetchs--

            if (totalFetchs > 0) return;
            loadingElement.remove()
        })
        // Promise error when rejected, ignore
        .catch(e => {})
    })
})
