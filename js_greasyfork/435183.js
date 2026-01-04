// ==UserScript==
// @name Hackage Haddock Restyler
// @description Switches all Haddock docs on Hackage to an updated, Retina-friendly edition of the old ocean.css for superior information density.
// @version 1.4
// @license BSD2
// @grant none
// @include https://hackage.haskell.org/*
// @namespace https://greasyfork.org/users/833386
// @downloadURL https://update.greasyfork.org/scripts/435183/Hackage%20Haddock%20Restyler.user.js
// @updateURL https://update.greasyfork.org/scripts/435183/Hackage%20Haddock%20Restyler.meta.js
// ==/UserScript==

[...document.head.querySelectorAll('link[rel="stylesheet"][title]:not([title="QuickJump"])')].forEach(s => {
  const svguri = (t) => `data:image/svg+xml;base64,${btoa(t)}`;
	const svg = (a, t) => svguri(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" ${a}>
${t.split("\n").map(l => `	${l}`).join("\n")}
</svg>
`);
	const button = (extra) => svg('viewBox="0 0 9 9" width="9" height="9"',
`<rect x="0" y="0" width="9" height="9" fill="#828282"/>
<rect x="1" y="1" width="7" height="7" fill="#FFF"/>
<rect x="2" y="4" width="5" height="1" fille="#000"/>${extra}`);
	
	const minus = button('');
	const plus = button(`
<rect x="4" y="2" width="1" height="5" fille="#000"/>
`);
 	const hslogo = svg('width="22.65px" height="16px" viewBox="0 0 204 144"',
`<g fill="#FFF">
	<path d="M 0 144 L 48 72 L 0 0 L 36 0 L 84 72 L 36 144"/>
	<path d="M 164 102 L 148 78 L 204 78 L 204 102"/>
	<path d="M 140 66 L 124 42 L 204 42 L 204 66"/>
</g>
<g fill="#CCC">
	<path d="M 48 144 L 96 72 L 48 0 L 84 0 L 180 144 L 144 144 L 114 99 L 84 144"/>
</g>`);
	const synopsis = svg('xmlns:xlink="http://www.w3.org/1999/xlink" width="128" height="104" viewBox="0 0 128 104"',
`<defs>
	<filter id="drop">
		<feOffset result="off" in="SourceAlpha" dx="-1.5" dy="0" />
		<feGaussianBlur result="blur" in="off" stdDeviation="1.5" />
		<feFlood flood-color="#000" flood-opacity="0.7" result="scol" />
		<feComposite in="scol" in2="blur" operator="in" result="shadow" />
		<feBlend in="SourceGraphic" in2="shadow" mode="normal" />
	</filter>
</defs>
<g transform="rotate(-90) translate(-104)">
	<rect id="bg" x="15.5" y="8.5" width="80" height="40" rx="5" filter="url(#drop)" fill="#faf7de" />
	<use xlink:href="#bg" y="64" />
	<path id="Synopsis" transform="translate(18 12)" fill="#4e6272"
		d="M 2.17,6.96
		   C 2.17,6.96 0.03,6.96 0.03,6.96
		     0.02,7.59 0.13,8.13 0.37,8.59
		     0.60,9.05 0.92,9.43 1.31,9.73
		     1.71,10.03 2.17,10.25 2.69,10.40
		     3.21,10.54 3.75,10.61 4.30,10.61
		     4.98,10.61 5.59,10.53 6.11,10.37
		     6.63,10.21 7.06,9.98 7.41,9.70
		     7.76,9.41 8.03,9.07 8.21,8.67
		     8.39,8.27 8.47,7.85 8.47,7.38
		     8.47,6.82 8.35,6.35 8.12,5.99
		     7.88,5.63 7.59,5.34 7.27,5.12
		     6.94,4.90 6.61,4.75 6.28,4.65
		     5.94,4.55 5.68,4.48 5.50,4.44
		     4.87,4.28 4.36,4.15 3.97,4.05
		     3.58,3.94 3.28,3.84 3.06,3.73
		     2.84,3.63 2.69,3.52 2.62,3.39
		     2.54,3.27 2.50,3.11 2.50,2.91
		     2.50,2.70 2.55,2.52 2.64,2.38
		     2.74,2.24 2.86,2.12 3.00,2.02
		     3.15,1.93 3.31,1.86 3.49,1.82
		     3.66,1.79 3.84,1.77 4.02,1.77
		     4.29,1.77 4.54,1.79 4.77,1.84
		     5.00,1.89 5.21,1.97 5.38,2.08
		     5.56,2.20 5.70,2.35 5.81,2.55
		     5.92,2.75 5.98,3.00 6.00,3.31
		     6.00,3.31 8.14,3.31 8.14,3.31
		     8.14,2.72 8.03,2.22 7.81,1.80
		     7.59,1.38 7.29,1.04 6.92,0.77
		     6.54,0.50 6.11,0.30 5.63,0.18
		     5.15,0.06 4.64,0.00 4.12,0.00
		     3.67,0.00 3.22,0.06 2.77,0.18
		     2.32,0.31 1.92,0.49 1.56,0.75
		     1.21,1.00 0.92,1.32 0.70,1.70
		     0.48,2.08 0.37,2.53 0.37,3.05
		     0.37,3.51 0.45,3.90 0.63,4.23
		     0.80,4.55 1.03,4.82 1.31,5.04
		     1.59,5.26 1.91,5.43 2.26,5.57
		     2.62,5.71 2.98,5.82 3.36,5.92
		     3.72,6.02 4.08,6.11 4.44,6.20
		     4.80,6.28 5.12,6.38 5.40,6.50
		     5.68,6.61 5.91,6.75 6.08,6.92
		     6.25,7.09 6.34,7.31 6.34,7.58
		     6.34,7.84 6.27,8.05 6.14,8.21
		     6.01,8.38 5.85,8.51 5.65,8.60
		     5.45,8.69 5.24,8.76 5.02,8.79
		     4.79,8.82 4.58,8.84 4.38,8.84
		     4.09,8.84 3.81,8.81 3.54,8.73
		     3.27,8.66 3.03,8.55 2.83,8.41
		     2.63,8.26 2.47,8.07 2.35,7.83
		     2.23,7.59 2.17,7.30 2.17,6.96 Z
		   M 13.16,11.33
		   C 13.16,11.33 16.20,3.02 16.20,3.02
		     16.20,3.02 14.13,3.02 14.13,3.02
		     14.13,3.02 12.54,8.08 12.54,8.08
		     12.54,8.08 12.52,8.08 12.52,8.08
		     12.52,8.08 10.87,3.02 10.87,3.02
		     10.87,3.02 8.75,3.02 8.75,3.02
		     8.75,3.02 11.29,9.93 11.29,9.93
		     11.35,10.07 11.38,10.23 11.38,10.39
		     11.38,10.61 11.31,10.81 11.19,10.98
		     11.06,11.17 10.87,11.27 10.61,11.30
		     10.41,11.31 10.21,11.30 10.01,11.28
		     9.82,11.27 9.63,11.25 9.44,11.23
		     9.44,11.23 9.44,12.90 9.44,12.90
		     9.65,12.92 9.85,12.95 10.05,12.97
		     10.25,12.99 10.46,13.00 10.66,13.00
		     11.35,13.00 11.88,12.87 12.26,12.61
		     12.65,12.36 12.95,11.93 13.16,11.33 Z
		   M 16.86,2.98
		   C 16.86,2.98 16.86,10.40 16.86,10.40
		     16.86,10.40 18.86,10.40 18.86,10.40
		     18.86,10.40 18.86,6.50 18.86,6.50
		     18.86,5.74 18.98,5.20 19.22,4.87
		     19.47,4.53 19.86,4.37 20.40,4.37
		     20.88,4.37 21.21,4.52 21.40,4.82
		     21.59,5.12 21.68,5.58 21.68,6.20
		     21.68,6.20 21.68,10.40 21.68,10.40
		     21.68,10.40 23.68,10.40 23.68,10.40
		     23.68,10.40 23.68,5.85 23.68,5.85
		     23.68,5.40 23.64,4.98 23.56,4.60
		     23.48,4.23 23.34,3.91 23.14,3.64
		     22.95,3.38 22.68,3.18 22.33,3.03
		     21.99,2.88 21.55,2.81 21.02,2.81
		     20.60,2.81 20.19,2.90 19.78,3.09
		     19.38,3.28 19.05,3.59 18.80,4.01
		     18.80,4.01 18.76,4.01 18.76,4.01
		     18.76,4.01 18.76,2.98 18.76,2.98
		     18.76,2.98 16.86,2.98 16.86,2.98 Z
		   M 26.94,6.71
		   C 26.94,6.42 26.97,6.14 27.02,5.85
		     27.08,5.57 27.18,5.32 27.31,5.10
		     27.45,4.89 27.63,4.71 27.85,4.57
		     28.08,4.44 28.36,4.37 28.70,4.37
		     29.03,4.37 29.32,4.44 29.54,4.57
		     29.77,4.71 29.96,4.89 30.09,5.10
		     30.23,5.32 30.33,5.57 30.38,5.85
		     30.44,6.14 30.47,6.42 30.47,6.71
		     30.47,7.01 30.44,7.29 30.38,7.57
		     30.33,7.85 30.23,8.10 30.09,8.32
		     29.96,8.54 29.77,8.72 29.54,8.85
		     29.32,8.98 29.03,9.05 28.70,9.05
		     28.36,9.05 28.08,8.98 27.85,8.85
		     27.63,8.72 27.45,8.54 27.31,8.32
		     27.18,8.10 27.08,7.85 27.02,7.57
		     26.97,7.29 26.94,7.01 26.94,6.71 Z
		   M 24.94,6.72
		   C 24.94,7.32 25.03,7.85 25.21,8.33
		     25.39,8.81 25.64,9.21 25.97,9.55
		     26.30,9.89 26.69,10.15 27.15,10.34
		     27.61,10.52 28.12,10.61 28.70,10.61
		     29.27,10.61 29.78,10.52 30.25,10.34
		     30.71,10.15 31.11,9.89 31.44,9.55
		     31.76,9.21 32.02,8.81 32.19,8.33
		     32.37,7.85 32.46,7.32 32.46,6.72
		     32.46,6.13 32.37,5.59 32.19,5.11
		     32.02,4.63 31.76,4.22 31.44,3.88
		     31.11,3.54 30.71,3.27 30.25,3.09
		     29.78,2.90 29.27,2.81 28.70,2.81
		     28.12,2.81 27.61,2.90 27.15,3.09
		     26.69,3.27 26.30,3.54 25.97,3.88
		     25.64,4.22 25.39,4.63 25.21,5.11
		     25.03,5.59 24.94,6.13 24.94,6.72 Z
		   M 37.45,9.05
		   C 37.13,9.05 36.86,8.98 36.64,8.85
		     36.41,8.72 36.23,8.55 36.10,8.33
		     35.96,8.12 35.86,7.87 35.80,7.59
		     35.74,7.31 35.71,7.02 35.71,6.73
		     35.71,6.43 35.74,6.14 35.79,5.85
		     35.85,5.57 35.95,5.32 36.08,5.10
		     36.22,4.89 36.40,4.71 36.62,4.57
		     36.84,4.44 37.11,4.37 37.44,4.37
		     37.76,4.37 38.02,4.44 38.25,4.57
		     38.47,4.71 38.65,4.89 38.79,5.11
		     38.93,5.33 39.03,5.58 39.09,5.87
		     39.15,6.15 39.18,6.44 39.18,6.73
		     39.18,7.02 39.15,7.31 39.09,7.59
		     39.04,7.87 38.94,8.12 38.81,8.33
		     38.67,8.55 38.49,8.72 38.27,8.85
		     38.05,8.98 37.78,9.05 37.45,9.05 Z
		   M 33.78,3.03
		   C 33.78,3.03 33.78,13.00 33.78,13.00
		     33.78,13.00 35.78,13.00 35.78,13.00
		     35.78,13.00 35.78,9.48 35.78,9.48
		     35.78,9.48 35.81,9.48 35.81,9.48
		     36.05,9.85 36.36,10.13 36.74,10.32
		     37.12,10.51 37.54,10.61 37.99,10.61
		     38.52,10.61 38.99,10.50 39.38,10.29
		     39.78,10.08 40.11,9.80 40.38,9.45
		     40.65,9.09 40.85,8.69 40.98,8.23
		     41.11,7.77 41.17,7.29 41.17,6.79
		     41.17,6.27 41.11,5.76 40.98,5.28
		     40.85,4.80 40.65,4.38 40.37,4.01
		     40.10,3.65 39.76,3.36 39.35,3.14
		     38.94,2.92 38.44,2.81 37.87,2.81
		     37.42,2.81 37.01,2.90 36.64,3.09
		     36.26,3.27 35.95,3.57 35.71,3.97
		     35.71,3.97 35.68,3.97 35.68,3.97
		     35.68,3.97 35.68,3.03 35.68,3.03
		     35.68,3.03 33.78,3.03 33.78,3.03 Z
		   M 43.95,8.01
		   C 43.95,8.01 42.05,8.01 42.05,8.01
		     42.07,8.51 42.18,8.92 42.38,9.25
		     42.58,9.58 42.84,9.85 43.15,10.05
		     43.46,10.25 43.82,10.39 44.23,10.48
		     44.63,10.56 45.04,10.61 45.46,10.61
		     45.87,10.61 46.28,10.57 46.68,10.49
		     47.08,10.40 47.43,10.26 47.74,10.06
		     48.05,9.86 48.30,9.60 48.49,9.27
		     48.68,8.94 48.78,8.53 48.78,8.04
		     48.78,7.69 48.71,7.40 48.58,7.17
		     48.45,6.93 48.28,6.74 48.06,6.58
		     47.85,6.42 47.60,6.29 47.32,6.20
		     47.05,6.10 46.76,6.02 46.47,5.96
		     46.19,5.89 45.92,5.83 45.65,5.77
		     45.37,5.71 45.13,5.65 44.92,5.58
		     44.71,5.50 44.54,5.41 44.41,5.29
		     44.28,5.18 44.21,5.03 44.21,4.85
		     44.21,4.70 44.25,4.57 44.33,4.48
		     44.40,4.39 44.49,4.32 44.60,4.28
		     44.71,4.23 44.83,4.20 44.96,4.18
		     45.09,4.17 45.21,4.16 45.32,4.16
		     45.68,4.16 45.99,4.23 46.25,4.38
		     46.51,4.52 46.66,4.79 46.69,5.20
		     46.69,5.20 48.58,5.20 48.58,5.20
		     48.54,4.74 48.43,4.35 48.24,4.05
		     48.04,3.74 47.80,3.50 47.51,3.32
		     47.22,3.13 46.89,3.00 46.52,2.93
		     46.15,2.85 45.77,2.81 45.38,2.81
		     44.98,2.81 44.60,2.84 44.23,2.92
		     43.85,2.99 43.51,3.11 43.21,3.29
		     42.91,3.47 42.67,3.71 42.49,4.01
		     42.31,4.32 42.22,4.71 42.22,5.19
		     42.22,5.51 42.28,5.79 42.41,6.01
		     42.54,6.24 42.72,6.42 42.93,6.57
		     43.15,6.72 43.39,6.84 43.67,6.93
		     43.95,7.02 44.23,7.10 44.52,7.16
		     45.23,7.32 45.79,7.47 46.19,7.62
		     46.58,7.78 46.78,8.00 46.78,8.31
		     46.78,8.49 46.74,8.64 46.66,8.76
		     46.57,8.88 46.47,8.98 46.34,9.05
		     46.21,9.12 46.07,9.17 45.92,9.21
		     45.76,9.24 45.62,9.26 45.48,9.26
		     45.28,9.26 45.09,9.23 44.91,9.18
		     44.73,9.14 44.56,9.06 44.42,8.96
		     44.28,8.86 44.17,8.73 44.08,8.58
		     43.99,8.42 43.95,8.23 43.95,8.01 Z
		   M 52.04,1.87
		   C 52.04,1.87 52.04,0.21 52.04,0.21
		     52.04,0.21 50.05,0.21 50.05,0.21
		     50.05,0.21 50.05,1.87 50.05,1.87
		     50.05,1.87 52.04,1.87 52.04,1.87 Z
		   M 50.05,3.03
		   C 50.05,3.03 50.05,10.40 50.05,10.40
		     50.05,10.40 52.04,10.40 52.04,10.40
		     52.04,10.40 52.04,3.03 52.04,3.03
		     52.04,3.03 50.05,3.03 50.05,3.03 Z
		   M 55.12,8.01
		   C 55.12,8.01 53.23,8.01 53.23,8.01
		     53.25,8.51 53.36,8.92 53.56,9.25
		     53.76,9.58 54.02,9.85 54.33,10.05
		     54.64,10.25 55.00,10.39 55.41,10.48
		     55.81,10.56 56.22,10.61 56.64,10.61
		     57.05,10.61 57.46,10.57 57.86,10.49
		     58.26,10.40 58.61,10.26 58.92,10.06
		     59.23,9.86 59.48,9.60 59.67,9.27
		     59.86,8.94 59.96,8.53 59.96,8.04
		     59.96,7.69 59.89,7.40 59.76,7.17
		     59.63,6.93 59.46,6.74 59.24,6.58
		     59.03,6.42 58.78,6.29 58.50,6.20
		     58.23,6.10 57.94,6.02 57.65,5.96
		     57.37,5.89 57.10,5.83 56.83,5.77
		     56.55,5.71 56.31,5.65 56.10,5.58
		     55.89,5.50 55.72,5.41 55.59,5.29
		     55.46,5.18 55.39,5.03 55.39,4.85
		     55.39,4.70 55.43,4.57 55.50,4.48
		     55.58,4.39 55.67,4.32 55.78,4.28
		     55.89,4.23 56.01,4.20 56.14,4.18
		     56.27,4.17 56.39,4.16 56.50,4.16
		     56.86,4.16 57.17,4.23 57.43,4.38
		     57.69,4.52 57.84,4.79 57.87,5.20
		     57.87,5.20 59.76,5.20 59.76,5.20
		     59.72,4.74 59.61,4.35 59.42,4.05
		     59.22,3.74 58.98,3.50 58.69,3.32
		     58.40,3.13 58.07,3.00 57.70,2.93
		     57.33,2.85 56.95,2.81 56.56,2.81
		     56.16,2.81 55.78,2.84 55.41,2.92
		     55.03,2.99 54.69,3.11 54.39,3.29
		     54.09,3.47 53.85,3.71 53.67,4.01
		     53.49,4.32 53.40,4.71 53.40,5.19
		     53.40,5.51 53.46,5.79 53.59,6.01
		     53.72,6.24 53.90,6.42 54.11,6.57
		     54.33,6.72 54.57,6.84 54.85,6.93
		     55.13,7.02 55.41,7.10 55.70,7.16
		     56.41,7.32 56.97,7.47 57.37,7.62
		     57.76,7.78 57.96,8.00 57.96,8.31
		     57.96,8.49 57.92,8.64 57.84,8.76
		     57.75,8.88 57.65,8.98 57.52,9.05
		     57.39,9.12 57.25,9.17 57.10,9.21
		     56.94,9.24 56.80,9.26 56.66,9.26
		     56.46,9.26 56.27,9.23 56.09,9.18
		     55.91,9.14 55.74,9.06 55.60,8.96
		     55.46,8.86 55.35,8.73 55.26,8.58
		     55.17,8.42 55.12,8.23 55.12,8.01 Z" />
	<path id="arrowout" fill="#b0b0b0" d="M 0 0 H 9 V 9 H 6 V 3 H 0 Z" transform="translate(81.5 16.5) rotate(-45) "/>
	<path id="arrowin" fill="#b0b0b0" d="M 9 9 H 0 V 0 H 3 V 6 H 9 Z" transform="translate(81.5 77.5) rotate(-45) "/>
	<use xlink:href="#Synopsis" y="64" />
	<use xlink:href="#arrowout" y="7" />
	<use xlink:href="#arrowin" y="7"/>
</g>`);
	// ocean.css comes from the Haddock package <https://github.com/haskell/haddock>, which is under a BSD 2-clause license and (c) Simon Marlow & contributors.
	s.href = 'data:text/css;charset=UTF-8,'
	       + encodeURIComponent(`:root {
	--img-plus: url('${plus}');
	--img-minus: url('${minus}');
	--img-hslogo: url('${hslogo}');
	--img-synopsis: url('${synopsis}');
}

/* @group Fundamentals */

* { margin: 0; padding: 0 }

/* Is this portable? */
html {
  background-color: white;
  width: 100%;
  height: 100%;
}

body {
  background: white;
  color: black;
  text-align: left;
  min-height: 100%;
  position: relative;
}

p {
  margin: 0.8em 0;
}

ul, ol {
  margin: 0.8em 0 0.8em 2em;
}

dl {
  margin: 0.8em 0;
}

dt {
  font-weight: bold;
}
dd {
  margin-left: 2em;
}

a { text-decoration: none; }
a[href]:link { color: rgb(196,69,29); }
a[href]:visited { color: rgb(171,105,84); }
a[href]:hover { text-decoration:underline; }

a[href].def:link, a[href].def:visited { color: black; }
a[href].def:hover { color: rgb(78, 98, 114); }

/* @end */

/* @group Show and hide with JS */

body.js-enabled .hide-when-js-enabled {
  display: none;
}

/* @end */

/* @group Fonts & Sizes */

/* Basic technique & IE workarounds from YUI 3
   For reasons, see:
      http://yui.yahooapis.com/3.1.1/build/cssfonts/fonts.css
 */

body {
	font:13px/1.4 sans-serif;
	*font-size:small; /* for IE */
	*font:x-small; /* for IE in quirks mode */
}

h1 { font-size: 146.5%; /* 19pt */ }
h2 { font-size: 131%;   /* 17pt */ }
h3 { font-size: 116%;   /* 15pt */ }
h4 { font-size: 100%;   /* 13pt */ }
h5 { font-size: 100%;   /* 13pt */ }

select, input, button, textarea {
	font:99% sans-serif;
}

table {
	font-size:inherit;
	font:100%;
}

pre, code, kbd, samp, tt, .src {
	font-family:monospace;
	*font-size:108%;
	line-height: 124%;
}

.links, .link {
  font-size: 85%; /* 11pt */
}

#module-header .caption {
  font-size: 182%; /* 24pt */
}

#module-header .caption sup {
  font-size: 70%;
  font-weight: normal;
}

.info  {
  font-size: 85%; /* 11pt */
}

#table-of-contents, #synopsis  {
  /* font-size: 85%; /* 11pt */
}


