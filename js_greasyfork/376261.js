// ==UserScript==
// @name       fanshu
// @namespace    https://global-oss.bigo.tv
// @version      0.4
// @description  fan shu
// @author     OLEREO!
// @match      https://global-oss-jf2jja.bigo.tv/voiceMonitor/report/index*
// @match      https://global-oss-jf2db.bigo.tv/voiceMonitor/report/index*
// @match      https://nms.fanshuxiaozu.com/console/blackroom/index*
// @downloadURL https://update.greasyfork.org/scripts/376261/fanshu.user.js
// @updateURL https://update.greasyfork.org/scripts/376261/fanshu.meta.js
// ==/UserScript==
String.prototype.have = function (str) {
    str = str.replace(")", "").replace("(", "");
    let s = this.replace(")", "").replace("(", "");
    return (s.search(str) > -1);
};


if(window.location.href.have('voiceMonitor/report/index')){
    let reasonJson = [ " 广告（售卖协议） ", " 广告（金钱广告） ", " 广告（色情广告） ", " 广告（竞品广告） ", " 涉黄（娇喘） ", " 涉黄（找人磕炮/聊污） ", " 资料违规（房名/喇叭引战） ", " 资料违规（色情头像） ", " 资料违规（辱骂官方） ", " 炸房（炸房骚扰） ", " 辱骂（辱骂他人） ", " 辱骂（辱骂官方） ", " 辱骂（连续引战） ", " 运营反馈（多次辱骂他人） ", " 其他（冒充官方） "]

    let selectReason = document.getElementById('reason-select');
    selectReason.innerHTML = "";
    selectReason.options.add(new Option('请选择原因',''));

    reasonJson.forEach(function (reason) {
        selectReason.options.add(new Option(reason,reason));
    });

    selectReason.options.add(new Option('其他',''));
}else if(window.location.href.have("https://nms.fanshuxiaozu.com/console/blackroom/index")){
    let reasonJson = ["引战", "涉黄", "挂机", "辱骂", "低俗", "广告", "官方", "涉赌"];

    let btAdd = document.querySelector('body > div.x-body > xblock > button');
    btAdd.addEventListener("click", function () {
        let iframTjxhw = document.getElementsByClassName('layui-layer layui-layer-iframe layer-anim')[0];

        iframTjxhw.getElementsByTagName('iframe')[0].addEventListener('load', function () {

            iframTjxhw.getElementsByTagName('iframe')[0].contentWindow.layui.use(['form'], function () {
                let form = iframTjxhw.getElementsByTagName('iframe')[0].contentWindow.layui.form;

                let docIframDoc = iframTjxhw.getElementsByTagName('iframe')[0].contentWindow.document;

                let roomName = docIframDoc.getElementById("roomName");
                roomName.style.display = "NONE";

                let seCategory = docIframDoc.createElement('select');
                seCategory.setAttribute("lay-filter", "onSeChange");

                reasonJson.forEach(function (reason) {
                    seCategory.options.add(new Option(reason, "【"+reason + "】"));
                });

                let ipRemaker = docIframDoc.createElement('input');
                ipRemaker.style.width = '300px';
                ipRemaker.style.height = '40px';

                form.on('select(onSeChange)', function (data) {
                    roomName.style.display = "";
                    roomName.value = data.value;
                    roomName.focus();
                });

                docIframDoc.querySelector('body > div > form > div:nth-child(2) > div.layui-input-block').insertBefore(seCategory, roomName);

                form.render();
            });
        })
    });
}

