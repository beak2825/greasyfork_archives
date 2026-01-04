// ==UserScript==
// @name         gu_feedback_tools
// @namespace    https://booster.gearupglobal.com/
// @version      1.0.3
// @description  反馈后台日志分析+通过此脚本实现反馈后台到游戏后台!
// @author       ming
// @match        https://feedback.booster.gearupportal.com/transfer/list*
// @match        https://feedback.booster.gearupportal.com/feedback/logs*
// @include      /^https:\/\/feedback\.booster\.gearupportal\.com\/[0-9a-z]{24}$/
// @icon         https://uu-test-cdn.s3.netease.com/images_bed/Boost.png
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @require      https://greasyfork.org/scripts/440536-carousel/code/carousel.js?version=1021755
// @require      https://greasyfork.org/scripts/440535-debugout/code/debugout.js?version=1021754
// @require      https://greasyfork.org/scripts/440537-nunjucks/code/nunjucks.js?version=1021756
// @grant        GM_xmlhttpRequest
// @license      Apache License 2.0
// @connect      qa.devouter.uu.netease.com
// @connect      qa.devouter.uu.163.com
// @downloadURL https://update.greasyfork.org/scripts/460317/gu_feedback_tools.user.js
// @updateURL https://update.greasyfork.org/scripts/460317/gu_feedback_tools.meta.js
// ==/UserScript==
(function () {
    'use strict';
    // log记录本地化
    const bugout = new debugout();
    let LOGURL = "https://qa.devouter.uu.netease.com/statistics/temPoint";

    function feedback_to_jump() {
        //获取使用者信息
        let userInfo = document.getElementsByClassName("nav navbar-nav navbar-right")[0].childNodes[1].outerText.trim();
        const table = document.getElementsByClassName("table");
        for (let i = 0; i < table.length; i++) {
            let elementsByTagName = table[i].getElementsByTagName("tr");
            const table_tr_2 = elementsByTagName[1];
            let second_row = table_tr_2.children;
            // 跳转手机号对应的加速日志信息
            let uid_text = second_row[0].outerText.substring(5,);
            if (uid_text.search("信息") !== -1) {
                let uid = uid_text.substring(0, uid_text.length - 2).trim();
                second_row[0].onclick = function () {
                    $.ajax({
                        url: LOGURL,
                        data: {habit: "logView", userInfo: userInfo, project: "gu"},
                        type: "POST",
                    });
                };
                second_row[0].innerHTML += ("<a href='https://feedback.booster.gearupportal.com/user/log/list?log=user_acc_log&uid=" + uid + "' target = '_blank' > 日志 </a>");
            }

            // 包括图片栏在内刚好三行，小于三行就不请求跳转游戏后台了
            if (elementsByTagName.length <= 3) {
                continue;
            }
            const table_tr_3 = elementsByTagName[2];
            const td_name = table_tr_3.children;
            const td_acc = elementsByTagName[3].children;
            // 跳转查看线路
            const name_acc = td_acc[1].outerText;
            let href_acc = "https://admin.booster.gearupportal.com/acc/virtual/server/query/?name=" + name_acc.substring(4,);
            td_acc[1].innerHTML = "<a href=" + href_acc + " target='_blank'>" + name_acc + "</a>"
            td_acc[1].onclick = function () {
                $.ajax({
                    url: LOGURL,
                    data: {habit: "accline", userInfo: userInfo, project: "gu"},
                    type: "POST",
                });
            };
            const name_text = td_name[0].outerText;
            // 截取这部分为了可以跳转到后台的query界面
            const game_overview = name_text.substring(0, 4);
            const game_name = name_text.substring(4,);
            let api_url = "https://qa.devouter.uu.163.com/apis/gu_game_id_dau?";
            const params = "name=" + game_name;
            api_url = api_url + params;
            let id = ''
            // 请求游戏名称对应的id，插入跳转的href
            GM_xmlhttpRequest({
                url: api_url,
                method: "GET",
                data: "",
                headers: {
                    "Content-type": "application/x-www-form-urlencoded"
                },
                onload: function (xhr) {
                    console.log(xhr.responseText);
                    let res = JSON.parse(xhr.responseText);
                    id = res['id']
                    let href_game_overview = "https://admin.booster.gearupportal.com/game/overview/?product=&is_oversea=&preline=&game=" + encodeURIComponent(game_name) + "&page=";
                    let href_game_edit = 'https://admin.booster.gearupportal.com/game/edit/' + id;
                    let href_disabled_type = "https://admin.booster.gearupportal.com/game/mode/?game=" + encodeURIComponent(game_name)
                    let game_overview_a = document.createElement('a');
                    let game_name_a = document.createElement('a');
                    let disabled_type_a = document.createElement('a');
                    game_overview_a.href = href_game_overview;
                    game_name_a.href = href_game_edit;
                    disabled_type_a.href = href_disabled_type;
                    game_overview_a.target = '_blank';
                    game_name_a.target = '_blank';
                    disabled_type_a.target = '_blank';
                    game_overview_a.text = game_overview;
                    game_name_a.text = game_name;
                    disabled_type_a.text = " 模式禁用";
                    game_overview_a.onclick = function () {
                        $.ajax({
                            url: LOGURL,
                            data: {habit: "showGameOnly", userInfo: userInfo, project: "gu"},
                            type: "POST",
                        });
                    };
                    game_name_a.onclick = function () {
                        $.ajax({
                            url: LOGURL,
                            data: {habit: "showGameDetail", userInfo: userInfo, project: "gu"},
                            type: "POST",
                        });
                    };
                    disabled_type_a.onclick = function () {
                        $.ajax({
                            url: LOGURL,
                            data: {habit: "disabledType", userInfo: userInfo, project: "gu"},
                            type: "POST",
                        });
                    }
                    td_name[0].innerHTML = "";
                    td_name[0].appendChild(game_overview_a);
                    td_name[0].appendChild(game_name_a);
                    td_name[0].appendChild(disabled_type_a);

                    if (res['dau_flag'] == 0) {
                        let hot_flag = document.createElement("img");
                        hot_flag.src = "https://uu-test-cdn.s3.netease.com/images_bed/cold.png";
                        td_name[0].appendChild(hot_flag);
                    }
                    console.log('success')
                },
                onerror: function (err) {
                    console.log('error')
                }
            });
        }
    }

    //获取使用者信息
    let userInfo = document.getElementsByClassName("nav navbar-nav navbar-right")[0].childNodes[1].outerText.trim();
    let errorInterpretation = {};     //错误码解释（从服务端获取）
    console.log("开始执行GM_xmlhttpRequest")
    GM_xmlhttpRequest({
        url: "https://qa.devouter.uu.netease.com/uu/errorCode?userInfo=" + userInfo,
        method: "GET",
        responseType: "json",
        dataType: "jsonp",
        headers: {
            "Content-type": "application/x-www-form-urlencoded"
        },
        onload: function (res) {
            let responseText = res.responseText;
            let parse = JSON.parse(responseText);
            errorInterpretation = parse.data;
            bugout.log("logClassify 获取错误码对照表完成");
        },
        onerror: function (err) {
            console.log('error')
            console.log(err)
        }
    });
    console.log("GM_xmlhttpRequest执行结束")

    var anaResult = null;
    var initResult = null;
    var carouselNum = 0;
    var carouselMax = 0;

    $(document).ready(function () {
        // 错误码分析插件
        $("div.panel.panel-default").each(function () {
            // $(this).find("div.btn-group").append('<button name="find_similar" class="btn btn-xs btn-primary" data-toggle="modal" data-target="#similarModal">找相似</button>');
            $(this).find("div.btn-group").append('<button name="analyse" class="btn btn-xs btn-primary" data-toggle="modal" data-target="#myModal"}>分析log</button>');
        });

        var anaButtons = document.getElementsByName('analyse');
        for (let i = 0; i < anaButtons.length; i++) {
            anaButtons[i].onclick = function () {
                $.ajax({
                    url: "https://qa.devouter.uu.netease.com/statistics/temPoint",
                    data: {habit: "analysisLog", userInfo: userInfo},
                    type: "POST",
                });
                $("#myModal").remove();
                carouselNum = 0;
                carouselMax = 0;
                var node = $(this).parent().parent().children('a');
                var logurl = "";
                for (var i in node) {
                    if (node[i].innerText == "[log]") {
                        logurl = node[i].href;
                    }
                }
                initResult = initAnalyse(logurl);
                anaResult = startAnalyse(initResult["starttime"], initResult["classifiedLog"]);
                console.log(anaResult);

                var modaldata = nunjucks.renderString(' \
          <div class="modal fade in" id="myModal" tabindex="-1" role="dialog" \
          aria-hidden="true" style="display: none;"> \
             <div class="modal-dialog"> \
                <div class="modal-content"> \
                   <div class="modal-header"> \
                      <button type="button" class="close"  \
                         data-dismiss="modal" aria-hidden="true"> \
                            &times; \
                      </button> \
                      <h4 class="modal-title" id="myModalLabel"> \
                         UU用户log分析 \
                      </h4> \
                   </div> \
                   <div class="modal-body"> \
                      <div id="myCarousel" class="carousel slide" data-wrap="false"> \
                          <!-- 轮播（Carousel）项目 --> \
                          <div class="carousel-inner"> \
                              <div class="item active" style="text-align:center;"> \
                                  <p>{{ result.acctime }}</p> \
                                  <p>{{ result.nodename }}</p> \
                                  <p>{{ result.nodeInfo }}</p> \
                                  <p>{{ result.gameinfo }}</p> \
                                  <p>{{ result.isAccSuccss }}</p> \
                                  {% for errorcode in result.errorCodes %} \
                                    <p>{{ errorcode }}</p> \
                                  {% endfor %} \
                                  <p>{{ result.netInfo }}</p> \
                              </div> \
                          </div> \
                          <!-- 控制按钮 --> \
                         <div style="text-align:center;"> \
                            <input type="button" class="btn prev-slide" value="上一条加速记录"> \
                            <input type="button" class="btn slide-zero" value="最后一条加速记录"> \
                            <input type="button" class="btn next-slide" value="下一条加速记录"> \
                         </div> \
                      </div> \
                   </div> \
                   <div class="modal-footer"> \
                      <button type="button" class="btn btn-default"  \
                         data-dismiss="modal">关闭 \
                      </button> \
                   </div> \
                </div><!-- /.modal-content --> \
          </div>',
                    anaResult);
                var msgObj = document.createElement("div");
                msgObj.innerHTML = modaldata;
                document.body.appendChild(msgObj);
            }
        }
    });

    $("body").on("click", ".prev-slide", function () {
        $("#myCarousel").carousel('pause');
        if (anaResult != null && carouselNum == 0) {
            anaResult = startAnalyse(anaResult["starttime"], initResult["classifiedLog"]);
            console.log(anaResult);
        }
        if (anaResult != null && carouselNum == 0) {
            var carouselData = nunjucks.renderString(' \
            <p>{{ result.acctime }}</p> \
            <p>{{ result.nodename }}</p> \
            <p>{{ result.nodeInfo }}</p> \
            <p>{{ result.gameinfo }}</p> \
            <p>{{ result.isAccSuccss }}</p> \
            {% for errorcode in result.errorCodes %} \
              <p>{{ errorcode }}</p> \
            {% endfor %} \
            <p>{{ result.netInfo }}</p>', anaResult);
            var carouselObj = document.createElement("div");
            carouselObj.className = "item";
            carouselObj.style.cssText = "text-align:center;"
            carouselObj.innerHTML = carouselData;
            carouselMax++;
            $("#myCarousel .carousel-inner").prepend(carouselObj);
            $("#myCarousel").carousel(0);
        } else if (carouselNum > 0) {
            $("#myCarousel").carousel(--carouselNum);
        }

    });
    $("body").on("click", ".next-slide", function () {
        $("#myCarousel").carousel('pause');
        if (carouselNum < carouselMax) {
            $("#myCarousel").carousel(++carouselNum);
        }
    });
    $("body").on("click", ".slide-zero", function () {
        $("#myCarousel").carousel('pause');
        carouselNum = carouselMax
        $("#myCarousel").carousel(carouselNum);
    });

    /**
     *  下载获取用户log文件信息
     *  @param theURL {String}  目标下载文件的地址
     *  @returns {List}  按行分割，返回log信息
     */
    function loadXMLDoc(theURL) {
        var data = "";
        let xmlhttp;
        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari, SeaMonkey
            xmlhttp = new XMLHttpRequest();
        } else {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                data = xmlhttp.responseText;
                bugout.log("loadXMLDoc 下载用户log文件完成");
                //alert(xmlhttp.responseText);
            }
        }
        xmlhttp.overrideMimeType("text/html;charset=gb2312");
        xmlhttp.open("GET", theURL, false);
        xmlhttp.send();
        return data.split('\n');
    }

    /**
     *  在分析log信息前，先对log信息做一次预处理，起到分类信息的作用，不同信息存储在不同的字典中
     *  @param loglines {List}  最初原始的log文件信息
     *  @returns    {Object}    按类型将log信息进行分类后的结果
     */

    function logClassify(loglines) {
        var gameNameRegExp = /<<<<v40 ---(.*)---/;      //游戏名、区、服（新版）
        var accNodeRegExp = /StartVPN node:(.*),mode:(.*)/;   //加速节点(新版)
        var accAutoNodeRegExp = /\[节点备选] (.*)/;
        var accSuccessFlagRegExp = /status = 0x4/; //加速成功flag
        var errorCode = /error_code( = |:)(\d+)/;    //错误码
        var logtime = /^\[(.*?)\]/;     //log时间
        var ping = /loc=(.*), netask_port=.*, rtt_weight=.*,rtt=\[icmp\](\d+)\(\[udp\](\d+)\)\+\[acc2game\](\d+)=\d+, loss=\[icmp\](\d+)\(\[udp\](\d+)\)/;    //节点延时与丢包
        var ping_1 = /loc=(.*), netask_port=.*, rtt_weight=.*,rtt=\(\[udp\](\d+)\)\+\[acc2game\](\d+)=\d+, loss=\(\[udp\](\d+)\)/;    //另一种格式

        var accGameDic = {};  //曾加速游戏列表
        var accNodeDic = {};   //曾加速节点列表
        var accSuccessDic = {};    //曾加速成功标识列表
        var errorDic = {};     //曾发生错误列表
        var pingDic = {};      //历史各节点(不带节点编号)延时情况列表
        var exPingDic = {};      //历史各节点(带节点编号)延时情况列表

        for (var i = loglines.length - 1; i >= 0; i--) {
            if (loglines[i].match(logtime)) {
                var logdate = new Date(RegExp.$1);
                var datenum = logdate.valueOf() + "(第" + i + "行)";

                if (loglines[i].match(gameNameRegExp)) {
                    accGameDic[datenum] = RegExp.$1;
                } else if (loglines[i].match(accNodeRegExp)) {
                    accNodeDic[datenum] = RegExp.$1 + '|' + RegExp.$2;
                } else if (loglines[i].match(accAutoNodeRegExp)) {
                    if (i - 2 >= 0 && loglines[i - 1].match(accAutoNodeRegExp) && loglines[i - 2].match(accAutoNodeRegExp)) {
                        accNodeDic[datenum] = RegExp.$1;
                        i -= 2;
                    }
                } else if (loglines[i].match(accSuccessFlagRegExp)) {
                    accSuccessDic[datenum] = true;
                } else if (loglines[i].match(errorCode)) {
                    if (RegExp.$2 == 0 || RegExp.$2 == 200) {
                        continue
                    }
                    ;
                    errorDic[datenum] = RegExp.$2;
                } else if (loglines[i].match(ping)) {
                    exPingDic[datenum] = [RegExp.$1, RegExp.$2, RegExp.$3, RegExp.$4, RegExp.$5, RegExp.$6];
                    if (pingDic[RegExp.$1]) {
                        pingDic[RegExp.$1].push([RegExp.$2, RegExp.$3, RegExp.$4, RegExp.$5, RegExp.$6]);
                    } else {
                        pingDic[RegExp.$1] = [[RegExp.$2, RegExp.$3, RegExp.$4, RegExp.$5, RegExp.$6]];
                    }
                    ;
                } else if (loglines[i].match(ping_1)) {
                    exPingDic[datenum] = [RegExp.$1, RegExp.$2, RegExp.$3, RegExp.$4];
                    if (pingDic[RegExp.$1]) {
                        pingDic[RegExp.$1].push([RegExp.$2, RegExp.$3, RegExp.$4]);
                    } else {
                        pingDic[RegExp.$1] = [[RegExp.$2, RegExp.$3, RegExp.$4]];
                    }
                    ;
                }
                ;
            }
            ;
        }
        ;
        return {
            "accGameDic": accGameDic,
            "accNodeDic": accNodeDic,
            "accSuccessDic": accSuccessDic,
            "errorDic": errorDic,
            "pingDic": pingDic,
            "exPingDic": exPingDic,
            "errorInterpretation": errorInterpretation
        }
    };

    /**
     *  将字典的key转数字，按数字由小达大排序
     *  @param keys {List}  待排序的列表
     *  @returns {List}     由小到大排序后的列表
     */
    function sortDic(keys) {
        function sortFunc(a, b) {
            return parseInt(a, 10) - parseInt(b, 10)
        }

        return keys.sort(sortFunc);
    };

    /**
     * 若目标字典的key有存在于指定时间段内，则返回该key对应的value
     * @param starttime {String}    查找的起始时间
     * @param endtime   {String}    查找的终止时间
     * @param dic   {Object}    被查找的字典
     * @returns {List}  返回在指定时间段内的所有value值
     */
    function findInDic(starttime, endtime, dic) {
        var result = [];
        var starttime = parseInt(starttime, 10);
        var endtime = parseInt(endtime, 10);
        endtime = endtime == -1 ? Number.MAX_VALUE : endtime;
        for (var key in dic) {
            var keytime = parseInt(key, 10);
            if ((starttime <= keytime ? keytime : false) ? keytime <= endtime : false) {
                result.push(dic[key]);
            }
            ;
        }
        ;
        result = jQuery.unique(result);
        return result;
    };

    /**
     * 寻找目标字典的key满足最接近指定时间，且早于指定时间。返回该key对应的value
     * @param starttime {String}    一个时间值，搜索的数据时间应早于该时间
     * @param dic   {Object}    目标要搜索的字典，其key是一个时间字符串
     * @param isWant    {function}  搜索到的value是否满足条件，通过isWant函数进行检查
     * @returns {Object}    返回满足条件的value值
     */
    function findNearDic(starttime, dic, isWant) {
        var starttime = parseInt(starttime, 10);
        var sortkeys = sortDic(Object.keys(dic));
        for (var i = sortkeys.length - 1; i >= 0; i--) {
            var keytime = sortkeys[i];
            if (parseInt(keytime, 10) <= starttime) {
                if (!isWant) {
                    return dic[sortkeys[i]];
                } else if (isWant(dic[sortkeys[i]])) {
                    return dic[sortkeys[i]];
                } else {
                    continue;
                }
            }
        }
        ;
        return null;
    }

    /**
     * 对starttime至endtime间的数据进行分析
     * @param starttime     {number}    开始加速节点的时刻
     * @param endtime       {number}    下一次再开始加速节点的时刻
     * @param nodename      {string}    本次用于分析的加速节点名称
     * @param accGameDic    {Object}   用户历史加速游戏名称对象
     * @param accSuccessDic    {Object}    存储用户历史加速成功的时间点
     * @param errorDic  {Object}    用户log中记录到的错误码
     * @param pingDic {Object}  用户log中连接各节点(仅节点名称，不含节点编号)时的延时、丢包率等信息
     * @param exPingDic {Object}   用户log中连接各节点(含节点编号)时的延时、丢包率等信息
     * @param errorInterpretation {Object}  错误码对应解释
     * @returns result {Object}     返回分析结果
     */
    function onceAnalyse(starttime, endtime, nodename, accGameDic, accSuccessDic, errorDic, pingDic, exPingDic, errorInterpretation) {
        bugout.log("onceAnalyse 开始一轮分析");
        var result = {nodename: nodename};
        if (starttime) {
            result['acctime'] = dateFormat(new Date(parseInt(starttime, 10)), 'yyyy-MM-dd hh:mm:ss');
        }
        ;

        //查看当时该节点的延迟情况
        var nodeNetInfo = null;
        var Netsortkeys = sortDic(Object.keys(exPingDic));
        for (var i = Netsortkeys.length - 1; i >= 0; --i) {
            if (parseInt(Netsortkeys[i], 10) <= parseInt(starttime, 10)) {
                if (nodename.indexOf(exPingDic[Netsortkeys[i]][0]) != -1) {
                    nodeNetInfo = exPingDic[Netsortkeys[i]];
                    if (nodeNetInfo.length == 6)
                        result['nodeInfo'] = "(延时icmp: " + nodeNetInfo[1] + " udp: " + nodeNetInfo[2] + " acc2game: " + nodeNetInfo[3] + " 丢包icmp: " + nodeNetInfo[4] + "% udp: " + nodeNetInfo[5] + "%)"
                    else
                        result['nodeInfo'] = "(延时udp: " + nodeNetInfo[1] + " acc2game: " + nodeNetInfo[2] + " 丢包 udp: " + nodeNetInfo[3] + "%)"
                    break;
                }
            }
        }
        ;

        //找到本次加速对应的游戏
        var gameinfo = findNearDic(starttime, accGameDic);
        if (gameinfo != null) {
            result['gameinfo'] = gameinfo;
        }

        //查看本次加速是否加速成功
        if (findInDic(starttime, endtime, accSuccessDic).length > 0) {
            result['isAccSuccss'] = "该用户本次加速成功";
        } else {
            result['isAccSuccss'] = "该用户本次加速失败";
        }

        //查看本次加速过程中是否有错误发生
        var errorCodes = findInDic(starttime, endtime, errorDic)
        if (errorCodes.length > 0) {
            result['errorCodes'] = [];
            for (let i = 0; i < errorCodes.length; i++) {
                if (errorCodes[i] in errorInterpretation) {
                    result['errorCodes'].push("【错误码" + errorCodes[i] + "】" + errorInterpretation[errorCodes[i]]);
                } else {
                    result['errorCodes'].push("【错误码" + errorCodes[i] + "】暂未找到对应的错误码解释，请前往https://qa.devouter.uu.netease.com/uu/errorCodeConf进行添加");
                }
                ;

            }
        }

        //查看本次加速节点，在该用户历史记录里延迟、丢包率是否有较大波动
        var icmpMin = Number.MAX_VALUE,
            icmpMax = -1,
            udpMin = Number.MAX_VALUE,
            udpMax = -1;
        var isLoss = false;
        var lossNode = null;
        var lossCount = 0;
        var totalCount = 0;
        for (var key in pingDic) {
            if (nodename.indexOf(key) != -1) {
                lossNode = key;
                for (let i = 0; i < pingDic[key].length; i++) {
                    ++totalCount;

                    icmpMin = icmpMin > pingDic[key][i][0] ? pingDic[key][i][0] : icmpMin;
                    icmpMax = icmpMax < pingDic[key][i][0] ? pingDic[key][i][0] : icmpMax;
                    udpMin = udpMin > pingDic[key][i][1] ? pingDic[key][i][1] : udpMin;
                    udpMax = udpMax < pingDic[key][i][1] ? pingDic[key][i][1] : udpMax;

                    if (pingDic[key][i][2] >= 10 || pingDic[key][i][3] >= 10) {
                        isLoss = true;
                    }

                    if (pingDic[key][i][2] >= 10 || pingDic[key][i][3] >= 10) {
                        ++lossCount;
                    }
                }
                if (icmpMax >= 2 * icmpMin || udpMax >= 2 * udpMin || isLoss) {
                    result['netInfo'] = "";
                    if (isLoss) {
                        result['netInfo'] += "发现您在" + lossNode + "节点上曾存在较大丢包（≥10%）现象,请尝试使用UU其它加速节点。"
                    }
                    if (icmpMax >= 2 * icmpMin || udpMax >= 2 * udpMin) {
                        result['netInfo'] += "发现您在" + lossNode + "节点上曾存在较大延迟抖动,请尝试使用UU其它加速节点。"
                    }
                }
            } else {
                for (var i in pingDic[key]) {
                    ++totalCount;
                }
            }
        }
        if (lossCount > totalCount / 3) {
            result['netInfo'] = "发现您的网络对所有UU节点都存在一定程度的丢包（≥10%）情况，请检查您的本地网络。"
        }
        bugout.log("onceAnalyse 一轮分析结束");
        return result;
    };

    /**
     * 对日期进行格式化，
     * @param date 要格式化的日期
     * @param format 进行格式化的模式字符串
     *     支持的模式字母有：
     *     y:年,
     *     M:年中的月份(1-12),
     *     d:月份中的天(1-31),
     *     h:小时(0-23),
     *     m:分(0-59),
     *     s:秒(0-59),
     *     S:毫秒(0-999),
     *     q:季度(1-4)
     * @return String
     * @author yanis.wang@gmail.com
     */
    function dateFormat(date, format) {
        if (format === undefined) {
            format = date;
            date = new Date();
        }
        var map = {
            "M": date.getMonth() + 1, //月份
            "d": date.getDate(), //日
            "h": date.getHours(), //小时
            "m": date.getMinutes(), //分
            "s": date.getSeconds(), //秒
            "q": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
            var v = map[t];
            if (v !== undefined) {
                if (all.length > 1) {
                    v = '0' + v;
                    v = v.substr(v.length - 2);
                }
                return v;
            } else if (t === 'y') {
                return (date.getFullYear() + '').substr(4 - all.length);
            }
            return all;
        });
        return format;
    }

    /**
     * 初始化分析log，先下载log文件，再对log文件进行分类
     * @param theURL {string}   目标下载文件的地址
     * @returns {Object}    返回分类后的文件内容，并初始时间戳为-1
     */
    function initAnalyse(theURL) {
        bugout.log("initAnalyse 开始下载用户log文件");
        var loglines = loadXMLDoc(theURL);
        bugout.log("initAnalyse 开始整理抽取用户log文件");
        var classifiedLog = logClassify(loglines);

        return {
            "starttime": "-1",
            "classifiedLog": classifiedLog
        };
    }

    /**
     * 分析log的入口，每次分析都调用该函数
     * @param pretime {String}  上次分析log的时间戳，本次分析会查询发生在该时间戳之前的最近一次加速
     * @param classifiedLog     {Object}    已归类好的log信息
     * @returns {Object}    返回本次分析结果
     */
    function startAnalyse(pretime, classifiedLog) {
        bugout.log("startAnalyse 开始分析用户的一次加速行为");
        var starttime;
        var accNodeDic = classifiedLog["accNodeDic"];
        var sortedAccNodeKeys = sortDic(Object.keys(accNodeDic));
        if (pretime == -1) {
            starttime = sortedAccNodeKeys[sortedAccNodeKeys.length - 1];
        } else {
            var num = (sortedAccNodeKeys.indexOf(pretime)) - 1;
            if (num < 0) {
                return null;
            }
            starttime = sortedAccNodeKeys[num];
        }

        var nodename = accNodeDic[starttime];
        if (nodename != undefined) {
            var onceResult = onceAnalyse(starttime, pretime, nodename,
                classifiedLog["accGameDic"], classifiedLog["accSuccessDic"], classifiedLog["errorDic"], classifiedLog["pingDic"], classifiedLog["exPingDic"], classifiedLog["errorInterpretation"]);

            return {
                "starttime": starttime,
                "result": onceResult
            };
        } else {
            return {
                "result": {nodename: "未发现该玩家有加速记录"}
            }
        }
    }

    setTimeout(feedback_to_jump, 1000);
}());