/* @end */

/* @group Common */

.caption, h1, h2, h3, h4, h5, h6, summary {
  font-weight: bold;
  color: rgb(78,98,114);
  margin: 0.8em 0 0.4em;
}

* + h1, * + h2, * + h3, * + h4, * + h5, * + h6 {
  margin-top: 2em;
}

h1 + h2, h2 + h3, h3 + h4, h4 + h5, h5 + h6 {
  margin-top: inherit;
}

ul.links {
  list-style: none;
  text-align: left;
  float: right;
  display: inline-table;
  margin: 0 0 0 1em;
}

ul.links li {
  display: inline;
  border-left: 1px solid #d5d5d5;
  white-space: nowrap;
  padding: 0;
}

ul.links li a {
  padding: 0.2em 0.5em;
}

.hide { display: none; }
.show { display: inherit; }
.clear { clear: both; }

.collapser {
  background-image: var(--img-minus);
  background-repeat: no-repeat;
}
.expander {
  background-image: var(--img-plus);
  background-repeat: no-repeat;
}
.collapser, .expander {
  padding-left: 14px;
  margin-left: -14px;
  cursor: pointer;
}
p.caption.collapser,
p.caption.expander {
  background-position: 0 0.4em;
}

.instance.collapser, .instance.expander {
  margin-left: 0px;
  background-position: left center;
  min-width: 9px;
  min-height: 9px;
}

