// ==UserScript==
// @name           Discuz-tail&replyTools
// @name:zh-CN     Discuz论坛小尾巴+快捷回复
// @author         Yulei,wycaca
// @namespace      Discuz-tail&replyTools
// @description    Discuz Tail & reply tool
// @description:zh-cn    Discuz小尾巴和快捷回复工具
// @version        1.2.2
// @create         2013-01-19
// @include        http*/thread*
// @include        http*thread*
// @include        http*forum.php?mod=viewthread&tid=*
// @include        http*forum.php?mod=post&action=reply&fid=*
// @include        http*forum.php?mod=post&action=newthread&fid=*
// @copyright      2013+, Yulei
// @copyright      2019+, wycaca
// @downloadURL https://update.greasyfork.org/scripts/465171/Discuz-tailreplyTools.user.js
// @updateURL https://update.greasyfork.org/scripts/465171/Discuz-tailreplyTools.meta.js
// ==/UserScript==

(function () {
            var _Q = function (d) {
                return document.querySelector(d)
            };
            var w = (typeof unsafeWindow != 'undefined') ? unsafeWindow : window;

            function $(id) {
                return !id ? null : document.getElementById(id);
            }
            //discuz_uid fid tid
            if (w.discuz_uid > 0 || _Q('#um')) { //是否登录，否则退出
                //var inp=document.createElement('input');inp.type="checkbox";inp.id="mUA";inp.checked=true;
                var bar = _Q('.fpd') || _Q('.bar');
                //var bar = _Q('.bar>.fpd');
                //var bar1 = _Q('.tedt>.bar');
                //ptm.appendChild(inp);
                //代码参考：forum.js
                var Psfm = $('postform'),
                    Fps = $('fastpostform');
                var pos = Psfm || Fps;

                //插入尾巴
                function MUA(P) { //Custom 为自定尾巴信息，各喜好修改！
                    var Custom = '[list][/list][float=left]\r\r\r[color=FFFFFF]\
					本人专属,你瞅啥? \ ';
                    //\r——'+ Gtl +'[/color][/size]         [/float]
                    P.value = w.parseurl(P.value) + Custom;
                }
                var Gtl = w.getcookie("GTL") ? w.getcookie("GTL") : "";

                //截获提交
                function gform(pos) { //fm
                    pos.onsubmit = function () {
                        // if ($('mUA').checked) {
                        MUA(pos.message);
                        // }
                        return w.validate(this);
                    }
                }
                gform(pos);

                //截获快捷键
                if (!window.opera) {
                    w.keyDown = function () {};
                } //非O，USERJS优先权比较低
                function mess(PS) {
                    var fwin = $('fwin_reply');
                    PS.onkeydown = function (event) {
                        if ((event.ctrlKey && event.keyCode == 13 || event.altKey && event.keyCode == 83) || (event.altKey && event.keyCode == 83)) {
                            if (!fwin) {
                                // if ($('mUA').checked) {
                                MUA(PS);
                                // }
                            }
                            if (Psfm) {
                                w.ctlent(event)
                            } else if (fwin) {
                                location.href = "javascript:$('postsubmit').click()";
                            } else {
                                w.seditor_ctlent(event, 'fastpostvalidate($(\'fastpostform\'))')
                            };
                        }
                    }
                }
                //创建选项
                var style = document.createElement("style");
                style.type = "text/css";
                style.textContent = "#mUA{ \
				margin-top:5px;border:1px solid #f6f;color:red;outline:1px solid #f6f;";
                document.head.appendChild(style);
                var Bos = document.createElement("SELECT");
                Bos.id = "mUA";
                Bos.title = "选择自动回复;双击设置";
                var texts = new Array("感谢热心分享,好人!",
                    "谢谢分享啦，先试一下,有问题在来请教卤煮!",
                    "请教下,这个如何使用呀?",
                    "有木有用过大兄嘚评论下 好用不?");
                for (var i = 0; i < texts.length; i++) {
                    var option = document.createElement("option");
                    option.setAttribute("value", i);
                    option.appendChild(document.createTextNode(texts[i]));
                    Bos.appendChild(option);
                }
                Bos.options[0].selected = true;
                //按钮
                var btn = document.createElement("button");
                btn.textContent = "自动回复";
                btn.id = "mUA_btn";
                btn.onclick = addText;

                function addText() {
                    var fpmessage = document.getElementById("fastpostmessage");
                    var postmessage = document.getElementById("postmessage");
                    //快捷回复(最下面那个)
                    if (postmessage) {
                        postmessage.textContent = Bos.options[Bos.selectedIndex].text;
                    } else if (fpmessage) {
                        fastpostmessage.textContent = Bos.options[Bos.selectedIndex].text;
                    }
                    //独立回复界面
                    else if (document.getElementById("e_iframe").contentWindow) {
                        var e_iframe = document.getElementById("e_iframe").contentWindow.document.body;
                        e_iframe.textContent = Bos.options[Bos.selectedIndex].text;
                    }
                }

                if (bar) {
                    bar.prepend(btn);
                    bar.prepend(Bos);
                    //bar.appendChild(Bos);
                    //bar.appendChild(btn);
                    mess(pos.message);
                };




                $('mUA').onchange = addText;

                //if(getcookie('fastpostrefresh') == 1) {$('mUA').checked=true;}

                //劫持楼层回复
                var ShowW = w.showWindow;
                w.showWindow = function (k, url, mode, cache, menuv) {
                    setTimeout(function () {
                        var pof = $('postform');
                        _Q('.bar').appendChild(Bos);
                        _Q('.bar').appendChild(btn);
                        mess(pof.message);
                        gform(pof);
                    }, 1300);
                    return ShowW(k, url, mode, cache, menuv);
                }

            }

    /* （支持：Opera12；兼容其它C/F；系统DZ）
     *  好尾巴，你值得拥有.
     * 简单成就精彩 -|- by Yulei 本脚本只作学习研究参考用，版权所有 不得滥用、商用、它用，否则追究，后果自负 */
})();