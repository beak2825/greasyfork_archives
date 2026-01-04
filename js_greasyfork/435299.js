// ==UserScript==
// @name         V2EX Emoticon
// @version      0.1
// @description  让V2EX 支持微博表情
// @author       LawSiki
// @namespace    https://github.com/CrazyMelody/v2ex_emoticon
// @match        https://www.v2ex.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v2ex.com

// @downloadURL https://update.greasyfork.org/scripts/435299/V2EX%20Emoticon.user.js
// @updateURL https://update.greasyfork.org/scripts/435299/V2EX%20Emoticon.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var emoticonMapStr = '{"2021":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/a8/2021_newyear_org.png","春游家族":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/b6/2021_YoungFamily_org.png","生而为赢":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/f7/2021_BorntoWin_org.png","调休":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/2d/2021_tiaoxiu_org.png","放假":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/6b/2021_fangjia_org.png","迷雾剧场":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/cb/2021_lighton_org.png","玉兔":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/7b/2021_yutu_org.png","航天员":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/53/2021_yuhangyuan_org.png","开学季":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/72/2021_kaixueji_org.png","赢牛奶":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/9c/2021_yingniunai_org.png","抱一抱":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/af/2020_hug_org.png","小红花":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/fe/2020_redflower_org.png","微笑":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/e3/2018new_weixioa02_org.png","可爱":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/09/2018new_keai_org.png","太开心":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/1e/2018new_taikaixin_org.png","鼓掌":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/6e/2018new_guzhang_org.png","嘻嘻":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/33/2018new_xixi_org.png","哈哈":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/8f/2018new_haha_org.png","笑cry":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/4a/2018new_xiaoku_thumb.png","挤眼":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/43/2018new_jiyan_org.png","馋嘴":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/fa/2018new_chanzui_org.png","黑线":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/a3/2018new_heixian_org.png","汗":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/28/2018new_han_org.png","挖鼻":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/9a/2018new_wabi_thumb.png","哼":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/7c/2018new_heng_org.png","怒":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/f6/2018new_nu_org.png","委屈":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/a5/2018new_weiqu_org.png","可怜":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/96/2018new_kelian_org.png","失望":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/aa/2018new_shiwang_org.png","悲伤":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/ee/2018new_beishang_org.png","泪":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/6e/2018new_leimu_org.png","允悲":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/83/2018new_kuxiao_org.png","害羞":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/c1/2018new_haixiu_org.png","污":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/10/2018new_wu_org.png","爱你":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/f6/2018new_aini_org.png","亲亲":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/2c/2018new_qinqin_org.png","色":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/9d/2018new_huaxin_org.png","憧憬":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/c9/2018new_chongjing_org.png","舔屏":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/3e/2018new_tianping_org.png","坏笑":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/4d/2018new_huaixiao_org.png","阴险":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/9e/2018new_yinxian_org.png","笑而不语":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/2d/2018new_xiaoerbuyu_org.png","偷笑":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/71/2018new_touxiao_org.png","酷":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/c4/2018new_ku_org.png","并不简单":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/aa/2018new_bingbujiandan_org.png","思考":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/30/2018new_sikao_org.png","疑问":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/b8/2018new_ningwen_org.png","费解":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/2a/2018new_wenhao_org.png","晕":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/07/2018new_yun_org.png","衰":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/a2/2018new_shuai_org.png","骷髅":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/a1/2018new_kulou_org.png","嘘":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/b0/2018new_xu_org.png","闭嘴":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/62/2018new_bizui_org.png","傻眼":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/dd/2018new_shayan_org.png","吃惊":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/49/2018new_chijing_org.png","吐":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/08/2018new_tu_org.png","感冒":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/40/2018new_kouzhao_org.png","生病":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/3b/2018new_shengbing_org.png","拜拜":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/fd/2018new_baibai_org.png","鄙视":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/da/2018new_bishi_org.png","白眼":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/ef/2018new_landelini_org.png","左哼哼":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/43/2018new_zuohengheng_org.png","右哼哼":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/c1/2018new_youhengheng_org.png","抓狂":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/17/2018new_zhuakuang_org.png","怒骂":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/87/2018new_zhouma_org.png","打脸":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/cb/2018new_dalian_org.png","顶":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/ae/2018new_ding_org.png","互粉":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/86/2018new_hufen02_org.png","钱":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/a2/2018new_qian_org.png","哈欠":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/55/2018new_dahaqian_org.png","困":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/3c/2018new_kun_org.png","睡":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/e2/2018new_shuijiao_thumb.png","求饶":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/aa/moren_qiurao02_org.png","吃瓜":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/01/2018new_chigua_org.png","打call":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/39/moren_dacall02_org.png","awsl":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/14/moren_awsl02_org.png","苦涩":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/7e/2021_bitter_org.png","裂开":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/1b/202011_liekai_org.png","牛年大吉":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/4a/2021_niuniandaji_org.png","牛大发":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/4b/2021_niudafa_org.png","牛哞哞":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/30/2021_cattle_org.png","doge":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/a1/2018new_doge02_org.png","二哈":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/22/2018new_erha_org.png","喵喵":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/7b/2018new_miaomiao_org.png","酸":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/b3/hot_wosuanle_org.png","中国赞":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/6d/2018new_zhongguozan_org.png","抱抱":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/42/2018new_baobao_org.png","摊手":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/62/2018new_tanshou_org.png","跪了":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/75/2018new_gui_org.png","鲜花":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/d4/2018new_xianhua_org.png","红灯笼":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/e8/2021_lantern_org.png","烟花":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/96/2021_fireworks_org.png","雪花":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/13/yunying2020_snowflakes_org.png","迎福运":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/db/2021_fuzizheng_org.png","福到了":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/5f/2021_fudaole_org.png","丘比特":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/45/2021_qiubite_org.png","单身狗":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/20/2021_alongdog_org.png","小丑":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/6f/2021_xiaochou_org.png","杰瑞":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/da/2021_jerry_org.png","汤姆":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/31/2021_tom_org.png","奶瓶":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/8c/2021_naiping_org.png","暖一下":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/bb/2021_nuanyixia_org.png","牛轰轰拥抱":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/74/2021_niuhongbao_org.png","牛牛哒":"https://face.t.sinajs.cn/t4/appstyle/expression/ext/normal/97/2021_niuniuda_org.png"}';
    var css = ' #emoticon_wrapper {    background-color: white;    border: 1px solid rgb(233 233 233);    border-radius: 5px;    min-height: 6.25rem;    height: 300px;    box-shadow: 0 0.125rem 0.25rem 0 rgba(0, 0, 0, 0.1);    position: absolute;    }        .emoticon_facebox {    height: 266px;    width: 410px;    margin: 12px 2px 12px 12px;    padding: 0 10px 0 0;    overflow-x: hidden;    overflow-y: auto;    text-align: left;    }    .woo-box-item-inlineBlock {    display: inline-block;    }        .hover_effect :hover {    background-color: rgb(247 98 42 / 60%);    border-radius: 100%;    }        .u-col-12 [class*="box-item"],    .u-col-12 [data-type="w-box-item"] {    width: 8.333%;    }    .emoticon_tab .wbpro-iconbed {    width: 38px;    height: 38px;    }        .wbpro-iconbed {    position: relative;    width: 34px;    height: 34px;    cursor: pointer;    line-height: 0;    }    .woo-box-justifyCenter {    -webkit-box-pack: center;    -ms-flex-pack: center;    justify-content: center;    }    .woo-box-alignCenter {    align-items: center;    -webkit-box-align: center;    -ms-flex-align: center;    }    .woo-box-flex {    display: -webkit-box;    display: -ms-flexbox;    display: flex;    }        .emoticon_img {    width: 24px;    height: 24px;    }    img.emoticon_img_text {    width: 20px;    height: 20px;    padding: 0px 2px;}';
    document.$emoticonObj = {}
    // 将数据挂载到document上,方便后面获取
    document.$emoticonObj.map = JSON.parse(emoticonMapStr);

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
    var upload_btn = document.querySelector('#reply-box > div.cell.flex-one-row > div.fr > a');
    if(upload_btn!=null){
        var wrapper = document.createElement('div');
        wrapper.id = 'emoticon_wrapper';
    
        var emoticon_facebox = document.createElement('div');
        emoticon_facebox.setAttribute('class','emoticon_facebox');
    
        wrapper.appendChild(emoticon_facebox);
        wrapper.style.display="none";
    
        var emoticon_a = document.createElement('a');
        emoticon_a.href='javascript:void(0);'
        emoticon_a.appendChild(document.createTextNode("表情"));
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