// ==UserScript==
// @name         Add long signture to every post...
// @version      0.1
// @description  Why not...
// @author       Knaper Yaden
// @match        *.ivelt.com/*
// @exclude      *.ivelt.com/forum/ucp.php?i=pm*
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @namespace https://greasyfork.org/users/473330
// @downloadURL https://update.greasyfork.org/scripts/407144/Add%20long%20signture%20to%20every%20post.user.js
// @updateURL https://update.greasyfork.org/scripts/407144/Add%20long%20signture%20to%20every%20post.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var oldText = $.trim($("#message").val());
    $('#message').val(oldText+'\n\n-------------------\n[quote]ועל כן הנברא הזה, העומד בשיקול בין השלמויות והחסרונות, שהם תולדות ההארה וההסתר, בהתחזקו בשלמויות והקנותם אותם בעצמו, הנה הוא אוחז בו יתברך שהוא השורש והמקור להם. וכפי מה שירבה בשלמויות – כך הוא מרבה האחיזה וההתדבקות בו, עד שבהגיעו אל תכלית קניית השלמות, הנה הוא מגיע אל תכלית האחיזה וההתדבקות בו יתברך, ונמצא מתדבק בו יתברך, ונהנה בטובו ומשתלם בו, והוא עצמו בעל טובו ושלמותו[/quote]');
})();