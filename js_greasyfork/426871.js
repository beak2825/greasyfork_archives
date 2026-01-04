// ==UserScript==
// @name         CLE Login Helper
// @namespace    https://ciffelia.com/
// @version      3.0.0
// @description  Automatically click login button on CLE.
// @author       Ciffelia <mc.prince.0203@gmail.com> (https://ciffelia.com/)
// @match        https://www.cle.osaka-u.ac.jp/?new_loc=%2Fultra%2Fstream
// @downloadURL https://update.greasyfork.org/scripts/426871/CLE%20Login%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/426871/CLE%20Login%20Helper.meta.js
// ==/UserScript==

(() => {
  document.getElementById('loginsaml').click()
})()
