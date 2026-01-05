// ==UserScript==
// @name        Difference Points *OLD*
// @namespace   arreloco
// @description Different point style
// @include     http://www.kongregate.com/accounts/*
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/17796/Difference%20Points%20%2AOLD%2A.user.js
// @updateURL https://update.greasyfork.org/scripts/17796/Difference%20Points%20%2AOLD%2A.meta.js
// ==/UserScript==

script = 'pts = document.getElementsByClassName("user_metric_stat")[1].childNodes[0].childNodes[0].innerHTML;difference = unsafeWindow.active_user._attributes._object.points-parseInt(pts);document.getElementsByClassName("user_metric_stat")[1].childNodes[0].innerHTML+= "<p style=\"color:#900\">("+difference+")</p>";';
document.getElementsByTagName("head")[0].innerHTML += "<script>"+script+"</script>";