// ==UserScript==
// @name         QQ邮箱邮件恢复
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  恢复已删除的QQ邮箱邮件
// @match        https://mail.qq.com/cgi-bin/frame_html?*
// @icon         https://mail.qq.com/zh_CN/htmledition/images/favicon/qqmail_favicon_96h.png
// @require      https://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455349/QQ%E9%82%AE%E7%AE%B1%E9%82%AE%E4%BB%B6%E6%81%A2%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/455349/QQ%E9%82%AE%E7%AE%B1%E9%82%AE%E4%BB%B6%E6%81%A2%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function() {
            var toolbar = $(".topdata").find(".switch").find(".left").children(".addrtitle");
            toolbar.append("&nbsp;|&nbsp;");
            var toolbar_item = $("<a>恢复已删除的邮件</a>");
            toolbar_item.click(function(){
                alert("邮件恢复为第三方通过插件提供的功能。继续使用即视为您知晓并同意：\n一、此功能的提供者无法保证此功能的稳定性。此功能可能因为邮件系统已经彻底删除了邮件、邮件接口或数据格式发生变化而无法正常使用。\n二、使用此功能造成的一切后果由用户自行承担。虽然看起来没有什么风险，但还是请在使用前备份重要的数据。\n");

                var mydivblocker = $("<div style='width:100%;height:100%;top:0;left:0;z-index:999;position:fixed;margin:0;padding:0;background-color:#7f7f7f7f;display:block'></div>");
                var myinnerdiv = $("<div style='position:absolute;top:0;bottom:0;left:0;right:0;margin:auto;width:50%;height:50%;background-color:white;display:flex;flex-direction:column'></div>");

                var close_botton_wrapper = $("<div style='width:fill-parent;height:fit-content'></div>");
                var close_botton = $("<a style='float:right;margin-top:5px;margin-right:15px'>关闭</a>");
                close_botton.click(function(){mydivblocker.remove();})

                var my_table_wrapper = $("<div style='flex:1;width:fill-parent;overflow-y:scroll'></div>");
                var my_table = $("<table style='width:fill-parent;margin:10px'><thead><tr><th>删除时间</th><th>发件人</th><th>主题</th><th>操作</th></tr></thead></table>");

                close_botton_wrapper.append(close_botton);
                myinnerdiv.append(close_botton_wrapper);
                my_table_wrapper.append(my_table);
                myinnerdiv.append(my_table_wrapper);
                mydivblocker.append(myinnerdiv);

                var refresh_me = function(){
                    my_table.remove();
                    my_table = $("<table style='width:fill-parent;margin:10px'><thead><tr><th>删除时间</th><th>发件人</th><th>主题</th><th>操作</th></tr></thead></table>");
                    my_table_wrapper.append(my_table);

                    var date_string = "";
                    var deleted_mails = [];

                    $.get("https://mail.qq.com/cgi-bin/help_static_delete",{sid:g_sid, type:0, r:Math.random()},function(data){
                        var dom = $.parseHTML(data);
                        $(dom).find(".sITable").find("#table_data").children("tr").each(function(){
                            if($(this).find(".sIDate").length !== 0){
                                date_string = $(this).find(".sIDate").text();
                            }

                            if($(this).is(".resultTr")){
                                var dele_date = date_string;
                                var dele_time = $(this).find(".mailTime").text();
                                var mail_person = $(this).find(".mailPerson").text();
                                var mail_subject = $(this).find(".mailSubject").text();

                                var new_row = $("<tr></tr>");
                                new_row.append("<td>"+(dele_date+" "+dele_time)+"</td>");
                                new_row.append("<td>"+(mail_person)+"</td>");
                                new_row.append("<td>"+(mail_subject)+"</td>");
                                var restore_op = $("<a>恢复</a>");
                                restore_op.click(async function(){
                                    var guess_date = new Date();
                                    var today = new Date(Date.now());
                                    const ymd_reg = new RegExp("[0-9]+年[0-9]+月[0-9]+日");
                                    const md_reg = new RegExp("[0-9]+月[0-9]+日");
                                    const get_number = /[0-9]+/g;
                                    if(dele_date == "今天"){
                                        guess_date = new Date(today.getFullYear(),today.getMonth(),today.getDate());
                                    }else if(dele_date=="昨天"){
                                        guess_date = new Date(today.getFullYear(),today.getMonth(),today.getDate()-1);
                                    }else if(dele_date=="前天"){
                                        guess_date = new Date(today.getFullYear(),today.getMonth(),today.getDate()-1);
                                    }else if(ymd_reg.test(dele_date)){
                                        var y_m_d_str = [...dele_date.matchAll(get_number)];
                                        guess_date = new Date(Number(y_m_d_str[0]),Number(y_m_d_str[1])-1,Number(y_m_d_str[2]));
                                    }else if(md_reg.test(dele_date)){
                                        var m_d_str = [...dele_date.matchAll(get_number)];
                                        guess_date = new Date(today.getFullYear(),Number(m_d_str[0])-1,Number(m_d_str[1]));
                                        if(guess_date>today)guess_date.setFullYear(guess_date.getFullYear()-1);
                                    }

                                    const get_time = /[0-9]{2}:[0-9]{2}/g;
                                    var time_str = [...dele_time.matchAll(get_number)];
                                    guess_date.setHours(Number(time_str[0]));
                                    guess_date.setMinutes(Number(time_str[1]));
                                    var test_am_and_pm = false;

                                    if(dele_time.indexOf("下午")==0 || dele_time.indexOf("晚上")==0){
                                        guess_date.setHours((guess_date.getHours())%12 + 12);
                                    }else if(dele_time.indexOf("凌晨")==0 || dele_time.indexOf("早上")==0|| dele_time.indexOf("上午")==0){
                                        guess_date.setHours((guess_date.getHours())%12);
                                    }else if(dele_time.indexOf("中午")==0){
                                        guess_date.setHours((guess_date.getHours()+6)%12 + 6);
                                    }else if(get_time.test(time_str)){
                                        //skip
                                    }else{
                                        guess_date.setHours((guess_date.getHours())%12 + 12);
                                        test_am_and_pm = true;
                                    }
                                    console.log(guess_date);
                                    const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
                                    var progress_blocker = $("<div style='width:100%;height:100%;top:0;left:0;z-index:999;position:fixed;margin:0;padding:0;background-color:#7f7f7f7f;display:block'></div>");
                                    mydivblocker.append(progress_blocker);
                                    var progress_div = $("<div style='position:absolute;top:0;bottom:0;left:0;right:0;padding:15px;margin:auto;width:30%;height:30%;background-color:white;display:flex;flex-direction:column'></div>");
                                    progress_blocker.append(progress_div);
                                    progress_div.append("<font>为了规避网站的防DDoS设置，并留出一定余量来保证服务尽可能可靠，我们在每次请求之间加入了较长的间隔。</font><br/>");
                                    progress_div.append("<font>因此，本次操作可能需要5-10分钟，请耐心等待。</font><br/>");
                                    progress_div.append("<font>在此期间，您可以打开其它标签页进行工作，但请尽量不要同时执行其它恢复操作。</font><br/>");
                                    var meter = $("<progress style='width:100%;height:30px;color:green'>......</progress>");
                                    meter.attr('max',(test_am_and_pm?120:60) * 12);
                                    meter.attr('value',0);
                                    progress_div.append(meter);

                                    for(var i = 0;i < 60;i++){
                                        await $.post("/cgi-bin/mail_mgr",{sid:g_sid,mailaction:'mail_revert',t:'mail_mgr2',logtype:2,timekey:Math.floor(Number(guess_date)/1000) + i},function(){});
                                        meter.attr("value",i * 12 + 2);
                                        for(var j = 0;j < 10;j++){
                                            await sleep(500);
                                            meter.attr("value",i * 12 + 2 + j);
                                        }
                                    }
                                    if(test_am_and_pm){
                                        //Can not determine AM/PM. Test both
                                        for(var i = 0;i < 60;i++){
                                            await $.post("/cgi-bin/mail_mgr",{sid:g_sid,mailaction:'mail_revert',t:'mail_mgr2',logtype:2,timekey:Math.floor(Number(guess_date)/1000) + 60 + i},function(){});
                                            meter.attr("value",(i + 60) * 12 + 2);
                                            for(var j = 0;j < 10;j++){
                                                await sleep(500);
                                                meter.attr("value",(i + 60) * 12 + 2 + j);
                                            }
                                        }
                                    }
                                    progress_blocker.remove();

                                    refresh_me();
                                });
                                new_row.append(restore_op);
                                my_table.append(new_row);

                                deleted_mails.push({date:dele_date,time:dele_time,sender:mail_person,subject:mail_subject});
                            }
                        });

                    //deleted_mails.forEach(function(data){alert(data.subject);});
                });

                    $(document.body).append(mydivblocker);
                };
                refresh_me();
            });
            toolbar.append(toolbar_item);

        });
    // Your code here...
})();