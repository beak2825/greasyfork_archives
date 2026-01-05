/**
 * Collection of reusable functions for userscripts for pokec.sk
 *
 * Author:
 * Version: 1.0
 * Date: 2017-January-13
 * License: MIT
 */

var PokecUtils = (function (doc) {
	"use strict";

	var userName = "";

	return {
		/**
		 * Returns name of logged user
		 *
		 * @return
		 *   name of logged user
		 */
		getUserName: function() {
			if (!userName) {
				userName = doc.getElementById("nickBull").innerHTML;
			}
			return userName;
		}
	};

}(document));
