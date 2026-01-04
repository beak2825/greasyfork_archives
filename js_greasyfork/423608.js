// ==UserScript==
// @name         Youtube old design
// @namespace    4c5725cd7d4b94b6f1784e759d5a43fbdd917971
// @version      0.1
// @description  Activates the old YT design without messing with your other settings
// @author       /u/AyrA_ch
// @match        https://www.youtube.com/*
// @match        http://www.youtube.com/*
// @match        https://youtube.com/*
// @match        http://youtube.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/423608/Youtube%20old%20design.user.js
// @updateURL https://update.greasyfork.org/scripts/423608/Youtube%20old%20design.meta.js
// ==/UserScript==

(function () {
    var getDesignCookie = function (cookie) {
        //Find existing preferences
        var prefs = cookie.split("; ").filter(function (v) {
                return v.indexOf("PREF=") === 0;
            })[0];
        //No preferences, return new ones with design setting
        if (!prefs) {
            console.log("prefs not set in cookie");
            return "PREF=f6=8";
        }
        //Process all settings
        var entries = prefs.substr(5).split('&');
        var set = false;
        for (var i = 0; i < entries.length; i++) {
            if (entries[i].indexOf("f6=") === 0) {
                set = true;
                //Set the old design flag
                var value = +entries[i].substr(3);
                if ((value & 8) === 0) {
                    console.log("Activating old design and reloading...");
                    entries[i] = "f6=" + (value | 8);
                    window.setTimeout(location.reload.bind(location,true),100);
                }
                else{
                    console.log("Old design already active. Doing nothing");
                }
            }
        }
        //Design flag setting doesn't exists. Adding it instead
        if (!set) {
            console.log("Activating old design and reloading...");
            entries.push("f6=8");
            window.setTimeout(location.reload.bind(location,true),100);
        }
        //Build cookie
        return "PREF=" + entries.join('&');
    };
    //Update cookie
    document.cookie = getDesignCookie(document.cookie) + ";domain=.youtube.com;path=/";
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