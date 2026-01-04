// ==UserScript==
// @name         knife4j接口导出
// @namespace    http://tampermonkey.net/
// @version      0.0.11
// @description  try to take over the world!
// @author       DoveAz
// @match        http://172.16.10.*:*/*/doc.html
// @grant        GM_setClipboard
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.20/lodash.min.js
// @resource     IMPORTED_CSS  https://cdn.jsdelivr.net/npm/layerui@3.1.1/dist/theme/default/layer.css
// @require      https://cdn.jsdelivr.net/npm/layerui@3.1.1/src/layer.min.js
// @downloadURL https://update.greasyfork.org/scripts/421289/knife4j%E6%8E%A5%E5%8F%A3%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/421289/knife4j%E6%8E%A5%E5%8F%A3%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const my_css = GM_getResourceText("IMPORTED_CSS");
    GM_addStyle(my_css);
    knife4jGeneratate()



    function knife4jGeneratate() {
        if(!localStorage.getItem('moduleReplace')){
            localStorage.setItem('moduleReplace','/.*cim6d-(.*)-/,,system')
        }

        $('.knife4j-header-default .right').prepend(
            `
        <button type="button" class="ant-btn ant-btn-primary generate">复制接口</button>
        <button type="button" class="ant-btn ant-btn-primary ant-btn-background-ghost  generateModule">复制本模块</button>
        <button type="button" class="ant-btn ant-btn-info settings">设置</button>
        `
    )
        $('body').append({})

        $('.generate').click(function () {
            const documentEl = document.querySelector('.ant-tabs-tabpane-active .knife4j-body-content .document')
            const vm = documentEl.__vue__
            const api = vm.api
            const result = generateAxios(api)
            GM_setClipboard(result)
        })

        $('.generateModule').click(function () {
            const documentEl = document.querySelector('.ant-tabs-tabpane-active .knife4j-body-content .document')
            const vm = documentEl.__vue__
            const targetMenuList = _.find(vm.swaggerInstance.tags, { name: vm.$route.params.controller }).childrens
            const result = targetMenuList.map(generateAxios).join('\n\n')
            GM_setClipboard(result)
        })

        $('.settings').click(function(){
            const values = localStorage.getItem('moduleReplace')?localStorage.getItem('moduleReplace').split(',,') : []

            const settingsLayer = layer.open({
                title:'设置模块名 (正则替换)',
                type: 1,
                area: ['600px', '280px'], //宽高
                btn: ['确定'],
                shadeClose :true,
                yes: function(index, layero){
                    //按钮【按钮一】的回调
                    const values = $('.module-name-settings input').map(function(){
                        return $(this).val()
                    }).get()
                    localStorage.setItem('moduleReplace',values.join(',,'))
                    layer.close(index)
                }

                ,cancel: function(){
                    //右上角关闭回调

                    //return false 开启该代码可禁止点击该按钮关闭
                },
                content: `
<div class="module-name-settings">
<div style="display:flex;align-items: center;  flex-direction: column;;padding:20px"> <input class="ant-input" placeholder="正则" value="${values[0]}" /><div style="margin:10px 0;">替换为</div><input class="ant-input" value="${values[1]}" />  </div>
</div>
`
            });
            $('.settings-layer-close').click(function(){
                settingsLayer.close()
            })

        })

        function generateAxios(api) {
            const params = api.parameters
            const hasBody = !!_.find(params, { in: 'body' })
            const bodyParams = _.filter(params, { in: 'body' })
            const bodyName = hasBody && bodyParams[0].type === 'array' ? bodyParams[0].name :'body'
            return `/**
* ${api.tags[0]}-${api.summary}
${calculateDocParams(api.parameters)}
*/
export function ${calculateFunctionName(api.showUrl,api.parameters)}(${calculateFunctionParam(api.parameters)}) {
    return ${calculateRequestModule(api.showUrl)}.${_.toLower(api.methodType)}(\`${calculateRequestUrl(api.showUrl)}\`${hasBody?', '+bodyName:''})
}`.replace(/\n[\n]+/g, "\n")

        }

        function calculateFunctionName(url, params) {
            const actionHash = {
                get: 'get',
                post: 'create',
                add: 'create',
                create: 'create',
                save: 'save',

                update: 'update',

                delete: 'remove',
                batchDelete: 'batchDelete',
                del: 'remove',

                list: 'list',
                listAll: 'listAll'
            }
            const lastWithoutPathParams = _.last(url.split('/').filter(string => !/\{.*\}/.test(string)))
            const secondToLst = _.nth(url.split('/').filter(string => !/\{.*\}/.test(string)),-2)
            const action = actionHash[lastWithoutPathParams]
            let result = ''
            if (_.includes(action, 'list')) {
                result = `get${_.upperFirst(secondToLst)}${_.upperFirst(action)}`
            } else if (action) {
                result = action + _.upperFirst(secondToLst)
            } else {
                result = lastWithoutPathParams
            }

            const pathParams = _.filter(params, { in: 'path' })
            if(pathParams.length===1){
                result += 'By'+ _.upperFirst(pathParams[0].name)
            }
            return result
        }

        function calculateFunctionParam(params) {
            const result = []
            const pathParams = _.filter(params, { in: 'path' })
            const bodyParams = _.filter(params, { in: 'body' })

            pathParams.forEach(param => {
                result.push(param.name)
            })

            if (bodyParams.length) {
                if(bodyParams[0].type==='array'){
                    result.push(bodyParams[0].name +  ' = []')
                }else{
                    result.push('body = {}')
                }
            }

            return result.join(', ')
        }

        function calculateRequestModule(url) {
            const [value1,value2] = localStorage.getItem('moduleReplace').split(',,')
            return value2
        }

        function calculateRequestUrl(url) {
            const [value1,value2] = localStorage.getItem('moduleReplace').split(',,')
            url = url.replace(new RegExp(value1),'')
            return url.replaceAll('{', '${')
        }

        function calculateDocParams(params) {
            const result = []
            const pathParams = _.filter(params, { in: 'path' })
            const bodyParams = _.filter(params, { in: 'body' })

            pathParams.forEach(param => {
                result.push(`* @param {${paramsTypeConvert(param.type)}} ${param.name} ${param.description}`)
            })

            if (bodyParams.length) {
                if(bodyParams[0].type==='array'){
                    result.push(`* @param {Array} ${bodyParams[0].name}`)
                }else{
                    result.push('* @param {Object} body')
                }

            }

            return result.join('\n')
        }

        function paramsTypeConvert(type){
            const hash = {
                string: 'String',
                'integer(int64)': 'Number',
                'integer(int32)': 'Number',
            }
            if(hash[type]){
                return hash[type]
            }else{
                return type
            }
        }

    }
})();