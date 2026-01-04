// ==UserScript==
// @name         Ctrl+X键阴阳人屏蔽器
// @namespace    https://mr-metasequoia.github.io/tools/YYGQ/
// @version      0.8.16
// @description  在各大内容平台（默认支持知乎、微博和贴吧）展开评论区后，按下Ctrl+X键(或⌘+X键)屏蔽某些不友善言论。折叠评论区并再次打开以恢复原貌。判定规则丰富合理🤔，屏蔽词及敏感值可调。不妨点进来看看？
// @author       水杉metasequoia
// @match        *://*.zhihu.com/*
// @match        *://*.weibo.com/*
// @match        *://*.tieba.baidu.com/p/*
// @icon         data:image/png;base64,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
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MPL
// @downloadURL https://update.greasyfork.org/scripts/448352/Ctrl%2BX%E9%94%AE%E9%98%B4%E9%98%B3%E4%BA%BA%E5%B1%8F%E8%94%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/448352/Ctrl%2BX%E9%94%AE%E9%98%B4%E9%98%B3%E4%BA%BA%E5%B1%8F%E8%94%BD%E5%99%A8.meta.js
// ==/UserScript==

// 单纯的屏蔽难以彻底排除互联网小丑，应该设置黑名单。
// 被规则匹配的评论获取用户名，保存在油猴数据库中，多次匹配中移入默认屏蔽列表。      但GM函数比我想象中难用，有时间再做吧

//不支持‘|’
var badword = ['润','孝','急了','别急','就这','跪','[男南楠女钕打]拳','拳[师]','粉','[又必小中大]赢','赢[麻！]','底层','百姓','官?老爷','磕头','小[鬼将]'
               ,'键盘','杠精','人性','小作文','简中','中文互联网','恶臭','郭楠','男宝','仙女','[男女]的','饭圈'
               ,'有没有这?[\u4e00-\u9fa5]{0,2}(一种)?可能','哈{6,}','！{3,}','!{3,}','？{2,}','\\?{2,}','干货','教员','大是大非','真话','[左右]壬','[←→]','统战价值','桶蘸'
               ,'普[构丁]','独裁','大帝','[鹅乌]友','耗材','跳大神','[yY]{2}','意淫','翻墙','不利于[\u4e00-\u9fa5]{4,8}不要'
               ,'阶级','小丑','逆天']

