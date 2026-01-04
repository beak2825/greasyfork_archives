// ==UserScript==
// @name         日语划词词典
// @namespace    http://tampermonkey.net/
// @version      0.60
// @description  调用沪江小D进行日语划词查询
// @author       https://github.com/fthvgb1
// @match        http://*/*
// @include      https://*/*
// @include      file:///*
// @run-at       document-start
// @connect      hjenglish.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/394792/%E6%97%A5%E8%AF%AD%E5%88%92%E8%AF%8D%E8%AF%8D%E5%85%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/394792/%E6%97%A5%E8%AF%AD%E5%88%92%E8%AF%8D%E8%AF%8D%E5%85%B8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    /**联网权限*/
    // @connect      hjenglish.com          沪江小D
    /**样式*/
    var style = document.createElement('style');
    // >>>>> 可以自定义的变量
    var fontSize = 14; // 字体大小
    var iconWidth = 300; // 整个面板宽度
    var iconHeight = 400; // 整个面板高度
    // 可以自定义的变量 <<<<< （自定义变量修改后把 “@version” 版本号改为 “10000” 防止更新后消失）
    var trContentWidth = iconWidth - 16; // 整个面板宽度 - 边距间隔 = 翻译正文宽度
    var trContentHeight = iconHeight - 35; // 整个面板高度 - 边距间隔 = 翻译正文高度
    var zIndex = '2147483647'; // 渲染图层
    style.textContent = `
    /*组件样式*/
    :host{all:unset!important}
    :host{all:initial!important}
    *{word-wrap:break-word!important;word-break:break-word!important}
    a{color:#00c;text-decoration:none;cursor:pointer}
    a:hover{text-decoration:none}
    a:active{text-decoration:underline}
    img{cursor:pointer;display:inline-block;width:20px;height:20px;border:1px solid #dfe1e5;border-radius:4px;background-color:rgba(255,255,255,1);padding:2px;margin:0;margin-right:5px;box-sizing:content-box;vertical-align:middle}
    img:last-of-type{margin-right:auto}
    img:hover{border:1px solid #f90}
    img[activate]{border:1px solid #f90}
    img[activate]:hover{border:1px solid #f90}
    table{font-size:inherit;color:inherit}
    tr-icon{display:none;position:absolute;padding:0;margin:0;cursor:move;box-sizing:content-box;font-size:${fontSize}px;text-align:left;border:0;border-radius:4px;color:black;z-index:${zIndex};background:transparent}
    tr-icon[activate]{background:#fff;-webkit-box-shadow:0 3px 8px 0 rgba(0,0,0,0.2),0 0 0 0 rgba(0,0,0,0.08);box-shadow:0 3px 8px 0 rgba(0,0,0,0.2),0 0 0 0 rgba(0,0,0,0.08)}
    tr-audio{display:block;margin-bottom:5px}
    tr-audio a{margin-right:1em;font-size:80%}
    tr-audio a:last-of-type{margin-right:auto}
    tr-content{display:none;width:${trContentWidth}px;max-height:${trContentHeight}px;overflow-y: scroll;background:white;padding:2px 8px;margin-top:5px;box-sizing:content-box;font-family:"Helvetica Neue","Helvetica","Arial","sans-serif";font-size:${fontSize}px;font-weight:normal;line-height:normal;-webkit-font-smoothing:auto;font-smoothing:auto;text-rendering:auto}
    tr-engine~tr-engine{margin-top:1em}
    tr-engine .title{color:#00c;display:inline-block;font-weight:bold}
    tr-engine .title:hover{text-decoration:none}
    /*各引擎样式*/
    .word-details {
    position: relative
}



.word-details-header>p {
    line-height: 20px;
    margin: 0 0 20px
}

.word-details-header>p>span {
    color: #bac
}

.word-details .redirection {
    color: #fff;
    line-height: 20px;
    margin: 0 0 20px;
    opacity: .8
}

.word-details-tab {
    cursor: pointer;
    display: inline-block;
    margin: 0 15px 15px 0;
    height: 50px;
    border-radius: 5px;
    padding: 0 20px;
    background: #f5f8ff
}

.word-details-tab h2 {
    font-size: 18px;
    line-height: 30px;
    height: 35px;
    margin: 0;
    font-weight: 400;
    display: inline-block
}

.word-details-tab-active {
    color: #fff;
    background-color: #abc
}

.word-details-tab .pronounces {
    display: inline-block;
    line-height: 60px;
    height: 60px;
    vertical-align: top;
    margin-left: 20px
}

.word-details-pane {
    display: none
}

.word-details-pane:first-child {
    display: block
}

.word-details-pane-header {
    padding: 6px 10px;
    background-image: -webkit-linear-gradient(276deg,#544646,#7ed285);
    background-image: -o-linear-gradient(276deg,#544646,#7ed285);
    background-image: linear-gradient(276deg,#544646,#7ed285);
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    color: #fff
}

.word-details-pane-header-multi {
    border-top-left-radius: 0;
    border-top-right-radius: 0
}

.word-details-pane-header .word-text {
    margin-bottom: 10px
}

.word-details-pane-header .word-text .add-to-scb-loading {
    background: url(img/loading-289f3.png) no-repeat 0 0/cover;
    -webkit-animation: xd-loading .6s steps(8) infinite both;
    animation: xd-loading .6s steps(8) infinite both
}

.word-details-pane-header .word-text .add-to-scb-success {
    background: url(data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTQ1N0M1MTRDMDRCMTFFNzlGNEY5NDYwNkM0QUE2NjciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MTQ1N0M1MTVDMDRCMTFFNzlGNEY5NDYwNkM0QUE2NjciPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxNDU3QzUxMkMwNEIxMUU3OUY0Rjk0NjA2QzRBQTY2NyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxNDU3QzUxM0MwNEIxMUU3OUY0Rjk0NjA2QzRBQTY2NyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pvx0vOAAAAJLSURBVHja7JkxSMNAFIbT1LGDYnEIRRBdrIOjk0uELkJFHDo5OEpQWlAcXHXTVSld3NwEB7t1ciw4VaRDxUGLIB1sESy0xv/ghvS8xGuauyDmwUfJJe/d3+Tl3V1O02C2bcfBPqiCri3furQv0mdcG8ao2IodnlWGEa2DAjC18MykGoQF57TwLTdMSnwyj2hStjr0kWT6/BT1jZGrBxpgKm6p33517Y9ZJDgSHAlWbGN+y9CwFlS5jFIiEuw3hyUM2fe+3oWw5hJRDv+bOuyVUgiRws8aWAWzwKCnmqABbsA1Qjx7CnGa6HVu5uJrgBLoCYTo0WuNUASjKQvaPhanxCerVDAOd0F/hBU18d3xJdjHEijrIrYG8iANEpQ0bau5iM5KFUxzts35eGIB3cNPp9d0OelhyBRc4og1SXhBTI7okhTBpHRxqoElKHQclMES9WGrR0qGYIuTs7qA2ClwR31aYJGT05YMwWUmZJ4KOgRHLmJJzj8wfq/ggGkryxBcZ0KSClBwHJ+AmEPsDHjkPP5N6uu0ugzBHSbkBvhi2s6o6HnwwnlB1+mfSTDnOioET4BLTn29Am9M2wfIOO6+EsG8lCDfoC9+GdXewTKT2z9SQsb0ssEcZ0AfbIFzF58WWAG3HN/B2IrLGsnbU+Z8EyxwKoeuqqyJDBzHtP0JzLmUOteBg/2gnVQ0NG+DaT9DczWgzZWi6OTHY7QTmvzsBS1Y9vQyqG2vIic1gp/AO0SPurFY9JjIB7dEUrQBE9giNKZY+MjL/G8BBgDu7CBuz18G6wAAAABJRU5ErkJggg==) 0 0/contain
}

.word-details-pane-header .word-text .word-info {
    margin-bottom: 20px
}

.word-details-pane-header .word-text h2 {
    font-size: 18px;
    line-height: 0;
    margin: 0;
    font-weight: 400;
    display: inline-block
}

.word-details-pane-header .word-text a,.word-details-pane-header .word-text button {
    display: inline-block;
    width: 20px;
    height: 20px;
    line-height: 50px;
    margin-left: 30px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAABGdBTUEAALGPC/xhBQAAAp9JREFUWAntWbFOAkEQBbHESipCbOj8DAobEyz9ATqi0UQ/xsBPWNCY+AW2WtIZPkApMFHxvePOm5u7PQbclZAwyYSZ2zcz7/aG2727SgUyn89r0FvoE/QDGlpYg7VYs0YOZmEA9BG6KWFtM+k9nNk1tGM+Q/9A1iYHk5DwuQkZFmTngMsxU71wGJZb9J9pqJoza80qAyW4CpF+KHvdumyJrZId4dCXazfDuxlWM7CvfKerb0NOoGPA1+1y18OOCfZ2eOtm2NzDvnpQTPWLsM3mxvYSZoYKuHUtsXWEzT1svQ+X9TpytHCFz6Cn0Da0CaVMoGPoCHqPHK/4LRYSkVKMijbdEua0i+IBbkIH0E9nYDpADLHJyWRTpriFlR1NPY1z+WnEwgKuC31z4UuOM6ar8/ERPyM5QHwgAypxZDxgl9CvEviyIcZeyJxmwpkgg4NCnNkiss84fgU9htZjpc1jHNPCHOlM61EDl6UQ5GTP6jbgy5M+1Hln4liM0S9zmGvR0zAyspSNAYCE/NNIIYGODJWDtNVYB4c06UGEKQuUSaw28rWg+m7Q1/HL6mKcV0MKc7a89zCS6kLsy1wbSCa0C06I7aF7up9LpAPX8LkoSBliIfiWByx2HDNU2FPzSqcCy1yuYFIe6BTNogTp8XjFjGIFru19t4bC7yhQF0UOUHyqCYnxQpOEEcM8zJfINERLJMmD/IYgzI2MlCPprGjr2EkIwtx1STmhw0ssRQJKxqNYgR2HIMwtopQeenHlOnFMTyaCPQpxHw6+cOgX2g11Viu7mJ2gSzO/5viQu+TMkCzo5ufGB1vk+CVM4vCDbS99ffbKEI5J+9/Ax4l9fFjMERYzrffGlota/IjEpKEF7Lw9hP7LF6NkQkD8z4/5P0eRZrlVgPOgAAAAAElFTkSuQmCC) 0 0/contain;
    border: none;
    outline: none;
    cursor: pointer
}



.word-details-pane-footer {
    padding: 0 30px 30px
}

.word-details-pane mark.highlight {
    color: #2e94f7;
    background: none
}


.word-details-item:last-of-type {
    margin-bottom: 0
}

.word-details-item>h2 {
    display: none;
    font-size: 20px;
    line-height: 28px;
    margin: 0 0 20px;
    font-weight: 400
}

.word-details-button-expand {
    cursor: pointer
}

.word-details-button-feedback {
    padding: 10px 25px;
    font-size: 14px;
    border-radius: 20px;
    background-color: #fff;
    border: 1px solid #2e94f7;
    color: #2e94f7
}

.word-details a {
    color: #2e94f7
}

.word-details a:hover {
    text-decoration: underline
}

.word-details-ads,.word-details-ads-placeholder {
    display: none;
    min-height: 48px;
    padding: 10px 32px 10px 54px
}

.word-details-ads {
    position: absolute;
    left: 0
}

.word-details-ads-placeholder {
    position: relative;
    background: rgba(46,148,247,.1)
}

.word-details-ads-placeholder:before {
    content: "";
    width: 16px;
    height: 17px;
    position: absolute;
    top: 10px;
    left: 30px;
    top: 14px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAiCAYAAAA+stv/AAAAAXNSR0IArs4c6QAABTRJREFUWAm9Vn1oVlUYf851M5vkgixJbEb/hFLuryRNpT8ipGgWtcVmTEVZECV9qcQCZxGVUGF/BVnQh7GSmBgLYuhipUIzyFl/BK0N01n2MXAr53vvPU+/53zc9973vdt436AD9z7nnOfrd37nPOdeRf+hMXfNo9/HP0KIXnXdvneqCRVU4yQ+zE9cQb/+2UNR/ADFarjaOFUBYP5kDp2LP0Xy9aQ1UZ0aqhZATVWOZ/p3EtO9xlfxH6r+jb+qigOnigHwcMetFOku7IHNqdQ/1SYXv4oBYL/3E+u5pJTNy3rqfwPAP3asoShamUmogtrMuMJBZYfwcrSdIlAf4eAZafo3oBwrZ9IBnREAD229n09vWyS2WP1Cihklh+QxEhspQOIaOn2mIW/hfGrLc3xq814AnDbPtAo+uelFKoQ9pKnOBJ8srDLJJLkwYEAIEDxhvCoPABXiNgr1Dvp2pJt/6JqbZ5MLgAfbX0GS5xF8UDXuHzGOYbzSJItim1SkeQAm1PeVBjfMMS23YHUzTQz35oEoA8DH29uAfJehOOK+JHCsAcAlT6QwAABar+eRzfMSW+lMXnoczAQWtDCm76KLP72QscEgA4AHtlxLYfSmTS6B6fvEQevFJliaetOHXcT1dDbc6m15oH0FRbTd2ktyBzTSO3hg4x3eTmT29Oqp10nzNSQlDh84XhAj02Keb+YYAeUOEJltO/n4U+9SOLaWosL7MFiQVZtRAN+30VvudQkD3N+6EPv1sKHZHDLQrUN328A8wtXnD5+XWTYa6O+xSSrwF2BwUT5bWFWkl/GRlnUeQJGBQtgKymvt6mEoqRUt9YY4aGCDb7KrF73DJleyYQSyZEsT39KOCmS7BmQ6YQArbDOo/epEhjh4vsV81upLqkBY8JWRZcTuvYZe5kWaPuLG8UPMzXNKASwzh88EESNx1C38WYe9B2I9WK43Nt5W7B0YJ32ZJlLmzVNHn8dLEgDc11wPVHicgZeRvpoKF3Y7Eo45Zx/ESm8r0jxpUOm+03sWIru9dgvGCw3J3S4rl3veMGACPMsHNzxKTStOYG7MJvHJygA7FtJ6B6L47bDxL+ulsjB7CAMdUgFO0vyB8ofMnpO36OOTTcTqZ5Tf4sQm396EKb4AwDQvZSB9XZCeBTC1YIxoXMbQQSkH3P9wmEnzuse8vc4VQZm90cMy0bu+z+/1NQo5XRWoRw5cBO0T+XUudMLb77GpEkd9ul+pnmp/EQDFeyDSR7HsDQm9fguydZ63RRKn2GazF30QDKvWQ6PiVAQQc48FAAOhS8kLzffd0E54hZeeVxlLX86T2wOJ42OIWgAwH5KutBSA2sOkpiZgfJVVubdxRl+kNJ/LxS9LmCQXELmNwfKHXpPchOqx3nH8cO7NnAPZY6lbL9N9mZNHPs1eJp9p/9l2vqa0vT13q46+78oAmInaK/E1pHPmapVkJqF8lCSQJHKBvfSBvfSg0tLrRMZ8CaR3+uQiEyL9JL925+3Yo35wnv3B8AZle4DAyVxilN8Jglb19JfdaWUZAFHyq+s2YtkfYN/VrFWRjjZTXwV71K6BrlKTXABixC+vfhA333sAMd+ewGlNS2Nmx0rFiPGM6vx6X1ZhRzNG5ZfW4tcqPoCSvGXaKijdAYno54hG0d+mdp84kpdc5pIqyDNQnV8NEd/diIO5CQdxNOdrmV8lzL+hMp4kveTmmZJLzhkZSINiZkV7Vt8GRpowvwYrux7ueDQWEZwHS+cx/gYfq8PUeOMx1XIQJTN7+xcs/bB+XniprgAAAABJRU5ErkJggg==) no-repeat 0/100%
}
.audio {
    display: inline-block;
    width: 20px;
    height: 20px;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    vertical-align: middle;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJwAAAA0CAYAAAB/91HOAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDozZDg2NTg3NC04Mzg3LTQ1MGItYmY3My0xODVlMTgwZWZlMjUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDIyNzg4MDRCMEFGMTFFN0I2N0ZGQkVCRDRBNkU4RUUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDIyNzg4MDNCMEFGMTFFN0I2N0ZGQkVCRDRBNkU4RUUiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDplNDU0MTcwYi02NzIwLTRjOGMtOTYxNy05M2Q1OWFiNzA3NTIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6M2Q4NjU4NzQtODM4Ny00NTBiLWJmNzMtMTg1ZTE4MGVmZTI1Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+ArAG/QAABIxJREFUeNrsnV1oHFUYhr8zu+ScVF2NEDBGsYogVi+SqghWsKSCF1LBCL3yQqmo6V6JV70ogSLUK/FmU1EsXnghqBFREMG/ohb8qa2IiiKkYBqFgG3TYmeS3fn8TpqU2TG7O5NkZs4m7wsfc/bkMJln5z2/MydRzEwQlJc8fAUQDAfBcBAEw0EwHATBcBAMB21OlZMUuvtVou+fJho+HBCHTKwUUWT9TitDW/uJfp/1iUmR5zEN3GRoZkrKS1o1pHjFXFG5QD1fjtHZoYl57tvWQzt3Eo0XAJ0lTyeNbzAeq8ma3/JnP1ZN7i3ciMRX6nxwbi70/xmq+dPy+UBSszso8DjapWqJw9SgT6Wu7WDmks2U9PXM4cEzvwSTXdalgyevLnUV2np6KnhHmvW7WhUQwN3v1fwnxqvmSBfcnMQ8kmzLMx7rYrqdJ+2D0Sxq5O4wVD/8D0YpGVqof5vzaG8XmC0dj1o8to5NzrOehrNN8iGJ9wWmr5lF/VFW3j3cw3c21w51u8NGWxWPHZS3DAbPenWp1/02678lV/FAvJEVmElztX5yYW5hboV2u89Rs4EnI540LZxtQGXyTd9InF/qvhcjYP+vSzDRwqquPPW8JB+TuAQTOHUTwFMAT9IWbmCoFrzJxCNLzm9Prui0otIepsax5bx62HDp5oAnOx5eoSKkauFUfSEC07G0+sTrNcOSOuZo9wKeAnk6Gm54wn8qMYxodJ9+SA6z0byLZ31n7g54iuXpaDhpH/fGashHvdrc2GZiHMbWc5xqDsBTLE+5M5C6I9ota9LPyGG6Vfmm52oObpcAT7E8nScNzFfGcv6kblb+PG0H0ZuNJ/U6nEyxXVsOWJPA49ikAYJgOAiGgyAYDoLhIBgOgmA4CIZbVK82pEpmw3wB4HHNcEpdiOXc0NV3BDxuG04R/xz97M8Hr8hhsFX50aqh0hZDnirbt0nduz858diyS/F2NDYaz3J+UpUT/KIjzHzv8mdJP0wNf7qDicPohbr0hkUBPHvAk6KFOzGmX5OL+jzpCScngo/l0N80rrjGnTFFXjx5VTIXeNKwJpk0sGf049JwfpHojMwPhhf9E5K6z9FhBHgK5Ek6S505WdUjylNj0lt/u8JANcZEg8yNo5J87nLf7ZVcukm58OQ4lCiMJy1jmmURe2Y7ILXjhasosh1WKzMgqaPNhbksF/OSJN+VqNg87Tk1iQBPNjxtt0qv18Lv37f1m10y/nzR7uCO1YBR/1xwXJJ2p/ctsRHvGUe7qdXz2BlbJBg8mRjOyu4z2688eiRuJIG6tc7hd/NMP8Wm9L86vGS0Kp6V9qg78m66EzxZPNr60PN4u0Adj3X2SsC2xDqB18l9peO5vP04Hgweyu6vJ50avFnvmJkKXhaIZ1usH33w6D79BnWHwNNqmaWWbothlg/v7Zv1Y1SiXdL7fy0AjaUR5Ywi70DfNj1KsS1rjgs8OS6LrEWfSdxfLutKxTPXnqwa+6zvBYk6dafAs5YpLP7XFpSn8D4cBMNBMBwEwXAQDAdBMBwEw0GbVP8JMAAdIoU8hRXz0AAAAABJRU5ErkJggg==) no-repeat -40px 0/auto 100%
}

.audio-light {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJwAAAA0CAYAAAB/91HOAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDozZDg2NTg3NC04Mzg3LTQ1MGItYmY3My0xODVlMTgwZWZlMjUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDIyNzg4MDhCMEFGMTFFN0I2N0ZGQkVCRDRBNkU4RUUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDIyNzg4MDdCMEFGMTFFN0I2N0ZGQkVCRDRBNkU4RUUiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDplNDU0MTcwYi02NzIwLTRjOGMtOTYxNy05M2Q1OWFiNzA3NTIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6M2Q4NjU4NzQtODM4Ny00NTBiLWJmNzMtMTg1ZTE4MGVmZTI1Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+P83CLAAAAp5JREFUeNrsnM9LFGEch91dQbAQPAgJGdEt6OQSgt6ko/0D4clIu9a5zvsnWIYXr9EhCSJI9CBCUHryVLf0JEixUYdix8/AQsM0s/uO6zvzfeN54DnsMDszn32/+77zY9+tRVE0BFAWdT4CoOCAggOg4ICCA6DggIIDCs43l+S4rP0nnx15jBbcvNyV3+WpPJJP5XCgDUOeQYifNHhyRK5G+WzKusf9k8dgHl9hrsuPUX+WAmkc8lyQPobUu3JfNtOdqfyZWnY/gCGHPEbP4RqyJV93Tz6TfJG35a3U8puGG4Y8PvJcUFd5Re7kdMuv5Fhi3TQWhxzyeMpTZOWaXJYfZNth/P8tH2dsx0oDkaeCPK4rTsqtyJ0jOZuzLQsNRB5/eXq+v+bwA8z4RuD77v0aF+J178mTvFE8Y/tlQh6/eXq+36XgHsi1giennfMeUAmQx2+enu93uUpNXxq/lVPdDWUdTMf4bQHyVIhLD9eWlxOvr8mvA3wjqu4RyOM3z8BDar8DCK2Bys7jO6+1PAMPqQAmnzQAUHBAwQEFB0DBAQUHQMEBBQdw/oL7kXp9NfDM5KkQl6lgh3Im8fqZXJHHgTZQ2XlekucvLs9Sl+XzAtu0/nMe8hj/edILuV1gh+/khOEejjwV5qk7Vuyi3HHc5h15IGeNNhB5qsxTcJLGw4KTNB4Zn3RCnpLnNDCtjjxmpwn2syFbspNx0J9lU95ILT81/HcI5PGQx+UqtSgLcmPo39nd8Y5+ydHEsj05Z/w2CnmMP2l4I6flp4zL49HUsvUA7tuRp6KLBv7eijxm/64r6bzclX+6QY7lEzkcUOOQx/A5XB5xdz0iv2XcjQ4R8nh6tAVg+qIBgIIDCg4oOAAKDig4AAoOAuBMgAEAYBYyuvW+UO8AAAAASUVORK5CYII=)
}

.audio-state-playing {
    -webkit-animation: audio-playing .6s steps(3) infinite alternate;
    animation: audio-playing .6s steps(3) infinite alternate
}

@-webkit-keyframes audio-playing {
    0% {
        background-position: 0 0
    }

    to {
        background-position: -60px 0
    }
}

@keyframes audio-playing {
    0% {
        background-position: 0 0
    }

    to {
        background-position: -60px 0
    }
}

    .hjenglish dl,.hjenglish dt,.hjenglish dd,.hjenglish p,.hjenglish ul,.hjenglish li,.hjenglish h3{margin:0;padding:0;margin-block-start:0;margin-block-end:0;margin-inline-start:0;margin-inline-end:0}
    .hjenglish h3{font-size:1em;font-weight:normal}
    .hjenglish .detail-pron,.hjenglish .pronounces{color: #00c;}
    .hjenglish .detail-groups dd h3:before{counter-increment:eq;content:counter(eq) ".";display:block;width:22px;float:left}
    .detail-groups dd:first-of-type:last-of-type h3:before {
    display: none
}

.detail-groups dd:first-of-type:last-of-type h3 p {
    margin: 0
}

.detail-groups dd:first-of-type:last-of-type h3 p {
    margin: 0
}

.detail-groups dd:first-of-type:last-of-type ul {
    margin-left: 0
}

.detail-groups ul {
    //margin-left: 22px
}

.detail-groups ul li {
    color: #999;
    margin-bottom: 14px
}

.detail-groups ul li p {
    margin: 0 0 6px;
    line-height: 20px
}

.detail-pron {
    color: #999;
    margin-left: 6px;
    font-family: Lucida Sans Unicode
}

.detail .def-sentence-from {
    color: #666
}

.detail .def-sentence-to {
    color: #999
}

.detail .def-sentence-from .def-sentence-to span {
    vertical-align: top;
    margin: 1px 0 2px 2px;
    display: inline-block
}

.detail .def-tags span {
    border: 1px solid #999;
    color: #666;
    border-radius: 2px;
    display: inline-block;
    line-height: 16px;
    font-size: 12px;
    width: 36px;
    text-align: center;
    margin-right: 8px
}

    .hjenglish .detail-groups dl{counter-reset:eq;margin-bottom:.5em;clear:both}
    .hjenglish ol,.hjenglish ul{list-style:none}
    .hjenglish dd{margin-left:1em}
    .hjenglish dd>p{margin-left:2.5em}
    `;
    // iframe 工具库
    var iframe = document.createElement('iframe');
    var iframeWin = null;
    var iframeDoc = null;
    iframe.style.display = 'none';
    var icon = document.createElement('tr-icon'), //翻译图标
        content = document.createElement('tr-content'), // 内容面板
        contentList = document.createElement('div'), //翻译内容结果集（HTML内容）列表
        selected, // 当前选中文本
        engineId, // 当前翻译引擎
        engineTriggerTime, // 引擎触发时间（milliseconds）
        idsType, // 当前翻译面板内容列表数组
        pageX, // 图标显示的 X 坐标
        pageY; // 图标显示的 Y 坐标
    // 初始化内容面板
    content.appendChild(contentList);
    // 发音缓存
    var audioCache = {}; // {'mp3 download url': data}
    // 翻译引擎结果集
    var engineResult = {}; // id: DOM 
    // 唯一 ID
    var ids = {
        HJENGLISH: 'hjenglish',
    };
    // 唯一 ID 扩展
    var idsExtension = {
        // ID 组
        LIST_DICT: [ids.HJENGLISH,],
        LIST_DICT_LOWER_CASE: [ids.HJENGLISH,],
        // 去重比对（大小写翻译可能一样）
        lowerCaseMap: (function () {
            var obj = {};
            return obj;
        })(),
        // 标题
        names: (function () {
            var obj = {};
            obj[ids.HJENGLISH] = '沪江小D';
            return obj;
        })(),
        // 跳转到网站（“%q%”占位符或者 function text -> return URL）
        links: (function () {
            var obj = {};
            obj[ids.HJENGLISH] = 'https://dict.hjenglish.com/jp/jc/%q%';
            return obj;
        })(),
        // 翻译引擎
        engines: (function () {
            var obj = {};
            obj[ids.HJENGLISH] = function (text, time) {
                ajax('https://dict.hjenglish.com/jp/jc/' + encodeURIComponent(text), function (rst) {
                    putEngineResult(ids.HJENGLISH, parseHjenglish(rst, time, text), time);
                    showContent();
                }, function (rst) {
                    putEngineResult(ids.HJENGLISH, htmlToDom('error: 无法连接翻译服务'), time);
                    showContent();
                }, {
                    headers: {
                        'Cookie': 'HJ_SID=' + uuid() + '; HJ_SSID_3=' + uuid() + '; HJ_CST=1; HJ_CSST_3=1; HJ_UID=' + uuid(),
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36'
                    }
                });
            };

            return obj;
        })()
    };
    var vices = [];
    var vice;
    var ttt = '';

    function speech(event) {
        var ss = icon.querySelector('img[icon-id="icon-speech"]');

        if (event.target === ss) {
            var x = new SpeechSynthesisUtterance(ttt);
            x.voice = vice;
            speechSynthesis.speak(x);

        }
    }

    // 绑定图标拖动事件
    var iconDrag = new Drag(icon);
    // 图标数组
    var iconArray = [{
        name: '沪江小D',
        id: 'icon-dict',
        image: 'data:image/png;base64,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',
        trigger: function (text, time) {
            idsType = idsExtension.LIST_DICT;
            if (text != text.toLowerCase()) {
                idsType = idsExtension.LIST_DICT_LOWER_CASE; // 改为大小写 ID 组（大小写各请求一次）
            }
            idsType.forEach(function (id) {
                idsExtension.engines[id](text, time);
            });
            initContent(); // 初始化翻译面板
            displayContent(); // 立马显示翻译面板
        }
    }, {
        name: 'tts发音',
        id: 'icon-speech',
        image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAbCAYAAACJISRoAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANsSURBVEhLlVY7aBRRFD1vN5vVJKtoosFI4icYEEHE+IckiBFJITaWFlpYiIWdFmKhoihYamWhkM7KylYUC+OfWAiCHxJFo0ENyWqya3a8n/f2vdmdgXjZ3fPOnTfvnnNn3syag8NRBPrAGCQiCPGfWLNOhrKaCJEm6oh+ZUDcYh2X8PM1HUctIooDJEU6ol8ZJHCLGv64puNci1gdiSjDep7mRCHObRGvqA7pkzERcjSzMRs566lOFLwjDj1HZXkMlOWyQOdSgxM7gFN7DLpbgYZMuhNNx9EK8wrsQH4X5yL0rwXODwID64DdXcDpPqBjSboTTce5bZfqYIUtjUAhb9DWDBzdanB8O6RV994Czz4DbU3AqkK6E4U4lyKG6vHiBzZEOLcXuEjKL+8H9nUDU7PA9ccRhl8CEzNAls7I0jVKcrJ+eYSeNl7UO+KQIrmswZEtwLFeQ/0HVrYA7fTlRS89AEbGDcoVmW8j2cmFQYNrQ9QRWk8PK0oRvmv61gCleeDqQ+AGKecYnwLGfgKVao9dqJNCPkIrta8hU3PczbcoRTJUsSUP/CkDoxPA96JTSKGSZOhDnZzcZUg90Nxolbtw10TtahFWxpSrahsDXY4HKSY8j28Cbm+eOhE/7J1w2CIxHRQBV0lOlI0EbkcSgRPGqpN4BFwlOVE2ErgdSQROGKtOmHBVVRjocjxIMVmoEw4pwnfPTIl3OLC5HVjRHOhSSRZdqJPRr8Cjj3TD/E13wiFFSvNGJufpOXWmX+8aDr6oXctoEiurVU78zmu63UeAYindCaMUKc/Tjn4F3Hoeyd74RpuQNyJvyLMDwM5OfQr7UCez5KBIHXD7aOwX8O4H8Yp3wmhfvzyinU/fPLWMqy8iPLxJH4zztNvvv9ei21YDV2jDPvlU7YYEn9NEjyZ6/GFmTnPusNWntEwK+NpMz0WYLAK3X0S4+ZTzwFAP0EsFJn8DX6bViV9GdRZLEZ3Lxb0TjqoT7rHkWFLA+X3SUQAObSSXDcDdN8AHagl12K0hYU9LxAX9W+E3Y5ZfVHTa34qRa8D5+uUs1qxj28UTUpA+lcjQ4noXUkclrzP8vBinhWXEhShi10RQhvVcxAd5HVlOBxO5nuSdVJWohHpuUaOGO+WcD7nFqpOYkpDLgLhFjQQeYuAkAvAPy4GovdmaNF4AAAAASUVORK5CYII=',
        trigger: function (text, time) {
            speechSynthesis.getVoices();
            ttt = text;
            setTimeout(() => {
                if (vices.length < 1) {
                    vices = speechSynthesis.getVoices();
                    vices.forEach(value => {
                        if (!vice && value.lang === 'ja-JP') {
                            vice = value;
                        }
                    });
                    if (!vice) {
                        icon.querySelector('img[icon-id="icon-speech"]').title = '似乎无可用的tts,请先安装';

                    }
                }
                if (vice) {
                    var s = new SpeechSynthesisUtterance();
                    s.voice = vice;
                    s.text = text;
                    speechSynthesis.speak(s);
                    var ss = icon.querySelector('img[icon-id="icon-speech"]');
                    ss.addEventListener('click', speech, false)
                }

            }, 1000);

        }
    }];
    // 添加翻译引擎图标
    iconArray.forEach(function (obj) {
        var img = document.createElement('img');
        img.setAttribute('src', obj.image);
        img.setAttribute('alt', obj.name);
        img.setAttribute('title', obj.name);
        img.setAttribute('icon-id', obj.id);
        img.addEventListener('mouseup', function () {
            if (engineId == obj.id) {
                // 已经是当前翻译引擎，不做任何处理
            } else {
                icon.setAttribute('activate', 'activate'); // 标注面板展开
                engineId = obj.id; // 翻译引擎 ID
                engineTriggerTime = new Date().getTime(); // 引擎触发时间
                engineActivateShow(); // 显示翻译引擎指示器
                audioCache = {}; // 清空发音缓存
                engineResult = {}; // 清空翻译引擎结果集
                obj.trigger(selected, engineTriggerTime); // 启动翻译引擎
            }
        });
        icon.appendChild(img);
    });
    // 添加内容面板（放图标后面）
    icon.appendChild(content);
    // 添加样式、翻译图标到 DOM
    var root = document.createElement('div');
    document.documentElement.appendChild(root);
    var shadow = root.attachShadow({
        mode: 'closed'
    });
    // iframe 工具库加入 Shadow
    shadow.appendChild(iframe);
    iframeWin = iframe.contentWindow;
    iframeDoc = iframe.contentDocument;
    // 外部样式表
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = createObjectURLWithTry(new Blob(['\ufeff', style.textContent], {
        type: 'text/css;charset=UTF-8'
    }));
    // 多种方式最大化兼容：Content Security Policy
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
    shadow.appendChild(style); // 内部样式表
    shadow.appendChild(link); // 外部样式表
    // 翻译图标加入 Shadow
    shadow.appendChild(icon);
    // 鼠标事件：防止选中的文本消失
    document.addEventListener('mousedown', function (e) {
        log('mousedown event:', e);
        if (e.target === icon || (e.target.parentNode && e.target.parentNode === icon)) { // 点击了翻译图标
            e.preventDefault();
        }
    });
    // 鼠标事件：防止选中的文本消失；显示、隐藏翻译图标
    document.addEventListener('mouseup', showIcon);
    // 选中变化事件
    document.addEventListener('selectionchange', showIcon);
    document.addEventListener('touchend', showIcon);
    // 内容面板滚动事件
    content.addEventListener('scroll', function (e) {
        if (content.scrollHeight - content.scrollTop === content.clientHeight) {
            log('scroll bottom', e);
            e.preventDefault();
            e.stopPropagation();
        } else if (content.scrollTop === 0) {
            log('scroll top', e);
            e.preventDefault();
            e.stopPropagation();
        }
    });
    /**日志输出*/
    function log() {
        var debug = false;
        if (!debug) {
            return;
        }
        if (arguments) {
            for (var i = 0; i < arguments.length; i++) {
                console.log(arguments[i]);
            }
        }
    }
    /**鼠标拖动*/
    function Drag(element) {
        this.dragging = false;
        this.startDragTime = 0;
        this.stopDragTime = 0;
        this.mouseDownPositionX = 0;
        this.mouseDownPositionY = 0;
        this.elementOriginalLeft = parseInt(element.style.left);
        this.elementOriginalTop = parseInt(element.style.top);
        var ref = this;
        this.startDrag = function (e) {
            e.preventDefault();
            ref.dragging = true;
            ref.startDragTime = new Date().getTime();
            ref.mouseDownPositionX = e.clientX;
            ref.mouseDownPositionY = e.clientY;
            ref.elementOriginalLeft = parseInt(element.style.left);
            ref.elementOriginalTop = parseInt(element.style.top);
            // set mousemove event
            window.addEventListener('mousemove', ref.dragElement);
            log('startDrag');
        };
        this.unsetMouseMove = function () {
            // unset mousemove event
            window.removeEventListener('mousemove', ref.dragElement);
        };
        this.stopDrag = function (e) {
            e.preventDefault();
            ref.dragging = false;
            ref.stopDragTime = new Date().getTime();
            ref.unsetMouseMove();
            log('stopDrag');
        };
        this.dragElement = function (e) {
            log('dragging');
            if (!ref.dragging) {
                return;
            }
            e.preventDefault();
            // move element
            element.style.left = ref.elementOriginalLeft + (e.clientX - ref.mouseDownPositionX) + 'px';
            element.style.top = ref.elementOriginalTop + (e.clientY - ref.mouseDownPositionY) + 'px';
            log('dragElement');
        };
        element.onmousedown = this.startDrag;
        element.onmouseup = this.stopDrag;
    }
    /**是否拖动图标*/
    function isDrag() {
        return iconDrag.elementOriginalLeft !== parseInt(icon.style.left) ||
            iconDrag.elementOriginalTop !== parseInt(icon.style.top);
    }
    /**强制结束拖动*/
    function forceStopDrag() {
        if (iconDrag) {
            // 强制设置鼠标拖动事件结束，防止由于网页本身的其它鼠标事件冲突而导致没有侦测到：mouseup
            iconDrag.dragging = false;
            iconDrag.unsetMouseMove();
        }
    }
    /**是否包含汉字*/
    function hasChineseByRange(str) {
        return /[\u4e00-\u9fa5]/ig.test(str);
    }
    /**uuid*/
    function uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    /**对象转 xml*/
    function objToXml(obj) {
        var xml = '';
        for (var prop in obj) {
            if (obj[prop] instanceof iframeWin.Function) {
                continue;
            }
            xml += obj[prop] instanceof iframeWin.Array ? '' : '<' + prop + '>';
            if (obj[prop] instanceof iframeWin.Array) {
                for (var array in obj[prop]) {
                    if (obj[prop][array] instanceof iframeWin.Function) {
                        continue;
                    }
                    xml += '<' + prop + '>';
                    xml += objToXml(new iframeWin.Object(obj[prop][array]));
                    xml += '</' + prop + '>';
                }
            } else if (obj[prop] instanceof iframeWin.Object) {
                xml += objToXml(new iframeWin.Object(obj[prop]));
            } else {
                xml += obj[prop];
            }
            xml += obj[prop] instanceof iframeWin.Array ? '' : '</' + prop + '>';
        }
        xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
        return xml
    }
    /**xml 转 html*/
    function xmlToHtml(xml, tag) {
        return xml.replace(/<([^/]+?)>/g, '<' + tag + ' class="$1">')
            .replace(/<\/(.+?)>/g, '</' + tag + '>');
    }
    // html 字符串转 DOM
    function htmlToDom(html) {
        var div = document.createElement('div');
        div.innerHTML = html;
        return div;
    }
    /**清理 html*/
    function cleanHtml(html) {
        html = html.replace(/<script[\s\S]*?<\/script>/ig, '')
            .replace(/<link[\s\S]*?>/ig, '')
            .replace(/<style[\s\S]*?<\/style>/ig, '')
            .replace(/<img[\s\S]*?>/ig, '');
        html = cleanAttr(html, 'on[a-z]*');
        return html;
    }
    /**
     * 清理指定属性（忽略大小写）
     * @param attr 支持正则表示（如“on[a-z]*”，表示清理“on”开头的属性：onclick、onmove等）
     */
    function cleanAttr(html, attr) {
        var regex = ' ' + attr + '="([^"<>]*)"';
        return html.replace(new RegExp(regex, 'ig'), '');
    }
    /**带异常处理的 createObjectURL*/
    function createObjectURLWithTry(blob) {
        try {
            return iframeWin.URL.createObjectURL(blob);
        } catch (error) {
            log(error);
        }
        return '';
    }
    /**ajax 跨域访问公共方法*/
    function ajax(url, success, error, obj) {
        if (!!!obj) {
            obj = {};
        }
        if (!!!obj.method) {
            obj.method = 'GET';
        }
        // >>>因为Tampermonkey跨域访问(a.com)时会自动携带对应域名(a.com)的对应cookie
        // 不会携带当前域名的cookie
        // 所以，GM_xmlhttpRequest【不存在】cookie跨域访问安全性问题
        // 以下设置的cookie会添加到已有cookie的后面<<<
        if (!!!obj.headers) {
            obj.headers = {
                'cookie': ''
            };
        }
        GM_xmlhttpRequest({
            method: obj.method,
            url: url,
            headers: obj.headers,
            responseType: obj.responseType,
            data: obj.data,
            onload: function (res) {
                success(res.responseText, res, obj);
            },
            onerror: function (res) {
                error(res.responseText, res, obj);
            },
            onabort: function (res) {
                error('the request was aborted', res, obj);
            },
            ontimeout: function (res) {
                error('the request failed due to a timeout', res, obj);
            },
            onreadystatechange: function () {
                log('ajax:', arguments);
            }
        });
    }
    /**放入翻译引擎结果集*/
    function putEngineResult(id, value, time) {
        if (time == engineTriggerTime) { // 是本次触发的异步ajax请求
            engineResult[id] = value;
        }
    }
    /**初始化面板*/
    function initContent() {
        contentList.innerHTML = ''; // 清空翻译内容列表

        // 初始化翻译引擎结构（此时内容暂未填充）
        idsType.forEach(function (id) {
            if (id in idsExtension.names) {
                var engine = document.createElement('tr-engine');
                engine.setAttribute('data-id', id);
                engine.style.display = 'none'; // 暂无内容默认隐藏
                // 标题
                if (idsExtension.names[id]) {
                    var title = document.createElement('a');
                    title.innerHTML = idsExtension.names[id];
                    title.setAttribute('class', 'title');
                    var href = 'javascript:void(0)';
                    if (idsExtension.links[id]) {
                        var link = idsExtension.links[id];
                        if (typeof link == 'string') {
                            if (link.length > 0) {
                                href = link.replace(/%q%/ig, encodeURIComponent(selected));
                            }
                        } else if (typeof link == 'function') {
                            var fnHref = link(selected);
                            if (fnHref.length > 0) {
                                href = fnHref;
                            }
                        }
                    }
                    title.setAttribute('rel', 'noreferrer noopener');
                    title.setAttribute('target', '_blank');
                    title.setAttribute('href', href);
                    title.setAttribute('title', '打开源网站');
                    engine.appendChild(title);
                }
                contentList.appendChild(engine);
            }
        });
    }
    /**显示内容面板*/
    function displayContent() {
        var panelWidth = iconWidth + 8; // icon 展开后总宽度(8:冗余距离)
        var panelHeight = iconHeight + 8; // icon 展开后总高度(8:冗余距离)
        // 计算位置
        log('content position:',
            'window.scrollY', window.scrollY,
            'document.documentElement.scrollTop', document.documentElement.scrollTop,
            'document.body.scrollTop', document.body.scrollTop,
            'window.innerHeight', window.innerHeight,
            'document.documentElement.clientHeight', document.documentElement.clientHeight,
            'document.body.clientHeight', document.body.clientHeight,
            'icon.style.top', icon.style.top,
            'window.scrollX', window.scrollX,
            'document.documentElement.scrollLeft', document.documentElement.scrollLeft,
            'document.body.scrollLeft', document.body.scrollLeft,
            'window.innerWidth', window.innerWidth,
            'document.documentElement.clientWidth', document.documentElement.clientWidth,
            'document.body.clientWidth', document.body.clientWidth,
            'icon.style.left', icon.style.left
        );
        var scrollTop = Math.max(parseInt(document.documentElement.scrollTop), parseInt(document.body.scrollTop));
        var scrollLeft = Math.max(parseInt(document.documentElement.scrollLeft), parseInt(document.body.scrollLeft));
        var clientHeight = [parseInt(document.documentElement.clientHeight), parseInt(document.body.clientHeight)].filter(function (x) {
            return x <= parseInt(window.innerHeight);
        }).sort(function (a, b) {
            return a > b ? -1 : (a == b ? 0 : 1);
        })[0]; // 找出最大值且小于等于 window 的高度
        if (!clientHeight) { // 网页缩放导致可能数组为空（[0] 为 undefined）
            clientHeight = parseInt(window.innerHeight);
        }
        var clientWidth = [parseInt(document.documentElement.clientWidth), parseInt(document.body.clientWidth)].filter(function (x) {
            return x <= parseInt(window.innerWidth);
        }).sort(function (a, b) {
            return a > b ? -1 : (a == b ? 0 : 1);
        })[0]; // 找出最大值且小于等于 window 的宽度
        if (!clientWidth) { // 网页缩放导致可能数组为空（[0] 为 undefined）
            clientWidth = parseInt(window.innerWidth);
        }
        // 设置新的位置
        var iconNewTop = -1;
        if (parseInt(icon.style.top) < scrollTop) { // 面板在滚动条顶部可见部分之上（隐藏了部分或全部）
            log('Y adjust top');
            iconNewTop = scrollTop; // 设置为滚动条顶部可见部分位置
        } else if (parseInt(icon.style.top) + panelHeight > scrollTop + clientHeight) { // 面板在滚动条滚到最底部时之下（隐藏了部分或全部）
            log('Y adjust bottom');
            iconNewTop = parseInt(scrollTop + clientHeight - panelHeight); // 设置面板底部不超过滚动条滚到最底部时可见部分位置
            if (iconNewTop < scrollTop) { // 如果此时又出现：面板在滚动条顶部可见部分之上（隐藏了部分或全部）
                log('Y adjust bottom top');
                iconNewTop = scrollTop; // 设置为滚动条顶部可见部分位置
            }
        }
        if (iconNewTop != -1 && Math.abs(iconNewTop - parseInt(icon.style.top)) <= panelHeight) {
            log('Y set iconNewTop', iconNewTop);
            icon.style.top = iconNewTop + 'px';
        }
        var iconNewLeft = -1;
        if (parseInt(icon.style.left) < scrollLeft) {
            log('X adjust left');
            iconNewLeft = scrollLeft;
        } else if (parseInt(icon.style.left) + panelWidth > scrollLeft + clientWidth) {
            log('X adjust right');
            iconNewLeft = parseInt(scrollLeft + clientWidth - panelWidth);
            if (iconNewLeft < scrollLeft) {
                log('X adjust right left');
                iconNewLeft = scrollLeft;
            }
        }
        if (iconNewLeft != -1 && Math.abs(iconNewLeft - parseInt(icon.style.left)) <= panelWidth) {
            log('X set iconNewLeft', iconNewLeft);
            icon.style.left = iconNewLeft + 'px';
        }
        content.scrollTop = 0; // 翻译面板滚动到顶端
        content.scrollLeft = 0; // 翻译面板滚动到左端
        content.style.display = 'block';
    }
    /**内容面板填充数据*/
    function showContent() {
        // 填充已有结果集引擎内容
        idsType.forEach(function (id) {
            if (engineResult[id] && !(id in idsExtension.lowerCaseMap)) { // 跳过小写的内容填充
                var engine = contentList.querySelector('tr-engine[data-id="' + id + '"]');
                if (engine) {
                    engine.appendChild(engineResult[id]);
                    engine.removeAttribute('data-id');
                    engine.style.display = 'block';
                }
            }
        });
        // 比较大小写内容
        for (var id in idsExtension.lowerCaseMap) {
            if (engineResult[id] &&
                engineResult[idsExtension.lowerCaseMap[id]] &&
                engineResult[id].innerHTML !== engineResult[idsExtension.lowerCaseMap[id]].innerHTML &&
                engineResult[id].innerHTML.toLowerCase() !== engineResult[idsExtension.lowerCaseMap[id]].innerHTML.toLowerCase()) {
                var engine = contentList.querySelector('tr-engine[data-id="' + id + '"]');
                if (engine) {
                    engine.appendChild(engineResult[id]);
                    engine.removeAttribute('data-id');
                    engine.style.display = 'block';
                }
            }
        }
    }
    /**隐藏翻译引擎指示器*/
    function engineActivateHide() {
        icon.querySelectorAll('img[activate]').forEach(function (ele) {
            ele.removeAttribute('activate');
        });
    }
    /**显示翻译引擎指示器*/
    function engineActivateShow() {
        engineActivateHide();
        icon.querySelector('img[icon-id="' + engineId + '"]').setAttribute('activate', 'activate');
    }
    /**显示 icon*/
    function showIcon(e) {
        log('showIcon event:', e);
        var offsetX = 4; // 横坐标翻译图标偏移
        var offsetY = 8; // 纵坐标翻译图标偏移
        // 更新翻译图标 X、Y 坐标
        if (e.pageX && e.pageY) { // 鼠标
            log('mouse pageX/Y');
            pageX = e.pageX;
            pageY = e.pageY;
        }
        if (e.changedTouches) { // 触屏
            if (e.changedTouches.length > 0) { // 多点触控选取第 1 个
                log('touch pageX/Y');
                pageX = e.changedTouches[0].pageX;
                pageY = e.changedTouches[0].pageY;
                // 触屏修改翻译图标偏移（Android、iOS 选中后的动作菜单一般在当前文字顶部，翻译图标则放到底部）
                offsetX = -26; // 单个翻译图标块宽度
                offsetY = 16 * 3; // 一般字体高度的 3 倍，距离系统自带动作菜单、选择光标太近会导致无法点按
            }
        }
        log('selected:' + selected + ', pageX:' + pageX + ', pageY:' + pageY)
        if (e.target == icon || (e.target.parentNode && e.target.parentNode == icon)) { // 点击了翻译图标
            e.preventDefault();
            return;
        }
        selected = window.getSelection().toString().trim(); // 当前选中文本
        log('selected:' + selected + ', icon display:' + icon.style.display);
        if (selected && icon.style.display !== 'block' && /[\u30a1-\u30f6\u3041-\u3093\uFF00-\uFFFF\u4e00-\u9fa5]/.test(selected) && pageX && pageY) { // 显示翻译图标
            log('show icon');
            icon.style.top = pageY + offsetY + 'px';
            icon.style.left = pageX + offsetX + 'px';
            icon.style.display = 'block';
            // 兼容部分 Content Security Policy
            icon.style.position = 'absolute';
            icon.style.zIndex = zIndex;
        } else if (!selected) { // 隐藏翻译图标
            log('hide icon');
            hideIcon();
        }
    }
    /**隐藏 icon*/
    function hideIcon() {
        icon.style.display = 'none';
        icon.removeAttribute('activate'); // 标注面板关闭
        content.style.display = 'none';
        engineId = '';
        engineTriggerTime = 0;
        pageX = 0;
        pageY = 0;
        engineActivateHide();
        audioCache = {};
        engineResult = {};
        forceStopDrag();
        var s = icon.querySelector('.langs-cj');
        if (s) {
            s.parentNode.removeChild(s);
        }
        var k = icon.querySelector('img[icon-id="icon-speech"]');
        speechSynthesis.cancel();
        if (k) {
            k.removeEventListener('click', speech, false)
        }
    }
    /**发音*/
    function play(obj) {
        if (obj.url in audioCache) { // 查找缓存
            log('audio in cache', obj, audioCache);
            playArrayBuffer(audioCache[obj.url]); // 播放
        } else {
            ajax(obj.url, function (rst, res) {
                audioCache[obj.url] = res.response; // 放入缓存
                playArrayBuffer(audioCache[obj.url]); // 播放
            }, function (rst) {
                log(rst);
            }, {
                responseType: 'arraybuffer'
            });
        }
    }
    /**播放 ArrayBuffer 音频*/
    function playArrayBuffer(arrayBuffer) {
        var context = new iframeWin.AudioContext() || new iframeWin.webkitAudioContext();
        context.decodeAudioData(arrayBuffer.slice(0), function (audioBuffer) { // `slice(0)`克隆一份（`decodeAudioData`后原数组清空）
            var bufferSource = context.createBufferSource();
            bufferSource.buffer = audioBuffer;
            bufferSource.connect(context.destination);
            bufferSource.start();
        });
    }
    /**得到发音按钮*/
    function getPlayButton(obj) {
        var type = document.createElement('a');
        type.innerHTML = obj.name;
        type.setAttribute('href', 'javascript:void(0)');
        type.setAttribute('class', 'audio-button');
        type.setAttribute('title', '点击发音');
        type.addEventListener('mouseup', function () {
            play(obj);
        });
        return type;
    }

    // 音频播放器
    function AudioPlayer() {
        var audio = document.createElement('audio');
        audio.setAttribute('controls', 'controls');
        audio.style.display = 'none';
        // audio.setAttribute('src', src);
        document.body.appendChild(audio);

        this.play = function (src) {
            audio.setAttribute('src', src);
            audio.play();
            return this;
        };
        this.stop = function () {
            audio.pause();
            return this;
        };
        // 播放结束回调
        this.end = function (callback) {
            var repeat = setInterval(function () {
                if (audio.ended) {
                    clearInterval(repeat);
                    callback && callback();
                }
            }, 100);
            setTimeout(function () {
                clearInterval(repeat);
            }, 5000);
        };

        return this;
    }


    //查日语没有结果时，查中日词典
    function cj(time, tex, audio) {
        ajax('https://dict.hjenglish.com/jp/cj/' + encodeURIComponent(tex), function (rst) {
            putEngineResult(ids.HJENGLISH, function (rst, time, text, audio) {
                var dom = document.createElement('div');
                dom.setAttribute('class', ids.HJENGLISH);
                var parser = new DOMParser(), doc = parser.parseFromString(rst, 'text/html');
                //content = doc.documentElement;
                var x = doc.getElementsByClassName('word-details')[0];
                if (!x) {

                    return htmlToDom('error: 查询无结果，可能没这个词');
                }
                var engine = contentList.querySelector('tr-engine[data-id="' + ids.HJENGLISH + '"]');
                var a = engine.querySelector('a.title');
                a.href = a.href.replace('/jc/', '/cj/');
                //engine.querySelector('a[rel=noreferrer noopener]');
                var fot = x.querySelector('.word-details-pane-footer');
                fot.parentNode.removeChild(fot);
                var add = x.querySelector('.add-scb');
                add.parentNode.removeChild(add);
                var s = x.querySelector('.simple-definition');
                var ar = s.textContent.split('；');
                var y = '<ol>';
                if (ar.length > 1) {
                    ar.forEach(function (string, index,) {
                        y += `<li>${string}</li>`;
                    });
                    y += '</ol>';
                    s.innerHTML = y;
                }
                var t = x.querySelectorAll('.detail-groups dl dd');
                if (t.length > 0) {
                    t.forEach((value => {
                        value.style = 'margin-inline-start:6px';
                    }))
                }
                var ul = x.querySelectorAll('.detail-groups dl dd ul');
                //console.log('sss')
                if (ul.length > 0) {
                    ul.forEach((v, i) => {
                        v.style.display = 'none';
                        //console.log(v.childNodes.length)
                        if (v.children.length < 1) {
                            return;
                        }
                        var y = v.previousElementSibling.lastElementChild;
                        var s = document.createElement('b');
                        s.style.cursor = 'pointer';
                        s.style.color = 'firebrick';
                        s.style.fontSize = '0.8em';
                        s.textContent = '例';
                        s.title = '点击查看或隐藏例句';
                        s.onclick = (event) => {
                            v.style.display = v.style.display === 'none' ? 'block' : 'none';
                        };
                        y.appendChild(s);
                    });
                }
                var er = x.querySelectorAll('.detail-groups dl dd h3');
                if (er.length > 0) {
                    er.forEach(value => {
                        value.style.fontSize = '1em';
                    })
                }

                var li = x.querySelectorAll('.detail-groups dl dd ol,ul');
                if (li) {
                    li.forEach(function (e) {
                        e.style.listStyle = 'list-style: none';
                    });
                }
                //添加音频按钮
                var auds = x.querySelectorAll('.word-audio');
                auds.forEach(function (aud) {
                    if (aud.getAttribute('data-src')) {
                        aud.classList.add('audio');
                        if (aud.parentElement.classList.contains('pronounces')) {
                            aud.classList.add('audio-light');
                        }
                        if (aud.parentElement.classList.contains('def-sentence-from')) {
                            aud.parentElement.innerHTML = aud.parentElement.innerHTML.replace(tex, `<mark data-markjs="true" class="highlight">${tex}</mark>`);
                        }
                    }
                });

                return x;
            }(rst, time, tex, audio), time);
            showContent();
        }, function (rst) {
            putEngineResult(ids.HJENGLISH, htmlToDom('error: 无法连接翻译服务'), time);
            showContent();
        }, {
            headers: {
                'Cookie': 'HJ_SID=' + uuid() + '; HJ_SSID_3=' + uuid() + '; HJ_CST=1; HJ_CSST_3=1; HJ_UID=' + uuid(),
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36'
            }
        });
    }


    /**沪江小D排版*/
    function parseHjenglish(rst, time, tex) {
        var audio = new AudioPlayer();
        var dom = document.createElement('div');
        dom.addEventListener('click', function (event) {
            var tar = event.target;
            if (tar.getAttribute('data-src') && tar.classList.contains('audio')) {
                audio.play(tar.getAttribute('data-src'))
            }
        }, false);
        dom.setAttribute('class', ids.HJENGLISH);
        var parser = new DOMParser(), doc = parser.parseFromString(rst, 'text/html'),
            //content = doc.documentElement;
            content = doc.getElementsByClassName('word-details')[0];
        if (!content) {
            return cj(time, tex, audio);
        }
        dom.appendChild(content);
        //添加音频按钮
        var auds = dom.querySelectorAll('.word-audio');
        auds.forEach(function (aud) {
            if (aud.getAttribute('data-src')) {
                aud.classList.add('audio');
                if (aud.parentElement.classList.contains('pronounces')) {
                    aud.classList.add('audio-light');
                }
                if (aud.parentElement.classList.contains('def-sentence-from')) {
                    aud.parentElement.innerHTML = aud.parentElement.innerHTML.replace(tex, `<mark data-markjs="true" class="highlight">${tex}</mark>`);
                }
            }
        });

        var panee = dom.querySelectorAll('.word-details-pane-footer');
        panee.forEach(function (pane) {
            pane.parentNode.removeChild(pane);
        });
        var h = dom.querySelectorAll('.simple h2');
        if (h) {
            h.forEach(function (h) {
                h.outerHTML = `<b>${h.textContent}</b>`;
            })
        }

        var wDHs = dom.querySelectorAll('.word-details-header>p');
        wDHs.forEach(function (wDH) {
            wDH.parentNode.removeChild(wDH);
        });
        var addScbs = dom.querySelectorAll('.add-scb');
        addScbs.forEach(function (addScb) {
            addScb.parentNode.removeChild(addScb)

        });

        var feed = dom.querySelector('.button word-details-button-feedback');
        if (feed) {
            feed.parentNode.removeChild(feed)
        }
        var tabss = dom.querySelectorAll('.word-details-tab');

        var ul = dom.querySelectorAll('.detail-groups dl dd ul');
        if (ul.length > 0) {
            ul.forEach((v, i) => {
                v.style.display = 'none';

                if (v.children.length < 1) {
                    return;
                }
                var y = v.previousElementSibling.lastElementChild;
                var s = document.createElement('b');
                s.style.cursor = 'pointer';
                s.style.color = 'firebrick';
                s.style.fontSize = '0.8em';
                s.textContent = '例';
                s.title = '点击查看或隐藏例句';
                s.onclick = (event) => {
                    v.style.display = v.style.display === 'none' ? 'block' : 'none';
                };
                y.appendChild(s);
            });
        }

        if (tabss.length > 1) {
            var panes = dom.querySelectorAll('.word-details-pane');
            var j = 0;
            var dat = panes;
            for (j; j < tabss.length; ++j) {
                tabss[j].addEventListener('click', function () {
                    if (this.classList.contains('word-details-tab-active')) {
                        return false
                    }
                    this.parentNode.querySelector('.word-details-tab-active').classList.remove('word-details-tab-active');
                    //this.parentNode.querySelector('.word-details-tab-active').classList.remove('word-details-tab-active');
                    var that = this;
                    this.classList.add('word-details-tab-active');
                    tabss.forEach(function (v, k, p) {
                        if (v === that) {

                            panes = dom.querySelectorAll('.word-details-pane');
                            panes.forEach((value, key) => {
                                if (value.style.display === 'block' || value.style.display === '') {
                                    value.style.display = 'none';
                                }
                            });
                            panes.forEach((value, key) => {
                                if (key === k) {
                                    value.style.display = 'block';
                                }
                            });
                        }
                    });
                }, true)
            }
        }
        if (/[\u4e00-\u9fa5]/.test(tex) || /[^\x00-\xff]/.test(tex)) {
            var img = icon.querySelector('img');
            var im = document.createElement('span');
            im.style = `
    font-size: 14px;
    line-height: 20px;
    color: rgb(89, 8, 99);
    cursor: pointer;
    float: right;
    margin-right: 1rem;
`;
            im.title = '点击查看汉字日文查询';
            im.classList.add('langs-cj');
            im.textContent = '中日';
            im.onclick = function () {
                im.parentNode.removeChild(im)
                contentList.querySelector('tr-engine').setAttribute('data-id', ids.HJENGLISH);
                return cj(time, tex, audio);
            };
            img.parentNode.insertBefore(im, img.nextSibling)
        }

        //var uls = dom.querySelectorAll('.detail-groups');
        //debugger
        return dom;
    }
    /**
     * 谷歌翻译 token 计算
     * https://github.com/hujingshuang/MTrans
     * */
    function token(a) {
        var k = "";
        var b = 406644;
        var b1 = 3293161072;

        var jd = ".";
        var sb = "+-a^+6";
        var Zb = "+-3^+b+-f";

        for (var e = [], f = 0, g = 0; g < a.length; g++) {
            var m = a.charCodeAt(g);
            128 > m ? e[f++] = m : (2048 > m ? e[f++] = m >> 6 | 192 : (55296 == (m & 64512) && g + 1 < a.length && 56320 == (a.charCodeAt(g + 1) & 64512) ? (m = 65536 + ((m & 1023) << 10) + (a.charCodeAt(++g) & 1023), e[f++] = m >> 18 | 240, e[f++] = m >> 12 & 63 | 128) : e[f++] = m >> 12 | 224, e[f++] = m >> 6 & 63 | 128), e[f++] = m & 63 | 128)
        }
        a = b;
        for (f = 0; f < e.length; f++) a += e[f],
            a = RL(a, sb);
        a = RL(a, Zb);
        a ^= b1 || 0;
        0 > a && (a = (a & 2147483647) + 2147483648);
        a %= 1E6;
        return a.toString() + jd + (a ^ b)
    };

    function RL(a, b) {
        var t = "a";
        var Yb = "+";
        for (var c = 0; c < b.length - 2; c += 3) {
            var d = b.charAt(c + 2),
                d = d >= t ? d.charCodeAt(0) - 87 : Number(d),
                d = b.charAt(c + 1) == Yb ? a >>> d : a << d;
            a = b.charAt(c) == Yb ? a + d & 4294967295 : a ^ d
        }
        return a
    }
})();