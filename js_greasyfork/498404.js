// ==UserScript==
// @name         十字线
// @namespace    https://greasyfork.org/zh-CN/scripts/498404-%E5%8D%81%E5%AD%97%E7%BA%BF
// @version      1.2402
// @description  网页上鼠标显示出十字线.
// @author       zbhover
// @license      MPL-2.0
// @match        *://*/*
// @require      http://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_registerMenuCommand
// @grant       GM_addStyle
// @icon        data:image/x-icon;base64,AAABAAEAQEAAAAEAIAAoQgAAFgAAACgAAABAAAAAgAAAAAEAIAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAD49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/6qKf//wAA//uKif/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+qin//8AAP/7ion/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//qop///AAD/+4qJ//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/6qKf//wAA//uKif/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+qin//8AAP/7ion/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//qop///AAD/+4qJ//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/6qKf//wAA//uKif/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+qin//8AAP/7ion/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//qop///AAD/+4qJ//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/6qKf//wAA//uKif/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+qin//8AAP/7ion/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//qop///AAD/+4qJ//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/6qKf//wAA//uKif/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+qin//8AAP/7ion/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//qop///AAD/+4qJ//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/6qKf//wAA//uKif/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+qin//8AAP/7ion/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//qop///AAD/+4qJ//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/6qKf//wAA//uKif/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+qin//8AAP/7ion/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//qop///AAD/+4qJ//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/6qKf//wAA//uKif/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+qin//8AAP/7ion/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//qop///AAD/+4qJ//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/6qKf//wAA//uKif/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+qin//8AAP/7ion/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//qop///AAD/+4qJ//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/6qKf//wAA//uKif/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+qin//8AAP/7ion/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//qop///AAD/+4qJ//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/6qKf//wAA//uKif/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+qin//8AAP/7ion/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//qop///AAD/+4qJ//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//qop///AAD/+4qJ//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/6qKf//wAA//uKif/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+qin//8AAP/7ion/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//qop///AAD/+4qJ//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/6qKf//wAA//uKif/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+qin//8AAP/7ion/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//qop///AAD/+4qJ//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/6qKf//wAA//uKif/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+qin//8AAP/7ion/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//qop///AAD/+4qJ//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/6qKf//wAA//uKif/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+qin//8AAP/7ion/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//qop///AAD/+4qJ//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/6qKf//wAA//uKif/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+qin//8AAP/7ion/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//qop///AAD/+4qJ//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/6qKf//wAA//uKif/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+qin//8AAP/7ion/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//qop///AAD/+4qJ//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/6qKf//wAA//uKif/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+qin//8AAP/7ion/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//qop///AAD/+4qJ//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/6qKf//wAA//uKif/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+qin//8AAP/7ion/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//qop///AAD/+4qJ//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/6qKf//wAA//uKif/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+qin//8AAP/7ion/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//qop///AAD/+4qJ//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/6qKf//wAA//uKif/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/+Pb1//j29f/49vX/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=
// @downloadURL https://update.greasyfork.org/scripts/498404/%E5%8D%81%E5%AD%97%E7%BA%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/498404/%E5%8D%81%E5%AD%97%E7%BA%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var findVideo=false;
    var ifDebug =0;
    var host = location.host;
    //----------------------------------------
    console.log(JSON.parse(JSON.stringify(host)))
    //---------------------------------------------------
 let video = document.querySelector('video');
    if (video != null) {
        video.addEventListener("play", function () {
            findVideo = true;
        });
        video.addEventListener("pause", function () {
            findVideo = true;
        });
    }
        const storage = {
        setItem: function(key, value) {
                GM_setValue(key, value);
                if (value === "" && typeof GM_deleteValue !== 'undefined'){GM_deleteValue(key);}
        },
        getItem: function(key, callback) {
            var value;
            value = GM_getValue(key);
            callback(value);
        }
    };
        function setListData(list,key,value,url="") {
        let proKey = key;
        let proValue = value;
        storage.getItem(list, listData => {
            if(ifDebug){console.log("setlistData-%s-%s-%s:",list,key,value,listData);}
            if(url !==""){
             if (!listData) {listData = [];}
            const gre = listData.find(element => element.name===url);
            if (typeof gre === "undefined" && key !== "") {listData.unshift({name:url, [proKey]: proValue});
                if (listData.length > 20) {listData.pop();}
                storage.setItem(list, listData);
            }
            listData = listData.forEach((item)=>{if(item.name===url) {Object.assign(item,{[proKey]:proValue});storage.setItem(list, listData);}})
        }else{listData = listData.forEach((item)=>{item[proKey]=value;storage.setItem(list, listData);});
        }});
    }
    function getListData(list,key,url="") {
        let proKey = key;
        let value;
        storage.getItem(list, listData => {
             if(ifDebug){console.log("getListData-%s:%s:",list,key,listData);}
             if (listData && url=="") {listData = listData.forEach((item)=>{ if(ifDebug){console.log("item-noUrl:",item);}value = item[proKey];if(ifDebug){console.log("value-%s:",list,value);}});}
            else{
            listData = listData.forEach((item)=>{if(item.name===url) {if(ifDebug){console.log("item-%s:",url,item);}value = item[proKey];if(ifDebug){console.log("value-%s:",list,value)}}})}});
            return value;
    }
        async function getData(key) {return new Promise((resolve,reject) => {storage.getItem(key, value => {resolve(value);});
        });
    }

    let util = {
        getValue(name) {
            return GM_getValue(name);
        },
        setValue(name, value) {
            GM_setValue(name, value);
        },
        hover(ele, fn1, fn2) {
            ele.onmouseenter = function () {
                fn1.call(ele);
            };
            ele.onmouseleave = function () {
                fn2.call(ele);
            };
        },
async       getallKey(key) {
            let arrayOfKeys =await getData(key);
            return arrayOfKeys;
        },
    };
        function getaValue(key) {
        let proKey=key;
        let allKey=getListData("webAdj",proKey,host);
        let iniKey=getListData("iniWeb",proKey);
        if(ifDebug){
        console.log("allKey",allKey);
        console.log("iniKey",iniKey);
        console.log("iniKey-%s",key,iniKey);
      if(typeof allKey!=="undefined"){console.log("allKey-%s",key,allKey);}}
        if(getListData("iniWeb","modify_default")) return iniKey;
        return typeof(allKey)!=="undefined"?allKey:iniKey;
    }
