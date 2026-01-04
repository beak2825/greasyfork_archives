// ==UserScript==
// @name         Keylol高级模式功能补充插件
// @namespace    http://tampermonkey.net/
// @version      0.02
// @description  Keylol论坛的高级模式编辑器功能补充插件
// @author       FoxTaillll
// @match        *://keylol.com/forum.php*
// @downloadURL https://update.greasyfork.org/scripts/405928/Keylol%E9%AB%98%E7%BA%A7%E6%A8%A1%E5%BC%8F%E5%8A%9F%E8%83%BD%E8%A1%A5%E5%85%85%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/405928/Keylol%E9%AB%98%E7%BA%A7%E6%A8%A1%E5%BC%8F%E5%8A%9F%E8%83%BD%E8%A1%A5%E5%85%85%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var parseColor = function (hexStr) {
        return hexStr.length === 4 ? hexStr.substr(1).split('').map(function (s) { return 0x11 * parseInt(s, 16); }) : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function (s) { return parseInt(s, 16); })
    };

    // zero-pad 1 digit to 2
    var pad = function (s) {
        return (s.length === 1) ? '0' + s : s;
    };

    function ConvertGrantWord(str) {
        var result = '';
        result = "[hide=10]" + str + "[/hide]"
        return result;
    }


    /*insertText(result, 0, 0);
    switchEditor(0);
    switchEditor(1);
    console.log(result);*/

    var div = document.createElement('div');
    div.setAttribute('style', 'padding: 0 3px;');

    var a = document.createElement('a');
    a.setAttribute('id', editorid + '_gradient');
    a.setAttribute('title', '添加隐藏内容[回帖模式]');
    a.setAttribute('href', 'javascript:;');
    a.setAttribute('style', 'background: transparent  url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAeMWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTA2LTIyVDEyOjU3OjEwKzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wNi0yNVQwNTo1NjoxOSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wNi0yNVQwNTo1NjoxOSswODowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpkY2ZiYzdhYy05MmIyLTA2NDktOWY1OS0yZmI4ZWFiYWMzOTEiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDoyODAxNDY1Ni05Y2UzLTU5NGItYjAwYi1kODdmNTIxMTM0YzMiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1OTdERjQ3NkEyNTAxMUVBOTc4NUVGNUNENzU2Q0JDOSIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgcGhvdG9zaG9wOkhpc3Rvcnk9IjIwMjAtMDYtMjJUMTI6NTc6NDYrMDg6MDAmI3g5O+aWh+S7tiDkuIvovb0ucG5nIOW3suaJk+W8gCYjeEE7MjAyMC0wNi0yMlQxMzowNDowNSswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzliKAucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yMlQxMzowNzoyMiswODowMCYjeDk75paH5Lu2IEM6XFVzZXJzXEZveFRhaWxsbGxcQXBwRGF0YVxSb2FtaW5nXEFkb2JlXEFkb2JlIFBob3Rvc2hvcCAyMDIwXEF1dG9SZWNvdmVyXF/kuIvovb02OTAyOTI2RTI3RUUwOUFFOUFFQ0RFQzNBQjdFOEEwMS5wc2Ig5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIyVDEzOjM2OjEwKzA4OjAwJiN4OTvmlofku7YgQzpcVXNlcnNcRm94VGFpbGxsbFxBcHBEYXRhXFJvYW1pbmdcQWRvYmVcQWRvYmUgUGhvdG9zaG9wIDIwMjBcQXV0b1JlY292ZXJcX+S4i+i9vTY5MDI5MjZFMjdFRTA5QUU5QUVDREVDM0FCN0U4QTAxLnBzYiDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTM6NDI6MzIrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5YigLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTM6NDU6MDYrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc6aOeLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTM6NDU6NDYrMDg6MDAmI3g5O+aWh+S7tiBDOlxVc2Vyc1xGb3hUYWlsbGxsXEFwcERhdGFcUm9hbWluZ1xBZG9iZVxBZG9iZSBQaG90b3Nob3AgMjAyMFxBdXRvUmVjb3Zlclxf5LiL6L29NjkwMjkyNkUyN0VFMDlBRTlBRUNERUMzQUI3RThBMDEucHNiIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yMlQxNDowNDo1OCswODowMCYjeDk75paH5Lu2IEM6XFVzZXJzXEZveFRhaWxsbGxcQXBwRGF0YVxSb2FtaW5nXEFkb2JlXEFkb2JlIFBob3Rvc2hvcCAyMDIwXEF1dG9SZWNvdmVyXF/kuIvovb02OTAyOTI2RTI3RUUwOUFFOUFFQ0RFQzNBQjdFOEEwMS5wc2Ig5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjA1OjQ0KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOmjni5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjA5OjUwKzA4OjAwJiN4OTvmlofku7YgQzpcVXNlcnNcRm94VGFpbGxsbFxBcHBEYXRhXFJvYW1pbmdcQWRvYmVcQWRvYmUgUGhvdG9zaG9wIDIwMjBcQXV0b1JlY292ZXJcX+S4i+i9vTY5MDI5MjZFMjdFRTA5QUU5QUVDREVDM0FCN0U4QTAxLnBzYiDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MjE6NDUrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcazEucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyNToyNyswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzliKAucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyNTo0NiswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzpo54ucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyNjozNCswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxrMC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjI2OjUxKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXGsxLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6Mjc6MDUrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5LiL6L29LnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6Mjc6NDUrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcazMucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyODowNiswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxrNC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjI4OjIyKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXGs1LnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6Mjk6MTIrMDg6MDAmI3g5O+aWh+S7tiBDOlxVc2Vyc1xGb3hUYWlsbGxsXEFwcERhdGFcUm9hbWluZ1xBZG9iZVxBZG9iZSBQaG90b3Nob3AgMjAyMFxBdXRvUmVjb3Zlclxf5LiL6L29NkZCNTNDNTE1MzlCNDc1NTlDRjBEMTIyQTgzMkNGNjMucHNiIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDozMjo0NiswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxzaDAucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDozMzowNCswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxzaDEucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDozMzoxNyswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxzaC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjM0OjEzKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXHNoMy5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjM0OjM4KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXHNoNC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjM0OjUyKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXHNoNS5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjM1OjA1KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOS4i+i9vS5wc2Qg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIxOjQ5OjU4KzA4OjAwJiN4OTvmlofku7Yg5LiL6L29LnBzZCDlt7LmiZPlvIAmI3hBOzIwMjAtMDYtMjNUMjE6NDk6NTkrMDg6MDAmI3g5O+aWh+S7tiDmibnms6ggMjAyMC0wNi0yMyAyMTM4NTkuanBnIOW3suWFs+mXrSYjeEE7MjAyMC0wNi0yM1QyMTo1MzoxOSswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzlvakucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMTo1MzozNCswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzliK4ucHNkIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMTo1Mzo1MCswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzliK4ucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMTo1Mzo1NyswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzkuIvovb0ucHNkIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMjoxNzoyNSswODowMCYjeDk75paH5Lu2IOS4i+i9vS5wc2Qg5bey5omT5byAJiN4QTsyMDIwLTA2LTIzVDIyOjE4OjM1KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOWIoC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIyOjE4OjUzKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOmjni5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIyOjIyOjA3KzA4OjAwJiN4OTvmlofku7Yg5LiL6L29LnBzZCDlt7LlhbPpl60mI3hBOzIwMjAtMDYtMjNUMjI6MjI6MDcrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5LiL6L29LnBzZCDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjVUMDU6Mjg6MjgrMDg6MDAmI3g5O+aWh+S7tiDkuIvovb0ucHNkIOW3suaJk+W8gCYjeEE7MjAyMC0wNi0yNVQwNTozODowNCswODowMCYjeDk75paH5Lu2IEM6XFVzZXJzXEZveFRhaWxsbGxcQXBwRGF0YVxSb2FtaW5nXEFkb2JlXEFkb2JlIFBob3Rvc2hvcCAyMDIwXEF1dG9SZWNvdmVyXF/kuIvovb04REUwNDMzNkE1MjU4Q0MxQ0NEMzREQkJDRDI1MDEzOC5wc2Ig5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTI1VDA1OjQ3OjQwKzA4OjAwJiN4OTvmlofku7YgQzpcVXNlcnNcRm94VGFpbGxsbFxBcHBEYXRhXFJvYW1pbmdcQWRvYmVcQWRvYmUgUGhvdG9zaG9wIDIwMjBcQXV0b1JlY292ZXJcX+S4i+i9vThERTA0MzM2QTUyNThDQzFDQ0QzNERCQkNEMjUwMTM4LnBzYiDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjVUMDU6NDg6MzkrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcaDUucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yNVQwNTo0OTowMSswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxoNS5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTI1VDA1OjQ5OjE0KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXGF1LnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjVUMDU6NDk6MTgrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5LiL6L29LnBzZCDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjVUMDU6NDk6MjYrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5LiL6L29LnBzZCDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjVUMDU6NTY6MTkrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5ZueLnBuZyDlt7LlrZjlgqgmI3hBOyIgdGlmZjpPcmllbnRhdGlvbj0iMSIgdGlmZjpYUmVzb2x1dGlvbj0iNzIwMDAwLzEwMDAwIiB0aWZmOllSZXNvbHV0aW9uPSI3MjAwMDAvMTAwMDAiIHRpZmY6UmVzb2x1dGlvblVuaXQ9IjIiIGV4aWY6Q29sb3JTcGFjZT0iMSIgZXhpZjpQaXhlbFhEaW1lbnNpb249IjIwIiBleGlmOlBpeGVsWURpbWVuc2lvbj0iMjAiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpkZGQ5NjRmYS00MmJhLTUwNDEtODhmYy1mN2NmYWNjMzRlNDciIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDoxMDM4YTg1YS1iOTc4LTQ4NDctYWE1MC01ZDQ2ZWNjZTBlODEiIHN0UmVmOm9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1OTdERjQ3NkEyNTAxMUVBOTc4NUVGNUNENzU2Q0JDOSIvPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBpbWFnZS9wbmcgdG8gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NmFlMmQ1OWYtNTVjNy1lOTQ5LWE1NWUtMzcyMjEyNGQ5NTMzIiBzdEV2dDp3aGVuPSIyMDIwLTA2LTIzVDIwOjM1OjA1KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmRkZDk2NGZhLTQyYmEtNTA0MS04OGZjLWY3Y2ZhY2MzNGU0NyIgc3RFdnQ6d2hlbj0iMjAyMC0wNi0yNVQwNTo1NjoxOSswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjb252ZXJ0ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImRlcml2ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImNvbnZlcnRlZCBmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpkY2ZiYzdhYy05MmIyLTA2NDktOWY1OS0yZmI4ZWFiYWMzOTEiIHN0RXZ0OndoZW49IjIwMjAtMDYtMjVUMDU6NTY6MTkrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4xIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPHBob3Rvc2hvcDpUZXh0TGF5ZXJzPiA8cmRmOkJhZz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSLliKAiIHBob3Rvc2hvcDpMYXllclRleHQ9IuWIoCIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9IumjniIgcGhvdG9zaG9wOkxheWVyVGV4dD0i6aOeIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0i5YiuIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSLliK4iLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSLlvakiIHBob3Rvc2hvcDpMYXllclRleHQ9IuW9qSIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9ImswIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJrMCIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9ImsxIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJrMSIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9ImsyIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJrMiIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9ImszIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJrMyIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9Ims0IiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJrNCIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9Ims1IiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJrNSIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9InNoMCIgcGhvdG9zaG9wOkxheWVyVGV4dD0ic2gwIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0ic2gxIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJzaDEiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJzaDIiIHBob3Rvc2hvcDpMYXllclRleHQ9InNoMiIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9InNoMyIgcGhvdG9zaG9wOkxheWVyVGV4dD0ic2gzIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0ic2g0IiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJzaDQiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJzaDUiIHBob3Rvc2hvcDpMYXllclRleHQ9InNoNSIvPiA8L3JkZjpCYWc+IDwvcGhvdG9zaG9wOlRleHRMYXllcnM+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+zCbPOwAAAMBJREFUOI3VVNENQiEMbJVJxDgJbMHbwegsRv/URF2iTKFxGyN+SXhASaN86P01HNcrvYAhBOiJSVe1vxBUabFcrcP9di1IRITW2upj6/kCdtsNdnOYL/V7wedjVI9G1jPNXiQiZA8ToDSH3BvmDaPD/eEYLudTQbLWhjfZe191aYyJzVSN0EJ6udYkLkWpqVjUe4+c2+hwcA4H5wqCdBmFIEA72Gmdj80KSsCN+pFgy1lVsBVsAFlsxMGW4vf/wxcOQE3E69DkGAAAAABJRU5ErkJggg==) no-repeat 0 0;width: 20px;height: 20px;float: left;border: 1px solid #fcfcfc;overflow: hidden;');
    //a.innerText = "隐藏内容[回帖模式]";
    div.appendChild(a);
    document.getElementById(editorid + "_controls").appendChild(div);
    a.addEventListener('click', function () {
        showEditorMenu2();
        //doane();
    }, false);

    function showEditorMenu2() {
        var ctrlid = editorid + '_gradient';
        var menutype = 'menu';
        var menupos = '43!';
        var menu = document.createElement('div');
        menu.id = ctrlid + '_menu';
        menu.style.display = 'none';
        menu.className = 'p_pof upf';
        menu.style.width = '270px';
        s = '<div class="p_opt cl"><span class="y" style="margin:-10px -10px 0 0"><a onclick="hideMenu();return false;" class="flbc" href="javascript:;">关闭</a></span><div>' + '请输入要插入的隐藏内容[权限默认为10 如有需要请手动修改]:<br /><textarea id="' + ctrlid + '_param_1" style="width: 98%" cols="50" rows="5" class="txtarea"></textarea>' + '</div><div class="pns mtn"><button type="submit" id="' + ctrlid + '_submit" class="pn pnc"><strong>提交</strong></button></div></div>';
        menu.innerHTML = s;
        $(editorid + '_editortoolbar').appendChild(menu);
        showMenu({
            'ctrlid': ctrlid,
            'mtype': menutype,
            'evt': 'click',
            'duration': 3,
            'cache': 0,
            'drag': 1,
            'pos': menupos
        });

        try {
            if ($(ctrlid + '_param_1')) {
                $(ctrlid + '_param_1').focus();
            }
        } catch (e) { }
        var objs = menu.getElementsByTagName('*');
        for (var i = 0; i < objs.length; i++) {
            _attachEvent(objs[i], 'keydown',
                function (e) {
                    var obj = e.target;
                    if ((obj.type == 'text' && e.keyCode == 13) || (obj.type == 'textarea' && e.ctrlKey && e.keyCode == 13)) {
                        if ($(ctrlid + '_submit') && tag != 'image') $(ctrlid + '_submit').click();
                        doane(e);
                    } else if (e.keyCode == 27) {
                        hideMenu();
                        doane(e);
                    }
                });
        }
        if ($(ctrlid + '_submit')) $(ctrlid + '_submit').onclick = function () {
            checkFocus();
            if (!str) {
                str = '';
                var first = $(ctrlid + '_param_1').value;
                var str = ConvertGrantWord(first);
                //insertText((opentag + str + closetag), strlen(opentag), strlen(closetag), true, sel);
                insertText(str, str.length, 0, false , getSel());
                switchEditor(0);
                switchEditor(1);
                hideMenu();

            }
        }
    }
    // Your code here...
})();

(function () {
    'use strict';
    var parseColor = function (hexStr) {
        return hexStr.length === 4 ? hexStr.substr(1).split('').map(function (s) { return 0x11 * parseInt(s, 16); }) : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function (s) { return parseInt(s, 16); })
    };

    // zero-pad 1 digit to 2
    var pad = function (s) {
        return (s.length === 1) ? '0' + s : s;
    };

    function ConvertGrantWord(str) {
        var result = '';
        result = "[audio]http://music.163.com/song/media/outer/url?id=" + str + ".mp3[/audio]"
        return result;
    }


    /*insertText(result, 0, 0);
    switchEditor(0);
    switchEditor(1);
    console.log(result);*/

    var div = document.createElement('div');
    div.setAttribute('style', 'padding: 0 3px;');

    var a = document.createElement('a');
    a.setAttribute('id', editorid + '_gradient');
    a.setAttribute('title', '添加网易云音乐[audio]');
    a.setAttribute('href', 'javascript:;');
    a.setAttribute('style', 'background: transparent  url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAdXGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTA2LTIyVDEyOjU3OjEwKzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wNi0yNVQwNTo0OToxNCswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wNi0yNVQwNTo0OToxNCswODowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3NWExNjI5NC05Y2UxLTZjNDctYjY4NS1lNTUyNWEzZGJmODAiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDplZGMyYTNiZC05MzRjLWViNGUtYjllYS1hNDk5MTEzMjlmOWQiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1OTdERjQ3NkEyNTAxMUVBOTc4NUVGNUNENzU2Q0JDOSIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgcGhvdG9zaG9wOkhpc3Rvcnk9IjIwMjAtMDYtMjJUMTI6NTc6NDYrMDg6MDAmI3g5O+aWh+S7tiDkuIvovb0ucG5nIOW3suaJk+W8gCYjeEE7MjAyMC0wNi0yMlQxMzowNDowNSswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzliKAucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yMlQxMzowNzoyMiswODowMCYjeDk75paH5Lu2IEM6XFVzZXJzXEZveFRhaWxsbGxcQXBwRGF0YVxSb2FtaW5nXEFkb2JlXEFkb2JlIFBob3Rvc2hvcCAyMDIwXEF1dG9SZWNvdmVyXF/kuIvovb02OTAyOTI2RTI3RUUwOUFFOUFFQ0RFQzNBQjdFOEEwMS5wc2Ig5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIyVDEzOjM2OjEwKzA4OjAwJiN4OTvmlofku7YgQzpcVXNlcnNcRm94VGFpbGxsbFxBcHBEYXRhXFJvYW1pbmdcQWRvYmVcQWRvYmUgUGhvdG9zaG9wIDIwMjBcQXV0b1JlY292ZXJcX+S4i+i9vTY5MDI5MjZFMjdFRTA5QUU5QUVDREVDM0FCN0U4QTAxLnBzYiDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTM6NDI6MzIrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5YigLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTM6NDU6MDYrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc6aOeLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTM6NDU6NDYrMDg6MDAmI3g5O+aWh+S7tiBDOlxVc2Vyc1xGb3hUYWlsbGxsXEFwcERhdGFcUm9hbWluZ1xBZG9iZVxBZG9iZSBQaG90b3Nob3AgMjAyMFxBdXRvUmVjb3Zlclxf5LiL6L29NjkwMjkyNkUyN0VFMDlBRTlBRUNERUMzQUI3RThBMDEucHNiIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yMlQxNDowNDo1OCswODowMCYjeDk75paH5Lu2IEM6XFVzZXJzXEZveFRhaWxsbGxcQXBwRGF0YVxSb2FtaW5nXEFkb2JlXEFkb2JlIFBob3Rvc2hvcCAyMDIwXEF1dG9SZWNvdmVyXF/kuIvovb02OTAyOTI2RTI3RUUwOUFFOUFFQ0RFQzNBQjdFOEEwMS5wc2Ig5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjA1OjQ0KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOmjni5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjA5OjUwKzA4OjAwJiN4OTvmlofku7YgQzpcVXNlcnNcRm94VGFpbGxsbFxBcHBEYXRhXFJvYW1pbmdcQWRvYmVcQWRvYmUgUGhvdG9zaG9wIDIwMjBcQXV0b1JlY292ZXJcX+S4i+i9vTY5MDI5MjZFMjdFRTA5QUU5QUVDREVDM0FCN0U4QTAxLnBzYiDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MjE6NDUrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcazEucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyNToyNyswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzliKAucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyNTo0NiswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzpo54ucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyNjozNCswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxrMC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjI2OjUxKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXGsxLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6Mjc6MDUrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5LiL6L29LnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6Mjc6NDUrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcazMucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyODowNiswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxrNC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjI4OjIyKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXGs1LnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6Mjk6MTIrMDg6MDAmI3g5O+aWh+S7tiBDOlxVc2Vyc1xGb3hUYWlsbGxsXEFwcERhdGFcUm9hbWluZ1xBZG9iZVxBZG9iZSBQaG90b3Nob3AgMjAyMFxBdXRvUmVjb3Zlclxf5LiL6L29NkZCNTNDNTE1MzlCNDc1NTlDRjBEMTIyQTgzMkNGNjMucHNiIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDozMjo0NiswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxzaDAucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDozMzowNCswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxzaDEucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDozMzoxNyswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxzaC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjM0OjEzKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXHNoMy5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjM0OjM4KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXHNoNC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjM0OjUyKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXHNoNS5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjM1OjA1KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOS4i+i9vS5wc2Qg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIxOjQ5OjU4KzA4OjAwJiN4OTvmlofku7Yg5LiL6L29LnBzZCDlt7LmiZPlvIAmI3hBOzIwMjAtMDYtMjNUMjE6NDk6NTkrMDg6MDAmI3g5O+aWh+S7tiDmibnms6ggMjAyMC0wNi0yMyAyMTM4NTkuanBnIOW3suWFs+mXrSYjeEE7MjAyMC0wNi0yM1QyMTo1MzoxOSswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzlvakucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMTo1MzozNCswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzliK4ucHNkIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMTo1Mzo1MCswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzliK4ucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMTo1Mzo1NyswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzkuIvovb0ucHNkIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMjoxNzoyNSswODowMCYjeDk75paH5Lu2IOS4i+i9vS5wc2Qg5bey5omT5byAJiN4QTsyMDIwLTA2LTIzVDIyOjE4OjM1KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOWIoC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIyOjE4OjUzKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOmjni5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIyOjIyOjA3KzA4OjAwJiN4OTvmlofku7Yg5LiL6L29LnBzZCDlt7LlhbPpl60mI3hBOzIwMjAtMDYtMjNUMjI6MjI6MDcrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5LiL6L29LnBzZCDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjVUMDU6Mjg6MjgrMDg6MDAmI3g5O+aWh+S7tiDkuIvovb0ucHNkIOW3suaJk+W8gCYjeEE7MjAyMC0wNi0yNVQwNTozODowNCswODowMCYjeDk75paH5Lu2IEM6XFVzZXJzXEZveFRhaWxsbGxcQXBwRGF0YVxSb2FtaW5nXEFkb2JlXEFkb2JlIFBob3Rvc2hvcCAyMDIwXEF1dG9SZWNvdmVyXF/kuIvovb04REUwNDMzNkE1MjU4Q0MxQ0NEMzREQkJDRDI1MDEzOC5wc2Ig5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTI1VDA1OjQ3OjQwKzA4OjAwJiN4OTvmlofku7YgQzpcVXNlcnNcRm94VGFpbGxsbFxBcHBEYXRhXFJvYW1pbmdcQWRvYmVcQWRvYmUgUGhvdG9zaG9wIDIwMjBcQXV0b1JlY292ZXJcX+S4i+i9vThERTA0MzM2QTUyNThDQzFDQ0QzNERCQkNEMjUwMTM4LnBzYiDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjVUMDU6NDg6MzkrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcaDUucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yNVQwNTo0OTowMSswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxoNS5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTI1VDA1OjQ5OjE0KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXGF1LnBuZyDlt7LlrZjlgqgmI3hBOyIgdGlmZjpPcmllbnRhdGlvbj0iMSIgdGlmZjpYUmVzb2x1dGlvbj0iNzIwMDAwLzEwMDAwIiB0aWZmOllSZXNvbHV0aW9uPSI3MjAwMDAvMTAwMDAiIHRpZmY6UmVzb2x1dGlvblVuaXQ9IjIiIGV4aWY6Q29sb3JTcGFjZT0iMSIgZXhpZjpQaXhlbFhEaW1lbnNpb249IjIwIiBleGlmOlBpeGVsWURpbWVuc2lvbj0iMjAiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpiMGJkZjRkMS1hZTA3LWQ3NDMtODcyZC01ZjYxMmFiMWEyZjIiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDoxMDM4YTg1YS1iOTc4LTQ4NDctYWE1MC01ZDQ2ZWNjZTBlODEiIHN0UmVmOm9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1OTdERjQ3NkEyNTAxMUVBOTc4NUVGNUNENzU2Q0JDOSIvPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBpbWFnZS9wbmcgdG8gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NmFlMmQ1OWYtNTVjNy1lOTQ5LWE1NWUtMzcyMjEyNGQ5NTMzIiBzdEV2dDp3aGVuPSIyMDIwLTA2LTIzVDIwOjM1OjA1KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmIwYmRmNGQxLWFlMDctZDc0My04NzJkLTVmNjEyYWIxYTJmMiIgc3RFdnQ6d2hlbj0iMjAyMC0wNi0yNVQwNTo0OToxNCswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjb252ZXJ0ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImRlcml2ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImNvbnZlcnRlZCBmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo3NWExNjI5NC05Y2UxLTZjNDctYjY4NS1lNTUyNWEzZGJmODAiIHN0RXZ0OndoZW49IjIwMjAtMDYtMjVUMDU6NDk6MTQrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4xIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPHBob3Rvc2hvcDpUZXh0TGF5ZXJzPiA8cmRmOkJhZz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSLliKAiIHBob3Rvc2hvcDpMYXllclRleHQ9IuWIoCIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9IumjniIgcGhvdG9zaG9wOkxheWVyVGV4dD0i6aOeIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0i5YiuIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSLliK4iLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSLlvakiIHBob3Rvc2hvcDpMYXllclRleHQ9IuW9qSIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9ImswIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJrMCIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9ImsxIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJrMSIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9ImsyIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJrMiIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9ImszIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJrMyIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9Ims0IiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJrNCIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9Ims1IiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJrNSIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9InNoMCIgcGhvdG9zaG9wOkxheWVyVGV4dD0ic2gwIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0ic2gxIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJzaDEiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJzaDIiIHBob3Rvc2hvcDpMYXllclRleHQ9InNoMiIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9InNoMyIgcGhvdG9zaG9wOkxheWVyVGV4dD0ic2gzIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0ic2g0IiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJzaDQiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJzaDUiIHBob3Rvc2hvcDpMYXllclRleHQ9InNoNSIvPiA8L3JkZjpCYWc+IDwvcGhvdG9zaG9wOlRleHRMYXllcnM+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+db/i7wAAAtlJREFUOI2tlE9IY1cUxn83HRORNxV5CxeChgjZGJlKx4W4EOE9tEhsCy5VXLmZdiilxUWLWMZhxhpwmY3QdhPNlFkYG2ui1ckqs5hBRQyI4H4KQST4bHzo6UK845sXhqH0wONd7vnOx3f+3KNEhP/T7nwo0HEcSaVSbG5u0tjYyNDQEMPDw+pdnHqfwp2dHTFNk9bWVpVIJCSXy3n8Y2NjjI+Pe0hrKiyVSrK4uMj+/j7RaJTZ2VnZ2tqirq6O6elpKpUKq6urhMNhX6yPcHt7W+bn53FdF9M0GRwcJBQKEQqFqFarxGIxDMNQtm3XzCrwrrIbsoGBAZLJJPF4XDmOg2mauK5LIpEgl8vJyclJ7VqJiP4mJyfFsixZWFiQm7uVlRUZGRkRy7LkNlZEWF9f993pQ6FQEMuyZHR0VCqViogI+XzeF3B0dCQPvvpaRATLsiSTyXgwuobFYhGAeDyOYRgKwLZtBXBwUJLfnz+nWHwJQDAY1Bkmk0k6OjokEokoTw2Pj48BiMViGvzLr7+Jbdvy7Xffa7KPblXdsixc12Vtbc3flNPTUwAMw9DO5fQzAneCBINBHj/6idyfWbWWzaqLiwudDcDu7q6O0SkbhkG5XOb8/Fw7r66uUHLJ6krWM7w3Kk3TRCmlxXgURiIRAA4PD986AwHy+bzved3Y2dkZAPX19X7C7u5uADKZTM3gP7JZ+eHHaVlaTuv529vbQ0Rob2/3p9zT08PGxoZHjeM4ADx5+rO8KBQAePX6tU45nU4D0NfX5yfUozLwmQQC1xENDQ0AvPn7jUft3Y8bASiXy3R2dtLf36+FeJ7ecvqZJrtt3zx8SLX6D3DdqPRSSgG0tLQwNTXlwXqWwyf37nmc4ba263+4Tb3Y+svjm5mZkbm5OZqbmz1l8u3Dg4OSpJaWuX//U7784nMFMDExIZeXlzQ1NRGNRunt7aWrq6tm99+7YP+L/QvASmX9zi6IvQAAAABJRU5ErkJggg==) no-repeat 0 0;width: 20px;height: 20px;float: left;border: 1px solid #fcfcfc;overflow: hidden;');
    //a.innerText = "网易云音乐[audio]";
    div.appendChild(a);
    document.getElementById(editorid + "_controls").appendChild(div);
    a.addEventListener('click', function () {
        showEditorMenu2();
        //doane();
    }, false);

    function showEditorMenu2() {
        var ctrlid = editorid + '_gradient';
        var menutype = 'menu';
        var menupos = '43!';
        var menu = document.createElement('div');
        menu.id = ctrlid + '_menu';
        menu.style.display = 'none';
        menu.className = 'p_pof upf';
        menu.style.width = '270px';
        s = '<div class="p_opt cl"><span class="y" style="margin:-10px -10px 0 0"><a onclick="hideMenu();return false;" class="flbc" href="javascript:;">关闭</a></span><div>' + '请输入网易云音乐的ID:<br /><textarea id="' + ctrlid + '_param_1" style="width: 98%" cols="50" rows="5" class="txtarea"></textarea>' + '</div><div class="pns mtn"><button type="submit" id="' + ctrlid + '_submit" class="pn pnc"><strong>提交</strong></button></div></div>';
        menu.innerHTML = s;
        $(editorid + '_editortoolbar').appendChild(menu);
        showMenu({
            'ctrlid': ctrlid,
            'mtype': menutype,
            'evt': 'click',
            'duration': 3,
            'cache': 0,
            'drag': 1,
            'pos': menupos
        });

        try {
            if ($(ctrlid + '_param_1')) {
                $(ctrlid + '_param_1').focus();
            }
        } catch (e) { }
        var objs = menu.getElementsByTagName('*');
        for (var i = 0; i < objs.length; i++) {
            _attachEvent(objs[i], 'keydown',
                function (e) {
                    var obj = e.target;
                    if ((obj.type == 'text' && e.keyCode == 13) || (obj.type == 'textarea' && e.ctrlKey && e.keyCode == 13)) {
                        if ($(ctrlid + '_submit') && tag != 'image') $(ctrlid + '_submit').click();
                        doane(e);
                    } else if (e.keyCode == 27) {
                        hideMenu();
                        doane(e);
                    }
                });
        }
        if ($(ctrlid + '_submit')) $(ctrlid + '_submit').onclick = function () {
            checkFocus();
            if (!str) {
                str = '';
                var first = $(ctrlid + '_param_1').value;
                var str = ConvertGrantWord(first);
                //insertText((opentag + str + closetag), strlen(opentag), strlen(closetag), true, sel);
                insertText(str, str.length, 0, false , getSel());
                switchEditor(0);
                switchEditor(1);
                hideMenu();

            }
        }
    }
    // Your code here...
})();

