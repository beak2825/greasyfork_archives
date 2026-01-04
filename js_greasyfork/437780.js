// ==UserScript==
// @name         喵搜动漫增强扩展
// @namespace    https://www.msocc.cc
// @version      0.1
// @licence      MIT
// @description  喵搜动漫增强功能
// @author       Miao
// @match        https://www.msocc.cc/raw/*
// @match        https://www.msocc.cc/uncategorized/*
// @match        https://www.msocc.cc/games/*
// @match        https://www.msocc.cc/comics/*
// @match        https://www.msocc.cc/limit/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAjCAMAAAAg7OMRAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAM1BMVEX/////tsH/tsH/tsH/tsH/tsH/tsH/tsH/tsH/tsH/tsH/tsH/tsH/tsH/tsH/tsH///9KAN/CAAAAD3RSTlMAEXeIRCLd7jO7qsxVmWai0sZEAAAAAWJLR0QAiAUdSAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+UMHhQEFnT8lsUAAAGBSURBVDjLtVTbrsQgCBS03pX//9sDiq3tdl82OZNsN9KBwjCtMT8B0CLcIw4+aYcnohC3iOVA+mBmEoTjDOAIpCePJso6Ow0cd1rkUG18QQ1wG8EFInfnSboxia8dU8ooT3VyxjfeEehCOw585UGueNGCJf/O6zwe32+1WumOxu+FJ8Vyn4q5qGWV51qhkqsB0Yrz85lZK5FfvKZZGSQU7E2tWpMKL08KSTrJ1XZdoEPEqglxdAHa5xRroJe1mH4V5gHb2qUdiWnTr5ymwFUG5sLjkJmXgTns7mHnxOUC5sksZEHdGC5iX2PPBsRa3BUUqlrca1KYKXH4Ik6aSD6y47UNlDVi40AeWiZdjV13vXa4dC4wHFeHgHx0DIDNpjhGbDAdDZtfuOO025QzT+ebXb985+1vCPTEEG+xhvELr8xxVcyp/vM10pnSjbfNuyMuV4ZTn6ebL5HsqCO3+7WPB0A85afxa3p+Rp5Eca4f//4L7ZRddQbzHdCn9RIe5p/wB+DWGr1m+Lw9AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIxLTEyLTMwVDEyOjA0OjIyKzA4OjAwvUuu/QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMS0xMi0zMFQxMjowNDoyMiswODowMMwWFkEAAAAgdEVYdHNvZnR3YXJlAGh0dHBzOi8vaW1hZ2VtYWdpY2sub3JnvM8dnQAAABh0RVh0VGh1bWI6OkRvY3VtZW50OjpQYWdlcwAxp/+7LwAAABd0RVh0VGh1bWI6OkltYWdlOjpIZWlnaHQAMzW2kG1XAAAAFnRFWHRUaHVtYjo6SW1hZ2U6OldpZHRoADM5R4nh8QAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxNjQwODM3MDYyCDV3NwAAABJ0RVh0VGh1bWI6OlNpemUAMzIwNkJC4q9HlAAAAEZ0RVh0VGh1bWI6OlVSSQBmaWxlOi8vL2FwcC90bXAvaW1hZ2VsYy9pbWd2aWV3Ml85XzE2Mzg4NDgwMzU1MDUyOTI4XzgxX1swXd6cHDgAAAAASUVORK5CYII
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/437780/%E5%96%B5%E6%90%9C%E5%8A%A8%E6%BC%AB%E5%A2%9E%E5%BC%BA%E6%89%A9%E5%B1%95.user.js
// @updateURL https://update.greasyfork.org/scripts/437780/%E5%96%B5%E6%90%9C%E5%8A%A8%E6%BC%AB%E5%A2%9E%E5%BC%BA%E6%89%A9%E5%B1%95.meta.js
// ==/UserScript==
//覆盖原有标签
function appendJQCDN(){
    var head = document.head || document.getElementsByTagName('head')[0];
    head += '<link rel="stylesheet" href="https://cdn.msocc.cc/file/msocc-mso/css/new_file.css" />';
    document.getElementsByTagName('head')[0].innerHTML += head;
}
appendJQCDN();