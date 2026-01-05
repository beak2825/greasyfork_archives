// ==UserScript==
// @name       Remove draft button on Absalon
// @namespace  http://mathemaniac.org
// @version    1.0.1
// @description  Removes "Save as draft" button on assignments on Absalon.
// @match      https://absalon.itslearning.com/essay/answer_essay.aspx*
// @copyright  2014, Sebastian Paaske Tørholm
// @require    https://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/4573/Remove%20draft%20button%20on%20Absalon.user.js
// @updateURL https://update.greasyfork.org/scripts/4573/Remove%20draft%20button%20on%20Absalon.meta.js
// ==/UserScript==

$('input[value="Save as draft"], input[value="Gem som kladde"]').remove();
