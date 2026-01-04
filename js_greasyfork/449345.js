// ==UserScript==
// @name         TypingTube Editor Small YTPlayer
// @namespace    https://typing-tube.net/
// @version      3.6
// @description  TypingTubeの動画プレイヤーを小さめに表示します。
// @match        https://typing-tube.net/movie/edit*
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/449345/TypingTube%20Editor%20Small%20YTPlayer.user.js
// @updateURL https://update.greasyfork.org/scripts/449345/TypingTube%20Editor%20Small%20YTPlayer.meta.js
// ==/UserScript==
let Editor_css = document.createElement('style')
Editor_css.type = 'text/css';
Editor_css.innerHTML =
`
#player{
    width:160px!important;
    height:90px!important;
	margin-right: 21px;
	margin-top: 25px;
}
.title{
display: flex;
flex-direction: row;
}

`
document.getElementsByTagName('HEAD').item(0).appendChild(Editor_css);