(function () {
    'use strict';
    var parseColor = function (hexStr) {
        return hexStr.length === 4 ? hexStr.substr(1).split('').map(function (s) { return 0x11 * parseInt(s, 16); }) : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function (s) { return parseInt(s, 16); })
    };

    // zero-pad 1 digit to 2
    var pad = function (s) {
        return (s.length === 1) ? '0' + s : s;
    };

    function ConvertGrantWord(str) {
        var result = '';
        result = "[html5audio]http://music.163.com/song/media/outer/url?id=" + str + "[/html5audio]"
        return result;
    }


    /*insertText(result, 0, 0);
    switchEditor(0);
    switchEditor(1);
    console.log(result);*/

    var div = document.createElement('div');
    div.setAttribute('style', 'padding: 0 3px;');

    var a = document.createElement('a');
    a.setAttribute('id', editorid + '_gradient');
    a.setAttribute('title', '添加网易云音乐[html5audio]');
    a.setAttribute('href', 'javascript:;');
    a.setAttribute('style', 'background: transparent  url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAdGGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTA2LTIyVDEyOjU3OjEwKzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wNi0yNVQwNTo0OTowMSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wNi0yNVQwNTo0OTowMSswODowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3ZDY5MTRlMC0zNDdjLThiNDMtYTZlYi0zYjU1NjU0MmU5YjUiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpiYjhiNGY4OS01N2MyLTY3NDEtODYxOS1mMDc5MTg5NjQxYTUiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1OTdERjQ3NkEyNTAxMUVBOTc4NUVGNUNENzU2Q0JDOSIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgcGhvdG9zaG9wOkhpc3Rvcnk9IjIwMjAtMDYtMjJUMTI6NTc6NDYrMDg6MDAmI3g5O+aWh+S7tiDkuIvovb0ucG5nIOW3suaJk+W8gCYjeEE7MjAyMC0wNi0yMlQxMzowNDowNSswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzliKAucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yMlQxMzowNzoyMiswODowMCYjeDk75paH5Lu2IEM6XFVzZXJzXEZveFRhaWxsbGxcQXBwRGF0YVxSb2FtaW5nXEFkb2JlXEFkb2JlIFBob3Rvc2hvcCAyMDIwXEF1dG9SZWNvdmVyXF/kuIvovb02OTAyOTI2RTI3RUUwOUFFOUFFQ0RFQzNBQjdFOEEwMS5wc2Ig5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIyVDEzOjM2OjEwKzA4OjAwJiN4OTvmlofku7YgQzpcVXNlcnNcRm94VGFpbGxsbFxBcHBEYXRhXFJvYW1pbmdcQWRvYmVcQWRvYmUgUGhvdG9zaG9wIDIwMjBcQXV0b1JlY292ZXJcX+S4i+i9vTY5MDI5MjZFMjdFRTA5QUU5QUVDREVDM0FCN0U4QTAxLnBzYiDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTM6NDI6MzIrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5YigLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTM6NDU6MDYrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc6aOeLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTM6NDU6NDYrMDg6MDAmI3g5O+aWh+S7tiBDOlxVc2Vyc1xGb3hUYWlsbGxsXEFwcERhdGFcUm9hbWluZ1xBZG9iZVxBZG9iZSBQaG90b3Nob3AgMjAyMFxBdXRvUmVjb3Zlclxf5LiL6L29NjkwMjkyNkUyN0VFMDlBRTlBRUNERUMzQUI3RThBMDEucHNiIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yMlQxNDowNDo1OCswODowMCYjeDk75paH5Lu2IEM6XFVzZXJzXEZveFRhaWxsbGxcQXBwRGF0YVxSb2FtaW5nXEFkb2JlXEFkb2JlIFBob3Rvc2hvcCAyMDIwXEF1dG9SZWNvdmVyXF/kuIvovb02OTAyOTI2RTI3RUUwOUFFOUFFQ0RFQzNBQjdFOEEwMS5wc2Ig5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjA1OjQ0KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOmjni5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjA5OjUwKzA4OjAwJiN4OTvmlofku7YgQzpcVXNlcnNcRm94VGFpbGxsbFxBcHBEYXRhXFJvYW1pbmdcQWRvYmVcQWRvYmUgUGhvdG9zaG9wIDIwMjBcQXV0b1JlY292ZXJcX+S4i+i9vTY5MDI5MjZFMjdFRTA5QUU5QUVDREVDM0FCN0U4QTAxLnBzYiDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MjE6NDUrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcazEucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyNToyNyswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzliKAucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyNTo0NiswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzpo54ucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyNjozNCswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxrMC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjI2OjUxKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXGsxLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6Mjc6MDUrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5LiL6L29LnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6Mjc6NDUrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcazMucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyODowNiswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxrNC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjI4OjIyKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXGs1LnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6Mjk6MTIrMDg6MDAmI3g5O+aWh+S7tiBDOlxVc2Vyc1xGb3hUYWlsbGxsXEFwcERhdGFcUm9hbWluZ1xBZG9iZVxBZG9iZSBQaG90b3Nob3AgMjAyMFxBdXRvUmVjb3Zlclxf5LiL6L29NkZCNTNDNTE1MzlCNDc1NTlDRjBEMTIyQTgzMkNGNjMucHNiIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDozMjo0NiswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxzaDAucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDozMzowNCswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxzaDEucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDozMzoxNyswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxzaC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjM0OjEzKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXHNoMy5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjM0OjM4KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXHNoNC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjM0OjUyKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXHNoNS5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjM1OjA1KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOS4i+i9vS5wc2Qg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIxOjQ5OjU4KzA4OjAwJiN4OTvmlofku7Yg5LiL6L29LnBzZCDlt7LmiZPlvIAmI3hBOzIwMjAtMDYtMjNUMjE6NDk6NTkrMDg6MDAmI3g5O+aWh+S7tiDmibnms6ggMjAyMC0wNi0yMyAyMTM4NTkuanBnIOW3suWFs+mXrSYjeEE7MjAyMC0wNi0yM1QyMTo1MzoxOSswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzlvakucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMTo1MzozNCswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzliK4ucHNkIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMTo1Mzo1MCswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzliK4ucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMTo1Mzo1NyswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzkuIvovb0ucHNkIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMjoxNzoyNSswODowMCYjeDk75paH5Lu2IOS4i+i9vS5wc2Qg5bey5omT5byAJiN4QTsyMDIwLTA2LTIzVDIyOjE4OjM1KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOWIoC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIyOjE4OjUzKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOmjni5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIyOjIyOjA3KzA4OjAwJiN4OTvmlofku7Yg5LiL6L29LnBzZCDlt7LlhbPpl60mI3hBOzIwMjAtMDYtMjNUMjI6MjI6MDcrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5LiL6L29LnBzZCDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjVUMDU6Mjg6MjgrMDg6MDAmI3g5O+aWh+S7tiDkuIvovb0ucHNkIOW3suaJk+W8gCYjeEE7MjAyMC0wNi0yNVQwNTozODowNCswODowMCYjeDk75paH5Lu2IEM6XFVzZXJzXEZveFRhaWxsbGxcQXBwRGF0YVxSb2FtaW5nXEFkb2JlXEFkb2JlIFBob3Rvc2hvcCAyMDIwXEF1dG9SZWNvdmVyXF/kuIvovb04REUwNDMzNkE1MjU4Q0MxQ0NEMzREQkJDRDI1MDEzOC5wc2Ig5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTI1VDA1OjQ3OjQwKzA4OjAwJiN4OTvmlofku7YgQzpcVXNlcnNcRm94VGFpbGxsbFxBcHBEYXRhXFJvYW1pbmdcQWRvYmVcQWRvYmUgUGhvdG9zaG9wIDIwMjBcQXV0b1JlY292ZXJcX+S4i+i9vThERTA0MzM2QTUyNThDQzFDQ0QzNERCQkNEMjUwMTM4LnBzYiDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjVUMDU6NDg6MzkrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcaDUucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yNVQwNTo0OTowMSswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxoNS5wbmcg5bey5a2Y5YKoJiN4QTsiIHRpZmY6T3JpZW50YXRpb249IjEiIHRpZmY6WFJlc29sdXRpb249IjcyMDAwMC8xMDAwMCIgdGlmZjpZUmVzb2x1dGlvbj0iNzIwMDAwLzEwMDAwIiB0aWZmOlJlc29sdXRpb25Vbml0PSIyIiBleGlmOkNvbG9yU3BhY2U9IjEiIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSIyMCIgZXhpZjpQaXhlbFlEaW1lbnNpb249IjIwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6YTM2YWY5ZjMtY2M2Ny1mNzRhLThkMDAtNDQ3OWI0ZWU0NzRkIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MTAzOGE4NWEtYjk3OC00ODQ3LWFhNTAtNWQ0NmVjY2UwZTgxIiBzdFJlZjpvcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NTk3REY0NzZBMjUwMTFFQTk3ODVFRjVDRDc1NkNCQzkiLz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iZGVyaXZlZCIgc3RFdnQ6cGFyYW1ldGVycz0iY29udmVydGVkIGZyb20gaW1hZ2UvcG5nIHRvIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjZhZTJkNTlmLTU1YzctZTk0OS1hNTVlLTM3MjIxMjRkOTUzMyIgc3RFdnQ6d2hlbj0iMjAyMC0wNi0yM1QyMDozNTowNSswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDphMzZhZjlmMy1jYzY3LWY3NGEtOGQwMC00NDc5YjRlZTQ3NGQiIHN0RXZ0OndoZW49IjIwMjAtMDYtMjVUMDU6NDk6MDErMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4xIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6N2Q2OTE0ZTAtMzQ3Yy04YjQzLWE2ZWItM2I1NTY1NDJlOWI1IiBzdEV2dDp3aGVuPSIyMDIwLTA2LTI1VDA1OjQ5OjAxKzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDxwaG90b3Nob3A6VGV4dExheWVycz4gPHJkZjpCYWc+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0i5YigIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSLliKAiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSLpo54iIHBob3Rvc2hvcDpMYXllclRleHQ9IumjniIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9IuWIriIgcGhvdG9zaG9wOkxheWVyVGV4dD0i5YiuIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0i5b2pIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSLlvakiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrMCIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazAiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrMSIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazEiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrMiIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazIiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrMyIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazMiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrNCIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazQiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrNSIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazUiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJzaDAiIHBob3Rvc2hvcDpMYXllclRleHQ9InNoMCIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9InNoMSIgcGhvdG9zaG9wOkxheWVyVGV4dD0ic2gxIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0ic2gyIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJzaDIiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJzaDMiIHBob3Rvc2hvcDpMYXllclRleHQ9InNoMyIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9InNoNCIgcGhvdG9zaG9wOkxheWVyVGV4dD0ic2g0Ii8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0ic2g1IiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJzaDUiLz4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpUZXh0TGF5ZXJzPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqJeJEQAAAKYSURBVDiNrZQxSPNaFMd/VyoVuSCaQUEQqdDFdnBwkAwipCiUuAqiTiK6uIoOTi5iwEmyOAtuoiCWVsVJxEGlILg4dBAFY5HWqGQ43/Ceecb0+3jw3oELl5tzfvd//smJEhH+z0j820Tf92VnZ4dSqURbWxv5fJ7x8XH1M0/9SeHV1ZUYhkFPT49yHEcKhULk+fT0NDMzMxFoQ4W3t7eyvb1NuVwmnU6ztrYmJycnNDc3s7q6Sq1W4+DggN7e3lhtDHh6eiobGxsEQYBhGIyNjZFMJkkmk3x+fpLJZNBaq1wu17Crpp/KvmCjo6O4rott28r3fQzDIAgCHMehUChItVpt7JWIhGtubk4sy5LNzU35fv5zWZYlExMTcnR0FMsLN2dnZ2JZlkxNTUmtVvsj8AtqWZbs7+9HckMPz8/PAbBtG611+Oa2trZkb28v0lWxWFTFYlHlcjlxXZf+/n5JpVIq4uH9/T0AmUwmUtze3t7QKgDLsgiCgMPDw/AsVPj6+gqA1jpSVK1W0VqTz+djQNu2KZVKXF9fx4FaazzP4/39PVL0/PxMR0cHs7OzsakwDAOlVCgGvrWcSqUAuLu7ixQlEgk+Pj4atvz29gZAS0tLHDg4OAgQm89E4vfjfnNzg4jQ19f3T/7XZmhoiK6uLgAeHx/FcRw8z6Ner4fqv8fT05Ps7u4CMDw8HAdqrdX8/LwALC8vU6lUaGr6q4HW1tYIrFKpyPr6Op7nkc1mGRkZUTEggGma6u+CEAbg+z4Al5eXcnFxwfHxMfV6ne7ubpaWliKXNTQom81SLpdDqGmaAKysrHy/nIWFBTo7OyOeN/wfvry8iOu6PDw8YJomk5OTCmBxcVHS6TSmaTIwMBD7jH4L/C/xC/1TXFh45bHRAAAAAElFTkSuQmCC) no-repeat 0 0;width: 20px;height: 20px;float: left;border: 1px solid #fcfcfc;overflow: hidden;');
    //a.innerText = "网易云音乐[html5audio]";
    div.appendChild(a);
    document.getElementById(editorid + "_controls").appendChild(div);
    a.addEventListener('click', function () {
        showEditorMenu2();
        //doane();
    }, false);

    function showEditorMenu2() {
        var ctrlid = editorid + '_gradient';
        var menutype = 'menu';
        var menupos = '43!';
        var menu = document.createElement('div');
        menu.id = ctrlid + '_menu';
        menu.style.display = 'none';
        menu.className = 'p_pof upf';
        menu.style.width = '270px';
        s = '<div class="p_opt cl"><span class="y" style="margin:-10px -10px 0 0"><a onclick="hideMenu();return false;" class="flbc" href="javascript:;">关闭</a></span><div>' + '请输入网易云音乐的ID:<br /><textarea id="' + ctrlid + '_param_1" style="width: 98%" cols="50" rows="5" class="txtarea"></textarea>' + '</div><div class="pns mtn"><button type="submit" id="' + ctrlid + '_submit" class="pn pnc"><strong>提交</strong></button></div></div>';
        menu.innerHTML = s;
        $(editorid + '_editortoolbar').appendChild(menu);
        showMenu({
            'ctrlid': ctrlid,
            'mtype': menutype,
            'evt': 'click',
            'duration': 3,
            'cache': 0,
            'drag': 1,
            'pos': menupos
        });

        try {
            if ($(ctrlid + '_param_1')) {
                $(ctrlid + '_param_1').focus();
            }
        } catch (e) { }
        var objs = menu.getElementsByTagName('*');
        for (var i = 0; i < objs.length; i++) {
            _attachEvent(objs[i], 'keydown',
                function (e) {
                    var obj = e.target;
                    if ((obj.type == 'text' && e.keyCode == 13) || (obj.type == 'textarea' && e.ctrlKey && e.keyCode == 13)) {
                        if ($(ctrlid + '_submit') && tag != 'image') $(ctrlid + '_submit').click();
                        doane(e);
                    } else if (e.keyCode == 27) {
                        hideMenu();
                        doane(e);
                    }
                });
        }
        if ($(ctrlid + '_submit')) $(ctrlid + '_submit').onclick = function () {
            checkFocus();
            if (!str) {
                str = '';
                var first = $(ctrlid + '_param_1').value;
                var str = ConvertGrantWord(first);
                //insertText((opentag + str + closetag), strlen(opentag), strlen(closetag), true, sel);
                insertText(str, str.length, 0, false , getSel());
                switchEditor(0);
                switchEditor(1);
                hideMenu();

            }
        }
    }
    // Your code here...
})();

(function () {
    'use strict';
    var parseColor = function (hexStr) {
        return hexStr.length === 4 ? hexStr.substr(1).split('').map(function (s) { return 0x11 * parseInt(s, 16); }) : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function (s) { return parseInt(s, 16); })
    };

    // zero-pad 1 digit to 2
    var pad = function (s) {
        return (s.length === 1) ? '0' + s : s;
    };

    function ConvertGrantWord(str) {
        var result = '';
        result = "[s]" + str + "[/s]"
        return result;
    }


    /*insertText(result, 0, 0);
    switchEditor(0);
    switchEditor(1);
    console.log(result);*/

    var div = document.createElement('div');
    div.setAttribute('style', 'padding: 0 3px;');

    var a = document.createElement('a');
    a.setAttribute('id', editorid + '_gradient');
    a.setAttribute('title', '添加删除线文字');
    a.setAttribute('href', 'javascript:;');
    a.setAttribute('style', 'background: transparent  url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAaM2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTA2LTIyVDEyOjU3OjEwKzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wNi0yM1QyMjoxODozNSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wNi0yM1QyMjoxODozNSswODowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozN2M4MzNjMC1lMDc2LWY4NDAtOGVmYi1hMDA0NmYyMDE2MTUiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpiM2RhZDg0Ny02MjczLWIxNDYtYjY4My0zMTY1NTM1NTYzYjQiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1OTdERjQ3NkEyNTAxMUVBOTc4NUVGNUNENzU2Q0JDOSIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgcGhvdG9zaG9wOkhpc3Rvcnk9IjIwMjAtMDYtMjJUMTI6NTc6NDYrMDg6MDAmI3g5O+aWh+S7tiDkuIvovb0ucG5nIOW3suaJk+W8gCYjeEE7MjAyMC0wNi0yMlQxMzowNDowNSswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzliKAucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yMlQxMzowNzoyMiswODowMCYjeDk75paH5Lu2IEM6XFVzZXJzXEZveFRhaWxsbGxcQXBwRGF0YVxSb2FtaW5nXEFkb2JlXEFkb2JlIFBob3Rvc2hvcCAyMDIwXEF1dG9SZWNvdmVyXF/kuIvovb02OTAyOTI2RTI3RUUwOUFFOUFFQ0RFQzNBQjdFOEEwMS5wc2Ig5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIyVDEzOjM2OjEwKzA4OjAwJiN4OTvmlofku7YgQzpcVXNlcnNcRm94VGFpbGxsbFxBcHBEYXRhXFJvYW1pbmdcQWRvYmVcQWRvYmUgUGhvdG9zaG9wIDIwMjBcQXV0b1JlY292ZXJcX+S4i+i9vTY5MDI5MjZFMjdFRTA5QUU5QUVDREVDM0FCN0U4QTAxLnBzYiDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTM6NDI6MzIrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5YigLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTM6NDU6MDYrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc6aOeLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTM6NDU6NDYrMDg6MDAmI3g5O+aWh+S7tiBDOlxVc2Vyc1xGb3hUYWlsbGxsXEFwcERhdGFcUm9hbWluZ1xBZG9iZVxBZG9iZSBQaG90b3Nob3AgMjAyMFxBdXRvUmVjb3Zlclxf5LiL6L29NjkwMjkyNkUyN0VFMDlBRTlBRUNERUMzQUI3RThBMDEucHNiIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yMlQxNDowNDo1OCswODowMCYjeDk75paH5Lu2IEM6XFVzZXJzXEZveFRhaWxsbGxcQXBwRGF0YVxSb2FtaW5nXEFkb2JlXEFkb2JlIFBob3Rvc2hvcCAyMDIwXEF1dG9SZWNvdmVyXF/kuIvovb02OTAyOTI2RTI3RUUwOUFFOUFFQ0RFQzNBQjdFOEEwMS5wc2Ig5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjA1OjQ0KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOmjni5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjA5OjUwKzA4OjAwJiN4OTvmlofku7YgQzpcVXNlcnNcRm94VGFpbGxsbFxBcHBEYXRhXFJvYW1pbmdcQWRvYmVcQWRvYmUgUGhvdG9zaG9wIDIwMjBcQXV0b1JlY292ZXJcX+S4i+i9vTY5MDI5MjZFMjdFRTA5QUU5QUVDREVDM0FCN0U4QTAxLnBzYiDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MjE6NDUrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcazEucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyNToyNyswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzliKAucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyNTo0NiswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzpo54ucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyNjozNCswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxrMC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjI2OjUxKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXGsxLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6Mjc6MDUrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5LiL6L29LnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6Mjc6NDUrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcazMucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyODowNiswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxrNC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjI4OjIyKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXGs1LnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6Mjk6MTIrMDg6MDAmI3g5O+aWh+S7tiBDOlxVc2Vyc1xGb3hUYWlsbGxsXEFwcERhdGFcUm9hbWluZ1xBZG9iZVxBZG9iZSBQaG90b3Nob3AgMjAyMFxBdXRvUmVjb3Zlclxf5LiL6L29NkZCNTNDNTE1MzlCNDc1NTlDRjBEMTIyQTgzMkNGNjMucHNiIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDozMjo0NiswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxzaDAucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDozMzowNCswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxzaDEucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDozMzoxNyswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxzaC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjM0OjEzKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXHNoMy5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjM0OjM4KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXHNoNC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjM0OjUyKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXHNoNS5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjM1OjA1KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOS4i+i9vS5wc2Qg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIxOjQ5OjU4KzA4OjAwJiN4OTvmlofku7Yg5LiL6L29LnBzZCDlt7LmiZPlvIAmI3hBOzIwMjAtMDYtMjNUMjE6NDk6NTkrMDg6MDAmI3g5O+aWh+S7tiDmibnms6ggMjAyMC0wNi0yMyAyMTM4NTkuanBnIOW3suWFs+mXrSYjeEE7MjAyMC0wNi0yM1QyMTo1MzoxOSswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzlvakucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMTo1MzozNCswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzliK4ucHNkIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMTo1Mzo1MCswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzliK4ucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMTo1Mzo1NyswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzkuIvovb0ucHNkIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMjoxNzoyNSswODowMCYjeDk75paH5Lu2IOS4i+i9vS5wc2Qg5bey5omT5byAJiN4QTsyMDIwLTA2LTIzVDIyOjE4OjM1KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOWIoC5wbmcg5bey5a2Y5YKoJiN4QTsiIHRpZmY6T3JpZW50YXRpb249IjEiIHRpZmY6WFJlc29sdXRpb249IjcyMDAwMC8xMDAwMCIgdGlmZjpZUmVzb2x1dGlvbj0iNzIwMDAwLzEwMDAwIiB0aWZmOlJlc29sdXRpb25Vbml0PSIyIiBleGlmOkNvbG9yU3BhY2U9IjEiIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSIyMCIgZXhpZjpQaXhlbFlEaW1lbnNpb249IjIwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ZGFjYTRhYzctMGMwZi04NjQ0LTk0MDctZDY3NjM1ODI1ZWE4IiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MTAzOGE4NWEtYjk3OC00ODQ3LWFhNTAtNWQ0NmVjY2UwZTgxIiBzdFJlZjpvcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NTk3REY0NzZBMjUwMTFFQTk3ODVFRjVDRDc1NkNCQzkiLz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iZGVyaXZlZCIgc3RFdnQ6cGFyYW1ldGVycz0iY29udmVydGVkIGZyb20gaW1hZ2UvcG5nIHRvIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjZhZTJkNTlmLTU1YzctZTk0OS1hNTVlLTM3MjIxMjRkOTUzMyIgc3RFdnQ6d2hlbj0iMjAyMC0wNi0yM1QyMDozNTowNSswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpkYWNhNGFjNy0wYzBmLTg2NDQtOTQwNy1kNjc2MzU4MjVlYTgiIHN0RXZ0OndoZW49IjIwMjAtMDYtMjNUMjI6MTg6MzUrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4xIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MzdjODMzYzAtZTA3Ni1mODQwLThlZmItYTAwNDZmMjAxNjE1IiBzdEV2dDp3aGVuPSIyMDIwLTA2LTIzVDIyOjE4OjM1KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDxwaG90b3Nob3A6VGV4dExheWVycz4gPHJkZjpCYWc+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0i5YigIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSLliKAiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSLpo54iIHBob3Rvc2hvcDpMYXllclRleHQ9IumjniIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9IuWIriIgcGhvdG9zaG9wOkxheWVyVGV4dD0i5YiuIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0i5b2pIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSLlvakiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrMCIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazAiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrMSIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazEiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrMiIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazIiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrMyIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazMiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrNCIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazQiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrNSIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazUiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJzaDAiIHBob3Rvc2hvcDpMYXllclRleHQ9InNoMCIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9InNoMSIgcGhvdG9zaG9wOkxheWVyVGV4dD0ic2gxIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0ic2gyIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJzaDIiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJzaDMiIHBob3Rvc2hvcDpMYXllclRleHQ9InNoMyIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9InNoNCIgcGhvdG9zaG9wOkxheWVyVGV4dD0ic2g0Ii8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0ic2g1IiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJzaDUiLz4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpUZXh0TGF5ZXJzPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PoRv/tgAAAB6SURBVDiN1ZNRDoAgDEOp8Wjl1Oxu8wuzDAdGicH+wEj2Al2BqqaZ2qbSfgHc/QGARPI0VkTg67onqaUU2P7whrbxChT1re/hdCB8sHPOt5JehzUcSjV/tEZa38NHwN6zGyBJ9SEe+WbVfD0LiureT2li81ZrDOVT4AGvuz31iYriXAAAAABJRU5ErkJggg==) no-repeat 0 0;width: 20px;height: 20px;float: left;border: 1px solid #fcfcfc;overflow: hidden;');
    //a.innerText = "删除线文字";
    div.appendChild(a);
    document.getElementById(editorid + "_controls").appendChild(div);
    a.addEventListener('click', function () {
        showEditorMenu2();
        //doane();
    }, false);

    function showEditorMenu2() {
        var ctrlid = editorid + '_gradient';
        var menutype = 'menu';
        var menupos = '43!';
        var menu = document.createElement('div');
        menu.id = ctrlid + '_menu';
        menu.style.display = 'none';
        menu.className = 'p_pof upf';
        menu.style.width = '270px';
        s = '<div class="p_opt cl"><span class="y" style="margin:-10px -10px 0 0"><a onclick="hideMenu();return false;" class="flbc" href="javascript:;">关闭</a></span><div>' + '请输入要插入删除线的文字:<br /><textarea id="' + ctrlid + '_param_1" style="width: 98%" cols="50" rows="5" class="txtarea"></textarea>' + '</div><div class="pns mtn"><button type="submit" id="' + ctrlid + '_submit" class="pn pnc"><strong>提交</strong></button></div></div>';
        menu.innerHTML = s;
        $(editorid + '_editortoolbar').appendChild(menu);
        showMenu({
            'ctrlid': ctrlid,
            'mtype': menutype,
            'evt': 'click',
            'duration': 3,
            'cache': 0,
            'drag': 1,
            'pos': menupos
        });

        try {
            if ($(ctrlid + '_param_1')) {
                $(ctrlid + '_param_1').focus();
            }
        } catch (e) { }
        var objs = menu.getElementsByTagName('*');
        for (var i = 0; i < objs.length; i++) {
            _attachEvent(objs[i], 'keydown',
                         function (e) {
                var obj = e.target;
                if ((obj.type == 'text' && e.keyCode == 13) || (obj.type == 'textarea' && e.ctrlKey && e.keyCode == 13)) {
                    if ($(ctrlid + '_submit') && tag != 'image') $(ctrlid + '_submit').click();
                    doane(e);
                } else if (e.keyCode == 27) {
                    hideMenu();
                    doane(e);
                }
            });
        }
        if ($(ctrlid + '_submit')) $(ctrlid + '_submit').onclick = function () {
            checkFocus();
            if (!str) {
                str = '';
                var first = $(ctrlid + '_param_1').value;
                var str = ConvertGrantWord(first);
                //insertText((opentag + str + closetag), strlen(opentag), strlen(closetag), true, sel);
                insertText(str, str.length, 0, false , getSel());
                switchEditor(0);
                switchEditor(1);
                hideMenu();

            }
        }
    }
    // Your code here...
})();