//====================================================================================
var setup = function(){
    var styleNode = GM_addStyle(`
 #x_div, #y_div { position:fixed; top:0;left:0; background-color:${getaValue("line_color")}; width:100%; height:2px;}
 #y_div { height:100%; width:2px;}
 #Mouse{ position:fixed; display:none;color:blue;}
 #Mouse strong{ color:#f00;}
 `);
    var div = document.createElement('div');
    div.id = 'sp-line';
    document.body.appendChild(div);
    div.innerHTML = `<div id="Mouse">X:<strong id="XXX"></strong>  Y:<strong id="YYY"></strong></div><div id="x_div"></div> <div id="y_div"></div>`;
}


 function mouseMove(event1){
    var event = window.event || event1;
    var x_div = document.getElementById("x_div"),
         y_div = document.getElementById("y_div"),
         Mouse = document.getElementById("Mouse"),
         top = event.clientY > (window.screen.availHeight/2) ? -30 : 10,
         left = event.clientX > (window.screen.availWidth/2) ? -120 : 20;
if (document.getElementById("XXX") !== undefined && document.getElementById("XXX") !== null) {
     document.getElementById("XXX").innerHTML = event.clientX;
     document.getElementById("YYY").innerHTML = event.clientY;
     Mouse.style.top = event.clientY + top + "px";
     Mouse.style.left = event.clientX + left + "px";
     Mouse.style.display = "block";
     x_div.style.top = event.clientY + "px";
     y_div.style.left = event.clientX + "px";
};
 }

    document.onmousemove = mouseMove;

    function DelDiv(Id){
        var TmpDiv=document.getElementById(Id);
        document.body.removeChild(TmpDiv);}
    //===================
    var setup2 = function(){
    var styleNode = GM_addStyle(`
        #sp-setup {text-align: center;background-color: #eee;border-radius: 10px;padding:20px 30px;width: 400px;border:1px solid black;	position: fixed;left: 50%;top: 50%;transform: translate(-50%,-50%);}
        #sp-setup * { color:black;line-height:normal;font-size:16px; }
        #sp-setup a { color:black;text-decoration:underline; }
        #sp-setup div { text-align:center;font-weight:bold;font-size:16px; }
        #sp-setup ul { margin:15px 0 15px 0;padding:0;list-style:none;background:#eee;border:0; }
        #sp-setup input, #sp-setup select { border:1px solid gray;padding:2px;background:white; }
        #sp-setup li { margin:0;padding:16px 0;vertical-align:middle;background:#eee;border:0 }
        #sp-setup textarea { width:98%; height:60px; margin:3px 0; }
        #sp-setup b { font-weight: bold; font-family:"Times New Roman",Georgia,Serif;}
        #sp-setup button { border-radius: 5px;border:1px solid graytext; cursor: pointer;transition-duration: 0.4s;text-decoration: none; display: inline-block;}
        #sp-setup button:hover {background-color: graytext;filter: invert(100%);}
        #set-cancel {position: absolute;z-index: 2;top: 0px; right: 0px;width: 30px ;height: 30px ; box-shadow: none;}
        #set-confirm { width:60px;height:40px;margin:20px;background-color: #2778c5;color: red;}
        .instant-setting-label { display: flex;align-items: flex-start;justify-content: space-between;padding-top: 15px; }
        .instant-setting-label-col { display: flex;align-items: flex-start;padding-top: 15px;flex-direction:column }
        .instant-setting-checkbox { width: 16px;height: 16px; }
        .instant-setting-textarea { width: 100%; margin: 14px 0 0; height: 60px; resize: none; border: 1px solid #bbb; box-sizing: border-box; padding: 5px 10px; border-radius: 5px; color: #888; line-height: 1.2; }
        .instant-setting-input { border: 1px solid #bbb; box-sizing: border-box; padding: 5px 10px; border-radius: 5px; width: 100px}
        .instant-setting-radio { width: 16px;height: 16px; }
        .select-box {border: 1px solid #d6d6d6; cursor: pointer; border: 1px solid transparent; outline: none; border-radius: 5px;}
        .select-box .options-box {top: 55px;left: 0; width: 170px;overflow-y: scroll; overflow-x: hidden; width: 170px;height: 225px;background: rgba(255, 255, 255, 1); box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.25);border-radius: 5px;}

`);

    var div = document.createElement('div');
    div.id = 'sp-setup';
    document.body.appendChild(div);
    div.innerHTML = `
        <div>十字鼠标设置</div>
                <label class="instant-setting-label">修改缺省值(选中该项时调整缺省值)<input type="checkbox" id="ModifyDefault" ${getaValue("modify_default")?'checked':''} class="instant-setting-checkbox"></label>
                <label class="instant-setting-label">线的位置 <input type="number" min="1" max="100" id="Line-position" value="${getaValue("line_position")}" class="instant-setting-input"></label>
                <label class="instant-setting-label"><span >按钮大小:<small id="currentSize">${getaValue("buttonSize")}px</small></span>
                <input id="Button_size" type="range" class="instant-setting-label" min="32" max="100" step="2" value="${getaValue("buttonSize")}">
                </label>
                <label class="instant-setting-label">线的颜色 <input type="color"  id="Line-color" value="${getaValue("line_color")}" class="instant-setting-input"></label>
                <label class="instant-setting-label">按钮颜色 <input type="color"  id="Line-adjust" value="${getaValue("button_color")}" class="instant-setting-input"></label>
                <label class="instant-setting-label">按钮位置 <div  id="Button_position"><input type="radio"  name="buttonPosition" class="instant-setting-radio" value=1 ${getaValue('button_position') == 1 ? 'checked' : '' } >左上
                                                             <input type="radio"  name="buttonPosition" class="instant-setting-radio" value=2 ${getaValue('button_position') == 2 ? 'checked' : '' } >右上
                                                             <input type="radio" name="buttonPosition"  class="instant-setting-radio" value=3 ${getaValue('button_position') == 3 ? 'checked' : ''} >左下
                                                             <input type="radio" name="buttonPosition"  class="instant-setting-radio" value=4 ${getaValue('button_position') == 4 ? 'checked' : ''} >右下
                                                             </div></label>
                <label class="instant-setting-label-col">排除下列网址 <textarea placeholder="例如：www.baidu.com" id="Line-exclude" class="instant-setting-textarea">${util.getValue('exclude_list')}</textarea></label>
               <div ><button  id="set-cancel">X</button></div>
               <div ><button  id="set-confirm"><span>确定</span></button></div>
               `;
        //<select type="text" class="select-box"  id="selectElem"><option value="up" ${getaValue('button_position') <= 2 ? 'selected' : '' }>上</option><option value="down" ${getaValue('button_position') > 2 ? 'selected' : '' }>下</option></select>
    var close = function() {
        if (styleNode) {
        var TmpDiv=document.getElementById('sp-setup');
        document.body.removeChild(TmpDiv);}
    };

/* $("#selectElem").change(function(){
  var opt=$("#selectElem").val();
  alert(opt);
}); */
                document.getElementById('ModifyDefault').addEventListener('change', (e) => {
                    setListData("iniWeb",'modify_default',e.currentTarget.checked);
                    document.getElementById("Line-position").value = getaValue("line_position");
                    document.getElementById("Button_size").value = getaValue("buttonSize");
                    document.getElementById("currentSize").innerText = getaValue("buttonSize");
                    document.getElementById("Line-color").value = getaValue("line_color");
                    document.getElementById("Line-adjust").value = getaValue("button_color");
                    main.enableMode();
                });
                document.getElementById('Line-position').addEventListener('change', (e) => {
                    if(getaValue("modify_default")){setListData("iniWeb",'line_position',e.currentTarget.value)}else{setListData("webAdj",'line_position',e.currentTarget.value,host)}
                    });
                document.getElementById('Button_size').addEventListener('change', (e) => {
                        if(getaValue("modify_default")){setListData("iniWeb",'buttonSize',e.currentTarget.value)}else{setListData("webAdj",'buttonSize',e.currentTarget.value,host);main.enableMode();}
                        document.getElementById('currentSize').innerText = e.currentTarget.value+"px";
                    });
                document.getElementById('Line-color').addEventListener('change', (e) => {
                    if(getaValue("modify_default")){setListData("iniWeb",'line_color',e.currentTarget.value)}else{setListData("webAdj",'line_color',e.currentTarget.value,host)}
                });
                    document.getElementById('Line-adjust').addEventListener('change', (e) => {
                    if(getaValue("modify_default")){setListData("iniWeb",'button_color',e.currentTarget.value)}else{setListData("webAdj",'button_color',e.currentTarget.value,host)}
                    });
                   $("input[name=buttonPosition]").click(function(){if(getaValue("modify_default")){setListData("iniWeb",'button_position',$(this).val())}else{setListData("webAdj",'button_position',$(this).val(),host)}

                });
                document.getElementById('Line-exclude').addEventListener('change', (e) => {
                    util.setValue('exclude_list', e.currentTarget.value)
                });
var spcancel = document.getElementById('set-cancel');
var spconfirm = document.getElementById('set-confirm');
spcancel.addEventListener('click', function (e) {
//  console.log(this.nodeName);
    if(getListData("iniWeb","modify_default")){setListData("iniWeb",'modify_default',false);};
//  close();
      history.go(0);
}, false);
spconfirm.addEventListener('click', function (e) {
  if(getListData("iniWeb","modify_default")){setListData("iniWeb",'modify_default',false);};
  history.go(0);
   }, false);
};

