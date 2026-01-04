// ==UserScript==
// @name            exmail.qq.com_view_plus
// @description     自制邮件聚合模式，吊打会话模式，让脚本改变世界(已支持腾讯企业邮箱)
// @version         1.92
// @namespace       https://wanyaxing.com/blog/20190120150811.html
// @author          wyx@wanyaxing.com
// @include         https://exmail.qq.com/cgi-bin/mail_list*
// @run-at         document-body
// @downloadURL https://update.greasyfork.org/scripts/376931/exmailqqcom_view_plus.user.js
// @updateURL https://update.greasyfork.org/scripts/376931/exmailqqcom_view_plus.meta.js
// ==/UserScript==

// 腾讯企业邮箱-聚合模式
if (document.getElementById('frm')) {
    document.getElementById('frm').style.display='none';
    function selectText(element) {
        var selection = window.getSelection();
        selection.setBaseAndExtent(element, 0, element, 1);
    }

    function watchTdTime(_this, tdTime) {
        if (!tdTime)
        {
            var str = _this.innerText;
            if (str.indexOf('前')>0) {
                var num = parseInt((str.replace(/^(\d+?)[^\d]*$/,'$1'))) * 1000;
                if (str.indexOf('分钟前')>0) {
                    num = num * 60;
                } else if (str.indexOf('小时前')>0) {
                    num = num * 60 * 60;
                }
                var now = (new Date()).getTime();
                tdTime = now - num;
            }
        }
        if (tdTime) {
            var time_now = new Date();
            var t_over = time_now-tdTime ;
            var timelabel,nextTime;
            if (t_over>24*60*60000) {
                timelabel = (parseInt(t_over/60/60000/24))+'天'+parseInt((t_over-parseInt(t_over/60/60000/24)*60*24*60000)/60/60000)+'小时前';
            } else if (t_over>=60*60000) {
                timelabel = (parseInt(t_over/60/60000))+'小时前';
            } else if (t_over>60000) {
                timelabel = parseInt(t_over/60000)+'分钟前';
                nextTime = 60000;
            }else {
                timelabel = parseInt(t_over/1000)+'秒前';
                nextTime = 1000;
            }
            _this.innerHTML = '<div>'+timelabel+'</div>';
            if (nextTime) {
                // console.log(nextTime,_this.innerHTML);
                setTimeout(function(){
                    watchTdTime(_this, tdTime)
                },nextTime);
            }
        }
    }

    function resetAsStoryLines() {
        var graytipNode = document.querySelector('.graytip');
        if (graytipNode && graytipNode.innerText.indexOf('会话模式')>=0) {
            graytipNode.style.cssText = 'display:none;'
        }

        // 时间表头迁移
        var timeTd = document.querySelector('#frm table').querySelector('tr').lastChild.previousSibling;
        timeTd.parentNode.insertBefore(timeTd,timeTd.previousSibling);

        var items = {};
        document.querySelectorAll('#frm .toarea>table').forEach(function(child){
            var formNode       = child.querySelector('.tl nobr');
            var subjectNode    = child.querySelector('.gt u');
            var    descNode    = child.querySelector('.txt_hidden>b');
            var tagDivNode     = child.querySelector('.TagDiv');
            if (!(formNode && subjectNode && descNode && tagDivNode)){
                return
            }

            var formText       = formNode.innerText;
            formText           = formText.replace(/^[\s:：\-]*(.*?)[\s:：\-]*$/g,'$1');

            // 主题提炼（移除辅助词如转发回复啥的
            var subjectTitle    = subjectNode.innerText;
            subjectTitle        = subjectTitle.replace(/(Re|转发|Fw|回复|发信方已撤回邮件)[:： ]*/g,'');
            subjectTitle        = subjectTitle.replace(/(\d+-\d+-\d+|\d+\/\d+\/\d+|\d+月\d+日)/g,'');
            subjectTitle        = subjectTitle.replace(/^.{0,5}[:：]/g,'');
            var subjectText        = subjectTitle.replace(/^[【「\[\(（]([^）\)\]」】]*?)[）\)\]」】]$/g,'$1');
            subjectText        = subjectText.replace(/[【「\[\(（](.*?)[）\)\]」】]/g,'');
            subjectText        = subjectText.replace(/^[\s:：\-，]*(.*?)[\s:：\-]*$/g,'$1');
            if (subjectText == '') {
                subjectText    = subjectTitle?subjectTitle:subjectNode.innerText;
            }

            // 简情处理（移除签名信息等）
            var    descText    = descNode.innerText;
            descText           = descText.replace(/---+.*/g,'');
            descText           = descText.replace(/原始邮件\s.*/g,'');
            descText           = descText.replace(/(From|Sender|发件人)[:：].*/g,'');
            descText           = descText.replace(new RegExp('姓名：'+formText + '\\s.*','g'),'');
            descText           = descText.replace(/在\s\d+年\d+月\d+日，.*?写道.*/g,'');
            descText           = descText.replace(/\s[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+\s*$/g,'');
            descText           = descText.replace(/^[\s:：\-]*(.*?)[\s:：\-]*$/g,'$1');
            descNode.innerHTML = descText;


            // 新窗口打开
            child.querySelector('.ci .cir').style.cssText = 'position: absolute;width: 90%;background: none;';
            // 时间栏 前移
            var dtNode           = child.querySelector('.dt');
            dtNode.style.cssText = 'color:gray';
            dtNode.parentNode.insertBefore(dtNode,dtNode.previousSibling);
            watchTdTime(dtNode);//动态更新时间栏

            if (subjectNode.innerText.indexOf('发信方已撤回邮件：')>=0) {
                descNode.innerHTML = subjectNode.innerText;
                descNode.style.cssText = 'text-decoration: line-through;';
            }

            if (!items[subjectText]){
                subjectNode.innerHTML                = subjectText;
                child.style.cssText                  = 'padding-top:36px';
                if (tagDivNode.firstChild) {
                    tagDivNode.insertBefore(subjectNode,tagDivNode.firstChild);
                } else {
                    tagDivNode.appendChild(subjectNode);
                }
                subjectNode.style.cssText            = 'margin: 0 14px;';
                child.ondblclick              = function(){
                    selectText(subjectNode);
                    return false;
                }
                tagDivNode.style.cssText             = 'position: absolute;left: -250px;bottom: 28px;';
                tagDivNode.parentNode.style.cssText  = 'position: relative;overflow: visible;pointer-events: none;';

                items[subjectText] = child;
            } else {
                subjectNode.style.cssText = 'display: none;';
                tagDivNode.style.cssText  = 'display: none;';
                items[subjectText].parentNode.insertBefore(child,items[subjectText].nextSibling);
                items[subjectText]        = child;
            }
            formNode.style.cssText = 'float: right;color:gray;';
        });
        // console.log(items);
        document.getElementById('frm').style.display='block';
    }

    document.addEventListener('DOMContentLoaded', resetAsStoryLines, false);

}
