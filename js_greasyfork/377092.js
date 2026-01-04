// ==UserScript==
// @name         Bandcamp :: Search Release By Artist/Album Elsewhere
// @namespace    https://greasyfork.org/en/scripts/377092-bandcamp-search-release-by-artist-album-elsewhere
// @version      1.2
// @description  Searches other sites by artistname/albumtitle from Bandcamp release pages.
// @author       newstarshipsmell
// @include      /https?://[^\/]+/(track|album)/.+/
// @include      /https?://[^\/]+\.bandcamp\.com/
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/377092/Bandcamp%20%3A%3A%20Search%20Release%20By%20ArtistAlbum%20Elsewhere.user.js
// @updateURL https://update.greasyfork.org/scripts/377092/Bandcamp%20%3A%3A%20Search%20Release%20By%20ArtistAlbum%20Elsewhere.meta.js
// ==/UserScript==

(function() {
	'use strict';

	/* -------------------------------------------------------------------------------- */

	var stayOnBandcamp = true;
	var boxesPerRow = 6;
	var urls = {
		'red': {
			'name': 'Redacted',
			'icon': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGySURBVDhP3dDPK4NxHAfwJ9RmhpSDmrTToh4lPzPb8qsh2cnPA1k5SEktdnjSTGwpQiRK5ECOHCQ/LuKCSGkbOeAwl5WihFzePp95xmzzD/jUq77P5/l83s8PIUaVkCVyQz5k12SR6MmfFU9mMjIy4XZP4fT0CoHAG3nF8bEXLtckNJos0MwcSeCFyJo1marg8z1QwDREsRAKhZIooNPlQpJc8Hr9qKys4ZCFr5WfKtdotDg/v0d1dT0PxFRUpMfZ2R20Wh1fm8l37Y+MzqG31xG1FMlq7cP4xDKfj0iwUlQqNfb2fEhNTY9aiKRSJWNn1wu1Oo2v04lgFkUD3GPrvwbjSJuMz+H3nMMryC+o4rOFCH15eRUwmn5/eyt5lDXLvRCDoS4U0E+EIaUyCQ2WTvT0DKCszBQV0EK4ZzSWw2aT0NTchcTEJO45OcBhrm3HxqYHHk8AdvtgcDjWJ0iSE37/Cw4Ob+mBVu45OMBpsXRFBcQSHtDY2M294Bv8g4CO7JxirK6dhAdcEA95l/H5IhSwtX0JMbeU56xEoJ8szJNnws0nYiCRxT2+xzM8SztC/CdjGGTv4iGLfwAAAABJRU5ErkJggg==',
			'artist': 'https://redacted.ch/artist.php?artistname=%ARTIST%',
			'album': 'https://redacted.ch/torrents.php?groupname=%ALBUM%',
			'both': 'https://redacted.ch/torrents.php?artistname=%ARTIST%&groupname=%ALBUM%',
			'checked': true
		},
		'ops': {
			'name': 'Orpheus',
			'icon': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJnSURBVDhPrVNJa1pRGH2rQqF0USjpwnU0GquJE9YJtCqiBhpMQF0YHKi4E5xqBTEI0VU3HRRFcGOpEgdqCaHRLtKQFtpmaGrSySYkP6Tnsy+SdJ0Dhwf3O+fe+77vXOZKweFwrvN4vAdcLveJRqOpJBKJXK1We9TtdiOdTsfXbDaV9Xr9Giu/DIFAoOLz+dvT09OnXq/3fblcrlcqlVf/E+tPC4WCkLX9g1AoNMD4m8zBYHAzn893iblc7nUqlVqPxWIby8vLaxfW29lsVj4yi8Xi2yKRaA88mZub24O4T4zH4y/wC5PY9C7QnZ2dPUZ9NxKJvKN6NBpth8PhW4xUKo2AfxQKxXBpaemjz+fb9vv9L0Oh0I3RCYBcLr8JzQbpTCbTgDTEQCDwkFGpVG/VavVPvV5/tLCw8MXhcOwsLi6aWe8YSqXSBt0v0s7Pz++SFmwzBoPhADyknS0WywH41W63T7C+MXDABDggrdlsPtfuMRDvgPtY/KbT6X6AR+Ad1jcGbUo9Iq3RaByQVqvVHjJOp7Ppcrk+4Vo71AeZTDbEv9pZ3xhut9sE7WfSwvyddND3GGoEsEXE9QaYysnMzEyfGsd6GWooxlsjDTKyLZFIjkmHyUUZGgVG1sJoehhR32azjUaKYL2hEabT6UmM8znV8e1ZrdZ91E5R26cIjE6gUCAcrZWVlVFQMpnMGjbrJZPJdQoTrRNx202Yz6ampobg/ZH5HBTPUqn0DFFtUIwvslgsNjwezxaifoZ38gFfNWu7DHoojUbj3urqqr/VasWq1epjJC6PrFTogdFDowfHyq8CDPMXV8ozbLsJQFUAAAAASUVORK5CYII=',
			'artist': 'https://orpheus.network/artist.php?artistname=%ARTIST%',
			'album': 'https://orpheus.network/torrents.php?groupname=%ALBUM%',
			'both': 'https://orpheus.network/torrents.php?artistname=%ARTIST%&groupname=%ALBUM%',
			'checked': false
		},
		'nwcd': {
			'name': 'NotWhat',
			'icon': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFcSURBVDhPjdO7TsJgHAXwryKGcqkXKIIaipcFSYwSC9FJF42JLs6YwOjoe2hIeAd1Mq5gnHgCE+uqPoSTRo/nXyAitMBJfmnz9X++NL0on2i0Tqd0SAkaOwF6JPT4pluSjUdmi3rLvdZoZHbIqyzyNDQndEReZSF3t0i+Oacn8iqLd7og3+jUKpVKeGg2Yds2DMNAs9FAtVqVDVqdGe9omrrkAbVaDc6zg0qlgrNyGS+Og3q9Dr4CcOaqPT0YPT2tPsJTCvGoQjaukDE1ZBIKFs/nIgpyTWY4G25X/mfP0FlkYZmypoK5GkRyJeiuCYtiIfdZ7LuNvhyQe5uBCZYLSSSLKUS2YwgXIu6aXJMZkq9zIDP0uZlOwwqFsFHMI2xHXZNmsFsUXzRLnrnezeVg6Xp7WOv4K4sb8s08vVJ/qeuNUjQ0aboj+YG6xR+6pwUaO/LJHncsycJglPoF6D2MJ8YbAyQAAAAASUVORK5CYII=',
			'artist': 'https://notwhat.cd/artist.php?artistname=%ARTIST%',
			'album': 'https://notwhat.cd/torrents.php?groupname=%ALBUM%',
			'both': 'https://notwhat.cd/torrents.php?artistname=%ARTIST%&groupname=%ALBUM%',
			'checked': false
		},
		'jps': {
			'name': 'JPopsuki',
			'icon': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAMqSURBVDhPbVNNT1NREG3iDzDGuHDj2qVfCJJA3s7EhQujxuhCjDHqSgWsBKNcBUppCy0t9BNrrdIKGsVEgxZjiVWKmlLa109aaKEoGLAqMZCgvOO8C0YXnmSSm3fnnpkzZ57if9CH54VN2g9sszbMtuojbENjkF0YLDD5bqdNZBtbQqzUIQo8Wcbd0Ed24UmcJ1zqj/vLdO+g9k6j001xJw+Dt4CT9gS2q1/j7K00HN4ZlOhGEMx9FRSW8DzboxnBCVscO3RvcNQag8U1hev6GG4Y47iqE1HbPIb6VhG2+zPQ2LKoUY3huDUBU3CKKTZqQ8xIlZraUrA+nEWnKwejaxyuhzk4+ybR3p3GtfYYlOooalURXKZQGVMQjKPw5+YFRYkjw0yOHCL9q6ijJFVXAj5/EVFxCUPDX3D/6TQnqadOlC1rJFbqRDC/A9e/hQZl7/2Ix31F1LVGca9vDhNJYCoLTGclDPjn0E2dyHJqSMqlpjCu6WI4ZBZhkSWcHigIu9vfosqZRh1VGHq5jPGYhKkJCZNpCe/f/0B37yRuEsET3ywm80tcUqs7jwp7yM+7OP1AZOcc43w4w69+IZtahSRJWFxcxVhoBTZvFmprGsvLq5j7voxIYhFqcwZ7bdE1GSVdQaZ0TqCa2ht6voLPnySMZItwv55GfOwn2ZmBwZlFOP8N2877sFD8iSZ9ChXkHCfYZwmyWmcGFxtH0eNZIP0SWrwZtPbk8My3wIcoz+BVoIj+wQX0v5glggTKLbE1gssDSXbKnuJDkp3w9M4jEFiE59EMdPS9xZxEg2HNSqU6wvPaLFnsMq9LkDdK9rXJkORWyYnXaVA3jQkweiifZRuvkEuyjfVaERra0IPudQIZx3rCMHgKqCZ2Ru3d0Cf50vypKj+s04jQ2SbQSIWqHEmceSzy9edo9GeEEs0wrD0F7nUDkWisNH3zOA+tNYPmzjSU5FQH7U1l58jf6n9QagoKe7TDYJ48TLfzUHWk0KCL82imqkZnHlfv5VBmCEIbyP39G//FA3FWOOyO+MvtUVTaEjhADux30O7TuYx8P0J3Hwr0F3IoFL8BBACSBfFemtQAAAAASUVORK5CYII=',
			'artist': 'https://jpopsuki.eu/artist.php?name=%ARTIST%',
			'album': 'https://jpopsuki.eu/torrents.php?action=advanced&torrentname=%ALBUM%',
			'both': 'https://jpopsuki.eu/torrents.php?artistname=%ARTIST%&action=advanced&torrentname=%ALBUM%',
			'checked': false
		},
		'db9': {
			'name': 'DEEPBASSNiNE',
			'icon': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGtSURBVDhPlVJZagJBFOyj5AKuuCAqisoY3FfEDXe9jMa4++3oWfIRkrME9f/lVdsjjpGQFBSvraW7p1Hco1gsauVyeVIqld54foFqPYGnYj+RzWafODAuFAonnvSIyhsjq2oXQMjn8zoHECJeUy6XM9HwlK+bNslkMtiVDCaTSWq1WsRXp2azSZVKhdLp9NUH0ZHlVCqlJRKJcywWo0gkQtFolILBIAGr1UrOzWZDoVDo6sfjceLOCV3BxZlRMGAU5/O5nMvlUk4D2+2WwuEwaZr2KgKBwCfExWJB/X6fRqMR9Xo9GZzNZnLCGwwGNBwOqdvtSm29XmOTd+H3+48QcJrT6SSPx0MOh0OGjBvcena7XWqHw4H48KPw+XxHPNg9UMJpnU5HKWbs93vyer1H4Xa7PyBMp1Oq1WpUr9cl8fo2m42sVis1Go2rXq1W5Qa6rhO6wuVyLdrtthT/it1uR+igixs88/ed8Rk49S9EFh105X+Bf7zgkf7JF1kG+FufWNDvAr9RR0fVL4DAHDNPTPmADwgPGXP5FmxqFotlwq//xvMLVOsJPBVTEOIbMdbmxs2kKIQAAAAASUVORK5CYII=',
			'artist': 'https://www.deepbassnine.com/artist.php?artistname=%ARTIST%',
			'album': 'https://www.deepbassnine.com/torrents.php?groupname=%ALBUM%',
			'both': 'https://www.deepbassnine.com/torrents.php?artistname=%ARTIST%&groupname=%ALBUM%',
			'checked': false
		},
		'lbm': {
			'name': 'Libble',
			'icon': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQRGlARKlAROlAROnARSnAxSnAxWnAxanBRanBRepBxepBxipBxmpCRipCRmpCRqpCxqrCxurDRyrEx+tEyCtEyGtFSKvHyizHymzISmzJy61LTK5LTO5LzO5LzS5MTW5MTa7Mza7Mze7NTe7Nzm7Nzm9OTq9OTu9Ozu9AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGGU+ucAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACrSURBVChTTY+JEsIgDESTcKm0eNXWoxWxrfX/v9DFqiPLTMLykgCdYx9TjGlICClFcuawNs761ltrdpUh4YVmZttZpNoxKWFipI0WJYpVJnZbEeF8hkhTPfWekM4OjP3tsuT5OhuKqtSuMjELxKGPHsS7KQxBSbsgtAfMCJqqe+fLUodgiqDfU4ZrM42n6XEcnzU4dpvCBW+LgA0Cr0Ppb+Gl33kf4S//UvICo7MJGvb5YEQAAAAASUVORK5CYII=',
			'artist': 'https://libble.me/artist.php?artistname=%ARTIST%',
			'album': 'https://libble.me/torrents.php?groupname=%ALBUM%',
			'both': 'https://libble.me/torrents.php?artistname=%ARTIST%&groupname=%ALBUM%',
			'checked': false
		},
		'it': {
			'name': 'indietorrents',
			'icon': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURWc7MHtVMJAwF4s/MoRPJY1JNI1cPJJCK5RNLZpKKaJIJqlMK6RNOqBRMK9ROLBULbRWNLhaNL5cOa9gObRmP4paUJJcQJNYSpVcS5tcV59sT5hpWZZyWpN2ZpRxbZd8a5hyaZh9dqBZR6pfSL5eRqNkQa9iRKpkS6hjXq1rXaVyV6t1U7ViQLBrXL9uWbF5WLt7WKpkYqZyZKBxa6R6YqN9fKR4ea93eLh5csFdO8RnRsVxT8dyXcd2Wdh7WcN7b6yGYauGfrCIb76NbbCFf7OReNuBX8aBYMOLcsOKd8mMesmUas6Tc82XdeqPdJeNg52MhJqUhpuTiJqdjKaDgauKgayKgauTh6+elLaNi72Kh7qKiL2LjLyPirCTj7GVirWTibeSiriRir6TjL+SjbSblrqflKusnrSsn7ihkcCFh8ONi8eNjMKQj8eTiMiSiMSUkMebnMuVk8iZk8+cmc+emtmWhtmcisehmMagn8ihmtagntehn9m1ld22l8GkoMKlocSno8SopMympcupp8isqM+yqs+yrtaqq9Wtrd2sqNC/rd+3r9q4rti9tO6nlfagj/alkuOuqum/r+i5s/+/rNfNtN7PuNjRvt7XuubHquzPsebYu+/VvPLQtNvew93bxuTRwuDcw+Pfwure0PDPyPnBwPvMxP/JxfrPyPfUwfPXy/XUzfXXz/bexPDaz/nSwfnQzP/QzP/Xz//Yyf/Zzf3Yz//czf/ezfXW0fDe1PXe0PjX0v3W0//Z0P/c0v/d1v/a2P/e2P/e2f/e3P/e3+PkxePhyOvlze7nze7m0+/o1uzu1vPgz/jjyP/iz//lzf/oyf/tyP/uyPPi0vLm1vbn0PTk1PXh2PXr3/7g1fzn1vjk2f/i2v/j3P/i3f7l3v/n3v/n3/vr0f/s1/ro3v/o2v/o2/bwzPr13///3f/l4v/r4//o5//q5f/s4f/u4v/s5f/v5f/v5//35P/35//w7P/w7f//4v/47P/47wAAAAAAAAAAAAAAAAAAAC5dB4kAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEbSURBVChTARAB7/4ANYN5hIdlgoWBgH+EiXGINgBe98S82OX6job67OC9xe1UAE/zueLLoM0fHduY1azB7lAAZ9ml2sfGrkUcnaPItrG6UgBTpMC0meh9GhZ+6py/w9xRAGivwubR001HCC/Sm7WorVgAIWIZKSorDUYLCUxIPzFwHgBZsjgtJyYKEjk6PSMDKKZcAG3fv3cuTj4PERACDHa+wWoAW6m45JEOLBQTOySQz7e9NwBh+ZbOlQclSwQwPI/Ql/JdAF/Un/hJBUNAAQYiSuOi50EAV/XMyRsYQpqeNBcy1um7VQBmocqLAG6wqvSTbxVp16tWAGDv8I2U9t6zp/Hrkozh3WMAIHh6RIprWnRye2x8dWRzM3zDfkuX8HptAAAAAElFTkSuQmCC',
			'artist': 'https://www.indietorrents.com/artist.php?artistname=%ARTIST%',
			'album': 'https://www.indietorrents.com/torrents.php?groupname=%ALBUM%',
			'both': 'https://www.indietorrents.com/torrents.php?artistname=%ARTIST%&groupname=%ALBUM%',
			'checked': false
		},
		'wfl': {
			'name': 'Waffles',
			'icon': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQAAAKh+D8WVBfLJCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKt1bxIAAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAQElEQVQoU42PUQoAMAhCbd3/zG1YLPsZEwkMHxHChgLmPnwWaxhVvSICnaxl+YGoiaiJoNRIZkWYG1F9XJnvW2zqwgV5QTqqYAAAAABJRU5ErkJggg==',
			'artist': 'https://waffles.ch/browse.php?type=&userid=&q=+artist_full%3A%22%ARTIST%%22&c=0',
			'album': 'https://waffles.ch/browse.php?type=&userid=&q=%ALBUM%&c=0',
			'both': 'https://waffles.ch/browse.php?type=&userid=&q=+artist_full%3A%22%ARTIST%%22+%ALBUM%&c=0',
			'checked': false
		},
		'dzr': {
			'name': 'Deezer',
			'icon': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEgSURBVDhPY9DWM12spWv8W1vP5D8pGKLHdDEDOZphGKQX6ALsksRi+hsQlF74f8KhS2Ds5B+B24BAJ///55pXgHGGXwJcPCAt/3/fgXNg7OgfTgUDLEws/l+pzwLjlshAuMIgp4D/l1pWgfG02ur/Ow91gHHN5C5UL4ANaAAaAMSt6Aa0rgZj/AboGf2/oCcDxnNdNf5fOGgNxnMKvf6fNWgG456I0P9zN9iDcUhr0X+7NWfAWN8rDGLAOT1ZMJ7lovn/3D5rMJ6V7/n/lEETGHeFhfyftc4ejIObC/7brToBxtQxQAfoX1OgISBsZGD839QcyAdiIyPT/yZ6lmBsaGD238gMKAbEesYW/3XMbMFYGyhOeUqkQmaiJDubLgYAzHbihZnkqqYAAAAASUVORK5CYII=',
			'artist': 'https://www.deezer.com/search/%ARTIST%/artist',
			'album': 'https://www.deezer.com/search/%ALBUM%/album',
			'both': 'https://www.deezer.com/search/%ALBUM%+%ARTIST%/album',
			'checked': false
		},
		'tdl': {
			'name': 'Tidal',
			'icon': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFWSURBVDhPpZNNyoJQFIalH9IFVA5rYtYqCqyxuYEcRBtoFwUuwHZQG6glNIuSRkFNat4gLZDer3PNS+qd1Cc8IM9534NeUXpd7Rf4EeoKB98Q3ciynB4gl8uhVCplfCoroV6v43A4YDAY8AGVXdfFcrlMFCzLwul0QrPZjByVSTyfT4RhCNu2WXk2mzFH0BJFUVj58Xgwd7lc0Gq1IK1WKx4kgiDAeDxOOMJxHFyv14Rbr9eQVFXFfr9n4n6/o9/vs0ebTqc8uFgsUCwW0e12cbvdmDsej6jVapSVQEs2mw1M0+TvSkwmE8zncxQKBe4Mw4DneXGZiAb5fJ6HYnq9HkajUcansslhDJV932cHOxwOhZk3WdnpdFg5PgNa8vmJU2RltVrFbrfjC+iT6bqeyb0RSlQqFWy3W5zPZzQaDWHmjVAyyuUyNE0Tzj4Qym/4z+8stf8A/BqjpVHMYbIAAAAASUVORK5CYII=',
			'artist': 'https://listen.tidal.com/search/artists?q=%ARTIST%',
			'album': 'https://listen.tidal.com/search/albums?q=%ALBUM%',
			'both': 'https://listen.tidal.com/search/albums?q=%ALBUM%+%ARTIST%',
			'checked': false
		},
		'qbz': {
			'name': 'Qobuz',
			'icon': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIRSURBVDhPtZIxaFpRFIZDLBFqSqBFHOqQIYIITjZgHYKxg1JKHCqCW1CxomCrhg4ZHFxcRUHEZBEdJFQyCIIKQhEdBOsgSnGwDrpYEUEIEqh/z31JbhtM6VD6wwfnnfefw73n3I3/pcfEa+I94SUOiEfEX7W5s7MTCAaDs0ajgdlshslkgnK5DIfD8U0kEr299T2oTaVSmWm32+h0Ojg9PcXJyQkCgQDC4TBGoxEKhcJKKpV+vPXfl0Qi8bVaLWQyGezt7eH4+Bjn5+eIxWKwWq1QKBSo1WrI5XIrsh/eVP2S2Ofzfe/1etja2sL29jYMBgO8Xi9cLhe0Wi3EYjFkMhnm8zmOjo5qt3Vcr6rVqlBAsYDJZEK/3wc7lVqt5vlEIoF4PM5OISW43o3HY+h0Om7sdrvCkVmTi4sLnnc6nahUKizWElz24XAIvV7PjfV6HYPBANPpFKlUiuc9Hg+KxSKLXxBc+5eXlwiFQtzIBpnNZpFMJoVYpVIJeRoiIpHINcVPCK5Nm832le2c1sSb3KHRaIT3wAZ6dXXFhvqJ8mt6Q3ddNZtNyOXytSZmsxnL5VIYIn3fuz8XvcIP6XT6x2KxwNnZGdxuN+x2O/x+PywWiwA7CW2oRfanN1XrOiDD52g0uiqVSsjn82y917u7u3n6d0hN+kaj8QvFf2xwJ7bnl8Q+8fvAnhPPbsJ/1sbGT+rLI85PMnuJAAAAAElFTkSuQmCC',
			'artist': 'http://www.qobuz.com/fr-fr/search?q=%ARTIST%&i=boutique',
			'album': 'http://www.qobuz.com/fr-fr/search?q=%ALBUM%&i=boutique',
			'both': 'http://www.qobuz.com/fr-fr/search?q=%ARTIST%+%ALBUM%&i=boutique',
			'checked': false
		}
	};

	/* -------------------------------------------------------------------------------- */

	if (document.querySelectorAll('meta[name="generator"][content="Bandcamp"]').length == 0) return;

	var pTitle = document.querySelector('title').textContent;
	var mTitle = document.querySelector('meta[name="title"]').content;

	var bcUrl;
	if (/\/(album|track)\//.test(location.href)) {
		bcUrl = location.href.split('?')[0];
	} else {
		document.querySelector('span.share-embed-label > button').click();
		bcUrl = document.querySelector('div.email-im-link > dl > dd > input[type="text"]').value;
		location.assign(bcUrl);
	}

	var bcArt, bcAlb;
	var gotArtAlb = false;
	if (mTitle.match(/, by /).length == 1) {
		bcAlb = mTitle.split(', by ')[0];
		bcArt = mTitle.split(', by ')[1];
		gotArtAlb = true;
	} else {
		if (pTitle.match(/ \| /).length == 1) {
			bcAlb = pTitle.split(' | ')[0];
			bcArt = pTitle.split(' | ')[1];
			gotArtAlb = true;
		}
	}

	var hook = document.querySelector('div#name-section > h3');
	hook.appendChild(document.createElement('br'));
	hook.appendChild(document.createElement('br'));

	if (gotArtAlb) {
		var chkBxs = [];
		var bxLbls = [];
		var chkBxsCnt = 0;

		var splitBox = document.createElement('input');
		splitBox.type = 'checkbox';
		splitBox.checked = false;
		splitBox.id = 'split_text';
		splitBox.title = 'If checked, the artist will be ignore (e.g. a netlabel) and the artist name will be parsed from the albumtitle. Use the text input to the right to enter a character/string to split the albumtitle into a separate artistname (preceding the char/str) and albumtitle (following it) - typically this is \'-\', \':\', \'/\', etc.';
		var splitBoxLbl = document.createElement('label');
		splitBoxLbl.setAttribute('for', 'split_text');
		splitBoxLbl.title = 'If checked, the artist will be ignore (e.g. a netlabel) and the artist name will be parsed from the albumtitle. Use the text input to the right to enter a character/string to split the albumtitle into a separate artistname (preceding the char/str) and albumtitle (following it) - typically this is \'-\', \':\', \'/\', etc.';
		splitBoxLbl.innerHTML = 'Parse albumtitle as: artist ';
		var splitText = document.createElement('input');
		splitText.type = 'text';
		splitText.size = 1;
		splitText.value = '-';

		var btnsTxt = document.createElement('b');
		btnsTxt.appendChild(document.createTextNode('Search for:'));
		hook.appendChild(btnsTxt);
		hook.appendChild(document.createTextNode('\u00A0'.repeat(4)));

		var searchArt = document.createElement('input');
		searchArt.type = 'button';
		searchArt.value = 'Artist';
		searchArt.title = 'Search for artist "' + bcArt + '"';
		hook.appendChild(searchArt);
		hook.appendChild(document.createTextNode('\u00A0'.repeat(4)));
		searchArt.onclick = function() {
			var art = splitBox.checked ? bcAlb.split(splitText.value)[0].trim() : bcArt;
			for (var k in urls) {
				if (!urls.hasOwnProperty(k)) continue;
				if (document.getElementById(k + '_checkbox').checked === true) {
					if (urls[k].artist === undefined) continue;
					GM_openInTab(urls[k].artist.replace(/%ARTIST%/, encodeURIComponent(art)), stayOnBandcamp);
				}
			}
		};

		var searchAlb = document.createElement('input');
		searchAlb.type = 'button';
		searchAlb.value = 'Album';
		searchAlb.title = 'Search for releases "' + bcAlb + '"';
		hook.appendChild(searchAlb);
		hook.appendChild(document.createTextNode('\u00A0'.repeat(4)));
		searchAlb.onclick = function() {
			var alb = splitBox.checked ? bcAlb.split(splitText.value)[1].trim() : bcAlb;
			for (var k in urls) {
				if (!urls.hasOwnProperty(k)) continue;
				if (document.getElementById(k + '_checkbox').checked === true) {
					if (urls[k].album === undefined) continue;
					GM_openInTab(urls[k].album.replace(/%ALBUM%/, encodeURIComponent(alb)), stayOnBandcamp);
				}
			}
		};

		var searchBth = document.createElement('input');
		searchBth.type = 'button';
		searchBth.value = 'Both';
		searchBth.title = 'Search for releases "' + bcAlb + '" by artist "' + bcArt + '"';
		hook.appendChild(searchBth);
		searchBth.onclick = function() {
			var art = splitBox.checked ? bcAlb.split(splitText.value)[0].trim() : bcArt;
			var alb = splitBox.checked ? bcAlb.split(splitText.value)[1].trim() : bcAlb;
			for (var k in urls) {
				if (!urls.hasOwnProperty(k)) continue;
				if (document.getElementById(k + '_checkbox').checked === true) {
					if (urls[k].both === undefined) continue;
					GM_openInTab(urls[k].both.replace(/%ARTIST%/, encodeURIComponent(art)).replace(/%ALBUM%/, encodeURIComponent(alb)), stayOnBandcamp);
				}
			}
		};

		hook.appendChild(document.createElement('br'));
		hook.appendChild(document.createElement('br'));
		hook.appendChild(splitBox);
		hook.appendChild(splitBoxLbl);
		hook.appendChild(splitText);
		hook.appendChild(document.createTextNode(' album'));

		for (var k in urls) {
			if (!urls.hasOwnProperty(k)) continue;
			if (chkBxsCnt % boxesPerRow == 0) {
				hook.appendChild(document.createElement('br'));
				hook.appendChild(document.createElement('br'));
			}
			chkBxs.push(document.createElement('input'));
			chkBxs[chkBxsCnt].type = 'checkbox';
			chkBxs[chkBxsCnt].name = k + '_checkbox';
			chkBxs[chkBxsCnt].id = k + '_checkbox';
			chkBxs[chkBxsCnt].checked = (urls[k].checked === false || urls[k].checked === undefined) ? false : true;
			hook.appendChild(chkBxs[chkBxsCnt]);
			bxLbls.length++
			bxLbls[chkBxsCnt] = document.createElement('label');
			bxLbls[chkBxsCnt].setAttribute('for', k + '_checkbox');
			if (urls[k].icon != '' && urls[k].icon !== undefined) {
				bxLbls[chkBxsCnt].innerHTML = '<img title="Search ' + (urls[k].name === undefined ? urls[k] : urls[k].name) + '" src="' + urls[k].icon +
					'" style="width: 16px; height: 16px; border-width: 0px; padding: 0px 0px 0px 0px;">';
			} else {
				bxLbls[chkBxsCnt].innerHTML = k;
			}
			hook.appendChild(bxLbls[chkBxsCnt]);
			hook.appendChild(document.createTextNode('\u00A0'.repeat(4)));
			chkBxsCnt++;
		}

	} else {
		hook.appendChild(document.createTextNode('Userscript Warning! Cannot parse artist name/album title.'));
	}
})();