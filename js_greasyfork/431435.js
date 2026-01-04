// ==UserScript==
// @name 简单滚动条美化
// @description 简单滚动条美化，可自定义设置滚动条宽度、颜色
// @match *://*/*
// @version 0.5
// @namespace 犹科
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_registerMenuCommand
// @icon data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAAsTAAALEwEAmpwYAAAIQWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo0MzU1MWFiNi0zMDg1LTVkNDktOTNhYi1lMTA2YjRjY2I2MWUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6YmYzMTIyNmYtYWRjOS02ZTQwLWI5NjctMmIxYWY1YTYzOTZjIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9Ijg5Q0ZEQzEwOTBEMDFCM0YwNDBFRDhFQUFDNUU3NjYwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMS0wOC0yMVQxMjoxMDowNCswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjEtMDgtMjRUMjE6NDc6MDgrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjEtMDgtMjRUMjE6NDc6MDgrMDg6MDAiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowNjNiYjFmNC1kMzUwLTYxNGEtOWRmMC02YjM3MjA5ZDJhODciIHN0RXZ0OndoZW49IjIwMjEtMDgtMjFUMTI6MzM6MTErMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGltYWdlL2pwZWcgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBpbWFnZS9qcGVnIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MjgwNWQzZTQtOTIyNy05YjQyLWI2ZDMtYzRlZWNhYzA5MTI4IiBzdEV2dDp3aGVuPSIyMDIxLTA4LTIxVDEyOjMzOjExKzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmJmMzEyMjZmLWFkYzktNmU0MC1iOTY3LTJiMWFmNWE2Mzk2YyIgc3RFdnQ6d2hlbj0iMjAyMS0wOC0yNFQy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
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/431435/%E7%AE%80%E5%8D%95%E6%BB%9A%E5%8A%A8%E6%9D%A1%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/431435/%E7%AE%80%E5%8D%95%E6%BB%9A%E5%8A%A8%E6%9D%A1%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function buildOption(){
        return {
            width:GM_getValue("width") || 8,
            trackColor:GM_getValue("trackColor") || "#ffffff",
            trackColorRange:parseFloat(GM_getValue("trackColorRange") || 0),
            borderRadius:GM_getValue("borderRadius") || 4,
            borderWidth:GM_getValue("borderWidth") || 1,
            borderColor:GM_getValue("borderColor") || "#ffffff",
            borderColorRange:parseFloat(GM_getValue("borderColorRange") || 1),
            thumbColor:GM_getValue("thumbColor") || "#aaaaaa",
            thumbColorRange:parseFloat(GM_getValue("thumbColorRange") || 1),
            thumbHverColor:GM_getValue("thumbHverColor") || "#888888",
            thumbHverColorRange:parseFloat(GM_getValue("thumbHverColorRange") || 1),
            thumbActiveColor:GM_getValue("thumbActiveColor") || "#666666",
            thumbActiveColorRange:parseFloat(GM_getValue("thumbActiveColorRange") || 1)
        };
    }

    let option = buildOption();
    let styleId = "easy-scrollbar-beautify";
    let settingId = "easy-scrollbar-beautify-setting";
    let settingHtml = `
    <html>
      <head>
          <style>
            body{
              margin: 0;
              font-size: 16px;
            }
            .panel{
              padding:10px;
            }
            .title{
              text-align: center;
              font-size: 20px;
              padding-bottom: 10px;
            }
            #reset{
              position: absolute;
              top: 14px;
              right: 10px;
              width: 20px;
              height: 20px;
              cursor: pointer;
              background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAFyGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDYgNzkuMTY0NzUzLCAyMDIxLzAyLzE1LTExOjUyOjEzICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjIuMyAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIxLTA4LTI0VDEzOjU1OjIwKzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIxLTA4LTI0VDEzOjU1OjIwKzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMS0wOC0yNFQxMzo1NToyMCswODowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpiY2M4ODY1Yi01ODRmLTVlNGYtOGEwOC02YTVmOGE2ZmFjNWUiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpjMWFkZDZjNi1iNjM3LWMxNDktYjAzMi00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");
              background-repeat: no-repeat;
              background-size: 100%;
            }
            #save{
              cursor: pointer;
              color: #fff;
              background: #2196f3;
              border: 0;
              text-align: center;
              padding: 8px 35px;
              margin-right: 5px;
            }
            #save:active{
              background: #1e88e5;
            }
            #close{
              cursor: pointer;
              color: #000;
              background: #eeeeee;
              border: 0;
              text-align: center;
              padding: 8px 35px;
              margin-left: 5px;
            }
            #close:active{
              background: #e0e0e0;
            }
            input{
              outline: none;
              width: 50px;
              height: 28px;
              border: 1px solid #ccc;
            }
            input[type="number"]{
              padding: 2px 5px;
              margin: 0 2px;
            }
            input[type="color"]{
                position: absolute;
                top: -5px;
                left: -5px;
                border: 0;
                padding: 0;
                width: 120%;
                height: 140%;
            }
            input[type="range"]{
                vertical-align: middle;
                width: 66px;
                margin: 0;
                border: 0;
            }
            .color-picker{
                position: relative;
                display: inline-block;
                margin: 0 2px;
                width: 48px;
                height: 26px;
                vertical-align: middle;
                border: 1px solid #ccc;
                overflow: hidden;
            }
            .color-picker .show-bg{
                display: block;
                width: 100%;
                height: 100%;
                background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAALCAIAAADEEvsIAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAFyGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDYgNzkuMTY0NzUzLCAyMDIxLzAyLzE1LTExOjUyOjEzICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjIuMyAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIxLTA4LTI1VDEyOjE1OjEzKzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIxLTA4LTI1VDEyOjE1OjEzKzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMS0wOC0yNVQxMjoxNToxMyswODowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDplYTNmZTk4OS0xNmI5LTRkNDQtOGIzNS0yMDBkZDJhNTI5NWQiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDowOTIwM2YwYi1lNmYyLWE3NGUtODM2NS1lNzQ4ODc3ZjU1MWMiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowYmE1YzZjYS0xYjExLTMxNGEtODcyNS04YWIyZDNlMjllZDEiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowYmE1YzZjYS0xYjExLTMxNGEtODcyNS04YWIyZDNlMjllZDEiIHN0RXZ0OndoZW49IjIwMjEtMDgtMjVUMTI6MTU6MTMrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi4zIChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZWEzZmU5ODktMTZiOS00ZDQ0LThiMzUtMjAwZGQyYTUyOTVkIiBzdEV2dDp3aGVuPSIyMDIxLTA4LTI1VDEyOjE1OjEzKzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjIuMyAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+QvpsSgAAAFxJREFUGJWtkMENQCEIQ9uu4/5TcHQEp/Ai/0DS+I1He2goCQ8CI0ISAACZSbK1VrVdJPdcbpEEoJoud9f6kQ7eneR8JXGMsWfP7EjOOSWttbyx9+669O6md3/6ALU0Z/2ty2EYAAAAAElFTkSuQmCC");
                background-repeat: repeat;
            }
            /* chrome */
            input::-webkit-outer-spin-button,
            input::-webkit-inner-spin-button {
                -webkit-appearance: none;
            }
            /* 火狐浏览器 */
            input[type="number"]{
                -moz-appearance: textfield;
            }
            .item{
                padding: 3px 0;
            }
            .bottom{
                padding-top: 10px;
            }
           </style>
      </head>
      <body>
          <div class="panel">
            <div class="title">设置</div>
            <div id="reset" title="重置"></div>
            <div class="item">
             <span>滚动条宽度</span>
             <input name="width" type="number" oninput="if(value.length>2)value=value.slice(0,2)" onblur="if(!value)value=`+option.width+`" value="`+option.width+`"/>
             <span>px</span>
            </div>
            <div class="item">
             <span>滚动槽颜色</span>
             <span class="color-picker">
               <input name="trackColor" type="color" value="`+option.trackColor+`" style="opacity: `+option.trackColorRange+`"/>
               <span class="show-bg"></span>
             </span>
             <input name="trackColorRange" type="range" min="0" max="1" step="0.1" value="`+option.trackColorRange+`"/>
            </div>
            <div class="item">
             <span>边框的圆角</span>
             <input name="borderRadius" type="number" oninput="if(value.length>2)value=value.slice(0,2)" onblur="if(!value)value=`+option.borderRadius+`" value="`+option.borderRadius+`"/>
             <span>px</span>
            </div>
            <div class="item">
             <span>边框的宽度</span>
             <input name="borderWidth" type="number" oninput="if(value.length>2)value=value.slice(0,2)" onblur="if(!value)value=`+option.borderWidth+`" value="`+option.borderWidth+`"/>
             <span>px</span>
            </div>
            <div class="item">
             <span>边框的颜色</span>
             <span class="color-picker">
               <input name="borderColor" type="color" value="`+option.borderColor+`" style="opacity: `+option.borderColorRange+`"/>
               <span class="show-bg"></span>
             </span>
             <input name="borderColorRange" type="range" min="0" max="1" step="0.1" value="`+option.borderColorRange+`"/>
            </div>
            <div class="item">
             <span>滚动条颜色</span>
             <span class="color-picker">
               <input name="thumbColor" type="color" value="`+option.thumbColor+`" style="opacity: `+option.thumbColorRange+`"/>
               <span class="show-bg"></span>
             </span>
             <input name="thumbColorRange" type="range" min="0" max="1" step="0.1" value="`+option.thumbColorRange+`"/>
            </div>
            <div class="item">
             <span>悬停时颜色</span>
             <span class="color-picker">
               <input name="thumbHverColor" type="color" value="`+option.thumbHverColor+`" style="opacity: `+option.thumbHverColorRange+`"/>
               <span class="show-bg"></span>
             </span>
             <input name="thumbHverColorRange" type="range" min="0" max="1" step="0.1" value="`+option.thumbHverColorRange+`"/>
            </div>
            <div class="item">
             <span>选中时颜色</span>
             <span class="color-picker">
               <input name="thumbActiveColor" type="color" value="`+option.thumbActiveColor+`" style="opacity: `+option.thumbActiveColorRange+`"/>
               <span class="show-bg"></span>
             </span>
             <input name="thumbActiveColorRange" type="range" min="0" max="1" step="0.1" value="`+option.thumbActiveColorRange+`"/>
            </div>
            <div class="bottom">
              <button type="button" id="save">确定</button>
              <button type="button" id="close">关闭</button>
            </div>
          </div>
      </body>
    </html>`;

    function changeColorPicker(colorName,rangeVal){
        let ifr = document.querySelector("#"+settingId);
        let ifrw = getIfrw(ifr);
        let ifrdoc = ifrw.document;
        let el = ifrdoc.querySelector("[name='"+colorName+"']");
        el.style.opacity = rangeVal;
    }

    function toHex(value){
        let num = value * 255;
        let hex = parseInt(num).toString(16);
        return hex ==="0"?"00":hex;
    }

    function getIfrw(ifr){
      return (ifr.contentWindow) ? ifr.contentWindow : (ifr.contentDocument.document) ? ifr.contentDocument.document : ifr.contentDocument;
    }

    function setting(){
        //顶层窗口页面才能显示设置窗口
        if(top !== self){
          return;
        }
        let body = document.body;
        let scrollbarSetting = body.querySelector("#"+settingId);
        if(!scrollbarSetting){
            // 创建iframe添加到页面底部，渲染设置页面，绑定事件
            let ifr = document.createElement("iframe");
            ifr.setAttribute("frameborder", "0");
            ifr.setAttribute("scrolling", "no");
            ifr.setAttribute("id", settingId);
            ifr.setAttribute("style", "position: fixed;top: 2px;right: 2px;width: 230px;height: 370px;background: #fff;border-radius: 10px;box-shadow: 0px 0px 6px 1px #666;z-index: 999999999;");
            body.appendChild(ifr);
            let ifrw = getIfrw(ifr);
            let ifrdoc = ifrw.document;
            ifrdoc.open();
            ifrdoc.write(settingHtml);
            ifrdoc.close();
            // 透明度改变事件
            ifrdoc.querySelector("[name='trackColorRange']").oninput=function(){
                changeColorPicker('trackColor',this.value);
            }
            ifrdoc.querySelector("[name='borderColorRange']").oninput=function(){
                changeColorPicker('borderColor',this.value);
            }
            ifrdoc.querySelector("[name='thumbColorRange']").oninput=function(){
                changeColorPicker('thumbColor',this.value);
            }
            ifrdoc.querySelector("[name='thumbHverColorRange']").oninput=function(){
                changeColorPicker('thumbHverColor',this.value);
            }
            ifrdoc.querySelector("[name='thumbActiveColorRange']").oninput=function(){
                changeColorPicker('thumbActiveColor',this.value);
            }
            // 重置点击事件
            ifrdoc.querySelector("#reset").onclick = function(){
              if (confirm("确定重置为默认设置？")) {
                let ifr = document.querySelector("#"+settingId);
                let ifrw = getIfrw(ifr);
                let tagElements = ifrw.document.getElementsByTagName('input');
                for (let i = 0; i < tagElements.length; i++){
                    let el = tagElements[i];
                    GM_deleteValue(el.getAttribute("name"));
                }
                let option = buildOption();
                for (let j = 0; j < tagElements.length; j++){
                    let _el = tagElements[j];
                    _el.value = option[_el.getAttribute("name")];
                }
                for (let k = 0; k < tagElements.length; k++){
                    let el = tagElements[k];
                    if(el.getAttribute("type") === "color"){
                        let rangeEl = ifrdoc.querySelector("[name='"+el.getAttribute("name")+"Range']");
                        el.style.opacity = rangeEl.value;
                    }
                }
              }
            };
            // 保存点击事件
            ifrdoc.querySelector("#save").onclick = function() {
                let ifr = document.querySelector("#"+settingId);
                let ifrw = getIfrw(ifr);
                let tagElements = ifrw.document.getElementsByTagName('input');
                for (let i = 0; i < tagElements.length; i++){
                    let el = tagElements[i];
                    GM_setValue(el.getAttribute("name"), el.value);
                }
                ifr.style.display = "none";
                setTimeout(function(){
                    alert("保存成功，刷新页面后生效。");
                },100);
            };
            // 关闭点击事件
            ifrdoc.querySelector("#close").onclick = function(){
                // 隐藏设置窗口，还原未保存设置
                let ifr = document.querySelector("#"+settingId);
                ifr.style.display = "none";
                let ifrw = getIfrw(ifr);
                let tagElements = ifrw.document.getElementsByTagName('input');
                let option = buildOption();
                for (let j = 0; j < tagElements.length; j++){
                   let el = tagElements[j];
                   el.value = option[el.getAttribute("name")];
                }
                for (let k = 0; k < tagElements.length; k++){
                    let el = tagElements[k];
                    if(el.getAttribute("type") === "color"){
                        let rangeEl = ifrdoc.querySelector("[name='"+el.getAttribute("name")+"Range']");
                        el.style.opacity = rangeEl.value;
                    }
                }
            };
        } else {
           // 显示设置窗口
           let ifr = document.querySelector("#"+settingId);
           ifr.style.display = "block";
        }
    }

    GM_registerMenuCommand("设置", setting);

    function buildStyle() {
        let option = buildOption();
        return `
        <style id="`+styleId+`" type="text/css" media="all">
        /* 滚动条整体宽度 */
        ::-webkit-scrollbar {
            -webkit-appearance: none;
            width: `+option.width+`px;
            height: `+option.width+`px;
        }
        /* 滚动条滑槽样式 */
        ::-webkit-scrollbar-track {
            background-color: `+option.trackColor+toHex(option.trackColorRange)+`;
        }
        /* 滚动条样式 */
        ::-webkit-scrollbar-thumb {
            border-radius: `+option.borderRadius+`px;
            border-width: `+option.borderWidth+`px;
            border-style: solid;
            border-color: `+option.borderColor+toHex(option.borderColorRange)+`;
            background-color: `+option.thumbColor+toHex(option.thumbColorRange)+`;
        }
        ::-webkit-scrollbar-thumb:hover{
            background-color: `+option.thumbHverColor+toHex(option.thumbHverColorRange)+`;
        }
        ::-webkit-scrollbar-thumb:active{
            background-color: `+option.thumbActiveColor+toHex(option.thumbActiveColorRange)+`;
        }
        /* 浏览器失焦的样式 */
        ::-webkit-scrollbar-thumb:window-inactive {
            background-color: `+option.thumbColor+toHex(option.thumbColorRange)+`;
        }
        </style>`;
    };
    try {
        document.documentElement.insertAdjacentHTML("afterBegin", buildStyle())
    } catch (err) {
        document.addEventListener ("DOMContentLoaded", function(){
          document.documentElement.insertAdjacentHTML("afterBegin", buildStyle())
        });
        return false
    }
})();