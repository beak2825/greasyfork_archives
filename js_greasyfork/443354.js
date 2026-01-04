// ==UserScript==
// @name         Swagger结构体格式化
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  try to take over the world!
// @author       You
// @include  /swagger
// @include  /case/swagger
// @include  /doc.html
// @icon         https://www.google.com/s2/favicons?domain=1.77
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443354/Swagger%E7%BB%93%E6%9E%84%E4%BD%93%E6%A0%BC%E5%BC%8F%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/443354/Swagger%E7%BB%93%E6%9E%84%E4%BD%93%E6%A0%BC%E5%BC%8F%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function UpperFirstCase(val){
        const firstStr = (val ?? '').slice(0,1);
        return (val ?? '').replace(firstStr,firstStr.toLocaleUpperCase());
    }
    function copy(text) {
        var input = document.createElement('textarea');
        input.value = text;
        document.body.appendChild(input);
        // input.setSelectionRange(0, 9999);
        input.select();
        var res = document.execCommand('copy');
        document.body.removeChild(input);
        return res;
    }
	  var BR = `\n`;
	 /** 根据符号拆分字符串并返回最后一个值 */
        function getLastKeyNameByStr(str, symbol) {
            if (typeof str !== 'string' || typeof symbol !== 'string') {
                return str;
            }
            const keySplitList = str.split(symbol);
            const lastKeyName = keySplitList[keySplitList.length - 1];
            return lastKeyName;
        }

        function toUpperCaseFirst(name) {
            return (name || '').charAt(0).toUpperCase() + (name || '').slice(1);
        }

        function br2n(str) {
            return str.replace(/<br\s*\/?>/g, '\n');
        }

        /** 转TS类型 */
        function convertToTsType(_type, T) {
            switch (_type) {
                case 'integer': {
                    return 'number';
                }
                case 'array': {
                    const value = T ? `${T}[]` : 'any[]';
                    return `${value}`;
                }
                default: {
                    if (_type) {
                        return _type;
                    }
                    return 'any';
                }
            }
        }

        function formatAxio(item,title) {
            item = item || {};
            console.log('===================>',item,title)
            const apiUrl = window.__SERVICE_NAME ? `\`\/api\/${window.__SERVICE_NAME}Service${item.url}\`` : `\`${item.url}\``;
            const description = title || ((item || {}).dtoData || {}).description || '';
            const urlArr = item?.url?.split?.('/')
            let _url = urlArr?.pop?.()?.replace?.('-','/');
            let deleteKey = '';
            if(_url.startsWith("{") && _url.endsWith("}")){
                deleteKey = _url.replace(/\{|\}/g,'');
                _url = `${UpperFirstCase(item.method)}${UpperFirstCase(urlArr?.pop?.()) ?? 'Api'}`;
            }

            let paramsStr = `${item.method === 'get' ? 'params' : 'data'}: any`;
            if(deleteKey){
                paramsStr = `${deleteKey}:string`;
            }


            return [
                ` /** ${description || '无描述'} */`,
                `async function ${_url}(${paramsStr}) {`,
                `const api = ${deleteKey ? apiUrl.replace('{','${') : apiUrl};`,
                `return HttpClient.fetch(api, {`,
                `method: '${item.method}',`,
                paramsStr ? '' : item.method === 'get' ? 'params' : 'data',
                `});`,
                `}`,
            ].join('\n');
        }

        function createDtoString(dtoName, dtoItem) {
            console.log('==============',dtoItem)
            const fields = dtoItem?.properties || {};
            const description = dtoItem.description || '';

            /** 取属性名 */
            const fieldList = Object.keys(fields);

            let dtoStr = '';

            // interface 注释
            dtoStr += `/** ${description || dtoName} */` + BR;

            // interface 定义
            dtoStr += `export interface I${dtoName} {` + BR;

            // 遍历生成属性
            fieldList.forEach((keyName, index) => {
                const item = fields[keyName];

                // 属性注释
                dtoStr += `/** ${item?.description || `${keyName}`} */` + BR;

                if (item?.type === 'array' && item?.items?.type) {
                    dtoStr += `${keyName}: ${convertToTsType(item?.items?.type)}[];` + BR;
                } else if (item?.type === 'array' && item?.items?.$ref) {

                    const k = getLastKeyNameByStr(item?.items?.$ref, '/');
                    const n = getLastKeyNameByStr(k, '.');

                    dtoStr += `${keyName}: ${convertToTsType(item?.type, n)};` + BR;
                } else {
                    dtoStr += `${keyName}: ${convertToTsType(item?.type)};` + BR;
                }

                // 末尾不换行
                if (index + 1 !== fieldList?.length) {
                    dtoStr += BR;
                }
            });

            dtoStr += `}`;

            return dtoStr;
        }

        function createDtoColumns(dtoName, dtoItem) {
            const fields = dtoItem?.properties || {};
            const description = dtoItem.description || '';

            /** 取属性名 */
            const fieldList = Object.keys(fields);

            let dtoStr = '';

            // interface 注释
            dtoStr += `/** ${description || dtoName} */` + BR;

            // interface 定义
            dtoStr += `const columns = [` + BR;

            // 遍历生成属性
            fieldList.forEach((keyName, index) => {
                const item = fields[keyName];

                if (item?.type === 'array' && (item?.items?.type || item?.items?.$ref)) {
                   // 233
                } else {
                   // 属性注释
                    dtoStr += `/** ${item?.description || `${keyName}`} */` + BR;
                    dtoStr += ['{',`title:tr('${item?.description || keyName}'),`,`dataKey:'${keyName}',`,`key:'${keyName}',`,'width:100,','},'].join(BR);
                }

                // 末尾不换行
                if (index + 1 !== fieldList?.length) {
                    dtoStr += BR;
                }
            });

            dtoStr += `]`;

            return dtoStr;
        }


    function getTpl(a) {

        a.forEach((x) => {
            var b = document.querySelector(`#${x.fullName} > .opblock-summary`);
            if (b) {
                b.style.cssText = 'position:relative';
                var btn = document.createElement('button');
                btn.innerHTML = 'dto';
				btn.title = '拷贝DTO';
                btn.style.cssText = 'position: absolute;top: 8px;right: 40px;';
                btn.onclick = (e) => {
                    var str = createDtoString(getLastKeyNameByStr(x.dto, '.'), x.dtoData);
                    copy(str);
                    e.stopPropagation();
                };
                b.appendChild(btn);

                var btn2 = document.createElement('button');
                btn2.innerHTML = 'link';
				btn2.title = '拷贝链接';
                btn2.style.cssText = 'position: absolute;top: 8px;right: 85px;';
                btn2.onclick = (e) => {
                    copy(x.url.includes('{') ? `\`${x.url.replace('{','${')}\`` : x.url);
                    e.stopPropagation();
                };
                b.appendChild(btn2);

                var btn3 = document.createElement('button');
                btn3.innerHTML = 'req';
				btn3.title = '拷贝请求';
                btn3.style.cssText = 'position: absolute;top: 8px;right: 131px;';
                btn3.onclick = (e) => {
                    var title = btn3.parentElement.querySelector('.opblock-summary-description').textContent
                    copy(formatAxio(x,title));
                    e.stopPropagation();
                };
                b.appendChild(btn3);
            }
        });
    }

    function formatData(paths, schemas) {
        const ddd = [];

        const formatDtoName = (v) => {
            return v.split('/schemas/')[1];
        };
        const formatApiClassName = (tag, method, url) => {
            return `operations-${tag}-${method}${url.replace(/\//g, '_').replace(/{/g, '_').replace(/}/g, '_').replace(/-/g, '_')}`;
        };
        Object.keys(paths).forEach((x) => {
            const item = paths[x];
            Object.keys(item).forEach((y) => {
                const yItem = item[y];
                let responseDtoName = '';
                if (y === 'get') {
                    responseDtoName = yItem.responses[200]?.content?.['application/json']?.schema?.$ref || '';
                } else {
                    responseDtoName = yItem.requestBody?.content?.['application/json']?.schema?.$ref || '';
                }
                // if (responseDtoName) {
                    const formatedName = formatDtoName(responseDtoName);
                    ddd.push({
                        url: x,
                        method: y,
                        dto: formatedName,
                        dtoData: schemas[formatedName],
                        fullName: formatApiClassName(yItem.tags[0], y, x),
                    });
                // }
            });
        });
        getTpl(ddd);
    }


	function insertStyle(){
		var style=".model-title__text{background:red;color:#fefefe;cursor:pointer;}";
		var ele=document.createElement("style");
		ele.innerHTML=style;
		document.getElementsByTagName('head')[0].appendChild(ele)
	}

	function createMenu() {
		 var menu = document.createElement('button');
		menu.innerHTML = 'Run';
		menu.style.cssText = 'position: fixed;bottom: 8px;right: 50px;';
		menu.onclick = (e) => {
             main();
            // if(window.__ACTIVE_DTO){
            //     var columnStr = createDtoColumns(getLastKeyNameByStr(window.__ACTIVE_DTO, '.'), __SCHEMAS[window.__ACTIVE_DTO]);
            //     copy(columnStr);
            //     e.stopPropagation();
            // } else {
            //     alert('请选择dto！');
            //     console.warn('请选择dto！');
            // }
		};
		document.querySelector('body').appendChild(menu);
	}

    function initFormatData(myJson){
     console.log('******请求成功******',myJson);
		window.__SCHEMAS = myJson.components.schemas;
		window.__SERVICE_NAME = myJson.servers?.[0]?.url ? myJson.servers?.[0]?.url?.split('/').pop() : '';
        formatData(myJson.paths, myJson.components.schemas);
		insertStyle();
		createMenu();
		document.querySelector('body').onclick = e => {
			if (e.target.className === 'model-title__text'){
				const dtoName = e.target.innerText;
				window.__ACTIVE_DTO = dtoName;
				var str = createDtoString(getLastKeyNameByStr(dtoName, '.'), __SCHEMAS[dtoName]);
				copy(str);
			}

            if ((e.path || []).filter(x => x.className && x.className.includes('opblock-tag')).length){
                setTimeout(() => {
              formatData(myJson.paths, myJson.components.schemas);
                },[300])

            }
            //e.stopPropagation();
		}
    }

    function main(){
        if(window.myJson){
             initFormatData(window.myJson)
        }else {
             fetch(`${location.pathname.replace('index.html', 'v1/swagger.json')}`, {
        headers: {
            Cookie: '.AspNetCore.Culture=c=zh-Hans|uic=zh-Hans',
        },
    })
        .then(function (response) {
        return response.json();
    })
        .then(function (myJson) {
                 window.myJson = myJson
       initFormatData(myJson)
    });
        }

    }

    setTimeout(() => {
    main()
    },1000)


    // Your code here...
})();