// ==UserScript==
// @name         swagger-umi-request-generate
// @namespace
// @version      4.1
// @description  根据swagger生成umi request请求模板代码
// @author       leesher
// @match        http://*/swagger-ui.html*
// @grant        GM_addStyle
// @run-at       document-end
// @require     https://cdn.bootcdn.net/ajax/libs/jquery/3.4.1/jquery.min.js
// @require     https://cdn.bootcdn.net/ajax/libs/clipboard.js/2.0.6/clipboard.js
// @require     https://cdn.bootcdn.net/ajax/libs/jquery-toast-plugin/1.3.2/jquery.toast.js
// @require    https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @resource    customCSS https://cdn.bootcdn.net/ajax/libs/jquery-toast-plugin/1.3.2/jquery.toast.css


// @grant       GM_addStyle
// @grant       GM_getResourceText

// @namespace lee
// @downloadURL https://update.greasyfork.org/scripts/426942/swagger-umi-request-generate.user.js
// @updateURL https://update.greasyfork.org/scripts/426942/swagger-umi-request-generate.meta.js
// ==/UserScript==

(function() {
    'use strict'

    console.log('油猴启动')
    function addStyle(){

        var newCSS = GM_getResourceText ("customCSS");
        GM_addStyle ( `

    .opblock-tag-section >div >span{
    position:relative;
    display:block;
    }
        .opblock-tag-section >div >span>div:nth-child(2){
    position:absolute;
    right:0;
    top:10px;
    width:300px;
    }

` );
        GM_addStyle (newCSS);
    }

    new ClipboardJS('.copy-btn')

    function createATag(text, content) {
        const temp = $(`<button style="margin-right:20px;margin-bottom:5px;border:none;background:white" class="btn copy-btn" data-clipboard-text="${content}">${text}</button>`)

        temp.on('click', function(event) {

            event.preventDefault();
            $.toast({
                heading: '复制成功',
                position: 'mid-center',
                stack: false,
                hideAfter:200,
                icon:"success"
            })

        })

        return temp
    }

    function toHump(name) {
        return name.replace(/\-(\w)/g, function(all, letter){
            return letter.toUpperCase();
        });
    }
    function toCamelCase(str){
      var regExp=/[-_]\w/ig;
      return str.replace(regExp,function(match){
            return match.charAt(1).toUpperCase();
       });
}
    const titlecase = input => input[0].toLocaleUpperCase() + input.slice(1);
    function toPascalCase(value) {

  if (value === null || value === void 0) return '';
  if (typeof value.toString !== 'function') return '';

  let input = value.toString().trim();
  if (input === '') return '';
  if (input.length === 1) return input.toLocaleUpperCase();

  let match = input.match(/[a-zA-Z0-9]+/g);
  if (match) {
      input[0].toLocaleUpperCase() + input.slice(1);
    return match.map(m => titlecase(m)).join('');
  }

  return input;
}
    function createFunc(methoud, path, description) {
     const pathSplitArr = path.split("/")
     const secondUrlItem = pathSplitArr.pop()
     const firstUrlItem =pathSplitArr.pop()
        const methoudName =   _.camelCase( path.replace(".json", ""));

           return methoudName
    }

    function eachChildAddBtn(index, $el){
        $el = $($el)

        const methoud = $($el).find('.opblock-summary-method').text()
        const path = $($el).find('.opblock-summary-path > a > span').text().replace(/[\u200B-\u200D\uFEFF]/g, '');
        const description = $($el).find('.opblock-summary-description').text()

        $el.append($('<div></div>')
                   .append(createATag('复制URL', path))
                   .append(createATag('复制请求函数名', createFunc(methoud, path, description)))
                  )

    }
    addStyle();
    // 当页面载入时如果有tab,初始化按钮
    var clear = setInterval(function (){
        var isOpenDom = $(".opblock-tag-section.is-open");
        if ( isOpenDom.length > 0 ) {

            isOpenDom.children().eq(1).children('span').each(eachChildAddBtn)
            clearInterval(clear)

        }
    },300)
    $('body')
        .delegate('.opblock-tag', 'click', function(event) {
        clearInterval(clear)
        console.log($(this).next())
        setTimeout(() => {
            $(this).next().children('span').each(eachChildAddBtn)
        })
    })
})();
(function (){
function createDom(type, props, style) {
  const dom = document.createElement(type)
  Object.assign(dom, props)
  Object.assign(dom.style, style)
  return dom
}

const appStyle = createDom('link', {
  as: 'style',
  rel: 'stylesheet',
  type: 'text/css',
  href: 'https://sf16-eacdn-tos.pstatp.com/obj/eaoffice/swagger-extends/css/app.6b076305.css'
})
const chunkStyle = createDom('link', {
  as: 'style',
  rel: 'stylesheet',
  type: 'text/css',
  href: 'https://sf16-eacdn-tos.pstatp.com/obj/eaoffice/swagger-extends/css/chunk-vendors.c63c8862.css'
})
const eleWoff = createDom('link', {
  href: 'https://sf16-eacdn-tos.pstatp.com/obj/eaoffice/swagger-extends/fonts/element-icons.535877f5.woff'
})
const eleTtf = createDom('link', {
  href: 'https://sf16-eacdn-tos.pstatp.com/obj/eaoffice/swagger-extends/fonts/element-icons.732389de.ttf'
})
document.head.append(appStyle)
document.head.append(chunkStyle)
document.head.append(eleWoff)
document.head.append(eleTtf)

const appScript = createDom('script', {
  src: 'https://sf16-eacdn-tos.pstatp.com/obj/eaoffice/swagger-extends/js/app.262594ef.js'
})
const chunkScript = createDom('script', {
  src: 'https://sf16-eacdn-tos.pstatp.com/obj/eaoffice/swagger-extends/js/chunk-vendors.9f96de28.js'
})
document.body.append(appScript)
document.body.append(chunkScript)
})();