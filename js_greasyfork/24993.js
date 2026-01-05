// ==UserScript==
// @name        GTAForums: GTA Mods on top of the sidebar
// @namespace   ntauthority.me
// @include     http://gtaforums.com/*
// @version     3
// @run-at      document-start
// @grant       none
// @require     https://greasyfork.org/scripts/12228/code/setMutationHandler.js
// @description moves the 'GTA Mods' section to the top of the sidebar on GTAForums
// @downloadURL https://update.greasyfork.org/scripts/24993/GTAForums%3A%20GTA%20Mods%20on%20top%20of%20the%20sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/24993/GTAForums%3A%20GTA%20Mods%20on%20top%20of%20the%20sidebar.meta.js
// ==/UserScript==
setMutationHandler(document, '#gtaf_leftNav + div', function(nodes)
{
  this.disconnect();
  const obj = jQuery('#gtaf_leftNav_inner li');
  const values = Object.keys(obj).map(k => obj[k]);
  const i = values.findIndex(a => jQuery(a).text() == 'GTA Mods');

  jQuery('<li><br/></li>').appendTo('#gtaf_leftNav_inner ul');
  
  values.map((a, idx) => [a, idx])
        .filter(a => a[1] <= i)
        .forEach(a => {
            if (a[1] < i)
            {
                jQuery(a[0]).appendTo('#gtaf_leftNav_inner ul');
            }
            else if (a[1] == i)
            {
                jQuery(a[0]).find('br').remove();
            }
        });
});