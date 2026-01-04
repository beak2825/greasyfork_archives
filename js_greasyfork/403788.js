// ==UserScript==
// @name         一键删除baidu知道全部提问
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  baidu知道删除全部提问
// @author       鈴宮華緋
// @include      /https:\/\/zhidao\.baidu\.com\/ihome\/homepage\/myask/
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/403788/%E4%B8%80%E9%94%AE%E5%88%A0%E9%99%A4baidu%E7%9F%A5%E9%81%93%E5%85%A8%E9%83%A8%E6%8F%90%E9%97%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/403788/%E4%B8%80%E9%94%AE%E5%88%A0%E9%99%A4baidu%E7%9F%A5%E9%81%93%E5%85%A8%E9%83%A8%E6%8F%90%E9%97%AE.meta.js
// ==/UserScript==

(function() {
    let api = 'https://zhidao.baidu.com/ihome/api/myask?type=default';
    let delete_api = 'https://zhidao.baidu.com/submit/ajax';
    let pn = 0;
    let rn = 50;

    /*
    * url 目标url
    * arg 需要替换的参数名称
    * arg_val 替换后的参数的值
    * return url 参数替换后的url
    */
    function changeURLArg(url, arg, arg_val){
        let pattern = arg + '=([^&]*)';
        let replaceText = arg + '=' + arg_val;
        if(url.match(pattern)) {
            let tmp = '/(' + arg + '=)([^&]*)/gi';
            tmp = url.replace(eval(tmp),replaceText);
            return tmp;
        }else {
            if(url.match('[\?]')){
                return url + '&'+replaceText;
            }else{
                return url + '?'+replaceText;
            }
        }
        return url+'\n'+arg+'\n'+arg_val;
    }

    // 复数替换 url 内参数, arg_arr 和 arg_val_arr 均为数组，为一一对应的关系
    function changeURLArgArr(url, arg_arr, arg_val_arr) {
        for(let i = 0; i < arg_arr.length; i++) {
            let arg = arg_arr[i];
            let arg_val = arg_val_arr[i];
            url = changeURLArg(url, arg, arg_val);
        }
        return url;
    }

    let delete_btn = $('<div>删除全部提问</div>');
    delete_btn.click(function() {
        let timestamp = new Date().getTime();
        $.ajax({
            url: changeURLArgArr(api, ['t'], [timestamp]),
            success: function(data) {
                console.log(data);
                let count = data.data.question.listNum;
                for(let i = pn; i < count; i = i + rn) {
                    $.ajax({
                        url: changeURLArgArr(api, ['pn', 'rn', 't'], [i, rn, timestamp]),
                        success: function(data) {
                            let quest_list = data.data.question.list;
                            for(let i = 0; i < quest_list.length; i++) {
                                let quest = quest_list[i];
                                $.ajax({
                                    url: delete_api,
                                    type: 'post',
                                    data: {
                                        cm: 100013,
                                        qid: quest.qid,
                                    },
                                    success: function(data) {
                                        console.log(data);
                                    }
                                });
                            }
                            window.location.reload();
                        }
                    })
                }
            }
        });
    });
    delete_btn.css({
        'box-sizing': 'border-box',
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '50px',
        height: '50px',
        'z-index': '999',
        background: 'rgb(20, 120, 220)',
        color: 'white',
        padding: '5px',
        'padding-top': '8px',
        'font-size': '12px',
        'text-align': 'center',
        'border-radius': '50%',
        'box-shadow': '0 0 5px #888',
        cursor: 'pointer',
    });
    $('html').append(delete_btn);
})();