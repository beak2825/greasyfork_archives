// ==UserScript==
// @name         jd_dr
// @namespace    http://tampermonkey.net/
// @version      0.15
// @description  京东达人写作助手
// @author       demonka
// @match        https://dr.jd.com/page/app.html
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/382385/jd_dr.user.js
// @updateURL https://update.greasyfork.org/scripts/382385/jd_dr.meta.js
// ==/UserScript==

(function() {
    'use strict';

 var adlaw_forbidden=[{
        "forbidden_reason": "与“最”有关",
        "forbidden_words": ["最","最佳","最具","最爱","最赚","最优","最优秀","最好","最大","最高","最奢侈","最低","最底",
             "最便宜","最流行","最受欢迎","最时尚","最聚拢","最符合","最舒适","最先","最先进加工工艺","最后","最新"]},
    {
        "forbidden_reason": "与“一”有关",
        "forbidden_words": ["第一","中国第一","全网第一","销量第一","排名第一","唯一","第一品牌","NO.1","TOP.1","独一无二","全国第一","一流","一天","仅此一次","仅此一款","最后一波","全国.*大品牌之一"]},
    {
        "forbidden_reason": "与“级/极”有关",
        "forbidden_words": ["国家级","国际级","千万级","百万级","星级","5A","甲级","国家级产品","全球级","宇宙级","世界级","超级"]},
    {
        "forbidden_reason": "极限词语",
        "forbidden_words": [
            "顶级","顶尖","顶端","尖端","顶级工艺","顶级享受","极品","极佳","绝佳","绝对","终极","极致",
            "高级","致极","极具","至","至尊","至臻","臻品","臻致","臻席","压轴","问鼎","空前","绝后","绝版","无双","非此莫属","巅峰","前所未有","无人能及",
            "鼎级","鼎冠","定鼎","完美","翘楚之作","不可再生","不可复制","绝无仅有","寸土寸金","淋漓尽致","无与伦比","唯一","卓越","卓著"
        ]},
    {
        "forbidden_reason": "稀缺",
        "forbidden_words": [
            "前无古人后无来者","绝版","珍稀","臻稀","稀少","绝无仅有","绝不在有","稀世珍宝","千金难求","世所罕见","不可多得","空前绝后","寥寥无几","屈指可数"]},
    {
        "forbidden_reason": "与“首/家/国”有关",
        "forbidden_words": [
            "首个","首选","独家","独家配方","全国首发","首款","首发","首席","首府","首选","首次","首屈一指","全国销量冠军",
            "国家级产品","国家","国家免检","国家领导人","国门","国宅","填补国内空白","中国驰名","驰名商标","国际品质"]},
    {
        "forbidden_reason": "与品牌有关",
        "forbidden_words":
            ["世界领先", "优秀", "冠军", "创领品牌", "名牌", "墅王", "大牌","奢侈", "奢华","巅峰", "巨星", "巨匠","掌门人", "正品",
            "之王", "王牌", "王者", "楼王","皇家", "真皮", "祖传","精准","精确", "缔造者", "至尊", "著名", "资深", "超赚", "金牌", "高档"]},
    {
        "forbidden_reason": "与夸张虚假、欺诈有关",
        "forbidden_words":
           ["必","免首付", "0首付","不会再便宜", "不会更便宜了", "免费住", "免费领", "全民免单", "全民抢购", " 全民疯抢","概不负责","后果自负","再不抢就没了", "卖疯了",
            "史上最低价", "售空", "售罄", "恭喜获奖", "抢爆", "抢疯了", "抽奖", "未曾有过的", "没有他就","错过不再","错过即无", "错过就没机会了", "零距离价格你来定", "领取奖品",
            "限时优惠", "机不可失", "赶快抢购", "欲购从速", "疯抢", "特惠", "超值", "跳楼价", "永久","瞬间见效", "明显改善", "见证奇迹", "神奇秘方", "国际大牌", "国际知名",
            "前无古人", "史无前例","永久","万能","祖传","特效","无敌","纯天然","100%","百分之百","点击有惊喜","点击翻转", "点击获取", "点击试穿", "点击转身", "点击领奖"
        ]},
    {
        "forbidden_reason": "与时间有关",
        "forbidden_words": ["今日","今天","几天几夜","倒计时","趁现在","仅限","周末","周年庆","购物大趴","闪购","品牌团","精品团","单品团","随时涨价","马上降价"]},
    {
        "forbidden_reason": "与权威有关",
        "forbidden_words": ["老字号","中国驰名商标","特供","专供","专家推荐","质量免检","无需国家质量检测","免抽检","国家.*领导人推荐","国家.*机关推荐","使用人民币图样","机关单位特供"]},
    {
        "forbidden_reason": "独家",
        "forbidden_words": ["独家","独创","独据","开发者","创始者","发明者"]},
    {
        "forbidden_reason": "领",
        "forbidden_words": ["世界领先", "领先", "领导者", "领袖", "引领", "创领", "领航", "耀领"]},
    {
        "forbidden_reason": "封建",
        "forbidden_words": [
            "宫廷","御用","帝都", "皇城", "皇室领地", "皇家", "皇室", "皇族", "殿堂", "白宫", "王府", "府邸", "皇室住所", "政府机关", "行政大楼", "使馆", "境线"]},
    {
        "forbidden_reason": "歧视性词语",
        "forbidden_words": [
            "贵族", "高贵", "隐贵", "上流", "层峰", "富人区", "名门", "阶层", "阶级","神经病", "二货", "脑残", "死胖子", "瞎子", "娘儿们", "棒子", "阿三","富二代", "官二代", "白富美", "高富帅"]},
    {
        "forbidden_reason": "价值/投资",
        "forbidden_words": ["升值价值", "价值洼地", "价值天成", "千亿价值", "投资回报", "众筹", "抄涨", "炒股不如买房", "升值潜力无线", "买到即赚到"]},
    {
        "forbidden_reason": "与医疗相关",
        "forbidden_words": ["远离.*病", "可治疗.{0,4}", "具有.*功效"]},
    {
        "forbidden_reason": "敏感词相关",
        "forbidden_words": ["白色情人节", "木马", "茉莉", "高潮", "外交"]}
]

function reg_factory(forbidden_list,content,el){
    var warn_msg_all=""
    var warn_msg="";
    for(var forbidden_type of forbidden_list){
        for(var forbidden_word of forbidden_type.forbidden_words){
            var reg_compile = new RegExp(forbidden_word,'ig')
            var reg_result

            while ((reg_result = reg_compile.exec(content)) !== null) {
                if(el){
warn_msg=`区域       ：${el},<br/>
字符位置 ：${reg_result.index+1},<br/>
违禁词    ：${reg_result[0]},<br/>
违禁原因 ：${forbidden_type.forbidden_reason}<br/>
-------------------------<br/>`
                }else{
warn_msg=`字符位置 ：${reg_result.index+1}<br/>，
违禁词    ：${reg_result[0]}<br/>,
违禁原因 ：${forbidden_type.forbidden_reason}<br/>
-------------------------<br/>`
                }
               warn_msg_all+=warn_msg
            }
            var warn_div=document.querySelector("#warn_div")
            warn_div.innerHTML=warn_msg_all
            if(!warn_msg_all){
                warn_div.style.display='none'
            }else{
                warn_div.style.display='block'
            }
        }
    }
}

function reg_content(content,el){
    return reg_factory(adlaw_forbidden,content,el)
}

function create_checkbox(){
    var checkbox=document.createElement('div')
    checkbox.style.cssText='position:fixed;z-index:1000;top:100px;right:0px;background-color:gray;width:100px;height:100px;'
    checkbox.innerHTML="<textarea placeholder='输入要检测内容'></textarea><br/><button>违禁词检测</button>"

    document.body.appendChild(checkbox)
    console.log('create checkbox done.')
    var textarea=checkbox.querySelector('textarea')
    var btn=checkbox.querySelector('button')
    textarea.style.cssText='height:50%;'
    btn.style.cssText='width:100px;height:30px;margin-top:10px;'
    checkbox.querySelector('button').addEventListener('click',function(e){
        reg_content(textarea.value)

    })
}
create_checkbox()


function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

sleep(3000).then(() => {
   var hash=window.location.hash
   if(hash.match(/(?<=#).*\/\d+/)){
       var create_type=hash.match(/(?<=#).*\/\d+/) [0]
   }else{
       return
   }
   switch(create_type){
       case '/new_create/100':
           single_old()
           break
       //  实拍单品
       case '/new_create/8':
           single_new()
           break
       case '/new_create/0':
           normal_text()
           break
   }
    var warn_div=document.createElement("div");
    warn_div.id="warn_div"
    warn_div.style.cssText='position:fixed;z-index:1001;right:0px;top:200px;width:200px;max-height:500px;color:red;overflow:auto;'
    warn_div.setAttribute("title","违禁词警告，修改完后自动消失")
    document.body.appendChild(warn_div)

})


function single_new(){

    var divlist=document.querySelector('#new_create>.box>.box-form').children
    var s_title=divlist[1]
    var s_subtitle=divlist[2]
    var s_reason_0=divlist[6]
    var s_reason_1=divlist[7]
    var s_reason_2=divlist[8]
    var explain_img_area=divlist[10]
    var explain=divlist[11]
    var brand_story=divlist[15]


   function img_check(explain_img_area,e){
      if (explain_img_area.querySelector('.image-show-block>img')){
          var explain_image=explain_img_area.querySelector('img')
          var image_info={'width':explain_image.naturalWidth,'height':explain_image.naturalHeight}
          var image_info_div=document.createElement("div")
          image_info_div.id='image_info_div'
          image_info_div.classList.add('ui-tip-box')
          if (image_info.width==image_info.height){
              image_info_div.style.cssText='background:rgba(255,255,0,0.1);width:300px;height:100px;'
          }else{
              image_info_div.style.cssText='background:rgba(255,0,0,0.6);width:300px;height:100px;'
          }
          image_info_div.innerHTML=`<p>已上传图片：<br/>宽度：${image_info.width} ，高度：${image_info.height}<br/>说明：宽：高=1:1，至少750*750*</p>`
          if (explain_img_area.querySelector('#image_info_div')){
             explain_img_area.removeChild(explain_img_area.querySelector('#image_info_div'))
          }
          explain_img_area.appendChild(image_info_div)

    }
   }

    img_check(explain_img_area)
    explain_img_area.querySelector('.module-content').addEventListener('DOMNodeInserted',function(e){
        sleep(200).then(function(){
           img_check(explain_img_area,e)
        })
    })

    s_title.querySelector('input').addEventListener('blur',function(e){
        single_title_check(this.value)
        reg_content(this.value,'标题')
    })
    s_subtitle.querySelector('input').addEventListener('blur',function(e){
        reg_content(this.value,'副标题')
    })
    s_reason_0.querySelector('textarea').addEventListener('blur',function(e){
         reg_content(this.value,'必买理由描述')
    })
    s_reason_1.querySelector('textarea').addEventListener('blur',function(e){
         reg_content(this.value,'必买理由描述1')
    })
    s_reason_2.querySelector('textarea').addEventListener('blur',function(e){
         reg_content(this.value,'必买理由描述2')
    })
    explain.querySelector('textarea').addEventListener('blur',function(e){
         reg_content(this.value,'补充说明段落描述')
    })
    brand_story.querySelector('textarea').addEventListener('blur',function(e){
         reg_content(this.value,'品牌故事介绍')
    })
}



function single_old(){
    var divlist=document.querySelector('#new_create>.box>.box-form').children
    var s_title=divlist[1]
    var s_reason=divlist[3]
    s_title.querySelector('input').addEventListener('blur',function(e){
        single_title_check(this.value,'推荐主题')
    })
    s_reason.querySelector('textarea').addEventListener('blur',function(e){
        reg_content(this.value,'推荐理由')
    })
}

function single_title_check(value,area){
    if(value.length===1){
        return
    }
    if(value.length>20 || value.length<6){
          alert(`当前字数：${value.length} ,
规定   ：标题字符数 6-20`)
    }
    /*
    var all_bytes;
    var two_bytes=value.match(/[\u4e00-\u9fa5]+/)
    if(two_bytes){
        all_bytes=value.match(/[^\s]/g).join('').length+value.match(/[\u4e00-\u9fa5]+/g).join('').length
    }else{
        all_bytes=value.match(/[^\s]/g).join('').length
    }
    console.log(`title : ${value} | 字节数 : ${all_bytes}`)

    if (all_bytes > 30 || all_bytes <12 ) {
        alert(`当前字符数：${all_bytes} ,不含空格
规定   ：标题字符数 12-30`)
    }
     */
    if(value.trimLeft()!=value){
        alert(`标题开始有空格`)
    }else if(value.trimRight()!=value){
        alert(`标题末尾有空格`)
    }
    var title_forbidden_list=[
        {"forbidden_reason": "不可使用主观形容词","forbidden_words":['百搭', '时尚', '好吃']},
        {"forbidden_reason": "不能出现重量、促销等字眼","forbidden_words":['\\d+ml', '\\d+g', '包邮', '满减', '清仓', '特价']},
        {"forbidden_reason": "不要出现售卖数量","forbidden_words":['\\d+片','\\d+包']}]
    reg_factory(adlaw_forbidden.concat(title_forbidden_list),value,area)
}

function text_title_check(value){

    if(value.trimLeft()!=value){
        alert(`标题开始有空格`)
    }else if(value.trimRight()!=value){
        alert(`标题末尾有空格`)
    }
    var title_forbidden_list=[
        {"forbidden_reason": "文章标题不能出现促销等字眼","forbidden_words":['包邮', '满减', '清仓', '特价']},
        {"forbidden_reason": "文章标题不能出现粗鄙口头语","forbidden_words":['婊', '要死了']},
        {"forbidden_reason": "文章标题不能出现违禁词","forbidden_words":['小编', '小三','编者','主编']}
    ]
    reg_factory(adlaw_forbidden.concat(title_forbidden_list),value,'长文文章标题')
}

function normal_text(){
    var divlist=document.querySelector('#new_create>.box>.box-form').children
    var t_title=divlist[0]
    var t_content=document.querySelector("#richtext-editor-box > div.bf-container > div.bf-content > div > div > div")

    t_title.querySelector('input').addEventListener('blur',function(e){
        text_title_check(this.value)
    })
    t_content.addEventListener('blur',function(e){
        var text_forbidden_list=[
            {"forbidden_reason": "长文违禁词","forbidden_words":['小编', '小三','编者','主编','婊', '要死了']},
            {"forbidden_reason": "网络用语违禁词","forbidden_words":['有木有', '黑喂狗','切克闹','哇塞']},
            {"forbidden_reason": "政治用语违禁词","forbidden_words":["钓鱼岛", "黄岩岛", "南京枪击案", "示威游行", "高房价", "高物价", "就业难", "金融危机", "五道杠"]}
        ]
        reg_factory(adlaw_forbidden.concat(text_forbidden_list),this.innerText,'富文本框')
    })
}

})();