summary {
  cursor: pointer;
  outline: none;
  list-style-image: var(--img-plus);
  list-style-position: outside;
}

details[open] > summary {
  list-style-image: var(--img-minus);
}

pre {
  padding: 0.25em;
  margin: 0.8em 0;
  background: rgb(229,237,244);
  overflow: auto;
  border-bottom: 0.25em solid white;
  /* white border adds some space below the box to compensate
     for visual extra space that paragraphs have between baseline
     and the bounding box */
}

.src {
  background: #f0f0f0;
  padding: 0.2em 0.5em;
}

.keyword { font-weight: normal; }
.def { font-weight: bold; }

@media print {
  #footer { display: none; }
}

/* @end */

/* @group Page Structure */

#content {
  margin: 0 auto;
  padding: 0 2em 6em;
}

#package-header {
  background: rgb(41,56,69);
  border-top: 5px solid rgb(78,98,114);
  color: #ddd;
  padding: 0.2em;
  position: relative;
  text-align: left;
}

#package-header .caption {
  background: var(--img-hslogo) no-repeat 0em;
  color: white;
  margin: 0 2em;
  font-weight: normal;
  font-style: normal;
  padding-left: 2em;
}

#package-header a:link, #package-header a:visited { color: white; }
#package-header a:hover { background: rgb(78,98,114); }

