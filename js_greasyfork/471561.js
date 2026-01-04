; (function () {
    window.sinHelper = {
        Cache: {

        },
        /* 网络拦截相关 */
        Xhr: {
            inited: false,
            init: function () {
                if (this.inited === true) return;
                let oldSend = XMLHttpRequest.prototype.send, _this = this;
                XMLHttpRequest.prototype.send = function () {
                    let xhr = this
                    this.addEventListener("load", function () {
                        if (xhr.readyState != 4 || xhr.status != 200) return;
                        if (xhr.responseType != '' && xhr.responseType != 'text') return;
                        xhr.requestData = arguments
                        xhr.responseHeders = xhr.getAllResponseHeaders()
                        xhr.responseData = function () {
                            try {
                                return JSON.parse(xhr.responseText)
                            } catch (e) {
                                return xhr.responseText
                            }
                        }();
                        _this.dispatchFetch(xhr)
                    })
                    oldSend.apply(this, arguments);
                }
                this.inited = true;
            },
            rules: {}, // pathname => function 
            routes: [], // functions
            registRules: function (ruleName, ruleFunc) {
                if (typeof (ruleFunc) != 'function') {
                    console.error("Xhr Rules 必须是可调用的函数", ruleName)
                    return
                }
                this.rules[ruleName] = ruleFunc
            },
            /* 调用注册的 pathname 处理函数 */
            dispatchFetch: function (xhr) {
                let _this = this
                const url = new URL(xhr.responseURL)
                if (_this.rules[url.pathname]) {
                    if (typeof (this.rules[url.pathname]) == 'function') {
                        this.rules[url.pathname](xhr)
                    } else {
                        console.error("Xhr 处理函数错误：", url.pathname)
                    }
                } else {
                    _this.routes.forEach((route) => {
                        if (typeof (route) == 'function') {
                            route(xhr)
                        }
                    })
                }
            }
        },
        Url: {
            info: function (_url) {
                let urlInfo = new URL(_url)

                urlInfo['getParams'] = function (_key) {
                    let _obj = Object.fromEntries(urlInfo.searchParams.entries())
                    if (_key) return _obj[_key] || null
                    return _obj
                }

                return urlInfo
            },
            getParams: function (_url, _key) {
                let urlStr = _url.split('?')[1]
                let urlSearchParams = new URLSearchParams(urlStr)
                let result = Object.fromEntries(urlSearchParams.entries())
                if (_key) return result[_key] || null
                return result
            }
        },
        /* 原生JS 下载Excel */
        Excel: {
            'trans2Base64': function (content) {
                return window.btoa(unescape(encodeURIComponent(content)));
            },
            'exportExcelFromFront': function (params) {
                let _this = this
                const { cellList, headerList, caption, exportName = 'exportName' } = params;

                const captionEle = caption ? `<caption>${caption}</caption>` : ''; // 表格标题
                const headerEle = `<tr>${headerList?.map((item) => `<th>${item}</th>`)?.join('')}</tr>`;
                const cellEle = cellList
                    ?.map((itemRow) => `<tr>${itemRow?.map((itemCell) => `<td>${itemCell}</td>`)?.join('')}</tr>`)
                    ?.join('');

                const excelContent = `${captionEle}${headerEle}${cellEle}`;
                let worksheet = '工作表1';
                let excelFile =
                    "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
                excelFile +=
                    `<head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>${worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>`;
                excelFile += "<body><table width='10%'  border='1'>";
                excelFile += excelContent;
                excelFile += '</table></body>';
                excelFile += '</html>';
                const link = `data:application/vnd.ms-excel;base64,${_this.trans2Base64(excelFile)}`;
                const a = document.createElement('a');
                a.download = `${exportName}.xlsx`;
                a.href = link;
                a.click();
            }
        },
        /* 数学函数 */
        Math: {
            round: function (_number, _precision) {
                if (!_precision) _precision = 0
                _precision = _precision * 1
                let _power = 10 ** _precision
                return Math.round(_number * _power) / _power
            }
        },
        Str: {
            decodeBase64Safe: function (_encoded) {
                _encoded = _encoded.replace(/-/g, '+').replace(/_/g, '/');
                while (_encoded.length % 4) {
                    _encoded += '=';
                }
                return atob(_encoded);
            }
        },
        Time: {
            /**
             * 格式化时间戳
             * @param {string|Date|number} [value='']
             * @param {string} [fmt='yyyy-MM-dd hh:mm:ss']
             * @returns {string}
             */
            format: function (value, fmt) {
                let date = value
                if (typeof value !== 'object' && !value.hasOwnProperty('getFullYear')) {
                    date = new Date(), value = value + ''
                    if (value.length === 10) date = new Date(value * 1000)
                    if (value.length === 13) date = new Date(value * 1)
                }

                if (!fmt) fmt = 'yyyy-MM-dd hh:mm:ss'
                let o = {
                    "M+": date.getMonth() + 1,
                    "d+": date.getDate(),
                    "h+": date.getHours(),
                    "m+": date.getMinutes(),
                    "s+": date.getSeconds(),
                    "q+": Math.floor((date.getMonth() + 3) / 3),
                    "S": date.getMilliseconds()
                };
                if (/(y+)/.test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
                }
                for (let k in o) {
                    if (new RegExp("(" + k + ")").test(fmt)) {
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                    }
                }
                return fmt;
            },
            /**
             * 秒数 转 时分秒
             */
            convert: function (seconds) {
                let d = 0, h = 0, m = 0, s = 0, res = ''

                if (seconds >= 86400) d = parseInt(seconds / 60 / 60 / 24)
                if (seconds >= 3600) h = parseInt(seconds / 60 / 60 % 24)
                if (seconds >= 60) m = parseInt(seconds / 60 % 60)
                s = parseInt(seconds % 60)

                if (d > 0) res += d + '天'
                if (h > 0) res += (h < 10 ? '0' + h : h) + '小时'
                if (m > 0) res += (m < 10 ? '0' + m : m) + '分'
                if (s > 0) res += (s < 10 ? '0' + s : s) + '秒'
                return res
            }
        }
    };
})();