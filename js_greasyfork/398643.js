// ==UserScript==
// @name        RED Official Top 10 Users
// @match       https://redacted.ch/top10.php?type=users
// @version     1.0
// @author      donkey
// @description Adds a Top 10 Users Overall section to the top10 users page.
// @namespace https://greasyfork.org/users/162296
// @downloadURL https://update.greasyfork.org/scripts/398643/RED%20Official%20Top%2010%20Users.user.js
// @updateURL https://update.greasyfork.org/scripts/398643/RED%20Official%20Top%2010%20Users.meta.js
// ==/UserScript==


(() => {
  'use strict';

  const nodes = document.getElementsByClassName("header")[0];
  
  nodes.insertAdjacentHTML("afterend", `
                <h3>Top 10 Users Overall</h3>
        <table class="border">
            <tbody><tr class="colhead">
                <td class="center">Rank</td>
                <td>User</td>
                <td style="text-align: right;">Uploaded</td>
                <td style="text-align: right;">UL speed</td>
                <td style="text-align: right;">Downloaded</td>
                <td style="text-align: right;">DL speed</td>
                <td style="text-align: right;">Uploads</td>
                <td style="text-align: right;">Ratio</td>
                <td style="text-align: right;">Joined</td>
            </tr>
                <tr class="rowa">
                    <td class="center">1</td>
                    <td><a href="user.php?id=2577">donkey</a></td>
                    <td class="number_column"><em>Private</em></td>
                    <td class="number_column tooltip" title="">-</td>
                    <td class="number_column"><em>Private</em></td>
                    <td class="number_column tooltip" title="">-</td>
                    <td class="number_column"><em>Private</em></td>
                    <td class="number_column"><span class="tooltip r10" title="">O.K.</span></td>
                    <td class="number_column"><span class="time tooltip" title="">About 3 years ago</span></td>
                </tr>
                <tr class="rowb">
                    <td class="center">2</td>
                    <td><a href="user.php?id=3795">beats</a></td>
                    <td class="number_column"><em>Private</em></td>
                    <td class="number_column tooltip" title="">-</td>
                    <td class="number_column"><em>Private</em></td>
                    <td class="number_column tooltip" title="">-</td>
                    <td class="number_column">312</td>
                    <td class="number_column"><span class="tooltip r04" title="">Poor</span></td>
                    <td class="number_column"><span class="time tooltip" title="">About 3 years ago</span></td>
                </tr>
                <tr class="rowa">
                    <td class="center">3</td>
                    <td><a href="user.php?id=9145">vinman</a></td>
                    <td class="number_column"><em>Private</em></td>
                    <td class="number_column tooltip" title="">-</td>
                    <td class="number_column"><em>Private</em></td>
                    <td class="number_column tooltip" title="">-</td>
                    <td class="number_column"><em>Private</em></td>
                    <td class="number_column"><span class="tooltip r10" title="">O.K.</span></td>
                    <td class="number_column"><span class="time tooltip" title="">About 3 years ago</span></td>
                </tr>
                <tr class="rowb">
                    <td class="center">4</td>
                    <td><a href="user.php?id=1">zed</a></td>
                    <td class="number_column"><em>Private</em></td>
                    <td class="number_column tooltip" title="">-</td>
                    <td class="number_column"><em>Private</em></td>
                    <td class="number_column tooltip" title="">-</td>
                    <td class="number_column"><em>Private</em></td>
                    <td class="number_column"><span class="tooltip r10" title="">O.K.</span></td>
                    <td class="number_column"><span class="time tooltip" title="">About 3 years ago</span></td>
                </tr>
                <tr class="rowa">
                    <td class="center">5</td>
                    <td><a href="user.php?id=38366">StarLord</a></td>
                    <td class="number_column"><em>Private</em></td>
                    <td class="number_column tooltip" title="">-</td>
                    <td class="number_column"><em>Private</em></td>
                    <td class="number_column tooltip" title="">-</td>
                    <td class="number_column"><em>Private</em></td>
                    <td class="number_column"><span class="tooltip r10" title="">O.K.</span></td>
                    <td class="number_column"><span class="time tooltip" title="">Roughly 1½ years ago</span></td>
                </tr>
                <tr class="rowb">
                    <td class="center">6</td>
                    <td><a href="user.php?id=38">Neo</a></td>
                    <td class="number_column"><em>Private</em></td>
                    <td class="number_column tooltip" title="">-</td>
                    <td class="number_column"><em>Private</em></td>
                    <td class="number_column tooltip" title="">-</td>
                    <td class="number_column"><em>Private</em></td>
                    <td class="number_column"><span class="tooltip r10" title="">O.K.</span></td>
                    <td class="number_column"><span class="time tooltip" title="">About 3 years ago</span></td>
                </tr>
                <tr class="rowa">
                    <td class="center">7</td>
                    <td><a href="user.php?id=1225">mrpoot</a></td>
                    <td class="number_column"><em>Private</em></td>
                    <td class="number_column tooltip" title="">-</td>
                    <td class="number_column"><em>Private</em></td>
                    <td class="number_column tooltip" title="">-</td>
                    <td class="number_column">629</td>
                    <td class="number_column"><span class="tooltip r10" title="">O.K.</span></td>
                    <td class="number_column"><span class="time tooltip" title="">About 3 years ago</span></td>
                </tr>
                <tr class="rowb">
                    <td class="center">8</td>
                    <td><a href="user.php?id=11642">puff</a></td>
                    <td class="number_column"><em>Private</em></td>
                    <td class="number_column tooltip" title="">-</td>
                    <td class="number_column"><em>Private</em></td>
                    <td class="number_column tooltip" title="">-</td>
                    <td class="number_column"><em>Private</em></td>
                    <td class="number_column"><span class="tooltip r10" title="">O.K.</span></td>
                    <td class="number_column"><span class="time tooltip" title="">About 3 years ago</span></td>
                </tr>
                <tr class="rowa">
                    <td class="center">9</td>
                    <td><a href="user.php?id=5340">DeepseaTorpedo</a></td>
                    <td class="number_column"><em>Private</em></td>
                    <td class="number_column tooltip" title="">-</td>
                    <td class="number_column"><em>Private</em></td>
                    <td class="number_column tooltip" title="">-</td>
                    <td class="number_column">53</td>
                    <td class="number_column"><span class="tooltip r10" title="">O.K.</span></td>
                    <td class="number_column"><span class="time tooltip" title="">About 3 years ago</span></td>
                </tr>
                <tr class="rowb">
                    <td class="center">10</td>
                    <td><a href="user.php?id=6998">LaserLight</a></td>
                    <td class="number_column"><em>Private</em></td>
                    <td class="number_column tooltip" title="">-</td>
                    <td class="number_column"><em>Private</em></td>
                    <td class="number_column tooltip" title="">-</td>
                    <td class="number_column">Over 10,000</td>
                    <td class="number_column"><span class="tooltip r10" title="">O.K.</span></td>
                    <td class="number_column"><span class="time tooltip" title="">About 3 years ago</span></td>
                </tr>
                    </tbody></table><br />`);

  
})();