(function () {
    'use strict';
    var parseColor = function (hexStr) {
        return hexStr.length === 4 ? hexStr.substr(1).split('').map(function (s) { return 0x11 * parseInt(s, 16); }) : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function (s) { return parseInt(s, 16); })
    };

    // zero-pad 1 digit to 2
    var pad = function (s) {
        return (s.length === 1) ? '0' + s : s;
    };

    function ConvertGrantWord(str) {
        var result = '';
        result = "[fly]" + str + "[/fly]"
        return result;
    }


    /*insertText(result, 0, 0);
    switchEditor(0);
    switchEditor(1);
    console.log(result);*/

    var div = document.createElement('div');
    div.setAttribute('style', 'padding: 0 3px;');

    var a = document.createElement('a');
    a.setAttribute('id', editorid + '_gradient');
    a.setAttribute('title', '添加飞行文字');
    a.setAttribute('href', 'javascript:;');
    a.setAttribute('style', 'background: transparent  url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAaeGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTA2LTIyVDEyOjU3OjEwKzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wNi0yM1QyMjoxODo1MyswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wNi0yM1QyMjoxODo1MyswODowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDphYTYwODRhMS0wMzEzLTNjNDgtODc4Yy1kMTVkMmMxMTBiMzAiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDowMzUyMTZmNS0yMWZkLTRiNDktOTkxOS01MjMxYWQ4MjYwOTYiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1OTdERjQ3NkEyNTAxMUVBOTc4NUVGNUNENzU2Q0JDOSIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgcGhvdG9zaG9wOkhpc3Rvcnk9IjIwMjAtMDYtMjJUMTI6NTc6NDYrMDg6MDAmI3g5O+aWh+S7tiDkuIvovb0ucG5nIOW3suaJk+W8gCYjeEE7MjAyMC0wNi0yMlQxMzowNDowNSswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzliKAucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yMlQxMzowNzoyMiswODowMCYjeDk75paH5Lu2IEM6XFVzZXJzXEZveFRhaWxsbGxcQXBwRGF0YVxSb2FtaW5nXEFkb2JlXEFkb2JlIFBob3Rvc2hvcCAyMDIwXEF1dG9SZWNvdmVyXF/kuIvovb02OTAyOTI2RTI3RUUwOUFFOUFFQ0RFQzNBQjdFOEEwMS5wc2Ig5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIyVDEzOjM2OjEwKzA4OjAwJiN4OTvmlofku7YgQzpcVXNlcnNcRm94VGFpbGxsbFxBcHBEYXRhXFJvYW1pbmdcQWRvYmVcQWRvYmUgUGhvdG9zaG9wIDIwMjBcQXV0b1JlY292ZXJcX+S4i+i9vTY5MDI5MjZFMjdFRTA5QUU5QUVDREVDM0FCN0U4QTAxLnBzYiDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTM6NDI6MzIrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5YigLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTM6NDU6MDYrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc6aOeLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTM6NDU6NDYrMDg6MDAmI3g5O+aWh+S7tiBDOlxVc2Vyc1xGb3hUYWlsbGxsXEFwcERhdGFcUm9hbWluZ1xBZG9iZVxBZG9iZSBQaG90b3Nob3AgMjAyMFxBdXRvUmVjb3Zlclxf5LiL6L29NjkwMjkyNkUyN0VFMDlBRTlBRUNERUMzQUI3RThBMDEucHNiIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yMlQxNDowNDo1OCswODowMCYjeDk75paH5Lu2IEM6XFVzZXJzXEZveFRhaWxsbGxcQXBwRGF0YVxSb2FtaW5nXEFkb2JlXEFkb2JlIFBob3Rvc2hvcCAyMDIwXEF1dG9SZWNvdmVyXF/kuIvovb02OTAyOTI2RTI3RUUwOUFFOUFFQ0RFQzNBQjdFOEEwMS5wc2Ig5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjA1OjQ0KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOmjni5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjA5OjUwKzA4OjAwJiN4OTvmlofku7YgQzpcVXNlcnNcRm94VGFpbGxsbFxBcHBEYXRhXFJvYW1pbmdcQWRvYmVcQWRvYmUgUGhvdG9zaG9wIDIwMjBcQXV0b1JlY292ZXJcX+S4i+i9vTY5MDI5MjZFMjdFRTA5QUU5QUVDREVDM0FCN0U4QTAxLnBzYiDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MjE6NDUrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcazEucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyNToyNyswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzliKAucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyNTo0NiswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzpo54ucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyNjozNCswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxrMC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjI2OjUxKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXGsxLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6Mjc6MDUrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5LiL6L29LnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6Mjc6NDUrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcazMucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyODowNiswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxrNC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjI4OjIyKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXGs1LnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6Mjk6MTIrMDg6MDAmI3g5O+aWh+S7tiBDOlxVc2Vyc1xGb3hUYWlsbGxsXEFwcERhdGFcUm9hbWluZ1xBZG9iZVxBZG9iZSBQaG90b3Nob3AgMjAyMFxBdXRvUmVjb3Zlclxf5LiL6L29NkZCNTNDNTE1MzlCNDc1NTlDRjBEMTIyQTgzMkNGNjMucHNiIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDozMjo0NiswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxzaDAucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDozMzowNCswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxzaDEucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDozMzoxNyswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxzaC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjM0OjEzKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXHNoMy5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjM0OjM4KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXHNoNC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjM0OjUyKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXHNoNS5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjM1OjA1KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOS4i+i9vS5wc2Qg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIxOjQ5OjU4KzA4OjAwJiN4OTvmlofku7Yg5LiL6L29LnBzZCDlt7LmiZPlvIAmI3hBOzIwMjAtMDYtMjNUMjE6NDk6NTkrMDg6MDAmI3g5O+aWh+S7tiDmibnms6ggMjAyMC0wNi0yMyAyMTM4NTkuanBnIOW3suWFs+mXrSYjeEE7MjAyMC0wNi0yM1QyMTo1MzoxOSswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzlvakucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMTo1MzozNCswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzliK4ucHNkIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMTo1Mzo1MCswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzliK4ucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMTo1Mzo1NyswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzkuIvovb0ucHNkIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMjoxNzoyNSswODowMCYjeDk75paH5Lu2IOS4i+i9vS5wc2Qg5bey5omT5byAJiN4QTsyMDIwLTA2LTIzVDIyOjE4OjM1KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOWIoC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIyOjE4OjUzKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOmjni5wbmcg5bey5a2Y5YKoJiN4QTsiIHRpZmY6T3JpZW50YXRpb249IjEiIHRpZmY6WFJlc29sdXRpb249IjcyMDAwMC8xMDAwMCIgdGlmZjpZUmVzb2x1dGlvbj0iNzIwMDAwLzEwMDAwIiB0aWZmOlJlc29sdXRpb25Vbml0PSIyIiBleGlmOkNvbG9yU3BhY2U9IjEiIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSIyMCIgZXhpZjpQaXhlbFlEaW1lbnNpb249IjIwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6YjBlZDUxZTktNTFlZC1mYjRlLWIxYzQtMjU3NTE0ODM4MjIxIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MTAzOGE4NWEtYjk3OC00ODQ3LWFhNTAtNWQ0NmVjY2UwZTgxIiBzdFJlZjpvcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NTk3REY0NzZBMjUwMTFFQTk3ODVFRjVDRDc1NkNCQzkiLz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iZGVyaXZlZCIgc3RFdnQ6cGFyYW1ldGVycz0iY29udmVydGVkIGZyb20gaW1hZ2UvcG5nIHRvIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjZhZTJkNTlmLTU1YzctZTk0OS1hNTVlLTM3MjIxMjRkOTUzMyIgc3RFdnQ6d2hlbj0iMjAyMC0wNi0yM1QyMDozNTowNSswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpiMGVkNTFlOS01MWVkLWZiNGUtYjFjNC0yNTc1MTQ4MzgyMjEiIHN0RXZ0OndoZW49IjIwMjAtMDYtMjNUMjI6MTg6NTMrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4xIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YWE2MDg0YTEtMDMxMy0zYzQ4LTg3OGMtZDE1ZDJjMTEwYjMwIiBzdEV2dDp3aGVuPSIyMDIwLTA2LTIzVDIyOjE4OjUzKzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDxwaG90b3Nob3A6VGV4dExheWVycz4gPHJkZjpCYWc+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0i5YigIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSLliKAiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSLpo54iIHBob3Rvc2hvcDpMYXllclRleHQ9IumjniIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9IuWIriIgcGhvdG9zaG9wOkxheWVyVGV4dD0i5YiuIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0i5b2pIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSLlvakiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrMCIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazAiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrMSIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazEiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrMiIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazIiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrMyIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazMiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrNCIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazQiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrNSIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazUiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJzaDAiIHBob3Rvc2hvcDpMYXllclRleHQ9InNoMCIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9InNoMSIgcGhvdG9zaG9wOkxheWVyVGV4dD0ic2gxIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0ic2gyIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJzaDIiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJzaDMiIHBob3Rvc2hvcDpMYXllclRleHQ9InNoMyIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9InNoNCIgcGhvdG9zaG9wOkxheWVyVGV4dD0ic2g0Ii8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0ic2g1IiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJzaDUiLz4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpUZXh0TGF5ZXJzPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Ps5O5ycAAAB7SURBVDiN1ZJLDoAgDERb49GGW8/dxpVGKmAE42cSFjTh5dHWJdmdmW6l/QI4x0JKqdlUkh5r2RwkZacVACrd9++7vwxAJdsuYA3WBWzBuoBnuQwk6QAUB7TlM1NebYcMa5bDhtX+mZlHK/fqRhSBJDPGATia9/fwceACNpF2ZytRW1sAAAAASUVORK5CYII=) no-repeat 0 0;width: 20px;height: 20px;float: left;border: 1px solid #fcfcfc;overflow: hidden;');
    //a.innerText = "飞行文字";
    div.appendChild(a);
    document.getElementById(editorid + "_controls").appendChild(div);
    a.addEventListener('click', function () {
        showEditorMenu2();
        //doane();
    }, false);

    function showEditorMenu2() {
        var ctrlid = editorid + '_gradient';
        var menutype = 'menu';
        var menupos = '43!';
        var menu = document.createElement('div');
        menu.id = ctrlid + '_menu';
        menu.style.display = 'none';
        menu.className = 'p_pof upf';
        menu.style.width = '270px';
        s = '<div class="p_opt cl"><span class="y" style="margin:-10px -10px 0 0"><a onclick="hideMenu();return false;" class="flbc" href="javascript:;">关闭</a></span><div>' + '请输入要插入的飞行文字:<br /><textarea id="' + ctrlid + '_param_1" style="width: 98%" cols="50" rows="5" class="txtarea"></textarea>' + '</div><div class="pns mtn"><button type="submit" id="' + ctrlid + '_submit" class="pn pnc"><strong>提交</strong></button></div></div>';
        menu.innerHTML = s;
        $(editorid + '_editortoolbar').appendChild(menu);
        showMenu({
            'ctrlid': ctrlid,
            'mtype': menutype,
            'evt': 'click',
            'duration': 3,
            'cache': 0,
            'drag': 1,
            'pos': menupos
        });

        try {
            if ($(ctrlid + '_param_1')) {
                $(ctrlid + '_param_1').focus();
            }
        } catch (e) { }
        var objs = menu.getElementsByTagName('*');
        for (var i = 0; i < objs.length; i++) {
            _attachEvent(objs[i], 'keydown',
                         function (e) {
                var obj = e.target;
                if ((obj.type == 'text' && e.keyCode == 13) || (obj.type == 'textarea' && e.ctrlKey && e.keyCode == 13)) {
                    if ($(ctrlid + '_submit') && tag != 'image') $(ctrlid + '_submit').click();
                    doane(e);
                } else if (e.keyCode == 27) {
                    hideMenu();
                    doane(e);
                }
            });
        }
        if ($(ctrlid + '_submit')) $(ctrlid + '_submit').onclick = function () {
            checkFocus();
            if (!str) {
                str = '';
                var first = $(ctrlid + '_param_1').value;
                var str = ConvertGrantWord(first);
                //insertText((opentag + str + closetag), strlen(opentag), strlen(closetag), true, sel);
                insertText(str, str.length, 0, false , getSel());
                switchEditor(0);
                switchEditor(1);
                hideMenu();

            }
        }
    }
    // Your code here...
})();

(function () {
    'use strict';
    var parseColor = function (hexStr) {
        return hexStr.length === 4 ? hexStr.substr(1).split('').map(function (s) { return 0x11 * parseInt(s, 16); }) : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function (s) { return parseInt(s, 16); })
    };

    // zero-pad 1 digit to 2
    var pad = function (s) {
        return (s.length === 1) ? '0' + s : s;
    };

    function ConvertGrantWord(str) {
        var result = '';
        result = "[color=black][backcolor=black]" + str + "[/backcolor][/color]"
        return result;
    }


    /*insertText(result, 0, 0);
    switchEditor(0);
    switchEditor(1);
    console.log(result);*/

    var div = document.createElement('div');
    div.setAttribute('style', 'padding: 0 3px;');

    var a = document.createElement('a');
    a.setAttribute('id', editorid + '_gradient');
    a.setAttribute('title', '添加刮刮乐文字');
    a.setAttribute('href', 'javascript:;');
    a.setAttribute('style', 'background: transparent  url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAZVmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTA2LTIyVDEyOjU3OjEwKzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wNi0yM1QyMTo1Mzo1MCswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wNi0yM1QyMTo1Mzo1MCswODowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxYjQyZmQ5OS1iYzc4LTUyNDUtYTU4Ny1mMTBlMjZlOGZmZTgiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDphOGRiM2ZlOC1mODg5LWZhNDctYjI2Yi1lYWQ2YjBmYzk2ZTMiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1OTdERjQ3NkEyNTAxMUVBOTc4NUVGNUNENzU2Q0JDOSIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgcGhvdG9zaG9wOkhpc3Rvcnk9IjIwMjAtMDYtMjJUMTI6NTc6NDYrMDg6MDAmI3g5O+aWh+S7tiDkuIvovb0ucG5nIOW3suaJk+W8gCYjeEE7MjAyMC0wNi0yMlQxMzowNDowNSswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzliKAucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yMlQxMzowNzoyMiswODowMCYjeDk75paH5Lu2IEM6XFVzZXJzXEZveFRhaWxsbGxcQXBwRGF0YVxSb2FtaW5nXEFkb2JlXEFkb2JlIFBob3Rvc2hvcCAyMDIwXEF1dG9SZWNvdmVyXF/kuIvovb02OTAyOTI2RTI3RUUwOUFFOUFFQ0RFQzNBQjdFOEEwMS5wc2Ig5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIyVDEzOjM2OjEwKzA4OjAwJiN4OTvmlofku7YgQzpcVXNlcnNcRm94VGFpbGxsbFxBcHBEYXRhXFJvYW1pbmdcQWRvYmVcQWRvYmUgUGhvdG9zaG9wIDIwMjBcQXV0b1JlY292ZXJcX+S4i+i9vTY5MDI5MjZFMjdFRTA5QUU5QUVDREVDM0FCN0U4QTAxLnBzYiDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTM6NDI6MzIrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5YigLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTM6NDU6MDYrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc6aOeLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTM6NDU6NDYrMDg6MDAmI3g5O+aWh+S7tiBDOlxVc2Vyc1xGb3hUYWlsbGxsXEFwcERhdGFcUm9hbWluZ1xBZG9iZVxBZG9iZSBQaG90b3Nob3AgMjAyMFxBdXRvUmVjb3Zlclxf5LiL6L29NjkwMjkyNkUyN0VFMDlBRTlBRUNERUMzQUI3RThBMDEucHNiIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yMlQxNDowNDo1OCswODowMCYjeDk75paH5Lu2IEM6XFVzZXJzXEZveFRhaWxsbGxcQXBwRGF0YVxSb2FtaW5nXEFkb2JlXEFkb2JlIFBob3Rvc2hvcCAyMDIwXEF1dG9SZWNvdmVyXF/kuIvovb02OTAyOTI2RTI3RUUwOUFFOUFFQ0RFQzNBQjdFOEEwMS5wc2Ig5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjA1OjQ0KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOmjni5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjA5OjUwKzA4OjAwJiN4OTvmlofku7YgQzpcVXNlcnNcRm94VGFpbGxsbFxBcHBEYXRhXFJvYW1pbmdcQWRvYmVcQWRvYmUgUGhvdG9zaG9wIDIwMjBcQXV0b1JlY292ZXJcX+S4i+i9vTY5MDI5MjZFMjdFRTA5QUU5QUVDREVDM0FCN0U4QTAxLnBzYiDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MjE6NDUrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcazEucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyNToyNyswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzliKAucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyNTo0NiswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzpo54ucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyNjozNCswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxrMC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjI2OjUxKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXGsxLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6Mjc6MDUrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5LiL6L29LnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6Mjc6NDUrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcazMucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyODowNiswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxrNC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjI4OjIyKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXGs1LnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6Mjk6MTIrMDg6MDAmI3g5O+aWh+S7tiBDOlxVc2Vyc1xGb3hUYWlsbGxsXEFwcERhdGFcUm9hbWluZ1xBZG9iZVxBZG9iZSBQaG90b3Nob3AgMjAyMFxBdXRvUmVjb3Zlclxf5LiL6L29NkZCNTNDNTE1MzlCNDc1NTlDRjBEMTIyQTgzMkNGNjMucHNiIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDozMjo0NiswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxzaDAucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDozMzowNCswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxzaDEucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDozMzoxNyswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxzaC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjM0OjEzKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXHNoMy5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjM0OjM4KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXHNoNC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjM0OjUyKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXHNoNS5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjM1OjA1KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOS4i+i9vS5wc2Qg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIxOjQ5OjU4KzA4OjAwJiN4OTvmlofku7Yg5LiL6L29LnBzZCDlt7LmiZPlvIAmI3hBOzIwMjAtMDYtMjNUMjE6NDk6NTkrMDg6MDAmI3g5O+aWh+S7tiDmibnms6ggMjAyMC0wNi0yMyAyMTM4NTkuanBnIOW3suWFs+mXrSYjeEE7MjAyMC0wNi0yM1QyMTo1MzoxOSswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzlvakucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMTo1MzozNCswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzliK4ucHNkIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMTo1Mzo1MCswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzliK4ucG5nIOW3suWtmOWCqCYjeEE7IiB0aWZmOk9yaWVudGF0aW9uPSIxIiB0aWZmOlhSZXNvbHV0aW9uPSI3MjAwMDAvMTAwMDAiIHRpZmY6WVJlc29sdXRpb249IjcyMDAwMC8xMDAwMCIgdGlmZjpSZXNvbHV0aW9uVW5pdD0iMiIgZXhpZjpDb2xvclNwYWNlPSIxIiBleGlmOlBpeGVsWERpbWVuc2lvbj0iMjAiIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSIyMCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmYxYmIyZTdhLTMwOTAtMjY0ZC05MDU5LTcwZTM3OWYxMTE4MCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1OTdERjQ3NkEyNTAxMUVBOTc4NUVGNUNENzU2Q0JDOSIgc3RSZWY6b3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjU5N0RGNDc2QTI1MDExRUE5Nzg1RUY1Q0Q3NTZDQkM5Ii8+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImRlcml2ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImNvbnZlcnRlZCBmcm9tIGltYWdlL3BuZyB0byBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo2YWUyZDU5Zi01NWM3LWU5NDktYTU1ZS0zNzIyMTI0ZDk1MzMiIHN0RXZ0OndoZW49IjIwMjAtMDYtMjNUMjA6MzU6MDUrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4xIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZjFiYjJlN2EtMzA5MC0yNjRkLTkwNTktNzBlMzc5ZjExMTgwIiBzdEV2dDp3aGVuPSIyMDIwLTA2LTIzVDIxOjUzOjUwKzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iZGVyaXZlZCIgc3RFdnQ6cGFyYW1ldGVycz0iY29udmVydGVkIGZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjFiNDJmZDk5LWJjNzgtNTI0NS1hNTg3LWYxMGUyNmU4ZmZlOCIgc3RFdnQ6d2hlbj0iMjAyMC0wNi0yM1QyMTo1Mzo1MCswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8cGhvdG9zaG9wOlRleHRMYXllcnM+IDxyZGY6QmFnPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9IuWIoCIgcGhvdG9zaG9wOkxheWVyVGV4dD0i5YigIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0i6aOeIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSLpo54iLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSLliK4iIHBob3Rvc2hvcDpMYXllclRleHQ9IuWIriIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9IuW9qSIgcGhvdG9zaG9wOkxheWVyVGV4dD0i5b2pIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iazAiIHBob3Rvc2hvcDpMYXllclRleHQ9ImswIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iazEiIHBob3Rvc2hvcDpMYXllclRleHQ9ImsxIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iazIiIHBob3Rvc2hvcDpMYXllclRleHQ9ImsyIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iazMiIHBob3Rvc2hvcDpMYXllclRleHQ9ImszIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iazQiIHBob3Rvc2hvcDpMYXllclRleHQ9Ims0Ii8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iazUiIHBob3Rvc2hvcDpMYXllclRleHQ9Ims1Ii8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0ic2gwIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJzaDAiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJzaDEiIHBob3Rvc2hvcDpMYXllclRleHQ9InNoMSIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9InNoMiIgcGhvdG9zaG9wOkxheWVyVGV4dD0ic2gyIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0ic2gzIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJzaDMiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJzaDQiIHBob3Rvc2hvcDpMYXllclRleHQ9InNoNCIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9InNoNSIgcGhvdG9zaG9wOkxheWVyVGV4dD0ic2g1Ii8+IDwvcmRmOkJhZz4gPC9waG90b3Nob3A6VGV4dExheWVycz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6I0V2oAAAAbklEQVQ4jeWUUQrAIAxD2+HRcuzeLX4Jm7bqR7cxVhAUaXhJUSUpmXWkqt0hKCQvyysABDBcAmDfXyKB89nMNIUwopoRpmc4WO6pPMppfc+yR9H2O9N2Bb3m3Szff3or288MRSTObJWl/u8/TBes1zt1LK4gNRMAAAAASUVORK5CYII=) no-repeat 0 0;width: 20px;height: 20px;float: left;border: 1px solid #fcfcfc;overflow: hidden;');
    //a.innerText = "刮刮乐文字";
    div.appendChild(a);
    document.getElementById(editorid + "_controls").appendChild(div);
    a.addEventListener('click', function () {
        showEditorMenu2();
        //doane();
    }, false);

    function showEditorMenu2() {
        var ctrlid = editorid + '_gradient';
        var menutype = 'menu';
        var menupos = '43!';
        var menu = document.createElement('div');
        menu.id = ctrlid + '_menu';
        menu.style.display = 'none';
        menu.className = 'p_pof upf';
        menu.style.width = '270px';
        s = '<div class="p_opt cl"><span class="y" style="margin:-10px -10px 0 0"><a onclick="hideMenu();return false;" class="flbc" href="javascript:;">关闭</a></span><div>' + '请输入要插入的刮刮乐文字:<br /><textarea id="' + ctrlid + '_param_1" style="width: 98%" cols="50" rows="5" class="txtarea"></textarea>' + '</div><div class="pns mtn"><button type="submit" id="' + ctrlid + '_submit" class="pn pnc"><strong>提交</strong></button></div></div>';
        menu.innerHTML = s;
        $(editorid + '_editortoolbar').appendChild(menu);
        showMenu({
            'ctrlid': ctrlid,
            'mtype': menutype,
            'evt': 'click',
            'duration': 3,
            'cache': 0,
            'drag': 1,
            'pos': menupos
        });

        try {
            if ($(ctrlid + '_param_1')) {
                $(ctrlid + '_param_1').focus();
            }
        } catch (e) { }
        var objs = menu.getElementsByTagName('*');
        for (var i = 0; i < objs.length; i++) {
            _attachEvent(objs[i], 'keydown',
                         function (e) {
                var obj = e.target;
                if ((obj.type == 'text' && e.keyCode == 13) || (obj.type == 'textarea' && e.ctrlKey && e.keyCode == 13)) {
                    if ($(ctrlid + '_submit') && tag != 'image') $(ctrlid + '_submit').click();
                    doane(e);
                } else if (e.keyCode == 27) {
                    hideMenu();
                    doane(e);
                }
            });
        }
        if ($(ctrlid + '_submit')) $(ctrlid + '_submit').onclick = function () {
            checkFocus();
            if (!str) {
                str = '';
                var first = $(ctrlid + '_param_1').value;
                var str = ConvertGrantWord(first);
                //insertText((opentag + str + closetag), strlen(opentag), strlen(closetag), true, sel);
                insertText(str, str.length, 0, false , getSel());
                switchEditor(0);
                switchEditor(1);
                hideMenu();

            }
        }
    }
    // Your code here...
})();

