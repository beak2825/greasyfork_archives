// ==UserScript==
// @name         brutal.io! Thick Crosshair cool
// @version      0.4
// @description  A cool lookin cross hair, yeah ITS accually working Serious BELEIVE ME!
// @author       enigMyth_Thunder a.k.a Dr_MYTH
// @include      http://brutal.io/
// @namespace https://greasyfork.org/users/158176
// @downloadURL https://update.greasyfork.org/scripts/374596/brutalio%21%20Thick%20Crosshair%20cool.user.js
// @updateURL https://update.greasyfork.org/scripts/374596/brutalio%21%20Thick%20Crosshair%20cool.meta.js
// ==/UserScript==
document.getElementById("canvas").style.cursor="url";
window.addEvent('domready',function() {
	var container = $(document.body),
		speed = 1200;
	container.addEvent('mousemove',function(e) {
		var image = new Element('img',{
			src: 'pointer.png',
			styles: {
				position: 'absolute',
				top: e.page.y,
				left: e.page.x
			},
			tween: {
				duration: speed,
				onComplete: function() {
					image.dispose();
				}
			}
		}).inject(container,'top').fade('out');
	});
});