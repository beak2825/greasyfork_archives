// ==UserScript==
// @name        일기장갤 대짤 변경 [ver.로아]
// @namespace   Violentmonkey Scripts
// @match       https://gall.dcinside.com/mini/board/lists?id=virtualstreamer*
// @match       https://gall.dcinside.com/mini/board/lists/?id=virtualstreamer*
// @grant       GM_addStyle
// @version     1.0
// @author      ㅇㅇ
// @run-at      document-start
// @description 10/29/2023, 2:09:59 AM
// @downloadURL https://update.greasyfork.org/scripts/478483/%EC%9D%BC%EA%B8%B0%EC%9E%A5%EA%B0%A4%20%EB%8C%80%EC%A7%A4%20%EB%B3%80%EA%B2%BD%20%5Bver%EB%A1%9C%EC%95%84%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/478483/%EC%9D%BC%EA%B8%B0%EC%9E%A5%EA%B0%A4%20%EB%8C%80%EC%A7%A4%20%EB%B3%80%EA%B2%BD%20%5Bver%EB%A1%9C%EC%95%84%5D.meta.js
// ==/UserScript==

// 해당 이미지 URL이 대짤로 바뀜
var imageUrl = "https://dcimg7.dcinside.co.kr/viewimage.php?id=3bb4c232f0d334b57aadd3b41bd436&no=24b0d769e1d32ca73de986fa1bd8233c5ccc78a5f3977a8f0904f2b2750731e07fa7fff0fe92425cf173d0c4645de0866695f33b54702292e64f211caf98482217b9a1bd6e014e07";
GM_addStyle('.mintro_imgbox .cover { background-image: url("'+imageUrl+'") !important; }');