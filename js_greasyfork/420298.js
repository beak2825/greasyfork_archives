// ==UserScript==
// @name         Old KYM Layout
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  Old KYM layout even when not signed in. Adapted from: https://cable.ayra.ch/tampermonkey/view.php?script=imgur_old_design.user.js
// @author       supermansaveslives
// @match        https://knowyourmeme.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420298/Old%20KYM%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/420298/Old%20KYM%20Layout.meta.js
// ==/UserScript==

(function () {
	'use strict';
	//Extract all cookies
	var cookies = document.cookie.split("; ").map(function (v) {
			var eq = v.indexOf('=');
			return {
				name: v.substr(0, eq),
				value: decodeURIComponent(v.substr(eq + 1))
			};
		});

    //Get frontpage cookie
    var fp = cookies.filter(function (v) {
        return v.name === "x_disabled_refresh_prod"
    })[0];
    //Create cookie if needed
    if (fp === undefined) {
        document.cookie = "x_disabled_refresh_prod=just_a_cookie;path=/";
        if (window.stop) {
			window.stop();
		}
		location.reload();
    }
})();

/*
LICENSE:
This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
The full license text can be found here: http://creativecommons.org/licenses/by-nc-sa/4.0/
The link has an easy to understand version of the license and the full license text.

DISCLAIMER:
THIS SOFTWARE IS PROVIDED "AS IS" AND ANY EXPRESSED OR IMPLIED WARRANTIES,
INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS
OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF
THE POSSIBILITY OF SUCH DAMAGE.
*/