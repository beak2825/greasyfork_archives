// ==UserScript==
// @name         D2 Plus
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  Make copy easier
// @author       yuzhou
// @match        http://datastudio.dw.alibaba-inc.com/*
// @match        http://d2.alibaba-inc.com/*
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @run-at document-end
// @grant GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/35827/D2%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/35827/D2%20Plus.meta.js
// ==/UserScript==

// 插件主页： https://greasyfork.org/en/scripts/35827-d2-plus

var jq = $;
var loop = null;
var loopTimes = 0;
var observerResult = new MutationObserver(function(mutations) {
    //console.log(mutations);
    if($('a[copyall]')){
        $('a[copyall]').css({
            'color': 'red',
            'font-weight': 'bold'
        });
    }
});

var observerInit = new MutationObserver(function(mutations) {
    console.log('observerInit');

    loopTimes = 0;
    if(loop){
        clearInterval(loop);
    }

    loop = setInterval(function(){
        loopTimes ++;
        if(loopTimes > 30){
            clearInterval(loop);
        }

        if(jq('.node-tab-page[name="code"]').length > 0 || jq('.node-tab-page[name="代码"]').length > 0){
            //console.log('observerInit2');
            if(jq('.nav-pills').length > 0){
                console.log('D2 Plus Init Success');
                document.querySelector('.nav-pills');
                observerResult.observe(document.querySelector('.nav-pills'), {childList:true});
                clearInterval(loop);
                jq('body').delegate('a', 'click', function(e){
                    e.stopImmediatePropagation();
                    if(jq(this).attr('copyall') === ''){
                        var jobInfo = jq('div[temp="result"]:visible').find('#page-pagination');
                        var jobId = jobInfo.attr('jobid');
                        var jobIndex = jobInfo.attr('index');
                        var userId = jq('.userImg').attr('src').match(/photo\/(\d*)/)[1];
                        var id = jq('.userImg').attr('src').match(/photo\/(\d*)/);
                        var proId = jq('.dataworks-projectList li.active').val();
                        var hostname = window.location.hostname;
                        var url = '//' + hostname + '/rest/task/result/';
                        url = url + jobId + '/sqlIndex/' + jobIndex + '/page/1/limit/1000?appId=' + proId + '&tenantId=1&userId=' + userId;
                        jq.ajax(url, {
                            success: function(res){
                                if(res.success){
                                    var header = JSON.parse(res.data.header);
                                    var content = JSON.parse(res.data.body);
                                    var length = content.length;
                                    var contentStr = "";
                                    for(var i=0;i<length;i++){
                                        contentStr += (content[i].join("\t") + "\n");
                                    }
                                    GM_setClipboard(header.join("\t") + "\n" + contentStr, 'text');
                                }else{

                                }
                            }
                        });
                    }
                });
            }

        }
    }, 800);


});

(function(jq) {
    'use strict';
    var initTimes = 0;
    var initLoop = setInterval(function(){
        initTimes ++;

        console.log('Try To Init D2 Plus');
        if(initTimes > 75){
            clearInterval(initLoop);
        }

        if(jq('.mainpanel .panel-content').length > 0){
            clearInterval(initLoop);
            observerInit.observe(document.querySelector('.mainpanel .panel-content'), {childList:true});
        }
    }, 800);
})(jq);