// ==UserScript==
// @name         MyContextMenu
// @description   http://https://wish123.cnblogs.com/?MyContextMenu
// @version      1.0
// @description  原生js右键弹出菜单
// @author       Wilson
// @license      MIT


// modify by https://github.com/electerious/basicContext/
(function() {
  if(document.querySelector("#myContextMenuStyle")) {
    return;
  }
  let style = `
<style id="myModalStyle">
/* base css */
.basicContext,
.basicContext * {
  box-sizing: border-box;
}
.basicContextContainer {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
  -webkit-tap-highlight-color: transparent;
}
.basicContext {
  position: absolute;
  opacity: 0;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.basicContext__item {
  cursor: pointer;
}
.basicContext__item--separator {
  float: left;
  width: 100%;
  height: 1px;
  cursor: default;
}
.basicContext__item--disabled {
  cursor: default;
}
.basicContext__data {
  min-width: 140px;
  padding-right: 20px;
  text-align: left;
  white-space: nowrap;
}
.basicContext__icon {
  display: inline-block;
}
.basicContext--scrollable {
  height: 100%;
  -webkit-overflow-scrolling: touch;
  overflow-y: auto;
}
.basicContext--scrollable .basicContext__data {
  min-width: 160px;
}

/* default theme css */
.basicContext {
  padding: 6px;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4), 0 0 1px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
.basicContext__item {
  margin-bottom: 2px;
}
.basicContext__item--separator {
  margin: 4px 0;
  background-color: rgba(0, 0, 0, 0.1);
}
.basicContext__item--disabled {
  opacity: 0.5;
}
.basicContext__item:last-child {
  margin-bottom: 0;
}
.basicContext__data {
  padding: 6px 8px;
  color: #333;
  border-radius: 2px;
}
.basicContext__item:not(.basicContext__item--disabled):hover
  .basicContext__data {
  color: #fff;
  background-color: #4393e6;
}
.basicContext__item:not(.basicContext__item--disabled):active
  .basicContext__data {
  background-color: #1d79d9;
}
.basicContext__icon {
  margin-right: 10px;
  width: 12px;
  text-align: center;
}

/* [自定义] 自定义css样式 */
.basicContextContainer{
    width: auto;
    height: auto;
}
.basicContext {
    padding: 0px;
    min-width: 150px;
    height: auto;
    background-color: rgba(241, 240, 240, 0.96);
}
.basicContext table{
    padding: 4px 0;
    width: 100%;
}
.basicContext__item {
    margin-bottom: 0px;
}
.basicContext__data {
    padding: 2px 12px;
    border-radius:0px;
    font-size: 13.8px;
    color: #3a383a;
}
.basicContext__item--separator {
    margin: 2px 0;
}
.basicContext__item:not(.basicContext__item--disabled):hover .basicContext__data {
    background-color: #4d92f8;
}
</style>
  `
  document.body.insertAdjacentHTML("beforeend", style);
})();

