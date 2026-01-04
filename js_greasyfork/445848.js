    // ==UserScript==
    // @name         GD_CDAP
    // @namespace    http://tampermonkey.net/
    // @namespace    waitForKeyElements
    // @version      4.2.8
    // @description  Create advantage and enhance efficiency.
    // @author       Zhang JinFeng
    // @match        http://132.121.108.31/*
    // @match        http://132.121.108.30/*
    // @match        http://132.121.114.217/*
    // @match        http://132.121.2.6/*
    // @grant        GM_log
    // @grant        GM_setValue
    // @grant        GM_getValue
    // @grant        GM_deleteValue
    // @grant        GM_addStyle
    // @grant        GM_setClipboard
    // @grant        GM_xmlhttpRequest
    // @grant        GM_notification
    // @connect      132.121.108.30
    // @connect      132.121.108.31
    // @connect      132.121.114.217
    // @connect      132.121.2.6
    // @connect      132.121.2.4
    // @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
    // @grant        unsafeWindow
    // @license      ZhangJinFeng
    // 20221011 V2.8 增加对选中代码进行注释和取消注释按钮
    // 20221016 v2.9 改变匹配括号的背景颜色,避免亮色看不清
    // 20221019 v3.0 导出日志中，处理&quot转换成"、&gt转换成>、&lt转换成<
    // 20221026 v3.1 建表语句增加 STORED AS PARQUET，导出日志优化（精简注释增加执行时间，以及错误信息前面显示出执行的语句）
    // 20221027 v3.2~3.4 导出日志优化（大幅改版）
    // 20221112 v3.5 修改流程编辑窗口代码框大小bug，使得执行按钮不用滚动可见 
    // 20221117 v3.6 适配省升版，优化查看表功能 
    // 20221121 v3.7~3.9,V4.0 新增流程监控中，快速查看错误日志和运行中日志 
    // 20221121 v4.0.1 优化对话框，点击按钮显示红色 
    // 20221209 v4.0.2 优化--注释逻辑 
    // 20230301 v4.0.3 优化保存按钮，当数据库表字段内容有,号 导致列错位问题（将半角,转换成全角，）
    // 20230508 v4.0.5 增加 存流程 按钮，将流程代码和流程图保存到本地
    // 20230509 v4.0.6 增加在HSQL环节中双引号前面增加转义符 和 在执行SQL界面上取消双引号前的转义符 按钮
    // 20230509 v4.0.7 修复BUG
    // 20230510 v4.0.8 适应升版导致的流程编辑时  不能导出日志
    // 20230516 v4.0.9 解决查看和新增上游依赖时，库名和表名太长显示不全时，难以选择的问题
    // 20230516 v4.1.0 查看表结构增加导出原生的建表或建视图Sql，并直观说明是表还是视图
    // 20230517 v4.1.1 查看表结构增加保存到本地文件按钮
    // 20230519 v4.1.2 优化存流程的环节开头 根据节点类型不同生成对应的注释
    // 20230519 v4.1.3 保存流程增加定时配置
    // 20230521 v4.1.4-5 解决数据控制台查找省表时，看不全表名
    // 20230523 v4.1.6 适配其他环境
    // 20230523 v4.1.7 存流程 环节名称如果是数字则不用顺序号
    // 20230524 v4.1.8 存流程 获取输出表信息
    // 20230525 v4.1.9 存流程 增加输入参数
    // 20230529 v4.2.0 将省公司实现的调整输入框高度功能取消，修复获取查询数据列的名称
    // 20230531 v4.2.1 保存按钮优化，多个sql执行窗口时，仅仅存储当前执行sql的数据
    // 20230603 v4.2.2-6 优化保存功能，在执行按钮旁增加保存按钮，点击保存按钮打开预览窗口，需要再导出
    // 20231211 v4.2.7-8 根据GuoYingYing提供方法，优化保存csv功能，字段内容为长数字时，在后面增加\t,便于excel打开时不转换成科学计数法

    //https://laod.cn/code-audit/jquery-is-not-a-function.html   使用jquery方法