(function () {
    'use strict';
    var parseColor = function (hexStr) {
        return hexStr.length === 4 ? hexStr.substr(1).split('').map(function (s) { return 0x11 * parseInt(s, 16); }) : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function (s) { return parseInt(s, 16); })
    };

    // zero-pad 1 digit to 2
    var pad = function (s) {
        return (s.length === 1) ? '0' + s : s;
    };

    function ConvertGrantWord(str) {
        var result = '';
        result = "[color=#f7f7f7]" + str + "[/color]"
        return result;
    }


    /*insertText(result, 0, 0);
    switchEditor(0);
    switchEditor(1);
    console.log(result);*/

    var div = document.createElement('div');
    div.setAttribute('style', 'padding: 0 3px;');

    var a = document.createElement('a');
    a.setAttribute('id', editorid + '_gradient');
    a.setAttribute('title', '添加彩蛋文字');
    a.setAttribute('href', 'javascript:;');
    a.setAttribute('style', 'background: transparent  url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAYzGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTA2LTIyVDEyOjU3OjEwKzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wNi0yM1QyMTo1MzoxOSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wNi0yM1QyMTo1MzoxOSswODowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDphMGQ4YmUzNC03ZjdkLTYwNDgtOTA4Ni1iNTZkZjM0NGI5OGIiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpmYjliYjA5NC1jNmU3LTk0NDQtYTRiNi1kMmY2NDBmNjQ3MGUiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1OTdERjQ3NkEyNTAxMUVBOTc4NUVGNUNENzU2Q0JDOSIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgcGhvdG9zaG9wOkhpc3Rvcnk9IjIwMjAtMDYtMjJUMTI6NTc6NDYrMDg6MDAmI3g5O+aWh+S7tiDkuIvovb0ucG5nIOW3suaJk+W8gCYjeEE7MjAyMC0wNi0yMlQxMzowNDowNSswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzliKAucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yMlQxMzowNzoyMiswODowMCYjeDk75paH5Lu2IEM6XFVzZXJzXEZveFRhaWxsbGxcQXBwRGF0YVxSb2FtaW5nXEFkb2JlXEFkb2JlIFBob3Rvc2hvcCAyMDIwXEF1dG9SZWNvdmVyXF/kuIvovb02OTAyOTI2RTI3RUUwOUFFOUFFQ0RFQzNBQjdFOEEwMS5wc2Ig5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIyVDEzOjM2OjEwKzA4OjAwJiN4OTvmlofku7YgQzpcVXNlcnNcRm94VGFpbGxsbFxBcHBEYXRhXFJvYW1pbmdcQWRvYmVcQWRvYmUgUGhvdG9zaG9wIDIwMjBcQXV0b1JlY292ZXJcX+S4i+i9vTY5MDI5MjZFMjdFRTA5QUU5QUVDREVDM0FCN0U4QTAxLnBzYiDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTM6NDI6MzIrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5YigLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTM6NDU6MDYrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc6aOeLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTM6NDU6NDYrMDg6MDAmI3g5O+aWh+S7tiBDOlxVc2Vyc1xGb3hUYWlsbGxsXEFwcERhdGFcUm9hbWluZ1xBZG9iZVxBZG9iZSBQaG90b3Nob3AgMjAyMFxBdXRvUmVjb3Zlclxf5LiL6L29NjkwMjkyNkUyN0VFMDlBRTlBRUNERUMzQUI3RThBMDEucHNiIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yMlQxNDowNDo1OCswODowMCYjeDk75paH5Lu2IEM6XFVzZXJzXEZveFRhaWxsbGxcQXBwRGF0YVxSb2FtaW5nXEFkb2JlXEFkb2JlIFBob3Rvc2hvcCAyMDIwXEF1dG9SZWNvdmVyXF/kuIvovb02OTAyOTI2RTI3RUUwOUFFOUFFQ0RFQzNBQjdFOEEwMS5wc2Ig5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjA1OjQ0KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOmjni5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjA5OjUwKzA4OjAwJiN4OTvmlofku7YgQzpcVXNlcnNcRm94VGFpbGxsbFxBcHBEYXRhXFJvYW1pbmdcQWRvYmVcQWRvYmUgUGhvdG9zaG9wIDIwMjBcQXV0b1JlY292ZXJcX+S4i+i9vTY5MDI5MjZFMjdFRTA5QUU5QUVDREVDM0FCN0U4QTAxLnBzYiDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MjE6NDUrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcazEucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyNToyNyswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzliKAucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyNTo0NiswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzpo54ucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyNjozNCswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxrMC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjI2OjUxKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXGsxLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6Mjc6MDUrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5LiL6L29LnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6Mjc6NDUrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcazMucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyODowNiswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxrNC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjI4OjIyKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXGs1LnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6Mjk6MTIrMDg6MDAmI3g5O+aWh+S7tiBDOlxVc2Vyc1xGb3hUYWlsbGxsXEFwcERhdGFcUm9hbWluZ1xBZG9iZVxBZG9iZSBQaG90b3Nob3AgMjAyMFxBdXRvUmVjb3Zlclxf5LiL6L29NkZCNTNDNTE1MzlCNDc1NTlDRjBEMTIyQTgzMkNGNjMucHNiIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDozMjo0NiswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxzaDAucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDozMzowNCswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxzaDEucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDozMzoxNyswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxzaC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjM0OjEzKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXHNoMy5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjM0OjM4KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXHNoNC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjM0OjUyKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXHNoNS5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjM1OjA1KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOS4i+i9vS5wc2Qg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIxOjQ5OjU4KzA4OjAwJiN4OTvmlofku7Yg5LiL6L29LnBzZCDlt7LmiZPlvIAmI3hBOzIwMjAtMDYtMjNUMjE6NDk6NTkrMDg6MDAmI3g5O+aWh+S7tiDmibnms6ggMjAyMC0wNi0yMyAyMTM4NTkuanBnIOW3suWFs+mXrSYjeEE7MjAyMC0wNi0yM1QyMTo1MzoxOSswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzlvakucG5nIOW3suWtmOWCqCYjeEE7IiB0aWZmOk9yaWVudGF0aW9uPSIxIiB0aWZmOlhSZXNvbHV0aW9uPSI3MjAwMDAvMTAwMDAiIHRpZmY6WVJlc29sdXRpb249IjcyMDAwMC8xMDAwMCIgdGlmZjpSZXNvbHV0aW9uVW5pdD0iMiIgZXhpZjpDb2xvclNwYWNlPSIxIiBleGlmOlBpeGVsWERpbWVuc2lvbj0iMjAiIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSIyMCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmVmOGJmYmI2LTUzZmYtYTQ0ZS04MDFlLTI3NjNmYjdjODFlZSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1OTdERjQ3NkEyNTAxMUVBOTc4NUVGNUNENzU2Q0JDOSIgc3RSZWY6b3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjU5N0RGNDc2QTI1MDExRUE5Nzg1RUY1Q0Q3NTZDQkM5Ii8+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImRlcml2ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImNvbnZlcnRlZCBmcm9tIGltYWdlL3BuZyB0byBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo2YWUyZDU5Zi01NWM3LWU5NDktYTU1ZS0zNzIyMTI0ZDk1MzMiIHN0RXZ0OndoZW49IjIwMjAtMDYtMjNUMjA6MzU6MDUrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4xIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZWY4YmZiYjYtNTNmZi1hNDRlLTgwMWUtMjc2M2ZiN2M4MWVlIiBzdEV2dDp3aGVuPSIyMDIwLTA2LTIzVDIxOjUzOjE5KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iZGVyaXZlZCIgc3RFdnQ6cGFyYW1ldGVycz0iY29udmVydGVkIGZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmEwZDhiZTM0LTdmN2QtNjA0OC05MDg2LWI1NmRmMzQ0Yjk4YiIgc3RFdnQ6d2hlbj0iMjAyMC0wNi0yM1QyMTo1MzoxOSswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8cGhvdG9zaG9wOlRleHRMYXllcnM+IDxyZGY6QmFnPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9IuWIoCIgcGhvdG9zaG9wOkxheWVyVGV4dD0i5YigIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0i6aOeIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSLpo54iLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSLliK4iIHBob3Rvc2hvcDpMYXllclRleHQ9IuWIriIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9IuW9qSIgcGhvdG9zaG9wOkxheWVyVGV4dD0i5b2pIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iazAiIHBob3Rvc2hvcDpMYXllclRleHQ9ImswIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iazEiIHBob3Rvc2hvcDpMYXllclRleHQ9ImsxIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iazIiIHBob3Rvc2hvcDpMYXllclRleHQ9ImsyIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iazMiIHBob3Rvc2hvcDpMYXllclRleHQ9ImszIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iazQiIHBob3Rvc2hvcDpMYXllclRleHQ9Ims0Ii8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iazUiIHBob3Rvc2hvcDpMYXllclRleHQ9Ims1Ii8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0ic2gwIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJzaDAiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJzaDEiIHBob3Rvc2hvcDpMYXllclRleHQ9InNoMSIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9InNoMiIgcGhvdG9zaG9wOkxheWVyVGV4dD0ic2gyIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0ic2gzIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJzaDMiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJzaDQiIHBob3Rvc2hvcDpMYXllclRleHQ9InNoNCIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9InNoNSIgcGhvdG9zaG9wOkxheWVyVGV4dD0ic2g1Ii8+IDwvcmRmOkJhZz4gPC9waG90b3Nob3A6VGV4dExheWVycz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4xLfcfAAAAlElEQVQ4jdWUSw6AMAhExXi09tbcDVckMKVgYxdK4gKwz+FjSUSOnXZupf0CeGGAiJzfWnNNZmayOWYmO4cBmAHwvTAnIu7J4Opj3J1HYAXBfAlcUaaxEjgrOYKhQkJI730K0SEoSH3HWFUYtSNVqHtoD1arUyqMJms/gP7jtZmVnO3h8Kdk5WV5taGHb+3719d24A3BXPxRptPONgAAAABJRU5ErkJggg==) no-repeat 0 0;width: 20px;height: 20px;float: left;border: 1px solid #fcfcfc;overflow: hidden;');
    //a.innerText = "彩蛋文字";
    div.appendChild(a);
    document.getElementById(editorid + "_controls").appendChild(div);
    a.addEventListener('click', function () {
        showEditorMenu2();
        //doane();
    }, false);

    function showEditorMenu2() {
        var ctrlid = editorid + '_gradient';
        var menutype = 'menu';
        var menupos = '43!';
        var menu = document.createElement('div');
        menu.id = ctrlid + '_menu';
        menu.style.display = 'none';
        menu.className = 'p_pof upf';
        menu.style.width = '270px';
        s = '<div class="p_opt cl"><span class="y" style="margin:-10px -10px 0 0"><a onclick="hideMenu();return false;" class="flbc" href="javascript:;">关闭</a></span><div>' + '请输入要插入的彩蛋文字:<br /><textarea id="' + ctrlid + '_param_1" style="width: 98%" cols="50" rows="5" class="txtarea"></textarea>' + '</div><div class="pns mtn"><button type="submit" id="' + ctrlid + '_submit" class="pn pnc"><strong>提交</strong></button></div></div>';
        menu.innerHTML = s;
        $(editorid + '_editortoolbar').appendChild(menu);
        showMenu({
            'ctrlid': ctrlid,
            'mtype': menutype,
            'evt': 'click',
            'duration': 3,
            'cache': 0,
            'drag': 1,
            'pos': menupos
        });

        try {
            if ($(ctrlid + '_param_1')) {
                $(ctrlid + '_param_1').focus();
            }
        } catch (e) { }
        var objs = menu.getElementsByTagName('*');
        for (var i = 0; i < objs.length; i++) {
            _attachEvent(objs[i], 'keydown',
                         function (e) {
                var obj = e.target;
                if ((obj.type == 'text' && e.keyCode == 13) || (obj.type == 'textarea' && e.ctrlKey && e.keyCode == 13)) {
                    if ($(ctrlid + '_submit') && tag != 'image') $(ctrlid + '_submit').click();
                    doane(e);
                } else if (e.keyCode == 27) {
                    hideMenu();
                    doane(e);
                }
            });
        }
        if ($(ctrlid + '_submit')) $(ctrlid + '_submit').onclick = function () {
            checkFocus();
            if (!str) {
                str = '';
                var first = $(ctrlid + '_param_1').value;
                var str = ConvertGrantWord(first);
                //insertText((opentag + str + closetag), strlen(opentag), strlen(closetag), true, sel);
                insertText(str, str.length, 0, false , getSel());
                switchEditor(0);
                switchEditor(1);
                hideMenu();

            }
        }
    }
    // Your code here...
})();

(function () {
    'use strict';
    var parseColor = function (hexStr) {
        return hexStr.length === 4 ? hexStr.substr(1).split('').map(function (s) { return 0x11 * parseInt(s, 16); }) : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function (s) { return parseInt(s, 16); })
    };

    // zero-pad 1 digit to 2
    var pad = function (s) {
        return (s.length === 1) ? '0' + s : s;
    };

    function ConvertGrantWord(str) {
        var result = '';
        result = "[k0]" + str + "[/k0]"
        return result;
    }


    /*insertText(result, 0, 0);
    switchEditor(0);
    switchEditor(1);
    console.log(result);*/

    var div = document.createElement('div');
    div.setAttribute('style', 'padding: 0 3px;');

    var a = document.createElement('a');
    a.setAttribute('id', editorid + '_gradient');
    a.setAttribute('title', '添加章节标题[k0]');
    a.setAttribute('href', 'javascript:;');
    a.setAttribute('style', 'background: transparent  url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAOumlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMC0wNi0yMlQxMjo1NzoxMCswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDYtMjNUMjA6MjY6MzQrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjAtMDYtMjNUMjA6MjY6MzQrMDg6MDAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ZTAwZGRlM2MtMGU0Yy04ZTQ5LWFkYWMtMDM4YzM4YWI4ZDc1IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6YzI2YmFmYWEtODNkNy04MzRlLTg4MDYtODUxYmE1NGY4Y2RjIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NTk3REY0NzZBMjUwMTFFQTk3ODVFRjVDRDc1NkNCQzkiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHBob3Rvc2hvcDpIaXN0b3J5PSIyMDIwLTA2LTIyVDEyOjU3OjQ2KzA4OjAwJiN4OTvmlofku7Yg5LiL6L29LnBuZyDlt7LmiZPlvIAmI3hBOzIwMjAtMDYtMjJUMTM6MDQ6MDUrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5YigLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTM6MDc6MjIrMDg6MDAmI3g5O+aWh+S7tiBDOlxVc2Vyc1xGb3hUYWlsbGxsXEFwcERhdGFcUm9hbWluZ1xBZG9iZVxBZG9iZSBQaG90b3Nob3AgMjAyMFxBdXRvUmVjb3Zlclxf5LiL6L29NjkwMjkyNkUyN0VFMDlBRTlBRUNERUMzQUI3RThBMDEucHNiIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yMlQxMzozNjoxMCswODowMCYjeDk75paH5Lu2IEM6XFVzZXJzXEZveFRhaWxsbGxcQXBwRGF0YVxSb2FtaW5nXEFkb2JlXEFkb2JlIFBob3Rvc2hvcCAyMDIwXEF1dG9SZWNvdmVyXF/kuIvovb02OTAyOTI2RTI3RUUwOUFFOUFFQ0RFQzNBQjdFOEEwMS5wc2Ig5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIyVDEzOjQyOjMyKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOWIoC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIyVDEzOjQ1OjA2KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOmjni5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIyVDEzOjQ1OjQ2KzA4OjAwJiN4OTvmlofku7YgQzpcVXNlcnNcRm94VGFpbGxsbFxBcHBEYXRhXFJvYW1pbmdcQWRvYmVcQWRvYmUgUGhvdG9zaG9wIDIwMjBcQXV0b1JlY292ZXJcX+S4i+i9vTY5MDI5MjZFMjdFRTA5QUU5QUVDREVDM0FCN0U4QTAxLnBzYiDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTQ6MDQ6NTgrMDg6MDAmI3g5O+aWh+S7tiBDOlxVc2Vyc1xGb3hUYWlsbGxsXEFwcERhdGFcUm9hbWluZ1xBZG9iZVxBZG9iZSBQaG90b3Nob3AgMjAyMFxBdXRvUmVjb3Zlclxf5LiL6L29NjkwMjkyNkUyN0VFMDlBRTlBRUNERUMzQUI3RThBMDEucHNiIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDowNTo0NCswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzpo54ucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDowOTo1MCswODowMCYjeDk75paH5Lu2IEM6XFVzZXJzXEZveFRhaWxsbGxcQXBwRGF0YVxSb2FtaW5nXEFkb2JlXEFkb2JlIFBob3Rvc2hvcCAyMDIwXEF1dG9SZWNvdmVyXF/kuIvovb02OTAyOTI2RTI3RUUwOUFFOUFFQ0RFQzNBQjdFOEEwMS5wc2Ig5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjIxOjQ1KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXGsxLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MjU6MjcrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5YigLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MjU6NDYrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc6aOeLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MjY6MzQrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcazAucG5nIOW3suWtmOWCqCYjeEE7Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NTk3REY0NzNBMjUwMTFFQTk3ODVFRjVDRDc1NkNCQzkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NTk3REY0NzRBMjUwMTFFQTk3ODVFRjVDRDc1NkNCQzkiLz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NWI3OTM0MDQtOTJjMy1iMDQzLTlkY2UtMDA1MzAzNGY5ZGQyIiBzdEV2dDp3aGVuPSIyMDIwLTA2LTIzVDIwOjI2OjM0KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmUwMGRkZTNjLTBlNGMtOGU0OS1hZGFjLTAzOGMzOGFiOGQ3NSIgc3RFdnQ6d2hlbj0iMjAyMC0wNi0yM1QyMDoyNjozNCswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8cGhvdG9zaG9wOlRleHRMYXllcnM+IDxyZGY6QmFnPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9IuWIoCIgcGhvdG9zaG9wOkxheWVyVGV4dD0i5YigIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0i6aOeIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSLpo54iLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrMCIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazAiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrMSIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazEiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrMiIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazIiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrMyIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazMiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrNCIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazQiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrNSIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazUiLz4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpUZXh0TGF5ZXJzPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pt7k42oAAAB/SURBVDiN7ZQ7DsAgDEObqkczt/bd3AlEEYTy2VpLLKA8mwRhko6dOrfSvgm8yo0QgkiaVwQgTZKk5YMdTghAJK1pKumxcncvWb6X13cTApBnUsoFRlCvp6+AM7AmcBbWBK6oCozJRoaR5D2b2oTL85LhXrmVNBrVemz/f7isG9XObOMzqhT7AAAAAElFTkSuQmCC) no-repeat 0 0;width: 20px;height: 20px;float: left;border: 1px solid #fcfcfc;overflow: hidden;');
    //a.innerText = "章节标题[k0]";
    div.appendChild(a);
    document.getElementById(editorid + "_controls").appendChild(div);
    a.addEventListener('click', function () {
        showEditorMenu2();
        //doane();
    }, false);

    function showEditorMenu2() {
        var ctrlid = editorid + '_gradient';
        var menutype = 'menu';
        var menupos = '43!';
        var menu = document.createElement('div');
        menu.id = ctrlid + '_menu';
        menu.style.display = 'none';
        menu.className = 'p_pof upf';
        menu.style.width = '270px';
        s = '<div class="p_opt cl"><span class="y" style="margin:-10px -10px 0 0"><a onclick="hideMenu();return false;" class="flbc" href="javascript:;">关闭</a></span><div>' + '请输入要插入的章节标题[k0]:<br /><textarea id="' + ctrlid + '_param_1" style="width: 98%" cols="50" rows="5" class="txtarea"></textarea>' + '</div><div class="pns mtn"><button type="submit" id="' + ctrlid + '_submit" class="pn pnc"><strong>提交</strong></button></div></div>';
        menu.innerHTML = s;
        $(editorid + '_editortoolbar').appendChild(menu);
        showMenu({
            'ctrlid': ctrlid,
            'mtype': menutype,
            'evt': 'click',
            'duration': 3,
            'cache': 0,
            'drag': 1,
            'pos': menupos
        });

        try {
            if ($(ctrlid + '_param_1')) {
                $(ctrlid + '_param_1').focus();
            }
        } catch (e) { }
        var objs = menu.getElementsByTagName('*');
        for (var i = 0; i < objs.length; i++) {
            _attachEvent(objs[i], 'keydown',
                         function (e) {
                var obj = e.target;
                if ((obj.type == 'text' && e.keyCode == 13) || (obj.type == 'textarea' && e.ctrlKey && e.keyCode == 13)) {
                    if ($(ctrlid + '_submit') && tag != 'image') $(ctrlid + '_submit').click();
                    doane(e);
                } else if (e.keyCode == 27) {
                    hideMenu();
                    doane(e);
                }
            });
        }
        if ($(ctrlid + '_submit')) $(ctrlid + '_submit').onclick = function () {
            checkFocus();
            if (!str) {
                str = '';
                var first = $(ctrlid + '_param_1').value;
                var str = ConvertGrantWord(first);
                //insertText((opentag + str + closetag), strlen(opentag), strlen(closetag), true, sel);
                insertText(str, str.length, 0, false , getSel());
                switchEditor(0);
                switchEditor(1);
                hideMenu();

            }
        }
    }
    // Your code here...
})();