"use strict";
!(function (basicContext, callback) {
  "undefined" != typeof module && module.exports
    ? (module.exports = callback())
    : "function" == typeof define && define.amd
    ? define(callback)
    : (window[basicContext] = callback());
})("basicContext", function () {

let overflow = null

const ITEM      = 'item',
      SEPARATOR = 'separator'

const dom = function(elem = '') {

	return document.querySelector('.basicContext ' + elem)

}

const valid = function(item = {}) {

	let emptyItem = (Object.keys(item).length===0 ? true : false)

	if (emptyItem===true)     item.type    = SEPARATOR
	if (item.type==null)      item.type    = ITEM
	if (item.class==null)     item.class   = ''
	if (item.visible!==false) item.visible = true
	if (item.icon==null)      item.icon    = null
	if (item.title==null)     item.title   = 'Undefined'

	// Add disabled class when item disabled
	if (item.disabled!==true) item.disabled = false
	if (item.disabled===true) item.class += ' basicContext__item--disabled'

	// Item requires a function when
	// it's not a separator and not disabled
	if (item.fn==null && item.type!==SEPARATOR && item.disabled===false) {

		console.warn(`Missing fn for item '${ item.title }'`)
		return false

	}

	return true

}

const buildItem = function(item, num) {

	let html = '',
	    span = ''

	// Parse and validate item
	if (valid(item)===false) return ''

	// Skip when invisible
	if (item.visible===false) return ''

	// Give item a unique number
	item.num = num

	// Generate span/icon-element
	if (item.icon!==null) span = `<span class='basicContext__icon ${ item.icon }'></span>`

	// [自定义]
	item.extAttr = item.extAttr || ""

	// Generate item
	if (item.type===ITEM) {

		html = `
		       <tr class='basicContext__item ${ item.class }'>
		           <td class='basicContext__data' data-num='${ item.num }' ${item.extAttr}>${ span }${ item.title }</td>
		       </tr>
		       `

	} else if (item.type===SEPARATOR) {

		html = `
		       <tr class='basicContext__item basicContext__item--separator'></tr>
		       `

	}

	return html

}

const build = function(items) {

	let html = ''

	html += `
	        <div class='basicContextContainer'>
	            <div class='basicContext'>
	                <table cellspacing="0">
	                    <tbody>
	        `

	items.forEach((item, i) => html += buildItem(item, i))

	html += `
	                    </tbody>
	                </table>
	            </div>
	        </div>
	        `

	return html

}

const getNormalizedEvent = function(e = {}) {

	let pos = {
		x : e.clientX,
		y : e.clientY
	}

	if (e.type==='touchend' && (pos.x==null || pos.y==null)) {

		// We need to capture clientX and clientY from original event
		// when the event 'touchend' does not return the touch position

		let touches = e.changedTouches

		if (touches!=null&&touches.length>0) {
			pos.x = touches[0].clientX
			pos.y = touches[0].clientY
		}

	}

	// Position unknown
	if (pos.x==null || pos.x < 0) pos.x = 0
	if (pos.y==null || pos.y < 0) pos.y = 0

	return pos

}

const getPosition = function(e, context) {

	// Get the click position
	let normalizedEvent = getNormalizedEvent(e)

	// Set the initial position
	let x = normalizedEvent.x,
	    y = normalizedEvent.y

	// Get size of browser
	let browserSize = {
		width  : window.innerWidth,
		height : window.innerHeight
	}

	// Get size of context
	let contextSize = {
		width  : context.offsetWidth,
		height : context.offsetHeight
	}

	// Fix position based on context and browser size
	if ((x + contextSize.width) > browserSize.width)   x = x - ((x + contextSize.width) - browserSize.width)
	if ((y + contextSize.height) > browserSize.height) y = y - ((y + contextSize.height) - browserSize.height)

	// Make context scrollable and start at the top of the browser
	// when context is higher than the browser
	if (contextSize.height > browserSize.height) {
		y = 0
		context.classList.add('basicContext--scrollable')
	}

	// Calculate the relative position of the mouse to the context
	let rx = normalizedEvent.x - x,
	    ry = normalizedEvent.y - y

	return { x, y, rx, ry }

}

const bind = function(item = {}) {

	if (item.fn==null)        return false
	if (item.visible===false) return false
	if (item.disabled===true) return false

	dom(`td[data-num='${ item.num }']`).onclick       = item.fn
	dom(`td[data-num='${ item.num }']`).oncontextmenu = item.fn

	return true

}

const show = function(items, e, fnClose, fnCallback) {
    //[自定义] delete old menu
    let basicContextContainer = document.querySelector('.basicContextContainer');
    if(basicContextContainer){
        basicContextContainer.remove();
    }

	// Build context
	let html = build(items)

	// Add context to the body
	document.body.insertAdjacentHTML('beforeend', html)

	// Save current overflow and block scrolling of site
	if (overflow==null) {
		overflow = document.body.style.overflow
		document.body.style.overflow = 'hidden'
	}

	// Cache the context
	let context = dom()

	// Calculate position
	let position = getPosition(e, context)

	// Set position
	context.style.left            = `${ position.x }px`
	context.style.top             = `${ position.y }px`
	context.style.transformOrigin = `${ position.rx }px ${ position.ry }px`
	context.style.opacity         = 1

	// Close fn fallback
	if (fnClose==null) fnClose = close

	// Bind click on background
	context.parentElement.onclick       = fnClose
	context.parentElement.oncontextmenu = fnClose

	// Bind click on items
	items.forEach(bind)

	// Do not trigger default event or further propagation
	if (typeof e.preventDefault === 'function')  e.preventDefault()
	if (typeof e.stopPropagation === 'function') e.stopPropagation()

	// Call callback when a function
	if (typeof fnCallback === 'function') fnCallback()

	return true

}

const visible = function() {

	let elem = dom()

	if (elem==null || elem.length===0) return false
	else                               return true

}

const close = function() {

	if (visible()===false) return false

	let container = document.querySelector('.basicContextContainer')

	container.parentElement.removeChild(container)

	// Reset overflow to its original value
	if (overflow!=null) {
		document.body.style.overflow = overflow
		overflow = null
	}

	return true

}

return {
	ITEM,
	SEPARATOR,
	show,
	visible,
	close
}

});

//[自定义] 解决basicContextContainer出现系统菜单的bug
document.addEventListener('click', function(e){
    if(basicContext) basicContext.close();
});
document.addEventListener('contextmenu', function(e){
    if(['basicContextContainer','basicContext'].indexOf(e.target.className)!==-1) {
        e.preventDefault();
        return false;
    }
});

//使用示例
// const clicked = function(e) {
//     console.log(e.target.innerHTML);
// }
// document.querySelector('.my-context-menu-btn').addEventListener('contextmenu', function(e){
//     const items = [
//         { title: '新标签打开链接', extAttr: "data-name='new-blank'", fn: clicked },
//         { },
//         { title: '复制链接地址', extAttr: "data-name='copy-link'", fn: clicked },
//         { title: '复制选中的文本', extAttr: "data-name='copy-text'", fn: clicked, disabled: true },
//         { title: '复制响应数据', extAttr: "data-name='copy-response'", fn: clicked},
//         { },
//         { title: '复制为cURL格式', extAttr: "data-name='copy-curl'", fn: clicked},
//         { title: '复制为fetch格式', extAttr: "data-name='copy-fetch'", fn: clicked},
//         { title: '复制为await格式', extAttr: "data-name='copy-await'", fn: clicked},
//         { title: '复制为xhr格式', extAttr: "data-name='copy-xhr'", fn: clicked},
//         { title: '复制为分享链接', extAttr: "data-name='copy-share'", fn: clicked},
//         { },
//         { title: '删除该请求', extAttr: "data-name='del-request'", fn: clicked},
//         { title: '删除所有请求', extAttr: "data-name='del-all-request'", fn: clicked }
//     ]
//     basicContext.show(items, e);
// });
