// ==UserScript==
// @name        VK 2016 Favicon for OpenVK
// @version     1.0
// @author      nbt1248
// @namespace   https://t.me/nbt1248
// @description Replaces OpenVK favicon with VK 2016 favicon. Best to use with OpenVK 2016 theme (or it's dark version!). Based on "Revert to Google's Old 2012-2015 Favicon" UserScript.

// @include     http*://ovk.to*
// @include     http*://vepurovk.xyz*
// @license     No License
// @downloadURL https://update.greasyfork.org/scripts/520175/VK%202016%20Favicon%20for%20OpenVK.user.js
// @updateURL https://update.greasyfork.org/scripts/520175/VK%202016%20Favicon%20for%20OpenVK.meta.js
// ==/UserScript==

var head = document.getElementsByTagName('head')[0];
var icon = document.createElement('link');

icon.setAttribute('rel', 'shortcut icon');

icon.setAttribute('href', 'data:image/svg+xml;base64,PHN2ZyBpZD0iVktfTG9nbyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmlld0JveD0iMCAwIDIwMiAyMDIiIHdpZHRoPSIyNTAwIiBoZWlnaHQ9IjI1MDAiPjxzdHlsZT4uc3Qwe2NsaXAtcGF0aDp1cmwoI1NWR0lEXzJfKTtmaWxsOiM1MTgxYjh9LnN0MXtmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsOiNmZmZ9PC9zdHlsZT48ZyBpZD0iQmFzZSI+PGRlZnM+PHBhdGggaWQ9IlNWR0lEXzFfIiBkPSJNNzEuNiA1aDU4LjlDMTg0LjMgNSAxOTcgMTcuOCAxOTcgNzEuNnY1OC45YzAgNTMuOC0xMi44IDY2LjUtNjYuNiA2Ni41SDcxLjVDMTcuNyAxOTcgNSAxODQuMiA1IDEzMC40VjcxLjVDNSAxNy44IDE3LjggNSA3MS42IDV6Ii8+PC9kZWZzPjx1c2UgeGxpbms6aHJlZj0iI1NWR0lEXzFfIiBvdmVyZmxvdz0idmlzaWJsZSIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiM1MTgxYjgiLz48Y2xpcFBhdGggaWQ9IlNWR0lEXzJfIj48dXNlIHhsaW5rOmhyZWY9IiNTVkdJRF8xXyIgb3ZlcmZsb3c9InZpc2libGUiLz48L2NsaXBQYXRoPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0wIDBoMjAydjIwMkgweiIvPjwvZz48cGF0aCBpZD0iTG9nbyIgY2xhc3M9InN0MSIgZD0iTTE2Mi4yIDcxLjFjLjktMyAwLTUuMS00LjItNS4xaC0xNGMtMy42IDAtNS4yIDEuOS02LjEgNCAwIDAtNy4xIDE3LjQtMTcuMiAyOC42LTMuMyAzLjMtNC43IDQuMy02LjUgNC4zLS45IDAtMi4yLTEtMi4yLTRWNzEuMWMwLTMuNi0xLTUuMS00LTUuMUg4NmMtMi4yIDAtMy42IDEuNy0zLjYgMy4yIDAgMy40IDUgNC4yIDUuNiAxMy42djIwLjZjMCA0LjUtLjggNS4zLTIuNiA1LjMtNC43IDAtMTYuMy0xNy40LTIzLjEtMzcuNC0xLjQtMy43LTIuNy01LjMtNi4zLTUuM0g0MmMtNCAwLTQuOCAxLjktNC44IDQgMCAzLjcgNC43IDIyLjEgMjIuMSA0Ni40QzcwLjkgMTMzIDg3LjIgMTQyIDEwMiAxNDJjOC45IDAgMTAtMiAxMC01LjRWMTI0YzAtNCAuOC00LjggMy43LTQuOCAyLjEgMCA1LjYgMSAxMy45IDkgOS41IDkuNSAxMS4xIDEzLjggMTYuNCAxMy44aDE0YzQgMCA2LTIgNC44LTUuOS0xLjMtMy45LTUuOC05LjYtMTEuOC0xNi40LTMuMy0zLjktOC4yLTgtOS42LTEwLjEtMi4xLTIuNy0xLjUtMy45IDAtNi4yIDAtLjEgMTcuMS0yNC4xIDE4LjgtMzIuM3oiLz48L3N2Zz4=');

head.appendChild(icon);
