// ==UserScript==
// @name         小牛翻译
// @namespace    http://tampermonkey.net/
// @version      0.04
// @description  小牛翻译洗文
// @author       You
// @require	     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @match        https://niutrans.vip/console/textTrans?x=1
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/392716/%E5%B0%8F%E7%89%9B%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/392716/%E5%B0%8F%E7%89%9B%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

// https://test.niutrans.vip/NiuTransServer/testtrans
//
//     from: zh
// to: en
// src_text: 首台核电机的组装在秦山核电站进行，1985年开工，1994年商业运行，电功率为300MW，为我国自行设计建造和运行的原型核电机组。使我国成为继美国、英国、法国、苏联、加拿大和瑞典后，全球第7个能自行设计建造核电机组的国家。
//
// {"from":"zh","to":"en","tgt_text":"The assembly of the first nuclear power plant was carried out in Qinshan Nuclear Power Plant, which was started in 1985 and operated commercially in 1994 with an electric power capacity of 300 MW. It is a prototype nuclear power plant designed, constructed and operated by China itself. Making China the seventh country in the world to design and build its own nuclear power units, following the United States, Britain, France, the Soviet Union, Canada and Sweden. "}

$("body").html(`
<textarea id="pre" style="width: 500px;height:300px;">


</textarea>
<br>
<button id="convert">转换</button>
<br>
<textarea id="result" style="width: 500px;height:300px;">

</textarea>
`);

let apikey;

$("#convert").click(async function () {
    let pre = $("#pre").val();
    let loginData = await $.get(`https://niutrans.vip/NiuTransServerControl/user/isLogin?time=${Date.now()}`);
    if (loginData.apikey) {
        apikey = loginData.apikey;
    } else {
        alert('请登录');
        window.open(`https://niutrans.vip/console/textTrans`);
        return;
    }

    let result = await $.ajax({
        url: 'https://test.niutrans.vip/NiuTransServer/translation',
        type: 'post',
        data: {
            from: "zh",
            to: "en",
            src_text: pre,
            apikey: apikey,
        },
        error: function () {
            alert('调用太频繁，稍后再试')
        }
    });

    let tgt_text = JSON.parse(result).tgt_text;
    let result2 = await $.ajax({
        url: 'https://test.niutrans.vip/NiuTransServer/translation',
        type: 'post',
        data: {
            from: "en",
            to: "ja",
            apikey: apikey,
            src_text: tgt_text,
        },
        apikey: apikey,
        error: function () {
            alert('调用太频繁，稍后再试')
        }
    });

    let tgt_text2 = JSON.parse(result2).tgt_text;

    let resul3 = await $.ajax({
        url: 'https://test.niutrans.vip/NiuTransServer/translation',
        type: 'post',
        data: {
            from: "ja",
            to: "zh",
            apikey: apikey,
            src_text: tgt_text2,
        },
        apikey: apikey,
        error: function () {
            alert('调用太频繁，稍后再试')
        }
    });
    $("#result").val(JSON.parse(resul3).tgt_text);
});