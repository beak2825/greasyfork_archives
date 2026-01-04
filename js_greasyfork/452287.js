// ==UserScript==
// @name         快捷回复乌龟
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  不用拉到最下面就可以回复乌龟表情了
// @author       RustyHare
// @match        *://*.scboy.cc/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452287/%E5%BF%AB%E6%8D%B7%E5%9B%9E%E5%A4%8D%E4%B9%8C%E9%BE%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/452287/%E5%BF%AB%E6%8D%B7%E5%9B%9E%E5%A4%8D%E4%B9%8C%E9%BE%9F.meta.js
// ==/UserScript==



function turtle() {
    'use strict';

    //需求：修返回状态bug，加入em和WTL表情，在高级回复里加内容


    //想加表情的话，在这些地方加数值就行
    //sbs是SB表情包
    var sbs=[1,2,3,81,156,136];

    //ems是阿鲁
    var ems=[3,31];

    //wtls是WTL表情包
    var wtls=[1];

    //语法规则：在方括号里面，每两个数值之间加逗号，两端不用加
    //比方说：默认是
    //var sbs=[3,81,156,136,1];
    //加一个赤小兔的135，就变成了
    //var sbs=[3,81,156,136,1,135];
    //前面不用加两个斜线。斜线表示这行是注释，是不会被程序读取的。









    if(typeof(UE)!="undefined"){
        var head=document.getElementsByClassName("card-header")[0];
        let replytext=document.createElement("div");
        replytext.style.position="absolute";
        replytext.style.display="inline";
        replytext.style.right="10px";
        replytext.innerText="快捷添加表情：";
        head.appendChild(replytext);
        sbs.forEach(function(num){
            let img=document.createElement("img");
            img.src="https://www.scboy.cc/plugin/scboy_moj/face/sb/"+num.toString()+".png";
            img.style.height="21px";
            img.dataset.num=num.toString();
            img.dataset.type="sb";
            img.onclick=function(e){
                let awa=UE.getEditor('msg_container');
                awa.execCommand('inserthtml', '<img src="https://www.scboy.cc/plugin/scboy_moj/face/sb/'+e.target.dataset.num.toString()+'.png">');
            }
            replytext.appendChild(img);
        })
        ems.forEach(function(num){
            let img=document.createElement("img");
            img.src="https://www.scboy.cc/plugin/scboy_moj/face/arclist/"+num.toString()+".png";
            img.style.height="21px";
            img.dataset.num=num.toString();
            img.dataset.type="em";
            img.onclick=function(e){
                let awa=UE.getEditor('msg_container');
                awa.execCommand('inserthtml', '<img src="https://www.scboy.cc/plugin/scboy_moj/face/arclist/'+e.target.dataset.num.toString()+'.png">');
            }
            replytext.appendChild(img);
        })
        wtls.forEach(function(num){
            let img=document.createElement("img");
            img.src="https://www.scboy.cc/plugin/scboy_moj/face/wtl/"+num.toString()+".jpg";
            img.style.height="21px";
            img.dataset.num=num.toString();
            img.dataset.type="wtl";
            img.onclick=function(e){
                let awa=UE.getEditor('msg_container');
                awa.execCommand('inserthtml', '<img src="https://www.scboy.cc/plugin/scboy_moj/face/wtl/'+e.target.dataset.num.toString()+'.jpg">');
            }
            replytext.appendChild(img);
        })
    }else{
        if(window.location.href.indexOf("thread")>-1){
            var tid=window.location.href.slice(window.location.href.indexOf("thread")+7,window.location.href.indexOf(".htm"))
            var emotion=document.getElementById("advanced_reply").parentElement;
            var textarea=document.getElementById("message");
            var ol=document.getElementsByClassName("breadcrumb")[0];
            var quickreply=document.createElement("div");
            quickreply.style.height="100%";
            quickreply.style.position="absolute";
            quickreply.style.right="20px";
            var replytext=document.createElement("span");
            replytext.innerText="快捷回复：";
            replytext.id="replytext";
            quickreply.appendChild(replytext);
            var ddiv=document.createElement("div");
            ddiv.innerText="快捷添加表情：";

            sbs.forEach(function(num){
                let img=document.createElement("img");
                img.src="https://www.scboy.cc/plugin/scboy_moj/face/sb/"+num.toString()+".png";
                img.style.height="21px";
                img.dataset.num=num.toString();
                img.dataset.type="sb";
                img.onclick=function(e){
                    replytext.innerText="正在发送：";
                    $.post("?post-create-"+tid+"-1.htm",{
                        'doctype':1,
                        'return_html':0,
                        'quotepid':0,
                        'message':'[png:sb:'+e.target.dataset.num.toString()+']'
                    },function(data,status){
                        console.log(JSON.parse(data));
                        if(status=="success"){
                            replytext.innerText=JSON.parse(data).message+"：";
                        }

                    });
                }
                quickreply.appendChild(img);

                let imgd=document.createElement("img");
                imgd.src="https://www.scboy.cc/plugin/scboy_moj/face/sb/"+num.toString()+".png";
                imgd.style.width="40px";
                imgd.dataset.num=num.toString();
                imgd.dataset.type="sb";
                imgd.onclick=function(e){
                    $('#message').insertAtCaret('[png:sb:'+e.target.dataset.num.toString()+']');
                }
                ddiv.appendChild(imgd);
            });
            ems.forEach(function(num){
                let img=document.createElement("img");
                img.src="https://www.scboy.cc/plugin/scboy_moj/face/arclist/"+num.toString()+".png";
                img.style.height="21px";
                img.dataset.num=num.toString();
                img.dataset.type="em";
                img.onclick=function(e){
                    replytext.innerText="正在发送：";
                    $.post("?post-create-"+tid+"-1.htm",{
                        'doctype':1,
                        'return_html':0,
                        'quotepid':0,
                        'message':'[em_'+e.target.dataset.num.toString()+']'
                    },function(data,status){
                        console.log(JSON.parse(data));
                        if(status=="success"){
                            replytext.innerText=JSON.parse(data).message+"：";
                        }

                    });
                }
                quickreply.appendChild(img);

                let imgd=document.createElement("img");
                imgd.src="https://www.scboy.cc/plugin/scboy_moj/face/arclist/"+num.toString()+".png";
                imgd.style.width="40px";
                imgd.dataset.num=num.toString();
                imgd.dataset.type="em";
                imgd.onclick=function(e){
                    $('#message').insertAtCaret('[em_'+e.target.dataset.num.toString()+']');
                }
                ddiv.appendChild(imgd);
            });
            wtls.forEach(function(num){
                let img=document.createElement("img");
                img.src="https://www.scboy.cc/plugin/scboy_moj/face/wtl/"+num.toString()+".jpg";
                img.style.height="21px";
                img.dataset.num=num.toString();
                img.dataset.type="wtl";
                img.onclick=function(e){
                    replytext.innerText="正在发送：";
                    $.post("?post-create-"+tid+"-1.htm",{
                        'doctype':1,
                        'return_html':0,
                        'quotepid':0,
                        'message':'[jpg:wtl:'+e.target.dataset.num.toString()+']'
                    },function(data,status){
                        console.log(JSON.parse(data));
                        if(status=="success"){
                            replytext.innerText=JSON.parse(data).message+"：";
                        }

                    });
                }
                quickreply.appendChild(img);

                let imgd=document.createElement("img");
                imgd.src="https://www.scboy.cc/plugin/scboy_moj/face/wtl/"+num.toString()+".jpg";
                imgd.style.width="40px";
                imgd.dataset.num=num.toString();
                imgd.dataset.type="wtl";
                imgd.onclick=function(e){
                    $('#message').insertAtCaret('[jpg:wtl:'+e.target.dataset.num.toString()+']');
                }
                ddiv.appendChild(imgd);
            });
            ol.appendChild(quickreply);
            emotion.parentElement.insertBefore(ddiv,emotion);
        }else if(window.location.href.indexOf("forum")>-1){
            var threads=document.getElementsByClassName("media thread");
            Array.prototype.forEach.call(threads,function(thread){
                let anchor=document.createElement("div");
                anchor.name="quickReply";
                anchor.style.display="flex";
                anchor.style.flexDirection="column";
                anchor.style.justifyContent="center";
                anchor.style.position="absolute";
                anchor.style.right="5px";
                anchor.style.top="0px";
                anchor.style.height="100%";
                anchor.innerText=">";
                anchor.addEventListener('click', togglePopper);
                anchor.dataset.tid=thread.dataset.tid;
                thread.appendChild(anchor);
            });

            var popper=document.createElement("div");
            popper.style.width="164px";
            popper.style.display="none";
            popper.style.backgroundColor="white";
            popper.style.border="2px solid 	#528B8B";
            sbs.forEach(function(num){
                let img=document.createElement("img");
                img.src="https://www.scboy.cc/plugin/scboy_moj/face/sb/"+num.toString()+".png";
                img.style.width="40px";
                img.dataset.num=num.toString();
                img.dataset.type="sb";
                img.onclick=function(e){
                    popper.style.display="none";
                    console.log(QuickReplyPopper.reference.dataset.tid);
                    $.post("?post-create-"+QuickReplyPopper.reference.dataset.tid+"-1.htm",{
                        'doctype':1,
                        'return_html':0,
                        'quotepid':0,
                        'message':'[png:sb:'+e.target.dataset.num.toString()+']'
                    },function(data,status){
                        if(status=="success"){
                            QuickReplyPopper.reference.innerText=JSON.parse(data).message+">";
                        }

                    });
                }
                popper.appendChild(img);
            });
            ems.forEach(function(num){
                let img=document.createElement("img");
                img.src="https://www.scboy.cc/plugin/scboy_moj/face/arclist/"+num.toString()+".png";
                img.style.width="40px";
                img.dataset.num=num.toString();
                img.dataset.type="em";
                img.onclick=function(e){
                    popper.style.display="none";
                    console.log(QuickReplyPopper.reference.dataset.tid);
                    $.post("?post-create-"+QuickReplyPopper.reference.dataset.tid+"-1.htm",{
                        'doctype':1,
                        'return_html':0,
                        'quotepid':0,
                        'message':'[em_'+e.target.dataset.num.toString()+']'
                    },function(data,status){
                        if(status=="success"){
                            QuickReplyPopper.reference.innerText=JSON.parse(data).message+">";
                        }

                    });
                }
                popper.appendChild(img);
            });
            wtls.forEach(function(num){
                let img=document.createElement("img");
                img.src="https://www.scboy.cc/plugin/scboy_moj/face/wtl/"+num.toString()+".jpg";
                img.style.width="40px";
                img.dataset.num=num.toString();
                img.dataset.type="wtl";
                img.onclick=function(e){
                    popper.style.display="none";
                    console.log(QuickReplyPopper.reference.dataset.tid);
                    $.post("?post-create-"+QuickReplyPopper.reference.dataset.tid+"-1.htm",{
                        'doctype':1,
                        'return_html':0,
                        'quotepid':0,
                        'message':'[jpg:wtl:'+e.target.dataset.num.toString()+']'
                    },function(data,status){
                        if(status=="success"){
                            QuickReplyPopper.reference.innerText=JSON.parse(data).message+">";
                        }

                    });
                }
                popper.appendChild(img);
            });
            document.body.appendChild(popper);
            var QuickReplyPopper=new Popper(threads[0],popper,{placement: 'right'});

            function togglePopper(event){

                if(QuickReplyPopper.reference==event.target){
                    popper.style.display=="block"?popper.style.display="none":popper.style.display="block";
                }else{
                    QuickReplyPopper.reference=event.target;
                    popper.style.display="block";
                }

                QuickReplyPopper.update();

            }
        }
    }
};
            if (window.addEventListener != null) {

                window.addEventListener("load", turtle, false);



            } else if (window.attachEvent != null) {

                window.attachEvent("onload", turtle);

            }