// ==UserScript==
// @name           PassTheHeadphones :: Extended Main Menu (2016 Version)
// @description    Insert logchecker, better and WhatIMG link in the main menu
// @namespace      https://greasyfork.org/en/scripts/25608-passtheheadphones-extended-main-menu-2016-version
// @icon           data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANuSURBVFhH7ddLSFRRGAdwNZ0hrEVlpkXRKErp5CIDXdgsIokoooVBiWCBFEhhJEhusrdEPtoFpRG20EVNmWnM9FLCfFuipfkoiwwfvQSjN//+5+C5zJ2udjV3+YcfDud+57vfcO7MoM8UEkKpVESt9I4wboSa6DwlUxDNWGLISepmZt2gOPqnXCDZ0Gq1YvPmJOTlFaG6uhl9fcMYHf2FT59+ord3CPfuNSA39zwSE7fLWrWPimnKmU/iHcDf3x/Jyel4/vwtPnz4bkpPzyDS0jI9B7lNC8h0bhJCQkJRXl6D4eEvUnNzDzIzTyEhYQtCQ5fK4SwWKxYvDkZs7Hrs25eF+/dbtHq3uxHLl69UQ7gpgP4a8ZDxBstQV9eJgYExdHUNISVlv7yhuPY3Dsd2OazYK/7abGHqWglNmkRCQIAFTmcN+vtHUVvbhcjI1bobmBEUFKz1cLtbEBgYqK7tognjIuzdm43u7vec/iUiIqJ1jadi4cJFuHv3ieyVlZWv1h+QYTYRz3MJb/wKHR1D2Lhxp67hdKxZE4f29kG0tQ1gxQrtKFLoj5QSUlMPo6V1AEVFVfD19dU1m64TJ4plz4OZZ9VaBekyh+Dn58dza+TD9xrx8Vt1Tf5FVFSs7OlydfBTY1Hrc0lLLPG87aiueYHyiiemn3izLpdUy952u0OtiSPXkkH8FtsN151uZGQU6jbPhD17jsreSUmH1NpJ0iLPP/1AASoqO+HYkKLb7M1CudRLfeOvxZpRrbJu3TbZOyv7glqrIi1thNwzTly73o7IVWt1m72dpvdejpBRrWKzRcnehYWVaq2btMif1ri4HSxcpdtoRLxz7wHEmlGtJ9E7PkH7aH8mLT9JVzyZ6Q5gQItcsNmikXO8DJVVz9DU9IY/sx8xMvLVe5PhEeSQd93YGOR+0aeu/jXyCq8jPNzuWaPlCyHn2FWUlj3GbVfXpAOoh1A8gJM9hJ4DNLCf6FtQUKWufyUtcvFicb2pAcwyGkD096jRIhdmB5gdYHaA/3qAHjL9TWiW0QAe34T9pOUSISwsGkeOluLmracTDeCgs1RLg/RtnHgt1sQ1USPrPQeofdSP/HwnwiNiVK8rpMVKLaQuGnlIZiNqjXoo4r/refRHzlEz/SDPDaKhncxG1HoPIXqK3uIe4/Hx+Q0impMgs6o5SwAAAABJRU5ErkJggg==
// @include        /https?:\/\/passtheheadphones\.me\/.*/
// @require        https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @grant          GM_getValue
// @version        1.0.6

// @namespace https://greasyfork.org/users/2290
// @downloadURL https://update.greasyfork.org/scripts/25608/PassTheHeadphones%20%3A%3A%20Extended%20Main%20Menu%20%282016%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/25608/PassTheHeadphones%20%3A%3A%20Extended%20Main%20Menu%20%282016%20Version%29.meta.js
// ==/UserScript==

var target = document.getElementById('nav_upload');

// Add PTPimg link
$("#nav_upload").after('<li id="nav_ptpimg" class="brackets"><a href="https://ptpimg.me/" target="_blank">PTPimg</a></li>');

// Add YADG link
$("#nav_ptpimg").after('<li id="nav_yadg" class="brackets"><a href="https://yadg.cc/" target="_blank">YADG</a></li>');

// Add GZNM link
$("#nav_yadg").after('<li id="nav_gznm" class="brackets"><a href="http://gznm.headfucking.net/" target="_blank">GZNM</a></li>');

// Add Logchecker link
$("#nav_gznm").after('<li id="nav_logchecker" class="brackets"><a href="logchecker.php">Logchecker</a></li>');

// Add Sessions link
$("#nav_useredit").after('<li id="nav_sessions" class="brackets"><a href="user.php?action=sessions">Sessions</a></li>');

// Add Site log link
$("#nav_sessions").after('<li id="nav_log" class="brackets"><a href="log.php">Site log</a></li>');

// Add Change log link
$("#nav_log").after('<li id="nav_changelog" class="brackets"><a href="tools.php?action=change_log">Change log</a></li>');

// Add Subscribed collages link
$("#nav_notifications").after('<li id="nav_subscribedcollages" class="brackets"><a href="userhistory.php?action=subscribed_collages">Collages</a></li>');

// Add Quotes link
$("#nav_comments").after('<li id="nav_subscribedcollages" class="brackets"><a href="userhistory.php?action=quote_notifications&showall=1">Quotes</a></li>');

// Upload comments
$("#nav_uploaded").after('<li id="nav_uploadcomments"><a href="comments.php?action=torrents&type=uploaded">(comments)</a></li>');

// Collage comments
$("#nav_requests").before('<li id="nav_collagecomments"><a href="comments.php?action=collages&type=contributed">(comments)</a></li>');

// Request comments
$("#nav_forums").before('<li id="nav_requestcomments"><a href="comments.php?action=requests&type=voted">(comments)</a></li>');