// 通常认为是攻击性和阴阳人使用的表情
// 还要排除连续使用表情的评论
var wbbq = /\[太开心]|\[偷笑]|(.png"><img)/g
var zhbq = /\[惊喜]|\[尴尬]|(]"><img)/g

//对神友水军的判定敏感度
var mg = 10

//未来应该增加一个“出现了就要整体屏蔽”的关键词数组，可以是表情包和用户名。如果是用户名的话，要用GM函数存起来。

//var badword = ['是','的']//'的|是'在汉语中出现频率很高，可以用作测试。

var where = ['CommentContent','wbpro-list','card-review s-ptb10','l_post j_l_post l_post_bright  ']//知乎，微博首页，微博搜索结果页，贴吧

//贴吧的改变状态
var changed = false

function findLen() {
    for(let i=0;i<where.length;i++)
        {
            if(document.getElementsByClassName(where[i]).length!=0)
            {
                let len = document.getElementsByClassName(where[i]).length
                switch(i)
                {
                    case 0:
                        return [len,"知乎"]
                        break
                    case 1:
                        return [len,"微博首页"]
                        break
                    case 2:
                        return [len,"微博搜索结果页"]
                        break
                    case 3:
                        return [len,"贴吧"]
                        break
                }
            }
        }
    return [0,"未知"]
}

(function() {

    document.addEventListener('keydown',e=>{

        //var key = e.key;
        const { ctrlKey , metaKey, key } = e;

        //comment和len放里面，是为了每次监听新的值
        //这里的几个comment主要为了让后面代码简短一点。
        var zhihuComment = document.getElementsByClassName("CommentContent")
        var weibo1Comment = document.getElementsByClassName("wbpro-list")//微博首页，这个div包括了评论的次级评论
        var weibo2Comment = document.getElementsByClassName("card-review s-ptb10")//微博搜索结果页
        var tiebaComment = document.getElementsByClassName("l_post j_l_post l_post_bright  ")

        var len=findLen()[0]
        var loc=findLen()[1]

        if( ctrlKey || metaKey )//按下Ctrl键+X，或mac系统的⌘键+X
        {
            if(key === 'x')//x的意思是抽象手势“哒咩！”，好按并避免和知乎微博的快捷键冲突。
            {
                console.log(loc+"评论数量："+len)

                if(loc=="贴吧")//贴吧的评论区不是生成的，需要整页恢复（刷新）——即需要单独考虑其逻辑。
                {
                    if(!changed)
                    {
                        for(let i=0;i<len;i++)
                        {
                            for(let j=0;j<badword.length;j++)
                            {
                                let bad = new RegExp(badword[j],'g');//本次循环得到的badword
                                //\u3001|\uff1b|\uff0c|\u3002|\uff01|\uff1f|\u300a|\u300b是标点符号，包括、|；|，|。|！|？|《|》
                                let yygq = new RegExp('(\\\['+badword[j]+'|'+badword[j]+'\\\]|[(\u4e00-\u9fa5)(\u3001|\uff1b|\uff0c|\u3002|\uff01|\uff1f|\u300a|\u300b)]{'+mg+',}'+badword[j]+'|'+badword[j]+'[(\u4e00-\u9fa5)(\u3001|\uff1b|\uff0c|\u3002|\uff01|\uff1f|\u300a|\u300b)]{'+mg+',})','g')
                                document.getElementsByClassName("l_post j_l_post l_post_bright  ")[i].innerHTML = tiebaComment[i].innerHTML.replace(yygq,'$1免死金牌')

                                if((parseInt(tiebaComment[i].innerHTML.split("？").length) - 1)>3)
                                {
                                    document.getElementsByClassName("l_post j_l_post l_post_bright  ")[i].innerHTML = "「急急國王の碎念」"
                                }
                                else
                                {
                                    document.getElementsByClassName("l_post j_l_post l_post_bright  ")[i].innerHTML = tiebaComment[i].innerHTML.replace(bad,'🌳')
                                    if(tiebaComment[i].innerHTML.indexOf('🌳') != -1 && tiebaComment[i].innerHTML.indexOf("免死金牌") == -1)
                                    {
                                        document.getElementsByClassName("l_post j_l_post l_post_bright  ")[i].innerHTML = "「神友と水軍作業」"
                                    }
                                }
                            }
                            document.getElementsByClassName("l_post j_l_post l_post_bright  ")[i].innerHTML = tiebaComment[i].innerHTML.replace(/免死金牌/g,'')
                            document.getElementsByClassName("l_post j_l_post l_post_bright  ")[i].innerHTML = tiebaComment[i].innerHTML.replace(/🌳/g,'🥦')
                        }
                        changed = true
                        console.log("after changed:"+changed)
                    }
                    else
                    {
                        location.reload();
                    }
                }
                else if(loc=="知乎")
                {
                    var plqlen = document.getElementsByClassName("Button css-1evwjhc").length
                    if(plqlen>1)
                    {
                        //alert('为了减少处理时间，请折叠多余的评论区')
                        for(let i=0;i<plqlen-1;i++)
                        {
                            document.getElementsByClassName("css-p1wstz")[i].style.cssText = "width:100%;"
                            document.getElementsByClassName("Button css-1evwjhc")[i].style.cssText = "width:calc(100% - 60px);color:red;background-color:pink;height:50px;"
                        }
                    }
                    var min = -1
                    if(len>50 && plqlen>1)
                    {
                        min = len-51
                    }
                    for(let i=len-1;i>min;i--)//为了避免评论过多(没有折叠前面的回答的评论区)导致时间开销无法接受，现在只替换最后50条评论（通常覆盖了最后一个回答的评论区）。
                    {
                        for(let j=0;j<badword.length;j++)
                        {
                            let bad = new RegExp(badword[j],'g');
                            let yygq = new RegExp('(\\\['+badword[j]+'|'+badword[j]+'\\\]|[(\u4e00-\u9fa5)(\u3001|\uff1b|\uff0c|\u3002|\uff01|\uff1f|\u300a|\u300b)]{'+mg+',}'+badword[j]+'|'+badword[j]+'[(\u4e00-\u9fa5)(\u3001|\uff1b|\uff0c|\u3002|\uff01|\uff1f|\u300a|\u300b)]{'+mg+',})','g')
                            document.getElementsByClassName("CommentContent")[i].innerHTML = zhihuComment[i].innerHTML.replace(yygq,'$1免死金牌')
                            if(zhihuComment[i].innerHTML.search(zhbq) != -1)
                            {
                                document.getElementsByClassName("CommentContent")[i].innerHTML = "「阴阳人の怪話」"
                            }else if((parseInt(zhihuComment[i].innerHTML.split("？").length) - 1)>3)//一个评论中使用超过3个问号
                            {
                                document.getElementsByClassName("CommentContent")[i].innerHTML = "「急急國王の碎念」"
                            }
                            else
                            {
                                document.getElementsByClassName("CommentContent")[i].innerHTML = zhihuComment[i].innerHTML.replace(bad,'🌳')
                                if(zhihuComment[i].innerHTML.indexOf('🌳') != -1 && zhihuComment[i].innerHTML.indexOf("免死金牌") == -1)
                                {
                                    document.getElementsByClassName("CommentContent")[i].innerHTML = "「神友と水軍作業」"
                                }
                            }
                        }
                        //所有badword查询完毕，再去掉所有的免死金牌
                        document.getElementsByClassName("CommentContent")[i].innerHTML = zhihuComment[i].innerHTML.replace(/免死金牌/g,'')
                        document.getElementsByClassName("CommentContent")[i].innerHTML = zhihuComment[i].innerHTML.replace(/🌳/g,'🥦')
                    }
                }
                else if(loc=="微博首页")
                {
                    for(let i=0;i<len;i++)//由于微博采用瀑布流，所以不能取最后50条评论。
                    {
                        //一级评论处理
                        for(let j=0;j<badword.length;j++)
                        {
                            let bad = new RegExp(badword[j],'g')
                            //因为微博有alt=[拳头]、alt=[跪了]等表情，一旦出现将会错误判断为神友，所以需要额外赋予免死金牌
                            let yygq = new RegExp('(\\\['+badword[j]+'|'+badword[j]+'\\\]|[(\u4e00-\u9fa5)(\u3001|\uff1b|\uff0c|\u3002|\uff01|\uff1f|\u300a|\u300b)]{'+mg+',}'+badword[j]+'|'+badword[j]+'[(\u4e00-\u9fa5)(\u3001|\uff1b|\uff0c|\u3002|\uff01|\uff1f|\u300a|\u300b)]{'+mg+',})','g')
                            //先发免死金牌
                            document.getElementsByClassName("wbpro-list")[i].getElementsByClassName("con1 woo-box-item-flex")[0].innerHTML = weibo1Comment[i].getElementsByClassName("con1 woo-box-item-flex")[0].innerHTML.replace(yygq,'$1免死金牌')
                            if(weibo1Comment[i].getElementsByClassName("con1 woo-box-item-flex")[0].innerHTML.search(wbbq) != -1)
                            {
                                document.getElementsByClassName("wbpro-list")[i].getElementsByClassName("con1 woo-box-item-flex")[0].innerHTML = "「阴阳人の怪話」"
                            }
                            else if((parseInt(weibo1Comment[i].getElementsByClassName("con1 woo-box-item-flex")[0].innerHTML.split("？").length) - 1)>3)
                            {
                                document.getElementsByClassName("wbpro-list")[i].getElementsByClassName("con1 woo-box-item-flex")[0].innerHTML = "「急急國王の碎念」"
                            }
                            else
                            {
                                document.getElementsByClassName("wbpro-list")[i].getElementsByClassName("con1 woo-box-item-flex")[0].innerHTML = weibo1Comment[i].getElementsByClassName("con1 woo-box-item-flex")[0].innerHTML.replace(bad,'🌳')
                                //有敏感词,且没有免死金牌
                                if(weibo1Comment[i].getElementsByClassName("con1 woo-box-item-flex")[0].innerHTML.indexOf('🌳') != -1 && weibo1Comment[i].getElementsByClassName("con1 woo-box-item-flex")[0].innerHTML.indexOf("免死金牌") == -1)
                                {
                                    document.getElementsByClassName("wbpro-list")[i].getElementsByClassName("con1 woo-box-item-flex")[0].innerHTML = "「神友と水軍作業」"
                                }
                            }
                        }
                        document.getElementsByClassName("wbpro-list")[i].getElementsByClassName("con1 woo-box-item-flex")[0].innerHTML = weibo1Comment[i].getElementsByClassName("con1 woo-box-item-flex")[0].innerHTML.replace(/免死金牌/g,'')
                        document.getElementsByClassName("wbpro-list")[i].getElementsByClassName("con1 woo-box-item-flex")[0].innerHTML = weibo1Comment[i].getElementsByClassName("con1 woo-box-item-flex")[0].innerHTML.replace(/🌳/g,'🥦')

                        //2级评论处理
                        let weiboSecondComment = weibo1Comment[i].getElementsByClassName("item2")//一条“wbpro-list”一级评论下有多条次级评论
                        let item2 = weiboSecondComment.length
                        //如果只有一条次级评论，则最后一条item2将不是“展开次级评论”，而是这条次级评论本身。但在详情页有可能item2仅有一个，且就是展开次级评论。
                        if(item2==1 && weiboSecondComment[0].innerHTML.search(/共[0-9]+条回复/g)==-1)
                        {
                            item2++
                        }
                        for(let k=0;k<item2-1;k++)//最后一条item2是展开次级评论，不要动
                        {
                            for(let j=0;j<badword.length;j++)
                            {
                                let bad = new RegExp(badword[j],'g')
                                let yygq = new RegExp('(\\\['+badword[j]+'|'+badword[j]+'\\\]|[(\u4e00-\u9fa5)(\u3001|\uff1b|\uff0c|\u3002|\uff01|\uff1f|\u300a|\u300b)]{'+mg+',}'+badword[j]+'|'+badword[j]+'[(\u4e00-\u9fa5)(\u3001|\uff1b|\uff0c|\u3002|\uff01|\uff1f|\u300a|\u300b)]{'+mg+',})','g')
                                //发免死金牌是在：评论包含敏感词，但说的内容足够多。要杀：含敏感词且说的内容太少。
                                document.getElementsByClassName("wbpro-list")[i].getElementsByClassName("item2")[k].innerHTML = weiboSecondComment[k].innerHTML.replace(yygq,'$1免死金牌')
                                if(weiboSecondComment[k].innerHTML.search(wbbq) != -1)
                                {
                                    document.getElementsByClassName("wbpro-list")[i].getElementsByClassName("item2")[k].innerHTML = "「阴阳人の怪話」"
                                }
                                else if((parseInt(weiboSecondComment[k].innerHTML.split("？").length) - 1)>3)
                                {
                                    document.getElementsByClassName("wbpro-list")[i].getElementsByClassName("item2")[k].innerHTML = "「急急國王の碎念」"
                                }
                                else
                                {
                                    document.getElementsByClassName("wbpro-list")[i].getElementsByClassName("item2")[k].innerHTML = weiboSecondComment[k].innerHTML.replace(bad,'🌳')
                                    //有敏感词且没有免死金牌，判定为水军
                                    if(weiboSecondComment[k].innerHTML.indexOf('🌳') != -1 && weiboSecondComment[k].innerHTML.indexOf("免死金牌") == -1)
                                    {
                                        document.getElementsByClassName("wbpro-list")[i].getElementsByClassName("item2")[k].innerHTML = "「神友と水軍作業」"
                                    }
                                }
                            }
                            document.getElementsByClassName("wbpro-list")[i].getElementsByClassName("item2")[k].innerHTML = weiboSecondComment[k].innerHTML.replace(/免死金牌/g,'')
                            document.getElementsByClassName("wbpro-list")[i].getElementsByClassName("item2")[k].innerHTML = weiboSecondComment[k].innerHTML.replace(/🌳/g,'🥦')
                        }

                    }
                }
                else if(loc=="微博搜索结果页")
                {
                    for(let i=0;i<len;i++)//由于微博采用瀑布流，所以不能取最后50条评论。
                    {
                        for(let j=0;j<badword.length;j++)
                        {
                            let bad = new RegExp(badword[j],'g')
                            let yygq = new RegExp('(\\\['+badword[j]+'|'+badword[j]+'\\\]|[(\u4e00-\u9fa5)(\u3001|\uff1b|\uff0c|\u3002|\uff01|\uff1f|\u300a|\u300b)]{'+mg+',}'+badword[j]+'|'+badword[j]+'[(\u4e00-\u9fa5)(\u3001|\uff1b|\uff0c|\u3002|\uff01|\uff1f|\u300a|\u300b)]{'+mg+',})','g')
                            document.getElementsByClassName("card-review s-ptb10")[i].innerHTML = weibo2Comment[i].innerHTML.replace(yygq,'$1免死金牌')
                            if(weibo2Comment[i].innerHTML.search(wbbq) != -1)
                            {
                                document.getElementsByClassName("card-review s-ptb10")[i].innerHTML = "「阴阳人の怪話」"
                            }
                            else if((parseInt(weibo2Comment[i].innerHTML.split("？").length) - 1)>3)
                            {
                                document.getElementsByClassName("card-review s-ptb10")[i].innerHTML = "「急急國王の碎念」"
                            }
                            else
                            {
                                document.getElementsByClassName("card-review s-ptb10")[i].innerHTML = weibo2Comment[i].innerHTML.replace(bad,'🌳')
                                if(weibo2Comment[i].innerHTML.indexOf('🌳') != -1 && weibo2Comment[i].innerHTML.indexOf("免死金牌") == -1)
                                {
                                    document.getElementsByClassName("card-review s-ptb10")[i].innerHTML = "「神友と水軍作業」"
                                }
                            }
                        }
                        document.getElementsByClassName("card-review s-ptb10")[i].innerHTML = weibo2Comment[i].innerHTML.replace(/免死金牌/g,'')
                        //🌳换成🥦，是为了避免重复按ctrl+x键，将所有含敏感词言论最终都判定为神友
                        document.getElementsByClassName("card-review s-ptb10")[i].innerHTML = weibo2Comment[i].innerHTML.replace(/🌳/g,'🥦')
                    }
                }
            }
        }

    })

})();

//我知道这代码质量很差，但闭上眼睛当作黑盒来使用的话——其实也还彳亍吧？

