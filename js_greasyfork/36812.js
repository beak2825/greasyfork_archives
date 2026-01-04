// ==UserScript==
// @name         'Dashboard Modifier
// @namespace    https://greasyfork.org/en/users/155391
// @version      1
// @description  Add GIFs to Dashboard
// @author       LLL
// @include      https://worker.mturk.com/dashboard*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36812/%27Dashboard%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/36812/%27Dashboard%20Modifier.meta.js
// ==/UserScript==

document.querySelector("#dashboard-hits-overview div.row").insertAdjacentHTML("beforebegin", `
<div class="row m-b-sm">
    <div class="col-xs-7">
        <strong>Projected Earnings: </strong>
        <strong>Stay Focused<strong>
            </div>
    <div class="col-small-3 text-small-right"><br/><img width="50%" src="https://thumbs.gfycat.com/EvilImpartialHart-max-1mb.gif"></div>
</div>`);
document.querySelector("#dashboard-available-earnings div.row").insertAdjacentHTML("beforebegin", `
<div class="row m-b-sm">
    <div class="col-xs-7">
        <strong>Your Monies: $$$$ </strong>
            </div>
    <div class="col-xs-5 text-xs-left">GET IT MOVING or<br/><img width="100%" src="http://media3.giphy.com/media/yyp58Yx3Qk0TK/giphy.gif"></div>
</div>`);
document.querySelector("#dashboard-todays-activity div.row").insertAdjacentHTML("beforebegin", `
<div class="row">
    <div class="col-xs-12">
        <strong>Your Monies: $$$$ </strong>
            </div>
    <div class="col-small-5 text-small-right">I THINK I NEED A BETTER DUTY!!!<br/><img width="100%" src="http://78.media.tumblr.com/0af8d792c5f40236faa6e172814eb5f1/tumblr_nuj2a0q5zK1uqe8iio1_250.gif"></div>
</div>`);
