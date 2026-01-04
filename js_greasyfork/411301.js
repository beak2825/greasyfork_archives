// ==UserScript==
// @name        圖片瀏覽器
// @namespace   hbl917070

// @include     *.jpg
// @include     *.jpeg
// @include     *.png*
// @include     *.gif
// @include     *.jpg?*
// @include     *.jpeg?*
// @include     *.png?*
// @include     *.gif?*
// @include     *.webp*
// @include    *pbs.twimg.com*

// @exclude     *webpagetest.org*
// @exclude     */wiki/*
// @exclude     *wiki.biligame.com*
// @exclude     *ezgif.com*

// @version     1.05
// @grant       none
// @description         作者：hbl91707（深海異音）
// @description:zh-tw   作者：hbl91707（深海異音）
// @downloadURL https://update.greasyfork.org/scripts/411301/%E5%9C%96%E7%89%87%E7%80%8F%E8%A6%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/411301/%E5%9C%96%E7%89%87%E7%80%8F%E8%A6%BD%E5%99%A8.meta.js
// ==/UserScript==

/*

最後更新：2017-07-17

說明：安裝後，瀏覽器開啟圖片就會用此【圖片瀏覽器】來檢視。

1.滑鼠滾輪 = 縮放圖片
2.放大圖片快速鍵：【+】or【shift】
3.縮小圖片快速鍵：【-】or【ctrl】
4.當圖片超過視窗範圍，可直接拖曳


作者：hbl91707（深海異音）
http://home.gamer.com.tw/homeindex.php?owner=hbl917070

*/


//判斷是否需要執行
var bool_run = true;
if (document.body.getElementsByTagName("img").length != 1) {
    bool_run = false;
}
if (document.body.getElementsByTagName("a").length != 0) {
    bool_run = false;
}
if (document.body.getElementsByTagName("div").length != 0) {
    bool_run = true;
}


