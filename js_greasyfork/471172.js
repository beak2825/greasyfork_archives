// ==UserScript==
// @name         YApi tools
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  YApi支持点击复制ts interface、侧边菜单stick
// @author       sunset-L
// @match        *://*/project/*/interface/api*
// @grant        GM_addElement
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @require      https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.4/toastr.min.js
// @downloadURL https://update.greasyfork.org/scripts/471172/YApi%20tools.user.js
// @updateURL https://update.greasyfork.org/scripts/471172/YApi%20tools.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const copyIcon = `
    <svg t="1689734537272" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1522" width="1em" height="1em"><path d="M672 832 224 832c-52.928 0-96-43.072-96-96L128 160c0-52.928 43.072-96 96-96l448 0c52.928 0 96 43.072 96 96l0 576C768 788.928 724.928 832 672 832zM224 128C206.368 128 192 142.368 192 160l0 576c0 17.664 14.368 32 32 32l448 0c17.664 0 32-14.336 32-32L704 160c0-17.632-14.336-32-32-32L224 128z" fill="#5E6570" p-id="1523"></path><path d="M800 960 320 960c-17.664 0-32-14.304-32-32s14.336-32 32-32l480 0c17.664 0 32-14.336 32-32L832 256c0-17.664 14.304-32 32-32s32 14.336 32 32l0 608C896 916.928 852.928 960 800 960z" fill="#5E6570" p-id="1524"></path><path d="M544 320 288 320c-17.664 0-32-14.336-32-32s14.336-32 32-32l256 0c17.696 0 32 14.336 32 32S561.696 320 544 320z" fill="#5E6570" p-id="1525"></path><path d="M608 480 288.032 480c-17.664 0-32-14.336-32-32s14.336-32 32-32L608 416c17.696 0 32 14.336 32 32S625.696 480 608 480z" fill="#5E6570" p-id="1526"></path><path d="M608 640 288 640c-17.664 0-32-14.304-32-32s14.336-32 32-32l320 0c17.696 0 32 14.304 32 32S625.696 640 608 640z" fill="#5E6570" p-id="1527"></path></svg>
  `
  GM_addElement(document.body, 'div', {
    class: 'interface-btn',
  });
  $('.interface-btn')[0].innerHTML = copyIcon
  GM_addStyle(`
      .ant-layout-sider {position: sticky; top: 0;}
      .interface-btn {
        position: fixed;
        top: 80px;
        right: 18px;
        background: #fff;
        border-radius: 4px;
        box-shadow: 0 0 8px 1px darkgray;
        cursor: pointer;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px;
      }
    `);
  GM_addStyle("@import url('https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.4/toastr.min.css');");
  let resData;

  $('.interface-btn').on('click', () => {
    const pathnameArr = location.pathname.split('/')
    const id = pathnameArr[pathnameArr.length - 1]
    const url = `${location.origin}/api/interface/get?id=${id}`
    if (isNaN(Number(id))) {
      toastr.error('非接口详情')
      return
    }
    fetch(url)
      .then(response => response.json())
      .then(res => {
        if (res.errcode) {
          return
        }
        resData = res.data


        let reqbody = resData.req_body_other
          ? `export interface ReqBody ${generateInterface(JSON.parse(resData.req_body_other))}`
          : ''
        const resbody = `export interface ResBody ${generateInterface(JSON.parse(resData.res_body), { isRes: true, gap: '  ' })}`
        GM_setClipboard(`${reqbody}\n${resbody}`, 'text')
        toastr.success('Copied！')
      });
  })

  const generateInterface = (obj, opt = { isRes: false, gap: `  ` }) => {
    const { isRes, gap } = opt
    let result = `{\n`
    if (obj.properties) {
      const keys = Object.keys(obj.properties)
      if (keys.length) {
        keys.forEach(k => {
          const type = typeTojs(obj.properties[k].type)
          const description = obj.properties[k].description
          const remark = description ? `${gap}// ${description}\n` : ''
          // 响应体的时候默认都是必须
          const isRequired = obj.required && obj.required.includes(k) || isRes
          const field = `${k}${isRequired ? '': '?'}`
          switch (type) {
            case 'any':
              result += `${remark}${gap}${field}: ${generateInterface(obj.properties[k], { ...opt, gap: `${gap}  ` })}\n`
              break
            case 'Array':
              result += `${remark}${gap}${field}: Array<${generateInterface(obj.properties[k].items,  { ...opt, gap: `${gap}  ` })}>\n`
              break
            default:
              result += `${remark}${gap}${field}: ${type}\n`
          }
        })
      }
    }
    result += `${gap.substring(2)}}`
    return result
  }

  /**
   * yapi type 转为ts类型
   * @param type
   * @returns {*}
   */
  const typeTojs = (type) => {
    return type.replace('array', 'Array').replace('object', 'any').replace('integer', 'number')
  }
})();