// @downloadURL https://update.greasyfork.org/scripts/445848/GD_CDAP.user.js
// @updateURL https://update.greasyfork.org/scripts/445848/GD_CDAP.meta.js
    // ==/UserScript==

    ////////////////////////////////引用函数
    //来源：https://github.com/chibrander/jStringy-JavaScript-Library-for-Text-Manipulation
    ;
    (function (global) {

        var jInit = function (text) {
            if (text == undefined) {
                throw "Please include a valid parameter inside parenthesis.";
            }
            this.text = text;
            this.val = text;
        }

        var jIn = function (text) {
            return new jInit(text);
        }

        var jStringy = jStringy || jIn;

        jInit.prototype.valueOf = function () {
            return this.val;
        }
        jInit.prototype.toString = function () {
            return this.val;
        }


        jInit.prototype.value = function () {
            return this.val;
        }

        jInit.prototype.left = function (num_char) {
            if (num_char == undefined) {
                throw "Number of characters is required!";
            }
            this.val = this.val.substring(0, num_char);
            return this;
        }

        jInit.prototype.right = function (numchar) {
            if (numchar == undefined) {
                throw "Number of characters is required!";
            }
            this.val = this.val.substring(this.val.length - numchar, this.val.length);
            return this;
        }

        jInit.prototype.midd = function (startchar, endchar) {
            this.val = this.val.substring(startchar - 1, endchar);
            return this;
        }

        jInit.prototype.mid = function (startchar, numchar) {
            this.val = this.val.substring(startchar - 1, startchar - 1 + numchar);
            return this;
        }

        jInit.prototype.BeforeAfter = function (character, return_type, adjust) {
            adjust = adjust == undefined ? 0 : adjust;
            return_type = return_type == undefined ? 0 : return_type;
            var len = character.length;
            var pos = this.val.indexOf(character) + len + 1 + adjust;

            // 0 for Before
            if (return_type == 0) {
                this.val = jStringy(this.val).midd(1, pos - len - 1).val;
            } else {
                len = this.val.length;
                var tmp_pos=this.val.indexOf(character);
                if ( tmp_pos==-1)
                {
                    this.val="";
                    return this;
                }
                this.val = jStringy(this.val).midd(pos, len).val;
            }
            return this;
        }



        // private reverse function
        // by Mathias Bynens <https://mathiasbynens.be/>
        // https://github.com/mathiasbynens/esrever
        var reverse = function (string) {

            var regexSymbolWithCombiningMarks = /([\0-\u02FF\u0370-\u1AAF\u1B00-\u1DBF\u1E00-\u20CF\u2100-\uD7FF\uE000-\uFE1F\uFE30-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])([\u0300-\u036F\u1AB0-\u1AFF\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F]+)/g;
            var regexSurrogatePair = /([\uD800-\uDBFF])([\uDC00-\uDFFF])/g;
            // Step 1: deal with combining marks and astral symbols (surrogate pairs)
            // Swap symbols with their combining marks so the combining marks go first
            string = string.replace(regexSymbolWithCombiningMarks, function ($0, $1, $2) {
                    // Reverse the combining marks so they will end up in the same order
                    // later on (after another round of reversing)
                    return reverse($2) + $1;
                })
                // Swap high and low surrogates so the low surrogates go first
                .replace(regexSurrogatePair, '$2$1');
            // Step 2: reverse the code units in the string
            var result = '';
            var index = string.length;
            while (index--) {
                result += string.charAt(index);
            }
            return result;
        };

        // END private reverse function


        jInit.prototype.reversed = function () {
            this.val = reverse(this.val);
            return this;
        }

        jInit.prototype.wordCount = function () {
            var newtxt = this.val.replace(/,|\.|\:|\;|\?|\!|\(|\)/g, " ");
            newtxt = jStringy(newtxt).trimed().val;
            newtxt = newtxt.split(" ");
            this.val = newtxt.length;
            return this;
        }

        jInit.prototype.trimed = function () {
            this.val = this.val.replace(/ +/g, " ").trim();
            return this;
        }


        jInit.prototype.proper = function (type) {
            // based on David Gouch's code
            var txt = this.val;
            var web = /[A-Z]|\../;
            if (type == 1) {
                var t = /^(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|vs?\.?|via)$/i;
            } else if (type == 2) {
                var t = /^(a|an|the|to|for|on|of|in)$/i;
            } else if (type == 3) {
                var t = /^(a|an|the)$/i;
            } else {
                var t = /^()$/i;
                web = "Abs&&$$olper&&*%jhghjfddsg45654737egffdgd@hgfh";
            }
            this.val = txt.replace(/([^\W_]+[^\s-]*) */g, function (txt, n, r, i) {
                return r > 0 && r + n.length !== i.length && n.search(t) > -1 && i.charAt(r - 2) !== ":" && i.charAt(r - 1).search(/[^\s-]/) < 0 ? txt.toLowerCase() : n.substr(1).search(web) > -1 ? txt : txt.charAt(0).toUpperCase() + txt.substr(1)
            })
            return this;
        };


        jInit.prototype.getWordByNum = function (word_number, type) {
            var text = jStringy(this.val).trimed().val;
            var dateArr = text.split(" ");
            // 0 to count from the right end
            if (type == 0) {
                this.val = dateArr[dateArr.length - word_number];
            } else {
                this.val = dateArr[word_number - 1];
            }
            return this;
        }

        jInit.prototype.getWords = function (start_word_number, end_word_number) {
            var text = jStringy(this.val).trimed().val;
            var strArray = text.split(" ");
            var nArr = [];
            var n = 0;
            for (i = start_word_number - 1; i < end_word_number; i++) {
                nArr[n] = strArray[i];
                n++;
            }
            this.val = jStringy(nArr.join(" ")).trimed().val;
            return this;
        }

        jInit.prototype.containsWord = function (wordtofind) {
            var nwheretofind = (" " + this.val + " ").toLowerCase();
            var nwordtofind = (" " + wordtofind + " ").toLowerCase();
            nwheretofind = nwheretofind.replace(/,|\.|\:|\;|\?|\!|\(|\)/g, " ");
            if (nwheretofind.indexOf(nwordtofind) >= 0) {
                this.val = true;
            } else {
                this.val = false;
            }
            return this;
        }

        jInit.prototype.repeat = function (numtimes) {
            var ttxt = this.val;
            for (i = 1; i < numtimes; i++) {
                this.val += ttxt
            }
            return this;
        }


        // Main private number format function
        var formatMain = function (num, cur, c, d, t, endstr) {
                var n = num,
                    c = isNaN(c = Math.abs(c)) ? 2 : c,
                    d = d == undefined ? "." : d,
                    t = t == undefined ? "," : t,
                    s = n < 0 ? "-" : "",
                    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
                    j = (j = i.length) > 3 ? j % 3 : 0;
                return cur + s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "") + endstr;
            }
            // END Main private number format function

        jInit.prototype.formatCurrency = function (cur, c, d, t) {
            this.val = formatMain(this.val, cur, c, d, t, "");
            return this;
        }

        jInit.prototype.formatPercent = function (c, d, t) {
            this.val = formatMain(this.val * 100, "", c, d, t, "%");
            return this;
        }

        jInit.prototype.formatNumber = function (c, d, t) {
            this.val = formatMain(this.val, "", c, d, t, "");
            return this;
        }

        jInit.prototype.formatDollar = function (c, d, t) {
            this.val = formatMain(this.val, "$", c, d, t, "");
            return this;
        }

        jInit.prototype.toDouble = function (decimal) {
            decimal = decimal == undefined ? "." : decimal;

            // from accounting.js
            // https://raw.githubusercontent.com/openexchangerates/accounting.js/master/accounting.js

            var regex = new RegExp("[^0-9-" + decimal + "]", ["g"]),
                unformatted = parseFloat(
                    ("" + this.val)
                    .replace(/\((.*)\)/, "-$1") // replace bracketed values with negatives
                    .replace(regex, '') // strip out any cruft
                    .replace(decimal, '.') // make sure decimal point is standard
                );
            this.val = unformatted;
            return this;
        }





        /*
        Levenshtein Distance
        Based on Andrei Mackenzie's Code
        */
        jInit.prototype.levenshteinDistance = function (b) {
                var a = this.val;
                if (a.length == 0) return b.length;
                if (b.length == 0) return a.length;

                var matrix = [];

                // increment along the first column of each row
                var i;
                for (i = 0; i <= b.length; i++) {
                    matrix[i] = [i];
                }

                // increment each column in the first row
                var j;
                for (j = 0; j <= a.length; j++) {
                    matrix[0][j] = j;
                }

                // Fill in the rest of the matrix
                for (i = 1; i <= b.length; i++) {
                    for (j = 1; j <= a.length; j++) {
                        if (b.charAt(i - 1) == a.charAt(j - 1)) {
                            matrix[i][j] = matrix[i - 1][j - 1];
                        } else {
                            matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                                Math.min(matrix[i][j - 1] + 1, // insertion
                                    matrix[i - 1][j] + 1)); // deletion
                        }
                    }
                }

                this.val = matrix[b.length][a.length];
                return this;
            }
            // END levenshteinDistance





        /*
        Gets the best match string or index based on Levenshtein Distance. This function returns an array, due to possibility of having multiple best matches.
        */
        jInit.prototype.bestMatch = function (lookup_array, results_type) {
                var txt = this.val;
                var arrmatch = [lookup_array[0]];
                var arrindex = ["N/A"];
                var matchnum = jStringy(txt).levenshteinDistance(lookup_array[0]).val;
                results_type = results_type == undefined ? 0 : results_type;

                for (var i = 0; i < lookup_array.length; i++) {
                    if (jStringy(txt).levenshteinDistance(lookup_array[i]).val < matchnum) {
                        matchnum = jStringy(txt).levenshteinDistance(lookup_array[i]).val;
                        arrmatch = [];
                        arrindex = [];
                        arrmatch[0] = lookup_array[i];
                        arrindex[0] = i;
                    } else if (jStringy(txt).levenshteinDistance(lookup_array[i]).val == matchnum) {
                        arrmatch[arrmatch.length] = lookup_array[i];
                        arrindex[arrindex.length] = i;
                    }
                }
                if (results_type == 0) {
                    this.val = arrmatch;
                } else {
                    this.val = arrindex;
                }
                return this;
            }
            // END bestMatch


        // convert to Object

        jInit.prototype.bestMatchObject = function (lookup_array) {

                this.lookup_array = lookup_array;
                this.lookup_value = this.val;
                this.array = jStringy(this.lookup_value).bestMatch(this.lookup_array).val;
                this.arrayIndex = jStringy(this.lookup_value).bestMatch(this.lookup_array, 1).val;
                this.first = this.array[0];
                this.firstIndex = this.arrayIndex[0];
                this.len = this.array.length;
                this.last = this.array[this.array.length - 1];
                this.lastIndex = this.arrayIndex[this.array.length - 1];
                return this;

            }
            // END bestMatchObject



        var popula = function (texto, ind, filter_array, override, type) {
            type = type == undefined ? 0 : type;
            override = override == undefined ? 0 : override;
            var str = texto.replace(/,|\.|\:|\;|\?|\!|\(|\)/g, " ");
            str = str.toLowerCase();
            var cominwords = ['of', 'the', 'in', 'on', 'at', 'to', 'a', 'is', 'an', 'for', 'and', 'or', 'as', 'are', 'am'];
            var comwords = [];

            if (filter_array != undefined && override == 0) {
                comwords = cominwords.concat(filter_array);
            } else if (filter_array != undefined) {
                comwords = filter_array;
            } else if (override == 0) {
                comwords = cominwords;
            }

            var re = new RegExp('\\b(' + comwords.join('|') + ')\\b', 'g');
            str = (str || '').replace(re, '').replace(/[ ]{2,}/, ' ');
            str = jStringy(str).trimed().val;

            var arr = str.split(" ").sort();
            var resarr = [[1, arr[0]]];
            var n = 0;
            for (var i = 1; i < arr.length; i++) {
                if (arr[i] == resarr[n][1]) {
                    resarr[n][0]++;
                } else {
                    var nxt = arr[i];
                    resarr.push([1, nxt]);
                    n++;
                }
            }
            // sort decending by column 2. Switch 1 and -1 for asc.

            function dsd(a, b) {
                if (a[1] === b[1]) {
                    return 0;
                } else {
                    return (a[1] < b[1]) ? 1 : -1;
                }
            }

            function dsdF(a, b) {
                if (a[0] === b[0]) {
                    return 0;
                } else {
                    return (a[0] < b[0]) ? 1 : -1;
                }
            }

            // resarr is now an array with all words with their counts.
            // resarr[0][0] holds the count, resarr[0][1] holds the word.
            resarr.sort(dsdF);

            //remove text column from the array and assign to a new variable
            var uresarr = resarr.map(function (val) {
                return val.slice(0, -1);
            });

            uresarr.sort();

            var newarr = [uresarr[0][0]];

            for (var i = 1; i < uresarr.length; i++) {

                if (uresarr[i][0] !== uresarr[i - 1][0]) {
                    newarr.push(uresarr[i][0]);
                }

            }

            // newarr is now a list of counts in descending order.
            newarr.sort(function (a, b) {
                return b - a
            });

            var methodarr = [];

            for (var i = 0; i < resarr.length; i++) {
                if (resarr[i][0] == newarr[ind - 1]) {
                    methodarr.push(resarr[i][1]);
                }
            }
            methodarr.sort();

            if (type == 0) {
                return methodarr;
            } else {
                return newarr[ind - 1];
            }

        }

        // convert popular to Object

        jInit.prototype.popular = function (ind, filter_array, override) {
                this.array = popula(this.val, ind, filter_array, override, 0);
                this.count = popula(this.val, ind, filter_array, override, 1);
                this.first = this.array[0];
                this.len = this.array.length;
                this.last = this.array[this.array.length - 1];
                return this;
            }
            // END popular Object


        global.jStringy = global.S$ = jStringy;

        return this;

    }(window));

    ////////////////////////////////////////////////////////////////
    ///////////////////////////////////////begin
    ///////////////////////////////////////////////////////////////
    var $ = unsafeWindow.jQuery;
    var g_allowSaveIP="10.17.227." ;//allow save IP
    var title_str="";//存储窗口标题
    var sql_saved="";//存储已保存的sql语句
    var sync_status=0;//存储查询返回的状态
    var sync_result="";//存储查询返回的结果
    var sync_result2="";//存储查询返回的结果(第二个结果集)
    var sync_message="";//存储查询返回的结果信息
    var sync_flowName="";//存储查询返回的流程名称
    var sync_flowNameCn="";//存储查询返回的流程名称中文
    var sync_diagramData="";//存储查询返回的流程信息
    var sync_diagramDatas=[[,,]];//存储查询返回的流程信息数组 1 序号 2 标题 3 内容
    var sync_code="";//存储查询返回的code
    var my_msg_title="";//存储对话框标题
    var my_msg_content="";//存储对话框内容
    var hive_sql_short_col;  //查看表结构select语句
    var create_sql;  //查看表结构 hive建表语句
    var pg_create_sql;  //查看表结构   pg建表语句
    var col_xls;  //查看表结构 复制到xls语句
    var hive_orig_create_table_sql;//hive原生建表语句
    var alert_token=false; //判断是否提醒过
    var g_refreshTime=1000; //设置定时器刷新时长
    var g_timer;//定义一个变量，用来保存定时器的标识
    var g_ServIp="";//定义服务器IP
    var g_ServIpReferrer="";//
    var isFlowNode=false;//是否在流程节点编辑
    var nodeTypes= {
        "5": "HSQL",
        "6": "SHELL",
        "12": "START",
        "13": "END",
        "15": "标签,Tag",
        "16": "推送_NEW,Push",
        "20": "数据清洗,DataClean",
        "21": "采集,Collect2",
        "22": "推送,Push2",
        "27": "Hbase,HbaseLoad",
        "29": "PYTHON3",
        "30": "上游依赖检查,upDepend",
        "31": "标签模型,TagModel",
        "32": "流程节点,FLOW",
        "34": "流程触发,NOTICE",
        "35": "清单下载触发,DTDOWNLOAD"
    };
        var scheduleCycleTypes= {
        "S0D": "日",
        "S0M": "月",
        "S0Y": "年",
        "S0W": "星期",
        "S0H": "小时",
        "S0F": "分钟",
    };

    (function() {
        'use strict';

        // 在控制台打印日志
        //GM_log("Hello World");
        //设置缓存
        //GM_setValue("hello", true);
        //获取缓存，默认值为true
        //GM_getValue("hello", true);
        //删除缓存
        //GM_deleteValue("hello")

        //获取顶部项目管理菜单 document.querySelector("span.ud-node-name")
        //获取+号对象 document.querySelector("#tab-add.el-tabs__item.is-top.is-closable")

        //获取SQL查询结果的标题 document.querySelectorAll("th.is-leaf.el-table__cell>.cell")[0].innerText
        //SQL窗口的预提示按钮隐藏document.querySelector("label[data-v-60b9958e].el-checkbox").style.display="none"
        //SQL窗口的格式化按钮隐藏 document.querySelector("button[data-v-60b9958e]").style.display="none"
        //SQL窗口的帮助按钮隐藏 document.querySelector("button[data-v-60b9958e][title='帮助']").style.display="none"
        //流程编辑弹出窗口 document.querySelectorAll("div[role='dialog'][aria-label='dialog']")[1]
        //编辑框左侧 var leftP=document.querySelector("div[data-v-535de2f4].left")

        var url = window.location.href;
        url=url.replace("homePageUrl=http://132.121.114.217","");
        //console.log("url:"+url);
        //=============================================
        /* 首页132.121.114.217油猴处理脚本 */
        //=============================================
        if(url.indexOf('132.121.114.217') != -1) {
            var date=new Date();
            console.log(dateFormat("yyyy-mm-dd HH:MM:SS",date)+":启动或reload进入homepage！");
            var homepage=document.querySelector("li[role='menuitem']");
            setInterval(homepageReload, 25*60*1000); //25分钟刷新
            if (homepage!=null) {
                console.log("启动网页定时刷新");
                //setInterval(homepageReload, 5000);
            }
        }

        //=============================================================
        /* 自助分析132.121.108.* 油猴处理脚本 */
        //=============================================================
        if(url.indexOf('132.121.108.') != -1 || url.indexOf('132.121.2.') != -1 ) {
            if (url.indexOf('132.121.108.') != -1) {
                g_ServIp='132.121.108.30:20012';
                g_ServIpReferrer='132.121.108.31:24102';
            } else {
                g_ServIp='132.121.2.4:10012';
                g_ServIpReferrer='132.121.2.6:7001';
            }
            //获取sql编辑框放大的高度，第一次设置是400px
            var sqlHight=GM_getValue("sqlHight", '400');
            //存储sql的程序默认设置的高度
            var sql_curr_hight="230px";
            var sql_org_hight="230px";
            //不用 waitForKeyElements ("div.CodeMirror.cm-s-blackboard[style='width: auto; height: 230px;']", sqlSetHight(sqlHight+"px") );



            var css_btn_zjf=`.el-button.dw-button.h29.el-button--primary.el-button--mini--zjf {
                height: 24px;
                line-height: 22px;
                padding: 0 4px;
                font-size: 12px;
            }`;
            GM_addStyle(css_btn_zjf);

            /*1、修改SQL编辑框CSS*/
            var css=`.cm-s-blackboard.CodeMirror {background: #ffffff;color: #000000;} /*sql编辑框的背景 */
            .cm-s-blackboard .cm-keyword {color: #840000;} /*sql编辑框的 关键字颜色*/
            .cm-s-blackboard .cm-operator {color: #000000;} /*sql编辑框的 操作字符颜色*/
            .cm-s-blackboard .CodeMirror-gutters {background: #f7f3f7;border-right: 0;} /*sql编辑框的 左面行号底色*/
            .cm-s-blackboard .cm-string, .cm-s-blackboard .cm-string-2 {color: #008000;} /*sql编辑框的 字符串颜色*/
            .cm-s-blackboard .cm-atom, .cm-s-blackboard .cm-number {color: #0000B1;} /*sql编辑框的 数字颜色*/
            `;

            var css_black=`.cm-s-blackboard.CodeMirror {background: #0c1021;color: #f8f8f8;}
            .cm-s-blackboard .cm-keyword {color: #fbde2d;}
            .cm-s-blackboard .cm-operator {color: #fbde2d;}
            .cm-s-blackboard .CodeMirror-gutters {background: #000000;border-right: 0;} /*sql编辑框的 左面行号底色*/
            .cm-s-blackboard .cm-string, .cm-s-blackboard .cm-string-2 {color: #61ce3c;}
            cm-s-blackboard .cm-atom, .cm-s-blackboard .cm-number {color: #d8fa3c;}
            `

            var codeCSS=".CodeMirror {font-family: monospace;height: 300px;color: #000;direction: ltr;  line-height: 150%;}" //修改编辑框行距150%
            var codeMatchingbracket="div.CodeMirror span.CodeMirror-matchingbracket {color: #FF0000;background-color: #A0A0A0;}" //改变的匹配括号的背景颜色
            GM_addStyle(codeMatchingbracket);
            
            var sql_font=`.CodeMirror pre.CodeMirror-line, .CodeMirror pre.CodeMirror-line-like {
                border-radius: 0;
                border-width: 0;
                background: transparent;
                font-family: inherit;
                font-size: inherit;
                margin: 0;
                white-space: pre;
                word-wrap: normal;
                line-height: inherit;
                color: inherit;
                z-index: 2;
                position: relative;
                overflow: visible;
                -webkit-tap-highlight-color: transparent;
                -webkit-font-variant-ligatures: contextual;
                font-variant-ligatures: contextual;
            }`
            var sql_font_big=`.CodeMirror pre.CodeMirror-line, .CodeMirror pre.CodeMirror-line-like {
                border-radius: 0;
                border-width: 0;
                background: transparent;
                font-family: inherit;
                font-size: 18px;
                margin: 0;
                white-space: pre;
                word-wrap: normal;
                line-height: inherit;
                color: inherit;
                z-index: 2;
                position: relative;
                overflow: visible;
                -webkit-tap-highlight-color: transparent;
                -webkit-font-variant-ligatures: contextual;
                font-variant-ligatures: contextual;
                }`


            //==============================
            //*1、增加 收起左侧库表窗口 */
            //==============================
            var btn_sql_left = document.createElement('div');
            btn_sql_left.style.position="fixed"
            btn_sql_left.className="el-button dw-button h29 el-button--primary el-button--mini--zjf";
            btn_sql_left.style.top="-5px";
            btn_sql_left.style.zIndex= 99999;
            btn_sql_left.innerText ='＜';
            btn_sql_left.style.left=getBtnLeft('＜');"310px";
            btn_sql_left.style.textAlign="center";
            //绑定按键点击功能
            btn_sql_left.onclick = function (){
                //console.log(this.innerText);
                //var sql_left_window=document.querySelector("div[data-v-535de2f4]>div.left");
                //var sql_resize_window=document.querySelector("div[data-v-535de2f4]>div.resize");
                //var sql_mid_window=document.querySelector("div>div.mid");
                var sql_left_window=document.querySelectorAll("div>div.left");
                var sql_resize_window=document.querySelectorAll("div>div.resize");
                var sql_mid_window=document.querySelectorAll("div>div.mid");
                var ii=0;
                if (this.innerText=="＜") {
                    this.innerText='＞';
                    for(ii=0;ii<sql_left_window.length;ii++) {
                        sql_left_window[ii].style.display="none"; }
                    for(ii=0;ii<sql_resize_window.length;ii++) {
                        sql_resize_window[ii].style.display="none";}
                    for(ii=0;ii<sql_mid_window.length;ii++) {
                        sql_mid_window[ii].style.width="100%";}
                    my_log("已收起SQL编辑框的查看库表");
                }
                else {
                    this.innerText='＜';
                    //sql_left_window.style.display="";
                    //sql_resize_window.style.display="";
                    //sql_mid_window.removeAttribute("style");
                    for(ii=0;ii<sql_left_window.length;ii++) {
                        sql_left_window[ii].style.display=""; }
                    for(ii=0;ii<sql_resize_window.length;ii++) {
                        sql_resize_window[ii].style.display="";}
                    for(ii=0;ii<sql_mid_window.length;ii++) {
                        sql_mid_window[ii].removeAttribute("style");}
                    my_log("已恢复SQL编辑框的查看库表");
                }
                return;
            };
            document.body.appendChild(btn_sql_left);

            //============================================
            /*2、增加 放大SQL编辑框大小 按钮和梳理高度*/
            //============================================
            //sql高度输入框
            /* 省里已实现，取消该功能
            var new_hight = document.createElement('input');
            new_hight.style.position="fixed"
            new_hight.style.top="0px";
            new_hight.style.zIndex= 99999;
            new_hight.style.width='30px';
            new_hight.style.textAlign='center';
            new_hight.value=sqlHight;
            new_hight.setAttribute("id", "new_hight");
            new_hight.style.left=getBtnLeft('input_sql');//"370px";
            document.body.appendChild(new_hight);

            //sql高度调整按钮
            let btn_sqlHight = document.createElement('div');
            btn_sqlHight.style.position="fixed"
            btn_sqlHight.className="el-button dw-button h29 el-button--primary el-button--mini--zjf";        
            btn_sqlHight.style.top="-5px";
            btn_sqlHight.style.zIndex= 99999;
            btn_sqlHight.innerText ='<=调整';
            btn_sqlHight.style.left=getBtnLeft('<=调整');//"400px";
            btn_sqlHight.onclick = function (){
                if (this.innerText=="<=调整") {
                    this.innerText='恢复';
                    sqlHight=document.querySelector("#new_hight").value;
                    GM_setValue("sqlHight", sqlHight);
                    sqlSetHight(sqlHight+"px");
                    my_log("已将SQL编辑框的高度调整为:"+sqlHight );
                }
                else {
                    this.innerText='<=调整';
                    sqlSetHight(sql_org_hight);
                    my_log("已将SQL编辑框的高度恢复为:"+sql_org_hight.replace("px","") );
                }
                return;
            };
            document.body.appendChild(btn_sqlHight);
            */

            //==============================
            /*3、增加 隐藏提示 按钮*/
            //==============================
            /* 省里已实现，取消该功能
            let btn_hiddenHint = document.createElement('div');
            btn_hiddenHint.style.position="fixed"
            btn_hiddenHint.className="el-button dw-button h29 el-button--primary el-button--mini--zjf";
            btn_hiddenHint.style.top="-5px";
            btn_hiddenHint.style.zIndex= 99999;
            btn_hiddenHint.innerText ='隐藏提示';
            btn_hiddenHint.style.left=getBtnLeft("隐藏提示");//480px";
            //绑定按键点击功能
            btn_hiddenHint.onclick = function (){
                //console.log(this.innerText);
                if (this.innerText=="隐藏提示") {
                    this.innerText='显示提示';my_log("已将SQL编辑框的提示功能取消");}
                else {
                    this.innerText='隐藏提示';my_log("已打开SQL编辑框的提示功能");}
                sqlHiddenHint();
                return;
            };
            document.body.appendChild(btn_hiddenHint);
            //进入系统默认隐藏提示
            //sqlHiddenHint();
            //btn_hiddenHint.innerText ='显示提示';
            */
            //=====================================
            /*4、增加 获取sql结果各列名称 按钮*/
            //=====================================
            let btn_getSqlColName = document.createElement('div');
            btn_getSqlColName.style.position="fixed"
            btn_getSqlColName.className="el-button dw-button h29 el-button--primary el-button--mini--zjf";
            btn_getSqlColName.style.top="-5px";
            btn_getSqlColName.style.zIndex= 99999;
            btn_getSqlColName.innerText ='获取列名';
            btn_getSqlColName.style.left=getBtnLeft("获取列名");//575px";
            btn_getSqlColName.onclick = function (){
                var str_colName=getSqlResult("title2");
                console.log(str_colName);
                GM_setClipboard(str_colName);
                my_log("已将SQL查询结果的各列名拷贝到粘贴板");
                alert("复制列名为(可以在Sql窗口用Ctrl+V粘贴复制的列名)："+str_colName);
                return;
            };
            document.body.appendChild(btn_getSqlColName);

            //==============================
            /*5、增加 放大字体 按钮*/
            //==============================
            let btn_bigFont = document.createElement('div');
            btn_bigFont.style.position="fixed"
            btn_bigFont.className="el-button dw-button h29 el-button--primary el-button--mini--zjf";        
            btn_bigFont.style.top="-5px";
            btn_bigFont.style.zIndex= 99999;
            btn_bigFont.innerText ='字体放大';
            btn_bigFont.style.left=getBtnLeft('字体放大');//"675px";
            //绑定按键点击功能
            btn_bigFont.onclick = function (){
                //console.log(this.innerText);
                if (this.innerText=="字体放大") {
                    this.innerText='字体缩小';
                    GM_addStyle(sql_font_big);
                    my_log("已将SQL编辑框的字体放大");
                }
                else {
                    this.innerText='字体放大';
                    GM_addStyle(sql_font);
                    my_log("已将SQL编辑框的字体恢复");
                }
                return;
            };
            document.body.appendChild(btn_bigFont);
            //进入系统默认隐藏提示
            //sqlHiddenHint();
            //btn_hiddenHint.innerText ='显示提示';

            //==============================
            /*6、增加 设置编辑框的背景 按钮*/
            //==============================
            let btn_sqlBackground=document.createElement('div');
            btn_sqlBackground.style.position="fixed"
            btn_sqlBackground.className="el-button dw-button h29 el-button--primary el-button--mini--zjf";
            btn_sqlBackground.style.top="-5px";
            btn_sqlBackground.style.zIndex= 99999;
            btn_sqlBackground.style.left=getBtnLeft('暗色');//"775px";
            var sql_style=GM_getValue("sql_style",'暗色');
            //console.log(sql_style)
            if (sql_style=='暗色'){GM_addStyle(css_black);btn_sqlBackground.innerText ="亮色";}
            else {GM_addStyle(css);btn_sqlBackground.innerText ="暗色";}
            //绑定按键点击功能
            btn_sqlBackground.onclick = function (){
                //console.log(this.innerText);
                if (this.innerText=="亮色") {
                    this.innerText='暗色';
                    GM_addStyle(css);
                    GM_setValue("sql_style",'亮色');
                    my_log("已将SQL编辑框设置为亮色");
                }
                else {
                    this.innerText='亮色';
                    GM_addStyle(css_black);
                    GM_setValue("sql_style",'暗色');
                    my_log("已将SQL编辑框设置为暗色");
                }
                return;
            };
            document.body.appendChild(btn_sqlBackground);

            //==============================
            //*7、增加 下载结果 */
            //==============================
            var btn_sql_result = document.createElement('div');
            btn_sql_result.style.position="fixed"
            btn_sql_result.className="el-button dw-button h29 el-button--primary el-button--mini--zjf";
            btn_sql_result.style.top="-5px";
            btn_sql_result.style.zIndex= 99999;
            btn_sql_result.innerText ="保存";
            btn_sql_result.style.left=getBtnLeft("保存");//"850px";
            //btn_sql_result.style.width="10px";
            btn_sql_result.style.textAlign="center";
            btn_sql_result.style.display="none"
            btn_sql_result.setAttribute("id", "sql_result");
            //绑定按键点击功能
            btn_sql_result.onclick = function (){
                //console.log(this.innerText);
                getSqlResultWindow(isFlowNode);
                //GM_setClipboard(str_export);
                my_log("已将SQL查询结果存成csv文件");
                return;
            };
            document.body.appendChild(btn_sql_result);


            //==============================
            /*8、增加 获取选中内容的表结构 按钮*/
            //==============================
            let btn_tableDesc = document.createElement('div');
            btn_tableDesc.style.position="fixed"
            btn_tableDesc.className="el-button dw-button h29 el-button--primary el-button--mini--zjf";
            btn_tableDesc.style.top="-5px";
            btn_tableDesc.style.zIndex= 99999;
            btn_tableDesc.innerText ='表结构';
            btn_tableDesc.style.left=getBtnLeft('表结构');//"910px";
            //绑定按键点击功能
            btn_tableDesc.onclick = function (){
                my_log("正在获取选中内容的表结构......");
                var ret=tableDesc();
                //if (ret==0) {my_log("已获取选中内容的表结构.");}
                //else {my_log("获取选中内容的表结构失败.");}
                return;
            };
            document.body.appendChild(btn_tableDesc);

            //==============================
            /*9、增加 日志筛选 按钮*/
            //==============================
            let btn_logFilter = document.createElement('div');
            btn_logFilter.style.position="fixed"
            btn_logFilter.className="el-button dw-button h29 el-button--primary el-button--mini--zjf";
            btn_logFilter.style.top="-5px";
            btn_logFilter.style.zIndex= 99999;
            btn_logFilter.innerText ='导出日志';
            btn_logFilter.style.left=getBtnLeft('导出日志');//"1000px";
            //绑定按键点击功能
            btn_logFilter.onclick = function (){
                my_log("获取当前窗口显示的日志并筛选需要内容");
                var ret=logFilter();
                return;
            };
            document.body.appendChild(btn_logFilter);

            //==============================
            /*10、增加 选中文本注释 按钮*/
            //==============================
            let btn_addComment= document.createElement('div');
            btn_addComment.style.position="fixed"
            btn_addComment.className="el-button dw-button h29 el-button--primary el-button--mini--zjf";
            btn_addComment.style.top="-5px";
            btn_addComment.style.zIndex= 99999;
            btn_addComment.innerText ='--';
            btn_addComment.style.left=getBtnLeft("--");//"1200px";
            //绑定按键点击功能
            btn_addComment.onclick = function (){
                my_log("将当前选中的脚本增加注释--");
                var ret=addComment();
                return;
            };
            document.body.appendChild(btn_addComment);

            //==============================
            /*11、删除 选中文本注释 按钮*/
            //==============================
            let btn_delComment= document.createElement('div');
            btn_delComment.style.position="fixed"
            btn_delComment.className="el-button dw-button h29 el-button--primary el-button--mini--zjf";
            btn_delComment.style.top="-5px";
            btn_delComment.style.zIndex= 99999;
            btn_delComment.innerText ='X--';
            btn_delComment.style.left=getBtnLeft('X--');//"1240px";
            //绑定按键点击功能
            btn_delComment.onclick = function (){
                my_log("将当前选中的脚本取消注释--");
                var ret=delComment();
                return;
            };
            document.body.appendChild(btn_delComment);

            //==============================
            /*12、增加 存流程 按钮*/
            //==============================
            let btn_saveFlow= document.createElement('div');
            btn_saveFlow.style.position="fixed"
            btn_saveFlow.className="el-button dw-button h29 el-button--primary el-button--mini--zjf";
            btn_saveFlow.style.top="-5px";
            btn_saveFlow.style.zIndex= 99999;
            btn_saveFlow.innerText ='存流程';
            btn_saveFlow.style.left=getBtnLeft('存流程');//"1240px";
            //绑定按键点击功能
            btn_saveFlow.onclick = function (){
                my_log("已将当前编辑的流程存成文件。");
                var ret=saveFlow();
                return;
            };
            document.body.appendChild(btn_saveFlow);

            //==============================
            /*13、增加 选中文本"转义 按钮*/
            //==============================
            let btn_addESC= document.createElement('div');
            btn_addESC.style.position="fixed"
            btn_addESC.className="el-button dw-button h29 el-button--primary el-button--mini--zjf";
            btn_addESC.style.top="-5px";
            btn_addESC.style.zIndex= 99999;
            btn_addESC.innerText ='\\"';
            btn_addESC.style.left=getBtnLeft('\\"');//"1200px";
            //绑定按键点击功能
            btn_addESC.onclick = function (){
                my_log("将当前选中的脚本\"增加转义");
                var ret=addESC();
                return;
            };
            document.body.appendChild(btn_addESC);

            //==============================
            /*11、删除 选中文本转义 按钮*/
            //==============================
            let btn_delESC= document.createElement('div');
            btn_delESC.style.position="fixed"
            btn_delESC.className="el-button dw-button h29 el-button--primary el-button--mini--zjf";
            btn_delESC.style.top="-5px";
            btn_delESC.style.zIndex= 99999;
            btn_delESC.innerText ='X\\"';
            btn_delESC.style.left=getBtnLeft('X\\"');//"1240px";
            //绑定按键点击功能
            btn_delESC.onclick = function (){
                my_log("将当前选中的脚本取消转义");
                var ret=delESC();
                return;
            };
            document.body.appendChild(btn_delESC);

            //==============================
            //*99、增加 log框 */
            //==============================
            var logBanner = document.createElement('div');
            logBanner.style.position="fixed"
            //logBanner.className="el-button dw-button h29 el-button--primary el-button--mini";
            logBanner.style.left="0px";
            logBanner.style.top="3px";
            logBanner.style.zIndex= 99999;
            logBanner.style.width='310px';
            logBanner.style.textAlign='center';
            logBanner.style.fontSize='10px';
            logBanner.style.color='#FF0000';
            logBanner.setAttribute("id", "logBanner");
            //logBanner.style.cssText="font-size: 15px;width: 530px;min-height: 438px;padding-top: 10px;border: solid 1px #c0c4cc;";
            document.body.appendChild(logBanner);
            my_log("已启动油猴脚本");

            //===================================
            //10S刷新一次解决流程编辑能修改问题
            //===================================
            //let timeout=2000;
            g_timer=setInterval(timeProc, g_refreshTime);

            //==================================
            //修改窗口标题 格式 日-序号 HH:MM
            //==================================
            var title=document.querySelector("title");
            var d=new Date();
            var dd=dateFormat("dd", d);
            var HHMM=dateFormat("HH:MM",d);
            var no=GM_getValue("title_no",0);
            var rq=GM_getValue("yyyymmdd","");
            GM_log(rq+" "+no.toString());
            if (rq==dateFormat("yyyy-mm-dd",d)){
                no=no+1;
            }
            else{
                no=1;
                GM_setValue("yyyymmdd",dateFormat("yyyy-mm-dd",d));
            }
            GM_setValue("title_no",no);
            title_str=dd+"-"+no.toString()+" "+HHMM;
            if (title!=null){title.innerText=title_str;}

            //=============================================
            //每隔55分钟重新和hive服务器通信一次，避免退出
            //=============================================
            /*setTimeout(() => { //首次运行等2秒
                sqlpageReload();;
            }, 3000);
            setInterval(sqlpageReload,55*60*1000);
            */

            //====================================
            //30分钟看脚本有无修改，如修改保存
            //====================================
            setInterval(auto_save_sql, 30*60*1000);
        }




        //*****************************************************************************************************************************
        //=============================================================================================================================
        //处理脚本结束，以下为调用的函数
        //=============================================================================================================================
        //*****************************************************************************************************************************
        //打开查询sql生成数据的窗口
        function openSqlQueryDateWindow(title, dataStr,sql) {
            const cols = dataStr.split('\n')[0].split(',');
            const rows = dataStr.trim().split('\n').slice(1);
            // 创建新窗口
            const tableWin = window.open('', '_blank');
            // 构建表格 HTML
            const tableHtml = `
    <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            position: relative;
          }

          #table-con {
            margin-bottom: 40px;
          }

          #export-button {
            position: fixed;
            right: 20px;
            bottom: 20px;
            z-index: 100;
            background-color: blue;
            color: white;
            border: none;
            padding: 10px;
            cursor: pointer;
          }
          table {
            font-size:10px;
            border-collapse: collapse;
            width: 100%;
          }

          th, td {
            padding: 8px;
            text-align: left;
            border: 1px solid #ddd;
          }

          th {
            background-color: #f2f2f2;
            position: sticky;
            top: 0;
          }


        thead {
        display: table-header-group;
        }

        tbody {
        display: table-row-group;
        overflow-y: scroll;
        height: 300px;
        }
        </style>
      </head>
      <body>
        <pre id="sql">${sql}</pre>
        <div id="table-con">
        <table>
          <thead>
            <tr>
              ${cols.map(col => `<th colspan='1'>${col}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${rows.map(row => `
              <tr>
                ${row.split(',').map(cell => `<td>${cell.replace(/，/g,",")}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
        </div>
        <button id="export-button" onclick="exportTable()">导出为CSV</button>
        <script>
          /*function tableToCsv(table) {
            const rows = Array.from(table.querySelectorAll("tr"));
            const csv = rows.map(row => {
              const cells = Array.from(row.querySelectorAll("td, th"));
              return cells.map(cell => cell.textContent.replace(/,/g, '，')).join(",");
            }).join('\\n');
            return csv;
          }*/

          function containsNumberGreaterThanTenDigits(str) {
            // 检查字符串中是否存在大于10位的纯整数，并且后面的字符都是数字
            let count = 0; // 计数器，用于记录连续数字的个数
          
            for (let i = 0; i < str.length; i++) {
              const char = str[i];
          
              if (char >= '0' && char <= '9') {
                count++;
          
                if (count > 10) {
                  if (i + 1 === str.length) {
                    return true; // 字符串结束，返回true
                  }
          
                  // 检查后面的字符是否都是数字
                  for (let j = i + 1; j < str.length; j++) {
                    if (str[j] < '0' || str[j] > '9') {
                      return false; // 后面的字符不是数字，返回false
                    }
                  }
          
                  return true; // 存在大于10位的纯整数，并且后面的字符都是数字，返回true
                }
              } else {
                count = 0; // 重置计数器
                return false; 
              }
            }
          
            return false; // 没有找到大于10位的纯整数，并且后面的字符都是数字，返回false
          }
        

          function tableToCsv(table) {
            const regex = /\b\d{11,}\b/g; // 这是你的正则表达式  
            const rows = Array.from(table.querySelectorAll("tr"));
            const csv = rows.map(row => {
              const cells = Array.from(row.querySelectorAll("td, th"));
              return cells.map(cell => {
                const content = cell.textContent.replace(/,/g, '，');
                if (containsNumberGreaterThanTenDigits(content)) { // 判断大于10位数字
                    console.log("1->"+typeof(content)+"-"+content);
                  return content + '\t'; // 添加制表符
                } else {
                    //console.log("2->"+typeof(content)+"-"+content);
                  return content ;
                }
              }).join(",");
            }).join('\\n');
            return csv;
          }
          function exportTable() {
            const fileName = '${title}.csv';
            const table = document.querySelector("table");
            let sql = document.getElementById("sql");
            if (sql==null) {sql="";} else {sql=sql.innerText.replace(/,/g, '，');}
            const csvContent = "data:text/csv;charset=utf-8," + '\uFEFF' +sql+"\\n注意：导出是逗号分隔的csv文件，为避免SQL语句和字段内容中有逗号 导致的错列，会将SQL语句和字段中有逗号的转成全角的逗号；可用excel打开后请全文查找全角的逗号替换成半角的逗号。\\n" \ 
                  + tableToCsv(table);
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', fileName);
            document.body.appendChild(link); // Required for FF
            link.click();
          }
        </script>
      </body>
    </html>
        `;

        // 写入 HTML 并打开新窗口
        tableWin.document.write(tableHtml);
        }
            
        //返回按钮位置
        function getBtnLeft(textBtn){
            var w=19; //每个字宽度
            var s=370; //起始位置
            switch (textBtn) {
                case '＜'          : return "310px";
                case 'input_sql'   : return "341px";
                case '<=调整'       : return s.toString()+"px";
                case '隐藏提示'     : return parseInt((s+3*w)).toString()+"px";
                case '获取列名'     : return parseInt((s+(3+4)*w)).toString()+"px";
                case '字体放大'     : return parseInt((s+(3+4+4)*w)).toString()+"px";
                case '暗色'         : return parseInt((s+(3+4+4+4)*w)).toString()+"px";
                case '保存'         : return parseInt((s+(3+4+4+4+2)*w)).toString()+"px";
                case '表结构'       : return parseInt((s+(3+4+4+4+2+2)*w)).toString()+"px";
                case '导出日志'     : return parseInt((s+(3+4+4+4+2+2+3)*w)).toString()+"px";
                case '--'          : return parseInt((s+(3+4+4+4+2+2+3+4)*w)).toString()+"px";
                case 'X--'         : return  parseInt((s+(3+4+4+4+2+2+3+4+1.5)*w)).toString()+"px";
                case '存流程'         : return  parseInt((s+(3+4+4+4+2+2+3+4+1.5+2)*w)).toString()+"px";
                case '\\"'         : return  parseInt((s+(3+4+4+4+2+2+3+4+1.5+2+3)*w)).toString()+"px";
                case 'X\\"'         : return  parseInt((s+(3+4+4+4+2+2+3+4+1.5+2+3+1.5)*w)).toString()+"px";
                default: return "1000px";
            }
            return "1200px";
        }

        //*************************************
        //选中文本 增加注释 
        // https://blog.51cto.com/u_15309652/3154736
        //*************************************
        function addComment(){
            //获取选择的文本
            let i,byclass=document.getElementsByClassName("CodeMirror"), editors=[]
            for(i=0;i< byclass.length;i++){
                let cm=byclass[i]. CodeMirror
                if(cm) {editors.push(cm);}
            }
            let txt="";
            for (i=0;i<editors.length;i++){
                txt=editors[i].getSelection();
                if (txt.length>0) {
                    let txts=txt.split("\n");
                    let j=0,txtAdd="";
                    for (j=0;j<txts.length;j++) {
                        //if (txts[j].substring(0,2) != "--") {
                            if (j==txts.length-1) {
                                txtAdd=txtAdd+"--"+txts[j];}
                            else {
                                txtAdd=txtAdd+"--"+txts[j]+"\n";}
                        //}
                        //else {
                        //    if (j==txts.length-1) {
                        //        txtAdd=txtAdd+txts[j];}
                        //    else {
                        //        txtAdd=txtAdd+txts[j]+"\n";}
                        //}
                    }
                    editors[i].replaceSelection(txtAdd);
                    break;//找到选中文本，则退出
                }
            }
        }
        //*************************************
        //选中文本 取消注释 
        // https://blog.51cto.com/u_15309652/3154736
        //*************************************
        function delComment(){
            //获取选择的文本
            let i,byclass=document.getElementsByClassName("CodeMirror"), editors=[]
            for(i=0;i< byclass.length;i++){
                let cm=byclass[i]. CodeMirror
                if(cm) {editors.push(cm);}
            }
            let txt="";
            for (i=0;i<editors.length;i++){
                txt=editors[i].getSelection();
                if (txt.length>0) {
                    let txts=txt.split("\n");
                    let j=0,txtAdd="";
                    for (j=0;j<txts.length;j++) {
                        if (txts[j].substring(0,2) == "--") {
                            if (j==txts.length-1) {
                                txtAdd=txtAdd+txts[j].substring(2);}
                            else {
                                txtAdd=txtAdd+txts[j].substring(2)+"\n";}
                        }
                        else {
                            if (j==txts.length-1) {
                                txtAdd=txtAdd+txts[j];}
                            else {
                                txtAdd=txtAdd+txts[j]+"\n";}
                        }
                    }
                    editors[i].replaceSelection(txtAdd);
                    break;//找到选中文本，则退出
                }
            }
        }


        //*************************************
        //选中文本 增加转义 
        //*************************************
        function addESC(){
            //获取选择的文本
            let i,byclass=document.getElementsByClassName("CodeMirror"), editors=[]
            for(i=0;i< byclass.length;i++){
                let cm=byclass[i]. CodeMirror
                if(cm) {editors.push(cm);}
            }
            let txt="";
            for (i=0;i<editors.length;i++){
                txt=editors[i].getSelection();
                if (txt.length>0) {
                    txt=txt.replace(/\\\"/g,'"') ;//先去掉转义符，避免重复增加
                    txt=txt.replace(/\"/g,'\\"');//增加转义符	
                    editors[i].replaceSelection(txt);
                    break;//找到选中文本，则退出
                }
            }
        }
        
        //*************************************
        //选中文本 取消转义 
        //*************************************
        function delESC(){
            //获取选择的文本
            let i,byclass=document.getElementsByClassName("CodeMirror"), editors=[]
            for(i=0;i< byclass.length;i++){
                let cm=byclass[i]. CodeMirror
                if(cm) {editors.push(cm);}
            }
            let txt="";
            for (i=0;i<editors.length;i++){
                txt=editors[i].getSelection();
                if (txt.length>0) {
                    txt=txt.replace(/\\\"/g,'"') ;//去掉转义符
                    editors[i].replaceSelection(txt);
                    break;//找到选中文本，则退出
                }
            }
        }


        //*************************************
        //保存当前编辑的流程
        //*************************************
        // function countChars(str, char) {
        //     // 使用正则表达式将字符串按照特定字符分割成数组，数组长度减 1 就是特定字符出现的次数
        //     return str.split(new RegExp(char, "g")).length - 1;
        //   }
        //   console.log(countChars("11111******3332222",String.fromCharCode(42)));
        //同步执行获取扩展code
        //https://zhuanlan.zhihu.com/p/427913027?utm_medium=social&utm_oi=911220965541822464&utm_psn=1639057037182103552&utm_source=wechat_session
        //查询节点的扩展属性 getExtNode(id  调用身份标识,tmp_title 父流程标题,tmp_code 父流程代码,'InfoPointNodeExt')
        //查询定时器 getExtNode(id  调用身份标识,'',tmp_code 流程id,'TimeTrigger')
        //查询输出表 getExtNode(id  调用身份标识,'',tmp_code 节点id,'NodeOutputName')
        function getExtNode(id,tmp_title,tmp_code,reqType){
            return new Promise((resolve, reject) => {
               
                if (1==1) {
                    ///////////////////////////////
                    //第三步：查询节点扩展信息代码 start
                    
                    var url_getNodeExtCode="";
                    var body="";
                    switch (reqType) {
                    case "InfoPointNodeExt":
                        url_getNodeExtCode=`http://${g_ServIp}/v1/dataworks/InfoPointNodeExt/QueryActive`;
                        var r2=JSON.parse(tmp_code);
                        //调用获取代码  "body": "{\"page\":{\"index\":1,\"size\":100000},\"params\":{\"nodeId\":43459}}",
                        body="{\"page\":{\"index\":1,\"size\":99999},\"params\":{\"nodeId\":"+r2.nodeId+"}}";
                        break;
                    case "TimeTrigger":
                        url_getNodeExtCode=`http://${g_ServIp}/v1/dataworks/TimeTrigger/QueryActive`;
                        //调用获取代码 "body": "{\"page\":{\"index\":1,\"size\":999999},\"params\":{\"flowId\":7061980973121536}}",
                        body="{\"page\":{\"index\":1,\"size\":99999},\"params\":{\"flowId\":"+tmp_code+"}}";
                        //console.log(body);
                        break;
                    case "NodeOutputName":
                        url_getNodeExtCode=`http://${g_ServIp}/v1/dataworks/NodeOutputName/QueryActive`;
                        //调用获取代码 "body": "{\"params\":{\"nodeId\":262908},\"page\":{\"size\":99999}}",
                        body="{\"params\":{\"nodeId\":"+tmp_code+"},\"page\":{\"size\":99999}}";
                        //console.log(body);
                        break;
                    }
                    
                    //console.log(r2);
                    //console.log(r2.nodeId);
                    //console.log(body);
                    GM_xmlhttpRequest({
                        method: "POST",
                        mode:"cors",
                        credentials:"include",
                        referrer: `http://${g_ServIpReferrer}/`,
                        referrerPolicy: "strict-origin-when-cross-origin",
                        data:body,
                        url: url_getNodeExtCode,
                        headers:  {
                            "accept": "application/json, text/plain, */*",
                            "accept-language": "zh-CN,zh;q=0.9",
                            "appid": id.access_token,
                            "authorization": id.access_token,
                            "content-type": "application/json;charset=UTF-8",
                            "sign": id.access_token
                        },
                        onload: function(xhr){
                            //console.log(xhr.responseText);
                            resolve(xhr.responseText);
                        },
                        onerror : function(err){
                            sync_result=err;
                            console.log('error');
                            console.log(err);
                        }
                    });
                }
            }).then(res=>{
                //console.log(res);
                switch (reqType) {
                case "InfoPointNodeExt":
                    var  r=JSON.parse(res);
                    var  dataExt=r.body.data;
                    //console.log(r);
                    var nodeExtCode='\n';
                    nodeExtCode+="sysName | moduleName | dbName | tableName  | cityId\n"
                    for (let ii=0 ;ii<dataExt.length;ii++) {
                        nodeExtCode=nodeExtCode+""+dataExt[ii].sysName+" | "+dataExt[ii].moduleName+" | "+dataExt[ii].dbName+" | "+dataExt[ii].tableName+" | "+dataExt[ii].cityId+"\n";
                    }
                    //console.log(nodeExtCode);
                    sync_diagramData=sync_diagramData+tmp_title+tmp_code+"\n"+nodeExtCode+"\n\n";
                    break;
                case  "TimeTrigger":
                    r=JSON.parse(res);//.responseText);
                    var nodes_json=r.body.data;
                    var no2=0;
                    var tmp_trigger="";
                    var cron,crons;    
                    //console.log(nodes_json);
                    for(var i=0;i<nodes_json.length;i++){//遍历数组时，i为索引
                        no2=no2+1;
                        //console.log(nodes_json);
                        tmp_trigger=tmp_trigger+"\n"+"*".repeat(60)+"\n* 触发器"+""+"->";
                        tmp_trigger=tmp_trigger+" "+nodes_json[i].triggerNameCn+" ("+nodes_json[i].triggerName+")"+"\n"+"*".repeat(60)+"\n";
                        tmp_trigger=tmp_trigger+"生成方式："+nodes_json[i].instanceMethod+"\n";
                        tmp_trigger=tmp_trigger+"调度周期："+scheduleCycleTypes[nodes_json[i].scheduleCycle]+"\n"; //S0D日  S0M月 S0Y年 S0W星期 S0H小时  S0F分
                        tmp_trigger=tmp_trigger+"重试次数："+nodes_json[i].retryTimes+"\n"; 
                        tmp_trigger=tmp_trigger+"生效日期："+nodes_json[i].effDate+"\n"; 
                        tmp_trigger=tmp_trigger+"失效日期："+nodes_json[i].expTime+"\n"; 
                        if (nodes_json[i].triggerType=='T0A') {
                            tmp_trigger=tmp_trigger+"触发类型：定时\n";  //T0A 定时 T0B 手动
                        }else {
                            tmp_trigger=tmp_trigger+"触发类型：手动\n";  //T0A 定时 T0B 手动
                        }
                        cron=nodes_json[i].cron;
                        crons=cron.split(" ");
                        //tmp_trigger=tmp_trigger+"cron："+cron+"\n"; 
                        //   分：0 * * * * ?
                        // 小时：0 分钟 * * * ?
                        //   天：0 分钟 小时 * * ?
                        //   月：0 分钟 小时 日 * ?
                        //   年：0 分钟 小时 日 月 ?
                        // 星期：0 分钟 小时 ? * 星期几(周日1 周一2 ... 周六7)
                        if (crons[5]=='?') { //非星期
                            switch((cron.match(/\*/g) || []).length) { //统计cron有多少*
                                case 0:
                                    tmp_trigger=tmp_trigger+  `定时调度：按年 -> 月(${crons[4]})  ,  日(${crons[3]})  ,  时(${crons[2]})  ,  分(${crons[1]})    ,   ${cron}\n`; 
                                    break;
                                case 1:
                                    tmp_trigger=tmp_trigger+  `定时调度：按月 -> 日(${crons[3]})  ,  时(${crons[2]})  ,  分(${crons[1]})   ,   ${cron}\n`; 
                                    break;
                                case 2:
                                    tmp_trigger=tmp_trigger+  `定时调度：按天 -> 时(${crons[2]})  ,  分(${crons[1]})   ,  ${cron}\n`; 
                                    break;
                                case 3:
                                    tmp_trigger=tmp_trigger+`定时调度：按小时 -> 分(${crons[1]})    ,   ${cron}\n`; 
                                    break;
                                case 4:
                                    tmp_trigger=tmp_trigger+`定时调度：按分钟 -> 每分钟    ,   ${cron}\n`; 
                                    break;
                            }
                        } else {  //星期
                            tmp_trigger=tmp_trigger+        `定时调度：按星期 -> 星期(${crons[5]}<周日1 周一2 ... 周六7>)   ,  时(${crons[2]})  ,  分(${crons[1]})   ,   ${cron}\n`; 
                        }
                        tmp_trigger=tmp_trigger+"参数及值："+nodes_json[i].instanceParams+"\n"; 
                        tmp_trigger=tmp_trigger+"忽略节点："+nodes_json[i].extraFunctionConf+"\n"; 
                        }
                    sync_diagramData=sync_diagramData+"\n"+tmp_trigger+"\n\n";
                    break;
                case  "NodeOutputName":
                    try {
                        r=JSON.parse(res);//.responseText);
                        var nodes_json=r.body.data;
                        var no3=0;
                        var xh=1;
                        var tmp_NodeOutputName="";
                        //console.log(nodes_json);
                        for(var i=0;i<nodes_json.length;i++){//遍历数组时，i为索引
                            no3=no3+1;
                            //console.log(nodes_json);
                            if (nodes_json[i].createId!=1 && nodes_json[i].createId!=100000) { //1时输出标题  100000是系统创建
                                //outputName : "zone_hz.zjf_test2" outputTableName : "zone_hz.zjf_test2"
                                tmp_NodeOutputName=tmp_NodeOutputName+tmp_title+" 输出表"+xh+"(名称 表名):  "+nodes_json[i].outputName+" "+nodes_json[i].outputTableName+"\n";
                                xh=xh+1;

                            }
                        }
                        if (tmp_NodeOutputName!="") {
                            sync_diagramData=sync_diagramData+"\n"+tmp_NodeOutputName+"\n\n";
                        }
                    } catch (error) {
                        //console.log("出现异常: " + error.message);
                        ;
                    }
                    break;
                }
            })
        }
        async function GetPromiseAndWait_getExtNode(id,tmp_title,tmp_code,reqType){
        let text=await getExtNode(id,tmp_title,tmp_code,reqType)
        return text
        }
        function WantGetFinallyText_getExtNode(id,tmp_title,tmp_code,reqType){
            let data=GetPromiseAndWait_getExtNode(id,tmp_title,tmp_code,reqType)

        }
        //test    WantGetFinallyText_getExtNode(id,tmp_title,tmp_code);

        //查找password关键字并将关键字后面的密码改成*
        function passwd_mask(str,password_key) {
            var pos,str_prefix,str_suffix,str_result,sw_mask
            while (1==1) {
                pos = str.indexOf(password_key);
                //console.log(pos);
                if (pos>=0) {
                    str_prefix=str.substr(0,pos+9)+' '+password_key.substr(-1);  
                    str_suffix=str.substr(pos+10);
                    str_result=""
                    sw_mask=1
                    for (var i=0;i<str_suffix.length;i++){
                        if ( str_suffix[i]==password_key.substr(-1)  ) {sw_mask=0;}
                        if (sw_mask==0) {str_result=str_result+str_suffix[i]; } else {str_result=str_result+"*";}
                    }
                    str=str_prefix+str_result; 
                }
                else {break;}
            }    
            return str;
        }

        //保存流程编辑窗口为pdf
        function SaveToPDF(filename_png){
            var canvas = document.getElementsByTagName("canvas"); //document.getElementById("my-canvas");
            for(var i=0;i<canvas.length;i++) {
                if(i>0)  {
                    canvas[i].toBlob(function(blob) {
                        saveAs(blob, filename_png+".png");
                    });
                }
            }
            return;
        };
        //保存流程
        function saveFlow(){
            //alert("保存当前流程");
            var url=`http://${g_ServIp}/v1/dataworks/BusiFlow/QueryActive`;
            var id= JSON.parse(sessionStorage.getItem("storeGlobal.token"));
            var proj=JSON.parse(sessionStorage.getItem("storeGlobal.currentProject"));
            var user=JSON.parse(sessionStorage.getItem("storeGlobal.loginUser"));
            var role=JSON.parse(sessionStorage.getItem("storeGlobal.currentRole"));
            var currentBusiFlow4UpdateFlowLock=JSON.parse(sessionStorage.getItem("currentBusiFlow4UpdateFlowLock"));
            var engineAccount=proj.engineAccount;
            var body ;
            if ( id!=null && proj!=null && user!=null && role!=null) {
                //"body": "{\"page\":{\"index\":1,\"size\":999999},\"params\":{\"flowId\":7059826783150080}}",
                body= "{\"page\":{\"index\":1,\"size\":999999},\"params\":{\"flowId\":"+currentBusiFlow4UpdateFlowLock.flowId+"}}";
                //console.log("body:"+body);
                //第一步：先取流程名称
                GM_xmlhttpRequest({
                    method: "POST",
                    mode:"cors",
                    credentials:"include",
                    referrer: `http://${g_ServIpReferrer}/`,
                    referrerPolicy: "strict-origin-when-cross-origin",
                    data:body,
                    url: url,
                    headers:  {
                        "accept": "application/json, text/plain, */*",
                        "accept-language": "zh-CN,zh;q=0.9",
                        "appid": id.access_token,
                        "authorization": id.access_token,
                        "content-type": "application/json;charset=UTF-8",
                        "sign": id.access_token
                    },
                    onload: function(res){
                        sync_status=res.status;
                        if(sync_status == 200){
                            var r=JSON.parse(res.responseText);
                            //console.log(r);
                            sync_flowNameCn=r.body.data[0].flowNameCn;
                            sync_flowName=r.body.data[0].flowName;
                            sync_diagramData="##################################################\n# 流程名称: "+sync_flowNameCn+" ("+sync_flowName+")\n##################################################\n";
                            sync_message=r.body.data[0].message;
                            console.log("流程名称："+sync_flowNameCn);

                                        
                                        
                            //第二步：获取定时配置
                            WantGetFinallyText_getExtNode(id,'',currentBusiFlow4UpdateFlowLock.flowId,'TimeTrigger');
                            //等2S
                            setTimeout(() => { 
                                var jj;                            
                            }, 1000);

                            //第三步：获取各节点的代码
                            url=`http://${g_ServIp}/v1/dataworks/Node/QueryActive`;
                            //"body": "{\"page\":{\"index\":1,\"size\":999999},\"params\":{\"flowId\":7061135028666368}}"
                            body= "{\"page\":{\"index\":1,\"size\":999999},\"params\":{\"flowId\":"+currentBusiFlow4UpdateFlowLock.flowId+"}}";
                            GM_xmlhttpRequest({
                                method: "POST",
                                mode:"cors",
                                credentials:"include",
                                referrer: `http://${g_ServIpReferrer}/`,
                                referrerPolicy: "strict-origin-when-cross-origin",
                                data:body,
                                url: url,
                                headers:  {
                                    "accept": "application/json, text/plain, */*",
                                    "accept-language": "zh-CN,zh;q=0.9",
                                    "appid": id.access_token,
                                    "authorization": id.access_token,
                                    "content-type": "application/json;charset=UTF-8",
                                    "sign": id.access_token
                                },
                                onload: function(res){
                                    sync_status=res.status;
                                    if(sync_status == 200){
                                        r=JSON.parse(res.responseText);
                                        var nodes_json=r.body.data;
                                        var no=0;
                                        var tmp_code="";
                                        var tmp_title="";
                                        var flow_node_title="";
                                        for(var i=0;i<nodes_json.length;i++){//遍历数组时，i为索引
                                            if (!(nodes_json[i].nodeTypeId=='12' || nodes_json[i].nodeTypeId=='13')) {
                                                //console.log(nodes_json[i].nodeTypeId+" "+nodes_json[i].nodeNameCn+"  "+nodeTypes[nodes_json[i].nodeId)];
                                                //console.log(window.decodeURIComponent(window.atob(nodes_json[i].nodeContent)));
                                                //nodes_json[i].nodeTypeId  "5": "HSQL","6": "SHELL","29": "PYTHON3",
                                                no=no+1;
                                                if (/^\d{2}/.test(nodes_json[i].nodeNameCn)) {  //判断流程节点前两位是否数字，如数字不用加入编号，否则增加编号
                                                    //console.log("前两位为数字");
                                                    flow_node_title=nodes_json[i].nodeNameCn
                                                } else {
                                                    //console.log("前两位不为数字");
                                                    if (/^\d/.test(nodes_json[i].nodeNameCn)) { //第1位为数字
                                                        flow_node_title=no.toString().padStart(2, '0')+"_"+nodes_json[i].nodeNameCn
                                                    } else {
                                                        flow_node_title=no.toString().padStart(2, '0')+nodes_json[i].nodeNameCn
                                                    }
                                                }
                                                switch (nodes_json[i].nodeTypeId) {
                                                case 5: //HSQL
                                                    tmp_title="\n-- "+"*".repeat(60)+"\n-- * No."+no+"->";
                                                    if (nodes_json[i].nodeParams!="{}") {
                                                        tmp_title=tmp_title+" "+flow_node_title+" ("+nodes_json[i].nodeName+")"+"   参数: "+nodes_json[i].nodeParams+"\n-- "+"*".repeat(60)+"\n";
                                                    } else {
                                                        tmp_title=tmp_title+" "+flow_node_title+" ("+nodes_json[i].nodeName+")"+"\n-- "+"*".repeat(60)+"\n";
                                                    }
                                                    break;
                                                case 6: //shell
                                                    tmp_title="\n# "+"*".repeat(60)+"\n# * No."+no+"->";
                                                    if (nodes_json[i].nodeParams!="{}") {
                                                        tmp_title=tmp_title+" "+flow_node_title+" ("+nodes_json[i].nodeName+")"+"   参数: "+nodes_json[i].nodeParams+"\n# "+"*".repeat(60)+"\n";
                                                    } else {
                                                        tmp_title=tmp_title+" "+flow_node_title+" ("+nodes_json[i].nodeName+")"+"\n# "+"*".repeat(60)+"\n";
                                                    }
                                                    break;
                                                case 29: //PYTHON3
                                                    tmp_title="\n# "+"*".repeat(60)+"\n# * No."+no+"->";
                                                    if (nodes_json[i].nodeParams!="{}") {
                                                        tmp_title=tmp_title+" "+flow_node_title+" ("+nodes_json[i].nodeName+")"+"   参数: "+nodes_json[i].nodeParams+"\n# "+"*".repeat(60)+"\n";
                                                    } else {
                                                        tmp_title=tmp_title+" "+flow_node_title+" ("+nodes_json[i].nodeName+")"+"\n# "+"*".repeat(60)+"\n";
                                                    }
                                                    break;
                                                default:
                                                    tmp_title="\n**"+"*".repeat(60)+"\n*** No."+no+"->";
                                                    tmp_title=tmp_title+" "+flow_node_title+" ("+nodes_json[i].nodeName+")"+"\n**"+"*".repeat(60)+"\n";
                                                }
                                                //sync_diagramData=sync_diagramData+nodes_json[i].nodeNameCn+"("+nodes_json[i].nodeName+")  NodeType:"+nodeTypes[ nodes_json[i].nodeTypeId ]+"\n"+"*".repeat(60)+"\n";
                                                
                                                tmp_code=window.decodeURIComponent(window.atob(nodes_json[i].nodeContent));
                                                tmp_code=passwd_mask(tmp_code,"password='");  //将单引号密码打*
                                                tmp_code=passwd_mask(tmp_code,"password=\""); //将双引号密码打*
                                                tmp_code=passwd_mask(tmp_code,"PASSWORD='");  //将单引号密码打*
                                                tmp_code=passwd_mask(tmp_code,"PASSWORD=\""); //将双引号密码打*
                                                if (nodes_json[i].nodeTypeId=='30') {  //获取上游依赖检查
                                                    WantGetFinallyText_getExtNode(id,tmp_title,tmp_code,'InfoPointNodeExt');
                                                }
                                                else
                                                {
                                                sync_diagramData=sync_diagramData+tmp_title+tmp_code+"\n\n";
                                                }
                                                //获取HSQL和Python3 的输出表   NodeOutputName
                                                if (nodes_json[i].nodeTypeId==5 || nodes_json[i].nodeTypeId==29) {
                                                    WantGetFinallyText_getExtNode(id,tmp_title,nodes_json[i].nodeId,'NodeOutputName');
                                                }
                                            }
                                        }

                                        //等8S存盘
                                        alert("提示：存流程需要10秒左右，点击开始保存，请耐心等待，注意不要重复多次点击存流程按钮。");
                                        setTimeout(() => { 
                                            var log_d=new Date();
                                            console.log("存文件");
                                            var filename="流程_"+sync_flowNameCn+"_"+dateFormat("yyyy-mm-dd HHMMSS",log_d)+".txt";
                                            var filename_png="流程_"+sync_flowNameCn+"_"+dateFormat("yyyy-mm-dd HHMMSS",log_d);
                                            var file_json = new File([sync_diagramData], filename, { type: "text/plain;charset=utf-8" });
                                            saveAs(file_json);
                                            SaveToPDF(filename_png);
                                            my_log("已获取最后编辑的流程("+sync_flowNameCn+")");
                                        } , 8000);
                                    }
                                },
                                onerror : function(err){
                                    sync_result=err;
                                    console.log('error');
                                    console.log(err);
                                }
                            });



                        }else{
                            sync_result=res.responseText;
                            sync_message=r.body.data[0].message;
                            //console.log(res);
                        }
                    },
                    onerror : function(err){
                        sync_result=err;
                        console.log('error');
                        console.log(err);
                    }
                });
            }
            else {my_log("连接hive失败，可能服务器已断掉连接,需重新进入系统.");}
        }

        //*************************************
        /*  首页重新加载，避免超时被系统退出  */
        //*************************************
        function homepageReload(){
            var home=document.querySelector("li[role='menuitem']");
            if (home!=null){home.click();} //进入首页
            var d=Date();
            var date=new Date();
            var hour=date.getHours();
            my_log(d+":首页定时重新加载,避免重新登录.");
            if (hour>=6 && hour<=22) {
                window.location.reload(true);
            }
        }


        //*************************************
        /* 自助查询刷新，避免超时退出 */
        //*************************************
        function sqlpageReload(){
            //和服务器通信，避免退出
            var url=`http://${g_ServIp}/v1/dw/Hive/Query/Sync`;
            var id= JSON.parse(sessionStorage.getItem("storeGlobal.token"));
            var proj=JSON.parse(sessionStorage.getItem("storeGlobal.currentProject"));
            var user=JSON.parse(sessionStorage.getItem("storeGlobal.loginUser"));
            var role=JSON.parse(sessionStorage.getItem("storeGlobal.currentRole"));
            var engineAccount=proj.engineAccount;
            var body ;
            if (1==2 && id!=null && proj!=null && user!=null && role!=null) {
                body= "{\"projectId\":"+proj.projectId+",\"operatorId\":"+user.userId+",\"limit\":100,\"clusterId\":"+proj.clusterId+",\"user\":\""+engineAccount+"\",\"dbName\":\""+engineAccount+"\",\"sql\":\"c2VsZWN0JTIwY3VycmVudF90aW1lc3RhbXAoKSUwQQ==\"}";
                //console.log("body:"+body);
                GM_xmlhttpRequest({
                    method: "post",
                    mode:"cors",
                    credentials:"omit",
                    referrer: `http://${g_ServIpReferrer}/`,
                    referrerPolicy: "strict-origin-when-cross-origin",
                    data:body,
                    url: url,
                    headers:  {
                        "accept": "application/json, text/plain, */*",
                        "accept-language": "zh-CN,zh;q=0.9",
                        "appid": id.access_token,
                        "authorization": id.access_token,
                        "content-type": "application/json;charset=UTF-8",
                        "iap-role-id": role.roleId,
                        "sign": id.access_token
                    },
                    onload: function(res){
                        if(res.status === 200){
                            console.log('自助查询刷新成功:'+url);
                            var r=JSON.parse(res.responseText);
                            //console.log(res);
                            console.log("hive当前时间:"+r.body.data[0].result[0]._c0);
                            my_log("hive当前时间:"+r.body.data[0].result[0]._c0);
                        }else{
                            console.log('自助查询刷新失败:'+url);
                            console.log(res);
                        }
                    },
                    onerror : function(err){
                        console.log('error')
                        console.log(err)
                    }
                });
            }
            //else {my_log("连接hive失败，可能服务器已断掉连接,需重新进入系统.");}

            var url2=`http://${g_ServIp}/v1/main/UserRole/QueryActive`;
            if (id!=null && proj!=null && user!=null && role!=null) {
                body= "{\"page\":{\"index\":1,\"size\":1},\"params\":{\"roleType\":\"ALL\",\"userId\":"+user.userId+"},\"cascade\":true,\"sort\":[{\"field\":\"create_time\",\"type\":\"desc\"}]}";
                //console.log("body:"+body);
                GM_xmlhttpRequest({
                    method: "post",
                    mode:"cors",
                    credentials:"include",
                    referrer: `http://${g_ServIpReferrer}/`,
                    referrerPolicy: "strict-origin-when-cross-origin",
                    data:body,
                    url: url2,
                    headers:  {
                        "accept": "application/json, text/plain, */*",
                        "accept-language": "zh-CN,zh;q=0.9",
                        "appid": id.access_token,
                        "authorization": id.access_token,
                        "content-type": "application/json;charset=UTF-8",
                        "iap-role-id": role.roleId,
                        "sign": id.access_token
                    },
                    onload: function(res){
                        if(res.status === 200){
                            console.log('自助查询刷新成功:'+url2);
                            var r=JSON.parse(res.responseText);
                            if (r!=null) {
                                console.log(r.body.data);
                            }
                            //console.log(res);
                            //console.log("hive当前时间:"+r.body.data[0].result[0]._c0);
                            //my_log("hive当前时间:"+r.body.data[0].result[0]._c0);
                        }else{
                            console.log('自助查询刷新失败:'+url2);
                            console.log(res);
                        }
                    },
                    onerror : function(err){
                        console.log('error')
                        console.log(err)
                    }
                });
            }
            //else {my_log("连接hive失败，可能服务器已断掉连接,需重新进入系统.");}
        }


        //*************************************
        //定时保存脚本
        //*************************************
        function auto_save_sql() {
            var auto_d=new Date();

            var obj=getSql(false);
            var sql=obj.code;
            var filename=obj.filename;
            if (filename==""){
                filename="auto_save "+dateFormat("yyyy-mm-dd HHMMSS",auto_d);
            }
            else {
                filename="auto_save "+filename+dateFormat("yyyy-mm-dd HHMMSS",auto_d);
            }
            if(sql.length>0 ) {
                if (sql!=sql_saved) {
                    var file_sql = new File([sql], filename+".sql", { type: "text/plain;charset=utf-8" });
                    saveAs(file_sql);
                    my_log("自动将脚本保存到："+filename+".sql");
                    sql_saved=sql;
                }
                else {
                    my_log("由于未修改，本次不进行脚本自动保存.");
                }
            }
        }



        //*************************************
        //自助分析:在流程配置窗口，激活相关按钮
        //*************************************
        //返回时间戳对应的时间
        function getData(n) {
            let now = new Date(n),
                y = now.getFullYear(),
                m = now.getMonth() + 1,
                d = now.getDate();
            //return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + now.toTimeString().substr(0, 8);
            return now.toTimeString().substr(0, 8);
        }
        //返回现在距离时间戳的分钟数
        function diffTime(n) {
            var date1= new Date();//开始时间
            var date2 = new Date(n);//结束时间
            var date3 = date2.getTime() - new Date(date1).getTime();//时间差的毫秒数
            //------------------------------
            //计算出相差天数
            var days=Math.floor(date3/(24*3600*1000))
            //计算出小时数
            var leave1=date3%(24*3600*1000);//计算天数后剩余的毫秒数
            var hours=Math.floor(leave1/(3600*1000))
            //计算相差分钟数
            var leave2=leave1%(3600*1000);//计算小时数后剩余的毫秒数
            var minutes=Math.floor(leave2/(60*1000))
            //计算相差秒数
            var leave3=leave2%(60*1000);//计算分钟数后剩余的毫秒数
            var seconds=Math.round(leave3/1000)
            //alert(" 相差 "+days+"天 "+hours+"小时 "+minutes+" 分钟"+seconds+" 秒")
            return days*60*24+hours*60+minutes;
        }

        //流程监控页面的table的列会变化，该函数找出开始的table数字和列数字，如el-table_13_column_50，返回(13,50)
        function getProcessTableStart() {
            var divHead=document.getElementsByClassName("el-table__header");
            var tableStartColNames="";
            var startTable=1,startCol=1;
            try {
                if (divHead.length>0 ){
                    tableStartColNames=divHead[0].children[0].children[0].getAttribute("name");
                }
                if (tableStartColNames.indexOf("el-table_")>-1 ) {  //示例'el-table_13_column_50'
                    var tmp_s=tableStartColNames.split("_");
                    if (tmp_s.length==4) {
                        startTable=Number(tmp_s[1]);
                        startCol=Number(tmp_s[3]);
                    }
                }
            }
            catch(err){ //报错返回默认值
                tableStartColNames=""
            }
            return new Array(startTable,startCol)
        }
            

        function timeProc(){
        try {
            clearInterval(g_timer); //暂停定时器执行

            var myDate = new Date();
            var sec=myDate.getSeconds();
            let l_myIp=sessionStorage.getItem("currentLoginIp"); //获取本机ip
            if (l_myIp==null ) {l_myIp="";}
            if (document.getElementsByClassName("el-container").length>0) {//判断是否在流程编辑窗口
                isFlowNode=true;
            } else  {
                isFlowNode=false;
            }  
            if ((sec%10)==0){ //10秒执行一次
                
                if (l_myIp.indexOf(g_allowSaveIP) != -1) {
                    var sql_result=document.querySelector("#sql_result");
                    sql_result.style.display="";
                }
                //修改标题
                var title=document.querySelector("title");
                if (title!=null){title.innerText=title_str;}

                //修改编辑器行高
                GM_addStyle(codeCSS);

                //获取token生效时间并显示
                let tk= JSON.parse(sessionStorage.getItem("storeGlobal.token"));
                //console.log("剩下分钟数:"+diffTime(tk.expires_timestamp));
                my_log("会话到期时间是: "+getData(tk.expires_timestamp)+"")
                if (diffTime(tk.expires_timestamp)<=10 && alert_token==false)
                {
                    alert_token=true;
                    alert("距离会话失效不足十分钟了，请及时保存脚本。");
                }
            }
            //打开sql执行窗口，出现保存按钮
            //if (document.getElementById("btn_sql_result2")==null && l_myIp.indexOf(g_allowSaveIP) != -1 )
            if ( l_myIp.indexOf(g_allowSaveIP) != -1 ) {
                let spans = document.querySelectorAll('span');
                let targetSpan = Array.prototype.find.call(spans, span => span.textContent.trim()==='导出SQL'); 
           
                if (targetSpan ){
                    //生成表结构按钮
                    /*const btn_tableDesc2 = document.createElement('button');
                    btn_tableDesc2.textContent = '表结构';
                    btn_tableDesc2.className="el-button dw-button h29 el-button--primary el-button--mini is-disabled";
                    targetSpan.parentElement.insertAdjacentElement('afterend', btn_tableDesc2)
                    btn_tableDesc2.addEventListener('click', () => {
                      //console.log(`点击了 ${targetSpan.textContent} 后面的按钮`);
                      my_log("正在获取选中内容的表结构......");
                      tableDesc();
                      my_log("表结构获取完成");
                    });*/
                    //生成保存按钮
                    let btn_sql_result2 = document.createElement('button');
                    btn_sql_result2.textContent = '保存';
                    //btn_sql_result2.className="el-button dw-button h29 el-button--primary el-button--mini";
                    btn_sql_result2.className="el-button el-button--primary el-button--small";
                    //btn_sql_result2.id="btn_sql_result2"
                    targetSpan.parentElement.insertAdjacentElement('afterend', btn_sql_result2)
                    btn_sql_result2.addEventListener('click', () => {
                      //console.log(`点击了 ${targetSpan.textContent} 后面的按钮`);
                      getSqlResultWindow();
                      my_log("新窗口打开查询数据完成");
                    });
                    targetSpan.parentElement.innerText=targetSpan.parentElement.innerText+"."
                    
                }
            }
            //解决数据控制台查找省表时，看不全表名 el-autocomplete-suggestion el-popper
            var data_controls=document.getElementsByClassName("el-autocomplete-suggestion el-popper");
            for (let i_d=0;i_d<data_controls.length;i_d++) {
                if (data_controls[i_d].style.display!='none') {
                    data_controls[i_d].style.width='650px';
                }
            }
            //解决查看和新增上游依赖时，库名和表名太长显示不全时，难以选择的问题
            let rows,row,tds,div;
            //上游表依赖检查库名和表名自动换行
            rows=document.getElementsByClassName("el-table__row");
            for (let j=0;j<rows.length;j++) {
              row=rows[j];
              tds=row.getElementsByTagName("td");
              for (let i = 0; i < tds.length; i++) {
                div=tds[i].getElementsByTagName("div");
                div[0].style.whiteSpace = 'normal';
              }
            }
            
            //选择上游表库名和表名自动换行
            rows=document.getElementsByClassName("el-row");
            row=rows[rows.length-1];
            tds=row.getElementsByTagName("td");
            for (let i = 0; i < tds.length; i++) {
              div=tds[i].getElementsByTagName("div");
              div[0].style.whiteSpace = 'normal';
            }

            //调整代码框窗口大小
            if (isFlowNode) {
                let i,byclass=document.getElementsByClassName("CodeMirror"), editors=[]
                for(i=0;i< byclass.length;i++){
                    let cm=byclass[i]. CodeMirror
                    if(cm) {editors.push(cm);}
                }
                if (editors.length==2) {
                    //console.log("调整代码框大小");
                    let  scrollCtr=document.querySelectorAll("body > div.el-dialog__wrapper > div > div:nth-child(5)");
                    if(scrollCtr.length != 0) {
                        let edit_height=editors[0].getScrollInfo().clientHeight -  editors[0].display.barHeight -  editors[0].defaultTextHeight();
                        if (scrollCtr[0].clientHeight<edit_height+100) {
                            let result_edit_height
                            result_edit_height=edit_height-100;
                            //console.log(result_edit_height);
                            if (result_edit_height<=360) {result_edit_height=360;}
                            //console.log(result_edit_height);
                            editors[0].setSize(1000,result_edit_height);}
                        }
                }
            }
            //流程监控页面，如加载完成则处理
            var div_tit=document.getElementsByClassName("ud-crumb-tit");
            if (div_tit.length==2) {  
                if (div_tit[1].innerText.trim()=="流程监控"){  //流程监控页面
                    var proccessLoadFinish=document.getElementsByClassName("zjf_proccessLoadFinish");
                    var proccessTotal=document.getElementsByClassName("el-pagination__total");
                    if ( proccessTotal.length>0 && proccessLoadFinish.length==0 ) {
                        /*
                        //第一步处理：增加上一天时间按钮
                        //删除增加的上一天子节点
                        var div_add_lastDay=document.getElementsByClassName("zjf_lastDay_class");
                        while(div_add_lastDay.length>0) {
                                div_add_lastDay[0].remove();
                        }
                        var v_btns=document.getElementsByClassName("el-button el-tooltip el-button--primary el-button--mini");
                        if (v_btns!=null) {
                            var lastDay = document.createElement('div');
                            lastDay.innerHTML="<br>昨天";
                            lastDay.className="zjf_lastDay_class";
                            lastDay.style.textDecoration="underline";
                            lastDay.onclick=function(){
                                //var input_times=document.getElementsByClassName("el-range-input");  //[3].placeholder
                                //if (input_times!=null) {
                                //    for (let t=0;t<input_times.length;t++) {
                                //        input_times[t].value=t.toString();
                                //    }
                                var t_btns1=document.getElementsByClassName("el-input__icon el-range__close-icon");
                                if (t_btns1.length>1) {
                                    t_btns1[0].click();
                                    t_btns1[1].click();
                                }
                                var t_btns2=document.getElementsByClassName("el-picker-panel__shortcut");
                                if (t_btns2.length>5) {
                                    document.getElementsByClassName("el-picker-panel__shortcut")[1].click();
                                    document.getElementsByClassName("el-picker-panel__shortcut")[5].click();
                                }
                                this.click()
                            }; 
                            try {   
                            v_btns[0].append(lastDay);
                            }
                            catch(err) {
                                console.log("出现错误");
                            }
                        } */

                        //第二步：增加失败和运行中的日志查看按钮
                        if (document.getElementsByClassName("zjf_proccessLoadFinish").length==0){
                            var bz = document.createElement('div');
                            bz.className="zjf_proccessLoadFinish";
                            proccessTotal[0].append(bz);
                            console.log("程监控页面， 增加标志");
                        }
                        console.log("流程监控加载完成");
                        var starts=getProcessTableStart();
                        var procNames=document.getElementsByClassName("el-table_"+starts[0].toString()+"_column_"+    starts[1].toString()+"   el-table__cell");  //第1=starts[0]个表 第1=starts[1]列
                        var procIDs=  document.getElementsByClassName("el-table_"+starts[0].toString()+"_column_"+(starts[1]+1).toString()+"   el-table__cell");  //第2列
                        var divStatus=document.getElementsByClassName("el-table_"+starts[0].toString()+"_column_"+(starts[1]+3).toString()+"   el-table__cell");  //第4列

                        var status,procName,procID,url,url_id=0,url_href,nodeID;
                        //删除增加的子节点
                        var div_add=document.getElementsByClassName("zjf_errLog_class");
                        while(div_add.length>0) {
                            div_add[0].remove();
                        }
                        url=[];
                        url_href=[];
                        for (let i=0;i<divStatus.length;i++) {
                            status=divStatus[i].getElementsByClassName("cell")[0].innerText;
                            //console.log(status);
                            if (status.indexOf("失败")>-1 || status.indexOf("正在运行")>-1) {
                                procID=procIDs[i].getElementsByClassName("cell")[0].innerHTML;
                                nodeID="";
                                procName=procNames[i].getElementsByClassName("cell")[0].innerHTML;
                                console.log("找到有失败或正在运行的流程");
                                console.log(procID);
                                url[url_id] = document.createElement('div');
                                //url[url_id].innerHTML="<a href='"+"http://www.baidu.com?sn="+procID+"' target='_blank'>日志</a>";
                                if (status.indexOf("失败")>-1 ) {
                                    url[url_id].innerHTML="错误日志";}
                                else {
                                    url[url_id].innerHTML="正在运行日志";
                                }
                                url[url_id].className="zjf_errLog_class";
                                url[url_id].style.textDecoration="underline";
                                url[url_id].id=procName+"|"+procID+"|"+status+"|"+nodeID;
                                url[url_id].onclick=function(){
                                    var ids=this.id;
                                    var id,id_status,id_name,id_node;
                                    id_name=ids.split("|")[0]
                                    id=ids.split("|")[1]
                                    id_status=ids.split("|")[2]
                                    id_node=ids.split("|")[3]
                                    var result;
                                    var url_lookInstance=`http://${g_ServIp}/v1/dataworks/NodeInstance/QueryActive`
                                    var body;
                                    body="{\"page\":{\"index\":1,\"size\":99999},\"params\":{\"batchNo\":\""+id+"\"},\"cascade\":false}";
                                    //参考body= "{\"projectId\":"+proj.projectId+",\"operatorId\":"+user.userId+",\"limit\":100,\"clusterId\":"+proj.clusterId+",\"user\":\""+engineAccount+"\",\"dbName\":\""+engineAccount+"\",\"sql\":\""+send_sql+"\"}";
                                    //console.log(body);
                                    call_CDAP_Server('lookInstance',url_lookInstance,body,id_name,id_status);
                                    openDiag("提示","已提交请求，请等待服务器返回...")
                                };
                                divStatus[i].append(url[url_id]);
                                url_id=url_id+1;
                            }
                        }
                    }
                }
                else {  //非流程监控页面
                    var div_zjf_proccessLoadFinish=document.getElementsByClassName("zjf_proccessLoadFinish");
                    if (div_zjf_proccessLoadFinish.length>0) {
                        console.log("非流程监控页面（有标题），取消标志");
                        div_zjf_proccessLoadFinish[0].remove();
                    }  
                }

            }
            else {  //非流程监控页面
                var div_zjf_proccessLoadFinish=document.getElementsByClassName("zjf_proccessLoadFinish");
                if (div_zjf_proccessLoadFinish.length>0) {
                    console.log("非流程监控页面（无标题），取消标志");
                    div_zjf_proccessLoadFinish[0].remove();
                }
            }
            //结束定时返回
            return;
        }
        catch(err) {
            console.log("执行出现错误："+err.message+"\n"+err.stack);
        }
        finally {
            g_timer=setInterval(timeProc, g_refreshTime);
        }
        return;
            //以下废弃
            let div0=document.querySelector("div[data-v-01bcd200]")
            if (div0!=null) {
                //div0.style.cssText="padding: 0px; z-index: 2001; height: 98%;top: 10px;";
                var tmp0=div0.style.cssText;
                if (tmp0.indexOf("height")==-1 ){
                    div0.style.cssText=tmp0+"height: 98%;top: 10px;";
                    //console.log("1->"+tmp0+"height: 98%;top: 10px;")
                }

            }
            let proc_win=document.querySelector("span[data-v-01bcd200]");
            if (proc_win!=null) {
                let div1=document.querySelector(".v-modal");
                if (div1!=null) {
                    //div1.style.cssText="z-index: 2001; height: 98%;top: 10px;";
                    var tmp1=div1.style.cssText;
                    if (tmp1.indexOf("height")==-1 ){
                        div1.style.cssText=tmp1+"height: 98%;top: 10px;";
                        //console.log("2->"+tmp1+"height: 98%;top: 10px;")
                    }
                }
            }
            //修改編輯器的高度，便於承接更多腳本
            /*
            let sqlEdit=document.querySelector("div.CodeMirror.cm-s-blackboard.CodeMirror-wrap");
            if (sqlEdit != null) {
            sqlEdit.style.cssText= "width: auto; height: 1024px;"
            }
            */
            //console.log("定时执行完成")
        }

        //*************************************
        //获取sql执行数据
        //*************************************
        function getSqlResultWindow(){
            var d=new Date();
            var obj=getSql(isFlowNode);
            var sql=obj.code;
            var filename=obj.filename;
            if (filename=="") {
                //filename="save "+dateFormat("yyyy-mm-dd HHMMSS",d);
                try {
                    filename=sql.toLowerCase().replace(/\n/g, "").replace(/\r/g, "").split(" from ")[1].trim().split(" ")[0];  
                } catch (error) {
                    filename="data";
                }
                filename=filename+" "+dateFormat("yyyy-mm-dd HHMMSS",d);
            }
            else {
                filename=filename+" "+dateFormat("yyyy-mm-dd HHMMSS",d);
            }
            if(sql.length>0) {
                var file_sql = new File([sql], filename+".sql", { type: "text/plain;charset=utf-8" });
                //saveAs(file_sql);
            }
            var str_colName=getSqlResult("title");
            //console.log(str_colName);
            var str_data=getSqlResult("data");
            //console.log(str_data);
            if(str_colName.length>0 || str_data.length>0) {
                var str_export=str_colName+"\n"+str_data;
                
                const lines = str_data.split('\n');
                //console.log(str_data)
                const outputStr = lines.slice(2).join('\n');
                //console.log(outputStr)
                openSqlQueryDateWindow(filename, outputStr,sql);
                return;
                var file = new File([str_export], filename+".csv", { type: "text/plain;charset=utf-8" });
                saveAs(file);
            } else {
                alert("请点击执行按钮并查询出数据后，再点击保存按钮。")
            }
        }

        //*************************************
        //获取选中内容的表结构
        //*************************************
        function tableDesc(){
            //获取选择的文本
            let i,byclass=document.getElementsByClassName("CodeMirror"), editors=[]
            for(i=0;i< byclass.length;i++){
                let cm=byclass[i]. CodeMirror
                if(cm) {editors.push(cm);}
            }
            let table="";
            for (i=0;i<editors.length;i++){
                table=editors[i].getSelection();
                if (table.length>0) {
                    break;//找到选中文本，则退出
                }
            }
            if (table.length>0) {
                sync_status=0; //初始状态
                sync_result=""; //初始信息
                sync_result2=""; //初始信息
                let str_colName=""
                sync(table);
                //等3S返回
                setTimeout(() => {
                    if (sync_status==200) {
                        my_log("已获取选中内容的表结构.");
                        sync_return(table);
                        return 0;
                    }
                    else if (sync_status==0){
                        console.log("第一次超时还未返回");
                        //再等5S返回
                        setTimeout(() => {
                            if (sync_status==200) {
                                my_log("已获取选中内容的表结构.");
                                sync_return(table);
                                return 0;
                            }
                            else if (sync_status==0){
                                console.log("第二次超时还未返回");
                                my_log("调用服务未返回，请重试.");
                                alert("调用服务未返回，请重试.");
                                return 1;
                            }
                            else{
                                my_log("查询表结构失败");
                                alert("查询失败："+sync_result.toString()+"->"+sync_message);
                                return 1;
                            }
                        }, 15000);
                    }
                    else{
                        my_log("查询表结构失败");
                        alert("查询失败："+sync_result.toString()+"->"+sync_message);
                        return 1;
                    }
                }, 5000);

            }
            else {
                my_log("请在编辑框中选择需要查看的表，再点击该按钮.");
                if (my_msg_content.length==0) {
                    alert("请在编辑框中选择需要查看的表，再点击该按钮.");}
                else {
                    my_msg(my_msg_title,"请在编辑框中选择需要查看的表，再点击该按钮，以下为原先查询结果.\n\n"+my_msg_content);
                }
                return 1;
            }

        }

        //*************************************
        //开始 获取当前窗口日志并过滤
        //*************************************
        function logFilter(){
            var i,log;
            var ret_txt="";
            var log_d=new Date();
            var filename="log_"+dateFormat("yyyy-mm-dd HHMMSS",log_d)+".txt";
            var txt,file_sql;

            log=document.querySelectorAll("div > div > div.el-dialog__body > pre");  //流程监控查看日志
            for(i=0;i<log.length;i++){
                txt=log[i].innerText;
                ret_txt=logFilter_procTxt(txt);
                file_sql = new File([ret_txt], filename, { type: "text/plain;charset=utf-8" });
                saveAs(file_sql);
            }

            log=document.querySelectorAll("div > div > div.el-tab-pane > div > pre"); // 20230510 升版新增在流程编辑查看试运行日志
            for(i=0;i<log.length;i++){
                txt=log[i].innerText;
                ret_txt=logFilter_procTxt(txt);
                file_sql = new File([ret_txt], filename, { type: "text/plain;charset=utf-8" });
                saveAs(file_sql);
            }

            log=document.querySelectorAll("#pane-log > pre");
            for(i=0;i<log.length;i++){
                txt=log[i].innerText;
                ret_txt=logFilter_procTxt(txt);
                file_sql = new File([ret_txt], filename, { type: "text/plain;charset=utf-8" });
                saveAs(file_sql);
            }
            //保存zjf对话中的文本
            var zjf_content=document.getElementById("zjf_content1")
            if (zjf_content != null) {
                log=zjf_content.innerText;
                file_sql = new File([log], filename, { type: "text/plain;charset=utf-8" });
                saveAs(file_sql);
            }

        }

        function logFilter_procTxt(txt){
            //转义符替换
            txt=txt.replaceAll('&quot;','"').replaceAll('&gt;','>').replaceAll('&lt;','<').replaceAll('&amp;','&').replaceAll('&nbsp;',' ').replaceAll('&quot','"').replaceAll('&gt','>').replaceAll('&lt','<').replaceAll('&amp','&');
            //查找queryId并清空
            /*queryId=find_first_last_all(txt,"INFO  : Compiling command(queryId=","): ");  
            for (let i=0;i<queryId.length;i++){
                txt=txt.replaceAll(queryId[i],""); //清空queryId=hive_20221026190614_2a6a18b8-6ab3-43db-9edb-abbfeef611c9
            }*/

            //获取脚本
            var sql=find_first_last(txt,"Executing command:  ","going to print operations logs");
            //获取脚本注释
            //sql_block_comment=find_first_last_all(sql,"/*","*/");
            //获取编译命令
            var compiling=find_first_last_all(txt,"INFO  : Compiling command(queryId=","INFO  : Concurrency mode is disabled, not creating a lock manager");
            //获取执行情况
            var executing=find_first_last_all(txt,"INFO  : Executing command(queryId=","seconds\r\nINFO  : OK");
            //console.log(executing);
            //生成输出日志
            var out="";
            var erroring=find_first_last(txt,"Error: Error while compiling statement:","org.apache.hive.service.cli.HiveSQLException: ");
            if (erroring!="") { out=out+"出现错误，错误信息如下:\r\n"+erroring+"\r\n";}
            
            erroring=find_first_last(txt,"ERROR : FAILED: Execution Error,","	at org.apache.hadoop.hdfs.server.namenode.DirectoryWithQuotaFeature");
            if (erroring!="") { out=out+"出现错误，错误信息如下:\r\n"+erroring+"\r\n";}
            
            erroring=find_first_last(txt,"ERROR : FAILED: Execution Error,","INFO  : Concurrency mode is disabled, not creating a lock manager");
            if (erroring!="") { out=out+"出现错误，错误信息如下:\r\n"+erroring+"\r\n";}
            
            erroring=find_first_last(txt,"Error: org.apache.thrift.transport.TTransportException","java.sql.SQLException: org.apache.thrift.transport.TTransportException");
            if (erroring!="") { out=out+"出现错误，错误信息如下:\r\n"+"Error: org.apache.thrift.transport.TTransportException"+erroring+"试试重跑脚本，还不行联系省检查hiveserver2的服务是不是被终止了，重新启动hiveserver2\r\n";}
            
            erroring=find_first_last(txt,"運行失敗的表有：","这些表 没有成功");
            if (erroring!="") { out=out+"出现错误，错误信息如下:\r\n"+"運行失敗的表有：\r\n"+erroring+"\r\n这些表没有成功.\r\n";}
            
            erroring=find_first_last(txt,"Exception in thread \"main\" org.apache.hive.service.cli.HiveSQLException: ","	at org.apache.hive.jdbc.Utils.verifySuccess");
            if (erroring!="") { out=out+"出现错误，错误信息如下:\r\n"+""+erroring+"如果报ALTER VIEW command，请确认同步的表不是视图。\r\n";}

            
            if (compiling.length>0){//取编译成功后面的Hsql语句
                var last_compiling=compiling[compiling.length-1];
                last_compiling=last_compiling.split("):")[1]; //取sql
                last_compiling=last_compiling.trim();//去掉前后空格
                var pos=sql.indexOf(last_compiling);
                var unrunning=sql.substr(pos+last_compiling.length,); //取未执行的语句
                //判断剩下语句是否为不需要执行的语句
                var is_null_unrunning_bz=1;
                var is_null_unrunning_line=unrunning.split('\r\n');
                for (var j=0;j<is_null_unrunning_line.length;j++){
                    is_null_unrunning_line[j]=is_null_unrunning_line[j].trim();
                    if(is_null_unrunning_line[j].trim().substr(0,2)!="--" && is_null_unrunning_line[j]!="") {is_null_unrunning_bz=0;break;}
                }
                if (is_null_unrunning_bz==0) { //剩下语句不为空，则打印未执行的语句
                    var unrunning_line="",j=0,begin_status=1;
                    unrunning=unrunning.split("\r\n");
                    for (var i=0;i<unrunning.length;i++) {
                        if (i==0){unrunning_line=unrunning_line+unrunning[i]+"\r\n";}
                        else {
                            if(unrunning[i].trim().substr(0,2)=="--" ){j=j+1;} else {begin_status=0;} //记录需要跳过行数
                            if ((i-j)==0) {unrunning_line=unrunning_line+unrunning[i]+""+"\r\n";}
                            else {unrunning_line=unrunning_line+unrunning[i]+" --"+(i-j)+"\r\n";}
                        }
                    }
                    if (pos!=-1) { out=out+"----------------------------------------\r\n--最后一条编译成功并提交执行的语句:\r\n----------------------------------------\r\n"+last_compiling+";\r\n---------------------------------\r\n--未执行或正在执行的Hql如下:\r\n---------------------------------"+unrunning_line;}
                }
            }
            out=out+"\n------------------------------\r\n一、执行Hql脚本及耗时如下\r\n------------------------------\r\n"
            for (var i=0;i<compiling.length;i++){
                if (compiling[i]!="" && (typeof compiling[i]=='string') && compiling[i].constructor==String) {
                    if (compiling[i].split("):")[1].substr(-2)=='\r\n'){
                        out=out+"-------->"+i+" \r\n"+compiling[i].split("):")[1].substr(0,compiling[i].split("):")[1].length-2)+";\r\n";}
                    }
                    else {
                        out=out+"-------->"+i+" \r\n"+compiling[i].split("):")[1]+";";}
                if (executing[i]!="" && (typeof executing[i]=='string') && executing[i].constructor==String ) {
                    //console.log(i+executing[i])
                    var tmp_executing="";
                    tmp_executing=executing[i].split("Time taken:");
                    if (tmp_executing.length==2) {
                    out=out+"--------> Time taken:"+tmp_executing[1]+"秒\r\n\r\n";}
                    }
            }
            out=out+"\r\n\r\n-----------------------\r\n二、原始Hql脚本如下\r\n-----------------------\r\n"+sql;
            out=out+"\r\n\r\n-------------------\r\n三、原始日志如下\r\n-------------------\r\n"+txt;
            //console.log(out);
            return out;
            //本函数以下脚本作废
            var i,ret_txt="";
            txt=txt.split('\r\n');
            var error="",sql="";
            var is_begin=0,is_end=0;
            var no=1;
            //0、处理&quot转换成"、&gt转换成>、&lt转换成<
            for(i=0;i<txt.length;i++){
                txt[i]=txt[i].replaceAll('&quot','"').replaceAll('&gt','>').replaceAll('&lt','<');
            }
            //1、精简报错信息
            /*for(i=0;i<txt.length;i++){
                if ( txt[i].indexOf('INFO  :')>=0 || txt[i].indexOf('SLF4J:')>=0) {
                    i=i;
                }
                else if (txt[i].indexOf('\tat ')<0) {
                    if( ret_txt.charAt(ret_txt.length-1) !='\n' )
                        {ret_txt=ret_txt+"\r\n"+""+" "+txt[i]+'\r\n';}
                    else
                        {ret_txt=ret_txt+""+" "+txt[i]+'\r\n';}
                }
                else{
                    if( ret_txt.charAt(ret_txt.length-1)!='\n' &&
                        ret_txt.charAt(ret_txt.length-1)!='—' )
                        {ret_txt=ret_txt+"\r\n "+"—";}
                    else
                        {ret_txt=ret_txt+" "+"—";}
                }
            }*/
            //2、SQL语句编号
            //txt=ret_txt.split('\r\n');
            //将sql存入变量
            ret_txt="";
            is_begin=0,is_end=0;
            no=1;
            var SQL=[],idx_sql=0;
            SQL[0]="";
            sql="";
            for(i=0;i<txt.length;i++){
                //获取sql和原始脚本处理
                if ( txt[i].indexOf("Executing command:") >=0 ) {
                    is_begin=1
                }
                if ( txt[i].indexOf("going to print operations logs") >=0 ) {
                    is_end=1
                }
                if (is_begin==0 || is_end==1 || txt[i].indexOf("Executing command:") >=0) {
                    ret_txt=ret_txt+txt[i]+"\r\n";
                }
                else {
                    //处理注释
                    if (txt[i].toLowerCase().replace(/\s+/g,"").substr(0, 2)=="--" ||
                        txt[i].replace(/\s+/g,"")=="") {
                        no=0;
                        ret_txt=ret_txt+txt[i]+"\r\n";}
                    else {
                        ret_txt=ret_txt+no+" "+txt[i]+"\r\n";
                        SQL[idx_sql]=SQL[idx_sql]+no+" "+txt[i]+"\r\n";
                        if (no==1) {sql=sql+"\r\n";}
                        sql=sql+no+" "+txt[i]+"\r\n";
                    }

                    //处理删表或者; 用于结束程序段
                    if (txt[i].toLowerCase().replace(/\s+/g,"").indexOf("droptable")>=0 
                        || txt[i].replace(/\s+/g,"").substr(-1)==';') {
                        no=1;
                        idx_sql+=1;
                        SQL[idx_sql]="";
                    }
                    else {
                        no=no+1;
                    }
                    
                }
            }
            SQL = SQL .filter(item=>item); //踢掉空字符串

            //处理日志
            ret_txt="";
            is_begin=0,is_end=0;
            no=1;
            sql="";
            idx_sql=-1;
            for(i=0;i<txt.length;i++){
                //错误精简日志（执行sql、耗时和错误）
                if (txt[i].substr(0,6)=="Error:" 
                ||txt[i].indexOf("INFO  : Executing command")>=0
                ||txt[i].indexOf("INFO  : Completed executing command")>=0) {
                    if (txt[i].substr(0,6-1)=="INFO ") {
                        var tmp_txt=txt[i].split("):");
                        if (tmp_txt.length==2)
                        {
                            error=error+tmp_txt[1]+"...\r\n";
                            idx_sql+=1;
                            error=error+SQL[idx_sql-1]+"\r\n"}
                        else { 
                            tmp_txt=txt[i].split("Time taken:");
                            if (tmp_txt.length==2) {error=error+"耗时:"+tmp_txt[1]+"\r\n\r\n";}
                            else {error=error+txt[i]+"\r\n";}
                        }
                    }
                    else {
                        error=error+SQL[idx_sql]+"错误"+txt[i];
                    }
                    if (txt[i].substr(0,6)=="Error:") {error=error+"\r\n";}
                }
                //获取sql和原始脚本处理
                if ( txt[i].indexOf("Executing command:") >=0 ) {
                    is_begin=1
                }
                if ( txt[i].indexOf("going to print operations logs") >=0 ) {
                    is_end=1
                }
                if (is_begin==0 || is_end==1 || txt[i].indexOf("Executing command:") >=0) {
                    ret_txt=ret_txt+txt[i]+"\r\n";
                }
                else {
                    //处理注释
                    if (txt[i].toLowerCase().replace(/\s+/g,"").substr(0, 2)=="--" ||
                        txt[i].replace(/\s+/g,"")=="") {
                        no=0;
                        ret_txt=ret_txt+txt[i]+"\r\n";}
                    else {
                        ret_txt=ret_txt+no+" "+txt[i]+"\r\n";
                        if (no==1) {sql=sql+"\r\n";}
                        sql=sql+no+" "+txt[i]+"\r\n";
                    }

                    //处理删表或者; 用于结束程序段
                    if (txt[i].toLowerCase().replace(/\s+/g,"").indexOf("droptable")>=0 
                        || txt[i].replace(/\s+/g,"").substr(-1)==';') {
                        no=1;
                    }
                    else {
                        no=no+1;
                    }
                    
                }

            }

            return "一、以下为精简日志：\r\n"+error+"\r\nSQL分段如下:"+sql+"\r\n二、以下为原始日志：\r\n"+ret_txt;
        }
        //*************************************
        //结束  获取当前窗口日志并过滤
        //*************************************
        function containsChinese(str) {
            var reg = /[\u4e00-\u9fa5]/g;
            return reg.test(str);
          }
          //console.log(containsChinese("Hello")); // false
          //console.log(containsChinese("Hello, 世界")); // true
          
        function removeNonChineseBackQuote(str) {
            // // 匹配反引号及其内部的非中文字符
            // const regex = /`(?:[^\u4e00-\u9fa5`]*[\u4e00-\u9fa5]+[^\u4e00-\u9fa5`]*)`/g;
            // // 将匹配到的字符串替换为不包含反引号的部分
            // let s= str.replace(regex, match => match.replace(/`/g, '!!!!!'));
            // s=s.replace(/`/g,'');
            // s=s.replace(/!{5,}/g, '`');
            // return s;
            let strs=str.split('`');
            let s="";
            let sw=0;
            for (let i=0;i<strs.length;i++) {
                if (sw==0) {
                    s=s+strs[i];}
                if (sw==1) {
                    if (containsChinese(strs[i])) {
                        s=s+"`"+strs[i]+"`";
                    } else {s=s+strs[i];}
                }
                if (sw==0) {sw=1;} else {sw=0;}
            }
            return s;
        }
        //console.log(removeNonChineseBackQuote("`Hello`  张劲峰  `你好2` `asd` ")); // 输出 Hello   `你好` asd 
 
        function sync_return(table){
            let col_name,data_type,comment,j;
            //查找将各字段保存在数组中
            var partition_status=0,p_cols=[],cols=[],data_types=[],p_data_types=[],comments=[],p_comments=[];
            for(j=0;j<sync_result.length;j++) {
                //取列名、类型和注释
                col_name=sync_result[j].col_name;
                if (col_name==null) {col_name="";}
                data_type=sync_result[j].data_type;
                if (data_type==null) {data_type="";}
                comment=sync_result[j].comment;
                if (comment==null || comment=="null") {comment="";}
                //判断是否开始分区 # Partition开始后都是分区字段
                if ( col_name.indexOf("# Partition")>=0 ) {
                    partition_status=1;
                    continue;
                }
                if (col_name.indexOf("# ")>=0 || col_name=="") {continue;}
                if (escape(col_name).indexOf("%u") >= 0){
                    //列中含有汉字
                    col_name='`'+col_name+'`';
                }
                if (partition_status==0){ //将列字段保存起来
                    cols.push(col_name);
                    data_types.push(data_type);
                    comments.push(comment);
                }
                else { //将分区字段保存起来
                    p_cols.push(col_name);
                    p_data_types.push(data_type);
                    p_comments.push(comment);
                }
            }
            //存储列名
            hive_sql_short_col="";
            let tmp_col_comment="";
            //将列是分区的踢掉及存储列名
            for(j=0;j<cols.length;j++){
                if (comments[j]=="") {tmp_col_comment="";} else{tmp_col_comment=" `"+comments[j]+"`";}
                if(hive_sql_short_col=="") {hive_sql_short_col=cols[j]+tmp_col_comment;}
                else {hive_sql_short_col=hive_sql_short_col+","+cols[j]+tmp_col_comment;}
                if (p_cols.indexOf(cols[j]) >=0) {
                    //cols.splice(j,1);
                    //data_types.splice(j,1);
                    //comments.splice(j,1);
                    cols[j]="";
                }
            }
            //生成hive列
            var hive_sql_col="",hive_sql_comment;
            col_xls="列名\t类型\t注释\n";
            var pg_sql_col="",pg_sql_comment="";
            for(j=0;j<cols.length;j++) {
                if (cols[j]=="") {continue;}
                if (comments[j].length>0) {
                    hive_sql_comment="comment '"+comments[j]+"'";
                    pg_sql_comment=pg_sql_comment+"comment on column  "+table+"."+cols[j].replace(/`/g,"")+" is '"+comments[j]+"';\n";
                }
                else {hive_sql_comment=""}
                hive_sql_col=hive_sql_col+cols[j]+" "+data_types[j]+" "+hive_sql_comment+",";
                pg_sql_col=pg_sql_col+cols[j].replace(/`/g,"")+" "+col_hive_to_pg(data_types[j])+",";
                col_xls=col_xls+cols[j].replace(/`/g,"")+"\t"+data_types[j]+"\t"+comments[j]+"\n";
            }
            hive_sql_col=hive_sql_col.substring(0, hive_sql_col.lastIndexOf(','));
            pg_sql_col=pg_sql_col.substring(0, pg_sql_col.lastIndexOf(','));
            console.log("1pg_sql_col:"+pg_sql_col)
            //生成hive分区语句
            var hive_sql_partition="",pg_sql_partition="";
            for(j=0;j<p_cols.length;j++) {
                if (p_comments[j].length>0) {
                    hive_sql_comment="comment '"+p_comments[j]+"'";
                }
                else {hive_sql_comment=""}
                hive_sql_partition=hive_sql_partition+p_cols[j]+" "+p_data_types[j]+" "+hive_sql_comment+",";
                pg_sql_partition=pg_sql_partition+p_cols[j].replace(/`/g,"")+" "+col_hive_to_pg(p_data_types[j])+",";
                col_xls=col_xls+p_cols[j].replace(/`/g,"")+"\t"+p_data_types[j]+"\t"+p_comments[j]+"\n";
            }
            hive_sql_partition=hive_sql_partition.substring(0, hive_sql_partition.lastIndexOf(','));
            pg_sql_partition=pg_sql_partition.substring(0, pg_sql_partition.lastIndexOf(','));
            if (pg_sql_partition.length>0) {
                pg_sql_col=pg_sql_col+",\n--以下为分区字段\n"+pg_sql_partition;
                console.log("2pg_sql_col:"+pg_sql_col)
            }

            //结果输出
            if (hive_sql_col=="") {
                let msg=sync_status.toString()+":"+sync_message;
                alert(msg);
            }
            else {
                my_msg_title=""+table+"";
                create_sql="create table  if not exists "+table+"(\n"+hive_sql_col+") "
                if (hive_sql_partition.length>0){
                    create_sql=create_sql+"\n partitioned by ("+hive_sql_partition+")\n STORED AS PARQUET;\n--stored as orc tblproperties('orc.compression'='snappy'); --超大表使用orc列式存储结合snappy压缩\n";
                    hive_sql_col=hive_sql_col+",\n--以下为分区字段\n"+hive_sql_partition;
                }
                else {create_sql=create_sql+"\n STORED AS PARQUET;\n--stored as orc tblproperties('orc.compression'='snappy'); --超大表使用orc列式存储结合snappy压缩\n";}
                var proj=JSON.parse(sessionStorage.getItem("storeGlobal.currentProject"));
                var engineAccount=proj.engineAccount;  //zone_hz
                if (engineAccount.indexOf('zone_hz')>=0) {
                    pg_create_sql="--drop table if exists "+table+";\ncreate table  if not exists "+table+"(\n"+pg_sql_col+");\n\n"+pg_sql_comment+"\n--grant all on "+table+"  to bss_hz_tmp;";
                }
                else {
                    pg_create_sql="--drop table if exists "+table+";\ncreate table  if not exists "+table+"(\n"+pg_sql_col+");\n\n"+pg_sql_comment+"";
                }
                hive_sql_short_col='set hive.execution.engine=tez;\nselect '+hive_sql_short_col+' from '+table +' where 1=1';
                GM_setClipboard(formatStr(hive_sql_short_col,80));
                //my_msg_content="1、字段列表:\n"+formatStr(hive_sql_short_col,40)+"\n\n2、字段及说明:\n"+formatStr(hive_sql_col,40)+"\n\n3、Hive建表语句:\n"+formatStr(create_sql,40)+"\n\n4、PG建表语句:\n"+formatStr(pg_create_sql,40)+"\n\n5、字段按行列表:\n"+col_xls;
                my_msg_content="1、查表语句:\n"+formatStr(hive_sql_short_col,40)+"\n\n2、Hive建表语句:\n"+formatStr(create_sql,40)+"\n\n3、PG建表语句:\n"+formatStr(pg_create_sql,40)+"\n\n4、字段按行列表:\n"+col_xls;
                
                ////////////////////////////生成原生的hive建表语句
                hive_orig_create_table_sql="";
                for(j=0;j<sync_result2.length;j++) {
                    //取列名、类型和注释
                    hive_orig_create_table_sql=hive_orig_create_table_sql+sync_result2[j].createtab_stmt+"";
                }
                //alert(hive_orig_create_table_sql);
                hive_orig_create_table_sql=formatStr(removeNonChineseBackQuote(hive_orig_create_table_sql),100);
                my_msg_content=my_msg_content+"\n5、Hive原生的建表语句(如视图显示视图创建语句):\n"+ hive_orig_create_table_sql;
                ///////////////////////////结束生成原生的建表语句
                
                my_msg_content=my_msg_content+"\n\n\n附、Hive建表示例（注意分区不支持中文）:\n"+formatStr("create table if not exists test(\nid string COMMENT '唯一标识',`字段1` string COMMENT '字段1注释',`字段2` string COMMENT '字段2注释') \nPARTITIONED BY (sum_date string)\n STORED AS PARQUET;\n--stored as orc tblproperties('orc.compression'='snappy'); --超大表使用orc列式存储结合snappy压缩\n",40);
                my_msg_content=my_msg_content+"\ninsert into test values ('1','字段1','字段2',date_format( current_timestamp(),'yyyyMMdd HH:mm:ss') );\n ";
                my_msg_content=my_msg_content+"select * from  test;\n ";
                if ( hive_orig_create_table_sql.toUpperCase().includes(" VIEW ") ) {
                    my_msg("视图 "+my_msg_title,my_msg_content);
                }
                else {
                    my_msg("表 "+my_msg_title,my_msg_content);}
                }
            //GM_notification({title:'表结构',text:msg});
            return 0;
        }

        function sync(sql){
            var url=`http://${g_ServIp}/v1/dw/Hive/Query/Sync`;
            var id= JSON.parse(sessionStorage.getItem("storeGlobal.token"));
            var proj=JSON.parse(sessionStorage.getItem("storeGlobal.currentProject"));
            var user=JSON.parse(sessionStorage.getItem("storeGlobal.loginUser"));
            var role=JSON.parse(sessionStorage.getItem("storeGlobal.currentRole"));
            var engineAccount=proj.engineAccount;
            var body ;
            var send_sql=window.btoa(window.encodeURIComponent("desc "+sql+";show create table "+sql+";"))
            if ( id!=null && proj!=null && user!=null && role!=null) {
                body= "{\"projectId\":"+proj.projectId+",\"operatorId\":"+user.userId+",\"limit\":100,\"clusterId\":"+proj.clusterId+",\"user\":\""+engineAccount+"\",\"dbName\":\""+engineAccount+"\",\"sql\":\""+send_sql+"\"}";
                //console.log("body:"+body);
                GM_xmlhttpRequest({
                    method: "post",
                    mode:"cors",
                    credentials:"omit",
                    referrer: `http://${g_ServIpReferrer}/`,
                    referrerPolicy: "strict-origin-when-cross-origin",
                    data:body,
                    url: url,
                    headers:  {
                        "accept": "application/json, text/plain, */*",
                        "accept-language": "zh-CN,zh;q=0.9",
                        "appid": id.access_token,
                        "authorization": id.access_token,
                        "content-type": "application/json;charset=UTF-8",
                        "iap-role-id": role.roleId,
                        "sign": id.access_token
                    },
                    onload: function(res){
                        sync_status=res.status;
                        if(sync_status == 200){
                            var r=JSON.parse(res.responseText);
                            sync_result=r.body.data[0].result;
                            sync_result2=r.body.data[1].result;
                            sync_message=r.body.data[0].message;
                        }else{
                            sync_result=res.responseText;
                            sync_message=r.body.data[0].message;
                            //console.log(res);
                        }
                    },
                    onerror : function(err){
                        sync_result=err;
                        console.log('error');
                        console.log(err);
                    }
                });
            }
            //else {my_log("连接hive失败，可能服务器已断掉连接,需重新进入系统.");}
        }

        function call_CDAP_Server(func,url,body,arg1="",arg2="",arg3="",arg4=""){
            var id= JSON.parse(sessionStorage.getItem("storeGlobal.token"));
            var proj=JSON.parse(sessionStorage.getItem("storeGlobal.currentProject"));
            var user=JSON.parse(sessionStorage.getItem("storeGlobal.loginUser"));
            var role=JSON.parse(sessionStorage.getItem("storeGlobal.currentRole"));

            //var engineAccount=proj.engineAccount;
            //var send_sql=window.btoa(window.encodeURIComponent("desc "+sql))

            if ( id!=null && proj!=null && user!=null && role!=null) {
                sync_code=-1;
                GM_xmlhttpRequest({
                    method: "post",
                    mode:"cors",
                    credentials:"omit",
                    referrer: `http://${g_ServIpReferrer}/`,
                    referrerPolicy: "strict-origin-when-cross-origin",
                    data:body,
                    url: url,
                    headers:  {
                        "accept": "application/json, text/plain, */*",
                        "accept-language": "zh-CN,zh;q=0.9",
                        "appid": id.access_token,
                        "authorization": id.access_token,
                        "content-type": "application/json;charset=UTF-8",
                        "iap-role-id": role.roleId,
                        "sign": id.access_token
                    },
                    onload: function(res){
                        sync_status=res.status;
                        var r=JSON.parse(res.responseText);
                        if(sync_status == 200){
                            if (func=='lookInstance') {
                                //openDiag("查询正常返回，返回状态编码:"+r.code,res.responseText)
                                console.log("流程状态中文"+arg1);
                                var status=""; //存放流程英文
                                if (arg2.indexOf('失败')>-1) {
                                    status="SRF";
                                }
                                else { status="SRN";}
                                console.log("流程状态英文"+status);
                                var data=r.body.data;
                                if (data!=null) {  
                                    var content="";
                                    for (let i=0;i<data.length;i++) {
                                        if (data[i].nodeState==status) { //arg2 为传递过来的SRF 失败 SRN 正在运行中
                                            content=content+data[i].nodeNameCn+'　'+data[i].nodeStartTime+"　至　"+data[i].nodeStateTime+'　'+data[i].nodeState+"\n";
                                            if (status=='SRF') {
                                                openDiag("查询流程环节("+r.message+"),出错环节如下：",content+"\n正在从服务器获取错误日志中...");}
                                            else {
                                                openDiag("查询流程环节("+r.message+"),正在运行环节如下：",content+"\n正在从服务器获取运行日志中...");
                                            }
                                            ///////////////////////////////
                                            //查询出错日志 start
                                            var url_lookInstance=`http://${g_ServIp}/v1/dataworks/flowcheak/cheakLog`;
                                            var body;
                                            //参考body="{\"nodeInstanceId\":6999521653702668,\"tenantId\":3316720709640192,\"projectId\":3316726408361984}"
                                            body="{\"nodeInstanceId\":"+data[i].nodeInstanceId+",\"tenantId\":"+data[i].tenantId+",\"projectId\":"+data[i].projectId+"}";
                                            //console.log(body);
                                            call_CDAP_Server('checkLog',url_lookInstance,body,arg1,status,data[i].nodeNameCn,data[i].nodeTypeId); //status 为传递过来的SRF 失败 SRN 正在运行中
                                            //openDiag("提示","已提交请求，请等待服务器返回...")
                                            //查询出错日志 end
                                            //////////////////////////////

                                            ///////////////////////////////
                                            //查询节点代码 start
                                            //调用获取代码  "body": "{\"page\":{\"index\":1,\"size\":999999},\"params\":{\"nodeId\":100031,\"state\":\"SRN\"}}",
                                            var url_getNodeCode=`http://${g_ServIp}/v1/dataworks/Node/QueryActive`;
                                            body="{\"page\":{\"index\":1,\"size\":99999},\"params\":{\"nodeId\":"+data[i].nodeId+",\"state\":\"SRN\"}}";
                                            //console.log(body);
                                            //参考body= "{\"projectId\":"+proj.projectId+",\"operatorId\":"+user.userId+",\"limit\":100,\"clusterId\":"+proj.clusterId+",\"user\":\""+engineAccount+"\",\"dbName\":\""+engineAccount+"\",\"sql\":\""+send_sql+"\"}";
                                            //console.log(body);
                                            call_CDAP_Server('getNodeCode',url_getNodeCode,body,arg1,status,data[i].nodeNameCn,data[i].nodeTypeId);        
                                            //查询节点代码 end
                                            //////////////////////////////
                                            break;
                                        }
                
                                    }
                                    
                                }
                                //console.log(data);
                            }
                            else if (func=='checkLog') { //获取节点日志
                                var data=r.body.data;
                                if (data!=null) {
                                    var nodeName="未知";
                                    if ( nodeTypes.hasOwnProperty(arg4) ) {
                                        nodeName=nodeTypes[arg4];
                                    }
                                    if (arg2=='SRF') {
                                        openDiag("查询流程环节日志("+r.message+"),出错环节->"+arg3+"","流程："+arg1+"　环节："+arg3+"　环节类型："+nodeName+"\n"+logFilter_procTxt(r.body.data)); }
                                    else {
                                        openDiag("查询流程环节日志("+r.message+"),正在运行环节->"+arg3+"","流程："+arg1+"　环节："+arg3+"　环节类型："+nodeName+"\n"+logFilter_procTxt(r.body.data));
                                    }
                                }
                            }
                            else if(func=='getNodeCode') { //获取节点代码 arg1为节点id
                                var data=r.body.data;
                                if (data!=null) {
                                    var nodeName="未知";
                                    if ( nodeTypes.hasOwnProperty(arg4) ) {
                                        nodeName=nodeTypes[arg4];
                                    }
                                    var nodeCode=window.decodeURIComponent(window.atob(data[0].nodeContent));
                                    //alert(data[0].nodeNameCn+"\n"+nodeCode);
                                    openDiag("","","日志|代码","流程："+arg1+"　环节："+arg3+"　环节类型："+nodeName+"\n\n"+nodeCode);
                                    try { 
                                        let r2=JSON.parse(nodeCode);
                                        let nodeExtId=r2.nodeExtId;
                                        ///////////////////////////////
                                        //查询节点扩展信息代码 start
                                        //调用获取代码  "body": "{\"page\":{\"index\":1,\"size\":100000},\"params\":{\"nodeId\":43459}}",
                                        var url_getNodeExtCode=`http://${g_ServIp}/v1/dataworks/InfoPointNodeExt/QueryActive`;
                                        body="{\"page\":{\"index\":1,\"size\":99999},\"params\":{\"nodeId\":"+r2.nodeId+"}}";
                                        //console.log(body);
                                        call_CDAP_Server('getNodeExtCode',url_getNodeExtCode,body,arg1,arg2,arg3,arg4);        
                                        //查询节点扩展信息代码 end
                                        //////////////////////////////

                                    } catch (err)
                                    {
                                        let e=1;
                                        console.log(err);
                                    }
                                }

                            }
                            else if(func=='getNodeExtCode') { //获取节点扩展代码 arg1为节点id
                                var data=r.body.data;
                                if (data!=null) {
                                    var nodeName="未知";
                                    if ( nodeTypes.hasOwnProperty(arg4) ) {
                                        nodeName=nodeTypes[arg4];
                                    }
                                    var nodeCode='<table border="1px solid #ccc">';
                                    nodeCode+="<tr><th>　sysName　</th><th>　moduleName　</th><th>　dbName　</th><th>　tableName　</th><th>　cityId　</th></tr>"
                                    for (let ii=0 ;ii<data.length;ii++) {
                                        nodeCode=nodeCode+"<tr><td>　"+data[ii].sysName+"　</td><td>　"+data[ii].moduleName+"　</td><td>　"+data[ii].dbName+"　</td><td>　"+data[ii].tableName+"　</td><td>　"+data[ii].cityId+"　</td></tr>";

                                    }
                                    nodeCode+="</table>";
                                    openDiag("","","日志|代码|代码扩展","","流程："+arg1+"　环节："+arg3+"　环节类型："+nodeName+"\n\n"+nodeCode);
                                }
                            }
                        }else{
                            openDiag("查询可能有问题，返回状态编码:"+r.status,r.error+"\n"+r.message)
                        }
                    },
                    onerror : function(err){
                        openDiag("查询出错了",err);
                    }
                });
            }
            else {
                alert("连接hive失败，可能服务器已断掉连接,需重新进入系统.");}
            }

        //*************************************
        //hive 字段和PG字段映射
        // https://blog.csdn.net/weixin_38924697/article/details/119299228
        //*************************************
        function col_hive_to_pg(data_type) {
            let data_types,sw_date_type="",precision="";
            data_types=data_type.split("(");
            sw_date_type=data_types[0];
            if (data_types.length>1){
                precision="("+data_types[1];
            }
            switch(sw_date_type)
            {
                case "string":
                    return "varchar";
                case "tinyint":
                    return "smallint";
                case "int":
                    return "decimal(10,0)";
                case "bigint":
                    return "decimal(20,0)";
                case "float":
                    return "real";
                case "double":
                    return "double precision";
                case "decimal":
                    return "numeric"+precision;
                default:
                    return data_type
            }
        }



        //*************************************
        //自助分析:设置SQL编辑器高度
        //*************************************
        function sqlSetHight(sql_hight){
            //GM_log("div.CodeMirror.cm-s-blackboard[style='width: auto; height: "+sql_curr_hight+";']");
            var sql=document.querySelectorAll("div.CodeMirror.cm-s-blackboard[style='width: auto; height: "+sql_curr_hight+";']");
            if (sql==null) {
                sql=document.querySelectorAll("div.CodeMirror.cm-s-blackboard[style='width: auto; height: "+sql_org_hight+";']");
            }
            var ii=0;
            for (ii=0;ii<sql.length;ii=ii+1) {
                sql[ii].style.height=sql_hight;
            }
            sql_curr_hight=sql_hight;
        }

        //*************************************
        //自助分析:隐藏sql编辑框中的提示按钮
        //*************************************
        function sqlHiddenHint(){
            if (document.querySelector("label.el-checkbox").style.display=="none") {
                //SQL窗口的预提示按钮隐藏
                let ts=document.querySelectorAll("label.el-checkbox")
                for (let i=0;i<ts.length;i++){
                    ts[i].style.display="";}
                //SQL窗口的格式化按钮隐藏
                let an=document.querySelectorAll("button")
                for (let i=0;i<an.length;i++){
                    an[i].style.display="";}
                let b=document.querySelectorAll("button.el-button.el-button--default.el-button--mini");
                for (let i=0;i<b.length;i++){
                    b[i].style.display="";
                }
                //SQL窗口的帮助按钮隐藏
                document.querySelector("button[title='帮助']").style.display=""
            }
            else {
                //SQL窗口的预提示按钮隐藏
                let ts=document.querySelectorAll("label.el-checkbox")
                for (let i=0;i<ts.length;i++){
                    ts[i].style.display="none";}
                //SQL窗口的格式化按钮隐藏
                let an=document.querySelector("button")
                for (let i=0;i<an.length;i++){
                    an[i].style.display="none";}
                let b=document.querySelectorAll("button.el-button.el-button--default.el-button--mini");
                for (let i=0;i<b.length;i++){
                    b[i].style.display="none";
                }
                //SQL窗口的帮助按钮隐藏
                document.querySelector("button[title='帮助']").style.display="none"
            }
        }


        //*************************************
        /* 获取SQL语句 */
        //*************************************
        function getSql(isFlowNode){  //是否在流程节点
            //var codeBlock=document.querySelectorAll("div.CodeMirror-code")
            //var lines=codeBlock[0].querySelectorAll("div>pre")
            //var lines=document.querySelectorAll("span[role='presentation']");
            /*var lines=document.querySelectorAll("pre.CodeMirror-line");

            var sql='';
            var tmp_sql;
            if (lines!=null) {
                var i;
                for (i=0;i<lines.length;i++) {
                    tmp_sql=lines[i].innerText;
                    tmp_sql=tmp_sql.replace("\n","");
                    if (i==0) {sql=tmp_sql;}
                    else {
                        if(tmp_sql.replace(/(^\s*)/g,"")!=""){sql=sql+"\n"+tmp_sql;}
                    }
                }
            }
            return sql;*/
            // 参考1：https://blog.51cto.com/u_15309652/3154736
            // 参考2：https://blog.csdn.net/HoKis/article/details/117171647
            let i,byclass=document.getElementsByClassName("CodeMirror"), editors=[]
            for(i=0;i< byclass.length;i++){
                let cm=byclass[i]. CodeMirror
                if(cm) {editors.push(cm);}
            }
            let code="";
            for (i=0;i<editors.length;i++){
                if (editors.length>1 && i==0 && isFlowNode) {continue;}
                if (code=="") {
                    code=editors[i].getValue();
                }
                else {
                    code=code+"\n\n"+editors[i].getValue();
                }
            }
            var filename="";
            var firstLine=code.split('\n')[0];
            if (firstLine.indexOf("文件名=")>0 ){
                filename=firstLine.replace("文件名=","")
                if (filename.substr(0,1)=="#") {filename=filename.substr(1);}
                if (filename.substr(0,2)=="--") {filename=filename.substr(2);}
            }
            return {code,filename};
        }
        //*************************************
        //获取sql查询结果 result_type:  title、data、title2(格式化后的title）
        //*************************************
        function getSqlResult(result_type) {
            var colNames=document.querySelectorAll("thead.has-gutter");
            
            var i,lineNumber;
            var str_colName='';
            var str_colNames='';
            var No_title;
            var colName;
            switch(result_type)
            {
                case "title2": //获取列名调用
                    for(No_title=0;No_title<colNames.length;No_title++) {
                        //colName=colNames[No_title].querySelectorAll("th.is-leaf.el-table__cell[style='padding: 5px 0px;']>.cell");
                        colName=colNames[No_title].querySelectorAll("th.is-leaf[style='padding: 3px 0px;']>.cell");
                        str_colName="";
                        lineNumber=1;
                        for (i=0;i<colName.length;i=i+1) {
                            if (str_colName.length==0) {str_colName=colName[i].innerText;}
                            else {
                                if (str_colName.length>lineNumber*60){
                                    str_colName=str_colName+",\n"+colName[i].innerText;;lineNumber=lineNumber+1;}
                                else {str_colName=str_colName+","+colName[i].innerText;}
                            }
                        }
                        if (str_colName.length>0 && str_colName!="参数名,参数值,全局" && str_colName!="输入名,输入表名" && str_colName!="输出名,输出表名") {
                            if(str_colNames=="") {
                                str_colNames=str_colName;
                            } else {
                                str_colNames=str_colNames+"\n"+str_colName;}
                        }
                    }
                    return str_colNames;

                    //存成文件调用获取列名
                    case "title":
                        return "";
                        for(No_title=0;No_title<colNames.length;No_title++) {
                            //colName=colNames[No_title].querySelectorAll("th.is-leaf.el-table__cell[style='padding: 3px 0px;']>.cell");
                            colName=colNames[No_title].querySelectorAll("th.is-leaf[style='padding: 3px 0px;']>.cell");
                            str_colName="";
                            for (i=0;i<colName.length;i=i+1) {
                                if (str_colName.length==0) {str_colName=colName[i].innerText;}
                                else {
                                    str_colName=str_colName+","+colName[i].innerText;
                                }
                            }
                            if (str_colName.length>0 && str_colName!="参数名,参数值,全局" && str_colName!="输入名,输入表名" && str_colName!="输出名,输出表名" ) {
                                if(str_colNames=="") {
                                    str_colNames=str_colName;
                                } else {
                                    str_colNames=str_colNames+"\n"+str_colName;}
                            }
                        }
                        return "注意：导出是逗号分隔的csv文件，为避免字段内容中有逗号 导致的错列，会将字段中有逗号的转成全角的逗号；用excel打开后请全文查找全角的逗号替换成半角的逗号。\n"+str_colNames;
                //存成文件调用获取data
                case "data":
                    //1、找到查询tab
                    var tabs=document.getElementsByClassName("el-tabs__nav is-top")
                    var i_tabs
                    for (i_tabs=0;i_tabs<tabs.length;i_tabs++){
                        if (tabs[i_tabs].getElementsByClassName("el-tabs__item is-top is-active is-closable")  ) {
                            var tab=tabs[i_tabs].getElementsByClassName("el-tabs__item is-top is-active is-closable") 
                            if (tab.length>0)
                            if (tab[0].innerText.indexOf('查询')>=0) {
                                    break;
                            }
                        }
                    }
                    //2、 找到激活的tab
                    //console.log(i_tabs)
                    var query_table_count=0
                    var query_table_active_no=0
                    if (i_tabs<tabs.length) {
                        var query_tabs=tabs[i_tabs].querySelectorAll("div")
                        for (let j=0;j<query_tabs.length;j++) {
                            if (query_tabs[j].innerText.indexOf("查询")>=0) {
                                query_table_count=query_table_count+1;
                                if(query_tabs[j].className.indexOf("is-active")>=0) {
                                    query_table_active_no=query_table_count
                                }
                            }
                            //console.log(query_tabs[j])    
                        }
                    }
                    console.log(query_table_count)    
                    console.log(query_table_active_no)    
                    //3、找激活tab对应的数据
                    var str_data="";
                    var datas=document.querySelectorAll("table.el-table__body>tbody");
                    if ((datas.length-query_table_count+query_table_active_no-1)<0 ) {return "";}
                    //激活查询data  ->  datas[datas.length-query_table_count+query_table_active_no-1]
                    if (datas!=null) {
                        var i_body,data;
                        for (i_body=0;i_body<datas.length;i_body++){
                            if ( i_body!=(datas.length-query_table_count+query_table_active_no-1) ) {continue;}
                            //获取标题
                            var title=datas[i_body].parentElement.parentElement.previousSibling;
                            if(title != null) {
                                colName=title.querySelectorAll("th.is-leaf[style='padding: 3px 0px;']>.cell");
                                str_colName="";
                                for (i=0;i<colName.length;i=i+1) {
                                    if (str_colName.length==0) {str_colName=colName[i].innerText;}
                                    else {
                                        str_colName=str_colName+","+colName[i].innerText;
                                     }
                                }
                            }

                            //获取数据
                            data=datas[i_body]; //data[data.length-1];
                            data=data.querySelectorAll("tr");
                            if (data!=null) {
                                var line_no,col_no,cols;
                                for (line_no=0;line_no<data.length;line_no++) {
                                    cols=data[line_no].querySelectorAll("td>div");
                                    //console.log(cols)
                                    if (cols.length==3) {
                                        if(cols[0].innerText.indexOf("解析的节点输出表不可编辑和删除")>=0) 
                                          break;
                                    }
                                    for (col_no=0;col_no<cols.length;col_no++) {
                                        var tmp_col=cols[col_no].innerText;
                                        tmp_col=tmp_col.replace(/(^\s*)/g,"").replace("\0x0a"," ").replace("\0x0d"," ").replace(/,/g,"，");
                                        if (col_no==0) {str_data=str_data+tmp_col;}
                                        else {str_data=str_data+","+tmp_col;}
                                    }
                                    str_data=str_data+"\n";
                                }
                            }
                        }
                    }
                    return "注意：导出是逗号分隔的csv文件，为避免字段内容中有逗号 导致的错列，会将字段中有逗号的转成全角的逗号；可用excel打开后请全文查找全角的逗号替换成半角的逗号。\n\n"+str_colName+"\n"+str_data;
            }

        }

        //*************************************
        //显示信息对话框
        //*************************************
        //张劲峰弹窗mask风格
        var zjf_style=` #zjf_mask {
            background: #000;
            opacity: 0.75;filter: alpha(opacity=75);
            height: 100%;width: 100%;
            position: absolute;
            left: 0;top: 0;
            z-index: 10000;
        }
        #zjf_layer {
            position: fixed;
            left: 0;top: 3%;
            z-index: 10001;
        }
        .zjf_diag{
            width: 1020px;
            height: 600px;
            background: rgb(255, 255, 255);
            border: 2px solid rgb(128, 128, 128);
        }
        .zjf_title {
            line-height: 24px;
            font-size: 18px;color: #303133;
            position: absolute;left:10px;top:5px;
            width:800px;
        }
        .zjf_btn {
            line-height: 24px;
            font-size: 12px;color: #303133;
            position: absolute;left:10px;bottom:5px
        }
        .zjf_content{
            font-size:14px;
            width: 1000px;height: 575px;
            color:blue;
            background: rgb(240, 240, 240);
            border: 0px solid rgb(0, 0, 200);
            position: absolute;
            left:10px;top:35px;
            max-height:535px;overflow-y:auto;
            line-height: 1.2;
        }
        #zjf_close {
            width: 20px;height: 20px;
            color: #000;
            background: rgb(255, 255, 255);
            cursor: pointer;
            position: absolute;
            right: 3px;top: 10px;
        }
        `
        GM_addStyle(zjf_style);
        function openDiag(title,content1,bntStr="",content2="",content3="") {
            var zjf_layers=document.getElementById("zjf_layer");
            title=title.substr(0,70);
            if (zjf_layers!=null) {
                if (title.length>0) {
                    document.getElementsByClassName("zjf_title")[0].innerText = title; //"<div class='zjf_title'>"+title+"</div>";
                }
                if(content1.length>0) {
                    //设置tab1内容
                    document.getElementById("zjf_content1").innerHTML=content1.replace(/\n/g,"<br>"); //"<p class='zjf_content'>"+content.replace(/\n/g,"<br>")+"</p>";
                }
                if(content2.length>0) {
                    //激活显示各tab按钮
                    document.getElementById("zjf_display_content1").style.display="";
                    document.getElementById("zjf_display_content1").innerText=bntStr.split("|")[0];
                    document.getElementById("zjf_display_content2").style.display="";
                    document.getElementById("zjf_display_content2").innerText=bntStr.split("|")[1];
                    //设置tab2内容
                    document.getElementById("zjf_content2").innerHTML=content2.replace(/\n/g,"<br>");//"<p class='zjf_content'>"+content2.replace(/\n/g,"<br>")+"</p>";
                }
                if(content3.length>0) {
                    //激活显示各tab按钮
                    document.getElementById("zjf_display_content1").style.display="";
                    document.getElementById("zjf_display_content1").innerText=bntStr.split("|")[0];
                    document.getElementById("zjf_display_content2").style.display="";
                    document.getElementById("zjf_display_content2").innerText=bntStr.split("|")[1];
                    document.getElementById("zjf_display_content3").style.display="";
                    document.getElementById("zjf_display_content3").innerText=bntStr.split("|")[2];
                    //设置tab3内容
                    document.getElementById("zjf_content3").innerHTML=content3.replace(/\n/g,"<br>");//"<p class='zjf_content'>"+content2.replace(/\n/g,"<br>")+"</p>";
                }
                return zjf_layers[0];
            }
            else {
                //https://blog.csdn.net/HEConfidence/article/details/123523609
                //创建遮罩层div并插入body
                var oMask = document.createElement("div");
                oMask.id = "zjf_mask";
                document.body.appendChild(oMask);
                var olayer = document.createElement("div");
                olayer.id = "zjf_layer";
                olayer.innerHTML = "<div class='zjf_diag'><div id='zjf_close'> X</div></div>"
                document.body.appendChild(olayer);
                //建立标题
                var divTitle=document.createElement("div");
                divTitle.id="zjf_title";
                divTitle.className="zjf_title";
                divTitle.innerText = title ;//"<div class='zjf_title'>"+title+"</div>"
                olayer.appendChild(divTitle);

                //建立底部按钮,便于在旁边增加其他按钮
                var divBtn=document.createElement("div");
                divBtn.id="zjf_title_btn";
                divBtn.className='zjf_btn';
                //divBtn.className="el-button dw-button h29 el-button--primary el-button--mini";
                //divBtn.style.left="0px";
                //divBtn.style.top="5px";
                //divBtn.innerHTML = "<div class='zjf_btn'>　　</div>"
                divBtn.innerText = "  ";
                olayer.appendChild(divBtn);


                //填充内容1
                var divContent1 = document.createElement("p");
                divContent1.id="zjf_content1";
                divContent1.className='zjf_content';
                //divContent.innerHTML ="<p class='zjf_content'>"+content.replace(/\n/g,"<br>")+"</p>"
                divContent1.innerHTML =content1.replace(/\n/g,"<br>");//"<p class='zjf_content'>"+content.replace(/\n/g,"<br>")+"</p>"
                divContent1.style.display="block";
                /*var editor=CodeMirror.fromTextArea(document.getElementById("zjf_content"),{
                    mode:"text/x-java", //实现Java代码高亮
                    lineNumbers:true
                });*/
                olayer.appendChild(divContent1);
                //填充内容2
                var divContent2 = document.createElement("p");
                divContent2.id="zjf_content2";
                divContent2.className='zjf_content';
                divContent2.innerHTML =content2.replace(/\n/g,"<br>");//"<p class='zjf_content'>"+content2.replace(/\n/g,"<br>")+"</p>"
                divContent2.style.display="None";
                olayer.appendChild(divContent2);
                //填充内容3
                var divContent3 = document.createElement("p");
                divContent3.id="zjf_content3";
                divContent3.className='zjf_content';
                divContent3.innerHTML =content3.replace(/\n/g,"<br>");//"<p class='zjf_content'>"+content2.replace(/\n/g,"<br>")+"</p>"
                divContent3.style.display="None";
                olayer.appendChild(divContent3);

                //  增加关闭按钮
                let close1 = document.createElement('div');
                close1.className="el-button dw-button h29 el-button--primary el-button--mini";
                close1.id="zjf_close1";
                close1.style.left="0px";
                close1.style.top="5px";
                close1.innerText ='关闭';
                close1.style.display=''
                close1.onclick = function (){
                    document.body.removeChild(oMask);
                    document.body.removeChild(olayer);
                };
                divBtn.appendChild(close1);
                
                //  增加显示tab1按钮
                let tab1 = document.createElement('div');
                tab1.className="el-button dw-button h29 el-button--primary el-button--mini";
                tab1.id="zjf_display_content1";
                tab1.style.left="40px";
                tab1.style.top="5px";
                tab1.innerText ='tab1';
                tab1.style.display='None'
                tab1.style.color="#FF0000";
                tab1.onclick = function (){
                    divContent1.style.display="";
                    divContent2.style.display="None";
                    divContent3.style.display="None";
                    tab1.style.color="#FF0000";
                    tab2.style.color="#FFFFFF";
                    tab3.style.color="#FFFFFF";
                    return;
                };
                divBtn.appendChild(tab1);
                //  增加显示tab2按钮
                let tab2 = document.createElement('div');
                tab2.className="el-button dw-button h29 el-button--primary el-button--mini";
                tab2.id="zjf_display_content2";
                tab2.style.left="120px";
                tab2.style.top="5px";
                tab2.innerText ='tab2';
                tab2.style.display='None'
                tab2.onclick = function (){
                    divContent1.style.display="None";
                    divContent2.style.display="";
                    divContent3.style.display="None";
                    tab1.style.color="#FFFFFF";
                    tab2.style.color="#FF0000";
                    tab3.style.color="#FFFFFF";
                    return;
                };
                divBtn.appendChild(tab2);
                //  增加显示tab3按钮
                let tab3 = document.createElement('div');
                tab3.className="el-button dw-button h29 el-button--primary el-button--mini";
                tab3.id="zjf_display_content3";
                tab3.style.left="200px";
                tab3.style.top="5px";
                tab3.innerText ='tab2';
                tab3.style.display='None'
                tab3.onclick = function (){
                    divContent1.style.display="None";
                    divContent2.style.display="None";
                    divContent3.style.display="";
                    tab1.style.color="#FFFFFF";
                    tab2.style.color="#FFFFFF";
                    tab3.style.color="#FF0000";
                    return;
                };
                divBtn.appendChild(tab3);



                //退出按钮
                var oClose = document.getElementById("zjf_close");
                oMask.onclick = oClose.onclick = function () {
                    document.body.removeChild(oMask);
                    document.body.removeChild(olayer);
                }
                // var oClose2 = document.getElementById("zjf_title_btn");
                // oClose2.onclick = function () {
                //     document.body.removeChild(oMask);
                //     document.body.removeChild(olayer);
                // }
                
                

                return olayer;
            }
        }

        function my_msg(title,content) {
            //var tooltip=document.querySelectorAll("div[role='tooltip'].el-popover.el-popper")
            //tooltip=tooltip[tooltip.length-1];
            var diag=openDiag(title,content);
            var t=diag.getElementsByClassName("zjf_btn");
            var f_botton=t[0];
            //复制查询语句
            let b1 = document.createElement('div');
            b1.className="el-button dw-button h29 el-button--primary el-button--mini";
            b1.style.left="0px";
            b1.style.top="5px";
            b1.innerText ='1 查询Sql';
            b1.onclick = function (){
                GM_setClipboard(formatStr(hive_sql_short_col,80));
                alert("已将查询语句复制到粘贴板:\n"+hive_sql_short_col);
                return;
            };
            f_botton.appendChild(b1);
            //复制hive建表
            let b2 = document.createElement('div');
            b2.className="el-button dw-button h29 el-button--primary el-button--mini";
            b2.style.left="15px";
            b2.style.top="5px";
            b2.innerText ='2 Hive建表Sql';
            b2.onclick = function (){
                GM_setClipboard(formatStr(create_sql,80));
                alert("已将Hive建表语句复制到粘贴板:\n"+create_sql);
                return;
            };
            f_botton.appendChild(b2);
            //复制PG建表
            let b3 = document.createElement('div');
            b3.className="el-button dw-button h29 el-button--primary el-button--mini";
            b3.style.left="30px";
            b3.style.top="5px";
            b3.innerText ='3 PG建表Sql';
            b3.onclick = function (){
                GM_setClipboard(formatStr(pg_create_sql,80));
                alert("已将PG建表语句复制到粘贴板:\n"+pg_create_sql);
                return;
            };
            f_botton.appendChild(b3);
            //复制字段
            let b4= document.createElement('div');
            b4.className="el-button dw-button h29 el-button--primary el-button--mini";
            b4.style.left="45px";
            b4.style.top="5px";
            b4.innerText ='4 字段列表'
            b4.onclick = function (){
                GM_setClipboard(formatStr(col_xls,80));
                alert("已将字段列表复制到粘贴板:\n"+col_xls);
                return;
            };
            f_botton.appendChild(b4);
            //复制hive原生建表语句
            let b5= document.createElement('div');
            b5.className="el-button dw-button h29 el-button--primary el-button--mini";
            b5.style.left="60px";
            b5.style.top="5px";
            b5.innerText ='5 Hive原生建表或建视图Sql'
            b5.onclick = function (){
                GM_setClipboard(hive_orig_create_table_sql);
                alert("已将Hive原生建表或建视图Sql复制到粘贴板:\n"+hive_orig_create_table_sql);
                return;
            };
            f_botton.appendChild(b5);
            //保存到本地文件按钮
            let b6= document.createElement('div');
            b6.className="el-button dw-button h29 el-button--primary el-button--mini";
            b6.style.left="100px";
            b6.style.top="5px";
            b6.innerText ='6 保存'
            b6.onclick = function (){
                var d=new Date();
                var file_sql = new File([content], title+" "+dateFormat("yyyy-mm-dd HHMMSS",d)+".sql", { type: "text/plain;charset=utf-8" });
                saveAs(file_sql);
                return;
            };
            f_botton.appendChild(b6);
            return;
        }


        function sleep(time){
            var timeStamp = new Date().getTime();
            var endTime = timeStamp + time;
            while(true){
            if (new Date().getTime() > endTime){
            return;
            } 
            }
        }

        function my_msg_old(title,content) {
            var btn=document.querySelectorAll("div.el-badge.el-popover__reference");
            btn[1].click();
            sleep(1000);
            var tooltip=document.querySelectorAll("div[role='tooltip'][x-placement='bottom'].el-popover.el-popper")
            tooltip=tooltip[0];
            if (tooltip!=null) {
                tooltip.style.zIndex=9999;
                tooltip.style.width="380px";
                tooltip.querySelector("div.el-popover__title").innerText=title;
                tooltip.querySelector("p").innerText=content;
                tooltip.querySelector("p").style.height="550px";
                tooltip.querySelectorAll("div>button>span")[0].innerText="";
                tooltip.querySelectorAll("div>button>span")[1].innerText="";
                tooltip.style.display="";
                tooltip.querySelectorAll("div>button>span")[2].onclick = function (){
                    tooltip.style.display="none";
                };
                var f_botton=tooltip.querySelector("div.el-popover__title");
                tooltip.querySelector("div.el-popover__title").innerText="";
                //复制查询语句
                let b1 = document.createElement('div');
                b1.className="el-button dw-button h29 el-button--primary el-button--mini";
                b1.style.left="0px";
                b1.style.top="5px";
                b1.innerText ='1查询';
                b1.onclick = function (){
                    GM_setClipboard(formatStr(hive_sql_short_col,80));
                    alert("已将以下查询语句复制到粘贴板:\n"+hive_sql_short_col);
                    return;
                };
                f_botton.appendChild(b1);
                //复制hive建表
                let b2 = document.createElement('div');
                b2.className="el-button dw-button h29 el-button--primary el-button--mini";
                b2.style.left="15px";
                b2.style.top="5px";
                b2.innerText ='2建表H';
                b2.onclick = function (){
                    GM_setClipboard(formatStr(create_sql,80));
                    alert("已将以下Hive建表语句复制到粘贴板:\n"+create_sql);
                    return;
                };
                f_botton.appendChild(b2);
                //复制PG建表
                let b3 = document.createElement('div');
                b3.className="el-button dw-button h29 el-button--primary el-button--mini";
                b3.style.left="30px";
                b3.style.top="5px";
                b3.innerText ='3建表P';
                b3.onclick = function (){
                    GM_setClipboard(formatStr(pg_create_sql,80));
                    alert("已将以下Hive建表语句复制到粘贴板:\n"+pg_create_sql);
                    return;
                };
                f_botton.appendChild(b3);
                //复制字段
                let b4= document.createElement('div');
                b4.className="el-button dw-button h29 el-button--primary el-button--mini";
                b4.style.left="45px";
                b4.style.top="5px";
                b4.innerText ='4字段'
                b4.onclick = function (){
                    GM_setClipboard(formatStr(col_xls,80));
                    alert("已将以下Hive建表语句复制到粘贴板:\n"+col_xls);
                    return;
                };
                f_botton.appendChild(b4);
            }
        }

        //*************************************
        /* 写log my log*/
        //*************************************
        function my_log(log_str){
            var log=document.querySelector("#logBanner");
            if (log!=null) {
                log.innerText=log_str;
                //log.value=log_str;
            }
        }


        //*************************************
        //格式化日期
        //用法：
        //let date = new Date()
        //dateFormat("YYYY-mm-dd HH:MM", date)
        //>>> 2019-06-06 19:45`
        //*************************************
        function dateFormat(fmt, date) {
            let ret;
            const opt = {
                "y+": date.getFullYear().toString(),        // 年
                "m+": (date.getMonth() + 1).toString(),     // 月
                "d+": date.getDate().toString(),            // 日
                "H+": date.getHours().toString(),           // 时
                "M+": date.getMinutes().toString(),         // 分
                "S+": date.getSeconds().toString()          // 秒
                // 有其他格式化字符需求可以继续添加，必须转化成字符串
            };
            for (let k in opt) {
                ret = new RegExp("(" + k + ")").exec(fmt);
                if (ret) {
                    fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
                };
            };
            return fmt;
        }

        //*************************************
        //格式化字符串
        //参数： 需要格式化的串，长度
        //*************************************
        function formatStr(str, crLen) {
            var strs = str.split(",");
            let fmtStr = "",i,lineNum = 1;
            for (i = 0; i < strs.length; i = i + 1) {
                if (fmtStr.length == 0) {
                    fmtStr = strs[i];
                } else {
                    var tmp = fmtStr + "," + strs[i];
                    if (tmp.length < lineNum * crLen || (strs[i].substr(0,1)>='0' && strs[i].substr(0,1)<='9')) {
                        fmtStr = fmtStr + "," + strs[i];
                    } else {
                        fmtStr = fmtStr + ",\n" + strs[i];
                        lineNum++;
                    }
                }
            }
            return fmtStr;
        }

        function find_first_last(txt,first,last) {
            //https://github.com/chibrander/jStringy-JavaScript-Library-for-Text-Manipulation
            var txt_remain=S$(txt).BeforeAfter(first,1).value();  //返回指定字符串后面的内容
            var txt_find=S$(txt_remain).BeforeAfter(last,0).value(); //返回指定字符串前面内容
            //txt_remain=S$(txt).BeforeAfter(last,1).value(); //返回指定字符串后面内容
            return txt_find;
        }
        function find_first_last_all(txt,first,last) {
            var txt_find=[],no=0,tmp_txt_find="";
            while (1==1) {
                tmp_txt_find=find_first_last(txt,first,last);
                if (tmp_txt_find!="") {
                    txt_find[no]=tmp_txt_find;
                    //console.log("============"+no+"前\n"+txt);
                    txt=S$(txt).BeforeAfter(first+tmp_txt_find+last,1).value(); //返回指定字符串后面内容
                    //console.log("============"+no+"后\n"+txt);
                    no+=1;
                }
                if (txt=="" || tmp_txt_find=="") {break;}
            }
            return txt_find;
        }
            


        //*************************************
        /* FileSaver.js
    * A saveAs() FileSaver implementation.
    * 1.3.2
    * 2016-06-16 18:25:19
    *
    * By Eli Grey, http://eligrey.com
    * License: MIT
    *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
    */

        /*global s e l f */
        /*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

        /*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
        //*************************************

        var saveAs = saveAs || (function(view) {
            "use strict";
            // IE <10 is explicitly unsupported
            if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
                return;
            }
            var
            doc = view.document
            // only get URL when necessary in case Blob.js hasn't overridden it yet
            , get_URL = function() {
                return view.URL || view.webkitURL || view;
            }
            , save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
            , can_use_save_link = "download" in save_link
            , click = function(node) {
                var event = new MouseEvent("click");
                node.dispatchEvent(event);
            }
            , is_safari = /constructor/i.test(view.HTMLElement) || view.safari
            , is_chrome_ios =/CriOS\/[\d]+/.test(navigator.userAgent)
            , throw_outside = function(ex) {
                (view.setImmediate || view.setTimeout)(function() {
                    throw ex;
                }, 0);
            }
            , force_saveable_type = "application/octet-stream"
            // the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
            , arbitrary_revoke_timeout = 1000 * 40 // in ms
            , revoke = function(file) {
                var revoker = function() {
                    if (typeof file === "string") { // file is an object URL
                        get_URL().revokeObjectURL(file);
                    } else { // file is a File
                        file.remove();
                    }
                };
                setTimeout(revoker, arbitrary_revoke_timeout);
            }
            , dispatch = function(filesaver, event_types, event) {
                event_types = [].concat(event_types);
                var i = event_types.length;
                while (i--) {
                    var listener = filesaver["on" + event_types[i]];
                    if (typeof listener === "function") {
                        try {
                            listener.call(filesaver, event || filesaver);
                        } catch (ex) {
                            throw_outside(ex);
                        }
                    }
                }
            }
            , auto_bom = function(blob) {
                // prepend BOM for UTF-8 XML and text/* types (including HTML)
                // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
                if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
                    return new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
                }
                return blob;
            }
            , FileSaver = function(blob, name, no_auto_bom) {
                if (!no_auto_bom) {
                    blob = auto_bom(blob);
                }
                // First try a.download, then web filesystem, then object URLs
                var
                filesaver = this
                , type = blob.type
                , force = type === force_saveable_type
                , object_url
                , dispatch_all = function() {
                    dispatch(filesaver, "writestart progress write writeend".split(" "));
                }
                // on any filesys errors revert to saving with object URLs
                , fs_error = function() {
                    if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
                        // Safari doesn't allow downloading of blob urls
                        var reader = new FileReader();
                        reader.onloadend = function() {
                            var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
                            var popup = view.open(url, '_blank');
                            if(!popup) view.location.href = url;
                            url=undefined; // release reference before dispatching
                            filesaver.readyState = filesaver.DONE;
                            dispatch_all();
                        };
                        reader.readAsDataURL(blob);
                        filesaver.readyState = filesaver.INIT;
                        return;
                    }
                    // don't create more object URLs than needed
                    if (!object_url) {
                        object_url = get_URL().createObjectURL(blob);
                    }
                    if (force) {
                        view.location.href = object_url;
                    } else {
                        var opened = view.open(object_url, "_blank");
                        if (!opened) {
                            // Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
                            view.location.href = object_url;
                        }
                    }
                    filesaver.readyState = filesaver.DONE;
                    dispatch_all();
                    revoke(object_url);
                }
                ;
                filesaver.readyState = filesaver.INIT;

                if (can_use_save_link) {
                    object_url = get_URL().createObjectURL(blob);
                    setTimeout(function() {
                        save_link.href = object_url;
                        save_link.download = name;
                        click(save_link);
                        dispatch_all();
                        revoke(object_url);
                        filesaver.readyState = filesaver.DONE;
                    });
                    return;
                }

                fs_error();
            }
            , FS_proto = FileSaver.prototype
            , saveAs = function(blob, name, no_auto_bom) {
                return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
            }
            ;
            // IE 10+ (native saveAs)
            if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
                return function(blob, name, no_auto_bom) {
                    name = name || blob.name || "download";

                    if (!no_auto_bom) {
                        blob = auto_bom(blob);
                    }
                    return navigator.msSaveOrOpenBlob(blob, name);
                };
            }

            FS_proto.abort = function(){};
            FS_proto.readyState = FS_proto.INIT = 0;
            FS_proto.WRITING = 1;
            FS_proto.DONE = 2;

            FS_proto.error =
                FS_proto.onwritestart =
                FS_proto.onprogress =
                FS_proto.onwrite =
                FS_proto.onabort =
                FS_proto.onerror =
                FS_proto.onwriteend =
                null;

            return saveAs;
        }(
            typeof self !== "undefined" && self
            || typeof window !== "undefined" && window
            || this.content
        ));
        // `self` is undefined in Firefox for Android content script context
        // while `this` is nsIContentFrameMessageManager
        // with an attribute `content` that corresponds to the window

        if (typeof module !== "undefined" && module.exports) {
            module.exports.saveAs = saveAs;
        } else if ((typeof define !== "undefined" && define !== null) && (define.amd !== null)) {
            define("FileSaver.js", function() {
                return saveAs;
            });
        }

        //*************************************
        //共用函数:等待元素加载成功  未使用
        //*************************************
        function waitForKeyElements (
        selectorTxt,    /* Required: The jQuery selector string that
                            specifies the desired element(s).
                        */
        actionFunction, /* Required: The code to run when elements are
                            found. It is passed a jNode to the matched
                            element.
                        */
        bWaitOnce,      /* Optional: If false, will continue to scan for
                            new elements even after the first match is
                            found.
                        */
        iframeSelector  /* Optional: If set, identifies the iframe to
                            search.
                        */
        ) {
            var targetNodes, btargetsFound;

            if (typeof iframeSelector == "undefined")
                targetNodes     = $(selectorTxt);
            else
                targetNodes     = $(iframeSelector).contents ()
                    .find (selectorTxt);

            if (targetNodes  &&  targetNodes.length > 0) {
                btargetsFound   = true;
                /*--- Found target node(s).  Go through each and act if they
                are new.
            */
                targetNodes.each ( function () {
                    var jThis        = $(this);
                    var alreadyFound = jThis.data ('alreadyFound')  ||  false;

                    if (!alreadyFound) {
                        //--- Call the payload function.
                        var cancelFound     = actionFunction (jThis);
                        if (cancelFound)
                            btargetsFound   = false;
                        else
                            jThis.data ('alreadyFound', true);
                    }
                } );
            }
            else {
                btargetsFound   = false;
            }

            //--- Get the timer-control variable for this selector.
            var controlObj      = waitForKeyElements.controlObj  ||  {};
            var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
            var timeControl     = controlObj [controlKey];

            //--- Now set or clear the timer as appropriate.
            if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
                //--- The only condition where we need to clear the timer.
                clearInterval (timeControl);
                delete controlObj [controlKey]
            }
            else {
                //--- Set a timer, if needed.
                if ( ! timeControl) {
                    timeControl = setInterval ( function () {
                        waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                    },
                                            300
                                            );
                    controlObj [controlKey] = timeControl;
                }
            }
            waitForKeyElements.controlObj   = controlObj;
        }


        /////////////////////////////////////
        //其他第三方函数 开始
        /////////////////////////////////////

        /* canvas-toBlob.js
    * A canvas.toBlob() implementation.
    * 2016-05-26
    * 
    * By Eli Grey, http://eligrey.com and Devin Samarin, https://github.com/eboyjr
    * License: MIT
    *   See https://github.com/eligrey/canvas-toBlob.js/blob/master/LICENSE.md
    */

    /*global self */
    /*jslint bitwise: true, regexp: true, confusion: true, es5: true, vars: true, white: true,
    plusplus: true */

    /*! @source http://purl.eligrey.com/github/canvas-toBlob.js/blob/master/canvas-toBlob.js */

    (function(view) {
        "use strict";
        var
            Uint8Array = view.Uint8Array
            , HTMLCanvasElement = view.HTMLCanvasElement
            , canvas_proto = HTMLCanvasElement && HTMLCanvasElement.prototype
            , is_base64_regex = /\s*;\s*base64\s*(?:;|$)/i
            , to_data_url = "toDataURL"
            , base64_ranks
            , decode_base64 = function(base64) {
                var
                    len = base64.length
                    , buffer = new Uint8Array(len / 4 * 3 | 0)
                    , i = 0
                    , outptr = 0
                    , last = [0, 0]
                    , state = 0
                    , save = 0
                    , rank
                    , code
                    , undef
                ;
                while (len--) {
                    code = base64.charCodeAt(i++);
                    rank = base64_ranks[code-43];
                    if (rank !== 255 && rank !== undef) {
                        last[1] = last[0];
                        last[0] = code;
                        save = (save << 6) | rank;
                        state++;
                        if (state === 4) {
                            buffer[outptr++] = save >>> 16;
                            if (last[1] !== 61 /* padding character */) {
                                buffer[outptr++] = save >>> 8;
                            }
                            if (last[0] !== 61 /* padding character */) {
                                buffer[outptr++] = save;
                            }
                            state = 0;
                        }
                    }
                }
                // 2/3 chance there's going to be some null bytes at the end, but that
                // doesn't really matter with most image formats.
                // If it somehow matters for you, truncate the buffer up outptr.
                return buffer;
            }
        ;
        if (Uint8Array) {
            base64_ranks = new Uint8Array([
                62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1
                , -1, -1,  0, -1, -1, -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9
                , 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25
                , -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35
                , 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51
            ]);
        }
        if (HTMLCanvasElement && (!canvas_proto.toBlob || !canvas_proto.toBlobHD)) {
            if (!canvas_proto.toBlob)
            canvas_proto.toBlob = function(callback, type /*, ...args*/) {
                if (!type) {
                    type = "image/png";
                } if (this.mozGetAsFile) {
                    callback(this.mozGetAsFile("canvas", type));
                    return;
                } if (this.msToBlob && /^\s*image\/png\s*(?:$|;)/i.test(type)) {
                    callback(this.msToBlob());
                    return;
                }
        
                var
                    args = Array.prototype.slice.call(arguments, 1)
                    , dataURI = this[to_data_url].apply(this, args)
                    , header_end = dataURI.indexOf(",")
                    , data = dataURI.substring(header_end + 1)
                    , is_base64 = is_base64_regex.test(dataURI.substring(0, header_end))
                    , blob
                ;
                if (Blob.fake) {
                    // no reason to decode a data: URI that's just going to become a data URI again
                    blob = new Blob
                    if (is_base64) {
                        blob.encoding = "base64";
                    } else {
                        blob.encoding = "URI";
                    }
                    blob.data = data;
                    blob.size = data.length;
                } else if (Uint8Array) {
                    if (is_base64) {
                        blob = new Blob([decode_base64(data)], {type: type});
                    } else {
                        blob = new Blob([decodeURIComponent(data)], {type: type});
                    }
                }
                callback(blob);
            };
        
            if (!canvas_proto.toBlobHD && canvas_proto.toDataURLHD) {
                canvas_proto.toBlobHD = function() {
                    to_data_url = "toDataURLHD";
                    var blob = this.toBlob();
                    to_data_url = "toDataURL";
                    return blob;
                }
            } else {
                canvas_proto.toBlobHD = canvas_proto.toBlob;
            }
        }
        }(typeof self !== "undefined" && self || typeof window !== "undefined" && window || this.content || this));
        
        /////////////////////////////////////
        //其他第三方函数 - 结束
        /////////////////////////////////////

    })();



    /*
            jQuery(document).ready(function($){
                // jQuery code is in here

                $(function(){
                    let promiseArr=[];
                    //异步方法1
                    let p1 = new Promise((resolve, reject) => {
                        //当第三方api提供的是异步方法时 这里用setTimeout模拟
                        setTimeout(() => {
                            console.info('setTimeout1');
                            let cells=document.getElementsByClassName("cell")
                            if (cells.length>0) {
                                for (let i=0;i<cells.length;i++) {
                                    if (cells[i].innerText=="失败"){
                                        console.log(i);
                                    }
                                }
                            }
                            //结束任务
                            resolve();
                        }, 1000)
                    })
                    promiseArr.push(p1)
                    Promise.all(promiseArr).then(res=>{
                        console.log("aaa");

                    })
                })
            });
    */
