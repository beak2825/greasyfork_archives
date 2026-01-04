// ==UserScript==
// @name         V2EX Emoticon
// @version      0.2
// @description  让V2EX 支持表情
// @author       LawSiki、huage2580
// @namespace    https://github.com/huage2580/v2ex_emoji
// @match        https://www.v2ex.com/t/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v2ex.com
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/435636/V2EX%20Emoticon.user.js
// @updateURL https://update.greasyfork.org/scripts/435636/V2EX%20Emoticon.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var css = ' #emoticon_wrapper {    background-color: white;    border: 1px solid rgb(233 233 233);    border-radius: 5px;    min-height: 6.25rem;    height: 300px;    box-shadow: 0 0.125rem 0.25rem 0 rgba(0, 0, 0, 0.1);    position: absolute;    }        .emoticon_facebox {    height: 266px;    width: 410px;    margin: 12px 2px 12px 12px;    padding: 0 10px 0 0;    overflow-x: hidden;    overflow-y: auto;    text-align: left;    }    .woo-box-item-inlineBlock {    display: inline-block;    }        .hover_effect :hover {    background-color: rgb(247 98 42 / 60%);    border-radius: 100%;    }        .u-col-12 [class*="box-item"],    .u-col-12 [data-type="w-box-item"] {    width: 8.333%;    }    .emoticon_tab .wbpro-iconbed {    width: 38px;    height: 38px;    }        .wbpro-iconbed {    position: relative;    width: 34px;    height: 34px;    cursor: pointer;    line-height: 0;    }    .woo-box-justifyCenter {    -webkit-box-pack: center;    -ms-flex-pack: center;    justify-content: center;    }    .woo-box-alignCenter {    align-items: center;    -webkit-box-align: center;    -ms-flex-align: center;    }    .woo-box-flex {    display: -webkit-box;    display: -ms-flexbox;    display: flex;    }        .emoticon_img {    width: 24px;    height: 24px;    }    img.emoticon_img_text {    width: 20px;    height: 20px;    padding: 0px 2px;}';
    document.$emoticonObj = {};
    // 将数据挂载到document上,方便后面获取
    document.$emoticonObj.map = {"doge": "https://i.imgur.com/WyJtjIO.png", "\u4e8c\u54c8": "https://i.imgur.com/wgnukxM.png", "\u4eb2\u4eb2": "https://i.imgur.com/nTqqMwt.png", "\u5047\u54ed": "https://i.imgur.com/c9koCsd.png", "\u5047\u7b11": "https://i.imgur.com/wevaACJ.png", "\u518d\u89c1": "https://i.imgur.com/BQM3wnz.png", "\u53d1\u6012": "https://i.imgur.com/a4oxROe.png", "\u53d8\u6001\u6ed1\u7a3d": "https://i.imgur.com/p71XhF9.png", "\u53ef\u601c": "https://i.imgur.com/86QzF2v.png", "\u5403\u74dc": "https://i.imgur.com/4ctg1uh.png", "\u5410\u8840": "https://i.imgur.com/9N68fjF.png", "\u5428\u5428\u5428": "https://i.imgur.com/RL8pEff.png", "\u5472\u7259": "https://i.imgur.com/7SddcaX.png", "\u5496\u5561": "https://i.imgur.com/1RtxlL4.png", "\u54c8\u54c8": "https://i.imgur.com/EK8QKc9.png", "\u54ed\u4e86": "https://i.imgur.com/XutJACB.png", "\u559c": "https://i.imgur.com/wePQo18.png", "\u55b7": "https://i.imgur.com/S7KMNsS.png", "\u563f\u54c8": "https://i.imgur.com/QnPXAfK.png", "\u574f\u7b11": "https://i.imgur.com/2vn1v8b.png", "\u5927\u7b11": "https://i.imgur.com/E5Uqqfk.png", "\u5965\u7279\u66fc": "https://i.imgur.com/3UgIUCZ.png", "\u59d4\u5c48": "https://i.imgur.com/z1UStbV.png", "\u5e72\u676f": "https://i.imgur.com/savTxnM.png", "\u5fc3\u788e": "https://i.imgur.com/LMcbPfS.png", "\u60ca\u8bb6": "https://i.imgur.com/k5cgDsG.png", "\u6253\u8138": "https://i.imgur.com/hePLVvZ.png", "\u6253\u8138\u6ed1\u7a3d": "https://i.imgur.com/xgNoo8x.png", "\u6258\u816e": "https://i.imgur.com/rdq8HCd.png", "\u62b1\u62f3": "https://i.imgur.com/NpZz2rJ.png", "\u6342\u5634\u7b11": "https://i.imgur.com/zhwu7Iu.png", "\u673a\u667a": "https://i.imgur.com/PwcbJI4.png", "\u6d41\u6c57\u6ed1\u7a3d": "https://i.imgur.com/P5gN5BH.png", "\u6d41\u6cea": "https://i.imgur.com/ZTr5z44.png", "\u6ed1\u7a3d": "https://i.imgur.com/zRwC7aD.png", "\u725b\u5564": "https://i.imgur.com/jP8z9va.png", "\u751f\u6c14": "https://i.imgur.com/36KFRac.png", "\u7591\u95ee": "https://i.imgur.com/sOgSspk.png", "\u770b\u620f": "https://i.imgur.com/FiTQUcO.png", "\u778c\u7761": "https://i.imgur.com/5eC6nLz.png", "\u7eff\u5e3ddoge": "https://i.imgur.com/NyRxtpF.png", "\u82b1": "https://i.imgur.com/i02mU8N.png", "\u83dc\u5200": "https://i.imgur.com/rp1OaQW.png", "\u86cb\u7cd5": "https://i.imgur.com/5Jmbs5y.png", "\u8721\u70db": "https://i.imgur.com/l7ZxZec.png", "\u8dea\u4e86": "https://i.imgur.com/XkfBzmK.png", "\u9119\u89c6": "https://i.imgur.com/MQFgdh9.png", "\u9177": "https://i.imgur.com/eq6tPW7.png", "\u9634\u9669": "https://i.imgur.com/UdCZ5hH.png", "\u9999\u8549": "https://i.imgur.com/fy7FxE8.png"}
    // 插入CSS
    var style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    document.body.appendChild(style);

     // 创建单个表情元素
     function createEmoticon(alt,src,is_content){
        var inline_block = document.createElement('div');
        var img_div = document.createElement('div');
        if(is_content){
            inline_block.setAttribute('class','woo-box-item-inlineBlock');
        }else{
            inline_block.setAttribute('class','woo-box-item-inlineBlock hover_effect');
        }
        img_div.setAttribute('class','wbpro-iconbed woo-box-flex woo-box-alignCenter woo-box-justifyCenter');
        img_div.setAttribute('alt',alt);
        img_div.addEventListener('click',function(event){
            reply_content.value = reply_content.value + "["+this.getAttribute('alt')+"]"
        });
        var img = document.createElement('img');
        img.setAttribute('class','emoticon_img');
        img.setAttribute('alt',alt);
        img.setAttribute('src',src);

        img_div.appendChild(img);
        inline_block.appendChild(img_div);
        return inline_block;

    }

    // 生成回复框的表情区域
    var upload_btn = document.querySelector('#reply-box > div.cell.flex-one-row > div > a');
    if(upload_btn!=null){
        var wrapper = document.createElement('div');
        wrapper.id = 'emoticon_wrapper';

        var emoticon_facebox = document.createElement('div');
        emoticon_facebox.setAttribute('class','emoticon_facebox');

        wrapper.appendChild(emoticon_facebox);
        wrapper.style.display="none";

        var emoticon_a = document.createElement('a');
        emoticon_a.href='javascript:void(0);';
        emoticon_a.appendChild(document.createTextNode("  表情  "));
        emoticon_a.addEventListener('click',function(event){
            if(wrapper.style.display==''){
                wrapper.style.display = 'none';
            }else{
                wrapper.style.display = '';
            }
        })
        upload_btn.parentNode.insertBefore(emoticon_a,upload_btn);
        upload_btn.parentNode.appendChild(wrapper);

        for(let key in document.$emoticonObj.map){
            emoticon_facebox.appendChild(createEmoticon(key,document.$emoticonObj.map[key]));
        }
    }

    //添加一个转换按钮
    var form = document.getElementsByTagName("form")[0];
    var submit2 = document.createElement('input');
    submit2.value = "转换表情";
    submit2.setAttribute("class", "super normal button");
    submit2.type = "button";
    form.appendChild(submit2);
    submit2.href='javascript:void(0);';
    submit2.addEventListener('click',function(event){
        //输入框转换表情
        console.log('回复转换...');
        var sourceInput = reply_content.value;
            var it = sourceInput.matchAll(/\[(.+?)\]/g);
            let match;
            while (!(match=it.next()).done) {
                let text = match.value[0]
                let alt = match.value[1];
                console.log(text);
                let src = document.$emoticonObj.map[alt.replace(' ','')];
                if(src==null) continue;
                sourceInput = sourceInput.replace(text,src+' ');

            }
        reply_content.value = sourceInput;
        //转换完成提交回复
//        form.submit();
    });


    //渲染其他回复
    document.$emoticonObj.render = function(){
        var contents = document.querySelectorAll('.reply_content,.markdown_body')
        contents.forEach(content=>{
            let html = content.innerHTML;
            var it = html.matchAll(/\[(.+?)\]/g);
            let match;
            while (!(match=it.next()).done) {
                let text = match.value[0]
                let alt = match.value[1];
                console.log(text);
                let src = document.$emoticonObj.map[alt.replace(' ','')];
                if(src==null) continue;

                let tempEle = document.createElement('div');
                let img = document.createElement('img');
                img.setAttribute('class','emoticon_img_text');
                img.setAttribute('alt',alt);
                img.setAttribute('title',alt);
                img.setAttribute('src',src);
                tempEle.appendChild(img);
                content.innerHTML = content.innerHTML.replace(text,tempEle.innerHTML);
                tempEle = null;
            }
        })
    }
    document.$emoticonObj.render();


    // 发布页面,点击预览后,预览区域内重新渲染表情
    const main = document.getElementById('Main');
    if(main){
        main.addEventListener('DOMNodeInserted', function(e){
            if(e.relatedNode.id=='topic_preview'){
                document.$emoticonObj.render();
            }
        }, false);
    }

})();