(function () {
    'use strict';
    var parseColor = function (hexStr) {
        return hexStr.length === 4 ? hexStr.substr(1).split('').map(function (s) { return 0x11 * parseInt(s, 16); }) : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function (s) { return parseInt(s, 16); })
    };

    // zero-pad 1 digit to 2
    var pad = function (s) {
        return (s.length === 1) ? '0' + s : s;
    };

    function ConvertGrantWord(str) {
        var result = '';
        result = "[k1]" + str + "[/k1]"
        return result;
    }


    /*insertText(result, 0, 0);
    switchEditor(0);
    switchEditor(1);
    console.log(result);*/

    var div = document.createElement('div');
    div.setAttribute('style', 'padding: 0 3px;');

    var a = document.createElement('a');
    a.setAttribute('id', editorid + '_gradient');
    a.setAttribute('title', '添加一号字标题[k1]');
    a.setAttribute('href', 'javascript:;');
    a.setAttribute('style', 'background: transparent  url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAO/mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMC0wNi0yMlQxMjo1NzoxMCswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDYtMjNUMjA6MjY6NTErMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjAtMDYtMjNUMjA6MjY6NTErMDg6MDAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6YjRhOTRiNWMtNGEzZS0xMzQ2LWFkOTEtMTNjNjUzODQyMzM2IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6YjFiOGJjYmMtMmQ2Zi1hZjQ3LWI1MDAtMWIzMjRjNDNkYmE1IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NTk3REY0NzZBMjUwMTFFQTk3ODVFRjVDRDc1NkNCQzkiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHBob3Rvc2hvcDpIaXN0b3J5PSIyMDIwLTA2LTIyVDEyOjU3OjQ2KzA4OjAwJiN4OTvmlofku7Yg5LiL6L29LnBuZyDlt7LmiZPlvIAmI3hBOzIwMjAtMDYtMjJUMTM6MDQ6MDUrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5YigLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTM6MDc6MjIrMDg6MDAmI3g5O+aWh+S7tiBDOlxVc2Vyc1xGb3hUYWlsbGxsXEFwcERhdGFcUm9hbWluZ1xBZG9iZVxBZG9iZSBQaG90b3Nob3AgMjAyMFxBdXRvUmVjb3Zlclxf5LiL6L29NjkwMjkyNkUyN0VFMDlBRTlBRUNERUMzQUI3RThBMDEucHNiIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yMlQxMzozNjoxMCswODowMCYjeDk75paH5Lu2IEM6XFVzZXJzXEZveFRhaWxsbGxcQXBwRGF0YVxSb2FtaW5nXEFkb2JlXEFkb2JlIFBob3Rvc2hvcCAyMDIwXEF1dG9SZWNvdmVyXF/kuIvovb02OTAyOTI2RTI3RUUwOUFFOUFFQ0RFQzNBQjdFOEEwMS5wc2Ig5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIyVDEzOjQyOjMyKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOWIoC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIyVDEzOjQ1OjA2KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOmjni5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIyVDEzOjQ1OjQ2KzA4OjAwJiN4OTvmlofku7YgQzpcVXNlcnNcRm94VGFpbGxsbFxBcHBEYXRhXFJvYW1pbmdcQWRvYmVcQWRvYmUgUGhvdG9zaG9wIDIwMjBcQXV0b1JlY292ZXJcX+S4i+i9vTY5MDI5MjZFMjdFRTA5QUU5QUVDREVDM0FCN0U4QTAxLnBzYiDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTQ6MDQ6NTgrMDg6MDAmI3g5O+aWh+S7tiBDOlxVc2Vyc1xGb3hUYWlsbGxsXEFwcERhdGFcUm9hbWluZ1xBZG9iZVxBZG9iZSBQaG90b3Nob3AgMjAyMFxBdXRvUmVjb3Zlclxf5LiL6L29NjkwMjkyNkUyN0VFMDlBRTlBRUNERUMzQUI3RThBMDEucHNiIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDowNTo0NCswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzpo54ucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDowOTo1MCswODowMCYjeDk75paH5Lu2IEM6XFVzZXJzXEZveFRhaWxsbGxcQXBwRGF0YVxSb2FtaW5nXEFkb2JlXEFkb2JlIFBob3Rvc2hvcCAyMDIwXEF1dG9SZWNvdmVyXF/kuIvovb02OTAyOTI2RTI3RUUwOUFFOUFFQ0RFQzNBQjdFOEEwMS5wc2Ig5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjIxOjQ1KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXGsxLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MjU6MjcrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5YigLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MjU6NDYrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc6aOeLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MjY6MzQrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcazAucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyNjo1MSswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxrMS5wbmcg5bey5a2Y5YKoJiN4QTsiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1OTdERjQ3M0EyNTAxMUVBOTc4NUVGNUNENzU2Q0JDOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1OTdERjQ3NEEyNTAxMUVBOTc4NUVGNUNENzU2Q0JDOSIvPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowNGE4NzQ0ZC05NGEyLWE3NDgtOTAwMC03NzRkNDFhZDE0MDQiIHN0RXZ0OndoZW49IjIwMjAtMDYtMjNUMjA6MjY6NTErMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4xIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YjRhOTRiNWMtNGEzZS0xMzQ2LWFkOTEtMTNjNjUzODQyMzM2IiBzdEV2dDp3aGVuPSIyMDIwLTA2LTIzVDIwOjI2OjUxKzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDxwaG90b3Nob3A6VGV4dExheWVycz4gPHJkZjpCYWc+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0i5YigIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSLliKAiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSLpo54iIHBob3Rvc2hvcDpMYXllclRleHQ9IumjniIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9ImswIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJrMCIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9ImsxIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJrMSIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9ImsyIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJrMiIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9ImszIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJrMyIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9Ims0IiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJrNCIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9Ims1IiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJrNSIvPiA8L3JkZjpCYWc+IDwvcGhvdG9zaG9wOlRleHRMYXllcnM+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+PZP86wAAAGdJREFUOI3t1EEOwCAIBEBp+rR9Nn/bnjzUCAp4a0k8GcclGIVkO1nXUe2bYCP5WgC2pwSA4/k7E8K7NNxyx1RVZvvLhCNgQVsJV2lCYAYzwSxmgpWagj1Z5E26YAV1W86g8v+H5XoA++5FoYJ5h5kAAAAASUVORK5CYII=) no-repeat 0 0;width: 20px;height: 20px;float: left;border: 1px solid #fcfcfc;overflow: hidden;');
    //a.innerText = "一号字标题[k1]";
    div.appendChild(a);
    document.getElementById(editorid + "_controls").appendChild(div);
    a.addEventListener('click', function () {
        showEditorMenu2();
        //doane();
    }, false);

    function showEditorMenu2() {
        var ctrlid = editorid + '_gradient';
        var menutype = 'menu';
        var menupos = '43!';
        var menu = document.createElement('div');
        menu.id = ctrlid + '_menu';
        menu.style.display = 'none';
        menu.className = 'p_pof upf';
        menu.style.width = '270px';
        s = '<div class="p_opt cl"><span class="y" style="margin:-10px -10px 0 0"><a onclick="hideMenu();return false;" class="flbc" href="javascript:;">关闭</a></span><div>' + '请输入要插入的一号字标题[k1]:<br /><textarea id="' + ctrlid + '_param_1" style="width: 98%" cols="50" rows="5" class="txtarea"></textarea>' + '</div><div class="pns mtn"><button type="submit" id="' + ctrlid + '_submit" class="pn pnc"><strong>提交</strong></button></div></div>';
        menu.innerHTML = s;
        $(editorid + '_editortoolbar').appendChild(menu);
        showMenu({
            'ctrlid': ctrlid,
            'mtype': menutype,
            'evt': 'click',
            'duration': 3,
            'cache': 0,
            'drag': 1,
            'pos': menupos
        });

        try {
            if ($(ctrlid + '_param_1')) {
                $(ctrlid + '_param_1').focus();
            }
        } catch (e) { }
        var objs = menu.getElementsByTagName('*');
        for (var i = 0; i < objs.length; i++) {
            _attachEvent(objs[i], 'keydown',
                         function (e) {
                var obj = e.target;
                if ((obj.type == 'text' && e.keyCode == 13) || (obj.type == 'textarea' && e.ctrlKey && e.keyCode == 13)) {
                    if ($(ctrlid + '_submit') && tag != 'image') $(ctrlid + '_submit').click();
                    doane(e);
                } else if (e.keyCode == 27) {
                    hideMenu();
                    doane(e);
                }
            });
        }
        if ($(ctrlid + '_submit')) $(ctrlid + '_submit').onclick = function () {
            checkFocus();
            if (!str) {
                str = '';
                var first = $(ctrlid + '_param_1').value;
                var str = ConvertGrantWord(first);
                //insertText((opentag + str + closetag), strlen(opentag), strlen(closetag), true, sel);
                insertText(str, str.length, 0, false , getSel());
                switchEditor(0);
                switchEditor(1);
                hideMenu();

            }
        }
    }
    // Your code here...
})();

(function () {
    'use strict';
    var parseColor = function (hexStr) {
        return hexStr.length === 4 ? hexStr.substr(1).split('').map(function (s) { return 0x11 * parseInt(s, 16); }) : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function (s) { return parseInt(s, 16); })
    };

    // zero-pad 1 digit to 2
    var pad = function (s) {
        return (s.length === 1) ? '0' + s : s;
    };

    function ConvertGrantWord(str) {
        var result = '';
        result = "[k2]" + str + "[/k2]"
        return result;
    }


    /*insertText(result, 0, 0);
    switchEditor(0);
    switchEditor(1);
    console.log(result);*/

    var div = document.createElement('div');
    div.setAttribute('style', 'padding: 0 3px;');

    var a = document.createElement('a');
    a.setAttribute('id', editorid + '_gradient');
    a.setAttribute('title', '添加二号字标题[k2]');
    a.setAttribute('href', 'javascript:;');
    a.setAttribute('style', 'background: transparent  url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAOZ2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMC0wNi0yMlQxMjo1NzoxMCswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDYtMjNUMjA6Mjc6MDUrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjAtMDYtMjNUMjA6Mjc6MDUrMDg6MDAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NGJkZGZjZGMtMTI2OC03YTQ5LWFiMmEtMzE2ZDlhYjk4ZDEwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjU5N0RGNDc2QTI1MDExRUE5Nzg1RUY1Q0Q3NTZDQkM5IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NTk3REY0NzZBMjUwMTFFQTk3ODVFRjVDRDc1NkNCQzkiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHBob3Rvc2hvcDpIaXN0b3J5PSIyMDIwLTA2LTIyVDEyOjU3OjQ2KzA4OjAwJiN4OTvmlofku7Yg5LiL6L29LnBuZyDlt7LmiZPlvIAmI3hBOzIwMjAtMDYtMjJUMTM6MDQ6MDUrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5YigLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTM6MDc6MjIrMDg6MDAmI3g5O+aWh+S7tiBDOlxVc2Vyc1xGb3hUYWlsbGxsXEFwcERhdGFcUm9hbWluZ1xBZG9iZVxBZG9iZSBQaG90b3Nob3AgMjAyMFxBdXRvUmVjb3Zlclxf5LiL6L29NjkwMjkyNkUyN0VFMDlBRTlBRUNERUMzQUI3RThBMDEucHNiIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yMlQxMzozNjoxMCswODowMCYjeDk75paH5Lu2IEM6XFVzZXJzXEZveFRhaWxsbGxcQXBwRGF0YVxSb2FtaW5nXEFkb2JlXEFkb2JlIFBob3Rvc2hvcCAyMDIwXEF1dG9SZWNvdmVyXF/kuIvovb02OTAyOTI2RTI3RUUwOUFFOUFFQ0RFQzNBQjdFOEEwMS5wc2Ig5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIyVDEzOjQyOjMyKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOWIoC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIyVDEzOjQ1OjA2KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOmjni5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIyVDEzOjQ1OjQ2KzA4OjAwJiN4OTvmlofku7YgQzpcVXNlcnNcRm94VGFpbGxsbFxBcHBEYXRhXFJvYW1pbmdcQWRvYmVcQWRvYmUgUGhvdG9zaG9wIDIwMjBcQXV0b1JlY292ZXJcX+S4i+i9vTY5MDI5MjZFMjdFRTA5QUU5QUVDREVDM0FCN0U4QTAxLnBzYiDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTQ6MDQ6NTgrMDg6MDAmI3g5O+aWh+S7tiBDOlxVc2Vyc1xGb3hUYWlsbGxsXEFwcERhdGFcUm9hbWluZ1xBZG9iZVxBZG9iZSBQaG90b3Nob3AgMjAyMFxBdXRvUmVjb3Zlclxf5LiL6L29NjkwMjkyNkUyN0VFMDlBRTlBRUNERUMzQUI3RThBMDEucHNiIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDowNTo0NCswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzpo54ucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDowOTo1MCswODowMCYjeDk75paH5Lu2IEM6XFVzZXJzXEZveFRhaWxsbGxcQXBwRGF0YVxSb2FtaW5nXEFkb2JlXEFkb2JlIFBob3Rvc2hvcCAyMDIwXEF1dG9SZWNvdmVyXF/kuIvovb02OTAyOTI2RTI3RUUwOUFFOUFFQ0RFQzNBQjdFOEEwMS5wc2Ig5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjIxOjQ1KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXGsxLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MjU6MjcrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5YigLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MjU6NDYrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc6aOeLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MjY6MzQrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcazAucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyNjo1MSswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxrMS5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjI3OjA1KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOS4i+i9vS5wbmcg5bey5a2Y5YKoJiN4QTsiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1OTdERjQ3M0EyNTAxMUVBOTc4NUVGNUNENzU2Q0JDOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1OTdERjQ3NEEyNTAxMUVBOTc4NUVGNUNENzU2Q0JDOSIvPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo0YmRkZmNkYy0xMjY4LTdhNDktYWIyYS0zMTZkOWFiOThkMTAiIHN0RXZ0OndoZW49IjIwMjAtMDYtMjNUMjA6Mjc6MDUrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4xIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPHBob3Rvc2hvcDpUZXh0TGF5ZXJzPiA8cmRmOkJhZz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSLliKAiIHBob3Rvc2hvcDpMYXllclRleHQ9IuWIoCIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9IumjniIgcGhvdG9zaG9wOkxheWVyVGV4dD0i6aOeIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iazAiIHBob3Rvc2hvcDpMYXllclRleHQ9ImswIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iazEiIHBob3Rvc2hvcDpMYXllclRleHQ9ImsxIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iazIiIHBob3Rvc2hvcDpMYXllclRleHQ9ImsyIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iazMiIHBob3Rvc2hvcDpMYXllclRleHQ9ImszIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iazQiIHBob3Rvc2hvcDpMYXllclRleHQ9Ims0Ii8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iazUiIHBob3Rvc2hvcDpMYXllclRleHQ9Ims1Ii8+IDwvcmRmOkJhZz4gPC9waG90b3Nob3A6VGV4dExheWVycz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5vp65QAAAAhUlEQVQ4je2USxKAIAxDqePRwq1zt7oBBpEWGNlplnxeStNBVDXs1LGV9k3g2S7EGJWkWBcA3FIkKXWwD6AnADczAJoMytrSk9vKey8ZAqsqpuQCM8jr6TRwBtb2NAQjlBHM21+ew5FZF5gPt2HMtMGs0IKOAnIHm6TksbEMkoqJ/P/ha10G61DBzP/U8AAAAABJRU5ErkJggg==) no-repeat 0 0;width: 20px;height: 20px;float: left;border: 1px solid #fcfcfc;overflow: hidden;');
    //a.innerText = "二号字标题[k2]";
    div.appendChild(a);
    document.getElementById(editorid + "_controls").appendChild(div);
    a.addEventListener('click', function () {
        showEditorMenu2();
        //doane();
    }, false);

    function showEditorMenu2() {
        var ctrlid = editorid + '_gradient';
        var menutype = 'menu';
        var menupos = '43!';
        var menu = document.createElement('div');
        menu.id = ctrlid + '_menu';
        menu.style.display = 'none';
        menu.className = 'p_pof upf';
        menu.style.width = '270px';
        s = '<div class="p_opt cl"><span class="y" style="margin:-10px -10px 0 0"><a onclick="hideMenu();return false;" class="flbc" href="javascript:;">关闭</a></span><div>' + '请输入要插入的二号字标题[k2]:<br /><textarea id="' + ctrlid + '_param_1" style="width: 98%" cols="50" rows="5" class="txtarea"></textarea>' + '</div><div class="pns mtn"><button type="submit" id="' + ctrlid + '_submit" class="pn pnc"><strong>提交</strong></button></div></div>';
        menu.innerHTML = s;
        $(editorid + '_editortoolbar').appendChild(menu);
        showMenu({
            'ctrlid': ctrlid,
            'mtype': menutype,
            'evt': 'click',
            'duration': 3,
            'cache': 0,
            'drag': 1,
            'pos': menupos
        });

        try {
            if ($(ctrlid + '_param_1')) {
                $(ctrlid + '_param_1').focus();
            }
        } catch (e) { }
        var objs = menu.getElementsByTagName('*');
        for (var i = 0; i < objs.length; i++) {
            _attachEvent(objs[i], 'keydown',
                         function (e) {
                var obj = e.target;
                if ((obj.type == 'text' && e.keyCode == 13) || (obj.type == 'textarea' && e.ctrlKey && e.keyCode == 13)) {
                    if ($(ctrlid + '_submit') && tag != 'image') $(ctrlid + '_submit').click();
                    doane(e);
                } else if (e.keyCode == 27) {
                    hideMenu();
                    doane(e);
                }
            });
        }
        if ($(ctrlid + '_submit')) $(ctrlid + '_submit').onclick = function () {
            checkFocus();
            if (!str) {
                str = '';
                var first = $(ctrlid + '_param_1').value;
                var str = ConvertGrantWord(first);
                //insertText((opentag + str + closetag), strlen(opentag), strlen(closetag), true, sel);
                insertText(str, str.length, 0, false , getSel());
                switchEditor(0);
                switchEditor(1);
                hideMenu();

            }
        }
    }
    // Your code here...
})();

(function () {
    'use strict';
    var parseColor = function (hexStr) {
        return hexStr.length === 4 ? hexStr.substr(1).split('').map(function (s) { return 0x11 * parseInt(s, 16); }) : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function (s) { return parseInt(s, 16); })
    };

    // zero-pad 1 digit to 2
    var pad = function (s) {
        return (s.length === 1) ? '0' + s : s;
    };

    function ConvertGrantWord(str) {
        var result = '';
        result = "[k3]" + str + "[/k3]"
        return result;
    }


    /*insertText(result, 0, 0);
    switchEditor(0);
    switchEditor(1);
    console.log(result);*/

    var div = document.createElement('div');
    div.setAttribute('style', 'padding: 0 3px;');

    var a = document.createElement('a');
    a.setAttribute('id', editorid + '_gradient');
    a.setAttribute('title', '添加三号字标题[k3]');
    a.setAttribute('href', 'javascript:;');
    a.setAttribute('style', 'background: transparent  url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAPimlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMC0wNi0yMlQxMjo1NzoxMCswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDYtMjNUMjA6Mjc6NDUrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjAtMDYtMjNUMjA6Mjc6NDUrMDg6MDAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjNlNTI0NjUtMGI1Yy0zMTQ4LWJjZDItNmRjMGMxZThkYjIyIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MWE3YTVhYjUtZDk0Yi05NzQxLThlNWYtNWFjMjZjMzFmM2QzIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NTk3REY0NzZBMjUwMTFFQTk3ODVFRjVDRDc1NkNCQzkiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHBob3Rvc2hvcDpIaXN0b3J5PSIyMDIwLTA2LTIyVDEyOjU3OjQ2KzA4OjAwJiN4OTvmlofku7Yg5LiL6L29LnBuZyDlt7LmiZPlvIAmI3hBOzIwMjAtMDYtMjJUMTM6MDQ6MDUrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5YigLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTM6MDc6MjIrMDg6MDAmI3g5O+aWh+S7tiBDOlxVc2Vyc1xGb3hUYWlsbGxsXEFwcERhdGFcUm9hbWluZ1xBZG9iZVxBZG9iZSBQaG90b3Nob3AgMjAyMFxBdXRvUmVjb3Zlclxf5LiL6L29NjkwMjkyNkUyN0VFMDlBRTlBRUNERUMzQUI3RThBMDEucHNiIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yMlQxMzozNjoxMCswODowMCYjeDk75paH5Lu2IEM6XFVzZXJzXEZveFRhaWxsbGxcQXBwRGF0YVxSb2FtaW5nXEFkb2JlXEFkb2JlIFBob3Rvc2hvcCAyMDIwXEF1dG9SZWNvdmVyXF/kuIvovb02OTAyOTI2RTI3RUUwOUFFOUFFQ0RFQzNBQjdFOEEwMS5wc2Ig5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIyVDEzOjQyOjMyKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOWIoC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIyVDEzOjQ1OjA2KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOmjni5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIyVDEzOjQ1OjQ2KzA4OjAwJiN4OTvmlofku7YgQzpcVXNlcnNcRm94VGFpbGxsbFxBcHBEYXRhXFJvYW1pbmdcQWRvYmVcQWRvYmUgUGhvdG9zaG9wIDIwMjBcQXV0b1JlY292ZXJcX+S4i+i9vTY5MDI5MjZFMjdFRTA5QUU5QUVDREVDM0FCN0U4QTAxLnBzYiDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTQ6MDQ6NTgrMDg6MDAmI3g5O+aWh+S7tiBDOlxVc2Vyc1xGb3hUYWlsbGxsXEFwcERhdGFcUm9hbWluZ1xBZG9iZVxBZG9iZSBQaG90b3Nob3AgMjAyMFxBdXRvUmVjb3Zlclxf5LiL6L29NjkwMjkyNkUyN0VFMDlBRTlBRUNERUMzQUI3RThBMDEucHNiIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDowNTo0NCswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzpo54ucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDowOTo1MCswODowMCYjeDk75paH5Lu2IEM6XFVzZXJzXEZveFRhaWxsbGxcQXBwRGF0YVxSb2FtaW5nXEFkb2JlXEFkb2JlIFBob3Rvc2hvcCAyMDIwXEF1dG9SZWNvdmVyXF/kuIvovb02OTAyOTI2RTI3RUUwOUFFOUFFQ0RFQzNBQjdFOEEwMS5wc2Ig5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjIxOjQ1KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXGsxLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MjU6MjcrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5YigLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MjU6NDYrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc6aOeLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MjY6MzQrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcazAucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyNjo1MSswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxrMS5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjI3OjA1KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOS4i+i9vS5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjI3OjQ1KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXGszLnBuZyDlt7LlrZjlgqgmI3hBOyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjU5N0RGNDczQTI1MDExRUE5Nzg1RUY1Q0Q3NTZDQkM5IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjU5N0RGNDc0QTI1MDExRUE5Nzg1RUY1Q0Q3NTZDQkM5Ii8+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjQzYTYyZjM0LWE0ODYtNzM0Zi05YTc5LWI3MDAyM2JhMTU3NSIgc3RFdnQ6d2hlbj0iMjAyMC0wNi0yM1QyMDoyNzo0NSswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo2M2U1MjQ2NS0wYjVjLTMxNDgtYmNkMi02ZGMwYzFlOGRiMjIiIHN0RXZ0OndoZW49IjIwMjAtMDYtMjNUMjA6Mjc6NDUrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4xIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPHBob3Rvc2hvcDpUZXh0TGF5ZXJzPiA8cmRmOkJhZz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSLliKAiIHBob3Rvc2hvcDpMYXllclRleHQ9IuWIoCIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9IumjniIgcGhvdG9zaG9wOkxheWVyVGV4dD0i6aOeIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iazAiIHBob3Rvc2hvcDpMYXllclRleHQ9ImswIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iazEiIHBob3Rvc2hvcDpMYXllclRleHQ9ImsxIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iazIiIHBob3Rvc2hvcDpMYXllclRleHQ9ImsyIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iazMiIHBob3Rvc2hvcDpMYXllclRleHQ9ImszIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iazQiIHBob3Rvc2hvcDpMYXllclRleHQ9Ims0Ii8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iazUiIHBob3Rvc2hvcDpMYXllclRleHQ9Ims1Ii8+IDwvcmRmOkJhZz4gPC9waG90b3Nob3A6VGV4dExheWVycz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7+2IGuAAAAhklEQVQ4jeWUSw6AIAxErfFow63nbnUjhk/boLAwcVaEpG+mFBBV3VZqX0r7J/BoN1JKSlK8AgD3FElKO9QOGAlAZXbBK/NHLUfJh4EAtGxzCphBVjLPxD1DDxaZuMCoKO8VCd8PxQK3MoFGimG5CS2otx4CWlCSUl4jq+3u6czq+7/NcuAJAPdMV/mg65YAAAAASUVORK5CYII=) no-repeat 0 0;width: 20px;height: 20px;float: left;border: 1px solid #fcfcfc;overflow: hidden;');
    //a.innerText = "三号字标题[k3]";
    div.appendChild(a);
    document.getElementById(editorid + "_controls").appendChild(div);
    a.addEventListener('click', function () {
        showEditorMenu2();
        //doane();
    }, false);

    function showEditorMenu2() {
        var ctrlid = editorid + '_gradient';
        var menutype = 'menu';
        var menupos = '43!';
        var menu = document.createElement('div');
        menu.id = ctrlid + '_menu';
        menu.style.display = 'none';
        menu.className = 'p_pof upf';
        menu.style.width = '270px';
        s = '<div class="p_opt cl"><span class="y" style="margin:-10px -10px 0 0"><a onclick="hideMenu();return false;" class="flbc" href="javascript:;">关闭</a></span><div>' + '请输入要插入的三号字标题[k3]:<br /><textarea id="' + ctrlid + '_param_1" style="width: 98%" cols="50" rows="5" class="txtarea"></textarea>' + '</div><div class="pns mtn"><button type="submit" id="' + ctrlid + '_submit" class="pn pnc"><strong>提交</strong></button></div></div>';
        menu.innerHTML = s;
        $(editorid + '_editortoolbar').appendChild(menu);
        showMenu({
            'ctrlid': ctrlid,
            'mtype': menutype,
            'evt': 'click',
            'duration': 3,
            'cache': 0,
            'drag': 1,
            'pos': menupos
        });

        try {
            if ($(ctrlid + '_param_1')) {
                $(ctrlid + '_param_1').focus();
            }
        } catch (e) { }
        var objs = menu.getElementsByTagName('*');
        for (var i = 0; i < objs.length; i++) {
            _attachEvent(objs[i], 'keydown',
                         function (e) {
                var obj = e.target;
                if ((obj.type == 'text' && e.keyCode == 13) || (obj.type == 'textarea' && e.ctrlKey && e.keyCode == 13)) {
                    if ($(ctrlid + '_submit') && tag != 'image') $(ctrlid + '_submit').click();
                    doane(e);
                } else if (e.keyCode == 27) {
                    hideMenu();
                    doane(e);
                }
            });
        }
        if ($(ctrlid + '_submit')) $(ctrlid + '_submit').onclick = function () {
            checkFocus();
            if (!str) {
                str = '';
                var first = $(ctrlid + '_param_1').value;
                var str = ConvertGrantWord(first);
                //insertText((opentag + str + closetag), strlen(opentag), strlen(closetag), true, sel);
                insertText(str, str.length, 0, false , getSel());
                switchEditor(0);
                switchEditor(1);
                hideMenu();

            }
        }
    }
    // Your code here...
})();