if (bool_run) {

    var add_html = `

    <div id="img_d" style="display:none;" onclick="fun_close_imgbox()"></div>

    <div id="img_box" style="display:none;">
        <div class="img_tit">

            <a target="_blank" href="" id="img_open_url" style="display:none">
                <button style="background-image:url(img/URL.png);background-size: 65% 65%;" onclick=""></button>
            </a>

            <button id="bu_full" title="自動滿版 (auto full)" onclick="fun_zoomMode('full')" class="bu_sel"  style="background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNi4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWcluWxpF8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgd2lkdGg9IjUwcHgiIGhlaWdodD0iNTBweCIgdmlld0JveD0iMCAwIDUwIDUwIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1MCA1MCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8cG9seWdvbiBmaWxsPSIjRkZGRkZGIiBwb2ludHM9IjcuOCw2LjggMTUuMSw2LjggMTUuMSwzLjMgNC4zLDMuMyA0LjMsMTQuMSA3LjgsMTQuMSAiLz4NCjxwb2x5Z29uIGZpbGw9IiNGRkZGRkYiIHBvaW50cz0iMzYuOSwzLjMgMzYuOSw2LjggNDQuMiw2LjggNDQuMiwxNC4xIDQ3LjcsMTQuMSA0Ny43LDMuMyAiLz4NCjxwb2x5Z29uIGZpbGw9IiNGRkZGRkYiIHBvaW50cz0iNDQuMiw0My4yIDM2LjksNDMuMiAzNi45LDQ2LjcgNDcuNyw0Ni43IDQ3LjcsMzUuOSA0NC4yLDM1LjkgIi8+DQo8cG9seWdvbiBmaWxsPSIjRkZGRkZGIiBwb2ludHM9IjcuOCwzNS45IDQuMywzNS45IDQuMyw0Ni43IDE1LjEsNDYuNyAxNS4xLDQzLjIgNy44LDQzLjIgIi8+DQo8cG9seWdvbiBmaWxsPSIjRkZGRkZGIiBwb2ludHM9IjI4LjIyNywyNy4yMjYgMzcuMDQsMjcuMjI2IDM3LjA0LDMzLjk2MyA0MS4zNTIsMjkuNDggNDUuNjY3LDI0Ljk5OSA0MS4zNTIsMjAuNTE5IDM3LjA0LDE2LjAzNyANCgkzNy4wNCwyMi43NzMgMjguMjI4LDIyLjc3MyAyOC4yMjgsMTMuOTYxIDM0Ljk2MywxMy45NjEgMzAuNDgxLDkuNjQ4IDI2LDUuMzMzIDIxLjUyLDkuNjQ4IDE3LjAzNywxMy45NjEgMjMuNzc0LDEzLjk2MSANCgkyMy43NzQsMjIuNzczIDE0Ljk2MSwyMi43NzMgMTQuOTYxLDE2LjAzNyAxMC42NDgsMjAuNTE5IDYuMzMzLDI1IDEwLjY0OCwyOS40OCAxNC45NjEsMzMuOTYzIDE0Ljk2MSwyNy4yMjYgMjMuNzc0LDI3LjIyNiANCgkyMy43NzQsMzYuMDQgMTcuMDM3LDM2LjA0IDIxLjUyLDQwLjM1MiAyNi4wMDEsNDQuNjY3IDMwLjQ4MSw0MC4zNTIgMzQuOTYzLDM2LjA0IDI4LjIyNywzNi4wNCAiLz4NCjwvc3ZnPg0K)"></button>
            <button id="bu_full_h" title="寬度滿版 (horizontal full)"  onclick="fun_zoomMode('h')" style="background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNi4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWcluWxpF8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgd2lkdGg9IjUwcHgiIGhlaWdodD0iNTBweCIgdmlld0JveD0iMCAwIDUwIDUwIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1MCA1MCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8cG9seWdvbiBmaWxsPSIjRkZGRkZGIiBwb2ludHM9IjMuMywxNC4xIDYuOCwxNC4xIDYuOCw2LjggMTQuMSw2LjggMTQuMSwzLjMgMy4zLDMuMyAiLz4NCjxwb2x5Z29uIGZpbGw9IiNGRkZGRkYiIHBvaW50cz0iMzUuOSwzLjMgMzUuOSw2LjggNDMuMiw2LjggNDMuMiwxNC4xIDQ2LjcsMTQuMSA0Ni43LDMuMyAiLz4NCjxwb2x5Z29uIGZpbGw9IiNGRkZGRkYiIHBvaW50cz0iNDMuMiw0My4yIDM1LjksNDMuMiAzNS45LDQ2LjcgNDYuNyw0Ni43IDQ2LjcsMzUuOSA0My4yLDM1LjkgIi8+DQo8cG9seWdvbiBmaWxsPSIjRkZGRkZGIiBwb2ludHM9IjYuOCwzNS45IDMuMywzNS45IDMuMyw0Ni43IDE0LjEsNDYuNyAxNC4xLDQzLjIgNi44LDQzLjIgIi8+DQo8cG9seWdvbiBmaWxsPSIjRkZGRkZGIiBwb2ludHM9IjM2LjAzOSwzMy45NjMgNDAuMzUyLDI5LjQ4MSA0NC42NjcsMjUgNDAuMzUyLDIwLjUyIDM2LjAzOSwxNi4wMzcgMzYuMDM5LDIyLjc3NCAxMy45NiwyMi43NzQgDQoJMTMuOTYsMTYuMDM3IDkuNjQ4LDIwLjUyIDUuMzMzLDI1LjAwMSA5LjY0OCwyOS40ODEgMTMuOTYsMzMuOTYzIDEzLjk2LDI3LjIyNyAzNi4wMzksMjcuMjI4ICIvPg0KPC9zdmc+DQo=)"></button>
            <button id="bu_full_v" title="高度滿版 (vertical full)"  onclick="fun_zoomMode('v')" style="background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNi4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWcluWxpF8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgd2lkdGg9IjUwcHgiIGhlaWdodD0iNTBweCIgdmlld0JveD0iMCAwIDUwIDUwIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1MCA1MCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8cG9seWdvbiBmaWxsPSIjRkZGRkZGIiBwb2ludHM9IjMuMywxNC4xIDYuOCwxNC4xIDYuOCw2LjggMTQuMSw2LjggMTQuMSwzLjMgMy4zLDMuMyAiLz4NCjxwb2x5Z29uIGZpbGw9IiNGRkZGRkYiIHBvaW50cz0iMzUuOSwzLjMgMzUuOSw2LjggNDMuMiw2LjggNDMuMiwxNC4xIDQ2LjcsMTQuMSA0Ni43LDMuMyAiLz4NCjxwb2x5Z29uIGZpbGw9IiNGRkZGRkYiIHBvaW50cz0iNDMuMiw0My4yIDM1LjksNDMuMiAzNS45LDQ2LjcgNDYuNyw0Ni43IDQ2LjcsMzUuOSA0My4yLDM1LjkgIi8+DQo8cG9seWdvbiBmaWxsPSIjRkZGRkZGIiBwb2ludHM9IjYuOCwzNS45IDMuMywzNS45IDMuMyw0Ni43IDE0LjEsNDYuNyAxNC4xLDQzLjIgNi44LDQzLjIgIi8+DQo8cG9seWdvbiBmaWxsPSIjRkZGRkZGIiBwb2ludHM9IjMzLjk2MywxMy45NjEgMjkuNDgxLDkuNjQ4IDI1LDUuMzMzIDIwLjUyLDkuNjQ4IDE2LjAzNywxMy45NjEgMjIuNzc0LDEzLjk2MSAyMi43NzQsMzYuMDQgDQoJMTYuMDM3LDM2LjA0IDIwLjUyLDQwLjM1MiAyNS4wMDEsNDQuNjY3IDI5LjQ4MSw0MC4zNTIgMzMuOTYzLDM2LjA0IDI3LjIyNywzNi4wNCAyNy4yMjgsMTMuOTYxICIvPg0KPC9zdmc+DQo=)"></button>

            <input type="text" id="text_scale" title="預設的縮放比例" style="display:none" />

            <div class="break"></div>

            <button id="but_imgSizeAdd" title="放大 (zoom in) [ + or shift ]" onclick="fun_imgSizeAdd()" style="background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxOS4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDUwIDUwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MCA1MDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4NCgkuc3Qwe2Rpc3BsYXk6bm9uZTt9DQoJLnN0MXtkaXNwbGF5OmlubGluZTt9DQoJLnN0MntmaWxsOiNGRkZGRkY7fQ0KPC9zdHlsZT4NCjxnIGlkPSLlnJblsaRfMSIgY2xhc3M9InN0MCI+DQoJPHJlY3QgY2xhc3M9InN0MSIgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIi8+DQo8L2c+DQo8ZyBpZD0i5ZyW5bGkXzIiPg0KCTxyZWN0IHg9IjIyLjMiIHk9IjYuMSIgY2xhc3M9InN0MiIgd2lkdGg9IjUuNCIgaGVpZ2h0PSIzNy44Ii8+DQoJPHJlY3QgeD0iNi4xIiB5PSIyMi4zIiBjbGFzcz0ic3QyIiB3aWR0aD0iMzcuOCIgaGVpZ2h0PSI1LjQiLz4NCjwvZz4NCjwvc3ZnPg0K)"></button>
            <button id="but_imgSizeSubtrat" title="縮小 (zoom out) [ - or ctrl ]"  onclick="fun_imgSizeSubtrat()" style="background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxOS4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDUwIDUwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MCA1MDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4NCgkuc3Qwe2Rpc3BsYXk6bm9uZTt9DQoJLnN0MXtkaXNwbGF5OmlubGluZTt9DQoJLnN0MntmaWxsOiNGRkZGRkY7fQ0KPC9zdHlsZT4NCjxnIGlkPSLlnJblsaRfMSIgY2xhc3M9InN0MCI+DQoJPHJlY3QgY2xhc3M9InN0MSIgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIi8+DQo8L2c+DQo8ZyBpZD0i5ZyW5bGkXzIiPg0KCTxyZWN0IHg9IjYuMSIgeT0iMjIuMyIgY2xhc3M9InN0MiIgd2lkdGg9IjM3LjgiIGhlaWdodD0iNS40Ii8+DQo8L2c+DQo8L3N2Zz4NCg==)"></button>

            <div class ="break"></div>

            <button id="but_white" title="黑白切換 (black and white switch)" onclick="fun_switch()" style="background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMC4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0i5ZyW5bGkXzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNDAgNDAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQwIDQwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDojRkZGRkZGO3N0cm9rZTojMDAwMDAwO3N0cm9rZS13aWR0aDoyO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3Qxe3N0cm9rZTojRkZGRkZGO3N0cm9rZS13aWR0aDoyO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3Qye2ZpbGw6bm9uZTtzdHJva2U6I0ZGRkZGRjtzdHJva2Utd2lkdGg6MjtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9DQoJLnN0M3tmaWxsOiNGRkZGRkY7fQ0KPC9zdHlsZT4NCjxjaXJjbGUgY2xhc3M9InN0MCIgY3g9IjIyIiBjeT0iMjciIHI9IjExLjUiLz4NCjxjaXJjbGUgY2xhc3M9InN0MSIgY3g9IjE0LjEiIGN5PSIxMy43IiByPSIxMS41Ii8+DQo8Zz4NCgk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMjkuMSw1LjFjMCwwLDEyLjctMC41LDYuNSwxMS42Ii8+DQoJPHBvbHlnb24gY2xhc3M9InN0MyIgcG9pbnRzPSIzMC45LDguNSAyNS4xLDUuNSAzMC42LDIgCSIvPg0KCTxwb2x5Z29uIGNsYXNzPSJzdDMiIHBvaW50cz0iMzkuMiwxNi4yIDM0LjQsMjAuNSAzMy4xLDE0LjEgCSIvPg0KPC9nPg0KPC9zdmc+DQo=)"></button>
            <button id="but_right" title="向右旋轉 (rotate to right)" onclick="fun_rotate_right()" style="background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NTIgNDUyIiB3aWR0aD0iNDUyIiBoZWlnaHQ9IjQ1MiI+Cgk8ZGVmcz4KCQk8aW1hZ2Ugd2lkdGg9IjM3NiIgaGVpZ2h0PSIzNzYiIGlkPSJpbWcxIiBocmVmPSJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQVhnQUFBRjRBUU1BQUFCa1UzRGxBQUFBQVhOU1IwSUIyY2tzZndBQUFBWlFURlJGQUFBQS8vLy9wZG1mM1FBQUFBSjBVazVUQVA5YmtTSzFBQUFHQkVsRVFWUjRuTzNjVFpLak9CQUZZQk1zV0hJRWpxS2ppZDFjaTkxY2d5UFVibXJoc0RxTTBmOTdxUlRkNWFpWnFWeDBkSWl2c0pRU3dqYVNiemR0ekNzL3Rqam5Qb3N5OTBHNWNjKzRaMldqZTlCWGRxLzRLQXFaZHo3VzNHOE5udjJCY2FRQmMrSVRZWmwzYVdURlpjYU9tREsvTjczSmZNanBRUHpnOGxpVDhqdndVK0Y5aFViaVRlSHZpVWNkN01xUS9WejVqMWhQNE12cWhBcGhYMlluWmdqN01qc3hROWpYMWZjTndMNnV2bThBOW9DZkdZVitoSDZqSGxYL2JBRDBGdm9IOVpDL2VnQjVYUDFYQTVESDFYODFBSGxEL1AwUGVjS1BIZ01lRGM3UVlPRFI0SHpGRGoyci90RUE0QzMxRCtncGZ6YTQ5bWx6NzBYMVZ1Q25uR2Qvc0FNL3A2Y3JYdkFEK0NXcGJkbWlUK0J0UEZpZDRnRjhPTmtHVWxEN2NDeWRoVU9UdDhxSDlLUjNxWkNEdmZMaDBJcGU5S1B5dm0zNVRjRlg2TFB5NGNnTm5xWHlQcDFiNXNNVVVIcGYwL0llNVYvMkwrTExlL2hNdkgvaHJmQysvTy9DKy9QY3lqakwveW44Z3F1ZmplcEhYVnkvQlpteFA5TzVWMzdDL2l4YUt6OUM3OU5aOFhRYVNQeklxcDllZDdXdnE1ODI0RkVWYnNDUHlDK3N1ZWxGbVhoVEpTeUdCZDZTM28zbnlqMVBUOUxEMFE4OFBVbUNvaDk1YzVNRVZSN3kyTVBSVDBKelk0SktEOS92M3VLSWVCUWw3QVBIWEhranBDY21xUFFyOFdQbHJaU2VrS0JIVWFEMmd6RGE0c3RITUFycGRERUtEOU01SVQveGRNN0l6enlkaG51cHFibGZlSG9jOG9iNmdYczRta2ZvTFUwLzlycjBCei93OUF0K1EzNUdmdVRkQmYzRXV3djZtWGNYOTNneWdYNjU0dkhWd24zN3k0TGdEZTB1d1c5NmJ6czk3MTdvQjk2OWNMd052SHVoSHdXUHJwZVJkeS8wRSs5ZU9EK0kzdGIreUJtN0Y1bmFMNUpmaU4rSkIvUHQ4WkliOFdBK0Z6MjRYeHgrWmI2T3crdjVrV0orci90OUx3eWZQK0VIYWZnd3o3ODdyV0w4WWo5ZDhYdW4zL1IrdnVKWHZWK3VlRDN2SHY2bWN6ajNldHM1L0svNGp1SC9GdDh4bkcrZHcvL1dPZng3L2ZETi9OaDVPYjdGcjNvL3ZjUHJlYmVmTC9pZTZlR3IvWExCOTB3LzcvQTkwNC81SC9xZTZiTjNldjZPZnY4WCs1N3BmOW42L1BQQzZ2RERjMkxvbVA2bjU4VGM0WThsQVIzZVBFZENoN2ZQSzZYRHUzNS83L0RETWROK25SOHZlUGZqZi95UC8yWitWL25wTFY1Ly8zbzlBdjZPWHZmK1lmNlczblQ1ZThmN3crVS80Vi8vYXYxbmh6ZHY4N3JQWC9idytzOTNyNUgyRHEvNy9PdWNYOWlqOS9zMXZ5cjRjTTJydjk4WVhqTy8rdnVUOFQxZS9mM1NtWml2OXVvYmtoOElWN3htQXZVRFdUdEIrd3ZGS2llczVZMWVNd0daeEdzdWVPOU1oL2ZyQm52OG9yemczWm1YUzM1dDh2RFlTUG44SWp3MlVqNGZDWStCbE05ZlJqL3VsYzkzcHN5M0IzU290dkw1MUdXdmZMNFcwcTU4ZmhlNzFha3VBQk9HVGEvWFhUQlJXZFVBZGNFYnRVL1cyYTROUGhSK2Evanh1bDgwQXpSNXFDOCtyL2VSb0Y0dnJoL3drVlM2MTB2ckgwSWtTWlRXVjRTdzBVdnJOM0svUnQ4YVFDNFpOT24vU1dUblRPckdJbXVqWWdCbE9UVHRBVFNsZm1sM1dFWXVlYm1EVGVxRjlWR1ovMGk5M01FMjljTDZMaDh1VGFHd2Z1eU1mRVdhc0Q0Tm5sRlkvNWJWT05UQXRhN2dZc0doYlhYWWttZlF0RHFnQUtiVkFUYjNpOHJIQ2d2ckoxOVJKRVJZbjNuRVVIaGgvU2M4THF3dlRWNS9LenhQcUNtOGJuM3NHZ3VjbktEcXNGWDRlblgrU3ZoUU5jK0lDYTFYVTg5aVF1dWptdlhWZStWWkI5UzFGZGVUbjJ0cXQ5L3dtdlh0MmNtY2tLQVo5TDRWR216QTZFSmwwcmxtM3VBQjFiVzlmMkZ2Rndxbk9yMndvelAzN2YwZHE2YVVuOG15QnB6VkozdnY2UDZYc21VTGEvQjVvdkxhOE9za0srOXdSVnY3ZzhyeTF2NmpsZml5UW83NHh2NnBldVNlZVdEN3N5cVBqK0N6cEEwais4c3EzOWkvVnZtUUNiZy9ydVpvLzExY1BReThUeWplMzFkSE9KaS83eUxwYWUxUHJDTlp5UXYyUDlZaDc2OEU0WGdnTHU4UEZSTlVCcDYzSitwUmM2WDlzN0M1OHY1Y0ZJWncrYjZwOTlMK1pSVFMvdWllQmpOT2VveS9VUmIyajNjMGdGWmYyditPd3dBdXZXL24rL2R4b0NHNkN4NDFRT0w4OXcxSTFCbmRSRTkvbjRIRlV2RFc5eGhsaHZhR1o3OWZRU1BQVVB0N3RqeERXOU96My9lZ1FYNC9oRWRNcWU2NTVOQlRtN1JHNm1WdVJwbkxFQXZsdndDWUk4QUNJZytNM0FBQUFBQkpSVTVFcmtKZ2dnPT0iLz4KCTwvZGVmcz4KCTxzdHlsZT4KCQl0c3BhbiB7IHdoaXRlLXNwYWNlOnByZSB9Cgk8L3N0eWxlPgoJPHVzZSBpZD0iQmFja2dyb3VuZCIgaHJlZj0iI2ltZzEiIHg9IjM5IiB5PSIzNyIgLz4KPC9zdmc+)"></button>
            <input id="input_deg" title="輸入旋轉角度 (Enter the degree of rotation)" value="90"></input>
            <button id="but_left" title="向左旋轉 (rotate to left)" onclick="fun_rotate_left()" style="background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NTIgNDUyIiB3aWR0aD0iNDUyIiBoZWlnaHQ9IjQ1MiI+Cgk8ZGVmcz4KCQk8aW1hZ2Ugd2lkdGg9IjM3NiIgaGVpZ2h0PSIzNzYiIGlkPSJpbWcxIiBocmVmPSJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQVhnQUFBRjRBUU1BQUFCa1UzRGxBQUFBQVhOU1IwSUIyY2tzZndBQUFBWlFURlJGQUFBQS8vLy9wZG1mM1FBQUFBSjBVazVUQVA5YmtTSzFBQUFHQ0VsRVFWUjRuTzNjUzVMaktCQUdZQ204MEpJajZDZ2NEUjFOUjlIRUhHQjZXUXVIbVM1TG9FenlUNUVRYllkbm9uTFZKWDFHa0tCSFcrQmgrQjNqcjZFcFhDdzJ6REhHTDkySHVMSy9mZnlPdStwalpCVnljUSt0bGplK2E0d3BGTy9Zc1UrdWZlQzNmOGphNkRXYVdVa3gxZzdBL01UOHB2a2wvZUdaaHpuMXhJK1J4Nkw0RlZZSFZ5Z1E3d3VQS2tSOUxFUHh4M0dkOEtBTGlDK3JBeXQwK2pJN09FT25MN09ETTNSNldYM1VnTlBMNnFNR25CNXdrTkhzYjlDdnFrZlZCdzNJUGtELzBEektQbXBBOHJqNnNnSEo0K3JMQmlUdkZWLzJRSzlYdUdqdzRiWG1paUY2ZURRNDk5aWcxNm92R25ENG9Qb0g5Q292Rzd4N09ocnVSWFlYNENmTzJRYzI0RjFaSERuZ0wrQm5XZHU4NVF2NElIZm1JaDdBZzhhZFBTNTkza2M3eDhzeWtzL3BvVzNMT2RpRWQ2aW9FUld5KzlRMlBsWlNoYjZFaDNzR1dNclRweU92ektjc1BFci9GNnpPV2FGRjhlVzF3Q24rYjFpZHMwSnI0ZjlCSGZrZDRMZ2g1cEFYZXkvVFJyeThtVGhaRVBHYjhKTk1LUEZsYzg4aGdiM2d1Y0VMOHVnWjBva2puMTVXUHpjQWVsbjkzR01iOGd2d282aHE5dUxPUm5iZmdjZFB3TDRzSzN2OHVPbktWR2UvUVQrVmJjdCtoWDRzZDJZUGVlcGg2WEY2VW9NMzRiWC9VY3lLMS81LzRJclNrdDhVUHhXZGsveXErRkh4Q2o4UzlHajBzZlJhT2hOWXl2TFZZOHk4ZWRSdnlEdmR3ejZZZUZIVXcxTmc1RVZSanh1dGU5emd3QVlFODR2cTc5Q3Z5UHRHUDdPbU1iOGg3MWpUNm41aVRXTWVkdGl0MFkrc2FYVS9zS29hZktDN0RONzMrQys3bnh1OWEvVFBEcnZiL2EzSFAreCs3MkRrTitqM0RsN3NQbWgrdmZDcjNYdk5ZNzUzOENhOWR0SFZ2UFlsbHlPNXBsNjc1OUVCUkwxMno1c1V2eW1lRGlEcUZjNEhuQ0hHUmorMCtuRFJPWC9DKzZ0cy9BSC9IRUNMM2JzZXY3N1liM1kvTmZwYmoyLzRYbnZzOFJmZmVZdm84YTBud0N1OTd6aGhXdno4WWQ1MStKWVRmbnFIWHo3SDN4b3ZLSy8yWTQvZlh1ZUhkL2lXRjMzaEEzM0xCZFIvbUo4N2ZNc0Yrci91WFlkLzlRWDlsWDc2VEgremp0SGpodVN0TjZYREIrdE5ZL2VqK1NMM3ZBR1Vrd0dxM3BrSDNlNW5jMUt6Tnlabzk3N1JCL05kdU4rdkRkNStWLzN4UC83SGY2TGZUSDU2aXc5Ti92R1IzblpEY2gvcGZaTy9OendWei84TFA1djlYdkwrcWMveXRnZWE4UFQycDl4OXBMM0QyeDZZNHRQYnYwYlpyMVJkZmpId3NjL2ZtdnhxLzFyazloNXYvbHJrU015cnZmbUdsQVpDajdkY1FOTkF0bDZnMDRrU2pCZWcrWTNlY2dIeXhGdE8rT1I4ZzAvekJsdjhiRHpoNDVHWExyOVVlWDYvWUh6Ums5OWZHRi9jNVBjalU0UGZCdk9MbTh5TUwySmNqMTg3dlBGRlQwNjc4VVhQMmEzUmRBTDRQR3hhdmUyRU9WVXdEZENZdlRkN01zOTJxZkN4OEd2RjMvcjliQm1nNVAwNGZSV3ZCa0d0bnI2S1Y0TlV1dFdiWHNXVEpMSzVIMXFFMDQ5bXY1eStOb0FpR1RUMDMwckkrU2ZycFdkdE5Bd2dsa05mSDBCc2ZzNWM3ekJHdXZ4MUIzdnFuZEgvb3Y2Nmd3UDFVNzJESTAwaG4wMkdnczhmNDMraDRDV083R2dvK1B5M1lyb2dDRDYvcnBndUNHTG1HZlMxRGlpQXIzVkE0SDQyK2JQQ1JYTmtGQWx4bFE0cjVtZVc4enRGbFB0dmxRNG81cGNlWGsrb0wveGVQL1A4V0RIQnRneXhPeGc4UGJ5L1RHZzVmMWpPaU9aUnprOU9DYnVlLzB6MzdpVlk1MWVqSTlLUXRUM20xQytRaS9uazdmN1l0RUV2NXJjUHFRZU44K2NITUdlZmhBZWpDMjI3S3N2cERSNVJYZVdpaGh4eS9ZSzI4YUtvdzZNR2UrVEJxbzhVRVRZTmI5VkxDbG9Ed1BvVVVrdlQrcGZ2bUxVR0h3V1Y1MFphUGlWOHhCVkY2NEN1dHFjMFdOWWZVVjlXS0NwZVdjUUExMDg5NDhpRFpYM1d4UjVjQ20yWVlYM1pNeHJXcisyUmRzSDFjWktmNisvV3ZFbFpmN2RIU21oOWZWK3hrejkzS2VsaHExV1g1d1oxZmVJZTl2V1BRMWxjWlgzbEVWRVB4UGswYXhiNE9xa3R6OVZ1Vk9iMXJhREJQR0J6N2V0elUzaUZYOTgzN2Q2NmZqbUZkWDEwcmNFYUowT2FodjZnYkZ3L1htbUFXbjNyK3ZjelBPQlh6KzIyOWZ0bjJINGY0TG9CVjl6Mit3WWtaRWJYUzIvNmZRWWFjOEZyMzJOWWZsK0NodVgzSzFqd0ROVy9aK01aV3F2ZThQc2VQT3EvSDFMRW1WTGp6Q3g3Y25pTnpKTXh2VEdYN0FPNDh2OENZUTNJcnhsZC8wTUFBQUFBU1VWT1JLNUNZSUk9Ii8+Cgk8L2RlZnM+Cgk8c3R5bGU+CgkJdHNwYW4geyB3aGl0ZS1zcGFjZTpwcmUgfQoJPC9zdHlsZT4KCTx1c2UgaWQ9IkJhY2tncm91bmQiIGhyZWY9IiNpbWcxIiB4PSIzNyIgeT0iMzciIC8+Cjwvc3ZnPg==)"></button>


            <div class ="break"></div>

            <div id="img_t2" title="圖片長寬 (image size)"></div>



            <button id="but_close"  onclick="fun_close_imgbox()" title="關閉 (close) [ esc ]" style='background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxOS4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDUwIDUwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MCA1MDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4NCgkuc3Qze2ZpbGw6I0ZGRkZGRjt9DQo8L3N0eWxlPg0KPGcgaWQ9IuWcluWxpF80Ij4NCgk8cG9seWdvbiBjbGFzcz0ic3QzIiBwb2ludHM9IjQwLjIsMTMuNiAzNi40LDkuOCAyNSwyMS4yIDEzLjYsOS44IDkuOCwxMy42IDIxLjIsMjUgOS44LDM2LjQgMTMuNiw0MC4yIDI1LDI4LjggMzYuNCw0MC4yIA0KCQk0MC4yLDM2LjQgMjguOCwyNSAJIi8+DQo8L2c+DQo8L3N2Zz4NCg==)' ></button>

        </div>

        <div class="img_text">
            <input type="text" id="img_t1">

        </div>

        <div id="img_content">
            <div id="img_w">    </div>                 
                <img id="img_img" />
            
        </div>

    </div>

    <div style="text-align:center; "></div>





    <!--css 框-->
    <style type="text/css">
        .sp {
            border: none;
            text-align: center;
            display: block;
            margin-top: 10px ;
        }

            /*圖片的上方列*/
        .sp.tit {
            display: none;
        }

        .sp img {
            position: static;
            margin: 20px auto;
            width: 90vw;
        }
    </style>




    <!--css 一般樣式-->
    <style type="text/css">
        html, body {
            padding: 0px;
            margin: 0px;
            background: none ;
            background-image: none !important;
        }
        body{
            background-color: rgba(0, 0, 0, 0) !important;
        }
        html {
            font-family: "微軟正黑體";
            background-color: rgb(30, 30, 30);
            color: #fff;
        }

    </style>


    <!--css 圖片檢視視窗-->
    <style type="text/css">
        #img_box {
            width: 100vw;
            height: 100vh;
            position: fixed;
            left: 0px;
            right: 0px;
            top: 0px;
            bottom: 0px;
            box-shadow: 0px 0px 16px 1px;
            z-index: 100;
        }


        #img_content {
            height: calc(100% - 0px);
            width: calc(100% - 50px);
            border: 0px solid rgba(255, 255, 255, 0.2);
            overflow: auto;
            margin: 0px;
            margin-left: 40px;
            position: relative;
        }

        #img_w {
            /*width: 100%;
            height: 100%;*/
            
            position: absolute;
            top: 0px;
            right: 0px;
            bottom: 0px;
            left: 0px;
            margin: auto;
            background-color: rgba(50,50,250,0);
     
        }


        #img_img {
            
            position: absolute;
            top: 0px;
            right: 0px;
            bottom: 0px;
            left: 0px;
            margin: auto;
            border : 0px rgba(0,0,0,0) solid;

            /*box-shadow: 0px 0px 20px rgba(0,0,0,0.85);*/
         

            /*避免圖片被反白 */
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
        }

        #img_d {
            height: 100vh;
            width: 100vw;
            position: fixed;
            top: 0px;
            z-index: 99;
        }

        .img_tit {
            height: 100%;
            width: 50px;
            float: left;
            background-color: rgba(0, 0, 0, 0.5);
        }

        .img_tit input {
            height: auto;
            width: 50px;
            line-height: 30px;
            border:   0px;
            outline: 0px;
            font-size: 17px;
            text-align: center;
            color: white;
            background-color: transparent;
        }

        #img_t1{
            font-size: 16px !important;
            display: block;
            background-color: rgba(0, 0, 0, 0);
            color: #fff;
            margin-left: 10px;
            border: none;
            width: calc(100% -460px);
            display: block;
            height: 20px;
            margin-top: 2px;
            display: none;
        }

        /*顯示長寬*/
        #img_t2{
            width:100%;
            color: #fff;
            margin-top: 10px;
            text-align: center;
            font-size:15px;
        }

        #text_scale {
            float: right;
            background-color: rgba(0, 0, 0, 0.30);
            border: 2px solid rgba(255, 255, 255, 0.70);
            width: 35px;
            height: 34px;
            margin-top: 5px;
            margin-right: 5px;
            display: block;
            font-size: 18px !important;
            font-family: "微軟正黑體";
            font-weight: 900;
            color: #fff;
            text-align: center;
        }

        .img_tit button {
            width: 50px;
            height: 50px;
            background-color: rgba(0, 0, 0, 0);
            border: none;
            display: block;
            background-position: center center !important;
            background-repeat: no-repeat !important;
            background-size: 80% 80%;
        }

        .bu_sel {
            /*outline: solid 4px #4CB4FF !important;
            width: 42px !important;
            height: 42px !important;
            margin: 4px;*/
        }

        .img_tit button:hover, input:hover {
            background-color: rgba(0, 122, 255, 0.40);
        }

        .img_tit button:focus {
            outline: 0;
        }

        .img_tit .break {
            margin: 3px 0px;
            border: none;
            float: right;
            width: 100%;
            height: 1px;
            background-color: #fff;
        }

        #but_l:active {
            transform: translateY(3px) scaleX(-1);
        }

        #but_close {
            bottom: 0px;
            position: absolute;
        }

    </style>
        `;


    //----------------------------------------------------


    //<!-- js 計算圖片長寬-->


    //把【長、寬】顯示在圖片上面
    function d(img, aa) {
        var size = fun_getImgSize(img);
        document.getElementById(aa).innerHTML = "w:" + size[0] + "　　h:" + size[1] + "";
    }

    //取得圖片長寬
    function fun_getImgSize(img) {
        var nWidth;
        var nHeight;

        if (img.naturalWidth) { // 現代瀏覽器
            nWidth = img.naturalWidth;
            nHeight = img.naturalHeight;
        } else { // IE6/7/8
            var image = new Image();
            image.src = img.src;
            nWidth = image.width;
            nHeight = image.height;
            image = null;
        }
        return new Array(nWidth, nHeight);
    }




    //----------------------------------------------------


    //<!-- js 拖曳-->


    var xxx;
    var yyy;
    var double_keen = 1.5;//拖曳靈敏度
    var bool_允許拖曳瀏覽 = true;//如果圖片長寬都低於螢幕，則取消拖曳瀏覽，讓使用者可以利用拖曳拉儲存圖片
    var obj_img_content;
    var obj_img;
    var obj_img_w;

    function main() {


        document.getElementById("text_scale").value = "98";//設定初始值
        fun_open_imgbox(0);

        //避免事件無法註冊成功
        document.getElementById("but_close").onclick = function () {
            fun_close_imgbox();
        };
        document.getElementById("but_imgSizeAdd").onclick = function () {
            fun_imgSizeAdd();
        };
        document.getElementById("but_imgSizeSubtrat").onclick = function () {
            fun_imgSizeSubtrat();
        };
        document.getElementById("bu_full").onclick = function () {
            fun_zoomMode('full');
        };
        document.getElementById("bu_full_h").onclick = function () {
            fun_zoomMode('h');
        };
        document.getElementById("bu_full_v").onclick = function () {
            fun_zoomMode('v');
        };
        document.getElementById("img_0").onload = function () {
            d(document.getElementById("img_img"), 0);
        };
        document.getElementById("cont").onclick = function () {
            fun_open_imgbox(0);
        };
        document.getElementById("but_white").onclick = function () {
            fun_switch();
        };
        document.getElementById("but_right").onclick = function () {
            fun_rotate_right();
        };
        document.getElementById("but_left").onclick = function () {
            fun_rotate_left();
        };


        var m_x;
        var m_y;
        var m_top;
        var m_left;
        obj_img_content = document.getElementById("img_content");
        obj_img = document.getElementById("img_img");
        obj_img_w = document.getElementById("img_w");


        obj_img_content.addEventListener("mousedown", function (e) {//按下時，註冊事件

            if (bool_允許拖曳瀏覽) {

                e.preventDefault();//取消點擊事件

                document.onmousemove = mousemove;

                m_x = e.screenX;
                m_y = e.screenY;

                m_top = obj_img_content.scrollTop;
                m_left = obj_img_content.scrollLeft;

            }


        }, false);

        function mousemove(e) {

            var int_top = m_top + (m_y - e.screenY) * double_keen;
            var int_left = m_left + (m_x - e.screenX) * double_keen;
            var int_捲軸寬度x = obj_img_content.offsetWidth - obj_img_content.clientWidth;
            var int_捲軸寬度y = obj_img_content.offsetHeight - obj_img_content.clientHeight;



            //當拖曳超出捲軸最大之時，則重新抓取拖動前記錄的坐標，這樣就不用返回到原點才能往回拖曳
            if (int_top < 0) {
                m_y = e.screenY;
                m_top = 0;
            }
            if (int_top >= obj_img.offsetHeight - obj_img_content.offsetHeight + int_捲軸寬度y + 60) {//外距是30，所以+60
                m_y = e.screenY;
                m_top = obj_img.offsetHeight - obj_img_content.offsetHeight + int_捲軸寬度y + 60;
            }
            if (int_left < 0) {
                m_x = e.screenX;
                m_left = 0;
            }
            if (int_left >= obj_img.offsetWidth - obj_img_content.offsetWidth + int_捲軸寬度x + 60) {
                m_x = e.screenX;
                m_left = obj_img.offsetWidth - obj_img_content.offsetWidth + int_捲軸寬度x + 60;
            }

            obj_img_content.scrollTop = int_top;
            obj_img_content.scrollLeft = int_left;

        }


        document.onmouseup = function () {//放開時，取消事件
            document.onmousemove = null;
        };





    }

    //----------------------------------------------------


    //<!-- js 放大-->

    var int_size = 100;
    var bool_視窗開啟 = false;
    var img_sel = 0;
    var img_size;

    // 註冊滾動事件
    if ('onmousewheel' in window) {
        window.onmousewheel = MouseWheel;
    } else if ('onmousewheel' in document) {
        document.onmousewheel = MouseWheel;
    } else if ('addEventListener' in window) {
        window.addEventListener("mousewheel", MouseWheel, true);
        window.addEventListener("DOMMouseScroll", MouseWheel, true);
    }

    function MouseWheel(e) {

        if (bool_視窗開啟 === false) {
            return;
        }

        e.preventDefault();//禁止頁面滾動

        e = e || window.event;


        //縮放計算
        if (e.wheelDelta <= 0 || e.detail > 0) {
            fun_imgSizeSubtrat(e);
        } else {
            fun_imgSizeAdd(e);
        }



    }






    //縮小圖片
    function fun_imgSizeSubtrat(e) {


        int_size *= 0.9;
        if (int_size <= 5) {
            int_size /= 0.9;
            return;
        }

        //如果不是透過滾輪來縮放，就從中央作為縮放起點
        if (e === undefined) {
            e = { clientX: 0, clientY: 0 };
            e.clientX = obj_img_content.offsetWidth / 2;
            e.clientY = obj_img_content.offsetHeight / 2;
        }

        //計算游標目前在圖片的坐標
        xxx = e.clientX - obj_img_w.offsetLeft - 50 + obj_img_content.scrollLeft;
        yyy = e.clientY - obj_img_w.offsetTop - 0 + obj_img_content.scrollTop;

        //計算圖片改變大小後的差距
        var xx2 = obj_img.offsetWidth - obj_img.offsetWidth * 0.9;
        var yy2 = obj_img.offsetHeight - obj_img.offsetHeight * 0.9;

        //儲存目前的捲軸位置
        var top2 = obj_img_content.scrollTop;
        var left2 = obj_img_content.scrollLeft;

        fun_imgSizeChange();//改變大小


        obj_img_content.scrollTop = top2 - ((yyy / obj_img.offsetHeight) * yy2) * 0.9;
        obj_img_content.scrollLeft = left2 - ((xxx / obj_img.offsetWidth) * xx2) * 0.9;

    }

    //放大圖片
    function fun_imgSizeAdd(e) {

        int_size *= 1.1;
        if (int_size >= 6000) {
            int_size /= 1.1;
            return;
        }

        fun_imgSizeChange();

        //如果不是透過滾輪來縮放，就從中央作為縮放起點
        if (e == undefined) {
            e = { clientX: 0, clientY: 0 };
            e.clientX = obj_img_content.offsetWidth / 2;
            e.clientY = obj_img_content.offsetHeight / 2;
        }

        xxx = e.clientX - obj_img_w.offsetLeft - 50 + obj_img_content.scrollLeft;
        yyy = e.clientY - obj_img_w.offsetTop - 0 + obj_img_content.scrollTop;


        var xx2 = obj_img.offsetWidth - obj_img.offsetWidth / 1.1;
        var yy2 = obj_img.offsetHeight - obj_img.offsetHeight / 1.1;

        obj_img_content.scrollTop += ((yyy / obj_img.offsetHeight) * yy2) * 1.1;
        obj_img_content.scrollLeft += ((xxx / obj_img.offsetWidth) * xx2) * 1.1;

    }


    //----------------------------------------------------


    //<!-- js 旋轉-->
    var deg = 0, r;
    function fun_rotate_right()
    {
        r = document.getElementById("input_deg").value;
        deg = (deg + r/2 + r/2) % 360;
        obj_img.style.transform = "rotate(" + deg + "deg)";
    }
    function fun_rotate_left()
    {
        r = document.getElementById("input_deg").value;
        deg = (deg - r) % 360;
        obj_img.style.transform = "rotate(" + deg + "deg)";
    }


    //----------------------------------------------------

    //<!-- js 圖片檢視視窗-->



    //
    function fun_switch() {

        var html = document.getElementsByTagName("html")[0];
        if (html.getAttribute("white") == "true") {
            html.style.backgroundColor = "rgb(30, 30, 30)";
            html.style.color = "#FFF";
            document.body.style.color = "#FFF";
            html.setAttribute("white", "false");
        } else {
            html.style.backgroundColor = "#EEE";
            html.style.color = "#000";
            document.body.style.color = "#000";
            html.setAttribute("white", "true");
        }




    }


    //關閉視窗
    function fun_close_imgbox() {
        bool_視窗開啟 = false;
        document.getElementById("img_box").style.display = "none";
        document.getElementById("img_d").style.display = "none";
        document.getElementsByClassName("sp")[0].style.display = "block";//顯示圖片
        document.getElementsByTagName("body")[0].style.overflow = "auto";//捲軸
    }

    //開啟視窗
    function fun_open_imgbox(x) {

        img_sel = x;
        bool_視窗開啟 = true;


        document.getElementById("img_box").style.display = "block";
        document.getElementById("img_d").style.display = "block";

        document.getElementById("img_img").src = urls[x];
        document.getElementById("img_open_url").href = urls[img_sel];
        document.getElementsByTagName("body")[0].style.overflow = "hidden";

        document.getElementsByClassName("sp")[0].style.display = "none";//隱藏圖片

        //圖片載入完成後計算長寬并顯示
        document.getElementById("img_img").onload = function () {
            img_size = fun_getImgSize(document.getElementById("img_img"));//取得圖片寬高
            fun_100scale();
            fun_imgTitle();
        };


    }

    //修改視窗顯示的資訊
    function fun_imgTitle() {
        document.getElementById("img_t2").innerHTML = img_size[0] + "<br>" + img_size[1];
        document.getElementById("img_t1").value = urls[img_sel];
    }

    var bool_width;//判斷縮放方式
    var st_zoomMode = "full";

    //選擇縮放模式
    function fun_zoomMode(x) {
        st_zoomMode = x;
        document.getElementById("bu_full").className = "";
        document.getElementById("bu_full_h").className = "";
        document.getElementById("bu_full_v").className = "";

        if (x == 'full') {
            document.getElementById("bu_full").className = "bu_sel";
        } else if (x == 'v') {
            document.getElementById("bu_full_v").className = "bu_sel";
        } else if (x == 'h') {
            document.getElementById("bu_full_h").className = "bu_sel";
        }

        fun_100scale();
    }

    //圖片 初始 & 最大 化
    function fun_100scale() {

        int_size = 100;

        try {
            int_size = Number(document.getElementById("text_scale").value);
            if (int_size < 10) {
                int_size = 10;
            } else if (int_size > 500) {
                int_size = 500;
            } else if (isNaN(int_size)) {
                int_size = 100;
            }
            document.getElementById("text_scale").value = int_size + "";
        } catch (e) {
            int_size = 100;
            document.getElementById("text_scale").value = "100";
        }

        if (st_zoomMode == "full") {//圖片滿版，需要判斷
            if (img_size[0] & img_size[1]) {
                var obj_content = document.getElementById("img_content");
                if ((img_size[0] / obj_content.offsetWidth) > (img_size[1] / obj_content.offsetHeight)) {
                    bool_width = true;
                } else {
                    bool_width = false;
                }
            } else {
                bool_width = false;
            }
        } else if (st_zoomMode == "v") {
            bool_width = false;
        } else if (st_zoomMode == "h") {
            bool_width = true;
        }

        fun_imgSizeChange();

        //如果圖片比視窗大，就初始化位置
        if (document.getElementById("img_content").offsetHeight < document.getElementById("img_img").offsetHeight) {
            document.getElementById("img_content").scrollTop = 0;
        }
        if (document.getElementById("img_content").offsetWidth < document.getElementById("img_img").offsetWidth) {
            document.getElementById("img_content").scrollLeft = 0;
        }

    }


    //縮放
    function fun_imgSizeChange() {
        var obj_img = document.getElementById("img_img");
        var obj_con = document.getElementById("img_content");




        if (bool_width) {
            //document.getElementById("img_img").style.width = int_size + "%";
            obj_img.style.width = (document.getElementById("img_content").offsetWidth * int_size / 100) - 60 + "px";
            document.getElementById("img_img").style.height = "auto";
        } else {
            //document.getElementById("img_img").style.height = int_size + "%";
            obj_img.style.height = (document.getElementById("img_content").offsetHeight * int_size / 100) - 60 + "px";
            document.getElementById("img_img").style.width = "auto";
        }


        obj_img_w.style.width = obj_img.offsetWidth + 60 + "px";
        obj_img_w.style.height = obj_img.offsetHeight + 60 + "px";


        //避免chrome出現跑版的現象
        if (obj_con.offsetHeight < obj_img_w.offsetHeight) {
            obj_img.style.marginTop = "30px";
            obj_img_w.style.marginTop = "0px";
        } else {
            obj_img.style.marginTop = "auto";
            obj_img_w.style.marginTop = "auto";
        }
        if (obj_con.offsetWidth < obj_img_w.offsetWidth) {

            obj_img.style.marginLeft = "30px";

        } else {
            obj_img.style.marginLeft = "auto";
        }


        //如果圖片長寬超出版面，才允許使用拖曳瀏覽
        if (obj_con.offsetHeight >= obj_img_w.offsetHeight && obj_con.offsetWidth >= obj_img_w.offsetWidth) {
            bool_允許拖曳瀏覽 = false;
        } else {
            bool_允許拖曳瀏覽 = true;
        }

    }








    //按下按鍵
    document.onkeydown = function (e) {

        var currKey = 0;
        e = e || event;
        currKey = e.keyCode || e.which || e.charCode;


        if (bool_視窗開啟) {

            if (currKey == 38 || currKey == 104) {//上 8
                document.getElementById("img_content").scrollTop -= 50;
                //e.preventDefault();
            } else if (currKey == 40 || currKey == 101) {//下 5
                document.getElementById("img_content").scrollTop += 50;
               //e.preventDefault();
            } else if (currKey == 100 || currKey == 37) {//左 4
                document.getElementById("img_content").scrollLeft -= 50;
                //e.preventDefault();
            } else if (currKey == 102 || currKey == 39) {//右 6
                document.getElementById("img_content").scrollLeft += 50;
                //e.preventDefault();
            } else if (currKey == 107 || currKey == 16) {// 放大 + shift
                fun_imgSizeAdd();
                e.preventDefault();
            } else if (currKey == 109 || currKey == 17) {//縮小 - ctrl
                fun_imgSizeSubtrat();
                e.preventDefault();
            }
        } else {
            if (currKey == 38) {
                document.getElementsByTagNameNS("body")[0].scrollTop -= 50;
                e.preventDefault();
            } else if (currKey == 40) {
                document.getElementsByTagNameNS("body")[0].scrollTop += 50;
                e.preventDefault();
            }
        }
    };

    //放開按鍵時
    document.onkeyup = function (e) {

        var currKey = 0, e = e || event;
        currKey = e.keyCode || e.which || e.charCode;
        var keyName = String.fromCharCode(currKey);

        if (bool_視窗開啟) {
            if (currKey == 27) {//關閉視窗
                fun_close_imgbox();
            }
        }

    };








    var src = document.body.getElementsByTagName("img")[0].src;
    document.body.getElementsByTagName("img")[0].parentNode.removeChild(document.body.getElementsByTagName("img")[0]);
    var urls = new Array(src);




    var i = 0;

    var div = document.createElement("div");
    div.innerHTML = add_html +
        "<span class='sp'>" +
        "<div class='tit'>" +
        "<a href='" + src + "' class='open_url' target='_blank'></a>" +
        "<div class='le'>" +
        "<div style='height=1px'></div>" +
        "<div class='wh' id='" + i + "'>---</div>" +
        "</div>" +
        "</div>" +
        "<div id='cont' onclick='fun_open_imgbox(\"" + i + "\")'>" +
        "<img id='img_" + i + "' alt=\"" + src + "\" src=\"" + src + "\">" +
        "</div></span>"
        ;

    document.body.appendChild(div);

    main();


    //---------------------------------
}