#module-header .caption {
  color: rgb(78,98,114);
  font-weight: bold;
  border-bottom: 1px solid #ddd;
}

table.info {
  float: right;
  padding: 0.5em 1em;
  border: 1px solid #ddd;
  color: rgb(78,98,114);
  background-color: #fff;
  max-width: 40%;
  border-spacing: 0;
  position: relative;
  top: -0.5em;
  margin: 0 0 0 2em;
}

.info th {
	padding: 0 1em 0 0;
}

div#style-menu-holder {
  position: relative;
  z-index: 2;
  display: inline;
}

#style-menu {
  position: absolute;
  z-index: 1;
  overflow: visible;
  background: #374c5e;
  margin: 0;
  text-align: center;
  right: 0;
  padding: 0;
  top: 1.25em;
}

#style-menu li {
	display: list-item;
	border-style: none;
	margin: 0;
	padding: 0;
	color: #000;
	list-style-type: none;
}

#style-menu li + li {
	border-top: 1px solid #919191;
}

#style-menu a {
  width: 6em;
  padding: 3px;
  display: block;
}

#footer {
  background: #ddd;
  border-top: 1px solid #aaa;
  padding: 0.5em 0;
  color: #666;
  text-align: center;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 3em;
}

/* @end */

/* @group Front Matter */

