// ==UserScript==
// @name         AmazonAdChangePrice.JP
// @namespace    ༺黑白༻
// @version      1.8
// @description  亚马逊(日本站)广告自动定时调价脚本
// @author       Paul
// @match        https://sellercentral-japan.amazon.com/cm/sp/campaigns/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/layer/2.3/layer.js
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/381168/AmazonAdChangePriceJP.user.js
// @updateURL https://update.greasyfork.org/scripts/381168/AmazonAdChangePriceJP.meta.js
// ==/UserScript==

(function () {
    'use strict';
    ({
        /**
         * 获取提交参数
         * @param {any} price
         */
        getSubmitParams: function (price) {
            return JSON.stringify([{ defaultBid: { millicents: price * 100000, currencyCode: 'JPY' }, id: document.querySelector('[data-e2e-id=entityNameRenderer]').getAttribute('id'), programType: 'SP' }]);
        },
        maxWaitForTimes: 30,
        $output: null,
        createCss: function () {
            $(document.head).append('<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/layer/2.3/skin/layer.css"/>');
            GM_addStyle('');
            GM_addStyle('.cfg_form{ width:565px;max-height:200px;min-height:100px;overflow-y:auto;margin-top:5px;padding:10px;}\
                        .cfg_form .cfg_row{ width:555px;    margin-bottom: 10px; }\
                        .cfg_form .cfg_row .cfg_inputArea{ width:500px;border-bottom: 1px solid #ccc;display:inline-block; }\
                        .cfg_form .cfg_row .cfg_rowbtn{ width:20px;height:20px;display:inline-block;border:1px solid #ccc;border-radius:50%;     text-align: center;cursor: pointer;margin-left: 5px;    vertical-align: middle;line-height: 20px;}\
                        .cfg_row .cfg_col_l{ width:60%; display: inline-block; }\
                        .cfg_row .cfg_col_r{ width:40%; display: inline-block; }\
                        .cfg_row .label{ width:20%;display: inline-block; }\
                        .cfg_row .value{ width:80%;display: inline-block; }\
                        .value input{ line-height: 20px;outline: none;width: 100%; height: 20px;padding:0;border: none;}\
                        .output{ height:500px;margin:15px; }\
                        .output>li{ list-style:line-height: 26px;margin-left: 20px;overflow: visible;list-style-type: disc; }\
                        ');
            return this;
        },
        createWin: function () {
            layer.open({
                type: 1,
                area: ['610px', 'auto'],
                title: '脚本定制可联系：1292956082@qq.com',
                content: '<div style="margin: 20px;font-size:13px;">\
                            <form class="cfg_form" id="cfgForm">\
                                <div class="cfg_row"><div class="cfg_inputArea"><div class="cfg_col_l"><span class="label">时间：</span><span class="value"><input type="text" name="time" placeholder="执行时间（24小时制）,如：16:00" /></span></div><div class="cfg_col_r"><span class="label">价格：</span><span class="value"><input type="text" name="price" placeholder="竞价价格，如：50" /></span></div></div><div data-cfgclick="addrow" class="cfg_rowbtn">+</div><div data-cfgclick="removerow" class="cfg_rowbtn">-</div></div>\
                            </form>\
                          </div>\
                         ',
                shade: false,
                btn: ["确定", "取消"],
                yes: function (index, layero) {
                    var $form = layero.find('#cfgForm'),
                        arrays = this.getFormValues($form),
                        i, len = arrays.length,
                        inputObj = {},
                        inputArray = [],
                        item,
                        key,
                        rightCount,
                        errorTimesIndex = [],
                        errorPricesIndex = [],
                        timeRgx = /^(0?[0-9]|1[0-9]|2[0-3])\:(0[0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])$/,
                        priceRex = /^(([1-9]\d*)(\.\d{1,2})?)$|^(0\.0?([1-9]\d?))$/;
                    for (i = 0; i < len; i++) {
                        item = arrays[i];
                        rightCount = 0;
                        item.time = item.time.trim();
                        item.price = item.price.trim();
                        if (item.time.length > 0) {
                            if (!timeRgx.test(item.time)) {
                                errorTimesIndex.push(i);
                            } else {
                                rightCount++;
                            }
                        }
                        if (item.price.length > 0) {
                            if (!priceRex.test(item.price)) {
                                errorPricesIndex.push(i);
                            } else {
                                rightCount++;
                            }
                        }
                        if (rightCount == 2) {
                            inputObj[item.time] = item.price;
                        }
                    }

                    if (errorTimesIndex.length > 0) {
                        errorTimesIndex.forEach(function (index) {
                            layer.tips('时间格式不正确！', $form.find('input[name=time]:eq(' + index + ')'), {
                                tipsMore: true,
                                tips: 4
                            });
                        });
                    }

                    if (errorPricesIndex.length > 0) {
                        errorPricesIndex.forEach(function (index) {
                            layer.tips('价格格式不正确！', $form.find('input[name=price]:eq(' + index + ')'), {
                                tipsMore: true,
                                tips: 4
                            });
                        });
                    }

                    if (errorTimesIndex.length > 0 || errorPricesIndex.length > 0) {
                        return false;
                    }

                    for (key in inputObj) {
                        inputArray.push({
                            time: key,
                            price: inputObj[key],
                            text: '时间为:' + key + '时,价格调整为:' + inputObj[key]
                        });
                    }

                    if (inputArray.length <= 0) {
                        layer.alert('请录入执行时间点 和 竞价价格');
                        return false;
                    }

                    //开启输出窗口。
                    this.createOutputWin(inputArray);


                    layer.close(index);
                }.bind(this),
                success: function (layero, index) {
                    var $form = layero.find('#cfgForm');
                    $form.off('click').on('click', '.cfg_rowbtn', function (e) {
                        var $this = $(this), $parent;
                        e.stopPropagation();
                        e.preventDefault();
                        $parent = $this.parent();
                        switch ($this.attr('data-cfgclick')) {
                            case 'addrow':
                                $parent.clone().find('input').val('').end().insertAfter($parent);
                                break;
                            case 'removerow':
                                if ($form.children('.cfg_row').length == 1) {
                                    layer.alert('至少要保留一条记录！');
                                } else {
                                    layer.confirm('确定删除该记录?', { icon: 3, title: '提示' }, function (index) {
                                        $parent.remove();
                                        layer.close(index);
                                    });
                                }
                                break;
                        }
                    });
                }.bind(this)
            })
            return this;
        },
        createOutputWin: function (inputArray) {
            layer.open({
                type: 1,
                area: ['200px', 'auto'],
                title: '执行窗口',
                content: '<ul id="output" class="output"></ul>',
                shade: false,
                offset: 'rb',
                closeBtn: false,
                btn: ['终止执行'],
                yes: function (index, layero) {
                    location.reload();
                }.bind(this),
                success: function (inputArray, layero, index) {
                    this.$output = layero.find('#output');
                    this.$output.off('ouput').on('ouput', function (e, message, color) {
                        var html = '<li'
                        if (color) {
                            html += ' style="color:' + color + ';" '
                        }
                        html += '>' + message + '</li>';
                        this.$output.prepend(html);
                    }.bind(this));
                    inputArray.forEach(function (item) {
                        var timeexec = this.getWaitExecSeconds(item.time);
                        setTimeout(this.setTimeOutExecUpdatePrice.bind(this, item), timeexec);
                        this.ouputMsg("计划【" + item.text + "】将于 " + this.getTimesFormat(timeexec) + '后执行！');
                    }, this);
                }.bind(this, inputArray)
            });
        },
        getFormValues: function ($form) {
            var targetArray = $form.serializeArray(), array = [], tempItem, tempObj, i = 0, len = targetArray.length;
            while (i < len) {
                tempObj = {};
                tempItem = targetArray[i];
                tempObj[tempItem.name] = tempItem.value;
                i++;
                tempItem = targetArray[i];
                tempObj[tempItem.name] = tempItem.value;
                i++;
                array.push(tempObj);
            }
            return array;
        },
        getTimesFormat: function (time) {
            var hour = 1000 * 60 * 60,
                min = 1000 * 60,
                format;
            if (time > hour) {
                format = (time / hour).toFixed(3) + '小时';
            } else {
                format = Math.round(time / min) + '分钟';
            }
            return format;
        },
        getDateTimeFormat: function (fmt, date) {
            var o = {
                "M+": date.getMonth() + 1,                 //月份   
                "d+": date.getDate(),                    //日   
                "H+": date.getHours(),                   //小时   
                "m+": date.getMinutes(),                 //分   
                "s+": date.getSeconds(),                 //秒   
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
                "S": date.getMilliseconds()             //毫秒   
            };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        },
        formatDts: function (date) {
            return this.getDateTimeFormat("yyyy-MM-dd HH:mm:ss", date);
        },
        /**
         * 获取等待执行时间
         * @param {string} time 时间
         **/
        getWaitExecSeconds: function (time) {
            var nowDate = new Date()
                , nowYear = nowDate.getFullYear()
                , nowMonth = nowDate.getMonth() + 1
                , nowDate1 = nowDate.getDate()
                , execDate = new Date(nowYear + '-' + nowMonth + '-' + nowDate1 + ' ' + time)
                , fullDateSeconds = 1000 * 60 * 60 * 24
                , execTime = execDate.getTime()
                , nowTime = nowDate.getTime();
            if (nowDate > execDate) {
                return execTime + fullDateSeconds - nowTime;
            } else {
                return execTime - nowTime;
            }
        },
        /**
         * 定时执行更新任务
         * @param {object} item
         */
        setTimeOutExecUpdatePrice: function (item) {
            var fullDateSeconds = 1000 * 60 * 60 * 24;
            this.updatePrice(item.price);
            setTimeout(this.setTimeOutExecUpdatePrice.bind(this, item), fullDateSeconds);
            this.ouputMsg("当前计划【" + item.text + "】已执行，下次计划执行时间：" + this.formatDts(new Date(new Date().getTime() + fullDateSeconds)),'goldenrod');
        },
        ouputMsg: function (message, color) {
            color = color || '';
            this.$output.trigger('ouput', [this.formatDts(new Date()) + '：' + message, color]);
        },
        updatePrice: function (price) {
            this.ouputMsg("正在将价格更新为:" + price,'lightcoral');
            $.ajax({
                url: location.href.replace("cm", 'cm/api').replace('ad-groups', 'adgroups'),
                type: 'PATCH',
                dataType: 'JSON',
                contentType: 'application/json',
                data: this.getSubmitParams(price),
                complete: function (rs, code) {
                    if (code == 'success') {
                        this.ouputMsg("价格更新完成，当前价格为：" + price,'green');
                        $('[data-e2e-id=currencyInput]').val(price);
                    } else {
                        this.ouputMsg("价格更新失败", 'red');
                        typeof rs == 'object' && this.ouputMsg(JSON.stringify(rs));
                    }
                }.bind(this)
            });
            return this;
        },
        waitFor: function (selector, totalTimes, currentTime) {
            currentTime = currentTime || 1;
            var inputList = document.querySelectorAll(selector);
            if (inputList.length <= 0) {
                if (currentTime < totalTimes) {
                    setTimeout(this.waitFor.bind(this, selector, totalTimes, currentTime + 1), 1000);
                }
            } else if (inputList.length == 1) {
                this.createCss()
                    .createWin();
            }
        },
        run: function () {
            this.waitFor('[data-e2e-id=currencyInput]', 30);
        }
    }).run();
})();


