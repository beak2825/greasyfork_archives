// ==UserScript==
// @name         SLSshit
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  none
// @author       BQsummer
// @include      https://sls.console.aliyun.com/lognext/project/*/logsearch/spring-syslog?*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/427252/SLSshit.user.js
// @updateURL https://update.greasyfork.org/scripts/427252/SLSshit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function(){
        hide_row_log();
        add_css();

        // 查询按钮点击后移除之前的日志
//        $("span[class^='SqlRow__style__search-words']").eq(0).click( function () {
//          $(".log_context").remove();
//        });
//        // 页面跳转移除之前日志
//        $(document).on('click','.next-pagination-item',function(){
//            $(".log_context").remove();
//        });
//        $(document).on('click','.next-select-menu-item',function(){
//            $(".log_context").remove();
//            // FIXME 回到顶部不生效
//            $("div[class^='BackTop__style__back-top-btn']").click();
//        });
        // 拦截日志查询接口
        const originFetch = fetch;
        unsafeWindow.fetch = async (url, request) => {
            const response = await originFetch(url, request)
            if (url.indexOf('logstoreindex/getLogs.json') > -1) {
                try {
                    const text = await response.clone().text()
                    response.text = () => { return new Promise((resolve) => { resolve(text) }) }
                    const res = JSON.parse(text);
                    // 清除上一次日志
                    $(".log_context").remove();
                    show_log(res);
                } catch (e) {
                    console.error(e)
                }
            }
            return response;
        }


    });

    // 自定义日志展示
    function show_log(res) {
        let table = "";
        let logs = res.data.logs;
        // 处理terms
        let terms = mapTerms(res.data.terms);
        for(let log in logs){
            let summary_div = create_summary(logs[log]);
            let message_div = create_div(text_format(logs[log], terms), 'message_div_style');
            let detail_div = create_div(create_detail(logs[log], terms), 'detail_div_style');
            table += "<div class='blur_hide_150 log_context'>" + summary_div + message_div + detail_div + "</div>";
        }
        // 加载所有日志
        $("div[class^='RawLog__style__data-content']").children().eq(1).append(table);
        // 箭头添加监听器
        if($("div[class='arrow']") != undefined) {
            $("div[class='arrow']").click(function(){
                arrow_click($(this));
                return false;
            });
        }
        // 日志详情隐藏
        $(".detail_div_style").hide();
    }

    // 检索的关键字，倒换valu和key
    function mapTerms(terms) {
        if(terms.length >0) {
            let keyValueMap = new Map();
            for (let term of terms) {
                keyValueMap.set(term[1], term[0]);
            }
            return keyValueMap;
        }
        return new Map();
    }

    // 隐藏sls原始日志(不能remove,原生代码会报错)
    function hide_row_log() {
        $("div[class^='RawLog__style__loglist-content']").eq(0).css({"display":"none" });
    }

    // 添加自定义样式
    function add_css() {
        $('body').append("<style>" + style + "</style>");
    }

    // 创建div
    function create_div(message, ...clazzs) {
        let clazzTxt = "";
        clazzs.forEach((clazz) => {
            clazzTxt = clazzTxt + clazz + " ";
        })
        return "<div class='"+ clazzTxt + "'>" + message + "</div>";
    }

    //
    function text_format(log, terms) {
        let text = log.message;
        // normal日志，错误堆栈信息做换行处理
        if (text !== undefined) {
            //text = line_wrap(text);
        } else {
            // 非normal日志
            let logBuilder = log.logtime + " [" + log.context + "|" + log.nodeIp + "|" + log.port + "] [" + log.thread + "] [" + log.className + "] [" + log.level + "] [" + log.line + "] - {";
            for (let val in log) {
                if(val.startsWith("message_json") && !val.includes('commonRequestParameters')) {
                    logBuilder = logBuilder + '"' + val.substring(13) + '" : "' + log[val] + '",'
                }
            }
            if (logBuilder.endsWith(",")) {
                logBuilder = logBuilder.substr(0, logBuilder.length-1);
            }
            text = logBuilder + "}";
            //text = line_wrap(text);
        }
        // 搜索关键字加粗加红
        if(terms.size >0) {
            for (let [key, value] of terms) {
                let key_word = value.replace('\*', '');
                if (key_word != '') {
                    text = blod_keys(text, key_word);
                }
            }
        }
        return text;
    }

    // 换行符替换
    function line_wrap(text) {
        // console.log("wrap");
        text = text.replace(/(\n)/g, '<br />');
        text = text.replace(/(\t)/g,'&nbsp;&nbsp;&nbsp;&nbsp;');
        return text;
    }

    // 检索关键字加粗加红（预览的日志是替换，不准确），忽略大小写
    function blod_keys(text, key) {
        let reg_str = '(' + key + ')';
        return text.replace(new RegExp(reg_str, 'ig'), "<b style='color:red'>" + key + "</b>");
    }

    // 日志详情展开
    function arrow_click(navice_dom) {
        let arrow_dom = $(navice_dom).children().eq(0);
        if(arrow_dom.hasClass('down_arrow')) {
            arrow_dom.parent().eq(0).parent().eq(0).parent().eq(0).removeClass('blur_hide_150');
            arrow_dom.parent().eq(0).parent().eq(0).parent().eq(0).children().eq(1).addClass('blur_hide_120');
            arrow_dom.removeClass('down_arrow');
            arrow_dom.addClass('up_arrow');
            arrow_dom.addClass('arrow_reverse');
            arrow_dom.parent().eq(0).parent().eq(0).parent().eq(0).children().eq(2).show();
            arrow_dom.parent().eq(0).parent().eq(0).parent().eq(0).addClass('group_msg');
        } else {
            arrow_dom.parent().eq(0).parent().eq(0).parent().eq(0).addClass('blur_hide_150');
            arrow_dom.parent().eq(0).parent().eq(0).parent().eq(0).children().eq(1).removeClass('blur_hide_120');
            arrow_dom.removeClass('up_arrow');
            arrow_dom.addClass('down_arrow');
            arrow_dom.removeClass('arrow_reverse');
            arrow_dom.parent().eq(0).parent().eq(0).parent().eq(0).children().eq(2).hide();
            arrow_dom.parent().eq(0).parent().eq(0).parent().eq(0).removeClass('group_msg');
        }
    }

    // 日志概览
    function create_summary(log) {
        let down = "<div class='arrow'><svg viewBox='0 0 2700 2500' preserveAspectRatio='xMinYMin' class='down_arrow' width='15px' height='15px'><path d='M1995.591408 0c11.518934 0 22.525916 3.583669 31.485087 9.983077a46.075738 46.075738 0 0 1 17.918343 53.755027l-7.67929 13.822722-971.942095 927.146239a55.546862 55.546862 0 0 1-70.905441 10.751005l-12.030887-10.751005L10.751006 77.560826A46.075738 46.075738 0 0 1 0 48.635501C0 26.109585 16.126508 7.423313 38.396448 1.791834L52.21917 0h1943.372238z'></path></svg></div>"
        let logtime_div = create_div(log.logtime, 'summary_ele_div_style');
        let host_div = create_div(log.host, 'summary_ele_div_style');
        let topic_div = create_div(log.topic, 'summary_ele_div_style');
        let context_div = create_div(log.context, 'summary_ele_div_style');
        let summary_div = create_div(down + logtime_div + host_div + topic_div, 'summary_div_style');
        return summary_div;
    }

    // 日志详情
    function create_detail(log, terms) {
        let detail = "";
        for (let val in log) {
            if(!val.startsWith("__")) {
                let log_detail = log[val];
                if (terms.get(val) != undefined) {
                    let key = terms.get(val).replace('\*', '');
                    if (key != '') {
                        let reg_str = '(' + key + ')';
                        log_detail = log_detail.replace(new RegExp(reg_str, 'ig'), "<b style='color:red'>" + key + "</b>");
                    }
                }
                let col = create_div(val, 'col_style');
                let value = create_div(line_wrap(log_detail), 'col_value_style');
                detail += create_div(col + " : " + line_wrap(value), 'col_and_value_style');
            }
        }
        return detail;
    }



    var style = `
    .log_context {
        border-color:#dbe3d9;
        border-bottom-style:solid;
        border-bottom-width:1px;

        padding-bottom:10px;
        padding-left:13px;
        padding-right:13px;
        padding-top:10px;
        font-size:12px;

        word-break: break-all;
    }
    .blur_hide_150 {
        max-height:150px;
        overflow-y:hidden;
        text-overflow:ellipsis;
        background:linear-gradient(180deg, rgba(255,255,255,0) 110px, #f5f5f6 125px, #cccccc 150px);
    }
    .blur_hide_120 {
        max-height:120px;
        overflow-y:hidden;
        text-overflow:ellipsis;
        background:linear-gradient(180deg, rgba(255,255,255,0) 90px, #f5f5f6 100px, #cccccc 120px);
    }
    .max_height_150 {
        max-height:150px;
    }
    .summary_div_style{
        display:flex;
        justify-content:flex-start;
        font-weight:bold;
        margin-bottom:7px;
    }
    .message_div_style{
    }
    .summary_ele_div_style{
        display:flex;
        flex-grow:1;
        margin-left:30px;
        margin-right:30px;
    }
    .arrow {
        width:15px;
        height:15px;
    }
    .down_arrow {

    }
    .up_arrow {

    }
    .col_style {
        display: inline;
        background:rgba(0,86,144,.1);
        padding: 1px 3px!important;
        margin: 2px 0;
        line-height: 19px;
    }
    .col_value_style {
        display: inline;
        padding: 1px 3px!important;
        margin: 2px 0;
        line-height: 19px;
    }
    .col_and_value_style {

    }
    .arrow_reverse {
        transform: rotate(180deg);
    }
    .group_msg {
       border-left-width:5px;
       border-left-color:#cccccc;
       border-left-style:solid;
    }
    `;

})();