// ==UserScript==
// @name          Improved Steam Achievements
// @namespace     http://greasyfork.org/users/2240-doodles
// @author        Doodles
// @version       3
// @description   Improves the appearance of Steam achievements on Steam pages and also on Achievement Stats pages.
// @include       *://www.achievementstats.com/*
// @include       *://achievementstats.com/*
// @include       *://steamcommunity.com/*
// @exclude       *://steamcommunity.com/*xml=1*
// @exclude       *://steamcommunity.com/*tab=leaderboards*
// @exclude       *://steamcommunity.com/*/leaderboards/*
// @run-at        document-end
// @require       https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @require       https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.27.1/js/jquery.tablesorter.js
// @grant         GM_getValue
// @grant         GM_setValue
// @updateVersion 3
// @downloadURL https://update.greasyfork.org/scripts/21947/Improved%20Steam%20Achievements.user.js
// @updateURL https://update.greasyfork.org/scripts/21947/Improved%20Steam%20Achievements.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
$(document).ready(function () {
	'use strict';
	// =======================================================================================================================
	// Prototype Functions
	String.prototype.isaReplaceAll = function(f, r) {
		return this.split(f).join(r);
	};
	String.prototype.isaRemoveEnd = function(end) {
		return (this.length < end.length || this.substring(this.length - end.length) != end) ? this : this.substring(0, this.length - end.length);
	};
	Number.prototype.toSuffixedString = function() {
		var i = this;
		var suffixes = ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th'];
		var iStr = i.toString();
		i = (i > 99) ? parseInt(iStr.substring(iStr.length - 2), 10) : i;
		i = (i > 13) ? parseInt(iStr.substring(iStr.length - 1), 10) : i;
		return iStr + suffixes[i];
	};
	String.prototype.padTwo = function() {
		return (this.length == 1) ? '0' + this : this;
	};
	Number.prototype.padTwo = function() {
		return (this < 10) ? '0' + this.toString() : this.toString();
	};
	Date.prototype.isaToString = function() {
		return this.getFullYear().toString() + '/' + (1 + this.getMonth()).padTwo() + '/' + this.getDate().padTwo() + ' ' + this.getHours().padTwo() + ':' + this.getMinutes().padTwo();
	};
	String.prototype.lastPart = function(s) {
		var p = this.split(s);
		return p[p.length - 1];
	};
	// =======================================================================================================================
	// Data Variables
	var defaultTitleDelim = ' - ';
	var defaultLinkDelim = ' | ';
	var backTile = 'data:image/gif;base64,R0lGODlhAwAJAJEAABoaGiIiIhISEgAAACH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZX' +
		'RhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4zLWMwMTEgNjYuMTQ1NjYxLCAyMDEyLzAyLzA2LTE0OjU2OjI3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucy' +
		'MiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL2' +
		'5zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0NjAwMUJCRTEyQzMxMUU1QjQ1REZBQkU2QU' +
		'VFQUJDMCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo0NjAwMUJCRjEyQzMxMUU1QjQ1REZBQkU2QUVFQUJDMCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjQ2MDAxQkJDMTJDMzExRTVCNDVERkFCRTZBRU' +
		'VBQkMwIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjQ2MDAxQkJEMTJDMzExRTVCNDVERkFCRTZBRUVBQkMwIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/' +
		'b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU09LR0M/OzczLysnIx8bFxMPCwcC/vr28u7q5uLe2tbSzsrGwr66trKuqqainpqWko6KhoJ+enZybmpmYl5aVlJOSkZCPjo2Mi4qJiIeGhYSDgoGAf359fHt6eXh3dnV0c3JxcG9ubWxram' +
		'loZ2ZlZGNiYWBfXl1cW1pZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBQD8+PTw7Ojk4NzY1NDMyMTAvLi0sKyopKCcmJSQjIiEgHx4dHBsaGRgXFhUUExIREA8ODQwLCgkIBwYFBAMCAQAAIfkEAAAAAAAsAAAAAAMACQAAAgeMYHiXrW8KADs=';
	var arrowDown = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAYAAAB24g05AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD' +
		'0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPH' +
		'JkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxucz' +
		'p4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2' +
		'luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjUwMUY4NzEzNDFBMTFFNTlEM0E5MkY5MEUwMzBGRTciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjUwMUY4NzIzNDFBMTFFNTlEM0E5MkY5MEUwMzBGRTciPiA8eG1wTU06RGVyaX' +
		'ZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCNTAxRjg2RjM0MUExMUU1OUQzQTkyRjkwRTAzMEZFNyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCNTAxRjg3MDM0MUExMUU1OUQzQTkyRjkwRTAzMEZFNyIvPiA8L3JkZjpEZXNjcm' +
		'lwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtTTibEAAAFdSURBVHjaYmRgYGAEYi4g5gTib1CMD3BB8XeYWmY1E0fj6uUXdgHZNkDMi0czSM4GpBakB6SXCeSCnz+/S4uo6rtWrbu1homJGWSIEBAzIWkEsY' +
		'VAciA1ILUgPSC9YEV//vxh+/oP6C4ZVfHqfe/XKxk7RgCFpYCYBYqlQGIgOZAakFqQHpjJ/3///fPtM1AQhH9x8LKHTt031Ty2rBQopwPCIDZIDCQHUwfSA9LLCA1E9ZD55zaKqBmqIXv45rYFJ0G0uleCObL4m1vnb61JNPIHKWGEinEDsbZNy9puWf' +
		'sgO3xR8PjgukNHaoJBrrsKxF+ZoeK/gfjto32rjv1iZGLj0bc3/vmfgQEdX1nQNPt8b2YtUO0NaDRiAFYglhO28iuy2fH1l93+//9BGMQGiYHkoGrwAlDAirDwCfvrLn/4EoRBbJAYWtSCASMeg/iAWBLKfg7En7ApAggwAF08i46C7tfuAAAAAElFTk' +
		'SuQmCC';
	var arrowUp = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAYAAAB24g05AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD' +
		'0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPH' +
		'JkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxucz' +
		'p4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2' +
		'luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Rjg5RTY1MDEzNDFBMTFFNTk0NUU4NTQxM0I4NDFBOUQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Rjg5RTY1MDIzNDFBMTFFNTk0NUU4NTQxM0I4NDFBOUQiPiA8eG1wTU06RGVyaX' +
		'ZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGODlFNjRGRjM0MUExMUU1OTQ1RTg1NDEzQjg0MUE5RCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGODlFNjUwMDM0MUExMUU1OTQ1RTg1NDEzQjg0MUE5RCIvPiA8L3JkZjpEZXNjcm' +
		'lwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PrqW0q0AAAFySURBVHjaYmTADbiAWBTKfg3E3xiIBIxAzA/EDhWLT18EYRAbKsZISDMzEIuJyCiHN2x/+rH/zP//IAxig8RAclA1KBpggA2IZfTcIxMSpuyezM' +
		'IjwPn7PwMDCDNx8bKbBmUEvnt699PLu1ceQr3zF9kADiBWdcztrnHI6y38zcTM9AuoERmDxFQdg53YOHmEH5zafQOo/hMQ/2GE+kvRs3vLXHkrbwdk5z09u+8BiJY2dlJAFn94bOuB7aU+yUDmfSaQAbwyqsoCFt4OH/8xMMDwuY2zN23Oc44FYRAbWQ' +
		'6kFqQHpJcFSDAxcfPzffoHNf7///9XJ+V1P1g3ZQ6Q9wgkdKorrfjl7YvXdfInlzEwMoJjAqQHRIHYLLwaZgF2+///t9z45huvukkSUEwKJI7kahBbEiQHUgNSC9IDU8PMZ+xqrbfyyS0g2w2IBXHENyNUzg2kFqQHpBcWiLxAzA3En4H4C4G0wgNV/x' +
		'WkHiDAAPxMjVutShxmAAAAAElFTkSuQmCC';
	var settingsIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAbCAYAAACN1PRVAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD' +
		'0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPH' +
		'JkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIH' +
		'htbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpDMkMwRT' +
		'FGNjE5MzRFNTExOTRGQjk5NTdFM0Y0NjI3OCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3NjZDMjgzMzM3NkUxMUU1ODcxNUJCRjhEOUUzRERDQSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3NjZDMjgzMjM3NkUxMUU1ODcxNUJCRjhEOU' +
		'UzRERDQSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjhCQjBDNDI5NkUzN0U1MTE5RjE5QzI1QTgzNDMyMkE5IiBzdFJlZj' +
		'pkb2N1bWVudElEPSJ4bXAuZGlkOkMyQzBFMUY2MTkzNEU1MTE5NEZCOTk1N0UzRjQ2Mjc4Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+kBEuTwAABWBJREFUeNq8VgtMU1cY9r' +
		'a3T1ootS3QNryqUEqx2PoCRB3OF8vYMnAbGdkcU5ksczpli5htxi06QTLdMl0kmmw+YjIm2cZmptNZDCgTpwiICqQFoVSh8mhpe3v72DnmXHJXisFs2Um+e57/+e7/n///z8ECgcCM/6vg8INh2HTX8wCiAcQADoB+VE+vPEEzJgAH1VRJeL/aWH/gsp' +
		'3YdeauiScUpdPmGQCsoPX/KIwQY1BNIYBmzYaPi0GdAiCAxEKxbJY0Tj0P5wnYktik+PSc/JVgPAyAC5C4rPC9tUwWOxW0I0LtHYqMmZK5Wlt24vrpVRt3fb31WOP38llpeWA8a3FB6Qa+WMbzgQ5E8sIVL4MqE2BxcUVNdd7miu+2H28+Y1hVmIG0nH' +
		'xmk/4AZ0ulqrRkHzhNZVqGel1l7Tce17hHlpAi9tKsnrq8QF92uvWkl/T4lGq9FE7JVGmqSEWiGjSNk0wGzyzIQaC2qW8fMdYkzF2S9LQeZ7vf9ehgkT6PcNqbQNc7lRkx1IcgTa1Xu6EWT4ue9mu9gMhJ2x8LNiMHZ3NjZCptvHNkiBMuU6RpVhRmkz' +
		'STATN6e29e7rB2tjQ7RwaHhBK5MkZtmB+ry1IxmPjEhkr90mTVwpXPDZk7pGGRMvJRX1ev2zEKQ8RNmVGZv7fmQJzhmVwf6QkwcRbOi5jJpjYYsZhG66s/qWw9e/wn0B2EmqOwiF5UVLYuo+iDjXyRhEOtd9uHSZJwkUCBGZb2JuPprbmbwHAPpZkgOn' +
		'3JcqZQzKOCxIO0Ihyj5LmD23Z3GmtPgu4QckSqPLx6orLK5/f7l5R+vpnSkCGIZHEAYFuauigbhdLEmY3euVRbMzYy5CbRb1O41/hLIyCqQxr5gvwBOkD/tVNV3/bcaugMlnURLp+p+eLvcH86me3CvpLddTvXbrd2tw1DrSAIn39GX0vDJagBgH8KB4' +
		'SE1r7WK1coOQibxez8bc/6PXXlBWVIfoLMA2Dp/+tSw4PuNjMl4PIQ/lGLyYLmn1SI8eFBK51ssOduf+e5U9AiZjhPJ4POIJfpsjME8Zo4SsCHczC2OEo8VfDTkwMzLEJEJ+NExcnAeRlQ4mbRyWbO23Z4Z9ZnP1SFJc4RUwIkxsAiUxbA1BNJj5cQKU' +
		'8inD13Hp2MF6uOyNr7437Dlq92wHk6mShqaf4rWISURxeAkGbm5YQnaBeBNeEhCB8TKZYV5Ebqc3TBsgyRjC9f8dob6EqaIHM8bG2sd7tdpMsxRrpdTh8MaAhcohDoPjy6L3yWbjVYF4vcmIsye2JU5vOvJm/cWx7ghOGUDEG4/Wgfr62r5QZY56TnRi' +
		'4vJiFOmDhH4xl+wGKFizWa7UfKuBIFn1LBZTXbbdfO/WG7cdFI2AaG+HKVQqzPeVYyf1UmWyTlUutI+7Cn44vSL8H6ZrY42uvs7+p0mNq6ICE9ETPQxQc7yclbDh1SvLBp8aTL1ksG/F6Pj8HhMTFwpsHzA2eP/dlR8VYJaHagcKEQoHsZNfj4xuWr58' +
		'eTIf2OhQHgUwUdOzYlCv0wGRyboS5PXLamWMudbVBSmdxxv9MOMOb1ByZl+XFrjwPASfV56gWx0pWvp4QKl1BkAa/LYbH3dJig8PBNY9vtHbnrWzakFz04f6KJTjRQV228VWIouvPRi6Wjt5vuwTHngHkAisF9pvPggSaIYHD4+pg3P30XtLXoDSIUZb' +
		'9Umn7e6597IRDQ/eok+eoFhdQcgE75zoFyjlyVheKS8TSvKxxdIzjNCpqko+13tD/bidmHr98E/SRa7OHoqceaKgGEehY8qcCXlBwFOMzkFiqG/u278T8vfwswANrMfI9dB/UpAAAAAElFTkSuQmCC';
	var settingsIconHover = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAbCAYAAACN1PRVAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD' +
		'0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPH' +
		'JkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIH' +
		'htbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpDMkMwRT' +
		'FGNjE5MzRFNTExOTRGQjk5NTdFM0Y0NjI3OCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCODE3QjlGRDM3NkUxMUU1QkIwNUNDMjVEN0NBN0ZEMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCODE3QjlGQzM3NkUxMUU1QkIwNUNDMjVEN0' +
		'NBN0ZEMCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjhCQjBDNDI5NkUzN0U1MTE5RjE5QzI1QTgzNDMyMkE5IiBzdFJlZj' +
		'pkb2N1bWVudElEPSJ4bXAuZGlkOkMyQzBFMUY2MTkzNEU1MTE5NEZCOTk1N0UzRjQ2Mjc4Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Z/YQbwAABW5JREFUeNq8VgtMU1cYpu' +
		'0tLdACLaU85VWhLbSCvBniGGPOlI0xxTE2Nh0SHYQ93MTER4ZT94pjc5oxo05jNhY2MYwpcTNGrExYBygO5FmhvIqTV0pLKb3t7c7Be8m1XIhmy07y3XvOf+453/2f59BsNpvD/9UQ+KDRaI/6vROANwAfwAAwgr8frS2jGQOAhb+JFnz8vPL6tR793L' +
		'n67n6uq3sUaZ4OwLT7/qFGp5BBNbkA4fk7PsgHbykABxLzBMKVASslsSwXjqN/SFhQasbGdUDuAsAGCMkpeGcTk+kYAfpulHtTaIYkpK5POn2p5U79EIYdr2noFEnkrwB5Wv57+3/6fdhmI/BheWUzkK8HSD90oqqurn/OcvbKX+r0rNz1uFUW+2yRkO' +
		'noGSCRi63Am5LoJMnBU9XHZ40z5sBQKd9C+rcURXb0mSttFajZbA2TR3tCWaBYLvJZESIBXeUik0HN7AIEqh/xxTll1aqEtWGPG3EjGvVkoSI602jQq8DQspTPaPgYAm2/+cddFGjxuOhobRoEREbS/jR7M7IcWWyfALEsaHpynOXh7Sdfk5mbgpJMZj' +
		'LOWDqa6jv7O2436ybHxvlevv4r5TFx0phkEQNBFjaUJjwpXp2yLmNI3enpLhCiWo160KjXwRQxEWb0LymvOiJLekphQc02BsJEuDwPR2KD+0P9usovSw8rq7/7BQzHoOZ4AHi/sK1kS9abu7a58gQLAWHQTaFm0ywKFHDoaVUpP3pDUQjEA4RmnNC4tU' +
		'+zXPlOxAoUe/AGf4WePvT+gabL1RVgOA5gJZn+fs2Jw2VWDMNyd336NoPxQEMWl8eEgP2QyMQUPJUWfKZr/K26amJy3GQGpiOj6WptAyC6iGtktYsHGAAjF0+Vnb3TfKPXfq1hdtba2nD1CtyfTDZxZt/2A0eLN+3UdLdPEc42WzGHrpYb16AGANgSAQ' +
		'gJ73XfbGwkB8rosMZ4cnfBx8eKs0vw9QtkZgBtt+rajYHudo0ZbAthNM1hwF9afH65NqebGLtHrIMYvts9orrwA7SIBs6TyWAw+IpiU5IEovBAwgwYk0XjeHjxl0r+h+oAx82dbEKuT6AwKDIxBi/cTDKZx4bSb/a+9tX5MkHYKj6xAKXRaX7y+CQwzy' +
		'PnC0V9FXhLV8eSyXjBErfNX9d8nrXv2G44TyZzl6RvzGG6ezqRTQERmpqZ5hUqSwTfuFIQzhPJ1mUrAuLTIu3XOvKEzrKMVzfjR9ICmaHvVsN1I8gNg34aNc4arYSjnYR+nMwD337mLY6ExTUAD2M2XtlDxKnPv5z27id7aGwXhFgzazJh+D6W4a7bt2' +
		'AGkWsj290vOFAYtip8ZuJvppMbP1yx/0QJV+jnTKig02r0fQ2X6zSqq0rD2Og4b4XILyghLT0k+dknnHme7IVKMz1lvnSo6KhuRNPMEXhbJgfVvWPqdjUkJBdiOn7wwYH4mb3l5VEvFa6xdxBmQW1W1GxFWE4MGp2+yI9tP5/+89fSrdtBtxNPFwI2cp' +
		'QRwvkTVxARF4RSHeIMJg0AmS/nFPNuwVIv/IdR+9ykOqmR8Kx8mYckxh+eXRDjA716gGkLZnMgZASmtAMGACMxFkTEB0iee11KlS5UZLa5GYN2rK+zHy4ebFa2XyhWFFTmROV11H6vIhO1nT+p/DE3Jq92R1aRtk3VM08+ohkF6kxR6k1xLYAmcEPYzt' +
		'ExhQffAn0ZfgfhBqVtKNraZMEKWmy2LQ1G1DMiPpeYA4hM3Hlkj6u/KBnPS/rj3K4Q/BhBSFYIf/Hcna68ev1cZkVLKxiHkXIPwa96zKUKANW1YLkGb1K+eILDSq4lcujf3hv/8/aPAAMA9bWbSWlT7cIAAAAASUVORK5CYII=';
	var closeIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD' +
		'0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPH' +
		'JkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxucz' +
		'p4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2' +
		'luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6REU2NUE2RkYzODQxMTFFNUJGMTc4MDk5QkNBOUVBNjkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6REU2NUE3MDAzODQxMTFFNUJGMTc4MDk5QkNBOUVBNjkiPiA8eG1wTU06RGVyaX' +
		'ZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpERTY1QTZGRDM4NDExMUU1QkYxNzgwOTlCQ0E5RUE2OSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpERTY1QTZGRTM4NDExMUU1QkYxNzgwOTlCQ0E5RUE2OSIvPiA8L3JkZjpEZXNjcm' +
		'lwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PriqgcMAAAE5SURBVHjanJK/SgNBEIfvTsEiBEwhYuUL+BCm0U5JEREUjRBOEAQfQ9JrkkNQxEpQBME/ZdQHsLK3sjIpQooQw/kN7Mlk3CYZ+Ji9m/n9bnfnwj' +
		'RNg0kjzMRxHC+TtuAgSZKBbaQekU7gnvrDn5hCkfUNFOAK9mj4UcKQ1JAl9KBM/TFy9SMnlNiGcwTTSlh3Qomc6w8ycQWe1S7F4BLhHDmBfVV7gx175pzb+qpq/IRFI1xjy50RsTK4hRXP5Y4I/4mdwSzpAxbU6zYsIfzSvZHnCzWYN+/EsIbxlHfO7q' +
		'tNdasSfZhRzzLGCjsY6jmL46kRyhkP4dhcohhUMehn2z4zwhdYp+Fdfgh4MmO80GduwdCtX6GEUC4pIHdJG8agZecsjruwieDb82/nSddwR73pHdU48SvAAF0zfh0+f5wAAAAAAElFTkSuQmCC';
	var colWidUnlockPercent = '158';
	var colWidUnlockPoint = '110';
	var colWidUnlockDate = '180';
	var colWidUnlockLink = '95';
	var titleDone = false;
	// =======================================================================================================================
	// Stored Data Variables
	var titleDelim = GM_getValue('isaDataTitleDelim', defaultTitleDelim);
	var linkDelim = GM_getValue('isaDataLinkDelim', defaultLinkDelim);
	var meName = GM_getValue('isaDataMeName', false);
	var meSteamId = GM_getValue('isaDataMeSteamId', false);
	var meUrlBit = GM_getValue('isaDataMeUrlBit', false);
	var achPeople = [];
	pushPeople(meName, meSteamId, meUrlBit);
	function pushPeople(name, steamid, urlbit){
		if (achPeople === false || !$.isArray(achPeople)) {
			achPeople = [];
		}
		if(steamid !== false || urlbit !== false) {
			var alreadyInList = false;
			for (var i = 0; i < achPeople.length; i++) {
				var person = achPeople[i];
				if((person[1] !== false && person[1] == steamid) || (person[2] !== false && person[2] == urlbit)) {
					alreadyInList = true;
					break;
				}
			}
			if(!alreadyInList){
				achPeople.push([name, steamid, urlbit]);
			}
		}
	}
	// =======================================================================================================================
	// Functions
	function urlContains(urlfragment) {
		return document.URL.indexOf(urlfragment) != -1;
	}
	function htmlDateDifference(to, from) {
		if (to === false || from === false) {
			return '';
		}
		var ss = Math.floor((to - from) / 1000);
		var yy = Math.floor(ss / 31536000); //60 / 60 / 24 / 365
		ss -= yy * 31536000;
		var dd = Math.floor(ss / 86400); //60 / 60 / 24
		ss -= dd * 86400;
		var hh = Math.floor(ss / 3600); //60 / 60
		ss -= hh * 3600;
		var mm = Math.floor(ss / 60); //60
		ss -= mm * 60;
		var timeDesc = '<span title="Time between this and the previous achievement." class="isaSpanSmallBold ';
		if (yy > 0) {
			return timeDesc + 'isaSpanRed2">' + yy + ((yy == 1) ? 'year ' : 'years ') + dd + ((dd == 1) ? 'day ' : 'days ') + hh + 'h ' + mm + 'm ' + ss + 's</span>';
		} else if (dd > 0) {
			return timeDesc + 'isaSpanRed2">' + dd + ((dd == 1) ? 'day ' : 'days ') + hh + 'h ' + mm + 'm ' + ss + 's</span>';
		} else if (hh > 0) {
			return timeDesc + 'isaSpanYel2">' + hh + 'h ' + mm + 'm ' + ss + 's</span>';
		} else if (mm > 0) {
			return timeDesc + 'isaSpanBlu">' + mm + 'm ' + ss + 's</span>';
		} else if (ss > 0) {
			return timeDesc + 'isaSpanBlu">' + ss + 's</span>';
		} else {
			return timeDesc + 'isaSpanGre">Same Time as Previous</span>';
		}
	}
	function textTimeAgo(dateUnlocked) {
		if (dateUnlocked === false) {
			return '';
		}
		var ss = Math.floor((Date.now() - dateUnlocked.getTime()) / 1000);
		var yy = Math.floor(ss / 31536000); //60 / 60 / 24 / 365
		ss -= yy * 31536000;
		var dd = Math.floor(ss / 86400); //60 / 60 / 24
		ss -= dd * 86400;
		var hh = Math.floor(ss / 3600); //60 / 60
		ss -= hh * 3600;
		var mm = Math.floor(ss / 60); //60
		ss -= mm * 60;
		if (yy > 0) {
			return yy + ((yy == 1) ? 'year ' : 'years ') + dd + ((dd == 1) ? 'day ' : 'days ') + hh + 'h ' + mm + 'm ' + ss + 's ago';
		} else if (dd > 0) {
			return dd + ((dd == 1) ? 'day ' : 'days ') + hh + 'h ' + mm + 'm ' + ss + 's ago';
		} else if (hh > 0) {
			return hh + 'h ' + mm + 'm ' + ss + 's ago';
		} else if (mm > 0) {
			return mm + 'm ' + ss + 's ago';
		} else if (ss > 0) {
			return ss + 's ago';
		} else {
			return 'just now';
		}
	}
	function htmlFromUl(ul) {
		var liHtml = [];
		$(ul).find('li').each(function () { liHtml.push($(this).html()); });
		return liHtml.join(linkDelim);
	}
	function htmlAstatsPoint(value) {
		if (!(value > 0)) {
			return '<span class="isaSpanRed" title="Unachieved: No one recorded on AStats has this achievement.">' + value + '</span>';
		} else if (value >= 3) {
			return '<span class="isaSpanRed" title="Hard: 3+">' + value + '</span>';
		} else if (value >= 2) {
			return '<span class="isaSpanYel" title="Moderate: 2-2.99">' + value + '</span>';
		} else if (value >= 1) {
			return '<span class="isaSpanBlu" title="Easy: 1-1.99">' + value + '</span>';
		} else {
			return '<span class="isaSpanGre" title="Simple: 0-0.99">' + value + '</span>';
		}
	}
	function htmlSteamAchProgress(str) {
		var numbs = str.trim().split(' / ');
		var value = numbs[0].isaReplaceAll(',', '') / numbs[1].isaReplaceAll(',', '');
		if (value <= 0.33) {
			return '<span class="isaSpanRed isaSpanSmallBold">Progress: ' + str + '</span>';
		} else if (value <= 0.66) {
			return '<span class="isaSpanYel isaSpanSmallBold">Progress: ' + str + '</span>';
		} else if (value < 1) {
			return '<span class="isaSpanBlu isaSpanSmallBold">Progress: ' + str + '</span>';
		} else {
			return '<span class="isaSpanGre isaSpanSmallBold">Progress: ' + str + '</span>';
		}
	}
	function domPercentCell(cell, percent) {
		var hslHue = Math.floor(2 * parseInt(percent, 10));
		$(cell).css({ 'background-color': 'hsl(' + hslHue + ', 60%, 20%)', 'background': 'linear-gradient(hsl(' + hslHue + ', 60%, 20%), hsl(' + hslHue + ', 60%, 15%))' }).text(percent);
	}
	function textDateFixSteam(str) {
		var parts1 = str.replace('Unlocked ', '').split(' @ ');
		var parts2 = parts1[0].split(',');
		var parts3 = parts2[0].split(' ');
		var parts4 = parts1[1].split(':');
		var ye = parts2.length == 2 ? parts2[1].trim() : new Date().getFullYear();
		var da = (parts3[0] < 10) ? '0' + parts3[0].trim() : parts3[0].trim();
		var month = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].indexOf(parts3[1].trim().toLowerCase()) + 1;
		var mo = (month < 10) ? '0' + month : month;
		var mi = parts4[1].trim().substring(0, 2);
		var timecode = parts4[1].trim().substring(2, 4);
		var ho = parts4[0].trim();
		if (timecode == 'am') {
			if(ho == '12'){
				ho = '00';
			}else if(ho.length == 1) {
				ho = '0' + ho;
			}
		} else if (ho != '12') {
			ho = (parseInt(ho, 10) + 12).toString();
		}
		return ye + '/' + mo + '/' + da + ' ' + ho + ':' + mi;
	}
	function htmlPercentStr(str, value) {
		if (value <= 0.33) {
			return '<span class="isaSpanRed">' + str + '</span>';
		} else if (value <= 0.66) {
			return '<span class="isaSpanYel">' + str + '</span>';
		} else if (value < 1) {
			return '<span class="isaSpanBlu">' + str + '</span>';
		} else {
			return '<span class="isaSpanGre">' + str + '</span>';
		}
	}
	function textStringToDate(str) {
		if (!str || $.trim(str) === '') {
			return false;
		}
		var parts1 = str.split(' ');
		var parts2 = parts1[0].split('/');
		var parts3 = parts1[1].split(':');
		if (parts3.length == 3) {
			return new Date(parts2[0], parts2[1] - 1, parts2[2], parts3[0], parts3[1], parts3[2]); //new Date(year, month, day, hours, minutes, seconds, milliseconds);
		} else {
			return new Date(parts2[0], parts2[1] - 1, parts2[2], parts3[0], parts3[1]);
		}
	}
	function domDateColumn(rows, column, detailCell) {
		if (typeof(detailCell)==='undefined') { detailCell = false; }
		if (rows.length > 1) {
			rows.sort(function(a, b) {
				var aText = $(a).find('td:eq(' + column + ') > span:eq(0)').text().trim();
				var bText = $(b).find('td:eq(' + column + ') > span:eq(0)').text().trim();
				if (aText == bText) {
					return 0;
				}
				var aNum = 0;
				if (aText == 'Locked') {
					aNum = 99999999999999;
				} else if (aText == 'Unlocked') {
					aNum = 88888888888888;
				} else if (aText == 'Unlocked Pre-Tracking') {
					aNum = 0;
				} else {
					aNum = aText.isaReplaceAll('/', '').isaReplaceAll(':', '').isaReplaceAll(' ', '');
				}
				var bNum = 0;
				if (bText == 'Locked') {
					bNum = 99999999999999;
				} else if (bText == 'Unlocked') {
					bNum = 88888888888888;
				} else if (bText == 'Unlocked Pre-Tracking') {
					bNum = 0;
				} else {
					bNum = bText.isaReplaceAll('/', '').isaReplaceAll(':', '').isaReplaceAll(' ', '');
				}
				return aNum - bNum;
			});
			if (detailCell !== false) {
				var timesCheck1 = [], timesCheck2 = [], times = 0, duplicateTimes = 0;
				$(rows).each(function() {
					var rowTime = $(this).find('td:eq(' + column + ')').text();
					if (rowTime != 'Locked' && rowTime != 'Unlocked' && rowTime != 'Unlocked Pre-Tracking') {
						times++;
						if (jQuery.inArray(rowTime, timesCheck1) == -1) {
							timesCheck1.push(rowTime);
						} else {
							duplicateTimes++;
							if (jQuery.inArray(rowTime, timesCheck2) == -1) {
								timesCheck2.push(rowTime);
							}
						}
					}
				});
				duplicateTimes += timesCheck2.length;
				var ratio = duplicateTimes / times;
				if (ratio >= 0.5) {
					var dupPercent = Math.round((duplicateTimes * 10000) / times) / 100;
					var dupPercentStr = duplicateTimes + ' / ' + times + ' (' + dupPercent + '%) duplicate times';
					var percentSpan = '';
					if (ratio >= 0.9) {
						percentSpan = '<span class="isaSpanRed">' + dupPercentStr + '</span>';
					} else if (ratio > 0.75) {
						percentSpan = '<span class="isaSpanOra">' + dupPercentStr + '</span>';
					} else {
						percentSpan = '<span class="isaSpanYel">' + dupPercentStr + '</span>';
					}
					$(detailCell).append('<div class="isaStat" title="Possible cheater">' + percentSpan + '</div>');
				}
			}
			for (var i = rows.length - 1; i >= 1; i--) {
				var dateLaterString = $(rows[i]).find('td:eq(' + column + ') > span:eq(0)').text();
				var dateFirstString = $(rows[i - 1]).find('td:eq(' + column + ') > span:eq(0)').text();
				var skipFirst = dateFirstString == 'Locked' || dateFirstString == 'Unlocked' || dateFirstString == 'Unlocked Pre-Tracking';
				var skipLater = dateLaterString == 'Locked' || dateLaterString == 'Unlocked' || dateLaterString == 'Unlocked Pre-Tracking';
				if (!(skipFirst || skipLater)) {
					$(rows[i]).find('td:eq('+column+')').append('<br />' + htmlDateDifference(textStringToDate(dateLaterString), textStringToDate(dateFirstString)));
				}
			}
			for (var i = 0, l = rows.length - 1; i <= l; i++) {
				var dateString = $(rows[i]).find('td:eq(' + column + ') > span:eq(0)').text();
				if (dateString != 'Locked' && dateString != 'Unlocked' && dateString != 'Unlocked Pre-Tracking') {
					$(rows[i]).find('td:eq(' + column + ') span:eq(0)').attr('title', 'Date-Time Unlocked (' + textTimeAgo(textStringToDate(dateString)) + ')');
				}
			}
			var rank = 1;
			var marked = 0;
			var lastDate = '';
			for (var i = 0, l = rows.length; i < l; i++) {
				var thisDate = $(rows[i]).find('td:eq(' + column + ') > span:eq(0)').text();
				if (thisDate == 'Locked' || thisDate == 'Unlocked') {
					// do nothing
				} else if (thisDate == 'Unlocked Pre-Tracking') {
					marked++;
				} else if (thisDate == lastDate) {
					$(rows[i]).find('td:eq(' + column + ')').append('<br /><span title="Place in the unlock history this achievement was unlocked.">' + rank.toSuffixedString() + '</span>');
					marked++;
				} else {
					rank = marked + 1;
					$(rows[i]).find('td:eq(' + column + ')').append('<br /><span title="Place in the unlock history this achievement was unlocked.">' + rank.toSuffixedString() + '</span>');
					marked++;
					lastDate = thisDate;
				}
			}
		} else if (rows.length == 1 && $(rows[0]).find('td').length > 1) {
			var cell = $(rows[0]).find('td:eq(' + column + ')');
			var dateString = $(cell).find('span:eq(0)').text();
			if (dateString != 'Locked' && dateString != 'Unlocked' && dateString != 'Unlocked Pre-Tracking') {
				$(cell).find('span:eq(0)').attr('title', 'Date-Time Unlocked (' + textTimeAgo(textStringToDate(dateString)) + ')');
				$(cell).append('<br /><span title="Place in the unlock history this achievement was unlocked.">1st</span>');
			}
		}
	}
	function jsRowHighlight(table) {
		if (typeof(table)==='undefined') { table = 'table#isaSecondTable'; }
		$(table).find('tbody > tr').hover(
			function () { $(this).addClass('isaHoverHighlight'); },
			function () { $(this).removeClass('isaHoverHighlight'); }
		);
	}
	function jsOptionsMenuSave() {
		var temp1 = $('#isaSettingsDialog input:eq(0)').val().trim();
		meName = (temp1 == '' ? false : temp1);
		var temp2 = $('#isaSettingsDialog input:eq(1)').val().trim();
		meSteamId = (temp2 == '' ? false : temp2);
		var temp3 = $('#isaSettingsDialog input:eq(2)').val().trim();
		meUrlBit = (temp3 == '' ? false : temp3);
		titleDelim = $('#isaSettingsDialog input:eq(3)').val();
		linkDelim = $('#isaSettingsDialog input:eq(4)').val();

		GM_setValue('isaDataMeName', meName);
		GM_setValue('isaDataMeSteamId', meSteamId);
		GM_setValue('isaDataMeUrlBit', meUrlBit);
		GM_setValue('isaDataTitleDelim', titleDelim);
		GM_setValue('isaDataLinkDelim', linkDelim);
	}
	function jsOptionsMenuReset() {
		$('#isaSettingsDialog input:eq(0)').val('');
		$('#isaSettingsDialog input:eq(1)').val('');
		$('#isaSettingsDialog input:eq(2)').val('');
		$('#isaSettingsDialog input:eq(3)').val(defaultTitleDelim);
		$('#isaSettingsDialog input:eq(4)').val(defaultLinkDelim);
	}
	// =======================================================================================================================
	// Link HTML Functions
	function htmlLinksProfile(steamProfileId64) {
		var html = '<span>Steam:</span> ';
		html += '<a title="Steam Profile" href="http://steamcommunity.com/profiles/' + steamProfileId64 + '">Profile</a>' + linkDelim;
		html += '<a title="Games" href="http://steamcommunity.com/profiles/' + steamProfileId64 + '/games/">Games</a>' + linkDelim;
		html += '<a title="Games - All" href="http://steamcommunity.com/profiles/' + steamProfileId64 + '/games?tab=all">All Games</a>' + linkDelim;
		html += '<a title="Screenshots" href="http://steamcommunity.com/profiles/' + steamProfileId64 + '/screenshots/?appid=0&sort=newestfirst&browsefilter=myfiles&view=grid">Screenshots</a>' + linkDelim;
		html += '<a title="Videos" href="http://steamcommunity.com/profiles/' + steamProfileId64 + '/videos/">Videos</a>' + linkDelim;
		html += '<a title="Artwork" href="http://steamcommunity.com/profiles/' + steamProfileId64 + '/images/">Artwork</a>' + linkDelim;
		html += '<a title="Reviews" href="http://steamcommunity.com/profiles/' + steamProfileId64 + '/recommended/">Reviews</a>' + linkDelim;
		html += '<a title="Guides" href="http://steamcommunity.com/profiles/' + steamProfileId64 + '/myworkshopfiles/?section=guides">Guides</a>' + linkDelim;
		html += '<a title="Workshop Items" href="http://steamcommunity.com/profiles/' + steamProfileId64 + '/myworkshopfiles/">Workshop Items</a>' + linkDelim;
		html += '<a title="Greenlight Items" href="http://steamcommunity.com/profiles/' + steamProfileId64 + '/myworkshopfiles/?section=greenlight">Greenlight Items</a>' + linkDelim;
		html += '<a title="Friends" href="http://steamcommunity.com/profiles/' + steamProfileId64 + '/friends/">Friends</a>' + linkDelim;
		html += '<a title="Groups" href="http://steamcommunity.com/profiles/' + steamProfileId64 + '/groups/">Groups</a>' + linkDelim;
		html += '<a title="Inventory" href="http://steamcommunity.com/profiles/' + steamProfileId64 + '/inventory/">Inventory</a>' + linkDelim;
		html += '<a title="All Comments" href="http://steamcommunity.com/profiles/' + steamProfileId64 + '/allcomments">All Comments</a>' + linkDelim;
		html += '<a title="Name History" href="http://steamcommunity.com/profiles/' + steamProfileId64 + '/namehistory">Name History</a>' + linkDelim;
		html += '<a title="Friends in Common" href="http://steamcommunity.com/profiles/' + steamProfileId64 + '/friendscommon">Friends in Common</a>' + linkDelim;
		html += '<a title="Groups in Common" href="http://steamcommunity.com/profiles/' + steamProfileId64 + '/groupscommon">Groups in Common</a>' + linkDelim;
		html += '<a title="Badges" href="http://steamcommunity.com/profiles/' + steamProfileId64 + '/badges/">Badges</a>' + linkDelim;
		html += '<a title="Wishlist" href="http://steamcommunity.com/profiles/' + steamProfileId64 + '/wishlist/">Wishlist</a>';
		html += '<br /><span>Third Party:</span> ';
		html += '<a title="SteamRep" href="http://steamrep.com/profiles/' + steamProfileId64 + '">SteamRep</a>' + linkDelim;
		html += '<a title="SteamDB" href="http://steamdb.info/calculator/?player=' + steamProfileId64 + '">SteamDB</a>' + linkDelim;
		html += '<a title="Achievement Stats" href="http://www.achievementstats.com/index.php?action=profile&playerId=' + steamProfileId64 + '">Achievement Stats</a>' + linkDelim;
		html += '<a title="astats.nl" href="http://astats.astats.nl/astats/User_Info.php?steamID64=' + steamProfileId64 + '">astats.nl</a>';
		return html;
	}
	function htmlLinksGameShort(steamAppId, gameName, steamProfileId64, steamUrlBit) {
		if (typeof(steamUrlBit)==='undefined' || steamUrlBit === false) { steamUrlBit = steamAppId; }
		if (typeof(steamProfileId64)==='undefined') { steamProfileId64 = false; }
		var html = '';
		html += '<a title="Steam Store" href="http://store.steampowered.com/app/' + steamAppId + '">Steam Store</a>' + linkDelim;
		html += '<a title="Steam Hub" href="http://steamcommunity.com/app/' + steamAppId + '">HUB</a>' + linkDelim;
		html += '<a title="Steam Achievements" href="http://steamcommunity.com/stats/' + steamUrlBit + '/achievements">Achievements</a>' + linkDelim;
		if (steamProfileId64 !== false) {
			html += '<a title="Player Achievements on Steam" href="http://steamcommunity.com/profiles/' + steamProfileId64 + '/stats/' + steamUrlBit + '/achievements">Player</a>' + linkDelim;
		}
		html += '<a title="Steam Hub Guides" href="http://steamcommunity.com/app/' + steamAppId + '/guides/">Steam Guides</a>' + linkDelim;
		html += '<a title="AchievementStats.com" href="http://www.achievementstats.com/index.php?action=games&gameId=' + steamAppId + '">Achievement Stats</a>' + linkDelim;
		html += '<a title="AStats.nl" href="http://astats.astats.nl/astats/Steam_Game_Info.php?AppID=' + steamAppId + '">AStats</a>' + linkDelim;
		html += '<a title="SteamDB.info" href="http://steamdb.info/app/' + steamAppId + '/">SteamDB</a>';
		return html;
	}
	function htmlLinksGameLong(gameAppId, gameName, steamUrlBit, steamProfiles) {
		if (typeof(steamUrlBit)==='undefined' || steamUrlBit === false) { steamUrlBit = gameAppId; }
		if (typeof(steamProfiles)==='undefined') { steamProfiles = false; }
		var html = '<span>Steam:</span> ';
		html += '<a title="Steam Store" href="http://store.steampowered.com/app/' + gameAppId + '">Store</a>' + linkDelim;
		html += '<a title="Steam DLC" href="http://store.steampowered.com/dlc/' + gameAppId + '">DLC</a>' + linkDelim;
		html += '<a title="Steam Store - Similar items" href="http://store.steampowered.com/recommended/morelike/app/' + gameAppId + '">Similar</a>' + linkDelim;
		html += '<a title="Steam HUB" href="http://steamcommunity.com/app/' + gameAppId + '">Hub</a>' + linkDelim;
		html += '<a title="Steam Forum" href="http://store.steampowered.com/forum/' + gameAppId + '">Forum</a>' + linkDelim;
		html += '<a title="News on Steam" href="http://store.steampowered.com/news/?appids=' + gameAppId + '">News</a>' + linkDelim;
		html += '<a title="Steam Market Search" href="http://steamcommunity.com/market/search?q=' + gameName + '">Market</a>' + linkDelim;
		html += '<span>Achievements:</span> ';
		html += '<a title="" href="http://steamcommunity.com/stats/' + steamUrlBit + '/achievements">Global</a>';
		if (steamProfiles !== false && $.isArray(steamProfiles)) {
			for (var i = 0; i < steamProfiles.length; i++) {
				var person = steamProfiles[i];
				if(person[1] !== false || person[2] !== false) {
					var nameLabelA = person[0] === false ? 'Me' : person[0];
					var nameLabelB = person[0] === false ? 'My' : person[0] + '\'s';
					var tempUrlBit = person[2] !== false ? 'id/' + person[2] : 'profiles/' + person[1];
					html += linkDelim + '<a title="' + nameLabelB + ' Achievements on Steam" href="http://steamcommunity.com/' + tempUrlBit + '/stats/' + steamUrlBit + '/achievements">' + nameLabelA + ' on Steam</a>';
					html += linkDelim + '<a title="' + nameLabelB + ' XML Unlock History" href="http://steamcommunity.com/' + tempUrlBit + '/stats/' + steamUrlBit + '/achievements?xml=1">' + nameLabelB + ' XML</a>';
					if (person[1] !== false) {
						html += linkDelim + '<a title="' + nameLabelB + ' Achievements on Astats" href="http://www.achievementstats.com/index.php?action=profile&playerId=' + person[1] + '&mode=history&gameId=' +
							gameAppId + '">' + nameLabelA + ' on Astats</a>';
					}
				}
			}
		}
		html += '<br /><span>Steam HUB:</span> ';
		html += '<a title="Steam Hub" href="http://steamcommunity.com/app/' + gameAppId + '/">Steam Hub</a>' + linkDelim;
		html += '<a title="Steam Hub Discussions" href="http://steamcommunity.com/app/' + gameAppId + '/discussions/">Discussions</a>' + linkDelim;
		html += '<a title="Steam Hub Screenshots" href="http://steamcommunity.com/app/' + gameAppId + '/screenshots/">Screenshots</a>' + linkDelim;
		html += '<a title="Steam Hub Artwork" href="http://steamcommunity.com/app/' + gameAppId + '/images/">Artwork</a>' + linkDelim;
		html += '<a title="Steam Hub Videos" href="http://steamcommunity.com/app/' + gameAppId + '/videos">Videos</a>' + linkDelim;
		html += '<a title="Steam Hub News" href="http://steamcommunity.com/app/' + gameAppId + '/news">News</a>' + linkDelim;
		html += '<a title="Steam Hub Announcements" href="http://steamcommunity.com/app/' + gameAppId + '/announcements">Announcements</a>' + linkDelim;
		html += '<a title="Steam Hub Guides" href="http://steamcommunity.com/app/' + gameAppId + '/guides/">Guides</a>' + linkDelim;
		html += '<a title="Steam Hub Reviews" href="http://steamcommunity.com/app/' + gameAppId + '/reviews/">Reviews</a>';
		html += '<br /><span>Third Party:</span> ';
		html += '<a title="AchievementStats.com" href="http://www.achievementstats.com/index.php?action=games&gameId=' + gameAppId + '">Achievement Stats</a>' + linkDelim;
		html += '<a title="Official Site for the Game" href="http://store.steampowered.com/appofficialsite/' + gameAppId + '">Official Site</a>' + linkDelim;
		html += '<a title="AStats.nl" href="http://astats.astats.nl/astats/Steam_Game_Info.php?AppID=' + gameAppId + '">AStats</a>' + linkDelim;
		html += '<a title="SteamDB.info" href="http://steamdb.info/app/' + gameAppId + '/">SteamDB</a>' + linkDelim;
		html += '<a title="Steam Card Exchange" href="http://www.steamcardexchange.net/index.php?gamepage-appid-' + gameAppId + '">Card Exchange</a>' + linkDelim;
		html += '<a title="SteamCharts.com" href="http://steamcharts.com/app/' + gameAppId + '">SteamCharts</a>' + linkDelim;
		html += '<a title="SteamGraph.net" href="http://steamgraph.net/index.php?action=graph&appid=' + gameAppId + '&from=0">SteamGraph</a>' + linkDelim;
		html += '<a title="SteamSpy" href="http://steamspy.com/app/' + gameAppId + '">SteamSpy</a>' + linkDelim;
		html += '<a title="PC Gaming Wiki" href="http://pcgamingwiki.com/api/appid.php?appid=' + gameAppId + '">PC Gaming Wiki</a>' + linkDelim;
		html += '<a title="News RSS Feed (by getoffmalawn.com)" href="http://www.getoffmalawn.com/steamnews/' + gameAppId + '.atom">RSS News</a>' + linkDelim;
		html += '<a title="GameFAQs.com Search" href="http://www.gamefaqs.com/search/index.html?platform=19&game=' + gameName + '">GameFAQ Search</a>' + linkDelim;
		html += '<a title="HowLongToBeat Search" href="http://howlongtobeat.com/?q=' + gameName + '">HowLongToBeat Search</a>' + linkDelim;
		html += '<a title="IsThereAnyDeal.com Search" href="http://isthereanydeal.com/#/search:' + gameName + ';/scroll:%23gamelist">IsThereAnyDeal</a>';
		return html;
	}
	function htmlLinksDLC(game, dlc) {
		var html = '<span>Steam:</span> ';
		html += '<a href="http://store.steampowered.com/app/' + dlc + '">Store</a>' + linkDelim;
		html += '<a href="http://store.steampowered.com/dlc/' + game + '">DLC</a>' + linkDelim;
		html += '<a href="http://steamcommunity.com/app/' + game + '">Hub</a>' + linkDelim;
		html += '<a href="http://steamcommunity.com/stats/' + game + '/achievements">Achievements</a>' + linkDelim;
		html += '<span>Third Party:</span> ';
		html += '<a title="AchievementStats.com" href="http://www.achievementstats.com/index.php?action=games&gameId=' + game + '">Achievement Stats</a>' + linkDelim;
		html += '<a title="AStats.nl" href="http://astats.astats.nl/astats/Steam_Game_Info.php?AppID=' + game + '">AStats</a>' + linkDelim;
		html += '<a title="Steam DB" href="http://steamdb.info/app/' + dlc + '/">SteamDB.info</a>' + linkDelim;
		html += '<a title="Steam DB" href="http://steamdb.info/app/' + game + '/">SteamDB.info (Parent Game)</a>' + linkDelim;
		html += '<a title="PC Gaming Wiki" href="http://pcgamingwiki.com/api/appid.php?appid=' + game + '">PC Gaming Wiki</a>';
		return html;
	}
	function htmlLinksAch(game, achName, useLabel, gameAppId) {
		if (typeof(useLabel)==='undefined') { useLabel = false; }
		if (typeof(gameAppId)==='undefined') { gameAppId = false; }
		var html = '';
		if (useLabel) {
			html += '<span>Guide Search:</span> ';
		}
		html += '<a title="Search for a Guide on Google" href="http://www.google.com/#q=%22' + game + '%22 %22' + achName + '%22">Google</a>';
		html += (useLabel ? linkDelim : '<br />');
		html += '<a title="Search for a Guide on YouTube" href="https://www.youtube.com/results?search_query=%22' + game + '%22 %22' + achName + '%22">YouTube</a>';
		if (gameAppId !== false) { //http://steamcommunity.com/app/200900/guides/?searchText=Pea+Shooter&browsefilter=trend&requiredtags[]=-1
			html += (useLabel ? linkDelim : '<br />');
			html += '<a title="Search Steam Guides" href="http://steamcommunity.com/app/' + gameAppId + '/guides/?searchText=' + achName + '&browsefilter=trend&requiredtags[]=-1">Guides</a>';
		}
		return html;
	}
	// =======================================================================================================================
	// Universal Stuff: SLG Styles, Custom Tablesort Parser, Title Edit Var
	$('<style></style>').prop('type', 'text/css').html('' +
	'#isaPageWrap { background-color:#222222; padding:10px; border-top:1px solid #000000; background-image: url(' + backTile + '); }' +
	'div.isaTableSpacer {height:10px;} .isaWidth100 { width:100%; }' +
	'h2.isaPageTitleFirst, h2.isaPageTitle { color:#3c9fe5; margin:0; padding:8px 0 2px 0; text-align:center; font-size:24px; font-weight:bold; } ' +
	'form.isaSmallButton {display:block; float:right;} form.isaSmallButton input {display:inline-block; font-size:10px; margin:0 0 0 0;}' +
	'span.isaSpanSmallBold { font-weight:bold; font-size:12px; }' +
	'span.isaSpanRed { color:#ff6161; } span.isaSpanRed2 { color:#f66666; }' +
	'span.isaSpanYel { color:#ffff5e; } span.isaSpanYel2 { color:#d3d325; }' +
	'span.isaSpanBlu { color:#7fb3e9; } span.isaSpanBlu2 { color:#2591ff; }' +
	'span.isaSpanOra { color:#ffae00; } span.isaSpanGre { color:#a6d36a; }' +
	'span.isaSpanPin { color:#ff68e8; }' +
	'table.isaTable { background-color:#000000; border-collapse:separate; border-spacing:1px; }' +
	'table.isaTable td { background-color:#333333; background: linear-gradient(#3A3A3A,#333333); vertical-align:top; padding:2px 4px 3px 4px; color:#EEEEEE;font-size:14px;}' +// border:1px solid #555555;
	'table.isaTable td a:link, table.isaTable td a:visited { color:#7fb3e9;text-decoration: none; } ' +
	'table.isaTable td a:hover, table.isaTable td a:active { color:#ffffff;text-decoration: underline; } ' +
	'table.isaTable th { font-size:16px;background-color:#555555;background:linear-gradient(#5C5C5C,#555555);text-align:center;padding:4px;text-shadow:1px 1px 2px #000000;white-space:nowrap;color:#daf0ff; }' +
	'table.isaTable th a:link, table.isaTable th a:visited { text-decoration: none; } table.isaTable th a:hover, table.isaTable th a:active { text-decoration: underline; } ' +
	'table.isaTable td.isaGameImage { text-align:center; padding:3px; vertical-align:top; width:184px; }' +
	'table.isaTable td.isaGameIcon { text-align:center; padding:3px; vertical-align:top; width:64px; }' +
	'table.isaTable td.isaGameImage img, table.isaTable td.isaGameIcon img { border:1px solid #676767; }' +
	'table.isaTable td.isaTitleCell { background-color:#555555; background: linear-gradient(#5C5C5C,#555555); padding:2px 2px 4px 5px; font-size:24px; font-weight:bold; color:#ffffff; text-shadow:2px 2px 4px #000000; }' +
	'table.isaTable td.isaTitleCell a:link, table.isaTable td.isaTitleCell a:visited { text-decoration: none; color:#24a4ff; }' +
	'table.isaTable td.isaTitleCell a:hover, table.isaTable td.isaTitleCell a:active { text-decoration: underline; }' +
	'table.isaTable td.isaTitleCell div.isaTitleAppend { display:inline-block;padding:0 0 0 15px; font-weight:normal; }' +
	'table.isaTable td.isaLinkContainer { color:#4d4d4d; font-size:12px; text-shadow:1px 1px 2px #000000; padding:3px 5px 3px 5px; } ' +
	'table.isaTable td.isaLinkContainerMid { text-align:center; vertical-align:middle;color:#4d4d4d; font-size:12px; text-shadow:1px 1px 2px #000000; padding:3px 5px 3px 5px; } ' +
	'table.isaTable td.isaLinkContainer span, table.isaTable td.isaLinkContainerMid span { color:#cccccc; font-weight:bold; } ' +
	'table.isaTable td.isaLinkContainerDark { text-align:center; vertical-align:middle;color:#777777; font-size:12px; text-shadow:1px 1px 2px #000000; padding:3px 5px 3px 5px; } ' +
	'table.isaTable td.isaLinkContainerDark a:link, table.isaTable td.isaLinkContainerDark a:visited { color:#777777;text-decoration: none; } ' +
	'table.isaTable td.isaLinkContainerDark a:hover,table.isaTable td.isaLinkContainerDark a:active { color:#FFFFFF;text-decoration: underline; } ' +
	'table.isaTable td.isaStatsCell { padding:4px 0 0 4px; font-size:14px; }' +
	'table.isaTable td.isaStatsCell div.isaStat { display:inline-block;margin:0 4px 4px 0; padding:2px 7px 2px 5px; color:#beffb9; font-weight:bold; }' +
	'table.isaTable td.isaStatsCell div.isaStat span {  color:#CCCCCC; font-weight:normal;  }' +
	'table.isaTable td.isaListGameImage { padding:3px; width:184px; }' +
	'table.isaTable td.isaListAchImage { padding:3px; width:64px; }' +
	'table.isaTable td.isaListAchImage img, table.isaTable td.isaListGameImage img { border:none;padding:0;margin:0;display:block; }' +
	'table.isaTable td.isaListAchs { padding:5px;width:256px; }' +
	'table.isaTable td.isaListNumber { padding:2px 4px 2px 4px;vertical-align:middle;text-align:center;  }' +
	'table.isaTable td.isaListBigNumber { padding:2px 4px 2px 4px;vertical-align:middle;text-align:center;font-weight:bold;font-size:24px; }' +
	'table.isaTable td.isaListSmall { font-size:12px; }' + 'table.isaTable td.isaListSmaller { font-size:10px; }' +
	'table.isaTable td.isaEvenPadding { padding:3px; }' +
	'table.isaTable td.isaStatsLarge { padding:2px 0 0 5px; font-size:18px; font-weight:bold; text-shadow:2px 2px 4px #000000; }' +
	'table.isaTable td.isaStatsLarge div.isaStat { display:inline-block;padding:0 15px 2px 0; color:#cae4ff; font-weight:bold; }' +
	'table.isaTable td.isaListTitle { font-weight:bold;font-size:16px;color:#b9e2ff; }' +
	'table.isaTable td.isaListTitle a:link, table.isaTable td.isaListTitle a:visited {color:#b9e2ff;text-decoration:none;}' +
	'table.isaTable td.isaListTitle a:hover, table.isaTable td.isaListTitle a:active {color:#2591ff;text-decoration:underline;}' +
	'table.isaTable td.isaListAchDetail { font-size:12px;color:#cccccc;text-shadow:1px 1px 1px #000000; }' +
	'table.isaTable td.isaListAchDetail h3 { padding:0 0 1px 0;margin:0;font-weight:bold;font-size:16px;color:#b9e2ff; }' +
	'table.isaTable td.isaListAchDetail h3 a:link, table.isaTable td.isaListAchDetail h3 a:visited {color:#b9e2ff;text-decoration:none;}' +
	'table.isaTable td.isaListAchDetail h3 a:hover, table.isaTable td.isaListAchDetail h3 a:active {color:#2591ff;text-decoration:underline;}' +
	'table.isaTable td.isaListAchDetail span { display:inline-block; padding-top:1px;  }' +
	'table.isaTable tr.isaAchBroken td {background-color:#572424; background: linear-gradient(#632929,#572424);}' +
	'table.isaTable tr.isaAchSeasonal td {background-color:#492e16; background: linear-gradient(#533418,#492e16);}' +
	'table.isaTable tr.isaAchNonRecurring td, table.isaTable tr.isaAchTemporary td {background-color:#38380a; background: linear-gradient(#40400b,#38380a);}' +
	'table.isaTable tr.isaAchMonetary td {background-color:#5f2356; background: linear-gradient(#5f2356,#541e4b);}' +
	'table.isaTable td.isaListShadow { box-shadow:inset 0 0 10px 0 #222; }' +
	'table.isaTable td.isaListTextShadow { text-shadow:2px 2px 4px #000000; }' +
	'table.isaTable td.isaListAchUnlocked { background-color:#243d26; background: linear-gradient(#243d26,#29452b);text-shadow:1px 1px 1px #000000; }' +
	'table.isaTable td.isaBlackedOut { background-color:#111111; background: linear-gradient(#1A1A1A,#111111); color:#777777;font-size:12px; }' +
	'table.isaTable td.isaHideCell, table.isaTable tr.isaHideCell { display:none; } div.isaActionDiv { cursor:pointer; }' +
	'table.isaTable tr.isaHoverHighlight td {box-shadow:0px 0px 10px rgba(255, 255, 255, 0.2) inset;} ' +
	'table.isaTable tr.isaHoverHighlight td.isaListAchDetail, table.isaTable tr.isaHoverHighlight td.isaListAchDetail h3 {text-shadow:1px 1px 1px #000000;} ' +
	'table.isaTable th.tablesorter-headerAsc { background:url("'+arrowDown+'") right 5px center no-repeat, linear-gradient(to bottom,#5C5C5C,#555555); }' +
	'table.isaTable th.tablesorter-headerDesc { background:url("'+arrowUp+'") right 5px center no-repeat, linear-gradient(to bottom,#5C5C5C,#555555); }' +
	'div#isaSettingsContainer { padding:2px 2px 0 0; float: right; display:block; }' +
	'div#isaSettingsButton { width:27px; height:27px; display:block;background-image: url("'+settingsIcon+'");cursor:pointer; }' +
	'.ui-corner-all {border-radius: 0 !important;}' +
	'.ui-dialog { z-index:403 !important; background-color:#333333;color:#EEEEEE;font-size:14px; border:1px solid #000000;box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.5);font-family: Arial,Helvetica,Verdana,sans-serif !important;}' +
	'.ui-dialog-titlebar {font-size:16px;background-color:#555555;background:linear-gradient(#5C5C5C,#555555);padding:4px 4px 4px 7px;text-shadow:1px 1px 2px #000000;color:#daf0ff;'+
		'font-weight:bold; border:none !important;}' +
	'.ui-dialog-titlebar-close {float:right;width:19px;height:19px; background-color:#333333 !important; border:1px solid #222222 !important;background-image:url("'+closeIcon+
		'") !important;background-position:center !important; background-repeat:no-repeat !important; }' +
	'.ui-dialog-titlebar-close:hover {background-color:#0c3551 !important; border:1px solid #333333 !important;} .ui-dialog-titlebar-close span { display: none; }' +
	'.ui-dialog-content {background: linear-gradient(#3A3A3A,#333333);padding:5px;text-shadow:1px 1px 1px #000000;border:none !important;}' +
	'.ui-dialog-content input, .ui-dialog-content textarea {color:#ffffff;background-color:rgba(0, 0, 0, 0.2);border:1px solid #000;border-radius:3px;font-size:12px;font-family: "Courier New", Courier, monospace;margin:0px;}' +
	'.ui-dialog-content fieldset {border:1px solid #000000;} .ui-dialog-content fieldset:not(:first-child) {margin-top:8px;}' +
	'.ui-dialog-content legend { padding:2px 4px 2px 4px;font-weight:bold;}' +
	'.ui-dialog-buttonpane {padding:2px 7px 7px 7px;background-color:none !important;background:none !important;border:none; } .ui-dialog-buttonset {text-align:right;}' +
	'.ui-dialog-buttonset button {margin-left:5px;background: #174a6b !important;text-shadow: 1px 1px 0px #000000;color: #ffffff !important;padding: 2px 10px 2px 10px !important;border: solid #1f628d 1px !important;' +
	'font-family:Arial,Helvetica,Verdana,sans-serif !important;}' +
	'.ui-dialog-buttonset button:hover {background: #3395d7 !important;}' +
	'.ui-widget-overlay { position:absolute;top:0;left:0;width:100%;height:100%;background-color:#000000;opacity:.60;filter:Alpha(Opacity=60);background-image:none !important;}' +
	'div.isaSettingsSetting { height:24px;vertical-align:top; }' +
	'div.isaSettingsSetting label { float:left; }' +
	'div.isaSettingsSetting input { float:right; }' +
	'div.isaSettingsText { height:94px;vertical-align:top; }' +
	'div.isaSettingsText label { float:left; }' +
	'div.isaSettingsText textarea { float:right; }' +
	'').appendTo('head');
	$.tablesorter.addParser({
		id: 'isaDate', is: function (s) { return false; },
		format: function (s, table, cell, cellIndex) {
			s = $(cell).find('span:eq(0)').text();
			if (s == 'Locked') { return 99999999999999; }
			if (s == 'Unlocked') { return 88888888888888; }
			if (s == 'Unlocked Pre-Tracking') { return 0; }
			s = s.isaReplaceAll('/', '').isaReplaceAll(':', '').isaReplaceAll(' ', '');
			return s;
		}, type: 'numeric'
	});
	$.tablesorter.addParser({
		id: 'isaAstatsPoint', is: function (s) { return false; },
		format: function (s) {
			if (!(s > 0)) { return 99; }
			return s;
		}, type: 'numeric'
	});
	$('body').append('<div id="isaSettingsDialog" title="Improved Steam Achievements - Settings"><fieldset style="width:600px;"><legend>My Details:</legend>' +
		'<div class="isaSettingsSetting"><label for="isaMyName">Name</label><input name="isaMyName" type="text" id="isaMyName" style="width:470px;" /></div>' +
		'<div class="isaSettingsSetting"><label for="isaMySteamId">Steam 64 ID:</label><input name="isaMySteamId" type="text" id="isaMySteamId" style="width:470px;" /></div>' +
		'<div class="isaSettingsSetting"><label for="isaMySteamBit">Steam URL Bit:</label><input name="isaMySteamBit" type="text" id="isaMySteamBit" style="width:470px;" /></div>' +
		'</fieldset><fieldset style="width:600px;"><legend>Deliminators:</legend>' +
		'<div class="isaSettingsSetting"><label for="isaDelimTitle">Title Deliminator:</label><input name="isaDelimTitle" type="text" id="isaDelimTitle" style="width:470px;" /></div>' +
		'<div class="isaSettingsSetting"><label for="isaDelimLink">Link Deliminator:</label><input name="isaDelimLink" type="text" id="isaDelimLink" style="width:470px;" /></div>' +
		'</fieldset></div>');
	$('#isaSettingsDialog input:eq(0)').val((meName === false ? '' : meName));
	$('#isaSettingsDialog input:eq(1)').val((meSteamId === false ? '' : meSteamId));
	$('#isaSettingsDialog input:eq(2)').val((meUrlBit === false ? '' : meUrlBit));
	$('#isaSettingsDialog input:eq(3)').val(titleDelim);
	$('#isaSettingsDialog input:eq(4)').val(linkDelim);
	$('#isaSettingsDialog').dialog({
		modal:true, resizable: false, autoOpen: false, width: 634, position: { my: "center top", at: "center top+120", of: window },
		buttons: [
			{ text: "Reset To Defaults", click: function() { jsOptionsMenuReset(); } },
			{ text: "Save Settings", click: function() { jsOptionsMenuSave(); } },
			{ text: "Close", click: function() { $( this ).dialog( "close" ); } }
		]
	});
	var settingsButton = $('<div id="isaSettingsContainer"><div id="isaSettingsButton" title="Improved Steam Achievements - Settings"></div></div>');
	$(settingsButton).find('#isaSettingsButton').click(function() {$('#isaSettingsDialog').dialog('open');});
	$(settingsButton).find('#isaSettingsButton').hover(
		function() { $(this).css('background-image', 'url('+settingsIconHover+')');},
		function() { $(this).removeAttr('style'); }
	);
	// =======================================================================================================================
	// Achievement Stats Pages - Changes to All Astats Pages
	if (urlContains('achievementstats.com') && window.top == window.self) {
		$('body').css('font-family', 'Arial');
		//$('body').children().not(':first-child').wrapAll('<div id="isaPageWrap" />');
		$('div#menuBar').nextAll().not('script').not('link').wrapAll('<div id="isaPageWrap" />');
		//$('table').addClass('isaTable');
		// ===================================================================================================================
		// Achievement Stats - Profile Page
		if (urlContains('action=profile') && urlContains('playerId=') && window.location.search.substring(1).split('&').length == 2) {
			// Get Info and Elements
			var formButton = $('#isaPageWrap > :first-child').detach();
			var titleProfileName = $('#isaPageWrap > :first-child').detach().text();
			var ul = $('#isaPageWrap > :first-child').detach();
			var featureImage = $('#isaPageWrap > :first-child').detach();
			var pieChart = $('#isaPageWrap > :first-child').detach().removeAttr('style').css({ 'width': '260px' });
			var statsTable = $('#isaPageWrap > :first-child').detach();
			if ($('#isaPageWrap > :first-child').text().indexOf('summary') != -1) {
				$('#isaPageWrap > :first-child').remove();
				$('#isaPageWrap > :first-child').remove();
			}
			var steamProfileId64 = document.URL.split('playerId=')[1].split('&')[0].split('?')[0].split('#')[0];
			$('#isaPageWrap > :first-child').remove();
			$('#isaPageWrap > :first-child').css('margin', '3px');
			$('#isaPageWrap > table:eq(0)').attr('id', 'isaSecondTable').removeAttr('style').addClass('isaTable isaWidth100');
			$(featureImage).removeAttr('style').find('img').removeAttr('style');
			$(formButton).removeAttr('style').addClass('isaSmallButton');
			$(formButton).find('input').removeAttr('style').attr('value', 'queue profile for update').attr('title', 'Queue this Profile for Update');
			// Make Header Table
			var isaTopTable = $('<table class="isaTable isaWidth100" id="isaTopTable">' +
				'<tr><td rowspan="5" class="isaGameImage"></td><td class="isaTitleCell"></td><td rowspan="5"></td></tr>' +
				'<tr><td class="isaStatsLarge"></td></tr><tr><td class="isaLinkContainer"></td></tr><tr><td class="isaLinkContainer"></td></tr><tr><td class="isaStatsCell"></td></tr></table>');
			$(isaTopTable).find('td:eq(0)').append(featureImage);
			$(isaTopTable).find('td:eq(1)').text(titleProfileName).attr('title', titleProfileName + ' - Profile');
			$(isaTopTable).find('td:eq(1)').prepend(settingsButton);
			$(isaTopTable).find('td:eq(2)').append(pieChart).css({ 'width':'264px', 'vertical-align':'top', 'overflow':'hidden' });
			$(isaTopTable).find('td:eq(4)').html(htmlLinksProfile(steamProfileId64));
			$(isaTopTable).find('td:eq(5)').html('<span>Achievement Stats Controls: </span> ' + htmlFromUl(ul));
			$(isaTopTable).find('td:eq(5)').append(formButton);
			$(statsTable).find('tr').each(function() {
				var statLabel = $(this).find('th:eq(0)').text().trim();
				var statText = $(this).find('td:eq(0)').html();
				if (statLabel == 'Achievements') {
					var statTextParts = statText.split('(');
					statTextParts[0] = statTextParts[0].trim();
					if (statTextParts[0].length > 0) {
						$(isaTopTable).find('td:eq(3)').append('<div class="isaStat" title="Total Achievements Unlocked">' + statTextParts[0] + ' achieved</div>');
						$(isaTopTable).find('td:eq(3)').append('<div class="isaStat" title="Total Astats Points Earned">' + statTextParts[1].replace(' points)', '') + ' points</div>');
					} else {
						$(isaTopTable).find('td:eq(3)').append('<div class="isaStat" title="Total Achievements Unlocked"><span class="isaSpanRed">0 achieved</span></div>');
						$(isaTopTable).find('td:eq(3)').append('<div class="isaStat" title="Total Astats Points Earned"><span class="isaSpanRed">0 points</span></div>');
					}
				} else if (statLabel == 'Completion rate') {
					statText = statText.replace(' ', '').replace('%', '');
					var statPercent = statText / 100;
					$(isaTopTable).find('td:eq(3)').append('<div class="isaStat" title="The average percentage of achievements earned per game/DLC.">' + htmlPercentStr(statText + '% average completion', statPercent) + '</div>');
				} else {
					$(isaTopTable).find('td:eq(6)').append('<div class="isaStat"><span>' + statLabel + ':</span> ' + statText + '</div>');
				}
			});
			var detailLastUpdated = $('table#isaSecondTable').next().detach().text().trim();
			if (detailLastUpdated.length > 0) { // profiles not yet crawled have this detail blank (length zero)
				$(isaTopTable).find('td:eq(6)').append('<div class="isaStat">' + detailLastUpdated + '</div>');
			}
			$(isaTopTable).find('td:eq(6)').append('<div class="isaStat">' + $('table#isaSecondTable').next().detach().text() + '</div>');// Next automatic update
			// Append and Title
			$('#isaPageWrap').prepend(isaTopTable);
			document.title = titleProfileName + titleDelim + 'Profile';
			titleDone = true;
			// Second Table thead Adjustment
			$('table#isaSecondTable').prepend('<thead></thead>');
			$('table#isaSecondTable > thead').append($('table#isaSecondTable > tbody > tr:lt(2)').detach());
			$('table#isaSecondTable > thead > tr:eq(0)').append('<th rowspan="2">Links</th>');
			$('table#isaSecondTable > thead > tr:eq(0) > th:eq(3)').css('width', '40px');
			$('table#isaSecondTable > thead > tr:eq(0) > th:eq(4)').css('width', '230px');
			$('table#isaSecondTable > thead > tr:eq(1) > th:eq(1)').css('width', '40px');
			$('table#isaSecondTable > thead > tr:eq(1) > th:eq(2)').css('width', '60px');
			$('table#isaSecondTable > thead > tr:eq(1) > th:eq(4)').css('width', '40px');
			$('table#isaSecondTable > thead > tr:eq(1) > th:eq(5)').css('width', '60px');
			// Second Table tbody Adjustment
			var completedGames = 0;
			if ($('table#isaSecondTable > tbody > tr:eq(0) > td').length > 1) {
				$('table#isaSecondTable > tbody > tr').each(function (index) {
					if ($(this).find('td:eq(6)').text() == '0') {
						completedGames++;
					}
					var gameAppId = $(this).find('td:eq(1) > a').attr('href').split('gameId=')[1];
					var gameName = $(this).find('td:eq(1) > a').text();
					var newCell = $('<td class="isaLinkContainer"></td>').html(htmlLinksGameShort(gameAppId, gameName, steamProfileId64, false));
					$(this).append(newCell);
					$(this).find('td:eq(0)').addClass('isaListGameImage');
					$(this).find('td:eq(1)').addClass('isaListTitle');
					$(this).find('td:eq(2)').addClass('isaListAchs');
					$(this).find('td:eq(3)').addClass('isaListNumber');
					$(this).find('td:eq(4)').addClass('isaListNumber');
					$(this).find('td:eq(5)').addClass('isaListAchs');
					$(this).find('td:eq(6)').addClass('isaListNumber');
					$(this).find('td:eq(7)').addClass('isaListNumber');
					$(this).find('td:eq(8)').addClass('isaListNumber');
				});
				$('table#isaTopTable td:eq(3)').append('<div class="isaStat" title="Games where this player has gotten every achievement.">' +
					(completedGames > 0 ? '<span class="isaSpanGre">' + completedGames : '<span class="isaSpanRed">0') + ' completed</span></div>');
				jsRowHighlight('table#isaSecondTable');
			} else {
				$('table#isaSecondTable > tbody > tr:eq(0) > td:eq(0)').attr('colspan','10');
			}
		}
		// ===================================================================================================================
		// Achievement Stats - Game Page / DLC Page
		if (urlContains('action=games') && urlContains('gameId=') && window.location.search.substring(1).split('&').length == 2) {
			var titleGameName = '';
			$('#isaPageWrap > form > table:eq(0)').attr('id', 'isaSecondTable').removeAttr('style').addClass('isaTable isaWidth100');
			if ($('#isaPageWrap > form').length == 3) { // Game Page
				// Get Info and Elements
				//alert("sdsadsdf");
				var formButton = $('#isaPageWrap > :first-child').detach();
				titleGameName = $('#isaPageWrap > :first-child').detach().text();
				var featureImage = $('#isaPageWrap > :first-child').detach().find('a:eq(0)');
				var dlcElement = $('#isaPageWrap > :first-child').is('p') ? $('#isaPageWrap > :first-child').detach() : false;
				var ulElement = $('#isaPageWrap > :first-child').detach();
				var detailCompletionTime = $('#isaPageWrap > :first-child').detach().text();
				var detail = $('#isaPageWrap > :first-child').find('table > caption:eq(0)').detach().text();
				var detailAchCount = detail.split(' achievements ')[0];
				var detailAchPoints = detail.split('worth of ')[1].split(' points')[0];
				var gameId = document.URL.split('gameId=')[1].split('&')[0].split('?')[0].split('#')[0];
				var detailDlcUpdated = $('#isaPageWrap > form:eq(0)').next().detach().text();
				var detailNextUpdate = $('#isaPageWrap > form:eq(0)').next().detach().text();
				$(featureImage).removeAttr('style').find('img').removeAttr('style');
				$(formButton).removeAttr('style').addClass('isaSmallButton');
				$(formButton).find('input').removeAttr('style').attr('value', 'update dlc').attr('title', 'Queue this Game for DLC Update');
				// Make Header Table
				var isaTopTable = $('<table class="isaTable isaWidth100" id="isaTopTable">' +
					'<tr><td rowspan="5" class="isaGameImage"></td><td class="isaTitleCell"></td></tr>' +
					'<tr><td class="isaStatsLarge"></td></tr><tr><td class="isaLinkContainer"></td></tr><tr><td class="isaLinkContainer"></td></tr><tr><td class="isaStatsCell"></td></tr></table>');
				$(isaTopTable).find('td:eq(0)').append(featureImage);
				$(isaTopTable).find('td:eq(1)').text(titleGameName).attr('title', 'Achievements for ' + titleGameName);
				$(isaTopTable).find('td:eq(1)').prepend(settingsButton);
				$(isaTopTable).find('td:eq(2)').append('<div class="isaStat">' + detailAchCount + ' achievement'+ (detailAchCount == 1 ? '' : 's') + '</div>');
				$(isaTopTable).find('td:eq(2)').append('<div class="isaStat" title="Astats Point Value of all Achievements">' + detailAchPoints + ' points</div>');
				$(isaTopTable).find('td:eq(3)').html(htmlLinksGameLong(gameId, titleGameName, false, achPeople));
				$(isaTopTable).find('td:eq(4)').html('<span>Achievement Stats Controls: </span> ' + htmlFromUl(ulElement)).append(formButton);
				$(isaTopTable).find('td:eq(5)').append('<div class="isaStat"><span>Average Time Needed for Completion: </span> ' + detailCompletionTime.replace('average hours needed for completion.', '') + 'hours</div>');
				$(isaTopTable).find('td:eq(5)').append('<div class="isaStat"><span>DLC Last Updated:</span> ' + detailDlcUpdated.split('updated on')[1] + '</div>');
				$(isaTopTable).find('td:eq(5)').append('<div class="isaStat"><span>Next Automatic Update:</span> ' + detailNextUpdate.split('update on')[1] + '</div>');
				if (dlcElement !== false) {
					$(isaTopTable).find('td:eq(0)').attr('rowspan', '6');
					$(isaTopTable).find('tr:eq(1)').after('<tr><td></td></tr>');
					$(isaTopTable).find('td:eq(3)').addClass('isaEvenPadding').html(dlcElement.html());
				}
				// Append and Title
				$('#isaPageWrap').prepend('<div class="isaTableSpacer"></div>');
				$('#isaPageWrap').prepend(isaTopTable);
				document.title = titleGameName + titleDelim + 'Game';
				titleDone = true;
			} else { // DLC Page
				// Get Info and Elements
				titleGameName = $('#isaPageWrap > :first-child').detach().text();
				var featureImage = $('#isaPageWrap > :first-child').detach().find('a:eq(0)');
				var parentGame = $('#isaPageWrap > :first-child').detach();
				var ulElement = $('#isaPageWrap > :first-child').detach();
				var detail = $('#isaPageWrap > :first-child').find('table > caption:eq(0)').detach().text();
				var detailAchCount = detail.split(' achievements ')[0];
				var detailAchPoints = detail.split('worth of ')[1].split(' points')[0];
				var gameId = parentGame.find('a').attr('href').split('gameId=')[1].split('&')[0].split('?')[0].split('#')[0];
				var dlcId = document.URL.split('gameId=')[1].split('&')[0].split('?')[0].split('#')[0];
				// Make Header Table
				var isaTopTable = $('<table class="isaTable isaWidth100" id="isaTopTable">' +
					'<tr><td rowspan="5" class="isaGameImage"></td><td class="isaTitleCell"></td></tr>' +
					'<tr><td class="isaStatsLarge"></td></tr><tr><td class="isaEvenPadding"></td></tr><tr><td class="isaLinkContainer"></td></tr><tr><td class="isaLinkContainer"></td></tr></table>');
				$(featureImage).removeAttr('style').find('img').removeAttr('style');
				$(isaTopTable).find('td:eq(0)').append(featureImage);
				$(isaTopTable).find('td:eq(1)').append(document.createTextNode(titleGameName)).attr('title', 'Achievements for ' + titleGameName);
				$(isaTopTable).find('td:eq(1)').prepend(settingsButton);
				$(isaTopTable).find('td:eq(2)').append('<div class="isaStat">DLC</div>');
				$(isaTopTable).find('td:eq(2)').append('<div class="isaStat">' + detailAchCount + ' achievement'+ (detailAchCount == 1 ? '' : 's') + '</div>');
				$(isaTopTable).find('td:eq(2)').append('<div class="isaStat" title="Astats Point Value of all Achievements">' + detailAchPoints + ' points</div>');
				$(isaTopTable).find('td:eq(3)').html(parentGame.html());
				$(isaTopTable).find('td:eq(4)').html(htmlLinksDLC(gameId, dlcId));
				$(isaTopTable).find('td:eq(5)').html('<span>Achievement Stats Controls: </span> ' + htmlFromUl(ulElement));
				// Append and Title
				$('#isaPageWrap').prepend('<div class="isaTableSpacer"></div>');
				$('#isaPageWrap').prepend(isaTopTable);
				document.title = titleGameName + titleDelim + 'DLC';
				titleDone = true;
			}
			// More Info to Header Table
			var brokenCount = $('table#isaSecondTable > tbody > tr.broken').length;
			if (brokenCount > 0) {
				$('table#isaTopTable td:eq(2)').append('<div class="isaStat" title="Broken Achievements cannot be unlocked."><span class="isaSpanRed">' +
					brokenCount + ' broken achievement' + (brokenCount == 1 ? '' : 's') + '</span></div>');
			}
			var seasonalCount = $('table#isaSecondTable > tbody > tr.seasonal').length;
			if (seasonalCount > 0) {
				$('table#isaTopTable td:eq(2)').append('<div class="isaStat" title="Seasonal Achievements can only be unlocked unlocked at certain times."><span class="isaSpanYel">' +
					seasonalCount + ' seasonal achievement' + (seasonalCount == 1 ? '' : 's') + '</span></div>');
			}
			var nonrecurringCount = $('table#isaSecondTable > tbody > tr.nonrecurring').length;
			if (nonrecurringCount > 0) {
				$('table#isaTopTable td:eq(2)').append('<div class="isaStat" title="Non-Recurring Achievements were unlockable for a certain time, but that time has passed."><span class="isaSpanOra">' +
					nonrecurringCount + ' non-recurring achievement' + (nonrecurringCount == 1 ? '' : 's') + '</span></div>');
			}
			var temporaryCount = $('table#isaSecondTable > tbody > tr.temporary').length;
			if (temporaryCount > 0) {
				$('table#isaTopTable td:eq(2)').append('<div class="isaStat" title="Temporary Achievements are planned to be removed of changed."><span class="isaSpanYel">' +
					temporaryCount + ' temporary achievement' + (temporaryCount == 1 ? '' : 's') + '</span></div>');
			}
			var monetaryCount = $('table#isaSecondTable > tbody > tr.monetary').length;
			if (monetaryCount > 0) {
				$('table#isaTopTable td:eq(2)').append('<div class="isaStat" title="Monetary Achievements require a purchase to unlock."><span class="isaSpanPin">' +
					monetaryCount + ' monetary achievement' + (monetaryCount == 1 ? '' : 's') + '</span></div>');
			}
			// Second Table thead Adjustment
			$('<th rowspan="2">Links</th>').insertAfter($('table#isaSecondTable > thead > tr:eq(0) > th:eq(3)'));
			$('table#isaSecondTable > thead > tr:eq(0) > th:eq(2)').detach().insertAfter($('table#isaSecondTable > thead > tr:eq(0) > th:eq(3)'));//move crawled th
			$('table#isaSecondTable > thead > tr:eq(0) > th:eq(1)').remove();// remove desc th
			$('table#isaSecondTable > thead > tr > th:eq(0)').removeAttr('class');
			$('table#isaSecondTable > thead > tr > th:eq(1)').css('width', colWidUnlockPoint + 'px').removeAttr('class').attr('data-sorter', 'isaAstatsPoint');
			$('table#isaSecondTable > thead > tr > th:eq(2)').css('width', colWidUnlockLink + 'px').attr('data-sorter', 'false');
			$('table#isaSecondTable > thead > tr > th:eq(3)').css('width', '110px').removeAttr('class').attr('data-sorter', 'false');
			$('table#isaSecondTable > thead > tr > th:eq(4)').css('width', '96px').removeAttr('class').attr('data-sorter', 'false');
			// Second Table tbody Adjustment
			if ($('table#isaSecondTable > tbody > tr:eq(0) > td').length > 1) {
				$('table#isaSecondTable > tbody > tr').each(function (index) {
					//[pic][title/desc][points][links][crawled][report]
					// data
					var achTitle = $(this).find('td:eq(1) > a').text();
					var achDescr = $(this).find('td:eq(2)').text();
					var achPoint = $(this).find('td:eq(4)').text();
					var achId = $(this).find('td:eq(5) input').attr('value');
					var achTitleHtml = $(this).find('td:eq(1)').html();
					// cells
					$(this).find('td:eq(2)').remove();
					$(this).find('td:eq(2)').detach().insertAfter($(this).find('td:eq(2)'));
					$('<td></td>').insertAfter($(this).find('td:eq(2)'));
					// content
					$(this).find('td:eq(1)').html('<h3>' + achTitleHtml + '</h3>' + achDescr);
					$(this).find('td:eq(2)').html(htmlAstatsPoint(achPoint));
					$(this).find('td:eq(3)').html(htmlLinksAch(titleGameName, achTitle));
					$(this).find('td:eq(4)').html($(this).find('td:eq(4)').text().split(' ').join('<br />'));
					//styles
					$(this).find('td:eq(0)').addClass('isaListAchImage');
					$(this).find('td:eq(1)').addClass('isaListAchDetail');
					$(this).find('td:eq(2)').addClass('isaListBigNumber isaListTextShadow isaListShadow').removeAttr('style');
					$(this).find('td:eq(3)').addClass('isaLinkContainerDark');
					$(this).find('td:eq(4)').addClass('isaLinkContainerDark');
					$(this).find('td:eq(5)').addClass('isaListNumber');
					// row styles and content
					var attr = $(this).attr('class');
					if (typeof attr !== typeof undefined && attr !== false) {
						if (attr == "broken") {
							$(this).removeClass('broken').addClass('isaAchBroken');
							$(this).find('td:eq(1)').append('<br /><span class="isaSpanRed isaSpanSmallBold">Note: This achievement is Broken</span>');
						} else if (attr == 'seasonal') {
							$(this).removeClass('seasonal').addClass('isaAchSeasonal');
							$(this).find('td:eq(1)').append('<br /><span class="isaSpanOra isaSpanSmallBold">Note: This achievement is Seasonal</span>');
						} else if (attr == 'nonrecurring') {
							$(this).removeClass('nonrecurring').addClass('isaAchNonRecurring');
							$(this).find('td:eq(1)').append('<br /><span class="isaSpanYel isaSpanSmallBold">Note: This achievement is Non-recurring</span>');
						} else if (attr == 'temporary') {
							$(this).removeClass('temporary').addClass('isaAchTemporary');
							$(this).find('td:eq(1)').append('<br /><span class="isaSpanYel isaSpanSmallBold">Note: This achievement is Temporary</span>');
						} else if (attr == 'monetary') {
							$(this).removeClass('monetary').addClass('isaAchMonetary');
							$(this).find('td:eq(1)').append('<br /><span class="isaSpanPin isaSpanSmallBold">Note: This achievement is Monetary</span>');
						}
					}
				});
				jsRowHighlight('table#isaSecondTable');
				$('table#isaSecondTable').tablesorter({
					headers: {
						0: { sortInitialOrder: 'asc' }, 1: { sortInitialOrder: 'asc' }
					}
				});
			}
		}
		// ===================================================================================================================
		// Achievement Stats - Achievement Page
		if (urlContains('action=games') && urlContains('achievementId=') && window.location.search.substring(1).split('&').length == 2) {
			// Get Info and Elements
			var featureImage = $('#isaPageWrap > :nth-child(2)').detach().find('a:eq(0)');
			var iconsAndText = $('#isaPageWrap > :nth-child(2)').detach();
			var picNo = $(iconsAndText).find(':first-child').detach().removeAttr('style');
			var picYes = $(iconsAndText).find(':first-child').detach().removeAttr('style');
			var achText = $(iconsAndText).html().split('<br>');
			var achTitle = achText[0].replace('<b>', '').replace('</b>', '');
			var achDet = achText[1];
			var achValue = achText[2].replace('(', '').replace(')', '').split('poi')[0].trim();
			var markedAs = $('#isaPageWrap > :nth-child(2)').is('form') ? $('#isaPageWrap > :nth-child(2)').detach() : false;
			var markedAsCalender = $('#isaPageWrap > :nth-child(2)').is('p') ? $('#isaPageWrap > :nth-child(2)').detach() : false;
			var ul = $('#isaPageWrap > :nth-child(2)').detach();
			var gameId = $(featureImage).attr('href').split('gameId=')[1].split('&')[0].split('?')[0].split('#')[0];
			var gameName = $(featureImage).attr('title');
			$(featureImage).removeAttr('style').find('img').removeAttr('style');
			$('#isaPageWrap > table:eq(0)').attr('id', 'isaSecondTable').addClass('isaTable');
			// Make Header Table
			var isaTopTable = $('<table class="isaTable isaWidth100" id="isaTopTable">' +
				'<tr><td rowspan="5" class="isaGameIcon"></td><td rowspan="5" class="isaGameIcon"></td><td class="isaTitleCell"></td><td rowspan="5" class="isaGameImage"></td></tr>' +
				'<tr><td></td></tr><tr><td class="isaLinkContainer"></td></tr><tr><td class="isaLinkContainer"></td></tr><tr><td class="isaLinkContainer"></td></tr></table>');
			$(isaTopTable).find('td:eq(0)').append(picYes);
			$(isaTopTable).find('td:eq(1)').append(picNo);
			$(isaTopTable).find('td:eq(2)').html(achTitle + ' (' + htmlAstatsPoint(achValue) + ' points</span>)').attr('title', 'Achievement');
			$(isaTopTable).find('td:eq(2)').prepend(settingsButton);
			$(isaTopTable).find('td:eq(3)').append(featureImage);
			$(isaTopTable).find('td:eq(4)').text(achDet);
			$(isaTopTable).find('td:eq(5)').html(htmlLinksAch(gameName, achTitle, true));
			$(isaTopTable).find('td:eq(6)').html('<span>Achievement Stats Controls: </span> ' + htmlFromUl(ul));
			$(isaTopTable).find('td:eq(7)').html(htmlLinksGameLong(gameId, gameName, false, achPeople));
			if (markedAs !== false) {
				markedAs = $(markedAs).find('ul > li').text().trim();
				$(isaTopTable).find('td:eq(4)').append('<br />');
				if (markedAs == 'Broken') {
					$(isaTopTable).find('td:eq(4)').append('<span class="isaSpanRed isaSpanSmallBold" title="Broken Achievements cannot be unlocked.">Note: This achievement is marked as Broken.</span>');
				} else if (markedAs == 'Seasonal') {
					$(isaTopTable).find('td:eq(4)').append('<span class="isaSpanOra isaSpanSmallBold" title="Seasonal Achievements can only be unlocked unlocked at certain times.">Note: This achievement is marked as Seasonal.</span>');
				} else if (markedAs == 'Non-recurring') {
					$(isaTopTable).find('td:eq(4)').append('<span class="isaSpanYel isaSpanSmallBold" title="Non-Recurring Achievements were unlockable for a certain time, but that time has passed.">Note: This achievement is marked as Non-Recurring.</span>');
				} else if (markedAs == 'Temporary') {
					$(isaTopTable).find('td:eq(4)').append('<span class="isaSpanYel isaSpanSmallBold" title="Temporary Achievements are planned to be removed of changed.">Note: This achievement is marked as Temporary.</span>');
				} else if (markedAs == 'Monetary') {
					$(isaTopTable).find('td:eq(4)').append('<span class="isaSpanPin isaSpanSmallBold" title="Monetary Achievements require a purchase to unlock.">Note: This achievement is marked as Monetary.</span>');
				} else {
					$(isaTopTable).find('td:eq(4)').append('<span class="isaSpanRed isaSpanSmallBold">Note: This achievement is marked as ' + markedAs + '.</span>');
				}
				if (markedAsCalender !== false) {
					$(isaTopTable).find('td:eq(4)').append('<br />');
					$(isaTopTable).find('td:eq(4)').append($(markedAsCalender).children().not('br'));
				}
			}
			// Append and Title
			$('#isaPageWrap > :first-child').after('<div class="isaTableSpacer"></div>');
			$('#isaPageWrap > :first-child').after(isaTopTable);
			document.title = achTitle + titleDelim + 'Achievement';
			titleDone = true;
		}
		// ===================================================================================================================
		// Achievement Stats - Player Unlock History Page
		if (urlContains('action=profile') && urlContains('playerId=') && urlContains('mode=history') && urlContains('gameId=') && window.location.search.substring(1).split('&').length == 4) {
			$('#isaPageWrap > table:eq(0)').attr('id', 'isaSecondTable').addClass('isaTable isaWidth100');
			$('#isaPageWrap > table:eq(1)').attr('id', 'isaLockedTable');
			var thereIsUnlocked = $('table#isaSecondTable > tbody > tr:eq(1) > td').length != 1;
			var thereIsLocked = $('table#isaLockedTable > tbody > tr:eq(1) > td').length != 1;
			if (thereIsUnlocked || thereIsLocked) {
				// Get Info and Elements
				var featureImage = thereIsUnlocked ? $('#isaPageWrap > table:eq(0) > tbody > tr:eq(1) > td:eq(0) > :first-child') : $('table#isaLockedTable > tbody > tr:eq(1) > td:eq(0) > :first-child');
				var titleGameName = $(featureImage).find('img:eq(0)').attr('title');
				var gameAppId = $(featureImage).attr('href').split('gameId=')[1];
				var formButton = $('#isaPageWrap > :first-child').detach(); // put this somewhere
				var titleCellHtml = $('#isaPageWrap > :first-child').detach();
				var playTime = $('#isaPageWrap > :first-child').detach().text().split(' playing')[0];
				$('#isaPageWrap > h3:eq(0)').remove();
				var rssHistoryButton = $(titleCellHtml).find('a:eq(1)').removeAttr('style').css({ 'dislay': 'inline-block', 'margin-left':'15px' });//.css({ 'float':'right' });
				var playerName = $(titleCellHtml).find('a:eq(0)').text();
				var playerId64 = $(titleCellHtml).find('a:eq(0)').attr('href').split('playerId=')[1];
				pushPeople(playerName, playerId64, false);
				$(featureImage).removeAttr('style').find('img').removeAttr('style');
				// Make Header Table
				var isaTopTable = $('<table class="isaTable isaWidth100" id="isaTopTable">' +
					'<tr><td rowspan="4" class="isaGameImage"></td><td class="isaTitleCell"></td></tr>' +
					'<tr><td class="isaStatsLarge"></td></tr><tr><td class="isaLinkContainer"></td></tr><tr class="isaHideCell"><td class="isaLinkContainer"></td></tr></table>');
				$(isaTopTable).find('td:eq(0)').append(featureImage).append(formButton);
				$(isaTopTable).find('td:eq(1)').text(titleGameName).append(rssHistoryButton);
				$(isaTopTable).find('td:eq(1)').prepend(settingsButton);
				var titleAppend = $('<div class="isaTitleAppend isaActionDiv">' + playerName + '\'s Unlock History</div>');
				$(titleAppend).insertBefore(rssHistoryButton);
				$(titleAppend).click(function () { $('table#isaTopTable tr:eq(3)').toggleClass('isaHideCell'); });
				$(titleAppend).hover(function () { $(this).css({ 'text-decoration': 'underline', 'color': '#00c6ff' }); }, function () { $(this).removeAttr('style'); });
				$(isaTopTable).find('td:eq(3)').html(htmlLinksGameLong(gameAppId, titleGameName, false, achPeople));
				$(isaTopTable).find('td:eq(4)').html(htmlLinksProfile(playerId64));
				// Append and Title
				$('#isaPageWrap').prepend('<div class="isaTableSpacer"></div>');
				$('#isaPageWrap').prepend(isaTopTable);
				document.title = playerName + titleDelim + titleGameName + titleDelim + 'Unlock History';
				titleDone = true;
				// Adjust Second Table
				$('table#isaSecondTable').prepend('<thead></thead>');
				$('table#isaSecondTable > thead').append($('table#isaSecondTable > tbody > tr:eq(0)').detach());
				$('table#isaSecondTable > thead > tr > th:eq(0)').remove();
				$('table#isaSecondTable > thead > tr').append('<th style="width:' + colWidUnlockLink + 'px;" data-sorter="false">Links</th>');
				$('table#isaSecondTable > thead > tr > th:eq(1)').css('width', colWidUnlockPoint + 'px').attr('data-sorter', 'isaAstatsPoint');
				$('table#isaSecondTable > thead > tr > th:eq(2)').css('width', colWidUnlockDate + 'px').attr('data-sorter', 'isaDate');
				var achCount = 0;
				var achLockd = 0;
				if (thereIsUnlocked) {
					var rowsUnlocked = $('table#isaSecondTable > tbody > tr');
					for (var i = 0, l = rowsUnlocked.length - 1; i < l; i += 2) {
						$(rowsUnlocked[i]).find('td:eq(0)').remove(); // game image
						$(rowsUnlocked[i]).find('td:eq(0)').addClass('isaListAchImage').removeAttr('rowspan'); //ach icon
						var achTitle = $(rowsUnlocked[i]).find('td:eq(1)').text();
						var achDetail = $(rowsUnlocked[i + 1]).find('td:eq(0)').text();
						$(rowsUnlocked[i]).find('td:eq(1)').addClass('isaListAchDetail').html('<h3>' + achTitle + '</h3>' + achDetail);
						$(rowsUnlocked[i]).find('td:eq(2)').addClass('isaListBigNumber isaListShadow isaListTextShadow').removeAttr('rowspan').removeAttr('style');
						$(rowsUnlocked[i]).find('td:eq(2)').html(htmlAstatsPoint($(rowsUnlocked[i]).find('td:eq(2)').text()));
						$(rowsUnlocked[i]).find('td:eq(3)').addClass('isaListNumber isaListShadow isaListAchUnlocked').removeAttr('rowspan');
						$(rowsUnlocked[i]).append($('<td class="isaLinkContainerDark isaListShadow"></td>').html(htmlLinksAch(titleGameName, achTitle)));

						var achTime = $(rowsUnlocked[i]).find('td:eq(3)').text().trim();
						if (achTime == '') {
							$(rowsUnlocked[i]).find('td:eq(3)').html('<span title="This achievement was unlocked before Steam began tracking the date and time achievements are unlocked.">Unlocked Pre-Tracking</span>');
						} else {
							var achTimeParts1 = $(rowsUnlocked[i]).find('td:eq(3)').text().split(' ');
							var achTimeParts2 = achTimeParts1[0].split('/');
							$(rowsUnlocked[i]).find('td:eq(3)').html('<span>' + achTimeParts2[2] + '/' + achTimeParts2[1] + '/' + achTimeParts2[0] + ' ' + achTimeParts1[1] + '</span>');
						}
						achCount++;
					}
					$('table#isaSecondTable > tbody > tr:odd').remove();
				} else {
					$('table#isaSecondTable > tbody > tr:eq(0)').remove();
				}
				if (thereIsLocked) {
					var rowsLocked = $('table#isaLockedTable > tbody > tr');
					for (var i = 1, l = rowsLocked.length - 1; i < l; i += 2) {
						var achTitle = $(rowsLocked[i]).find('td:eq(2)').text();
						var achDetail = $(rowsLocked[i + 1]).find('td:eq(0)').text();
						$(rowsLocked[i]).find('td:eq(0)').remove(); //game pic
						$(rowsLocked[i]).find('td:eq(0)').addClass('isaListAchImage').removeAttr('rowspan'); // ach icon
						$(rowsLocked[i]).find('td:eq(1)').addClass('isaListAchDetail');
						$(rowsLocked[i]).find('td:eq(1)').html('<h3>' + achTitle + '</h3>' + achDetail);
						$(rowsLocked[i]).find('td:eq(2)').addClass('isaListBigNumber isaListShadow isaListTextShadow').removeAttr('rowspan').removeAttr('style');
						$(rowsLocked[i]).find('td:eq(2)').html(htmlAstatsPoint($(rowsLocked[i]).find('td:eq(2)').text()));
						$(rowsLocked[i]).append('<td class="isaListNumber isaListShadow isaListTextShadow"><span>Locked</span></td>');
						$(rowsLocked[i]).append($('<td class="isaLinkContainerDark isaListShadow"></td>').html(htmlLinksAch(titleGameName, achTitle)));
						$('table#isaSecondTable > tbody').append(rowsLocked[i]);
						achLockd++;
					}
				}
				$('table#isaLockedTable').remove();
				domDateColumn($('table#isaSecondTable > tbody > tr'), 3, $('table#isaTopTable td:eq(2)'));
				jsRowHighlight('table#isaSecondTable');
				// More Info to Header Table
				var achTotal = achCount + achLockd;
				var percentStr = achCount + ' / ' + achTotal + ' (' + (Math.round((achCount * 10000) / achTotal) / 100) + '%) completed';
				$('table#isaTopTable td:eq(2)').prepend('<div class="isaStat" title="Total Time ' + playerName + ' has played this game.">' + playTime + '</div>');
				$('table#isaTopTable td:eq(2)').prepend('<div class="isaStat">' + htmlPercentStr(percentStr, achCount / achTotal) + '</div>');
				$('table#isaTopTable td:eq(2)').prepend('<div class="isaStat">' + achTotal + ' achievements</div>');
				// TableSort Second Table
				$('table#isaSecondTable').tablesorter({
					headers: {
						0: { sortInitialOrder: 'asc' },
						1: { sortInitialOrder: 'asc' },
						2: { sortInitialOrder: 'asc' }
					}
				});
			} else {
				$('#isaPageWrap > h2:eq(0)').addClass('isaPageTitleFirst');
				$('#isaPageWrap > h3:eq(0)').remove();
				$('table#isaSecondTable > tbody > tr:eq(0) > th:eq(0)').remove();
				$('table#isaSecondTable > tbody > tr:eq(1) > td:eq(0)').attr('colspan', '4');
				$('table#isaLockedTable').remove();
			}
		}
		// ===================================================================================================================
		// Title
		if (titleDone === false) {
			var newTitle = document.title;
			newTitle = newTitle.replace('Achievement Stats &raquo; ', '').replace('Achievement Stats » ', '');
			newTitle = newTitle.isaReplaceAll(' &raquo; ', titleDelim).isaReplaceAll(' » ', titleDelim);
			document.title = newTitle;
		}
	}
	// =======================================================================================================================
	if (urlContains('steamcommunity.com')){
		var loggedInSteam64 = false;
		var steamLoggedName = '';
		if($('script:contains("g_steamID")').length > 0){
			var tempStr = $('script:contains("g_steamID"):eq(0)').text().split('g_steamID = "');
			if(tempStr.length == 2){
				loggedInSteam64 = tempStr[1].split('"')[0];
			}
		}
		var steamLoggedIn = loggedInSteam64 != false;
		if(steamLoggedIn){
			var str = $('a.menuitem.supernav.username');
			if (str.length > 0){
				str = (str.length == 1) ? $(str).first() : $(str).eq(1);
				steamLoggedName = $(str).text();
				
				var tempUrl = $(str).attr('href').split('/home')[0];
				if (tempUrl.indexOf('/id/') != -1) {
					pushPeople(steamLoggedName,loggedInSteam64,tempUrl.split('/id/')[1]);
				}else{
					pushPeople(steamLoggedName,loggedInSteam64,false);
				}
			}else{
				steamLoggedIn = false;
			}
		}
		// ===================================================================================================================
		// Global Achievements Page - Can have Player Stats on it
		if (urlContains('steamcommunity.com/stats/') || urlContains('steamcommunity.com//stats/')) {
			$('div.pagecontent:eq(0)').children().slice(0, 2).wrapAll('<div id="isaPageWrap" />');
			// Get Info and Elements
			var titleGameName = $('#isaPageWrap > :first-child > div > h1:eq(0)').text();
			var featureImage = $('#isaPageWrap > :first-child > div > div > div > a:eq(0)');
			$('#isaPageWrap > :first-child').remove();
			$(featureImage).removeAttr('style').find('img').removeAttr('style');
			var gameId = $(featureImage).attr('href').split('/app/')[1].split('/')[0].split('?')[0];
			var steamUrlBit = document.URL.split('/stats/')[1].split('/')[0].split('?')[0];
			var steamLoggedGameOwned = $('#headerContentLeft').text().split('do not own this').length != 2;
			var steamLoggedGotAchData = $('div.compareImg').length > 0;
			// Make Header Table
			var isaTopTable = $('<table class="isaTable isaWidth100" id="isaTopTable">' +
				'<tr><td rowspan="5" class="isaGameImage"></td><td class="isaTitleCell"></td></tr>' +
				'<tr><td class="isaStatsLarge"></td></tr><tr><td class="isaLinkContainer"></td></tr></tr><tr class="isaHideCell"><td class="isaLinkContainer"></td></tr>'+
				'<tr class="isaHideCell"><td class="isaLinkContainer"></td></tr></table>');
			$(isaTopTable).find('td:eq(0)').append(featureImage);
			$(isaTopTable).find('td:eq(1)').text(titleGameName).attr('title', 'Global Achievement Stats for ' + titleGameName);
			$(isaTopTable).find('td:eq(1)').prepend(settingsButton);
			$(isaTopTable).find('td:eq(3)').html(htmlLinksGameLong(gameId, titleGameName, steamUrlBit, achPeople));
			// Make Second Table
			var isaSecondTable = $('<table class="isaTable isaWidth100" id="isaSecondTable" style="margin-bottom:7px;"><thead><tr><th colspan="2">Achievement</th>' +
				'<th style="width:' + colWidUnlockPercent + 'px;" title="Global Completion Percentage">Global Percent</th>' +
				'<th style="width:' + colWidUnlockDate + 'px;" title="Has this player unlocked the achievement\u000ADate Format: YYYY/MM/DD" data-sorter="'+(steamLoggedGameOwned ? 'isaDate' : false)+'">Unlocked</th>' +
				'<th style="width:' + colWidUnlockLink + 'px;" data-sorter="false">Links</th></tr></thead><tbody></tbody></table>');
			// Append and Title
			$('#isaPageWrap').prepend(isaSecondTable);
			$('#isaPageWrap').prepend('<div class="isaTableSpacer"></div>');
			$('#isaPageWrap').prepend(isaTopTable);
			document.title = titleGameName + titleDelim + ((steamLoggedGotAchData) ? 'Me' + titleDelim + 'Unlock History' : 'Game');
			titleDone = true;
			// Tabs Cell
			var tabs = $('div#tabs > div.tab').not('#achievementsTabOff').not('#achievementsTabOn');
			if(tabs.length > 0){
				$(isaTopTable).find('tr:eq(4)').removeClass('isaHideCell');
				var aHtml = [];
				$(tabs).find('a').each(function () { aHtml.push($(this).parent().html()); });
				var aHtmlJoined = '<span>Other Tabs: </span> ' + aHtml.join(linkDelim);
				$(isaTopTable).find('td:eq(5)').html(aHtmlJoined);
			}
			// Second Table Data
			var achievements = $('div.achieveRow');
			var achCount = 0;
			var achTotal = $(achievements).length;
			if ($(achievements).length > 0) {
				$.each(achievements, function (index, value) {
					var newRow = $('<tr><td class="isaListAchImage"></td><td class="isaListAchDetail"></td><td class="isaListBigNumber isaListShadow isaListTextShadow"></td>' +
						'<td class="isaListNumber isaListShadow"></td><td class="isaLinkContainerDark isaListShadow"></td></tr>');
					var image = $(value).find('div.achieveImgHolder > img:eq(0)');
					var title = $(value).find('div.achieveTxtHolder > div.achieveTxt > h3:eq(0)').text();
					var description = $(value).find('div.achieveTxtHolder > div.achieveTxt > h5:eq(0)').text();
					var percent = $(value).find('div.achieveTxtHolder > div.achievePercent:eq(0)').text();
					$(newRow).find('td:eq(0)').append(image);
					$(newRow).find('td:eq(1)').html('<h3>' + title + '</h3>' + description);
					$(newRow).find('td:eq(4)').html(htmlLinksAch(titleGameName, title, false, gameId));
					domPercentCell($(newRow).find('td:eq(2)'), percent);
					var compare = $(value).find('div.compareImg');
					if ($(compare).length > 0) {
						if ($(compare).find('img:eq(0)').attr('src') == $(image).attr('src')) {
							$(newRow).find('td:eq(3)').addClass('isaListAchUnlocked').html('<span>Unlocked</span>');
							achCount++;
						} else {
							$(newRow).find('td:eq(3)').html('<span>Locked</span>');
						}
					} else if (!steamLoggedGameOwned) {
						$(newRow).find('td:eq(3)').addClass('isaBlackedOut').html('<span>You don\'t own this game</span>');
					}
					$('table#isaSecondTable > tbody:eq(0)').append(newRow);
				});
				if (!steamLoggedIn) {
					$('table#isaSecondTable > tbody:eq(0) tr > td:nth-child(4)').addClass('isaBlackedOut').html('<span>Not Logged In</span>');
				}
			} else {
				$('table#isaSecondTable > tbody:eq(0)').append('<tr><td colspan="5"><div align="center">No Achievements</div></td></tr>');
			}
			$('#isaPageWrap > :nth-child(4)').remove(); // remove achievement data div once all data has been obtained
			jsRowHighlight('table#isaSecondTable');
			// More Info to Header Table and Title Append JS
			$('table#isaTopTable td:eq(2)').append('<div class="isaStat">' + achTotal + ' achievements</div>');
			if (steamLoggedGotAchData) {
				var steamLoggedPercent = Math.round((achCount * 10000) / achTotal) / 100;
				var steamLoggedPercentStr = achCount + ' / ' + achTotal + ' (' + steamLoggedPercent + '%) completed';
				$('table#isaTopTable td:eq(2)').append('<div class="isaStat">' + htmlPercentStr(steamLoggedPercentStr, achCount / achTotal) + '</div>');
				var titleAppend = $('<div class="isaTitleAppend isaActionDiv">My Unlock History</div>');
				$('table#isaTopTable td:eq(1)').append(titleAppend);
				if (steamLoggedIn) {
					$('table#isaTopTable td:eq(4)').html(htmlLinksProfile(loggedInSteam64));
					$(titleAppend).click(function () { $('table#isaTopTable tr:eq(3)').toggleClass('isaHideCell'); });
					$(titleAppend).hover(function () { $(this).css({ 'text-decoration': 'underline', 'color': '#00c6ff' }); }, function () { $(this).removeAttr('style'); });
				}
			}
			// TableSort
			$('table#isaSecondTable').tablesorter({ sortInitialOrder: "asc" });
			// AJAX: Player Unlock Dates
			if (steamLoggedGotAchData && steamLoggedIn) {
				$.ajax({
					type: 'GET', url: 'http://steamcommunity.com/profiles/' + loggedInSteam64 + '/stats/' + steamUrlBit + '/achievements?xml=1', dataType: 'xml',
					success: function (data) {
						var visibilityState = $(data).find('playerstats > visibilityState');
						if (visibilityState.length > 0 && $(visibilityState).text() == '3') {
							//var hoursStat = $(data).find('playerstats > stats > hoursPlayed').text();
							//$('table#isaTopTable td:eq(2)').append('<div class="isaStat" title="Playtime the past two weeks.">' + hoursStat + ' hours</div>');
							$(data).find('playerstats > achievements > achievement').each(function () {
								var achName = $(this).find('name').text();
								var h3 = $('table#isaSecondTable > tbody > tr > td:nth-child(2) > h3').filter(function() { return achName == $(this).text(); });
								if ($(this).attr('closed') == '1') {
									var timeUnlocked = $(this).find('unlockTimestamp');
									if (h3) {
										if (timeUnlocked) {
											$(h3).parent().next().next().html('<span>' + new Date($(timeUnlocked).text() * 1000).isaToString() + '</span>');
										} else {
											$(h3).parent().next().next().html('<span title="This achievement was unlocked before Steam began tracking the date and time achievements are unlocked.">Unlocked Pre-Tracking</span>');
										}
									}
								} else {
									//$(h3).parent().next().next().removeClass('isaListAchUnlocked').html('<span>Locked</span>');
									// maybe xml file isnt updated yet? why show achievement as "locked" when its unlocked...
								}
							});
							domDateColumn($('table#isaSecondTable > tbody > tr'), 3, $('table#isaTopTable td:eq(2)'));
							$('table#isaSecondTable').trigger('updateRows');
						}
					},
					error: function () { }, timeout: 5000
				});
			}
		}
		// ===================================================================================================================
		// Player Achievement Unlock History for a Game
		if (((urlContains('steamcommunity.com/id/') || urlContains('steamcommunity.com//id/')) && urlContains('/stats/')) || (urlContains('steamcommunity.com/profiles/') || urlContains('steamcommunity.com//profiles/')) && urlContains('/stats/')) {
			// Get Info and Elements
			var funnyPage = ($('div.pagecontent:eq(0)').length == 0);
			var comparePage = (urlContains('/compare') && steamLoggedIn && $('a:contains("Remove comparison view")').length > 0);
			if(funnyPage === true){
				$('#BG_top,#BG_bottom').wrapAll('<div id="isaPageWrap" />');
				var titleGameName = $('#isaPageWrap > :first-child > h2:eq(0)').text().isaRemoveEnd(' Stats');
				var featureImage = $('#isaPageWrap > :first-child > div > div > div > a:eq(0)');
				var titleProfileName = $('#isaPageWrap > :first-child > h1:eq(0)').text();
				if(comparePage){
					titleProfileName = $('#isaPageWrap > :first-child > h1:eq(0)').clone().find('span').remove().end().text();
					titleProfileName = titleProfileName.trim().isaRemoveEnd(' vs');
				}
				var profileUrl = $('#isaPageWrap > :first-child > div > div > div > a:eq(1)').attr('href');
				var profileUrlType = (profileUrl.indexOf('/profiles/') != -1);
				var profileUrlBit = profileUrlType ? profileUrl.split('/profiles/')[1] : profileUrl.split('/id/')[1];
				$('#isaPageWrap > :first-child').remove();
				var steamAppId = $(featureImage).attr('href').split('/app/')[1].split('/')[0].split('?')[0].split('#')[0];
				var steamUrlBit = urlContains('/stats/appid/') ? document.URL.split('/stats/appid/')[1].split('/')[0].split('?')[0] : document.URL.split('/stats/')[1].split('/')[0].split('?')[0];
				$(featureImage).removeAttr('style').find('img').removeAttr('style');
			}else{
				$('div.pagecontent:eq(0)').children().slice(0, 2).wrapAll('<div id="isaPageWrap" />');
				var titleGameName = $('#isaPageWrap > :first-child > div > div > a > span:eq(1)').text().isaRemoveEnd(' Stats');
				var featureImage = $('#isaPageWrap > :first-child > div > div > div > a:eq(0)');
				var titleProfileName = $('#isaPageWrap > :first-child > div > div > span> a:eq(0)').text();
				var profileUrl = $('#isaPageWrap > :first-child > div > div > span> a:eq(0)').attr('href');
				var profileUrlType = (profileUrl.indexOf('/profiles/') != -1);
				var profileUrlBit = profileUrlType ? profileUrl.split('/profiles/')[1] : profileUrl.split('/id/')[1];
				$('#isaPageWrap > :first-child').remove();
				var steamAppId = $(featureImage).attr('href').split('/app/')[1].split('/')[0].split('?')[0].split('#')[0];
				var steamUrlBit = urlContains('/stats/appid/') ? document.URL.split('/stats/appid/')[1].split('/')[0].split('?')[0] : document.URL.split('/stats/')[1].split('/')[0].split('?')[0];
				$(featureImage).removeAttr('style').find('img').removeAttr('style');
			}
			if (profileUrlType) {
				pushPeople(titleProfileName,profileUrlBit,false);
			}else{
				pushPeople(titleProfileName,false,profileUrlBit);
			}
			if (comparePage){
				var achSummary = $('#topSummaryAchievements').text().split(' of ');
				var achCount = achSummary[0];
				var achTotal = achSummary[1].split(' (')[0];
				var achCount2 = achSummary[1].split('earned:')[1];
				var achTotal2 = achSummary[2].split(' (')[0];
				var avatarLeft = $('div.topAvatarsLeft > div > div > a:eq(0)');
				var avatarRight = $('div.topAvatarsRight > div > div > a:eq(0)');
				var compareRemovalLink = $('a:contains("Remove comparison view"):eq(0)');
				$('div.topAvatarsLeft').remove();
				$('div.topAvatarsRight').remove();
				// Make Header Table - Apply Some Data
				var isaTopTable = $('<table class="isaTable isaWidth100" id="isaTopTable">' +
					'<tr><td rowspan="5" class="isaListAchImage"></td><td class="isaTitleCell"></td><td rowspan="5" class="isaListAchImage"></td></tr>' +
					'<tr><td class="isaStatsLarge"></td></tr><tr><td class="isaLinkContainer"></td></tr><tr class="isaHideCell"><td class="isaLinkContainer"></td></tr>' +
					'<tr class="isaHideCell"><td class="isaLinkContainer"><span>Other Tabs: </span> </td></tr></table>');
				$(isaTopTable).find('td:eq(0)').append(avatarLeft);
				$(isaTopTable).find('td:eq(1)').append(titleGameName + ' - ' + titleProfileName + ' vs. ' + steamLoggedName + ' (me) - Unlock History Compared - ');
				$(isaTopTable).find('td:eq(1)').append(compareRemovalLink);
				$(isaTopTable).find('td:eq(1)').prepend(settingsButton);
				$(isaTopTable).find('td:eq(2)').append(avatarRight);
				$(isaTopTable).find('td:eq(3)').append('<div class="isaStat">' + achTotal + ' achievements</div>');
				$(isaTopTable).find('td:eq(4)').html(htmlLinksGameLong(steamAppId, titleGameName, steamUrlBit, achPeople));
				var percent = Math.round((achCount * 10000) / achTotal) / 100;
				var percentStr = titleProfileName + ': ' + achCount + ' / ' + achTotal + ' (' + percent + '%) completed';
				$(isaTopTable).find('td:eq(3)').append('<div class="isaStat">' + htmlPercentStr(percentStr, achCount / achTotal) + '</div>');
				var percent2 = Math.round((achCount2 * 10000) / achTotal2) / 100;
				var percentStr2 = steamLoggedName + ' (me): ' + achCount2 + ' / ' + achTotal2 + ' (' + percent2 + '%) completed';
				$(isaTopTable).find('td:eq(3)').append('<div class="isaStat">' + htmlPercentStr(percentStr2, achCount2 / achTotal2) + '</div>');
				if ($('#personalAchieve div.achieveImgHolder').length < achTotal) {
					$(isaTopTable).find('td:eq(3) > div.isaStat:eq(0)').append('&nbsp;<span class="isaSpanRed">(' + (achTotal - $('#personalAchieve div.achieveImgHolder').length) + ' hidden)</span>');
				}
				// Make Second Table
				var isaSecondTable = $('<table class="isaTable isaWidth100" id="isaSecondTable" style="margin-bottom:7px;"><thead><tr>' +
					'<th colspan="2">Achievement</th>' +
					'<th style="width:' + colWidUnlockPercent + 'px;" title="Global Completion Percentage">Global Percent</th>' +
					'<th style="width:' + colWidUnlockDate + 'px;" data-sorter="isaDate" title="Has this player unlocked the achievement\u000ADate Format: YYYY/MM/DD">'+titleProfileName+' Unlocked</th>' +
					'<th style="width:' + colWidUnlockDate + 'px;" data-sorter="isaDate" title="Has this player unlocked the achievement\u000ADate Format: YYYY/MM/DD">'+steamLoggedName+' (me) Unlocked</th>' +
					'<th style="width:' + colWidUnlockLink + 'px;" data-sorter="false">Links</th></tr></thead><tbody></tbody></table>');
				// Append and Title
				$('#isaPageWrap').prepend(isaSecondTable);
				$('#isaPageWrap').prepend('<div class="isaTableSpacer"></div>');
				$('#isaPageWrap').prepend(isaTopTable);
				document.title = titleGameName + titleDelim + titleProfileName + titleDelim + 'Unlock History';
				titleDone = true;
				// Tabs Cell
				var tabs = $('div#tabs > div.tab').not( "#personalAchieveTabOff" ).not( "#personalAchieveTabOn" );
				if(tabs.length > 0){
					$(isaTopTable).find('tr:eq(5)').removeClass('isaHideCell');
					var aHtml = [];
					$(tabs).find('a').each(function () { aHtml.push($(this).parent().html()); });
					var aHtmlJoined = '<span>Other Tabs: </span> ' + aHtml.join(linkDelim);
					$(isaTopTable).find('td:eq(6)').html(aHtmlJoined);
				}
				// Second Table Data
				if ($('#personalAchieve div.achieveImgHolder').length > 0) {
					var achChildren = $('#personalAchieve div.achieveRow');
					for (var i = 0, k = achChildren.length; i < k; i++) {
						var achChild = achChildren[i];
						var newRow = $('<tr><td class="isaListAchImage"></td><td class="isaListAchDetail"></td><td class="isaListBigNumber isaListShadow isaListTextShadow"></td>' +
							'<td class="isaListNumber isaListShadow"></td><td class="isaListNumber isaListShadow"></td><td class="isaLinkContainerDark isaListShadow"></td></tr>');
						var image = $(achChild).find('div:eq(0) img:eq(0)');
						var details = $(achChild).find('div:eq(1)');
						var unlocked = $(details).find('div.achieveUnlockTime');
						var title = $(details).find('div.achieveTxt > h3:eq(0)').text();
						var description = $(details).find('div.achieveTxt > h5:eq(0)').text();
						var progress = $(details).find('div.achievementProgressBar');
						$(newRow).find('td:eq(0)').append(image);
						$(newRow).find('td:eq(1)').html('<h3>' + title + '</h3>' + description);
						$(newRow).find('td:eq(5)').html(htmlLinksAch(titleGameName, title, false, steamAppId));
						if ($(progress).length > 0) {
							progress = $(progress).text();
							$(newRow).find('td:eq(1)').append('<br />');
							$(newRow).find('td:eq(1)').append(progress);
						}
						$(newRow).find('td:eq(2)').text('-');//percent cell
						if (unlocked.length > 0) {
							var unlockedParts = $(unlocked).first().html().split('<br>');

							var unlocked1 = unlockedParts[0].trim();
							if(unlocked1.indexOf('Unlocked') != -1){
								unlocked1 = textDateFixSteam(unlocked1);
								$(newRow).find('td:eq(3)').append('<span>' + unlocked1 + '</span>');
								$(newRow).find('td:eq(3)').addClass('isaListAchUnlocked');
							}else{
								$(newRow).find('td:eq(3)').append('<span>Locked</span>');
							}

							var unlocked2 = unlockedParts[1].trim();
							if(unlocked2.indexOf('Unlocked') != -1){
								unlocked2 = $(unlocked2).text();
								unlocked2 = textDateFixSteam(unlocked2);
								$(newRow).find('td:eq(4)').append('<span>' + unlocked2 + '</span>');
								$(newRow).find('td:eq(4)').addClass('isaListAchUnlocked');
							}else{
								$(newRow).find('td:eq(4)').append('<span>Locked</span>');
							}
						} else {
							$(newRow).find('td:eq(3)').append('<span>Locked</span>');
							$(newRow).find('td:eq(4)').append('<span>Locked</span>');
						}
						$('table#isaSecondTable > tbody:eq(0)').append(newRow);
					}
				} else {
					$('table#isaSecondTable > tbody:eq(0)').append('<tr><td colspan="6"><div align="center">No Achievements</div></td></tr>');
				}
				$('#isaPageWrap > :nth-child(4)').remove();
				jsRowHighlight('table#isaSecondTable');
				// TableSort
				$('table#isaSecondTable').tablesorter({
					headers: {
						0: { sortInitialOrder: 'asc' },
						1: { sortInitialOrder: 'desc' },
						2: { sortInitialOrder: 'asc' },
						3: { sortInitialOrder: 'asc' }
					}
				});
				// Adjust Second Table - Date Column
				domDateColumn($('table#isaSecondTable > tbody > tr'), 3);
				domDateColumn($('table#isaSecondTable > tbody > tr'), 4);
				// AJAX: Global Percent Cells
				$.ajax({
					type: 'GET', url: 'http://steamcommunity.com/stats/' + steamUrlBit + '/achievements', dataType: 'html',
					success: function (data) {
						$(data).find('#mainContents > div.achieveRow').each(function () {
							var percent = $(this).find('div.achievePercent').text();
							var achName = $(this).find('div.achieveTxt > h3').text().trim();
							var h3 = $('table#isaSecondTable > tbody > tr > td:nth-child(2) > h3').filter(function() { return achName == $(this).text().trim(); });
							if (h3) {
								domPercentCell($(h3).parent().next(), percent);
							}
						});
						$('table#isaSecondTable').trigger('updateRows');
					}, error: function () { }, timeout: 5000
				});
			}else{
				var achSummary = $('#topSummaryAchievements').text().split(' of ');
				var achCount = achSummary[0];
				var achTotal = achSummary[1].split(' (')[0];
				// Make Header Table - Apply Some Data
				var isaTopTable = $('<table class="isaTable isaWidth100" id="isaTopTable">' +
					'<tr><td rowspan="5" class="isaGameImage"></td><td class="isaTitleCell"></td></tr>' +
					'<tr><td class="isaStatsLarge"></td></tr><tr><td class="isaLinkContainer"></td></tr><tr class="isaHideCell"><td class="isaLinkContainer"></td></tr>' +
					'<tr class="isaHideCell"><td class="isaLinkContainer"><span>Other Tabs: </span> </td></tr></table>');
				$(isaTopTable).find('td:eq(0)').append(featureImage);
				$(isaTopTable).find('td:eq(1)').append(titleGameName + '<div class="isaTitleAppend">' + titleProfileName + '\'s Unlock History</div>');
				if (urlContains('/compare')){
					if (steamLoggedIn){
						$(isaTopTable).find('td:eq(1)').append('<span> - You cannot compare to yourself</span>');
					}else{
						$(isaTopTable).find('td:eq(1)').append('<span> - You must be logged in to compare</span>');
					}
				}
				$(isaTopTable).find('td:eq(1)').prepend(settingsButton);
				$(isaTopTable).find('td:eq(3)').html(htmlLinksGameLong(steamAppId, titleGameName, steamUrlBit, achPeople));
				$(isaTopTable).find('td:eq(2)').append('<div class="isaStat">' + achTotal + ' achievements</div>');
				var percent = Math.round((achCount * 10000) / achTotal) / 100;
				var percentStr = achCount + ' / ' + achTotal + ' (' + percent + '%) completed';
				$(isaTopTable).find('td:eq(2)').append('<div class="isaStat">' + htmlPercentStr(percentStr, achCount / achTotal) + '</div>');
				if ($('#personalAchieve div.achieveImgHolder').length < achTotal) {
					$(isaTopTable).find('td:eq(2) > div.isaStat:eq(0)').append('&nbsp;<span class="isaSpanRed">(' + (achTotal - $('#personalAchieve div.achieveImgHolder').length) + ' hidden)</span>');
				}
				// Make Second Table
				var isaSecondTable = $('<table class="isaTable isaWidth100" id="isaSecondTable" style="margin-bottom:7px;"><thead><tr>' +
					'<th colspan="2">Achievement</th>' +
					'<th style="width:' + colWidUnlockPercent + 'px;" title="Global Completion Percentage">Global Percent</th>' +
					'<th style="width:' + colWidUnlockDate + 'px;" data-sorter="isaDate" title="Has this player unlocked the achievement\u000ADate Format: YYYY/MM/DD">Unlocked</th>' +
					'<th style="width:' + colWidUnlockLink + 'px;" data-sorter="false">Links</th></tr></thead><tbody></tbody></table>');
				// Append and Title
				$('#isaPageWrap').prepend(isaSecondTable);
				$('#isaPageWrap').prepend('<div class="isaTableSpacer"></div>');
				$('#isaPageWrap').prepend(isaTopTable);
				document.title = titleGameName + titleDelim + titleProfileName + titleDelim + 'Unlock History';
				titleDone = true;
				// Tabs Cell
				var tabs = $('div#tabs > div.tab').not( "#personalAchieveTabOff" ).not( "#personalAchieveTabOn" );
				if(tabs.length > 0){
					$(isaTopTable).find('tr:eq(4)').removeClass('isaHideCell');
					var aHtml = [];
					$(tabs).find('a').each(function () { aHtml.push($(this).parent().html()); });
					var aHtmlJoined = '<span>Other Tabs: </span> ' + aHtml.join(linkDelim);
					$(isaTopTable).find('td:eq(5)').html(aHtmlJoined);
				}
				// Second Table Data
				if ($('#personalAchieve div.achieveImgHolder').length > 0) {
					var achChildren = $('#personalAchieve').children();
					var doingUnlocked = $('#personalAchieve > br').length == 3;
					var brFound = false;
					for (var i = 0, k = achChildren.length; i < k; i++) {
						var achChild = achChildren[i];
						if ($(achChild).is('div') && $(achChild).find('.achieveHiddenBox').length == 0) {
							var newRow = $('<tr><td class="isaListAchImage"></td><td class="isaListAchDetail"></td><td class="isaListBigNumber isaListShadow isaListTextShadow"></td>' +
								'<td class="isaListNumber isaListShadow"></td><td class="isaLinkContainerDark isaListShadow"></td></tr>');
							var image = $(achChild).find('div:eq(0) img:eq(0)');
							var details = $(achChild).find('div:eq(1)');
							var unlocked = $(details).find('div.achieveUnlockTime');
							var title = $(details).find('div.achieveTxt > h3:eq(0)').text();
							var description = $(details).find('div.achieveTxt > h5:eq(0)').text();
							var progress = $(details).find('div.achievementProgressBar');
							$(newRow).find('td:eq(0)').append(image);
							$(newRow).find('td:eq(1)').html('<h3>' + title + '</h3>' + description);
							$(newRow).find('td:eq(4)').html(htmlLinksAch(titleGameName, title, false, steamAppId));
							if ($(progress).length > 0) {
								progress = $(progress).text();
								$(newRow).find('td:eq(1)').append('<br />');
								$(newRow).find('td:eq(1)').append(htmlSteamAchProgress(progress));
							}
							$(newRow).find('td:eq(2)').text('-');//percent cell
							if (unlocked.length > 0) {
								unlocked = $(unlocked).text();
								unlocked = textDateFixSteam(unlocked);
								$(newRow).find('td:eq(3)').append('<span>' + unlocked + '</span>');
								$(newRow).find('td:eq(3)').addClass('isaListAchUnlocked');
							} else {
								if (doingUnlocked && !brFound) {
									$(newRow).find('td:eq(3)').addClass('isaListAchUnlocked');
									$(newRow).find('td:eq(3)').append('<span title="This achievement was unlocked before Steam began tracking the date and time achievements are unlocked.">Unlocked Pre-Tracking</span>');
								} else {
									$(newRow).find('td:eq(3)').append('<span>Locked</span>');
								}
							}
							$('table#isaSecondTable > tbody:eq(0)').append(newRow);
						} else if (doingUnlocked) {
							if ($(achChild).is('br')) {
								brFound = true;
							}
						}
					}
				} else {
					$('table#isaSecondTable > tbody:eq(0)').append('<tr><td colspan="5"><div align="center">No Achievements</div></td></tr>');
				}
				$('#isaPageWrap > :nth-child(4)').remove();
				jsRowHighlight('table#isaSecondTable');
				// TableSort
				$('table#isaSecondTable').tablesorter({
					headers: {
						0: { sortInitialOrder: 'asc' },
						1: { sortInitialOrder: 'desc' },
						2: { sortInitialOrder: 'asc' }
					}
				});
				// Adjust Second Table - Date Column
				domDateColumn($('table#isaSecondTable > tbody > tr'), 3, $('table#isaTopTable td:eq(2)'));
				// AJAX: Global Percent Cells
				$.ajax({
					type: 'GET', url: 'http://steamcommunity.com/stats/' + steamUrlBit + '/achievements', dataType: 'html',
					success: function (data) {
						$(data).find('#mainContents > div.achieveRow').each(function () {
							var percent = $(this).find('div.achievePercent').text();
							var achName = $(this).find('div.achieveTxt > h3').text().trim();
							var h3 = $('table#isaSecondTable > tbody > tr > td:nth-child(2) > h3').filter(function() { return achName == $(this).text().trim(); });
							if (h3) {
								domPercentCell($(h3).parent().next(), percent);
							}
						});
						$('table#isaSecondTable').trigger('updateRows');
					}, error: function () { }, timeout: 5000
				});
				// AJAX: Get Steam 64 ID
				if (profileUrlType) {
					$('table#isaTopTable td:eq(4)').html(htmlLinksProfile(profileUrlBit));
					var titleAppend = $(isaTopTable).find('div.isaTitleAppend:eq(0)').addClass('isaActionDiv');
					$(titleAppend).click(function () { $('table#isaTopTable tr:eq(3)').toggleClass('isaHideCell'); });
					$(titleAppend).hover(function () { $(this).css({ 'text-decoration': 'underline', 'color': '#00c6ff' }); }, function () { $(this).removeAttr('style'); });
					if (meSteamId !== false && profileUrlBit != meSteamId) {
						pushPeople(titleProfileName,profileUrlBit,false);
						$('table#isaTopTable td:eq(3)').html(htmlLinksGameLong(steamAppId, titleGameName, steamUrlBit, achPeople));
					}
				} else {
					$.ajax({
						type: 'GET', url: 'http://steamcommunity.com/id/' + profileUrlBit + '/?xml=1', dataType: 'xml',
						success: function (data) {
							var steamID64 = $(data).find('profile > steamID64').text();
							$('table#isaTopTable td:eq(4)').html(htmlLinksProfile(steamID64));
							var titleAppend = $('table#isaTopTable div.isaTitleAppend:eq(0)').addClass('isaActionDiv');
							$(titleAppend).click(function () { $('table#isaTopTable tr:eq(3)').toggleClass('isaHideCell'); });
							$(titleAppend).hover(function () { $(this).css({ 'text-decoration': 'underline', 'color': '#00c6ff' }); }, function () { $(this).removeAttr('style'); });
							if (meSteamId !== false && steamID64 != meSteamId) {
								pushPeople(titleProfileName,steamID64,profileUrlBit);
								$('table#isaTopTable td:eq(3)').html(htmlLinksGameLong(steamAppId, titleGameName, steamUrlBit, achPeople));
							}
						}, error: function () { }, timeout: 5000
					});
				}
			}
		}
		// ===================================================================================================================
		// Title
		if (!titleDone) {
			document.title = document.title.replace('Steam Community :: ', '').replace(' :: ', titleDelim);
		}
	}
	// =======================================================================================================================
	// End Brace for document.ready function
});