(function () {
    'use strict';
    var parseColor = function (hexStr) {
        return hexStr.length === 4 ? hexStr.substr(1).split('').map(function (s) { return 0x11 * parseInt(s, 16); }) : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function (s) { return parseInt(s, 16); })
    };

    // zero-pad 1 digit to 2
    var pad = function (s) {
        return (s.length === 1) ? '0' + s : s;
    };

    function ConvertGrantWord(str) {
        var result = '';
        result = "[k4]" + str + "[/k4]"
        return result;
    }


    /*insertText(result, 0, 0);
    switchEditor(0);
    switchEditor(1);
    console.log(result);*/

    var div = document.createElement('div');
    div.setAttribute('style', 'padding: 0 3px;');

    var a = document.createElement('a');
    a.setAttribute('id', editorid + '_gradient');
    a.setAttribute('title', '添加四号字标题[k4]');
    a.setAttribute('href', 'javascript:;');
    a.setAttribute('style', 'background: transparent  url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAPzmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMC0wNi0yMlQxMjo1NzoxMCswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDYtMjNUMjA6Mjg6MDYrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjAtMDYtMjNUMjA6Mjg6MDYrMDg6MDAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ZjgzYmE0MTQtNGI4ZS04YzQ2LWI2ODctNzlkN2M0NmZmYjZjIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6YjhhYjcxZGYtODUyYi00ZDRlLWJhYzgtYTEwNmE0YzY4ODY3IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NTk3REY0NzZBMjUwMTFFQTk3ODVFRjVDRDc1NkNCQzkiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHBob3Rvc2hvcDpIaXN0b3J5PSIyMDIwLTA2LTIyVDEyOjU3OjQ2KzA4OjAwJiN4OTvmlofku7Yg5LiL6L29LnBuZyDlt7LmiZPlvIAmI3hBOzIwMjAtMDYtMjJUMTM6MDQ6MDUrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5YigLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTM6MDc6MjIrMDg6MDAmI3g5O+aWh+S7tiBDOlxVc2Vyc1xGb3hUYWlsbGxsXEFwcERhdGFcUm9hbWluZ1xBZG9iZVxBZG9iZSBQaG90b3Nob3AgMjAyMFxBdXRvUmVjb3Zlclxf5LiL6L29NjkwMjkyNkUyN0VFMDlBRTlBRUNERUMzQUI3RThBMDEucHNiIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yMlQxMzozNjoxMCswODowMCYjeDk75paH5Lu2IEM6XFVzZXJzXEZveFRhaWxsbGxcQXBwRGF0YVxSb2FtaW5nXEFkb2JlXEFkb2JlIFBob3Rvc2hvcCAyMDIwXEF1dG9SZWNvdmVyXF/kuIvovb02OTAyOTI2RTI3RUUwOUFFOUFFQ0RFQzNBQjdFOEEwMS5wc2Ig5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIyVDEzOjQyOjMyKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOWIoC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIyVDEzOjQ1OjA2KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOmjni5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIyVDEzOjQ1OjQ2KzA4OjAwJiN4OTvmlofku7YgQzpcVXNlcnNcRm94VGFpbGxsbFxBcHBEYXRhXFJvYW1pbmdcQWRvYmVcQWRvYmUgUGhvdG9zaG9wIDIwMjBcQXV0b1JlY292ZXJcX+S4i+i9vTY5MDI5MjZFMjdFRTA5QUU5QUVDREVDM0FCN0U4QTAxLnBzYiDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTQ6MDQ6NTgrMDg6MDAmI3g5O+aWh+S7tiBDOlxVc2Vyc1xGb3hUYWlsbGxsXEFwcERhdGFcUm9hbWluZ1xBZG9iZVxBZG9iZSBQaG90b3Nob3AgMjAyMFxBdXRvUmVjb3Zlclxf5LiL6L29NjkwMjkyNkUyN0VFMDlBRTlBRUNERUMzQUI3RThBMDEucHNiIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDowNTo0NCswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzpo54ucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDowOTo1MCswODowMCYjeDk75paH5Lu2IEM6XFVzZXJzXEZveFRhaWxsbGxcQXBwRGF0YVxSb2FtaW5nXEFkb2JlXEFkb2JlIFBob3Rvc2hvcCAyMDIwXEF1dG9SZWNvdmVyXF/kuIvovb02OTAyOTI2RTI3RUUwOUFFOUFFQ0RFQzNBQjdFOEEwMS5wc2Ig5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjIxOjQ1KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXGsxLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MjU6MjcrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5YigLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MjU6NDYrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc6aOeLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MjY6MzQrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcazAucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyNjo1MSswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxrMS5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjI3OjA1KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOS4i+i9vS5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjI3OjQ1KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXGszLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6Mjg6MDYrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcazQucG5nIOW3suWtmOWCqCYjeEE7Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NTk3REY0NzNBMjUwMTFFQTk3ODVFRjVDRDc1NkNCQzkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NTk3REY0NzRBMjUwMTFFQTk3ODVFRjVDRDc1NkNCQzkiLz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MjNmYTg5Y2UtN2JmZC05YzQ1LThkZDQtMzQxODNiNjFhOGY5IiBzdEV2dDp3aGVuPSIyMDIwLTA2LTIzVDIwOjI4OjA2KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmY4M2JhNDE0LTRiOGUtOGM0Ni1iNjg3LTc5ZDdjNDZmZmI2YyIgc3RFdnQ6d2hlbj0iMjAyMC0wNi0yM1QyMDoyODowNiswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8cGhvdG9zaG9wOlRleHRMYXllcnM+IDxyZGY6QmFnPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9IuWIoCIgcGhvdG9zaG9wOkxheWVyVGV4dD0i5YigIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0i6aOeIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSLpo54iLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrMCIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazAiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrMSIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazEiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrMiIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazIiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrMyIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazMiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrNCIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazQiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrNSIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazUiLz4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpUZXh0TGF5ZXJzPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pg70pcUAAAB4SURBVDiN7ZRRCsAgDEPj2NFybO+WfQzBwdJO599W8EOwLy0JFklYWdtS2jeBkHQ5JB+71L9t/dMTOuEpYLRFCiSpO0CttQwDG6hvJikHC4EOFg1ggREsmg4A9kzRid3cTyGXQ2eGg6c5bKuNBB1IXJ6Blv8/fF0HVlRfgNpqM1IAAAAASUVORK5CYII=) no-repeat 0 0;width: 20px;height: 20px;float: left;border: 1px solid #fcfcfc;overflow: hidden;');
    //a.innerText = "四号字标题[k4]";
    div.appendChild(a);
    document.getElementById(editorid + "_controls").appendChild(div);
    a.addEventListener('click', function () {
        showEditorMenu2();
        //doane();
    }, false);

    function showEditorMenu2() {
        var ctrlid = editorid + '_gradient';
        var menutype = 'menu';
        var menupos = '43!';
        var menu = document.createElement('div');
        menu.id = ctrlid + '_menu';
        menu.style.display = 'none';
        menu.className = 'p_pof upf';
        menu.style.width = '270px';
        s = '<div class="p_opt cl"><span class="y" style="margin:-10px -10px 0 0"><a onclick="hideMenu();return false;" class="flbc" href="javascript:;">关闭</a></span><div>' + '请输入要插入的四号字标题[k4]:<br /><textarea id="' + ctrlid + '_param_1" style="width: 98%" cols="50" rows="5" class="txtarea"></textarea>' + '</div><div class="pns mtn"><button type="submit" id="' + ctrlid + '_submit" class="pn pnc"><strong>提交</strong></button></div></div>';
        menu.innerHTML = s;
        $(editorid + '_editortoolbar').appendChild(menu);
        showMenu({
            'ctrlid': ctrlid,
            'mtype': menutype,
            'evt': 'click',
            'duration': 3,
            'cache': 0,
            'drag': 1,
            'pos': menupos
        });

        try {
            if ($(ctrlid + '_param_1')) {
                $(ctrlid + '_param_1').focus();
            }
        } catch (e) { }
        var objs = menu.getElementsByTagName('*');
        for (var i = 0; i < objs.length; i++) {
            _attachEvent(objs[i], 'keydown',
                function (e) {
                    var obj = e.target;
                    if ((obj.type == 'text' && e.keyCode == 13) || (obj.type == 'textarea' && e.ctrlKey && e.keyCode == 13)) {
                        if ($(ctrlid + '_submit') && tag != 'image') $(ctrlid + '_submit').click();
                        doane(e);
                    } else if (e.keyCode == 27) {
                        hideMenu();
                        doane(e);
                    }
                });
        }
        if ($(ctrlid + '_submit')) $(ctrlid + '_submit').onclick = function () {
            checkFocus();
            if (!str) {
                str = '';
                var first = $(ctrlid + '_param_1').value;
                var str = ConvertGrantWord(first);
                //insertText((opentag + str + closetag), strlen(opentag), strlen(closetag), true, sel);
                insertText(str, str.length, 0, false , getSel());
                switchEditor(0);
                switchEditor(1);
                hideMenu();

            }
        }
    }
    // Your code here...
})();

(function () {
    'use strict';
    var parseColor = function (hexStr) {
        return hexStr.length === 4 ? hexStr.substr(1).split('').map(function (s) { return 0x11 * parseInt(s, 16); }) : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function (s) { return parseInt(s, 16); })
    };

    // zero-pad 1 digit to 2
    var pad = function (s) {
        return (s.length === 1) ? '0' + s : s;
    };

    function ConvertGrantWord(str) {
        var result = '';
        result = "[k5]" + str + "[/k5]"
        return result;
    }


    /*insertText(result, 0, 0);
    switchEditor(0);
    switchEditor(1);
    console.log(result);*/

    var div = document.createElement('div');
    div.setAttribute('style', 'padding: 0 3px;');

    var a = document.createElement('a');
    a.setAttribute('id', editorid + '_gradient');
    a.setAttribute('title', '添加五号字标题[k5]');
    a.setAttribute('href', 'javascript:;');
    a.setAttribute('style', 'background: transparent  url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAQEmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMC0wNi0yMlQxMjo1NzoxMCswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDYtMjNUMjA6Mjg6MjIrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjAtMDYtMjNUMjA6Mjg6MjIrMDg6MDAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6YmJkYmMyMmYtYzFmMi03MzQ0LWIyMDItM2NhOWVhZWRiNmQ2IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ZmMwMWJlODUtYTE1Yy0zYzRlLWE3NGQtZjhiODRhNTdkMzYzIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NTk3REY0NzZBMjUwMTFFQTk3ODVFRjVDRDc1NkNCQzkiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHBob3Rvc2hvcDpIaXN0b3J5PSIyMDIwLTA2LTIyVDEyOjU3OjQ2KzA4OjAwJiN4OTvmlofku7Yg5LiL6L29LnBuZyDlt7LmiZPlvIAmI3hBOzIwMjAtMDYtMjJUMTM6MDQ6MDUrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5YigLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTM6MDc6MjIrMDg6MDAmI3g5O+aWh+S7tiBDOlxVc2Vyc1xGb3hUYWlsbGxsXEFwcERhdGFcUm9hbWluZ1xBZG9iZVxBZG9iZSBQaG90b3Nob3AgMjAyMFxBdXRvUmVjb3Zlclxf5LiL6L29NjkwMjkyNkUyN0VFMDlBRTlBRUNERUMzQUI3RThBMDEucHNiIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yMlQxMzozNjoxMCswODowMCYjeDk75paH5Lu2IEM6XFVzZXJzXEZveFRhaWxsbGxcQXBwRGF0YVxSb2FtaW5nXEFkb2JlXEFkb2JlIFBob3Rvc2hvcCAyMDIwXEF1dG9SZWNvdmVyXF/kuIvovb02OTAyOTI2RTI3RUUwOUFFOUFFQ0RFQzNBQjdFOEEwMS5wc2Ig5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIyVDEzOjQyOjMyKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOWIoC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIyVDEzOjQ1OjA2KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOmjni5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIyVDEzOjQ1OjQ2KzA4OjAwJiN4OTvmlofku7YgQzpcVXNlcnNcRm94VGFpbGxsbFxBcHBEYXRhXFJvYW1pbmdcQWRvYmVcQWRvYmUgUGhvdG9zaG9wIDIwMjBcQXV0b1JlY292ZXJcX+S4i+i9vTY5MDI5MjZFMjdFRTA5QUU5QUVDREVDM0FCN0U4QTAxLnBzYiDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTQ6MDQ6NTgrMDg6MDAmI3g5O+aWh+S7tiBDOlxVc2Vyc1xGb3hUYWlsbGxsXEFwcERhdGFcUm9hbWluZ1xBZG9iZVxBZG9iZSBQaG90b3Nob3AgMjAyMFxBdXRvUmVjb3Zlclxf5LiL6L29NjkwMjkyNkUyN0VFMDlBRTlBRUNERUMzQUI3RThBMDEucHNiIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDowNTo0NCswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzpo54ucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDowOTo1MCswODowMCYjeDk75paH5Lu2IEM6XFVzZXJzXEZveFRhaWxsbGxcQXBwRGF0YVxSb2FtaW5nXEFkb2JlXEFkb2JlIFBob3Rvc2hvcCAyMDIwXEF1dG9SZWNvdmVyXF/kuIvovb02OTAyOTI2RTI3RUUwOUFFOUFFQ0RFQzNBQjdFOEEwMS5wc2Ig5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjIxOjQ1KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXGsxLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MjU6MjcrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5YigLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MjU6NDYrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc6aOeLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MjY6MzQrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcazAucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyNjo1MSswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxrMS5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjI3OjA1KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOS4i+i9vS5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjI3OjQ1KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXGszLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6Mjg6MDYrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcazQucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyODoyMiswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxrNS5wbmcg5bey5a2Y5YKoJiN4QTsiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1OTdERjQ3M0EyNTAxMUVBOTc4NUVGNUNENzU2Q0JDOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1OTdERjQ3NEEyNTAxMUVBOTc4NUVGNUNENzU2Q0JDOSIvPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo5MGZlNjM5ZS0zNzUxLTJhNDItODVkOC00ZWU1YjkyNzhlOGUiIHN0RXZ0OndoZW49IjIwMjAtMDYtMjNUMjA6Mjg6MjIrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4xIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YmJkYmMyMmYtYzFmMi03MzQ0LWIyMDItM2NhOWVhZWRiNmQ2IiBzdEV2dDp3aGVuPSIyMDIwLTA2LTIzVDIwOjI4OjIyKzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDxwaG90b3Nob3A6VGV4dExheWVycz4gPHJkZjpCYWc+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0i5YigIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSLliKAiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSLpo54iIHBob3Rvc2hvcDpMYXllclRleHQ9IumjniIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9ImswIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJrMCIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9ImsxIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJrMSIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9ImsyIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJrMiIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9ImszIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJrMyIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9Ims0IiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJrNCIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9Ims1IiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJrNSIvPiA8L3JkZjpCYWc+IDwvcGhvdG9zaG9wOlRleHRMYXllcnM+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Q5ZYPwAAAIZJREFUOI3llEsOwCAIREvTo8GpnbvRFY1B0H5M06SzMkIewqikqstMrVNp/wRufkNEFABFyczcOAiAamMb4EhZMdP7M2RmjVq9BTTQqM1a6QwzmD+tj5N/eiKiWXJWtJRy5D0yJSoYAi3xihld4FloFOtebABk18bWUdFajSlP9f3fZjpwB5cnRfDV1SQBAAAAAElFTkSuQmCC) no-repeat 0 0;width: 20px;height: 20px;float: left;border: 1px solid #fcfcfc;overflow: hidden;');
    //a.innerText = "五号字标题[k5]";
    div.appendChild(a);
    document.getElementById(editorid + "_controls").appendChild(div);
    a.addEventListener('click', function () {
        showEditorMenu2();
        //doane();
    }, false);

    function showEditorMenu2() {
        var ctrlid = editorid + '_gradient';
        var menutype = 'menu';
        var menupos = '43!';
        var menu = document.createElement('div');
        menu.id = ctrlid + '_menu';
        menu.style.display = 'none';
        menu.className = 'p_pof upf';
        menu.style.width = '270px';
        s = '<div class="p_opt cl"><span class="y" style="margin:-10px -10px 0 0"><a onclick="hideMenu();return false;" class="flbc" href="javascript:;">关闭</a></span><div>' + '请输入要插入的五号字标题[k5]:<br /><textarea id="' + ctrlid + '_param_1" style="width: 98%" cols="50" rows="5" class="txtarea"></textarea>' + '</div><div class="pns mtn"><button type="submit" id="' + ctrlid + '_submit" class="pn pnc"><strong>提交</strong></button></div></div>';
        menu.innerHTML = s;
        $(editorid + '_editortoolbar').appendChild(menu);
        showMenu({
            'ctrlid': ctrlid,
            'mtype': menutype,
            'evt': 'click',
            'duration': 3,
            'cache': 0,
            'drag': 1,
            'pos': menupos
        });

        try {
            if ($(ctrlid + '_param_1')) {
                $(ctrlid + '_param_1').focus();
            }
        } catch (e) { }
        var objs = menu.getElementsByTagName('*');
        for (var i = 0; i < objs.length; i++) {
            _attachEvent(objs[i], 'keydown',
                function (e) {
                    var obj = e.target;
                    if ((obj.type == 'text' && e.keyCode == 13) || (obj.type == 'textarea' && e.ctrlKey && e.keyCode == 13)) {
                        if ($(ctrlid + '_submit') && tag != 'image') $(ctrlid + '_submit').click();
                        doane(e);
                    } else if (e.keyCode == 27) {
                        hideMenu();
                        doane(e);
                    }
                });
        }
        if ($(ctrlid + '_submit')) $(ctrlid + '_submit').onclick = function () {
            checkFocus();
            if (!str) {
                str = '';
                var first = $(ctrlid + '_param_1').value;
                var str = ConvertGrantWord(first);
                //insertText((opentag + str + closetag), strlen(opentag), strlen(closetag), true, sel);
                insertText(str, str.length, 0, false , getSel());
                switchEditor(0);
                switchEditor(1);
                hideMenu();

            }
        }
    }
    // Your code here...
})();

(function () {
    'use strict';
    var parseColor = function (hexStr) {
        return hexStr.length === 4 ? hexStr.substr(1).split('').map(function (s) { return 0x11 * parseInt(s, 16); }) : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function (s) { return parseInt(s, 16); })
    };

    // zero-pad 1 digit to 2
    var pad = function (s) {
        return (s.length === 1) ? '0' + s : s;
    };

    function ConvertGrantWord(str) {
        var result = '';
        result = "[sh0]" + str + "[/sh0]"
        return result;
    }


    /*insertText(result, 0, 0);
    switchEditor(0);
    switchEditor(1);
    console.log(result);*/

    var div = document.createElement('div');
    div.setAttribute('style', 'padding: 0 3px;');

    var a = document.createElement('a');
    a.setAttribute('id', editorid + '_gradient');
    a.setAttribute('title', '添加章节标题[sh0]');
    a.setAttribute('href', 'javascript:;');
    a.setAttribute('style', 'background: transparent  url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAASdWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMC0wNi0yMlQxMjo1NzoxMCswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDYtMjNUMjA6MzI6NDYrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjAtMDYtMjNUMjA6MzI6NDYrMDg6MDAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NmVmNDc1ODMtNjU1OS1jZjQ5LWJhZmQtMDk0NTZhZTBmMzI4IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6NDdkMmRiYzctMGJjMC00MjRhLTg5OTYtMDM0NmVmMmIzYmVkIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NTk3REY0NzZBMjUwMTFFQTk3ODVFRjVDRDc1NkNCQzkiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHBob3Rvc2hvcDpIaXN0b3J5PSIyMDIwLTA2LTIyVDEyOjU3OjQ2KzA4OjAwJiN4OTvmlofku7Yg5LiL6L29LnBuZyDlt7LmiZPlvIAmI3hBOzIwMjAtMDYtMjJUMTM6MDQ6MDUrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5YigLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTM6MDc6MjIrMDg6MDAmI3g5O+aWh+S7tiBDOlxVc2Vyc1xGb3hUYWlsbGxsXEFwcERhdGFcUm9hbWluZ1xBZG9iZVxBZG9iZSBQaG90b3Nob3AgMjAyMFxBdXRvUmVjb3Zlclxf5LiL6L29NjkwMjkyNkUyN0VFMDlBRTlBRUNERUMzQUI3RThBMDEucHNiIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yMlQxMzozNjoxMCswODowMCYjeDk75paH5Lu2IEM6XFVzZXJzXEZveFRhaWxsbGxcQXBwRGF0YVxSb2FtaW5nXEFkb2JlXEFkb2JlIFBob3Rvc2hvcCAyMDIwXEF1dG9SZWNvdmVyXF/kuIvovb02OTAyOTI2RTI3RUUwOUFFOUFFQ0RFQzNBQjdFOEEwMS5wc2Ig5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIyVDEzOjQyOjMyKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOWIoC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIyVDEzOjQ1OjA2KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOmjni5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIyVDEzOjQ1OjQ2KzA4OjAwJiN4OTvmlofku7YgQzpcVXNlcnNcRm94VGFpbGxsbFxBcHBEYXRhXFJvYW1pbmdcQWRvYmVcQWRvYmUgUGhvdG9zaG9wIDIwMjBcQXV0b1JlY292ZXJcX+S4i+i9vTY5MDI5MjZFMjdFRTA5QUU5QUVDREVDM0FCN0U4QTAxLnBzYiDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTQ6MDQ6NTgrMDg6MDAmI3g5O+aWh+S7tiBDOlxVc2Vyc1xGb3hUYWlsbGxsXEFwcERhdGFcUm9hbWluZ1xBZG9iZVxBZG9iZSBQaG90b3Nob3AgMjAyMFxBdXRvUmVjb3Zlclxf5LiL6L29NjkwMjkyNkUyN0VFMDlBRTlBRUNERUMzQUI3RThBMDEucHNiIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDowNTo0NCswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzpo54ucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDowOTo1MCswODowMCYjeDk75paH5Lu2IEM6XFVzZXJzXEZveFRhaWxsbGxcQXBwRGF0YVxSb2FtaW5nXEFkb2JlXEFkb2JlIFBob3Rvc2hvcCAyMDIwXEF1dG9SZWNvdmVyXF/kuIvovb02OTAyOTI2RTI3RUUwOUFFOUFFQ0RFQzNBQjdFOEEwMS5wc2Ig5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjIxOjQ1KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXGsxLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MjU6MjcrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5YigLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MjU6NDYrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc6aOeLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MjY6MzQrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcazAucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyNjo1MSswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxrMS5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjI3OjA1KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOS4i+i9vS5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjI3OjQ1KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXGszLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6Mjg6MDYrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcazQucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyODoyMiswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxrNS5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjI5OjEyKzA4OjAwJiN4OTvmlofku7YgQzpcVXNlcnNcRm94VGFpbGxsbFxBcHBEYXRhXFJvYW1pbmdcQWRvYmVcQWRvYmUgUGhvdG9zaG9wIDIwMjBcQXV0b1JlY292ZXJcX+S4i+i9vTZGQjUzQzUxNTM5QjQ3NTU5Q0YwRDEyMkE4MzJDRjYzLnBzYiDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MzI6NDYrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcc2gwLnBuZyDlt7LlrZjlgqgmI3hBOyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjU5N0RGNDczQTI1MDExRUE5Nzg1RUY1Q0Q3NTZDQkM5IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjU5N0RGNDc0QTI1MDExRUE5Nzg1RUY1Q0Q3NTZDQkM5Ii8+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjYwYjUxNDdkLTUzOTgtNjA0OS1hMTFiLTE0NTJhNWRhNGMwYSIgc3RFdnQ6d2hlbj0iMjAyMC0wNi0yM1QyMDozMjo0NiswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo2ZWY0NzU4My02NTU5LWNmNDktYmFmZC0wOTQ1NmFlMGYzMjgiIHN0RXZ0OndoZW49IjIwMjAtMDYtMjNUMjA6MzI6NDYrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4xIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPHBob3Rvc2hvcDpUZXh0TGF5ZXJzPiA8cmRmOkJhZz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSLliKAiIHBob3Rvc2hvcDpMYXllclRleHQ9IuWIoCIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9IumjniIgcGhvdG9zaG9wOkxheWVyVGV4dD0i6aOeIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iazAiIHBob3Rvc2hvcDpMYXllclRleHQ9ImswIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iazEiIHBob3Rvc2hvcDpMYXllclRleHQ9ImsxIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iazIiIHBob3Rvc2hvcDpMYXllclRleHQ9ImsyIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iazMiIHBob3Rvc2hvcDpMYXllclRleHQ9ImszIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iazQiIHBob3Rvc2hvcDpMYXllclRleHQ9Ims0Ii8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iazUiIHBob3Rvc2hvcDpMYXllclRleHQ9Ims1Ii8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0ic2gwIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJzaDAiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJzaDEiIHBob3Rvc2hvcDpMYXllclRleHQ9InNoMSIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9InNoMiIgcGhvdG9zaG9wOkxheWVyVGV4dD0ic2gyIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0ic2gzIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJzaDMiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJzaDQiIHBob3Rvc2hvcDpMYXllclRleHQ9InNoNCIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9InNoNSIgcGhvdG9zaG9wOkxheWVyVGV4dD0ic2g1Ii8+IDwvcmRmOkJhZz4gPC9waG90b3Nob3A6VGV4dExheWVycz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7+ddIAAAAAe0lEQVQ4je2UUQoAIQhENTqax/Zu7pe7w2yxFf21QhA2PEeFNCJkZ5SttDOBEhHSW4yZDW8sOXXVCBZzd837UssJSxDCCwvztPKYSxi6E5GnZTMLfuR8T4PxcsiCLwDH7ZDnMQtqOpwBZWHuqrJgBOruiotCvf6/zQHAC+zKUxKJWumIAAAAAElFTkSuQmCC) no-repeat 0 0;width: 20px;height: 20px;float: left;border: 1px solid #fcfcfc;overflow: hidden;');
    //a.innerText = "章节标题[sh0]";
    div.appendChild(a);
    document.getElementById(editorid + "_controls").appendChild(div);
    a.addEventListener('click', function () {
        showEditorMenu2();
        //doane();
    }, false);

    function showEditorMenu2() {
        var ctrlid = editorid + '_gradient';
        var menutype = 'menu';
        var menupos = '43!';
        var menu = document.createElement('div');
        menu.id = ctrlid + '_menu';
        menu.style.display = 'none';
        menu.className = 'p_pof upf';
        menu.style.width = '270px';
        s = '<div class="p_opt cl"><span class="y" style="margin:-10px -10px 0 0"><a onclick="hideMenu();return false;" class="flbc" href="javascript:;">关闭</a></span><div>' + '请输入要插入的章节标题[sh0]:<br /><textarea id="' + ctrlid + '_param_1" style="width: 98%" cols="50" rows="5" class="txtarea"></textarea>' + '</div><div class="pns mtn"><button type="submit" id="' + ctrlid + '_submit" class="pn pnc"><strong>提交</strong></button></div></div>';
        menu.innerHTML = s;
        $(editorid + '_editortoolbar').appendChild(menu);
        showMenu({
            'ctrlid': ctrlid,
            'mtype': menutype,
            'evt': 'click',
            'duration': 3,
            'cache': 0,
            'drag': 1,
            'pos': menupos
        });

        try {
            if ($(ctrlid + '_param_1')) {
                $(ctrlid + '_param_1').focus();
            }
        } catch (e) { }
        var objs = menu.getElementsByTagName('*');
        for (var i = 0; i < objs.length; i++) {
            _attachEvent(objs[i], 'keydown',
                         function (e) {
                var obj = e.target;
                if ((obj.type == 'text' && e.keyCode == 13) || (obj.type == 'textarea' && e.ctrlKey && e.keyCode == 13)) {
                    if ($(ctrlid + '_submit') && tag != 'image') $(ctrlid + '_submit').click();
                    doane(e);
                } else if (e.keyCode == 27) {
                    hideMenu();
                    doane(e);
                }
            });
        }
        if ($(ctrlid + '_submit')) $(ctrlid + '_submit').onclick = function () {
            checkFocus();
            if (!str) {
                str = '';
                var first = $(ctrlid + '_param_1').value;
                var str = ConvertGrantWord(first);
                //insertText((opentag + str + closetag), strlen(opentag), strlen(closetag), true, sel);
                insertText(str, str.length, 0, false , getSel());
                switchEditor(0);
                switchEditor(1);
                hideMenu();

            }
        }
    }
    // Your code here...
})();

