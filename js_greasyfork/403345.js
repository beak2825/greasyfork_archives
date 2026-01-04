// ==UserScript==
// @name        Pi-hole+
// @namespace   V@no
// @author      V@no
// @description Set your own timezone
// @license     MIT
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABllpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjAtMDUtMTRUMTU6MjY6MzktMDQ6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIwLTA1LTE0VDE1OjQzOjMwLTA0OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTA1LTE0VDE1OjQzOjMwLTA0OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkhpc3Rvcnk9IjIwMjAtMDUtMTRUMTU6MjY6NTEtMDQ6MDAmI3g5O0ZpbGUgVm9ydGV4MzIucG5nIG9wZW5lZCYjeEE7MjAyMC0wNS0xNFQxNTozMTozOS0wNDowMCYjeDk7RmlsZSBDOlxVc2Vyc1xWYW5vXEFwcERhdGFcUm9hbWluZ1xBZG9iZVxBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOVxBdXRvUmVjb3ZlclxfVm9ydGV4MzI1OThBMzBFNjMxNDMzNjZDMTcxMUEyMjNEQzU5NTYxQy5wc2Igc2F2ZWQmI3hBOzIwMjAtMDUtMTRUMTU6MzY6MjctMDQ6MDAmI3g5O0ZpbGUgQzpcVXNlcnNcVmFub1xBcHBEYXRhXFJvYW1pbmdcQWRvYmVcQWRvYmUgUGhvdG9zaG9wIENDIDIwMTlcQXV0b1JlY292ZXJcX1ZvcnRleDMyNTk4QTMwRTYzMTQzMzY2QzE3MTFBMjIzREM1OTU2MUMucHNiIHNhdmVkJiN4QTsyMDIwLTA1LTE0VDE1OjQxOjE1LTA0OjAwJiN4OTtGaWxlIEM6XFVzZXJzXFZhbm9cQXBwRGF0YVxSb2FtaW5nXEFkb2JlXEFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5XEF1dG9SZWNvdmVyXF9Wb3J0ZXgzMjU5OEEzMEU2MzE0MzM2NkMxNzExQTIyM0RDNTk1NjFDLnBzYiBzYXZlZCYjeEE7IiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjMwNzZERjlDOTYxQjExRUE4MkFGQzA3QkFCRTAzNUY4IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjMwNzZERjlEOTYxQjExRUE4MkFGQzA3QkFCRTAzNUY4Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MzA3NkRGOUE5NjFCMTFFQTgyQUZDMDdCQUJFMDM1RjgiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MzA3NkRGOUI5NjFCMTFFQTgyQUZDMDdCQUJFMDM1RjgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7pid69AAAES0lEQVR42rRWbUxbVRh+ziktAYa4OU2Mi1n2gxk008TgkhFFa1xQQvxI2Mjm2kXE7Y+J/pjOTSOJv0hM/KMM5mBAItXp4leMmgyUscRgMnRq+LGZ0ShahLKBVUbXyz0+p71ll+a2u4V6krf39Hw9z/u+533PK5RSyGxCCKymVQxXrFVQu8Si8Iu4uJvf9dKQT0UbooOZa4tQyHYCnjWb1hwyDfOAMEQ5tG6WLoY0wk5bCkfgd5SUXS77BAlst41eoZRQZufK5n5z2iZdHa5QIxPyhJyXbd45731OS0piJZ1clwY3KZcscL3/SzwEY+UEAO3TRn5fMoU54p3xhrTG6cniC8XbBcQe62+ccoGybgnEI7uzHeyWwPeWVpZCqsnn851kJ+lhocRrNpMPUzbb9g7M1M2cWh0BgSmChJZ7RT3qm/DtKg2X3sr5Gg2uhDrGr//aNhEpMov25DrarQVges0XLdPaiR00lPEge1cZzi8TMGg780/26qN10UhBCBBs2jTN+9n7zDZ6F0E1gWbmjjqa5QZtHFonZMConq2d/eG6x64kEXmj3momlx3iqtjKeD+zML/QWipKdQiOeJQnFLsndt4xmBywVpQHzq1PTG3iecVAjH+3UF4B5ptJO5L3YZpVpuRq3wENDIdJlTT1MolRHs8bKx8CRzzYvQCcdQBPS4Ky838h0OFBoE8ikgPcTmKHWwKuooCa7+UNP34T8JeL5fpe9ZPE027Ovi4Bat4sFLr02svuL62H0kMSATdsc2neQs070kT/ASr5opzmpgewcSNQW5taODQEhJe9tnGCX2FUdPHr4fd43gQ0ODXvvPaip1LA5xLfPmniRoJvEb29Kd8Gg5pAnNHx8YjEv78Aj7B/Ow+PVSo8G1b4m3RPunYBUbcSvD0DPNmmUhesGoHAR0uDjY1f8Pe2oxJTPzEravBkEQKUjwlsG5DoGgC2ub8DAoecrFNOs1cGgndER0ePwO+/d2mivr4qdvHi65sDwef1msyWYJU2KfCq61Tc6REz9vc83QgOf09vzks1uDeI8329TprOtiyqtW6jwIcCN7ql2LULeG1/dhqPnB5Kajg9OtpNy43bEsx45MxwSM/pNVnces61Cz4tEjuZ7N+z4jmzPvxmn8LDGBtrF1VV+5NDExNvfbhhw8FLkoUacIsjkMDu5wzV78oCTyzigzuBNxgCfyyzjMLXTQpfsfsj2tr2L00cPvwCC8Z23tq+LB7o2reI/rzqAY5K+q1jGqiJCURvViipSD29KV86JCIWhO/zvWjKOK5n0kRzK6+BI1augkSlLPQu5RmXdy3RIzHOsrgy5XZ0R0y0tFoFrROWzF2FJTe2WCTcNO86Zj2L/DE7+KoKEm0JylEXT7EKSYQ7JN5WDll0VfWAPpDyTi7wReDXbOAFqYgsEm9mIRA/K3EgG3hBCNiIPEY5RZnTwkdnkPHasJL68z8BBgAaaq0RvyK2tgAAAABJRU5ErkJggg==
// @include     http://pi.hole/*
// @include     https://pi.hole/*
// @require     https://greasyfork.org/scripts/403344-moment-js-v2-25-3/code/Momentjs%20v2253.js?version=805187
// @require     https://greasyfork.org/scripts/403343-moment-timezone/code/Moment%20Timezone.js?version=805186
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/403345/Pi-hole%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/403345/Pi-hole%2B.meta.js
// ==/UserScript==
!function()
{
	'use strict';

	let log = console.log,
			timeZone = localStorage.getItem("timeZone") || "",
			settings = $("#api").find(".box-body > .row > div > h4").last(),
			_unix;

	if ("moment" in window)
	{
		_unix = window.moment.unix;
//a hack that hijacks moment.unix() function
		window.moment.unix = function(f)
		{
			let t = moment.unix.apply(moment.unix, arguments),
					r = t.tz(timeZone);

			return t || r;
		}
	}
//add new setting
	if (settings.length)
	{
		$('<h4>Timezone</h4><div class="form-group"><div class="dropdown"><select id="timezone"><option value="">Default</option></select></div></div>')
		.insertBefore(settings)
		.find("#timezone")
		.each(function()
		{
			let that = this,
					options = moment.tz.names()
										.reduce(function(o, tz)
										{
											o[o.length] = {
												name: tz,
												offset: moment.tz(tz).utcOffset()
											};

											return o;
										}, [])
										.sort(function (a, b)
										{
											return a.offset - b.offset
										})
										.reduce(function (o, tz)
										{
											return o += '<option value="' + tz.name + '">(GMT' + (tz.offset ? moment.tz(tz.name).format('Z') : '') + ') ' + tz.name + '</option>';
										}, "");

			this.innerHTML += options;
			this.value = timeZone;
			$(this).closest("form").on("submit", function(e)
			{
				timeZone = that.value;
				if (timeZone)
					localStorage.setItem("timeZone", that.value);
				else
					localStorage.removeItem("timeZone");
			});
		});
	};
}()