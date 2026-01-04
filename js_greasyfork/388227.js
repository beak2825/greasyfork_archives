// ==UserScript==
// @name         RED release description templates
// @namespace    https://greasyfork.org/cs/users/321857-anakunda
// @version      1.01
// @description  A tiny template for DSD/vinyl
// @author       Anakunda
// @match        https://redacted.ch/upload.php*
// @match        https://notwhat.cd/upload.php*
// @match        https://orpheus.network/upload.php*
// @downloadURL https://update.greasyfork.org/scripts/388227/RED%20release%20description%20templates.user.js
// @updateURL https://update.greasyfork.org/scripts/388227/RED%20release%20description%20templates.meta.js
// ==/UserScript==

'use strict';

var child, preview = document.getElementsByClassName('button_preview_1');
if (preview == null) return;
child = document.createElement('input');
child.id = 'insert-dsd-template';
child.value = 'Insert DSD template';
child.type = 'button';
child.addEventListener("click", insert_template, false);
preview[0].parentNode.appendChild(child);
child = document.createElement('input');
child.id = 'insert-vinyl-template';
child.value = 'Insert Vinyl template';
child.type = 'button';
child.addEventListener("click", insert_template, false);
preview[0].parentNode.appendChild(child);

function insert_template() {
  var ref = document.getElementById('release_desc');
  if (ref == null) return;
  var val;
  switch (this.id) {
	case 'insert-dsd-template':
	  val = `88.2kHz from DSD64 using foobar2000\'s SACD decoder (direct-fp64)
Output gain +0dB

[hide=DR][pre][/pre][/hide]`;
	  break;
	case 'insert-vinyl-template':
	  val = `kHz vinyl rip by [color=blue]AUTHOR[/color]';
[u]Lineage:[/u]

[hide=DR][pre][/pre]
[img][/img]
[img][/img]
[img][/img][/hide]`;
	  break;
  }
  if (ref.textLength > 0) val += '\n\n';
  ref.value = val + ref.value;
}