#table-of-contents {
  float: right;
  clear: right;
  background: #faf9dc;
  border: 1px solid #d8d7ad;
  padding: 0.5em 1em;
  max-width: 20em;
  margin: 0.5em 0 1em 1em;
}

#table-of-contents .caption {
  text-align: center;
  margin: 0;
}

#table-of-contents ul {
  list-style: none;
  margin: 0;
}

#table-of-contents ul ul {
  margin-left: 2em;
}

#description .caption {
  display: none;
}

#synopsis {
  display: block;
  position: fixed;
  right: 0;
  height: 80%;
  top: 10%;
  padding: 0;
  max-width: 75%;
  /* Ensure that synopsis covers everything (including MathJAX markup) */
  z-index: 1;
}

#synopsis summary {
  display: block;
  float: left;
  width: 29px;
  color: rgba(255,255,255,0);
  height: 110px;
  margin: 0;
  font-size: 1px;
  padding: 0;
  background: var(--img-synopsis) no-repeat 0px -8px;
}

#synopsis details[open] > summary {
  background: var(--img-synopsis) no-repeat -64px -8px;
}

#synopsis ul {
  height: 100%;
  overflow: auto;
  padding: 0.5em;
  margin: 0;
}

#synopsis ul ul {
  overflow: hidden;
}

