/* eslint-disable no-multi-spaces */

// ==UserScript==
// @name               OSU navigator
// @name:zh-CN         鼠标OSU化
// @name:zh-TW         滑鼠OSU化
// @name:ko            마우스 OSU화
// @namespace          OSU_NAVIGATOR
// @version            0.2
// @description        Use key "z" and "x" as mouse left and right, and displays your mouse cursor as osu yellow mouse cursor
// @description:zh-CN  使用"z"和"x"键作为鼠标左右键，并将鼠标样式显示为圆形亮黄osu光标
// @description:zh-TW  使用“z”和“x”鍵作為滑鼠左右鍵，並將滑鼠樣式顯示為圓形亮黃osu光標
// @description:ko     "z" 및 "x" 키를 마우스 좌우 키로 사용하고 마우스 스타일을 둥근 밝은 노란색 osu 커서로 표시합니다
// @author             PY-DNG
// @license            MIT
// @match              http*://*/*
// @icon               https://api.iowen.cn/favicon/get.php?url=osu.ppy.sh
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/436850/OSU%20navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/436850/OSU%20navigator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Arguments: level=LogLevel.Info, logContent, asObject=false
    // Needs one call "DoLog();" to get it initialized before using it!
    function DoLog() {
        // Global log levels set
        window.LogLevel = {
            None: 0,
            Error: 1,
            Success: 2,
            Warning: 3,
            Info: 4,
        }
        window.LogLevelMap = {};
        window.LogLevelMap[LogLevel.None]     = {prefix: ''          , color: 'color:#ffffff'}
        window.LogLevelMap[LogLevel.Error]    = {prefix: '[Error]'   , color: 'color:#ff0000'}
        window.LogLevelMap[LogLevel.Success]  = {prefix: '[Success]' , color: 'color:#00aa00'}
        window.LogLevelMap[LogLevel.Warning]  = {prefix: '[Warning]' , color: 'color:#ffa500'}
        window.LogLevelMap[LogLevel.Info]     = {prefix: '[Info]'    , color: 'color:#888888'}
        window.LogLevelMap[LogLevel.Elements] = {prefix: '[Elements]', color: 'color:#000000'}

        // Current log level
        DoLog.logLevel = LogLevel.Info; // Info Warning Success Error

        // Log counter
        DoLog.logCount === undefined && (DoLog.logCount = 0);
        if (++DoLog.logCount > 512) {
            console.clear();
            DoLog.logCount = 0;
        }

        // Get args
        let level, logContent, asObject;
        switch (arguments.length) {
            case 1:
                level = LogLevel.Info;
                logContent = arguments[0];
                asObject = false;
                break;
            case 2:
                level = arguments[0];
                logContent = arguments[1];
                asObject = false;
                break;
            case 3:
                level = arguments[0];
                logContent = arguments[1];
                asObject = arguments[2];
                break;
            default:
                level = LogLevel.Info;
                logContent = 'DoLog initialized.';
                asObject = false;
                break;
        }

        // Log when log level permits
        if (level <= DoLog.logLevel) {
            let msg = '%c' + LogLevelMap[level].prefix;
            let subst = LogLevelMap[level].color;

            if (asObject) {
                msg += ' %o';
            } else {
                switch(typeof(logContent)) {
                    case 'string': msg += ' %s'; break;
                    case 'number': msg += ' %d'; break;
                    case 'object': msg += ' %o'; break;
                }
            }

            console.log(msg, subst, logContent);
        }
    }
    DoLog();

	main();
	function main() {
		// Terminal element event listeners
		/*
		for (const elm of document.querySelectorAll('*')) {
			dealElement(elm);
		}
		document.addEventListener('DOMNodeInserted', (e) => {if(!e.target){debugger;}dealElement(e.target);});
		*/
		document.addEventListener('mousemove', function(e) {
			const elm = document.elementFromPoint(e.x, e.y);
			removeListeners(window.OSUMouse.target);
			addListeners(elm);
			window.OSUMouse.target = elm;
		}, {
			capture: true,
			passive: true
		})

		// Global event listeners
		document.body.onkeydown = keyDownListener;
		document.body.onkeyup = keyUpListener;

		// Global status recorder
		window.OSUMouse = {
			ctrlKey: false,
			altKey: false,
			shiftKey: false,
			metaKey: false,
			target: document.body
		};

		// Change cursor
		osuMouseCursor();
	}

	function addListeners(elm) {
		elm.addEventListener('mousemove', recordMouseStatus);
	}

	function removeListeners(elm) {
		// Record mouse status
		elm.removeEventListener('mousemove', recordMouseStatus);
	}

	function recordMouseStatus(e) {
		const props = ['screenX', 'screenY', 'clientX', 'clientY', 'relatedTarget', 'region']
		for (const prop of props) {
			window.OSUMouse[prop] = e[prop];
		}
	}

	function keyDownListener(e) {
		switch (e.key) {
			case 'Control':
				window.OSUMouse.ctrlKey = true;
				//DoLog(window.OSUMouse);
				break;
			case 'Shift':
				window.OSUMouse.shiftKey = true;
				//DoLog(window.OSUMouse);
				break;
			case 'Alt':
				window.OSUMouse.altKey = true;
				//DoLog(window.OSUMouse);
				break;
			case 'Meta':
				window.OSUMouse.metaKey = true;
				//DoLog(window.OSUMouse);
				break;
			case 'z':
			case 'Z':
			case 'x':
			case 'X':
				dispatchMouseDown(e.target);
				break;
		}
	}

	function keyUpListener(e) {
		switch (e.key) {
			case 'Control':
				window.OSUMouse.ctrlKey = false;
				//DoLog(window.OSUMouse);
				break;
			case 'Shift':
				window.OSUMouse.shiftKey = false;
				//DoLog(window.OSUMouse);
				break;
			case 'Alt':
				window.OSUMouse.altKey = false;
				//DoLog(window.OSUMouse);
				break;
			case 'Meta':
				window.OSUMouse.metaKey = false;
				//DoLog(window.OSUMouse);
				break;
			case 'z':
			case 'Z':
				!inputing() && dispatchMouseLeftUp();
				break;
			case 'x':
			case 'X':
				!inputing() && dispatchMouseRightUp();
				break;
		}
	}

	function dispatchMouseDown() {
		const mouseEventInit = {};
		for (const [key, value] of Object.entries(window.OSUMouse)) {
			mouseEventInit[key] = value;
		}
		mouseEventInit.bubbles = true;
		const focusEventInit = {relatedTarget: window.OSUMouse.relatedTarget, bubbles: true};
		const mouseLeft = new MouseEvent('mousedown', mouseEventInit);
		const focus = new FocusEvent('focus', focusEventInit);
		window.OSUMouse.target.dispatchEvent(focus);
		window.OSUMouse.target.dispatchEvent(mouseLeft);
	}

	function dispatchMouseLeftUp() {
		const mouseEventInit = {};
		for (const [key, value] of Object.entries(window.OSUMouse)) {
			mouseEventInit[key] = value;
		}
		mouseEventInit.bubbles = true;
		const mouseRight = new MouseEvent('mouseup', mouseEventInit);
		const mouseclick = new MouseEvent('click', mouseEventInit);
		window.OSUMouse.target.dispatchEvent(mouseRight);
		window.OSUMouse.target.dispatchEvent(mouseclick);
	}

	function dispatchMouseRightUp() {
		const mouseEventInit = {};
		for (const [key, value] of Object.entries(window.OSUMouse)) {
			mouseEventInit[key] = value;
		}
		mouseEventInit.bubbles = true;
		const mousecontextmenu = new MouseEvent('contentmenu', mouseEventInit);
		window.OSUMouse.target.dispatchEvent(mousecontextmenu);
	}

	function inputing() {
		return document.activeElement && [HTMLInputElement, HTMLTextAreaElement].some((o) => (document.activeElement instanceof o));
	}

	function osuMouseCursor() {
		// Cursor
		const OSUCursor = 'data:image/x-icon;base64,AAACAAEAICAAAA8ADwCoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALvXAQDW9gEA1vYBANb2AQDW9gEAu9cBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADW9gEA1vYDANb2BADW9gYA1vYIANb2CgDW9gsA1vYLANb2CgDW9ggA1vYGANb2BADW9gIA1vYBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADW9gEA1vYDANb2BwDW9gsA1vYQANb2FQDW9hoA1vYdANb2HwDW9h8A1vYdANb2GQDW9hUA1vYPANb2CwDW9gYA1vYDANb2AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1vYCANb2BgDW9gsA1vYSANb2GwDW9iQA1vYtANb2NADW9joA1vY9ANb2PQDW9joA1vY0ANb2LQDW9iQA1vYbANb2EgDW9gsA1vYGANb2AgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANb2AwDW9ggA1vYPANb2GgDW9icA1vY0ANb2QwDW9lAA1vZaANb2YQDW9mQA1vZkANb2YQDW9loA1vZPANb2QgDW9jQA1vYnANb2GgDW9g8A1vYHANb2AwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADW9gMA1vYIANb2EgDW9h8A1vYvANb2QwDW9lYA1vZqANb2egDW9oYA1vaOANb2kwDW9pMA1vaOANb2hgDW9noA1vZqANb2VgDW9kIA1vYvANb2HgDW9hEA1vYIANb2AwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1vYCANb2CADW9hIA1vYhANb2NQDW9k4A1vZmANb2fgDW9pMA1vakANb2sADW9rcA1va7ANb2uwDW9rcA1vawANb2pADW9pMA1vZ+ANb2ZQDW9k0A1vY1ANb2IQDW9hEA1vYHANb2AgAAAAAAAAAAAAAAAAAAAAAAAAAAANb2AQDW9gYA1vYPANb2HwDW9jUA1vZQANb2bgDW9osA1vakANb2uQDW9sgA1vbSANb22ADW9tsA1vbbANb22ADW9tIA1vbIANb2uQDW9qQA1vaLANb2bQDW9lAA1vY1ANb2HgDW9g8A1vYGANb2AQAAAAAAAAAAAAAAAAAAAAAA1vYDANb2CwDW9hoA1vYvANb2TgDW9m4A1vaOANb2rADW9sUA1vbWANb24wDW9uoA1vbuANb28ADW9vAA1vbvANb26gDW9uMA1vbXANb2xQDW9qwA1vaOANb2bQDW9k0A1vYvANb2GgDW9gsA1vYDAAAAAAAAAAAAAAAAANb2AQDW9gcA1vYSANb2JwDW9kMA1vZmANb2iwDW9qwA1vbIANb23gDW9usA1vb0ANL2+Tza+PtQ4vj8UOL4/Dza+PsA0vb5ANb29ADW9uwA1vbeANb2yQDW9qwA1vaLANb2ZQDW9kIA1vYnANb2EgDW9gYA1vYBAAAAAAAAAAAA1vYDANb2CwDW9hsA1vY0ANb2VgDW9n4A1vakANb2xQDW9t4A1vbuANb290XQ/P3m+/7+/P///////////////P///+b7/v5F0Pz9ANb29wDW9u4A1vbeANb2xQDW9qQA1vZ+ANb2VgDW9jQA1vYbANb2CwDW9gIAAAAAAAAAAADW9gQA1vYQANb2JADW9kMA1vZqANb2kwDW9rkA1vbWANb26wDW9vdx5fz9//////////////////////////////////////////9x5fz9ANb29wDW9uwA1vbXANb2uQDW9pMA1vZqANb2QgDW9iQA1vYPANb2BAAAAAAAAAAAANb2BgDW9hUA1vYtANb2UADW9noA1vakANb2yADW9uMA1vb0RdD8/f////////////////////////////////////////////////////9F0Pz9ANb29ADW9uMA1vbIANb2pADW9noA1vZPANb2LQDW9hUA1vYGAAAAAAC71wEA1vYIANb2GgDW9jQA1vZaANb2hgDW9rAA1vbSANb26gDS9vnm+/7+/////////////////////////////////////////////////////+b7/v4A0vb5ANb26gDW9tIA1vawANb2hgDW9loA1vY0ANb2GQDW9ggAu9cBANb2AQDW9goA1vYdANb2OgDW9mEA1vaOANb2twDW9tgA1vbuPNr4+/z//////////////////////////////////////////////////////////P///zza+PsA1vbvANb22ADW9rcA1vaOANb2YQDW9joA1vYdANb2CgDW9gEA1vYBANb2CwDW9h8A1vY9ANb2ZADW9pMA1va7ANb22wDW9vBQ4vj8////////////////////////////////////////////////////////////////UOL4/ADW9vAA1vbbANb2uwDW9pMA1vZkANb2PQDW9h8A1vYLANb2AQDW9gEA1vYLANb2HwDW9j0A1vZkANb2kwDW9rsA1vbbANb28FDi+Pz///////////////////////////////////////////////////////////////9Q4vj8ANb28ADW9tsA1va7ANb2kwDW9mQA1vY9ANb2HwDW9gsA1vYBANb2AQDW9goA1vYdANb2OgDW9mEA1vaOANb2twDW9tgA1vbvPNr4+/z//////////////////////////////////////////////////////////P///zza+PsA1vbuANb22ADW9rcA1vaOANb2YQDW9joA1vYdANb2CgDW9gEAu9cBANb2CADW9hkA1vY0ANb2WgDW9oYA1vawANb20gDW9uoA0vb55vv+/v/////////////////////////////////////////////////////m+/7+ANL2+QDW9uoA1vbSANb2sADW9oYA1vZaANb2NADW9hoA1vYIALvXAQAAAAAA1vYGANb2FQDW9i0A1vZPANb2egDW9qQA1vbIANb24wDW9vRF0Pz9/////////////////////////////////////////////////////0XQ/P0A1vb0ANb24wDW9sgA1vakANb2egDW9lAA1vYtANb2FQDW9gYAAAAAAAAAAADW9gQA1vYPANb2JADW9kIA1vZqANb2kwDW9rkA1vbXANb27ADW9vdx5fz9////////////////////////////////////////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';
		const CSSCursor = 'body {cursor: url("{C}"), auto !important;}'.replace('{C}', OSUCursor);
		addStyle(CSSCursor, 'osu_cursor');

		/*
		// Canvas
		const canvas = document.createElement('canvas');
		const CSSCanvas = '#osu_cursor_canvas {position: fixed; pointer-events: none; z-index: 99999999}';
		const img = new Image();
		img.onload = function() {
			const ctx = canvas.getContext('2d');
			const half = img.width / 2;
			canvas.width = img.width;
			canvas.height = img.height;
			ctx.drawImage(img, 0, 0);
			canvas.id = 'osu_cursor_canvas';
			document.body.addEventListener('mousemove', (e) => {
				canvas.style.top  = (e.clientY - half).toString() + 'px';
				canvas.style.left = (e.clientX - half).toString() + 'px';
			});
			document.body.appendChild(canvas);
		};
		img.src = OSUCursor;
		addStyle(CSSCanvas);
		*/
	}

	// Just stopPropagation and preventDefault
	function destroyEvent(e) {
		if (!e) {return false;};
		if (!e instanceof Event) {return false;};
		e.stopPropagation();
		e.preventDefault();
	}

	// Append a style text to document(<head>) with a <style> element
	function addStyle(css, id) {
		const style = document.createElement("style");
		id && (style.id = id);
		style.textContent = css;
		for (const elm of document.querySelectorAll('#'+id)) {
			elm.parentElement && elm.parentElement.removeChild(elm);
		}
        document.head.appendChild(style);
    }
})();