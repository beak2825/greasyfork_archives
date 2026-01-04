// ==UserScript==
// @name         Statement Parser
// @namespace    http://tampermonkey.net/
// @version      1.0.7
// @description  【使用前先看介绍/有问题可反馈】声明解析器 (Statement Parser)：通过语言，类型，变量名，以及赋值，直接生成可被解析的声明语句。
// @author       cc
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432416/Statement%20Parser.user.js
// @updateURL https://update.greasyfork.org/scripts/432416/Statement%20Parser.meta.js
// ==/UserScript==

(function() {
    const __VERSION__ = '1.0.7';
    class StatementParser {
        static get __VERSION__() {
            return __VERSION__;
        }
        static #conf = {
            'Java':  {
                lang: 'Java',
                baseType: ['boolean', 'byte', 'char', 'short', 'int', 'long', 'long', 'float', 'double', 'String'],
                extendType: [/^ListNode$/],
                useArray: true,
                arrayBrackets: '{}',
                squareBracketsPostPosition: false,
                usePointer: false,
                useGenerics: true,
                useNewForArray: true,
                useNewForObject: true,
                accessProperty: '.',
                nullValue: 'null',
                classStructSlice: [2, -1],
                commentChar: '*',
                singleLineCommentStartsWith: '//',
                endsWithSemicolon: true,
                typePostPosition: false,
                useTypeDeclare: true,
                useKeywordDeclare: false,
                declareKeyword: '',
                ignoreThisArg: false,
                useSplit: true,
                declareTemplate: /public\s+[\w<>\[\]]+\s+\w+\(\s*(.+?)\s*\)/,
                template: /^(.+)\s+(\w+)$/,
            },
            'C++': {
                lang: 'C++',
                baseType: ['void', 'bool', 'char', 'short', 'int', 'long', 'float', 'double', 'string'],
                extendType: [/^ListNode\s*\*$/, /^vector<(.+)>$/],
                useArray: false,
                arrayBrackets: '{}',
                squareBracketsPostPosition: true,
                usePointer: true,
                useGenerics: true,
                useNewForArray: true,
                useNewForObject: true,
                accessProperty: '->',
                nullValue: 'NULL',
                classStructSlice: [2, -1],
                commentChar: '*',
                singleLineCommentStartsWith: '//',
                endsWithSemicolon: true,
                typePostPosition: false,
                useTypeDeclare: true,
                useKeywordDeclare: false,
                declareKeyword: '',
                ignoreThisArg: false,
                useSplit: true,
                declareTemplate: /public:\s+[\w<>*]+\s*[&*]?\s*\w+\(\s*(.+?)\s*\)/,
                template: /^(.+?\s*?\*?)&?\s*(\w+)$/,
            },
            'Python3': {
                lang: 'Python3',
                baseType: ['bool', 'int', 'float', 'str'],
                extendType: [/^List\[(.+)]$/, /^ListNode$/],
                useArray: false,
                arrayBrackets: '[]',
                squareBracketsPostPosition: true,
                usePointer: false,
                useGenerics: true,
                useNewForArray: false,
                useNewForObject: false,
                accessProperty: '.',
                nullValue: 'None',
                classStructSlice: [1, 0],
                commentChar: '#',
                singleLineCommentStartsWith: '#',
                endsWithSemicolon: false,
                typePostPosition: true,
                useTypeDeclare: false,
                useKeywordDeclare: false,
                declareKeyword: '',
                ignoreThisArg: true,
                useSplit: true,
                declareTemplate: /Solution:\s+def\s+\w+\((.+?)\)/,
                template: /^(.+?\s*?\*?)&?\s*(\w+)$/,
            },
            'JavaScript': {
                lang: 'JavaScript',
                baseType: ['boolean', 'character', 'number', 'string'],
                extendType: [/^ListNode$/],
                useArray: true,
                arrayBrackets: '[]',
                squareBracketsPostPosition: false,
                usePointer: false,
                useGenerics: false,
                useNewForArray: false,
                useNewForObject: true,
                accessProperty: '.',
                nullValue: 'null',
                classStructSlice: [2, -1],
                commentChar: '*',
                singleLineCommentStartsWith: '//',
                endsWithSemicolon: true,
                typePostPosition: false,
                useTypeDeclare: false,
                useKeywordDeclare: true,
                declareKeyword: 'let',
                ignoreThisArg: false,
                useSplit: false,
                declareTemplate: /\/\*\*(.+?@param.+?)\*\//,
                template: /@param\s+{(.+?)}\s+(\w+)/,
            },
        };
        #support;
        #config;

        /**
         * 通过语言类型指定语句解析器
         * @param lang {string} 编程语言
         */
        constructor(lang) {
            if (lang in StatementParser.#conf) {
                this.#support = true;
                this.#config = StatementParser.#conf[lang];
            } else {
                this.#support = false;
            }
        }

        /**
         * 通过代码和输入直接获得对应声明语句
         * @param declares {array[array[string]]} 声明类型及变量名的数组
         * @param expressions {array[string]} 声明表达式数组
         */
        getStatementsFromDeclaresAndExpressions(declares, expressions) {
            let statementCount = declares.length;
            let statements = [];
            for (let i = 0; i < statementCount; ++i) {
                let value = this.parseExpression(expressions[i]);
                let [type, name] = declares[i];
                statements.push(this.getStatement(type, name, value));
            }
            return statements.join('\n');
        }

        /**
         * 从代码中获取参数声明
         * @param code {string} 代码字符串
         * @return {array[string]} 变量声明数组，每个元素为 [类型, 变量名]
         */
        getDeclaresFromCode(code) {
            code = code.replace(/\n/g, '');
            let pattern = this.#config.declareTemplate;
            let template = this.#config.template;
            let rawDeclares = code.match(pattern)[1];
            let declares;
            if (this.#config.useSplit) {
                declares = rawDeclares.replace(/\s+([&*])\s*/g, '$1 ').split(/\s*,\s*/);
            } else {
                declares = rawDeclares.match(new RegExp(template, 'g'));
            }
            if (this.#config.ignoreThisArg)
                declares = declares.slice(1);
            if (this.#config.useSplit) {
                declares = declares.map(pair => pair.split(/:?\s+/));
            } else {
                declares = declares.map(pair => {
                    pair = pair.match(template);
                    return [pair[1], pair[2]];
                });
            }
            if (this.#config.typePostPosition)
                declares = declares.map(pair => [pair[1], pair[0]]);
            declares.forEach(pair => {
                pair[0] = pair[0].replace(/&$/, '');
            });
            return declares;
        }

        /**
         * 通过类型，变量名，以及字面值，生成赋值表达式
         * @param type {string} 类型
         * @param name {string} 变量名
         * @param value {string} 字面值
         * @return {string} 可被解析的赋值表达式
         */
        getStatement(type, name, value) {
            let strOfDeclare = this.#config.useTypeDeclare ? `${type} ` : (this.#config.useKeywordDeclare ? `${this.#config.declareKeyword} ` : '');
            let strOfEnd = this.#config.endsWithSemicolon ? ';' : '';
            let [belongsBaseType, baseType, dimension] = this.resolveType(type);
            if (belongsBaseType) {
                value = this.parseValue(baseType, value, dimension)[0];
                return `${strOfDeclare}${name} = ${value}${strOfEnd}`;
            } else {
                let pattern = this.#findExtendType(type);
                if (pattern && pattern.toString().includes('ListNode')) {
                    let array = value.match(/\d+/g).map(e => parseInt(e));
                    return this.#makeListNode(name, array);
                } else if (pattern && pattern.toString().includes('vector')) {
                    let elementType = type.match(pattern)[1];
                    return this.#makeVector(name, elementType, value);
                } else if (pattern && pattern.toString().match(/List\\\[.+]/)) {
                    let elementType = type.match(pattern)[1];
                    return this.#makeList(name, elementType, value);
                }
            }
            return `${strOfDeclare}${name} = ${this.#config.nullValue}${strOfEnd} ${this.#config.singleLineCommentStartsWith} cannot resolve this type`;
        }

        /**
         * 从代码中获取注释结构类声明代码
         * @param code {string} 代码字符串
         * @return {string|null} 结构类声明代码，不存在则返回 null
         */
        getClassStructFromCode(code) {
            let commentChar = this.#config.commentChar;
            let [start, end] = this.#config.classStructSlice;
            let prefixPattern = new RegExp(`^\\s*${commentChar === '*' ?  '\\*' : commentChar}\\s`);
            if (commentChar === '*') {
                let [matchLeft, matchRight] = [code.match(/\/\*/), code.match(/\*\//)];
                if (!matchLeft || !matchRight)
                    return null;
                let [commentStart, commentEnd] = [matchLeft.index, matchRight.index + 2];
                let structComment = code.slice(commentStart, commentEnd).split('\n');
                structComment = structComment.slice(start, structComment.length + end);
                return structComment.map(line => line.replace(prefixPattern, '')).join('\n');
            } else if (commentChar === '#') {
                let leftIndex = /#/m.exec(code).index;
                let rightIndex = /\n[^#]/m.exec(code).index + 1;
                let structComment = code.slice(leftIndex, rightIndex).split('\n');
                structComment = structComment.slice(start, structComment.length + end);
                return structComment.map(line => line.replace(prefixPattern, '')).join('\n').trim();
            }
        }

        /**
         * 解析赋值表达式中的被赋予的字面值，无回车无前后空格无末尾逗号
         * @param expression 表达式，形式为 "name = value"
         * @return {string} 表达式中被赋予的字面值
         */
        parseExpression(expression) {
            let value;
            expression = expression.trim().replace(/,$/, '');
            if (expression.includes('=')) {
                value = expression.split(/\s*=\s*/)[1];
            } else {
                value = expression;
            }
            value = value.replace(/\n/g, '');
            return value;
        }

        /**
         * 分析被赋予的字面值
         * @param baseType {string} 基本类型
         * @param value {string} 被赋予的字面值
         * @param dimension {number} 类型维度
         * @return {array[string]} 处理后的可解析的可被赋予的值
         */
        parseValue(baseType, value, dimension) {
            let brackets = this.#config.arrayBrackets.split('');
            let extractElementsPattern = /^\[\s*(.*?)\s*]$/;
            let extractStringsPattern = /(".*?")/g;
            if (dimension === 0) {
                if (baseType === 'char' || baseType === 'character') {
                    if (value.match(/"."/)) {
                        value = value.replace(/"/g, '\'');
                    } else if (value.match(/^.$/)) {
                        value = `'${value}'`;
                    }
                }
                return [value, value];
            } else if (dimension === 1) {
                if (baseType.toLowerCase() === 'string' || baseType === 'str') {
                    let elements = value.match(extractStringsPattern);
                    elements = elements || [];
                    let elementsStr = elements.join(', ');
                    value = `${brackets[0]}${elementsStr}${brackets[1]}`;
                    return [value, elements];
                } else {
                    let rawElementsStr = value.match(extractElementsPattern)[1];
                    let elements = rawElementsStr.split(/\s*,\s*/);
                    elements = rawElementsStr ? elements : [];
                    let elementsStr = elements.join(', ');
                    if (baseType === 'char' || baseType === 'character')
                        elementsStr = elementsStr.replace(/"/g, '\'');
                    value = `${brackets[0]}${elementsStr}${brackets[1]}`;
                    return [value, elements];
                }
            } else if (dimension === 2) {
                if (baseType.toLowerCase() === 'string' || baseType === 'str') {
                    let strMatrix = StatementParser.#parseStringMatrix(value, '[]');
                    value = `${brackets[0]}\n\t${strMatrix.map(strArray => {
                        return `${brackets[0]}${strArray.join(', ')}${brackets[1]}`;
                    }).join(',\n\t')}\n${brackets[1]}`;
                    return [value, strMatrix];
                } else {
                    let arraysStr = value.match(extractElementsPattern)[1];
                    if (!arraysStr)
                        return [brackets.join(''), []];
                    let arraysStrFmt = arraysStr.replace(/\s+/g, '').replace(/(],)/g, '$1 ');
                    let arrayStrs = arraysStrFmt.split(/,\s+/);
                    let arrayStrFmts = arrayStrs.map(arrayStr => {
                        let elementsStr = arrayStr.match(extractElementsPattern)[1];
                        if (baseType === 'char')
                            elementsStr = elementsStr.replace(/"/g, '\'');
                        return `${brackets[0]}${elementsStr.replace(/,/g, ', ')}${brackets[1]}`;
                    });
                    let realValue = arrayStrs.map(arrayStr => {
                        let elementsStr = arrayStr.match(extractElementsPattern)[1];
                        return elementsStr.split(',');
                    });
                    value = `${brackets[0]}\n\t${arrayStrFmts.join(',\n\t')}\n${brackets[1]}`;
                    return [value, realValue];
                }
            }
            return [value, value];
        }

        /**
         * 解析类型，检查是否属于基础类型，以及分析类型的维度
         * @param type {string} 类型
         * @return {[boolean, string, number]} 是否属于基本类型，解析后的基本类型，类型维度
         */
        resolveType(type) {
            let dimension = 0;
            if (type.endsWith('[][]')) {
                type = type.slice(0, type.length - 4);
                dimension = 2;
            } else if (type.endsWith('[]')) {
                type = type.slice(0, type.length - 2);
                dimension = 1;
            }
            let isBaseType = !!this.#findBaseType(type);
            return [isBaseType, type, dimension];
        }

        /**
         * 判断类型是否在基本类型中，并返回匹配到的基本类型，匹配失败返回 null
         * @param type {string} 类型
         * @return {string|null} 匹配到的基本类型，或 null
         */
        #findBaseType(type) {
            let index = this.#config.baseType.indexOf(type);
            if (index < 0)
                return null;
            return this.#config.baseType[index];
        }

        /**
         * 判断类型是否在扩展类型中，并返回匹配到的扩展类型，匹配失败返回 null
         * @param type {string} 类型
         * @return {RegExp|null} 匹配到的扩展类型，或 null
         */
        #findExtendType(type) {
            for (let pattern of this.#config.extendType)
                if (type.match(pattern))
                    return pattern;
            return null;
        }

        /**
         * 通过链表元素生成链表声明语句
         * @param name {string} 变量名
         * @param array {array[number]} 链表的所有元素
         * @return {string} 链表声明语句集合的字符串
         */
        #makeListNode(name, array) {
            let strOfPtr = this.#config.usePointer ? '*' : '';
            let strOfDeclare = this.#config.useTypeDeclare ? `ListNode${strOfPtr} ` : (this.#config.useKeywordDeclare ? `${this.#config.declareKeyword} ` : '');
            let strOfNew = this.#config.useNewForObject ? 'new ' : '';
            let strOfNullValue = this.#config.nullValue;
            let strOfNext = this.#config.accessProperty;
            let strOfEnd = this.#config.endsWithSemicolon ? ';' : '';
            if (array.length === 0)
                return `${strOfDeclare}${name} = ${strOfNullValue}${strOfEnd}`;
            let statementList = [`${strOfDeclare}${name} = ${strOfNew}ListNode(${array[0]})${strOfEnd}`];
            if (array.length === 1)
                return statementList[0];
            statementList.push(`${strOfDeclare}${name}Next = ${name}${strOfEnd}`);
            for (let i = 1; i < array.length; ++i) {
                statementList.push(`${name}Next${strOfNext}next = ${strOfNew}ListNode(${array[i]})${strOfEnd}`);
                if (i + 1 < array.length)
                    statementList.push(`${name}Next = ${name}Next${strOfNext}next${strOfEnd}`);
            }
            return statementList.join('\n');
        }

        /**
         * 通过变量名，元素类型，以及字面值生成 vector 的赋值表达式
         * @param name {string} vector 变量名
         * @param elementType {string} 元素类型
         * @param value {string} 已处理的被赋值字面值
         * @return {string} 可被解析的赋值表达式
         */
        #makeVector(name, elementType, value) {
            if (this.#findBaseType(elementType)) {
                // vector<baseType>
                let formatValue = this.parseValue(elementType, value, 1)[0];
                return `vector<${elementType}> ${name} ${formatValue};`;
            } else {
                // vector<...>
                let pattern = this.#findExtendType(elementType);
                if (pattern && pattern.toString().includes('vector')) {
                    // vector<vector<...>>
                    let baseType = elementType.match(pattern)[1];
                    if (this.#findBaseType(baseType)) {
                        // vector<vector<baseType>>
                        let matrix = this.parseValue(baseType, value, 2)[1];
                        let [row, col] = [matrix.length, matrix[0].length];
                        let statements = [
                            `vector<vector<${baseType}>> ${name};`,
                            `${baseType} ${name}Matrix[${row}][${col}] = {`
                        ];
                        for (let i = 0; i < row; ++i) {
                            let rowInitValues = `{${matrix[i].join(', ')}}`;
                            if (i + 1 < row)
                                rowInitValues += ',';
                            statements.push(rowInitValues);
                        }
                        statements.push(`};`);
                        statements.push(`for (int ${name}RowIndex = 0; ${name}RowIndex < ${row}; ++${name}RowIndex) {`);
                        statements.push(`\tvector<${baseType}> ${name}Row(begin(${name}Matrix[${name}RowIndex]), end(${name}Matrix[${name}RowIndex]));`);
                        statements.push(`\t${name}.push_back(${name}Row);`);
                        statements.push(`};`);
                        return statements.join('\n');
                    }
                }
            }
            return `vector<${elementType}> ${name}; // cannot resolve this type`;
        }

        /**
         * 通过变量名，元素类型，以及字面值生成 List 的赋值表达式
         * @param name {string} vector 变量名
         * @param elementType {string} 元素类型
         * @param value {string} 已处理的被赋值字面值
         * @return {string} 可被解析的赋值表达式
         */
        #makeList(name, elementType, value) {
            if (this.#findBaseType(elementType)) {
                // List[baseType]
                let formatValue = this.parseValue(elementType, value, 1)[0];
                return `${name} = ${formatValue}`;
            } else {
                // List[...]
                let pattern = this.#findExtendType(elementType);
                if (pattern && pattern.toString().match(/List\\\[.+]/)) {
                    // List[List[...]]
                    let baseType = elementType.match(pattern)[1];
                    if (this.#findBaseType(baseType)) {
                        // List[List[baseType]]
                        let formatValue = this.parseValue(baseType, value, 2)[0];
                        return `${name} = ${formatValue}`;
                    }
                }
            }
            return `${name} = None # cannot resolve this type`;
        }

        /**
         * 搜索字符串中首个
         * @param str {string} 需要搜索的字符串
         * @param brackets {string} 括号类型
         * @param start {number} 开始搜索的索引
         * @return {array[number]} 返回搜索到的首对最外层括号的索引
         */
        static #findBrackets(str, brackets, start) {
            let stack = [], left = start, length = str.length;
            let [l, r] = brackets.split('');
            while (left < length && str[left] !== l)
                ++left;
            if (left >= length)
                return [-1, -1];
            let right = left;
            while (right < length) {
                let c = str[right];
                let peekElement = stack[stack.length - 1];
                if (c === l) {
                    if (peekElement === '"') {
                        ++right;
                        continue;
                    } else {
                        stack.push(c);
                    }
                } else if (c === '"') {
                    if (peekElement === '"') {
                        stack.pop();
                    } else {
                        stack.push(c);
                    }
                } else if (c === r) {
                    if (peekElement === '"') {
                        ++right;
                        continue;
                    } else if (peekElement === l) {
                        stack.pop();
                        if (stack.length === 0)
                            return [left, right];
                    }
                }
                ++right;
            }
            return [-1, -1];
        }

        /**
         * 解析二维字符串数组字面值为真实二维数组
         * @param value {string} 二维字符串数组字面值
         * @param brackets {string} 括号类型
         * @return {array[array[string]]} 二维字符串数组
         */
        static #parseStringMatrix(value, brackets) {
            let extractElementsPattern = new RegExp(`^\\${brackets[0]}\\s*(.+?)\\s*${brackets[1]}$`);
            let extractStringsPattern = /(".*?")/g;
            let rawArraysStr = value.match(extractElementsPattern)[1];
            let index = 0, strMatrix = [];
            let [left, right] = StatementParser.#findBrackets(rawArraysStr, brackets, index);
            while (left >= 0 && right >= 0) {
                let arrayStr = rawArraysStr.slice(left, right + 1);
                let strArray = arrayStr.match(extractStringsPattern);
                strMatrix.push(strArray);
                index = right + 1;
                [left, right] = StatementParser.#findBrackets(rawArraysStr, brackets, index);
            }
            return strMatrix;
        }
    }
    window.StatementParser = StatementParser;
})();