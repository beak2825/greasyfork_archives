// ==UserScript==
// @name           Keep Autoaccept Box Checked
// @include        https://www.mturk.com/mturk/*
// @exclude        https://www.mturk.com/mturk/previewandaccept?groupId=3SI493PTSWRNV2K9KNV25SFBTCTDZ4 
// @exclude        https://www.mturk.com/mturk/previewandaccept?groupId=3DXFGU9SKN2U70BZQM3ZWZUTL7VXEP*
// @exclude        https://www.mturk.com/mturk/previewandaccept?groupId=30B721SJLR5BYYBNQJ0CVKJEQOZ0OB
// @exclude        https://www.mturk.com/mturk/previewandaccept?groupId=3EM4DVSA8U8J6KF08Q5EM8I2NYE308
// @exclude        https://www.mturk.com/mturk/previewandaccept?groupId=36FIWAXJH5545834T2EBIPRHNYVA3P
// @exclude        https://www.mturk.com/mturk/previewandaccept?groupId=3EGG3WLVA0K75BCSXC8U46W9L5PIXX
// @version 1.1
// @namespace x
// @description x
// @downloadURL https://update.greasyfork.org/scripts/2545/Keep%20Autoaccept%20Box%20Checked.user.js
// @updateURL https://update.greasyfork.org/scripts/2545/Keep%20Autoaccept%20Box%20Checked.meta.js
// ==/UserScript==

var checkboxes = document.getElementsByName('autoAcceptEnabled');

for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked=true;
}