//-------------------------
    let main = {
        initValue() {
            let value = [{name: 'iniWeb',value:[{modify_default: false, line_position:50, buttonSize:32,line_color:'#ff0000',button_color:'#ff0000',button_position:1}]},
                         {name: 'exclude_list',value: ['youku.com','www.iqiyi.com'] },
                         {name: 'webAdj',value:[]},
                        ];
            value.forEach((v) => {util.getValue(v.name) === undefined && util.setValue(v.name, v.value);});
        },

        addButton() {
            if (this.isTopWindow()) {
                let buttonSize = getaValue("buttonSize"),buttonPosition;
                if(getaValue('button_position')%2 ==0){buttonPosition="right"}else{buttonPosition="left"};
                let svgSize = parseInt(buttonSize * 0.8);
                let buttonWidth = +buttonSize + 2;
                let html = `<div class="no-print" id="button-container" style="position: fixed; ${buttonPosition}: -${buttonWidth / 2}px; ${getaValue('button_position') < 3 ? "top":"bottom"}: 30px; cursor: pointer; z-index: 2147483647; user-select: none;">
                <div id="side-button" style="width: ${buttonSize}px;height: ${buttonSize}px;background: ${getaValue("button_color")};border:1px solid #f6f6f6;display: flex;align-items: center;justify-content: center;border-radius: 50%;position: relative;">
                <svg  id="svg-line" style="width: ${svgSize}px;height: ${svgSize}px;margin: 0;padding: 0;transition: transform 0.3s, opacity 0.3s;" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,300 H900 M600,0 V900" stroke="#f80" stroke-width="100"></path><path d="M0,600 H900 M300,0 V900"  stroke="#08f" stroke-width="100"></path></svg>
                </div></div>`;
                document.body.insertAdjacentHTML('beforeend', html);

                let containerDOM = document.getElementById('button-container');
                let buttonDOM = document.getElementById('side-button');
                let lightDOM = document.getElementById('svg-line');

                util.hover(containerDOM, () => {
                    containerDOM.style[buttonPosition] = '0px';
                    containerDOM.style.transition = `${buttonPosition} 0.3s`
                }, () => {
                    containerDOM.style[buttonPosition] = `-${buttonWidth / 2}px`;
                    containerDOM.style.transition = `${buttonPosition} 0.3s`
                });

                buttonDOM.addEventListener("click", () => {
                    if (!document.getElementById("sp-line")) {!this.isInExcludeList() && setup();}
                    else {DelDiv("sp-line")}
                });

            }
        },
     registerMenuCommand() {
            if (this.isTopWindow()) {
                let whiteList = util.getValue('exclude_list');
                if (whiteList.includes(host)) {
                    GM_registerMenuCommand(' 当前网站：❌', () => {
                        let index = whiteList.indexOf(host);
                        whiteList.splice(index, 1);
                        util.setValue('exclude_list', whiteList);
                        history.go(0);
                    });
                } else {
                    GM_registerMenuCommand(' 当前网站：✔️', () => {
                        whiteList.push(host);
                        util.setValue('exclude_list', Array.from(new Set(whiteList)));
                        history.go(0);
                    });
                }

            GM_registerMenuCommand(' 设置',setup2)
            }
        },

        isTopWindow() {
            return window.self === window.top;
        },

        isInExcludeList() {
            return util.getValue('exclude_list').includes(location.host);
        },

        init() {
            this.initValue();
            this.registerMenuCommand();
            this.addButton();
        }
    };
    main.init();
})();