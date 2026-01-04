// ==UserScript==
// @name        Onestep Search - 一键快搜，纵享丝滑搜索体验
// @version     1.0.2
// @author      Xanthella
// @namespace   Xanthella_Onestep_Search
// @description 任意网页【快速按2次Ctrl键】均可开启资源搜索，并且可自由切换搜索平台，搜索关键词会自动填充（关键词来源：1、鼠标选中的词；2、已经搜索使用的词），避免关键词重复输入。👉时间就是金钱，快速搜索，一步直达👈 。脚本现在已内置常用搜索平台，包括：常见搜索引擎、视频网站、音乐网站、购物网站、知识搜索等，更多快捷功能请查看详情~
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABK9JREFUWEfVl01PXFUYx//n3JdhLsMwMGRABQbFGLQaTLeaFDfGdGFcGD+DibUpL4OpC8NGW6AgNjVx08SFrmviRlfWb0DjpgsSgdIWOh2GIeVeZubce8xzZg7MC/MCG+JJmHtn7rnn+Z3/83ZgOOfBztk+/n8AVyd3frZMc6IQiP6QYaEghCkhRbSj42/Ltm/OzYXvn0bVthRYnPMmtl3vdwZEaHHHsuBY9pEdr1hEAAm65kXxMBKy79640XOlHZCWAFOp9H2TGZe6HQcmGFj5Da5vAARSHtmiu8e5HCzD2FhajI+0gmgKMJ16vsYYH734Vhe2NgJYnIEzoNK4NkAQgQSK9AHALRSx67ni9nLCagbREICMh6zQ6OUPwxge4bj3i4DBGCxeWs4kEgAikPAlqQCQaQIpBseqPDtw924t9PQ0gjgRQO/8k8tRJEc4fvvVh82hAMwygM0ZPLJcMfJ+CUaDkRq7rotiEDR0x4kAV6eeyc8+7sV7lwzc+U7AMUvTwgbFAMMrb0LFghNlcPclvH0gm5V4kZNKkUJQgiAgUiTjupAymFxYiK/UKlEHcGVy52nc6RwYeyOEkMGwvSnVlXbc18uRGGvsUZq7vRkowyW3SHVP47l7sL0w3/tSSwC9+6ebEuktKMOkQN8QQ3ywZdIoYILwhFQxQYpoV9yc76lboOqH69ezd4Qvv7h4oUvtOv1IqmCjSePvG60y6uj52j8B0hmqDMcqUCwciuKfK0uJjyoXqgKYnsmsRkKh8U7bQtjkaucGA6IxjuSF1rvXC5MKW+v+USx4ohQUJ7mhGiC1m01EOmMU7aSABng5aSA+2LYAKhgfPjgG0MH4ZD8nVpaq60IVwJfTO95gNNZBfifpNUBiiKN/uH0FzgwwncqsJyKRpFZA5z5F/9ApXbDxr39UE7QCj/f3Dn9Y6g83joFUZr3LDiWdcgwQACkRjTG89na5ArXhCYqBSgAdA+mDFxuLC9X9oUrXqZn0qmWY43HHUTFASoRNBuo1w6/yttKQ5KcscEUp/3UtoE4ppXww923Xuw0VoAezX+3KPqdTAVDToSygexqvv8MR6W4eC2Q8sxvUleQn+zmsLCWa1wEyMjObzSY6nZgqveXCr11Bvw0McwycEJC0c5K+0jjN1/Jv5fb2bi/31zWlOiI6fKQ97y9SgRTQu69UghYmJeiPDNOgq65+WmJdBRvJT/MadMPMusV5stdx1BlAt156oewNBUYGaFD7re6LxyVYwzRqyw0dmko9X4uEOkbDllUH0SwRas8DClBKHBSKyBcLdW25aUTNzGZWTcbHSQkatWpUgtSeiPQzEilfVqoginALhY3vbx2nYsvyRhDC98d7wg5IDT10hui2WwlDPqe5onw60s98KZHzXNgG+3FxvlcdWlsC0KTPrz2asLl9jzMWIxCVIRUw9J26XWnIQ5Ozu3k/+FSC9Xd1lObToIzwCh7ywv3gp5UhdXxvC6Byd998nfvDE2IsL0R32CwdzQMEOd/3Hy7XtFoq7YyxpBMKo+BLZZwDp3NBs4Br59nkTGY9AJI0t9b4mRRox2jtHHLhaKwPqRP+azq1C84C0Oydcwf4D8x7Xj+dMIJdAAAAAElFTkSuQmCC
// @match       *://*/*
// @grant       GM_openInTab
// @grant       GM_setClipboard
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @grant       GM_addElement
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @run-at      document-end
// @connect     baidu.com
// @unsafeWindow
// @license     GPL-3.0-only
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/511827/Onestep%20Search%20-%20%E4%B8%80%E9%94%AE%E5%BF%AB%E6%90%9C%EF%BC%8C%E7%BA%B5%E4%BA%AB%E4%B8%9D%E6%BB%91%E6%90%9C%E7%B4%A2%E4%BD%93%E9%AA%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/511827/Onestep%20Search%20-%20%E4%B8%80%E9%94%AE%E5%BF%AB%E6%90%9C%EF%BC%8C%E7%BA%B5%E4%BA%AB%E4%B8%9D%E6%BB%91%E6%90%9C%E7%B4%A2%E4%BD%93%E9%AA%8C.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //=========================定义网站数据=======================================
    function SiteInfo(_name, _url, _homepage, _icon) {
        this.name = _name;
        this.url = _url;
        this.home = _homepage;
        this.icon = _icon;

        this.callSiteInformation = function (_enable = true) {
            return {
                name: _name,
                url: _url,
                home: _homepage,
                icon: _icon,
                enable: _enable,
            };
        };
    };

	const defaultIcons ={
		default:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAdFJREFUWEftVkFugzAQxOQVQflL6cvSvCzJXyLyCnA1yIMmy2JMWymqBBdksHdnx+NZh+rNT3hz/moH8D8ZOJ1O7TAMbYzxI4Rwp466rvvaqqliBpC07/tzCKFdSXLZAqQIQNM0qOzMxDHG2+FwuHAsbCi4IiCrAGzyrutma47H45XMAJywtAoiC8AkR8UTC1VVjcGTHq4cgxW7LrcliwAkcFXX9efj8bhRfASC70g4DMOVc7gtCsL+Uw0tAhBaZzRq1SnY2UtiY6TxXRlxAWj13p4nmqNW4s2zccgKdPJ8Pkf2XABC36KImqYZAWgw73gyFhniOgLOAsjtHQLDiFhJzhvABP6Lj0yFuQC4dzkApY7nGNgLqy8AMBlq/wsANjHNC/HdU6D7njy+3cKAQ7MlydXTxACrhjiIPre/mnBUs/QIrXaNzRmAZKVTh9MywIxNxpOAN/qDUlxynF80YH3fExoAMhneTEj96JqS47zohFv83DMYXb9kZotGVOrntjdgHYSL9iyNK9sRt7bjKZh3R3AuK79rxx4TFJ32/PQN17PpQlJ6hFcZMCAw1DvBTKdrvcEuKAbgqBuNiMfyXtf1zbpciV3/CEBJ4NI5O4CdgW/CP38w2oLQPwAAAABJRU5ErkJggg==",
		baidu:'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzI3MzM3MTI2OTgyIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9Ijg2ODEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiPjxwYXRoIGQ9Ik0xODQuNjgyMDU4IDUzOC43NTg3NzFjMTExLjE3Njg3Ny0yMy44NzM0NzggOTYuMDI5MDg2LTE1Ni43MzY1OTMgOTIuNzAxNjktMTg1Ljc3NTY3Ny01LjQ0NDgyOC00NC43Njg1ODgtNTguMTAxNDM2LTEyMy4wMjA1NDItMTI5LjYwNTUyNi0xMTYuODMxMTIyLTg5Ljk3OTI3NiA4LjA3NDE2OC0xMDMuMTI1OTc3IDEzOC4wNTE5OTEtMTAzLjEyNTk3NyAxMzguMDUxOTkxLTEyLjE2OTQyNCA2MC4wNzkyNTggMjkuMTMyMTU4IDE4OC40NTE1NTQgMTQwLjAyOTgxMyAxNjQuNTU0ODA4eiBtMTE4LjA2NDM1MiAyMzEuMTAyNzA5Yy0zLjI1NzU5IDkuMzMwNjY3LTEwLjUxNzM2IDMzLjIyNzQxMy00LjIzNDg2NyA1NC4wMjk0NDkgMTIuNDAyMTA5IDQ2LjY3NjYwNCA1Mi45MTI1NjEgNDguNzcwNzY5IDUyLjkxMjU2MiA0OC43NzA3NjloNTguMjE3Nzc4VjczMC4zNTE1NzJoLTYyLjMzNjMwMmMtMjguMDE1MjcgOC4zNTMzOS00MS41MzQyNjYgMzAuMTU1OTcyLTQ0LjU1OTE3MSAzOS41MDk5MDh6IG04OC4yODA2NzYtNDUzLjg5ODU2NGM2MS40MDU1NjMgMCAxMTEuMDM3MjY2LTcwLjY2NjQyNCAxMTEuMDM3MjY2LTE1OC4wMzk2MjkgMC04Ny4yODAxMzEtNDkuNjMxNzAzLTE1Ny45MjMyODctMTExLjAzNzI2Ni0xNTcuOTIzMjg3LTYxLjMxMjQ4OSAwLTExMS4wNjA1MzQgNzAuNjQzMTU2LTExMS4wNjA1MzQgMTU3LjkyMzI4NyAwIDg3LjM3MzIwNSA0OS43NzEzMTQgMTU4LjAzOTYyOSAxMTEuMDYwNTM0IDE1OC4wMzk2Mjl6IG0yNjQuNDY5NzMzIDEwLjQ0NzU1NWM4Mi4wNjc5ODggMTAuNjU2OTcxIDEzNC44NDA5MzgtNzYuOTI1NjUgMTQ1LjMzNTAzLTE0My4zMTA2NzEgMTAuNzAzNTA4LTY2LjI5MTk0Ny00Mi4yNTU1OS0xNDMuMjg3NDAyLTEwMC4zNTcwMjYtMTU2LjUyNzE3Ny01OC4yMTc3NzktMTMuMzU2MTE3LTEzMC45MDg1NjIgNzkuOTA0MDE3LTEzNy41NDAwODQgMTQwLjcwNDU5OS03LjkxMTI4OSA3NC4zMTk1NzggMTAuNjMzNzAzIDE0OC41OTI2MiA5Mi41NjIwOCAxNTkuMTMzMjQ5eiBtMjAxLjA4NjM0OCAzOTAuMjEyNjg4cy0xMjYuOTc2MTg2LTk4LjIzOTU5My0yMDEuMTA5NjE3LTIwNC40MTM3NDNjLTEwMC40NzMzNjgtMTU2LjU1MDQ0NS0yNDMuMjAyMzI3LTkyLjg0MTMwMi0yOTAuOTQ5MjgyLTEzLjIxNjUwNi00Ny41Mzc1MzkgNzkuNjAxNTI3LTEyMS42MjQ0MzIgMTI5Ljk1NDU1NC0xMzIuMTQxNzkyIDE0My4yODc0MDMtMTAuNjgwMjQgMTMuMTIzNDMyLTE1My4zODU5MyA5MC4xNjU0MjQtMTIxLjY5NDIzNyAyMzAuODcwMDIzIDMxLjY2ODQyNCAxNDAuNjExNTI1IDE0Mi45MzgzNzUgMTM3LjkzNTY0OCAxNDIuOTM4Mzc0IDEzNy45MzU2NDhzODEuOTk4MTgyIDguMDc0MTY4IDE3Ny4xMTk3OTctMTMuMjE2NTA2Yzk1LjE2ODE1MS0yMS4xMDQ1MjYgMTc3LjA5NjUyOCA1LjI1ODY4IDE3Ny4wOTY1MjggNS4yNTg2ODFzMjIyLjI4Mzk0OCA3NC40MzU5MjEgMjgzLjEwNzc5OC02OC44NTE0ODJjNjAuNzU0MDQ1LTE0My4zMzM5MzktMzQuMzY3NTctMjE3LjY1MzUxOC0zNC4zNjc1NjktMjE3LjY1MzUxOHogbS0zODAuMzIzNTc4IDIxMy4yNTU3NzJoLTE0NC41MjA2MzJjLTYyLjQwNjEwOC0xMi40NDg2NDYtODcuMjU2ODYyLTU1LjAyOTk5NS05MC4zOTgxMS02Mi4yODk3NjUtMy4wNzE0NDItNy4zNzYxMTMtMjAuODAyMDM2LTQxLjYwNDA3Mi0xMS40MjQ4MzItOTkuODQ1MTE5IDI2Ljk2ODE4OC04Ny4yNTY4NjIgMTAzLjg3MDU2OS05My41MTYwODggMTAzLjg3MDU2OS05My41MTYwODhoNzYuOTI1NjV2LTk0LjU2MzE3MWw2NS41MjQwODcgMS4wMDA1NDZ2MzQ5LjIxMzU5N3ogbTI2OS4xNDY3MDEtMS4wMDA1NDVoLTE2Ni4yOTk5NDZjLTY0LjQ1MzczNi0xNi42MTM3MDctNjcuNDU1MzcyLTYyLjQwNjEwOC02Ny40NTUzNzEtNjIuNDA2MTA4di0xODMuODkwOTI5bDY3LjQ1NTM3MS0xLjA5MzYxOXYxNjUuMjc2MTMxYzQuMTE4NTI0IDE3LjYzNzUyIDI2LjAxNDE3OSAyMC44MjUzMDQgMjYuMDE0MTggMjAuODI1MzA1aDY4LjUyNTcyMnYtMTg1LjAwNzgxN2g3MS43NjAwNDR2MjQ2LjI5NzAzN3ogbTIzNS40MDczOC00OTAuOTg4NTQ4YzAtMzEuNzYxNDk4LTI2LjM4NjQ3NS0xMjcuMzk1MDE5LTEyNC4yMzA1MDMtMTI3LjM5NTAxOS05OC4wMDY5MDggMC0xMTEuMTA3MDcxIDkwLjI1ODQ5OC0xMTEuMTA3MDcyIDE1NC4wNjA3MTYgMCA2MC44OTM2NTYgNS4xNDIzMzggMTQ1Ljg5MzQ3NCAxMjYuODgzMTEyIDE0My4xOTQzMjkgMTIxLjc4NzMxMS0yLjY5OTE0NiAxMDguNDU0NDYzLTEzNy45MzU2NDggMTA4LjQ1NDQ2My0xNjkuODYwMDI2eiBtMCAwIiBmaWxsPSIjMzI0NURGIiBwLWlkPSI4NjgyIj48L3BhdGg+PC9zdmc+',
		google:'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzI3MzM3MTAzNzc2IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjczOTQiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiPjxwYXRoIGQ9Ik0yMTQuMTAxMzMzIDUxMmMwLTMyLjUxMiA1LjU0NjY2Ny02My43MDEzMzMgMTUuMzYtOTIuOTI4TDU3LjE3MzMzMyAyOTAuMjE4NjY3QTQ5MS44NjEzMzMgNDkxLjg2MTMzMyAwIDAgMCA0LjY5MzMzMyA1MTJjMCA3OS43MDEzMzMgMTguODU4NjY3IDE1NC44OCA1Mi4zOTQ2NjcgMjIxLjYxMDY2N2wxNzIuMjAyNjY3LTEyOS4wNjY2NjdBMjkwLjU2IDI5MC41NiAwIDAgMSAyMTQuMTAxMzMzIDUxMiIgZmlsbD0iI0ZCQkMwNSIgcC1pZD0iNzM5NSI+PC9wYXRoPjxwYXRoIGQ9Ik01MTYuNjkzMzMzIDIxNi4xOTJjNzIuMTA2NjY3IDAgMTM3LjI1ODY2NyAyNS4wMDI2NjcgMTg4LjQ1ODY2NyA2NS45NjI2NjdMODU0LjEwMTMzMyAxMzYuNTMzMzMzQzc2My4zNDkzMzMgNTkuMTc4NjY3IDY0Ni45OTczMzMgMTEuMzkyIDUxNi42OTMzMzMgMTEuMzkyYy0yMDIuMzI1MzMzIDAtMzc2LjIzNDY2NyAxMTMuMjgtNDU5LjUyIDI3OC44MjY2NjdsMTcyLjM3MzMzNCAxMjguODUzMzMzYzM5LjY4LTExOC4wMTYgMTUyLjgzMi0yMDIuODggMjg3LjE0NjY2Ni0yMDIuODgiIGZpbGw9IiNFQTQzMzUiIHAtaWQ9IjczOTYiPjwvcGF0aD48cGF0aCBkPSJNNTE2LjY5MzMzMyA4MDcuODA4Yy0xMzQuMzU3MzMzIDAtMjQ3LjUwOTMzMy04NC44NjQtMjg3LjIzMi0yMDIuODhsLTE3Mi4yODggMTI4Ljg1MzMzM2M4My4yNDI2NjcgMTY1LjU0NjY2NyAyNTcuMTUyIDI3OC44MjY2NjcgNDU5LjUyIDI3OC44MjY2NjcgMTI0Ljg0MjY2NyAwIDI0NC4wNTMzMzMtNDMuMzkyIDMzMy41NjgtMTI0Ljc1NzMzM2wtMTYzLjU4NC0xMjMuODE4NjY3Yy00Ni4xMjI2NjcgMjguNDU4NjY3LTEwNC4yMzQ2NjcgNDMuNzc2LTE3MC4wMjY2NjYgNDMuNzc2IiBmaWxsPSIjMzRBODUzIiBwLWlkPSI3Mzk3Ij48L3BhdGg+PHBhdGggZD0iTTEwMDUuMzk3MzMzIDUxMmMwLTI5LjU2OC00LjY5MzMzMy02MS40NC0xMS42NDgtOTEuMDA4SDUxNi42NTA2NjdWNjE0LjRoMjc0LjYwMjY2NmMtMTMuNjk2IDY1Ljk2MjY2Ny01MS4wNzIgMTE2LjY1MDY2Ny0xMDQuNTMzMzMzIDE0OS42MzJsMTYzLjU0MTMzMyAxMjMuODE4NjY3YzkzLjk5NDY2Ny04NS40MTg2NjcgMTU1LjEzNi0yMTIuNjUwNjY3IDE1NS4xMzYtMzc1Ljg1MDY2NyIgZmlsbD0iIzQyODVGNCIgcC1pZD0iNzM5OCI+PC9wYXRoPjwvc3ZnPg==',
		bing:'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzI3MzM3MTE2OTQxIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjgyMDEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiPjxwYXRoIGQ9Ik0yOTkuNTc0NDY4IDkwMC42Mjk3ODdjLTQ1Ljc1MzE5MS0yNS44NzIzNC04NC42OTc4NzItNDcuOTMxOTE1LTg2LjYwNDI1NS00OS4wMjEyNzYtMi40NTEwNjQtMS42MzQwNDMtMy4yNjgwODUtOTAuNDE3MDIxLTMuMjY4MDg1LTM4OS4xNzQ0NjggMC0zNjcuMzg3MjM0IDAuMjcyMzQtMzg2LjcyMzQwNCA0LjkwMjEyNy0zODQuODE3MDIyIDYuMjYzODMgMi40NTEwNjQgNzguOTc4NzIzIDI4LjU5NTc0NSA4Ny42OTM2MTcgMzEuMzE5MTQ5IDE2LjA2ODA4NSA1LjE3NDQ2OCA3Ni41Mjc2NiAyNy4yMzQwNDMgNzguOTc4NzI0IDI4LjU5NTc0NSAxLjkwNjM4MyAxLjA4OTM2MiAyLjcyMzQwNCAxMDguOTM2MTcgMi43MjM0MDQgMzA2LjM4Mjk3OSAwIDI3MS4yNTEwNjQgMC41NDQ2ODEgMzA0Ljc0ODkzNiA0LjA4NTEwNiAzMDMuMzg3MjM0IDcuNjI1NTMyLTIuOTk1NzQ1IDIzMS40ODkzNjItMTMyLjA4NTEwNiAyMzUuMzAyMTI4LTEzNS44OTc4NzMgMi45OTU3NDUtMi45OTU3NDUgMS4zNjE3MDItNC42Mjk3ODctMTAuODkzNjE3LTEwLjM0ODkzNi0yOC4wNTEwNjQtMTMuMDcyMzQtOTYuNDA4NTExLTQ1LjQ4MDg1MS0xMDAuMjIxMjc3LTQ3LjY1OTU3NC0yLjE3ODcyMy0xLjM2MTcwMi0xOS42MDg1MTEtNDEuMzk1NzQ1LTM4LjY3MjM0LTg5LjMyNzY2LTE5LjMzNjE3LTQ3LjY1OTU3NC0zNi4yMjEyNzctODkuMDU1MzE5LTM3Ljg1NTMxOS05MS43Nzg3MjMtMS42MzQwNDMtMi45OTU3NDUtMi40NTEwNjQtNS43MTkxNDktMS42MzQwNDMtNi41MzYxNzEgMC41NDQ2ODEtMC44MTcwMjEgMTEuNDM4Mjk4IDIuNDUxMDY0IDIzLjk2NTk1OCA2LjgwODUxMSAxMi41Mjc2NiA0LjYyOTc4NyAzNy4zMTA2MzggMTMuMzQ0NjgxIDU1LjI4NTEwNiAxOS42MDg1MTFzNDIuNDg1MTA2IDE0LjcwNjM4MyA1NC40NjgwODUgMTkuMDYzODMgMzYuNDkzNjE3IDEyLjggNTQuNDY4MDg1IDE5LjA2MzgyOSA0Mi40ODUxMDYgMTQuNzA2MzgzIDU0LjQ2ODA4NSAxOS4wNjM4MyAzNi40OTM2MTcgMTIuOCA1NC40NjgwODYgMTkuMDYzODMgNDIuNDg1MTA2IDE0LjcwNjM4MyA1NC40NjgwODUgMTkuMDYzODNjMTEuOTgyOTc5IDQuMDg1MTA2IDI0LjUxMDYzOCA4LjQ0MjU1MyAyOC4wNTEwNjMgOS41MzE5MTVsNS45OTE0OSAxLjYzNDA0MnYxOTcuOTkxNDlsLTU2LjM3NDQ2OCAzMi42ODA4NTFjLTY0LjI3MjM0IDM2Ljc2NTk1Ny0xNzcuODM4Mjk4IDEwMi40LTE5MC4wOTM2MTcgMTA5LjQ4MDg1MS00LjM1NzQ0NyAyLjcyMzQwNC0zNi4yMjEyNzcgMjAuOTcwMjEzLTcwLjgwODUxMSA0MC44NTEwNjMtNzMuNTMxOTE1IDQyLjQ4NTEwNi03My4yNTk1NzQgNDIuMjEyNzY2LTk4LjMxNDg5NCA1Ni45MTkxNDktMTAuNjIxMjc3IDUuOTkxNDg5LTE5Ljg4MDg1MSAxMS4xNjU5NTctMjAuNDI1NTMxIDEwLjg5MzYxNy0wLjU0NDY4MSAwLTM4LjQtMjEuMjQyNTUzLTg0LjE1MzE5Mi00Ni44NDI1NTN6IiBmaWxsPSIjMEI4MzgzIiBwLWlkPSI4MjAyIj48L3BhdGg+PC9zdmc+',
		sogou:'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzI3MzQyNjA3NTkxIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI5NDQiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiPjxwYXRoIGQ9Ik01NjkuNzg3ODUxIDY1Ni4zODM3NjNjLTIxLjQ3ODY3IDYuMTM2NzYzLTQzLjk4MDEzNCA5LjcxNjU0MS02Ni40ODE1OTggMTAuNzM5MzM2LTU4LjgxMDY0NSAyLjU1Njk4NS0xMTguMTMyNjg2LTQuNjAyNTcyLTE3NC4zODYzNDctMjEuNDc4NjcxLTQxLjQyMzE1LTExLjI1MDczMi04MS44MjM1MDYtMjYuNTkyNjM5LTEyMC42ODk2Ny00NS4wMDI5MjggMi4wNDU1ODggMzYuODIwNTc3IDQuMDkxMTc1IDczLjY0MTE1NSA2LjY0ODE2IDExMC40NjE3MzMgMjEuOTkwMDY3IDkuNzE2NTQxIDQzLjk4MDEzNCAxNy44OTg4OTIgNjYuOTkyOTk1IDI1LjA1ODQ0OCA2My45MjQ2MTQgMjEuOTkwMDY3IDEyOS44OTQ4MTUgMzcuMzMxOTc0IDE5Ni44ODc4MSA0NS41MTQzMjUgNDQuNDkxNTMxIDQuMDkxMTc1IDg5LjQ5NDQ1OSA0LjA5MTE3NSAxMzMuOTg1OTkgMCA0MS40MjMxNS0zLjA2ODM4MSA4Mi4zMzQ5MDItMTIuMjczNTI2IDEyMS4yMDEwNjgtMjcuNjE1NDMzIDMzLjI0MDc5OS0xMi43ODQ5MjMgNjEuMzY3NjI5LTM1LjI4NjM4NyA4MS44MjM1MDUtNjQuNDM2MDEgMjIuNTAxNDY0LTM3LjMzMTk3NCAyMy4wMTI4NjEtODMuMzU3Njk2IDIuMDQ1NTg4LTEyMS4yMDEwNjgtOS4yMDUxNDQtMTUuMzQxOTA3LTIwLjk2NzI3My0yOS42NjEwMjEtMzQuNzc0OTktNDAuOTExNzUzLTIxLjQ3ODY3LTE3LjM4NzQ5NS00NS41MTQzMjUtMzEuNzA2NjA4LTcxLjA4NDE3LTQyLjQ0NTk0My01My42OTY2NzYtMjEuNDc4NjctMTA4LjkyNzU0Mi0zOC44NjYxNjUtMTY1LjY5MjU5OS01MC42MjgyOTQtMjguMTI2ODMtNS42MjUzNjYtNTUuNzQyMjYzLTE0LjMxOTExMy04MS44MjM1MDYtMjYuNTkyNjQtMTIuMjczNTI2LTUuNjI1MzY2LTIyLjUwMTQ2NC0xNC4zMTkxMTMtMzAuMTcyNDE3LTI1LjU2OTg0NS00LjYwMjU3Mi03LjY3MDk1NC01LjYyNTM2Ni0xNi44NzYwOTgtMi4wNDU1ODgtMjUuNTY5ODQ2IDUuNjI1MzY2LTEwLjczOTMzNSAxNS4zNDE5MDctMTguNDEwMjg5IDI2LjU5MjYzOS0yMi41MDE0NjQgMjAuNDU1ODc2LTcuNjcwOTU0IDQyLjQ0NTk0My0xMC43MzkzMzUgNjQuNDM2MDExLTkuNzE2NTQxIDU1LjIzMDg2NiAxLjUzNDE5MSAxMTAuNDYxNzMyIDkuMjA1MTQ0IDE2NC4xNTg0MDggMjMuMDEyODYxIDQzLjk4MDEzNCAxMC43MzkzMzUgODYuOTM3NDc1IDI0LjAzNTY1NSAxMjguODcyMDIxIDQwLjkxMTc1M2wtNS42MjUzNjYtMTA3LjM5MzM1MWMtMjIuNTAxNDY0LTguMTgyMzUxLTQ1LjAwMjkyOC0xNC44MzA1MS02Ny41MDQzOTItMjAuOTY3Mjc0LTU0LjcxOTQ2OS0xNC4zMTkxMTMtMTEwLjQ2MTczMi0yNS41Njk4NDUtMTY2LjcxNTM5Mi0zMy4yNDA3OTktNTQuMjA4MDcyLTguMTgyMzUxLTEwOS40Mzg5MzktMTAuMjI3OTM4LTE2NC4xNTg0MDgtNi42NDgxNTktMzQuNzc0OTkgMi41NTY5ODUtNjguNTI3MTg2IDkuNzE2NTQxLTEwMS4yNTY1ODggMjEuOTkwMDY3LTI4LjYzODIyNyAxMC43MzkzMzUtNTQuMjA4MDcyIDI3LjYxNTQzMy03NS42ODY3NDMgNDkuMDk0MTAzLTIwLjk2NzI3MyAyMC45NjcyNzMtMzQuMjYzNTkzIDQ4LjA3MTMxLTM4Ljg2NjE2NSA3Ny4yMjA5MzMtMy41Nzk3NzggMTkuOTQ0NDc5LTEuNTM0MTkxIDQwLjQwMDM1NiA1LjYyNTM2NiA1OS4zMjIwNDIgMTAuNzM5MzM1IDIxLjk5MDA2NyAyNy4xMDQwMzYgNDAuOTExNzUzIDQ4LjA3MTMwOSA1My42OTY2NzUgMzcuODQzMzcxIDIzLjUyNDI1OCA3OS4yNjY1MjEgNDEuNDIzMTUgMTIyLjczNTI1OSA1Mi4xNjI0ODUgNDAuNDAwMzU2IDExLjc2MjEyOSA4MS44MjM1MDYgMTkuOTQ0NDc5IDEyMi43MzUyNTggMjguNjM4MjI3IDE5LjQzMzA4MyA0LjA5MTE3NSAzOC4zNTQ3NjggOS43MTY1NDEgNTYuNzY1MDU3IDE2LjM2NDcwMSAxNS44NTMzMDQgNS42MjUzNjYgMzAuNjgzODE1IDEzLjgwNzcxNyA0My45ODAxMzQgMjQuMDM1NjU1IDYuNjQ4MTYgNS4xMTM5NjkgMTEuMjUwNzMyIDExLjc2MjEyOSAxMy4yOTYzMiAxOS40MzMwODIgMS4wMjI3OTQgNy4xNTk1NTctMS41MzQxOTEgMTMuODA3NzE3LTcuMTU5NTU3IDE4LjQxMDI4OS0xMC4yMjc5MzggOC4xODIzNTEtMjAuOTY3MjczIDEzLjI5NjMyLTMyLjcyOTQwMiAxNS44NTMzMDR6IG0zNy44NDMzNzEgMjczLjU5NzM0N2MtMTQ1Ljc0ODExOSAzMi4yMTgwMDUtMjk3LjYzMzAwMS0xMS43NjIxMjktNDAyLjk4MDc2NS0xMTcuMTA5ODkyLTE5Ljk0NDQ3OS0xOS40MzMwODMtMzcuODQzMzcxLTQxLjQyMzE1LTUzLjE4NTI3OC02NC40MzYwMTEtOTkuMjExLTE0Ni43NzA5MTMtOTkuMjExLTMzOS41Njc1NDggMC00ODYuODQ5ODU4IDE1Ljg1MzMwNC0yMy4wMTI4NjEgMzMuNzUyMTk2LTQ0LjQ5MTUzMSA1My4xODUyNzgtNjQuNDM2MDEgMzkuODg4OTU5LTM5Ljg4ODk1OSA4Ni45Mzc0NzUtNzEuMDg0MTcgMTM4LjU4ODU2My05My4wNzQyMzggNTMuMTg1Mjc5LTIyLjUwMTQ2NCAxMTAuNDYxNzMyLTM0LjI2MzU5MyAxNjguMjQ5NTgzLTM0LjI2MzU5MyAxMTUuNTc1NzAyIDAgMjI2LjU0ODgzMSA0Ni41MzcxMTkgMzA3Ljg2MDk0IDEyOC44NzIwMjEgMTIxLjcxMjQ2NCAxMjEuMjAxMDY4IDE2MC4wNjcyMzMgMzAyLjc0Njk3IDk5LjIxMSA0NjMuMzI1Ni0xMy44MDc3MTcgMzYuMzA5MTgxLTMyLjcyOTQwMiA3MC41NzI3NzQtNTUuNzQyMjYzIDEwMS43Njc5ODUtMTAuNzM5MzM1IDE0LjMxOTExMy04LjE4MjM1MSAzNC4yNjM1OTMgNS42MjUzNjYgNDUuMDAyOTI4bDAuNTExMzk3IDAuNTExMzk3YzEyLjc4NDkyMyAxMi4yNzM1MjYgMzMuMjQwNzk5IDExLjc2MjEyOSA0NS41MTQzMjUtMS41MzQxOSAxLjAyMjc5NC0xLjAyMjc5NCAyLjA0NTU4OC0yLjU1Njk4NSAzLjA2ODM4MS00LjA5MTE3NiAxNjUuNjkyNTk5LTIyNC41MDMyNDMgMTE3LjYyMTI4OS01NDEuMDU3OTMtMTA3LjM5MzM1MS03MDYuNzUwNTI5LTI5LjE0OTYyNC0yMS40Nzg2Ny02MC4zNDQ4MzUtMzkuMzc3NTYyLTkzLjA3NDIzNy01NC4yMDgwNzItMjAuOTY3MjczLTkuNzE2NTQxLTQyLjQ0NTk0My0xNy4zODc0OTUtNjQuNDM2MDExLTIzLjUyNDI1OEMzODQuMTUwNzczLTU2LjUwMzUyOSAxMDQuNDE2NjYzIDk4LjQ0OTczNSAyNy4xOTU3MyAzNjYuNDIxNzE2Yy0xMi43ODQ5MjMgNDUuMDAyOTI4LTE5LjQzMzA4MyA5MS4wMjg2NS0xOS40MzMwODMgMTM3LjU2NTc2OC0wLjUxMTM5NyAyNzguMTk5OTE5IDIyNC41MDMyNDMgNTA0LjIzNzM1MyA1MDIuNzAzMTYyIDUwNC43NDg3NSA1NC4yMDgwNzIgMCAxMDguNDE2MTQ1LTguNjkzNzQ3IDE1OS41NTU4MzYtMjUuNTY5ODQ1IDE4LjQxMDI4OS02LjEzNjc2MyAyOC4xMjY4My0yNS41Njk4NDUgMjEuOTkwMDY3LTQzLjk4MDEzNS0wLjUxMTM5Ny0xLjUzNDE5MS0xLjAyMjc5NC0zLjU3OTc3OC0yLjA0NTU4Ny01LjExMzk2OS03LjE1OTU1Ny0xNS4zNDE5MDctMjUuMDU4NDQ5LTIyLjUwMTQ2NC00MC40MDAzNTYtMTYuMzY0NzAxLTE0LjMxOTExMyA0LjYwMjU3Mi0yOC42MzgyMjcgOC42OTM3NDctNDEuOTM0NTQ3IDEyLjI3MzUyNnogbTI2NC4zOTIyMDItNjQuNDM2MDExYy0zNy44NDMzNzEgMzcuODQzMzcxLTgxLjMxMjEwOSA2OS41NDk5OC0xMjguODcyMDIxIDkzLjU4NTYzNS0xNi4zNjQ3MDEgOC42OTM3NDctMjMuMDEyODYxIDI5LjE0OTYyNC0xMy44MDc3MTYgNDYuMDI1NzIydjAuNTExMzk3YzguNjkzNzQ3IDE2LjM2NDcwMSAyOC42MzgyMjcgMjMuMDEyODYxIDQ1LjAwMjkyOCAxNC44MzA1MSA1Ny4yNzY0NTQtMjkuNjYxMDIxIDEwOS40Mzg5MzktNjkuMDM4NTgzIDE1My40MTkwNzMtMTE2LjA4NzA5OCAxMi43ODQ5MjMtMTIuMjczNTI2IDEzLjI5NjMyLTMyLjcyOTQwMiAxLjAyMjc5My00NS41MTQzMjUtMS4wMjI3OTQtMS4wMjI3OTQtMi4wNDU1ODgtMi4wNDU1ODgtMy4wNjgzODEtMi41NTY5ODVsLTQuNjAyNTcyLTMuNTc5Nzc4Yy0xMi4yNzM1MjYtMTAuMjI3OTM4LTMwLjY4MzgxNS05LjIwNTE0NC00MS40MjMxNSAyLjU1Njk4NCIgZmlsbD0iI0U5NDkyNCIgcC1pZD0iMjk0NSI+PC9wYXRoPjwvc3ZnPg==',
		so360:'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzI3MzM3MDk2MjE2IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjY5MTIiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiPjxwYXRoIGQ9Ik01MzkuMyAxNTUuNGgtMC41YzAgMC41IDAgMC41IDAuNSAwek02MyA2MDUuMmMwLjUgMSAxIDEuNiAxIDIuNiAwLTEuMS0wLjUtMi4xLTEtMi42eiBtNjQzLjQgOC4zYzMwLjcgMCA1NS4yIDI1IDU1LjIgNTUuMiAwIDEyLTMuNiAyMi45LTEwLjQgMzEuOGgwLjVjMzAuNy01MS41IDQ4LjQtMTExLjkgNDguNC0xNzYgMC0xOTAtMTUzLjYtMzQzLjYtMzQzLjYtMzQzLjYtMTkwIDAtMzQzLjYgMTUzLjYtMzQzLjYgMzQzLjYgMCA2MS45IDE2LjcgMTIwLjMgNDUuMyAxNzAuMmgwLjVjLTQuMi03LjgtNi44LTE2LjctNi44LTI2IDAtMzAuNyAyNS01NS4yIDU1LjItNTUuMiAyMC4zIDAgMzcuNSAxMC45IDQ3LjQgMjcuMS0xOS4zLTMzLjgtMzAuNy03My40LTMwLjctMTE1LjYgMC0xMjguNiAxMDQuMS0yMzIuNyAyMzIuNy0yMzIuN1M2ODkuOCAzOTYuNCA2ODkuOCA1MjVjMCA0Mi43LTExLjUgODIuMy0zMS4yIDExNi42IDkuOC0xNi42IDI3LjUtMjguMSA0Ny44LTI4LjF6IiBmaWxsPSIjMjhCNzVBIiBwLWlkPSI2OTEzIj48L3BhdGg+PHBhdGggZD0iTTI1Ni43IDY0Mi43Yy0wLjUtMS0xLTEuNi0xLjYtMi4xIDAuNSAwLjUgMC41IDEuNSAxLjYgMi4xeiIgZmlsbD0iIzI4Qjc1QSIgcC1pZD0iNjkxNCI+PC9wYXRoPjxwYXRoIGQ9Ik03NjIuMSA2NjkuMmMwLTMwLjctMjUtNTUuMi01NS4yLTU1LjItMjAuOCAwLTM4LjUgMTEuNS00Ny45IDI4LjEtNDAgNjkuMy0xMTUgMTE2LjEtMjAxLjQgMTE2LjEtODUuNCAwLTE1OS44LTQ2LjMtMjAwLjQtMTE1aC0wLjVjLTkuNC0xNy4yLTI3LjYtMjkuMi00OC40LTI5LjItMzAuNyAwLTU1LjIgMjUtNTUuMiA1NS4yIDAgMTEuNSAzLjYgMjIuNCA5LjkgMzEuMiA1OC44IDEwMC41IDE2OC43IDE2OC4xIDI5NC4xIDE2OC4xIDEyNS41IDAgMjM0LjgtNjcuMiAyOTUuMi0xNjcuNmgtMC41YzYuMi04LjggMTAuMy0xOS43IDEwLjMtMzEuN3ogbS01NjQuMyA1NC4yYzMuMSAwLjUgNi4yIDEgOS45IDEtMy4xIDAtNi43LTAuNS05LjktMXogbS0xNy43LTYuOGMxIDAuNSAyLjYgMS42IDMuNiAyLjEtMS41LTAuNS0yLjUtMS4xLTMuNi0yLjF6IG03LjMgNC4yYzIuNiAxIDUuMiAyLjEgOC4zIDIuNi0zLjEtMS4xLTUuNy0xLjYtOC4zLTIuNnogbTc1LTYxYzAuNSAzLjEgMSA2LjIgMSA5LjQgMC0zLjEtMC41LTYuMi0xLTkuNHogbS0yLjEtNi43YzAuNSAxIDAuNSAyLjEgMSAzLjEgMC0xLTAuNS0yLjEtMS0zLjF6IG0zOTIgNi43Yy0wLjUgMy4xLTEgNi4yLTEgOS40IDAtMy4xIDAtNi4yIDEtOS40eiBtMS42LTcuOGMtMC41IDEuNi0xIDIuNi0xIDQuMiAwLjQtMS42IDEtMy4xIDEtNC4yeiBtNjIuNCA3MS40Yy0zLjEgMC41LTYuOCAxLTkuOSAxIDMuNyAwIDYuOC0wLjUgOS45LTF6IG0yOC4xLTE0LjFjLTIuMSAxLjYtNC4yIDMuNi02LjIgNS4yIDIuMS0xLjYgNC4yLTMuMSA2LjItNS4yeiBtLTguMyA2LjhjLTIuMSAxLTQuMiAyLjYtNi4yIDMuNiAyLTEuNSA0LjEtMi42IDYuMi0zLjZ6IG0tOC44IDQuMWMtMi42IDEtNS43IDIuMS04LjggMi42IDMtMC41IDYuMi0xIDguOC0yLjZ6IG0xOS43LTEzLjVjMS42LTIuMSAzLjYtMy42IDQuNy01LjctMS41IDIuMS0zLjEgNC4xLTQuNyA1Ljd6IiBmaWxsPSIjRjhCNjE2IiBwLWlkPSI2OTE1Ij48L3BhdGg+PHBhdGggZD0iTTY1NyA2NTcuOGMwIDMwLjUgMjQuNyA1NS4yIDU1LjIgNTUuMiAzMC41IDAgNTUuMi0yNC43IDU1LjItNTUuMiAwLTMwLjUtMjQuNy01NS4yLTU1LjItNTUuMi0zMC41IDAtNTUuMiAyNC43LTU1LjIgNTUuMiIgZmlsbD0iIzI4OTM0OSIgcC1pZD0iNjkxNiI+PC9wYXRoPjxwYXRoIGQ9Ik02NTEuMyA2NjkuMmMwIDMwLjUgMjQuNyA1NS4yIDU1LjIgNTUuMiAzMC41IDAgNTUuMi0yNC43IDU1LjItNTUuMlM3MzYuOSA2MTQgNzA2LjQgNjE0Yy0zMC40IDAtNTUuMSAyNC43LTU1LjEgNTUuMiIgZmlsbD0iI0Y4QjYxNiIgcC1pZD0iNjkxNyI+PC9wYXRoPjxwYXRoIGQ9Ik0xNDYuOCA2NTcuOGMwIDMwLjUgMjQuNyA1NS4yIDU1LjIgNTUuMiAzMC41IDAgNTUuMi0yNC43IDU1LjItNTUuMiAwLTMwLjUtMjQuNy01NS4yLTU1LjItNTUuMi0zMC41IDAtNTUuMiAyNC43LTU1LjIgNTUuMiIgZmlsbD0iIzI4OTM0OSIgcC1pZD0iNjkxOCI+PC9wYXRoPjxwYXRoIGQ9Ik0xNTIuNSA2NjkuMmMwIDMwLjUgMjQuNyA1NS4yIDU1LjIgNTUuMiAzMC41IDAgNTUuMi0yNC43IDU1LjItNTUuMlMyMzguMiA2MTQgMjA3LjcgNjE0Yy0zMC41IDAtNTUuMiAyNC43LTU1LjIgNTUuMk04NTAuNiA4MTMuNGMwIDE5LjcgMTAuNSAzNy45IDI3LjYgNDcuOCAxNy4xIDkuOSAzOC4xIDkuOSA1NS4yIDBzMjcuNi0yOC4xIDI3LjYtNDcuOC0xMC41LTM3LjktMjcuNi00Ny44YTU1LjAxIDU1LjAxIDAgMCAwLTU1LjIgMGMtMTcgOS45LTI3LjYgMjguMS0yNy42IDQ3LjgiIGZpbGw9IiNGOEI2MTYiIHAtaWQ9IjY5MTkiPjwvcGF0aD48L3N2Zz4=',
	};
	
    // 百度系列
    const Baidu = new SiteInfo('百度', 'https://www.baidu.com/s?wd=%s&ie=utf-8', 'https://www.baidu.com/', 'baidu');
    const Baidufanyi = new SiteInfo('百度翻译', 'https://fanyi.baidu.com/#auto/zh/%s', 'https://fanyi.baidu.com/', 'baidu_fanyi');
    const Baiduwangpan = new SiteInfo('百度网盘', 'https://pan.baidu.com/disk/home?#/search?key=%s', 'https://pan.baidu.com/', 'baidu_wangpan');
    const Baidubaike = new SiteInfo('百度百科', 'https://baike.baidu.com/search/word?pic=1&sug=1&word=%s', 'https://baike.baidu.com/', 'baidu_baike');
    const Baiduzhidao = new SiteInfo('百度知道', 'https://zhidao.baidu.com/search?word=%s', 'https://zhidao.baidu.com/', 'baidu_zhidao');
    const Baiduxinwen = new SiteInfo('百度新闻', 'https://www.baidu.com/s?rtt=1&bsst=1&cl=2&tn=news&rsv_dl=ns_pc&word=%s', 'http://news.baidu.com/', Baidu.icon);
    const Baiduwenku = new SiteInfo('百度文库', 'https://wenku.baidu.com/search?word=%s', 'https://wenku.baidu.com/', 'baidu_wenku');
    const Baidumap = new SiteInfo('百度地图', 'https://map.baidu.com/search?querytype=s&wd=%s', 'https://map.baidu.com/', 'baidu_map');
    const Baidutupian = new SiteInfo('百度图片', 'https://image.baidu.com/search/index?tn=baiduimage&ie=utf-8&word=%s', 'https://image.baidu.com/', Baidu.icon);
    const Baiduxueshu = new SiteInfo('百度学术', 'http://xueshu.baidu.com/s?wd=%s', 'http://xueshu.baidu.com/', Baidu.icon);
    const Baidutieba = new SiteInfo('贴吧', 'https://tieba.baidu.com/f?kw=%s&ie=utf-8', 'https://tieba.baidu.com/', 'baidu_tieba');

    // 谷歌系列
    const Google = new SiteInfo('谷歌', 'https://www.google.com/search?q=%s&ie=utf-8&oe=utf-8', 'https://www.google.com/', 'google');
    const Googlefanyi = new SiteInfo('谷歌翻译', 'https://translate.google.com/?q=%s', '',  'google_translate');
    const Googlemap = new SiteInfo('谷歌地图', 'https://www.google.com/maps/search/%s', 'https://www.google.com/maps/', 'google_map');
    const Googleearth = new SiteInfo('谷歌地球', 'https://earth.google.com/web/search/%s', 'https://earth.google.com/web/', 'google_earth');
    const Googlexueshu = new SiteInfo('谷歌学术', 'https://scholar.google.com/scholar?hl=zh-CN&q=%s', '', Google.icon);
    const Googlepic = new SiteInfo('谷歌图片', 'https://www.google.com/search?q=%s&tbm=isch', 'https://www.google.com/imghp?hl=zh-CN', Google.icon);
    const Googlenews = new SiteInfo('谷歌新闻', 'https://news.google.com/search?q=%s&hl=zh-CN&gl=CN&ceid=CN:zh-Hans', 'https://news.google.com/topstories?hl=zh-CN&gl=CN&ceid=CN:zh-Hans', 'google_news');

    const StackOverflow = new SiteInfo('StackOverflow', 'https://stackoverflow.com/search?q=%s', '', 'stackoverflow');
    const Zhihu = new SiteInfo('知乎', 'https://www.zhihu.com/search?q=%s', 'https://www.zhihu.com/', 'zhihu');
    const Bing = new SiteInfo('必应', 'https://cn.bing.com/search?q=%s', 'https://cn.bing.com/', 'bing');
    const Bilibili = new SiteInfo('哔哩哔哩', 'https://search.bilibili.com/all?keyword=%s', 'https://www.bilibili.com/', 'bilibili');
    const Taobao = new SiteInfo('淘宝', 'https://s.taobao.com/search?q=%s', 'https://www.taobao.com/', 'taobao');
    const Jingdong = new SiteInfo('京东', 'https://search.jd.com/Search?keyword=%s&enc=utf-8', 'https://www.jd.com/', 'jd');
    const Tianmao = new SiteInfo('天猫', 'https://list.tmall.com/search_product.htm?q=%s', 'https://www.tmall.com/', 'tmall');
    const Maimai = new SiteInfo('脉脉', 'https://maimai.cn/web/search_center?type=gossip&query=%s&highlight=true', 'https://maimai.cn/feed_list', 'maimai');
    const Weibo = new SiteInfo('微博', 'https://s.weibo.com/weibo/%s', 'https://weibo.com/', 'weibo');
    const GitHub = new SiteInfo('GitHub', 'https://github.com/search?q=%s', 'https://github.com/' , 'github');
	
	//短视频
	const Douyin = new SiteInfo('抖音', 'https://www.douyin.com/search/%s', 'https://www.douyin.com/' , 'douyin');
	const Kuaishou = new SiteInfo('快手', 'https://www.kuaishou.com/search/video?searchKey=%s', 'https://www.kuaishou.com/' , 'kuaishou');
	
	const Sogou = new SiteInfo('搜狗', 'https://www.sogou.com/web?query=%s', 'https://www.sogou.com/', 'sogou');
	const So360 = new SiteInfo('360', 'https://www.so.com/s?ie=utf-8&q=%s', 'https://www.so.com/', 'so360');
    
	const Bookmarkearth = new SiteInfo('书签搜索', 'https://www.bookmarkearth.cn/s/search?q=%s', 'https://www.bookmarkearth.cn', 'bookmarkearth');
	//=========================定义网站数据=======================================

    const defaultConf = {
        showToolbar: false,              // 显示划词工具条
        showFrequentEngines: true,      // 显示常用搜索引擎
        showClassifiedEngines: true,    // 显示分类搜索引擎
        showPlaceholder: true,          // 显示使用方式提示信息(如搜索框placeholder)
        enableOnInput: false,           // 是否在input/textarea上启用划词和快捷键
        autoCopyToClipboard: false,     // 划词时自动复制到剪贴板(内容为文本格式)

        //
        // 搜索框默认搜索引擎
        // 属性:
        //   - name 搜索引擎名称
        //   - url 搜索引擎搜索url
        //   - home 搜索引擎主页url
        //
        defaultEngine: {
            name: Baidu.name,
            url: Baidu.url,
            home: Baidu.home,
			icon: Baidu.icon
        },
        //
        // 绑定快捷键的搜索引擎列表
        // 属性:
        //   - name 搜索引擎名称
        //   - url 搜索引擎搜索url
        //   - home 搜索引擎主页url
        //   - hotkeys 快捷键列表, 仅支持配置单字符按键的code值, 实际起作用的是Alt+单字符键, S/D/F/L键已被脚本征用
        //   - enable 是否启用
        //
        hotkeyEngines: [
            {
                name: '百度百科',
                url: 'https://baike.baidu.com/search/word?pic=1&sug=1&word=%s',
                home: 'https://baike.baidu.com/',
                hotkeys: ['KeyW'],
                enable: true,
            },
            {
                name: '百度翻译',
                url: 'https://fanyi.baidu.com/#auto/zh/%s',
                home: 'https://fanyi.baidu.com/',
                hotkeys: ['KeyE'],
                enable: true,
            },
            {
                name: '百度',
                url: Baidu.url,
                home: Baidu.home,
                hotkeys: ['KeyB'],
                enable: true,
            },
            {
                name: 'Google',
                url: Google.url,
                home: Google.home,
                hotkeys: ['KeyG'],
                enable: true,
            },
        ],
        //
        // 常用搜索引擎列表
        // 属性:
        //   - name 搜索引擎名称
        //   - url 搜索引擎搜索url
        //   - home 搜索引擎主页url
        //   - icon 搜索引擎图标, base64编码
        //   - enable 是否启用
        //
        frequentEngines: [
            Baidu.callSiteInformation(),
            Baidubaike.callSiteInformation(),
            Zhihu.callSiteInformation(),
            Bilibili.callSiteInformation(),
			Douyin.callSiteInformation(),
			{
			    name: '公众号',
			    url: 'https://weixin.sogou.com/weixin?ie=utf8&type=2&query=%s',
			    icon: 'gongzhonghao',
			    enable: true
			},
			Bookmarkearth.callSiteInformation()
        ],
        //
        // 分类搜索引擎列表, 二维数组, 默认认为该配置包含了所有已配置搜索引擎
        // 一级分类属性:
        //   - name 分类名称
        //   - enable 该分类是否启用
        //   - engines 该分类下的搜索引擎列表
        // 二级搜索引擎属性:
        //   - name 搜索引擎名称
        //   - url 搜索引擎搜索url
        //   - home 搜索引擎主页url
        //   - icon 搜索引擎图标, base64编码
        //   - enable 搜索引擎是否启用
        //
        classifiedEngines: [
            {
                name: '搜索',
				ident:'search-engines',
                enable: true,
                engines: [
                    Baidu.callSiteInformation(),
                    Google.callSiteInformation(),
                    Bing.callSiteInformation(),
					Sogou.callSiteInformation(),
					So360.callSiteInformation()
                ]
            },
			{
				name:'视频',
				ident:'video',
				enable: true,
				engines:[
					{
					    name: '腾讯视频',
					    url: 'https://v.qq.com/x/search/?q=%s',
					    home: 'https://v.qq.com/',
					    icon: 'tengxunshipin',
						enable: true
					},
					{
					    name: '爱奇艺',
					    url: 'https://www.iqiyi.com/search/%s.html',
					    home: 'https://www.iqiyi.com/',
					    icon: 'iqiyi',
						enable: true
					},
					{
					    name: '优酷',
					    url: 'https://so.youku.com/search_video/q_%s',
					    home: 'https://www.youku.com/',
					    icon: 'youku',
						enable: true
					},
					{
					    name: '芒果TV',
					    url: 'https://so.mgtv.com/so?k=%s&lastp=so_result',
					    home: 'https://www.mgtv.com/',
					    icon: 'mgtv',
						enable: true
					},
					Bilibili.callSiteInformation(),
					Douyin.callSiteInformation(),
					Kuaishou.callSiteInformation()
				]
			},
			{
			    name: '音乐',
				ident:'music',
			    enable: true,
			    engines: [
			        {
			            name: '网易云音乐',
			            url: 'https://music.163.com/#/search/m/?s=%s',
			            icon: "music163",
			            enable: true
			        },
			        {
			            name: 'QQ音乐',
			            url: 'https://y.qq.com/portal/search.html#page=1&searchid=1&remoteplace=txt.yqq.top&t=song&w=%s',
			            icon: "qqyinyue",
			            enable: true
			        },
			        {
			            name: '酷我音乐',
			            url: 'http://www.kuwo.cn/search/list?type=all&key=%s',
			            icon: 'kuwoyinyue',
			            enable: true
			        },
			        {
			            name: '咪咕音乐',
			            url: 'https://music.migu.cn/v3',
			            icon: 'migu',
			            enable: true
			        },
			        {
			            name: '酷狗音乐',
			            url: 'https://www.kugou.com/yy/html/search.html#searchType=song&searchKeyWord=%s',
			            home: 'https://www.kugou.com/',
			            icon: 'kugou',
			            enable: true
			        }
			    ]
			},
			{
			    name: '购物',
				ident:'shopping',
			    enable: true,
			    engines: [
			        Taobao.callSiteInformation(),
			        Jingdong.callSiteInformation(),
			        Tianmao.callSiteInformation(),
					{
						name: '1688',
						url: 'https://s.1688.com/selloffer/offer_search.htm?keywords=%s',
						home: 'http://www.1688.com/',
						icon: '1688',
						enable: true
					},
			        {
			            name: '当当',
			            url: 'http://search.dangdang.com/?key=%s&act=input',
			            home: 'http://www.dangdang.com/',
			            icon: 'dangdang',
			            enable: true
			        },
			        {
			            name: '苏宁',
			            url: 'https://search.suning.com/%s/',
			            home: 'https://www.suning.com/',
			            icon: 'suning',
			            enable: true
			        },
			        {
			            name: '唯品会',
			            url: 'https://category.vip.com/suggest.php?keyword=%s',
			            icon: 'vip',
			            enable: true
			        }
			    ]
			},
            {
                name: '知识',
				ident: 'knowledge',
                enable: true,
                engines: [
                    Zhihu.callSiteInformation(),
                    Maimai.callSiteInformation(),
					Baiduzhidao.callSiteInformation(),
					Baidubaike.callSiteInformation(),
                    {
                        name: 'Quora',
                        url: 'https://www.quora.com/search?q=%s',
                        icon: 'quora',
						enable: true
                    },
                    {
                        name: '维基百科',
                        url: 'https://zh.wikipedia.org/wiki/%s',
                        icon: 'wikipedia',
                        enable: true
                    },
                    {
                        name: '萌娘百科',
                        url: 'https://zh.moegirl.org/%s',
                        icon: 'moegirl',
						enable: true
                    },
                    {
                        name: '果壳',
                        url: 'https://www.guokr.com/search/all/?wd=%s',
                        icon: 'guokr',
                        enable: true
                    }
                ]
            },
			{
			    name: '社交',
				ident:'social-interaction',
			    enable: true,
			    engines: [
			        Weibo.callSiteInformation(),
			        Baidutieba.callSiteInformation(),
			        Zhihu.callSiteInformation(),
			        {
			            name: '豆瓣',
			            url: 'https://www.douban.com/search?q=%s',
			            home: 'https://www.douban.com/',
			            icon: 'douban',
			            enable: true
			        },
			        {
			            name: 'Twitter',
			            url: 'https://twitter.com/search?q=%s',
			            icon: 'twitter',
			            enable: false
			        },
			        {
			            name: 'Facebook',
			            url: 'https://www.facebook.com/search/results.php?q=%s',
			            icon: 'facebook',
			            enable: false
			        }
			    ]
			},
            {
                name: '翻译',
				ident:'translate',
                enable: true,
                engines: [
                    Baidufanyi.callSiteInformation(),
                    Googlefanyi.callSiteInformation(),
                    {
                        name: '有道词典',
                        url: 'https://youdao.com/w/%s',
                        icon: 'youdao',
                        enable: true
                    },
                    {
                        name: '必应翻译',
                        url: 'https://cn.bing.com/dict/search?q=%s',
                        home: 'https://www.bing.com/dict',
                        icon: Bing.icon,
                        enable: true
                    },
                    {
                        name: '海词词典',
                        url: 'http://dict.cn/%s',
                        icon: 'haidii',
                        enable: true
                    },
                    {
                        name: 'CNKI翻译',
                        url: 'http://dict.cnki.net/dict_result.aspx?scw=%s',
                        icon: 'cnki',
                        enable: false
                    },
                    {
                        name: 'deepL',
                        url: 'https://www.deepl.com/translator#en/zh/%s',
                        icon: 'deepl',
                        enable: true
                    },
                ]
            },
            {
                name: '地图',
				ident:'map',
                enable: true,
                engines: [
                    Baidumap.callSiteInformation(),
                    {
                        name: '高德地图',
                        url: 'https://www.amap.com/search?query=%s',
                        icon: "gaodemap",
                        enable: true
                    },
                    Googlemap.callSiteInformation(),
                    Googleearth.callSiteInformation()

                ]
            },
            {
                name: '图片',
				ident:'picture',
                enable: true,
                engines: [
					{
						name: '阿里矢量图',
						url: 'https://www.iconfont.cn/search/index?searchType=icon&q=%s',
						home: 'https://www.iconfont.cn/',
						icon: "iconfont",
						enable: true
					},
					{
					    name: 'pixiv',
					    url: 'https://www.pixiv.net/tags/%s',
						home: 'https://www.pixiv.net/',
					    icon: "pixiv",
					    enable: true
					},
					{
					    name: 'flickr',
					    url: 'https://www.flickr.com/search/?q=%s',
						home: 'https://www.flickr.com/',
					    icon: "flickr",
					    enable: true
					},
					{
					    name: '花瓣',
					    url: 'https://huaban.com/search/?q=%s',
						home: 'https://huaban.com/',
					    icon: "huaban",
					    enable: true
					},
                    Baidutupian.callSiteInformation(),
                    {
                        name: '搜狗图片',
                        url: 'https://pic.sogou.com/pics?query=%s',
						home: 'https://pic.sogou.com/',
                        icon: "sogou",
                        enable: true
                    },
                    {
                        name: '必应图片',
                        url: 'https://www.bing.com/images/search?q=%s',
                        home: 'https://www.bing.com/images/trending',
                        icon: "bing",
                        enable: true
                    },
					Googlepic.callSiteInformation()
                ]
            },
            {
                name: '学术',
				ident:'academic',
                enable: true,
                engines: [
                    Googlexueshu.callSiteInformation(),
                    Baiduxueshu.callSiteInformation(),
                    {
                        name: '知网',
                        url: 'http://epub.cnki.net/kns/brief/default_result.aspx?txt_1_value1=%s&dbPrefix=SCDB&db_opt=CJFQ%2CCJFN%2CCDFD%2CCMFD%2CCPFD%2CIPFD%2CCCND%2CCCJD%2CHBRD&singleDB=SCDB&action=scdbsearch',
                        icon: 'cnki',
                        enable: true
                    },
                    {
                        name: '万方',
                        url: 'http://www.wanfangdata.com.cn/search/searchList.do?searchType=all&searchWord=%s',
                        icon: 'wanfangdata',
                        enable: true
                    },
                    {
                        name: 'WOS',
                        url: 'http://apps.webofknowledge.com/UA_GeneralSearch.do?fieldCount=3&action=search&product=UA&search_mode=GeneralSearch&max_field_count=25&max_field_notice=Notice%3A+You+cannot+add+another+field.&input_invalid_notice=Search+Error%3A+Please+enter+a+search+term.&input_invalid_notice_limits=+%3Cbr%2F%3ENote%3A+Fields+displayed+in+scrolling+boxes+must+be+combined+with+at+least+one+other+search+field.&sa_img_alt=Select+terms+from+the+index&value(input1)=%s&value%28select1%29=TI&value%28hidInput1%29=initVoid&value%28hidShowIcon1%29=0&value%28bool_1_2%29=AND&value%28input2%29=&value%28select2%29=AU&value%28hidInput2%29=initAuthor&value%28hidShowIcon2%29=1&value%28bool_2_3%29=AND&value%28input3%29=&value%28select3%29=SO&value%28hidInput3%29=initSource&value%28hidShowIcon3%29=1&limitStatus=collapsed&expand_alt=Expand+these+settings&expand_title=Expand+these+settings&collapse_alt=Collapse+these+settings&collapse_title=Collapse+these+settings&SinceLastVisit_UTC=&SinceLastVisit_DATE=×panStatus=display%3A+block&timeSpanCollapsedListStatus=display%3A+none&period=Range+Selection&range=ALL&ssStatus=display%3Anone&ss_lemmatization=On&ss_query_language=&rsStatus=display%3Anone&rs_rec_per_page=10&rs_sort_by=PY.D%3BLD.D%3BVL.D%3BSO.A%3BPG.A%3BAU.A&rs_refinePanel=visibility%3Ashow',
                        icon: 'webofknowledge',
						enable: true
                    },
                    {
                        name: 'Springer',
                        url: 'http://rd.springer.com/search?query=%s',
                        icon: 'springer',
						enable: true
                    },
                    {
                        name: 'Letpub',
                        url: 'https://www.letpub.com.cn/index.php?page=journalapp&view=search&searchsort=relevance&searchname=%s',
                        home: 'https://www.letpub.com.cn/',
                        icon: '',
                        enable: true
                    },
                    {
                        name: '科研通',
                        url: 'https://www.ablesci.com/journal/index?keywords=%s',
                        home: 'https://www.ablesci.com/',
                        icon: 'ablesci',
                        enable: true
                    }
                ]
            },
			{
			    name: '开发',
				ident:'development',
			    enable: true,
			    engines: [
			        StackOverflow.callSiteInformation(),
			        {
			            name: 'Apache Issues',
			            url: 'https://issues.apache.org/jira/secure/QuickSearch.jspa?searchString=%s',
			            home: 'https://issues.apache.org/jira/',
			            icon: 'apache',
						enable: true
			        },
			        GitHub.callSiteInformation(),
			        {
			            name: 'Maven',
			            url: 'https://mvnrepository.com/search?q=%s',
			            icon: 'maven',
						enable: true
			        }
			    ]
			}
        ],
    };

    ///////////////////////////////////////////////////////////////////
    // css样式
    ///////////////////////////////////////////////////////////////////

    const defaultSheet = `
        /*
           注意: 为了避免网页style对该工具的影响, 所有样式均进行初始化并加入!important,
           js中设置style时也要注意将其设置为important, 否则不能生效.
        */
        /* 划词工具条 */
        .qs-toolbar {
            /* 初始化所有style, 避免被网页本身的style影响 */
            all: initial !important;
            position: absolute !important;
            display: block !important;
            height: 26px !important;
            padding: 2px !important;
            white-space: nowrap !important;
            border: 1px solid #F5F5F5 !important;
            box-shadow: 0px 0px 2px #BBB !important;
            background-color: #FFF !important;
            z-index: 10000 !important;
        }
        .qs-toolbar-icon {
            all: initial !important;
            display: inline-block !important;
            margin: 0px !important;
            padding: 2px !important;
            width: 20px !important;
            height: 20px !important;
            border: 1px solid #FFF !important;
            cursor: pointer !important;
        }
        .qs-toolbar-icon:hover {
            border: 1px solid #CCC !important;
        }

        /* 快搜主窗口背景层 */
        .qs-r025kcjix9vmk1dx2vdxcq45-main-background-layer {
            all: initial !important;
            position: fixed !important;
            display: block !important;
            top: 0px !important;
            left: 0px !important;
            width: 100% !important;
            height: 100% !important;
            border: 0px !important;
            background-color: rgba(144,144,144,0.3) !important;
            /* 使背景层背后的所有元素虚化 */
            backdrop-filter: blur(5px) !important;
            z-index: 2147483646 !important;
        }
		.qs-r025kcjix9vmk1dx2vdxcq45-main-background-mascot{
			all: initial !important;
			width:160px!important;
			position: fixed !important;
			right:20px!important;
			bottom:20px!important;
			text-align:center!important;
		}
		.qs-r025kcjix9vmk1dx2vdxcq45-main-background-mascot >img{
			width:150px!important;
		}
		.qs-r025kcjix9vmk1dx2vdxcq45-main-background-mascot >span{
			font-size:12px!important;
			color:#5e5e5e!important;
			font-weight:bold!important;
			display:inline-block!important;
		}
        /* 快搜主窗口 */
        .qs-mainbox {
            all: initial !important;
            position: fixed !important;
            display: block !important;
            text-align: center !important;
            overflow: auto !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            /* 宽度优先展示 */
            width: max-content !important;
            min-width: 500px !important;
            max-width: 1400px !important;
            min-height: 75px !important;
            max-height: 650px !important;
            padding: 10px !important;
            border: 1px solid #F5F5F5 !important;
            box-shadow: 0px 0px 3px #BBB !important;
            border-radius: 5px !important;
            background-color: #FFF !important;
            opacity: 1 !important;
            z-index: 2147483647 !important;
        }
		 /* 快搜主窗口搜索框 */
		.qs-r025kcjix9vmk1dx2vdxcq45-main-search-outer-box{
			position:relative !important;
			width: 80% !important;
			min-width: 400px !important;
			max-width: 800px !important;
			margin: 5px auto !important;
		}
        /* 快搜主窗口搜索框:input */
        .qs-r025kcjix9vmk1dx2vdxcq45-main-search-box {
			all: initial !important;
            text-align: center !important;
            width: 100% !important;
			height:50px !important;
			padding:0px 15px 0px 15px !important;
            border: 0px !important;
			display:flex !important;
			flex-direction: row!important;
			align-items: center!important;
			border: 1px solid #C4C7CE !important;
			border-radius: 10px !important;
        }
		.qs-r025kcjix9vmk1dx2vdxcq45-main-search-box:hover{
			border-color:#4E71F2 !important;
		}
		.qs-r025kcjix9vmk1dx2vdxcq45-main-search-box-platform-icon{
			width: 24px !important;
			height: 24px !important;
			overflow: hidden !important;
			cursor: pointer !important;
			background-size: 24px 24px;
			background-repeat: no-repeat !important;
			display: block !important;
		}
        .qs-r025kcjix9vmk1dx2vdxcq45-main-search-input {
            all: initial !important;
            text-align: left !important;
            height: 40px !important;
            padding: 0px 13px !important;
            font: 17px/20px arial !important;
            outline: none !important;
			flex:1!important;
        }
		.qs-r025kcjix9vmk1dx2vdxcq45-main-search-box-clear-btn{
			width: 30px!important;
			height: 30px!important;
			line-height:30px!important;
			text-align:center !important;
			overflow: hidden!important;
			cursor: pointer!important;
			background: transparent!important;
			border: none!important;
			color: #D5D5D5!important;
			font-size:30px !important;
			font-weight:700!important;
			display:none!important;
		}
        .qs-r025kcjix9vmk1dx2vdxcq45-main-search-input::selection {
            color: #FFF !important;
            background-color: #425d78 !important;
        }
        .qs-r025kcjix9vmk1dx2vdxcq45-main-search-input::placeholder {
            color: #DDD !important;
            opacity: 1 !important;
        }
		/* 选择默认搜索弹窗 */
		.qs-r025kcjix9vmk1dx2vdxcq45-main-switch-search-engines-box{
			all: initial !important;
			position: absolute!important;
			top: 65px!important;
			left: 0px !important;
			width: 400px !important;
			background: #FFF !important;
			border-radius: 4px !important;
			box-shadow: 0 5px 10px 0 #d8d7d7 !important;
			box-shadow: 0 4px 10px rgba(0, 0, 0, .5) !important;
			transition: all 0.3s !important;
			-moz-transition: all 0.3s !important;
			-webkit-transition: all 0.3s !important;
			-o-transition: all 0.3s !important;
			z-index: 999 !important;
		}
		.qs-r025kcjix9vmk1dx2vdxcq45-main-switch-search-engines-box::before {
			all: initial !important;
			content: '' !important;
			width: 0px !important;
			height: 0px !important;
			position: absolute !important;
			top: -18px !important;
			border-top: 10px solid transparent !important;
			border-right: 10px solid transparent !important;
			border-bottom: 10px solid #fff !important;
			border-left: 10px solid transparent !important;
			left: 10px !important;
		}
		.qs-r025kcjix9vmk1dx2vdxcq45-main-switch-search-engines-items{
			all: initial !important;
			display: flex !important;
			flex-direction: row !important;
			flex-wrap: wrap !important;
		}
		.qs-r025kcjix9vmk1dx2vdxcq45-main-switch-search-engines-items >li{
			all: initial !important;
		    width: calc(25% - 20px) !important;
		    line-height: 24px !important;
		    font-size: 12px !important;
		    padding: 5px 5px 5px 5px !important;
		    margin: 5px !important;
		    background-color: #e6e6e6 !important;
		    color: #333333 !important;
		    cursor: pointer !important;
		    white-space: nowrap !important;
		    overflow: hidden !important;
			display: block !important;
			text-align: left !important;
			vertical-align: middle !important;
			border-radius: 3px !important;
		}
		.qs-r025kcjix9vmk1dx2vdxcq45-main-switch-search-engines-items >li:hover{
			background-color: #dfdfdf !important;
		}
		.qs-r025kcjix9vmk1dx2vdxcq45-main-switch-search-engines-items >li >img{
			all: initial !important;
			display: inline-block !important;
			vertical-align: middle !important;
			width: 16px !important;
			height: 16px !important;
			margin: 0px 2px 0px 2px !important;
			border: 0px !important;
			cursor: pointer !important;
		}
		.qs-r025kcjix9vmk1dx2vdxcq45-main-switch-search-engines-items >li >span{
			all: initial !important;
			display: inline-block !important;
			vertical-align: middle !important;
			margin-right: 2px !important;
			font-size: 13px !important;
			font-weight:bold!important;
			color: #000 !important;
			border: 0px !important;
			cursor: pointer !important;
		}
        /* 快搜主窗口常用搜索引擎列表 */
        .qs-r025kcjix9vmk1dx2vdxcq45-main-frequent-box {
            all: initial !important;
            display: block !important;
            text-align: center !important;
            width: 100% !important;
            height: 38px !important;
            margin: 15px 0px 5px 0px !important;
            white-space: nowrap !important;
            border: 0px !important;
        }
        .qs-r025kcjix9vmk1dx2vdxcq45-main-frequent-icon {
            all: initial !important;
            display: inline-block !important;
            width: 28px !important;
            height: 28px !important;
            margin: 0px 6px !important;
            padding: 3px !important;
            border: 2px solid #FFF !important;
            cursor: pointer !important;
        }
        .qs-r025kcjix9vmk1dx2vdxcq45-main-frequent-icon:hover {
            border: 2px solid #CCC !important;
        }
        /* 快搜主窗口分类搜索引擎列表 */
        .qs-r025kcjix9vmk1dx2vdxcq45-main-classified-box {
            all: initial !important;
            display: block !important;
            text-align: center !important;
            width: 100% !important;
            margin-top: 15px !important;
            padding-top: 5px !important;
            border: 0px !important;
            border-top: 1px solid #DDD !important;
        }
        .qs-r025kcjix9vmk1dx2vdxcq45-main-classified-family-box {
            all: initial !important;
            display: inline-block !important;
            text-align: left !important;
            vertical-align: top !important;
            min-width: 50px !important;
            max-width: 150px !important;
            height: 100% !important;
            margin: 5px 3px !important;
            border: 0px !important;
        }
        .qs-r025kcjix9vmk1dx2vdxcq45-main-classified-family-title {
            all: initial !important;
            display: block !important;
            text-align: left !important;
            margin: 5px 4px !important;
            font-size: 18px !important;
            font-weight: 300 !important;
            color: #777 !important;
            border: 0px !important;
        }
        .qs-r025kcjix9vmk1dx2vdxcq45-main-classified-family-engine {
            all: initial !important;
            display: block !important;
            text-align: left !important;
            vertical-align: middle !important;
            height: 26px !important;
            border: 2px solid #FFF !important;
            cursor: pointer !important;
        }
        .qs-r025kcjix9vmk1dx2vdxcq45-main-classified-family-engine:hover {
            border: 2px solid #CCC !important;
        }
        .qs-r025kcjix9vmk1dx2vdxcq45-main-classified-family-engine-icon {
            all: initial !important;
            display: inline-block !important;
            vertical-align: middle !important;
            width: 16px !important;
            height: 16px !important;
            margin: 0px 3px 0px 2px !important;
            border: 0px !important;
            cursor: pointer !important;
        }
        .qs-r025kcjix9vmk1dx2vdxcq45-main-classified-family-engine-name {
            all: initial !important;
            display: inline-block !important;
            vertical-align: middle !important;
            margin-right: 2px !important;
            font-size: 13px !important;
            font-weight: 400 !important;
            color: #5F5F5F !important;
            border: 0px !important;
            cursor: pointer !important;
        }
        .qs-r025kcjix9vmk1dx2vdxcq45-main-help-info-box {
            all: initial !important;
            display: block !important;
            text-align: center !important;
            width: 100% !important;
            border: 0px !important;
        }
        .qs-r025kcjix9vmk1dx2vdxcq45-main-help-info-item {
            all: initial !important;
            margin: 0px 10px !important;
            font-size: 9px !important;
            color: #888 !important;
            cursor: pointer !important;
            text-decoration: none !important;
        }
        .qs-r025kcjix9vmk1dx2vdxcq45-main-help-info-item:hover {
            color: #4E71F2 !important;
        }

        /* 设置窗口 */
        .qs-setting-box {
            all: initial !important;
            position: fixed !important;
            display: block !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: fit-content !important;
            height: fit-content !important;
            padding: 10px !important;
            border: 1px solid #F5F5F5 !important;
            box-shadow: 0px 0px 6px #BBB !important;
            border-radius: 10px !important;
            background-color: #FFF !important;
            opacity: 1 !important;
            z-index: 40000 !important;
        }
        .qs-setting-config-textarea {
            all: initial !important;
            display: block !important;
            width: 800px !important;
            height: 650px !important;
            padding: 5px !important;
            white-space: pre !important;
            overflow-wrap: normal !important;
            font: 400 13.3333px Arial !important;
            border: 1px solid #CCC !important;
            border-radius: 5px !important;
        }
        .qs-setting-config-textarea:focus {
            border-color: #4E71F2 !important;
        }
        .qs-setting-button-bar {
            all: initial !important;
            display: block !important;
            width: 100% !important;
            text-align: right !important;
            border: 0px !important;
        }
        .qs-setting-button {
            all: initial !important;
            display: inline-block !important;
            width: 60px !important;
            margin: 10px 0px 5px 20px !important;
            font-size: 13px !important;
            color: #555 !important;
            border: 0px !important;
            cursor: pointer !important;
        }
        .qs-setting-button:hover {
            color: #4E71F2 !important;
        }

        /* 信息提示浮层 */
        .qs-info-tips-layer {
            all: initial !important;
            position: fixed !important;
            display: block !important;
            overflow: hidden !important;
            bottom: 30px !important;
            right: 30px !important;
            width: fit-content !important;
            height: fit-content !important;
            padding: 10px !important;
            font-size: 13px !important;
            color: #FFF !important;
            border: 0px !important;
            border-radius: 3px !important;
            background-color: rgba(0,0,0,0.7) !important;
            z-index: 2147483647 !important;
        }

        /* 搜索建议浮层 */
        .qs-suggestions-layer {
            all: initial !important;
            position: fixed !important;
            display: block !important;
            overflow: hidden !important;
            height: fit-content !important;
            border: 1px solid #F5F5F5 !important;
            z-index: 2147483647 !important;
			box-shadow: 0 4px 8px rgba(0, 0, 0, .2)!important;
        }
        .qs-suggestion-item, .qs-suggestion-item-selected {
            all: initial !important;
            display: block !important;
            text-align: left !important;
            vertical-align: middle !important;
            width: 100% !important;
            height: 33px !important;
            line-height: 33px !important;
            padding-left: 13px !important;
            font-size: 15px !important;
            font-weight: 400 !important;
            color: #555 !important;
            border: 0px !important;
            background-color: rgba(255,255,255) !important;
        }
        .qs-suggestion-item-selected {
            background-color: rgba(230,230,230) !important;
        }
        .qs-suggestion-item:hover {
            cursor: pointer !important;
            background-color: rgba(230,230,230) !important;
        }
    `;

    ///////////////////////////////////////////////////////////////////
    // 全局变量
    ///////////////////////////////////////////////////////////////////
	const STORAGE_KEY = {
		conf: 'qs-conf',
		tipsShowMark: 'qs-tips-mark',
		tipsDelay: 'qs-tips-delay',
		introduce: 'qs-introduce',
		usedDays: 'qs-script-used-days'
	}

    var conf = GM_getValue(STORAGE_KEY.conf, defaultConf);
    var hotkey2Engine = {};             // 自定义快捷键搜索的hotkey到engine的映射表
    var qsPageLock = false;             // 是否在当前页面锁定快搜所有功能, 锁定之后仅响应解锁快捷键

    ///////////////////////////////////////////////////////////////////
    // 功能函数
    ///////////////////////////////////////////////////////////////////
	
	function loadingIcon(icon){
		if(!icon){
			return defaultIcons.default;
		}
		if(icon.indexOf("base64:")!=-1){
			return icon;
		}
		const localIcon = defaultIcons[icon];
		return localIcon ? localIcon : "https://static.staticj.top/img/pics/svg/" + icon + ".svg"
	}
	
	function CommonTools(){
		// 获取元素style属性, 包括css中的
		this.getStyleByElement = function(e, styleProp) {
		    if (window.getComputedStyle) {
		        return document.defaultView.getComputedStyle(e, null).getPropertyValue(styleProp);
		    } else if (e.currentStyle) {
		        return e.currentStyle[styleProp];
		    }
		};
		
		// 计算元素在文档(页面)中的绝对位置
		this.getElementPosition = function(e){
		    return {
		        top: e.getBoundingClientRect().top + window.scrollY,        // 元素顶部相对于文档顶部距离
		        bottom: e.getBoundingClientRect().bottom + window.scrollY,  // 元素底部相对于文档顶部距离
		        left: e.getBoundingClientRect().left + window.scrollX,      // 元素左边相对于文档左侧距离
		        right: e.getBoundingClientRect().right + window.scrollX     // 元素右边相对于文档左侧距离
		    };
		};
		
		// 获取可视窗口在文档(页面)中的绝对位置
		this.getWindowPosition = function(){
		    return {
		        top: window.scrollY,
		        bottom: window.scrollY + window.innerHeight,
		        left: window.scrollX,
		        right: window.scrollX + window.innerWidth
		    };
		};
		
		// 判断元素在文档(页面)中是否可见
		this.isVisualOnPage = function(ele){
		    if (this.getStyleByElement(ele, 'display') == 'none'
		        || this.getStyleByElement(ele, 'visibility') == 'hidden'
		        || this.getStyleByElement(ele, 'opacity') == '0') {
		        return false;
		    }
		    if (this.getStyleByElement(ele, 'position') != 'fixed'
		        && ele.offsetParent == null) {
		        return false;
		    }
		    var elePos = this.getElementPosition(ele);
		    if (elePos.bottom - elePos.top == 0 || elePos.right - elePos.left == 0
		        || elePos.bottom <= 0 || elePos.right <= 0) {
		        return false;
		    }
		    return true;
		};
		
		// 获取选中文本
		this.getSelection = function(){
			return window.getSelection().toString().trim();
		};
		
		this.loadSheet = function(sheet, id){
			if(!id){
				id = "default-"+Math.ceil(Math.random()*100000000);
			}
			const css = document.createElement('style');
			css.type = "text/css";
			css.id = id;
			css.textContent = sheet;
			const heads = document.getElementsByTagName('head');
			if(heads && heads.length>0){
				document.getElementsByTagName('head')[0].appendChild(css);
			}else{
				document.body.insertAdjacentHTML('beforeend', html);
			}
		};
		
		this.getPlatform = function(){
			const userAgent = navigator.userAgent.toLocaleLowerCase();
			let platform = "unknown";
			if(userAgent.indexOf("mac")!=-1){
				platform = "mac";
			}else{
				platform = "win";
			}
			return platform;
		};
		
		/**
		 * @param {Object} time
		 * @param {Object} format
		 * 时间格式化
		 * DateFormat(new Date(dateCreated), "yyyy-MM-dd hh:mm:ss")
		 */
		this.dateFormat = function(time, format) {
			if(!time){time=new Date();}
			var o = {
				"M+": time.getMonth() + 1, //月份 
				"d+": time.getDate(), //日 
				"h+": time.getHours(), //小时 
				"m+": time.getMinutes(), //分 
				"s+": time.getSeconds(), //秒 
				"q+": Math.floor((time.getMonth() + 3) / 3), //季度 
				"S": time.getMilliseconds() //毫秒 
			};
			if(/(y+)/.test(format)){
				format = format.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
			}
			for(var k in o){
				if(new RegExp("(" + k + ")").test(format)){
					format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
				}
			}
			return format;
		};
	}
	
	/**
	 * 
	 * @param {*} conf 
	 * 设置相关方法
	 */
	function Setting(commonTools, conf){
		this.qsSettingBox = null;
		this.qsConfigTextarea = null;
		this.conf = conf;
		
		this.createSettingBox=function(){
		    // 设置窗口container
		    var settingBox = document.createElement('div');
		    settingBox.id = 'qs-setting-box';
		    settingBox.className = 'qs-setting-box';
		    settingBox.style.setProperty('display', 'none', 'important');
		    document.body.appendChild(settingBox);
		    // 配置文本框
		    var configTextarea = document.createElement('textarea');
		    configTextarea.id = 'qs-setting-config-textarea';
		    configTextarea.className = 'qs-setting-config-textarea';
		    settingBox.appendChild(configTextarea);
		    // 底部按钮container
		    var buttonBar = document.createElement('div');
		    buttonBar.id = 'qs-setting-button-bar';
		    buttonBar.className = 'qs-setting-button-bar';
		    settingBox.appendChild(buttonBar);
		    // 重置按钮
		    var resetButton = document.createElement('button');
		    resetButton.id = 'qs-setting-button-reset';
		    resetButton.className = 'qs-setting-button';
		    resetButton.type = 'button';
		    resetButton.textContent = '重置';
		    resetButton.onclick = (e)=> {
		        configTextarea.value = JSON.stringify(defaultConf, null, 4);
		    }
		    buttonBar.appendChild(resetButton);
		    // 关闭按钮
		    var closeButton = document.createElement('button');
		    closeButton.id = 'qs-setting-button-close';
		    closeButton.className = 'qs-setting-button';
		    closeButton.type = 'button';
		    closeButton.textContent = '取消';
		    closeButton.onclick = (e)=> {
		        this.hideSettingBox();
		    }
		    buttonBar.appendChild(closeButton);
		    // 保存按钮
		    var saveButton = document.createElement('button');
		    saveButton.id = 'qs-setting-button-save';
		    saveButton.className = 'qs-setting-button';
		    saveButton.type = 'button';
		    saveButton.textContent = '保存';
		    saveButton.onclick = (e)=> {
		        var newConf = JSON.parse(configTextarea.value);
		        GM_setValue(STORAGE_KEY.conf, newConf);
		        this.hideSettingBox();
		        // 需用户手动刷新页面重新加载配置使其生效
		        alert('设置已保存, 刷新页面后生效.');
		    }
		    buttonBar.appendChild(saveButton);
		
		    this.qsSettingBox = settingBox;
		    this.qsConfigTextarea = configTextarea;
		};
		
		// 设置窗口是否处于显示状态
		this.isSettingBoxVisual = function(){
			return this.qsSettingBox.style.display == 'block';
		};
		
		// 显示设置窗口
		this.showSettingBox = function(){
		    ensureQuickSearchAlive();
		
		    if (this.isSettingBoxVisual()) {
		        return;
		    }
		
		    var confStr = JSON.stringify(conf, null, 4);
		    this.qsConfigTextarea.value = confStr;
		    this.qsSettingBox.style.setProperty('display', 'block', 'important');
		};
		
		// 隐藏设置窗口
		this.hideSettingBox = function() {
		    this.qsSettingBox.style.setProperty('display', 'none', 'important');
		};
	}

	/**
	 * 快搜
	 */
	function QuickSearch(commonTools, conf){
		//
		// 主窗口参数，
		//
		this.qsBackgroundLayer = null;
		this.qsMainBox = null;
		this.qsSearchInput = null;
		this.qsInputClearBtn = null;
		
		//
		// 搜索建议
		//
		this.qsSuggestionsLayer = null;
		this.rawInputQuery = null;           // 输入框中的原始查询
		this.multiEngineSuggestions = [];    // 多个搜索引擎的建议, 每个一个子数组
		this.suggestionCount = 0;            // 多个搜索引擎的实际建议的总数
		this.selectedSuggestionIndex = -1;   // 用户选中的搜索建议项对应的index
		this.maxSuggestionCount = 5;         // 最多建议个数
		this.qsSuggestionItems = [];         // 快搜搜索建议所有item元素(不一定都显示)
		
		// 快搜主窗口背景层
		//
		// 随快搜主窗口一同显示/隐藏, 铺满整个可视窗口. 其作用主要是:
		// 1. 想要实现点击快搜主窗口外面就隐藏快搜主窗口, 但如果点击target是页面中的cross-domain iframe的话,
		//    当前window就不能捕获到该iframe的click事件, 所以覆盖一层作为以便捕获点击事件.
		// 2. 也可以做背景虚化/遮罩效果.
		this.createMainBox=function(){
			
			const self = this;
			
		    const backgroundLayer = document.createElement('div');
		    backgroundLayer.id = 'qs-r025kcjix9vmk1dx2vdxcq45-main-background-layer';
		    backgroundLayer.className = 'qs-r025kcjix9vmk1dx2vdxcq45-main-background-layer';
		    backgroundLayer.style.setProperty('display', 'none', 'important');
			
			const backgroundMascot = document.createElement('div');
			backgroundMascot.className = 'qs-r025kcjix9vmk1dx2vdxcq45-main-background-mascot';
			
			const mascot = document.createElement('img');
			mascot.src='data:image/gif;base64,R0lGODlhaAFoAfd8AGlpaU1NTe3t7ejo6EVFRUlJSVlZWVJSUmVlZeTk5FVVVeDg4F1dXd7e3j09PUFBQdzc3Nra2ubm5uLi4tDQ0MrKytbW1sjIyM3NzTU1NcTExNjY2DAwMM7Ozra2tsbGxrS0tCkpKbi4uC0tLSUlJcDAwDk5OdLS0rq6usLCwiEhIdTU1LGxsY6OjhwcHBgYGKCgoBUVFaysrJ6enqioqJqamqSkpK+vr6qqqrCwsJycnKKioqampr6+vok7QgMDA5aWlpiYmJCQkIyMjISEhIqKipOTk4iIiIaGhhAQEHBwcHh4eHx8fAwMDJSUlIGBgWxsbHR0dP7+/n9/f3p6en5+fgkJCXZ2dmBgYGNjY3Jycm5ubmQrMRoLDAkEBPz8/P39/fv7+/f39/r6+vPz8/n5+fX19fb29vDw8Pj4+Orq6vLy8vT09O7u7vHx8evr6+/v7zwaHgcGBwAAAP///7y8vC0UFnczOlYlKppCS4A3PqBFTpVASW8wNpI/R0cfIv/mXP/++f/51f/87P/52f/jQf/+9f/86P/98P/2wf/2xf/mVf/sgf/paf/lUf/hOv/4zf/3yf/5xP/kSv/wlf/kRv/xoP/1vf/63f/lTf/vkP/iPP/ujP/oYf/1uf/thf/qtP/sff/64f///P/xpf/4uv/jPv/2sf/0rf/6yv/ref/95P/qbf/7tP/84f/teP/ydP/kQf/gOP/kO//0pf/me//mYP/71P/90v/gP//iOf/qif/oS//1nv/rkf/iOv/iO//jOv/jO//ulv/iTP/rc//xiP/40P/oZf/wnf/0tf/qqf/uif/jRf/75f/lPf/sU//wmf/pWv/1zf/iSf/21f/u1v/yqf/mbf/1qv/83f/xrv/gPf/qfv/82v/0ov/xvf/ytv/ndv/0mf/8zP/79f/ywP/kWP/jUP/ysf/56f/67P/pQv/qg//7nv/wbv/smv/15f/ua//xx//06P/twf/miv/z2v/sbf/wuP/78v/38P/9/P/6qv/tZAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0MzNiNDMwYi0yYmYzLWYxNDktYWIxNy1lMjY3NzllYjAzMWUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjI0NTBFMEFFNDIxMTFFQTk3RTFEODgwQUY3REI5NTQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjI0NTBFMDlFNDIxMTFFQTk3RTFEODgwQUY3REI5NTQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDMzYjQzMGItMmJmMy1mMTQ5LWFiMTctZTI2Nzc5ZWIwMzFlIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjQzM2I0MzBiLTJiZjMtZjE0OS1hYjE3LWUyNjc3OWViMDMxZSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgH//v38+/r5+Pf29fTz8vHw7+7t7Ovq6ejn5uXk4+Lh4N/e3dzb2tnY19bV1NPS0dDPzs3My8rJyMfGxcTDwsHAv769vLu6ubi3trW0s7KxsK+urayrqqmop6alpKOioaCfnp2cm5qZmJeWlZSTkpGQj46NjIuKiYiH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';
			const letTip = document.createElement("span");
			letTip.textContent = commonTools.getPlatform()=="mac" ? '快速敲击2次Control键 - 唤起' : "快速敲击2次Ctrl键 - 唤起";
			
			backgroundMascot.appendChild(mascot);
			backgroundMascot.appendChild(letTip);
			
			backgroundLayer.appendChild(backgroundMascot);
		    document.body.appendChild(backgroundLayer);
		
		    //快搜主窗口container
		    const mainBox = document.createElement('div');
		    mainBox.id = 'qs-mainbox';
		    mainBox.className = 'qs-mainbox';
		    mainBox.style.setProperty('display', 'none', 'important');
		    document.body.appendChild(mainBox);
		
		    //整个搜索顶部搜索区域
			const searchOuterBox = document.createElement('div');
			searchOuterBox.className = 'qs-r025kcjix9vmk1dx2vdxcq45-main-search-outer-box';
			searchOuterBox.id = 'qs-r025kcjix9vmk1dx2vdxcq45-main-search-outer-box';
			
			const searchBox = document.createElement('div');
			searchBox.id = 'qs-r025kcjix9vmk1dx2vdxcq45-main-search-box';
			searchBox.className = 'qs-r025kcjix9vmk1dx2vdxcq45-main-search-box';
			
			const platformIcon = document.createElement('div');
			platformIcon.id = 'qs-r025kcjix9vmk1dx2vdxcq45-main-search-box-platform-icon';
			platformIcon.className = 'qs-r025kcjix9vmk1dx2vdxcq45-main-search-box-platform-icon';
			platformIcon.style.opacity = 1;
			if(conf.defaultEngine){
				platformIcon.style.backgroundImage='url('+loadingIcon(conf.defaultEngine.icon)+')';
			}
			
			const switchSearchEngines = document.createElement('div');
			switchSearchEngines.className = 'qs-r025kcjix9vmk1dx2vdxcq45-main-switch-search-engines-box';
			switchSearchEngines.style.setProperty('display', 'none', 'important');
			const searchEngineItems = document.createElement('ul');
			searchEngineItems.className='qs-r025kcjix9vmk1dx2vdxcq45-main-switch-search-engines-items';
			switchSearchEngines.appendChild(searchEngineItems);
			
			const searchInput = document.createElement('input');
			searchInput.id = 'qs-r025kcjix9vmk1dx2vdxcq45-main-search-input';
			searchInput.className = 'qs-r025kcjix9vmk1dx2vdxcq45-main-search-input';
			searchInput.autocomplete = "off";
			if (conf.showPlaceholder) {
			    searchInput.placeholder = `输入关键词，回车开始搜索...`;
			}
			
			const inputClearBtn = document.createElement('div');
			inputClearBtn.className = 'qs-r025kcjix9vmk1dx2vdxcq45-main-search-box-clear-btn';
			inputClearBtn.title = 'Clear input content';
			const clearImage = document.createElement('img');
			clearImage.src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAf9JREFUWEe1lzGvgjAQx+ng0OTpzhsYX2Qy0be7uvA19DPJJ2H1A0DihHF00F1fwsDAyzWUFGiv14osGtre/e7fu/ZggcNzuVzmTdOEypJ5+/8Fv1VV/cHver2+U80yysSiKL4556pj67Kqqh4UEBTAx/GQzAZiBCjL8icIAimxNWLLhFccx1fdnBGAss9TOe/8Msauy+VS5It8RgBlWW7eDRdZP1KiBzCx7CaOHkQHMEXCUZVTE7MD+LD0I7Y4jnN4KQCw6M/n8+Z2ux1ns1kehmG6Wq3EQtMj58N4FEUH03ypggDAoj+dTvvn87mXDjGjqnMbAIyDCoyy91mWHeu67qpDBzF0DortdrsDphaUJQkAjGAQPs5bsBdzKT0dBBiCHJGRUiJXVHED0CmhSuzoHJYKAOeTb6gEWPJwLti9AIZ7Tsl4UzI65QAY0TmnlKgBwC0HdNkOhm0lipQiHQArNco5oYOA05C19z80H6Tj1ZRwPhACwHYUuxwyQ4gkSX6xwMRRDBMolxG11FSIxWKRbrfb1CQ/NK2k6xiMcs5zk7GhAwmBXVy969imAiajz5i2IWlzYcpO2MSmb8nkbJfLySd6Kb1ca2rL0bL0cSwuHsYe1rb8Q0rQP0zU6Cjdkk0N70+zd0Fsjo05gEUEisA45/yrndf7PId3un3GbP4D4KyAlD6sT3UAAAAASUVORK5CYII=';
			clearImage.style.width='100%';
			inputClearBtn.appendChild(clearImage);
			
			
			searchBox.appendChild(platformIcon);
			searchBox.appendChild(searchInput);
			searchBox.appendChild(inputClearBtn);
			
			searchOuterBox.appendChild(searchBox);
			searchOuterBox.appendChild(switchSearchEngines);
			
			mainBox.appendChild(searchOuterBox);
			
			//生成默认搜索引擎选择项
			if (conf.classifiedEngines) {
				conf.classifiedEngines.find((obj) => obj.ident=='search-engines').engines.forEach((engine, index) => {
					const li = document.createElement('li');
					const icon = document.createElement('img');
					icon.src = loadingIcon(engine.icon);
					const span = document.createElement('span');
					span.textContent = engine.name
					li.appendChild(icon);
					li.appendChild(span);
					li.addEventListener('click',(e)=>{
						platformIcon.style.backgroundImage='url('+loadingIcon(engine.icon)+')';
						conf.defaultEngine = engine;
						GM_setValue(STORAGE_KEY.conf, conf);
					}, false);
					searchEngineItems.appendChild(li);
				});
			}
		
			//切换默认搜索引擎
			const showOrHideSwitchSearchEngines=()=>{
				if(switchSearchEngines.style.display.indexOf('none')!=-1){
					switchSearchEngines.style.setProperty('display', 'block', 'important');
				}else{
					switchSearchEngines.style.setProperty('display', 'none', 'important');
				}
			}
			platformIcon.addEventListener('click', (e)=>{
				showOrHideSwitchSearchEngines();
			});
			
			//搜索框事件监听
			searchInput.addEventListener('keydown', (e)=> {
			    if (e.keyCode == 13) {  // 回车键
			        openEngineOnClickMainBox(conf.defaultEngine, e);
			    }
			},false);
			searchInput.addEventListener('focus',(e)=>{
			  searchBox.style.setProperty('border-color', '#4E71F2', 'important');
			});
			searchInput.addEventListener('blur', (e)=>{
			  searchBox.style.setProperty('border-color', '#C4C7CE', 'important');
			});
			
			//清除input内容按钮
			inputClearBtn.addEventListener('click',()=>{
				searchInput.value='';
				this.hideInputClearBtn();
			});
		
		    // 常用搜索引擎
		    if (conf.showFrequentEngines) {
		        var frequentBox = document.createElement('div');
		        frequentBox.id = 'qs-r025kcjix9vmk1dx2vdxcq45-main-frequent-box';
		        frequentBox.className = 'qs-r025kcjix9vmk1dx2vdxcq45-main-frequent-box';
		        mainBox.appendChild(frequentBox);
		        conf.frequentEngines.forEach((engine, index) => {
		            if (!engine.enable) return; // 此处return搭配forEach, 请勿改为其他形式循环
		            var icon = document.createElement('img');
		            icon.id = 'qs-r025kcjix9vmk1dx2vdxcq45-main-frequent-icon-' + index;
		            icon.className = 'qs-r025kcjix9vmk1dx2vdxcq45-main-frequent-icon';
		            icon.src = loadingIcon(engine.icon);
		            icon.addEventListener('click', (e)=>{
		                openEngineOnClickMainBox(engine, e);
		            }, false);
		            frequentBox.appendChild(icon);
		        });
		    }
			
			//点击外部影藏默认搜索引擎选择项框
			mainBox.addEventListener("click",(e)=>{
				if(!event.target.closest('#qs-r025kcjix9vmk1dx2vdxcq45-main-search-box-platform-icon')) {
					switchSearchEngines.style.setProperty('display', 'none', 'important');
				}
			});
		
		    // 分类搜索引擎
		    if (conf.showClassifiedEngines) {
		        var classifiedBox = document.createElement('div');
		        classifiedBox.id = 'qs-r025kcjix9vmk1dx2vdxcq45-main-classified-box';
		        classifiedBox.className = 'qs-r025kcjix9vmk1dx2vdxcq45-main-classified-box';
		        mainBox.appendChild(classifiedBox);
		        conf.classifiedEngines.forEach((family, fIndex) => {
		            if (!family.enable) return; // 此处return搭配forEach, 请勿改为其他形式循环
		            // 一个分类一列
		            var familyBox = document.createElement('div');
		            familyBox.id = 'qs-r025kcjix9vmk1dx2vdxcq45-main-classified-family-box-' + fIndex;
		            familyBox.className = 'qs-r025kcjix9vmk1dx2vdxcq45-main-classified-family-box';
		            classifiedBox.appendChild(familyBox);
		            // 分类标题
		            var familyTitle = document.createElement('div');
		            familyTitle.id = 'qs-r025kcjix9vmk1dx2vdxcq45-main-classified-family-title-' + fIndex;
		            familyTitle.className = 'qs-r025kcjix9vmk1dx2vdxcq45-main-classified-family-title';
		            familyTitle.textContent = family.name;
		            familyBox.appendChild(familyTitle);
		            family.engines.forEach((engine, eIndex) => {
		                if (!engine.enable) return; // 此处return搭配forEach, 请勿改为其他形式循环
		                // 搜索引擎
		                var engineBox = document.createElement('div');
		                engineBox.id = 'qs-r025kcjix9vmk1dx2vdxcq45-main-classified-family-engine-' + fIndex + '-' + eIndex;
		                engineBox.className = 'qs-r025kcjix9vmk1dx2vdxcq45-main-classified-family-engine';
		                engineBox.addEventListener('click', (e)=> {
		                    openEngineOnClickMainBox(engine, e);
		                }, false);
		                familyBox.appendChild(engineBox);
		                // 搜索引擎icon
		                var engineIcon = document.createElement('img');
		                engineIcon.id = 'qs-r025kcjix9vmk1dx2vdxcq45-main-classified-family-engine-icon-' + fIndex + '-' + eIndex;
		                engineIcon.className = 'qs-r025kcjix9vmk1dx2vdxcq45-main-classified-family-engine-icon';
		                engineIcon.src = loadingIcon(engine.icon);
		                engineBox.appendChild(engineIcon);
						
		                // 搜索引擎name
		                var engineName = document.createElement('span');
		                engineName.id = 'qs-r025kcjix9vmk1dx2vdxcq45-main-classified-family-engine-name-' + fIndex + '-' + eIndex;
		                engineName.className = 'qs-r025kcjix9vmk1dx2vdxcq45-main-classified-family-engine-name';
		                engineName.textContent = engine.name;
		                engineBox.appendChild(engineName);
		            });
		        });
		    }
		
		    // 帮助信息
		    var helpInfoBox = document.createElement('div');
		    helpInfoBox.id = 'qs-r025kcjix9vmk1dx2vdxcq45-main-help-info-box';
		    helpInfoBox.className = 'qs-r025kcjix9vmk1dx2vdxcq45-main-help-info-box';
		    mainBox.appendChild(helpInfoBox);
			
		    // 主页
		    var homeLink = document.createElement('a');
		    homeLink.id = 'qs-r025kcjix9vmk1dx2vdxcq45-main-help-info-home';
		    homeLink.className = 'qs-r025kcjix9vmk1dx2vdxcq45-main-help-info-item';
		    homeLink.textContent = '主页';
		    homeLink.href = 'https://github.com/Xanthella/OnestepSearch';
		    homeLink.target = '_blank';
		    helpInfoBox.appendChild(homeLink);
			
		    // 帮助
		    var helpLink = document.createElement('a');
		    helpLink.id = 'qs-r025kcjix9vmk1dx2vdxcq45-main-help-info-help';
		    helpLink.className = 'qs-r025kcjix9vmk1dx2vdxcq45-main-help-info-item';
		    helpLink.textContent = '帮助';
		    helpLink.href = 'https://github.com/Xanthella/OnestepSearch/blob/main/README.md';
		    helpLink.target = '_blank';
		    helpInfoBox.appendChild(helpLink);
								
		    this.qsBackgroundLayer = backgroundLayer;
		    this.qsMainBox = mainBox;
		    this.qsSearchInput = searchInput;
			this.qsInputClearBtn = inputClearBtn;
		};
		
		// 快搜主窗口是否处于显示状态
		this.isMainBoxVisual=function(){
			return this.qsMainBox.style.display == 'block';
		};
		
		// 显示快搜主窗口.
		// 可选输入text为没有经过URI编码的明文文本, 该参数一般在iframe发来消息时使用.
		// 快搜主窗口中搜索框的文本优先级: 参数指定文本 > 网页选中文本 > 搜索框已有文本 > 当前页面搜索词
		this.showMainBox = function(text){
		
		    ensureQuickSearchAlive();
		
		    // 快搜主窗口在iframe中不显示
		    if (this.isMainBoxVisual() || window.self != window.top) {
		        return;
		    }
			const {qsSearchInput, qsBackgroundLayer, qsMainBox} = this;
		
		    // 设置搜索框内容
		    var query = text;
		    if (!query) {
		        query = commonTools.getSelection();
		    }
		    if (!query) {
		        query = qsSearchInput.value.trim();
		    }
		    if (!query) {
		        query = getUrlQuery();
		    }
			
		    qsSearchInput.value = query;
		    qsBackgroundLayer.style.setProperty('display', 'block', 'important');
		    qsMainBox.style.setProperty('display', 'block', 'important');
					
			if(query){
				this.showInputClearBtn();
				//初始化不执行输入提示词
				//this.triggerSuggestions(query);
			}
			
		    // 隐藏划词工具条
		    if (selectionToolbar.isToolbarVisual()) {
		        selectionToolbar.hideToolbar();
		    }
			
			// 选中搜索框文本
			qsSearchInput.select();
			//延迟处理这样能更加准确的获得焦点
			setTimeout(()=>{
				qsSearchInput.focus();
			},599);
		};
		
		// 隐藏快搜主窗口
		this.hideMainBox=function(){
			this.destroySuggestions();
			this.qsBackgroundLayer.style.setProperty('display', 'none', 'important');
			this.qsMainBox.style.setProperty('display', 'none', 'important');
		};
		
		this.showInputClearBtn=function(){
			this.qsInputClearBtn.style.setProperty('display','block', 'important');
		};
		
		this.hideInputClearBtn=function(){
			this.qsInputClearBtn.style.setProperty('display','none', 'important');
		};
		
		
		/**
		 * 以下是搜索建议功能
		 */
				
	    // 创建搜索建议浮层
	    this.createSuggestionsLayer=function() {
	        if (this.maxSuggestionCount == 0) {
	            return;
	        }
			
			const self = this;
			const {qsSearchInput, qsInputClearBtn} = this;
	
	        // 搜索建议浮层
	        var suggestionsLayer = document.createElement('div');
	        suggestionsLayer.id = 'qs-suggestions-layer';
	        suggestionsLayer.className = 'qs-suggestions-layer';
	        suggestionsLayer.style.setProperty('display', 'none', 'important');
	        document.body.appendChild(suggestionsLayer);
	
	        // 搜索建议条目
	        for (var i = 0; i < this.maxSuggestionCount; i++) {
	            var suggestionItem = document.createElement('div');
	            suggestionItem.id = 'qs-suggestion-item-' + i;
	            suggestionItem.className = 'qs-suggestion-item';
	            suggestionItem.addEventListener('click', function (e) {
	                qsSearchInput.value = this.textContent;
	                openEngineOnClickMainBox(conf.defaultEngine, e);
	            }, true);
	            suggestionsLayer.appendChild(suggestionItem);
	            this.qsSuggestionItems.push(suggestionItem);
	        }
	
	        // 向搜索框添加响应函数
	        qsSearchInput.addEventListener('input', function (e) {
	            var query = qsSearchInput.value.trim();
	            if (query) {
	                self.triggerSuggestions(query);
					self.showInputClearBtn();
	            } else {
	                self.destroySuggestions();
					self.hideInputClearBtn();
	            }
	        }, true);
	        qsSearchInput.addEventListener('mousedown', function (e) {
	            var query = qsSearchInput.value.trim();
	            if (query) {
	                self.triggerSuggestions(query);
	            }
	        }, true);
	        qsSearchInput.addEventListener('keydown', function (e) {
	            if (e.code == 'ArrowDown' && self.isSuggestionsLayerVisual()) {
	                e.preventDefault();
	                self.selectSuggestionItem(self.selectedSuggestionIndex + 1);
	                return;
	            }
	            if (e.code == 'ArrowUp' && self.isSuggestionsLayerVisual()) {
	                e.preventDefault();
	                self.selectSuggestionItem(self.selectedSuggestionIndex - 1);
	                return;
	            }
	            if (e.code == 'Tab' && self.isSuggestionsLayerVisual()) {
	                e.preventDefault();
	                if (e.shiftKey) {
	                    self.selectSuggestionItem(self.selectedSuggestionIndex - 1);
	                } else {
	                    self.selectSuggestionItem(self.selectedSuggestionIndex + 1);
	                }
	                return;
	            }
	        }, true);
	        this.qsSuggestionsLayer = suggestionsLayer;
	    };
		
	    // 判断搜索建议浮层是否显示
	    this.isSuggestionsLayerVisual=function() {
	        return this.qsSuggestionsLayer && this.qsSuggestionsLayer.style.display == 'block';
	    }
	
	    // 显示搜索建议浮层
	    this._showSuggestionsLayer=function() {
	        if (!this.qsSuggestionsLayer || this.isSuggestionsLayerVisual()) {
	            return;
	        }
	        var inputPos = this.qsSearchInput.parentNode.getBoundingClientRect();
	        var top = inputPos.bottom + 'px';
	        var left = inputPos.left + 'px';
	        var width = (inputPos.right - inputPos.left) + 'px';
	        this.qsSuggestionsLayer.style.setProperty('top', top, 'important');
	        this.qsSuggestionsLayer.style.setProperty('left', left, 'important');
	        this.qsSuggestionsLayer.style.setProperty('width', width, 'important');
			this.qsSuggestionsLayer.style.setProperty('opacity', 1, 'important');
	        this.qsSuggestionsLayer.style.setProperty('display', 'block', 'important');
	    };
	
	    // 隐藏搜索建议浮层
	    this._hideSuggestionsLayer=function() {
	        if (this.qsSuggestionsLayer) {
	            this.qsSuggestionsLayer.style.setProperty('display', 'none', 'important');
	        }
	    };
		
	    //
	    // 请求百度搜索建议
		// 油猴脚本的GM_xmlhttpRequest可以直接跨域请求, 不受同源策略限制, 这样就不用通过jQuery来发送jsonp请求了.
	    //
	    this.requestBaiduSuggestions=function(query, index, count) {
			const self = this;
			const baiduSuggestionUrl = {
			    'http:': 'http://suggestion.baidu.com/su?wd=%s&cb=',
			    'https:': 'https://suggestion.baidu.com/su?wd=%s&cb=',
			}[window.location.protocol];
	        var url = baiduSuggestionUrl.replace('%s', encodeURIComponent(query));
			
	        GM_xmlhttpRequest({
	            method: 'GET',
	            url: url,
	            timeout: 3000,
	            onload: response => {
	                if (response.status == 200) {
	                    let responseText = response.responseText;
						responseText = responseText.slice(1, -2);
						responseText = responseText.replace(/([\w]+)\s*:/g, '"$1":');
						self.multiEngineSuggestions[index] = JSON.parse(responseText).s.slice(0, count);
						self.loadSuggestions();
	                } else {
	                    console.log(`Quick Search: Baidu Suggestions: code ${response.status}`);
	                }
	            }
	        });
	    };
		
		
		// 选中搜索建议项
		this.selectSuggestionItem=function(newSelectedIndex) {
			const {qsSearchInput, rawInputQuery, qsSuggestionItems, suggestionCount} = this;
			
			if (qsSuggestionItems[this.selectedSuggestionIndex]) {
				qsSuggestionItems[this.selectedSuggestionIndex].className = 'qs-suggestion-item';
			}
			this.selectedSuggestionIndex = newSelectedIndex;
			this.selectedSuggestionIndex = this.selectedSuggestionIndex < -1 ? suggestionCount - 1 : this.selectedSuggestionIndex;
			this.selectedSuggestionIndex = this.selectedSuggestionIndex >= suggestionCount ? -1 : this.selectedSuggestionIndex;
			if (this.selectedSuggestionIndex == -1) {
				qsSearchInput.value = rawInputQuery;
			} else {
				qsSearchInput.value = qsSuggestionItems[this.selectedSuggestionIndex].textContent;
				qsSuggestionItems[this.selectedSuggestionIndex].className = 'qs-suggestion-item-selected';
			}
		};
		
	    // 触发搜索建议
	    this.triggerSuggestions=function(query) {
	        this.rawInputQuery = query;
	        if (this.selectedSuggestionIndex != -1) {
	            this.selectSuggestionItem(-1);
	        }
			this.requestBaiduSuggestions(query, 0, 5);
	    };
		
	    // 装载搜索建议
	    this.loadSuggestions=function(){
	        // 由于装载是异步延迟的, 若用户已经删光了输入框内容, 则不显示搜索建议
			const {qsSearchInput, multiEngineSuggestions, qsSuggestionItems} = this;
	        if (!qsSearchInput.value.trim()) {
	            this.destroySuggestions();
	            return;
	        }
			
	        // 多个搜索引擎的建议合并并去重
	        var allSuggestions = multiEngineSuggestions.flat(1).filter((x, i, a) => a.indexOf(x) == i);
	        this.suggestionCount = allSuggestions.length;
	        allSuggestions.forEach((suggestion, i) => {
	            qsSuggestionItems[i].textContent = suggestion;
	            qsSuggestionItems[i].style.setProperty('display', 'block', 'important');
	        });
	        for (var i = allSuggestions.length; i < qsSuggestionItems.length; i++) {
	            qsSuggestionItems[i].style.setProperty('display', 'none', 'important');
	        }
	        if (!this.isSuggestionsLayerVisual()) {
	            this._showSuggestionsLayer();
	        }
	    };
		
		// 销毁搜索建议
		this.destroySuggestions=function() {
			this._hideSuggestionsLayer();
			this.rawInputQuery = null;
			this.multiEngineSuggestions = [];
			this.suggestionCount = 0;
			this.selectedSuggestionIndex = -1;
		}
	}

	
	/**
	 * 划词工具条对象
	 * @param {*} conf 
	 */
	function SelectionToolbar(commonTools, conf){
		this.toolbar = null;
		
		this.createToolbar = function(){
			
		    // 工具条container
		    var toolbar = document.createElement('div');
		    toolbar.id = 'qs-toolbar';
		    toolbar.className = 'qs-toolbar';
		    toolbar.style.setProperty('display', 'none', 'important');
		    document.body.appendChild(toolbar);
		
		    // 常用搜索引擎按钮
		    conf.frequentEngines.forEach((engine, index) => {
		        if (!engine.enable) return; // 此处return搭配forEach, 请勿改为其他形式循环
		        var icon = document.createElement('img');
		        icon.id = 'qs-toolbar-icon-' + index;
		        icon.className = 'qs-toolbar-icon';
		        icon.src = loadingIcon(engine.icon);
		        icon.addEventListener('click', function (e) {
		            openEngineOnClickToolbar(engine, e);
		        }, false);
		        toolbar.appendChild(icon);
		    });
		
		    // 直达网址按钮
		    var icon = document.createElement('img');
		    icon.id = 'qs-toolbar-icon-url';
		    icon.className = 'qs-toolbar-icon';
		    icon.src = 'data:image/x-icon;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFxcXABcXFwAXFxcAFxcXE1cXFzIXFxc81xcXN1cXFx0XFxcCVxcXABcXFwAXFxcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABcXFwAXFxcAFxcXABcXFxXXFxc51xcXMpcXFyLXFxcsVxcXPFcXFyHXFxcCFxcXABcXFwAXFxcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXFxcAFxcXABcXFwAXFxcWFxcXOxcXFytXFxcGlxcXABcXFwIXFxcfVxcXPRcXFyJXFxcCFxcXABcXFwAXFxcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABcXFwAXFxcAFxcXFhcXFzsXFxcrVxcXBZcXFwAXFxcAFxcXABcXFwFXFxcfFxcXPRcXFyJXFxcCFxcXABcXFwAXFxcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFxcXABcXFxXXFxc7FxcXK1cXFwWXFxcAFxcXABcXFwAXFxcAFxcXABcXFwFXFxcfFxcXPRcXFyJXFxcCFxcXABcXFwAXFxcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXFxcUVxcXOhcXFytXFxcFlxcXABcXFwAXFxcAFxcXABcXFwAXFxcAFxcXABcXFwFXFxcfFxcXPRcXFyJXFxcCFxcXABcXFwAXFxcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABcXFzQXFxcxlxcXBlcXFwAXFxcAFxcXABcXFwCXFxcFVxcXARcXFwAXFxcAFxcXABcXFwFXFxce1xcXPRcXFyKXFxcCFxcXABcXFwAXFxcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFxcXPtcXFyAXFxcAFxcXABcXFwAXFxcAFxcXBpcXFzAXFxcelxcXAVcXFwAXFxcAFxcXABcXFwFXFxce1xcXPRcXFyKXFxcCVxcXABcXFwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXFxc6lxcXKNcXFwDXFxcAFxcXABcXFwAXFxcB1xcXIpcXFz0XFxce1xcXARcXFwAXFxcAFxcXABcXFwFXFxce1xcXPRcXFx9XFxcAlxcXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABcXFyGXFxc8VxcXGxcXFwBXFxcAFxcXABcXFwAXFxcCVxcXIpcXFz0XFxce1xcXARcXFwAXFxcAFxcXABcXFwEXFxcj1xcXOZcXFwpXFxcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFxcXA9cXFyYXFxc8lxcXGxcXFwCXFxcAFxcXABcXFwAXFxcCFxcXIpcXFz0XFxce1xcXAVcXFwAXFxcAFxcXABcXFw8XFxc8FxcXE1cXFwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXFxcAFxcXA1cXFyZXFxc8lxcXGxcXFwCXFxcAFxcXABcXFwAXFxcCFxcXIpcXFz0XFxce1xcXAVcXFwAXFxcAFxcXF1cXFzwXFxcPVxcXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABcXFwAXFxcAFxcXA5cXFyZXFxc8lxcXGxcXFwCXFxcAFxcXABcXFwAXFxcCFxcXIpcXFz0XFxce1xcXARcXFwOXFxcxVxcXLlcXFwOXFxcAFxcXABcXFwAXFxcAFxcXABcXFwAXFxcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFxcXABcXFwAXFxcAFxcXA1cXFyZXFxc8lxcXGxcXFwCXFxcAFxcXABcXFwAXFxcCFxcXIpcXFz0XFxce1xcXAtcXFxRXFxcKVxc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XG5cXFwCXFxcAFxcXABcXFwAXFxcAFxcXABcXFwXXFxcrlxcXOxcXFxXXFxcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFxcXABcXFwAXFxcAFxcXA1cXFyXXFxc8lxcXG5cXFwCXFxcAFxcXABcXFwAXFxcF1xcXK5cXFzsXFxcV1xcXABcXFwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFxcXABcXFwAXFxcAFxcXA1cXFyXXFxc8lxcXG9cXFwEXFxcAFxcXBlcXFyuXFxc61xcXFdcXFwAXFxcAFxcXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFxcXABcXFwAXFxcAFxcXA1cXFyVXFxc8VxcXKZcXFyCXFxcyFxcXOhcXFxWXFxcAFxcXABcXFwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFxcXABcXFwAXFxcAFxcXA5cXFyDXFxc51xcXPlcXFzNXFxcT1xcXABcXFwAXFxcAAAAAAAAAAAAwAP//4AB//8AAP//AAB//wAAP/8AAB//AAAP/wAAD/8AAA//AAAP/wAAD/8AAA//AAAAPwAAAB+AAAAPwAAAB+AAAAPwAAAB+AAAAPwAAAD/8AAA//AAAP/wAAD/8AAA//AAAP/wAAD/+AAA//wAAP/+AAD//wAA//+AAf//wAM=';
		    icon.addEventListener('click', function (e) {
		        openUrl(getUrl().url, e);
		    }, false);
		    toolbar.appendChild(icon);
		
		    // 更多按钮
		    var icon = document.createElement('img');
		    icon.id = 'qs-toolbar-icon-more';
		    icon.className = 'qs-toolbar-icon';
		    icon.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAMAAADDpiTIAAABYmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgIHRpZmY6T3JpZW50YXRpb249IjYiLz4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+Cjw/eHBhY2tldCBlbmQ9InIiPz7UGE7IAAACClBMVEX///9VYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBzg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79VYIBzg79VYIBzg79zg79VYIBzg79zg79zg79VYIBVYIBVYIBzg79VYIBVYIBzg79VYIBVYIBzg79z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';
		    icon.addEventListener('click', function (e) {
		        quickSearch.showMainBox();
		        selectionToolbar.hideToolbar();
		    }, false);
		    toolbar.appendChild(icon);
			this.toolbar = toolbar;
		};
		// 划词工具条是否处于显示状态
		this.isToolbarVisual = function(){
		    return this.toolbar && this.toolbar.style.display == 'block';
		};
		
		this.showToolbar = function(event){
			
			ensureQuickSearchAlive();
		
			if (this.isToolbarVisual()) {
				return;
			}
			const toolbar = this.toolbar;
		
			toolbar.style.setProperty('top', '-10000px', 'important');
			toolbar.style.setProperty('left', '-10000px', 'important');
			toolbar.style.setProperty('display', 'block', 'important');
		
			var toolbarClientRect = toolbar.getBoundingClientRect();
			var toolbarWidth = toolbarClientRect.right - toolbarClientRect.left;
			var toolbarHeight = toolbarClientRect.bottom - toolbarClientRect.top;
		
			var toolbarNewTop = event.pageY + 15;
			var toolbarNewLeft = event.pageX - (toolbarWidth / 2);
			var windowPos = commonTools.getWindowPosition();
			if (toolbarNewTop + toolbarHeight > windowPos.bottom) {
				toolbarNewTop = event.pageY - toolbarHeight - 15;
			}
			if (toolbarNewLeft < windowPos.left) {
				toolbarNewLeft = windowPos.left;
			} else if (toolbarNewLeft + toolbarWidth > windowPos.right) {
				toolbarNewLeft = windowPos.right - toolbarWidth;
			}
		
			toolbar.style.setProperty('top', toolbarNewTop + 'px', 'important');
			toolbar.style.setProperty('left', toolbarNewLeft + 'px', 'important');
		};
		
		// 隐藏划词工具条
		this.hideToolbar = function(){
			if (this.toolbar) {
			    this.toolbar.style.setProperty('display', 'none', 'important');
			}
		}
	}
	
	
	/**
	 * @param {*} commonTools 
	 * 右下提示tips
	 */
	function InfoTips(commonTools){
		this.qsInfoTipsLayer = null;
		this.idOfSettimeout = null;
		
		// 创建信息提示浮层
		this.createInfoTipsLayer = function(){
			var infoTipsLayer = document.createElement('div');
			infoTipsLayer.id = 'qs-info-tips-layer';
			infoTipsLayer.className = 'qs-info-tips-layer';
			infoTipsLayer.style.setProperty('display', 'none', 'important');
			document.body.appendChild(infoTipsLayer);
			
			this.qsInfoTipsLayer = infoTipsLayer;
		};
		
		// 显示信息提示浮层
		this.showInfoTipsLayer = function(info, delay=2000){
			this.qsInfoTipsLayer.textContent = 'Onestep: ' + info;
			this.qsInfoTipsLayer.style.setProperty('display', 'block', 'important');
			if (this.idOfSettimeout) {
				clearTimeout(this.idOfSettimeout);
			}
			this.idOfSettimeout = setTimeout(()=>{
				this.qsInfoTipsLayer.style.setProperty('display', 'none', 'important');
			}, delay);
			
		}
	}
	
	// 初始化需要的对象 ps:只初始化一次
	const commonTools = new CommonTools(conf);
	const infoTips = new InfoTips(commonTools);
	const selectionToolbar = new SelectionToolbar(commonTools, conf);
	const setting = new Setting(commonTools, conf);
	const quickSearch = new QuickSearch(commonTools, conf);
	
    // 获取当前页面匹配的 搜索引擎 及 其在同类别的搜索引擎列表中的索引 及 同类别的搜索引擎列表.
    //
    // TODO 目前只是简单地匹配域名, 待完善.
    function getMatchedEngineInfo() {
        var hostname = window.location.hostname;
        hostname = hostname.replace(/^(www\.)/, '');

        // 因为想要在循环中返回最终结果, 因此不能使用forEach语法
        for (var classEngines of conf.classifiedEngines) {
            for (var i = 0; i < classEngines.engines.length; i++) {
                var engine = classEngines.engines[i];
                var engineHostname = new URL(engine.url).hostname;
                engineHostname = engineHostname.replace(/^(www\.)/, '');
                if (hostname == engineHostname) {
                    return {
                        engine: engine,
                        index: i,
                        classEngines: classEngines
                    };
                }
            }
        }
        return null;
    }

    // 获取搜索引擎url中query的key
    function getUrlQueryKey(engine) {
        var params = new URL(engine.url).searchParams;
        for (var param of params) {
            if (param[1].includes('%s')) {
                return param[0];
            }
        }
        return null;
    }

    // 移除url中的domain(protocol+host)
    function removeUrlDomain(url) {
        var u = new URL(url);
        var domain = `${u.protocol}//${u.host}`;
        return url.substring(domain.length);
    }

    // 获取当前页面url中的搜索词.
    // 返回值为经过URI解码的明文文本.
    //
    // 如果当前页面在配置的搜索引擎列表中, 尝试从url中解析参数, 分为engine.url中含有问号(?)和不含问号(?)两种情况.
    // 如果没有解析到或者当前页面不在配置的搜索引擎列表中, 尝试获取文本(纯数字除外)在url中完整出现的input/textarea的值.
    // 如果还是没有, 则认为当前页面url中没有搜索词.
    function getUrlQuery() {
        var urlTail = removeUrlDomain(window.location.href);
        var engineInfo = getMatchedEngineInfo();
        var engine = engineInfo ? engineInfo.engine : null;

        // 尝试利用配置的搜索引擎信息从url中获取搜索词
        if (engine && engine.url.includes('%s')) {
            if (engine.url.includes('?')) {    // engine.url中含有问号(?)
                var queryKey = getUrlQueryKey(engine);
                var params = new URLSearchParams(window.location.search);
                var query = params.get(queryKey);
                if (query) {
                    console.log(`Quick Search: get query by URL-KV, engine is ${engine.url}`);
                    return query;   // URLSearchParams已经decode过了
                }
            } else {    // engine.url中没有问号(?)
                var parts = removeUrlDomain(engine.url).split('%s');
                if (parts.length == 2 && urlTail.startsWith(parts[0]) && urlTail.endsWith(parts[1])) {
                    var query = urlTail.substring(parts[0].length, urlTail.length - parts[1].length);
                    var index = query.search(/[\/\?\=\&\#]/);   // 是否含有 / ? = & #
                    if (index != -1) {
                        query = query.substring(0, index);
                    }
                    if (query) {
                        console.log(`Quick Search: get query by URL-PART, engine is ${engine.url}`);
                        return decodeURIComponent(query);
                    }
                }
            }
        }

        // 尝试获取文本(纯数字除外)在url中完整出现的input/textarea的值
        var eles = document.querySelectorAll('input, textarea');
        for (var ele of eles) {
            if (commonTools.isVisualOnPage(ele) && !quickSearch.qsMainBox.contains(ele) && !setting.qsSettingBox.contains(ele)) {
                var eleValue = ele.value.trim();
                if (eleValue && !/^\d+$/.test(eleValue)) {
                    var encodedEleValue = encodeURIComponent(eleValue);
                    var index = urlTail.indexOf(encodedEleValue);
                    if (index != -1) {
                        var leftChar = urlTail[index - 1];
                        var rightChar = urlTail[index + encodedEleValue.length];
                        if ((!leftChar || /[\/\=\#]/.test(leftChar))
                            && (!rightChar || /[\/\?\&\#]/.test(rightChar))) {
                            console.log(`Quick Search: get query by ${ele.tagName}[id='${ele.id}'], engine is ${engine ? engine.url : 'NULL'}`);
                            return eleValue;
                        }
                    }
                }
            }
        }

        console.log(`Quick Search: query is NULL, engine is ${engine ? engine.url : 'NULL'}`);
        return null;
    }

    // 判断是否允许工具条
    function isAllowToolbar(event) {
        var target = event.target;
        if (!conf.showToolbar || qsPageLock) {
            return false;
        }
        if (!conf.enableOnInput && (target.tagName == 'INPUT' || target.tagName == 'TEXTAREA')) {
            return false;
        }
        if (quickSearch.qsMainBox && quickSearch.qsMainBox.contains(target)
            || setting.qsSettingBox && setting.qsSettingBox.contains(target)) {
            return false;
        }
        return true;
    }

    // 判断是否允许响应当前按键
    // 默认只响应: 单字符的Escape / Alt+单字符 / Cmd/Ctrl+Alt+单字符
    function isAllowHotkey(event) {
        var target = event.target;
        if (!qsPageLock && event.code == 'Escape') {
            return true;
        }
        if (!event.altKey) {
            return false;
        }
        if (event.shiftKey) {
            return false;
        }
        if (qsPageLock && event.code != 'KeyL') {
            return false;
        }
        if ((target.tagName == 'INPUT' || target.tagName == 'TEXTAREA') && !conf.enableOnInput) {
            return false;
        }
        if (setting.qsSettingBox && setting.qsSettingBox.contains(target)) {
            return false;
        }
        return true;
    }

    // 获取搜索引擎主页url
    function getEngineHome(engine) {
        if (engine.home) {
            return engine.home;
        } else {
            var url = new URL(engine.url);
            return `${url.protocol}//${url.hostname}/`;
        }
    }

    // 获取直达的网址. 网址优先级: 搜索框已有网址(若快搜主窗口可见) > 网页中选中网址
    // 返回 网址 及 网址来源
    function getUrl() {
        var url, source;

        if (quickSearch.isMainBoxVisual()) {
            url = quickSearch.qsSearchInput.value.trim();
            source = 'mainbox';
        } else {
            url = commonTools.getSelection();
            source = 'selection';
        }

        // 补全网址
        if (url && !url.includes('://')) {
            var dotCount = (url.match(/\./g) || []).length;
            if (dotCount == 0) {
                url = 'www.' + url + '.com';
            } else if (dotCount == 1) {
                url = 'www.' + url;
            }
            url = 'http://' + url;
        }

        if (!url) {
            source = null;
        }
        return {
            url: url,
            source: source
        };
    }

    // 获取搜索词. 文本优先级: 搜索框已有文本(若快搜主窗口可见) > 网页中选中文本 > 当前页面搜索词
    // 返回 搜索词 及 搜索词来源
    function getQuery() {
        var query, source;

        if (quickSearch.isMainBoxVisual()) {
            query = quickSearch.qsSearchInput.value.trim();
            source = 'mainbox';
        } else {
            query = commonTools.getSelection();
            source = 'selection';
            if (!query) {
                query = getUrlQuery();
                source = 'url';
            }
        }

        if (!query) {
            source = null;
        }
        return {
            query: query,
            source: source
        };
    }

    // 打开url.
    // 当按下Cmd(Mac系统)/Ctrl(Windows/Linux系统), 则后台打开url.
    function openUrl(url, event) {
        // console.log(`Quick Search: open url, url is ${url}`);
        if (!url) return;
        if (event.metaKey || event.ctrlKey) {
            GM_openInTab(url, true);
        } else {
            GM_openInTab(url, false);
        }
    }

    // 打开engine搜索结果或engine主页.
    function openEngine(engine, query, event) {
        // console.log(`Quick Search: open engine, engine is ${engine.url}, query is ${query}`);
        if (!engine) return;
        if (query) {
            var url = engine.url.replace('%s', encodeURIComponent(query));
            openUrl(url, event);
        } else {
            openUrl(getEngineHome(engine), event);
        }
    }

    // 快捷键搜索.
    // 同样, 当query为空时打开引擎主页, 否则正常搜索.
    function openEngineOnKey(engine, query, event) {
        openEngine(engine, query, event);
    }

    // 点击搜索引擎.
    // 当按下Alt, 则忽略查询词打开引擎主页, 否则正常搜索.
    function openEngineOnClick(engine, query, event) {
        if (event.altKey) {
            openEngine(engine, null, event);
        } else {
            openEngine(engine, query, event);
        }
    }

    // 点击划词工具条搜索引擎.
    function openEngineOnClickToolbar(engine, event) {
        var query = commonTools.getSelection();
        openEngineOnClick(engine, query, event);
    }

    // 点击快搜主窗口搜索引擎.
    function openEngineOnClickMainBox(engine, event) {
        var query = quickSearch.qsSearchInput.value.trim();
        openEngineOnClick(engine, query, event);
    }

    // 切换快搜page lock状态
    function toggleQuickSearchPageLock() {
        qsPageLock = qsPageLock ? false : true;
        if (qsPageLock) {
            selectionToolbar.hideToolbar();
            quickSearch.hideMainBox();
            infoTips.showInfoTipsLayer('已禁用(🔒)');
        } else {
            infoTips.showInfoTipsLayer('已启用(🚀)');
        }
    }

    ///////////////////////////////////////////////////////////////////
    // 元素创建 与 元素事件响应
    ///////////////////////////////////////////////////////////////////

    // 初始化热键映射表
    function initHotkeyEngineMapping() {
        conf.hotkeyEngines.forEach(engine => {
            if (!engine.enable) return; // 此处return搭配forEach, 请勿改为其他形式循环
            engine.hotkeys.forEach(key => {
                hotkey2Engine[key] = engine;
            });
        });
    }

    //
    // 创建以上所有东东
    //

    function initQuickSearch() {
        commonTools.loadSheet(defaultSheet,"qs-css");
        initHotkeyEngineMapping();
        if (conf.showToolbar) {
            selectionToolbar.createToolbar();
        }
		
        quickSearch.createMainBox();
        setting.createSettingBox();
        infoTips.createInfoTipsLayer();
		quickSearch.createSuggestionsLayer();
    }

    // 百度等网页会在不刷新页面的情况下改变网页内容, 导致quick search除了js脚本之外的东东全部没了.
    // 此函数用于确保quick search处于可用状态, 需在toolbar或mainbox等窗口每次显示时调用.
    function ensureQuickSearchAlive() {
        var css = document.querySelector("#qs-css");
        var mainbox = document.querySelector("#qs-mainbox");
        if (!css || !mainbox) {
            initQuickSearch();
        }
    }

    initQuickSearch();

    ///////////////////////////////////////////////////////////////////
    // 全局事件响应
    //
    // 我们将全局事件绑定在捕获阶段执行, 避免事件响应被网页自带的脚本拦截掉.
    ///////////////////////////////////////////////////////////////////

    //
    // top window和iframe共用的事件处理逻辑
    //

    window.addEventListener('mousedown', function (e) {
        var target = e.target;
        // 隐藏工具条
        if (selectionToolbar.isToolbarVisual() && !selectionToolbar.toolbar.contains(target)) {
            selectionToolbar.hideToolbar();
        }
    }, true);

    window.addEventListener('mouseup', function (e) {
        var target = e.target;
        // 显示/隐藏工具条
        if (isAllowToolbar(e)) {
            var selection = commonTools.getSelection();
            if (selection && !selectionToolbar.isToolbarVisual()) {
                selectionToolbar.showToolbar(e);
            }
            if (!selection && selectionToolbar.isToolbarVisual()) {
                selectionToolbar.hideToolbar();
            }
        }

        // 划词时自动复制文本到剪贴板
        if (conf.autoCopyToClipboard
            && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA'
            && !quickSearch.qsMainBox.contains(target) && !setting.qsSettingBox.contains(target)) {
            var selection = commonTools.getSelection();
            if (selection) {
                GM_setClipboard(selection, 'text/plain');
            }
        }
    }, true);

    // 有时候selectionchange发生在mouseup之后, 导致没有selection时toolbar依然显示.
    // 故再添加selectionchange事件以隐藏toolbar.
    // 由于在鼠标划词拖动过程中会不停触发selectionchange事件, 所以最好不要以此事件来显示/调整toolbar位置.
    document.addEventListener('selectionchange', function (e) {
        var selection = commonTools.getSelection();
        if (!selection && selectionToolbar.isToolbarVisual()) {
            selectionToolbar.hideToolbar();
        }
    }, true);

    //
    // 只在top window中使用的事件处理逻辑
	// 只在顶层窗口执行该方法
    //
    if (window.self == window.top) {
		//隐藏窗口
        window.addEventListener('mousedown', function (e) {
            var target = e.target;
            // 隐藏快搜主窗口
            if (quickSearch.isMainBoxVisual()
                && !setting.isSettingBoxVisual()
                && !quickSearch.qsMainBox.contains(target)
                && !quickSearch.qsSuggestionsLayer.contains(target)) {
                quickSearch.hideMainBox();
            }

            // 隐藏搜索建议浮层
            if (quickSearch.isSuggestionsLayerVisual()
                && !quickSearch.qsSuggestionsLayer.contains(target)
                && !quickSearch.qsSearchInput.contains(target)) {
                quickSearch.destroySuggestions();
            }
        }, true);

		function showOrHideMainBox(){
			if (!quickSearch.isMainBoxVisual()) {
			    quickSearch.showMainBox();
			} else {
			    quickSearch.hideMainBox();
			}
		}
		
		// 双击触发
		let altPressedCount = 0;
		let timeoutId=null;
		let qsKeyComplete = false;
		window.addEventListener('keydown', function (event) {
			if(!qsPageLock && (
					(event.code==='AltLeft' || event.code==='AltRight') ||
					(event.code==='ControlLeft' || event.code==='ControlRight')
			)){
				altPressedCount ++;
				if (altPressedCount === 1) {
					timeoutId = setTimeout(() => { // 第一次按下，设置超时检测第二次按下
						altPressedCount = 0;
					}, 500);
				} else if (altPressedCount === 2) {
					if(timeoutId != null){
						clearTimeout(timeoutId);
						timeoutId = null;
					}
					altPressedCount = 0;
					event.preventDefault();
					showOrHideMainBox();
				}
			}else{
				altPressedCount = 0;
				if(timeoutId != null){
					clearTimeout(timeoutId);
					timeoutId = null;
				}
			}
		}, true);
		
		//油猴菜单触发
		GM_registerMenuCommand("打开快搜窗口",function(){
			showOrHideMainBox();
		});
	
		//组合键触发
        window.addEventListener('keydown', function (e) {
            if (!isAllowHotkey(e)) {
                return;
            }
			
			// Esc键, 隐藏快搜主窗口
            if (e.code == 'Escape') {
                if (quickSearch.isMainBoxVisual() && !setting.isSettingBoxVisual()) {
                    quickSearch.hideMainBox();
                }
                return;
            }
			
			// Alt+L键, 锁定/解锁快搜所有功能.
            if (e.code == 'KeyL') {
                e.preventDefault();
                toggleQuickSearchPageLock();
                return;
            }
			
			if (e.code == 'KeyF') {
			    e.preventDefault();
			    showOrHideMainBox();
			    return;
			}
			
			// Alt+D键, 网址直达. 网址优先级: 搜索框已有网址(若快搜主窗口可见) > 网页中选中网址
			if (e.code == 'KeyD') {
			    e.preventDefault();
			    openUrl(getUrl().url, e);
			    return;
			}
			
			// Alt+自定义快捷键搜索. 文本优先级: 搜索框已有文本(若快搜主窗口可见) > 网页中选中文本 > 当前页面搜索词
			if (hotkey2Engine[e.code]) {
			    e.preventDefault();
			    var engine = hotkey2Engine[e.code];
			    var query = getQuery();
			    openEngineOnKey(engine, query.query, e);
			    return;
			}
        }, true);
    }
	
	/**
	 * 提醒10天，每天提醒20次
	 * @param {*} commonTools 
	 */
	function OneStapRemind(commonTools){
		this.isShow=function(){
			const usedDays = GM_getValue(STORAGE_KEY.usedDays, 0);
			const tipsShowMark = GM_getValue(STORAGE_KEY.tipsShowMark, null);
			const tipsDelay = GM_getValue(STORAGE_KEY.tipsDelay, null);
			const currentDay = commonTools.dateFormat(null, "yyyy-MM-dd");
			const currentMs = (new Date()).getTime();
			
			const timesMax = 20;
			const usedDaysMax = 10;
			
			let isShow = false, day = currentDay, times=1;
			if(tipsDelay && (currentMs-tipsDelay)<1*60*1000){ //间隔时间太短不显示
				isShow = false;
			}else{
				if(usedDays >= usedDaysMax){ //提示超过10天了不显示
					isShow = false;
				}else{
					if(tipsShowMark){ //以下为正常判断
						const marks = tipsShowMark.split("@");
						day = marks[0];
						times = parseInt(marks[1]);
						if(currentDay != day){
							isShow = true;
							times = 1;
							day = currentDay;
							GM_setValue(STORAGE_KEY.usedDays, usedDaysMax+1);
						}else{
							if(times >= timesMax){
								isShow = false;
							}else{
								times += 1;
								isShow = true;
							}
						}
					}else{
						isShow = true;
					}
				}
			}
			if(isShow){
				GM_setValue(STORAGE_KEY.tipsShowMark, day+"@"+times);
				GM_setValue(STORAGE_KEY.tipsDelay, currentMs);
			}
			return isShow;
		};
		
		this.show=function(){
			if(this.isShow()){
				if(commonTools.getPlatform() == "mac"){
					infoTips.showInfoTipsLayer("【快速敲击2次Control键】可唤起快搜窗口！", 5000);
				}else{
					infoTips.showInfoTipsLayer("【快速敲击2次Ctrl键】可唤起快搜窗口！", 5000);
				}
			}
		};
	}
	
	(new OneStapRemind(commonTools)).show();
})();