(function () {
    'use strict';
    var parseColor = function (hexStr) {
        return hexStr.length === 4 ? hexStr.substr(1).split('').map(function (s) { return 0x11 * parseInt(s, 16); }) : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function (s) { return parseInt(s, 16); })
    };

    // zero-pad 1 digit to 2
    var pad = function (s) {
        return (s.length === 1) ? '0' + s : s;
    };

    function ConvertGrantWord(str) {
        var result = '';
        result = "[sh1]" + str + "[/sh1]"
        return result;
    }


    /*insertText(result, 0, 0);
    switchEditor(0);
    switchEditor(1);
    console.log(result);*/

    var div = document.createElement('div');
    div.setAttribute('style', 'padding: 0 3px;');

    var a = document.createElement('a');
    a.setAttribute('id', editorid + '_gradient');
    a.setAttribute('title', '添加一号字标题[sh1]');
    a.setAttribute('href', 'javascript:;');
    a.setAttribute('style', 'background: transparent  url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAASumlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMC0wNi0yMlQxMjo1NzoxMCswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDYtMjNUMjA6MzM6MDQrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjAtMDYtMjNUMjA6MzM6MDQrMDg6MDAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDljOWZlMjMtZTAzYi01ODQyLTllMzctZDVmYzIyZWFhYmE0IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6NzY5MTU1M2UtYjQ4MS04ZTRiLTg2MDQtZWJkNDhhYjcwZDBmIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NTk3REY0NzZBMjUwMTFFQTk3ODVFRjVDRDc1NkNCQzkiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHBob3Rvc2hvcDpIaXN0b3J5PSIyMDIwLTA2LTIyVDEyOjU3OjQ2KzA4OjAwJiN4OTvmlofku7Yg5LiL6L29LnBuZyDlt7LmiZPlvIAmI3hBOzIwMjAtMDYtMjJUMTM6MDQ6MDUrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5YigLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTM6MDc6MjIrMDg6MDAmI3g5O+aWh+S7tiBDOlxVc2Vyc1xGb3hUYWlsbGxsXEFwcERhdGFcUm9hbWluZ1xBZG9iZVxBZG9iZSBQaG90b3Nob3AgMjAyMFxBdXRvUmVjb3Zlclxf5LiL6L29NjkwMjkyNkUyN0VFMDlBRTlBRUNERUMzQUI3RThBMDEucHNiIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yMlQxMzozNjoxMCswODowMCYjeDk75paH5Lu2IEM6XFVzZXJzXEZveFRhaWxsbGxcQXBwRGF0YVxSb2FtaW5nXEFkb2JlXEFkb2JlIFBob3Rvc2hvcCAyMDIwXEF1dG9SZWNvdmVyXF/kuIvovb02OTAyOTI2RTI3RUUwOUFFOUFFQ0RFQzNBQjdFOEEwMS5wc2Ig5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIyVDEzOjQyOjMyKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOWIoC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIyVDEzOjQ1OjA2KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOmjni5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIyVDEzOjQ1OjQ2KzA4OjAwJiN4OTvmlofku7YgQzpcVXNlcnNcRm94VGFpbGxsbFxBcHBEYXRhXFJvYW1pbmdcQWRvYmVcQWRvYmUgUGhvdG9zaG9wIDIwMjBcQXV0b1JlY292ZXJcX+S4i+i9vTY5MDI5MjZFMjdFRTA5QUU5QUVDREVDM0FCN0U4QTAxLnBzYiDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTQ6MDQ6NTgrMDg6MDAmI3g5O+aWh+S7tiBDOlxVc2Vyc1xGb3hUYWlsbGxsXEFwcERhdGFcUm9hbWluZ1xBZG9iZVxBZG9iZSBQaG90b3Nob3AgMjAyMFxBdXRvUmVjb3Zlclxf5LiL6L29NjkwMjkyNkUyN0VFMDlBRTlBRUNERUMzQUI3RThBMDEucHNiIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDowNTo0NCswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzpo54ucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDowOTo1MCswODowMCYjeDk75paH5Lu2IEM6XFVzZXJzXEZveFRhaWxsbGxcQXBwRGF0YVxSb2FtaW5nXEFkb2JlXEFkb2JlIFBob3Rvc2hvcCAyMDIwXEF1dG9SZWNvdmVyXF/kuIvovb02OTAyOTI2RTI3RUUwOUFFOUFFQ0RFQzNBQjdFOEEwMS5wc2Ig5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjIxOjQ1KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXGsxLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MjU6MjcrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5YigLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MjU6NDYrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc6aOeLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MjY6MzQrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcazAucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyNjo1MSswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxrMS5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjI3OjA1KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOS4i+i9vS5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjI3OjQ1KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXGszLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6Mjg6MDYrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcazQucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyODoyMiswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxrNS5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjI5OjEyKzA4OjAwJiN4OTvmlofku7YgQzpcVXNlcnNcRm94VGFpbGxsbFxBcHBEYXRhXFJvYW1pbmdcQWRvYmVcQWRvYmUgUGhvdG9zaG9wIDIwMjBcQXV0b1JlY292ZXJcX+S4i+i9vTZGQjUzQzUxNTM5QjQ3NTU5Q0YwRDEyMkE4MzJDRjYzLnBzYiDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MzI6NDYrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcc2gwLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MzM6MDQrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcc2gxLnBuZyDlt7LlrZjlgqgmI3hBOyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjU5N0RGNDczQTI1MDExRUE5Nzg1RUY1Q0Q3NTZDQkM5IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjU5N0RGNDc0QTI1MDExRUE5Nzg1RUY1Q0Q3NTZDQkM5Ii8+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjNjYzU4ZjRhLTM1OTYtYWU0MC04ZmRlLWNiZWU3ZWVkYjQwNiIgc3RFdnQ6d2hlbj0iMjAyMC0wNi0yM1QyMDozMzowNCswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo0OWM5ZmUyMy1lMDNiLTU4NDItOWUzNy1kNWZjMjJlYWFiYTQiIHN0RXZ0OndoZW49IjIwMjAtMDYtMjNUMjA6MzM6MDQrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4xIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPHBob3Rvc2hvcDpUZXh0TGF5ZXJzPiA8cmRmOkJhZz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSLliKAiIHBob3Rvc2hvcDpMYXllclRleHQ9IuWIoCIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9IumjniIgcGhvdG9zaG9wOkxheWVyVGV4dD0i6aOeIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iazAiIHBob3Rvc2hvcDpMYXllclRleHQ9ImswIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iazEiIHBob3Rvc2hvcDpMYXllclRleHQ9ImsxIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iazIiIHBob3Rvc2hvcDpMYXllclRleHQ9ImsyIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iazMiIHBob3Rvc2hvcDpMYXllclRleHQ9ImszIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iazQiIHBob3Rvc2hvcDpMYXllclRleHQ9Ims0Ii8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iazUiIHBob3Rvc2hvcDpMYXllclRleHQ9Ims1Ii8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0ic2gwIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJzaDAiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJzaDEiIHBob3Rvc2hvcDpMYXllclRleHQ9InNoMSIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9InNoMiIgcGhvdG9zaG9wOkxheWVyVGV4dD0ic2gyIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0ic2gzIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJzaDMiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJzaDQiIHBob3Rvc2hvcDpMYXllclRleHQ9InNoNCIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9InNoNSIgcGhvdG9zaG9wOkxheWVyVGV4dD0ic2g1Ii8+IDwvcmRmOkJhZz4gPC9waG90b3Nob3A6VGV4dExheWVycz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6s4EmSAAAAbklEQVQ4je2UQQrAMAgEtfRpPtu/bU8GMQpJ6y3dUxAzrlkIA6BOXa20M4EEgKpgRGQpMWMA+O4wDr27QCnQN6kqx7qv2XkC2+7ZRBGBr1c95RtmF7yrFY2V4wq7INOU8luQaTisAtkV/7/NAcAHYq5Oyb3DW+4AAAAASUVORK5CYII=) no-repeat 0 0;width: 20px;height: 20px;float: left;border: 1px solid #fcfcfc;overflow: hidden;');
    //a.innerText = "一号字标题[sh1]";
    div.appendChild(a);
    document.getElementById(editorid + "_controls").appendChild(div);
    a.addEventListener('click', function () {
        showEditorMenu2();
        //doane();
    }, false);

    function showEditorMenu2() {
        var ctrlid = editorid + '_gradient';
        var menutype = 'menu';
        var menupos = '43!';
        var menu = document.createElement('div');
        menu.id = ctrlid + '_menu';
        menu.style.display = 'none';
        menu.className = 'p_pof upf';
        menu.style.width = '270px';
        s = '<div class="p_opt cl"><span class="y" style="margin:-10px -10px 0 0"><a onclick="hideMenu();return false;" class="flbc" href="javascript:;">关闭</a></span><div>' + '请输入要插入的一号字标题[sh1]:<br /><textarea id="' + ctrlid + '_param_1" style="width: 98%" cols="50" rows="5" class="txtarea"></textarea>' + '</div><div class="pns mtn"><button type="submit" id="' + ctrlid + '_submit" class="pn pnc"><strong>提交</strong></button></div></div>';
        menu.innerHTML = s;
        $(editorid + '_editortoolbar').appendChild(menu);
        showMenu({
            'ctrlid': ctrlid,
            'mtype': menutype,
            'evt': 'click',
            'duration': 3,
            'cache': 0,
            'drag': 1,
            'pos': menupos
        });

        try {
            if ($(ctrlid + '_param_1')) {
                $(ctrlid + '_param_1').focus();
            }
        } catch (e) { }
        var objs = menu.getElementsByTagName('*');
        for (var i = 0; i < objs.length; i++) {
            _attachEvent(objs[i], 'keydown',
                         function (e) {
                var obj = e.target;
                if ((obj.type == 'text' && e.keyCode == 13) || (obj.type == 'textarea' && e.ctrlKey && e.keyCode == 13)) {
                    if ($(ctrlid + '_submit') && tag != 'image') $(ctrlid + '_submit').click();
                    doane(e);
                } else if (e.keyCode == 27) {
                    hideMenu();
                    doane(e);
                }
            });
        }
        if ($(ctrlid + '_submit')) $(ctrlid + '_submit').onclick = function () {
            checkFocus();
            if (!str) {
                str = '';
                var first = $(ctrlid + '_param_1').value;
                var str = ConvertGrantWord(first);
                //insertText((opentag + str + closetag), strlen(opentag), strlen(closetag), true, sel);
                insertText(str, str.length, 0, false , getSel());
                switchEditor(0);
                switchEditor(1);
                hideMenu();

            }
        }
    }
    // Your code here...
})();

(function () {
    'use strict';
    var parseColor = function (hexStr) {
        return hexStr.length === 4 ? hexStr.substr(1).split('').map(function (s) { return 0x11 * parseInt(s, 16); }) : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function (s) { return parseInt(s, 16); })
    };

    // zero-pad 1 digit to 2
    var pad = function (s) {
        return (s.length === 1) ? '0' + s : s;
    };

    function ConvertGrantWord(str) {
        var result = '';
        result = "[sh2]" + str + "[/sh2]"
        return result;
    }


    /*insertText(result, 0, 0);
    switchEditor(0);
    switchEditor(1);
    console.log(result);*/

    var div = document.createElement('div');
    div.setAttribute('style', 'padding: 0 3px;');

    var a = document.createElement('a');
    a.setAttribute('id', editorid + '_gradient');
    a.setAttribute('title', '添加二号字标题[sh2]');
    a.setAttribute('href', 'javascript:;');
    a.setAttribute('style', 'background: transparent  url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAS/mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMC0wNi0yMlQxMjo1NzoxMCswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDYtMjNUMjA6MzM6MTcrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjAtMDYtMjNUMjA6MzM6MTcrMDg6MDAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6YjRiZTZjOWEtYjk2MS1iODRkLWJiOWUtOGQ2YjliY2FiYWQxIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ZmMyYWIyMzAtODdhNi04OTQzLThlZWItNzVjNjNmMGU5ZTA1IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NTk3REY0NzZBMjUwMTFFQTk3ODVFRjVDRDc1NkNCQzkiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHBob3Rvc2hvcDpIaXN0b3J5PSIyMDIwLTA2LTIyVDEyOjU3OjQ2KzA4OjAwJiN4OTvmlofku7Yg5LiL6L29LnBuZyDlt7LmiZPlvIAmI3hBOzIwMjAtMDYtMjJUMTM6MDQ6MDUrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5YigLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTM6MDc6MjIrMDg6MDAmI3g5O+aWh+S7tiBDOlxVc2Vyc1xGb3hUYWlsbGxsXEFwcERhdGFcUm9hbWluZ1xBZG9iZVxBZG9iZSBQaG90b3Nob3AgMjAyMFxBdXRvUmVjb3Zlclxf5LiL6L29NjkwMjkyNkUyN0VFMDlBRTlBRUNERUMzQUI3RThBMDEucHNiIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yMlQxMzozNjoxMCswODowMCYjeDk75paH5Lu2IEM6XFVzZXJzXEZveFRhaWxsbGxcQXBwRGF0YVxSb2FtaW5nXEFkb2JlXEFkb2JlIFBob3Rvc2hvcCAyMDIwXEF1dG9SZWNvdmVyXF/kuIvovb02OTAyOTI2RTI3RUUwOUFFOUFFQ0RFQzNBQjdFOEEwMS5wc2Ig5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIyVDEzOjQyOjMyKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOWIoC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIyVDEzOjQ1OjA2KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOmjni5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIyVDEzOjQ1OjQ2KzA4OjAwJiN4OTvmlofku7YgQzpcVXNlcnNcRm94VGFpbGxsbFxBcHBEYXRhXFJvYW1pbmdcQWRvYmVcQWRvYmUgUGhvdG9zaG9wIDIwMjBcQXV0b1JlY292ZXJcX+S4i+i9vTY5MDI5MjZFMjdFRTA5QUU5QUVDREVDM0FCN0U4QTAxLnBzYiDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTQ6MDQ6NTgrMDg6MDAmI3g5O+aWh+S7tiBDOlxVc2Vyc1xGb3hUYWlsbGxsXEFwcERhdGFcUm9hbWluZ1xBZG9iZVxBZG9iZSBQaG90b3Nob3AgMjAyMFxBdXRvUmVjb3Zlclxf5LiL6L29NjkwMjkyNkUyN0VFMDlBRTlBRUNERUMzQUI3RThBMDEucHNiIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDowNTo0NCswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzpo54ucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDowOTo1MCswODowMCYjeDk75paH5Lu2IEM6XFVzZXJzXEZveFRhaWxsbGxcQXBwRGF0YVxSb2FtaW5nXEFkb2JlXEFkb2JlIFBob3Rvc2hvcCAyMDIwXEF1dG9SZWNvdmVyXF/kuIvovb02OTAyOTI2RTI3RUUwOUFFOUFFQ0RFQzNBQjdFOEEwMS5wc2Ig5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjIxOjQ1KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXGsxLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MjU6MjcrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5YigLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MjU6NDYrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc6aOeLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MjY6MzQrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcazAucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyNjo1MSswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxrMS5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjI3OjA1KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOS4i+i9vS5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjI3OjQ1KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXGszLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6Mjg6MDYrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcazQucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyODoyMiswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxrNS5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjI5OjEyKzA4OjAwJiN4OTvmlofku7YgQzpcVXNlcnNcRm94VGFpbGxsbFxBcHBEYXRhXFJvYW1pbmdcQWRvYmVcQWRvYmUgUGhvdG9zaG9wIDIwMjBcQXV0b1JlY292ZXJcX+S4i+i9vTZGQjUzQzUxNTM5QjQ3NTU5Q0YwRDEyMkE4MzJDRjYzLnBzYiDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MzI6NDYrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcc2gwLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MzM6MDQrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcc2gxLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MzM6MTcrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcc2gucG5nIOW3suWtmOWCqCYjeEE7Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NTk3REY0NzNBMjUwMTFFQTk3ODVFRjVDRDc1NkNCQzkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NTk3REY0NzRBMjUwMTFFQTk3ODVFRjVDRDc1NkNCQzkiLz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZTlhMjYwMzEtOGEwYi1kNDRmLTg2NTktNjhjZjE5ZDU3NjVjIiBzdEV2dDp3aGVuPSIyMDIwLTA2LTIzVDIwOjMzOjE3KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmI0YmU2YzlhLWI5NjEtYjg0ZC1iYjllLThkNmI5YmNhYmFkMSIgc3RFdnQ6d2hlbj0iMjAyMC0wNi0yM1QyMDozMzoxNyswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8cGhvdG9zaG9wOlRleHRMYXllcnM+IDxyZGY6QmFnPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9IuWIoCIgcGhvdG9zaG9wOkxheWVyVGV4dD0i5YigIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0i6aOeIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSLpo54iLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrMCIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazAiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrMSIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazEiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrMiIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazIiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrMyIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazMiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrNCIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazQiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrNSIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazUiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJzaDAiIHBob3Rvc2hvcDpMYXllclRleHQ9InNoMCIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9InNoMSIgcGhvdG9zaG9wOkxheWVyVGV4dD0ic2gxIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0ic2gyIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJzaDIiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJzaDMiIHBob3Rvc2hvcDpMYXllclRleHQ9InNoMyIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9InNoNCIgcGhvdG9zaG9wOkxheWVyVGV4dD0ic2g0Ii8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0ic2g1IiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJzaDUiLz4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpUZXh0TGF5ZXJzPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PreAbloAAAB7SURBVDiN7ZRRDsAgCEPLsqP12N6t+xkJc7I545/jS0vygGI0SZgZ21TamkBIQrYYkt0bc84+2kgsVkoxPw8DI+SE2w2YVXU9amn47C2/SCrqmack5ZytTjyNlsGaHrr4ZbwaBjTeYZdPCezSYbaQN2i4GgDY/9ssADwApG1XCH1+7SgAAAAASUVORK5CYII=) no-repeat 0 0;width: 20px;height: 20px;float: left;border: 1px solid #fcfcfc;overflow: hidden;');
    //a.innerText = "二号字标题[sh2]";
    div.appendChild(a);
    document.getElementById(editorid + "_controls").appendChild(div);
    a.addEventListener('click', function () {
        showEditorMenu2();
        //doane();
    }, false);

    function showEditorMenu2() {
        var ctrlid = editorid + '_gradient';
        var menutype = 'menu';
        var menupos = '43!';
        var menu = document.createElement('div');
        menu.id = ctrlid + '_menu';
        menu.style.display = 'none';
        menu.className = 'p_pof upf';
        menu.style.width = '270px';
        s = '<div class="p_opt cl"><span class="y" style="margin:-10px -10px 0 0"><a onclick="hideMenu();return false;" class="flbc" href="javascript:;">关闭</a></span><div>' + '请输入要插入的二号字标题[sh2]:<br /><textarea id="' + ctrlid + '_param_1" style="width: 98%" cols="50" rows="5" class="txtarea"></textarea>' + '</div><div class="pns mtn"><button type="submit" id="' + ctrlid + '_submit" class="pn pnc"><strong>提交</strong></button></div></div>';
        menu.innerHTML = s;
        $(editorid + '_editortoolbar').appendChild(menu);
        showMenu({
            'ctrlid': ctrlid,
            'mtype': menutype,
            'evt': 'click',
            'duration': 3,
            'cache': 0,
            'drag': 1,
            'pos': menupos
        });

        try {
            if ($(ctrlid + '_param_1')) {
                $(ctrlid + '_param_1').focus();
            }
        } catch (e) { }
        var objs = menu.getElementsByTagName('*');
        for (var i = 0; i < objs.length; i++) {
            _attachEvent(objs[i], 'keydown',
                         function (e) {
                var obj = e.target;
                if ((obj.type == 'text' && e.keyCode == 13) || (obj.type == 'textarea' && e.ctrlKey && e.keyCode == 13)) {
                    if ($(ctrlid + '_submit') && tag != 'image') $(ctrlid + '_submit').click();
                    doane(e);
                } else if (e.keyCode == 27) {
                    hideMenu();
                    doane(e);
                }
            });
        }
        if ($(ctrlid + '_submit')) $(ctrlid + '_submit').onclick = function () {
            checkFocus();
            if (!str) {
                str = '';
                var first = $(ctrlid + '_param_1').value;
                var str = ConvertGrantWord(first);
                //insertText((opentag + str + closetag), strlen(opentag), strlen(closetag), true, sel);
                insertText(str, str.length, 0, false , getSel());
                switchEditor(0);
                switchEditor(1);
                hideMenu();

            }
        }
    }
    // Your code here...
})();

