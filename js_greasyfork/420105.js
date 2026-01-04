// ==UserScript==
// @name         环保在线 资料上传敏感词自动屏蔽
// @namespace    https://www.calendarLi.com
// @version      2.0
// @description  环保在线B2BVIP后台资料上传界面 快捷清除敏感词
// @author       CalendarLi
// @match        *://www.hbzhan.com/UserManage/default.aspx?*
// @match        *://www.chem17.com/UserManage/default.aspx?*
// @match        *://www.hbzhan.com/UserManage/Default.aspx?*
// @icon         https://upyun.calendarli.com/logo.png
// @grant        none
// @copyright    该脚本完全由 CalendarLi@greasyfork 原创，谢绝抄袭部分或全部代码！如有借鉴代码，请声明并标注脚本链接。
// @copyright:en   This script is completely original by CalendarLi@greasyfork, please do not copy part or all of the code! If you have reference code, please declare and mark the script link.
// @copyright:ja   このスクリプトはCalendarLi @ greasyforkによって完全にオリジナルです。コードの一部または全部をコピーしないでください。 参照コードがある場合は、スクリプトリンクを宣言してマークを付けてください。
// @downloadURL https://update.greasyfork.org/scripts/420105/%E7%8E%AF%E4%BF%9D%E5%9C%A8%E7%BA%BF%20%E8%B5%84%E6%96%99%E4%B8%8A%E4%BC%A0%E6%95%8F%E6%84%9F%E8%AF%8D%E8%87%AA%E5%8A%A8%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/420105/%E7%8E%AF%E4%BF%9D%E5%9C%A8%E7%BA%BF%20%E8%B5%84%E6%96%99%E4%B8%8A%E4%BC%A0%E6%95%8F%E6%84%9F%E8%AF%8D%E8%87%AA%E5%8A%A8%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    /*
    *KW关键词检测
    */
    $(function(){
        $('.nextStep div a').click(function(){
            t()
            console.log('Tok')
        })
        $($('.option div b')[2]).click(function(){
            t()
            console.log('Bok')
        })
        function t(){
            console.log($('#Step2')[0].style.display)
            if($('#Step2')[0].style.display=="block"||$('#Step2')[0].style.display==''){
                $('#cke_1_top').append($('<div id="ClearSensitiveWords">').html('清除敏感词').attr({style:'position: absolute;right: 12px;margin-top: -32px; background: #b254c3;padding: 4px 5px;color: aliceblue;border-radius: 5px;border: 1px solid #9e9e9e;cursor: pointer;'}))
            }
            $('#cke_1_top').on('click', '#ClearSensitiveWords', function(ev) {
                var conte=CKEDITOR.instances.txtDetail.document.$.documentElement.getElementsByClassName('cke_editable cke_editable_themed cke_contents_ltr cke_show_borders')[0].innerHTML
                for(var i=0;i<words.length;i++){
                    conte=conte.replace(new RegExp(words[i],'ig'), '')
                }
                CKEDITOR.instances.txtDetail.document.$.documentElement.getElementsByClassName('cke_editable cke_editable_themed cke_contents_ltr cke_show_borders')[0].innerHTML=conte
            })
        }
        var words=['100%','高端','独','警示','统独','绝对','军用','专用','独有','指定','刀具','前所未有','一流','口罩','轮功','游戏','联系','理想','卸任','受欢迎','先进','巡逻','击锤','全方位','航空','专利','领先','最','国家','极','首','第','家','万能','无敌','独一无二','精准','王','超级','唯一','全国','全球','世界','独家','top1','TOP1','','100%','王牌','级','极致','尖端','顶级','抢购','卓越','技术支持']
        $('#dlKeyword input').blur(function(){
            function valinput(conte,k){
                for(var i=0;i<words.length;i++){
                    conte=conte.replace(new RegExp(words[i],'ig'), '')
                }
                $('#dlKeyword input')[k].value=conte
            }
            var inputLen=$('#dlKeyword input').length
            for(var i=0;i<=inputLen-1;i++){
                var val=$('#dlKeyword input')[i].value
                valinput(val,i)
            }
        })
        $('#txtDescribe').blur(function(){
            var conte=$($('textarea')[0]).val()
            for(var i=0;i<words.length;i++){
                conte=conte.replace(new RegExp(words[i],'ig'), '')
            }
            $($('textarea')[0]).val(conte)
        })

    })
})();