#synopsis ul,
#synopsis ul li.src {
  background-color: #faf9dc;
  white-space: nowrap;
  list-style: none;
  margin-left: 0;
}

/* @end */

/* @group Main Content */

#interface div.top { margin: 2em 0; }
#interface h1 + div.top,
#interface h2 + div.top,
#interface h3 + div.top,
#interface h4 + div.top,
#interface h5 + div.top {
	margin-top: 1em;
}
#interface .src .selflink,
#interface .src .link {
  float: right;
  color: #919191;
  background: #f0f0f0;
  padding: 0 0.5em 0.2em;
  margin: 0 -0.5em 0 0;
  -moz-user-select: none;
}
#interface .src .selflink {
  border-left: 1px solid #919191;
  margin: 0 -0.5em 0 0.5em;
}

#interface span.fixity {
  color: #919191;
  border-left: 1px solid #919191;
  padding: 0.2em 0.5em 0.2em 0.5em;
  margin: 0 -1em 0 1em;
}

#interface span.rightedge {
  border-left: 1px solid #919191;
  padding: 0.2em 0 0.2em 0;
  margin: 0 0 0 1em;
}

#interface table { border-spacing: 2px; }
#interface td {
  vertical-align: top;
  padding-left: 0.5em;
}

#interface td.doc p {
  margin: 0;
}
#interface td.doc p + p {
  margin-top: 0.8em;
}