(function () {
    'use strict';
    var parseColor = function (hexStr) {
        return hexStr.length === 4 ? hexStr.substr(1).split('').map(function (s) { return 0x11 * parseInt(s, 16); }) : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function (s) { return parseInt(s, 16); })
    };

    // zero-pad 1 digit to 2
    var pad = function (s) {
        return (s.length === 1) ? '0' + s : s;
    };

    function ConvertGrantWord(str) {
        var result = '';
        result = "[sh3]" + str + "[/sh3]"
        return result;
    }


    /*insertText(result, 0, 0);
    switchEditor(0);
    switchEditor(1);
    console.log(result);*/

    var div = document.createElement('div');
    div.setAttribute('style', 'padding: 0 3px;');

    var a = document.createElement('a');
    a.setAttribute('id', editorid + '_gradient');
    a.setAttribute('title', '添加三号字标题[sh3]');
    a.setAttribute('href', 'javascript:;');
    a.setAttribute('style', 'background: transparent  url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAATBWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMC0wNi0yMlQxMjo1NzoxMCswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDYtMjNUMjA6MzQ6MTMrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjAtMDYtMjNUMjA6MzQ6MTMrMDg6MDAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6YzEwNDcwNTctYjA3Ni03OTQ0LTk3ZWUtNGYxZWNkNThjODJhIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MzU2YTJmZjYtMTc3My1mMjRiLWIzY2QtY2NlYmY3OTA4YzI3IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NTk3REY0NzZBMjUwMTFFQTk3ODVFRjVDRDc1NkNCQzkiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHBob3Rvc2hvcDpIaXN0b3J5PSIyMDIwLTA2LTIyVDEyOjU3OjQ2KzA4OjAwJiN4OTvmlofku7Yg5LiL6L29LnBuZyDlt7LmiZPlvIAmI3hBOzIwMjAtMDYtMjJUMTM6MDQ6MDUrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5YigLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTM6MDc6MjIrMDg6MDAmI3g5O+aWh+S7tiBDOlxVc2Vyc1xGb3hUYWlsbGxsXEFwcERhdGFcUm9hbWluZ1xBZG9iZVxBZG9iZSBQaG90b3Nob3AgMjAyMFxBdXRvUmVjb3Zlclxf5LiL6L29NjkwMjkyNkUyN0VFMDlBRTlBRUNERUMzQUI3RThBMDEucHNiIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yMlQxMzozNjoxMCswODowMCYjeDk75paH5Lu2IEM6XFVzZXJzXEZveFRhaWxsbGxcQXBwRGF0YVxSb2FtaW5nXEFkb2JlXEFkb2JlIFBob3Rvc2hvcCAyMDIwXEF1dG9SZWNvdmVyXF/kuIvovb02OTAyOTI2RTI3RUUwOUFFOUFFQ0RFQzNBQjdFOEEwMS5wc2Ig5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIyVDEzOjQyOjMyKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOWIoC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIyVDEzOjQ1OjA2KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOmjni5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIyVDEzOjQ1OjQ2KzA4OjAwJiN4OTvmlofku7YgQzpcVXNlcnNcRm94VGFpbGxsbFxBcHBEYXRhXFJvYW1pbmdcQWRvYmVcQWRvYmUgUGhvdG9zaG9wIDIwMjBcQXV0b1JlY292ZXJcX+S4i+i9vTY5MDI5MjZFMjdFRTA5QUU5QUVDREVDM0FCN0U4QTAxLnBzYiDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTQ6MDQ6NTgrMDg6MDAmI3g5O+aWh+S7tiBDOlxVc2Vyc1xGb3hUYWlsbGxsXEFwcERhdGFcUm9hbWluZ1xBZG9iZVxBZG9iZSBQaG90b3Nob3AgMjAyMFxBdXRvUmVjb3Zlclxf5LiL6L29NjkwMjkyNkUyN0VFMDlBRTlBRUNERUMzQUI3RThBMDEucHNiIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDowNTo0NCswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzpo54ucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDowOTo1MCswODowMCYjeDk75paH5Lu2IEM6XFVzZXJzXEZveFRhaWxsbGxcQXBwRGF0YVxSb2FtaW5nXEFkb2JlXEFkb2JlIFBob3Rvc2hvcCAyMDIwXEF1dG9SZWNvdmVyXF/kuIvovb02OTAyOTI2RTI3RUUwOUFFOUFFQ0RFQzNBQjdFOEEwMS5wc2Ig5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjIxOjQ1KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXGsxLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MjU6MjcrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5YigLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MjU6NDYrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc6aOeLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MjY6MzQrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcazAucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyNjo1MSswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxrMS5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjI3OjA1KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOS4i+i9vS5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjI3OjQ1KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXGszLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6Mjg6MDYrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcazQucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyODoyMiswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxrNS5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjI5OjEyKzA4OjAwJiN4OTvmlofku7YgQzpcVXNlcnNcRm94VGFpbGxsbFxBcHBEYXRhXFJvYW1pbmdcQWRvYmVcQWRvYmUgUGhvdG9zaG9wIDIwMjBcQXV0b1JlY292ZXJcX+S4i+i9vTZGQjUzQzUxNTM5QjQ3NTU5Q0YwRDEyMkE4MzJDRjYzLnBzYiDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MzI6NDYrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcc2gwLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MzM6MDQrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcc2gxLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MzM6MTcrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcc2gucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDozNDoxMyswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxzaDMucG5nIOW3suWtmOWCqCYjeEE7Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NTk3REY0NzNBMjUwMTFFQTk3ODVFRjVDRDc1NkNCQzkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NTk3REY0NzRBMjUwMTFFQTk3ODVFRjVDRDc1NkNCQzkiLz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NjE4YTllMjEtZjExZS1iMTRmLTkwMmEtY2FmYTc3NGIyNDgyIiBzdEV2dDp3aGVuPSIyMDIwLTA2LTIzVDIwOjM0OjEzKzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmMxMDQ3MDU3LWIwNzYtNzk0NC05N2VlLTRmMWVjZDU4YzgyYSIgc3RFdnQ6d2hlbj0iMjAyMC0wNi0yM1QyMDozNDoxMyswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8cGhvdG9zaG9wOlRleHRMYXllcnM+IDxyZGY6QmFnPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9IuWIoCIgcGhvdG9zaG9wOkxheWVyVGV4dD0i5YigIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0i6aOeIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSLpo54iLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrMCIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazAiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrMSIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazEiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrMiIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazIiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrMyIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazMiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrNCIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazQiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrNSIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazUiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJzaDAiIHBob3Rvc2hvcDpMYXllclRleHQ9InNoMCIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9InNoMSIgcGhvdG9zaG9wOkxheWVyVGV4dD0ic2gxIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0ic2gyIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJzaDIiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJzaDQiIHBob3Rvc2hvcDpMYXllclRleHQ9InNoNCIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9InNoNSIgcGhvdG9zaG9wOkxheWVyVGV4dD0ic2g1Ii8+IDwvcmRmOkJhZz4gPC9waG90b3Nob3A6VGV4dExheWVycz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6POHV/AAAAeUlEQVQ4je2USw7AIAhEofFoHJu7TTclmVpINLqzrIiMj59RAchOu7bSzgQKAKkWY2bDGwvOUoVmhj5pW4G5u4YvIvoBcrYQ8zmfsf+y6D2bV99Sr+F4OsMMWlbyxNxd+V7jYNXejH22PAqqnlTLBLNQ1uv/2xwAvAHQyVqbUeh10QAAAABJRU5ErkJggg==) no-repeat 0 0;width: 20px;height: 20px;float: left;border: 1px solid #fcfcfc;overflow: hidden;');
    //a.innerText = "三号字标题[sh3]";
    div.appendChild(a);
    document.getElementById(editorid + "_controls").appendChild(div);
    a.addEventListener('click', function () {
        showEditorMenu2();
        //doane();
    }, false);

    function showEditorMenu2() {
        var ctrlid = editorid + '_gradient';
        var menutype = 'menu';
        var menupos = '43!';
        var menu = document.createElement('div');
        menu.id = ctrlid + '_menu';
        menu.style.display = 'none';
        menu.className = 'p_pof upf';
        menu.style.width = '270px';
        s = '<div class="p_opt cl"><span class="y" style="margin:-10px -10px 0 0"><a onclick="hideMenu();return false;" class="flbc" href="javascript:;">关闭</a></span><div>' + '请输入要插入的三号字标题[sh3]:<br /><textarea id="' + ctrlid + '_param_1" style="width: 98%" cols="50" rows="5" class="txtarea"></textarea>' + '</div><div class="pns mtn"><button type="submit" id="' + ctrlid + '_submit" class="pn pnc"><strong>提交</strong></button></div></div>';
        menu.innerHTML = s;
        $(editorid + '_editortoolbar').appendChild(menu);
        showMenu({
            'ctrlid': ctrlid,
            'mtype': menutype,
            'evt': 'click',
            'duration': 3,
            'cache': 0,
            'drag': 1,
            'pos': menupos
        });

        try {
            if ($(ctrlid + '_param_1')) {
                $(ctrlid + '_param_1').focus();
            }
        } catch (e) { }
        var objs = menu.getElementsByTagName('*');
        for (var i = 0; i < objs.length; i++) {
            _attachEvent(objs[i], 'keydown',
                         function (e) {
                var obj = e.target;
                if ((obj.type == 'text' && e.keyCode == 13) || (obj.type == 'textarea' && e.ctrlKey && e.keyCode == 13)) {
                    if ($(ctrlid + '_submit') && tag != 'image') $(ctrlid + '_submit').click();
                    doane(e);
                } else if (e.keyCode == 27) {
                    hideMenu();
                    doane(e);
                }
            });
        }
        if ($(ctrlid + '_submit')) $(ctrlid + '_submit').onclick = function () {
            checkFocus();
            if (!str) {
                str = '';
                var first = $(ctrlid + '_param_1').value;
                var str = ConvertGrantWord(first);
                //insertText((opentag + str + closetag), strlen(opentag), strlen(closetag), true, sel);
                insertText(str, str.length, 0, false , getSel());
                switchEditor(0);
                switchEditor(1);
                hideMenu();

            }
        }
    }
    // Your code here...
})();

(function () {
    'use strict';
    var parseColor = function (hexStr) {
        return hexStr.length === 4 ? hexStr.substr(1).split('').map(function (s) { return 0x11 * parseInt(s, 16); }) : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function (s) { return parseInt(s, 16); })
    };

    // zero-pad 1 digit to 2
    var pad = function (s) {
        return (s.length === 1) ? '0' + s : s;
    };

    function ConvertGrantWord(str) {
        var result = '';
        result = "[sh4]" + str + "[/sh4]"
        return result;
    }


    /*insertText(result, 0, 0);
    switchEditor(0);
    switchEditor(1);
    console.log(result);*/

    var div = document.createElement('div');
    div.setAttribute('style', 'padding: 0 3px;');

    var a = document.createElement('a');
    a.setAttribute('id', editorid + '_gradient');
    a.setAttribute('title', '添加四号字标题[sh4]');
    a.setAttribute('href', 'javascript:;');
    a.setAttribute('style', 'background: transparent  url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAATSmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMC0wNi0yMlQxMjo1NzoxMCswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDYtMjNUMjA6MzQ6MzgrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjAtMDYtMjNUMjA6MzQ6MzgrMDg6MDAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjA0MWZjNTEtYzUyYy0yNDRkLTk1N2YtNmVmMmVlMmU1NTc3IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ZjUxYmQxNmItNjQyMy0zMzQ3LWJmNzItMjJhYzNkYzA4NWZmIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NTk3REY0NzZBMjUwMTFFQTk3ODVFRjVDRDc1NkNCQzkiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHBob3Rvc2hvcDpIaXN0b3J5PSIyMDIwLTA2LTIyVDEyOjU3OjQ2KzA4OjAwJiN4OTvmlofku7Yg5LiL6L29LnBuZyDlt7LmiZPlvIAmI3hBOzIwMjAtMDYtMjJUMTM6MDQ6MDUrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5YigLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTM6MDc6MjIrMDg6MDAmI3g5O+aWh+S7tiBDOlxVc2Vyc1xGb3hUYWlsbGxsXEFwcERhdGFcUm9hbWluZ1xBZG9iZVxBZG9iZSBQaG90b3Nob3AgMjAyMFxBdXRvUmVjb3Zlclxf5LiL6L29NjkwMjkyNkUyN0VFMDlBRTlBRUNERUMzQUI3RThBMDEucHNiIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yMlQxMzozNjoxMCswODowMCYjeDk75paH5Lu2IEM6XFVzZXJzXEZveFRhaWxsbGxcQXBwRGF0YVxSb2FtaW5nXEFkb2JlXEFkb2JlIFBob3Rvc2hvcCAyMDIwXEF1dG9SZWNvdmVyXF/kuIvovb02OTAyOTI2RTI3RUUwOUFFOUFFQ0RFQzNBQjdFOEEwMS5wc2Ig5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIyVDEzOjQyOjMyKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOWIoC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIyVDEzOjQ1OjA2KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOmjni5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIyVDEzOjQ1OjQ2KzA4OjAwJiN4OTvmlofku7YgQzpcVXNlcnNcRm94VGFpbGxsbFxBcHBEYXRhXFJvYW1pbmdcQWRvYmVcQWRvYmUgUGhvdG9zaG9wIDIwMjBcQXV0b1JlY292ZXJcX+S4i+i9vTY5MDI5MjZFMjdFRTA5QUU5QUVDREVDM0FCN0U4QTAxLnBzYiDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTQ6MDQ6NTgrMDg6MDAmI3g5O+aWh+S7tiBDOlxVc2Vyc1xGb3hUYWlsbGxsXEFwcERhdGFcUm9hbWluZ1xBZG9iZVxBZG9iZSBQaG90b3Nob3AgMjAyMFxBdXRvUmVjb3Zlclxf5LiL6L29NjkwMjkyNkUyN0VFMDlBRTlBRUNERUMzQUI3RThBMDEucHNiIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDowNTo0NCswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzpo54ucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDowOTo1MCswODowMCYjeDk75paH5Lu2IEM6XFVzZXJzXEZveFRhaWxsbGxcQXBwRGF0YVxSb2FtaW5nXEFkb2JlXEFkb2JlIFBob3Rvc2hvcCAyMDIwXEF1dG9SZWNvdmVyXF/kuIvovb02OTAyOTI2RTI3RUUwOUFFOUFFQ0RFQzNBQjdFOEEwMS5wc2Ig5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjIxOjQ1KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXGsxLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MjU6MjcrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5YigLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MjU6NDYrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc6aOeLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MjY6MzQrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcazAucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyNjo1MSswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxrMS5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjI3OjA1KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOS4i+i9vS5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjI3OjQ1KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXGszLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6Mjg6MDYrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcazQucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyODoyMiswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxrNS5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjI5OjEyKzA4OjAwJiN4OTvmlofku7YgQzpcVXNlcnNcRm94VGFpbGxsbFxBcHBEYXRhXFJvYW1pbmdcQWRvYmVcQWRvYmUgUGhvdG9zaG9wIDIwMjBcQXV0b1JlY292ZXJcX+S4i+i9vTZGQjUzQzUxNTM5QjQ3NTU5Q0YwRDEyMkE4MzJDRjYzLnBzYiDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MzI6NDYrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcc2gwLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MzM6MDQrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcc2gxLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MzM6MTcrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcc2gucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDozNDoxMyswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxzaDMucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDozNDozOCswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxzaDQucG5nIOW3suWtmOWCqCYjeEE7Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NTk3REY0NzNBMjUwMTFFQTk3ODVFRjVDRDc1NkNCQzkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NTk3REY0NzRBMjUwMTFFQTk3ODVFRjVDRDc1NkNCQzkiLz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6Y2E4ZDc2NjgtNmExZC1kMTQ3LTg3OTItMGI5ZWIyYmZmZWJhIiBzdEV2dDp3aGVuPSIyMDIwLTA2LTIzVDIwOjM0OjM4KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjIwNDFmYzUxLWM1MmMtMjQ0ZC05NTdmLTZlZjJlZTJlNTU3NyIgc3RFdnQ6d2hlbj0iMjAyMC0wNi0yM1QyMDozNDozOCswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8cGhvdG9zaG9wOlRleHRMYXllcnM+IDxyZGY6QmFnPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9IuWIoCIgcGhvdG9zaG9wOkxheWVyVGV4dD0i5YigIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0i6aOeIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSLpo54iLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrMCIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazAiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrMSIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazEiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrMiIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazIiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrMyIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazMiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrNCIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazQiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrNSIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazUiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJzaDAiIHBob3Rvc2hvcDpMYXllclRleHQ9InNoMCIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9InNoMSIgcGhvdG9zaG9wOkxheWVyVGV4dD0ic2gxIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0ic2gyIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJzaDIiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJzaDQiIHBob3Rvc2hvcDpMYXllclRleHQ9InNoNCIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9InNoNSIgcGhvdG9zaG9wOkxheWVyVGV4dD0ic2g1Ii8+IDwvcmRmOkJhZz4gPC9waG90b3Nob3A6VGV4dExheWVycz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7ccmCNAAAAdElEQVQ4je2U3QrAIAiFM/ZoPrbvdnYlc6ZFzLsmBHHSL38iAtAqrZfSzgQ2AC0bDDNvTQxATYb24s9AX0X3h7oiPYKJCL1E7WEWYPXVfuhhBB0yWNjlAxU6A6lPkCWFzyYKyCqwOoAnQ+u8W6Y1+n+bA4A3CapY4W2OJSQAAAAASUVORK5CYII=) no-repeat 0 0;width: 20px;height: 20px;float: left;border: 1px solid #fcfcfc;overflow: hidden;');
    //a.innerText = "四号字标题[sh4]";
    div.appendChild(a);
    document.getElementById(editorid + "_controls").appendChild(div);
    a.addEventListener('click', function () {
        showEditorMenu2();
        //doane();
    }, false);

    function showEditorMenu2() {
        var ctrlid = editorid + '_gradient';
        var menutype = 'menu';
        var menupos = '43!';
        var menu = document.createElement('div');
        menu.id = ctrlid + '_menu';
        menu.style.display = 'none';
        menu.className = 'p_pof upf';
        menu.style.width = '270px';
        s = '<div class="p_opt cl"><span class="y" style="margin:-10px -10px 0 0"><a onclick="hideMenu();return false;" class="flbc" href="javascript:;">关闭</a></span><div>' + '请输入要插入的四号字标题[sh4]:<br /><textarea id="' + ctrlid + '_param_1" style="width: 98%" cols="50" rows="5" class="txtarea"></textarea>' + '</div><div class="pns mtn"><button type="submit" id="' + ctrlid + '_submit" class="pn pnc"><strong>提交</strong></button></div></div>';
        menu.innerHTML = s;
        $(editorid + '_editortoolbar').appendChild(menu);
        showMenu({
            'ctrlid': ctrlid,
            'mtype': menutype,
            'evt': 'click',
            'duration': 3,
            'cache': 0,
            'drag': 1,
            'pos': menupos
        });

        try {
            if ($(ctrlid + '_param_1')) {
                $(ctrlid + '_param_1').focus();
            }
        } catch (e) { }
        var objs = menu.getElementsByTagName('*');
        for (var i = 0; i < objs.length; i++) {
            _attachEvent(objs[i], 'keydown',
                function (e) {
                    var obj = e.target;
                    if ((obj.type == 'text' && e.keyCode == 13) || (obj.type == 'textarea' && e.ctrlKey && e.keyCode == 13)) {
                        if ($(ctrlid + '_submit') && tag != 'image') $(ctrlid + '_submit').click();
                        doane(e);
                    } else if (e.keyCode == 27) {
                        hideMenu();
                        doane(e);
                    }
                });
        }
        if ($(ctrlid + '_submit')) $(ctrlid + '_submit').onclick = function () {
            checkFocus();
            if (!str) {
                str = '';
                var first = $(ctrlid + '_param_1').value;
                var str = ConvertGrantWord(first);
                //insertText((opentag + str + closetag), strlen(opentag), strlen(closetag), true, sel);
                insertText(str, str.length, 0, false , getSel());
                switchEditor(0);
                switchEditor(1);
                hideMenu();

            }
        }
    }
    // Your code here...
})();

(function () {
    'use strict';
    var parseColor = function (hexStr) {
        return hexStr.length === 4 ? hexStr.substr(1).split('').map(function (s) { return 0x11 * parseInt(s, 16); }) : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function (s) { return parseInt(s, 16); })
    };

    // zero-pad 1 digit to 2
    var pad = function (s) {
        return (s.length === 1) ? '0' + s : s;
    };

    function ConvertGrantWord(str) {
        var result = '';
        result = "[sh5]" + str + "[/sh5]"
        return result;
    }


    /*insertText(result, 0, 0);
    switchEditor(0);
    switchEditor(1);
    console.log(result);*/

    var div = document.createElement('div');
    div.setAttribute('style', 'padding: 0 3px;');

    var a = document.createElement('a');
    a.setAttribute('id', editorid + '_gradient');
    a.setAttribute('title', '添加五号字标题[sh5]');
    a.setAttribute('href', 'javascript:;');
    a.setAttribute('style', 'background: transparent  url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAATj2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMC0wNi0yMlQxMjo1NzoxMCswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDYtMjNUMjA6MzQ6NTIrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjAtMDYtMjNUMjA6MzQ6NTIrMDg6MDAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MWZiNjgwNDktOTYyMi1lODQyLTk5NTMtZjBlYTRjOTk3MjgyIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ZjNjYTM3NTYtNjQ5Zi02YzQyLWFlN2QtMDZmMWVlN2QxYWVhIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NTk3REY0NzZBMjUwMTFFQTk3ODVFRjVDRDc1NkNCQzkiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHBob3Rvc2hvcDpIaXN0b3J5PSIyMDIwLTA2LTIyVDEyOjU3OjQ2KzA4OjAwJiN4OTvmlofku7Yg5LiL6L29LnBuZyDlt7LmiZPlvIAmI3hBOzIwMjAtMDYtMjJUMTM6MDQ6MDUrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5YigLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTM6MDc6MjIrMDg6MDAmI3g5O+aWh+S7tiBDOlxVc2Vyc1xGb3hUYWlsbGxsXEFwcERhdGFcUm9hbWluZ1xBZG9iZVxBZG9iZSBQaG90b3Nob3AgMjAyMFxBdXRvUmVjb3Zlclxf5LiL6L29NjkwMjkyNkUyN0VFMDlBRTlBRUNERUMzQUI3RThBMDEucHNiIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yMlQxMzozNjoxMCswODowMCYjeDk75paH5Lu2IEM6XFVzZXJzXEZveFRhaWxsbGxcQXBwRGF0YVxSb2FtaW5nXEFkb2JlXEFkb2JlIFBob3Rvc2hvcCAyMDIwXEF1dG9SZWNvdmVyXF/kuIvovb02OTAyOTI2RTI3RUUwOUFFOUFFQ0RFQzNBQjdFOEEwMS5wc2Ig5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIyVDEzOjQyOjMyKzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOWIoC5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIyVDEzOjQ1OjA2KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOmjni5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIyVDEzOjQ1OjQ2KzA4OjAwJiN4OTvmlofku7YgQzpcVXNlcnNcRm94VGFpbGxsbFxBcHBEYXRhXFJvYW1pbmdcQWRvYmVcQWRvYmUgUGhvdG9zaG9wIDIwMjBcQXV0b1JlY292ZXJcX+S4i+i9vTY5MDI5MjZFMjdFRTA5QUU5QUVDREVDM0FCN0U4QTAxLnBzYiDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjJUMTQ6MDQ6NTgrMDg6MDAmI3g5O+aWh+S7tiBDOlxVc2Vyc1xGb3hUYWlsbGxsXEFwcERhdGFcUm9hbWluZ1xBZG9iZVxBZG9iZSBQaG90b3Nob3AgMjAyMFxBdXRvUmVjb3Zlclxf5LiL6L29NjkwMjkyNkUyN0VFMDlBRTlBRUNERUMzQUI3RThBMDEucHNiIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDowNTo0NCswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFzpo54ucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDowOTo1MCswODowMCYjeDk75paH5Lu2IEM6XFVzZXJzXEZveFRhaWxsbGxcQXBwRGF0YVxSb2FtaW5nXEFkb2JlXEFkb2JlIFBob3Rvc2hvcCAyMDIwXEF1dG9SZWNvdmVyXF/kuIvovb02OTAyOTI2RTI3RUUwOUFFOUFFQ0RFQzNBQjdFOEEwMS5wc2Ig5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjIxOjQ1KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXGsxLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MjU6MjcrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc5YigLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MjU6NDYrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxc6aOeLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MjY6MzQrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcazAucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyNjo1MSswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxrMS5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjI3OjA1KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXOS4i+i9vS5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjI3OjQ1KzA4OjAwJiN4OTvmlofku7YgRjpc6ISa5pysXGszLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6Mjg6MDYrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcazQucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDoyODoyMiswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxrNS5wbmcg5bey5a2Y5YKoJiN4QTsyMDIwLTA2LTIzVDIwOjI5OjEyKzA4OjAwJiN4OTvmlofku7YgQzpcVXNlcnNcRm94VGFpbGxsbFxBcHBEYXRhXFJvYW1pbmdcQWRvYmVcQWRvYmUgUGhvdG9zaG9wIDIwMjBcQXV0b1JlY292ZXJcX+S4i+i9vTZGQjUzQzUxNTM5QjQ3NTU5Q0YwRDEyMkE4MzJDRjYzLnBzYiDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MzI6NDYrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcc2gwLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MzM6MDQrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcc2gxLnBuZyDlt7LlrZjlgqgmI3hBOzIwMjAtMDYtMjNUMjA6MzM6MTcrMDg6MDAmI3g5O+aWh+S7tiBGOlzohJrmnKxcc2gucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDozNDoxMyswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxzaDMucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDozNDozOCswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxzaDQucG5nIOW3suWtmOWCqCYjeEE7MjAyMC0wNi0yM1QyMDozNDo1MiswODowMCYjeDk75paH5Lu2IEY6XOiEmuacrFxzaDUucG5nIOW3suWtmOWCqCYjeEE7Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NTk3REY0NzNBMjUwMTFFQTk3ODVFRjVDRDc1NkNCQzkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NTk3REY0NzRBMjUwMTFFQTk3ODVFRjVDRDc1NkNCQzkiLz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MWJmNTkzZmMtNWI4ZS0zMDRmLTg1OTctOTU0MzNiYjVmZDgyIiBzdEV2dDp3aGVuPSIyMDIwLTA2LTIzVDIwOjM0OjUyKzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjFmYjY4MDQ5LTk2MjItZTg0Mi05OTUzLWYwZWE0Yzk5NzI4MiIgc3RFdnQ6d2hlbj0iMjAyMC0wNi0yM1QyMDozNDo1MiswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8cGhvdG9zaG9wOlRleHRMYXllcnM+IDxyZGY6QmFnPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9IuWIoCIgcGhvdG9zaG9wOkxheWVyVGV4dD0i5YigIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0i6aOeIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSLpo54iLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrMCIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazAiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrMSIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazEiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrMiIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazIiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrMyIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazMiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrNCIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazQiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJrNSIgcGhvdG9zaG9wOkxheWVyVGV4dD0iazUiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJzaDAiIHBob3Rvc2hvcDpMYXllclRleHQ9InNoMCIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9InNoMSIgcGhvdG9zaG9wOkxheWVyVGV4dD0ic2gxIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0ic2gyIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJzaDIiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJzaDQiIHBob3Rvc2hvcDpMYXllclRleHQ9InNoNCIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9InNoNSIgcGhvdG9zaG9wOkxheWVyVGV4dD0ic2g1Ii8+IDwvcmRmOkJhZz4gPC9waG90b3Nob3A6VGV4dExheWVycz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6tBOvBAAAAe0lEQVQ4je2UUQoAIQhEx6WjzbG9m/sVWE3QRn+tX6HydFSyiMBJe47S7gQiIjBbDMnljVVO2W1EFDMA+0AAcHfrfQ0wV83J1a8Ag1Xtal4kI/v7d47LGZKMvotZV0JBO8Oa8EmesOEOV0GzkyoqYQXq7qbU2P/bXAB8AWJWVwrExxybAAAAAElFTkSuQmCC) no-repeat 0 0;width: 20px;height: 20px;float: left;border: 1px solid #fcfcfc;overflow: hidden;');
    //a.innerText = "五号字标题[sh5]";
    div.appendChild(a);
    document.getElementById(editorid + "_controls").appendChild(div);
    a.addEventListener('click', function () {
        showEditorMenu2();
        //doane();
    }, false);

    function showEditorMenu2() {
        var ctrlid = editorid + '_gradient';
        var menutype = 'menu';
        var menupos = '43!';
        var menu = document.createElement('div');
        menu.id = ctrlid + '_menu';
        menu.style.display = 'none';
        menu.className = 'p_pof upf';
        menu.style.width = '270px';
        s = '<div class="p_opt cl"><span class="y" style="margin:-10px -10px 0 0"><a onclick="hideMenu();return false;" class="flbc" href="javascript:;">关闭</a></span><div>' + '请输入要插入的五号字标题[sh5]:<br /><textarea id="' + ctrlid + '_param_1" style="width: 98%" cols="50" rows="5" class="txtarea"></textarea>' + '</div><div class="pns mtn"><button type="submit" id="' + ctrlid + '_submit" class="pn pnc"><strong>提交</strong></button></div></div>';
        menu.innerHTML = s;
        $(editorid + '_editortoolbar').appendChild(menu);
        showMenu({
            'ctrlid': ctrlid,
            'mtype': menutype,
            'evt': 'click',
            'duration': 3,
            'cache': 0,
            'drag': 1,
            'pos': menupos
        });

        try {
            if ($(ctrlid + '_param_1')) {
                $(ctrlid + '_param_1').focus();
            }
        } catch (e) { }
        var objs = menu.getElementsByTagName('*');
        for (var i = 0; i < objs.length; i++) {
            _attachEvent(objs[i], 'keydown',
                function (e) {
                    var obj = e.target;
                    if ((obj.type == 'text' && e.keyCode == 13) || (obj.type == 'textarea' && e.ctrlKey && e.keyCode == 13)) {
                        if ($(ctrlid + '_submit') && tag != 'image') $(ctrlid + '_submit').click();
                        doane(e);
                    } else if (e.keyCode == 27) {
                        hideMenu();
                        doane(e);
                    }
                });
        }
        if ($(ctrlid + '_submit')) $(ctrlid + '_submit').onclick = function () {
            checkFocus();
            if (!str) {
                str = '';
                var first = $(ctrlid + '_param_1').value;
                var str = ConvertGrantWord(first);
                //insertText((opentag + str + closetag), strlen(opentag), strlen(closetag), true, sel);
                insertText(str, str.length, 0, false , getSel());
                switchEditor(0);
                switchEditor(1);
                hideMenu();

            }
        }
    }
    // Your code here...
})();