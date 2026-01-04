// ==UserScript==
// @name         facebookTool
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  facebook collection Tool 
// @author       You
// @match        m.facebook.com/*
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @require      https://code.jquery.com/ui/1.13.2/jquery-ui.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @downloadURL https://update.greasyfork.org/scripts/451406/facebookTool.user.js
// @updateURL https://update.greasyfork.org/scripts/451406/facebookTool.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // let baseUrl = 'http://192.168.211.194:8001/v1_0';
    // 全局
    let baseUrl = 'https://app.tigercv.cc/v1_0';
    let groups = '';
    $('#MChromeHeader #MBackNavBar').find('a').each(function(index, item){
        if (!groups && $(item).attr('data-sigil') == 'MBackNavBarClick'){
            groups = $(item).text()
        }
    })
    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
    addGlobalStyle('.ui-autocomplete{z-index: 999; background-color: rgb(255, 255, 255);line-height: 20px;padding: 10px 0px;border: 1px solid rgb(238, 238, 238);width: 280px;}');
    addGlobalStyle('.ui-menu-item{padding: 5px 5px; } .ui-menu-item:hover{background-color: #c9c9c9;}');

    // 正文
    console.log('facebook');
    let windowHref = window.location.href;
    let groupsTitle = '';
    let maxheight = 0;
    let commonData = {
        corporatename: [
            // { label: 'corporate1', value: 'corporate1' },
            // { label: 'corporate2', value: 'corporate2' },
            // { label: 'corporate3', value: 'corporate3' }
        ],
        position: [
            // { label: 'position1', value: 'position1' },
            // { label: 'position2', value: 'position2' },
            // { label: 'position3', value: 'position3' }
        ],
        salaryrange: [
            // { label: 'salaryrange1', value: 'salaryrange1' },
            // { label: 'salaryrange2', value: 'salaryrange2' },
            // { label: 'salaryrange3', value: 'salaryrange3' }
        ],
        companyindustry: [
            // { label: 'companyindustry1', value: 'companyindustry1' },
            // { label: 'companyindustry2', value: 'companyindustry2' },
            // { label: 'companyindustry3', value: 'companyindustry3' }
        ],
    }
    window.onload = function() {
        if (windowHref.indexOf('m.facebook.com/groups')  !== -1) {
            // 确保在群组内执行
            initGroups()
        }
    }

    // 监听滚动事件 m_group_stories_container
    window.onscroll = function() {
        //为了保证兼容性，这里取两个值，哪个有值取哪一个
        //scrollTop就是触发滚轮事件时滚轮的高度
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        // 如果内容高度发生变化 触发了刷新
        // if ($('#m_group_stories_container').height() !== maxheight) {
        //     // clearInterval(window.setGroupsItem)
        //     getGroupsItems()
        // }
        if ((maxheight-120) < scrollTop) {
            clearInterval(window.setGroupsItem)
            window.setGroupsItem = setInterval(() => {
                if ($('#m_group_stories_container').height() !== maxheight) {
                    clearInterval(window.setGroupsItem)
                    getGroupsItems()
                }
            }, 1000);
        }
        // 获取当前位置的元素 停留超过3s 记录
        // clearInterval(window.setPermalinkId)
        // window.setPermalinkId = setInterval(() => {
        //     for (let i=0; i<$('.story_body_container').length; i++) {
        //         let item = $($('.story_body_container')[i]);
        //         if (item.offset().top > scrollTop) {
        //             let id = item.attr('id').split('_')[1];
        //             localStorage.setItem('permalinkid', id)
        //             clearInterval(window.setPermalinkId)
        //             return
        //         }
        //     }
        // }, 3000);
    }

    // 初始化群组内容
    function initGroups() {
        // setDialog()
        getGroupsTitle()
        // 获取已录入信息id
        GM_xmlhttpRequest({
            method: "get",
            url: baseUrl + '/tool/facebook/getIds',
            onload: function(res){
                if (res.status == 200 ){
                    let resData = JSON.parse(res.response)
                    localStorage.setItem('completeList', JSON.stringify(resData.data))
                    getGroupsItems()
                }
            }
        });
    }

    // 获取小组标题
    function getGroupsTitle() {
        let alist = document.getElementsByTagName('a');
        if (alist.length > 0) {
            for (let i=0; i<alist.length; i++) {
                let a = alist[i];
                if (a.getAttribute('href')) {
                    let href = a.getAttribute('href');
                    if (href.indexOf(windowHref) !== -1) {
                        groupsTitle = a.innerText;
                        break
                    }
                }
            }
        }
    }

    function getGroupsItems() {
        let groupsBox = $('#m_group_stories_container section');
        maxheight = $('#m_group_stories_container').height();
        let ignoreList = localStorage.getItem('ignoreList') ? JSON.parse(localStorage.getItem('ignoreList')) : [];
        let completeList = localStorage.getItem('completeList') ? JSON.parse(localStorage.getItem('completeList')) : [];
        let groupsItems = groupsBox.find('article');
        if (groupsItems && groupsItems.length > 0) {
            groupsItems.each(function(i,e) {
                let username = '', permalinkid = '', updatetime = '' , groupsId = '';
                let header = $($(e).find('header')[0]);
                let links = header.find('a');
                username = $(links[1]).text();

                // groups = $('#MChromeHeader #header').find('a').attr('data-sigil')
                // groups = $(links[2]).text();

                let footerLinks = $($(e).find('footer')[0]).find('a');
                let permalink = $(footerLinks[0]).attr('href');
                permalink = permalink? permalink.split('/') : [];
                let index = permalink.findIndex(function(item) {
                    return item  == 'permalink';
                })

                if (index !== -1) {
                    permalinkid = permalink[index+1];
                    groupsId = permalink[index-1];
                }

                // 获取更新时间
                header.find('div').each(function(index, item) {
                    if ($(item).attr('data-sigil') == 'm-feed-voice-subtitle') {
                        updatetime = $(item).find('abbr').html();
                        return
                    }
                })

                // 设置唯一标识 方便查询
                header.parent().attr('id', 'tagercv_'+permalinkid);
                // 根据标识查询最后阅读记录
                // if (localStorage.getItem('permalinkid')) {
                //     if (localStorage.getItem('permalinkid') == permalinkid) {
                //         header.css('position', 'relative');
                //         let html = '<div style="position: absolute;right: 90px;top: 16px;cursor: pointer;z-index: 999;transform: translateX(-100%);background-color: red;padding: 5px;border-radius: 4px;color: #fff;width: auto;height: auto;">Read</div>';
                //         header.append(html)
                //     }
                // }
                // 设置按钮
                header.find('a').each(function(index, item) {
                    if ($(item).attr('role')) {
                        if ($(item).attr('role') == 'button') {
                            $(item).parent().parent().css('position', 'relative');
                            if ($(item).parent().parent().attr('status')) {
                                // 去除重复添加
                                return
                            }
                            if (completeList.findIndex(function(o) { return permalinkid == o}) !== -1) {
                                let Done = '<div class="tager_cv_button" tager_cv_username="'+username+'" tager_cv_groups="'+groups+'" tager_cv_permalinkid="'+permalinkid+'" tager_cv_groupsId="'+groupsId+'" tager_cv_updatetime="'+updatetime+'" style="position: absolute;right: -10px;top: 0px;cursor: pointer;z-index: 999;transform: translateX(-100%);background-color: #63cc51;padding: 5px;border-radius: 4px;color: #fff;width: auto;height: auto;">Done</div>';
                                $(item).parent().parent().append(Done);
                            } else if (ignoreList.findIndex(function(o) { return permalinkid == o}) !== -1) {
                                let overlook = '<div style="position: absolute;right: -25px;top: 0px;cursor: pointer;z-index: 999;transform: translateX(-100%);background-color: red;padding: 5px;border-radius: 4px;color: #fff;width: auto;height: auto;">overlook</div>';
                                $(item).parent().parent().append(overlook);
                                $(item).parent().parent().attr('status', 'overlook');
                            } else {
                                // 未读
                                let newButtion =  document.createElement("div") ; // '<div style="position: absolute;left: 0;top: 0;">new</div>';
                                newButtion.innerText = 'collection';
                                newButtion.style.position = 'absolute';
                                newButtion.style.left = '-10px';
                                newButtion.style.top = 0;
                                newButtion.style.cursor = 'pointer';
                                newButtion.style.zIndex = 999;
                                newButtion.style.transform = 'translateX(-100%)';
                                newButtion.style.backgroundColor = '#97b1bd';
                                newButtion.style.padding = '5px';
                                newButtion.style.borderRadius = '5px';
                                newButtion.style.color = '#fff';
                                newButtion.style.width = 'auto';
                                newButtion.style.height = 'auto';
                                newButtion.className = 'tager_cv_button';
                                $(newButtion).attr('tager_cv_username', username);
                                $(newButtion).attr('tager_cv_groups', groups);
                                $(newButtion).attr('tager_cv_permalinkid', permalinkid);
                                $(newButtion).attr('tager_cv_groupsId', groupsId);
                                $(newButtion).attr('tager_cv_updatetime', updatetime)
                                $(item).parent().parent().append(newButtion);
                                // 忽略
                                let ignoreBtn = '<div class="tager_cv_ignoreBtn" tager_cv_permalinkid="'+permalinkid+'" style="position: absolute;right: 75px;top: 0px;cursor: pointer;z-index: 999;transform: translateX(-100%);background-color: red;padding: 5px;border-radius: 4px;color: #fff;width: auto;height: auto;">ignore</div>';
                                $(item).parent().parent().append(ignoreBtn);
                                $(item).parent().parent().attr('status', 'none');
                            }
                        }
                    }
                })
            })
        }
    }

    // 通过自定义属性获取标签
    function getElementByAttr(el, tag, dataAttr, reg) {
        var aElements = el.getElementsByTagName(tag)
        for (var i = 0; i < aElements.length; i++) {
            var ele = aElements[i].getAttribute(dataAttr);
            if (!ele) {
                continue
            }
            if (ele == reg) {
                return aElements[i];
            }
        }
        return false
    }

    // 获取消息内容
    function getGroupsContent(el, tag, dataAttr) {
        var aElements = el.getElementsByTagName(tag)
        for (var i = 0; i < aElements.length; i++) {
            var ele = aElements[i].getAttribute(dataAttr);
            if (!ele) {
                continue
            }
            return aElements[i];
        }
        return false
    }

    // 设置采集文本
    function setDialog() {
        let html = '<div id="tager_cv_ialoag" style="display: none;position: fixed;z-index: 999; width: 100%;height: 100%;background-color: rgba(0 ,0, 0, 0.5);left: 0; top: 0;">'+
                        '<div style="position: absolute; width: 50%;padding:20px;left: 50%; top: 50%; transform: translate(-50%, -50%);border-radius: 6px; background-color: #fff;width: 570px;">'+
                            '<div style="font-size: 20px;margin-bottom: 20px;border-bottom: 1px solid #cdcccc;padding-bottom: 12px;">collection</div>' +
                            '<div style="font-size: 18px;margin-bottom: 10px;">'+
                                '<label style="min-width: 115px;font-size: 14px;display: inline-block;text-align: right;padding-right: 10px;">name: </label><span id="tager_cv_dialog_name"></span>'+
                            '</div>'+
                            '<div style="font-size: 18px;margin-bottom: 10px;">'+
                                '<label style="min-width: 115px;font-size: 14px;display: inline-block;text-align: right;padding-right: 10px;">groups:</label> <span id="tager_cv_dialog_groups"></span>'+
                            '</div>'+
                            '<div style="font-size: 18px;margin-bottom: 10px;">'+
                                '<label style="min-width: 115px;font-size: 14px;display: inline-block;text-align: right;padding-right: 10px;">mail: </label>'+
                                '<input id="tager_cv_dialog_mail" style="background: none;outline: none;border-color: #eee;border: 1px solid #b7b2b2;border-radius: 5px;padding: 5px 10px;min-width: 300px;"></input>'+
                            '</div>'+
                            '<div style="font-size: 18px;margin-bottom: 10px;position: relative;height: 30px;">'+
                                '<label style="min-width: 115px;font-size: 14px;display: inline-block;text-align: right;padding-right: 10px;">corporate name: </label>'+
                                '<input id="tager_cv_dialog_corporatename" style="background: none;outline: none;border-color: #eee;border: 1px solid #b7b2b2;border-radius: 5px;padding: 5px 10px;min-width: 300px;"></input>'+
                            '</div>'+
                            '<div style="font-size: 18px;margin-bottom: 10px;position: relative;height: 30px;">'+
                                '<label style="min-width: 115px;font-size: 14px;display: inline-block;text-align: right;padding-right: 10px;">position: </label>'+
                                '<input id="tager_cv_dialog_position" style="background: none;outline: none;border-color: #eee;border: 1px solid #b7b2b2;border-radius: 5px;padding: 5px 10px;min-width: 300px;"></input>'+
                            '</div>'+
                            '<div style="font-size: 18px;margin-bottom: 10px;position: relative;height: 30px;">'+
                                '<label style="min-width: 115px;font-size: 14px;display: inline-block;text-align: right;padding-right: 10px;">Salary range: </label>'+
                                '<input id="tager_cv_dialog_salaryrange" style="background: none;outline: none;border-color: #eee;border: 1px solid #b7b2b2;border-radius: 5px;padding: 5px 10px;min-width: 300px;"></input>'+
                            '</div>'+
                            '<div style="font-size: 18px;margin-bottom: 10px;position: relative;height: 30px;">'+
                                '<label style="min-width: 115px;font-size: 14px;display: inline-block;text-align: right;padding-right: 10px;">Company industry: </label>'+
                                '<input id="tager_cv_dialog_companyindustry" style="background: none;outline: none;border-color: #eee;border: 1px solid #b7b2b2;border-radius: 5px;padding: 5px 10px;min-width: 300px;"></input>'+
                            '</div>'+
                            '<div style="font-size: 18px;margin-bottom: 10px;">'+
                                '<label style="min-width: 115px;font-size: 14px;display: inline-block;text-align: right;padding-right: 10px;">HR mailbox: </label>'+
                                '<textarea id="tager_cv_dialog_hrmailbox" style="background: none;outline: none;border-color: #eee;border: 1px solid #b7b2b2;border-radius: 5px;padding: 5px 10px;min-width: 300px;margin-left: 125px;display:block;"></textarea>'+
                            '</div>'+
                            '<div style="font-size: 18px;margin-bottom: 10px;">'+
                                '<label style="min-width: 115px;font-size: 14px;display: inline-block;text-align: right;padding-right: 10px;">Describe: </label>'+
                                '<textarea id="tager_cv_dialog_describe" style="background: none;outline: none;border-color: #eee;border: 1px solid #b7b2b2;border-radius: 5px;padding: 5px 10px;min-width: 300px;margin-left: 125px;display:block;"></textarea>'+
                            '</div>'+
                            '<div style="text-align: center;padding: 20px 10px;">'+
                                '<div style="margin-right: 20px;display: inline-block;background-color: #97b1bd;padding: 5px 10px;border-radius: 4px;color: #fff;" class="cancel">cancel</div>'+
                                '<div style="display: inline-block;background-color: #97b1bd;padding: 5px 10px;border-radius: 4px;color: #fff;" class="submit">submit</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>';
        $('body').append(html);
        // 设置选项
        setAutocomplete('#tager_cv_ialoag #tager_cv_dialog_corporatename', commonData.corporatename);
        setAutocomplete('#tager_cv_ialoag #tager_cv_dialog_position', commonData.position);
        setAutocomplete('#tager_cv_ialoag #tager_cv_dialog_salaryrange', commonData.salaryrange);
        setAutocomplete('#tager_cv_ialoag #tager_cv_dialog_companyindustry', commonData.companyindustry);
        // 富文本
        // $('#tager_cv_dialog_describe').markItUp('');
        ClassicEditor.create( document.querySelector( '#tager_cv_dialog_describe' ), {
            simpleUpload: {
                // The URL that the images are uploaded to.
                uploadUrl: 'www.baidu.com',
                // Enable the XMLHttpRequest.withCredentials property.
                withCredentials: true,
                // Headers sent along with the XMLHttpRequest to the upload server.
                headers: ''//所需要的header
            }
        } ).catch( error => {
            console.error( error );
        } );
    }

    // 设置选项数据
    function setAutocomplete(el, sourceList) {
        $(el).autocomplete({
            appendTo: $(el).parent(),
            delay: 10,
            minLength: 0,
            autoFocus: true,
            source: function(request, response){
                let list = [];
                sourceList.forEach(function(item) {
                    if (item.label.indexOf(request.term) !== -1) {
                        list.push((item))
                    }
                })
                response(list)
            },
            select: function(event, ui){
                var $this = $(this);
                $this.parent().find('input:hidden').val(ui.item.brokerExportCode);
            },
            change: function(event, ui){
                if(!ui.item){
                    $(this).parent().find('input:hidden').val('');
                }
            },
            messages: {
                noResults: '',
                results: function() {}
            }
        }).bind('blur', function(){}).focus(function () {
            $(this).autocomplete("search");
        });
    }

    // 设置确认点击
    // let tager_cv_button = '';
    $('body').on('click', '.tager_cv_button', function(e) {
        let username = $(e.currentTarget).attr('tager_cv_username');
        let groups = $(e.currentTarget).attr('tager_cv_groups');
        let permalinkid = $(e.currentTarget).attr('tager_cv_permalinkid');
        let updatetime = $(e.currentTarget).attr('tager_cv_updatetime');
        let groupsId = $(e.currentTarget).attr('tager_cv_groupsId');

        let completeList = localStorage.getItem('completeList') ? JSON.parse(localStorage.getItem('completeList')) : [];
        if(completeList.findIndex(function(o) { return permalinkid == o}) == -1) {
            completeList.push(permalinkid)
        }
        localStorage.setItem('completeList', JSON.stringify(completeList))
        $('#tager_cv_ialoag').css('display', 'none');
        // 设置按钮状态
        $(e.currentTarget).next().remove();
        let Done = '<div class="tager_cv_button" tager_cv_username="'+username+'" tager_cv_groups="'+groups+'" tager_cv_permalinkid="'+permalinkid+'" tager_cv_groupsId="'+groupsId+'" tager_cv_updatetime="'+updatetime+'" style="position: absolute;right: -10px;top: 0px;cursor: pointer;z-index: 999;transform: translateX(-100%);background-color: #63cc51;padding: 5px;border-radius: 4px;color: #fff;width: auto;height: auto;">Done</div>';
        $(e.currentTarget).parent().append(Done);
        $(e.currentTarget).remove();
        let jsonData = {
            faceBook: {
                publisher: username,
                groupsName: groups,
                permalinkId: permalinkid,
                updateTime: updatetime,
                groupsId: groupsId,
                facebookUserId: localStorage.getItem('_cs_viewer')
            },
            source: 'facebook',
            content: '',
        }
        // $('#tagercv_'+permalinkid).find('span').each(function(index, item){
        //     if ($(item).attr('data-sigil') == 'more') {
        //         jsonData.content = $(item).html()
        //     }
        // })
        jsonData.content = $('#tagercv_'+permalinkid).find('header').next().html();
        setClipboardText(JSON.stringify(jsonData))
        // $('#tager_cv_ialoag').css('display', 'block');
        // $('#tager_cv_ialoag #tager_cv_dialog_name').html(username);
        // $('#tager_cv_ialoag #tager_cv_dialog_groups').html(groups);
        // $('#tager_cv_ialoag #tager_cv_dialog_mail').val('');
        // 设置数据
        // $('#tager_cv_ialoag .submit').attr('username', username);
        // $('#tager_cv_ialoag .submit').attr('groups', groups);
        // $('#tager_cv_ialoag .submit').attr('permalinkid', permalinkid);
        // $('#tager_cv_ialoag .submit').attr('updatetime', updatetime);
        // tager_cv_button = $(e.currentTarget)
    })
    // 忽略
    $('body').on('click', '.tager_cv_ignoreBtn', function(e) {
        let permalinkid = $(e.currentTarget).attr('tager_cv_permalinkid');
        let facebookUserId = localStorage.getItem('_cs_viewer');
        // 调用接口
        let ignoreList = localStorage.getItem('ignoreList') ? JSON.parse(localStorage.getItem('ignoreList')) : [];
        if(ignoreList.findIndex(function(o) { return permalinkid == o}) == -1) {
            ignoreList.push(permalinkid)
        }
        localStorage.setItem('ignoreList', JSON.stringify(ignoreList))
        // 设置按钮状态
        $(e.currentTarget).prev().remove();
        let overlook = '<div style="position: absolute;right: -25px;top: 0px;cursor: pointer;z-index: 999;transform: translateX(-100%);background-color: red;padding: 5px;border-radius: 4px;color: #fff;width: auto;height: auto;">overlook</div>';
        $(e.currentTarget).parent().append(overlook);
        $(e.currentTarget).remove();
        // GM_xmlhttpRequest({
        //     method: "get",
        //     url: baseUrl + '/tool/facebook/delete',
        //     data: {
        //         id: permalinkid
        //     },
        //     onload: function(res){
        //         console.log(res)
        //         if (res.status == 200 ){
        //             let ignoreList = localStorage.getItem('ignoreList') ? JSON.parse(localStorage.getItem('ignoreList')) : [];
        //             if(ignoreList.findIndex(function(o) { return permalinkid == o}) == -1) {
        //                 ignoreList.push(permalinkid)
        //             }
        //             localStorage.setItem('ignoreList', JSON.stringify(ignoreList))
        //             // 设置按钮状态
        //             $(e.currentTarget).prev().remove();
        //             let overlook = '<div style="position: absolute;right: -25px;top: 0px;cursor: pointer;z-index: 999;transform: translateX(-100%);background-color: red;padding: 5px;border-radius: 4px;color: #fff;width: auto;height: auto;">overlook</div>';
        //             $(e.currentTarget).parent().append(overlook);
        //             $(e.currentTarget).remove();
        //         }
        //     }
        // });

    })
    $('body').on('click', '#tager_cv_ialoag .cancel', function() {
        $('#tager_cv_ialoag').css('display', 'none');
    });
    $('body').on('click', '#tager_cv_ialoag .submit', function() {
        let username = $('#tager_cv_ialoag .submit').attr('username');
        let groups = $('#tager_cv_ialoag .submit').attr('groups');
        let permalinkid = $('#tager_cv_ialoag .submit').attr('permalinkid');
        let updatetime = $('#tager_cv_ialoag .submit').attr('updatetime');
        let data = {
            name: username,
            groups: groups,
            permalinkid: permalinkid,
            updatetime: updatetime,
            content: $('#tagercv_'+permalinkid).html(),
            mail: $('#tager_cv_ialoag #tager_cv_dialog_mail').val()
        }
        console.log(data);
        let completeList = localStorage.getItem('completeList') ? JSON.parse(localStorage.getItem('completeList')) : [];
        if(completeList.findIndex(function(o) { return permalinkid == o}) == -1) {
            completeList.push(permalinkid)
        }
        localStorage.setItem('completeList', JSON.stringify(completeList))
        $('#tager_cv_ialoag').css('display', 'none');
        // 设置按钮状态
        tager_cv_button.next().remove();
        let Done = '<div class="tager_cv_button" tager_cv_username="'+username+'" tager_cv_groups="'+groups+'" tager_cv_permalinkid="'+permalinkid+'" tager_cv_groupsId="'+groupsId+'" tager_cv_updatetime="'+updatetime+'" style="position: absolute;right: -10px;top: 0px;cursor: pointer;z-index: 999;transform: translateX(-100%);background-color: #63cc51;padding: 5px;border-radius: 4px;color: #fff;width: auto;height: auto;">Done</div>';
        tager_cv_button.parent().append(Done);
        tager_cv_button.remove();
    });
    function setClipboardText(value) {
        const text = document.createElement('textarea');
        text.value = value;
        document.body.appendChild(text);
        text.select();
        document.execCommand('Copy');
        text.remove();
    }
})();

// 补充 公司名称(autocomp) 岗位(下拉配置=项) 工资范围 上班地点(下拉多选) 公司行业(下拉) hr邮箱(多个)
// 加入无效按钮