// ==UserScript==
// @name         四川文理在线考试
// @namespace    https://greasyfork.org/zh-CN/users/707063-genexy
// @version      202112012338
// @description  四川文理学在线考试助手
// @author       流浪的蛊惑
// @match        *://*.wdjycj.com/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/419087/%E5%9B%9B%E5%B7%9D%E6%96%87%E7%90%86%E5%9C%A8%E7%BA%BF%E8%80%83%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/419087/%E5%9B%9B%E5%B7%9D%E6%96%87%E7%90%86%E5%9C%A8%E7%BA%BF%E8%80%83%E8%AF%95.meta.js
// ==/UserScript==
function addXMLRequestCallback(callback){//监听请求
    var oldSend, i;
    if( XMLHttpRequest.callbacks ) {
        XMLHttpRequest.callbacks.push( callback );
    } else {
        XMLHttpRequest.callbacks = [callback];
        oldSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function(){//监听发送
            for( i = 0; i < XMLHttpRequest.callbacks.length; i++ ) {
                XMLHttpRequest.callbacks[i]( this );
            }
            oldSend.apply(this, arguments);
        }
        XMLHttpRequest.prototype.wrappedSetRequestHeader=XMLHttpRequest.prototype.setRequestHeader;
        XMLHttpRequest.prototype.setRequestHeader = function(header, value) {//监听自定义主机头
            this.wrappedSetRequestHeader(header, value);
            if(!this.headers) {
                this.headers = {};
            }
            if(!this.headers[header]) {
                this.headers[header] = [];
            }
            this.headers[header].push(value);
        }
    }
}
function testpaper(data){
    let pdata=data.exam_data;
    let sd={
        answer_data:[],
        answer_time:1800+parseInt(Math.random()*3600),
        host:"www.wdjycj.com",
        is_complete:1
    };
    sd.token=localStorage.getItem("userToken");
    sd.paper_record_id=data.id;
    let da={};
    for(let i=0;i<pdata.length;i++){
        for(let j=0;j<pdata[i].question_lists.length;j++){
            switch(pdata[i].question_lists[j].tm_type){
                case 1:
                    da={answer:pdata[i].question_lists[j].answer,
                        id:pdata[i].question_lists[j].id,
                        type:pdata[i].question_lists[j].tm_type};
                    break;
                case 2:
                    for(let k=0;k<pdata[i].question_lists[j].appanswer.length;k++){
                        if(pdata[i].question_lists[j].appanswer[k].right){
                            da={answer:pdata[i].question_lists[j].appanswer[k].id,
                                id:pdata[i].question_lists[j].id,
                                type:pdata[i].question_lists[j].tm_type};
                        }
                    }
                    break;
                case 3:
                    da={answer:[],
                        id:pdata[i].question_lists[j].id,
                        type:pdata[i].question_lists[j].tm_type};
                    for(let k=0;k<pdata[i].question_lists[j].appanswer.length;k++){
                        if(pdata[i].question_lists[j].appanswer[k].right){
                            da.answer.push(pdata[i].question_lists[j].appanswer[k].id);
                        }
                    }
                    break;
                case 4:
                    da={answer:pdata[i].question_lists[j].answer,
                        id:pdata[i].question_lists[j].id,
                        type:pdata[i].question_lists[j].tm_type};
                    break;
                case 5:
                    da={answer:pdata[i].question_lists[j].answer,
                        id:pdata[i].question_lists[j].id,
                        type:pdata[i].question_lists[j].tm_type};
                    break;
            }
            sd.answer_data.push(da);
        }
    }
    sendpaper(sd);
}
function sendpaper(data){
    $.ajax({
        method:"POST",
        url:"http://nbc.wdjycj.com/api/paper_record/submitUserAnswer",
        dataType:"json",
        data:data,
        success:function(e){
            alert("答题已完成");
            location.href="/user-index/onlineTest?nav=0,3&tab=0";
            //console.log(e);
        }
    });
}
(function() {
    'use strict';
    addXMLRequestCallback( function( xhr ) {
        xhr.addEventListener("load", function(){
            if (xhr.readyState==4 && xhr.status==200) {
                if (xhr.responseURL.includes("/api/paper_record/getUserAnswer")){
                    let dat=JSON.parse(xhr.responseText);
                    if(dat.code==200){
                        testpaper(dat.data);
                    }
                }
            }
        });
    });
})();