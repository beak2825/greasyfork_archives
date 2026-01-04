// ==UserScript==
// @name         MIB添加一键确认告警功能
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  确认告警。
// @author       feiazifeiazi@163.com
// @match        https://cmdbtest.xcreditech.com/monitor/show/alertinfos/*
// @match        https://cmdb.xcreditech.com/monitor/show/alertinfos/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xcreditech.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473639/MIB%E6%B7%BB%E5%8A%A0%E4%B8%80%E9%94%AE%E7%A1%AE%E8%AE%A4%E5%91%8A%E8%AD%A6%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/473639/MIB%E6%B7%BB%E5%8A%A0%E4%B8%80%E9%94%AE%E7%A1%AE%E8%AE%A4%E5%91%8A%E8%AD%A6%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==




        (function () {


             'use strict';

            class AlarmConfirmation
            {


                static requestsUrl = [];
                static requestsAjax = [];

                static requestFinshIndex=0;
                static requestSuccessCount=0;
                static requestFailureCount=0;

                static buttionId="confirmALL";
                static confirmButtionObj=null;
                // 记录开始时间
                StartTime =null;


                constructor()
                {

                }


                static sleep(ms) {
                    return new Promise(resolve => setTimeout(resolve, ms));
                }

                static getUnrecoveredAlarmValue() {
                    var result=0;
                    var cRedSpan = $(".c-red"); // 选择具有 class="c-red" 的 span 标签
                    var text = cRedSpan.text(); // 获取 span 标签的文本内容

                    // 使用正则表达式提取未恢复报警的值
                    var match = text.match(/未恢复报警：(\d+)/);
                    if (match) {
                        var value = parseInt(match[1]); // 将匹配到的值转换为整数
                        return value;
                    }
                }

               static extractPageNumber() {
                    var totalPage=1;
                    var totalPageElement = $('a.total-page');

                    if (totalPageElement.length > 0) {
                        var text = totalPageElement.text();
                        var pagePattern = /共 (\d+) 页/;
                        var matches = text.match(pagePattern);
                        if (matches) {
                            totalPage= parseInt(matches[1]);
                        }
                    }
                    return totalPage;
                }


                static async myBeforeunload(event) {
                    // event.preventDefault();
                    // 在这里添加你想要的逻辑，防止页面重新加载
                    // 显示确认对话框
                    event.preventDefault();
                    // 为了兼容处理，Chrome需要设置returnValue
                    event.returnValue = null;
                    // await AlarmConfirmation.sleep(20000);
                    return null;
                    //return "正在确认告警中，请不要离开。";
                }

                static addConfirmButtion() {
                     // 找到具有“弹窗通知”文本的 span 元素
                    var targetElement = $('span:contains("弹窗通知")');
                    // 在目标元素前添加一个按钮
                    targetElement.before('<bution id="myButtonCon" style="vertical-align: top; font-size: 15px; padding-right:15px;"><span id="confirmALL" class="btn btn-success radius size-MINI" style="font-size:16px;">一键确认报警<span></bution>');

                    // 绑定按钮的 click 事件
                    $('#myButtonCon').click(this.Confirm);

                     AlarmConfirmation.confirmButtionObj=$("#"+AlarmConfirmation.buttionId+"");
                }


                static async Confirm() {
                    if (AlarmConfirmation.confirmButtionObj.hasClass('disabled')) {
                        return;
                    }else{
                        AlarmConfirmation.confirmButtionObj.addClass('disabled')
                    }
                    console.time('totalTimeConfirm');
                    AlarmConfirmation.StartTime=performance.now();



                    var resultMessage="正在处理中...";
                    AlarmConfirmation.confirmButtionObj.text(resultMessage);

                    var urls = $('td a[data-href*="alertinfos"]').map(function () {
                        return $(this).attr('data-href');
                    }).get();

                    if(urls.length<=0) {
                        resultMessage="未找到告警，请刷新页面。";
                        AlarmConfirmation.confirmButtionObj.text(resultMessage);
                        AlarmConfirmation.confirmButtionObj.removeClass('disabled');
                        return;
                    }


                    //urls.push('www.aa.xx');
                    //urls.push('www.aa.xx2');
                    //urls.push('www.baidu.com');

                     //不要重新加载。
                    $(window).on('beforeunload', AlarmConfirmation.myBeforeunload);



                    var totalPage=AlarmConfirmation.extractPageNumber();
                    var totalCount=AlarmConfirmation.getUnrecoveredAlarmValue();

                    AlarmConfirmation.requestFinshIndex=0;
                    AlarmConfirmation.requestSuccessCount=0;
                    AlarmConfirmation.requestFailureCount=0;


                    AlarmConfirmation.requestsUrl=[];
                    AlarmConfirmation.requestsAjax=[];


                    const timeoutMillisGetUrls = 150000; // 设置超时时间N秒
                    const startTime = Date.now();
                    let promises = [];
                    const batchSizeUrl = 3; // 每批请求数量
                    // let maxPage=30;
                    // if(maxPage>(totalPage-1))
                    // {
                    //     maxPage=totalPage-1;
                    // }


                    //totalPage=10;
                    for (var i=totalPage;i>0;i--)
                    {
                        try {
                            promises.push(AlarmConfirmation.getUrls(i));
                            if((i)%batchSizeUrl==0 || i==1)
                            {
                                var results=await Promise.allSettled(promises);
                                const netUrls = [];
                                results.forEach(r=>{
                                    netUrls.push(...r.value);
                                });
                                if (Array.isArray(netUrls) && netUrls.length>0) {
                                    //urls=urls.concat(netUrls);
                                    if(i==1){
                                       await AlarmConfirmation.urlClick(netUrls, true);
                                    }else
                                    {
                                        AlarmConfirmation.urlClick(netUrls, false);
                                    }
                                     
                                }
                                promises = [];
                            }
                            
                        } catch (error) {
                            console.log('请求错误', error);
                        }
                        if (Date.now() - startTime >= timeoutMillisGetUrls) {
                            break;
                        }
                    }

                    await Promise.allSettled(AlarmConfirmation.requestsAjax);

                     if(totalPage<=1)
                    {
                        //处理首页
                        //await AlarmConfirmation.urlClick(urls,true);
                    }
                    if(AlarmConfirmation.requestsUrl.length===AlarmConfirmation.requestFinshIndex){
                        AlarmConfirmation.confirmDone();
                    }else{
                        AlarmConfirmation.confirmDone();

                    }
                    console.log("结束。");

                }


                static async urlClick(urls, isLast)
                {
                    var resultMessage=null;
                    AlarmConfirmation.requestsUrl=AlarmConfirmation.requestsUrl.concat(urls);

                    const batchSize = 50; // 每批请求数量
                    for (let i = 0; i < urls.length; i += batchSize) {
                        let batch = urls.slice(i, i + batchSize);
                        let promises = [];
                        for (let url of batch) {
                            promises.push($.ajax({
                                url: url,
                                method: 'GET',
                                dataType: 'json',
                                timeout: 30000 // 设置超时时间为 N 秒
                            }));
                        }
                        
                        AlarmConfirmation.requestsAjax=AlarmConfirmation.requestsAjax.concat(promises);

                        //await AlarmConfirmation.sleep(4000);

                        promises.forEach(function (request) {
                            request.then(function (response) {
                                // 异步操作成功的处理
                                AlarmConfirmation.requestSuccessCount++;
                                console.log(AlarmConfirmation.requestFinshIndex+": "+new Date().toLocaleString()+" Success: ", response);

                            }).fail(function (jqXHR, textStatus, errorThrown) {
                                // 异步操作失败的处理
                                AlarmConfirmation.requestFailureCount++;
                                console.log(AlarmConfirmation.requestFinshIndex+": "+new Date().toLocaleString()+" Failure: ", textStatus,errorThrown);

                            }).always(function () {
                                AlarmConfirmation.requestFinshIndex+=1;
                                resultMessage = "正在处理中...，总计"+AlarmConfirmation.requestsUrl.length+"个，成功"+AlarmConfirmation.requestSuccessCount+"个，失败"+AlarmConfirmation.requestFailureCount+"个";
                                AlarmConfirmation.confirmButtionObj.text(resultMessage);
                                //if(AlarmConfirmation.requestsUrl.length===AlarmConfirmation.requestFinshIndex && isLast==true){
                                //    AlarmConfirmation.confirmDone();
                                //}

                            });
                        })

                        try {

//                             $.when.apply($,promises).then(function (e) {
//                                 //全部成功
//                             }).fail(function (e) {
//                                 //有失败的
//                             }).always(function () {
//                                 // 无论成功还是失败，总是会执行的操作

//                             });
                            Promise.allSettled(promises);
                        } catch (error) {
                            console.log('AJAX请求错误', error);
                        }
                        console.log("---------------");

                        

                    }
                }

                static async getUrls (page) {
                    // 获取表单的action属性
                    var formAction = $('#queryForm').attr('action');
                    // 构建GET参数
                    var getParams = {
                        page: page
                    };

                    // 将GET参数序列化为URL参数字符串
                    var serializedGetParams = $.param(getParams);

                    // 构建完整的URL
                    var urlWithParams = formAction + (formAction.includes('?') ? '&' : '?') + serializedGetParams;
                    // 获取隐藏域中的flag值
                    var flagValue = $('input[name="flag"]').val();
                    // 构建POST参数
                    var postParams = {flag: flagValue};
                    var urls=[];
                    try {
                        // 发送AJAX请求
                        await $.ajax({
                            type: 'POST',
                            url: urlWithParams,
                            data: postParams,
                            dataType: 'html',
                            timeout: 55000,
                            async: true,
                            success: function(response) {
                                // 将响应的 HTML 文本插入到一个临时的 DOM 元素中，以便进行查找
                                var tempDiv = $('<div>').html(response);

                                // 使用选择器查找所有带有 data-href*="alertinfos" 的 <a> 标签
                                var alertInfoLinks = tempDiv.find('td a[data-href*="alertinfos"]');
                                urls = alertInfoLinks.map(function () {
                                    return $(this).attr('data-href');
                                }).get();

                            },
                            error: function(xhr, status, error) {
                                console.log('AJAX请求错误', status, error);
                            }
                        });
                    } catch (error) {
                        console.log('AJAX请求错误', error);
                    }
                    
                    return urls;
                }

               static confirmDone(){
                   var  successCount=0;
                   var  failureCount=0;
                   var  requestsAjaxLen=AlarmConfirmation.requestsAjax.length;

                   var statusSet = new Set();  // 用于存储状态信息的集合

                   // 这里处理请求完成后的逻辑
                   for (var i = 0; i < requestsAjaxLen; i++) {
                       var response = AlarmConfirmation.requestsAjax[i];
                       if(response.status===200 && response.responseJSON.status==0)
                           successCount++;
                       else{
                           failureCount++;

                           var statusInfo = '状态码：' + response.status + ' 状态文本：' + response.statusText+ ' 响应消息Text：'+ response.responseText+ + response.responseJSON;

                           // 检查状态信息是否已经存在于 statusSet 中response.responseText
                           if (!statusSet.has(statusInfo)) {
                               statusSet.add(statusInfo); // 将状态信息添加到集合
                           }
                       }
                       console.log(i+'：状态码：', response.status, '状态文本：', response.statusText, '响应消息JSON：', response.responseJSON);
                   }
                   var resultMessage="";
                   var resultMessageconAlert="";
                   if(failureCount>0)
                   {

                       resultMessage = "部分处理成功,总计"+requestsAjaxLen+"个，成功"+successCount+"个，失败"+failureCount+"个，请刷新页面查看。";
                       var statusStr=Array.from(statusSet).join('；');
                       resultMessageconAlert = "部分处理成功,总计"+requestsAjaxLen+"个，成功"+successCount+"个，失败"+failureCount+"个，请刷新页面查看。响应结果："+statusStr+"。";
                       if (resultMessageconAlert.length > 1000) {
                           resultMessageconAlert = resultMessageconAlert.substring(0, 997) + '...';
                       }

                   }else
                   {
                       resultMessage = "全部处理成功,总计"+requestsAjaxLen+"个，请刷新页面查看。"
                       resultMessageconAlert=resultMessage;

                   }
                      // 停止计时器并获取耗时
                   console.timeEnd('totalTimeConfirm');
                   // 计算耗时
                   const elapsedTimeInSeconds = ((performance.now() - AlarmConfirmation.StartTime) / 1000).toFixed(2);

                   resultMessage+=`总耗时：${elapsedTimeInSeconds}秒。`;
                   resultMessageconAlert+=`总耗时：${elapsedTimeInSeconds}秒。`;

                   AlarmConfirmation.confirmButtionObj.text(resultMessage);
                   $(window).off('beforeunload',AlarmConfirmation.myBeforeunload);
                   AlarmConfirmation.confirmButtionObj.removeClass('disabled');

                   alert(resultMessageconAlert);
               }



             }




            $(document).ready(function () {


                AlarmConfirmation.addConfirmButtion();

            });
        })();
