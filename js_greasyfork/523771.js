// ==UserScript==
// @name osrsworldheatmap.com - Dark Theme
// @namespace typpi.online
// @version 1.0.4
// @description Dark theme for OSRS World HeatMap
// @author Nick2bad4u
// @homepageURL https://github.com/Nick2bad4u/UserStyles
// @supportURL https://github.com/Nick2bad4u/UserStyles/issues
// @license UnLicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.osrsworldheatmap.com/*
// @downloadURL https://update.greasyfork.org/scripts/523771/osrsworldheatmapcom%20-%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/523771/osrsworldheatmapcom%20-%20Dark%20Theme.meta.js
// ==/UserScript==

(function() {
let css = `
	/* Invert colors except images and videos */
	.leaflet-pane,
	.leaflet-tile,
	.leaflet-marker-icon,
	.leaflet-marker-shadow,
	.leaflet-tile-container,
	.leaflet-pane > svg,
	.leaflet-pane > canvas,
	.leaflet-zoom-box,
	.leaflet-image-layer,
	.leaflet-layer {
		position: absolute;
		top: 0;
		left: 0;
	}

	.leaflet-container {
		overflow: hidden;
	}

	.leaflet-tile,
	.leaflet-marker-icon,
	.leaflet-marker-shadow {
		-webkit-user-select: none;
		-moz-user-select: none;
		user-select: none;
		-webkit-user-drag: none;
	}

	.leaflet-tile::selection {
		background: transparent;
	}

	.leaflet-safari .leaflet-tile {
		image-rendering: -webkit-optimize-contrast;
	}

	.leaflet-safari .leaflet-tile-container {
		-webkit-transform-origin: 0 0;
		transform-origin: 0 0;
		width: 1600px;
		height: 1600px;
	}

	.leaflet-marker-icon,
	.leaflet-marker-shadow {
		display: block;
	}

	.leaflet-container .leaflet-overlay-pane svg {
		max-width: none !important;
		max-height: none !important;
	}

	.leaflet-container .leaflet-marker-pane img,
	.leaflet-container .leaflet-shadow-pane img,
	.leaflet-container .leaflet-tile-pane img,
	.leaflet-container img.leaflet-image-layer,
	.leaflet-container .leaflet-tile {
		padding: 0;
		width: auto;
		max-width: none !important;
		max-height: none !important;
	}

	.leaflet-container img.leaflet-tile {
		mix-blend-mode: plus-lighter;
	}

	.leaflet-container.leaflet-touch-zoom {
		-ms-touch-action: pan-x pan-y;
		touch-action: pan-x pan-y;
	}

	.leaflet-container.leaflet-touch-drag {
		-ms-touch-action: pinch-zoom;
		touch-action: none;
		touch-action: pinch-zoom;
	}

	.leaflet-container.leaflet-touch-drag.leaflet-touch-zoom {
		-ms-touch-action: none;
		touch-action: none;
	}

	.leaflet-container {
		-webkit-tap-highlight-color: transparent;
	}

	.leaflet-container a {
		-webkit-tap-highlight-color: rgb(51 181 229 / 40%);
	}

	.leaflet-tile {
		visibility: hidden;
		filter: inherit;
	}

	.leaflet-tile-loaded {
		visibility: inherit;
	}

	.leaflet-zoom-box {
		z-index: 800;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
		width: 0;
		height: 0;
	}

	.leaflet-overlay-pane svg {
		-moz-user-select: none;
		user-select: none;
	}

	.leaflet-pane {
		z-index: 400;
	}

	.leaflet-tile-pane {
		z-index: 200;
	}

	.leaflet-overlay-pane {
		z-index: 400;
	}

	.leaflet-shadow-pane {
		z-index: 500;
	}

	.leaflet-marker-pane {
		z-index: 600;
	}

	.leaflet-tooltip-pane {
		z-index: 650;
	}

	.leaflet-popup-pane {
		z-index: 700;
	}

	.leaflet-map-pane canvas {
		z-index: 100;
	}

	.leaflet-map-pane svg {
		z-index: 200;
	}

	.leaflet-vml-shape {
		width: 1px;
		height: 1px;
	}

	.lvml {
		behavior: url('#default#VML');
		display: inline-block;
		position: absolute;
	}

	.leaflet-control {
		position: relative;
		z-index: 800;
		pointer-events: visiblepainted;
		pointer-events: auto;
	}

	.leaflet-top,
	.leaflet-bottom {
		position: absolute;
		z-index: 1000;
		pointer-events: none;
	}

	.leaflet-top {
		top: 0;
	}

	.leaflet-right {
		right: 0;
	}

	.leaflet-bottom {
		bottom: 0;
	}

	.leaflet-left {
		left: 0;
	}

	.leaflet-control {
		float: left;
		clear: both;
	}

	.leaflet-right .leaflet-control {
		float: right;
	}

	.leaflet-top .leaflet-control {
		margin-top: 10px;
	}

	.leaflet-bottom .leaflet-control {
		margin-bottom: 10px;
	}

	.leaflet-left .leaflet-control {
		margin-left: 10px;
	}

	.leaflet-right .leaflet-control {
		margin-right: 10px;
	}

	.leaflet-fade-anim .leaflet-popup {
		opacity: 0%;
		-webkit-transition: opacity 0.2s linear;
		-moz-transition: opacity 0.2s linear;
		transition: opacity 0.2s linear;
	}

	.leaflet-fade-anim .leaflet-map-pane .leaflet-popup {
		opacity: 100%;
	}

	.leaflet-zoom-animated {
		-webkit-transform-origin: 0 0;
		-ms-transform-origin: 0 0;
		transform-origin: 0 0;
	}

	svg.leaflet-zoom-animated {
		will-change: transform;
	}

	.leaflet-zoom-anim .leaflet-zoom-animated {
		-webkit-transition: -webkit-transform 0.25s
			cubic-bezier(0, 0, 0.25, 1);
		-moz-transition: -moz-transform 0.25s
			cubic-bezier(0, 0, 0.25, 1);
		transition: transform 0.25s cubic-bezier(0, 0, 0.25, 1);
	}

	.leaflet-zoom-anim .leaflet-tile,
	.leaflet-pan-anim .leaflet-tile {
		-webkit-transition: none;
		-moz-transition: none;
		transition: none;
	}

	.leaflet-zoom-anim .leaflet-zoom-hide {
		visibility: hidden;
	}

	.leaflet-interactive {
		cursor: pointer;
	}

	.leaflet-grab {
		cursor: grab;
	}

	.leaflet-crosshair,
	.leaflet-crosshair .leaflet-interactive {
		cursor: crosshair;
	}

	.leaflet-popup-pane,
	.leaflet-control {
		cursor: auto;
	}

	.leaflet-dragging .leaflet-grab,
	.leaflet-dragging .leaflet-grab .leaflet-interactive,
	.leaflet-dragging .leaflet-marker-draggable {
		cursor: move;
		cursor: grabbing;
		cursor: grabbing;
		cursor: grabbing;
	}

	.leaflet-marker-icon,
	.leaflet-marker-shadow,
	.leaflet-image-layer,
	.leaflet-pane > svg path,
	.leaflet-tile-container {
		pointer-events: none;
	}

	.leaflet-marker-icon.leaflet-interactive,
	.leaflet-image-layer.leaflet-interactive,
	.leaflet-pane > svg path.leaflet-interactive,
	svg.leaflet-image-layer.leaflet-interactive path {
		pointer-events: visiblepainted;
		pointer-events: auto;
	}

	.leaflet-container {
		outline-offset: 1px;
		background: #ddd;
	}

	.leaflet-container a {
		color: #0078a8;
	}

	.leaflet-zoom-box {
		border: 2px dotted #38f;
		background: #ffffff80;
	}

	.leaflet-container {
		font-size: 12px;
		font-size: 0.75rem;
		line-height: 1.5;
		font-family:
			Helvetica Neue,
			Arial,
			Helvetica,
			sans-serif;
	}

	.leaflet-bar {
		box-shadow: 0 1px 5px #000000a6;
		border-radius: 4px;
	}

	.leaflet-bar a {
		display: block;
		border-bottom: 1px solid #ccc;
		background-color: #aa0c0c;
		width: 26px;
		height: 26px;
		color: #000;
		line-height: 26px;
		text-align: center;
		text-decoration: none;
	}

	.leaflet-bar a,
	.leaflet-control-layers-toggle {
		display: block;
		background-position: 50% 50%;
		background-repeat: no-repeat;
	}

	.leaflet-bar a:hover,
	.leaflet-bar a:focus {
		background-color: #9856de;
	}

	.leaflet-bar a:first-child {
		border-top-right-radius: 4px;
		border-top-left-radius: 4px;
	}

	.leaflet-bar a:last-child {
		border-bottom: none;
		border-bottom-right-radius: 4px;
		border-bottom-left-radius: 4px;
	}

	.leaflet-bar a.leaflet-disabled {
		cursor: default;
		background-color: #f4f4f4;
		color: #bbb;
	}

	.leaflet-touch .leaflet-bar a {
		width: 30px;
		height: 30px;
		line-height: 30px;
	}

	.leaflet-touch .leaflet-bar a:first-child {
		border-top-right-radius: 2px;
		border-top-left-radius: 2px;
	}

	.leaflet-touch .leaflet-bar a:last-child {
		border-bottom-right-radius: 2px;
		border-bottom-left-radius: 2px;
	}

	.leaflet-control-zoom-in,
	.leaflet-control-zoom-out {
		font:
			700 18px Lucida Console,
			Monaco,
			monospace;
		text-indent: 1px;
	}

	.leaflet-touch .leaflet-control-zoom-in,
	.leaflet-touch .leaflet-control-zoom-out {
		font-size: 22px;
	}

	.leaflet-control-layers {
		box-shadow: 0 1px 5px #0006;
		border-radius: 5px;
		background: #fff;
	}

	.leaflet-control-layers-toggle {
		background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAQAAAADQ4RFAAACf0lEQVR4AY1UM3gkARTePdvdoTxXKc+qTl3aU5U6b2Kbkz3Gtq3Zw6ziLGNPzrYx7946Tr6/ee/XeCQ4D3ykPtL5tHno4n0d/h3+xfuWHGLX81cn7r0iTNzjr7LrlxCqPtkbTQEHeqOrTy4Yyt3VCi/IOB0v7rVC7q45Q3Gr5K6jt+3Gl5nCoDD4MtO+j96Wu8atmhGqcNGHObuf8OM/x3AMx38+4Z2sPqzCxRFK2aF2e5Jol56XTLyggAMTL56XOMoS1W4pOyjUcGGQdZxU6qRh7B9Zp+PfpOFlqt0zyDZckPi1ttmIp03jX8gyJ8a/PG2yutpS/Vol7peZIbZcKBAEEheEIAgFbDkz5H6Zrkm2hVWGiXKiF4Ycw0RWKdtC16Q7qe3X4iOMxruonzegJzWaXFrU9utOSsLUmrc0YjeWYjCW4PDMADElpJSSQ0vQvA1Tm6/JlKnqFs1EGyZiFCqnRZTEJJJiKRYzVYzJck2Rm6P4iH+cmSY0YzimYa8l0EtTODFWhcMIMVqdsI2uiTvKmTisIDHJ3od5GILVhBCarCfVRmo4uTjkhrhzkiBV7SsaqS+TzrzM1qpGGUFt28pIySQHR6h7F6KSwGWm97ay+Z+ZqMcEjEWebE7wxCSQwpkhJqoZA5ivCdZDjJepuJ9IQjGGUmuXJdBFUygxVqVsxFsLMbDe8ZbDYVCGKxs+W080max1hFCarCfV+C1KATwcnvE9gRRuMP2prdbWGowm1KB1y+zwMMENkM755cJ2yPDtqhTI6ED1M/82yIDtC/4j4BijjeObflpO9I9MwXTCsSX8jWAFeHr05WoLTJ5G8IQVS/7vwR6ohirYM7f6HzYpogfS3R2OAAAAAElFTkSuQmCC');
		width: 36px;
		height: 36px;
	}

	.leaflet-retina .leaflet-control-layers-toggle {
		background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAQAAABvcdNgAAAEsklEQVR4AWL4TydIhpZK1kpWOlg0w3ZXP6D2soBtG42jeI6ZmQTHzAxiTbSJsYLjO9HhP+WOmcuhciVnmHVQcJnp7DFvScowZorad/+V/fVzMdMT2g9Cv9guXGv/7pYOrXh2U+RRR3dSd9JRx6bIFc/ekqHI29JC6pJ5ZEh1yWkhkbcFeSjxgx3L2m1cb1C7bceyxA+CNjT/Ifff+/kDk2u/w/33/IeCMOSaWZ4glosqT3DNnNZQ7Cs58/3Ce5HL78iZH/vKVIaYlqzfdLu8Vi7dnvUbEza5Idt36tquZFldl6N5Z/POLof0XLK61mZCmJSWjVF9tEjUluu74IUXvgttuVIHE7YxSkaYhJZam7yiM9Pv82JYfl9nptxZaxMJE4YSPty+vF0+Y2up9d3wwijfjZbabqm/3bZ9ecKHsiGmRflnn1MW4pjHf9oLufyn2z3y1D6n8g8TZhxyzipLNPnAUpsOiuWimg52psrTZYnOWYNDTMuWBWa0tJb4rgq1UvmutpaYEbZlwU3CLJm/ayYjHW5/h7xWLn9Hh1vepDkyf7dE7MtT5LR4e7yYpHrkhOUpEfssBLq2pPhAqoSWKUkk7EDqkmK6RrCEzqDjhNDWNE+XSMvkJRDWlZTmCW0l0PHQGRZY5t1L83kT0Y3l2SItk5JAWHl2dCOBm+fPu3fo5/3v61RMCO9Jx2EEYYhb0rmNQMX/vm7gqOEJLcXTGw3CAuRNeyaPWwjR8PRqKQ1PDA/dpv+on9Shox52WFnx0KY8onHayrJzm87i5h9xGw/tfkev0jGsQizqezUKjk12hBMKJ4kbCqGPVNXudyyrShovGw5CgxsRICxF6aRmSjlBnHRzg7Gx8fKqEubI2rahQYdR1YgDIRQO7JvQyD52hoIQx0mxa0ODtW2Iozn1le2iIRdzwWewedyZzewidueOGqlsn1MvcnQpuVwLGG3/IR1hIKxCjelIDZ8ldqWz25jWAsnldEnK0Zxro19TGVb2ffIZEsIO89EIEDvKMPrzmBOQcKQ+rroye6NgRRxqR4U8EAkz0CL6uSGOm6KQCdWjvjRiSP1BPalCRS5iQYiEIvxuBMJEWgzSoHADcVMuN7IuqqTeyUPq22qFimFtxDyBBJEwNyt6TM88blFHao/6tWWhuuOM4SAK4EI4QmFHA+SEyWlp4EQoJ13cYGzMu7yszEIBOm2rVmHUNqwAIQabISNMRstmdhNWcFLsSm+0tjJH1MdRxO5Nx0WDMhCtgD6OKgZeljJqJKc9po8juskR9XN0Y1lZ3mWjLR9JCO1jRDMd0fpYC2VnvjBSEFg7wBENc0R9HFlb0xvF1+TBEpF68d+DHR6IOWVv2BECtxo46hOFUBd/APU57WIoEwJhIi2CdpyZX0m93BZicktMj1AS9dClteUFAUNUIEygRZCtik5zSxI9MubTBH1GOiHsiLJ3OCoSZkILa9PxiN0EbvhsAo8tdAf9Seepd36lGWHmtNANTv5Jd0z4QYyeo/UEJqxKRpg5LZx6btLPsOaEmdMyxYdlc8LMaJnikDlhclqmPiQnTEpLUIZEwkRagjYkEibQErwhkTAKCLQEbUgkzJQWc/0PstHHcfEdQ+UAAAAASUVORK5CYII=');
		background-size: 26px 26px;
	}

	.leaflet-touch .leaflet-control-layers-toggle {
		width: 44px;
		height: 44px;
	}

	.leaflet-control-layers .leaflet-control-layers-list,
	.leaflet-control-layers-expanded
		.leaflet-control-layers-toggle {
		display: none;
	}

	.leaflet-control-layers-expanded
		.leaflet-control-layers-list {
		display: block;
		position: relative;
	}

	.leaflet-control-layers-expanded {
		background: #fff;
		padding: 6px 10px 6px 6px;
		color: #333;
	}

	.leaflet-control-layers-scrollbar {
		padding-right: 5px;
		overflow: hidden scroll;
	}

	.leaflet-control-layers-selector {
		position: relative;
		top: 1px;
		margin-top: 2px;
	}

	.leaflet-control-layers label {
		display: block;
		font-size: 13px;
		font-size: 1.08333em;
	}

	.leaflet-control-layers-separator {
		margin: 5px -10px 5px -6px;
		border-top: 1px solid #ddd;
		height: 0;
	}

	.leaflet-default-icon-path {
		background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII=');
	}

	.leaflet-container .leaflet-control-attribution {
		margin: 0;
		background: #fff;
		background: #fffc;
	}

	.leaflet-control-attribution,
	.leaflet-control-scale-line {
		padding: 0 5px;
		color: #333;
		line-height: 1.4;
	}

	.leaflet-control-attribution a {
		text-decoration: none;
	}

	.leaflet-control-attribution a:hover,
	.leaflet-control-attribution a:focus {
		text-decoration: underline;
	}

	.leaflet-attribution-flag {
		display: inline !important;
		vertical-align: baseline !important;
		width: 1em;
		height: 0.6669em;
	}

	.leaflet-left .leaflet-control-scale {
		margin-left: 5px;
	}

	.leaflet-bottom .leaflet-control-scale {
		margin-bottom: 5px;
	}

	.leaflet-control-scale-line {
		-moz-box-sizing: border-box;
		box-sizing: border-box;
		border: 2px solid #777;
		border-top: none;
		background: #fffc;
		padding: 2px 5px 1px;
		line-height: 1.1;
		text-shadow: 1px 1px #fff;
		white-space: nowrap;
	}

	.leaflet-control-scale-line:not(:first-child) {
		margin-top: -2px;
		border-top: 2px solid #777;
		border-bottom: none;
	}

	.leaflet-control-scale-line:not(
			:first-child,
			:last-child
		) {
		border-bottom: 2px solid #777;
	}

	.leaflet-touch .leaflet-control-attribution,
	.leaflet-touch .leaflet-control-layers,
	.leaflet-touch .leaflet-bar {
		box-shadow: none;
	}

	.leaflet-touch .leaflet-control-layers,
	.leaflet-touch .leaflet-bar {
		border: 2px solid rgb(0 0 0 / 20%);
		background-clip: padding-box;
	}

	.leaflet-popup {
		position: absolute;
		margin-bottom: 20px;
		text-align: center;
	}

	.leaflet-popup-content-wrapper {
		border-radius: 12px;
		padding: 1px;
		text-align: left;
	}

	.leaflet-popup-content {
		margin: 13px 24px 13px 20px;
		min-height: 1px;
		font-size: 13px;
		font-size: 1.08333em;
		line-height: 1.3;
	}

	.leaflet-popup-content p {
		margin: 1.3em 0;
	}

	.leaflet-popup-tip-container {
		position: absolute;
		left: 50%;
		margin-top: -1px;
		margin-left: -20px;
		width: 40px;
		height: 20px;
		overflow: hidden;
		pointer-events: none;
	}

	.leaflet-popup-tip {
		-webkit-transform: rotate(45deg);
		-moz-transform: rotate(45deg);
		-ms-transform: rotate(45deg);
		transform: rotate(45deg);
		margin: -10px auto 0;
		padding: 1px;
		width: 17px;
		height: 17px;
		pointer-events: auto;
	}

	.leaflet-popup-content-wrapper,
	.leaflet-popup-tip {
		box-shadow: 0 3px 14px #0006;
		background: #fff;
		color: #333;
	}

	.leaflet-container a.leaflet-popup-close-button {
		position: absolute;
		top: 0;
		right: 0;
		border: none;
		background: transparent;
		width: 24px;
		height: 24px;
		color: #757575;
		font:
			16px/24px Tahoma,
			Verdana,
			sans-serif;
		text-align: center;
		text-decoration: none;
	}

	.leaflet-container a.leaflet-popup-close-button:hover,
	.leaflet-container a.leaflet-popup-close-button:focus {
		color: #585858;
	}

	.leaflet-popup-scrolled {
		overflow: auto;
	}

	.leaflet-oldie .leaflet-popup-content-wrapper {
		-ms-zoom: 1;
		zoom: 1;
	}

	.leaflet-oldie .leaflet-popup-tip {
		-ms-filter: 'progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678)';
		filter: progid:DXImageTransform.Microsoft.Matrix(M11 = .70710678, M12 = .70710678, M21 = -.70710678, M22 = .70710678);
		margin: 0 auto;
		width: 24px;
	}

	.leaflet-oldie .leaflet-control-zoom,
	.leaflet-oldie .leaflet-control-layers,
	.leaflet-oldie .leaflet-popup-content-wrapper,
	.leaflet-oldie .leaflet-popup-tip {
		border: 1px solid #999;
	}

	.leaflet-div-icon {
		border: 1px solid #666;
		background: #fff;
	}

	.leaflet-tooltip {
		position: absolute;
		box-shadow: 0 1px 3px #0006;
		border: 1px solid #fff;
		border-radius: 3px;
		background-color: #000;
		padding: 6px;
		pointer-events: none;
		color: #222;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		white-space: nowrap;
	}

	.leaflet-tooltip.leaflet-interactive {
		cursor: pointer;
		pointer-events: auto;
	}

	.leaflet-tooltip-top::before,
	.leaflet-tooltip-bottom::before,
	.leaflet-tooltip-left::before,
	.leaflet-tooltip-right::before {
		position: absolute;
		border: 6px solid transparent;
		background: transparent;
		pointer-events: none;
		content: '';
	}

	.leaflet-tooltip-bottom {
		margin-top: 6px;
	}

	.leaflet-tooltip-top {
		margin-top: -6px;
	}

	.leaflet-tooltip-bottom::before,
	.leaflet-tooltip-top::before {
		left: 50%;
		margin-left: -6px;
	}

	.leaflet-tooltip-top::before {
		bottom: 0;
		margin-bottom: -12px;
		border-top-color: #fff;
	}

	.leaflet-tooltip-bottom::before {
		top: 0;
		margin-top: -12px;
		margin-left: -6px;
		border-bottom-color: #fff;
	}

	.leaflet-tooltip-left {
		margin-left: -6px;
	}

	.leaflet-tooltip-right {
		margin-left: 6px;
	}

	.leaflet-tooltip-left::before,
	.leaflet-tooltip-right::before {
		top: 50%;
		margin-top: -6px;
	}

	.leaflet-tooltip-left::before {
		right: 0;
		margin-right: -12px;
		border-left-color: #fff;
	}

	.leaflet-tooltip-right::before {
		left: 0;
		margin-left: -12px;
		border-right-color: #fff;
	}

	@media print {
		.leaflet-control {
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
		}
	}

	.leaflet-container .leaflet-control-mouseposition {
		margin: 0;
		box-shadow: 0 0 5px #bbb;
		background-color: #ffffffb3;
		padding: 0 5px;
		color: #333;
		font:
			11px/1.5 Helvetica Neue,
			Arial,
			Helvetica,
			sans-serif;
	}

	:root {
		background-color: #242424;
		color: #ffffffde;
		color-scheme: light dark;
		font-weight: 400;
		line-height: 1.5;
		font-family: Inter, system-ui, Avenir, Helvetica, Arial,
			sans-serif;
		font-synthesis: none;
		text-rendering: optimizelegibility;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	a {
		color: #646cff;
		font-weight: 500;
		text-decoration: inherit;
	}

	a:hover {
		color: #535bf2;
	}

	body {
		display: flex;
		place-items: center;
		margin: 0;
		min-width: 320px;
		min-height: 100vh;
	}

	h1 {
		font-size: 3.2em;
		line-height: 1.1;
	}

	#app {
		margin: 0 auto;
		padding: 2rem;
		max-width: 1280px;
		text-align: center;
	}

	.logo {
		transition: filter 0.3s;
		will-change: filter;
		padding: 1.5em;
		height: 6em;
	}

	.logo:hover {
		filter: drop-shadow(0 0 2em #646cffaa);
	}

	.logo.vanilla:hover {
		filter: drop-shadow(0 0 2em #3178c6aa);
	}

	.card {
		padding: 2em;
	}

	.read-the-docs {
		color: #888;
	}

	button {
		transition: border-color 0.25s;
		cursor: pointer;
		border: 1px solid transparent;
		border-radius: 8px;
		background-color: #1a1a1a;
		padding: 0.6em 1.2em;
		font-weight: 500;
		font-size: 1em;
		font-family: inherit;
	}

	button:hover {
		border-color: #646cff;
	}

	button:focus,
	button:focus-visible {
		outline: 4px auto -webkit-focus-ring-color;
	}

	@media (prefers-color-scheme: light) {
		:root {
			background-color: #fff;
			color: #213547;
		}

		a:hover {
			color: #747bff;
		}

		button {
			background-color: #f9f9f9;
		}
	}

	#map {
		background-color: #000;
		width: 100%;
		height: 100vh;
	}

	.leaflet-control {
		position: relative;
		right: -100%;
		transition: right 0.3s ease-in-out;
		box-shadow: 0 2px 8px #00000026;
		border-radius: 5px;
		background-color: #000 !important;
		padding: 1em;
		width: 15em;
		color: #9856de !important;
	}

	.leaflet-container.controls-active .leaflet-control {
		right: 0;
	}

	@media (width >= 769px) {
		.leaflet-container .leaflet-control {
			right: 0;
		}

		.leaflet-container.controls-active .leaflet-control {
			right: -100%;
		}
	}

	.leaflet-control label {
		display: block;
		margin-bottom: 5px;
		color: #9856de !important;
		font-weight: 700;
	}

	.leaflet-control select,
	.leaflet-control input[type='range'] {
		margin-bottom: 10px;
		border: 1px solid #9856de;
		border-radius: 5px;
		background-color: #000000e3;
		padding: 5px;
		color: #fff;
	}

	.leaflet-control-effects {
		display: flex;
		justify-content: space-between;
		gap: 5px;
	}

	.leaflet-control .leaflet-bar-part {
		display: flex;
		flex: 1;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
		border: 1px solid #9856de !important;
		border-radius: 4px;
		background-color: #000;
		color: #fff;
		font-size: 14px;
		text-decoration: none;
		white-space: nowrap;
	}

	.leaflet-control .leaflet-bar-part:hover {
		background-color: #9856de;
	}

	.leaflet-control .leaflet-bar-part:last-child {
		border-bottom: 1px solid #ccc;
	}

	.custom-layer-account-control {
		border-radius: 5px;
		background-color: #000;
		padding: 10px;
	}

	.report-modal {
		display: flex;
		flex-direction: column;
		gap: 1em;
		padding: 1em;
		width: 20em;
	}

	.leaflet-control-attribution {
		margin: 0;
		background: none;
		width: auto;
		color: #333;
		font-size: 11px;
		line-height: 1.5;
	}

	.leaflet-control-attribution a {
		color: #0078a8;
		text-decoration: none;
	}

	.leaflet-control-attribution a:hover {
		text-decoration: underline;
	}

	.hamburger {
		display: flex;
		position: fixed;
		top: 15px;
		right: 15px;
		justify-content: center;
		align-items: center;
		z-index: 1000;
		cursor: pointer;
		border: none;
		border-radius: 5px;
		background-color: #333;
		width: 30px;
		height: 30px;
		color: #9856de;
	}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
