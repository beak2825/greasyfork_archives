// ==UserScript==
// @name         微信支付宝文档解析
// @namespace    http://evalor.cn
// @version      0.1
// @description  获取微信支付宝中的参数快速生成对应的PHP结构体
// @author       eValor
// @match      https://docs.open.alipay.com/*
// @match      https://pay.weixin.qq.com/wiki/doc/api/*
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390548/%E5%BE%AE%E4%BF%A1%E6%94%AF%E4%BB%98%E5%AE%9D%E6%96%87%E6%A1%A3%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/390548/%E5%BE%AE%E4%BF%A1%E6%94%AF%E4%BB%98%E5%AE%9D%E6%96%87%E6%A1%A3%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function () {
    'use strict';
    $(function () {

        // 当前是微信文档
        if (window.location.host === 'pay.weixin.qq.com') {

            // 读页面的表格
            $('table').each(function (index, table) {
                table = $(table);

                // 当前区块名称和第一列的标题
                var blockName = table.parent('.table-wrp').parent('.data-bd').prev().text().trim();
                var firstColumnName = $(table.find('tr>th').get(0)).text().trim();

                console.warn('正在处理' + blockName + firstColumnName);

                var children = $(table).find('tr');
                var template = '';
                children.each(function (index, childrenTr) {
                    var childrenTds = $(childrenTr).find('td');
                    if (childrenTds.length > 0) {
                        var paramName = $(childrenTds.get(0)).text().trim();
                        var paramVarName = $(childrenTds.get(1)).text().trim();
                        template += 'protected $' + paramVarName + '; // ' + paramName + "\n";
                    }
                });

                // 在表格上插入一个框框用来存放代码
                template = hljs.highlight('php', template);
                $(table).parent().prepend('<pre style="padding: 20px;background: rgba(0,0,0,.1);border-radius: 5px;">' + template.value + '</pre>');
                return false;
            });

        } else if (window.location.host === 'docs.open.alipay.com') {

            var commonReqParamsTable = $('#common-req-params');
            var reqParamsTable = $('[data-view="params"]:eq(0)');
            var apiCommonResponseParamsTable = $('#api-common-response-params');
            var respParamsTable = $('[data-view="params"]:eq(1)');

            // 页面上主要的四个表格
            var pageTables = {
                commonReqParams             : {
                    tableElem : commonReqParamsTable,
                    isExist   : commonReqParamsTable.length === 1,
                    definition: {}
                },
                reqParamsTable              : {
                    tableElem : reqParamsTable,
                    isExist   : reqParamsTable.length === 1,
                    definition: {}
                },
                apiCommonResponseParamsTable: {
                    tableElem : apiCommonResponseParamsTable,
                    isExist   : apiCommonResponseParamsTable.length === 1,
                    definition: {}
                },
                respParamsTable             : {
                    tableElem : respParamsTable,
                    isExist   : respParamsTable.length === 1,
                    definition: {}
                }
            };

            // 页面的四个主要元素内容
            Object.keys(pageTables).forEach(function (objName) {
                var paramObj = pageTables[objName];
                if (paramObj.isExist) {  // 表格存在时才有意义
                    $(paramObj.tableElem).find('tr[data-depth!="2"]').each(function (index, paramTr) {
                        var trElem = $(paramTr);
                        var paramName = trElem.find('td:eq(0)').text().trim();
                        var paramType = trElem.find('td:eq(1)').text().trim();
                        var paramRequired = trElem.find('td:eq(2)').text().trim() === '是';
                        var paramMaxLength = Number(trElem.find('td:eq(3)').text().trim());
                        var paramComment = trElem.find('td:eq(4)').text().trim();
                        var paramSampleValue = trElem.find('td:eq(5)').text().trim();

                        if (paramName === '') {
                            return;
                        }

                        pageTables[objName].definition[paramName] = {
                            paramName       : paramName,
                            paramType       : paramType,
                            paramRequired   : paramRequired,
                            paramMaxLength  : paramMaxLength,
                            paramComment    : paramComment,
                            paramSampleValue: paramSampleValue
                        }
                    })
                }
            });

            // 接口名称转到驼峰命名
            var commonReqParamDef = pageTables.commonReqParams.definition;
            var apiMethodName = commonReqParamDef.method ? commonReqParamDef.method.paramSampleValue : 'unknown.api.name';
            var camelApiMethodName = apiMethodName.trim().split('').reduce(function (previousValue, currentValue) {
                if (previousValue.charAt(previousValue.length - 1) === '.') { // 上次迭代末尾是点 则删去末尾 本次返回的值变大写
                    previousValue = previousValue.substr(0, previousValue.length - 1);
                    currentValue = currentValue.toUpperCase();
                }
                return previousValue + currentValue;
            });
            camelApiMethodName = camelApiMethodName.charAt(0).toUpperCase() + camelApiMethodName.slice(1);

            // 对四个表格进行构建
            Object.keys(pageTables).forEach(function (objName) {
                var objValue = pageTables[objName];
                if (Object.keys(objValue.definition).length > 0) {
                    var paramTemplate = '    // @apiName: ' + apiMethodName + '\n';
                    paramTemplate += '    // @see    : ' + window.location.href + '\n\n';
                    // commit 整体对齐
                    var maxNameLen = 0;
                    $.each(objValue.definition, function (index, value) {
                        if (value.paramName.trim().length > maxNameLen) {
                            maxNameLen = value.paramName.trim().length;
                        }
                    });
                    $.each(objValue.definition, function (index, value) {
                        var prepareComment =
                            "/**\n* " + value.paramComment.trim().replace("\n", "")
                            + '\n* @isRequired ' + String(value.paramRequired)
                            + '\n* @var ' + value.paramType.trim() + ' maxLength ' + value.paramMaxLength
                            + '\n* @example  ' + value.paramSampleValue.trim()
                            + '\n*/';
                        // var prepareProtected = '\n protected $' + value.paramName.trim() + ';\n';
                        // paramTemplate += prepareComment + prepareProtected + "\n";
                        var prepareProtected = 'protected $' + value.paramName.trim() + '; ' + " ".repeat(maxNameLen - value.paramName.trim().length + 1) + '// ' + value.paramComment.trim().replace(/\s/g, "");
                        paramTemplate += prepareProtected + "\n";
                    });
                    paramTemplate = hljs.highlight('php', paramTemplate);
                    objValue.tableElem.before('<pre>' + paramTemplate.value + '</pre>');
                }
            });

            // 放在头部的注释文档
            var template = '// Automatic Generation By TamperMonkey Plugins\n';
            template += '// Api Method Name: ' + apiMethodName + "\n\n";
            template += 'class ' + camelApiMethodName + ' {}\n';
            template += 'class ' + camelApiMethodName + 'Request {}\n';
            template += 'class ' + camelApiMethodName + 'Response {}\n';
            template = hljs.highlight('php', template);
            $('.main-container > .markdown').prepend('<pre>' + template.value + '</pre>');
        }
    })
})();