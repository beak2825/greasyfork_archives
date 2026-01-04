// ==UserScript==
// @name         pin-sharding
// @name:zh      PIN Sharding 分库分布
// @namespace    https://www.diguage.com/monkeyell
// @version      1.0
// @description  PIN 分库分表插件，在 MyDB 页面输入PIN，显示分库分表结果，并且直接选中对应的数据库连接。公司内部辅助工具，非内部人员请勿下载。
// @author       diguage
// @homepage     https://www.diguage.com
// @match        mydb.jdfmgt.com
// @grant        unsafeWindow
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @note         2021-05-22 v1.0 初步实现分库分表结果展示以及自动选择数据库功能
// @downloadURL https://update.greasyfork.org/scripts/426869/pin-sharding.user.js
// @updateURL https://update.greasyfork.org/scripts/426869/pin-sharding.meta.js
// ==/UserScript==


(function () {
    'use strict';

    $(document).ready(function () {
        console.log('document ready, load script...');
        /**
         * 将js页面的number类型转换为java的int类型
         * @param num
         * @return intValue
         */
        function intValue(num) {
            var MAX_VALUE = 0x7fffffff;
            var MIN_VALUE = -0x80000000;
            if (num > MAX_VALUE || num < MIN_VALUE) {
                return num &= 0xFFFFFFFF;
            }
            return num;
        }

        const zeroPad = (num, places) => String(num).padStart(places, '0')

        function selectDb(dbNum) {
            console.log("selectDb=" + dbNum);
            console.log("selectDb=" + zeroPad(dbNum, 2));
            // 模拟点击加载数据库列表
            $("#ext-gen1153").click();
            $('#boundlist-1039-listEl > ul > li').each(function () {
                let ele = $(this);
                let text = ele.text();
                if (text.includes("mydb-bt-" + zeroPad(dbNum, 2) + "01")) {
                    ele.click();
                }
            });
        }

        function writeTableNum(tableNum) {
            console.log("writeTableNum=" + tableNum);
            console.log("writeTableNum=" + zeroPad(tableNum, 4));
            setTimeout(function () {
                $("#codeeditorfield-1048-bodyEl > div > div.CodeMirror-scroll > div.CodeMirror-sizer " +
                    "> div > div > div > div.CodeMirror-code > div > pre > span")
                    .text("  _" + zeroPad(tableNum, 4));
            }, 1000);
        }

        function compileDbIndex() {
            console.log("compileDbIndex");
            var pinText = $('#pinText').val();
            console.log("pin=" + pinText);
            let pinDbNumText = '';
            let prodShard = compileDbNum(pinText, 84, 150, false);
            selectDb(prodShard[1]);
            writeTableNum(prodShard[3]);
            prodShard[3] = "_" + zeroPad(prodShard[3], 4);
            pinDbNumText += '<span>生产：' + prodShard.join("&nbsp;&nbsp;&nbsp;") + '</span>';
            pinDbNumText += '  　　　<span>测试：' + compileDbNum(pinText, 2, 2, true).join("&nbsp;&nbsp;&nbsp;") + '</span>';
            let ele = $('#pinDbNumText');
            ele.text("");
            ele.append(pinDbNumText);
        }


        function hashCode(str) {
            console.log("hashCode(" + str + "0");
            let hashcode = 0;
            if (str !== '') {
                for (var i = 0; i < str.length; i++) {
                    hashcode = hashcode * 31 + str.charCodeAt(i);
                    hashcode = intValue(hashcode);
                }
            }
            console.log(str + ".hashCode=" + hashcode);
            return hashcode;
        }

        /**
         *转换dbNum
         */
        function compileDbNum(pin, dbNum, tableNum, hashCodeFlag) {
            console.log("pin=" + pin + ", dbNum=" + dbNum + ", tableNum=" + tableNum + ", hashCodeFlag=" + hashCodeFlag);
            var pinDbNumText = [];
            if (pin !== undefined) {
                let strHashCode = hashCode(Base64.encode(pin));
                strHashCode = Math.abs(strHashCode);
                if (hashCodeFlag) {
                    strHashCode = strHashCode % 1000;
                }
                let mode = dbNum * tableNum;
                let dbIndex = parseInt(strHashCode % mode / tableNum);
                let tableIndex = strHashCode % tableNum;

                pinDbNumText.push('db:', dbIndex, ' tableIndex:', tableIndex);
            }
            console.log(pinDbNumText.join(" "));
            return pinDbNumText;
        }

        /**
         * Base64转换
         * Base64.encode('xxxx')
         * Base64.decode('zzzz')
         */
        var Base64 = {
            // 转码表
            table: [
                'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
                'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
                'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
                'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
                'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
                'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
                'w', 'x', 'y', 'z', '0', '1', '2', '3',
                '4', '5', '6', '7', '8', '9', '+', '/'
            ],
            UTF16ToUTF8: function (str) {
                var res = [], len = str.length;
                for (var i = 0; i < len; i++) {
                    var code = str.charCodeAt(i);
                    if (code > 0x0000 && code <= 0x007F) {
                        // 单字节，这里并不考虑0x0000，因为它是空字节
                        // U+00000000 – U+0000007F 	0xxxxxxx
                        res.push(str.charAt(i));
                    } else if (code >= 0x0080 && code <= 0x07FF) {
                        // 双字节
                        // U+00000080 – U+000007FF 	110xxxxx 10xxxxxx
                        // 110xxxxx
                        var byte1 = 0xC0 | ((code >> 6) & 0x1F);
                        // 10xxxxxx
                        var byte2 = 0x80 | (code & 0x3F);
                        res.push(
                            String.fromCharCode(byte1),
                            String.fromCharCode(byte2)
                        );
                    } else if (code >= 0x0800 && code <= 0xFFFF) {
                        // 三字节
                        // U+00000800 – U+0000FFFF 	1110xxxx 10xxxxxx 10xxxxxx
                        // 1110xxxx
                        var byte1 = 0xE0 | ((code >> 12) & 0x0F);
                        // 10xxxxxx
                        var byte2 = 0x80 | ((code >> 6) & 0x3F);
                        // 10xxxxxx
                        var byte3 = 0x80 | (code & 0x3F);
                        res.push(
                            String.fromCharCode(byte1),
                            String.fromCharCode(byte2),
                            String.fromCharCode(byte3)
                        );
                    } else if (code >= 0x00010000 && code <= 0x001FFFFF) {
                        // 四字节
                        // U+00010000 – U+001FFFFF 	11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
                    } else if (code >= 0x00200000 && code <= 0x03FFFFFF) {
                        // 五字节
                        // U+00200000 – U+03FFFFFF 	111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
                    } else /** if (code >= 0x04000000 && code <= 0x7FFFFFFF)*/ {
                        // 六字节
                        // U+04000000 – U+7FFFFFFF 	1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
                    }
                }

                return res.join('');
            },
            UTF8ToUTF16: function (str) {
                var res = [], len = str.length;
                var i = 0;
                for (var i = 0; i < len; i++) {
                    var code = str.charCodeAt(i);
                    // 对第一个字节进行判断
                    if (((code >> 7) & 0xFF) == 0x0) {
                        // 单字节
                        // 0xxxxxxx
                        res.push(str.charAt(i));
                    } else if (((code >> 5) & 0xFF) == 0x6) {
                        // 双字节
                        // 110xxxxx 10xxxxxx
                        var code2 = str.charCodeAt(++i);
                        var byte1 = (code & 0x1F) << 6;
                        var byte2 = code2 & 0x3F;
                        var utf16 = byte1 | byte2;
                        res.push(Sting.fromCharCode(utf16));
                    } else if (((code >> 4) & 0xFF) == 0xE) {
                        // 三字节
                        // 1110xxxx 10xxxxxx 10xxxxxx
                        var code2 = str.charCodeAt(++i);
                        var code3 = str.charCodeAt(++i);
                        var byte1 = (code << 4) | ((code2 >> 2) & 0x0F);
                        var byte2 = ((code2 & 0x03) << 6) | (code3 & 0x3F);
                        var utf16 = ((byte1 & 0x00FF) << 8) | byte2
                        res.push(String.fromCharCode(utf16));
                    } else if (((code >> 3) & 0xFF) == 0x1E) {
                        // 四字节
                        // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
                    } else if (((code >> 2) & 0xFF) == 0x3E) {
                        // 五字节
                        // 111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
                    } else /** if (((code >> 1) & 0xFF) == 0x7E)*/ {
                        // 六字节
                        // 1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
                    }
                }

                return res.join('');
            },
            encode: function (str) {
                if (!str) {
                    return '';
                }
                var utf8 = this.UTF16ToUTF8(str); // 转成UTF8
                var i = 0; // 遍历索引
                var len = utf8.length;
                var res = [];
                while (i < len) {
                    var c1 = utf8.charCodeAt(i++) & 0xFF;
                    res.push(this.table[c1 >> 2]);
                    // 需要补2个=
                    if (i == len) {
                        res.push(this.table[(c1 & 0x3) << 4]);
                        res.push('==');
                        break;
                    }
                    var c2 = utf8.charCodeAt(i++);
                    // 需要补1个=
                    if (i == len) {
                        res.push(this.table[((c1 & 0x3) << 4) | ((c2 >> 4) & 0x0F)]);
                        res.push(this.table[(c2 & 0x0F) << 2]);
                        res.push('=');
                        break;
                    }
                    var c3 = utf8.charCodeAt(i++);
                    res.push(this.table[((c1 & 0x3) << 4) | ((c2 >> 4) & 0x0F)]);
                    res.push(this.table[((c2 & 0x0F) << 2) | ((c3 & 0xC0) >> 6)]);
                    res.push(this.table[c3 & 0x3F]);
                }

                return res.join('');
            },
            decode: function (str) {
                if (!str) {
                    return '';
                }

                var len = str.length;
                var i = 0;
                var res = [];

                while (i < len) {
                    let code1 = this.table.indexOf(str.charAt(i++));
                    let code2 = this.table.indexOf(str.charAt(i++));
                    let code3 = this.table.indexOf(str.charAt(i++));
                    let code4 = this.table.indexOf(str.charAt(i++));

                    let c1 = (code1 << 2) | (code2 >> 4);
                    let c2 = ((code2 & 0xF) << 4) | (code3 >> 2);
                    let c3 = ((code3 & 0x3) << 6) | code4;

                    res.push(String.fromCharCode(c1));

                    if (code3 != 64) {
                        res.push(String.fromCharCode(c2));
                    }
                    if (code4 != 64) {
                        res.push(String.fromCharCode(c3));
                    }
                }

                return this.UTF8ToUTF16(res.join(''));
            }
        };


        let btnEle = $('#tbfill-1033');
        btnEle.append('<span style="visibility:hidden;">11111111111111111111111111111111111111</span>' +
            '<span>PIN：&nbsp;<input type="text" placeholder="输入PIN，敲 Enter 键" id="pinText">&nbsp;&nbsp;<button id="pinBtn">计算库表</button></span>');

        let resultEle = $('#tbfill-1034');
        resultEle.append('<span id="pinDbNumText"></span>');

        setTimeout(function () {
            btnEle.css('top', '10px');
            resultEle.css('top', '10px');
        }, 1000);

        $('#pinBtn').click(function () {
            console.log("pinBtn click...");
            compileDbIndex();
        });

        $('#pinText').keypress(function (e) {
            if (e.which === 13) {
                console.log("input enter...");
                compileDbIndex();
            }
        });

        // 模拟点击加载数据库列表
        $("#ext-gen1153").click();

    });
    // Your code here...
})();