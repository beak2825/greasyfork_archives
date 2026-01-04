// ==UserScript==
// @name        C语言练习平台
// @author      author
// @description description
// @namespace   http://tampermonkey.net/
// @license     GPL version 3
// @encoding    utf-8
// @include     http://116.13.208.231/c/q.aspx*
// @include     http://116.13.208.231/c/view.aspx?*
// @grant       GM_xmlhttpRequest
// @run-at      document-end
// @version     1.1.4
// @downloadURL https://update.greasyfork.org/scripts/398356/C%E8%AF%AD%E8%A8%80%E7%BB%83%E4%B9%A0%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/398356/C%E8%AF%AD%E8%A8%80%E7%BB%83%E4%B9%A0%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==
(function() {
    //默认5分钟自动提交
    var timing = 1000*60*5;
    var nd = 3; //评论试题的难度 选项：0-4, '非常简单', '简单', '一般', '困难', '极难'
    var zs = 'http://116.13.208.231/c/view.aspx?'; //完成后代码显示页面

    var qid = all_data[q_types[0]][0];
    var url = window.location.href;

    if(url.indexOf(zs) != -1){
        var elem_li = document.createElement('div');
        elem_li.innerHTML='<p>返回练习难度标签抽取题目。</p><br/>'+
            '<button type="button" id="btn_code" onclick="redirect(\'choose.aspx?level=1\')">非常简单</button>&nbsp;&nbsp;&nbsp;'+
            '<button type="button" id="btn_code" onclick="redirect(\'choose.aspx?level=2\')">容易</button>&nbsp;&nbsp;&nbsp;'+
            '<button type="button" id="btn_code" onclick="redirect(\'choose.aspx?level=3\')">中等</button>&nbsp;&nbsp;&nbsp;'+
            '<button type="button" id="btn_code" onclick="redirect(\'choose.aspx?level=4\')">困难</button>&nbsp;&nbsp;&nbsp;'+
            '<button type="button" id="btn_code" onclick="redirect(\'choose.aspx?level=5\')">极难</button>';
        document.getElementsByClassName("s")[0].appendChild(elem_li);
        //关闭弹框
        var oStarBox = document.getElementById('starBox');
        var aLi = oStarBox.getElementsByTagName('li');
        aLi[nd].click();
    }else{
        GM_xmlhttpRequest({
            method: "get",
            url: "https://ctk.guanwu.online/api/getkt?id=q"+qid,
            onload: function(res) {
                if (res.status == 200) {
                    var aa = '{"tp":'+res.response+'}';
                    var bb =JSON.parse(aa);
                    setTextAreaValue(qid, bb.tp)
                    beautifier(qid)
                }
            }
        });
        window.setTimeout(function() {
            window.onbeforeunload = null;
            $('#'+_real_btn).click();
        }, timing);

    }
})();


