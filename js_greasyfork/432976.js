// ==UserScript==
// @name         Reddit Old Layout
// @namespace    9bf36c681d35d52913b3bda74ddf6127318ed7b0
// @version      0.1
// @description  Forces usage of the old reddit version
// @author       Joy
// @match        https://www.reddit.com/*
// @match        https://reddit.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/432976/Reddit%20Old%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/432976/Reddit%20Old%20Layout.meta.js
// ==/UserScript==

(function () {
	'use strict';
	top.location.hostname = "old.reddit.com";
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