.doc table {
  border-collapse: collapse;
  border-spacing: 0px;
}

.doc th,
.doc td {
  padding: 5px;
  border: 1px solid #ddd;
}

.doc th {
  background-color: #f0f0f0;
}

.clearfix:after {
  clear: both;
  content: " ";
  display: block;
  height: 0;
  visibility: hidden;
}

.subs.fields ul {
  list-style: none;
  display: table;
  margin: 0;
}

.subs.fields ul li {
  display: table-row;
}

.subs ul li dfn {
  display: table-cell;
  font-style: normal;
  font-weight: bold;
  margin: 1px 0;
  white-space: nowrap;
}

.subs ul li > .doc {
  display: table-cell;
  padding-left: 0.5em;
  margin-bottom: 0.5em;
}

.subs ul li > .doc p {
  margin: 0;
}

/* Render short-style data instances */
.inst ul {
  height: 100%;
  padding: 0.5em;
  margin: 0;
}

.inst, .inst li {
  list-style: none;
  margin-left: 1em;
}

/* Workaround for bug in Firefox (issue #384) */
.inst-left {
  float: left;
}

.top p.src {
  border-top: 1px solid #ccc;
}

.subs, .doc {
  /* use this selector for one level of indent */
  padding-left: 2em;
}

.warning {
  color: red;
}

.arguments {
  margin-top: -0.4em;
}
.arguments .caption {
  display: none;
}

.fields { padding-left: 1em; }

.fields .caption { display: none; }

.fields p { margin: 0 0; }

/* this seems bulky to me
.methods, .constructors {
  background: #f8f8f8;
  border: 1px solid #eee;
}
*/

/* @end */

/* @group Auxillary Pages */


.extension-list {
    list-style-type: none;
    margin-left: 0;
}

#mini {
  margin: 0 auto;
  padding: 0 1em 1em;
}

#mini > * {
  font-size: 93%; /* 12pt */
}

#mini #module-list .caption,
#mini #module-header .caption {
  font-size: 125%; /* 15pt */
}

#mini #interface h1,
#mini #interface h2,
#mini #interface h3,
#mini #interface h4 {
  font-size: 109%; /* 13pt */
  margin: 1em 0 0;
}

#mini #interface .top,
#mini #interface .src {
  margin: 0;
}

#mini #module-list ul {
  list-style: none;
  margin: 0;
}

#alphabet ul {
	list-style: none;
	padding: 0;
	margin: 0.5em 0 0;
	text-align: center;
}

#alphabet li {
	display: inline;
	margin: 0 0.25em;
}

#alphabet a {
	font-weight: bold;
}

#index .caption,
#module-list .caption { font-size: 131%; /* 17pt */ }

#index table {
  margin-left: 2em;
}

#index .src {
  font-weight: bold;
}
#index .alt {
  font-size: 77%; /* 10pt */
  font-style: italic;
  padding-left: 2em;
}

#index td + td {
  padding-left: 1em;
}

#module-list ul {
  list-style: none;
  margin: 0 0 0 2em;
}

#module-list li {
  clear: right;
}

#module-list span.collapser,
#module-list span.expander {
  background-position: 0 0.3em;
}

#module-list .package {
  float: right;
}

:target {
  background-color: #ffff00;
}

/* @end */
`);
});
